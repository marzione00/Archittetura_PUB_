'use strict';
SL.registra('3.1.3', {
  titolo: 'Aritmetica e costruzione dell’ALU',
  obiettivo: 'Obiettivo: spiegare come il medesimo sommatore esegua anche le sottrazioni, e ricostruire il valore matematico a partire dalla parola conservata e dal riporto finale.',
  concetti: [['alu', 'Il riporto entrante come comando'], ['segno', 'La sottrazione mediante somma'], ['bilancio', 'La parola e il riporto finale']],
  filigrana: ['alu', 'segno', 'porta'],
  richiami: {
    carte: [
      { sim: 'alu', da: 'Dall’unità 1.5.5', t: 'Una cella per colonna', d: 'Il sommatore dispone in fila un sommatore completo per colonna. Il riporto di ciascuno entra nel successivo.' },
      { sim: 'segno', da: 'Dall’unità 1.4.1', t: 'Cambiare segno', d: 'In complemento a due l’opposto di un numero si ottiene invertendo tutti i bit e aggiungendo 1.' },
      { sim: 'byte', da: 'Dall’unità 1.5.3', t: 'La XOR come invertitore comandato', d: 'Una XOR con 1 inverte l’altro ingresso. Una XOR con 0 lo lascia invariato.' }
    ],
    domanda: { d: 'Prima di proseguire: su quattro bit, quale parola si ottiene invertendo i bit di 0011 e aggiungendo 1?', o: [
      { t: '1101', ok: true, fb: 'L’inversione di 0011 dà 1100, e l’aggiunta di 1 dà 1101, che in complemento a due vale −3.' },
      { t: '1100', fb: 'Questa è la parola con i bit invertiti. Manca l’aggiunta di 1.' },
      { t: '0100', fb: 'Questa è 0011 aumentata di 1. Prima vanno invertiti i bit.' }
    ] }
  },
  idea: {
    titolo: 'Un solo sommatore per due operazioni',
    termini: ['riporto entrante', 'sommatore-sottrattore'],
    testo: [
      'Il sommatore dell’unità 1.5.5 dispone in fila una cella per colonna. La prima cella a destra riceveva un riporto fisso a 0. Tale filo prende il nome di [[riporto entrante]] e si indica con C0. Esso può essere comandato: con C0 = 1 il circuito calcola A + B + 1.',
      'Tale possibilità consente di ottenere la sottrazione senza un circuito dedicato. In complemento a due il numero −B si ottiene invertendo tutti i bit di B e aggiungendo 1. Pertanto A − B è uguale ad A, più i bit di B invertiti, più 1. L’aggiunta di 1 è fornita dal riporto entrante, e per l’inversione è sufficiente una XOR su ciascun filo di B.',
      'Un solo filo di comando, indicato con SUB, svolge i due compiti: entra in tutte le XOR e costituisce il riporto entrante. Con SUB = 0 i bit di B restano invariati e il circuito calcola A + B. Con SUB = 1 i bit di B risultano invertiti, C0 vale 1, e il circuito calcola A − B. Tale circuito è il [[sommatore-sottrattore]], la parte aritmetica dell’ALU.',
      { fig: 'scena', w: 720, h: 170, titolo: 'Il sommatore-sottrattore', nota: 'Il filo SUB comanda le XOR e costituisce il riporto entrante.', els: [
        SL.el.box('a', 20, 10, 110, 56, 'A', '4 bit', 'on', { cls: 'stretta' }), SL.el.box('b', 20, 100, 110, 56, 'B', '4 bit', 'on', { cls: 'stretta' }),
        SL.el.box('x', 200, 100, 150, 56, 'quattro XOR', 'B oppure NOT B', 'att', { cls: 'stretta' }), SL.el.linea('l1', 130, 128, 200, 128, 'on'),
        SL.el.box('s', 430, 34, 150, 96, 'sommatore', 'quattro celle', 'on', { cls: 'stretta' }), SL.el.linea('l2', 130, 38, 430, 60, 'on'), SL.el.linea('l3', 350, 128, 430, 104, 'on'),
        SL.el.box('u', 640, 34, 70, 96, 'S', '4 bit', 'on', { cls: 'stretta' }), SL.el.linea('l4', 580, 82, 640, 82, 'on'),
        SL.el.nota('n', 200, 14, 'SUB', 'mono', 'att'), SL.el.linea('l5', 240, 34, 270, 100, 'att'), SL.el.linea('l6', 250, 24, 500, 34, 'att'), SL.el.nota('n2', 372, 6, 'C0', 'mono minuta', 'att')
      ] },
      'Su quattro bit il circuito conserva una parola di quattro bit. Il riporto in uscita dall’ultima cella, C4, pesa 16. Nella somma il valore matematico si ricostruisce aggiungendo alla parola 16 × C4. Nella somma di 9 e 8 la parola vale 1 e C4 vale 1, e in effetti 1 + 16 = 17.',
      'Nella sottrazione C4 assume il significato opposto. Quando A è maggiore o uguale a B, il circuito produce C4 = 1 e la parola è la differenza. Quando A è minore di B produce C4 = 0, e la parola, letta in complemento a due, è la differenza negativa. I processori x86 presentano al programma questo filo invertito: è il prestito che l’unità 2.2.6 indicava con CF.'
    ]
  },
  esperimento: {
    faremo: [
      'Un sommatore-sottrattore a quattro bit riceve due numeri e il comando SUB. I controlli fissano l’operazione e gli operandi.',
      'Si osserva l’effetto delle XOR sui bit di B, la propagazione del riporto entrante attraverso le colonne e il significato del riporto finale. Dopo il caso proposto, è istruttivo scambiare i due operandi e confrontare il valore di C4.'
    ],
    vedrai: [
      ['bit', 'Gli operandi', 'In alto: i bit di A, quelli di B e quelli di B dopo le XOR.'],
      ['alu', 'I riporti', 'Al centro: il riporto che entra in ciascuna colonna, da C0 a C4.'],
      ['output', 'La parola', 'In basso: i quattro bit conservati.']
    ]
  },
  lab: {
    titolo: 'Il sommatore che esegue la sottrazione',
    scena: { w: 860, h: 318 },
    atti: ['Il comando', 'Le XOR e il riporto entrante', 'Le quattro colonne', 'La parola e il riporto'],
    controlli: [
      { id: 'op', tipo: 'scelta', eti: 'Operazione', opzioni: [['add', 'A + B'], ['sub', 'A − B']], valore: 'sub' },
      { id: 'a', tipo: 'scelta', eti: 'A', opzioni: [[3, '3'], [5, '5'], [9, '9'], [12, '12']], valore: 3 },
      { id: 'b', tipo: 'scelta', eti: 'B', opzioni: [[1, '1'], [5, '5'], [8, '8'], [12, '12']], valore: 5 }
    ],
    nota: 'I passi sono sempre otto. Gli operandi determinano dove i riporti hanno origine e dove si arrestano.',
    previsione: {
      domanda: (p) => 'Un sommatore-sottrattore a quattro bit calcola ' + p.a + (p.op === 'sub' ? ' − ' : ' + ') + p.b + '. Quale parola di quattro bit conserva?',
      opzioni: (p) => { const U = SL.unita313, r = U.conto(p).r; return Array.from(new Set([r, (p.a + p.b) & 15, (p.a - p.b) & 15, Math.abs(p.a - p.b), (p.b - p.a) & 15, (p.a + (p.b ^ 15)) & 15])).slice(0, 4).sort((x, y) => x - y).map((v) => [v, U.B4(v)]); }
    },
    confronto: (pred, esito, p) => { const U = SL.unita313, c = U.conto(p); return 'La previsione indicava ' + U.B4(pred) + '. La parola conservata è ' + U.B4(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.op === 'add' ? 'La somma esatta vale ' + (p.a + p.b) + (c.c4 ? ', che supera 15: nei quattro bit resta ' + esito + ' e il riporto finale rappresenta 16.' : ', che è rappresentabile in quattro bit.') : 'Il circuito somma ' + U.B4(p.a) + ', i bit invertiti di B, cioè ' + U.B4(p.b ^ 15) + ', e il riporto entrante 1.' + (p.a < p.b ? ' La parola vale ' + esito + ' senza segno, e ' + (esito - 16) + ' in complemento a due.' : '')); },
    costruisci(p) {
      const el = SL.el, U = SL.unita313, B4 = U.B4, passi = [], sub = p.op === 'sub' ? 1 : 0, c = U.conto(p), bx = c.bx;
      const bit = (v, i) => (v >> i) & 1, xc = (i) => 300 + (3 - i) * 120, SEG = sub ? ' − ' : ' + ';
      const st = { xor: false, C: [null, null, null, null, null], S: [null, null, null, null] };
      const parola = () => (st.S[0] == null ? '·' : [3, 2, 1, 0].map((i) => (st.S[i] == null ? '·' : st.S[i])).join(''));
      const quadro = (o) => {
        const els = [el.nota('ta', 40, 22, 'A = ' + p.a, 'mono'), el.nota('tb', 40, 78, 'B = ' + p.b, 'mono'), el.nota('tx', 40, 134, 'B dopo le XOR', 'mono', o.xor ? 'att' : ''), el.nota('tc', 40, 192, 'riporti', 'mono'), el.nota('ts', 40, 262, 'parola S', 'mono')];
        for (let i = 0; i < 4; i++) {
          const x = xc(i), qui = o.col === i;
          els.push(el.cella('a' + i, x, 8, 70, 44, String(bit(p.a, i)), qui ? 'att' : bit(p.a, i) ? 'on' : 'zero', { piccola: true }),
            el.cella('b' + i, x, 64, 70, 44, String(bit(p.b, i)), o.xor ? 'att' : bit(p.b, i) ? 'on' : 'zero', { piccola: true }),
            el.cella('x' + i, x, 120, 70, 44, st.xor ? String(bit(bx, i)) : '·', !st.xor ? 'off' : o.xor || qui ? 'att' : bit(bx, i) ? 'on' : 'zero', { piccola: true }),
            el.cella('s' + i, x, 248, 70, 44, st.S[i] == null ? '·' : String(st.S[i]), st.S[i] == null ? 'off' : qui || o.fine ? 'att' : st.S[i] ? 'on' : 'zero', { piccola: true, so: 'S' + i }));
        }
        for (let i = 0; i <= 4; i++) els.push(el.cella('c' + i, i === 4 ? 232 : xc(i) + 76, 182, 40, 36, st.C[i] == null ? '·' : String(st.C[i]), st.C[i] == null ? 'off' : (o.col === i || (o.c0 && i === 0) || (o.fine && i === 4) || o.col === i - 1) ? 'att' : st.C[i] ? 'on' : 'zero', { cls: 'minuta', so: 'C' + i }));
        els.push(el.box('sub', 786, 120, 64, 98, 'SUB', String(sub), o.cmd || o.xor || o.c0 ? 'att' : sub ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Operazione', p.a + SEG + p.b, 'a'], ['SUB', String(sub)], ['Parola', parola(), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ cmd: true }, 0, 'Il comando', 'Il circuito deve calcolare ' + p.a + SEG + p.b + '. A vale ' + B4(p.a) + ' e B vale ' + B4(p.b) + '. Il comando SUB vale ' + sub + (sub ? ', poiché l’operazione è una sottrazione.' : ', poiché l’operazione è una somma.'),
        { chiedi: { d: 'Con SUB = ' + sub + ', quale effetto hanno le XOR sui bit di B?', o: ['Li lasciano invariati', 'Li invertono'], g: sub, no: 'Una XOR con 0 lascia il bit invariato, una XOR con 1 lo inverte. In questo caso SUB vale ' + sub + '.' } });
      st.xor = true;
      P({ xor: true }, 1, sub ? 'Le XOR invertono B' : 'Le XOR lasciano B invariato', 'Ogni bit di B attraversa una XOR insieme a SUB. ' + (sub ? 'SUB vale 1, quindi i bit risultano invertiti: ' + B4(p.b) + ' diventa ' + B4(bx) + '.' : 'SUB vale 0, quindi i bit restano invariati: ' + B4(bx) + '.'), { calc: B4(p.b) + ' XOR ' + (sub ? '1111' : '0000') + ' = ' + B4(bx) });
      st.C[0] = sub;
      P({ c0: true }, 1, 'Il riporto entrante', 'Il medesimo filo SUB giunge alla prima colonna come riporto entrante: C0 = ' + sub + '. ' + (sub ? 'Si tratta dell’aggiunta di 1 che completa il cambio di segno di B. Il sommatore calcolerà ' + p.a + ' + ' + bx + ' + 1.' : 'Nessun valore è aggiunto, e il sommatore calcolerà ' + p.a + ' + ' + p.b + '.'),
        { calc: 'C0 = ' + sub, chiedi: { d: 'Nella colonna 0 entrano ' + bit(p.a, 0) + ', ' + bit(bx, 0) + ' e il riporto ' + sub + '. Quanto vale il bit S0?', o: ['0', '1'], g: c.S[0], no: 'Il bit della somma vale 1 quando gli ingressi a 1 sono in numero dispari.' } });
      for (let i = 0; i < 4; i++) {
        const a = bit(p.a, i), b = bit(bx, i), ci = c.C[i], tot = a + b + ci;
        st.S[i] = c.S[i]; st.C[i + 1] = c.C[i + 1];
        P({ col: i }, 2, 'Colonna ' + i, 'Entrano ' + a + ', ' + b + ' e il riporto ' + ci + ': ' + (tot === 0 ? 'nessun ingresso vale 1' : tot === 1 ? 'un solo ingresso vale 1' : tot === 2 ? 'due ingressi valgono 1' : 'tutti e tre valgono 1') + '. Il bit S' + i + ' vale ' + c.S[i] + ' e il riporto verso ' + (i < 3 ? 'la colonna ' + (i + 1) : 'l’esterno') + ' vale ' + c.C[i + 1] + '.',
          { calc: a + ' + ' + b + ' + ' + ci + ' = ' + tot + ' → S' + i + ' = ' + c.S[i] + ', C' + (i + 1) + ' = ' + c.C[i + 1], chiedi: i === 3 ? { d: sub ? 'Il riporto finale C4 vale ' + c.c4 + '. A è minore di B?' : 'Il riporto finale C4 vale ' + c.c4 + '. La somma esatta supera 15?', o: ['Sì', 'No'], g: sub ? (p.a < p.b ? 0 : 1) : (c.c4 ? 0 : 1), no: sub ? 'Nella sottrazione C4 = 0 segnala che A è minore di B. In questo caso C4 vale ' + c.c4 + '.' : 'Nella somma C4 = 1 segnala che il totale supera 15. In questo caso C4 vale ' + c.c4 + '.' } : null });
        if (!passi[passi.length - 1].chiedi) delete passi[passi.length - 1].chiedi;
      }
      const r = c.r;
      P({ fine: true }, 3, 'La parola e il riporto finale', 'La parola conservata è ' + B4(r) + ', cioè ' + r + '. ' + (!sub ? (c.c4 ? 'Il riporto finale vale 1 e pesa 16: il totale matematico è ' + r + ' + 16 = ' + (p.a + p.b) + '.' : 'Il riporto finale vale 0, quindi la parola coincide con il totale: ' + p.a + ' + ' + p.b + ' = ' + r + '.')
        : (p.a >= p.b ? 'Il riporto finale vale 1: A è maggiore o uguale a B, e la parola è la differenza ' + p.a + ' − ' + p.b + ' = ' + r + '.' : 'Il riporto finale vale 0: A è minore di B. Letta in complemento a due la parola vale ' + r + ' − 16 = ' + (r - 16) + ', che coincide con ' + p.a + ' − ' + p.b + '.')),
        { calc: !sub ? r + ' + 16 × ' + c.c4 + ' = ' + (p.a + p.b) : p.a + ' − ' + p.b + ' = ' + (p.a - p.b), esito: [B4(r) + ' · C4 = ' + c.c4, 'si'] });
      return { passi, esito: r };
    }
  },
  bilancio: {
    regola: [
      'Un sommatore con riporto entrante calcola A + B + C0. Invertendo i bit di B con una fila di XOR e ponendo C0 = 1, il medesimo circuito calcola A − B.',
      'Il circuito conserva una parola della stessa larghezza degli operandi. Su quattro bit, nella somma il totale vale parola più 16 × C4. Nella sottrazione C4 = 0 segnala che A è minore di B.'
    ],
    errori: [
      ['Invertire B e omettere il riporto entrante.', 'A più i bit invertiti di B dà A − B − 1. Il cambio di segno richiede anche l’aggiunta di 1.'],
      ['Leggere C4 nella sottrazione come nella somma.', 'Nella sottrazione il significato è opposto: C4 = 1 accompagna una differenza rappresentabile nei quattro bit, C4 = 0 segnala un prestito.'],
      ['Supporre due circuiti separati per somma e sottrazione.', 'Il sommatore è uno solo. La sottrazione richiede in più una XOR per bit e un filo di comando.']
    ],
    saFare: ['Spiegare come un sommatore esegua una sottrazione.', 'Seguire i riporti colonna per colonna a partire dal riporto entrante.', 'Ricostruire il valore matematico dalla parola e dal riporto finale.'],
    esercizi: [
      { d: 'Un sommatore-sottrattore a quattro bit calcola 6 − 9. Quale parola conserva? Si risponda in binario.', segnaposto: 'Quattro cifre binarie', giuste: ['1101'],
        ok: 'Il circuito somma 0110, i bit invertiti di 1001, cioè 0110, e il riporto entrante 1. Il risultato è 1101, che in complemento a due vale −3.',
        diagnosi: [
          { se: ['0011'], msg: 'Questa è la parola di 9 − 6. In questo caso il minuendo è 6, e il risultato è negativo.' },
          { se: ['1100'], msg: 'Manca il riporto entrante. Dopo avere invertito i bit di B va aggiunto 1.' },
          { se: ['1111'], msg: 'Questa è la parola di 6 + 9. Nella sottrazione i bit di B attraversano le XOR e ne risultano invertiti.' }
        ],
        altro: 'La parola è diversa. Si invertano i bit di 1001, poi si sommi il risultato a 0110 e si aggiunga 1.',
        indizi: ['6 vale 0110 e 9 vale 1001.', 'Invertendo i bit di 9 si ottiene 0110.', '0110 + 0110 + 1.'],
        svolgimento: ['Bit di B invertiti: 0110.', '0110 + 0110 = 1100.', 'Con il riporto entrante: 1101, cioè −3.'] },
      { d: 'Su quattro bit la somma 12 + 7 lascia la parola 0011 e il riporto finale C4 = 1. Quanto vale il totale matematico?', segnaposto: 'Un numero', giuste: ['19', 'diciannove'],
        ok: 'La parola vale 3 e il riporto finale pesa 16: 3 + 16 = 19.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Questo è il valore della sola parola. Il riporto finale vale 1 e pesa 16.' },
          { se: ['4', 'quattro'], msg: 'Il riporto finale pesa 16, poiché esce dalla colonna di peso 8.' },
          { se: ['11', 'undici'], msg: 'Il riporto C4 esce oltre la quarta colonna e pesa 16. Otto è il peso della colonna 3.' }
        ],
        altro: 'Il numero è diverso. Si sommi al valore della parola il peso del riporto finale.',
        indizi: ['La parola 0011 vale 3.', 'C4 pesa 16.', '3 + 16.'],
        svolgimento: ['Parola: 0011 = 3.', 'Riporto finale: 16 × 1 = 16.', 'Totale: 3 + 16 = 19.'] }
    ],
    sfida: ['cslez3_1_03_random_assembly', 'Somme, differenze e riporti']
  }
});
SL.unita313 = {
  B4: (v) => (v & 15).toString(2).padStart(4, '0'),
  // Il sommatore-sottrattore, colonna per colonna: bx è B dopo le XOR, C[i] il riporto che entra nella colonna i.
  conto: (p) => {
    const sub = p.op === 'sub' ? 1 : 0, bx = sub ? p.b ^ 15 : p.b, C = [sub], S = [];
    for (let i = 0; i < 4; i++) { const t = ((p.a >> i) & 1) + ((bx >> i) & 1) + C[i]; S.push(t & 1); C.push(t >> 1); }
    return { bx, C, S, c4: C[4], r: S[0] + 2 * S[1] + 4 * S[2] + 8 * S[3] };
  }
};
