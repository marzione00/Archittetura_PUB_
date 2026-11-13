'use strict';
SL.unita422 = (() => {
  const PAROLA = 'COMPUTER';
  // fase: 0 gli argomenti · 1 l'ingresso · 2 la convalida · 3 la copia · 4 il ritorno
  const quadro = (pre, p, f, o) => {
    const el = SL.el, ok = p.fd === 'ok', els = [], passo = o.passo, xp = o.x + 8 * passo + o.sep;
    Array.from(PAROLA).forEach((c, k) => els.push(el.cella(pre + 'b' + k, o.x + k * passo, o.y, passo - 6, o.hc, c, k < p.n ? (f === 3 && ok ? 'att' : f === 0 ? 'att' : 'on') : 'zero', { piccola: true })));
    for (let k = 0; k < 8; k++) els.push(el.cella(pre + 'p' + k, xp + k * passo, o.y, passo - 6, o.hc, f >= 3 && ok && k < p.n ? PAROLA[k] : '·', f >= 3 && ok && k < p.n ? (f === 3 ? 'att' : 'on') : 'off', { piccola: true }));
    const y2 = o.y + o.hc + 22, w = (8 * passo * 2 + o.sep - 6 - 2 * o.gap) / 3;
    els.push(el.box(pre + 'r', o.x, y2, w, o.h, 'richiesta write', 'RDI = 4 · RDX = ' + p.n, f === 0 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 't', o.x + w + o.gap, y2, w, o.h, 'tabella dei descrittori · voce 4', f >= 2 ? (ok ? 'pipe, in scrittura' : 'vuota') : '·', f === 2 ? (ok ? 'att' : 'err') : f > 2 ? (ok ? 'on' : 'err') : '', { cls: 'stretta' }),
      el.box(pre + 'e', o.x + 2 * (w + o.gap), y2, w, o.h, 'valore restituito', f >= 4 ? 'RAX = ' + (ok ? p.n : '−9') : 'RAX = ·', f >= 4 ? (ok ? 'att' : 'err') : '', { cls: 'stretta' }));
    if (o.chi) els.push(el.box(pre + 'c', o.x, y2 + o.h + 14, 3 * w + 2 * o.gap, o.h, 'chi lavora', ['il programma, nel modo utente', 'il kernel, al livello 0', 'il kernel controlla il descrittore', ok ? 'il kernel copia i byte' : 'il kernel rinuncia alla copia', 'il programma, nel modo utente'][f], f === 0 || f === 4 ? 'on' : 'att', { cls: 'stretta' }));
    return els;
  };
  return { PAROLA, quadro };
})();
SL.registra('4.2.2', {
  titolo: 'Il percorso di write oltre il confine di privilegio',
  obiettivo: 'Alla fine saprai seguire una write dal buffer del programma fino a una pipe, e dire che cosa controlla il kernel prima di copiare un solo byte.',
  concetti: [['bus', 'Un canale fra due programmi'], ['scudo', 'La convalida del descrittore'], ['register', 'Conteggio oppure errore']],
  filigrana: ['scudo', 'bus', 'register'],
  richiami: {
    carte: [
      { sim: 'file', da: 'Dall’unità 2.5.3', t: 'Il descrittore di file', d: 'Il numero piccolo con cui un processo indica al kernel uno dei propri canali aperti.' },
      { sim: 'scudo', da: 'Dall’unità 2.5.2', t: 'Gli errori delle chiamate', d: 'Un valore negativo in RAX segnala un errore, e il suo opposto ne è il codice.' },
      { sim: 'tabella', da: 'Dall’unità 2.5.5', t: 'La tabella dei descrittori', d: 'Ogni processo ne possiede una: una fila di caselle numerate, che il kernel conserva per lui.' }
    ],
    domanda: { d: 'Prima di proseguire: dopo una write il programma trova RAX = −9. Che cosa significa?', o: [
      { t: 'La chiamata è fallita, con il codice di errore 9', ok: true, fb: 'Un valore negativo segnala un errore. Il suo opposto, 9, dice quale.' },
      { t: 'Sono stati scritti 9 byte', fb: 'Un conteggio di byte è positivo oppure nullo.' },
      { t: 'Mancano 9 byte da scrivere', fb: 'RAX riporta i byte scritti, oppure un errore. I byte mancanti li calcola il programma.' }
    ] }
  },
  idea: {
    titolo: 'Il kernel controlla, poi copia',
    termini: ['pipe (canale)', 'ebadf'],
    testo: [
      'Due programmi possono scambiarsi dati attraverso una [[pipe (canale)|pipe]], un canale gestito dal kernel: i byte che uno vi scrive diventano disponibili all’altro, nello stesso ordine. Una pipe ha due estremità, una per scrivere e una per leggere, e ogni processo indica la propria con un descrittore di file.',
      'Il descrittore è un indice nella tabella dei descrittori, che il kernel tiene per ciascun processo. Ogni voce occupata dice quale oggetto è aperto e in quale modo: in lettura, in scrittura, oppure in entrambi. Il programma conosce soltanto il numero. La tabella sta nella memoria del kernel, fuori dalla sua portata.',
      'Quando il programma chiama write, il kernel diffida degli argomenti. Prima di toccare un solo byte cerca la voce indicata da RDI, e verifica che esista e che permetta la scrittura. Soltanto allora copia i byte dal buffer del programma alla pipe, e restituisce in RAX quanti ne ha copiati.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Quattro byte dal buffer alla pipe', nota: 'RDX = 4 sceglie le prime quattro lettere. Il kernel le copia dopo avere controllato la voce 4.', els: SL.unita422.quadro('g', { fd: 'ok', n: 4 }, 4, { x: 10, y: 8, passo: 42, sep: 28, hc: 38, h: 54, gap: 12 }) },
      'Se la voce è vuota, perché quel descrittore è stato chiuso oppure mai aperto, la copia nemmeno comincia. Il kernel restituisce −9, il codice dell’errore [[ebadf|EBADF]], e la pipe resta com’era. Il programma distingue i due esiti dal segno di RAX: un numero positivo è un conteggio di byte, un numero negativo è un errore.',
      'Per questo la scrittura passa dal kernel. Un programma capace di scrivere da solo nella propria pipe saprebbe scrivere anche in quelle degli altri. Il confine di privilegio obbliga ogni richiesta ad attraversare un controllo.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma ha nel buffer la parola COMPUTER, una lettera per byte, e chiama write sul descrittore 4. Sceglierai quanti byte chiede di scrivere e se il descrittore 4 è ancora aperto.',
      'Seguiremo la richiesta: l’ingresso nel kernel, il controllo della tabella dei descrittori, la copia e il valore restituito. Dopo il caso proposto, chiudi il descrittore e ripeti.'
    ],
    vedrai: [
      ['memory', 'Il buffer e la pipe', 'In alto: a sinistra gli otto byte del programma, a destra il contenuto della pipe.'],
      ['tabella', 'La tabella dei descrittori', 'Al centro: la voce 4 del processo, come la vede il kernel.'],
      ['register', 'Il valore restituito', 'A destra: ciò che il programma troverà in RAX.']
    ]
  },
  lab: {
    titolo: 'COMPUTER verso la pipe',
    scena: { w: 860, h: 250 },
    atti: ['La richiesta', 'L’ingresso', 'La convalida', 'L’esito'],
    controlli: [
      { id: 'fd', tipo: 'scelta', eti: 'Descrittore 4', opzioni: [['ok', 'pipe aperta in scrittura'], ['bad', 'già chiuso']], valore: 'ok' },
      { id: 'n', tipo: 'scelta', eti: 'Byte richiesti', opzioni: [[2, '2'], [4, '4'], [8, '8']], valore: 4 }
    ],
    nota: 'I passi sono sempre cinque. La pipe ha spazio per tutti i byte richiesti.',
    previsione: {
      domanda: (p) => 'Il programma chiama write sul descrittore 4 con RDX = ' + p.n + '. Il descrittore 4 ' + (p.fd === 'ok' ? 'indica una pipe aperta in scrittura' : 'è già stato chiuso') + '. Quale valore trova in RAX al ritorno?',
      opzioni: (p) => Array.from(new Set([p.n, 8, 0, -9])).sort((a, b) => b - a).map((v) => [v, v < 0 ? '−9' : String(v)])
    },
    confronto: (pred, esito, p) => { const N = (v) => (v < 0 ? '−9' : String(v)); return 'Avevi previsto ' + N(pred) + '. Il programma trova RAX = ' + N(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.fd === 'bad' ? 'La voce 4 è vuota, e il kernel risponde con l’errore EBADF senza copiare nulla.' : 'RAX riporta i byte copiati, che qui sono quelli chiesti con RDX.'); },
    costruisci(p) {
      const U = SL.unita422, passi = [], ok = p.fd === 'ok', v = ok ? p.n : -9, R = ok ? String(p.n) : '−9', pre = U.PAROLA.slice(0, p.n);
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'BUFFER DEL PROGRAMMA', 'mono'), SL.el.nota('t1', 452, 0, 'PIPE', 'mono')].concat(U.quadro('q', p, f, { x: 20, y: 24, passo: 50, sep: 32, hc: 40, h: 58, gap: 14, chi: true }));
      const hud = (f) => [['Byte richiesti', String(p.n), 'a'], ['Byte nella pipe', f >= 3 && ok ? String(p.n) : '0'], ['RAX al ritorno', f >= 4 ? R : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La richiesta', 'Il buffer del programma contiene COMPUTER, una lettera per byte. Il programma prepara RAX = 1 per scegliere write, RDI = 4 per il descrittore, RSI con l’indirizzo del buffer e RDX = ' + p.n + ': chiede di scrivere i primi ' + p.n + ' byte, cioè ' + pre + '.',
        { chiedi: { d: 'Il programma può scrivere da solo nella pipe, senza passare dal kernel?', o: ['Sì, conosce il descrittore', 'No, la pipe sta nella memoria del kernel'], g: 1, no: 'Il descrittore è soltanto un numero. La pipe e la tabella che la descrive sono fuori dalla portata del programma.' } });
      P(1, 1, 'L’ingresso', 'SYSCALL porta il processore al livello 0. Lo smistamento, con RAX = 1, sceglie la routine di write. Da questo momento lavora il kernel, e il programma attende.', { calc: 'RAX = 1 → write' });
      P(2, 2, 'La convalida', ok ? 'Il kernel cerca la voce 4 nella tabella dei descrittori del processo. La voce esiste: indica una pipe, ed è aperta in scrittura. La richiesta è lecita.' : 'Il kernel cerca la voce 4 nella tabella dei descrittori del processo. La voce è vuota, perché il programma ha già chiuso quel descrittore. La richiesta non può essere servita.', { calc: 'voce 4: ' + (ok ? 'pipe, in scrittura' : 'vuota') });
      P(3, 3, ok ? 'La copia' : 'Nessuna copia', ok ? 'Il kernel copia ' + p.n + ' byte dal buffer del programma alla pipe: ' + pre + '. Da ora il programma che legge dall’altra estremità può riceverli, nello stesso ordine.' : 'Il kernel rinuncia. Nessun byte lascia il buffer, e la pipe resta com’era. Le lettere ' + pre + ' esistono soltanto nella memoria del programma.', { calc: ok ? 'copiati: ' + pre : 'copiati: nessuno' });
      P(4, 3, 'Il ritorno', ok ? 'Il kernel mette in RAX il numero di byte copiati, ' + p.n + ', e restituisce il controllo. Il programma trova un valore positivo: la scrittura è riuscita.' : 'Il kernel mette in RAX il valore −9 e restituisce il controllo. Il segno negativo dice al programma che la scrittura è fallita, e il 9 è il codice di EBADF, descrittore non valido.', { calc: 'RAX = ' + R, esito: ['RAX = ' + R, ok ? 'si' : 'no'] });
      return { passi, esito: v };
    }
  },
  bilancio: {
    regola: [
      'Prima di servire una write il kernel cerca il descrittore nella tabella del processo, e verifica che la voce esista e permetta la scrittura. Soltanto allora copia i byte.',
      'In RAX il programma trova il numero di byte copiati oppure un valore negativo. Il valore −9 è EBADF: il descrittore non indica alcun oggetto aperto.'
    ],
    errori: [
      ['Pensare che il descrittore dia accesso diretto all’oggetto.', 'Il descrittore è un indice in una tabella del kernel. Ogni operazione passa da una chiamata di sistema.'],
      ['Leggere −9 come un conteggio.', 'Un valore negativo è sempre un errore. Nessun byte è stato copiato.'],
      ['Credere che un errore lasci la pipe a metà.', 'La convalida precede la copia. Se fallisce, la pipe resta com’era.']
    ],
    saFare: ['Descrivo che cosa contiene la tabella dei descrittori.', 'Dico che cosa controlla il kernel prima di una write.', 'Distinguo un conteggio da un errore nel valore restituito.'],
    esercizi: [
      { d: 'Il buffer contiene COMPUTER. Il programma chiama write su una pipe aperta, con RDX = 3. Quali lettere entrano nella pipe?', segnaposto: 'Le lettere, in ordine', giuste: ['com'],
        ok: 'RDX = 3 sceglie i primi tre byte del buffer: C, O e M.',
        diagnosi: [
          { se: ['ter'], msg: 'La write parte dall’inizio del buffer, indicato da RSI.' },
          { se: ['computer'], msg: 'RDX limita la scrittura a 3 byte.' },
          { se: ['comp'], msg: 'I byte richiesti sono 3.' }
        ],
        altro: 'La risposta è diversa. Conta 3 byte a partire dal primo.',
        indizi: ['La write parte dal byte indicato da RSI.', 'RDX dice quanti byte scrivere.', 'I primi 3 byte di COMPUTER.'],
        svolgimento: ['Primo byte: C.', 'Byte richiesti: 3.', 'Nella pipe entrano C, O, M.'] },
      { d: 'Un programma chiude il descrittore 5 e poi chiama write sul descrittore 5. Che cosa accade?', guida: 'Scegli la risposta.', o: [
        { t: 'Il kernel restituisce −9 senza scrivere nulla', ok: true, fb: 'La voce 5 è vuota. La convalida fallisce prima della copia, con l’errore EBADF.' },
        { t: 'I byte vengono scritti sul file che il descrittore indicava', fb: 'Chiudendo il descrittore la voce è stata svuotata. Il kernel non ha più alcun oggetto a cui riferirsi.' },
        { t: 'Il programma viene terminato', fb: 'Un descrittore sbagliato produce un errore nel valore restituito. Il programma prosegue e può reagire.' }] },
      { d: 'Dove si trova la tabella dei descrittori di un processo?', guida: 'Scegli la risposta.', o: [
        { t: 'Nella memoria del kernel', ok: true, fb: 'Il programma ne conosce soltanto gli indici. Per questo ogni operazione richiede una chiamata di sistema.' },
        { t: 'Nel buffer del programma', fb: 'Se fosse lì il programma potrebbe modificarla, e darsi accesso a qualunque oggetto.' },
        { t: 'Nei registri del processore', fb: 'Nei registri viaggia il numero del descrittore. La tabella è una struttura dati del kernel.' }] }
    ],
    sfida: ['cslez4_2_02_syscalls_02', 'Passaggio dalla modalità utente al kernel']
  }
});
