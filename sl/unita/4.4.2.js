'use strict';
SL.unita442 = (() => {
  const conto = (p) => { const b = p.w / 8, beat = p.t === 'ddr' ? 2 : 1, link = p.t === 'bus' ? 1 : 2; return { b, beat, link, una: b * beat * p.f, tot: link * b * beat * p.f, base: b * p.f }; };
  // fase: 0 la topologia · 1 i byte · 2 il ritmo · 3 le risorse · 4 il totale
  const quadro = (pre, p, f, o) => {
    const el = SL.el, c = conto(p), els = [], x2 = o.x + o.wl + o.gap, x3 = x2 + o.wc + o.gap, py = o.h + 12, modo = p.t === 'ddr' ? 'DDR' : 'SDR', val = f >= 2 ? c.una + ' MB/s' : '·';
    [0, 1].forEach((k) => els.push(el.box(pre + 'f' + k, o.x, o.y + k * py, o.wl, o.h, 'flusso ' + (k + 1), 'dati continui', 'on', { cls: 'stretta' }), el.box(pre + 'd' + k, x3, o.y + k * py, o.wl, o.h, 'destinatario ' + (k + 1), f >= 4 ? (p.t === 'bus' ? c.tot / 2 : c.una) + ' MB/s' : '·', f >= 4 ? 'att' : '', { cls: 'stretta' })));
    if (p.t === 'bus') els.push(el.box(pre + 'b', x2, o.y, o.wc, 2 * o.h + 12, 'bus condiviso · ' + modo + ' · un flusso per volta', val, f === 2 || f === 3 ? 'att' : f > 3 ? 'on' : '', {}));
    else[0, 1].forEach((k) => els.push(el.box(pre + 'l' + k, x2, o.y + k * py, o.wc, o.h, 'link ' + (k + 1) + ' · ' + modo, val, f === 2 || f === 3 ? 'att' : f > 3 ? 'on' : '', { cls: 'stretta' })));
    const wq = (o.wl * 2 + o.wc + 2 * o.gap - 4 * 10) / 5, yq = o.y + 2 * py + 14;
    [['byte per volta', f >= 1 ? c.b : '·', 1], ['volte per ciclo', f >= 2 ? c.beat : '·', 2], ['clock · MHz', f >= 2 ? p.f : '·', 2], ['risorse insieme', f >= 3 ? c.link : '·', 3], ['banda · MB/s', f >= 4 ? c.tot : '·', 4]].forEach((r, k) => els.push(el.box(pre + 'q' + k, o.x + k * (wq + 10), yq, wq, o.h, r[0], String(r[1]), f === r[2] ? 'att' : f > r[2] ? 'on' : '', { cls: 'stretta' })));
    return els;
  };
  return { conto, quadro };
})();
SL.registra('4.4.2', {
  titolo: 'Larghezza, clock e topologia',
  obiettivo: 'Obiettivo: stimare il numero di byte al secondo che un collegamento può trasportare, e distinguere il contributo della larghezza, della cadenza e del numero di collegamenti.',
  concetti: [['bus', 'I bit trasferiti insieme'], ['clock', 'I trasferimenti al secondo'], ['dispositivo', 'I collegamenti attivi insieme']],
  filigrana: ['bus', 'clock', 'dispositivo'],
  richiami: {
    carte: [
      { sim: 'clock', da: 'Dall’unità 2.1.4', t: 'Il ciclo di clock', d: 'Il periodo regolare che scandisce il lavoro dei circuiti.' },
      { sim: 'bit', da: 'Dall’unità 1.2.1', t: 'Il byte', d: 'Un gruppo di otto bit.' },
      { sim: 'bus', da: 'Dall’unità 4.4.1', t: 'Il bus condiviso', d: 'Un solo fascio di fili, che trasporta una transazione per volta.' }
    ],
    domanda: { d: 'Prima di proseguire: quanti byte formano 32 bit?', o: [
      { t: '4', ok: true, fb: '32 diviso 8 dà 4.' },
      { t: '8', fb: 'Otto sono i bit di un byte. I byte sono 32 diviso 8.' },
      { t: '32', fb: 'Trentadue sono i bit. Ogni byte ne contiene otto.' }
    ] }
  },
  idea: {
    titolo: 'Tre fattori che si moltiplicano',
    termini: ['larghezza del bus', 'megahertz', 'ddr', 'banda aggregata'],
    testo: [
      'La quantità di dati che un collegamento trasporta in un secondo dipende da tre grandezze. La prima è la [[larghezza del bus]]: il numero di bit trasferiti insieme, ciascuno sul proprio filo. Un bus largo 32 bit trasferisce quattro byte per volta, uno largo 64 bit ne trasferisce otto.',
      'La seconda grandezza è la cadenza dei trasferimenti. Il clock scandisce i cicli, e la sua frequenza si misura in [[megahertz]], abbreviato MHz: un megahertz equivale a un milione di cicli al secondo. Nel modo più semplice, denominato SDR, a ogni ciclo corrisponde un trasferimento. Un bus da 32 bit a 100 MHz trasporta pertanto 4 byte per 100 milioni di volte al secondo, cioè 400 milioni di byte al secondo: 400 MB/s. Il modo [[ddr|DDR]] impiega sia la salita sia la discesa del segnale di clock e compie due trasferimenti per ciclo, con il raddoppio del risultato.',
      'La terza grandezza è la disposizione dei collegamenti, la topologia. Due flussi di dati che impiegano il medesimo bus si alternano, e insieme restano entro la capacità di quell’unico bus. Se ciascun flusso dispone di un collegamento proprio verso il suo destinatario, i due collegamenti operano nel medesimo istante e le capacità si sommano.',
      { fig: 'scena', w: 720, h: 222, titolo: 'Due link DDR da 32 bit a 100 MHz', nota: 'Ogni link trasporta 4 × 2 × 100 = 800 MB/s. I due link operano insieme, e il totale è 1600 MB/s.', els: SL.unita442.quadro('g', { w: 32, f: 100, t: 'ddr' }, 4, { x: 10, y: 8, wl: 150, wc: 372, gap: 14, h: 54 }) },
      'La somma dei byte che tutti i collegamenti occupati trasferiscono in un secondo prende il nome di [[banda aggregata]], e si ottiene dal prodotto di quattro fattori: byte per trasferimento, trasferimenti per ciclo, milioni di cicli al secondo, collegamenti attivi insieme. Il numero ottenuto è un limite superiore. Esso descrive un collegamento che trasmette senza interruzioni, e le attese previste dalle regole di comunicazione lo riducono, come mostra l’unità successiva.'
    ]
  },
  esperimento: {
    faremo: [
      'Due flussi continui di dati devono raggiungere due destinatari. I controlli fissano la larghezza, la frequenza del clock e la topologia: un bus condiviso, due link separati, due link separati in modo DDR.',
      'L’esperimento calcola un fattore per volta: i byte di un trasferimento, la capacità di un collegamento, il numero di collegamenti attivi insieme. È istruttivo confrontare le tre topologie mantenendo invariati gli altri due controlli.'
    ],
    vedrai: [
      ['bus', 'La topologia', 'In alto: i due flussi, i collegamenti e i destinatari.'],
      ['tabella', 'I fattori', 'In basso: le quantità che, moltiplicate, danno la banda aggregata.']
    ]
  },
  lab: {
    titolo: 'La banda offerta dalla topologia',
    scena: { w: 860, h: 240 },
    atti: ['I flussi', 'Un collegamento', 'Tutti i collegamenti'],
    controlli: [
      { id: 'w', tipo: 'scelta', eti: 'Larghezza', opzioni: [[32, '32 bit'], [64, '64 bit']], valore: 32 },
      { id: 'f', tipo: 'scelta', eti: 'Clock', opzioni: [[50, '50 MHz'], [100, '100 MHz'], [200, '200 MHz']], valore: 100 },
      { id: 't', tipo: 'scelta', eti: 'Topologia', opzioni: [['bus', 'bus condiviso SDR'], ['link', 'due link SDR'], ['ddr', 'due link DDR']], valore: 'ddr' }
    ],
    nota: 'I passi sono sempre cinque. I megabyte sono decimali: 1 MB vale un milione di byte.',
    previsione: {
      domanda: (p) => { const c = SL.unita442.conto(p); return 'Con ' + p.w + ' bit e ' + p.f + ' MHz, un solo bus condiviso in modo SDR trasporta ' + c.base + ' MB/s. Quanta banda aggregata offre la topologia scelta ai due flussi?'; },
      opzioni: (p) => { const c = SL.unita442.conto(p); return [[1, 'La medesima, ' + c.base + ' MB/s'], [2, 'Il doppio, ' + 2 * c.base + ' MB/s'], [4, 'Il quadruplo, ' + 4 * c.base + ' MB/s']]; }
    },
    confronto: (pred, esito, p) => { const c = SL.unita442.conto(p); return 'La previsione indicava ' + pred * c.base + ' MB/s. La banda aggregata è ' + c.tot + ' MB/s. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.t === 'bus' ? 'I due flussi si alternano sull’unico bus, e il totale resta quello di un bus.' : p.t === 'link' ? 'I due link operano insieme, e le loro capacità si sommano una sola volta.' : 'Il modo DDR raddoppia la capacità di ogni link, e i link sono due: i raddoppi sono due.'); },
    costruisci(p) {
      const U = SL.unita442, c = U.conto(p), passi = [], ddr = p.t === 'ddr', bus = p.t === 'bus';
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 6, wl: 170, wc: 452, gap: 14, h: 56 });
      const hud = (f) => [['Un collegamento', f >= 2 ? c.una + ' MB/s' : '·', 'a'], ['Insieme', f >= 3 ? String(c.link) : '·'], ['Banda', f >= 4 ? c.tot + ' MB/s' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Due flussi, due destinatari', bus ? 'I due flussi devono impiegare il medesimo bus. I suoi fili trasportano un trasferimento per volta, e i flussi si alternano.' : 'Ogni flusso ha un link proprio verso il suo destinatario. I due link sono indipendenti, e possono operare nel medesimo istante.', {});
      P(1, 1, 'Un trasferimento', 'La larghezza è di ' + p.w + ' bit: a ogni trasferimento sono trasmessi insieme ' + p.w + ' bit, cioè ' + c.b + ' byte.', { calc: p.w + ' ÷ 8 = ' + c.b + ' byte', chiedi: { d: 'Quanti byte sono trasmessi insieme su ' + p.w + ' fili?', o: [String(p.w / 4), String(c.b), String(p.w)], g: 1, no: 'Ogni byte occupa otto fili: ' + p.w + ' ÷ 8 = ' + c.b + '.' } });
      P(2, 1, 'La cadenza', 'Il clock compie ' + p.f + ' milioni di cicli al secondo. ' + (ddr ? 'In modo DDR ogni ciclo comprende due trasferimenti.' : 'In modo SDR ogni ciclo comprende un trasferimento.') + ' Un collegamento sempre attivo trasporta ' + c.b + ' × ' + c.beat + ' × ' + p.f + ' = ' + c.una + ' milioni di byte al secondo.', { calc: c.b + ' × ' + c.beat + ' × ' + p.f + ' = ' + c.una + ' MB/s' });
      P(3, 2, 'I collegamenti attivi insieme', bus ? 'Il bus è uno solo. Mentre serve il primo flusso, il secondo attende: in ogni istante opera un solo collegamento.' : 'I link sono due, e nessuno dei due deve attendere l’altro: in ogni istante operano entrambi.', { calc: 'collegamenti attivi insieme: ' + c.link });
      P(4, 2, 'La banda aggregata', bus ? 'I ' + c.una + ' MB/s del bus si dividono fra i due flussi: in media ' + c.tot / 2 + ' MB/s a ciascun destinatario. Il totale resta ' + c.tot + ' MB/s.' : 'Ogni destinatario riceve ' + c.una + ' MB/s dal proprio link. Il totale è ' + c.link + ' × ' + c.una + ' = ' + c.tot + ' MB/s' + (ddr ? ', quattro volte il bus condiviso SDR: un raddoppio deriva dalla cadenza, l’altro dal numero di link.' : ', il doppio del bus condiviso SDR.'), { calc: c.link + ' × ' + c.una + ' = ' + c.tot + ' MB/s', esito: [c.tot + ' MB/s', ''] });
      return { passi, esito: c.tot / c.base };
    }
  },
  bilancio: {
    regola: [
      'Banda aggregata = byte per trasferimento × trasferimenti per ciclo × milioni di cicli al secondo × collegamenti attivi insieme. Il risultato è in MB/s.',
      'Il valore è un limite superiore ideale: presuppone collegamenti sempre occupati, senza attese.'
    ],
    errori: [
      ['Moltiplicare i bit per i megahertz.', 'Il risultato sarebbe in megabit. Per i byte la larghezza va prima divisa per otto.'],
      ['Contare due volte un bus condiviso da due flussi.', 'I flussi si alternano, e la risorsa resta una.'],
      ['Attribuire al modo DDR il raddoppio dovuto ai link.', 'I due fattori sono distinti: il DDR raddoppia ogni collegamento, i link separati raddoppiano i collegamenti.']
    ],
    saFare: ['Passare dalla larghezza in bit ai byte per trasferimento.', 'Calcolare i MB/s di un collegamento.', 'Sommare i collegamenti attivi insieme.'],
    esercizi: [
      { d: 'Un bus largo 64 bit opera a 200 MHz in modo SDR, senza pause. Quanti MB/s trasporta?', segnaposto: 'Un numero', giuste: ['1600', '1600mb/s', '1600mb'],
        ok: '64 bit sono 8 byte. 8 × 1 × 200 = 1600 MB/s.',
        diagnosi: [
          { se: ['12800', '12800mb/s'], msg: 'Sono stati moltiplicati i bit. La larghezza va divisa per otto: i byte per trasferimento sono 8.' },
          { se: ['3200', '3200mb/s'], msg: 'In modo SDR ogni ciclo comprende un solo trasferimento.' },
          { se: ['800', '800mb/s'], msg: '64 bit sono 8 byte, il doppio di un bus da 32 bit.' }
        ],
        altro: 'Il valore è diverso. Si moltiplichino i byte per trasferimento per i milioni di cicli al secondo.',
        indizi: ['64 bit corrispondono a 8 byte.', 'In SDR ogni ciclo comprende un trasferimento, e i cicli sono 200 milioni al secondo.', '8 × 200 = 1600.'],
        svolgimento: ['Byte per trasferimento: 64 ÷ 8 = 8.', 'Trasferimenti per ciclo: 1.', 'Banda: 8 × 1 × 200 = 1600 MB/s.'] },
      { d: 'Due flussi passano da un bus condiviso a due link indipendenti. Larghezza, clock e modo restano invariati. Che cosa cambia?', guida: 'Si scelga la risposta.', o: [
        { t: 'Ogni link ha la capacità che aveva il bus, e il totale raddoppia', ok: true, fb: 'La capacità di un collegamento dipende da larghezza e cadenza, rimaste invariate. Raddoppia il numero di collegamenti attivi insieme.' },
        { t: 'Ogni link ha il doppio della capacità del bus', fb: 'Larghezza e cadenza sono invariate, e pertanto la capacità di un collegamento è la medesima.' },
        { t: 'Nulla, poiché il totale resta quello del bus', fb: 'I due link operano nel medesimo istante, e le loro capacità si sommano.' }] },
      { d: 'Due link in modo DDR, larghi 32 bit, operano a 50 MHz, ciascuno verso il proprio destinatario. Qual è la banda aggregata in MB/s?', segnaposto: 'Un numero', giuste: ['800', '800mb/s', '800mb'],
        ok: 'Ogni link trasporta 4 × 2 × 50 = 400 MB/s, e i link sono due.',
        diagnosi: [
          { se: ['400', '400mb/s'], msg: 'Questa è la capacità di un link. I link attivi insieme sono due.' },
          { se: ['200', '200mb/s'], msg: 'Mancano due fattori: i due trasferimenti per ciclo del modo DDR e i due link.' },
          { se: ['1600', '1600mb/s'], msg: 'Il clock è a 50 MHz: ogni link trasporta 4 × 2 × 50 = 400 MB/s.' }
        ],
        altro: 'Il valore è diverso. I fattori sono quattro: byte, trasferimenti per ciclo, megahertz, link.',
        indizi: ['32 bit sono 4 byte, e in DDR i trasferimenti per ciclo sono 2.', 'Un link: 4 × 2 × 50 = 400 MB/s.', 'Due link: 2 × 400 = 800.'],
        svolgimento: ['Byte per trasferimento: 4.', 'Un link: 4 × 2 × 50 = 400 MB/s.', 'Due link: 800 MB/s.'] }
    ],
    sfida: ['cslez4_4_02_buses_02', 'Larghezza del bus e cicli di trasferimento']
  }
});
