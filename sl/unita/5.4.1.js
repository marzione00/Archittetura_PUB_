'use strict';
SL.unita541 = (() => {
  const H0 = 5, R0 = 3;
  const letto = (p) => (p.ord === 'dopo' ? p.x : H0);
  // racconto: elenco di quadri { h, r1, r2, chi, att }
  const quadri = (p) => {
    const Q = [{ h: H0, r1: p.x, r2: R0, chi: '', att: '' }];
    if (p.ord === 'dopo') { Q.push({ h: p.x, r1: p.x, r2: R0, chi: 'T1', att: 'h' }); Q.push({ h: p.x, r1: p.x, r2: R0, chi: '', att: 'r2' }); Q.push({ h: p.x, r1: p.x, r2: p.x, chi: 'T2', att: 'r2' }); }
    else { Q.push({ h: H0, r1: p.x, r2: H0, chi: 'T2', att: 'r2' }); Q.push({ h: p.x, r1: p.x, r2: H0, chi: 'T1', att: 'h' }); Q.push({ h: p.x, r1: p.x, r2: H0, chi: '', att: 'r2' }); }
    return Q;
  };
  const scena = (pre, q, o) => {
    const el = SL.el, w3 = (o.w - 2 * o.gap) / 3;
    return [el.nota(pre + 't0', o.x, o.y, 'THREAD T1 · privato', 'mono'), el.nota(pre + 't1', o.x + w3 + o.gap, o.y, 'MEMORIA · comune', 'mono'), el.nota(pre + 't2', o.x + 2 * (w3 + o.gap), o.y, 'THREAD T2 · privato', 'mono'),
      el.box(pre + 'a', o.x, o.y + 24, w3, o.h, 'registro r di T1', String(q.r1), q.chi === 'T1' ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'h', o.x + w3 + o.gap, o.y + 24, w3, o.h, 'cella h', String(q.h), q.att === 'h' ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'b', o.x + 2 * (w3 + o.gap), o.y + 24, w3, o.h, 'registro r di T2', String(q.r2), q.att === 'r2' ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'c', o.x, o.y + 24 + o.h + 12, w3, o.h, 'pila di T1', 'solo sua', 'off', { cls: 'stretta' }),
      el.box(pre + 'd', o.x + w3 + o.gap, o.y + 24 + o.h + 12, w3, o.h, 'in esecuzione', q.chi || '·', q.chi ? 'att' : '', { cls: 'stretta' }),
      el.box(pre + 'e', o.x + 2 * (w3 + o.gap), o.y + 24 + o.h + 12, w3, o.h, 'pila di T2', 'solo sua', 'off', { cls: 'stretta' })];
  };
  return { H0, R0, letto, quadri, scena };
})();
SL.registra('5.4.1', {
  titolo: 'Memoria condivisa e registri dei thread',
  obiettivo: 'Obiettivo: distinguere ciò che i thread di un processo hanno in comune da ciò che ciascuno tiene per sé, e prevedere che cosa legge un thread da una cella scritta da un altro.',
  concetti: [['thread', 'Più flussi, una sola memoria'], ['register', 'Registri e pila sono privati'], ['memory', 'Una cella comune fa da tramite']],
  filigrana: ['thread', 'memory', 'register'],
  richiami: {
    carte: [
      { sim: 'thread', da: 'Dall’unità 5.2.5', t: 'Il thread', d: 'Un flusso di istruzioni dentro un processo, con contatore di programma e pila propri.' },
      { sim: 'process', da: 'Dall’unità 5.1.1', t: 'L’isolamento fra processi', d: 'Due processi non vedono l’uno la memoria dell’altro.' },
      { sim: 'register', da: 'Dall’unità 5.1.3', t: 'Il contesto', d: 'I registri di un flusso sospeso sono conservati dal kernel e ripristinati alla ripresa.' }
    ],
    domanda: { d: 'Prima di proseguire: due processi distinti scrivono allo stesso indirizzo virtuale. Si disturbano?', o: [
      { t: 'No: ciascuno ha la propria tabella delle pagine', ok: true, fb: 'L’indirizzo è lo stesso, le celle fisiche sono diverse.' },
      { t: 'Sì: l’ultimo che scrive vince', fb: 'Questo accade fra thread dello stesso processo. Fra processi le celle sono distinte.' },
      { t: 'Sì, se eseguono lo stesso programma', fb: 'Anche con lo stesso programma, ogni processo ha la propria memoria.' }
    ] }
  },
  idea: {
    titolo: 'Che cosa è di tutti, che cosa è di ciascuno',
    termini: ['memoria condivisa fra thread', 'sincronizzazione fra thread'],
    testo: [
      'Un programma che prepara una risposta e intanto deve accogliere nuove richieste ha due attività da portare avanti insieme. Può affidarle a due processi, che però sono isolati e faticano a scambiarsi dati. Oppure a due thread dello stesso processo. I thread condividono lo spazio di indirizzamento: una sola tabella delle pagine, e quindi le stesse celle. È una [[memoria condivisa fra thread|memoria condivisa]], e ciò che un thread scrive in una cella, un altro può leggerlo.',
      'Qualcosa però resta di ciascuno. Ogni thread ha i propri registri, con il proprio contatore di programma, e la propria pila, dove tiene le chiamate di funzione e le variabili locali. Quando il processore passa da un thread all’altro avviene un cambio di contesto, come fra processi, più leggero perché la tabella delle pagine resta la stessa.',
      { fig: 'scena', w: 720, h: 152, titolo: 'T1 ha scritto 9 nella cella h, e T2 non ha ancora letto', nota: 'La cella comune è cambiata. Il registro di T2 contiene ancora il suo vecchio valore, 3.', els: SL.unita541.scena('g', SL.unita541.quadri({ x: 9, ord: 'dopo' })[1], { x: 10, y: 0, w: 700, gap: 12, h: 50 }) },
      'Seguiamo un passaggio di dati. T1 e T2 conoscono entrambi l’indirizzo di una cella comune, h. T1 vi scrive 9. La cella cambia subito, per tutti. Il registro r di T2, che conteneva 3, resta com’è: è privato, e nessun altro thread può toccarlo. Diventerà 9 soltanto quando T2 eseguirà la propria istruzione di lettura, copiando h in r.',
      'Resta una questione di ordine. Se T2 leggesse prima della scrittura di T1, troverebbe il valore vecchio. Perché il passaggio funzioni serve un accordo che collochi la lettura dopo la scrittura. Questo accordo sull’ordine degli accessi è la [[sincronizzazione fra thread|sincronizzazione]], e costruirla bene è l’argomento dei prossimi capitoli. Senza, il risultato dipende da chi arriva per primo.'
    ]
  },
  esperimento: {
    faremo: [
      'T1 deve passare un valore a T2 attraverso la cella comune h, che all’inizio contiene 5. Il registro r di T2 contiene 3. Sceglierai il valore, e se la lettura di T2 avviene dopo oppure prima della scrittura di T1.',
      'Seguiremo tre contenitori: il registro di T1, la cella h, il registro di T2. Guarda quando cambia ciascuno, e per opera di chi.'
    ],
    vedrai: [
      ['register', 'I registri', 'Ai lati: il registro r di ciascun thread, con la sua pila. Sono privati.'],
      ['memory', 'La cella comune', 'Al centro: la cella h, raggiungibile da entrambi.']
    ]
  },
  lab: {
    titolo: 'Un valore da un thread all’altro',
    scena: { w: 860, h: 156 },
    atti: ['L’inizio', 'Gli accessi', 'L’esito'],
    controlli: [
      { id: 'x', tipo: 'scelta', eti: 'Valore da passare', opzioni: [[9, '9'], [15, '15'], [40, '40']], valore: 9 },
      { id: 'ord', tipo: 'scelta', eti: 'T2 legge', opzioni: [['dopo', 'dopo la scrittura di T1'], ['prima', 'prima della scrittura di T1']], valore: 'dopo' }
    ],
    nota: 'I passi sono sempre quattro. All’inizio h contiene 5 e il registro di T2 contiene 3.',
    previsione: {
      domanda: (p) => 'La cella comune h contiene 5, e il registro r di T2 contiene 3. T1 scrive ' + p.x + ' in h. T2 copia h nel proprio registro ' + (p.ord === 'dopo' ? 'dopo' : 'prima di') + ' questa scrittura. Quanto vale alla fine il registro r di T2?',
      opzioni: (p) => [[3, '3, come all’inizio'], [5, '5'], [p.x, String(p.x)]]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Il registro di T2 vale ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 3 ? 'T2 ha eseguito la propria lettura, e il registro ha preso il contenuto di h in quel momento.' : p.ord === 'dopo' ? 'La lettura è avvenuta dopo la scrittura, e ha trovato il valore nuovo.' : 'La lettura è avvenuta prima della scrittura, e ha trovato il valore vecchio.'),
    costruisci(p) {
      const U = SL.unita541, Q = U.quadri(p), passi = [], dopo = p.ord === 'dopo', v = U.letto(p);
      const P = (k, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Cella h', String(Q[k].h), 'a'], ['r di T1', String(Q[k].r1)], ['r di T2', String(Q[k].r2), 'c']], els: U.scena('q', Q[k], { x: 20, y: 0, w: 820, gap: 14, h: 52 }) }, extra));

      P(0, 0, 'Due thread, una cella', 'T1 e T2 appartengono allo stesso processo, e conoscono entrambi l’indirizzo della cella h, che contiene 5. T1 ha nel proprio registro il valore da passare, ' + p.x + '. Il registro di T2 contiene 3.', {});
      if (dopo) {
        P(1, 1, 'T1 scrive', 'T1 copia il proprio registro nella cella h, che ora contiene ' + p.x + '. La cella è comune, e il cambiamento vale per tutti i thread del processo.', { calc: 'h ← ' + p.x, chiedi: { d: 'Il registro r di T2 è cambiato con questa scrittura?', o: ['Sì: ora vale ' + p.x, 'No: vale ancora 3'], g: 1, no: 'I registri sono privati. La scrittura di T1 ha toccato soltanto la cella h.' } });
        P(3, 1, 'T2 legge', 'La sincronizzazione garantisce che T2 legga dopo la scrittura. T2 esegue la propria istruzione di lettura, e copia h nel registro: ' + p.x + '.', { calc: 'r di T2 ← h = ' + p.x });
        P(3, 2, 'Il passaggio è riuscito', 'Il valore ' + p.x + ' è passato da T1 a T2 attraverso la cella comune. Sono servite due istruzioni, una per thread, nell’ordine giusto.', { esito: ['r di T2 = ' + v, 'si'] });
      } else {
        P(1, 1, 'T2 legge troppo presto', 'Nessun accordo regola l’ordine, e questa volta T2 arriva per primo. Copia h nel proprio registro, e trova il valore che c’era: 5.', { calc: 'r di T2 ← h = 5' });
        P(2, 1, 'T1 scrive', 'Soltanto ora T1 copia ' + p.x + ' nella cella h. La cella è aggiornata, ma T2 ha già letto.', { calc: 'h ← ' + p.x, chiedi: { d: 'Il registro r di T2 si aggiorna da solo al nuovo valore di h?', o: ['Sì', 'No: resta 5'], g: 1, no: 'Il registro cambia soltanto quando T2 esegue un’altra lettura.' } });
        P(3, 2, 'Il passaggio è fallito', 'T2 lavora con 5, un valore superato, mentre h contiene ' + p.x + '. Nessuna istruzione ha sbagliato. È sbagliato l’ordine, che nessuno aveva fissato.', { esito: ['r di T2 = ' + v, 'no'] });
      }
      return { passi, esito: v };
    }
  },
  bilancio: {
    regola: [
      'I thread di un processo condividono la memoria. Registri, contatore di programma e pila sono privati di ciascun thread.',
      'Un dato passa da un thread all’altro attraverso una cella comune, con una scrittura e una lettura. La sincronizzazione fissa l’ordine fra le due.'
    ],
    errori: [
      ['Pensare che una scrittura nella cella comune aggiorni i registri degli altri thread.', 'I registri cambiano soltanto con le istruzioni del thread a cui appartengono.'],
      ['Dare per scontato l’ordine fra due thread.', 'Senza sincronizzazione, chi esegue per primo dipende dallo scheduler.'],
      ['Trattare i thread come processi.', 'I processi hanno memorie separate. I thread di un processo ne hanno una sola.']
    ],
    saFare: ['Elencare ciò che i thread condividono e ciò che è privato.', 'Seguire un valore da un registro a una cella comune e a un altro registro.', 'Spiegare a che cosa serve la sincronizzazione.'],
    esercizi: [
      { d: 'Una cella comune contiene 20. Il thread T1 vi scrive 35. Poi il thread T2 la copia nel proprio registro, che conteneva 8. Quanto vale il registro di T2?', segnaposto: 'Un numero', giuste: ['35', 'trentacinque'],
        ok: 'T2 legge dopo la scrittura, e trova 35.',
        diagnosi: [
          { se: ['20', 'venti'], msg: 'Venti era il contenuto prima della scrittura di T1. T2 legge dopo.' },
          { se: ['8', 'otto'], msg: 'Otto era il contenuto del registro prima della lettura, che lo sostituisce.' }
        ],
        altro: 'Il valore è diverso. Si segua la cella: prima la scrittura di T1, poi la lettura di T2.',
        indizi: ['Dopo la scrittura la cella contiene 35.', 'T2 copia la cella nel registro.', 'Il registro vale 35.'],
        svolgimento: ['Cella: 20, poi 35.', 'Registro di T2: 8, poi 35.'] },
      { d: 'Nella stessa situazione l’ordine si inverte: T2 copia la cella nel proprio registro, e soltanto dopo T1 vi scrive 35. Quanto vale il registro di T2?', segnaposto: 'Un numero', giuste: ['20', 'venti'],
        ok: 'T2 ha letto quando la cella conteneva ancora 20.',
        diagnosi: [
          { se: ['35', 'trentacinque'], msg: 'La scrittura è avvenuta dopo la lettura. Il registro non si aggiorna da solo.' },
          { se: ['8', 'otto'], msg: 'La lettura ha sostituito l’8 con il contenuto della cella.' }
        ],
        altro: 'Il valore è diverso. Ci si chieda che cosa conteneva la cella nel momento della lettura.',
        indizi: ['La lettura viene per prima.', 'In quel momento la cella contiene 20.', 'Il registro vale 20, e resta tale.'],
        svolgimento: ['Lettura di T2: registro = 20.', 'Scrittura di T1: cella = 35.', 'Registro di T2: ancora 20.'] },
      { d: 'Quale di questi elementi è privato di ciascun thread?', guida: 'Si scelga la risposta.', o: [
        { t: 'La pila', ok: true, fb: 'Ogni thread ha la propria pila, con le proprie chiamate e variabili locali.' },
        { t: 'La tabella delle pagine', fb: 'È una sola per tutto il processo.' },
        { t: 'I file aperti', fb: 'Appartengono al processo, e tutti i suoi thread li usano.' }] }
    ],
    sfida: ['cslez5_4_01_threads', 'Risorse condivise e stato privato']
  }
});
