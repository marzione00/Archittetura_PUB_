'use strict';
SL.unita525 = (() => {
  const esito = (p) => (p.fa === 'exec' ? 'carica' : p.fa === 'exit' ? 'termina' : p.m === 'T1' ? 'bloccato' : 'prosegue');
  // fase: 0 il processo · 1 fork · 2 che cosa c'è nel figlio · 3 l'azione · 4 l'esito
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], occ = p.m === 'T1', e = esito(p), w3 = (o.w - 20) / 3;
    els.push(el.nota(pre + 't0', o.x, o.y, 'PADRE · PID 60', 'mono'),
      el.box(pre + 'a', o.x, o.y + 24, w3, o.h, 'thread T1', occ ? 'possiede il mutex M' : 'lavora', 'on', { cls: 'stretta' }),
      el.box(pre + 'b', o.x + w3 + 10, o.y + 24, w3, o.h, 'thread T2', f === 0 ? 'sta per chiamare fork' : 'prosegue', f === 1 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'c', o.x + 2 * (w3 + 10), o.y + 24, w3, o.h, 'mutex M · nella memoria', occ ? 'occupato da T1' : 'libero', occ ? 'zero' : 'on', { cls: 'stretta' }));
    if (f >= 1) els.push(el.nota(pre + 't1', o.x, o.y + 24 + o.h + 14, 'FIGLIO · PID 61', 'mono'),
      el.box(pre + 'd', o.x, o.y + 48 + o.h + 14, w3, o.h, 'thread T1', 'assente', f === 2 ? 'err' : 'off', { cls: 'stretta' }),
      el.box(pre + 'e', o.x + w3 + 10, o.y + 48 + o.h + 14, w3, o.h, 'copia di T2', f < 3 ? 'riparte dopo fork' : e === 'carica' ? 'esegue il nuovo programma' : e === 'termina' ? 'terminato · codice 127' : e === 'bloccato' ? 'bloccato su M' : 'usa la libreria', f >= 3 ? (e === 'bloccato' ? 'err' : 'att') : f === 1 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'g', o.x + 2 * (w3 + 10), o.y + 48 + o.h + 14, w3, o.h, 'copia di M', f >= 3 && e === 'carica' ? 'eliminata da execve' : occ ? 'occupata, senza padrone' : 'libera', f >= 3 && e === 'carica' ? 'off' : occ ? (f >= 2 ? 'err' : 'zero') : 'on', { cls: 'stretta' }));
    return els;
  };
  return { esito, quadro };
})();
SL.registra('5.2.5', {
  titolo: 'Fork in un processo multithread',
  obiettivo: 'Obiettivo: spiegare perché il figlio di un processo con più thread nasce in una condizione delicata, e quali azioni lo portano fuori senza rischi.',
  concetti: [['thread', 'Più flussi in un processo'], ['fork', 'Il figlio ne eredita uno solo'], ['lucchetto', 'Un lucchetto senza padrone']],
  filigrana: ['thread', 'fork', 'lucchetto'],
  richiami: {
    carte: [
      { sim: 'fork', da: 'Dall’unità 5.2.1', t: 'fork', d: 'Il figlio riceve una copia della memoria del padre, così com’è in quell’istante.' },
      { sim: 'process', da: 'Dall’unità 5.2.3', t: 'execve', d: 'Sostituisce l’intera immagine del processo con un nuovo programma.' },
      { sim: 'process', da: 'Dall’unità 5.2.4', t: '_exit', d: 'Termina il processo consegnando un codice di uscita.' }
    ],
    domanda: { d: 'Prima di proseguire: al momento di fork, nella memoria del padre una variabile vale «occupato». Quanto vale la stessa variabile nel figlio, appena nato?', o: [
      { t: '«occupato»: la memoria è copiata così com’è', ok: true, fb: 'fork non interpreta i dati che copia.' },
      { t: '«libero»: il figlio parte da zero', fb: 'Il figlio riceve una copia fedele, senza alcun azzeramento.' },
      { t: 'Dipende dal valore restituito da fork', fb: 'Il valore restituito distingue padre e figlio, e non modifica le variabili.' }
    ] }
  },
  idea: {
    titolo: 'Un lucchetto chiuso, e la chiave rimasta altrove',
    termini: ['thread', 'mutex'],
    testo: [
      'Finora un processo aveva un solo flusso di istruzioni. In realtà può averne diversi. Ciascun flusso è un [[thread]]: ha il proprio contatore di programma e la propria pila, e condivide con gli altri thread dello stesso processo tutta la memoria. Ai thread è dedicato il capitolo 5.4. Qui interessa una loro conseguenza sulla creazione dei processi.',
      'Poiché la memoria è comune, due thread che modificano la stessa struttura devono fare a turno. Lo strumento è il [[mutex]], una specie di lucchetto: un thread lo acquisisce prima di toccare la struttura e lo rilascia quando ha finito, e nel frattempo gli altri aspettano. Il fatto che il mutex sia occupato è scritto in una variabile, nella memoria del processo. Anche le funzioni di libreria usano mutex al proprio interno, per esempio quelle che riservano memoria.',
      { fig: 'scena', w: 720, h: 190, titolo: 'T2 chiama fork mentre T1 possiede il mutex M', nota: 'Nel figlio c’è una copia di M, occupata, e non c’è T1 che possa rilasciarla.', els: SL.unita525.quadro('g', { m: 'T1', fa: 'lock' }, 2, { x: 10, y: 0, w: 700, h: 50 }) },
      'Ora il problema. Un processo ha due thread, T1 e T2. T1 possiede il mutex M. In quell’istante T2 chiama fork. Il figlio riceve una copia di tutta la memoria, compresa la variabile che dice «M è occupato». Dei thread, però, fork duplica soltanto quello che l’ha chiamata. Nel figlio esiste una copia di T2, e T1 non c’è. Il lucchetto è chiuso, e chi aveva la chiave è rimasto nel padre. Se il figlio chiama una funzione che ha bisogno di M, aspetterà per sempre.',
      'La via d’uscita è non avere bisogno di nulla. Fra fork e la mossa successiva, il figlio di un processo con più thread dovrebbe limitarsi a poche operazioni elementari, che non usano mutex. Le mosse sicure sono due. Con execve carica un nuovo programma: la vecchia immagine, con la copia di M, scompare. Se execve fallisce, con _exit termina subito. In entrambi i casi il figlio non dipende da un thread che non ha.'
    ]
  },
  esperimento: {
    faremo: [
      'Un processo ha due thread. T2 chiama fork. Sceglierai se in quell’istante T1 possiede il mutex M, e che cosa fa il figlio subito dopo.',
      'Vedremo che cosa arriva nel figlio e che cosa no, e come finisce. Scegli la funzione di libreria con il mutex occupato, e poi con il mutex libero.'
    ],
    vedrai: [
      ['thread', 'Il padre', 'In alto: i due thread e lo stato del mutex M.'],
      ['fork', 'Il figlio', 'In basso: ciò che fork ha copiato. Di T1 resta soltanto il posto vuoto.']
    ]
  },
  lab: {
    titolo: 'Che cosa eredita il figlio',
    scena: { w: 860, h: 196 },
    atti: ['Il padre', 'La duplicazione', 'La mossa del figlio'],
    controlli: [
      { id: 'm', tipo: 'scelta', eti: 'Al momento di fork, M è', opzioni: [['T1', 'occupato da T1'], ['lib', 'libero']], valore: 'T1' },
      { id: 'fa', tipo: 'scelta', eti: 'Il figlio', opzioni: [['exec', 'chiama execve, che riesce'], ['exit', 'chiama execve, che fallisce, e poi _exit(127)'], ['lock', 'chiama una funzione di libreria che usa M']], valore: 'lock' }
    ],
    nota: 'I passi sono sempre cinque.',
    previsione: {
      domanda: (p) => 'Il thread T2 chiama fork ' + (p.m === 'T1' ? 'mentre T1 possiede il mutex M' : 'mentre il mutex M è libero') + '. Nel figlio, la copia di T2 ' + (p.fa === 'exec' ? 'chiama execve, e il caricamento riesce' : p.fa === 'exit' ? 'chiama execve, che fallisce, e poi _exit(127)' : 'chiama una funzione di libreria che deve acquisire M') + '. Che cosa accade al figlio?',
      opzioni: () => [['carica', 'Esegue il nuovo programma'], ['termina', 'Termina con codice 127'], ['bloccato', 'Resta bloccato per sempre'], ['prosegue', 'La funzione riesce, e il figlio prosegue']]
    },
    confronto: (pred, esito, p) => { const N = { carica: 'esegue il nuovo programma', termina: 'termina con codice 127', bloccato: 'resta bloccato per sempre', prosegue: 'prosegue normalmente' }; return 'La previsione indicava: ' + N[pred] + '. Il figlio ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'bloccato' ? 'La copia di M è occupata, e nel figlio non esiste il thread che dovrebbe rilasciarla.' : esito === 'prosegue' ? 'M era libero al momento di fork, e la copia è libera anch’essa. È andata bene, ma dipende dall’istante.' : 'Né execve né _exit hanno bisogno di M: lo stato del mutex è ininfluente.'); },
    costruisci(p) {
      const U = SL.unita525, passi = [], occ = p.m === 'T1', e = U.esito(p);
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, h: 54 });
      const hud = (f) => [['Thread nel figlio', f >= 1 ? '1' : '·', 'a'], ['Copia di M', f >= 1 ? (f >= 3 && e === 'carica' ? 'sparita' : occ ? 'occupata' : 'libera') : '·'], ['Figlio', f >= 3 ? { carica: 'nuovo programma', termina: 'terminato', bloccato: 'bloccato', prosegue: 'prosegue' }[e] : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Un processo, due thread', 'Il processo 60 ha due thread, T1 e T2, che condividono la memoria. ' + (occ ? 'T1 ha acquisito il mutex M per aggiornare una struttura comune, e lo tiene ancora occupato.' : 'In questo momento nessuno possiede il mutex M.') + ' T2 sta per chiamare fork.', {});
      P(1, 1, 'fork', 'Il kernel crea il processo 61 con una copia della memoria del padre. Fra i thread duplica soltanto il chiamante: nel figlio esiste una copia di T2, che riparte dall’istruzione dopo fork. Nel padre T1 e T2 continuano entrambi.', { chiedi: { d: 'Quanti thread ha il figlio?', o: ['Due, come il padre', 'Uno: la copia del thread che ha chiamato fork'], g: 1, no: 'fork duplica la memoria per intero, ma un solo flusso di esecuzione.' } });
      P(2, 1, 'Che cosa c’è nel figlio', occ ? 'La variabile di M è stata copiata com’era: nel figlio M risulta occupato da T1. Ma T1 nel figlio non esiste, e nessuno potrà mai rilasciare quella copia.' : 'La variabile di M è stata copiata com’era: nel figlio M risulta libero. Questa volta l’istante della fork è stato favorevole.', { calc: 'copia di M: ' + (occ ? 'occupata, senza possessore' : 'libera') });
      P(3, 2, p.fa === 'exec' ? 'Il figlio chiama execve' : p.fa === 'exit' ? 'execve fallisce, e il figlio esce' : 'Il figlio chiama la libreria', p.fa === 'exec' ? 'Il figlio carica subito un nuovo programma. La vecchia immagine viene eliminata, e con essa la copia di M' + (occ ? ', occupata o no.' : '.') + ' execve non ha avuto bisogno di alcun mutex.' : p.fa === 'exit' ? 'Il figlio chiama execve, ma il percorso è assente: la chiamata restituisce −1 con errno ENOENT. Il ramo di errore chiama _exit(127), che termina il processo senza passare da funzioni di libreria.' : occ ? 'Il figlio chiama una funzione di libreria che, al proprio interno, deve acquisire M. Trova M occupato e si mette ad aspettare che venga rilasciato.' : 'Il figlio chiama una funzione di libreria che, al proprio interno, acquisisce M. Lo trova libero, lo prende, lavora e lo rilascia.', { calc: p.fa === 'exec' ? 'execve riuscita' : p.fa === 'exit' ? 'execve → −1 · _exit(127)' : 'richiesta di M' });
      P(4, 2, { carica: 'Un nuovo programma', termina: 'Il figlio è terminato', bloccato: 'Un’attesa senza fine', prosegue: 'Il figlio prosegue' }[e], e === 'carica' ? 'Il processo 61 esegue il nuovo programma, con una memoria nuova. Lo stato di M al momento di fork non ha avuto alcun effetto.' : e === 'termina' ? 'Il processo 61 è terminato con codice 127. Nel padre, T1 e T2 continuano a lavorare, e il padre potrà raccogliere l’esito con waitpid.' : e === 'bloccato' ? 'Nessun thread del figlio rilascerà mai M: il solo che poteva farlo, T1, è rimasto nel padre. Il figlio resta bloccato per sempre, e dall’esterno appare fermo.' : 'La funzione ritorna e il figlio prosegue. Il programma però è fragile: se la fork fosse avvenuta un istante dopo, con M occupato, il figlio si sarebbe bloccato.', { esito: [{ carica: 'nuovo programma', termina: 'terminato con 127', bloccato: 'bloccato per sempre', prosegue: 'prosegue' }[e], e === 'bloccato' ? 'no' : ''] });
      return { passi, esito: e };
    }
  },
  bilancio: {
    regola: [
      'fork copia tutta la memoria del processo e un solo thread, quello che l’ha chiamata.',
      'Nel figlio di un processo con più thread, fra fork ed execve si usano soltanto operazioni elementari. Le mosse sicure sono execve oppure _exit.'
    ],
    errori: [
      ['Aspettarsi nel figlio tutti i thread del padre.', 'Il figlio ha un solo thread. Gli altri restano nel padre.'],
      ['Chiamare funzioni di libreria qualsiasi nel figlio.', 'Potrebbero avere bisogno di un mutex copiato come occupato, che nessuno rilascerà.'],
      ['Fidarsi di una prova andata bene.', 'L’esito dipende dall’istante in cui avviene fork. Un programma così può funzionare mille volte e bloccarsi la volta successiva.']
    ],
    saFare: ['Indicare che cosa fork copia e che cosa no in un processo con più thread.', 'Spiegare perché un mutex ereditato può restare occupato per sempre.', 'Riconoscere le azioni sicure fra fork ed execve.'],
    esercizi: [
      { d: 'Un processo ha 5 thread. Uno di essi chiama fork. Quanti thread ha il figlio appena creato?', segnaposto: 'Un numero', giuste: ['1', 'uno'],
        ok: 'fork duplica soltanto il thread che l’ha chiamata.',
        diagnosi: [
          { se: ['5', 'cinque'], msg: 'La memoria viene copiata tutta. Dei flussi di esecuzione ne viene duplicato uno solo.' },
          { se: ['4', 'quattro'], msg: 'Nel figlio c’è la copia del chiamante, e gli altri quattro mancano.' },
          { se: ['0', 'zero'], msg: 'Un flusso deve pur esserci: la copia del thread che ha chiamato fork.' }
        ],
        altro: 'Il numero è diverso. Ci si chieda quale thread stava eseguendo fork.',
        indizi: ['fork è stata chiamata da un thread.', 'Soltanto quel thread viene duplicato.', 'Il figlio ha 1 thread.'],
        svolgimento: ['Thread del padre: 5.', 'Thread duplicati: quello che chiama fork.', 'Thread del figlio: 1.'] },
      { d: 'Nel figlio di un processo con più thread, un mutex risulta occupato da un thread che nel figlio non esiste. Il figlio chiama subito execve, e il caricamento riesce. Il mutex causa problemi?', guida: 'Si scelga la risposta.', o: [
        { t: 'No: la vecchia immagine, con il mutex, viene eliminata', ok: true, fb: 'Il nuovo programma parte con una memoria nuova.' },
        { t: 'Sì: il nuovo programma lo trova ancora occupato', fb: 'execve sostituisce tutta la memoria del processo, mutex compreso.' },
        { t: 'Sì: execve deve prima acquisirlo', fb: 'execve è una chiamata di sistema, e non usa i mutex del programma.' }] },
      { d: 'Un programma con più thread chiama fork, e nel figlio usa una funzione di libreria prima di execve. Nelle prove funziona sempre. Si può concludere che è corretto?', guida: 'Si scelga la risposta.', o: [
        { t: 'No: dipende dallo stato dei mutex nell’istante di fork, che cambia a ogni esecuzione', ok: true, fb: 'Basta che un altro thread possieda il mutex in quel momento perché il figlio si blocchi.' },
        { t: 'Sì: se funziona nelle prove, funziona sempre', fb: 'Le prove non decidono l’istante in cui gli altri thread acquisiscono i mutex.' },
        { t: 'Sì: la libreria rilascia i mutex durante fork', fb: 'fork copia la memoria com’è, mutex occupati compresi.' }] }
    ],
    sfida: ['cslez5_2_02_process_control', 'Risorse ereditate e copia su scrittura']
  }
});
