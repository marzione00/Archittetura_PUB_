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
  obiettivo: 'Obiettivo: seguire una sequenza di richieste attraverso la TLB, distinguendo hit e miss, e spiegare per quale ragione ogni voce deve indicare il processo a cui appartiene.',
  concetti: [['cache', 'Una cache di traduzioni'], ['process', 'La medesima pagina in due processi'], ['clock', 'Esce la voce meno recente']],
  filigrana: ['cache', 'tabella', 'process'],
  richiami: {
    carte: [
      { sim: 'cache', da: 'Dall’unità 6.1.1', t: 'Hit e miss', d: 'Il dato richiesto è presente in cache, oppure va prelevato da un livello sottostante.' },
      { sim: 'tabella', da: 'Dall’unità 6.2.1', t: 'Una tabella per processo', d: 'La medesima pagina virtuale, in due processi, può condurre a due frame diversi.' },
      { sim: 'clock', da: 'Dall’unità 6.2.3', t: 'LRU', d: 'In assenza di posizioni libere, esce l’elemento con l’accesso meno recente.' }
    ],
    domanda: { d: 'Prima di proseguire: la pagina 3 del processo A si trova nel frame 7, e la pagina 3 del processo B nel frame 12. Con pagine da 4096 byte, dove si trova il byte di offset 15 della pagina 3 di B?', o: [
      { t: 'All’indirizzo fisico 12 × 4096 + 15', ok: true, fb: 'La tabella rilevante è quella di B, che indica il frame 12.' },
      { t: 'All’indirizzo fisico 7 × 4096 + 15', fb: 'L’indirizzo indicato è quello del byte di A. Per B vale la tabella di B.' },
      { t: 'All’indirizzo fisico 3 × 4096 + 15', fb: 'L’indirizzo indicato è quello virtuale, uguale per i due processi.' }
    ] }
  },
  idea: {
    titolo: 'La conservazione delle traduzioni già eseguite',
    termini: ['tlb', 'miss della tlb', 'asid'],
    testo: [
      'Nel capitolo precedente ogni traduzione richiedeva una lettura della tabella delle pagine, cioè un accesso alla memoria. In tali condizioni ogni accesso ai dati costerebbe almeno il doppio: un accesso per determinare la posizione del dato, e uno per leggerlo. Il costo sarebbe molto elevato, poiché un programma accede alla memoria a quasi ogni istruzione.',
      'Il rimedio è il medesimo della gerarchia di memoria: una cache. La MMU conserva le traduzioni impiegate di recente in una memoria piccola e molto veloce, la [[tlb|TLB]], dall’inglese translation lookaside buffer. Ogni voce associa una pagina virtuale al suo frame. Prima di leggere la tabella, la MMU consulta la TLB. Se la traduzione è presente si ha un hit, e la tabella non è letta. Se è assente si ha un [[miss della tlb|miss della TLB]]: la MMU legge la tabella, e copia la traduzione nella TLB per gli accessi successivi.',
      'L’efficacia della TLB dipende dalla località. Una pagina contiene 4096 byte, e un programma che opera su dati adiacenti resta a lungo nelle medesime poche pagine. Una sola voce è pertanto sufficiente per migliaia di accessi consecutivi. Le voci sono tuttavia poche, e quando sono tutte occupate una deve uscire: in questo caso esce quella con l’accesso meno recente, come nell’unità 6.2.3.',
      { fig: 'scena', w: 720, h: 176, titolo: 'Due processi, la medesima pagina 3, due voci distinte', nota: 'Ogni voce riporta il nome del processo. La richiesta di B non può impiegare la voce di A, benché il numero di pagina sia il medesimo.', els: SL.unita641.quadro('g', { seq: 'AAB', tlb: 'due' }, 3, { x: 10, y: 4, w: 700 }) },
      'Lo schema presenta una difficoltà: la TLB è una sola, mentre i processi sono numerosi. La pagina 3 di A si trova nel frame 7, e la pagina 3 di B nel frame 12. Se la voce «pagina 3, frame 7» restasse nella TLB quando il processore passa a B, il processo B leggerebbe i dati di A. Le soluzioni sono due. La prima consiste nello svuotare la TLB a ogni cambio di processo, con la perdita di tutte le traduzioni. La seconda consiste nell’aggiungere a ogni voce un’etichetta con l’identità dello spazio di indirizzamento.',
      'Tale etichetta prende il nome di [[asid|ASID]], da address space identifier. Con l’ASID, una voce è riconosciuta soltanto se coincidono sia il numero di pagina sia il processo. Le voci di A e di B possono allora coesistere, e quando il processore torna ad A le sue traduzioni sono ancora disponibili. Per stabilire se una richiesta è un hit occorre pertanto confrontare la coppia intera, processo e pagina, con le voci presenti.'
    ]
  },
  esperimento: {
    faremo: [
      'I processi A e B leggono, a turno, il byte 15 della propria pagina 3. I controlli fissano l’ordine delle tre richieste, e la struttura della TLB: due voci con ASID, una voce con ASID, oppure due voci senza ASID.',
      'A ogni richiesta l’esperimento verifica se la TLB contiene la traduzione corretta, e conta le letture delle tabelle delle pagine eseguite dalla MMU.'
    ],
    vedrai: [
      ['process', 'Le richieste', 'In alto: le tre richieste, con il processo che le esegue. Sotto ciascuna, l’esito.'],
      ['cache', 'La TLB', 'In basso a sinistra: le voci della TLB, con il processo, la pagina e il frame.'],
      ['tabella', 'Il totale', 'In basso a destra: le letture delle tabelle eseguite fino a quel passo, e l’indirizzo fisico ottenuto.']
    ]
  },
  lab: {
    titolo: 'Tre richieste, una piccola TLB',
    scena: { w: 860, h: 176 },
    atti: ['La TLB vuota', 'Le richieste', 'Il totale'],
    controlli: [
      { id: 'seq', tipo: 'scelta', eti: 'Ordine delle richieste', opzioni: [['AAB', 'A, A, B'], ['ABA', 'A, B, A']], valore: 'ABA' },
      { id: 'tlb', tipo: 'scelta', eti: 'La TLB', opzioni: [['due', 'due voci, con ASID'], ['una', 'una voce, con ASID'], ['senza', 'due voci senza ASID, svuotata a ogni cambio di processo']], valore: 'due' }
    ],
    nota: 'I passi sono sempre cinque. La pagina 3 di A si trova nel frame 7, quella di B nel frame 12.',
    previsione: {
      domanda: (p) => 'I processi richiedono, nell’ordine ' + p.seq.split('').join(', ') + ', il byte 15 della propria pagina 3. La TLB è vuota, e ha ' + (p.tlb === 'due' ? 'due voci con ASID' : p.tlb === 'una' ? 'una sola voce, con ASID' : 'due voci senza ASID, ed è svuotata a ogni cambio di processo') + '. Quante volte la MMU deve leggere una tabella delle pagine?',
      opzioni: () => [1, 2, 3].map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Le letture delle tabelle sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 3 ? (p.tlb === 'una' ? 'Con una sola voce, la traduzione di B sostituisce quella di A. Al ritorno di A la TLB non la contiene più.' : 'Senza ASID la TLB è svuotata a ogni cambio di processo: al ritorno di A le sue traduzioni sono state eliminate.') : p.seq === 'AAB' ? 'La seconda richiesta di A ritrova la voce appena inserita. Le letture sono necessarie per la prima richiesta di A e per quella di B.' : 'Con due voci e l’ASID, le traduzioni di A e di B coesistono: il ritorno di A è un hit.'),
    costruisci(p) {
      const U = SL.unita641, S = U.simula(p), passi = [];
      const P = (fatti, atto, titolo, testo, extra) => { const s = fatti ? S[fatti - 1] : null; passi.push(Object.assign({ atto, titolo, testo, hud: [['Tabelle lette', String(s ? s.cons : 0), 'a'], ['Nella TLB', s && s.voci.length ? s.voci.join(', ') : 'nulla', 'c'], ['Fisico', s ? U.H(s.pa) : '·']], els: U.quadro('b', p, fatti, { x: 20, y: 4, w: 820 }) }, extra)); };
      P(0, 0, 'La TLB è vuota', 'La TLB ha ' + (p.tlb === 'una' ? 'una voce' : 'due voci') + ', inizialmente ' + (p.tlb === 'una' ? 'libera' : 'libere') + '. ' + (p.tlb === 'senza' ? 'Le voci sono prive del nome del processo: per sicurezza la TLB è svuotata a ogni passaggio del processore da un processo all’altro.' : 'Ogni voce riporterà l’ASID del processo a cui appartiene.'), {});
      S.forEach((s, k) => {
        const testo = (s.svuotata ? 'Il processore è passato ' + (s.pr === 'A' ? 'ad A' : 'a B') + ', e la TLB è stata svuotata. ' : '') + s.pr + ' richiede il byte 15 della propria pagina 3. ' + (s.hit ? 'La TLB contiene la traduzione' + (p.tlb === 'senza' ? '' : ' di ' + s.pr) + ': si tratta di un hit. Il frame è ' + U.PFN[s.pr] + ', ottenuto senza la lettura di alcuna tabella.' : (p.tlb !== 'senza' && k > 0 && S[k - 1].voci.length && S[k - 1].voci.indexOf(s.pr) < 0 ? 'La TLB contiene una voce per la pagina 3, che appartiene tuttavia a un altro processo: per ' + s.pr + ' è un miss. ' : 'La traduzione è assente dalla TLB: si tratta di un miss. ') + 'La MMU legge la tabella di ' + s.pr + ', trova il frame ' + U.PFN[s.pr] + (s.fuori ? ', e lo scrive nella TLB al posto della voce di ' + s.fuori + '.' : ', e lo scrive nella TLB.')) + ' L’indirizzo fisico è ' + U.PFN[s.pr] + ' × 4096 + 15, cioè ' + U.H(s.pa) + '.';
        P(k + 1, 1, 'Richiesta ' + (k + 1) + ' · processo ' + s.pr, testo, Object.assign({ calc: s.pr + ' · pagina 3 · ' + (s.hit ? 'hit' : 'miss') + ' · ' + U.H(s.pa) }, k === 1 ? { chiedi: { d: 'La TLB contiene già una voce per una pagina 3. Questa richiesta può impiegarla?', o: s.hit ? ['Sì, è la voce del medesimo processo', 'No, va comunque riletta la tabella'] : ['No, tale voce appartiene a un altro processo', 'Sì, il numero di pagina è il medesimo'], g: 0, no: s.hit ? 'Processo e pagina coincidono con la voce presente.' : 'La pagina 3 di A e la pagina 3 di B si trovano in frame diversi.' } } : {}));
      });
      const c = U.consultazioni(p);
      P(3, 2, 'Il totale', 'Tre richieste, ' + c + (c === 1 ? ' lettura' : ' letture') + ' delle tabelle. ' + (c === 3 ? 'Nessuna richiesta ha potuto riutilizzare una traduzione: in ogni caso la voce utile era stata rimossa.' : 'Una richiesta ha trovato la traduzione già presente nella TLB.'), { esito: [c + ' letture delle tabelle', ''] });
      return { passi, esito: c };
    }
  },
  bilancio: {
    regola: [
      'La TLB conserva traduzioni recenti. Hit: il frame si ottiene senza leggere la tabella. Miss: si legge la tabella, e la traduzione entra nella TLB.',
      'Una voce vale soltanto per il processo a cui appartiene: si confronta la coppia ASID e numero di pagina.'
    ],
    errori: [
      ['Confrontare soltanto il numero di pagina.', 'Due processi possono impiegare la medesima pagina virtuale con frame diversi.'],
      ['Confondere un miss della TLB con un page fault.', 'In un miss della TLB la pagina è in RAM: manca soltanto la traduzione nella cache.'],
      ['Ritenere che la TLB contenga dati.', 'La TLB contiene traduzioni, cioè coppie pagina e frame. I dati si trovano nei frame.']
    ],
    saFare: ['Seguire hit e miss di una sequenza di richieste.', 'Individuare la voce che esce con LRU.', 'Spiegare la funzione dell’ASID.'],
    esercizi: [
      { d: 'Una TLB ha 2 voci con ASID, ed è vuota. Le richieste sono, nell’ordine: A pagina 3, A pagina 4, A pagina 3, B pagina 3. Quanti miss si verificano?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Miss, miss, hit, miss: la pagina 3 di B non coincide con la pagina 3 di A.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'La pagina 3 di B appartiene a un altro processo: la voce di A non vale.' },
          { se: ['4', 'quattro'], msg: 'La terza richiesta ritrova la voce «A, pagina 3», inserita dalla prima.' }
        ],
        altro: 'Il numero è diverso. Si confronti ogni richiesta, processo e pagina, con le voci presenti.',
        indizi: ['A pagina 3: miss. A pagina 4: miss.', 'A pagina 3: hit.', 'B pagina 3: processo diverso, miss.'],
        svolgimento: ['Miss.', 'Miss.', 'Hit.', 'Miss.', 'Totale: 3 miss.'] },
      { d: 'Per quale ragione una TLB senza ASID va svuotata a ogni cambio di processo?', guida: 'Si scelga la risposta.', o: [
        { t: 'Le voci del processo precedente condurrebbero il nuovo processo a frame errati', ok: true, fb: 'Il medesimo numero di pagina indica frame diversi in processi diversi.' },
        { t: 'La TLB si riempie troppo rapidamente', fb: 'Una TLB piena sostituisce le voci una per volta. La difficoltà riguarda il processo a cui appartengono.' },
        { t: 'Le voci scadono dopo un certo tempo', fb: 'Una voce resta valida fino a una modifica della tabella.' }] },
      { d: 'La TLB contiene la voce «A, pagina 5, frame 9». Con pagine da 4096 byte, qual è l’indirizzo fisico del byte di offset 100 della pagina 5 di A?', segnaposto: 'Un numero', giuste: ['36964', '36 964', '0x9064'],
        ok: '9 × 4096 + 100 = 36 964, ottenuto senza leggere la tabella.',
        diagnosi: [
          { se: ['20580', '20 580'], msg: 'È stato impiegato il numero della pagina. Dopo la traduzione si impiega il frame, 9.' },
          { se: ['36864', '36 864'], msg: 'Questo è l’inizio del frame 9. Va aggiunto l’offset, 100.' }
        ],
        altro: 'Il numero è diverso. Si applichi frame × 4096 + offset.',
        indizi: ['Frame: 9.', '9 × 4096 = 36 864.', '36 864 + 100 = 36 964.'],
        svolgimento: ['Frame: 9.', 'Indirizzo fisico: 36 964.'] }
    ],
    sfida: ['cslez6_4_01_tlb_behavior', 'Comportamento della TLB']
  }
});
