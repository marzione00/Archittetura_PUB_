'use strict';
SL.registra('3.3.6', {
  titolo: 'Assemblaggio manuale come verifica',
  obiettivo: 'Obiettivo: assemblare manualmente un breve programma della CPU del caso di studio, assegnando un indirizzo a ogni istruzione e a ogni etichetta e scrivendo i byte di un salto.',
  concetti: [['file', 'Dal testo ai byte'], ['puntatore', 'Un nome per un indirizzo'], ['lente', 'Due letture del testo']],
  filigrana: ['file', 'puntatore', 'tabella'],
  richiami: {
    carte: [
      { sim: 'hex', da: 'Dall’unità 3.3.2', t: 'Le lunghezze', d: 'Un byte di codice, più uno se sono presenti i registri, più otto se è presente la costante: 1, 2, 9 oppure 10 byte.' },
      { sim: 'cpu', da: 'Dall’unità 1.1.3', t: 'L’assemblatore', d: 'È il programma che traduce le istruzioni scritte come testo nei byte del codice macchina.' },
      { sim: 'memory', da: 'Dall’unità 1.2.3', t: 'Little-endian', d: 'Il byte meno significativo di un numero occupa l’indirizzo più basso.' }
    ],
    domanda: { d: 'Prima di proseguire: un programma ha inizio all’indirizzo 0x40 con `mov rax, 5`, seguita da `je`. A quale indirizzo ha inizio `je`?', o: [
      { t: '0x4A', ok: true, fb: '`mov rax, 5` occupa 10 byte: 0x40 + 10 = 0x4A.' },
      { t: '0x49', fb: 'Nove byte è la lunghezza di `je`. `mov rB, V` ha anche il byte dei registri, e ne occupa 10.' },
      { t: '0x42', fb: 'Due byte è la lunghezza di un’istruzione fra registri. `mov rB, V` contiene una costante di otto byte.' }
    ] }
  },
  idea: {
    titolo: 'Due letture del testo',
    termini: ['assemblaggio a due passate', 'tabella dei simboli'],
    testo: [
      'Nella programmazione in assembly gli indirizzi sono lasciati all’assemblatore. Si scrive `je fine`, dove `fine` è un’etichetta, cioè un nome assegnato a una posizione del programma, come nei listati del Modulo II. Spetta all’assemblatore sostituire il nome con un indirizzo durante la traduzione del testo in byte. La ripetizione manuale di tale lavoro su un programma breve costituisce una verifica della comprensione della codifica.',
      'La difficoltà risiede nei salti in avanti. Quando l’assemblatore incontra `je fine`, la posizione di `fine` dipende dalle istruzioni intermedie, che devono ancora essere lette. La soluzione consiste nel leggere il testo due volte, con l’[[assemblaggio a due passate]].',
      'Nella prima passata l’assemblatore si limita a contare. Esso mantiene un contatore di posizione, che parte dall’indirizzo iniziale del programma, e per ogni istruzione lo incrementa della sua lunghezza. Quando incontra un’etichetta annota il valore del contatore in un elenco di nomi e indirizzi, la [[tabella dei simboli]]. Un’etichetta occupa zero byte: è soltanto un nome per l’indirizzo dell’istruzione che la segue.',
      'Nella seconda passata gli indirizzi sono tutti noti. L’assemblatore scrive i byte di ogni istruzione, e in corrispondenza di un nome consulta la tabella dei simboli. La destinazione di `je` è scritta negli otto byte della costante, in little-endian, ed è l’indirizzo assoluto dell’istruzione indicata.',
      { fig: 'scena', w: 720, h: 190, titolo: 'Un programma assemblato a partire da 0x40', nota: 'Ogni riga ha inizio dove termina la precedente. L’etichetta fine vale 0x56.', els: [
        SL.el.nota('a0', 0, 12, '0x40', 'mono'), SL.el.box('t0', 90, 0, 250, 36, null, 'mov rax, 5', 'on', { cls: 'stretta' }), SL.el.nota('b0', 356, 12, '30 F0 05 00 00 00 00 00 00 00', 'mono minuta'),
        SL.el.nota('a1', 0, 58, '0x4A', 'mono'), SL.el.box('t1', 90, 46, 250, 36, null, 'je fine', 'att', { cls: 'stretta' }), SL.el.nota('b1', 356, 58, '73 56 00 00 00 00 00 00 00', 'mono minuta', 'att'),
        SL.el.nota('a2', 0, 104, '0x53', 'mono'), SL.el.box('t2', 90, 92, 250, 36, null, 'nop, tre volte', 'on', { cls: 'stretta' }), SL.el.nota('b2', 356, 104, '10 10 10', 'mono minuta'),
        SL.el.nota('a3', 0, 150, '0x56', 'mono', 'att'), SL.el.box('t3', 90, 138, 250, 36, null, 'fine: halt', 'on', { cls: 'stretta' }), SL.el.nota('b3', 356, 150, '00', 'mono minuta')
      ] },
      'È sufficiente aggiungere o rimuovere un’istruzione prima di un’etichetta perché il suo indirizzo cambi, e con esso i byte di tutti i salti che la nominano. Per questa ragione il lavoro è affidato a un programma.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento assembla un programma di quattro righe: `mov rax, 5`, un salto in avanti verso l’etichetta `fine`, alcune `nop` e, all’etichetta, una `halt`. I controlli fissano l’indirizzo iniziale e il numero di `nop`.',
      'La prima passata assegna gli indirizzi e la seconda scrive i byte. Dopo il caso proposto, è istruttivo modificare il numero di `nop` e osservare quali byte del salto cambiano.'
    ],
    vedrai: [
      ['file', 'Il listato', 'A sinistra: l’indirizzo e il testo di ogni riga.'],
      ['hex', 'I byte', 'A destra: la lunghezza e i byte prodotti nella seconda passata.'],
      ['tabella', 'Il lavoro dell’assemblatore', 'In basso: il contatore di posizione e la tabella dei simboli.']
    ]
  },
  lab: {
    titolo: 'Assemblaggio di un salto in avanti',
    scena: { w: 860, h: 328 },
    atti: ['Il testo', 'Prima passata', 'La tabella dei simboli', 'Seconda passata', 'Il controllo'],
    controlli: [
      { id: 'pc', tipo: 'scelta', eti: 'Indirizzo iniziale', opzioni: [[0x40, '0x40'], [0x1F0, '0x1F0']], valore: 0x40 },
      { id: 'n', tipo: 'scelta', eti: 'Numero di nop', opzioni: [[0, 'nessuna'], [3, '3'], [6, '6']], valore: 3 }
    ],
    nota: 'I passi sono sempre nove: il testo, quattro righe nella prima passata, tre scritture nella seconda e il controllo finale.',
    previsione: {
      domanda: (p) => 'Il programma ha inizio all’indirizzo ' + SL.isa.esa(p.pc) + ' con `mov rax, 5`, poi `je fine`, poi ' + (p.n ? p.n + ' `nop`' : 'nessuna `nop`') + ' e, all’etichetta `fine`, una `halt`. Quale indirizzo riceve l’etichetta `fine`?',
      opzioni: (p) => Array.from(new Set([p.pc + 19 + p.n, p.pc + 19, p.pc + 20 + p.n, p.pc + 10 + p.n, p.pc + 18 + p.n])).sort((a, b) => a - b).map(SL.isa.esa)
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. L’etichetta `fine` vale ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : '`fine` è preceduta da `mov rax, 5`, di 10 byte, da `je fine`, di 9, e da ' + p.n + ' `nop` di un byte: ' + SL.isa.esa(p.pc) + ' + 10 + 9 + ' + p.n + ' = ' + esito + '. L’etichetta stessa occupa zero byte.'),
    costruisci(p) {
      const el = SL.el, Y = SL.isa, H = Y.esa, passi = [], n = p.n, A = [p.pc, p.pc + 10, p.pc + 19, p.pc + 19 + n], fine = A[3];
      const TESTI = ['mov rax, 5', 'je fine', n ? 'nop, ' + n + ' volte' : 'nessuna nop', 'fine: halt'], LUNG = [10, 9, n, 1];
      const BYTE = [Y.byteIst({ n: 'ir', b: 'rax', c: 5 }), Y.byteIst({ n: 'je', c: fine }), Array(n).fill(0x10), [0]].map((b) => b.map(Y.esa2).join(' '));
      const st = { ind: -1, byte: -1, cont: p.pc, sim: false, pass: 'prima' };
      const quadro = (o) => {
        const els = [el.nota('h0', 20, 0, 'INDIRIZZO', 'mono'), el.nota('h1', 150, 0, 'TESTO', 'mono'), el.nota('h2', 410, 0, 'BYTE', 'mono'), el.nota('h3', 490, 0, 'CODICE MACCHINA', 'mono')];
        TESTI.forEach((t, k) => {
          const y = 28 + k * 52, vuota = k === 2 && n === 0;
          els.push(el.cella('a' + k, 20, y, 116, 44, st.ind >= k && !vuota ? H(A[k]) : '·', vuota ? 'off' : o.riga === k && st.pass === 'prima' ? 'att' : st.ind >= k ? 'on' : '', { piccola: true, cls: 'minuta' }),
            el.box('t' + k, 150, y, 246, 44, null, t, vuota ? 'off' : o.riga === k ? 'att' : 'on', { cls: 'stretta' }),
            el.cella('l' + k, 410, y, 66, 44, st.ind >= k ? String(LUNG[k]) : '·', vuota ? 'off' : st.ind >= k ? 'on' : '', { piccola: true, cls: 'minuta' }),
            el.box('b' + k, 490, y, 354, 44, null, st.byte >= k ? (BYTE[k] || 'nessun byte') : '·', vuota ? 'off' : o.riga === k && st.pass === 'seconda' ? 'att' : st.byte >= k ? 'on' : '', { cls: 'stretta' }));
        });
        els.push(el.box('c1', 20, 250, 250, 66, 'contatore di posizione', H(st.cont), o.cont ? 'att' : 'on', { cls: 'stretta' }),
          el.box('c2', 284, 250, 276, 66, 'tabella dei simboli', st.sim ? 'fine = ' + H(fine) : 'vuota', o.sim ? 'att' : st.sim ? 'on' : '', { cls: 'stretta' }),
          el.box('c3', 574, 250, 270, 66, 'passata', st.pass, o.pass ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Passata', st.pass, 'a'], ['Contatore', H(st.cont)], ['fine', st.sim ? H(fine) : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ pass: true }, 0, 'Quattro righe di testo', 'Il programma è scritto come testo. La seconda riga salta all’etichetta `fine`, che compare soltanto alla quarta. L’assemblatore inizia la prima passata con il contatore di posizione a ' + H(p.pc) + ' e la tabella dei simboli vuota.',
        { chiedi: { d: 'La prima riga è `mov rax, 5`, che ha inizio a ' + H(p.pc) + '. Di quanto avanza il contatore?', o: ['2 byte', '9 byte', '10 byte'], g: 2, no: '`mov rB, V` ha il codice, il byte dei registri e la costante: 1 + 1 + 8 = 10 byte.' } });
      st.ind = 0; st.cont = A[1];
      P({ riga: 0, cont: true }, 1, 'Prima passata: mov', '`mov rax, 5` ha inizio a ' + H(A[0]) + ' e occupa 10 byte. Il contatore avanza a ' + H(A[1]) + '. In questa passata l’assemblatore non scrive alcun byte.', { calc: H(A[0]) + ' + 10 = ' + H(A[1]) });
      st.ind = 1; st.cont = A[2];
      P({ riga: 1, cont: true }, 1, 'Prima passata: je', '`je fine` ha inizio a ' + H(A[1]) + '. La sua destinazione è ancora ignota, mentre la lunghezza è già determinata: `je` occupa sempre 9 byte, qualunque indirizzo contenga. Il contatore avanza a ' + H(A[2]) + '.',
        { calc: H(A[1]) + ' + 9 = ' + H(A[2]), chiedi: { d: n ? 'Seguono ' + n + ' `nop`, da un byte ciascuna. Quale valore raggiungerà il contatore?' : 'Fra `je` e l’etichetta non sono presenti `nop`. Quale valore ha il contatore quando incontra `fine`?', o: Array.from(new Set([A[2], A[3], A[3] + 1])).map(H), g: Array.from(new Set([A[2], A[3], A[3] + 1])).indexOf(A[3]), no: n ? H(A[2]) + ' + ' + n + ' = ' + H(A[3]) + '.' : 'Il contatore è rimasto a ' + H(A[2]) + ', dove termina `je`.' } });
      st.ind = 2; st.cont = A[3];
      P({ riga: 2, cont: true }, 1, n ? 'Prima passata: le nop' : 'Prima passata: nessuna nop', n ? 'Le ' + n + ' `nop` occupano un byte ciascuna, a partire da ' + H(A[2]) + '. Il contatore avanza a ' + H(A[3]) + '.' : 'In questa versione del programma la terza riga è vuota, e il contatore resta a ' + H(A[3]) + '.', { calc: H(A[2]) + ' + ' + n + ' = ' + H(A[3]) });
      st.ind = 3; st.sim = true; st.cont = A[3] + 1;
      P({ riga: 3, sim: true }, 2, 'L’etichetta è inserita nella tabella', 'L’assemblatore incontra l’etichetta `fine` con il contatore a ' + H(fine) + ', e annota la coppia nella tabella dei simboli. L’etichetta occupa zero byte. La `halt` che la segue ha inizio al medesimo indirizzo e occupa un byte, quindi il contatore termina a ' + H(fine + 1) + '.',
        { calc: 'fine = ' + H(fine), chiedi: { d: 'Nella seconda passata `je` conterrà l’indirizzo ' + H(fine) + ' in otto byte little-endian. Qual è il primo di tali otto byte?', o: Array.from(new Set([Y.esa2(fine & 255), Y.esa2(fine >> 8), '73'])), g: 0, no: 'In little-endian il primo è il byte meno significativo, cioè le due cifre più a destra di ' + H(fine) + '.' } });
      st.pass = 'seconda'; st.byte = 0; st.cont = p.pc;
      P({ riga: 0, pass: true }, 3, 'Seconda passata: mov', 'L’assemblatore rilegge il testo dall’inizio, scrivendo questa volta i byte. Per `mov rax, 5`: il codice 30, il byte dei registri F0, con F per il campo rA inutilizzato e 0 per RAX, e la costante 5 in otto byte.', { calc: BYTE[0] });
      st.byte = 1;
      P({ riga: 1, sim: true }, 3, 'Seconda passata: je', 'Per `je` il codice è 73. Al posto del nome `fine` l’assemblatore legge nella tabella dei simboli l’indirizzo ' + H(fine) + ', e lo scrive in little-endian: prima ' + Y.esa2(fine & 255) + ', poi ' + Y.esa2((fine >> 8) & 255) + ', poi sei byte a zero.', { calc: BYTE[1] });
      st.byte = 3;
      P({ riga: 3 }, 3, 'Seconda passata: le ultime righe', (n ? 'Ogni `nop` è il solo byte 10. ' : '') + 'La `halt` è il solo byte 00, all’indirizzo ' + H(fine) + '. Il programma occupa complessivamente ' + (20 + n) + ' byte, da ' + H(p.pc) + ' a ' + H(fine) + '.', { calc: (20 + n) + ' byte complessivi' });
      P({ riga: 1, sim: true }, 4, 'Il controllo', 'La verifica consiste nell’esecuzione mentale del programma. La CPU preleva `je` a ' + H(A[1]) + ' e ne legge la costante. Se ZF vale 1, il PC riceve ' + H(fine) + ', dove si trova il byte 00, la `halt`' + (n ? ', e le `nop` intermedie sono omesse' : '') + '; in caso contrario riceve valP = ' + H(A[2]) + '.' + (n ? '' : ' In questa versione i due indirizzi coincidono.') + ' Al variare del numero di `nop` cambierebbero l’indirizzo di `fine` e i byte di `je`, e nessun altro byte.',
        { calc: 'PC dopo il salto = ' + H(fine), esito: ['fine = ' + H(fine), 'si'] });
      return { passi, esito: H(fine) };
    }
  },
  bilancio: {
    regola: [
      'Prima passata: un contatore di posizione avanza della lunghezza di ogni istruzione, e ogni etichetta riceve il valore assunto dal contatore in quel punto. Un’etichetta occupa zero byte.',
      'Seconda passata: si scrivono i byte, sostituendo a ogni nome l’indirizzo presente nella tabella dei simboli. La destinazione di un salto occupa otto byte in little-endian.'
    ],
    errori: [
      ['Assegnare spazio alle etichette.', 'Un’etichetta è un nome. L’indirizzo che essa riceve è quello dell’istruzione che la segue.'],
      ['Scrivere nel salto la distanza.', 'Nella CPU del caso di studio la costante di `je` è l’indirizzo assoluto della destinazione.'],
      ['Scrivere l’indirizzo dal byte più significativo.', 'La costante è in little-endian: per 0x1A4 i primi due byte sono A4 e 01.']
    ],
    saFare: ['Assegnare un indirizzo a ogni riga di un breve programma.', 'Compilare la tabella dei simboli.', 'Scrivere i byte di un salto verso un’etichetta.'],
    esercizi: [
      { d: 'Un programma ha inizio all’indirizzo 0x100 e contiene, nell’ordine: `mov rax, 1`, `mov rbx, rax`, `je fine`, due `nop` e, all’etichetta `fine`, una `halt`. Quale indirizzo riceve `fine`? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x120', giuste: ['0x117', '117', '117h'],
        ok: '`fine` è preceduta da 10 + 2 + 9 + 2 = 23 byte: 0x100 + 23 = 0x117.',
        diagnosi: [
          { se: ['0x118', '118', '118h'], msg: 'La `halt` si trova all’etichetta stessa, quindi il suo byte è escluso dal calcolo.' },
          { se: ['0x115', '115', '115h'], msg: 'Fra `je` e l’etichetta sono presenti due `nop`, da un byte ciascuna.' },
          { se: ['0x123', '123', '123h'], msg: 'I byte prima dell’etichetta sono 23 in decimale, cioè 0x17 in esadecimale.' }
        ],
        altro: 'L’indirizzo è diverso. Si sommino le lunghezze delle istruzioni che precedono l’etichetta, e si aggiunga il totale a 0x100 in esadecimale.',
        indizi: ['Lunghezze: `mov rax, 1` 10, `mov rbx, rax` 2, `je` 9, `nop` 1.', '10 + 2 + 9 + 1 + 1 = 23.', '23 in esadecimale è 0x17.'],
        svolgimento: ['Byte prima di `fine`: 10 + 2 + 9 + 2 = 23.', '23 = 0x17.', 'fine = 0x100 + 0x17 = 0x117.'] },
      { d: 'Quali sono i primi tre byte della codifica di `je 0x1A4`? Si risponda in esadecimale, nell’ordine in cui i byte compaiono in memoria.', segnaposto: 'Per esempio 73 00 00', giuste: ['73a401'],
        ok: 'Il codice di `je` è 73. La destinazione 0x1A4 in little-endian ha inizio con A4 e prosegue con 01.',
        diagnosi: [
          { se: ['7301a4'], msg: 'La costante è in little-endian: il primo è il byte meno significativo, A4.' },
          { se: ['73a400'], msg: 'Il secondo byte della costante è la parte alta di 0x1A4, cioè 01.' },
          { se: ['a40173', 'a401'], msg: 'Il primo byte dell’istruzione è il codice, 73. La destinazione segue il codice.' }
        ],
        altro: 'I byte sono diversi. Si scriva il codice di `je`, poi la destinazione a partire dal byte meno significativo.',
        indizi: ['Il codice di `je` è 73.', '0x1A4 su otto byte è 00 … 00 01 A4.', 'In memoria i byte della costante compaiono in ordine inverso: A4, 01, 00, …'],
        svolgimento: ['Codice: 73.', 'Costante 0x1A4 in little-endian: A4 01 00 00 00 00 00 00.', 'Primi tre byte: 73 A4 01.'] }
    ]
  }
});
