'use strict';
SL.registra('2.4.5', {
  titolo: 'Comporre una parola nel formato di un’istruzione',
  obiettivo: 'Alla fine saprai comporre una parola di 32 bit a partire dai valori dei suoi campi, e ricavare un campo dalla parola.',
  concetti: [['tabella', 'Un formato a campi fissi'], ['operation', 'Ogni valore al suo posto'], ['lente', 'La decodifica']],
  filigrana: ['tabella', 'operation', 'lente'],
  richiami: {
    carte: [
      { sim: 'byte', da: 'Dall’unità 2.3.6', t: 'I campi di un’istruzione', d: 'In codice macchina un’istruzione è una sequenza di bit divisa in campi: codice operativo, registri, scala.' },
      { sim: 'porta', da: 'Dall’unità 2.4.3', t: 'Impacchettamento', d: 'Ogni valore scorre fino al proprio campo, e OR riunisce i contributi, che occupano posizioni diverse.' },
      { sim: 'scudo', da: 'Dall’unità 2.4.4', t: 'Leggere un campo', d: 'Uno scorrimento a destra porta il campo alle unità, e una maschera di w uni elimina il resto.' }
    ],
    domanda: { d: 'Prima di proseguire: quanti valori diversi si possono scrivere in un campo di 5 bit?', o: [
      { t: '32', ok: true, fb: 'Due elevato a 5 fa 32: i numeri da 0 a 31.' },
      { t: '31', fb: 'Trentuno è il valore più grande. Contando anche lo zero, i valori sono 32.' },
      { t: '10', fb: 'Ogni bit raddoppia le combinazioni: 2, 4, 8, 16, 32.' }
    ] }
  },
  idea: {
    titolo: 'Quattro valori, trentadue bit',
    termini: ['formato a campi fissi'],
    testo: [
      'Nell’unità 2.3.6 un’istruzione x86 si è rivelata una sequenza di byte divisi in campi. Questa unità percorre la strada inversa, dai valori ai bit, su un formato più semplice da maneggiare: una parola di 32 bit, della stessa lunghezza per tutte le istruzioni. Formati di questo tipo sono adottati da molti processori diversi dall’x86, che usa invece lunghezze variabili.',
      'Un [[formato a campi fissi]] stabilisce una volta per tutte quali bit spettano a ciascuna informazione. In quello di questa unità i sei bit più alti contengono il codice operativo. I dieci successivi contengono i numeri di due registri, A e B, cinque bit ciascuno. I sedici più bassi contengono un immediato.',
      { fig: 'scena', w: 720, h: 96, titolo: 'Il formato di questa unità', nota: 'Sotto ogni campo, le posizioni dei bit che occupa.', els: [
        SL.el.box('f1', 10, 0, 150, 56, 'codice operativo', '6 bit', 'att'), SL.el.box('f2', 168, 0, 110, 56, 'registro A', '5 bit', 'on'), SL.el.box('f3', 286, 0, 110, 56, 'registro B', '5 bit', 'on'), SL.el.box('f4', 404, 0, 306, 56, 'immediato', '16 bit', ''),
        SL.el.nota('p1', 10, 62, 'bit 31 … 26', 'mono minuta'), SL.el.nota('p2', 168, 62, '25 … 21', 'mono minuta'), SL.el.nota('p3', 286, 62, '20 … 16', 'mono minuta'), SL.el.nota('p4', 404, 62, '15 … 0', 'mono minuta')] },
      'Comporre la parola significa impacchettare quattro valori, con la tecnica dell’unità 2.4.3. Ogni valore scorre a sinistra di tante posizioni quanti sono i bit che il formato colloca alla sua destra: 26 per il codice operativo, 21 per il registro A, 16 per il registro B, nessuna per l’immediato. I contributi cadono in campi diversi, e OR li riunisce.',
      'Ogni campo limita i valori che può accogliere. Con cinque bit i registri si numerano da 0 a 31, e con sedici l’immediato arriva a 65 535. Un valore più grande sconfinerebbe nel campo vicino. L’assemblatore, il programma che traduce l’assembly in codice macchina, rifiuta le istruzioni con valori fuori misura.',
      'La decodifica percorre la strada inversa con gli strumenti dell’unità 2.4.4: uno scorrimento a destra e una maschera per ciascun campo. È il primo lavoro che un processore compie su ogni istruzione che riceve.'
    ]
  },
  esperimento: {
    faremo: [
      'Sceglierai il codice operativo, i numeri dei due registri e l’immediato di un’istruzione. Collocheremo i quattro valori nella parola, uno alla volta, ciascuno con il proprio scorrimento.',
      'Riuniremo i contributi con OR e rileggeremo dalla parola il numero del registro A. Dopo il caso proposto, cambia soltanto il registro A e osserva quali cifre esadecimali della parola si muovono.'
    ],
    vedrai: [
      ['tabella', 'I quattro campi', 'In alto: i campi del formato, ciascuno con il valore scelto.'],
      ['bit', 'La parola', 'Al centro: i 32 bit, che si riempiono un campo alla volta.'],
      ['operation', 'I contributi', 'In basso: il valore di ogni campo dopo lo scorrimento, e la parola completa.']
    ]
  },
  lab: {
    titolo: 'Una parola di 32 bit composta campo per campo',
    scena: { w: 860, h: 308 },
    atti: ['Il formato', 'Il codice operativo', 'I due registri', 'L’immediato', 'L’unione', 'La decodifica'],
    controlli: [
      { id: 'op', tipo: 'scelta', eti: 'Codice operativo', opzioni: [[35, '35'], [8, '8'], [43, '43'], [4, '4']], valore: 35 },
      { id: 'a', tipo: 'scelta', eti: 'Registro A', opzioni: [[3, '3'], [17, '17'], [31, '31']], valore: 3 },
      { id: 'b', tipo: 'scelta', eti: 'Registro B', opzioni: [[5, '5'], [8, '8'], [29, '29']], valore: 5 },
      { id: 'i', tipo: 'scelta', eti: 'Immediato', opzioni: [[0x1234, '0x1234'], [0xFFFF, '0xFFFF'], [0x0010, '0x0010']], valore: 0x1234 }
    ],
    nota: 'Sopra la parola sono indicate le posizioni ai confini dei campi.',
    previsione: {
      domanda: (p) => 'Il formato assegna i bit da 31 a 26 al codice operativo, da 25 a 21 al registro A, da 20 a 16 al registro B e da 15 a 0 all’immediato. Con codice operativo ' + p.op + ', A = ' + p.a + ', B = ' + p.b + ' e immediato ' + SL.unita245.H4(p.i) + ', quale parola si ottiene?',
      opzioni: (p) => { const U = SL.unita245; return Array.from(new Set([U.parola(p.op, p.a, p.b, p.i), U.parola(p.op, p.b, p.a, p.i), p.op * 0x1000000 + (p.a % 16) * 0x100000 + (p.b % 16) * 0x10000 + p.i, U.parola(p.op, p.a, p.b, 0), U.parola(p.a, p.op % 32, p.b, p.i)])).slice(0, 4).sort((x, y) => x - y).map(U.H8); }
    },
    confronto: (pred, esito, p) => { const U = SL.unita245; return 'Avevi previsto ' + pred + '. La parola è ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'I contributi sono ' + U.H8(p.op * U.P26) + ' per il codice operativo, ' + U.H8(p.a * U.P21) + ' per A, ' + U.H8(p.b * U.P16) + ' per B e ' + U.H8(p.i) + ' per l’immediato.'); },
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita245, passi = [];
      const C = [p.op * U.P26, p.a * U.P21, p.b * U.P16, p.i], W = C[0] + C[1] + C[2] + C[3];
      const BIT = [[31, 26], [25, 21], [20, 16], [15, 0]], campo = (n) => { const out = []; for (let k = BIT[n][1]; k <= BIT[n][0]; k++) out.push(k); return out; };
      const NOMI = ['cod. operativo', 'registro A', 'registro B', 'immediato'], VAL = [String(p.op), String(p.a), String(p.b), U.H4(p.i)], SCORR = [26, 21, 16, 0], GX = [20, 178, 312, 446], GW = [140, 116, 116, 380];
      const CONFINI = [31, 26, 25, 21, 20, 16, 15, 0];
      // posti: numero di campi già collocati; att: campo appena collocato; unione e decod: fasi finali.
      const quadro = (o) => {
        const els = [], somma = C.slice(0, o.posti).reduce((s, x) => s + x, 0), vuoti = []; for (let n = o.posti; n < 4; n++) campo(n).forEach((k) => vuoti.push(k));
        NOMI.forEach((t, n) => els.push(el.box('c' + n, GX[n], 0, GW[n], 54, t, VAL[n], o.att === n ? 'att' : n < o.posti ? 'on' : '', { cls: 'stretta' })));
        X.fila('w', somma, 32, { x: 20, y: 96, passo: 24, tagli: [26, 21, 16], gap: 14, h: 34, vuoto: vuoti, att: o.att != null && o.att < 4 ? campo(o.att) : o.decod ? campo(1) : [], indici: (k) => (CONFINI.includes(k) ? String(k) : null) }).forEach((e) => els.push(e));
        ['op × 2 alla 26', 'A × 2 alla 21', 'B × 2 alla 16', 'immediato'].forEach((t, n) => els.push(el.box('k' + n, 20 + n * 205, 152, 195, 58, t, n < o.posti ? U.H8(C[n]) : '·', o.att === n ? 'att' : n < o.posti ? 'on' : '', { cls: 'stretta' })));
        els.push(el.box('par', 20, 232, 330, 64, 'la parola, unione dei contributi', o.unione ? U.H8(W) : '·', o.unione && !o.decod ? 'att' : o.unione ? 'on' : '', { cls: 'stretta' }),
          el.box('dec', 362, 232, 478, 64, 'decodifica del registro A', o.decod ? '(parola ÷ 2 alla 21) AND 31 = ' + p.a : '·', o.decod ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (o) => [['Campi collocati', o.posti + ' su 4', 'a'], ['Scorrimento', o.att != null && o.att < 4 ? SCORR[o.att] + ' bit' : '·'], ['Parola', o.unione ? U.H8(W) : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o), els: quadro(o) }, extra));

      P({ posti: 0 }, 0, 'Il formato e i quattro valori', 'Ogni istruzione di questo formato occupa 32 bit, divisi in quattro campi: sei bit per il codice operativo, cinque per ciascuno dei due registri, sedici per l’immediato. I valori da collocare sono ' + p.op + ' per il codice operativo, ' + p.a + ' e ' + p.b + ' per i registri, ' + U.H4(p.i) + ' per l’immediato.',
        { chiedi: { d: 'Il campo del codice operativo comincia dal bit 26. Di quante posizioni va fatto scorrere a sinistra il valore ' + p.op + '?', o: ['6', '26', '32'], g: 1, no: 'Alla destra del campo stanno 5 + 5 + 16 = 26 bit. Il valore deve scavalcarli tutti.' } });
      P({ posti: 1, att: 0 }, 1, 'Il codice operativo', 'Alla destra del codice operativo il formato colloca 26 bit: cinque, cinque e sedici. Il valore ' + p.op + ', in binario ' + p.op.toString(2).padStart(6, '0') + ', scorre a sinistra di 26 posizioni e occupa i bit da 31 a 26. Il suo contributo alla parola è ' + U.H8(C[0]) + '.',
        { calc: p.op + ' × 2 alla 26 = ' + U.H8(C[0]), chiedi: { d: 'Il campo del registro A è largo 5 bit. Qual è il numero più grande che può contenere?', o: ['15', '31', '32'], g: 1, no: 'Cinque bit a 1 valgono 2 elevato a 5, meno 1, cioè 31.' } });
      P({ posti: 2, att: 1 }, 2, 'Il registro A', 'Il numero del registro A, ' + p.a + ', in binario ' + p.a.toString(2).padStart(5, '0') + ', deve scavalcare i 21 bit alla sua destra. Dopo lo scorrimento occupa i bit da 25 a 21, e il suo contributo è ' + U.H8(C[1]) + '.', { calc: p.a + ' × 2 alla 21 = ' + U.H8(C[1]) });
      P({ posti: 3, att: 2 }, 2, 'Il registro B', 'Il numero del registro B, ' + p.b + ', in binario ' + p.b.toString(2).padStart(5, '0') + ', scorre di 16 posizioni e occupa i bit da 20 a 16. Il suo contributo è ' + U.H8(C[2]) + '.',
        { calc: p.b + ' × 2 alla 16 = ' + U.H8(C[2]), chiedi: { d: 'L’immediato occupa i bit da 15 a 0. Di quante posizioni va fatto scorrere?', o: ['0', '15', '16'], g: 0, no: 'Alla destra dell’immediato il formato non colloca altri campi. Il valore sta già al suo posto.' } });
      P({ posti: 4, att: 3 }, 3, 'L’immediato', 'L’immediato ' + U.H4(p.i) + ' occupa i sedici bit più bassi, già allineati alle unità: nessuno scorrimento è necessario. Il suo contributo è il valore stesso.', { calc: 'immediato = ' + U.H8(C[3]) });
      P({ posti: 4, unione: true }, 4, 'L’unione dei contributi', 'I quattro contributi hanno bit accesi in campi diversi, e OR li riunisce senza che l’uno disturbi l’altro. La parola è ' + U.H8(W) + '. Le cifre esadecimali seguono i confini dei campi soltanto in parte: i campi di cinque e di sei bit cominciano e finiscono dentro una cifra.', { calc: C.slice(0, 3).map(U.H8).join(' OR ') + ' OR …' });
      P({ posti: 4, unione: true, decod: true }, 5, 'La decodifica', 'Chi riceve la parola compie il percorso inverso. Per rileggere il registro A la fa scorrere a destra di 21 posizioni, portando il campo alle unità, e applica la maschera di cinque uni, 31. Il risultato è ' + p.a + ', il numero di partenza.', { calc: '(' + U.H8(W) + ' ÷ 2 alla 21) AND 31 = ' + p.a, esito: ['parola = ' + U.H8(W), 'si'] });
      return { passi, esito: U.H8(W) };
    }
  },
  bilancio: {
    regola: [
      'In un formato a campi fissi ogni valore scorre a sinistra di tante posizioni quanti sono i bit collocati alla sua destra. OR riunisce i contributi.',
      'La decodifica usa, per ogni campo, uno scorrimento a destra e una maschera larga quanto il campo.'
    ],
    errori: [
      ['Far scorrere un valore della larghezza del proprio campo.', 'Il numero di posizioni è la somma delle larghezze dei campi alla sua destra. Per il registro A sono 5 + 16 = 21.'],
      ['Leggere i campi sulle cifre esadecimali.', 'I campi di cinque e di sei bit hanno confini che cadono dentro le cifre. Per separarli occorre il binario.'],
      ['Accettare un valore più grande del campo.', 'Il numero 40 chiede sei bit. In un campo di cinque sconfinerebbe nel campo vicino.']
    ],
    saFare: ['Calcolo lo scorrimento di ciascun campo di un formato.', 'Compongo la parola riunendo i contributi.', 'Ricavo un campo dalla parola con uno scorrimento e una maschera.'],
    esercizi: [
      { d: 'Nel formato di questa unità, quale parola si ottiene con codice operativo 8, A = 2, B = 1 e immediato 0x0010? Rispondi in esadecimale, con otto cifre.', segnaposto: 'Per esempio 0x8C651234', giuste: ['0x20410010', '20410010', '20410010h'],
        ok: 'I contributi sono 8 × 2 alla 26 = 0x20000000, 2 × 2 alla 21 = 0x00400000, 1 × 2 alla 16 = 0x00010000 e 0x00000010. Riuniti danno 0x20410010.',
        diagnosi: [
          { se: ['0x20220010', '20220010'], msg: 'I due registri sono scambiati. Il registro A occupa i bit da 25 a 21, il registro B quelli da 20 a 16.' },
          { se: ['0x08210010', '08210010', '8210010', '0x8210010'], msg: 'Così ogni valore occupa una o due cifre esadecimali intere. I campi sono larghi 6, 5 e 5 bit, e gli scorrimenti sono 26, 21 e 16.' },
          { se: ['0x20410000', '20410000'], msg: 'Manca l’immediato, che occupa i sedici bit più bassi.' }
        ],
        altro: 'La parola è diversa. Calcola i quattro contributi separatamente, poi riuniscili.',
        indizi: ['Il codice operativo scorre di 26 posizioni: 8 × 2 alla 26 = 0x20000000.', 'A scorre di 21 posizioni: 0x00400000. B scorre di 16: 0x00010000.', 'Riunisci i tre contributi e l’immediato 0x00000010.'],
        svolgimento: ['Codice operativo: 8 × 2 alla 26 = 0x20000000.', 'Registro A: 2 × 2 alla 21 = 0x00400000.', 'Registro B: 1 × 2 alla 16 = 0x00010000.', 'Immediato: 0x00000010. Unione: 0x20410010.'] },
      { d: 'Una parola segue il formato di questa unità. Quale calcolo ne ricava il numero del registro B, che occupa i bit da 20 a 16?', guida: 'Scegli la risposta.', o: [
        { t: 'Scorrere a destra di 16 posizioni, poi AND con 0x1F', ok: true, fb: 'Lo scorrimento porta il campo alle unità. La maschera 0x1F, cinque bit a 1, elimina i bit di A e del codice operativo.' },
        { t: 'Scorrere a destra di 16 posizioni, poi AND con 0xFF', fb: 'La maschera 0xFF conserva otto bit: insieme ai cinque di B passerebbero anche tre bit di A.' },
        { t: 'AND con 0x1F, poi scorrere a destra di 16 posizioni', fb: 'La maschera 0x1F, applicata per prima, isola i cinque bit più bassi dell’immediato. Lo scorrimento li espelle, e resta zero.' }] }
    ]
  }
});
SL.unita245 = (() => {
  const P26 = Math.pow(2, 26), P21 = Math.pow(2, 21), P16 = Math.pow(2, 16);
  return { P26, P21, P16,
    H4: (v) => '0x' + v.toString(16).toUpperCase().padStart(4, '0'),
    H8: (v) => '0x' + v.toString(16).toUpperCase().padStart(8, '0'),
    parola: (op, a, b, i) => op * P26 + a * P21 + b * P16 + i };
})();
