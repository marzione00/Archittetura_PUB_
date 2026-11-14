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
  obiettivo: 'Obiettivo: calcolare la durata di una scrittura su un’unità a stato solido in funzione dello stato dell’unità, e indicare la grandezza misurata dall’amplificazione di scrittura.',
  concetti: [['ssd', 'Il recupero dello spazio'], ['clock', 'La medesima richiesta, tempi diversi'], ['bilancio', 'Scritture richieste e scritture eseguite']],
  filigrana: ['ssd', 'clock', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'ssd', da: 'Dall’unità 4.6.3', t: 'L’aggiornamento fuori posto', d: 'Ogni aggiornamento è scritto in una pagina libera, e la precedente diviene invalida.' },
      { sim: 'ssd', da: 'Dall’unità 4.6.3', t: 'Il blocco flash', d: 'La cancellazione riguarda tutte le sue pagine insieme.' },
      { sim: 'clock', da: 'Dall’unità 4.5.2', t: 'Il tempo di servizio', d: 'Il tempo che un dispositivo impiega a soddisfare una richiesta.' }
    ],
    domanda: { d: 'Prima di proseguire: un blocco contiene tre pagine valide e cinque invalide. Quale operazione va compiuta prima della cancellazione?', o: [
      { t: 'Copiare altrove le tre pagine valide', ok: true, fb: 'La cancellazione distruggerebbe anche i dati ancora in uso.' },
      { t: 'Copiare altrove le cinque pagine invalide', fb: 'Le pagine invalide contengono versioni superate, che non saranno più lette.' },
      { t: 'Nessuna, poiché la cancellazione preserva le pagine valide', fb: 'La cancellazione agisce su tutto il blocco, senza eccezioni.' }
    ] }
  },
  idea: {
    titolo: 'Il costo delle pagine invalide',
    termini: ['garbage collection', 'blocco vittima', 'amplificazione di scrittura', 'usura'],
    testo: [
      'Poiché le scritture avvengono sempre in pagine nuove, le pagine libere sono destinate a esaurirsi. Il controller deve allora recuperare lo spazio occupato dalle pagine invalide, con un’operazione denominata [[garbage collection]], alla lettera «raccolta dei rifiuti». Esso seleziona un blocco, il [[blocco vittima]], di norma quello con il maggior numero di pagine invalide. Copia quindi le pagine ancora valide in un blocco di riserva, aggiorna la mappa, e infine cancella il blocco vittima, che torna interamente libero.',
      'Questa operazione ha un costo in tempo, che ricade sulla scrittura che l’ha resa necessaria. Nel modello la lettura di una pagina richiede 50 µs, la programmazione 200 µs, la cancellazione di un blocco 2000 µs. Se il blocco vittima contiene tre pagine valide, ogni copia costa una lettura e una programmazione, cioè 250 µs: complessivamente 750 µs. Seguono la cancellazione, 2000 µs, e infine la pagina richiesta, 200 µs. Il totale è 2950 µs.',
      { fig: 'scena', w: 720, h: 152, titolo: 'Una scrittura che deve prima recuperare un blocco', nota: 'V è una pagina valida, x una invalida, N la pagina appena scritta. Le tre V sono state copiate nel blocco di riserva.', els: SL.unita464.quadro('g', { v: 3, st: 'gc' }, 5, { x: 10, y: 0, wp: 38, w: 700 }) },
      'La medesima scrittura, con una pagina libera già disponibile, sarebbe durata 200 µs. La latenza di un’unità a stato solido dipende pertanto dallo stato dell’unità al momento della richiesta, oltre che dalla richiesta. Il lavoro aggiuntivo è misurato dall’[[amplificazione di scrittura]]: il rapporto fra le pagine effettivamente programmate e quelle di cui il computer ha richiesto la scrittura. Nell’esempio le programmazioni sono quattro per una pagina richiesta, e l’amplificazione vale 4.',
      'L’amplificazione è rilevante anche per una seconda ragione. Ogni cancellazione degrada in piccola misura le celle, e dopo un certo numero di cicli un blocco cessa di trattenere i dati: il fenomeno prende il nome di [[usura]]. Un numero maggiore di programmazioni comporta più cancellazioni, e una durata minore. Per tale ragione il controller distribuisce le scritture su tutti i blocchi, affinché l’usura sia uniforme.'
    ]
  },
  esperimento: {
    faremo: [
      'Il computer richiede la scrittura di una pagina. I controlli fissano lo stato dell’unità, con una pagina libera oppure con un blocco da recuperare, e il numero di pagine valide del blocco vittima.',
      'L’esperimento somma i tempi delle migrazioni, della cancellazione e della scrittura richiesta, e calcola l’amplificazione. È istruttivo aumentare le pagine valide da 1 a 7 e osservare la crescita della latenza.'
    ],
    vedrai: [
      ['ssd', 'I due blocchi', 'A sinistra: il blocco vittima e il blocco di riserva, con otto pagine ciascuno. V valida, x invalida, N nuova.'],
      ['clock', 'I tempi', 'A destra: migrazioni, cancellazione, scrittura richiesta e latenza totale.']
    ]
  },
  lab: {
    titolo: 'La durata di una scrittura',
    scena: { w: 860, h: 160 },
    atti: ['Lo stato', 'Il recupero', 'La scrittura', 'Il totale'],
    controlli: [
      { id: 'st', tipo: 'scelta', eti: 'Spazio libero', opzioni: [['gc', 'va recuperato un blocco'], ['free', 'una pagina è già libera']], valore: 'gc' },
      { id: 'v', tipo: 'scelta', eti: 'Pagine valide nella vittima', opzioni: [[0, '0'], [1, '1'], [3, '3'], [5, '5'], [7, '7']], valore: 3 }
    ],
    nota: 'I passi sono sei quando va recuperato un blocco, tre quando una pagina è già libera. Lettura 50 µs, programmazione 200 µs, cancellazione 2000 µs.',
    previsione: {
      domanda: (p) => 'Il computer richiede la scrittura di una pagina. ' + (p.st === 'gc' ? 'Il controller è privo di pagine libere, e deve recuperare un blocco che contiene ' + (p.v === 1 ? '1 pagina valida' : p.v + ' pagine valide') + '.' : 'Il controller dispone già di una pagina libera. Un altro blocco contiene ' + (p.v === 1 ? '1 pagina valida' : p.v + ' pagine valide') + ' e alcune invalide.') + ' Quanto dura la scrittura?',
      opzioni: (p) => Array.from(new Set([200, 2200, p.v * 250 + 2200])).map((v) => [v, v + ' µs'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' µs. La scrittura dura ' + esito + ' µs. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.st === 'free' ? 'Con una pagina già libera è sufficiente la programmazione richiesta. Le pagine dell’altro blocco restano invariate.' : pred === 200 ? 'Senza pagine libere il controller deve prima recuperare un blocco.' : 'Prima della cancellazione vanno copiate le pagine valide: 250 µs ciascuna.'),
    costruisci(p) {
      const U = SL.unita464, c = U.conto(p), passi = [];
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, wp: 44, w: 820 });
      const hud = (f) => [['Programmazioni', String(f >= 4 ? c.amp : f >= 2 ? c.n : 0), 'a'], ['Amplificazione', f >= 5 ? String(c.amp) : '·'], ['Latenza', f >= 5 ? c.tot + ' µs' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      if (c.gc) {
        P(0, 0, 'Lo stato', 'Il computer richiede la scrittura di una pagina, e il controller è privo di pagine libere. Il blocco di riserva è cancellato, ed è riservato ai recuperi.', {});
        P(1, 1, 'Il blocco vittima', 'Il controller seleziona come vittima un blocco con ' + (p.v === 1 ? '1 pagina valida' : p.v + ' pagine valide') + ' e ' + (8 - p.v) + ' invalide. La cancellazione recupererà otto pagine, e va preceduta dalla copia di quelle valide.', { chiedi: { d: 'Quante pagine vanno copiate nel blocco di riserva?', o: Array.from(new Set([String(8 - p.v), String(p.v), '8'])), g: Array.from(new Set([String(8 - p.v), String(p.v), '8'])).indexOf(String(p.v)), no: 'Si copiano soltanto le pagine valide. Le invalide contengono versioni superate.' } });
        P(2, 1, 'Le migrazioni', p.v === 0 ? 'Il blocco vittima è privo di pagine valide, e nessuna copia è necessaria. Si tratta del caso più favorevole.' : 'Ogni pagina valida è letta, 50 µs, e programmata nel blocco di riserva, 200 µs. Per ' + (p.v === 1 ? 'una pagina' : p.v + ' pagine') + ' occorrono ' + p.v + ' × 250 = ' + c.migr + ' µs. La mappa è aggiornata.', { calc: p.v + ' × (50 + 200) = ' + c.migr + ' µs' });
        P(3, 1, 'La cancellazione', 'Il blocco vittima è ormai privo di contenuto utile, ed è cancellato per intero. L’operazione richiede 2000 µs, e le otto pagine tornano libere.', { calc: 'cancellazione: 2000 µs' });
        P(4, 2, 'La scrittura richiesta', 'Soltanto a questo punto il controller programma la pagina richiesta dal computer, in una delle pagine appena liberate: altri 200 µs.', { calc: 'programmazione: 200 µs' });
        P(5, 3, 'Il totale', 'La latenza è ' + c.migr + ' + 2000 + 200 = ' + c.tot + ' µs. Le programmazioni fisiche sono ' + c.amp + ' per una pagina richiesta: l’amplificazione di scrittura vale ' + c.amp + '.', { calc: c.migr + ' + 2000 + 200 = ' + c.tot + ' µs · amplificazione ' + c.amp, esito: [c.tot + ' µs', ''] });
      } else {
        P(0, 0, 'Lo stato', 'Il computer richiede la scrittura di una pagina. Il controller dispone già di pagine libere nel blocco di riserva. L’altro blocco è pieno, con ' + (p.v === 1 ? '1 pagina valida' : p.v + ' pagine valide') + ' e ' + (8 - p.v) + ' invalide, e per il momento resta invariato.', {});
        P(4, 2, 'La scrittura richiesta', 'Il controller programma immediatamente la pagina in una posizione libera: 200 µs, senza migrazioni e senza cancellazioni.', { calc: 'programmazione: 200 µs', chiedi: { d: 'Le pagine valide dell’altro blocco hanno influito sulla durata?', o: ['Sì', 'No'], g: 1, no: 'Il blocco pieno è rimasto invariato. Esso sarà rilevante al momento del suo recupero.' } });
        P(5, 3, 'Il totale', 'La latenza è di 200 µs. A una pagina richiesta corrisponde una sola programmazione fisica: l’amplificazione di scrittura vale 1, il minimo possibile.', { calc: '200 µs · amplificazione 1', esito: ['200 µs', ''] });
      }
      return { passi, esito: c.tot };
    }
  },
  bilancio: {
    regola: [
      'Latenza di una scrittura che richiede un recupero = pagine valide × (lettura + programmazione) + cancellazione + programmazione richiesta.',
      'Amplificazione di scrittura = pagine programmate ÷ pagine richieste dal computer. Vale 1 quando nessun recupero è necessario.'
    ],
    errori: [
      ['Contare per ogni migrazione la sola programmazione.', 'La pagina va anzitutto letta: ogni copia costa una lettura e una programmazione.'],
      ['Trascurare la pagina richiesta nel conteggio delle programmazioni.', 'Alle copie va aggiunta la scrittura richiesta dal computer.'],
      ['Attendersi la medesima durata da due scritture uguali.', 'La durata dipende dallo stato dell’unità: pagine libere disponibili oppure blocco da recuperare.']
    ],
    saFare: ['Calcolare la latenza di una scrittura con recupero.', 'Calcolare l’amplificazione di scrittura.', 'Spiegare per quale ragione l’amplificazione riduce la durata della flash.'],
    esercizi: [
      { d: 'Lettura 50 µs, programmazione 200 µs, cancellazione di un blocco 2000 µs. Per scrivere una pagina il controller deve recuperare un blocco con 5 pagine valide. Quanto dura la scrittura, in microsecondi?', segnaposto: 'Un numero', giuste: ['3450', '3450µs', '3450μs', '3450us'],
        ok: '5 × 250 = 1250, più 2000 di cancellazione, più 200 per la pagina richiesta: 3450 µs.',
        diagnosi: [
          { se: ['3250', '3250µs', '3250μs', '3250us'], msg: 'Manca la programmazione della pagina richiesta, 200 µs.' },
          { se: ['3200', '3200µs', '3200μs', '3200us'], msg: 'Ogni migrazione comprende anche la lettura della pagina: 250 µs, e 5 × 250 = 1250.' },
          { se: ['2200', '2200µs', '2200μs', '2200us'], msg: 'Mancano le migrazioni delle cinque pagine valide.' }
        ],
        altro: 'Il valore è diverso. Si sommino migrazioni, cancellazione e scrittura richiesta.',
        indizi: ['Una migrazione: 50 + 200 = 250 µs.', 'Cinque migrazioni: 1250 µs.', '1250 + 2000 + 200 = 3450.'],
        svolgimento: ['Migrazioni: 5 × 250 = 1250 µs.', 'Cancellazione: 2000 µs.', 'Scrittura richiesta: 200 µs.', 'Latenza: 3450 µs.'] },
      { d: 'Nella medesima scrittura, quanto vale l’amplificazione di scrittura?', segnaposto: 'Un numero', giuste: ['6', 'sei'],
        ok: 'Cinque copie più la pagina richiesta: sei programmazioni per una pagina.',
        diagnosi: [
          { se: ['5', 'cinque'], msg: 'Alle cinque copie va aggiunta la pagina di cui il computer aveva richiesto la scrittura.' },
          { se: ['1', 'uno'], msg: 'Varrebbe 1 se nessun recupero fosse necessario. In questo caso il controller ha copiato cinque pagine.' }
        ],
        altro: 'Il numero è diverso. Si contino tutte le pagine programmate e si divida per quelle richieste, che sono una.',
        indizi: ['Le copie sono cinque.', 'A queste si aggiunge la pagina richiesta.', '6 ÷ 1 = 6.'],
        svolgimento: ['Programmazioni per le copie: 5.', 'Programmazione richiesta: 1.', 'Amplificazione: 6 ÷ 1 = 6.'] },
      { d: 'Due scritture identiche di una pagina giungono in momenti diversi. La prima dura 200 µs, la seconda 2950 µs. Qual è la spiegazione più probabile?', guida: 'Si scelga la risposta.', o: [
        { t: 'La seconda ha trovato l’unità priva di pagine libere, e ha atteso il recupero di un blocco', ok: true, fb: 'Migrazioni e cancellazione si sommano alla programmazione richiesta.' },
        { t: 'La seconda ha scritto più dati', fb: 'Le due richieste sono identiche: una pagina ciascuna.' },
        { t: 'La seconda ha atteso seek e rotazione', fb: 'Un’unità a stato solido è priva di parti in movimento.' }] }
    ],
    sfida: ['cslez4_6_05_raid_ssd_05', 'Lettura, cancellazione e usura negli SSD']
  }
});
