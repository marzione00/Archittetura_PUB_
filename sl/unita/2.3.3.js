'use strict';
SL.registra('2.3.3', {
  titolo: 'Array e matrici contigue',
  obiettivo: 'Alla fine saprai trovare l’indirizzo di un elemento di una matrice e riconoscere le istruzioni con cui il compilatore lo calcola.',
  concetti: [['tabella', 'Righe e colonne'], ['memory', 'Una fila sola'], ['puntatore', 'Dalle coordinate all’indirizzo']],
  filigrana: ['tabella', 'memory', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 2.3.2', t: 'Array e indice', d: 'L’indice conta gli elementi che precedono. L’indirizzo di un elemento è base + indice × dimensione.' },
      { sim: 'puntatore', da: 'Dall’unità 2.2.4', t: 'LEA e le scale', d: '`lea rax, [rsi + rsi*4]` somma RSI al suo quadruplo: in RAX arriva cinque volte RSI.' },
      { sim: 'input', da: 'Dall’unità 2.2.2', t: 'Gli argomenti', d: 'I primi tre argomenti interi di una funzione arrivano in RDI, RSI e RDX.' }
    ],
    domanda: { d: 'Prima di proseguire: un array di interi da 4 byte comincia a 0x3000. A quale indirizzo comincia l’elemento di indice 10?', o: [
      { t: '0x3028', ok: true, fb: 'Dieci elementi da 4 byte occupano 40 byte, e 40 in esadecimale si scrive 28.' },
      { t: '0x3040', fb: 'La distanza, 40 byte, è giusta. Prima di accostarla alla base va scritta in esadecimale: 40 = 2 × 16 + 8.' },
      { t: '0x300A', fb: 'Così l’indice viene contato in byte. Ogni elemento ne occupa 4, e la distanza è 10 × 4.' }
    ] }
  },
  idea: {
    titolo: 'Due indici, una fila sola',
    termini: ['matrice', 'ordine per righe'],
    testo: [
      'Un array ha una dimensione sola: gli elementi stanno in fila. Molti dati ne hanno due. Un’immagine ha righe e colonne di pixel, un orario ha giorni e ore. Una [[matrice]] è un array con due indici, il primo per la riga e il secondo per la colonna. L’elemento della riga 2 e della colonna 3 si scrive [2][3].',
      'La memoria, però, ha una dimensione sola. Per collocarvi una matrice bisogna scegliere in quale ordine mettere in fila gli elementi. Il linguaggio C usa l’[[ordine per righe]]: prima tutti gli elementi della riga 0, poi quelli della riga 1, e così via, senza spazi fra una riga e la successiva. Una matrice è quindi un array di righe, e ogni riga è a sua volta un array.',
      { fig: 'scena', w: 720, h: 172, titolo: 'Una matrice di due righe e tre colonne, sul foglio e in memoria', nota: 'In memoria la riga 1 comincia subito dopo la fine della riga 0.', els: [
        SL.el.nota('n0', 20, 0, 'SUL FOGLIO', 'mono'), SL.el.nota('n1', 330, 0, 'IN MEMORIA, INDIRIZZI CRESCENTI', 'mono'),
        SL.el.cella('a0', 20, 30, 70, 44, '[0][0]', 'att', { piccola: true, cls: 'minuta' }), SL.el.cella('a1', 96, 30, 70, 44, '[0][1]', 'att', { piccola: true, cls: 'minuta' }), SL.el.cella('a2', 172, 30, 70, 44, '[0][2]', 'att', { piccola: true, cls: 'minuta' }),
        SL.el.cella('b0', 20, 82, 70, 44, '[1][0]', 'on', { piccola: true, cls: 'minuta' }), SL.el.cella('b1', 96, 82, 70, 44, '[1][1]', 'on', { piccola: true, cls: 'minuta' }), SL.el.cella('b2', 172, 82, 70, 44, '[1][2]', 'on', { piccola: true, cls: 'minuta' }),
        SL.el.cella('m0', 330, 56, 60, 44, '[0][0]', 'att', { piccola: true, cls: 'minuta', gi: '0' }), SL.el.cella('m1', 394, 56, 60, 44, '[0][1]', 'att', { piccola: true, cls: 'minuta', gi: '1' }), SL.el.cella('m2', 458, 56, 60, 44, '[0][2]', 'att', { piccola: true, cls: 'minuta', gi: '2' }),
        SL.el.cella('m3', 522, 56, 60, 44, '[1][0]', 'on', { piccola: true, cls: 'minuta', gi: '3' }), SL.el.cella('m4', 586, 56, 60, 44, '[1][1]', 'on', { piccola: true, cls: 'minuta', gi: '4' }), SL.el.cella('m5', 650, 56, 60, 44, '[1][2]', 'on', { piccola: true, cls: 'minuta', gi: '5' }),
        SL.el.nota('n2', 330, 134, 'indice nella fila = 3 × riga + colonna', 'mono')] },
      'Da questa disposizione discende la regola per trovare un elemento. Davanti all’elemento [r][c] stanno r righe complete e poi c elementi della sua stessa riga. Se ogni riga ha N colonne, il suo indice nella fila è N × r + c. Moltiplicando l’indice per la dimensione di un elemento si ottiene la distanza in byte dalla base.',
      'Nella formula compare il numero di colonne, cioè la lunghezza di una riga. Il numero di righe serve soltanto a sapere dove la matrice finisce. Per questo una funzione C che riceve una matrice deve conoscere quante colonne ha.',
      'Il compilatore traduce la formula con strumenti già noti. Per una matrice di interi con cinque colonne, `lea rax, [rsi + rsi*4]` calcola 5r, `add rax, rdx` aggiunge c, e `mov eax, [rdi + rax*4]` accede all’elemento con la scala 4. Tre istruzioni, una sola delle quali tocca la memoria.'
    ]
  },
  esperimento: {
    faremo: [
      'Una matrice di interi da 4 byte, con quattro righe e cinque colonne, comincia all’indirizzo 0x3000. Per riconoscerlo, ogni elemento contiene il numero 10 × riga + colonna. Sceglierai una riga e una colonna.',
      'Conteremo gli elementi che precedono quello scelto, prima a righe intere e poi dentro la riga, mentre tre istruzioni svolgono lo stesso calcolo nei registri. Dopo il caso proposto, scendi di una riga e osserva di quanto cresce l’indirizzo.'
    ],
    vedrai: [
      ['tabella', 'La matrice sul foglio', 'In alto a sinistra: quattro righe e cinque colonne.'],
      ['operation', 'Le istruzioni', 'In alto a destra: le tre istruzioni e i valori che scrivono.'],
      ['memory', 'La fila in memoria', 'In basso: i venti elementi nell’ordine in cui stanno in memoria.']
    ]
  },
  lab: {
    titolo: 'L’elemento [r][c] di una matrice con cinque colonne',
    scena: { w: 860, h: 396 },
    atti: ['Il foglio e la fila', 'Le righe complete', 'Dentro la riga', 'L’indirizzo', 'L’accesso'],
    controlli: [
      { id: 'r', tipo: 'num', eti: 'Riga, in RSI', min: 0, max: 3, salti: [1], valore: 2 },
      { id: 'c', tipo: 'num', eti: 'Colonna, in RDX', min: 0, max: 4, salti: [1], valore: 3 }
    ],
    nota: 'Ogni elemento contiene 10 × riga + colonna: così lo si riconosce anche nella fila.',
    previsione: {
      domanda: (p) => 'La matrice comincia a 0x3000, ha cinque colonne e contiene interi da 4 byte. A quale indirizzo comincia l’elemento [' + p.r + '][' + p.c + ']?',
      opzioni: (p) => Array.from(new Set([0x3000 + 4 * (5 * p.r + p.c), 0x3000 + 4 * (4 * p.c + p.r), 0x3000 + 5 * p.r + p.c, 0x3000 + 4 * (4 * p.r + p.c), 0x3000 + 4 * (5 * p.r + p.c) + 4])).slice(0, 4).sort((a, b) => a - b).map((a) => '0x' + a.toString(16).toUpperCase())
    },
    confronto: (pred, esito, p) => 'Avevi previsto l’indirizzo ' + pred + '. L’elemento comincia a ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.'
      : 'Davanti all’elemento stanno ' + p.r + (p.r === 1 ? ' riga completa' : ' righe complete') + ' da cinque elementi e ' + p.c + (p.c === 1 ? ' elemento' : ' elementi') + ' della sua riga: in tutto ' + (5 * p.r + p.c) + '. Ciascuno occupa 4 byte, e la distanza dalla base è ' + (4 * (5 * p.r + p.c)) + ' byte.'),
    costruisci(p) {
      const el = SL.el, passi = [], r = p.r, c = p.c, k = 5 * r + c, off = 4 * k, HA = (a) => '0x' + a.toString(16).toUpperCase(), A = HA(0x3000 + off), V = 10 * r + c;
      const IST = [['cinque volte la riga', 'lea rax, [rsi + rsi*4]'], ['più la colonna', 'add rax, rdx'], ['accesso con scala 4', 'mov eax, [rdi + rax*4]']];
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
      P({ fase: 0, ist: -1 }, 0, 'Il foglio e la fila', 'Sul foglio la matrice ha quattro righe e cinque colonne. In memoria esiste soltanto una fila di celle, e le righe vi stanno una dopo l’altra: prima tutta la riga 0, poi la riga 1, e così via. L’elemento cercato è [' + r + '][' + c + '], che contiene ' + V + '.',
        { chiedi: { d: 'L’elemento cercato sta nella riga ' + r + '. Quante righe complete lo precedono nella fila?', o: o0.map(String), g: o0.indexOf(r), no: 'Le righe si contano da zero. Davanti alla riga ' + r + (r === 0 ? ' non sta alcuna riga.' : r === 1 ? ' sta la sola riga 0.' : ' stanno le righe da 0 a ' + (r - 1) + ', cioè ' + r + ' righe.') } });
      P({ fase: 1, ist: 0 }, 1, r === 0 ? 'Nessuna riga da scavalcare' : 'Le righe complete', (r === 0 ? 'La riga 0 è la prima della fila, e nessuna riga la precede. La prima istruzione calcola comunque cinque volte l’indice di riga, che qui fa 0.'
        : 'Davanti alla riga ' + r + ' stanno ' + r + (r === 1 ? ' riga completa' : ' righe complete') + ', ciascuna di cinque elementi. La prima istruzione calcola 5 × ' + r + ' = ' + 5 * r + ' sommando RSI al suo quadruplo, come nell’unità 2.2.4.'), { calc: '5 × ' + r + ' = ' + 5 * r });
      const o2 = Array.from(new Set([off, k + 4, 5 * k])).sort((x, y) => x - y);
      P({ fase: 2, ist: 1 }, 2, 'Dentro la riga', (c === 0 ? 'L’elemento è il primo della sua riga, e nessun elemento della riga lo precede.' : 'Nella riga ' + r + ', davanti alla colonna ' + c + ' stanno ' + c + (c === 1 ? ' elemento.' : ' elementi.')) + ' ADD somma l’indice di colonna, e in RAX arriva l’indice dell’elemento nella fila: ' + 5 * r + ' + ' + c + ' = ' + k + '.',
        { calc: '5 × ' + r + ' + ' + c + ' = ' + k, chiedi: { d: 'L’elemento ha indice ' + k + ' nella fila, e ogni elemento occupa 4 byte. Quanti byte lo separano dalla base?', o: o2.map(String), g: o2.indexOf(off), no: 'L’indice conta elementi. La distanza in byte è indice × dimensione: ' + k + ' × 4 = ' + off + '.' } });
      P({ fase: 3, ist: 1 }, 3, 'L’indirizzo dell’elemento', (off === 0 ? 'La distanza è zero: l’elemento [0][0] comincia esattamente alla base, 0x3000.' : 'La distanza dalla base è ' + k + ' × 4 = ' + off + ' byte, che in esadecimale si scrive ' + off.toString(16).toUpperCase() + '. L’elemento comincia quindi a ' + A + ' e occupa quattro celle.'), { calc: '0x3000 + ' + off + ' = ' + A });
      P({ fase: 4, ist: 2 }, 4, 'L’accesso', 'La terza istruzione è la sola che tocca la memoria. Usa RDI come base, RAX come indice e 4 come scala: l’indirizzo efficace è ' + A + ', e in EAX arriva l’elemento, ' + V + '. Spostarsi di una colonna aggiunge 4 byte all’indirizzo. Spostarsi di una riga ne aggiunge 20, la lunghezza di una riga intera.',
        { calc: 'EAX = ' + V + ', letto in ' + A, esito: ['Indirizzo ' + A, 'si'] });
      return { passi, esito: A };
    }
  },
  bilancio: {
    regola: [
      'In ordine per righe, l’elemento [r][c] di una matrice con N colonne ha indice N × r + c nella fila. Il suo indirizzo è base + (N × r + c) × dimensione.',
      'Spostarsi di una colonna aggiunge la dimensione di un elemento. Spostarsi di una riga aggiunge la dimensione di una riga intera.'
    ],
    errori: [
      ['Scambiare la riga con la colonna.', 'Il primo indice sceglie la riga. Gli elementi [1][2] e [2][1] stanno a indirizzi diversi.'],
      ['Moltiplicare la riga per il numero di righe.', 'Il fattore dell’indice di riga è il numero di colonne, cioè quanti elementi contiene una riga.'],
      ['Fermarsi all’indice nella fila.', 'L’indice conta elementi. Per ottenere la distanza in byte va moltiplicato per la dimensione di un elemento.']
    ],
    saFare: ['Calcolo l’indice nella fila di un elemento [r][c].', 'Ne ricavo la distanza in byte e l’indirizzo.', 'Riconosco le istruzioni che traducono il calcolo.'],
    esercizi: [
      { d: 'Una matrice di interi da 4 byte ha 3 righe e 6 colonne e comincia all’indirizzo 0x5000. A quale indirizzo comincia l’elemento [2][1]? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x5010', giuste: ['0x5034', '5034', '5034h'],
        ok: 'L’indice nella fila è 6 × 2 + 1 = 13. La distanza è 13 × 4 = 52 byte, che in esadecimale si scrive 34.',
        diagnosi: [
          { se: ['0x5052', '5052'], msg: 'La distanza, 52 byte, è giusta. Prima di accostarla alla base va scritta in esadecimale: 52 = 3 × 16 + 4.' },
          { se: ['0x500d', '500d'], msg: 'Tredici è l’indice dell’elemento nella fila. Ogni elemento occupa 4 byte, e la distanza è 13 × 4.' },
          { se: ['0x501c', '501c'], msg: 'Hai moltiplicato la riga per 3, il numero di righe. Una riga contiene 6 elementi: il fattore è il numero di colonne.' },
          { se: ['0x5020', '5020'], msg: 'Questo è l’indirizzo di [1][2]. Il primo indice è la riga: l’elemento cercato sta nella riga 2.' }
        ],
        altro: 'L’indirizzo è diverso. Conta gli elementi che precedono: due righe da sei, più uno.',
        indizi: ['Davanti all’elemento stanno due righe complete e un elemento della sua riga.', 'Indice nella fila: 6 × 2 + 1 = 13.', 'Distanza: 13 × 4 = 52 byte, cioè 0x34.'],
        svolgimento: ['Righe complete: 2, da 6 elementi. Sono 12 elementi.', 'Nella riga 2, davanti alla colonna 1: 1 elemento. In tutto 13.', 'Distanza: 13 × 4 = 52 byte = 0x34.', 'Indirizzo: 0x5000 + 0x34 = 0x5034.'] },
      { d: 'In una matrice di interi da 4 byte con 5 colonne, di quanti byte cresce l’indirizzo passando dall’elemento [1][3] all’elemento [2][3]?', guida: 'Scegli la risposta.', o: [
        { t: '20', ok: true, fb: 'Fra i due elementi sta una riga intera: 5 elementi da 4 byte.' },
        { t: '4', fb: 'Quattro byte separano due elementi vicini nella stessa riga. Qui cambia la riga.' },
        { t: '5', fb: 'Cinque è il numero di elementi di una riga. Ciascuno occupa 4 byte.' }] }
    ],
    sfida: ['cslez2_3_03_random_assembly_03', 'Indici, spiazzamenti e doppia indirezione']
  }
});
