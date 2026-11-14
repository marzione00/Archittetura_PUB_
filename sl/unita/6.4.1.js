'use strict';
SL.unita641 = (() => {
  const PFN = { A: 7, B: 12 }, OFF = 15, PAG = 4096;
  const H = (v) => '0x' + v.toString(16).toUpperCase();
  // tlb: 'due' (2 voci con ASID) · 'una' (1 voce con ASID) · 'senza' (2 voci senza ASID, svuotata a ogni cambio di processo)
  const simula = (p) => { const cap = p.tlb === 'una' ? 1 : 2, voci = [], S = []; let cons = 0, prec = ''; p.seq.split('').forEach((pr, t) => { let svuotata = false; if (p.tlb === 'senza' && prec && prec !== pr) { voci.length = 0; svuotata = true; } const i = voci.findIndex((x) => x.pr === pr), hit = i >= 0; let fuori = ''; if (hit) voci[i].uso = t; else { cons++; if (voci.length === cap) { let v = 0; voci.forEach((x, k) => { if (x.uso < voci[v].uso) v = k; }); fuori = voci[v].pr; voci.splice(v, 1); } voci.push({ pr, uso: t }); } prec = pr; S.push({ pr, hit, fuori, svuotata, cons, voci: voci.map((x) => x.pr), pa: PFN[pr] * PAG + OFF }); }); return S; };
  const consultazioni = (p) => { const S = simula(p); return S[S.length - 1].cons; };
  const quadro = (pre, p, fatti, o) => {
    const el = SL.el, els = [], S = simula(p), ora = fatti ? S[fatti - 1] : null, cap = p.tlb === 'una' ? 1 : 2, w3 = (o.w - 20) / 3, w4 = (o.w - 30) / 4, senza = p.tlb === 'senza';
    els.push(el.nota(pre + 't0', o.x, o.y, 'LE RICHIESTE · ogni processo legge il byte 15 della propria pagina 3', 'mono'));
    S.forEach((s, k) => els.push(el.cella(pre + 'r' + k, o.x + k * (w3 + 10), o.y + 44, w3, 34, 'processo ' + s.pr, k < fatti ? (k === fatti - 1 ? 'att' : s.hit ? 'on' : 'err') : '', { so: 'richiesta ' + (k + 1), gi: k < fatti ? (s.hit ? 'hit nella TLB' : 'miss · tabella di ' + s.pr) : '', piccola: true })));
    for (let i = 0; i < 2; i++) { const c = ora && ora.voci[i]; els.push(el.box(pre + 'v' + i, o.x + i * (w4 + 10), o.y + 110, w4, 54, 'TLB · voce ' + i, i >= cap ? 'assente' : c ? (senza ? '' : c + ' · ') + 'pag. 3 → ' + PFN[c] : 'libera', i >= cap ? '' : c && ora.pr === c ? (ora.hit ? 'on' : 'att') : c ? 'on' : 'zero', { cls: 'stretta' })); }
    els.push(el.box(pre + 'c', o.x + 2 * (w4 + 10), o.y + 110, w4, 54, 'tabelle consultate', String(ora ? ora.cons : 0), ora && !ora.hit ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'a', o.x + 3 * (w4 + 10), o.y + 110, w4, 54, 'indirizzo fisico', ora ? H(ora.pa) : '·', ora ? 'on' : '', { cls: 'stretta' }));
    return els;
  };
  return { PFN, OFF, H, simula, consultazioni, quadro };
})();
SL.registra('6.4.1', {
  titolo: 'Memorizzare le traduzioni nella TLB',
  obiettivo: 'Obiettivo: seguire una sequenza di richieste attraverso la TLB, distinguendo hit e miss, e spiegare perché ogni voce deve dire a quale processo appartiene.',
  concetti: [['cache', 'Una cache di traduzioni'], ['process', 'La stessa pagina in due processi'], ['clock', 'Esce la voce meno recente']],
  filigrana: ['cache', 'tabella', 'process'],
  richiami: {
    carte: [
      { sim: 'cache', da: 'Dall’unità 6.1.1', t: 'Hit e miss', d: 'Trovare in cache ciò che si cerca, oppure doverlo andare a prendere più lontano.' },
      { sim: 'tabella', da: 'Dall’unità 6.2.1', t: 'Una tabella per processo', d: 'La stessa pagina virtuale, in due processi, può portare a due frame diversi.' },
      { sim: 'clock', da: 'Dall’unità 6.2.3', t: 'LRU', d: 'Quando manca posto, esce l’elemento usato meno di recente.' }
    ],
    domanda: { d: 'Prima di proseguire: la pagina 3 del processo A sta nel frame 7, e la pagina 3 del processo B nel frame 12. Con pagine da 4096 byte, dove sta il byte di offset 15 della pagina 3 di B?', o: [
      { t: 'All’indirizzo fisico 12 × 4096 + 15', ok: true, fb: 'Conta la tabella di B, che indica il frame 12.' },
      { t: 'All’indirizzo fisico 7 × 4096 + 15', fb: 'Quello è il byte di A. Per B vale la tabella di B.' },
      { t: 'All’indirizzo fisico 3 × 4096 + 15', fb: 'Quello è l’indirizzo virtuale, uguale per i due processi.' }
    ] }
  },
  idea: {
    titolo: 'Ricordare le traduzioni già fatte',
    termini: ['tlb', 'miss della tlb', 'asid'],
    testo: [
      'Nel capitolo precedente ogni traduzione richiedeva una lettura della tabella delle pagine, cioè un accesso alla memoria. Detto così, ogni accesso ai dati costerebbe almeno il doppio: uno per scoprire dove sta il dato, e uno per prenderlo. Sarebbe un prezzo altissimo, perché un programma accede alla memoria a ogni istruzione o quasi.',
      'Il rimedio è lo stesso della gerarchia di memoria: una cache. La MMU conserva le traduzioni usate di recente in una piccola memoria velocissima, la [[tlb|TLB]], dall’inglese translation lookaside buffer. Ogni voce associa una pagina virtuale al suo frame. Prima di leggere la tabella, la MMU guarda nella TLB. Se la traduzione c’è, è un hit, e la tabella non viene toccata. Se manca è un [[miss della tlb|miss della TLB]]: la MMU legge la tabella, e copia la traduzione nella TLB per le prossime volte.',
      'La TLB funziona grazie alla località. Una pagina contiene 4096 byte, e un programma che lavora su dati vicini resta a lungo nelle stesse poche pagine. Una sola voce serve così migliaia di accessi consecutivi. I posti però sono pochi, e quando sono tutti occupati una voce deve uscire: qui esce quella usata meno di recente, come nell’unità 6.2.3.',
      { fig: 'scena', w: 720, h: 176, titolo: 'Due processi, la stessa pagina 3, due voci distinte', nota: 'Ogni voce porta il nome del processo. La richiesta di B non può usare la voce di A, benché il numero di pagina sia lo stesso.', els: SL.unita641.quadro('g', { seq: 'AAB', tlb: 'due' }, 3, { x: 10, y: 4, w: 700 }) },
      'C’è una complicazione. La TLB è una sola, e i processi sono tanti. La pagina 3 di A sta nel frame 7, e la pagina 3 di B nel frame 12. Se la voce «pagina 3, frame 7» restasse nella TLB quando il processore passa a B, il processo B leggerebbe i dati di A. Le soluzioni sono due. La prima è svuotare la TLB a ogni cambio di processo, e ripartire ogni volta da zero. La seconda è aggiungere a ogni voce un’etichetta con l’identità dello spazio di indirizzamento.',
      'Quell’etichetta si chiama [[asid|ASID]], da address space identifier. Con l’ASID, una voce è riconosciuta soltanto se coincidono sia il numero di pagina sia il processo. Le voci di A e di B possono allora convivere, e quando il processore torna ad A ritrova le sue traduzioni ancora pronte. Per decidere se una richiesta è un hit bisogna dunque confrontare la coppia intera, processo e pagina, con le voci presenti.'
    ]
  },
  esperimento: {
    faremo: [
      'I processi A e B leggono, a turno, il byte 15 della propria pagina 3. Sceglierai l’ordine delle tre richieste, e come è fatta la TLB: due voci con ASID, una voce con ASID, oppure due voci senza ASID.',
      'A ogni richiesta guarderemo se la TLB contiene la traduzione giusta. Conta quante volte la MMU deve leggere una tabella delle pagine.'
    ],
    vedrai: [
      ['process', 'Le richieste', 'In alto: le tre richieste, con il processo che le fa. Sotto ciascuna, l’esito.'],
      ['cache', 'La TLB', 'In basso a sinistra: le voci della TLB, con il processo, la pagina e il frame.'],
      ['tabella', 'Il conto', 'In basso a destra: le letture delle tabelle fatte finora, e l’indirizzo fisico ottenuto.']
    ]
  },
  lab: {
    titolo: 'Tre richieste, una piccola TLB',
    scena: { w: 860, h: 176 },
    atti: ['La TLB vuota', 'Le richieste', 'Il conto'],
    controlli: [
      { id: 'seq', tipo: 'scelta', eti: 'Ordine delle richieste', opzioni: [['AAB', 'A, A, B'], ['ABA', 'A, B, A']], valore: 'ABA' },
      { id: 'tlb', tipo: 'scelta', eti: 'La TLB', opzioni: [['due', 'due voci, con ASID'], ['una', 'una voce, con ASID'], ['senza', 'due voci senza ASID, svuotata a ogni cambio di processo']], valore: 'due' }
    ],
    nota: 'I passi sono sempre cinque. La pagina 3 di A sta nel frame 7, quella di B nel frame 12.',
    previsione: {
      domanda: (p) => 'I processi chiedono, nell’ordine ' + p.seq.split('').join(', ') + ', il byte 15 della propria pagina 3. La TLB è vuota, e ha ' + (p.tlb === 'due' ? 'due voci con ASID' : p.tlb === 'una' ? 'una sola voce, con ASID' : 'due voci senza ASID: viene svuotata a ogni cambio di processo') + '. Quante volte la MMU deve leggere una tabella delle pagine?',
      opzioni: () => [1, 2, 3].map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Le letture delle tabelle sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 3 ? (p.tlb === 'una' ? 'Con una sola voce, la traduzione di B scaccia quella di A. Al ritorno di A la TLB non la contiene più.' : 'Senza ASID la TLB viene svuotata a ogni cambio di processo: al ritorno di A le sue traduzioni sono sparite.') : p.seq === 'AAB' ? 'La seconda richiesta di A ritrova la voce appena inserita. Le letture servono per la prima richiesta di A e per quella di B.' : 'Con due voci e l’ASID, le traduzioni di A e di B convivono: il ritorno di A è un hit.'),
    costruisci(p) {
      const U = SL.unita641, S = U.simula(p), passi = [];
      const P = (fatti, atto, titolo, testo, extra) => { const s = fatti ? S[fatti - 1] : null; passi.push(Object.assign({ atto, titolo, testo, hud: [['Tabelle lette', String(s ? s.cons : 0), 'a'], ['Nella TLB', s && s.voci.length ? s.voci.join(', ') : 'nulla', 'c'], ['Fisico', s ? U.H(s.pa) : '·']], els: U.quadro('b', p, fatti, { x: 20, y: 4, w: 820 }) }, extra)); };
      P(0, 0, 'La TLB è vuota', 'La TLB ha ' + (p.tlb === 'una' ? 'una voce' : 'due voci') + ', per ora ' + (p.tlb === 'una' ? 'libera' : 'libere') + '. ' + (p.tlb === 'senza' ? 'Le voci sono prive del nome del processo: per sicurezza la TLB viene svuotata ogni volta che il processore passa da un processo all’altro.' : 'Ogni voce porterà l’ASID del processo a cui appartiene.'), {});
      S.forEach((s, k) => {
        const testo = (s.svuotata ? 'Il processore è passato ' + (s.pr === 'A' ? 'ad A' : 'a B') + ', e la TLB è stata svuotata. ' : '') + s.pr + ' chiede il byte 15 della sua pagina 3. ' + (s.hit ? 'La TLB contiene la traduzione' + (p.tlb === 'senza' ? '' : ' di ' + s.pr) + ': è un hit. Il frame è ' + U.PFN[s.pr] + ', senza leggere alcuna tabella.' : (p.tlb !== 'senza' && k > 0 && S[k - 1].voci.length && S[k - 1].voci.indexOf(s.pr) < 0 ? 'La TLB contiene una voce per la pagina 3, ma appartiene a un altro processo: per ' + s.pr + ' è un miss. ' : 'La traduzione manca dalla TLB: è un miss. ') + 'La MMU legge la tabella di ' + s.pr + ', trova il frame ' + U.PFN[s.pr] + (s.fuori ? ', e lo scrive nella TLB al posto della voce di ' + s.fuori + '.' : ', e lo scrive nella TLB.')) + ' L’indirizzo fisico è ' + U.PFN[s.pr] + ' × 4096 + 15, cioè ' + U.H(s.pa) + '.';
        P(k + 1, 1, 'Richiesta ' + (k + 1) + ' · processo ' + s.pr, testo, Object.assign({ calc: s.pr + ' · pagina 3 · ' + (s.hit ? 'hit' : 'miss') + ' · ' + U.H(s.pa) }, k === 1 ? { chiedi: { d: 'La TLB contiene già una voce per una pagina 3. Questa richiesta la può usare?', o: s.hit ? ['Sì: è la voce dello stesso processo', 'No: va comunque riletta la tabella'] : ['No: quella voce è di un altro processo', 'Sì: il numero di pagina è lo stesso'], g: 0, no: s.hit ? 'Processo e pagina coincidono con la voce presente.' : 'La pagina 3 di A e la pagina 3 di B stanno in frame diversi.' } } : {}));
      });
      const c = U.consultazioni(p);
      P(3, 2, 'Il conto', 'Tre richieste, ' + c + (c === 1 ? ' lettura' : ' letture') + ' delle tabelle. ' + (c === 3 ? 'Nessuna richiesta ha potuto riusare una traduzione: ogni volta la voce utile era stata tolta.' : 'Una richiesta ha trovato la traduzione già pronta nella TLB.'), { esito: [c + ' letture delle tabelle', ''] });
      return { passi, esito: c };
    }
  },
  bilancio: {
    regola: [
      'La TLB conserva traduzioni recenti. Hit: il frame si ottiene senza leggere la tabella. Miss: si legge la tabella, e la traduzione entra nella TLB.',
      'Una voce vale soltanto per il processo a cui appartiene: si confronta la coppia ASID e numero di pagina.'
    ],
    errori: [
      ['Confrontare soltanto il numero di pagina.', 'Due processi possono usare la stessa pagina virtuale con frame diversi.'],
      ['Scambiare un miss della TLB per un page fault.', 'In un miss della TLB la pagina è in RAM: manca soltanto la traduzione nella cache.'],
      ['Pensare che la TLB contenga dati.', 'Contiene traduzioni, cioè coppie pagina e frame. I dati stanno nei frame.']
    ],
    saFare: ['Seguire hit e miss di una sequenza di richieste.', 'Scegliere la voce che esce con LRU.', 'Spiegare a che cosa serve l’ASID.'],
    esercizi: [
      { d: 'Una TLB ha 2 voci con ASID, ed è vuota. Le richieste sono, nell’ordine: A pagina 3, A pagina 4, A pagina 3, B pagina 3. Quanti miss avvengono?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Miss, miss, hit, miss: la pagina 3 di B non coincide con la pagina 3 di A.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'La pagina 3 di B appartiene a un altro processo: la voce di A non vale.' },
          { se: ['4', 'quattro'], msg: 'La terza richiesta ritrova la voce «A, pagina 3», inserita dalla prima.' }
        ],
        altro: 'Il numero è diverso. Si confronti ogni richiesta, processo e pagina, con le voci presenti.',
        indizi: ['A pagina 3: miss. A pagina 4: miss.', 'A pagina 3: hit.', 'B pagina 3: processo diverso, miss.'],
        svolgimento: ['Miss.', 'Miss.', 'Hit.', 'Miss.', 'Totale: 3 miss.'] },
      { d: 'Perché una TLB senza ASID va svuotata a ogni cambio di processo?', guida: 'Si scelga la risposta.', o: [
        { t: 'Perché le voci del processo precedente porterebbero il nuovo processo nei frame sbagliati', ok: true, fb: 'Lo stesso numero di pagina indica frame diversi in processi diversi.' },
        { t: 'Perché la TLB si riempie troppo in fretta', fb: 'Una TLB piena sostituisce le voci una per volta. Il problema è a chi appartengono.' },
        { t: 'Perché le voci scadono dopo un certo tempo', fb: 'Una voce resta valida finché la tabella non cambia.' }] },
      { d: 'La TLB contiene la voce «A, pagina 5, frame 9». Con pagine da 4096 byte, qual è l’indirizzo fisico del byte di offset 100 della pagina 5 di A?', segnaposto: 'Un numero', giuste: ['36964', '36 964', '0x9064'],
        ok: '9 × 4096 + 100 = 36 964, ottenuto senza leggere la tabella.',
        diagnosi: [
          { se: ['20580', '20 580'], msg: 'Hai usato il numero della pagina. Dopo la traduzione si usa il frame, 9.' },
          { se: ['36864', '36 864'], msg: 'Questo è l’inizio del frame 9. Aggiungi l’offset, 100.' }
        ],
        altro: 'Il numero è diverso. Si applichi frame × 4096 + offset.',
        indizi: ['Frame: 9.', '9 × 4096 = 36 864.', '36 864 + 100 = 36 964.'],
        svolgimento: ['Frame: 9.', 'Indirizzo fisico: 36 964.'] }
    ],
    sfida: ['cslez6_4_01_tlb_behavior', 'Comportamento della TLB']
  }
});
