'use strict';
SL.registra('2.3.2', {
  titolo: 'Formare un indirizzo efficace',
  obiettivo: 'Alla fine saprai calcolare l’indirizzo di un elemento da base, indice, scala e spiazzamento, e distinguere l’istruzione che calcola l’indirizzo da quella che accede alla cella.',
  concetti: [['tabella', 'Array e indice'], ['puntatore', 'Dall’indice ai byte'], ['memory', 'Indirizzo o valore']],
  filigrana: ['puntatore', 'tabella', 'memory'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 2.2.3', t: 'Indirizzo efficace', d: 'Il valore di base + indice × scala + spiazzamento. La scala vale 1, 2, 4 oppure 8.' },
      { sim: 'operation', da: 'Dall’unità 2.2.3', t: 'LEA', d: 'Calcola l’indirizzo efficace e scrive il numero nella destinazione. La memoria e i flag restano intatti.' },
      { sim: 'memory', da: 'Dall’unità 2.3.1', t: 'Ampiezza', d: 'Un dato largo più di un byte occupa celle consecutive. Un intero a 32 bit ne occupa quattro.' }
    ],
    domanda: { d: 'Prima di proseguire: RDI contiene 0x1000 e RSI contiene 2. Quanto vale RAX dopo `lea rax, [rdi + rsi*8]`?', o: [
      { t: '0x1010', ok: true, fb: 'L’indice 2, moltiplicato per la scala 8, dà 16. In esadecimale 16 si scrive 10, e la somma con la base è 0x1010.' },
      { t: '0x1016', fb: 'Il prodotto 2 × 8 vale 16 in decimale. Prima di accostarlo alla base va scritto in esadecimale, dove vale 10.' },
      { t: '0x100A', fb: 'Così l’indice e la scala risultano sommati. La scala moltiplica l’indice: 2 × 8.' }
    ] }
  },
  idea: {
    titolo: 'L’indice conta elementi, la memoria conta byte',
    termini: ['array', 'indice'],
    testo: [
      'Molti dati arrivano in gruppo: i campioni di un suono, i pixel di un’immagine, i voti di una classe. Un [[array]] è una fila di dati dello stesso tipo, detti elementi, collocati in memoria uno dopo l’altro senza spazi vuoti. Tutti gli elementi hanno la stessa dimensione.',
      'Gli elementi si numerano a partire da zero, e il numero di un elemento è il suo [[indice]]. La scelta dello zero ha una ragione pratica: l’indice dice quanti elementi precedono quello cercato. Davanti all’elemento 0 non c’è nulla, davanti all’elemento 3 ce ne sono tre.',
      { fig: 'celle', titolo: 'Un array di interi da quattro byte, a partire da 0x1000', nota: 'Ogni casella è un elemento intero. Da un elemento al successivo l’indirizzo cresce di quattro.', celle: [
        { so: 'indice 0', v: '10', st: 'on', gi: '0x1000' }, { so: 'indice 1', v: '20', st: 'on', gi: '0x1004' }, { so: 'indice 2', v: '30', st: 'on', gi: '0x1008' }, { so: 'indice 3', v: '40', st: 'amb', gi: '0x100C' }, { so: 'indice 4', v: '50', st: 'on', gi: '0x1010' }] },
      'L’indice conta elementi, mentre gli indirizzi contano byte. Per passare dall’uno agli altri si moltiplica l’indice per la dimensione di un elemento. Con elementi di quattro byte, l’elemento 3 comincia dodici byte dopo l’inizio dell’array, cioè all’indirizzo 0x100C.',
      'L’indirizzo efficace dell’unità 2.2.3 è costruito per questo calcolo. La base è l’indirizzo dell’array, l’indice è il numero dell’elemento, la scala è la dimensione di un elemento. Le quattro scale ammesse, 1, 2, 4 e 8, coincidono con le ampiezze degli accessi. Lo spiazzamento aggiunge una distanza fissa, già espressa in byte: si somma una volta sola, senza passare per la scala.',
      'La stessa espressione fra parentesi quadre serve a istruzioni diverse. `lea rax, [rdi + rsi*4]` scrive in RAX l’indirizzo dell’elemento. `mov eax, [rdi + rsi*4]` va a quell’indirizzo e copia in EAX l’elemento che vi trova. `mov [rdi + rsi*4], eax` compie il percorso inverso e scrive nell’elemento il contenuto di EAX. La prima istruzione produce un indirizzo, le altre due accedono alla cella.'
    ]
  },
  esperimento: {
    faremo: [
      'RDI contiene la base 0x1000 e RSI un indice. Sceglierai l’indice, la scala e lo spiazzamento, e l’istruzione LEA calcolerà l’indirizzo efficace.',
      'Seguiremo il calcolo su una linea graduata in byte: prima il tratto dovuto all’indice, poi quello dello spiazzamento. Dopo il caso proposto, raddoppia la scala e osserva quale dei due tratti cambia.'
    ],
    vedrai: [
      ['tabella', 'Gli ingredienti', 'In alto: l’istruzione, la base, l’indice, la scala e lo spiazzamento.'],
      ['puntatore', 'La linea degli indirizzi', 'Al centro: una linea graduata, con una tacca ogni otto byte.'],
      ['memory', 'Il risultato', 'In basso: la distanza dalla base, l’indirizzo efficace e ciò che ne fanno LEA e MOV.']
    ]
  },
  lab: {
    titolo: 'Base, indice, scala e spiazzamento sulla linea degli indirizzi',
    scena: { w: 860, h: 348 },
    atti: ['Gli ingredienti', 'Dall’indice ai byte', 'Lo spiazzamento', 'L’indirizzo efficace', 'Indirizzo o valore'],
    controlli: [
      { id: 'i', tipo: 'num', eti: 'Indice, in RSI', min: 0, max: 5, salti: [1], valore: 3 },
      { id: 's', tipo: 'scelta', eti: 'Scala', opzioni: [[1, '1'], [2, '2'], [4, '4'], [8, '8']], valore: 4 },
      { id: 'd', tipo: 'scelta', eti: 'Spiazzamento', opzioni: [[-8, '−8'], [0, '0'], [8, '+8'], [16, '+16']], valore: 8 }
    ],
    nota: 'La linea è graduata in byte, con una tacca ogni otto. Parte otto byte prima della base.',
    previsione: {
      domanda: (p) => 'RDI contiene 0x1000 e RSI contiene ' + p.i + '. Quale indirizzo scriverà in RAX l’istruzione `' + SL.unita232.ist('lea rax', p) + '`?',
      opzioni: (p) => { const U = SL.unita232; return Array.from(new Set([0x1000 + p.i * p.s + p.d, 0x1000 + (p.i + p.d) * p.s, 0x1000 + p.i + p.d, 0x1000 + p.i * p.s, 0x1000 + (p.i + 1) * p.s + p.d, 0x1000 + p.i * p.s + 2 * p.d])).slice(0, 4).sort((a, b) => a - b).map(U.HA); }
    },
    confronto: (pred, esito, p) => 'Avevi previsto l’indirizzo ' + pred + '. L’indirizzo efficace è ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.'
      : 'L’indice ' + p.i + ', moltiplicato per la scala ' + p.s + ', dà ' + (p.i * p.s) + ' byte. Lo spiazzamento ' + SL.unita232.S(p.d) + ' si somma una volta sola, senza passare per la scala. La distanza dalla base è ' + SL.x86.num(p.i * p.s + p.d) + ' byte.'),
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita232, passi = [];
      const a1 = p.i * p.s, off = a1 + p.d, A = U.HA(0x1000 + off), PX = (o) => 150 + o * 10, V = 100 + off;
      const quadro = (o) => {
        const f = o.fase, els = [
          el.box('ist', 20, 0, 300, 56, 'istruzione', U.ist('lea rax', p), f === 0 ? 'att' : '', { cls: 'stretta' }),
          el.box('bas', 332, 0, 130, 56, 'base, RDI', '0x1000', f === 3 ? 'att' : '', { cls: 'stretta' }),
          el.box('idx', 474, 0, 124, 56, 'indice, RSI', String(p.i), f === 1 ? 'att' : '', { cls: 'stretta' }),
          el.box('sca', 610, 0, 90, 56, 'scala', String(p.s), f === 1 ? 'att' : '', { cls: 'stretta' }),
          el.box('spi', 712, 0, 128, 56, 'spiazzamento', U.S(p.d), f === 2 ? 'att' : '', { cls: 'stretta' }),
          el.linea('asse', PX(-8), 144, PX(64), 144, '')];
        for (let t = -8; t <= 64; t += 8) { els.push(el.linea('tk' + t, PX(t), 138, PX(t), 150, '')); els.push(el.nota('tn' + t, PX(t) - 25, 154, U.HA(0x1000 + t), 'mono minuta', t === 0 ? 'on' : '')); }
        els.push(el.linea('mb', PX(0), 100, PX(0), 144, 'on'), el.nota('nb', PX(0) - 18, 78, 'base', 'mono', 'on'));
        if (f >= 1) els.push(el.linea('f1', PX(0), 116, PX(a1), 116, f === 1 ? 'att' : 'on'));
        if (f >= 2 && p.d !== 0) els.push(el.linea('f2', PX(a1), 128, PX(off), 128, f === 2 ? 'att' : 'on'), el.linea('f2a', PX(a1), 116, PX(a1), 128, 'on'));
        if (f >= 3) { els.push(el.linea('md', PX(off), 100, PX(off), 144, 'att')); if (Math.abs(off) >= 8) els.push(el.nota('nd', PX(off) - 22, 78, 'arrivo', 'mono', 'att')); }
        els.push(el.box('r1', 20, 196, 250, 58, 'indice × scala', f >= 1 ? p.i + ' × ' + p.s + ' = ' + a1 + ' byte' : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }),
          el.box('r2', 282, 196, 160, 58, 'spiazzamento', f >= 2 ? U.S(p.d) + ' byte' : '·', f === 2 ? 'att' : f > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('r3', 454, 196, 190, 58, 'distanza dalla base', f >= 2 ? X.num(off) + ' byte' : '·', f === 2 ? 'att' : f > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('r4', 656, 196, 184, 58, 'indirizzo efficace', f >= 3 ? A : '·', f === 3 ? 'att' : f > 3 ? 'on' : '', { cls: 'stretta' }),
          el.box('lea', 20, 276, 404, 62, 'con LEA: il numero nel registro', f === 4 ? 'RAX = ' + A : '·', f === 4 ? 'att' : '', { cls: 'stretta' }),
          el.box('mov', 436, 276, 404, 62, 'con MOV: il contenuto della cella', f === 4 ? 'EAX = ' + V + ', letto in ' + A : '·', f === 4 ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (f) => [['Distanza dalla base', f >= 2 ? X.num(off) + ' byte' : f === 1 ? a1 + ' byte' : '·', 'a'], ['Indirizzo efficace', f >= 3 ? A : '·'], ['RAX', f >= 4 ? A : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.fase), els: quadro(o) }, extra));

      const o1 = Array.from(new Set([a1, p.i + p.s, p.s])).sort((x, y) => x - y);
      P({ fase: 0 }, 0, 'I quattro ingredienti', 'RDI contiene la base, 0x1000: sulla linea graduata è il punto di partenza. RSI contiene l’indice ' + p.i + '. La scala ' + p.s + ' dichiara che ogni elemento occupa ' + (p.s === 1 ? 'un byte' : p.s + ' byte') + '. Lo spiazzamento vale ' + U.S(p.d) + '.',
        { chiedi: { d: 'L’indice vale ' + p.i + ' e ogni elemento occupa ' + (p.s === 1 ? '1 byte' : p.s + ' byte') + '. Quanti byte occupano gli elementi che precedono quello cercato?', o: o1.map(String), g: o1.indexOf(a1), no: 'L’indice conta gli elementi che precedono: sono ' + p.i + ', ciascuno di ' + p.s + ' byte. In tutto ' + p.i + ' × ' + p.s + ' = ' + a1 + '.' } });
      P({ fase: 1 }, 1, 'Dall’indice ai byte', (p.i === 0 ? 'L’indice 0 indica il primo elemento. Nessun elemento lo precede, e il tratto dovuto all’indice è lungo zero.' : 'L’indice conta elementi, la linea conta byte. La scala converte l’uno negli altri: ' + p.i + ' elementi da ' + p.s + ' byte occupano ' + a1 + ' byte. Il tratto parte dalla base e si allunga di ' + a1 + ' posizioni.'), { calc: p.i + ' × ' + p.s + ' = ' + a1 });
      const trap = 0x1000 + Math.sign(off) * parseInt(String(Math.abs(off)), 16), o2 = Array.from(new Set([0x1000 + off, trap, p.d ? 0x1000 + a1 : 0x1000 + a1 + p.s])).sort((x, y) => x - y);
      P({ fase: 2 }, 2, p.d === 0 ? 'Nessuno spiazzamento' : p.d > 0 ? 'Lo spiazzamento in avanti' : 'Lo spiazzamento all’indietro', (p.d === 0 ? 'Lo spiazzamento vale 0, e la distanza dalla base resta ' + a1 + ' byte.'
        : 'Lo spiazzamento è già espresso in byte e si somma così com’è, senza passare per la scala. ' + (p.d > 0 ? 'Il secondo tratto prosegue in avanti di ' + p.d + ' byte.' : 'Essendo negativo, il secondo tratto torna indietro di ' + (-p.d) + ' byte.') + ' La distanza dalla base diventa ' + a1 + ' ' + (p.d > 0 ? '+ ' + p.d : '− ' + (-p.d)) + ' = ' + X.num(off) + ' byte.'),
        { calc: a1 + ' ' + (p.d >= 0 ? '+ ' + p.d : '− ' + (-p.d)) + ' = ' + X.num(off), chiedi: { d: 'La base vale 0x1000 e la distanza è di ' + X.num(off) + ' byte. Qual è l’indirizzo efficace?', o: o2.map(U.HA), g: o2.indexOf(0x1000 + off), no: 'La distanza va scritta in esadecimale prima di accostarla alla base: ' + Math.abs(off) + ' si scrive 0x' + Math.abs(off).toString(16).toUpperCase() + '. Il risultato è ' + A + '.' } });
      P({ fase: 3 }, 3, 'Il punto di arrivo', (off === 0 ? 'La distanza è zero, e l’indirizzo efficace coincide con la base: 0x1000.' : off > 0 ? 'Sommando la distanza alla base si ottiene l’indirizzo efficace. In esadecimale ' + off + ' si scrive ' + off.toString(16).toUpperCase() + ', quindi 0x1000 + ' + off + ' = ' + A + '.' : 'La distanza è negativa, e l’indirizzo efficace cade prima della base: 0x1000 − ' + (-off) + ' = ' + A + '.'),
        { calc: '0x1000 ' + (off >= 0 ? '+ 0x' + off.toString(16).toUpperCase() : '− 0x' + (-off).toString(16).toUpperCase()) + ' = ' + A });
      P({ fase: 4 }, 4, 'Indirizzo o valore', 'LEA scrive in RAX il numero ' + A + ' e si ferma lì, senza leggere alcuna cella. Con la stessa espressione fra parentesi quadre, `' + U.ist('mov eax', p) + '` andrebbe all’indirizzo ' + A + ' e copierebbe in EAX i quattro byte che vi trova. In questo esempio vi è conservato il numero ' + V + '.',
        { calc: 'RAX = ' + A, esito: ['RAX = ' + A, 'si'] });
      return { passi, esito: A };
    }
  },
  bilancio: {
    regola: [
      'L’indice conta elementi, gli indirizzi contano byte, e la scala converte l’uno negli altri. L’indirizzo di un elemento è base + indice × scala + spiazzamento.',
      'LEA scrive l’indirizzo nel registro. MOV, con la stessa espressione fra parentesi quadre, legge oppure scrive la cella che si trova a quell’indirizzo.'
    ],
    errori: [
      ['Moltiplicare per la scala anche lo spiazzamento.', 'Lo spiazzamento è già in byte. In `[rdi + rsi*4 + 8]` l’otto si somma così com’è.'],
      ['Accostare alla base una distanza scritta in decimale.', 'Venti byte dopo 0x1000 si arriva a 0x1014, perché venti in esadecimale si scrive 14.'],
      ['Contare gli elementi a partire da uno.', 'L’elemento di indice 3 è il quarto della fila. Lo precedono tre elementi, e la distanza è tre volte la dimensione.']
    ],
    saFare: ['Calcolo l’indirizzo di un elemento da base, indice e dimensione.', 'Tengo separato lo spiazzamento, già in byte, dal termine con la scala.', 'Distinguo LEA, che produce un indirizzo, da MOV, che accede alla cella.'],
    esercizi: [
      { d: 'Un array di interi da 8 byte comincia all’indirizzo 0x3000. A quale indirizzo comincia l’elemento di indice 5? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x3010', giuste: ['0x3028', '3028', '3028h'],
        ok: 'Cinque elementi da 8 byte occupano 40 byte. In esadecimale 40 si scrive 28, e l’indirizzo è 0x3028.',
        diagnosi: [
          { se: ['0x3040', '3040'], msg: 'La distanza, 40 byte, è giusta. Prima di accostarla alla base va scritta in esadecimale: 40 = 2 × 16 + 8.' },
          { se: ['0x3005', '3005'], msg: 'Così l’indice risulta sommato agli indirizzi come se contasse byte. Ogni elemento ne occupa 8.' },
          { se: ['0x3030', '3030'], msg: 'Questo è l’indirizzo dell’elemento di indice 6. Gli indici partono da zero: davanti all’elemento 5 ci sono cinque elementi.' },
          { se: ['0x3020', '3020'], msg: 'Questo è l’indirizzo dell’elemento di indice 4. Davanti all’elemento 5 ci sono cinque elementi.' }
        ],
        altro: 'L’indirizzo è diverso. Moltiplica l’indice per la dimensione e scrivi il prodotto in esadecimale.',
        indizi: ['La distanza dalla base è indice × dimensione.', '5 × 8 = 40 byte.', '40 in esadecimale si scrive 28.'],
        svolgimento: ['Elementi che precedono: 5.', 'Distanza: 5 × 8 = 40 byte.', '40 = 2 × 16 + 8, cioè 0x28.', 'Indirizzo: 0x3000 + 0x28 = 0x3028.'] },
      { d: 'RDI contiene l’indirizzo di un array di interi a 32 bit e RSI contiene 2. Quale istruzione copia in EAX il valore dell’elemento di indice 2?', guida: 'Scegli la risposta.', o: [
        { t: 'mov eax, [rdi + rsi*4]', ok: true, fb: 'La scala 4 è la dimensione di un elemento. MOV va all’indirizzo calcolato e copia i quattro byte dell’elemento.' },
        { t: 'lea eax, [rdi + rsi*4]', fb: 'LEA scrive nel registro l’indirizzo dell’elemento. Per ottenere il valore serve un accesso alla memoria.' },
        { t: 'mov eax, [rdi + rsi]', fb: 'Senza la scala l’indice viene contato in byte. L’accesso partirebbe due byte dopo la base, a metà dell’elemento 0.' }] }
    ],
    sfida: ['cslez2_3_02_random_assembly_02', 'Scritture e calcolo di indirizzi con LEA']
  }
});
SL.unita232 = {
  HA: (a) => '0x' + a.toString(16).toUpperCase().padStart(4, '0'),
  S: (d) => (d > 0 ? '+' + d : d < 0 ? '−' + (-d) : '0'),
  ist: (testa, p) => testa + ', [rdi' + (p.s === 1 ? ' + rsi' : ' + rsi*' + p.s) + (p.d > 0 ? ' + ' + p.d : p.d < 0 ? ' - ' + (-p.d) : '') + ']'
};
