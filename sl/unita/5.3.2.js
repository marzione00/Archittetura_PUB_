'use strict';
SL.unita532 = (() => {
  const D2 = (x) => { const r = Math.round(x * 100) / 100; return Number.isInteger(r) ? String(r) : r.toFixed(2).replace('.', ','); };
  // piano: ordine di servizio, inizi e attese
  const piano = (p, pol) => {
    const L = [['A', p.a], ['B', 3], ['C', 1]], ord = (pol || p.pol) === 'fcfs' ? L.slice() : L.slice().sort((x, y) => x[1] - y[1]);
    let t = 0; const turni = ord.map((j) => { const r = { n: j[0], d: j[1], da: t }; t += j[1]; return r; });
    const somma = turni.reduce((s, x) => s + x.da, 0);
    return { turni, tot: t, somma, media: somma / 3 };
  };
  // striscia del tempo con i primi «fatti» turni; o: { x, y, wc }
  const striscia = (pre, P, fatti, o) => {
    const el = SL.el, els = [];
    for (let k = 0; k < P.tot; k++) { const j = P.turni.findIndex((x) => k >= x.da && k < x.da + x.d), vis = j < fatti; els.push(el.cella(pre + k, o.x + k * (o.wc + 3), o.y, o.wc, 34, vis ? P.turni[j].n : '', vis ? (j === fatti - 1 && !o.fine ? 'att' : 'on') : '', { gi: String(k), piccola: true })); }
    return els;
  };
  return { D2, piano, striscia };
})();
SL.registra('5.3.2', {
  titolo: 'Ordine di servizio e attesa media in FCFS e SJF',
  obiettivo: 'Obiettivo: calcolare l’attesa di ogni lavoro con le politiche FCFS e SJF, e spiegare perché servire prima i lavori brevi abbassa la media.',
  concetti: [['coda', 'L’ordine decide le attese'], ['clock', 'Il lavoro totale non cambia'], ['bilancio', 'I brevi davanti ai lunghi']],
  filigrana: ['coda', 'clock', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'coda', da: 'Dall’unità 4.5.3', t: 'FCFS', d: 'Servire nell’ordine di arrivo. Sul disco ordinava le richieste, qui ordina i processi.' },
      { sim: 'clock', da: 'Dall’unità 5.3.1', t: 'Il tempo di attesa', d: 'Il tempo che un processo passa fra i pronti senza eseguire.' },
      { sim: 'coda', da: 'Dall’unità 5.1.2', t: 'La coda dei pronti', d: 'L’elenco dei processi a cui manca soltanto il processore.' }
    ],
    domanda: { d: 'Prima di proseguire: tre lavori attendono 0, 8 e 11 ms. Qual è l’attesa media, arrotondata a due decimali?', o: [
      { t: '6,33 ms', ok: true, fb: '(0 + 8 + 11) ÷ 3 = 19 ÷ 3 = 6,33.' },
      { t: '9,5 ms', fb: 'I lavori sono tre, e anche quello che attende 0 conta nella media.' },
      { t: '19 ms', fb: 'Diciannove è la somma. La media si ottiene dividendo per tre.' }
    ] }
  },
  idea: {
    titolo: 'Chi passa per primo',
    termini: ['burst', 'tempo medio di attesa', 'sjf'],
    testo: [
      'Tre lavori sono pronti nello stesso istante, e il processore è uno. Ogni lavoro ha bisogno di un tratto ininterrotto di calcolo, di durata nota, che si chiama [[burst]]. Qualunque sia l’ordine, il processore lavorerà per la somma dei tre burst. A cambiare con l’ordine è quanto ciascuno aspetta prima di cominciare.',
      'Prendiamo A, B e C, con burst di 8, 3 e 1 ms. Con FCFS, cioè nell’ordine di arrivo, A parte subito, B attende gli 8 ms di A, e C attende 8 + 3 = 11 ms. La somma delle attese è 19 ms, e la loro media, il [[tempo medio di attesa]], vale 19 ÷ 3 = 6,33 ms. Il lavoro breve è rimasto in coda dietro a quello lungo.',
      { fig: 'scena', w: 720, h: 174, titolo: 'Gli stessi tre lavori, in due ordini', nota: 'In alto FCFS: A, B, C. In basso SJF: C, B, A. Il processore lavora 12 ms in entrambi i casi.', els: [SL.el.nota('ga', 10, 0, 'FCFS · attese 0, 8, 11', 'mono')].concat(SL.unita532.striscia('gf', SL.unita532.piano({ a: 8 }, 'fcfs'), 3, { x: 10, y: 22, wc: 52, fine: true }), [SL.el.nota('gb', 10, 84, 'SJF · attese 0, 1, 4', 'mono')], SL.unita532.striscia('gs', SL.unita532.piano({ a: 8 }, 'sjf'), 3, { x: 10, y: 106, wc: 52, fine: true })) },
      'La politica [[sjf|SJF]], dall’inglese «shortest job first», sceglie ogni volta il lavoro pronto con il burst più breve. Qui parte C, poi B, poi A. Le attese diventano 0, 1 e 4 ms: somma 5, media 1,67 ms. Il motivo si vede contando. Il burst del lavoro servito per primo viene atteso da tutti gli altri, quello del secondo da uno solo. Conviene quindi che a essere atteso da tutti sia il burst più piccolo.',
      'SJF dà la media più bassa possibile per lavori pronti insieme, e ha due limiti. Richiede di conoscere in anticipo la durata dei burst, che nella realtà si può soltanto stimare. E un lavoro lungo può essere scavalcato senza fine, se continuano ad arrivarne di brevi: lo stesso difetto visto per la priorità fissa e per la regola SSTF del disco.'
    ]
  },
  esperimento: {
    faremo: [
      'A, B e C sono pronti all’istante 0. B dura 3 ms e C dura 1 ms. Sceglierai la durata di A e la politica, FCFS oppure SJF.',
      'Disporremo i tre burst sulla riga del tempo e leggeremo, per ciascun lavoro, l’istante in cui comincia: è la sua attesa. Poi calcoleremo somma e media.'
    ],
    vedrai: [
      ['clock', 'La riga del tempo', 'In alto: una casella per millisecondo, con il lavoro in esecuzione.'],
      ['tabella', 'Le attese', 'In basso: l’attesa di ciascun lavoro, la somma e la media.']
    ]
  },
  lab: {
    titolo: 'Tre lavori, un processore',
    scena: { w: 860, h: 156 },
    atti: ['I lavori', 'L’ordine', 'Le attese'],
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'Burst di A', opzioni: [[2, '2 ms'], [4, '4 ms'], [8, '8 ms']], valore: 8 },
      { id: 'pol', tipo: 'scelta', eti: 'Politica', opzioni: [['fcfs', 'FCFS'], ['sjf', 'SJF']], valore: 'fcfs' }
    ],
    nota: 'I passi sono sempre sei. A parità di arrivo, FCFS usa l’ordine A, B, C.',
    previsione: {
      domanda: (p) => 'A, B e C sono pronti insieme, con burst di ' + p.a + ', 3 e 1 ms. La politica è ' + (p.pol === 'fcfs' ? 'FCFS, nell’ordine A, B, C' : 'SJF') + '. Quanto vale la somma delle tre attese?',
      opzioni: (p) => { const U = SL.unita532; return Array.from(new Set([U.piano(p, 'sjf').somma, U.piano(p, 'fcfs').somma, p.a + 4])).sort((x, y) => x - y).map((v) => [v, v + ' ms']); }
    },
    confronto: (pred, esito, p) => { const U = SL.unita532, P = U.piano(p); return 'La previsione indicava ' + pred + ' ms. La somma delle attese è ' + esito + ' ms, e la media ' + U.D2(P.media) + ' ms. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.a + 4 ? 'Questa è la somma dei burst, cioè il lavoro del processore. Le attese sono gli istanti di inizio.' : p.pol === 'fcfs' ? 'FCFS segue l’ordine A, B, C qualunque sia la durata.' : 'SJF mette davanti i burst più brevi.'); },
    costruisci(p) {
      const U = SL.unita532, el = SL.el, P = U.piano(p), passi = [], T = P.turni, altra = U.piano(p, p.pol === 'fcfs' ? 'sjf' : 'fcfs');
      const quadro = (fatti, f) => {
        const els = [el.nota('t0', 20, 0, 'PROCESSORE', 'mono')].concat(U.striscia('s', P, fatti, { x: 20, y: 24, wc: Math.min(60, Math.floor(820 / P.tot) - 3), fine: f >= 4 }));
        T.forEach((x, k) => els.push(el.box('j' + x.n, 20 + k * 168, 96, 158, 54, x.n + ' · dura ' + x.d + ' ms', k < fatti ? 'attesa ' + x.da + ' ms' : '·', k === fatti - 1 && f < 4 ? 'att' : k < fatti ? 'on' : '', { cls: 'stretta' })));
        els.push(el.box('so', 524, 96, 150, 54, 'somma attese', f >= 4 ? P.somma + ' ms' : '·', f === 4 ? 'att' : f > 4 ? 'on' : '', { cls: 'stretta' }), el.box('me', 686, 96, 154, 54, 'attesa media', f >= 5 ? U.D2(P.media) + ' ms' : '·', f === 5 ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (fatti, f) => [['Ordine', f >= 1 ? T.map((x) => x.n).join(', ') : '·', 'a'], ['Somma', f >= 4 ? P.somma + ' ms' : '·'], ['Media', f >= 5 ? U.D2(P.media) + ' ms' : '·', 'c']];
      const S = (fatti, f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(fatti, f), els: quadro(fatti, f) }, extra));

      S(0, 0, 0, 'Tre lavori pronti', 'All’istante 0 sono pronti A, B e C, con burst di ' + p.a + ', 3 e 1 ms. Il processore dovrà lavorare in tutto ' + P.tot + ' ms, in qualunque ordine.', { calc: p.a + ' + 3 + 1 = ' + P.tot + ' ms' });
      S(1, 1, 1, 'Il primo', (p.pol === 'fcfs' ? 'FCFS serve nell’ordine di arrivo, e a parità vale l’ordine A, B, C: comincia A.' : 'SJF sceglie il burst più breve fra i pronti: comincia ' + T[0].n + ', che dura ' + T[0].d + ' ms.') + ' Chi parte per primo non attende.', { calc: T[0].n + ': attesa 0', chiedi: { d: 'Quanti lavori devono attendere per tutta la durata di ' + T[0].n + '?', o: ['Nessuno', 'Uno', 'Due'], g: 2, no: 'Mentre esegue il primo, gli altri due sono entrambi in coda.' } });
      S(2, 2, 1, 'Il secondo', 'Quando ' + T[0].n + ' ha finito, all’istante ' + T[1].da + ' ms, tocca a ' + T[1].n + '. La sua attesa è la durata di chi lo ha preceduto: ' + T[1].da + ' ms.', { calc: T[1].n + ': attesa ' + T[1].da + ' ms' });
      S(3, 3, 1, 'Il terzo', T[2].n + ' comincia all’istante ' + T[2].da + ' ms, dopo i burst di ' + T[0].n + ' e di ' + T[1].n + ': ' + T[0].d + ' + ' + T[1].d + ' = ' + T[2].da + ' ms di attesa.', { calc: T[2].n + ': attesa ' + T[2].da + ' ms' });
      S(3, 4, 2, 'La somma', 'Le tre attese sono ' + T.map((x) => x.da).join(', ') + ' ms. La somma è ' + P.somma + ' ms.', { calc: T.map((x) => x.da).join(' + ') + ' = ' + P.somma + ' ms', esito: [P.somma + ' ms in tutto', ''] });
      S(3, 5, 2, 'La media', 'L’attesa media è ' + P.somma + ' ÷ 3 = ' + U.D2(P.media) + ' ms. ' + (altra.somma === P.somma ? 'Con l’altra politica l’ordine sarebbe lo stesso, e la media anche.' : 'Con ' + (p.pol === 'fcfs' ? 'SJF' : 'FCFS') + ' la media sarebbe ' + U.D2(altra.media) + ' ms. Il lavoro del processore, ' + P.tot + ' ms, è lo stesso nei due casi.'), { calc: P.somma + ' ÷ 3 = ' + U.D2(P.media) + ' ms', esito: [P.somma + ' ms in tutto', ''] });
      return { passi, esito: P.somma };
    }
  },
  bilancio: {
    regola: [
      'Con lavori pronti insieme, l’attesa di ciascuno è la somma dei burst di chi lo precede. L’attesa media è la somma delle attese divisa per il numero dei lavori.',
      'FCFS segue l’ordine di arrivo. SJF serve prima il burst più breve, e dà la media più bassa.'
    ],
    errori: [
      ['Calcolare l’attesa includendo il proprio burst.', 'L’attesa finisce quando il lavoro comincia a eseguire.'],
      ['Dividere la somma per il numero dei lavori che hanno atteso.', 'Nella media entra anche chi ha atteso 0.'],
      ['Pensare che SJF riduca il lavoro del processore.', 'La somma dei burst è la stessa. Cambia la distribuzione delle attese.']
    ],
    saFare: ['Calcolare le attese con FCFS.', 'Calcolare le attese con SJF.', 'Spiegare perché i lavori brevi vanno serviti prima.'],
    esercizi: [
      { d: 'Tre lavori sono pronti insieme, nell’ordine di arrivo P, Q, R, con burst di 6, 2 e 4 ms. Con FCFS, quanto vale la somma delle attese, in millisecondi?', segnaposto: 'Un numero', giuste: ['14', '14ms', 'quattordici'],
        ok: 'P attende 0, Q attende 6, R attende 6 + 2 = 8. In tutto 14 ms.',
        diagnosi: [
          { se: ['8', '8ms'], msg: 'Otto è la somma con SJF, oppure la sola attesa di R. Con FCFS le attese sono 0, 6 e 8.' },
          { se: ['12', '12ms'], msg: 'Dodici è la somma dei burst. Le attese sono gli istanti di inizio: 0, 6 e 8.' },
          { se: ['26', '26ms'], msg: 'Hai sommato gli istanti di fine. L’attesa termina quando il lavoro comincia.' }
        ],
        altro: 'Il valore è diverso. Per ogni lavoro somma i burst di chi lo precede.',
        indizi: ['P comincia a 0.', 'Q comincia a 6, R comincia a 8.', '0 + 6 + 8 = 14.'],
        svolgimento: ['P: attesa 0.', 'Q: attesa 6.', 'R: attesa 8.', 'Somma: 14 ms.'] },
      { d: 'Gli stessi tre lavori, con burst di 6, 2 e 4 ms, vengono serviti con SJF. Quanto vale la somma delle attese, in millisecondi?', segnaposto: 'Un numero', giuste: ['8', '8ms', 'otto'],
        ok: 'L’ordine è Q, R, P. Le attese sono 0, 2 e 2 + 4 = 6. In tutto 8 ms.',
        diagnosi: [
          { se: ['14', '14ms'], msg: 'Questa è la somma con FCFS. SJF serve prima i burst più brevi: 2, poi 4, poi 6.' },
          { se: ['12', '12ms'], msg: 'Dodici è la somma dei burst. Le attese sono gli istanti di inizio: 0, 2 e 6.' }
        ],
        altro: 'Il valore è diverso. Ordina i burst dal più breve al più lungo e si ripeta il calcolo.',
        indizi: ['Ordine: 2, 4, 6.', 'Inizi: 0, 2, 6.', '0 + 2 + 6 = 8.'],
        svolgimento: ['Ordine SJF: Q, R, P.', 'Attese: 0, 2, 6.', 'Somma: 8 ms.'] },
      { d: 'Qual è il limite pratico della politica SJF?', guida: 'Si scelga la risposta.', o: [
        { t: 'Richiede di conoscere in anticipo la durata dei burst', ok: true, fb: 'Nella realtà la durata si può soltanto stimare, per esempio dai burst precedenti.' },
        { t: 'Allunga il lavoro complessivo del processore', fb: 'La somma dei burst è la stessa con qualunque ordine.' },
        { t: 'Produce un’attesa media più alta di FCFS', fb: 'Per lavori pronti insieme SJF dà la media più bassa possibile.' }] }
    ],
    sfida: ['cslez5_3_02_scheduling', 'Ordinamento FCFS e prestazioni']
  }
});
