'use strict';
SL.unita575 = (() => {
  const conti = (p, giri) => (p.caso === 'starve' ? { tent: giri, fatti: giri } : p.caso === 'live' ? { tent: 2 * giri, fatti: 0 } : { tent: 0, fatti: 0 });
  const RIGHE = { starve: ['LETTORI · entrano e escono a turno', 'SCRITTORE S · richiede l’accesso esclusivo'], live: ['THREAD A · ha X, richiede Y', 'THREAD B · ha Y, richiede X'], dead: ['THREAD A · ha X, attende Y', 'THREAD B · ha Y, attende X'] };
  const CELLE = { starve: ['ha letto', 'attende'], live: ['ritenta', 'ritenta'], dead: ['bloccato', 'bloccato'] };
  // giri: giri già avvenuti · n: giri in programma
  const quadro = (pre, p, giri, fine, o) => {
    const el = SL.el, els = [], c = conti(p, giri), passo = o.wc + 6, w3 = (o.w - 20) / 3, st1 = p.caso === 'starve' ? 'on' : p.caso === 'live' ? 'zero' : 'err', st2 = p.caso === 'starve' ? 'err' : st1;
    els.push(el.nota(pre + 't0', o.x, o.y, RIGHE[p.caso][0], 'mono'), el.nota(pre + 't1', o.x, o.y + 84, RIGHE[p.caso][1], 'mono'));
    for (let k = 0; k < p.n; k++) {
      const vis = k < giri, cur = k === giri - 1 && !fine;
      els.push(el.cella(pre + 'a' + k, o.x + k * passo, o.y + 24, o.wc, 32, vis ? CELLE[p.caso][0] : '', vis ? (cur ? 'att' : st1) : '', { gi: 'iter. ' + (k + 1), piccola: true }));
      els.push(el.cella(pre + 'b' + k, o.x + k * passo, o.y + 108, o.wc, 32, vis ? CELLE[p.caso][1] : '', vis ? (cur ? 'att' : st2) : '', { piccola: true }));
    }
    els.push(el.box(pre + 'q0', o.x, o.y + 152, w3, 54, 'tentativi', String(c.tent), 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'q1', o.x + w3 + 10, o.y + 152, w3, 54, 'operazioni completate', String(c.fatti), c.fatti ? 'on' : giri ? 'err' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q2', o.x + 2 * (w3 + 10), o.y + 152, w3, 54, 'senza avanzamento', giri === 0 ? '·' : p.caso === 'starve' ? 'S' : 'A e B', giri ? 'err' : '', { cls: 'stretta' }));
    return els;
  };
  return { conti, quadro };
})();
SL.registra('5.7.5', {
  titolo: 'Distinguere starvation e livelock nelle tracce',
  obiettivo: 'Obiettivo: distinguere deadlock, livelock e starvation mediante il conteggio, in una traccia, dei tentativi compiuti e delle operazioni completate.',
  concetti: [['lente', 'Contare tentativi e completamenti'], ['riproduci', 'Attività senza avanzamento'], ['clock', 'Avanzano tutti, tranne uno']],
  filigrana: ['lente', 'riproduci', 'clock'],
  richiami: {
    carte: [
      { sim: 'clock', da: 'Dall’unità 5.6.4', t: 'La starvation', d: 'Un thread pronto a proseguire è preceduto indefinitamente, mentre il sistema prosegue il lavoro.' },
      { sim: 'stallo', da: 'Dall’unità 5.6.2', t: 'Il deadlock', d: 'Thread bloccati che si attendono a vicenda: nessun evento futuro può sbloccarli.' },
      { sim: 'scudo', da: 'Dall’unità 5.7.2', t: 'Rilascio e nuovo tentativo', d: 'Una regola di prevenzione: un thread al quale è negato un lock cede quelli posseduti, e riprende dall’inizio.' }
    ],
    domanda: { d: 'Prima di proseguire: con la precedenza ai lettori, uno scrittore attende mentre i lettori continuano a giungere. Il sistema svolge lavoro?', o: [
      { t: 'Sì, le letture sono completate, e lo scrittore resta escluso', ok: true, fb: 'Si tratta della differenza fra starvation e deadlock.' },
      { t: 'No, ogni attività è sospesa', fb: 'I lettori entrano ed escono. Soltanto lo scrittore è sospeso.' },
      { t: 'Sì, e lo scrittore entrerà al prossimo turno', fb: 'Finché i lettori giungono prima dell’uscita dell’ultimo, il turno dello scrittore è rinviato.' }
    ] }
  },
  idea: {
    titolo: 'Tre forme di mancato completamento',
    termini: ['livelock', 'attesa casuale'],
    testo: [
      'Un programma concorrente che ha cessato di produrre risultati può trovarsi in tre situazioni diverse, simili per un osservatore esterno. Nel deadlock, già esaminato, i thread coinvolti sono bloccati, e il processore non esegue alcuna loro istruzione. Nella starvation, esaminata con lo scrittore dell’unità 5.6.4, il sistema completa lavoro, e un thread resta sempre escluso. Resta da esaminare la terza.',
      'Si considerino due thread che, a ogni conflitto, cedono entrambi e ripetono il tentativo nel medesimo istante: il conflitto si ripresenta identico a ogni ripetizione. Nessuno dei due è bloccato, ed è la regola di cessione a mantenerli in tale condizione. Questa situazione prende il nome di [[livelock]]: i thread eseguono, cambiano stato, reagiscono l’uno all’altro, e il lavoro completato resta a zero.',
      'Il livelock deriva spesso da un rimedio al deadlock. Si riprenda la regola dell’unità 5.7.2: un thread al quale è negato un lock rilascia quelli posseduti e ripete il tentativo. A possiede X e richiede Y, e B possiede Y e richiede X. Entrambi ricevono un rifiuto, rilasciano, attendono il medesimo tempo, riacquisiscono il proprio lock e ripetono il tentativo. La situazione è identica a quella di partenza, e la sequenza si ripete.',
      { fig: 'scena', w: 720, h: 212, titolo: 'Tre iterazioni di tentativi, e nessuna operazione completata', nota: 'A e B eseguono e cambiano stato a ogni iterazione. Il contatore delle operazioni completate resta a zero.', els: SL.unita575.quadro('g', { caso: 'live', n: 3 }, 3, true, { x: 10, y: 4, w: 700, wc: 120 }) },
      'Per distinguere le tre situazioni in una traccia sono sufficienti due contatori, osservati per un certo tempo: i tentativi compiuti e le operazioni completate. Nel deadlock restano entrambi invariati. Nel livelock i tentativi crescono e i completamenti restano a zero. Nella starvation i completamenti crescono, e una richiesta resta in attesa dall’inizio. Una traccia è sempre finita, e mostra il meccanismo: la diagnosi vale nell’ipotesi che la sequenza continui a ripetersi.',
      'Anche i rimedi sono diversi. Il livelock si interrompe con l’eliminazione della simmetria: ogni thread, prima di ripetere il tentativo, attende per un tempo estratto a caso, una [[attesa casuale]]. Con elevata probabilità, dopo pochi tentativi i due tempi differiscono, e uno dei due thread procede. Contro la starvation occorre una politica che fissi un limite all’attesa, come l’ordine di arrivo dell’unità 5.6.4 o l’invecchiamento dell’unità 5.3.4.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento osserva una sequenza che si ripete per alcune iterazioni. I controlli fissano la situazione, cioè lettori che precedono uno scrittore, due thread che cedono e ripetono il tentativo insieme, oppure due thread bloccati, e il numero delle iterazioni osservate.',
      'A ogni iterazione sono aggiornati due contatori: i tentativi compiuti e le operazioni completate. Al termine la coppia dei contatori identifica la situazione.'
    ],
    vedrai: [
      ['riproduci', 'Le iterazioni', 'In alto: l’attività di ciascun thread in ogni iterazione.'],
      ['lente', 'I contatori', 'In basso: tentativi, operazioni completate, e il thread senza avanzamento.']
    ]
  },
  lab: {
    titolo: 'Due contatori per una diagnosi',
    scena: { w: 860, h: 216 },
    atti: ['L’inizio', 'Le iterazioni', 'La diagnosi'],
    controlli: [
      { id: 'caso', tipo: 'scelta', eti: 'Situazione', opzioni: [['starve', 'i lettori continuano, S attende'], ['live', 'A e B cedono e ritentano insieme'], ['dead', 'A e B sono bloccati']], valore: 'live' },
      { id: 'n', tipo: 'scelta', eti: 'Iterazioni osservate', opzioni: [[2, '2'], [3, '3'], [5, '5']], valore: 3 }
    ],
    nota: 'Il numero dei passi dipende dalle iterazioni osservate. La diagnosi finale suppone che la sequenza continui nel medesimo modo.',
    previsione: {
      domanda: (p) => (p.caso === 'starve' ? 'Uno scrittore S attende. A ogni iterazione un nuovo lettore entra prima dell’uscita del precedente, e il precedente completa la propria lettura.' : p.caso === 'live' ? 'A possiede X e richiede Y. B possiede Y e richiede X. A ogni iterazione entrambi tentano, ricevono un rifiuto, rilasciano e riacquisiscono il proprio lock.' : 'A possiede X e attende Y. B possiede Y e attende X. Entrambi sono bloccati.') + ' Dopo ' + p.n + ' iterazioni, quante operazioni sono state completate complessivamente?',
      opzioni: (p) => [0, p.n, 2 * p.n].map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Le operazioni completate sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.caso === 'starve' ? 'A ogni iterazione un lettore completa la propria lettura: il sistema svolge lavoro, e S resta escluso.' : p.caso === 'live' ? 'I tentativi sono ' + 2 * p.n + ', e nessuno ha avuto esito positivo. Attività e avanzamento sono proprietà distinte.' : 'Due thread bloccati restano senza eseguire: zero tentativi e zero completamenti.'),
    costruisci(p) {
      const U = SL.unita575, passi = [];
      const P = (giri, fine, atto, titolo, testo, extra) => { const c = U.conti(p, giri); passi.push(Object.assign({ atto, titolo, testo, hud: [['Tentativi', String(c.tent), 'a'], ['Completate', String(c.fatti), 'c'], ['Iterazione', giri + ' di ' + p.n]], els: U.quadro('b', p, giri, fine, { x: 20, y: 4, w: 820, wc: p.n === 5 ? 150 : 180 }) }, extra)); };
      P(0, false, 0, 'La situazione di partenza', p.caso === 'starve' ? 'Un lettore sta leggendo, e lo scrittore S richiede l’accesso esclusivo. La politica assegna la precedenza ai lettori.' : p.caso === 'live' ? 'A possiede il lock X e richiede Y. B possiede Y e richiede X. La regola impone al thread che riceve un rifiuto di rilasciare e ripetere il tentativo.' : 'A possiede il lock X e attende Y. B possiede Y e attende X. Nessuna regola li obbliga a rilasciare.', {});
      for (let k = 1; k <= p.n; k++) {
        const c = U.conti(p, k);
        const testo = p.caso === 'starve' ? 'Un nuovo lettore entra prima dell’uscita del precedente, che completa la propria lettura ed esce. Una lettura è sempre in corso, e S continua ad attendere.' : p.caso === 'live' ? 'A tenta di acquisire Y, e B tenta di acquisire X. Entrambi ricevono un rifiuto, rilasciano il proprio lock, attendono il medesimo tempo e lo riacquisiscono. La situazione è identica a quella di partenza.' : 'A è bloccato su Y, e B è bloccato su X. Nessuno dei due esegue un’istruzione, e nessun lock è rilasciato.';
        P(k, false, 1, 'Iterazione ' + k, testo, Object.assign({ calc: 'tentativi ' + c.tent + ' · completate ' + c.fatti }, k === 1 ? { chiedi: p.caso === 'starve' ? { d: 'In questa iterazione il sistema ha completato lavoro?', o: ['Sì, una lettura', 'No, ogni attività è sospesa'], g: 0, no: 'Il lettore precedente ha terminato ed è uscito. Soltanto S non avanza.' } : p.caso === 'live' ? { d: 'In questa iterazione A e B hanno eseguito istruzioni?', o: ['Sì, hanno tentato, rilasciato e riacquisito', 'No, erano bloccati'], g: 0, no: 'Nessuno dei due è bloccato. Entrambi eseguono, e tornano al punto di partenza.' } : { d: 'In questa iterazione A e B hanno eseguito istruzioni?', o: ['No, sono entrambi bloccati', 'Sì, hanno ripetuto il tentativo'], g: 0, no: 'Senza una regola che imponga il rilascio, restano bloccati in attesa.' } } : {}));
      }
      const f = U.conti(p, p.n);
      P(p.n, true, 2, 'La diagnosi', 'Dopo ' + p.n + ' iterazioni i tentativi sono ' + f.tent + ' e le operazioni completate ' + f.fatti + '. ' + (p.caso === 'starve' ? 'Il sistema avanza, e S è rimasto escluso per l’intera durata. Se la sequenza continua nel medesimo modo, si tratta di una starvation di S.' : p.caso === 'live' ? 'A e B eseguono senza interruzione e senza alcun completamento. Se la sequenza continua nel medesimo modo, si tratta di un livelock.' : 'Nessuna attività e nessun risultato: si tratta di un deadlock, e nessun evento futuro può modificarlo.'), { calc: 'tentativi ' + f.tent + ' · completate ' + f.fatti, esito: [p.caso === 'starve' ? 'starvation di S' : p.caso === 'live' ? 'livelock di A e B' : 'deadlock di A e B', p.caso === 'starve' ? '' : 'no'] });
      return { passi, esito: f.fatti };
    }
  },
  bilancio: {
    regola: [
      'Deadlock: nessun tentativo e nessun completamento. Livelock: tentativi continui e nessun completamento. Starvation: il sistema completa lavoro, e una richiesta resta sempre in attesa.',
      'Il livelock si interrompe con attese casuali prima di ogni nuovo tentativo. La starvation si evita con una politica che fissa un limite all’attesa.'
    ],
    errori: [
      ['Confondere l’attività con l’avanzamento.', 'In un livelock i thread eseguono senza interruzione, e le operazioni completate restano a zero.'],
      ['Definire deadlock ogni mancanza di risultati.', 'In un deadlock i thread coinvolti sono bloccati. Se eseguono, si tratta di un livelock.'],
      ['Ricavare la diagnosi da poche iterazioni.', 'Una traccia breve mostra il meccanismo. La diagnosi richiede che la sequenza continui a ripetersi.']
    ],
    saFare: ['Contare tentativi e completamenti in una traccia.', 'Distinguere deadlock, livelock e starvation.', 'Associare a ciascuna situazione il suo rimedio.'],
    esercizi: [
      { d: 'In una traccia di 10 secondi due thread compiono 4 000 tentativi di acquisizione e completano 0 operazioni. Quale diagnosi è la più plausibile?', guida: 'Si scelga la risposta.', o: [
        { t: 'Livelock', ok: true, fb: 'Attività continua, e nessun risultato.' },
        { t: 'Deadlock', fb: 'Due thread in deadlock sono bloccati, senza compiere tentativi.' },
        { t: 'Starvation', fb: 'Nella starvation il sistema completa lavoro. In questo caso i completamenti sono zero.' }] },
      { d: 'In una traccia un servizio completa 500 richieste, e una richiesta giunta all’inizio è ancora in attesa al termine. Quale diagnosi è la più plausibile?', guida: 'Si scelga la risposta.', o: [
        { t: 'Starvation', ok: true, fb: 'Il sistema avanza, e una richiesta è preceduta indefinitamente.' },
        { t: 'Livelock', fb: 'In un livelock le operazioni completate resterebbero a zero.' },
        { t: 'Deadlock', fb: 'In un deadlock i thread coinvolti sono bloccati. In questo caso il servizio completa richieste.' }] },
      { d: 'Due thread in livelock ripetono il tentativo ogni 10 ms. In 1 secondo, quanti tentativi compie ciascuno?', segnaposto: 'Un numero', giuste: ['100', 'cento'],
        ok: '1 000 ms diviso 10 ms: 100 tentativi per ciascuno, e nessuna operazione completata.',
        diagnosi: [
          { se: ['200', 'duecento'], msg: 'Duecento sono i tentativi dei due thread insieme. La domanda riguarda ciascuno.' },
          { se: ['10', 'dieci'], msg: 'Dieci millisecondi è l’intervallo fra due tentativi. Un secondo ne contiene molti.' },
          { se: ['0', 'zero'], msg: 'Zero sono le operazioni completate. I tentativi continuano.' }
        ],
        altro: 'Il numero è diverso. Si divida la durata per l’intervallo fra due tentativi.',
        indizi: ['Un secondo sono 1 000 ms.', 'Fra un tentativo e il successivo trascorrono 10 ms.', '1 000 / 10 = 100.'],
        svolgimento: ['Durata: 1 000 ms.', 'Intervallo: 10 ms.', 'Tentativi di ciascun thread: 100.'] }
    ],
    sfida: ['cslez5_7_01_deadlock', 'Stallo, attesa indefinita e livelock']
  }
});
