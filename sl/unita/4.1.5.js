'use strict';
SL.unita415 = (() => {
  const H = SL.kern.H;
  const conti = (p) => { const top = p.r, base = top - top % 16, cod = p.e === 'pf', hw = 40 + (cod ? 8 : 0), sw = (p.n + (cod ? 0 : 1)) * 8; return { top, base, cod, hw, sw, slot: base - 48, fine: base - hw - sw, tot: top - (base - hw - sw) }; };
  // fase: 0 la cima iniziale · 1 l'allineamento · 2 i cinque campi · 3 il codice di errore o lo zero · 4 i registri · 5 il bilancio
  const quadro = (pre, p, f, o) => {
    const el = SL.el, c = conti(p), els = [], campi = ['SS', 'RSP del programma', 'RFLAGS', 'CS', 'RIP di ripresa'];
    const righe = [{ a: c.top, txt: 'cima iniziale', st: f === 0 ? 'att' : 'off' }];
    if (c.top !== c.base) righe.push({ a: c.base, txt: f >= 1 ? '8 byte saltati' : null, st: f === 1 ? 'att' : f > 1 ? 'zero' : 'off', nota: f >= 1 ? 'allineamento' : '' });
    campi.forEach((t, k) => righe.push({ a: c.base - 8 * (k + 1), txt: f >= 2 ? t : null, st: f === 2 ? 'att' : f > 2 ? 'on' : 'off', nota: f >= 2 && k === 0 ? 'dal processore' : '' }));
    righe.push({ a: c.slot, txt: f >= 3 ? (c.cod ? 'codice di errore' : '0') : null, st: f === 3 ? 'att' : f > 3 ? 'on' : 'off', nota: f >= 3 ? (c.cod ? 'dal processore' : 'dallo stub') : '' });
    righe.push({ a: c.fine, txt: f >= 4 ? p.n + ' registri generali' : null, st: f === 4 ? 'att' : f > 4 ? 'on' : 'off', nota: f >= 4 ? 'dallo stub · ' + (8 * p.n) + ' byte' : '' });
    const rsp = f === 0 ? c.top : f === 1 ? c.base : f === 2 ? c.base - 40 : f === 3 ? c.slot : c.fine;
    // Dopo l'allineamento su una cima già allineata RSP indica ancora la cima iniziale.
    SL.x86.pila(pre, righe, { x: o.x, y: o.y, w: o.w, passo: o.passo, rsp }).forEach((e) => els.push(e));
    if (o.conti) {
      const B = (id, k, eti, txt, da, forte) => el.box(pre + id, o.xb, o.y + k * (o.hb + 14), o.wb, o.hb, eti, f >= da ? txt : '·', f === da || (forte && f >= da) ? 'att' : f > da ? 'on' : '', { cls: 'stretta' });
      els.push(B('b1', 0, 'posati dal processore', c.hw + ' byte', 3), B('b2', 1, 'posati dallo stub', c.sw + ' byte', 4), B('b3', 2, 'RSP finale', H(c.fine), 4, true));
    }
    return els;
  };
  return { H, conti, quadro };
})();
SL.registra('4.1.5', {
  titolo: 'Codice di ingresso Linux e contesto salvato',
  obiettivo: 'Obiettivo: dire che cosa posa sulla pila il processore quando entra in un gestore, che cosa aggiunge il codice di ingresso, e dove si trova la cima della pila quando il gestore comincia.',
  concetti: [['pila', 'Una pila riservata al kernel'], ['cpu', 'La parte del processore'], ['gate', 'La parte del software']],
  filigrana: ['pila', 'gate', 'cpu'],
  richiami: {
    carte: [
      { sim: 'pila', da: 'Dall’unità 2.6.1', t: 'La pila', d: 'Cresce verso gli indirizzi bassi. Ogni dato posato toglie 8 a RSP.' },
      { sim: 'bilancio', da: 'Dall’unità 2.7.5', t: 'L’allineamento della pila', d: 'In certi momenti RSP deve essere un multiplo di 16.' },
      { sim: 'conflitto', da: 'Dall’unità 4.1.2', t: 'Fault e interrupt', d: 'La pagina assente e la divisione per zero sono fault. Il timer provoca un interrupt.' }
    ],
    domanda: { d: 'Prima di proseguire: RSP vale 0x2000. Dopo che sulla pila sono stati posati cinque valori da 8 byte, quanto vale RSP?', o: [
      { t: '0x1FD8', ok: true, fb: 'Cinque valori occupano 40 byte, cioè 0x28: 0x2000 − 0x28 = 0x1FD8.' },
      { t: '0x2028', fb: 'La pila cresce verso gli indirizzi bassi: posando dati RSP diminuisce.' },
      { t: '0x1FFB', fb: 'Ogni valore occupa 8 byte, quindi cinque valori ne occupano 40.' }
    ] }
  },
  idea: {
    titolo: 'Chi salva che cosa',
    termini: ['pila del kernel', 'frame di interruzione', 'codice di errore', 'stub di ingresso'],
    testo: [
      'Per poter tornare al programma, il processore deve ricordare dove era arrivato. Lo annota su una pila, come fa una CALL con l’indirizzo di ritorno. La pila del programma è inadatta, perché il programma potrebbe averla rovinata, e il kernel deve poter lavorare comunque. All’ingresso da modo utente il processore passa quindi a una pila riservata, la [[pila del kernel]], e ne allinea la cima a un multiplo di 16.',
      'Su quella pila il processore posa cinque valori da otto byte, il [[frame di interruzione]]. SS e RSP descrivono la pila del programma. RFLAGS è il registro che raccoglie i flag. CS e RIP dicono da dove riprendere, e con quale livello di privilegio. In tutto 40 byte.',
      'Per alcune eccezioni il processore aggiunge un sesto valore, il [[codice di errore]], che ne descrive la causa. La pagina assente ne ha uno: dice per esempio se l’accesso fallito era una lettura oppure una scrittura. La divisione per zero ne è priva, e così gli interrupt.',
      { fig: 'scena', w: 720, h: 262, titolo: 'La pila del kernel dopo una pagina assente', nota: 'Sei valori dal processore, poi i registri salvati dallo stub. La cima finale è a 0x1F90.', els: SL.unita415.quadro('g', { r: 0x2000, e: 'pf', n: 8 }, 5, { x: 30, y: 6, w: 220, passo: 30 }) },
      'Il resto è compito del software. Le prime istruzioni del gestore formano lo [[stub di ingresso]], scritto in assembly. Per gli eventi senza codice di errore lo stub posa uno zero al suo posto, così che la pila abbia sempre la stessa forma. Poi salva i registri generali, che il gestore userà per il proprio lavoro e che il programma dovrà ritrovare intatti.',
      'In questo modello il numero di registri salvati è regolabile, per mostrare quanto costa ogni salvataggio. Il Linux vero li salva tutti e quindici.'
    ]
  },
  esperimento: {
    faremo: [
      'Seguiremo la cima della pila del kernel durante un ingresso, un passo alla volta. Sceglierai la cima iniziale, l’evento e quanti registri generali lo stub deve salvare.',
      'Guarderemo l’allineamento, i valori posati dal processore e quelli aggiunti dallo stub. Dopo il caso proposto, passa alla divisione per zero: il processore posa otto byte in meno, e la cima finale resta la stessa.'
    ],
    vedrai: [
      ['pila', 'La pila del kernel', 'A sinistra: una casella per ogni valore, con il suo indirizzo. La freccia indica RSP.'],
      ['cpu', 'Chi ha posato', 'Accanto alle caselle: il processore oppure lo stub.'],
      ['bilancio', 'Il conto dei byte', 'A destra: i byte del processore, quelli dello stub e la cima finale.']
    ]
  },
  lab: {
    titolo: 'La cima della pila, passo per passo',
    scena: { w: 860, h: 304 },
    atti: ['La pila del kernel', 'Il processore', 'Lo stub', 'Il bilancio'],
    controlli: [
      { id: 'e', tipo: 'scelta', eti: 'Evento', opzioni: [['pf', 'pagina assente'], ['de', 'divisione per zero']], valore: 'pf' },
      { id: 'r', tipo: 'scelta', eti: 'Cima iniziale', opzioni: [[0x2000, '0x2000'], [0x2008, '0x2008']], valore: 0x2000 },
      { id: 'n', tipo: 'scelta', eti: 'Registri salvati dallo stub', opzioni: [[4, '4'], [8, '8'], [15, '15']], valore: 8 }
    ],
    nota: 'I passi sono sempre sei. Ogni valore sulla pila occupa 8 byte.',
    previsione: {
      domanda: (p) => 'La cima della pila del kernel è a ' + SL.kern.H(p.r) + '. L’evento è una ' + (p.e === 'pf' ? 'pagina assente, che ha il codice di errore' : 'divisione per zero, priva di codice di errore') + '. Lo stub salva ' + p.n + ' registri generali. Quanto vale RSP quando lo stub ha finito?',
      opzioni: (p) => { const c = SL.unita415.conti(p); return Array.from(new Set([c.fine, c.base - c.hw, c.top - c.hw - c.sw, c.base - 40 - 8 * p.n])).sort((a, b) => b - a).map((v) => [v, SL.kern.H(v)]); }
    },
    confronto: (pred, esito, p) => { const c = SL.unita415.conti(p), H = SL.kern.H; return 'La previsione indicava ' + H(pred) + '. La cima finale è a ' + H(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === c.base - c.hw ? 'Dopo il processore lavora lo stub, che posa altri ' + c.sw + ' byte.' : pred === c.base - 40 - 8 * p.n ? 'Fra i cinque campi e i registri c’è ancora una casella: il codice di errore, oppure lo zero che ne prende il posto.' : 'Prima di posare il frame il processore allinea la cima a un multiplo di 16.'); },
    costruisci(p) {
      const U = SL.unita415, H = U.H, passi = [], c = U.conti(p), pf = c.cod, allineata = c.top === c.base;
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'PILA DEL KERNEL', 'mono')].concat(U.quadro('q', p, f, { x: 20, y: 24, w: 230, passo: 30, conti: true, xb: 600, wb: 240, hb: 62 }));
      const rsp = [c.top, c.base, c.base - 40, c.slot, c.fine, c.fine];
      const hud = (f) => [['Evento', pf ? 'pagina assente' : 'divisione per zero', 'a'], ['RSP', H(rsp[f])], ['Byte posati', String(c.top - rsp[f]), 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La pila del kernel', 'Il programma viene sospeso da una ' + (pf ? 'pagina assente' : 'divisione per zero') + '. Il processore lascia la pila del programma e passa a quella del kernel, la cui cima si trova a ' + H(c.top) + '.',
        { chiedi: { d: 'Prima di posare il frame il processore porta la cima a un multiplo di 16. L’indirizzo ' + H(c.top) + ' lo è già?', o: ['Sì', 'No'], g: allineata ? 0 : 1, no: allineata ? 'Un multiplo di 16 termina con la cifra esadecimale 0, come ' + H(c.top) + '.' : 'Un multiplo di 16 termina con la cifra esadecimale 0. ' + H(c.top) + ' termina con 8.' } });
      P(1, 0, 'L’allineamento', allineata ? 'La cima ' + H(c.top) + ' è già un multiplo di 16, e l’allineamento la lascia dov’è.' : 'La cima ' + H(c.top) + ' viene abbassata al multiplo di 16 più vicino, ' + H(c.base) + '. Gli 8 byte saltati restano inutilizzati.', { calc: allineata ? 'RSP = ' + H(c.base) : H(c.top) + ' → ' + H(c.base) });
      P(2, 1, 'Il frame di interruzione', 'Il processore posa i cinque valori del frame: SS e RSP del programma, RFLAGS, CS e l’indirizzo di ripresa. Sono 5 × 8 = 40 byte, e la cima scende a ' + H(c.base - 40) + '.', { calc: H(c.base) + ' − 40 = ' + H(c.base - 40) });
      P(3, 1, pf ? 'Il codice di errore' : 'Uno zero al posto del codice', pf ? 'La pagina assente ha un codice di errore, che descrive l’accesso fallito. Il processore lo posa sotto il frame, e la cima scende a ' + H(c.slot) + '. Dal processore sono arrivati in tutto 48 byte.' : 'La divisione per zero è priva di codice di errore, e il processore si ferma a 40 byte. Lo stub di ingresso posa uno zero nella casella che il codice avrebbe occupato. La cima scende a ' + H(c.slot) + ', come dopo una pagina assente.', { calc: pf ? 'processore: 40 + 8 = 48 byte' : 'processore: 40 byte · stub: 8 byte',
        chiedi: { d: 'Lo stub deve salvare ' + p.n + ' registri generali da 8 byte. Quanti byte occupano?', o: [String(p.n), String(8 * p.n), String(16 * p.n)], g: 1, no: p.n + ' registri da 8 byte: ' + p.n + ' × 8 = ' + (8 * p.n) + '.' } });
      P(4, 2, 'I registri generali', 'Lo stub salva ' + p.n + ' registri generali, uno dopo l’altro: ' + p.n + ' × 8 = ' + (8 * p.n) + ' byte. La cima finale è a ' + H(c.fine) + '. Da qui in poi il gestore può usare quei registri liberamente.', { calc: H(c.slot) + ' − ' + (8 * p.n) + ' = ' + H(c.fine), esito: ['RSP = ' + H(c.fine), 'si'] });
      P(5, 3, 'Il bilancio', 'Dalla cima iniziale a quella finale ci sono ' + c.tot + ' byte. Il processore ne ha posati ' + c.hw + ', lo stub ' + c.sw + (allineata ? '.' : ', e 8 sono andati all’allineamento.') + (pf ? ' Con una divisione per zero il processore ne poserebbe 40 e lo stub ' + (c.sw + 8) + ': la cima finale sarebbe la stessa.' : ' Con una pagina assente il processore ne poserebbe 48 e lo stub ' + (c.sw - 8) + ': la cima finale sarebbe la stessa.'), { calc: c.hw + ' + ' + c.sw + (allineata ? '' : ' + 8') + ' = ' + c.tot + ' byte', esito: ['RSP = ' + H(c.fine), 'si'] });
      return { passi, esito: c.fine };
    }
  },
  bilancio: {
    regola: [
      'All’ingresso il processore passa alla pila del kernel, la allinea a un multiplo di 16 e vi posa il frame di interruzione: SS, RSP, RFLAGS, CS e RIP, per 40 byte. Alcune eccezioni aggiungono un codice di errore di 8 byte.',
      'Lo stub di ingresso posa uno zero al posto del codice quando manca, poi salva i registri generali. La pila ha così la stessa forma per ogni evento.'
    ],
    errori: [
      ['Dimenticare l’allineamento.', 'Se la cima iniziale non è un multiplo di 16, il processore la abbassa prima di posare il frame.'],
      ['Contare sempre 48 byte per il processore.', 'Il codice di errore esiste soltanto per alcune eccezioni. Per le altre il processore posa 40 byte, e gli 8 mancanti li aggiunge lo stub.'],
      ['Pensare che il processore salvi i registri generali.', 'Il frame contiene cinque valori. I registri generali sono compito dello stub.']
    ],
    saFare: ['Elencare i cinque valori del frame di interruzione.', 'Distinguere i byte posati dal processore da quelli posati dallo stub.', 'Calcolare la cima della pila alla fine dell’ingresso.'],
    esercizi: [
      { d: 'La cima della pila del kernel è a 0x3000, già allineata. Arriva un interrupt del timer, privo di codice di errore. Quanto vale RSP subito dopo che il processore ha posato il frame? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['2fd8', '0x2fd8', '2fd8h'],
        ok: 'Cinque valori da 8 byte: 0x3000 − 40 = 0x3000 − 0x28 = 0x2FD8.',
        diagnosi: [
          { se: ['2fd0', '0x2fd0', '2fd0h'], msg: 'Un interrupt è privo di codice di errore, e il processore posa 40 byte.' },
          { se: ['2fc0', '0x2fc0', '2fc0h'], msg: 'Quaranta byte in esadecimale sono 0x28.' },
          { se: ['3028', '0x3028', '3028h'], msg: 'La pila cresce verso gli indirizzi bassi: RSP diminuisce.' }
        ],
        altro: 'Il valore è diverso. Si tolga a 0x3000 i 40 byte del frame, in esadecimale.',
        indizi: ['Il frame ha cinque valori da 8 byte.', '40 byte sono 0x28.', '0x3000 − 0x28.'],
        svolgimento: ['Frame: 5 × 8 = 40 byte = 0x28.', 'Nessun codice di errore.', 'RSP = 0x3000 − 0x28 = 0x2FD8.'] },
      { d: 'Dopo una divisione per zero lo stub posa lo zero di riempimento e salva 6 registri generali. Quanti byte ha posato lo stub?', segnaposto: 'Un numero', giuste: ['56', 'cinquantasei'],
        ok: 'Una casella per lo zero e sei per i registri: 7 × 8 = 56 byte.',
        diagnosi: [
          { se: ['48', 'quarantotto'], msg: 'Manca lo zero che prende il posto del codice di errore.' },
          { se: ['7', 'sette'], msg: 'Queste sono le caselle. Ognuna occupa 8 byte.' },
          { se: ['96', 'novantasei'], msg: 'I 40 byte del frame li posa il processore.' }
        ],
        altro: 'Il numero è diverso. Conta le caselle posate dallo stub e moltiplica per 8.',
        indizi: ['La divisione per zero non ha codice di errore.', 'Lo stub posa uno zero, poi 6 registri.', '7 × 8.'],
        svolgimento: ['Zero di riempimento: 1 casella.', 'Registri: 6 caselle.', 'Byte: 7 × 8 = 56.'] },
      { d: 'Perché lo stub posa uno zero quando l’evento non ha codice di errore?', guida: 'Si scelga la risposta.', o: [
        { t: 'Perché la pila abbia la stessa forma per ogni evento', ok: true, fb: 'Il codice che segue trova ogni valore sempre alla stessa distanza dalla cima.' },
        { t: 'Perché il processore lo richiede per poter tornare', fb: 'Al processore bastano i cinque valori del frame. Lo zero serve al software.' },
        { t: 'Per allineare la pila a 16 byte', fb: 'L’allineamento lo fa il processore, prima di posare il frame.' }] }
    ],
    sfida: ['cslez4_1_03_exceptions_03', 'Campi del frame di ingresso']
  }
});
