'use strict';
SL.unita535 = (() => {
  const conto = (p) => { const c0 = p.n - p.k, c1 = 1 + p.k, fine = Math.max(c0, c1); return { c0, c1, fine, ozio: 2 * fine - (p.n + 1), tot: p.n + 1 }; };
  // fase: 0 le code · 1 lo spostamento · 2 l'esecuzione · 3 il conto
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], c = conto(p), q0 = f >= 1 ? c.c0 : p.n, q1 = f >= 1 ? c.c1 : 1, fine = Math.max(q0, q1);
    [[q0, 'CORE 0'], [q1, 'CORE 1']].forEach((r, j) => {
      els.push(el.nota(pre + 't' + j, o.x, o.y + j * 90, r[1] + ' · ' + r[0] + (r[0] === 1 ? ' lavoro' : ' lavori') + ' in coda', 'mono'));
      for (let k = 0; k < 8; k++) { const lav = k < r[0], spost = j === 1 && f === 1 && k >= 1 && k < r[0], ozio = !lav && k < fine && f >= 2; els.push(el.cella(pre + j + 'c' + k, o.x + k * (o.wc + 4), o.y + 24 + j * 90, o.wc, 34, lav ? 'L' : ozio ? 'ozio' : '', lav ? (spost ? 'att' : 'on') : ozio ? 'err' : '', { gi: String(k), piccola: true })); }
    });
    return els;
  };
  return { conto, quadro };
})();
SL.registra('5.3.5', {
  titolo: 'Scheduling su più processori logici',
  obiettivo: 'Obiettivo: calcolare quando termina un gruppo di lavori distribuiti su due core, e quanto tempo di calcolo resta inutilizzato se le code sono sbilanciate.',
  concetti: [['cpu', 'Più core, più code'], ['bilancio', 'Code lunghe e code corte'], ['coda', 'Spostare lavori da una all’altra']],
  filigrana: ['cpu', 'coda', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'coda', da: 'Dall’unità 5.1.2', t: 'La coda dei pronti', d: 'L’elenco dei processi a cui manca soltanto il processore.' },
      { sim: 'bus', da: 'Dall’unità 4.4.2', t: 'Risorse che lavorano insieme', d: 'Due collegamenti indipendenti sommano le loro capacità.' },
      { sim: 'clock', da: 'Dall’unità 5.3.3', t: 'Il tempo di completamento', d: 'L’istante in cui un lavoro è finito.' }
    ],
    domanda: { d: 'Prima di proseguire: due casse servono un cliente al minuto. Alla prima ci sono 6 clienti, alla seconda 1. Dopo quanti minuti sono stati serviti tutti?', o: [
      { t: '6', ok: true, fb: 'Conta la fila più lunga. La seconda cassa resta libera per 5 minuti.' },
      { t: '7', fb: 'Le due casse lavorano insieme: l’ultimo cliente esce quando finisce la fila più lunga.' },
      { t: '4', fb: 'Quattro minuti basterebbero se i clienti cambiassero fila. Qui restano dove sono.' }
    ] }
  },
  idea: {
    titolo: 'Due core, e il lavoro tutto da una parte',
    termini: ['core', 'bilanciamento del carico', 'migrazione di un processo'],
    testo: [
      'Finora il processore era uno, ed eseguiva un processo per volta. Un processore attuale contiene più unità di calcolo indipendenti, e ciascuna si chiama [[core]]. Due core eseguono davvero due processi nello stesso istante. Lo scheduler deve allora decidere, oltre a chi esegue, anche dove.',
      'La soluzione più comune dà a ogni core la propria coda dei pronti. Ogni core pesca soltanto dalla sua, senza contendersi una struttura comune con gli altri. Il rischio è che le code si sbilancino. Supponiamo sette lavori da 1 ms ciascuno, sei nella coda del core 0 e uno nella coda del core 1. I due core partono insieme. Il core 1 ha finito dopo 1 ms, e resta senza far nulla mentre il core 0 smaltisce la sua coda fino all’istante 6.',
      { fig: 'scena', w: 720, h: 178, titolo: 'Sei lavori su un core, uno sull’altro', nota: 'Il gruppo termina a 6 ms. Per cinque millisecondi il core 1 è rimasto in ozio.', els: SL.unita535.quadro('g', { n: 6, k: 0 }, 3, { x: 10, y: 0, wc: 78 }) },
      'In quei 6 ms i due core offrivano 2 × 6 = 12 millisecondi di calcolo. Sette sono stati usati, cinque sono andati sprecati. Il rimedio è il [[bilanciamento del carico]]: lo scheduler confronta le code e sposta dei lavori da quella lunga a quella corta. Lo spostamento di un lavoro da un core a un altro è una [[migrazione di un processo|migrazione]]. Trasferendo due lavori le code diventano di quattro e di tre, il gruppo termina a 4 ms, e resta inutilizzato un solo millisecondo.',
      'Il momento in cui tutto è finito dipende dalla coda più lunga. La distribuzione migliore è quindi quella che rende le code più uguali possibile. Nel modello la migrazione è gratuita. Nella realtà ha un costo, perché un lavoro spostato trova sul nuovo core una cache che non contiene i suoi dati, e per un po’ procede più lentamente. Per questo gli scheduler bilanciano con prudenza, soltanto quando la differenza è sensibile.'
    ]
  },
  esperimento: {
    faremo: [
      'Ogni lavoro dura 1 ms. Il core 1 ne ha uno in coda. Sceglierai quanti ne ha il core 0, e quanti lo scheduler ne trasferisce al core 1 prima di cominciare.',
      'Vedremo le due code sulla riga del tempo, e conteremo i millisecondi in cui un core resta in ozio. Cerca il numero di trasferimenti che fa terminare prima il gruppo.'
    ],
    vedrai: [
      ['cpu', 'I due core', 'Due righe del tempo, una per core. Ogni casella è un millisecondo: L è un lavoro, «ozio» un millisecondo inutilizzato.']
    ]
  },
  lab: {
    titolo: 'Bilanciare due code',
    scena: { w: 860, h: 178 },
    atti: ['Le code', 'Il bilanciamento', 'L’esecuzione', 'Il conto'],
    controlli: [
      { id: 'n', tipo: 'scelta', eti: 'Lavori sul core 0', opzioni: [[4, '4'], [6, '6'], [8, '8']], valore: 6 },
      { id: 'k', tipo: 'scelta', eti: 'Lavori trasferiti al core 1', opzioni: [[0, 'nessuno'], [1, '1'], [2, '2'], [3, '3']], valore: 0 }
    ],
    nota: 'I passi sono sempre quattro. Ogni lavoro dura 1 ms, e la migrazione è considerata gratuita.',
    previsione: {
      domanda: (p) => 'Il core 0 ha in coda ' + p.n + ' lavori da 1 ms, il core 1 ne ha 1. Prima di cominciare lo scheduler trasferisce ' + (p.k === 0 ? 'nessun lavoro' : p.k === 1 ? '1 lavoro' : p.k + ' lavori') + ' dal core 0 al core 1. A quale istante termina l’ultimo lavoro?',
      opzioni: (p) => { const c = SL.unita535.conto(p); return Array.from(new Set([c.fine, p.n, Math.ceil((p.n + 1) / 2), p.n + 1])).sort((a, b) => a - b).map((v) => [v, v + ' ms']); }
    },
    confronto: (pred, esito, p) => { const c = SL.unita535.conto(p); return 'La previsione indicava ' + pred + ' ms. Il gruppo termina a ' + esito + ' ms. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.n + 1 ? 'I due core lavorano nello stesso momento: i tempi delle due code non si sommano.' : 'Le code sono di ' + c.c0 + ' e di ' + c.c1 + ' lavori, e conta la più lunga.'); },
    costruisci(p) {
      const U = SL.unita535, c = U.conto(p), passi = [], meglio = Math.ceil((p.n + 1) / 2);
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, wc: 96 });
      const hud = (f) => [['Code', (f >= 1 ? c.c0 : p.n) + ' e ' + (f >= 1 ? c.c1 : 1), 'a'], ['Fine', f >= 2 ? c.fine + ' ms' : '·'], ['Ozio', f >= 3 ? c.ozio + ' ms' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Due code sbilanciate', 'Sono pronti ' + c.tot + ' lavori da 1 ms. La coda del core 0 ne contiene ' + p.n + ', quella del core 1 ne contiene 1.', {});
      P(1, 1, p.k === 0 ? 'Nessun trasferimento' : 'La migrazione', p.k === 0 ? 'Lo scheduler lascia le code come sono. Ogni core eseguirà i lavori della propria.' : 'Lo scheduler sposta ' + (p.k === 1 ? '1 lavoro' : p.k + ' lavori') + ' dalla coda del core 0 a quella del core 1. Le code diventano di ' + c.c0 + ' e di ' + c.c1 + ' lavori.', { calc: p.n + ' − ' + p.k + ' = ' + c.c0 + ' · 1 + ' + p.k + ' = ' + c.c1, chiedi: { d: 'Quale coda decide l’istante in cui tutto è finito?', o: ['La più corta', 'La più lunga', 'La somma delle due'], g: 1, no: 'I core lavorano insieme. L’ultimo lavoro è quello in fondo alla coda più lunga.' } });
      P(2, 2, 'L’esecuzione', 'I due core partono insieme all’istante 0, e ciascuno esegue un lavoro al millisecondo. Il core 0 finisce a ' + c.c0 + ' ms, il core 1 a ' + c.c1 + ' ms. Il gruppo è completo a ' + c.fine + ' ms.' + (c.ozio > 0 ? ' Il core con la coda più corta resta in ozio per ' + Math.abs(c.c0 - c.c1) + ' ms.' : ''), { calc: 'fine: il maggiore fra ' + c.c0 + ' e ' + c.c1 + ' = ' + c.fine + ' ms', esito: ['fine a ' + c.fine + ' ms', ''] });
      P(3, 3, 'Il conto', 'In ' + c.fine + ' ms i due core offrivano 2 × ' + c.fine + ' = ' + 2 * c.fine + ' millisecondi di calcolo. Ne sono serviti ' + c.tot + ', e ' + c.ozio + (c.ozio === 1 ? ' è rimasto inutilizzato.' : ' sono rimasti inutilizzati.') + (c.fine === meglio ? ' Con ' + c.tot + ' lavori su due core, ' + meglio + ' ms è il minimo possibile: le code sono bilanciate.' : ' Con code più uguali il gruppo potrebbe terminare a ' + meglio + ' ms.'), { calc: '2 × ' + c.fine + ' − ' + c.tot + ' = ' + c.ozio + ' ms in ozio', esito: ['fine a ' + c.fine + ' ms', c.fine === meglio ? 'si' : ''] });
      return { passi, esito: c.fine };
    }
  },
  bilancio: {
    regola: [
      'Con una coda per core, il gruppo termina quando finisce la coda più lunga.',
      'Tempo inutilizzato = numero di core × durata complessiva − lavoro svolto. Il bilanciamento del carico lo riduce spostando lavori verso le code corte.'
    ],
    errori: [
      ['Sommare le durate delle due code.', 'I core lavorano nello stesso momento. Conta la coda più lunga.'],
      ['Trasferire troppi lavori.', 'Oltre il punto di equilibrio lo sbilanciamento si ricrea dall’altra parte.'],
      ['Considerare la migrazione sempre gratuita.', 'Sul nuovo core il lavoro trova una cache senza i suoi dati, e all’inizio rallenta.']
    ],
    saFare: ['Calcolare quando termina un gruppo di lavori su due core.', 'Contare il tempo di calcolo inutilizzato.', 'Determinare la distribuzione più equilibrata.'],
    esercizi: [
      { d: 'Due core hanno in coda 9 lavori e 3 lavori, tutti da 1 ms. Senza alcun trasferimento, quanti millisecondi di calcolo restano inutilizzati fino alla fine del gruppo?', segnaposto: 'Un numero', giuste: ['6', '6ms', 'sei'],
        ok: 'Il gruppo termina a 9 ms. I core offrivano 18 ms, i lavori ne hanno usati 12.',
        diagnosi: [
          { se: ['9', '9ms'], msg: 'Nove millisecondi è la durata del gruppo. L’ozio è 2 × 9 − 12.' },
          { se: ['3', '3ms'], msg: 'Il core con 3 lavori finisce a 3 ms e resta fermo fino a 9: sono 6 ms.' },
          { se: ['12', '12ms'], msg: 'Dodici è il lavoro svolto. L’ozio è ciò che avanza dei 18 ms offerti.' }
        ],
        altro: 'Il valore è diverso. Si determini la durata del gruppo, moltiplica per i due core e si tolga il lavoro svolto.',
        indizi: ['La coda più lunga dura 9 ms.', 'I due core offrono 18 ms.', '18 − 12 = 6.'],
        svolgimento: ['Durata: 9 ms.', 'Offerti: 2 × 9 = 18 ms.', 'Usati: 12 ms.', 'Ozio: 6 ms.'] },
      { d: 'Nella stessa situazione, 9 lavori e 3 lavori, quanti lavori conviene trasferire dalla coda lunga a quella corta per terminare il prima possibile?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Con 3 trasferimenti le code diventano 6 e 6, e il gruppo termina a 6 ms.',
        diagnosi: [
          { se: ['6', 'sei'], msg: 'Sei è la lunghezza delle code bilanciate. I lavori da spostare sono 9 − 6.' },
          { se: ['4', 'quattro'], msg: 'Con 4 trasferimenti le code sarebbero 5 e 7, e il gruppo finirebbe a 7 ms.' },
          { se: ['2', 'due'], msg: 'Con 2 trasferimenti le code sarebbero 7 e 5. Se ne può spostare ancora uno.' }
        ],
        altro: 'Il numero è diverso. Cerca il trasferimento che rende uguali le due code.',
        indizi: ['I lavori sono 12 in tutto.', 'Code uguali: 6 e 6.', '9 − 6 = 3 lavori da spostare.'],
        svolgimento: ['Totale: 12 lavori.', 'Obiettivo: 6 per coda.', 'Trasferimenti: 3.'] },
      { d: 'Perché uno scheduler evita di migrare un lavoro a ogni minima differenza fra le code?', guida: 'Si scelga la risposta.', o: [
        { t: 'Perché sul nuovo core il lavoro non trova i propri dati nella cache, e rallenta', ok: true, fb: 'Il guadagno del bilanciamento deve superare questo costo.' },
        { t: 'Perché un lavoro può eseguire soltanto sul core su cui è nato', fb: 'In generale i lavori possono essere spostati. Il punto è il costo.' },
        { t: 'Perché le code devono restare di lunghezza diversa', fb: 'Code uguali sono l’obiettivo. A frenare è il costo della migrazione.' }] }
    ]
  }
});
