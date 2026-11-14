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
      el.box(pre + 'e', o.x + w3 + 10, o.y + 48 + o.h + 14, w3, o.h, 'copia di T2', f < 3 ? 'riprende dopo fork' : e === 'carica' ? 'esegue il nuovo programma' : e === 'termina' ? 'terminato · codice 127' : e === 'bloccato' ? 'bloccato su M' : 'impiega la libreria', f >= 3 ? (e === 'bloccato' ? 'err' : 'att') : f === 1 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'g', o.x + 2 * (w3 + 10), o.y + 48 + o.h + 14, w3, o.h, 'copia di M', f >= 3 && e === 'carica' ? 'eliminata da execve' : occ ? 'occupata da T1' : 'libera', f >= 3 && e === 'carica' ? 'off' : occ ? (f >= 2 ? 'err' : 'zero') : 'on', { cls: 'stretta' }));
    return els;
  };
  return { esito, quadro };
})();
SL.registra('5.2.5', {
  titolo: 'Fork in un processo multithread',
  obiettivo: 'Obiettivo: spiegare per quale ragione il figlio di un processo con più thread è creato in una condizione critica, e indicare le azioni che ne consentono l’uscita senza rischi.',
  concetti: [['thread', 'Più flussi in un processo'], ['fork', 'Il figlio ne eredita uno solo'], ['lucchetto', 'Un mutex senza possessore']],
  filigrana: ['thread', 'fork', 'lucchetto'],
  richiami: {
    carte: [
      { sim: 'fork', da: 'Dall’unità 5.2.1', t: 'fork', d: 'Il figlio riceve una copia della memoria del padre, nello stato di tale istante.' },
      { sim: 'process', da: 'Dall’unità 5.2.3', t: 'execve', d: 'Sostituisce l’intera immagine del processo con un nuovo programma.' },
      { sim: 'process', da: 'Dall’unità 5.2.4', t: '_exit', d: 'Termina il processo consegnando un codice di uscita.' }
    ],
    domanda: { d: 'Prima di proseguire: al momento di fork, nella memoria del padre una variabile vale «occupato». Quanto vale la medesima variabile nel figlio, appena creato?', o: [
      { t: '«occupato», poiché la memoria è copiata senza modifiche', ok: true, fb: 'fork non interpreta i dati che copia.' },
      { t: '«libero», poiché il figlio ha inizio da uno stato azzerato', fb: 'Il figlio riceve una copia fedele, senza alcun azzeramento.' },
      { t: 'Dipende dal valore restituito da fork', fb: 'Il valore restituito distingue padre e figlio, e lascia invariate le variabili.' }
    ] }
  },
  idea: {
    titolo: 'Un mutex occupato, e il suo possessore assente',
    termini: ['thread', 'mutex'],
    testo: [
      'Finora un processo aveva un solo flusso di istruzioni, e tuttavia può averne diversi. Ciascun flusso è un [[thread]]: ha il proprio contatore di programma e la propria pila, e condivide con gli altri thread del medesimo processo l’intera memoria. Ai thread è dedicato il capitolo 5.4. In questa unità è rilevante una loro conseguenza sulla creazione dei processi.',
      'Poiché la memoria è comune, due thread che modificano la medesima struttura devono accedervi uno per volta. Lo strumento è il [[mutex]]: un thread lo acquisisce prima di accedere alla struttura e lo rilascia al termine, e nel frattempo gli altri attendono. Lo stato di occupazione del mutex è registrato in una variabile, nella memoria del processo. Anche le funzioni di libreria impiegano mutex al proprio interno, per esempio quelle che riservano memoria.',
      { fig: 'scena', w: 720, h: 190, titolo: 'T2 chiama fork mentre T1 possiede il mutex M', nota: 'Nel figlio è presente una copia di M, occupata, mentre è assente T1, il solo thread che potrebbe rilasciarla.', els: SL.unita525.quadro('g', { m: 'T1', fa: 'lock' }, 2, { x: 10, y: 0, w: 700, h: 50 }) },
      'Il problema è il seguente. Un processo ha due thread, T1 e T2, e T1 possiede il mutex M. In tale istante T2 chiama fork. Il figlio riceve una copia dell’intera memoria, compresa la variabile che registra M come occupato. Dei thread, tuttavia, fork duplica soltanto quello che l’ha chiamata: nel figlio esiste una copia di T2, mentre T1 è assente. Il mutex risulta occupato, e il thread che lo possiede è rimasto nel padre. Se il figlio chiama una funzione che richiede M, attende indefinitamente.',
      'La soluzione consiste nell’evitare ogni dipendenza dai mutex. Fra fork e l’operazione successiva, il figlio di un processo con più thread deve limitarsi a poche operazioni elementari, che non impiegano mutex. Le operazioni sicure sono due. Con execve il figlio carica un nuovo programma: l’immagine precedente, con la copia di M, è eliminata. Se execve fallisce, con _exit il figlio termina immediatamente. In entrambi i casi il figlio è indipendente da un thread assente.'
    ]
  },
  esperimento: {
    faremo: [
      'Un processo ha due thread, e T2 chiama fork. I controlli fissano lo stato del mutex M in tale istante, posseduto da T1 oppure libero, e l’operazione compiuta dal figlio immediatamente dopo.',
      'L’esperimento mostra i dati copiati nel figlio, quelli assenti e l’esito finale. È istruttivo selezionare la funzione di libreria con il mutex occupato, e in seguito con il mutex libero.'
    ],
    vedrai: [
      ['thread', 'Il padre', 'In alto: i due thread e lo stato del mutex M.'],
      ['fork', 'Il figlio', 'In basso: i dati copiati da fork. Di T1 resta soltanto la posizione vuota.']
    ]
  },
  lab: {
    titolo: 'L’eredità del figlio',
    scena: { w: 860, h: 196 },
    atti: ['Il padre', 'La duplicazione', 'L’operazione del figlio'],
    controlli: [
      { id: 'm', tipo: 'scelta', eti: 'Al momento di fork, M è', opzioni: [['T1', 'occupato da T1'], ['lib', 'libero']], valore: 'T1' },
      { id: 'fa', tipo: 'scelta', eti: 'Il figlio', opzioni: [['exec', 'chiama execve, che riesce'], ['exit', 'chiama execve, che fallisce, e poi _exit(127)'], ['lock', 'chiama una funzione di libreria che impiega M']], valore: 'lock' }
    ],
    nota: 'I passi sono sempre cinque.',
    previsione: {
      domanda: (p) => 'Il thread T2 chiama fork ' + (p.m === 'T1' ? 'mentre T1 possiede il mutex M' : 'mentre il mutex M è libero') + '. Nel figlio, la copia di T2 ' + (p.fa === 'exec' ? 'chiama execve, e il caricamento riesce' : p.fa === 'exit' ? 'chiama execve, che fallisce, e poi _exit(127)' : 'chiama una funzione di libreria che deve acquisire M') + '. Che cosa accade al figlio?',
      opzioni: () => [['carica', 'Esegue il nuovo programma'], ['termina', 'Termina con codice 127'], ['bloccato', 'Resta bloccato indefinitamente'], ['prosegue', 'La funzione riesce, e il figlio prosegue']]
    },
    confronto: (pred, esito, p) => { const N = { carica: 'esegue il nuovo programma', termina: 'termina con codice 127', bloccato: 'resta bloccato indefinitamente', prosegue: 'prosegue normalmente' }; return 'La previsione indicava: ' + N[pred] + '. Il figlio ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'bloccato' ? 'La copia di M è occupata, e nel figlio non esiste il thread che dovrebbe rilasciarla.' : esito === 'prosegue' ? 'M era libero al momento di fork, e la copia è anch’essa libera. L’esito è favorevole, e tuttavia dipende dall’istante.' : 'Né execve né _exit richiedono M: lo stato del mutex è ininfluente.'); },
    costruisci(p) {
      const U = SL.unita525, passi = [], occ = p.m === 'T1', e = U.esito(p);
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, h: 54 });
      const hud = (f) => [['Thread nel figlio', f >= 1 ? '1' : '·', 'a'], ['Copia di M', f >= 1 ? (f >= 3 && e === 'carica' ? 'sparita' : occ ? 'occupata' : 'libera') : '·'], ['Figlio', f >= 3 ? { carica: 'nuovo programma', termina: 'terminato', bloccato: 'bloccato', prosegue: 'prosegue' }[e] : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Un processo, due thread', 'Il processo 60 ha due thread, T1 e T2, che condividono la memoria. ' + (occ ? 'T1 ha acquisito il mutex M per aggiornare una struttura comune, e lo mantiene ancora occupato.' : 'In questo istante nessun thread possiede il mutex M.') + ' T2 sta per chiamare fork.', {});
      P(1, 1, 'fork', 'Il kernel crea il processo 61 con una copia della memoria del padre. Fra i thread duplica soltanto il chiamante: nel figlio esiste una copia di T2, che riprende dall’istruzione successiva a fork. Nel padre T1 e T2 proseguono entrambi.', { chiedi: { d: 'Quanti thread ha il figlio?', o: ['Due, come il padre', 'Uno, la copia del thread che ha chiamato fork'], g: 1, no: 'fork duplica la memoria per intero, e un solo flusso di esecuzione.' } });
      P(2, 1, 'Il contenuto del figlio', occ ? 'La variabile di M è stata copiata senza modifiche: nel figlio M risulta occupato da T1. Nel figlio tuttavia T1 è assente, e nessun thread potrà rilasciare tale copia.' : 'La variabile di M è stata copiata senza modifiche: nel figlio M risulta libero. In questo caso l’istante della fork è stato favorevole.', { calc: 'copia di M: ' + (occ ? 'occupata, senza possessore' : 'libera') });
      P(3, 2, p.fa === 'exec' ? 'Il figlio chiama execve' : p.fa === 'exit' ? 'execve fallisce, e il figlio termina' : 'Il figlio chiama la libreria', p.fa === 'exec' ? 'Il figlio carica immediatamente un nuovo programma. L’immagine precedente è eliminata, e con essa la copia di M' + (occ ? ', occupata o meno.' : '.') + ' execve non ha richiesto alcun mutex.' : p.fa === 'exit' ? 'Il figlio chiama execve, e tuttavia il percorso è assente: la chiamata restituisce −1 con errno ENOENT. Il ramo di errore chiama _exit(127), che termina il processo senza impiegare funzioni di libreria.' : occ ? 'Il figlio chiama una funzione di libreria che, al proprio interno, deve acquisire M: lo trova occupato e ne attende il rilascio.' : 'Il figlio chiama una funzione di libreria che, al proprio interno, acquisisce M. Lo trova libero, lo acquisisce, compie le proprie operazioni e lo rilascia.', { calc: p.fa === 'exec' ? 'execve riuscita' : p.fa === 'exit' ? 'execve → −1 · _exit(127)' : 'richiesta di M' });
      P(4, 2, { carica: 'Un nuovo programma', termina: 'Il figlio è terminato', bloccato: 'Un’attesa indefinita', prosegue: 'Il figlio prosegue' }[e], e === 'carica' ? 'Il processo 61 esegue il nuovo programma, con una memoria nuova. Lo stato di M al momento di fork è stato privo di effetto.' : e === 'termina' ? 'Il processo 61 è terminato con codice 127. Nel padre, T1 e T2 proseguono, e il padre potrà raccogliere l’esito con waitpid.' : e === 'bloccato' ? 'Nessun thread del figlio rilascerà M: il solo in grado di farlo, T1, è rimasto nel padre. Il figlio resta bloccato indefinitamente, e dall’esterno appare inattivo.' : 'La funzione ritorna e il figlio prosegue. Il programma è tuttavia fragile: se la fork fosse avvenuta un istante dopo, con M occupato, il figlio si sarebbe bloccato.', { esito: [{ carica: 'nuovo programma', termina: 'terminato con 127', bloccato: 'bloccato per sempre', prosegue: 'prosegue' }[e], e === 'bloccato' ? 'no' : ''] });
      return { passi, esito: e };
    }
  },
  bilancio: {
    regola: [
      'fork copia tutta la memoria del processo e un solo thread, quello che l’ha chiamata.',
      'Nel figlio di un processo con più thread, fra fork ed execve si impiegano soltanto operazioni elementari. Le operazioni sicure sono execve oppure _exit.'
    ],
    errori: [
      ['Attendersi nel figlio tutti i thread del padre.', 'Il figlio ha un solo thread. Gli altri restano nel padre.'],
      ['Chiamare funzioni di libreria qualsiasi nel figlio.', 'Esse potrebbero richiedere un mutex copiato come occupato, che nessun thread rilascerà.'],
      ['Considerare sufficiente una prova riuscita.', 'L’esito dipende dall’istante in cui avviene fork. Un programma di questo tipo può funzionare mille volte e bloccarsi alla successiva.']
    ],
    saFare: ['Indicare che cosa fork copia, e che cosa esclude, in un processo con più thread.', 'Spiegare per quale ragione un mutex ereditato può restare occupato indefinitamente.', 'Riconoscere le azioni sicure fra fork ed execve.'],
    esercizi: [
      { d: 'Un processo ha 5 thread. Uno di essi chiama fork. Quanti thread ha il figlio appena creato?', segnaposto: 'Un numero', giuste: ['1', 'uno'],
        ok: 'fork duplica soltanto il thread che l’ha chiamata.',
        diagnosi: [
          { se: ['5', 'cinque'], msg: 'La memoria è copiata per intero. Dei flussi di esecuzione è duplicato uno solo.' },
          { se: ['4', 'quattro'], msg: 'Nel figlio è presente la copia del chiamante, e gli altri quattro mancano.' },
          { se: ['0', 'zero'], msg: 'Un flusso è necessariamente presente: la copia del thread che ha chiamato fork.' }
        ],
        altro: 'Il numero è diverso. Si consideri il thread che ha eseguito fork.',
        indizi: ['fork è stata chiamata da un thread.', 'Soltanto tale thread è duplicato.', 'Il figlio ha 1 thread.'],
        svolgimento: ['Thread del padre: 5.', 'Thread duplicati: quello che chiama fork.', 'Thread del figlio: 1.'] },
      { d: 'Nel figlio di un processo con più thread, un mutex risulta occupato da un thread che nel figlio non esiste. Il figlio chiama immediatamente execve, e il caricamento riesce. Il mutex causa problemi?', guida: 'Si scelga la risposta.', o: [
        { t: 'No, l’immagine precedente, con il mutex, è eliminata', ok: true, fb: 'Il nuovo programma ha inizio con una memoria nuova.' },
        { t: 'Sì, il nuovo programma lo trova ancora occupato', fb: 'execve sostituisce tutta la memoria del processo, mutex compreso.' },
        { t: 'Sì, execve deve prima acquisirlo', fb: 'execve è una chiamata di sistema, indipendente dai mutex del programma.' }] },
      { d: 'Un programma con più thread chiama fork, e nel figlio impiega una funzione di libreria prima di execve. Nelle prove funziona sempre. Se ne può concludere la correttezza?', guida: 'Si scelga la risposta.', o: [
        { t: 'No, dipende dallo stato dei mutex nell’istante di fork, che varia a ogni esecuzione', ok: true, fb: 'È sufficiente che un altro thread possieda il mutex in tale istante perché il figlio si blocchi.' },
        { t: 'Sì, se funziona nelle prove, funziona sempre', fb: 'Le prove non determinano l’istante in cui gli altri thread acquisiscono i mutex.' },
        { t: 'Sì, la libreria rilascia i mutex durante fork', fb: 'fork copia la memoria senza modifiche, mutex occupati compresi.' }] }
    ],
    sfida: ['cslez5_2_02_process_control', 'Risorse ereditate e copia su scrittura']
  }
});
