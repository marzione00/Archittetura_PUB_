'use strict';
SL.registra('3.2.2', {
  titolo: 'Latch, flip-flop e clock',
  obiettivo: 'Obiettivo: spiegare come due porte in retroazione conservano un bit, e saprai distinguere un latch, che segue il dato per tutto il livello alto del clock, da un flip-flop, che lo cattura soltanto al fronte.',
  concetti: [['flipflop', 'Due porte che si sostengono'], ['clock', 'Un livello oppure un istante'], ['lente', 'Leggere una traccia nel tempo']],
  filigrana: ['flipflop', 'clock', 'porta'],
  richiami: {
    carte: [
      { sim: 'riproduci', da: 'Dall’unità 3.2.1', t: 'Retroazione e fronte', d: 'Un’uscita riportata a un ingresso permette di conservare. I registri scrivono al fronte di salita del clock.' },
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'La porta NOR', d: 'È una OR seguita da una NOT. Dà 1 soltanto quando entrambi gli ingressi valgono 0.' },
      { sim: 'clock', da: 'Dall’unità 1.5.4', t: 'Il ritardo delle porte', d: 'Ogni porta risponde dopo un breve ritardo, e nel frattempo la sua uscita conserva il valore vecchio.' }
    ],
    domanda: { d: 'Prima di proseguire: quanto vale NOT (1 OR 0)?', o: [
      { t: '0', ok: true, fb: 'La OR dà 1, perché un ingresso vale 1. La NOT lo trasforma in 0.' },
      { t: '1', fb: 'Uno è il risultato della sola OR. La NOT che segue lo inverte.' },
      { t: 'Dipende dall’ordine degli ingressi', fb: 'Per la OR l’ordine degli ingressi è indifferente: 1 OR 0 e 0 OR 1 danno entrambi 1.' }
    ] }
  },
  idea: {
    titolo: 'Aperto per un livello, oppure per un istante',
    termini: ['latch sr', 'latch d', 'flip-flop'],
    testo: [
      'Il registro dell’unità 3.2.1 presupponeva una cella capace di trattenere un bit. Quella cella si costruisce con due porte uguali. La porta è la NOR, già provata nell’esperimento dell’unità 1.5.1. Equivale a una OR seguita da una NOT, e dà 1 soltanto quando tutti i suoi ingressi valgono 0.',
      'Colleghiamo due NOR in croce, in modo che l’uscita di ciascuna entri nell’altra. La prima riceve anche un ingresso R e produce l’uscita Q. La seconda riceve un ingresso S e produce il valore opposto di Q. Finché S e R valgono 0 il circuito ha due situazioni stabili, Q = 0 e Q = 1, e ciascuna si sostiene da sola. Un 1 momentaneo su S porta Q a 1. Un 1 momentaneo su R lo riporta a 0. Questo circuito è il [[latch sr|latch SR]], la memoria più piccola che esista: un bit.',
      { fig: 'scena', w: 720, h: 170, titolo: 'Il latch SR, con Q = 1', nota: 'Con S e R a 0, ciascuna porta tiene ferma l’altra: l’uscita di una è un ingresso dell’altra.', els: [
        SL.el.cella('r', 20, 24, 60, 40, '0', 'zero', { piccola: true, so: 'R' }), SL.el.cella('s', 20, 112, 60, 40, '0', 'zero', { piccola: true, so: 'S' }),
        SL.el.box('n1', 260, 6, 170, 62, 'NOR', '1', 'on', { cls: 'stretta' }), SL.el.box('n2', 260, 102, 170, 62, 'NOR', '0', '', { cls: 'stretta' }),
        SL.el.linea('a1', 80, 44, 260, 24, ''), SL.el.linea('a2', 80, 132, 260, 148, ''),
        SL.el.linea('q1', 430, 40, 600, 40, 'on'), SL.el.linea('q2', 430, 133, 600, 133, ''),
        SL.el.linea('x1', 480, 40, 480, 80, 'on'), SL.el.linea('x2', 480, 80, 226, 80, 'on'), SL.el.linea('x3', 226, 80, 226, 118, 'on'), SL.el.linea('x4', 226, 118, 260, 118, 'on'),
        SL.el.linea('y1', 530, 133, 530, 92, ''), SL.el.linea('y2', 530, 92, 200, 92, ''), SL.el.linea('y3', 200, 92, 200, 52, ''), SL.el.linea('y4', 200, 52, 260, 52, ''),
        SL.el.cella('q', 600, 24, 60, 40, '1', 'att', { piccola: true, so: 'Q' }), SL.el.cella('nq', 600, 112, 60, 42, '0', 'zero', { piccola: true }), SL.el.nota('nn', 600, 96, 'opposto', 'mono minuta')
      ] },
      'Per conservare un dato D servono due AND in più, comandate da un segnale di abilitazione. La prima forma S come abilitazione AND D, la seconda forma R come abilitazione AND NOT D. Con l’abilitazione a 0, S e R valgono 0 e la cella conserva. Con l’abilitazione a 1 vale 1 uno solo dei due, quello che porta Q al valore di D. È il [[latch d|latch D]]: finché l’abilitazione è alta Q segue D come se fosse un filo, e quando l’abilitazione scende Q resta sull’ultimo valore visto.',
      'Se l’abilitazione è il clock, il latch resta aperto per tutto il livello alto, e ogni cambiamento di D in quell’intervallo raggiunge l’uscita. Per un processore è una finestra troppo larga, perché i dati devono cambiare in un istante preciso. Il [[flip-flop]] la restringe con due latch in fila, aperti in momenti opposti: il primo quando il clock è basso, il secondo quando è alto. Al fronte di salita il primo si chiude sul valore che D aveva in quell’istante, e il secondo lo lascia uscire.',
      'Il risultato è una cella che cattura D al fronte di salita e lo conserva fino al fronte successivo, qualunque cosa faccia D nel frattempo. I registri dell’unità 3.2.1 sono file di flip-flop.'
    ]
  },
  esperimento: {
    faremo: [
      'Un latch D e un flip-flop D ricevono lo stesso dato e lo stesso clock. Il dato cambia una volta mentre il clock è ancora alto, e torna com’era durante il livello basso. Sceglierai il bit conservato all’inizio, il dato presente al primo fronte e il valore che assume a clock alto.',
      'Seguiremo le quattro tracce nel tempo, intervallo per intervallo. Dopo il caso proposto, scegli per il dato lo stesso valore prima e dopo il cambiamento: le due uscite coincideranno sempre.'
    ],
    vedrai: [
      ['clock', 'Il clock', 'Prima riga: il livello del clock in cinque intervalli successivi.'],
      ['input', 'Il dato', 'Seconda riga: il valore di D.'],
      ['flipflop', 'Le due uscite', 'Terza e quarta riga: Q del latch e Q del flip-flop.']
    ]
  },
  lab: {
    titolo: 'Lo stesso dato, due celle',
    scena: { w: 860, h: 300 },
    atti: ['Clock basso', 'Il primo fronte', 'D cambia a clock alto', 'Il clock scende', 'Il secondo fronte'],
    controlli: [
      { id: 'q', tipo: 'scelta', eti: 'Bit conservato all’inizio', opzioni: [[0, '0'], [1, '1']], valore: 0 },
      { id: 'd', tipo: 'scelta', eti: 'D al primo fronte', opzioni: [[0, '0'], [1, '1']], valore: 1 },
      { id: 'e', tipo: 'scelta', eti: 'D a clock ancora alto', opzioni: [[0, '0'], [1, '1']], valore: 0 }
    ],
    nota: 'I passi sono sempre cinque, uno per intervallo di tempo.',
    previsione: {
      domanda: (p) => 'Un latch D e un flip-flop D conservano entrambi ' + p.q + '. Al fronte di salita D vale ' + p.d + '. Poi, a clock ancora alto, D ' + (p.e === p.d ? 'resta a ' + p.d : 'passa a ' + p.e) + '. Subito prima che il clock scenda, quanto valgono le due uscite?',
      opzioni: () => [['0,0', 'Latch 0, flip-flop 0'], ['0,1', 'Latch 0, flip-flop 1'], ['1,0', 'Latch 1, flip-flop 0'], ['1,1', 'Latch 1, flip-flop 1']]
    },
    confronto: (pred, esito, p) => { const T = (k) => 'latch ' + k[0] + ', flip-flop ' + k[2]; return 'La previsione indicava ' + T(pred) + '. Le uscite valgono ' + T(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il flip-flop ha catturato D al fronte, quando valeva ' + p.d + ', e da allora lo ignora. Il latch resta aperto per tutto il livello alto, quindi mostra l’ultimo valore di D, che è ' + p.e + '.'); },
    costruisci(p) {
      const el = SL.el, passi = [], q = p.q, d = p.d, e = p.e;
      const CK = [0, 1, 1, 0, 1], D = [d, d, e, d, d], QL = [q, d, e, e, d], QF = [q, d, d, d, d], XC = (k) => 200 + k * 130;
      const quadro = (o) => {
        const t = o.t, els = [el.nota('r0', 20, 52, 'clock', 'mono'), el.nota('r1', 20, 112, 'dato D', 'mono'), el.nota('r2', 20, 182, 'Q del latch', 'mono', o.latch ? 'att' : ''), el.nota('r3', 20, 242, 'Q del flip-flop', 'mono', o.ff ? 'att' : ''),
          el.nota('f1', XC(1), 0, '↑ fronte', 'mono minuta', t === 1 ? 'att' : ''), el.nota('f4', XC(4), 0, '↑ fronte', 'mono minuta', t === 4 ? 'att' : ''), el.nota('f3', XC(3), 0, '↓ discesa', 'mono minuta', t === 3 ? 'att' : '')];
        for (let k = 0; k < 5; k++) {
          const vista = k <= t, qui = k === t;
          const c = (id, y, v, txt, forte) => els.push(el.cella(id + k, XC(k), y, 116, 44, vista ? txt : '·', !vista ? 'off' : qui && forte ? 'att' : v ? 'on' : 'zero', { piccola: true, cls: 'minuta' }));
          c('ck', 38, CK[k], CK[k] ? 'alto' : 'basso', false);
          c('d', 98, D[k], String(D[k]), o.dato);
          c('ql', 168, QL[k], String(QL[k]), o.latch);
          c('qf', 228, QF[k], String(QF[k]), o.ff);
        }
        els.push(el.cursore('cur', XC(t), 282, 116));
        return els;
      };
      const hud = (t) => [['Clock', CK[t] ? 'alto' : 'basso', 'a'], ['Q del latch', String(QL[t])], ['Q del flip-flop', String(QF[t]), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.t), els: quadro(o) }, extra));

      P({ t: 0 }, 0, 'Prima del fronte', 'Il clock è al livello basso. Le due celle conservano ' + q + ', e D vale ' + d + '. Il latch è chiuso e ignora il dato. Il flip-flop attende il fronte di salita.',
        { chiedi: { d: 'Il clock è basso. In questo momento il latch D lascia passare il dato?', o: ['Sì', 'No'], g: 1, no: 'Il latch è aperto soltanto mentre la sua abilitazione, qui il clock, è al livello alto.' } });
      P({ t: 1, latch: true, ff: true }, 1, 'Il fronte di salita', 'Il clock sale. Il flip-flop cattura il valore che D ha in questo istante, ' + d + ', e lo porta in uscita. Nello stesso momento il latch si apre, e la sua uscita comincia a seguire D: vale anch’essa ' + d + '.' + (q === d ? ' Entrambe le celle contenevano già ' + q + ', quindi le uscite restano dov’erano.' : ''),
        { calc: 'Q del latch = ' + d + ' · Q del flip-flop = ' + d, chiedi: { d: 'Il clock resta alto. Quale delle due celle continua a seguire D?', o: ['Il latch', 'Il flip-flop'], g: 0, no: 'Il flip-flop ascolta D soltanto nell’istante del fronte. Il latch resta aperto per tutto il livello alto.' } });
      P({ t: 2, dato: true, latch: true }, 2, e === d ? 'D resta fermo' : 'D cambia, e il latch lo segue', e === d ? 'Il clock è ancora alto e D resta a ' + d + '. Il latch è aperto, e nessun cambiamento lo attraversa. Le due uscite coincidono, e dall’esterno le due celle sono indistinguibili.' : 'Il clock è ancora alto, e D passa da ' + d + ' a ' + e + '. Il latch è aperto e lascia passare il cambiamento: la sua uscita diventa ' + e + '. Il flip-flop ha già catturato al fronte e resta a ' + d + '. Le due uscite ora sono diverse.',
        { calc: 'Q del latch = ' + e + ' · Q del flip-flop = ' + d });
      P({ t: 3, latch: true, dato: true }, 3, 'Il latch si chiude', 'Il clock scende. Il latch si chiude sull’ultimo valore che ha visto, ' + e + ', e da questo momento lo conserva. Durante il livello basso D ' + (e === d ? 'resta a ' + d : 'torna a ' + d) + ', e nessuna delle due celle se ne accorge.',
        { calc: 'Q del latch = ' + e + ' · Q del flip-flop = ' + d, chiedi: e !== d ? { d: 'Al prossimo fronte di salita D vale ' + d + '. Che cosa faranno le due uscite?', o: ['Resteranno diverse', 'Torneranno uguali'], g: 1, no: 'Al fronte il flip-flop cattura ' + d + ' e il latch si riapre su ' + d + ': entrambe le uscite valgono ' + d + '.' } : null });
      if (!passi[passi.length - 1].chiedi) delete passi[passi.length - 1].chiedi;
      P({ t: 4, latch: true, ff: true }, 4, 'Il secondo fronte', 'Il clock sale di nuovo. Il flip-flop cattura D, che vale ' + d + '. Il latch si riapre e mostra lo stesso valore. ' + (e === d ? 'Le due celle si sono comportate allo stesso modo per tutto il tempo, perché D non è mai cambiato a clock alto.' : 'Le due uscite tornano uguali. Sono rimaste diverse dal momento in cui D è cambiato a clock alto fino a questo fronte: in quell’intervallo il latch ha mostrato un valore che il flip-flop non ha mai visto.'),
        { calc: 'Q del latch = ' + d + ' · Q del flip-flop = ' + d, esito: [e === d ? 'uscite sempre uguali' : 'uscite diverse per un intervallo', e === d ? 'si' : ''] });
      return { passi, esito: e + ',' + d };
    }
  },
  bilancio: {
    regola: [
      'Due NOR in retroazione conservano un bit: S lo porta a 1, R lo porta a 0, e con entrambi a 0 lo stato si sostiene da solo.',
      'Un latch D lascia passare il dato per tutto il livello alto dell’abilitazione. Un flip-flop D cattura il dato al fronte di salita e lo tiene fino al fronte successivo.'
    ],
    errori: [
      ['Usare latch e flip-flop come sinonimi.', 'Il latch è sensibile a un livello, il flip-flop a un fronte. Con un dato che cambia a clock alto le loro uscite si separano.'],
      ['Pensare che il flip-flop segua D mentre il clock è alto.', 'Dopo il fronte il flip-flop ignora D. Lo ascolterà di nuovo soltanto al fronte di salita successivo.'],
      ['Attivare insieme S e R.', 'Con S e R entrambi a 1 le due NOR danno 0. Quando gli ingressi tornano a 0, lo stato finale dipende da quale porta risponde per prima.']
    ],
    saFare: ['Spiegare come due NOR in croce conservano un bit.', 'Distinguere la cella sensibile al livello da quella sensibile al fronte.', 'Seguire nel tempo le uscite di un latch e di un flip-flop, dato l’andamento del clock e di D.'],
    esercizi: [
      { d: 'Un latch SR fatto con due NOR conserva Q = 0. Gli ingressi passano a S = 1 e R = 0, poi tornano entrambi a 0. Quanto vale Q alla fine?', guida: 'Si scelga la risposta.', o: [
        { t: '1', ok: true, fb: 'S ha portato Q a 1. Con S e R di nuovo a 0, le due porte tengono fermo quel valore.' },
        { t: '0', fb: 'Lo stato iniziale è stato cambiato dall’1 su S. Tornati a 0 gli ingressi, il latch conserva il valore nuovo.' },
        { t: 'Dipende dai ritardi delle porte', fb: 'I ritardi contano soltanto quando S e R valgono 1 insieme. Qui si è attivato il solo S.' }] },
      { d: 'Un latch D e un flip-flop D ricevono lo stesso dato e lo stesso clock, e conservano entrambi 1. Al fronte di salita D vale 0. Mentre il clock è ancora alto, D sale a 1 e vi resta. Subito prima che il clock scenda, quanto valgono le due uscite?', guida: 'Si scelga la risposta.', o: [
        { t: 'Latch 1, flip-flop 0', ok: true, fb: 'Il flip-flop ha catturato 0 al fronte. Il latch, ancora aperto, ha seguito D fino a 1.' },
        { t: 'Latch 0, flip-flop 1', fb: 'I ruoli sono scambiati: è il latch a seguire D durante il livello alto, e il flip-flop a restare sul valore del fronte.' },
        { t: 'Latch 1, flip-flop 1', fb: 'Il flip-flop ha catturato D al fronte, quando valeva 0, e ignora il cambiamento successivo.' },
        { t: 'Latch 0, flip-flop 0', fb: 'Il latch è aperto per tutto il livello alto, quindi segue D quando sale a 1.' }] }
    ],
    sfida: ['cslez3_2_03_random_assembly', 'Acquisizione sul fronte di clock']
  }
});
