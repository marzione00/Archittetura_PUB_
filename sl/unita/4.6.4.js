'use strict';
SL.unita464 = (() => {
  const conto = (p) => { const gc = p.st === 'gc', n = gc ? p.v : 0; return { gc, n, migr: n * 250, canc: gc ? 2000 : 0, tot: n * 250 + (gc ? 2000 : 0) + 200, amp: n + 1 }; };
  // fase gc: 0 lo stato · 1 la vittima · 2 le migrazioni · 3 la cancellazione · 4 la scrittura · 5 il conto
  // fase free: 0 lo stato · 4 la scrittura · 5 il conto
  const quadro = (pre, p, f, o) => {
    const el = SL.el, c = conto(p), els = [], gc = c.gc, passo = o.wp + 4;
    els.push(el.nota(pre + 't0', o.x, o.y, gc ? 'BLOCCO VITTIMA · otto pagine' : 'BLOCCO PIENO · otto pagine', 'mono', gc && f === 1 ? 'att' : ''), el.nota(pre + 't1', o.x, o.y + 78, 'BLOCCO DI RISERVA · otto pagine', 'mono'));
    for (let k = 0; k < 8; k++) {
      const valida = k < p.v, cancellato = gc && f >= 3;
      els.push(el.cella(pre + 'a' + k, o.x + k * passo, o.y + 24, o.wp, 32, cancellato ? (f >= 4 && k === 0 ? 'N' : '·') : valida ? 'V' : 'x', cancellato ? (f >= 4 && k === 0 ? 'att' : '') : valida ? (gc && f === 2 ? 'att' : 'on') : 'off', { piccola: true }));
      const copiata = gc && f >= 2 && k < p.v, nuova = !gc && f >= 4 && k === 5;
      els.push(el.cella(pre + 'b' + k, o.x + k * passo, o.y + 102, o.wp, 32, copiata ? 'V' : nuova ? 'N' : !gc && k < 5 ? 'V' : '·', copiata ? (f === 2 ? 'att' : 'on') : nuova ? 'att' : !gc && k < 5 ? 'on' : '', { piccola: true }));
    }
    const xq = o.x + 8 * passo + 26, wq = (o.w - (xq - o.x) - 10) / 2;
    [['migrazioni', gc ? (f >= 2 ? c.migr + ' µs' : '·') : 'nessuna', 2], ['cancellazione', gc ? (f >= 3 ? '2000 µs' : '·') : 'nessuna', 3], ['scrittura', f >= 4 ? '200 µs' : '·', 4], ['latenza', f >= 5 ? c.tot + ' µs' : '·', 5]].forEach((r, k) => els.push(el.box(pre + 'q' + k, xq + (k % 2) * (wq + 10), o.y + 20 + Math.floor(k / 2) * 66, wq, 54, r[0], r[1], f === r[2] ? 'att' : f > r[2] && r[1] !== 'nessuna' ? 'on' : '', { cls: 'stretta' })));
    return els;
  };
  return { conto, quadro };
})();
SL.registra('4.6.4', {
  titolo: 'FTL, durata e latenza dipendente dallo stato',
  obiettivo: 'Obiettivo: calcolare quanto dura una scrittura su un’unità a stato solido secondo lo stato in cui la trova, e che cosa misura l’amplificazione di scrittura.',
  concetti: [['ssd', 'Recuperare lo spazio'], ['clock', 'La stessa richiesta, tempi diversi'], ['bilancio', 'Scritture richieste e scritture fatte']],
  filigrana: ['ssd', 'clock', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'ssd', da: 'Dall’unità 4.6.3', t: 'L’aggiornamento fuori posto', d: 'Ogni aggiornamento va in una pagina libera, e la vecchia diventa invalida.' },
      { sim: 'ssd', da: 'Dall’unità 4.6.3', t: 'Il blocco flash', d: 'La cancellazione riguarda tutte le sue pagine insieme.' },
      { sim: 'clock', da: 'Dall’unità 4.5.2', t: 'Il tempo di servizio', d: 'Il tempo che un dispositivo impiega a soddisfare una richiesta.' }
    ],
    domanda: { d: 'Prima di proseguire: un blocco contiene tre pagine valide e cinque invalide. Che cosa va fatto prima di cancellarlo?', o: [
      { t: 'Copiare altrove le tre pagine valide', ok: true, fb: 'La cancellazione distruggerebbe anche i dati ancora in uso.' },
      { t: 'Copiare altrove le cinque pagine invalide', fb: 'Le pagine invalide contengono versioni superate, che nessuno leggerà più.' },
      { t: 'Nulla: la cancellazione risparmia le pagine valide', fb: 'La cancellazione agisce su tutto il blocco, senza eccezioni.' }
    ] }
  },
  idea: {
    titolo: 'Il prezzo delle pagine invalide',
    termini: ['garbage collection', 'blocco vittima', 'amplificazione di scrittura', 'usura'],
    testo: [
      'Scrivendo sempre in pagine nuove, prima o poi le pagine libere finiscono. Il controller deve allora recuperare lo spazio occupato dalle pagine invalide, con un lavoro chiamato [[garbage collection]], alla lettera «raccolta dei rifiuti». Sceglie un blocco, il [[blocco vittima]], di solito quello con più pagine invalide. Copia le pagine ancora valide in un blocco di riserva, aggiorna la mappa, e infine cancella la vittima, che torna interamente libera.',
      'Questo lavoro ha un costo in tempo, e lo paga la scrittura che lo ha reso necessario. Nel modello leggere una pagina richiede 50 µs, programmarla 200 µs, cancellare un blocco 2000 µs. Se la vittima contiene tre pagine valide, ogni copia costa una lettura e una programmazione, cioè 250 µs: 750 µs in tutto. Poi la cancellazione, 2000 µs, e infine la pagina richiesta, 200 µs. Totale: 2950 µs.',
      { fig: 'scena', w: 720, h: 152, titolo: 'Una scrittura che deve prima recuperare un blocco', nota: 'V è una pagina valida, x una invalida, N la pagina appena scritta. Le tre V sono state copiate nel blocco di riserva.', els: SL.unita464.quadro('g', { v: 3, st: 'gc' }, 5, { x: 10, y: 0, wp: 38, w: 700 }) },
      'La stessa scrittura, trovando una pagina libera già pronta, sarebbe durata 200 µs. La latenza di un’unità a stato solido dipende quindi dallo stato in cui la richiesta la trova, oltre che dalla richiesta. Per misurare il lavoro in più si usa l’[[amplificazione di scrittura]]: il rapporto fra le pagine programmate davvero e quelle che il computer ha chiesto di scrivere. Nell’esempio le programmazioni sono quattro per una pagina richiesta, e l’amplificazione vale 4.',
      'L’amplificazione conta anche per un’altra ragione. Ogni cancellazione logora un poco le celle, e dopo un certo numero di cicli un blocco smette di trattenere i dati: è l’[[usura]]. Più programmazioni significano più cancellazioni, e una vita più breve. Per questo il controller distribuisce le scritture su tutti i blocchi, in modo che si consumino insieme.'
    ]
  },
  esperimento: {
    faremo: [
      'Il computer chiede di scrivere una pagina. Sceglierai se il controller trova una pagina libera oppure deve prima recuperare un blocco, e quante pagine valide contiene il blocco vittima.',
      'Sommeremo i tempi delle migrazioni, della cancellazione e della scrittura richiesta, e calcoleremo l’amplificazione. Porta le pagine valide da 1 a 7 e osserva come cresce la latenza.'
    ],
    vedrai: [
      ['ssd', 'I due blocchi', 'A sinistra: il blocco vittima e il blocco di riserva, con otto pagine ciascuno. V valida, x invalida, N nuova.'],
      ['clock', 'I tempi', 'A destra: migrazioni, cancellazione, scrittura richiesta e latenza totale.']
    ]
  },
  lab: {
    titolo: 'Quanto dura una scrittura',
    scena: { w: 860, h: 160 },
    atti: ['Lo stato', 'Il recupero', 'La scrittura', 'Il conto'],
    controlli: [
      { id: 'st', tipo: 'scelta', eti: 'Spazio libero', opzioni: [['gc', 'va recuperato un blocco'], ['free', 'una pagina è già libera']], valore: 'gc' },
      { id: 'v', tipo: 'scelta', eti: 'Pagine valide nella vittima', opzioni: [[0, '0'], [1, '1'], [3, '3'], [5, '5'], [7, '7']], valore: 3 }
    ],
    nota: 'I passi sono sei quando va recuperato un blocco, tre quando una pagina è già libera. Lettura 50 µs, programmazione 200 µs, cancellazione 2000 µs.',
    previsione: {
      domanda: (p) => 'Il computer chiede di scrivere una pagina. ' + (p.st === 'gc' ? 'Il controller non ha pagine libere, e deve recuperare un blocco che contiene ' + (p.v === 1 ? '1 pagina valida' : p.v + ' pagine valide') + '.' : 'Il controller ha già una pagina libera. Un altro blocco contiene ' + (p.v === 1 ? '1 pagina valida' : p.v + ' pagine valide') + ' e alcune invalide.') + ' Quanto dura la scrittura?',
      opzioni: (p) => Array.from(new Set([200, 2200, p.v * 250 + 2200])).map((v) => [v, v + ' µs'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' µs. La scrittura dura ' + esito + ' µs. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.st === 'free' ? 'Con una pagina già libera basta la programmazione richiesta. Le pagine dell’altro blocco restano dove sono.' : pred === 200 ? 'Senza pagine libere il controller deve prima recuperare un blocco.' : 'Prima della cancellazione vanno copiate le pagine valide: 250 µs ciascuna.'),
    costruisci(p) {
      const U = SL.unita464, c = U.conto(p), passi = [];
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, wp: 44, w: 820 });
      const hud = (f) => [['Programmazioni', String(f >= 4 ? c.amp : f >= 2 ? c.n : 0), 'a'], ['Amplificazione', f >= 5 ? String(c.amp) : '·'], ['Latenza', f >= 5 ? c.tot + ' µs' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      if (c.gc) {
        P(0, 0, 'Lo stato', 'Il computer chiede di scrivere una pagina, e il controller non ha pagine libere da offrirle. Il blocco di riserva è cancellato, ed è tenuto da parte proprio per i recuperi.', {});
        P(1, 1, 'Il blocco vittima', 'Il controller sceglie come vittima un blocco con ' + (p.v === 1 ? '1 pagina valida' : p.v + ' pagine valide') + ' e ' + (8 - p.v) + ' invalide. Cancellandolo recupererà otto pagine, ma prima deve salvare quelle valide.', { chiedi: { d: 'Quante pagine vanno copiate nel blocco di riserva?', o: Array.from(new Set([String(8 - p.v), String(p.v), '8'])), g: Array.from(new Set([String(8 - p.v), String(p.v), '8'])).indexOf(String(p.v)), no: 'Si copiano soltanto le pagine valide. Le invalide contengono versioni superate.' } });
        P(2, 1, 'Le migrazioni', p.v === 0 ? 'La vittima non contiene pagine valide, e non c’è nulla da copiare. È il caso più favorevole.' : 'Ogni pagina valida viene letta, 50 µs, e programmata nel blocco di riserva, 200 µs. Per ' + (p.v === 1 ? 'una pagina' : p.v + ' pagine') + ' servono ' + p.v + ' × 250 = ' + c.migr + ' µs. La mappa viene aggiornata.', { calc: p.v + ' × (50 + 200) = ' + c.migr + ' µs' });
        P(3, 1, 'La cancellazione', 'La vittima non contiene più nulla di utile, e viene cancellata per intero. L’operazione richiede 2000 µs, e le otto pagine tornano libere.', { calc: 'cancellazione: 2000 µs' });
        P(4, 2, 'La scrittura richiesta', 'Soltanto ora il controller programma la pagina chiesta dal computer, in una delle pagine appena liberate: altri 200 µs.', { calc: 'programmazione: 200 µs' });
        P(5, 3, 'Il conto', 'La latenza è ' + c.migr + ' + 2000 + 200 = ' + c.tot + ' µs. Le programmazioni fisiche sono ' + c.amp + ' per una pagina richiesta: l’amplificazione di scrittura vale ' + c.amp + '.', { calc: c.migr + ' + 2000 + 200 = ' + c.tot + ' µs · amplificazione ' + c.amp, esito: [c.tot + ' µs', ''] });
      } else {
        P(0, 0, 'Lo stato', 'Il computer chiede di scrivere una pagina. Il controller ha già pagine libere nel blocco di riserva. L’altro blocco è pieno, con ' + (p.v === 1 ? '1 pagina valida' : p.v + ' pagine valide') + ' e ' + (8 - p.v) + ' invalide, e per ora resta com’è.', {});
        P(4, 2, 'La scrittura richiesta', 'Il controller programma subito la pagina in una posizione libera: 200 µs. Nessuna migrazione, nessuna cancellazione.', { calc: 'programmazione: 200 µs', chiedi: { d: 'Le pagine valide dell’altro blocco hanno influito sulla durata?', o: ['Sì', 'No'], g: 1, no: 'Il blocco pieno non è stato toccato. Conterà quando servirà recuperarlo.' } });
        P(5, 3, 'Il conto', 'La latenza è di 200 µs. Una programmazione fisica per una pagina richiesta: l’amplificazione di scrittura vale 1, il minimo possibile.', { calc: '200 µs · amplificazione 1', esito: ['200 µs', ''] });
      }
      return { passi, esito: c.tot };
    }
  },
  bilancio: {
    regola: [
      'Latenza di una scrittura che richiede un recupero = pagine valide × (lettura + programmazione) + cancellazione + programmazione richiesta.',
      'Amplificazione di scrittura = pagine programmate ÷ pagine richieste dal computer. Vale 1 quando non serve alcun recupero.'
    ],
    errori: [
      ['Contare per ogni migrazione la sola programmazione.', 'La pagina va prima letta: ogni copia costa lettura più programmazione.'],
      ['Dimenticare la pagina richiesta nel conto delle programmazioni.', 'Alle copie va aggiunta la scrittura che il computer aveva chiesto.'],
      ['Attendersi la stessa durata da due scritture uguali.', 'La durata dipende dallo stato dell’unità: pagine libere pronte oppure blocco da recuperare.']
    ],
    saFare: ['Calcolare la latenza di una scrittura con recupero.', 'Calcolare l’amplificazione di scrittura.', 'Spiegare perché l’amplificazione accorcia la vita della flash.'],
    esercizi: [
      { d: 'Lettura 50 µs, programmazione 200 µs, cancellazione di un blocco 2000 µs. Per scrivere una pagina il controller deve recuperare un blocco con 5 pagine valide. Quanto dura la scrittura, in microsecondi?', segnaposto: 'Un numero', giuste: ['3450', '3450µs', '3450μs', '3450us'],
        ok: '5 × 250 = 1250, più 2000 di cancellazione, più 200 per la pagina richiesta: 3450 µs.',
        diagnosi: [
          { se: ['3250', '3250µs', '3250μs', '3250us'], msg: 'Manca la programmazione della pagina richiesta, 200 µs.' },
          { se: ['3200', '3200µs', '3200μs', '3200us'], msg: 'Ogni migrazione comprende anche la lettura della pagina: 250 µs, e 5 × 250 = 1250.' },
          { se: ['2200', '2200µs', '2200μs', '2200us'], msg: 'Mancano le migrazioni delle cinque pagine valide.' }
        ],
        altro: 'Il valore è diverso. Somma migrazioni, cancellazione e scrittura richiesta.',
        indizi: ['Una migrazione: 50 + 200 = 250 µs.', 'Cinque migrazioni: 1250 µs.', '1250 + 2000 + 200 = 3450.'],
        svolgimento: ['Migrazioni: 5 × 250 = 1250 µs.', 'Cancellazione: 2000 µs.', 'Scrittura richiesta: 200 µs.', 'Latenza: 3450 µs.'] },
      { d: 'Nella stessa scrittura, quanto vale l’amplificazione di scrittura?', segnaposto: 'Un numero', giuste: ['6', 'sei'],
        ok: 'Cinque copie più la pagina richiesta: sei programmazioni per una pagina.',
        diagnosi: [
          { se: ['5', 'cinque'], msg: 'Alle cinque copie va aggiunta la pagina che il computer aveva chiesto di scrivere.' },
          { se: ['1', 'uno'], msg: 'Varrebbe 1 se non servisse alcun recupero. Qui il controller ha copiato cinque pagine.' }
        ],
        altro: 'Il numero è diverso. Conta tutte le pagine programmate e si divida per quelle richieste, che sono una.',
        indizi: ['Le copie sono cinque.', 'A queste si aggiunge la pagina richiesta.', '6 ÷ 1 = 6.'],
        svolgimento: ['Programmazioni per le copie: 5.', 'Programmazione richiesta: 1.', 'Amplificazione: 6 ÷ 1 = 6.'] },
      { d: 'Due scritture identiche di una pagina arrivano in momenti diversi. La prima dura 200 µs, la seconda 2950 µs. Qual è la spiegazione più probabile?', guida: 'Si scelga la risposta.', o: [
        { t: 'La seconda ha trovato l’unità senza pagine libere, e ha atteso il recupero di un blocco', ok: true, fb: 'Migrazioni e cancellazione si sommano alla programmazione richiesta.' },
        { t: 'La seconda ha scritto più dati', fb: 'Le due richieste sono identiche: una pagina ciascuna.' },
        { t: 'La seconda ha atteso seek e rotazione', fb: 'Un’unità a stato solido non ha parti in movimento.' }] }
    ],
    sfida: ['cslez4_6_05_raid_ssd_05', 'Lettura, cancellazione e usura negli SSD']
  }
});
