'use strict';
SL.registra('2.3.3', {
  titolo: 'Array e matrici contigue',
  obiettivo: 'Obiettivo: determinare l’indirizzo di un elemento di una matrice e riconoscere le istruzioni con cui il compilatore lo calcola.',
  concetti: [['tabella', 'Righe e colonne'], ['memory', 'Un’unica fila'], ['puntatore', 'Dalle coordinate all’indirizzo']],
  filigrana: ['tabella', 'memory', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 2.3.2', t: 'Array e indice', d: 'L’indice conta gli elementi che precedono. L’indirizzo di un elemento è base + indice × dimensione.' },
      { sim: 'puntatore', da: 'Dall’unità 2.2.4', t: 'LEA e le scale', d: '`lea rax, [rsi + rsi*4]` somma RSI al suo quadruplo: in RAX è scritto cinque volte RSI.' },
      { sim: 'input', da: 'Dall’unità 2.2.2', t: 'Gli argomenti', d: 'I primi tre argomenti interi di una funzione sono ricevuti in RDI, RSI e RDX.' }
    ],
    domanda: { d: 'Prima di proseguire: un array di interi da 4 byte comincia a 0x3000. A quale indirizzo comincia l’elemento di indice 10?', o: [
      { t: '0x3028', ok: true, fb: 'Dieci elementi da 4 byte occupano 40 byte, e 40 in esadecimale si scrive 28.' },
      { t: '0x3040', fb: 'La distanza, 40 byte, è corretta. Prima della somma con la base va scritta in esadecimale: 40 = 2 × 16 + 8.' },
      { t: '0x300A', fb: 'In tal modo l’indice è contato in byte. Ogni elemento ne occupa 4, e la distanza è 10 × 4.' }
    ] }
  },
  idea: {
    titolo: 'Due indici, un’unica fila',
    termini: ['matrice', 'ordine per righe'],
    testo: [
      'Un array ha una sola dimensione: gli elementi sono disposti in fila. Molti dati ne hanno due. Un’immagine ha righe e colonne di pixel, una tabella oraria ha giorni e ore. Una [[matrice]] è un array con due indici, il primo per la riga e il secondo per la colonna. L’elemento della riga 2 e della colonna 3 si scrive [2][3].',
      'La memoria ha tuttavia una sola dimensione. La collocazione di una matrice richiede la scelta dell’ordine in cui disporre in fila gli elementi. Il linguaggio C adotta l’[[ordine per righe]]: dapprima tutti gli elementi della riga 0, poi quelli della riga 1, e così via, senza spazi fra una riga e la successiva. Una matrice è quindi un array di righe, e ogni riga è a sua volta un array.',
      { fig: 'scena', w: 720, h: 172, titolo: 'Una matrice di due righe e tre colonne, in forma di tabella e in memoria', nota: 'In memoria la riga 1 comincia subito dopo la fine della riga 0.', els: [
        SL.el.nota('n0', 20, 0, 'SUL FOGLIO', 'mono'), SL.el.nota('n1', 330, 0, 'IN MEMORIA, INDIRIZZI CRESCENTI', 'mono'),
        SL.el.cella('a0', 20, 30, 70, 44, '[0][0]', 'att', { piccola: true, cls: 'minuta' }), SL.el.cella('a1', 96, 30, 70, 44, '[0][1]', 'att', { piccola: true, cls: 'minuta' }), SL.el.cella('a2', 172, 30, 70, 44, '[0][2]', 'att', { piccola: true, cls: 'minuta' }),
        SL.el.cella('b0', 20, 82, 70, 44, '[1][0]', 'on', { piccola: true, cls: 'minuta' }), SL.el.cella('b1', 96, 82, 70, 44, '[1][1]', 'on', { piccola: true, cls: 'minuta' }), SL.el.cella('b2', 172, 82, 70, 44, '[1][2]', 'on', { piccola: true, cls: 'minuta' }),
        SL.el.cella('m0', 330, 56, 60, 44, '[0][0]', 'att', { piccola: true, cls: 'minuta', gi: '0' }), SL.el.cella('m1', 394, 56, 60, 44, '[0][1]', 'att', { piccola: true, cls: 'minuta', gi: '1' }), SL.el.cella('m2', 458, 56, 60, 44, '[0][2]', 'att', { piccola: true, cls: 'minuta', gi: '2' }),
        SL.el.cella('m3', 522, 56, 60, 44, '[1][0]', 'on', { piccola: true, cls: 'minuta', gi: '3' }), SL.el.cella('m4', 586, 56, 60, 44, '[1][1]', 'on', { piccola: true, cls: 'minuta', gi: '4' }), SL.el.cella('m5', 650, 56, 60, 44, '[1][2]', 'on', { piccola: true, cls: 'minuta', gi: '5' }),
        SL.el.nota('n2', 330, 134, 'indice nella fila = 3 × riga + colonna', 'mono')] },
      'Da tale disposizione discende la regola per individuare un elemento. L’elemento [r][c] è preceduto da r righe complete e da c elementi della propria riga. Se ogni riga ha N colonne, il suo indice nella fila è N × r + c. Il prodotto dell’indice per la dimensione di un elemento dà la distanza in byte dalla base.',
      'Nella formula compare il numero di colonne, cioè la lunghezza di una riga. Il numero di righe occorre soltanto per stabilire dove la matrice termina. Per questa ragione una funzione C che riceve una matrice deve conoscerne il numero di colonne.',
      'Il compilatore traduce la formula con strumenti già noti. Per una matrice di interi con cinque colonne, `lea rax, [rsi + rsi*4]` calcola 5r, `add rax, rdx` aggiunge c, e `mov eax, [rdi + rax*4]` accede all’elemento con la scala 4. Delle tre istruzioni, una sola accede alla memoria.'
    ]
  },
  esperimento: {
    faremo: [
      'Una matrice di interi da 4 byte, con quattro righe e cinque colonne, comincia all’indirizzo 0x3000. Per renderlo riconoscibile, ogni elemento contiene il numero 10 × riga + colonna. I controlli fissano una riga e una colonna.',
      'Gli elementi che precedono quello scelto sono contati dapprima per righe intere e poi all’interno della riga, mentre tre istruzioni svolgono il medesimo calcolo nei registri. Dopo il caso proposto, è istruttivo scendere di una riga e rilevare l’incremento dell’indirizzo.'
    ],
    vedrai: [
      ['tabella', 'La matrice in tabella', 'In alto a sinistra: quattro righe e cinque colonne.'],
      ['operation', 'Le istruzioni', 'In alto a destra: le tre istruzioni e i valori che scrivono.'],
      ['memory', 'La fila in memoria', 'In basso: i venti elementi nell’ordine in cui sono disposti in memoria.']
    ]
  },
  lab: {
    titolo: 'L’elemento [r][c] di una matrice con cinque colonne',
    scena: { w: 860, h: 396 },
    atti: ['La tabella e la fila', 'Le righe complete', 'All’interno della riga', 'L’indirizzo', 'L’accesso'],
    controlli: [
      { id: 'r', tipo: 'num', eti: 'Riga, in RSI', min: 0, max: 3, salti: [1], valore: 2 },
      { id: 'c', tipo: 'num', eti: 'Colonna, in RDX', min: 0, max: 4, salti: [1], valore: 3 }
    ],
    nota: 'Ogni elemento contiene 10 × riga + colonna, e risulta così riconoscibile anche nella fila.',
    previsione: {
      domanda: (p) => 'La matrice comincia a 0x3000, ha cinque colonne e contiene interi da 4 byte. A quale indirizzo comincia l’elemento [' + p.r + '][' + p.c + ']?',
      opzioni: (p) => Array.from(new Set([0x3000 + 4 * (5 * p.r + p.c), 0x3000 + 4 * (4 * p.c + p.r), 0x3000 + 5 * p.r + p.c, 0x3000 + 4 * (4 * p.r + p.c), 0x3000 + 4 * (5 * p.r + p.c) + 4])).slice(0, 4).sort((a, b) => a - b).map((a) => '0x' + a.toString(16).toUpperCase())
    },
    confronto: (pred, esito, p) => 'La previsione indicava l’indirizzo ' + pred + '. L’elemento comincia a ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.'
      : 'L’elemento è preceduto da ' + p.r + (p.r === 1 ? ' riga completa' : ' righe complete') + ' da cinque elementi e da ' + p.c + (p.c === 1 ? ' elemento' : ' elementi') + ' della propria riga: in totale ' + (5 * p.r + p.c) + '. Ciascuno occupa 4 byte, e la distanza dalla base è ' + (4 * (5 * p.r + p.c)) + ' byte.'),
    costruisci(p) {
      const el = SL.el, passi = [], r = p.r, c = p.c, k = 5 * r + c, off = 4 * k, HA = (a) => '0x' + a.toString(16).toUpperCase(), A = HA(0x3000 + off), V = 10 * r + c;
      const IST = [['cinque volte la riga', 'lea rax, [rsi + rsi*4]'], ['aggiunta della colonna', 'add rax, rdx'], ['accesso con scala 4', 'mov eax, [rdi + rax*4]']];
      const quadro = (o) => {
        const f = o.fase, els = [el.nota('ng', 60, 0, 'LA MATRICE SUL FOGLIO', 'mono'), el.nota('nf', 30, 196, 'LA FILA IN MEMORIA: SOPRA L’INDICE, DENTRO IL CONTENUTO', 'mono')];
        for (let i = 0; i < 4; i++) {
          els.push(el.nota('nr' + i, 20, 36 + i * 40, 'r' + i, 'mono', i === r ? 'att' : ''));
          for (let j = 0; j < 5; j++) {
            const q = 5 * i + j, st = q === k ? 'att' : f >= 1 && i < r ? 'on' : f >= 2 && i === r && j < c ? 'on' : '';
            els.push(el.cella('g' + q, 60 + j * 62, 28 + i * 40, 58, 34, String(10 * i + j), st, { piccola: true, cls: 'minuta' }));
            els.push(el.cella('s' + q, 30 + q * 40, 244, 36, 40, String(10 * i + j), st, { piccola: true, cls: 'minuta', so: String(q) }));
          }
          els.push(el.nota('ns' + i, 30 + i * 200, 292, 'riga ' + i + ' · ' + HA(0x3000 + 20 * i), 'mono minuta', f >= 1 && i < r ? 'on' : i === r ? 'att' : ''));
        }
        IST.forEach((t, n) => els.push(el.box('i' + n, 400, 28 + n * 56, 270, 48, t[0], t[1], o.ist === n ? 'att' : o.ist > n ? 'on' : '', { cls: 'stretta' })));
        const VAL = ['RAX = ' + 5 * r, 'RAX = ' + k, 'EAX = ' + V];
        VAL.forEach((t, n) => els.push(el.cella('v' + n, 682, 28 + n * 56, 158, 48, o.ist >= n ? t : '·', o.ist === n ? 'att' : o.ist > n ? 'on' : 'off', { piccola: true, cls: 'minuta' })));
        els.push(el.box('q1', 20, 330, 250, 58, 'elementi che precedono', f >= 2 ? '5 × ' + r + ' + ' + c + ' = ' + k : f === 1 ? '5 × ' + r + ' = ' + 5 * r : '·', f === 1 || f === 2 ? 'att' : f > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('q2', 282, 330, 250, 58, 'distanza dalla base', f >= 3 ? k + ' × 4 = ' + off + ' byte' : '·', f === 3 ? 'att' : f > 3 ? 'on' : '', { cls: 'stretta' }),
          el.box('q3', 544, 330, 296, 58, 'indirizzo dell’elemento', f >= 3 ? '0x3000 + 0x' + off.toString(16).toUpperCase() + ' = ' + A : '·', f === 3 ? 'att' : f > 3 ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (f) => [['Indice nella fila', f >= 2 ? String(k) : '·', 'a'], ['Distanza', f >= 3 ? off + ' byte' : '·'], ['Indirizzo', f >= 3 ? A : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.fase), els: quadro(o) }, extra));

      const o0 = r === 0 ? [0, 1, 2] : [r - 1, r, r + 1];
      P({ fase: 0, ist: -1 }, 0, 'La tabella e la fila', 'In forma di tabella la matrice ha quattro righe e cinque colonne. In memoria esiste soltanto una fila di celle, nella quale le righe sono disposte una dopo l’altra: dapprima l’intera riga 0, poi la riga 1, e così via. L’elemento cercato è [' + r + '][' + c + '], che contiene ' + V + '.',
        { chiedi: { d: 'L’elemento cercato appartiene alla riga ' + r + '. Quante righe complete lo precedono nella fila?', o: o0.map(String), g: o0.indexOf(r), no: 'Le righe sono numerate da zero. La riga ' + r + (r === 0 ? ' è la prima, priva di righe precedenti.' : r === 1 ? ' è preceduta dalla sola riga 0.' : ' è preceduta dalle righe da 0 a ' + (r - 1) + ', cioè ' + r + ' righe.') } });
      P({ fase: 1, ist: 0 }, 1, r === 0 ? 'Nessuna riga precedente' : 'Le righe complete', (r === 0 ? 'La riga 0 è la prima della fila, e nessuna riga la precede. La prima istruzione calcola comunque cinque volte l’indice di riga, che in questo caso dà 0.'
        : 'La riga ' + r + ' è preceduta da ' + r + (r === 1 ? ' riga completa' : ' righe complete') + ', ciascuna di cinque elementi. La prima istruzione calcola 5 × ' + r + ' = ' + 5 * r + ' sommando RSI al suo quadruplo, come nell’unità 2.2.4.'), { calc: '5 × ' + r + ' = ' + 5 * r });
      const o2 = Array.from(new Set([off, k + 4, 5 * k])).sort((x, y) => x - y);
      P({ fase: 2, ist: 1 }, 2, 'All’interno della riga', (c === 0 ? 'L’elemento è il primo della propria riga, e nessun elemento della riga lo precede.' : 'Nella riga ' + r + ', la colonna ' + c + ' è preceduta da ' + c + (c === 1 ? ' elemento.' : ' elementi.')) + ' ADD somma l’indice di colonna, e in RAX è scritto l’indice dell’elemento nella fila: ' + 5 * r + ' + ' + c + ' = ' + k + '.',
        { calc: '5 × ' + r + ' + ' + c + ' = ' + k, chiedi: { d: 'L’elemento ha indice ' + k + ' nella fila, e ogni elemento occupa 4 byte. Quanti byte lo separano dalla base?', o: o2.map(String), g: o2.indexOf(off), no: 'L’indice conta elementi. La distanza in byte è indice × dimensione: ' + k + ' × 4 = ' + off + '.' } });
      P({ fase: 3, ist: 1 }, 3, 'L’indirizzo dell’elemento', (off === 0 ? 'La distanza è zero: l’elemento [0][0] comincia esattamente alla base, 0x3000.' : 'La distanza dalla base è ' + k + ' × 4 = ' + off + ' byte, che in esadecimale si scrive ' + off.toString(16).toUpperCase() + '. L’elemento comincia quindi a ' + A + ' e occupa quattro celle.'), { calc: '0x3000 + ' + off + ' = ' + A });
      P({ fase: 4, ist: 2 }, 4, 'L’accesso', 'La terza istruzione è la sola che accede alla memoria. Essa impiega RDI come base, RAX come indice e 4 come scala: l’indirizzo efficace è ' + A + ', e in EAX è copiato l’elemento, ' + V + '. Lo spostamento di una colonna aggiunge 4 byte all’indirizzo. Lo spostamento di una riga ne aggiunge 20, la lunghezza di una riga intera.',
        { calc: 'EAX = ' + V + ', letto in ' + A, esito: ['Indirizzo ' + A, 'si'] });
      return { passi, esito: A };
    }
  },
  bilancio: {
    regola: [
      'In ordine per righe, l’elemento [r][c] di una matrice con N colonne ha indice N × r + c nella fila. Il suo indirizzo è base + (N × r + c) × dimensione.',
      'Lo spostamento di una colonna aggiunge la dimensione di un elemento. Lo spostamento di una riga aggiunge la dimensione di una riga intera.'
    ],
    errori: [
      ['Scambiare la riga con la colonna.', 'Il primo indice seleziona la riga. Gli elementi [1][2] e [2][1] si trovano a indirizzi diversi.'],
      ['Moltiplicare la riga per il numero di righe.', 'Il fattore dell’indice di riga è il numero di colonne, cioè il numero di elementi di una riga.'],
      ['Arrestarsi all’indice nella fila.', 'L’indice conta elementi. La distanza in byte si ottiene moltiplicandolo per la dimensione di un elemento.']
    ],
    saFare: ['Calcolare l’indice nella fila di un elemento [r][c].', 'Ricavarne la distanza in byte e l’indirizzo.', 'Riconoscere le istruzioni che traducono il calcolo.'],
    esercizi: [
      { d: 'Una matrice di interi da 4 byte ha 3 righe e 6 colonne e comincia all’indirizzo 0x5000. A quale indirizzo comincia l’elemento [2][1]? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x5010', giuste: ['0x5034', '5034', '5034h'],
        ok: 'L’indice nella fila è 6 × 2 + 1 = 13. La distanza è 13 × 4 = 52 byte, che in esadecimale si scrive 34.',
        diagnosi: [
          { se: ['0x5052', '5052'], msg: 'La distanza, 52 byte, è corretta. Prima della somma con la base va scritta in esadecimale: 52 = 3 × 16 + 4.' },
          { se: ['0x500d', '500d'], msg: 'Tredici è l’indice dell’elemento nella fila. Ogni elemento occupa 4 byte, e la distanza è 13 × 4.' },
          { se: ['0x501c', '501c'], msg: 'La riga è stata moltiplicata per 3, il numero di righe. Una riga contiene 6 elementi: il fattore è il numero di colonne.' },
          { se: ['0x5020', '5020'], msg: 'Il valore indicato è l’indirizzo di [1][2]. Il primo indice è la riga: l’elemento cercato appartiene alla riga 2.' }
        ],
        altro: 'L’indirizzo è diverso. Si contino gli elementi che precedono: due righe da sei, più uno.',
        indizi: ['L’elemento è preceduto da due righe complete e da un elemento della propria riga.', 'Indice nella fila: 6 × 2 + 1 = 13.', 'Distanza: 13 × 4 = 52 byte, cioè 0x34.'],
        svolgimento: ['Righe complete: 2, da 6 elementi, per un totale di 12 elementi.', 'Nella riga 2, prima della colonna 1: 1 elemento. Il totale è 13.', 'Distanza: 13 × 4 = 52 byte = 0x34.', 'Indirizzo: 0x5000 + 0x34 = 0x5034.'] },
      { d: 'In una matrice di interi da 4 byte con 5 colonne, di quanti byte cresce l’indirizzo passando dall’elemento [1][3] all’elemento [2][3]?', guida: 'Si scelga la risposta.', o: [
        { t: '20', ok: true, fb: 'Fra i due elementi è compresa una riga intera: 5 elementi da 4 byte.' },
        { t: '4', fb: 'Quattro byte separano due elementi adiacenti nella medesima riga. In questo caso cambia la riga.' },
        { t: '5', fb: 'Cinque è il numero di elementi di una riga. Ciascuno occupa 4 byte.' }] }
    ],
    sfida: ['cslez2_3_03_random_assembly_03', 'Indici, spiazzamenti e doppia indirezione']
  }
});
