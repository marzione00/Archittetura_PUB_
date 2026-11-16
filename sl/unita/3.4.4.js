'use strict';
SL.registra('3.4.4', {
  titolo: 'Equazioni di controllo, traccia e verifica',
  obiettivo: 'Obiettivo: scrivere i segnali di controllo della CPU a ciclo singolo per una lettura e per una scrittura della memoria: gli ingressi dell’ALU, l’indirizzo, la direzione del trasferimento e i registri da scrivere.',
  concetti: [['mux', 'Regole di selezione'], ['memory', 'Indirizzo e direzione'], ['lente', 'La verifica mediante una traccia']],
  filigrana: ['mux', 'memory', 'tabella'],
  richiami: {
    carte: [
      { sim: 'alu', da: 'Dall’unità 3.4.2', t: 'Gli ingressi dell’ALU', d: 'Negli accessi alla memoria ALU A seleziona valC e ALU B seleziona valB: l’ALU calcola l’indirizzo.' },
      { sim: 'mux', da: 'Dall’unità 3.1.4', t: 'I segnali di controllo', d: 'L’unità di controllo legge l’istruzione e ne ricava i comandi per i blocchi del percorso dati.' },
      { sim: 'tabella', da: 'Dall’unità 3.3.3', t: 'La lettura dalla memoria', d: '`mov rA, D(rB)` legge la parola valM all’indirizzo valE e la deposita in rA attraverso la porta M.' }
    ],
    domanda: { d: 'Prima di proseguire: in `mov rax, 8(rbx)`, attraverso quale porta del banco è scritto RAX?', o: [
      { t: 'La porta M, che riceve valM', ok: true, fb: 'La parola letta dalla memoria è valM, e la porta M la deposita nel registro indicato da dstM.' },
      { t: 'La porta E, che riceve valE', fb: 'valE è l’indirizzo della parola. Il dato letto è valM.' },
      { t: 'Nessuna porta: la memoria scrive direttamente il registro', fb: 'Ogni scrittura di un registro passa da una porta del banco.' }
    ] }
  },
  idea: {
    titolo: 'Poche regole per l’intero percorso dati',
    termini: ['equazione di controllo'],
    testo: [
      'Il percorso dati della CPU a ciclo singolo è il medesimo per tutte le istruzioni. La capacità di eseguirle deriva dai segnali di controllo, che l’unità di controllo genera a partire da icode: i comandi dei multiplexer, l’operazione dell’ALU e le abilitazioni di scrittura. Ogni segnale è descritto da una [[equazione di controllo]], cioè una regola che ne stabilisce il valore per ogni categoria di istruzioni. Un’unità realizzata con circuiti combinatori prende il nome di unità di controllo cablata.',
      'Nel prelievo, Instr valid indica se icode è previsto, Need regids se l’istruzione ha il byte dei registri, Need valC se ha la costante. Nell’esecuzione, ALU A e ALU B scelgono gli ingressi, ALU fun l’operazione, e Set ZF stabilisce se ZF è aggiornato: soltanto per le istruzioni aritmetiche e logiche.',
      'Nella fase di memoria i segnali sono quattro. Mem addr è l’indirizzo presentato alla memoria dei dati, e vale sempre valE. Mem data è il dato da scrivere, e vale valA. Mem read vale 1 per `mov rA, D(rB)`, Mem write vale 1 per `mov D(rB), rA`. Per tutte le altre istruzioni valgono entrambi 0, e la memoria dei dati resta invariata.',
      { fig: 'scena', w: 720, h: 190, titolo: 'Una lettura e una scrittura a confronto', nota: 'L’ALU opera in modo identico. Variano la direzione e il registro scritto.', els: [
        SL.el.nota('h1', 230, 0, 'mov rA, D(rB)', 'mono'), SL.el.nota('h2', 480, 0, 'mov D(rB), rA', 'mono'),
        SL.el.nota('r1', 0, 34, 'ALU A · ALU B', 'mono minuta'), SL.el.box('a1', 230, 22, 230, 34, null, 'valC · valB', 'on', { cls: 'stretta' }), SL.el.box('b1', 480, 22, 230, 34, null, 'valC · valB', 'on', { cls: 'stretta' }),
        SL.el.nota('r2', 0, 74, 'Mem read · Mem write', 'mono minuta'), SL.el.box('a2', 230, 62, 230, 34, null, '1 · 0', 'att', { cls: 'stretta' }), SL.el.box('b2', 480, 62, 230, 34, null, '0 · 1', 'att', { cls: 'stretta' }),
        SL.el.nota('r3', 0, 114, 'dstE, riceve valE', 'mono minuta'), SL.el.box('a3', 230, 102, 230, 34, null, 'F', '', { cls: 'stretta' }), SL.el.box('b3', 480, 102, 230, 34, null, 'F', '', { cls: 'stretta' }),
        SL.el.nota('r4', 0, 154, 'dstM, riceve valM', 'mono minuta'), SL.el.box('a4', 230, 142, 230, 34, null, 'rA', 'att', { cls: 'stretta' }), SL.el.box('b4', 480, 142, 230, 34, null, 'F', '', { cls: 'stretta' })
      ] },
      'Due equazioni indicano infine i registri da scrivere. dstE è il registro che riceve valE: rA per le istruzioni aritmetiche e logiche e per `mov rA, rB`, rB per `mov rB, V`. dstM è il registro che riceve valM: rA per `mov rA, D(rB)`. Il valore F indica che la porta corrispondente non scrive alcun registro.',
      'Un’equazione errata passa facilmente inosservata, poiché la CPU continua a funzionare ed esegue un’operazione diversa da quella richiesta dall’istruzione. La verifica si conduce con le tracce: si parte da uno stato noto, si esegue l’istruzione manualmente e si confronta lo stato finale con quello prescritto dall’ISA.'
    ]
  },
  esperimento: {
    faremo: [
      'Lo stato iniziale è sempre il medesimo: una base in RBX, un valore in RAX e una parola già presente in memoria all’indirizzo RBX + 8. I controlli fissano l’istruzione, `mov rax, 8(rbx)` oppure `mov 8(rbx), rax`, e i valori.',
      'I segnali di controllo assumono i rispettivi valori, uno dopo l’altro, fino allo stato finale che ne deriva. Dopo il caso proposto, è istruttivo eseguire l’altra istruzione dal medesimo stato e confrontare le due colonne.'
    ],
    vedrai: [
      ['bus', 'I valori', 'In alto: valA, valB, valC, valE e valM.'],
      ['mux', 'I segnali di controllo', 'Al centro: ALU A, ALU B, Mem addr, le due abilitazioni della memoria, dstE e dstM.'],
      ['register', 'Lo stato', 'In basso: RBX, RAX e la parola della memoria coinvolta.']
    ]
  },
  lab: {
    titolo: 'Una lettura e una scrittura dal medesimo stato',
    scena: { w: 860, h: 306 },
    atti: ['Decodifica', 'L’ALU', 'L’indirizzo per la memoria', 'Lettura oppure scrittura', 'I registri da scrivere', 'Il fronte'],
    controlli: [
      { id: 'op', tipo: 'scelta', eti: 'Istruzione', opzioni: [['mr', 'mov rax, 8(rbx)'], ['rm', 'mov 8(rbx), rax']], valore: 'mr' },
      { id: 'b', tipo: 'scelta', eti: 'RBX', opzioni: [[0x60, '0x60'], [0x200, '0x200']], valore: 0x60 },
      { id: 'v', tipo: 'scelta', eti: 'RAX', opzioni: [[0x2B, '0x2B'], [0x7, '0x7']], valore: 0x2B },
      { id: 'm', tipo: 'scelta', eti: 'Parola in memoria', opzioni: [[0x51, '0x51'], [0x9, '0x9']], valore: 0x51 }
    ],
    nota: 'I passi sono sempre sei. La parola coinvolta è quella che ha inizio all’indirizzo RBX + 8.',
    previsione: {
      domanda: (p) => { const H = SL.isa.esa; return 'Lo stato iniziale è RBX = ' + H(p.b) + ' e RAX = ' + H(p.v) + ', e la parola all’indirizzo ' + H(p.b + 8) + ' contiene ' + H(p.m) + '. La CPU esegue `' + (p.op === 'mr' ? 'mov rax, 8(rbx)' : 'mov 8(rbx), rax') + '`. Quale operazione esegue la memoria dei dati?'; },
      opzioni: (p) => { const H = SL.isa.esa; return [['W' + H(p.b + 8), 'Scrive la parola ' + H(p.b + 8)], ['W' + H(p.b), 'Scrive la parola ' + H(p.b)], ['R' + H(p.b + 8), 'Legge la parola ' + H(p.b + 8)], ['R' + H(p.b), 'Legge la parola ' + H(p.b)]]; }
    },
    confronto: (pred, esito, p) => { const T = (k) => (k[0] === 'W' ? 'una scrittura della parola ' : 'una lettura della parola ') + k.slice(1); return 'La previsione indicava ' + T(pred) + '. La memoria esegue ' + T(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'In entrambe le forme Mem addr vale valE = RBX + 8. ' + (p.op === 'mr' ? '`mov rA, D(rB)` legge: Mem read vale 1.' : '`mov D(rB), rA` scrive: Mem write vale 1.')); },
    costruisci(p) {
      const el = SL.el, I = SL.isa, H = I.esa, passi = [], leggi = p.op === 'mr', ind = p.b + 8, ist = { n: p.op, a: 'rax', b: 'rbx', c: 8 };
      const s0 = { R: { rax: p.v, rbx: p.b }, M: {}, zf: 1, pc: 0x40 }; s0.M[ind] = p.m;
      const f = I.fasi(ist, s0), s1 = I.esegui(ist, s0);
      const st = { v: {}, sg: {}, rax: p.v, mem: p.m, ck: 'basso' };
      const quadro = (o) => {
        const els = [];
        ['valA', 'valB', 'valC', 'valE', 'valM'].forEach((n, k) => els.push(el.box('v' + n, 20 + k * 166, 0, 158, 58, n, st.v[n] === undefined ? '·' : st.v[n] === null ? '·' : H(st.v[n]), (o.nuovi || []).includes(n) ? 'att' : st.v[n] === undefined ? '' : st.v[n] === null ? 'off' : 'on', { cls: 'stretta' })));
        [['aluA', 'ALU A'], ['aluB', 'ALU B'], ['addr', 'Mem addr'], ['rw', 'Mem read · Mem write'], ['dstE', 'dstE'], ['dstM', 'dstM']].forEach((x, k) => els.push(el.box('s' + x[0], 20 + (k % 3) * 276, 74 + Math.floor(k / 3) * 68, 268, 60, x[1], st.sg[x[0]] == null ? '·' : st.sg[x[0]], (o.segnali || []).includes(x[0]) ? 'att' : st.sg[x[0]] == null ? '' : 'on', { cls: 'stretta' })));
        els.push(el.box('rb', 20, 226, 200, 66, 'RBX', H(p.b), 'on', { cls: 'stretta' }),
          el.box('ra', 230, 226, 200, 66, 'RAX', H(st.rax), o.fronte && leggi ? 'att' : 'on', { cls: 'stretta' }),
          el.box('mm', 440, 226, 260, 66, 'parola a ' + H(ind), H(st.mem), o.fronte && !leggi ? 'att' : 'on', { cls: 'stretta' }),
          el.box('ck', 710, 226, 134, 66, 'clock', st.ck, o.fronte ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Istruzione', leggi ? 'mov rax, 8(rbx)' : 'mov 8(rbx), rax', 'a'], ['Mem addr', st.sg.addr || '·'], ['RAX', H(st.rax), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      st.v = { valA: leggi ? null : p.v, valB: p.b, valC: 8 };
      P({ nuovi: leggi ? ['valB', 'valC'] : ['valA', 'valB', 'valC'] }, 0, 'Decodifica', leggi ? 'Il prelievo ricava valC = 8. La decodifica legge soltanto la base: valB = R[rbx] = ' + H(p.b) + '. RAX è la destinazione, e il suo contenuto precedente non è letto.' : 'Il prelievo ricava valC = 8. La decodifica legge due registri: valA = R[rax] = ' + H(p.v) + ', il dato da scrivere, e valB = R[rbx] = ' + H(p.b) + ', la base.',
        { calc: 'valB = ' + H(p.b) + (leggi ? '' : ' · valA = ' + H(p.v)), chiedi: { d: 'La CPU deve calcolare l’indirizzo della parola. Quali ingressi selezioneranno ALU A e ALU B?', o: ['valC e valB', 'valA e valB', '0 e valB'], g: 0, no: 'Negli accessi alla memoria l’ALU somma lo spostamento valC e la base valB.' } });
      st.v.valE = f.valE; st.sg.aluA = 'valC = 8'; st.sg.aluB = 'valB = ' + H(p.b);
      P({ nuovi: ['valE'], segnali: ['aluA', 'aluB'] }, 1, 'L’ALU', 'ALU A seleziona valC e ALU B seleziona valB, e ALU fun vale «somma»: valE = ' + H(p.b) + ' + 8 = ' + H(ind) + '. Set ZF vale 0, e ZF resta invariato. In questo passo le due istruzioni coincidono.', { calc: 'valE = ' + H(p.b) + ' + 8 = ' + H(ind) });
      st.sg.addr = 'valE = ' + H(ind);
      P({ segnali: ['addr'] }, 2, 'L’indirizzo per la memoria', 'Mem addr vale valE = ' + H(ind) + ', per entrambe le istruzioni. È l’indirizzo della parola sulla quale la memoria opererà.',
        { calc: 'Mem addr = ' + H(ind), chiedi: { d: 'La memoria deve leggere oppure scrivere?', o: ['Leggere', 'Scrivere'], g: leggi ? 0 : 1, no: leggi ? '`mov rA, D(rB)` porta un dato dalla memoria a un registro: Mem read vale 1.' : '`mov D(rB), rA` porta un dato da un registro alla memoria: Mem write vale 1.' } });
      st.sg.rw = leggi ? '1 · 0' : '0 · 1'; st.v.valM = leggi ? p.m : null;
      P({ segnali: ['rw'], nuovi: leggi ? ['valM'] : ['valA'] }, 3, leggi ? 'Una lettura' : 'Una scrittura', leggi ? 'Mem read vale 1 e Mem write vale 0. La memoria fornisce la parola all’indirizzo ' + H(ind) + ': valM = ' + H(p.m) + '.' : 'Mem write vale 1 e Mem read vale 0. Mem data riceve valA = ' + H(p.v) + ', che al fronte sostituirà la parola all’indirizzo ' + H(ind) + '. Nessun valM è prodotto.', { calc: 'Mem read · Mem write = ' + st.sg.rw });
      st.sg.dstE = 'F'; st.sg.dstM = leggi ? 'rA = RAX' : 'F';
      P({ segnali: ['dstE', 'dstM'] }, 4, 'I registri da scrivere', leggi ? 'dstE vale F: la porta E non scrive alcun registro, e valE, che è un indirizzo, non raggiunge il banco. dstM vale RAX: la porta M depositerà valM in RAX.' : 'dstE e dstM valgono entrambi F: nessun registro è scritto. La sola modifica dello stato riguarda la memoria.', { calc: 'dstE = F · dstM = ' + (leggi ? 'RAX' : 'F') });
      st.ck = 'sale ↑'; st.rax = s1.R.rax; st.mem = s1.M[ind];
      P({ fronte: true }, 5, 'Il fronte', leggi ? 'Al fronte RAX riceve ' + H(p.m) + ', e la memoria resta invariata.' : 'Al fronte la parola all’indirizzo ' + H(ind) + ' diviene ' + H(p.v) + ', e RAX resta ' + H(p.v) + '.' + ' La traccia conferma l’effetto prescritto dall’ISA: ' + (leggi ? 'R[rax] ← M8[R[rbx] + 8].' : 'M8[R[rbx] + 8] ← R[rax].'),
        { calc: leggi ? 'RAX = ' + H(p.m) : 'M8[' + H(ind) + '] = ' + H(p.v), esito: [(leggi ? 'lettura di ' : 'scrittura di ') + H(ind), 'si'] });
      return { passi, esito: (leggi ? 'R' : 'W') + H(ind) };
    }
  },
  bilancio: {
    regola: [
      'Ogni segnale di controllo ha un’equazione che ne fissa il valore per ogni categoria di istruzioni. Negli accessi alla memoria ALU A vale valC, ALU B vale valB, Mem addr vale valE e Mem data vale valA.',
      '`mov rA, D(rB)` attiva Mem read e scrive valM in rA attraverso la porta M, con dstM = rA. `mov D(rB), rA` attiva Mem write, e dstE e dstM valgono F.'
    ],
    errori: [
      ['Attivare contemporaneamente Mem read e Mem write.', 'In un ciclo la memoria dei dati legge oppure scrive, quindi al massimo una delle due abilitazioni vale 1.'],
      ['Scrivere valE nel registro di destinazione di una lettura.', 'valE è l’indirizzo. Il registro riceve valM attraverso la porta M, e dstE vale F.'],
      ['Aggiornare ZF dopo un `mov`.', 'Set ZF vale 1 soltanto per le istruzioni aritmetiche e logiche.']
    ],
    saFare: ['Scrivere Mem addr, Mem read e Mem write per le istruzioni che impiegano la memoria.', 'Indicare dstE e dstM per ogni forma di istruzione.', 'Verificare un’equazione con una traccia che parte da uno stato noto.'],
    esercizi: [
      { d: 'Per quale istruzione il segnale Mem write vale 1?', guida: 'Si scelga la risposta.', o: [
        { t: 'mov D(rB), rA', ok: true, fb: 'È la sola forma che scrive una parola in memoria.' },
        { t: 'mov rA, D(rB)', fb: 'Questa forma legge dalla memoria: per essa vale 1 Mem read.' },
        { t: 'add rA, rB', fb: 'Le istruzioni aritmetiche operano soltanto sui registri, e le due abilitazioni della memoria valgono 0.' }] },
      { d: 'Per `mov rbx, 291`, quale registro indica dstE?', guida: 'Si scelga la risposta.', o: [
        { t: 'RBX, cioè rB', ok: true, fb: 'Nella forma `mov rB, V` la destinazione è rB, e il campo rA vale F.' },
        { t: 'F, nessun registro', fb: 'La costante transita nell’ALU e deve raggiungere un registro attraverso la porta E.' },
        { t: 'RBX, attraverso dstM', fb: 'dstM riceve valM, prodotto soltanto dalle letture della memoria.' }] }
    ],
    sfida: ['cslez3_4_03_random_assembly', 'Segnali di controllo di SEQ']
  }
});
