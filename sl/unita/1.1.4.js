'use strict';
SL.registra('1.1.4', {
  titolo: 'Nomi, file e shell',
  obiettivo: 'Obiettivo: risolvere un percorso, un nome alla volta, fino al file indicato, a partire da una directory qualsiasi.',
  concetti: [['file', 'File'], ['folder', 'Directory'], ['puntatore', 'Percorso'], ['terminale', 'Shell']],
  filigrana: ['folder', 'file', 'terminale'],
  richiami: {
    carte: [
      { sim: 'riproduci', da: 'Dall’unità 1.1.3', t: 'Il file eseguibile', d: 'È l’ultimo file della catena di costruzione, il solo che può essere avviato.' },
      { sim: 'file', da: 'Dall’unità 1.1.1', t: 'Il file', d: 'Sequenza di dati conservata su disco e identificata da un nome. L’uscita di un programma può esservi collegata.' },
      { sim: 'gate', da: 'Dall’unità 1.1.1', t: 'Il sistema operativo', d: 'Gestisce le risorse condivise, come lo schermo e il disco, per conto di tutti i programmi.' }
    ],
    domanda: { d: 'Prima di proseguire: quale file della catena di costruzione può essere avviato?', o: [
      { t: 'Il sorgente', fb: 'Il sorgente è un testo destinato alle persone. Il processore può eseguire soltanto il file eseguibile.' },
      { t: 'Il file oggetto', fb: 'Nel file oggetto le chiamate alle funzioni di libreria sono ancora irrisolte.' },
      { t: 'Il file eseguibile', ok: true, fb: 'È il solo nel quale tutte le istruzioni sono presenti e tutte le chiamate sono collegate.' }
    ] }
  },
  idea: {
    titolo: 'Directory, percorsi e shell',
    termini: ['directory', 'percorso', 'directory corrente', 'shell'],
    testo: [
      'Il file eseguibile di hello risiede su disco, e deve poter essere individuato. Come ogni file, è una sequenza di dati identificata da un nome. I file sono raccolti in contenitori denominati [[directory]], e una directory può contenerne altre. Ne risulta una struttura ad albero, al cui vertice si trova una directory particolare, la radice, indicata da una barra, `/`.',
      'Un file è indicato dal suo [[percorso]]: l’elenco delle directory da attraversare, separate da barre, seguito dal nome del file. Il percorso `/home/ada/hello` indica il file hello contenuto nella directory ada, a sua volta contenuta nella directory home della radice. Un percorso che comincia dalla radice si dice assoluto, poiché indica lo stesso file qualunque sia il punto da cui viene impiegato.',
      { fig: 'scena', w: 700, h: 256, titolo: 'Un piccolo albero di directory e file', nota: 'Le directory sono in ambra, i file in azzurro. Il file hello è presente in due directory diverse.', els: [
        SL.el.linea('a', 350, 40, 220, 72), SL.el.linea('b', 350, 40, 540, 72), SL.el.linea('c', 220, 110, 120, 140), SL.el.linea('d', 220, 110, 340, 140), SL.el.linea('e', 540, 110, 540, 140),
        SL.el.linea('f', 120, 178, 60, 210), SL.el.linea('g', 120, 178, 190, 210), SL.el.linea('h', 340, 178, 305, 210), SL.el.linea('i', 340, 178, 430, 210),
        SL.el.box('r', 300, 4, 100, 36, null, '/', 'att'), SL.el.box('ho', 170, 72, 100, 38, null, 'home', 'att'), SL.el.box('et', 490, 72, 100, 38, null, 'etc', 'att'),
        SL.el.box('ad', 70, 140, 100, 38, null, 'ada', 'att'), SL.el.box('br', 290, 140, 100, 38, null, 'bruno', 'att'), SL.el.box('hs', 490, 140, 100, 38, null, 'hosts', 'on'),
        SL.el.box('da', 10, 210, 100, 38, null, 'dati', 'att'), SL.el.box('h1', 140, 210, 100, 38, null, 'hello', 'on'), SL.el.box('no', 250, 210, 110, 38, null, 'note.txt', 'on'), SL.el.box('h2', 380, 210, 100, 38, null, 'hello', 'on')] },
      'Per evitare la scrittura del percorso completo, a ogni programma in esecuzione è associata una [[directory corrente]], che funge da punto di partenza. Un percorso privo della barra iniziale si dice relativo, ed è risolto a partire dalla directory corrente. Dalla directory `/home/ada`, il percorso `dati/voti.txt` conduce a `/home/ada/dati/voti.txt`.',
      'In ogni directory sono presenti due nomi particolari. Un punto, `.`, indica la directory stessa. Due punti, `..`, indicano la directory che la contiene, cioè il livello superiore dell’albero. Mediante i due punti un percorso relativo può risalire: da `/home/ada`, il percorso `../bruno/note.txt` risale a `/home` e discende in bruno.',
      'I comandi digitati sono interpretati da un programma denominato [[shell]]. Alla digitazione di `./hello` la shell risolve il percorso: il punto indica la directory corrente, e hello è il file da cercarvi. Lo stesso percorso relativo, digitato da due directory diverse, può pertanto indicare due file diversi, oppure nessuno.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento risolve un percorso relativo all’interno dell’albero, un nome alla volta. A ogni nome la posizione scende di un livello, risale di un livello, oppure resta invariata.',
      'Sono selezionabili la directory di partenza e il percorso. Alcune combinazioni conducono a un file; altre si arrestano, perché un nome è assente.'
    ],
    vedrai: [
      ['folder', 'L’albero', 'Directory e file disposti su quattro livelli. La directory raggiunta è evidenziata in ambra.'],
      ['puntatore', 'Il percorso', 'In alto, suddiviso nei suoi nomi. Il nome in esame è evidenziato.'],
      ['file', 'La destinazione', 'Il file raggiunto, se esiste, è evidenziato in azzurro.']
    ]
  },
  lab: {
    titolo: 'Risoluzione di un percorso, un nome alla volta',
    scena: { w: 860, h: 384 },
    atti: ['Preparazione', 'I nomi del percorso', 'Bilancio'],
    nota: 'Il numero dei passi dipende dal percorso: due passi per ogni nome, la lettura e l’aggiornamento della posizione.',
    controlli: [
      { id: 'da', tipo: 'scelta', eti: 'Directory di partenza', opzioni: [['/home/ada', '/home/ada'], ['/home/bruno', '/home/bruno'], ['/home/ada/dati', '/home/ada/dati']], valore: '/home/ada' },
      { id: 'via', tipo: 'scelta', eti: 'Percorso', opzioni: [['./hello', './hello'], ['dati/voti.txt', 'dati/voti.txt'], ['../bruno/note.txt', '../bruno/note.txt'], ['../../etc/hosts', '../../etc/hosts'], ['../hello', '../hello']], valore: '../bruno/note.txt' }
    ],
    previsione: {
      domanda: (p) => 'La directory corrente è ' + p.da + ', e il percorso da risolvere è ' + p.via + '. Qual è la destinazione?',
      opzioni: () => ['/home/ada/hello', '/home/bruno/hello', '/home/ada/dati/voti.txt', '/home/bruno/note.txt', '/etc/hosts', 'nessun file']
    },
    confronto: (pred, esito) => 'La previsione indicava ' + (pred === 'nessun file' ? 'che il percorso fosse privo di destinazione' : 'come destinazione ' + pred) + '. ' + (esito === 'nessun file' ? 'Il percorso si è arrestato prima di raggiungere un file.' : 'Il percorso conduce a ' + esito + '.') + ' ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Occorre ripartire dalla directory di partenza, e procedere di un livello per ogni nome.'),
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
      const hud = (nome) => [['Nome in esame', nome == null ? '·' : nome, 'a'], ['Directory raggiunta', qui, 'c']];
      passi.push({ atto: 0, titolo: 'Punto di partenza', hud: hud(), els: quadro(-1),
        testo: 'La directory corrente è ' + p.da + '. Il percorso da seguire è ' + p.via + ': è privo della barra iniziale, ed è quindi relativo alla directory corrente.' });
      for (let k = 0; k < parti.length && !fallito; k++) {
        const s = parti[k];
        const tipo = s === '.' ? 0 : s === '..' ? 1 : 2;
        const meta = s === '.' ? qui : s === '..' ? (N[qui][1] || '/') : (qui === '/' ? '/' + s : qui + '/' + s);
        passi.push({ atto: 1, titolo: 'Il nome «' + s + '»', hud: hud(s), els: quadro(k, N[meta] ? meta : null),
          testo: tipo === 0 ? 'Il punto indica la directory già raggiunta.' : tipo === 1 ? 'I due punti indicano la directory che contiene quella raggiunta.' : 'Ricerca del nome «' + s + '» dentro ' + qui + '.',
          chiedi: { d: 'Quale effetto ha il nome «' + s + '»?', o: ['La posizione resta invariata', 'La posizione risale di un livello', 'La posizione scende in «' + s + '», se esiste'], g: tipo, no: 'Un punto indica la directory stessa, due punti la directory che la contiene; ogni altro nome va cercato all’interno della directory raggiunta.' } });
        if (!N[meta]) {
          fallito = true;
          passi.push({ atto: 1, titolo: 'Nome assente', calc: qui + ' non contiene «' + s + '»', esito: ['PERCORSO INTERROTTO', 'no'], hud: hud(s), els: quadro(k),
            testo: 'Nella directory ' + qui + ' è assente ogni elemento di nome «' + s + '». Il percorso si arresta, e resta privo di destinazione.' });
        } else {
          const prima = qui; qui = meta; visti.add(qui);
          passi.push({ atto: 1, titolo: tipo === 0 ? 'Posizione invariata: ' + qui : tipo === 1 ? 'Risalita a ' + qui : 'Discesa in ' + qui, calc: prima + ' → ' + qui, hud: hud(s), els: quadro(k),
            testo: tipo === 0 ? 'Nessuna variazione: la posizione resta ' + qui + '.' : tipo === 1 ? 'La posizione risale di un livello, a ' + qui + '.' : (N[qui][4] ? 'Il nome indica una directory. La posizione scende in ' + qui + '.' : 'Il nome indica un file: è stato raggiunto ' + qui + '.') });
        }
      }
      const esito = !fallito && !N[qui][4] ? qui : 'nessun file';
      passi.push({ atto: 2, titolo: esito === 'nessun file' ? 'Nessun file raggiunto' : 'Destinazione raggiunta', calc: p.da + ' + ' + p.via + ' → ' + esito, hud: hud(), els: quadro(parti.length),
        testo: esito === 'nessun file' ? 'Da ' + p.da + ' il percorso ' + p.via + ' è privo di destinazione. Lo stesso percorso, risolto a partire da un’altra directory, può avere esito diverso.' : 'Da ' + p.da + ' il percorso ' + p.via + ' conduce al file ' + esito + '. Questa scrittura, che comincia dalla radice, è il suo percorso assoluto.' });
      return { passi, esito };
    }
  },
  bilancio: {
    regola: [
      'Un percorso è un elenco di nomi separati da barre. Se comincia con la barra parte dalla radice ed è assoluto; in caso contrario parte dalla directory corrente ed è relativo.',
      'Il percorso si risolve un nome alla volta: un punto lascia invariata la posizione, due punti la fanno risalire di un livello, ogni altro nome la fa scendere nella directory omonima oppure raggiunge il file omonimo.'
    ],
    errori: [
      ['Trascurare la directory corrente.', 'Un percorso relativo è privo di significato finché resta ignoto il punto di partenza.'],
      ['Errare nel conto delle risalite.', 'Ogni coppia di punti fa risalire di un solo livello.'],
      ['Ritenere che un nome indichi un solo file.', 'Il nome hello può essere presente in più directory, e ciascun file è distinto dal percorso.']
    ],
    saFare: ['Distinguere un percorso assoluto da uno relativo.', 'Risolvere un percorso che contiene i nomi punto e due punti.', 'Convertire un percorso relativo nel percorso assoluto corrispondente.'],
    esercizi: [
      { d: 'La directory corrente è /home/ada/dati. Quale percorso assoluto corrisponde a ../../bruno/note.txt?', segnaposto: '/…', eti: 'Il percorso assoluto', giuste: ['/home/bruno/note.txt'],
        ok: 'La prima coppia di punti conduce a /home/ada, la seconda a /home. Da qui si scende in bruno e si raggiunge note.txt.',
        diagnosi: [
          { se: ['/home/ada/bruno/note.txt'], msg: 'È stata eseguita una sola risalita. Il percorso contiene due coppie di punti, e i livelli da risalire sono due.' },
          { se: ['/bruno/note.txt'], msg: 'La risalita è stata prolungata fino alla radice. Da /home/ada/dati due risalite conducono a /home.' },
          { se: ['/home/ada/dati/bruno/note.txt', '/home/ada/dati/../../bruno/note.txt'], msg: 'I due percorsi sono stati accostati senza eseguire le risalite. Ogni coppia di punti elimina l’ultima directory.' },
          { se: ['home/bruno/note.txt'], msg: 'I nomi sono corretti. Un percorso assoluto comincia con la barra della radice.' }
        ],
        altro: 'Il percorso è diverso. Si parta da /home/ada/dati, si risalga di un livello per ogni coppia di punti, e poi si scenda.',
        indizi: ['La prima coppia di punti conduce da /home/ada/dati a /home/ada.', 'La seconda coppia conduce a /home.', 'Da /home si scende in bruno, dove si trova note.txt.'],
        svolgimento: ['Si parte da /home/ada/dati.', 'Due risalite: /home/ada, poi /home.', 'Si scende in bruno e si raggiunge /home/bruno/note.txt.'] },
      { d: 'Il comando ./hello viene digitato una volta in /home/ada e una volta in /home/bruno. Che cosa indica nei due casi?', guida: 'Si scelga la risposta.', o: [
        { t: 'Lo stesso file', fb: 'Il punto indica la directory corrente, che nei due casi è diversa.' },
        { t: 'Due file diversi', ok: true, fb: 'Il percorso è relativo: nel primo caso indica /home/ada/hello, nel secondo /home/bruno/hello.' },
        { t: 'Nessun file', fb: 'In entrambe le directory dell’esempio esiste un file di nome hello.' }] }
    ],
    sfida: ['lez01_03_special_paths', 'Nomi e percorsi nel file system']
  }
});
