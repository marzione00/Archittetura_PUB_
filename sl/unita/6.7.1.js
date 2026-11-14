'use strict';
SL.unita671 = (() => {
  const DIRITTI = { studente: { lettura: 1, modifica: 0 }, docente: { lettura: 1, modifica: 1 } };
  const esito = (p) => (p.chi === 'nessuno' ? 'auth' : DIRITTI[p.chi][p.op] ? 'concessa' : 'negata');
  // f: 0 richiesta · 1 autenticazione · 2 autorizzazione · 3 effetto sul fascicolo
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], e = esito(p), w3 = (o.w - 20) / 3, noto = p.chi !== 'nessuno', mod = e === 'concessa' && p.op === 'modifica';
    els.push(el.nota(pre + 't0', o.x, o.y, 'LA RICHIESTA · il richiedente e l’operazione', 'mono', f === 0 ? 'att' : ''));
    els.push(el.box(pre + 'r0', o.x, o.y + 24, w3, 54, 'credenziali presentate', p.chi === 'studente' ? 'di uno studente' : p.chi === 'docente' ? 'di un docente' : 'nessuna', f === 0 ? 'att' : noto ? 'on' : 'zero', { cls: 'stretta' }));
    els.push(el.box(pre + 'r1', o.x + w3 + 10, o.y + 24, w3, 54, 'operazione richiesta', p.op, f === 0 ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'r2', o.x + 2 * (w3 + 10), o.y + 24, w3, 54, 'oggetto', 'fascicolo del corso', f === 0 ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.nota(pre + 't1', o.x, o.y + 90, 'IL SERVIZIO · due controlli in successione, quindi l’effetto', 'mono', f >= 1 ? 'att' : ''));
    els.push(el.box(pre + 's0', o.x, o.y + 114, w3, 54, 'autenticazione · identità', f >= 1 ? (noto ? 'sessione: ' + p.chi : 'identità ignota') : '·', f === 1 ? (noto ? 'att' : 'err') : f > 1 ? (noto ? 'on' : 'err') : '', { cls: 'stretta' }));
    els.push(el.box(pre + 's1', o.x + w3 + 10, o.y + 114, w3, 54, 'autorizzazione · diritti', f >= 2 ? (!noto ? 'mai consultata' : e === 'concessa' ? 'diritto presente' : 'diritto assente') : '·', f >= 2 ? (!noto ? 'off' : e === 'concessa' ? (f === 2 ? 'att' : 'on') : 'err') : '', { cls: 'stretta' }));
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
  obiettivo: 'Obiettivo: distinguere i due controlli che un servizio compie su una richiesta, cioè stabilire l’identità del richiedente, e decidere se tale identità ha diritto all’operazione.',
  concetti: [['chiave', 'Primo controllo: l’identità del richiedente'], ['privilegi', 'Secondo controllo: il diritto all’operazione'], ['bilancio', 'Il medesimo zero, due significati']],
  filigrana: ['chiave', 'privilegi', 'file'],
  richiami: {
    carte: [
      { sim: 'privilegi', da: 'Dall’unità 1.7.4', t: 'La politica di accesso', d: 'Una regola stabilisce chi può compiere un’operazione, a partire da ruoli e permessi.' },
      { sim: 'scudo', da: 'Dall’unità 4.2.5', t: 'Meccanismo e politica', d: 'Il modo di raggiungere un servizio è uguale per tutti. L’esito dipende dal richiedente, e dall’operazione richiesta.' },
      { sim: 'inode', da: 'Dall’unità 6.5.1', t: 'I permessi fra i metadati', d: 'L’inode di un file conserva anche il proprietario e i permessi.' }
    ],
    domanda: { d: 'Prima di proseguire: nell’unità 4.2.5 un utente richiedeva la lettura di un file con i permessi 0600, di cui era proprietario un altro utente. Che cosa restituiva il kernel?', o: [
      { t: '−13, cioè EACCES: accesso negato', ok: true, fb: 'La cifra degli altri era 0, senza il permesso di lettura.' },
      { t: 'Un descrittore di file', fb: 'Il descrittore è restituito quando la politica concede l’apertura. In questo caso la negava.' },
      { t: 'Il contenuto del file', fb: 'Una open restituisce un descrittore oppure un errore. In questo caso restituiva l’errore.' }
    ] }
  },
  idea: {
    titolo: 'Due controlli in successione: identità e diritti',
    termini: ['account', 'credenziali', 'autenticazione', 'sessione', 'autorizzazione'],
    testo: [
      'Si consideri il fascicolo di un corso, conservato da un servizio dell’università. Gli studenti devono poterlo leggere, e il docente deve poterlo aggiornare. Ogni richiesta che giunge al servizio indica il fascicolo e un’operazione. Per la risposta tali due informazioni sono insufficienti: occorre conoscere anche il richiedente.',
      'Il servizio identifica le persone attraverso gli [[account]]. Un account è un’identità digitale, con un nome come «ada». Per impiegarlo occorre presentare delle [[credenziali]], cioè una prova di esserne il titolare: la più comune è una password. La verifica delle credenziali prende il nome di [[autenticazione]], e stabilisce l’identità del richiedente. Quando riesce, il servizio apre una [[sessione]]: da quel momento le richieste provenienti dal medesimo accesso sono associate all’identità dell’account, senza una nuova presentazione della password.',
      'L’identità del richiedente è soltanto la prima delle due informazioni necessarie. Il secondo controllo riguarda il diritto all’operazione, e prende il nome di [[autorizzazione]]: il servizio confronta l’operazione richiesta con i diritti di tale identità. L’elenco dei diritti per ogni singolo account sarebbe oneroso, e per questa ragione i diritti sono assegnati per ruoli. Un ruolo è una categoria di account con i medesimi diritti. In questo caso i ruoli sono due: lo studente ha il diritto di lettura, il docente ha lettura e modifica. È la politica di accesso dell’unità 1.7.4, scritta in forma di tabella.',
      { fig: 'scena', w: 720, h: 266, titolo: 'Uno studente richiede una modifica: identità riconosciuta, richiesta respinta', nota: 'L’autenticazione riesce, e apre una sessione con il ruolo studente. L’autorizzazione consulta la politica: al ruolo manca il diritto di modifica.', els: SL.unita671.quadro('g', { chi: 'studente', op: 'modifica' }, 3, { x: 10, y: 4, w: 700 }) },
      'I due controlli vanno tenuti distinti, poiché falliscono in modi diversi. Uno studente che richiede una modifica supera l’autenticazione, poiché il servizio ne conosce l’identità, ed è respinto in seguito dall’autorizzazione. Una richiesta senza credenziali si arresta prima: la tabella dei diritti non è consultata, poiché manca l’identità con cui consultarla.',
      'Un’ulteriore osservazione riguarda le tracce lasciate dalle richieste. Il servizio conta le modifiche applicate al fascicolo. Dopo una lettura concessa il contatore vale zero, poiché la lettura lascia il contenuto invariato. Dopo una modifica negata vale ugualmente zero, poiché la richiesta è stata respinta. Il medesimo numero corrisponde a due situazioni diverse: la sua interpretazione richiede la conoscenza dell’operazione richiesta e della decisione presa.'
    ]
  },
  esperimento: {
    faremo: [
      'Al servizio giunge una richiesta sul fascicolo del corso. I controlli fissano le credenziali che la accompagnano, e l’operazione richiesta.',
      'L’esperimento segue la richiesta attraverso i due controlli, fino all’effetto sul fascicolo. È istruttivo confrontare lo studente con la lettura e con la modifica: il contatore finale è il medesimo, mentre la situazione è diversa.'
    ],
    vedrai: [
      ['input', 'La richiesta', 'In alto: le credenziali presentate, l’operazione richiesta, l’oggetto.'],
      ['chiave', 'Il servizio', 'Al centro: l’autenticazione, l’autorizzazione, e l’effetto sul fascicolo.'],
      ['privilegi', 'La politica', 'In basso: i diritti dei due ruoli, e il contatore delle modifiche applicate.']
    ]
  },
  lab: {
    titolo: 'Una richiesta attraverso due controlli',
    scena: { w: 860, h: 266 },
    atti: ['La richiesta', 'L’identità', 'I diritti', 'L’effetto'],
    controlli: [
      { id: 'chi', tipo: 'scelta', eti: 'Credenziali', opzioni: [['studente', 'di uno studente'], ['docente', 'di un docente'], ['nessuno', 'nessuna credenziale']], valore: 'studente' },
      { id: 'op', tipo: 'scelta', eti: 'Operazione', opzioni: [['lettura', 'lettura'], ['modifica', 'modifica']], valore: 'modifica' }
    ],
    nota: 'Il numero dei passi dipende dalle credenziali. Lo studente può leggere, il docente può leggere e modificare.',
    previsione: {
      domanda: (p) => 'Al servizio giunge una richiesta di ' + p.op + ' del fascicolo, ' + (p.chi === 'nessuno' ? 'senza credenziali' : 'con le credenziali valide di ' + (p.chi === 'studente' ? 'uno studente' : 'un docente')) + '. Lo studente può leggere, il docente può leggere e modificare. Che cosa accade?',
      opzioni: () => [['concessa', 'La richiesta è concessa'], ['negata', 'L’identità è riconosciuta, e la richiesta è negata'], ['auth', 'La richiesta si arresta prima del controllo dei diritti']]
    },
    confronto: (pred, esito, p) => { const N = { concessa: 'la richiesta fosse concessa', negata: 'la richiesta fosse negata dopo il riconoscimento', auth: 'la richiesta si arrestasse prima del controllo dei diritti' }, E = { concessa: 'La richiesta è stata concessa', negata: 'La richiesta è stata negata dall’autorizzazione', auth: 'La richiesta si è arrestata all’autenticazione' }; return 'La previsione indicava che ' + N[pred] + '. ' + E[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'concessa' ? 'Il ruolo ' + p.chi + ' comprende il diritto di ' + p.op + '.' : esito === 'negata' ? 'Le credenziali erano valide, e il servizio ha riconosciuto lo studente. È assente il diritto di modifica.' : 'Senza credenziali manca l’identità con cui consultare la politica.'); },
    costruisci(p) {
      const U = SL.unita671, e = U.esito(p), noto = p.chi !== 'nessuno', mod = e === 'concessa' && p.op === 'modifica', passi = [];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Identità', f >= 1 ? (noto ? p.chi : 'ignota') : '·', 'a'], ['Decisione', f >= 2 ? (e === 'concessa' ? 'concessa' : e === 'negata' ? 'negata' : 'mai presa') : '·'], ['Modifiche', f >= 3 ? (mod ? '1' : '0') : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'La richiesta', 'Al servizio giunge una richiesta di ' + p.op + ' sul fascicolo del corso. ' + (noto ? 'È accompagnata dalle credenziali di ' + (p.chi === 'studente' ? 'uno studente.' : 'un docente.') : 'La richiesta è priva di credenziali.'), {});
      if (noto) P(1, 1, 'L’autenticazione', 'Il servizio verifica le credenziali e le trova valide, e apre una sessione con il ruolo ' + p.chi + '. Sull’operazione richiesta nulla è ancora deciso.', { calc: 'credenziali valide → sessione: ' + p.chi, chiedi: { d: 'L’autenticazione è riuscita. La richiesta è già concessa?', o: ['Non ancora, poiché manca il controllo dei diritti', 'Sì, le credenziali erano valide'], g: 0, no: 'L’autenticazione stabilisce l’identità del richiedente. Il diritto all’operazione è deciso dal controllo successivo.' } });
      else P(1, 1, 'L’autenticazione', 'Senza credenziali il servizio resta privo di un’identità a cui riferire la richiesta. Il percorso si arresta a questo controllo.', { calc: 'nessuna credenziale → nessuna sessione' });
      if (noto) P(2, 2, 'L’autorizzazione', 'Il servizio consulta la politica alla riga del ruolo ' + p.chi + ', che comprende ' + (p.chi === 'studente' ? 'la lettura' : 'lettura e modifica') + '. L’operazione richiesta è la ' + p.op + ': il diritto ' + (e === 'concessa' ? 'è presente.' : 'è assente.'), { calc: 'ruolo ' + p.chi + ' · ' + p.op + ' → ' + (e === 'concessa' ? 'concessa' : 'negata') });
      P(3, 3, 'L’effetto sul fascicolo', e === 'auth' ? 'Il servizio risponde con la richiesta delle credenziali. La politica non è stata consultata, il fascicolo è intatto, e il contatore delle modifiche vale 0.' : e === 'negata' ? 'Il servizio risponde con un rifiuto. Il fascicolo resta intatto, e il contatore delle modifiche vale 0. È il medesimo zero di una lettura concessa, con un significato diverso: in questo caso una modifica è stata tentata e respinta.' : mod ? 'Il servizio applica la modifica al fascicolo. Il contatore delle modifiche sale a 1.' : 'Il servizio restituisce il contenuto del fascicolo. La lettura lascia il contenuto invariato: il contatore delle modifiche vale 0.', { esito: [e === 'concessa' ? 'richiesta concessa' : e === 'negata' ? 'richiesta negata' : 'arrestata all’autenticazione', e === 'concessa' ? 'si' : 'no'] });
      return { passi, esito: e };
    }
  },
  bilancio: {
    regola: [
      'Autenticazione: il servizio verifica le credenziali e associa un’identità alla sessione. Senza identità la richiesta si arresta.',
      'Autorizzazione: il servizio confronta l’operazione richiesta con i diritti del ruolo. Una modifica avviene soltanto se riescono entrambi i controlli.'
    ],
    errori: [
      ['Ritenere che un utente autenticato possa compiere ogni operazione.', 'L’autenticazione stabilisce l’identità. I diritti sono controllati separatamente, un’operazione per volta.'],
      ['Interpretare un contatore a zero come prova dell’assenza di richieste.', 'Zero modifiche può derivare da una lettura concessa, oppure da una modifica negata.'],
      ['Consultare i diritti prima di conoscere l’identità.', 'I diritti appartengono a un ruolo: senza identità manca la riga da leggere.']
    ],
    saFare: ['Distinguere autenticazione e autorizzazione.', 'Indicare a quale controllo si ferma una richiesta.', 'Interpretare il contatore delle modifiche insieme a operazione ed esito.'],
    esercizi: [
      { d: 'Lo studente può leggere, il docente può leggere e modificare. In una mattina giungono, tutte con credenziali valide, 4 letture e 3 modifiche da studenti, 2 letture e 5 modifiche dal docente. Quante modifiche sono applicate al fascicolo?', segnaposto: 'Un numero', giuste: ['5', 'cinque'],
        ok: 'Sono applicate le 5 modifiche del docente. Le 3 degli studenti sono negate.',
        diagnosi: [
          { se: ['8', 'otto'], msg: 'Otto sono le modifiche richieste. Quelle degli studenti sono negate.' },
          { se: ['3', 'tre'], msg: 'Tre sono le modifiche richieste dagli studenti, e sono tutte negate.' },
          { se: ['14', 'quattordici'], msg: 'Quattordici sono tutte le richieste. Le letture lasciano il fascicolo invariato.' }
        ],
        altro: 'Il numero è diverso. Si considerino soltanto le richieste di modifica, e per ciascuna il ruolo.',
        indizi: ['Le letture lasciano il fascicolo invariato.', 'Modifiche richieste: 3 da studenti, 5 dal docente.', 'Il ruolo studente è privo del diritto di modifica: restano 5.'],
        svolgimento: ['Modifiche degli studenti: 3, negate.', 'Modifiche del docente: 5, concesse.', 'Applicate: 5.'] },
      { d: 'Nella medesima mattina, quante richieste sono negate?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Sono negate le 3 modifiche richieste dagli studenti. Tutte le altre sono concesse.',
        diagnosi: [
          { se: ['0', 'zero'], msg: 'Le credenziali valide superano soltanto il primo controllo, a cui segue quello dei diritti.' },
          { se: ['7', 'sette'], msg: 'Sette sono le richieste degli studenti. Le loro 4 letture sono concesse.' },
          { se: ['8', 'otto'], msg: 'Otto sono le modifiche richieste. Quelle del docente sono concesse.' }
        ],
        altro: 'Il numero è diverso. Si individuino le richieste in cui al ruolo manca il diritto.',
        indizi: ['Le letture sono concesse a entrambi i ruoli.', 'Le modifiche del docente sono concesse.', 'Restano le 3 modifiche degli studenti.'],
        svolgimento: ['Letture: 6, concesse.', 'Modifiche del docente: 5, concesse.', 'Modifiche degli studenti: 3, negate.'] },
      { d: 'Una richiesta di lettura giunge senza credenziali. A quale controllo si arresta?', guida: 'Si scelga la risposta.', o: [
        { t: 'All’autenticazione, poiché manca un’identità', ok: true, fb: 'La politica dei diritti non è consultata.' },
        { t: 'All’autorizzazione, poiché al ruolo manca la lettura', fb: 'Senza identità manca anche il ruolo: l’autorizzazione non è raggiunta.' },
        { t: 'A nessuno, poiché la lettura è concessa a tutti', fb: 'La lettura è concessa ai ruoli studente e docente. Una richiesta senza credenziali è priva di ruolo.' }] }
    ],
    sfida: ['cslez6_7_01_protection_goals', 'Obiettivi di protezione']
  }
});
