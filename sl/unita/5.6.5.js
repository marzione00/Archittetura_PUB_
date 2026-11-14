'use strict';
SL.unita565 = (() => {
  const esito = (p) => (p.ordB === 'opposto' && p.inter === 'alt' ? 'no' : 'si');
  const traccia = (p) => {
    const opp = p.ordB === 'opposto', alt = p.inter === 'alt', T = [], b1 = opp ? 'Y' : 'X', b2 = opp ? 'X' : 'Y';
    const S = (atto, titolo, testo, s, extra) => T.push(Object.assign({ atto, titolo, testo, X: '', Y: '', A: 'pronto', B: 'pronto', dip: 0, acc: '' }, s, extra ? { extra } : {}));
    S(0, 'I due lock sono liberi', 'I lock X e Y sono liberi. Il lavoratore A li acquisirà nell’ordine X, Y. Il lavoratore B nell’ordine ' + b1 + ', ' + b2 + '. A ciascuno servono entrambi per completare il lavoro.', {});
    if (alt && opp) {
      S(1, 'A · lock(X)', 'A acquisisce X, che è libero.', { X: 'A', A: 'ha X', acc: 'XA' }, { calc: 'X di A' });
      S(1, 'B · lock(Y)', 'B comincia dal suo primo lock, Y, che è libero, e lo acquisisce.', { X: 'A', Y: 'B', A: 'ha X', B: 'ha Y', acc: 'YB' }, { calc: 'Y di B', chiedi: { d: 'A possiede X e B possiede Y. Qual è la prossima richiesta di A?', o: ['Y, che appartiene a B', 'X, che ha già', 'Nessuna: A ha finito'], g: 0, no: 'A procede nell’ordine X, Y. Gli manca Y, che appartiene a B.' } });
      S(1, 'A · lock(Y)', 'A chiede Y. Il lock appartiene a B, e A viene bloccato. A continua a possedere X.', { X: 'A', Y: 'B', A: 'ha X · aspetta Y', B: 'ha Y', dip: 1, acc: 'A' }, { calc: 'A aspetta B' });
      S(1, 'B · lock(X)', 'B chiede X. Il lock appartiene ad A, e anche B viene bloccato. B continua a possedere Y.', { X: 'A', Y: 'B', A: 'ha X · aspetta Y', B: 'ha Y · aspetta X', dip: 3, acc: 'B' }, { calc: 'A aspetta B · B aspetta A' });
      S(2, 'L’esito', 'A aspetta un rilascio di B, e B aspetta un rilascio di A. Ciascuno rilascerebbe il proprio lock soltanto dopo avere ottenuto l’altro. Le due attese formano un cerchio: è un deadlock.', { X: 'A', Y: 'B', A: 'ha X · aspetta Y', B: 'ha Y · aspetta X', dip: 3, acc: 'AB' }, { esito: ['A e B bloccati per sempre', 'no'] });
    } else if (alt) {
      S(1, 'A · lock(X)', 'A acquisisce X, che è libero.', { X: 'A', A: 'ha X', acc: 'XA' }, { calc: 'X di A' });
      S(1, 'B · lock(X)', 'Anche B comincia da X, secondo l’ordine comune. Il lock appartiene ad A, e B viene bloccato alla prima richiesta.', { X: 'A', A: 'ha X', B: 'aspetta X · a mani vuote', dip: 2, acc: 'B' }, { calc: 'B aspetta A', chiedi: { d: 'B è bloccato su X. Quanti lock possiede in questo momento?', o: ['Nessuno', 'Uno: Y'], g: 0, no: 'Nell’ordine comune B comincia da X. Y lo chiederà soltanto dopo.' } });
      S(1, 'A · lock(Y)', 'A chiede Y. Nessuno lo possiede, perché B si è fermato prima: A lo acquisisce.', { X: 'A', Y: 'A', A: 'ha X e Y', B: 'aspetta X · a mani vuote', dip: 2, acc: 'YA' }, { calc: 'Y di A' });
      S(1, 'A lavora e rilascia', 'A completa il lavoro e rilascia Y e X. Il lock X passa a B, che torna pronto.', { X: 'B', A: 'ha finito', B: 'ha X', acc: 'XB' }, { calc: 'X di B · Y libero' });
      S(1, 'B · lock(Y), lavoro, rilascio', 'B acquisisce Y, che è libero, completa il lavoro e rilascia entrambi i lock.', { A: 'ha finito', B: 'ha finito', acc: 'B' }, { calc: 'X e Y liberi' });
      S(2, 'L’esito', 'A e B hanno completato entrambi. B ha aspettato, e la sua attesa aveva una fine: chi possedeva X poteva proseguire, perché B aspettava a mani vuote.', { A: 'ha finito', B: 'ha finito' }, { esito: ['A e B completano', 'si'] });
    } else {
      S(1, 'A · lock(X)', 'A acquisisce X, che è libero.', { X: 'A', A: 'ha X', acc: 'XA' }, { calc: 'X di A' });
      S(1, 'A · lock(Y)', 'A acquisisce anche Y. B deve ancora cominciare.', { X: 'A', Y: 'A', A: 'ha X e Y', acc: 'YA' }, { calc: 'Y di A' });
      S(1, 'A lavora e rilascia', 'A completa il lavoro e rilascia entrambi i lock.', { A: 'ha finito', acc: 'A' }, { calc: 'X e Y liberi', chiedi: { d: 'A ha rilasciato X e Y. B troverà ostacoli?', o: ['No: entrambi i lock sono liberi', 'Sì: A potrebbe riprenderli'], g: 0, no: 'A ha finito, e nessun altro thread possiede un lock.' } });
      S(1, 'B · lock(' + b1 + '), lock(' + b2 + '), lavoro, rilascio', 'B acquisisce ' + b1 + ' e poi ' + b2 + ', entrambi liberi, completa il lavoro e li rilascia.', { A: 'ha finito', B: 'ha finito', acc: 'B' }, { calc: 'X e Y liberi' });
      S(2, 'L’esito', 'A e B hanno completato entrambi. ' + (opp ? 'Gli ordini opposti questa volta sono passati inosservati, perché A ha finito prima che B cominciasse. Il difetto resta nel programma: con le acquisizioni alternate i due si bloccherebbero.' : 'Con l’ordine comune il risultato è lo stesso in ogni intercalazione.'), { A: 'ha finito', B: 'ha finito' }, { esito: ['A e B completano', 'si'] });
    }
    return T;
  };
  const quadro = (pre, s, o) => {
    const el = SL.el, w2 = (o.w - 10) / 2, a = (c) => s.acc.indexOf(c) >= 0, chi = (v) => (v ? 'di ' + v : 'libero');
    return [
      el.box(pre + 'X', o.x, o.y, w2, 54, 'lock X · rango 1', chi(s.X), a('X') ? 'att' : s.X ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'Y', o.x + w2 + 10, o.y, w2, 54, 'lock Y · rango 2', chi(s.Y), a('Y') ? 'att' : s.Y ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'A', o.x, o.y + 64, w2, 54, 'lavoratore A', s.A, s.dip === 3 ? 'err' : a('A') ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'B', o.x + w2 + 10, o.y + 64, w2, 54, 'lavoratore B', s.B, s.dip === 3 ? 'err' : a('B') ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'd', o.x, o.y + 128, o.w, 54, 'chi aspetta chi', s.dip === 0 ? 'nessuna attesa' : s.dip === 1 ? 'A aspetta B' : s.dip === 2 ? 'B aspetta A' : 'A aspetta B · B aspetta A', s.dip === 3 ? 'err' : s.dip ? 'zero' : '', { cls: 'stretta' })
    ];
  };
  return { esito, traccia, quadro };
})();
SL.registra('5.6.5', {
  titolo: 'Dagli invarianti locali all’ordinamento globale delle risorse',
  obiettivo: 'Obiettivo: riconoscere il cerchio di attese che nasce da due lock presi in ordini opposti, e saprai impedirlo assegnando un rango a ogni lock.',
  concetti: [['lucchetto', 'Due lock per una operazione'], ['stallo', 'Ordini opposti, attese incrociate'], ['tabella', 'Un rango per ogni lock']],
  filigrana: ['lucchetto', 'stallo', 'tabella'],
  richiami: {
    carte: [
      { sim: 'stallo', da: 'Dall’unità 5.6.2', t: 'Il deadlock', d: 'Due thread si aspettano a vicenda, e nessun evento futuro può sbloccarli.' },
      { sim: 'lucchetto', da: 'Dall’unità 5.5.5', t: 'Il proprietario del lock', d: 'Un lock resta del thread che lo ha acquisito fino al rilascio, anche mentre quel thread è bloccato.' },
      { sim: 'conflitto', da: 'Dall’unità 5.5.1', t: 'Le intercalazioni', d: 'Le operazioni di due thread possono alternarsi in molti ordini diversi.' }
    ],
    domanda: { d: 'Prima di proseguire: A possiede il lock X ed è bloccato in attesa di altro. B chiede X. Che cosa accade a B?', o: [
      { t: 'Si blocca fino a quando A rilascerà X', ok: true, fb: 'Un lock occupato ferma chi lo chiede, qualunque cosa stia facendo il proprietario.' },
      { t: 'Ottiene X, perché A è fermo', fb: 'Un thread bloccato conserva i propri lock.' },
      { t: 'Riceve un errore', fb: 'Una lock su un lock occupato mette il thread in attesa.' }
    ] }
  },
  idea: {
    titolo: 'Una regola unica per tutti i lock',
    termini: ['ordine globale dei lock', 'rango di un lock'],
    testo: [
      'Alcune operazioni hanno bisogno di due strutture condivise insieme. Per spostare un valore da una tabella a un’altra, un thread deve proteggerle entrambe per tutta la durata dello spostamento, e quindi deve possedere due lock nello stesso momento. Ciascun lock, preso da solo, fa bene il suo lavoro: la tabella che protegge resta coerente. Il problema può nascere dalla combinazione.',
      'Chiamiamo X e Y i due lock, e A e B due lavoratori. A prende X e poi chiede Y. B procede nel verso opposto: prende Y e poi chiede X. Se le acquisizioni si alternano, A si trova con X in mano ad aspettare Y, e B con Y in mano ad aspettare X. Ciascuno tiene ciò che serve all’altro. È lo stesso deadlock del buffer, costruito questa volta con due lock.',
      { fig: 'scena', w: 720, h: 190, titolo: 'Ordini opposti, acquisizioni alternate', nota: 'Ogni lavoratore possiede il lock che manca all’altro, e lo rilascerebbe soltanto dopo avere ottenuto il secondo.', els: SL.unita565.quadro('g', SL.unita565.traccia({ ordB: 'opposto', inter: 'alt' })[4], { x: 10, y: 4, w: 700 }) },
      'Conviene descrivere la situazione con delle frecce: una freccia va da chi aspetta a chi possiede ciò che è atteso. A aspetta B, e B aspetta A. Le due frecce si chiudono in un cerchio, e in un cerchio nessuno è il primo a muoversi. Ogni protezione locale è rispettata, e il sistema nel suo insieme è fermo.',
      'Il rimedio è un accordo valido per tutto il programma, un [[ordine globale dei lock]]. A ogni lock si assegna un numero, il [[rango di un lock|rango]], e ogni thread acquisisce i lock che gli servono per rango crescente. Con X di rango 1 e Y di rango 2, anche B deve cominciare da X. Se X è occupato, B si ferma lì, a mani vuote. Y resta libero per A, che completa e rilascia tutto.',
      'L’argomento vale per qualunque numero di lock. Un thread che aspetta un lock possiede soltanto lock di rango più basso. Seguendo le frecce da chi aspetta a chi possiede, i ranghi dei lock attesi salgono a ogni passo. Un cerchio dovrebbe tornare al rango di partenza, e una sequenza sempre crescente lo esclude. C’è infine un’avvertenza, la stessa dell’unità 5.6.2: con ordini opposti il blocco compare soltanto in certe intercalazioni. Un programma può funzionare mille volte e fermarsi alla successiva.'
    ]
  },
  esperimento: {
    faremo: [
      'Due lavoratori, A e B, hanno bisogno dei lock X e Y. A li prende sempre nell’ordine X, Y. Sceglierai l’ordine di B, e il modo in cui le acquisizioni dei due si intercalano.',
      'Seguiremo il proprietario di ciascun lock e lo stato dei due lavoratori. In basso terremo il conto di chi aspetta chi: due attese incrociate chiudono il cerchio.'
    ],
    vedrai: [
      ['lucchetto', 'I due lock', 'In alto: X e Y, con il rango e il proprietario del momento.'],
      ['thread', 'I due lavoratori', 'Al centro: che cosa possiede e che cosa aspetta ciascuno.'],
      ['stallo', 'Le attese', 'In basso: chi aspetta un rilascio di chi.']
    ]
  },
  lab: {
    titolo: 'Due lock, e l’ordine in cui prenderli',
    scena: { w: 860, h: 194 },
    atti: ['L’inizio', 'Le acquisizioni', 'L’esito'],
    controlli: [
      { id: 'ordB', tipo: 'scelta', eti: 'Ordine di B', opzioni: [['opposto', 'Y, poi X (opposto ad A)'], ['comune', 'X, poi Y (come A)']], valore: 'opposto' },
      { id: 'inter', tipo: 'scelta', eti: 'Intercalazione', opzioni: [['alt', 'acquisizioni alternate: A, B, A, B'], ['seq', 'A finisce prima che B cominci']], valore: 'alt' }
    ],
    nota: 'Il numero dei passi dipende dal caso. A acquisisce sempre X e poi Y.',
    previsione: {
      domanda: (p) => 'A acquisisce X e poi Y. B acquisisce ' + (p.ordB === 'opposto' ? 'Y e poi X' : 'X e poi Y') + '. ' + (p.inter === 'alt' ? 'Le acquisizioni si alternano: una di A, una di B, e così via.' : 'A completa tutto il suo lavoro prima che B cominci.') + ' A e B completano entrambi?',
      opzioni: () => [['si', 'Sì, entrambi'], ['no', 'No: restano bloccati per sempre']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava «' + (pred === 'si' ? 'sì' : 'no') + '». ' + (esito === 'si' ? 'A e B completano entrambi. ' : 'A e B restano bloccati. ') + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'no' ? 'Dopo la prima acquisizione ciascuno possiede il lock che l’altro chiederà per secondo.' : p.ordB === 'comune' ? 'Con l’ordine comune B si ferma su X senza possedere nulla, e A trova Y libero.' : 'A ha rilasciato tutto prima che B cominciasse. Gli ordini opposti restano un difetto, che questa intercalazione ha lasciato nascosto.'),
    costruisci(p) {
      const U = SL.unita565, T = U.traccia(p);
      const passi = T.map((s) => Object.assign({ atto: s.atto, titolo: s.titolo, testo: s.testo, hud: [['Lock X', s.X ? 'di ' + s.X : 'libero', 'a'], ['Lock Y', s.Y ? 'di ' + s.Y : 'libero', 'c'], ['Attese', s.dip === 0 ? 'nessuna' : s.dip === 3 ? 'incrociate' : 'una']], els: U.quadro('b', s, { x: 20, y: 4, w: 820 }) }, s.extra || {}));
      return { passi, esito: U.esito(p) };
    }
  },
  bilancio: {
    regola: [
      'A ogni lock si assegna un rango. Ogni thread acquisisce i lock per rango crescente.',
      'Chi aspetta un lock possiede soltanto lock di rango più basso: un cerchio di attese è impossibile.'
    ],
    errori: [
      ['Ragionare un lock per volta.', 'Ogni lock può proteggere bene la sua struttura, e l’insieme può comunque fermarsi.'],
      ['Considerare sicuro un programma che non si è mai bloccato.', 'Con ordini opposti il deadlock dipende dall’intercalazione, e può comparire dopo molte esecuzioni riuscite.'],
      ['Chiedere un lock di rango più basso di uno già posseduto.', 'Occorre rilasciare prima i lock di rango più alto, e riacquisirli nell’ordine.']
    ],
    saFare: ['Riconoscere due attese incrociate fra due thread.', 'Assegnare un rango ai lock e controllo l’ordine delle acquisizioni.', 'Spiegare perché l’ordine comune esclude il cerchio.'],
    esercizi: [
      { d: 'Quattro lock hanno rango 1, 2, 3 e 4. Un thread possiede il lock di rango 3. Rispettando l’ordine globale, quale rango può ancora chiedere?', segnaposto: 'Un numero', giuste: ['4', 'quattro'],
        ok: 'Sono ammessi soltanto i ranghi maggiori di quello posseduto: resta il 4.',
        diagnosi: [
          { se: ['1', 'uno', '2', 'due'], msg: 'Quel lock ha un rango più basso di uno già posseduto. L’ordine ammette soltanto ranghi crescenti.' },
          { se: ['3', 'tre'], msg: 'Il lock di rango 3 è già suo.' }
        ],
        altro: 'Il rango è diverso. Cerca i ranghi maggiori di quello già posseduto.',
        indizi: ['Il thread possiede il rango 3.', 'Può chiedere soltanto ranghi maggiori di 3.', 'Resta il 4.'],
        svolgimento: ['Rango posseduto: 3.', 'Ranghi ammessi: maggiori di 3.', 'Risposta: 4.'] },
      { d: 'Un thread possiede il lock di rango 2 e scopre che gli serve anche quello di rango 1. Che cosa deve fare per rispettare l’ordine?', guida: 'Si scelga la risposta.', o: [
        { t: 'Rilasciare il 2, acquisire l’1, e riacquisire il 2', ok: true, fb: 'Così le acquisizioni tornano in ordine crescente.' },
        { t: 'Acquisire subito l’1', fb: 'Un altro thread potrebbe possedere l’1 e aspettare il 2: il cerchio si chiuderebbe.' },
        { t: 'Controllare che l’1 sia libero, e poi prenderlo', fb: 'Fra il controllo e l’acquisizione la situazione può cambiare. L’ordine va rispettato anche con i lock liberi.' }] },
      { d: 'Tre thread: A chiede X e poi Y, B chiede Y e poi Z, C chiede Z e poi X. Ognuno ha già acquisito il primo lock. Quanti di loro possono ottenere il secondo?', segnaposto: 'Un numero', giuste: ['0', 'zero', 'nessuno'],
        ok: 'A aspetta B, B aspetta C, C aspetta A: il cerchio ha tre anelli.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Ogni secondo lock è già il primo lock di un altro thread.' },
          { se: ['1', 'uno', '2', 'due'], msg: 'Controlla per ciascuno chi possiede il lock che gli manca: A aspetta B, B aspetta C, C aspetta A.' }
        ],
        altro: 'Il numero è diverso. Per ogni thread, si scriva chi possiede il lock che gli manca.',
        indizi: ['A possiede X, B possiede Y, C possiede Z.', 'Ad A manca Y, a B manca Z, a C manca X.', 'Ogni lock mancante è occupato: nessuno prosegue.'],
        svolgimento: ['A aspetta B.', 'B aspetta C.', 'C aspetta A.', 'Possono proseguire: 0.'] }
    ]
  }
});
