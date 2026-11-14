'use strict';
SL.unita672 = (() => {
  const ha = (p, c) => p.dir.indexOf(c) >= 0;
  const esito = (p) => (p.op === 'elenca' ? (ha(p, 'r') ? 'elenco' : 'dir') : !ha(p, 'x') ? 'dir' : p.file === 'si' ? 'aperto' : 'file');
  const PERM = { x: 'soltanto x', r: 'soltanto r', rx: 'r e x' };
  // f: 0 richiesta · 1 radice · 2 directory /corso · 3 file · 4 risposta
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], e = esito(p), w3 = (o.w - 20) / 3, apri = p.op === 'apri', serve = apri ? 'x' : 'r', passa = ha(p, serve);
    els.push(el.nota(pre + 't0', o.x, o.y, 'IL PERCORSO /corso/esiti · tre oggetti, ciascuno con i propri permessi', 'mono', f === 0 ? 'att' : ''));
    els.push(el.box(pre + 'a0', o.x, o.y + 24, w3, 54, 'directory radice /', 'permessi: r e x', f === 1 ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'a1', o.x + w3 + 10, o.y + 24, w3, 54, 'directory /corso', 'permessi: ' + PERM[p.dir], f === 2 ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'a2', o.x + 2 * (w3 + 10), o.y + 24, w3, 54, 'file esiti', 'lettura: ' + (p.file === 'si' ? 'concessa' : 'negata'), f === 3 ? 'att' : apri ? 'on' : 'off', { cls: 'stretta' }));
    els.push(el.nota(pre + 't1', o.x, o.y + 90, 'I CONTROLLI · nell’ordine in cui il kernel li compie', 'mono', f >= 1 && f <= 3 ? 'att' : ''));
    els.push(el.box(pre + 'c0', o.x, o.y + 114, w3, 54, 'radice · cercare «corso»', f >= 1 ? 'x presente: avanti' : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'c1', o.x + w3 + 10, o.y + 114, w3, 54, apri ? '/corso · cercare «esiti»' : '/corso · leggere l’elenco', f >= 2 ? serve + (passa ? ' presente: avanti' : ' assente: stop') : '·', f >= 2 ? (passa ? (f === 2 ? 'att' : 'on') : 'err') : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'c2', o.x + 2 * (w3 + 10), o.y + 114, w3, 54, 'esiti · leggere i byte', !apri ? (f >= 2 ? 'fuori dalla richiesta' : '·') : e === 'dir' ? (f >= 2 ? 'mai raggiunto' : '·') : f >= 3 ? (e === 'aperto' ? 'r presente: avanti' : 'r assente: stop') : '·', !apri || e === 'dir' ? (f >= 2 ? 'off' : '') : f >= 3 ? (e === 'aperto' ? (f === 3 ? 'att' : 'on') : 'err') : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'e0', o.x, o.y + 178, w3, 54, 'risposta al programma', f >= 4 ? (e === 'aperto' ? 'descrittore 3' : e === 'elenco' ? 'esiti, bozze' : '−13 · EACCES') : '·', f >= 4 ? (e === 'aperto' || e === 'elenco' ? 'att' : 'err') : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'e1', o.x + w3 + 10, o.y + 178, w3, 54, 'controllo che ha deciso', f >= 4 ? (e === 'dir' || e === 'elenco' ? 'sulla directory /corso' : 'sul file esiti') : '·', f >= 4 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'e2', o.x + 2 * (w3 + 10), o.y + 178, w3, 54, 'controllo sul file', f >= 4 ? (e === 'aperto' || e === 'file' ? 'eseguito' : 'mai eseguito') : '·', f >= 4 ? (e === 'aperto' || e === 'file' ? 'on' : 'zero') : '', { cls: 'stretta' }));
    return els;
  };
  return { ha, esito, PERM, quadro };
})();
SL.registra('6.7.2', {
  titolo: 'Controlli sulle directory e sugli oggetti',
  obiettivo: 'Obiettivo: seguire i controlli di permesso lungo un percorso, e dire in quale punto una richiesta viene fermata: su una directory attraversata, oppure sul file finale.',
  concetti: [['folder', 'Sulle directory r e x cambiano significato'], ['puntatore', 'Un controllo per ogni tappa del percorso'], ['scudo', 'Lo stesso errore, da punti diversi']],
  filigrana: ['folder', 'privilegi', 'file'],
  richiami: {
    carte: [
      { sim: 'folder', da: 'Dall’unità 6.5.2', t: 'Un componente alla volta', d: 'Il kernel risolve un percorso cercando ogni nome nella directory appena raggiunta.' },
      { sim: 'privilegi', da: 'Dall’unità 4.2.5', t: 'r, w, x', d: 'I permessi di un file: il peso 4 concede la lettura, il 2 la scrittura, l’1 l’esecuzione.' },
      { sim: 'inode', da: 'Dall’unità 6.5.1', t: 'La directory è un elenco', d: 'Una directory associa a ogni nome il numero di un inode.' }
    ],
    domanda: { d: 'Prima di proseguire: per risolvere il percorso /corso/esiti, in quale directory il kernel cerca il nome «esiti»?', o: [
      { t: 'Nella directory /corso', ok: true, fb: 'Prima cerca «corso» nella radice, poi «esiti» dentro la directory raggiunta.' },
      { t: 'Nella radice', fb: 'Nella radice cerca il primo componente, «corso».' },
      { t: 'Nella directory corrente', fb: 'Il percorso comincia con una barra: si parte dalla radice.' }
    ] }
  },
  idea: {
    titolo: 'Arrivare a un file, e poterlo leggere',
    termini: ['permesso di elenco', 'permesso di attraversamento'],
    testo: [
      'I permessi dell’unità 4.2.5 erano tre cifre, e in ogni cifra tre bit, indicati con le lettere r, w e x: leggere, scrivere, eseguire. Su un file il significato si intuisce subito. Anche le directory hanno i propri permessi, scritti con le stesse tre lettere, e qui il significato cambia. Una directory è un elenco di nomi con i rispettivi inode, come nell’unità 6.5.1, e su un elenco si compiono operazioni diverse da quelle su un file.',
      'Il permesso r su una directory consente di leggere l’elenco dei nomi che contiene. Lo chiamiamo [[permesso di elenco]]. Il permesso x consente di cercare al suo interno un nome già noto, e di raggiungere l’inode corrispondente: è il [[permesso di attraversamento]]. Il permesso w consente di aggiungere e togliere nomi. Elencare e attraversare sembrano la stessa cosa, e sono separati. Si può conoscere un nome senza poter vedere gli altri, e si possono vedere tutti i nomi senza poter raggiungere ciò che indicano.',
      'Per aprire in lettura /corso/esiti il kernel risolve il percorso come nell’unità 6.5.2, e a ogni tappa compie un controllo. Nella radice cerca «corso»: serve x sulla radice. In /corso cerca «esiti»: serve x su /corso. Soltanto dopo, raggiunto l’inode del file, controlla il permesso chiesto dall’apertura, che per una lettura è r sul file. I controlli sono in fila, e il primo che fallisce chiude la richiesta con l’errore EACCES.',
      { fig: 'scena', w: 720, h: 240, titolo: 'Su /corso soltanto r: il file è leggibile, e resta fuori portata', nota: 'Per cercare «esiti» dentro /corso serve x, che manca. Il kernel si ferma alla directory, e il permesso di lettura del file resta fuori dalla decisione.', els: SL.unita672.quadro('g', { op: 'apri', dir: 'r', file: 'si' }, 4, { x: 10, y: 4, w: 700 }) },
      'Da qui vengono due conseguenze. La prima: un file leggibile da tutti resta irraggiungibile, se una directory del suo percorso nega l’attraversamento. Per proteggere molti file basta chiudere la directory che li contiene. La seconda: quando arriva un EACCES, il codice da solo tace su quale controllo abbia deciso. Un rifiuto sulla directory dice che il file è rimasto fuori portata, e lascia aperta la questione se la lettura del file sarebbe stata concessa.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma lavora sulla directory /corso, che contiene i file esiti e bozze. Sceglierai l’operazione, i permessi del programma su /corso, e il permesso di lettura sul file esiti.',
      'Seguiremo i controlli del kernel uno alla volta, fino alla risposta. Confronta «soltanto x» e «soltanto r» con le due operazioni: ciascun permesso apre una porta e lascia chiusa l’altra.'
    ],
    vedrai: [
      ['folder', 'Il percorso', 'In alto: la radice, la directory /corso e il file esiti, con i permessi del programma su ciascuno.'],
      ['privilegi', 'I controlli', 'Al centro: i controlli nell’ordine, e il punto in cui la richiesta prosegue oppure si ferma.'],
      ['output', 'La risposta', 'In basso: ciò che riceve il programma, il controllo che ha deciso, e se il file è stato controllato.']
    ]
  },
  lab: {
    titolo: 'I controlli lungo /corso/esiti',
    scena: { w: 860, h: 240 },
    atti: ['La richiesta', 'Le directory', 'Il file', 'La risposta'],
    controlli: [
      { id: 'op', tipo: 'scelta', eti: 'Operazione', opzioni: [['apri', 'aprire in lettura /corso/esiti'], ['elenca', 'elencare i nomi in /corso']], valore: 'apri' },
      { id: 'dir', tipo: 'scelta', eti: 'Permessi su /corso', opzioni: [['x', 'soltanto x'], ['r', 'soltanto r'], ['rx', 'r e x']], valore: 'r' },
      { id: 'file', tipo: 'scelta', eti: 'Lettura del file esiti', opzioni: [['si', 'concessa'], ['no', 'negata']], valore: 'si' }
    ],
    nota: 'Il numero dei passi dipende dal punto in cui la richiesta si ferma. Sulla radice il programma ha sempre r e x. Quando si chiede l’elenco, il permesso sul file resta fuori dalla richiesta.',
    previsione: {
      domanda: (p) => 'Un programma chiede di ' + (p.op === 'apri' ? 'aprire in lettura /corso/esiti' : 'leggere l’elenco dei nomi contenuti in /corso') + '. Sulla radice ha r e x. Su /corso ha ' + SL.unita672.PERM[p.dir] + '. Sul file esiti la lettura è ' + (p.file === 'si' ? 'concessa' : 'negata') + '. Che cosa accade?',
      opzioni: (p) => [p.op === 'apri' ? ['aperto', 'L’apertura riesce, e il programma riceve un descrittore'] : ['elenco', 'Il programma riceve l’elenco dei nomi'], ['dir', 'Rifiuto alla directory /corso, senza arrivare al file'], ['file', 'Rifiuto sul file esiti, dopo averlo raggiunto']]
    },
    confronto: (pred, esito, p) => { const U = SL.unita672, N = { aperto: 'l’apertura riuscisse', elenco: 'il programma ricevesse l’elenco', dir: 'il rifiuto arrivasse alla directory /corso', file: 'il rifiuto arrivasse sul file esiti' }, E = { aperto: 'L’apertura riesce', elenco: 'Il programma riceve l’elenco', dir: 'Il rifiuto arriva alla directory /corso', file: 'Il rifiuto arriva sul file esiti' }; return 'La previsione indicava che ' + N[pred] + '. ' + E[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.op === 'elenca' ? (esito === 'elenco' ? 'Per leggere l’elenco serve r sulla directory, che è presente. I permessi del file restano fuori dalla richiesta.' : 'Per leggere l’elenco serve r sulla directory. Il permesso x consente soltanto di cercare un nome già noto.') : esito === 'dir' ? 'Per cercare «esiti» dentro /corso serve x. Il permesso r consente soltanto di leggere l’elenco.' : esito === 'file' ? 'Il percorso era libero, grazie a x su /corso. A negare è il permesso di lettura del file.' : 'Servono x su /corso, per raggiungere il file, e r sul file, per leggerlo. Sono presenti entrambi' + (U.ha(p, 'r') ? '.' : ': il permesso r sulla directory è superfluo per chi conosce il nome.')); },
    costruisci(p) {
      const U = SL.unita672, e = U.esito(p), apri = p.op === 'apri', passi = [];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Su /corso', p.dir === 'rx' ? 'r e x' : p.dir, 'a'], ['Deciso da', f >= 4 ? (e === 'dir' || e === 'elenco' ? 'directory' : 'file') : '·'], ['Risposta', f >= 4 ? (e === 'aperto' ? 'descrittore' : e === 'elenco' ? 'elenco' : 'EACCES') : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'La richiesta', apri ? 'Un programma chiede al kernel di aprire in lettura /corso/esiti. Il kernel risolve il percorso un componente alla volta, e prima di ogni ricerca controlla un permesso.' : 'Un programma chiede al kernel l’elenco dei nomi contenuti in /corso, come fa chi mostra il contenuto di una cartella. Il kernel deve raggiungere la directory, e poi leggerne le voci.', {});
      P(1, 1, 'La radice', 'Nella radice va cercato il nome «corso». Cercare un nome dentro una directory richiede il permesso x su quella directory. Sulla radice x è presente: il kernel trova «corso», e raggiunge il suo inode.', { calc: 'radice: x presente' });
      if (apri) P(2, 1, 'La directory /corso', U.ha(p, 'x') ? 'Dentro /corso va cercato il nome «esiti». Il permesso x è presente: la ricerca è ammessa, e il kernel raggiunge l’inode del file.' + (p.dir === 'x' ? ' Il permesso r manca, e qui è superfluo: il nome era già noto.' : '') : 'Dentro /corso va cercato il nome «esiti». Il programma ha soltanto r: potrebbe leggere l’elenco dei nomi, mentre la ricerca di un nome gli è vietata. Il percorso si ferma qui.', Object.assign({ calc: '/corso: x ' + (U.ha(p, 'x') ? 'presente' : 'assente') }, p.dir === 'x' ? { chiedi: { d: 'Su /corso c’è soltanto x. Il programma potrebbe farsi dare l’elenco dei nomi?', o: ['No: per l’elenco serve r', 'Sì: x basta per ogni operazione'], g: 0, no: 'Il permesso x consente di cercare un nome già noto. Per leggere l’elenco serve r.' } } : {}));
      else P(2, 1, 'La directory /corso', U.ha(p, 'r') ? 'Leggere l’elenco dei nomi di una directory richiede il permesso r su quella directory. È presente: il kernel può consegnare i nomi.' + (p.dir === 'r' ? ' Manca x: i nomi si vedono, e gli oggetti dietro i nomi restano irraggiungibili.' : '') : 'Leggere l’elenco dei nomi richiede il permesso r sulla directory. Il programma ha soltanto x: l’elenco gli è negato. Chi conosce già un nome può ancora cercarlo.', { calc: '/corso: r ' + (U.ha(p, 'r') ? 'presente' : 'assente') });
      if (apri && e !== 'dir') P(3, 2, 'Il file esiti', 'Raggiunto l’inode di esiti, il kernel controlla il permesso chiesto dall’apertura, cioè r sul file. ' + (e === 'aperto' ? 'È presente.' : 'Manca. Il percorso era libero, e il rifiuto viene dall’oggetto finale.'), { calc: 'esiti: r ' + (e === 'aperto' ? 'presente' : 'assente') });
      P(4, 3, 'La risposta', e === 'aperto' ? 'La open restituisce il descrittore 3. Hanno deciso due permessi diversi: x sulla directory, per arrivare al file, e r sul file, per leggerlo.' : e === 'elenco' ? 'Il programma riceve i nomi: esiti e bozze. Nessun file è stato aperto, e i permessi di esiti sono rimasti fuori dalla decisione.' : e === 'file' ? 'La open restituisce −13, EACCES. Il codice è lo stesso di un rifiuto sulla directory. A distinguerli è il punto raggiunto: qui il kernel è arrivato fino al file.' : apri ? 'La open restituisce −13, EACCES. Il kernel si è fermato alla directory, e il controllo sul file è rimasto da eseguire. Il permesso di lettura di esiti, qualunque fosse, è rimasto fuori dalla decisione.' : 'Il kernel restituisce −13, EACCES. A decidere è stato il permesso r della directory.', { esito: [e === 'aperto' ? 'apertura riuscita' : e === 'elenco' ? 'elenco consegnato' : e === 'file' ? 'rifiuto sul file' : 'rifiuto sulla directory', e === 'aperto' || e === 'elenco' ? 'si' : 'no'] });
      return { passi, esito: e };
    }
  },
  bilancio: {
    regola: [
      'Su una directory, r consente di leggere l’elenco dei nomi, x di cercare un nome e raggiungerne l’inode, w di aggiungere e togliere nomi.',
      'Per aprire un file serve x su ogni directory del percorso, e poi il permesso chiesto sul file. Il primo controllo che fallisce restituisce EACCES.'
    ],
    errori: [
      ['Credere che r su una directory basti per aprire i file che contiene.', 'Per raggiungere un file serve x sulla directory. Con il solo r si vedono i nomi.'],
      ['Concludere da un EACCES che il file nega la lettura.', 'Il rifiuto può venire da una directory del percorso, prima che il file sia controllato.'],
      ['Dimenticare la radice nel conto dei controlli.', 'Anche nella radice si cerca un nome, e serve x.']
    ],
    saFare: ['Distinguere elenco e attraversamento di una directory.', 'Seguire i controlli lungo un percorso.', 'Indicare quale controllo ha deciso un rifiuto.'],
    esercizi: [
      { d: 'Un programma apre in lettura /a/b/c/dati, e tutti i permessi necessari sono presenti. Quanti controlli di permesso compie il kernel, contando le directory attraversate e il file?', segnaposto: 'Un numero', giuste: ['5', 'cinque'],
        ok: 'Quattro controlli di x, sulla radice e su a, b, c. Poi un controllo di r sul file: 5.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'Quattro sono le directory: la radice, a, b e c. Va aggiunto il controllo di lettura sul file.' },
          { se: ['3', 'tre'], msg: 'Va contata anche la radice, in cui si cerca «a», e alla fine il file.' },
          { se: ['1', 'uno'], msg: 'Il controllo sul file è l’ultimo. Prima viene x su ogni directory attraversata.' }
        ],
        altro: 'Il numero è diverso. Si elenchino le directory in cui il kernel cerca un nome, e si aggiunga il file.',
        indizi: ['Nella radice si cerca «a»: un controllo.', 'In a, b e c si cercano «b», «c» e «dati»: altri tre.', 'Infine r sul file: 4 + 1 = 5.'],
        svolgimento: ['Directory attraversate: /, a, b, c.', 'Controlli di x: 4.', 'Controllo di r sul file: 1.', 'Totale: 5.'] },
      { d: 'Su /corso un utente ha soltanto r. Sul file /corso/esiti ha r. Che cosa può fare?', guida: 'Si scelga la risposta.', o: [
        { t: 'Vedere il nome «esiti» nell’elenco, senza poter aprire il file', ok: true, fb: 'L’elenco richiede r. Per raggiungere il file servirebbe x sulla directory.' },
        { t: 'Aprire il file, senza poterne vedere il nome nell’elenco', fb: 'Questo accade con il solo x. Qui il permesso presente è r.' },
        { t: 'Vedere il nome e aprire il file', fb: 'Il permesso r del file conta soltanto dopo aver raggiunto il file, e per raggiungerlo serve x sulla directory.' }] },
      { d: 'Una open di /corso/esiti restituisce EACCES. Che cosa si può concludere sui permessi del file esiti?', guida: 'Si scelga la risposta.', o: [
        { t: 'Nulla di certo: il rifiuto può venire dalla directory', ok: true, fb: 'Bisogna sapere fino a quale controllo è arrivato il kernel.' },
        { t: 'Il file nega la lettura', fb: 'È una delle due possibilità. L’altra è che manchi x su /corso.' },
        { t: 'Il file concede la lettura', fb: 'Il codice di errore tace sui permessi del file, in un senso e nell’altro.' }] }
    ],
    sfida: ['cslez6_7_03_directory_access', 'Accesso alle directory']
  }
});
