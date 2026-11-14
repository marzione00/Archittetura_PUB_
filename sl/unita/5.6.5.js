'use strict';
SL.unita565 = (() => {
  const esito = (p) => (p.ordB === 'opposto' && p.inter === 'alt' ? 'no' : 'si');
  const traccia = (p) => {
    const opp = p.ordB === 'opposto', alt = p.inter === 'alt', T = [], b1 = opp ? 'Y' : 'X', b2 = opp ? 'X' : 'Y';
    const S = (atto, titolo, testo, s, extra) => T.push(Object.assign({ atto, titolo, testo, X: '', Y: '', A: 'pronto', B: 'pronto', dip: 0, acc: '' }, s, extra ? { extra } : {}));
    S(0, 'I due lock sono liberi', 'I lock X e Y sono liberi. Il lavoratore A li acquisirà nell’ordine X, Y, e il lavoratore B nell’ordine ' + b1 + ', ' + b2 + '. A ciascuno occorrono entrambi per completare il lavoro.', {});
    if (alt && opp) {
      S(1, 'A · lock(X)', 'A acquisisce X, che è libero.', { X: 'A', A: 'ha X', acc: 'XA' }, { calc: 'X di A' });
      S(1, 'B · lock(Y)', 'B ha inizio dal proprio primo lock, Y, che è libero, e lo acquisisce.', { X: 'A', Y: 'B', A: 'ha X', B: 'ha Y', acc: 'YB' }, { calc: 'Y di B', chiedi: { d: 'A possiede X e B possiede Y. Qual è la prossima richiesta di A?', o: ['Y, che appartiene a B', 'X, che possiede già', 'Nessuna, poiché A ha terminato'], g: 0, no: 'A procede nell’ordine X, Y. Gli manca Y, che appartiene a B.' } });
      S(1, 'A · lock(Y)', 'A richiede Y. Il lock appartiene a B, e A è bloccato. A continua a possedere X.', { X: 'A', Y: 'B', A: 'ha X · attende Y', B: 'ha Y', dip: 1, acc: 'A' }, { calc: 'A attende B' });
      S(1, 'B · lock(X)', 'B richiede X. Il lock appartiene ad A, e anche B è bloccato. B continua a possedere Y.', { X: 'A', Y: 'B', A: 'ha X · attende Y', B: 'ha Y · attende X', dip: 3, acc: 'B' }, { calc: 'A attende B · B attende A' });
      S(2, 'L’esito', 'A attende un rilascio di B, e B attende un rilascio di A. Ciascuno rilascerebbe il proprio lock soltanto dopo avere ottenuto l’altro. Le due attese formano un ciclo: si tratta di un deadlock.', { X: 'A', Y: 'B', A: 'ha X · attende Y', B: 'ha Y · attende X', dip: 3, acc: 'AB' }, { esito: ['A e B bloccati per sempre', 'no'] });
    } else if (alt) {
      S(1, 'A · lock(X)', 'A acquisisce X, che è libero.', { X: 'A', A: 'ha X', acc: 'XA' }, { calc: 'X di A' });
      S(1, 'B · lock(X)', 'Anche B ha inizio da X, secondo l’ordine comune. Il lock appartiene ad A, e B è bloccato alla prima richiesta.', { X: 'A', A: 'ha X', B: 'attende X · senza lock', dip: 2, acc: 'B' }, { calc: 'B attende A', chiedi: { d: 'B è bloccato su X. Quanti lock possiede in questo momento?', o: ['Nessuno', 'Uno: Y'], g: 0, no: 'Nell’ordine comune B ha inizio da X, e richiederà Y soltanto in seguito.' } });
      S(1, 'A · lock(Y)', 'A richiede Y. Nessun thread lo possiede, poiché B si è bloccato in precedenza: A lo acquisisce.', { X: 'A', Y: 'A', A: 'ha X e Y', B: 'attende X · senza lock', dip: 2, acc: 'YA' }, { calc: 'Y di A' });
      S(1, 'A lavora e rilascia', 'A completa il lavoro e rilascia Y e X. Il lock X passa a B, che torna pronto.', { X: 'B', A: 'ha finito', B: 'ha X', acc: 'XB' }, { calc: 'X di B · Y libero' });
      S(1, 'B · lock(Y), lavoro, rilascio', 'B acquisisce Y, che è libero, completa il lavoro e rilascia entrambi i lock.', { A: 'ha finito', B: 'ha finito', acc: 'B' }, { calc: 'X e Y liberi' });
      S(2, 'L’esito', 'A e B hanno completato entrambi. B ha atteso, e la sua attesa aveva un termine: il possessore di X poteva proseguire, poiché B attendeva senza possedere alcun lock.', { A: 'ha finito', B: 'ha finito' }, { esito: ['A e B completano', 'si'] });
    } else {
      S(1, 'A · lock(X)', 'A acquisisce X, che è libero.', { X: 'A', A: 'ha X', acc: 'XA' }, { calc: 'X di A' });
      S(1, 'A · lock(Y)', 'A acquisisce anche Y. B deve ancora avere inizio.', { X: 'A', Y: 'A', A: 'ha X e Y', acc: 'YA' }, { calc: 'Y di A' });
      S(1, 'A lavora e rilascia', 'A completa il lavoro e rilascia entrambi i lock.', { A: 'ha finito', acc: 'A' }, { calc: 'X e Y liberi', chiedi: { d: 'A ha rilasciato X e Y. B troverà ostacoli?', o: ['No, entrambi i lock sono liberi', 'Sì, A potrebbe riacquisirli'], g: 0, no: 'A ha terminato, e nessun altro thread possiede un lock.' } });
      S(1, 'B · lock(' + b1 + '), lock(' + b2 + '), lavoro, rilascio', 'B acquisisce ' + b1 + ' e poi ' + b2 + ', entrambi liberi, completa il lavoro e li rilascia.', { A: 'ha finito', B: 'ha finito', acc: 'B' }, { calc: 'X e Y liberi' });
      S(2, 'L’esito', 'A e B hanno completato entrambi. ' + (opp ? 'Gli ordini opposti sono rimasti in questo caso senza conseguenze, poiché A ha terminato prima dell’inizio di B. Il difetto resta nel programma: con le acquisizioni alternate i due thread si bloccherebbero.' : 'Con l’ordine comune il risultato è il medesimo in ogni intercalazione.'), { A: 'ha finito', B: 'ha finito' }, { esito: ['A e B completano', 'si'] });
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
      el.box(pre + 'd', o.x, o.y + 128, o.w, 54, 'attese in corso', s.dip === 0 ? 'nessuna attesa' : s.dip === 1 ? 'A attende B' : s.dip === 2 ? 'B attende A' : 'A attende B · B attende A', s.dip === 3 ? 'err' : s.dip ? 'zero' : '', { cls: 'stretta' })
    ];
  };
  return { esito, traccia, quadro };
})();
SL.registra('5.6.5', {
  titolo: 'Dagli invarianti locali all’ordinamento globale delle risorse',
  obiettivo: 'Obiettivo: riconoscere il ciclo di attese prodotto da due lock acquisiti in ordini opposti, e impedirlo con l’assegnazione di un rango a ogni lock.',
  concetti: [['lucchetto', 'Due lock per un’operazione'], ['stallo', 'Ordini opposti, attese reciproche'], ['tabella', 'Un rango per ogni lock']],
  filigrana: ['lucchetto', 'stallo', 'tabella'],
  richiami: {
    carte: [
      { sim: 'stallo', da: 'Dall’unità 5.6.2', t: 'Il deadlock', d: 'Due thread si attendono a vicenda, e nessun evento futuro può sbloccarli.' },
      { sim: 'lucchetto', da: 'Dall’unità 5.5.5', t: 'Il proprietario del lock', d: 'Un lock resta in possesso del thread che lo ha acquisito fino al rilascio, anche mentre quel thread è bloccato.' },
      { sim: 'conflitto', da: 'Dall’unità 5.5.1', t: 'Le intercalazioni', d: 'Le operazioni di due thread possono alternarsi in molti ordini diversi.' }
    ],
    domanda: { d: 'Prima di proseguire: A possiede il lock X ed è bloccato in attesa di un’altra risorsa. B richiede X. Che cosa accade a B?', o: [
      { t: 'Si blocca fino al rilascio di X da parte di A', ok: true, fb: 'Un lock occupato blocca il thread che lo richiede, qualunque sia l’attività del proprietario.' },
      { t: 'Ottiene X, poiché A è bloccato', fb: 'Un thread bloccato conserva i propri lock.' },
      { t: 'Riceve un errore', fb: 'Una lock su un lock occupato pone il thread in attesa.' }
    ] }
  },
  idea: {
    titolo: 'Una regola unica per tutti i lock',
    termini: ['ordine globale dei lock', 'rango di un lock'],
    testo: [
      'Alcune operazioni richiedono due strutture condivise insieme. Per trasferire un valore da una tabella a un’altra, un thread deve proteggerle entrambe per l’intera durata del trasferimento, e quindi deve possedere due lock nel medesimo momento. Ciascun lock, considerato singolarmente, svolge correttamente la propria funzione: la tabella che protegge resta coerente. Il problema può derivare dalla combinazione.',
      'Siano X e Y i due lock, e A e B due lavoratori. A acquisisce X e quindi richiede Y, mentre B procede nell’ordine opposto: acquisisce Y e quindi richiede X. Se le acquisizioni si alternano, A possiede X e attende Y, e B possiede Y e attende X. Ciascuno possiede la risorsa necessaria all’altro. Si tratta del medesimo deadlock del buffer, costruito in questo caso con due lock.',
      { fig: 'scena', w: 720, h: 190, titolo: 'Ordini opposti, acquisizioni alternate', nota: 'Ogni lavoratore possiede il lock che manca all’altro, e lo rilascerebbe soltanto dopo avere ottenuto il secondo.', els: SL.unita565.quadro('g', SL.unita565.traccia({ ordB: 'opposto', inter: 'alt' })[4], { x: 10, y: 4, w: 700 }) },
      'La situazione si descrive con un insieme di frecce: una freccia va dal thread in attesa al thread che possiede la risorsa attesa. A attende B, e B attende A. Le due frecce formano un ciclo, e in un ciclo nessun thread può procedere per primo. Ogni protezione locale è rispettata, e il sistema nel suo insieme è bloccato.',
      'Il rimedio è un accordo valido per l’intero programma, un [[ordine globale dei lock]]. A ogni lock si assegna un numero, il [[rango di un lock|rango]], e ogni thread acquisisce i lock necessari per rango crescente. Con X di rango 1 e Y di rango 2, anche B deve avere inizio da X. Se X è occupato, B si blocca in quel punto, senza possedere alcun lock. Y resta libero per A, che completa il lavoro e rilascia entrambi i lock.',
      'L’argomento vale per qualunque numero di lock. Un thread in attesa di un lock possiede soltanto lock di rango inferiore. Lungo le frecce, dal thread in attesa al thread possessore, i ranghi dei lock attesi crescono a ogni passo. Un ciclo dovrebbe tornare al rango di partenza, e una sequenza sempre crescente lo esclude. Resta infine un’avvertenza, la medesima dell’unità 5.6.2: con ordini opposti il blocco compare soltanto in alcune intercalazioni. Un programma può funzionare mille volte e bloccarsi alla successiva.'
    ]
  },
  esperimento: {
    faremo: [
      'Due lavoratori, A e B, richiedono i lock X e Y. A li acquisisce sempre nell’ordine X, Y. I controlli fissano l’ordine di B, e l’intercalazione delle acquisizioni dei due.',
      'L’esperimento segue il proprietario di ciascun lock e lo stato dei due lavoratori, e in basso registra le attese fra i thread: due attese reciproche formano il ciclo.'
    ],
    vedrai: [
      ['lucchetto', 'I due lock', 'In alto: X e Y, con il rango e il proprietario corrente.'],
      ['thread', 'I due lavoratori', 'Al centro: i lock posseduti e i lock attesi da ciascuno.'],
      ['stallo', 'Le attese', 'In basso: le attese di rilascio fra i thread.']
    ]
  },
  lab: {
    titolo: 'Due lock, e l’ordine di acquisizione',
    scena: { w: 860, h: 194 },
    atti: ['L’inizio', 'Le acquisizioni', 'L’esito'],
    controlli: [
      { id: 'ordB', tipo: 'scelta', eti: 'Ordine di B', opzioni: [['opposto', 'Y, poi X (opposto ad A)'], ['comune', 'X, poi Y (come A)']], valore: 'opposto' },
      { id: 'inter', tipo: 'scelta', eti: 'Intercalazione', opzioni: [['alt', 'acquisizioni alternate: A, B, A, B'], ['seq', 'A termina prima dell’inizio di B']], valore: 'alt' }
    ],
    nota: 'Il numero dei passi dipende dal caso. A acquisisce sempre X e poi Y.',
    previsione: {
      domanda: (p) => 'A acquisisce X e quindi Y. B acquisisce ' + (p.ordB === 'opposto' ? 'Y e poi X' : 'X e poi Y') + '. ' + (p.inter === 'alt' ? 'Le acquisizioni si alternano: una di A, una di B, e così via.' : 'A completa l’intero lavoro prima dell’inizio di B.') + ' A e B completano entrambi?',
      opzioni: () => [['si', 'Sì, entrambi'], ['no', 'No, restano bloccati indefinitamente']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava «' + (pred === 'si' ? 'sì' : 'no') + '». ' + (esito === 'si' ? 'A e B completano entrambi. ' : 'A e B restano bloccati. ') + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'no' ? 'Dopo la prima acquisizione ciascuno possiede il lock che l’altro richiederà per secondo.' : p.ordB === 'comune' ? 'Con l’ordine comune B si blocca su X senza possedere alcun lock, e A trova Y libero.' : 'A ha rilasciato entrambi i lock prima dell’inizio di B. Gli ordini opposti restano un difetto, che questa intercalazione ha lasciato nascosto.'),
    costruisci(p) {
      const U = SL.unita565, T = U.traccia(p);
      const passi = T.map((s) => Object.assign({ atto: s.atto, titolo: s.titolo, testo: s.testo, hud: [['Lock X', s.X ? 'di ' + s.X : 'libero', 'a'], ['Lock Y', s.Y ? 'di ' + s.Y : 'libero', 'c'], ['Attese', s.dip === 0 ? 'nessuna' : s.dip === 3 ? 'incrociate' : 'una']], els: U.quadro('b', s, { x: 20, y: 4, w: 820 }) }, s.extra || {}));
      return { passi, esito: U.esito(p) };
    }
  },
  bilancio: {
    regola: [
      'A ogni lock si assegna un rango. Ogni thread acquisisce i lock per rango crescente.',
      'Un thread in attesa di un lock possiede soltanto lock di rango inferiore: un ciclo di attese è impossibile.'
    ],
    errori: [
      ['Analizzare un lock per volta.', 'Ogni lock può proteggere correttamente la propria struttura, e l’insieme può comunque bloccarsi.'],
      ['Considerare sicuro un programma che non si è mai bloccato.', 'Con ordini opposti il deadlock dipende dall’intercalazione, e può comparire dopo molte esecuzioni riuscite.'],
      ['Richiedere un lock di rango inferiore a uno già posseduto.', 'Occorre rilasciare prima i lock di rango più alto, e riacquisirli nell’ordine.']
    ],
    saFare: ['Riconoscere due attese reciproche fra due thread.', 'Assegnare un rango ai lock e controllare l’ordine delle acquisizioni.', 'Spiegare per quale ragione l’ordine comune esclude il ciclo di attese.'],
    esercizi: [
      { d: 'Quattro lock hanno rango 1, 2, 3 e 4. Un thread possiede il lock di rango 3. Rispettando l’ordine globale, quale rango può ancora richiedere?', segnaposto: 'Un numero', giuste: ['4', 'quattro'],
        ok: 'Sono ammessi soltanto i ranghi maggiori di quello posseduto: resta il 4.',
        diagnosi: [
          { se: ['1', 'uno', '2', 'due'], msg: 'Quel lock ha un rango inferiore a uno già posseduto. L’ordine ammette soltanto ranghi crescenti.' },
          { se: ['3', 'tre'], msg: 'Il lock di rango 3 è già in suo possesso.' }
        ],
        altro: 'Il rango è diverso. Si individuino i ranghi maggiori di quello già posseduto.',
        indizi: ['Il thread possiede il rango 3.', 'Può richiedere soltanto ranghi maggiori di 3.', 'Resta il 4.'],
        svolgimento: ['Rango posseduto: 3.', 'Ranghi ammessi: maggiori di 3.', 'Risposta: 4.'] },
      { d: 'Un thread possiede il lock di rango 2 e rileva che gli occorre anche quello di rango 1. Quale procedimento rispetta l’ordine?', guida: 'Si scelga la risposta.', o: [
        { t: 'Rilasciare il 2, acquisire l’1, e riacquisire il 2', ok: true, fb: 'In tal modo le acquisizioni tornano in ordine crescente.' },
        { t: 'Acquisire immediatamente l’1', fb: 'Un altro thread potrebbe possedere l’1 e attendere il 2: si formerebbe un ciclo di attese.' },
        { t: 'Controllare che l’1 sia libero, e quindi acquisirlo', fb: 'Fra il controllo e l’acquisizione la situazione può cambiare. L’ordine va rispettato anche con i lock liberi.' }] },
      { d: 'Tre thread: A richiede X e quindi Y, B richiede Y e quindi Z, C richiede Z e quindi X. Ognuno ha già acquisito il primo lock. Quanti di essi possono ottenere il secondo?', segnaposto: 'Un numero', giuste: ['0', 'zero', 'nessuno'],
        ok: 'A attende B, B attende C, C attende A: il ciclo comprende tre thread.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Ogni secondo lock è già il primo lock di un altro thread.' },
          { se: ['1', 'uno', '2', 'due'], msg: 'Per ciascun thread va individuato il possessore del lock mancante: A attende B, B attende C, C attende A.' }
        ],
        altro: 'Il numero è diverso. Per ogni thread, si annoti il possessore del lock mancante.',
        indizi: ['A possiede X, B possiede Y, C possiede Z.', 'Ad A manca Y, a B manca Z, a C manca X.', 'Ogni lock mancante è occupato: nessun thread prosegue.'],
        svolgimento: ['A attende B.', 'B attende C.', 'C attende A.', 'Possono proseguire: 0.'] }
    ]
  }
});
