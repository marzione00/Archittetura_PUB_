'use strict';
SL.unita425 = (() => {
  const RWX = (c) => (c & 4 ? 'r' : '-') + (c & 2 ? 'w' : '-') + (c & 1 ? 'x' : '-');
  const cifre = (perm) => [Number(perm[0]), Number(perm[1]), Number(perm[2])];
  const classe = (chi) => (chi === 'owner' ? 0 : 2);
  const ammesso = (p) => (cifre(p.perm)[classe(p.chi)] & 4) !== 0;
  const NOMI = ['proprietario', 'gruppo', 'altri'];
  // fase: 0 la richiesta · 1 il meccanismo · 2 i permessi · 3 la classe · 4 il bit di lettura · 5 l'esito
  const quadro = (pre, p, f, o) => {
    const el = SL.el, c = cifre(p.perm), k = classe(p.chi), ok = ammesso(p), els = [], x2 = o.x + o.w1 + o.gap, x3 = x2 + o.w2 + o.gap, py = o.h + 14, wc = (o.w2 - 16) / 3;
    els.push(el.box(pre + 'r', o.x, o.y, o.w1, o.h, 'richiesta', 'open, sola lettura', f === 0 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'm', o.x, o.y + py, o.w1, o.h, 'meccanismo', f >= 1 ? 'SYSCALL · voce 2' : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'i', o.x, o.y + 2 * py, o.w1, o.h, 'richiedente', p.chi === 'owner' ? 'il proprietario' : 'un altro utente', f === 3 ? 'att' : 'on', { cls: 'stretta' }));
    c.forEach((v, j) => els.push(el.cella(pre + 'c' + j, x2 + j * (wc + 8), o.y + 18, wc, o.h - 18, f >= 2 ? v + ' · ' + RWX(v) : '·', f >= 3 && j === k ? (f === 3 || f === 4 ? 'att' : 'on') : f >= 2 ? (f === 2 ? 'on' : 'zero') : 'off', { piccola: true, cls: 'minuta', so: NOMI[j] })));
    els.push(el.box(pre + 'f', x2, o.y + py, o.w2, o.h, 'permessi del file', '0' + p.perm, f === 2 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'b', x2, o.y + 2 * py, o.w2, o.h, 'permesso di lettura per ' + (k === 0 ? 'il proprietario' : 'gli altri'), f >= 4 ? (ok ? 'presente' : 'assente') : '·', f === 4 ? (ok ? 'att' : 'err') : f > 4 ? (ok ? 'on' : 'err') : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'p', x3, o.y, o.w1, o.h, 'politica', f >= 4 ? (ok ? 'accesso concesso' : 'accesso negato') : '·', f === 4 ? (ok ? 'att' : 'err') : f > 4 ? (ok ? 'on' : 'err') : '', { cls: 'stretta' }),
      el.box(pre + 'e', x3, o.y + py, o.w1, o.h, 'valore restituito', f >= 5 ? 'RAX = ' + (ok ? 3 : '−13') : 'RAX = ·', f >= 5 ? (ok ? 'att' : 'err') : '', { cls: 'stretta' }),
      el.box(pre + 't', x3, o.y + 2 * py, o.w1, o.h, 'descrittori del processo', f >= 5 ? (ok ? 'nuova voce 3' : 'invariati') : '·', f >= 5 ? 'on' : '', { cls: 'stretta' }));
    return els;
  };
  return { RWX, cifre, classe, ammesso, NOMI, quadro };
})();
SL.registra('4.2.5', {
  titolo: 'Meccanismo, politica e struttura del sistema operativo',
  obiettivo: 'Obiettivo: distinguere il meccanismo di ingresso nel kernel dalla politica che stabilisce l’esito, e leggere i permessi di un file per indicare se una apertura in lettura è concessa.',
  concetti: [['gate', 'Un medesimo ingresso per ogni programma'], ['privilegi', 'La regola che stabilisce l’esito'], ['scudo', 'Accesso concesso oppure negato']],
  filigrana: ['privilegi', 'gate', 'scudo'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 4.2.1', t: 'Lo smistamento', d: 'Tutte le chiamate entrano dal medesimo punto. Il numero in RAX seleziona il servizio.' },
      { sim: 'privilegi', da: 'Dall’unità 1.7.4', t: 'La politica di accesso', d: 'La regola che stabilisce chi può compiere un’operazione.' },
      { sim: 'bit', da: 'Dall’unità 1.2.2', t: 'Tre bit', d: 'Tre bit hanno i pesi 4, 2 e 1, e rappresentano i numeri da 0 a 7.' }
    ],
    domanda: { d: 'Prima di proseguire: tre bit con i pesi 4, 2 e 1 valgono, nell’ordine, 1, 1 e 0. Quale numero rappresentano?', o: [
      { t: '6', ok: true, fb: 'Sono attivi i pesi 4 e 2: 4 + 2 = 6.' },
      { t: '3', fb: 'Il tre corrisponde a 2 + 1, cioè ai bit 0, 1 e 1.' },
      { t: '110', fb: 'Questa è la scrittura dei tre bit. Il loro valore è 4 + 2 = 6.' }
    ] }
  },
  idea: {
    titolo: 'L’ingresso e la decisione',
    termini: ['meccanismo e politica', 'bit di permesso', 'eacces'],
    testo: [
      'Due programmi eseguono la medesima chiamata, open sul medesimo file, e ricevono due risposte diverse: il primo ottiene un descrittore, il secondo un errore. Il modo di ingresso nel kernel è identico per entrambi. La differenza risiede nella decisione che il kernel assume dopo l’ingresso.',
      'I due aspetti vanno tenuti distinti. Il [[meccanismo e politica|meccanismo]] è il modo in cui una operazione è resa possibile: l’istruzione SYSCALL, lo smistamento, la tabella dei descrittori. Esso è identico per ogni programma, e varia di rado. La politica è la regola che stabilisce se l’operazione va concessa, e a quale richiedente. Essa può variare da un file all’altro e da un utente all’altro, senza alcuna modifica del meccanismo.',
      'Per i file la politica più semplice è espressa dai [[bit di permesso]]. Ogni file ha un proprietario, e nove bit suddivisi in tre gruppi: per il proprietario, per il suo gruppo di utenti, per tutti gli altri. In ogni gruppo i tre bit hanno i pesi 4, 2 e 1, e concedono la lettura, la scrittura e l’esecuzione. Ogni gruppo è pertanto rappresentato da una cifra da 0 a 7.',
      { fig: 'scena', w: 720, h: 222, titolo: 'Un altro utente richiede la lettura di un file con i permessi 0600', nota: 'La cifra degli altri è 0, senza il permesso di lettura. La politica nega l’accesso.', els: SL.unita425.quadro('g', { chi: 'other', perm: '600' }, 5, { x: 10, y: 8, w1: 176, w2: 308, gap: 20, h: 58 }) },
      'I permessi 0644 si leggono nel modo seguente: 6 per il proprietario, cioè 4 + 2, lettura e scrittura; 4 per il gruppo, sola lettura; 4 per gli altri, sola lettura. Con 0600 il proprietario legge e scrive, e ogni altro utente è privo di qualsiasi permesso. Lo zero iniziale indica che le cifre vanno lette una per volta, in base otto.',
      'Quando la politica nega l’accesso, open restituisce −13, il codice dell’errore [[eacces|EACCES]], e la tabella dei descrittori resta invariata. Quando lo concede, il kernel occupa la prima voce libera della tabella e ne restituisce il numero. In questo modello si tratta della voce 3, poiché le voci 0, 1 e 2 sono occupate fin dall’avvio.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma richiede l’apertura di un file in sola lettura. I controlli fissano l’utente che lo esegue, il proprietario del file oppure un altro utente estraneo al suo gruppo, e i permessi del file.',
      'Il meccanismo è il medesimo in tutti i casi. Si osserva quale gruppo di bit si applica, se esso contiene il permesso di lettura, e quale valore restituisce open. Dopo il caso proposto, è istruttivo modificare soltanto il richiedente.'
    ],
    vedrai: [
      ['gate', 'La richiesta', 'A sinistra: la chiamata, il meccanismo e l’identità del richiedente.'],
      ['privilegi', 'I permessi', 'Al centro: le tre cifre del file, con le lettere r, w e x per i permessi presenti.'],
      ['scudo', 'La decisione', 'A destra: la politica, il valore restituito e la tabella dei descrittori.']
    ]
  },
  lab: {
    titolo: 'La medesima open, due risposte',
    scena: { w: 860, h: 250 },
    atti: ['La richiesta', 'Il meccanismo', 'La politica', 'L’esito'],
    controlli: [
      { id: 'chi', tipo: 'scelta', eti: 'Richiedente', opzioni: [['other', 'un altro utente'], ['owner', 'il proprietario']], valore: 'other' },
      { id: 'perm', tipo: 'scelta', eti: 'Permessi del file', opzioni: [['600', '0600'], ['640', '0640'], ['644', '0644']], valore: '600' }
    ],
    nota: 'I passi sono sempre sei. L’altro utente è estraneo al gruppo del file, e nessuno dei due ha privilegi speciali.',
    previsione: {
      domanda: (p) => (p.chi === 'owner' ? 'Il proprietario' : 'Un utente diverso dal proprietario, estraneo al suo gruppo,') + ' richiede l’apertura in sola lettura di un file con i permessi 0' + p.perm + '. Quale valore restituisce open?',
      opzioni: () => [[3, '3, un nuovo descrittore'], [-13, '−13, accesso negato'], [0, '0']]
    },
    confronto: (pred, esito, p) => { const U = SL.unita425, N = (v) => (v < 0 ? '−13' : String(v)), k = U.classe(p.chi); return 'La previsione indicava ' + N(pred) + '. La open restituisce ' + N(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Per ' + (k === 0 ? 'il proprietario' : 'gli altri utenti') + ' vale la cifra ' + U.cifre(p.perm)[k] + ', che ' + (U.ammesso(p) ? 'contiene' : 'non contiene') + ' il peso 4 della lettura.'); },
    costruisci(p) {
      const U = SL.unita425, passi = [], c = U.cifre(p.perm), k = U.classe(p.chi), ok = U.ammesso(p), v = ok ? 3 : -13, R = ok ? '3' : '−13';
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 8, w1: 240, w2: 300, gap: 20, h: 62 });
      const hud = (f) => [['Richiedente', p.chi === 'owner' ? 'proprietario' : 'altro utente', 'a'], ['Cifra applicata', f >= 3 ? String(c[k]) : '·'], ['RAX', f >= 5 ? R : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));
      const descr = (v2) => (v2 === 0 ? 'nessun permesso' : [v2 & 4 ? 'lettura' : null, v2 & 2 ? 'scrittura' : null, v2 & 1 ? 'esecuzione' : null].filter(Boolean).join(' e '));

      P(0, 0, 'La richiesta', (p.chi === 'owner' ? 'Il proprietario del file' : 'Un utente diverso dal proprietario') + ' esegue un programma che chiama open sul file, in sola lettura. La chiamata è identica a quella di ogni altro utente.', {});
      P(1, 1, 'Il meccanismo', 'Il programma scrive 2 in RAX ed esegue SYSCALL. Il processore passa al livello 0, e lo smistamento seleziona la routine di open. Fino a questo punto l’identità del richiedente è stata priva di qualsiasi ruolo.', { calc: 'RAX = 2 → open',
        chiedi: { d: 'Il meccanismo di ingresso varia secondo l’utente che esegue il programma?', o: ['Sì', 'No'], g: 1, no: 'SYSCALL e smistamento sono identici per ogni programma. La differenza emerge in seguito, quando il kernel applica la politica.' } });
      P(2, 2, 'I permessi del file', 'Il kernel legge i permessi del file: 0' + p.perm + '. La prima cifra, ' + c[0] + ', vale per il proprietario: ' + descr(c[0]) + '. La seconda, ' + c[1] + ', per il gruppo: ' + descr(c[1]) + '. La terza, ' + c[2] + ', per tutti gli altri: ' + descr(c[2]) + '.', { calc: c.map((x, j) => U.NOMI[j] + ' ' + U.RWX(x)).join(' · ') });
      P(3, 2, 'La cifra che si applica', p.chi === 'owner' ? 'Il richiedente è il proprietario del file. A esso si applica la prima cifra, ' + c[0] + '.' : 'Il richiedente è diverso dal proprietario, ed è estraneo al gruppo del file. A esso si applica la terza cifra, ' + c[2] + '.', { calc: U.NOMI[k] + ': ' + c[k] + ' = ' + U.RWX(c[k]) });
      P(4, 2, 'Il permesso di lettura', 'La richiesta è una lettura, che corrisponde al peso 4. La cifra ' + c[k] + (ok ? ' contiene tale peso: il permesso è presente, e la politica concede l’accesso.' : ' è priva di tale peso: il permesso è assente, e la politica nega l’accesso.'), { calc: 'peso 4 in ' + c[k] + ': ' + (ok ? 'presente' : 'assente') });
      P(5, 3, ok ? 'Il descrittore' : 'L’errore', ok ? 'Il kernel occupa la prima voce libera della tabella dei descrittori, la 3, e la collega al file. Restituisce quindi 3 in RAX. Il programma impiegherà tale numero per le letture.' : 'Il kernel restituisce −13 in RAX, l’errore EACCES. La tabella dei descrittori resta invariata, e il contenuto del file rimane inaccessibile a questo programma.', { calc: 'RAX = ' + R, esito: ['RAX = ' + R, ok ? 'si' : 'no'] });
      return { passi, esito: v };
    }
  },
  bilancio: {
    regola: [
      'Il meccanismo è il modo in cui si entra nel kernel e si raggiunge un servizio, identico per ogni programma. La politica è la regola che stabilisce se concedere l’operazione, e dipende dal richiedente e dall’oggetto della richiesta.',
      'I permessi di un file sono tre cifre, per il proprietario, il gruppo e gli altri. In ogni cifra il peso 4 concede la lettura, il 2 la scrittura, l’1 l’esecuzione. Un accesso negato produce −13, EACCES.'
    ],
    errori: [
      ['Cercare la differenza nel modo di entrare nel kernel.', 'L’ingresso è il medesimo per ogni programma. La decisione è assunta all’interno del kernel, dalla politica.'],
      ['Leggere 0644 come un numero in base dieci.', 'Ogni cifra va letta separatamente, come somma dei pesi 4, 2 e 1.'],
      ['Applicare al proprietario la cifra degli altri.', 'Il kernel seleziona una sola cifra: la prima per il proprietario, la seconda per il gruppo, la terza per tutti gli altri.']
    ],
    saFare: ['Distinguere il meccanismo dalla politica.', 'Leggere le tre cifre dei permessi di un file.', 'Indicare se una apertura in lettura è concessa.'],
    esercizi: [
      { d: 'Un file ha i permessi 0640. Un utente diverso dal proprietario ed estraneo al gruppo ne richiede l’apertura in lettura. Quale valore restituisce open?', guida: 'Si scelga la risposta.', o: [
        { t: '−13', ok: true, fb: 'Agli altri si applica la terza cifra, 0, priva di qualsiasi permesso.' },
        { t: '3', fb: 'La lettura è concessa al proprietario e al gruppo, e questo utente è estraneo a entrambi.' },
        { t: '−9', fb: 'Il valore −9 è EBADF, l’errore di un descrittore non valido. Un accesso negato è EACCES, −13.' }] },
      { d: 'Quale cifra descrive i permessi di lettura e di esecuzione, senza la scrittura?', segnaposto: 'Una cifra', giuste: ['5', 'cinque'],
        ok: 'Lettura 4 più esecuzione 1: 5.',
        diagnosi: [
          { se: ['6', 'sei'], msg: 'Il sei è 4 + 2, lettura e scrittura.' },
          { se: ['3', 'tre'], msg: 'Il tre è 2 + 1, scrittura ed esecuzione.' },
          { se: ['7', 'sette'], msg: 'Il sette comprende anche la scrittura.' }
        ],
        altro: 'La cifra è diversa. Si sommino il peso della lettura e quello dell’esecuzione.',
        indizi: ['La lettura vale 4.', 'L’esecuzione vale 1.', '4 + 1.'],
        svolgimento: ['Lettura: 4.', 'Esecuzione: 1.', 'Cifra: 5.'] },
      { d: 'Un amministratore modifica i permessi di un file da 0600 a 0644. Che cosa è cambiato nel sistema?', guida: 'Si scelga la risposta.', o: [
        { t: 'La politica, poiché ora anche gli altri utenti possono leggere', ok: true, fb: 'Il meccanismo, cioè SYSCALL, lo smistamento e la routine di open, è rimasto identico.' },
        { t: 'Il meccanismo, poiché ora open entra nel kernel in un altro modo', fb: 'L’ingresso nel kernel è invariato. È cambiata la regola che il kernel applica.' },
        { t: 'Nulla, fino alla riapertura del file da parte del proprietario', fb: 'I nuovi permessi valgono dalla open successiva, qualunque utente la esegua.' }] }
    ],
    sfida: ['cslez4_2_05_syscalls_05', 'Selezione del servizio e funzione di libreria']
  }
});
