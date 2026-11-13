'use strict';
/* Prova del capitolo 3.4: una domanda per unità. */
(() => {
  const I = SL.scritture.intero, ESA = SL.scritture.esa, H = SL.y86.esa, N = SL.x86.num;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const PS = (v) => I(v).concat(I(v).map((x) => x + 'ps'));
  const PA = (v) => (v < 0 ? '(' + N(v) + ')' : String(v));

  SL.registraProva('3.4', { domande: [
    // 3.4.1 · un registro prima e dopo il fronte
    (r) => {
      const reg = r.mescola(['rax', 'rbx', 'rcx', 'rdx']), s = reg[0], d = reg[1], a = r.int(1, 15), b0 = r.int(1, 20), b = b0 === a ? b0 + 1 : b0, op = r.scegli(['addq', 'subq']), quando = r.scegli(['prima', 'dopo', 'dopo']);
      const nuovo = op === 'addq' ? b + a : b - a, giusto = quando === 'dopo' ? nuovo : b, giuste = I(giusto);
      return { u: '3.4.1', d: 'SEQ esegue `' + op + ' %' + s + ', %' + d + '` con %' + s + ' = ' + a + ' e %' + d + ' = ' + b + '. Quanto vale %' + d + ' subito ' + quando + ' il fronte che chiude il ciclo?', segnaposto: 'Un numero', giuste,
        ok: quando === 'prima' ? 'Prima del fronte il registro conserva il vecchio contenuto. Il risultato ' + N(nuovo) + ' è ancora valE, un valore sui fili.' : 'valE = ' + b + (op === 'addq' ? ' + ' : ' − ') + a + ' = ' + N(nuovo) + ', e al fronte il registro lo cattura.',
        diagnosi: DIAG(giuste, [
          { se: I(quando === 'dopo' ? b : nuovo), msg: quando === 'dopo' ? 'Questo è il contenuto prima del fronte. Dopo il fronte il registro contiene valE.' : 'Questo è valE, che il registro cattura soltanto al fronte. Prima, contiene il vecchio valore.' },
          op === 'subq' ? { se: I(a - b), msg: 'Hai calcolato sorgente meno destinazione. `subq` toglie la sorgente dalla destinazione.' } : null,
          { se: I(op === 'addq' ? b - a : b + a), msg: 'L’istruzione è `' + op + '`: controlla l’operazione.' },
          { se: I(a), msg: 'Questo è il valore della sorgente, che resta intatta.' }
        ]),
        altro: 'Il numero è diverso. Calcola valE, tenendo conto che il registro lo riceve soltanto al fronte.',
        indizi: ['valA = ' + a + ', valB = ' + b + '.', 'valE = valB ' + (op === 'addq' ? '+' : '−') + ' valA = ' + N(nuovo) + '.', quando === 'prima' ? 'Prima del fronte il registro contiene ancora valB.' : 'Dopo il fronte il registro contiene valE.'],
        svolgimento: ['valA = ' + a + ', valB = ' + b + '.', 'valE = ' + b + (op === 'addq' ? ' + ' : ' − ') + a + ' = ' + N(nuovo) + '.', 'Subito ' + quando + ' il fronte: %' + d + ' = ' + N(giusto) + '.'] };
    },
    // 3.4.2 · gli ingressi dell'ALU, oppure la cella scritta da pushq
    (r) => {
      if (r.int(0, 2) > 0) {
        const CASI = [['addq %rax, %rbx', 0], ['xorq %rcx, %rdx', 0], ['mrmovq 16(%rbx), %rax', 1], ['rmmovq %rax, 8(%rcx)', 1], ['pushq %rdx', 2], ['call 0x200', 2], ['popq %rax', 3], ['ret', 3], ['irmovq $5, %rax', 4], ['rrmovq %rax, %rbx', 5]];
        const OPZ = ['aluA = valA e aluB = valB', 'aluA = valC e aluB = valB', 'aluA = −8 e aluB = valB', 'aluA = +8 e aluB = valB', 'aluA = valC e aluB = 0', 'aluA = valA e aluB = 0'];
        const PERCHE = ['L’operazione lavora su due registri.', 'L’ALU somma la base e lo spostamento scritto nell’istruzione.', 'L’ALU toglie 8 alla cima della pila, per riservare una cella.', 'L’ALU aggiunge 8 alla cima della pila, per restituire una cella.', 'La costante attraversa l’ALU sommata a zero.', 'Il registro sorgente attraversa l’ALU sommato a zero.'];
        const c = r.scegli(CASI), altre = r.mescola([0, 1, 2, 3, 4, 5].filter((k) => k !== c[1])).slice(0, 3);
        return { u: '3.4.2', d: 'SEQ esegue `' + c[0] + '`. Che cosa arriva ai due ingressi dell’ALU?', guida: 'Scegli la risposta.', o: [{ t: OPZ[c[1]], ok: true, fb: PERCHE[c[1]] }].concat(altre.map((k) => ({ t: OPZ[k], fb: 'Questa è la scelta di un’altra classe di istruzioni. ' + PERCHE[k] }))) };
      }
      const sp = 0x100 + 8 * r.int(1, 200), v = r.int(2, 250), cosa = r.int(0, 1), giusto = sp - 8, giuste = ESA(giusto, 3);
      return { u: '3.4.2', d: 'SEQ esegue `pushq %rax` con %rsp = ' + H(sp) + ' e %rax = ' + H(v) + '. ' + (cosa ? 'Quanto vale %rsp dopo il fronte?' : 'A quale indirizzo viene scritto il valore ' + H(v) + '?') + ' Rispondi in esadecimale.', segnaposto: 'Per esempio ' + H(sp + 16), giuste,
        ok: 'valE = ' + H(sp) + ' − 8 = ' + H(giusto) + '. È l’indirizzo della scrittura e anche il nuovo valore di %rsp.',
        diagnosi: DIAG(giuste, [
          { se: ESA(sp, 3), msg: 'Questa è la vecchia cima. `pushq` riserva una cella nuova, otto byte più in basso.' },
          { se: ESA(sp + 8, 3), msg: 'La pila cresce verso gli indirizzi bassi: aluA vale −8.' },
          { se: ESA(v, 3), msg: 'Questo è il dato. La domanda riguarda la cima della pila.' },
          { se: ESA(sp - 1, 3), msg: 'Una parola occupa 8 byte, quindi la cima si sposta di 8.' }
        ]),
        altro: 'Il valore è diverso. Togli 8 al vecchio %rsp, in esadecimale.',
        indizi: ['aluB = valB = ' + H(sp) + '.', 'aluA = −8.', H(sp) + ' − 8.'],
        svolgimento: ['valB = ' + H(sp) + '.', 'valE = ' + H(sp) + ' − 8 = ' + H(giusto) + '.', 'M8[' + H(giusto) + '] = ' + H(v) + ', e %rsp = ' + H(giusto) + '.'] };
    },
    // 3.4.3 · il periodo minimo
    (r) => {
      const f = 5 * r.int(14, 24), g = 5 * r.int(5, 9), al = 5 * r.int(8, 14), m = 5 * r.int(4, 26), se = 5 * r.int(3, 20), mg = 5 * r.int(2, 5), com = f + g + al, A = com + se, L = com + m, lim = Math.max(A, L), giuste = PS(lim + mg);
      return { u: '3.4.3', d: 'In un processore a ciclo singolo il prelievo richiede ' + f + ' ps, la lettura dei registri ' + g + ' ps e l’ALU ' + al + ' ps. Poi un’operazione aritmetica attraversa un selettore da ' + se + ' ps, mentre un carico interroga la memoria dei dati, che richiede ' + m + ' ps. I registri chiedono un margine di ' + mg + ' ps. Qual è il periodo minimo, in picosecondi?', segnaposto: 'Un numero di picosecondi', giuste,
        ok: 'Il percorso aritmetico dura ' + A + ' ps e quello del carico ' + L + ' ps. Il più lungo, con il margine, dà ' + lim + ' + ' + mg + ' = ' + (lim + mg) + ' ps.',
        diagnosi: DIAG(giuste, [
          { se: I(lim), msg: 'Questo è il percorso più lungo. Manca il margine di ' + mg + ' ps chiesto dai registri.' },
          { se: I(Math.min(A, L) + mg), msg: 'Hai usato il percorso più breve. Il periodo deve bastare all’istruzione più lenta.' },
          { se: I(com + se + m + mg), msg: 'Selettore e memoria appartengono a istruzioni diverse: i due percorsi sono alternative, e conta il più lungo.' },
          { se: I(com + mg), msg: 'Dopo l’ALU ogni istruzione attraversa ancora un blocco: il selettore oppure la memoria.' }
        ]),
        altro: 'Il numero è diverso. Calcola i due percorsi, prendi il più lungo e aggiungi il margine.',
        indizi: ['Tratto comune: ' + f + ' + ' + g + ' + ' + al + ' = ' + com + ' ps.', 'Aritmetica: ' + com + ' + ' + se + ' = ' + A + '. Carico: ' + com + ' + ' + m + ' = ' + L + '.', 'Il maggiore dei due, più ' + mg + '.'],
        svolgimento: ['Percorso aritmetico: ' + com + ' + ' + se + ' = ' + A + ' ps.', 'Percorso del carico: ' + com + ' + ' + m + ' = ' + L + ' ps.', 'Periodo minimo: ' + lim + ' + ' + mg + ' = ' + (lim + mg) + ' ps.'] };
    },
    // 3.4.4 · indirizzo e direzione dell'accesso, oppure %rsp dopo popq
    (r) => {
      if (r.int(0, 2) > 0) {
        const CASI = [['pushq %rax', 0], ['call 0x300', 0], ['rmmovq %rax, 8(%rbx)', 0], ['mrmovq 8(%rbx), %rax', 1], ['popq %rax', 2], ['ret', 2]];
        const OPZ = ['mem_addr = valE, e la memoria scrive', 'mem_addr = valE, e la memoria legge', 'mem_addr = valA, e la memoria legge', 'mem_addr = valA, e la memoria scrive'];
        const c = r.scegli(CASI), nome = c[0].split(' ')[0];
        const fb = (k) => (k === c[1] ? (c[1] === 0 ? '`' + nome + '` scrive una parola all’indirizzo calcolato dall’ALU.' : c[1] === 1 ? '`mrmovq` legge la parola che comincia all’indirizzo calcolato dall’ALU.' : '`' + nome + '` legge la parola alla cima attuale della pila, cioè al vecchio %rsp.') : (k < 2) !== (c[1] < 2) ? (c[1] < 2 ? 'Per `' + nome + '` l’indirizzo è quello calcolato dall’ALU, valE.' : 'Per `' + nome + '` l’indirizzo è la cima attuale, valA. valE è già la cima successiva.') : 'L’indirizzo è giusto, ma `' + nome + '` ' + (c[1] === 0 ? 'scrive in memoria.' : 'legge dalla memoria.'));
        return { u: '3.4.4', d: 'SEQ esegue `' + c[0] + '`. Quale indirizzo riceve la memoria dei dati, e in quale direzione avviene il trasferimento?', guida: 'Scegli la risposta.', o: OPZ.map((t, k) => (k === c[1] ? { t, ok: true, fb: fb(k) } : { t, fb: fb(k) })) };
      }
      const sp = 0x100 + 8 * r.int(1, 200), op = r.scegli(['popq', 'pushq']), giusto = op === 'popq' ? sp + 8 : sp - 8, giuste = ESA(giusto, 3);
      return { u: '3.4.4', d: 'SEQ esegue `' + op + ' %rbx` con %rsp = ' + H(sp) + '. Quanto vale %rsp dopo il fronte? Rispondi in esadecimale.', segnaposto: 'Per esempio ' + H(sp + 32), giuste,
        ok: op === 'popq' ? '`popq` restituisce una cella: valE = ' + H(sp) + ' + 8 = ' + H(giusto) + '.' : '`pushq` riserva una cella: valE = ' + H(sp) + ' − 8 = ' + H(giusto) + '.',
        diagnosi: DIAG(giuste, [
          { se: ESA(op === 'popq' ? sp - 8 : sp + 8, 3), msg: op === 'popq' ? 'Togliere 8 riserva una cella, come fa `pushq`. `popq` ne restituisce una.' : 'Aggiungere 8 restituisce una cella, come fa `popq`. `pushq` ne riserva una.' },
          { se: ESA(sp, 3), msg: 'Questo è il vecchio %rsp. Entrambe le istruzioni della pila lo modificano.' },
          { se: ESA(op === 'popq' ? sp + 1 : sp - 1, 3), msg: 'Una parola occupa 8 byte, quindi il puntatore si sposta di 8.' }
        ]),
        altro: 'Il valore è diverso. ' + (op === 'popq' ? 'Aggiungi 8' : 'Togli 8') + ' al vecchio %rsp, in esadecimale.',
        indizi: ['aluB = valB = ' + H(sp) + '.', 'Per `' + op + '`, aluA = ' + (op === 'popq' ? '+8' : '−8') + '.', H(sp) + (op === 'popq' ? ' + 8.' : ' − 8.')],
        svolgimento: ['valB = ' + H(sp) + '.', 'valE = ' + H(sp) + (op === 'popq' ? ' + 8 = ' : ' − 8 = ') + H(giusto) + '.', 'Al fronte: %rsp = ' + H(giusto) + '.'] };
    },
    // 3.4.5 · i tempi di SEQ e della macchina multiciclo
    (r) => {
      const a = r.int(2, 12), l = r.int(1, 8), t = 5 * r.int(9, 18), per = r.scegli([200, 240, 300]), n = a + l, cm = 3 * a + 5 * l, ts = per * n, tm = cm * t, cosa = r.int(0, 2);
      const base = 'Un programma contiene ' + a + ' operazioni aritmetiche e ' + l + (l === 1 ? ' carico' : ' carichi') + '. SEQ usa un ciclo da ' + per + ' ps per istruzione. Una macchina multiciclo usa 3 cicli per un’operazione e 5 per un carico, con un periodo di ' + t + ' ps. ';
      if (cosa === 2) {
        const esito = ts < tm ? 0 : tm < ts ? 1 : 2, perche = 'SEQ impiega ' + n + ' × ' + per + ' = ' + ts + ' ps. La macchina multiciclo impiega ' + cm + ' × ' + t + ' = ' + tm + ' ps.';
        return { u: '3.4.5', d: base + 'Quale macchina finisce prima?', guida: 'Scegli la risposta.', o: ['SEQ', 'La macchina multiciclo', 'Finiscono insieme'].map((x, k) => (k === esito ? { t: x, ok: true, fb: perche } : { t: x, fb: perche })) };
      }
      const giusto = cosa ? tm : ts, giuste = PS(giusto);
      return { u: '3.4.5', d: base + (cosa ? 'Quanto dura il programma sulla macchina multiciclo, in picosecondi?' : 'Quanto dura il programma su SEQ, in picosecondi?'), segnaposto: 'Un numero di picosecondi', giuste,
        ok: cosa ? 'I cicli sono 3 × ' + a + ' + 5 × ' + l + ' = ' + cm + ', e ' + cm + ' × ' + t + ' = ' + tm + ' ps.' : 'SEQ usa un ciclo per istruzione: ' + n + ' × ' + per + ' = ' + ts + ' ps.',
        diagnosi: DIAG(giuste, [
          { se: I(cosa ? ts : tm), msg: cosa ? 'Questo è il tempo di SEQ. La domanda riguarda la macchina multiciclo.' : 'Questo è il tempo della macchina multiciclo. La domanda riguarda SEQ.' },
          { se: I(cosa ? n * t : cm * per), msg: cosa ? 'Hai contato un ciclo per istruzione. Nella macchina multiciclo un’operazione ne usa 3 e un carico 5.' : 'Hai usato i cicli della macchina multiciclo. SEQ usa un ciclo per istruzione.' },
          { se: I(cosa ? cm : n), msg: 'Questo è il numero dei cicli. Va moltiplicato per il periodo.' }
        ]),
        altro: 'Il numero è diverso. Conta i cicli della macchina indicata e moltiplicali per il suo periodo.',
        indizi: cosa ? ['Operazioni: 3 × ' + a + ' = ' + 3 * a + ' cicli.', 'Carichi: 5 × ' + l + ' = ' + 5 * l + ' cicli.', cm + ' × ' + t + '.'] : ['Le istruzioni sono ' + a + ' + ' + l + ' = ' + n + '.', 'Ogni ciclo dura ' + per + ' ps.', n + ' × ' + per + '.'],
        svolgimento: cosa ? ['Cicli: ' + 3 * a + ' + ' + 5 * l + ' = ' + cm + '.', 'Periodo: ' + t + ' ps.', 'Tempo: ' + cm + ' × ' + t + ' = ' + tm + ' ps.'] : ['Cicli: ' + n + '.', 'Periodo: ' + per + ' ps.', 'Tempo: ' + n + ' × ' + per + ' = ' + ts + ' ps.'] };
    }
  ] });
})();
