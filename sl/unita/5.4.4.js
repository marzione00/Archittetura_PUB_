'use strict';
SL.unita544 = (() => {
  // valori letti dai worker creati
  const letti = (p) => { const creati = p.caso === 'eagain' ? p.n - 1 : p.n; return Array.from({ length: creati }, (_, k) => (p.caso === 'loop' ? p.n : k)); };
  const chiave = (p) => letti(p).join(', ');
  // fase: 0 il creatore · 1 le creazioni · 2 il cancello · 3 le letture · 4 i join
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], L = letti(p), loop = p.caso === 'loop', ko = p.caso === 'eagain', ww = (o.w - (p.n - 1) * 10) / p.n;
    els.push(el.nota(pre + 't0', o.x, o.y, loop ? 'VARIABILE DEL CREATORE' : 'ARRAY DEL CREATORE · una cella per worker', 'mono'));
    if (loop) els.push(el.cella(pre + 'i', o.x, o.y + 42, 120, 34, String(f >= 1 ? p.n : 0), f === 1 ? 'att' : 'on', { so: 'i', piccola: true }));
    else for (let k = 0; k < p.n; k++) els.push(el.cella(pre + 'a' + k, o.x + k * (ww + 10), o.y + 42, ww, 34, String(k), f === 3 && k < L.length ? 'att' : 'on', { so: 'a[' + k + ']', piccola: true }));
    els.push(el.nota(pre + 't1', o.x, o.y + 92, 'WORKER · l’argomento ricevuto e il valore letto', 'mono'));
    for (let k = 0; k < p.n; k++) { const fallito = ko && k === p.n - 1; els.push(el.box(pre + 'w' + k, o.x + k * (ww + 10), o.y + 116, ww, 54, 'worker ' + (k + 1), f < 1 ? '·' : fallito ? 'EAGAIN · non creato' : (loop ? '&i' : '&a[' + k + ']') + (f >= 4 ? ' → ' + L[k] + ' · raccolto' : f >= 3 ? ' → ' + L[k] : f === 2 ? ' · via' : ' · attende'), f < 1 ? '' : fallito ? 'err' : f === 3 || f === 4 ? 'att' : 'on', { cls: 'stretta' })); }
    return els;
  };
  return { letti, chiave, quadro };
})();
SL.registra('5.4.4', {
  titolo: 'Argomenti e raccolta dei thread POSIX',
  obiettivo: 'Obiettivo: prevedere il valore ricevuto da un thread attraverso il puntatore passato alla creazione, e il numero delle attese dovute dal thread creatore.',
  concetti: [['thread', 'Creazione e attesa di un thread'], ['puntatore', 'L’argomento è un indirizzo'], ['memory', 'È rilevante il contenuto di quell’indirizzo']],
  filigrana: ['thread', 'puntatore', 'memory'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 2.3.5', t: 'Il puntatore', d: 'Un valore che contiene l’indirizzo di un altro dato.' },
      { sim: 'memory', da: 'Dall’unità 2.3.2', t: 'L’array', d: 'Una sequenza di celle del medesimo tipo, numerate da 0.' },
      { sim: 'fork', da: 'Dall’unità 5.2.4', t: 'waitpid', d: 'Il padre attende la terminazione del figlio per raccoglierne l’esito.' }
    ],
    domanda: { d: 'Prima di proseguire: tre puntatori contengono il medesimo indirizzo. Quanti valori diversi può trovare, nel medesimo istante, una lettura attraverso di essi?', o: [
      { t: 'Uno solo', ok: true, fb: 'Il medesimo indirizzo indica la medesima cella, che ha un solo contenuto.' },
      { t: 'Tre', fb: 'I puntatori sono tre, mentre la cella indicata è una.' },
      { t: 'Dipende dal tipo dei puntatori', fb: 'La cella è una, e il suo contenuto è il medesimo per tutti.' }
    ] }
  },
  idea: {
    titolo: 'Il dato effettivamente ricevuto da un thread',
    termini: ['pthread_create', 'pthread_join'],
    testo: [
      'Nei sistemi conformi allo standard POSIX i thread sono creati con la funzione [[pthread_create]], alla quale si indicano la funzione che il nuovo thread dovrà eseguire e un argomento da trasmetterle. L’argomento è uno solo, ed è un puntatore, cioè un indirizzo. Il nuovo thread riceve pertanto l’indicazione della posizione in cui leggere un valore, nella memoria che condivide con il thread creatore.',
      'La funzione [[pthread_join]] è complementare alla prima: attende la terminazione di un thread creato, e svolge per i thread la funzione che waitpid svolge per i processi. Un creatore di tre thread deve compiere tre attese, una per ciascuno, e nel frattempo deve mantenere validi i dati indicati ai thread.',
      { fig: 'scena', w: 720, h: 186, titolo: 'Tre worker, tre celle diverse', nota: 'Ogni worker ha ricevuto l’indirizzo di una cella propria, e vi legge il proprio numero: 0, 1 e 2.', els: SL.unita544.quadro('g', { caso: 'el', n: 3 }, 4, { x: 10, y: 0, w: 700 }) },
      'Un creatore deve avviare tre thread di lavoro, i worker, e assegnare a ciascuno un numero d’ordine: 0, 1 e 2. Il procedimento corretto consiste nel predisporre un array con i tre valori e nel passare a ogni worker l’indirizzo di una cella diversa, &a[0], &a[1] e &a[2]. Ogni puntatore conduce a un oggetto distinto, e ogni worker vi trova il proprio numero.',
      'L’errore tipico consiste nel passare a tutti &i, l’indirizzo della variabile che conta le iterazioni del ciclo. I tre puntatori indicano allora la medesima cella. Quando i worker la leggono, il ciclo è terminato e i vale 3: tutti leggono 3, e nessuno dispone del proprio numero. Resta infine il caso in cui una creazione fallisce, con il codice EAGAIN, poiché il sistema ha esaurito le risorse. Il creatore deve rilevarlo: i thread esistenti sono due, e due sono le attese da compiere, mentre l’attesa di un thread mai creato sarebbe un errore.'
    ]
  },
  esperimento: {
    faremo: [
      'Un creatore avvia alcuni worker in un ciclo, e ciascuno legge un numero attraverso il puntatore ricevuto. I controlli fissano il numero dei worker, e la modalità con cui il creatore passa l’argomento. In un caso l’ultima creazione fallisce.',
      'I worker attendono un avvio comune, concesso al termine del ciclo, e quindi leggono. L’esperimento mostra i valori trovati e il numero delle attese compiute dal creatore.'
    ],
    vedrai: [
      ['memory', 'I dati del creatore', 'In alto: l’array, oppure la variabile i del ciclo.'],
      ['thread', 'I worker', 'In basso: per ogni worker, l’indirizzo ricevuto e, dopo la freccia, il valore letto.']
    ]
  },
  lab: {
    titolo: 'Che cosa legge ogni worker',
    scena: { w: 860, h: 186 },
    atti: ['Il creatore', 'Le creazioni', 'Le letture', 'I join'],
    controlli: [
      { id: 'caso', tipo: 'scelta', eti: 'Argomento', opzioni: [['el', 'l’indirizzo di una cella per ciascuno'], ['loop', 'a tutti l’indirizzo di i'], ['eagain', 'una cella per ciascuno, l’ultima creazione fallisce']], valore: 'el' },
      { id: 'n', tipo: 'scelta', eti: 'Worker richiesti', opzioni: [[3, '3'], [4, '4']], valore: 3 }
    ],
    nota: 'I passi sono sempre cinque. I worker leggono dopo la fine del ciclo, quando i è pari al numero delle iterazioni.',
    previsione: {
      domanda: (p) => 'Un ciclo con i da 0 a ' + (p.n - 1) + ' crea ' + p.n + ' worker. ' + (p.caso === 'el' ? 'Al worker numero i passa l’indirizzo &a[i], e a[i] contiene i.' : p.caso === 'loop' ? 'A ogni worker passa l’indirizzo &i della variabile del ciclo.' : 'Al worker numero i passa l’indirizzo &a[i], e a[i] contiene i. L’ultima creazione fallisce con EAGAIN.') + ' I worker leggono al termine del ciclo. Quali valori trovano?',
      opzioni: (p) => { const s = Array.from({ length: p.n }, (_, k) => k); return [[s.join(', '), s.join(', ')], [s.map(() => p.n).join(', '), s.map(() => p.n).join(', ')], [s.slice(0, -1).join(', '), s.slice(0, -1).join(', ') + ' · un worker in meno']]; }
    },
    confronto: (pred, esito, p) => 'La previsione indicava: ' + pred + '. I worker leggono: ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.caso === 'loop' ? 'Tutti hanno ricevuto il medesimo indirizzo, quello di i, che al termine del ciclo vale ' + p.n + '.' : p.caso === 'eagain' ? 'L’ultimo worker non è mai stato creato. Gli altri leggono ciascuno la propria cella.' : 'Ogni worker ha l’indirizzo di una cella diversa, predisposta con il suo numero.'),
    costruisci(p) {
      const U = SL.unita544, L = U.letti(p), passi = [], loop = p.caso === 'loop', ko = p.caso === 'eagain', creati = L.length;
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Thread creati', f >= 1 ? String(creati) : '0', 'a'], ['Valori letti', f >= 3 ? L.join(', ') : '·'], ['Join', f >= 4 ? String(creati) : '0', 'c']], els: U.quadro('q', p, f, { x: 20, y: 0, w: 820 }) }, extra));

      P(0, 0, 'La predisposizione', loop ? 'Il creatore impiega nel ciclo la variabile i, con valore iniziale 0, e passa a ogni worker l’indirizzo di i.' : 'Il creatore predispone un array di ' + p.n + ' celle, con i valori da 0 a ' + (p.n - 1) + '. Passerà a ogni worker l’indirizzo di una cella diversa.', {});
      P(1, 1, 'Le creazioni', (loop ? 'A ogni iterazione il creatore chiama pthread_create con l’argomento &i, e quindi incrementa i: tutti i worker ricevono il medesimo indirizzo, e al termine del ciclo i vale ' + p.n + '.' : 'A ogni iterazione il creatore chiama pthread_create con l’argomento &a[i]. Ogni worker riceve un indirizzo diverso.') + (ko ? ' L’ultima chiamata fallisce e restituisce EAGAIN: il worker ' + p.n + ' non esiste. Il creatore registra ' + creati + ' successi.' : '') + ' I worker creati attendono l’avvio.', { calc: 'creati: ' + creati + ' su ' + p.n, chiedi: { d: 'Che cosa ha ricevuto ciascun worker come argomento?', o: ['Un numero', 'Un indirizzo'], g: 1, no: 'L’argomento di pthread_create è un puntatore. Il numero va letto a quell’indirizzo.' } });
      P(2, 2, 'L’avvio', 'Il creatore ha terminato il ciclo e concede l’avvio. Da questo momento i worker possono leggere, e i dati indicati dai puntatori restano invariati.', {});
      P(3, 2, 'Le letture', loop ? 'Ogni worker segue il proprio puntatore, e tutti giungono alla medesima cella, i, che contiene ' + p.n + '. I valori letti sono ' + L.join(', ') + ': nessun worker ha un numero che lo distingua.' : 'Ogni worker segue il proprio puntatore e giunge a una cella diversa. I valori letti sono ' + L.join(', ') + '.' + (ko ? ' La cella a[' + (p.n - 1) + '] resta senza lettore.' : ''), { calc: 'letti: ' + L.join(', '), esito: [L.join(', '), loop ? 'no' : 'si'] });
      P(4, 3, 'I join', 'Il creatore chiama pthread_join una volta per ogni worker creato: ' + creati + ' attese.' + (ko ? ' Non tenta di attendere il worker ' + p.n + ', che non è mai stato creato.' : '') + ' Soltanto dopo l’ultimo join può abbandonare ' + (loop ? 'la variabile i' : 'l’array') + ', la cui validità era fino a quel momento necessaria ai lettori.', { calc: 'join: ' + creati, esito: [L.join(', '), loop ? 'no' : 'si'] });
      return { passi, esito: U.chiave(p) };
    }
  },
  bilancio: {
    regola: [
      'pthread_create consegna al nuovo thread un puntatore. Il thread legge il valore che si trova a quell’indirizzo nel momento della lettura.',
      'Per ogni thread creato con successo occorre un pthread_join. I dati indicati dai puntatori devono restare validi fino al termine dei join.'
    ],
    errori: [
      ['Passare a tutti i thread l’indirizzo della variabile del ciclo.', 'Tutti leggono la medesima cella, con il valore presente in quel momento.'],
      ['Attendere un numero di thread pari alle creazioni richieste.', 'Se una creazione è fallita, i thread da attendere sono in numero minore.'],
      ['Uscire dalla funzione prima dei join.', 'Le variabili locali cessano di esistere, e i thread leggerebbero memoria non più valida.']
    ],
    saFare: ['Prevedere il valore letto da un thread attraverso il suo argomento.', 'Contare i join dovuti.', 'Spiegare per quale ragione i dati passati devono restare validi.'],
    esercizi: [
      { d: 'Un ciclo con i da 0 a 4 crea cinque thread, e passa a ciascuno l’indirizzo &i. I thread leggono dopo la fine del ciclo. Quale valore legge il primo thread creato?', segnaposto: 'Un numero', giuste: ['5', 'cinque'],
        ok: 'Al termine del ciclo i vale 5, e tutti i thread leggono la medesima cella.',
        diagnosi: [
          { se: ['0', 'zero'], msg: 'Zero era il valore di i al momento della creazione. Il thread legge in seguito, attraverso l’indirizzo.' },
          { se: ['4', 'quattro'], msg: 'Quattro è l’ultimo valore per cui il ciclo esegue. Al termine i è incrementata ancora, e vale 5.' }
        ],
        altro: 'Il numero è diverso. Si determini il valore di i dopo l’ultima iterazione del ciclo.',
        indizi: ['Il thread ha ricevuto un indirizzo, quello di i.', 'Legge dopo la fine del ciclo.', 'In quel momento i vale 5.'],
        svolgimento: ['Argomento: &i.', 'Valore di i al termine del ciclo: 5.', 'Valore letto: 5.'] },
      { d: 'Un programma richiede la creazione di 8 thread. Sei chiamate riescono, e due falliscono con EAGAIN. Quante chiamate a pthread_join deve eseguire?', segnaposto: 'Un numero', giuste: ['6', 'sei'],
        ok: 'Si attende ogni thread creato con successo: 6.',
        diagnosi: [
          { se: ['8', 'otto'], msg: 'Due thread non sono mai stati creati, e pertanto è impossibile attenderli.' },
          { se: ['2', 'due'], msg: 'Due sono le creazioni fallite. I join riguardano i thread esistenti.' }
        ],
        altro: 'Il numero è diverso. Si contino i thread effettivamente esistenti.',
        indizi: ['Le creazioni riuscite sono 6.', 'Ogni thread esistente va atteso una volta.', 'Join: 6.'],
        svolgimento: ['Richiesti: 8.', 'Creati: 6.', 'Join: 6.'] },
      { d: 'Una funzione crea un thread passandogli l’indirizzo di una propria variabile locale, e ritorna immediatamente, senza join. Qual è il rischio?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il thread può leggere una variabile che non esiste più', ok: true, fb: 'Al ritorno della funzione il suo frame è abbandonato, e l’indirizzo indica memoria riutilizzabile.' },
        { t: 'Il thread non è creato', fb: 'La creazione riesce. Il problema sorge in seguito, alla lettura.' },
        { t: 'Il thread legge sempre 0', fb: 'Il contenuto è imprevedibile: dipende dal codice che riutilizza quella zona della pila.' }] }
    ],
    sfida: ['cslez5_4_04_threads', 'Creazione, join e durata degli argomenti']
  }
});
