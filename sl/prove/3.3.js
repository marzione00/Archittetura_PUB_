'use strict';
/* Prova del capitolo 3.3: una domanda per unità, sulla CPU del caso di studio. */
(() => {
  const I = SL.scritture.intero, ESA = SL.scritture.esa, C = SL.isa, H = C.esa, N = C.num;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const PA = (v) => (v < 0 ? '(' + N(v) + ')' : String(v));

  SL.registraProva('3.3', { domande: [
    // 3.3.1 · il registro di destinazione dopo add, sub, mov; oppure ZF
    (r) => {
      const reg = r.mescola(['rax', 'rbx', 'rcx', 'rdx']), d = reg[0], s = reg[1], a = r.int(-12, 20), b0 = r.int(-12, 20), op = r.scegli(['add', 'sub', 'sub', 'rr']);
      const T = (n) => C.testo({ n, a: d, b: s }), D = d.toUpperCase(), S = s.toUpperCase();
      if (r.int(0, 2) > 0) {
        const b = b0, giusto = op === 'add' ? b + a : op === 'sub' ? b - a : a, giuste = I(giusto);
        return { u: '3.3.1', d: 'Nella CPU del caso di studio il registro ' + D + ' vale ' + N(b) + ' e ' + S + ' vale ' + N(a) + '. Dopo `' + T(op) + '`, quanto vale ' + D + '?', segnaposto: 'Un numero', giuste,
          ok: op === 'rr' ? '`mov` copia il secondo operando, ' + S + ', nel primo.' : op === 'add' ? 'La destinazione riceve ' + D + ' + ' + S + ' = ' + N(b) + ' + ' + PA(a) + '.' : 'La destinazione riceve ' + D + ' − ' + S + ' = ' + N(b) + ' − ' + PA(a) + '.',
          diagnosi: DIAG(giuste, [
            op === 'sub' ? { se: I(a - b), msg: 'È stata calcolata la differenza fra il secondo operando e il primo. `sub` sottrae il secondo operando dal primo.' } : null,
            { se: I(b), msg: op === 'rr' ? 'Questo è il valore precedente di ' + D + ', che la copia sostituisce.' : 'Questo è il valore precedente di ' + D + '. L’istruzione lo sostituisce con il risultato.' },
            op !== 'rr' ? { se: I(a), msg: 'Questo è il valore del secondo operando, che resta invariato. La destinazione riceve il risultato dell’operazione.' } : null,
            op !== 'add' ? { se: I(a + b), msg: 'Questa è la somma. L’istruzione è `' + C.mnemonico(op) + '`.' } : { se: I(b - a), msg: 'Questa è la differenza. L’istruzione è `add`.' }
          ]),
          altro: 'Il numero è diverso. La destinazione è il primo operando: si stabilisca che cosa vi scrive `' + C.mnemonico(op) + '`.',
          indizi: ['La destinazione è ' + D + ', il secondo operando è ' + S + '.', op === 'rr' ? '`mov` è una copia.' : op === 'add' ? '`add` calcola il primo operando più il secondo.' : '`sub` calcola il primo operando meno il secondo.', op === 'rr' ? 'La destinazione riceve ' + N(a) + '.' : N(b) + (op === 'add' ? ' + ' : ' − ') + PA(a) + '.'],
          svolgimento: ['Destinazione: ' + D + ' = ' + N(b) + '. Secondo operando: ' + S + ' = ' + N(a) + '.', op === 'rr' ? 'Copia: ' + D + ' = ' + N(a) + '.' : N(b) + (op === 'add' ? ' + ' : ' − ') + PA(a) + ' = ' + N(giusto) + '.', D + ' = ' + N(giusto) + '.'] };
      }
      const o2 = r.scegli(['add', 'sub', 'rr']), b = r.int(0, 3) === 0 ? (o2 === 'add' ? -a : a) : b0, ris = o2 === 'add' ? b + a : b - a, z0 = r.int(0, 1), zf = o2 === 'rr' ? z0 : ris === 0 ? 1 : 0;
      const perche = o2 === 'rr' ? '`mov` è una copia e lascia invariato ZF, che valeva ' + z0 + '.' : 'Il risultato è ' + N(b) + (o2 === 'add' ? ' + ' : ' − ') + PA(a) + ' = ' + N(ris) + (zf ? ', cioè zero.' : ', diverso da zero.');
      return { u: '3.3.1', d: 'Nella CPU del caso di studio ' + D + ' vale ' + N(b) + ', ' + S + ' vale ' + N(a) + ' e ZF vale ' + z0 + '. Dopo `' + T(o2) + '`, quanto vale ZF?', guida: 'Si scelga la risposta.',
        o: [{ t: 'ZF = 1', ok: zf === 1, fb: perche }, { t: 'ZF = 0', ok: zf === 0, fb: perche }, { t: 'ZF resta indefinito', fb: 'ZF ha sempre un valore: lo pongono a 0 o a 1 le istruzioni aritmetiche e logiche, e lo lasciano invariato le altre. ' + perche }] };
    },
    // 3.3.2 · valP a partire dal primo byte
    (r) => {
      const TUTTE = [{ n: 'halt' }, { n: 'nop' }, { n: 'rr', a: 'rax', b: 'rcx' }, { n: 'add', a: 'rdx', b: 'rbx' }, { n: 'or', a: 'rax', b: 'rax' }, { n: 'sub', a: 'rcx', b: 'rbx' }, { n: 'and', a: 'rsi', b: 'rdi' }, { n: 'je', c: 0x100 }, { n: 'ir', b: 'rax', c: 7 }, { n: 'mr', a: 'rax', b: 'rbx', c: 8 }, { n: 'rm', a: 'rcx', b: 'rbp', c: 16 }];
      const i = r.scegli(TUTTE), pc = 0x20 + 4 * r.int(0, 120), n = C.lung(i.n), b0 = C.esa2(C.byteIst(i)[0]), giuste = ESA(pc + n, 3), F = C.FORMA[i.n];
      return { u: '3.3.2', d: 'Un’istruzione della CPU del caso di studio ha inizio all’indirizzo ' + H(pc) + ' con il byte ' + b0 + ', il codice di `' + F + '`. Quanto vale valP? Si risponda in esadecimale.', segnaposto: 'Per esempio ' + H(pc + 4), giuste,
        ok: '`' + F + '` occupa ' + n + ' byte: il codice' + (C.conRegistri(i.n) ? ', il byte dei registri' : '') + (C.conCostante(i.n) ? ', la costante di otto byte' : '') + '. valP = ' + H(pc) + ' + ' + n + ' = ' + H(pc + n) + '.',
        diagnosi: DIAG(giuste, [1, 2, 9, 10].filter((k) => k !== n).map((k) => ({ se: ESA(pc + k, 3), msg: 'Sono stati contati ' + k + ' byte. `' + F + '` ne occupa ' + n + ': un byte di codice' + (C.conRegistri(i.n) ? ', uno per i registri' : ', nessuno per i registri') + (C.conCostante(i.n) ? ', otto per la costante.' : ', nessuno per una costante.') })).concat([{ se: ESA(pc, 3), msg: 'Questo è l’indirizzo dell’istruzione stessa. valP è l’indirizzo della successiva.' }])),
        altro: 'Il valore è diverso. Si stabilisca la lunghezza di `' + F + '` e la si sommi al PC, in esadecimale.',
        indizi: ['Il codice occupa sempre 1 byte.', (C.conRegistri(i.n) ? 'Il byte dei registri è presente' : 'Il byte dei registri è assente') + (C.conCostante(i.n) ? ', e la costante di otto byte è presente.' : ', e la costante è assente.'), H(pc) + ' + ' + n + '.'],
        svolgimento: ['Categoria: icode ' + b0[0] + ', `' + F + '`.', 'Lunghezza: ' + n + ' byte.', 'valP = ' + H(pc) + ' + ' + n + ' = ' + H(pc + n) + '.'] };
    },
    // 3.3.3 · valE, oppure l'ultima cella letta
    (r) => {
      const rb = r.scegli(['rbx', 'rcx', 'rdx', 'rsi']), ra = r.scegli(['rax', 'rdi']), b = 8 * r.int(4, 60), dd = 8 * r.int(-3, 6), cosa = r.int(0, 1), valE = b + dd, giusto = cosa ? valE + 7 : valE, giuste = I(giusto), RB = rb.toUpperCase();
      return { u: '3.3.3', d: 'Si esegue `mov ' + ra + ', ' + dd + '(' + rb + ')` con ' + RB + ' = ' + b + '. ' + (cosa ? 'Qual è l’indirizzo dell’ultima cella letta dalla memoria?' : 'Quanto vale valE?'), segnaposto: 'Un numero', giuste,
        ok: 'valE = valB + valC = ' + b + ' + ' + PA(dd) + ' = ' + valE + '.' + (cosa ? ' La parola occupa otto celle, fino a ' + valE + ' + 7 = ' + (valE + 7) + '.' : ''),
        diagnosi: DIAG(giuste, [
          cosa ? { se: I(valE), msg: 'Questo è valE, l’indirizzo della prima cella. La parola prosegue nelle sette successive.' } : { se: I(valE + 7), msg: 'Questo è l’indirizzo dell’ultima cella letta. valE è l’indirizzo della prima.' },
          cosa ? { se: I(valE + 8), msg: 'La prima cella è valE stessa, quindi l’ottava è valE + 7.' } : null,
          { se: I(b), msg: 'Questo è valB, la base. Va sommato lo spostamento valC.' },
          dd ? { se: I(b - dd), msg: 'Lo spostamento va sommato con il suo segno: ' + b + ' + ' + PA(dd) + '.' } : null,
          dd ? { se: I(dd), msg: 'Questo è valC, lo spostamento. Va sommato alla base.' } : null
        ]),
        altro: 'Il numero è diverso. Si sommino base e spostamento' + (cosa ? ', poi si aggiunga 7 per ottenere l’ottava cella.' : '.'),
        indizi: ['valB è il contenuto di ' + RB + ': ' + b + '.', 'valC è lo spostamento: ' + N(dd) + '.', cosa ? 'valE = ' + valE + ', e l’ultima cella è valE + 7.' : b + ' + ' + PA(dd) + '.'],
        svolgimento: ['valB = ' + b + ', valC = ' + N(dd) + '.', 'valE = ' + b + ' + ' + PA(dd) + ' = ' + valE + '.', cosa ? 'Ultima cella: ' + valE + ' + 7 = ' + (valE + 7) + '.' : 'valE = ' + valE + '.'] };
    },
    // 3.3.4 · il codice di stato
    (r) => {
      const M = r.scegli([64, 128, 256]), tipo = r.scegli(['mem', 'mem', 'mem', 'halt', 'ris']), op = r.scegli(['mov rax, 0(rbx)', 'mov 0(rbx), rax']), a = M - r.int(5, 12) + r.int(0, 8), bris = r.scegli(['80', 'A0', 'C0', 'F0']);
      const stat = tipo === 'ris' ? 'SINS' : tipo === 'halt' ? 'SHLT' : a + 7 > M - 1 ? 'SADR' : 'SAOK';
      const FB = { SAOK: tipo === 'mem' ? 'L’accesso impiegherebbe le celle da ' + a + ' a ' + (a + 7) + ', e la memoria termina alla cella ' + (M - 1) + '.' : 'SAOK accompagna le istruzioni dopo le quali l’esecuzione prosegue.', SHLT: tipo === 'halt' ? '`halt` è un’istruzione valida, che richiede l’arresto.' : 'SHLT segnala l’esecuzione di `halt`, assente in questo caso.', SADR: tipo === 'mem' ? 'L’accesso impiegherebbe le celle da ' + a + ' a ' + (a + 7) + ', e la memoria termina alla cella ' + (M - 1) + '.' : 'Questa istruzione è priva di accessi alla memoria dei dati, quindi nessun indirizzo può risultare non valido.', SINS: tipo === 'ris' ? 'Il primo byte ha icode ' + bris[0] + ', e le categorie previste vanno da 0 a 7.' : 'Il primo byte corrisponde a una categoria prevista.' };
      return { u: '3.3.4', d: 'La memoria dei dati ha ' + M + ' celle, numerate da 0 a ' + (M - 1) + '. ' + (tipo === 'mem' ? 'Si esegue `' + op + '` con RBX = ' + a + '.' : tipo === 'halt' ? 'Si esegue `halt`.' : 'Il primo byte dell’istruzione vale ' + bris + '.') + ' Quale codice di stato ne risulta?', guida: 'Si scelga la risposta.',
        o: ['SAOK', 'SHLT', 'SADR', 'SINS'].map((k) => (k === stat ? { t: k, ok: true, fb: FB[k] } : { t: k, fb: FB[k] })) };
    },
    // 3.3.5 · sub seguita da je: ZF, Cnd o il nuovo PC
    (r) => {
      const ra = r.scegli(['rax', 'rcx', 'rdx']), rb = r.scegli(['rbx', 'rsi']), a = r.int(1, 9), b = r.int(0, 2) === 0 ? a : r.int(1, 9), pc = 0x20 + 4 * r.int(0, 100), t = 0x200 + 16 * r.int(0, 60), cosa = r.int(0, 2);
      const zf = a === b ? 1 : 0, vp = pc + 2 + 9, fine = zf ? t : vp, RA = ra.toUpperCase(), RB = rb.toUpperCase();
      const testo = 'All’indirizzo ' + H(pc) + ' si trova `sub ' + ra + ', ' + rb + '`, seguita da `je ' + H(t) + '`. ' + RA + ' vale ' + a + ' e ' + RB + ' vale ' + b + '. ';
      if (cosa < 2) {
        const perche = 'La differenza ' + a + ' − ' + b + ' vale ' + (a - b) + (zf ? ': ZF = 1 e Cnd = 1.' : ': ZF = 0 e Cnd = 0.');
        return { u: '3.3.5', d: testo + (cosa ? 'Quanto vale Cnd, calcolato da `je`?' : 'Quanto vale ZF dopo `sub`?'), guida: 'Si scelga la risposta.',
          o: [{ t: '1', ok: zf === 1, fb: perche }, { t: '0', ok: zf === 0, fb: perche }, { t: 'Dipende dal valore di ' + RA + ' prima della sottrazione', fb: 'Per ZF è rilevante soltanto il risultato della sottrazione. ' + perche }] };
      }
      const giuste = ESA(fine, 3);
      return { u: '3.3.5', d: testo + 'Quale valore riceve il PC dopo il salto? Si risponda in esadecimale.', segnaposto: 'Per esempio ' + H(pc + 16), giuste,
        ok: zf ? 'La differenza è zero: ZF = 1, Cnd = 1, e il PC riceve valC = ' + H(t) + '.' : 'La differenza è diversa da zero: ZF = 0, Cnd = 0, e il PC riceve valP = ' + H(pc + 2) + ' + 9 = ' + H(vp) + '.',
        diagnosi: DIAG(giuste, [
          { se: ESA(zf ? vp : t, 3), msg: zf ? 'Con Cnd = 1 il PC riceve la destinazione, non valP.' : 'La destinazione è scelta soltanto con ZF = 1. Qui ZF vale 0.' },
          { se: ESA(pc + 2, 3), msg: 'Questo è l’indirizzo del salto stesso.' },
          { se: ESA(pc + 2 + 10, 3), msg: '`je` occupa 9 byte, poiché non ha il byte dei registri.' }
        ]),
        altro: 'Il valore è diverso. Si calcoli ZF dalla sottrazione, quindi si scelga fra valC e valP del salto.',
        indizi: ['`sub` è lunga 2 byte: `je` ha inizio a ' + H(pc + 2) + '.', 'ZF vale 1 soltanto se ' + RA + ' − ' + RB + ' è zero.', zf ? 'Con Cnd = 1 il PC riceve ' + H(t) + '.' : 'Con Cnd = 0 il PC riceve valP = ' + H(pc + 2) + ' + 9.'],
        svolgimento: [a + ' − ' + b + ' = ' + (a - b) + ': ZF = ' + zf + '.', 'Cnd = ' + zf + '.', 'PC = ' + H(fine) + '.'] };
    },
    // 3.3.6 · l'indirizzo di un'etichetta, oppure i byte di un salto
    (r) => {
      if (r.int(0, 2) > 0) {
        const pc = 0x40 + 0x10 * r.int(0, 40), extra = r.scegli([[], ['rr'], ['add'], ['rr', 'add'], ['ir']]), n = r.int(0, 5), NUM = ['', 'una', 'due', 'tre', 'quattro', 'cinque'];
        const TESTI = { ir: '`mov rax, 1`', rr: '`mov rbx, rax`', add: '`add rax, rbx`', je: '`je fine`' };
        const prima = ['ir'].concat(extra, ['je']), byte = prima.reduce((s, x) => s + C.lung(x), 0) + n, fine = pc + byte, giuste = ESA(fine, 3);
        const elenco = prima.map((x) => TESTI[x]).concat(n ? [NUM[n] + ' `nop`'] : []).join(', ');
        return { u: '3.3.6', d: 'Un programma ha inizio all’indirizzo ' + H(pc) + ' e contiene, nell’ordine: ' + elenco + ' e, all’etichetta `fine`, una `halt`. Quale indirizzo riceve `fine`? Si risponda in esadecimale.', segnaposto: 'Per esempio ' + H(pc + 16), giuste,
          ok: '`fine` è preceduta da ' + prima.map((x) => C.lung(x)).concat(n ? [n] : []).join(' + ') + ' = ' + byte + ' byte: ' + H(pc) + ' + ' + byte + ' = ' + H(fine) + '.',
          diagnosi: DIAG(giuste, [
            { se: ESA(fine + 1, 3), msg: 'La `halt` si trova all’etichetta stessa, quindi il suo byte è escluso dal calcolo.' },
            n ? { se: ESA(fine - n, 3), msg: 'Fra `je` e l’etichetta ' + (n === 1 ? 'è presente una `nop`, di un byte.' : 'sono presenti ' + n + ' `nop`, da un byte ciascuna.') } : null,
            { se: ESA(pc + parseInt(String(byte), 16), 3), msg: 'I byte prima dell’etichetta sono ' + byte + ' in decimale. Vanno convertiti in esadecimale prima della somma con ' + H(pc) + '.' },
            { se: ESA(fine - 9, 3), msg: 'Anche `je` occupa spazio, 9 byte, e precede l’etichetta.' }
          ]),
          altro: 'L’indirizzo è diverso. Si sommino le lunghezze delle istruzioni che precedono l’etichetta, e si aggiunga il totale a ' + H(pc) + ' in esadecimale.',
          indizi: ['Lunghezze: `mov rB, V` 10, `mov rA, rB` e `add` 2, `je` 9, `nop` 1.', 'Byte prima dell’etichetta: ' + byte + '.', byte + ' in esadecimale è ' + H(byte) + '.'],
          svolgimento: ['Byte prima di `fine`: ' + prima.map((x) => C.lung(x)).concat(n ? [n] : []).join(' + ') + ' = ' + byte + '.', byte + ' = ' + H(byte) + '.', 'fine = ' + H(pc) + ' + ' + H(byte) + ' = ' + H(fine) + '.'] };
      }
      const dest = 0x100 + r.int(1, 0xEFF), b = C.byteIst({ n: 'je', c: dest }).slice(0, 3).map(C.esa2), giuste = [b.join('').toLowerCase()];
      return { u: '3.3.6', d: 'Quali sono i primi tre byte della codifica di `je ' + H(dest) + '`? Il codice di `je` è ' + b[0] + '. Si risponda in esadecimale, nell’ordine in cui i byte compaiono in memoria.', segnaposto: 'Per esempio 73 00 00', giuste,
        ok: 'Dopo il codice ' + b[0] + ' segue la destinazione in little-endian: prima ' + b[1] + ', poi ' + b[2] + '.',
        diagnosi: DIAG(giuste, [
          { se: [(b[0] + b[2] + b[1]).toLowerCase()], msg: 'La costante è in little-endian: il primo è il byte meno significativo, ' + b[1] + '.' },
          { se: [(b[0] + b[1] + '00').toLowerCase()], msg: 'Il secondo byte della costante è la parte alta di ' + H(dest) + ', cioè ' + b[2] + '.' },
          { se: [(b[1] + b[2] + b[0]).toLowerCase()], msg: 'Il primo byte dell’istruzione è il codice, ' + b[0] + '. La destinazione segue il codice.' }
        ]),
        altro: 'I byte sono diversi. Si scriva il codice, poi la destinazione a partire dal byte meno significativo.',
        indizi: ['Il primo byte è il codice, ' + b[0] + '.', H(dest) + ' si divide nei byte ' + b[2] + ' e ' + b[1] + ', dal più significativo.', 'In memoria la costante compare in ordine inverso: ' + b[1] + ', ' + b[2] + ', poi zeri.'],
        svolgimento: ['Codice: ' + b[0] + '.', 'Costante ' + H(dest) + ' in little-endian: ' + b[1] + ' ' + b[2] + ' 00 00 00 00 00 00.', 'Primi tre byte: ' + b.join(' ') + '.'] };
    }
  ] });
})();
