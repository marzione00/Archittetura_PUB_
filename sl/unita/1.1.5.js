'use strict';
SL.registra('1.1.5', {
  titolo: 'Dal file eseguibile al processo',
  obiettivo: 'Obiettivo: descrivere la sequenza di operazioni compresa fra il comando digitato e l’esecuzione del programma, e distinguere un programma da un processo.',
  concetti: [['process', 'Processo'], ['fork', 'Padre e figlio'], ['terminale', 'Shell']],
  filigrana: ['process', 'fork', 'file'],
  richiami: {
    carte: [
      { sim: 'terminale', da: 'Dall’unità 1.1.4', t: 'La shell', d: 'È il programma che interpreta i comandi digitati, come ./hello.' },
      { sim: 'riproduci', da: 'Dall’unità 1.1.3', t: 'Il file eseguibile', d: 'Contiene le istruzioni del programma in una forma che il sistema operativo può caricare e avviare.' },
      { sim: 'gate', da: 'Dall’unità 1.1.1', t: 'Il sistema operativo', d: 'Ogni operazione sulle risorse condivise è preceduta da una richiesta al sistema operativo.' }
    ],
    domanda: { d: 'Prima di proseguire: che cosa indica il punto nel comando ./hello?', o: [
      { t: 'La radice', fb: 'La radice è indicata da una barra. Il punto indica la directory corrente.' },
      { t: 'La directory corrente', ok: true, fb: 'Il percorso ./hello richiede la ricerca di hello nella directory corrente.' },
      { t: 'La directory superiore', fb: 'La risalita richiede due punti. Un solo punto indica la directory corrente.' }
    ] }
  },
  idea: {
    titolo: 'Programma e processo',
    termini: ['processo', 'pid', 'codice di uscita'],
    testo: [
      'Un file eseguibile conservato su disco è inerte. Affinché il programma operi, il sistema operativo deve copiarne le istruzioni in memoria e avviarne l’esecuzione. Un programma in esecuzione prende il nome di [[processo]]. La distinzione è sostanziale: dello stesso programma possono esistere nello stesso momento più processi, ciascuno con una propria esecuzione in corso.',
      'Il sistema operativo assegna a ogni processo un numero identificativo, il [[pid|PID]]. Per tutta la durata del processo quel numero gli appartiene in modo esclusivo. Anche la shell è un processo, dotato del proprio PID.',
      'Alla digitazione di `./hello` la shell deve restare disponibile per i comandi successivi, e deve quindi evitare di trasformarsi essa stessa in hello. Nei sistemi della famiglia Unix l’avvio avviene in due operazioni. Con la prima la shell chiede al sistema operativo la creazione di un nuovo processo, copia di se stessa. Il nuovo processo è detto figlio, e il processo che lo ha creato è detto padre. Al figlio è assegnato un PID distinto.',
      'Con la seconda operazione il figlio chiede al sistema operativo di sostituire il proprio programma con hello. Le istruzioni della shell sono rimosse, e al loro posto sono caricate quelle del file eseguibile. Il processo resta il medesimo, con lo stesso PID, e da quel momento esegue un programma diverso.',
      { fig: 'scena', w: 700, h: 150, titolo: 'Le due operazioni', nota: 'La creazione produce un processo nuovo. La sostituzione cambia il programma all’interno di un processo già esistente.', els: [
        SL.el.box('a', 10, 30, 190, 80, 'processo 700', 'programma: shell', '', { sim: 'process' }),
        SL.el.linea('l1', 200, 70, 255, 70, 'att'), SL.el.nota('n1', 210, 118, 'crea', 'mono', 'att'),
        SL.el.box('b', 255, 30, 190, 80, 'processo 702', 'programma: shell', 'att', { sim: 'process' }),
        SL.el.linea('l2', 445, 70, 500, 70, 'on'), SL.el.nota('n2', 427, 118, 'sostituisce', 'mono', 'on'),
        SL.el.box('c', 500, 30, 190, 80, 'processo 702', 'programma: hello', 'on', { sim: 'process' })] },
      'Nel frattempo il padre resta in attesa. Al termine, hello trasmette al sistema operativo un numero, il [[codice di uscita]], che per convenzione vale 0 in assenza di errori. Il sistema operativo lo comunica al padre, che soltanto allora ripresenta il prompt e accetta il comando successivo.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento segue l’avvio di hello dalla pressione del tasto Invio fino alla ricomparsa del prompt. Sulla scena sono presenti la shell, il sistema operativo e il file eseguibile su disco.',
      'Due numeri meritano attenzione: il PID del processo figlio, dal momento della creazione, e il codice di uscita comunicato al padre al termine.'
    ],
    vedrai: [
      ['process', 'I processi', 'In alto. A sinistra il padre, cioè la shell; a destra il figlio, dopo la creazione.'],
      ['gate', 'Il sistema operativo', 'In basso al centro. Riceve le richieste e le esegue.'],
      ['file', 'Il file eseguibile', 'In basso a destra, su disco, fino al caricamento.']
    ]
  },
  lab: {
    titolo: 'Avvio di hello e ritorno alla shell',
    scena: { w: 860, h: 330 },
    atti: ['Preparazione', 'Creazione del figlio', 'Sostituzione del programma', 'Termine e ritorno'],
    nota: 'La sequenza dei passi è la stessa per ogni programma avviato dalla shell: creazione, sostituzione, attesa e raccolta.',
    controlli: [{ id: 'cod', tipo: 'scelta', eti: 'hello termina', opzioni: [[0, 'Senza errori'], [1, 'Con un errore']], valore: 0 }],
    previsione: {
      domanda: () => 'La shell ha PID 700, e il sistema operativo assegnerà al figlio il PID 702. Con quale PID viene eseguito hello?',
      opzioni: () => [[700, '700, quello della shell'], [702, '702, quello del figlio'], [703, 'Un PID nuovo, assegnato al caricamento']]
    },
    confronto: (pred, esito) => 'La previsione indicava che hello fosse eseguito con il PID ' + pred + '. È eseguito con il PID ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : (pred === 700 ? 'La shell resta un processo distinto, in attesa: hello è eseguito nel processo figlio.' : 'La sostituzione del programma avviene all’interno del processo figlio, che conserva il proprio PID.')),
    costruisci(p) {
      const el = SL.el, passi = [];
      let figlio = null, padre = 'shell · attende un comando', processi = 1, cod = null;
      const quadro = (o) => {
        o = o || {};
        const els = [
          el.box('pa', 30, 20, 300, 96, 'processo 700 · padre', padre, o.att === 'pa' ? 'att' : '', { sim: 'process' }),
          el.box('so', 250, 220, 330, 90, 'sistema operativo', o.so || 'in attesa di richieste', o.att === 'so' ? 'att' : '', { sim: 'gate' }),
          el.box('fi', 640, 220, 200, 90, 'file su disco', 'hello', o.att === 'fi' ? 'on' : '', { sim: 'file' }),
          el.linea('l1', 180, 116, 340, 220, o.via === 'pa' ? 'att' : ''), el.linea('l3', 580, 265, 640, 265, o.via === 'fi' ? 'on' : '')
        ];
        if (figlio) els.push(el.box('fg', 520, 20, 310, 96, 'processo 702 · figlio', figlio, o.att === 'fg' ? (o.fine ? 'off' : 'att') : (o.fine ? 'off' : 'on'), { sim: 'process' }), el.linea('l2', 680, 116, 500, 220, o.via === 'fg' ? 'att' : ''));
        if (o.pacco) els.push(el.pacco('pk', o.pacco[0], o.pacco[1], o.pacco[2], o.pacco[3]));
        return els;
      };
      const hud = () => [['Processi esistenti', processi, 'a'], ['PID del figlio', figlio ? 702 : '·'], ['Codice di uscita', cod === null ? '·' : cod, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      P({ att: 'pa' }, 0, 'La shell in attesa', 'Esiste un solo processo, la shell, con PID 700. La shell presenta il prompt e attende un comando.');
      padre = 'shell · ha letto ./hello';
      P({ att: 'pa' }, 0, 'Il comando ./hello', 'È stato digitato ./hello, seguito dal tasto Invio. La shell ha individuato nella directory corrente il file da avviare, hello.',
        { chiedi: { d: 'Qual è la prima operazione della shell?', o: ['Caricare hello al proprio posto', 'Chiedere la creazione di un processo figlio', 'Chiedere al disco di eseguire il file'], g: 1, no: 'Se la shell caricasse hello al proprio posto, cesserebbe di esistere. Per restare disponibile richiede anzitutto un processo nuovo.' } });
      P({ att: 'so', via: 'pa', so: 'richiesta: crea un figlio', pacco: [220, 160, 'crea un processo', 'att'] }, 1, 'La richiesta di creazione', 'La shell chiede al sistema operativo di creare un processo nuovo, copia di se stessa.');
      figlio = 'programma: shell (copia)'; processi = 2;
      P({ att: 'fg', so: 'creato il processo 702' }, 1, 'Creazione del processo 702', 'Il sistema operativo crea il figlio e gli assegna il PID 702. In questo momento i processi sono due, ed eseguono entrambi il programma della shell.', { calc: 'PID del figlio = 702' });
      padre = 'shell · in attesa di 702';
      P({ att: 'pa', via: 'pa', pacco: [220, 160, '702'] }, 1, 'Il padre riceve il PID del figlio', 'Il sistema operativo comunica al padre il PID del figlio. Il padre ne prende nota e resta in attesa del termine del figlio.',
        { chiedi: { d: 'Il figlio sta per richiedere la sostituzione del proprio programma con hello. Quale PID avrà dopo la sostituzione?', o: ['702, lo stesso di prima', 'Un PID nuovo'], g: 0, no: 'La sostituzione cambia il programma all’interno del processo. Il processo resta il medesimo, con il proprio PID.' } });
      P({ att: 'so', via: 'fg', so: 'richiesta: esegui ./hello', pacco: [590, 160, 'sostituisci con ./hello', 'att'] }, 2, 'La richiesta di sostituzione', 'Il figlio chiede al sistema operativo di sostituire il proprio programma con quello contenuto nel file hello.');
      P({ att: 'fi', via: 'fi', so: 'caricamento di hello', pacco: [556, 182, 'istruzioni'] }, 2, 'Caricamento del file', 'Il sistema operativo legge il file eseguibile dal disco e ne copia le istruzioni nella memoria del processo 702.');
      figlio = 'programma: hello';
      P({ att: 'fg', so: 'avvio di hello' }, 2, 'Il processo 702 esegue hello', 'Le istruzioni della shell sono state sostituite da quelle di hello. Il processo è il medesimo, e conserva il PID 702.', { calc: 'processo 702: shell → hello' });
      figlio = 'hello · scrive la sua riga';
      P({ att: 'fg' }, 2, 'Esecuzione di hello', 'Il programma chiama puts, e la riga hello compare sullo schermo secondo il tragitto descritto nell’unità 1.1.1. Nel frattempo il padre resta in attesa.');
      cod = p.cod; figlio = 'hello · terminato, codice ' + cod;
      P({ att: 'so', via: 'fg', so: 'il processo 702 è terminato', pacco: [590, 160, 'codice ' + cod, cod ? 'err' : ''] }, 3, 'hello termina', 'Il programma è terminato, e trasmette al sistema operativo il proprio codice di uscita, ' + cod + (cod === 0 ? ', che per convenzione indica l’assenza di errori.' : ', che in quanto diverso da zero segnala un errore.'),
        { calc: 'codice di uscita = ' + cod, chiedi: { d: 'A chi viene comunicato il codice di uscita?', o: ['Allo schermo', 'Al processo padre, la shell', 'Al file hello'], g: 1, no: 'Il codice di uscita è destinato a chi ha avviato il programma: il padre, che era in attesa.' } });
      padre = 'raccolto 702 · codice ' + cod;
      P({ att: 'pa', via: 'pa', fine: true, pacco: [220, 160, '702 · codice ' + cod, cod ? 'err' : ''] }, 3, 'Raccolta dell’esito da parte del padre', 'Il sistema operativo riattiva il padre e gli comunica due numeri: il PID del figlio terminato e il relativo codice di uscita.');
      figlio = null; processi = 1;
      P({ att: 'so', so: 'processo 702 eliminato' }, 3, 'Eliminazione del processo 702', 'Raccolto l’esito, il sistema operativo elimina ogni informazione relativa al processo figlio. Il numero 702 ritorna disponibile.');
      padre = 'shell · attende un comando';
      P({ att: 'pa' }, 3, 'Ritorno del prompt', 'La shell ripresenta il prompt. Per l’intera sequenza il suo PID è rimasto 700, e hello è sempre stato eseguito nel processo 702.', { calc: 'hello è stato eseguito con il PID 702' });
      return { passi, esito: 702 };
    }
  },
  bilancio: {
    regola: [
      'Un processo è un programma in esecuzione, identificato da un PID. Per avviare un programma la shell richiede anzitutto la creazione di un processo figlio; il figlio richiede quindi la sostituzione del proprio programma.',
      'La sostituzione cambia il programma e lascia invariato il PID. Al termine il figlio trasmette un codice di uscita, che il sistema operativo comunica al padre in attesa.'
    ],
    errori: [
      ['Confondere programma e processo.', 'Il programma è il file che contiene le istruzioni. Il processo è una sua esecuzione in corso, e dello stesso programma possono esisterne più d’una.'],
      ['Ritenere che la sostituzione crei un processo.', 'Il processo nuovo è prodotto dalla creazione. La sostituzione avviene all’interno di un processo già esistente.'],
      ['Trascurare il padre.', 'Durante l’esecuzione del figlio il padre resta in attesa, ed è il destinatario del codice di uscita.']
    ],
    saFare: ['Distinguere un programma da un processo.', 'Descrivere le due operazioni con cui la shell avvia un programma.', 'Indicare il destinatario del codice di uscita e il significato del valore 0.'],
    esercizi: [
      { d: 'Lo stesso programma viene avviato in due finestre diverse, e resta in esecuzione in entrambe. Quanti programmi e quanti processi sono presenti?', guida: 'Si scelga la risposta.', o: [
        { t: 'Due programmi, due processi', fb: 'Il file che contiene le istruzioni è uno solo. Sono due le sue esecuzioni.' },
        { t: 'Un programma, due processi', ok: true, fb: 'Il programma è uno; ogni esecuzione in corso è un processo distinto, con il proprio PID.' },
        { t: 'Un programma, un processo', fb: 'Ogni avvio crea un processo distinto. Due esecuzioni in corso corrispondono a due processi.' }] },
      { d: 'Una shell con PID 1200 crea un figlio con PID 1207, che sostituisce poi il proprio programma con hello. Con quale PID viene eseguito hello?', segnaposto: 'Un PID', giuste: ['1207'],
        ok: 'La sostituzione avviene all’interno del figlio, che conserva il PID 1207.',
        diagnosi: [
          { se: ['1200'], msg: 'Il PID 1200 appartiene alla shell, che resta in attesa. Il programma hello viene caricato nel processo figlio.' },
          { se: ['1208'], msg: 'La sostituzione del programma lascia invariato il processo, PID compreso. Un PID nuovo è assegnato soltanto alla creazione di un processo.' }
        ],
        altro: 'Il PID è diverso. Ci si chieda in quale dei due processi viene caricato hello, e se la sostituzione cambia il PID.',
        indizi: ['I processi sono due: la shell e il figlio.', 'La sostituzione è richiesta dal figlio.', 'La sostituzione cambia il programma e lascia invariato il PID.'],
        svolgimento: ['La creazione produce il figlio, con PID 1207.', 'Il figlio sostituisce il proprio programma con hello e conserva il PID.', 'Il programma hello è eseguito con il PID 1207.'] }
    ]
  }
});
