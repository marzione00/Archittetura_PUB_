'use strict';
SL.registra('2.3.5', {
  titolo: 'Validità degli oggetti e aliasing',
  obiettivo: 'Alla fine saprai prevedere l’effetto di una scrittura fatta attraverso un puntatore su una lettura fatta attraverso un altro, e riconoscere un accesso che esce dai limiti di un array.',
  concetti: [['puntatore', 'Puntatori'], ['memory', 'Due nomi, una cella'], ['scudo', 'I limiti dell’array']],
  filigrana: ['puntatore', 'memory', 'scudo'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 2.3.2', t: 'Indirizzo di un elemento', d: 'Base più indice per dimensione. Con interi da 4 byte, l’elemento 2 comincia 8 byte dopo la base.' },
      { sim: 'bilancio', da: 'Dall’unità 2.2.7', t: 'CMP e JB', d: 'CMP sottrae senza conservare la differenza e scrive i flag. JB salta quando CF vale 1, cioè quando il primo operando è inferiore.' },
      { sim: 'memory', da: 'Dall’unità 2.1.2', t: 'Le parentesi quadre', d: 'Un nome fra parentesi quadre indica la memoria che si trova all’indirizzo contenuto in quel registro.' }
    ],
    domanda: { d: 'Prima di proseguire: un array di quattro interi da 4 byte comincia a 0x5000. Qual è il primo indirizzo dopo la fine dell’array?', o: [
      { t: '0x5010', ok: true, fb: 'Quattro elementi da 4 byte occupano 16 byte, da 0x5000 a 0x500F. Il primo indirizzo successivo è 0x5010.' },
      { t: '0x500C', fb: 'A questo indirizzo comincia l’ultimo elemento, quello di indice 3. L’array finisce quattro byte più avanti.' },
      { t: '0x5004', fb: 'Questo è l’indirizzo dell’elemento di indice 1. Gli elementi sono quattro.' }
    ] }
  },
  idea: {
    titolo: 'Un indirizzo con un nome',
    termini: ['puntatore', 'aliasing', 'puntatore di fine', 'comportamento indefinito', 'jae'],
    testo: [
      'Finora gli indirizzi sono stati numeri in un registro. Il linguaggio C dà loro un nome: un valore che contiene l’indirizzo di un dato è un [[puntatore]]. Se p è un puntatore a un intero, la scrittura `*p` indica l’intero che si trova a quell’indirizzo. In assembly il puntatore sta in un registro, e `*p` diventa il registro fra parentesi quadre.',
      'Due puntatori diversi possono contenere lo stesso indirizzo. I nomi sono due, la cella è una sola: ciò che si scrive attraverso il primo si ritrova leggendo attraverso il secondo. Questa situazione si chiama [[aliasing]].',
      { fig: 'scena', w: 720, h: 236, titolo: 'Due puntatori sulla stessa cella', nota: 'La scrittura `*q = 99` cambia l’elemento 2. Una lettura di `*p` trova 99.', els: [
        SL.el.box('p', 240, 0, 104, 54, 'p', '0x5008', 'att', { cls: 'stretta' }), SL.el.box('q', 240, 176, 104, 54, 'q', '0x5008', 'on', { cls: 'stretta' }),
        SL.el.cella('c0', 20, 90, 104, 50, '10', '', { gi: '0x5000' }), SL.el.cella('c1', 130, 90, 104, 50, '20', '', { gi: '0x5004' }), SL.el.cella('c2', 240, 90, 104, 50, '99', 'att', { gi: '0x5008' }), SL.el.cella('c3', 350, 90, 104, 50, '40', '', { gi: '0x500C' }),
        SL.el.linea('lp', 250, 54, 250, 90, 'att'), SL.el.linea('lq', 334, 140, 334, 176, 'on'),
        SL.el.nota('n1', 480, 16, 'p indica l’elemento 2', 'mono'), SL.el.nota('n2', 480, 192, 'q indica l’elemento 2', 'mono')] },
      'L’aliasing spiega una scelta ricorrente nel codice prodotto dai compilatori. Dopo una scrittura in memoria attraverso un puntatore, un valore letto in precedenza attraverso un altro puntatore potrebbe essere cambiato. Se il compilatore ignora dove puntano i due, deve rileggere la memoria.',
      'Un puntatore è un dato come gli altri e può stare a sua volta in memoria. In quel caso per raggiungere il dato finale servono due accessi: `mov rax, [rdi]` carica il puntatore, `mov eax, [rax]` lo usa.',
      'Un puntatore è valido finché indica un oggetto che esiste, per esempio un elemento di un array. L’indirizzo che segue immediatamente l’ultimo elemento è il [[puntatore di fine]] dell’array. Calcolarlo e confrontarlo con altri puntatori è lecito, e serve a riconoscere la fine di un percorso. Leggere o scrivere attraverso di esso è un errore.',
      'Il processore esegue anche l’accesso sbagliato, senza protestare. Per lui un indirizzo vale l’altro, e il dato finisce su ciò che si trova lì accanto. Il C chiama questa situazione [[comportamento indefinito]]: il programma è scorretto, e nessuno garantisce che cosa accadrà. Il controllo dei limiti spetta al programma.',
      'Il controllo si scrive con CMP e un salto condizionale. Accanto a JB, che salta se il primo operando è inferiore, esiste [[jae|JAE]], che salta se è superiore o uguale. Guarda lo stesso flag, CF, e salta quando vale 0.'
    ]
  },
  esperimento: {
    faremo: [
      'Un array di quattro interi comincia a 0x5000 e contiene 10, 20, 30 e 40. Una funzione riceve due puntatori, p in RDI e q in RSI, e il puntatore di fine in RDX. Se q sta dentro l’array vi scrive 99, poi legge attraverso p. Sceglierai l’elemento indicato da ciascun puntatore.',
      'Seguiremo le cinque istruzioni una alla volta. Dopo il caso proposto, sposta q sull’elemento successivo. Infine portalo sulla posizione 4, che è il puntatore di fine.'
    ],
    vedrai: [
      ['memory', 'L’array', 'A sinistra: i quattro elementi con i loro indirizzi, e la cella che viene dopo la fine.'],
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
    nota: 'Il numero di passi dipende dai dati: con q sul puntatore di fine la scrittura viene saltata.',
    previsione: {
      domanda: (p) => 'L’array contiene 10, 20, 30 e 40. Il puntatore p indica l’elemento ' + p.p + ' e q ' + (p.q === 4 ? 'coincide con il puntatore di fine' : 'indica l’elemento ' + p.q) + '. La funzione scrive 99 attraverso q, se q sta dentro l’array, e poi legge attraverso p. Quale valore restituisce?',
      opzioni: (p) => Array.from(new Set([10 * (p.p + 1), 99, p.q < 4 ? 10 * (p.q + 1) : 10 * (p.p + 1)])).sort((a, b) => a - b).map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'Avevi previsto il valore ' + pred + '. La funzione restituisce ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.'
      : p.q === 4 ? 'Il puntatore q coincide con la fine dell’array, il controllo salta la scrittura e l’elemento ' + p.p + ' resta com’era.' : p.p === p.q ? 'I due puntatori contengono lo stesso indirizzo: la scrittura fatta attraverso q cambia proprio la cella che p legge.' : 'I due puntatori indicano celle diverse: la scrittura cambia l’elemento ' + p.q + ', e p legge l’elemento ' + p.p + ', rimasto intatto.'),
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
          el.box('al', 202, 300, 220, 58, 'p e q', stessa ? 'la stessa cella' : 'celle diverse', o.alias ? 'att' : '', { cls: 'stretta' }),
          el.box('ea', 434, 300, 136, 58, 'EAX', st.eax == null ? '·' : String(st.eax), o.letta != null ? 'att' : st.eax != null ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['p', HA(AP), 'a'], ['q', HA(AQ)], ['EAX', st.eax == null ? '·' : String(st.eax), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ alias: true }, 0, stessa ? 'Due nomi per una cella' : 'Due puntatori', 'L’array occupa sedici byte, da 0x5000 a 0x500F. RDI contiene p = ' + HA(AP) + ', l’indirizzo dell’elemento ' + p.p + '. RSI contiene q = ' + HA(AQ) + (dentro ? ', l’indirizzo dell’elemento ' + p.q + '. ' : ', il primo indirizzo dopo la fine dell’array: lo stesso valore di RDX. ') + (stessa ? 'I due registri contengono lo stesso numero, quindi p e q indicano la stessa cella.' : dentro ? 'I due registri contengono numeri diversi, quindi p e q indicano celle diverse.' : 'In quella posizione l’array è già finito, e la cella appartiene ad altro.'),
        { chiedi: { d: 'La prima istruzione è `cmp rsi, rdx`, che confronta q = ' + HA(AQ) + ' con il puntatore di fine, 0x5010. Quanto varrà CF?', o: ['0', '1'], g: dentro ? 1 : 0, no: dentro ? 'q è inferiore al puntatore di fine: la sottrazione chiede un prestito, e CF vale 1.' : 'q è uguale al puntatore di fine: la sottrazione dà zero senza prestito, e CF vale 0.' } });
      st.cf = dentro ? 1 : 0;
      P({ riga: 0, cmp: true }, 1, 'Il confronto con la fine', 'CMP sottrae RDX da RSI e conserva soltanto i flag. ' + (dentro ? 'Il puntatore q, ' + HA(AQ) + ', è inferiore al puntatore di fine, 0x5010: la sottrazione chiede un prestito e CF vale 1. Significa che q sta dentro l’array.' : 'Il puntatore q è uguale al puntatore di fine, 0x5010: la differenza è zero, nessun prestito è richiesto e CF vale 0. Significa che q è uscito dall’array.'), { calc: HA(AQ) + ' − 0x5010 · CF = ' + st.cf });
      P({ riga: 1 }, 1, dentro ? 'Il salto resta fermo' : 'Il salto parte', 'JAE salta quando CF vale 0, cioè quando il primo operando del confronto era superiore o uguale al secondo. ' + (dentro ? 'Qui CF vale 1, il salto resta fermo e l’esecuzione prosegue con la scrittura.' : 'Qui CF vale 0, e il salto porta a 0x40100B, scavalcando la scrittura.'),
        dentro ? { chiedi: { d: 'La prossima istruzione scrive 99 attraverso q. Subito dopo, `mov eax, [rdi]` leggerà attraverso p. Quale valore troverà?', o: [String(ARR[p.p]), '99'], g: stessa ? 1 : 0, no: stessa ? 'p e q contengono lo stesso indirizzo. La lettura trova ciò che la scrittura ha appena lasciato.' : 'La scrittura cambia l’elemento ' + p.q + '. p indica l’elemento ' + p.p + ', che resta com’era.' } } : {});
      if (dentro) {
        st.arr[p.q] = 99;
        P({ riga: 2, scritta: p.q }, 2, 'La scrittura attraverso q', 'L’istruzione scrive il numero 99 nei quattro byte che cominciano all’indirizzo contenuto in RSI. L’elemento ' + p.q + ' passa da ' + ARR[p.q] + ' a 99. La parola chiave `dword ptr` è necessaria: né l’immediato né l’indirizzo dicono quanti byte scrivere.', { calc: '[' + HA(AQ) + '] = 99' });
      } else {
        P({ riga: 1, saltata: true, fuori: true }, 2, 'La scrittura saltata', 'L’istruzione di scrittura è stata scavalcata. Senza il controllo, il numero 99 sarebbe finito all’indirizzo 0x5010, in una cella che appartiene a qualcos’altro. Il processore avrebbe eseguito la scrittura senza alcun avviso.', { calc: 'nessuna scrittura' });
      }
      st.eax = eax;
      P({ riga: 3, letta: p.p, saltata: !dentro, alias: true }, 3, 'La lettura attraverso p', 'L’istruzione copia in EAX i quattro byte che cominciano all’indirizzo contenuto in RDI, cioè l’elemento ' + p.p + '. ' + (!dentro ? 'Nessuna scrittura è avvenuta, e il valore è quello di partenza: ' + eax + '.' : stessa ? 'Trova 99: la scrittura fatta attraverso q si vede attraverso p, perché la cella è una sola.' : 'Trova ' + eax + ', il valore di partenza: la scrittura ha colpito un’altra cella.'), { calc: 'EAX = [' + HA(AP) + '] = ' + eax });
      P({ riga: 4, saltata: !dentro }, 4, 'Il ritorno', 'La funzione restituisce ' + eax + '. Il compilatore che l’ha tradotta ignorava se p e q avrebbero indicato la stessa cella. Per questo la lettura attraverso p viene dopo la scrittura e passa dalla memoria: un valore letto prima, e tenuto in un registro, sarebbe potuto risultare superato.', { calc: 'EAX = ' + eax, esito: ['EAX = ' + eax, 'si'] });
      return { passi, esito: eax };
    }
  },
  bilancio: {
    regola: [
      'Un puntatore è un valore che contiene un indirizzo. Due puntatori con lo stesso indirizzo indicano la stessa cella: ciò che l’uno scrive, l’altro lo legge.',
      'Il puntatore di fine si può calcolare e confrontare, mai usare per un accesso. Il processore esegue qualunque accesso: il controllo dei limiti spetta al programma.'
    ],
    errori: [
      ['Credere che nomi diversi indichino celle diverse.', 'Conta l’indirizzo contenuto nel puntatore. Se p e q valgono entrambi 0x5008, la cella è una sola.'],
      ['Accedere attraverso il puntatore di fine.', 'L’indirizzo 0x5010 sta fuori da un array di sedici byte che comincia a 0x5000. Serve soltanto come termine di confronto.'],
      ['Aspettarsi che il processore fermi una scrittura fuori dai limiti.', 'Per il processore un indirizzo vale l’altro. Il dato viene scritto, e rovina ciò che si trova in quel punto.']
    ],
    saFare: ['Stabilisco se due puntatori indicano la stessa cella confrontando gli indirizzi.', 'Prevedo che cosa legge un puntatore dopo una scrittura fatta attraverso un altro.', 'Calcolo il puntatore di fine di un array e riconosco un accesso fuori dai limiti.'],
    esercizi: [
      { d: 'Un array di sei interi da 4 byte comincia all’indirizzo 0x7000. Quanto vale il suo puntatore di fine? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x7008', giuste: ['0x7018', '7018', '7018h'],
        ok: 'Sei elementi da 4 byte occupano 24 byte, che in esadecimale si scrive 18. Il primo indirizzo dopo l’array è 0x7018.',
        diagnosi: [
          { se: ['0x7024', '7024'], msg: 'La dimensione, 24 byte, è giusta. Prima di accostarla alla base va scritta in esadecimale: 24 = 16 + 8.' },
          { se: ['0x7014', '7014'], msg: 'A questo indirizzo comincia l’ultimo elemento, quello di indice 5. Il puntatore di fine sta quattro byte più avanti.' },
          { se: ['0x7006', '7006'], msg: 'Così gli elementi vengono contati come byte. Ciascuno ne occupa 4.' },
          { se: ['0x7017', '7017'], msg: 'Questo è l’ultimo byte dell’array. Il puntatore di fine è il primo indirizzo successivo.' }
        ],
        altro: 'Il valore è diverso. Calcola quanti byte occupa l’array e sommali alla base.',
        indizi: ['Il puntatore di fine è base + numero di elementi × dimensione.', '6 × 4 = 24 byte.', '24 in esadecimale si scrive 18.'],
        svolgimento: ['Dimensione dell’array: 6 × 4 = 24 byte.', '24 = 16 + 8, cioè 0x18.', 'Puntatore di fine: 0x7000 + 0x18 = 0x7018.'] },
      { d: 'RDI contiene 0x6000. Gli otto byte all’indirizzo 0x6000 contengono il numero 0x6100, e i quattro byte all’indirizzo 0x6100 contengono 7. Quanto vale EAX dopo `mov rax, [rdi]` seguita da `mov eax, [rax]`?', guida: 'Scegli la risposta.', o: [
        { t: '7', ok: true, fb: 'Il primo accesso carica in RAX il puntatore 0x6100. Il secondo lo usa come indirizzo e trova 7.' },
        { t: '0x6100', fb: 'Questo è il contenuto di RAX dopo la prima istruzione. La seconda lo usa come indirizzo e legge la cella indicata.' },
        { t: '0x6000', fb: 'Questo è il contenuto di RDI, che resta invariato. Le due istruzioni leggono dalla memoria.' }] }
    ],
    sfida: ['cslez2_3_04_random_assembly_04', 'Scambi e aggiornamenti di elementi']
  }
});
