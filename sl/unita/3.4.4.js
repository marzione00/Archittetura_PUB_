'use strict';
SL.registra('3.4.4', {
  titolo: 'Equazioni di controllo, traccia e verifica',
  obiettivo: 'Obiettivo: scrivere i segnali di controllo di SEQ per `pushq` e per `popq`: l’indirizzo presentato alla memoria, la direzione del trasferimento e i registri da scrivere.',
  concetti: [['mux', 'Regole che scelgono'], ['memory', 'Quale indirizzo, quale direzione'], ['lente', 'Verificare con una traccia']],
  filigrana: ['mux', 'memory', 'tabella'],
  richiami: {
    carte: [
      { sim: 'alu', da: 'Dall’unità 3.4.2', t: 'Gli ingressi dell’ALU', d: 'Per le istruzioni della pila aluB riceve il vecchio %rsp, e aluA riceve −8 oppure +8.' },
      { sim: 'mux', da: 'Dall’unità 3.1.4', t: 'I segnali di controllo', d: 'L’unità di controllo legge l’istruzione e ne ricava i comandi per i blocchi del percorso dati.' },
      { sim: 'tabella', da: 'Dall’unità 3.3.5', t: 'La traccia di ret', d: '`ret` legge la pila all’indirizzo valA, cioè il vecchio %rsp, mentre l’ALU prepara valE = %rsp + 8.' }
    ],
    domanda: { d: 'Prima di proseguire: in `ret`, da quale indirizzo la memoria legge l’indirizzo di ritorno?', o: [
      { t: 'Da valA, il vecchio %rsp', ok: true, fb: 'L’indirizzo di ritorno sta alla cima attuale della pila.' },
      { t: 'Da valE, il vecchio %rsp più 8', fb: 'valE è la cima dopo il ritorno, e serve ad aggiornare %rsp.' },
      { t: 'Da valP, il successore di ret', fb: 'valP è un indirizzo del programma. L’indirizzo di ritorno sta sulla pila.' }
    ] }
  },
  idea: {
    titolo: 'Poche regole comandano tutto',
    termini: ['equazione di controllo', 'mem_addr'],
    testo: [
      'Il percorso dati di SEQ è lo stesso per tutte le istruzioni. A renderlo capace di eseguirle sono i segnali di controllo: i comandi dei multiplexer e le abilitazioni di scrittura. Ogni segnale è descritto da una [[equazione di controllo]], cioè una regola che ne stabilisce il valore a partire da icode.',
      'Un esempio è l’indirizzo presentato alla memoria dei dati, chiamato [[mem_addr]]. Per `rmmovq`, `mrmovq`, `pushq` e `call` vale valE, l’indirizzo appena calcolato dall’ALU. Per `popq` e `ret` vale valA, cioè il vecchio %rsp, perché la parola da leggere sta alla cima attuale della pila.',
      'Altre due equazioni fissano la direzione del trasferimento. `mem_read` vale 1 per le istruzioni che leggono: `mrmovq`, `popq`, `ret`. `mem_write` vale 1 per quelle che scrivono: `rmmovq`, `pushq`, `call`. Per le altre valgono entrambe 0, e la memoria dei dati resta intatta.',
      { fig: 'scena', w: 720, h: 190, titolo: 'pushq e popq a confronto', nota: 'L’ALU lavora quasi allo stesso modo. Cambiano l’indirizzo, la direzione e i registri scritti.', els: [
        SL.el.nota('h1', 230, 0, 'pushq rA', 'mono'), SL.el.nota('h2', 480, 0, 'popq rA', 'mono'),
        SL.el.nota('r1', 0, 34, 'mem_addr', 'mono minuta'), SL.el.box('a1', 230, 22, 230, 34, null, 'valE', 'on', { cls: 'stretta' }), SL.el.box('b1', 480, 22, 230, 34, null, 'valA', 'att', { cls: 'stretta' }),
        SL.el.nota('r2', 0, 74, 'mem_read · mem_write', 'mono minuta'), SL.el.box('a2', 230, 62, 230, 34, null, '0 · 1', 'on', { cls: 'stretta' }), SL.el.box('b2', 480, 62, 230, 34, null, '1 · 0', 'att', { cls: 'stretta' }),
        SL.el.nota('r3', 0, 114, 'dstE, riceve valE', 'mono minuta'), SL.el.box('a3', 230, 102, 230, 34, null, '%rsp', 'on', { cls: 'stretta' }), SL.el.box('b3', 480, 102, 230, 34, null, '%rsp', 'on', { cls: 'stretta' }),
        SL.el.nota('r4', 0, 154, 'dstM, riceve valM', 'mono minuta'), SL.el.box('a4', 230, 142, 230, 34, null, 'nessuno', '', { cls: 'stretta' }), SL.el.box('b4', 480, 142, 230, 34, null, 'rA', 'att', { cls: 'stretta' })
      ] },
      'Due equazioni indicano infine i registri da scrivere. `dstE` è il registro che riceve valE: %rsp per le istruzioni della pila, rB per le operazioni aritmetiche. `dstM` è il registro che riceve valM: rA per `mrmovq` e per `popq`.',
      'Un’equazione sbagliata passa facilmente inosservata, perché il processore continua a funzionare ed esegue qualcosa di diverso da ciò che l’istruzione chiede. La verifica si fa con le tracce. Si parte da uno stato noto, si esegue l’istruzione a mano e si confronta lo stato finale con quello che l’ISA prescrive.'
    ]
  },
  esperimento: {
    faremo: [
      'Partiremo ogni volta dallo stesso stato: una cima della pila, un valore in %rax e una parola già presente alla cima. Sceglierai se eseguire `pushq %rax` oppure `popq %rax`, e i valori.',
      'Vedremo i segnali di controllo assumere i loro valori, uno dopo l’altro, e lo stato finale che ne deriva. Dopo il caso proposto, esegui l’altra istruzione dallo stesso stato e confronta le due colonne.'
    ],
    vedrai: [
      ['bus', 'I valori', 'In alto: valA, valB, valE e valM.'],
      ['mux', 'I segnali di controllo', 'Al centro: aluA, mem_addr, le due abilitazioni della memoria, dstE e dstM.'],
      ['register', 'Lo stato', 'In basso: %rsp, %rax e le due celle della pila coinvolte.']
    ]
  },
  lab: {
    titolo: 'pushq e popq dallo stesso stato',
    scena: { w: 860, h: 306 },
    atti: ['Decodifica', 'L’ALU', 'L’indirizzo per la memoria', 'Lettura oppure scrittura', 'I registri da scrivere', 'Il fronte'],
    controlli: [
      { id: 'op', tipo: 'scelta', eti: 'Istruzione', opzioni: [['pushq', 'pushq %rax'], ['popq', 'popq %rax']], valore: 'popq' },
      { id: 'sp', tipo: 'scelta', eti: '%rsp iniziale', opzioni: [[0x60, '0x60'], [0x200, '0x200']], valore: 0x60 },
      { id: 'v', tipo: 'scelta', eti: '%rax', opzioni: [[0x2B, '0x2B'], [0x7, '0x7']], valore: 0x2B },
      { id: 'm', tipo: 'scelta', eti: 'Parola alla cima', opzioni: [[0x51, '0x51'], [0x9, '0x9']], valore: 0x51 }
    ],
    nota: 'I passi sono sempre sei. La cella sotto la cima contiene all’inizio un valore qualsiasi.',
    previsione: {
      domanda: (p) => { const H = SL.y86.esa; return 'Lo stato iniziale è %rsp = ' + H(p.sp) + ' e %rax = ' + H(p.v) + ', e la cella ' + H(p.sp) + ' contiene ' + H(p.m) + '. SEQ esegue `' + p.op + ' %rax`. Che cosa fa la memoria dei dati?'; },
      opzioni: (p) => { const H = SL.y86.esa; return [['W' + H(p.sp - 8), 'Scrive nella cella ' + H(p.sp - 8)], ['W' + H(p.sp), 'Scrive nella cella ' + H(p.sp)], ['R' + H(p.sp), 'Legge la cella ' + H(p.sp)], ['R' + H(p.sp + 8), 'Legge la cella ' + H(p.sp + 8)]]; }
    },
    confronto: (pred, esito, p) => { const T = (k) => (k[0] === 'W' ? 'una scrittura nella cella ' : 'una lettura della cella ') + k.slice(1); return 'La previsione indicava ' + T(pred) + '. La memoria esegue ' + T(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.op === 'pushq' ? '`pushq` scrive, e lo fa alla cima nuova: mem_addr = valE = %rsp − 8.' : '`popq` legge, e lo fa alla cima attuale: mem_addr = valA = %rsp. valE, una cella più su, serve soltanto ad aggiornare il puntatore.'); },
    costruisci(p) {
      const el = SL.el, H = SL.y86.esa, passi = [], push = p.op === 'pushq', valE = push ? p.sp - 8 : p.sp + 8, addr = push ? valE : p.sp, giu = p.sp - 8;
      const st = { v: {}, s: {}, rsp: p.sp, rax: p.v, cg: null, ck: 'basso' };
      const quadro = (o) => {
        const els = [];
        ['valA', 'valB', 'valE', 'valM'].forEach((n, k) => els.push(el.box('v' + n, 20 + k * 210, 0, 200, 60, n, st.v[n] == null ? '·' : st.v[n], (o.nuovi || []).includes(n) ? 'att' : st.v[n] == null ? '' : 'on', { cls: 'stretta' })));
        [['aluA', 'aluA'], ['addr', 'mem_addr'], ['rw', 'mem_read · mem_write'], ['dstE', 'dstE'], ['dstM', 'dstM']].forEach((x, k) => els.push(el.box('s' + x[0], 20 + (k % 3) * 280, 76 + Math.floor(k / 3) * 70, 266, 60, x[1], st.s[x[0]] == null ? '·' : st.s[x[0]], (o.nuovi || []).includes(x[0]) ? 'att' : st.s[x[0]] == null ? '' : 'on', { cls: 'stretta' })));
        els.push(el.box('ck', 580, 146, 266, 60, 'clock', st.ck, o.fronte ? 'att' : '', { cls: 'stretta' }),
          el.box('rs', 20, 228, 190, 66, '%rsp', H(st.rsp), o.fronte ? 'att' : 'on', { cls: 'stretta' }),
          el.box('ra', 220, 228, 190, 66, '%rax', H(st.rax), o.fronte && !push ? 'att' : 'on', { cls: 'stretta' }),
          el.box('c1', 430, 228, 200, 66, 'cella ' + H(giu), st.cg == null ? 'qualsiasi' : H(st.cg), o.cella === giu ? 'att' : st.cg == null ? '' : 'on', { cls: 'stretta' }),
          el.box('c2', 640, 228, 206, 66, 'cella ' + H(p.sp), H(p.m), o.cella === p.sp ? 'att' : 'on', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Istruzione', p.op, 'a'], ['mem_addr', st.s.addr == null ? '·' : H(addr)], ['%rsp', H(st.rsp), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      st.v.valA = push ? H(p.v) : H(p.sp); st.v.valB = H(p.sp);
      P({ nuovi: ['valA', 'valB'] }, 0, 'Che cosa legge il banco', push ? '`pushq %rax` legge due registri. valA è il contenuto di %rax, ' + H(p.v) + ', il dato da depositare. valB è il vecchio %rsp, ' + H(p.sp) + '.' : '`popq %rax` legge %rsp su entrambe le porte: valA = valB = ' + H(p.sp) + '. Il contenuto attuale di %rax non interessa, perché sta per essere sostituito.',
        { calc: 'valA = ' + st.v.valA + ' · valB = ' + st.v.valB, chiedi: { d: push ? 'La pila sta per crescere. Quale costante riceve l’ingresso aluA?' : 'La pila sta per accorciarsi. Quale costante riceve l’ingresso aluA?', o: ['−8', '+8'], g: push ? 0 : 1, no: 'La pila cresce verso gli indirizzi bassi: depositare toglie 8 al puntatore, prelevare aggiunge 8.' } });
      st.s.aluA = push ? '−8' : '+8'; st.v.valE = H(valE);
      P({ nuovi: ['aluA', 'valE'] }, 1, 'Il puntatore successivo', 'L’equazione di aluA sceglie ' + (push ? '−8' : '+8') + ' per questa classe. L’ALU calcola valE = ' + H(p.sp) + (push ? ' − 8 = ' : ' + 8 = ') + H(valE) + ', il valore che %rsp avrà dopo l’istruzione.',
        { calc: 'valE = ' + H(valE), chiedi: { d: 'Quale valore va presentato alla memoria come indirizzo?', o: ['valA', 'valE'], g: push ? 1 : 0, no: push ? 'Il dato va scritto alla cima nuova, che è valE.' : 'La parola da prelevare sta alla cima attuale, che è valA. valE indica già la cella successiva.' } });
      st.s.addr = (push ? 'valE = ' : 'valA = ') + H(addr);
      P({ nuovi: ['addr'], cella: addr }, 2, push ? 'mem_addr = valE' : 'mem_addr = valA', push ? 'Per `pushq` l’equazione di mem_addr sceglie valE. La memoria riceve l’indirizzo ' + H(addr) + ', la cella che la pila sta per occupare.' : 'Per `popq` l’equazione di mem_addr sceglie valA. La memoria riceve l’indirizzo ' + H(addr) + ', la cima attuale. Con valE avrebbe letto la cella ' + H(valE) + ', che appartiene a un altro dato.',
        { calc: 'mem_addr = ' + H(addr), chiedi: { d: 'A questo indirizzo la memoria deve leggere oppure scrivere?', o: ['Leggere', 'Scrivere'], g: push ? 1 : 0, no: push ? '`pushq` deposita un dato sulla pila: è una scrittura.' : '`popq` preleva un dato dalla pila: è una lettura.' } });
      st.s.rw = push ? '0 · 1' : '1 · 0'; if (!push) st.v.valM = H(p.m);
      P({ nuovi: push ? ['rw', 'valA'] : ['rw', 'valM'], cella: addr }, 3, push ? 'mem_write = 1' : 'mem_read = 1', push ? 'Le due abilitazioni valgono mem_read = 0 e mem_write = 1. All’ingresso dei dati della memoria arriva valA, ' + H(p.v) + '. La scrittura avverrà al fronte.' : 'Le due abilitazioni valgono mem_read = 1 e mem_write = 0. La memoria consegna la parola che trova a ' + H(addr) + ': valM = ' + H(p.m) + '.',
        { calc: push ? 'M8[' + H(addr) + '] ← ' + H(p.v) : 'valM = ' + H(p.m) });
      st.s.dstE = '%rsp'; st.s.dstM = push ? 'nessuno' : '%rax';
      P({ nuovi: ['dstE', 'dstM'] }, 4, push ? 'Un registro da scrivere' : 'Due registri da scrivere', 'L’equazione di dstE indica %rsp, che riceverà valE = ' + H(valE) + '. ' + (push ? 'L’equazione di dstM indica «nessuno», perché `pushq` non legge nulla dalla memoria.' : 'L’equazione di dstM indica rA, cioè %rax, che riceverà valM = ' + H(p.m) + '. Il banco ha due porte di scrittura, e al fronte le userà entrambe.'),
        { calc: push ? '%rsp ← ' + H(valE) : '%rsp ← ' + H(valE) + ' · %rax ← ' + H(p.m) });
      st.rsp = valE; st.ck = 'sale ↑'; if (push) st.cg = p.v; else st.rax = p.m;
      P({ fronte: true, cella: push ? giu : null }, 5, 'Il fronte, e la verifica', push ? 'Al fronte la cella ' + H(giu) + ' riceve ' + H(p.v) + ' e %rsp diventa ' + H(valE) + '. La verifica: la ISA chiede a `pushq` di abbassare la cima di 8 e di depositarvi il registro. Lo stato finale corrisponde.' : 'Al fronte %rax riceve ' + H(p.m) + ' e %rsp diventa ' + H(valE) + '. La verifica: la ISA chiede a `popq` di consegnare la parola in cima e di alzare la cima di 8. Lo stato finale corrisponde. La cella ' + H(p.sp) + ' contiene ancora ' + H(p.m) + ', e ora sta sotto la cima.',
        { calc: '%rsp = ' + H(valE) + (push ? ' · M8[' + H(giu) + '] = ' + H(p.v) : ' · %rax = ' + H(p.m)), esito: [(push ? 'scrive a ' : 'legge a ') + H(addr), 'si'] });
      return { passi, esito: (push ? 'W' : 'R') + H(addr) };
    }
  },
  bilancio: {
    regola: [
      'Ogni segnale di controllo ha un’equazione che ne fissa il valore per ogni classe di istruzioni. mem_addr vale valE per `rmmovq`, `mrmovq`, `pushq` e `call`, e valA per `popq` e `ret`.',
      '`pushq` scrive valA all’indirizzo valE = %rsp − 8, e %rsp riceve valE. `popq` legge valM all’indirizzo valA = %rsp, %rsp riceve valE = %rsp + 8 e rA riceve valM.'
    ],
    errori: [
      ['Far leggere a popq dall’indirizzo valE.', 'valE è la cima dopo il prelievo, una cella più su. La parola da prelevare sta alla cima attuale, valA.'],
      ['Attivare insieme mem_read e mem_write.', 'In un ciclo la memoria dei dati legge oppure scrive, quindi al massimo una delle due abilitazioni vale 1.'],
      ['Dimenticare che popq scrive due registri.', 'Allo stesso fronte %rsp riceve valE e rA riceve valM.']
    ],
    saFare: ['Scrivere mem_addr, mem_read e mem_write per le istruzioni che usano la memoria.', 'Indicare dstE e dstM per ogni classe.', 'Verificare un’equazione con una traccia che parte da uno stato noto.'],
    esercizi: [
      { d: 'Per quale gruppo di istruzioni il segnale mem_write vale 1?', guida: 'Si scelga la risposta.', o: [
        { t: 'rmmovq, pushq, call', ok: true, fb: 'Sono le tre classi che scrivono una parola in memoria.' },
        { t: 'mrmovq, popq, ret', fb: 'Queste tre classi leggono dalla memoria: per loro vale 1 mem_read.' },
        { t: 'addq, subq, rrmovq', fb: 'Queste istruzioni lavorano soltanto sui registri, e le due abilitazioni della memoria valgono 0.' }] },
      { d: 'SEQ esegue `popq %rbx` con %rsp = 0x1F0. Quanto vale %rsp dopo il fronte? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x200', giuste: ['0x1f8', '1f8', '1f8h'],
        ok: '`popq` restituisce una cella: valE = 0x1F0 + 8 = 0x1F8.',
        diagnosi: [
          { se: ['0x1e8', '1e8', '1e8h'], msg: 'Togliere 8 riserva una cella, come fa `pushq`. `popq` ne restituisce una.' },
          { se: ['0x1f0', '1f0', '1f0h'], msg: 'Questo è l’indirizzo da cui `popq` legge. Dopo il prelievo il puntatore avanza di 8.' },
          { se: ['0x200', '200', '200h'], msg: 'Una parola occupa 8 byte, quindi il puntatore avanza di 8.' }
        ],
        altro: 'Il valore è diverso. Si aggiunga 8 al vecchio %rsp, in esadecimale.',
        indizi: ['aluB = valB = 0x1F0.', 'Per `popq`, aluA = +8.', '0x1F0 + 8.'],
        svolgimento: ['valB = 0x1F0.', 'valE = 0x1F0 + 8 = 0x1F8.', 'Al fronte: %rsp = 0x1F8.'] }
    ],
    sfida: ['cslez3_4_03_random_assembly', 'Segnali di controllo di SEQ']
  }
});
