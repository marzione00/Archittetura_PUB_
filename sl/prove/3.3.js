'use strict';
/* Prova del capitolo 3.3: una domanda per unità. */
(() => {
  const I = SL.scritture.intero, ESA = SL.scritture.esa, Y = SL.y86, H = Y.esa, N = SL.x86.num;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const PA = (v) => (v < 0 ? '(' + N(v) + ')' : String(v));

  SL.registraProva('3.3', { domande: [
    // 3.3.1 · il registro di destinazione dopo addq, subq, rrmovq; oppure ZF e SF
    (r) => {
      const reg = r.mescola(['rax', 'rbx', 'rcx', 'rdx']), s = reg[0], d = reg[1], a = r.int(-12, 20), b0 = r.int(-12, 20), op = r.scegli(['addq', 'subq', 'subq', 'rrmovq']);
      if (r.int(0, 2) > 0) {
        const b = b0, giusto = op === 'addq' ? b + a : op === 'subq' ? b - a : a, giuste = I(giusto);
        return { u: '3.3.1', d: 'In una macchina Y86-64 il registro %' + s + ' vale ' + N(a) + ' e %' + d + ' vale ' + N(b) + '. Dopo `' + op + ' %' + s + ', %' + d + '`, quanto vale %' + d + '?', segnaposto: 'Un numero', giuste,
          ok: op === 'rrmovq' ? '`rrmovq` copia la sorgente, %' + s + ', nella destinazione.' : op === 'addq' ? 'La destinazione riceve %' + d + ' + %' + s + ' = ' + N(b) + ' + ' + PA(a) + '.' : 'La destinazione riceve %' + d + ' − %' + s + ' = ' + N(b) + ' − ' + PA(a) + '.',
          diagnosi: DIAG(giuste, [
            op === 'subq' ? { se: I(a - b), msg: 'Hai calcolato sorgente meno destinazione. In Y86-64 `subq` toglie la sorgente dalla destinazione.' } : null,
            { se: I(b), msg: op === 'rrmovq' ? 'Questo è il vecchio valore di %' + d + ', che la copia sostituisce.' : 'Questo è il vecchio valore di %' + d + '. L’istruzione lo sostituisce con il risultato.' },
            op !== 'rrmovq' ? { se: I(a), msg: 'Questo è il valore della sorgente, che resta intatta. La destinazione riceve il risultato dell’operazione.' } : null,
            op !== 'addq' ? { se: I(a + b), msg: 'Questa è la somma. L’istruzione è `' + op + '`.' } : { se: I(b - a), msg: 'Questa è la differenza. L’istruzione è `addq`.' }
          ]),
          altro: 'Il numero è diverso. La destinazione è l’operando di destra: stabilisci che cosa vi scrive `' + op + '`.',
          indizi: ['La sorgente è %' + s + ', la destinazione è %' + d + '.', op === 'rrmovq' ? '`rrmovq` è una copia.' : op === 'addq' ? '`addq` calcola destinazione più sorgente.' : '`subq` calcola destinazione meno sorgente.', op === 'rrmovq' ? 'La destinazione riceve ' + N(a) + '.' : N(b) + (op === 'addq' ? ' + ' : ' − ') + PA(a) + '.'],
          svolgimento: ['Sorgente: %' + s + ' = ' + N(a) + '. Destinazione: %' + d + ' = ' + N(b) + '.', op === 'rrmovq' ? 'Copia: %' + d + ' = ' + N(a) + '.' : N(b) + (op === 'addq' ? ' + ' : ' − ') + PA(a) + ' = ' + N(giusto) + '.', '%' + d + ' = ' + N(giusto) + '.'] };
      }
      const o2 = r.scegli(['addq', 'subq']), b = r.int(0, 3) === 0 ? (o2 === 'addq' ? -a : a) : b0, ris = o2 === 'addq' ? b + a : b - a, zf = ris === 0 ? 1 : 0, sf = ris < 0 ? 1 : 0, giusta = zf + ',' + sf;
      const perche = 'Il risultato è ' + N(b) + (o2 === 'addq' ? ' + ' : ' − ') + PA(a) + ' = ' + N(ris) + (zf ? ', cioè zero.' : sf ? ', un numero negativo.' : ', un numero positivo.');
      return { u: '3.3.1', d: 'In una macchina Y86-64 il registro %' + s + ' vale ' + N(a) + ' e %' + d + ' vale ' + N(b) + '. Dopo `' + o2 + ' %' + s + ', %' + d + '`, quanto valgono i codici di condizione ZF e SF?', guida: 'Scegli la risposta.',
        o: ['0,0', '1,0', '0,1', '1,1'].map((k) => (k === giusta ? { t: 'ZF = ' + k[0] + ' e SF = ' + k[2], ok: true, fb: perche } : { t: 'ZF = ' + k[0] + ' e SF = ' + k[2], fb: k === '1,1' ? 'Un risultato nullo ha il bit di segno a 0, quindi ZF e SF non valgono mai 1 insieme. ' + perche : perche })) };
    },
    // 3.3.2 · valP a partire dal primo byte
    (r) => {
      const TUTTE = [{ n: 'halt' }, { n: 'nop' }, { n: 'ret' }, { n: 'rrmovq', a: 'rax', b: 'rcx' }, { n: 'addq', a: 'rdx', b: 'rbx' }, { n: 'xorq', a: 'rax', b: 'rax' }, { n: 'subq', a: 'rcx', b: 'rbx' }, { n: 'pushq', a: 'rbx' }, { n: 'popq', a: 'rax' }, { n: 'jmp', c: 0x100 }, { n: 'jne', c: 0x100 }, { n: 'jle', c: 0x100 }, { n: 'call', c: 0x100 }, { n: 'irmovq', b: 'rax', c: 7 }, { n: 'rmmovq', a: 'rax', b: 'rbx', c: 8 }, { n: 'mrmovq', a: 'rax', b: 'rbx', c: 8 }];
      const i = r.scegli(TUTTE), pc = 0x20 + 4 * r.int(0, 120), n = Y.lung(i.n), b0 = Y.esa2(Y.byteIst(i)[0]), giuste = ESA(pc + n, 3);
      return { u: '3.3.2', d: 'Un’istruzione Y86-64 comincia all’indirizzo ' + H(pc) + ' con il byte ' + b0 + ', il codice di `' + i.n + '`. Quanto vale valP? Rispondi in esadecimale.', segnaposto: 'Per esempio ' + H(pc + 4), giuste,
        ok: '`' + i.n + '` occupa ' + n + ' byte: il codice' + (Y.conRegistri(i.n) ? ', il byte dei registri' : '') + (Y.conCostante(i.n) ? ', la costante di otto byte' : '') + '. valP = ' + H(pc) + ' + ' + n + ' = ' + H(pc + n) + '.',
        diagnosi: DIAG(giuste, [1, 2, 9, 10].filter((k) => k !== n).map((k) => ({ se: ESA(pc + k, 3), msg: 'Hai contato ' + k + ' byte. `' + i.n + '` ne occupa ' + n + ': un byte di codice' + (Y.conRegistri(i.n) ? ', uno per i registri' : ', nessuno per i registri') + (Y.conCostante(i.n) ? ', otto per la costante.' : ', nessuno per una costante.') })).concat([{ se: ESA(pc, 3), msg: 'Questo è il PC. valP è l’indirizzo dell’istruzione successiva: va sommata la lunghezza.' }])),
        altro: 'Il valore è diverso. Stabilisci la lunghezza di `' + i.n + '` e sommala al PC, in esadecimale.',
        indizi: ['Il codice occupa sempre 1 byte.', (Y.conRegistri(i.n) ? 'Il byte dei registri è presente' : 'Il byte dei registri è assente') + (Y.conCostante(i.n) ? ', e la costante di otto byte è presente.' : ', e la costante è assente.'), H(pc) + ' + ' + n + '.'],
        svolgimento: ['Classe: icode ' + b0[0] + ', `' + i.n + '`.', 'Lunghezza: ' + n + ' byte.', 'valP = ' + H(pc) + ' + ' + n + ' = ' + H(pc + n) + '.'] };
    },
    // 3.3.3 · valE, oppure l'ultima cella letta
    (r) => {
      const rb = r.scegli(['rbx', 'rcx', 'rdx', 'rsi']), ra = r.scegli(['rax', 'rdi']), b = 8 * r.int(4, 60), dd = 8 * r.int(-3, 6), cosa = r.int(0, 1), valE = b + dd, giusto = cosa ? valE + 7 : valE, giuste = I(giusto);
      return { u: '3.3.3', d: 'Si esegue `mrmovq ' + dd + '(%' + rb + '), %' + ra + '` con %' + rb + ' = ' + b + '. ' + (cosa ? 'Qual è l’indirizzo dell’ultima cella letta dalla memoria?' : 'Quanto vale valE?'), segnaposto: 'Un numero', giuste,
        ok: 'valE = valB + valC = ' + b + ' + ' + PA(dd) + ' = ' + valE + '.' + (cosa ? ' La parola occupa otto celle, fino a ' + valE + ' + 7 = ' + (valE + 7) + '.' : ''),
        diagnosi: DIAG(giuste, [
          cosa ? { se: I(valE), msg: 'Questo è valE, l’indirizzo della prima cella. La parola continua nelle sette successive.' } : { se: I(valE + 7), msg: 'Questo è l’indirizzo dell’ultima cella letta. valE è l’indirizzo della prima.' },
          cosa ? { se: I(valE + 8), msg: 'La prima cella è valE stessa, quindi l’ottava è valE + 7.' } : null,
          { se: I(b), msg: 'Questo è valB, la base. Va sommato lo spostamento valC.' },
          dd ? { se: I(b - dd), msg: 'Lo spostamento va sommato con il suo segno: ' + b + ' + ' + PA(dd) + '.' } : null,
          dd ? { se: I(dd), msg: 'Questo è valC, lo spostamento. Va sommato alla base.' } : null
        ]),
        altro: 'Il numero è diverso. Somma base e spostamento' + (cosa ? ', poi aggiungi 7 per arrivare all’ottava cella.' : '.'),
        indizi: ['valB è il contenuto di %' + rb + ': ' + b + '.', 'valC è lo spostamento: ' + N(dd) + '.', cosa ? 'valE = ' + valE + ', e l’ultima cella è valE + 7.' : b + ' + ' + PA(dd) + '.'],
        svolgimento: ['valB = ' + b + ', valC = ' + N(dd) + '.', 'valE = ' + b + ' + ' + PA(dd) + ' = ' + valE + '.', cosa ? 'Ultima cella: ' + valE + ' + 7 = ' + (valE + 7) + '.' : 'valE = ' + valE + '.'] };
    },
    // 3.3.4 · il codice di stato
    (r) => {
      const M = r.scegli([64, 128, 256]), tipo = r.scegli(['mem', 'mem', 'mem', 'halt', 'ris']), op = r.scegli(['mrmovq 0(%rbx), %rax', 'rmmovq %rax, 0(%rbx)']), a = M - r.int(5, 12) + r.int(0, 8), bris = r.scegli(['C0', 'D0', 'E0', 'F0']);
      const stat = tipo === 'ris' ? 'INS' : tipo === 'halt' ? 'HLT' : a + 7 > M - 1 ? 'ADR' : 'AOK';
      const FB = { AOK: tipo === 'mem' ? 'L’accesso userebbe le celle da ' + a + ' a ' + (a + 7) + ', e la memoria arriva alla cella ' + (M - 1) + '.' : 'AOK accompagna le istruzioni dopo le quali si prosegue.', HLT: tipo === 'halt' ? '`halt` è un’istruzione valida, che chiede l’arresto.' : 'HLT segnala l’esecuzione di `halt`, che qui non compare.', ADR: tipo === 'mem' ? 'L’accesso userebbe le celle da ' + a + ' a ' + (a + 7) + ', e la memoria arriva alla cella ' + (M - 1) + '.' : 'Questa istruzione non accede alla memoria dei dati, quindi nessun indirizzo può risultare invalido.', INS: tipo === 'ris' ? 'Le classi valide hanno icode da 0 a B, e l’icode ' + bris[0] + ' resta fuori.' : 'L’istruzione appartiene a una classe esistente, quindi è valida.' };
      return { u: '3.3.4', d: 'La memoria dei dati ha ' + M + ' celle, numerate da 0 a ' + (M - 1) + '. ' + (tipo === 'mem' ? 'Si esegue `' + op + '` con %rbx = ' + a + '.' : tipo === 'halt' ? 'Si esegue `halt`.' : 'Il primo byte dell’istruzione vale ' + bris + '.') + ' Quale codice di stato ne risulta?', guida: 'Scegli la risposta.',
        o: ['AOK', 'HLT', 'ADR', 'INS'].map((k) => (k === stat ? { t: k, ok: true, fb: FB[k] } : { t: k, fb: FB[k] })) };
    },
    // 3.3.5 · una call: valore salvato, cella, %rsp, PC dopo il ret
    (r) => {
      const pc = 0x100 + 4 * r.int(0, 200), t = 0x600 + 16 * r.int(0, 60), sp = 0x1000 + 0x100 * r.int(0, 14) + 8 * r.int(0, 31), cosa = r.int(0, 3), valP = pc + 9, giu = sp - 8;
      const D = ['Quale valore viene scritto in memoria?', 'A quale indirizzo viene scritto l’indirizzo di ritorno?', 'Quanto vale %rsp dopo la `call`?', 'La procedura esegue subito `ret`. Quanto vale il PC dopo il `ret`?'][cosa];
      const giusto = [valP, giu, giu, valP][cosa], giuste = ESA(giusto, 4);
      return { u: '3.3.5', d: 'Una `call ' + H(t) + '` comincia all’indirizzo ' + H(pc) + ', con %rsp = ' + H(sp) + '. ' + D + ' Rispondi in esadecimale.', segnaposto: 'Per esempio ' + H(giusto + 16), giuste,
        ok: 'La `call` calcola valP = ' + H(pc) + ' + 9 = ' + H(valP) + ' e valE = ' + H(sp) + ' − 8 = ' + H(giu) + '. Scrive valP in M8[valE], mette valE in %rsp e ' + H(t) + ' nel PC.' + (cosa === 3 ? ' Il `ret` rilegge valP dalla pila e lo mette nel PC.' : ''),
        diagnosi: DIAG(giuste, [
          { se: ESA(pc, 4), msg: 'Questo è l’indirizzo della `call`. L’indirizzo di ritorno è quello dell’istruzione successiva, valP.' },
          { se: ESA(t, 4), msg: cosa === 3 ? 'Questa è la destinazione della `call`. Il `ret` porta il PC all’indirizzo di ritorno.' : 'Questa è la destinazione, che finisce nel PC.' },
          { se: ESA(sp, 4), msg: cosa === 0 ? 'Questo è il vecchio %rsp. In memoria va l’indirizzo di ritorno.' : 'Questa è la vecchia cima. La `call` riserva una cella nuova, otto byte più in basso.' },
          { se: ESA(cosa === 0 || cosa === 3 ? giu : valP, 4), msg: cosa === 0 || cosa === 3 ? 'Questo è l’indirizzo della cella sulla pila. La domanda riguarda il valore dell’indirizzo di ritorno.' : 'Questo è l’indirizzo di ritorno, cioè il valore scritto. La domanda riguarda la pila.' },
          { se: ESA(pc + 10, 4), msg: 'Una `call` occupa 9 byte: uno di codice e otto di destinazione.' },
          { se: ESA(sp + 8, 4), msg: 'La pila cresce verso gli indirizzi bassi: la `call` toglie 8 a %rsp.' }
        ]),
        altro: 'Il valore è diverso. Calcola valP = PC + 9 e valE = %rsp − 8, poi stabilisci quale dei due risponde alla domanda.',
        indizi: ['valP = ' + H(pc) + ' + 9.', 'valE = ' + H(sp) + ' − 8.', ['In memoria va valP.', 'La cella scritta è M8[valE].', '%rsp riceve valE.', 'Il `ret` mette nel PC il valore letto dalla pila, che è valP.'][cosa]],
        svolgimento: ['valP = ' + H(pc) + ' + 9 = ' + H(valP) + '.', 'valE = ' + H(sp) + ' − 8 = ' + H(giu) + '.', ['Valore scritto: ' + H(valP) + '.', 'Cella scritta: ' + H(giu) + '.', '%rsp = ' + H(giu) + '.', 'PC dopo il `ret`: ' + H(valP) + '.'][cosa]] };
    },
    // 3.3.6 · l'indirizzo di un'etichetta, oppure i byte di un salto
    (r) => {
      if (r.int(0, 2) > 0) {
        const pc = 0x40 + 0x10 * r.int(0, 40), extra = r.scegli([[], ['rrmovq'], ['addq'], ['rrmovq', 'addq'], ['irmovq']]), n = r.int(0, 5), NUM = ['', 'una', 'due', 'tre', 'quattro', 'cinque'];
        const prima = ['irmovq'].concat(extra, ['jmp']), byte = prima.reduce((s, x) => s + Y.lung(x), 0) + n, fine = pc + byte, giuste = ESA(fine, 3);
        const elenco = prima.map((x) => 'una `' + x + (x === 'jmp' ? ' fine`' : '`')).concat(n ? [NUM[n] + ' `nop`'] : []).join(', ');
        return { u: '3.3.6', d: 'Un programma comincia all’indirizzo ' + H(pc) + ' e contiene, nell’ordine: ' + elenco + ' e, all’etichetta `fine`, una `halt`. Quale indirizzo riceve `fine`? Rispondi in esadecimale.', segnaposto: 'Per esempio ' + H(pc + 16), giuste,
          ok: 'Prima di `fine` stanno ' + prima.map((x) => Y.lung(x)).concat(n ? [n] : []).join(' + ') + ' = ' + byte + ' byte: ' + H(pc) + ' + ' + byte + ' = ' + H(fine) + '.',
          diagnosi: DIAG(giuste, [
            { se: ESA(fine + 1, 3), msg: 'La `halt` sta all’etichetta stessa, quindi il suo byte resta fuori dal conto.' },
            n ? { se: ESA(fine - n, 3), msg: 'Fra la `jmp` e l’etichetta ci sono ' + n + ' `nop`, da un byte ciascuna.' } : null,
            { se: ESA(pc + parseInt(String(byte), 16), 3), msg: 'I byte prima dell’etichetta sono ' + byte + ' in decimale. Convertili in esadecimale prima di sommarli a ' + H(pc) + '.' },
            { se: ESA(fine - 9, 3), msg: 'Anche la `jmp` occupa spazio, 9 byte, e sta prima dell’etichetta.' }
          ]),
          altro: 'L’indirizzo è diverso. Somma le lunghezze delle istruzioni che precedono l’etichetta, e aggiungi il totale a ' + H(pc) + ' in esadecimale.',
          indizi: ['Lunghezze: `irmovq` 10, `rrmovq` e `addq` 2, `jmp` 9, `nop` 1.', 'Byte prima dell’etichetta: ' + byte + '.', byte + ' in esadecimale è ' + H(byte) + '.'],
          svolgimento: ['Byte prima di `fine`: ' + prima.map((x) => Y.lung(x)).concat(n ? [n] : []).join(' + ') + ' = ' + byte + '.', byte + ' = ' + H(byte) + '.', 'fine = ' + H(pc) + ' + ' + H(byte) + ' = ' + H(fine) + '.'] };
      }
      const dest = 0x100 + r.int(1, 0xEFF), j = r.scegli(['jmp', 'jne', 'je', 'jl', 'jle', 'jge', 'jg']), b = Y.byteIst({ n: j, c: dest }).slice(0, 3).map(Y.esa2), giuste = [b.join('').toLowerCase()];
      return { u: '3.3.6', d: 'Quali sono i primi tre byte della codifica di `' + j + ' ' + H(dest) + '`? Il codice di `' + j + '` è ' + b[0] + '. Scrivili in esadecimale, nell’ordine in cui stanno in memoria.', segnaposto: 'Per esempio 70 00 00', giuste,
        ok: 'Dopo il codice ' + b[0] + ' viene la destinazione in little-endian: prima ' + b[1] + ', poi ' + b[2] + '.',
        diagnosi: DIAG(giuste, [
          { se: [(b[0] + b[2] + b[1]).toLowerCase()], msg: 'La costante è in little-endian: viene per primo il byte meno significativo, ' + b[1] + '.' },
          { se: [(b[0] + b[1] + '00').toLowerCase()], msg: 'Il secondo byte della costante è la parte alta di ' + H(dest) + ', cioè ' + b[2] + '.' },
          { se: [(b[1] + b[2] + b[0]).toLowerCase()], msg: 'Il primo byte dell’istruzione è il codice, ' + b[0] + '. La destinazione viene dopo.' }
        ]),
        altro: 'I byte sono diversi. Scrivi il codice, poi la destinazione a partire dal byte meno significativo.',
        indizi: ['Il primo byte è il codice, ' + b[0] + '.', H(dest) + ' si divide nei byte ' + b[2] + ' e ' + b[1] + ', dal più significativo.', 'In memoria la costante compare rovesciata: ' + b[1] + ', ' + b[2] + ', poi zeri.'],
        svolgimento: ['Codice: ' + b[0] + '.', 'Costante ' + H(dest) + ' in little-endian: ' + b[1] + ' ' + b[2] + ' 00 00 00 00 00 00.', 'Primi tre byte: ' + b.join(' ') + '.'] };
    }
  ] });
})();
