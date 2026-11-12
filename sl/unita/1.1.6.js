'use strict';
SL.registra('1.1.6', {
  titolo: 'Seguire hello attraverso il sistema',
  obiettivo: 'Alla fine saprai dire dove finisce la riga scritta da hello a seconda di come lo avvii, e prevedere il contenuto di un file dopo una serie di comandi.',
  concetti: [['terminale', 'Terminale'], ['output', 'Uscita standard'], ['file', 'File']],
  filigrana: ['file', 'terminale', 'output'],
  richiami: {
    carte: [
      { sim: 'output', da: 'Dall’unità 1.1.1', t: 'L’uscita standard', d: 'È il canale, già aperto alla partenza, a cui il programma consegna il testo da scrivere.' },
      { sim: 'file', da: 'Dalle unità 1.1.1 e 1.1.4', t: 'Il file', d: 'È una sequenza di dati conservata su disco sotto un nome, raggiungibile con un percorso.' },
      { sim: 'process', da: 'Dall’unità 1.1.5', t: 'Il processo figlio', d: 'La shell avvia ogni programma in un processo figlio, creato apposta e poi caricato con il programma.' }
    ],
    domanda: { d: 'Prima di proseguire: chi crea il processo in cui gira hello?', o: [
      { t: 'Il file eseguibile', fb: 'Il file su disco è inerte. La creazione viene chiesta dalla shell al sistema operativo.' },
      { t: 'La shell, con una richiesta al sistema operativo', ok: true, fb: 'La shell chiede un processo figlio, e in quel processo viene poi caricato hello.' },
      { t: 'Il programma hello', fb: 'Quando hello comincia a girare il processo esiste già: lo ha chiesto la shell.' }
    ] }
  },
  idea: {
    titolo: 'Lo stesso programma, tre destinazioni',
    termini: ['terminale', 'redirezione'],
    testo: [
      'Nell’unità 1.1.1 hai seguito il testo di hello dall’uscita standard fino alla destinazione, e hai visto che la destinazione viene decisa fuori dal programma. Il compito di hello finisce nel momento in cui consegna il testo al canale. Restano da capire due cose: chi sceglie la destinazione, e in quale momento.',
      'La scelta spetta a chi avvia il programma, cioè alla shell, e avviene prima che il programma parta. Di norma la shell collega l’uscita standard al [[terminale]], la finestra in cui digiti i comandi e leggi le risposte. Aggiungendo un simbolo al comando puoi chiederle un collegamento diverso.',
      'Il comando `./hello > esito` chiede di collegare l’uscita standard al file esito. Questa deviazione si chiama [[redirezione]]. La shell la prepara nel processo figlio, prima che hello venga caricato: se il file manca viene creato, se esiste viene svuotato. Poi il programma parte e scrive come sempre. La riga finisce nel file, e sul terminale compare soltanto il prompt successivo.',
      'Il comando `./hello >> esito` usa il simbolo raddoppiato e cambia un solo particolare. Il file viene lasciato com’è, e la nuova riga si aggiunge in fondo a quelle già presenti.',
      { fig: 'scena', w: 700, h: 190, titolo: 'Tre comandi, tre destinazioni', nota: 'Il simbolo semplice svuota il file prima di scrivere. Il simbolo raddoppiato conserva il contenuto e scrive in fondo.', els: [
        SL.el.box('a1', 10, 10, 240, 46, null, './hello', '', { sim: 'terminale', riga: true }),
        SL.el.linea('l1', 250, 33, 420, 33, 'att'),
        SL.el.box('b1', 420, 10, 270, 46, null, 'terminale', 'att', { sim: 'output', riga: true }),
        SL.el.box('a2', 10, 72, 240, 46, null, './hello > esito', '', { sim: 'terminale', riga: true }),
        SL.el.linea('l2', 250, 95, 420, 95, 'on'),
        SL.el.box('b2', 420, 72, 270, 46, null, 'file esito, svuotato', 'on', { sim: 'file', riga: true }),
        SL.el.box('a3', 10, 134, 240, 46, null, './hello >> esito', '', { sim: 'terminale', riga: true }),
        SL.el.linea('l3', 250, 157, 420, 157, 'on'),
        SL.el.box('b3', 420, 134, 270, 46, null, 'file esito, in fondo', 'on', { sim: 'file', riga: true })] },
      'Nei tre casi il programma eseguito è identico, istruzione per istruzione, e l’unica differenza sta nel collegamento che la shell prepara prima di avviarlo. È il vantaggio di avere un canale fra il programma e la destinazione: lo stesso programma serve a scrivere sullo schermo, in un file o, come vedrai più avanti nel corso, verso un altro programma.'
    ]
  },
  esperimento: {
    faremo: [
      'Avvieremo hello da una a tre volte, sempre con lo stesso comando, scelto fra i tre appena visti. Il file esito esiste già e contiene il numero di righe che decidi tu.',
      'A ogni esecuzione seguiremo la riga dal processo all’uscita standard e da lì alla destinazione. Tieni d’occhio il numero di righe nel file: è la grandezza su cui farai la previsione.'
    ],
    vedrai: [
      ['terminale', 'La shell e il processo', 'In alto. La shell legge il comando; accanto compare il processo figlio in cui gira hello.'],
      ['output', 'L’uscita standard', 'Al centro. Il riquadro dice a quale destinazione è collegata in quel momento.'],
      ['file', 'Le due destinazioni', 'In basso. A sinistra le righe comparse sul terminale, a destra le righe contenute nel file esito.']
    ]
  },
  lab: {
    titolo: 'Tre modi di avviare hello',
    scena: { w: 860, h: 372 },
    atti: ['Lo stato di partenza', 'Prima esecuzione', 'Seconda esecuzione', 'Terza esecuzione', 'Il conteggio finale'],
    nota: 'Ogni esecuzione aggiunge sei passi. Cambia il comando, le righe iniziali e il numero di esecuzioni per vedere esiti diversi.',
    controlli: [
      { id: 'cmd', tipo: 'scelta', eti: 'Comando', opzioni: [['t', './hello'], ['s', './hello > esito'], ['a', './hello >> esito']], valore: 's' },
      { id: 'n', tipo: 'num', eti: 'Righe già nel file', min: 0, max: 3, salti: [1], valore: 2 },
      { id: 'k', tipo: 'num', eti: 'Esecuzioni', min: 1, max: 3, salti: [1], valore: 2 }
    ],
    previsione: {
      domanda: (p) => 'Il file esito contiene ' + p.n + (p.n === 1 ? ' riga' : ' righe') + '. Eseguirai ' + (p.k === 1 ? 'una volta' : p.k + ' volte') + ' il comando ' + ({ t: './hello', s: './hello > esito', a: './hello >> esito' })[p.cmd] + '. Quante righe conterrà il file alla fine?',
      opzioni: (p) => Array.from(new Set([0, 1, p.n, p.k, p.n + p.k])).sort((a, b) => a - b)
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + pred + (pred === 1 ? ' riga' : ' righe') + ' nel file. Il file ne contiene ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' :
      p.cmd === 't' ? 'Senza redirezione l’uscita standard resta collegata al terminale, e il file non viene toccato.' :
      p.cmd === 's' ? 'Il simbolo semplice svuota il file a ogni esecuzione: alla fine resta soltanto la riga scritta dall’ultima.' :
      'Il simbolo raddoppiato conserva il contenuto: ogni esecuzione aggiunge una riga a quelle già presenti.'),
    costruisci(p) {
      const el = SL.el, passi = [];
      const CMD = { t: './hello', s: './hello > esito', a: './hello >> esito' }[p.cmd];
      const ORD = ['prima', 'seconda', 'terza'];
      let file = Array.from({ length: p.n }, (_, i) => ({ id: 'v' + i, t: 'nota' })), schermo = [], seriale = 0;
      let shell = 'in attesa di un comando', proc = null, canale = '·', verso = '', giro = 0;
      const quadro = (o) => {
        o = o || {};
        const els = [
          el.box('sh', 20, 10, 290, 78, 'shell · processo 700', shell, o.att === 'sh' ? 'att' : '', { sim: 'terminale' }),
          el.box('us', 300, 116, 260, 78, 'uscita standard · collegata a', canale, o.att === 'us' ? 'att' : (verso ? 'on' : ''), { sim: 'output' }),
          el.zona('zt', 20, 232, 390, 126, 'terminale · righe comparse', verso === 't' ? 'on' : ''),
          el.zona('zf', 450, 232, 390, 126, 'file esito · righe contenute', verso === 'f' ? 'on' : ''),
          el.linea('lt', 360, 194, 215, 232, verso === 't' ? 'on' : '', verso !== 't'),
          el.linea('lf', 500, 194, 645, 232, verso === 'f' ? 'on' : '', verso !== 'f')
        ];
        if (proc) els.push(el.box('pr', 550, 10, 290, 78, 'processo ' + (701 + giro) + ' · figlio', proc, o.att === 'pr' ? 'att' : 'on', { sim: 'process' }),
          el.linea('l1', 310, 49, 550, 49, o.via === 'crea' ? 'att' : ''), el.linea('l2', 640, 88, 480, 116, o.via === 'scrive' ? 'att' : ''));
        schermo.forEach((r, i) => els.push(el.cella('s' + i, 34 + i * 62, 276, 58, 52, r, o.nuova === 's' + i ? 'att' : 'on', { cls: 'minuta', gi: 'riga ' + (i + 1) })));
        if (!schermo.length) els.push(el.nota('vs', 34, 292, 'nessuna riga', 'mono'));
        file.forEach((r, i) => els.push(el.cella(r.id, 464 + i * 62, 276, 58, 52, r.t, o.nuova === 'f' + i ? 'att' : (o.cancella ? 'err' : (r.t === 'hello' ? 'on' : '')), { cls: 'minuta', gi: 'riga ' + (i + 1) })));
        if (!file.length) els.push(el.nota('vf', 464, 292, 'file vuoto', 'mono', o.vuoto ? 'err' : ''));
        if (o.pacco) els.push(el.pacco('pk', o.pacco[0], o.pacco[1], o.pacco[2], o.pacco[3]));
        return els;
      };
      const hud = () => [['Righe nel file', file.length, 'a'], ['Righe sul terminale', schermo.length], ['Esecuzione', giro ? giro + ' di ' + p.k : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ att: 'sh' }, 0, 'Lo stato di partenza', 'La shell attende un comando. Il file esito ' + (p.n === 0 ? 'esiste ed è vuoto' : 'contiene ' + p.n + (p.n === 1 ? ' riga, scritta' : ' righe, scritte') + ' in precedenza') + '. Sul terminale non è ancora comparso nulla.');

      for (giro = 1; giro <= p.k; giro++) {
        const a = giro, prima = file.length;
        shell = 'ha letto: ' + CMD; proc = null; canale = '·'; verso = '';
        P({ att: 'sh' }, a, 'La shell legge il comando', (p.k > 1 ? 'Comincia la ' + ORD[giro - 1] + ' esecuzione. ' : '') + (p.cmd === 't'
          ? 'Hai digitato ./hello. Il comando contiene soltanto il percorso del programma, senza simboli di redirezione.'
          : 'Hai digitato ' + CMD + '. La shell divide il comando in due parti: il programma da avviare, ./hello, e la destinazione dell’uscita, il file esito. Il simbolo e il nome del file sono per la shell e non verranno passati a hello.'));
        shell = 'attende la fine del figlio'; proc = 'programma: shell (copia)'; canale = 'terminale'; verso = 't';
        P({ att: 'pr', via: 'crea' }, a, 'Nasce il processo figlio', 'Come nell’unità 1.1.5, la shell chiede al sistema operativo un processo figlio, che riceve il PID ' + (701 + giro) + '. Il figlio è una copia della shell e ne eredita anche l’uscita standard, per ora collegata al terminale.',
          giro === 1 && p.cmd !== 't' && prima > 0 ? { chiedi: { d: 'Prima di caricare hello, il figlio prepara la redirezione verso il file esito, che contiene ' + prima + (prima === 1 ? ' riga' : ' righe') + '. Con il comando ' + CMD + ', che cosa accade a quel contenuto?', o: ['Viene cancellato', 'Resta, e la nuova riga andrà in fondo', 'Resta, e la nuova riga andrà in cima'], g: p.cmd === 's' ? 0 : 1, no: p.cmd === 's' ? 'Il simbolo semplice chiede un file svuotato: il contenuto precedente viene cancellato prima della scrittura.' : 'Il simbolo raddoppiato conserva il contenuto e porta la scrittura in fondo al file.' } } : undefined);
        if (p.cmd === 't') {
          P({ att: 'us' }, a, 'Il collegamento resta com’è', 'Il comando non chiede redirezioni, quindi il figlio lascia l’uscita standard collegata al terminale. Il file esito non viene nemmeno aperto.');
        } else if (p.cmd === 's') {
          canale = 'file esito'; verso = 'f';
          if (prima) {
            P({ att: 'us', cancella: true }, a, 'Il file viene aperto e svuotato', 'Il figlio stacca l’uscita standard dal terminale e la collega al file esito. Il simbolo semplice chiede di ripartire da zero: ' + (prima === 1 ? 'la riga presente sta' : 'le ' + prima + ' righe presenti stanno') + ' per essere cancellat' + (prima === 1 ? 'a' : 'e') + '.', { calc: 'righe nel file: ' + prima + ' → 0' });
            file = [];
          } else {
            P({ att: 'us', vuoto: true }, a, 'Il file viene aperto', 'Il figlio stacca l’uscita standard dal terminale e la collega al file esito. Il simbolo semplice chiede di ripartire da zero; il file è già vuoto e resta vuoto.', { calc: 'righe nel file: 0' });
          }
        } else {
          canale = 'file esito, in fondo'; verso = 'f';
          P({ att: 'us' }, a, 'Il file viene aperto in aggiunta', 'Il figlio stacca l’uscita standard dal terminale e la collega al file esito. Il simbolo raddoppiato chiede di conservare il contenuto: ' + (prima === 0 ? 'il file è vuoto, e la scrittura comincerà dall’inizio.' : (prima === 1 ? 'la riga presente resta' : 'le ' + prima + ' righe presenti restano') + ', e la scrittura comincerà subito dopo.'), { calc: 'righe nel file: ' + prima + ' (conservate)' });
        }
        proc = 'programma: hello';
        P({ att: 'pr', via: 'scrive', pacco: [590, 92, 'hello'] }, a, 'hello parte e scrive', 'Il figlio sostituisce il proprio programma con hello, che chiama puts e consegna la riga all’uscita standard. Il programma esegue le stesse istruzioni in ogni caso, e la destinazione del canale non lo riguarda.',
          giro === 1 ? { chiedi: { d: 'L’uscita standard è collegata ' + (verso === 't' ? 'al terminale' : 'al file esito') + '. Dove arriverà la riga?', o: ['Sul terminale', 'Nel file esito', 'In entrambe le destinazioni'], g: verso === 't' ? 0 : 1, no: 'Il canale ha una sola destinazione alla volta, quella preparata prima dell’avvio: ' + (verso === 't' ? 'il terminale.' : 'il file esito.') } } : undefined);
        if (verso === 't') {
          schermo.push('hello');
          P({ att: 'us', nuova: 's' + (schermo.length - 1), pacco: [200, 204, 'hello'] }, a, 'La riga arriva sul terminale', 'Il sistema operativo recapita la riga al terminale, dove compare sotto il comando. Il file esito è rimasto con ' + file.length + (file.length === 1 ? ' riga.' : ' righe.'), { calc: 'righe nel file: ' + file.length + ' (invariate)' });
        } else {
          file.push({ id: 'h' + (seriale++), t: 'hello' });
          P({ att: 'us', nuova: 'f' + (file.length - 1), pacco: [590, 204, 'hello'] }, a, 'La riga arriva nel file', 'Il sistema operativo scrive la riga nel file esito, ' + (file.length === 1 ? 'che ora contiene una riga sola' : 'in fondo alle altre: ora le righe sono ' + file.length) + '. Sul terminale non compare nulla.', { calc: 'righe nel file: ' + (file.length - 1) + ' + 1 = ' + file.length });
        }
        proc = 'terminato · codice 0'; shell = 'ha raccolto il codice 0';
        P({ att: 'sh' }, a, 'hello termina', 'Il programma consegna il codice di uscita 0 e il processo figlio viene raccolto dalla shell. ' + (p.cmd === 't' ? 'La shell torna a mostrare il prompt, sotto la riga appena comparsa.' : 'Il collegamento con il file apparteneva al figlio e scompare con lui. L’uscita standard della shell è rimasta per tutto il tempo sul terminale, dove ora compare il prompt.'),
          giro < p.k && p.cmd === 's' && giro === 1 ? { chiedi: { d: 'Il file contiene ora 1 riga. Stai per eseguire di nuovo ' + CMD + '. Quante righe conterrà dopo?', o: ['1', '2'], g: 0, no: 'Anche la prossima esecuzione svuota il file prima di scrivere: la riga di adesso verrà cancellata e sostituita da una nuova.' } } : undefined);
      }
      giro = p.k; proc = null; canale = '·'; verso = ''; shell = 'in attesa di un comando';
      const fine = file.length;
      P({}, p.k + 1, 'Il conteggio finale', 'Dopo ' + (p.k === 1 ? 'una esecuzione' : p.k + ' esecuzioni') + ' di ' + CMD + ' il file esito contiene ' + fine + (fine === 1 ? ' riga' : ' righe') + ', e sul terminale ' + (schermo.length === 0 ? 'non è comparsa alcuna riga.' : schermo.length === 1 ? 'è comparsa una riga.' : 'sono comparse ' + schermo.length + ' righe.'),
        { calc: p.cmd === 't' ? 'righe nel file = ' + p.n + ' (mai toccato)' : p.cmd === 's' ? 'righe nel file = 1, per qualunque numero di esecuzioni' : 'righe nel file = ' + p.n + ' + ' + p.k + ' = ' + fine });
      return { passi, esito: fine, atti: ['Lo stato di partenza'].concat(['Prima esecuzione', 'Seconda esecuzione', 'Terza esecuzione'].slice(0, p.k), ['Il conteggio finale']) };
    }
  },
  bilancio: {
    regola: [
      'Un programma scrive nella propria uscita standard e lascia ad altri la scelta della destinazione. La shell la prepara prima dell’avvio: il terminale, se il comando non chiede altro, oppure un file.',
      'Con `>` il file viene svuotato e poi scritto. Con `>>` il contenuto resta e la scrittura prosegue in fondo. In entrambi i casi sul terminale non compare la riga.'
    ],
    errori: [
      ['Usare il simbolo semplice per aggiungere.', 'Il comando con `>` cancella il contenuto precedente del file, anche quando la nuova scrittura è più corta.'],
      ['Aspettarsi la riga anche sullo schermo.', 'Il canale ha una sola destinazione. Se è collegato al file, sul terminale la riga non compare.'],
      ['Pensare che hello riceva il nome del file.', 'Il simbolo e il nome del file vengono letti dalla shell e si fermano lì. Il programma parte con l’uscita già collegata.']
    ],
    saFare: ['Dico dove finisce l’uscita di un programma per ciascuno dei tre comandi.', 'Prevedo quante righe contiene un file dopo una serie di redirezioni.', 'Spiego perché il programma resta identico nei tre casi.'],
    esercizi: [
      { d: 'Il file esito contiene 2 righe. Esegui una volta `./hello > esito` e poi due volte `./hello >> esito`. Quante righe contiene il file alla fine?', segnaposto: 'Un numero', giuste: ['3'],
        ok: 'Il primo comando svuota il file e scrive una riga. Gli altri due ne aggiungono una ciascuno.',
        diagnosi: [
          { se: ['5'], msg: 'Hai sommato le tre nuove righe alle due iniziali. Il primo comando, però, svuota il file prima di scrivere.' },
          { se: ['1'], msg: 'Una riga sola resterebbe se tutti e tre i comandi usassero il simbolo semplice. Gli ultimi due usano quello raddoppiato.' },
          { se: ['4'], msg: 'Le due righe iniziali vengono cancellate dal primo comando. Conta le righe a partire dal file svuotato.' }
        ],
        altro: 'Il conteggio è diverso. Segui i tre comandi uno alla volta, annotando il numero di righe dopo ciascuno.',
        indizi: ['Il primo comando usa il simbolo semplice.', 'Dopo il primo comando il file contiene una riga sola.', 'Ciascuno dei due comandi successivi aggiunge una riga in fondo.'],
        svolgimento: ['Dopo `./hello > esito` il file contiene 1 riga: le 2 iniziali sono state cancellate.', 'Dopo il primo `./hello >> esito` le righe sono 2.', 'Dopo il secondo `./hello >> esito` le righe sono 3.'] },
      { d: 'Esegui `./hello > esito`. Che cosa compare sul terminale subito dopo il comando?', guida: 'Scegli la risposta.', o: [
        { t: 'La riga hello', fb: 'L’uscita standard è collegata al file, quindi la riga viene scritta lì.' },
        { t: 'Soltanto il nuovo prompt', ok: true, fb: 'La riga è finita nel file. Sul terminale la shell mostra il prompt successivo.' },
        { t: 'Il contenuto del file esito', fb: 'Nessuno ha chiesto di mostrare il file. La redirezione scrive nel file senza visualizzarlo.' }] },
      { d: 'Quale comando lascia nel file esito esattamente una riga, qualunque fosse il suo contenuto precedente?', guida: 'Scegli la risposta.', o: [
        { t: './hello', fb: 'Senza redirezione il file non viene toccato e conserva le righe che aveva.' },
        { t: './hello > esito', ok: true, fb: 'Il file viene svuotato e riceve l’unica riga scritta da hello.' },
        { t: './hello >> esito', fb: 'L’aggiunta in fondo conserva le righe precedenti, che si sommano alla nuova.' }] }
    ],
    sfida: ['lez01_04_filesystem_ops', 'Operazioni elementari sui file']
  }
});
