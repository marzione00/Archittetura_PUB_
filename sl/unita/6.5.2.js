'use strict';
SL.unita652 = (() => {
  const DIR = { 2: { nome: '/', voci: { '.': 2, '..': 2, corso: 7, casa: 11 } }, 7: { nome: '/corso', voci: { '.': 7, '..': 2, testo: 31 } }, 11: { nome: '/casa', voci: { '.': 11, '..': 2, testo: 55 } } };
  const risolvi = (p) => { const ass = p.path[0] === '/', comp = p.path.split('/').filter((c) => c), T = []; let qui = ass ? 2 : p.cwd; T.push({ tipo: 'partenza', qui, ass }); for (let k = 0; k < comp.length; k++) { const c = comp[k], d = DIR[qui]; if (!d) { T.push({ tipo: 'nondir', k, c, qui }); return { T, comp, fine: 'errore' }; } const n = d.voci[c]; if (n == null) { T.push({ tipo: 'manca', k, c, qui }); return { T, comp, fine: 'errore' }; } T.push({ tipo: 'trovato', k, c, qui, n }); qui = n; } return { T, comp, fine: qui }; };
  const mostra = (comp, k, ass) => (ass ? '/' : '') + comp.map((c, j) => (j === k ? '[' + c + ']' : c)).join('/');
  // s: passo della risoluzione (oppure null) · fine: inode finale, 'errore' oppure null
  const quadro = (pre, p, s, fine, o) => {
    const el = SL.el, els = [], w3 = (o.w - 20) / 3, R = risolvi(p), ass = p.path[0] === '/';
    [[2, 'corso 7 · casa 11'], [7, '. 7 · .. 2 · testo 31'], [11, '. 11 · .. 2 · testo 55']].forEach((d, k) => els.push(el.box(pre + 'd' + k, o.x + k * (w3 + 10), o.y, w3, 54, 'directory ' + DIR[d[0]].nome + ' · inode ' + d[0], d[1], s && s.qui === d[0] && s.tipo !== 'partenza' ? (s.tipo === 'manca' ? 'err' : 'att') : s && s.tipo === 'partenza' && s.qui === d[0] ? 'att' : p.cwd === d[0] ? 'on' : '', { cls: 'stretta' })));
    els.push(el.box(pre + 'p', o.x, o.y + 64, w3, 54, 'componente in esame', s && s.k != null ? mostra(R.comp, s.k, ass) : p.path, s && s.k != null ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'q', o.x + w3 + 10, o.y + 64, w3, 54, 'si cerca nella directory', s ? DIR[s.qui].nome + ' · inode ' + s.qui : '·', s ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'r', o.x + 2 * (w3 + 10), o.y + 64, w3, 54, 'inode raggiunto', fine != null ? (fine === 'errore' ? 'nessuno · errore' : String(fine)) : s && s.tipo === 'trovato' ? String(s.n) : s && s.tipo === 'manca' ? 'nome assente' : '·', fine === 'errore' || (s && s.tipo === 'manca') ? 'err' : fine != null || (s && s.tipo === 'trovato') ? 'att' : '', { cls: 'stretta' }));
    return els;
  };
  return { DIR, risolvi, mostra, quadro };
})();
SL.registra('6.5.2', {
  titolo: 'Risolvere un percorso',
  obiettivo: 'Obiettivo: risolvere un percorso un componente per volta, annotando la directory in cui si cerca e l’inode raggiunto, e individuare il punto in cui una ricerca fallisce.',
  concetti: [['puntatore', 'Un percorso è una lista di nomi'], ['folder', 'Ogni nome si cerca in una directory'], ['inode', 'Ogni ricerca fornisce un inode']],
  filigrana: ['folder', 'puntatore', 'inode'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 1.1.4', t: 'Il percorso', d: 'L’elenco delle directory da attraversare per raggiungere un file. È assoluto se ha inizio dalla radice, relativo se ha inizio dalla directory corrente.' },
      { sim: 'folder', da: 'Dall’unità 6.5.1', t: 'La voce di directory', d: 'L’associazione fra un nome e un numero di inode.' },
      { sim: 'inode', da: 'Dall’unità 6.5.1', t: 'L’inode', d: 'La struttura che descrive un file. Per il sistema il file coincide con il suo inode.' }
    ],
    domanda: { d: 'Prima di proseguire: una directory contiene la voce «testo → 31». Che cosa ottiene il sistema cercando in essa il nome «testo»?', o: [
      { t: 'Il numero di inode 31', ok: true, fb: 'La directory associa i nomi ai numeri di inode.' },
      { t: 'Il contenuto del file', fb: 'Il contenuto si trova nei blocchi, raggiungibili soltanto attraverso l’inode.' },
      { t: 'Il percorso completo del file', fb: 'Una voce contiene un nome e un numero. Il percorso si ricostruisce attraversando le directory.' }
    ] }
  },
  idea: {
    titolo: 'Un nome per volta, una directory per volta',
    termini: ['componente del percorso', 'risoluzione del percorso'],
    testo: [
      'Nell’unità precedente è stato cercato un nome in una directory. Un percorso come /casa/testo richiede di ripetere l’operazione più volte in successione. Il sistema lo divide nei suoi nomi, separati dalle barre: ciascuno è un [[componente del percorso]]. I componenti sono quindi esaminati da sinistra a destra, e il sistema conserva a ogni passo una posizione, cioè la directory raggiunta in quel momento.',
      'Il procedimento prende il nome di [[risoluzione del percorso]], e segue tre regole. La prima riguarda il punto di partenza: se il percorso ha inizio con una barra la ricerca ha inizio dalla radice, altrimenti dalla directory corrente del processo. La seconda riguarda il passo: il componente è cercato nella directory raggiunta, e l’inode trovato diviene la nuova posizione. La terza riguarda l’arresto: se il nome è assente, la risoluzione fallisce in quel punto, e il sistema restituisce un errore.',
      { fig: 'scena', w: 720, h: 130, titolo: 'Il percorso ./testo, risolto da /corso', nota: 'Il componente «testo» è cercato nella directory /corso, la cui voce conduce all’inode 31.', els: SL.unita652.quadro('g', { cwd: 7, path: './testo' }, SL.unita652.risolvi({ cwd: 7, path: './testo' }).T[2], null, { x: 10, y: 4, w: 700 }) },
      'Due nomi speciali compaiono in ogni directory, e sono voci ordinarie. Il nome «.» conduce alla directory stessa, e il nome «..» alla directory che la contiene, il padre. Per «risalire» è pertanto sufficiente il meccanismo ordinario: il sistema cerca «..» come qualunque altro nome, e trova il numero di inode del padre. Nella radice, «..» conduce alla radice stessa.',
      'Ne segue che il medesimo percorso relativo può condurre a file diversi. Se la directory corrente è /corso, il percorso ./testo cerca «testo» in /corso, e raggiunge l’inode 31. Se la directory corrente è /casa, il medesimo percorso cerca «testo» in /casa, e raggiunge l’inode 55. Il percorso assoluto /casa/testo ha invece inizio in ogni caso dalla radice, e fornisce 55 da qualunque posizione.',
      'Quando una risoluzione fallisce, il punto del fallimento si individua sempre con il medesimo metodo: si scrive una riga per ogni componente, con la directory in cui è stato cercato e l’inode ottenuto. La prima riga priva di inode indica il punto esatto. Un errore su un percorso lungo riguarda quasi sempre un solo componente, cercato in una directory diversa da quella attesa.'
    ]
  },
  esperimento: {
    faremo: [
      'Un albero di piccole dimensioni: la radice contiene «corso» e «casa», e ciascuna delle due contiene un file «testo», con inode diversi. I controlli fissano la directory corrente e il percorso da risolvere.',
      'L’esperimento risolve il percorso un componente per volta. È istruttivo risolvere il medesimo percorso relativo dalle due directory, e quindi un percorso assoluto.'
    ],
    vedrai: [
      ['folder', 'Le tre directory', 'In alto: le voci di ciascuna directory, con i numeri di inode. È evidenziata quella in cui avviene la ricerca.'],
      ['puntatore', 'Il percorso', 'In basso a sinistra: il percorso, con il componente in esame fra parentesi quadre.'],
      ['inode', 'Il risultato', 'In basso a destra: la directory interrogata e l’inode raggiunto.']
    ]
  },
  lab: {
    titolo: 'Il medesimo percorso da due directory',
    scena: { w: 860, h: 130 },
    atti: ['La partenza', 'I componenti', 'L’arrivo'],
    controlli: [
      { id: 'cwd', tipo: 'scelta', eti: 'Directory corrente', opzioni: [[7, '/corso'], [11, '/casa']], valore: 7 },
      { id: 'path', tipo: 'scelta', eti: 'Percorso', opzioni: [['./testo', './testo'], ['../casa/testo', '../casa/testo'], ['/casa/testo', '/casa/testo'], ['./note', './note']], valore: './testo' }
    ],
    nota: 'Il numero dei passi dipende dal percorso. /corso ha inode 7 e contiene «testo» con inode 31. /casa ha inode 11 e contiene «testo» con inode 55.',
    previsione: {
      domanda: (p) => 'La radice contiene «corso» e «casa». La directory /corso contiene «testo», con inode 31. La directory /casa contiene «testo», con inode 55. La directory corrente è ' + SL.unita652.DIR[p.cwd].nome + '. Quale inode raggiunge il percorso ' + p.path + '?',
      opzioni: () => [[31, 'L’inode 31'], [55, 'L’inode 55'], ['errore', 'Nessuno, poiché la risoluzione fallisce']]
    },
    confronto: (pred, esito, p) => { const N = (v) => (v === 'errore' ? 'un errore' : 'l’inode ' + v); return 'La previsione indicava ' + N(pred) + '. La risoluzione fornisce ' + N(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'errore' ? 'Nella directory ' + SL.unita652.DIR[p.cwd].nome + ' manca una voce con il nome «note».' : p.path[0] === '/' ? 'Il percorso ha inizio con una barra: la ricerca ha inizio dalla radice, e la directory corrente è irrilevante.' : p.path.indexOf('..') === 0 ? 'Il componente «..» conduce alla radice, da cui «casa» conduce alla directory /casa.' : 'Il percorso è relativo: «testo» è cercato nella directory corrente, ' + SL.unita652.DIR[p.cwd].nome + '.'); },
    costruisci(p) {
      const U = SL.unita652, R = U.risolvi(p), passi = [], D = U.DIR;
      const P = (s, fine, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Posizione', s ? (s.tipo === 'trovato' ? 'inode ' + s.n : D[s.qui].nome) : D[p.cwd].nome, 'a'], ['Componente', s && s.c ? s.c : '·'], ['Inode', fine != null ? (fine === 'errore' ? 'errore' : String(fine)) : '·', 'c']], els: U.quadro('b', p, s, fine, { x: 20, y: 4, w: 820 }) }, extra));
      P(null, null, 0, 'Il percorso da risolvere', 'Il processo ha come directory corrente ' + D[p.cwd].nome + ', e richiede l’apertura di ' + p.path + '. I componenti sono ' + R.comp.map((c) => '«' + c + '»').join(', ').replace(/, ([^,]*)$/, ' e $1') + '.', {});
      R.T.forEach((s, k) => {
        if (s.tipo === 'partenza') P(s, null, 0, 'Il punto di partenza', s.ass ? 'Il percorso ha inizio con una barra: è assoluto. La ricerca ha inizio dalla radice, inode 2, qualunque sia la directory corrente.' : 'Il percorso ha inizio senza barra: è relativo. La ricerca ha inizio dalla directory corrente, ' + D[s.qui].nome + ', inode ' + s.qui + '.', { calc: 'partenza: ' + D[s.qui].nome + ' · inode ' + s.qui, chiedi: { d: 'Se la directory corrente fosse un’altra, il punto di partenza sarebbe diverso?', o: s.ass ? ['No, un percorso assoluto ha sempre inizio dalla radice', 'Sì'] : ['Sì, un percorso relativo ha inizio dalla directory corrente', 'No'], g: 0, no: s.ass ? 'La barra iniziale fissa la partenza nella radice.' : 'Senza barra iniziale la ricerca ha inizio dalla directory corrente del processo.' } });
        else if (s.tipo === 'trovato') P(s, null, 1, 'Componente «' + s.c + '»', 'Il sistema cerca «' + s.c + '» nella directory ' + D[s.qui].nome + '. La voce esiste, e conduce all’inode ' + s.n + '. ' + (s.c === '.' ? 'È la directory stessa: la posizione resta invariata.' : s.c === '..' ? 'È la directory padre: la posizione sale di un livello.' : D[s.n] ? 'È una directory: diviene la nuova posizione.' : 'È un file: il percorso ha raggiunto la destinazione.'), { calc: D[s.qui].nome + ' · «' + s.c + '» → inode ' + s.n });
        else P(s, null, 1, 'Componente «' + s.c + '»', 'Il sistema cerca «' + s.c + '» nella directory ' + D[s.qui].nome + '. Nessuna voce ha questo nome, e la risoluzione si arresta a questo componente.', { calc: D[s.qui].nome + ' · «' + s.c + '» assente' });
      });
      const u = R.T[R.T.length - 1];
      P(u, R.fine, 2, 'L’arrivo', R.fine === 'errore' ? 'La risoluzione è fallita sul componente «' + u.c + '», cercato in ' + D[u.qui].nome + '. Il sistema restituisce un errore, e nessun file è aperto.' : 'Tutti i componenti sono stati esaminati. Il percorso ' + p.path + ', risolto a partire da ' + D[p.cwd].nome + ', raggiunge l’inode ' + R.fine + '.', { esito: [R.fine === 'errore' ? 'errore: nome assente' : 'inode ' + R.fine, R.fine === 'errore' ? 'no' : 'si'] });
      return { passi, esito: R.fine };
    }
  },
  bilancio: {
    regola: [
      'Partenza: la radice se il percorso ha inizio con una barra, altrimenti la directory corrente.',
      'Per ogni componente: lo si cerca nella directory raggiunta, e l’inode trovato diviene la nuova posizione. «.» è la directory stessa, «..» il padre.'
    ],
    errori: [
      ['Leggere un percorso relativo senza stabilirne il punto di partenza.', 'Il medesimo percorso, da due directory correnti diverse, può raggiungere due file diversi.'],
      ['Trattare «..» come un comando speciale.', 'È una voce della directory, con il numero di inode del padre.'],
      ['Cercare l’errore nell’ultimo componente.', 'La risoluzione si arresta al primo nome assente, che può trovarsi in qualunque punto del percorso.']
    ],
    saFare: ['Stabilire il punto di partenza di un percorso.', 'Risolvere un percorso componente per componente.', 'Individuare il componente su cui una risoluzione fallisce.'],
    esercizi: [
      { d: 'La radice contiene «a», con inode 5. La directory /a contiene «b», con inode 9, e /a/b contiene «c», con inode 12. Quante ricerche in una directory occorrono per risolvere /a/b/c?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Una ricerca per componente: «a» nella radice, «b» in /a, «c» in /a/b.',
        diagnosi: [
          { se: ['1', 'una', 'uno'], msg: 'Ogni componente va cercato nella propria directory.' },
          { se: ['4', 'quattro'], msg: 'La radice è il punto di partenza, già noto al sistema.' }
        ],
        altro: 'Il numero è diverso. Si contino i componenti del percorso.',
        indizi: ['I componenti sono «a», «b» e «c».', 'Ciascuno richiede una ricerca.', 'Tre ricerche.'],
        svolgimento: ['«a» nella radice → 5.', '«b» in /a → 9.', '«c» in /a/b → 12.'] },
      { d: 'Nel medesimo albero la directory corrente è /a/b. Quale inode raggiunge il percorso ../b/c?', segnaposto: 'Un numero', giuste: ['12', 'dodici'],
        ok: '«..» conduce a /a, inode 5, «b» conduce a /a/b, inode 9, e «c» conduce all’inode 12.',
        diagnosi: [
          { se: ['9', 'nove'], msg: 'Nove è l’inode di /a/b. Resta da cercare l’ultimo componente, «c».' },
          { se: ['5', 'cinque'], msg: 'Cinque è l’inode di /a, raggiunto dal primo componente. Ne restano due.' }
        ],
        altro: 'Il numero è diverso. Si risolvano i tre componenti uno per volta, a partire da /a/b.',
        indizi: ['«..» da /a/b conduce a /a.', '«b» in /a conduce a /a/b.', '«c» in /a/b ha inode 12.'],
        svolgimento: ['«..» → inode 5.', '«b» → inode 9.', '«c» → inode 12.'] },
      { d: 'Un programma apre il percorso dati/voti e riceve un errore. Il medesimo programma, avviato da un’altra directory, lo apre senza errori. Qual è la spiegazione più plausibile?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il percorso è relativo, e nella prima directory corrente manca «dati»', ok: true, fb: 'Un percorso senza barra iniziale ha inizio dalla directory corrente.' },
        { t: 'Il file è stato cancellato fra le due esecuzioni', fb: 'In tal caso fallirebbe anche la seconda esecuzione.' },
        { t: 'Il percorso è assoluto, e la radice è cambiata', fb: 'Il percorso è privo di barra iniziale, e la radice è la medesima per tutti i processi.' }] }
    ],
    sfida: ['cslez6_5_02_path_resolution', 'Risoluzione dei percorsi']
  }
});
