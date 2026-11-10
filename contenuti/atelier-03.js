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
  function prova(cap,n,titolo,u,principio,casi,genera,seconda,ripasso) {
    if(!SL.prove[cap]) SL.prove[cap]=[];
    const varianti=casi.map(x=>({...genera(...x), ingressiGrafico:x}));
    if(seconda)varianti.push(seconda);
    SL.prove[cap].push({titolo,principio,unita:cap+'.'+u,attivita:'cslez'+cap.replace('.','_')+'_'+String(n).padStart(2,'0')+'_random_assembly',
      varianti,...(ripasso?{ripasso}:{})});
  }
  prova('3.1',1,'Programmare la maggioranza di tre bit',1,'Un bit rappresenta un segnale che vale 0 oppure 1. Per tre segnali A, B e C, la maggioranza vale 1 quando almeno due valgono 1. AND riconosce una coppia attiva perché produce 1 soltanto con entrambi gli ingressi a 1: AB indica A AND B, e analogamente si formano AC e BC. Sommare i tre esiti conta le coppie attive; riunirli con OR produce invece un solo bit, uguale a 1 appena una coppia è attiva. Per riconoscere un ramo interrotto si sceglie una terna sulla quale quel ramo determini da solo il risultato.',[[1,0,1]],(a,b,c)=>{
    const y=(a&b)|(a&c)|(b&c);
    return variante('I tre segnali valgono A='+a+', B='+b+' e C='+c+'. Conta le coppie di ingressi entrambi alti e indica nel campo EAX il bit di maggioranza. Nel frammento di riferimento dello svolgimento, EDI, ESI ed EDX conservano rispettivamente A, B e C; EAX raccoglie il risultato. Questi registri sono piccole memorie interne al processore.',
      [numero('Coppie attive',(a&b)+(a&c)+(b&c),'Conta separatamente AB, AC e BC.'),numero('EAX',y,'Riunisci con OR le tre uscite.')],
      ['AB vale '+(a&b)+', AC vale '+(a&c)+' e BC vale '+(b&c)+'.','I tre AND del listato depositano AB in EAX, AC in ECX e BC in ESI.','Sommando i tre prodotti '+(((a&b)+(a&c)+(b&c))===1?'si conta una coppia attiva':'si contano '+((a&b)+(a&c)+(b&c))+' coppie attive')+'. L’OR dei prodotti restituisce il bit di maggioranza '+y+' in EAX.'],
      asm('mov eax, edi','and eax, esi','mov ecx, edi','and ecx, edx','and esi, edx','or eax, ecx','or eax, esi')); },
  {
    consegna: "In un circuito di maggioranza a tre ingressi sono rimasti collegati alla OR i soli prodotti AB e AC. Nel listato EDI, ESI ed EDX contengono i bit A, B e C. Scegli la terna che rende osservabile il filo BC interrotto. Indica poi il bit che dovrebbe comparire in uscita sul circuito integro.",
    campi: [
      {label: "Terna A B C", answer: "0 1 1", choices: ["1 1 0", "0 1 1", "1 1 1"], hint: "Isola il ramo BC mantenendo bassi entrambi i prodotti che contengono A."},
      {label: "Uscita del circuito integro", answer: "1", numeric: true, hint: "Valuta la OR di tutti e tre i prodotti sulla terna scelta."}
    ],
    svolgimento: [
      "Per rivelare il guasto, BC deve valere 1. Occorrono quindi B=1 e C=1.",
      "Se anche A valesse 1, AB e AC basterebbero a portare la OR a 1. Occorre A=0, da cui la terna 0 1 1.",
      "Con questi ingressi il circuito integro raccoglie 0 OR 0 OR 1 e restituisce 1. Il circuito guasto raccoglie soltanto 0 OR 0 e restituisce 0."
    ],
    quadro: [
      {titolo: "Tre prove candidate", nota: "Occorre un’uscita diversa fra i due circuiti.", celle: [["A B C", "1 1 0"], ["A B C", "0 1 1"], ["A B C", "1 1 1"]], tipo: "confronto"},
      {titolo: "Il ramo interrotto", nota: "Il ramo può influire soltanto mentre il suo prodotto è alto.", celle: [["B", "1"], ["C", "1"], ["BC", "1"]], tipo: "stato"},
      {titolo: "Spegnere gli altri percorsi", nota: "Con entrambi i rami funzionanti bassi, BC decide da solo.", celle: [["A", "0"], ["AB", "0"], ["AC", "0"]], tipo: "stato"},
      {titolo: "La terna di prova 0 1 1", nota: "La differenza identifica un guasto osservabile su questa terna.", celle: [["OR integra", "1"], ["OR con BC scollegato", "0"]], tipo: "confronto"}
    ],
    listato: "mov eax, edi     ; A\nand eax, esi     ; AB\nmov ecx, edi\nand ecx, edx     ; AC\nor eax, ecx      ; uscita del circuito da verificare"
  });
  prova('3.1',2,'Estrarre la parola instradata dal multiplexer',2,'Ogni cifra esadecimale rappresenta quattro bit, un gruppo chiamato nibble: dopo 9 le lettere A…F valgono da 10 a 15. La parola di sedici bit contiene quindi quattro ingressi, numerati I0…I3 da destra. Per portare in fondo il canale s si sposta la parola a destra di 4×s bit; la AND con 15, scritto 0x0F e formato da quattro uno, conserva poi soltanto il gruppo basso. Nel listato SHR esegue lo spostamento a destra e SHL ECX,2 moltiplica il selettore per quattro. Il multiplexer realizza la stessa scelta collegando all’uscita il canale selezionato.',[[0xA4D2,2]],(word,s)=>{
    const v=(word>>4*s)&15;
    return variante('EDI contiene '+hex(word,4)+'. I quattro ingressi da quattro bit sono impacchettati dal meno significativo I0 al più significativo I3. ESI='+s+' seleziona la parola da portare in EAX.',
      [numero('Spostamento necessario',s*4,'Conta quattro bit per ogni ingresso che precede quello selezionato.'),numero('Uscita del mux',v,'Isola il nibble basso dopo lo spostamento.')],
      ['Il selettore '+bin(s,2)+' indirizza I'+s+'.','Moltiplica '+s+' per quattro e sposta la parola a destra di '+(4*s)+' bit.','La maschera 0x0F conserva '+hex(v)+' e scarta i bit degli ingressi successivi.'],
      asm('mov eax, edi','mov ecx, esi','shl ecx, 2','shr eax, cl','and eax, 15')); },
  {
    consegna: "Il multiplexer ha quattro ingressi da quattro bit. Nella parola 0x3B71, I0 è la cifra più a destra e I3 è la più a sinistra. In uscita si osserva 0xB. Ricostruisci il numero dell’ingresso selezionato e lo spostamento a destra che consentirebbe di estrarlo in assembly.",
    campi: [
      {label: "Numero del canale selezionato", answer: "2", numeric: true, hint: "Numera da zero le cifre cominciando a destra."},
      {label: "Spostamento a destra in bit", answer: "8", numeric: true, hint: "Ogni cifra esadecimale comprende quattro bit."}
    ],
    svolgimento: [
      "Da destra verso sinistra si leggono I0=1, I1=7, I2=B e I3=3.",
      "La sola corrispondenza con B è I2, perciò il selettore porta il codice binario 10, ossia 2.",
      "Fra il bordo destro e I2 si trovano otto bit. Spostando 0x3B71 a destra di otto si ottiene 0x3B, da cui la maschera 0x0F estrae B."
    ],
    figuraIII: {
      tipo: "bit",
      titolo: "Dal valore osservato al canale",
      etichette: ["uscita", "gruppo trovato", "selettore"],
      righe: ["1011", "1011", "10"],
      mostra: [0, 2, 3],
      note: ["Il valore osservato è un gruppo di quattro bit.", "Nella parola i gruppi sono 3, B, 7 e 1, da sinistra.", "Contando da destra, B occupa I2.", "Una selezione pari a due salta otto posizioni."]
    }
  });
  prova('3.1',3,'Interpretare riporto e prestito a otto bit',3,'AL e CL contengono ciascuno un byte, cioè otto bit, capace di rappresentare gli interi senza segno da 0 a 255. ADD AL,CL calcola AL+CL e SUB AL,CL calcola AL−CL, conservando il risultato in AL. Per mantenerlo nel byte si aggiunge o sottrae un multiplo di 256: questo è il resto modulo 256. Il flag CF è un indicatore di un bit; nella convenzione x86 vale 1 per un riporto oltre 255 durante ADD oppure per un prestito durante SUB, quando il primo operando senza segno è minore del secondo. SETC raccoglie CF e MOVZX riporta il byte come valore senza segno.',[[235,42,1],[19,53,0]],(a,b,add)=>{
    const t=add?a+b:a-b, r=t&255,c=add?+(t>255):+(t<0);
    return variante('Con AL='+a+' e CL='+b+' esegui '+(add?'ADD AL,CL':'SUB AL,CL')+'. Ricava il risultato a otto bit e CF secondo la convenzione x86 per operandi senza segno.',
      [numero('AL finale',r,'Riduci il risultato modulo 256.'),numero('CF',c,add?'Controlla il nono bit della somma.':'Confronta minuendo e sottraendo senza segno.')],
      ['L’operazione matematica produce '+a+(add?' + ':' − ')+b+' = '+t+'.','La parola da otto bit conserva '+hex(r)+' ('+r+' in decimale).',add?'Il totale supera 255. CF registra il riporto uscente e vale '+c+'.':'Il minuendo è minore del sottraendo. CF registra il prestito e vale '+c+'.'],
      asm(add?'add al, cl':'sub al, cl','setc dl','movzx eax, al','movzx edx, dl')); });
  prova('3.1',4,'Separare overflow, zero e segno dell’ALU',6,'Gli otto bit di AL possono essere letti senza segno, da 0 a 255, oppure in complemento a due, da −128 a 127: in questa seconda lettura il bit più alto pesa −128. Dopo ADD, ZF vale 1 quando il byte risultato è zero e SF copia il bit più alto. OF vale 1 se la somma matematica degli operandi con segno cade fuori dall’intervallo −128…127; CF registra invece il riporto dell’addizione senza segno. I due indicatori rispondono quindi a confronti diversi. Le istruzioni SETZ, SETS, SETO e SETC conservano in un byte il valore del rispettivo flag.',[[127,1]],(a,b)=>{
    const r=(a+b)&255,o=+(segno8(a)+segno8(b)>127||segno8(a)+segno8(b)<-128);
    return variante('Somma AL='+hex(a)+' e CL='+hex(b)+' su otto bit. Conserva il risultato e ricava i segnali ZF, SF e OF. Il frammento raccoglie i tre flag prima di una nuova operazione aritmetica.',
      [numero('Risultato senza segno',r,'Conserva gli otto bit inferiori.'),numero('ZF',+(r===0),'Verifica tutti gli otto bit del risultato.'),numero('SF',r>>7,'Leggi il bit sette.'),numero('OF',o,'Interpreta entrambi gli operandi in complemento a due.')],
      ['La somma senza segno vale '+(a+b)+' e la parola risultante è '+hex(r)+'.','Il bit alto è '+(r>>7)+' e il confronto della parola con zero vale '+Number(r===0)+'.','Con segno si sommano '+segno8(a)+' e '+segno8(b)+'. Il totale '+(segno8(a)+segno8(b))+' dà OF='+o+' rispetto a [−128,127].'],
      asm('add al, cl','setz dl','sets r8b','seto r9b','movzx eax, al')); },
  {
    consegna: "Un rapporto di prova afferma che, quando un’addizione su AL produce zero, CF e OF debbano coincidere. Usa AL=0xFF e CL=0x01 per valutare l’affermazione. Determina i due flag e scegli l’interpretazione che giustifica la loro relazione.",
    campi: [
      {label: "CF", answer: "1", numeric: true, hint: "Somma 255 e 1 senza segno e controlla il riporto oltre il byte."},
      {label: "OF", answer: "0", numeric: true, hint: "Interpreta 0xFF e 0x01 come interi con segno."},
      {label: "Lettura dei due flag", answer: "Il riporto riguarda la somma senza segno", choices: ["Il riporto riguarda la somma senza segno", "Lo zero forza entrambi i flag a uno", "Il bit più alto del risultato determina entrambi i flag"], hint: "Confronta il limite 255 con l’intervallo da −128 a 127."}
    ],
    svolgimento: [
      "La somma senza segno vale 255 + 1 = 256. Gli otto bit scritti sono tutti zero e dal byte esce un riporto, dunque CF=1.",
      "In complemento a due gli stessi byte valgono −1 e +1. Il risultato zero è rappresentabile, quindi OF=0.",
      "L’esempio fornisce uno zero con due flag diversi. CF descrive il riporto senza segno, OF segnala lo sconfinamento con segno. L’affermazione del rapporto è smentita."
    ],
    figuraIII: {
      tipo: "bit",
      titolo: "Lo stesso zero, due letture",
      etichette: ["AL prima", "CL", "AL dopo ADD"],
      righe: ["11111111", "00000001", "00000000"],
      mostra: [0, 0, 1],
      note: ["Il rapporto mette a confronto CF e OF.", "La somma senza segno richiede un nono bit.", "Con segno si ottiene −1 + 1 = 0.", "CF = 1 e OF = 0."]
    },
    codice: "add al, cl\nsetc dl\nseto r8b"
  });
  function sr(q,s,r){return s?1:r?0:q;}
  const srAsm = asm('mov eax, edi','or eax, esi','mov ecx, edx','xor ecx, 1','and eax, ecx');
  prova('3.1',5,'Seguire due impulsi su un latch SR',1,'Un latch è una cella che conserva un bit Q, una cifra 0 oppure 1, anche dopo la fine di un comando. Nel latch SR, S significa set e scrive 1, mentre R significa reset e scrive 0; un comando attivo vale 1. Con (S,R)=00 la cella conserva il valore precedente. La versione a NOR usa porte che producono 0 appena un ingresso vale 1, collegate in retroazione: ciascuna uscita contribuisce a mantenere l’altra. Nei tre casi ammessi, 00, 10 e 01, il nuovo stato è (Q OR S) AND (1 XOR R). OR richiede almeno un 1, AND entrambi e XOR con 1 scambia 0 e 1. Lo stato ottenuto al primo intervallo diventa l’ingresso del successivo.',[[0,1,0,0,0]],(q,s,r,u,v)=>{
    const x=sr(q,s,r),y=sr(x,u,v);
    return variante('Sono ammesse le combinazioni (S,R) pari a (0,0), (1,0) e (0,1). Lo stato iniziale è Q='+q+'. Applica e lascia stabilizzare prima (S,R)=('+s+','+r+'), poi ('+u+','+v+'). Per ciascun intervallo il frammento riceve Q,S,R in EDI,ESI,EDX e produce Q successivo in EAX.',
      [numero('Q dopo il primo intervallo',x,'S pone a uno, R azzera.'),numero('Q dopo il secondo intervallo',y,'Con entrambi gli ingressi a zero ricopia lo stato precedente.')],
      ['Il primo comando è '+(s?'set':'reset')+' e forza Q a '+x+'.','Prima del secondo calcolo si porta '+x+' in EDI e si azzerano ESI ed EDX.','S e R bassi lasciano attiva la retroazione. Il valore finale è '+y+'. La formula vale per le tre combinazioni ammesse.'],srAsm); },
  {
    consegna: "Porta a uno un latch SR a NOR il cui stato iniziale è sconosciuto, poi disattiva entrambi i comandi senza perdere il bit. Il circuito si stabilizza fra un intervallo e il successivo. La coppia 11 è esclusa. Indica i due comandi (S,R) nell’ordine e il valore finale di Q.",
    campi: [
      {label: "Primo comando (S,R)", answer: "10", choices: ["00", "10", "01"], hint: "Il primo comando deve garantire Q=1 anche quando Q parte da zero."},
      {label: "Secondo comando (S,R)", answer: "00", choices: ["01", "00", "10"], hint: "La consegna richiede che al secondo intervallo entrambi gli ingressi siano bassi."},
      {label: "Q finale", answer: "1", numeric: true, hint: "Con il comando di mantenimento si conserva l’ultimo valore stabile."}
    ],
    svolgimento: [
      "Se lo stato iniziale fosse zero, il mantenimento lo lascerebbe zero. Per scrivere con certezza uno si usa S=1 e R=0.",
      "Dopo l’assestamento Q vale 1 per entrambi gli stati iniziali possibili. Il secondo comando deve liberare i due ingressi, perciò S=0 e R=0.",
      "La retroazione mantiene l’ultimo stato stabile. La sequenza 10, 00 soddisfa quindi entrambe le condizioni e lascia Q=1. Il frammento verifica un intervallo con Q, S e R in EDI, ESI ed EDX e restituisce Q′ in EAX. Per il secondo intervallo si usa il Q′ appena ottenuto."
    ],
    figuraIII: {
      tipo: "onde",
      titolo: "Scrittura seguita dal mantenimento",
      etichette: ["S", "R", "Q"],
      righe: [
        [null, 1, 0],
        [null, 0, 0],
        [null, 1, 1]
      ],
      mostra: [
        [0, 1, 2],
        [0, 1, 2],
        [0, 2, 3]
      ],
      note: ["Il valore iniziale di Q è ignoto.", "S attivo scrive il bit.", "Gli ingressi tornano bassi dopo l’assestamento.", "La retroazione conserva Q=1."],
      tempi: ["inizio", "scrittura", "riposo"]
    },
    codice: "mov eax, edi\nor eax, esi\nmov ecx, edx\nxor ecx, 1\nand eax, ecx"
  }, '3.2.2');
  prova('3.2',1,'Tradurre la tabella caratteristica SR',1,'Il latch SR è una memoria di un bit Q, una cifra 0 oppure 1. S attivo scrive 1, R attivo scrive 0 e con S=R=0 si conserva Q. Nella realizzazione a NOR ogni porta produce 0 appena un ingresso vale 1. Nei tre comandi ammessi 00, 10 e 01 le due uscite stabili sono complementari: una vale 1 quando l’altra vale 0. La formula Q′=(Q OR S) AND (1 XOR R) calcola il nuovo Q; OR richiede almeno un 1, AND entrambi, mentre XOR con 1 scambia i due valori. La coppia 11 deve essere esaminata sulle due porte fisiche, perché esce dal dominio della tabella che assume uscite complementari.',[[1,0,0]],(q,s,r)=>{
    const y=sr(q,s,r);
    return variante('Il latch SR a porte NOR ha Q='+q+', S='+s+', R='+r+'. S e R attivi insieme sono esclusi. Usa (Q OR S) AND (1 XOR R) per calcolare la coppia di uscite dopo l’assestamento. Ingressi Q,S,R in EDI,ESI,EDX.',
      [numero('Nuovo Q',y,'Valuta prima Q OR S.'),numero('Uscita complementare',1-y,'In uno stato stabile ammesso i due segnali sono complementari.')],
      ['Q OR S produce '+(q|s)+' e il complemento di R vale '+(1-r)+'.','L’AND dei due termini produce '+y+' sull’uscita Q.','L’altra porta fornisce '+(1-y)+'. La coppia corrisponde al comando '+(s?'di set':'di mantenimento')+'.'],
      srAsm+'\nmov edx, eax\nxor edx, 1'); },
  {
    consegna: "Un programma estende la formula Q′=(Q OR S) AND (1 XOR R) a tutte e quattro le coppie di ingresso di un latch SR a NOR. Esamina la coppia S=1, R=1. Quale Q′ calcola la formula? Durante l’applicazione simultanea dei due segnali, quale coppia (Q, Q̄) impongono realmente le porte? Scegli infine il limite da dichiarare.",
    campi: [
      {label: "Q′ della formula", answer: "0", numeric: true, hint: "Con R=1 il termine 1 XOR R vale zero."},
      {label: "Uscite delle due NOR con S=R=1", answer: "00", choices: ["00", "01", "10", "11"], hint: "Una NOR con un ingresso a uno ha uscita zero."},
      {label: "Dominio della tabella caratteristica", answer: "Le tre coppie 00, 10 e 01", choices: ["Tutte le quattro coppie", "Le tre coppie 00, 10 e 01"], hint: "Valuta quando le due uscite stabili sono complementari."}
    ],
    svolgimento: [
      "Poiché R=1, il fattore 1 XOR R vale zero e la formula dà Q′=0 qualunque fosse Q.",
      "Ciascuna NOR riceve un ingresso attivo. Durante l’applicazione di 11 entrambe le uscite valgono zero, anche quella indicata con Q̄. La coppia 00 rompe la complementarità.",
      "La tabella del latch bistabile si applica a 00, 10 e 01. Dopo il rilascio simultaneo di 11, il circuito reale può assestarsi in uno dei due stati in funzione dei ritardi. Il solo Q′ calcolato dalla formula è insufficiente a predirlo."
    ],
    quadro: [
      {titolo: "Verifica del dominio", nota: "Entrambe le porte NOR ricevono un ingresso esterno attivo.", celle: [["S", "1"], ["R", "1"]], tipo: "stato"},
      {titolo: "La formula per Q′", nota: "Il secondo fattore annulla il prodotto.", celle: [["1 XOR R", "0"], ["Q′", "0"]], tipo: "stato"},
      {titolo: "Le due uscite fisiche", nota: "Una NOR con un ingresso alto ha uscita bassa.", celle: [["Q", "0"], ["Q̄", "0"]], tipo: "confronto"},
      {titolo: "Coppie ammesse", nota: "La tabella bistabile richiede uscite stabili complementari.", celle: [["mantieni", "00"], ["set", "10"], ["reset", "01"]], tipo: "stato"}
    ]
  }, '3.2.2');
  prova('3.2',2,'Tracciare la finestra di trasparenza',2,'D è il bit proposto in ingresso, Q quello visibile in uscita e G il comando di apertura. Un latch D è trasparente durante tutto il livello G=1: ogni variazione di D raggiunge Q dopo il tempo di risposta della cella. Quando G scende a 0, Q conserva l’ultimo dato acquisito. Un flip-flop sul fronte di salita acquisisce invece D soltanto durante il passaggio G:0→1 e mantiene Q fra due fronti. Per ricostruire una traccia si usa a ogni intervallo il Q ottenuto al precedente, osservando se il dispositivo segue il livello oppure il solo evento di salita.',[[0,1,0,1]],(q,d1,d2,g2)=>{
    const x=d1,y=g2?d2:x;
    return variante('Un latch D parte da Q='+q+'. Nel primo intervallo G=1 e D='+d1+'. Nel secondo intervallo G='+g2+' e D='+d2+'. Gli ingressi si stabilizzano fra gli intervalli. Calcola Q dopo ciascun intervallo, usando il valore lasciato dal precedente.',
      [numero('Q dopo il primo intervallo',x,'Con il segnale G alto Q segue D.'),numero('Q dopo il secondo',y,'Con G=1 il latch segue il nuovo D, che nel secondo intervallo vale 0.')],
      ['Il primo segnale G alto rende il latch trasparente e porta Q a '+x+'.','Nel secondo intervallo G vale '+g2+'. La parola selezionata proviene '+(g2?'dal nuovo D.':'dalla retroazione.') ,'Il valore finale '+y+' si ottiene passando '+x+' come Q iniziale alla seconda esecuzione del frammento.'],
      asm('mov eax, edi','test edx, edx','cmovne eax, esi')); },
  {
    consegna: "Due dispositivi ideali partono entrambi da Q=0 e ricevono lo stesso D e lo stesso segnale G, inizialmente basso. D=0 quando G sale. In seguito D passa a 1 mentre G rimane alto e stabile. L’uscita X diventa 1 e l’uscita Y resta 0. Indica il dispositivo X e il valore che avrà Y se D resterà a 1 anche al successivo fronte di salita.",
    campi: [
      {label: "Dispositivo X", answer: "Latch trasparente sul livello alto", choices: ["Latch trasparente sul livello alto", "Flip-flop sul fronte di salita"], hint: "Guarda quale uscita cambia in assenza di un nuovo fronte."},
      {label: "Y dopo il successivo fronte di salita", answer: "1", numeric: true, hint: "Il flip-flop acquisisce il D presente al fronte successivo."}
    ],
    svolgimento: [
      "Quando G sale per la prima volta, D vale 0. Entrambi i dispositivi presentano allora Q=0.",
      "D varia mentre G rimane alto. X segue subito D e perciò si comporta come un latch trasparente. Y conserva il dato raccolto al fronte.",
      "Durante il passaggio successivo da basso ad alto D vale 1. Il flip-flop Y acquisisce quel valore e la sua uscita diventa 1."
    ],
    figuraIII: {
      tipo: "onde",
      titolo: "Riconoscere il dispositivo dalla traccia",
      etichette: ["G", "D", "X", "Y"],
      righe: [
        [0, 1, 1, 0, 1],
        [0, 0, 1, 1, 1],
        [0, 0, 1, 1, 1],
        [0, 0, 0, 0, 1]
      ],
      mostra: [
        [0, 0, 0, 3, 3],
        [0, 0, 0, 3, 3],
        [0, 1, 2, 3, 3],
        [0, 1, 2, 3, 3]
      ],
      note: ["I due dispositivi partono entrambi da zero.", "D è basso sul primo fronte di salita.", "Al livello alto X segue la variazione di D.", "Y cambia sul fronte di salita successivo."],
      tempi: ["inizio", "salita", "alto", "basso", "salita"]
    }
  });
  prova('3.2',3,'Riconoscere il fronte che campiona D',2,'Un flip-flop D conserva in Q un bit e acquisisce il dato D al fronte di salita del clock, il passaggio da 0 a 1. Il test è (1−clock precedente) AND clock attuale: AND vale 1 quando entrambi i termini valgono 1. Se il test vale 1 si sceglie D, altrimenti si conserva il vecchio Q. La ricostruzione dai due livelli assume che fra le osservazioni il clock cambi al massimo una volta. Nel listato XOR con 1 calcola il complemento e CMOVNE copia D quando il test è diverso da zero. Nella prova inversa la variazione di Q rivela l’evento di acquisizione sotto queste stesse ipotesi.',[[0,0,1,1]],(q,old,k,d)=>{
    const edge=+(old===0&&k===1);
    return variante('Q='+q+' in EDI, clock precedente '+old+' in ESI, clock attuale '+k+' in EDX e D='+d+' in ECX. Il flip-flop campiona sul fronte di salita. Calcola l’impulso di acquisizione e Q successivo.',
      [numero('Fronte di salita',edge,'Confronta la coppia di livelli con 0→1.'),numero('Q successivo',edge?d:q,'In presenza di un impulso il flip-flop campiona D. Fra due impulsi conserva Q.')],
      ['Il complemento del vecchio clock vale '+(1-old)+'.','La congiunzione con il nuovo clock vale '+edge+'. '+(edge?'Il dispositivo rileva un fronte di salita.':'Il passaggio da 1 a 0 è un fronte di discesa.'),'Il multiplexer sceglie '+(edge?'D':'Q precedente')+', quindi Q diventa '+(edge?d:q)+'.'],
      asm('mov eax, edi','xor esi, 1','and esi, edx','cmovne eax, ecx')); },
  {
    consegna: "Un flip-flop D ideale acquisisce soltanto sul fronte di salita. Prima dell’osservazione Q=1. Nell’intervallo fra due campioni di clock, D resta stabilmente a 0 e il clock può cambiare livello al massimo una volta. Al secondo campione Q vale 0. Ricostruisci i due livelli del clock e spiega quale osservazione giustifica la scelta.",
    campi: [
      {label: "Clock precedente e attuale", answer: "0 → 1", choices: ["0 → 0", "1 → 0", "0 → 1", "1 → 1"], hint: "Il cambiamento di Q richiede un’occasione di acquisizione."},
      {label: "Indizio decisivo", answer: "Q prende il valore di D", choices: ["D è basso per due campioni", "Q prende il valore di D", "Q e D erano inizialmente uguali"], hint: "La transizione si ricava confrontando due istanti."}
    ],
    svolgimento: [
      "Senza un fronte di salita, il flip-flop avrebbe conservato Q=1 per tutto l’intervallo.",
      "Il passaggio di Q da 1 a 0, con D stabile a 0, richiede quindi un’acquisizione. Essendo ammessa al massimo una transizione, il clock passa da 0 a 1.",
      "La coppia 1→0 è una discesa e le due coppie uguali sono livelli stabili. Tutte e tre avrebbero lasciato Q a 1."
    ],
    figuraIII: {
      tipo: "onde",
      titolo: "Ricostruire il clock dai campioni",
      etichette: ["D", "Q", "clock"],
      righe: [
        [0, 0],
        [1, 0],
        [0, 1]
      ],
      mostra: [
        [0, 0],
        [0, 0],
        [2, 2]
      ],
      note: ["Il clock è inizialmente nascosto.", "Q è cambiato, benché D sia rimasto basso.", "I due livelli precedono e seguono il fronte di salita.", "Gli altri tre abbinamenti avrebbero conservato Q=1."],
      tempi: ["prima", "dopo"]
    }
  });
  prova('3.2',4,'Aggiornare un registro a quattro bit',3,'Un registro è una memoria di più bit che acquisisce il proprio ingresso al fronte del clock, l’istante di aggiornamento comune alle sue celle. Quattro bit conservano gli interi da 0 a 15. L’incremento modulo 16 somma uno e conserva il resto della divisione per 16, perciò dopo 15 ritorna a zero. Il circuito prepara sia questo candidato sia il dato di caricamento, poi LOAD=1 sceglie il caricamento e LOAD=0 l’incremento. Per verificare il selettore mediante un test occorre scegliere due candidati diversi, così che il dato osservato identifichi il percorso effettivamente usato.',[[11,1]],(q,load)=>{
    const d=5, r=load?d:(q+1)&15;
    return variante('Un registro a quattro bit contiene '+q+' in EDI. Al fronte, se ESI=1 carica EDX=5, altrimenti incrementa modulo 16. ESI='+load+'. Trova sia il candidato incremento sia il dato acquisito.',
      [numero('Candidato incremento',(q+1)&15,'Somma uno e conserva il nibble basso.'),numero('Valore acquisito',r,'Applica la selezione solo dopo aver calcolato i due candidati.')],
      ['L’incrementatore genera '+q+' + 1, che su quattro bit vale '+((q+1)&15)+'.','Il dato da caricare vale 5. Il segnale di caricamento vale '+load+'.','Il selettore porta '+r+' all’ingresso del registro e il fronte lo rende visibile su Q.'],
      asm('lea eax, [rdi+1]','and eax, 15','test esi, esi','cmovne eax, edx')); },
  {
    consegna: "Due registri da quattro bit ricevono Q iniziale, il dato di caricamento 5 e il comando LOAD=1. Il registro sano carica 5. Un registro difettoso esegue sempre l’incremento modulo 16. Si può scegliere Q iniziale tra 4 e 15. Individua il solo test che distingue i due registri e indica entrambe le uscite.",
    campi: [
      {label: "Q iniziale da usare", answer: "15", choices: ["4", "15"], hint: "Il risultato dell’incremento deve differire dal dato 5."},
      {label: "Uscita sana", answer: "5", numeric: true, hint: "Il comando attivo sceglie il dato di caricamento."},
      {label: "Uscita difettosa", answer: "0", numeric: true, hint: "Su quattro bit, 15 + 1 ritorna a zero."}
    ],
    svolgimento: [
      "Con Q=4 il candidato incremento vale 5, uguale al dato di caricamento. Osservare 5 in uscita durante questa prova lascia i due dispositivi indistinguibili.",
      "Con Q=15, invece, l’incremento modulo 16 produce 0. I candidati del selettore sono ora 0 e 5.",
      "Con LOAD=1 il registro sano acquisisce 5, mentre il difettoso acquisisce 0. Una sola osservazione dopo questo fronte distingue le due realizzazioni."
    ],
    quadro: [
      {titolo: "Progettare il test", nota: "Il dato di caricamento è fissato a 5.", celle: [["LOAD", "1"], ["Q candidato A", "4"], ["Q candidato B", "15"]], tipo: "stato"},
      {titolo: "Un caso ambiguo", nota: "Con Q=4 le due implementazioni concordano.", celle: [["carica", "5"], ["incrementa", "5"]], tipo: "confronto"},
      {titolo: "Il caso al confine", nota: "In quattro bit il conteggio si avvolge dopo 15.", celle: [["Q", "1111"], ["Q + 1", "0000"]], tipo: "stato"},
      {titolo: "Osservare dopo il fronte", nota: "Con Q=15 le parole acquisite sono diverse.", celle: [["registro sano", "5"], ["sempre incrementa", "0"]], tipo: "confronto"}
    ],
    listato: "; EDI = Q, ESI = LOAD, EDX = 5\nlea eax, [rdi + 1]\nand eax, 15      ; uscita del registro difettoso"
  });
  prova('3.2',5,'Aggiornamento simultaneo con azzeramento prioritario',3,'Due registri comandati dallo stesso fronte acquisiscono contemporaneamente i valori calcolati dal vecchio stato. Un reset sincrono prioritario fa prevalere lo zero su entrambe le altre destinazioni.',[[3,9,0]],(a,b,reset)=>{
    const x=reset?0:b,y=reset?0:(a+1)&15;
    return variante('Due registri a quattro bit partono da A='+a+', B='+b+' (EDI,ESI). EDX contiene il bit di reset, qui pari a '+reset+'. Con reset 1 il fronte azzera entrambi i registri. Con reset 0 acquisiscono simultaneamente A←B e B←A+1 modulo 16.',
      [numero('A dopo il fronte',x,'Valuta prima il reset, poi usa il vecchio B.'),numero('B dopo il fronte',y,'L’incrementatore riceve il vecchio A.')],
      ['I candidati normali sono '+b+' per A e '+((a+1)&15)+' per B, entrambi calcolati dallo stato iniziale.','Il reset vale '+reset+' e seleziona '+(reset?'la coppia di zeri.':'la coppia dei candidati normali.'),'Dopo lo stesso fronte A='+x+' e B='+y+'. Il listato lascia i risultati in EAX e ECX.'],
      asm('mov eax, esi','lea ecx, [rdi+1]','and ecx, 15','xor r8d, r8d','test edx, edx','cmovne eax, r8d','cmovne ecx, r8d')); },
  {
    consegna: "Con reset a zero, due registri a quattro bit dovrebbero acquisire simultaneamente A←B e B←A+1. Il simulatore parte da A=12 e B=6 e stampa A=6, B=7 dopo il fronte. Il suo aggiornamento è scritto nelle due righe del listato. Individua il valore dal quale è stato ricavato 7 e indica il B che avrebbe prodotto il circuito.",
    campi: [
      {label: "A usato nella seconda riga", answer: "6", numeric: true, hint: "Esegui le assegnazioni del listato dall’alto verso il basso."},
      {label: "B corretto dopo il fronte", answer: "13", numeric: true, hint: "Calcola il candidato di B a partire da A prima della scrittura."},
      {label: "Correzione", answer: "Calcolare entrambi i candidati prima delle scritture", choices: ["Invertire soltanto le due righe", "Calcolare entrambi i candidati prima delle scritture", "Incrementare B di due"], hint: "Entrambi gli ingressi devono vedere lo stesso stato originario."}
    ],
    svolgimento: [
      "La prima assegnazione copia 6 in A. La seconda riga legge quell’A già aggiornato e scrive 6 + 1 = 7 in B.",
      "Al fronte reale i due ingressi sono pronti nello stesso istante. Il vecchio A vale 12, perciò B deve acquisire 12 + 1 = 13. Il nuovo A vale 6.",
      "Due temporanei, tA=B e tB=(A+1) modulo 16, conservano i candidati prima delle scritture. Copiandoli insieme si ottiene (6,13). Se al fronte il reset valesse uno, la priorità dell’azzeramento imporrebbe invece A=B=0."
    ],
    quadro: [
      {titolo: "Stato di partenza", nota: "Entrambi i registri usano quattro bit.", celle: [["A prima", "12"], ["B prima", "6"], ["reset", "0"]], tipo: "stato"},
      {titolo: "Listato sequenziale", nota: "Dopo la prima riga il vecchio A è già stato sostituito.", celle: [["A ← B", "6"], ["B ← A + 1", "7"]], tipo: "sequenza"},
      {titolo: "Ingressi prima del fronte", nota: "Il circuito calcola entrambi i dati sul vecchio stato.", celle: [["ingresso di A", "6"], ["ingresso di B", "13"]], tipo: "confronto"},
      {titolo: "Acquisizione simultanea", nota: "Due temporanei riproducono lo stesso fronte.", celle: [["A dopo", "6"], ["B dopo", "13"]], tipo: "stato"}
    ],
    listato: "A = B\nB = (A + 1) % 16"
  });
  prova('3.3',1,'Separare classe e funzione dal primo byte',2,'Un byte contiene otto bit e si scrive con due cifre esadecimali, ciascuna corrispondente a un gruppo di quattro bit chiamato nibble. Il prefisso 0x indica la base sedici. Nel primo byte Y86-64, icode è il nibble alto che seleziona la classe e ifun quello basso che sceglie la funzione entro quella classe. Spostare il byte a destra di quattro bit estrae icode; la AND con 15, ossia 0x0F, conserva ifun. Per comporre il byte si calcola 16×icode+ifun. Il significato di ifun dipende dalla classe: la stessa cifra va interpretata usando la tabella dell’operazione scelta.',[[0x63,'xorq']],(b,nome)=>
    variante('Il primo byte Y86-64 è '+hex(b)+'. Calcola i campi icode e ifun da inserire nelle risposte. Per OPq (classe 6) la funzione 3 è XOR. Per jXX (classe 7) la funzione 4 salta quando ZF=0.',
      [numero('icode',b>>4,'Sposta il byte di quattro posizioni verso destra.'),numero('ifun',b&15,'Applica la maschera 0x0F al byte originale.')],
      ['Il byte in binario è '+bin(b,8)+'.','Il nibble alto dà la classe '+(b>>4)+' e quello basso la funzione '+(b&15)+'.','La coppia identifica '+nome+'. La classe determina la presenza dei campi successivi.'],
      asm('mov eax, edi','shr eax, 4','mov edx, edi','and edx, 15')),
  {
    consegna: "Devi scrivere il primo byte di jne in una memoria Y86-64. La classe jXX ha icode=7, la funzione «diverso» ha ifun=4. Costruisci il byte da memorizzare. Se poi si vuole un salto incondizionato della stessa classe, per il quale ifun=0, indica quali quattro bit conservare.",
    campi: [
      {label: "Byte iniziale di jne", answer: "116", numeric: true, hint: "Il campo classe pesa sedici e quello funzione pesa uno."},
      {label: "Campo da conservare", answer: "Le quattro cifre binarie alte", choices: ["Le quattro cifre binarie alte", "Le quattro cifre binarie basse", "Tutte le otto cifre"], hint: "Il tipo di salto cambia mentre la classe resta jXX."},
      {label: "Byte del salto incondizionato", answer: "112", numeric: true, hint: "Inserisci zero nel nibble della funzione."}
    ],
    svolgimento: [
      "Il nibble alto deve contenere 7, cioè 0111, e quello basso 4, cioè 0100. Unendoli nell’ordine del formato si ottiene 01110100, ossia 0x74.",
      "Le due istruzioni appartengono entrambe alla classe jXX. Nel passaggio a jmp si conserva pertanto il nibble alto 0111.",
      "Con ifun=0 il gruppo basso diventa 0000. Il primo byte vale 0x70. L’indirizzo assoluto di salto occupa i successivi otto byte e resta un campo distinto."
    ],
    figuraIII: {
      tipo: "bit",
      titolo: "Comporre il primo byte Y86-64",
      etichette: ["icode", "ifun di jne", "byte di jne", "byte di jmp"],
      righe: ["0111", "0100", "01110100", "01110000"],
      mostra: [0, 0, 1, 3],
      note: ["La classe occupa le quattro posizioni alte.", "Il byte completo è 0111 0100.", "Le due istruzioni condividono la classe 7.", "Solo il gruppo di funzione cambia per jmp."]
    },
    codice: "; EDI = classe, ESI = funzione, entrambe fra 0 e 15\nmov eax, edi\nshl eax, 4\nor eax, esi"
  });
  prova('3.3',2,'Ricostruire lunghezza e confine di un’istruzione',2,'Il PC, contatore di programma, conserva l’indirizzo del primo byte dell’istruzione; un byte è un gruppo di otto bit. Il formato Y86-64 comprende sempre un byte di codice e, secondo l’operazione, un byte rA:rB che identifica i registri e una costante di otto byte. Con indicatori di presenza r e c, ciascuno pari a 0 oppure 1, la lunghezza è 1+r+8c. ValP è PC più questa lunghezza e indica il primo indirizzo dopo il codice. Per call quella posizione è anche l’indirizzo da salvare per il ritorno, mentre il bersaglio si trova nel campo di destinazione.',[[0x40,1,1,'irmovq']],(pc,r,c,nome)=>{
    const n=1+r+8*c;
    return variante(nome+' inizia al PC '+hex(pc)+'. EDI contiene il PC. I bit ESI ed EDX valgono 1 quando il formato include, rispettivamente, il byte rA:rB e la costante da otto byte. Per questa istruzione ESI='+r+' ed EDX='+c+'. Calcola la lunghezza in byte e il primo indirizzo successivo alla codifica.',
      [numero('Lunghezza (byte)',n,'Conta il byte di codice più i campi opzionali.'),numero('Indirizzo valP',pc+n,'Somma la lunghezza al primo indirizzo.')],
      ['Il primo byte occupa sempre una posizione. Il contributo dei registri è '+r+' byte.','La costante aggiunge '+8*c+' byte. La lunghezza totale è '+n+'.','Il PC sequenziale vale '+hex(pc)+' + '+n+' = '+hex(pc+n)+'. EAX restituisce la lunghezza ed ECX il PC sequenziale.'],
      asm('lea eax, [rsi+rdx*8+1]','lea ecx, [rdi+rax]')); },
  {
    consegna: "Un disassemblatore colloca call al PC 0xA0 e la successiva istruzione a 0xAA. Dichiara di aver contato il byte iniziale, un byte per i registri e otto per la destinazione. Nel formato Y86-64 di call compaiono soltanto il codice e l’indirizzo di destinazione. Trova il campo contato in eccesso e l’indirizzo corretto da salvare per il ritorno.",
    campi: [
      {label: "Campo contato in eccesso", answer: "rA:rB", choices: ["Byte iniziale", "rA:rB", "Destinazione a otto byte"], hint: "CALL ha un bersaglio esplicito e usa implicitamente la pila."},
      {label: "Indirizzo di ritorno corretto", answer: "169", numeric: true, hint: "Parti da 0xA0 e conta soltanto i byte effettivi."}
    ],
    svolgimento: [
      "Il primo byte si trova a 0xA0. La destinazione occupa gli otto indirizzi da 0xA1 a 0xA8 inclusi.",
      "Call usa implicitamente il puntatore alla pila. Il byte rA:rB contato dal disassemblatore è estraneo a questo formato.",
      "La lunghezza effettiva è 1 + 8 = 9. Il primo byte seguente si trova a 0xA9, che è il valore da salvare come indirizzo di ritorno. Il valore 0xAA sarebbe avanti di un byte."
    ],
    quadro: [
      {titolo: "Controllare il confine", nota: "Il disassemblatore propone un indirizzo da verificare.", celle: [["call", "0xA0"], ["prossima proposta", "0xAA"]], tipo: "stato"},
      {titolo: "Byte occupati", nota: "Il bersaglio è codificato subito dopo il primo byte.", celle: [["codice", "0xA0"], ["destinazione", "0xA1 … 0xA8"]], tipo: "sequenza"},
      {titolo: "Esaminare il formato", nota: "La pila è selezionata implicitamente.", celle: [["codice", "1 byte"], ["rA:rB", "assente"], ["destinazione", "8 byte"]], tipo: "stato"},
      {titolo: "Primo byte libero", nota: "Questo indirizzo viene salvato per il ritorno.", celle: [["PC iniziale", "0xA0"], ["lunghezza", "9"], ["valP", "0xA9"]], tipo: "sequenza"}
    ]
  });
  prova('3.3',3,'Decodificare i due registri di OPq',3,'I registri sono piccole memorie interne identificate da numeri. Nel byte rA:rB di Y86-64, il gruppo alto di quattro bit, detto nibble, contiene l’identificatore rA e quello basso rB. I segnali srcA e srcB selezionano i due registri da leggere. OPq è la classe delle operazioni aritmetiche e logiche: usa entrambi i contenuti e conserva il risultato dell’ALU, l’unità di calcolo, nel secondo registro, perciò dstE coincide con rB. Scambiare i due campi cambia quindi la destinazione anche per una somma il cui valore numerico resti uguale.',[[0x23]],(rb)=>{
    const a=rb>>4,b=rb&15;
    return variante('In OPq rA,rB il secondo byte è '+hex(rb)+' in EDI. Gli identificatori 0,1,2,3 rappresentano %rax,%rcx,%rdx,%rbx. Determina srcA, srcB e la destinazione dstE.',
      [numero('srcA',a,'Il primo registro occupa i quattro bit alti.'),numero('srcB',b,'Estrai i quattro bit bassi.'),numero('dstE',b,'OPq aggiorna il secondo operando.')],
      ['La scomposizione '+bin(rb,8)+' dà rA='+a+' e rB='+b+'.','Le due porte di lettura ricevono rispettivamente '+a+' e '+b+'.','L’ALU invia il risultato al secondo registro. Il listato restituisce srcA in EAX, srcB in EDX, dstE in ECX.'],
      asm('mov eax, edi','shr eax, 4','mov edx, edi','and edx, 15','mov ecx, edx')); },
  {
    consegna: "In Y86-64 si vuole eseguire addq %rcx,%rdx e lasciare invariato %rcx. I registri hanno identificatori %rax=0, %rcx=1, %rdx=2 e %rbx=3. Il primo byte, già scritto, è 0x60. Scegli il secondo byte. Supponendo %rcx=4 e %rdx=9, determina quale registro cambia e il valore che conserva l’altro.",
    campi: [
      {label: "Byte rA:rB", answer: "0x12", choices: ["0x12", "0x21", "0x60"], hint: "La sorgente occupa il nibble alto, la destinazione quello basso."},
      {label: "Registro che riceve 13", answer: "%rdx", choices: ["%rax", "%rcx", "%rdx"], hint: "OPq scrive nel secondo registro."},
      {label: "Valore finale del registro conservato", answer: "4", numeric: true, hint: "Il sommatore legge il primo operando senza riscriverlo."}
    ],
    svolgimento: [
      "Nel byte dei registri la prima posizione esadecimale designa rA=%rcx con identificatore 1. La seconda designa rB=%rdx con identificatore 2. Il byte richiesto è 0x12.",
      "L’ALU calcola 9 + 4 = 13. L’indirizzo di scrittura è rB, perciò %rdx assume il valore 13.",
      "Il registro %rcx fornisce un operando e conserva 4. Scegliendo 0x21 il numero della somma sarebbe ancora 13 e la scrittura raggiungerebbe %rcx."
    ],
    figuraIII: {
      tipo: "bit",
      titolo: "Scegliere la destinazione di OPq",
      etichette: ["byte operazione", "rA · RCX", "rB · RDX", "byte registri"],
      righe: ["01100000", "0001", "0010", "00010010"],
      mostra: [0, 1, 1, 2],
      note: ["Il primo byte indica già una addq.", "Il gruppo alto individua RCX e quello basso RDX.", "Il nibble basso alimenta l’indirizzo di scrittura.", "La scrittura aggiorna RDX e conserva RCX."]
    }
  });
  prova('3.3',4,'Sottrarre nell’ordine previsto da subq',1,'In Y86-64 subq rA,rB legge i due registri, piccole memorie interne, e conserva in rB la differenza contenuto(rB)−contenuto(rA). ValA e valB sono i nomi assegnati ai due valori letti. ZF è un indicatore che vale 1 quando il risultato è zero; SF copia il bit più alto e descrive il segno nella rappresentazione in complemento a due. Gli operandi proposti mantengono il risultato entro l’intervallo con segno a 64 bit. Il frammento x86 usa la sintassi Intel, con destinazione al primo posto: per riprodurre subq copia prima il secondo valore in RAX e sottrae il primo.',[[8,3]],(a,b)=>{
    const r=b-a;return variante('Y86-64 esegue subq %rax,%rbx con %rax='+a+' e %rbx='+b+'. Nel frammento x86-64 RDI rappresenta il primo operando e RSI il secondo. Leggi il risultato con segno.',
      [numero('Nuovo %rbx',r,'Calcola valB − valA.'),numero('ZF',+(r===0),'Confronta la parola risultante con zero.'),numero('SF',+(r<0),'Controlla il segno del risultato a 64 bit.')],
      ['La destinazione dispone inizialmente di '+b+'. Si sottrae il contenuto '+a+' della sorgente.','Il calcolo '+b+' − '+a+' produce '+r+' e resta entro l’intervallo con segno a 64 bit.','Risultano '+cc(r===0,r<0,0)+'. SUB realizza lo stesso ordine degli operandi dopo aver copiato RSI in RAX.'],
      asm('mov rax, rsi','sub rax, rdi','setz dl','sets cl','seto r8b')); },
  {
    consegna: "Un modello difettoso di subq rA,rB calcola valA − valB. Con rA=rB=11 la prova passa anche sul modello corretto. Sono disponibili due nuove coppie (rA,rB), (7,7) e (3,8). Scegli il test che discrimina le due macchine e calcola la coppia dei risultati con segno, nell’ordine macchina corretta e macchina difettosa.",
    campi: [
      {label: "Coppia di test (rA,rB)", answer: "(3,8)", choices: ["(7,7)", "(3,8)"], hint: "Se i valori coincidono, entrambe le sottrazioni danno zero."},
      {label: "Risultato corretto", answer: "5", numeric: true, hint: "In Y86 subq sottrae la sorgente dal valore della destinazione."},
      {label: "Risultato difettoso", answer: "-5", numeric: true, hint: "Scambia l’ordine dei due valori."}
    ],
    svolgimento: [
      "Con la coppia (7,7) sia 7 − 7 sia la sottrazione invertita valgono zero. Il test lascerebbe passare il difetto.",
      "Con (3,8) la macchina corretta sottrae il contenuto di rA da quello di rB. Il risultato scritto in rB è 8 − 3 = 5.",
      "Il modello difettoso scrive 3 − 8 = −5. Anche il flag di segno separa i due casi, perché solo −5 ha il bit più alto a uno."
    ],
    quadro: [
      {titolo: "Un errore invisibile con operandi uguali", nota: "Il modello scambia i due ingressi della sottrazione.", celle: [["prova A", "7, 7"], ["prova B", "3, 8"]], tipo: "confronto"},
      {titolo: "La coppia uguale", nota: "Lo scambio produce ancora zero.", celle: [["rB − rA", "0"], ["rA − rB", "0"]], tipo: "confronto"},
      {titolo: "La macchina corretta", nota: "La destinazione rB vale inizialmente otto.", celle: [["valB", "8"], ["valA", "3"], ["risultato", "5"]], tipo: "sequenza"},
      {titolo: "Esito del test (3,8)", nota: "I segni dei risultati si separano.", celle: [["corretta", "5"], ["difettosa", "−5"]], tipo: "confronto"}
    ],
    listato: "; RDI contiene rA, RSI contiene rB\nmov rax, rdi\nsub rax, rsi     ; modello da sottoporre a prova"
  });
  prova('3.3',5,'Separare l’indirizzo dal valore di un carico',3,'La memoria assegna un indirizzo a ciascun byte, gruppo di otto bit. Un carico copia una parola dalla memoria in un registro, una piccola memoria interna del processore. In mrmovq D(%rbx),%rax, la base è il contenuto di %rbx e D è lo spostamento con segno: la loro somma forma l’indirizzo valE. La lettura degli otto byte consecutivi restituisce valM, il contenuto da scrivere in %rax. Il PC indica invece la posizione del codice: questa istruzione occupa dieci byte, così che il successore sequenziale è PC+10. I numeri preceduti da 0x sono in base sedici.',[[0x60,16,0x42,0x80]],(b,d,val,pc)=>{
    const addr=b+d;return variante('Al PC '+hex(pc)+' si trova mrmovq '+d+'(%rbx),%rax. %rbx='+hex(b)+' e la parola all’indirizzo %rbx+D vale '+hex(val)+'. Nel frammento RDI contiene il valore di %rbx, RSI lo spostamento e R8 il PC Y86 iniziale. RCX punta al byte zero della memoria Y86 simulata.',
      [numero('valE',addr,'Somma il valore del registro base e lo spostamento con segno.'),numero('Nuovo %rax',val,'Il dato proviene dagli otto byte indirizzati da valE.'),numero('Nuovo PC',pc+10,'mrmovq contiene codice, registri e spostamento a 64 bit.')],
      ['L’indirizzo effettivo si ottiene come '+hex(b)+' + ('+d+') = '+hex(addr)+'.','Gli otto byte da '+hex(addr)+' a '+hex(addr+7)+' compongono valM='+hex(val)+', che viene scritto in %rax.','La lunghezza è 1 + 1 + 8 = 10 byte. Da '+hex(pc)+' si passa a '+hex(pc+10)+'. Il listato riceve il PC iniziale in R8 e restituisce il nuovo PC nello stesso registro.'],
      asm('lea rdx, [rdi+rsi]','mov rax, qword ptr [rcx+rdx]','add r8, 10')); },
  {
    consegna: "Una mrmovq −8(%rbx),%rax parte dal PC 0x30 con %rbx=0xA0. La parola agli indirizzi 0x98…0x9F vale 0x39. Il registro di prova del simulatore annota valE=0x98, valM=0x39, %rax dopo la scrittura=0x98, nuovo PC=0x3A. Individua il primo passaggio errato e il valore con cui correggerlo.",
    campi: [
      {label: "Primo passaggio errato", answer: "Scrittura nel registro", choices: ["Calcolo di valE", "Lettura di valM", "Scrittura nel registro", "Avanzamento del PC"], hint: "Un indirizzo e il dato che vi è memorizzato hanno ruoli distinti."},
      {label: "Valore corretto di %rax", answer: "57", numeric: true, hint: "mrmovq scrive nel registro il valore letto dalla memoria."}
    ],
    svolgimento: [
      "L’indirizzo effettivo è 0xA0 − 8 = 0x98. La prima annotazione è coerente. La parola a quell’indirizzo vale 0x39, perciò è coerente anche valM.",
      "La porta di scrittura del carico deve selezionare valM. Quando compare 0x98 in %rax, è stato scelto valE, l’indirizzo. La prima divergenza è quindi la scrittura nel registro.",
      "Sostituendo il risultato con 0x39 si ripristina la semantica del carico. Il PC 0x3A è già corretto, perché 0x30 + 10 = 0x3A."
    ],
    quadro: [
      {titolo: "Traccia riportata", nota: "Verifica i passaggi nell’ordine di produzione.", celle: [["valE", "0x98"], ["valM", "0x39"], ["%rax", "0x98"], ["PC", "0x3A"]], tipo: "sequenza"},
      {titolo: "Formazione e lettura", nota: "Entrambi i valori concordano con i dati iniziali.", celle: [["0xA0 − 8", "0x98"], ["parola a 0x98", "0x39"]], tipo: "stato"},
      {titolo: "La prima divergenza", nota: "Il registro ha ricevuto l’indirizzo usato dalla memoria.", celle: [["porta scelta", "valE"], ["porta richiesta", "valM"]], tipo: "confronto"},
      {titolo: "Stato corretto", nota: "L’indirizzo sequenziale era già corretto.", celle: [["%rax", "0x39"], ["PC", "0x3A"]], tipo: "stato"}
    ]
  });
  prova('3.4',1,'Confrontare le due direzioni dello stack',2,'La pila, chiamata anche stack, conserva dati che vengono recuperati nell’ordine inverso al deposito. Il registro %rsp contiene l’indirizzo della cima e ogni parola occupa otto byte consecutivi. Poiché la pila cresce verso indirizzi minori, pushq calcola nuova cima=vecchia cima−8 e scrive lì il dato; popq legge invece dalla vecchia cima e prepara nuova cima=vecchia cima+8. AluA è la costante −8 o +8 fornita all’unità di calcolo; valE è il nuovo puntatore e mem_addr l’indirizzo effettivo della lettura o scrittura. Confrontare questi ultimi due valori permette di verificare il selettore.',[[0x80,1],[0xA8,0]],(sp,push)=>{
    const delta=push?-8:8, nuovo=sp+delta,addr=push?nuovo:sp;
    return variante('Il vecchio %rsp vale '+hex(sp)+' in RDI. SEQ esegue '+(push?'pushq %rax':'popq %rax')+'. Identifica l’ingresso costante dell’ALU, il nuovo puntatore e l’indirizzo dei dati. La pila usa parole da otto byte.',
      [numero('aluA',delta,'La pila cresce verso gli indirizzi minori.'),numero('valE',nuovo,'Somma la costante al vecchio puntatore.'),numero('mem_addr',addr,'La scrittura usa la nuova cima, la lettura quella vecchia.')],
      [push?'Una push riserva otto byte prima della scrittura.':'Una pop libera otto byte dopo la lettura.','L’ALU calcola '+hex(sp)+' + ('+delta+') = '+hex(nuovo)+'.', (push?'La scrittura seleziona valE':'La lettura seleziona il vecchio %rsp')+' e accede a '+hex(addr)+'. Il frammento restituisce il puntatore in RAX e l’indirizzo in RDX.'],
      asm(push?'lea rax, [rdi-8]':'lea rax, [rdi+8]',push?'mov rdx, rax':'mov rdx, rdi')); });
  prova('3.4',2,'Verificare tutti i byte di un accesso',4,'Una parola di otto byte occupa otto indirizzi consecutivi a partire dalla base effettiva. Anche l’ultimo byte deve appartenere all’intervallo allocato.',[[53,3,64]],(b,d,size)=>{
    const a=b+d,last=a+7,ok=+(a>=0&&last<size);
    return variante('Una memoria di '+size+' byte è indicizzata da 0 a '+(size-1)+'. La lettura di una parola da otto byte usa base '+b+' in RDI e spostamento '+d+' in RSI. Determina l’ultimo indirizzo e il bit di validità. Per questi ingressi l’indirizzo iniziale è positivo e rappresentabile.',
      [numero('Ultimo indirizzo richiesto',last,'Somma sette al primo indirizzo della parola.'),numero('Valido (0/1)',ok,'L’ultimo indirizzo deve essere strettamente minore della dimensione.')],
      ['La base più lo spostamento produce '+a+'.','Gli otto indirizzi formano l’intervallo ['+a+', '+last+'].','Il limite superiore disponibile è '+(size-1)+'. Il confronto senza segno dà '+ok+' e lo stato è '+(ok?'AOK.':'ADR.')],
      asm('lea rdx, [rdi+rsi+7]','cmp rdx, '+size,'setb al','movzx eax, al')); },
  {
    consegna: "La memoria contiene gli indirizzi da 0 a 63. Una routine deve leggere otto byte consecutivi a partire da 40 + D, dove D è uno spostamento intero non negativo. Trova il massimo D ammesso e il primo byte che esce dalla memoria se si aumenta D di uno.",
    campi: [
      {label: "Massimo D ammesso", answer: "16", numeric: true, hint: "Il primo indirizzo può arrivare al massimo a 64 − 8."},
      {label: "Primo indirizzo fuori memoria per D + 1", answer: "64", numeric: true, hint: "Con la prima base invalida, controlla l’ultimo byte della lettura."}
    ],
    svolgimento: [
      "L’ultima posizione richiesta è 40 + D + 7. Una lettura interamente valida impone 40 + D + 7 ≤ 63.",
      "Sottraendo 47 da entrambi i membri si ottiene D ≤ 16. Con D=16 la lettura copre 56…63 e tocca esattamente il limite.",
      "Con D=17 la base diventa 57 e la richiesta arriva a 64. I primi sette byte appartengono alla memoria e il byte all’indirizzo 64 produce ADR."
    ],
    quadro: [
      {titolo: "Lettura alla frontiera", nota: "D è la quantità da dimensionare.", celle: [["base disponibile", "40"], ["ampiezza", "8 byte"], ["ultimo ammesso", "63"]], tipo: "stato"},
      {titolo: "Imporre il limite", nota: "Si controlla l’ottavo byte.", celle: [["ultimo richiesto", "47 + D"], ["condizione", "≤ 63"]], tipo: "stato"},
      {titolo: "Ultimo caso valido", nota: "Tutti gli indirizzi restano nella memoria.", celle: [["D", "16"], ["intervallo", "56 … 63"]], tipo: "stato"},
      {titolo: "Primo caso invalido", nota: "L’intervallo si sposta di una posizione.", celle: [["D", "17"], ["intervallo", "57 … 64"], ["esito", "ADR"]], tipo: "stato"}
    ]
  });
  prova('3.4',3,'Comporre il vettore di controllo SEQ',4,'Il decodificatore riconosce la classe dell’istruzione dai quattro bit alti del primo byte. Nel sottoinsieme proposto la classe 5, mrmovq, legge un dato dalla memoria; la classe 4, rmmovq, scrive in memoria; la classe 6, OPq, esegue un’operazione aritmetica o logica. I segnali mem_read, mem_write e set_cc valgono 1 per abilitare rispettivamente lettura, scrittura e aggiornamento degli indicatori del risultato, chiamati codici di condizione. Impacchettarli nell’ordine indicato assegna loro pesi 4, 2 e 1, quindi il valore numerico è 4·mem_read+2·mem_write+set_cc.',[[0x50,1,0,0]],(byte,rd,wr,flags)=>{
    const v=(rd<<2)|(wr<<1)|flags;
    return variante('Il byte iniziale è '+hex(byte)+'. Nel sottoinsieme in esame le classi 5, 4 e 6 significano mrmovq, rmmovq e OPq. Calcola mem_read e mem_write, poi il valore decimale del vettore [mem_read, mem_write, set_cc], ordinato dai bit 2 a 0.',
      [numero('mem_read',rd,'Il carico preleva dalla memoria dati.'),numero('mem_write',wr,'Il deposito trasferisce un registro alla memoria.'),numero('Vettore impacchettato',v,'Assegna pesi 4, 2 e 1 ai tre segnali.')],
      ['Dal nibble alto si ricava icode='+(byte>>4)+'.','La classe richiede '+(rd?'una lettura dati.':'una scrittura dati.')+' Il segnale dei codici di condizione vale zero.','Il vettore è '+bin(v,3)+', ossia '+v+'. Le tre SETE producono i singoli bit e le LEA assegnano i pesi.'],
      asm('shr edi, 4','xor eax, eax','xor ecx, ecx','xor edx, edx','cmp edi, 5','sete al','cmp edi, 4','sete cl','cmp edi, 6','sete dl','lea eax, [rdx+rax*4]','lea eax, [rax+rcx*2]')); },
  {
    consegna: "Il decodificatore riceve il byte 0x40, che designa rmmovq. Sul filo di controllo compare il vettore 110, ordinato come mem_read, mem_write, set_cc. Per questa istruzione la memoria dati deve ricevere il valore del registro. Individua il singolo bit da spegnere e scrivi il vettore corretto come numero decimale.",
    campi: [
      {label: "Segnale da spegnere", answer: "mem_read", choices: ["mem_read", "mem_write", "set_cc"], hint: "Un deposito scrive il dato sulla porta di memoria."},
      {label: "Vettore corretto in decimale", answer: "2", numeric: true, hint: "I pesi dei tre segnali, da sinistra, sono 4, 2 e 1."}
    ],
    svolgimento: [
      "Il gruppo alto di 0x40 è 4. La classe rmmovq deposita in memoria il contenuto di un registro e richiede mem_write=1.",
      "Il vettore 110 abilita insieme lettura e scrittura. La modifica minima è porre mem_read a 0, conservando il bit di scrittura e set_cc=0.",
      "Il vettore corretto è 010. I pesi 4, 2 e 1 forniscono 0×4 + 1×2 + 0×1 = 2."
    ],
    figuraIII: {
      tipo: "bit",
      titolo: "Diagnosi del vettore di controllo",
      etichette: ["rilevato", "atteso", "bit discordi"],
      righe: ["110", "010", "100"],
      mostra: [0, 2, 3],
      note: ["L’ordine è lettura, scrittura, codici di condizione.", "Il byte 0x40 identifica un deposito in memoria.", "Si disabilita la lettura.", "Le due parole differiscono soltanto nel bit di peso 4."]
    },
    codice: "; EDI contiene il vettore osservato 110 in base due\nmov eax, edi\nand eax, 3       ; conserva mem_write e set_cc"
  });
  prova('3.4',4,'Trovare il percorso che fissa il periodo',3,'Un segnale richiede tempo per attraversare un circuito; il picosecondo, ps, è un millesimo di miliardesimo di secondo. Nei blocchi in serie l’uscita del primo alimenta il secondo, perciò i ritardi si sommano. Rami paralleli iniziano insieme e il risultato complessivo deve attendere quello più lento, chiamato cammino critico. Fra due registri si aggiungono il ritardo clock→Q, necessario al registro iniziale per produrre l’uscita dopo il fronte, e il setup, anticipo di stabilità richiesto dal registro finale. Il periodo minimo somma una volta il costo comune al maggiore dei ritardi dei rami; la verifica va ripetuta dopo ogni modifica.',[[85,65,45,12]],(a,b,c,g)=>{
    const x=a+b,k=Math.max(x,c);
    return variante('Due percorsi fra registri sono in parallelo. Il primo contiene due blocchi in serie di '+a+' e '+b+' ps (EDI,ESI), il secondo un blocco di '+c+' ps (EDX). Il costo comune di clock→Q e setup ammonta a '+g+' ps (ECX). Calcola il ritardo combinatorio peggiore e il periodo minimo del clock.',
      [numero('Cammino combinatorio critico (ps)',k,'Confronta la somma del primo ramo con il secondo ramo.'),numero('Periodo minimo (ps)',k+g,'Aggiungi il costo comune una volta sola.')],
      ['Il ramo in serie richiede '+a+' + '+b+' = '+x+' ps.','Il massimo fra '+x+' e '+c+' è '+k+' ps. I due rami lavorano nello stesso intervallo.','Aggiungendo '+g+' ps per i registri si ottiene un periodo minimo di '+(k+g)+' ps. Il listato conserva il massimo con CMOVB.'],
      asm('lea eax, [rdi+rsi]','cmp eax, edx','cmovb eax, edx','add eax, ecx')); },
  {
    consegna: "Un circuito presenta due rami paralleli. Il ramo X contiene due blocchi di 42 e 48 ps, il ramo Y richiede 96 ps. Ai rami si aggiungono 18 ps comuni per i registri. Si richiede un periodo massimo di 111 ps. Il budget consente di ridurre di 5 ps un solo blocco. Individua il ramo sul quale intervenire e verifica il nuovo periodo minimo.",
    campi: [
      {label: "Ramo su cui intervenire", answer: "Y", choices: ["X", "Y"], hint: "Confronta i due tempi di arrivo prima di applicare la riduzione."},
      {label: "Nuovo periodo minimo (ps)", answer: "109", numeric: true, hint: "Dopo la riduzione confronta nuovamente i rami prima di aggiungere il costo comune."}
    ],
    svolgimento: [
      "X impiega 42 + 48 = 90 ps, Y impiega 96 ps. Il periodo iniziale è 96 + 18 = 114 ps e supera il limite di 111 ps.",
      "Intervenire in X ridurrebbe il ramo già più rapido, lasciando il periodo a 114 ps. Intervenendo in Y il suo ritardo scende a 91 ps.",
      "Il maggiore fra 90 e 91 è 91. Con i 18 ps comuni il nuovo periodo minimo è 109 ps, due picosecondi sotto il limite."
    ],
    quadro: [
      {titolo: "Vincolo di progetto", nota: "Il periodo richiesto deve essere al massimo 111 ps.", celle: [["X in serie", "42 + 48 ps"], ["Y", "96 ps"], ["registri", "18 ps"]], tipo: "stato"},
      {titolo: "Rami prima della modifica", nota: "Il ramo più lento stabilisce il ritardo combinatorio.", celle: [["X", "90 ps"], ["Y", "96 ps"]], tipo: "confronto"},
      {titolo: "Spendere il budget su Y", nota: "Una riduzione di X lascerebbe invariato il ramo da 96 ps.", celle: [["X", "90 ps"], ["Y dopo", "91 ps"]], tipo: "confronto"},
      {titolo: "Verifica del vincolo", nota: "Il margine rispetto al massimo richiesto è 2 ps.", celle: [["massimo rami", "91 ps"], ["registri", "18 ps"], ["periodo", "109 ps"]], tipo: "sequenza"}
    ]
  });
  prova('3.4',5,'Scegliere il PC dopo jne',1,'Il PC è il contatore di programma, che conserva l’indirizzo da cui prelevare il prossimo comando. JNE, salto se diverso, consulta ZF, il flag che vale 1 quando il precedente risultato era zero. Con ZF=0 la condizione Cnd vale 1 e si sceglie il bersaglio valC; con ZF=1 si sceglie valP, il successore sequenziale. In Y86-64 JNE occupa nove byte, quindi valP=PC+9. Per dedurre la condizione da un indirizzo osservato, i due candidati devono essere diversi: se coincidono, entrambi i valori di ZF producono lo stesso PC.',[[0x40,0xC0,0]],(pc,t,z)=>{
    const seq=pc+9,take=1-z,newpc=take?t:seq;
    return variante('SEQ preleva jne '+hex(t)+' al PC '+hex(pc)+'. Il vecchio ZF vale '+z+'. RDI rappresenta il PC iniziale, RSI la destinazione e EDX il valore di ZF. Il salto occupa nove byte e conserva i flag Y86.',
      [numero('valP',seq,'Somma il byte di codice e gli otto byte di destinazione.'),numero('Cnd',take,'jne richiede disuguaglianza.'),numero('PC scelto',newpc,'La condizione vera abilita il bersaglio.')],
      ['L’indirizzo sequenziale è '+hex(pc)+' + 9 = '+hex(seq)+'.','Il controllo valuta Cnd = 1 − ZF = '+take+'.','Il selettore del PC usa '+(take?'valC':'valP')+' e il nuovo PC vale '+hex(newpc)+'. I flag x86 del frammento servono al calcolo del modello.'],
      asm('lea rax, [rdi+9]','test edx, edx','cmovz rax, rsi')); },
  {
    consegna: "Una jne diretta a 0xB0 comincia a 0x70. Nel ciclo successivo si osserva il prelievo a 0x79. Calcola l’indirizzo sequenziale di questa istruzione da nove byte e deduci quale fosse ZF prima del salto. Stabilisci se la stessa deduzione resterebbe possibile con un bersaglio posto proprio a 0x79.",
    campi: [
      {label: "Indirizzo sequenziale valP", answer: "121", numeric: true, hint: "L’istruzione occupa nove indirizzi a partire da 0x70."},
      {label: "ZF al primo salto", answer: "1", numeric: true, hint: "Con bersaglio diverso da valP, il percorso sequenziale corrisponde alla condizione falsa."},
      {label: "Se il bersaglio fosse 0x79", answer: "Il PC sarebbe compatibile con entrambi i flag", choices: ["Il PC dimostrerebbe ZF=0", "Il PC dimostrerebbe ZF=1", "Il PC sarebbe compatibile con entrambi i flag"], hint: "Confronta i due ingressi del selettore di PC."}
    ],
    svolgimento: [
      "Il codice e la destinazione occupano nove byte, da 0x70 a 0x78 inclusi. ValP è dunque 0x79.",
      "Il bersaglio 0xB0 è diverso da 0x79. Il prelievo osservato coincide solo con valP, perciò la jne ha proseguito in sequenza. Per jne ciò implica ZF=1.",
      "Se il bersaglio fosse anch’esso 0x79, i due ingressi del selettore avrebbero lo stesso valore. Il prelievo mostrerebbe allora 0x79 sia con ZF=1 sia con ZF=0."
    ],
    quadro: [
      {titolo: "Prelievo osservato", nota: "Si conosce il PC dopo la decisione.", celle: [["PC di jne", "0x70"], ["bersaglio", "0xB0"], ["PC osservato", "0x79"]], tipo: "stato"},
      {titolo: "Primo candidato", nota: "Il formato occupa un byte di codice e otto di destinazione.", celle: [["PC iniziale", "0x70"], ["lunghezza", "9"], ["valP", "0x79"]], tipo: "sequenza"},
      {titolo: "Discriminare i percorsi", nota: "L’osservazione identifica il percorso sequenziale.", celle: [["Cnd falso", "0x79"], ["Cnd vero", "0xB0"], ["ZF inferito", "1"]], tipo: "confronto"},
      {titolo: "Bersaglio uguale a valP", nota: "L’indirizzo perde il potere di distinguere la condizione.", celle: [["ZF = 0", "0x79"], ["ZF = 1", "0x79"]], tipo: "confronto"}
    ]
  });
  prova('3.5',1,'Contare il lavoro di una pipeline vuota',1,'Con K stadi la prima istruzione conclude dopo K cicli. In un flusso ideale già avviato ogni istruzione successiva impiega un solo ciclo aggiuntivo per completare il programma.',[[5,8]],(k,n)=>{
    const c=k+n-1;return variante('Una pipeline ideale di '+k+' stadi, inizialmente vuota, esegue '+(n===1?'una sola istruzione':n+' istruzioni indipendenti')+'. Il primo prelievo occupa il ciclo 1. Calcola il ciclo di completamento della prima istruzione e il numero di cicli dell’intero programma. EDI e ESI contengono rispettivamente K e N.',
      [numero('Ciclo del primo completamento',k,'La prima istruzione visita K stadi.'),numero('Cicli complessivi',c,'Dopo la prima terminano le altre N − 1.')],
      ['La prima istruzione entra al ciclo 1 e attraversa '+k+' stadi entro la fine del ciclo '+k+'.',n===1?'Il primo completamento conclude anche l’intero programma.':'Le altre '+(n-1)+' istruzioni terminano al ritmo di una per ciclo.','La misura complessiva vale '+k+' + '+n+' − 1 = '+c+' cicli. EAX contiene questo totale.'],
      asm('lea eax, [rdi+rsi-1]')); },
  {
    consegna: "In una pipeline ideale inizialmente vuota il primo prelievo avviene nel ciclo 1. La prima istruzione termina alla fine del ciclo 4 e l’ultima alla fine del ciclo 9. Fra quei due istanti termina un’istruzione a ogni ciclo. Ricava il numero degli stadi e il numero di istruzioni eseguite.",
    campi: [
      {label: "Numero di stadi", answer: "4", numeric: true, hint: "La prima istruzione attraversa la pipeline ancora vuota."},
      {label: "Numero di istruzioni completate", answer: "6", numeric: true, hint: "Conta gli estremi del tratto dei completamenti, dal ciclo 4 al ciclo 9 inclusi."}
    ],
    svolgimento: [
      "La prima istruzione avanza di uno stadio per ciclo dal primo prelievo. Il completamento nel ciclo 4 identifica quindi quattro stadi.",
      "I completamenti cadono nei cicli 4, 5, 6, 7, 8 e 9. Dal primo all’ultimo passano cinque intervalli, ai quali si aggiunge la prima istruzione già completata.",
      "Si ottengono sei istruzioni. La verifica con la formula diretta fornisce K + N − 1 = 4 + 6 − 1 = 9, proprio il ciclo dell’ultimo completamento."
    ],
    figuraIII: {
      tipo: "cicli",
      titolo: "Ricostruire il tratto dei completamenti",
      etichette: ["I1", "ultimi stadi"],
      righe: [
        ["F", "2", "3", "W", "", "", "", "", ""],
        ["", "", "", "I1", "I2", "I3", "I4", "I5", "I6"]
      ],
      mostra: [
        [0, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 2, 2, 2, 2, 2]
      ],
      note: ["Si osservano l’arrivo di I1 e l’ultimo completamento al ciclo 9.", "La prima istruzione attraversa quattro stadi.", "Un completamento per ogni ciclo dal quarto al nono.", "I sei completamenti verificano 4 + 6 − 1 = 9."]
    }
  });
  prova('3.5',2,'Misurare latenza e accelerazione su un tratto finito',1,'La latenza è il tempo impiegato da una singola istruzione per attraversare tutti gli stadi. Con K stadi da un ciclo e periodo T vale K·T. Una pipeline sovrappone istruzioni diverse: se parte vuota e completa poi una istruzione per ciclo, N istruzioni indipendenti richiedono K+N−1 cicli, ossia (K+N−1)·T. Una macchina seriale impiega invece N volte la propria durata per istruzione, indicata nella consegna. L’accelerazione è il rapporto fra tempo seriale e tempo in pipeline. Per trovare un vantaggio strettamente positivo si confrontano le durate e si verifica il primo valore intero di N che soddisfa il vincolo.',[[4,5,20]],(k,n,t)=>{
    const l=k*t,seq=l*n,pip=(n+k-1)*t;return variante('Ciascuno dei K='+k+' stadi impiega T='+t+' ps. Trascurando il costo dei registri, calcola la latenza della prima istruzione e i tempi totali per N='+n+' istruzioni indipendenti su due macchine. La prima esegue le istruzioni in serie e la seconda impiega una pipeline inizialmente vuota. EDI=K, ESI=N, EDX=T.',
      [numero('Latenza della prima istruzione (ps)',l,'La prima istruzione attraversa K stadi in entrambe le macchine.'),numero('Tempo sequenziale (ps)',seq,'Moltiplica la latenza per N.'),numero('Tempo pipeline (ps)',pip,'Il numero di cicli è N + K − 1.')],
      ['La latenza individuale è '+k+' × '+t+' = '+l+' ps. A regime la pipeline completa un’istruzione ogni '+t+' ps.','In serie il tempo è '+n+' × '+l+' = '+seq+' ps. In pipeline bastano '+(n+k-1)+' cicli, cioè '+pip+' ps.','L’accelerazione sul tratto è '+seq+' / '+pip+' = '+dec(seq/pip)+' (arrotondata al millesimo). Il frammento conserva latenza, tempo seriale e tempo pipeline in EAX, ECX ed R8D.'],
      asm('mov eax, edi','imul eax, edx','mov ecx, eax','imul ecx, esi','lea r8d, [rdi+rsi-1]','imul r8d, edx')); },
  {
    consegna: "Due macchine devono eseguire lo stesso numero N di istruzioni indipendenti. Quella seriale impiega 60 ps per istruzione. Quella in pipeline ha tre stadi da 25 ps ciascuno, parte vuota e completa un’istruzione per ciclo dopo il riempimento. Trova il minimo N per cui il tempo totale in pipeline è strettamente minore e verifica entrambi i tempi a quella soglia.",
    campi: [
      {label: "Minimo numero di istruzioni", answer: "2", numeric: true, hint: "Imponi (N + 2) × 25 < N × 60 e considera solo N intero positivo."},
      {label: "Tempo seriale alla soglia (ps)", answer: "120", numeric: true, hint: "La macchina seriale impiega 60 ps per ciascuna delle N istruzioni."},
      {label: "Tempo pipeline alla soglia (ps)", answer: "100", numeric: true, hint: "Il primo completamento richiede tre cicli. Ogni istruzione successiva aggiunge un ciclo."}
    ],
    svolgimento: [
      "La macchina seriale impiega 60N ps. In pipeline servono N + 3 − 1 cicli, quindi il tempo è 25(N+2) ps.",
      "La condizione 25N + 50 < 60N equivale a N > 50/35. Il minimo intero ammesso è 2.",
      "Per due istruzioni si misurano 120 ps in serie e 100 ps in pipeline. Con una sola istruzione si misurerebbero invece 60 e 75 ps: il confronto al valore precedente conferma la soglia."
    ],
    quadro: [
      {titolo: "Due macchine sullo stesso programma", nota: "Si cerca una disuguaglianza stretta sul tempo finale.", celle: [["seriale", "60 ps / istr."], ["pipeline", "3 × 25 ps"]], tipo: "stato"},
      {titolo: "Tempo per N istruzioni", nota: "All’avvio della pipeline si aggiungono due cicli di riempimento.", celle: [["seriale", "60N"], ["pipeline", "25(N + 2)"]], tipo: "confronto"},
      {titolo: "Soglia discreta", nota: "La soglia reale si converte nel primo intero strettamente maggiore.", celle: [["vincolo", "35N > 50"], ["minimo N", "2"]], tipo: "stato"},
      {titolo: "Due istruzioni", nota: "Con una sola istruzione la macchina seriale finirebbe prima.", celle: [["seriale", "120 ps"], ["pipeline", "100 ps"]], tipo: "confronto"}
    ]
  });
  prova('3.5',3,'Confrontare destinazione e sorgenti effettive',3,'Un registro è una piccola memoria interna che conserva un valore. Una dipendenza RAW, Read After Write, nasce quando un’istruzione consumatrice deve leggere il valore che una precedente produttrice sta per scrivere. Dst identifica la destinazione del produttore, srcA e srcB i registri letti dal consumatore, mentre write_enable vale 1 quando la scrittura è effettivamente abilitata. Il rilevamento richiede insieme una destinazione reale, la scrittura abilitata e almeno una coincidenza dst=srcA oppure dst=srcB. Il codice RNONE, qui 15, segnala l’assenza di registro e va escluso anche quando compare in entrambi i campi confrontati.',[[2,5,2,1]],(dst,a,b,en)=>{
    const hit=+(en&&dst!==15&&(dst===a||dst===b));return variante('Il produttore espone dst='+dst+' (EDI) e write_enable='+en+' (ECX). Il consumatore espone srcA='+a+' e srcB='+b+' (ESI, EDX). L’identificatore 15 indica RNONE. Ricava il bit RAW per questa coppia.',
      [numero('Confronto grezzo dst=srcA oppure dst=srcB',+(dst===a||dst===b),'Considera prima le sole uguaglianze numeriche.'),numero('Dipendenza RAW valida',hit,'Una dipendenza richiede una scrittura abilitata su un registro effettivo.')],
      ['I confronti valgono '+Number(dst===a)+' sulla porta A e '+Number(dst===b)+' sulla porta B.','La destinazione '+dst+(dst===15?' corrisponde a RNONE.':' individua un registro effettivo.')+' L’abilitazione vale '+en+'.','Combinando confronto, validità e abilitazione si ottiene RAW='+hit+'. Un confronto con RNONE può dare un’uguaglianza numerica priva di effetto.'],
      asm('xor eax, eax','cmp edi, 15','je 1f','test ecx, ecx','jz 1f','cmp edi, esi','sete al','cmp edi, edx','sete cl','or al, cl','1:')); },
  {
    consegna: "Un rilevatore difettoso segnala RAW ogni volta che dst coincide con srcA o srcB ed è diverso da RNONE, ignorando write_enable. Il circuito corretto richiede anche una scrittura abilitata. Scegli la sola prova che distingue le due versioni, con tuple nell’ordine (dst, srcA, srcB, write_enable). Gli identificatori da 0 a 14 sono registri e 15 è RNONE. Indica poi le due uscite.",
    campi: [
      {label: "Tupla di prova", answer: "(2,2,5,0)", choices: ["(2,2,5,1)", "(2,2,5,0)", "(15,15,5,0)"], hint: "Usa un registro reale che coincida con una sorgente e isola l’effetto dell’abilitazione."},
      {label: "RAW nel circuito corretto", answer: "0", numeric: true, hint: "Un produttore senza scrittura abilitata lascia intatto il registro."},
      {label: "RAW nel circuito difettoso", answer: "1", numeric: true, hint: "L’uguaglianza e la validità della destinazione sono gli unici test rimasti."}
    ],
    svolgimento: [
      "La tupla (2,2,5,1) causa RAW in entrambi i circuiti. Con (15,15,5,0) entrambi scartano la destinazione riservata RNONE.",
      "Con (2,2,5,0) la destinazione è un registro effettivo e coincide con srcA. Il confronto grezzo vale uno.",
      "La scrittura è disabilitata, perciò il circuito corretto produce RAW=0. Quello difettoso conserva l’esito del confronto e produce RAW=1. La differenza si deve alla sola abilitazione omessa."
    ],
    quadro: [
      {titolo: "Isolare una condizione mancante", nota: "I due circuiti escludono entrambi RNONE.", celle: [["confronto", "dst = sorgente"], ["registro valido", "dst ≠ 15"], ["segnale omesso", "write_enable"]], tipo: "stato"},
      {titolo: "Due test inconcludenti", nota: "Le due conclusioni si riferiscono alle due tuple diverse.", celle: [["scrittura attiva", "entrambe RAW"], ["dst = RNONE", "nessuna RAW"]], tipo: "confronto"},
      {titolo: "Caso discriminante", nota: "Il solo segnale disattivo è l’abilitazione alla scrittura.", celle: [["dst / srcA", "2 / 2"], ["write_enable", "0"]], tipo: "stato"},
      {titolo: "Esito del confronto", nota: "Un fermo dovuto al falso RAW sarebbe evitabile.", celle: [["corretto", "0"], ["difettoso", "1"]], tipo: "confronto"}
    ],
    listato: "; EDI = dst, ESI = srcA, EDX = srcB, ECX = write_enable\nxor eax, eax\ncmp edi, 15\nje fine\ncmp edi, esi\nsete al\ncmp edi, edx\nsete dl\nor al, dl\nfine:"
  });
  prova('3.5',4,'Contare i cicli di fermo sovrapposti',4,'Una maschera temporale usa un bit per ciclo: 1 segnala una richiesta di fermo e 0 la sua assenza. Le due maschere condividono gli stessi cicli, a partire dal bit 0 a destra. AND conserva le posizioni con due uno e individua l’intersezione delle cause; OR conserva quelle con almeno un uno e individua l’unione. POPCNT conta gli uno della parola risultante, traducendoli in cicli. Sommando separatamente le due durate, ogni ciclo comune viene contato due volte: per ottenere il fermo effettivo si sottrae una volta l’intersezione. La stessa relazione permette di ricostruire la sovrapposizione a partire dai contatori.',[[0b011010,0b001110]],(a,b)=>{
    const pc=x=>bin(x,6).split('1').length-1, mask=a|b;
    return variante('Due maschere di sei bit, dati '+bin(a,6)+' in EDI e risorsa '+bin(b,6)+' in ESI, descrivono gli stessi sei cicli (bit 0 = primo ciclo). Un bit uno richiede un fermo di un ciclo. Conta i cicli con entrambe le richieste e il fermo effettivo complessivo. Il processore ospite offre POPCNT.',
      [numero('Cicli con entrambe le cause',pc(a&b),'Conta gli uno della congiunzione.'),numero('Cicli di fermo effettivi',pc(mask),'Conta gli uno dell’unione.')],
      ['L’intersezione '+bin(a&b,6)+' contiene '+pc(a&b)+' bit attivi.','L’unione OR produce '+bin(mask,6)+'. Ciascuna posizione rappresenta un intervallo distinto.','Il conteggio dei cicli persi vale '+pc(mask)+'. La verifica per inclusione ed esclusione dà '+pc(a)+' + '+pc(b)+' − '+pc(a&b)+'. EDX riporta il numero di cicli comuni ed EAX il totale.'],
      asm('mov edx, edi','and edx, esi','popcnt edx, edx','or edi, esi','popcnt eax, edi')); },
  {
    consegna: "In dodici cicli di osservazione il contatore delle richieste di fermo per dati avanza di 5 e quello delle richieste per risorsa di 4. I cicli effettivamente fermi sono 7. Ciascun contatore avanza al massimo una volta per ciclo. Ricostruisci quanti cicli hanno entrambe le cause e quanti passano senza alcuna richiesta.",
    campi: [
      {label: "Cicli con entrambe le cause", answer: "2", numeric: true, hint: "Nella somma dei contatori ogni ciclo comune appare due volte."},
      {label: "Cicli privi di richieste", answer: "5", numeric: true, hint: "Sottrai i cicli appartenenti all’unione dai dodici osservati."}
    ],
    svolgimento: [
      "Le due cause producono in totale 5 + 4 = 9 incrementi dei contatori. L’unione dei cicli interessati ne comprende 7.",
      "La differenza 9 − 7 = 2 conta i cicli registrati una volta in più, cioè quelli comuni. Rimangono tre cicli con soli dati e due con sola risorsa.",
      "Dei dodici cicli, 12 − 7 = 5 sono privi di richieste. Le quattro classi esclusive danno 3 + 2 + 2 + 5 = 12 e ricostruiscono l’intera osservazione."
    ],
    quadro: [
      {titolo: "Contatori del tratto osservato", nota: "I tre conteggi usano la stessa finestra temporale.", celle: [["dati", "5"], ["risorsa", "4"], ["fermi effettivi", "7"]], tipo: "stato"},
      {titolo: "Incrementi separati", nota: "La somma conta due volte le sovrapposizioni.", celle: [["5 + 4", "9"], ["unione", "7"]], tipo: "confronto"},
      {titolo: "Sovrapposizione", nota: "Si sottrae all’intero conteggio il numero di cicli distinti.", celle: [["9 − 7", "2 comuni"], ["solo dati", "3"], ["solo risorsa", "2"]], tipo: "stato"},
      {titolo: "Ripartizione di dodici cicli", nota: "I quattro gruppi sono disgiunti.", celle: [["solo dati", "3"], ["solo risorsa", "2"], ["entrambe", "2"], ["nessuna", "5"]], tipo: "confronto"}
    ]
  });
  prova('3.5',5,'Calcolare gli stalli dalla distanza fra istruzioni',3,'La pipeline attraversa prelievo F, lettura degli operandi D, calcolo E, memoria M e scrittura W. Il produttore prepara un dato che il consumatore deve usare. Il forwarding sarebbe un collegamento diretto tra stadi; qui il consumatore legge soltanto dal banco dei registri, l’insieme delle piccole memorie interne. W scrive nella prima metà del ciclo e D legge nella seconda, quindi la scrittura del produttore al ciclo 5 può servire D nello stesso ciclo. Con k istruzioni interposte, il primo D previsto cade al ciclo 3+k e gli stalli sono max(0,5−(3+k)), cioè il maggiore fra zero e la differenza calcolata.',[[0]],(gap)=>{
    const read=3+gap,st=Math.max(0,5-read);
    return variante('Pipeline F,D,E,M,W senza forwarding. Il produttore entra in F nel ciclo 1 e scrive nel primo semiciclo di W. Il consumatore legge nel secondo semiciclo di D. Il registro EDI specifica quante istruzioni indipendenti sono interposte. Qui EDI='+gap+'. Determina il primo ciclo previsto in D e il numero di stalli necessari.',
      [numero('Primo ciclo D previsto per il consumatore',read,'Il consumatore immediatamente successivo entra in D nel ciclo 3.'),numero('Stalli in D',st,'W del produttore è nel ciclo 5 e può servire D nello stesso ciclo.')],
      ['Il produttore attraversa F,D,E,M,W nei cicli da 1 a 5.','Con '+gap+' istruzioni interposte, il primo ciclo previsto per D è 3 + '+gap+' = '+read+'.','L’attesa è max(0, 5 − '+read+') = '+st+' cicli. Il listato tronca a zero una differenza negativa.'],
      asm('lea ecx, [rdi+3]','mov eax, 5','sub eax, ecx','mov edx, 0','cmovs eax, edx')); },
  {
    consegna: "In una pipeline F,D,E,M,W senza inoltro, il produttore P entra in F al ciclo 1 e scrive nel primo semiciclo di W. U dipende da P e legge nel secondo semiciclo di D. Hai due copie indipendenti X e Y che puoi collocare fra P e U. Trova il numero minimo di copie da interporre per evitare ogni stallo e il ciclo in cui U potrà leggere.",
    campi: [
      {label: "Minimo numero di copie interposte", answer: "2", numeric: true, hint: "Senza copie U entra in D al ciclo 3, mentre P scrive al ciclo 5."},
      {label: "Ciclo di lettura di U", answer: "5", numeric: true, hint: "La lettura è ammessa nel secondo semiciclo della stessa W che pubblica il dato."}
    ],
    svolgimento: [
      "P visita F,D,E,M,W nei cicli da 1 a 5. L’ordine P,U porterebbe U in D al ciclo 3, due cicli prima della scrittura.",
      "Con una sola copia fra P e U la prima D di U cadrebbe al ciclo 4 e servirebbe ancora un fermo. Due copie spostano la prima D al ciclo 5.",
      "Con P,X,Y,U il dato viene scritto nella prima metà del ciclo 5 e letto da U nella seconda. Le due copie sono sufficienti e il confronto con una sola copia dimostra che sono il minimo."
    ],
    figuraIII: {
      tipo: "cicli",
      titolo: "Evitare gli stalli mediante la distanza",
      etichette: ["P", "U con 1 copia", "U con 2 copie"],
      righe: [
        ["F", "D", "E", "M", "W", "", ""],
        ["", "", "F", "D*", "D", "E", "M"],
        ["", "", "", "F", "D", "E", "M"]
      ],
      mostra: [
        [0, 1, 1, 1, 1, 0, 0],
        [0, 0, 2, 2, 2, 2, 2],
        [0, 0, 0, 3, 3, 3, 3]
      ],
      note: ["P scrive nel primo semiciclo di W.", "Il risultato compare nel banco al ciclo 5.", "Con una sola copia U aspetta un ciclo in D.", "Due copie consentono la lettura al primo ingresso in D."]
    }
  });
  prova('3.6',1,'Leggere l’occupazione di uno stadio',1,'Nella pipeline F preleva il comando, D legge gli operandi, E esegue il calcolo, M accede eventualmente alla memoria e W scrive il risultato. Le istruzioni indipendenti entrano una per ciclo e avanzano di uno stadio a ogni fronte del clock, l’istante di aggiornamento dei registri. Numerando gli stadi da s=1 per F, quello osservato ha richiesto s−1 avanzamenti; al ciclo c il suo occupante candidato è quindi I(c−s+1). L’indice deve appartenere a 1…N, dove N è il numero totale di istruzioni. Al di fuori di questo intervallo la posizione è vuota. Il numero degli indici validi conta le istruzioni attive.',[[3,2,4]],(c,s,n)=>{
    const i=c-s+1;return variante('Una pipeline a cinque stadi, inizialmente vuota, preleva '+n+' istruzioni I1… I'+n+' senza conflitti a partire dal ciclo 1. Nel ciclo '+c+' considera lo stadio '+stadi[s-1]+' (numero '+s+', contando F=1). Indica l’indice dell’istruzione presente in '+stadi[s-1]+', usando zero se lo stadio è vuoto, e conta le istruzioni attive nello stesso ciclo.',
      [numero('Indice nello stadio',i>=1&&i<=n?i:0,'Sottrai al ciclo il numero di trasferimenti già effettuati.'),numero('Istruzioni attive nel ciclo',occupazione(n,c).filter(x=>x!=='—').length,'Conta gli stadi con indice di istruzione fra 1 e N.')],
      ['Per raggiungere lo stadio '+s+(s===2?' occorre un fronte':' occorrono '+(s-1)+' fronti')+' dopo il prelievo.','L’indice candidato è '+c+' − '+s+' + 1 = '+i+'. Fra 1 e N l’indice identifica un’istruzione. Fuori da tale intervallo lo stadio è vuoto.','L’intera riga F,D,E,M,W è '+occupazione(n,c).join(' / ')+'. Gli indici validi danno '+occupazione(n,c).filter(x=>x!=='—').length+' istruzioni attive.'],
      asm('mov eax, edi','sub eax, esi','inc eax','xor ecx, ecx','test eax, eax','cmovle eax, ecx','cmp eax, edx','cmova eax, ecx')); },
  {
    consegna: "Quattro istruzioni indipendenti I1, I2, I3 e I4 vengono prelevate nei cicli da 1 a 4. Ogni istruzione avanza di uno stadio per ciclo nella pipeline F,D,E,M,W. Per il ciclo 4 una riga annota F=I4, D=I3, E=I3, M=I1 e W vuoto. Indica lo stadio errato e l’indice dell’istruzione che deve occuparlo.",
    campi: [
      {label: "Stadio da correggere", answer: "E", choices: ["F", "D", "E", "M"], hint: "I3 è stata prelevata al ciclo 3 e si trova in D al ciclo 4."},
      {label: "Indice corretto nello stadio errato", answer: "2", numeric: true, hint: "L’istruzione che occupa E è entrata in F due cicli prima."}
    ],
    svolgimento: [
      "Al ciclo 4 I4 è appena entrata in F, mentre I3, prelevata al ciclo 3, passa in D. Entrambe le annotazioni sono corrette.",
      "Per raggiungere E servono due avanzamenti da F. L’istruzione prelevata al ciclo 2 è I2 e deve dunque occupare E nel ciclo 4.",
      "I1 ha già compiuto tre avanzamenti e si trova in M. W è ancora vuoto. La riga corretta è I4, I3, I2, I1, vuoto e ogni istruzione compare una sola volta."
    ],
    figuraIII: {
      tipo: "cicli",
      titolo: "Correzione della riga al ciclo 4",
      etichette: ["I1", "I2", "I3", "I4"],
      righe: [
        ["F", "D", "E", "M"],
        ["", "F", "D", "E"],
        ["", "", "F", "D"],
        ["", "", "", "F"]
      ],
      mostra: [
        [0, 3, 3, 3],
        [0, 0, 2, 2],
        [0, 0, 0, 1],
        [0, 0, 0, 1]
      ],
      note: ["Ogni riga segue un’istruzione dal proprio prelievo.", "I3 è in D e I4 in F.", "L’ingresso al ciclo 2 identifica I2 nello stadio E.", "Nel ciclo 4 W è vuoto e I1 è in M."]
    }
  });
  prova('3.6',2,'Applicare il controllo di D ed E',5,'Lo stallo conserva l’istruzione nel suo registro di pipeline, mentre la bolla sostituisce l’ingresso con una posizione priva di effetti. F preleva, D prepara gli operandi, E esegue e M accede alla memoria. Load_use vale 1 se D attende il dato di un carico ancora in E; ret_in_DEM vale 1 se un ritorno, che deve recuperare dalla pila l’indirizzo di ripresa, occupa D, E oppure M. Con previsione corretta dei salti, F_stall=load_use OR ret_in_DEM, D_stall=E_bubble=load_use e D_bubble=(1−load_use) AND ret_in_DEM. OR richiede almeno una causa attiva e AND entrambe: la formula conserva quindi D quando il consumatore deve ancora ricevere il dato.',[[1,1]],(load,ret)=>{
    const v=controlloPIPE(!!load,!!ret,false);return variante('Il rilevatore PIPE fornisce load_use='+load+' in EDI e ret_in_DEM='+ret+' in ESI. I salti sono previsti correttamente. Calcola i segnali di stallo e bolla. Il bit di ritorno può riferirsi allo stesso consumatore in D.',
      [numero('F_stall',+v.f,'F si ferma per ciascuna delle due cause.'),numero('D_stall',+v.ds,'Il consumatore di un carico immediato deve conservare il proprio posto.'),numero('D_bubble',+v.db,'La bolla dovuta a ret richiede assenza di load/use.'),numero('E_bubble',+v.eb,'Con previsione corretta la sola causa qui è load/use.')],
      ['Il prelievo calcola '+load+' OR '+ret+' = '+Number(v.f)+'.','D_stall coincide con load_use e vale '+Number(v.ds)+'. Per D_bubble si forma (1 − '+load+') AND '+ret+' = '+Number(v.db)+'.','E_bubble vale '+Number(v.eb)+'. '+(load?'D conserva il consumatore e inserisce un intervallo libero a valle.':'Il ritorno già in pipeline può procedere e D riceve una bolla.')+' Il listato lascia F_stall, D_stall, D_bubble, E_bubble in EAX, ECX, EDX, R8D.'],
      asm('mov eax, edi','or eax, esi','mov ecx, edi','mov edx, edi','xor edx, 1','and edx, esi','mov r8d, edi')); },
  {
    consegna: "Con previsione del salto corretta, la sonda PIPE registra F_stall=1, D_stall=1, D_bubble=0, E_bubble=1. In questo caso D_stall ed E_bubble segnalano direttamente una dipendenza load/use. Una ret nelle fasi D,E,M può anche trattenere F, e genera una bolla in D solo in assenza di load/use. Deduci load_use e stabilisci quali valori di ret_in_DEM siano compatibili.",
    campi: [
      {label: "load_use", answer: "1", numeric: true, hint: "D_stall segue direttamente il rilevatore di dipendenza del carico."},
      {label: "Valori possibili di ret_in_DEM", answer: "Sia 0 sia 1", choices: ["Soltanto 0", "Soltanto 1", "Sia 0 sia 1"], hint: "Una volta fissato load_use, valuta F_stall e D_bubble per ciascun valore del ritorno."}
    ],
    svolgimento: [
      "D_stall=1 impone load_use=1. E_bubble=1 è coerente con la stessa causa, dato che il salto è previsto correttamente.",
      "Con ret_in_DEM=0 la dipendenza basta a trattenere F e D. In D resta l’istruzione vera, quindi D_bubble=0.",
      "Anche con ret_in_DEM=1 F resta fermo e D_bubble vale (1−load_use) AND ret_in_DEM = 0. Le due cause danno perciò lo stesso vettore osservato. Per riconoscere il ritorno occorrerebbe osservare un altro segnale."
    ],
    quadro: [
      {titolo: "Vettore osservato", nota: "L’ordine è F_stall, D_stall, D_bubble, E_bubble.", celle: [["F_stall", "1"], ["D_stall", "1"], ["D_bubble", "0"], ["E_bubble", "1"]], tipo: "stato"},
      {titolo: "Vincolo di D", nota: "La conservazione di D impone la dipendenza.", celle: [["D_stall", "1"], ["load_use", "1"]], tipo: "stato"},
      {titolo: "Ipotesi senza ret", nota: "Il carico spiega il fermo e la bolla a valle.", celle: [["ret", "0"], ["vettore", "1101"]], tipo: "stato"},
      {titolo: "Due ipotesi compatibili", nota: "Il vettore misurato è compatibile con entrambi i valori del ritorno.", celle: [["ret = 0", "1101"], ["ret = 1", "1101"]], tipo: "confronto"}
    ]
  });
  prova('3.6',3,'Verificare le precedenze del selettore di prelievo',2,'Il prelievo, o fetch, richiede l’indirizzo del prossimo comando. F_predPC è l’indirizzo previsto; M_valA è il successore sequenziale conservato per recuperare un salto previsto in modo errato; W_valM è l’indirizzo di ritorno letto dalla pila. Il selettore applica la priorità correzione del salto, ritorno, previsione ordinaria. Nel listato si può partire dal candidato ordinario e sostituirlo prima con quello di ritorno, poi con quello di correzione: l’ultima scelta attiva prevale. Il banco di prova consente di forzare entrambi i controlli e usa indirizzi distinti affinché il valore osservato riveli la sorgente scelta.',[[1,1,0x40,0x99,0xC0]],(j,r,p,m,w)=>{
    const s=pcPIPE(j,r,p,m,w);return variante('Banco di prova del selettore. F_predPC='+hex(p)+' in RDI, M_valA='+hex(m)+' in RSI, W_valM='+hex(w)+' in RDX. Il bit di correzione del salto in M è '+j+' (ECX) e il bit ret in W è '+r+' (R8D). Gli ingressi del banco possono essere forzati. Calcola il PC di fetch.',
      [numero('PC dopo la sola selezione ret / predetto',r?w:p,'Applica prima la scelta con priorità inferiore.'),numero('PC finale',s[1],'Una correzione in M prende precedenza sul ritorno in W.')],
      ['Si parte dal predetto '+hex(p)+'.','Il bit di ritorno '+r+' seleziona '+hex(r?w:p)+' come candidato intermedio.','Si applica per ultima la correzione con priorità massima. Il bit '+j+' dà la sorgente '+s[0]+' e l’indirizzo '+hex(s[1])+'.'],
      asm('mov rax, rdi','test r8d, r8d','cmovne rax, rdx','test ecx, ecx','cmovne rax, rsi')); },
  {
    consegna: "In un banco con controlli forzabili, il PC predetto è 0x50, l’indirizzo per recuperare un salto errato in M è 0x79 e quello di ritorno da W è 0xD8. Ogni controllo, provato da solo, seleziona il suo ingresso. Attivandoli entrambi il circuito fornisce 0xD8, mentre il progetto prescrive precedenza alla correzione in M. Indica la sorgente che prevale per errore e il PC corretto.",
    campi: [
      {label: "Sorgente che prevale per errore", answer: "W_valM", choices: ["F_predPC", "M_valA", "W_valM"], hint: "Riconosci a quale ingresso appartiene il valore 0xD8."},
      {label: "PC richiesto dal progetto", answer: "121", numeric: true, hint: "Attivando entrambe le richieste prevale la correzione del salto in M."}
    ],
    svolgimento: [
      "Con tre indirizzi distinti, il valore osservato identifica la sorgente. 0xD8 proviene dal percorso di ritorno W_valM.",
      "Le prove con un solo controllo riuscivano. Il difetto emerge nella priorità quando sono contemporaneamente attivi il ritorno e la correzione.",
      "Il selettore deve dare precedenza a M_valA. Per i dati del banco il PC corretto è quindi 0x79. Usare tre indirizzi distinti evita di mascherare un errore di selezione."
    ],
    quadro: [
      {titolo: "Prova di priorità", nota: "Le due richieste sono attive nello stesso istante.", celle: [["predetto", "0x50"], ["M_valA", "0x79"], ["W_valM", "0xD8"]], tipo: "stato"},
      {titolo: "Valore osservato", nota: "Il confronto è possibile perché i tre valori sono diversi.", celle: [["PC rilevato", "0xD8"], ["origine", "W_valM"]], tipo: "stato"},
      {titolo: "Richieste simultanee", nota: "La precedenza si verifica attivando insieme le due richieste.", celle: [["correzione M", "1"], ["ritorno W", "1"]], tipo: "stato"},
      {titolo: "Confronto con il progetto", nota: "La correzione di salto in M ha priorità sul ritorno.", celle: [["misurato", "0xD8"], ["richiesto", "0x79"]], tipo: "confronto"}
    ],
    listato: "; RDI = PC predetto, RSI = M_valA, RDX = W_valM\n; ECX = correzione in M, R8D = ritorno in W\nmov rax, rdi\ntest ecx, ecx\ncmovne rax, rsi\ntest r8d, r8d\ncmovne rax, rdx"
  });
  prova('3.6',4,'Datare la scrittura del consumatore',6,'Un carico L legge un dato dalla memoria e un consumatore U usa il registro che lo riceverà. Nella pipeline F preleva, D prepara gli operandi, E calcola, M legge la memoria e W scrive il risultato. Il forwarding, o inoltro, porta direttamente il dato di M agli operandi del consumatore. Se U segue subito L, arriva in D prima della lettura e deve restarvi un ciclo aggiuntivo, rappresentato da D* seguito da D. Con k copie indipendenti interposte il primo D cade al ciclo 3+k; W si trova tre cicli dopo quel D, più l’eventuale attesa. Per la fine dell’intero programma si segue anche l’istruzione rimasta in coda.',[[0]],gap=>{
    const d=3+gap,stall=gap?0:1,w=d+3+stall;
    return variante('Un carico L entra in F nel ciclo 1. U legge il registro caricato. Il numero di copie indipendenti interposte fra L e U è '+gap+'. PIPE usa forwarding da M e uno stallo per load/use immediato. Trova il primo ciclo D e il ciclo W di U. EDI contiene il numero di copie interposte.',
      [numero('Primo ciclo D di U',d,'Segui l’ingresso F di U e aggiungi un ciclo.'),numero('Ciclo W di U',w,'Aggiungi il transito D→E→M→W ed eventuali permanenze in D.')],
      ['L entra in E nel ciclo 3 e la sua lettura dati termina nel ciclo 4.','U arriva in D nel ciclo '+d+'. '+(stall?'Il dato manca per E. U resta in D ancora nel ciclo 4.':'Il forwarding di M fornisce il dato in tempo per il prossimo E.') ,'U esegue E nel ciclo '+(d+1+stall)+', M nel ciclo '+(d+2+stall)+' e W nel ciclo '+w+'. Il frammento restituisce D in ECX e W in EAX.'],
      asm('lea ecx, [rdi+3]','xor edx, edx','test edi, edi','setz dl','lea eax, [rcx+rdx+3]')); },
  {
    consegna: "Un carico L entra in F al ciclo 1. U usa il dato caricato e I è indipendente da entrambi. La pipeline F,D,E,M,W inoltra il risultato dalla memoria. Un uso immediato si ferma un ciclo in D. Confronta L,U,I con L,I,U. In entrambe le sequenze U raggiunge W al ciclo 7. Individua quale sequenza termina per prima e di quanti cicli cambia il completamento di tutte e tre le istruzioni.",
    campi: [
      {label: "Sequenza che termina per prima", answer: "L,I,U", choices: ["L,U,I", "L,I,U", "Terminano insieme"], hint: "Determina quale istruzione si trova in coda dopo la scrittura di U."},
      {label: "Cicli risparmiati sull’intero programma", answer: "1", numeric: true, hint: "Una pipeline a cinque stadi impiega sette cicli ideali per tre istruzioni."}
    ],
    svolgimento: [
      "In L,U,I, U arriva in D al ciclo 3 e vi rimane anche al ciclo 4. Scrive in W al ciclo 7, mentre I, che la segue, completa W al ciclo 8.",
      "In L,I,U la copia indipendente separa il carico e l’uso. U arriva in D al ciclo 4, riceve il dato inoltrato e conclude in W al ciclo 7. Essendo ultima, conclude anche il programma.",
      "La scrittura di U cade al ciclo 7 in entrambi i casi. Il completamento di tutte le istruzioni passa invece da 8 a 7 e il riordino consente di risparmiare un ciclo."
    ],
    figuraIII: {
      tipo: "cicli",
      titolo: "Confrontare le due code di pipeline",
      etichette: ["U in L,U,I", "I in L,U,I", "U in L,I,U"],
      righe: [
        ["", "F", "D*", "D", "E", "M", "W", ""],
        ["", "", "F", "F", "D", "E", "M", "W"],
        ["", "", "F", "D", "E", "M", "W", ""]
      ],
      mostra: [
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1],
        [0, 0, 2, 2, 2, 2, 2, 0]
      ],
      note: ["L entra in F al ciclo 1 in entrambe le sequenze.", "Lo stallo di U trattiene anche il prelievo di I.", "Dopo il riordino U conclude l’intera sequenza.", "Il ciclo di W di U coincide. Cambia la fine del programma."]
    }
  });
  prova('3.6',5,'Trasferire i registri senza propagare la bolla due volte',4,'Il comando di bolla agisce sul registro a cui è diretto. Gli altri registri possono continuare ad acquisire simultaneamente i valori disponibili prima dello stesso fronte.',[[7,6,5,0]],(d,e,m,err)=>{
    const ne=err?0:d;
    return variante('All’inizio del ciclo D contiene l’istruzione '+d+', E la '+e+', M la '+m+' (EDI,ESI,EDX). Zero indica bolla. ECX contiene il bit di errore della previsione di salto in E, qui pari a '+err+'. E contiene il salto. M e W caricano normalmente. Con bit di errore 1, E riceve una bolla.',
      [numero('Nuovo E',ne,'Il controllo può sostituire con zero il vecchio contenuto di D in transito.'),numero('Nuovo M',e,'Acquisisci l’istruzione che era in E prima del fronte.'),numero('Nuovo W',m,'Acquisisci il vecchio M.')],
      ['Il candidato per E è il vecchio D, cioè '+d+'. Il segnale di annullamento vale '+err+' e produce E='+ne+'.','M riceve simultaneamente il vecchio E='+e+'. L’istruzione che ha risolto il salto continua il proprio percorso.','W riceve il vecchio M='+m+'. I tre esiti vengono calcolati dagli ingressi originari e depositati in EAX, R8D e R9D.'],
      asm('mov eax, edi','mov r8d, esi','mov r9d, edx','xor edx, edx','test ecx, ecx','cmovne eax, edx')); },
  {
    consegna: "Prima del fronte D contiene I10, E contiene I9 che risolve un salto errato e M contiene I8. E deve ricevere una bolla, mentre M e W devono acquisire normalmente. Il simulatore stampa E=bolla, M=bolla e W=I8. Trova la destinazione aggiornata in modo scorretto e l’indice dell’istruzione mancante. Scegli il criterio che evita il difetto.",
    campi: [
      {label: "Destinazione errata", answer: "M", choices: ["E", "M", "W"], hint: "Segui il salto che si trovava in E prima del fronte."},
      {label: "Indice mancante", answer: "9", numeric: true, hint: "L’istruzione che ha risolto il salto continua verso M."},
      {label: "Regola di aggiornamento", answer: "Ogni destinazione legge lo stato prima del fronte", choices: ["Ogni destinazione legge lo stato prima del fronte", "La bolla si propaga in tutte le destinazioni nello stesso fronte", "W deve leggere il nuovo M"], hint: "Le acquisizioni allo stesso fronte sono simultanee."}
    ],
    svolgimento: [
      "L’errore di salto elimina il lavoro più giovane che stava per entrare in E. La bolla riportata per E è quindi corretta.",
      "M deve acquisire il vecchio E, che conteneva I9. Leggere il nuovo E propaga erroneamente la bolla per due registri al medesimo fronte.",
      "W riceve il vecchio M e contiene correttamente I8. Lo stato atteso è E=bolla, M=I9 e W=I8. Si ricava calcolando tutte le destinazioni a partire dallo stesso stato precedente."
    ],
    quadro: [
      {titolo: "Contenuti prima del fronte", nota: "Il salto I9 ha già risolto la condizione.", celle: [["D", "I10"], ["E", "I9"], ["M", "I8"]], tipo: "sequenza"},
      {titolo: "Annullamento mirato", nota: "È il lavoro più giovane diretto verso E a essere annullato.", celle: [["destinazione E", "bolla"]], tipo: "stato"},
      {titolo: "Cammino del salto", nota: "I9 avanza anche quando si annulla il lavoro più giovane.", celle: [["vecchio E", "I9"], ["nuovo M", "I9"]], tipo: "sequenza"},
      {titolo: "Stato al nuovo fronte", nota: "Ogni registro acquisisce l’ingresso calcolato dallo stato precedente.", celle: [["E", "bolla"], ["M", "I9"], ["W", "I8"]], tipo: "sequenza"}
    ]
  });
})();
