'use strict';
SL.unita453 = (() => {
  const CODA = [80, 15, 55];
  // percorso della testina: elenco delle tappe { da, a, dist, tot }
  const percorso = (p, disc) => {
    const coda = CODA.filter((x) => p.cache === 'vuota' || x !== 80), tappe = []; let pos = p.pos, tot = 0;
    while (coda.length) { let i = 0; if ((disc || p.disc) === 'sstf') coda.forEach((x, j) => { if (Math.abs(x - pos) < Math.abs(coda[i] - pos)) i = j; }); const a = coda.splice(i, 1)[0], dist = Math.abs(a - pos); tot += dist; tappe.push({ da: pos, a, dist, tot }); pos = a; }
    return tappe;
  };
  const totale = (p, disc) => { const t = percorso(p, disc); return t[t.length - 1].tot; };
  const NOMI = { fcfs: 'FCFS', sstf: 'SSTF' };
  // asse dei cilindri da 0 a 100, di 5 in 5; «fatte» quante tappe sono già percorse
  const asse = (pre, p, tappe, fatte, o) => {
    const el = SL.el, els = [], pos = fatte === 0 ? p.pos : tappe[fatte - 1].a, serviti = tappe.slice(0, fatte).map((t) => t.a), inCache = p.cache === 'hit' ? [80] : [];
    for (let k = 0; k <= 20; k++) { const c = k * 5, rich = CODA.includes(c), qui = c === pos; els.push(el.cella(pre + 'c' + k, o.x + k * (o.w + 2), o.y, o.w, 32, qui ? 'T' : rich ? String(c) : '', qui ? 'att' : rich ? (serviti.includes(c) || (inCache.includes(c) && o.cacheVista) ? 'off' : inCache.includes(c) ? 'zero' : 'on') : '', { gi: k % 2 === 0 ? String(c) : '', piccola: true })); }
    const X = (c) => o.x + (c / 5) * (o.w + 2) + o.w / 2;
    tappe.slice(0, fatte).forEach((t, k) => els.push(el.linea(pre + 'l' + k, X(t.da), o.y + 62 + k * 12, X(t.a), o.y + 62 + k * 12, k === fatte - 1 ? 'att' : 'on')));
    return els;
  };
  return { CODA, percorso, totale, NOMI, asse };
})();
SL.registra('4.5.3', {
  titolo: 'Code, scheduling e cache',
  obiettivo: 'Alla fine saprai calcolare il cammino della testina con due regole di servizio, e spiegare che cosa cambia quando un blocco si trova già nella cache.',
  concetti: [['coda', 'Più richieste in attesa'], ['disco', 'L’ordine cambia il cammino'], ['cache', 'Una copia a portata di mano']],
  filigrana: ['disco', 'coda', 'cache'],
  richiami: {
    carte: [
      { sim: 'disco', da: 'Dall’unità 4.5.1', t: 'Il cilindro e il seek', d: 'Il numero di cilindro dice dove si trova il braccio. Spostarlo richiede tempo.' },
      { sim: 'semaforo', da: 'Dall’unità 4.4.4', t: 'Le regole di servizio', d: 'L’ordine in cui si servono richieste simultanee decide quanto attende ciascuna.' },
      { sim: 'storage', da: 'Dall’unità 4.5.2', t: 'Il blocco logico', d: 'L’unità con cui si chiedono dati a un disco.' }
    ],
    domanda: { d: 'Prima di proseguire: la testina è sul cilindro 40 e deve andare al cilindro 15. Quanti cilindri percorre?', o: [
      { t: '25', ok: true, fb: 'La distanza è la differenza fra i due numeri: 40 − 15.' },
      { t: '55', fb: 'I due numeri vanno sottratti: 40 − 15 = 25.' },
      { t: '15', fb: 'Quindici è il cilindro di arrivo. Il cammino è la distanza da 40.' }
    ] }
  },
  idea: {
    titolo: 'Lo stesso lavoro, due itinerari',
    termini: ['fcfs', 'sstf', 'cache'],
    testo: [
      'Un disco riceve spesso più richieste di quante ne possa servire subito, e quelle in attesa formano una coda. I dati da leggere sono gli stessi qualunque sia l’ordine. Il cammino del braccio invece cambia, e con esso il tempo speso nei seek.',
      'La regola più semplice è [[fcfs|FCFS]], dall’inglese «first come, first served»: si serve nell’ordine di arrivo. Supponiamo la testina sul cilindro 40 e tre richieste arrivate nell’ordine 80, 15, 55. La testina percorre 40 cilindri fino a 80, poi 65 per tornare a 15, poi altri 40 fino a 55: in tutto 145.',
      'La regola [[sstf|SSTF]], «shortest seek time first», sceglie ogni volta la richiesta più vicina alla posizione attuale. Da 40 la più vicina è 55. Da 55 la più vicina fra le rimaste è 80, e per ultima resta 15. Il cammino è 15 + 25 + 65 = 105 cilindri. La scelta viene rifatta dopo ogni lettura, a partire dalla nuova posizione.',
      { fig: 'scena', w: 720, h: 152, titolo: 'Da 40, con la regola SSTF: 55, poi 80, poi 15', nota: 'T è la testina. Ogni tratto orizzontale è uno spostamento: 15, 25 e 65 cilindri.', els: [SL.el.nota('gt', 10, 0, 'CILINDRI', 'mono')].concat(SL.unita453.asse('g', { pos: 40, disc: 'sstf', cache: 'vuota' }, SL.unita453.percorso({ pos: 40, disc: 'sstf', cache: 'vuota' }), 3, { x: 10, y: 24, w: 31 })) },
      'SSTF accorcia il cammino, e ha il difetto già visto nella priorità fissa: una richiesta lontana può essere scavalcata a lungo, se ne arrivano di continuo di più vicine. C’è poi un modo di evitare del tutto lo spostamento. Una [[cache]] è una memoria più veloce che conserva una copia dei dati usati di recente. Se il blocco richiesto sul cilindro 80 si trova già nella cache, la richiesta viene soddisfatta da lì, e il cilindro 80 esce dall’itinerario del braccio.'
    ]
  },
  esperimento: {
    faremo: [
      'Tre richieste arrivano nell’ordine 80, 15, 55. Sceglierai la posizione iniziale della testina, la regola di servizio, e se il blocco del cilindro 80 è già nella cache.',
      'Seguiremo la testina uno spostamento per volta, sommando i cilindri percorsi. Alla fine confronteremo il totale con quello dell’altra regola. Il modello conta soltanto gli spostamenti del braccio e trascura la rotazione.'
    ],
    vedrai: [
      ['disco', 'L’asse dei cilindri', 'In alto: i cilindri da 0 a 100, la testina T e le richieste. I tratti sotto l’asse sono gli spostamenti.'],
      ['coda', 'La coda', 'In basso: le richieste in ordine di arrivo, lo spostamento in corso e il cammino accumulato.']
    ]
  },
  lab: {
    titolo: 'L’itinerario della testina',
    scena: { w: 860, h: 226 },
    atti: ['La coda', 'Gli spostamenti', 'Il cammino'],
    controlli: [
      { id: 'pos', tipo: 'scelta', eti: 'Testina sul cilindro', opzioni: [[20, '20'], [40, '40'], [60, '60']], valore: 40 },
      { id: 'disc', tipo: 'scelta', eti: 'Regola', opzioni: [['fcfs', 'FCFS'], ['sstf', 'SSTF']], valore: 'fcfs' },
      { id: 'cache', tipo: 'scelta', eti: 'Cache', opzioni: [['vuota', 'vuota'], ['hit', 'contiene il blocco del cilindro 80']], valore: 'vuota' }
    ],
    nota: 'I passi sono sempre cinque. Le richieste arrivano insieme, nell’ordine 80, 15, 55.',
    previsione: {
      domanda: (p) => 'La testina è sul cilindro ' + p.pos + '. Le richieste, in ordine di arrivo, riguardano i cilindri 80, 15 e 55' + (p.cache === 'hit' ? ', e il blocco del cilindro 80 è già nella cache' : '') + '. Con la regola ' + SL.unita453.NOMI[p.disc] + ', quanti cilindri percorre in tutto la testina?',
      opzioni: (p) => { const U = SL.unita453, a = U.totale(p, 'fcfs'), b = U.totale(p, 'sstf'); return Array.from(new Set([b, a, Math.max(a, b) + 40])).sort((x, y) => x - y).map((v) => [v, v + ' cilindri']); }
    },
    confronto: (pred, esito, p) => { const U = SL.unita453; return 'Avevi previsto ' + pred + ' cilindri. La testina ne percorre ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.disc === 'fcfs' ? 'FCFS segue l’ordine di arrivo, anche quando obbliga a tornare indietro.' : 'SSTF sceglie ogni volta la richiesta più vicina alla posizione attuale.'); },
    costruisci(p) {
      const U = SL.unita453, el = SL.el, passi = [], tappe = U.percorso(p), hit = p.cache === 'hit', altra = p.disc === 'fcfs' ? 'sstf' : 'fcfs', totAltra = U.totale(p, altra), tot = tappe[tappe.length - 1].tot;
      const quadro = (fatte, cacheVista, fine) => {
        const els = [el.nota('t0', 20, 0, 'CILINDRI', 'mono')].concat(U.asse('a', p, tappe, fatte, { x: 20, y: 24, w: 37, cacheVista }));
        const t = fatte > 0 ? tappe[fatte - 1] : null, restano = tappe.slice(fatte).map((x) => x.a);
        els.push(el.box('b0', 20, 150, 190, 56, 'coda di arrivo', '80, 15, 55', fatte === 0 && !cacheVista ? 'att' : 'on', { cls: 'stretta' }),
          el.box('b1', 222, 150, 190, 56, 'cache', hit ? (cacheVista ? 'risponde per 80' : 'blocco di 80') : 'vuota', hit && cacheVista && fatte === 0 ? 'att' : hit ? 'zero' : 'off', { cls: 'stretta' }),
          el.box('b2', 424, 150, 130, 56, 'da servire', restano.length ? restano.length + ' su disco' : 'nessuna', 'on', { cls: 'stretta' }),
          el.box('b3', 566, 150, 130, 56, 'spostamento', t && !fine ? String(t.dist) : '·', t && !fine ? 'att' : '', { cls: 'stretta' }),
          el.box('b4', 708, 150, 132, 56, 'cammino', t ? String(t.tot) : '0', fine ? 'att' : t ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (fatte) => [['Testina', 'cilindro ' + (fatte ? tappe[fatte - 1].a : p.pos), 'a'], ['Spostamento', fatte ? String(tappe[fatte - 1].dist) : '·'], ['Cammino', fatte ? String(tappe[fatte - 1].tot) : '0', 'c']];
      const P = (fatte, cacheVista, fine, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(fatte), els: quadro(fatte, cacheVista, fine) }, extra));

      P(0, false, false, 0, 'La coda', 'La testina è ferma sul cilindro ' + p.pos + '. Tre richieste sono arrivate insieme, nell’ordine 80, 15, 55. La regola di servizio è ' + U.NOMI[p.disc] + '.', {});
      if (hit) P(0, true, false, 0, 'La cache', 'Il blocco richiesto sul cilindro 80 si trova già nella cache. La richiesta viene soddisfatta dalla copia, senza muovere il braccio, e al disco restano i cilindri 15 e 55.', { calc: 'coda del disco: 15, 55' });
      tappe.forEach((t, k) => {
        const restanti = [t.a].concat(tappe.slice(k + 1).map((x) => x.a)), scelta = p.disc === 'sstf' && restanti.length > 1;
        P(k + 1, hit, false, 1, 'Lettura sul cilindro ' + t.a, (p.disc === 'fcfs' ? 'Nell’ordine di arrivo tocca al cilindro ' + t.a + '.' : restanti.length > 1 ? 'Dal cilindro ' + t.da + ', la richiesta più vicina è quella sul cilindro ' + t.a + ': dista ' + t.dist + ', mentre ' + restanti.slice(1).map((x) => x + ' dista ' + Math.abs(x - t.da)).join(' e ') + '.' : 'Resta soltanto il cilindro ' + t.a + '.') + ' La testina percorre ' + t.dist + ' cilindri, e il cammino sale a ' + t.tot + '.',
          Object.assign({ calc: '|' + t.a + ' − ' + t.da + '| = ' + t.dist + ' · cammino ' + t.tot }, scelta && k === 0 ? { chiedi: { d: 'Dal cilindro ' + t.da + ', quale richiesta è la più vicina?', o: restanti.slice().sort((x, y) => x - y).map((x) => 'Cilindro ' + x), g: restanti.slice().sort((x, y) => x - y).indexOf(t.a), no: 'Le distanze sono ' + restanti.map((x) => Math.abs(x - t.da) + ' per ' + x).join(', ') + '.' } } : {}));
      });
      P(tappe.length, hit, true, 2, 'Il cammino', 'Tutte le richieste sono servite. Con ' + U.NOMI[p.disc] + ' la testina ha percorso ' + tappe.map((t) => t.dist).join(' + ') + ' = ' + tot + ' cilindri. ' + (totAltra === tot ? 'Con ' + U.NOMI[altra] + ' il cammino sarebbe stato lo stesso: in questo caso le due regole scelgono lo stesso ordine.' : 'Con ' + U.NOMI[altra] + ' ne avrebbe percorsi ' + totAltra + ', ' + Math.abs(totAltra - tot) + ' in ' + (totAltra > tot ? 'più' : 'meno') + '.') + (hit ? ' La richiesta servita dalla cache non ha aggiunto alcuno spostamento.' : ''), { calc: tappe.map((t) => t.dist).join(' + ') + ' = ' + tot + ' cilindri', esito: [tot + ' cilindri', ''] });
      return { passi, esito: tot };
    }
  },
  bilancio: {
    regola: [
      'FCFS serve le richieste nell’ordine di arrivo. SSTF sceglie ogni volta quella più vicina alla posizione attuale della testina.',
      'Il cammino è la somma delle distanze fra una posizione e la successiva. Una richiesta soddisfatta dalla cache esce dall’itinerario.'
    ],
    errori: [
      ['Con SSTF, ordinare le richieste una volta sola, rispetto alla posizione iniziale.', 'La scelta si rifà dopo ogni lettura, dalla nuova posizione.'],
      ['Sommare i numeri dei cilindri.', 'Si sommano le distanze, cioè le differenze fra posizioni consecutive.'],
      ['Ritenere SSTF migliore in ogni senso.', 'Accorcia il cammino, e può far attendere a lungo una richiesta lontana.']
    ],
    saFare: ['Calcolo il cammino con FCFS.', 'Calcolo il cammino con SSTF.', 'Tolgo dall’itinerario una richiesta servita dalla cache.'],
    esercizi: [
      { d: 'La testina è sul cilindro 50. Le richieste arrivano nell’ordine 10, 60, 30. Quanti cilindri percorre in tutto con la regola FCFS?', segnaposto: 'Un numero', giuste: ['120', 'centoventi', '120cilindri'],
        ok: 'Da 50 a 10 sono 40, da 10 a 60 sono 50, da 60 a 30 sono 30: 120.',
        diagnosi: [
          { se: ['60', '60cilindri'], msg: 'Questo è il cammino con SSTF. FCFS segue l’ordine di arrivo: 10, 60, 30.' },
          { se: ['100', '100cilindri'], msg: 'Hai sommato i numeri dei cilindri. Vanno sommate le distanze fra una posizione e la successiva.' },
          { se: ['90', '90cilindri'], msg: 'Manca l’ultimo spostamento, da 60 a 30.' }
        ],
        altro: 'Il numero è diverso. Somma le tre distanze: da 50 a 10, da 10 a 60, da 60 a 30.',
        indizi: ['Primo spostamento: 50 − 10 = 40.', 'Secondo: 60 − 10 = 50. Terzo: 60 − 30 = 30.', '40 + 50 + 30 = 120.'],
        svolgimento: ['50 → 10: 40 cilindri.', '10 → 60: 50 cilindri.', '60 → 30: 30 cilindri.', 'Cammino: 120 cilindri.'] },
      { d: 'Stessa situazione: testina sul cilindro 50, richieste per i cilindri 10, 60, 30. Quanti cilindri percorre in tutto con la regola SSTF?', segnaposto: 'Un numero', giuste: ['60', 'sessanta', '60cilindri'],
        ok: 'Da 50 il più vicino è 60, poi 30, poi 10: 10 + 30 + 20 = 60.',
        diagnosi: [
          { se: ['120', '120cilindri'], msg: 'Questo è il cammino con FCFS. SSTF sceglie ogni volta la richiesta più vicina.' },
          { se: ['80', '80cilindri'], msg: 'Dopo il cilindro 60 la scelta va rifatta: da 60 il più vicino è 30, a distanza 30.' }
        ],
        altro: 'Il numero è diverso. Scegli la richiesta più vicina, spostati, e ripeti la scelta dalla nuova posizione.',
        indizi: ['Da 50 le distanze sono 40, 10 e 20: si va a 60.', 'Da 60 le distanze sono 50 e 30: si va a 30, poi a 10.', '10 + 30 + 20 = 60.'],
        svolgimento: ['50 → 60: 10 cilindri.', '60 → 30: 30 cilindri.', '30 → 10: 20 cilindri.', 'Cammino: 60 cilindri.'] },
      { d: 'Tre richieste sono in coda, e il blocco chiesto dalla prima si trova già nella cache. Che cosa accade?', guida: 'Scegli la risposta.', o: [
        { t: 'La prima richiesta è soddisfatta dalla copia, e il braccio serve soltanto le altre due', ok: true, fb: 'Il cilindro di quel blocco esce dall’itinerario.' },
        { t: 'Il braccio va comunque sul cilindro, per controllare che la copia sia giusta', fb: 'La cache esiste proprio per evitare lo spostamento.' },
        { t: 'Le tre richieste vengono servite tutte dalla cache', fb: 'Nella cache si trova soltanto il blocco della prima.' }] }
    ],
    sfida: ['cslez4_5_05_disks_05', 'Ordine delle letture e località']
  }
});
