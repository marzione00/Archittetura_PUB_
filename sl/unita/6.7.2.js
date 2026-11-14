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
    els.push(el.box(pre + 'c0', o.x, o.y + 114, w3, 54, 'radice · cercare «corso»', f >= 1 ? 'x presente: prosegue' : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'c1', o.x + w3 + 10, o.y + 114, w3, 54, apri ? '/corso · cercare «esiti»' : '/corso · leggere l’elenco', f >= 2 ? serve + (passa ? ' presente: prosegue' : ' assente: arresto') : '·', f >= 2 ? (passa ? (f === 2 ? 'att' : 'on') : 'err') : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'c2', o.x + 2 * (w3 + 10), o.y + 114, w3, 54, 'esiti · leggere i byte', !apri ? (f >= 2 ? 'esterno alla richiesta' : '·') : e === 'dir' ? (f >= 2 ? 'mai raggiunto' : '·') : f >= 3 ? (e === 'aperto' ? 'r presente: prosegue' : 'r assente: arresto') : '·', !apri || e === 'dir' ? (f >= 2 ? 'off' : '') : f >= 3 ? (e === 'aperto' ? (f === 3 ? 'att' : 'on') : 'err') : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'e0', o.x, o.y + 178, w3, 54, 'risposta al programma', f >= 4 ? (e === 'aperto' ? 'descrittore 3' : e === 'elenco' ? 'esiti, bozze' : '−13 · EACCES') : '·', f >= 4 ? (e === 'aperto' || e === 'elenco' ? 'att' : 'err') : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'e1', o.x + w3 + 10, o.y + 178, w3, 54, 'controllo che ha deciso', f >= 4 ? (e === 'dir' || e === 'elenco' ? 'sulla directory /corso' : 'sul file esiti') : '·', f >= 4 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'e2', o.x + 2 * (w3 + 10), o.y + 178, w3, 54, 'controllo sul file', f >= 4 ? (e === 'aperto' || e === 'file' ? 'eseguito' : 'mai eseguito') : '·', f >= 4 ? (e === 'aperto' || e === 'file' ? 'on' : 'zero') : '', { cls: 'stretta' }));
    return els;
  };
  return { ha, esito, PERM, quadro };
})();
SL.registra('6.7.2', {
  titolo: 'Controlli sulle directory e sugli oggetti',
  obiettivo: 'Obiettivo: seguire i controlli di permesso lungo un percorso, e individuare il punto in cui una richiesta è respinta: su una directory attraversata, oppure sul file finale.',
  concetti: [['folder', 'Sulle directory r e x hanno un significato diverso'], ['puntatore', 'Un controllo per ogni componente del percorso'], ['scudo', 'Il medesimo errore, da punti diversi']],
  filigrana: ['folder', 'privilegi', 'file'],
  richiami: {
    carte: [
      { sim: 'folder', da: 'Dall’unità 6.5.2', t: 'Un componente per volta', d: 'Il kernel risolve un percorso cercando ogni nome nella directory appena raggiunta.' },
      { sim: 'privilegi', da: 'Dall’unità 4.2.5', t: 'r, w, x', d: 'I permessi di un file: il peso 4 concede la lettura, il 2 la scrittura, l’1 l’esecuzione.' },
      { sim: 'inode', da: 'Dall’unità 6.5.1', t: 'La directory è un elenco', d: 'Una directory associa a ogni nome il numero di un inode.' }
    ],
    domanda: { d: 'Prima di proseguire: per risolvere il percorso /corso/esiti, in quale directory il kernel cerca il nome «esiti»?', o: [
      { t: 'Nella directory /corso', ok: true, fb: 'Il kernel cerca prima «corso» nella radice, quindi «esiti» nella directory raggiunta.' },
      { t: 'Nella radice', fb: 'Nella radice il kernel cerca il primo componente, «corso».' },
      { t: 'Nella directory corrente', fb: 'Il percorso ha inizio con una barra: la ricerca ha inizio dalla radice.' }
    ] }
  },
  idea: {
    titolo: 'Raggiungere un file, e poterlo leggere',
    termini: ['permesso di elenco', 'permesso di attraversamento'],
    testo: [
      'I permessi dell’unità 4.2.5 erano tre cifre, e in ogni cifra tre bit, indicati con le lettere r, w e x: lettura, scrittura, esecuzione. Su un file il significato è immediato. Anche le directory hanno i propri permessi, scritti con le medesime tre lettere, e in questo caso il significato è diverso. Una directory è un elenco di nomi con i rispettivi inode, come nell’unità 6.5.1, e su un elenco si compiono operazioni diverse da quelle su un file.',
      'Il permesso r su una directory consente di leggere l’elenco dei nomi che contiene, ed è denominato [[permesso di elenco]]. Il permesso x consente di cercare al suo interno un nome già noto, e di raggiungere l’inode corrispondente: è il [[permesso di attraversamento]]. Il permesso w consente di aggiungere e rimuovere nomi. Elenco e attraversamento sono operazioni distinte, benché appaiano equivalenti: è possibile conoscere un nome senza poter leggere gli altri, ed è possibile leggere tutti i nomi senza poter raggiungere gli oggetti che indicano.',
      'Per aprire in lettura /corso/esiti il kernel risolve il percorso come nell’unità 6.5.2, e a ogni componente compie un controllo. Nella radice cerca «corso», e occorre x sulla radice. In /corso cerca «esiti», e occorre x su /corso. Soltanto in seguito, raggiunto l’inode del file, il kernel controlla il permesso richiesto dall’apertura, che per una lettura è r sul file. I controlli sono in successione, e il primo che fallisce termina la richiesta con l’errore EACCES.',
      { fig: 'scena', w: 720, h: 240, titolo: 'Su /corso soltanto r: il file è leggibile, e resta irraggiungibile', nota: 'Per cercare «esiti» in /corso occorre x, che è assente. Il kernel si arresta alla directory, e il permesso di lettura del file resta estraneo alla decisione.', els: SL.unita672.quadro('g', { op: 'apri', dir: 'r', file: 'si' }, 4, { x: 10, y: 4, w: 700 }) },
      'Ne derivano due conseguenze. In primo luogo, un file leggibile da tutti resta irraggiungibile, se una directory del suo percorso nega l’attraversamento: per proteggere molti file è sufficiente negare l’attraversamento della directory che li contiene. In secondo luogo, il codice EACCES non indica quale controllo abbia deciso. Un rifiuto sulla directory indica che il file non è stato raggiunto, e lascia indeterminato se la lettura del file sarebbe stata concessa.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma opera sulla directory /corso, che contiene i file esiti e bozze. I controlli fissano l’operazione, i permessi del programma su /corso, e il permesso di lettura sul file esiti.',
      'L’esperimento segue i controlli del kernel uno per volta, fino alla risposta. È istruttivo confrontare «soltanto x» e «soltanto r» con le due operazioni: ciascun permesso consente un’operazione e nega l’altra.'
    ],
    vedrai: [
      ['folder', 'Il percorso', 'In alto: la radice, la directory /corso e il file esiti, con i permessi del programma su ciascuno.'],
      ['privilegi', 'I controlli', 'Al centro: i controlli nell’ordine, e il punto in cui la richiesta prosegue oppure si arresta.'],
      ['output', 'La risposta', 'In basso: la risposta ricevuta dal programma, il controllo che ha deciso, e l’eventuale controllo sul file.']
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
    nota: 'Il numero dei passi dipende dal punto in cui la richiesta si arresta. Sulla radice il programma ha sempre r e x. Quando è richiesto l’elenco, il permesso sul file è estraneo alla richiesta.',
    previsione: {
      domanda: (p) => 'Un programma richiede di ' + (p.op === 'apri' ? 'aprire in lettura /corso/esiti' : 'leggere l’elenco dei nomi contenuti in /corso') + '. Sulla radice ha r e x. Su /corso ha ' + SL.unita672.PERM[p.dir] + '. Sul file esiti la lettura è ' + (p.file === 'si' ? 'concessa' : 'negata') + '. Che cosa accade?',
      opzioni: (p) => [p.op === 'apri' ? ['aperto', 'L’apertura riesce, e il programma riceve un descrittore'] : ['elenco', 'Il programma riceve l’elenco dei nomi'], ['dir', 'Rifiuto alla directory /corso, prima di raggiungere il file'], ['file', 'Rifiuto sul file esiti, dopo averlo raggiunto']]
    },
    confronto: (pred, esito, p) => { const U = SL.unita672, N = { aperto: 'l’apertura riuscisse', elenco: 'il programma ricevesse l’elenco', dir: 'il rifiuto avvenisse alla directory /corso', file: 'il rifiuto avvenisse sul file esiti' }, E = { aperto: 'L’apertura riesce', elenco: 'Il programma riceve l’elenco', dir: 'Il rifiuto avviene alla directory /corso', file: 'Il rifiuto avviene sul file esiti' }; return 'La previsione indicava che ' + N[pred] + '. ' + E[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.op === 'elenca' ? (esito === 'elenco' ? 'Per leggere l’elenco occorre r sulla directory, che è presente. I permessi del file sono estranei alla richiesta.' : 'Per leggere l’elenco occorre r sulla directory. Il permesso x consente soltanto di cercare un nome già noto.') : esito === 'dir' ? 'Per cercare «esiti» in /corso occorre x. Il permesso r consente soltanto di leggere l’elenco.' : esito === 'file' ? 'Il percorso era percorribile, per effetto di x su /corso. Il rifiuto deriva dal permesso di lettura del file.' : 'Occorrono x su /corso, per raggiungere il file, e r sul file, per leggerlo. Sono presenti entrambi' + (U.ha(p, 'r') ? '.' : ': il permesso r sulla directory è superfluo quando il nome è già noto.')); },
    costruisci(p) {
      const U = SL.unita672, e = U.esito(p), apri = p.op === 'apri', passi = [];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Su /corso', p.dir === 'rx' ? 'r e x' : p.dir, 'a'], ['Deciso da', f >= 4 ? (e === 'dir' || e === 'elenco' ? 'directory' : 'file') : '·'], ['Risposta', f >= 4 ? (e === 'aperto' ? 'descrittore' : e === 'elenco' ? 'elenco' : 'EACCES') : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'La richiesta', apri ? 'Un programma richiede al kernel l’apertura in lettura di /corso/esiti. Il kernel risolve il percorso un componente per volta, e prima di ogni ricerca controlla un permesso.' : 'Un programma richiede al kernel l’elenco dei nomi contenuti in /corso, come avviene quando è visualizzato il contenuto di una directory. Il kernel deve raggiungere la directory, e quindi leggerne le voci.', {});
      P(1, 1, 'La radice', 'Nella radice va cercato il nome «corso». La ricerca di un nome in una directory richiede il permesso x su tale directory. Sulla radice x è presente: il kernel trova «corso», e raggiunge il suo inode.', { calc: 'radice: x presente' });
      if (apri) P(2, 1, 'La directory /corso', U.ha(p, 'x') ? 'In /corso va cercato il nome «esiti». Il permesso x è presente: la ricerca è ammessa, e il kernel raggiunge l’inode del file.' + (p.dir === 'x' ? ' Il permesso r è assente, e in questo caso è superfluo: il nome era già noto.' : '') : 'In /corso va cercato il nome «esiti». Il programma ha soltanto r: potrebbe leggere l’elenco dei nomi, mentre la ricerca di un nome gli è vietata. Il percorso si arresta a questa directory.', Object.assign({ calc: '/corso: x ' + (U.ha(p, 'x') ? 'presente' : 'assente') }, p.dir === 'x' ? { chiedi: { d: 'Su /corso è presente soltanto x. Il programma potrebbe ottenere l’elenco dei nomi?', o: ['No, per l’elenco occorre r', 'Sì, x è sufficiente per ogni operazione'], g: 0, no: 'Il permesso x consente di cercare un nome già noto. Per leggere l’elenco occorre r.' } } : {}));
      else P(2, 1, 'La directory /corso', U.ha(p, 'r') ? 'La lettura dell’elenco dei nomi di una directory richiede il permesso r su tale directory. Il permesso è presente: il kernel può consegnare i nomi.' + (p.dir === 'r' ? ' Il permesso x è assente: i nomi sono leggibili, e gli oggetti che essi indicano restano irraggiungibili.' : '') : 'La lettura dell’elenco dei nomi richiede il permesso r sulla directory. Il programma ha soltanto x: l’elenco gli è negato. Un nome già noto può ancora essere cercato.', { calc: '/corso: r ' + (U.ha(p, 'r') ? 'presente' : 'assente') });
      if (apri && e !== 'dir') P(3, 2, 'Il file esiti', 'Raggiunto l’inode di esiti, il kernel controlla il permesso richiesto dall’apertura, cioè r sul file. ' + (e === 'aperto' ? 'È presente.' : 'Il permesso è assente. Il percorso era percorribile, e il rifiuto deriva dall’oggetto finale.'), { calc: 'esiti: r ' + (e === 'aperto' ? 'presente' : 'assente') });
      P(4, 3, 'La risposta', e === 'aperto' ? 'La open restituisce il descrittore 3. La decisione è dipesa da due permessi diversi: x sulla directory, per raggiungere il file, e r sul file, per leggerlo.' : e === 'elenco' ? 'Il programma riceve i nomi: esiti e bozze. Nessun file è stato aperto, e i permessi di esiti sono rimasti estranei alla decisione.' : e === 'file' ? 'La open restituisce −13, EACCES. Il codice è il medesimo di un rifiuto sulla directory. I due casi si distinguono per il punto raggiunto: in questo caso il kernel ha raggiunto il file.' : apri ? 'La open restituisce −13, EACCES. Il kernel si è arrestato alla directory, e il controllo sul file non è stato eseguito. Il permesso di lettura di esiti, qualunque fosse, è rimasto estraneo alla decisione.' : 'Il kernel restituisce −13, EACCES. La decisione è dipesa dal permesso r della directory.', { esito: [e === 'aperto' ? 'apertura riuscita' : e === 'elenco' ? 'elenco consegnato' : e === 'file' ? 'rifiuto sul file' : 'rifiuto sulla directory', e === 'aperto' || e === 'elenco' ? 'si' : 'no'] });
      return { passi, esito: e };
    }
  },
  bilancio: {
    regola: [
      'Su una directory, r consente di leggere l’elenco dei nomi, x di cercare un nome e raggiungerne l’inode, w di aggiungere e rimuovere nomi.',
      'Per aprire un file occorre x su ogni directory del percorso, e quindi il permesso richiesto sul file. Il primo controllo che fallisce restituisce EACCES.'
    ],
    errori: [
      ['Ritenere che r su una directory sia sufficiente per aprire i file che contiene.', 'Per raggiungere un file occorre x sulla directory. Con il solo r sono leggibili i nomi.'],
      ['Concludere da un EACCES che il file nega la lettura.', 'Il rifiuto può derivare da una directory del percorso, prima del controllo sul file.'],
      ['Omettere la radice dal conteggio dei controlli.', 'Anche nella radice si cerca un nome, e occorre x.']
    ],
    saFare: ['Distinguere elenco e attraversamento di una directory.', 'Seguire i controlli lungo un percorso.', 'Indicare quale controllo ha deciso un rifiuto.'],
    esercizi: [
      { d: 'Un programma apre in lettura /a/b/c/dati, e tutti i permessi necessari sono presenti. Quanti controlli di permesso compie il kernel, contando le directory attraversate e il file?', segnaposto: 'Un numero', giuste: ['5', 'cinque'],
        ok: 'Quattro controlli di x, sulla radice e su a, b, c, e quindi un controllo di r sul file: 5.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'Quattro sono le directory: la radice, a, b e c. Va aggiunto il controllo di lettura sul file.' },
          { se: ['3', 'tre'], msg: 'Va contata anche la radice, in cui si cerca «a», e alla fine il file.' },
          { se: ['1', 'uno'], msg: 'Il controllo sul file è l’ultimo, ed è preceduto da x su ogni directory attraversata.' }
        ],
        altro: 'Il numero è diverso. Si elenchino le directory in cui il kernel cerca un nome, e si aggiunga il file.',
        indizi: ['Nella radice si cerca «a»: un controllo.', 'In a, b e c si cercano «b», «c» e «dati»: altri tre.', 'Infine r sul file: 4 + 1 = 5.'],
        svolgimento: ['Directory attraversate: /, a, b, c.', 'Controlli di x: 4.', 'Controllo di r sul file: 1.', 'Totale: 5.'] },
      { d: 'Su /corso un utente ha soltanto r, e sul file /corso/esiti ha r. Quali operazioni gli sono consentite?', guida: 'Si scelga la risposta.', o: [
        { t: 'Leggere il nome «esiti» nell’elenco, senza poter aprire il file', ok: true, fb: 'L’elenco richiede r. Per raggiungere il file occorrerebbe x sulla directory.' },
        { t: 'Aprire il file, senza poterne leggere il nome nell’elenco', fb: 'Questo accade con il solo x. In questo caso il permesso presente è r.' },
        { t: 'Leggere il nome e aprire il file', fb: 'Il permesso r del file è rilevante soltanto dopo il raggiungimento del file, per il quale occorre x sulla directory.' }] },
      { d: 'Una open di /corso/esiti restituisce EACCES. Che cosa se ne conclude sui permessi del file esiti?', guida: 'Si scelga la risposta.', o: [
        { t: 'Nulla di certo, poiché il rifiuto può derivare dalla directory', ok: true, fb: 'Occorre conoscere il controllo a cui il kernel è giunto.' },
        { t: 'Il file nega la lettura', fb: 'È una delle due possibilità. L’altra è l’assenza di x su /corso.' },
        { t: 'Il file concede la lettura', fb: 'Il codice di errore non fornisce alcuna informazione sui permessi del file.' }] }
    ],
    sfida: ['cslez6_7_03_directory_access', 'Accesso alle directory']
  }
});
