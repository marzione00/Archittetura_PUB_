'use strict';
SL.registra('1.1.5', {
  titolo: 'Dal file eseguibile al processo',
  obiettivo: 'Alla fine saprai raccontare che cosa accade fra il comando digitato e il programma in esecuzione, e distinguere un programma da un processo.',
  concetti: [['process', 'Processo'], ['fork', 'Padre e figlio'], ['terminale', 'Shell']],
  filigrana: ['process', 'fork', 'file'],
  richiami: {
    carte: [
      { sim: 'terminale', da: 'Dall’unità 1.1.4', t: 'La shell', d: 'È il programma che interpreta i comandi digitati, come ./hello.' },
      { sim: 'riproduci', da: 'Dall’unità 1.1.3', t: 'Il file eseguibile', d: 'Contiene le istruzioni del programma in una forma che il sistema operativo può caricare e avviare.' },
      { sim: 'gate', da: 'Dall’unità 1.1.1', t: 'Il sistema operativo', d: 'Ogni operazione sulle risorse condivise passa da una richiesta al sistema operativo.' }
    ],
    domanda: { d: 'Prima di proseguire: che cosa indica il punto nel comando ./hello?', o: [
      { t: 'La radice', fb: 'La radice si scrive con una barra. Il punto indica la directory corrente.' },
      { t: 'La directory corrente', ok: true, fb: 'Il percorso ./hello chiede di cercare hello nella directory in cui ci si trova.' },
      { t: 'La directory superiore', fb: 'Per salire servono due punti. Un punto solo indica la directory corrente.' }
    ] }
  },
  idea: {
    titolo: 'Un programma che gira è un processo',
    termini: ['processo', 'pid', 'codice di uscita'],
    testo: [
      'Un file eseguibile su disco è inerte, come una ricetta chiusa in un cassetto. Perché accada qualcosa, il sistema operativo deve copiarne le istruzioni in memoria e far cominciare l’esecuzione. Un programma in esecuzione si chiama [[processo]]. La distinzione conta: dello stesso programma possono esistere molti processi nello stesso momento, come molte cucine possono preparare la stessa ricetta.',
      'Il sistema operativo assegna a ogni processo un numero che lo identifica, chiamato [[pid|PID]]. Finché il processo esiste, quel numero è soltanto suo. Anche la shell è un processo, con il suo PID.',
      'Quando digiti `./hello`, la shell deve restare disponibile per i comandi successivi, quindi evita di trasformarsi essa stessa in hello. Segue una procedura in due mosse, che i sistemi della famiglia Unix usano da sempre. Nella prima mossa chiede al sistema operativo di creare un processo nuovo, copia di se stessa. Il nuovo processo si chiama figlio, e chi lo ha creato si chiama padre. Il figlio riceve un PID tutto suo.',
      'Nella seconda mossa il figlio chiede al sistema operativo di sostituire il proprio programma con hello. Le istruzioni della shell vengono messe da parte e al loro posto vengono caricate quelle del file eseguibile. Il processo resta lo stesso, con lo stesso PID, e da quel momento esegue un programma diverso.',
      { fig: 'scena', w: 700, h: 150, titolo: 'Le due mosse', nota: 'La creazione produce un processo nuovo. La sostituzione cambia il programma dentro un processo che esiste già.', els: [
        SL.el.box('a', 10, 30, 190, 80, 'processo 700', 'programma: shell', '', { sim: 'process' }),
        SL.el.linea('l1', 200, 70, 255, 70, 'att'), SL.el.nota('n1', 210, 118, 'crea', 'mono', 'att'),
        SL.el.box('b', 255, 30, 190, 80, 'processo 702', 'programma: shell', 'att', { sim: 'process' }),
        SL.el.linea('l2', 445, 70, 500, 70, 'on'), SL.el.nota('n2', 427, 118, 'sostituisce', 'mono', 'on'),
        SL.el.box('c', 500, 30, 190, 80, 'processo 702', 'programma: hello', 'on', { sim: 'process' })] },
      'Intanto il padre aspetta. Quando hello ha finito, consegna al sistema operativo un numero, il [[codice di uscita]], che per convenzione vale 0 se tutto è andato bene. Il sistema operativo lo recapita al padre, che solo allora torna a mostrare il prompt, pronto per il comando successivo.'
    ]
  },
  esperimento: {
    faremo: [
      'Seguiremo l’avvio di hello dal momento in cui premi Invio fino al ritorno del prompt. In scena ci sono la shell, il sistema operativo e il file eseguibile su disco.',
      'Tieni d’occhio due numeri: il PID del processo figlio, dal momento in cui nasce, e il codice di uscita che torna al padre alla fine.'
    ],
    vedrai: [
      ['process', 'I processi', 'In alto. A sinistra il padre, cioè la shell; a destra il figlio, quando verrà creato.'],
      ['gate', 'Il sistema operativo', 'In basso al centro. Riceve le richieste e le esegue.'],
      ['file', 'Il file eseguibile', 'In basso a destra, su disco, finché non viene caricato.']
    ]
  },
  lab: {
    titolo: 'Dalla shell a hello e ritorno',
    scena: { w: 860, h: 330 },
    atti: ['Preparazione', 'La creazione del figlio', 'La sostituzione del programma', 'La fine e il ritorno'],
    nota: 'I passi sono gli stessi per ogni programma avviato dalla shell: creazione, sostituzione, attesa e raccolta.',
    controlli: [{ id: 'cod', tipo: 'scelta', eti: 'hello termina', opzioni: [[0, 'Senza errori'], [1, 'Con un errore']], valore: 0 }],
    previsione: {
      domanda: () => 'La shell ha PID 700 e il sistema operativo assegnerà al figlio il PID 702. Con quale PID girerà hello?',
      opzioni: () => [[700, '700, quello della shell'], [702, '702, quello del figlio'], [703, 'Un PID nuovo, assegnato al caricamento']]
    },
    confronto: (pred, esito) => 'Avevi previsto che hello girasse con il PID ' + pred + '. Gira con il PID ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : (pred === 700 ? 'La shell resta un processo a parte, in attesa: hello gira nel processo figlio.' : 'La sostituzione del programma avviene dentro il processo figlio, che conserva il suo PID.')),
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
      P({ att: 'pa' }, 0, 'La shell aspetta', 'Esiste un solo processo, la shell, con PID 700. Mostra il prompt e attende un comando.');
      padre = 'shell · ha letto ./hello';
      P({ att: 'pa' }, 0, 'Il comando ./hello', 'Hai digitato ./hello e premuto Invio. La shell ha individuato il file da avviare, hello, nella directory corrente.',
        { chiedi: { d: 'Qual è la prima mossa della shell?', o: ['Caricare hello al proprio posto', 'Chiedere la creazione di un processo figlio', 'Chiedere al disco di eseguire il file'], g: 1, no: 'Se la shell caricasse hello al proprio posto, sparirebbe. Per restare disponibile chiede prima un processo nuovo.' } });
      P({ att: 'so', via: 'pa', so: 'richiesta: crea un figlio', pacco: [220, 160, 'crea un processo', 'att'] }, 1, 'La richiesta di creazione', 'La shell chiede al sistema operativo di creare un processo nuovo, copia di se stessa.');
      figlio = 'programma: shell (copia)'; processi = 2;
      P({ att: 'fg', so: 'creato il processo 702' }, 1, 'Nasce il processo 702', 'Il sistema operativo crea il figlio e gli assegna il PID 702. In questo istante i processi sono due, ed eseguono entrambi il programma della shell.', { calc: 'PID del figlio = 702' });
      padre = 'shell · in attesa di 702';
      P({ att: 'pa', via: 'pa', pacco: [220, 160, '702'] }, 1, 'Il padre riceve il PID del figlio', 'Il sistema operativo comunica al padre il PID del figlio. Il padre lo annota e si mette in attesa che il figlio termini.',
        { chiedi: { d: 'Il figlio sta per chiedere la sostituzione del proprio programma con hello. Dopo la sostituzione, quale PID avrà?', o: ['702, lo stesso di prima', 'Un PID nuovo'], g: 0, no: 'La sostituzione cambia il programma dentro il processo. Il processo resta quello, con il suo PID.' } });
      P({ att: 'so', via: 'fg', so: 'richiesta: esegui ./hello', pacco: [590, 160, 'sostituisci con ./hello', 'att'] }, 2, 'La richiesta di sostituzione', 'Il figlio chiede al sistema operativo di sostituire il proprio programma con quello contenuto nel file hello.');
      P({ att: 'fi', via: 'fi', so: 'carico hello dal disco', pacco: [556, 182, 'istruzioni'] }, 2, 'Il file viene caricato', 'Il sistema operativo legge il file eseguibile dal disco e ne copia le istruzioni nella memoria del processo 702.');
      figlio = 'programma: hello';
      P({ att: 'fg', so: 'avvio di hello' }, 2, 'Il processo 702 esegue hello', 'Le istruzioni della shell sono state sostituite da quelle di hello. Il processo è lo stesso di prima e conserva il PID 702.', { calc: 'processo 702: shell → hello' });
      figlio = 'hello · scrive la sua riga';
      P({ att: 'fg' }, 2, 'hello lavora', 'Il programma chiama puts e la riga hello compare sullo schermo, lungo il cammino visto nell’unità 1.1.1. Il padre, nel frattempo, è fermo in attesa.');
      cod = p.cod; figlio = 'hello · terminato, codice ' + cod;
      P({ att: 'so', via: 'fg', so: 'il processo 702 è terminato', pacco: [590, 160, 'codice ' + cod, cod ? 'err' : ''] }, 3, 'hello termina', 'Il programma ha finito e consegna al sistema operativo il suo codice di uscita, ' + cod + (cod === 0 ? ', che per convenzione significa «tutto bene».' : ', che essendo diverso da zero segnala un errore.'),
        { calc: 'codice di uscita = ' + cod, chiedi: { d: 'A chi viene recapitato il codice di uscita?', o: ['Allo schermo', 'Al processo padre, la shell', 'Al file hello'], g: 1, no: 'Il codice di uscita è un messaggio per chi ha avviato il programma: il padre, che lo stava aspettando.' } });
      padre = 'raccolto 702 · codice ' + cod;
      P({ att: 'pa', via: 'pa', fine: true, pacco: [220, 160, '702 · codice ' + cod, cod ? 'err' : ''] }, 3, 'Il padre raccoglie l’esito', 'Il sistema operativo sveglia il padre e gli consegna due numeri: il PID del figlio terminato e il suo codice di uscita.');
      figlio = null; processi = 1;
      P({ att: 'so', so: 'processo 702 eliminato' }, 3, 'Il processo 702 scompare', 'Ora che l’esito è stato raccolto, il sistema operativo elimina ogni traccia del processo figlio. Il numero 702 torna libero.');
      padre = 'shell · attende un comando';
      P({ att: 'pa' }, 3, 'Torna il prompt', 'La shell mostra di nuovo il prompt. Durante tutta la vicenda il suo PID è rimasto 700, e hello ha sempre girato nel processo 702.', { calc: 'hello ha girato con il PID 702' });
      return { passi, esito: 702 };
    }
  },
  bilancio: {
    regola: [
      'Un processo è un programma in esecuzione, identificato da un PID. Per avviare un programma la shell chiede prima la creazione di un processo figlio; poi il figlio chiede la sostituzione del proprio programma.',
      'La sostituzione cambia il programma e lascia invariato il PID. Alla fine il figlio consegna un codice di uscita, che il sistema operativo recapita al padre in attesa.'
    ],
    errori: [
      ['Confondere programma e processo.', 'Il programma è il file con le istruzioni. Il processo è una sua esecuzione in corso, e dello stesso programma possono essercene molte.'],
      ['Pensare che la sostituzione crei un processo.', 'Il processo nuovo nasce con la creazione. La sostituzione avviene dentro un processo che esiste già.'],
      ['Dimenticare il padre.', 'Mentre il figlio lavora il padre aspetta, e sarà lui a ricevere il codice di uscita.']
    ],
    saFare: ['Distinguo un programma da un processo.', 'Racconto le due mosse con cui la shell avvia un programma.', 'Dico chi riceve il codice di uscita e che cosa significa il valore 0.'],
    esercizi: [
      { d: 'Avvii lo stesso programma in due finestre diverse, e lo lasci in esecuzione in entrambe. Quanti programmi e quanti processi ci sono?', guida: 'Scegli la risposta.', o: [
        { t: 'Due programmi, due processi', fb: 'Il file con le istruzioni è uno solo. A essere due sono le sue esecuzioni.' },
        { t: 'Un programma, due processi', ok: true, fb: 'Il programma è uno; ogni esecuzione in corso è un processo distinto, con il proprio PID.' },
        { t: 'Un programma, un processo', fb: 'Ogni avvio crea un processo a sé. Due esecuzioni in corso sono due processi.' }] },
      { d: 'Una shell con PID 1200 crea un figlio con PID 1207, che poi sostituisce il proprio programma con hello. Con quale PID gira hello?', segnaposto: 'Un PID', giuste: ['1207'],
        ok: 'La sostituzione avviene dentro il figlio, che conserva il PID 1207.',
        diagnosi: [
          { se: ['1200'], msg: 'Il PID 1200 appartiene alla shell, che resta in attesa. Il programma hello viene caricato nel processo figlio.' },
          { se: ['1208'], msg: 'La sostituzione del programma lascia il processo com’è, PID compreso. Un PID nuovo nasce soltanto con la creazione di un processo.' }
        ],
        altro: 'Il PID è diverso. Chiediti in quale dei due processi viene caricato hello, e se la sostituzione cambia il PID.',
        indizi: ['I processi sono due: la shell e il figlio.', 'A chiedere la sostituzione è il figlio.', 'La sostituzione cambia il programma e lascia invariato il PID.'],
        svolgimento: ['La creazione produce il figlio, con PID 1207.', 'Il figlio sostituisce il proprio programma con hello e conserva il PID.', 'Il programma hello gira con il PID 1207.'] }
    ]
  }
});
