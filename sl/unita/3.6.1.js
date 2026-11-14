'use strict';
SL.registra('3.6.1', {
  titolo: 'Dalla sovrapposizione alla pipeline controllata',
  obiettivo: 'Obiettivo: dire che cosa contiene ogni stadio della pipeline dopo un fronte del clock, a partire da quello che conteneva prima, e spiegare perché ogni istruzione avanza di un solo posto.',
  concetti: [['register', 'I registri di pipeline'], ['clock', 'Il fronte comune'], ['pipeline', 'Un posto per ciclo']],
  filigrana: ['pipeline', 'register', 'clock'],
  richiami: {
    carte: [
      { sim: 'flipflop', da: 'Dall’unità 3.2.2', t: 'Il flip-flop', d: 'Cattura il dato al fronte di salita e lo conserva fino al fronte successivo.' },
      { sim: 'cpu', da: 'Dall’unità 3.4.1', t: 'Lo stato cambia al fronte', d: 'In SEQ i valori nuovi restano sui fili per tutto il ciclo. I registri li catturano soltanto al fronte.' },
      { sim: 'tabella', da: 'Dall’unità 3.5.2', t: 'La fotografia di un ciclo', d: 'In ogni ciclo ciascuno stadio ospita al massimo una istruzione.' }
    ],
    domanda: { d: 'Prima di proseguire: due registri sono collegati in fila, il primo contiene 7 e il secondo 3. Al fronte ciascuno cattura il proprio ingresso. Che cosa contiene il secondo subito dopo?', o: [
      { t: '7', ok: true, fb: 'Il secondo registro cattura il valore che il primo mostrava prima del fronte.' },
      { t: '3', fb: 'Il 3 era il vecchio contenuto, sostituito al fronte.' },
      { t: 'Il valore nuovo del primo registro', fb: 'Il valore nuovo del primo registro compare dopo il fronte, quando il secondo ha già catturato.' }
    ] }
  },
  idea: {
    titolo: 'Un registro fra uno stadio e l’altro',
    termini: ['pipe', 'registro di pipeline'],
    testo: [
      'Nel capitolo precedente la pipeline era un diagramma. Ora diventa un circuito. Il processore si chiama [[pipe|PIPE]], e nasce da SEQ con una modifica: fra una fase e la successiva viene inserito un [[registro di pipeline]]. I registri sono cinque, e prendono il nome dello stadio che alimentano: F, D, E, M e W.',
      'Un registro di pipeline conserva per un ciclo tutto ciò che la sua istruzione porta con sé: il codice, i registri nominati, la costante, i valori già calcolati. Lo stadio legge questi dati dall’uscita del registro, lavora, e prepara il risultato all’ingresso del registro successivo. Per tutto il ciclo il registro successivo continua a mostrare i dati dell’istruzione che già lo occupa, e il risultato nuovo attende all’ingresso.',
      { fig: 'scena', w: 720, h: 112, titolo: 'I cinque registri di PIPE al ciclo 5', nota: 'Ogni registro conserva i dati di una istruzione. Fra un registro e il successivo lavora la logica di uno stadio.', els:
        SL.pipe.stadi('g', ['I5', 'I4', 'I3', 'I2', 'I1'], { x: 10, y: 8, w: 124, gap: 20, h: 64, et: ['registro F', 'registro D', 'registro E', 'registro M', 'registro W'] })
          .concat([0, 1, 2, 3].map((j) => SL.el.linea('gl' + j, 10 + j * 144 + 124, 40, 10 + (j + 1) * 144, 40, 'on'))) },
      'Al fronte del clock tutti e cinque i registri catturano insieme il proprio ingresso. Il registro W riceve ciò che lo stadio M ha preparato, M riceve il lavoro di E, e così via fino a F, che riceve l’indirizzo del prossimo prelievo. Ogni ingresso è stato preparato a partire dalle uscite vecchie, quelle di prima del fronte. Per questo ogni istruzione avanza di un posto soltanto: il registro che la riceve ha catturato il dato che il precedente mostrava prima, e il dato nuovo del precedente compare quando la cattura è già avvenuta.',
      'Le sigle di PIPE seguono una convenzione. Una lettera maiuscola indica un valore conservato in un registro di pipeline: `M_valA` è il campo valA del registro M. Una lettera minuscola indica un valore che lo stadio sta calcolando in questo ciclo: `e_valE` è il risultato che l’ALU produce nello stadio E.'
    ]
  },
  esperimento: {
    faremo: [
      'Fermeremo la pipeline un istante prima di un fronte. Sceglierai quante istruzioni indipendenti compongono il flusso e quale ciclo osservare.',
      'Leggeremo prima le uscite dei registri, cioè gli occupanti dei cinque stadi. Poi guarderemo gli ingressi già preparati, e infine faremo scattare il fronte. Dopo il caso proposto, scegli un flusso di tre istruzioni e osserva che cosa riceve lo stadio F.'
    ],
    vedrai: [
      ['register', 'Prima del fronte', 'In alto: i cinque registri con le istruzioni che conservano durante il ciclo.'],
      ['clock', 'Gli ingressi', 'Al centro: per ogni registro, l’istruzione che attende di essere catturata.'],
      ['pipeline', 'Dopo il fronte', 'In basso: i cinque registri nel ciclo successivo.']
    ]
  },
  lab: {
    titolo: 'Un fronte, cinque catture',
    scena: { w: 860, h: 292 },
    atti: ['Prima del fronte', 'Gli ingressi', 'Il fronte', 'Un posto per ciclo'],
    controlli: [
      { id: 'n', tipo: 'scelta', eti: 'Istruzioni del flusso', opzioni: [[3, '3'], [6, '6']], valore: 6 },
      { id: 'c', tipo: 'scelta', eti: 'Ciclo prima del fronte', opzioni: [[4, '4'], [5, '5'], [6, '6']], valore: 4 }
    ],
    nota: 'I passi sono sempre cinque. Le istruzioni sono indipendenti, e nessuna deve attendere.',
    previsione: {
      domanda: (p) => 'Un flusso di ' + p.n + ' istruzioni indipendenti attraversa PIPE. Il ciclo ' + p.c + ' sta per finire. Quale istruzione occuperà lo stadio W subito dopo il fronte?',
      opzioni: (p) => Array.from(new Set([3, 4, 2].map((j) => SL.unita361.occ(p.n, p.c, j)))).sort((a, b) => a - b).map((v) => [v, v ? 'I' + v : 'Nessuna'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + (pred ? 'I' + pred : 'nessuna istruzione') + '. Dopo il fronte lo stadio W ospita ' + (esito ? 'I' + esito : 'nessuna istruzione') + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === SL.unita361.occ(p.n, p.c, 4) ? 'Quella è la situazione di prima del fronte. Al fronte il contenuto di W viene sostituito.' : 'Il registro W cattura l’istruzione che prima del fronte si trovava in M, un posto più indietro.'),
    costruisci(p) {
      const el = SL.el, U = SL.unita361, passi = [], n = p.n, c = p.c, ST = SL.pipe.NOMI;
      const A = ST.map((_, j) => U.occ(n, c, j)), B = ST.map((_, j) => U.occ(n, c + 1, j)), nome = (i) => (i ? 'I' + i : '');
      const elenco = (v) => { const x = ST.map((s, j) => (v[j] ? 'I' + v[j] + ' in ' + s : null)).filter(Boolean); return x.length ? x.join(', ') : 'nessuna istruzione'; };
      const quadro = (f) => {
        const els = [el.nota('t0', 20, 0, 'PRIMA DEL FRONTE · CICLO ' + c, 'mono', f < 2 ? 'att' : '')];
        SL.pipe.stadi('a', A.map(nome), { x: 20, y: 22, h: 66, st: A.map((i, j) => (f === 3 && j === 3 ? 'att' : i ? 'on' : 'off')) }).forEach((e) => els.push(e));
        ST.forEach((s, j) => els.push(el.cella('i' + j, 29 + j * 166, 122, 140, 30, f >= 1 ? (B[j] ? 'I' + B[j] : '·') : '·', f === 1 ? (B[j] ? 'att' : 'zero') : f > 1 && B[j] ? 'on' : 'off', { so: 'ingresso di ' + s })));
        els.push(el.nota('t1', 20, 170, 'DOPO IL FRONTE · CICLO ' + (c + 1), 'mono', f >= 2 ? 'att' : ''));
        SL.pipe.stadi('b', f >= 2 ? B.map(nome) : ['·', '·', '·', '·', '·'], { x: 20, y: 192, h: 66, st: B.map((i, j) => (f < 2 ? 'off' : f === 2 ? (i ? 'att' : 'off') : f === 3 && j === 4 ? (i ? 'att' : 'zero') : i ? 'on' : 'off')) }).forEach((e) => els.push(e));
        return els;
      };
      const hud = (f) => { const v = f < 2 ? A : B; return [['Ciclo', String(f < 2 ? c : c + 1), 'a'], ['Stadi occupati', String(v.filter(Boolean).length)], ['In W', v[4] ? 'I' + v[4] : 'nessuna', 'c']]; };
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));
      const riga = (v, sep) => ST.map((s, j) => s + sep + (v[j] ? 'I' + v[j] : '·')).join('  ');

      P(0, 0, 'Durante il ciclo ' + c, 'Durante il ciclo ' + c + ' i registri mostrano in uscita le istruzioni che conservano: ' + elenco(A) + '. Ogni stadio lavora sulla propria. Fino al fronte nessuna uscita cambia.',
        { calc: 'ciclo ' + c + ':  ' + riga(A, ' '), chiedi: { d: 'Lo stadio E legge i propri dati dal registro E. In quale registro verrà depositato il suo risultato al fronte?', o: ['Nel registro E', 'Nel registro M', 'Nel registro W'], g: 1, no: 'Ogni stadio prepara l’ingresso del registro che lo segue. Dopo E viene M.' } });
      P(1, 1, 'Gli ingressi preparati', 'Ogni stadio ha preparato il proprio risultato all’ingresso del registro che lo segue. ' + (A[3] ? 'L’ingresso di W attende I' + A[3] + ', che lo stadio M sta finendo di elaborare. ' : 'L’ingresso di W è vuoto, perché lo stadio M non ospita alcuna istruzione. ') + (c + 1 <= n ? 'L’ingresso di F è l’indirizzo del prossimo prelievo, quello di I' + (c + 1) + '.' : 'L’ingresso di F è vuoto: le ' + n + ' istruzioni del flusso sono già state prelevate tutte.') + ' Le uscite dei registri restano quelle di prima.', { calc: 'ingressi:  ' + riga(B, ' ← ') });
      P(2, 2, 'Il fronte', 'Il clock sale, e i cinque registri catturano nello stesso istante. Ciascuno prende il dato che attendeva al proprio ingresso. Comincia il ciclo ' + (c + 1) + ': ' + elenco(B) + '.' + (A[4] ? ' I' + A[4] + ', che occupava W, ha concluso il percorso e lascia la pipeline.' : ''), { calc: 'ciclo ' + (c + 1) + ':  ' + riga(B, ' ') });
      P(3, 3, 'Lo stadio W', 'Il registro W ha catturato ' + (B[4] ? 'I' + B[4] + ', che prima del fronte si trovava in M' : 'un ingresso vuoto, perché prima del fronte lo stadio M non ospitava alcuna istruzione') + '. La regola vale per tutti i registri: dopo il fronte ciascuno contiene ciò che prima stava un posto più indietro.', { calc: 'W dopo il fronte = M prima del fronte', esito: [B[4] ? 'in W: I' + B[4] : 'W vuoto', 'si'] });
      P(4, 3, 'Un posto soltanto', 'Le cinque catture avvengono insieme, e nessuna istruzione ha saltato uno stadio. Il motivo sta negli ingressi, che erano stati preparati a partire dalle uscite vecchie. Il registro M ha catturato ciò che lo stadio E aveva calcolato prima del fronte. Il nuovo contenuto di E diventa visibile soltanto dopo, quando M ha già catturato.', { calc: 'ogni registro riceve dal posto precedente', esito: [B[4] ? 'in W: I' + B[4] : 'W vuoto', 'si'] });
      return { passi, esito: B[4] };
    }
  },
  bilancio: {
    regola: [
      'PIPE separa gli stadi con cinque registri di pipeline: F, D, E, M e W. Ogni registro conserva per un ciclo i dati di una istruzione, e lo stadio che lo segue li elabora.',
      'Al fronte tutti i registri catturano insieme l’ingresso che lo stadio precedente ha preparato a partire dalle uscite vecchie. Ogni istruzione avanza così di un solo posto per ciclo.'
    ],
    errori: [
      ['Pensare che una istruzione attraversi più registri nello stesso fronte.', 'Ogni registro cattura il dato che il precedente mostrava prima del fronte. Il dato nuovo compare soltanto dopo.'],
      ['Confondere lo stadio con il registro.', 'Il registro conserva i dati. Lo stadio è la logica che li elabora durante il ciclo.'],
      ['Dimenticare lo stadio F quando il flusso è finito.', 'Dopo l’ultimo prelievo lo stadio F resta vuoto, mentre le istruzioni già entrate continuano ad avanzare.']
    ],
    saFare: ['Indicare che cosa contiene ogni registro dopo un fronte.', 'Distinguere le uscite di un registro dai suoi ingressi.', 'Leggere le sigle con la maiuscola e con la minuscola.'],
    esercizi: [
      { d: 'Al ciclo 6 di un flusso di otto istruzioni indipendenti i registri contengono F = I6, D = I5, E = I4, M = I3, W = I2. Quale istruzione contiene il registro E dopo il fronte? Rispondi con il suo numero.', segnaposto: 'Un numero', giuste: ['5', 'i5', 'cinque'],
        ok: 'Il registro E cattura l’istruzione che prima del fronte si trovava in D, cioè I5.',
        diagnosi: [
          { se: ['4', 'i4'], msg: 'I4 è l’istruzione che E conteneva prima del fronte. Al fronte passa in M.' },
          { se: ['6', 'i6'], msg: 'I6 passa da F a D: avanza di un posto soltanto.' },
          { se: ['3', 'i3'], msg: 'I3 si trova più avanti: al fronte passa da M a W.' }
        ],
        altro: 'Il numero è diverso. Ogni registro riceve l’istruzione che stava un posto più indietro.',
        indizi: ['Ogni istruzione avanza di un posto.', 'Il registro E riceve dallo stadio D.', 'Prima del fronte D conteneva I5.'],
        svolgimento: ['Prima del fronte: D = I5.', 'Al fronte il registro E cattura il lavoro dello stadio D.', 'Dopo il fronte: E = I5.'] },
      { d: 'Che cosa indica la sigla `W_valM`?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il campo valM conservato nel registro W', ok: true, fb: 'La maiuscola iniziale indica un valore conservato in un registro di pipeline.' },
        { t: 'Il valore valM che uno stadio sta calcolando in questo ciclo', fb: 'Un valore in corso di calcolo ha l’iniziale minuscola, come `m_valM`.' },
        { t: 'La parola che lo stadio W scrive nella memoria dei dati', fb: 'Lo stadio W scrive nel banco dei registri. valM è la parola letta dalla memoria nello stadio M, arrivata ora al registro W.' }] },
      { d: 'Un flusso di quattro istruzioni indipendenti entra in PIPE dal ciclo 1. Quale istruzione occupa lo stadio D dopo il fronte che chiude il ciclo 4? Rispondi con il suo numero.', segnaposto: 'Un numero', giuste: ['4', 'i4', 'quattro'],
        ok: 'Al ciclo 4 lo stadio F ospita I4. Al fronte I4 passa in D.',
        diagnosi: [
          { se: ['5', 'i5'], msg: 'Il flusso ha quattro istruzioni: I5 non esiste, e dopo il fronte lo stadio F resta vuoto.' },
          { se: ['3', 'i3'], msg: 'I3 occupa D prima del fronte. Al fronte passa in E.' }
        ],
        altro: 'Il numero è diverso. Si determini l’istruzione che al ciclo 4 occupa F: al fronte passa in D.',
        indizi: ['Al ciclo 4 entra in F la quarta istruzione.', 'Al fronte ogni istruzione avanza di un posto.', 'Da F si passa a D.'],
        svolgimento: ['Ciclo 4: F = I4, D = I3, E = I2, M = I1.', 'Al fronte I4 passa da F a D.', 'Ciclo 5: D = I4, e F resta vuoto.'] }
    ],
    sfida: ['cslez3_6_01_random_assembly', 'Istruzioni presenti nei cinque stadi']
  }
});
// L'istruzione che occupa lo stadio j (0 = F … 4 = W) al ciclo c, in un flusso di n istruzioni: 0 se lo stadio è vuoto.
SL.unita361 = { occ: (n, c, j) => { const i = c - j; return i >= 1 && i <= n ? i : 0; } };
