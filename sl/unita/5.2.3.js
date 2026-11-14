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
  obiettivo: 'Obiettivo: indicare che cosa cambia e che cosa resta invariato quando un processo carica un nuovo programma, e l’esito di un caricamento fallito.',
  concetti: [['process', 'Medesimo processo, altro programma'], ['file', 'I file aperti restano aperti'], ['scudo', 'Eccetto quelli marcati']],
  filigrana: ['process', 'file', 'fork'],
  richiami: {
    carte: [
      { sim: 'process', da: 'Dall’unità 2.5.4', t: 'execve', d: 'La chiamata di sistema che carica un eseguibile nel processo che la invoca.' },
      { sim: 'process', da: 'Dall’unità 2.5.4', t: 'L’immagine di processo', d: 'Le istruzioni e i dati di un programma, installati nella memoria del processo.' },
      { sim: 'file', da: 'Dall’unità 2.5.2', t: 'errno', d: 'La variabile in cui si legge la causa di una chiamata fallita.' }
    ],
    domanda: { d: 'Prima di proseguire: nell’unità precedente il figlio della shell carica il programma echo. Il suo PID cambia?', o: [
      { t: 'No, il processo è il medesimo, cambia il programma', ok: true, fb: 'Il caricamento di un programma sostituisce il contenuto del processo, e ne conserva l’identità.' },
      { t: 'Sì, ogni programma ha il proprio PID', fb: 'Il PID appartiene al processo. Un processo può cambiare programma.' },
      { t: 'Sì, è creato un processo nuovo', fb: 'I processi nuovi sono creati da fork. In questo caso il processo resta il medesimo.' }
    ] }
  },
  idea: {
    titolo: 'La sostituzione del programma a identità invariata',
    termini: ['close-on-exec'],
    testo: [
      'fork crea un processo senza caricare programmi, mentre execve carica un programma senza creare processi. Il processo che la chiama abbandona la propria immagine, cioè le istruzioni e i dati presenti in memoria, e in sua vece il kernel installa quella del nuovo eseguibile. L’esecuzione riprende dal punto di ingresso del nuovo programma, la sua prima istruzione. Del programma precedente non resta alcuna istruzione.',
      'Il processo invece permane. Il PID è il medesimo, il padre è il medesimo, e in particolare restano aperti i file che il processo aveva aperto. Su questa proprietà si fonda la redirezione: il descrittore 1 predisposto dal figlio della shell è giunto invariato al programma echo.',
      { fig: 'scena', w: 720, h: 138, titolo: 'Dopo una execve riuscita', nota: 'Il processo 71 esegue ora analisi. Il descrittore 3 è ancora aperto, il 4 era marcato ed è stato chiuso.', els: SL.unita523.quadro('g', { caso: 'ok', marca: 'si' }, 5, { x: 10, y: 0, w: 700, h: 54 }) },
      'In alcuni casi un descrittore va tuttavia escluso dal passaggio al nuovo programma. Un programma di avvio può impiegare un file temporaneo per le proprie operazioni preliminari, e deve chiuderlo prima del caricamento del programma successivo. A tale scopo ogni descrittore ha un contrassegno, [[close-on-exec]]: se è attivo, il kernel chiude il descrittore durante una execve riuscita.',
      'La precisazione «riuscita» è rilevante. execve può fallire, per esempio quando il percorso indicato è inesistente. In tal caso lo stato del processo resta invariato: la chiamata restituisce −1, scrive in errno il codice ENOENT, e il programma precedente prosegue dall’istruzione successiva, con tutti i suoi descrittori ancora aperti, marcati o meno. Una execve che ritorna è pertanto sempre una execve fallita, e il codice che la segue è necessariamente un ramo di errore.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processo 71 esegue un programma di avvio, con due file aperti: il file di lavoro sul descrittore 3, un file temporaneo sul 4. Chiamerà execve per caricare il programma analisi. I controlli fissano l’esistenza del percorso e la marcatura close-on-exec del descrittore 4.',
      'L’esperimento mostra il programma in esecuzione dopo la chiamata, e i descrittori che esso trova aperti. È istruttivo confrontare il caricamento riuscito con quello fallito, con la marcatura attiva.'
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
      domanda: (p) => 'Il processo 71 ha aperti i descrittori 3 e 4' + (p.marca === 'si' ? ', e il 4 è marcato close-on-exec' : ', nessuno dei due marcato') + '. Chiama execve con un percorso ' + (p.caso === 'ok' ? 'che esiste' : 'che non esiste') + '. Quali descrittori sono aperti nel programma in esecuzione immediatamente dopo?',
      opzioni: () => [['tutti', 'Il 3 e il 4'], ['solo3', 'Soltanto il 3'], ['nessuno', 'Nessuno dei due']]
    },
    confronto: (pred, esito, p) => { const N = { tutti: 'il 3 e il 4', solo3: 'soltanto il 3', nessuno: 'nessuno dei due' }; return 'La previsione indicava: ' + N[pred] + '. Restano aperti: ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.caso === 'ko' ? 'La execve è fallita, e nulla è stato chiuso: la marcatura agisce soltanto a caricamento riuscito.' : p.marca === 'si' ? 'Il caricamento è riuscito: i descrittori restano aperti, eccetto quello marcato.' : 'Il caricamento è riuscito, e senza marcature tutti i descrittori passano al nuovo programma.'); },
    costruisci(p) {
      const U = SL.unita523, passi = [], ok = p.caso === 'ok', marc = p.marca === 'si', es = U.aperti(p);
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, h: 56 });
      const hud = (f) => [['Programma', ok && f >= 4 ? 'analisi' : 'avvio', 'a'], ['PID', '71'], ['fd aperti', f >= 4 && es === 'solo3' ? '3' : '3 e 4', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La preparazione', 'Il processo 71 esegue il programma di avvio. Ha aperto il file di lavoro sul descrittore 3, destinato al programma che caricherà, e un file temporaneo sul descrittore 4, destinato al solo programma di avvio.', {});
      P(1, 0, marc ? 'La marcatura' : 'Nessuna marcatura', marc ? 'Il programma attiva il contrassegno close-on-exec sul descrittore 4. Il file resta aperto e utilizzabile. Il contrassegno indica al kernel l’operazione da compiere a una execve riuscita.' : 'Il programma lascia i descrittori invariati. Nessuno dei due ha il contrassegno close-on-exec.', {});
      P(2, 1, 'La chiamata', 'Il programma chiama execve indicando il percorso ' + (ok ? '/bin/analisi.' : '/bin/analisy, scritto con un errore di battitura.') + ' Il controllo passa al kernel.', {});
      P(3, 1, ok ? 'Il file esiste' : 'Il file è inesistente', ok ? 'Il kernel trova l’eseguibile e può procedere alla sostituzione. Da questo punto la chiamata non ritorna più al programma di avvio.' : 'Il kernel non trova alcun file con tale nome. La chiamata fallisce: restituisce −1, e in errno compare ENOENT. Lo stato del processo è invariato.', { calc: ok ? 'execve procede' : 'execve → −1, ENOENT', chiedi: { d: 'Dopo questa chiamata, quale programma eseguirà il processo 71?', o: ['Il programma di avvio', 'Il programma analisi'], g: ok ? 1 : 0, no: ok ? 'Il caricamento è riuscito, e l’immagine è sostituita.' : 'Il caricamento è fallito, e il programma precedente prosegue.' } });
      P(4, 2, ok ? 'La nuova immagine' : 'Il ramo di errore', ok ? 'Il kernel elimina l’immagine del programma di avvio e installa quella di analisi. ' + (marc ? 'Chiude il descrittore 4, che era marcato.' : 'Nessun descrittore era marcato, e nessuno è chiuso.') + ' Scrive quindi nel contatore di programma il punto di ingresso di analisi.' : 'Il programma di avvio riprende dall’istruzione che segue execve. Poiché una execve riuscita non ritorna, questo codice può essere soltanto il ramo di errore.' + (marc ? ' Il descrittore 4 è ancora aperto: la marcatura agisce a caricamento riuscito.' : ''), { calc: ok ? 'PC ← punto di ingresso' : 'ritorno al chiamante' });
      P(5, 2, 'Il programma in esecuzione e i suoi file', ok ? 'Il processo 71 esegue analisi, e trova aperto il descrittore 3' + (marc ? ', e trova chiuso il 4.' : ' e anche il 4, che il programma di avvio non aveva marcato.') : 'Il processo 71 esegue ancora il programma di avvio, con i descrittori 3 e 4 aperti. Può segnalare l’errore, ripetere la chiamata con un altro percorso, oppure terminare.', { esito: [es === 'solo3' ? 'aperto soltanto il 3' : 'aperti il 3 e il 4', ''] });
      return { passi, esito: es };
    }
  },
  bilancio: {
    regola: [
      'Una execve riuscita sostituisce l’immagine del processo e riprende dal punto di ingresso. Conserva il PID e i descrittori aperti, eccetto quelli marcati close-on-exec.',
      'Una execve fallita restituisce −1 e lascia invariato lo stato del processo. Il codice che la segue è un ramo di errore.'
    ],
    errori: [
      ['Scrivere dopo execve la prosecuzione ordinaria del programma.', 'Se il caricamento riesce tale codice non è mai eseguito.'],
      ['Ritenere che execve crei un processo.', 'Il processo è il medesimo, con il medesimo PID. Per crearne uno occorre fork.'],
      ['Ritenere che la marcatura chiuda immediatamente il descrittore.', 'Il descrittore resta aperto fino a una execve riuscita.']
    ],
    saFare: ['Indicare che cosa conserva e che cosa sostituisce execve.', 'Prevedere quali descrittori passano al nuovo programma.', 'Riconoscere il ramo di errore dopo una execve.'],
    esercizi: [
      { d: 'Un processo con PID 208 ha aperti i descrittori 0, 1, 2, 5 e 6. Il 6 è marcato close-on-exec. Chiama execve, che riesce. Quanti descrittori trova aperti il nuovo programma?', segnaposto: 'Un numero', giuste: ['4', 'quattro'],
        ok: 'Restano 0, 1, 2 e 5. Il 6 è chiuso durante il caricamento.',
        diagnosi: [
          { se: ['5', 'cinque'], msg: 'Il descrittore 6 era marcato close-on-exec, e una execve riuscita lo chiude.' },
          { se: ['0', 'zero'], msg: 'I descrittori restano aperti dopo execve, a meno che siano marcati.' },
          { se: ['1', 'uno'], msg: 'È chiuso soltanto il descrittore marcato. Gli altri quattro restano.' }
        ],
        altro: 'Il numero è diverso. Si sottraggano dai cinque descrittori quelli marcati close-on-exec.',
        indizi: ['I descrittori aperti sono cinque.', 'Uno è marcato.', '5 − 1 = 4.'],
        svolgimento: ['Aperti prima: 0, 1, 2, 5, 6.', 'Chiuso da execve: 6.', 'Aperti dopo: 4.'] },
      { d: 'Nella medesima situazione, qual è il PID del processo che esegue il nuovo programma?', segnaposto: 'Un numero', giuste: ['208'],
        ok: 'execve cambia il programma e conserva il processo.',
        diagnosi: [
          { se: ['209'], msg: 'Un PID nuovo è assegnato da fork. execve non crea processi.' },
          { se: ['0', 'zero'], msg: 'Lo 0 è il valore che fork restituisce al figlio. La domanda riguarda il PID, che resta invariato.' }
        ],
        altro: 'Il numero è diverso. Il processo resta quello del chiamante, con il suo PID.',
        indizi: ['execve sostituisce l’immagine.', 'L’identità del processo resta.', 'Il PID è ancora 208.'],
        svolgimento: ['PID prima di execve: 208.', 'PID dopo: 208.'] },
      { d: 'In un programma, la riga che segue una chiamata a execve è eseguita. Che cosa indica tale fatto?', guida: 'Si scelga la risposta.', o: [
        { t: 'execve è fallita', ok: true, fb: 'Una execve riuscita non ritorna mai al chiamante.' },
        { t: 'Il nuovo programma ha terminato', fb: 'Quando il nuovo programma termina, termina il processo. Il codice precedente non esiste più.' },
        { t: 'Il nuovo programma è stato avviato in parallelo', fb: 'execve sostituisce il flusso esistente, senza crearne un secondo.' }] }
    ],
    sfida: ['cslez5_2_03_process_control', 'Sostituzione del programma con exec']
  }
});
