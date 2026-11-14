'use strict';
SL.unita575 = (() => {
  const conti = (p, giri) => (p.caso === 'starve' ? { tent: giri, fatti: giri } : p.caso === 'live' ? { tent: 2 * giri, fatti: 0 } : { tent: 0, fatti: 0 });
  const RIGHE = { starve: ['LETTORI · entrano e escono a turno', 'SCRITTORE S · chiede l’accesso esclusivo'], live: ['THREAD A · ha X, vuole Y', 'THREAD B · ha Y, vuole X'], dead: ['THREAD A · ha X, aspetta Y', 'THREAD B · ha Y, aspetta X'] };
  const CELLE = { starve: ['ha letto', 'aspetta'], live: ['riprova', 'riprova'], dead: ['fermo', 'fermo'] };
  // giri: giri già avvenuti · n: giri in programma
  const quadro = (pre, p, giri, fine, o) => {
    const el = SL.el, els = [], c = conti(p, giri), passo = o.wc + 6, w3 = (o.w - 20) / 3, st1 = p.caso === 'starve' ? 'on' : p.caso === 'live' ? 'zero' : 'err', st2 = p.caso === 'starve' ? 'err' : st1;
    els.push(el.nota(pre + 't0', o.x, o.y, RIGHE[p.caso][0], 'mono'), el.nota(pre + 't1', o.x, o.y + 84, RIGHE[p.caso][1], 'mono'));
    for (let k = 0; k < p.n; k++) {
      const vis = k < giri, cur = k === giri - 1 && !fine;
      els.push(el.cella(pre + 'a' + k, o.x + k * passo, o.y + 24, o.wc, 32, vis ? CELLE[p.caso][0] : '', vis ? (cur ? 'att' : st1) : '', { gi: 'giro ' + (k + 1), piccola: true }));
      els.push(el.cella(pre + 'b' + k, o.x + k * passo, o.y + 108, o.wc, 32, vis ? CELLE[p.caso][1] : '', vis ? (cur ? 'att' : st2) : '', { piccola: true }));
    }
    els.push(el.box(pre + 'q0', o.x, o.y + 152, w3, 54, 'tentativi', String(c.tent), 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'q1', o.x + w3 + 10, o.y + 152, w3, 54, 'operazioni completate', String(c.fatti), c.fatti ? 'on' : giri ? 'err' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q2', o.x + 2 * (w3 + 10), o.y + 152, w3, 54, 'chi non avanza', giri === 0 ? '·' : p.caso === 'starve' ? 'S' : 'A e B', giri ? 'err' : '', { cls: 'stretta' }));
    return els;
  };
  return { conti, quadro };
})();
SL.registra('5.7.5', {
  titolo: 'Distinguere starvation e livelock nelle tracce',
  obiettivo: 'Obiettivo: distinguere deadlock, livelock e starvation contando, in una traccia, i tentativi compiuti e le operazioni completate.',
  concetti: [['lente', 'Contare tentativi e completamenti'], ['riproduci', 'Muoversi senza avanzare'], ['clock', 'Avanzano tutti, tranne uno']],
  filigrana: ['lente', 'riproduci', 'clock'],
  richiami: {
    carte: [
      { sim: 'clock', da: 'Dall’unità 5.6.4', t: 'La starvation', d: 'Un thread pronto a proseguire viene scavalcato di continuo, mentre il sistema lavora.' },
      { sim: 'stallo', da: 'Dall’unità 5.6.2', t: 'Il deadlock', d: 'Thread fermi che si aspettano a vicenda: nessun evento futuro può sbloccarli.' },
      { sim: 'scudo', da: 'Dall’unità 5.7.2', t: 'Rilasciare e riprovare', d: 'Una regola di prevenzione: chi si vede negare un lock cede quelli che ha, e ricomincia.' }
    ],
    domanda: { d: 'Prima di proseguire: con la precedenza ai lettori, uno scrittore aspetta mentre i lettori continuano ad arrivare. Il sistema sta lavorando?', o: [
      { t: 'Sì: le letture vengono completate, ed è lo scrittore a restare escluso', ok: true, fb: 'È la differenza fra starvation e deadlock.' },
      { t: 'No: è tutto fermo', fb: 'I lettori entrano ed escono. A essere fermo è soltanto lo scrittore.' },
      { t: 'Sì, e lo scrittore entrerà al prossimo turno', fb: 'Finché i lettori arrivano prima che l’ultimo esca, il turno dello scrittore slitta.' }
    ] }
  },
  idea: {
    titolo: 'Tre modi di non arrivare in fondo',
    termini: ['livelock', 'attesa casuale'],
    testo: [
      'Un programma concorrente che ha smesso di produrre risultati può trovarsi in tre situazioni diverse, e dall’esterno si somigliano. Il deadlock lo conosciamo: i thread coinvolti sono bloccati, e il processore per loro non lavora. La starvation l’abbiamo vista con lo scrittore dell’unità 5.6.4: il sistema completa lavoro, e un thread resta sempre indietro. Manca la terza.',
      'Immagina due persone che si incontrano in un corridoio stretto. Ciascuna si sposta di lato per far passare l’altra, e si spostano dalla stessa parte. Allora tornano entrambe indietro, e di nuovo si trovano di fronte. Nessuna delle due è ferma, ed è anzi la loro cortesia a tenerle lì. Questa situazione si chiama [[livelock]]: i thread eseguono, cambiano stato, reagiscono l’uno all’altro, e il lavoro completato resta a zero.',
      'Il livelock nasce spesso da un rimedio al deadlock. Riprendiamo la regola dell’unità 5.7.2: chi si vede negare un lock rilascia quelli che possiede e riprova. A possiede X e chiede Y. B possiede Y e chiede X. Entrambi ricevono un rifiuto, entrambi rilasciano, entrambi aspettano lo stesso tempo, entrambi riprendono il proprio lock e riprovano. La situazione è identica a quella di partenza, e il giro ricomincia.',
      { fig: 'scena', w: 720, h: 212, titolo: 'Tre giri di tentativi, e nessuna operazione completata', nota: 'A e B eseguono e cambiano stato a ogni giro. Il contatore delle operazioni completate resta a zero.', els: SL.unita575.quadro('g', { caso: 'live', n: 3 }, 3, true, { x: 10, y: 4, w: 700, wc: 120 }) },
      'Per distinguere le tre situazioni in una traccia bastano due contatori, osservati per un certo tempo: i tentativi compiuti e le operazioni completate. Nel deadlock sono fermi entrambi. Nel livelock i tentativi crescono e i completamenti restano a zero. Nella starvation i completamenti crescono, e c’è una richiesta che resta in attesa dall’inizio. Una traccia è sempre finita, e mostra il meccanismo: la diagnosi vale nell’ipotesi che la sequenza continui a ripetersi.',
      'Anche i rimedi sono diversi. Il livelock si rompe togliendo la simmetria: ogni thread, prima di riprovare, attende per un tempo scelto a caso, una [[attesa casuale]]. Prima o poi i due tempi differiscono, e uno dei due passa. Contro la starvation serve una politica che dia un limite all’attesa, come l’ordine di arrivo dell’unità 5.6.4 o l’invecchiamento dell’unità 5.3.4.'
    ]
  },
  esperimento: {
    faremo: [
      'Osserveremo una sequenza che si ripete per alcuni giri. Sceglierai la situazione: lettori che scavalcano uno scrittore, due thread che cedono e riprovano insieme, oppure due thread bloccati. Sceglierai anche quanti giri osservare.',
      'A ogni giro aggiorneremo due contatori: i tentativi compiuti e le operazioni completate. Alla fine la coppia dei contatori dirà di quale situazione si tratta.'
    ],
    vedrai: [
      ['riproduci', 'I giri', 'In alto: che cosa fa ciascun partecipante in ogni giro.'],
      ['lente', 'I contatori', 'In basso: tentativi, operazioni completate, e chi non avanza.']
    ]
  },
  lab: {
    titolo: 'Due contatori per una diagnosi',
    scena: { w: 860, h: 216 },
    atti: ['L’inizio', 'I giri', 'La diagnosi'],
    controlli: [
      { id: 'caso', tipo: 'scelta', eti: 'Situazione', opzioni: [['starve', 'i lettori continuano, S aspetta'], ['live', 'A e B cedono e riprovano insieme'], ['dead', 'A e B sono bloccati']], valore: 'live' },
      { id: 'n', tipo: 'scelta', eti: 'Giri osservati', opzioni: [[2, '2'], [3, '3'], [5, '5']], valore: 3 }
    ],
    nota: 'Il numero dei passi dipende dai giri osservati. La diagnosi finale suppone che la sequenza continui allo stesso modo.',
    previsione: {
      domanda: (p) => (p.caso === 'starve' ? 'Uno scrittore S aspetta. A ogni giro un nuovo lettore entra prima che il precedente esca, e il precedente completa la sua lettura.' : p.caso === 'live' ? 'A possiede X e vuole Y. B possiede Y e vuole X. A ogni giro entrambi provano, ricevono un rifiuto, rilasciano e riprendono il proprio lock.' : 'A possiede X e aspetta Y. B possiede Y e aspetta X. Entrambi sono bloccati.') + ' Dopo ' + p.n + ' giri, quante operazioni sono state completate in tutto?',
      opzioni: (p) => [0, p.n, 2 * p.n].map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Le operazioni completate sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.caso === 'starve' ? 'A ogni giro un lettore completa la sua lettura: il sistema lavora, ed è S a restare escluso.' : p.caso === 'live' ? 'I tentativi sono ' + 2 * p.n + ', e nessuno è andato a buon fine. Muoversi e avanzare sono cose diverse.' : 'Due thread bloccati restano senza eseguire: zero tentativi e zero completamenti.'),
    costruisci(p) {
      const U = SL.unita575, passi = [];
      const P = (giri, fine, atto, titolo, testo, extra) => { const c = U.conti(p, giri); passi.push(Object.assign({ atto, titolo, testo, hud: [['Tentativi', String(c.tent), 'a'], ['Completate', String(c.fatti), 'c'], ['Giro', giri + ' di ' + p.n]], els: U.quadro('b', p, giri, fine, { x: 20, y: 4, w: 820, wc: p.n === 5 ? 150 : 180 }) }, extra)); };
      P(0, false, 0, 'La situazione di partenza', p.caso === 'starve' ? 'Un lettore sta leggendo, e lo scrittore S chiede l’accesso esclusivo. La politica dà la precedenza ai lettori.' : p.caso === 'live' ? 'A possiede il lock X e vuole Y. B possiede Y e vuole X. La regola impone a chi riceve un rifiuto di rilasciare e riprovare.' : 'A possiede il lock X e aspetta Y. B possiede Y e aspetta X. Nessuna regola li obbliga a rilasciare.', {});
      for (let k = 1; k <= p.n; k++) {
        const c = U.conti(p, k);
        const testo = p.caso === 'starve' ? 'Un nuovo lettore entra prima che il precedente esca. Il precedente completa la sua lettura ed esce. Una lettura è sempre in corso, e S continua ad aspettare.' : p.caso === 'live' ? 'A prova a prendere Y, e B prova a prendere X. Entrambi ricevono un rifiuto. Entrambi rilasciano il proprio lock, attendono lo stesso tempo, lo riprendono. La situazione è identica a quella di partenza.' : 'A è bloccato su Y, e B è bloccato su X. Nessuno dei due esegue un’istruzione, e nessun lock viene rilasciato.';
        P(k, false, 1, 'Giro ' + k, testo, Object.assign({ calc: 'tentativi ' + c.tent + ' · completate ' + c.fatti }, k === 1 ? { chiedi: p.caso === 'starve' ? { d: 'In questo giro il sistema ha completato del lavoro?', o: ['Sì: una lettura', 'No: è tutto fermo'], g: 0, no: 'Il lettore precedente ha finito ed è uscito. È S a non avanzare.' } : p.caso === 'live' ? { d: 'In questo giro A e B hanno eseguito istruzioni?', o: ['Sì: hanno provato, rilasciato e ripreso', 'No: erano bloccati'], g: 0, no: 'Nessuno dei due è bloccato. Entrambi lavorano, e tornano al punto di partenza.' } : { d: 'In questo giro A e B hanno eseguito istruzioni?', o: ['No: sono entrambi bloccati', 'Sì: hanno riprovato'], g: 0, no: 'Senza una regola che li faccia rilasciare, restano fermi in attesa.' } } : {}));
      }
      const f = U.conti(p, p.n);
      P(p.n, true, 2, 'La diagnosi', 'Dopo ' + p.n + ' giri i tentativi sono ' + f.tent + ' e le operazioni completate ' + f.fatti + '. ' + (p.caso === 'starve' ? 'Il sistema avanza, e S è rimasto escluso per tutto il tempo. Se la sequenza continua così, è una starvation di S.' : p.caso === 'live' ? 'A e B si muovono di continuo senza concludere nulla. Se la sequenza continua così, è un livelock.' : 'Nessuna attività e nessun risultato: è un deadlock, e nessun evento futuro può cambiarlo.'), { calc: 'tentativi ' + f.tent + ' · completate ' + f.fatti, esito: [p.caso === 'starve' ? 'starvation di S' : p.caso === 'live' ? 'livelock di A e B' : 'deadlock di A e B', p.caso === 'starve' ? '' : 'no'] });
      return { passi, esito: f.fatti };
    }
  },
  bilancio: {
    regola: [
      'Deadlock: nessun tentativo e nessun completamento. Livelock: tentativi continui e nessun completamento. Starvation: il sistema completa lavoro, e una richiesta resta sempre in attesa.',
      'Il livelock si rompe con attese casuali prima di riprovare. La starvation si evita con una politica che dà un limite all’attesa.'
    ],
    errori: [
      ['Scambiare l’attività per progresso.', 'In un livelock i thread eseguono senza sosta, e le operazioni completate restano a zero.'],
      ['Chiamare deadlock ogni mancanza di risultati.', 'In un deadlock i thread coinvolti sono bloccati. Se eseguono, è un livelock.'],
      ['Trarre la diagnosi da pochi giri.', 'Una traccia breve mostra il meccanismo. La diagnosi richiede che la sequenza continui a ripetersi.']
    ],
    saFare: ['Contare tentativi e completamenti in una traccia.', 'Distinguere deadlock, livelock e starvation.', 'Associare a ciascuna situazione il suo rimedio.'],
    esercizi: [
      { d: 'In una traccia di 10 secondi due thread compiono 4 000 tentativi di acquisizione e completano 0 operazioni. Quale diagnosi è la più plausibile?', guida: 'Si scelga la risposta.', o: [
        { t: 'Livelock', ok: true, fb: 'Attività continua, e nessun risultato.' },
        { t: 'Deadlock', fb: 'Due thread in deadlock sono bloccati, senza compiere tentativi.' },
        { t: 'Starvation', fb: 'Nella starvation il sistema completa lavoro. Qui i completamenti sono zero.' }] },
      { d: 'In una traccia un servizio completa 500 richieste, e una richiesta arrivata all’inizio è ancora in attesa alla fine. Quale diagnosi è la più plausibile?', guida: 'Si scelga la risposta.', o: [
        { t: 'Starvation', ok: true, fb: 'Il sistema avanza, e una richiesta viene scavalcata di continuo.' },
        { t: 'Livelock', fb: 'In un livelock le operazioni completate resterebbero a zero.' },
        { t: 'Deadlock', fb: 'In un deadlock i thread coinvolti sono fermi. Qui il servizio completa richieste.' }] },
      { d: 'Due thread in livelock riprovano ogni 10 ms. In 1 secondo, quanti tentativi compie ciascuno?', segnaposto: 'Un numero', giuste: ['100', 'cento'],
        ok: '1 000 ms diviso 10 ms: 100 tentativi a testa, e nessuna operazione completata.',
        diagnosi: [
          { se: ['200', 'duecento'], msg: 'Duecento sono i tentativi dei due thread insieme. La domanda riguarda ciascuno.' },
          { se: ['10', 'dieci'], msg: 'Dieci millisecondi è l’intervallo fra due tentativi. Un secondo ne contiene molti.' },
          { se: ['0', 'zero'], msg: 'Zero sono le operazioni completate. I tentativi continuano.' }
        ],
        altro: 'Il numero è diverso. Si divida la durata per l’intervallo fra due tentativi.',
        indizi: ['Un secondo sono 1 000 ms.', 'Fra un tentativo e il successivo passano 10 ms.', '1 000 / 10 = 100.'],
        svolgimento: ['Durata: 1 000 ms.', 'Intervallo: 10 ms.', 'Tentativi di ciascun thread: 100.'] }
    ],
    sfida: ['cslez5_7_01_deadlock', 'Stallo, attesa indefinita e livelock']
  }
});
