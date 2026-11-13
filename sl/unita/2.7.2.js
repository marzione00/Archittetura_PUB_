'use strict';
SL.registra('2.7.2', {
  titolo: 'Dalla scrittura fuori limite ai dati di controllo',
  obiettivo: 'Alla fine saprai dire, per una copia di lunghezza data in un buffer locale, quali celle del frame vengono alterate e con quali conseguenze.',
  concetti: [['memory', 'Un buffer nel frame'], ['scudo', 'Oltre il limite'], ['puntatore', 'I dati di controllo']],
  filigrana: ['scudo', 'memory', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'scudo', da: 'Dall’unità 2.3.5', t: 'Accessi fuori dai limiti', d: 'Il processore esegue qualunque accesso. Una scrittura oltre la fine di un array rovina ciò che si trova lì accanto.' },
      { sim: 'pila', da: 'Dall’unità 2.7.1', t: 'Il frame visto da RBP', d: 'Sotto RBP stanno le variabili locali. In `[rbp]` sta il RBP del chiamante, in `[rbp + 8]` l’indirizzo di ritorno.' },
      { sim: 'memory', da: 'Dall’unità 2.5.3', t: 'Buffer', d: 'Una zona di memoria usata come deposito temporaneo per i byte in transito.' }
    ],
    domanda: { d: 'Prima di proseguire: un buffer di 8 byte comincia all’indirizzo 0x8FD0. Qual è l’indirizzo del suo ultimo byte?', o: [
      { t: '0x8FD7', ok: true, fb: 'Gli otto byte occupano gli indirizzi da 0x8FD0 a 0x8FD7. L’ultimo sta sette posizioni dopo il primo.' },
      { t: '0x8FD8', fb: 'Questo è il primo indirizzo dopo la fine del buffer. L’ultimo byte sta una posizione prima.' },
      { t: '0x8FE0', fb: 'Otto byte dopo 0x8FD0 si arriva a 0x8FD8, perché otto in esadecimale si scrive 8.' }
    ] }
  },
  idea: {
    titolo: 'Che cosa c’è dopo il buffer',
    termini: ['traboccamento', 'dato di controllo'],
    testo: [
      'Le variabili locali di una funzione stanno nel frame, a pochi byte dal RBP salvato e dall’indirizzo di ritorno. Fra esse si trova spesso un buffer: otto, sedici, cento byte destinati a ricevere dati dall’esterno, per esempio una riga letta dall’ingresso standard.',
      'Un’operazione di copia scrive un byte dopo l’altro, verso gli indirizzi crescenti, per tutta la lunghezza che le viene indicata. Se la lunghezza supera la capienza del buffer, la copia prosegue nelle celle successive: è un [[traboccamento]]. Il processore lo esegue senza obiezioni, come ogni scrittura oltre i limiti di un array.',
      { fig: 'scena', w: 720, h: 96, titolo: 'Il frame di questa unità, per indirizzi crescenti', nota: 'Sotto ogni zona, gli spostamenti dall’inizio del buffer.', els: [
        SL.el.box('a', 0, 0, 170, 54, 'buffer', '8 byte', 'on', { cls: 'stretta' }), SL.el.box('b', 176, 0, 110, 54, 'riempimento', '4 byte', '', { cls: 'stretta' }), SL.el.box('c', 292, 0, 110, 54, 'contatore', '4 byte', 'on', { cls: 'stretta' }),
        SL.el.box('d', 408, 0, 150, 54, 'RBP salvato', '8 byte', 'att', { cls: 'stretta' }), SL.el.box('e', 564, 0, 156, 54, 'ritorno', '8 byte', 'att', { cls: 'stretta' }),
        SL.el.nota('p1', 0, 62, 'da 0 a 7', 'mono minuta'), SL.el.nota('p2', 176, 62, 'da 8 a 11', 'mono minuta'), SL.el.nota('p3', 292, 62, 'da 12 a 15', 'mono minuta'), SL.el.nota('p4', 408, 62, 'da 16 a 23', 'mono minuta'), SL.el.nota('p5', 564, 62, 'da 24 a 31', 'mono minuta')] },
      'Ciò che viene rovinato dipende dalla distanza percorsa. Subito dopo il buffer può trovarsi del riempimento, e il danno resta invisibile. Poi vengono altre variabili locali, e il programma prosegue con dati sbagliati. Più in là stanno il RBP salvato e l’indirizzo di ritorno. Questi ultimi sono [[dato di controllo|dati di controllo]], perché decidono da dove proseguirà l’esecuzione.',
      'La pila cresce verso gli indirizzi bassi, mentre le copie avanzano verso quelli alti. Per questo un traboccamento in un buffer locale si dirige proprio verso l’indirizzo di ritorno della funzione che lo contiene. Quando la funzione arriva a RET, preleva ciò che trova in quella cella e lo mette in RIP.',
      'Se i byte copiati vengono dall’esterno, chi li fornisce sta scegliendo, di fatto, la destinazione del ritorno. Questo difetto è all’origine di una lunga serie di incidenti di sicurezza, e ha motivato le difese descritte nelle prossime unità. Il rimedio vero resta il controllo della lunghezza prima della copia.'
    ]
  },
  esperimento: {
    faremo: [
      'Una funzione ha nel proprio frame un buffer di 8 byte, seguito da riempimento, da un contatore, dal RBP salvato e dall’indirizzo di ritorno. Una copia vi scrive n byte, tutti uguali a 0x41, a partire dall’inizio del buffer. Sceglierai n.',
      'Seguiremo la copia zona per zona, guardando che cosa diventano il contatore, il RBP salvato e l’indirizzo di ritorno. Dopo il caso proposto, scegli una lunghezza di 9 byte e osserva dove cade il byte in eccesso.'
    ],
    vedrai: [
      ['memory', 'Il frame, byte per byte', 'In alto: i 32 byte del frame su due file, con lo spostamento sopra ciascuno.'],
      ['scudo', 'I byte fuori posto', 'I byte scritti oltre il buffer compaiono in rosso.'],
      ['puntatore', 'Le conseguenze', 'In basso: il valore del contatore, del RBP salvato e dell’indirizzo di ritorno dopo la copia.']
    ]
  },
  lab: {
    titolo: 'Una copia di n byte in un buffer di otto',
    scena: { w: 860, h: 372 },
    atti: ['La disposizione', 'Dentro il buffer', 'Oltre il limite', 'Un dato del programma', 'I dati di controllo', 'Il conto'],
    controlli: [
      { id: 'n', tipo: 'scelta', eti: 'Byte da copiare', opzioni: [[6, '6'], [8, '8'], [9, '9'], [13, '13'], [17, '17'], [25, '25'], [28, '28']], valore: 28 }
    ],
    nota: 'Il numero di passi dipende dalla lunghezza della copia. Ogni byte copiato vale 0x41.',
    previsione: {
      domanda: (p) => 'Il buffer occupa gli spostamenti da 0 a 7. Seguono il riempimento, da 8 a 11, il contatore, da 12 a 15, il RBP salvato, da 16 a 23, e l’indirizzo di ritorno, da 24 a 31. Una copia scrive ' + p.n + ' byte a partire dallo spostamento 0. In quale zona cade l’ultimo byte scritto?',
      opzioni: () => SL.unita272.ZONE.map((z) => z[0])
    },
    confronto: (pred, esito, p) => 'Avevi previsto: ' + pred + '. L’ultimo byte cade in: ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Una copia di ' + p.n + ' byte scrive gli spostamenti da 0 a ' + (p.n - 1) + '. Lo spostamento ' + (p.n - 1) + ' appartiene a questa zona.'),
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita272, passi = [], n = p.n, ult = n - 1, zona = U.zonaDi(ult);
      const ORIG = [null, null, null, null, null, null, null, null, null, null, null, null, 3, 0, 0, 0, 0x20, 0x90, 0, 0, 0, 0, 0, 0, 0x34, 0x12, 0x40, 0, 0, 0, 0, 0];
      // I valori di otto byte superano la precisione dei numeri ordinari: il conto si fa con interi grandi.
      const leggiG = (da, quanti, fin) => { let v = 0n; for (let j = quanti - 1; j >= 0; j--) v = v * 256n + BigInt(da + j < fin ? 0x41 : ORIG[da + j]); return v; };
      const leggi = (da, quanti, fin) => (quanti > 4 ? leggiG(da, quanti, fin) : Number(leggiG(da, quanti, fin)));
      const HV = (v) => '0x' + v.toString(16).toUpperCase();
      // fin: numero di byte già copiati; acc: intervallo [da, a) dei byte scritti in questo passo.
      const quadro = (o) => {
        const fin = o.fin, els = [el.nota('z1', 20, 0, 'BUFFER', 'mono', fin > 0 ? 'on' : ''), el.nota('z2', 428, 0, 'RIEMPIMENTO', 'mono', fin > 8 ? 'err' : ''), el.nota('z3', 632, 0, 'CONTATORE', 'mono', fin > 12 ? 'err' : ''),
          el.nota('z4', 20, 108, 'RBP DEL CHIAMANTE', 'mono', fin > 16 ? 'err' : ''), el.nota('z5', 428, 108, 'INDIRIZZO DI RITORNO', 'mono', fin > 24 ? 'err' : '')];
        for (let b = 0; b < 32; b++) {
          const scritto = b < fin, nuovo = o.acc && b >= o.acc[0] && b < o.acc[1];
          els.push(el.cella('y' + b, 20 + (b % 16) * 51, b < 16 ? 46 : 154, 47, 40, scritto ? '41' : ORIG[b] == null ? '·' : X.esa2(ORIG[b]), scritto ? (b >= 8 ? 'err' : nuovo ? 'att' : 'on') : ORIG[b] == null ? 'off' : '', { piccola: true, cls: 'minuta', so: String(b) }));
        }
        const cont = leggi(12, 4, fin), rbp = leggi(16, 8, fin), rit = leggi(24, 8, fin);
        const RBP0 = 0x9020n, RIT0 = 0x401234n;
        els.push(el.box('b1', 20, 216, 190, 60, 'byte copiati', String(fin), o.fase === 1 ? 'att' : 'on', { cls: 'stretta' }),
          el.box('b2', 220, 216, 190, 60, 'fuori dal buffer', String(Math.max(0, fin - 8)), fin > 8 ? 'err' : '', { cls: 'stretta' }),
          el.box('b3', 420, 216, 420, 60, 'contatore, che valeva 3', cont === 3 ? '3' : X.num(cont), cont !== 3 ? 'err' : '', { cls: 'stretta' }),
          el.box('b4', 20, 290, 400, 66, 'RBP che il chiamante ritroverà', HV(rbp), rbp !== RBP0 ? 'err' : '', { cls: 'stretta' }),
          el.box('b5', 440, 290, 400, 66, 'destinazione di RET', HV(rit), rit !== RIT0 ? 'err' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (fin) => [['Byte copiati', fin + ' su ' + n, 'a'], ['Fuori dal buffer', String(Math.max(0, fin - 8))], ['Zona raggiunta', fin ? U.BREVI[U.ZONE.findIndex((z) => z[0] === U.zonaDi(fin - 1))] : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.fin), els: quadro(o) }, extra));

      const o0 = [n - 1, n, n + 1];
      P({ fin: 0, fase: 0 }, 0, 'Il frame prima della copia', 'Il frame occupa 32 byte, mostrati per indirizzi crescenti. Il buffer ne ha 8, agli spostamenti da 0 a 7. Il contatore vale 3. Il RBP salvato vale 0x9020 e l’indirizzo di ritorno 0x401234, entrambi scritti in little-endian. La copia scriverà ' + n + ' byte a partire dallo spostamento 0.',
        { chiedi: { d: 'Una copia di ' + n + ' byte parte dallo spostamento 0. Qual è l’ultimo spostamento che scrive?', o: o0.map(String), g: 0, no: 'Gli spostamenti partono da zero: ' + n + ' byte occupano gli spostamenti da 0 a ' + (n - 1) + '.' } });
      const f1 = Math.min(n, 8);
      P({ fin: f1, fase: 1, acc: [0, f1] }, 1, n <= 8 ? 'La copia sta nel buffer' : 'Il buffer è pieno', (n < 8 ? 'La copia scrive ' + n + ' byte, e si ferma prima della fine del buffer. Tutto ciò che sta dopo resta com’era.' : n === 8 ? 'La copia scrive 8 byte e riempie il buffer esattamente, fino allo spostamento 7. Nessuna cella esterna viene toccata.' : 'I primi 8 byte riempiono il buffer, fino allo spostamento 7. La copia però ne deve scrivere ' + n + ', e nulla la ferma: non sa quanto è grande la destinazione.'), { calc: f1 + ' byte nel buffer' });
      if (n > 8) {
        const f2 = Math.min(n, 12);
        P({ fin: f2, fase: 2, acc: [8, f2] }, 2, 'Il primo byte fuori posto', 'Dallo spostamento 8 la copia scrive fuori dal buffer. ' + (f2 - 8 === 1 ? 'Un byte cade' : (f2 - 8) + ' byte cadono') + ' nel riempimento, che nessuno legge: il programma, per ora, si comporta come prima. Il limite però è già stato superato, e il comportamento del programma è indefinito.', { calc: (f2 - 8) + (f2 - 8 === 1 ? ' byte nel riempimento' : ' byte nel riempimento') });
      }
      if (n > 12) {
        const f3 = Math.min(n, 16);
        P({ fin: f3, fase: 3, acc: [12, f3] }, 3, 'Il contatore alterato', (f3 - 12 === 1 ? 'Un byte raggiunge' : (f3 - 12) + ' byte raggiungono') + ' il contatore, una variabile del programma. Valeva 3, e ora vale ' + X.num(leggi(12, 4, f3)) + '. La funzione proseguirà usando questo numero, senza alcun segnale che qualcosa sia cambiato.', { calc: 'contatore = ' + X.num(leggi(12, 4, f3)) });
      }
      if (n > 16) {
        const f4 = Math.min(n, 24);
        P({ fin: f4, fase: 4, acc: [16, f4] }, 4, 'Il RBP salvato', (f4 - 16 === 1 ? 'Un byte entra' : (f4 - 16) + ' byte entrano') + ' nella cella del RBP salvato, che valeva 0x9020 e ora vale ' + HV(leggi(16, 8, f4)) + '. All’epilogo il chiamante riceverà questo valore come proprio riferimento, e cercherà le sue variabili nel posto sbagliato.', { calc: 'RBP salvato = ' + HV(leggi(16, 8, f4)) });
      }
      if (n > 24) {
        P({ fin: n, fase: 5, acc: [24, n] }, 4, 'L’indirizzo di ritorno', (n - 24 === 1 ? 'Un byte raggiunge' : (n - 24) + ' byte raggiungono') + ' l’indirizzo di ritorno, che valeva 0x401234 e ora vale ' + HV(leggi(24, 8, n)) + '. Quando la funzione eseguirà RET, il processore preleverà questo valore e proseguirà da lì. La destinazione è stata decisa dai byte copiati.', { calc: 'ritorno = ' + HV(leggi(24, 8, n)) });
      }
      P({ fin: n, fase: 6 }, 5, n <= 8 ? 'Nessun byte fuori posto' : 'Il conto dei danni', (n <= 8 ? 'La copia è rimasta nei limiti del buffer. Con ' + (n === 8 ? 'un solo byte in più' : (9 - n) + ' byte in più') + ' avrebbe cominciato a scrivere fuori.' : 'Dei ' + n + ' byte copiati, ' + (n - 8) + ' sono finiti fuori dal buffer. La zona più lontana raggiunta è ' + zona + '.') + ' La copia non conosce la capienza della destinazione. Il controllo spetta al programma, prima di cominciare: la lunghezza va confrontata con gli 8 byte disponibili.', { calc: n + ' − 8 = ' + Math.max(0, n - 8) + ' byte fuori dal buffer', esito: [zona, n <= 8 ? 'si' : 'no'] });
      return { passi, esito: zona };
    }
  },
  bilancio: {
    regola: [
      'Una copia più lunga del buffer prosegue nelle celle successive del frame: riempimento, altre variabili, RBP salvato, indirizzo di ritorno. Il processore non la ferma.',
      'L’indirizzo di ritorno è un dato di controllo: chi riesce a scriverlo decide da dove proseguirà il programma dopo RET. La difesa principale è controllare la lunghezza prima di copiare.'
    ],
    errori: [
      ['Ritenere innocua una scrittura che cade nel riempimento.', 'Il limite del buffer è già stato superato. Con un byte in più, o con un altro compilatore, il danno diventa visibile.'],
      ['Contare i byte a partire da uno.', 'Una copia di 8 byte scrive gli spostamenti da 0 a 7. L’ultimo spostamento è la lunghezza meno 1.'],
      ['Aspettarsi un errore al momento della scrittura.', 'La scrittura riesce in silenzio. Le conseguenze compaiono dopo: un contatore sbagliato, oppure un ritorno verso un indirizzo estraneo.']
    ],
    saFare: ['Individuo le zone del frame raggiunte da una copia di lunghezza data.', 'Calcolo quanti byte cadono fuori dal buffer.', 'Spiego perché l’indirizzo di ritorno è il bersaglio più delicato.'],
    esercizi: [
      { d: 'Nel frame di questa unità il buffer occupa gli spostamenti da 0 a 7 e l’indirizzo di ritorno quelli da 24 a 31. Qual è il numero minimo di byte che una copia deve scrivere, partendo dallo spostamento 0, per alterare l’indirizzo di ritorno?', segnaposto: 'Un numero', giuste: ['25', 'venticinque'],
        ok: 'Il primo byte dell’indirizzo di ritorno sta allo spostamento 24. Per scriverlo servono 25 byte, dallo spostamento 0 al 24.',
        diagnosi: [
          { se: ['24'], msg: 'Con 24 byte la copia scrive gli spostamenti da 0 a 23, e si ferma sull’ultimo byte del RBP salvato. Ne serve uno in più.' },
          { se: ['32'], msg: 'Con 32 byte l’indirizzo di ritorno viene sostituito per intero. Per alterarlo basta cambiarne il primo byte.' },
          { se: ['17'], msg: 'Con 17 byte la copia raggiunge il RBP salvato, allo spostamento 16. L’indirizzo di ritorno comincia allo spostamento 24.' },
          { se: ['9'], msg: 'Con 9 byte la copia esce dal buffer, ma cade nel riempimento. L’indirizzo di ritorno comincia allo spostamento 24.' }
        ],
        altro: 'Il numero è diverso. Trova lo spostamento del primo byte dell’indirizzo di ritorno, tenendo conto che gli spostamenti partono da zero.',
        indizi: ['L’indirizzo di ritorno comincia allo spostamento 24.', 'Una copia di n byte scrive gli spostamenti da 0 a n − 1.', 'Serve che n − 1 sia almeno 24.'],
        svolgimento: ['Primo byte dell’indirizzo di ritorno: spostamento 24.', 'Una copia di n byte arriva allo spostamento n − 1.', 'n − 1 = 24, quindi n = 25.'] },
      { d: 'Una copia scrive 10 byte in un buffer di 8, e i due byte in eccesso cadono nel riempimento, senza effetti visibili. Come va giudicato il programma?', guida: 'Scegli la risposta.', o: [
        { t: 'Scorretto: il limite del buffer è stato superato', ok: true, fb: 'Il confine da rispettare è quello del buffer. Che la cella successiva fosse riempimento è un caso fortunato, privo di garanzie.' },
        { t: 'Corretto: il riempimento è privo di dati', fb: 'Il riempimento sta lì per scelta del compilatore, e può cambiare. Una scrittura oltre il buffer ha comportamento indefinito.' },
        { t: 'Corretto, finché la copia resta lontana dall’indirizzo di ritorno', fb: 'Prima dell’indirizzo di ritorno stanno altre variabili e il RBP salvato. E una scrittura oltre il buffer è scorretta in ogni caso.' }] }
    ],
    sfida: ['cslez2_7_03_random_assembly_03', 'Epilogo, variabili locali e chiamate']
  }
});
SL.unita272 = (() => {
  const ZONE = [['il buffer', 0, 7], ['il riempimento', 8, 11], ['il contatore', 12, 15], ['il RBP salvato', 16, 23], ['l’indirizzo di ritorno', 24, 31]];
  return { ZONE, BREVI: ['buffer', 'riempimento', 'contatore', 'RBP salvato', 'ritorno'], zonaDi: (b) => ZONE.find((z) => b >= z[1] && b <= z[2])[0] };
})();
