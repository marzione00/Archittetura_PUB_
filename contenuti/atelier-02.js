/* Parte II • Assembly x86-64. Sintassi Intel, ABI System V e syscall Linux. */
(() => {
  'use strict';
  const N = (id, label, min, max, iniziale, step = 1) => ({id, label, min, max, step, iniziale});
  const S = (id, label, opzioni, iniziale) => ({id, label, opzioni, iniziale});
  const X = (x, digits = 0) => '0x' + BigInt(x).toString(16).toUpperCase().padStart(digits, '0');
  const bit = (x, k) => Math.floor(x / 2 ** k) % 2;
  const signed = (x, bits) => x >= 2 ** (bits - 1) ? x - 2 ** bits : x;
  const pass = (titolo, testo, valori) => ({titolo, testo, valori: Object.entries(valori)});
  const unit = (id, domanda, controlli, calcola) => {
    SL.unita['2.' + id] = {teoria: SL.lezioni['2.' + id].join(' '), domanda, controlli, calcola};
  };
  const byte = (id, label, iniziale) => N(id, label, 0, 255, iniziale);
  const widths = [['8','8 bit'],['16','16 bit']];
  const little = (bytes, i, count) => bytes.slice(i, i + count).reduce((n, b, k) => n + b * 256 ** k, 0);
  const bytesHex = bytes => bytes.map(b => X(b,2).slice(2)).join(' ');
  const flag = b => Number(Boolean(b));

  unit('1.1','Quale byte rimane in AL dopo l’incremento?', [byte('a','Byte da caricare',255)], ({a}) => {
    const r = (a + 1) % 256;
    return [pass('Prima del caricamento','L’esempio parte con AL e i due flag azzerati.',{AL:0,ZF:0,CF:0}),
      pass('MOV AL, immediato','Il valore entra negli otto bit bassi di RAX.',{AL:X(a,2),ZF:0,CF:0}),
      pass('ADD AL, 1','Il riporto segnala il superamento di 255. ZF descrive il byte conservato.',{AL:X(r,2),ZF:flag(r===0),CF:flag(a===255)})];
  });
  unit('1.2','Quale valore a 64 bit contiene RAX dopo la scrittura?', [S('dest','Destinazione',[['8','AL'],['16','AX'],['32','EAX']], '8'),byte('b','Valore da scrivere',171)], ({dest,b}) => {
    const old=0xffffffffffffffffn, w=Number(dest), mask=(1n << BigInt(w))-1n;
    const keep=w===32 ? 0n : old & ~mask;
    return [pass('Registro iniziale','Ogni coppia di cifre esadecimali rappresenta un byte.',{RAX:X(old,16)}),
      pass('Selezione della vista','La maschera delimita il campo di destinazione. Il valore immediato si estende con zeri alla larghezza scelta.',{'Bit scritti':w,Maschera:X(mask),Dato:X(b)}),
      pass('Scrittura','Le cifre conservate si combinano con il nuovo dato.',{'Parte conservata':X(keep,16),RAX:X(keep|BigInt(b),16)})];
  });
  unit('1.3','Quanto vale EAX dopo la seconda somma?', [N('x','Valore iniziale',0,30,5),N('d','Primo incremento',1,12,3)], ({x,d}) => [
    pass('MOV EAX, x','L’immediato prepara il primo operando.',{EAX:x}),
    pass('ADD EAX, d','L’ALU somma il valore iniziale e l’incremento.',{EAX:x+d}),
    pass('MOV ECX, EAX','La copia conserva in ECX il risultato della prima somma.',{EAX:x+d,ECX:x+d}),
    pass('ADD EAX, ECX','La seconda somma usa due copie dello stesso intermedio.',{EAX:2*(x+d),ECX:x+d})]);
  unit('1.4','In quale ciclo termina la somma dipendente con il numero di ALU scelto?', [S('alu','ALU disponibili',[['1','Una'],['2','Due']],'1'),N('x','Valore di partenza',1,20,4)], ({alu,x}) => {
    const last=Number(alu)===1?2:1;
    return [pass('Operandi pronti','R8 e R9 alimentano due incrementi indipendenti.',{R8:x,R9:x+5}),
      pass('Due incrementi','Ogni ALU accetta un incremento per ciclo. Le due destinazioni restano distinte.',{'R8 al ciclo 1':x+1,'R9 aggiornato':x+6,'Ciclo che completa R9':last}),
      pass('Dipendenza finale','ADD R8,R9 attende entrambi gli incrementi. Si conta dal primo ciclo di esecuzione.',{'Ultimo ciclo':last+1,R8:2*x+7,R9:x+6})];
  });

  unit('2.1','Quale risultato conserva il registro alla larghezza scelta?', [S('w','Larghezza',widths,'8'),byte('a','Primo operando',255),byte('b','Secondo operando',1)], ({w,a,b}) => {
    w=Number(w); const m=2**w,r=(a+b)%m,ss=signed(a,w)+signed(b,w);
    return [pass('Interpretazione','Gli stessi bit ammettono una lettura con segno e una senza.',{'A con segno':signed(a,w),'B con segno':signed(b,w)}),
      pass('Somme matematiche','L’intervallo senza segno va da zero a '+(m-1)+'.',{'Somma senza segno':a+b,'Somma con segno':ss}),
      pass('Riduzione alla larghezza','L’ALU trattiene i bit bassi e segnala separatamente i due sconfinamenti.',{Risultato:X(r,w/4),CF:flag(a+b>=m),OF:flag(ss < -m/2 || ss >= m/2)})];
  });
  unit('2.2','Quale valore resta in EAX al termine di a × b + c?', [N('a','a',-12,12,4),N('b','b',-12,12,7),N('c','c',-15,15,3)], ({a,b,c}) => [
    pass('MOV EAX, EDI','La destinazione del risultato riceve a.',{EAX:a,ESI:b,EDX:c}),
    pass('IMUL EAX, ESI','Il prodotto entra in EAX. EDX conserva il terzo addendo.',{EAX:a*b,EDX:c}),
    pass('ADD EAX, EDX','Per questi operandi il risultato è rappresentabile su 32 bit con segno.',{EAX:a*b+c})]);
  unit('2.3','Quale quoziente produce DIV, oppure quale eccezione segnala?', [N('a','Dividendo',0,200,17),N('b','Divisore',0,12,5)], ({a,b}) => {
    const start=pass('Prepara RDX:RAX','Il dividendo entra nei 64 bit bassi e la metà alta vale zero.',{RDX:0,RAX:a});
    const test=pass('Leggi il divisore','DIV RCX verifica il divisore prima di consegnare i risultati.',{RCX:b});
    if(!b) return [start,test,pass('Eccezione #DE','L’istruzione segnala un errore di divisione. I registri conservano lo stato precedente.',{RDX:0,RAX:a})];
    const q=Math.floor(a/b),r=a%b;
    return [start,test,pass('Quoziente e resto','La verifica moltiplica il quoziente per il divisore e aggiunge il resto.',{RAX:q,RDX:r,'Quoziente × divisore + resto':q*b+r})];
  });
  unit('2.4','Quale valore di 7a + 3b − 4 raggiunge RAX?', [N('a','a',-12,12,3),N('b','b',-12,12,2)], ({a,b}) => [
    pass('Scala a','Un indice con scala 8 produce il primo multiplo.',{'8a':8*a,a}),
    pass('Combina i fattori','Una sottrazione produce 7a. Un secondo indirizzo efficace somma b al doppio di b.',{'7a':7*a,'3b':3*b}),
    pass('Applica lo spiazzamento','L’ultima LEA combina i due registri e lo spiazzamento −4.',{'Somma parziale':7*a+3*b,RAX:7*a+3*b-4})]);
  unit('2.5','Dopo l’incremento, JZ salta o prosegue con l’istruzione successiva?', [S('op','Istruzione',[['lea','LEA'],['add','ADD']],'lea'),S('x','EAX iniziale',[['5','5'],['4294967295','0xFFFFFFFF']],'5'),S('z','ZF iniziale',[['1','1'],['0','0']],'1')], ({op,x,z}) => {
    const n=Number(x),r=(n+1)%(2**32),zf=op==='lea'?Number(z):flag(r===0);
    return [pass('Stato in ingresso','L’esempio segue il registro e il flag letto da JZ.',{EAX:X(n,8),ZF:z}),
      pass('Calcolo','L’incremento è ridotto ai 32 bit della destinazione.',{EAX:X(r,8),Istruzione:op.toUpperCase()}),
      pass('JZ destinazione','Il salto condizionale consulta ZF al momento della propria esecuzione.',{ZF:zf,Percorso:zf?'salto preso':'istruzione successiva'})];
  });
  unit('2.6','Quale valore assume OF dopo la sottrazione?', [S('w','Larghezza',widths,'8'),byte('a','Minuendo',128),byte('b','Sottraendo',1)], ({w,a,b}) => {
    w=Number(w); const m=2**w,d=signed(a,w)-signed(b,w),r=(a-b+m)%m;
    return [pass('Leggi gli operandi','La posizione del bit di segno dipende dalla larghezza.',{'A con segno':signed(a,w),'B con segno':signed(b,w)}),
      pass('Sottrai','La differenza con segno ideale si confronta con i limiti della rappresentazione.',{'Differenza con segno':d,Minimo:-m/2,Massimo:m/2-1}),
      pass('Stato dopo SUB','CF segue il confronto senza segno degli operandi originari.',{Risultato:X(r,w/4),CF:flag(a<b),OF:flag(d< -m/2||d>=m/2),SF:bit(r,w-1),ZF:flag(r===0)})];
  });
  unit('2.7','Quale risultato restituisce score per il valore scelto di b?', [N('a','a',-12,12,2),N('b','b senza segno',0,20,9),N('c','c',-12,12,1)], ({a,b,c}) => {
    const val=7*a+c;
    return [pass('Forma il candidato','Sottrai a da 8a, poi aggiungi c.',{'8a':8*a,'7a + c':val}),
      pass('CMP b, 10','Il prestito si verifica precisamente per b inferiore a dieci.',{b,CF:flag(b<10)}),
      pass('Seleziona il ritorno','I due percorsi conservano oppure negano il candidato.',{Percorso:b<10?'candidato invariato':'opposto del candidato',Risultato:b<10?val:-val})];
  });

  unit('3.1','Quale valore decimale entra in EAX leggendo le celle selezionate?', [N('i','Offset dalla base',0,4,4),S('w','Ampiezza',[['1','1 byte'],['2','2 byte'],['4','4 byte']],'4')], ({i,w}) => {
    const mem=[0x02,0x11,0xF1,0x0A,0x78,0x56,0x34,0x12]; w=Number(w);
    return [pass('Memoria a partire da 0x1000','Le coppie seguono gli indirizzi crescenti.',{Byte:bytesHex(mem)}),
      pass('Accesso','L’indirizzo seleziona il primo byte e l’ampiezza delimita il segmento.',{Indirizzo:X(0x1000+i),'Byte letti':bytesHex(mem.slice(i,i+w))}),
      pass('Ricostruzione','Moltiplica i byte successivi per 1, 256, 65536 e 16777216 secondo la loro posizione.',{EAX:X(little(mem,i,w),8),Decimale:little(mem,i,w)})];
  });
  const scales=[['1','1'],['2','2'],['4','4'],['8','8']];
  unit('3.2','Quale indirizzo produce la combinazione di base, indice, scala e spiazzamento?', [N('base','Base',4096,8192,4096,256),N('i','Indice',0,15,3),S('s','Scala',scales,'4'),N('d','Spiazzamento in byte',-16,16,8)], ({base,i,s,d}) => [
    pass('Registri','RDI stabilisce la base della regione.',{RDI:X(base),RSI:i}),
    pass('Offset in byte','Il moltiplicatore si applica solo all’indice.',{'Indice scalato':i*Number(s),Spiazzamento:d}),
    pass('Indirizzo efficace','Aggiungi alla base la somma dei due termini.',{'Offset netto':i*Number(s)+d,Indirizzo:X(base+i*Number(s)+d)})]);
  unit('3.3','A quale indirizzo cominciano i quattro byte della cella scelta?', [N('r','Riga da zero',0,3,2),N('c','Colonna da zero',0,4,3)], ({r,c}) => [
    pass('Salto di riga','Ogni riga contiene cinque interi di quattro byte.',{'Byte per riga':20,'Offset riga':20*r}),
    pass('Spostamento nella riga','La colonna seleziona un intero a partire dall’inizio della riga.',{'Offset colonna':4*c,'Indice lineare':5*r+c}),
    pass('Posizione della cella','La base vale 0x3000.',{'Offset totale':20*r+4*c,Indirizzo:X(0x3000+20*r+4*c)})]);
  unit('3.4','Quanti byte di riempimento separano i due membri?', [S('ordine','Ordine dei membri',[['ci','char, int'],['ic','int, char']],'ci'),N('i','Indice della struttura',0,4,1)], ({ordine,i}) => {
    const ci=ordine==='ci',off=4,used=ci?8:5;
    return [pass('Colloca il primo membro','La base dell’array è allineata a quattro byte.',{'Primo tipo':ci?'char':'int','Byte occupati':ci?1:4}),
      pass('Allinea il secondo','Arrotonda l’offset al prossimo multiplo dell’allineamento del secondo membro.',{'Offset secondo':off,'Padding interno':ci?3:0,'Padding in coda':8-used}),
      pass('Indicizza l’array','Ogni struttura ha passo otto byte.',{'Inizio struttura':X(0x4000+8*i),'Secondo membro':X(0x4000+8*i+off),'Tipo letto':ci?'int':'char'})];
  });
  unit('3.5','Quale valore si legge attraverso p dopo il controllo di q?', [N('p','Indice di p',0,3,2),N('q','Indice di q (4 = fine)',0,4,2)], ({p,q}) => [
    pass('Array di quattro int','I valori iniziali sono 10, 20, 30 e 40. Ogni int occupa quattro byte.',{'Indirizzo p':X(0x5000+4*p),'Indirizzo q':X(0x5000+4*q)}),
    pass('Controlla q prima di scrivere','Il cursore finale è utilizzabile come limite. Il programma scrive 99 solo quando q precede il limite.',{'Indice q':q,'Scrittura eseguita':q<4?'sì':'no'}),
    pass('Leggi *p','Un aggiornamento si riflette su *p quando i due puntatori designano la stessa cella.',{'Stessa cella':p===q?'sì':'no','Valore letto':p===q?99:10*(p+1)})]);
  unit('3.6','Quale indirizzo selezionano i campi dell’istruzione quando RCX contiene l’indice scelto?', [S('s','Scala',scales,'4'),N('i','Valore di RCX',0,12,3)], ({s,i}) => {
    const ss=Math.log2(Number(s)),sib=ss*64+8+3;
    return [pass('Campi','Il campo della scala contiene un esponente. Gli altri due campi identificano i registri indice e base.',{'ss (binario)':ss.toString(2).padStart(2,'0'),index:'001',base:'011'}),
      pass('Composizione','L’opcode 8B carica il registro dalla memoria.',{'SIB':X(sib,2),'Byte istruzione':bytesHex([0x8b,4,sib])}),
      pass('Decodifica','Con RBX = 0x6000, l’indice RCX è moltiplicato per la scala.',{RCX:i,Indirizzo:X(0x6000+i*Number(s))})];
  });

  unit('4.1','Quale valore con segno rimane dopo SAR?', [byte('x','Byte di partenza',128),N('k','Posizioni',1,7,1)], ({x,k}) => {
    const a=Math.floor(signed(x,8)/2**k),u=Math.floor(x/2**k);
    return [pass('Leggi il byte','Le due interpretazioni condividono la stessa disposizione dei bit.',{'Input':X(x,2),'Con segno':signed(x,8)}),
      pass('SHR','I bit alti liberati valgono zero.',{Byte:X(u,2),CF:bit(x,k-1)}),
      pass('SAR','I bit alti liberati ripetono il bit 7 dell’operando originale.',{Byte:X((a+256)%256,2),'Risultato con segno':a,CF:bit(x,k-1)})];
  });
  unit('4.2','In quale byte, contando da zero a partire da destra, cade il bit attivo?', [N('k','Posizione k',0,63,7)], ({k}) => {
    const m=1n<<BigInt(k);
    return [pass('Seme','Il primo passo prepara un unico bit acceso.',{RAX:X(1,16),CL:k}),
      pass('SHL RAX, CL','Lo spostamento porta il bit dalla posizione zero alla posizione k.',{RAX:X(m,16),Decimale:String(m)}),
      pass('Isola il byte','La divisione intera per otto individua il byte. Il resto dà la posizione del bit al suo interno.',{'Byte da destra':Math.floor(k/8),'Bit nel byte':k%8,'Valore del byte':X(2**(k%8),2)})];
  });
  unit('4.3','Quale byte si ottiene combinando i due semibyte?', [byte('h','Sorgente alta',186),byte('l','Sorgente bassa',37)], ({h,l}) => [
    pass('Seleziona','AND 0x0F elimina i bit estranei di ciascuna sorgente.',{Alto:X(h&15),Basso:X(l&15)}),
    pass('Posiziona','SHL di quattro posizioni colloca il primo campo nella metà alta.',{'Campo alto':X((h&15)<<4,2),'Campo basso':X(l&15,2)}),
    pass('Unisci','OR combina i contributi senza sovrapposizione.',{Byte:X(((h&15)<<4)|(l&15),2)})]);
  unit('4.4','Quale intero rappresenta il campo selezionato nella parola a sedici bit?', [N('k','Primo bit',0,8,4),N('w','Ampiezza del campo',1,8,3),N('v','Parola',0,65535,4660)], ({k,w,v}) => {
    const low=2**w-1,mask=low<<k;
    return [pass('Maschera elementare','Stabilisci quanti bit consecutivi devono passare.',{Larghezza:w,Maschera:X(low)}),
      pass('Selezione nella parola','Lo spostamento allinea la maschera alla posizione del campo.',{'Maschera allineata':X(mask,4),'Parola AND maschera':X(v&mask,4)}),
      pass('Normalizzazione','Riporta il primo bit del campo nella posizione zero.',{Valore:(v&mask)>>>k,'Massimo del campo':low})];
  });
  unit('4.5','Quale parola a 32 bit contiene i quattro campi scelti?', [N('op','Opcode',0,63,35),N('a','Registro A',0,31,3),N('b','Registro B',0,31,5),N('imm','Immediato',0,65535,4660)], ({op,a,b,imm}) => {
    const val=op*2**26+a*2**21+b*2**16+imm;
    return [pass('Distribuzione','I bit iniziali dei quattro campi sono 26, 21, 16 e 0.',{Opcode:X(op*2**26,8),A:X(a*2**21,8),B:X(b*2**16,8)}),
      pass('Componi','I campi disgiunti si sommano senza riporti reciproci.',{Immediato:X(imm,4),Parola:X(val,8)}),
      pass('Decodifica di controllo','Scorri a destra e limita la larghezza di ciascun campo.',{Opcode:val>>>26,A:(val>>>21)&31,B:(val>>>16)&31,Immediato:val&65535})];
  });

  const sysregs=['RDI','RSI','RDX','R10','R8','R9'];
  const funregs=['RDI','RSI','RDX','RCX','R8','R9'];
  unit('5.1','Quale valore contiene RAX al rientro dal servizio selezionato?', [S('req','Servizio',[['pid','getpid'],['write','write su fd 1']],'write'),N('n','Byte del messaggio (per write)',1,32,8)], ({req,n}) => {
    const pid=req==='pid';
    return [pass('Richiesta','Nel processo di esempio il PID è 417. Il buffer inizia a 0x5000 e fd 1 è aperto in scrittura.',{RAX:pid?39:1,RDI:pid?'irrilevante':1,RSI:pid?'irrilevante':'0x5000',RDX:pid?'irrilevante':n}),
      pass('Ingresso con SYSCALL','L’istruzione a 0x401000 occupa due byte. I flag utente iniziali valgono 0x202.',{RCX:'0x401002',R11:'0x202',Esecutore:'kernel'}),
      pass('Rientro','Per write si assume un trasferimento completo. Il significato di RAX dipende dal servizio.',{RAX:pid?417:n,Significato:pid?'identificatore del processo':'byte scritti'})];
  });
  unit('5.2','In quale registro il kernel trova l’argomento scelto?', [N('arg','Numero dell’argomento',1,6,4),N('v','Valore intero',0,64,34)], ({arg,v}) => {
    const f=funregs[arg-1],s=sysregs[arg-1];
    return [pass('Ingresso nel wrapper','Il wrapper riceve sei argomenti interi nello stesso ordine della syscall.',{Posizione:arg,'Registro C':f,Valore:v}),
      pass('Adatta gli argomenti','La quarta posizione richiede MOV R10,RCX. Le altre cinque hanno uguale collocazione.',{'Registro syscall':s,'Preparazione della posizione':f===s?'già disponibile':'copia RCX in R10'}),
      pass('Ingresso nel kernel','La disposizione degli argomenti è fissata prima del trasferimento di controllo.',{'Posizione letta':arg,'Registro letto':s,'Contenuto letto':v})];
  });
  unit('5.3','Quanti byte già letti rimangono da scrivere?', [N('n','Byte richiesti a read',1,32,8),N('cap','Byte disponibili in ingresso',0,32,3),N('out','Capacità della prima write',1,32,3)], ({n,cap,out}) => {
    const read=Math.min(n,cap),written=Math.min(read,out);
    return [pass('read da un file ordinario','Il buffer parte da 0x7000 e ha capacità sufficiente. La disponibilità in ingresso termina alla fine del file.',{RDI:3,RSI:'0x7000',RDX:n,'Byte ancora nel file':cap}),
      pass('Prepara write','Il conteggio si ricava dai byte effettivamente letti. Con un ritorno zero la lettura ha raggiunto la fine del file.',{'RAX dopo read':read,RSI:'0x7000','RDX per write':read}),
      pass('Aggiorna il cursore','Per questa scrittura è disponibile la capacità indicata. I byte già emessi precedono il puntatore aggiornato.',{'Byte emessi':written,'Puntatore successivo':X(0x7000+written),'Byte da emettere':read-written})];
  });
  unit('5.4','A quale indirizzo riprende l’esecuzione in spazio utente?', [S('file','Percorso richiesto',[['ok','Eseguibile valido'],['enoent','File assente']],'ok'),N('pid','PID',100,999,417)], ({file,pid}) => {
    const ok=file==='ok';
    return [pass('Vecchia immagine','Il codice chiamante ha la prossima istruzione a 0x401082.',{PID:pid,Immagine:'A','Pagina anonima privata':'presente a 0x700000',RAX:59}),
      pass('Ricerca del file','Si assume un eseguibile statico valido oppure un percorso inesistente.',{Ricerca:ok?'completata':'ENOENT','Mappature dopo la ricerca':ok?'sostituite al successo':'precedenti'}),
      pass('Prossima istruzione utente','Il successo avvia l’immagine B al suo ingresso. L’errore riporta il controllo al chiamante.',{PID:pid,Immagine:ok?'B':'A','Pagina della vecchia immagine':ok?'rilasciata':'ancora presente',RIP:ok?'0x501000':'0x401082','Ritorno della syscall':ok?'nessun ritorno al chiamante':-2})];
  });
  unit('5.5','Da quale offset comincia la lettura tramite fd 4?', [S('mode','Origine di fd 4',[['dup','dup di fd 3'],['open','Seconda open']],'dup'),N('n','Byte letti da fd 3',1,16,3),N('k','Byte letti da fd 4',1,16,3)], ({mode,n,k}) => {
    const share=mode==='dup',base=share?n:0;
    return [pass('Apertura','File ordinario di almeno 32 byte; entrambi i descrittori partono da offset zero.',{'Descrizioni aperte':share?1:2,'Offset fd 3':0,'Offset fd 4':0}),
      pass('read su fd 3','La prima lettura trasferisce tutti i byte richiesti e avanza il suo offset.',{'Offset fd 3':n,'Offset fd 4':base}),
      pass('read su fd 4','L’intervallo letto comprende l’offset iniziale ed esclude quello finale.',{'Primo byte letto':base,'Offset finale fd 4':base+k,'Offset finale fd 3':share?base+k:n})];
  });
  unit('5.6','Quale codice estrae il genitore con WEXITSTATUS?', [N('code','Codice richiesto',0,1023,7)], ({code}) => [
    pass('Ingresso in _start','Il programma carica il codice scelto in RDI.',{RDI:code}),
    pass('Termina','L’ABI delle syscall Linux x86-64 assegna a exit il numero 60.',{RAX:60,'Otto bit bassi di RDI':X(code&255,2)}),
    pass('Attesa del genitore','Per questa terminazione normale waitpid consegna uno stato da cui si estrae il codice.',{'Stato wait Linux':X((code&255)<<8,4),WEXITSTATUS:code&255})]);

  unit('6.1','Da quale registro o cella della pila va letto l’argomento scelto?', [N('i','Posizione dell’argomento',1,7,7),N('base','Valore del primo argomento',0,40,10)], ({i,base}) => {
    const arg=base+i-1;
    return [pass('Preparazione del chiamante','I sette argomenti hanno valori consecutivi e RSP prima di CALL vale 0x8000.',{'Primo valore':base,'Settimo valore':base+6}),
      pass('Ingresso','CALL scrive un indirizzo di ritorno di otto byte.',{RSP:'0x7FF8','RSP modulo 16':8,'Indirizzo del 7º argomento':'0x8000'}),
      pass('Lettura','La posizione seleziona la sede stabilita dalla convenzione.',{Posizione:i,Sede:i<=6?funregs[i-1]:'[RSP + 8]',Valore:arg})];
  });
  unit('6.2','Quale indirizzo raggiunge RIP dopo il ritorno dalla CALL di cinque byte?', [N('off','Offset della CALL da 0x400200',0,48,0),N('slots','Blocchi locali del chiamante da 16 byte',0,4,0)], ({off,slots}) => {
    const pc=0x400200+off,sp=0x9000-16*slots;
    return [pass('Prima della CALL','La destinazione è la funzione a 0x401000.',{RIP:X(pc),RSP:X(sp)}),
      pass('Dopo la CALL','Il salvataggio occupa la nuova cima.',{RIP:'0x401000',RSP:X(sp-8),'[RSP]':X(pc+5)}),
      pass('Dopo RET','La funzione ha riportato RSP alla cima d’ingresso prima di RET.',{RIP:X(pc+5),RSP:X(sp)})];
  });
  unit('6.3','Quale valore rappresenta il byte selezionato come minimo?', [byte('a','Byte A',255),byte('b','Byte B',1),S('t','Confronto',[['s','Con segno'],['u','Senza segno']],'s')], ({a,b,t}) => {
    const diff=signed(a,8)-signed(b,8),r=(a-b+256)%256,sf=bit(r,7),of=flag(diff< -128||diff>127),cf=flag(a<b),take=t==='s'?sf!==of:Boolean(cf);
    return [pass('CMP AL, BL','Il risultato temporaneo occupa otto bit.',{AL:X(a,2),BL:X(b,2),Differenza:X(r,2)}),
      pass('Decidi il salto','JL legge SF e OF, JB legge CF.',{Istruzione:t==='s'?'JL':'JB',SF:sf,OF:of,CF:cf}),
      pass('Seleziona','Quando il salto è preso si sceglie A. Proseguendo con l’istruzione successiva si sceglie B.',{Origine:take?'A':'B',Byte:X(take?a:b,2),Interpretazione:t==='s'?signed(take?a:b,8):take?a:b})];
  });
  unit('6.4','Quale somma restituisce la funzione al termine del ciclo?', [N('n','Contatore iniziale',0,8,4)], ({n}) => {
    const out=[pass('Azzera EAX','ECX contiene il numero dei termini da sommare.',{EAX:0,ECX:n}),pass('TEST ECX, ECX','Il salto iniziale porta all’uscita se il numero di termini vale zero.',{ZF:flag(n===0),Percorso:n?'entra nel ciclo':'uscita diretta'})];
    let acc=0;
    for(let j=n;j>0;j--){acc+=j;out.push(pass('ADD, DEC, JNZ','Aggiungi ECX a EAX, decrementa ECX, poi valuta ZF prodotto da DEC.',{EAX:acc,ECX:j-1,'Salto indietro':j>1?'preso':'fine'}));}
    out.push(pass('RET','Il chiamante riceve il valore finale in EAX.',{Risultato:acc,'Controllo n(n+1)/2':n*(n+1)/2}));return out;
  });
  unit('6.5','Qual è il più piccolo valore ammesso in AL per questa chiamata?', [S('typ','Argomento dopo il formato',[['pair','struct { double x, y; }'],['large','struct { double x; char s[32]; }']],'pair'),S('extra','Argomento successivo',[['none','Assente'],['d','Un double']],'none')], ({typ,extra}) => {
    const pair=typ==='pair',n=pair?2:0,extraD=extra==='d';
    return [pass('Classifica','Il primo argomento fisso è un puntatore al formato in RDI. Tutti i registri vettoriali sono disponibili.',{'Dimensione struttura':pair?16:40,Classe:pair?'SSE, SSE':'MEMORY'}),
      pass('Assegna le sedi','La struttura passa per valore.',{Struttura:pair?'XMM0 e XMM1':'area argomenti sullo stack','Double successivo':extraD?'XMM'+n:'assente'}),
      pass('Prepara la CALL variadica','Il chiamante può usare il conteggio esatto come limite superiore.',{'Registri vettoriali usati':n+Number(extraD),'AL minimo':n+Number(extraD)})];
  });
  unit('6.6','Quale valore restituisce la funzione per l’argomento scelto?', [N('a','Argomento con segno',-50,50,-7)], ({a}) => [
    pass('MOV EAX, EDI','I bit dell’argomento vengono copiati nel registro del risultato.',{EDI:X(a>>>0,8),EAX:X(a>>>0,8)}),
    pass('CMP EDI, 0 / JGE fine','Sottrarre zero conserva il segno del valore e lascia OF a zero.',{SF:flag(a<0),OF:0,'Salto a fine':a>=0?'preso':'cade su NEG'}),
    pass('Unione dei percorsi','Per gli argomenti del laboratorio il valore assoluto è rappresentabile su 32 bit.',{Operazione:a<0?'NEG EAX':'nessuna modifica',EAX:Math.abs(a)})]);

  unit('7.1','A quale indirizzo punta RSP dopo la riserva dei locali?', [N('slots','Blocchi locali da 16 byte',1,6,4)], ({slots}) => [
    pass('Ingresso','CALL ha scritto l’indirizzo di ritorno negli otto byte a partire da RSP.',{RSP:'0x8FF8','[RSP]':'0x401123'}),
    pass('PUSH RBP / MOV RBP, RSP','Il vecchio frame pointer occupa otto byte.',{RBP:'0x8FF0','Indirizzo della copia di RBP':'0x8FF0','Indirizzo della cella di ritorno':'0x8FF8'}),
    pass('SUB RSP, dimensione','L’area locale si estende da RSP fino al byte prima di RBP.',{RSP:X(0x8FF0-16*slots),'Ultimo byte locale':'0x8FEF','Byte locali':16*slots})]);
  unit('7.2','Qual è l’ultima regione raggiunta dalla copia simulata?', [N('n','Byte da copiare',0,24,9)], ({n}) => {
    const region=n===0?'nessuna':n<=8?'buffer':n<=12?'padding':n<=16?'contatore':'dato di controllo';
    return [pass('Layout in ordine di indirizzo','Gli offset sono relativi all’inizio del buffer.',{Buffer:'0–7',Padding:'8–11',Contatore:'12–15',Controllo:'16–23'}),
      pass('Intervallo di scrittura','Una copia di n byte visita gli offset da 0 a n−1, se n è positivo.',{Richiesta:n,'Ultimo offset':n?n-1:'nessuno','Primo offset esterno toccato':n>8?8:'nessuno','Byte fuori buffer':Math.max(0,n-8)}),
      pass('Conta i byte per oggetto','Il conteggio usa gli offset della figura. In C, scrivere oltre il buffer ha comportamento indefinito.',{'Ultima regione':region,'Byte contatore':Math.min(4,Math.max(0,n-12)),'Byte di controllo':Math.max(0,n-16)})];
  });
  unit('7.3','Dopo la scrittura, l’epilogo prosegue verso RET o entra nel gestore di errore?', [S('where','Regione toccata',[['local','Solo locale'],['guard','Un byte della sentinella']],'guard'),byte('value','Byte sostitutivo',0)], ({where,value}) => {
    const g=where==='guard'?value:0xa6;
    return [pass('Prologo','Si segue un solo byte della sentinella e si assumono uguali tutti gli altri.',{'Byte atteso':'0xA6','Byte salvato':'0xA6',Locale:'0x31'}),
      pass('Scrittura simulata','Il byte selezionato sostituisce il contenuto di una sola regione.',{'Byte salvato':X(g,2),Locale:X(where==='local'?value:0x31,2)}),
      pass('Confronto prima del ritorno','Il confronto verifica l’uguaglianza di tutti i byte della sentinella.',{Uguali:g===0xa6?'sì':'no','Percorso':g===0xa6?'epilogo ordinario':'gestore di errore'})];
  });
  unit('7.4','Quale valore contiene l’accumulatore dopo il secondo blocco?', [S('order','Ordine delle etichette',[['ad','Aggiungi 3, poi raddoppia'],['da','Raddoppia, poi aggiungi 3']],'ad'),N('x','Accumulatore iniziale',0,20,4)], ({order,x}) => {
    const ad=order==='ad',t=ad?x+3:x*2;
    return [pass('Pila delle destinazioni','Ogni voce astratta occupa otto byte.',{'[0x9000]':ad?'Aggiungi':'Raddoppia','[0x9008]':ad?'Raddoppia':'Aggiungi','[0x9010]':'Fine',Accumulatore:x}),
      pass('Primo RET e blocco','Il primo indirizzo seleziona l’operazione iniziale.',{RSP:'0x9008',Accumulatore:t}),
      pass('Secondo RET e blocco','Il risultato intermedio diventa l’ingresso del secondo blocco.',{RSP:'0x9010',Accumulatore:ad?2*t:t+3}),
      pass('Ultimo RET','Il consumo della terza voce porta all’etichetta Fine.',{RSP:'0x9018',Destinazione:'Fine'})];
  });
  unit('7.5','Quanti byte sottrae a RSP il corpo di funzione scelto per preparare i locali?', [S('call','Corpo della funzione',[['reg','add_one nei registri'],['leaf','Funzione foglia con temporaneo'],['calls','Chiama una funzione']],'reg'),N('arg','Argomento (solo per add_one)',0,100,41),S('n','Dimensione (solo per i casi con temporaneo)',[['8','8 byte'],['24','24 byte'],['40','40 byte']],'24')], ({call,n,arg}) => {
    if(call==='reg') return [
      pass('Ingresso in add_one','L’argomento intero arriva in RDI e l’indirizzo di ritorno è già alla cima.',{RDI:arg,RSP:'0x9FF8'}),
      pass('LEA RAX, [RDI+1]','La funzione foglia consegna il risultato direttamente in un registro.',{RAX:arg+1,RSP:'0x9FF8','Byte locali riservati':0}),
      pass('RET','Il chiamante riprende il controllo e trova il risultato in RAX.',{RAX:arg+1,RSP:'0xA000'})];
    n=Number(n);const leaf=call==='leaf',sp=0x9ff8,addr=sp-n;
    return [pass('Ingresso','RSP vale 8 modulo 16. Il temporaneo servirà fino alla fine della funzione.',{RSP:X(sp),'Limite basso red zone':X(sp-128)}),
      pass('Scegli la collocazione','Nel caso con chiamata si riserva esplicitamente spazio. Le dimensioni proposte portano RSP a un multiplo di sedici.',{'Byte sottratti a RSP':leaf?0:n,'Inizio temporaneo':X(addr),RSP:X(leaf?sp:addr)}),
      pass('Fine utilizzo','La funzione foglia lascia RSP alla quota iniziale. L’altra libera lo spazio dopo l’ultima lettura.',{'Chiamata interna':leaf?'assente':'con RSP allineato',RSP:X(sp)})];
  });
  unit('7.6','Al momento del ritorno le due copie dell’indirizzo coincidono?', [S('case','Modifica prima di RET',[['intact','Nessuna'],['ret','Indirizzo sullo stack ordinario'],['data','Solo un dato locale']],'ret'),N('d','Scarto (solo per la modifica dell’indirizzo)',1,32,8)], p => {
    const expected=0x401080,observed=expected+(p.case==='ret'?p.d:0);
    return [pass('CALL','L’indirizzo di ripresa viene registrato nelle due pile.',{Ordinario:X(expected),Ombra:X(expected)}),
      pass('Stato prima di RET','La variazione del dato locale lascia intatti entrambi gli indirizzi.',{Ordinario:X(observed),Ombra:X(expected),'Dato locale':p.case==='data'?'modificato':'originario'}),
      pass('Verifica della CPU','La destinazione viene accettata quando coincide con il valore protetto.',{Confronto:observed===expected?'uguale':'diverso',Esito:observed===expected?'ripresa a '+X(expected):'eccezione #CP'})];
  });
  unit('7.7','Quanti byte scrive la routine, incluso il terminatore, dopo il controllo della capacità?', [N('cap','Capacità in byte',0,32,8),N('n','Byte di contenuto',0,32,8)], ({cap,n}) => [
    pass('Misura','La fonte contiene il numero dichiarato di byte leggibili e lo zero finale.',{Contenuto:n,'Spazio richiesto':n+1,Capacità:cap}),
    pass('Valuta il limite','Per scrivere lo zero all’indice n deve esistere quella posizione.',{'Ultimo indice disponibile':cap?cap-1:'nessuno','Indice del terminatore':n}),
    pass('Applica il controllo','Il modello rifiuta l’intera richiesta quando manca spazio.',{Decisione:n<cap?'copia ammessa':'richiesta respinta','Byte scritti':n<cap?n+1:0})]);

  // Il valore da prevedere è quello dell'operazione studiata, anche se la traccia
  // si chiude con un controllo o con l'etichetta della prossima istruzione.
  const previsioni = [
    ['1.1','AL dopo ADD',-1,'AL'],
    ['1.3','EAX dopo la seconda somma',-1,'EAX'],
    ['1.4','Ciclo di completamento della somma',-1,'Ultimo ciclo'],
    ['2.1','Risultato nella larghezza scelta',-1,'Risultato'],
    ['2.6','OF dopo SUB',-1,'OF'],
    ['3.4','Byte di riempimento tra i due membri',1,'Padding interno'],
    ['4.1','Risultato con segno di SAR',-1,'Risultato con segno'],
    ['4.2','Numero del byte, da zero a destra',-1,'Byte da destra'],
    ['4.4','Intero estratto dal campo',-1,'Valore'],
    ['4.5','Parola composta su 32 bit',1,'Parola'],
    ['5.1','RAX al rientro nello spazio utente',-1,'RAX'],
    ['5.2','Registro da cui il kernel legge l’argomento',-1,'Registro letto'],
    ['5.4','RIP alla prossima istruzione utente',-1,'RIP'],
    ['5.5','Offset iniziale della lettura da fd 4',-1,'Primo byte letto'],
    ['6.1','Sede dell’argomento (registro o cella della pila)',-1,'Sede'],
    ['6.2','RIP dopo RET',-1,'RIP'],
    ['6.4','Somma restituita in EAX',-1,'Risultato'],
    ['7.1','RSP dopo la riserva',-1,'RSP'],
    ['7.2','Ultima regione raggiunta, oppure «nessuna»',-1,'Ultima regione'],
    ['7.4','Accumulatore dopo il secondo blocco',2,'Accumulatore'],
    ['7.6','Esito del confronto (uguale o diverso)',-1,'Confronto']
  ];
  for(const [id,label,passo,campo] of previsioni){
    SL.unita['2.'+id].previsione={label,valore:(_p,s)=>Object.fromEntries(s.at(passo).valori)[campo]};
  }
  SL.unita['2.2.3'].previsione={label:'Quoziente in RAX oppure #DE',valore:(p,s)=>p.b===0?'#DE':Object.fromEntries(s.at(-1).valori).RAX};
  SL.unita['2.7.5'].previsione={label:'Byte sottratti a RSP per riservare i locali',valore:(_p,s)=>{
    const v=Object.fromEntries(s[1].valori);
    return v['Byte sottratti a RSP'] ?? v['Byte locali riservati'];
  }};

  // I campi delle prove controllano risultati intermedi oltre alla risposta finale.
  const numero = (label, valore, hint) => ({label, answer:String(valore), numeric:true, hint});
  const scelta = (label, answer, choices, hint) => ({label, answer, choices, hint});
  const caso = (consegna, campi, svolgimento, codice='') => ({consegna,campi,svolgimento,codice});
  function prova(cap, k, u, titolo, principio, varianti, ripasso) {
    const id=String(k).padStart(2,'0'), key='2.'+cap;
    (SL.prove[key] ||= []).push({titolo,principio,unita:key+'.'+u,attivita:'cslez2_'+cap+'_'+id+'_random_assembly_'+id,varianti,...(ripasso ? {ripasso} : {})});
  }
  const righe = (...linee) => linee.join('\n');

  prova(1,1,1,'Dall’istruzione al risultato',
    "In ADD e SUB con due registri, la sintassi Intel mette per primo il registro che riceve il risultato. Il banco dei registri fornisce i valori e l’unità di controllo seleziona l’operazione da eseguire.",
    [
    ['ADD EAX, EBX',6,4,'somma',10],['SUB EAX, EBX',11,4,'differenza',7]
  ].map(([op,a,b,azione,r])=>caso('EAX vale '+a+' ed EBX vale '+b+'. Segui '+op+'. Chi esegue la '+azione+' e quale valore si trova infine in EAX?',[
    scelta('Unità di calcolo','ALU',['ALU','Banco dei registri','Unità di controllo'],'Distingui la selezione dell’operazione dall’esecuzione aritmetica.'),numero('EAX finale',r,'In sintassi Intel il primo operando è la destinazione.')],
    ['L’unità di controllo decodifica '+op+' e seleziona i due ingressi.','Il banco dei registri fornisce '+a+' e '+b+' all’ALU.','La '+azione+' vale '+r+'. Il risultato viene scritto in EAX. EBX conserva '+b+'.'],op)));
  prova(1,2,4,'Dai cicli al tempo di esecuzione',
    "Il CPI è il numero medio di cicli per istruzione. Una frequenza espressa in GHz ha come reciproco un periodo espresso in nanosecondi.",
    [[12,2,2],[24,3,4]].map(([n,cpi,ghz])=>caso('Un tratto esegue '+n+' istruzioni a CPI medio '+cpi+' su un clock di '+ghz+' GHz. Calcola cicli e tempo.',[
    numero('Cicli totali',n*cpi,'Il CPI è il numero medio di cicli per istruzione.'),numero('Tempo in nanosecondi',n*cpi/ghz,'Un clock da 1 GHz compie un ciclo ogni nanosecondo.')],
    ['Il periodo vale 1/'+ghz+' ns = '+1/ghz+' ns.','Il numero di cicli è '+n+' × '+cpi+' = '+n*cpi+'.','Il tempo richiesto è '+n*cpi+' × '+1/ghz+' ns = '+n*cpi/ghz+' ns.'])));
  prova(1,3,4,'Seguire una richiesta nella gerarchia',
    "La cache cerca la linea che contiene il byte richiesto. Con livelli consultati in serie, ogni accesso paga la ricerca in cache e un miss aggiunge il tempo di rifornimento dalla memoria principale.",
    [
    ['La cache dati contiene già la linea richiesta.','SRAM della cache',4,'La ricerca dell’etichetta trova una linea valida.','La cache fornisce il dato direttamente in 4 cicli.'],
    ['La linea è assente dalla cache e la pagina risiede in RAM.','DRAM principale',84,'La ricerca dell’etichetta termina con un miss dopo 4 cicli.','La DRAM fornisce la linea in altri 80 cicli per un totale di 84.']
  ].map(([scena,luogo,t,s1,s2])=>caso(scena+' Nel modello una verifica di cache costa 4 cicli e il riempimento da RAM altri 80. Le fasi sono in serie. Indica la sorgente del dato e la latenza totale in cicli.',[
    scelta('Origine del dato',luogo,['SRAM della cache','DRAM principale','Memoria flash del disco'],'Controlla se la linea è già residente nel primo livello.'),numero('Latenza in cicli',t,'Somma soltanto le fasi effettivamente attraversate.')],
    ['La CPU presenta l’indirizzo alla cache dati.',s1,s2])), '6.1.1');
  prova(1,4,2,'Indirizzi consecutivi e linee di cache',
    "Il quoziente intero fra indirizzo di byte e dimensione della linea ne identifica il numero. Per una lettura di n byte, l’ultimo indirizzo è il primo più n − 1.",
    [[60,4],[28,16]].map(([off,n])=>{
    const line=Math.floor(off/32),last=Math.floor((off+n-1)/32),count=last-line+1;
    return caso('Una cache inizialmente vuota ha linee di 32 byte. Leggi '+n+' byte consecutivi partendo dall’indirizzo '+X(off)+', senza prefetch né espulsioni. Individua la prima linea e conta le linee distinte da caricare.',[
      numero('Numero della prima linea',line,'Dividi l’indirizzo per 32 e arrotonda per difetto.'),numero('Linee da caricare',count,'Calcola anche il numero della linea contenente l’ultimo byte.')],
      ['Il primo indirizzo è '+off+' e appartiene alla linea '+line+'.','L’ultimo byte ha indirizzo '+off+' + '+n+' − 1 = '+(off+n-1)+' e appartiene alla linea '+last+'.','Le linee distinte sono '+last+' − '+line+' + 1 = '+count+'. Ogni prima lettura della linea causa un miss.']);}), '6.1.2');
  prova(1,5,2,'Indirizzamento e ampiezza del bus',
    "Le linee di indirizzo determinano quante celle diverse può selezionare il bus. Le linee dati determinano quanti bit si trasferiscono a ogni scambio.",
    [[16,32,12],[20,64,24]].map(([addr,data,n])=>caso('Un bus usa '+addr+' bit di indirizzo, memoria indirizzata a byte e '+data+' bit di dati per trasferimento. Un blocco allineato occupa '+n+' byte. Determina i byte indirizzabili e i trasferimenti necessari per il blocco.',[
    numero('Byte indirizzabili',2**addr,'Conta le combinazioni delle linee di indirizzo.'),numero('Trasferimenti per il blocco',n/(data/8),'Dividi la dimensione del blocco per i byte trasferibili insieme.')],
    ['Con '+addr+' bit si selezionano 2^'+addr+' = '+2**addr+' indirizzi di byte.','Ogni trasferimento porta '+data+'/8 = '+data/8+' byte.','Il blocco allineato richiede '+n+'/'+data/8+' = '+n/(data/8)+' trasferimenti.'])), '4.4.2');

  prova(2,1,2,'Copia prima del prodotto',
    "IMUL a due operandi sovrascrive la destinazione con i bit bassi del prodotto. Conservando a nel suo registro d’ingresso e una copia in EAX, il prodotto può essere aggiornato senza perdere l’operando originale.",
    [[4,7,3],[9,3,5]].map(([a,b,c])=>caso('Gli argomenti a, b e c valgono '+a+', '+b+', '+c+' in EDI, ESI ed EDX. Produci a×b+c in EAX conservando EDI.',[
    numero('EAX dopo IMUL',a*b,'Copia a in EAX prima di moltiplicarlo per ESI.'),numero('EAX finale',a*b+c,'Aggiungi il terzo argomento soltanto dopo il prodotto.')],
    ['MOV copia '+a+' in EAX e conserva EDI.','IMUL usa '+a+' × '+b+' = '+a*b+' come nuovo EAX.','ADD somma '+c+' e porta EAX a '+(a*b+c)+'. EDI contiene ancora '+a+'.'],righe('mov eax, edi','imul eax, esi','add eax, edx'))));
  prova(2,2,4,'Una combinazione con LEA',
    "LEA forma base + indice × scala + spiazzamento. Lo stesso valore può occupare sia la base sia l’indice, così un fattore di scala disponibile genera un multiplo utile per l’istruzione successiva.",
    [[5,2],[8,7]].map(([a,b])=>caso('EDI contiene a = '+a+' ed ESI contiene b = '+b+'. Calcola 3a + b + 1 in EAX, senza usare una moltiplicazione.',[
    numero('Triplo di a',3*a,'Combina base a e indice a con scala 2.'),numero('Risultato',3*a+b+1,'Il secondo indirizzo efficace ha spiazzamento 1.')],
    ['La prima LEA forma '+a+' + 2×'+a+' = '+3*a+'.','Per la seconda LEA il primo termine vale '+3*a+' e l’indice vale '+b+'.','Lo spiazzamento aggiunge uno: '+3*a+' + '+b+' + 1 = '+(3*a+b+1)+'.'],righe('lea eax, [rdi+rdi*2]','lea eax, [rax+rsi+1]'))));
  prova(2,3,6,'Filtrare una differenza',
    "SUB su AL conserva una differenza a otto bit. Un AND successivo usa i bit a uno della maschera per selezionare le posizioni da mantenere.",
    [[0x32,7,0xf],[0x84,0x29,0xf0]].map(([a,b,m])=>caso('AL contiene '+X(a)+' e BL contiene '+X(b)+'. Sottrai BL da AL, poi conserva soltanto i bit selezionati da '+X(m)+'.',[
    numero('AL dopo SUB',a-b,'Lavora sui byte originari prima di applicare la maschera.'),numero('AL dopo AND',(a-b)&m,'Un bit passa se è presente anche nella maschera.')],
    ['La sottrazione '+X(a)+' − '+X(b)+' produce '+X(a-b,2)+'.','La maschera '+X(m,2)+' seleziona il semibyte '+(m===15?'basso':'alto')+'.','Il risultato di AND è '+X((a-b)&m,2)+', cioè '+((a-b)&m)+'.'],righe('sub al, bl','and al, '+X(m)))));
  prova(2,4,5,'Complemento, scorrimento e test',
    "NOT inverte tutti gli otto bit di AL. SHR sposta il risultato verso destra inserendo zero a sinistra. CMP imposta ZF in base all’uguaglianza fra il byte ottenuto e il termine di confronto.",
    [[0xf0,7],[0x33,0x65]].map(([x,target])=>{
    const inv=255-x,v=inv>>1,eq=flag(v===target);
    return caso('AL parte da '+X(x)+'. Inverti gli otto bit, scorri di una posizione a destra in modo logico e confronta con '+X(target)+'.',[
      numero('AL dopo SHR',v,'NOT su un byte equivale a 255 meno il valore iniziale.'),numero('ZF dopo CMP',eq,'CMP alza ZF se i due byte sono uguali.')],
      ['NOT produce '+X(inv,2)+' perché inverte gli otto bit.','SHR introduce zero a sinistra e porta AL a '+X(v,2)+'.','CMP confronta '+X(v,2)+' con '+X(target,2)+': ZF vale '+eq+'. SETE DL copia questo esito in DL.'],righe('not al','shr al, 1','cmp al, '+X(target),'sete dl'));}));
  prova(2,5,7,'Selezionare il minimo senza segno',
    "CMP imposta CF e ZF dalla sottrazione senza segno fra i due operandi. La copia condizionale deve trasferire il secondo candidato soltanto quando il primo è maggiore.",
    [[0xffffffff,2],[8,12]].map(([a,b])=>caso('EDI contiene '+X(a,8)+' ed ESI contiene '+X(b,8)+'. MOV EAX,EDI prepara il primo candidato. Scegli la CMOV che, dopo CMP EDI,ESI, garantisce il minimo per ogni coppia di interi a 32 bit senza segno. Applicala ai dati indicati.',[
    scelta('Istruzione dopo CMP EDI, ESI','CMOVA EAX, ESI',['CMOVG EAX, ESI','CMOVA EAX, ESI','CMOVE EAX, ESI'],'La copia deve avvenire per un primo operando strettamente maggiore senza segno.'),numero('EAX finale',Math.min(a,b),'Leggi entrambi gli operandi come interi da 0 a 4294967295.')],
    ['MOV prepara '+a+' come candidato in EAX.','CMP calcola i flag di EDI−ESI: CF='+flag(a<b)+', ZF='+flag(a===b)+'.','CMOVA copia ESI se CF e ZF sono entrambi zero. Il minimo vale '+Math.min(a,b)+'.'],righe('mov eax, edi','cmp edi, esi','cmova eax, esi'))));

  prova(3,1,1,'Caricare e interpretare una word',
    "Una word x86 contiene due byte e quello con indirizzo minore ha peso uno. MOVZX completa la destinazione con zeri, MOVSX con copie del bit più significativo della sorgente.",
    [[[0x80,0xff],-128],[[0x34,0x12],4660]].map(([bytes,s])=>{
    const u=little(bytes,0,2);
    return caso('A partire dall’indirizzo contenuto in RDI si trovano, nell’ordine, i byte '+bytesHex(bytes)+'. Confronta MOVZX e MOVSX da word a EAX.',[
      numero('Valore esteso con zeri',u,'Il secondo byte pesa 256.'),numero('Valore con segno su 32 bit dopo MOVSX',s,'Quando il bit 15 vale uno, sottrai 65536 dal valore della word.')],
      ['Little-endian dà '+bytes[0]+' + 256 × '+bytes[1]+' = '+u+'.','MOVZX scrive '+X(u,8)+' in EAX.','MOVSX estende il bit 15 e scrive '+X(s>>>0,8)+' in EAX, interpretato come '+s+' su 32 bit.'],righe('movzx eax, word ptr [rdi]','movsx eax, word ptr [rdi]'));}));
  prova(3,2,2,'Scrivere usando un indirizzo calcolato',
    "Un array di dword ha passo di quattro byte. LEA deposita l’indirizzo nel registro di destinazione. Un MOV che usa quel registro fra parentesi quadre può scrivere nella cella individuata.",
    [[2,0x12345678],[5,0xa1b2c3d4]].map(([i,x])=>caso('RDI vale 0x4000, RSI vale '+i+' e EDX contiene '+X(x,8)+'. Scrivi EDX nell’elemento RSI di un array di dword e conserva l’indirizzo in RAX.',[
    numero('Indirizzo dell’elemento',0x4000+4*i,'Ogni dword sposta la posizione di quattro byte.'),numero('Byte al primo indirizzo',x%256,'In little-endian il byte meno significativo si trova all’indirizzo minore.')],
    ['La scala 4 produce un offset di '+4*i+' byte.','LEA scrive '+X(0x4000+4*i)+' in RAX.','MOV trasferisce quattro byte. Il primo vale '+X(x%256,2)+' perché contiene i bit da 0 a 7.'],righe('lea rax, [rdi+rsi*4]','mov dword ptr [rax], edx'))));
  prova(3,3,2,'Due letture per seguire un puntatore',
    "Una tabella di puntatori a 64 bit ha voci da otto byte. La prima lettura fornisce il puntatore da usare come base della seconda, la cui ampiezza dipende dal tipo del dato finale.",
    [[2,0x5000,37],[4,0x6200,91]].map(([i,base,val])=>caso('RDI=0x3000 punta a una tabella di puntatori a 64 bit. La voce di indice '+i+' (indici da zero) contiene '+X(base)+'. A otto byte da tale base c’è una dword di valore '+val+'. Caricala in EAX.',[
    numero('Indirizzo della voce della tabella',0x3000+8*i,'Una voce della tabella occupa otto byte.'),numero('Indirizzo dell’ultima lettura',base+8,'Il puntatore va prima letto dalla tabella.'),numero('EAX dopo il caricamento',val,'La seconda lettura preleva il contenuto della dword all’indirizzo calcolato.')],
    ['La voce cercata ha indirizzo 0x3000 + 8×'+i+' = '+X(0x3000+8*i)+'.','La prima MOV carica il puntatore '+X(base)+' in RCX.','La seconda MOV legge quattro byte a '+X(base+8)+' e restituisce '+val+' in EAX.'],righe('mov esi, '+i,'mov rcx, [rdi+rsi*8]','mov eax, dword ptr [rcx+8]'))));
  prova(3,4,3,'Scambiare e aggiornare due elementi',
    "Per scambiare due valori occorre conservarli prima di riscrivere le loro celle. I registri temporanei consentono l’aggiornamento successivo anche dopo lo scambio.",
    [[2,7],[12,3]].map(([a,b])=>caso('Un array di due dword contiene ['+a+', '+b+']. Scambia gli elementi quindi incrementa di uno il nuovo elemento zero. RDI contiene la base.',[
    numero('Elemento zero finale',b+1,'Salva il vecchio elemento uno prima di sovrascriverlo.'),numero('Elemento uno finale',a,'Conserva il vecchio elemento zero in un registro temporaneo.')],
    ['Le due MOV iniziali salvano '+a+' in EAX e '+b+' in ECX.','Scrivi EAX all’offset 4: il secondo elemento ora vale '+a+'.','Incrementa ECX e scrivilo all’offset zero. L’array finale è ['+(b+1)+', '+a+'].'],righe('mov eax, [rdi]','mov ecx, [rdi+4]','mov [rdi+4], eax','inc ecx','mov [rdi], ecx'))));
  prova(3,5,3,'Primo e ultimo elemento di un array',
    "In un array di n elementi numerati da zero, l’ultimo indice è n − 1. L’estensione con zeri da word a dword conserva il valore numerico di ogni elemento senza segno.",
    [[5,0x1000,8,13],[7,0x2040,20,17]].map(([n,base,a,b])=>caso('RDI contiene la base '+X(base)+' di un array di word senza segno. ESI ne contiene la lunghezza, '+n+' elementi. Il primo valore è '+a+' e l’ultimo '+b+'. Somma gli estremi in EAX.',[
    numero('Indirizzo dell’ultima word',base+2*(n-1),'L’ultimo indice di un array con n elementi è n−1.'),numero('Somma',a+b,'Carica ciascun valore con estensione a zero prima di sommare.')],
    ['La scrittura su ESI estende la lunghezza con zeri in RSI. Il passo è due byte e l’ultimo indice è '+(n-1)+'.','La lettura finale avviene a '+X(base)+' + '+2*(n-1)+' = '+X(base+2*(n-1))+'.','I due MOVZX danno '+a+' e '+b+'. ADD produce '+(a+b)+' in EAX.'],righe('mov esi, esi','movzx eax, word ptr [rdi]','movzx ecx, word ptr [rdi+rsi*2-2]','add eax, ecx'))));

  prova(4,1,1,'Selezionare un bit del byte basso',
    "La posizione zero è il bit meno significativo. Dopo aver isolato il byte basso, uno scorrimento porta il bit richiesto nella posizione zero e una maschera ne separa il valore.",
    [[0x12ac,3],[0x8196,6]].map(([x,k])=>caso('EAX contiene '+X(x)+'. Isola prima il byte basso, poi il bit '+k+' e normalizzalo a zero o uno.',[
    numero('Byte basso',x&255,'La maschera del byte basso è 0xFF.'),numero('Bit normalizzato',bit(x,k),'Dopo lo scorrimento conserva solo la posizione zero.')],
    ['AND EAX,0xFF dà '+X(x&255,2)+'.','SHR di '+k+' posizioni porta il bit richiesto nella posizione zero e produce '+X((x&255)>>k)+'.','AND con uno estrae '+bit(x,k)+'.'],righe('and eax, 0xff','shr eax, '+k,'and eax, 1'))));
  prova(4,2,3,'Costruire un byte e commutare un bit',
    "Due semibyte occupano un byte se i rispettivi quattro bit sono disgiunti. Dopo la composizione, XOR con una potenza di due inverte esattamente il bit indicato.",
    [[0xba,0x25,3],[0x47,0xb2,6]].map(([hi,lo,k])=>{
    const b=(hi&15)*16+(lo&15),r=b^(1<<k);
    return caso('AL='+X(hi)+', BL='+X(lo)+'. Costruisci un byte con il semibyte basso di AL in alto e quello di BL in basso. Poi commuta il bit '+k+'.',[
      numero('Byte composto',b,'Porta il primo semibyte a sinistra di quattro posizioni.'),numero('Byte dopo XOR',r,'XOR con una potenza di due cambia una sola posizione.')],
      ['I semibyte sono '+X(hi&15)+' e '+X(lo&15)+'.','Dopo SHL e OR il risultato è '+X(b,2)+'.','La maschera del bit '+k+' vale '+X(1<<k)+'; XOR produce '+X(r,2)+'.'],righe('and al, 0x0f','shl al, 4','and bl, 0x0f','or al, bl','xor al, '+X(1<<k)));}));
  prova(4,3,1,'Confrontare i bit dopo un’inversione',
    "XOR inverte i bit selezionati dalla maschera e NOT inverte tutti i bit del byte. SHR tratta il byte risultante come una configurazione senza segno e introduce zeri a sinistra.",
    [[0x95,0xc0],[0x53,0x71]].map(([x,m])=>{
    const z=x^m,inv=255-z;
    return caso('AL='+X(x)+'. Applica XOR con '+X(m)+', inverti tutti gli otto bit e scorri logicamente di due posizioni a destra.',[
      numero('AL dopo XOR',z,'XOR produce uno nelle posizioni in cui gli operandi differiscono.'),numero('AL finale',inv>>2,'Dopo NOT, dividi il byte senza segno per quattro arrotondando per difetto.')],
      ['XOR delle due configurazioni produce '+X(z,2)+'.','NOT AL inverte il byte: 255 − '+z+' = '+inv+'.','SHR AL,2 inserisce due zeri e lascia '+X(inv>>2,2)+' in AL.'],righe('xor al, '+X(m),'not al','shr al, 2'));}));
  prova(4,4,4,'Sostituire un campo e verificarlo',
    "Una maschera con w bit a uno, spostata fino all’inizio del campo, delimita le posizioni da riscrivere. La successiva estrazione riporta quel campo in posizione zero per controllarne il contenuto.",
    [[0xb6,2,3,3],[0x5a,3,2,1]].map(([x,k,w,v])=>{
    const low=2**w-1,mask=low<<k,clean=x&(~mask&255),r=clean|(v<<k);
    return caso('AL='+X(x)+'. Sostituisci i '+w+' bit a partire dalla posizione '+k+' con il valore '+v+' e controlla il campo con una seconda estrazione.',[
      numero('Maschera del campo',mask,'Parti da 2^larghezza−1 e scorri a sinistra.'),numero('Byte modificato',r,'Pulisci il campo prima di inserire i nuovi bit.'),numero('Campo riletto in DL',v,'Sposta il primo bit del campo in posizione zero e applica la maschera elementare.')],
      ['La maschera è '+X(low)+' << '+k+' = '+X(mask,2)+'.','La maschera complementare su otto bit lascia '+X(clean,2)+' nella destinazione.','OR con '+X(v<<k,2)+' produce '+X(r,2)+'. Estraendo i bit si ritrova '+((r>>k)&low)+'.'],righe('and al, '+X(255-mask),'or al, '+X(v<<k),'mov dl, al','shr dl, '+k,'and dl, '+X(low)));}));
  prova(4,5,4,'Allineare un puntatore alla potenza di due',
    "Per un allineamento A pari a una potenza di due, i log₂(A) bit bassi di un indirizzo allineato sono zero. Se la somma è rappresentabile, aggiungere A − 1 prepara l’arrotondamento verso l’alto.",
    [[0x1031,16],[0x207f,32]].map(([x,a])=>{
    const mask=a-1,b=x+mask,r=b-b%a;
    return caso('RAX contiene '+X(x)+'. Arrotonda verso l’alto al primo multiplo di '+a+' usando ADD e AND. Gli indirizzi considerati consentono la somma senza overflow.',[
      numero('Termine da aggiungere',mask,'Per l’allineamento a una potenza di due usa allineamento−1.'),numero('Indirizzo allineato',r,'Dopo la somma azzera i bit bassi corrispondenti alla maschera.')],
      ['La quantità da aggiungere è '+a+' − 1 = '+mask+'.','ADD genera '+X(b)+'. AND con −'+a+' azzera i '+Math.log2(a)+' bit bassi.','La destinazione è '+X(r)+'. TEST RAX,'+mask+' produce zero e quindi ZF=1, a conferma dell’allineamento.'],righe('add rax, '+mask,'and rax, -'+a,'test rax, '+mask));}));

  prova(5,1,1,'Scrivere il messaggio e terminare',
    "Una write diretta su Linux x86-64 riceve descrittore, puntatore e lunghezza in tre registri distinti. La successiva exit usa nuovamente il registro del numero di servizio, questa volta per terminare il thread.",
    [[1,'ciao',7],[2,'errore',12]].map(([fd,msg,code])=>caso('Il simbolo msg identifica i byte ASCII di «'+msg+'» senza carattere di fine riga. Scrivili su fd '+fd+' con un’unica write completa e termina il processo a thread singolo con codice '+code+'.',[
    numero('RDX prima di write',msg.length,'Conta i byte effettivi del messaggio, esclusi terminatori.'),numero('RAX prima della syscall di uscita',60,'Distingui il numero del servizio dal codice dato in RDI.')],
    ['write usa RAX=1, RDI='+fd+', RSI=indirizzo di msg e RDX='+msg.length+'.','Al ritorno RAX vale '+msg.length+' per l’ipotesi di trasferimento completo.','Carica 60 in EAX e '+code+' in EDI. La seconda syscall termina il processo.'],righe('mov eax, 1','mov edi, '+fd,'lea rsi, [rip+msg]','mov edx, '+msg.length,'syscall','mov eax, 60','mov edi, '+code,'syscall'))));
  prova(5,2,3,'Scrivere il suffisso appena letto',
    "Soltanto il prefisso restituito da read contiene dati della lettura. Per individuare un suffisso di quel prefisso servono il conteggio effettivo e il suo offset iniziale.",
    [[8,6,2],[10,4,1]].map(([cap,k,skip])=>caso('Il simbolo buf indica un buffer scrivibile di '+cap+' byte. read restituisce '+k+', tutti validi. Emetti su output il suffisso che comincia all’offset '+skip+'. Assumi write completa.',[
    numero('Offset iniziale del suffisso',skip,'Il primo byte della lettura ha indice zero.'),numero('RDX per write',k-skip,'Usa il ritorno di read e sottrai il prefisso saltato.')],
    ['read riceve fd 0, l’indirizzo di buf e la capacità '+cap+'. RAX al ritorno vale '+k+'.','Controlla che la lunghezza superi '+skip+'. Si parte da buf+'+skip+' e rimangono '+k+' − '+skip+' = '+(k-skip)+' byte.','write riceve fd 1, il puntatore avanzato e il conteggio residuo. Il ramo fine copre anche EOF o errore di read.'],righe('xor eax, eax','xor edi, edi','lea rsi, [rip+buf]','mov edx, '+cap,'syscall','cmp rax, '+skip,'jle fine','lea rdx, [rax-'+skip+']','add rsi, '+skip,'mov eax, 1','mov edi, 1','syscall','fine:'))));
  prova(5,3,3,'Usare un buffer sullo stack',
    "Sottraendo la capacità da RSP si riserva un intervallo di indirizzi per il buffer. L’indice scelto deve ricadere sia nell’intervallo riservato sia nella parte riempita da read.",
    [[16,10,6],[32,18,12]].map(([cap,n,i])=>caso('RSP iniziale vale 0x9000. Riserva '+cap+' byte sulla pila, poi usa read per caricarvi '+n+' byte. Individua il byte di indice '+i+' e scrivilo da solo su fd 1. Si assume read riuscita con il conteggio indicato.',[
    numero('Indirizzo del byte selezionato',0x9000-cap+i,'Sottrai la riserva alla vecchia cima e aggiungi l’indice.'),numero('RSP dopo il rilascio',0x9000,'Rilascia esattamente tanti byte quanti ne hai riservati.')],
    ['SUB porta RSP a '+X(0x9000-cap)+'. I '+n+' byte iniziano a questo indirizzo.','Il confronto garantisce che l’indice sia strettamente inferiore al conteggio restituito. L’indirizzo scelto è '+X(0x9000-cap+i)+'.','Per scrivere un solo byte RDX vale 1. Il rilascio di '+cap+' byte ripristina RSP=0x9000.'],righe('sub rsp, '+cap,'xor eax, eax','xor edi, edi','mov rsi, rsp','mov edx, '+n,'syscall','cmp rax, '+i,'jle fine','lea rsi, [rsp+'+i+']','mov eax, 1','mov edi, 1','mov edx, 1','syscall','fine:','add rsp, '+cap))));
  prova(5,4,3,'Interpretare zero al ritorno di read',
    "In una lettura da file ordinario occorre distinguere il conteggio richiesto da quello restituito. L’offset della descrizione aperta avanza del numero di byte effettivamente trasferiti.",
    [
    [0,'richiesta di zero byte'],[8,'fine del file']
  ].map(([n,spiegazione])=>caso('Un file ordinario è aperto in lettura, senza errori, con offset alla fine del file. Il buffer è valido. Una read di '+n+' byte restituisce zero. Interpreta il risultato '+(n?'per questa richiesta positiva.':'a partire dal solo conteggio richiesto, indipendentemente dalla posizione nel file.'),[
    scelta('Significato basato sul conteggio',spiegazione,['richiesta di zero byte','fine del file','errore EBADF'],'Per concludere che una lettura è arrivata a fine file occorre una richiesta positiva.'),numero('Incremento dell’offset',0,'L’offset avanza del numero di byte trasferiti.')],
    ['Il descrittore punta a un file ordinario e la richiesta usa RDX='+n+'.',n?'La richiesta è positiva. Alla fine del file mancano dati ulteriori da restituire.':'Il conteggio zero dà zero byte anche in presenza di dati disponibili.','Il trasferimento è nullo: RAX=0 e l’offset rimane alla posizione iniziale.'],righe('xor eax, eax','mov edi, 3','lea rsi, [rip+buf]','mov edx, '+n,'syscall'))));
  prova(5,5,3,'Recuperare dopo una write breve',
    "Una write breve lascia da emettere un suffisso contiguo del buffer. Il conteggio restituito è la misura del prefisso da scavalcare nella chiamata successiva.",
    [[9,4],[14,5]].map(([n,k])=>caso('Una read ha consegnato '+n+' byte nel buffer puntato da RSI, pari a 0x6000 nella traccia. La prima write ne accetta '+k+' e la seconda tutto il residuo. Calcola puntatore e conteggio per la seconda write.',[
    numero('RSI per la seconda write',0x6000+k,'Avanza soltanto dei byte che la prima write ha trasferito.'),numero('RDX residuo',n-k,'Sottrai il ritorno positivo dal numero di byte ancora da emettere.')],
    ['Per la prima write RSI=0x6000 e RDX='+n+'. RAX ritorna con '+k+'.','Il prefisso scritto occupa gli indirizzi da 0x6000 a '+X(0x6000+k-1)+'. Il puntatore successivo è '+X(0x6000+k)+'.','Il residuo è '+n+' − '+k+' = '+(n-k)+'. La seconda write completa il totale di '+n+' byte. Il frammento gestisce una sequenza di ritorni positivi.'],righe('mov edx, '+n,'mov edi, 1','ancora:','mov eax, 1','syscall','test rax, rax','jle fine','add rsi, rax','sub rdx, rax','jnz ancora','fine:'))));

  prova(6,1,4,'Dalla macro al file oggetto',
    "Il preprocessore sostituisce le macro prima della traduzione del C. L’opzione -c ferma la costruzione dopo la produzione del file oggetto, lasciando il collegamento a un comando successivo.",
    [[3,5],[7,4]].map(([k,x])=>caso('Il file f.c definisce K come '+k+' e la funzione int f(int x) { return K * x; }. Indica il tipo di file prodotto da gcc -c f.c e valuta f('+x+').',[
    scelta('Prodotto di gcc -c','File oggetto rilocabile',['Testo preprocessato','File oggetto rilocabile','Eseguibile collegato'],'L’opzione ferma il processo prima del collegamento.'),numero('Valore della funzione',k*x,'Sostituisci la macro con il valore intero prima della moltiplicazione.')],
    ['Il preprocessore sostituisce K con '+k+' nel corpo della funzione.','La traduzione e l’assemblaggio producono f.o, un file oggetto rilocabile. Il linker può collegarlo a un chiamante.','La chiamata calcola '+k+' × '+x+' = '+k*x+'; il risultato intero torna in EAX.'],righe('#define K '+k,'int f(int x) { return K * x; }','/* Compilazione: gcc -c f.c -o f.o */'))));
  prova(6,2,6,'Seguire una funzione nel debugger',
    "Un passo macchina nel debugger esegue una sola istruzione. Per LEA il nuovo EAX dipende dagli operandi, mentre l’avanzamento di RIP dipende dalla lunghezza della codifica.",
    [[0x401080,4,5],[0x401120,8,2]].map(([base,a,k])=>caso('Il simbolo f è all’indirizzo '+X(base)+'. All’ingresso EDI='+a+'. Il disassemblato riporta LEA EAX,[RDI+'+k+'] (3 byte), poi RET. Esegui una singola istruzione partendo da f.',[
    numero('RIP dopo LEA',base+3,'L’indirizzo della prossima istruzione si ottiene dalla lunghezza indicata.'),numero('EAX dopo LEA',a+k,'LEA forma la somma senza leggere memoria.')],
    ['Un breakpoint su f arresta il programma prima di LEA a '+X(base)+'.','L’istruzione utilizza EDI='+a+' e lo spiazzamento '+k+'; EAX diventa '+(a+k)+'.','Dopo una singola istruzione RIP punta a RET, all’indirizzo '+X(base+3)+'. In GDB si può verificare con info registers eax rip.'],righe(X(base)+'  lea eax, [rdi+'+k+']',X(base+3)+'  ret'))));
  prova(6,3,3,'Leggere il confronto con segno',
    "JL interpreta i flag di CMP come confronto con segno. I bit 31 degli operandi ne determinano il segno quando li si legge in complemento a due su 32 bit.",
    [[0xffffffff,2],[8,3]].map(([raw,b])=>{
    const a=signed(raw,32),take=a<b;
    return caso('EDI='+X(raw,8)+' ed ESI='+X(b,8)+'. Dopo CMP EDI,ESI il programma usa JL per restituire uno quando EDI è minore con segno, zero altrimenti.',[
      numero('EDI interpretato con segno',a,'In complemento a due su 32 bit sottrai 2^32 quando il bit 31 vale uno.'),numero('EAX al ritorno',flag(take),'JL applica la relazione con segno.')],
      ['EDI rappresenta '+a+' ed ESI rappresenta '+b+'.','La differenza matematica è '+(a-b)+' e rientra nella rappresentazione: OF=0, SF='+flag(a-b<0)+'.','JL verifica SF diverso da OF e '+(take?'raggiunge il ramo che scrive uno':'prosegue nel ramo che azzera EAX')+'. Il ritorno vale '+flag(take)+'.'],righe('cmp edi, esi','jl minore','xor eax, eax','ret','minore:','mov eax, 1','ret'));}));
  prova(6,4,4,'Dall’array alla chiamata',
    "L’indice di un array di int32 avanza di quattro byte per elemento. Prima di una chiamata System V AMD64, il chiamante prepara il primo argomento intero in EDI e allinea RSP.",
    [[2,[4,9,6,7]],[3,[3,5,12,8]]].map(([i,arr])=>caso('RDI punta all’array di int32 ['+arr.join(', ')+'] ed ESI='+i+'. La funzione seleziona l’elemento e chiama doppio(int x), che restituisce 2x. All’ingresso RSP vale 8 modulo 16.',[
    numero('Offset dell’elemento in byte',4*i,'Ogni elemento occupa quattro byte.'),numero('EAX al ritorno',2*arr[i],'Segui ciò che passa in EDI all’ingresso di doppio.')],
    ['Il caricamento usa offset '+4*i+' e legge '+arr[i]+'. Questo valore entra in EDI, primo argomento intero.','SUB RSP,8 rende RSP multiplo di sedici prima di CALL. doppio raddoppia '+arr[i]+' e consegna '+2*arr[i]+' in EAX.','Al rientro il chiamante libera otto byte. Il suo RET conserva EAX, quindi la funzione restituisce '+2*arr[i]+'.'],righe('mov esi, esi','mov edi, [rdi+rsi*4]','sub rsp, 8','call doppio','add rsp, 8','ret','doppio:','lea eax, [rdi+rdi]','ret'))));
  prova(6,5,1,'Ricostruire un’espressione ottimizzata',
    "Nella convenzione System V AMD64 su Linux un long occupa 64 bit. LEA può usare i registri d’argomento come base e indice e scrivere il valore calcolato direttamente nel registro di ritorno.",
    [[3,5,2],[7,4,8]].map(([a,b,scala])=>caso('Una funzione System V riceve due interi lunghi a='+a+' e b='+b+'. Il corpo contiene LEA RAX,[RDI+RSI*'+scala+'] e RET.',[
    scelta('Registro che trasporta b','RSI',['RDI','RSI','RDX'],'Ordina i registri dell’ABI per ciascun argomento intero.'),numero('Valore restituito',a+scala*b,'La scala moltiplica il secondo registro, poi si aggiunge la base.')],
    ['L’ABI colloca a='+a+' in RDI e b='+b+' in RSI.','LEA calcola '+a+' + '+scala+' × '+b+' = '+(a+scala*b)+' direttamente in RAX.','Il chiamante riceve '+(a+scala*b)+' dopo RET. L’espressione equivalente in C è a + '+scala+'*b per gli operandi dati.'],righe('lea rax, [rdi+rsi*'+scala+']','ret'))));

  prova(7,1,1,'Due push e un pop',
    "PUSH salva una parola a 64 bit alla nuova cima dopo aver sottratto otto a RSP. POP legge la cima corrente e aggiunge otto al puntatore.",
    [[8,17],[25,6]].map(([a,b])=>caso('Con RSP iniziale pari a 0x9000 esegui PUSH RAX, PUSH RBX, POP RCX. RAX='+a+' e RBX='+b+'.',[
    numero('RCX finale',b,'Il POP legge il valore della PUSH più recente.'),numero('RSP finale',0x8ff8,'Ogni push sottrae otto byte, ogni pop li riaggiunge.')],
    ['Il primo PUSH scrive '+a+' a 0x8FF8.','Il secondo PUSH scrive '+b+' a 0x8FF0. RSP indica ora questa cella.','POP copia '+b+' in RCX e riporta RSP a 0x8FF8, dove resta '+a+'.'],righe('push rax','push rbx','pop rcx'))));
  prova(7,2,1,'Calcolare gli indirizzi del frame',
    "Il prologo può fissare RBP subito dopo aver salvato il vecchio frame pointer. Le variabili locali hanno allora spiazzamenti stabili rispetto a RBP anche quando RSP si abbassa.",
    [[32,12],[48,24]].map(([n,d])=>caso('RSP all’ingresso vale 0x7FF8. Il prologo salva RBP, imposta il nuovo RBP e riserva '+n+' byte. Una dword locale si trova a RBP−'+d+'.',[
    numero('RSP dopo la riserva',0x7ff0-n,'Deduci prima lo spazio occupato dal vecchio RBP.'),numero('Indirizzo della dword locale',0x7ff0-d,'Usa come origine il frame pointer, fissato subito dopo il PUSH.')],
    ['PUSH RBP porta RSP a 0x7FF0 e vi salva il precedente RBP.','MOV fissa RBP=0x7FF0. SUB abbassa la cima a '+X(0x7ff0-n)+'.','L’indirizzo della variabile è 0x7FF0 − '+d+' = '+X(0x7ff0-d)+', interno all’area riservata.'],righe('push rbp','mov rbp, rsp','sub rsp, '+n,'mov dword ptr [rbp-'+d+'], 1'))));
  prova(7,3,1,'Locale sopravvissuto a una chiamata',
    "Una variabile conservata nel frame del chiamante sopravvive a una chiamata interna. LEAVE ripristina il frame precedente e RET preleva dalla pila la destinazione di ritorno.",
    [[11,4],[20,9]].map(([x,y])=>caso('All’ingresso RSP=0x7FF8 ed EDI='+x+'. Il prologo salva RBP, fissa RBP alla nuova cima e riserva 16 byte. La funzione salva EDI nella dword a RBP−4 e chiama g che restituisce '+y+' in EAX. Al rientro somma la dword a EAX ed esegue LEAVE seguito da RET. Calcola EAX e il valore di RSP dopo questo RET.',[
    numero('EAX finale',x+y,'La locale si trova nel frame del chiamante di g.'),numero('RSP subito dopo RET',0x8000,'Ricostruisci prima la cima all’ingresso della funzione, poi consuma l’indirizzo di ritorno.')],
    ['Il prologo prepara RBP=0x7FF0 e RSP=0x7FE0. La locale a 0x7FEC riceve '+x+'.','g ritorna con '+y+' in EAX. ADD legge la locale e produce '+(x+y)+'.','LEAVE pone RSP=RBP e ripristina il precedente RBP mediante POP: RSP=0x7FF8. RET consuma altri otto byte e lascia RSP=0x8000.'],righe('push rbp','mov rbp, rsp','sub rsp, 16','mov [rbp-4], edi','call g','add eax, [rbp-4]','leave','ret','g:','mov eax, '+y,'ret'))));
  prova(7,4,4,'Duplicare la cima prima delle estrazioni',
    "In PUSH qword ptr [RSP] il processore usa il vecchio RSP per leggere la sorgente. Scrive la copia alla nuova cima della pila.",
    [[3,7],[10,28]].map(([a,b])=>caso('RSP iniziale vale 0x9000. Inserisci '+a+' e poi '+b+' sullo stack, duplica la cima con PUSH qword ptr [RSP], quindi esegui due POP in RAX e RBX.',[
    numero('Somma finale di RAX e RBX',2*b,'La sorgente [RSP] del terzo PUSH viene letta rispetto al vecchio RSP.'),numero('Valore ancora in cima',a,'I due POP eliminano le due copie superiori.')],
    ['Dopo i due PUSH la cima contiene '+b+' e la parola successiva contiene '+a+'.','La duplicazione legge '+b+' dal vecchio indirizzo e lo salva otto byte più in basso.','I due POP caricano '+b+' in entrambi i registri. La somma è '+2*b+' e [RSP] conserva '+a+'.'],righe('push '+a,'push '+b,'push qword ptr [rsp]','pop rax','pop rbx'))));
  prova(7,5,5,'Salvare RBX e ristabilire l’allineamento',
    "System V AMD64 assegna al chiamato la conservazione di RBX. Al confine della CALL interna occorre controllare separatamente l’allineamento di RSP e la posizione della copia salvata.",
    [[16,5],[32,9]].map(([n,x])=>caso('All’ingresso RSP=0x8FF8 e RBX='+x+'. Per usare RBX preservandolo, la funzione lo salva e riserva '+n+' byte prima di chiamare un’altra funzione. Segui la pila fino al ritorno.',[
    numero('RSP immediatamente prima di CALL',0x8ff0-n,'Conta il PUSH a 64 bit e la successiva riserva di locali.'),numero('RBX restituito al chiamante',x,'RBX è un registro callee-saved nella convenzione System V.')],
    ['PUSH RBX salva '+x+' a 0x8FF0. La sottrazione porta RSP a '+X(0x8ff0-n)+', multiplo di 16.','CALL deposita il proprio ritorno a '+X(0x8ff0-n-8)+'. RET della funzione interna ripristina la quota precedente.','La funzione libera '+n+' byte e POP RBX recupera '+x+'. Il RET esterno legge l’indirizzo originario a 0x8FF8.'],righe('push rbx','sub rsp, '+n,'mov ebx, 77','call interna','add rsp, '+n,'pop rbx','ret','interna:','ret'))));
})();
