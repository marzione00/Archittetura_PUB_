'use strict';
SL.unita531 = (() => {
  const inizio = (p) => (p.pol === 'prio' ? p.t : p.fine);
  // fase: 0 l'inizio · 1 il risveglio · 2 la decisione · 3 l'inizio di B · 4 la misura
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], ini = inizio(p), fino = f === 0 ? 0 : f === 1 ? p.t : f === 2 ? p.t : 10, passo = o.wc + 4;
    els.push(el.nota(pre + 't0', o.x, o.y, 'PROCESSORE · chi esegue in ogni millisecondo', 'mono'), el.nota(pre + 't1', o.x, o.y + 84, 'PROCESSO B · D attende il disco · P pronto · E esegue', 'mono'));
    for (let k = 0; k < 10; k++) {
      const vis = k < fino || f >= 3, chi = k < ini ? 'A' : 'B';
      els.push(el.cella(pre + 'c' + k, o.x + k * passo, o.y + 24, o.wc, 34, vis ? chi : '', vis ? (chi === 'B' ? 'att' : 'on') : '', { gi: String(k), piccola: true }));
      const st = k < p.t ? 'D' : k < ini ? 'P' : 'E';
      els.push(el.cella(pre + 'b' + k, o.x + k * passo, o.y + 108, o.wc, 34, vis ? st : '', vis ? (st === 'P' ? 'err' : st === 'E' ? 'att' : 'zero') : '', { piccola: true }));
    }
    return els;
  };
  return { inizio, quadro };
})();
SL.registra('5.3.1', {
  titolo: 'Eventi che attivano lo scheduler',
  obiettivo: 'Obiettivo: elencare gli eventi che richiedono una decisione dello scheduler, e misurare l’attesa di un processo risvegliato prima dell’esecuzione.',
  concetti: [['interrupt', 'Un evento attiva lo scheduler'], ['coda', 'Lo stato di pronto precede il servizio'], ['clock', 'L’attesa si misura dal risveglio']],
  filigrana: ['coda', 'interrupt', 'clock'],
  richiami: {
    carte: [
      { sim: 'process', da: 'Dall’unità 4.2.4', t: 'Lo scheduler', d: 'La parte del kernel che seleziona il processo successivo da eseguire.' },
      { sim: 'coda', da: 'Dall’unità 5.1.2', t: 'Pronto e bloccato', d: 'Al processo pronto manca il turno, al processo bloccato manca un evento.' },
      { sim: 'clock', da: 'Dall’unità 4.7.5', t: 'Dal dato alla ripresa', d: 'Fra l’arrivo dei dati e la ripresa del processo intercorre l’attesa del processore.' }
    ],
    domanda: { d: 'Prima di proseguire: un processo diviene pronto all’istante 2 ms e inizia l’esecuzione all’istante 5 ms. Quanto ha atteso fra i pronti?', o: [
      { t: '3 ms', ok: true, fb: '5 − 2 = 3.' },
      { t: '5 ms', fb: 'L’attesa fra i pronti si conta dall’istante in cui è divenuto pronto, cioè da 2.' },
      { t: '2 ms', fb: 'Due millisecondi è l’istante del risveglio. L’attesa si estende da tale istante all’inizio dell’esecuzione.' }
    ] }
  },
  idea: {
    titolo: 'Gli istanti della decisione e i processi favoriti',
    termini: ['prelazione', 'tempo di attesa'],
    testo: [
      'Lo scheduler interviene soltanto quando un evento può modificare l’assegnazione del processore. Gli eventi sono quattro: il processo in esecuzione si blocca, in attesa di un dispositivo; il processo in esecuzione termina; scade il suo time slice; un processo bloccato torna pronto, poiché il dispositivo che attendeva ha risposto.',
      'Nei primi due casi il processore resta libero, e una scelta è obbligata. Negli altri due il processo in esecuzione potrebbe proseguire, e la decisione spetta alla politica. Se lo scheduler può sottrarre il processore a un processo che non lo ha ceduto, si parla di [[prelazione]]. La scadenza del time slice è una prelazione, al pari del caso in cui un processo appena risvegliato precede quello in esecuzione.',
      { fig: 'scena', w: 720, h: 176, titolo: 'B si risveglia a 2 ms, e A conserva il turno fino a 5 ms', nota: 'Per tre millisecondi B è pronto senza eseguire: tale intervallo è il suo tempo di attesa dopo il risveglio.', els: SL.unita531.quadro('g', { t: 2, fine: 5, pol: 'turno' }, 4, { x: 10, y: 0, wc: 64 }) },
      'Si consideri un caso. A è in esecuzione dall’istante 0. B attende un dato dal disco, che giunge all’istante 2 ms: un interrupt avvisa il kernel, e B torna pronto. Se la politica consente ad A di concludere il proprio turno, che scade a 5 ms, B ha inizio a 5. I tre millisecondi fra 2 e 5 sono il suo [[tempo di attesa]]: il tempo trascorso fra i pronti senza eseguire. Il tempo precedente, impiegato dal disco, è una grandezza diversa, che nessuno scheduler poteva ridurre.',
      'Se invece la politica assegna a B una precedenza maggiore e prevede la prelazione, al risveglio di B lo scheduler sottrae immediatamente il processore ad A. B ha inizio a 2 ms, e la sua attesa è nulla. A è ricollocato fra i pronti e terminerà in seguito. Nessuna delle due scelte è corretta in assoluto: la prima favorisce il processo in esecuzione, la seconda il processo che ha appena ricevuto il dato atteso. I capitoli seguenti confrontano le politiche su queste misure.'
    ]
  },
  esperimento: {
    faremo: [
      'A è in esecuzione dall’istante 0, e B attende un dato dal disco. I controlli fissano l’istante di arrivo del dato, la scadenza del turno di A, e la politica: A conserva il turno, oppure B ha la precedenza con prelazione.',
      'L’esperimento costruisce due righe del tempo: il processo che impiega il processore, e lo stato di B. L’attesa di B è l’intervallo in cui è pronto senza eseguire.'
    ],
    vedrai: [
      ['clock', 'Il processore', 'In alto: una cella per millisecondo, con il processo in esecuzione.'],
      ['process', 'Lo stato di B', 'In basso: D quando attende il disco, P quando è pronto, E quando esegue.']
    ]
  },
  lab: {
    titolo: 'Il risveglio di B',
    scena: { w: 860, h: 176 },
    atti: ['L’inizio', 'Il risveglio', 'La decisione', 'La misura'],
    controlli: [
      { id: 't', tipo: 'scelta', eti: 'Il dato giunge a', opzioni: [[2, '2 ms'], [3, '3 ms'], [4, '4 ms']], valore: 2 },
      { id: 'fine', tipo: 'scelta', eti: 'Il turno di A scade a', opzioni: [[5, '5 ms'], [8, '8 ms']], valore: 5 },
      { id: 'pol', tipo: 'scelta', eti: 'Politica', opzioni: [['turno', 'A conserva il turno'], ['prio', 'B ha la precedenza, con prelazione']], valore: 'turno' }
    ],
    nota: 'I passi sono sempre cinque. Il cambio di contesto è considerato istantaneo.',
    previsione: {
      domanda: (p) => 'A esegue dall’istante 0, e il suo turno scade a ' + p.fine + ' ms. Il dato atteso da B giunge a ' + p.t + ' ms. ' + (p.pol === 'turno' ? 'La politica consente ad A di concludere il turno.' : 'La politica assegna la precedenza a B e ammette la prelazione.') + ' Quanto attende B fra i pronti, dopo il risveglio?',
      opzioni: (p) => [0, p.fine - p.t, p.fine].map((v) => [v, v === 0 ? '0 ms, esegue immediatamente' : v + ' ms'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' ms. B attende ' + esito + ' ms. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.pol === 'prio' ? 'Con la prelazione il processore passa a B nell’istante del risveglio.' : pred === p.fine ? 'L’attesa fra i pronti si conta dal risveglio, a ' + p.t + ' ms. In precedenza B attendeva il disco.' : 'A conserva il processore fino a ' + p.fine + ' ms, e B deve attendere.'),
    costruisci(p) {
      const U = SL.unita531, passi = [], ini = U.inizio(p), att = ini - p.t, prio = p.pol === 'prio';
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, wc: 78 });
      const hud = (f) => [['Risveglio di B', f >= 1 ? p.t + ' ms' : '·', 'a'], ['Inizio di B', f >= 3 ? ini + ' ms' : '·'], ['Attesa', f >= 4 ? att + ' ms' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'A in esecuzione, B in attesa del disco', 'All’istante 0 il processore esegue A. B ha richiesto un dato al disco ed è bloccato: finché il dato non giunge, lo scheduler lo esclude dalla scelta.', {});
      P(1, 1, 'L’arrivo del dato', 'All’istante ' + p.t + ' ms il disco completa la lettura e invia un interrupt. Il kernel sposta B fra i pronti. Si tratta di uno dei quattro eventi che attivano lo scheduler.', { calc: 'B pronto a ' + p.t + ' ms', chiedi: { d: 'B è pronto. È in esecuzione?', o: ['Sì', 'No, il processore è ancora assegnato ad A'], g: 1, no: 'Il dato rende B pronto. Per eseguire gli occorre il processore.' } });
      P(2, 2, 'La decisione dello scheduler', prio ? 'La politica assegna a B una precedenza maggiore, e ammette la prelazione. Lo scheduler sottrae il processore ad A, che torna fra i pronti con il turno incompiuto.' : 'La politica consente la prosecuzione di un turno in corso. A conserva il processore fino alla scadenza, a ' + p.fine + ' ms, e B resta in coda.', { calc: prio ? 'prelazione di A' : 'A prosegue fino a ' + p.fine + ' ms' });
      P(3, 2, 'B ha inizio', prio ? 'B riceve il processore all’istante ' + ini + ' ms, il medesimo del risveglio.' : 'Alla scadenza del turno di A, a ' + ini + ' ms, il dispatcher consegna il processore a B.', { calc: 'B esegue da ' + ini + ' ms' });
      P(4, 3, 'L’attesa di B', 'B è divenuto pronto a ' + p.t + ' ms e ha iniziato l’esecuzione a ' + ini + ' ms: il suo tempo di attesa dopo il risveglio è ' + ini + ' − ' + p.t + ' = ' + att + ' ms.' + (att === 0 ? ' Il costo è ricaduto su A, interrotto durante il turno.' : ' I ' + p.t + ' ms precedenti sono stati impiegati dal disco, e sono esclusi dall’attesa del processore.'), { calc: ini + ' − ' + p.t + ' = ' + att + ' ms', esito: ['attesa di ' + att + ' ms', ''] });
      return { passi, esito: att };
    }
  },
  bilancio: {
    regola: [
      'Lo scheduler decide quando il processo in esecuzione si blocca, termina o esaurisce il time slice, e quando un processo bloccato torna pronto.',
      'Tempo di attesa dopo un risveglio = istante in cui il processo inizia l’esecuzione − istante in cui è tornato pronto.'
    ],
    errori: [
      ['Contare nell’attesa il tempo impiegato dal dispositivo.', 'Finché il dato è assente, il processo è bloccato. L’attesa del processore ha inizio al risveglio.'],
      ['Ritenere che un processo risvegliato esegua immediatamente.', 'L’esito dipende dalla politica: senza prelazione il processo attende la fine del turno in corso.'],
      ['Considerare la prelazione priva di costi.', 'Il processo interrotto termina in seguito, e nei sistemi reali ogni cambio di contesto richiede tempo.']
    ],
    saFare: ['Elencare i quattro eventi che attivano lo scheduler.', 'Calcolare l’attesa di un processo dopo il risveglio.', 'Distinguere una politica con prelazione da una senza.'],
    esercizi: [
      { d: 'Un processo attende un dato dalla rete, che giunge all’istante 12 ms. Il processo in esecuzione conserva il turno fino a 20 ms, e quindi il processore passa al primo. Quanto ha atteso fra i pronti, in millisecondi?', segnaposto: 'Un numero', giuste: ['8', '8ms', 'otto'],
        ok: '20 − 12 = 8 ms.',
        diagnosi: [
          { se: ['20', '20ms'], msg: 'Questo è l’istante in cui inizia l’esecuzione. L’attesa si conta dal risveglio, a 12 ms.' },
          { se: ['12', '12ms'], msg: 'Questo è l’istante del risveglio. Fino ad allora il processo era bloccato.' },
          { se: ['0', '0ms'], msg: 'Sarebbe 0 con la prelazione. In questo caso il turno in corso è portato a termine.' }
        ],
        altro: 'Il valore è diverso. Si sottragga l’istante del risveglio da quello in cui inizia l’esecuzione.',
        indizi: ['Risveglio: 12 ms.', 'Inizio dell’esecuzione: 20 ms.', '20 − 12 = 8.'],
        svolgimento: ['Pronto da: 12 ms.', 'In esecuzione da: 20 ms.', 'Attesa: 8 ms.'] },
      { d: 'Quale di questi eventi non richiede una decisione dello scheduler?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il processo in esecuzione somma due registri', ok: true, fb: 'Un’istruzione ordinaria lascia invariata l’assegnazione del processore.' },
        { t: 'Il processo in esecuzione termina', fb: 'Il processore resta libero, e va assegnato.' },
        { t: 'Un processo bloccato riceve il dato che attendeva', fb: 'È presente un nuovo processo pronto, e la politica può prevederne l’esecuzione.' }] },
      { d: 'Un processo appena risvegliato sottrae il processore a quello in esecuzione, che disponeva ancora di tempo nel proprio turno. Quale nome ha questo evento?', guida: 'Si scelga la risposta.', o: [
        { t: 'Prelazione', ok: true, fb: 'Il processore è sottratto a un processo che non lo ha ceduto.' },
        { t: 'Blocco', fb: 'Un processo si blocca quando attende un evento. In questo caso il processo che perde il processore resta pronto.' },
        { t: 'Terminazione', fb: 'Il processo interrotto ha ancora istruzioni da eseguire, e riprenderà in seguito.' }] }
    ],
    sfida: ['cslez5_3_01_scheduling', 'Tempi di attesa, risposta e completamento']
  }
});
