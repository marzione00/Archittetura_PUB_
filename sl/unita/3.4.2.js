'use strict';
SL.registra('3.4.2', {
  titolo: 'Il percorso dati a ciclo singolo di SEQ',
  obiettivo: 'Obiettivo: indicare, per le principali istruzioni, i valori presenti ai due ingressi dell’ALU di SEQ e la destinazione del suo risultato, e seguire una `pushq` lungo il percorso dati.',
  concetti: [['alu', 'Gli operandi dell’ALU'], ['mux', 'Un multiplexer per ingresso'], ['bus', 'Un risultato, due destinazioni']],
  filigrana: ['alu', 'bus', 'mux'],
  richiami: {
    carte: [
      { sim: 'cpu', da: 'Dall’unità 3.4.1', t: 'SEQ', d: 'Durante il ciclo i segnali attraversano la logica combinatoria. Al fronte gli elementi di stato catturano i valori nuovi.' },
      { sim: 'mux', da: 'Dall’unità 3.1.2', t: 'Il multiplexer', d: 'Copia sull’uscita uno dei suoi ingressi, selezionato da un segnale di controllo.' },
      { sim: 'tabella', da: 'Dall’unità 3.3.5', t: 'La pila nelle sei fasi', d: 'Per `call` l’ALU calcola valE = valB − 8, la nuova cima della pila, a partire dal contenuto di %rsp.' }
    ],
    domanda: { d: 'Prima di proseguire: in `mrmovq 8(%rbx), %rax`, quali due valori somma l’ALU?', o: [
      { t: 'valB e valC', ok: true, fb: 'La base letta da %rbx e lo spostamento scritto nell’istruzione.' },
      { t: 'valA e valB', fb: 'Due registri si sommano in `addq`. In questo caso uno degli addendi è la costante dell’istruzione.' },
      { t: 'valC e valP', fb: 'valP è destinato al PC. L’indirizzo si ottiene dalla base e dallo spostamento.' }
    ] }
  },
  idea: {
    titolo: 'Una sola ALU per impieghi diversi',
    termini: ['alua', 'alub'],
    testo: [
      'SEQ contiene una sola ALU, che ogni istruzione impiega in modo diverso. `addq` vi somma due registri. `mrmovq` vi calcola un indirizzo, base più spostamento. `pushq` e `call` vi sottraggono 8 alla cima della pila, `popq` e `ret` vi aggiungono 8. Per servire tutte queste istruzioni, ciascun ingresso dell’ALU è preceduto da un multiplexer.',
      'Il primo ingresso prende il nome di [[alua|aluA]]. Esso può ricevere valA, per le operazioni fra registri, oppure valC, per gli indirizzi e per `irmovq`, oppure una delle costanti −8 e +8, per le istruzioni della pila. Il secondo ingresso prende il nome di [[alub|aluB]], e riceve valB, oppure 0 quando l’istruzione deve soltanto trasferire un valore attraverso l’ALU.',
      { fig: 'scena', w: 720, h: 192, titolo: 'Gli ingressi dell’ALU, istruzione per istruzione', nota: 'L’unità di controllo seleziona la riga in base a icode.', els: [
        SL.el.nota('h0', 0, 0, 'ISTRUZIONE', 'mono'), SL.el.nota('h1', 300, 0, 'aluA', 'mono'), SL.el.nota('h2', 520, 0, 'aluB', 'mono'),
        SL.el.nota('a1', 0, 36, 'addq, subq, andq, xorq', 'mono minuta'), SL.el.box('b1', 300, 24, 200, 34, null, 'valA', 'on', { cls: 'stretta' }), SL.el.box('c1', 520, 24, 200, 34, null, 'valB', 'on', { cls: 'stretta' }),
        SL.el.nota('a2', 0, 76, 'mrmovq, rmmovq', 'mono minuta'), SL.el.box('b2', 300, 64, 200, 34, null, 'valC', '', { cls: 'stretta' }), SL.el.box('c2', 520, 64, 200, 34, null, 'valB', 'on', { cls: 'stretta' }),
        SL.el.nota('a3', 0, 116, 'pushq, call', 'mono minuta'), SL.el.box('b3', 300, 104, 200, 34, null, '−8', 'att', { cls: 'stretta' }), SL.el.box('c3', 520, 104, 200, 34, null, 'valB', 'on', { cls: 'stretta' }),
        SL.el.nota('a4', 0, 156, 'popq, ret', 'mono minuta'), SL.el.box('b4', 300, 144, 200, 34, null, '+8', 'att', { cls: 'stretta' }), SL.el.box('c4', 520, 144, 200, 34, null, 'valB', 'on', { cls: 'stretta' })
      ] },
      'Anche l’uscita dell’ALU, valE, ha più di una destinazione. Per `addq` è la porta di scrittura del banco dei registri. Per `mrmovq` è l’ingresso degli indirizzi della memoria. Per `pushq` sono entrambe, poiché la nuova cima della pila è l’indirizzo al quale scrivere e anche il valore da scrivere in %rsp. Il filo si dirama, e i segnali di controllo determinano quale destinazione lo acquisisce.',
      'In `pushq %rax` i due valori letti dal banco seguono quindi percorsi diversi. valB, il valore precedente di %rsp, entra nell’ALU insieme alla costante −8. valA, il contenuto di %rax, è trasmesso direttamente all’ingresso dei dati della memoria, senza attraversare l’ALU: è il dato da depositare, ed è escluso da ogni calcolo.'
    ]
  },
  esperimento: {
    faremo: [
      'SEQ esegue `pushq %rax`. I controlli fissano la cima iniziale della pila e il valore di %rax.',
      'Si segue valB attraverso l’ALU e valA verso la memoria, fino alla diramazione in cui valE raggiunge due destinazioni. Dopo il caso proposto, è istruttivo modificare il valore di %rax: l’indirizzo della scrittura resterà invariato.'
    ],
    vedrai: [
      ['register', 'Le letture del banco', 'A sinistra: valB dal registro %rsp, valA dal registro %rax.'],
      ['alu', 'I multiplexer e l’ALU', 'Al centro: gli ingressi aluA e aluB, e il risultato valE.'],
      ['memory', 'Le destinazioni', 'A destra: l’indirizzo e il dato della memoria, e la scrittura in %rsp.']
    ]
  },
  lab: {
    titolo: 'Una pushq sul percorso dati',
    scena: { w: 860, h: 290 },
    atti: ['Prelievo e decodifica', 'Gli ingressi dell’ALU', 'La diramazione', 'I valori sono disponibili', 'Il fronte'],
    controlli: [
      { id: 'sp', tipo: 'scelta', eti: '%rsp iniziale', opzioni: [[0x70, '0x70'], [0x200, '0x200']], valore: 0x70 },
      { id: 'v', tipo: 'scelta', eti: '%rax', opzioni: [[0x2B, '0x2B'], [0x7, '0x7'], [0xFF, '0xFF']], valore: 0x2B }
    ],
    nota: 'I passi sono sempre sei. I byte dell’istruzione sono A0 0F.',
    previsione: {
      domanda: (p) => { const H = SL.y86.esa; return 'SEQ esegue `pushq %rax` con %rsp = ' + H(p.sp) + ' e %rax = ' + H(p.v) + '. In quale cella è scritto ' + H(p.v) + ', e quanto vale %rsp al termine?'; },
      opzioni: (p) => { const H = SL.y86.esa; return [[p.sp - 8, p.sp - 8], [p.sp, p.sp - 8], [p.sp - 8, p.sp], [p.sp, p.sp + 8]].map((x) => [H(x[0]) + ',' + H(x[1]), 'cella ' + H(x[0]) + ', %rsp = ' + H(x[1])]); }
    },
    confronto: (pred, esito, p) => { const T = (k) => 'cella ' + k.split(',')[0] + ' e %rsp = ' + k.split(',')[1], H = SL.y86.esa; return 'La previsione indicava ' + T(pred) + '. L’esito è ' + T(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'L’ALU calcola una volta sola valE = ' + H(p.sp) + ' − 8 = ' + H(p.sp - 8) + ', e tale valore è impiegato sia come indirizzo per la memoria sia come nuovo contenuto di %rsp.'); },
    costruisci(p) {
      const el = SL.el, H = SL.y86.esa, passi = [], valE = p.sp - 8;
      const st = { a: false, b: false, mux: false, e: false, biv: false, rsp: p.sp, cella: null, ck: 'basso' };
      const quadro = (o) => {
        const els = [
          el.box('rb', 20, 14, 170, 66, '%rsp → valB', st.b ? H(st.rsp === p.sp ? p.sp : p.sp) : '·', o.letti ? 'att' : st.b ? 'on' : '', { cls: 'stretta' }),
          el.box('ra', 20, 206, 170, 66, '%rax → valA', st.a ? H(p.v) : '·', o.letti ? 'att' : st.a ? 'on' : '', { cls: 'stretta' }),
          el.linea('l1', 190, 47, 240, 47, st.mux ? 'on' : ''),
          el.box('mb', 240, 14, 150, 66, 'MUX · aluB', st.mux ? H(p.sp) : '·', o.mux ? 'att' : st.mux ? 'on' : '', { cls: 'stretta' }),
          el.box('ma', 240, 104, 150, 66, 'MUX · aluA', st.mux ? '−8' : '·', o.mux ? 'att' : st.mux ? 'on' : '', { cls: 'stretta' }),
          el.linea('l2', 390, 47, 440, 80, st.e ? 'on' : ''), el.linea('l3', 390, 137, 440, 110, st.e ? 'on' : ''),
          el.box('al', 440, 50, 130, 90, 'ALU · somma', st.e ? H(valE) : '·', o.alu ? 'att' : st.e ? 'on' : '', { cls: 'stretta' }),
          el.linea('f0', 570, 95, 600, 95, st.biv ? 'att' : ''), el.linea('f1', 600, 95, 600, 47, st.biv ? 'att' : ''), el.linea('f2', 600, 47, 630, 47, st.biv ? 'att' : ''), el.linea('f3', 600, 95, 600, 239, st.biv ? 'att' : ''), el.linea('f4', 600, 239, 630, 239, st.biv ? 'att' : ''),
          el.linea('d1', 190, 256, 614, 256, st.biv ? 'on' : ''), el.linea('d2', 614, 256, 614, 137, st.biv ? 'on' : ''), el.linea('d3', 614, 137, 630, 137, st.biv ? 'on' : ''),
          el.box('mi', 630, 14, 214, 66, 'memoria · indirizzo', st.biv ? H(valE) : '·', o.biv ? 'att' : st.biv ? 'on' : '', { cls: 'stretta' }),
          el.box('md', 630, 104, 214, 66, 'memoria · dato', st.biv ? H(p.v) : '·', o.biv ? 'att' : st.biv ? 'on' : '', { cls: 'stretta' }),
          el.box('rw', 630, 206, 214, 66, 'banco · scrive in %rsp', st.biv ? H(valE) : '·', o.biv ? 'att' : st.biv ? 'on' : '', { cls: 'stretta' }),
          el.box('ck', 240, 196, 150, 50, 'clock', st.ck, o.fronte ? 'att' : '', { cls: 'stretta' })];
        return els;
      };
      const hud = () => [['valE', st.e ? H(valE) : '·', 'a'], ['%rsp', H(st.rsp)], ['Cella ' + H(valE), st.cella == null ? 'invariata' : H(st.cella), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      st.a = true; st.b = true;
      P({ letti: true }, 0, 'Due letture dal banco', 'SEQ preleva i byte A0 0F: icode A è `pushq`, rA è %rax e rB è assente. Nella decodifica il banco legge due registri. valA è il contenuto di %rax, ' + H(p.v) + ', il dato da depositare. valB è il contenuto di %rsp, ' + H(p.sp) + ', che l’istruzione impiega senza nominarlo.',
        { calc: 'valA = ' + H(p.v) + ' · valB = ' + H(p.sp), chiedi: { d: 'L’ALU deve calcolare la nuova cima della pila. Quale valore occorre al suo ingresso aluA?', o: ['valA, il dato da depositare', 'valC, la costante dell’istruzione', 'La costante −8'], g: 2, no: 'La nuova cima è la precedente meno 8. Il dato valA è estraneo al calcolo, e `pushq` è priva di una costante valC.' } });
      st.mux = true;
      P({ mux: true }, 1, 'La selezione dei multiplexer', 'L’unità di controllo rileva icode A e comanda i due multiplexer: quello di aluB seleziona valB, cioè ' + H(p.sp) + ', e quello di aluA seleziona la costante −8. valA resta escluso dall’ALU.', { calc: 'aluA = −8 · aluB = ' + H(p.sp) });
      st.e = true;
      P({ alu: true }, 1, 'L’ALU calcola la nuova cima', 'L’ALU somma i due ingressi: valE = ' + H(p.sp) + ' + (−8) = ' + H(valE) + '. È l’indirizzo della cella che la pila sta per occupare.',
        { calc: 'valE = ' + H(p.sp) + ' − 8 = ' + H(valE), chiedi: { d: 'Quali destinazioni ha valE in una `pushq`?', o: ['Soltanto la memoria, come indirizzo', 'Soltanto il banco, per aggiornare %rsp', 'La memoria e il banco'], g: 2, no: 'La nuova cima è l’indirizzo al quale scrivere il dato, e anche il valore che %rsp deve assumere.' } });
      st.biv = true;
      P({ biv: true }, 2, 'La diramazione', 'L’uscita dell’ALU si dirama. Un ramo porta valE all’ingresso degli indirizzi della memoria; l’altro lo porta alla porta di scrittura del banco, con l’indirizzo di %rsp. Nel frattempo valA, senza attraversare l’ALU, ha raggiunto l’ingresso dei dati della memoria.', { calc: 'indirizzo = ' + H(valE) + ' · dato = ' + H(p.v) });
      P({ biv: true }, 3, 'Due scritture in attesa', 'L’unità di controllo abilita due scritture: quella della memoria, che scriverà ' + H(p.v) + ' nella cella ' + H(valE) + ', e quella del banco, che scriverà ' + H(valE) + ' in %rsp. Fino al fronte, %rsp contiene ancora ' + H(p.sp) + ' e la cella conserva il contenuto precedente.',
        { calc: 'M8[' + H(valE) + '] ← ' + H(p.v) + ' · %rsp ← ' + H(valE), chiedi: { d: 'Le due scritture avvengono in istanti diversi?', o: ['Sì, prima la memoria e poi il registro', 'No, al medesimo fronte'], g: 1, no: 'In SEQ tutti gli elementi di stato catturano i nuovi valori al medesimo fronte.' } });
      st.rsp = valE; st.cella = p.v; st.ck = 'sale ↑';
      P({ fronte: true, biv: true }, 4, 'Il fronte', 'Il clock sale. La memoria scrive ' + H(p.v) + ' nella cella ' + H(valE) + ', e nel medesimo istante %rsp passa da ' + H(p.sp) + ' a ' + H(valE) + '. La pila contiene una parola in più, e la sua cima indica tale parola. Un solo calcolo dell’ALU ha servito due scopi.',
        { calc: 'M8[' + H(valE) + '] = ' + H(p.v) + ' · %rsp = ' + H(valE), esito: ['cella ' + H(valE) + ' · %rsp = ' + H(valE), 'si'] });
      return { passi, esito: H(valE) + ',' + H(valE) };
    }
  },
  bilancio: {
    regola: [
      'Due multiplexer, posti agli ingressi dell’ALU, selezionano gli operandi: aluA riceve valA, valC oppure una costante −8 o +8, e aluB riceve valB oppure 0.',
      'Il risultato valE raggiunge le destinazioni richieste dall’istruzione. In `pushq` si dirama: è l’indirizzo della scrittura in memoria e il nuovo valore di %rsp. Il dato valA raggiunge la memoria senza attraversare l’ALU.'
    ],
    errori: [
      ['Trasmettere il dato all’ALU.', 'In `pushq` l’ALU opera soltanto sul puntatore. Il dato valA è trasmesso direttamente all’ingresso dei dati della memoria.'],
      ['Scrivere alla cima precedente.', 'L’indirizzo della scrittura è valE = %rsp − 8. La cima precedente contiene un dato ancora in uso.'],
      ['Calcolare due volte la nuova cima.', 'L’ALU è una sola e calcola una volta. Il suo risultato è distribuito su due fili.']
    ],
    saFare: ['Indicare i valori presenti ad aluA e ad aluB per ogni classe di istruzioni.', 'Indicare le destinazioni di valE.', 'Seguire una `pushq` dal banco dei registri alla memoria.'],
    esercizi: [
      { d: 'Per `popq %rax`, quali valori sono presenti ai due ingressi dell’ALU?', guida: 'Si scelga la risposta.', o: [
        { t: 'aluA = +8 e aluB = valB', ok: true, fb: 'L’ALU calcola la cima dopo il prelievo: il valore precedente di %rsp più 8.' },
        { t: 'aluA = −8 e aluB = valB', fb: 'La sottrazione di 8 riserva una cella, come in `pushq`. `popq` ne rilascia una.' },
        { t: 'aluA = valA e aluB = valB', fb: 'Due registri entrano nell’ALU per le operazioni aritmetiche. In questo caso occorre una costante.' }] },
      { d: 'SEQ esegue `pushq %rax` con %rsp = 0x300 e %rax = 0x2B. A quale indirizzo è scritto il valore 0x2B? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x310', giuste: ['0x2f8', '2f8', '2f8h'],
        ok: 'valE = 0x300 − 8 = 0x2F8, la nuova cima della pila.',
        diagnosi: [
          { se: ['0x300', '300', '300h'], msg: 'Questa è la cima precedente. `pushq` riserva una cella nuova, otto byte più in basso.' },
          { se: ['0x308', '308', '308h'], msg: 'La pila cresce verso gli indirizzi bassi: aluA vale −8.' },
          { se: ['0x2b', '2b', '2bh'], msg: 'Questo è il dato. La domanda riguarda l’indirizzo della cella in cui è scritto.' }
        ],
        altro: 'L’indirizzo è diverso. Si sottragga 8 al valore precedente di %rsp, in esadecimale.',
        indizi: ['aluB = valB = 0x300.', 'aluA = −8.', '0x300 − 8.'],
        svolgimento: ['valB = 0x300.', 'valE = 0x300 − 8 = 0x2F8.', 'M8[0x2F8] = 0x2B, e %rsp = 0x2F8.'] }
    ],
    sfida: ['cslez3_4_01_random_assembly', 'Ingressi dell’ALU e aggiornamento dello stack']
  }
});
