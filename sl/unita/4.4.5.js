'use strict';
SL.unita445 = (() => {
  const conto = (p) => { const rx = p.b / 16, tx = p.b / 8, davanti = p.q + (p.usc === 'stessa' ? 1 : 0), coda = davanti * tx; return { rx, tx, davanti, coda, tot: rx + 1 + coda + tx, lat: (n) => rx + 1 + n * tx + tx }; };
  // fase: 0 il percorso · 1 la ricezione · 2 il ponte · 3 la coda · 4 l'invio · 5 il totale
  const quadro = (pre, p, f, o) => {
    const el = SL.el, c = conto(p), els = [], py = o.h + 12, xs = [o.x], W = o.ws;
    for (let k = 0; k < 4; k++) xs.push(xs[k] + W[k] + o.gap);
    els.push(el.box(pre + 's', xs[0], o.y, W[0], o.h, 'sorgente', p.b + ' byte', f === 0 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'i', xs[1], o.y, W[1], o.h, 'link di ingresso', '16 byte/µs', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'p', xs[2], o.y, W[2], o.h, 'ponte', f < 1 ? '·' : f === 1 ? 'riceve tutto' : f === 2 ? 'sceglie l’uscita' : 'ritrasmette', f === 2 ? 'att' : f > 2 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'u', xs[3], o.y, W[3], o.h, 'uscita 1 · verso la RAM', f < 3 ? '8 byte/µs' : f === 3 ? (c.davanti === 0 ? 'libera' : c.davanti === 1 ? '1 pacchetto in coda' : c.davanti + ' pacchetti in coda') : 'invia il pacchetto', f === 3 || f === 4 ? 'att' : f > 4 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'r', xs[4], o.y, W[4], o.h, 'RAM', f >= 5 ? 'arrivato' : '·', f >= 5 ? 'att' : '', { cls: 'stretta' }),
      el.box(pre + 'v', xs[3], o.y + py, W[3], o.h, 'uscita 2', p.usc === 'distinta' ? 'secondo flusso' : 'libera', p.usc === 'distinta' ? 'zero' : 'off', { cls: 'stretta' }),
      el.box(pre + 'w', xs[4], o.y + py, W[4], o.h, 'disco', p.usc === 'distinta' ? 'riceve' : '·', p.usc === 'distinta' ? 'zero' : 'off', { cls: 'stretta' }));
    const tot = xs[4] + W[4] - o.x, wq = (tot - 4 * 10) / 5, yq = o.y + 2 * py + 14;
    [['ricezione', c.rx, 1], ['ponte', 1, 2], ['coda', c.coda, 3], ['invio', c.tx, 4], ['latenza', c.tot, 5]].forEach((r, k) => els.push(el.box(pre + 'q' + k, o.x + k * (wq + 10), yq, wq, o.h, r[0], f >= r[2] ? r[1] + ' µs' : '·', f === r[2] ? 'att' : f > r[2] ? 'on' : '', { cls: 'stretta' })));
    return els;
  };
  return { conto, quadro };
})();
SL.registra('4.4.5', {
  titolo: 'Gerarchie e reti punto a punto',
  obiettivo: 'Obiettivo: calcolare il tempo che un pacchetto impiega ad attraversare due collegamenti e un ponte, e riconoscere i casi in cui un altro flusso lo rallenta.',
  concetti: [['bus', 'Collegamenti fra due componenti'], ['strati', 'Ponti di smistamento'], ['coda', 'L’attesa per l’uscita']],
  filigrana: ['bus', 'strati', 'coda'],
  richiami: {
    carte: [
      { sim: 'bus', da: 'Dall’unità 4.4.2', t: 'Link indipendenti', d: 'Due collegamenti separati operano nel medesimo istante.' },
      { sim: 'semaforo', da: 'Dall’unità 4.4.4', t: 'L’attesa', d: 'Il tempo occupato dai turni che precedono il proprio.' },
      { sim: 'pipeline', da: 'Dall’unità 3.5.1', t: 'La latenza', d: 'Il tempo fra l’inizio e la fine di un singolo lavoro.' }
    ],
    domanda: { d: 'Prima di proseguire: un collegamento trasporta 8 byte ogni microsecondo. Quanti microsecondi impiega a trasmettere 64 byte?', o: [
      { t: '8 µs', ok: true, fb: '64 diviso 8 dà 8.' },
      { t: '512 µs', fb: 'La quantità va divisa per la velocità: 64 ÷ 8.' },
      { t: '4 µs', fb: 'Quattro microsecondi sarebbero sufficienti a 16 byte per microsecondo.' }
    ] }
  },
  idea: {
    titolo: 'Dal bus unico alla rete di collegamenti',
    termini: ['collegamento punto a punto', 'ponte', 'pacchetto', 'store-and-forward'],
    testo: [
      'Un bus condiviso è adeguato finché i componenti sono pochi. Al crescere del loro numero le attese per il turno si allungano, e i sistemi attuali adottano un’altra disposizione. Ogni [[collegamento punto a punto]] unisce due soli componenti, che ne dispongono in modo esclusivo. Per consentire la comunicazione fra tutti i componenti, i collegamenti confluiscono in un [[ponte]], detto anche switch: un componente che riceve i dati da un collegamento e li ritrasmette su un altro. Più ponti in cascata formano una gerarchia, con il processore al vertice e i dispositivi alle estremità.',
      'In una rete di questo tipo i dati sono trasmessi in pacchetti. Un [[pacchetto]] è una sequenza di byte trattata come una sola unità, con l’indicazione del destinatario. Il ponte di questa unità opera con il metodo [[store-and-forward]]: attende la ricezione dell’ultimo byte del pacchetto, e soltanto allora ne inizia la ritrasmissione.',
      'Il tempo di attraversamento si compone di quattro parti. Si consideri un pacchetto di 64 byte. Il link di ingresso trasporta 16 byte per microsecondo, e la ricezione dura 4 µs. Il ponte impiega 1 µs per selezionare l’uscita. L’uscita trasporta 8 byte per microsecondo, e pertanto ogni pacchetto di questa dimensione la occupa per 8 µs. Se due pacchetti precedono quello considerato, la coda dura 16 µs. Segue l’invio del pacchetto, di altri 8 µs.',
      { fig: 'scena', w: 720, h: 222, titolo: 'Un pacchetto di 64 byte preceduto da due pacchetti', nota: 'La latenza è la somma delle quattro parti: 4 + 1 + 16 + 8 = 29 µs.', els: SL.unita445.quadro('g', { b: 64, q: 2, usc: 'solo' }, 5, { x: 10, y: 8, ws: [88, 150, 124, 196, 102], gap: 10, h: 54 }) },
      'La latenza del pacchetto, dall’invio del primo byte all’arrivo dell’ultimo, è di 29 µs. L’effetto di un secondo flusso che attraversa il medesimo ponte dipende dall’uscita richiesta. Se l’uscita è la medesima, e il secondo flusso è servito per primo, alla coda si aggiunge il tempo del suo invio. Se l’uscita è diversa, i due invii procedono insieme e la latenza del pacchetto considerato resta invariata. La contesa sorge soltanto sulla risorsa effettivamente condivisa.'
    ]
  },
  esperimento: {
    faremo: [
      'Un pacchetto deve raggiungere la RAM attraverso un link di ingresso, un ponte e un link di uscita. I controlli fissano la dimensione del pacchetto, il numero di pacchetti già in coda e il comportamento di un secondo flusso.',
      'L’esperimento somma le quattro parti del tempo: ricezione, ponte, coda, invio. È istruttivo confrontare il secondo flusso sulla medesima uscita con il secondo flusso su un’uscita indipendente.'
    ],
    vedrai: [
      ['bus', 'Il percorso', 'In alto: sorgente, link di ingresso, ponte, uscite e destinatari.'],
      ['tabella', 'I tempi', 'In basso: le quattro parti e la latenza totale, in microsecondi.']
    ]
  },
  lab: {
    titolo: 'Il percorso di un pacchetto',
    scena: { w: 860, h: 240 },
    atti: ['Il percorso', 'Nel ponte', 'In uscita', 'La latenza'],
    controlli: [
      { id: 'b', tipo: 'scelta', eti: 'Pacchetto', opzioni: [[32, '32 byte'], [64, '64 byte'], [128, '128 byte']], valore: 64 },
      { id: 'q', tipo: 'scelta', eti: 'Pacchetti già in coda', opzioni: [[0, '0'], [1, '1'], [2, '2']], valore: 2 },
      { id: 'usc', tipo: 'scelta', eti: 'Secondo flusso', opzioni: [['solo', 'assente'], ['stessa', 'medesima uscita, servito prima'], ['distinta', 'uscita indipendente']], valore: 'solo' }
    ],
    nota: 'I passi sono sempre sei. I pacchetti in coda hanno la medesima dimensione di quello osservato.',
    previsione: {
      domanda: (p) => 'Un pacchetto di ' + p.b + ' byte entra a 16 byte per microsecondo, il ponte impiega 1 µs, l’uscita trasporta 8 byte per microsecondo. In coda sono già presenti ' + (p.q === 1 ? '1 pacchetto' : p.q + ' pacchetti') + (p.usc === 'solo' ? '.' : p.usc === 'stessa' ? ', e un secondo flusso occupa la medesima uscita prima del pacchetto osservato.' : ', e un secondo flusso impiega un’uscita indipendente.') + ' Qual è la latenza?',
      opzioni: (p) => { const c = SL.unita445.conto(p); return [c.lat(p.q) - 1, c.lat(p.q), c.lat(p.q + 1)].map((v) => [v, v + ' µs']); }
    },
    confronto: (pred, esito, p) => { const c = SL.unita445.conto(p); return 'La previsione indicava ' + pred + ' µs. La latenza è ' + esito + ' µs. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === c.lat(p.q) - 1 ? 'Va contato anche il microsecondo impiegato dal ponte.' : p.usc === 'stessa' ? 'Il secondo flusso impiega la medesima uscita prima del pacchetto osservato, e aggiunge ' + c.tx + ' µs alla coda.' : p.usc === 'distinta' ? 'Il secondo flusso impiega un’altra uscita, e la coda del pacchetto osservato resta invariata.' : 'In coda sono presenti soltanto i pacchetti indicati.'); },
    costruisci(p) {
      const U = SL.unita445, c = U.conto(p), passi = [];
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 6, ws: [112, 150, 160, 236, 122], gap: 10, h: 56 });
      const hud = (f) => [['Fin qui', (f >= 5 ? c.tot : f === 4 ? c.tot : f === 3 ? c.rx + 1 + c.coda : f === 2 ? c.rx + 1 : f === 1 ? c.rx : 0) + ' µs', 'a'], ['Davanti', f >= 3 ? String(c.davanti) : '·'], ['Latenza', f >= 5 ? c.tot + ' µs' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Il percorso', 'La sorgente deve consegnare alla RAM un pacchetto di ' + p.b + ' byte. Il percorso attraversa il link di ingresso, il ponte e l’uscita 1. La misura del tempo ha inizio quando il primo byte lascia la sorgente.', {});
      P(1, 0, 'La ricezione', 'Il link di ingresso trasporta 16 byte per microsecondo: il ponte riceve l’ultimo byte dopo ' + p.b + ' ÷ 16 = ' + c.rx + ' µs. Fino a tale istante trattiene il pacchetto.', { calc: p.b + ' ÷ 16 = ' + c.rx + ' µs', chiedi: { d: 'Il ponte ha ricevuto metà del pacchetto. Può già iniziarne la ritrasmissione?', o: ['Sì, byte per byte', 'No, attende l’ultimo byte'], g: 1, no: 'Con il metodo store-and-forward il ponte ritrasmette soltanto pacchetti interi.' } });
      P(2, 1, 'Il ponte', 'Ricevuto l’intero pacchetto, il ponte legge il destinatario e seleziona l’uscita 1, quella verso la RAM. L’operazione richiede 1 µs.', { calc: c.rx + ' + 1 = ' + (c.rx + 1) + ' µs' });
      P(3, 2, 'La coda', (p.q === 0 ? 'Per l’uscita 1 nessun pacchetto era in attesa.' : 'Per l’uscita 1 ' + (p.q === 1 ? 'attendeva già un pacchetto.' : 'attendevano già ' + p.q + ' pacchetti.')) + (p.usc === 'stessa' ? ' Il secondo flusso richiede la medesima uscita ed è servito per primo: i pacchetti che precedono divengono ' + c.davanti + '.' : p.usc === 'distinta' ? ' Il secondo flusso impiega l’uscita 2, e sull’uscita 1 nulla cambia.' : '') + (c.davanti === 0 ? ' L’uscita è libera, e l’attesa è nulla.' : ' Ogni pacchetto occupa l’uscita per ' + p.b + ' ÷ 8 = ' + c.tx + ' µs: l’attesa è di ' + c.coda + ' µs.'), { calc: c.davanti + ' × ' + c.tx + ' = ' + c.coda + ' µs di coda' });
      P(4, 2, 'L’invio', 'L’uscita è ora disponibile per il pacchetto osservato. Essa trasporta 8 byte per microsecondo, la metà del link di ingresso, e l’invio dura ' + p.b + ' ÷ 8 = ' + c.tx + ' µs.', { calc: p.b + ' ÷ 8 = ' + c.tx + ' µs' });
      P(5, 3, 'La latenza', 'L’ultimo byte raggiunge la RAM. La latenza somma le quattro parti: ' + c.rx + ' di ricezione, 1 nel ponte, ' + c.coda + ' di coda, ' + c.tx + ' di invio.' + (p.usc === 'distinta' ? ' Il secondo flusso è stato trasmesso in parallelo senza alcuna aggiunta alla latenza.' : p.usc === 'stessa' ? ' Di questi, ' + c.tx + ' µs sono dovuti al secondo flusso.' : ''), { calc: c.rx + ' + 1 + ' + c.coda + ' + ' + c.tx + ' = ' + c.tot + ' µs', esito: [c.tot + ' µs', ''] });
      return { passi, esito: c.tot };
    }
  },
  bilancio: {
    regola: [
      'Latenza = ricezione + tempo del ponte + coda + invio. Ricezione e invio valgono i byte del pacchetto divisi per la velocità del rispettivo collegamento.',
      'Un altro flusso allunga la latenza soltanto se occupa la medesima uscita.'
    ],
    errori: [
      ['Impiegare la medesima velocità per i due collegamenti.', 'Ogni collegamento ha la propria, e i due tempi vanno calcolati separatamente.'],
      ['Trascurare il tempo del ponte.', 'Anche la selezione dell’uscita richiede tempo, in questo caso 1 µs.'],
      ['Considerare un rallentamento un flusso su un’altra uscita.', 'Le uscite di un ponte operano insieme, al pari dei link indipendenti.']
    ],
    saFare: ['Calcolare il tempo di ricezione e di invio di un pacchetto.', 'Calcolare l’attesa in coda.', 'Stabilire se un secondo flusso rallenta il pacchetto.'],
    esercizi: [
      { d: 'Un pacchetto di 128 byte entra in un ponte store-and-forward a 16 byte per microsecondo. Il ponte impiega 1 µs. L’uscita è libera e trasporta 8 byte per microsecondo. Qual è la latenza, in microsecondi?', segnaposto: 'Un numero', giuste: ['25', '25µs', '25μs', '25us', '25microsecondi'],
        ok: '128 ÷ 16 = 8, poi 1, poi 128 ÷ 8 = 16: complessivamente 25 µs.',
        diagnosi: [
          { se: ['24', '24µs', '24μs', '24us'], msg: 'Manca il microsecondo impiegato dal ponte.' },
          { se: ['17', '17µs', '17μs', '17us'], msg: 'L’uscita trasporta 8 byte per microsecondo, la metà dell’ingresso: l’invio dura 16 µs.' },
          { se: ['33', '33µs', '33μs', '33us'], msg: 'L’ingresso trasporta 16 byte per microsecondo: la ricezione dura 8 µs.' }
        ],
        altro: 'Il valore è diverso. Si sommino ricezione, ponte e invio: la coda è vuota.',
        indizi: ['Ricezione: 128 ÷ 16.', 'Invio: 128 ÷ 8.', '8 + 1 + 16 = 25.'],
        svolgimento: ['Ricezione: 128 ÷ 16 = 8 µs.', 'Ponte: 1 µs.', 'Coda: 0 µs.', 'Invio: 128 ÷ 8 = 16 µs.', 'Latenza: 25 µs.'] },
      { d: 'Il medesimo pacchetto di 128 byte è preceduto, per l’uscita, da tre pacchetti della medesima dimensione. L’uscita trasporta 8 byte per microsecondo. Quanto dura la sola attesa in coda, in microsecondi?', segnaposto: 'Un numero', giuste: ['48', '48µs', '48μs', '48us', '48microsecondi'],
        ok: 'Ogni pacchetto occupa l’uscita per 16 µs, e 3 × 16 = 48.',
        diagnosi: [
          { se: ['24', '24µs', '24μs', '24us'], msg: 'La coda si esaurisce alla velocità dell’uscita, 8 byte per microsecondo: 16 µs per pacchetto.' },
          { se: ['16', '16µs', '16μs', '16us'], msg: 'Questo è il tempo di un pacchetto. I pacchetti che precedono sono tre.' },
          { se: ['73', '73µs', '73μs', '73us'], msg: 'Questa è la latenza completa. La domanda riguarda la sola coda.' },
          { se: ['64', '64µs', '64μs', '64us'], msg: 'È stato contato anche l’invio del pacchetto osservato. In coda sono presenti i tre che lo precedono.' }
        ],
        altro: 'Il valore è diverso. Si calcoli il tempo per cui un pacchetto occupa l’uscita, e lo si moltiplichi per tre.',
        indizi: ['Un pacchetto: 128 ÷ 8 µs.', '128 ÷ 8 = 16 µs.', '3 × 16 = 48.'],
        svolgimento: ['Un pacchetto sull’uscita: 16 µs.', 'Tre pacchetti: 48 µs.'] },
      { d: 'Un secondo flusso attraversa il medesimo ponte e richiede un’uscita diversa da quella del pacchetto osservato. Quale effetto ha sulla sua latenza?', guida: 'Si scelga la risposta.', o: [
        { t: 'Nessuno, poiché le due uscite operano insieme', ok: true, fb: 'La contesa sorge soltanto su un’uscita condivisa.' },
        { t: 'Un aumento pari al tempo di un invio', fb: 'Questo accadrebbe se il secondo flusso occupasse la medesima uscita.' },
        { t: 'Un raddoppio', fb: 'I due flussi impiegano risorse diverse e procedono in parallelo.' }] }
    ],
    sfida: ['cslez4_4_05_buses_05', 'Collegamenti bidirezionali, code e latenza']
  }
});
