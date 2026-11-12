'use strict';
SL.registra('1.1.4', {
  titolo: 'Nomi, file e shell',
  obiettivo: 'Alla fine saprai seguire un percorso, un nome alla volta, fino al file che indica, partendo da qualsiasi directory.',
  concetti: [['file', 'File'], ['folder', 'Directory'], ['puntatore', 'Percorso'], ['terminale', 'Shell']],
  filigrana: ['folder', 'file', 'terminale'],
  richiami: {
    carte: [
      { sim: 'riproduci', da: 'Dall’unità 1.1.3', t: 'Il file eseguibile', d: 'È l’ultimo file della catena di costruzione, l’unico che può essere avviato.' },
      { sim: 'file', da: 'Dall’unità 1.1.1', t: 'Il file', d: 'Una sequenza di dati conservata su disco sotto un nome. L’uscita di un programma può esservi collegata.' },
      { sim: 'gate', da: 'Dall’unità 1.1.1', t: 'Il sistema operativo', d: 'Governa le risorse condivise, come lo schermo e il disco, per conto di tutti i programmi.' }
    ],
    domanda: { d: 'Prima di proseguire: quale file della catena di costruzione può essere avviato?', o: [
      { t: 'Il sorgente', fb: 'Il sorgente è un testo per le persone. Il processore può eseguire soltanto il file eseguibile.' },
      { t: 'Il file oggetto', fb: 'Nel file oggetto le chiamate alle funzioni di libreria sono ancora in sospeso.' },
      { t: 'Il file eseguibile', ok: true, fb: 'È l’unico in cui tutte le istruzioni e tutte le chiamate sono al loro posto.' }
    ] }
  },
  idea: {
    titolo: 'Un albero di nomi',
    termini: ['directory', 'percorso', 'directory corrente', 'shell'],
    testo: [
      'Il file eseguibile di hello deve stare da qualche parte, e deve poter essere ritrovato. Come ogni file, è una sequenza di dati conservata su disco sotto un nome. I file sono raccolti in contenitori chiamati [[directory]], e una directory può contenere altre directory. Ne nasce una struttura ad albero: in cima c’è una directory speciale, la radice, che si scrive con una barra, `/`.',
      'Per indicare un file si scrive il suo [[percorso]]: l’elenco delle directory da attraversare, separate da barre, seguito dal nome del file. Il percorso `/home/ada/hello` si legge così: parti dalla radice, entra in home, entra in ada, e lì troverai hello. Un percorso che comincia dalla radice si dice assoluto, perché indica lo stesso file da qualunque punto lo si usi.',
      { fig: 'scena', w: 700, h: 256, titolo: 'Un piccolo albero di directory e file', nota: 'Le directory sono in ambra, i file in azzurro. Il file hello esiste due volte, in due directory diverse.', els: [
        SL.el.linea('a', 350, 40, 220, 72), SL.el.linea('b', 350, 40, 540, 72), SL.el.linea('c', 220, 110, 120, 140), SL.el.linea('d', 220, 110, 340, 140), SL.el.linea('e', 540, 110, 540, 140),
        SL.el.linea('f', 120, 178, 60, 210), SL.el.linea('g', 120, 178, 190, 210), SL.el.linea('h', 340, 178, 305, 210), SL.el.linea('i', 340, 178, 430, 210),
        SL.el.box('r', 300, 4, 100, 36, null, '/', 'att'), SL.el.box('ho', 170, 72, 100, 38, null, 'home', 'att'), SL.el.box('et', 490, 72, 100, 38, null, 'etc', 'att'),
        SL.el.box('ad', 70, 140, 100, 38, null, 'ada', 'att'), SL.el.box('br', 290, 140, 100, 38, null, 'bruno', 'att'), SL.el.box('hs', 490, 140, 100, 38, null, 'hosts', 'on'),
        SL.el.box('da', 10, 210, 100, 38, null, 'dati', 'att'), SL.el.box('h1', 140, 210, 100, 38, null, 'hello', 'on'), SL.el.box('no', 250, 210, 110, 38, null, 'note.txt', 'on'), SL.el.box('h2', 380, 210, 100, 38, null, 'hello', 'on')] },
      'Scrivere ogni volta il percorso intero sarebbe scomodo. Per questo ogni programma in esecuzione ha una [[directory corrente]], un «tu sei qui» che fa da punto di partenza. Un percorso che non comincia con la barra si dice relativo e viene seguito a partire dalla directory corrente. Se ti trovi in `/home/ada`, il percorso `dati/voti.txt` conduce a `/home/ada/dati/voti.txt`.',
      'Due nomi speciali esistono in ogni directory. Un punto solo, `.`, indica la directory stessa. Due punti, `..`, indicano la directory che la contiene, un gradino più su nell’albero. Con i due punti un percorso relativo può risalire: da `/home/ada`, il percorso `../bruno/note.txt` sale in `/home` e scende in bruno.',
      'Chi interpreta i comandi che digiti è un programma chiamato [[shell]]. Quando scrivi `./hello`, la shell legge il percorso: il punto indica la directory corrente, e hello è il file da cercare lì dentro. Lo stesso percorso relativo, digitato da due directory diverse, può quindi indicare due file diversi, oppure nessuno.'
    ]
  },
  esperimento: {
    faremo: [
      'Seguiremo un percorso relativo dentro l’albero, un nome alla volta. A ogni nome ci sposteremo di un gradino: in giù, in su, oppure resteremo fermi.',
      'Potrai scegliere la directory di partenza e il percorso. Alcune combinazioni portano a un file, altre si fermano perché un nome non esiste.'
    ],
    vedrai: [
      ['folder', 'L’albero', 'Directory e file disposti su quattro livelli. La directory in cui ci troviamo è accesa in ambra.'],
      ['puntatore', 'Il percorso', 'In alto, diviso nei suoi nomi. Il nome in esame è acceso.'],
      ['file', 'La destinazione', 'Il file raggiunto, se esiste, si accende in azzurro.']
    ]
  },
  lab: {
    titolo: 'Un percorso, un nome alla volta',
    scena: { w: 860, h: 384 },
    atti: ['Preparazione', 'I nomi del percorso', 'Bilancio'],
    nota: 'Il numero di passi dipende dal percorso: due passi per ogni nome, uno per leggerlo e uno per spostarsi.',
    controlli: [
      { id: 'da', tipo: 'scelta', eti: 'Directory di partenza', opzioni: [['/home/ada', '/home/ada'], ['/home/bruno', '/home/bruno'], ['/home/ada/dati', '/home/ada/dati']], valore: '/home/ada' },
      { id: 'via', tipo: 'scelta', eti: 'Percorso', opzioni: [['./hello', './hello'], ['dati/voti.txt', 'dati/voti.txt'], ['../bruno/note.txt', '../bruno/note.txt'], ['../../etc/hosts', '../../etc/hosts'], ['../hello', '../hello']], valore: '../bruno/note.txt' }
    ],
    previsione: {
      domanda: (p) => 'Ti trovi in ' + p.da + ' e segui il percorso ' + p.via + '. Dove arrivi?',
      opzioni: () => ['/home/ada/hello', '/home/bruno/hello', '/home/ada/dati/voti.txt', '/home/bruno/note.txt', '/etc/hosts', 'nessun file']
    },
    confronto: (pred, esito) => 'Avevi previsto ' + (pred === 'nessun file' ? 'che il percorso non portasse ad alcun file' : 'di arrivare a ' + pred) + '. ' + (esito === 'nessun file' ? 'Il percorso si è fermato prima di raggiungere un file.' : 'Il percorso porta a ' + esito + '.') + ' ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Riparti dalla directory di partenza e sposta il dito di un gradino per ogni nome.'),
    costruisci(p) {
      const el = SL.el, passi = [];
      // nodo: [nome, genitore, x, y, èDirectory]
      const N = { '/': ['/', null, 380, 60, 1], '/home': ['home', '/', 230, 130, 1], '/etc': ['etc', '/', 600, 130, 1], '/home/ada': ['ada', '/home', 120, 200, 1], '/home/bruno': ['bruno', '/home', 380, 200, 1], '/etc/hosts': ['hosts', '/etc', 600, 200, 0],
        '/home/ada/dati': ['dati', '/home/ada', 40, 270, 1], '/home/ada/hello': ['hello', '/home/ada', 180, 270, 0], '/home/bruno/note.txt': ['note.txt', '/home/bruno', 320, 270, 0], '/home/bruno/hello': ['hello', '/home/bruno', 460, 270, 0], '/home/ada/dati/voti.txt': ['voti.txt', '/home/ada/dati', 40, 330, 0] };
      const parti = p.via.split('/');
      let qui = p.da, fallito = false;
      const visti = new Set([p.da]);
      const quadro = (k, bersaglio) => {
        const els = [el.nota('tp', 20, 0, 'PERCORSO', 'mono')];
        parti.forEach((s, j) => els.push(el.box('p' + j, 120 + j * 130, 0, 118, 36, null, s, j === k ? 'att' : j < k ? 'on' : '')));
        Object.keys(N).forEach((id) => {
          const n = N[id];
          if (n[1]) els.push(el.linea('l' + id, N[n[1]][2] + 60, N[n[1]][3] + 40, n[2] + 60, n[3], visti.has(id) && visti.has(n[1]) ? 'att' : ''));
          els.push(el.box('n' + id, n[2], n[3], 120, 40, null, n[0], id === qui ? (n[4] ? 'att' : 'on') : id === bersaglio ? 'att' : n[4] ? '' : 'off', { sim: n[4] ? 'folder' : 'file', simL: 24, riga: true, cls: 'stretta' }));
        });
        return els;
      };
      const hud = (nome) => [['Nome in esame', nome == null ? '·' : nome, 'a'], ['Ci troviamo in', qui, 'c']];
      passi.push({ atto: 0, titolo: 'Il punto di partenza', hud: hud(), els: quadro(-1),
        testo: 'La directory corrente è ' + p.da + '. Il percorso da seguire è ' + p.via + ': non comincia con la barra, quindi è relativo e parte da qui.' });
      for (let k = 0; k < parti.length && !fallito; k++) {
        const s = parti[k];
        const tipo = s === '.' ? 0 : s === '..' ? 1 : 2;
        const meta = s === '.' ? qui : s === '..' ? (N[qui][1] || '/') : (qui === '/' ? '/' + s : qui + '/' + s);
        passi.push({ atto: 1, titolo: 'Il nome «' + s + '»', hud: hud(s), els: quadro(k, N[meta] ? meta : null),
          testo: tipo === 0 ? 'Il punto indica la directory in cui ci troviamo già.' : tipo === 1 ? 'I due punti indicano la directory che contiene quella in cui ci troviamo.' : 'Cerchiamo il nome «' + s + '» dentro ' + qui + '.',
          chiedi: { d: 'Dove ci porta il nome «' + s + '»?', o: ['Restiamo dove siamo', 'Saliamo di un gradino', 'Scendiamo in «' + s + '», se esiste'], g: tipo, no: 'Un punto solo indica la directory stessa, due punti la directory che la contiene, ogni altro nome va cercato dentro la directory in cui ci troviamo.' } });
        if (!N[meta]) {
          fallito = true;
          passi.push({ atto: 1, titolo: 'Il nome non esiste', calc: qui + ' non contiene «' + s + '»', esito: ['PERCORSO INTERROTTO', 'no'], hud: hud(s), els: quadro(k),
            testo: 'Nella directory ' + qui + ' non c’è nulla che si chiami «' + s + '». Il percorso si ferma qui e non indica alcun file.' });
        } else {
          const prima = qui; qui = meta; visti.add(qui);
          passi.push({ atto: 1, titolo: tipo === 0 ? 'Restiamo in ' + qui : tipo === 1 ? 'Saliamo in ' + qui : 'Scendiamo in ' + qui, calc: prima + ' → ' + qui, hud: hud(s), els: quadro(k),
            testo: tipo === 0 ? 'Nessuno spostamento: la posizione resta ' + qui + '.' : tipo === 1 ? 'Risaliamo di un gradino e ci troviamo in ' + qui + '.' : (N[qui][4] ? 'Il nome indica una directory. Entriamo e ci troviamo in ' + qui + '.' : 'Il nome indica un file: abbiamo raggiunto ' + qui + '.') });
        }
      }
      const esito = !fallito && !N[qui][4] ? qui : 'nessun file';
      passi.push({ atto: 2, titolo: esito === 'nessun file' ? 'Nessun file raggiunto' : 'Destinazione raggiunta', calc: p.da + ' + ' + p.via + ' → ' + esito, hud: hud(), els: quadro(parti.length),
        testo: esito === 'nessun file' ? 'Da ' + p.da + ' il percorso ' + p.via + ' non porta ad alcun file. Lo stesso percorso, seguito da un’altra directory, potrebbe funzionare.' : 'Da ' + p.da + ' il percorso ' + p.via + ' porta al file ' + esito + '. Questa scrittura, che comincia dalla radice, è il suo percorso assoluto.' });
      return { passi, esito };
    }
  },
  bilancio: {
    regola: [
      'Un percorso è un elenco di nomi separati da barre. Se comincia con la barra parte dalla radice ed è assoluto; altrimenti parte dalla directory corrente ed è relativo.',
      'Il percorso si segue un nome alla volta: un punto lascia fermi, due punti fanno salire di un gradino, ogni altro nome fa scendere nella directory o raggiungere il file con quel nome.'
    ],
    errori: [
      ['Dimenticare la directory corrente.', 'Un percorso relativo non ha significato finché non si sa da dove parte.'],
      ['Contare male le risalite.', 'Ogni coppia di punti fa salire di un solo gradino.'],
      ['Pensare che un nome indichi un solo file.', 'Il nome hello può esistere in più directory, e ciascun file si distingue per il percorso.']
    ],
    saFare: ['Distinguo un percorso assoluto da uno relativo.', 'Seguo un percorso con i nomi speciali punto e due punti.', 'Trasformo un percorso relativo nel percorso assoluto corrispondente.'],
    esercizi: [
      { d: 'Ti trovi in /home/ada/dati. Quale percorso assoluto indica ../../bruno/note.txt?', segnaposto: '/…', eti: 'Il percorso assoluto', giuste: ['/home/bruno/note.txt'],
        ok: 'I primi due punti portano in /home/ada, i secondi in /home. Da lì si scende in bruno e si raggiunge note.txt.',
        diagnosi: [
          { se: ['/home/ada/bruno/note.txt'], msg: 'Sei risalito una volta sola. Il percorso contiene due coppie di punti, quindi i gradini da salire sono due.' },
          { se: ['/bruno/note.txt'], msg: 'Sei risalito fino alla radice. Da /home/ada/dati due risalite portano in /home.' },
          { se: ['/home/ada/dati/bruno/note.txt', '/home/ada/dati/../../bruno/note.txt'], msg: 'Hai accostato i due percorsi senza eseguire le risalite. Ogni coppia di punti cancella l’ultima directory.' },
          { se: ['home/bruno/note.txt'], msg: 'I nomi sono giusti. Un percorso assoluto comincia con la barra della radice.' }
        ],
        altro: 'Il percorso è diverso. Parti da /home/ada/dati e sali di un gradino per ogni coppia di punti, poi scendi.',
        indizi: ['La prima coppia di punti porta da /home/ada/dati a /home/ada.', 'La seconda coppia porta in /home.', 'Da /home si scende in bruno, dove si trova note.txt.'],
        svolgimento: ['Si parte da /home/ada/dati.', 'Due risalite: /home/ada, poi /home.', 'Si scende in bruno e si raggiunge /home/bruno/note.txt.'] },
      { d: 'Il comando ./hello viene digitato una volta in /home/ada e una volta in /home/bruno. Che cosa indica nei due casi?', guida: 'Scegli la risposta.', o: [
        { t: 'Lo stesso file', fb: 'Il punto indica la directory corrente, che nei due casi è diversa.' },
        { t: 'Due file diversi', ok: true, fb: 'Il percorso è relativo: nel primo caso indica /home/ada/hello, nel secondo /home/bruno/hello.' },
        { t: 'Nessun file', fb: 'In entrambe le directory dell’esempio esiste un file di nome hello.' }] }
    ],
    sfida: ['lez01_03_special_paths', 'Nomi e percorsi nel file system']
  }
});
