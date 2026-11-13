'use strict';
SL.registra('3.3.5', {
  titolo: 'Tracce complete delle istruzioni',
  obiettivo: 'Alla fine saprai compilare la traccia completa di `call` e di `ret` attraverso le sei fasi, e dire quale valore finisce nel PC, quale in %rsp e quale in memoria.',
  concetti: [['tabella', 'Una riga per fase'], ['pila', 'Chiamare e tornare'], ['puntatore', 'Tre candidati per il PC']],
  filigrana: ['tabella', 'pila', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'strati', da: 'Dall’unità 3.3.3', t: 'Le sei fasi', d: 'Prelievo, decodifica, esecuzione, memoria, scrittura, aggiornamento del PC. I valori passano da una fase all’altra con nomi fissi.' },
      { sim: 'pila', da: 'Dall’unità 2.6.1', t: 'La chiamata e la pila', d: 'CALL toglie 8 al puntatore alla pila e scrive nella nuova cima l’indirizzo di ritorno. RET lo rilegge e restituisce gli 8 byte.' },
      { sim: 'puntatore', da: 'Dall’unità 3.3.2', t: 'Il successore valP', d: 'valP è il PC più la lunghezza dell’istruzione. Una `call` occupa 9 byte.' }
    ],
    domanda: { d: 'Prima di proseguire: una `call` di Y86-64 comincia all’indirizzo 0x40. Quanto vale il suo valP?', o: [
      { t: '0x49', ok: true, fb: 'La `call` occupa 9 byte: un byte di codice e otto di destinazione.' },
      { t: '0x4A', fb: 'Dieci byte è la lunghezza delle istruzioni con il byte dei registri e la costante. La `call` non ha il byte dei registri.' },
      { t: '0x48', fb: 'Agli otto byte della destinazione va aggiunto il byte di codice.' }
    ] }
  },
  idea: {
    titolo: 'Una riga per fase',
    termini: ['tabella delle fasi'],
    testo: [
      'Per descrivere un’istruzione in modo completo si compila la sua [[tabella delle fasi]]: una riga per fase, e in ogni riga i valori letti, calcolati e scritti. La tabella è la specifica da cui nascerà il circuito del capitolo 3.4, perché dice a ciascun blocco che cosa fare per quella classe di istruzioni.',
      'Le istruzioni che usano la pila impegnano tutte e sei le fasi. `call Dest` ha due compiti: salvare sulla pila l’indirizzo di ritorno e saltare alla procedura. L’indirizzo di ritorno è valP, il successore della `call`. La cima della pila sta nel registro %rsp. Nel seguito la scrittura M8[x] indica la parola di otto byte che comincia all’indirizzo x.',
      { fig: 'scena', w: 720, h: 232, titolo: 'La tabella delle fasi di call Dest', nota: 'L’ALU calcola la nuova cima, la memoria riceve l’indirizzo di ritorno, il PC riceve la destinazione.', els: [
        SL.el.nota('a1', 0, 12, 'prelievo', 'mono'), SL.el.box('b1', 180, 0, 540, 34, null, 'valC = Dest · valP = PC + 9', 'on', { cls: 'stretta' }),
        SL.el.nota('a2', 0, 50, 'decodifica', 'mono'), SL.el.box('b2', 180, 38, 540, 34, null, 'valB = %rsp', 'on', { cls: 'stretta' }),
        SL.el.nota('a3', 0, 88, 'esecuzione', 'mono'), SL.el.box('b3', 180, 76, 540, 34, null, 'valE = valB − 8', 'on', { cls: 'stretta' }),
        SL.el.nota('a4', 0, 126, 'memoria', 'mono'), SL.el.box('b4', 180, 114, 540, 34, null, 'M8[valE] = valP', 'att', { cls: 'stretta' }),
        SL.el.nota('a5', 0, 164, 'scrittura', 'mono'), SL.el.box('b5', 180, 152, 540, 34, null, '%rsp = valE', 'on', { cls: 'stretta' }),
        SL.el.nota('a6', 0, 202, 'PC', 'mono'), SL.el.box('b6', 180, 190, 540, 34, null, 'PC = valC', 'att', { cls: 'stretta' })
      ] },
      '`ret` percorre la strada inversa. Nella decodifica legge %rsp due volte, come valA e come valB. valA serve da indirizzo per la memoria, che vi legge l’indirizzo di ritorno, valM. valB va all’ALU, che calcola la cima dopo il ritorno, valE = valB + 8. La scrittura mette valE in %rsp, e il PC riceve valM.',
      'Il PC ha quindi tre sorgenti possibili. Per le istruzioni ordinarie riceve valP. Per `call`, e per i salti quando la condizione è vera, riceve valC. Per `ret` riceve valM. Nel circuito un multiplexer sceglierà fra le tre.'
    ]
  },
  esperimento: {
    faremo: [
      'Seguiremo una `call` e subito dopo il `ret` della procedura chiamata, sei fasi ciascuna. Sceglierai l’indirizzo della `call`, la destinazione e il valore iniziale di %rsp.',
      'Vedremo l’indirizzo di ritorno nascere come valP, scendere sulla pila e tornare nel PC come valM. Dopo il caso proposto cambia l’indirizzo della `call` e osserva quale valore viaggia.'
    ],
    vedrai: [
      ['strati', 'Le fasi', 'In alto: l’istruzione in corso e la fase raggiunta.'],
      ['tabella', 'I valori', 'Al centro: valC, valP, valA, valB, valE e valM.'],
      ['pila', 'Pila, %rsp e PC', 'In basso: le due celle della pila coinvolte, il puntatore alla pila e il contatore di programma.']
    ]
  },
  lab: {
    titolo: 'Una call e il suo ret',
    scena: { w: 860, h: 300 },
    atti: ['call: prelievo e decodifica', 'call: esecuzione e memoria', 'call: scrittura e PC', 'ret: prelievo e decodifica', 'ret: esecuzione e memoria', 'ret: scrittura e PC'],
    controlli: [
      { id: 'pc', tipo: 'scelta', eti: 'Indirizzo della call', opzioni: [[0x40, '0x40'], [0x12C, '0x12C']], valore: 0x40 },
      { id: 't', tipo: 'scelta', eti: 'Destinazione', opzioni: [[0x80, '0x80'], [0x200, '0x200']], valore: 0x80 },
      { id: 'sp', tipo: 'scelta', eti: '%rsp iniziale', opzioni: [[0xC0, '0xC0'], [0x400, '0x400']], valore: 0xC0 }
    ],
    nota: 'I passi sono sempre dodici: sei fasi per call e sei per ret.',
    previsione: {
      domanda: (p) => { const H = SL.y86.esa; return 'Una `call ' + H(p.t) + '` comincia all’indirizzo ' + H(p.pc) + ', con %rsp = ' + H(p.sp) + '. Quale valore scrive in memoria, e a quale indirizzo?'; },
      opzioni: (p) => { const H = SL.y86.esa; return [[p.pc + 9, p.sp - 8], [p.pc + 9, p.sp], [p.t, p.sp - 8], [p.pc, p.sp - 8]].map((x) => [H(x[0]) + '@' + H(x[1]), H(x[0]) + ' all’indirizzo ' + H(x[1])]); }
    },
    confronto: (pred, esito, p) => { const T = (k) => k.split('@')[0] + ' all’indirizzo ' + k.split('@')[1], H = SL.y86.esa; return 'Avevi previsto ' + T(pred) + '. La `call` scrive ' + T(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il valore salvato è valP = ' + H(p.pc) + ' + 9, l’istruzione da cui riprendere. La cella è quella appena riservata, valE = ' + H(p.sp) + ' − 8.'); },
    costruisci(p) {
      const el = SL.el, H = SL.y86.esa, passi = [], FASI = ['prelievo', 'decodifica', 'esecuzione', 'memoria', 'scrittura', 'PC'], valP = p.pc + 9, giu = p.sp - 8;
      const st = { ist: 'call', f: 0, v: {}, rsp: p.sp, pc: p.pc, cella: null };
      const quadro = (o) => {
        const els = [el.box('is', 20, 0, 150, 40, null, st.ist === 'call' ? 'call ' + H(p.t) : 'ret', 'on', { cls: 'stretta' })];
        FASI.forEach((n, k) => els.push(el.box('f' + k, 180 + k * 112, 0, 106, 40, null, n, k === st.f ? 'att' : k < st.f ? 'on' : '', { cls: 'stretta' })));
        ['valC', 'valP', 'valA', 'valB', 'valE', 'valM'].forEach((n, k) => els.push(el.box('v' + n, 20 + k * 138, 56, 130, 62, n, st.v[n] == null ? '·' : H(st.v[n]), (o.nuovi || []).includes(n) ? 'att' : st.v[n] == null ? '' : 'on', { cls: 'stretta' })));
        els.push(el.nota('tp', 20, 132, 'PILA', 'mono'),
          el.nota('a1', 20, 170, H(p.sp), 'mono minuta', st.rsp === p.sp ? 'att' : ''), el.cella('c1', 100, 158, 220, 42, 'dati del chiamante', 'off', { piccola: true, cls: 'minuta' }), el.nota('r1', 332, 170, st.rsp === p.sp ? '← %rsp' : '', 'mono minuta', 'att'),
          el.nota('a2', 20, 218, H(giu), 'mono minuta', st.rsp === giu ? 'att' : ''), el.cella('c2', 100, 206, 220, 42, st.cella == null ? '·' : H(st.cella), st.cella == null ? '' : o.cella ? 'att' : 'on', { piccola: true, cls: 'minuta' }), el.nota('r2', 332, 218, st.rsp === giu ? '← %rsp' : '', 'mono minuta', 'att'),
          el.box('rs', 470, 150, 180, 100, '%rsp', H(st.rsp), o.rsp ? 'att' : 'on', { cls: 'stretta' }),
          el.box('pc', 664, 150, 180, 100, 'PC', H(st.pc), o.pc ? 'att' : 'on', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Istruzione', st.ist, 'a'], ['%rsp', H(st.rsp)], ['PC', H(st.pc), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      // call
      st.v.valC = p.t; st.v.valP = valP;
      P({ nuovi: ['valC', 'valP'] }, 0, 'call: prelievo', 'Il PC vale ' + H(p.pc) + '. Il primo byte, 80, è il codice di `call`. Gli otto byte seguenti sono la destinazione: valC = ' + H(p.t) + '. L’istruzione occupa 9 byte, quindi valP = ' + H(p.pc) + ' + 9 = ' + H(valP) + '. È l’indirizzo da cui il programma dovrà riprendere al ritorno.',
        { calc: 'valP = ' + H(p.pc) + ' + 9 = ' + H(valP) });
      st.f = 1; st.v.valB = p.sp;
      P({ nuovi: ['valB'] }, 0, 'call: decodifica', 'Nel testo della `call` nessun registro è nominato, e tuttavia l’istruzione ne usa uno in modo implicito: %rsp, la cima della pila. Il banco dei registri lo legge, e valB = ' + H(p.sp) + '.',
        { calc: 'valB = %rsp = ' + H(p.sp), chiedi: { d: 'La pila cresce verso gli indirizzi bassi. In quale cella verrà scritto l’indirizzo di ritorno?', o: [H(giu), H(p.sp), H(p.sp + 8)], g: 0, no: 'Serve una cella nuova, otto byte sotto la cima attuale: ' + H(p.sp) + ' − 8 = ' + H(giu) + '.' } });
      st.f = 2; st.v.valE = giu;
      P({ nuovi: ['valE'] }, 1, 'call: esecuzione', 'L’ALU calcola la nuova cima della pila: valE = valB − 8 = ' + H(p.sp) + ' − 8 = ' + H(giu) + '. Per ora è soltanto un valore sui fili: %rsp contiene ancora ' + H(p.sp) + '.', { calc: 'valE = ' + H(p.sp) + ' − 8 = ' + H(giu) });
      st.f = 3; st.cella = valP;
      P({ cella: true, nuovi: ['valP', 'valE'] }, 1, 'call: memoria', 'La memoria riceve l’indirizzo valE e il dato valP: nella cella ' + H(giu) + ' viene scritto ' + H(valP) + ', l’indirizzo di ritorno.',
        { calc: 'M8[' + H(giu) + '] = ' + H(valP) });
      st.f = 4; st.rsp = giu;
      P({ rsp: true, nuovi: ['valE'] }, 2, 'call: scrittura', 'Il banco dei registri riceve valE con l’indirizzo di %rsp. La cima della pila passa da ' + H(p.sp) + ' a ' + H(giu) + ', e ora indica la cella che contiene l’indirizzo di ritorno.',
        { calc: '%rsp = ' + H(giu), chiedi: { d: 'Resta da aggiornare il PC. Quale valore riceverà?', o: ['valC, ' + H(p.t), 'valP, ' + H(valP)], g: 0, no: 'La `call` salta alla procedura, il cui indirizzo è valC. valP è stato messo da parte sulla pila.' } });
      st.f = 5; st.pc = p.t;
      P({ pc: true, nuovi: ['valC'] }, 2, 'call: aggiornamento del PC', 'Il PC riceve valC = ' + H(p.t) + ', e la prossima istruzione prelevata sarà la prima della procedura. In questo esperimento la procedura è fatta di un solo `ret`.', { calc: 'PC = valC = ' + H(p.t) });
      // ret
      st.ist = 'ret'; st.f = 0; st.v = { valP: p.t + 1 };
      P({ nuovi: ['valP'] }, 3, 'ret: prelievo', 'Il PC vale ' + H(p.t) + '. Il byte prelevato, 90, è il codice di `ret`, che occupa un solo byte: valP = ' + H(p.t + 1) + '. Questo valore resterà inutilizzato, perché `ret` prende altrove la propria destinazione.', { calc: 'valP = ' + H(p.t) + ' + 1 = ' + H(p.t + 1) });
      st.f = 1; st.v.valA = giu; st.v.valB = giu;
      P({ nuovi: ['valA', 'valB'] }, 3, 'ret: decodifica', 'Il banco dei registri legge %rsp su entrambe le porte: valA = valB = ' + H(giu) + '. I due valori sono uguali e avranno usi diversi. valA farà da indirizzo per la memoria, valB andrà all’ALU.',
        { calc: 'valA = valB = ' + H(giu), chiedi: { d: 'Da quale indirizzo la memoria leggerà l’indirizzo di ritorno?', o: [H(giu), H(p.sp)], g: 0, no: 'L’indirizzo di ritorno sta nella cima attuale della pila, ' + H(giu) + ', che è valA.' } });
      st.f = 2; st.v.valE = p.sp;
      P({ nuovi: ['valE'] }, 4, 'ret: esecuzione', 'L’ALU calcola la cima che la pila avrà dopo il ritorno: valE = valB + 8 = ' + H(giu) + ' + 8 = ' + H(p.sp) + '.', { calc: 'valE = ' + H(giu) + ' + 8 = ' + H(p.sp) });
      st.f = 3; st.v.valM = valP;
      P({ cella: true, nuovi: ['valM'] }, 4, 'ret: memoria', 'La memoria riceve l’indirizzo valA = ' + H(giu) + ' e consegna la parola che vi trova: valM = ' + H(valP) + '. È il valore che la `call` aveva scritto.',
        { calc: 'valM = M8[' + H(giu) + '] = ' + H(valP), chiedi: { d: 'Quale valore riceverà il PC?', o: ['valM, ' + H(valP), 'valP, ' + H(p.t + 1)], g: 0, no: '`ret` riprende dall’indirizzo letto dalla pila, valM. Il suo valP indicherebbe il byte che segue il `ret`.' } });
      st.f = 4; st.rsp = p.sp;
      P({ rsp: true, nuovi: ['valE'] }, 5, 'ret: scrittura', '%rsp riceve valE e torna a ' + H(p.sp) + ', il valore che aveva prima della chiamata. La cella ' + H(giu) + ' conserva ancora ' + H(valP) + '. Ormai sta sotto la cima, e verrà sovrascritta alla prossima occasione.', { calc: '%rsp = ' + H(p.sp) });
      st.f = 5; st.pc = valP;
      P({ pc: true, nuovi: ['valM'] }, 5, 'ret: aggiornamento del PC', 'Il PC riceve valM = ' + H(valP) + ', e il programma riprende dall’istruzione che segue la `call`. Lo stesso numero è stato valP nella `call`, contenuto di una cella della pila, e valM nel `ret`.',
        { calc: 'PC = valM = ' + H(valP), esito: ['PC = ' + H(valP) + ' · %rsp = ' + H(p.sp), 'si'] });
      return { passi, esito: H(valP) + '@' + H(giu) };
    }
  },
  bilancio: {
    regola: [
      '`call Dest` calcola valE = %rsp − 8, scrive valP in M8[valE], mette valE in %rsp e valC nel PC.',
      '`ret` legge valM da M8[%rsp], calcola valE = %rsp + 8, mette valE in %rsp e valM nel PC. Il PC riceve dunque valP, valC oppure valM, secondo l’istruzione.'
    ],
    errori: [
      ['Salvare sulla pila l’indirizzo della call.', 'Il valore salvato è valP, l’indirizzo dell’istruzione successiva. Tornando sulla `call` il programma la ripeterebbe senza fine.'],
      ['Scrivere nella vecchia cima.', 'La `call` scrive a valE = %rsp − 8, la cella appena riservata. La vecchia cima contiene dati del chiamante.'],
      ['Far leggere a ret dalla cima nuova.', '`ret` legge all’indirizzo valA, cioè %rsp prima dell’aggiornamento. valE serve soltanto ad aggiornare il registro.']
    ],
    saFare: ['Compilo la tabella delle fasi di `call` e di `ret`.', 'Dico quale valore va in memoria, quale in %rsp e quale nel PC.', 'Indico la sorgente del PC per ogni classe di istruzioni.'],
    esercizi: [
      { d: 'Una `call 0x200` comincia all’indirizzo 0x124, con %rsp = 0x800. Quale valore viene scritto in memoria? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x130', giuste: ['0x12d', '12d', '12dh'],
        ok: 'Viene scritto valP = 0x124 + 9 = 0x12D, l’indirizzo di ritorno.',
        diagnosi: [
          { se: ['0x124', '124', '124h'], msg: 'Questo è l’indirizzo della `call`. Viene salvato l’indirizzo dell’istruzione successiva, valP.' },
          { se: ['0x200', '200', '200h'], msg: 'Questa è la destinazione, che finisce nel PC. In memoria va l’indirizzo di ritorno.' },
          { se: ['0x12e', '12e', '12eh'], msg: 'La `call` occupa 9 byte: uno di codice e otto di destinazione.' },
          { se: ['0x7f8', '7f8', '7f8h'], msg: 'Questo è l’indirizzo della cella in cui si scrive. La domanda chiede il valore scritto.' }
        ],
        altro: 'Il valore è diverso. Calcola valP sommando all’indirizzo della `call` la sua lunghezza.',
        indizi: ['In memoria va l’indirizzo di ritorno, valP.', 'Una `call` occupa 9 byte.', '0x124 + 9.'],
        svolgimento: ['Lunghezza della `call`: 9 byte.', 'valP = 0x124 + 9 = 0x12D.', 'M8[0x7F8] = 0x12D.'] },
      { d: 'Per quale di queste istruzioni il PC riceve valM?', guida: 'Scegli la risposta.', o: [
        { t: 'ret', ok: true, fb: 'L’indirizzo di ritorno viene letto dalla pila nella fase di memoria, ed è valM.' },
        { t: 'call 0x200', fb: 'Per `call` il PC riceve la destinazione scritta nell’istruzione, valC.' },
        { t: 'mrmovq 8(%rbx), %rax', fb: '`mrmovq` legge una parola valM, e la deposita in un registro. Il PC riceve valP.' },
        { t: 'addq %rax, %rbx', fb: 'Un’operazione aritmetica prosegue con l’istruzione successiva: il PC riceve valP.' }] }
    ],
    sfida: ['cslez3_3_03_random_assembly', 'Registri sorgente e destinazione']
  }
});
