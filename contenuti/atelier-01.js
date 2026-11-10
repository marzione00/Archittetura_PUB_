(function () {
  'use strict';

  function num(id, label, min, max, iniziale, step = 1) {
    return {id, label, min, max, step, iniziale};
  }
  function scelta(id, label, valori, iniziale) {
    const opzioni = valori.map(v => Array.isArray(v) ? v : [String(v), String(v)]);
    return {id, label, opzioni, iniziale: iniziale ?? opzioni[0][0]};
  }
  function bit(id, label, iniziale = 0) { return num(id, label, 0, 1, iniziale); }
  function passo(titolo, testo, ...valori) { return {titolo, testo, valori}; }
  function unita(id, domanda, controlli, calcola) {
    SL.unita[id] = {teoria: SL.lezioni[id].join(' '), domanda, controlli, calcola};
  }
  const hex = (x, cifre = 2) => x.toString(16).toUpperCase().padStart(cifre, '0');
  const bin = (x, cifre = 8) => x.toString(2).padStart(cifre, '0');
  const bytes = a => Array.from(a, x => hex(x)).join(' ');
  const dec = x => String(x).replace('.', ',');
  const si = b => b ? 'sì' : 'no';
  const segno8 = x => x >= 128 ? x - 256 : x;
  const encoder = new TextEncoder();

  // 1.1 — Dal programma C al processo
  unita('1.1.1',
    "Quali byte produce puts e dove li invia il descrittore 1?",
    [scelta('parola', 'Argomento di puts', ['hello','Ciao','Aè']), scelta('uscita','Destinazione di stdout',['terminale','file'])],
    ({parola,uscita}) => {
      const data = encoder.encode(parola + '\n');
      return [passo('Chiamata C', 'Il processo passa a puts una stringa di byte già codificata in UTF-8.', ['Argomento',parola]),
        passo('Libreria standard', 'La libreria prepara il testo e aggiunge LF. La traccia assume che la scrittura POSIX consegni tutti i byte richiesti.', ['Byte esadecimali',bytes(data)],['Lunghezza',data.length]),
        passo('Consegna al kernel', 'Il descrittore aperto determina dove arrivano i byte.', ['Richiesta','write(1, …, '+data.length+')'],['Destinazione',uscita])];
    });

  unita('1.1.2',
    "A quale indirizzo legge la CPU e quale valore carica nel registro?",
    [num('offset','Spostamento dalla base (byte)',0,3,1)],
    ({offset}) => {
      const memoria = [0x48,0x65,0x79,0x21], indirizzo = '0x'+hex(0x1000+offset,4);
      return [passo('Calcolo nella CPU', 'L’unità di indirizzamento somma base e spostamento.', ['Base','0x1000'],['Spostamento',offset]),
        passo('Selezione della cella', 'La memoria usa l’indirizzo ricevuto per selezionare una delle quattro celle.', ['Indirizzo',indirizzo],['Memoria da 0x1000',bytes(memoria)]),
        passo('Ritorno dei dati', 'La memoria restituisce un byte che la CPU carica nel registro.', ['Byte letto','0x'+hex(memoria[offset])],['Registro (decimale)',memoria[offset]])];
    });

  unita('1.1.3',
    "Quale file lascia sul disco ciascun comando GCC?",
    [scelta('modo','Comando GCC',[['E','gcc -E hello.c -o hello.i'],['S','gcc -S hello.c'],['c','gcc -c hello.c'],['link','gcc hello.c -o hello']],'link')],
    ({modo}) => {
      const stadi=[['Preelaborazione','Le direttive vengono espanse.','hello.i'],['Compilazione','Il compilatore sceglie le istruzioni.','hello.s'],['Assemblaggio','Codice macchina e riferimenti esterni entrano nell’oggetto.','hello.o'],['Collegamento','Il collegatore costruisce l’eseguibile usando oggetti e librerie.','hello']];
      const indice=['E','S','c','link'].indexOf(modo);
      return [passo('Sorgente','Il file contiene la definizione di main e una chiamata a puts.', ['Ingresso','hello.c']),
        ...stadi.slice(0,indice+1).map(([nome,testo,file],i) => passo(nome,testo,[i === indice ? 'Prodotto richiesto' : 'Forma intermedia',file])),
        passo('Uscita del comando','Il file indicato è il prodotto conservato dal comando. Le forme intermedie possono rimanere interne a GCC.', ['File da esaminare',stadi[indice][2]])];
    });

  unita('1.1.4',
    "Quale percorso si ottiene dopo aver attraversato ogni componente?",
    [scelta('path','Percorso',['../dati/./riga','./prove/../hello.c','/tmp/../var/log']),scelta('cwd','Directory corrente',['/home/lea/src','/srv/progetto/src'])],
    ({path,cwd}) => {
      const pila = path.startsWith('/') ? [] : cwd.split('/').filter(Boolean);
      const stato=() => '/'+pila.join('/');
      const traccia=[passo('Origine', 'La barra iniziale seleziona la radice. Un nome relativo usa la directory corrente.', ['Directory corrente',cwd],['Punto di partenza',stato()])];
      for (const nome of path.split('/').filter(Boolean)) {
        if(nome === '..') pila.pop(); else if(nome !== '.') pila.push(nome);
        traccia.push(passo('Componente '+nome,nome==='..'?'Si risale al genitore.':nome==='.'?'Si conserva la posizione.':'Si cerca il nome nella directory raggiunta.', ['Percorso raggiunto',stato()]));
      }
      return traccia;
    });

  unita('1.1.5',
    "Quali valori di PID e codice di uscita ritrova la shell al termine del figlio?",
    [num('pid','PID assegnato al figlio',701,720,702),num('esito','Codice di uscita',0,15,3)],
    ({pid,esito}) => [passo('Creazione','fork restituisce il PID del figlio alla shell e zero al figlio.', ['PID shell',700],['Ritorno nel padre',pid]),
      passo('Nuova immagine','Nel figlio execve carica il programma hello e ne avvia l’esecuzione.', ['Immagine','hello'],['PID dopo execve',pid]),
      passo('Raccolta','waitpid termina dopo l’uscita del figlio. WIFEXITED segnala la terminazione normale e WEXITSTATUS estrae il codice.', ['PID raccolto',pid],['Codice',esito])]);

  unita('1.1.6',
    "Quali byte contiene il file esito dopo ciascuna forma del comando?",
    [scelta('modo','Comando',[['term','./hello'],['scrivi','./hello > esito'],['appendi','./hello >> esito']])],
    ({modo}) => [passo('Analisi della shell',modo==='term'?'La shell conserva il terminale su stdout.':modo==='scrivi'?'La shell apre il file e lo tronca prima di avviare hello.':'La shell apre il file in modalità append.', ['File iniziale','58 0A'],['FD 1',modo==='term'?'terminale':'esito']),
      passo('Esecuzione di hello','Il figlio esegue hello e scrive sul descrittore 1.', ['Byte scritti','68 65 6C 6C 6F 0A'],['Lunghezza',6]),
      passo('Osservazione','Il contenuto finale dipende dal collegamento del descrittore.', ['File esito',modo==='term'?'58 0A':(modo==='appendi'?'58 0A ':'')+'68 65 6C 6C 6F 0A'],['Byte nel file',modo==='term'?2:modo==='scrivi'?6:8])]);

  // 1.2 — Rappresentazione posizionale
  unita('1.2.1',
    "La tensione scelta garantisce uno zero, un uno oppure lascia il livello indeterminato?",
    [num('mv','Tensione in ingresso (mV)',0,3300,1200,100)],({mv})=>[
      passo('Misura','La tensione è riferita alla massa del ricevitore.', ['Ingresso',mv+' mV']),
      passo('Confronto','Confronta la misura con i due limiti inclusivi.', ['VIL massimo','800 mV'],['VIH minimo','2000 mV']),
      passo('Decodifica',mv<=800?'La tensione cade nella fascia del livello basso.':mv>=2000?'La tensione cade nella fascia del livello alto.':'Il costruttore garantisce il bit soltanto nelle due fasce esterne.', ['Livello',mv<=800?'0':mv>=2000?'1':'indeterminato'])]);

  unita('1.2.2',
    "Quale potenza di due rappresenta il bit che hai attivato?",
    [num('k','Posizione del bit, contando da destra',0,7,3)],({k})=>[
      passo('Posizione','Il bit meno significativo ha indice zero.', ['Indice',k]),
      passo('Peso','Si parte da 1 e si raddoppia per ogni posizione.', ['Potenza','2^'+k],['Peso',2**k]),
      passo('Parola','Tutte le altre posizioni valgono zero.', ['Binario',bin(2**k)],['Esadecimale','0x'+hex(2**k)])]);

  unita('1.2.3',
    "Quale byte occupa l’indirizzo più basso nei due ordini?",
    [scelta('word','Parola a 32 bit',['12345678','01020304','A0B000FF']),scelta('ordine','Ordine',['little-endian','big-endian'])],
    ({word,ordine})=>{
      const v=new DataView(new ArrayBuffer(4)); v.setUint32(0,parseInt(word,16),ordine==='little-endian');
      return [passo('Separazione','La scrittura esadecimale raggruppa due cifre per ottetto.', ['Valore','0x'+word],['Base','0x1000']),
        passo('Memoria','Leggi le celle in ordine crescente di indirizzo.', ...Array.from({length:4},(_,i)=>['0x'+hex(0x1000+i,4),hex(v.getUint8(i))])),
        passo('Rilettura','Si ricompongono i byte usando il peso assegnato a ciascuna cella.', ['Ordine',ordine],['Parola ricostruita','0x'+hex(v.getUint32(0,ordine==='little-endian'),8)])];
    });

  unita('1.2.4',
    "A quale intero e a quale carattere ASCII corrisponde il byte?",
    [num('v','Valore della cella',32,126,65)],({v})=>[
      passo('Memoria','Si osserva la stessa parola in due basi.', ['Binario',bin(v)],['Esadecimale','0x'+hex(v)]),
      passo('Intero','Somma i pesi delle posizioni a uno.', ['Addendi',Array.from({length:7},(_,i)=>2**i).filter(x=>v&x).join(' + ')],['Valore',v]),
      passo('Carattere','La tabella ASCII usa il numero come indice.', ['Carattere',v===32?'spazio':String.fromCharCode(v)])]);

  // 1.3 — Testo, campioni e campi delimitati
  unita('1.3.1',
    "Qual è il codice ASCII della cifra scelta e come se ne ricava il valore numerico?",
    [num('n','Cifra decimale',0,9,0)],({n})=>[
      passo('Memorizzazione','Il programma registra una cifra come testo.', ['Carattere',String(n)],['Byte','0x'+hex(48+n)]),
      passo('Lettura senza segno','Somma i pesi del byte memorizzato.', ['Intero',48+n],['Bit',bin(48+n)]),
      passo('Conversione della cifra','La distanza dal codice di zero dà il valore numerico.', ['Sottrazione',(48+n)+' − 48'],['Risultato',n])]);

  unita('1.3.2',
    "Quale punto di codice si ricostruisce dai byte del carattere?",
    [scelta('lettera','Carattere',['è','€','😀','A'])],({lettera})=>{
      const data=encoder.encode(lettera), mask=[0,127,31,15,7][data.length];
      let valore=data[0]&mask;
      const traccia=[passo('Sequenza','Individua il byte iniziale e conta le continuazioni attese.', ['Ottetti',bytes(data)],['Lunghezza',data.length]),
        passo('Primo gruppo','La maschera elimina i bit di prefisso e conserva il primo contributo.', ['Maschera',bin(mask)],['Accumulatore',valore])];
      for(const b of data.slice(1)){const precedente=valore; valore=valore*64+(b&63); traccia.push(passo('Continuazione 0x'+hex(b),'Il nuovo gruppo occupa sei bit in coda.', ['Calcolo',precedente+' × 64 + '+(b&63)],['Accumulatore',valore]));}
      return [...traccia,passo('Carattere','Il numero ricostruito individua il carattere nella tabella Unicode.', ['Punto di codice','U+'+hex(valore,4)],['Carattere',lettera])];
    });

  unita('1.3.3',
    "Quanti byte di campioni contiene un secondo di registrazione?",
    [scelta('hz','Campioni al secondo per canale',['48000','44100','8000']),num('canali','Canali',1,8,2),scelta('bit','Bit per campione',['16','24','8'])],
    ({hz,canali,bit})=>[passo('Singolo campione','Otto bit formano un byte.', ['Bit',bit],['Byte',bit/8]),
      passo('Istante multicanale','Ogni istante contiene una parola per canale.', ['Canali',canali],['Byte per istante',canali*bit/8]),
      passo('Un secondo','Moltiplica la dimensione di un istante per la frequenza.', ['Istanti in un secondo',hz],['Dimensione',hz*canali*bit/8+' B'])]);

  unita('1.3.4',
    "Il campo dichiarato è completo? A quale posizione si ferma il cursore?",
    [num('n','Lunghezza dichiarata (byte)',0,8,6),num('presenti','Byte presenti dopo il prefisso',0,8,5)],
    ({n,presenti})=>[passo('Prefisso','Il prefisso dichiara quanti byte dovrebbe contenere il campo. Al passo successivo il lettore misura lo spazio disponibile.', ['Byte di lunghezza',hex(n)],['Cursore dopo il prefisso',1]),
      passo('Limite','Il buffer comprende il prefisso e il contenuto disponibile.', ['Dimensione totale',1+presenti],['Residuo',presenti]),
      passo('Decisione',n<=presenti?'Il campo è completo. Il cursore avanza di tanti byte quanti ne dichiara il prefisso.':'Il campo è troncato. Il cursore rimane subito dopo il prefisso.', ['Byte mancanti',Math.max(0,n-presenti)],['Cursore finale',n<=presenti?1+n:1])]);

  unita('1.3.5',
    "Quale intero si ottiene dai due byte all’indice scelto? Quando il lettore deve fermarsi?",
    [num('pos','Posizione iniziale',0,3,1),scelta('ord','Ordine',['big-endian','little-endian'])],
    ({pos,ord})=>{
      const a=[0x41,0x01,0x02,0xFF], ok=pos+2<=a.length;
      const v=ok?(ord==='big-endian'?a[pos]*256+a[pos+1]:a[pos+1]*256+a[pos]):0;
      return [passo('Buffer','I quattro byte sono ordinati per indirizzo crescente.', ['Memoria',bytes(a)],['Cursore',pos]),
        passo('Delimitazione','Il campo occupa due byte contigui a partire dal cursore.', ['Disponibili',a.length-pos],['Campo',ok?bytes(a.slice(pos,pos+2)):'troncato']),
        passo('Interpretazione',ok?'Moltiplica per 256 il byte di peso maggiore e aggiungi l’altro byte.':'Il controllo arresta la lettura prima della conversione.', ['Ordine',ord],['Intero',ok?v:'indisponibile'],['Cursore finale',ok?pos+2:pos])];
    });

  // 1.4 — Interi con segno, flag e limiti
  unita('1.4.1',
    "Come variano le due letture del byte quando cambia il bit 7?",
    [num('bassi','Sette bit inferiori, in decimale',0,127,0),bit('alto','Bit 7',1)],({bassi,alto})=>{
      const u=bassi+128*alto;
      return [passo('Composizione','Il bit più alto precede i sette bit inferiori.', ['Parola',bin(u)],['Byte','0x'+hex(u)]),
        passo('Lettura senza segno','Il peso del bit 7 è positivo.', ['Calcolo',alto+' × 128 + '+bassi],['Valore',u]),
        passo('Complemento a due','Il bit 7 indica un contributo negativo quando vale uno.', ['Calcolo',alto+' × (−128) + '+bassi],['Valore',segno8(u)])];
    });

  unita('1.4.2',
    "In quali casi CF e OF assumono valori diversi?",
    [num('a','Byte A',0,255,127),num('b','Byte B',0,255,1),scelta('op','Operazione',['somma','sottrazione'])],({a,b,op})=>{
      const add=op==='somma', raw=add?a+b:a-b, signed=add?segno8(a)+segno8(b):segno8(a)-segno8(b);
      return [passo('Operandi','Assegna una lettura con segno a ciascun byte.', ['A',hex(a)+' → '+segno8(a)],['B',hex(b)+' → '+segno8(b)]),
        passo('Percorso senza segno',add?'Confronta la somma con 255.':'Un minuendo minore del sottraendo richiede un prestito.', ['Risultato matematico',raw],['CF',Number(add?raw>255:raw<0)]),
        passo('Percorso con segno','Confronta il risultato matematico con gli estremi rappresentabili.', ['Risultato matematico',signed],['OF',Number(signed < -128 || signed > 127)],['Byte scritto','0x'+hex(raw&255)])];
    });

  unita('1.4.3',
    "Quando la conversione di a cambia il risultato del confronto?",
    [num('a','Operando int',-8,8,-1),num('b','Operando unsigned int',0,8,1)],({a,b})=>{
      const u=a<0?2**32+a:a;
      return [passo('Operandi','Il suffisso u attribuisce al secondo operando il tipo unsigned int per questi valori.', ['Espressione',a+' < '+b+'u']),
        passo('Conversione','Applica il modulo 4294967296 all’operando int.', ['Primo operando convertito',u],['Secondo operando',b]),
        passo('Valutazione','Il confronto C usa i due valori senza segno e restituisce un int pari a zero o uno.', ['Esito C',Number(u<b)],['Confronto matematico iniziale',Number(a<b)])];
    });

  unita('1.4.4',
    "Il prodotto entra in un byte con il secondo fattore scelto?",
    [num('a','Primo fattore',0,255,16),num('b','Secondo fattore',0,255,16)],({a,b})=>[
      passo('Destinazione','La memoria di destinazione ha otto bit.', ['Primo fattore',a],['Secondo fattore',b],['Massimo',255]),
      passo('Controllo preliminare',b?'Arrotonda per difetto il quoziente 255 / B.':'Il prodotto con zero è sempre rappresentabile.', ['Massimo primo fattore',b?Math.floor(255/b):255],['Prodotto ammesso',si(!b||a<=Math.floor(255/b))]),
      passo('Confronto con il residuo','Il prodotto matematico permette di verificare la decisione. Una conversione a otto bit conserverebbe il residuo.', ['Prodotto esatto',a*b],['Residuo modulo 256',(a*b)%256])]);

  // 1.5 — Reti combinatorie, ritardi e maschere
  const porte = {
    AND:(a,b)=>a&b, OR:(a,b)=>a|b, XOR:(a,b)=>a^b,
    NAND:(a,b)=>1-(a&b), NOR:(a,b)=>1-(a|b)
  };
  unita('1.5.1',
    "Quale riga corrisponde agli ingressi e quale uscita indica per la porta scelta?",
    [scelta('porta','Porta',['XOR','AND','OR','NAND','NOR']),bit('a','Ingresso A'),bit('b','Ingresso B',1)],({porta,a,b})=>[
      passo('Enumerazione','Tratta A come bit alto del numero di riga e B come bit basso.', ['Ingressi',''+a+b],['Indice da zero',2*a+b]),
      passo('Tabella di '+porta,'La sequenza segue l’ordine 00, 01, 10, 11.', ['Colonna di uscita',[0,1,2,3].map(i=>porte[porta](i>>1,i&1)).join(' ')]),
      passo('Uscita assestata','Leggi la voce individuata dalla coppia di ingressi.', ['Funzione',porta+'('+a+', '+b+')'],['Uscita',porte[porta](a,b)])]);

  const termini=['¬A·¬B','¬A·B','A·¬B','A·B'];
  unita('1.5.2',
    "Quali mintermini entrano nell’espressione della tabella impostata?",
    [bit('r0','Uscita per 00'),bit('r1','Uscita per 01',1),bit('r2','Uscita per 10',1),bit('r3','Uscita per 11')],p=>{
      const y=[p.r0,p.r1,p.r2,p.r3], scelti=termini.filter((_,i)=>y[i]);
      return [passo('Tabella','Segna le righe nelle quali la funzione vale uno.', ['Uscite da 00 a 11',y.join(' ')]),
        passo('Prodotti','Scrivi un termine per ciascuna riga selezionata.', ['Mintermini',scelti.join(', ')||'insieme vuoto']),
        passo('Somma logica','L’OR è vero quando almeno uno dei prodotti è vero. La selezione vuota dà la funzione costante zero.', ['Espressione',scelti.join(' + ')||'0'],['Righe vere',scelti.length])];
    });

  unita('1.5.3',
    "Quali risultati danno A & B e A && B per gli stessi operandi?",
    [num('a','A',0,15,2),num('b','B',0,15,4)],({a,b})=>[
      passo('Allineamento','Scrivi gli operandi su quattro posizioni.', ['A',bin(a,4)],['B',bin(b,4)]),
      passo('AND bit a bit','Una posizione sopravvive quando entrambi i bit sono uno.', ['Bit risultanti',bin(a&b,4)],['A & B',a&b]),
      passo('AND logico',a?'La verità del secondo operando determina l’esito.':'Il primo operando è falso e il secondo viene saltato.', ['A vero',si(a)],['B valutato',si(a)],['A && B',Number(Boolean(a&&b))])]);

  unita('1.5.4',
    "Quale ordine di arrivo dei due segnali produce un impulso basso? Quanto dura?",
    [num('diretto','Ritardo del ramo diretto (ns)',1,10,2),num('inverso','Ritardo del ramo invertito (ns)',1,10,5)],({diretto,inverso})=>{
      const t=[...new Set([diretto,inverso])].sort((a,b)=>a-b);
      return [passo('Prima del fronte','A scende da 1 a 0 all’istante zero. I rami inizialmente conservano i valori precedenti.', ['Diretto',1],['Invertito',0],['F',1]),
        ...t.map(ns=>{const a=Number(ns<diretto),b=Number(ns>=inverso);return passo('Al tempo '+ns+' ns','Applica insieme tutti gli aggiornamenti che arrivano in questo istante.', ['Diretto',a],['Invertito',b],['F',a|b]);}),
        passo('Durata dell’impulso','Il livello basso richiede la discesa del ramo diretto prima della salita del ramo invertito.', ['Durata bassa',Math.max(0,inverso-diretto)+' ns'],['Uscita finale',1])];
    });

  unita('1.5.5',
    "Quali bit S e Cout rappresentano A + B + Cin?",
    [bit('a','A',1),bit('b','B',1),bit('c','Riporto entrante')],({a,b,c})=>{
      const p=a^b,s=p^c,k=(a&b)|(p&c);
      return [passo('Prima coppia','Calcola propagazione e generazione del riporto.', ['P = A XOR B',p],['G = A AND B',a&b]),
        passo('Riporto entrante','La somma è P XOR Cin e il riporto uscente è G OR (P AND Cin).', ['S',s],['Cout',k]),
        passo('Verifica aritmetica','Il riporto occupa la posizione di peso due.', ['A + B + Cin',a+b+c],['S + 2 × Cout',s+2*k])];
    });

  unita('1.5.6',
    "Il registro contiene tutti i bit richiesti? Quali posizioni decidono l’esito?",
    [num('stato','Registro di stato',0,255,5),num('maschera','Maschera richiesta',0,255,12)],({stato,maschera})=>{
      const x=stato&maschera;
      return [passo('Posizioni','Allinea stato e maschera a otto bit.', ['Stato',bin(stato)],['Maschera',bin(maschera)]),
        passo('Intersezione','Le posizioni a zero nella maschera vengono oscurate.', ['Stato & maschera',bin(x)],['Bit richiesti presenti',bin(x).split('1').length-1]),
        passo('Verifica','I bit richiesti assenti si ricavano come maschera XOR intersezione.', ['Bit mancanti',bin(maschera^x)],['Tutti presenti',si(x===maschera)])];
    });

  // 1.6 — Frazioni binarie e IEEE 754
  const f32 = new DataView(new ArrayBuffer(4));
  function floatWord(value){ f32.setFloat32(0,value); return f32.getUint32(0); }
  function wordFloat(word){ f32.setUint32(0,word); return f32.getFloat32(0); }
  unita('1.6.1',
    "Quali tre cifre binarie rappresentano la frazione scelta?",
    [num('n','Numeratore su otto',0,7,5)],({n})=>{
      let resto=n,s='';
      const passi=[passo('Frazione iniziale','Conserva il resto in ottavi per lavorare con interi esatti.', ['Frazione',n+'/8'],['Decimale',dec(n/8)])];
      for(let i=1;i<=3;i++){const doppio=resto*2,c=Math.floor(doppio/8);resto=doppio%8;s+=c;passi.push(passo('Posizione '+i,'Raddoppia il resto, preleva la cifra intera e conserva il nuovo resto.', ['Doppio',doppio+'/8'],['Cifra',c],['Resto',resto+'/8']));}
      return [...passi,passo('Ricostruzione','Somma i pesi delle posizioni attive.', ['Scrittura binaria','0,'+s],['Pesi',s.split('').flatMap((c,i)=>c==='1'?['1/'+2**(i+1)]:[]).join(' + ')||'0'])];
    });

  unita('1.6.2',
    "A quale classe appartiene la parola e quale regola ne determina il valore?",
    [scelta('word','Parola esadecimale',['3F800000','C0200000','00000001','80000000','7F800000','7FC00000'])],({word})=>{
      const w=parseInt(word,16),s=w>>>31,e=(w>>>23)&255,f=w&0x7fffff;
      const classe=e===255?(f?'NaN':'infinito'):e===0?(f?'subnormale':'zero'):'normale',v=wordFloat(w);
      return [passo('Campi','Separa segno, esponente codificato e frazione.', ['S',s],['E',e],['F',f]),
        passo('Regola di lettura',e===255?'E vale 255. Una frazione nulla indica infinito e una frazione diversa da zero identifica NaN.':e===0?'La significanda vale F / 2²³. Il fattore di scala è 2⁻¹²⁶.':'La significanda vale 1 + F / 2²³. Il fattore di scala è 2^(E − 127).', ['Classe',classe],['Bit frazione',bin(f,23)]),
        passo('Valore',e===255?(f?'La frazione diversa da zero identifica un NaN.':'La frazione nulla identifica un infinito. Il bit S ne determina il segno.'):e===0&&f===0?'La frazione nulla rappresenta zero. Il bit S distingue +0 e −0.':'Il fattore di segno vale '+(s?'−1':'+1')+'. Moltiplicalo per la significanda '+dec((e?1:0)+f/2**23)+' e per 2^('+(e?e-127:-126)+').', ['Parola','0x'+word],['Risultato',Number.isNaN(v)?'NaN':Object.is(v,-0)?'−0':v===Infinity?'+∞':dec(v)])];
    });

  unita('1.6.3',
    "Quanto dista da 2ᵉ il suo successore in binary32?",
    [num('e','Esponente della potenza di due',-6,24,0)],({e})=>{
      const x=2**e,w=floatWord(x),succ=wordFloat(w+1);
      return [passo('Punto di partenza','Scrivi 1 × 2^e in binary32.', ['Valore',dec(x)],['Parola','0x'+hex(w,8)]),
        passo('Successore','Per queste parole positive basta incrementare di uno la configurazione binaria.', ['Parola successiva','0x'+hex(w+1,8)],['Successore',dec(succ)]),
        passo('Distanza','Sottrai il punto di partenza e confronta con il peso dell’ultimo bit.', ['Esponente del passo',e-23],['Distanza',dec(succ-x)])];
    });

  unita('1.6.4',
    "Per quali valori di k l’addizione cambia il valore binary32 memorizzato?",
    [num('k','Differenza tra gli esponenti',0,26,2)],({k})=>{
      const b=2**(-k),exact=1+b,r=Math.fround(exact);
      return [passo('Operandi normalizzati','Le due significande iniziali valgono uno.', ['Primo','1 × 2^0'],['Secondo','1 × 2^'+(-k)]),
        passo('Allineamento','Con l’esponente comune zero il secondo contributo viene diviso per 2^k.', ['Spostamento',k+' posizioni'],['Contributo',dec(b)],['Somma esatta',dec(exact)]),
        passo('Risultato binary32',k===24?'La somma cade a metà fra 1 e il suo successore. L’arrotondamento sceglie 1 perché la sua significanda intera termina con zero.':k>24?'La somma si trova più vicina a 1 che al suo successore.':k===0?'La somma vale due e richiede una rinormalizzazione con esponente uno.':'Il bit del secondo termine rientra nella precisione disponibile.', ['Risultato',dec(r)],['Parola','0x'+hex(floatWord(r),8)])];
    });

  // 1.7 — Codec TLM1, limiti di memoria e politiche di accesso
  const firma = [0x54,0x4C,0x4D,0x31];
  function codificaTlm(nome, flags, temperatura, tensione){
    const raw=encoder.encode(nome);
    const data=new Uint8Array(12+raw.length);
    const v=new DataView(data.buffer);
    data.set(firma); data[4]=flags; data[5]=raw.length; data.set(raw,6);
    v.setInt16(6+raw.length,temperatura,false); v.setFloat32(8+raw.length,tensione,true);
    return data;
  }
  function leggiTlm(data){
    const stop=errore=>({errore});
    if(data.length<6) return stop('Prefisso troncato');
    if(!firma.every((x,i)=>x===data[i])) return stop('Firma errata');
    const n=data[5], flags=data[4];
    if(n>16) return stop('Nome oltre il limite di 16 byte');
    if(data.length!==12+n) return stop(data.length<12+n?'Record troncato':'Byte in eccesso');
    if(flags&0xFC) return stop('Bit riservati attivi');
    const raw=data.slice(6,6+n);
    if(raw.includes(0)) return stop('Nome contenente NUL');
    let nome;
    try { nome=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(raw); }
    catch { return stop('Nome UTF-8 malformato'); }
    const v=new DataView(data.buffer,data.byteOffset,data.byteLength);
    const temperatura=v.getInt16(6+n,false),tensione=v.getFloat32(8+n,true);
    if(!Number.isFinite(tensione)||tensione<0) return stop('Tensione fuori dominio');
    return {nome,flags,temperatura,tensione};
  }
  unita('1.7.1',
    "Qual è il primo campo che il lettore trova incompleto?",
    [num('n','Byte disponibili del record',0,15,14)],({n})=>{
      const data=codificaTlm('Aè',3,-123,10).slice(0,n), campi=[['firma',4],['flag',1],['lunghezza del nome',1],['nome UTF-8',3],['temperatura',2],['tensione',4]];
      let pos=0,errore='';
      const t=[passo('Ricezione','Il trasporto consegna un prefisso del record campione.', ['Byte disponibili',n],['Buffer',bytes(data)||'vuoto'])];
      for(const [campo,dim] of campi) {
        if(n-pos<dim){errore=campo;t.push(passo('Arresto sul campo '+campo,'Il campo richiede più byte di quelli disponibili.', ['Cursore',pos],['Richiesti',dim],['Residui',n-pos]));break;}
        t.push(passo('Lettura del campo '+campo,'L’intervallo del campo è interamente presente.', ['Offset',pos],['Byte',bytes(data.slice(pos,pos+dim))],['Cursore successivo',pos+dim]));pos+=dim;
      }
      return [...t,passo('Esito strutturale',errore?'Il lettore richiede i byte mancanti prima di interpretare il campo.':'Tutti i campi del record sono presenti.', ['Esito',errore?'troncamento in '+errore:'completo'],['Cursore finale',pos])];
    });

  unita('1.7.2',
    "A quali offset iniziano temperatura e tensione quando cambia il nome?",
    [scelta('nome','Nome del sensore',['Z','Aè','€']),num('temp','Temperatura in centesimi di °C',-250,250,100),scelta('volt','Tensione in V',['1','0.5','10','0'])],({nome,temp,volt})=>{
      const a=codificaTlm(nome,1,temp,Number(volt)), n=a[5],v=leggiTlm(a);
      return [passo('Prefisso e nome','Il bit 0 indica misura valida. La lunghezza conta gli ottetti della codifica UTF-8.', ['Firma e prefisso',bytes(a.slice(0,6))],['Nome',bytes(a.slice(6,6+n))],['Lunghezza del nome',n]),
        passo('Campo temperatura','Il byte più significativo è il primo. Dividi il valore con segno per cento.', ['Offset',6+n],['Byte',bytes(a.slice(6+n,8+n))],['Temperatura',dec(v.temperatura/100)+' °C']),
        passo('Campo tensione','I quattro byte partono dal meno significativo. La parola di 32 bit così ricostruita si interpreta come numero in virgola mobile.', ['Offset',8+n],['Byte',bytes(a.slice(8+n))],['Tensione',dec(v.tensione)+' V'])];
    });

  unita('1.7.3',
    "L’immagine scelta rientra nel limite a 32 bit e nel budget di memoria?",
    [scelta('w','Larghezza in pixel',['65536','2048','128']),scelta('h','Altezza in pixel',['65536','2048','128']),scelta('mib','Budget MiB',['64','8','2'])],({w,h,mib})=>{
      const px=BigInt(w)*BigInt(h),n=4n*px,b=BigInt(mib)*1048576n,m=4294967295n;
      return [passo('Geometria','Moltiplica in aritmetica estesa per preservare tutti i bit.', ['Pixel',px],['Bit necessari per contare i pixel',px.toString(2).length]),
        passo('Spazio','Ogni pixel richiede quattro canali consecutivi.', ['Byte esatti',n],['Byte modulo 2³²',n%4294967296n]),
        passo('Controlli','Confronta il valore esatto con il massimo del tipo e con i byte disponibili.', ['Rappresentabile su 32 bit',si(n<=m)],['Budget in byte',b],['Allocazione consentita',si(n<=m&&n<=b)])];
    });

  unita('1.7.4',
    "Quale controllo concede o rifiuta la modifica per la parola ricevuta?",
    [bit('w','Scrittura W',1),bit('o','Proprietario O'),bit('a','Amministratore A',1),bit('r','Bit riservato 7')],({w,o,a,r=0})=>{
      const parola=(w<<1)|(o<<3)|(a<<4)|(r<<7);
      const riservati=parola&0xE0, ruolo=o|a, politica=w&ruolo;
      const ammessa=riservati===0&&politica===1;
      return [passo('Parola ricevuta','Nel modello i bit 0 e 2 restano a zero. Leggi W, O e A dalle posizioni specificate.', ['Byte','0x'+hex(parola)],['Bit',bin(parola)],['W',w],['O',o],['A',a]),
        passo('Validità','La maschera 0xE0 seleziona i bit 5, 6 e 7. Un’intersezione diversa da zero rende la parola invalida.', ['Byte AND 0xE0','0x'+hex(riservati)],['Parola valida',si(riservati===0)]),
        passo('Ruolo e permesso','O OR A vale uno se è presente almeno uno dei due ruoli. La congiunzione richiede anche W.', ['O OR A',ruolo],['W AND (O OR A)',politica]),
        passo('Decisione',riservati?'La parola contiene un bit riservato attivo. Il controllo di validità rifiuta la richiesta.':!w?'La parola è valida. Manca il permesso di scrittura.':!ruolo?'La parola è valida. Il richiedente deve essere proprietario o amministratore.':'La parola è valida e il permesso e il ruolo richiesti sono presenti.', ['Modifica',ammessa?'consentita':'negata'])];
    });

  unita('1.7.5',
    "Per quali quote compare uno scarto fra somma ripetuta e conversione del totale intero?",
    [num('quota','Centesimi per quota',1,50,10),num('n','Numero di quote',1,12,10)],({quota,n})=>{
      const q=quota/100;let totale=0;
      const traccia=[passo('Quota','In euro si divide il numero intero di centesimi per cento.', ['Quota intera',quota+' cent'],['Quota binary64',q.toPrecision(17)+' €'])];
      for(let i=1;i<=n;i++){totale+=q;traccia.push(passo('Addizione '+i,'Aggiungi una quota a ciascun accumulatore.', ['Totale intero',i*quota+' cent'],['Totale binary64',totale.toPrecision(17)+' €']));}
      return [...traccia,passo('Confronto','Il riferimento per il confronto è il totale intero convertito in euro con una sola divisione binary64.', ['Totale monetario',dec((n*quota/100).toFixed(2))+' €'],['Differenza tra i due binary64',(totale-n*quota/100).toExponential(4)+' €'])];
    });

  unita('1.7.6',
    "Il lettore riceve una firma, incontra la fine del file oppure rimane escluso dall’avvio?",
    [scelta('file','Ingresso di leggi < file',[['valido','Record TLM1'],['errato','Firma XLM1'],['vuoto','File vuoto'],['manca','File inesistente']])],({file})=>{
      const a=file==='valido'?firma:file==='errato'?[0x58,...firma.slice(1)]:[];
      return [passo('Redirezione','La shell tenta l’apertura in lettura prima di execve.', ['File',file],['Apertura',file==='manca'?'ENOENT':'riuscita']),
        passo('Descrittore',file==='manca'?'L’apertura fallita arresta l’avvio.':'La shell collega il file a fd 0 e avvia il lettore.', ['Programma avviato',si(file!=='manca')],['FD 0 del lettore',file==='manca'?'nessun processo':'file di ingresso']),
        passo(file==='manca'?'Diagnosi prima dell’avvio':'Lettura della firma',file==='manca'?'La shell segnala l’errore al chiamante.':a.length?'Il lettore acquisisce quattro byte e li confronta con TLM1.':'La lettura restituisce zero byte alla fine del file.', ['Primo byte',a.length?'0x'+hex(a[0]):'assente'],['Esito',file==='valido'?'firma accettata':file==='errato'?'firma diversa':file==='vuoto'?'prefisso troncato':'errore di apertura'])];
    });

  unita('1.7.7',
    "Il lettore riesce a recuperare tutti i campi? Quale controllo rileva il guasto selezionato?",
    [scelta('nome','Nome',['Aè','Z','€']),scelta('guasto','Copia da verificare',[['ok','Integra'],['taglio','Ultimo byte mancante'],['flags','Bit 7 dei flag attivo'],['testo','Byte UTF-8 illecito'],['extra','Byte in coda'],['volt','Tensione negativa']])],({nome,guasto})=>{
      const originale=codificaTlm(nome,3,-123,10);let a=originale.slice();
      if(guasto==='taglio')a=a.slice(0,-1);
      if(guasto==='flags')a[4]|=128;
      if(guasto==='testo')a[6]=255;
      if(guasto==='extra')a=Uint8Array.from([...a,0]);
      if(guasto==='volt')new DataView(a.buffer).setFloat32(8+a[5],-10,true);
      const r=leggiTlm(a);
      return [passo('Codifica','Costruisci il record da nome, flag 3, temperatura −1,23 °C e tensione 10 V.', ['Nome',nome],['Originale',bytes(originale)]),
        passo('Banco di prova','Il buffer passato al decodificatore contiene esattamente i byte mostrati.', ['Copia',bytes(a)],['Dimensione',a.length]),
        passo('Decodifica',r.errore?'Il primo controllo fallito interrompe il riconoscimento del record.':'I campi riletti coincidono con i valori immessi.', ...(r.errore?[['Esito',r.errore]]:[['Nome',r.nome],['Flag',r.flags],['Temperatura',dec(r.temperatura/100)+' °C'],['Tensione',r.tensione+' V']]))];
    });

  // Le previsioni seguono il fenomeno studiato, anche quando l'ultimo dato della
  // traccia è un controllo di integrità o ripete un valore immesso dall'utente.
  function dato(stati, indice, etichetta) {
    return Object.fromEntries(stati.at(indice).valori)[etichetta];
  }
  function previsione(id, label, valore, formato) {
    SL.unita[id].previsione = {label, valore, ...(formato ? {formato} : {})};
  }
  previsione('1.1.1','Byte inviati a write, compreso LF',(_,s)=>dato(s,1,'Lunghezza'));
  previsione('1.1.5','PID restituito da waitpid',(_,s)=>dato(s,-1,'PID raccolto'));
  previsione('1.2.2','Valore senza segno, in decimale',(_,s)=>dato(s,1,'Peso'));
  previsione('1.3.1','Codice ASCII della cifra, in decimale',(_,s)=>dato(s,1,'Intero'));
  previsione('1.3.2','Punto di codice in forma U+…',(_,s)=>dato(s,-1,'Punto di codice'));
  previsione('1.3.3','Byte in un secondo di registrazione',(_,s)=>Number.parseInt(dato(s,-1,'Dimensione'),10));
  previsione('1.3.5','Intero ottenuto oppure «indisponibile»',(_,s)=>dato(s,-1,'Intero'));
  previsione('1.4.2','Flag OF (0 oppure 1)',(_,s)=>dato(s,-1,'OF'));
  previsione('1.4.3','Esito del confronto in C (0 oppure 1)',(_,s)=>dato(s,-1,'Esito C'));
  previsione('1.4.4','Il prodotto entra nel byte? (sì/no)',(_,s)=>dato(s,1,'Prodotto ammesso'));
  previsione('1.5.4','Durata dell’impulso basso in ns (0 se assente)',(_,s)=>Number.parseInt(dato(s,-1,'Durata bassa'),10));
  previsione('1.5.5','Riporto uscente Cout (0 oppure 1)',(_,s)=>dato(s,1,'Cout'));
  previsione('1.6.1','Tre cifre binarie dopo la virgola',(_,s)=>dato(s,-1,'Scrittura binaria').slice(2),'bits');
  previsione('1.6.3','Esponente del passo, nella forma 2 elevato a questo intero',(_,s)=>dato(s,-1,'Esponente del passo'));
  previsione('1.6.4','Il risultato binary32 è diverso da 1? (sì/no)',(_,s)=>si(dato(s,-1,'Parola')!=='0x3F800000'));
  previsione('1.7.1','Primo campo incompleto oppure «completo»',(_,s)=>dato(s,-1,'Esito').replace(/^troncamento in /,''));
  previsione('1.7.2','Offset del primo byte della temperatura',(_,s)=>dato(s,1,'Offset'));
  previsione('1.7.5','I due totali in euro coincidono in binary64? (sì/no)',(_,s)=>si(Number.parseFloat(dato(s,-1,'Differenza tra i due binary64'))===0));
  previsione('1.7.7','La copia supera tutti i controlli? (sì/no)',(_,s)=>si(dato(s,-1,'Esito')===undefined));

  // Esercitazioni. Ogni istanza include indizi per campo e passaggi risolutivi.
  function numero(label, answer, hint){ return {label,answer:String(answer),numeric:true,hint}; }
  function opzione(label, choices, answer, hint){ return {label,choices,answer,hint}; }
  function variante(consegna,campi,svolgimento,codice){
    return codice?{consegna,campi,svolgimento,codice}:{consegna,campi,svolgimento};
  }
  function prova(unita,attivita,titolo,principio,...varianti){
    const capitolo=unita.split('.').slice(0,2).join('.');
    (SL.prove[capitolo] ||= []).push({titolo,unita,attivita,principio,varianti});
  }

  // Capitolo 1.1
  prova('1.1.1','lez01_01_layers_order','Dalla richiesta al dispositivo',
    "La libreria standard C offre funzioni di ingresso e uscita, abbreviate I/O, fra cui fread per leggere da un flusso e puts per scrivere testo seguito da un fine riga. Un flusso è la risorsa di lettura o scrittura gestita dalla libreria; il suo buffer è una zona di memoria che raccoglie temporaneamente i byte. Il kernel, parte del sistema operativo che controlla le risorse, verifica il descrittore, cioè il numero con cui il processo identifica una risorsa aperta. Può trasferire dati già presenti nella propria cache, la memoria che conserva copie di dati letti in precedenza. Il flusso di uscita standard stdout usa qui il descrittore 1; LF indica il byte di fine riga, di valore esadecimale 0A.",
    variante('Un lettore C usa fread per riempire un buffer vuoto da un file locale. I dati sono già nella cache del kernel. Chi offre fread e chi controlla il descrittore?',
      [opzione('Chi offre fread?',['libreria C','kernel','controller del disco'],'libreria C','Una funzione della libreria standard può a sua volta richiedere al kernel una lettura.'),
        opzione('Chi controlla il descrittore?',['libreria C','kernel','compilatore'],'kernel','Il descrittore appartiene alle risorse aperte del processo.')],
      ['Il lettore chiama fread, che appartiene alla libreria standard C.','Per riempire il proprio buffer, la libreria può richiedere una lettura al kernel attraverso il descrittore.','Il kernel verifica il descrittore e può servire i byte dalla cache. La libreria li rende disponibili al chiamante.']),
    variante('Un programma esegue puts("OK") e svuota il flusso stdout diretto su un terminale. Chi aggiunge LF e quale descrittore riceve i byte?',
      [opzione('Chi aggiunge LF?',['libreria C','driver della tastiera','CPU durante la compilazione'],'libreria C','Considera il contratto di puts.'),numero('Numero del descrittore',1,'I descrittori standard sono ordinati come ingresso, uscita, errore.')],
      ['puts riceve i due caratteri di OK e aggiunge il carattere di fine riga LF.','La libreria consegna 4F 4B 0A al sistema attraverso stdout.','Nel processo considerato, il flusso stdout usa il descrittore 1, collegato al terminale.']));

  prova("1.1.2", "lez01_02_hardware_roles", "Seguire una lettura dalla memoria",
    "Un indirizzo individua una cella contando i byte dalla base. Celle diverse possono contenere lo stesso dato. Per ricavare l’origine di una lettura dal valore restituito occorre quindi controllare tutte le corrispondenze e gli eventuali vincoli sullo spostamento.",
    variante(
      "La CPU legge un byte alla base 0x1200 più 2. Le celle a indirizzi crescenti contengono 08 0E 61 2A in esadecimale. Determina indirizzo e dato.",
      [
        numero("Indirizzo finale", "4610", "Lo spostamento è in byte."),
        numero("Valore del dato in decimale", "97", "Conta le celle dalla posizione zero e converti le due cifre esadecimali.")
      ],
      [
        "L’unità di indirizzamento somma 0x1200 e 2 e produce 0x1202.",
        "La memoria seleziona la cella con indice 2 nella sequenza e restituisce 0x61.",
        "L’espansione posizionale dà 6 × 16 + 1 = 97. Il registro riceve questo valore."
      ]
    ),
    {
      consegna: "La memoria contiene 2A 55 2A 61 alle posizioni da 0x1200 a 0x1203. Una lettura dalla base 0x1200 restituisce 0x2A. Prima ricostruisci tutte le celle compatibili. Dopo aver appreso che lo spostamento era positivo, identifica quello usato dalla CPU.",
      campi: [
        numero("Celle compatibili con il solo dato", "2", "Cerca tutte le occorrenze del byte restituito."),
        numero("Spostamento positivo in byte", "2", "Sottrai la base dall’indirizzo compatibile che rimane.")
      ],
      svolgimento: [
        "Il byte 2A occupa le posizioni 0 e 2 nella sequenza che comincia alla base. Sono quindi compatibili 0x1200 e 0x1202.",
        "Gli spostamenti corrispondenti sono 0x1200 − 0x1200 = 0 e 0x1202 − 0x1200 = 2. Il valore letto, considerato da solo, ammette due origini.",
        "La condizione sullo spostamento esclude la posizione zero. Resta la cella 0x1202, che si raggiunge aggiungendo due byte alla base."
      ],
      quadro: [
        {"titolo": "Traccia della lettura", "celle": [["base", "0x1200"], ["byte ricevuto", "0x2A"]], "nota": "Agli indirizzi crescenti si leggono 2A 55 2A 61."},
        {"titolo": "Celle che contengono 2A", "celle": [["prima", "0x1200"], ["seconda", "0x1202"]], "nota": "Un dato può comparire in più celle."},
        {"titolo": "Distanze dalla base", "celle": [["0x1200", "0 byte"], ["0x1202", "2 byte"]], "nota": "Si sottrae la base da ciascun indirizzo.", "tipo": "confronto"},
        {"titolo": "Vincolo dello spostamento", "celle": [["ammesso", "2 byte"], ["origine", "0x1202"]], "nota": "Lo spostamento deve essere positivo."}
      ]
    }
  );

  prova("1.1.4", "lez01_03_special_paths", "Ricostruire un percorso",
    "La risoluzione di un percorso relativo parte dalla directory corrente. Un nome ordinario aggiunge un livello, «.» mantiene il livello corrente e «..» raggiunge il genitore.",
    variante(
      "La directory corrente è /home/lea/src. Considera ../dati/./a in un albero con directory esistenti e senza link simbolici. Scegli il percorso finale.",
      [
        opzione("Percorso assoluto", ["/home/lea/dati/a", "/home/lea/src/a", "/a"], "/home/lea/dati/a", "Ogni componente .. elimina un livello dalla directory raggiunta.")
      ],
      [
        "Il percorso è relativo e la ricerca parte da /home/lea/src.",
        "Attraversando le componenti prima del nome finale si arriva a /home/lea/dati. Il punto conserva la directory corrente.",
        "Si cerca a dentro /home/lea/dati e si ottiene /home/lea/dati/a."
      ]
    ),
    {
      consegna: "Un programma parte da /srv/corso/prove e deve aprire /srv/corso/dati/a con un percorso relativo. L’albero contiene queste directory e i suoi nomi ordinari, senza link simbolici. Scegli il percorso che raggiunge il file e conta le risalite che compie.",
      campi: [
        opzione("Percorso relativo", ["dati/a", "../dati/a", "../../dati/a"], "../dati/a", "Trova la directory comune più vicina alle due posizioni."),
        numero("Risalite con ..", "1", "Segui la strada da prove al genitore comune.")
      ],
      svolgimento: [
        "La directory comune più vicina è /srv/corso. Partendo da prove, il componente .. riporta esattamente a quel genitore.",
        "I componenti dati e a scendono poi nella directory richiesta e individuano il file. Da prove il percorso relativo è ../dati/a.",
        "dati/a comincerebbe cercando dati sotto prove. Con ../../dati/a si risalirebbe fino a /srv. La soluzione scelta compie invece una sola risalita."
      ],
      quadro: [
        {"titolo": "Due posizioni", "celle": [["partenza", "prove"], ["arrivo", "dati/a"]], "nota": "Entrambe le posizioni si trovano sotto /srv/corso.", "tipo": "confronto"},
        {"titolo": "Antenato comune", "celle": [["da", "prove"], ["con ..", "corso"]], "nota": "Una risalita conduce al genitore."},
        {"titolo": "Discesa verso il file", "celle": [["directory", "dati"], ["nome", "a"]], "nota": "Il percorso completo è ../dati/a.", "tipo": "sequenza"},
        {"titolo": "Controllo delle alternative", "celle": [["senza ..", "troppo in basso"], ["due ..", "troppo in alto"]], "nota": "La directory comune si raggiunge con una risalita."}
      ]
    }
  );

  prova("1.1.6", "lez01_04_filesystem_ops", "Interpretare gli effetti di una redirezione",
    "La shell stabilisce la destinazione di una redirezione prima di eseguire il comando. > tronca il file, mentre >> colloca i nuovi byte alla fine del contenuto esistente.",
    variante(
      "Il file dati contiene A e LF. Esegui printf 'B\\n' >> dati in una shell POSIX. Quanti byte restano e quale sequenza contengono?",
      [
        numero("Byte nel file", "4", "Il carattere di fine riga occupa un byte."),
        opzione("Sequenza esadecimale", ["41 0A", "42 0A", "41 0A 42 0A"], "41 0A 42 0A", "Verifica se l’apertura conserva il contenuto precedente.")
      ],
      [
        "Prima del comando i byte sono 41 0A.",
        "La redirezione >> colloca la scrittura in coda. printf produce 42 0A.",
        "I byte finali sono 41 0A 42 0A, quindi la lunghezza è 4."
      ]
    ),
    {
      consegna: "Prima del comando un file contiene i byte 41 0A. Un verbale riporta che printf ha emesso soltanto B seguito da un fine riga e che il file finale contiene 42 0A. Tra le due redirezioni > e >>, quale spiega l’osservazione? Quanti byte iniziali sono stati eliminati all’apertura?",
      campi: [
        opzione("Redirezione compatibile", [">", ">>"], ">", "Confronta il primo byte iniziale con il primo byte finale."),
        numero("Byte eliminati all’apertura", "2", "Conta gli ottetti presenti prima della scrittura.")
      ],
      svolgimento: [
        "La nuova uscita occupa due byte, 42 per B e 0A per il fine riga. L’osservazione finale coincide con la sola nuova uscita.",
        "Con >> i due byte originari sarebbero rimasti davanti ai nuovi, formando 41 0A 42 0A. Questa sequenza sarebbe lunga quattro byte.",
        "La redirezione > apre il file con troncamento. I due byte originari vengono eliminati all’apertura, poi printf scrive i due byte osservati."
      ],
      quadro: [
        {"titolo": "Reperto", "celle": [["prima", "41 0A"], ["dopo", "42 0A"]], "nota": "Il comando ha emesso B seguito da LF."},
        {"titolo": "Uscita emessa", "celle": [["B", "42"], ["LF", "0A"]], "nota": "Due ottetti formano l’intera nuova uscita."},
        {"titolo": "Ipotesi append", "celle": [["precedenti", "41 0A"], ["aggiunti", "42 0A"]], "nota": "In coda si otterrebbero quattro byte."},
        {"titolo": "Ipotesi verificata", "celle": [["operatore", ">"], ["rimossi", "2 byte"]], "nota": "La scrittura riparte dal file troncato."}
      ]
    }
  );

  prova("1.1.3", "lez01_05_build_pipeline", "Localizzare una fase di costruzione",
    "Il sorgente è il testo del programma C. Una dichiarazione descrive il nome della funzione, gli argomenti e il risultato che restituisce; la definizione ne contiene anche il corpo da eseguire. Un header raccoglie dichiarazioni e altre informazioni che il preprocessore può includere nel sorgente. Il compilatore può tradurre una chiamata conoscendo la dichiarazione, producendo istruzioni assembly; l’assemblatore le codifica in un file oggetto. Il collegatore unisce gli oggetti e cerca le definizioni necessarie per costruire l’eseguibile. Con GCC l’opzione -S arresta la costruzione al testo assembly, mentre -c produce l’oggetto.",
    variante(
      "hello.c chiama una funzione dichiarata in un header. gcc -c hello.c riesce e produce hello.o. Durante la creazione dell’eseguibile compare «undefined reference» per quella funzione.",
      [
        opzione("Fase che segnala il problema", ["preelaborazione", "assemblaggio", "collegamento"], "collegamento", "L’oggetto contiene ancora riferimenti a simboli esterni."),
        opzione("Azione pertinente", ["aggiungere l’oggetto che definisce la funzione", "cambiare il PID", "rinominare il file .o in .c"], "aggiungere l’oggetto che definisce la funzione", "La dichiarazione specifica il tipo della funzione. La definizione ne fornisce il corpo.")
      ],
      [
        "Il compilatore conosce la firma dalla dichiarazione e può produrre codice per la chiamata.",
        "L’assemblatore crea un oggetto che conserva il riferimento esterno.",
        "Il collegatore cerca una definizione. Fornire l’oggetto o la libreria corretti risolve il simbolo."
      ]
    ),
    variante(
      "Esegui gcc -S hello.c. Individua il file prodotto e la fase che potrebbe usarlo per costruire un oggetto. Ordina poi le tre fasi necessarie per passare dal sorgente C al file oggetto, includendo anche quella che il comando ha lasciato da eseguire.",
      [
        opzione("File prodotto", ["hello.i", "hello.s", "hello.o"], "hello.s", "L’opzione -S arresta la catena alla forma assembly."),
        opzione("Fase successiva", ["preelaborazione", "assemblaggio", "collegamento"], "assemblaggio", "Un oggetto contiene istruzioni già codificate."),
        {"label": "Dal sorgente C al file oggetto", "ordine": ["preelaborazione", "compilazione", "assemblaggio"], "answer": "preelaborazione → compilazione → assemblaggio", "numeric": false, "hint": "Le direttive vengono espanse prima di tradurre il testo in assembly. L’assemblatore usa il prodotto di tale traduzione."}
      ],
      [
        "Il preprocessore espande le direttive di hello.c.",
        "La compilazione traduce il sorgente in istruzioni assembly e conserva hello.s.",
        "L’assemblatore può leggere hello.s e codificare le istruzioni in hello.o."
      ]
    )
  );

  // Capitolo 1.2
  prova("1.2.1", "lez02_01_voltage_to_bits", "Da segnali fisici a capacità binaria",
    "Una misura garantisce un bit quando rientra nella fascia bassa o in quella alta del ricevitore. Con n bit indipendenti si formano 2ⁿ configurazioni. Il valore di una configurazione dipende dall’ordine dei suoi bit.",
    variante(
      "Il livello basso è garantito fino a 800 mV e quello alto da 2000 mV. Dal bit più significativo al meno significativo misuri 400, 2250, 700 mV. Ricava valore e capacità della parola.",
      [
        numero("Valore senza segno", "2", "Tratta ogni tensione come un bit e somma i pesi attivi."),
        numero("Configurazioni possibili", "8", "Ogni linea indipendente raddoppia il numero di configurazioni.")
      ],
      [
        "I confronti con le soglie danno, nell’ordine, 010.",
        "I pesi da sinistra sono 4, 2, 1. Le posizioni a uno sommano a 2.",
        "Con 3 linee hai 2^3 = 8 configurazioni, incluso lo zero."
      ]
    ),
    {
      consegna: "Il ricevitore garantisce 0 fino a 800 mV e 1 da 2000 mV. Su tre linee, dalla più significativa, misuri 2100, 1300 e 500 mV. Senza attribuire una soglia aggiuntiva al circuito, quanti valori interi sono compatibili e quali sono?",
      campi: [
        numero("Numero di valori compatibili", "2", "Ogni linea indeterminata lascia due possibilità."),
        opzione("Valori compatibili", ["2 e 3", "4 e 6", "4 e 5"], "4 e 6", "Identifica il peso della linea compresa fra le soglie.")
      ],
      svolgimento: [
        "La prima linea è alta e l’ultima è bassa. La tensione centrale cade fra 800 e 2000 mV, dove il ricevitore lascia indeterminato il livello logico.",
        "Il codice ha perciò forma 1?0. La linea dubbia ha peso due, mentre quella alta ha peso quattro.",
        "Le due parole compatibili sono 100 e 110, che valgono rispettivamente 4 e 6. La capacità nominale del gruppo di linee è otto parole. Questa osservazione ne lascia possibili soltanto due."
      ],
      quadro: [
        {"titolo": "Tre misure", "celle": [["bit 2", "2100 mV"], ["bit 1", "1300 mV"], ["bit 0", "500 mV"]], "nota": "Le fasce garantite terminano a 800 e iniziano a 2000 mV."},
        {"titolo": "Confronto con le soglie", "celle": [["bit 2", "1"], ["bit 1", "?"], ["bit 0", "0"]], "nota": "La misura centrale è nella fascia intermedia.", "tipo": "sequenza"},
        {"titolo": "Peso del segnale dubbio", "celle": [["peso alto", "4"], ["peso centrale", "2"]], "nota": "La parola può valere 4 oppure 4 + 2."},
        {"titolo": "Possibilità residue", "celle": [["100", "4"], ["110", "6"]], "nota": "Due valori sono compatibili con la stessa misura.", "tipo": "confronto"}
      ]
    }
  );

  prova("1.2.2", "lez02_02_dec_to_bin", "Scomporre un intero in potenze di due",
    "Un intero positivo è la somma dei pesi delle sue posizioni binarie a uno. La potenza di due più grande compresa nel numero identifica il bit più significativo.",
    variante(
      "Converti 45 in binario senza zeri iniziali. Indica indice del bit più alto, numero di bit attivi e parola.",
      [
        numero("Indice del bit più alto", "5", "Cerca la massima potenza di due minore o uguale al numero."),
        numero("Bit a uno", "4", "Conta gli addendi della scomposizione."),
        opzione("Parola", ["101101", "101110", "101111"], "101101", "Confronta ciascun peso con il resto.")
      ],
      [
        "Il primo peso utile è 32, cioè 2^5.",
        "Le sottrazioni successive individuano 32 + 8 + 4 + 1 = 45.",
        "Scrivendo uno in quelle posizioni si legge 101101. Conta 4 cifre uno."
      ]
    ),
    {
      consegna: "Il valore richiesto per un registro era 73. Nella lettura di controllo compare 01001101, cioè 77. Si sa che un solo bit è stato trascritto male. Individua il suo indice contando da destra a partire da zero e indica la correzione richiesta.",
      campi: [
        numero("Indice del bit da correggere", "2", "La differenza tra i due numeri è il peso del bit in eccesso."),
        opzione("Correzione", ["da 1 a 0", "da 0 a 1"], "da 1 a 0", "Il numero osservato è maggiore di quello atteso.")
      ],
      svolgimento: [
        "La differenza 77 − 73 vale 4. Poiché è cambiata una sola cifra binaria, il suo peso deve essere 4 = 2².",
        "Il bit di indice 2 vale uno in 01001101. Per diminuire di quattro il valore del registro occorre portarlo a zero.",
        "Il codice corretto è 01001001. I bit rimasti a uno pesano 64, 8 e 1, la cui somma restituisce 73."
      ],
      quadro: [
        {"titolo": "Controllo del registro", "celle": [["atteso", "73"], ["osservato", "01001101"]], "nota": "L’errore riguarda un solo bit."},
        {"titolo": "Differenza numerica", "celle": [["osservato", "77"], ["eccesso", "4"]], "nota": "La differenza individua il peso alterato."},
        {"titolo": "Posizione", "celle": [["peso", "2²"], ["indice", "2"]], "nota": "Il bit in eccesso va da uno a zero."},
        {"titolo": "Lettura dopo la correzione", "celle": [["parola", "01001001"], ["somma", "64 + 8 + 1"]], "nota": "Il registro torna a valere 73.", "tipo": "confronto"}
      ]
    }
  );

  prova("1.2.2", "lez02_03_bin_to_hex", "Raggruppare i bit in cifre esadecimali",
    "Ogni cifra esadecimale codifica quattro bit. Per conservare i pesi si formano i gruppi partendo dal lato meno significativo e si completa con zeri soltanto il gruppo più a sinistra.",
    variante(
      "Converti la parola binaria 10110110 in esadecimale. Ogni gruppo completo ha quattro bit.",
      [
        numero("Gruppi necessari", "2", "Parti dal lato meno significativo."),
        opzione("Scrittura esadecimale", ["B6", "C6", "B5"], "B6", "Una cifra esadecimale rappresenta un valore da zero a quindici.")
      ],
      [
        "Aggiungi eventuali zeri sul lato sinistro e separa 1011 | 0110.",
        "I gruppi valgono 11, 6 in decimale.",
        "Le cifre corrispondenti formano 0xB6. La conversione ha richiesto 2 gruppi."
      ]
    ),
    {
      consegna: "Uno studente converte 101101 in esadecimale raggruppando 1011 e 01 e aggiungendo due zeri a destra. Ottiene B4. Individua il lato da completare per conservare il valore e scegli la conversione corretta.",
      campi: [
        opzione("Lato del riempimento", ["sinistro", "destro"], "sinistro", "Il bit più a destra deve conservare il peso uno."),
        opzione("Esadecimale corretto", ["2D", "B4", "D2"], "2D", "Forma i gruppi di quattro a partire dalle unità.")
      ],
      svolgimento: [
        "Aggiungendo due zeri a destra si forma 10110100. Ogni bit iniziale sale di due posizioni e il valore viene moltiplicato per quattro.",
        "Il gruppo incompleto è a sinistra quando si separano i gruppi partendo dal bit di peso uno. Il riempimento corretto dà 0010 1101.",
        "0010 vale 2 e 1101 vale 13, scritto D. La parola è 2D, il cui valore decimale è 2 × 16 + 13 = 45, pari a 32 + 8 + 4 + 1."
      ],
      quadro: [
        {"titolo": "Conversione da controllare", "celle": [["ingresso", "101101"], ["proposta", "B4"]], "nota": "Il valore della parola deve restare invariato."},
        {"titolo": "Riempimento a destra", "celle": [["ottenuto", "10110100"], ["effetto", "valore × 4"]], "nota": "Due zeri a destra spostano i pesi."},
        {"titolo": "Riempimento a sinistra", "celle": [["alto", "0010"], ["basso", "1101"]], "nota": "Si separano quattro bit partendo dalle unità."},
        {"titolo": "Verifica del valore", "celle": [["binario", "45"], ["0x2D", "45"]], "nota": "La conversione corretta conserva i pesi."}
      ]
    }
  );

  prova("1.2.3", "lez02_04_hex_to_dec", "Calcolare una distanza fra indirizzi",
    "Un indirizzo si può scrivere in esadecimale o in decimale. Sottraendo la base si trova la distanza in byte. Per una regione che contiene n byte gli spostamenti validi vanno da zero a n − 1.",
    variante(
      "Un buffer parte da 0x180 e una cella si trova a 0x1A6. Calcola l’indirizzo finale in decimale e lo spostamento in byte.",
      [
        numero("Indirizzo finale in decimale", "422", "Sviluppa le cifre secondo i pesi 256, 16 e 1."),
        numero("Spostamento", "38", "Sottrai l’indirizzo iniziale da quello finale.")
      ],
      [
        "La base 0x180 equivale a 384 in decimale.",
        "Il secondo indirizzo vale 1 × 256 + 10 × 16 + 6 = 422.",
        "Lo spostamento è 422 − 384 = 38 byte. Sommato alla base riconduce alla cella richiesta."
      ]
    ),
    {
      consegna: "Un buffer di 16 byte parte da 0x2F0. Una routine considera valido anche l’indirizzo 0x300 perché lo scarto dalla base è 16. Decidi se la lettura di un byte è ammessa e calcola l’ultimo indirizzo effettivamente leggibile.",
      campi: [
        opzione("Lettura a 0x300", ["nel buffer", "fuori dal buffer"], "fuori dal buffer", "Una regione di 16 byte ha come primo indice zero."),
        numero("Ultimo indirizzo leggibile", "767", "Somma alla base il massimo indice valido.")
      ],
      svolgimento: [
        "Sedici byte contano sedici posizioni consecutive, da zero a quindici. L’indirizzo iniziale è già quello del primo byte.",
        "0x300 − 0x2F0 = 0x10, cioè 16. L’indirizzo identifica il confine immediatamente successivo ai dati.",
        "Per raggiungere l’ultimo byte si aggiunge invece 15 alla base. Si ottiene 0x2FF, cioè 767 in decimale. La lettura a 0x300 oltrepassa il buffer."
      ],
      quadro: [
        {"titolo": "Controllo dei limiti", "celle": [["base", "0x2F0"], ["capacità", "16 byte"], ["richiesta", "0x300"]], "nota": "La richiesta riguarda un singolo byte.", "tipo": "confronto"},
        {"titolo": "Indici occupati", "celle": [["primo", "0"], ["ultimo", "15"]], "nota": "La base identifica già il primo byte."},
        {"titolo": "Distanza della richiesta", "celle": [["0x300 − 0x2F0", "16"]], "nota": "Lo scarto coincide con la capacità."},
        {"titolo": "Confine della regione", "celle": [["ultimo", "0x2FF"], ["successivo", "0x300"]], "nota": "Il byte in posizione 16 è esterno."}
      ]
    }
  );

  prova("1.2.4", "lez02_05_utf8_bytes_and_ascii", "Dimensionare un buffer per il testo",
    "In UTF-8 le lettere ASCII occupano un solo byte, mentre altri caratteri ne richiedono più di uno. La capacità di una stringa C deve comprendere anche il terminatore zero.",
    variante(
      "Memorizza «Aè» come stringa C in UTF-8. Conta i byte del testo e la capacità minima del buffer, terminatore compreso.",
      [
        numero("Byte del testo", "3", "La lettera ASCII occupa un byte. Controlla la lunghezza del carattere successivo."),
        numero("Capacità minima", "4", "Una stringa C richiede un byte finale pari a zero.")
      ],
      [
        "Il testo contiene 2 punti di codice. Il primo rientra in ASCII.",
        "La sequenza UTF-8 è 41 C3 A8 e occupa 3 byte.",
        "Si accoda 00 come terminatore. Il buffer richiede almeno 4 byte."
      ]
    ),
    {
      consegna: "Il testo «A€B» deve entrare, a partire dal primo carattere, in un buffer C di cinque byte. In UTF-8 le lettere A e B occupano un byte ciascuna ed € ne occupa tre. Qual è il prefisso più lungo che entra interamente, lasciando posto a NUL? Calcola la capacità minima per conservare tutto il testo.",
      campi: [
        opzione("Prefisso conservabile", ["A", "A€", "A€B"], "A€", "Riserva un byte al terminatore prima di contare il testo."),
        numero("Capacità per l’intero testo, in byte", "6", "Alla somma delle larghezze dei tre caratteri va aggiunto NUL.")
      ],
      svolgimento: [
        "Dei cinque posti disponibili, uno serve al byte zero finale. Il testo può quindi occuparne al massimo quattro.",
        "La codifica di A occupa un byte e quella di € ne occupa tre. A€ raggiunge esattamente quattro byte. Aggiungere B richiederebbe un quinto byte di testo oltre al terminatore.",
        "Il testo completo ha larghezza 1 + 3 + 1 = 5 byte. Per farne una stringa C servono 5 + 1 = 6 byte."
      ],
      quadro: [
        {"titolo": "Capacità del buffer", "celle": [["posti", "5"], ["testo", "A€B"]], "nota": "Ogni carattere deve entrare con tutti i suoi byte."},
        {"titolo": "Riserva per NUL", "celle": [["buffer", "5"], ["per il testo", "4"]], "nota": "L’ultimo posto va conservato per il terminatore."},
        {"titolo": "Prefisso completo", "celle": [["A", "1 byte"], ["€", "3 byte"]], "nota": "A€ occupa tutti i quattro posti disponibili per il testo."},
        {"titolo": "Capacità integrale", "celle": [["testo", "5 byte"], ["con NUL", "6 byte"]], "nota": "Il carattere B richiede un ulteriore posto."}
      ]
    }
  );

  // Capitolo 1.3
  prova("1.3.1", "lez03_01_same_bits_two_meanings", "Distinguere il codice ASCII dal valore della cifra",
    "La cifra scritta e il byte che la codifica rispondono a convenzioni diverse. In ASCII i codici delle dieci cifre sono consecutivi a partire da 0x30. Per interpretare il byte come intero si sommano i pesi delle posizioni a uno, mentre per ottenere il valore della cifra si sottrae il codice di «0».",
    variante(
      "Per il byte 0x33 indica il valore come intero senza segno, la cifra rappresentata in ASCII e quanti bit del byte sono attivi.",
      [
        numero("Intero senza segno", "51", "Moltiplica la cifra esadecimale alta per 16."),
        numero("Cifra rappresentata", "3", "Le cifre ASCII cominciano da 0x30."),
        numero("Bit a uno", "4", "Leggi i due gruppi di quattro bit.")
      ],
      [
        "0x33 = 3 × 16 + 3 = 51.",
        "La distanza da 0x30 è 3, perciò il carattere è la cifra 3.",
        "La configurazione 00110011 contiene 4 bit a uno."
      ]
    ),
    {
      consegna: "Un lettore riceve i byte ASCII 36 e 32 in esadecimale, che rappresentano le cifre 6 e 2. Una routine somma direttamente i due byte. Trova il risultato che produce e quello che si ottiene trasformando prima i caratteri in cifre numeriche.",
      campi: [
        numero("Somma dei codici, in decimale", "104", "Converti ciascun codice esadecimale in un intero."),
        numero("Somma delle cifre", "8", "Il codice di ciascuna cifra dista dal codice di zero quanto vale la cifra.")
      ],
      svolgimento: [
        "0x36 vale 3 × 16 + 6 = 54, mentre 0x32 vale 3 × 16 + 2 = 50. Il programma che somma i codici ottiene 104.",
        "I codici ASCII delle cifre sono consecutivi a partire da 0x30, cioè 48. Le distanze da 48 sono 54 − 48 = 6 e 50 − 48 = 2.",
        "Sommando le due distanze si ottiene 8. La differenza rispetto a 104 deriva dalle due copie del valore di base 48 che la prima routine aveva incluso."
      ],
      quadro: [
        {"titolo": "Somma da esaminare", "celle": [["primo byte", "0x36"], ["secondo byte", "0x32"]], "nota": "I byte sono i codici di due cifre."},
        {"titolo": "Lettura numerica grezza", "celle": [["0x36", "54"], ["0x32", "50"]], "nota": "54 + 50 = 104.", "tipo": "sequenza"},
        {"titolo": "Distanze dallo zero ASCII", "celle": [["54 − 48", "6"], ["50 − 48", "2"]], "nota": "Ogni distanza fornisce il valore di una cifra.", "tipo": "sequenza"},
        {"titolo": "Confronto", "celle": [["somma codici", "104"], ["somma cifre", "8"]], "nota": "Lo scarto è due volte 48.", "tipo": "confronto"}
      ]
    }
  );

  prova("1.3.1", "lez03_02_ascii_hex_string", "Leggere una stringa terminata da NUL",
    "Una stringa C termina al primo byte 00 a partire dall’indirizzo iniziale. I byte che seguono quel terminatore possono appartenere all’array senza far parte della stringa.",
    variante(
      "Un array contiene 52 45 44 00 5A (esadecimale). Determina la lunghezza della stringa C all’inizio dell’array e il suo ultimo carattere stampabile.",
      [
        numero("Lunghezza della stringa", "3", "Cerca il primo byte 00."),
        opzione("Ultimo carattere della stringa", ["D", "R", "Z"], "D", "Le celle successive al terminatore appartengono al resto dell’array.")
      ],
      [
        "Il primo 00 è all’indice 3 contando da zero.",
        "I byte dal primo alla posizione precedente formano il testo ASCII RED.",
        "La lunghezza è 3 e l’ultimo carattere è D. Il resto dell’array contiene Z."
      ]
    ),
    {
      consegna: "Un array contiene 43 41 53 41 00 58 in esadecimale, ossia CASA, NUL e X. Un programma deve ottenere la stringa «CAS» scrivendo un solo byte e lasciando intatte le altre celle. Indica l’indice da modificare, contando da zero, e il valore da scrivere.",
      campi: [
        numero("Indice della cella", "3", "Il nuovo primo terminatore deve seguire subito S."),
        numero("Valore del byte", "0", "Una stringa C termina con il primo ottetto NUL.")
      ],
      svolgimento: [
        "I primi tre byte codificano C, A e S agli indici 0, 1 e 2. Una stringa lunga tre byte termina subito dopo l’indice 2.",
        "Si scrive 00 all’indice 3, al posto della seconda A, ottenendo 43 41 53 00 00 58. Il primo NUL termina la lettura.",
        "Il vecchio terminatore e la X esistono ancora nell’array agli indici 4 e 5. Una lettura come stringa C a partire dall’indice 0 si arresta prima di raggiungerli."
      ],
      quadro: [
        {"titolo": "Array ricevuto", "celle": [["indici 0–2", "C A S"], ["indici 3–5", "A NUL X"]], "nota": "Si può riscrivere un solo byte."},
        {"titolo": "Prefisso da mantenere", "celle": [["ultimo carattere", "S"], ["indice di S", "2"]], "nota": "I primi tre byte sono già corretti."},
        {"titolo": "Nuovo terminatore", "celle": [["indice", "3"], ["byte", "00"]], "nota": "L’ultimo carattere del prefisso precede NUL."},
        {"titolo": "Due viste della memoria", "celle": [["stringa", "CAS"], ["coda", "NUL X"]], "nota": "Le celle dopo il primo NUL rimangono nell’array.", "tipo": "confronto"}
      ]
    }
  );

  prova("1.3.2", "lez03_03_utf8_decode", "Verificare e decodificare una sequenza UTF-8",
    "UTF-8 trasforma il numero assegnato da Unicode a un carattere, chiamato punto di codice, in una sequenza di byte. Il primo byte annuncia la lunghezza: il prefisso 0 indica un byte totale, 110 due, 1110 tre e 11110 quattro. Ogni byte successivo, detto continuazione, comincia con 10 e contribuisce con i sei bit restanti. Per aggiungere un gruppo di sei bit al valore già ricostruito si moltiplica quest’ultimo per 2⁶ = 64 e si somma il nuovo gruppo. La lettura richiede prima di verificare i prefissi: una continuazione con inizio diverso da 10 interrompe la decodifica della sequenza.",
    variante(
      "La sequenza valida C3 A8 rappresenta un solo carattere UTF-8. Ricava il numero di continuazioni e il punto di codice in decimale.",
      [
        numero("Byte di continuazione", "1", "Leggi gli uno iniziali del primo ottetto."),
        numero("Punto di codice", "232", "Togli i prefissi, poi accoda ogni gruppo di sei bit.")
      ],
      [
        "Il primo ottetto 11000011 annuncia due byte in totale: al byte iniziale segue un byte di continuazione.",
        "I gruppi utili, espressi in decimale, sono 3, 40. Per ogni gruppo successivo, moltiplica il valore accumulato per 64 e aggiungi i sei bit utili del nuovo byte.",
        "Il calcolo 3 × 64 + 40 × 1 dà 232, cioè U+00E8 (è)."
      ]
    ),
    {
      consegna: "Un lettore UTF-8 riceve E2 28 A1. Il primo byte ha prefisso 1110. Identifica l’indice del primo byte che impedisce la decodifica, contando da zero, e il prefisso binario che era richiesto in quella posizione.",
      campi: [
        numero("Indice del primo errore", "1", "Dopo il primo byte verifica ogni continuazione nell’ordine."),
        opzione("Prefisso richiesto", ["10", "11", "01"], "10", "Un byte di continuazione conserva sei bit di dati.")
      ],
      svolgimento: [
        "E2 è 11100010. Il prefisso 1110 annuncia una sequenza di tre byte, quindi devono seguire due continuazioni.",
        "Il byte 28 vale 00101000 in binario e comincia con 00. All’indice 1 serviva invece 10 seguito da sei bit utili.",
        "Il prefisso corretto di A1 riguarda soltanto il terzo byte. L’errore nel secondo ha già compromesso la sequenza. Il lettore deve interrompere la decodifica della sequenza all’indice 1."
      ],
      quadro: [
        {"titolo": "Sequenza ricevuta", "celle": [["indice 0", "E2"], ["indice 1", "28"], ["indice 2", "A1"]], "nota": "Verifica l’ordine dei prefissi prima di unire i gruppi."},
        {"titolo": "Lunghezza annunciata", "celle": [["prefisso E2", "1110"], ["continuazioni", "2"]], "nota": "Dopo E2 servono due byte della forma 10xxxxxx."},
        {"titolo": "Primo confronto", "celle": [["0x28", "00101000"], ["prefisso", "00"]], "nota": "La violazione si trova all’indice 1."},
        {"titolo": "Esito", "celle": [["primo errore", "indice 1"], ["prefisso atteso", "10"]], "nota": "Il gruppo successivo appartiene a una sequenza già interrotta."}
      ]
    }
  );

  prova("1.3.3", "lez03_04_rgb_image_size", "Localizzare un canale in un’immagine RGB",
    "In RGB24 ogni pixel occupa tre byte nell’ordine rosso, verde, blu. La larghezza in byte di una riga consente sia di raggiungere una riga dalle sue coordinate sia di ricavarla dividendo lo spostamento totale. Il resto della divisione colloca il byte dentro la riga.",
    variante(
      "Un’immagine RGB24 misura 8 × 4 pixel, righe contigue senza riempimento. L’origine delle coordinate coincide con il primo pixel in memoria. x cresce lungo le righe, y nell’ordine in cui sono memorizzate. I canali si susseguono come R, G, B. Localizza il byte G del pixel (3, 2).",
      [
        numero("Dimensione totale in byte", "96", "Moltiplica i pixel per i tre byte di ciascun pixel."),
        numero("Offset del canale", "58", "Conta prima le righe complete e poi i pixel nella riga corrente.")
      ],
      [
        "Ogni riga occupa 8 × 3 = 24 byte. L’intera immagine occupa 96 byte.",
        "L’indice lineare del pixel è 2 × 8 + 3 = 19.",
        "Il pixel comincia al byte 57. Il canale G dista 1 byte dal suo inizio e si trova all’offset 58."
      ]
    ),
    {
      consegna: "In un’immagine RGB24 larga cinque pixel e alta quattro, le righe sono contigue e ogni pixel contiene R, G e B in quest’ordine. Un byte alterato si trova allo spostamento 52 dall’inizio. Identifica riga, colonna e canale, numerando righe e colonne da zero.",
      campi: [
        numero("Riga y", "3", "Dividi lo spostamento per la larghezza di una riga in byte."),
        numero("Colonna x", "2", "Dividi il resto nella riga per i tre byte di un pixel."),
        opzione("Canale", ["R", "G", "B"], "G", "Il resto entro il pixel vale zero per R, uno per G e due per B.")
      ],
      svolgimento: [
        "Ogni riga occupa 5 × 3 = 15 byte. La divisione 52 = 3 × 15 + 7 individua la riga 3 e uno spostamento di 7 byte al suo interno.",
        "Poiché ogni pixel occupa tre byte, 7 = 2 × 3 + 1 indica la colonna 2 e la componente di indice 1.",
        "La componente di indice 1 è G. Sostituendo riga e colonna nella formula diretta si ritrova 3 × 15 + 2 × 3 + 1 = 52."
      ],
      quadro: [
        {"titolo": "Segnalazione del guasto", "celle": [["larghezza", "5 pixel"], ["offset", "52 byte"]], "nota": "I canali di ciascun pixel sono R, G e B."},
        {"titolo": "Divisione per la riga", "celle": [["quoziente", "3"], ["resto", "7 byte"]], "nota": "Una riga contiene quindici byte."},
        {"titolo": "Divisione per il pixel", "celle": [["colonna", "2"], ["resto", "1 byte"]], "nota": "Un pixel contiene tre byte."},
        {"titolo": "Byte identificato", "celle": [["y", "3"], ["x", "2"], ["canale", "G"]], "nota": "45 + 6 + 1 ricostruisce lo spostamento 52."}
      ]
    }
  );

  prova("1.3.5", "lez03_05_multi_interpretation", "Due ottetti, tre letture",
    "Gli indirizzi determinano la successione dei byte. Il testo ASCII si legge un byte per volta. In un intero a sedici bit, invece, l’ordine dei byte stabilisce quale valore moltiplicare per 256.",
    variante(
      "Leggi 41 42 come coppia ASCII e come intero senza segno di 16 bit nei due ordini di byte.",
      [
        opzione("Testo", ["AB", "BA", "00"], "AB", "Decodifica in ordine di indirizzo."),
        numero("Intero big-endian", "16706", "Il primo byte pesa 256."),
        numero("Intero little-endian", "16961", "Il secondo byte pesa 256.")
      ],
      [
        "Le due celle individuano i caratteri A e B. Il testo è AB.",
        "In big-endian si calcola 65 × 256 + 66 = 16706.",
        "In little-endian si calcola 66 × 256 + 65 = 16961. La sequenza in memoria resta quella fornita."
      ]
    ),
    {
      consegna: "Un manuale indica che il valore intero memorizzato è 0x4F4B. Nell’ordine crescente degli indirizzi leggi 4B 4F. Determina la convenzione usata e il testo che comparirebbe se gli stessi byte fossero inviati, in ordine di indirizzo, a un terminale ASCII.",
      campi: [
        opzione("Ordine del campo intero", ["little-endian", "big-endian"], "little-endian", "Confronta il primo byte in memoria con la coppia di cifre di peso minore del numero."),
        opzione("Testo ASCII", ["OK", "KO"], "KO", "In ASCII 4B è K e 4F è O. La lettura dei caratteri segue gli indirizzi.")
      ],
      svolgimento: [
        "Nella scrittura 0x4F4B la coppia 4F vale 256 volte il suo valore di byte. La coppia 4B ha peso uno.",
        "La memoria presenta per primo 4B, il byte di peso minore. Questa disposizione è little-endian.",
        "Se ciascun byte è interpretato come un carattere, l’indirizzo più basso fornisce K e quello seguente O. Il terminale riceve KO."
      ],
      quadro: [
        {"titolo": "Due osservazioni", "celle": [["numero noto", "0x4F4B"], ["memoria", "4B 4F"]], "nota": "La memoria è letta per indirizzi crescenti.", "tipo": "confronto"},
        {"titolo": "Pesi del numero", "celle": [["peso 256", "4F"], ["peso 1", "4B"]], "nota": "Le cifre in scrittura numerica sono ordinate per peso.", "tipo": "confronto"},
        {"titolo": "Convenzione", "celle": [["primo", "4B"], ["ordine", "little-endian"]], "nota": "Il byte meno significativo viene per primo."},
        {"titolo": "Lettura di testo", "celle": [["4B", "K"], ["4F", "O"]], "nota": "Il terminale vede KO."}
      ]
    }
  );

  // Capitolo 1.4
  prova("1.4.1", "lez04_01_encode_negative_twos", "Codificare un numero negativo su otto bit",
    "Il valore assoluto di un numero è la sua distanza da zero: per −37 vale 37. Per codificare un intero negativo rappresentabile su otto bit si può invertire ogni bit del suo valore assoluto, scambiando zero e uno, e aggiungere uno. Il risultato coincide con il numero senza segno ottenuto aggiungendo 256 all’intero negativo; i suoi otto bit costituiscono il residuo modulo 256. Per verificare il codice con bit alto uguale a uno si sottrae 256 dalla lettura senza segno e si ritrova il valore negativo.",
    variante(
      "Rappresenta −37 in complemento a due su otto bit. Trova la parola dopo l’inversione dei bit del valore assoluto e la parola finale, in decimale senza segno.",
      [
        numero("Dopo l’inversione", "218", "Il complemento bit a bit di un byte x vale 255 − x."),
        numero("Byte finale", "219", "Al complemento bit a bit aggiungi un’unità.")
      ],
      [
        "Il valore assoluto 37 si scrive 00100101.",
        "Inverti ogni bit: 11011010, pari a 218.",
        "Aggiungi uno e ottieni 11011011, cioè 219. Verifica: 219 − 256 = −37."
      ]
    ),
    {
      consegna: "Per codificare −52 su otto bit uno studente parte da 00110100, inverte le cifre e consegna 11001011. Identifica il valore con segno della parola consegnata e scegli la parola che codifica −52.",
      campi: [
        numero("Valore con segno della parola consegnata", "-53", "Sottrai 256 dal valore senza segno della parola con il bit alto a uno."),
        opzione("Codice corretto di −52", ["11001011", "11001100", "00110101"], "11001100", "Cerca il byte che, sommato a 52, lascia zero nelle otto posizioni.")
      ],
      svolgimento: [
        "11001011 vale 203 senza segno. Letto in complemento a due vale 203 − 256 = −53.",
        "Invertire i bit di 52 dà 255 − 52 = 203. Per ottenere il residuo di −52 serve invece 256 − 52 = 204, cioè un’unità in più.",
        "La parola di 204 è 11001100. La somma 52 + 204 dà 256 e lascia zero negli otto bit inferiori."
      ],
      quadro: [
        {"titolo": "Proposta da verificare", "celle": [["valore richiesto", "−52"], ["parola", "11001011"]], "nota": "La parola è il risultato della sola inversione."},
        {"titolo": "Interpretazione", "celle": [["senza segno", "203"], ["con segno", "−53"]], "nota": "Il bit alto è attivo."},
        {"titolo": "Residuo corretto", "celle": [["256 − 52", "204"], ["correzione", "+1"]], "nota": "Il complemento a due aggiunge uno all’inversione."},
        {"titolo": "Verifica", "celle": [["parola", "11001100"], ["52 + 204", "256"]], "nota": "Gli otto bit bassi della somma sono zero."}
      ]
    }
  );

  prova("1.4.1", "lez04_02_decode_twos", "Leggere una parola con e senza segno",
    "Una parola di n bit ammette una lettura senza segno e una in complemento a due. Se il bit più significativo vale uno, la lettura con segno si ricava sottraendo 2ⁿ alla lettura senza segno.",
    variante(
      "La parola di 8 bit 0xD2 viene letta sia senza segno sia in complemento a due. Determina i due risultati.",
      [
        numero("Senza segno", "210", "Sviluppa le cifre esadecimali con i pesi posizionali."),
        numero("Con segno", "-46", "Osserva il bit di peso massimo e applica il modulo della larghezza scelta.")
      ],
      [
        "Convertendo 0xD2 come intero senza segno si ottiene 210.",
        "Il bit 7 vale uno. In complemento a due il valore con segno si trova sottraendo 2^8 = 256.",
        "La differenza 210 − 256 = -46. Aggiungendo il modulo al valore negativo ritrovi il codice di partenza."
      ]
    ),
    {
      consegna: "Un sensore a otto bit ha restituito 0x80. Dopo una copia su sedici bit si legge 0xFF80. Individua l’estensione usata e determina quale valore va attribuito al risultato se rappresenta la stessa misura con segno.",
      campi: [
        opzione("Estensione osservata", ["estensione con zeri", "estensione del segno"], "estensione del segno", "Confronta l’ottetto alto del risultato con il bit alto dell’originale."),
        numero("Misura con segno", "-128", "Sottrai 256 al valore senza segno del byte iniziale quando il bit 7 vale uno.")
      ],
      svolgimento: [
        "Nel byte 0x80 il bit 7 vale uno e gli altri sette valgono zero. In complemento a due il suo valore è −128.",
        "Durante la copia sono comparsi otto uno sopra il byte iniziale, formando FF80. È stata replicata la cifra di segno.",
        "Su sedici bit FF80 vale 65408 senza segno e 65408 − 65536 = −128 con segno. L’estensione con zeri avrebbe dato 0080 e il valore positivo 128."
      ],
      quadro: [
        {"titolo": "Copia osservata", "celle": [["origine", "0x80"], ["destinazione", "0xFF80"]], "nota": "L’origine ha otto bit e il risultato sedici."},
        {"titolo": "Cifra di segno", "celle": [["bit 7", "1"], ["valore", "−128"]], "nota": "Il peso della sola posizione attiva è −128."},
        {"titolo": "Bit aggiunti", "celle": [["byte alto", "FF"], ["origine", "bit 7"]], "nota": "Il bit alto della parola iniziale è stato replicato."},
        {"titolo": "Controllo del valore", "celle": [["0xFF80", "−128"], ["0x0080", "+128"]], "nota": "La replica conserva il valore con segno.", "tipo": "confronto"}
      ]
    }
  );

  prova("1.4.1", "lez04_03_signed_range", "Determinare gli estremi rappresentabili",
    "In complemento a due il bit più significativo pesa −2ⁿ⁻¹ per una parola di n bit. Gli altri bit hanno pesi positivi: le loro combinazioni determinano il minimo, il massimo e il numero di valori distinti.",
    variante(
      "In un formato in complemento a due di 7 bit calcola minimo, massimo e numero di valori.",
      [
        numero("Minimo", "-64", "Il bit di segno ha peso negativo."),
        numero("Massimo", "63", "Attiva tutti i bit tranne quello di segno."),
        numero("Numero di valori", "128", "Conta tutte le configurazioni delle posizioni.")
      ],
      [
        "Il bit più alto pesa −2^6 = −64. Con le altre posizioni a zero ottieni il minimo.",
        "Con il bit alto a zero e gli altri a uno la somma dei pesi è 64 − 1 = 63.",
        "L’intervallo [−64, 63] comprende 128 valori, quanti i codici formati da 7 bit."
      ]
    ),
    {
      consegna: "Un misuratore deve registrare tutti gli interi da −70 a +69 in complemento a due. Si vuole scegliere la larghezza minima. Quanti bit servono? Qual è il minimo valore con segno della larghezza immediatamente inferiore?",
      campi: [
        numero("Larghezza minima in bit", "8", "Confronta entrambi gli estremi richiesti con gli intervalli da sette e otto bit."),
        numero("Minimo con un bit in meno", "-64", "A sette bit la cifra più alta pesa −2⁶.")
      ],
      svolgimento: [
        "Con sette bit l’intervallo va da −2⁶ = −64 a 2⁶ − 1 = 63. Entrambi gli estremi richiesti cadono all’esterno.",
        "Con otto bit il minimo è −128 e il massimo 127. L’intero intervallo da −70 a 69 è compreso fra questi due limiti.",
        "Ogni bit aggiunto allarga l’intervallo rappresentabile. Il fallimento a sette bit e la riuscita a otto provano la minimalità della scelta."
      ],
      quadro: [
        {"titolo": "Specifiche", "celle": [["minimo richiesto", "−70"], ["massimo richiesto", "69"]], "nota": "Occorre rappresentare anche i valori estremi."},
        {"titolo": "Tentativo con 7 bit", "celle": [["minimo", "−64"], ["massimo", "63"]], "nota": "La misura supera entrambi i limiti.", "tipo": "confronto"},
        {"titolo": "Tentativo con 8 bit", "celle": [["minimo", "−128"], ["massimo", "127"]], "nota": "Tutte le misure richieste sono comprese.", "tipo": "confronto"},
        {"titolo": "Decisione", "celle": [["larghezza", "8 bit"], ["minimo a 7 bit", "−64"]], "nota": "La larghezza immediatamente inferiore è insufficiente."}
      ]
    }
  );

  prova('1.4.2','lez04_04_fixed_width_add_sub','Calcolare risultato e flag su un byte',
    "L’ALU è la parte di calcolo aritmetico e logico del processore. Su otto bit conserva il residuo modulo 256, cioè il valore fra 0 e 255 ottenuto aggiungendo o sottraendo multipli di 256 al risultato matematico. I flag sono bit che descrivono l’operazione: nella convenzione x86, CF segnala il riporto oltre il byte in addizione oppure il prestito in sottrazione, considerando gli operandi senza segno. OF segnala invece che il risultato matematico dei valori con segno esce dall’intervallo −128…127. Per leggere un byte in complemento a due, se il bit alto è uno si sottrae 256 dal valore senza segno.",
    ...[[0xF4,0x18,true],[0x7F,0xFF,false]].map(([a,b,add])=>{
      const raw=add?a+b:a-b,s=add?segno8(a)+segno8(b):segno8(a)-segno8(b),r=raw&255;
      const cf=Number(add?raw>255:raw<0),of=Number(s< -128||s>127),op=add?' + ':' − ';
      return variante('Un’ALU a otto bit esegue 0x'+hex(a)+op+'0x'+hex(b)+'. Usa la convenzione x86 per CF (riporto in addizione, prestito in sottrazione).',
        [numero('Risultato come byte senza segno',r,'Riduci l’operazione modulo 256.'),numero('CF',cf,'Valuta l’operazione tra i due operandi senza segno.'),numero('OF',of,'Confronta l’operazione matematica con segno con [−128, 127].')],
        ['Leggendo gli operandi senza segno, il calcolo matematico dà '+a+op+b+' = '+raw+'. Il residuo modulo 256 è '+r+' (0x'+hex(r)+').','Il risultato matematico '+(cf?'esce da':'rientra in')+' [0, 255]. CF vale '+cf+'.','Con segno calcoli ('+segno8(a)+')'+op+'('+segno8(b)+') = '+s+'. Il controllo dell’intervallo dà OF = '+of+'.']);
    }));

  prova("1.4.4", "lez04_05_overflow_detector", "Verificare il margine prima della somma",
    "Per due operandi positivi si può verificare la somma prima di eseguirla. Sottrarre il primo operando dal massimo rappresentabile indica quanto spazio rimane per il secondo.",
    variante(
      "Vuoi sommare gli interi positivi 119 e 9 e memorizzare la somma in complemento a due su otto bit. Determina margine residuo e decisione prima di scrivere.",
      [
        numero("Massimo addendo ammesso", "8", "Sottrai il primo operando dal massimo con segno."),
        opzione("Decisione", ["ammettere", "rifiutare"], "rifiutare", "Confronta il secondo operando col margine calcolato.")
      ],
      [
        "Su otto bit il massimo con segno è 127.",
        "Il margine è 127 − 119 = 8. Il secondo addendo 9 è oltre questo limite.",
        "La somma matematica è 128. La scrittura va rifiutata perché il risultato eccede 127."
      ]
    ),
    {
      consegna: "Un contatore con segno di otto bit parte da 93. Ogni evento aggiunge 7 e la scrittura è ammessa soltanto se il risultato rientra nell’intervallo. Quanti eventi consecutivi si possono registrare? Quale somma matematica produrrebbe il primo evento da respingere?",
      campi: [
        numero("Eventi ammessi", "4", "Dividi il margine fino a 127 per l’incremento e conserva la parte intera."),
        numero("Prima somma da respingere", "128", "Aggiungi un altro incremento all’ultimo valore ammesso.")
      ],
      svolgimento: [
        "Il massimo rappresentabile è 127, quindi il contatore dispone di 127 − 93 = 34 unità di margine.",
        "Quattro incrementi consumano 28 unità e portano il valore a 121. Un quinto ne consumerebbe 35 dal punto iniziale.",
        "L’ultimo tentativo produrrebbe 121 + 7 = 128. Restano disponibili soltanto sei unità e il controllo deve respingere la quinta scrittura."
      ],
      quadro: [
        {"titolo": "Contatore", "celle": [["iniziale", "93"], ["incremento", "7"], ["max", "127"]], "nota": "Ogni evento deve essere registrato per intero."},
        {"titolo": "Margine", "celle": [["127 − 93", "34"]], "nota": "Il margine è la dotazione complessiva disponibile."},
        {"titolo": "Eventi interi", "celle": [["34 ÷ 7", "4 resto 6"], ["ultimo valore", "121"]], "nota": "Quattro eventi consumano 28 unità."},
        {"titolo": "Tentativo seguente", "celle": [["121 + 7", "128"], ["esito", "respinto"]], "nota": "Il valore matematico supera il massimo."}
      ]
    }
  );

  // Capitolo 1.5
  prova("1.5.1", "lez05_01_single_gate", "Seguire due porte in cascata",
    "Una NAND restituisce il complemento dell’AND. In una cascata l’uscita di questa prima porta diventa un ingresso della successiva. La XOR vale uno quando i suoi due ingressi differiscono.",
    variante(
      "Una NAND riceve A=1 e B=0. L’uscita alimenta una XOR il cui secondo ingresso C vale 1. Calcola le due uscite.",
      [
        numero("Uscita NAND", "1", "Nega il risultato dell’AND dei primi ingressi."),
        numero("Uscita XOR", "0", "La XOR vale uno se gli ingressi sono diversi.")
      ],
      [
        "A AND B = 0.",
        "La NAND inverte questo bit e produce 1.",
        "La XOR confronta 1 e 1, producendo 0."
      ]
    ),
    {
      consegna: "Un circuito collega la NAND di A e B a una XOR con C. Dall’oscilloscopio sai che C vale 1 e che l’uscita finale vale 1 a segnali assestati. Risali all’uscita della NAND e alla coppia di ingressi compatibile.",
      campi: [
        numero("Uscita della NAND", "0", "La XOR vale uno quando i suoi due ingressi differiscono."),
        opzione("Coppia AB", ["00", "01", "10", "11"], "11", "In quale riga la NAND vale zero?")
      ],
      svolgimento: [
        "L’uscita della XOR vale uno e uno dei suoi ingressi è C = 1. Per avere due segnali diversi, l’altro ingresso deve valere zero.",
        "Questo zero proviene dalla NAND. Poiché NAND inverte AND, l’AND di A e B prima dell’inversione deve valere uno.",
        "Entrambi gli ingressi valgono dunque uno. La prova in avanti dà NAND(1,1) = 0 e XOR(0,1) = 1, come sulla misura."
      ],
      quadro: [
        {"titolo": "Segnali misurati", "celle": [["C", "1"], ["uscita XOR", "1"]], "nota": "Si cerca la causa risalendo dall’uscita."},
        {"titolo": "Ingresso ignoto della XOR", "celle": [["C", "1"], ["altro ingresso", "0"]], "nota": "Per dare uno, i due ingressi devono differire."},
        {"titolo": "Inversione nella NAND", "celle": [["NAND", "0"], ["AND", "1"]], "nota": "Invertendo zero si ritrova l’AND della prima coppia."},
        {"titolo": "Verifica in avanti", "celle": [["A", "1"], ["B", "1"], ["uscita", "1"]], "nota": "La sola coppia compatibile è 11."}
      ]
    }
  );

  prova("1.5.6", "lez05_02_bitwise_on_bytes", "Isolare e contare i bit selezionati",
    "Nell’AND bit a bit ogni posizione si calcola indipendentemente. Un bit del risultato vale uno soltanto se in quella posizione sia il dato sia la maschera contengono uno.",
    variante(
      "Esegui 0xB6 AND 0x3C su otto bit. Determina risultato senza segno e numero di posizioni a uno nell’intersezione.",
      [
        numero("Risultato", "52", "Allinea gli ottetti e conserva solo le coppie 1 e 1."),
        numero("Posizioni a uno", "3", "Conta i pesi che sopravvivono alla maschera.")
      ],
      [
        "Gli operandi sono 10110110 e 00111100.",
        "L’AND per colonna produce 00110100, cioè 0x34 = 52.",
        "Le posizioni attive dopo la selezione sono 2, 4, 5. In totale sono 3."
      ]
    ),
    {
      consegna: "Una maschera ignota M di otto bit viene sottoposta a due prove. Si osservano 0xF0 AND M = 0xA0 e 0x0F AND M = 0x06. Ricostruisci M come intero senza segno e indica quante sue posizioni sono attive.",
      campi: [
        numero("Maschera ricostruita", "166", "La prima prova isola i quattro bit alti e la seconda quelli bassi."),
        numero("Bit attivi nella maschera", "4", "Conta gli uno separatamente nei due gruppi.")
      ],
      svolgimento: [
        "La maschera di prova F0 conserva le quattro posizioni alte di M. In A0 il gruppo alto è A, cioè 1010.",
        "La maschera 0F conserva le posizioni basse. La risposta 06 mostra il gruppo 0110. Le due prove coprono l’intero byte in gruppi disgiunti.",
        "La parola 10100110 vale 128 + 32 + 4 + 2 = 166, ossia 0xA6. Ogni gruppo di quattro contiene due uno, per un totale di quattro."
      ],
      quadro: [
        {"titolo": "Due osservazioni", "celle": [["con F0", "A0"], ["con 0F", "06"]], "nota": "Si cerca il byte comune alle due operazioni.", "tipo": "confronto"},
        {"titolo": "Parte alta", "celle": [["prova F0", "1010 xxxx"]], "nota": "F0 lascia passare soltanto il gruppo alto."},
        {"titolo": "Parte bassa", "celle": [["prova 0F", "xxxx 0110"]], "nota": "0F rende visibili tutte e quattro le posizioni basse."},
        {"titolo": "Unione dei gruppi", "celle": [["maschera", "A6"], ["decimale", "166"], ["bit attivi", "4"]], "nota": "Nessuna posizione resta indeterminata."}
      ]
    }
  );

  prova("1.5.2", "lez05_03_identify_gate", "Ricostruire una porta dalla colonna di uscita",
    "A ogni coppia di ingressi una porta associa un’uscita. Si può riconoscere la porta da tutte le righe della tabella oppure scegliere una sola riga sulla quale due ipotesi prevedono uscite diverse.",
    variante(
      "Una porta a due ingressi produce 0 1 1 0 sulle righe 00, 01, 10, 11. Identifica la porta e conta le righe con uscita uno.",
      [
        opzione("Porta", ["AND", "XOR", "NAND", "NOR"], "XOR", "Confronta prima le righe 00 e 11 e poi le due righe miste."),
        numero("Righe vere", "2", "Conta gli uno della colonna indicata.")
      ],
      [
        "Associare ogni uscita ai suoi due ingressi consente di eliminare le porte incompatibili.",
        "Restano attive le due righe con ingressi diversi. Questa è la definizione della porta XOR.",
        "Il conteggio della colonna dà 2 righe vere. Riproducendo la tabella di XOR si ritrova 0 1 1 0."
      ]
    ),
    {
      consegna: "Una porta sigillata è una AND oppure una OR. Il banco ha già provato 00 e 11, ottenendo rispettivamente 0 e 1. Per progettare una terza prova che distingua le due porte, scegli una riga utile fra quelle offerte e prevedi le due uscite su quella riga.",
      campi: [
        opzione("Nuova riga utile", ["00", "01", "11"], "01", "Cerca due ingressi con valori diversi."),
        numero("Uscita se la porta è AND", "0", "AND richiede entrambi gli ingressi a uno."),
        numero("Uscita se la porta è OR", "1", "OR si attiva appena uno dei due ingressi vale uno.")
      ],
      svolgimento: [
        "AND e OR coincidono quando gli ingressi sono entrambi zero e quando sono entrambi uno. I due risultati già raccolti sono compatibili con entrambe.",
        "Sulla riga 01 il primo ingresso è zero e il secondo è uno. Fra le righe offerte è l’unica con segnali diversi.",
        "AND(0,1) vale 0, OR(0,1) vale 1. Il solo valore misurato su questa terza riga è sufficiente a identificare la porta. Anche la riga 10, fuori dalle alternative offerte, avrebbe la stessa proprietà."
      ],
      quadro: [
        {"titolo": "Prove eseguite", "celle": [["riga 00", "0"], ["riga 11", "1"]], "nota": "Le porte candidate sono AND e OR.", "tipo": "confronto"},
        {"titolo": "Valutazione dei reperti", "celle": [["ipotesi AND", "compatibile"], ["ipotesi OR", "compatibile"]], "nota": "Gli ingressi uguali producono la stessa uscita.", "tipo": "confronto"},
        {"titolo": "Prova discriminante", "celle": [["riga scelta", "01"]], "nota": "Fra le opzioni offerte solo 01 presenta ingressi diversi."},
        {"titolo": "Esiti alternativi", "celle": [["AND", "0"], ["OR", "1"]], "nota": "La misura sulla riga 01 identifica la porta.", "tipo": "confronto"}
      ]
    }
  );

  prova("1.5.6", "lez05_04_c_bitwise_expression", "Aggiornare un campo senza alterare i vicini",
    "Un campo è un gruppo di posizioni del byte che conserva un’informazione. Per sostituirlo occorre prima azzerare tutti i bit che gli appartengono e poi inserire il nuovo valore già allineato a quelle posizioni. Nel codice C, & indica AND e conserva un bit a uno soltanto se entrambi gli operandi lo hanno; | indica OR e richiede almeno un uno; ~ inverte ciascun bit. La maschera ha uno nelle posizioni del campo, perciò x & ~mask le azzera. Lo spostamento << porta i bit verso i pesi maggiori, >> verso i pesi minori; il numero seguente indica di quante posizioni. unsigned int e il suffisso u indicano interi senza segno. Il segno = assegna alla variabile a sinistra il risultato a destra.",
    variante(
      "Nel byte 0xA5 assegna il valore 1 al campo di due bit che parte dalla posizione 2 (bit 0 a destra). Calcola maschera e byte aggiornato.",
      [
        numero("Maschera del campo", "12", "Due bit contigui valgono 3 prima dello spostamento."),
        numero("Byte aggiornato", "165", "Azzera il campo con il complemento della maschera, poi inserisci il nuovo valore.")
      ],
      [
        "La maschera è 3 << 2 = 0x0C.",
        "L’AND x & ~maschera lascia 0xA1 negli otto bit del byte.",
        "Il valore spostato è 0x04. L’OR produce 0xA5 = 165. Rileggendo (risultato & maschera) >> 2 si ottiene 1."
      ],
      "unsigned int x = 0xA5u;\nunsigned int mask = 3u << 2;\nx = (x & ~mask) | (1u << 2);"
    ),
    {
      consegna: "Nel byte 0xA2 si vuole scrivere 3 nei bit di indice 3 e 2, preservando tutti i vicini. Dopo la scrittura si legge 0xBE. Determina il byte che si sarebbe dovuto ottenere e l’indice dell’unico bit estraneo modificato, contando da destra a partire da zero.",
      campi: [
        numero("Byte corretto, come intero senza segno", "174", "I due uno del campo desiderato formano 0x0C."),
        numero("Indice del bit estraneo modificato", "4", "Confronta bit per bit il byte letto con quello corretto.")
      ],
      svolgimento: [
        "La maschera del campo è 00001100. In 0xA2, cioè 10100010, il campo vale già 00. Impostandolo a 11 si ottiene 10101110, cioè 0xAE = 174.",
        "Il risultato osservato è 10111110. Per individuare le posizioni discordanti si può applicare XOR fra AE e BE, ottenendo 00010000.",
        "L’unico uno della differenza pesa 16 e ha indice 4. I due bit del campo hanno ricevuto 3, mentre il bit adiacente di indice 4 è cambiato indebitamente."
      ],
      quadro: [
        {"titolo": "Scrittura segnalata", "celle": [["iniziale", "A2"], ["campo 3–2", "11"], ["osservato", "BE"]], "nota": "Si controllano anche i bit esterni al campo."},
        {"titolo": "Byte atteso", "celle": [["campo", "0C"], ["esito", "AE"]], "nota": "10100010 con campo 11 diventa 10101110."},
        {"titolo": "Confronto bit a bit", "celle": [["AE XOR BE", "10 esadecimale"]], "nota": "La differenza vale 00010000 in binario.", "tipo": "sequenza"},
        {"titolo": "Diagnosi", "celle": [["atteso", "174"], ["bit estraneo", "4"]], "nota": "Il campo è corretto, il vicino di peso 16 è alterato."}
      ]
    }
  );

  prova("1.5.2", "lez05_05_truth_table_rows", "Numerare le righe di una tabella",
    "Con n ingressi binari una tabella di verità ha 2ⁿ righe. Numerandole in ordine binario da zero, l’indice di una riga coincide con il valore senza segno della sequenza di ingressi.",
    variante(
      "Una tabella enumera 3 ingressi da sinistra a destra, il primo come bit più significativo. L’ordine delle righe è binario crescente a partire da zero. Per la tupla 101 determina indice e numero totale di righe.",
      [
        numero("Indice", "5", "Pesa i bit come una parola senza segno."),
        numero("Numero totale di righe", "8", "Conta le combinazioni indipendenti di tutti gli ingressi.")
      ],
      [
        "I pesi da sinistra sono 4, 2, 1.",
        "Sommando i pesi con bit 1 in 101 ottieni l’indice 5.",
        "La tabella ha 2^3 = 8 righe. L’ultima ha indice 7, coerente con l’indicizzazione da zero."
      ]
    ),
    {
      consegna: "Un controllore deve assegnare un codice diverso a tredici stati, usando parole tutte della stessa larghezza. I codici vengono assegnati in ordine binario crescente iniziando da zero. Determina la larghezza minima e l’indice della prima riga ancora libera.",
      campi: [
        numero("Larghezza minima", "4", "Confronta tredici con le potenze di due vicine."),
        numero("Indice della prima riga libera", "13", "Il primo stato usa l’indice zero.")
      ],
      svolgimento: [
        "Tre bit offrono 2³ = 8 parole, che coprono soltanto otto stati. Con quattro bit le parole sono 2⁴ = 16.",
        "I tredici codici assegnati occupano gli indici da 0 a 12 inclusi. L’ultima parola assegnata è 1100.",
        "La prima riga libera è la successiva, con indice 13 e tupla 1101. Restano in tutto tre righe libere, quelle di indice 13, 14 e 15."
      ],
      quadro: [
        {"titolo": "Specifica", "celle": [["stati", "13"], ["primo indice", "0"]], "nota": "Ogni stato richiede un codice distinto."},
        {"titolo": "Capacità", "celle": [["3 bit", "8"], ["4 bit", "16"]], "nota": "La prima larghezza sufficiente è quattro.", "tipo": "confronto"},
        {"titolo": "Intervallo assegnato", "celle": [["primo", "0"], ["ultimo", "12"]], "nota": "L’indice più alto vale uno meno del numero di stati."},
        {"titolo": "Prime righe residue", "celle": [["prima libera", "13"], ["tupla", "1101"]], "nota": "Rimangono tre codici disponibili."}
      ]
    }
  );

  // Capitolo 1.6
  prova("1.6.1", "lez06_01_fractional_binary", "Pesare le cifre dopo la virgola",
    "La prima cifra dopo la virgola binaria pesa 1/2, la seconda 1/4 e così via. Con k posizioni si possono esprimere tutti i pesi come frazioni aventi denominatore 2ᵏ.",
    variante(
      "La frazione in base due è 0,101. Scrivila come numeratore su 8 e indica il valore decimale esatto.",
      [
        numero("Numeratore", "5", "Il denominatore comune è il peso inverso dell’ultima posizione."),
        numero("Valore decimale", "0.625", "Somma i contributi delle sole cifre a uno.")
      ],
      [
        "Da sinistra i denominatori crescono per potenze di due. I contributi attivi sono 1/2 + 1/8.",
        "Ridotti al denominatore 8 danno 5/8.",
        "La divisione dà il valore esatto 0,625. La moltiplicazione per 8 ricostruisce il numeratore 5."
      ]
    ),
    {
      consegna: "Un formato conserva soltanto tre cifre dopo la virgola binaria. Occorre memorizzare esattamente 3/16. Decidi se il formato ci riesce e calcola il numero minimo di cifre necessarie dopo la virgola.",
      campi: [
        opzione("Tre cifre bastano?", ["sì", "no"], "no", "Con tre cifre ogni valore è un multiplo intero di un ottavo."),
        numero("Cifre minime dopo la virgola", "4", "Cerca la prima potenza di due con cui la frazione si esprime mediante un numeratore intero.")
      ],
      svolgimento: [
        "Con tre cifre sono possibili i multipli di 1/8. La frazione richiesta sta fra 1/8 = 2/16 e 2/8 = 4/16, quindi tre cifre sono insufficienti.",
        "Con quattro cifre la posizione più a destra pesa 1/16. La somma 1/8 + 1/16 dà esattamente 3/16.",
        "La scrittura minima è 0,0011 in base due. Cancellando l’ultima posizione si perde il termine da 1/16."
      ],
      quadro: [
        {"titolo": "Vincolo del formato", "celle": [["obiettivo", "3/16"], ["cifre disponibili", "3"]], "nota": "La rappresentazione deve essere esatta."},
        {"titolo": "Griglia a tre cifre", "celle": [["vicino inferiore", "2/16"], ["vicino superiore", "4/16"]], "nota": "Il valore richiesto cade fra due punti della griglia.", "tipo": "confronto"},
        {"titolo": "Griglia a quattro cifre", "celle": [["pesi attivi", "1/8 + 1/16"]], "nota": "La nuova posizione consente di raggiungere 3/16."},
        {"titolo": "Rappresentazione", "celle": [["in binario", "0,0011"], ["minimo", "4 cifre"]], "nota": "L’ultima cifra è necessaria."}
      ]
    }
  );

  prova("1.6.1", "lez06_02_exact_or_approx", "Stabilire se una frazione termina in base due",
    "Ridurre una frazione ai minimi termini significa dividere numeratore e denominatore per tutti i fattori comuni. Un fattore primo è un divisore maggiore di uno che ammette soltanto uno e sé stesso come divisori positivi; per esempio 2 e 5 sono primi. La frazione ridotta ha una scrittura binaria finita quando il denominatore è una potenza di due, perché allora i pesi 1/2, 1/4, 1/8 e successivi bastano a ricostruirla con un numero finito di cifre. Se nel denominatore rimane un altro fattore primo, compare una parte periodica, ossia una sequenza di cifre che si ripete indefinitamente.",
    variante(
      "Riduci 6/40 ai minimi termini e stabilisci se ammette una scrittura binaria finita. Indica il denominatore ridotto e classifica l’espansione.",
      [
        numero("Denominatore ridotto", "20", "Dividi numeratore e denominatore per il loro massimo comun divisore."),
        opzione("Espansione binaria", ["finita", "infinita periodica"], "infinita periodica", "Un denominatore ridotto deve dividere qualche potenza di due per consentire una scrittura finita.")
      ],
      [
        "Il massimo comun divisore è 2. La frazione ridotta è 3/20.",
        "Il denominatore 20 contiene il fattore primo 5.",
        "Nessuna potenza di due è divisibile per 5. La divisione binaria ha pertanto una parte periodica."
      ]
    ),
    {
      consegna: "Un sensore registra una frazione n/40 con n intero da 1 a 39. Si cerca il più piccolo n per il quale l’espansione binaria sia finita. Determina n e la frazione ridotta, usando il denominatore nella seconda risposta.",
      campi: [
        numero("Minimo numeratore positivo", "5", "Scomponi 40 e cerca il fattore che deve scomparire nella riduzione."),
        numero("Denominatore dopo la riduzione", "8", "Semplifica la frazione ottenuta con il minimo numeratore.")
      ],
      svolgimento: [
        "40 si scompone in 2³ × 5. Affinché il denominatore ridotto sia una potenza di due occorre cancellare il fattore 5, quindi n deve essere multiplo di 5.",
        "Il primo multiplo positivo di 5 è 5. Ciascuno dei quattro numeratori precedenti lascia il fattore 5 nel denominatore ridotto.",
        "Riducendo 5/40 si ottiene 1/8. Poiché 8 = 2³, la frazione vale 0,001 in binario ed è finita."
      ],
      quadro: [
        {"titolo": "Ricerca del numeratore", "celle": [["denominatore", "40"], ["numeratori", "1 … 39"]], "nota": "Si cerca la prima frazione binaria finita."},
        {"titolo": "Fattori", "celle": [["40", "8 × 5"], ["da eliminare", "5"]], "nota": "Il denominatore ridotto deve contenere solo fattori due."},
        {"titolo": "Primo candidato", "celle": [["numeratore", "5"], ["frazione", "5/40"]], "nota": "I numeratori precedenti lasciano il fattore cinque."},
        {"titolo": "Verifica", "celle": [["ridotta", "1/8"], ["in binario", "0,001"]], "nota": "La rappresentazione richiede tre cifre frazionarie."}
      ]
    }
  );

  prova("1.6.2", "lez06_03_normalize_binary", "Trovare esponente reale e campo con bias",
    "Normalizzare un numero binario significa esprimerlo come significanda compresa fra 1 incluso e 2 escluso, moltiplicata per una potenza di due. In un normale binary32 il campo esponente contiene l’esponente effettivo aumentato di 127.",
    variante(
      "Normalizza 101,1 in base due nella forma 1,f × 2^e. Indica l’esponente e il campo E di binary32 per questo numero normale.",
      [
        numero("Esponente e", "2", "Sposta la virgola finché rimane un solo uno alla sua sinistra."),
        numero("Campo E", "129", "Il bias dei numeri normali binary32 vale 127.")
      ],
      [
        "La significanda normalizzata è 1,011 in base due.",
        "Per ricostruire 101,1 occorre moltiplicarla per 2^(2). L’esponente effettivo è 2.",
        "Si memorizza E = e + 127 = 129. Sottrarre nuovamente il bias consente di verificare il valore."
      ]
    ),
    {
      consegna: "Per 0,00101 in base due un appunto riporta la significanda 1,01 e il campo esponente binary32 E = 130. Controlla se la scala indicata ricostruisce il dato originale, poi determina l’esponente reale e il campo E corretti.",
      campi: [
        numero("Esponente reale corretto", "-3", "Il numero iniziale è inferiore a uno e la significanda normalizzata supera uno."),
        numero("Campo E corretto", "124", "Per un numero normale il campo memorizzato vale 127 più l’esponente reale.")
      ],
      svolgimento: [
        "Spostando la virgola di tre posti a destra si passa da 0,00101 a 1,01. La significanda ottenuta va moltiplicata per 2⁻³ per tornare al numero iniziale.",
        "Il campo proposto E = 130 darebbe l’esponente reale 130 − 127 = 3 e aumenterebbe la significanda di un fattore otto. La scala andrebbe nella direzione sbagliata.",
        "L’esponente reale è dunque −3 e il campo corretto è 127 − 3 = 124. Dividendo 1,01 in base due per otto si ritrova 0,00101."
      ],
      quadro: [
        {"titolo": "Appunto da controllare", "celle": [["dato", "0,00101₂"], ["significanda", "1,01₂"], ["campo E", "130"]], "nota": "La verifica consiste nel ricostruire il dato."},
        {"titolo": "Spostamento della virgola", "celle": [["normalizzazione", "3 posti"], ["scala richiesta", "2⁻³"]], "nota": "La significanda è più grande del valore iniziale."},
        {"titolo": "Campo proposto", "celle": [["130 − 127", "+3"], ["fattore", "8"]], "nota": "Il campo indicato aumenterebbe il valore."},
        {"titolo": "Correzione", "celle": [["esponente", "−3"], ["campo E", "124"]], "nota": "La divisione per otto ricostruisce il dato."}
      ]
    }
  );

  prova("1.6.2", "lez06_04_ieee754_single_decode", "Passare fra un numero normale e la parola binary32",
    "Per un numero normale binary32 la significanda comprende un uno iniziale implicito. Il segno si applica al prodotto fra la significanda e la potenza di due. In lettura si ricava l’esponente reale sottraendo 127 al campo E. In scrittura si compie l’operazione inversa.",
    variante(
      "La parola binary32 è 0x3FC00000. Trova esponente codificato e valore decimale esatto.",
      [
        numero("Campo esponente E", "127", "Preleva gli otto bit dopo il segno."),
        numero("Valore", "1.5", "Per un numero normale aggiungi l’uno implicito e sottrai 127 all’esponente.")
      ],
      [
        "Il segno è 0 e il campo esponente è 01111111 = 127.",
        "La frazione esplicita vale 0,5. La significanda è 1 + 0,5 = 1,5.",
        "Il risultato è (−1)^0 × 1,5 × 2^0 = 1,5."
      ]
    ),
    {
      consegna: "Devi codificare −2,5 come numero normale binary32. Scegli il campo esponente e la parola completa. Le tre parole proposte differiscono per il segno o per la scala.",
      campi: [
        numero("Campo esponente E", "128", "Scrivi il valore assoluto come 1,f in base due moltiplicato per una potenza di due."),
        opzione("Parola binary32", ["0x40200000", "0xC0200000", "0xBFA00000"], "0xC0200000", "Conserva insieme il bit di segno, il campo con bias 127 e la frazione che segue l’uno implicito.")
      ],
      svolgimento: [
        "Il valore assoluto 2,5 vale 10,1 in binario. La forma normale è 1,01 × 2¹, quindi E = 127 + 1 = 128.",
        "Il segno negativo richiede il bit 1. Il campo esponente di otto bit è 10000000 e il campo frazione inizia con 01, seguito da ventuno zeri.",
        "Accostando i campi e raggruppando in quartetti si ottiene 0xC0200000. La parola 0x40200000 cambierebbe il segno e 0xBFA00000 avrebbe scala 2⁰."
      ],
      quadro: [
        {"titolo": "Codifica richiesta", "celle": [["valore", "−2,5"], ["formato", "binary32"]], "nota": "Si costruiscono tre campi separati."},
        {"titolo": "Normalizzazione", "celle": [["valore assoluto", "10,1₂"], ["forma", "1,01₂ × 2¹"]], "nota": "Il campo esponente vale 128.", "tipo": "sequenza"},
        {"titolo": "Campi", "celle": [["segno", "1"], ["esponente", "10000000"], ["frazione", "01 … 0"]], "nota": "La cifra uno iniziale è implicita."},
        {"titolo": "Parola completa", "celle": [["in esadecimale", "0xC0200000"]], "nota": "La ricostruzione dà −1,25 × 2 = −2,5.", "tipo": "sequenza"}
      ]
    }
  );

  prova("1.6.4", "lez06_05_c_float_pitfalls", "Perdita di un incremento in binary32",
    "L’esponente determina la distanza tra due valori binary32 consecutivi. Se la somma esatta cade nel loro punto medio, l’arrotondamento al più vicino sceglie il valore la cui significanda intera termina con zero in binario.",
    variante(
      "In C assumi float binary32, operazioni valutate a precisione binary32 e arrotondamento al più vicino con pareggio verso il pari. Calcola il valore memorizzato dopo aver sommato 1 a 16777216.",
      [
        numero("Somma matematica", "16777217", "Calcola prima tra interi esatti."),
        numero("Valore memorizzato", "16777216", "In questo intervallo i valori binary32 sono distanti due. In parità scegli la significanda con ultimo bit zero.")
      ],
      [
        "La base è 2²⁴ e la distanza tra valori consecutivi è 2^(24−23) = 2.",
        "La somma esatta 16777217 è a metà tra 16777216 e 16777218.",
        "Dividendo i due valori rappresentabili adiacenti per il passo 2 si ottengono due interi consecutivi. Quello pari è 8388608, quindi l’arrotondamento restituisce 16777216."
      ],
      "float x = 16777216.0f;\nx = x + 1.0f;"
    ),
    {
      consegna: "In C considera float binary32, arrotondamento al più vicino con pareggio al pari e ciascuna addizione valutata in binary32. I due accumulatori del listato partono da 16777216. Determina i risultati dopo due incrementi separati o un’unica somma di due.",
      campi: [
        numero("Valore finale di x", "16777216", "Ogni assegnazione a x conserva il risultato arrotondato che verrà usato dalla somma successiva."),
        numero("Valore finale di y", "16777218", "Il successore binary32 di 16777216 dista due.")
      ],
      svolgimento: [
        "Nell’intervallo che comincia da 2²⁴ le parole binary32 adiacenti rappresentano numeri distanti due. 16777217 è a metà fra 16777216 e 16777218.",
        "Il pareggio favorisce 16777216, che ha il bit finale della significanda a zero. Dopo la prima assegnazione x torna al valore iniziale e la seconda incontra lo stesso pareggio.",
        "y riceve 16777216 + 2 = 16777218, già rappresentabile. Al termine x vale 16777216 e y vale 16777218. Il diverso numero di arrotondamenti distingue le due sequenze."
      ],
      quadro: [
        {"titolo": "Due accumulatori", "celle": [["inizio di x", "16777216"], ["inizio di y", "16777216"]], "nota": "x riceve due incrementi, y una sola addizione.", "tipo": "confronto"},
        {"titolo": "Griglia locale", "celle": [["primo", "16777216"], ["successore", "16777218"]], "nota": "Il risultato esatto di un incremento sta a metà."},
        {"titolo": "Due assegnazioni a x", "celle": [["dopo +1", "16777216"], ["dopo +1 ancora", "16777216"]], "nota": "La seconda addizione riparte dal valore arrotondato.", "tipo": "sequenza"},
        {"titolo": "Somma singola", "celle": [["x", "16777216"], ["y", "16777218"]], "nota": "L’incremento di due coincide con la distanza fra i candidati."}
      ],
      codice: "float x = 16777216.0f, y = x;\nx = x + 1.0f;\nx = x + 1.0f;\ny = y + 2.0f;"
    }
  );

  // Capitolo 1.7
  prova("1.7.2", "", "Decodificare un record di telemetria",
    "Nel record TLM1 la lunghezza del nome UTF-8 è misurata in byte. Il primo byte dopo il nome avvia una temperatura intera con segno in big-endian. Dopo la temperatura viene una tensione binary32 in little-endian.",
    variante(
      "Il record TLM1 contiene 54 4C 4D 31 01 01 5A 00 64 00 00 80 3F. Dopo firma, flag e lunghezza, leggi il nome UTF-8, la temperatura int16 big-endian in centesimi di °C e la tensione binary32 little-endian.",
      [
        numero("Byte del nome", "1", "L’ottetto all’offset 5 contiene il conteggio."),
        numero("Temperatura in °C", "1", "Interpreta il campo a 16 bit con segno, poi applica la scala."),
        numero("Tensione in V", "1", "Riordina i quattro byte finali per leggere la word IEEE 754.")
      ],
      [
        "La firma è TLM1, i flag valgono 1 e il nome occupa 1 byte: 5A corrisponde a Z.",
        "La temperatura comincia all’offset 7. I byte 00 64 danno 100 con segno, cioè 1 °C.",
        "La tensione comincia all’offset 9. I byte in little-endian danno la word 0x3F800000 e il valore 1 V. La lunghezza complessiva torna: 12 + 1 = 13 byte."
      ]
    ),
    {
      consegna: "Un record TLM1 integro contiene 54 4C 4D 31 03 03 41 C3 A8 FF 85 00 00 20 41. Il nome inizia all’offset 6 e la sua lunghezza in byte è all’offset 5. Il software visualizza −312,33 °C. Calcola l’offset del primo byte della temperatura e scegli la correzione che ripristina la lettura int16 big-endian in centesimi di grado. Ordina infine le operazioni con cui il lettore ricava la temperatura.",
      campi: [
        numero("Offset iniziale della temperatura", "9", "Usa la lunghezza del nome in byte, compresa la lettera multibyte."),
        opzione("Correzione della lettura", ["assegnare peso 256 a FF", "assegnare peso 256 a 85", "leggere la misura senza segno"], "assegnare peso 256 a FF", "Confronta le due word formate da FF e 85 con il valore mostrato."),
        numero("Temperatura corretta in °C", "-1.23", "Sottrai 65536 al codice unsigned quando il bit di segno vale uno, poi dividi per cento."),
        {"label": "Dalla lunghezza al valore fisico", "ordine": ["leggere la lunghezza del nome", "calcolare l’offset della temperatura", "leggere i due byte del campo", "convertire i centesimi in gradi"], "answer": "leggere la lunghezza del nome → calcolare l’offset della temperatura → leggere i due byte del campo → convertire i centesimi in gradi", "numeric": false, "hint": "Ciascuna operazione riceve dal passaggio precedente un valore necessario."}
      ],
      svolgimento: [
        "Il byte all’offset 5 vale 03. I tre byte del nome sono 41 C3 A8 e occupano gli offset da 6 a 8. La temperatura comincia perciò all’offset 9, dove si trovano FF 85.",
        "Se 85 riceve il peso 256, la parola è 0x85FF = 34303. In int16 vale 34303 − 65536 = −31233 centesimi, precisamente la misura visualizzata.",
        "Il formato richiede peso 256 per il primo byte. FF85 vale 65413 senza segno, quindi 65413 − 65536 = −123 in int16. La temperatura corretta è −1,23 °C."
      ],
      quadro: [
        {"titolo": "Resoconto del lettore", "celle": [["nome in byte", "03"], ["temperatura letta", "−312,33 °C"]], "nota": "Il campo temperatura usa due byte big-endian."},
        {"titolo": "Confini", "celle": [["nome", "offset 6 … 8"], ["temperatura", "offset 9"]], "nota": "I primi byte del campo sono FF 85."},
        {"titolo": "Lettura difettosa", "celle": [["parola", "85FF"], ["centesimi", "−31233"]], "nota": "Il risultato osservato denuncia l’inversione dei pesi.", "tipo": "sequenza"},
        {"titolo": "Lettura corretta", "celle": [["parola", "FF85"], ["centesimi", "−123"], ["misura", "−1,23 °C"]], "nota": "All’offset minore si trova il byte di peso 256.", "tipo": "sequenza"}
      ]
    }
  );

  prova("1.7.3", "", "Controllare una dimensione prima dell’allocazione",
    "L’allocatore è il componente al quale il programma chiede di riservare memoria. Una riga dell’immagine occupa tanti byte quanti sono i pixel in larghezza moltiplicati per i byte per pixel. Il tipo uint32 rappresenta interi senza segno da 0 a 2³² − 1 = 4294967295; un MiB, mebibyte, contiene 2²⁰ = 1048576 byte. La capacità utilizzabile è il minore fra il budget di memoria e il massimo conteggio rappresentabile dall’allocatore. Si calcolano prima le dimensioni esatte e poi si applicano entrambi i limiti. Per ricavare quante righe intere entrino nel budget si divide la capacità per i byte di una riga, conservando il quoziente intero; il resto sono i byte ancora disponibili.",
    variante(
      "Un’immagine RGBA richiede quattro byte per pixel, senza spazi tra righe. Larghezza 65536, altezza 65536, budget 64 MiB. Le dimensioni destinate all’allocatore devono entrare in uint32.",
      [
        numero("Dimensione matematica in byte", "17179869184", "Calcola in un tipo più ampio e includi i quattro canali."),
        opzione("Decisione", ["allocare", "rifiutare"], "rifiutare", "Verifica separatamente il limite del tipo e il budget.")
      ],
      [
        "Il numero di pixel è 65536 × 65536 = 4294967296.",
        "Il contenuto richiede 4294967296 × 4 = 17179869184 byte, da confrontare con 4294967295 come massimo del tipo.",
        "Il budget è 67108864 byte. Il valore eccede entrambi i vincoli: la richiesta viene rifiutata prima della conversione."
      ]
    ),
    {
      consegna: "Una telecamera produce righe di 1536 pixel RGBA, quattro byte per pixel senza riempimento. Il budget è 4 MiB (4194304 byte) e il conteggio richiesto dall’allocatore deve essere rappresentabile in uint32. Trova l’altezza massima in righe intere e il numero di byte ancora disponibili a quell’altezza.",
      campi: [
        numero("Numero massimo di righe", "682", "Dividi il minore fra budget e massimo uint32 per i byte di una riga."),
        numero("Byte residui", "4096", "Sottrai dal budget il prodotto fra altezza e byte per riga.")
      ],
      svolgimento: [
        "Una riga richiede 1536 × 4 = 6144 byte. Il budget di 4194304 byte è inferiore al massimo uint32, pari a 4294967295, perciò qui limita il budget.",
        "La divisione intera dà 4194304 = 682 × 6144 + 4096. Le 682 righe occupano 4190208 byte e lasciano 4096 byte liberi.",
        "Una riga ulteriore richiederebbe 6144 byte. I 4096 rimasti sono insufficienti, quindi 682 è l’altezza massima ammessa da entrambi i vincoli."
      ],
      quadro: [
        {"titolo": "Progetto dell’immagine", "celle": [["larghezza", "1536 pixel"], ["budget", "4 MiB"]], "nota": "La grandezza da scegliere è il numero delle righe."},
        {"titolo": "Costo unitario", "celle": [["pixel per riga", "1536"], ["byte per riga", "6144"]], "nota": "Il budget è il limite più restrittivo."},
        {"titolo": "Divisione del budget", "celle": [["righe intere", "682"], ["resto", "4096 byte"]], "nota": "Il quoziente esprime righe complete."},
        {"titolo": "Prova di massimalità", "celle": [["una riga", "6144 byte"], ["ancora liberi", "4096 byte"]], "nota": "Lo spazio residuo è inferiore al costo di una riga.", "tipo": "confronto"}
      ]
    }
  );

  prova('1.7.7','','Diagnosticare una copia alterata',
    "Nel formato TLM1 la lunghezza totale dipende dal numero di byte del nome. Dopo il controllo della dimensione, una maschera sul byte dei flag permette di riconoscere le posizioni riservate.",
    ...[['taglio','Record troncato'],['flag','Bit riservati attivi']].map(([guasto,esito])=>{
      let a=codificaTlm('Z',1,100,1);if(guasto==='taglio')a=a.slice(0,-2);else a[4]=0x81;
      return variante('Nel file si attende un solo record TLM1. La lunghezza è 12 + n, con n all’offset 5, e nei flag sono ammessi soltanto i bit 0 e 1. Analizza '+bytes(a)+'.',
        [numero('Lunghezza attesa',13,'Leggi la lunghezza del nome e aggiungi i campi fissi.'),opzione('Prima causa di rifiuto',['Record troncato','Bit riservati attivi','Firma errata'],esito,'Verifica prima il prefisso e la dimensione, poi la maschera 0xFC dei flag.')],
        ['I primi quattro byte sono 54 4C 4D 31 e la firma è corretta.','Il byte di lunghezza del nome vale 1, quindi la lunghezza richiesta è 12 + 1 = 13. Sono presenti '+a.length+' byte.',guasto==='taglio'?'Mancano gli ultimi due byte del campo tensione. La diagnosi è troncamento e il valore in volt resta indeterminato.':'Il conteggio è corretto. Applicando al campo flag 0x81 la maschera 0xFC si ottiene 0x80. Il bit 7 è riservato e la copia viene rifiutata.']);
    }));

  prova("1.7.4", "", "Applicare la politica di modifica",
    "W indica l’abilitazione alla scrittura, O il ruolo di proprietario e A il ruolo di amministratore; ciascun indicatore vale zero se assente e uno se presente. La validità del byte viene controllata prima dei permessi: le posizioni riservate devono avere valore zero. Per un byte valido, AND richiede che entrambe le condizioni siano vere, mentre OR richiede almeno una condizione vera e accetta anche il caso in cui lo siano entrambe. La regola W AND (O OR A) richiede perciò W insieme ad almeno uno dei due ruoli. Per trovare una modifica minima si conta quanti indicatori inizialmente a zero debbano diventare uno per soddisfare entrambi i requisiti.",
    variante(
      "Il byte di autorizzazione è valido: i bit riservati valgono zero. Il servizio accorda la modifica quando W AND (O OR A) vale uno. Per W=1, O=0, A=1, calcola la verifica del ruolo e la decisione finale.",
      [
        numero("O OR A", "1", "L’OR è inclusivo."),
        numero("Decisione finale come bit", "1", "Il permesso di scrittura è un requisito distinto dal ruolo.")
      ],
      [
        "I ruoli presenti sono O=0 e A=1.",
        "La loro disgiunzione vale 1 perché almeno uno dei due è attivo.",
        "Applicando AND con W=1 si ottiene 1. La modifica è concessa."
      ]
    ),
    {
      consegna: "Un account deve poter modificare un file quando W AND (O OR A) vale uno. W abilita la scrittura, O segnala il proprietario e A l’amministratore. Il byte è valido e inizialmente W=0, O=0, A=0. Determina il numero minimo di bit da attivare e scegli una modifica minima che conceda l’accesso.",
      campi: [
        numero("Numero minimo di attivazioni", "2", "I due ingressi della AND finale devono essere entrambi veri."),
        opzione("Modifica minima sufficiente", ["attivare O e A", "attivare soltanto W", "attivare W e O"], "attivare W e O", "Uno dei bit scelti deve abilitare la scrittura, l’altro deve rendere vera la condizione sul ruolo.")
      ],
      svolgimento: [
        "Partendo da tre zeri bisogna rendere vero W e anche O OR A. Attivare soltanto W lascia falso il ruolo. Attivare soltanto O oppure A lascia falsa l’abilitazione.",
        "Servono dunque almeno due modifiche. Attivare W e O dà 1 AND (1 OR 0) = 1 e dimostra che due modifiche bastano.",
        "Anche W e A sarebbe una coppia minima valida. Fra le opzioni offerte, soltanto W e O soddisfa entrambi i requisiti. I bit riservati rimangono a zero."
      ],
      quadro: [
        {"titolo": "Stato iniziale", "celle": [["W", "0"], ["O", "0"], ["A", "0"]], "nota": "Il formato del byte è valido."},
        {"titolo": "Vincoli indipendenti", "celle": [["scrittura", "W"], ["ruolo", "O OR A"]], "nota": "Ciascun termine della AND finale deve valere uno.", "tipo": "confronto"},
        {"titolo": "Una soluzione minima", "celle": [["W", "1"], ["O", "1"], ["A", "0"]], "nota": "Un’autorità sul ruolo si aggiunge al bit di scrittura."},
        {"titolo": "Controllo", "celle": [["modifiche", "2"], ["decisione", "concessa"]], "nota": "Anche la coppia W e A soddisfa la politica."}
      ]
    }
  );

  // Questi listati sono dati della consegna, consultabili prima della verifica.
  for (const v of SL.prove['1.6'][4].varianti) v.listato = v.codice;
}());
