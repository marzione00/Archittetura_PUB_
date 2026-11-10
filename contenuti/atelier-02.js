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
  function prova(cap, k, u, titolo, principio, varianti, ripasso) {
    const id=String(k).padStart(2,'0'), key='2.'+cap;
    (SL.prove[key] ||= []).push({titolo,principio,unita:key+'.'+u,attivita:'cslez2_'+cap+'_'+id+'_random_assembly_'+id,varianti,...(ripasso ? {ripasso} : {})});
  }
  const righe = (...linee) => linee.join('\n');

  prova(1, 1, 1, "Dall’istruzione al risultato",
    "EAX ed EBX sono registri di 32 bit, piccole memorie interne del processore. Nella sintassi Intel il primo operando di ADD o SUB è la destinazione: ADD EAX,EBX sostituisce EAX con la somma, SUB EAX,EBX con la differenza. L’ALU è l’unità aritmetica e logica che esegue il calcolo; il banco dei registri fornisce i dati e l’unità di controllo sceglie l’operazione. La destinazione conserva i 32 bit bassi: un risultato matematico −1 diventa la configurazione di tutti uno, interpretabile senza segno come 2^32 − 1.",
    [
      {
        consegna: "EAX vale 6 ed EBX vale 4. Segui ADD EAX, EBX. Chi esegue la somma e quale valore si trova infine in EAX?",
        campi: [
          scelta("Unità di calcolo", "ALU", ["ALU", "Banco dei registri", "Unità di controllo"], "Distingui la selezione dell’operazione dall’esecuzione aritmetica."),
          numero("EAX finale", 10, "In sintassi Intel il primo operando è la destinazione.")
        ],
        svolgimento: [
          "L’unità di controllo decodifica ADD EAX, EBX e seleziona i due ingressi.",
          "Il banco dei registri fornisce 6 e 4 all’ALU.",
          "La somma vale 10. Il risultato viene scritto in EAX. EBX conserva 4."
        ],
        codice: righe(
          "ADD EAX, EBX"
        )
      },
      {
        consegna: "Prima di un’istruzione EAX vale 11 ed EBX vale 4. Subito dopo, EAX vale 7 ed EBX vale ancora 4. Individua quale dei tre comandi proposti spiega entrambe le osservazioni e prevedi EAX se, a parità di comando, il primo operando iniziale fosse 3.",
        campi: [
          scelta("Istruzione eseguita", "SUB EAX, EBX", ["SUB EBX, EAX", "SUB EAX, EBX", "ADD EAX, EBX"], "Individua prima la destinazione che è cambiata, poi il segno dell’operazione."),
          numero("EAX nel secondo caso, letto senza segno", 4294967295, "Il risultato matematico è negativo. EAX conserva i trentadue bit bassi.")
        ],
        svolgimento: [
          "È cambiato EAX, perciò l’istruzione deve avere EAX come destinazione. Restano l’addizione e la sottrazione da EAX.",
          "Sottraendo 4 da 11 si ottiene proprio 7. ADD avrebbe scritto 15. Il comando compatibile è SUB EAX, EBX.",
          "Con EAX iniziale pari a 3, la stessa sottrazione dà −1. Su 32 bit il risultato è 0xFFFFFFFF, che senza segno vale 2³² − 1 = 4294967295."
        ],
        quadro: [
          {titolo: "Due istantanee", tipo: "confronto", celle: [["Prima", "EAX 11 · EBX 4"], ["Dopo", "EAX 7 · EBX 4"]]},
          {titolo: "Quale registro ha ricevuto il risultato?", tipo: "stato", celle: [["Destinazione", "EAX"], ["Sorgente", "EBX"]]},
          {titolo: "Due ipotesi sui dati", tipo: "confronto", celle: [["ADD", "15"], ["SUB", "7"]]},
          {titolo: "Nuovi ingressi", tipo: "stato", celle: [["Calcolo", "3 − 4"], ["EAX", "0xFFFFFFFF"]]}
        ]
      }
    ]);

  prova(1, 2, 4, "Dai cicli al tempo di esecuzione",
    "Il clock scandisce i cicli del processore. Il CPI è il numero medio di cicli impiegati per istruzione: moltiplicando le istruzioni per il CPI si ottiene il numero totale di cicli. Un GHz equivale a un miliardo di cicli al secondo e un nanosecondo, abbreviato ns, è un miliardesimo di secondo; una frequenza di f GHz corrisponde dunque a f cicli per ns. Il tempo in ns si ricava dividendo i cicli totali per f. Per confrontare due processori occorre calcolare separatamente il tempo di ciascuno.",
    [
      {
        consegna: "Un tratto esegue 12 istruzioni a CPI medio 2 su un clock di 2 GHz. Calcola cicli e tempo.",
        campi: [
          numero("Cicli totali", 24, "Il CPI è il numero medio di cicli per istruzione."),
          numero("Tempo in nanosecondi", 12, "Un clock da 1 GHz compie un ciclo ogni nanosecondo.")
        ],
        svolgimento: [
          "Il periodo vale 1/2 ns = 0.5 ns.",
          "Il numero di cicli è 12 × 2 = 24.",
          "Il tempo richiesto è 24 × 0.5 ns = 12 ns."
        ]
      },
      {
        consegna: "Il programma completa 60 istruzioni. Sul processore P il CPI medio è 3 e la frequenza è 3 GHz. Su Q il CPI medio è 2 e la frequenza è 2,5 GHz. Quale processore termina prima? Indica il risparmio in nanosecondi rispetto all’altro.",
        campi: [
          scelta("Processore che termina prima", "Q", ["P", "Q", "Arrivano insieme"], "Ricava per ciascuno il numero dei cicli e dividilo per i GHz."),
          numero("Tempo risparmiato (ns)", 12, "Sottrai il tempo minore da quello maggiore.")
        ],
        svolgimento: [
          "P richiede 60 × 3 = 180 cicli. A 3 cicli per nanosecondo occorrono 180 / 3 = 60 ns.",
          "Q richiede 60 × 2 = 120 cicli. A 2,5 cicli per nanosecondo impiega 120 / 2,5 = 48 ns.",
          "Q compensa la frequenza inferiore con un numero minore di cicli. Terminando a 48 ns risparmia 60 − 48 = 12 ns."
        ],
        quadro: [
          {titolo: "Stesso programma", tipo: "confronto", celle: [["P", "3 CPI · 3 GHz"], ["Q", "2 CPI · 2,5 GHz"]]},
          {titolo: "Durata su P", tipo: "stato", celle: [["Cicli", "180"], ["Tempo", "60 ns"]]},
          {titolo: "Durata su Q", tipo: "stato", celle: [["Cicli", "120"], ["Tempo", "48 ns"]]},
          {titolo: "Tempi a confronto", tipo: "confronto", celle: [["P", "60 ns"], ["Q", "48 ns"], ["Risparmio", "12 ns"]]}
        ]
      }
    ]);

  prova(1, 3, 4, "Seguire una richiesta nella gerarchia",
    "La cache conserva vicino al processore copie di blocchi della memoria principale, chiamati linee. La ricerca controlla se la linea richiesta è già presente: un esito favorevole è un hit, l’assenza è un miss. Nel modello la cache usa SRAM, memoria rapida, mentre la memoria principale usa DRAM. La latenza è il numero di cicli trascorsi prima di ottenere il dato. Con fasi eseguite in serie si paga sempre la ricerca in cache; al miss si aggiunge il rifornimento dalla memoria principale. La pagina del caso risiede già in RAM, quindi la traccia riguarda soltanto questi due livelli.",
    [
      {
        consegna: "La cache dati contiene già la linea richiesta. Nel modello una verifica di cache costa 4 cicli e il riempimento da RAM altri 80. Le fasi sono in serie. Indica la sorgente del dato e la latenza totale in cicli.",
        campi: [
          scelta("Origine del dato", "SRAM della cache", ["SRAM della cache", "DRAM principale", "Memoria flash del disco"], "Controlla se la linea è già residente nel primo livello."),
          numero("Latenza in cicli", 4, "Somma soltanto le fasi effettivamente attraversate.")
        ],
        svolgimento: [
          "La CPU presenta l’indirizzo alla cache dati.",
          "La ricerca dell’etichetta trova una linea valida.",
          "La cache fornisce il dato direttamente in 4 cicli."
        ]
      },
      {
        consegna: "La linea è assente dalla cache e la pagina risiede in RAM. Nel modello una verifica di cache costa 4 cicli e il riempimento da RAM altri 80. Le fasi sono in serie. Indica la sorgente del dato e la latenza totale in cicli.",
        campi: [
          scelta("Origine del dato", "DRAM principale", ["SRAM della cache", "DRAM principale", "Memoria flash del disco"], "Controlla se la linea è già residente nel primo livello."),
          numero("Latenza in cicli", 84, "Somma soltanto le fasi effettivamente attraversate.")
        ],
        svolgimento: [
          "La CPU presenta l’indirizzo alla cache dati.",
          "La ricerca dell’etichetta termina con un miss dopo 4 cicli.",
          "La DRAM fornisce la linea in altri 80 cicli per un totale di 84."
        ]
      }
    ], "6.1.1");

  prova(1, 4, 2, "Indirizzi consecutivi e linee di cache",
    "Una linea di cache contiene un blocco di byte consecutivi. Se la dimensione è L, la linea numero q contiene gli indirizzi da qL a qL+L−1. Dividendo l’indirizzo per L, il quoziente intero identifica la linea e il resto indica l’offset, cioè la distanza dal suo primo byte. La lettura di n byte termina all’indirizzo iniziale+n−1. Il prefisso 0x segnala l’esadecimale: ciascuna cifra ha un peso pari a una potenza di sedici. Il caso esclude caricamenti anticipati, detti prefetch, ed espulsioni di linee già caricate.",
    [
      {
        consegna: "Una cache inizialmente vuota ha linee di 32 byte. Leggi 4 byte consecutivi partendo dall’indirizzo 0x3C, senza prefetch né espulsioni. Individua la prima linea e conta le linee distinte da caricare.",
        campi: [
          numero("Numero della prima linea", 1, "Dividi l’indirizzo per 32 e arrotonda per difetto."),
          numero("Linee da caricare", 1, "Calcola anche il numero della linea contenente l’ultimo byte.")
        ],
        svolgimento: [
          "Il primo indirizzo è 60 e appartiene alla linea 1.",
          "L’ultimo byte ha indirizzo 60 + 4 − 1 = 63 e appartiene alla linea 1.",
          "Le linee distinte sono 1 − 1 + 1 = 1. Ogni prima lettura della linea causa un miss."
        ]
      },
      {
        consegna: "Le linee di cache hanno 32 byte. La lettura comincia all’indirizzo 0x3A e il primo accesso ha già caricato la linea che lo contiene. Determina la massima lunghezza che può avere questa lettura restando in una sola linea. Indica poi il primo indirizzo che richiederebbe la linea successiva.",
        campi: [
          numero("Massima lunghezza (byte)", 6, "L’ultimo indirizzo di una linea di 32 byte ha offset 31. Conta anche il byte iniziale."),
          numero("Primo indirizzo della linea successiva", 64, "Cerca il multiplo di 32 immediatamente successivo a 0x3A.")
        ],
        svolgimento: [
          "0x3A vale 58. Il quoziente intero 58 / 32 è 1 e il resto è 26, quindi la lettura parte dalla linea 1 all’offset 26.",
          "Gli offset disponibili sono 26, 27, 28, 29, 30 e 31. Il massimo è dunque 32 − 26 = 6 byte.",
          "Il primo byte ulteriore ha indirizzo 58 + 6 = 64, ossia 0x40. Il settimo byte della lettura richiederebbe quindi la linea 2."
        ],
        quadro: [
          {titolo: "Inizio della richiesta", tipo: "stato", celle: [["Linea", "32 byte"], ["Primo byte", "0x3A"]]},
          {titolo: "Divisione per 32", tipo: "stato", celle: [["Quoziente", "1"], ["Resto", "26"]]},
          {titolo: "Ultimo tratto della linea", tipo: "sequenza", celle: [["Offset iniziale", "26"], ["Offset finale", "31"], ["Byte", "6"]]},
          {titolo: "Confine", tipo: "confronto", celle: [["Ultimo incluso", "0x3F"], ["Primo ulteriore", "0x40"]]}
        ]
      }
    ], "6.1.2");

  prova(1, 5, 2, "Indirizzamento e ampiezza del bus",
    "Il bus è l’insieme dei collegamenti che trasporta indirizzi e dati. Con b bit di indirizzo si possono distinguere 2^b posizioni; se ogni posizione contiene un byte, questo è anche il numero di byte indirizzabili. Un byte contiene otto bit, quindi un bus dati largo d bit trasferisce d/8 byte per scambio. Nel modello un blocco allineato comincia su un confine di trasferimento e può essere suddiviso in gruppi pieni della larghezza scelta. Per una lunghezza multipla di quella larghezza, il numero di scambi è lunghezza/(d/8).",
    [
      {
        consegna: "Un bus usa 16 bit di indirizzo, memoria indirizzata a byte e 32 bit di dati per trasferimento. Un blocco allineato occupa 12 byte. Determina i byte indirizzabili e i trasferimenti necessari per il blocco.",
        campi: [
          numero("Byte indirizzabili", 65536, "Conta le combinazioni delle linee di indirizzo."),
          numero("Trasferimenti per il blocco", 3, "Dividi la dimensione del blocco per i byte trasferibili insieme.")
        ],
        svolgimento: [
          "Con 16 bit si selezionano 2^16 = 65536 indirizzi di byte.",
          "Ogni trasferimento porta 32/8 = 4 byte.",
          "Il blocco allineato richiede 12/4 = 3 trasferimenti."
        ]
      },
      {
        consegna: "Una memoria contiene 65 536 posizioni, ciascuna di un byte. Il progettista deve leggere un blocco allineato di 24 byte in al massimo tre trasferimenti. Il bus dati può essere da 16, 32 oppure 64 bit. Ricava la larghezza minima dell’indirizzo e scegli il più stretto bus dati sufficiente.",
        campi: [
          numero("Bit di indirizzo indispensabili", 16, "Cerca la potenza di due uguale al numero di celle."),
          scelta("Larghezza minima del bus dati", "64 bit", ["32 bit", "64 bit", "16 bit"], "Dividi i byte del blocco per i trasferimenti disponibili e converti in bit.")
        ],
        svolgimento: [
          "Ogni cella deve avere un indirizzo. Poiché 2¹⁶ = 65 536, occorrono 16 bit di indirizzo.",
          "Tre trasferimenti devono trasportare complessivamente 24 byte. Ogni trasferimento deve quindi portarne almeno 8.",
          "Otto byte corrispondono a 64 bit, perciò questa è l’unica larghezza proposta sufficiente. Con 32 bit servirebbero sei trasferimenti e con 16 bit dodici."
        ],
        quadro: [
          {titolo: "Vincoli del progetto", tipo: "stato", celle: [["Celle", "65 536"], ["Blocco", "24 B"], ["Limite", "3 scambi"]]},
          {titolo: "Selezione della memoria", tipo: "stato", celle: [["Celle", "2¹⁶"], ["Indirizzo", "16 bit"]]},
          {titolo: "Quantità per turno", tipo: "sequenza", celle: [["Blocco", "24 B"], ["Scambi", "3"], ["Per scambio", "8 B"]]},
          {titolo: "Confronto delle larghezze", tipo: "confronto", celle: [["16 bit", "12 scambi"], ["32 bit", "6 scambi"], ["64 bit", "3 scambi"]]}
        ]
      }
    ], "4.4.2");

  prova(2, 1, 2, "Copia prima del prodotto",
    "IMUL a due operandi sovrascrive la destinazione con i bit bassi del prodotto. Conservando a nel suo registro d’ingresso e una copia in EAX, il prodotto può essere aggiornato senza perdere l’operando originale.",
    [
      {
        consegna: "Gli argomenti a, b e c valgono 4, 7, 3 in EDI, ESI ed EDX. Il programma copia a in EAX, moltiplica EAX per b e aggiunge c, conservando EDI. Calcola il valore di EAX subito dopo IMUL e quello finale.",
        campi: [
          numero("EAX dopo IMUL", 28, "Copia a in EAX prima di moltiplicarlo per ESI."),
          numero("EAX finale", 31, "Aggiungi il terzo argomento soltanto dopo il prodotto.")
        ],
        svolgimento: [
          "MOV copia 4 in EAX e conserva EDI.",
          "IMUL usa 4 × 7 = 28 come nuovo EAX.",
          "ADD somma 3 e porta EAX a 31. EDI contiene ancora 4."
        ],
        codice: righe(
          "mov eax, edi",
          "imul eax, esi",
          "add eax, edx"
        )
      },
      {
        consegna: "Il frammento dovrebbe restituire a × b + c in EAX e conservare a in EDI. Con a = 6, b = 4 e c = 2 dà la risposta numerica corretta, benché violi il secondo requisito. Indica il valore che lascia in EDI e scegli la riparazione che soddisfa entrambi i requisiti.",
        campi: [
          numero("EDI dopo il frammento difettoso", 24, "L’istruzione IMUL riscrive il proprio primo operando."),
          scelta("Prime due istruzioni corrette", "MOV EAX, EDI poi IMUL EAX, ESI", ["IMUL EDI, ESI poi MOV EAX, EDI", "MOV EAX, EDI poi IMUL EAX, ESI", "MOV EDI, EAX poi IMUL EDI, ESI"], "Devi eseguire il prodotto in una copia di a.")
        ],
        svolgimento: [
          "IMUL EDI, ESI sovrascrive 6 con 6 × 4 = 24. La MOV successiva copia già il prodotto, mentre EDI rimane 24.",
          "ADD porta EAX a 24 + 2 = 26. Controllare soltanto il valore di ritorno farebbe passare inosservata la perdita dell’argomento.",
          "MOV EAX, EDI conserva a nella sorgente e ne crea una copia nella destinazione. IMUL EAX, ESI e ADD EAX, EDX producono poi 26 lasciando EDI a 6."
        ],
        listato: righe(
          "imul edi, esi",
          "mov eax, edi",
          "add eax, edx"
        ),
        quadro: [
          {titolo: "Contratto", tipo: "stato", celle: [["EDI", "6"], ["ESI", "4"], ["EDX", "2"]]},
          {titolo: "Prima moltiplicazione", tipo: "confronto", celle: [["EDI iniziale", "6"], ["EDI dopo IMUL", "24"]]},
          {titolo: "Verifica separata", tipo: "stato", celle: [["Risultato EAX", "26"], ["Argomento EDI", "24"]]},
          {titolo: "Esecuzione corretta", tipo: "confronto", celle: [["EDI", "6"], ["EAX", "26"]]}
        ]
      }
    ]);

  prova(2, 2, 4, "Una combinazione con LEA",
    "LEA forma base + indice × scala + spiazzamento. Quando lo stesso valore fornisce sia la base sia l’indice, il primo calcolo forma un multiplo. La LEA successiva può aggiungervi un altro registro e uno spiazzamento.",
    [
      {
        consegna: "EDI contiene a = 5 ed ESI contiene b = 2. Calcola 3a + b + 1 in EAX, senza usare una moltiplicazione.",
        campi: [
          numero("Triplo di a", 15, "Combina base a e indice a con scala 2."),
          numero("Risultato", 18, "Il secondo indirizzo efficace ha spiazzamento 1.")
        ],
        svolgimento: [
          "La prima LEA forma 5 + 2×5 = 15.",
          "Per la seconda LEA il primo termine vale 15 e l’indice vale 2.",
          "Lo spiazzamento aggiunge uno: 15 + 2 + 1 = 18."
        ],
        codice: righe(
          "lea eax, [rdi+rdi*2]",
          "lea eax, [rax+rsi+1]"
        )
      },
      {
        consegna: "Il debugger mostra 26 in EAX dopo il listato e 4 in ESI all’ingresso. EDI conteneva un intero positivo inferiore a 20 e le operazioni rientrano in 32 bit. Recupera EAX fra le due istruzioni e il valore iniziale di EDI.",
        campi: [
          numero("EAX fra le due LEA", 21, "Dall’uscita sottrai l’indice ESI e lo spiazzamento della seconda LEA."),
          numero("EDI all’ingresso", 7, "La prima LEA usa a sia come base sia come indice con scala 2.")
        ],
        svolgimento: [
          "L’ultima LEA aggiunge al risultato intermedio 4 + 1. Prima di eseguirla EAX conteneva quindi 26 − 5 = 21.",
          "Nella prima LEA la base e l’indice provengono entrambi da RDI. Si ottiene 3a = 21, da cui a = 7.",
          "La verifica in avanti restituisce prima 7 + 2 × 7 = 21 e poi 21 + 4 + 1 = 26, esattamente il valore osservato."
        ],
        listato: righe(
          "lea eax, [rdi+rdi*2]",
          "lea eax, [rax+rsi+1]"
        ),
        quadro: [
          {titolo: "Traccia incompleta", tipo: "stato", celle: [["ESI", "4"], ["Ultimo EAX", "26"]]},
          {titolo: "Risalita dalla seconda LEA", tipo: "sequenza", celle: [["Uscita", "26"], ["Termine noto", "5"], ["Intermedio", "21"]]},
          {titolo: "Risoluzione della prima", tipo: "stato", celle: [["3a", "21"], ["a", "7"]]},
          {titolo: "Verifica in avanti", tipo: "sequenza", celle: [["Ingresso", "7"], ["Intermedio", "21"], ["Uscita", "26"]]}
        ]
      }
    ]);

  prova(2, 3, 6, "Filtrare una differenza",
    "AL e BL contengono ciascuno otto bit, cioè un byte; un semibyte ne contiene quattro. Il semibyte alto occupa le posizioni da 4 a 7 e il basso quelle da 0 a 3. SUB AL,BL conserva in AL gli otto bit bassi della differenza. AND mantiene una posizione soltanto quando entrambi i bit corrispondenti sono uno: la maschera 0x0F seleziona il semibyte basso, 0xF0 quello alto. Durante la sottrazione un prestito dal semibyte alto può modificarlo; filtrare gli ingressi prima del calcolo può quindi cambiare il risultato rispetto al filtraggio della differenza completa.",
    [
      {
        consegna: "AL contiene 0x32 e BL contiene 0x7. Sottrai BL da AL, poi conserva soltanto i bit selezionati da 0xF.",
        campi: [
          numero("AL dopo SUB", 43, "Lavora sui byte originari prima di applicare la maschera."),
          numero("AL dopo AND", 11, "Un bit passa se è presente anche nella maschera.")
        ],
        svolgimento: [
          "La sottrazione 0x32 − 0x7 produce 0x2B.",
          "La maschera 0x0F seleziona il semibyte basso.",
          "Il risultato di AND è 0x0B, cioè 11."
        ],
        codice: righe(
          "sub al, bl",
          "and al, 0xF"
        )
      },
      {
        consegna: "Si vuole conservare il semibyte alto di AL − BL. Ada propone di azzerare i semibyte bassi di entrambi gli operandi prima della sottrazione. Prova AL=0x30 e BL=0x01. Indica il byte corretto e il risultato della proposta, entrambi dopo il filtraggio con 0xF0.",
        campi: [
          numero("Sottrazione completa seguita da AND", 32, "Il prestito dalla colonna alta dipende anche dai quattro bit bassi."),
          numero("Operandi filtrati prima di SUB", 48, "Azzera il semibyte basso di entrambi e ripeti la sottrazione.")
        ],
        svolgimento: [
          "La sottrazione originale vale 0x30 − 0x01 = 0x2F. Applicando AND con 0xF0 rimane 0x20, cioè 32.",
          "Filtrando prima gli ingressi si ottengono 0x30 e 0x00. La differenza filtrata è quindi 0x30, cioè 48.",
          "Nel primo calcolo sottrarre uno da un semibyte basso nullo richiede un prestito. L’azzeramento anticipato elimina proprio la richiesta di prestito e cambia il semibyte alto."
        ],
        quadro: [
          {titolo: "Stessi ingressi", tipo: "stato", celle: [["AL", "0x30"], ["BL", "0x01"], ["Maschera", "0xF0"]]},
          {titolo: "Sottrazione completa", tipo: "stato", celle: [["Differenza", "0x2F"], ["Campo alto", "0x20"]]},
          {titolo: "Filtraggio anticipato", tipo: "stato", celle: [["Operandi", "0x30, 0x00"], ["Campo alto", "0x30"]]},
          {titolo: "Effetto del prestito", tipo: "confronto", celle: [["Ordine corretto", "32"], ["Ordine proposto", "48"]]}
        ]
      }
    ]);

  prova(2, 4, 5, "Complemento, scorrimento e test",
    "NOT inverte tutti gli otto bit di AL. SHR sposta il risultato verso destra inserendo zero a sinistra. CMP imposta ZF in base all’uguaglianza fra il byte ottenuto e il termine di confronto.",
    [
      {
        consegna: "AL parte da 0xF0. Inverti gli otto bit, scorri di una posizione a destra in modo logico e confronta con 0x7.",
        campi: [
          numero("AL dopo SHR", 7, "NOT su un byte equivale a 255 meno il valore iniziale."),
          numero("ZF dopo CMP", 1, "CMP alza ZF se i due byte sono uguali.")
        ],
        svolgimento: [
          "NOT produce 0x0F perché inverte gli otto bit.",
          "SHR introduce zero a sinistra e porta AL a 0x07.",
          "CMP confronta 0x07 con 0x07: ZF vale 1. SETE DL copia questo esito in DL."
        ],
        codice: righe(
          "not al",
          "shr al, 1",
          "cmp al, 0x7",
          "sete dl"
        )
      },
      {
        consegna: "Dopo NOT AL e SHR AL,1 si osserva AL=0x12. Una successiva CMP AL,0x12 dà ZF=1. Tra le coppie proposte scegli tutti e soli i due byte iniziali compatibili. Indica quale posizione del byte iniziale distingue i due ingressi, numerando da destra con zero.",
        campi: [
          scelta("Possibili valori iniziali", "0xDA e 0xDB", ["0xDA e 0xDB", "0x24 e 0x25", "0x12 e 0x92"], "Prima dello scorrimento il byte invertito può terminare sia con zero sia con uno."),
          numero("Posizione che distingue gli ingressi", 0, "Quale cifra esce a destra durante SHR di una posizione?")
        ],
        svolgimento: [
          "Poiché SHR di un posto produce 0x12, il byte successivo a NOT poteva essere 0x24 oppure 0x25. Entrambi diventano 0x12 con lo scorrimento.",
          "Invertendo ciascuno dei due candidati si torna al byte iniziale. NOT 0x24 dà 0xDB e NOT 0x25 dà 0xDA.",
          "I valori 0xDA e 0xDB differiscono soltanto nel bit 0. La CMP finale usa il dato già ridotto a 0x12 e dà ZF=1 in entrambi i casi."
        ],
        quadro: [
          {titolo: "Osservazione finale", tipo: "stato", celle: [["AL", "0x12"], ["ZF", "1"]]},
          {titolo: "Prima di SHR", tipo: "confronto", celle: [["Candidato A", "0x24"], ["Candidato B", "0x25"]]},
          {titolo: "Prima di NOT", tipo: "confronto", celle: [["Possibile A", "0xDB"], ["Possibile B", "0xDA"]]},
          {titolo: "Informazione perduta", tipo: "stato", celle: [["Posizione", "bit 0"], ["Esito finale", "identico"]]}
        ]
      }
    ]);

  prova(2, 5, 7, "Selezionare il minimo senza segno",
    "CMP confronta il primo operando con il secondo tramite una sottrazione temporanea. CF vale uno quando il primo è minore nella lettura senza segno; ZF vale uno quando sono uguali. CMOVA copia il secondo candidato nella destinazione quando CF=0 e ZF=0, cioè quando il primo è maggiore senza segno. CMOVG applica invece l’ordine con segno. Su 32 bit il complemento a due interpreta un valore senza segno almeno pari a 2^31 sottraendogli 2^32. Uno stesso insieme di bit può quindi cambiare posizione nell’ordinamento, e la scelta della copia condizionale deve seguire il tipo richiesto.",
    [
      {
        consegna: "EDI contiene 0xFFFFFFFF ed ESI contiene 0x00000002. MOV EAX,EDI prepara il primo candidato. Scegli la CMOV che, dopo CMP EDI,ESI, garantisce il minimo per ogni coppia di interi a 32 bit senza segno. Applicala ai dati indicati.",
        campi: [
          scelta("Istruzione dopo CMP EDI, ESI", "CMOVA EAX, ESI", ["CMOVG EAX, ESI", "CMOVA EAX, ESI", "CMOVE EAX, ESI"], "La copia deve avvenire per un primo operando strettamente maggiore senza segno."),
          numero("EAX finale", 2, "Leggi entrambi gli operandi come interi da 0 a 4294967295.")
        ],
        svolgimento: [
          "MOV prepara 4294967295 come candidato in EAX.",
          "CMP calcola i flag di EDI−ESI: CF=0, ZF=0.",
          "CMOVA copia ESI se CF e ZF sono entrambi zero. Il minimo vale 2."
        ],
        codice: righe(
          "mov eax, edi",
          "cmp edi, esi",
          "cmova eax, esi"
        )
      },
      {
        consegna: "Il minimo richiesto è quello senza segno. Il listato usa invece CMOVG, che interpreta il confronto con segno. Quale coppia (EDI, ESI) fra quelle proposte rende visibile l’errore? Indica quale valore dovrebbe restituire la versione corretta per quella coppia.",
        campi: [
          scelta("Coppia che distingue i due confronti", "(0xFFFFFFFE, 1)", ["(8, 12)", "(0xFFFFFFFE, 1)", "(7, 7)"], "Cerca operandi che cambino ordine se il bit 31 viene interpretato come segno."),
          numero("Minimo corretto letto senza segno", 1, "Tratta ciascun operando come un valore fra 0 e 2³² − 1.")
        ],
        svolgimento: [
          "Con 8 e 12 l’ordine è identico nelle due interpretazioni. Due operandi uguali danno comunque lo stesso minimo.",
          "0xFFFFFFFE vale 4294967294 senza segno e −2 con segno. CMOVG esamina −2 > 1, condizione falsa, e lascia 0xFFFFFFFE in EAX.",
          "Nel confronto richiesto, 4294967294 supera 1. Dopo la stessa CMP, CMOVA seleziona ESI e restituisce 1."
        ],
        listato: righe(
          "mov eax, edi",
          "cmp edi, esi",
          "cmovg eax, esi"
        ),
        quadro: [
          {titolo: "Scelta dei dati", tipo: "confronto", celle: [["Positivi", "8 e 12"], ["Segni diversi", "0xFFFFFFFE e 1"], ["Uguali", "7 e 7"]]},
          {titolo: "Casi concordi", tipo: "stato", celle: [["8 e 12", "stesso ordine"], ["7 e 7", "uguaglianza"]]},
          {titolo: "Due letture della parola", tipo: "confronto", celle: [["Con segno", "−2"], ["Senza segno", "4294967294"]]},
          {titolo: "Candidato scelto", tipo: "confronto", celle: [["CMOVG", "0xFFFFFFFE"], ["CMOVA", "1"]]}
        ]
      }
    ]);

  prova(3, 1, 1, "Caricare e interpretare una word",
    "Una word x86 contiene due byte e un registro EAX ne contiene quattro. Le coppie esadecimali descrivono i byte: nel formato little-endian il byte all’indirizzo minore ha peso uno e il successivo peso 256. MOVZX allarga la sorgente inserendo zeri nei bit alti della destinazione. MOVSX vi replica il bit più significativo della sorgente, conservandone il valore con segno in complemento a due. Per interpretare una word con segno, si sottrae 2^16 al valore senza segno quando il bit 15 vale uno; sulla destinazione a 32 bit la stessa regola usa 2^32 e il bit 31.",
    [
      {
        consegna: "A partire dall’indirizzo contenuto in RDI si trovano, nell’ordine, i byte 80 FF. Confronta MOVZX e MOVSX da word a EAX.",
        campi: [
          numero("Valore esteso con zeri", 65408, "Il secondo byte pesa 256."),
          numero("Valore con segno su 32 bit dopo MOVSX", -128, "Quando il bit 15 vale uno, sottrai 65536 dal valore della word.")
        ],
        svolgimento: [
          "Little-endian dà 128 + 256 × 255 = 65408.",
          "MOVZX scrive 0x0000FF80 in EAX.",
          "MOVSX estende il bit 15 e scrive 0xFFFFFF80 in EAX, interpretato come -128 su 32 bit."
        ],
        codice: righe(
          "movzx eax, word ptr [rdi]",
          "movsx eax, word ptr [rdi]"
        )
      },
      {
        consegna: "A partire dall’indirizzo contenuto in RDI si trovano, nell’ordine, i byte 34 12. Confronta MOVZX e MOVSX da word a EAX.",
        campi: [
          numero("Valore esteso con zeri", 4660, "Il secondo byte pesa 256."),
          numero("Valore con segno su 32 bit dopo MOVSX", 4660, "Quando il bit 15 vale uno, sottrai 65536 dal valore della word.")
        ],
        svolgimento: [
          "Little-endian dà 52 + 256 × 18 = 4660.",
          "MOVZX scrive 0x00001234 in EAX.",
          "MOVSX estende il bit 15 e scrive 0x00001234 in EAX, interpretato come 4660 su 32 bit."
        ],
        codice: righe(
          "movzx eax, word ptr [rdi]",
          "movsx eax, word ptr [rdi]"
        )
      }
    ]);

  prova(3, 2, 2, "Scrivere usando un indirizzo calcolato",
    "Gli elementi di un array di dword distano quattro byte l’uno dall’altro. Dalla differenza fra indirizzo e base si ricava l’indice dividendo per quattro. Il byte di peso minore occupa l’indirizzo più basso.",
    [
      {
        consegna: "RDI vale 0x4000, RSI vale 2 e EDX contiene 0x12345678. Una routine scrive EDX nell’elemento RSI di un array di dword e conserva l’indirizzo in RAX. Calcola l’indirizzo dell’elemento e il byte depositato al suo primo indirizzo.",
        campi: [
          numero("Indirizzo dell’elemento", 16392, "Ogni dword sposta la posizione di quattro byte."),
          numero("Byte al primo indirizzo", 120, "In little-endian il byte meno significativo si trova all’indirizzo minore.")
        ],
        svolgimento: [
          "La scala 4 produce un offset di 8 byte.",
          "LEA scrive 0x4008 in RAX.",
          "MOV trasferisce quattro byte. Il primo vale 0x78 perché contiene i bit da 0 a 7."
        ],
        codice: righe(
          "lea rax, [rdi+rsi*4]",
          "mov dword ptr [rax], edx"
        )
      },
      {
        consegna: "Il debugger osserva la scrittura di una dword all’indirizzo 0x4014. La base dell’array è 0x4000 e l’istruzione usa scala 4 con spiazzamento nullo. Dopo la scrittura i byte in ordine di indirizzo sono D4 C3 B2 A1. Risali all’indice e alla parola che era in EDX.",
        campi: [
          numero("Indice usato", 5, "Sottrai la base al primo indirizzo scritto e dividi per la dimensione della dword."),
          numero("Parola scritta da EDX", 2712847316, "Il byte all’indirizzo minore è il meno significativo.")
        ],
        svolgimento: [
          "La distanza dalla base è 0x4014 − 0x4000 = 0x14, pari a 20 byte. Ogni elemento occupa quattro byte, quindi l’indice è 20 / 4 = 5.",
          "In little-endian D4 contiene i bit da 0 a 7, C3 quelli da 8 a 15, B2 quelli da 16 a 23 e A1 gli otto più alti.",
          "Scrivendo per primo il byte di peso maggiore, il registro si legge 0xA1B2C3D4. Una scrittura di questa dword all’indice 5 riproduce sia l’indirizzo sia la sequenza osservata."
        ],
        quadro: [
          {titolo: "Scrittura osservata", tipo: "stato", celle: [["Base", "0x4000"], ["Indirizzo", "0x4014"], ["Byte", "D4 C3 B2 A1"]]},
          {titolo: "Dall’offset all’indice", tipo: "sequenza", celle: [["Distanza", "20 byte"], ["Passo", "4 byte"], ["Indice", "5"]]},
          {titolo: "Pesi dei byte", tipo: "stato", celle: [["Basso", "D4"], ["Alto", "A1"]]},
          {titolo: "Valori ricostruiti", tipo: "confronto", celle: [["Indice", "5"], ["EDX", "0xA1B2C3D4"]]}
        ]
      }
    ]);

  prova(3, 3, 2, "Due letture per seguire un puntatore",
    "Un puntatore è un valore che rappresenta un indirizzo di memoria. La tabella contiene puntatori di otto byte: la voce i si trova alla base+8i. LEA calcola quel numero, mentre MOV con una sorgente fra parentesi quadre legge il contenuto della memoria a quell’indirizzo. Per seguire una voce servono quindi due letture: la prima carica il puntatore conservato nella tabella, la seconda usa quel puntatore come base del dato finale. Una dword occupa quattro byte; l’ampiezza della seconda lettura segue tale dimensione.",
    [
      {
        consegna: "RDI=0x3000 punta a una tabella di puntatori a 64 bit. La voce di indice 2 (indici da zero) contiene 0x5000. A otto byte da tale base c’è una dword di valore 37. La routine la carica in EAX attraverso due letture successive. Ricostruisci l’indirizzo della voce nella tabella, quello della dword e il valore finale di EAX.",
        campi: [
          numero("Indirizzo della voce della tabella", 12304, "Una voce della tabella occupa otto byte."),
          numero("Indirizzo dell’ultima lettura", 20488, "Il puntatore va prima letto dalla tabella."),
          numero("EAX dopo il caricamento", 37, "La seconda lettura preleva il contenuto della dword all’indirizzo calcolato.")
        ],
        svolgimento: [
          "La voce cercata ha indirizzo 0x3000 + 8×2 = 0x3010.",
          "La prima MOV carica il puntatore 0x5000 in RCX.",
          "La seconda MOV legge quattro byte a 0x5008 e restituisce 37 in EAX."
        ],
        codice: righe(
          "mov esi, 2",
          "mov rcx, [rdi+rsi*8]",
          "mov eax, dword ptr [rcx+8]"
        )
      },
      {
        consegna: "Una tabella inizia a 0x3000. La sua voce 2, larga otto byte, contiene 0x5000. La dword desiderata si trova otto byte oltre il puntatore contenuto nella voce. Il listato esegue una sola lettura e raggiunge il posto sbagliato. Indica il suo indirizzo di lettura e scegli la prima istruzione con cui correggere il frammento.",
        campi: [
          numero("Indirizzo effettivamente letto", 12312, "LEA calcola l’indirizzo della voce 2 e lo conserva in RCX."),
          scelta("Sostituzione della prima istruzione", "MOV RCX, [RDI+16]", ["LEA RCX, [RDI+8]", "MOV RCX, [RDI+16]", "MOV ECX, EDI"], "Occorre prelevare tutti gli otto byte contenuti nella voce.")
        ],
        svolgimento: [
          "LEA aggiunge 16 alla base 0x3000. RCX riceve quindi l’indirizzo della voce, 0x3010.",
          "Il MOV successivo legge a 0x3010 + 8 = 0x3018. Il valore 0x5000 custodito nella voce è rimasto in memoria.",
          "Con MOV RCX, [RDI+16] la prima lettura recupera 0x5000. Il secondo MOV legge poi la dword a 0x5008, che è la destinazione voluta."
        ],
        listato: righe(
          "lea rcx, [rdi+16]",
          "mov eax, dword ptr [rcx+8]"
        ),
        quadro: [
          {titolo: "Dati della tabella", tipo: "stato", celle: [["Base", "0x3000"], ["Indice", "2"], ["Contenuto", "0x5000"]]},
          {titolo: "Calcolo tramite LEA", tipo: "stato", celle: [["RCX", "0x3010"], ["Letture", "0"]]},
          {titolo: "Accesso del listato", tipo: "stato", celle: [["RCX + 8", "0x3018"]]},
          {titolo: "Dopo la correzione", tipo: "sequenza", celle: [["Prima lettura", "[0x3010]"], ["Seconda lettura", "[0x5008]"]]}
        ]
      }
    ]);

  prova(3, 4, 3, "Scambiare e aggiornare due elementi",
    "Per scambiare due valori occorre conservarli prima di riscrivere le loro celle. I registri temporanei consentono l’aggiornamento successivo anche dopo lo scambio.",
    [
      {
        consegna: "Un array di due dword contiene [2, 7]. Il programma scambia gli elementi, quindi incrementa di uno il nuovo elemento zero. RDI contiene la base. Determina i due valori finali dell’array.",
        campi: [
          numero("Elemento zero finale", 8, "Salva il vecchio elemento uno prima di sovrascriverlo."),
          numero("Elemento uno finale", 2, "Conserva il vecchio elemento zero in un registro temporaneo.")
        ],
        svolgimento: [
          "Le due MOV iniziali salvano 2 in EAX e 7 in ECX.",
          "Scrivi EAX all’offset 4: il secondo elemento ora vale 2.",
          "Incrementa ECX e scrivilo all’offset zero. L’array finale è [8, 2]."
        ],
        codice: righe(
          "mov eax, [rdi]",
          "mov ecx, [rdi+4]",
          "mov [rdi+4], eax",
          "inc ecx",
          "mov [rdi], ecx"
        )
      },
      {
        consegna: "All’ingresso l’array contiene [12, 3]. Il frammento dovrebbe scambiare i due elementi e incrementare il nuovo elemento zero. Prevedi il valore che invece scrive nell’elemento zero e scegli la riga da anticipare subito dopo la prima per ottenere lo scambio richiesto.",
        campi: [
          numero("Elemento zero prodotto dal listato", 13, "Individua il contenuto dell’offset 4 nel momento in cui lo legge ECX."),
          scelta("Istruzione da anticipare", "MOV ECX, [RDI+4]", ["MOV ECX, [RDI+4]", "INC ECX", "MOV [RDI], ECX"], "Il vecchio secondo elemento serve prima che la sua cella venga sovrascritta.")
        ],
        svolgimento: [
          "EAX carica 12 e lo scrive all’offset 4. L’array diventa [12, 12], quindi il vecchio secondo elemento è andato perduto.",
          "La lettura successiva mette 12 in ECX. INC lo porta a 13 e l’ultima scrittura lascia [13, 12].",
          "Anticipando MOV ECX, [RDI+4], ECX conserva 3 mentre EAX conserva 12. Le scritture e l’incremento costruiscono allora [4, 12]."
        ],
        listato: righe(
          "mov eax, [rdi]",
          "mov [rdi+4], eax",
          "mov ecx, [rdi+4]",
          "inc ecx",
          "mov [rdi], ecx"
        ),
        quadro: [
          {titolo: "Array in ingresso", tipo: "confronto", celle: [["Elemento 0", "12"], ["Elemento 1", "3"]]},
          {titolo: "Prima scrittura", tipo: "confronto", celle: [["Elemento 0", "12"], ["Elemento 1", "12"]]},
          {titolo: "Effetto del ritardo", tipo: "stato", celle: [["ECX dopo lettura", "12"], ["Elemento 0", "13"]]},
          {titolo: "Valori salvati in tempo", tipo: "confronto", celle: [["Elemento 0", "4"], ["Elemento 1", "12"]]}
        ]
      }
    ]);

  prova(3, 5, 3, "Primo e ultimo elemento di un array",
    "In un array di n elementi numerati da zero, l’ultimo indice è n − 1. L’estensione con zeri da word a dword conserva il valore numerico di ogni elemento senza segno.",
    [
      {
        consegna: "RDI contiene la base 0x1000 di un array di word senza segno. ESI ne contiene la lunghezza, 5 elementi. Il primo valore è 8 e l’ultimo 13. La routine somma gli estremi in EAX. Calcola l’indirizzo dell’ultima word e la somma restituita.",
        campi: [
          numero("Indirizzo dell’ultima word", 4104, "L’ultimo indice di un array con n elementi è n−1."),
          numero("Somma", 21, "Carica ciascun valore con estensione a zero prima di sommare.")
        ],
        svolgimento: [
          "La scrittura su ESI estende la lunghezza con zeri in RSI. Il passo è due byte e l’ultimo indice è 4.",
          "La lettura finale avviene a 0x1000 + 8 = 0x1008.",
          "I due MOVZX danno 8 e 13. ADD produce 21 in EAX."
        ],
        codice: righe(
          "mov esi, esi",
          "movzx eax, word ptr [rdi]",
          "movzx ecx, word ptr [rdi+rsi*2-2]",
          "add eax, ecx"
        )
      },
      {
        consegna: "Una funzione deve sommare prima e ultima word di un array senza segno. Il contratto richiede zero per l’array vuoto e, per qualunque lunghezza positiva, la somma dei due estremi anche se coincidono. Per n=1 la sola word vale 13. Indica il ritorno. Scegli poi il comportamento richiesto prima del primo caricamento quando n=0.",
        campi: [
          numero("EAX con una sola word", 26, "Scrivi entrambi gli indici per n=1 e applica il contratto alla lettera."),
          scelta("Trattamento dell’array vuoto", "Restituire zero prima delle letture", ["Caricare la word di indice zero", "Restituire zero prima delle letture", "Caricare la word di indice −1"], "Un array vuoto occupa zero posizioni leggibili.")
        ],
        svolgimento: [
          "Per n=1 il primo indice è 0 e l’ultimo indice n−1 vale anch’esso 0. Entrambi i termini designano dunque la word 13.",
          "Il contratto include i due estremi anche quando coincidono. EAX riceve 13 + 13 = 26.",
          "Per n=0 manca il primo elemento e l’indice n−1 cadrebbe prima dell’array. Il test sulla lunghezza deve deviare direttamente al ritorno zero prima di qualunque MOVZX da memoria."
        ],
        quadro: [
          {titolo: "Due lunghezze", tipo: "confronto", celle: [["Caso A", "n = 1, dato 13"], ["Caso B", "n = 0"]]},
          {titolo: "Estremi con n uguale a uno", tipo: "stato", celle: [["Indice iniziale", "0"], ["Indice finale", "0"]]},
          {titolo: "Somma richiesta", tipo: "sequenza", celle: [["Primo", "13"], ["Ultimo", "13"], ["Risultato", "26"]]},
          {titolo: "Caso vuoto", tipo: "stato", celle: [["Letture", "0"], ["EAX", "0"]]}
        ]
      }
    ]);

  prova(4, 1, 1, "Selezionare un bit del byte basso",
    "La posizione zero è il bit meno significativo. Dopo aver isolato il byte basso, uno scorrimento porta il bit richiesto nella posizione zero e una maschera ne separa il valore.",
    [
      {
        consegna: "EAX contiene 0x12AC. Isola prima il byte basso, poi il bit 3 e normalizzalo a zero o uno.",
        campi: [
          numero("Byte basso", 172, "La maschera del byte basso è 0xFF."),
          numero("Bit normalizzato", 1, "Dopo lo scorrimento conserva solo la posizione zero.")
        ],
        svolgimento: [
          "AND EAX,0xFF dà 0xAC.",
          "SHR di 3 posizioni porta il bit richiesto nella posizione zero e produce 0x15.",
          "AND con uno estrae 1."
        ],
        codice: righe(
          "and eax, 0xff",
          "shr eax, 3",
          "and eax, 1"
        )
      },
      {
        consegna: "Una funzione deve restituire in EAX il bit 6 di un byte come valore 0 oppure 1. Il listato attuale riceve EAX=0xC0 e si ferma dopo AND. Quale valore restituisce? Quale singola istruzione, aggiunta subito dopo AND, realizza il contratto per ogni byte?",
        campi: [
          numero("EAX dopo AND", 64, "La maschera conserva il bit nella sua posizione originale."),
          scelta("Istruzione da aggiungere", "SHR EAX, 6", ["SHR EAX, 6", "AND EAX, 1", "SHL EAX, 6"], "Il valore 0x40 deve diventare 1, mentre zero deve rimanere zero.")
        ],
        svolgimento: [
          "La maschera 0x40 contiene un solo bit a uno, alla posizione 6. Poiché 0xC0 contiene anche quel bit, AND restituisce 0x40, ossia 64.",
          "Per qualunque ingresso la maschera può lasciare soltanto 0 o 64. SHR EAX, 6 porta la posizione selezionata fino al peso uno.",
          "Con 0xC0 si ottiene 64 >> 6 = 1. Con un byte privo del bit 6 la sequenza produce 0 >> 6 = 0, come richiesto."
        ],
        listato: righe(
          "and eax, 0x40"
        ),
        quadro: [
          {titolo: "Contratto", tipo: "stato", celle: [["Ingresso", "0xC0"], ["Bit richiesto", "6"]]},
          {titolo: "Isolamento", tipo: "stato", celle: [["Maschera", "0x40"], ["Risultato", "64"]]},
          {titolo: "Normalizzazione", tipo: "sequenza", celle: [["Bit 6", "peso 64"], ["Bit 0", "peso 1"]]},
          {titolo: "Tutti i casi", tipo: "confronto", celle: [["Bit assente", "0"], ["Bit presente", "1"]]}
        ]
      }
    ]);

  prova(4, 2, 3, "Costruire un byte e commutare un bit",
    "Un semibyte contiene quattro bit e un byte ne contiene otto. Per comporre un byte si porta il semibyte destinato alla parte alta quattro posizioni a sinistra e lo si unisce con OR al semibyte basso: OR produce uno nelle posizioni in cui almeno uno degli ingressi vale uno. XOR produce invece uno quando i due bit confrontati differiscono. Applicare XOR con 2^k cambia perciò il solo bit k, numerato da zero a destra. Confrontando con XOR il byte precedente e quello successivo, si individuano esattamente le posizioni cambiate.",
    [
      {
        consegna: "AL=0xBA, BL=0x25. Costruisci un byte con il semibyte basso di AL in alto e quello di BL in basso. Poi commuta il bit 3.",
        campi: [
          numero("Byte composto", 165, "Porta il primo semibyte a sinistra di quattro posizioni."),
          numero("Byte dopo XOR", 173, "XOR con una potenza di due cambia una sola posizione.")
        ],
        svolgimento: [
          "I semibyte sono 0xA e 0x5.",
          "Dopo SHL e OR il risultato è 0xA5.",
          "La maschera del bit 3 vale 0x8; XOR produce 0xAD."
        ],
        codice: righe(
          "and al, 0x0f",
          "shl al, 4",
          "and bl, 0x0f",
          "or al, bl",
          "xor al, 0x8"
        )
      },
      {
        consegna: "Un byte è stato costruito usando il semibyte basso di AL come parte alta e quello di BL come parte bassa. Subito prima di XOR valeva 0x72 e subito dopo vale 0x32. Sai che il programma ha commutato un unico bit. Ricava il semibyte originario di BL e l’indice del bit commutato.",
        campi: [
          numero("Semibyte basso di BL", 2, "La composizione colloca i quattro bit bassi di BL nella cifra esadecimale di destra."),
          numero("Indice del bit commutato", 6, "La XOR fra i byte osservati indica le sole posizioni differenti. Numerale da destra con zero.")
        ],
        svolgimento: [
          "In 0x72 la cifra meno significativa è 2. La composizione aveva quindi copiato 2 dai quattro bit bassi di BL.",
          "Si confrontano 01110010 e 00110010 con XOR. La differenza è 01000000, cioè 0x40.",
          "0x40 è 2⁶, perciò il cambiamento riguarda il bit 6. Applicando nuovamente la stessa XOR a 0x32 si recupera 0x72."
        ],
        quadro: [
          {titolo: "Due letture", tipo: "confronto", celle: [["Prima", "0x72"], ["Dopo", "0x32"]]},
          {titolo: "Byte ricomposto", tipo: "stato", celle: [["Parte alta", "7"], ["Parte bassa", "2"]]},
          {titolo: "Posizioni differenti", tipo: "stato", celle: [["XOR", "01000000"]]},
          {titolo: "Prova inversa", tipo: "sequenza", celle: [["Maschera", "0x40"], ["Indice", "6"], ["Ripristino", "0x72"]]}
        ]
      }
    ]);

  prova(4, 3, 1, "Combinare inversioni e scorrimenti",
    "XOR inverte i bit selezionati dalla maschera e NOT inverte tutti i bit del byte. SHR tratta il byte risultante come una configurazione senza segno e introduce zeri a sinistra.",
    [
      {
        consegna: "AL=0x95. Applica XOR con 0xC0, inverti tutti gli otto bit e scorri logicamente di due posizioni a destra.",
        campi: [
          numero("AL dopo XOR", 85, "XOR produce uno nelle posizioni in cui gli operandi differiscono."),
          numero("AL finale", 42, "Dopo NOT, dividi il byte senza segno per quattro arrotondando per difetto.")
        ],
        svolgimento: [
          "XOR delle due configurazioni produce 0x55.",
          "NOT AL inverte il byte: 255 − 85 = 170.",
          "SHR AL,2 inserisce due zeri e lascia 0x2A in AL."
        ],
        codice: righe(
          "xor al, 0xC0",
          "not al",
          "shr al, 2"
        )
      },
      {
        consegna: "Un listato esegue XOR AL,0x71 e poi NOT AL. Vuoi sostituire le prime due istruzioni con un’unica XOR mantenendo identico il valore prima di SHR AL,2 per ciascun ingresso. Indica la nuova maschera e verifica il byte finale per AL=0x53.",
        campi: [
          numero("Maschera equivalente su otto bit", 142, "NOT inverte tutte le posizioni, cioè equivale a XOR con 0xFF."),
          numero("AL finale dopo SHR", 55, "Applica la maschera unica al byte 0x53 e sposta a destra di due posti.")
        ],
        svolgimento: [
          "NOT su otto bit equivale a XOR con 0xFF. Due XOR consecutive combinano le proprie maschere mediante XOR.",
          "La nuova maschera è 0x71 XOR 0xFF = 0x8E. La stessa identità vale bit per bit per qualunque byte iniziale.",
          "Per 0x53 si trova 0x53 XOR 0x8E = 0xDD. SHR logico di due posti porta 11011101 a 00110111, cioè 0x37."
        ],
        quadro: [
          {titolo: "Trasformazioni", tipo: "sequenza", celle: [["Prima", "XOR 0x71"], ["Seconda", "NOT"], ["Ultima", "SHR 2"]]},
          {titolo: "Rilettura di NOT", tipo: "stato", celle: [["Byte", "8 bit"], ["Maschera", "0xFF"]]},
          {titolo: "Fusione delle XOR", tipo: "stato", celle: [["0x71 XOR 0xFF", "0x8E"]]},
          {titolo: "Controllo", tipo: "sequenza", celle: [["AL iniziale", "0x53"], ["Dopo XOR", "0xDD"], ["Dopo SHR", "0x37"]]}
        ]
      }
    ]);

  prova(4, 4, 4, "Sostituire un campo e verificarlo",
    "Una maschera con w bit a uno, spostata fino all’inizio del campo, delimita le posizioni da riscrivere. La successiva estrazione riporta quel campo in posizione zero per controllarne il contenuto.",
    [
      {
        consegna: "AL=0xB6. Sostituisci i 3 bit a partire dalla posizione 2 con il valore 3 e controlla il campo con una seconda estrazione.",
        campi: [
          numero("Maschera del campo", 28, "Parti da 2^larghezza−1 e scorri a sinistra."),
          numero("Byte modificato", 174, "Pulisci il campo prima di inserire i nuovi bit."),
          numero("Campo riletto in DL", 3, "Sposta il primo bit del campo in posizione zero e applica la maschera elementare.")
        ],
        svolgimento: [
          "La maschera è 0x7 << 2 = 0x1C.",
          "La maschera complementare su otto bit lascia 0xA2 nella destinazione.",
          "OR con 0x0C produce 0xAE. Estraendo i bit si ritrova 3."
        ],
        codice: righe(
          "and al, 0xE3",
          "or al, 0xC",
          "mov dl, al",
          "shr dl, 2",
          "and dl, 0x7"
        )
      },
      {
        consegna: "Nel byte iniziale 0xB6 si vuole riscrivere soltanto il campo delle posizioni 2 e 3 con il valore 1. Il programma produce 0xA6. La rilettura del campo dà il valore richiesto. Per verificare anche i vicini indica il byte corretto e l’indice dell’unico bit esterno che distingue il risultato errato da quello corretto.",
        campi: [
          numero("Byte corretto", 182, "Il campo 3:2 di 0xB6 contiene già il valore 01."),
          numero("Bit esterno alterato", 4, "Applica XOR ai due byte e trova la posizione dell’unico uno.")
        ],
        svolgimento: [
          "0xB6 è 10110110. Il campo dei bit 3 e 2 è già 01, perciò una riscrittura corretta conserva 0xB6.",
          "La rilettura del solo campo restituisce 1 anche nel byte errato 0xA6. Per confrontare tutto il byte si calcola 0xB6 XOR 0xA6 = 0x10.",
          "La differenza 0x10 corrisponde al bit 4, che è esterno al campo. Alla verifica del contenuto va quindi affiancato il controllo delle posizioni da conservare."
        ],
        quadro: [
          {titolo: "Dati osservati", tipo: "stato", celle: [["Prima", "0xB6"], ["Dopo", "0xA6"], ["Campo atteso", "1"]]},
          {titolo: "Campo iniziale", tipo: "stato", celle: [["Bit 3 e 2", "01"], ["Byte corretto", "0xB6"]]},
          {titolo: "Confronto dei byte", tipo: "stato", celle: [["0xB6 XOR 0xA6", "0x10"]]},
          {titolo: "Localizzazione", tipo: "confronto", celle: [["Campo", "bit 2 e 3"], ["Danno", "bit 4"]]}
        ]
      }
    ]);

  prova(4, 5, 4, "Allineare un puntatore alla potenza di due",
    "Un indirizzo è allineato ad A byte quando è multiplo di A. Se A=2^k, questa condizione equivale ad avere a zero i k bit bassi. Per arrotondare verso l’alto si può aggiungere A−1 e poi azzerare quei bit con AND; per A=16 la maschera a 64 bit è −16 in complemento a due, ossia tutti uno tranne i quattro bit bassi. Un registro senza segno di 64 bit rappresenta da 0 a 2^64−1 e conserva soltanto i 64 bit bassi del calcolo. L’aggiunta deve quindi restare entro quel massimo affinché il risultato rappresenti davvero un indirizzo maggiore o uguale all’ingresso.",
    [
      {
        consegna: "RAX contiene 0x1031. Arrotonda verso l’alto al primo multiplo di 16 usando ADD e AND. Gli indirizzi considerati consentono la somma senza overflow.",
        campi: [
          numero("Termine da aggiungere", 15, "Per l’allineamento a una potenza di due usa allineamento−1."),
          numero("Indirizzo allineato", 4160, "Dopo la somma azzera i bit bassi corrispondenti alla maschera.")
        ],
        svolgimento: [
          "La quantità da aggiungere è 16 − 1 = 15.",
          "ADD genera 0x1040. AND con −16 azzera i 4 bit bassi.",
          "La destinazione è 0x1040. TEST RAX,15 produce zero e quindi ZF=1, a conferma dell’allineamento."
        ],
        codice: righe(
          "add rax, 15",
          "and rax, -16",
          "test rax, 15"
        )
      },
      {
        consegna: "Si cerca il primo multiplo di 16 maggiore o uguale a un indirizzo senza segno a 64 bit. Il programmatore usa ADD RAX,15 seguito da AND RAX,−16 anche per RAX=0xFFFFFFFFFFFFFFF8. Indica il valore che la sequenza lascia nel registro e scegli la decisione coerente con la richiesta di un indirizzo ancora rappresentabile.",
        campi: [
          numero("RAX dopo entrambe le istruzioni", 0, "L’addizione conserva soltanto i 64 bit bassi. Applica poi la maschera a quel risultato."),
          scelta("Decisione corretta", "Segnalare uno sconfinamento", ["Restituire l’indirizzo zero", "Segnalare uno sconfinamento", "Restituire l’indirizzo iniziale"], "Confronta il primo multiplo matematico con 2⁶⁴ − 1.")
        ],
        svolgimento: [
          "L’ingresso è 2⁶⁴ − 8. L’aggiunta di 15 produce 2⁶⁴ + 7, del quale RAX può conservare soltanto il residuo 7.",
          "AND con −16 azzera i quattro bit bassi. Applicato a 7 produce zero, sebbene zero sia inferiore all’indirizzo iniziale.",
          "Il primo multiplo richiesto sarebbe 2⁶⁴, fuori dall’intervallo del registro. Per questa formula si può controllare prima di ADD che l’ingresso sia al più 2⁶⁴ − 16."
        ],
        quadro: [
          {titolo: "Indirizzo al limite", tipo: "stato", celle: [["RAX", "2⁶⁴ − 8"], ["Allineamento", "16"]]},
          {titolo: "Somma a 64 bit", tipo: "confronto", celle: [["Senza limite", "2⁶⁴ + 7"], ["Nel registro", "7"]]},
          {titolo: "Azzeramento", tipo: "stato", celle: [["7 AND −16", "0"]]},
          {titolo: "Esito del contratto", tipo: "confronto", celle: [["Multiplo cercato", "2⁶⁴"], ["Esito", "overflow"]]}
        ]
      }
    ]);

  prova(5, 1, 1, "Scrivere il messaggio e terminare",
    "Su Linux x86-64 write riceve il conteggio in RDX e restituisce in RAX il numero di byte trasferiti o un errore. Per terminare un processo a thread singolo con exit si carica il numero di servizio 60 in RAX e il codice di uscita in RDI.",
    [
      {
        consegna: "Il simbolo msg identifica i byte ASCII di «ciao» senza carattere di fine riga. Il programma li scrive su fd 1 con un’unica write completa e termina il processo a thread singolo con codice 7. Indica il conteggio da collocare in RDX prima di write e il numero della syscall da collocare in RAX prima dell’uscita.",
        campi: [
          numero("RDX prima di write", 4, "Conta i byte effettivi del messaggio, esclusi terminatori."),
          numero("RAX prima della syscall di uscita", 60, "Distingui il numero del servizio dal codice dato in RDI.")
        ],
        svolgimento: [
          "write usa RAX=1, RDI=1, RSI=indirizzo di msg e RDX=4.",
          "Al ritorno RAX vale 4 per l’ipotesi di trasferimento completo.",
          "Carica 60 in EAX e 7 in EDI. La seconda syscall termina il processo."
        ],
        codice: righe(
          "mov eax, 1",
          "mov edi, 1",
          "lea rsi, [rip+msg]",
          "mov edx, 4",
          "syscall",
          "mov eax, 60",
          "mov edi, 7",
          "syscall"
        )
      },
      {
        consegna: "Il programma Linux x86-64 scrive completamente cinque byte su fd 1 e poi termina. La coda del listato è mostrata sotto. Si richiede il codice di uscita 12 per ogni lunghezza del messaggio. Indica il codice attuale e scegli l’istruzione che deve sostituire MOV EDI,EAX.",
        campi: [
          numero("Codice di uscita attuale", 5, "Al ritorno dalla prima syscall EAX contiene il conteggio trasferito."),
          scelta("Istruzione corretta", "MOV EDI, 12", ["MOV EAX, 12", "MOV EDX, 12", "MOV EDI, 12"], "Il primo argomento della syscall exit è in RDI, il numero del servizio è in RAX.")
        ],
        svolgimento: [
          "La prima SYSCALL esegue write e lascia in RAX il suo risultato, che in questa esecuzione è 5.",
          "MOV EDI,EAX copia quel conteggio nell’argomento della chiamata successiva. MOV EAX,60 sceglie exit e il processo termina quindi con codice 5.",
          "MOV EDI,12 prepara il codice richiesto indipendentemente dalla write. MOV EAX,60 continua a selezionare il servizio di uscita."
        ],
        listato: righe(
          "syscall",
          "mov edi, eax",
          "mov eax, 60",
          "syscall"
        ),
        quadro: [
          {titolo: "Servizi in successione", tipo: "sequenza", celle: [["write", "5 byte"], ["exit attesa", "12"]]},
          {titolo: "Uscita da write", tipo: "stato", celle: [["RAX", "5"]]},
          {titolo: "Copia di EAX", tipo: "stato", celle: [["RDI per exit", "5"], ["RAX per exit", "60"]]},
          {titolo: "Rettifica", tipo: "confronto", celle: [["EDI", "12"], ["EAX", "60"]]}
        ]
      }
    ]);

  prova(5, 2, 3, "Scrivere il suffisso appena letto",
    "Soltanto il prefisso restituito da read contiene dati della lettura. Per individuare un suffisso di quel prefisso servono il conteggio effettivo e il suo offset iniziale.",
    [
      {
        consegna: "Il simbolo buf indica un buffer scrivibile di 8 byte. read restituisce 6, tutti validi. Il programma emette su output il suffisso che comincia all’offset 2. Assumi write completa. Indica l’offset iniziale del suffisso e il conteggio che write deve ricevere in RDX.",
        campi: [
          numero("Offset iniziale del suffisso", 2, "Il primo byte della lettura ha indice zero."),
          numero("RDX per write", 4, "Usa il ritorno di read e sottrai il prefisso saltato.")
        ],
        svolgimento: [
          "read riceve fd 0, l’indirizzo di buf e la capacità 8. RAX al ritorno vale 6.",
          "Controlla che la lunghezza superi 2. Si parte da buf+2 e rimangono 6 − 2 = 4 byte.",
          "write riceve fd 1, il puntatore avanzato e il conteggio residuo. Il ramo fine copre anche EOF o errore di read."
        ],
        codice: righe(
          "xor eax, eax",
          "xor edi, edi",
          "lea rsi, [rip+buf]",
          "mov edx, 8",
          "syscall",
          "cmp rax, 2",
          "jle fine",
          "lea rdx, [rax-2]",
          "add rsi, 2",
          "mov eax, 1",
          "mov edi, 1",
          "syscall",
          "fine:"
        )
      },
      {
        consegna: "Un buffer di dieci byte è stato inizializzato con il testo ASCII abcdefghij. La read successiva vi deposita WXYZ e restituisce 4. Per inviare il suffisso a partire dall’offset 1, il codice usa il puntatore corretto buf+1 e passa a write un conteggio pari a capacità − 1. Assumi una write completa. Indica quanti byte del vecchio contenuto vengono emessi e il conteggio corretto.",
        campi: [
          numero("Byte vecchi emessi", 6, "Il codice invia nove byte a partire dall’offset 1. Individua quali sono stati realmente riscritti."),
          numero("Conteggio corretto per write", 3, "Sottrai l’offset iniziale al numero di byte ricevuti da read.")
        ],
        svolgimento: [
          "Dopo read il buffer contiene WXYZefghij. I dati nuovi occupano gli offset 0, 1, 2 e 3.",
          "Con RSI=buf+1 e RDX=9 si emette XYZefghij. Gli ultimi sei caratteri provengono dalla precedente inizializzazione.",
          "Per trasmettere solo XYZ occorre RDX=4−1=3. Il calcolo parte dal valore restituito da read, perché la capacità di dieci byte descrive anche la parte rimasta intatta."
        ],
        quadro: [
          {titolo: "Prima e dopo read", tipo: "confronto", celle: [["Prima", "abcdefghij"], ["Nuovi byte", "WXYZ"]]},
          {titolo: "Contenuto risultante", tipo: "stato", celle: [["Letto", "WXYZ"], ["Preesistente", "efghij"]]},
          {titolo: "write con conteggio 9", tipo: "stato", celle: [["Dati validi", "XYZ"], ["Dati vecchi", "efghij"]]},
          {titolo: "write corretta", tipo: "stato", celle: [["Puntatore", "buf + 1"], ["Lunghezza", "3"]]}
        ]
      }
    ]);

  prova(5, 3, 3, "Usare un buffer sullo stack",
    "La pila, o stack, è una regione di memoria la cui cima è indicata dal registro RSP. Sottraendo una capacità da RSP si riserva un intervallo verso indirizzi minori; aggiungendo la stessa capacità lo si libera. Il buffer comincia alla nuova cima. Se read vi deposita n byte, i dati della lettura occupano gli indici da 0 a n−1, anche quando la riserva è più grande. Per usare il byte di indice i occorre dunque i<n oltre al rispetto della capacità. L’indirizzo selezionato è la base del buffer+i.",
    [
      {
        consegna: "RSP iniziale vale 0x9000. Il programma riserva 16 byte sulla pila, usa read per caricarvi 10 byte e scrive da solo su fd 1 il byte di indice 6. Si assume read riuscita con il conteggio indicato. Calcola l’indirizzo del byte selezionato e il valore di RSP dopo il rilascio dei sedici byte.",
        campi: [
          numero("Indirizzo del byte selezionato", 36854, "Sottrai la riserva alla vecchia cima e aggiungi l’indice."),
          numero("RSP dopo il rilascio", 36864, "Rilascia esattamente tanti byte quanti ne hai riservati.")
        ],
        svolgimento: [
          "SUB porta RSP a 0x8FF0. I 10 byte iniziano a questo indirizzo.",
          "Il confronto garantisce che l’indice sia strettamente inferiore al conteggio restituito. L’indirizzo scelto è 0x8FF6.",
          "Per scrivere un solo byte RDX vale 1. Il rilascio di 16 byte ripristina RSP=0x9000."
        ],
        codice: righe(
          "sub rsp, 16",
          "xor eax, eax",
          "xor edi, edi",
          "mov rsi, rsp",
          "mov edx, 10",
          "syscall",
          "cmp rax, 6",
          "jle fine",
          "lea rsi, [rsp+6]",
          "mov eax, 1",
          "mov edi, 1",
          "mov edx, 1",
          "syscall",
          "fine:",
          "add rsp, 16"
        )
      },
      {
        consegna: "Una funzione riserva sedici byte sulla pila per il buffer. Dopo che read vi ha depositato cinque byte, la funzione deve emettere il byte all’indice 5. Il controllo attuale salta la write solo quando il conteggio letto è minore dell’indice. Qual è l’ultimo indice valido? Scegli la condizione che impedisce anche questo accesso e consente comunque il rilascio del buffer.",
        campi: [
          numero("Ultimo indice valido", 4, "Gli indici iniziano da zero e i byte validi sono cinque."),
          scelta("Confronto prima della write", "Saltare al rilascio se conteggio ≤ indice", ["Saltare al rilascio se conteggio < indice", "Saltare al rilascio se conteggio ≤ indice", "Saltare al rilascio se conteggio > indice"], "Per poter leggere un indice i devono essere arrivati almeno i + 1 byte.")
        ],
        svolgimento: [
          "I byte consegnati da read hanno indici da 0 a 4. Il byte 5 ricade nello spazio di sedici byte riservato, oltre la parte riempita da questa lettura.",
          "Con conteggio 5 e indice 5, la condizione 5 < 5 è falsa. Il codice accederebbe quindi a un byte privo di validità per questa richiesta.",
          "Il confronto corretto salta quando il conteggio è minore o uguale all’indice. Si raggiunge così il rilascio dei sedici byte anche quando read ha restituito esattamente 5."
        ],
        quadro: [
          {titolo: "Tre grandezze distinte", tipo: "stato", celle: [["Capacità", "16"], ["Letti", "5"], ["Indice richiesto", "5"]]},
          {titolo: "Intervallo valido", tipo: "stato", celle: [["Primo", "0"], ["Ultimo", "4"]]},
          {titolo: "Controllo difettoso", tipo: "stato", celle: [["5 < 5", "falso"], ["write", "raggiunta"]]},
          {titolo: "Controllo corretto", tipo: "stato", celle: [["5 ≤ 5", "vero"], ["Destinazione", "rilascio"]]}
        ]
      }
    ]);

  prova(5, 4, 3, "Interpretare zero al ritorno di read",
    "In una lettura da file ordinario occorre distinguere il conteggio richiesto da quello restituito. L’offset della descrizione aperta avanza del numero di byte effettivamente trasferiti.",
    [
      {
        consegna: "Un file ordinario è aperto in lettura, senza errori, con offset alla fine del file. Il buffer è valido. Una read di 0 byte restituisce zero. Interpreta il risultato a partire dal solo conteggio richiesto, indipendentemente dalla posizione nel file.",
        campi: [
          scelta("Significato basato sul conteggio", "richiesta di zero byte", ["richiesta di zero byte", "fine del file", "errore EBADF"], "Per concludere che una lettura è arrivata a fine file occorre una richiesta positiva."),
          numero("Incremento dell’offset", 0, "L’offset avanza del numero di byte trasferiti.")
        ],
        svolgimento: [
          "Il descrittore punta a un file ordinario e la richiesta usa RDX=0.",
          "Il conteggio zero dà zero byte anche in presenza di dati disponibili.",
          "Il trasferimento è nullo: RAX=0 e l’offset rimane alla posizione iniziale."
        ],
        codice: righe(
          "xor eax, eax",
          "mov edi, 3",
          "lea rsi, [rip+buf]",
          "mov edx, 0",
          "syscall"
        )
      },
      {
        consegna: "Un file ordinario è aperto in lettura, senza errori, con offset alla fine del file. Il buffer è valido. Una read di 8 byte restituisce zero. Interpreta il risultato per questa richiesta positiva.",
        campi: [
          scelta("Significato basato sul conteggio", "fine del file", ["richiesta di zero byte", "fine del file", "errore EBADF"], "Per concludere che una lettura è arrivata a fine file occorre una richiesta positiva."),
          numero("Incremento dell’offset", 0, "L’offset avanza del numero di byte trasferiti.")
        ],
        svolgimento: [
          "Il descrittore punta a un file ordinario e la richiesta usa RDX=8.",
          "La richiesta è positiva. Alla fine del file mancano dati ulteriori da restituire.",
          "Il trasferimento è nullo: RAX=0 e l’offset rimane alla posizione iniziale."
        ],
        codice: righe(
          "xor eax, eax",
          "mov edi, 3",
          "lea rsi, [rip+buf]",
          "mov edx, 8",
          "syscall"
        )
      }
    ]);

  prova(5, 5, 3, "Recuperare dopo una write breve",
    "Una write breve lascia da emettere un suffisso contiguo del buffer. Il conteggio restituito è la misura del prefisso da scavalcare nella chiamata successiva.",
    [
      {
        consegna: "Una read ha consegnato 9 byte nel buffer puntato da RSI, pari a 0x6000 nella traccia. La prima write ne accetta 4 e la seconda tutto il residuo. Calcola puntatore e conteggio per la seconda write.",
        campi: [
          numero("RSI per la seconda write", 24580, "Avanza soltanto dei byte che la prima write ha trasferito."),
          numero("RDX residuo", 5, "Sottrai il ritorno positivo dal numero di byte ancora da emettere.")
        ],
        svolgimento: [
          "Per la prima write RSI=0x6000 e RDX=9. RAX ritorna con 4.",
          "Il prefisso scritto occupa gli indirizzi da 0x6000 a 0x6003. Il puntatore successivo è 0x6004.",
          "Il residuo è 9 − 4 = 5. La seconda write completa il totale di 9 byte. Il frammento gestisce una sequenza di ritorni positivi."
        ],
        codice: righe(
          "mov edx, 9",
          "mov edi, 1",
          "ancora:",
          "mov eax, 1",
          "syscall",
          "test rax, rax",
          "jle fine",
          "add rsi, rax",
          "sub rdx, rax",
          "jnz ancora",
          "fine:"
        )
      },
      {
        consegna: "Il buffer contiene ABCDEFGH. Una write di otto byte ne accetta tre. Il programma riduce correttamente RDX a cinque, lascia però RSI sulla A e la seconda write accetta tutti i byte richiesti. Scegli la sequenza effettivamente emessa e indica l’offset che avrebbe dovuto ricevere RSI nella seconda chiamata.",
        campi: [
          scelta("Sequenza emessa", "ABCABCDE", ["ABCDEFGH", "ABCABCDE", "ABCDEF"], "Scrivi in ordine il prefisso accettato dalla prima chiamata e i cinque byte visti dal secondo puntatore."),
          numero("Offset corretto dalla base", 3, "Individua il primo byte ancora da trasmettere nel messaggio originale.")
        ],
        svolgimento: [
          "La prima write emette ABC. Il suo valore di ritorno 3 indica che il primo byte ancora da trasferire è D, all’offset 3.",
          "La seconda write parte tuttavia dall’indirizzo della A e trasferisce cinque byte, ossia ABCDE. Il destinatario riceve ABC seguito da ABCDE.",
          "Il conteggio complessivo è otto anche nel caso difettoso. Per ottenere ABCDEFGH occorrono sia RDX=5 sia RSI=base+3."
        ],
        quadro: [
          {titolo: "Messaggio", tipo: "stato", celle: [["Buffer", "ABCDEFGH"], ["Prima write", "3 byte"]]},
          {titolo: "Prefisso consegnato", tipo: "stato", celle: [["Uscita", "ABC"], ["Primo residuo", "D"]]},
          {titolo: "Ripetizione erronea", tipo: "stato", celle: [["RSI", "base"], ["Secondo tratto", "ABCDE"]]},
          {titolo: "Confronto finale", tipo: "confronto", celle: [["Prima + seconda", "ABCABCDE"], ["Offset corretto", "3"]]}
        ]
      }
    ]);

  prova(6, 1, 4, "Dalla traduzione al collegamento",
    "Il sorgente C è il testo del programma. Il preprocessore espande le macro, nomi sostituiti da altro testo; la compilazione traduce il codice e l’assemblaggio produce un file oggetto. L’opzione gcc -c si ferma al file oggetto rilocabile, nel quale alcuni indirizzi possono ancora essere risolti durante il collegamento. Una dichiarazione descrive come chiamare una funzione; la definizione ne fornisce il corpo eseguibile. Il collegatore, o linker, riunisce gli oggetti e associa i nomi delle funzioni alle loro definizioni. Una chiamata a una funzione esterna richiede quindi che un oggetto o una libreria forniti al collegatore ne contengano la definizione.",
    [
      {
        consegna: "Il file f.c definisce K come 3 e la funzione int f(int x) { return K * x; }. Indica il tipo di file prodotto da gcc -c f.c e valuta f(5).",
        campi: [
          scelta("Prodotto di gcc -c", "File oggetto rilocabile", ["Testo preprocessato", "File oggetto rilocabile", "Eseguibile collegato"], "L’opzione ferma il processo prima del collegamento."),
          numero("Valore della funzione", 15, "Sostituisci la macro con il valore intero prima della moltiplicazione.")
        ],
        svolgimento: [
          "Il preprocessore sostituisce K con 3 nel corpo della funzione.",
          "La traduzione e l’assemblaggio producono f.o, un file oggetto rilocabile. Il linker può collegarlo a un chiamante.",
          "La chiamata calcola 3 × 5 = 15; il risultato intero torna in EAX."
        ],
        codice: righe(
          "#define K 3",
          "int f(int x) { return K * x; }",
          "/* Compilazione: gcc -c f.c -o f.o */"
        )
      },
      {
        consegna: "Il sorgente f.c dichiara int triplo(int) e ne chiama la funzione senza definirla. main.c contiene un main valido che chiama f. Entrambi i sorgenti compilano con gcc -c. Il comando gcc main.o f.o segnala un riferimento indefinito a triplo. Indica la fase che segnala l’errore e la modifica sufficiente, sapendo che una definizione compatibile è contenuta in triplo.o.",
        campi: [
          scelta("Fase che segnala il problema", "Collegamento", ["Preprocessamento", "Assemblaggio", "Collegamento"], "I due file oggetto sono già stati prodotti."),
          scelta("Comando che risolve il riferimento", "gcc main.o f.o triplo.o", ["gcc -E f.c", "gcc main.o f.o triplo.o", "gcc -c main.c"], "Occorre fornire al collegatore l’oggetto che esporta la definizione.")
        ],
        svolgimento: [
          "La dichiarazione rende noto al compilatore come chiamare triplo. La produzione di f.o può quindi riuscire lasciando un riferimento a un simbolo esterno.",
          "Durante il collegamento, main.o e f.o soddisfano il riferimento a f, mentre nessuno dei due fornisce il corpo di triplo. Da qui il messaggio del collegatore.",
          "Aggiungendo triplo.o al comando di collegamento si fornisce la definizione compatibile. Preprocessare f.c o ricompilare main.c lascerebbe invariato l’insieme delle definizioni disponibili."
        ],
        quadro: [
          {titolo: "File disponibili", tipo: "stato", celle: [["main.o", "chiama f"], ["f.o", "chiama triplo"], ["triplo.o", "definisce triplo"]]},
          {titolo: "Compilazione", tipo: "stato", celle: [["f.c", "dichiarazione"], ["f.o", "riferimento"]]},
          {titolo: "Primo collegamento", tipo: "stato", celle: [["f", "risolto"], ["triplo", "irrisolto"]]},
          {titolo: "Nuovo collegamento", tipo: "stato", celle: [["Oggetto aggiunto", "triplo.o"], ["triplo", "risolto"]]}
        ]
      }
    ]);

  prova(6, 2, 6, "Seguire una funzione nel debugger",
    "Un passo macchina esegue l’istruzione indicata da RIP. Se il flusso procede in sequenza, il nuovo RIP coincide con l’indirizzo della riga seguente del disassemblato. Per ricostruire i registri dati occorre invece eseguire l’operazione indicata.",
    [
      {
        consegna: "Il simbolo f è all’indirizzo 0x401080. All’ingresso EDI=4. Il disassemblato riporta LEA EAX,[RDI+5] (3 byte), poi RET. Prevedi i valori di RIP ed EAX dopo l’esecuzione della sola LEA, prima di RET.",
        campi: [
          numero("RIP dopo LEA", 4198531, "L’indirizzo della prossima istruzione si ottiene dalla lunghezza indicata."),
          numero("EAX dopo LEA", 9, "LEA forma la somma senza leggere memoria.")
        ],
        svolgimento: [
          "Un breakpoint su f arresta il programma prima di LEA a 0x401080.",
          "L’istruzione utilizza EDI=4 e lo spiazzamento 5; EAX diventa 9.",
          "Dopo una singola istruzione RIP punta a RET, all’indirizzo 0x401083. In GDB si può verificare con info registers eax rip."
        ],
        codice: righe(
          "0x401080  lea eax, [rdi+5]",
          "0x401083  ret"
        )
      },
      {
        consegna: "Il listato mostra indirizzi di inizio istruzione verificati nel disassemblato. Parti da f con EDI=8 ed EAX=0. Quando il debugger si ferma, EAX vale 10 e RET deve ancora essere eseguita. Scegli l’indirizzo di arresto e indica quanti passi macchina sono stati eseguiti.",
        campi: [
          scelta("RIP osservato", "0x401125", ["0x401120", "0x401122", "0x401125"], "Il debugger si ferma prima dell’istruzione indicata da RIP."),
          numero("Passi macchina eseguiti", 2, "Segui prima la copia e poi l’incremento del risultato.")
        ],
        svolgimento: [
          "All’indirizzo 0x401120 MOV copia 8 da EDI in EAX. Dopo il primo passo RIP punta a 0x401122 ed EAX vale ancora 8.",
          "ADD EAX,2 porta EAX a 10. Il successivo indirizzo indicato dal disassemblato è 0x401125, dove si trova RET.",
          "La fotografia appartiene quindi all’arresto dopo due passi. Un ulteriore passo eseguirebbe il ritorno e cambierebbe il flusso di controllo."
        ],
        listato: righe(
          "0x401120  mov eax, edi",
          "0x401122  add eax, 2",
          "0x401125  ret"
        ),
        quadro: [
          {titolo: "Fotografia", tipo: "stato", celle: [["EDI iniziale", "8"], ["EAX osservato", "10"], ["RET", "da eseguire"]]},
          {titolo: "Primo passo", tipo: "stato", celle: [["RIP", "0x401122"], ["EAX", "8"]]},
          {titolo: "Secondo passo", tipo: "stato", celle: [["RIP", "0x401125"], ["EAX", "10"]]},
          {titolo: "Posizione esatta", tipo: "stato", celle: [["Passi eseguiti", "2"], ["Prossimo comando", "RET"]]}
        ]
      }
    ]);

  prova(6, 3, 3, "Leggere il confronto con segno",
    "EDI ed ESI contengono valori di 32 bit. CMP EDI,ESI calcola temporaneamente la differenza del primo meno il secondo, conservandone i 32 bit bassi. SF copia il bit più alto del risultato conservato; OF segnala che la differenza matematica con segno supera l’intervallo da −2^31 a 2^31−1. Il salto JL è preso quando SF e OF differiscono, così l’ordine con segno resta corretto anche in presenza di sconfinamento. Il complemento a due attribuisce al bit più alto peso −2^31 e agli altri bit i consueti pesi positivi, perciò 0x80000000 rappresenta il minimo −2^31.",
    [
      {
        consegna: "EDI=0xFFFFFFFF ed ESI=0x00000002. Dopo CMP EDI,ESI il programma usa JL per restituire uno quando EDI è minore con segno, zero altrimenti.",
        campi: [
          numero("EDI interpretato con segno", -1, "In complemento a due su 32 bit sottrai 2^32 quando il bit 31 vale uno."),
          numero("EAX al ritorno", 1, "JL applica la relazione con segno.")
        ],
        svolgimento: [
          "EDI rappresenta -1 ed ESI rappresenta 2.",
          "La differenza matematica è -3 e rientra nella rappresentazione: OF=0, SF=1.",
          "JL verifica SF diverso da OF e raggiunge il ramo che scrive uno. Il ritorno vale 1."
        ],
        codice: righe(
          "cmp edi, esi",
          "jl minore",
          "xor eax, eax",
          "ret",
          "minore:",
          "mov eax, 1",
          "ret"
        )
      },
      {
        consegna: "EDI vale 0x80000000 ed ESI vale 1. CMP EDI,ESI valuta la differenza su 32 bit. Un collega decide il ramo osservando soltanto SF. Indica il flag OF prodotto dalla sottrazione e scegli l’esito corretto di JL.",
        campi: [
          numero("OF dopo CMP", 1, "Confronta la differenza matematica con l’intervallo da −2³¹ a 2³¹ − 1."),
          scelta("Decisione di JL", "Salto preso", ["Salto preso", "Prosegue in sequenza"], "JL confronta SF e OF. Quando sono diversi, il primo operando con segno è minore.")
        ],
        svolgimento: [
          "Con segno gli operandi valgono −2147483648 e 1. La differenza −2147483649 è inferiore al minimo rappresentabile, perciò OF=1.",
          "La parola troncata su 32 bit vale 0x7FFFFFFF e ha SF=0. Leggerne soltanto il bit di segno suggerirebbe una differenza positiva.",
          "JL rileva SF diverso da OF e prende il salto. Questo concorda con il confronto matematico −2147483648 < 1."
        ],
        quadro: [
          {titolo: "Operandi CMP", tipo: "stato", celle: [["EDI", "0x80000000"], ["ESI", "1"]]},
          {titolo: "Differenza matematica", tipo: "stato", celle: [["Valore", "−2147483649"], ["OF", "1"]]},
          {titolo: "Parola conservata", tipo: "stato", celle: [["Risultato", "0x7FFFFFFF"], ["SF", "0"]]},
          {titolo: "Regola di JL", tipo: "confronto", celle: [["SF", "0"], ["OF", "1"], ["Ramo", "preso"]]}
        ]
      }
    ]);

  prova(6, 4, 4, "Dall’array alla chiamata",
    "Un array di int32 conserva interi di quattro byte consecutivi, numerati da zero: l’elemento i comincia alla base+4i. Nella convenzione System V AMD64 il primo argomento intero a 32 bit entra in EDI e il risultato torna in EAX. RSP indica la cima della pila e deve essere un multiplo di sedici subito prima della CALL qui considerata. La funzione doppio restituisce due volte l’argomento: per risalire dall’uscita al dato letto basta dividere il risultato per due, individuarlo nell’array e trasformare il suo indice in uno spostamento di byte.",
    [
      {
        consegna: "RDI punta all’array di int32 [4, 9, 6, 7] ed ESI=2. La funzione seleziona l’elemento e chiama doppio(int x), che restituisce 2x. All’ingresso RSP vale 8 modulo 16.",
        campi: [
          numero("Offset dell’elemento in byte", 8, "Ogni elemento occupa quattro byte."),
          numero("EAX al ritorno", 12, "Segui ciò che passa in EDI all’ingresso di doppio.")
        ],
        svolgimento: [
          "Il caricamento usa offset 8 e legge 6. Questo valore entra in EDI, primo argomento intero.",
          "SUB RSP,8 rende RSP multiplo di sedici prima di CALL. doppio raddoppia 6 e consegna 12 in EAX.",
          "Al rientro il chiamante libera otto byte. Il suo RET conserva EAX, quindi la funzione restituisce 12."
        ],
        codice: righe(
          "mov esi, esi",
          "mov edi, [rdi+rsi*4]",
          "sub rsp, 8",
          "call doppio",
          "add rsp, 8",
          "ret",
          "doppio:",
          "lea eax, [rdi+rdi]",
          "ret"
        )
      },
      {
        consegna: "L’array di int32 all’indirizzo 0x5000 contiene [3, 5, 12, 8]. Il chiamante passa un elemento a doppio(int x), che restituisce 2x. Subito dopo il ritorno EAX vale 24. Gli elementi sono distinti. Risali all’indice usato e all’indirizzo del caricamento originario.",
        campi: [
          numero("Indice da zero", 2, "Dimezza il valore restituito e cerca il risultato nell’array."),
          numero("Indirizzo del primo byte letto", 20488, "Ogni int32 occupa quattro byte.")
        ],
        svolgimento: [
          "Il ritorno 24 implica che EDI contenesse 12 all’ingresso di doppio. L’array contiene 12 soltanto nella terza posizione.",
          "Con la numerazione da zero, la terza posizione ha indice 2. Il suo spostamento dalla base è 2 × 4 = 8 byte.",
          "Il caricamento avviene quindi all’indirizzo 0x5008. Il passaggio di 12 in EDI e il suo raddoppio riproducono il risultato osservato in EAX."
        ],
        quadro: [
          {titolo: "Indizi del debugger", tipo: "stato", celle: [["Base", "0x5000"], ["EAX al ritorno", "24"]]},
          {titolo: "Argomento all’ingresso", tipo: "stato", celle: [["24 diviso 2", "12"]]},
          {titolo: "Ricerca nell’array", tipo: "stato", celle: [["Elemento", "12"], ["Indice", "2"], ["Passo", "4 B"]]},
          {titolo: "Verifica del percorso", tipo: "sequenza", celle: [["Indirizzo", "0x5008"], ["Argomento", "12"], ["Ritorno", "24"]]}
        ]
      }
    ]);

  prova(6, 5, 1, "Ricostruire un’espressione ottimizzata",
    "Nella convenzione System V AMD64 su Linux un long occupa 64 bit. LEA può usare i registri d’argomento come base e indice e scrivere il valore calcolato direttamente nel registro di ritorno.",
    [
      {
        consegna: "Una funzione System V riceve due interi lunghi a=3 e b=5. Il corpo contiene LEA RAX,[RDI+RSI*2] e RET.",
        campi: [
          scelta("Registro che trasporta b", "RSI", ["RDI", "RSI", "RDX"], "Ordina i registri dell’ABI per ciascun argomento intero."),
          numero("Valore restituito", 13, "La scala moltiplica il secondo registro, poi si aggiunge la base.")
        ],
        svolgimento: [
          "L’ABI colloca a=3 in RDI e b=5 in RSI.",
          "LEA calcola 3 + 2 × 5 = 13 direttamente in RAX.",
          "Il chiamante riceve 13 dopo RET. L’espressione equivalente in C è a + 2*b per gli operandi dati."
        ],
        codice: righe(
          "lea rax, [rdi+rsi*2]",
          "ret"
        )
      },
      {
        consegna: "Il corpo osservato è LEA RAX,[RDI+RSI*2] seguito da RET. Un’ipotesi alternativa è 2a+b invece di a+2b. La prova con a=b=4 dà lo stesso risultato per entrambe. Fra i dati proposti scegli una coppia che distingua le due ipotesi e indica il risultato del listato con quella coppia.",
        campi: [
          scelta("Dati discriminanti", "a=3, b=5", ["a=1, b=1", "a=3, b=5", "a=2, b=2"], "Le due espressioni differiscono della quantità b − a."),
          numero("RAX del listato sui dati scelti", 13, "RDI contiene a e RSI contiene b. Soltanto RSI è usato con scala 2.")
        ],
        svolgimento: [
          "Per a=b entrambe le espressioni danno 3a. I casi 1,1 e 2,2 hanno lo stesso limite del test originario.",
          "Per a=3 e b=5 la prima espressione vale 3 + 2 × 5 = 13. La seconda vale 2 × 3 + 5 = 11.",
          "Il listato moltiplica l’indice RSI per 2 e aggiunge la base RDI. RAX vale dunque 13, risultato che distingue le due interpretazioni."
        ],
        quadro: [
          {titolo: "Due ipotesi", tipo: "confronto", celle: [["H1", "a + 2b"], ["H2", "2a + b"]]},
          {titolo: "Ingressi uguali", tipo: "stato", celle: [["a = b", "entrambe 3a"]]},
          {titolo: "Ingresso 3, 5", tipo: "confronto", celle: [["H1", "13"], ["H2", "11"]]},
          {titolo: "Indirizzo efficace", tipo: "sequenza", celle: [["RDI", "3"], ["2 × RSI", "10"], ["RAX", "13"]]}
        ]
      }
    ]);

  prova(7, 1, 1, "Due push e un pop",
    "PUSH salva una parola a 64 bit alla nuova cima dopo aver sottratto otto a RSP. POP legge la cima corrente e aggiunge otto al puntatore.",
    [
      {
        consegna: "Con RSP iniziale pari a 0x9000, il programma esegue PUSH RAX, PUSH RBX, POP RCX. RAX=8 e RBX=17. Calcola i valori finali di RCX e RSP.",
        campi: [
          numero("RCX finale", 17, "Il POP legge il valore della PUSH più recente."),
          numero("RSP finale", 36856, "Ogni push sottrae otto byte, ogni pop li riaggiunge.")
        ],
        svolgimento: [
          "Il primo PUSH scrive 8 a 0x8FF8.",
          "Il secondo PUSH scrive 17 a 0x8FF0. RSP indica ora questa cella.",
          "POP copia 17 in RCX e riporta RSP a 0x8FF8, dove resta 8."
        ],
        codice: righe(
          "push rax",
          "push rbx",
          "pop rcx"
        )
      },
      {
        consegna: "Dopo PUSH RAX, PUSH RBX e POP RCX, il debugger mostra RCX=25, RSP=0x8FF8 e la parola [RSP]=6. I tre comandi operano su parole da otto byte. Recupera il valore iniziale di RAX e quello iniziale di RSP.",
        campi: [
          numero("RAX prima del primo PUSH", 6, "Quale dei due depositi rimane in cima dopo una sola estrazione?"),
          numero("RSP prima della sequenza", 36864, "Due depositi e un’estrazione abbassano complessivamente la cima di una parola.")
        ],
        svolgimento: [
          "POP ha estratto la seconda parola depositata. Il suo valore 25 proveniva perciò da RBX.",
          "La parola rimasta in cima proviene dal primo PUSH. Poiché [0x8FF8]=6, all’ingresso RAX conteneva 6.",
          "La sequenza ha consumato in totale otto byte di pila. Si ricostruisce l’ingresso sommando otto a 0x8FF8, ottenendo 0x9000."
        ],
        quadro: [
          {titolo: "Stato osservato", tipo: "stato", celle: [["RCX", "25"], ["RSP", "0x8FF8"], ["[RSP]", "6"]]},
          {titolo: "Ultimo valore estratto", tipo: "stato", celle: [["Vecchio RBX", "25"]]},
          {titolo: "Valore rimasto", tipo: "stato", celle: [["Vecchio RAX", "6"], ["Indirizzo", "0x8FF8"]]},
          {titolo: "Risalita della cima", tipo: "confronto", celle: [["RSP finale", "0x8FF8"], ["RSP iniziale", "0x9000"]]}
        ]
      }
    ]);

  prova(7, 2, 1, "Calcolare gli indirizzi del frame",
    "RSP indica la cima della pila. Il prologo PUSH RBP salva il vecchio riferimento in otto byte e MOV RBP,RSP fissa il nuovo frame pointer, cioè l’indirizzo di riferimento della funzione. Sottraendo C da RSP si riserva l’area locale da RBP−C a RBP−1 inclusi. Una dword occupa quattro byte: se inizia a RBP−d, termina a RBP−d+3. Perché sia interamente locale devono rientrare entrambi gli estremi. Si controllano dunque la posizione iniziale e anche l’ampiezza della scrittura.",
    [
      {
        consegna: "RSP all’ingresso vale 0x7FF8. Il prologo salva RBP, imposta il nuovo RBP e riserva 32 byte. Una dword locale si trova a RBP−12.",
        campi: [
          numero("RSP dopo la riserva", 32720, "Deduci prima lo spazio occupato dal vecchio RBP."),
          numero("Indirizzo della dword locale", 32740, "Usa come origine il frame pointer, fissato subito dopo il PUSH.")
        ],
        svolgimento: [
          "PUSH RBP porta RSP a 0x7FF0 e vi salva il precedente RBP.",
          "MOV fissa RBP=0x7FF0. SUB abbassa la cima a 0x7FD0.",
          "L’indirizzo della variabile è 0x7FF0 − 12 = 0x7FE4, interno all’area riservata."
        ],
        codice: righe(
          "push rbp",
          "mov rbp, rsp",
          "sub rsp, 32",
          "mov dword ptr [rbp-12], 1"
        )
      },
      {
        consegna: "Dopo PUSH RBP e MOV RBP,RSP, il frame pointer vale 0x7FF0. SUB RSP,16 riserva sedici byte. Il programma propone una dword a RBP−2. Indica quanti dei suoi quattro byte cadrebbero fuori dalla riserva e scegli lo spiazzamento minimo positivo d per cui una dword a RBP−d resta interamente dentro i sedici byte.",
        campi: [
          numero("Byte fuori dalla riserva", 2, "La regione locale termina a RBP−1. Disegna i quattro indirizzi a partire da RBP−2."),
          numero("Minimo d ammissibile", 4, "L’ultimo byte della dword si trova tre indirizzi oltre il primo.")
        ],
        svolgimento: [
          "La riserva occupa gli indirizzi da 0x7FE0 a 0x7FEF inclusi. La dword proposta inizia a 0x7FEE.",
          "Scrivere quattro byte toccherebbe 0x7FEE, 0x7FEF, 0x7FF0 e 0x7FF1. Gli ultimi due ricadono nella zona del RBP salvato.",
          "La condizione superiore è RBP−d+3 ≤ RBP−1, ossia d ≥ 4. Con d=4 si usano esattamente gli indirizzi da 0x7FEC a 0x7FEF, tutti nella riserva."
        ],
        quadro: [
          {titolo: "Limiti del frame", tipo: "stato", celle: [["RBP", "0x7FF0"], ["Riserva", "16 B"], ["Proposta", "RBP − 2"]]},
          {titolo: "Intervallo locale", tipo: "stato", celle: [["Minimo", "0x7FE0"], ["Massimo", "0x7FEF"]]},
          {titolo: "Dati oltre il bordo", tipo: "stato", celle: [["Ultimi byte", "0x7FF0, 0x7FF1"], ["Numero", "2"]]},
          {titolo: "Posizione ammessa", tipo: "stato", celle: [["d minimo", "4"], ["Intervallo", "0x7FEC…0x7FEF"]]}
        ]
      }
    ]);

  prova(7, 3, 1, "Locale sopravvissuto a una chiamata",
    "CALL salva il ritorno otto byte sotto la cima corrente. Una locale che deve sopravvivere a una chiamata interna va collocata nella riserva del chiamante. LEAVE ripristina il frame precedente e RET recupera la destinazione.",
    [
      {
        consegna: "All’ingresso RSP=0x7FF8 ed EDI=11. Il prologo salva RBP, fissa RBP alla nuova cima e riserva 16 byte. La funzione salva EDI nella dword a RBP−4 e chiama g che restituisce 4 in EAX. Al rientro somma la dword a EAX ed esegue LEAVE seguito da RET. Calcola EAX e il valore di RSP dopo questo RET.",
        campi: [
          numero("EAX finale", 15, "La locale si trova nel frame del chiamante di g."),
          numero("RSP subito dopo RET", 32768, "Ricostruisci prima la cima all’ingresso della funzione, poi consuma l’indirizzo di ritorno.")
        ],
        svolgimento: [
          "Il prologo prepara RBP=0x7FF0 e RSP=0x7FE0. La locale a 0x7FEC riceve 11.",
          "g ritorna con 4 in EAX. ADD legge la locale e produce 15.",
          "LEAVE pone RSP=RBP e ripristina il precedente RBP mediante POP: RSP=0x7FF8. RET consuma altri otto byte e lascia RSP=0x8000."
        ],
        codice: righe(
          "push rbp",
          "mov rbp, rsp",
          "sub rsp, 16",
          "mov [rbp-4], edi",
          "call g",
          "add eax, [rbp-4]",
          "leave",
          "ret",
          "g:",
          "mov eax, 4",
          "ret"
        )
      },
      {
        consegna: "Appena prima di CALL, RSP=0x8000. La funzione ha lasciato un temporaneo di quattro byte a [RSP−4], senza riservare spazio. La chiamata interna usa il consueto indirizzo di ritorno di otto byte. Indica l’indirizzo a cui CALL inizia a scrivere e quanti byte del temporaneo vengono sovrascritti.",
        campi: [
          numero("Indirizzo iniziale del ritorno salvato", 32760, "CALL sottrae otto al vecchio RSP e scrive alla nuova cima."),
          numero("Byte del temporaneo sovrascritti", 4, "Confronta l’intervallo di otto byte del ritorno con quello di quattro byte del dato.")
        ],
        svolgimento: [
          "Il temporaneo occupa gli indirizzi da 0x7FFC a 0x7FFF inclusi. Essendo sotto la cima corrente, può essere toccato dalla chiamata successiva.",
          "CALL porta RSP da 0x8000 a 0x7FF8 e scrive il ritorno da 0x7FF8 a 0x7FFF. L’intersezione contiene tutti e quattro i byte del temporaneo.",
          "Una riserva di sedici byte prima della chiamata porterebbe la cima a 0x7FF0 mantenendo l’allineamento. Conservando il dato nella riserva, per esempio a [RSP+12], esso rimarrebbe sopra la zona in cui CALL scrive il ritorno."
        ],
        quadro: [
          {titolo: "Subito prima di CALL", tipo: "stato", celle: [["RSP", "0x8000"], ["Temporaneo", "RSP − 4"]]},
          {titolo: "Dato locale", tipo: "stato", celle: [["Primo", "0x7FFC"], ["Ultimo", "0x7FFF"]]},
          {titolo: "Ritorno interno", tipo: "stato", celle: [["Primo", "0x7FF8"], ["Ultimo", "0x7FFF"], ["Sovrapposti", "4 B"]]},
          {titolo: "Dopo riserva di 16", tipo: "confronto", celle: [["RSP per CALL", "0x7FF0"], ["Locale", "0x7FFC"]]}
        ]
      }
    ]);

  prova(7, 4, 4, "Duplicare una parola prima delle estrazioni",
    "Una parola a 64 bit occupa otto byte e si indica con qword. Le parentesi quadre designano il contenuto della memoria: [RSP] è la parola alla cima, [RSP+8] quella immediatamente successiva verso indirizzi maggiori. PUSH qword ptr [RSP+8] legge la sorgente usando RSP prima del deposito, quindi sottrae otto a RSP e salva il valore alla nuova cima. POP preleva invece la parola corrente, la copia nel registro indicato e fa risalire RSP di otto. Seguendo in quest’ordine letture e spostamenti si ricostruiscono anche le duplicazioni.",
    [
      {
        consegna: "RSP iniziale vale 0x9000. Il programma inserisce 3 e poi 7 sullo stack, duplica la cima con PUSH qword ptr [RSP], quindi esegue due POP in RAX e RBX. Calcola la somma di RAX e RBX e indica il valore ancora in cima alla pila.",
        campi: [
          numero("Somma finale di RAX e RBX", 14, "La sorgente [RSP] del terzo PUSH viene letta rispetto al vecchio RSP."),
          numero("Valore ancora in cima", 3, "I due POP eliminano le due copie superiori.")
        ],
        svolgimento: [
          "Dopo i due PUSH la cima contiene 7 e la parola successiva contiene 3.",
          "La duplicazione legge 7 dal vecchio indirizzo e lo salva otto byte più in basso.",
          "I due POP caricano 7 in entrambi i registri. La somma è 14 e [RSP] conserva 3."
        ],
        codice: righe(
          "push 3",
          "push 7",
          "push qword ptr [rsp]",
          "pop rax",
          "pop rbx"
        )
      },
      {
        consegna: "Si eseguono PUSH 10 e PUSH 28. Una terza PUSH, da completare, deve duplicare il valore 10 lasciando entrambe le parole originali nella pila. Seguono POP RAX, POP RBX. Scegli la sorgente della terza PUSH e ricava la somma dei valori estratti.",
        campi: [
          scelta("Terza istruzione", "PUSH qword ptr [RSP+8]", ["PUSH qword ptr [RSP]", "PUSH qword ptr [RSP+8]", "PUSH qword ptr [RSP−8]"], "Dopo i due depositi, la parola più vecchia si trova a un indirizzo maggiore della cima."),
          numero("RAX + RBX", 38, "La prima estrazione legge la copia. La seconda raggiunge la parola che era in cima prima della copia.")
        ],
        svolgimento: [
          "Dopo i primi due depositi, [RSP]=28 e [RSP+8]=10. La sorgente si calcola con il puntatore precedente al nuovo deposito.",
          "PUSH qword ptr [RSP+8] legge 10 e lo deposita in cima. Dall’alto verso il basso si trovano ora 10, 28 e 10.",
          "POP RAX recupera 10 e POP RBX recupera 28. La somma è 38 e in cima rimane il primo valore depositato, 10."
        ],
        quadro: [
          {titolo: "Due depositi", tipo: "stato", celle: [["Primo", "10"], ["Secondo", "28"]]},
          {titolo: "Prima della copia", tipo: "confronto", celle: [["[RSP]", "28"], ["[RSP+8]", "10"]]},
          {titolo: "Dopo la copia", tipo: "sequenza", celle: [["Cima", "10"], ["Seconda", "28"], ["Terza", "10"]]},
          {titolo: "Due estrazioni", tipo: "sequenza", celle: [["RAX", "10"], ["RBX", "28"], ["Somma", "38"]]}
        ]
      }
    ]);

  prova(7, 5, 5, "Salvare RBX e ristabilire l’allineamento",
    "La convenzione System V AMD64 richiede che il chiamato restituisca RBX con il valore d’ingresso. PUSH RBX ne salva una copia sottraendo otto a RSP, il registro della cima. Per la CALL interna del caso, RSP deve essere multiplo di sedici subito prima dell’istruzione. La riserva scelta deve quindi contenere tutti i byte locali richiesti e lasciare tale resto pari a zero. CALL sottrae altri otto byte per il proprio indirizzo di ritorno. Dopo la chiamata si libera la riserva e POP RBX recupera la copia, riportando il registro e la pila allo stato promesso.",
    [
      {
        consegna: "All’ingresso RSP=0x8FF8 e RBX=5. Per usare RBX preservandolo, la funzione lo salva e riserva 16 byte prima di chiamare un’altra funzione. Segui la pila fino al ritorno.",
        campi: [
          numero("RSP immediatamente prima di CALL", 36832, "Conta il PUSH a 64 bit e la successiva riserva di locali."),
          numero("RBX restituito al chiamante", 5, "RBX è un registro callee-saved nella convenzione System V.")
        ],
        svolgimento: [
          "PUSH RBX salva 5 a 0x8FF0. La sottrazione porta RSP a 0x8FE0, multiplo di 16.",
          "CALL deposita il proprio ritorno a 0x8FD8. RET della funzione interna ripristina la quota precedente.",
          "La funzione libera 16 byte e POP RBX recupera 5. Il RET esterno legge l’indirizzo originario a 0x8FF8."
        ],
        codice: righe(
          "push rbx",
          "sub rsp, 16",
          "mov ebx, 77",
          "call interna",
          "add rsp, 16",
          "pop rbx",
          "ret",
          "interna:",
          "ret"
        )
      },
      {
        consegna: "All’ingresso RSP=0x8FF8. La funzione deve conservare RBX, usare almeno 24 byte per i locali e chiamare un’altra funzione. Dopo PUSH RBX deve scegliere tra riserve di 24, 32 e 40 byte. Indica la riserva minima fra quelle che rispettano l’allineamento a 16 prima di CALL e l’indirizzo al quale la CALL depositerà il proprio ritorno.",
        campi: [
          numero("Riserva minima valida fra le proposte", 32, "Dopo PUSH RBX controlla il resto di RSP modulo 16. La riserva deve contenere i locali e conservare il resto richiesto."),
          numero("Indirizzo di scrittura della CALL", 36808, "Ricava prima RSP immediatamente prima della chiamata, poi sottrai otto.")
        ],
        svolgimento: [
          "Il salvataggio di RBX porta la cima da 0x8FF8 a 0x8FF0, che è multiplo di sedici. Una riserva successiva di 24 o 40 byte lascerebbe resto otto.",
          "La riserva di 32 byte contiene i 24 necessari e mantiene RSP allineato. Prima di CALL la cima vale 0x8FF0−0x20=0x8FD0.",
          "CALL sottrae otto e scrive il ritorno a 0x8FC8. Il salvataggio di RBX rimane all’indirizzo 0x8FF0, recuperabile quando il chiamante libera i 32 byte."
        ],
        quadro: [
          {titolo: "Requisiti", tipo: "stato", celle: [["RSP iniziale", "0x8FF8"], ["Locali", "almeno 24 B"]]},
          {titolo: "Dopo PUSH", tipo: "stato", celle: [["RSP", "0x8FF0"], ["Resto su 16", "0"]]},
          {titolo: "Riserve candidate", tipo: "confronto", celle: [["24 B", "resto 8"], ["32 B", "resto 0"], ["40 B", "resto 8"]]},
          {titolo: "Prima e dopo CALL", tipo: "sequenza", celle: [["Prima", "0x8FD0"], ["Ritorno salvato", "0x8FC8"]]}
        ]
      }
    ]);
})();
