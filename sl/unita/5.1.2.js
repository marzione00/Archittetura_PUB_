'use strict';
SL.unita512 = (() => {
  const ESITO = { io: 'bloccato', timer: 'pronto', fine: 'terminato' };
  // racconto: elenco di quadri { run, pronti[], disco[], usciti[], evento }
  const quadri = (p) => {
    const altri = p.pronti === 1 ? ['B'] : ['B', 'C'], Q = [{ run: 'A', pronti: altri.slice(), disco: [], usciti: [], ev: '·' }];
    if (p.ev === 'io') { Q.push({ run: '', pronti: altri.slice(), disco: ['A'], usciti: [], ev: 'A chiede il disco' }); Q.push({ run: 'B', pronti: altri.slice(1), disco: ['A'], usciti: [], ev: 'scelta del dispatcher' }); Q.push({ run: 'B', pronti: altri.slice(1).concat(['A']), disco: [], usciti: [], ev: 'il disco ha finito' }); }
    else if (p.ev === 'timer') { Q.push({ run: '', pronti: altri.concat(['A']), disco: [], usciti: [], ev: 'quanto scaduto' }); Q.push({ run: 'B', pronti: altri.slice(1).concat(['A']), disco: [], usciti: [], ev: 'scelta del dispatcher' }); }
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
  obiettivo: 'Obiettivo: dire in quale stato si trova un processo dopo un evento, e che cosa gli manca per tornare a eseguire.',
  concetti: [['process', 'Uno esegue, gli altri no'], ['coda', 'Pronto: manca soltanto il turno'], ['disco', 'Bloccato: manca un evento']],
  filigrana: ['process', 'coda', 'clock'],
  richiami: {
    carte: [
      { sim: 'process', da: 'Dall’unità 4.2.4', t: 'La chiamata bloccante', d: 'Un processo che chiede dati non ancora disponibili viene sospeso.' },
      { sim: 'process', da: 'Dall’unità 4.2.4', t: 'Lo scheduler', d: 'La parte del kernel che decide a chi tocca il processore.' },
      { sim: 'interrupt', da: 'Dall’unità 4.1.1', t: 'L’interrupt del timer', d: 'Un segnale periodico che riporta il controllo al kernel.' }
    ],
    domanda: { d: 'Prima di proseguire: un processo attende dati dal disco. Dargli il processore gli servirebbe?', o: [
      { t: 'No: finché i dati mancano non ha istruzioni da eseguire', ok: true, fb: 'Gli manca un evento, e il processore non può procurarglielo.' },
      { t: 'Sì: finirebbe prima', fb: 'Senza i dati il processo non può proseguire, con o senza processore.' },
      { t: 'Sì, ma soltanto in modo kernel', fb: 'Il modo di esecuzione non cambia il fatto che i dati manchino.' }
    ] }
  },
  idea: {
    titolo: 'Che cosa manca a un processo per eseguire',
    termini: ['in esecuzione (stato)', 'pronto (stato)', 'coda dei pronti', 'bloccato (stato)', 'quanto di tempo', 'dispatcher'],
    testo: [
      'Un processore esegue un processo per volta, e i processi sono molti. In ogni istante, quindi, quasi tutti sono fermi. Il kernel distingue con cura perché sono fermi, e a ogni processo assegna uno stato. Il processo che in questo momento usa il processore è [[in esecuzione (stato)|in esecuzione]].',
      'Un processo [[pronto (stato)|pronto]] ha tutto ciò che gli serve per eseguire la prossima istruzione, e aspetta soltanto il proprio turno. I processi pronti stanno in un elenco ordinato, la [[coda dei pronti]]. Un processo [[bloccato (stato)|bloccato]] aspetta invece un evento esterno, per esempio la risposta di un disco. Dargli il processore sarebbe inutile, e per questo il kernel lo tiene fuori dalla coda dei pronti finché l’evento non arriva.',
      { fig: 'scena', w: 720, h: 138, titolo: 'A ha chiesto una lettura dal disco', nota: 'A è bloccato. Il processore è passato a B, il primo della coda dei pronti.', els: SL.unita512.scena('g', SL.unita512.quadri({ ev: 'io', pronti: 2 })[2], true, { x: 10, y: 0, w: 700, wr: 110, wc: 80, gap: 30 }) },
      'Un processo lascia il processore in tre modi. Può chiedere qualcosa che richiede tempo, come una lettura dal disco, e diventa bloccato. Può esaurire il [[quanto di tempo]], cioè la durata massima di un turno, misurata da un timer: allora torna pronto, in fondo alla coda, perché avrebbe ancora lavoro da fare. Oppure può terminare. In tutti i casi il processore resta libero, e il [[dispatcher]], il meccanismo del kernel che consegna il processore al processo scelto, lo assegna al primo della coda.',
      'Quando il disco risponde, il processo bloccato non riprende subito a eseguire. Torna pronto, e si mette in coda come gli altri. La disponibilità del dato e la disponibilità del processore sono due condizioni distinte: la prima toglie il processo dallo stato bloccato, la seconda dipende dalla scelta del dispatcher.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processo A è in esecuzione, e altri processi sono pronti. Sceglierai che cosa accade ad A: chiede una lettura dal disco, esaurisce il quanto, oppure termina.',
      'Seguiremo A da uno stato all’altro, e vedremo a chi passa il processore. Confronta la lettura dal disco con la scadenza del quanto: in entrambi i casi il processore va a B, ma A finisce in posti diversi.'
    ],
    vedrai: [
      ['process', 'In esecuzione', 'A sinistra: il processo che usa il processore.'],
      ['coda', 'I pronti', 'Al centro: la coda dei processi che aspettano il turno. Il primo a sinistra è il prossimo.'],
      ['disco', 'I bloccati', 'A destra: i processi che aspettano la risposta del disco.']
    ]
  },
  lab: {
    titolo: 'Che cosa succede ad A',
    scena: { w: 860, h: 140 },
    atti: ['L’inizio', 'L’evento', 'Il nuovo turno', 'Il seguito'],
    controlli: [
      { id: 'ev', tipo: 'scelta', eti: 'Evento', opzioni: [['io', 'A chiede una lettura dal disco'], ['timer', 'scade il quanto di A'], ['fine', 'A termina']], valore: 'io' },
      { id: 'pronti', tipo: 'scelta', eti: 'Processi pronti', opzioni: [[1, 'B'], [2, 'B e C']], valore: 2 }
    ],
    nota: 'I passi sono quattro con la lettura dal disco, tre negli altri casi.',
    previsione: {
      domanda: (p) => 'Il processo A è in esecuzione. ' + (p.ev === 'io' ? 'Chiede al kernel una lettura dal disco, che richiederà tempo.' : p.ev === 'timer' ? 'Il timer segnala che il suo quanto di tempo è scaduto.' : 'Esegue la sua ultima istruzione e termina.') + ' In quale stato passa A?',
      opzioni: () => [['pronto', 'Pronto'], ['bloccato', 'Bloccato'], ['terminato', 'Terminato']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava: ' + pred + '. A diventa ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.ev === 'io' ? 'Ad A manca un evento, la risposta del disco: avere il processore non gli servirebbe.' : p.ev === 'timer' ? 'A potrebbe proseguire subito. Gli manca soltanto il turno, e torna in coda.' : 'A non ha più istruzioni da eseguire, e lascia il sistema.'),
    costruisci(p) {
      const U = SL.unita512, Q = U.quadri(p), passi = [], altri = p.pronti === 1 ? 'B' : 'B e C';
      const hud = (q) => [['In esecuzione', q.run || 'nessuno', 'a'], ['Pronti', q.pronti.join(', ') || 'nessuno'], ['Stato di A', q.run === 'A' ? 'in esecuzione' : q.disco.includes('A') ? 'bloccato' : q.usciti.includes('A') ? 'terminato' : 'pronto', 'c']];
      const P = (k, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(Q[k]), els: U.scena('q', Q[k], true, { x: 20, y: 0, w: 820, wr: 130, wc: 96, gap: 40 }) }, extra));

      P(0, 0, 'A è in esecuzione', 'Il processore sta eseguendo A. ' + (p.pronti === 1 ? 'Il processo B è pronto' : 'I processi B e C sono pronti') + ', in coda per il prossimo turno. Nessuno attende il disco.', {});
      if (p.ev === 'io') {
        P(1, 1, 'A chiede una lettura dal disco', 'A ha bisogno di dati che stanno sul disco, e li chiede al kernel. La risposta richiederà millisecondi, un tempo lunghissimo per il processore. Il kernel segna A come bloccato e lo mette fra chi attende il disco.', { esito: ['A bloccato', ''] });
        P(2, 2, 'Il dispatcher sceglie B', 'Il processore è libero. Il dispatcher prende il primo della coda dei pronti, B, e gli consegna il processore.' + (p.pronti === 2 ? ' C avanza di un posto.' : ' La coda dei pronti resta vuota.'), { chiedi: { d: 'Se il disco rispondesse adesso, A riprenderebbe subito a eseguire?', o: ['Sì: i dati sono arrivati', 'No: tornerebbe pronto, in coda'], g: 1, no: 'Il processore è occupato da B. A deve attendere il proprio turno fra i pronti.' } });
        P(3, 3, 'Il disco risponde', 'Il disco segnala di avere finito. Ad A non manca più nulla, e il kernel lo sposta fra i pronti, in fondo alla coda. B continua il proprio turno: la risposta del disco non gli toglie il processore.', { esito: ['A bloccato, poi pronto', ''] });
      } else if (p.ev === 'timer') {
        P(1, 1, 'Il quanto è scaduto', 'Il timer interrompe A: ha usato tutto il tempo del suo turno. A avrebbe ancora istruzioni da eseguire, e non aspetta alcun evento. Il kernel lo rimette fra i pronti, in fondo alla coda, dietro a ' + altri + '.', { esito: ['A pronto', ''] });
        P(2, 2, 'Il dispatcher sceglie B', 'Il dispatcher prende il primo della coda, B, e gli consegna il processore. A eseguirà di nuovo quando arriverà in testa alla coda.', { esito: ['A pronto', ''], chiedi: { d: 'Che cosa manca ad A per tornare a eseguire?', o: ['La risposta di un dispositivo', 'Soltanto il proprio turno'], g: 1, no: 'A non ha chiesto nulla a nessun dispositivo. È stato interrotto dal timer.' } });
      } else {
        P(1, 1, 'A termina', 'A ha eseguito la sua ultima istruzione. Resta fuori sia dai pronti sia dai bloccati: il kernel lo toglie dalle code e recupera le sue risorse.', { esito: ['A terminato', ''] });
        P(2, 2, 'Il dispatcher sceglie B', 'Il processore è libero, e il dispatcher lo consegna a B, il primo della coda dei pronti.' + (p.pronti === 2 ? ' C avanza di un posto.' : ''), { esito: ['A terminato', ''] });
      }
      return { passi, esito: U.ESITO[p.ev] };
    }
  },
  bilancio: {
    regola: [
      'In esecuzione: usa il processore. Pronto: gli manca soltanto il turno. Bloccato: gli manca un evento esterno.',
      'Un processo bloccato, quando l’evento arriva, torna pronto. A metterlo in esecuzione è una scelta successiva del dispatcher.'
    ],
    errori: [
      ['Considerare bloccato un processo a cui è scaduto il quanto.', 'Quel processo potrebbe proseguire subito: è pronto.'],
      ['Far ripartire un processo appena arriva il dato che aspettava.', 'Il dato lo rende pronto. Per eseguire gli serve anche il processore.'],
      ['Mettere un processo bloccato nella coda dei pronti.', 'Il dispatcher sceglierebbe un processo che non può fare nulla.']
    ],
    saFare: ['Riconoscere lo stato di un processo.', 'Indicare in quale stato lo porta un evento.', 'Separare l’arrivo del dato dall’assegnazione del processore.'],
    esercizi: [
      { d: 'Un processo è in esecuzione quando il timer segnala la fine del suo quanto. Il processo ha ancora calcoli da fare. In quale stato passa?', guida: 'Si scelga la risposta.', o: [
        { t: 'Pronto', ok: true, fb: 'Gli manca soltanto un nuovo turno.' },
        { t: 'Bloccato', fb: 'Bloccato è chi aspetta un evento. Questo processo potrebbe proseguire subito.' },
        { t: 'Terminato', fb: 'Il processo ha ancora lavoro da fare.' }] },
      { d: 'Un processo bloccato aspettava dati dalla rete. I dati arrivano mentre un altro processo sta eseguendo. Che cosa accade al primo?', guida: 'Si scelga la risposta.', o: [
        { t: 'Diventa pronto e attende il proprio turno', ok: true, fb: 'L’evento è arrivato, e ora gli manca soltanto il processore.' },
        { t: 'Riprende subito a eseguire', fb: 'Il processore è occupato. Serve una scelta del dispatcher.' },
        { t: 'Resta bloccato fino al prossimo quanto', fb: 'L’evento che aspettava è arrivato: non ha più motivo di restare bloccato.' }] },
      { d: 'La coda dei pronti contiene, nell’ordine, B, C e D. Il processo A, in esecuzione, esaurisce il quanto. Il dispatcher sceglie sempre il primo della coda. Dopo quanti altri turni toccherà di nuovo ad A?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'A va in fondo alla coda: B, C, D, A. Prima di lui eseguono tre processi.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'I processi davanti ad A sono tre: B, C e D.' },
          { se: ['0', 'zero', '1', 'uno'], msg: 'A torna in fondo alla coda, dietro a B, C e D.' }
        ],
        altro: 'Il numero è diverso. Si scriva la coda dopo il ritorno di A e si conti chi lo precede.',
        indizi: ['A torna pronto, in fondo.', 'La coda diventa B, C, D, A.', 'Davanti ad A ci sono tre processi.'],
        svolgimento: ['Coda dopo la scadenza: B, C, D, A.', 'Turni prima di A: 3.'] }
    ],
    sfida: ['cslez5_1_02_processes', 'Transizioni fra gli stati di un processo']
  }
});
