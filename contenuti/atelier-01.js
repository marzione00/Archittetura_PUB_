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
        passo('Lettura della firma',file==='manca'?'La shell segnala l’errore al chiamante.':a.length?'Il lettore acquisisce quattro byte e li confronta con TLM1.':'La lettura restituisce zero byte alla fine del file.', ['Primo byte',a.length?'0x'+hex(a[0]):'assente'],['Esito',file==='valido'?'firma accettata':file==='errato'?'firma diversa':file==='vuoto'?'prefisso troncato':'errore di apertura'])];
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

  prova('1.1.1','lez01_01_layers_order','Dalla richiesta al dispositivo',
    "La libreria C gestisce i flussi associati alle funzioni di I/O. Il kernel verifica i descrittori aperti e trasferisce i byte verso l’oggetto indicato dal descrittore.",
    variante('Un lettore C usa fread per riempire un buffer vuoto da un file locale. I dati sono già nella cache del kernel. Chi offre fread e chi controlla il descrittore?',
      [opzione('Chi offre fread?',['libreria C','kernel','controller del disco'],'libreria C','Una funzione della libreria standard può a sua volta richiedere al kernel una lettura.'),
        opzione('Chi controlla il descrittore?',['libreria C','kernel','compilatore'],'kernel','Il descrittore appartiene alle risorse aperte del processo.')],
      ['Il lettore chiama fread, che appartiene alla libreria standard C.','Per riempire il proprio buffer, la libreria può richiedere una lettura al kernel attraverso il descrittore.','Il kernel verifica il descrittore e può servire i byte dalla cache. La libreria li rende disponibili al chiamante.']),
    variante('Un programma esegue puts("OK") e svuota il flusso stdout diretto su un terminale. Chi aggiunge LF e quale descrittore riceve i byte?',
      [opzione('Chi aggiunge LF?',['libreria C','driver della tastiera','CPU durante la compilazione'],'libreria C','Considera il contratto di puts.'),numero('Numero del descrittore',1,'I descrittori standard sono ordinati come ingresso, uscita, errore.')],
      ['puts riceve i due caratteri di OK e aggiunge il carattere di fine riga LF.','La libreria consegna 4F 4B 0A al sistema attraverso stdout.','Nel processo considerato, il flusso stdout usa il descrittore 1, collegato al terminale.']));

  prova('1.1.2','lez01_02_hardware_roles','Seguire una lettura dalla memoria',
    "In una memoria indirizzabile a byte, lo spostamento dalla base conta le celle a partire da zero. L’indirizzo seleziona la cella. I bit conservati in quella cella costituiscono il dato.",
    ...[[0x1200,2,[8,14,97,42]],[0x2000,3,[41,52,63,74]]].map(([base,k,mem])=>
      variante('La CPU legge un byte alla base 0x'+hex(base,4)+' più '+k+'. Le celle a indirizzi crescenti contengono '+bytes(mem)+' in esadecimale. Determina indirizzo e dato.',
        [numero('Indirizzo finale',base+k,'Lo spostamento è in byte.'),numero('Valore del dato in decimale',mem[k],'Conta le celle dalla posizione zero e converti le due cifre esadecimali.')],
        ['L’unità di indirizzamento somma 0x'+hex(base,4)+' e '+k+' e produce 0x'+hex(base+k,4)+'.','La memoria seleziona la cella con indice '+k+' nella sequenza e restituisce 0x'+hex(mem[k])+'.','L’espansione posizionale dà '+(mem[k]>>4)+' × 16 + '+(mem[k]&15)+' = '+mem[k]+'. Il registro riceve questo valore.'])));

  prova('1.1.4','lez01_03_special_paths','Ricostruire un percorso',
    "La risoluzione di un percorso relativo parte dalla directory corrente. Un nome ordinario aggiunge un livello, «.» mantiene il livello corrente e «..» raggiunge il genitore.",
    ...[['/home/lea/src','../dati/./a','/home/lea/dati/a','/home/lea/dati','a'],['/srv/archivio/prove','../../log/./ieri','/srv/log/ieri','/srv/log','ieri']].map(([dir,rel,out,gen,figlio])=>
      variante('La directory corrente è '+dir+'. Considera '+rel+' in un albero con directory esistenti e senza link simbolici. Scegli il percorso finale.',
        [opzione('Percorso assoluto',[out,dir+'/'+figlio,'/'+figlio],out,'Ogni componente .. elimina un livello dalla directory raggiunta.')],
        ['Il percorso è relativo e la ricerca parte da '+dir+'.','Attraversando le componenti prima del nome finale si arriva a '+gen+'. Il punto conserva la directory corrente.','Si cerca '+figlio+' dentro '+gen+' e si ottiene '+out+'.'])));

  prova('1.1.6','lez01_04_filesystem_ops','Prevedere il contenuto di un file',
    "La shell stabilisce la destinazione di una redirezione prima di eseguire il comando. > tronca il file, mentre >> colloca i nuovi byte alla fine del contenuto esistente.",
    ...[['>>',4,'41 0A 42 0A','in coda'],['>',2,'42 0A','dopo il troncamento']].map(([op,n,contenuto,modo])=>
      variante('Il file dati contiene A e LF. Esegui printf \'B\\n\' '+op+' dati in una shell POSIX. Quanti byte restano e quale sequenza contengono?',
        [numero('Byte nel file',n,'Il carattere di fine riga occupa un byte.'),opzione('Sequenza esadecimale',['41 0A','42 0A','41 0A 42 0A'],contenuto,'Verifica se l’apertura conserva il contenuto precedente.')],
        ['Prima del comando i byte sono 41 0A.','La redirezione '+op+' colloca la scrittura '+modo+'. printf produce 42 0A.','I byte finali sono '+contenuto+', quindi la lunghezza è '+n+'.'])));

  prova('1.1.3','lez01_05_build_pipeline','Localizzare una fase di costruzione',
    "Il compilatore può tradurre una chiamata conoscendo la dichiarazione della funzione. La definizione può trovarsi in un altro file oggetto, che il collegatore deve trovare per costruire l’eseguibile.",
    variante('hello.c chiama una funzione dichiarata in un header. gcc -c hello.c riesce e produce hello.o. Durante la creazione dell’eseguibile compare «undefined reference» per quella funzione.',
      [opzione('Fase che segnala il problema',['preelaborazione','assemblaggio','collegamento'],'collegamento','L’oggetto contiene ancora riferimenti a simboli esterni.'),opzione('Azione pertinente',['aggiungere l’oggetto che definisce la funzione','cambiare il PID','rinominare il file .o in .c'],'aggiungere l’oggetto che definisce la funzione','La dichiarazione specifica il tipo della funzione. La definizione ne fornisce il corpo.')],
      ['Il compilatore conosce la firma dalla dichiarazione e può produrre codice per la chiamata.','L’assemblatore crea un oggetto che conserva il riferimento esterno.','Il collegatore cerca una definizione. Fornire l’oggetto o la libreria corretti risolve il simbolo.']),
    variante('Esegui gcc -S hello.c. Quale file ottieni per impostazione predefinita e quale fase lo traduce in un oggetto?',
      [opzione('File prodotto',['hello.i','hello.s','hello.o'],'hello.s','L’opzione -S arresta la catena alla forma assembly.'),opzione('Fase successiva',['preelaborazione','assemblaggio','collegamento'],'assemblaggio','Un oggetto contiene istruzioni già codificate.')],
      ['Il preprocessore espande le direttive di hello.c.','La compilazione traduce il sorgente in istruzioni assembly e conserva hello.s.','L’assemblatore può leggere hello.s e codificare le istruzioni in hello.o.']));

  prova('1.2.1','lez02_01_voltage_to_bits','Da segnali fisici a capacità binaria',
    "Una misura garantisce un bit quando rientra nella fascia bassa o in quella alta del ricevitore. Con n bit indipendenti si formano 2ⁿ configurazioni. Il valore di una configurazione dipende dall’ordine dei suoi bit.",
    ...[[[400,2250,700],2],[[2400,2100,300,650],12]].map(([misure,valore])=>{
      const b=misure.map(x=>Number(x>=2000)).join('');
      return variante('Il livello basso è garantito fino a 800 mV e quello alto da 2000 mV. Dal bit più significativo al meno significativo misuri '+misure.join(', ')+' mV. Ricava valore e capacità della parola.',
        [numero('Valore senza segno',valore,'Tratta ogni tensione come un bit e somma i pesi attivi.'),numero('Configurazioni possibili',2**misure.length,'Ogni linea indipendente raddoppia il numero di configurazioni.')],
        ['I confronti con le soglie danno, nell’ordine, '+b+'.','I pesi da sinistra sono '+misure.map((_,i)=>2**(misure.length-i-1)).join(', ')+'. Le posizioni a uno sommano a '+valore+'.','Con '+misure.length+' linee hai 2^'+misure.length+' = '+2**misure.length+' configurazioni, incluso lo zero.']);
    }));

  prova('1.2.2','lez02_02_dec_to_bin','Scomporre un intero in potenze di due',
    "Un intero positivo è la somma dei pesi delle sue posizioni binarie a uno. La potenza di due più grande compresa nel numero identifica il bit più significativo.",
    ...[45,86].map(x=>{
      const pesi=[64,32,16,8,4,2,1].filter(b=>b&x);
      return variante('Converti '+x+' in binario senza zeri iniziali. Indica indice del bit più alto, numero di bit attivi e parola.',
        [numero('Indice del bit più alto',Math.floor(Math.log2(x)),'Cerca la massima potenza di due minore o uguale al numero.'),numero('Bit a uno',pesi.length,'Conta gli addendi della scomposizione.'),opzione('Parola',[x.toString(2),(x+1).toString(2),(x+2).toString(2)],x.toString(2),'Confronta ciascun peso con il resto.')],
        ['Il primo peso utile è '+pesi[0]+', cioè 2^'+Math.floor(Math.log2(x))+'.','Le sottrazioni successive individuano '+pesi.join(' + ')+' = '+x+'.','Scrivendo uno in quelle posizioni si legge '+x.toString(2)+'. Conta '+pesi.length+' cifre uno.']);
    }));

  prova('1.2.2','lez02_03_bin_to_hex','Raggruppare i bit in cifre esadecimali',
    "Ogni cifra esadecimale codifica quattro bit. Per conservare i pesi si formano i gruppi partendo dal lato meno significativo e si completa con zeri soltanto il gruppo più a sinistra.",
    ...[0xB6,0x2ED].map(x=>{
      const s=x.toString(2),g=s.padStart(4*Math.ceil(s.length/4),'0').match(/.{4}/g),h=x.toString(16).toUpperCase();
      return variante('Converti la parola binaria '+s+' in esadecimale. Ogni gruppo completo ha quattro bit.',
        [numero('Gruppi necessari',g.length,'Parti dal lato meno significativo.'),opzione('Scrittura esadecimale',[h,(x+0x10).toString(16).toUpperCase(),(x^3).toString(16).toUpperCase()],h,'Una cifra esadecimale rappresenta un valore da zero a quindici.')],
        ['Aggiungi eventuali zeri sul lato sinistro e separa '+g.join(' | ')+'.','I gruppi valgono '+g.map(n=>parseInt(n,2)).join(', ')+' in decimale.','Le cifre corrispondenti formano 0x'+h+'. La conversione ha richiesto '+g.length+' gruppi.']);
    }));

  prova('1.2.3','lez02_04_hex_to_dec','Calcolare una distanza fra indirizzi',
    "In esadecimale ogni posizione pesa una potenza di sedici. Sottrarre la base dall’indirizzo della cella dà lo spostamento in byte nei sistemi con indirizzamento a byte.",
    ...[[0x180,0x1A6],[0x2F0,0x315]].map(([base,x])=>
      variante('Un buffer parte da 0x'+hex(base)+' e una cella si trova a 0x'+hex(x)+'. Calcola l’indirizzo finale in decimale e lo spostamento in byte.',
        [numero('Indirizzo finale in decimale',x,'Sviluppa le cifre secondo i pesi 256, 16 e 1.'),numero('Spostamento',x-base,'Sottrai l’indirizzo iniziale da quello finale.')],
        ['La base 0x'+hex(base)+' equivale a '+base+' in decimale.','Il secondo indirizzo vale '+(x>>8)+' × 256 + '+((x>>4)&15)+' × 16 + '+(x&15)+' = '+x+'.','Lo spostamento è '+x+' − '+base+' = '+(x-base)+' byte. Sommato alla base riconduce alla cella richiesta.'])));

  prova('1.2.4','lez02_05_utf8_bytes_and_ascii','Dimensionare un buffer per il testo',
    "In UTF-8 le lettere ASCII occupano un solo byte, mentre altri caratteri ne richiedono più di uno. La capacità di una stringa C deve comprendere anche il terminatore zero.",
    ...['Aè','Z€'].map(s=>{
      const a=encoder.encode(s),k=Array.from(s).length;
      return variante('Memorizza «'+s+'» come stringa C in UTF-8. Conta i byte del testo e la capacità minima del buffer, terminatore compreso.',
        [numero('Byte del testo',a.length,'La lettera ASCII occupa un byte. Controlla la lunghezza del carattere successivo.'),numero('Capacità minima',a.length+1,'Una stringa C richiede un byte finale pari a zero.')],
        ['Il testo contiene '+k+' punti di codice. Il primo rientra in ASCII.','La sequenza UTF-8 è '+bytes(a)+' e occupa '+a.length+' byte.','Si accoda 00 come terminatore. Il buffer richiede almeno '+(a.length+1)+' byte.']);
    }));

  prova('1.3.1','lez03_01_same_bits_two_meanings','Distinguere codice, cifra e bit attivi',
    "Il byte che memorizza una cifra ASCII può essere letto come intero oppure interpretato secondo la tabella dei caratteri. I quattro bit di ciascuna cifra esadecimale permettono anche di contare le posizioni a uno.",
    ...[3,7].map(n=>{
      const a=n+48,k=bin(a).split('1').length-1;
      return variante('Per il byte 0x'+hex(a)+' indica il valore come intero senza segno, la cifra rappresentata in ASCII e quanti bit del byte sono attivi.',
        [numero('Intero senza segno',a,'Moltiplica la cifra esadecimale alta per 16.'),numero('Cifra rappresentata',n,'Le cifre ASCII cominciano da 0x30.'),numero('Bit a uno',k,'Leggi i due gruppi di quattro bit.')],
        ['0x'+hex(a)+' = 3 × 16 + '+n+' = '+a+'.','La distanza da 0x30 è '+n+', perciò il carattere è la cifra '+n+'.','La configurazione '+bin(a)+' contiene '+k+' bit a uno.']);
    }));

  prova('1.3.1','lez03_02_ascii_hex_string','Leggere una stringa terminata da NUL',
    "Una stringa C termina al primo byte 00 a partire dall’indirizzo iniziale. I byte che seguono quel terminatore possono appartenere all’array senza far parte della stringa.",
    ...[['RED','Z'],['OK','AB']].map(([s,coda])=>{
      const a=encoder.encode(s+'\0'+coda);
      return variante('Un array contiene '+bytes(a)+' (esadecimale). Determina la lunghezza della stringa C all’inizio dell’array e il suo ultimo carattere stampabile.',
        [numero('Lunghezza della stringa',s.length,'Cerca il primo byte 00.'),opzione('Ultimo carattere della stringa',[s.at(-1),s[0],coda.at(-1)],s.at(-1),'Le celle successive al terminatore appartengono al resto dell’array.')],
        ['Il primo 00 è all’indice '+s.length+' contando da zero.','I byte dal primo alla posizione precedente formano il testo ASCII '+s+'.','La lunghezza è '+s.length+' e l’ultimo carattere è '+s.at(-1)+'. Il resto dell’array contiene '+coda+'.']);
    }));

  prova('1.3.2','lez03_03_utf8_decode','Decodificare i gruppi utili in UTF-8',
    "Nel primo byte UTF-8 il prefisso determina la lunghezza della sequenza. Ogni byte di continuazione comincia con 10 e contribuisce con i sei bit restanti al punto di codice.",
    ...['è','€'].map(s=>{
      const a=encoder.encode(s),g=Array.from(a,(x,i)=>x&(i?63:a.length===2?31:15)),v=s.codePointAt(0);
      return variante('La sequenza valida '+bytes(a)+' rappresenta un solo carattere UTF-8. Ricava il numero di continuazioni e il punto di codice in decimale.',
        [numero('Byte di continuazione',a.length-1,'Leggi gli uno iniziali del primo ottetto.'),numero('Punto di codice',v,'Togli i prefissi, poi accoda ogni gruppo di sei bit.')],
        ['Il primo ottetto '+bin(a[0])+' annuncia '+a.length+' byte in totale, dei quali '+(a.length-1)+' sono continuazioni.','I gruppi utili, espressi in decimale, sono '+g.join(', ')+'. Per ogni gruppo successivo, moltiplica il valore accumulato per 64 e aggiungi i sei bit utili del nuovo byte.','Il calcolo '+g.map((z,i)=>z+' × '+64**(g.length-i-1)).join(' + ')+' dà '+v+', cioè U+'+hex(v,4)+' ('+s+').']);
    }));

  prova('1.3.3','lez03_04_rgb_image_size','Localizzare un canale in un’immagine RGB',
    "Un pixel RGB24 occupa tre byte consecutivi, uno per ciascun canale. Per raggiungere un canale si sommano tre spostamenti misurati in byte: quello della riga, quello del pixel nella riga e quello del canale nel pixel.",
    ...[[8,4,3,2,1],[5,6,4,3,2]].map(([w,h,x,y,c])=> {
      const canale=['R','G','B'][c],indice=w*y+x;
      return variante('Un’immagine RGB24 misura '+w+' × '+h+' pixel, righe contigue senza riempimento. L’origine delle coordinate coincide con il primo pixel in memoria. x cresce lungo le righe, y nell’ordine in cui sono memorizzate. I canali si susseguono come R, G, B. Localizza il byte '+canale+' del pixel ('+x+', '+y+').',
        [numero('Dimensione totale in byte',w*h*3,'Moltiplica i pixel per i tre byte di ciascun pixel.'),numero('Offset del canale',indice*3+c,'Conta prima le righe complete e poi i pixel nella riga corrente.')],
        ['Ogni riga occupa '+w+' × 3 = '+(w*3)+' byte. L’intera immagine occupa '+(w*h*3)+' byte.','L’indice lineare del pixel è '+y+' × '+w+' + '+x+' = '+indice+'.','Il pixel comincia al byte '+(3*indice)+'. Il canale '+canale+' dista '+c+' byte dal suo inizio e si trova all’offset '+(3*indice+c)+'.']);
    }));

  prova('1.3.5','lez03_05_multi_interpretation','Due ottetti, tre letture',
    "Gli indirizzi determinano la successione dei byte. Il testo ASCII si legge un byte per volta. In un intero a sedici bit, invece, l’ordine dei byte stabilisce quale valore moltiplicare per 256.",
    ...[[0x41,0x42],[0x4F,0x4B]].map(([a,b])=>{
      const s=String.fromCharCode(a,b);
      return variante('Leggi '+bytes([a,b])+' come coppia ASCII e come intero senza segno di 16 bit nei due ordini di byte.',
        [opzione('Testo',[s,s[1]+s[0],'00'],s,'Decodifica in ordine di indirizzo.'),numero('Intero big-endian',a*256+b,'Il primo byte pesa 256.'),numero('Intero little-endian',b*256+a,'Il secondo byte pesa 256.')],
        ['Le due celle individuano i caratteri '+s[0]+' e '+s[1]+'. Il testo è '+s+'.','In big-endian si calcola '+a+' × 256 + '+b+' = '+(a*256+b)+'.','In little-endian si calcola '+b+' × 256 + '+a+' = '+(b*256+a)+'. La sequenza in memoria resta quella fornita.']);
    }));

  prova('1.4.1','lez04_01_encode_negative_twos','Codificare un numero negativo su otto bit',
    "Per codificare un intero negativo su otto bit si può invertire ogni bit del suo valore assoluto e aggiungere uno. Il risultato coincide con il residuo dell’intero modulo 256.",
    ...[37,84].map(n=>{
      const u=256-n;
      return variante('Rappresenta −'+n+' in complemento a due su otto bit. Trova la parola dopo l’inversione dei bit del modulo e la parola finale, in decimale senza segno.',
        [numero('Dopo l’inversione',255-n,'Il complemento bit a bit di un byte x vale 255 − x.'),numero('Byte finale',u,'Al complemento bit a bit aggiungi un’unità.')],
        ['Il valore assoluto '+n+' si scrive '+bin(n)+'.','Inverti ogni bit: '+bin(255-n)+', pari a '+(255-n)+'.','Aggiungi uno e ottieni '+bin(u)+', cioè '+u+'. Verifica: '+u+' − 256 = −'+n+'.']);
    }));

  prova('1.4.1','lez04_02_decode_twos','Leggere una parola con e senza segno',
    "Una parola di n bit ammette una lettura senza segno e una in complemento a due. Se il bit più significativo vale uno, la lettura con segno si ricava sottraendo 2ⁿ alla lettura senza segno.",
    ...[[8,0xD2],[16,0xFF45]].map(([n,u])=>{
      const m=2**n,s=u-m;
      return variante('La parola di '+n+' bit 0x'+hex(u,n/4)+' viene letta sia senza segno sia in complemento a due. Determina i due risultati.',
        [numero('Senza segno',u,'Sviluppa le cifre esadecimali con i pesi posizionali.'),numero('Con segno',s,'Osserva il bit di peso massimo e applica il modulo della larghezza scelta.')],
        ['Convertendo 0x'+hex(u,n/4)+' come intero senza segno si ottiene '+u+'.','Il bit '+(n-1)+' vale uno. In complemento a due il valore con segno si trova sottraendo 2^'+n+' = '+m+'.','La differenza '+u+' − '+m+' = '+s+'. Aggiungendo il modulo al valore negativo ritrovi il codice di partenza.']);
    }));

  prova('1.4.1','lez04_03_signed_range','Determinare gli estremi rappresentabili',
    "In complemento a due il bit più significativo pesa −2ⁿ⁻¹ per una parola di n bit. Gli altri bit hanno pesi positivi: le loro combinazioni determinano il minimo, il massimo e il numero di valori distinti.",
    ...[7,12].map(n=>{
      const p=2**(n-1);
      return variante('In un formato in complemento a due di '+n+' bit calcola minimo, massimo e numero di valori.',
        [numero('Minimo',-p,'Il bit di segno ha peso negativo.'),numero('Massimo',p-1,'Attiva tutti i bit tranne quello di segno.'),numero('Numero di valori',2*p,'Conta tutte le configurazioni delle posizioni.')],
        ['Il bit più alto pesa −2^'+(n-1)+' = −'+p+'. Con le altre posizioni a zero ottieni il minimo.','Con il bit alto a zero e gli altri a uno la somma dei pesi è '+p+' − 1 = '+(p-1)+'.','L’intervallo [−'+p+', '+(p-1)+'] comprende '+(2*p)+' valori, quanti i codici formati da '+n+' bit.']);
    }));

  prova('1.4.2','lez04_04_fixed_width_add_sub','Calcolare risultato e flag su un byte',
    "Un’operazione su otto bit conserva il residuo modulo 256. La convenzione x86 usa CF per il riporto o il prestito della lettura senza segno e OF per il risultato fuori intervallo della lettura con segno.",
    ...[[0xF4,0x18,true],[0x7F,0xFF,false]].map(([a,b,add])=>{
      const raw=add?a+b:a-b,s=add?segno8(a)+segno8(b):segno8(a)-segno8(b),r=raw&255;
      const cf=Number(add?raw>255:raw<0),of=Number(s< -128||s>127),op=add?' + ':' − ';
      return variante('Un’ALU a otto bit esegue 0x'+hex(a)+op+'0x'+hex(b)+'. Usa la convenzione x86 per CF (riporto in addizione, prestito in sottrazione).',
        [numero('Risultato come byte senza segno',r,'Riduci l’operazione modulo 256.'),numero('CF',cf,'Valuta l’operazione tra i due operandi senza segno.'),numero('OF',of,'Confronta l’operazione matematica con segno con [−128, 127].')],
        ['Leggendo gli operandi senza segno, il calcolo matematico dà '+a+op+b+' = '+raw+'. Il residuo modulo 256 è '+r+' (0x'+hex(r)+').','Il risultato matematico '+(cf?'esce da':'rientra in')+' [0, 255]. CF vale '+cf+'.','Con segno calcoli ('+segno8(a)+')'+op+'('+segno8(b)+') = '+s+'. Il controllo dell’intervallo dà OF = '+of+'.']);
    }));

  prova('1.4.4','lez04_05_overflow_detector','Verificare il margine prima della somma',
    "Per due operandi positivi si può verificare la somma prima di eseguirla. Sottrarre il primo operando dal massimo rappresentabile indica quanto spazio rimane per il secondo.",
    ...[[119,9],[93,21]].map(([a,b])=>{
      const limite=127-a,ok=b<=limite;
      return variante('Vuoi sommare gli interi positivi '+a+' e '+b+' e memorizzare la somma in complemento a due su otto bit. Determina margine residuo e decisione prima di scrivere.',
        [numero('Massimo addendo ammesso',limite,'Sottrai il primo operando dal massimo con segno.'),opzione('Decisione',['ammettere','rifiutare'],ok?'ammettere':'rifiutare','Confronta il secondo operando col margine calcolato.')],
        ['Su otto bit il massimo con segno è 127.','Il margine è 127 − '+a+' = '+limite+'. Il secondo addendo '+b+' è '+(ok?'entro':'oltre')+' questo limite.','La somma matematica è '+(a+b)+'. La scrittura va '+(ok?'ammessa':'rifiutata')+' perché '+(ok?'il risultato è rappresentabile.':'il risultato eccede 127.')]);
    }));

  prova('1.5.1','lez05_01_single_gate','Seguire due porte in cascata',
    "Una NAND restituisce il complemento dell’AND. In una cascata l’uscita di questa prima porta diventa un ingresso della successiva. La XOR vale uno quando i suoi due ingressi differiscono.",
    ...[[1,0,1],[1,1,1]].map(([a,b,c])=>{
      const p=1-(a&b),r=p^c;
      return variante('Una NAND riceve A='+a+' e B='+b+'. L’uscita alimenta una XOR il cui secondo ingresso C vale '+c+'. Calcola le due uscite.',
        [numero('Uscita NAND',p,'Nega il risultato dell’AND dei primi ingressi.'),numero('Uscita XOR',r,'La XOR vale uno se gli ingressi sono diversi.')],
        ['A AND B = '+(a&b)+'.','La NAND inverte questo bit e produce '+p+'.','La XOR confronta '+p+' e '+c+', producendo '+r+'.']);
    }));

  prova('1.5.6','lez05_02_bitwise_on_bytes','Isolare e contare i bit selezionati',
    "Nell’AND bit a bit ogni posizione si calcola indipendentemente. Un bit del risultato vale uno soltanto se in quella posizione sia il dato sia la maschera contengono uno.",
    ...[[0xB6,0x3C],[0xCA,0x55]].map(([x,m])=>{
      const v=x&m,n=bin(v).split('1').length-1;
      return variante('Esegui 0x'+hex(x)+' AND 0x'+hex(m)+' su otto bit. Determina risultato senza segno e numero di posizioni a uno nell’intersezione.',
        [numero('Risultato',v,'Allinea gli ottetti e conserva solo le coppie 1 e 1.'),numero('Posizioni a uno',n,'Conta i pesi che sopravvivono alla maschera.')],
        ['Gli operandi sono '+bin(x)+' e '+bin(m)+'.','L’AND per colonna produce '+bin(v)+', cioè 0x'+hex(v)+' = '+v+'.','Le posizioni attive dopo la selezione sono '+Array.from({length:8},(_,i)=>i).filter(i=>v&(1<<i)).join(', ')+'. In totale sono '+n+'.']);
    }));

  prova('1.5.2','lez05_03_identify_gate','Ricostruire una porta dalla colonna di uscita',
    "Una colonna di uscite identifica una funzione booleana soltanto insieme all’ordine delle righe. Associando ciascuna uscita alla coppia di ingressi si ricostruisce la tabella della porta.",
    ...[['0 1 1 0','XOR','le due righe con ingressi diversi'],['1 1 1 0','NAND','tutte le righe tranne 11']].map(([col,porta,righe])=>
      variante('Una porta a due ingressi produce '+col+' sulle righe 00, 01, 10, 11. Identifica la porta e conta le righe con uscita uno.',
        [opzione('Porta',['AND','XOR','NAND','NOR'],porta,'Confronta prima le righe 00 e 11 e poi le due righe miste.'),numero('Righe vere',col.split('1').length-1,'Conta gli uno della colonna indicata.')],
        ['Associare ogni uscita ai suoi due ingressi consente di eliminare le porte incompatibili.','Restano attive '+righe+'. Questa è la definizione della porta '+porta+'.','Il conteggio della colonna dà '+(col.split('1').length-1)+' righe vere. Riproducendo la tabella di '+porta+' si ritrova '+col+'.'])));

  prova('1.5.6','lez05_04_c_bitwise_expression','Aggiornare un campo senza alterare i vicini',
    "Per sostituire un campo occorre prima azzerare tutti i bit che gli appartengono. L’OR inserisce il nuovo valore già spostato alla posizione del campo e conserva i bit esterni.",
    ...[[0xA5,2,1],[0xCA,4,3]].map(([a,k,v])=>{
      const m=3<<k,pulito=a&(~m&255),r=pulito|(v<<k);
      return variante('Nel byte 0x'+hex(a)+' assegna il valore '+v+' al campo di due bit che parte dalla posizione '+k+' (bit 0 a destra). Calcola maschera e byte aggiornato.',
        [numero('Maschera del campo',m,'Due bit contigui valgono 3 prima dello spostamento.'),numero('Byte aggiornato',r,'Azzera il campo con il complemento della maschera, poi inserisci il nuovo valore.')],
        ['La maschera è 3 << '+k+' = 0x'+hex(m)+'.','L’AND x & ~maschera lascia 0x'+hex(pulito)+' negli otto bit del byte.','Il valore spostato è 0x'+hex(v<<k)+'. L’OR produce 0x'+hex(r)+' = '+r+'. Rileggendo (risultato & maschera) >> '+k+' si ottiene '+v+'.'],
        'unsigned int x = 0x'+hex(a)+'u;\nunsigned int mask = 3u << '+k+';\nx = (x & ~mask) | ('+v+'u << '+k+');');
    }));

  prova('1.5.2','lez05_05_truth_table_rows','Numerare le righe di una tabella',
    "Con n ingressi binari una tabella di verità ha 2ⁿ righe. Numerandole in ordine binario da zero, l’indice di una riga coincide con il valore senza segno della sequenza di ingressi.",
    ...[[3,5],[4,9]].map(([n,i])=>{
      const b=bin(i,n),tot=2**n;
      return variante('Una tabella enumera '+n+' ingressi da sinistra a destra, il primo come bit più significativo. L’ordine delle righe è binario crescente a partire da zero. Per la tupla '+b+' determina indice e numero totale di righe.',
        [numero('Indice',i,'Pesa i bit come una parola senza segno.'),numero('Numero totale di righe',tot,'Conta le combinazioni indipendenti di tutti gli ingressi.')],
        ['I pesi da sinistra sono '+Array.from({length:n},(_,j)=>2**(n-j-1)).join(', ')+'.','Sommando i pesi con bit 1 in '+b+' ottieni l’indice '+i+'.','La tabella ha 2^'+n+' = '+tot+' righe. L’ultima ha indice '+(tot-1)+', coerente con l’indicizzazione da zero.']);
    }));

  prova('1.6.1','lez06_01_fractional_binary','Pesare le cifre dopo la virgola',
    "La prima cifra dopo la virgola binaria pesa 1/2, la seconda 1/4 e così via. Con k posizioni si possono esprimere tutti i pesi come frazioni aventi denominatore 2ᵏ.",
    ...['101','0111'].map(s=>{
      const n=parseInt(s,2),d=2**s.length,add=s.split('').flatMap((x,i)=>x==='1'?['1/'+2**(i+1)]:[]);
      return variante('La frazione in base due è 0,'+s+'. Scrivila come numeratore su '+d+' e indica il valore decimale esatto.',
        [numero('Numeratore',n,'Il denominatore comune è il peso inverso dell’ultima posizione.'),numero('Valore decimale',n/d,'Somma i contributi delle sole cifre a uno.')],
        ['Da sinistra i denominatori crescono per potenze di due. I contributi attivi sono '+add.join(' + ')+'.','Ridotti al denominatore '+d+' danno '+n+'/'+d+'.','La divisione dà il valore esatto '+dec(n/d)+'. La moltiplicazione per '+d+' ricostruisce il numeratore '+n+'.']);
    }));

  prova('1.6.1','lez06_02_exact_or_approx','Stabilire se una frazione termina in base due',
    "Una frazione ridotta ai minimi termini ha una scrittura binaria finita se il denominatore divide una potenza di due. La presenza di un altro fattore primo comporta una parte periodica.",
    ...[[6,40,3,20],[10,40,1,4]].map(([a,b,n,d])=>{
      const ok=(d&(d-1))===0;
      return variante('Riduci '+a+'/'+b+' ai minimi termini e stabilisci se ammette una scrittura binaria finita. Indica il denominatore ridotto e classifica l’espansione.',
        [numero('Denominatore ridotto',d,'Dividi numeratore e denominatore per il loro massimo comun divisore.'),opzione('Espansione binaria',['finita','infinita periodica'],ok?'finita':'infinita periodica','Un denominatore ridotto deve dividere qualche potenza di due per consentire una scrittura finita.')],
        ['Il massimo comun divisore è '+(b/d)+'. La frazione ridotta è '+n+'/'+d+'.','Il denominatore '+d+(ok?' è 2².':' contiene il fattore primo 5.') ,ok?'La frazione vale 0,01 in base due e termina dopo due cifre.':'Nessuna potenza di due è divisibile per 5. La divisione binaria ha pertanto una parte periodica.']);
    }));

  prova('1.6.2','lez06_03_normalize_binary','Trovare esponente reale e campo con bias',
    "Normalizzare un numero binario significa esprimerlo come significanda compresa fra 1 incluso e 2 escluso, moltiplicata per una potenza di due. In un normale binary32 il campo esponente contiene l’esponente effettivo aumentato di 127.",
    ...[['101,1','1,011',2],['0,00101','1,01',-3]].map(([x,m,e])=>
      variante('Normalizza '+x+' in base due nella forma 1,f × 2^e. Indica l’esponente e il campo E di binary32 per questo numero normale.',
        [numero('Esponente e',e,'Sposta la virgola finché rimane un solo uno alla sua sinistra.'),numero('Campo E',127+e,'Il bias dei numeri normali binary32 vale 127.')],
        ['La significanda normalizzata è '+m+' in base due.','Per ricostruire '+x+' occorre moltiplicarla per 2^('+e+'). L’esponente effettivo è '+e+'.','Si memorizza E = e + 127 = '+(127+e)+'. Sottrarre nuovamente il bias consente di verificare il valore.'])));

  prova('1.6.2','lez06_04_ieee754_single_decode','Decodificare una parola normale binary32',
    "Per un binary32 normale la frazione segue un uno iniziale implicito. Il bit di segno moltiplica il risultato per +1 oppure −1, mentre il campo esponente fissa la potenza di due.",
    ...[[0x3FC00000,0,127,0.5,1.5],[0xC0200000,1,128,0.25,-2.5]].map(([w,s,e,f,v])=>
      variante('La parola binary32 è 0x'+hex(w,8)+'. Trova esponente codificato e valore decimale esatto.',
        [numero('Campo esponente E',e,'Preleva gli otto bit dopo il segno.'),numero('Valore',v,'Per un numero normale aggiungi l’uno implicito e sottrai 127 all’esponente.')],
        ['Il segno è '+s+' e il campo esponente è '+bin(e)+' = '+e+'.','La frazione esplicita vale '+dec(f)+'. La significanda è 1 + '+dec(f)+' = '+dec(1+f)+'.','Il risultato è (−1)^'+s+' × '+dec(1+f)+' × 2^'+(e-127)+' = '+dec(v)+'.'])));

  prova('1.6.4','lez06_05_c_float_pitfalls','Perdita di un incremento in binary32',
    "L’esponente determina la distanza tra due valori binary32 consecutivi. Se la somma esatta cade nel loro punto medio, l’arrotondamento al più vicino sceglie il valore la cui significanda intera termina con zero in binario.",
    ...[[2**24,1],[2**24,3]].map(([a,b])=>{
      const exact=a+b,r=Math.fround(exact);
      return variante('In C assumi float binary32, operazioni valutate a precisione binary32 e arrotondamento al più vicino con pareggio verso il pari. Calcola il valore memorizzato dopo aver sommato '+b+' a '+a+'.',
        [numero('Somma matematica',exact,'Calcola prima tra interi esatti.'),numero('Valore memorizzato',r,'In questo intervallo i valori binary32 sono distanti due. In parità scegli la significanda con ultimo bit zero.')],
        ['La base è 2²⁴ e la distanza tra valori consecutivi è 2^(24−23) = 2.','La somma esatta '+exact+' è a metà tra '+(exact-1)+' e '+(exact+1)+'.','Dividendo i due valori rappresentabili adiacenti per il passo 2 si ottengono due interi consecutivi. Quello pari è '+r/2+', quindi l’arrotondamento restituisce '+r+'.'],
        'float x = 16777216.0f;\nx = x + '+b+'.0f;');
    }));

  // Casi conclusivi originali del capitolo integrativo.
  prova('1.7.2','','Decodificare un record di telemetria',
    "Nel record TLM1 la lunghezza del nome UTF-8 è misurata in byte. Il primo byte dopo il nome avvia una temperatura intera con segno in big-endian. Dopo la temperatura viene una tensione binary32 in little-endian.",
    ...[['Z',1,100,1],['Aè',3,-123,10]].map(([nome,flags,t,v])=>{
      const a=codificaTlm(nome,flags,t,v),n=a[5];
      return variante('Il record TLM1 contiene '+bytes(a)+'. Dopo firma, flag e lunghezza, leggi il nome UTF-8, la temperatura int16 big-endian in centesimi di °C e la tensione binary32 little-endian.',
        [numero('Byte del nome',n,'L’ottetto all’offset 5 contiene il conteggio.'),numero('Temperatura in °C',t/100,'Interpreta il campo a 16 bit con segno, poi applica la scala.'),numero('Tensione in V',v,'Riordina i quattro byte finali per leggere la word IEEE 754.')],
        ['La firma è TLM1, i flag valgono '+flags+' e il nome occupa '+n+' byte: '+bytes(a.slice(6,6+n))+' corrisponde a '+nome+'.','La temperatura comincia all’offset '+(6+n)+'. I byte '+bytes(a.slice(6+n,8+n))+' danno '+t+' con segno, cioè '+dec(t/100)+' °C.','La tensione comincia all’offset '+(8+n)+'. I byte in little-endian danno la word 0x'+hex(floatWord(v),8)+' e il valore '+v+' V. La lunghezza complessiva torna: 12 + '+n+' = '+a.length+' byte.']);
    }));

  prova('1.7.3','','Controllare una dimensione prima dell’allocazione',
    "Lo spazio richiesto da un’immagine dipende sia dal numero di pixel sia dai byte per pixel. Il prodotto va calcolato prima della conversione al tipo di destinazione e confrontato separatamente con il budget.",
    ...[[65536,65536,64],[1024,768,4]].map(([w,h,budget])=>{
      const n=w*h*4,lim=budget*1048576,ok=n<=lim&&n<=0xffffffff;
      return variante('Un’immagine RGBA richiede quattro byte per pixel, senza spazi tra righe. Larghezza '+w+', altezza '+h+', budget '+budget+' MiB. Le dimensioni destinate all’allocatore devono entrare in uint32.',
        [numero('Dimensione matematica in byte',n,'Calcola in un tipo più ampio e includi i quattro canali.'),opzione('Decisione',['allocare','rifiutare'],ok?'allocare':'rifiutare','Verifica separatamente il limite del tipo e il budget.')],
        ['Il numero di pixel è '+w+' × '+h+' = '+(w*h)+'.','Il contenuto richiede '+(w*h)+' × 4 = '+n+' byte, da confrontare con 4294967295 come massimo del tipo.','Il budget è '+lim+' byte. '+(ok?'Il valore rientra in entrambi i vincoli: l’allocazione è ammessa.':'Il valore eccede entrambi i vincoli: la richiesta viene rifiutata prima della conversione.')]);
    }));

  prova('1.7.7','','Diagnosticare una copia alterata',
    "Nel formato TLM1 la lunghezza totale dipende dal numero di byte del nome. Dopo il controllo della dimensione, una maschera sul byte dei flag permette di riconoscere le posizioni riservate.",
    ...[['taglio','Record troncato'],['flag','Bit riservati attivi']].map(([guasto,esito])=>{
      let a=codificaTlm('Z',1,100,1);if(guasto==='taglio')a=a.slice(0,-2);else a[4]=0x81;
      return variante('Il formato TLM1 contiene un solo record: lunghezza totale 12 + n, n all’offset 5, soli bit 0 e 1 ammessi nei flag. Analizza '+bytes(a)+'.',
        [numero('Lunghezza attesa',13,'Leggi la lunghezza del nome e aggiungi i campi fissi.'),opzione('Prima causa di rifiuto',['Record troncato','Bit riservati attivi','Firma errata'],esito,'Verifica prima il prefisso e la dimensione, poi la maschera 0xFC dei flag.')],
        ['I primi quattro byte sono 54 4C 4D 31 e la firma è corretta.','Il byte di lunghezza del nome vale 1, quindi la lunghezza richiesta è 12 + 1 = 13. Sono presenti '+a.length+' byte.',guasto==='taglio'?'Mancano gli ultimi due byte del campo tensione. La diagnosi è troncamento e il valore in volt resta indeterminato.':'Il conteggio è corretto. Il campo flag vale 0x81; 0x81 & 0xFC = 0x80. Il bit 7 è riservato e la copia viene rifiutata.']);
    }));

  prova('1.7.4','','Applicare la politica di modifica',
    "La validità del byte viene controllata prima dei permessi. Per un byte valido la scrittura richiede sia il bit W sia almeno uno dei due ruoli ammessi. L’OR fra i ruoli è inclusivo.",
    ...[[1,0,1],[0,1,1]].map(([w,o,a])=>
      variante('Il byte di autorizzazione è valido: i bit riservati valgono zero. Il servizio accorda la modifica quando W AND (O OR A) vale uno. Per W='+w+', O='+o+', A='+a+', calcola la verifica del ruolo e la decisione finale.',
        [numero('O OR A',o|a,'L’OR è inclusivo.'),numero('Decisione finale come bit',w&(o|a),'Il permesso di scrittura è un requisito distinto dal ruolo.')],
        ['I ruoli presenti sono O='+o+' e A='+a+'.','La loro disgiunzione vale '+(o|a)+' perché almeno uno dei due è attivo.','Applicando AND con W='+w+' si ottiene '+(w&(o|a))+'. La modifica è '+(w?'concessa.':'negata.')])));

  // Questi listati sono dati della consegna, consultabili prima della verifica.
  for (const v of SL.prove['1.6'][4].varianti) v.listato = v.codice;
}());
