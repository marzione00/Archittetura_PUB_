'use strict';
SL.registra('3.4.2', {
  titolo: 'Il percorso dati a ciclo singolo di SEQ',
  obiettivo: 'Alla fine saprai dire, per le principali istruzioni, che cosa arriva ai due ingressi dell’ALU di SEQ e dove va il suo risultato, e saprai seguire una `pushq` lungo il percorso dati.',
  concetti: [['alu', 'Che cosa entra nell’ALU'], ['mux', 'Un multiplexer per ingresso'], ['bus', 'Un risultato, due destinazioni']],
  filigrana: ['alu', 'bus', 'mux'],
  richiami: {
    carte: [
      { sim: 'cpu', da: 'Dall’unità 3.4.1', t: 'SEQ', d: 'Durante il ciclo i segnali attraversano la logica combinatoria. Al fronte gli elementi di stato catturano i valori nuovi.' },
      { sim: 'mux', da: 'Dall’unità 3.1.2', t: 'Il multiplexer', d: 'Copia sull’uscita uno dei suoi ingressi, scelto da un segnale di controllo.' },
      { sim: 'tabella', da: 'Dall’unità 3.3.5', t: 'La pila nelle sei fasi', d: 'Per `call` l’ALU calcola valE = valB − 8, la nuova cima della pila, a partire dal contenuto di %rsp.' }
    ],
    domanda: { d: 'Prima di proseguire: in `mrmovq 8(%rbx), %rax`, quali due valori somma l’ALU?', o: [
      { t: 'valB e valC', ok: true, fb: 'La base letta da %rbx e lo spostamento scritto nell’istruzione.' },
      { t: 'valA e valB', fb: 'Due registri si sommano in `addq`. Qui uno degli addendi è la costante dell’istruzione.' },
      { t: 'valC e valP', fb: 'valP serve al PC. L’indirizzo si ottiene dalla base e dallo spostamento.' }
    ] }
  },
  idea: {
    titolo: 'Un’ALU sola, molti mestieri',
    termini: ['alua', 'alub'],
    testo: [
      'In SEQ c’è una sola ALU, e ogni istruzione la usa a modo proprio. `addq` vi somma due registri. `mrmovq` vi calcola un indirizzo, base più spostamento. `pushq` e `call` vi tolgono 8 alla cima della pila, `popq` e `ret` vi aggiungono 8. Per servire tutte queste istruzioni, davanti a ciascun ingresso dell’ALU sta un multiplexer.',
      'Il primo ingresso si chiama [[alua|aluA]]. Può ricevere valA, per le operazioni fra registri, oppure valC, per gli indirizzi e per `irmovq`, oppure una delle costanti −8 e +8, per le istruzioni della pila. Il secondo ingresso si chiama [[alub|aluB]], e riceve valB, oppure 0 quando l’istruzione deve soltanto far passare un valore attraverso l’ALU.',
      { fig: 'scena', w: 720, h: 192, titolo: 'Gli ingressi dell’ALU, istruzione per istruzione', nota: 'L’unità di controllo sceglie la riga guardando icode.', els: [
        SL.el.nota('h0', 0, 0, 'ISTRUZIONE', 'mono'), SL.el.nota('h1', 300, 0, 'aluA', 'mono'), SL.el.nota('h2', 520, 0, 'aluB', 'mono'),
        SL.el.nota('a1', 0, 36, 'addq, subq, andq, xorq', 'mono minuta'), SL.el.box('b1', 300, 24, 200, 34, null, 'valA', 'on', { cls: 'stretta' }), SL.el.box('c1', 520, 24, 200, 34, null, 'valB', 'on', { cls: 'stretta' }),
        SL.el.nota('a2', 0, 76, 'mrmovq, rmmovq', 'mono minuta'), SL.el.box('b2', 300, 64, 200, 34, null, 'valC', '', { cls: 'stretta' }), SL.el.box('c2', 520, 64, 200, 34, null, 'valB', 'on', { cls: 'stretta' }),
        SL.el.nota('a3', 0, 116, 'pushq, call', 'mono minuta'), SL.el.box('b3', 300, 104, 200, 34, null, '−8', 'att', { cls: 'stretta' }), SL.el.box('c3', 520, 104, 200, 34, null, 'valB', 'on', { cls: 'stretta' }),
        SL.el.nota('a4', 0, 156, 'popq, ret', 'mono minuta'), SL.el.box('b4', 300, 144, 200, 34, null, '+8', 'att', { cls: 'stretta' }), SL.el.box('c4', 520, 144, 200, 34, null, 'valB', 'on', { cls: 'stretta' })
      ] },
      'Anche l’uscita dell’ALU, valE, ha più di una destinazione. Per `addq` va alla porta di scrittura del banco dei registri. Per `mrmovq` va all’ingresso degli indirizzi della memoria. Per `pushq` serve in entrambi i posti, perché la nuova cima della pila è l’indirizzo a cui scrivere e anche il valore da mettere in %rsp. Il filo si biforca, e i segnali di controllo decidono chi lo ascolta.',
      'In `pushq %rax` i due valori letti dal banco prendono quindi strade diverse. valB, il vecchio %rsp, entra nell’ALU insieme alla costante −8. valA, il contenuto di %rax, scavalca l’ALU e arriva all’ingresso dei dati della memoria. È il dato da depositare, e nessuno deve farci calcoli.'
    ]
  },
  esperimento: {
    faremo: [
      'SEQ esegue `pushq %rax`. Sceglierai la cima iniziale della pila e il valore di %rax.',
      'Seguiremo valB attraverso l’ALU e valA verso la memoria, fino al bivio in cui valE prende due strade. Dopo il caso proposto, cambia il valore di %rax: l’indirizzo della scrittura resterà lo stesso.'
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
    atti: ['Prelievo e decodifica', 'Gli ingressi dell’ALU', 'Il bivio', 'Tutto è pronto', 'Il fronte'],
    controlli: [
      { id: 'sp', tipo: 'scelta', eti: '%rsp iniziale', opzioni: [[0x70, '0x70'], [0x200, '0x200']], valore: 0x70 },
      { id: 'v', tipo: 'scelta', eti: '%rax', opzioni: [[0x2B, '0x2B'], [0x7, '0x7'], [0xFF, '0xFF']], valore: 0x2B }
    ],
    nota: 'I passi sono sempre sei. I byte dell’istruzione sono A0 0F.',
    previsione: {
      domanda: (p) => { const H = SL.y86.esa; return 'SEQ esegue `pushq %rax` con %rsp = ' + H(p.sp) + ' e %rax = ' + H(p.v) + '. In quale cella viene scritto ' + H(p.v) + ', e quanto vale %rsp alla fine?'; },
      opzioni: (p) => { const H = SL.y86.esa; return [[p.sp - 8, p.sp - 8], [p.sp, p.sp - 8], [p.sp - 8, p.sp], [p.sp, p.sp + 8]].map((x) => [H(x[0]) + ',' + H(x[1]), 'cella ' + H(x[0]) + ', %rsp = ' + H(x[1])]); }
    },
    confronto: (pred, esito, p) => { const T = (k) => 'cella ' + k.split(',')[0] + ' e %rsp = ' + k.split(',')[1], H = SL.y86.esa; return 'Avevi previsto ' + T(pred) + '. L’esito è ' + T(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'L’ALU calcola una volta sola valE = ' + H(p.sp) + ' − 8 = ' + H(p.sp - 8) + ', e quel valore serve sia da indirizzo per la memoria sia da nuovo contenuto di %rsp.'); },
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
      P({ letti: true }, 0, 'Due letture dal banco', 'SEQ preleva i byte A0 0F: icode A è `pushq`, rA è %rax e rB manca. Nella decodifica il banco legge due registri. valA è il contenuto di %rax, ' + H(p.v) + ', il dato da depositare. valB è il contenuto di %rsp, ' + H(p.sp) + ', che l’istruzione usa senza nominarlo.',
        { calc: 'valA = ' + H(p.v) + ' · valB = ' + H(p.sp), chiedi: { d: 'L’ALU deve calcolare la nuova cima della pila. Che cosa serve al suo ingresso aluA?', o: ['valA, il dato da depositare', 'valC, la costante dell’istruzione', 'La costante −8'], g: 2, no: 'La nuova cima è la vecchia meno 8. Il dato valA non entra nel calcolo, e `pushq` non contiene alcuna costante valC.' } });
      st.mux = true;
      P({ mux: true }, 1, 'I multiplexer scelgono', 'L’unità di controllo vede icode A e comanda i due multiplexer. Quello di aluB lascia passare valB, cioè ' + H(p.sp) + '. Quello di aluA lascia passare la costante −8. valA resta fuori dall’ALU.', { calc: 'aluA = −8 · aluB = ' + H(p.sp) });
      st.e = true;
      P({ alu: true }, 1, 'L’ALU calcola la nuova cima', 'L’ALU somma i due ingressi: valE = ' + H(p.sp) + ' + (−8) = ' + H(valE) + '. È l’indirizzo della cella che la pila sta per occupare.',
        { calc: 'valE = ' + H(p.sp) + ' − 8 = ' + H(valE), chiedi: { d: 'A chi serve valE in una `pushq`?', o: ['Soltanto alla memoria, come indirizzo', 'Soltanto al banco, per aggiornare %rsp', 'A entrambi'], g: 2, no: 'La nuova cima è l’indirizzo a cui scrivere il dato, e anche il valore che %rsp deve assumere.' } });
      st.biv = true;
      P({ biv: true }, 2, 'Il bivio', 'L’uscita dell’ALU si biforca. Un ramo porta valE all’ingresso degli indirizzi della memoria. L’altro lo porta alla porta di scrittura del banco, con l’indirizzo di %rsp. Intanto valA ha scavalcato l’ALU ed è arrivato all’ingresso dei dati della memoria.', { calc: 'indirizzo = ' + H(valE) + ' · dato = ' + H(p.v) });
      P({ biv: true }, 3, 'Due scritture in attesa', 'L’unità di controllo abilita due scritture: quella della memoria, che metterà ' + H(p.v) + ' nella cella ' + H(valE) + ', e quella del banco, che metterà ' + H(valE) + ' in %rsp. Fino al fronte, %rsp contiene ancora ' + H(p.sp) + ' e la cella contiene ciò che aveva.',
        { calc: 'M8[' + H(valE) + '] ← ' + H(p.v) + ' · %rsp ← ' + H(valE), chiedi: { d: 'Le due scritture avvengono in momenti diversi?', o: ['Sì, prima la memoria e poi il registro', 'No, allo stesso fronte'], g: 1, no: 'In SEQ tutti gli elementi di stato catturano i nuovi valori allo stesso fronte.' } });
      st.rsp = valE; st.cella = p.v; st.ck = 'sale ↑';
      P({ fronte: true, biv: true }, 4, 'Il fronte', 'Il clock sale. La memoria scrive ' + H(p.v) + ' nella cella ' + H(valE) + ', e nello stesso istante %rsp passa da ' + H(p.sp) + ' a ' + H(valE) + '. La pila ha una parola in più, e la sua cima indica proprio quella parola. Un solo calcolo dell’ALU è servito a due scopi.',
        { calc: 'M8[' + H(valE) + '] = ' + H(p.v) + ' · %rsp = ' + H(valE), esito: ['cella ' + H(valE) + ' · %rsp = ' + H(valE), 'si'] });
      return { passi, esito: H(valE) + ',' + H(valE) };
    }
  },
  bilancio: {
    regola: [
      'Davanti agli ingressi dell’ALU due multiplexer scelgono gli operandi: aluA riceve valA, valC oppure una costante −8 o +8, e aluB riceve valB oppure 0.',
      'Il risultato valE va dove l’istruzione lo richiede. In `pushq` si biforca: è l’indirizzo della scrittura in memoria e il nuovo valore di %rsp. Il dato valA raggiunge la memoria senza passare dall’ALU.'
    ],
    errori: [
      ['Mandare il dato all’ALU.', 'In `pushq` l’ALU lavora soltanto sul puntatore. Il dato valA va direttamente all’ingresso dei dati della memoria.'],
      ['Scrivere alla vecchia cima.', 'L’indirizzo della scrittura è valE = %rsp − 8. La vecchia cima contiene un dato ancora in uso.'],
      ['Calcolare due volte la nuova cima.', 'L’ALU è una sola e calcola una volta. Il suo risultato viene distribuito su due fili.']
    ],
    saFare: ['Dico che cosa arriva ad aluA e ad aluB per ogni classe di istruzioni.', 'Indico le destinazioni di valE.', 'Seguo una `pushq` dal banco dei registri alla memoria.'],
    esercizi: [
      { d: 'Per `popq %rax`, che cosa arriva ai due ingressi dell’ALU?', guida: 'Scegli la risposta.', o: [
        { t: 'aluA = +8 e aluB = valB', ok: true, fb: 'L’ALU calcola la cima dopo il prelievo: il vecchio %rsp più 8.' },
        { t: 'aluA = −8 e aluB = valB', fb: 'Togliere 8 serve a riservare una cella, come in `pushq`. `popq` ne restituisce una.' },
        { t: 'aluA = valA e aluB = valB', fb: 'Due registri entrano nell’ALU per le operazioni aritmetiche. Qui serve una costante.' }] },
      { d: 'SEQ esegue `pushq %rax` con %rsp = 0x300 e %rax = 0x2B. A quale indirizzo viene scritto il valore 0x2B? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x310', giuste: ['0x2f8', '2f8', '2f8h'],
        ok: 'valE = 0x300 − 8 = 0x2F8, la nuova cima della pila.',
        diagnosi: [
          { se: ['0x300', '300', '300h'], msg: 'Questa è la vecchia cima. `pushq` riserva una cella nuova, otto byte più in basso.' },
          { se: ['0x308', '308', '308h'], msg: 'La pila cresce verso gli indirizzi bassi: aluA vale −8.' },
          { se: ['0x2b', '2b', '2bh'], msg: 'Questo è il dato. La domanda chiede l’indirizzo della cella in cui viene scritto.' }
        ],
        altro: 'L’indirizzo è diverso. Togli 8 al vecchio %rsp, in esadecimale.',
        indizi: ['aluB = valB = 0x300.', 'aluA = −8.', '0x300 − 8.'],
        svolgimento: ['valB = 0x300.', 'valE = 0x300 − 8 = 0x2F8.', 'M8[0x2F8] = 0x2B, e %rsp = 0x2F8.'] }
    ],
    sfida: ['cslez3_4_01_random_assembly', 'Ingressi dell’ALU e aggiornamento dello stack']
  }
});
