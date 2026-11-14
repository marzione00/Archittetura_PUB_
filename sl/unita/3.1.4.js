'use strict';
SL.registra('3.1.4', {
  titolo: 'Dai blocchi combinatori al controllo del processore',
  obiettivo: 'Obiettivo: descrivere un’ALU come un gruppo di circuiti che lavorano in parallelo seguiti da un multiplexer, e saprai calcolarne il risultato e il segnale di zero per ogni comando.',
  concetti: [['alu', 'Tutti i risultati, ogni volta'], ['mux', 'Il comando sceglie'], ['flag', 'Il segnale di zero']],
  filigrana: ['alu', 'mux', 'flag'],
  richiami: {
    carte: [
      { sim: 'mux', da: 'Dall’unità 3.1.2', t: 'Il multiplexer', d: 'Copia sull’uscita l’ingresso indicato dal segnale di selezione, e ignora gli altri.' },
      { sim: 'alu', da: 'Dall’unità 3.1.3', t: 'Il sommatore-sottrattore', d: 'Un solo circuito calcola A + B oppure A − B, secondo il filo SUB.' },
      { sim: 'byte', da: 'Dall’unità 1.5.3', t: 'Operazioni bit a bit', d: 'AND e XOR lavorano su ogni posizione per conto proprio, senza riporti fra una colonna e l’altra.' }
    ],
    domanda: { d: 'Prima di proseguire: quanto vale 0x0C AND 0x0A?', o: [
      { t: '0x08', ok: true, fb: 'In binario 1100 AND 1010 dà 1000: resta a 1 soltanto la posizione in cui entrambi valgono 1.' },
      { t: '0x0E', fb: 'Questo è il risultato della OR, che dà 1 dove almeno uno dei due bit vale 1.' },
      { t: '0x06', fb: 'Questo è il risultato della XOR, che dà 1 dove i due bit sono diversi.' }
    ] }
  },
  idea: {
    titolo: 'Calcolare tutto, scegliere alla fine',
    termini: ['segnale di controllo', 'unità di controllo'],
    testo: [
      'Un processore applica agli stessi due operandi operazioni diverse: una somma per ADD, una differenza per SUB e per CMP, una AND per TEST. Dare a ogni istruzione un circuito proprio, con i propri fili, sarebbe uno spreco. L’ALU riunisce le operazioni in un blocco solo, con due ingressi per gli operandi, un’uscita per il risultato e un ingresso di comando.',
      'All’interno i circuiti lavorano tutti insieme, ogni volta. Il sommatore-sottrattore produce la somma oppure la differenza, una fila di AND produce l’AND bit a bit, una fila di XOR produce la XOR. I risultati candidati arrivano a un multiplexer, e il comando decide quale raggiunge l’uscita. Gli altri sono stati calcolati lo stesso e vengono scartati. Poiché i rami lavorano in parallelo, calcolarli tutti richiede lo stesso tempo.',
      { fig: 'scena', w: 720, h: 190, titolo: 'L’interno di una ALU con quattro operazioni', nota: 'Per chiarezza il disegno tiene distinti il ramo della somma e quello della differenza.', els: [
        SL.el.box('a', 10, 20, 90, 56, 'A', '8 bit', 'on', { cls: 'stretta' }), SL.el.box('b', 10, 114, 90, 56, 'B', '8 bit', 'on', { cls: 'stretta' }),
        SL.el.box('c0', 180, 2, 170, 40, null, 'A + B', 'on', { cls: 'stretta' }), SL.el.box('c1', 180, 50, 170, 40, null, 'A − B', 'on', { cls: 'stretta' }), SL.el.box('c2', 180, 98, 170, 40, null, 'A AND B', 'on', { cls: 'stretta' }), SL.el.box('c3', 180, 146, 170, 40, null, 'A XOR B', 'on', { cls: 'stretta' }),
        SL.el.linea('l1', 100, 48, 180, 16, 'on'), SL.el.linea('l2', 100, 48, 180, 64, 'on'), SL.el.linea('l3', 100, 48, 180, 112, 'on'), SL.el.linea('l4', 100, 48, 180, 160, 'on'),
        SL.el.linea('k1', 100, 142, 180, 30, 'on'), SL.el.linea('k2', 100, 142, 180, 78, 'on'), SL.el.linea('k3', 100, 142, 180, 126, 'on'), SL.el.linea('k4', 100, 142, 180, 174, 'on'),
        SL.el.box('m', 430, 50, 110, 90, 'MUX', 'comando', 'att', { cls: 'stretta' }),
        SL.el.linea('m0', 350, 22, 430, 66, 'on'), SL.el.linea('m1', 350, 70, 430, 86, 'on'), SL.el.linea('m2', 350, 118, 430, 104, 'on'), SL.el.linea('m3', 350, 166, 430, 124, 'on'),
        SL.el.box('r', 610, 28, 100, 60, 'risultato', '8 bit', 'on', { cls: 'stretta' }), SL.el.box('z', 610, 110, 100, 60, 'ZF', '1 bit', 'on', { cls: 'stretta' }),
        SL.el.linea('o1', 540, 84, 610, 58, 'on'), SL.el.linea('o2', 660, 88, 660, 110, 'on')
      ] },
      'Il comando dell’ALU è un [[segnale di controllo]]: un gruppo di fili che dice a un blocco come trattare i dati, senza trasportarne. A produrre i segnali di controllo è l’[[unità di controllo]], il circuito che legge l’istruzione in esecuzione e ne ricava i comandi per tutti i blocchi del percorso dati: quale operazione chiedere all’ALU, quale ingresso far passare da ciascun multiplexer.',
      'Accanto al risultato l’ALU produce alcuni bit che lo descrivono. Il più semplice è il segnale di zero, che vale 1 quando tutti i bit del risultato scelto valgono 0. È il flag ZF del Modulo II, e si ottiene con una OR di tutti i bit seguita da una NOT.',
      'Il risultato ha la stessa larghezza degli operandi. Su un byte, somme e differenze si conservano modulo 256, come nelle unità precedenti: 0xFF + 0x01 lascia 0x00, e il segnale di zero vale 1 benché la somma vera sia 256.'
    ]
  },
  esperimento: {
    faremo: [
      'Un’ALU a otto bit con quattro operazioni riceve due byte e un comando. Sceglierai gli operandi e l’operazione.',
      'Vedremo nascere i quattro risultati candidati, poi la scelta del multiplexer e il segnale di zero. Dopo il caso proposto, cambia soltanto il comando e osserva che cosa resta uguale sulla scena.'
    ],
    vedrai: [
      ['input', 'Gli operandi', 'A sinistra: i byte A e B, in esadecimale e in binario.'],
      ['alu', 'I candidati', 'Al centro: i risultati dei quattro rami.'],
      ['mux', 'La scelta', 'A destra: il multiplexer, il risultato e ZF.']
    ]
  },
  lab: {
    titolo: 'Un comando, quattro candidati',
    scena: { w: 860, h: 310 },
    atti: ['Gli operandi', 'I quattro candidati', 'La scelta', 'Il segnale di zero'],
    controlli: [
      { id: 'f', tipo: 'scelta', eti: 'Comando', opzioni: [['add', 'somma'], ['sub', 'differenza'], ['and', 'AND'], ['xor', 'XOR']], valore: 'sub' },
      { id: 'a', tipo: 'scelta', eti: 'A', opzioni: [[0x03, '0x03'], [0x5A, '0x5A'], [0xF0, '0xF0'], [0xFF, '0xFF']], valore: 0x5A },
      { id: 'b', tipo: 'scelta', eti: 'B', opzioni: [[0x01, '0x01'], [0x5A, '0x5A'], [0x0F, '0x0F']], valore: 0x5A }
    ],
    nota: 'I passi sono sempre sette. I quattro candidati dipendono soltanto dagli operandi.',
    previsione: {
      domanda: (p) => 'Un’ALU a otto bit riceve A = ' + SL.unita314.H(p.a) + ' e B = ' + SL.unita314.H(p.b) + ' con il comando «' + SL.unita314.NOMI[p.f] + '». Quale byte esce?',
      opzioni: (p) => { const U = SL.unita314, c = U.candidati(p), v = Array.from(new Set([c.add, c.sub, c.and, c.xor])); if (v.length < 2) v.push((v[0] + 1) & 255); return v.sort((x, y) => x - y).map((x) => [x, U.H(x)]); }
    },
    confronto: (pred, esito, p) => { const U = SL.unita314, c = U.candidati(p), altro = ['add', 'sub', 'and', 'xor'].find((k) => c[k] === pred && k !== p.f); return 'La previsione indicava ' + U.H(pred) + '. Dall’ALU esce ' + U.H(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : altro ? 'Il byte ' + U.H(pred) + ' è il candidato del ramo «' + U.NOMI[altro] + '», che il multiplexer scarta.' : 'Il comando «' + U.NOMI[p.f] + '» fa passare il candidato ' + U.H(esito) + '.'); },
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita314, H = U.H, passi = [], c = U.candidati(p), ORD = ['add', 'sub', 'and', 'xor'], ET = { add: 'A + B', sub: 'A − B', and: 'A AND B', xor: 'A XOR B' };
      const YC = [8, 80, 152, 224], r = c[p.f], zf = r === 0 ? 1 : 0;
      const st = { vis: 0, scelto: false, zf: false };
      const quadro = (o) => {
        const els = [el.box('a', 20, 30, 150, 70, 'A', H(p.a), o.ing ? 'att' : 'on', { cls: 'stretta' }), el.nota('ab', 28, 106, X.bin8(p.a), 'mono minuta'),
          el.box('b', 20, 170, 150, 70, 'B', H(p.b), o.ing ? 'att' : 'on', { cls: 'stretta' }), el.nota('bb', 28, 246, X.bin8(p.b), 'mono minuta')];
        ORD.forEach((k, j) => {
          const vista = j < st.vis, sel = st.scelto && k === p.f;
          els.push(el.linea('la' + j, 170, 65, 250, YC[j] + 20, vista ? 'on' : ''), el.linea('lb' + j, 170, 205, 250, YC[j] + 42, vista ? 'on' : ''),
            el.box('c' + j, 250, YC[j], 210, 64, ET[k], vista ? H(c[k]) : '·', o.cand === j ? 'att' : !vista ? 'off' : st.scelto && !sel ? '' : 'on', { cls: 'stretta' }),
            el.linea('lm' + j, 460, YC[j] + 32, 550, 118 + j * 20, sel ? 'on' : ''));
        });
        els.push(el.box('m', 550, 96, 120, 104, 'MUX', U.NOMI[p.f], o.mux || o.cmd ? 'att' : 'on', { cls: 'stretta' }),
          el.linea('lr', 670, 148, 720, 110, st.scelto ? 'on' : ''),
          el.box('r', 720, 70, 126, 76, 'risultato', st.scelto ? H(r) : '·', o.mux ? 'att' : st.scelto ? 'on' : 'off', { cls: 'stretta' }),
          el.linea('lz', 783, 146, 783, 176, st.zf ? 'on' : ''),
          el.box('z', 720, 176, 126, 76, 'ZF', st.zf ? String(zf) : '·', o.zf ? 'att' : st.zf ? (zf ? 'on' : '') : 'off', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Comando', U.NOMI[p.f], 'a'], ['Risultato', st.scelto ? H(r) : '·', 'c'], ['ZF', st.zf ? String(zf) : '·']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ ing: true, cmd: true }, 0, 'Due byte e un comando', 'Agli ingressi arrivano A = ' + H(p.a) + ' e B = ' + H(p.b) + '. L’unità di controllo ha letto l’istruzione e chiede all’ALU l’operazione «' + U.NOMI[p.f] + '».',
        { chiedi: { d: 'I rami dell’ALU che questa operazione lascia inutilizzati restano fermi?', o: ['Sì', 'No'], g: 1, no: 'In un circuito combinatorio ogni ramo calcola a ogni cambio degli ingressi. Il comando agisce soltanto sul multiplexer finale.' } });
      const TESTI = {
        add: () => 'Il sommatore calcola ' + p.a + ' + ' + p.b + ' = ' + (p.a + p.b) + '. ' + (p.a + p.b > 255 ? 'Il totale supera 255, e negli otto bit resta ' + (p.a + p.b) + ' − 256 = ' + c.add + ', cioè ' + H(c.add) + '.' : 'Il totale sta in otto bit: ' + H(c.add) + '.'),
        sub: () => 'Lo stesso sommatore, con i bit di B invertiti e il riporto entrante a 1, calcola ' + p.a + ' − ' + p.b + ' = ' + (p.a - p.b) + '. ' + (p.a < p.b ? 'La differenza è negativa, e negli otto bit resta ' + (p.a - p.b) + ' + 256 = ' + c.sub + ', cioè ' + H(c.sub) + '.' : 'Negli otto bit resta ' + H(c.sub) + '.'),
        and: () => 'Otto porte AND lavorano ciascuna su una posizione: ' + X.bin8(p.a) + ' AND ' + X.bin8(p.b) + ' dà ' + X.bin8(c.and) + ', cioè ' + H(c.and) + '. Resta a 1 ogni posizione in cui entrambi i byte valgono 1.',
        xor: () => 'Otto porte XOR lavorano ciascuna su una posizione: ' + X.bin8(p.a) + ' XOR ' + X.bin8(p.b) + ' dà ' + X.bin8(c.xor) + ', cioè ' + H(c.xor) + '. Resta a 1 ogni posizione in cui i due byte sono diversi.'
      };
      const SEG = { add: ' + ', sub: ' − ', and: ' AND ', xor: ' XOR ' };
      ORD.forEach((k, j) => {
        st.vis = j + 1;
        const unici = Array.from(new Set(ORD.map((q) => c[q])));
        P({ cand: j }, 1, 'Il candidato ' + ET[k], TESTI[k](), { calc: H(p.a) + SEG[k] + H(p.b) + ' = ' + H(c[k]), chiedi: j === 3 && unici.length > 1 ? { d: 'Il comando chiede «' + U.NOMI[p.f] + '». Quale byte lascia passare il multiplexer?', o: unici.map(H), g: unici.indexOf(r), no: 'Passa il candidato del ramo ' + ET[p.f] + ', che vale ' + H(r) + '.' } : null });
        if (!passi[passi.length - 1].chiedi) delete passi[passi.length - 1].chiedi;
      });
      st.scelto = true;
      P({ mux: true }, 2, 'Il multiplexer sceglie', 'I quattro candidati sono pronti all’ingresso del multiplexer. Il comando «' + U.NOMI[p.f] + '» fa passare quello del ramo ' + ET[p.f] + ': in uscita arriva ' + H(r) + '. Gli altri tre restano sui loro fili, calcolati e inutilizzati.',
        { calc: 'risultato = ' + H(r), chiedi: { d: 'Il risultato vale ' + H(r) + ', in binario ' + X.bin8(r) + '. Quanto vale ZF?', o: ['0', '1'], g: zf, no: 'ZF vale 1 soltanto quando tutti gli otto bit del risultato valgono 0.' } });
      st.zf = true;
      P({ zf: true }, 3, 'Il segnale di zero', 'Una OR raccoglie gli otto bit del risultato e una NOT ne inverte l’uscita. ' + (zf ? 'I bit valgono tutti 0, quindi ZF vale 1.' : 'Almeno un bit vale 1, quindi ZF vale 0.') + ' Il segnale riguarda il solo byte scelto dal multiplexer' + (ORD.some((k) => (c[k] === 0) !== (r === 0)) ? ': fra i candidati scartati ce n’è almeno uno che avrebbe dato il valore opposto.' : '.'),
        { calc: 'ZF = ' + zf, esito: [H(r) + ' · ZF = ' + zf, 'si'] });
      return { passi, esito: r };
    }
  },
  bilancio: {
    regola: [
      'L’ALU calcola in parallelo tutti i risultati candidati, e un multiplexer porta in uscita quello indicato dal comando. Il comando è un segnale di controllo, che l’unità di controllo ricava dall’istruzione.',
      'Il risultato ha la larghezza degli operandi: su un byte, somme e differenze si conservano modulo 256. ZF vale 1 quando tutti i bit del risultato scelto valgono 0.'
    ],
    errori: [
      ['Pensare che l’ALU esegua soltanto l’operazione richiesta.', 'Tutti i rami calcolano a ogni cambio degli ingressi. Il comando decide soltanto quale risultato esce.'],
      ['Calcolare ZF su un candidato scartato.', 'ZF riguarda il byte che esce dal multiplexer. Con A uguale a B la differenza vale zero, la somma in genere no.'],
      ['Dimenticare la larghezza.', 'Su un byte 0xFF + 0x01 lascia 0x00, e ZF vale 1 benché la somma vera sia 256.']
    ],
    saFare: ['Descrivere l’interno di una ALU: rami in parallelo e multiplexer finale.', 'Calcolare il byte in uscita per ciascun comando.', 'Stabilire il valore di ZF a partire dal risultato scelto.'],
    esercizi: [
      { d: 'Un’ALU a otto bit riceve A = 0x3C e B = 0x0F con il comando AND. Quale byte esce? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1F', giuste: ['0x0c', '0c', '0ch', '0xc', 'c'],
        ok: 'In binario 0011 1100 AND 0000 1111 dà 0000 1100: restano i bit a 1 in entrambi.',
        diagnosi: [
          { se: ['0x3f', '3f', '3fh'], msg: 'Questo è il risultato della OR. La AND tiene a 1 soltanto le posizioni in cui entrambi i byte valgono 1.' },
          { se: ['0x33', '33', '33h'], msg: 'Questo è il risultato della XOR. La AND dà 1 dove entrambi i bit valgono 1.' },
          { se: ['0x4b', '4b', '4bh'], msg: 'Questo è il risultato della somma. Il comando chiede la AND bit a bit.' }
        ],
        altro: 'Il byte è diverso. Si scrivano i due operandi in binario e si tenga a 1 soltanto le posizioni in cui valgono 1 entrambi.',
        indizi: ['0x3C vale 0011 1100 e 0x0F vale 0000 1111.', 'La metà alta di 0x0F è tutta a 0, quindi la metà alta del risultato vale 0.', 'Nella metà bassa: 1100 AND 1111.'],
        svolgimento: ['0x3C = 0011 1100, 0x0F = 0000 1111.', 'AND posizione per posizione: 0000 1100.', 'Risultato: 0x0C.'] },
      { d: 'Un’ALU a otto bit riceve A = 0xFF e B = 0x01. Con quale comando il segnale ZF vale 1?', guida: 'Si scelga la risposta.', o: [
        { t: 'Somma', ok: true, fb: '255 + 1 = 256, e negli otto bit resta 0x00.' },
        { t: 'Differenza', fb: '255 − 1 = 254, cioè 0xFE, che ha sette bit a 1.' },
        { t: 'AND', fb: '0xFF AND 0x01 dà 0x01: il bit 0 vale 1 in entrambi i byte.' },
        { t: 'XOR', fb: '0xFF XOR 0x01 dà 0xFE: i due byte differiscono in sette posizioni.' }] }
    ],
    sfida: ['cslez3_1_04_random_assembly', 'Operazioni e segnali di uscita dell’ALU']
  }
});
SL.unita314 = {
  H: (v) => '0x' + SL.x86.esa2(v),
  NOMI: { add: 'somma', sub: 'differenza', and: 'AND', xor: 'XOR' },
  candidati: (p) => ({ add: (p.a + p.b) & 255, sub: (p.a - p.b) & 255, and: p.a & p.b, xor: p.a ^ p.b })
};
