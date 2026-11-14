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
    for (let k = 0; k < p.n; k++) { const fallito = ko && k === p.n - 1, creato = f >= 1 && !fallito; els.push(el.box(pre + 'w' + k, o.x + k * (ww + 10), o.y + 116, ww, 54, 'worker ' + (k + 1), f < 1 ? '·' : fallito ? 'EAGAIN · non creato' : (loop ? '&i' : '&a[' + k + ']') + (f >= 4 ? ' → ' + L[k] + ' · raccolto' : f >= 3 ? ' → ' + L[k] : f === 2 ? ' · via' : ' · attende'), f < 1 ? '' : fallito ? 'err' : f === 3 || f === 4 ? 'att' : 'on', { cls: 'stretta' })); }
    return els;
  };
  return { letti, chiave, quadro };
})();
SL.registra('5.4.4', {
  titolo: 'Argomenti e raccolta dei thread POSIX',
  obiettivo: 'Obiettivo: prevedere quale valore riceve un thread attraverso il puntatore passato alla creazione, e quante attese deve compiere chi lo ha creato.',
  concetti: [['thread', 'Creare e attendere un thread'], ['puntatore', 'L’argomento è un indirizzo'], ['memory', 'Conta che cosa c’è a quell’indirizzo']],
  filigrana: ['thread', 'puntatore', 'memory'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 2.3.5', t: 'Il puntatore', d: 'Un valore che contiene l’indirizzo di un altro dato.' },
      { sim: 'memory', da: 'Dall’unità 2.3.2', t: 'L’array', d: 'Una fila di celle dello stesso tipo, numerate da 0.' },
      { sim: 'fork', da: 'Dall’unità 5.2.4', t: 'waitpid', d: 'Chi crea un processo ne attende la fine per raccoglierne l’esito.' }
    ],
    domanda: { d: 'Prima di proseguire: tre puntatori contengono lo stesso indirizzo. Chi legge attraverso di essi, quanti valori diversi può trovare nello stesso istante?', o: [
      { t: 'Uno solo', ok: true, fb: 'Lo stesso indirizzo indica la stessa cella, che ha un solo contenuto.' },
      { t: 'Tre', fb: 'I puntatori sono tre, ma la cella indicata è una.' },
      { t: 'Dipende dal tipo dei puntatori', fb: 'La cella è una, e il suo contenuto è lo stesso per tutti.' }
    ] }
  },
  idea: {
    titolo: 'Che cosa riceve davvero un thread',
    termini: ['pthread_create', 'pthread_join'],
    testo: [
      'Nei sistemi che seguono lo standard POSIX i thread si creano con la funzione [[pthread_create]]. Le si indica la funzione che il nuovo thread dovrà eseguire, e un argomento da consegnarle. L’argomento è uno solo, ed è un puntatore: un indirizzo. Al nuovo thread arriva quindi l’indicazione di dove andare a leggere un valore, nella memoria che condivide con chi lo ha creato.',
      'La funzione [[pthread_join]] è la compagna della prima: attende che un thread creato abbia finito. Fa per i thread ciò che waitpid fa per i processi. Chi crea tre thread deve compiere tre attese, una per ciascuno, e nel frattempo deve tenere in vita i dati che ha indicato loro.',
      { fig: 'scena', w: 720, h: 186, titolo: 'Tre worker, tre celle diverse', nota: 'Ogni worker ha ricevuto l’indirizzo di una cella propria, e vi legge il proprio numero: 0, 1 e 2.', els: SL.unita544.quadro('g', { caso: 'el', n: 3 }, 4, { x: 10, y: 0, w: 700 }) },
      'Un creatore vuole avviare tre thread di lavoro, i worker, e dare a ciascuno un numero d’ordine: 0, 1 e 2. Il modo corretto è preparare un array con i tre valori e passare a ogni worker l’indirizzo di una cella diversa, &a[0], &a[1] e &a[2]. Ogni puntatore conduce a un oggetto distinto, e ogni worker vi trova il proprio numero.',
      'L’errore classico è passare a tutti &i, l’indirizzo della variabile che conta i giri del ciclo. I tre puntatori indicano allora la stessa cella. Quando i worker la leggono, il ciclo è finito e i vale 3: leggono tutti 3, e nessuno ha il proprio numero. C’è infine il caso in cui una creazione fallisce, con il codice EAGAIN, perché il sistema ha esaurito le risorse. Il creatore deve accorgersene: i thread esistenti sono due, e due sono le attese da compiere. Attendere un thread mai nato sarebbe un errore.'
    ]
  },
  esperimento: {
    faremo: [
      'Un creatore avvia alcuni worker in un ciclo, e ciascuno legge un numero attraverso il puntatore ricevuto. Sceglierai quanti worker, e come il creatore passa l’argomento. In un caso l’ultima creazione fallisce.',
      'I worker aspettano un via comune, dato a ciclo finito, e poi leggono. Guarda quali valori trovano e quante attese compie il creatore.'
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
    nota: 'I passi sono sempre cinque. I worker leggono dopo la fine del ciclo, quando i vale quanto il numero dei giri.',
    previsione: {
      domanda: (p) => 'Un ciclo con i da 0 a ' + (p.n - 1) + ' crea ' + p.n + ' worker. ' + (p.caso === 'el' ? 'Al worker numero i passa l’indirizzo &a[i], e a[i] contiene i.' : p.caso === 'loop' ? 'A ogni worker passa l’indirizzo &i della variabile del ciclo.' : 'Al worker numero i passa l’indirizzo &a[i], e a[i] contiene i. L’ultima creazione fallisce con EAGAIN.') + ' I worker leggono a ciclo finito. Quali valori trovano?',
      opzioni: (p) => { const s = Array.from({ length: p.n }, (_, k) => k); return [[s.join(', '), s.join(', ')], [s.map(() => p.n).join(', '), s.map(() => p.n).join(', ')], [s.slice(0, -1).join(', '), s.slice(0, -1).join(', ') + ' · un worker in meno']]; }
    },
    confronto: (pred, esito, p) => 'La previsione indicava: ' + pred + '. I worker leggono: ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.caso === 'loop' ? 'Tutti hanno ricevuto lo stesso indirizzo, quello di i, che a ciclo finito vale ' + p.n + '.' : p.caso === 'eagain' ? 'L’ultimo worker non è mai stato creato. Gli altri leggono ciascuno la propria cella.' : 'Ogni worker ha l’indirizzo di una cella diversa, preparata con il suo numero.'),
    costruisci(p) {
      const U = SL.unita544, L = U.letti(p), passi = [], loop = p.caso === 'loop', ko = p.caso === 'eagain', creati = L.length;
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Thread creati', f >= 1 ? String(creati) : '0', 'a'], ['Valori letti', f >= 3 ? L.join(', ') : '·'], ['Join', f >= 4 ? String(creati) : '0', 'c']], els: U.quadro('q', p, f, { x: 20, y: 0, w: 820 }) }, extra));

      P(0, 0, 'Il creatore si prepara', loop ? 'Il creatore usa nel ciclo la variabile i, che parte da 0. Ha deciso di passare a ogni worker l’indirizzo di i.' : 'Il creatore prepara un array di ' + p.n + ' celle, con i valori da 0 a ' + (p.n - 1) + '. Passerà a ogni worker l’indirizzo di una cella diversa.', {});
      P(1, 1, 'Le creazioni', (loop ? 'A ogni giro il creatore chiama pthread_create con l’argomento &i, e poi incrementa i. Tutti i worker ricevono lo stesso indirizzo. Finito il ciclo, i vale ' + p.n + '.' : 'A ogni giro il creatore chiama pthread_create con l’argomento &a[i]. Ogni worker riceve un indirizzo diverso.') + (ko ? ' L’ultima chiamata fallisce e restituisce EAGAIN: il worker ' + p.n + ' non esiste. Il creatore prende nota di ' + creati + ' successi.' : '') + ' I worker creati aspettano il via.', { calc: 'creati: ' + creati + ' su ' + p.n, chiedi: { d: 'Che cosa ha ricevuto ciascun worker come argomento?', o: ['Un numero', 'Un indirizzo'], g: 1, no: 'L’argomento di pthread_create è un puntatore. Il numero va letto a quell’indirizzo.' } });
      P(2, 2, 'Il via', 'Il creatore ha finito il ciclo e dà il via. Da questo momento i worker possono leggere, e i dati indicati dai puntatori non cambiano più.', {});
      P(3, 2, 'Le letture', loop ? 'Ogni worker segue il proprio puntatore, e tutti arrivano alla stessa cella, i, che contiene ' + p.n + '. I valori letti sono ' + L.join(', ') + ': nessun worker ha un numero che lo distingua.' : 'Ogni worker segue il proprio puntatore e arriva a una cella diversa. I valori letti sono ' + L.join(', ') + '.' + (ko ? ' La cella a[' + (p.n - 1) + '] resta senza lettore.' : ''), { calc: 'letti: ' + L.join(', '), esito: [L.join(', '), loop ? 'no' : 'si'] });
      P(4, 3, 'I join', 'Il creatore chiama pthread_join una volta per ogni worker creato: ' + creati + ' attese.' + (ko ? ' Non tenta di attendere il worker ' + p.n + ', che non è mai nato.' : '') + ' Soltanto dopo l’ultimo join può abbandonare ' + (loop ? 'la variabile i' : 'l’array') + ', che fino ad allora doveva restare in vita per i lettori.', { calc: 'join: ' + creati, esito: [L.join(', '), loop ? 'no' : 'si'] });
      return { passi, esito: U.chiave(p) };
    }
  },
  bilancio: {
    regola: [
      'pthread_create consegna al nuovo thread un puntatore. Il thread legge il valore che si trova a quell’indirizzo nel momento della lettura.',
      'Per ogni thread creato con successo serve un pthread_join. I dati indicati dai puntatori devono restare in vita fino alla fine dei join.'
    ],
    errori: [
      ['Passare a tutti i thread l’indirizzo della variabile del ciclo.', 'Tutti leggono la stessa cella, con il valore che ha in quel momento.'],
      ['Attendere tanti thread quanti se ne volevano creare.', 'Se una creazione è fallita, i thread da attendere sono di meno.'],
      ['Lasciare la funzione prima dei join.', 'Le variabili locali spariscono, e i thread leggerebbero memoria non più valida.']
    ],
    saFare: ['Prevedere il valore letto da un thread attraverso il suo argomento.', 'Contare i join dovuti.', 'Spiegare perché i dati passati devono restare in vita.'],
    esercizi: [
      { d: 'Un ciclo con i da 0 a 4 crea cinque thread, passando a ciascuno l’indirizzo &i. I thread leggono dopo la fine del ciclo. Quale valore legge il primo thread creato?', segnaposto: 'Un numero', giuste: ['5', 'cinque'],
        ok: 'A ciclo finito i vale 5, e tutti i thread leggono quella stessa cella.',
        diagnosi: [
          { se: ['0', 'zero'], msg: 'Zero era il valore di i al momento della creazione. Il thread legge più tardi, attraverso l’indirizzo.' },
          { se: ['4', 'quattro'], msg: 'Quattro è l’ultimo valore per cui il ciclo esegue. Alla fine i viene incrementata ancora, e vale 5.' }
        ],
        altro: 'Il numero è diverso. Ci si chieda quanto vale i dopo l’ultimo giro del ciclo.',
        indizi: ['Il thread ha ricevuto un indirizzo, quello di i.', 'Legge dopo la fine del ciclo.', 'A quel punto i vale 5.'],
        svolgimento: ['Argomento: &i.', 'Valore di i a ciclo finito: 5.', 'Valore letto: 5.'] },
      { d: 'Un programma chiede la creazione di 8 thread. Sei chiamate riescono, e due falliscono con EAGAIN. Quante chiamate a pthread_join deve fare?', segnaposto: 'Un numero', giuste: ['6', 'sei'],
        ok: 'Si attende ogni thread creato con successo: 6.',
        diagnosi: [
          { se: ['8', 'otto'], msg: 'Due thread non sono mai stati creati, e non possono essere attesi.' },
          { se: ['2', 'due'], msg: 'Due sono le creazioni fallite. I join riguardano i thread esistenti.' }
        ],
        altro: 'Il numero è diverso. Conta i thread che esistono davvero.',
        indizi: ['Le creazioni riuscite sono 6.', 'Ogni thread esistente va atteso una volta.', 'Join: 6.'],
        svolgimento: ['Richiesti: 8.', 'Creati: 6.', 'Join: 6.'] },
      { d: 'Una funzione crea un thread passandogli l’indirizzo di una propria variabile locale, e ritorna subito, senza join. Qual è il rischio?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il thread può leggere una variabile che non esiste più', ok: true, fb: 'Al ritorno della funzione il suo frame viene abbandonato, e l’indirizzo indica memoria riutilizzabile.' },
        { t: 'Il thread non viene creato', fb: 'La creazione riesce. Il problema nasce dopo, alla lettura.' },
        { t: 'Il thread legge sempre 0', fb: 'Il contenuto è imprevedibile: dipende da chi riusa quella zona della pila.' }] }
    ],
    sfida: ['cslez5_4_04_threads', 'Creazione, join e durata degli argomenti']
  }
});
