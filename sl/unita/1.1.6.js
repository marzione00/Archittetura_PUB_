'use strict';
SL.registra('1.1.6', {
  titolo: 'Seguire hello attraverso il sistema',
  obiettivo: 'Obiettivo: indicare la destinazione della riga scritta da hello in base al comando di avvio, e prevedere il contenuto di un file dopo una sequenza di comandi.',
  concetti: [['terminale', 'Terminale'], ['output', 'Uscita standard'], ['file', 'File']],
  filigrana: ['file', 'terminale', 'output'],
  richiami: {
    carte: [
      { sim: 'output', da: 'Dall’unità 1.1.1', t: 'L’uscita standard', d: 'È il canale, già aperto all’avvio, al quale il programma trasmette il testo da scrivere.' },
      { sim: 'file', da: 'Dalle unità 1.1.1 e 1.1.4', t: 'Il file', d: 'Sequenza di dati conservata su disco e identificata da un nome, raggiungibile mediante un percorso.' },
      { sim: 'process', da: 'Dall’unità 1.1.5', t: 'Il processo figlio', d: 'La shell avvia ogni programma in un processo figlio, creato allo scopo e nel quale viene poi caricato il programma.' }
    ],
    domanda: { d: 'Prima di proseguire: da chi è creato il processo nel quale viene eseguito hello?', o: [
      { t: 'Dal file eseguibile', fb: 'Il file su disco è inerte. La creazione è richiesta dalla shell al sistema operativo.' },
      { t: 'Dalla shell, con una richiesta al sistema operativo', ok: true, fb: 'La shell richiede un processo figlio, nel quale viene poi caricato hello.' },
      { t: 'Dal programma hello', fb: 'All’avvio di hello il processo esiste già: è stato richiesto dalla shell.' }
    ] }
  },
  idea: {
    titolo: 'Un programma e tre destinazioni',
    termini: ['terminale', 'redirezione'],
    testo: [
      'L’unità 1.1.1 ha seguito il testo di hello dall’uscita standard fino alla destinazione, e ha mostrato che la destinazione è stabilita all’esterno del programma. Il compito di hello si esaurisce con la trasmissione del testo al canale. Restano da stabilire due aspetti: chi sceglie la destinazione, e in quale momento.',
      'La scelta spetta a chi avvia il programma, cioè alla shell, e precede l’avvio. Di norma la shell collega l’uscita standard al [[terminale]], la finestra nella quale si digitano i comandi e si leggono le risposte. Un simbolo aggiunto al comando richiede un collegamento diverso.',
      'Il comando `./hello > esito` richiede il collegamento dell’uscita standard al file esito. Questa deviazione prende il nome di [[redirezione]]. La shell la predispone nel processo figlio, prima del caricamento di hello: un file assente viene creato, un file esistente viene svuotato. Il programma viene quindi avviato, e scrive nel modo consueto. La riga è registrata nel file, e sul terminale compare soltanto il prompt successivo.',
      'Il comando `./hello >> esito` impiega il simbolo raddoppiato, e differisce per un solo aspetto: il contenuto del file è conservato, e la nuova riga è aggiunta in coda a quelle presenti.',
      { fig: 'scena', w: 700, h: 190, titolo: 'Tre comandi, tre destinazioni', nota: 'Il simbolo semplice svuota il file prima della scrittura. Il simbolo raddoppiato conserva il contenuto e scrive in coda.', els: [
        SL.el.box('a1', 10, 10, 240, 46, null, './hello', '', { sim: 'terminale', riga: true }),
        SL.el.linea('l1', 250, 33, 420, 33, 'att'),
        SL.el.box('b1', 420, 10, 270, 46, null, 'terminale', 'att', { sim: 'output', riga: true }),
        SL.el.box('a2', 10, 72, 240, 46, null, './hello > esito', '', { sim: 'terminale', riga: true }),
        SL.el.linea('l2', 250, 95, 420, 95, 'on'),
        SL.el.box('b2', 420, 72, 270, 46, null, 'file esito, svuotato', 'on', { sim: 'file', riga: true }),
        SL.el.box('a3', 10, 134, 240, 46, null, './hello >> esito', '', { sim: 'terminale', riga: true }),
        SL.el.linea('l3', 250, 157, 420, 157, 'on'),
        SL.el.box('b3', 420, 134, 270, 46, null, 'file esito, in coda', 'on', { sim: 'file', riga: true })] },
      'Nei tre casi il programma eseguito è identico, istruzione per istruzione; la sola differenza risiede nel collegamento predisposto dalla shell prima dell’avvio. È il vantaggio dell’interposizione di un canale fra il programma e la destinazione: lo stesso programma scrive sullo schermo, in un file oppure, come si vedrà nel seguito del corso, verso un altro programma.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento avvia hello da una a tre volte, sempre con lo stesso comando, scelto fra i tre descritti. Il file esito esiste già, e il numero di righe che contiene è selezionabile.',
      'A ogni esecuzione la riga è seguita dal processo all’uscita standard, e da questa alla destinazione. La grandezza oggetto della previsione è il numero di righe contenute nel file.'
    ],
    vedrai: [
      ['terminale', 'La shell e il processo', 'In alto. La shell legge il comando; accanto compare il processo figlio nel quale viene eseguito hello.'],
      ['output', 'L’uscita standard', 'Al centro. Il riquadro indica la destinazione alla quale il canale è collegato in quel momento.'],
      ['file', 'Le due destinazioni', 'In basso. A sinistra le righe comparse sul terminale, a destra le righe contenute nel file esito.']
    ]
  },
  lab: {
    titolo: 'Tre modi di avviare hello',
    scena: { w: 860, h: 372 },
    atti: ['Stato iniziale', 'Prima esecuzione', 'Seconda esecuzione', 'Terza esecuzione', 'Conteggio finale'],
    nota: 'Ogni esecuzione aggiunge sei passi. Il comando, le righe iniziali e il numero di esecuzioni sono modificabili.',
    controlli: [
      { id: 'cmd', tipo: 'scelta', eti: 'Comando', opzioni: [['t', './hello'], ['s', './hello > esito'], ['a', './hello >> esito']], valore: 's' },
      { id: 'n', tipo: 'num', eti: 'Righe iniziali nel file', min: 0, max: 3, salti: [1], valore: 2 },
      { id: 'k', tipo: 'num', eti: 'Esecuzioni', min: 1, max: 3, salti: [1], valore: 2 }
    ],
    previsione: {
      domanda: (p) => 'Il file esito contiene ' + p.n + (p.n === 1 ? ' riga' : ' righe') + '. Viene eseguito ' + (p.k === 1 ? 'una volta' : p.k + ' volte') + ' il comando ' + ({ t: './hello', s: './hello > esito', a: './hello >> esito' })[p.cmd] + '. Quante righe contiene il file al termine?',
      opzioni: (p) => Array.from(new Set([0, 1, p.n, p.k, p.n + p.k])).sort((a, b) => a - b)
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + (pred === 1 ? ' riga' : ' righe') + ' nel file. Il file ne contiene ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' :
      p.cmd === 't' ? 'In assenza di redirezione l’uscita standard resta collegata al terminale, e il file resta invariato.' :
      p.cmd === 's' ? 'Il simbolo semplice svuota il file a ogni esecuzione: al termine resta soltanto la riga scritta dall’ultima.' :
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

      P({ att: 'sh' }, 0, 'Stato iniziale', 'La shell attende un comando. Il file esito ' + (p.n === 0 ? 'esiste ed è vuoto' : 'contiene ' + p.n + (p.n === 1 ? ' riga, scritta' : ' righe, scritte') + ' in precedenza') + '. Sul terminale non è ancora comparsa alcuna riga.');

      for (giro = 1; giro <= p.k; giro++) {
        const a = giro, prima = file.length;
        shell = 'ha letto: ' + CMD; proc = null; canale = '·'; verso = '';
        P({ att: 'sh' }, a, 'Lettura del comando da parte della shell', (p.k > 1 ? 'Comincia la ' + ORD[giro - 1] + ' esecuzione. ' : '') + (p.cmd === 't'
          ? 'È stato digitato ./hello. Il comando contiene soltanto il percorso del programma, senza simboli di redirezione.'
          : 'È stato digitato ' + CMD + '. La shell suddivide il comando in due parti: il programma da avviare, ./hello, e la destinazione dell’uscita, il file esito. Il simbolo e il nome del file sono destinati alla shell, e restano esclusi da ciò che viene trasmesso a hello.'));
        shell = 'attende la fine del figlio'; proc = 'programma: shell (copia)'; canale = 'terminale'; verso = 't';
        P({ att: 'pr', via: 'crea' }, a, 'Creazione del processo figlio', 'Come nell’unità 1.1.5, la shell richiede al sistema operativo un processo figlio, al quale è assegnato il PID ' + (701 + giro) + '. Il figlio è una copia della shell e ne eredita anche l’uscita standard, per ora collegata al terminale.',
          giro === 1 && p.cmd !== 't' && prima > 0 ? { chiedi: { d: 'Prima del caricamento di hello il figlio predispone la redirezione verso il file esito, che contiene ' + prima + (prima === 1 ? ' riga' : ' righe') + '. Con il comando ' + CMD + ', quale sorte ha quel contenuto?', o: ['Viene cancellato', 'Viene conservato, e la nuova riga è aggiunta in coda', 'Viene conservato, e la nuova riga è posta in testa'], g: p.cmd === 's' ? 0 : 1, no: p.cmd === 's' ? 'Il simbolo semplice richiede un file svuotato: il contenuto precedente è cancellato prima della scrittura.' : 'Il simbolo raddoppiato conserva il contenuto, e colloca la scrittura in coda al file.' } } : undefined);
        if (p.cmd === 't') {
          P({ att: 'us' }, a, 'Collegamento invariato', 'Il comando è privo di redirezioni, e il figlio lascia l’uscita standard collegata al terminale. Il file esito resta chiuso.');
        } else if (p.cmd === 's') {
          canale = 'file esito'; verso = 'f';
          if (prima) {
            P({ att: 'us', cancella: true }, a, 'Apertura del file e cancellazione del contenuto', 'Il figlio scollega l’uscita standard dal terminale e la collega al file esito. Il simbolo semplice richiede un file vuoto: ' + (prima === 1 ? 'la riga presente sta' : 'le ' + prima + ' righe presenti stanno') + ' per essere cancellat' + (prima === 1 ? 'a' : 'e') + '.', { calc: 'righe nel file: ' + prima + ' → 0' });
            file = [];
          } else {
            P({ att: 'us', vuoto: true }, a, 'Apertura del file', 'Il figlio scollega l’uscita standard dal terminale e la collega al file esito. Il simbolo semplice richiede un file vuoto; il file è già vuoto, e tale resta.', { calc: 'righe nel file: 0' });
          }
        } else {
          canale = 'file esito, in coda'; verso = 'f';
          P({ att: 'us' }, a, 'Apertura del file in aggiunta', 'Il figlio scollega l’uscita standard dal terminale e la collega al file esito. Il simbolo raddoppiato richiede la conservazione del contenuto: ' + (prima === 0 ? 'il file è vuoto, e la scrittura comincerà dall’inizio.' : (prima === 1 ? 'la riga presente resta' : 'le ' + prima + ' righe presenti restano') + ', e la scrittura comincerà subito dopo.'), { calc: 'righe nel file: ' + prima + ' (conservate)' });
        }
        proc = 'programma: hello';
        P({ att: 'pr', via: 'scrive', pacco: [590, 92, 'hello'] }, a, 'Avvio di hello e scrittura', 'Il figlio sostituisce il proprio programma con hello, che chiama puts e trasmette la riga all’uscita standard. Il programma esegue in ogni caso le stesse istruzioni, e ignora la destinazione del canale.',
          giro === 1 ? { chiedi: { d: 'L’uscita standard è collegata ' + (verso === 't' ? 'al terminale' : 'al file esito') + '. Qual è la destinazione della riga?', o: ['Sul terminale', 'Nel file esito', 'In entrambe le destinazioni'], g: verso === 't' ? 0 : 1, no: 'Il canale ha una sola destinazione alla volta, quella predisposta prima dell’avvio: ' + (verso === 't' ? 'il terminale.' : 'il file esito.') } } : undefined);
        if (verso === 't') {
          schermo.push('hello');
          P({ att: 'us', nuova: 's' + (schermo.length - 1), pacco: [200, 204, 'hello'] }, a, 'La riga giunge sul terminale', 'Il sistema operativo trasmette la riga al terminale, dove compare sotto il comando. Il file esito è rimasto con ' + file.length + (file.length === 1 ? ' riga.' : ' righe.'), { calc: 'righe nel file: ' + file.length + ' (invariate)' });
        } else {
          file.push({ id: 'h' + (seriale++), t: 'hello' });
          P({ att: 'us', nuova: 'f' + (file.length - 1), pacco: [590, 204, 'hello'] }, a, 'La riga è scritta nel file', 'Il sistema operativo scrive la riga nel file esito, ' + (file.length === 1 ? 'che ora contiene una riga sola' : 'in coda alle altre: ora le righe sono ' + file.length) + '. Sul terminale non compare alcuna riga.', { calc: 'righe nel file: ' + (file.length - 1) + ' + 1 = ' + file.length });
        }
        proc = 'terminato · codice 0'; shell = 'ha raccolto il codice 0';
        P({ att: 'sh' }, a, 'hello termina', 'Il programma trasmette il codice di uscita 0, e il processo figlio viene raccolto dalla shell. ' + (p.cmd === 't' ? 'La shell ripresenta il prompt, sotto la riga appena comparsa.' : 'Il collegamento con il file apparteneva al figlio, e cessa con esso. L’uscita standard della shell è rimasta per l’intera sequenza collegata al terminale, sul quale compare ora il prompt.'),
          giro < p.k && p.cmd === 's' && giro === 1 ? { chiedi: { d: 'Il file contiene ora 1 riga. Sta per essere eseguito di nuovo ' + CMD + '. Quante righe conterrà al termine?', o: ['1', '2'], g: 0, no: 'Anche la prossima esecuzione svuota il file prima della scrittura: la riga attuale sarà cancellata e sostituita da una nuova.' } } : undefined);
      }
      giro = p.k; proc = null; canale = '·'; verso = ''; shell = 'in attesa di un comando';
      const fine = file.length;
      P({}, p.k + 1, 'Conteggio finale', 'Dopo ' + (p.k === 1 ? 'una esecuzione' : p.k + ' esecuzioni') + ' di ' + CMD + ' il file esito contiene ' + fine + (fine === 1 ? ' riga' : ' righe') + ', e sul terminale ' + (schermo.length === 0 ? 'non è comparsa alcuna riga.' : schermo.length === 1 ? 'è comparsa una riga.' : 'sono comparse ' + schermo.length + ' righe.'),
        { calc: p.cmd === 't' ? 'righe nel file = ' + p.n + ' (mai aperto)' : p.cmd === 's' ? 'righe nel file = 1, per qualunque numero di esecuzioni' : 'righe nel file = ' + p.n + ' + ' + p.k + ' = ' + fine });
      return { passi, esito: fine, atti: ['Stato iniziale'].concat(['Prima esecuzione', 'Seconda esecuzione', 'Terza esecuzione'].slice(0, p.k), ['Conteggio finale']) };
    }
  },
  bilancio: {
    regola: [
      'Un programma scrive sulla propria uscita standard, e lascia ad altri la scelta della destinazione. La shell la predispone prima dell’avvio: il terminale, se il comando è privo di redirezioni, oppure un file.',
      'Con `>` il file viene svuotato e quindi scritto. Con `>>` il contenuto è conservato, e la scrittura prosegue in coda. In entrambi i casi la riga è assente dal terminale.'
    ],
    errori: [
      ['Impiegare il simbolo semplice per aggiungere.', 'Il comando con `>` cancella il contenuto precedente del file, anche quando la nuova scrittura è più corta.'],
      ['Attendersi la riga anche sullo schermo.', 'Il canale ha una sola destinazione. Se è collegato al file, la riga è assente dal terminale.'],
      ['Ritenere che hello riceva il nome del file.', 'Il simbolo e il nome del file sono letti dalla shell, che li trattiene. Il programma viene avviato con l’uscita già collegata.']
    ],
    saFare: ['Indicare la destinazione dell’uscita di un programma per ciascuno dei tre comandi.', 'Prevedere il numero di righe contenute in un file dopo una sequenza di redirezioni.', 'Spiegare perché il programma resta identico nei tre casi.'],
    esercizi: [
      { d: 'Il file esito contiene 2 righe. Viene eseguito una volta `./hello > esito`, e poi due volte `./hello >> esito`. Quante righe contiene il file al termine?', segnaposto: 'Un numero', giuste: ['3'],
        ok: 'Il primo comando svuota il file e scrive una riga. Gli altri due ne aggiungono una ciascuno.',
        diagnosi: [
          { se: ['5'], msg: 'Le tre nuove righe sono state sommate alle due iniziali. Il primo comando, tuttavia, svuota il file prima della scrittura.' },
          { se: ['1'], msg: 'Una riga sola resterebbe se tutti e tre i comandi usassero il simbolo semplice. Gli ultimi due usano quello raddoppiato.' },
          { se: ['4'], msg: 'Le due righe iniziali sono cancellate dal primo comando. Il conto va ripreso dal file svuotato.' }
        ],
        altro: 'Il conteggio è diverso. Si seguano i tre comandi uno alla volta, annotando il numero di righe dopo ciascuno.',
        indizi: ['Il primo comando usa il simbolo semplice.', 'Dopo il primo comando il file contiene una riga sola.', 'Ciascuno dei due comandi successivi aggiunge una riga in fondo.'],
        svolgimento: ['Dopo `./hello > esito` il file contiene 1 riga: le 2 iniziali sono state cancellate.', 'Dopo il primo `./hello >> esito` le righe sono 2.', 'Dopo il secondo `./hello >> esito` le righe sono 3.'] },
      { d: 'Viene eseguito `./hello > esito`. Che cosa compare sul terminale subito dopo il comando?', guida: 'Si scelga la risposta.', o: [
        { t: 'La riga hello', fb: 'L’uscita standard è collegata al file, e la riga è scritta in esso.' },
        { t: 'Soltanto il nuovo prompt', ok: true, fb: 'La riga è stata registrata nel file. Sul terminale la shell presenta il prompt successivo.' },
        { t: 'Il contenuto del file esito', fb: 'La visualizzazione del file non è stata richiesta. La redirezione scrive nel file senza presentarne il contenuto.' }] },
      { d: 'Quale comando lascia nel file esito esattamente una riga, qualunque fosse il suo contenuto precedente?', guida: 'Si scelga la risposta.', o: [
        { t: './hello', fb: 'In assenza di redirezione il file resta invariato, e conserva le righe che aveva.' },
        { t: './hello > esito', ok: true, fb: 'Il file viene svuotato e riceve l’unica riga scritta da hello.' },
        { t: './hello >> esito', fb: 'L’aggiunta in coda conserva le righe precedenti, alle quali si somma la nuova.' }] }
    ],
    sfida: ['lez01_04_filesystem_ops', 'Operazioni elementari sui file']
  }
});
