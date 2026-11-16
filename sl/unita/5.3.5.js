'use strict';
SL.unita535 = (() => {
  const conto = (p) => { const c0 = p.n - p.k, c1 = 1 + p.k, fine = Math.max(c0, c1); return { c0, c1, fine, ozio: 2 * fine - (p.n + 1), tot: p.n + 1 }; };
  // fase: 0 le code · 1 lo spostamento · 2 l'esecuzione · 3 il conto
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], c = conto(p), q0 = f >= 1 ? c.c0 : p.n, q1 = f >= 1 ? c.c1 : 1, fine = Math.max(q0, q1);
    [[q0, 'CORE 0'], [q1, 'CORE 1']].forEach((r, j) => {
      els.push(el.nota(pre + 't' + j, o.x, o.y + j * 90, r[1] + ' · ' + r[0] + (r[0] === 1 ? ' processo' : ' processi') + ' in coda', 'mono'));
      for (let k = 0; k < 8; k++) { const lav = k < r[0], spost = j === 1 && f === 1 && k >= 1 && k < r[0], ozio = !lav && k < fine && f >= 2; els.push(el.cella(pre + j + 'c' + k, o.x + k * (o.wc + 4), o.y + 24 + j * 90, o.wc, 34, lav ? 'L' : ozio ? 'libero' : '', lav ? (spost ? 'att' : 'on') : ozio ? 'err' : '', { gi: String(k), piccola: true })); }
    });
    return els;
  };
  return { conto, quadro };
})();
SL.registra('5.3.5', {
  titolo: 'Scheduling su più CPU',
  obiettivo: 'Obiettivo: calcolare l’istante in cui termina un gruppo di processi distribuiti su due core, e il tempo di calcolo che resta inutilizzato se le code sono sbilanciate.',
  concetti: [['cpu', 'Più core, più code'], ['bilancio', 'Code lunghe e code corte'], ['coda', 'Il trasferimento di processi fra le code']],
  filigrana: ['cpu', 'coda', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'coda', da: 'Dall’unità 5.1.2', t: 'La coda dei pronti', d: 'L’elenco dei processi a cui manca soltanto il processore.' },
      { sim: 'bus', da: 'Dall’unità 4.4.2', t: 'Risorse che operano insieme', d: 'Due collegamenti indipendenti sommano le loro capacità.' },
      { sim: 'clock', da: 'Dall’unità 5.3.3', t: 'Il tempo di completamento', d: 'L’istante in cui un processo è terminato.' }
    ],
    domanda: { d: 'Prima di proseguire: due collegamenti indipendenti trasferiscono un blocco al secondo ciascuno. Il primo ha 6 blocchi in coda, il secondo 1. Dopo quanti secondi sono stati trasferiti tutti?', o: [
      { t: '6', ok: true, fb: 'È determinante la coda più lunga. Il secondo collegamento resta libero per 5 secondi.' },
      { t: '7', fb: 'I due collegamenti operano insieme: l’ultimo blocco è trasferito quando si esaurisce la coda più lunga.' },
      { t: '4', fb: 'Quattro secondi sarebbero sufficienti se i blocchi cambiassero coda. In questo caso ciascun blocco resta nella propria.' }
    ] }
  },
  idea: {
    titolo: 'Due core, e il processo concentrato su una coda',
    termini: ['core', 'bilanciamento del carico', 'migrazione di un processo'],
    testo: [
      'Nelle unità precedenti il processore era uno, ed eseguiva un processo per volta. Un processore attuale contiene più unità di calcolo indipendenti, ciascuna denominata [[core]]. Due core eseguono effettivamente due processi nel medesimo istante. Lo scheduler deve allora stabilire, oltre al processo da eseguire, anche il core che lo esegue.',
      'La soluzione più diffusa assegna a ogni core la propria coda dei pronti. Ogni core preleva i processi soltanto dalla propria, senza contendere agli altri una struttura comune. Il rischio è lo sbilanciamento delle code. Si considerino sette processi da 1 ms ciascuno, sei nella coda del core 0 e uno nella coda del core 1, con i due core avviati insieme. Il core 1 termina dopo 1 ms, e resta inattivo mentre il core 0 esaurisce la propria coda fino all’istante 6.',
      { fig: 'scena', w: 720, h: 178, titolo: 'Sei processi su un core, uno sull’altro', nota: 'Il gruppo termina a 6 ms. Per cinque millisecondi il core 1 è rimasto inattivo.', els: SL.unita535.quadro('g', { n: 6, k: 0 }, 3, { x: 10, y: 0, wc: 78 }) },
      'In quei 6 ms i due core offrivano 2 × 6 = 12 millisecondi di calcolo: sette sono stati impiegati, cinque sono rimasti inutilizzati. Il rimedio è il [[bilanciamento del carico]]: lo scheduler confronta le code e trasferisce alcuni processi da quella lunga a quella corta. Lo spostamento di un processo da un core a un altro è una [[migrazione di un processo|migrazione]]. Con il trasferimento di due processi le code divengono di quattro e di tre, il gruppo termina a 4 ms, e resta inutilizzato un solo millisecondo.',
      'L’istante in cui il gruppo termina dipende dalla coda più lunga. La distribuzione migliore è pertanto quella che rende le code il più possibile uguali. Nel modello la migrazione è priva di costo. Nei sistemi reali ha un costo, poiché un processo trasferito trova sul nuovo core una cache priva dei suoi dati, e per un certo intervallo procede più lentamente. Per questa ragione gli scheduler bilanciano con cautela, soltanto quando la differenza è sensibile.'
    ]
  },
  esperimento: {
    faremo: [
      'Ogni processo dura 1 ms, e il core 1 ne ha uno in coda. I controlli fissano il numero dei processi del core 0, e il numero di quelli che lo scheduler trasferisce al core 1 prima dell’avvio.',
      'L’esperimento dispone le due code sulla riga del tempo, e conta i millisecondi in cui un core resta inattivo. È istruttivo ricercare il numero di trasferimenti con cui il gruppo termina prima.'
    ],
    vedrai: [
      ['cpu', 'I due core', 'Due righe del tempo, una per core. Ogni cella è un millisecondo: L è un processo, «libero» un millisecondo inutilizzato.']
    ]
  },
  lab: {
    titolo: 'Bilanciare due code',
    scena: { w: 860, h: 178 },
    atti: ['Le code', 'Il bilanciamento', 'L’esecuzione', 'Il totale'],
    controlli: [
      { id: 'n', tipo: 'scelta', eti: 'Processi sul core 0', opzioni: [[4, '4'], [6, '6'], [8, '8']], valore: 6 },
      { id: 'k', tipo: 'scelta', eti: 'Processi trasferiti al core 1', opzioni: [[0, 'nessuno'], [1, '1'], [2, '2'], [3, '3']], valore: 0 }
    ],
    nota: 'I passi sono sempre quattro. Ogni processo dura 1 ms, e la migrazione è considerata priva di costo.',
    previsione: {
      domanda: (p) => 'Il core 0 ha in coda ' + p.n + ' processi da 1 ms, il core 1 ne ha 1. Prima dell’avvio lo scheduler trasferisce ' + (p.k === 0 ? 'nessun processo' : p.k === 1 ? '1 processo' : p.k + ' processi') + ' dal core 0 al core 1. A quale istante termina l’ultimo processo?',
      opzioni: (p) => { const c = SL.unita535.conto(p); return Array.from(new Set([c.fine, p.n, Math.ceil((p.n + 1) / 2), p.n + 1])).sort((a, b) => a - b).map((v) => [v, v + ' ms']); }
    },
    confronto: (pred, esito, p) => { const c = SL.unita535.conto(p); return 'La previsione indicava ' + pred + ' ms. Il gruppo termina a ' + esito + ' ms. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.n + 1 ? 'I due core operano contemporaneamente: i tempi delle due code non si sommano.' : 'Le code sono di ' + c.c0 + ' e di ' + c.c1 + ' processi, ed è determinante la più lunga.'); },
    costruisci(p) {
      const U = SL.unita535, c = U.conto(p), passi = [], meglio = Math.ceil((p.n + 1) / 2);
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, wc: 96 });
      const hud = (f) => [['Code', (f >= 1 ? c.c0 : p.n) + ' e ' + (f >= 1 ? c.c1 : 1), 'a'], ['Fine', f >= 2 ? c.fine + ' ms' : '·'], ['Inattività', f >= 3 ? c.ozio + ' ms' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Due code sbilanciate', 'Sono pronti ' + c.tot + ' processi da 1 ms. La coda del core 0 ne contiene ' + p.n + ', quella del core 1 ne contiene 1.', {});
      P(1, 1, p.k === 0 ? 'Nessun trasferimento' : 'La migrazione', p.k === 0 ? 'Lo scheduler lascia invariate le code. Ogni core eseguirà i processi della propria.' : 'Lo scheduler trasferisce ' + (p.k === 1 ? '1 processo' : p.k + ' processi') + ' dalla coda del core 0 a quella del core 1. Le code divengono di ' + c.c0 + ' e di ' + c.c1 + ' processi.', { calc: p.n + ' − ' + p.k + ' = ' + c.c0 + ' · 1 + ' + p.k + ' = ' + c.c1, chiedi: { d: 'Quale coda determina l’istante in cui il gruppo termina?', o: ['La più corta', 'La più lunga', 'La somma delle due'], g: 1, no: 'I core operano insieme. L’ultimo processo è quello all’ultima posizione della coda più lunga.' } });
      P(2, 2, 'L’esecuzione', 'I due core hanno inizio insieme all’istante 0, e ciascuno esegue un processo al millisecondo. Il core 0 termina a ' + c.c0 + ' ms, il core 1 a ' + c.c1 + ' ms. Il gruppo è completo a ' + c.fine + ' ms.' + (c.ozio > 0 ? ' Il core con la coda più corta resta inattivo per ' + Math.abs(c.c0 - c.c1) + ' ms.' : ''), { calc: 'fine: il maggiore fra ' + c.c0 + ' e ' + c.c1 + ' = ' + c.fine + ' ms', esito: ['fine a ' + c.fine + ' ms', ''] });
      P(3, 3, 'Il totale', 'In ' + c.fine + ' ms i due core offrivano 2 × ' + c.fine + ' = ' + 2 * c.fine + ' millisecondi di calcolo. Ne sono stati impiegati ' + c.tot + ', e ' + c.ozio + (c.ozio === 1 ? ' è rimasto inutilizzato.' : ' sono rimasti inutilizzati.') + (c.fine === meglio ? ' Con ' + c.tot + ' processi su due core, ' + meglio + ' ms è il minimo possibile: le code sono bilanciate.' : ' Con code meglio bilanciate il gruppo potrebbe terminare a ' + meglio + ' ms.'), { calc: '2 × ' + c.fine + ' − ' + c.tot + ' = ' + c.ozio + ' ms di inattività', esito: ['fine a ' + c.fine + ' ms', c.fine === meglio ? 'si' : ''] });
      return { passi, esito: c.fine };
    }
  },
  bilancio: {
    regola: [
      'Con una coda per core, il gruppo termina quando si esaurisce la coda più lunga.',
      'Tempo inutilizzato = numero di core × durata complessiva − calcolo svolto. Il bilanciamento del carico lo riduce con il trasferimento di processi verso le code corte.'
    ],
    errori: [
      ['Sommare le durate delle due code.', 'I core operano contemporaneamente, ed è determinante la coda più lunga.'],
      ['Trasferire troppi processi.', 'Oltre il punto di equilibrio lo sbilanciamento si ripresenta sull’altra coda.'],
      ['Considerare la migrazione sempre priva di costo.', 'Sul nuovo core il processo trova una cache priva dei suoi dati, e inizialmente rallenta.']
    ],
    saFare: ['Calcolare l’istante in cui termina un gruppo di processi su due core.', 'Contare il tempo di calcolo inutilizzato.', 'Determinare la distribuzione più equilibrata.'],
    esercizi: [
      { d: 'Due core hanno in coda 9 processi e 3 processi, tutti da 1 ms. Senza alcun trasferimento, quanti millisecondi di calcolo restano inutilizzati fino alla fine del gruppo?', segnaposto: 'Un numero', giuste: ['6', '6ms', 'sei'],
        ok: 'Il gruppo termina a 9 ms. I core offrivano 18 ms, i processi ne hanno impiegati 12.',
        diagnosi: [
          { se: ['9', '9ms'], msg: 'Nove millisecondi è la durata del gruppo. Il tempo inutilizzato è 2 × 9 − 12.' },
          { se: ['3', '3ms'], msg: 'Il core con 3 processi termina a 3 ms e resta inattivo fino a 9, per 6 ms.' },
          { se: ['12', '12ms'], msg: 'Dodici è il calcolo svolto. Il tempo inutilizzato è la parte residua dei 18 ms offerti.' }
        ],
        altro: 'Il valore è diverso. Si determini la durata del gruppo, la si moltiplichi per i due core e si sottragga il calcolo svolto.',
        indizi: ['La coda più lunga dura 9 ms.', 'I due core offrono 18 ms.', '18 − 12 = 6.'],
        svolgimento: ['Durata: 9 ms.', 'Offerti: 2 × 9 = 18 ms.', 'Impiegati: 12 ms.', 'Inutilizzati: 6 ms.'] },
      { d: 'Nella medesima situazione, 9 processi e 3 processi, quanti processi è opportuno trasferire dalla coda lunga a quella corta per terminare nel minor tempo?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Con 3 trasferimenti le code divengono 6 e 6, e il gruppo termina a 6 ms.',
        diagnosi: [
          { se: ['6', 'sei'], msg: 'Sei è la lunghezza delle code bilanciate. I processi da trasferire sono 9 − 6.' },
          { se: ['4', 'quattro'], msg: 'Con 4 trasferimenti le code sarebbero 5 e 7, e il gruppo terminerebbe a 7 ms.' },
          { se: ['2', 'due'], msg: 'Con 2 trasferimenti le code sarebbero 7 e 5. È possibile trasferirne ancora uno.' }
        ],
        altro: 'Il numero è diverso. Si ricerchi il trasferimento che rende uguali le due code.',
        indizi: ['I processi sono complessivamente 12.', 'Code uguali: 6 e 6.', '9 − 6 = 3 processi da trasferire.'],
        svolgimento: ['Totale: 12 processi.', 'Obiettivo: 6 per coda.', 'Trasferimenti: 3.'] },
      { d: 'Per quale ragione uno scheduler evita di migrare un processo a ogni minima differenza fra le code?', guida: 'Si scelga la risposta.', o: [
        { t: 'Sul nuovo core il processo non trova i propri dati nella cache, e rallenta', ok: true, fb: 'Il guadagno del bilanciamento deve superare questo costo.' },
        { t: 'Un processo può eseguire soltanto sul core su cui è stato creato', fb: 'In generale i processi possono essere trasferiti. Il limite è il costo.' },
        { t: 'Le code devono restare di lunghezza diversa', fb: 'Code uguali sono l’obiettivo. Il freno è il costo della migrazione.' }] }
    ]
  }
});
