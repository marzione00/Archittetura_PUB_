'use strict';
SL.registra('3.4.5', {
  titolo: 'Oltre SEQ a ciclo singolo',
  obiettivo: 'Obiettivo: confrontare due processori che eseguono lo stesso programma, uno a ciclo singolo e uno a più cicli, calcolando per ciascuno il tempo totale come prodotto fra cicli e periodo.',
  concetti: [['bilancio', 'Cicli per periodo'], ['clock', 'Cicli brevi e più numerosi'], ['lente', 'La dipendenza dal programma']],
  filigrana: ['bilancio', 'clock', 'cpu'],
  richiami: {
    carte: [
      { sim: 'clock', da: 'Dall’unità 3.4.3', t: 'Il periodo di SEQ', d: 'Ogni istruzione occupa un ciclo dimensionato sulla più lenta, e per le altre il tempo residuo va perduto.' },
      { sim: 'bilancio', da: 'Dall’unità 2.1.4', t: 'Tempo, cicli e periodo', d: 'Il tempo di esecuzione di un programma è il numero di cicli moltiplicato per il periodo di clock.' },
      { sim: 'strati', da: 'Dall’unità 3.3.3', t: 'Le fasi', d: 'Ogni istruzione attraversa le medesime fasi, e alcune fasi restano inutilizzate da certe istruzioni.' }
    ],
    domanda: { d: 'Prima di proseguire: un programma richiede 18 cicli, con un periodo di clock di 0,5 ns. Quanto dura?', o: [
      { t: '9 ns', ok: true, fb: 'Diciotto cicli da mezzo nanosecondo: 18 × 0,5.' },
      { t: '36 ns', fb: 'I cicli vanno moltiplicati per il periodo, che vale mezzo nanosecondo.' },
      { t: '18,5 ns', fb: 'Cicli e periodo si moltiplicano, senza sommarsi.' }
    ] }
  },
  idea: {
    titolo: 'La suddivisione del ciclo',
    termini: ['processore multiciclo'],
    testo: [
      'Il limite di SEQ è ormai evidente: ogni istruzione occupa un ciclo dimensionato sulla più lenta. Un rimedio possibile consiste nel suddividere l’esecuzione in passi più brevi, uno per ciclo, in modo che ogni istruzione impieghi soltanto i passi necessari. Si ottiene così il [[processore multiciclo]].',
      'In un processore multiciclo il periodo deve essere sufficiente per il passo più lento. L’intera istruzione si distribuisce su più cicli, e il periodo può essere molto più breve di quello di SEQ. Per contro ogni istruzione occupa più cicli. Nell’esempio considerato un’operazione aritmetica ne richiede tre, e un carico cinque, poiché deve attendere anche la memoria dei dati.',
      'Il confronto fra due macchine sul medesimo programma richiede la relazione dell’unità 2.1.4: il tempo è il numero di cicli moltiplicato per il periodo. SEQ impiega pochi cicli lunghi, la macchina multiciclo molti cicli brevi. Quale delle due termini per prima dipende dai valori numerici e dalla composizione del programma: ogni carico aggiuntivo comporta cinque cicli per la seconda macchina e uno solo per la prima.',
      { fig: 'scena', w: 720, h: 146, titolo: 'Quattro operazioni aritmetiche e tre carichi', nota: 'SEQ: 7 cicli da 240 ps. Multiciclo: 27 cicli da 55 ps.', els: [
        SL.el.nota('r1', 0, 20, 'SEQ', 'mono'), SL.el.barra('b1', 120, 10, 560, 34, 1), SL.el.nota('v1', 120, 50, '7 × 240 = 1680 ps', 'mono minuta'),
        SL.el.nota('r2', 0, 88, 'multiciclo', 'mono'), SL.el.barra('b2', 120, 78, 495, 34, 1), SL.el.nota('v2', 120, 118, '27 × 55 = 1485 ps', 'mono minuta')
      ] },
      'Anche la macchina multiciclo presenta un limite. Essa esegue un’istruzione alla volta, e mentre un’istruzione si trova nel suo terzo passo i circuiti dei primi due restano inattivi. La pipeline dei capitoli successivi li mantiene tutti occupati, facendo avanzare più istruzioni contemporaneamente.'
    ]
  },
  esperimento: {
    faremo: [
      'Due macchine eseguono il medesimo programma. SEQ impiega un ciclo da 240 ps per ogni istruzione. La macchina multiciclo impiega tre cicli per un’operazione aritmetica e cinque per un carico. I controlli fissano il numero di istruzioni di ciascun tipo contenute nel programma e il periodo della seconda macchina.',
      'Si calcolano cicli e tempo per entrambe. Dopo il caso proposto, è istruttivo portare i carichi a 6 e osservare quale macchina ne risente maggiormente.'
    ],
    vedrai: [
      ['clock', 'I due tempi', 'In alto: una barra per macchina, di lunghezza pari al tempo di esecuzione.'],
      ['bilancio', 'Il conto', 'In basso: cicli e tempo di SEQ, cicli e tempo della macchina multiciclo.'],
      ['lente', 'Il verdetto', 'Nel riquadro finale: la macchina che termina per prima, e il periodo con il quale le due macchine avrebbero il medesimo tempo.']
    ]
  },
  lab: {
    titolo: 'Il medesimo programma su due macchine',
    scena: { w: 860, h: 290 },
    atti: ['Il programma', 'SEQ', 'La macchina multiciclo', 'Il confronto'],
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'Operazioni aritmetiche', opzioni: [[2, '2'], [4, '4'], [8, '8']], valore: 4 },
      { id: 'l', tipo: 'scelta', eti: 'Carichi', opzioni: [[0, '0'], [3, '3'], [6, '6']], valore: 3 },
      { id: 't', tipo: 'scelta', eti: 'Periodo multiciclo', opzioni: [[55, '55 ps'], [70, '70 ps'], [80, '80 ps']], valore: 55 }
    ],
    nota: 'I passi sono sempre cinque. Il periodo di SEQ è fissato a 240 ps.',
    previsione: {
      domanda: (p) => 'Un programma contiene ' + p.a + ' operazioni aritmetiche e ' + p.l + ' carichi. SEQ impiega un ciclo da 240 ps per istruzione. La macchina multiciclo impiega 3 cicli per un’operazione e 5 per un carico, con un periodo di ' + p.t + ' ps. Quale termina per prima?',
      opzioni: () => [['seq', 'SEQ'], ['multi', 'La macchina multiciclo'], ['pari', 'Terminano insieme']]
    },
    confronto: (pred, esito, p) => { const N = { seq: 'SEQ', multi: 'la macchina multiciclo', pari: 'la parità dei tempi' }, ts = 240 * (p.a + p.l), cm = 3 * p.a + 5 * p.l; return 'La previsione indicava ' + N[pred] + '. L’esito è ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'SEQ impiega ' + (p.a + p.l) + ' × 240 = ' + SL.num(ts) + ' ps. La macchina multiciclo impiega ' + cm + ' × ' + p.t + ' = ' + SL.num(cm * p.t) + ' ps. Vanno confrontati i prodotti: il confronto dei soli periodi o dei soli cicli conduce a conclusioni errate.'); },
    costruisci(p) {
      const el = SL.el, passi = [], n = p.a + p.l, ts = 240 * n, cm = 3 * p.a + 5 * p.l, tm = cm * p.t, X0 = 180, K = 660 / 4400, pari = ts / cm, F = SL.num, FD = (v) => String(Math.round(v * 100) / 100).replace('.', ',');
      const esito = ts < tm ? 'seq' : tm < ts ? 'multi' : 'pari';
      const st = { cs: false, ts: false, cm: false, tm: false, fine: false };
      const quadro = (o) => {
        const els = [el.nota('t0', 20, 0, 'TEMPO, IN PS', 'mono')];
        for (let k = 0; k <= 4000; k += 1000) els.push(el.nota('k' + k, X0 + k * K - (k ? 14 : 4), 0, String(k), 'mono minuta'));
        els.push(el.nota('la', 20, 44, 'SEQ', 'mono', st.fine && esito === 'seq' ? 'att' : ''), Object.assign(el.barra('bs', X0, 36, ts * K, 32, st.ts ? 1 : 0), st.fine && esito === 'multi' ? { st: 'err' } : null),
          el.nota('lb', 20, 108, 'multiciclo', 'mono', st.fine && esito === 'multi' ? 'att' : ''), Object.assign(el.barra('bm', X0, 100, tm * K, 32, st.tm ? 1 : 0), st.fine && esito === 'seq' ? { st: 'err' } : null));
        els.push(el.box('b1', 20, 160, 196, 54, 'cicli di SEQ', st.cs ? String(n) : '·', o.n === 1 ? 'att' : st.cs ? 'on' : '', { cls: 'stretta' }),
          el.box('b2', 226, 160, 196, 54, 'tempo di SEQ', st.ts ? F(ts) + ' ps' : '·', o.n === 2 ? 'att' : st.ts ? 'on' : '', { cls: 'stretta' }),
          el.box('b3', 432, 160, 196, 54, 'cicli multiciclo', st.cm ? String(cm) : '·', o.n === 3 ? 'att' : st.cm ? 'on' : '', { cls: 'stretta' }),
          el.box('b4', 638, 160, 206, 54, 'tempo multiciclo', st.tm ? F(tm) + ' ps' : '·', o.n === 4 ? 'att' : st.tm ? 'on' : '', { cls: 'stretta' }),
          el.box('b5', 20, 226, 402, 54, 'termina per prima', !st.fine ? '·' : esito === 'seq' ? 'SEQ' : esito === 'multi' ? 'la macchina multiciclo' : 'nessuna: tempi uguali', st.fine ? 'att' : '', { cls: 'stretta' }),
          el.box('b6', 432, 226, 412, 54, 'periodo multiciclo di parità', st.fine ? FD(pari) + ' ps' : '·', st.fine ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['SEQ', st.ts ? F(ts) + ' ps' : '·', 'a'], ['Multiciclo', st.tm ? F(tm) + ' ps' : '·'], ['Termina per prima', !st.fine ? '·' : esito === 'seq' ? 'SEQ' : esito === 'multi' ? 'multiciclo' : 'pari', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const opz = (lista, giusto, f) => { const u = Array.from(new Set(lista)).sort((x, y) => x - y); return { o: u.map(f), g: u.indexOf(giusto) }; };

      const q1 = opz([n, cm, 2 * n], n, String);
      P({}, 0, 'Il medesimo programma', 'Il programma contiene ' + p.a + ' operazioni aritmetiche e ' + p.l + (p.l === 1 ? ' carico' : ' carichi') + ': ' + n + ' istruzioni complessive. Le due macchine le eseguono una alla volta, nel medesimo ordine, e producono i medesimi risultati. Varia soltanto il tempo.',
        { chiedi: { d: 'SEQ impiega un ciclo per ogni istruzione. Quanti cicli occorrono per questo programma?', o: q1.o, g: q1.g, no: 'Un ciclo per istruzione, e le istruzioni sono ' + p.a + ' + ' + p.l + ' = ' + n + '.' } });
      st.cs = true; st.ts = true;
      P({ n: 2 }, 1, 'Il tempo di SEQ', 'SEQ usa ' + n + ' cicli, uno per istruzione. Ogni ciclo dura 240 ps, il tempo necessario alla più lenta. Il programma dura ' + n + ' × 240 = ' + F(ts) + ' ps. Operazioni e carichi hanno il medesimo peso.', { calc: n + ' × 240 = ' + F(ts) + ' ps' });
      st.cm = true;
      const q2 = opz([tm, n * p.t, cm * 240], tm, (v) => F(v) + ' ps');
      P({ n: 3 }, 2, 'I cicli della macchina multiciclo', 'La seconda macchina impiega 3 cicli per ogni operazione aritmetica e 5 per ogni carico: 3 × ' + p.a + ' + 5 × ' + p.l + ' = ' + cm + ' cicli. Il loro numero è molto maggiore rispetto a SEQ, e tuttavia ciascuno dura soltanto ' + p.t + ' ps.',
        { calc: '3 × ' + p.a + ' + 5 × ' + p.l + ' = ' + cm + ' cicli', chiedi: { d: 'Con ' + cm + ' cicli da ' + p.t + ' ps, quanto dura il programma sulla macchina multiciclo?', o: q2.o, g: q2.g, no: 'Cicli per periodo: ' + cm + ' × ' + p.t + ' = ' + F(tm) + '.' } });
      st.tm = true;
      P({ n: 4 }, 2, 'Il tempo della macchina multiciclo', 'Il programma dura ' + cm + ' × ' + p.t + ' = ' + F(tm) + ' ps. ' + (p.l ? 'I ' + p.l + ' carichi, da soli, occupano ' + 5 * p.l + ' cicli su ' + cm + '.' : 'Senza carichi, tutte le istruzioni impiegano tre cicli.'), { calc: cm + ' × ' + p.t + ' = ' + F(tm) + ' ps' });
      st.fine = true;
      P({}, 3, esito === 'pari' ? 'Parità' : esito === 'multi' ? 'Prevale la macchina multiciclo' : 'Prevale SEQ', (esito === 'pari' ? 'I due tempi coincidono: ' + F(ts) + ' ps.' : esito === 'multi' ? 'La macchina multiciclo termina in ' + F(tm) + ' ps, contro i ' + F(ts) + ' ps di SEQ.' : 'SEQ termina in ' + F(ts) + ' ps, contro i ' + F(tm) + ' ps della macchina multiciclo.') + ' Per questo programma le due macchine avrebbero il medesimo tempo con un periodo multiciclo di ' + F(ts) + ' / ' + cm + ' = ' + FD(pari) + ' ps. Sotto tale soglia è più rapida la macchina multiciclo, sopra è più rapido SEQ. Al variare della proporzione fra carichi e operazioni, la soglia si sposta.',
        { calc: F(ts) + ' ps contro ' + F(tm) + ' ps', esito: [esito === 'seq' ? 'SEQ' : esito === 'multi' ? 'multiciclo' : 'parità', esito === 'pari' ? '' : 'si'] });
      return { passi, esito };
    }
  },
  bilancio: {
    regola: [
      'Il tempo di esecuzione è il prodotto fra numero di cicli e periodo. SEQ impiega un ciclo lungo per istruzione, una macchina multiciclo impiega più cicli brevi.',
      'La macchina più rapida dipende dal periodo e dalla composizione del programma: le istruzioni che richiedono più cicli incidono maggiormente.'
    ],
    errori: [
      ['Confrontare soltanto i periodi.', 'Un periodo quattro volte più breve è insufficiente, se i cicli divengono cinque volte più numerosi.'],
      ['Confrontare soltanto i cicli.', 'Ventisette cicli da 55 ps durano meno di sette cicli da 240 ps.'],
      ['Contare il medesimo numero di cicli per tutte le istruzioni.', 'Nella macchina multiciclo un carico impiega cinque cicli e un’operazione aritmetica tre.']
    ],
    saFare: ['Contare i cicli di un programma su SEQ e su una macchina multiciclo.', 'Calcolare i due tempi di esecuzione.', 'Determinare il periodo con il quale le due macchine avrebbero il medesimo tempo.'],
    esercizi: [
      { d: 'Un programma ha 10 operazioni aritmetiche e 5 carichi. Una macchina multiciclo impiega 3 cicli per le prime e 5 per i secondi, con un periodo di 60 ps. Quanto dura il programma, in picosecondi?', segnaposto: 'Un numero di picosecondi', giuste: ['3300', '3.300', '3300ps', '3.300ps'],
        ok: 'I cicli sono 3 × 10 + 5 × 5 = 55, e 55 × 60 = 3300 ps.',
        diagnosi: [
          { se: ['900', '900ps'], msg: 'È stato contato un ciclo per istruzione. In questa macchina un’operazione ne impiega 3 e un carico 5.' },
          { se: ['55'], msg: 'Questo è il numero dei cicli. Va moltiplicato per il periodo.' },
          { se: ['2700', '2.700', '2700ps'], msg: 'I carichi impiegano 5 cicli ciascuno, e sono 5.' }
        ],
        altro: 'Il numero è diverso. Si contino i cicli dei due tipi di istruzione, si sommino e si moltiplichi per il periodo.',
        indizi: ['Operazioni: 3 × 10 = 30 cicli.', 'Carichi: 5 × 5 = 25 cicli.', '55 × 60.'],
        svolgimento: ['Cicli: 30 + 25 = 55.', 'Periodo: 60 ps.', 'Tempo: 55 × 60 = 3300 ps.'] },
      { d: 'Il medesimo programma, 10 operazioni aritmetiche e 5 carichi, è eseguito su SEQ con un periodo di 240 ps. Quanto dura, in picosecondi?', segnaposto: 'Un numero di picosecondi', giuste: ['3600', '3.600', '3600ps', '3.600ps'],
        ok: 'SEQ impiega un ciclo per istruzione: 15 × 240 = 3600 ps.',
        diagnosi: [
          { se: ['13200', '13.200', '13200ps'], msg: 'Sono stati impiegati i 55 cicli della macchina multiciclo. SEQ impiega un ciclo per istruzione.' },
          { se: ['240', '240ps'], msg: 'Questo è un solo ciclo. Il programma ha 15 istruzioni.' },
          { se: ['15'], msg: 'Questo è il numero dei cicli. Va moltiplicato per il periodo.' }
        ],
        altro: 'Il numero è diverso. SEQ impiega un ciclo per ogni istruzione.',
        indizi: ['Le istruzioni sono 10 + 5 = 15.', 'Ogni ciclo dura 240 ps.', '15 × 240.'],
        svolgimento: ['Cicli: 15.', 'Periodo: 240 ps.', 'Tempo: 15 × 240 = 3600 ps.'] }
    ]
  }
});
