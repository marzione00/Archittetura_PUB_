'use strict';
SL.registra('2.3.6', {
  titolo: 'Codificare e riconoscere i calcoli di indirizzo',
  obiettivo: 'Obiettivo: separare i campi del byte SIB, ricostruire l’operando di memoria che descrive e compiere il percorso inverso.',
  concetti: [['byte', 'I byte di un’istruzione'], ['bit', 'I campi del byte SIB'], ['lente', 'Dai byte all’istruzione']],
  filigrana: ['byte', 'bit', 'lente'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 2.3.2', t: 'Indirizzo efficace', d: 'Base più indice per scala, più lo spiazzamento. La scala vale 1, 2, 4 oppure 8.' },
      { sim: 'hex', da: 'Dall’unità 1.2.2', t: 'Esadecimale e binario', d: 'Ogni cifra esadecimale corrisponde a quattro bit. La cifra B vale 1011, la cifra 8 vale 1000.' },
      { sim: 'tabella', da: 'Dall’unità 1.3.4', t: 'Campo', d: 'Una parte di un formato, con una posizione e una larghezza stabilite.' }
    ],
    domanda: { d: 'Prima di proseguire: come si scrive in binario il byte 0x8B?', o: [
      { t: '1000 1011', ok: true, fb: 'La cifra 8 vale 1000 e la cifra B, cioè undici, vale 1011.' },
      { t: '1011 1000', fb: 'Le due metà sono scambiate. La cifra di sinistra, 8, fornisce i quattro bit di sinistra.' },
      { t: '0100 1011', fb: 'La cifra 8 si scrive 1000. La configurazione 0100 vale 4.' }
    ] }
  },
  idea: {
    titolo: 'La struttura interna di un’istruzione',
    termini: ['codice operativo', 'modr/m', 'sib'],
    testo: [
      'Il processore legge byte. L’assembly è una notazione destinata alle persone, e ogni istruzione ha una traduzione esatta in codice macchina. Nell’unità 2.1.1 le istruzioni occupavano un numero variabile di byte. In questa unità se ne esamina il contenuto.',
      'Il primo byte è di norma il [[codice operativo]], che indica l’operazione da eseguire. Il byte 8B, per esempio, indica una MOV che carica un registro. Segue il byte [[modr/m|ModR/M]], che descrive gli operandi: tre dei suoi bit selezionano il registro, gli altri indicano la posizione del secondo operando.',
      'Quando l’operando di memoria impiega un indice con una scala, ModR/M rinvia a un terzo byte, il byte [[sib|SIB]]. Il nome deriva dalle iniziali inglesi di scala, indice e base. I suoi otto bit formano tre campi: due bit per la scala, tre per il registro indice, tre per il registro base.',
      { fig: 'celle', titolo: 'I tre campi del byte SIB', nota: 'L’esempio è il byte 0x8B. I confini dei campi cadono all’interno delle cifre esadecimali: la loro lettura richiede il passaggio dal binario.', celle: [
        { so: 'scala', v: '1', st: 'amb' }, { so: 'scala', v: '0', st: 'amb' }, { so: 'indice', v: '0', st: 'on' }, { so: 'indice', v: '0', st: 'on' }, { so: 'indice', v: '1', st: 'on' }, { so: 'base', v: '0', st: '' }, { so: 'base', v: '1', st: '' }, { so: 'base', v: '1', st: '' }] },
      'I registri sono indicati con un numero di tre bit: 000 per RAX, 001 per RCX, 010 per RDX, 011 per RBX, 110 per RSI, 111 per RDI. La scala è scritta come esponente di 2: i bit 00 valgono 1, i bit 01 valgono 2, i bit 10 valgono 4, i bit 11 valgono 8. Due bit sono sufficienti per quattro esponenti, e da ciò deriva l’elenco delle scale ammesse.',
      'Lo spiazzamento, quando è presente, segue il byte SIB e occupa uno oppure quattro byte, in ordine little-endian. Per questa ragione le istruzioni con uno spiazzamento grande sono più lunghe delle altre.',
      'La lettura di tali campi ha due impieghi. L’esame di un programma privo del sorgente parte dai byte e ricostruisce le istruzioni. I campi spiegano inoltre i limiti dell’assembly: una scala 3 è impossibile da scrivere perché nel byte manca il modo di rappresentarla.'
    ]
  },
  esperimento: {
    faremo: [
      'Un’istruzione di tre byte carica in EAX un dato dalla memoria. I controlli fissano la scala, il registro indice e il registro base, e il terzo byte cambia di conseguenza. Il registro base contiene 0x6000 e il registro indice contiene 3.',
      'Il percorso parte dai byte, come nel processore: il byte SIB è scritto in binario, i tre campi sono separati e l’istruzione è ricostruita. Dopo il caso proposto, è istruttivo cambiare soltanto la scala e individuare i bit che variano.'
    ],
    vedrai: [
      ['byte', 'I tre byte', 'In alto: codice operativo, ModR/M e SIB, con l’istruzione che si ricompone accanto.'],
      ['bit', 'Il byte SIB', 'Al centro: gli otto bit, divisi nei campi scala, indice e base.'],
      ['memory', 'L’indirizzo', 'In basso: il contenuto dei due registri e l’indirizzo che l’istruzione legge.']
    ]
  },
  lab: {
    titolo: 'Dai byte all’operando di memoria',
    scena: { w: 860, h: 352 },
    atti: ['Tre byte', 'Il byte SIB in bit', 'La scala', 'Indice e base', 'L’istruzione e l’indirizzo'],
    controlli: [
      { id: 's', tipo: 'scelta', eti: 'Scala', opzioni: [[1, '1'], [2, '2'], [4, '4'], [8, '8']], valore: 4 },
      { id: 'i', tipo: 'scelta', eti: 'Registro indice', opzioni: [['rcx', 'RCX'], ['rdx', 'RDX'], ['rsi', 'RSI']], valore: 'rcx' },
      { id: 'b', tipo: 'scelta', eti: 'Registro base', opzioni: [['rbx', 'RBX'], ['rax', 'RAX'], ['rdi', 'RDI']], valore: 'rbx' }
    ],
    nota: 'Il registro base contiene sempre 0x6000 e il registro indice 3. I codici dei registri sono riportati sotto i bit.',
    previsione: {
      domanda: (p) => { const U = SL.unita236, c = U.conto(p); return 'I tre byte di un’istruzione sono 8B 04 ' + c.HX + '. Il terzo è il byte SIB, che in binario si scrive ' + c.campi.join(' ') + '. I codici dei registri sono RAX 000, RCX 001, RDX 010, RBX 011, RSI 110, RDI 111. Quale istruzione rappresentano?'; },
      opzioni: (p) => { const U = SL.unita236, s2 = { 1: 2, 2: 4, 4: 2, 8: 4 }[p.s]; return [U.ist(p.b, p.i, p.s), U.ist(p.i, p.b, p.s), U.ist(p.b, p.i, s2), U.ist(p.i, p.b, s2)].sort(); }
    },
    confronto: (pred, esito, p) => { const c = SL.unita236.conto(p); return 'La previsione indicava `' + pred + '`. L’istruzione è `' + esito + '`. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'I due bit più alti, ' + c.campi[0] + ', sono l’esponente della scala: 2 elevato a ' + c.esp + ' fa ' + p.s + '. I tre bit centrali, ' + c.campi[1] + ', indicano l’indice ' + p.i.toUpperCase() + '. I tre bit più bassi, ' + c.campi[2] + ', indicano la base ' + p.b.toUpperCase() + '.'); },
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita236, c = U.conto(p), passi = [], I = p.i.toUpperCase(), B = p.b.toUpperCase();
      const A = '0x' + (0x6000 + 3 * p.s).toString(16).toUpperCase();
      const st = { sc: null, ix: null, bs: null };
      const quadro = (o) => {
        const f = o.fase, els = [
          el.box('b0', 20, 0, 150, 60, 'codice operativo', '8B', f === 0 ? 'att' : '', { cls: 'stretta' }),
          el.box('b1', 180, 0, 110, 60, 'ModR/M', '04', f === 0 ? 'att' : '', { cls: 'stretta' }),
          el.box('b2', 300, 0, 110, 60, 'SIB', c.HX, f >= 1 && f <= 4 ? 'att' : f === 0 ? 'on' : '', { cls: 'stretta' }),
          el.box('ist', 430, 0, 410, 60, 'istruzione ricostruita', 'mov eax, [' + (st.bs || '?') + ' + ' + (st.ix || '?') + '*' + (st.sc || '?') + ']', f === 5 ? 'att' : st.sc ? 'on' : '', { cls: 'stretta' }),
          el.nota('nb', 20, 82, 'IL BYTE SIB, UN BIT PER CASELLA', 'mono')];
        const acceso = f === 2 ? [7, 6] : f === 3 ? [5, 4, 3] : f === 4 ? [2, 1, 0] : [];
        if (f >= 1) X.bit('s', c.sib, { x: 20, y: 130, passo: 62, att: acceso }).forEach((e) => els.push(e));
        else for (let k = 0; k < 8; k++) els.push(el.cella('s' + k, 20 + k * 62, 130, 56, 50, '·', 'off', { piccola: true, so: 'bit ' + (7 - k) }));
        [['scala', 20, 138, 2], ['indice', 144, 324, 3], ['base', 330, 510, 4]].forEach((t) => {
          const s1 = f === t[3] ? 'att' : f > t[3] ? 'on' : '';
          els.push(el.linea('g' + t[0], t[1], 190, t[2], 190, s1), el.nota('n' + t[0], t[1], 196, t[0], 'mono', s1));
        });
        els.push(el.box('d1', 530, 82, 310, 54, 'scala · bit 7 e 6', st.sc ? c.campi[0] + ' → 2 alla ' + c.esp + ' = ' + p.s : '·', f === 2 ? 'att' : st.sc ? 'on' : '', { cls: 'stretta' }),
          el.box('d2', 530, 144, 310, 54, 'indice · bit 5, 4 e 3', st.ix ? c.campi[1] + ' → ' + I : '·', f === 3 ? 'att' : st.ix ? 'on' : '', { cls: 'stretta' }),
          el.box('d3', 530, 206, 310, 54, 'base · bit 2, 1 e 0', st.bs ? c.campi[2] + ' → ' + B : '·', f === 4 ? 'att' : st.bs ? 'on' : '', { cls: 'stretta' }),
          el.nota('cod', 20, 234, 'RAX 000 · RCX 001 · RDX 010 · RBX 011 · RSI 110 · RDI 111', 'mono minuta', f === 3 || f === 4 ? 'on' : ''),
          el.box('r1', 20, 284, 180, 58, 'base, ' + B, f === 5 ? '0x6000' : '·', f === 5 ? 'on' : '', { cls: 'stretta' }),
          el.box('r2', 212, 284, 160, 58, 'indice, ' + I, f === 5 ? '3' : '·', f === 5 ? 'on' : '', { cls: 'stretta' }),
          el.box('r3', 384, 284, 200, 58, 'indice × scala', f === 5 ? '3 × ' + p.s + ' = ' + 3 * p.s : '·', f === 5 ? 'on' : '', { cls: 'stretta' }),
          el.box('r4', 596, 284, 244, 58, 'indirizzo letto', f === 5 ? A : '·', f === 5 ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (f) => [['Byte SIB', '0x' + c.HX, 'a'], ['Campi', f >= 1 ? c.campi.join(' · ') : '·'], ['Indirizzo letto', f === 5 ? A : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.fase), els: quadro(o) }, extra));

      const bin = X.bin8(c.sib), inv = bin.slice(5) + ' ' + bin.slice(0, 4), rov = X.bin8(c.sib ^ 0xFF), o0 = Array.from(new Set([bin, inv, rov])).sort();
      P({ fase: 0 }, 0, 'Tre byte', 'L’istruzione occupa tre byte: 8B, 04 e ' + c.HX + '. Il primo è il codice operativo, e 8B indica una MOV che carica un registro dalla memoria. Il secondo, ModR/M, indica che il registro è EAX e che l’indirizzo è descritto dal byte successivo. Il terzo è il byte SIB.',
        { chiedi: { d: 'Il byte SIB vale 0x' + c.HX + '. Come si scrive in binario?', o: o0, g: o0.indexOf(bin), no: 'La cifra ' + c.HX[0] + ' vale ' + bin.slice(0, 4) + ' e la cifra ' + c.HX[1] + ' vale ' + bin.slice(5) + '.' } });
      P({ fase: 1 }, 1, 'Otto bit, tre campi', 'In binario il byte 0x' + c.HX + ' si scrive ' + bin + '. I campi hanno larghezze fisse: due bit per la scala, tre per l’indice, tre per la base. Con tale raggruppamento i bit diventano ' + c.campi.join(' ') + '. I confini dei campi cadono all’interno delle cifre esadecimali.',
        { calc: '0x' + c.HX + ' = ' + c.campi.join(' '), chiedi: { d: 'I due bit più alti valgono ' + c.campi[0] + ' e sono l’esponente della scala. Quanto vale la scala?', o: ['1', '2', '4', '8'], g: c.esp, no: 'I bit ' + c.campi[0] + ' valgono ' + c.esp + ' in decimale. La scala è 2 elevato a ' + c.esp + ', cioè ' + p.s + '.' } });
      st.sc = p.s;
      P({ fase: 2 }, 2, 'La scala', 'I bit 7 e 6 valgono ' + c.campi[0] + ', cioè ' + c.esp + ' in decimale. Essi sono un esponente: la scala è 2 elevato a ' + c.esp + ', quindi ' + p.s + '. Due bit sono sufficienti per quattro esponenti, da 0 a 3, e le scale possibili sono 1, 2, 4 e 8.',
        { calc: c.campi[0] + ' → 2 alla ' + c.esp + ' = ' + p.s, chiedi: { d: 'I tre bit centrali valgono ' + c.campi[1] + '. Quale registro ha la funzione di indice?', o: ['RCX', 'RDX', 'RSI'], g: ['rcx', 'rdx', 'rsi'].indexOf(p.i), no: 'Nella tabella dei codici, ' + c.campi[1] + ' è il numero di ' + I + '.' } });
      st.ix = p.i;
      P({ fase: 3 }, 3, 'Il registro indice', 'I bit 5, 4 e 3 valgono ' + c.campi[1] + '. Nella tabella dei codici tale numero indica ' + I + ': è il registro che sarà moltiplicato per la scala.',
        { calc: c.campi[1] + ' → ' + I, chiedi: { d: 'I tre bit più bassi valgono ' + c.campi[2] + '. Quale registro ha la funzione di base?', o: ['RAX', 'RBX', 'RDI'], g: ['rax', 'rbx', 'rdi'].indexOf(p.b), no: 'Nella tabella dei codici, ' + c.campi[2] + ' è il numero di ' + B + '.' } });
      st.bs = p.b;
      P({ fase: 4 }, 3, 'Il registro base', 'I bit 2, 1 e 0 valgono ' + c.campi[2] + ', il numero di ' + B + '. Con i tre campi decodificati l’operando di memoria è completo.', { calc: c.campi[2] + ' → ' + B });
      P({ fase: 5 }, 4, 'L’istruzione e l’indirizzo', 'I tre byte rappresentano `' + U.ist(p.b, p.i, p.s) + '`. Con ' + B + ' = 0x6000 e ' + I + ' = 3, l’indirizzo efficace è 0x6000 + 3 × ' + p.s + ' = ' + A + ', e da tale indirizzo l’istruzione legge quattro byte. Il processore compie questo percorso a ogni istruzione: legge i byte, separa i campi, calcola l’indirizzo.',
        { calc: '0x6000 + 3 × ' + p.s + ' = ' + A, esito: [U.ist(p.b, p.i, p.s), 'si'] });
      return { passi, esito: U.ist(p.b, p.i, p.s) };
    }
  },
  bilancio: {
    regola: [
      'Un’istruzione è una sequenza di byte: codice operativo, ModR/M e, quando occorrono, SIB e spiazzamento. Il byte SIB contiene tre campi: scala in due bit, indice in tre, base in tre.',
      'La scala è scritta come esponente di 2 e i registri come numeri di tre bit. La decodifica consiste nella scrittura del byte in binario e nella separazione dei campi.'
    ],
    errori: [
      ['Leggere i due bit della scala come la scala stessa.', 'I bit 10 valgono 2 come esponente. La scala è 2 elevato a 2, cioè 4.'],
      ['Scambiare l’indice con la base.', 'Il campo centrale è l’indice, quello più a destra è la base.'],
      ['Separare i campi sulle cifre esadecimali.', 'I campi sono larghi 2, 3 e 3 bit, e i loro confini cadono all’interno delle cifre. Occorre il passaggio dal binario.']
    ],
    saFare: ['Scrivere in binario un byte SIB e separarne i tre campi.', 'Ricostruire base, indice e scala dell’operando di memoria.', 'Comporre il byte SIB di un operando assegnato.'],
    esercizi: [
      { d: 'Quale byte SIB codifica l’operando `[rdi + rsi*8]`? I codici sono 110 per RSI e 111 per RDI. Si risponda in esadecimale.', segnaposto: 'Per esempio 0x8B', giuste: ['0xf7', 'f7', 'f7h'],
        ok: 'La scala 8 è 2 alla terza, e i bit della scala sono quindi 11. L’indice RSI è 110 e la base RDI è 111. In sequenza: 11 110 111, cioè 1111 0111.',
        diagnosi: [
          { se: ['0xfe', 'fe'], msg: 'Indice e base sono scambiati. Il campo centrale spetta all’indice, RSI, e quello a destra alla base, RDI.' },
          { se: ['0xb7', 'b7'], msg: 'I campi dei registri sono corretti. La scala 8 è 2 alla terza: i suoi due bit sono 11.' },
          { se: ['0x37', '37'], msg: 'I campi dei registri sono corretti. Mancano i due bit della scala: 8 è 2 alla terza, e quindi 11.' },
          { se: ['11110111', '11 110 111', '1111 0111'], msg: 'I bit sono corretti. Vanno raggruppati a quattro e scritti come due cifre esadecimali.' }
        ],
        altro: 'Il byte è diverso. Si scrivano in sequenza i due bit della scala, i tre dell’indice e i tre della base.',
        indizi: ['La scala 8 è 2 alla terza: i due bit valgono 11.', 'Indice RSI: 110. Base RDI: 111.', 'In sequenza 11 110 111. A gruppi di quattro: 1111 0111.'],
        svolgimento: ['Scala 8 = 2 alla 3: bit 11.', 'Indice RSI: 110. Base RDI: 111.', 'Il byte è 11 110 111 = 1111 0111.', '1111 è F, 0111 è 7: il byte vale 0xF7.'] },
      { d: 'Da che cosa dipende il fatto che l’indirizzo efficace ammetta soltanto le scale 1, 2, 4 e 8?', guida: 'Si scelga la risposta.', o: [
        { t: 'Dal byte SIB, che riserva alla scala due bit impiegati come esponente di 2.', ok: true, fb: 'Due bit rappresentano gli esponenti da 0 a 3, cioè le scale 1, 2, 4 e 8. Per altre scale manca una codifica.' },
        { t: 'Dalla larghezza dei registri, che raggiungono al massimo 8 byte.', fb: 'La coincidenza con le ampiezze degli accessi è voluta. Il limite deriva tuttavia dalla codifica: il campo della scala ha due bit.' },
        { t: 'Dall’istruzione LEA, che dispone soltanto di queste quattro moltiplicazioni.', fb: 'Il limite riguarda ogni operando di memoria, con qualunque istruzione. Esso deriva dal campo della scala nel byte SIB.' }] }
    ]
  }
});
SL.unita236 = (() => {
  const COD = { rax: 0, rcx: 1, rdx: 2, rbx: 3, rsi: 6, rdi: 7 }, B3 = (v) => v.toString(2).padStart(3, '0');
  const ist = (b, i, s) => 'mov eax, [' + b + ' + ' + i + '*' + s + ']';
  const conto = (p) => {
    const esp = [1, 2, 4, 8].indexOf(p.s), sib = (esp << 6) | (COD[p.i] << 3) | COD[p.b];
    return { esp, sib, HX: sib.toString(16).toUpperCase().padStart(2, '0'), campi: [esp.toString(2).padStart(2, '0'), B3(COD[p.i]), B3(COD[p.b])] };
  };
  return { COD, ist, conto };
})();
