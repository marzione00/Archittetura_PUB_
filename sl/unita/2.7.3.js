'use strict';
SL.registra('2.7.3', {
  titolo: 'Protezioni e loro limiti',
  obiettivo: 'Alla fine saprai dire che cosa verifica la sentinella posta nel frame, quali scritture rileva e quali le sfuggono, e a che cosa servono le altre difese.',
  concetti: [['scudo', 'La sentinella'], ['bilancio', 'Il controllo prima di RET'], ['lente', 'Che cosa resta scoperto']],
  filigrana: ['scudo', 'bilancio', 'lente'],
  richiami: {
    carte: [
      { sim: 'scudo', da: 'Dall’unità 2.7.2', t: 'Traboccamento', d: 'Una copia più lunga del buffer prosegue nelle celle successive del frame, fino al RBP salvato e all’indirizzo di ritorno.' },
      { sim: 'pila', da: 'Dall’unità 2.7.1', t: 'Epilogo', d: 'Le ultime istruzioni di una funzione, che smontano il frame e terminano con RET.' },
      { sim: 'memory', da: 'Dall’unità 2.5.4', t: 'Mappatura', d: 'Un intervallo di indirizzi a cui il kernel ha associato della memoria, con i permessi per usarla.' }
    ],
    domanda: { d: 'Prima di proseguire: una copia parte dall’inizio di un buffer locale e prosegue oltre la sua fine. Quale di queste celle raggiunge per ultima?', o: [
      { t: 'L’indirizzo di ritorno', ok: true, fb: 'La copia avanza verso gli indirizzi alti e attraversa il frame in ordine. L’indirizzo di ritorno sta in fondo.' },
      { t: 'Il RBP salvato', fb: 'Il RBP salvato sta subito prima dell’indirizzo di ritorno, e viene raggiunto prima.' },
      { t: 'Le altre variabili locali', fb: 'Le variabili locali sono le più vicine al buffer, e vengono raggiunte per prime.' }
    ] }
  },
  idea: {
    titolo: 'Una guardia fra i dati e il ritorno',
    termini: ['sentinella', 'memoria non eseguibile', 'aslr'],
    testo: [
      'Il traboccamento dell’unità precedente attraversa il frame in ordine: per arrivare all’indirizzo di ritorno deve passare su tutto ciò che lo precede. Su questa osservazione si fonda la difesa più diffusa. Il compilatore colloca fra le variabili locali e i dati di controllo un valore di guardia, la [[sentinella]], scelto a caso all’avvio del programma.',
      'Il prologo scrive la sentinella nel frame. Prima di RET, l’epilogo la rilegge e la confronta con l’originale, conservato in una zona che un traboccamento sulla pila non può raggiungere. Se i due valori differiscono, il programma viene arrestato sul posto, prima che l’indirizzo di ritorno alterato possa essere usato.',
      { fig: 'scena', w: 720, h: 96, titolo: 'Il frame con la sentinella, per indirizzi crescenti', nota: 'Una copia che parte dal buffer incontra la sentinella prima del RBP salvato e dell’indirizzo di ritorno.', els: [
        SL.el.box('a', 0, 0, 170, 54, 'buffer', '8 byte', 'on', { cls: 'stretta' }), SL.el.box('b', 178, 0, 180, 54, 'sentinella', '8 byte', 'att', { cls: 'stretta' }),
        SL.el.box('c', 366, 0, 170, 54, 'RBP salvato', '8 byte', '', { cls: 'stretta' }), SL.el.box('d', 544, 0, 176, 54, 'ritorno', '8 byte', '', { cls: 'stretta' }),
        SL.el.nota('p1', 0, 62, 'da 0 a 7', 'mono minuta'), SL.el.nota('p2', 178, 62, 'da 8 a 15', 'mono minuta'), SL.el.nota('p3', 366, 62, 'da 16 a 23', 'mono minuta'), SL.el.nota('p4', 544, 62, 'da 24 a 31', 'mono minuta')] },
      'La sentinella verifica una cosa sola: che i propri byte, al momento del controllo, siano quelli attesi. Da qui discendono i suoi limiti. Una scrittura che arriva direttamente sull’indirizzo di ritorno, per esempio attraverso un indice fuori dai limiti, la lascia intatta. Chi riesce a conoscerne il valore può riscriverlo tale e quale. E le variabili locali poste prima di essa restano esposte.',
      'Per questo le difese si sommano. La [[memoria non eseguibile]] vieta al processore di eseguire istruzioni prese dalla pila e dalle altre zone di dati. I byte copiati in un buffer restano così dei semplici dati. La disposizione casuale degli indirizzi, nota con la sigla [[aslr|ASLR]], carica codice, pila e librerie in posizioni diverse a ogni avvio, così che un indirizzo valido in un’esecuzione risulti sbagliato nella successiva.',
      'Nessuna di queste difese elimina il difetto. Ciascuna rende più difficile sfruttarlo, e per ciascuna è noto un modo di aggirarla. L’errore si elimina soltanto nel programma, controllando i limiti prima di scrivere.'
    ]
  },
  esperimento: {
    faremo: [
      'Una funzione ha un buffer di 8 byte, una sentinella, il RBP salvato e l’indirizzo di ritorno. Sceglierai una scrittura fra cinque: tre copie di lunghezza diversa, una scrittura singola fuori dai limiti e una copia che conosce il valore della sentinella.',
      'Eseguiremo la scrittura, poi il controllo che precede RET. Dopo il caso proposto, prova la scrittura singola e la copia che conosce la sentinella: sono i due casi in cui la difesa tace.'
    ],
    vedrai: [
      ['memory', 'Il frame, byte per byte', 'In alto: i 32 byte del frame su due file. I byte alterati compaiono in rosso.'],
      ['scudo', 'Le due sentinelle', 'Al centro: il valore atteso e quello trovato nel frame.'],
      ['bilancio', 'L’esito', 'In basso: l’esito del confronto e ciò che accade a RET.']
    ]
  },
  lab: {
    titolo: 'Cinque scritture davanti alla sentinella',
    scena: { w: 860, h: 372 },
    atti: ['La sentinella al suo posto', 'La scrittura', 'Il controllo prima di RET', 'L’esito', 'Che cosa è stato verificato'],
    controlli: [
      { id: 's', tipo: 'scelta', eti: 'Scrittura', opzioni: [['c8', 'copia di 8 byte'], ['c9', 'copia di 9 byte'], ['c28', 'copia di 28 byte'], ['idx', 'un byte allo spostamento 24'], ['nota', 'copia di 28 byte con la sentinella esatta']], valore: 'c28' }
    ],
    nota: 'I passi sono sempre cinque. I byte copiati valgono 0x41, tranne dove è indicato diversamente.',
    previsione: {
      domanda: (p) => 'Il buffer occupa gli spostamenti da 0 a 7, la sentinella da 8 a 15, il RBP salvato da 16 a 23 e l’indirizzo di ritorno da 24 a 31. Il programma esegue ' + SL.unita273.DESCR[p.s] + '. Che cosa accade quando la funzione arriva al controllo che precede RET?',
      opzioni: () => ['Il controllo fallisce, e il programma viene arrestato', 'Il controllo passa, e RET viene eseguita']
    },
    confronto: (pred, esito, p) => { const c = SL.unita273.conto(p.s); return 'Avevi previsto: ' + pred + '. Esito: ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : c.rilevata ? 'La scrittura ha cambiato almeno un byte della sentinella, e il confronto lo rivela.' : 'Al momento del controllo i byte della sentinella sono quelli attesi. Il confronto non guarda nient’altro.'); },
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita273, c = U.conto(p.s), passi = [];
      const HV = (b) => '0x' + b.slice().reverse().map(X.esa2).join('').replace(/^0+(?=.)/, '');
      const quadro = (o) => {
        const M = o.dopo ? c.dopo : U.ORIG, els = [el.nota('z1', 20, 0, 'BUFFER', 'mono'), el.nota('z2', 428, 0, 'SENTINELLA', 'mono', o.fase >= 2 ? 'att' : 'on'), el.nota('z3', 20, 108, 'RBP DEL CHIAMANTE', 'mono'), el.nota('z4', 428, 108, 'INDIRIZZO DI RITORNO', 'mono')];
        for (let b = 0; b < 32; b++) {
          const cambiato = o.dopo && c.scritti.includes(b), diverso = cambiato && M[b] !== U.ORIG[b];
          els.push(el.cella('y' + b, 20 + (b % 16) * 51, b < 16 ? 46 : 154, 47, 40, M[b] == null ? '·' : X.esa2(M[b]), M[b] == null ? 'off' : diverso && b >= 8 ? 'err' : cambiato ? (b < 8 ? 'on' : 'att') : b >= 8 && b < 16 && o.fase >= 2 ? 'att' : '', { piccola: true, cls: 'minuta', so: String(b) }));
        }
        const trov = M.slice(8, 16), rit = M.slice(24, 32);
        els.push(el.box('b1', 20, 216, 400, 60, 'sentinella attesa, tenuta al sicuro', HV(U.ORIG.slice(8, 16)), o.fase >= 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('b2', 440, 216, 400, 60, 'sentinella trovata nel frame', HV(trov), o.fase >= 2 ? (c.rilevata ? 'err' : 'att') : '', { cls: 'stretta' }),
          el.box('b3', 20, 290, 250, 66, 'confronto', o.fase >= 2 ? (c.rilevata ? 'diverse' : 'uguali') : '·', o.fase === 2 ? 'att' : o.fase > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('b4', 280, 290, 560, 66, 'che cosa accade', o.fase >= 3 ? (c.rilevata ? 'arresto del programma, prima di RET' : 'RET verso ' + HV(rit)) : '·', o.fase >= 3 ? (c.rilevata ? 'att' : c.ritAlterato ? 'err' : 'on') : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (o) => [['Sentinella', o.fase >= 2 ? (c.rilevata ? 'alterata' : 'intatta') : '·', 'a'], ['Ritorno', o.dopo ? (c.ritAlterato ? 'alterato' : 'intatto') : 'intatto'], ['Esito', o.fase >= 3 ? (c.rilevata ? 'arresto' : 'RET eseguita') : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o), els: quadro(o) }, extra));

      P({ fase: 0 }, 0, 'La sentinella al suo posto', 'Il prologo ha scritto la sentinella negli otto byte che seguono il buffer, agli spostamenti da 8 a 15. Il suo valore, scelto a caso all’avvio del programma, è 0x5A3C91E7D204A600. Una copia identica è conservata in una zona che la pila non può raggiungere.',
        { chiedi: { d: 'Una copia parte dal buffer e prosegue fino all’indirizzo di ritorno. Su quali altre celle deve passare?', o: ['Soltanto sul RBP salvato', 'Sulla sentinella e sul RBP salvato', 'Su nessun’altra cella'], g: 1, no: 'La copia avanza un byte dopo l’altro. Fra il buffer e l’indirizzo di ritorno stanno la sentinella e il RBP salvato.' } });
      P({ fase: 1, dopo: true }, 1, c.titolo, c.racconto, { calc: c.calc });
      P({ fase: 2, dopo: true }, 2, 'Il confronto', 'Il lavoro della funzione è finito. Prima di RET, l’epilogo rilegge gli otto byte della sentinella dal frame e li confronta con il valore atteso. ' + (c.rilevata ? 'I due valori sono diversi: ' + c.perche : 'I due valori sono uguali: ' + c.perche),
        { calc: HV(c.dopo.slice(8, 16)) + (c.rilevata ? ' ≠ ' : ' = ') + HV(U.ORIG.slice(8, 16)), chiedi: { d: 'Il confronto ha dato ' + (c.rilevata ? 'due valori diversi' : 'due valori uguali') + '. La funzione eseguirà RET?', o: ['Sì', 'No'], g: c.rilevata ? 1 : 0, no: c.rilevata ? 'Con una sentinella alterata l’epilogo chiama una funzione che arresta il programma. RET non viene raggiunta.' : 'Con una sentinella intatta l’epilogo prosegue normalmente fino a RET.' } });
      P({ fase: 3, dopo: true }, 3, c.rilevata ? 'Il programma si arresta' : c.ritAlterato ? 'RET verso un indirizzo alterato' : 'Un ritorno regolare', (c.rilevata ? 'La funzione non esegue RET. Chiama una funzione di servizio che scrive un messaggio di errore e termina il processo. ' + (c.ritAlterato ? 'L’indirizzo di ritorno alterato resta inutilizzato: la difesa ha funzionato.' : 'L’indirizzo di ritorno era ancora intatto, ma il programma viene fermato comunque: un byte fuori posto è già un difetto.')
        : c.ritAlterato ? 'Il controllo è superato, e RET viene eseguita. In cima alla pila trova ' + HV(c.dopo.slice(24, 32)) + ' al posto di 0x401234, e il processore prosegue da lì. La sentinella non ha visto nulla, perché nessuno dei suoi byte è cambiato.' : 'Il controllo è superato, e RET preleva l’indirizzo 0x401234, quello posato da CALL. Il programma riprende nel chiamante.'), { calc: c.rilevata ? 'arresto' : 'RIP = ' + HV(c.dopo.slice(24, 32)) });
      P({ fase: 4, dopo: true }, 4, 'Che cosa è stato verificato', 'Il controllo riguarda una proprietà precisa: i byte della sentinella, nel momento in cui vengono riletti. ' + c.morale + ' Altre difese coprono altri aspetti: la memoria non eseguibile impedisce di eseguire i byte copiati, e la disposizione casuale degli indirizzi rende difficile sapere dove saltare.', { calc: p.s === 'c8' ? 'nessuna alterazione' : c.rilevata ? 'scrittura rilevata' : 'scrittura sfuggita al controllo', esito: [c.esito, c.rilevata || !c.ritAlterato ? 'si' : 'no'] });
      return { passi, esito: c.esito };
    }
  },
  bilancio: {
    regola: [
      'La sentinella è un valore casuale posto fra le variabili locali e i dati di controllo. L’epilogo la ricontrolla prima di RET e arresta il programma se è cambiata.',
      'Il controllo riguarda soltanto i byte della sentinella. La memoria non eseguibile e la disposizione casuale degli indirizzi coprono altri aspetti. Nessuna difesa sostituisce il controllo dei limiti.'
    ],
    errori: [
      ['Credere che la sentinella protegga tutto il frame.', 'Sorveglia sé stessa. Le variabili locali poste prima di essa possono essere alterate senza che il controllo se ne accorga.'],
      ['Dedurre da una sentinella intatta che il ritorno sia corretto.', 'Una scrittura singola allo spostamento 24 altera l’indirizzo di ritorno e lascia la sentinella com’era.'],
      ['Considerare le difese un sostituto della correzione.', 'Le difese riducono le conseguenze di un errore. Il programma resta sbagliato finché scrive oltre i limiti.']
    ],
    saFare: ['Descrivo dove sta la sentinella e quando viene controllata.', 'Stabilisco se una scrittura viene rilevata dal controllo.', 'Cito un caso in cui la sentinella resta intatta e il frame è comunque alterato.'],
    esercizi: [
      { d: 'Nel frame di questa unità il buffer occupa gli spostamenti da 0 a 7 e la sentinella quelli da 8 a 15. Quanti byte al massimo può scrivere una copia, partendo dallo spostamento 0, senza alterare la sentinella?', segnaposto: 'Un numero', giuste: ['8', 'otto'],
        ok: 'Con 8 byte la copia scrive gli spostamenti da 0 a 7 e riempie il buffer. Il nono byte cadrebbe sullo spostamento 8, il primo della sentinella.',
        diagnosi: [
          { se: ['7'], msg: 'Con 7 byte resta ancora libero l’ultimo byte del buffer, allo spostamento 7. La copia può scriverne uno in più.' },
          { se: ['9'], msg: 'Il nono byte cade sullo spostamento 8, che appartiene alla sentinella.' },
          { se: ['15', '16'], msg: 'Gli spostamenti da 8 a 15 appartengono alla sentinella. La copia deve fermarsi prima.' }
        ],
        altro: 'Il numero è diverso. Conta i byte del buffer: gli spostamenti partono da zero.',
        indizi: ['Il buffer occupa gli spostamenti da 0 a 7.', 'Da 0 a 7 ci sono 8 spostamenti.', 'Una copia di 8 byte arriva allo spostamento 7.'],
        svolgimento: ['Buffer: spostamenti da 0 a 7, cioè 8 byte.', 'Una copia di 8 byte scrive esattamente quelli.', 'Dal nono byte in poi la sentinella viene alterata.'] },
      { d: 'Una funzione protetta da sentinella riceve una copia che supera il buffer di un solo byte, diverso da quello che c’era. Che cosa accade?', guida: 'Scegli la risposta.', o: [
        { t: 'Il controllo prima di RET rileva la differenza e arresta il programma', ok: true, fb: 'Il byte in eccesso cade sul primo byte della sentinella. Al controllo i due valori differiscono, e il programma viene fermato.' },
        { t: 'Nulla, perché un byte non basta a raggiungere l’indirizzo di ritorno', fb: 'L’indirizzo di ritorno è intatto, ma la sentinella è cambiata. Il controllo la confronta per intero, e basta un byte diverso.' },
        { t: 'La scrittura viene bloccata nel momento in cui avviene', fb: 'La scrittura riesce. La sentinella viene controllata dopo, nell’epilogo, prima di RET.' }] }
    ]
  }
});
/* Le cinque scritture dell'esperimento. Il frame: buffer 0–7, sentinella 8–15, RBP salvato 16–23, ritorno 24–31. */
SL.unita273 = (() => {
  const ORIG = [null, null, null, null, null, null, null, null, 0x00, 0xA6, 0x04, 0xD2, 0xE7, 0x91, 0x3C, 0x5A, 0x20, 0x90, 0, 0, 0, 0, 0, 0, 0x34, 0x12, 0x40, 0, 0, 0, 0, 0];
  const DESCR = { c8: 'una copia di 8 byte a partire dallo spostamento 0', c9: 'una copia di 9 byte a partire dallo spostamento 0', c28: 'una copia di 28 byte a partire dallo spostamento 0', idx: 'la scrittura di un solo byte allo spostamento 24', nota: 'una copia di 28 byte a partire dallo spostamento 0, che agli spostamenti da 8 a 15 riscrive il valore esatto della sentinella' };
  const conto = (s) => {
    const dopo = ORIG.slice(), scritti = [];
    const scrivi = (b, v) => { dopo[b] = v; scritti.push(b); };
    if (s === 'idx') scrivi(24, 0x88);
    else { const n = s === 'c8' ? 8 : s === 'c9' ? 9 : 28; for (let b = 0; b < n; b++) scrivi(b, s === 'nota' && b >= 8 && b < 16 ? ORIG[b] : 0x41); }
    const rilevata = ORIG.slice(8, 16).some((v, k) => dopo[8 + k] !== v), ritAlterato = ORIG.slice(24, 32).some((v, k) => dopo[24 + k] !== v);
    const T = {
      c8: ['Una copia nei limiti', 'La copia scrive 8 byte e riempie il buffer esattamente. Nessuna cella esterna viene toccata.', '8 byte, tutti nel buffer', 'nessuna scrittura li ha toccati.', 'In questo caso la copia è rimasta nei limiti, e nulla andava rilevato.'],
      c9: ['Un byte di troppo', 'La copia scrive 9 byte. Il nono cade sullo spostamento 8, il primo byte della sentinella, che valeva 00 e ora vale 41.', '9 byte, 1 fuori dal buffer', 'il primo byte della sentinella è cambiato.', 'Un solo byte fuori posto è bastato a far scattare il controllo, molto prima che l’indirizzo di ritorno fosse in pericolo.'],
      c28: ['Una copia fino al ritorno', 'La copia scrive 28 byte, tutti uguali a 0x41. Attraversa la sentinella e il RBP salvato, e sostituisce i primi quattro byte dell’indirizzo di ritorno.', '28 byte, 20 fuori dal buffer', 'tutti i byte della sentinella sono stati sostituiti da 0x41.', 'Per arrivare all’indirizzo di ritorno la copia è dovuta passare sulla sentinella, e il controllo l’ha fermata.'],
      idx: ['Una scrittura mirata', 'Il programma scrive un solo byte, 0x88, allo spostamento 24: è l’effetto di un indice che supera i limiti di un array. Il byte cade sull’indirizzo di ritorno, e la sentinella non viene toccata.', '1 byte, allo spostamento 24', 'la scrittura è caduta più avanti e non li ha toccati.', 'La scrittura ha scavalcato la sentinella. La difesa presuppone un percorso continuo dal buffer in avanti, e qui il percorso mancava.'],
      nota: ['Una copia che conosce la sentinella', 'La copia scrive 28 byte. Agli spostamenti da 8 a 15 riscrive però gli stessi otto byte della sentinella, che chi ha preparato i dati era riuscito a conoscere. RBP salvato e indirizzo di ritorno vengono sostituiti.', '28 byte, con la sentinella riscritta uguale', 'sono stati sovrascritti con valori identici.', 'La sentinella protegge finché il suo valore resta segreto. Un difetto che permette di leggerla dalla memoria la rende inutile.']
    }[s];
    return { dopo, scritti, rilevata, ritAlterato, titolo: T[0], racconto: T[1], calc: T[2], perche: T[3], morale: T[4], esito: rilevata ? 'Il controllo fallisce, e il programma viene arrestato' : 'Il controllo passa, e RET viene eseguita' };
  };
  return { ORIG, DESCR, conto };
})();
