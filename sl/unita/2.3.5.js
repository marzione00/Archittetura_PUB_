'use strict';
SL.registra('2.3.5', {
  titolo: 'Validità degli oggetti e aliasing',
  obiettivo: 'Obiettivo: prevedere l’effetto di una scrittura eseguita attraverso un puntatore su una lettura eseguita attraverso un altro, e riconoscere un accesso esterno ai limiti di un array.',
  concetti: [['puntatore', 'Puntatori'], ['memory', 'Due nomi, una cella'], ['scudo', 'I limiti dell’array']],
  filigrana: ['puntatore', 'memory', 'scudo'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 2.3.2', t: 'Indirizzo di un elemento', d: 'Base più indice per dimensione. Con interi da 4 byte, l’elemento 2 comincia 8 byte dopo la base.' },
      { sim: 'bilancio', da: 'Dall’unità 2.2.7', t: 'CMP e JB', d: 'CMP sottrae senza conservare la differenza e scrive i flag. JB salta quando CF vale 1, cioè quando il primo operando è inferiore.' },
      { sim: 'memory', da: 'Dall’unità 2.1.2', t: 'Le parentesi quadre', d: 'Un nome fra parentesi quadre indica la memoria situata all’indirizzo contenuto nel registro.' }
    ],
    domanda: { d: 'Prima di proseguire: un array di quattro interi da 4 byte comincia a 0x5000. Qual è il primo indirizzo dopo la fine dell’array?', o: [
      { t: '0x5010', ok: true, fb: 'Quattro elementi da 4 byte occupano 16 byte, da 0x5000 a 0x500F. Il primo indirizzo successivo è 0x5010.' },
      { t: '0x500C', fb: 'All’indirizzo indicato comincia l’ultimo elemento, quello di indice 3. L’array termina quattro byte più avanti.' },
      { t: '0x5004', fb: 'Il valore indicato è l’indirizzo dell’elemento di indice 1. Gli elementi sono quattro.' }
    ] }
  },
  idea: {
    titolo: 'Un indirizzo con un nome',
    termini: ['puntatore', 'aliasing', 'puntatore di fine', 'comportamento indefinito', 'jae'],
    testo: [
      'Nelle unità precedenti gli indirizzi sono stati numeri contenuti in un registro. Il linguaggio C attribuisce loro un nome: un valore che contiene l’indirizzo di un dato prende il nome di [[puntatore]]. Se p è un puntatore a un intero, la scrittura `*p` indica l’intero situato a tale indirizzo. In assembly il puntatore è contenuto in un registro, e `*p` diventa il registro fra parentesi quadre.',
      'Due puntatori diversi possono contenere il medesimo indirizzo. I nomi sono due, la cella è una sola: ciò che è scritto attraverso il primo è letto attraverso il secondo. Tale situazione prende il nome di [[aliasing]].',
      { fig: 'scena', w: 720, h: 236, titolo: 'Due puntatori sulla medesima cella', nota: 'La scrittura `*q = 99` modifica l’elemento 2. Una lettura di `*p` trova 99.', els: [
        SL.el.box('p', 240, 0, 104, 54, 'p', '0x5008', 'att', { cls: 'stretta' }), SL.el.box('q', 240, 176, 104, 54, 'q', '0x5008', 'on', { cls: 'stretta' }),
        SL.el.cella('c0', 20, 90, 104, 50, '10', '', { gi: '0x5000' }), SL.el.cella('c1', 130, 90, 104, 50, '20', '', { gi: '0x5004' }), SL.el.cella('c2', 240, 90, 104, 50, '99', 'att', { gi: '0x5008' }), SL.el.cella('c3', 350, 90, 104, 50, '40', '', { gi: '0x500C' }),
        SL.el.linea('lp', 250, 54, 250, 90, 'att'), SL.el.linea('lq', 334, 140, 334, 176, 'on'),
        SL.el.nota('n1', 480, 16, 'p indica l’elemento 2', 'mono'), SL.el.nota('n2', 480, 192, 'q indica l’elemento 2', 'mono')] },
      'L’aliasing spiega una scelta ricorrente nel codice prodotto dai compilatori. Dopo una scrittura in memoria attraverso un puntatore, un valore letto in precedenza attraverso un altro puntatore potrebbe essere cambiato. Se al compilatore è ignota la destinazione dei due puntatori, la memoria va riletta.',
      'Un puntatore è un dato come gli altri e può trovarsi a sua volta in memoria. In tal caso il dato finale si raggiunge con due accessi: `mov rax, [rdi]` carica il puntatore, `mov eax, [rax]` lo impiega.',
      'Un puntatore è valido finché indica un oggetto esistente, per esempio un elemento di un array. L’indirizzo che segue immediatamente l’ultimo elemento prende il nome di [[puntatore di fine]] dell’array. Il suo calcolo e il confronto con altri puntatori sono leciti, e consentono di riconoscere il termine di un percorso. La lettura o la scrittura attraverso di esso costituisce un errore.',
      'Il processore esegue anche l’accesso errato, senza alcuna segnalazione. Per il processore gli indirizzi sono equivalenti, e il dato è scritto su ciò che si trova in tale posizione. Il C denomina tale situazione [[comportamento indefinito]]: il programma è scorretto, e nulla garantisce l’esito dell’esecuzione. Il controllo dei limiti spetta al programma.',
      'Il controllo si scrive con CMP e un salto condizionale. Accanto a JB, che salta se il primo operando è inferiore, esiste [[jae|JAE]], che salta se è superiore o uguale. Esso esamina il medesimo flag, CF, e salta quando vale 0.'
    ]
  },
  esperimento: {
    faremo: [
      'Un array di quattro interi comincia a 0x5000 e contiene 10, 20, 30 e 40. Una funzione riceve due puntatori, p in RDI e q in RSI, e il puntatore di fine in RDX. Se q è interno all’array vi scrive 99, poi legge attraverso p. I controlli fissano l’elemento indicato da ciascun puntatore.',
      'Le cinque istruzioni sono seguite una alla volta. Dopo il caso proposto, è istruttivo spostare q sull’elemento successivo e infine sulla posizione 4, che è il puntatore di fine.'
    ],
    vedrai: [
      ['memory', 'L’array', 'A sinistra: i quattro elementi con i rispettivi indirizzi, e la cella successiva alla fine.'],
      ['puntatore', 'I puntatori', 'Sopra e sotto l’array: p, q e il puntatore di fine, ciascuno collegato alla cella che indica.'],
      ['operation', 'Il listato', 'A destra: le cinque istruzioni della funzione.']
    ]
  },
  lab: {
    titolo: 'Scrivere attraverso q, leggere attraverso p',
    scena: { w: 860, h: 366 },
    atti: ['Due puntatori', 'Il controllo dei limiti', 'La scrittura', 'La lettura', 'Il ritorno'],
    controlli: [
      { id: 'p', tipo: 'num', eti: 'Elemento indicato da p', min: 0, max: 3, salti: [1], valore: 2 },
      { id: 'q', tipo: 'num', eti: 'Posizione indicata da q', min: 0, max: 4, salti: [1], valore: 2 }
    ],
    nota: 'Il numero di passi dipende dai dati: con q sul puntatore di fine la scrittura è omessa.',
    previsione: {
      domanda: (p) => 'L’array contiene 10, 20, 30 e 40. Il puntatore p indica l’elemento ' + p.p + ' e q ' + (p.q === 4 ? 'coincide con il puntatore di fine' : 'indica l’elemento ' + p.q) + '. La funzione scrive 99 attraverso q, se q è interno all’array, e poi legge attraverso p. Quale valore restituisce?',
      opzioni: (p) => Array.from(new Set([10 * (p.p + 1), 99, p.q < 4 ? 10 * (p.q + 1) : 10 * (p.p + 1)])).sort((a, b) => a - b).map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava il valore ' + pred + '. La funzione restituisce ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.'
      : p.q === 4 ? 'Il puntatore q coincide con la fine dell’array, il controllo omette la scrittura e l’elemento ' + p.p + ' resta invariato.' : p.p === p.q ? 'I due puntatori contengono il medesimo indirizzo: la scrittura eseguita attraverso q modifica la cella letta da p.' : 'I due puntatori indicano celle diverse: la scrittura modifica l’elemento ' + p.q + ', e p legge l’elemento ' + p.p + ', rimasto invariato.'),
    costruisci(p) {
      const el = SL.el, X = SL.x86, passi = [], HA = (a) => '0x' + a.toString(16).toUpperCase();
      const AP = 0x5000 + 4 * p.p, AQ = 0x5000 + 4 * p.q, dentro = p.q < 4, stessa = p.p === p.q, ARR = [10, 20, 30, 40];
      const eax = dentro && stessa ? 99 : ARR[p.p];
      const LIS = [['0x401000', 'cmp rsi, rdx'], ['0x401003', 'jae 0x40100B'], ['0x401005', 'mov dword ptr [rsi], 99'], ['0x40100B', 'mov eax, [rdi]'], ['0x40100D', 'ret']];
      const st = { arr: ARR.slice(), cf: null, eax: null };
      const CX = (k) => 20 + k * 110;
      const quadro = (o) => {
        const els = [];
        for (let k = 0; k < 5; k++) els.push(el.cella('a' + k, CX(k), 120, 104, 50, k < 4 ? String(st.arr[k]) : '?', k === 4 ? (o.fuori ? 'err' : 'off') : o.scritta === k ? 'att' : o.letta === k ? 'att' : '', { gi: HA(0x5000 + 4 * k), so: k < 4 ? 'indice ' + k : 'dopo la fine' }));
        els.push(el.box('pp', CX(p.p), 0, 104, 56, 'p, in RDI', HA(AP), o.letta != null ? 'att' : 'on', { cls: 'stretta' }), el.linea('lp', CX(p.p) + 8, 56, CX(p.p) + 8, 120, o.letta != null ? 'att' : 'on'));
        els.push(el.box('pq', CX(p.q), 226, 104, 56, 'q, in RSI', HA(AQ), o.scritta != null || o.cmp ? 'att' : 'on', { cls: 'stretta' }), el.linea('lq', CX(p.q) + 96, 170, CX(p.q) + 96, 226, o.scritta != null || o.cmp ? 'att' : 'on'));
        els.push(el.box('pf', CX(4), 0, 104, 56, 'fine, RDX', '0x5010', o.cmp ? 'att' : '', { cls: 'stretta' }), el.linea('lf', CX(4) + 8, 56, CX(4) + 8, 120, o.cmp ? 'att' : ''));
        X.listato('li', LIS, o.riga, { x: 590, y: 0, w: 250, passo: 54 }).forEach((e, k) => { if (o.saltata && k === 2) e.st = 'off'; els.push(e); });
        els.push(el.box('cf', 20, 300, 170, 58, 'CF dopo CMP', st.cf == null ? '·' : String(st.cf), o.cmp ? 'att' : '', { cls: 'stretta' }),
          el.box('al', 202, 300, 220, 58, 'p e q', stessa ? 'la medesima cella' : 'celle diverse', o.alias ? 'att' : '', { cls: 'stretta' }),
          el.box('ea', 434, 300, 136, 58, 'EAX', st.eax == null ? '·' : String(st.eax), o.letta != null ? 'att' : st.eax != null ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['p', HA(AP), 'a'], ['q', HA(AQ)], ['EAX', st.eax == null ? '·' : String(st.eax), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ alias: true }, 0, stessa ? 'Due nomi per una cella' : 'Due puntatori', 'L’array occupa sedici byte, da 0x5000 a 0x500F. RDI contiene p = ' + HA(AP) + ', l’indirizzo dell’elemento ' + p.p + '. RSI contiene q = ' + HA(AQ) + (dentro ? ', l’indirizzo dell’elemento ' + p.q + '. ' : ', il primo indirizzo dopo la fine dell’array: il medesimo valore di RDX. ') + (stessa ? 'I due registri contengono il medesimo numero, e p e q indicano quindi la medesima cella.' : dentro ? 'I due registri contengono numeri diversi, e p e q indicano quindi celle diverse.' : 'In tale posizione l’array è già terminato, e la cella appartiene a un altro oggetto.'),
        { chiedi: { d: 'La prima istruzione è `cmp rsi, rdx`, che confronta q = ' + HA(AQ) + ' con il puntatore di fine, 0x5010. Quanto varrà CF?', o: ['0', '1'], g: dentro ? 1 : 0, no: dentro ? 'q è inferiore al puntatore di fine: la sottrazione richiede un prestito, e CF vale 1.' : 'q è uguale al puntatore di fine: la sottrazione dà zero senza prestito, e CF vale 0.' } });
      st.cf = dentro ? 1 : 0;
      P({ riga: 0, cmp: true }, 1, 'Il confronto con la fine', 'CMP sottrae RDX da RSI e conserva soltanto i flag. ' + (dentro ? 'Il puntatore q, ' + HA(AQ) + ', è inferiore al puntatore di fine, 0x5010: la sottrazione richiede un prestito e CF vale 1. Ne segue che q è interno all’array.' : 'Il puntatore q è uguale al puntatore di fine, 0x5010: la differenza è zero, nessun prestito è richiesto e CF vale 0. Ne segue che q è esterno all’array.'), { calc: HA(AQ) + ' − 0x5010 · CF = ' + st.cf });
      P({ riga: 1 }, 1, dentro ? 'Il salto non avviene' : 'Il salto avviene', 'JAE salta quando CF vale 0, cioè quando il primo operando del confronto era superiore o uguale al secondo. ' + (dentro ? 'In questo caso CF vale 1, il salto è escluso e l’esecuzione prosegue con la scrittura.' : 'In questo caso CF vale 0, e il salto conduce a 0x40100B, oltre la scrittura.'),
        dentro ? { chiedi: { d: 'La prossima istruzione scrive 99 attraverso q. Subito dopo, `mov eax, [rdi]` leggerà attraverso p. Quale valore troverà?', o: [String(ARR[p.p]), '99'], g: stessa ? 1 : 0, no: stessa ? 'p e q contengono il medesimo indirizzo. La lettura trova il valore appena scritto.' : 'La scrittura modifica l’elemento ' + p.q + '. p indica l’elemento ' + p.p + ', che resta invariato.' } } : {});
      if (dentro) {
        st.arr[p.q] = 99;
        P({ riga: 2, scritta: p.q }, 2, 'La scrittura attraverso q', 'L’istruzione scrive il numero 99 nei quattro byte che cominciano all’indirizzo contenuto in RSI. L’elemento ' + p.q + ' passa da ' + ARR[p.q] + ' a 99. La parola chiave `dword ptr` è necessaria: né l’immediato né l’indirizzo indicano il numero di byte da scrivere.', { calc: '[' + HA(AQ) + '] = 99' });
      } else {
        P({ riga: 1, saltata: true, fuori: true }, 2, 'La scrittura omessa', 'L’istruzione di scrittura è stata omessa. Senza il controllo, il numero 99 sarebbe stato scritto all’indirizzo 0x5010, in una cella che appartiene a un altro oggetto. Il processore avrebbe eseguito la scrittura senza alcuna segnalazione.', { calc: 'nessuna scrittura' });
      }
      st.eax = eax;
      P({ riga: 3, letta: p.p, saltata: !dentro, alias: true }, 3, 'La lettura attraverso p', 'L’istruzione copia in EAX i quattro byte che cominciano all’indirizzo contenuto in RDI, cioè l’elemento ' + p.p + '. ' + (!dentro ? 'Nessuna scrittura è avvenuta, e il valore è quello iniziale: ' + eax + '.' : stessa ? 'La lettura trova 99: la scrittura eseguita attraverso q è visibile attraverso p, poiché la cella è una sola.' : 'La lettura trova ' + eax + ', il valore iniziale: la scrittura ha modificato un’altra cella.'), { calc: 'EAX = [' + HA(AP) + '] = ' + eax });
      P({ riga: 4, saltata: !dentro }, 4, 'Il ritorno', 'La funzione restituisce ' + eax + '. Al compilatore che l’ha tradotta era ignoto se p e q avrebbero indicato la medesima cella. Per questa ragione la lettura attraverso p segue la scrittura e accede alla memoria: un valore letto in precedenza, e conservato in un registro, sarebbe potuto risultare superato.', { calc: 'EAX = ' + eax, esito: ['EAX = ' + eax, 'si'] });
      return { passi, esito: eax };
    }
  },
  bilancio: {
    regola: [
      'Un puntatore è un valore che contiene un indirizzo. Due puntatori con il medesimo indirizzo indicano la medesima cella: ciò che l’uno scrive, l’altro lo legge.',
      'Il puntatore di fine può essere calcolato e confrontato, e mai impiegato per un accesso. Il processore esegue qualunque accesso: il controllo dei limiti spetta al programma.'
    ],
    errori: [
      ['Ritenere che nomi diversi indichino celle diverse.', 'È determinante l’indirizzo contenuto nel puntatore. Se p e q valgono entrambi 0x5008, la cella è una sola.'],
      ['Accedere attraverso il puntatore di fine.', 'L’indirizzo 0x5010 è esterno a un array di sedici byte che comincia a 0x5000. È impiegato soltanto come termine di confronto.'],
      ['Attendersi che il processore impedisca una scrittura esterna ai limiti.', 'Per il processore gli indirizzi sono equivalenti. Il dato è scritto, e altera ciò che si trova in tale posizione.']
    ],
    saFare: ['Stabilire se due puntatori indicano la medesima cella mediante il confronto degli indirizzi.', 'Prevedere il valore letto da un puntatore dopo una scrittura eseguita attraverso un altro.', 'Calcolare il puntatore di fine di un array e riconoscere un accesso esterno ai limiti.'],
    esercizi: [
      { d: 'Un array di sei interi da 4 byte comincia all’indirizzo 0x7000. Quanto vale il suo puntatore di fine? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x7008', giuste: ['0x7018', '7018', '7018h'],
        ok: 'Sei elementi da 4 byte occupano 24 byte, che in esadecimale si scrive 18. Il primo indirizzo dopo l’array è 0x7018.',
        diagnosi: [
          { se: ['0x7024', '7024'], msg: 'La dimensione, 24 byte, è corretta. Prima della somma con la base va scritta in esadecimale: 24 = 16 + 8.' },
          { se: ['0x7014', '7014'], msg: 'All’indirizzo indicato comincia l’ultimo elemento, quello di indice 5. Il puntatore di fine si trova quattro byte più avanti.' },
          { se: ['0x7006', '7006'], msg: 'In tal modo gli elementi sono contati come byte. Ciascuno ne occupa 4.' },
          { se: ['0x7017', '7017'], msg: 'Il valore indicato è l’ultimo byte dell’array. Il puntatore di fine è il primo indirizzo successivo.' }
        ],
        altro: 'Il valore è diverso. Si calcoli il numero di byte occupati dall’array e lo si sommi alla base.',
        indizi: ['Il puntatore di fine è base + numero di elementi × dimensione.', '6 × 4 = 24 byte.', '24 in esadecimale si scrive 18.'],
        svolgimento: ['Dimensione dell’array: 6 × 4 = 24 byte.', '24 = 16 + 8, cioè 0x18.', 'Puntatore di fine: 0x7000 + 0x18 = 0x7018.'] },
      { d: 'RDI contiene 0x6000. Gli otto byte all’indirizzo 0x6000 contengono il numero 0x6100, e i quattro byte all’indirizzo 0x6100 contengono 7. Quanto vale EAX dopo `mov rax, [rdi]` seguita da `mov eax, [rax]`?', guida: 'Si scelga la risposta.', o: [
        { t: '7', ok: true, fb: 'Il primo accesso carica in RAX il puntatore 0x6100. Il secondo lo impiega come indirizzo e trova 7.' },
        { t: '0x6100', fb: 'Il valore indicato è il contenuto di RAX dopo la prima istruzione. La seconda lo impiega come indirizzo e legge la cella indicata.' },
        { t: '0x6000', fb: 'Il valore indicato è il contenuto di RDI, che resta invariato. Le due istruzioni leggono dalla memoria.' }] }
    ],
    sfida: ['cslez2_3_04_random_assembly_04', 'Scambi e aggiornamenti di elementi']
  }
});
