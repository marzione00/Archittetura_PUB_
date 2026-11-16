'use strict';
/* Prova del capitolo 3.4: una domanda per unità, sulla CPU a ciclo singolo del caso di studio. */
(() => {
  const I = SL.scritture.intero, ESA = SL.scritture.esa, C = SL.isa, H = C.esa, N = C.num;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const PS = (v) => I(v).concat(I(v).map((x) => x + 'ps'));

  SL.registraProva('3.4', { domande: [
    // 3.4.1 · un registro prima e dopo il fronte
    (r) => {
      const reg = r.mescola(['rax', 'rbx', 'rcx', 'rdx']), d = reg[0], s = reg[1], a = r.int(1, 15), b0 = r.int(1, 20), b = b0 === a ? b0 + 1 : b0, op = r.scegli(['add', 'sub']), quando = r.scegli(['prima', 'dopo', 'dopo']), qf = quando === 'prima' ? 'prima del fronte' : 'dopo il fronte';
      const nuovo = op === 'add' ? b + a : b - a, giusto = quando === 'dopo' ? nuovo : b, giuste = I(giusto), D = d.toUpperCase(), S = s.toUpperCase();
      return { u: '3.4.1', d: 'La CPU a ciclo singolo esegue `' + op + ' ' + d + ', ' + s + '` con ' + D + ' = ' + b + ' e ' + S + ' = ' + a + '. Quanto vale ' + D + ' immediatamente ' + qf + ' che chiude il ciclo?', segnaposto: 'Un numero', giuste,
        ok: quando === 'prima' ? 'Prima del fronte il registro conserva il contenuto precedente. Il risultato ' + N(nuovo) + ' è ancora valE, un valore sui fili.' : 'valE = ' + b + (op === 'add' ? ' + ' : ' − ') + a + ' = ' + N(nuovo) + ', e al fronte ' + D + ' lo cattura.',
        diagnosi: DIAG(giuste, [
          { se: I(quando === 'prima' ? nuovo : b), msg: quando === 'prima' ? 'Questo è valE, presente sui fili. Il registro lo cattura soltanto al fronte.' : 'Questo è il contenuto prima del fronte. Dopo il fronte il registro contiene valE.' },
          op === 'sub' ? { se: I(a - b), msg: 'È stata calcolata la differenza fra il secondo operando e il primo. `sub` sottrae il secondo operando dal primo.' } : null,
          { se: I(op === 'add' ? b - a : b + a), msg: 'L’istruzione è `' + op + '`: va verificata l’operazione.' },
          { se: I(a), msg: 'Questo è il secondo operando, ' + S + ', che resta invariato.' }
        ]),
        altro: 'Il numero è diverso. Si calcoli valE, poi si stabilisca se nell’istante indicato il registro lo ha già catturato.',
        indizi: ['valA = ' + b + ', valB = ' + a + '.', 'valE = valA ' + (op === 'add' ? '+' : '−') + ' valB = ' + N(nuovo) + '.', quando === 'prima' ? 'Prima del fronte il registro contiene ancora valA.' : 'Dopo il fronte il registro contiene valE.'],
        svolgimento: ['valA = ' + b + ', valB = ' + a + '.', 'valE = ' + b + (op === 'add' ? ' + ' : ' − ') + a + ' = ' + N(nuovo) + '.', 'Immediatamente ' + qf + ': ' + D + ' = ' + N(giusto) + '.'] };
    },
    // 3.4.2 · gli ingressi dell'ALU, oppure l'indirizzo di una scrittura in memoria
    (r) => {
      if (r.int(0, 1)) {
        const CASI = [['add rax, rbx', 0], ['or rcx, rdx', 0], ['mov rax, 16(rbx)', 1], ['mov 8(rcx), rax', 1], ['mov rax, 5', 2], ['mov rbx, 291', 2], ['mov rax, rbx', 3], ['mov rcx, rdx', 3]];
        const c = r.scegli(CASI), OPZ = ['ALU A = valA e ALU B = valB', 'ALU A = valC e ALU B = valB', 'ALU A = valC e ALU B = 0', 'ALU A = 0 e ALU B = valB'];
        const PERCHE = ['Le istruzioni aritmetiche e logiche combinano i due registri letti.', 'Negli accessi alla memoria l’ALU somma lo spostamento valC e la base valB.', 'La costante transita nell’ALU, che le somma zero.', 'Il valore del registro rB transita nell’ALU, che gli somma zero.'];
        const altre = [0, 1, 2, 3].filter((k) => k !== c[1]);
        return { u: '3.4.2', d: 'La CPU a ciclo singolo esegue `' + c[0] + '`. Quali valori selezionano ALU A e ALU B?', guida: 'Si scelga la risposta.', o: [{ t: OPZ[c[1]], ok: true, fb: PERCHE[c[1]] }].concat(altre.map((k) => ({ t: OPZ[k], fb: 'Questa scelta vale per altre istruzioni. ' + PERCHE[c[1]] }))) };
      }
      const b = 0x100 + 8 * r.int(1, 200), dd = 8 * r.int(0, 8), v = r.int(1, 255), rb = r.scegli(['rbx', 'rcx', 'rbp']), giusto = b + dd, giuste = ESA(giusto, 3), RB = rb.toUpperCase();
      return { u: '3.4.2', d: 'La CPU a ciclo singolo esegue `mov ' + dd + '(' + rb + '), rax` con ' + RB + ' = ' + H(b) + ' e RAX = ' + H(v) + '. A quale indirizzo è scritto il valore ' + H(v) + '? Si risponda in esadecimale.', segnaposto: 'Per esempio ' + H(b + 32), giuste,
        ok: 'valE = valB + valC = ' + H(b) + ' + ' + dd + ' = ' + H(giusto) + '. È il segnale Mem addr, e valA = ' + H(v) + ' raggiunge Mem data.',
        diagnosi: DIAG(giuste, [
          dd ? { se: ESA(b, 3), msg: 'Questa è la base. Va sommato lo spostamento, ' + dd + '.' } : null,
          dd ? { se: ESA(b + parseInt(String(dd), 16), 3), msg: 'Lo spostamento ' + dd + ' è decimale: in esadecimale vale ' + H(dd) + '.' } : null,
          { se: ESA(v, 3), msg: 'Questo è il dato. La domanda riguarda l’indirizzo della parola in cui è scritto.' },
          { se: ESA(b + dd + v, 3), msg: 'Il dato resta escluso dall’ALU, che calcola soltanto l’indirizzo, base più spostamento.' }
        ]),
        altro: 'Il valore è diverso. Si sommino la base e lo spostamento, in esadecimale.',
        indizi: ['ALU B = valB = ' + H(b) + '.', 'ALU A = valC = ' + dd + ' = ' + H(dd) + '.', H(b) + ' + ' + H(dd) + '.'],
        svolgimento: ['valB = ' + H(b) + ', valC = ' + dd + '.', 'valE = ' + H(b) + ' + ' + H(dd) + ' = ' + H(giusto) + '.', 'M8[' + H(giusto) + '] = ' + H(v) + '.'] };
    },
    // 3.4.3 · il periodo minimo
    (r) => {
      const f = 5 * r.int(14, 24), g = 5 * r.int(5, 9), al = 5 * r.int(8, 14), m = 5 * r.int(4, 26), se = 5 * r.int(3, 20), mg = 5 * r.int(2, 5), com = f + g + al, A = com + se, L = com + m, lim = Math.max(A, L), giuste = PS(lim + mg);
      return { u: '3.4.3', d: 'In una CPU a ciclo singolo il prelievo richiede ' + f + ' ps, la lettura dei registri ' + g + ' ps e l’ALU ' + al + ' ps. Un’operazione aritmetica attraversa poi un selettore da ' + se + ' ps, mentre un carico interroga la memoria dei dati, che richiede ' + m + ' ps. I registri richiedono un margine di ' + mg + ' ps. Qual è il periodo minimo, in picosecondi?', segnaposto: 'Un numero di picosecondi', giuste,
        ok: 'Il percorso aritmetico dura ' + A + ' ps e quello del carico ' + L + ' ps. Il più lungo, con il margine, dà ' + lim + ' + ' + mg + ' = ' + (lim + mg) + ' ps.',
        diagnosi: DIAG(giuste, [
          { se: I(lim), msg: 'Questo è il percorso più lungo. Manca il margine di ' + mg + ' ps richiesto dai registri.' },
          { se: I(Math.min(A, L) + mg), msg: 'È stato impiegato il percorso più breve. Il periodo deve essere sufficiente per l’istruzione più lenta.' },
          { se: I(com + se + m + mg), msg: 'Selettore e memoria appartengono a istruzioni diverse: i due percorsi sono alternativi, ed è determinante il più lungo.' },
          { se: I(com + mg), msg: 'Dopo l’ALU ogni istruzione attraversa ancora un blocco: il selettore oppure la memoria.' }
        ]),
        altro: 'Il numero è diverso. Si calcolino i due percorsi, si prenda il più lungo e si aggiunga il margine.',
        indizi: ['Tratto comune: ' + f + ' + ' + g + ' + ' + al + ' = ' + com + ' ps.', 'Aritmetica: ' + com + ' + ' + se + ' = ' + A + '. Carico: ' + com + ' + ' + m + ' = ' + L + '.', 'Il maggiore dei due, più ' + mg + '.'],
        svolgimento: ['Percorso aritmetico: ' + com + ' + ' + se + ' = ' + A + ' ps.', 'Percorso del carico: ' + com + ' + ' + m + ' = ' + L + ' ps.', 'Periodo minimo: ' + lim + ' + ' + mg + ' = ' + (lim + mg) + ' ps.'] };
    },
    // 3.4.4 · la direzione dell'accesso, oppure i registri scritti
    (r) => {
      if (r.int(0, 1)) {
        const CASI = [['mov 8(rbx), rax', 0], ['mov 0(rbp), rcx', 0], ['mov rax, 8(rbx)', 1], ['mov rcx, 16(rbp)', 1], ['add rax, rbx', 2], ['mov rax, 291', 2], ['je 0x200', 2]];
        const c = r.scegli(CASI), OPZ = ['Mem write = 1: la memoria scrive all’indirizzo valE', 'Mem read = 1: la memoria legge all’indirizzo valE', 'Mem read = Mem write = 0: nessun accesso'];
        const fb = (k) => (k === c[1] ? (c[1] === 0 ? '`mov D(rB), rA` scrive valA nella parola all’indirizzo calcolato dall’ALU.' : c[1] === 1 ? '`mov rA, D(rB)` legge la parola all’indirizzo calcolato dall’ALU.' : 'Questa istruzione non accede alla memoria dei dati.') : (c[1] === 2 ? 'Questa istruzione lascia inattiva la memoria dei dati, e le due abilitazioni valgono 0.' : c[1] === 0 ? 'La forma `mov D(rB), rA` porta un dato da un registro alla memoria: è una scrittura.' : 'La forma `mov rA, D(rB)` porta un dato dalla memoria a un registro: è una lettura.'));
        return { u: '3.4.4', d: 'La CPU a ciclo singolo esegue `' + c[0] + '`. Quale operazione compie la memoria dei dati?', guida: 'Si scelga la risposta.', o: OPZ.map((tx, k) => (k === c[1] ? { t: tx, ok: true, fb: fb(k) } : { t: tx, fb: fb(k) })) };
      }
      const CASI = [['mov rax, 8(rbx)', 'F', 'RAX'], ['mov 8(rbx), rax', 'F', 'F'], ['add rcx, rdx', 'RCX', 'F'], ['mov rdx, 77', 'RDX', 'F'], ['mov rsi, rdi', 'RSI', 'F']];
      const c = r.scegli(CASI), giusta = 'dstE = ' + c[1] + ', dstM = ' + c[2];
      const OPZ = Array.from(new Set([giusta, 'dstE = ' + c[2] + ', dstM = ' + c[1], 'dstE = F, dstM = F', 'dstE = RAX, dstM = RAX', 'dstE = RBX, dstM = F', 'dstE = F, dstM = RBX'])).slice(0, 4);
      const perche = c[2] !== 'F' ? 'La parola letta, valM, raggiunge il registro di destinazione attraverso la porta M; valE è l’indirizzo, e dstE vale F.' : c[1] !== 'F' ? 'Il risultato valE raggiunge il registro di destinazione attraverso la porta E; dstM vale F.' : 'Una scrittura in memoria lascia invariati tutti i registri, e dstE e dstM valgono F.';
      return { u: '3.4.4', d: 'La CPU a ciclo singolo esegue `' + c[0] + '`. Quali valori assumono dstE e dstM?', guida: 'Si scelga la risposta.', o: OPZ.map((tx) => (tx === giusta ? { t: tx, ok: true, fb: perche } : { t: tx, fb: perche })) };
    },
    // 3.4.5 · i tempi della CPU a ciclo singolo e della CPU multiciclo
    (r) => {
      const a = r.int(2, 12), l = r.int(1, 8), t = 5 * r.int(9, 18), per = r.scegli([200, 240, 300]), n = a + l, cm = 3 * a + 5 * l, ts = per * n, tm = cm * t, cosa = r.int(0, 2);
      const base = 'Un programma contiene ' + a + ' operazioni aritmetiche e ' + l + (l === 1 ? ' carico' : ' carichi') + '. La CPU a ciclo singolo impiega un ciclo da ' + per + ' ps per istruzione. Una CPU multiciclo impiega 3 cicli per un’operazione e 5 per un carico, con un periodo di ' + t + ' ps. ';
      if (cosa === 2) {
        const esito = ts < tm ? 0 : tm < ts ? 1 : 2, perche = 'La CPU a ciclo singolo impiega ' + n + ' × ' + per + ' = ' + ts + ' ps. La CPU multiciclo impiega ' + cm + ' × ' + t + ' = ' + tm + ' ps.';
        return { u: '3.4.5', d: base + 'Quale CPU termina per prima?', guida: 'Si scelga la risposta.', o: ['La CPU a ciclo singolo', 'La CPU multiciclo', 'Terminano insieme'].map((x, k) => (k === esito ? { t: x, ok: true, fb: perche } : { t: x, fb: perche })) };
      }
      const giusto = cosa ? tm : ts, giuste = PS(giusto);
      return { u: '3.4.5', d: base + (cosa ? 'Quanto dura il programma sulla CPU multiciclo, in picosecondi?' : 'Quanto dura il programma sulla CPU a ciclo singolo, in picosecondi?'), segnaposto: 'Un numero di picosecondi', giuste,
        ok: cosa ? 'I cicli sono 3 × ' + a + ' + 5 × ' + l + ' = ' + cm + ', e ' + cm + ' × ' + t + ' = ' + tm + ' ps.' : 'La CPU a ciclo singolo impiega un ciclo per istruzione: ' + n + ' × ' + per + ' = ' + ts + ' ps.',
        diagnosi: DIAG(giuste, [
          { se: I(cosa ? ts : tm), msg: cosa ? 'Questo è il tempo della CPU a ciclo singolo. La domanda riguarda la CPU multiciclo.' : 'Questo è il tempo della CPU multiciclo. La domanda riguarda la CPU a ciclo singolo.' },
          { se: I(cosa ? n * t : cm * per), msg: cosa ? 'È stato contato un ciclo per istruzione. Nella CPU multiciclo un’operazione ne impiega 3 e un carico 5.' : 'Sono stati impiegati i cicli della CPU multiciclo. La CPU a ciclo singolo impiega un ciclo per istruzione.' },
          { se: I(cosa ? cm : n), msg: 'Questo è il numero dei cicli. Va moltiplicato per il periodo.' }
        ]),
        altro: 'Il numero è diverso. Si contino i cicli della CPU indicata e si moltiplichino per il suo periodo.',
        indizi: cosa ? ['Operazioni: 3 × ' + a + ' = ' + 3 * a + ' cicli.', 'Carichi: 5 × ' + l + ' = ' + 5 * l + ' cicli.', cm + ' × ' + t + '.'] : ['Le istruzioni sono ' + a + ' + ' + l + ' = ' + n + '.', 'Ogni ciclo dura ' + per + ' ps.', n + ' × ' + per + '.'],
        svolgimento: cosa ? ['Cicli: ' + 3 * a + ' + ' + 5 * l + ' = ' + cm + '.', 'Periodo: ' + t + ' ps.', 'Tempo: ' + cm + ' × ' + t + ' = ' + tm + ' ps.'] : ['Cicli: ' + n + '.', 'Periodo: ' + per + ' ps.', 'Tempo: ' + n + ' × ' + per + ' = ' + ts + ' ps.'] };
    }
  ] });
})();
