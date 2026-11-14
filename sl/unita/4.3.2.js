'use strict';
SL.unita432 = (() => {
  const conti = (p) => { const n = Math.ceil(p.t / p.p); return { n, quando: n * p.p, ritardo: n * p.p - p.t, cicli: 4 * n, irq: p.t + 2 }; };
  // fase: 0 l'evento · 1 i controlli a vuoto · 2 il controllo utile · 3 il costo del polling · 4 l'interrupt · 5 il confronto
  const quadro = (pre, p, f, o) => {
    const el = SL.el, c = conti(p), els = [], T = o.T || 50, u = o.w / T;
    for (let k = 0; k <= T; k += 10) els.push(el.nota(pre + 'k' + k, o.x + k * u - 6, o.y, String(k), 'mono minuta'));
    els.push(el.linea(pre + 'ax', o.x, o.y + 40, o.x + T * u, o.y + 40, ''));
    for (let k = 1; k <= c.n; k++) { const utile = k === c.n, visto = utile ? f >= 2 : f >= 1; if (visto) els.push(el.cella(pre + 'p' + k, o.x + k * p.p * u - 7, o.y + 26, 14, 28, '', utile ? (f === 2 ? 'att' : 'on') : 'zero')); }
    els.push(el.nota(pre + 'ev', o.x + p.t * u - 4, o.y + 60, '↑ evento a ' + p.t + ' µs', 'mono minuta', f === 0 ? 'att' : ''));
    if (f >= 4) els.push(el.cella(pre + 'iq', o.x + c.irq * u - 3, o.y + 20, 6, 40, '', 'err'));
    if (o.conti) {
      const y2 = o.y + 96, w = (o.w - 3 * o.gap) / 4;
      const B = (id, k, eti, txt, da, st) => el.box(pre + id, o.x + k * (w + o.gap), y2, w, o.h, eti, f >= da ? txt : '·', f === da ? 'att' : f > da ? (st || 'on') : '', { cls: 'stretta' });
      els.push(B('q1', 0, 'polling · scoperta', c.quando + ' µs · ritardo ' + c.ritardo, 2), B('q2', 1, 'polling · lavoro', c.n + ' × 4 = ' + c.cicli + ' cicli', 3), B('q3', 2, 'interrupt · scoperta', c.irq + ' µs · ritardo 2', 4), B('q4', 3, 'interrupt · lavoro', '24 cicli', 4));
    }
    return els;
  };
  return { conti, quadro };
})();
SL.registra('4.3.2', {
  titolo: 'Polling e interrupt',
  obiettivo: 'Obiettivo: confrontare i due modi con cui un driver rileva un evento, il controllo periodico e la notifica, misurando per ciascuno il ritardo e il lavoro del processore.',
  concetti: [['clock', 'Il controllo a intervalli'], ['interrupt', 'La notifica'], ['bilancio', 'Ritardo e lavoro']],
  filigrana: ['clock', 'interrupt', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'register', da: 'Dall’unità 4.3.1', t: 'Il bit READY', d: 'Il driver legge il registro STATUS per stabilire se il dato è disponibile.' },
      { sim: 'interrupt', da: 'Dall’unità 4.1.1', t: 'L’interrupt', d: 'Una richiesta di intervento che giunge al processore dall’esterno, e avvia un gestore.' },
      { sim: 'pila', da: 'Dall’unità 4.1.5', t: 'Il costo di un ingresso', d: 'Ogni interrupt comporta il salvataggio e il ripristino del contesto.' }
    ],
    domanda: { d: 'Prima di proseguire: un driver controlla una periferica agli istanti 8, 16, 24 e 32 µs. A quale controllo scopre un evento avvenuto a 19 µs?', o: [
      { t: 'A quello di 24 µs', ok: true, fb: 'È il primo controllo successivo all’evento.' },
      { t: 'A quello di 16 µs', fb: 'A 16 µs l’evento non è ancora avvenuto.' },
      { t: 'A quello di 32 µs', fb: 'Il controllo di 24 µs è precedente, e trova già l’evento.' }
    ] }
  },
  idea: {
    titolo: 'Controllo periodico oppure notifica',
    termini: ['polling', 'richiesta di interruzione'],
    testo: [
      'Un driver che attende un evento, per esempio la fine di una misura oppure l’arrivo di un carattere, dispone di due tecniche. La prima consiste nel controllo a intervalli regolari: la lettura del registro STATUS a ogni periodo prefissato, finché READY vale 1. Questa tecnica prende il nome di [[polling]].',
      'Il polling ha due costi. Il primo è il ritardo: l’evento avviene fra un controllo e l’altro, e resta ignorato fino al controllo successivo. Il secondo è il lavoro: ogni controllo occupa il processore per alcuni cicli, anche quando READY vale ancora 0. Un periodo più breve riduce il ritardo e aumenta il lavoro, mentre un periodo più lungo produce l’effetto opposto.',
      { fig: 'scena', w: 720, h: 96, titolo: 'Un evento a 19 µs, con un controllo ogni 8 µs', nota: 'I controlli a 8 e a 16 µs trovano READY a 0. Quello a 24 µs scopre l’evento, con 5 µs di ritardo.', els: SL.unita432.quadro('g', { t: 19, p: 8 }, 3, { x: 16, y: 4, w: 690, T: 40 }) },
      'La seconda tecnica inverte i ruoli: il driver cessa i controlli e riceve una notifica. Quando l’evento avviene, il controller invia al processore una [[richiesta di interruzione]], abbreviata IRQ. Il processore sospende l’attività in corso ed esegue il gestore, che fa parte del driver.',
      'Con l’interrupt il ritardo è ridotto e indipendente da un periodo. Il lavoro è concentrato in un solo ingresso, più costoso tuttavia di un controllo, poiché comprende il salvataggio e il ripristino del contesto. In questo modello un controllo di polling costa 4 cicli, e un interrupt ne costa 24.',
      'Nessuna delle due tecniche prevale in ogni situazione. Quando gli eventi sono rari, l’interrupt evita migliaia di controlli a vuoto. Quando sono molto frequenti, come in una scheda di rete sotto carico, un interrupt per evento saturerebbe il processore, ed è preferibile il controllo a intervalli.'
    ]
  },
  esperimento: {
    faremo: [
      'Una periferica segnala un evento a un dato istante. I controlli fissano l’istante e il periodo del polling. Ogni controllo costa 4 cicli di processore, e il primo avviene dopo un periodo.',
      'L’esperimento conta i controlli fino alla scoperta, il ritardo e il lavoro. Il medesimo evento è poi notificato con un interrupt, consegnato in 2 µs al costo di 24 cicli. Dopo il caso proposto, è istruttivo dimezzare il periodo e osservare quale numero diminuisce e quale aumenta.'
    ],
    vedrai: [
      ['clock', 'L’asse del tempo', 'In alto: i microsecondi, i controlli del polling e l’istante dell’evento.'],
      ['lente', 'Il polling', 'In basso a sinistra: l’istante della scoperta e il lavoro richiesto.'],
      ['interrupt', 'L’interrupt', 'In basso a destra: i medesimi due numeri per la notifica.']
    ]
  },
  lab: {
    titolo: 'Il medesimo evento, scoperto in due modi',
    scena: { w: 860, h: 190 },
    atti: ['L’evento', 'Il polling', 'L’interrupt', 'Il confronto'],
    controlli: [
      { id: 'p', tipo: 'scelta', eti: 'Periodo del polling', opzioni: [[4, '4 µs'], [8, '8 µs'], [16, '16 µs']], valore: 8 },
      { id: 't', tipo: 'scelta', eti: 'Istante dell’evento', opzioni: [[19, '19 µs'], [37, '37 µs']], valore: 19 }
    ],
    nota: 'I passi sono sempre sei. Un controllo costa 4 cicli, mentre un interrupt giunge 2 µs dopo l’evento e costa 24 cicli.',
    previsione: {
      domanda: (p) => 'Un evento avviene a ' + p.t + ' µs. Il driver controlla la periferica ogni ' + p.p + ' µs, a partire da ' + p.p + ' µs. Quanti microsecondi trascorrono fra l’evento e la sua scoperta?',
      opzioni: (p) => { const c = SL.unita432.conti(p); return Array.from(new Set([c.ritardo, p.p, p.t % p.p, 2])).sort((a, b) => a - b).map((v) => [v, v + ' µs']); }
    },
    confronto: (pred, esito, p) => { const c = SL.unita432.conti(p); return 'La previsione indicava ' + pred + ' µs. Il ritardo è di ' + esito + ' µs. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il primo controllo dopo l’evento avviene a ' + c.quando + ' µs: ' + c.quando + ' − ' + p.t + ' = ' + c.ritardo + '.'); },
    costruisci(p) {
      const U = SL.unita432, passi = [], c = U.conti(p), t = p.t, per = p.p;
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'TEMPO IN MICROSECONDI', 'mono')].concat(U.quadro('q', p, f, { x: 24, y: 22, w: 812, conti: true, h: 58, gap: 12 }));
      const hud = (f) => [['Periodo', per + ' µs', 'a'], ['Ritardo del polling', f >= 2 ? c.ritardo + ' µs' : '·'], ['Lavoro del polling', f >= 3 ? c.cicli + ' cicli' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));
      const vuoti = c.n - 1, ist = Array.from({ length: vuoti }, (_, k) => (k + 1) * per);

      P(0, 0, 'L’evento', 'A ' + t + ' µs la periferica ha il dato pronto, e il controller porta READY a 1. Il bit resta a 1 fino al prelievo del dato. Il driver ignora ancora l’evento.',
        { chiedi: { d: 'Il driver controlla ogni ' + per + ' µs, a partire da ' + per + ' µs. Qual è il primo controllo che avviene dopo l’evento?', o: Array.from(new Set([c.quando - per, c.quando, c.quando + per])).filter((v) => v > 0).map((v) => 'Quello a ' + v + ' µs'), g: Array.from(new Set([c.quando - per, c.quando, c.quando + per])).filter((v) => v > 0).indexOf(c.quando), no: 'Occorre il primo multiplo di ' + per + ' uguale o superiore a ' + t + ', cioè ' + c.quando + '.' } });
      P(1, 1, 'I controlli a vuoto', vuoti === 0 ? 'Prima dell’evento il driver non ha eseguito alcun controllo.' : 'Prima dell’evento il driver ha già controllato ' + (vuoti === 1 ? 'una volta, a ' + ist[0] + ' µs, trovando' : vuoti + ' volte, a ' + ist.join(', ') + ' µs, trovando sempre') + ' READY a 0. Ogni controllo ha occupato il processore per 4 cicli senza alcun risultato.', { calc: 'controlli a vuoto: ' + vuoti });
      P(2, 1, 'Il controllo utile', 'Il controllo a ' + c.quando + ' µs trova READY a 1, e il driver preleva il dato. Dall’evento sono trascorsi ' + c.quando + ' − ' + t + ' = ' + c.ritardo + ' µs.', { calc: c.quando + ' − ' + t + ' = ' + c.ritardo + ' µs', esito: ['ritardo ' + c.ritardo + ' µs', 'si'] });
      P(3, 1, 'Il lavoro del polling', 'Complessivamente i controlli sono stati ' + c.n + ', da 4 cicli ciascuno: ' + c.n + ' × 4 = ' + c.cicli + ' cicli di processore. Con un evento più tardivo i controlli a vuoto sarebbero stati più numerosi.', { calc: c.n + ' × 4 = ' + c.cicli + ' cicli' });
      P(4, 2, 'Il medesimo evento con un interrupt', 'In questo caso il driver non esegue alcun controllo. A ' + t + ' µs il controller invia una richiesta di interruzione, che raggiunge il processore in 2 µs. Il gestore ha inizio a ' + c.irq + ' µs. L’ingresso e l’uscita costano 24 cicli, una sola volta.', { calc: 'scoperta a ' + c.irq + ' µs · 24 cicli' });
      P(5, 3, 'Il confronto', 'Il polling ha un ritardo di ' + c.ritardo + ' µs e un lavoro di ' + c.cicli + ' cicli. L’interrupt ha un ritardo di 2 µs e un lavoro di 24 cicli. ' + (c.ritardo < 2 && c.cicli < 24 ? 'In questo caso il polling è migliore per entrambe le misure, poiché l’evento è avvenuto presto e poco prima di un controllo.' : c.ritardo <= 2 ? 'Il polling è altrettanto rapido, e ha lavorato ' + (c.cicli > 24 ? 'di più.' : 'di meno.') : c.cicli < 24 ? 'L’interrupt è più rapido, e il polling ha lavorato di meno poiché l’evento è avvenuto presto.' : 'L’interrupt è più rapido e ha lavorato ' + (c.cicli === 24 ? 'altrettanto.' : 'di meno.')) + ' Il lavoro del polling cresce con l’attesa, mentre quello dell’interrupt resta fisso.', { calc: 'polling ' + c.ritardo + ' µs, ' + c.cicli + ' cicli · interrupt 2 µs, 24 cicli', esito: ['ritardo ' + c.ritardo + ' µs', 'si'] });
      return { passi, esito: c.ritardo };
    }
  },
  bilancio: {
    regola: [
      'Con il polling il driver legge lo stato a intervalli regolari. L’evento è scoperto al primo controllo che lo segue, e ogni controllo costa lavoro anche quando è a vuoto.',
      'Con l’interrupt il controller avvisa il processore. Il ritardo è breve e indipendente da un periodo, e il lavoro consiste in un solo ingresso, più costoso di un controllo.'
    ],
    errori: [
      ['Ritenere che un periodo più breve sia sempre preferibile.', 'Un periodo più breve riduce il ritardo e moltiplica i controlli a vuoto.'],
      ['Considerare gratuito un interrupt.', 'Ogni ingresso comporta il salvataggio e il ripristino del contesto.'],
      ['Adottare una sola tecnica per ogni situazione.', 'Con eventi rari è preferibile l’interrupt, con eventi molto frequenti il polling.']
    ],
    saFare: ['Determinare il controllo che scopre un evento.', 'Calcolare ritardo e lavoro del polling.', 'Confrontare polling e interrupt su un medesimo evento.'],
    esercizi: [
      { d: 'Un driver controlla una periferica ogni 10 µs, a partire da 10 µs. Un evento avviene a 34 µs. Dopo quanti microsecondi dall’evento è scoperto?', segnaposto: 'Un numero', giuste: ['6', 'sei'],
        ok: 'Il primo controllo dopo l’evento è a 40 µs: 40 − 34 = 6.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'Il quattro è la distanza dal controllo precedente, a 30 µs, avvenuto prima dell’evento.' },
          { se: ['40', 'quaranta'], msg: 'Il quaranta è l’istante della scoperta. Il ritardo si conta dall’evento.' },
          { se: ['10', 'dieci'], msg: 'Il ritardo sarebbe di un periodo intero soltanto se l’evento avvenisse immediatamente dopo un controllo.' }
        ],
        altro: 'Il numero è diverso. Si determini il primo controllo dopo 34 µs, poi si sottragga.',
        indizi: ['I controlli avvengono a 10, 20, 30, 40 µs.', 'Il primo dopo l’evento è a 40 µs.', '40 − 34.'],
        svolgimento: ['Controlli: 10, 20, 30, 40.', 'Primo controllo utile: 40 µs.', 'Ritardo: 40 − 34 = 6 µs.'] },
      { d: 'Nella medesima situazione ogni controllo costa 4 cicli. Quanti cicli ha impiegato il driver fino alla scoperta?', segnaposto: 'Un numero', giuste: ['16', 'sedici'],
        ok: 'I controlli sono quattro, a 10, 20, 30 e 40 µs: 4 × 4 = 16 cicli.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'Quattro cicli sono il costo di un solo controllo. Vanno contati anche quelli a vuoto.' },
          { se: ['12', 'dodici'], msg: 'Va contato anche il controllo che scopre l’evento.' }
        ],
        altro: 'Il numero è diverso. Si contino tutti i controlli fino a quello utile, compreso, e si moltiplichi per 4.',
        indizi: ['I controlli fino alla scoperta sono 4.', 'Ognuno costa 4 cicli.', '4 × 4.'],
        svolgimento: ['Controlli: 4.', 'Costo di ciascuno: 4 cicli.', 'Totale: 16 cicli.'] },
      { d: 'Una tastiera produce in media un evento ogni 200 millisecondi. Quale tecnica è preferibile per il suo driver?', guida: 'Si scelga la risposta.', o: [
        { t: 'L’interrupt', ok: true, fb: 'Gli eventi sono rari. Il polling eseguirebbe migliaia di controlli a vuoto fra un tasto e il successivo.' },
        { t: 'Il polling con un periodo molto breve', fb: 'Sarebbe rapido, e occuperebbe il processore quasi sempre senza alcun risultato.' },
        { t: 'Il polling con un periodo molto lungo', fb: 'Richiederebbe poco lavoro, e i tasti sarebbero riconosciuti con un ritardo avvertibile.' }] }
    ],
    sfida: ['cslez4_3_02_io_interrupts_02', 'Frequenza e costo del polling']
  }
});
