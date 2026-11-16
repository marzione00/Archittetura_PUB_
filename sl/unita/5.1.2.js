'use strict';
SL.unita512 = (() => {
  const ESITO = { io: 'bloccato', timer: 'pronto', fine: 'terminato' };
  // racconto: elenco di quadri { run, pronti[], disco[], usciti[], evento }
  const quadri = (p) => {
    const altri = p.pronti === 1 ? ['B'] : ['B', 'C'], Q = [{ run: 'A', pronti: altri.slice(), disco: [], usciti: [], ev: '·' }];
    if (p.ev === 'io') { Q.push({ run: '', pronti: altri.slice(), disco: ['A'], usciti: [], ev: 'A chiede il disco' }); Q.push({ run: 'B', pronti: altri.slice(1), disco: ['A'], usciti: [], ev: 'scelta del dispatcher' }); Q.push({ run: 'B', pronti: altri.slice(1).concat(['A']), disco: [], usciti: [], ev: 'il disco ha finito' }); }
    else if (p.ev === 'timer') { Q.push({ run: '', pronti: altri.concat(['A']), disco: [], usciti: [], ev: 'time slice scaduto' }); Q.push({ run: 'B', pronti: altri.slice(1).concat(['A']), disco: [], usciti: [], ev: 'scelta del dispatcher' }); }
    else { Q.push({ run: '', pronti: altri.slice(), disco: [], usciti: ['A'], ev: 'A ha finito' }); Q.push({ run: 'B', pronti: altri.slice(1), disco: [], usciti: ['A'], ev: 'scelta del dispatcher' }); }
    return Q;
  };
  const scena = (pre, q, evid, o) => {
    const el = SL.el, els = [], fila = (id, x, tit, lista, st) => { els.push(el.nota(pre + id + 't', x, o.y, tit, 'mono')); for (let k = 0; k < 3; k++) els.push(el.cella(pre + id + k, x + k * (o.wc + 4), o.y + 24, o.wc, 36, lista[k] || '·', lista[k] ? (lista[k] === 'A' && evid ? 'att' : st) : '', { piccola: true })); };
    els.push(el.nota(pre + 'rt', o.x, o.y, 'IN ESECUZIONE', 'mono'), el.cella(pre + 'r', o.x, o.y + 24, o.wr, 36, q.run || '·', q.run ? (q.run === 'A' && evid ? 'att' : 'on') : '', { piccola: true }));
    fila('p', o.x + o.wr + o.gap, 'PRONTI · in coda', q.pronti, 'on');
    fila('d', o.x + o.wr + 2 * o.gap + 3 * (o.wc + 4), 'BLOCCATI · attendono il disco', q.disco, 'zero');
    els.push(el.box(pre + 'e', o.x, o.y + 80, o.w * 0.5 - 6, 54, 'evento', q.ev, q.ev === '·' ? '' : 'att', { cls: 'stretta' }), el.box(pre + 'u', o.x + o.w * 0.5 + 6, o.y + 80, o.w * 0.5 - 6, 54, 'terminati', q.usciti.length ? q.usciti.join(', ') : 'nessuno', q.usciti.length ? 'off' : '', { cls: 'stretta' }));
    return els;
  };
  return { ESITO, quadri, scena };
})();
SL.registra('5.1.2', {
  titolo: 'Dall’esecuzione agli stati di pronto e bloccato',
  obiettivo: 'Obiettivo: indicare lo stato in cui si trova un processo dopo un evento, e la condizione che gli manca per riprendere l’esecuzione.',
  concetti: [['process', 'Un processo in esecuzione, gli altri in attesa'], ['coda', 'Pronto, in attesa del solo turno'], ['disco', 'Bloccato, in attesa di un evento']],
  filigrana: ['process', 'coda', 'clock'],
  richiami: {
    carte: [
      { sim: 'process', da: 'Dall’unità 4.2.4', t: 'La chiamata bloccante', d: 'Un processo che richiede dati non ancora disponibili è sospeso.' },
      { sim: 'process', da: 'Dall’unità 4.2.4', t: 'Lo scheduler', d: 'La parte del kernel che stabilisce quale processo riceve il processore.' },
      { sim: 'interrupt', da: 'Dall’unità 4.1.1', t: 'L’interrupt del timer', d: 'Un segnale periodico che riporta il controllo al kernel.' }
    ],
    domanda: { d: 'Prima di proseguire: un processo attende dati dal disco. L’assegnazione del processore gli sarebbe utile?', o: [
      { t: 'No, finché i dati mancano non ha istruzioni da eseguire', ok: true, fb: 'Al processo manca un evento, che il processore non può fornire.' },
      { t: 'Sì, terminerebbe prima', fb: 'Senza i dati il processo non può proseguire, con o senza processore.' },
      { t: 'Sì, soltanto in modo kernel', fb: 'Il modo di esecuzione lascia invariata l’assenza dei dati.' }
    ] }
  },
  idea: {
    titolo: 'La condizione che manca a un processo per eseguire',
    termini: ['in esecuzione (stato)', 'pronto (stato)', 'coda dei pronti', 'bloccato (stato)', 'time slice', 'dispatcher'],
    testo: [
      'Un processore esegue un processo per volta, e i processi sono numerosi. In ogni istante, pertanto, quasi tutti sono inattivi. Il kernel distingue le ragioni dell’inattività, e assegna a ogni processo uno stato. Il processo che in un dato istante impiega il processore è [[in esecuzione (stato)|in esecuzione]].',
      'Un processo [[pronto (stato)|pronto]] dispone di tutto quanto occorre per eseguire l’istruzione successiva, e attende soltanto il proprio turno. I processi pronti sono raccolti in un elenco ordinato, la [[coda dei pronti]]. Un processo [[bloccato (stato)|bloccato]] attende invece un evento esterno, per esempio la risposta di un disco. L’assegnazione del processore gli sarebbe inutile, e per tale ragione il kernel lo esclude dalla coda dei pronti finché l’evento non si verifica.',
      { fig: 'scena', w: 720, h: 138, titolo: 'A ha richiesto una lettura dal disco', nota: 'A è bloccato. Il processore è passato a B, il primo della coda dei pronti.', els: SL.unita512.scena('g', SL.unita512.quadri({ ev: 'io', pronti: 2 })[2], true, { x: 10, y: 0, w: 700, wr: 110, wc: 80, gap: 30 }) },
      'Un processo lascia il processore in tre modi. Può richiedere un’operazione di lunga durata, come una lettura dal disco, e diviene bloccato. Può esaurire il [[time slice]], detto anche quanto (quantum), cioè la durata massima di un turno, misurata da un timer: in tal caso torna pronto, all’ultima posizione della coda, poiché ha ancora istruzioni da eseguire. Può infine terminare. In tutti i casi il processore resta libero, e il [[dispatcher]], il meccanismo del kernel che consegna il processore al processo selezionato, lo assegna al primo della coda.',
      'Quando il disco risponde, il processo bloccato torna pronto, ed entra nella coda al pari degli altri: la ripresa dell’esecuzione avviene soltanto in seguito. La disponibilità del dato e la disponibilità del processore sono due condizioni distinte: la prima fa uscire il processo dallo stato bloccato, la seconda dipende dalla scelta del dispatcher.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processo A è in esecuzione, e altri processi sono pronti. I controlli fissano l’evento che riguarda A: la richiesta di una lettura dal disco, l’esaurimento del time slice, oppure la terminazione.',
      'L’esperimento segue A da uno stato all’altro, e mostra il processo che riceve il processore. È istruttivo confrontare la lettura dal disco con la scadenza del time slice: in entrambi i casi il processore passa a B, mentre A giunge a stati diversi.'
    ],
    vedrai: [
      ['process', 'In esecuzione', 'A sinistra: il processo che impiega il processore.'],
      ['coda', 'I pronti', 'Al centro: la coda dei processi in attesa del turno. Il primo a sinistra è il successivo.'],
      ['disco', 'I bloccati', 'A destra: i processi in attesa della risposta del disco.']
    ]
  },
  lab: {
    titolo: 'L’evento che riguarda A',
    scena: { w: 860, h: 140 },
    atti: ['L’inizio', 'L’evento', 'Il nuovo turno', 'Il seguito'],
    controlli: [
      { id: 'ev', tipo: 'scelta', eti: 'Evento', opzioni: [['io', 'A richiede una lettura dal disco'], ['timer', 'scade il time slice di A'], ['fine', 'A termina']], valore: 'io' },
      { id: 'pronti', tipo: 'scelta', eti: 'Processi pronti', opzioni: [[1, 'B'], [2, 'B e C']], valore: 2 }
    ],
    nota: 'I passi sono quattro con la lettura dal disco, tre negli altri casi.',
    previsione: {
      domanda: (p) => 'Il processo A è in esecuzione. ' + (p.ev === 'io' ? 'Richiede al kernel una lettura dal disco, un’operazione di lunga durata.' : p.ev === 'timer' ? 'Il timer segnala che il suo time slice è scaduto.' : 'Esegue la sua ultima istruzione e termina.') + ' In quale stato passa A?',
      opzioni: () => [['pronto', 'Pronto'], ['bloccato', 'Bloccato'], ['terminato', 'Terminato']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava: ' + pred + '. A diviene ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.ev === 'io' ? 'Ad A manca un evento, la risposta del disco: il processore gli sarebbe inutile.' : p.ev === 'timer' ? 'A potrebbe proseguire immediatamente. Gli manca soltanto il turno, e torna in coda.' : 'A non ha più istruzioni da eseguire, e lascia il sistema.'),
    costruisci(p) {
      const U = SL.unita512, Q = U.quadri(p), passi = [], altri = p.pronti === 1 ? 'B' : 'B e C';
      const hud = (q) => [['In esecuzione', q.run || 'nessuno', 'a'], ['Pronti', q.pronti.join(', ') || 'nessuno'], ['Stato di A', q.run === 'A' ? 'in esecuzione' : q.disco.includes('A') ? 'bloccato' : q.usciti.includes('A') ? 'terminato' : 'pronto', 'c']];
      const P = (k, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(Q[k]), els: U.scena('q', Q[k], true, { x: 20, y: 0, w: 820, wr: 130, wc: 96, gap: 40 }) }, extra));

      P(0, 0, 'A è in esecuzione', 'Il processore sta eseguendo A. ' + (p.pronti === 1 ? 'Il processo B è pronto' : 'I processi B e C sono pronti') + ', in coda per il turno successivo. Nessun processo attende il disco.', {});
      if (p.ev === 'io') {
        P(1, 1, 'A richiede una lettura dal disco', 'A necessita di dati che si trovano sul disco, e li richiede al kernel. La risposta richiederà millisecondi, un tempo molto lungo per il processore. Il kernel contrassegna A come bloccato e lo colloca fra i processi che attendono il disco.', { esito: ['A bloccato', ''] });
        P(2, 2, 'Il dispatcher seleziona B', 'Il processore è libero. Il dispatcher preleva il primo della coda dei pronti, B, e gli consegna il processore.' + (p.pronti === 2 ? ' C avanza di una posizione.' : ' La coda dei pronti resta vuota.'), { chiedi: { d: 'Se il disco rispondesse in questo istante, A riprenderebbe immediatamente l’esecuzione?', o: ['Sì, i dati sono disponibili', 'No, tornerebbe pronto, in coda'], g: 1, no: 'Il processore è occupato da B. A deve attendere il proprio turno fra i pronti.' } });
        P(3, 3, 'Il disco risponde', 'Il disco segnala il termine dell’operazione. Ad A non manca più alcuna condizione, e il kernel lo sposta fra i pronti, all’ultima posizione della coda. B prosegue il proprio turno: la risposta del disco gli lascia il processore.', { esito: ['A bloccato, poi pronto', ''] });
      } else if (p.ev === 'timer') {
        P(1, 1, 'Il time slice è scaduto', 'Il timer interrompe A, che ha impiegato l’intero tempo del proprio turno. A ha ancora istruzioni da eseguire, senza alcun evento da attendere. Il kernel lo ricolloca fra i pronti, all’ultima posizione della coda, dopo ' + altri + '.', { esito: ['A pronto', ''] });
        P(2, 2, 'Il dispatcher seleziona B', 'Il dispatcher preleva il primo della coda, B, e gli consegna il processore. A sarà eseguito di nuovo quando avrà raggiunto la prima posizione della coda.', { esito: ['A pronto', ''], chiedi: { d: 'Quale condizione manca ad A per riprendere l’esecuzione?', o: ['La risposta di un dispositivo', 'Soltanto il proprio turno'], g: 1, no: 'A è stato interrotto dal timer, senza avere rivolto richieste ad alcun dispositivo.' } });
      } else {
        P(1, 1, 'A termina', 'A ha eseguito la sua ultima istruzione. Esso è escluso sia dai pronti sia dai bloccati: il kernel lo rimuove dalle code e ne recupera le risorse.', { esito: ['A terminato', ''] });
        P(2, 2, 'Il dispatcher seleziona B', 'Il processore è libero, e il dispatcher lo consegna a B, il primo della coda dei pronti.' + (p.pronti === 2 ? ' C avanza di una posizione.' : ''), { esito: ['A terminato', ''] });
      }
      return { passi, esito: U.ESITO[p.ev] };
    }
  },
  bilancio: {
    regola: [
      'Un processo in esecuzione impiega il processore. A un processo pronto manca soltanto il turno, a un processo bloccato manca un evento esterno.',
      'Un processo bloccato, quando l’evento si verifica, torna pronto. Il passaggio all’esecuzione dipende da una scelta successiva del dispatcher.'
    ],
    errori: [
      ['Considerare bloccato un processo a cui è scaduto il time slice.', 'Tale processo potrebbe proseguire immediatamente: è pronto.'],
      ['Considerare in esecuzione un processo all’arrivo del dato che attendeva.', 'Il dato lo rende pronto. Per eseguire gli occorre anche il processore.'],
      ['Collocare un processo bloccato nella coda dei pronti.', 'Il dispatcher selezionerebbe un processo privo di istruzioni eseguibili.']
    ],
    saFare: ['Riconoscere lo stato di un processo.', 'Indicare in quale stato lo porta un evento.', 'Separare l’arrivo del dato dall’assegnazione del processore.'],
    esercizi: [
      { d: 'Un processo è in esecuzione quando il timer segnala la fine del suo time slice. Il processo ha ancora calcoli da svolgere. In quale stato passa?', guida: 'Si scelga la risposta.', o: [
        { t: 'Pronto', ok: true, fb: 'Gli manca soltanto un nuovo turno.' },
        { t: 'Bloccato', fb: 'È bloccato un processo che attende un evento. Questo processo potrebbe proseguire immediatamente.' },
        { t: 'Terminato', fb: 'Il processo ha ancora calcoli da svolgere.' }] },
      { d: 'Un processo bloccato attendeva dati dalla rete. I dati giungono mentre un altro processo è in esecuzione. Che cosa accade al primo?', guida: 'Si scelga la risposta.', o: [
        { t: 'Diviene pronto e attende il proprio turno', ok: true, fb: 'L’evento si è verificato, e ora gli manca soltanto il processore.' },
        { t: 'Riprende immediatamente l’esecuzione', fb: 'Il processore è occupato, e occorre una scelta del dispatcher.' },
        { t: 'Resta bloccato fino al time slice successivo', fb: 'L’evento che attendeva si è verificato, e viene meno la ragione dello stato bloccato.' }] },
      { d: 'La coda dei pronti contiene, nell’ordine, B, C e D. Il processo A, in esecuzione, esaurisce il time slice. Il dispatcher seleziona sempre il primo della coda. Dopo quanti altri turni A riceverà di nuovo il processore?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'A passa all’ultima posizione della coda: B, C, D, A. Prima di A sono eseguiti tre processi.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'I processi che precedono A sono tre: B, C e D.' },
          { se: ['0', 'zero', '1', 'uno'], msg: 'A torna all’ultima posizione della coda, dopo B, C e D.' }
        ],
        altro: 'Il numero è diverso. Si scriva la coda dopo il ritorno di A e si contino i processi che lo precedono.',
        indizi: ['A torna pronto, all’ultima posizione.', 'La coda diviene B, C, D, A.', 'A è preceduto da tre processi.'],
        svolgimento: ['Coda dopo la scadenza: B, C, D, A.', 'Turni prima di A: 3.'] }
    ],
    sfida: ['cslez5_1_02_processes', 'Transizioni fra gli stati di un processo']
  }
});
