'use strict';
SL.unita671 = (() => {
  const DIRITTI = { studente: { lettura: 1, modifica: 0 }, docente: { lettura: 1, modifica: 1 } };
  const esito = (p) => (p.chi === 'nessuno' ? 'auth' : DIRITTI[p.chi][p.op] ? 'concessa' : 'negata');
  // f: 0 richiesta · 1 autenticazione · 2 autorizzazione · 3 effetto sul fascicolo
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], e = esito(p), w3 = (o.w - 20) / 3, noto = p.chi !== 'nessuno', mod = e === 'concessa' && p.op === 'modifica';
    els.push(el.nota(pre + 't0', o.x, o.y, 'LA RICHIESTA · chi la presenta, e che cosa chiede', 'mono', f === 0 ? 'att' : ''));
    els.push(el.box(pre + 'r0', o.x, o.y + 24, w3, 54, 'credenziali presentate', p.chi === 'studente' ? 'di uno studente' : p.chi === 'docente' ? 'di un docente' : 'nessuna', f === 0 ? 'att' : noto ? 'on' : 'zero', { cls: 'stretta' }));
    els.push(el.box(pre + 'r1', o.x + w3 + 10, o.y + 24, w3, 54, 'operazione chiesta', p.op, f === 0 ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'r2', o.x + 2 * (w3 + 10), o.y + 24, w3, 54, 'oggetto', 'fascicolo del corso', f === 0 ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.nota(pre + 't1', o.x, o.y + 90, 'IL SERVIZIO · due controlli in fila, poi l’effetto', 'mono', f >= 1 ? 'att' : ''));
    els.push(el.box(pre + 's0', o.x, o.y + 114, w3, 54, 'autenticazione · chi sei', f >= 1 ? (noto ? 'sessione: ' + p.chi : 'identità ignota') : '·', f === 1 ? (noto ? 'att' : 'err') : f > 1 ? (noto ? 'on' : 'err') : '', { cls: 'stretta' }));
    els.push(el.box(pre + 's1', o.x + w3 + 10, o.y + 114, w3, 54, 'autorizzazione · puoi farlo', f >= 2 ? (!noto ? 'mai consultata' : e === 'concessa' ? 'diritto presente' : 'diritto assente') : '·', f >= 2 ? (!noto ? 'off' : e === 'concessa' ? (f === 2 ? 'att' : 'on') : 'err') : '', { cls: 'stretta' }));
    els.push(el.box(pre + 's2', o.x + 2 * (w3 + 10), o.y + 114, w3, 54, 'fascicolo', f >= 3 ? (mod ? 'contenuto aggiornato' : e === 'concessa' ? 'contenuto restituito' : 'intatto e riservato') : '·', f >= 3 ? (e === 'concessa' ? 'att' : 'zero') : '', { cls: 'stretta' }));
    els.push(el.nota(pre + 't2', o.x, o.y + 180, 'LA POLITICA · i diritti di ogni ruolo', 'mono', f === 2 && noto ? 'att' : ''));
    els.push(el.box(pre + 'p0', o.x, o.y + 204, w3, 54, 'ruolo studente', 'lettura', f === 2 && p.chi === 'studente' ? 'att' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'p1', o.x + w3 + 10, o.y + 204, w3, 54, 'ruolo docente', 'lettura e modifica', f === 2 && p.chi === 'docente' ? 'att' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'p2', o.x + 2 * (w3 + 10), o.y + 204, w3, 54, 'modifiche applicate', f >= 3 ? (mod ? '1' : '0') : '·', f >= 3 ? (mod ? 'att' : 'zero') : '', { cls: 'stretta' }));
    return els;
  };
  return { DIRITTI, esito, quadro };
})();
SL.registra('6.7.1', {
  titolo: 'Autenticazione e autorizzazione sul fascicolo',
  obiettivo: 'Obiettivo: separare i due controlli che un servizio compie davanti a una richiesta: stabilire chi la presenta, e decidere se quella identità ha diritto all’operazione.',
  concetti: [['chiave', 'Prima domanda: chi sei'], ['privilegi', 'Seconda domanda: puoi farlo'], ['bilancio', 'Lo stesso zero, due storie']],
  filigrana: ['chiave', 'privilegi', 'file'],
  richiami: {
    carte: [
      { sim: 'privilegi', da: 'Dall’unità 1.7.4', t: 'La politica di accesso', d: 'Una regola stabilisce chi può compiere un’operazione, a partire da ruoli e permessi.' },
      { sim: 'scudo', da: 'Dall’unità 4.2.5', t: 'Meccanismo e politica', d: 'Il modo di raggiungere un servizio è uguale per tutti. L’esito dipende da chi chiede, e da che cosa chiede.' },
      { sim: 'inode', da: 'Dall’unità 6.5.1', t: 'I permessi fra i metadati', d: 'L’inode di un file conserva anche il proprietario e i permessi.' }
    ],
    domanda: { d: 'Prima di proseguire: nell’unità 4.2.5 un utente chiedeva di leggere un file con i permessi 0600, di cui era proprietario un altro. Che cosa restituiva il kernel?', o: [
      { t: '−13, cioè EACCES: accesso negato', ok: true, fb: 'La cifra degli altri era 0, senza il permesso di lettura.' },
      { t: 'Un descrittore di file', fb: 'Il descrittore arriva quando la politica concede l’apertura. Qui la negava.' },
      { t: 'Il contenuto del file', fb: 'Una open restituisce un descrittore oppure un errore. Qui restituiva l’errore.' }
    ] }
  },
  idea: {
    titolo: 'Due domande in fila: chi sei, e che cosa puoi fare',
    termini: ['account', 'credenziali', 'autenticazione', 'sessione', 'autorizzazione'],
    testo: [
      'Pensa al fascicolo di un corso, conservato da un servizio dell’università. Gli studenti devono poterlo leggere, e il docente deve poterlo aggiornare. Ogni richiesta che arriva al servizio nomina il fascicolo e un’operazione. Per rispondere, queste due informazioni sono insufficienti: bisogna sapere anche da chi viene la richiesta.',
      'Il servizio conosce le persone attraverso gli [[account]]. Un account è un’identità digitale, con un nome come «ada». Chi vuole usarlo deve presentare delle [[credenziali]], cioè una prova di esserne il titolare: la più comune è una password. La verifica delle credenziali si chiama [[autenticazione]], e risponde alla domanda «chi sei». Quando riesce, il servizio apre una [[sessione]]: da quel momento le richieste che arrivano dallo stesso accesso portano l’identità dell’account, senza ripresentare ogni volta la password.',
      'Sapere chi chiede è soltanto metà del lavoro. La seconda domanda è «puoi farlo», e la risposta si chiama [[autorizzazione]]: il servizio confronta l’operazione chiesta con i diritti di quella identità. Elencare i diritti un account alla volta sarebbe faticoso, e per questo si ragiona per ruoli. Un ruolo è una categoria di account con gli stessi diritti. Qui i ruoli sono due: lo studente ha il diritto di lettura, il docente ha lettura e modifica. È la politica di accesso dell’unità 1.7.4, scritta in forma di tabella.',
      { fig: 'scena', w: 720, h: 266, titolo: 'Uno studente chiede una modifica: riconosciuto, e respinto', nota: 'L’autenticazione riesce, e apre una sessione con il ruolo studente. L’autorizzazione consulta la politica: al ruolo manca il diritto di modifica.', els: SL.unita671.quadro('g', { chi: 'studente', op: 'modifica' }, 3, { x: 10, y: 4, w: 700 }) },
      'Le due domande vanno tenute distinte, perché falliscono in modi diversi. Uno studente che chiede una modifica supera l’autenticazione: il servizio sa chi è. Viene fermato dopo, dall’autorizzazione. Una richiesta senza credenziali si ferma prima: la tabella dei diritti resta chiusa, perché manca l’identità con cui consultarla.',
      'C’è poi un punto sottile, che riguarda le tracce lasciate dalle richieste. Il servizio conta le modifiche applicate al fascicolo. Dopo una lettura concessa il contatore vale zero, perché leggere lascia il contenuto com’è. Dopo una modifica negata vale zero lo stesso, perché la richiesta è stata respinta. Lo stesso numero racconta due storie diverse: per interpretarlo bisogna conoscere l’operazione chiesta e la decisione presa.'
    ]
  },
  esperimento: {
    faremo: [
      'Al servizio arriva una richiesta sul fascicolo del corso. Sceglierai con quali credenziali arriva, e quale operazione chiede.',
      'Seguiremo la richiesta attraverso i due controlli, fino all’effetto sul fascicolo. Prova lo studente con la lettura e poi con la modifica: il contatore finale è lo stesso, e la storia è diversa.'
    ],
    vedrai: [
      ['input', 'La richiesta', 'In alto: le credenziali presentate, l’operazione chiesta, l’oggetto.'],
      ['chiave', 'Il servizio', 'Al centro: l’autenticazione, l’autorizzazione, e ciò che accade al fascicolo.'],
      ['privilegi', 'La politica', 'In basso: i diritti dei due ruoli, e il contatore delle modifiche applicate.']
    ]
  },
  lab: {
    titolo: 'Una richiesta attraverso due controlli',
    scena: { w: 860, h: 266 },
    atti: ['La richiesta', 'Chi sei', 'Puoi farlo', 'L’effetto'],
    controlli: [
      { id: 'chi', tipo: 'scelta', eti: 'Credenziali', opzioni: [['studente', 'di uno studente'], ['docente', 'di un docente'], ['nessuno', 'nessuna credenziale']], valore: 'studente' },
      { id: 'op', tipo: 'scelta', eti: 'Operazione', opzioni: [['lettura', 'lettura'], ['modifica', 'modifica']], valore: 'modifica' }
    ],
    nota: 'Il numero dei passi dipende dalle credenziali. Lo studente può leggere. Il docente può leggere e modificare.',
    previsione: {
      domanda: (p) => 'Al servizio arriva una richiesta di ' + p.op + ' del fascicolo, ' + (p.chi === 'nessuno' ? 'senza credenziali' : 'con le credenziali valide di ' + (p.chi === 'studente' ? 'uno studente' : 'un docente')) + '. Lo studente può leggere, il docente può leggere e modificare. Che cosa accade?',
      opzioni: () => [['concessa', 'La richiesta viene concessa'], ['negata', 'L’identità viene riconosciuta, e la richiesta viene negata'], ['auth', 'La richiesta si ferma prima del controllo dei diritti']]
    },
    confronto: (pred, esito, p) => { const N = { concessa: 'la richiesta venisse concessa', negata: 'la richiesta venisse negata dopo il riconoscimento', auth: 'la richiesta si fermasse prima del controllo dei diritti' }, E = { concessa: 'La richiesta è stata concessa', negata: 'La richiesta è stata negata dall’autorizzazione', auth: 'La richiesta si è fermata all’autenticazione' }; return 'La previsione indicava che ' + N[pred] + '. ' + E[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'concessa' ? 'Il ruolo ' + p.chi + ' comprende il diritto di ' + p.op + '.' : esito === 'negata' ? 'Le credenziali erano valide, e il servizio ha riconosciuto lo studente. A mancare è il diritto di modifica.' : 'Senza credenziali manca l’identità con cui consultare la politica.'); },
    costruisci(p) {
      const U = SL.unita671, e = U.esito(p), noto = p.chi !== 'nessuno', mod = e === 'concessa' && p.op === 'modifica', passi = [];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Identità', f >= 1 ? (noto ? p.chi : 'ignota') : '·', 'a'], ['Decisione', f >= 2 ? (e === 'concessa' ? 'concessa' : e === 'negata' ? 'negata' : 'mai presa') : '·'], ['Modifiche', f >= 3 ? (mod ? '1' : '0') : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'La richiesta', 'Al servizio arriva una richiesta di ' + p.op + ' sul fascicolo del corso. ' + (noto ? 'È accompagnata dalle credenziali di ' + (p.chi === 'studente' ? 'uno studente.' : 'un docente.') : 'Arriva senza credenziali.'), {});
      if (noto) P(1, 1, 'L’autenticazione', 'Il servizio verifica le credenziali e le trova valide. Apre una sessione con il ruolo ' + p.chi + '. Sull’operazione chiesta nulla è ancora deciso.', { calc: 'credenziali valide → sessione: ' + p.chi, chiedi: { d: 'L’autenticazione è riuscita. La richiesta è già concessa?', o: ['Ancora no: manca il controllo dei diritti', 'Sì: le credenziali erano valide'], g: 0, no: 'L’autenticazione stabilisce chi chiede. Se possa farlo, lo decide il controllo seguente.' } });
      else P(1, 1, 'L’autenticazione', 'Senza credenziali il servizio resta privo di un’identità a cui riferire la richiesta. Il percorso si ferma qui.', { calc: 'nessuna credenziale → nessuna sessione' });
      if (noto) P(2, 2, 'L’autorizzazione', 'Il servizio consulta la politica alla riga del ruolo ' + p.chi + ', che comprende ' + (p.chi === 'studente' ? 'la lettura' : 'lettura e modifica') + '. L’operazione chiesta è la ' + p.op + ': il diritto ' + (e === 'concessa' ? 'è presente.' : 'manca.'), { calc: 'ruolo ' + p.chi + ' · ' + p.op + ' → ' + (e === 'concessa' ? 'concessa' : 'negata') });
      P(3, 3, 'L’effetto sul fascicolo', e === 'auth' ? 'Il servizio risponde chiedendo le credenziali. La politica è rimasta chiusa, il fascicolo è intatto, e il contatore delle modifiche vale 0.' : e === 'negata' ? 'Il servizio risponde con un rifiuto. Il fascicolo resta intatto, e il contatore delle modifiche vale 0. È lo stesso zero di una lettura concessa, con un significato diverso: qui una modifica è stata tentata e respinta.' : mod ? 'Il servizio applica la modifica al fascicolo. Il contatore delle modifiche sale a 1.' : 'Il servizio restituisce il contenuto del fascicolo. Leggere lascia il contenuto com’è: il contatore delle modifiche vale 0.', { esito: [e === 'concessa' ? 'richiesta concessa' : e === 'negata' ? 'richiesta negata' : 'fermata all’autenticazione', e === 'concessa' ? 'si' : 'no'] });
      return { passi, esito: e };
    }
  },
  bilancio: {
    regola: [
      'Autenticazione: il servizio verifica le credenziali e associa un’identità alla sessione. Senza identità la richiesta si ferma.',
      'Autorizzazione: il servizio confronta l’operazione chiesta con i diritti del ruolo. Una modifica avviene soltanto se riescono entrambi i controlli.'
    ],
    errori: [
      ['Credere che un utente autenticato possa fare tutto.', 'L’autenticazione stabilisce l’identità. I diritti si controllano a parte, un’operazione alla volta.'],
      ['Leggere un contatore a zero come prova che nulla è stato chiesto.', 'Zero modifiche può venire da una lettura concessa, oppure da una modifica negata.'],
      ['Consultare i diritti prima di conoscere l’identità.', 'I diritti appartengono a un ruolo: senza identità manca la riga da leggere.']
    ],
    saFare: ['Distinguere autenticazione e autorizzazione.', 'Indicare a quale controllo si ferma una richiesta.', 'Interpretare il contatore delle modifiche insieme a operazione ed esito.'],
    esercizi: [
      { d: 'Lo studente può leggere, il docente può leggere e modificare. In una mattina arrivano, tutte con credenziali valide: 4 letture e 3 modifiche da studenti, 2 letture e 5 modifiche dal docente. Quante modifiche vengono applicate al fascicolo?', segnaposto: 'Un numero', giuste: ['5', 'cinque'],
        ok: 'Vengono applicate le 5 modifiche del docente. Le 3 degli studenti sono negate.',
        diagnosi: [
          { se: ['8', 'otto'], msg: 'Otto sono le modifiche chieste. Quelle degli studenti vengono negate.' },
          { se: ['3', 'tre'], msg: 'Tre sono le modifiche chieste dagli studenti, e vengono tutte negate.' },
          { se: ['14', 'quattordici'], msg: 'Quattordici sono tutte le richieste. Le letture lasciano il fascicolo com’è.' }
        ],
        altro: 'Il numero è diverso. Si consideri soltanto le richieste di modifica, e per ciascuna guarda il ruolo.',
        indizi: ['Le letture lasciano il fascicolo com’è.', 'Modifiche chieste: 3 da studenti, 5 dal docente.', 'Il ruolo studente è privo del diritto di modifica: restano 5.'],
        svolgimento: ['Modifiche degli studenti: 3, negate.', 'Modifiche del docente: 5, concesse.', 'Applicate: 5.'] },
      { d: 'Nella stessa mattina, quante richieste vengono negate?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Vengono negate le 3 modifiche chieste dagli studenti. Tutte le altre sono concesse.',
        diagnosi: [
          { se: ['0', 'zero'], msg: 'Le credenziali valide superano soltanto il primo controllo. Poi vengono i diritti.' },
          { se: ['7', 'sette'], msg: 'Sette sono le richieste degli studenti. Le loro 4 letture vengono concesse.' },
          { se: ['8', 'otto'], msg: 'Otto sono le modifiche chieste. Quelle del docente vengono concesse.' }
        ],
        altro: 'Il numero è diverso. Cerca le richieste in cui al ruolo manca il diritto.',
        indizi: ['Le letture sono concesse a entrambi i ruoli.', 'Le modifiche del docente sono concesse.', 'Restano le 3 modifiche degli studenti.'],
        svolgimento: ['Letture: 6, concesse.', 'Modifiche del docente: 5, concesse.', 'Modifiche degli studenti: 3, negate.'] },
      { d: 'Una richiesta di lettura arriva senza credenziali. A quale controllo si ferma?', guida: 'Si scelga la risposta.', o: [
        { t: 'All’autenticazione: manca un’identità', ok: true, fb: 'La politica dei diritti resta chiusa.' },
        { t: 'All’autorizzazione: al ruolo manca la lettura', fb: 'Senza identità manca anche il ruolo: l’autorizzazione resta da consultare.' },
        { t: 'A nessuno: la lettura è concessa a tutti', fb: 'La lettura è concessa ai ruoli studente e docente. Chi arriva senza credenziali è privo di ruolo.' }] }
    ],
    sfida: ['cslez6_7_01_protection_goals', 'Obiettivi di protezione']
  }
});
