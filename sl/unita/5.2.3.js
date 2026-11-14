'use strict';
SL.unita523 = (() => {
  const aperti = (p) => (p.caso === 'ok' && p.marca === 'si' ? 'solo3' : 'tutti');
  // fase: 0 la preparazione · 1 la marcatura · 2 la chiamata · 3 la ricerca · 4 l'immagine · 5 chi esegue
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], ok = p.caso === 'ok', marc = p.marca === 'si', w3 = (o.w - 20) / 3, fatto = ok && f >= 4, chiuso4 = fatto && marc;
    els.push(el.box(pre + 'a', o.x, o.y, w3, o.h, 'processo · PID 71', fatto ? 'programma: analisi' : 'programma: avvio', f === 4 && ok ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'b', o.x + w3 + 10, o.y, w3, o.h, 'contatore di programma', fatto ? 'ingresso di analisi' : f >= 4 ? 'ramo di errore' : 'dentro avvio', f >= 4 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'c', o.x + 2 * (w3 + 10), o.y, w3, o.h, 'execve restituisce', f < 3 ? '·' : ok ? 'non ritorna' : '−1 · errno ENOENT', f === 3 ? (ok ? 'att' : 'err') : f > 3 ? (ok ? 'on' : 'err') : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'd', o.x, o.y + o.h + 14, w3, o.h, 'fd 3 · file di lavoro', 'aperto', 'on', { cls: 'stretta' }),
      el.box(pre + 'e', o.x + w3 + 10, o.y + o.h + 14, w3, o.h, 'fd 4 · file temporaneo', chiuso4 ? 'chiuso' : marc && f >= 1 ? 'aperto · close-on-exec' : 'aperto', chiuso4 ? 'err' : f === 1 && marc ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'g', o.x + 2 * (w3 + 10), o.y + o.h + 14, w3, o.h, 'percorso richiesto', ok ? '/bin/analisi · esiste' : '/bin/analisy · assente', f === 3 ? (ok ? 'att' : 'err') : 'on', { cls: 'stretta' }));
    return els;
  };
  return { aperti, quadro };
})();
SL.registra('5.2.3', {
  titolo: 'Sostituire il programma di un processo',
  obiettivo: 'Obiettivo: dire che cosa cambia e che cosa resta quando un processo carica un nuovo programma, e che cosa accade se il caricamento fallisce.',
  concetti: [['process', 'Stesso processo, altro programma'], ['file', 'I file aperti sopravvivono'], ['scudo', 'Tranne quelli marcati']],
  filigrana: ['process', 'file', 'fork'],
  richiami: {
    carte: [
      { sim: 'process', da: 'Dall’unità 2.5.4', t: 'execve', d: 'La chiamata di sistema che carica un eseguibile nel processo che la invoca.' },
      { sim: 'process', da: 'Dall’unità 2.5.4', t: 'L’immagine di processo', d: 'Le istruzioni e i dati di un programma, installati nella memoria del processo.' },
      { sim: 'file', da: 'Dall’unità 2.5.2', t: 'errno', d: 'La variabile in cui si legge la causa di una chiamata fallita.' }
    ],
    domanda: { d: 'Prima di proseguire: nell’unità precedente il figlio della shell «diventa» il programma echo. Il suo PID cambia?', o: [
      { t: 'No: il processo è lo stesso, cambia il programma', ok: true, fb: 'Caricare un programma sostituisce il contenuto del processo, e ne conserva l’identità.' },
      { t: 'Sì: ogni programma ha il suo PID', fb: 'Il PID appartiene al processo. Un processo può cambiare programma.' },
      { t: 'Sì: nasce un processo nuovo', fb: 'I processi nuovi nascono con fork. Qui il processo resta quello.' }
    ] }
  },
  idea: {
    titolo: 'Cambiare programma senza cambiare identità',
    termini: ['close-on-exec'],
    testo: [
      'fork crea un processo e non sa caricare programmi. execve fa l’opposto: carica un programma e non crea nulla. Il processo che la chiama butta via la propria immagine, cioè le istruzioni e i dati che aveva in memoria, e al suo posto il kernel installa quella del nuovo eseguibile. L’esecuzione riparte dal punto di ingresso del nuovo programma, la sua prima istruzione. Del programma precedente non resta una riga.',
      'Resta invece il processo. Il PID è lo stesso, il padre è lo stesso, e soprattutto restano aperti i file che il processo aveva aperto. È ciò che ha reso possibile la redirezione: il descrittore 1 sistemato dal figlio della shell è arrivato intatto al programma echo.',
      { fig: 'scena', w: 720, h: 138, titolo: 'Dopo una execve riuscita', nota: 'Il processo 71 esegue ora analisi. Il descrittore 3 è ancora aperto, il 4 era marcato ed è stato chiuso.', els: SL.unita523.quadro('g', { caso: 'ok', marca: 'si' }, 5, { x: 10, y: 0, w: 700, h: 54 }) },
      'A volte però un descrittore non deve passare al nuovo programma. Un piccolo programma di avvio può usare un file temporaneo per i propri preparativi, e preferisce chiuderlo prima che arrivi il programma successivo. Per questo ogni descrittore ha un contrassegno, [[close-on-exec]]: se è attivo, il kernel chiude quel descrittore durante una execve riuscita.',
      'La parola «riuscita» conta. execve può fallire, per esempio perché il percorso indicato non esiste. In quel caso lascia tutto com’è: restituisce −1, mette in errno il codice ENOENT, e il vecchio programma prosegue dall’istruzione successiva, con tutti i suoi descrittori ancora aperti, marcati o no. Una execve che ritorna è quindi sempre una execve fallita, e il codice che la segue è per forza un ramo di errore.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processo 71 esegue un programma di avvio, con due file aperti: il file di lavoro sul descrittore 3, un file temporaneo sul 4. Chiamerà execve per caricare il programma analisi. Sceglierai se il percorso esiste, e se il descrittore 4 è marcato close-on-exec.',
      'Vedremo quale programma esegue dopo la chiamata, e quali descrittori trova aperti. Confronta il caricamento riuscito con quello fallito, tenendo la marcatura attiva.'
    ],
    vedrai: [
      ['process', 'Il processo', 'In alto: il programma in esecuzione, il punto in cui si trova, il valore restituito da execve.'],
      ['file', 'I descrittori', 'In basso: lo stato dei descrittori 3 e 4, e il percorso richiesto.']
    ]
  },
  lab: {
    titolo: 'Una execve, due esiti',
    scena: { w: 860, h: 140 },
    atti: ['La preparazione', 'La chiamata', 'Dopo la chiamata'],
    controlli: [
      { id: 'caso', tipo: 'scelta', eti: 'Percorso', opzioni: [['ok', 'esiste'], ['ko', 'assente']], valore: 'ok' },
      { id: 'marca', tipo: 'scelta', eti: 'Descrittore 4', opzioni: [['si', 'marcato close-on-exec'], ['no', 'senza marcatura']], valore: 'si' }
    ],
    nota: 'I passi sono sempre sei. Il PID resta 71 in tutti i casi.',
    previsione: {
      domanda: (p) => 'Il processo 71 ha aperti i descrittori 3 e 4' + (p.marca === 'si' ? ', e il 4 è marcato close-on-exec' : ', nessuno dei due marcato') + '. Chiama execve con un percorso ' + (p.caso === 'ok' ? 'che esiste' : 'che non esiste') + '. Quali descrittori sono aperti nel programma che esegue subito dopo?',
      opzioni: () => [['tutti', 'Il 3 e il 4'], ['solo3', 'Soltanto il 3'], ['nessuno', 'Nessuno dei due']]
    },
    confronto: (pred, esito, p) => { const N = { tutti: 'il 3 e il 4', solo3: 'soltanto il 3', nessuno: 'nessuno dei due' }; return 'La previsione indicava: ' + N[pred] + '. Restano aperti: ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.caso === 'ko' ? 'La execve è fallita, e nulla è stato chiuso: la marcatura agisce soltanto a caricamento riuscito.' : p.marca === 'si' ? 'Il caricamento è riuscito: i descrittori sopravvivono, tranne quello marcato.' : 'Il caricamento è riuscito, e senza marcature tutti i descrittori passano al nuovo programma.'); },
    costruisci(p) {
      const U = SL.unita523, passi = [], ok = p.caso === 'ok', marc = p.marca === 'si', es = U.aperti(p);
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, h: 56 });
      const hud = (f) => [['Programma', ok && f >= 4 ? 'analisi' : 'avvio', 'a'], ['PID', '71'], ['fd aperti', f >= 4 && es === 'solo3' ? '3' : '3 e 4', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La preparazione', 'Il processo 71 esegue il programma di avvio. Ha aperto il file di lavoro sul descrittore 3, destinato al programma che caricherà, e un file temporaneo sul descrittore 4, che serve soltanto a lui.', {});
      P(1, 0, marc ? 'La marcatura' : 'Nessuna marcatura', marc ? 'Il programma attiva il contrassegno close-on-exec sul descrittore 4. Il file resta aperto e utilizzabile. Il contrassegno dice al kernel che cosa fare a una execve riuscita.' : 'Il programma lascia i descrittori come sono. Nessuno dei due ha il contrassegno close-on-exec.', {});
      P(2, 1, 'La chiamata', 'Il programma chiama execve indicando il percorso ' + (ok ? '/bin/analisi.' : '/bin/analisy, scritto con un errore di battitura.') + ' Il controllo passa al kernel.', {});
      P(3, 1, ok ? 'Il file esiste' : 'Il file non esiste', ok ? 'Il kernel trova l’eseguibile e può procedere alla sostituzione. Da qui in avanti la chiamata non ritornerà più al programma di avvio.' : 'Il kernel non trova alcun file con quel nome. La chiamata fallisce: restituisce −1, e in errno compare ENOENT. Nulla è stato toccato.', { calc: ok ? 'execve procede' : 'execve → −1, ENOENT', chiedi: { d: 'Dopo questa chiamata, quale programma eseguirà il processo 71?', o: ['Il programma di avvio', 'Il programma analisi'], g: ok ? 1 : 0, no: ok ? 'Il caricamento è riuscito, e l’immagine viene sostituita.' : 'Il caricamento è fallito, e il vecchio programma prosegue.' } });
      P(4, 2, ok ? 'La nuova immagine' : 'Il ramo di errore', ok ? 'Il kernel elimina l’immagine del programma di avvio e installa quella di analisi. ' + (marc ? 'Chiude il descrittore 4, che era marcato.' : 'Nessun descrittore era marcato, e nessuno viene chiuso.') + ' Poi mette nel contatore di programma il punto di ingresso di analisi.' : 'Il programma di avvio riprende dall’istruzione che segue execve. Poiché una execve riuscita non ritorna, questo codice può essere soltanto il ramo di errore.' + (marc ? ' Il descrittore 4 è ancora aperto: la marcatura agisce a caricamento riuscito.' : ''), { calc: ok ? 'PC ← punto di ingresso' : 'ritorno al chiamante' });
      P(5, 2, 'Chi esegue, e con quali file', ok ? 'Il processo 71 esegue analisi. Trova aperto il descrittore 3' + (marc ? ', e trova chiuso il 4.' : ' e anche il 4, che il programma di avvio non aveva marcato.') : 'Il processo 71 esegue ancora il programma di avvio, con i descrittori 3 e 4 aperti. Può segnalare l’errore, riprovare con un altro percorso, oppure terminare.', { esito: [es === 'solo3' ? 'aperto soltanto il 3' : 'aperti il 3 e il 4', ''] });
      return { passi, esito: es };
    }
  },
  bilancio: {
    regola: [
      'Una execve riuscita sostituisce l’immagine del processo e riparte dal punto di ingresso. Conserva il PID e i descrittori aperti, tranne quelli marcati close-on-exec.',
      'Una execve fallita restituisce −1 e lascia tutto com’era. Il codice che la segue è un ramo di errore.'
    ],
    errori: [
      ['Scrivere dopo execve il seguito normale del programma.', 'Se il caricamento riesce quel codice non viene mai eseguito.'],
      ['Pensare che execve crei un processo.', 'Il processo è lo stesso, con lo stesso PID. Per crearne uno serve fork.'],
      ['Credere che la marcatura chiuda subito il descrittore.', 'Il descrittore resta aperto fino a una execve riuscita.']
    ],
    saFare: ['Indicare che cosa conserva e che cosa sostituisce execve.', 'Prevedere quali descrittori passano al nuovo programma.', 'Riconoscere il ramo di errore dopo una execve.'],
    esercizi: [
      { d: 'Un processo con PID 208 ha aperti i descrittori 0, 1, 2, 5 e 6. Il 6 è marcato close-on-exec. Chiama execve, che riesce. Quanti descrittori trova aperti il nuovo programma?', segnaposto: 'Un numero', giuste: ['4', 'quattro'],
        ok: 'Restano 0, 1, 2 e 5. Il 6 viene chiuso durante il caricamento.',
        diagnosi: [
          { se: ['5', 'cinque'], msg: 'Il descrittore 6 era marcato close-on-exec, e una execve riuscita lo chiude.' },
          { se: ['0', 'zero'], msg: 'I descrittori sopravvivono a execve, a meno che siano marcati.' },
          { se: ['1', 'uno'], msg: 'Viene chiuso soltanto il descrittore marcato. Gli altri quattro restano.' }
        ],
        altro: 'Il numero è diverso. Si tolga dai cinque descrittori quelli marcati close-on-exec.',
        indizi: ['I descrittori aperti sono cinque.', 'Uno è marcato.', '5 − 1 = 4.'],
        svolgimento: ['Aperti prima: 0, 1, 2, 5, 6.', 'Chiuso da execve: 6.', 'Aperti dopo: 4.'] },
      { d: 'Nella stessa situazione, qual è il PID del processo che esegue il nuovo programma?', segnaposto: 'Un numero', giuste: ['208'],
        ok: 'execve cambia il programma e conserva il processo.',
        diagnosi: [
          { se: ['209'], msg: 'Un PID nuovo nasce con fork. execve non crea processi.' },
          { se: ['0', 'zero'], msg: 'Lo 0 è il valore che fork restituisce al figlio. Qui si chiede il PID, che resta invariato.' }
        ],
        altro: 'Il numero è diverso. Il processo resta quello del chiamante: ripensa al suo PID.',
        indizi: ['execve sostituisce l’immagine.', 'L’identità del processo resta.', 'Il PID è ancora 208.'],
        svolgimento: ['PID prima di execve: 208.', 'PID dopo: 208.'] },
      { d: 'In un programma, la riga che segue una chiamata a execve viene eseguita. Che cosa significa?', guida: 'Si scelga la risposta.', o: [
        { t: 'Che execve è fallita', ok: true, fb: 'Una execve riuscita non ritorna mai al chiamante.' },
        { t: 'Che il nuovo programma ha terminato', fb: 'Quando il nuovo programma termina, termina il processo. Il vecchio codice non esiste più.' },
        { t: 'Che il nuovo programma è partito in parallelo', fb: 'execve sostituisce il flusso esistente, senza crearne un secondo.' }] }
    ],
    sfida: ['cslez5_2_03_process_control', 'Sostituzione del programma con exec']
  }
});
