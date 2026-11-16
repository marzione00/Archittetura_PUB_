'use strict';
SL.unita542 = (() => {
  const durata = (p) => Math.ceil(p.n / p.k);
  // griglia: una riga per core, una colonna per millisecondo; «fatti» colonne visibili
  const griglia = (pre, p, fatti, o) => {
    const el = SL.el, els = [], T = durata(p);
    for (let c = 0; c < p.k; c++) {
      els.push(el.nota(pre + 'n' + c, o.x, o.y + c * 40 + 8, 'core ' + c, 'mono'));
      for (let t = 0; t < 8; t++) { const i = t * p.k + c, c_e = i < p.n, vis = t < fatti; els.push(el.cella(pre + c + 't' + t, o.x + 76 + t * (o.wc + 4), o.y + c * 40, o.wc, 32, vis && t < T ? (c_e ? 'T' + (i + 1) : '·') : '', !vis || t >= T ? '' : c_e ? (t === fatti - 1 && !o.fine ? 'att' : 'on') : 'err', Object.assign({ piccola: true }, c === p.k - 1 ? { gi: String(t) } : {}))); }
    }
    return els;
  };
  return { durata, griglia };
})();
SL.registra('5.4.2', {
  titolo: 'Concorrenza ed esecuzione simultanea',
  obiettivo: 'Obiettivo: distinguere la concorrenza dal parallelismo, e calcolare il tempo impiegato da più thread indipendenti su un dato numero di core.',
  concetti: [['thread', 'Intervalli di vita sovrapposti'], ['cpu', 'Esecuzione nel medesimo istante'], ['clock', 'Il numero dei gruppi fissa la durata']],
  filigrana: ['thread', 'cpu', 'clock'],
  richiami: {
    carte: [
      { sim: 'cpu', da: 'Dall’unità 5.3.5', t: 'Il core', d: 'Un’unità di calcolo del processore. Ogni core esegue un flusso per volta.' },
      { sim: 'thread', da: 'Dall’unità 5.4.1', t: 'I thread di un processo', d: 'Più flussi di istruzioni che condividono la memoria.' },
      { sim: 'coda', da: 'Dall’unità 5.3.3', t: 'Il round-robin', d: 'Su un solo core i lavori avanzano a turno.' }
    ],
    domanda: { d: 'Prima di proseguire: su un solo core, due thread possono eseguire nel medesimo istante?', o: [
      { t: 'No, si alternano', ok: true, fb: 'Un core esegue un flusso per volta. I due thread avanzano a turno.' },
      { t: 'Sì, se appartengono al medesimo processo', fb: 'Anche i thread del medesimo processo richiedono ciascuno un core.' },
      { t: 'Sì, con un time slice sufficientemente breve', fb: 'Un time slice breve li alterna rapidamente, e produce soltanto l’apparenza di un’esecuzione simultanea.' }
    ] }
  },
  idea: {
    titolo: 'Sovrapposizione nel tempo e simultaneità nell’istante',
    termini: ['concorrenza', 'parallelismo'],
    testo: [
      'Due termini sono spesso confusi. Due thread sono concorrenti quando i loro intervalli di vita si sovrappongono: il secondo ha inizio prima che il primo sia terminato. La [[concorrenza]] è una proprietà del programma, e vale anche su un solo core, dove i thread avanzano a turno. Il [[parallelismo]] è una proprietà dell’esecuzione: due thread eseguono in parallelo quando, nel medesimo istante, ciascuno occupa un core.',
      'La concorrenza può esistere senza parallelismo, e comporta già tutte le difficoltà dei capitoli seguenti, poiché due thread che si alternano possono interferire quanto due thread in esecuzione simultanea. Il parallelismo aggiunge la velocità, in misura dipendente dal numero di core.',
      { fig: 'scena', w: 720, h: 122, titolo: 'Cinque thread da 1 ms su due core', nota: 'In ogni millisecondo eseguono al più due thread. Il quinto è l’unico nel terzo millisecondo, e un core è libero.', els: SL.unita542.griglia('g', { n: 5, k: 2 }, 8, { x: 10, y: 8, wc: 72, fine: true }) },
      'Si consideri un calcolo. Cinque thread indipendenti sono pronti insieme, e ciascuno richiede 1 ms di calcolo. Con due core, nel primo millisecondo eseguono i primi due, nel secondo altri due. Il quinto, pronto fin dall’inizio, deve attendere il terzo millisecondo, in cui un core resta libero, per un totale di 3 ms. Con un solo core ne occorrerebbero 5, mentre con otto core sarebbe sufficiente 1 ms, e tre core resterebbero senza lavoro.',
      'La regola consiste nel contare i gruppi, cioè il numero di volte in cui occorre riempire i core per esaurire i thread. Si tratta del quoziente fra thread e core, arrotondato per eccesso, poiché anche un gruppo incompleto occupa il proprio millisecondo. La regola vale per lavori indipendenti e di uguale durata. Se i thread dovessero attendersi a vicenda, i core aggiuntivi sarebbero di scarsa utilità.'
    ]
  },
  esperimento: {
    faremo: [
      'Alcuni thread indipendenti sono pronti all’istante 0, e ciascuno richiede 1 ms. I controlli fissano il numero dei thread e il numero dei core.',
      'L’esperimento riempie i core un millisecondo alla volta. È istruttivo mantenere fisso il numero dei thread e raddoppiare i core, per verificare se il tempo si dimezza in ogni caso.'
    ],
    vedrai: [
      ['cpu', 'I core nel tempo', 'Una riga per core, una colonna per millisecondo. Ogni cella mostra il thread in esecuzione. Una cella rossa con un puntino è un core rimasto libero.']
    ]
  },
  lab: {
    titolo: 'Thread e core',
    scena: { w: 860, h: 204 },
    atti: ['I thread', 'I gruppi', 'La durata'],
    controlli: [
      { id: 'n', tipo: 'scelta', eti: 'Thread', opzioni: [[3, '3'], [5, '5'], [8, '8']], valore: 5 },
      { id: 'k', tipo: 'scelta', eti: 'Core', opzioni: [[1, '1'], [2, '2'], [4, '4']], valore: 2 }
    ],
    nota: 'Il numero dei passi dipende dalla durata. I thread sono indipendenti e richiedono 1 ms ciascuno.',
    previsione: {
      domanda: (p) => p.n + ' thread indipendenti sono pronti insieme, e ciascuno richiede 1 ms di calcolo. I core disponibili sono ' + p.k + '. Dopo quanti millisecondi hanno terminato tutti?',
      opzioni: (p) => Array.from(new Set([1, Math.max(1, Math.floor(p.n / p.k)), Math.ceil(p.n / p.k), p.n])).sort((a, b) => a - b).map((v) => [v, v + ' ms'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' ms. I thread terminano in ' + esito + ' ms. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.n && p.k > 1 ? 'Con ' + p.k + ' core, in ogni millisecondo eseguono fino a ' + p.k + ' thread.' : pred < esito ? 'In un millisecondo eseguono al più ' + p.k + ' thread, e anche l’ultimo gruppo, se incompleto, occupa il proprio millisecondo.' : 'I gruppi da ' + p.k + ' necessari sono ' + esito + '.'),
    costruisci(p) {
      const U = SL.unita542, el = SL.el, T = U.durata(p), passi = [], resto = p.n % p.k;
      const quadro = (fatti, fine) => [el.nota('t0', 20, 0, 'CORE · una colonna per millisecondo', 'mono')].concat(U.griglia('q', p, fatti, { x: 20, y: 24, wc: 84, fine }));
      const P = (fatti, fine, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Thread terminati', Math.min(p.n, fatti * p.k) + ' di ' + p.n, 'a'], ['Insieme, al più', String(Math.min(p.n, p.k))], ['Durata', fine ? T + ' ms' : '·', 'c']], els: quadro(fatti, fine) }, extra));

      P(0, false, 0, 'I thread pronti', p.n + ' thread, da T1 a T' + p.n + ', sono pronti all’istante 0. Sono concorrenti, poiché esistono tutti insieme. Il numero di quelli che possono eseguire in parallelo dipende dai core, che sono ' + p.k + '.', {});
      for (let t = 0; t < T; t++) { const da = t * p.k + 1, a = Math.min(p.n, (t + 1) * p.k), quanti = a - da + 1; P(t + 1, false, 1, 'Millisecondo ' + t, (quanti === 1 ? 'Esegue T' + da + '.' : 'Eseguono i thread da T' + da + ' a T' + a + ', uno per core.') + (quanti < p.k ? ' I thread pronti sono esauriti: ' + (p.k - quanti === 1 ? 'un core resta libero.' : (p.k - quanti) + ' core restano liberi.') : a < p.n ? ' Gli altri ' + (p.n - a) + ' attendono, pur essendo pronti.' : ''), Object.assign({ calc: 'gruppo ' + (t + 1) + ': ' + quanti + (quanti === 1 ? ' thread' : ' thread') }, t === 0 && T > 1 ? { chiedi: { d: 'I thread rimasti in attesa sono concorrenti con quelli in esecuzione?', o: ['Sì, i loro intervalli di vita si sovrappongono', 'No, poiché non sono in esecuzione'], g: 0, no: 'Concorrenti significa esistenti nel medesimo periodo. L’esecuzione nel medesimo istante è il parallelismo.' } } : {})); }
      P(T, true, 2, 'La durata', 'Sono stati necessari ' + T + (T === 1 ? ' gruppo' : ' gruppi') + ' da ' + p.k + ': ' + p.n + ' ÷ ' + p.k + (resto === 0 ? ' = ' + T + ' esatti.' : ' dà ' + Math.floor(p.n / p.k) + ' con resto ' + resto + ', e il gruppo incompleto conta per intero.') + ' La durata è ' + T + ' ms' + (p.k === 1 ? ': con un solo core è presente la concorrenza, senza alcun parallelismo.' : '.'), { calc: p.n + ' ÷ ' + p.k + ', per eccesso = ' + T + ' ms', esito: [T + ' ms', ''] });
      return { passi, esito: T };
    }
  },
  bilancio: {
    regola: [
      'Concorrenza: più thread esistenti nel medesimo periodo. Parallelismo: più thread in esecuzione nel medesimo istante, su core diversi.',
      'Con thread indipendenti di uguale durata, pronti insieme: durata = thread ÷ core, arrotondato per eccesso, moltiplicato per la durata di ciascuno.'
    ],
    errori: [
      ['Impiegare concorrenza e parallelismo come sinonimi.', 'Su un solo core i thread sono concorrenti e non eseguono mai in parallelo.'],
      ['Arrotondare per difetto il numero dei gruppi.', 'Un gruppo incompleto occupa comunque un intervallo intero.'],
      ['Attendersi che il raddoppio dei core dimezzi sempre il tempo.', 'Oltre il numero dei thread pronti, i core aggiuntivi restano liberi.']
    ],
    saFare: ['Distinguere concorrenza e parallelismo.', 'Calcolare la durata di più thread su più core.', 'Riconoscere i casi in cui i core aggiuntivi sono inutili.'],
    esercizi: [
      { d: 'Undici thread indipendenti, da 1 ms ciascuno, sono pronti insieme su 4 core. Dopo quanti millisecondi hanno terminato tutti?', segnaposto: 'Un numero', giuste: ['3', '3ms', 'tre'],
        ok: 'Due gruppi completi servono 8 thread, e i 3 residui occupano un terzo millisecondo.',
        diagnosi: [
          { se: ['2', '2ms'], msg: 'Due millisecondi servono 8 thread. Ne restano 3.' },
          { se: ['11', '11ms'], msg: 'Undici millisecondi occorrerebbero con un solo core.' },
          { se: ['2.75'], msg: 'Il gruppo incompleto occupa comunque un millisecondo intero.' }
        ],
        altro: 'Il numero è diverso. Si dividano i thread per i core e si arrotondi per eccesso.',
        indizi: ['In ogni millisecondo eseguono 4 thread.', 'Dopo 2 ms ne restano 3.', 'Occorre un terzo millisecondo.'],
        svolgimento: ['Millisecondo 0: 4 thread.', 'Millisecondo 1: 4 thread.', 'Millisecondo 2: 3 thread.', 'Durata: 3 ms.'] },
      { d: 'Tre thread indipendenti, da 1 ms ciascuno, eseguono su 8 core. Quanti core restano senza lavoro?', segnaposto: 'Un numero', giuste: ['5', 'cinque'],
        ok: 'I thread pronti sono soltanto 3: gli altri 5 core non hanno nulla da eseguire.',
        diagnosi: [
          { se: ['0', 'zero'], msg: 'Un thread occupa un solo core. Tre thread non possono impegnarne otto.' },
          { se: ['3', 'tre'], msg: 'Tre sono i core occupati. La domanda riguarda quelli liberi.' }
        ],
        altro: 'Il numero è diverso. Si sottraggano dai core i thread pronti.',
        indizi: ['Ogni thread occupa un core.', 'I core occupati sono 3.', '8 − 3 = 5.'],
        svolgimento: ['Core: 8.', 'Thread pronti: 3.', 'Core liberi: 5.'] },
      { d: 'Un programma ha due thread ed è eseguito su un calcolatore con un solo core. Quale affermazione è corretta?', guida: 'Si scelga la risposta.', o: [
        { t: 'I thread sono concorrenti, senza mai eseguire in parallelo', ok: true, fb: 'Esistono insieme e si alternano sull’unico core.' },
        { t: 'I thread eseguono in parallelo, a turni brevi', fb: 'L’alternanza è diversa dall’esecuzione nel medesimo istante.' },
        { t: 'Il secondo thread ha inizio soltanto al termine del primo', fb: 'Lo scheduler li alterna, e i loro intervalli di vita si sovrappongono.' }] }
    ],
    sfida: ['cslez5_4_02_threads', 'Concorrenza, parallelismo e isolamento']
  }
});
