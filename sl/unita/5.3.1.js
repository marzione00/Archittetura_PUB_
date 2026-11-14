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
  obiettivo: 'Obiettivo: elencare i momenti in cui lo scheduler viene chiamato a decidere, e misurare quanto un processo risvegliato aspetta prima di eseguire.',
  concetti: [['interrupt', 'Un evento chiama lo scheduler'], ['coda', 'Pronto non vuol dire servito'], ['clock', 'L’attesa si misura dal risveglio']],
  filigrana: ['coda', 'interrupt', 'clock'],
  richiami: {
    carte: [
      { sim: 'process', da: 'Dall’unità 4.2.4', t: 'Lo scheduler', d: 'La parte del kernel che sceglie il prossimo processo da eseguire.' },
      { sim: 'coda', da: 'Dall’unità 5.1.2', t: 'Pronto e bloccato', d: 'Al pronto manca il turno, al bloccato manca un evento.' },
      { sim: 'clock', da: 'Dall’unità 4.7.5', t: 'Dal dato alla ripresa', d: 'Fra l’arrivo dei dati e la ripresa del processo c’è l’attesa del processore.' }
    ],
    domanda: { d: 'Prima di proseguire: un processo diventa pronto all’istante 2 ms e comincia a eseguire all’istante 5 ms. Quanto ha atteso fra i pronti?', o: [
      { t: '3 ms', ok: true, fb: '5 − 2 = 3.' },
      { t: '5 ms', fb: 'L’attesa fra i pronti si conta da quando è diventato pronto, all’istante 2.' },
      { t: '2 ms', fb: 'Due millisecondi è l’istante del risveglio. L’attesa va da lì all’inizio dell’esecuzione.' }
    ] }
  },
  idea: {
    titolo: 'Quando si decide, e chi ci guadagna',
    termini: ['prelazione', 'tempo di attesa'],
    testo: [
      'Lo scheduler entra in gioco soltanto quando accade qualcosa che può cambiare la risposta alla domanda «a chi tocca il processore». Gli eventi sono quattro. Il processo in esecuzione si blocca, in attesa di un dispositivo. Il processo in esecuzione termina. Scade il suo quanto di tempo. Oppure un processo bloccato torna pronto, perché il dispositivo che aspettava ha risposto.',
      'Nei primi due casi il processore resta libero, e una scelta è obbligata. Negli altri due il processo in esecuzione potrebbe proseguire, e la decisione spetta alla politica. Se lo scheduler può togliere il processore a un processo che non lo ha ceduto, si parla di [[prelazione]]. La scadenza del quanto è una prelazione. Lo è anche il caso in cui un processo appena risvegliato scavalca quello in esecuzione.',
      { fig: 'scena', w: 720, h: 176, titolo: 'B si risveglia a 2 ms, e A conserva il turno fino a 5 ms', nota: 'Per tre millisecondi B è pronto e resta fermo: è il suo tempo di attesa dopo il risveglio.', els: SL.unita531.quadro('g', { t: 2, fine: 5, pol: 'turno' }, 4, { x: 10, y: 0, wc: 64 }) },
      'Seguiamo un caso. A sta calcolando dall’istante 0. B aspetta un dato dal disco, che arriva all’istante 2 ms: un interrupt avvisa il kernel, e B torna pronto. Se la politica lascia finire ad A il suo turno, che scade a 5 ms, B comincia a 5. I tre millisecondi fra 2 e 5 sono il suo [[tempo di attesa]]: il tempo passato fra i pronti senza eseguire. Il tempo precedente, speso dal disco, è un’altra cosa, e nessuno scheduler poteva accorciarlo.',
      'Se invece la politica assegna a B una precedenza maggiore e prevede la prelazione, al risveglio di B lo scheduler toglie subito il processore ad A. B comincia a 2 ms, e la sua attesa è nulla. A viene rimesso fra i pronti e finirà più tardi. Nessuna delle due scelte è giusta in assoluto: la prima protegge chi sta lavorando, la seconda chi ha appena ricevuto ciò che aspettava. I capitoli seguenti confrontano le politiche proprio su queste misure.'
    ]
  },
  esperimento: {
    faremo: [
      'A calcola dall’istante 0, e B aspetta un dato dal disco. Sceglierai quando arriva il dato, quando scade il turno di A, e la politica: A conserva il turno, oppure B ha la precedenza e scatta la prelazione.',
      'Costruiremo due righe del tempo: chi usa il processore, e in quale stato si trova B. L’attesa di B è il tratto in cui è pronto e non esegue.'
    ],
    vedrai: [
      ['clock', 'Il processore', 'In alto: una casella per millisecondo, con il processo in esecuzione.'],
      ['process', 'Lo stato di B', 'In basso: D quando attende il disco, P quando è pronto, E quando esegue.']
    ]
  },
  lab: {
    titolo: 'Il risveglio di B',
    scena: { w: 860, h: 176 },
    atti: ['L’inizio', 'Il risveglio', 'La decisione', 'La misura'],
    controlli: [
      { id: 't', tipo: 'scelta', eti: 'Il dato arriva a', opzioni: [[2, '2 ms'], [3, '3 ms'], [4, '4 ms']], valore: 2 },
      { id: 'fine', tipo: 'scelta', eti: 'Il turno di A scade a', opzioni: [[5, '5 ms'], [8, '8 ms']], valore: 5 },
      { id: 'pol', tipo: 'scelta', eti: 'Politica', opzioni: [['turno', 'A conserva il turno'], ['prio', 'B ha la precedenza, con prelazione']], valore: 'turno' }
    ],
    nota: 'I passi sono sempre cinque. Il cambio di contesto è considerato istantaneo.',
    previsione: {
      domanda: (p) => 'A esegue dall’istante 0, e il suo turno scade a ' + p.fine + ' ms. Il dato atteso da B arriva a ' + p.t + ' ms. ' + (p.pol === 'turno' ? 'La politica lascia finire il turno ad A.' : 'La politica dà la precedenza a B e ammette la prelazione.') + ' Quanto attende B fra i pronti, dopo il risveglio?',
      opzioni: (p) => [0, p.fine - p.t, p.fine].map((v) => [v, v === 0 ? '0 ms: esegue subito' : v + ' ms'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' ms. B attende ' + esito + ' ms. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.pol === 'prio' ? 'Con la prelazione il processore passa a B nell’istante stesso del risveglio.' : pred === p.fine ? 'L’attesa fra i pronti si conta dal risveglio, a ' + p.t + ' ms. Prima B aspettava il disco.' : 'A conserva il processore fino a ' + p.fine + ' ms, e B deve aspettare.'),
    costruisci(p) {
      const U = SL.unita531, passi = [], ini = U.inizio(p), att = ini - p.t, prio = p.pol === 'prio';
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, wc: 78 });
      const hud = (f) => [['Risveglio di B', f >= 1 ? p.t + ' ms' : '·', 'a'], ['Inizio di B', f >= 3 ? ini + ' ms' : '·'], ['Attesa', f >= 4 ? att + ' ms' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'A calcola, B aspetta il disco', 'All’istante 0 il processore esegue A. B ha chiesto un dato al disco ed è bloccato: finché il dato non arriva, lo scheduler non lo considera nemmeno.', {});
      P(1, 1, 'Il dato arriva', 'All’istante ' + p.t + ' ms il disco completa la lettura e manda un interrupt. Il kernel sposta B fra i pronti. È uno dei quattro eventi che chiamano in causa lo scheduler.', { calc: 'B pronto a ' + p.t + ' ms', chiedi: { d: 'B è pronto. Sta eseguendo?', o: ['Sì', 'No: il processore è ancora di A'], g: 1, no: 'Il dato rende B pronto. Per eseguire gli serve il processore.' } });
      P(2, 2, 'La decisione dello scheduler', prio ? 'La politica assegna a B una precedenza maggiore, e ammette la prelazione. Lo scheduler toglie il processore ad A, che torna fra i pronti con il lavoro a metà.' : 'La politica lascia proseguire un turno in corso. A conserva il processore fino alla scadenza, a ' + p.fine + ' ms, e B resta in coda.', { calc: prio ? 'prelazione di A' : 'A prosegue fino a ' + p.fine + ' ms' });
      P(3, 2, 'B comincia', prio ? 'B riceve il processore all’istante ' + ini + ' ms, lo stesso del risveglio.' : 'Alla scadenza del turno di A, a ' + ini + ' ms, il dispatcher consegna il processore a B.', { calc: 'B esegue da ' + ini + ' ms' });
      P(4, 3, 'L’attesa di B', 'B è diventato pronto a ' + p.t + ' ms e ha cominciato a ' + ini + ' ms: il suo tempo di attesa dopo il risveglio è ' + ini + ' − ' + p.t + ' = ' + att + ' ms.' + (att === 0 ? ' Il prezzo lo ha pagato A, interrotto a metà del turno.' : ' I ' + p.t + ' ms precedenti li ha spesi il disco, e restano fuori dall’attesa del processore.'), { calc: ini + ' − ' + p.t + ' = ' + att + ' ms', esito: ['attesa di ' + att + ' ms', ''] });
      return { passi, esito: att };
    }
  },
  bilancio: {
    regola: [
      'Lo scheduler decide quando il processo in esecuzione si blocca, termina o esaurisce il quanto, e quando un processo bloccato torna pronto.',
      'Tempo di attesa dopo un risveglio = istante in cui il processo comincia a eseguire − istante in cui è tornato pronto.'
    ],
    errori: [
      ['Contare nell’attesa il tempo speso dal dispositivo.', 'Finché il dato non c’è, il processo è bloccato. L’attesa del processore comincia al risveglio.'],
      ['Pensare che un processo risvegliato esegua subito.', 'Dipende dalla politica: senza prelazione aspetta la fine del turno in corso.'],
      ['Considerare la prelazione gratuita.', 'Il processo interrotto finisce più tardi, e nella realtà ogni cambio di contesto costa tempo.']
    ],
    saFare: ['Elencare i quattro eventi che chiamano lo scheduler.', 'Calcolare l’attesa di un processo dopo il risveglio.', 'Distinguere una politica con prelazione da una senza.'],
    esercizi: [
      { d: 'Un processo aspetta un dato dalla rete, che arriva all’istante 12 ms. Il processo in esecuzione conserva il turno fino a 20 ms, e poi il processore passa al primo. Quanto ha atteso fra i pronti, in millisecondi?', segnaposto: 'Un numero', giuste: ['8', '8ms', 'otto'],
        ok: '20 − 12 = 8 ms.',
        diagnosi: [
          { se: ['20', '20ms'], msg: 'Questo è l’istante in cui comincia a eseguire. L’attesa si conta dal risveglio, a 12 ms.' },
          { se: ['12', '12ms'], msg: 'Questo è l’istante del risveglio. Fino ad allora il processo era bloccato.' },
          { se: ['0', '0ms'], msg: 'Sarebbe 0 con la prelazione. Qui il turno in corso viene lasciato finire.' }
        ],
        altro: 'Il valore è diverso. Si sottragga l’istante del risveglio da quello in cui comincia a eseguire.',
        indizi: ['Risveglio: 12 ms.', 'Inizio dell’esecuzione: 20 ms.', '20 − 12 = 8.'],
        svolgimento: ['Pronto da: 12 ms.', 'In esecuzione da: 20 ms.', 'Attesa: 8 ms.'] },
      { d: 'Quale di questi eventi non richiede una decisione dello scheduler?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il processo in esecuzione somma due registri', ok: true, fb: 'Una normale istruzione non cambia chi può o deve usare il processore.' },
        { t: 'Il processo in esecuzione termina', fb: 'Il processore resta libero, e va assegnato.' },
        { t: 'Un processo bloccato riceve il dato che aspettava', fb: 'C’è un nuovo processo pronto, e la politica può volerlo eseguire.' }] },
      { d: 'Un processo appena risvegliato toglie il processore a quello in esecuzione, che avrebbe avuto ancora tempo nel proprio turno. Come si chiama questo fatto?', guida: 'Si scelga la risposta.', o: [
        { t: 'Prelazione', ok: true, fb: 'Il processore viene tolto a un processo che non lo ha ceduto.' },
        { t: 'Blocco', fb: 'Un processo si blocca quando aspetta un evento. Qui chi perde il processore resta pronto.' },
        { t: 'Terminazione', fb: 'Il processo interrotto ha ancora lavoro da fare, e riprenderà più tardi.' }] }
    ],
    sfida: ['cslez5_3_01_scheduling', 'Tempi di attesa, risposta e completamento']
  }
});
