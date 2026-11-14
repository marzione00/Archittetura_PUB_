'use strict';
SL.unita571 = (() => {
  // Processi: possiede e chiede. Risorse: istanze totali. La riduzione fa terminare chi può finire.
  const iniziale = (caso) => ({
    ist: { X: 1, Y: caso === 'una' ? 1 : 2 },
    proc: caso === 'una' ? { A: { ha: ['X'], vuole: 'Y' }, B: { ha: ['Y'], vuole: 'X' } }
      : { A: { ha: ['X'], vuole: 'Y' }, B: { ha: ['Y'], vuole: 'X' }, C: { ha: ['Y'], vuole: caso === 'chiede' ? 'X' : '' } }
  });
  const libere = (g, finiti) => { const l = { X: g.ist.X, Y: g.ist.Y }; Object.keys(g.proc).forEach((n) => { if (finiti.indexOf(n) < 0) g.proc[n].ha.forEach((r) => { l[r]--; }); }); return l; };
  // Ordine di completamento ottenuto riducendo il grafo; chi resta fuori è bloccato per sempre
  const riduci = (caso) => { const g = iniziale(caso), finiti = []; let mosso = true; while (mosso) { mosso = false; for (const n of Object.keys(g.proc)) { if (finiti.indexOf(n) >= 0) continue; const v = g.proc[n].vuole; if (!v || libere(g, finiti)[v] > 0) { finiti.push(n); mosso = true; break; } } } return { ordine: finiti, bloccati: Object.keys(g.proc).filter((n) => finiti.indexOf(n) < 0) }; };
  const esito = (caso) => (riduci(caso).bloccati.length ? 'blocco' : 'completa');
  // f: finiti (elenco) · ciclo: evidenzia il ciclo · acc: nodo acceso · serve: richiesta soddisfatta in questo passo
  const quadro = (pre, caso, f, o) => {
    const el = SL.el, els = [], g = iniziale(caso), finiti = f.finiti || [], lib = libere(g, finiti), k = o.k || 1, bw = 200 * k, bh = 54;
    if (f.serve) lib[g.proc[f.serve].vuole]--;
    const P = { A: [o.x, o.y + 85], B: [o.x + o.w - bw, o.y + 85], C: [o.x + (o.w - bw) / 2, o.y + 85] }, R = { Y: [o.x + (o.w - bw) / 2, o.y], X: [o.x + (o.w - bw) / 2, o.y + 170] };
    const ancora = (n, verso) => { const q = P[n]; return n === 'C' ? [q[0] + bw / 2, verso === 'Y' ? q[1] : q[1] + bh] : n === 'A' ? [q[0] + bw, verso === 'Y' ? q[1] + 12 : q[1] + bh - 12] : [q[0], verso === 'Y' ? q[1] + 12 : q[1] + bh - 12]; };
    const presa = (r, n) => { const q = R[r]; return n === 'C' ? [q[0] + bw / 2, r === 'Y' ? q[1] + bh : q[1]] : n === 'A' ? [q[0], r === 'Y' ? q[1] + bh - 12 : q[1] + 12] : [q[0] + bw, r === 'Y' ? q[1] + bh - 12 : q[1] + 12]; };
    Object.keys(g.proc).forEach((n) => {
      const p = g.proc[n], fin = finiti.indexOf(n) >= 0, inCiclo = n !== 'C';
      if (!fin) p.ha.forEach((r) => { const a = presa(r, n), b = ancora(n, r); els.push(el.linea(pre + 'h' + n + r, a[0], a[1], b[0], b[1], f.ciclo && inCiclo ? 'err' : 'on')); });
      if (!fin && p.vuole && f.serve === n) { const a = presa(p.vuole, n), b = ancora(n, p.vuole); els.push(el.linea(pre + 'v' + n, a[0], a[1], b[0], b[1], 'att')); }
      if (!fin && p.vuole && !(f.serve === n)) { const a = ancora(n, p.vuole), b = presa(p.vuole, n); els.push(el.linea(pre + 'v' + n, a[0], a[1], b[0], b[1], f.ciclo && inCiclo ? 'err' : 'att', true)); }
      const stato = fin ? 'ha terminato' : f.serve === n ? 'riceve ' + p.vuole : !p.vuole ? 'ha quanto gli occorre' : 'attende ' + p.vuole;
      els.push(el.box(pre + 'p' + n, P[n][0], P[n][1], bw, bh, 'processo ' + n, stato, fin ? '' : f.acc === n ? 'att' : f.fermi && f.fermi.indexOf(n) >= 0 ? 'err' : 'on', { cls: 'stretta' }));
    });
    ['Y', 'X'].forEach((r) => els.push(el.box(pre + 'r' + r, R[r][0], R[r][1], bw, bh, 'risorsa ' + r + ' · istanze ' + g.ist[r], 'libere ' + lib[r], f.acc === r ? 'att' : lib[r] > 0 ? 'on' : 'zero', { cls: 'stretta' })));
    if (caso === 'una' && f.ciclo) els.push(el.nota(pre + 'c', P.C[0] + 6, P.C[1] + 16, 'A → Y → B → X → A', 'mono', 'err'));
    return els;
  };
  return { iniziale, libere, riduci, esito, quadro };
})();
SL.registra('5.7.1', {
  titolo: 'Il deadlock come struttura di dipendenze',
  obiettivo: 'Obiettivo: leggere un grafo di assegnazione, individuarvi un ciclo, e stabilire se tale ciclo è un deadlock in base al numero delle istanze e ai processi che possono ancora terminare.',
  concetti: [['stallo', 'Un ciclo di richieste e possessi'], ['tabella', 'Il numero delle istanze di una risorsa'], ['riproduci', 'La riduzione del grafo, un processo per volta']],
  filigrana: ['stallo', 'tabella', 'process'],
  richiami: {
    carte: [
      { sim: 'stallo', da: 'Dall’unità 5.6.2', t: 'Il deadlock', d: 'Due o più thread si attendono a vicenda, e nessun evento futuro può sbloccarli.' },
      { sim: 'lucchetto', da: 'Dall’unità 5.6.5', t: 'Le frecce di attesa', d: 'Una freccia va dal thread in attesa al thread che possiede la risorsa attesa. Due frecce opposte formano un ciclo.' },
      { sim: 'semaforo', da: 'Dall’unità 5.5.6', t: 'Più permessi', d: 'Una risorsa può ammettere più utilizzatori insieme: il semaforo ne conta i permessi.' }
    ],
    domanda: { d: 'Prima di proseguire: A possiede il lock X e attende Y. B possiede Y e ha terminato il proprio lavoro: sta per rilasciarlo. Si tratta di un deadlock?', o: [
      { t: 'No, B rilascerà Y, e A potrà proseguire', ok: true, fb: 'L’attesa di A ha un termine, poiché il possessore di Y può ancora procedere.' },
      { t: 'Sì, A è bloccato', fb: 'Il blocco di un thread è ordinario. In un deadlock è bloccato anche il thread che dovrebbe sbloccarlo.' },
      { t: 'Dipende dal numero di core', fb: 'Il numero dei core modifica i tempi, e lascia invariate le dipendenze.' }
    ] }
  },
  idea: {
    titolo: 'La rappresentazione di possessi e attese',
    termini: ['grafo di assegnazione', 'istanza di una risorsa'],
    testo: [
      'Nel capitolo precedente il deadlock è comparso in due forme, il buffer e la coppia di lock, e in entrambe è stato riconosciuto con un’analisi del caso specifico. Occorre uno strumento che operi sempre nel medesimo modo, qualunque sia il numero dei processi e delle risorse. Tale strumento è un grafo.',
      'Il grafo prende il nome di [[grafo di assegnazione]]. Contiene due tipi di nodi, i processi e le risorse, e due tipi di frecce. Una freccia da un processo a una risorsa è una richiesta: il processo attende quella risorsa. Una freccia da una risorsa a un processo è un’assegnazione: il processo la possiede. Nelle figure di questa unità le richieste sono linee tratteggiate, e le assegnazioni linee continue.',
      { fig: 'scena', w: 720, h: 236, titolo: 'Una X e una Y: le frecce tornano al punto di partenza', nota: 'A possiede X e richiede Y. B possiede Y e richiede X. Lungo le linee si torna ad A: si tratta di un ciclo.', els: SL.unita571.quadro('g', 'una', { ciclo: true, fermi: ['A', 'B'] }, { x: 10, y: 4, w: 700 }) },
      'Si seguano le frecce della figura. A richiede Y, che è assegnata a B, e B richiede X, che è assegnata ad A. Il percorso torna al punto di partenza: il grafo contiene un ciclo. In questo caso il ciclo è un deadlock, poiché di X e di Y esiste un solo esemplare, e i due possessori sono entrambi bloccati.',
      'La conclusione cambia se una risorsa esiste in più esemplari. Ogni esemplare è denominato [[istanza di una risorsa|istanza]]: due stampanti uguali sono due istanze della medesima risorsa, e una richiesta di stampa può essere soddisfatta dall’una o dall’altra. Si supponga che di Y esistano due istanze, e che la seconda appartenga a un terzo processo C, al quale manca soltanto il tempo per terminare. Il ciclo fra A e B è ancora presente nel grafo. Quando tuttavia C termina e rilascia la propria Y, A la ottiene, completa il lavoro e rilascia X, e anche B può completare.',
      'La decisione si ottiene con un procedimento meccanico, la riduzione del grafo. Si individua un processo che possa terminare con le risorse possedute, oppure la cui richiesta sia coperta dalle istanze libere. Tale processo è portato a termine, le sue risorse tornano libere, e il procedimento si ripete. Se al termine tutti i processi sono stati rimossi, il deadlock è escluso, e l’ordine di rimozione è un ordine di completamento possibile. I processi residui sono bloccati indefinitamente. Con una sola istanza per risorsa, ciclo e deadlock coincidono. Con più istanze un ciclo è un indizio, e la riduzione fornisce la risposta.'
    ]
  },
  esperimento: {
    faremo: [
      'Si consideri un grafo con i processi A e B, e le risorse X e Y. I controlli fissano il numero delle istanze di Y, e il comportamento del terzo processo C, quando è presente.',
      'L’esperimento segue anzitutto le frecce alla ricerca di un ciclo, e quindi riduce il grafo: a ogni passo individua un processo in grado di terminare, che rilascia le proprie risorse.'
    ],
    vedrai: [
      ['process', 'I processi', 'A a sinistra, B a destra, C al centro quando esiste. Ogni riquadro indica la risorsa attesa dal processo.'],
      ['tabella', 'Le risorse', 'Y in alto, X in basso, con il numero delle istanze e delle istanze libere.'],
      ['stallo', 'Le linee', 'Linea continua: la risorsa è assegnata al processo. Linea tratteggiata: il processo richiede la risorsa.']
    ]
  },
  lab: {
    titolo: 'Un ciclo nel grafo, e il processo che può risolverlo',
    scena: { w: 860, h: 240 },
    atti: ['Il grafo', 'Il ciclo', 'La riduzione', 'L’esito'],
    controlli: [
      { id: 'caso', tipo: 'scelta', eti: 'Istanze di Y e processo C', opzioni: [['una', 'una sola Y, senza C'], ['finisce', 'due Y: la seconda è di C, che può terminare'], ['chiede', 'due Y: la seconda è di C, che richiede anche X']], valore: 'finisce' }
    ],
    nota: 'Il numero dei passi dipende dal caso. La riduzione esamina i processi in ordine alfabetico.',
    previsione: {
      domanda: (p) => 'Di X esiste una sola istanza, posseduta da A. Di Y ' + (p.caso === 'una' ? 'esiste una sola istanza, posseduta da B' : 'esistono due istanze: una è di B, l’altra di C') + '. A richiede Y, e B richiede X' + (p.caso === 'una' ? '.' : p.caso === 'finisce' ? '. C dispone di tutte le risorse necessarie, e sta per terminare.' : '. Anche C richiede X.') + ' Che cosa accade?',
      opzioni: () => [['completa', 'Tutti i processi completano'], ['blocco', 'Alcuni processi restano bloccati indefinitamente']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava che ' + (pred === 'completa' ? 'tutti completassero' : 'alcuni restassero bloccati') + '. ' + (esito === 'completa' ? 'Tutti completano. ' : 'Si verifica un deadlock. ') + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'completa' ? 'Il ciclo fra A e B esiste. Lo risolve C, che è esterno al ciclo e rilascia un’istanza di Y.' : p.caso === 'una' ? 'Le uniche due istanze appartengono a processi bloccati, e nessun processo esterno al ciclo può rilasciarne una.' : 'La seconda Y appartiene a C, e anche C è bloccato in attesa di X. Nessun possessore può procedere.'),
    costruisci(p) {
      const U = SL.unita571, g = U.iniziale(p.caso), R = U.riduci(p.caso), passi = [], nomi = Object.keys(g.proc);
      const P = (atto, titolo, testo, f, extra) => { const l = U.libere(g, f.finiti || []); if (f.serve) l[g.proc[f.serve].vuole]--; const fermi = nomi.filter((n) => (f.finiti || []).indexOf(n) < 0 && g.proc[n].vuole && f.serve !== n); passi.push(Object.assign({ atto, titolo, testo, hud: [['X libere', String(l.X), 'a'], ['Y libere', String(l.Y), 'c'], ['In attesa', fermi.length ? fermi.join(', ') : 'nessuno']], els: U.quadro('b', p.caso, f, { x: 20, y: 6, w: 820 }) }, extra)); };
      P(0, 'Il grafo', 'A possiede X e richiede Y, mentre B possiede una Y e richiede X.' + (p.caso === 'una' ? ' Di ciascuna risorsa esiste una sola istanza, e nessuna istanza è libera.' : p.caso === 'finisce' ? ' Di Y esistono due istanze, nessuna delle quali è libera: la seconda appartiene a C, che dispone di tutte le risorse necessarie.' : ' Di Y esistono due istanze, nessuna delle quali è libera: la seconda appartiene a C, che richiede anche X.'), {}, {});
      P(1, 'Il percorso delle frecce', 'A richiede Y, e una Y è assegnata a B. B richiede X, e X è assegnata ad A. Le frecce tornano al punto di partenza: il grafo contiene un ciclo.' + (p.caso === 'una' ? '' : ' C è esterno al ciclo.'), { ciclo: true }, { calc: 'A → Y → B → X → A', chiedi: { d: 'Il grafo contiene un ciclo. Il ciclo è sufficiente per concludere che si tratta di un deadlock?', o: p.caso === 'una' ? ['Sì, ogni risorsa ha una sola istanza', 'No, occorrono altri elementi'] : ['No, Y ha due istanze, ed è rilevante il possessore dell’altra', 'Sì, un ciclo è sempre un deadlock'], g: 0, no: p.caso === 'una' ? 'Con una sola istanza per risorsa, un processo del ciclo può essere sbloccato soltanto da altri processi del ciclo.' : 'Con più istanze una richiesta può essere soddisfatta da un possessore esterno al ciclo.' } });
      if (R.ordine.length === 0) {
        P(2, 'I processi che possono terminare', nomi.map((n) => n + ' attende ' + g.proc[n].vuole + ', e le istanze libere di ' + g.proc[n].vuole + ' sono 0.').join(' ') + ' Nessun processo può terminare, e quindi nessuna risorsa sarà rilasciata.', { fermi: nomi, ciclo: true }, { calc: 'nessun processo può terminare' });
      } else {
        const finiti = [];
        R.ordine.forEach((n) => {
          const v = g.proc[n].vuole, prima = finiti.slice();
          finiti.push(n);
          const dopo = U.libere(g, finiti);
          if (!v) P(2, n + ' termina', n + ' dispone di tutte le risorse necessarie, e termina. Le sue risorse tornano libere: ' + g.proc[n].ha.join(', ') + '.', { finiti: finiti.slice(), acc: g.proc[n].ha[0] }, { calc: 'libere: X ' + dopo.X + ' · Y ' + dopo.Y });
          else { P(2, n + ' riceve ' + v, 'Un’istanza di ' + v + ' è libera, e la richiesta di ' + n + ' può essere soddisfatta. ' + n + ' dispone ora di tutte le risorse necessarie.', { finiti: prima, serve: n, acc: n }, { calc: n + ' riceve ' + v });
            P(2, n + ' termina', n + ' completa il lavoro e rilascia tutte le risorse possedute.', { finiti: finiti.slice(), acc: g.proc[n].ha[0] }, { calc: 'libere: X ' + dopo.X + ' · Y ' + dopo.Y }); }
        });
      }
      const bl = R.bloccati;
      P(3, 'L’esito', bl.length ? (bl.length === 2 ? 'A e B' : 'A, B e C') + ' restano nel grafo, e nessuno di essi può più procedere: si tratta di un deadlock. ' + (p.caso === 'una' ? 'Con una sola istanza per risorsa il ciclo era sufficiente a prevederlo.' : 'La seconda istanza di Y esiste, e il suo possessore è bloccato come gli altri.') : 'La riduzione ha rimosso tutti i processi, nell’ordine ' + R.ordine.join(', ') + '. Il ciclo fra A e B era presente nel grafo, e un rilascio esterno lo ha risolto.', { finiti: R.ordine.slice(), fermi: bl, ciclo: bl.length > 0 }, { esito: [bl.length ? 'deadlock: ' + bl.join(', ') : 'completano: ' + R.ordine.join(', '), bl.length ? 'no' : 'si'] });
      return { passi, esito: U.esito(p.caso) };
    }
  },
  bilancio: {
    regola: [
      'Grafo di assegnazione: una freccia da processo a risorsa è una richiesta, una freccia da risorsa a processo è un’assegnazione.',
      'Con una sola istanza per risorsa, un ciclo è un deadlock. Con più istanze si riduce il grafo: restano bloccati i processi che la riduzione lascia nel grafo.'
    ],
    errori: [
      ['Concludere «deadlock» da ogni ciclo.', 'Con più istanze, un possessore esterno al ciclo può rilasciare la risorsa necessaria.'],
      ['Definire deadlock ogni attesa.', 'Una catena di attese che termina in un processo in grado di terminare si risolve senza interventi.'],
      ['Considerare soltanto i processi del ciclo.', 'Sono rilevanti anche i processi esterni: quelli che possono rilasciare, e quelli che attendono una risorsa del ciclo.']
    ],
    saFare: ['Rappresentare richieste e assegnazioni in un grafo.', 'Determinare un ciclo seguendo le frecce.', 'Ridurre il grafo per stabilire la presenza di un deadlock.'],
    esercizi: [
      { d: 'In un grafo di assegnazione, che cosa indica una freccia da un processo a una risorsa?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il processo richiede la risorsa, ed è in attesa', ok: true, fb: 'È una richiesta ancora da soddisfare.' },
        { t: 'Il processo possiede la risorsa', fb: 'Il possesso è la freccia opposta, dalla risorsa al processo.' },
        { t: 'Il processo ha rilasciato la risorsa', fb: 'Un rilascio cancella una freccia di assegnazione, senza aggiungerne altre.' }] },
      { d: 'Ogni risorsa ha una sola istanza. A possiede X e richiede Y. B possiede Y e richiede Z. C possiede Z e dispone di tutte le risorse necessarie. Quanti processi restano bloccati indefinitamente?', segnaposto: 'Un numero', giuste: ['0', 'zero', 'nessuno'],
        ok: 'C termina e rilascia Z, quindi termina B, quindi A. Si tratta di una catena, e una catena si risolve a partire dall’ultimo elemento.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'A e B attendono, e la loro attesa ha un termine: C può terminare e rilasciare Z.' },
          { se: ['3', 'tre'], msg: 'C dispone di tutte le risorse necessarie, e può terminare.' },
          { se: ['1', 'uno'], msg: 'La riduzione del grafo mostra che dopo C può terminare B, e dopo B anche A.' }
        ],
        altro: 'Il numero è diverso. Si individui un processo che possa terminare, lo si porti a termine, e si ripeta il procedimento.',
        indizi: ['C può terminare, e rilascia Z.', 'Con Z libera termina B, e rilascia Y.', 'Con Y libera termina A.'],
        svolgimento: ['Termina C.', 'Termina B.', 'Termina A.', 'Bloccati indefinitamente: 0.'] },
      { d: 'Un grafo contiene un ciclo, e una delle risorse del ciclo ha due istanze. Che cosa si può concludere?', guida: 'Si scelga la risposta.', o: [
        { t: 'Occorre ridurre il grafo, poiché il solo ciclo lascia indeterminata la risposta', ok: true, fb: 'La seconda istanza può appartenere a un processo in grado di terminare.' },
        { t: 'È certamente un deadlock', fb: 'Sarebbe vero con una sola istanza per risorsa.' },
        { t: 'Il deadlock è certamente escluso', fb: 'Anche il possessore della seconda istanza potrebbe essere bloccato.' }] }
    ],
    sfida: ['cslez5_7_03_deadlock', 'Cicli nel grafo delle risorse']
  }
});
