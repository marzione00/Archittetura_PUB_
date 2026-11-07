'use strict';

(() => {
  const quantita = (id, label, min, max, iniziale, step = 1) => ({id, label, min, max, step, iniziale});
  const scelta = (id, label, opzioni, iniziale = opzioni[0][0]) => ({id, label, opzioni, iniziale});
  const bit = (id, label, iniziale = 0) => quantita(id, label, 0, 1, iniziale);
  const passo = (titolo, testo, valori) => ({titolo, testo, valori});
  const hex = (n, cifre = 2) => '0x' + n.toString(16).toUpperCase().padStart(cifre, '0');
  const bin = (n, cifre) => n.toString(2).padStart(cifre, '0');
  const dec = n => Number(n.toFixed(3)).toLocaleString('it-IT');
  const unita = (id, domanda, controlli, calcola, previsione) => {
    SL.unita[id] = {teoria: SL.lezioni[id].join(' '), domanda, controlli, calcola, previsione};
  };
  function segnale(chiave, label = chiave, indice = -1, formato) {
    return {label, formato, valore:(_p,stati)=>Object.fromEntries(stati.at(indice).valori)[chiave]};
  }
  const segno8 = n => n < 128 ? n : n - 256;
  const cc = (z, s, o) => 'ZF=' + Number(z) + ' · SF=' + Number(s) + ' · OF=' + Number(o);
  const stadi = ['F', 'D', 'E', 'M', 'W'];

  unita('3.1.1',    'Quale valore assume l’uscita e quali coppie lo determinano?', [bit('a','A',1),bit('b','B'),bit('c','C',1)], ({a,b,c}) => [
      passo('Ingressi','Le tre posizioni identificano una riga della tabella di verità.',[['ABC',''+a+b+c],['Ingressi alti',a+b+c]]),
      passo('Porte AND','Ogni coppia richiede due ingressi alti.',[['AB',a&b],['AC',a&c],['BC',b&c]]),
      passo('Porta OR','La maggioranza coincide con il confronto fra il conteggio degli ingressi alti e la soglia due.',[['Uscita',(a&b)|(a&c)|(b&c)],['Soglia',2]]) ], segnale('Uscita','Bit di maggioranza'));

  unita('3.1.2',    'Quale parola appare in uscita per i valori assegnati a S1 e S0?', [
    ...[3,8,5,13].map((v,i)=>quantita('x'+i,'Ingresso I'+i,0,15,v)),quantita('s','Selettore',0,3,2)], p => {
    const s0=p.s&1, s1=p.s>>1, sin=p['x'+s0], des=p['x'+(2+s0)];
    return [passo('Decodifica','Leggi il selettore dal bit più significativo al meno significativo.',[['S1 S0',bin(p.s,2)],['I0… I3',[p.x0,p.x1,p.x2,p.x3].join(' · ')]]),
      passo('Primo livello','Entrambi i selettori di coppia ricevono S0.',[['Coppia I0/I1',sin],['Coppia I2/I3',des]]),
      passo('Secondo livello','S1 instrada la parola della coppia selezionata.',[['Ingresso','I'+p.s],['Uscita',s1?des:sin]])]; }, segnale('Uscita','Valore della parola selezionata'));

  unita('3.1.3',    'Quali quattro bit restano nel registro e dove termina la propagazione del riporto?', [
    quantita('a','Parola A',0,15,9),quantita('b','Parola B',0,15,11),bit('c','Riporto iniziale')], ({a,b,c})=>{
    const trace=[passo('Parole a quattro bit','Si parte dalla colonna di peso uno.',[['A',bin(a,4)],['B',bin(b,4)],['C0',c]])]; let riporto=c;
    for(let i=0;i<4;i++){const x=(a>>i)&1,y=(b>>i)&1,t=x+y+riporto;
      trace.push(passo('Colonna '+i,'La somma locale '+x+' + '+y+' + '+riporto+' vale '+t+'. Si conserva il bit basso e si propaga il bit alto.',[['S'+i,t&1],['C'+(i+1),t>>1]])); riporto=t>>1; }
    trace.push(passo('Risultato','Ricostruisci il totale assegnando peso 16 al riporto finale.',[['Somma',bin((a+b+c)&15,4)],['C4',riporto],['Totale',a+b+c]])); return trace; });

  const alu8 = (f,a,b) => ({add:(a+b)&255,sub:(b-a)&255,and:a&b,xor:a^b})[f];
  const funzioni = [['add','Somma B + A'],['sub','Differenza B − A'],['and','AND bit a bit'],['xor','XOR bit a bit']];
  unita('3.1.4',    'Quale byte raggiunge l’uscita dell’ALU con la funzione scelta?', [quantita('a','Operando A',0,255,3),quantita('b','Operando B',0,255,1),scelta('f','Funzione',funzioni)],({a,b,f})=>{
    const r=alu8(f,a,b); return [passo('Decodifica','Il codice assegna una delle quattro operazioni agli ingressi A e B.',[['Controllo',funzioni.findIndex(v=>v[0]===f)],['A',hex(a)],['B',hex(b)]]),
      passo('Risultati candidati','I quattro rami calcolano parole della stessa larghezza.',funzioni.map(([k,t])=>[t,hex(alu8(k,a,b))])),
      passo('Uscita selezionata','Il rilevatore di zero raccoglie tutti gli otto bit del risultato.',[['Risultato',hex(r)],['ZF',Number(r===0)]])]; }, segnale('Risultato','Byte in uscita (0x…)'));

  unita('3.1.5',    'Entro quanti picosecondi dall’applicazione degli ingressi è garantita stabile l’uscita?', [quantita('and','Ritardo AND (ps)',10,100,30),quantita('xor','Ritardo XOR (ps)',10,100,65),quantita('or','Ritardo OR (ps)',5,60,20)],p=>[
      passo('Variazione degli ingressi','I quattro ingressi possono cambiare all’istante zero.',[['Ramo sinistro','AND'],['Ramo destro','XOR']]),
      passo('Arrivo ai due ingressi OR','I due rami si propagano in parallelo.',[['Sinistra (ps)',p.and],['Destra (ps)',p.xor]]),
      passo('Uscita stabile','Al tempo di arrivo peggiore si aggiunge il ritardo della porta OR. Un eventuale registro ricevente richiede anche il proprio tempo di setup.',[['Cammino critico',p.and===p.xor?'Entrambi':p.and>p.xor?'AND → OR':'XOR → OR'],['Ritardo massimo (ps)',Math.max(p.and,p.xor)+p.or]]) ], segnale('Ritardo massimo (ps)'));

  unita('3.1.6',    'Quale valore assume OF confrontando la somma con segno con l’intervallo rappresentabile?', [quantita('a','Operando A',0,255,127),quantita('b','Operando B',0,255,1)],({a,b})=>{
    const sum=a+b, r=sum&255, signed=segno8(a)+segno8(b);
    const c4=((a&15)+(b&15))>>4, ah=a>>4,bh=b>>4, prop=(ah^bh)===15, genera=ah+bh>=16; return [
      passo('Due letture','Il bit più significativo contribuisce per +128 alla lettura senza segno e per −128 alla lettura in complemento a due.',[['A senza / con segno',a+' / '+segno8(a)],['B senza / con segno',b+' / '+segno8(b)]]),
      passo('Somma estesa','Il nono bit è il riporto uscente. Gli otto bit inferiori entrano nel registro.',[['Somma a nove bit',bin(sum,9)],['Risultato',hex(r)],['CF',sum>>8]]),
      passo('Riporto per gruppi','Il gruppo alto genera G se la sua somma supera 15. Propaga P se tutti i suoi bit sono propaganti (XOR pari a 1111). Il riporto finale è G OR (P AND C4).',[['Riporto dei quattro bit bassi C4',c4],['G alto',Number(genera)],['P alto',Number(prop)],['Riporto anticipato',Number(genera||(prop&&c4))]]),
      passo('Verifica con segno','Confronta la somma matematica con l’intervallo da −128 a 127.',[['Somma matematica',signed],['Lettura del risultato',segno8(r)],['OF',Number(signed< -128||signed>127)]])]; }, segnale('OF','Flag OF (0 o 1)'));

  unita('3.2.1',    'Quale parola conserva il secondo registro dopo il fronte?', [quantita('a','Q iniziale del primo registro',0,15,3),quantita('b','Q iniziale del secondo registro',0,15,12),quantita('d','Dato comune D',0,15,7),bit('en','Carica')],({a,b,d,en})=>[
      passo('Prima del fronte','Le uscite provengono dalle celle di stato.',[['Q1',bin(a,4)],['Q2',bin(b,4)]]),
      passo('Selettore di ingresso',en?'È aperto il percorso dal bus D.':'La retroazione riporta ciascuna uscita al proprio ingresso.',[['Carica',en],['D comune',bin(d,4)]]),
      passo('Dopo il fronte','Leggi i due registri dopo il ritardo di propagazione del clock.',[['Q1',bin(en?d:a,4)],['Q2',bin(en?d:b,4)]]) ], segnale('Q2','Q del secondo registro, quattro bit',-1,'bits'));

  unita('3.2.2',    'Durante il livello alto, quale valore assume Q del latch quando D cambia?', [bit('q','Stato iniziale'),bit('d','Dato al primo fronte',1),bit('e','Dato durante il livello alto')],({q,d,e})=>{
    let clk=0,latch=q,ff=q; return [[0,d,'Preparazione'],[1,d,'Fronte di salita'],[1,e,'Clock alto'],[0,e,'Chiusura del latch'],[0,1-e,'Dato variato a clock basso'],[1,1-e,'Secondo fronte']].map(([k,x,title])=>{
      if(k) latch=x; if(k&&!clk) ff=x; clk=k;
      return passo(title,title==='Chiusura del latch'?'Il clock scende mentre D è ancora stabile. Il latch trattiene il valore presente alla chiusura.':title==='Dato variato a clock basso'?'Trascorso il tempo di hold, D cambia a clock basso. Le uscite conservano i valori acquisiti.':'D è stabile attorno ai fronti. Confronta il dato e le due uscite dopo ogni evento.',[['Clock',k],['D',x],['Q latch',latch],['Q flip-flop',ff]]); }); }, segnale('Q latch','Q del latch a clock già alto',2));

  unita('3.2.3',    'Quale parola legge la porta B dopo il fronte di scrittura?', [quantita('a','Indirizzo di lettura A',0,3,1),quantita('b','Indirizzo di lettura B',0,3,2),quantita('w','Indirizzo di scrittura',0,3,2),quantita('v','Dato da scrivere',0,31,21),bit('en','Abilita scrittura',1)],p=>{
    const bank=[2,5,11,13], a=bank[p.a], b=bank[p.b], old=bank[p.w]; if(p.en)bank[p.w]=p.v;
    return [passo('Letture prima del fronte','Contenuto iniziale di R0…R3 uguale a 2, 5, 11, 13.',[['Porta A',a],['Porta B',b]]),
      passo('Scrittura sincrona',p.en?'Il decodificatore abilita una sola parola.':'Tutte le abilitazioni di scrittura valgono zero.',[['Destinazione','R'+p.w],['Dato sul bus',p.v],['Valore precedente',old]]),
      passo('Letture dopo il fronte','Le porte di lettura mantengono gli indirizzi scelti.',[['Porta A',bank[p.a]],['Porta B',bank[p.b]],['Banco R0…R3',bank.join(' · ')]])]; }, segnale('Porta B','Parola letta da B dopo il fronte'));

  unita('3.2.4',    'Qual è il margine di hold del percorso più veloce?', [quantita('t','Periodo (ps)',50,250,120),quantita('max','Logica, ritardo massimo (ps)',40,160,65),quantita('min','Logica, ritardo minimo (ps)',0,32,8)],p=>{
    const setup=30+p.max+15, hold=12+p.min-18; return [
      passo('Lancio','Il dato può partire fra 12 e 30 ps dal fronte di lancio.',[['Skew (ps)',0],['Setup richiesto (ps)',15],['Hold richiesto (ps)',18]]),
      passo('Percorso lento','Al ritardo massimo clock→Q si aggiungono logica e setup.',[['Periodo minimo (ps)',setup],['Margine setup (ps)',p.t-setup]]),
      passo('Percorso veloce','Un margine negativo segnala una violazione. Il confronto di hold riguarda il fronte corrente.',[['Arrivo più precoce (ps)',12+p.min],['Margine hold (ps)',hold],['Esito',p.t>=setup&&hold>=0?'Entrambi i vincoli rispettati':'Vincolo temporale violato']])]; }, segnale('Margine hold (ps)'));

  unita('3.2.5',    'Quale credito rimane al termine del terzo ingresso?', [quantita('q','Credito iniziale',0,2,0),...[2,2,1].map((v,i)=>quantita('m'+i,'Moneta '+(i+1)+' (0 = attesa)',0,2,v))],p=>{
    let q=p.q; return [0,1,2].map(i=>{const m=p['m'+i],s=q+m,old=q; q=s===3?0:s>3?q:s;
      return passo('Ingresso '+(i+1),s===3?'Il credito raggiunge tre unità. Il distributore eroga un prodotto e azzera il credito.':s>3?'Il totale supera il prezzo. Il distributore restituisce la moneta.':m?'La moneta incrementa il credito.':'L’assenza di moneta conserva lo stato.',[['Credito prima',old],['Moneta',m],['Credito dopo',q],['Eroga',Number(s===3)],['Restituisce',Number(s>3)]]); }); }, segnale('Credito dopo','Credito dopo il terzo ingresso'));

  const basePC = quantita('pc','PC iniziale',0,512,64);
  const isa = {
    halt:{op:0x00,len:1,reg:null}, nop:{op:0x10,len:1,reg:null},
    rrmovq:{op:0x20,len:2,reg:0x03}, irmovq:{op:0x30,len:10,reg:0xf3},
    rmmovq:{op:0x40,len:10,reg:0x03}, mrmovq:{op:0x50,len:10,reg:0x03},
    addq:{op:0x60,len:2,reg:0x03}, subq:{op:0x61,len:2,reg:0x03},
    andq:{op:0x62,len:2,reg:0x03}, xorq:{op:0x63,len:2,reg:0x03},
    jne:{op:0x74,len:9,reg:null}, call:{op:0x80,len:9,reg:null}, ret:{op:0x90,len:1,reg:null}
  };
  const elenco = (...nomi) => nomi.map(k=>[k,k]);
  const little = n => Array.from({length:8},(_,i)=>Number((BigInt(n)>>BigInt(8*i))&255n));
  const byteStr = xs => xs.map(x=>hex(x).slice(2)).join(' ');
  unita('3.3.1',    'Quale valore viene scritto in %rbx dopo l’istruzione scelta?', [scelta('op','Istruzione',elenco('addq','rrmovq')),quantita('a','%rax',-50,50,7),quantita('b','%rbx',-50,50,-7),basePC],p=>{
    const add=p.op==='addq', r=add?p.a+p.b:p.a; return [
      passo('Stato architetturale','Entrambe le istruzioni usano il byte dei registri 03. L’intervallo dei dati scelti mantiene la somma entro una parola con segno a 64 bit.',[['PC',hex(p.pc)],['%rax',p.a],['%rbx',p.b],['CC iniziali',cc(0,0,0)]]),
      passo('Effetto descritto dall’ISA',add?'La somma usa %rax e il vecchio %rbx e scrive il risultato in %rbx.':'La sorgente viene copiata nella destinazione.',[['Istruzione',p.op+' %rax, %rbx'],['Risultato',r]]),
      passo('Stato successivo','Si passa all’istruzione successiva dopo due byte. La memoria conserva il suo contenuto.',[['PC',hex(p.pc+2)],['%rax',p.a],['%rbx',r],['CC',add?cc(r===0,r<0,0):cc(0,0,0)]])]; }, segnale('%rbx','Valore finale di %rbx'));

  unita('3.3.2',    'Qual è l’indirizzo valP dopo aver prelevato tutti i byte dell’istruzione?', [scelta('op','Istruzione',elenco('irmovq','xorq','jne','ret')),basePC,quantita('k','Costante per irmovq e jne',0,4095,291)],p=>{
    const x=isa[p.op],has=x.len>=9,bytes=[x.op,...(x.reg===null?[]:[x.reg]),...(has?little(p.k):[])];
    return [passo('Primo byte','Separando i due nibble si individuano classe e funzione.',[['Byte',hex(x.op)],['icode',x.op>>4],['ifun',x.op&15]]),
      passo('Campi restanti','I campi presenti seguono il formato della classe selezionata.',[['Byte rA:rB',x.reg===null?'Assente':hex(x.reg)],['valC',has?hex(p.k):'Assente'],['Sequenza',byteStr(bytes)]]),
      passo('Confine','Aggiungi al PC il numero di byte effettivamente prelevati.',[['PC',hex(p.pc)],['Byte',bytes.length],['valP',hex(p.pc+bytes.length)]])]; }, segnale('valP','PC sequenziale (0x…)'));

  unita('3.3.3',    'Quale parola a 64 bit viene caricata in %rax?', [quantita('b','Base %rbx',8,32,16),quantita('d','Spostamento con segno',-8,16,4)],p=>{
    const addr=p.b+p.d,bytes=Array.from({length:8},(_,i)=>(addr+i)*3&255),v=bytes.slice().reverse().reduce((v,x)=>v*256n+BigInt(x),0n);
    return [passo('Decodifica','Si esegue mrmovq D(%rbx), %rax al PC 0x40. Nella memoria il byte all’indirizzo i vale (3 × i) modulo 256.',[['valB',p.b],['valC',p.d]]),
      passo('Accesso','Gli otto indirizzi consecutivi iniziano da valE = valB + valC.',[['valE',hex(addr)],['Byte in ordine di indirizzo',byteStr(bytes)]]),
      passo('Scrittura','Il byte all’indirizzo minore è il meno significativo della parola.',[['%rax = valM',hex(v,16)],['PC successivo','0x4A']])]; }, segnale('%rax = valM','Parola caricata in %rax (0x…)'));

  unita('3.3.4',    'Quale stato produce l’istruzione, tenendo conto dell’eventuale lettura dati?', [scelta('op','Istruzione da prelevare',[['ld','50 · mrmovq'],['halt','00 · halt'],['bad','F0 · classe riservata']]),quantita('addr','Indirizzo effettivo della lettura',0,63,59)],p=>{
    const load=p.op==='ld', over=p.addr+7>=64,stat=load?(over?'ADR':'AOK'):p.op==='bad'?'INS':'HLT';
    return [passo('Prelievo','La memoria istruzioni fornisce una codifica completa al PC zero.',[['Primo byte',load?'0x50':p.op==='halt'?'0x00':'0xF0'],['Memoria dati','0…63']]),
      passo('Controlli locali',load?'La lettura richiede otto indirizzi validi.':p.op==='halt'?'Il codice completo 0x00 richiede l’arresto.':'Il decodificatore incontra una classe riservata.',[['Ultimo byte richiesto',load?p.addr+7:'Nessun accesso'],['Errore dati',Number(load&&over)]]),
      passo('Stato architetturale','La scrittura del registro destinazione avviene solo dopo una lettura conclusa correttamente.',[['Stat',stat],['Scrittura di valM',Number(load&&!over)]])]; }, segnale('Stat','Stato finale (AOK, HLT, INS o ADR)'));

  unita('3.3.5',    'Da quale indirizzo riprende il prelievo dopo ret?', [basePC,quantita('sp','%rsp iniziale',128,256,192,8),quantita('t','Indirizzo della subroutine',768,900,800)],p=>{
    const sp=p.sp-8, r=p.pc+9; return [
      passo('Prelievo della call','La destinazione occupa gli otto byte dopo il codice di call. La subroutine contiene soltanto ret.',[['PC',hex(p.pc)],['valP',hex(r)],['Destinazione',hex(p.t)]]),
      passo('Ingresso nella subroutine','call decrementa %rsp prima di depositare valP.',[['%rsp',hex(sp)],['M8['+hex(sp)+']',hex(r)],['PC',hex(p.t)]]),
      passo('Ritorno','ret legge dalla vecchia cima e poi libera la parola.',[['Indirizzo letto',hex(sp)],['PC',hex(r)],['%rsp',hex(p.sp)]])]; }, segnale('PC','PC dopo ret (0x…)'));

  unita('3.3.6',    'Qual è il PC raggiunto dal salto all’etichetta fine?', [basePC,quantita('n','nop fra jmp e destinazione',0,12,3)],p=>{
    const j=p.pc+10,target=j+9+p.n; return [
      passo('Prima passata','Il programma inizia con irmovq $1,%rax (10 byte), poi jmp fine (9 byte), la sequenza di nop e fine: halt.',[['irmovq',hex(p.pc)],['jmp',hex(j)],['Numero di nop',p.n]]),
      passo('Tabella dei simboli','L’etichetta indica il primo byte di halt e occupa zero byte.',[['fine',hex(target)],['Caduta sequenziale del jmp',hex(j+9)]]),
      passo('Seconda passata','Il codice 70 precede il campo little-endian della destinazione assoluta.',[['Byte del jmp',byteStr([0x70,...little(target)])],['PC dopo il salto',hex(target)]])]; }, segnale('PC dopo il salto','Destinazione di jmp (0x…)'));

  unita('3.4.1',    'Quale valore acquisisce %rbx quando termina subq %rax,%rbx?', [basePC,quantita('a','%rax',-30,30,9),quantita('b','%rbx',-30,30,4)],p=>{
    const r=p.b-p.a; return [
      passo('Prelievo','I due byte specificano sottrazione, sorgente e destinazione.',[['Byte','61 03'],['valP',hex(p.pc+2)]]),
      passo('Decodifica','Le porte leggono contemporaneamente i registri nello stato iniziale.',[['valA = %rax',p.a],['valB = %rbx',p.b]]),
      passo('Esecuzione','L’ALU calcola valB − valA. Questi operandi mantengono OF a zero.',[['valE',r],['Nuovi CC',cc(r===0,r<0,0)]]),
      passo('Memoria','La classe OPq usa direttamente il risultato dell’ALU.',[['Lettura dati',0],['Scrittura dati',0]]),
      passo('Scrittura e PC al fronte','Il fronte acquisisce insieme registro, codici di condizione e PC.',[['%rbx',r],['CC',cc(r===0,r<0,0)],['PC',hex(p.pc+2)]])]; }, segnale('%rbx','Nuovo valore di %rbx'));

  unita('3.4.2',    'A quale indirizzo viene scritta la parola durante pushq?', [quantita('sp','Vecchio %rsp',32,248,112,8),quantita('v','%rax da salvare',0,255,43)],p=>[
      passo('Porte di lettura','pushq %rax richiede due letture di registro.',[['valA = %rax',p.v],['valB = %rsp',p.sp]]),
      passo('Esecuzione','L’ALU riserva una parola verso gli indirizzi minori.',[['aluA',-8],['aluB',p.sp],['valE',p.sp-8]]),
      passo('Memoria e scrittura dei risultati','Il valore copiato in memoria è valA. Il puntatore riceve valE.',[['Indirizzo',hex(p.sp-8)],['Parola scritta',hex(p.v,16)],['%rsp',hex(p.sp-8)]]) ], segnale('Indirizzo','Indirizzo di scrittura (0x…)'));

  unita('3.4.3',    'Qual è il periodo minimo di clock per i ritardi scelti?', [quantita('fetch','Prelievo (ps)',30,180,85),quantita('mem','Memoria dati del carico (ps)',15,150,95),quantita('mux','Selettore del risultato aritmetico (ps)',10,120,25)],p=>{
    const base=p.fetch+30+45, load=base+p.mem, op=base+p.mux;
    return [passo('Tratto comune','Dopo il prelievo servono 30 ps per leggere i registri e 45 ps per l’ALU.',[['Prelievo (ps)',p.fetch],['Arrivo a valE (ps)',base]]),
      passo('Due percorsi','Dopo l’ALU il carico attraversa la memoria dati, l’operazione aritmetica il selettore del risultato.',[['Aritmetica (ps)',op],['Carico (ps)',load]]),
      passo('Periodo','Si aggiungono 15 ps di margine di registro al percorso più lento.',[['Cammino limitante',op===load?'Entrambi':op>load?'Aritmetica':'Carico'],['Periodo minimo (ps)',Math.max(op,load)+15]])]; }, segnale('Periodo minimo (ps)'));

  unita('3.4.4',    'Quale indirizzo raggiunge la memoria per la pushq o la popq scelta?', [scelta('op','Istruzione',elenco('pushq','popq')),quantita('sp','Vecchio %rsp',32,248,96,8),quantita('v','Valore iniziale di %rax',0,255,19),quantita('m','Parola alla vecchia cima',0,255,87)],p=>{
    const push=p.op==='pushq', next=p.sp+(push?-8:8); return [
      passo('Decodifica','La sorgente usata per la porta dati o per la vecchia cima dipende dalla classe.',[['valA',push?p.v:p.sp],['valB',p.sp],['Vecchia cima',p.m]]),
      passo('Selettore indirizzo',push?'La scrittura usa il puntatore decrementato.':'La lettura usa il puntatore precedente al suo incremento.',[['valE',next],['mem_addr',push?next:p.sp],['mem_read / mem_write',push?'0 / 1':'1 / 0']]),
      passo('Stato dopo il fronte',push?'La memoria alla nuova cima contiene il vecchio %rax.':'La parola letta dalla vecchia cima entra in %rax.',[['%rsp',next],['%rax',push?p.v:p.m],['Valore trasferito',push?p.v:p.m]])]; }, segnale('mem_addr','Indirizzo sulla porta di memoria',1));

  unita('3.4.5',    'Quale macchina conclude per prima il programma scelto?', [quantita('a','Istruzioni aritmetiche',1,16,4),quantita('l','Carichi',1,16,3),quantita('t','Periodo multiciclo (ps)',35,95,55)],p=>{
    const n=p.a+p.l, c=3*p.a+5*p.l,seq=n*240,multi=c*p.t; return [
      passo('Macchina SEQ','Ogni istruzione occupa un periodo di 240 ps.',[['Istruzioni',n],['Tempo SEQ (ps)',seq]]),
      passo('Macchina multiciclo','Ciascun’operazione aritmetica occupa tre cicli, ciascun carico cinque. Le istruzioni si susseguono senza sovrapposizione.',[['Cicli aritmetici',3*p.a],['Cicli di carico',5*p.l],['Totale cicli',c]]),
      passo('Tempo trascorso','La differenza in picosecondi è positiva se il multiciclo termina prima. Il rapporto fra i tempi è mostrato con cinque cifre decimali al più.',[['Tempo multiciclo (ps)',multi],['SEQ − multiciclo (ps)',seq-multi],['Macchina più rapida',seq===multi?'Stesso tempo':multi<seq?'Multiciclo':'SEQ'],['Tempo SEQ / tempo multiciclo',(seq/multi).toLocaleString('it-IT',{maximumFractionDigits:5})]])]; }, segnale('Macchina più rapida','Macchina più rapida (SEQ, multiciclo o stesso tempo)'));

  function occupazione(n,c,k=5) {
    return Array.from({length:k},(_,s)=>{const i=c-s;return i>=1&&i<=n?'I'+i:'—';});
  }
  const tabellaStadi = (nomi,riga)=>nomi.map((s,i)=>[s,riga[i]]);
  unita('3.5.1',    'Quanti cicli separano l’inizio del primo prelievo dalla fine dell’ultimo completamento?', [quantita('k','Stadi',2,8,5),quantita('n','Istruzioni indipendenti',1,16,7),quantita('t','Periodo di clock (ps)',10,100,40)],p=>[
      passo('Ingresso','L’istruzione Ij entra nel ciclo j. Il primo prelievo occupa il ciclo 1.',[['Primo ingresso',1],['Ultimo ingresso',p.n]]),
      passo('Primo completamento','Un’istruzione attraversa tutti gli stadi, uno per periodo.',[['Ciclo del primo completamento',p.k],['Latenza (ps)',p.k*p.t]]),
      passo('Ultimo completamento','Il primo completamento esaurisce la latenza di riempimento. Seguono gli altri N − 1 completamenti, uno per ciclo.',[['Cicli totali',p.k+p.n-1],['Tempo totale (ps)',(p.k+p.n-1)*p.t],['Intervallo a regime (ps)',p.t]]) ], segnale('Cicli totali','Cicli fino all’ultimo completamento'));

  unita('3.5.2',    'Quale istruzione occupa W nel ciclo immediatamente successivo a quello scelto?', [quantita('n','Istruzioni',1,10,5),quantita('c','Ciclo osservato',1,15,4)],p=>
      [p.c-1,p.c,p.c+1].map(c=>passo('Ciclo '+c,c===0?'La pipeline è ancora vuota.':'Il simbolo — indica uno stadio privo di istruzione valida.',tabellaStadi(stadi,occupazione(p.n,c)))) , {label:'Istruzione in W al ciclo successivo (Ij o «vuoto»)',valore:(_p,s)=>{const v=Object.fromEntries(s.at(-1).valori).W;return v==='—'?'vuoto':v;}});

  unita('3.5.3',    'Quanti stalli, prelievi bloccati o annullamenti comporta la condizione scelta?', [scelta('h','Esperimento',[['raw','Carico seguito da un uso'],['bus','Memoria a porta singola'],['j','Salto condizionale']]),scelta('esito','Seconda condizione',[['1','Consumatore dipendente / richieste simultanee / previsione errata'],['0','Consumatore indipendente / richieste separate / previsione corretta']])],p=>{
    const si=p.esito==='1';
    if(p.h==='raw')return [passo('Produzione','mrmovq carica %rax. M produrrà il valore alla fine del prossimo ciclo.',[['E','mrmovq'],['Destinazione','%rax']]),
      passo('Consumo','La prossima istruzione richiede gli operandi per E.',[['D',si?'addq %rax,%rbx':'addq %rcx,%rbx'],['RAW sul carico',Number(si)]]),
      passo('Controllo','Con forwarding da M, un uso immediato aspetta una volta in D.',[['Stalli',+si],['E al prossimo ciclo',si?'Bolla':'addq']])];
    if(p.h==='bus')return [passo('Risorsa','Istruzioni e dati usano un’unica porta di memoria con precedenza ai dati.',[['Capacità','1 accesso per ciclo']]),
      passo('Richieste','Un carico è in M. Il prelievo desiderato è simultaneo oppure rinviato a un intervallo libero.',[['Richieste simultanee',si?2:1],['Porta occupata da','Lettura dati']]),
      passo('Arbitraggio','Durante il servizio dei dati una richiesta di prelievo simultanea deve attendere.',[['Prelievi bloccati',+si],['Causa','Porta di memoria']])];
    return [passo('Previsione','Il prelievo ha seguito la destinazione del salto.',[['Predizione','Preso'],['Risoluzione','E']]),
      passo('Condizione','Lo stadio E calcola la direzione effettiva.',[['Preso realmente',Number(!si)],['Istruzioni più giovani','F e D']]),
      passo('Controllo','Nel modello a cinque stadi, un errore elimina le due operazioni giovani e riprende dal PC sequenziale.',[['Operazioni scartate',si?2:0],['Prossimo cammino',si?'Sequenziale':'Destinazione']])]; }, {label:'Numero di stalli, prelievi bloccati o operazioni scartate',valore:(p,s)=>Object.fromEntries(s.at(-1).valori)[{raw:'Stalli',bus:'Prelievi bloccati',j:'Operazioni scartate'}[p.h]]});

  unita('3.5.4',    'Quanto vale il CPI complessivo del tratto, compresi riempimento e penalità?', [quantita('n','Istruzioni completate',4,64,12),quantita('d','Cicli persi per dati',0,8,2),quantita('b','Cicli persi per salti',0,8,2)],p=>{
    const c=p.n+4+p.d+p.b; return [
      passo('Cicli ideali','Cinque stadi introducono quattro cicli oltre al numero di istruzioni in un tratto inizialmente vuoto.',[['N',p.n],['Cicli ideali',p.n+4]]),
      passo('Penalità disgiunte','Somma gli intervalli persi per dati e per controllo.',[['Dati',p.d],['Controllo',p.b],['Cicli complessivi',c]]),
      passo('Misura','Dividendo per N si ottengono CPI e contributo del riempimento al CPI, arrotondati al millesimo.',[['CPI',dec(c/p.n)],['Quota solo riempimento',dec(4/p.n)]])]; }, segnale('CPI','CPI complessivo, arrotondato al millesimo'));

  function controlloPIPE(load,ret,errato) {
    return {f:load||ret, ds:load, db:errato||(!load&&ret), eb:load||errato};
  }
  function pcPIPE(salto,ritorno,pred,sequenziale,stack) {
    if(salto)return ['M_valA',sequenziale]; if(ritorno)return ['W_valM',stack]; return ['F_predPC',pred];
  }

  unita('3.6.1',    'Quale istruzione sarà in W subito dopo il fronte selezionato?', [quantita('n','Istruzioni in ordine',1,10,6),quantita('c','Ciclo precedente al fronte',1,12,4)],p=>{
    const old=occupazione(p.n,p.c),next=occupazione(p.n,p.c+1);return [
      passo('Durante il ciclo '+p.c,'La sequenza comprende solo operazioni indipendenti. F mostra l’istruzione prelevata nel ciclo.',tabellaStadi(stadi,old)),
      passo('Ingressi dei registri','Le quattro etichette provengono dagli stadi immediatamente precedenti.',tabellaStadi(['Ingresso D','Ingresso E','Ingresso M','Ingresso W'],old.slice(0,4))),
      passo('Dopo il fronte','Il prelievo passa al prossimo indirizzo e i quattro registri mostrano gli ingressi acquisiti.',tabellaStadi(stadi,next))]; }, {label:'Istruzione in W dopo il fronte (Ij o «vuoto»)',valore:(_p,s)=>{const v=Object.fromEntries(s.at(-1).valori).W;return v==='—'?'vuoto':v;}});

  unita('3.6.2',    'Quale indirizzo usa il prelievo con i due segnali di controllo scelti?', [bit('j','M contiene un salto con condizione falsa'),bit('r','W contiene ret',1),quantita('p','PC predetto',0,255,64),quantita('m','PC sequenziale salvato',0,255,98),quantita('w','Indirizzo letto dalla pila',0,255,150)],p=>{
    const [s,v]=pcPIPE(p.j,p.r,p.p,p.m,p.w);return [
      passo('Ingressi candidati','Gli indirizzi appartengono ai rispettivi stadi nello stesso intervallo di clock.',[['F_predPC',hex(p.p)],['M_valA',hex(p.m)],['W_valM',hex(p.w)]]),
      passo('Condizioni del selettore','I bit possono essere forzati indipendentemente per verificare la priorità della rete.',[['M_jXX e condizione falsa',p.j],['W_ret',p.r]]),
      passo('Accesso alle istruzioni','Il prelievo usa l’indirizzo del primo ramo applicabile.',[['Sorgente',s],['f_pc',hex(v)]])]; }, segnale('f_pc','PC di prelievo (0x…)'));

  unita('3.6.3',    'Quale valore raggiunge d_valA quando D richiede %rax?', [scelta('e','Istruzione in E',[['op','addq che scrive %rax'],['cmov','cmov con condizione falsa'],['altra','addq che scrive %rbx']]),scelta('m','Istruzione in M',[['load','mrmovq verso %rax'],['op','OPq verso %rax'],['altra','nop']]),quantita('v','Risultato ALU in E',0,255,52)],p=>{
    const candidati=[[p.e==='op','e_valE',p.v],[p.m==='load','m_valM',93],[p.m==='op','M_valE',74],[true,'W_valE',31]];
    const preso=candidati.find(x=>x[0]); return [
      passo('Lettura originaria','D richiede %rax. In W un’istruzione precedente scrive 31 nello stesso registro.',[['Banco prima della scrittura',12],['W_valE',31]]),
      passo('Confronti','La ricerca parte dallo stadio E. Una cmov fallita ha e_dstE = RNONE.',[['Destinazione E',p.e==='op'?'%rax':p.e==='cmov'?'RNONE':'%rbx'],['Destinazione M',p.m==='altra'?'RNONE':'%rax'],['Risultato in M',p.m==='load'?93:p.m==='op'?74:'—']]),
      passo('Dato inoltrato','Il primo confronto valido determina il dato inviato all’ingresso di E.',[['Sorgente',preso[1]],['d_valA',preso[2]]])]; }, segnale('d_valA','Valore inoltrato alla porta A di D'));

  unita('3.6.4',    'Da quale indirizzo viene prelevata la prossima istruzione dopo la risoluzione del salto?', [bit('t','Condizione vera'),quantita('b','Indirizzo del salto',0,128,64),quantita('target','Destinazione predetta',256,512,384)],p=>{
    const cor=p.b+9;return [
      passo('Salto in E','jXX occupa nove byte. D contiene la prima istruzione P0 del cammino predetto e F preleva P1, un byte dopo P0 (nop).',[['PC di jXX',hex(p.b)],['D = P0',hex(p.target)],['F = P1',hex(p.target+1)]]),
      passo('Risoluzione','L’esito di E comanda la sostituzione degli ingressi di D ed E.',[['e_Cnd',p.t],['D_bubble',1-p.t],['E_bubble',1-p.t]]),
      passo('Ciclo seguente',p.t?'Le due nop sul cammino predetto proseguono.':'M_valA fornisce il primo indirizzo sequenziale dopo jXX.',[['E',p.t?'P0':'Bolla'],['D',p.t?'P1':'Bolla'],['f_pc',hex(p.t?p.target+2:cor)]])]; }, segnale('f_pc','Prossimo PC di prelievo (0x…)'));

  unita('3.6.5',    'L’istruzione in E può aggiornare i codici di condizione al fronte successivo?', [scelta('h','Situazione',[['both','E: popq %rsp · D: ret'],['load','E: mrmovq verso %rax · D: addq %rax,%rbx'],['ret','E: addq · D: ret'],['op','E: addq · D: nop']]),scelta('stat','Stato della più anziana istruzione in M',[['ok','AOK'],['adr','ADR da memoria dati']])],p=>{
    const load=p.h==='both'||p.h==='load',ret=p.h==='both'||p.h==='ret',x=controlloPIPE(load,ret,false),fault=p.stat==='adr',op=p.h==='ret'||p.h==='op';
    return [passo('Rilevamento','Nel caso popq %rsp, la destinazione della parola letta coincide con la sorgente %rsp di ret. W ha sempre stato AOK.',[['load/use',+load],['ret in D',+ret],['m_stat',fault?'ADR':'AOK']]),
      passo('Registri giovani','La richiesta di conservare D per il carico ha precedenza sulla bolla che ret chiederebbe in D.',[['F_stall',+x.f],['D_stall',+x.ds],['D_bubble',+x.db],['E_bubble',+x.eb]]),
      passo('Effetti architetturali','Con un errore uscente da M, W acquisisce lo stato terminale, M riceve una bolla e l’ALU più giovane è esclusa dalla scrittura dei flag.',[['M_bubble',+fault],['W_stat al fronte',fault?'ADR':'AOK'],['Scrittura CC',Number(op&&!fault)]])]; }, segnale('Scrittura CC','Abilitazione dei codici di condizione (0 o 1)'));

  // Stato di inizio ciclo. Il carico inoltra il dato da M dopo un solo ciclo di attesa.
  function tracciaCarico(ordine, ripetizioni=1) {
    const istr = Array.from({length:ripetizioni},(_,g)=>{
      const l={id:'L'+(g+1),tipo:'load'}, u={id:'U'+(g+1),tipo:'uso'}, i={id:'I'+(g+1),tipo:'ind'};
      return ordine==='vicino'?[l,u,i]:[l,i,u];
    }).flat();
    const righe=[]; let ip=0,d=null,e=null,m=null,w=null, completate=0;
    while(completate<istr.length) {
      const f=istr[ip]||null,load=e?.tipo==='load'&&d?.tipo==='uso';
      righe.push({c:righe.length+1,stati:[f,d,e,m,w].map(x=>x?x.id:'—'),load:!!load});
      if(w)completate++;
      w=m; m=e; e=load?null:d;
      if(!load){d=f;ip++;}
    }
    return righe;
  }
  const ordini=[['vicino','L · U · I'],['separa','L · I · U']];
  unita('3.6.6',    'Quanti cicli di attesa per dipendenza dal carico compaiono nell’intera sequenza?', [scelta('ordine','Ordine delle tre istruzioni',ordini),quantita('g','Blocchi consecutivi',1,3,1)],p=>{
    const t=tracciaCarico(p.ordine,p.g);return [...t.map(r=>passo('Ciclo '+r.c,r.load?'Dipendenza immediata. F e D si fermano al fronte, E riceve una bolla.':'Le istruzioni valide avanzano al fronte di fine ciclo.',tabellaStadi(stadi,r.stati))),
      passo('Bilancio','Il pedice identifica il blocco di tre istruzioni.',[['Completamenti',3*p.g],['Cicli',t.length],['Attese load/use',t.filter(r=>r.load).length]])]; }, segnale('Attese load/use','Cicli di attesa per dipendenze da carico'));

  unita('3.6.7',    'Quanto tempo risparmia il riordino sul programma completo?', [quantita('g','Ripetizioni L,U,I',1,15,4),quantita('t','Periodo di clock (ps)',20,200,65)],p=>{
    const n=3*p.g, a=tracciaCarico('vicino',p.g).length,b=tracciaCarico('separa',p.g).length;
    return [passo('Versione L, U, I','U si presenta subito dopo ciascun L e attende un ciclo.',[['Istruzioni',n],['Cicli',a],['Tempo (ps)',a*p.t]]),
      passo('Versione L, I, U','I occupa la posizione fra il carico e l’uso e può avanzare mentre il dato diventa disponibile.',[['Cicli',b],['Tempo (ps)',b*p.t]]),
      passo('Confronto','Il rapporto di accelerazione è il tempo originale diviso per il tempo riordinato.',[['Tempo risparmiato (ps)',(a-b)*p.t],['CPI prima / dopo',dec(a/n)+' / '+dec(b/n)],['Accelerazione',dec(a/b)]])]; }, segnale('Tempo risparmiato (ps)'));

  // I listati delle esercitazioni sono frammenti x86-64 in sintassi Intel.
  // I loro registri rappresentano gli ingressi e le uscite del circuito studiato.
  const numero = (label,value,hint) => ({label,answer:String(value),numeric:true,hint});
  const variante = (consegna,campi,svolgimento,codice) => ({consegna,campi,svolgimento,codice});
  const asm = (...righe) => righe.join('\n');
  function prova(cap,n,titolo,u,principio,casi,genera) {
    if(!SL.prove[cap]) SL.prove[cap]=[];
    SL.prove[cap].push({titolo,principio,unita:cap+'.'+u,attivita:'cslez'+cap.replace('.','_')+'_'+String(n).padStart(2,'0')+'_random_assembly',
      varianti:casi.map(x=>({...genera(...x), ingressiGrafico:x}))});
  }
  prova('3.1',1,'Programmare la maggioranza di tre bit',1,'Una coppia è attiva quando entrambi gli ingressi valgono uno. La somma dei tre prodotti logici conta le coppie. La loro OR fornisce un solo bit di maggioranza.',[[1,0,1],[0,1,0]],(a,b,c)=>{
    const y=(a&b)|(a&c)|(b&c);
    return variante('I tre segnali A='+a+', B='+b+', C='+c+' entrano in EDI, ESI, EDX. Conta le coppie di ingressi entrambi alti e determina il bit di maggioranza da restituire in EAX.',
      [numero('Coppie attive',(a&b)+(a&c)+(b&c),'Conta separatamente AB, AC e BC.'),numero('EAX',y,'Riunisci con OR le tre uscite.')],
      ['AB vale '+(a&b)+', AC vale '+(a&c)+' e BC vale '+(b&c)+'.','I tre AND del listato depositano AB in EAX, AC in ECX e BC in ESI.','Sommando i tre prodotti si contano '+((a&b)+(a&c)+(b&c))+' coppie attive. L’OR dei prodotti restituisce il bit di maggioranza '+y+' in EAX.'],
      asm('mov eax, edi','and eax, esi','mov ecx, edi','and ecx, edx','and esi, edx','or eax, ecx','or eax, esi')); });
  prova('3.1',2,'Estrarre la parola instradata dal multiplexer',2,'Una parola di sedici bit può contenere quattro ingressi da quattro bit. Il codice di selezione indica quanti gruppi di quattro posizioni separano l’ingresso scelto dal bordo destro della parola.',[[0xA4D2,2],[0x3B71,1]],(word,s)=>{
    const v=(word>>4*s)&15;
    return variante('EDI contiene '+hex(word,4)+'. I quattro ingressi da quattro bit sono impacchettati dal meno significativo I0 al più significativo I3. ESI='+s+' seleziona la parola da portare in EAX.',
      [numero('Spostamento necessario',s*4,'Conta quattro bit per ogni ingresso che precede quello selezionato.'),numero('Uscita del mux',v,'Isola il nibble basso dopo lo spostamento.')],
      ['Il selettore '+bin(s,2)+' indirizza I'+s+'.','Moltiplica '+s+' per quattro e sposta la parola a destra di '+(4*s)+' bit.','La maschera 0x0F conserva '+hex(v)+' e scarta i bit degli ingressi successivi.'],
      asm('mov eax, edi','mov ecx, esi','shl ecx, 2','shr eax, cl','and eax, 15')); });
  prova('3.1',3,'Interpretare riporto e prestito a otto bit',3,'L’aritmetica a otto bit conserva in AL il resto modulo 256. Su x86 CF segnala il riporto nell’addizione senza segno e il prestito nella sottrazione senza segno.',[[235,42,1],[19,53,0]],(a,b,add)=>{
    const t=add?a+b:a-b, r=t&255,c=add?+(t>255):+(t<0);
    return variante('Con AL='+a+' e CL='+b+' esegui '+(add?'ADD AL,CL':'SUB AL,CL')+'. Ricava il risultato a otto bit e CF secondo la convenzione x86 per operandi senza segno.',
      [numero('AL finale',r,'Riduci il risultato modulo 256.'),numero('CF',c,add?'Controlla il nono bit della somma.':'Confronta minuendo e sottraendo senza segno.')],
      ['L’operazione matematica produce '+a+(add?' + ':' − ')+b+' = '+t+'.','La parola da otto bit conserva '+hex(r)+' ('+r+' in decimale).',add?'Il totale supera 255. CF registra il riporto uscente e vale '+c+'.':'Il minuendo è minore del sottraendo. CF registra il prestito e vale '+c+'.'],
      asm(add?'add al, cl':'sub al, cl','setc dl','movzx eax, al','movzx edx, dl')); });
  prova('3.1',4,'Separare overflow, zero e segno dell’ALU',6,'ZF e SF descrivono la parola effettivamente scritta nel registro. OF riguarda la sua interpretazione con segno e dipende dal segno degli operandi prima dell’addizione.',[[127,1],[255,1]],(a,b)=>{
    const r=(a+b)&255,o=+(segno8(a)+segno8(b)>127||segno8(a)+segno8(b)<-128);
    return variante('Somma AL='+hex(a)+' e CL='+hex(b)+' su otto bit. Conserva il risultato e ricava i segnali ZF, SF e OF. Il frammento raccoglie i tre flag prima di una nuova operazione aritmetica.',
      [numero('Risultato senza segno',r,'Conserva gli otto bit inferiori.'),numero('ZF',+(r===0),'Verifica tutti gli otto bit del risultato.'),numero('SF',r>>7,'Leggi il bit sette.'),numero('OF',o,'Interpreta entrambi gli operandi in complemento a due.')],
      ['La somma senza segno vale '+(a+b)+' e la parola risultante è '+hex(r)+'.','Il bit alto è '+(r>>7)+' e il confronto della parola con zero vale '+Number(r===0)+'.','Con segno si sommano '+segno8(a)+' e '+segno8(b)+'. Il totale '+(segno8(a)+segno8(b))+' dà OF='+o+' rispetto a [−128,127].'],
      asm('add al, cl','setz dl','sets r8b','seto r9b','movzx eax, al')); });
  function sr(q,s,r){return s?1:r?0:q;}
  const srAsm = asm('mov eax, edi','or eax, esi','mov ecx, edx','xor ecx, 1','and eax, ecx');
  prova('3.1',5,'Seguire due impulsi su un latch SR',1,'In un latch SR a porte NOR, S da solo porta Q a uno e R da solo lo azzera. Quando S e R tornano entrambi a zero, la retroazione conserva il valore raggiunto.',[[0,1,0,0,0],[1,0,1,0,0]],(q,s,r,u,v)=>{
    const x=sr(q,s,r),y=sr(x,u,v);
    return variante('Sono ammesse le combinazioni (S,R) pari a (0,0), (1,0) e (0,1). Lo stato iniziale è Q='+q+'. Applica e lascia stabilizzare prima (S,R)=('+s+','+r+'), poi ('+u+','+v+'). Per ciascun intervallo il frammento riceve Q,S,R in EDI,ESI,EDX e produce Q successivo in EAX.',
      [numero('Q dopo il primo intervallo',x,'S pone a uno, R azzera.'),numero('Q dopo il secondo intervallo',y,'Con entrambi gli ingressi a zero ricopia lo stato precedente.')],
      ['Il primo comando è '+(s?'set':'reset')+' e forza Q a '+x+'.','Prima del secondo calcolo si porta '+x+' in EDI e si azzerano ESI ed EDX.','S e R bassi lasciano attiva la retroazione. Il valore finale è '+y+'. La formula vale per le tre combinazioni ammesse.'],srAsm); });

  prova('3.2',1,'Tradurre la tabella caratteristica SR',1,'In un latch SR a NOR, S attivo imposta Q e R attivo lo azzera. Con entrambi gli ingressi a zero, Q dipende dallo stato già memorizzato. Nei casi ammessi le due uscite stabili sono complementari.',[[1,0,0],[0,1,0]],(q,s,r)=>{
    const y=sr(q,s,r);
    return variante('Il latch SR a porte NOR ha Q='+q+', S='+s+', R='+r+'. S e R attivi insieme sono esclusi. Usa (Q OR S) AND (1 XOR R) per calcolare la coppia di uscite dopo l’assestamento. Ingressi Q,S,R in EDI,ESI,EDX.',
      [numero('Nuovo Q',y,'Valuta prima Q OR S.'),numero('Uscita complementare',1-y,'In uno stato stabile ammesso i due segnali sono complementari.')],
      ['Q OR S produce '+(q|s)+' e il complemento di R vale '+(1-r)+'.','L’AND dei due termini produce '+y+' sull’uscita Q.','L’altra porta fornisce '+(1-y)+'. La coppia corrisponde al comando '+(s?'di set':'di mantenimento')+'.'],
      srAsm+'\nmov edx, eax\nxor edx, 1'); });
  prova('3.2',2,'Tracciare la finestra di trasparenza',2,'Durante la fase trasparente l’uscita del latch segue D. Quando l’abilitazione si chiude, il latch conserva il valore acquisito.',[[0,1,0,1],[1,0,1,0]],(q,d1,d2,g2)=>{
    const x=d1,y=g2?d2:x;
    return variante('Un latch D parte da Q='+q+'. Nel primo intervallo G=1 e D='+d1+'. Nel secondo intervallo G='+g2+' e D='+d2+'. Per una transizione poni Q,D,G in EDI,ESI,EDX. Gli ingressi si stabilizzano fra gli intervalli.',
      [numero('Q dopo il primo intervallo',x,'Con il segnale G alto Q segue D.'),numero('Q dopo il secondo',y,'Con G uguale a zero usa il valore acquisito nel primo intervallo.')],
      ['Il primo segnale G alto rende il latch trasparente e porta Q a '+x+'.','Nel secondo intervallo G vale '+g2+'. La parola selezionata proviene '+(g2?'dal nuovo D.':'dalla retroazione.') ,'Il valore finale '+y+' si ottiene passando '+x+' come Q iniziale alla seconda esecuzione del frammento.'],
      asm('mov eax, edi','test edx, edx','cmovne eax, esi')); });
  prova('3.2',3,'Riconoscere il fronte che campiona D',2,'Il fronte di salita corrisponde a una specifica coppia ordinata di livelli di clock. L’impulso che lo rileva seleziona D per il nuovo stato del flip-flop.',[[0,0,1,1],[1,1,0,0]],(q,old,k,d)=>{
    const edge=+(old===0&&k===1);
    return variante('Q='+q+' in EDI, clock precedente '+old+' in ESI, clock attuale '+k+' in EDX e D='+d+' in ECX. Il flip-flop campiona sul fronte di salita. Calcola l’impulso di acquisizione e Q successivo.',
      [numero('Fronte di salita',edge,'Confronta la coppia di livelli con 0→1.'),numero('Q successivo',edge?d:q,'In presenza di un impulso il flip-flop campiona D. Fra due impulsi conserva Q.')],
      ['Il complemento del vecchio clock vale '+(1-old)+'.','La congiunzione con il nuovo clock vale '+edge+'. '+(edge?'Il dispositivo rileva un fronte di salita.':'Il passaggio da 1 a 0 è un fronte di discesa.'),'Il multiplexer sceglie '+(edge?'D':'Q precedente')+', quindi Q diventa '+(edge?d:q)+'.'],
      asm('mov eax, edi','xor esi, 1','and esi, edx','cmovne eax, ecx')); });
  prova('3.2',4,'Aggiornare un registro a quattro bit',3,'L’incrementatore produce una parola di quattro bit e riparte da zero dopo il valore massimo. Un selettore sceglie fra il suo risultato e il dato di caricamento già disponibile.',[[11,1],[15,0]],(q,load)=>{
    const d=5, r=load?d:(q+1)&15;
    return variante('Un registro a quattro bit contiene '+q+' in EDI. Al fronte, se ESI=1 carica EDX=5, altrimenti incrementa modulo 16. ESI='+load+'. Trova sia il candidato incremento sia il dato acquisito.',
      [numero('Candidato incremento',(q+1)&15,'Somma uno e conserva il nibble basso.'),numero('Valore acquisito',r,'Applica la selezione solo dopo aver calcolato i due candidati.')],
      ['L’incrementatore genera '+q+' + 1, che su quattro bit vale '+((q+1)&15)+'.','Il dato da caricare vale 5. Il segnale di caricamento vale '+load+'.','Il selettore porta '+r+' all’ingresso del registro e il fronte lo rende visibile su Q.'],
      asm('lea eax, [rdi+1]','and eax, 15','test esi, esi','cmovne eax, edx')); });
  prova('3.2',5,'Aggiornamento simultaneo con azzeramento prioritario',3,'Due registri comandati dallo stesso fronte acquisiscono contemporaneamente i valori calcolati dal vecchio stato. Un reset sincrono prioritario fa prevalere lo zero su entrambe le altre destinazioni.',[[3,9,0],[12,6,1]],(a,b,reset)=>{
    const x=reset?0:b,y=reset?0:(a+1)&15;
    return variante('Due registri a quattro bit partono da A='+a+', B='+b+' (EDI,ESI). EDX contiene il bit di reset, qui pari a '+reset+'. Con reset 1 il fronte azzera entrambi i registri. Con reset 0 acquisiscono simultaneamente A←B e B←A+1 modulo 16.',
      [numero('A dopo il fronte',x,'Valuta prima il reset, poi usa il vecchio B.'),numero('B dopo il fronte',y,'L’incrementatore riceve il vecchio A.')],
      ['I candidati normali sono '+b+' per A e '+((a+1)&15)+' per B, entrambi calcolati dallo stato iniziale.','Il reset vale '+reset+' e seleziona '+(reset?'la coppia di zeri.':'la coppia dei candidati normali.'),'Dopo lo stesso fronte A='+x+' e B='+y+'. Il listato lascia i risultati in EAX e ECX.'],
      asm('mov eax, esi','lea ecx, [rdi+1]','and ecx, 15','xor r8d, r8d','test edx, edx','cmovne eax, r8d','cmovne ecx, r8d')); });

  prova('3.3',1,'Separare classe e funzione dal primo byte',2,'I quattro bit alti del primo byte Y86-64 identificano la classe e i quattro bassi ne precisano la funzione. Uno scorrimento allinea il campo alto al bit zero. Una maschera isola il campo basso.',[[0x63,'xorq'],[0x74,'jne']],(b,nome)=>
    variante('Il primo byte Y86-64 '+hex(b)+' entra in EDI. Estrai icode in EAX e ifun in EDX. Per OPq (classe 6) la funzione 3 è XOR. Per jXX (classe 7) la funzione 4 salta quando ZF=0.',
      [numero('icode',b>>4,'Sposta il byte di quattro posizioni verso destra.'),numero('ifun',b&15,'Applica la maschera 0x0F al byte originale.')],
      ['Il byte in binario è '+bin(b,8)+'.','Il nibble alto dà la classe '+(b>>4)+' e quello basso la funzione '+(b&15)+'.','La coppia identifica '+nome+'. La classe determina la presenza dei campi successivi.'],
      asm('mov eax, edi','shr eax, 4','mov edx, edi','and edx, 15')));
  prova('3.3',2,'Ricostruire lunghezza e confine di un’istruzione',2,'La lunghezza di un’istruzione dipende dai campi previsti dal suo formato. Il PC sequenziale è l’indirizzo di partenza più la somma delle rispettive lunghezze in byte.',[[0x40,1,1,'irmovq'],[0xA0,0,1,'call']],(pc,r,c,nome)=>{
    const n=1+r+8*c;
    return variante(nome+' inizia al PC '+hex(pc)+'. EDI contiene il PC. I bit ESI ed EDX valgono 1 quando il formato include, rispettivamente, il byte rA:rB e la costante da otto byte. Per questa istruzione ESI='+r+' ed EDX='+c+'. Calcola la lunghezza in byte e il primo indirizzo successivo alla codifica.',
      [numero('Lunghezza (byte)',n,'Conta il byte di codice più i campi opzionali.'),numero('Indirizzo valP',pc+n,'Somma la lunghezza al primo indirizzo.')],
      ['Il primo byte occupa sempre una posizione. Il contributo dei registri è '+r+' byte.','La costante aggiunge '+8*c+' byte. La lunghezza totale è '+n+'.','Il PC sequenziale vale '+hex(pc)+' + '+n+' = '+hex(pc+n)+'. EAX restituisce la lunghezza ed ECX il PC sequenziale.'],
      asm('lea eax, [rsi+rdx*8+1]','lea ecx, [rdi+rax]')); });
  prova('3.3',3,'Decodificare i due registri di OPq',3,'Nel byte dei registri il nibble alto identifica rA e quello basso rB. Per una OPq entrambi i registri sono sorgenti, mentre il risultato dell’ALU torna in rB.',[[0x23],[0x10]],(rb)=>{
    const a=rb>>4,b=rb&15;
    return variante('In OPq rA,rB il secondo byte è '+hex(rb)+' in EDI. Gli identificatori 0,1,2,3 rappresentano %rax,%rcx,%rdx,%rbx. Determina srcA, srcB e la destinazione dstE.',
      [numero('srcA',a,'Il primo registro occupa i quattro bit alti.'),numero('srcB',b,'Estrai i quattro bit bassi.'),numero('dstE',b,'OPq aggiorna il secondo operando.')],
      ['La scomposizione '+bin(rb,8)+' dà rA='+a+' e rB='+b+'.','Le due porte di lettura ricevono rispettivamente '+a+' e '+b+'.','L’ALU invia il risultato al secondo registro. Il listato restituisce srcA in EAX, srcB in EDX, dstE in ECX.'],
      asm('mov eax, edi','shr eax, 4','mov edx, edi','and edx, 15','mov ecx, edx')); });
  prova('3.3',4,'Sottrarre nell’ordine previsto da subq',1,'In Y86-64 subq rA,rB sottrae il contenuto di rA da quello di rB. I flag di zero e segno si ricavano dalla parola calcolata con questo ordine degli operandi.',[[8,3],[11,11]],(a,b)=>{
    const r=b-a;return variante('Y86-64 esegue subq %rax,%rbx con %rax='+a+' e %rbx='+b+'. Nel frammento x86-64 RDI rappresenta il primo operando e RSI il secondo. Leggi il risultato con segno.',
      [numero('Nuovo %rbx',r,'Calcola valB − valA.'),numero('ZF',+(r===0),'Confronta la parola risultante con zero.'),numero('SF',+(r<0),'Controlla il segno del risultato a 64 bit.')],
      ['La destinazione dispone inizialmente di '+b+'. Si sottrae il contenuto '+a+' della sorgente.','Il calcolo '+b+' − '+a+' produce '+r+' e resta entro l’intervallo con segno a 64 bit.','Risultano '+cc(r===0,r<0,0)+'. SUB realizza lo stesso ordine degli operandi dopo aver copiato RSI in RAX.'],
      asm('mov rax, rsi','sub rax, rdi','setz dl','sets cl','seto r8b')); });
  prova('3.3',5,'Separare l’indirizzo dal valore di un carico',3,'Un carico passa dal registro base e dallo spostamento a un indirizzo effettivo. Solo una successiva lettura della memoria fornisce la parola da scrivere nel registro destinazione.',[[0x60,16,0x42,0x80],[0xA0,-8,0x39,0x30]],(b,d,val,pc)=>{
    const addr=b+d;return variante('Al PC '+hex(pc)+' si trova mrmovq '+d+'(%rbx),%rax. %rbx='+hex(b)+' e la parola all’indirizzo %rbx+D vale '+hex(val)+'. Nel frammento RDI contiene il valore di %rbx, RSI lo spostamento e R8 il PC Y86 iniziale. RCX punta al byte zero della memoria Y86 simulata.',
      [numero('valE',addr,'Somma il valore del registro base e lo spostamento con segno.'),numero('Nuovo %rax',val,'Il dato proviene dagli otto byte indirizzati da valE.'),numero('Nuovo PC',pc+10,'mrmovq contiene codice, registri e spostamento a 64 bit.')],
      ['L’indirizzo effettivo si ottiene come '+hex(b)+' + ('+d+') = '+hex(addr)+'.','Gli otto byte da '+hex(addr)+' a '+hex(addr+7)+' compongono valM='+hex(val)+', che viene scritto in %rax.','La lunghezza è 1 + 1 + 8 = 10 byte. Da '+hex(pc)+' si passa a '+hex(pc+10)+'. Il listato riceve il PC iniziale in R8 e restituisce il nuovo PC nello stesso registro.'],
      asm('lea rdx, [rdi+rsi]','mov rax, qword ptr [rcx+rdx]','add r8, 10')); });

  prova('3.4',1,'Confrontare le due direzioni dello stack',2,'Push e pop riservano o liberano una parola di pila spostando %rsp di otto byte in direzioni opposte. La scelta tra vecchia e nuova cima determina l’indirizzo di memoria.',[[0x80,1],[0xA8,0]],(sp,push)=>{
    const delta=push?-8:8, nuovo=sp+delta,addr=push?nuovo:sp;
    return variante('Il vecchio %rsp vale '+hex(sp)+' in RDI. SEQ esegue '+(push?'pushq %rax':'popq %rax')+'. Identifica l’ingresso costante dell’ALU, il nuovo puntatore e l’indirizzo dei dati. La pila usa parole da otto byte.',
      [numero('aluA',delta,'La pila cresce verso gli indirizzi minori.'),numero('valE',nuovo,'Somma la costante al vecchio puntatore.'),numero('mem_addr',addr,'La scrittura usa la nuova cima, la lettura quella vecchia.')],
      [push?'Una push riserva otto byte prima della scrittura.':'Una pop libera otto byte dopo la lettura.','L’ALU calcola '+hex(sp)+' + ('+delta+') = '+hex(nuovo)+'.', (push?'La scrittura seleziona valE':'La lettura seleziona il vecchio %rsp')+' e accede a '+hex(addr)+'. Il frammento restituisce il puntatore in RAX e l’indirizzo in RDX.'],
      asm(push?'lea rax, [rdi-8]':'lea rax, [rdi+8]',push?'mov rdx, rax':'mov rdx, rdi')); });
  prova('3.4',2,'Verificare tutti i byte di un accesso',4,'Una parola di otto byte occupa otto indirizzi consecutivi a partire dalla base effettiva. Anche l’ultimo byte deve appartenere all’intervallo allocato.',[[53,3,64],[63, -4,64]],(b,d,size)=>{
    const a=b+d,last=a+7,ok=+(a>=0&&last<size);
    return variante('Una memoria di '+size+' byte è indicizzata da 0 a '+(size-1)+'. La lettura di una parola da otto byte usa base '+b+' in RDI e spostamento '+d+' in RSI. Determina l’ultimo indirizzo e il bit di validità. Per questi ingressi l’indirizzo iniziale è positivo e rappresentabile.',
      [numero('Ultimo indirizzo richiesto',last,'Somma sette al primo indirizzo della parola.'),numero('Valido (0/1)',ok,'L’ultimo indirizzo deve essere strettamente minore della dimensione.')],
      ['La base più lo spostamento produce '+a+'.','Gli otto indirizzi formano l’intervallo ['+a+', '+last+'].','Il limite superiore disponibile è '+(size-1)+'. Il confronto senza segno dà '+ok+' e lo stato è '+(ok?'AOK.':'ADR.')],
      asm('lea rdx, [rdi+rsi+7]','cmp rdx, '+size,'setb al','movzx eax, al')); });
  prova('3.4',3,'Comporre il vettore di controllo SEQ',4,'Il decodificatore usa la classe dell’istruzione per abilitare lettura dati, scrittura dati e aggiornamento dei codici di condizione. Riunire i tre segnali in una parola assegna a ciascuno un peso distinto.',[[0x50,1,0,0],[0x40,0,1,0]],(byte,rd,wr,flags)=>{
    const v=(rd<<2)|(wr<<1)|flags;
    return variante('Il byte iniziale '+hex(byte)+' entra in EDI. Nel sottoinsieme in esame le classi 5, 4 e 6 significano mrmovq, rmmovq e OPq. Costruisci in EAX il vettore [mem_read, mem_write, set_cc] dai bit 2 a 0.',
      [numero('mem_read',rd,'Il carico preleva dalla memoria dati.'),numero('mem_write',wr,'Il deposito trasferisce un registro alla memoria.'),numero('Vettore impacchettato',v,'Assegna pesi 4, 2 e 1 ai tre segnali.')],
      ['Dal nibble alto si ricava icode='+(byte>>4)+'.','La classe richiede '+(rd?'una lettura dati.':'una scrittura dati.')+' Il segnale dei codici di condizione vale zero.','Il vettore è '+bin(v,3)+', ossia '+v+'. Le tre SETE producono i singoli bit e le LEA assegnano i pesi.'],
      asm('shr edi, 4','xor eax, eax','xor ecx, ecx','xor edx, edx','cmp edi, 5','sete al','cmp edi, 4','sete cl','cmp edi, 6','sete dl','lea eax, [rdx+rax*4]','lea eax, [rax+rcx*2]')); });
  prova('3.4',4,'Trovare il percorso che fissa il periodo',3,'I ritardi dei blocchi in serie si sommano, mentre due rami in parallelo impongono il maggiore dei due tempi di arrivo. Clock→Q e setup servono una sola volta per l’intero percorso fra registri.',[[85,65,45,12],[42,48,96,18]],(a,b,c,g)=>{
    const x=a+b,k=Math.max(x,c);
    return variante('Due percorsi fra registri sono in parallelo. Il primo contiene due blocchi in serie di '+a+' e '+b+' ps (EDI,ESI), il secondo un blocco di '+c+' ps (EDX). Il costo comune di clock→Q e setup ammonta a '+g+' ps (ECX). Calcola il ritardo combinatorio peggiore e il periodo minimo del clock.',
      [numero('Cammino combinatorio critico (ps)',k,'Confronta la somma del primo ramo con il secondo ramo.'),numero('Periodo minimo (ps)',k+g,'Aggiungi il costo comune una volta sola.')],
      ['Il ramo in serie richiede '+a+' + '+b+' = '+x+' ps.','Il massimo fra '+x+' e '+c+' è '+k+' ps. I due rami lavorano nello stesso intervallo.','Aggiungendo '+g+' ps per i registri si ottiene un periodo minimo di '+(k+g)+' ps. Il listato conserva il massimo con CMOVB.'],
      asm('lea eax, [rdi+rsi]','cmp eax, edx','cmovb eax, edx','add eax, ecx')); });
  prova('3.4',5,'Scegliere il PC dopo jne',1,'L’istruzione jne sceglie tra l’indirizzo successivo al salto e l’indirizzo codificato come bersaglio. La scelta dipende da ZF già presente prima del salto.',[[0x40,0xC0,0],[0x70,0xB0,1]],(pc,t,z)=>{
    const seq=pc+9,take=1-z,newpc=take?t:seq;
    return variante('SEQ preleva jne '+hex(t)+' al PC '+hex(pc)+'. Il vecchio ZF vale '+z+'. RDI rappresenta il PC iniziale, RSI la destinazione e EDX il valore di ZF. Il salto occupa nove byte e conserva i flag Y86.',
      [numero('valP',seq,'Somma il byte di codice e gli otto byte di destinazione.'),numero('Cnd',take,'jne richiede disuguaglianza.'),numero('PC scelto',newpc,'La condizione vera abilita il bersaglio.')],
      ['L’indirizzo sequenziale è '+hex(pc)+' + 9 = '+hex(seq)+'.','Il controllo valuta Cnd = 1 − ZF = '+take+'.','Il selettore del PC usa '+(take?'valC':'valP')+' e il nuovo PC vale '+hex(newpc)+'. I flag x86 del frammento servono al calcolo del modello.'],
      asm('lea rax, [rdi+9]','test edx, edx','cmovz rax, rsi')); });

  prova('3.5',1,'Contare il lavoro di una pipeline vuota',1,'Con K stadi la prima istruzione conclude dopo K cicli. In un flusso ideale già avviato ogni istruzione successiva impiega un solo ciclo aggiuntivo per completare il programma.',[[5,8],[4,1]],(k,n)=>{
    const c=k+n-1;return variante('Una pipeline ideale di '+k+' stadi, inizialmente vuota, esegue '+(n===1?'una sola istruzione':n+' istruzioni indipendenti')+'. Il primo prelievo occupa il ciclo 1. Calcola il ciclo di completamento della prima istruzione e il numero di cicli dell’intero programma. EDI e ESI contengono rispettivamente K e N.',
      [numero('Ciclo del primo completamento',k,'La prima istruzione visita K stadi.'),numero('Cicli complessivi',c,'Dopo la prima terminano le altre N − 1.')],
      ['La prima istruzione entra al ciclo 1 e attraversa '+k+' stadi entro la fine del ciclo '+k+'.',n===1?'Il primo completamento conclude anche l’intero programma.':'Le altre '+(n-1)+' istruzioni terminano al ritmo di una per ciclo.','La misura complessiva vale '+k+' + '+n+' − 1 = '+c+' cicli. EAX contiene questo totale.'],
      asm('lea eax, [rdi+rsi-1]')); });
  prova('3.5',2,'Misurare latenza e accelerazione su un tratto finito',1,'La latenza individuale comprende tutti gli stadi attraversati da un’istruzione. Per confrontare due programmi identici occorre confrontare anche la distanza tra completamenti successivi.',[[4,5,20],[3,4,30]],(k,n,t)=>{
    const l=k*t,seq=l*n,pip=(n+k-1)*t;return variante('Ciascuno dei K='+k+' stadi impiega T='+t+' ps. Trascurando il costo dei registri, calcola la latenza della prima istruzione e i tempi totali per N='+n+' istruzioni indipendenti su due macchine. La prima esegue le istruzioni in serie e la seconda impiega una pipeline inizialmente vuota. EDI=K, ESI=N, EDX=T.',
      [numero('Latenza della prima istruzione (ps)',l,'La prima istruzione attraversa K stadi in entrambe le macchine.'),numero('Tempo sequenziale (ps)',seq,'Moltiplica la latenza per N.'),numero('Tempo pipeline (ps)',pip,'Il numero di cicli è N + K − 1.')],
      ['La latenza individuale è '+k+' × '+t+' = '+l+' ps. A regime la pipeline completa un’istruzione ogni '+t+' ps.','In serie il tempo è '+n+' × '+l+' = '+seq+' ps. In pipeline bastano '+(n+k-1)+' cicli, cioè '+pip+' ps.','L’accelerazione sul tratto è '+seq+' / '+pip+' = '+dec(seq/pip)+' (arrotondata al millesimo). Il frammento conserva latenza, tempo seriale e tempo pipeline in EAX, ECX ed R8D.'],
      asm('mov eax, edi','imul eax, edx','mov ecx, eax','imul ecx, esi','lea r8d, [rdi+rsi-1]','imul r8d, edx')); });
  prova('3.5',3,'Confrontare destinazione e sorgenti effettive',3,'Una dipendenza RAW richiede che il produttore scriva realmente un registro letto dal consumatore. Il codice RNONE rappresenta l’assenza di registro, anche quando due campi contengono lo stesso numero.',[[2,5,2,1],[15,15,6,0]],(dst,a,b,en)=>{
    const hit=+(en&&dst!==15&&(dst===a||dst===b));return variante('Il produttore espone dst='+dst+' (EDI) e write_enable='+en+' (ECX). Il consumatore espone srcA='+a+' e srcB='+b+' (ESI, EDX). L’identificatore 15 indica RNONE. Ricava il bit RAW per questa coppia.',
      [numero('Confronto grezzo dst=srcA oppure dst=srcB',+(dst===a||dst===b),'Considera prima le sole uguaglianze numeriche.'),numero('Dipendenza RAW valida',hit,'Una dipendenza richiede una scrittura abilitata su un registro effettivo.')],
      ['I confronti valgono '+Number(dst===a)+' sulla porta A e '+Number(dst===b)+' sulla porta B.','La destinazione '+dst+(dst===15?' corrisponde a RNONE.':' individua un registro effettivo.')+' L’abilitazione vale '+en+'.','Combinando confronto, validità e abilitazione si ottiene RAW='+hit+'. Un confronto con RNONE può dare un’uguaglianza numerica priva di effetto.'],
      asm('xor eax, eax','cmp edi, 15','je 1f','test ecx, ecx','jz 1f','cmp edi, esi','sete al','cmp edi, edx','sete cl','or al, cl','1:')); });
  prova('3.5',4,'Contare i cicli di fermo sovrapposti',4,'Le due maschere riferiscono cause diverse allo stesso asse dei cicli. AND individua la loro sovrapposizione. Il conteggio dei bit a uno della OR misura la durata del fermo.',[[0b011010,0b001110],[0b001001,0b110000]],(a,b)=>{
    const pc=x=>bin(x,6).split('1').length-1, mask=a|b;
    return variante('Due maschere di sei bit, dati '+bin(a,6)+' in EDI e risorsa '+bin(b,6)+' in ESI, descrivono gli stessi sei cicli (bit 0 = primo ciclo). Un bit uno richiede un fermo di un ciclo. Conta i cicli con entrambe le richieste e il fermo effettivo complessivo. Il processore ospite offre POPCNT.',
      [numero('Cicli con entrambe le cause',pc(a&b),'Conta gli uno della congiunzione.'),numero('Cicli di fermo effettivi',pc(mask),'Conta gli uno dell’unione.')],
      ['L’intersezione '+bin(a&b,6)+' contiene '+pc(a&b)+' bit attivi.','L’unione OR produce '+bin(mask,6)+'. Ciascuna posizione rappresenta un intervallo distinto.','Il conteggio dei cicli persi vale '+pc(mask)+'. La verifica per inclusione ed esclusione dà '+pc(a)+' + '+pc(b)+' − '+pc(a&b)+'. EDX riporta il numero di cicli comuni ed EAX il totale.'],
      asm('mov edx, edi','and edx, esi','popcnt edx, edx','or edi, esi','popcnt eax, edi')); });
  prova('3.5',5,'Calcolare gli stalli dalla distanza fra istruzioni',3,'Senza inoltro, il consumatore deve poter leggere nel banco il risultato prodotto. La scrittura nel primo semiciclo e la lettura nel secondo permettono di usare un dato già durante il ciclo W del produttore.',[[0],[2]],(gap)=>{
    const read=3+gap,st=Math.max(0,5-read);
    return variante('Pipeline F,D,E,M,W senza forwarding. Il produttore entra in F nel ciclo 1 e scrive nel primo semiciclo di W. Il consumatore legge nel secondo semiciclo di D. Il registro EDI specifica quante istruzioni indipendenti sono interposte. Qui EDI='+gap+'. Determina il primo ciclo previsto in D e il numero di stalli necessari.',
      [numero('Primo ciclo D previsto per il consumatore',read,'Il consumatore immediatamente successivo entra in D nel ciclo 3.'),numero('Stalli in D',st,'W del produttore è nel ciclo 5 e può servire D nello stesso ciclo.')],
      ['Il produttore attraversa F,D,E,M,W nei cicli da 1 a 5.','Con '+gap+' istruzioni interposte, il primo ciclo previsto per D è 3 + '+gap+' = '+read+'.','L’attesa è max(0, 5 − '+read+') = '+st+' cicli. Il listato tronca a zero una differenza negativa.'],
      asm('lea ecx, [rdi+3]','mov eax, 5','sub eax, ecx','mov edx, 0','cmovs eax, edx')); });

  prova('3.6',1,'Leggere l’occupazione di uno stadio',1,'Un’istruzione indipendente si sposta di uno stadio per fronte. Con ingressi consecutivi, ciclo di osservazione e distanza dello stadio dal prelievo identificano l’istruzione che lo occupa.',[[3,2,4],[7,5,4]],(c,s,n)=>{
    const i=c-s+1;return variante('Una pipeline a cinque stadi, inizialmente vuota, preleva '+n+' istruzioni I1… I'+n+' senza conflitti a partire dal ciclo 1. Nel ciclo '+c+' considera lo stadio '+stadi[s-1]+' (numero '+s+', contando F=1). EDI contiene il ciclo, ESI lo stadio, EDX il numero di istruzioni. Restituisci l’indice dell’istruzione oppure zero per stadio vuoto.',
      [numero('Indice nello stadio',i>=1&&i<=n?i:0,'Sottrai al ciclo il numero di trasferimenti già effettuati.'),numero('Istruzioni attive nel ciclo',occupazione(n,c).filter(x=>x!=='—').length,'Conta gli stadi con indice di istruzione fra 1 e N.')],
      ['Per raggiungere lo stadio '+s+' occorrono '+(s-1)+' fronti dopo il prelievo.','L’indice candidato è '+c+' − '+s+' + 1 = '+i+'. Fra 1 e N l’indice identifica un’istruzione. Fuori da tale intervallo lo stadio è vuoto.','L’intera riga F,D,E,M,W è '+occupazione(n,c).join(' / ')+'. Gli indici validi danno '+occupazione(n,c).filter(x=>x!=='—').length+' istruzioni attive.'],
      asm('mov eax, edi','sub eax, esi','inc eax','xor ecx, ecx','test eax, eax','cmovle eax, ecx','cmp eax, edx','cmova eax, ecx')); });
  prova('3.6',2,'Applicare il controllo di D ed E',5,'Lo stallo conserva un’istruzione nel suo registro di pipeline. La bolla elimina gli effetti del nuovo ingresso. In presenza simultanea di ret e di una dipendenza da carico bisogna conservare il consumatore ancora in D.',[[1,1],[0,1]],(load,ret)=>{
    const v=controlloPIPE(!!load,!!ret,false);return variante('Il rilevatore PIPE fornisce load_use='+load+' in EDI e ret_in_DEM='+ret+' in ESI. I salti sono previsti correttamente. Calcola i segnali di stallo e bolla. Il bit di ritorno può riferirsi allo stesso consumatore in D.',
      [numero('F_stall',+v.f,'F si ferma per ciascuna delle due cause.'),numero('D_stall',+v.ds,'Il consumatore di un carico immediato deve conservare il proprio posto.'),numero('D_bubble',+v.db,'La bolla dovuta a ret richiede assenza di load/use.'),numero('E_bubble',+v.eb,'Con previsione corretta la sola causa qui è load/use.')],
      ['Il prelievo calcola '+load+' OR '+ret+' = '+Number(v.f)+'.','D_stall coincide con load_use e vale '+Number(v.ds)+'. Per D_bubble si forma (1 − '+load+') AND '+ret+' = '+Number(v.db)+'.','E_bubble vale '+Number(v.eb)+'. '+(load?'D conserva il consumatore e inserisce un intervallo libero a valle.':'Il ritorno già in pipeline può procedere e D riceve una bolla.')+' Il listato lascia F_stall, D_stall, D_bubble, E_bubble in EAX, ECX, EDX, R8D.'],
      asm('mov eax, edi','or eax, esi','mov ecx, edi','mov edx, edi','xor edx, 1','and edx, esi','mov r8d, edi')); });
  prova('3.6',3,'Verificare le precedenze del selettore di prelievo',2,'Il selettore di prelievo attribuisce una priorità alle richieste di correzione e di ritorno. Si può verificare il circuito applicando anche combinazioni forzate di segnali.',[[1,1,0x40,0x99,0xC0],[0,1,0x50,0x79,0xD8]],(j,r,p,m,w)=>{
    const s=pcPIPE(j,r,p,m,w);return variante('Banco di prova del selettore. F_predPC='+hex(p)+' in RDI, M_valA='+hex(m)+' in RSI, W_valM='+hex(w)+' in RDX. Il bit di correzione del salto in M è '+j+' (ECX) e il bit ret in W è '+r+' (R8D). Gli ingressi del banco possono essere forzati. Calcola il PC di fetch.',
      [numero('PC dopo la sola selezione ret / predetto',r?w:p,'Applica prima la scelta con priorità inferiore.'),numero('PC finale',s[1],'Una correzione in M prende precedenza sul ritorno in W.')],
      ['Si parte dal predetto '+hex(p)+'.','Il bit di ritorno '+r+' seleziona '+hex(r?w:p)+' come candidato intermedio.','Si applica per ultima la correzione con priorità massima. Il bit '+j+' dà la sorgente '+s[0]+' e l’indirizzo '+hex(s[1])+'.'],
      asm('mov rax, rdi','test r8d, r8d','cmovne rax, rdx','test ecx, ecx','cmovne rax, rsi')); });
  prova('3.6',4,'Datare la scrittura del consumatore',6,'Un carico rende disponibile il dato dopo la lettura in M. La posizione del consumatore rispetto al carico determina sia il suo primo ciclo in D sia l’eventuale ciclo aggiuntivo di attesa.',[[0],[1]],gap=>{
    const d=3+gap,stall=gap?0:1,w=d+3+stall;
    return variante('Un carico L entra in F nel ciclo 1. U legge il registro caricato. Il numero di copie indipendenti interposte fra L e U è '+gap+'. PIPE usa forwarding da M e uno stallo per load/use immediato. Trova il primo ciclo D e il ciclo W di U. EDI contiene il numero di copie interposte.',
      [numero('Primo ciclo D di U',d,'Segui l’ingresso F di U e aggiungi un ciclo.'),numero('Ciclo W di U',w,'Aggiungi il transito D→E→M→W ed eventuali permanenze in D.')],
      ['L entra in E nel ciclo 3 e la sua lettura dati termina nel ciclo 4.','U arriva in D nel ciclo '+d+'. '+(stall?'Il dato manca per E. U resta in D ancora nel ciclo 4.':'Il forwarding di M fornisce il dato in tempo per il prossimo E.') ,'U esegue E nel ciclo '+(d+1+stall)+', M nel ciclo '+(d+2+stall)+' e W nel ciclo '+w+'. Il frammento restituisce D in ECX e W in EAX.'],
      asm('lea ecx, [rdi+3]','xor edx, edx','test edi, edi','setz dl','lea eax, [rcx+rdx+3]')); });
  prova('3.6',5,'Trasferire i registri senza propagare la bolla due volte',4,'Il comando di bolla agisce sul registro a cui è diretto. Gli altri registri possono continuare ad acquisire simultaneamente i valori disponibili prima dello stesso fronte.',[[7,6,5,0],[10,9,8,1]],(d,e,m,err)=>{
    const ne=err?0:d;
    return variante('All’inizio del ciclo D contiene l’istruzione '+d+', E la '+e+', M la '+m+' (EDI,ESI,EDX). Zero indica bolla. ECX contiene il bit di errore della previsione di salto in E, qui pari a '+err+'. E contiene il salto. M e W caricano normalmente. Con bit di errore 1, E riceve una bolla.',
      [numero('Nuovo E',ne,'Il controllo può sostituire con zero il vecchio contenuto di D in transito.'),numero('Nuovo M',e,'Acquisisci l’istruzione che era in E prima del fronte.'),numero('Nuovo W',m,'Acquisisci il vecchio M.')],
      ['Il candidato per E è il vecchio D, cioè '+d+'. Il segnale di annullamento vale '+err+' e produce E='+ne+'.','M riceve simultaneamente il vecchio E='+e+'. L’istruzione che ha risolto il salto continua il proprio percorso.','W riceve il vecchio M='+m+'. I tre esiti vengono calcolati dagli ingressi originari e depositati in EAX, R8D e R9D.'],
      asm('mov eax, edi','mov r8d, esi','mov r9d, edx','xor edx, edx','test ecx, ecx','cmovne eax, edx')); });
})();
