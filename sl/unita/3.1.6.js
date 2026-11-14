'use strict';
SL.registra('3.1.6', {
  titolo: 'Implementazioni alternative e flag di stato',
  obiettivo: 'Obiettivo: spiegare come un sommatore può conoscere il riporto di un gruppo di bit senza attendere la propagazione, e saprai ricavare i quattro flag dai fili del sommatore.',
  concetti: [['alu', 'Generare oppure propagare'], ['clock', 'Un riporto pronto in anticipo'], ['flag', 'I flag come fili']],
  filigrana: ['alu', 'flag', 'clock'],
  richiami: {
    carte: [
      { sim: 'clock', da: 'Dall’unità 3.1.5', t: 'Il cammino critico del sommatore', d: 'Nel sommatore a propagazione il riporto attraversa le celle una dopo l’altra, e il ritardo cresce con la larghezza.' },
      { sim: 'alu', da: 'Dall’unità 3.1.3', t: 'Il riporto di un gruppo', d: 'Da quattro colonne esce un riporto, C4, quando la loro somma supera 15.' },
      { sim: 'flag', da: 'Dall’unità 2.2.1', t: 'CF e OF', d: 'CF segnala che il totale senza segno esce dalla parola. OF segnala che il totale con segno esce dal proprio intervallo.' }
    ],
    domanda: { d: 'Prima di proseguire: un gruppo di quattro bit somma 1111 e 0001, senza alcun riporto in arrivo. Dal gruppo esce un riporto?', o: [
      { t: 'Sì, perché la somma vale 16', ok: true, fb: 'Quindici più uno fa sedici, che supera il massimo di quattro bit.' },
      { t: 'No, perché una sola colonna contiene due 1', fb: 'Il riporto della colonna 0 trova un 1 in ciascuna delle colonne successive e le attraversa tutte.' },
      { t: 'Soltanto se arriva un riporto da destra', fb: 'La somma vale già 16 senza riporto in arrivo, quindi il riporto esce comunque.' }
    ] }
  },
  idea: {
    titolo: 'Conoscere il riporto prima che arrivi',
    termini: ['segnale di generazione', 'segnale di propagazione', 'anticipo del riporto'],
    testo: [
      'Nel sommatore a propagazione i bit alti restano in attesa. Finché il riporto dei bit bassi è in viaggio, le loro celle hanno davanti dati provvisori. È il cammino critico dell’unità 3.1.5.',
      'L’attesa si accorcia con un’osservazione. Dividiamo un byte in due gruppi di quattro bit e guardiamo il gruppo alto. I suoi due pezzi, uno per addendo, sono noti fin dall’inizio, e la loro somma dice in anticipo come il gruppo tratterà un riporto in arrivo. I casi sono tre.',
      'Se la somma dei due pezzi supera 15, dal gruppo esce un riporto in ogni caso. Il gruppo lo genera, e il suo [[segnale di generazione]], G, vale 1. Se la somma vale esattamente 15, dal gruppo esce un riporto soltanto quando ne arriva uno: il gruppo lo propaga, e il suo [[segnale di propagazione]], P, vale 1. Se la somma è minore di 15, un riporto in arrivo viene assorbito, e G e P valgono entrambi 0.',
      { fig: 'scena', w: 720, h: 104, titolo: 'Tre gruppi alti davanti a un riporto in arrivo', nota: 'In alto la somma dei due pezzi del gruppo, al centro ciò che il gruppo fa, sotto i suoi segnali.', els: [
        SL.el.box('f1', 10, 4, 220, 64, '7 + 0 = 7', 'assorbe', '', { cls: 'stretta' }), SL.el.nota('g1', 18, 78, 'G = 0 · P = 0', 'mono minuta'),
        SL.el.box('f2', 250, 4, 220, 64, '3 + 12 = 15', 'propaga', 'att', { cls: 'stretta' }), SL.el.nota('g2', 258, 78, 'G = 0 · P = 1', 'mono minuta', 'att'),
        SL.el.box('f3', 490, 4, 220, 64, '9 + 7 = 16', 'genera', 'on', { cls: 'stretta' }), SL.el.nota('g3', 498, 78, 'G = 1 · P = 0', 'mono minuta', 'on')
      ] },
      'Il riporto che esce dal gruppo alto vale quindi G OR (P AND C4), dove C4 è il riporto del gruppo basso. I segnali G e P si calcolano mentre il gruppo basso sta ancora lavorando. Quando C4 arriva, bastano una AND e una OR per avere il riporto finale. La tecnica si chiama [[anticipo del riporto]]: costa porte in più e accorcia il cammino critico, secondo lo scambio fra superficie e tempo dell’unità 3.1.5.',
      'Dai fili del sommatore si ricavano anche i quattro flag del Modulo II, ciascuno con poche porte. ZF è la NOT di una OR su tutti i bit del risultato. SF è una copia del bit più a sinistra. CF, nella somma, è il riporto che esce dall’ultima colonna. OF confronta gli ultimi due riporti, e vale 1 quando il riporto che entra nella colonna più a sinistra è diverso da quello che ne esce.',
      'CF e OF rispondono a domande diverse. CF dice se il totale senza segno ha bisogno di un nono bit. OF dice se il totale con segno esce dall’intervallo da −128 a 127. Il circuito li produce sempre entrambi, e sta al programma leggere quello che gli serve.'
    ]
  },
  esperimento: {
    faremo: [
      'Un sommatore a otto bit è diviso in due gruppi di quattro. Sceglierai i due byte da sommare.',
      'Vedremo il gruppo basso produrre il riporto C4, il gruppo alto dichiarare G e P, e il riporto finale nascere da quei tre fili. Alla fine leggeremo i quattro flag. Dopo il caso proposto, prova 0x3C + 0xC4 e poi 0x9A + 0x76.'
    ],
    vedrai: [
      ['bit', 'I due byte', 'In alto: i bit di A e di B, separati in gruppo alto e gruppo basso.'],
      ['alu', 'I riporti', 'Al centro: C4, che passa da un gruppo all’altro, e C8, che esce dal byte.'],
      ['flag', 'G, P e i flag', 'In basso: i segnali del gruppo alto, la formula del riporto e i quattro flag.']
    ]
  },
  lab: {
    titolo: 'Il riporto del gruppo alto',
    scena: { w: 860, h: 322 },
    atti: ['I due gruppi', 'Il gruppo basso', 'Il gruppo alto', 'Il riporto finale', 'I flag'],
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'A', opzioni: [[0x7F, '0x7F'], [0x3C, '0x3C'], [0xF8, '0xF8'], [0x9A, '0x9A']], valore: 0x7F },
      { id: 'b', tipo: 'scelta', eti: 'B', opzioni: [[0x01, '0x01'], [0xC4, '0xC4'], [0x08, '0x08'], [0x76, '0x76']], valore: 0x01 }
    ],
    nota: 'I passi sono sempre sei. I due byte decidono se il riporto finale viene generato, propagato oppure manca.',
    previsione: {
      domanda: (p) => 'Si sommano i byte A = ' + SL.unita316.H(p.a) + ' e B = ' + SL.unita316.H(p.b) + ', divisi in due gruppi di quattro bit. Dal gruppo alto esce un riporto?',
      opzioni: () => [['no', 'No'], ['gen', 'Sì, generato dal gruppo alto'], ['prop', 'Sì, propagato dal gruppo basso']]
    },
    confronto: (pred, esito, p) => { const c = SL.unita316.conto(p), N = { no: 'nessun riporto', gen: 'un riporto generato dal gruppo alto', prop: 'un riporto propagato dal gruppo basso' }; return 'La previsione indicava ' + N[pred] + '. L’esito è ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'I pezzi del gruppo alto valgono ' + c.ha + ' e ' + c.hb + ', e la loro somma è ' + (c.ha + c.hb) + (c.g ? ', oltre 15: il gruppo genera il riporto da solo.' : c.p ? ', esattamente 15: il gruppo propaga il riporto in arrivo, che vale ' + c.c4 + '.' : ', sotto 15: un riporto in arrivo viene assorbito.')); },
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita316, H = U.H, passi = [], c = U.conto(p), B4 = (v) => v.toString(2).padStart(4, '0');
      const FO = { x: 230, passo: 54, tagli: [4], gap: 70, h: 42, indici: false };
      const st = { basso: false, gp: false, fine: false, flag: false };
      const quadro = (o) => {
        const els = [el.nota('t1', 230, 0, 'GRUPPO ALTO', 'mono', o.alto ? 'att' : ''), el.nota('t2', 516, 0, 'GRUPPO BASSO', 'mono', o.basso ? 'att' : ''),
          el.nota('na', 20, 38, 'A = ' + H(p.a), 'mono'), el.nota('nb', 20, 92, 'B = ' + H(p.b), 'mono'), el.nota('nc', 20, 146, 'riporti', 'mono'), el.nota('ns', 20, 194, 'S' + (st.fine ? ' = ' + H(c.s) : ''), 'mono')];
        const att = o.alto ? [7, 6, 5, 4] : o.basso ? [3, 2, 1, 0] : [];
        X.fila('a', p.a, 8, Object.assign({ y: 26, att }, FO)).forEach((e) => els.push(e));
        X.fila('b', p.b, 8, Object.assign({ y: 80, att }, FO)).forEach((e) => els.push(e));
        X.fila('s', c.s, 8, Object.assign({ y: 182, vuoto: st.fine ? [] : st.basso ? [7, 6, 5, 4] : [7, 6, 5, 4, 3, 2, 1, 0], att: o.somma || [] }, FO)).forEach((e) => els.push(e));
        els.push(el.cella('c4', 458, 136, 46, 34, st.basso ? String(c.c4) : '·', !st.basso ? 'off' : o.c4 ? 'att' : c.c4 ? 'on' : 'zero', { cls: 'minuta', so: 'C4' }),
          el.cella('c8', 170, 136, 46, 34, st.fine ? String(c.c8) : '·', !st.fine ? 'off' : o.c8 ? 'att' : c.c8 ? 'on' : 'zero', { cls: 'minuta', so: 'C8' }));
        els.push(el.box('g', 20, 240, 96, 72, 'G', st.gp ? String(c.g) : '·', o.gp ? 'att' : !st.gp ? 'off' : c.g ? 'on' : '', { cls: 'stretta' }),
          el.box('pp', 126, 240, 96, 72, 'P', st.gp ? String(c.p) : '·', o.gp ? 'att' : !st.gp ? 'off' : c.p ? 'on' : '', { cls: 'stretta' }),
          el.box('f', 232, 240, 262, 72, 'G OR (P AND C4)', st.fine ? String(c.c8) : '·', o.c8 ? 'att' : !st.fine ? 'off' : c.c8 ? 'on' : '', { cls: 'stretta' }));
        X.flag('fl', st.flag ? { ZF: c.zf, SF: c.sf, CF: c.c8, OF: c.of } : { ZF: null, SF: null, CF: null, OF: null }, { x: 510, y: 240, passo: 86, h: 72, att: o.flag ? ['ZF', 'SF', 'CF', 'OF'] : [] }).forEach((e) => els.push(e));
        return els;
      };
      const hud = () => [['A + B', H(p.a) + ' + ' + H(p.b), 'a'], ['G · P', st.gp ? c.g + ' · ' + c.p : '·'], ['Riporto finale', st.fine ? String(c.c8) : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Un byte, due gruppi', 'A vale ' + H(p.a) + ' e B vale ' + H(p.b) + '. Ogni byte è diviso in un gruppo alto e un gruppo basso di quattro bit. Per A i pezzi sono ' + B4(c.ha) + ' e ' + B4(c.la) + ', per B sono ' + B4(c.hb) + ' e ' + B4(c.lb) + '.',
        { chiedi: { d: 'Il gruppo basso somma ' + c.la + ' e ' + c.lb + ', e il totale è ' + (c.la + c.lb) + '. Esce un riporto verso il gruppo alto?', o: ['Sì', 'No'], g: c.c4 ? 0 : 1, no: 'Da quattro bit esce un riporto quando la somma supera 15. Qui vale ' + (c.la + c.lb) + '.' } });
      st.basso = true;
      P({ basso: true, c4: true, somma: [3, 2, 1, 0] }, 1, 'Il gruppo basso', 'Il gruppo basso somma ' + B4(c.la) + ' e ' + B4(c.lb) + ', cioè ' + c.la + ' + ' + c.lb + ' = ' + (c.la + c.lb) + '. ' + (c.c4 ? 'Il totale supera 15: nei quattro bit resta ' + (c.s & 15) + ' e il riporto C4 vale 1.' : 'Il totale sta in quattro bit, e il riporto C4 vale 0.') + ' In un sommatore a propagazione questo riporto arriva dopo avere attraversato quattro celle.',
        { calc: c.la + ' + ' + c.lb + ' = ' + (c.la + c.lb) + ' → C4 = ' + c.c4, chiedi: { d: 'I pezzi del gruppo alto valgono ' + c.ha + ' e ' + c.hb + ', e la loro somma è ' + (c.ha + c.hb) + '. Che cosa fa il gruppo alto di un riporto in arrivo?', o: ['Lo assorbe', 'Lo propaga', 'Ne produce uno in ogni caso'], g: c.g ? 2 : c.p ? 1 : 0, no: 'Sotto 15 il gruppo assorbe, a 15 esatti propaga, sopra 15 genera. Qui la somma vale ' + (c.ha + c.hb) + '.' } });
      st.gp = true;
      P({ alto: true, gp: true }, 2, 'Il gruppo alto dichiara G e P', 'Mentre il gruppo basso lavorava, il gruppo alto ha guardato i propri pezzi: ' + c.ha + ' + ' + c.hb + ' = ' + (c.ha + c.hb) + '. ' + (c.g ? 'La somma supera 15, quindi il gruppo genera un riporto qualunque cosa arrivi da destra: G = 1.' : c.p ? 'La somma vale esattamente 15: in ogni colonna i due bit sono diversi, e un riporto in arrivo le attraverserebbe tutte. P = 1.' : 'La somma è minore di 15: anche aggiungendo un riporto in arrivo, il gruppo resta entro i quattro bit. G = 0 e P = 0.') + ' Per saperlo è bastato leggere i bit del gruppo.',
        { calc: 'G = ' + c.g + ' · P = ' + c.p, chiedi: { d: 'Con G = ' + c.g + ', P = ' + c.p + ' e C4 = ' + c.c4 + ', quanto vale G OR (P AND C4)?', o: ['0', '1'], g: c.c8, no: 'P AND C4 vale ' + (c.p & c.c4) + ', e la OR con G = ' + c.g + ' dà ' + c.c8 + '.' } });
      st.fine = true;
      P({ c8: true, somma: [7, 6, 5, 4] }, 3, 'Il riporto finale', 'Il riporto che esce dal byte vale G OR (P AND C4) = ' + c.g + ' OR (' + c.p + ' AND ' + c.c4 + ') = ' + c.c8 + '. ' + (c.g ? 'Lo ha generato il gruppo alto.' : c.c8 ? 'È il riporto del gruppo basso, che il gruppo alto ha lasciato passare.' : c.c4 ? 'Il riporto del gruppo basso si è fermato dentro il gruppo alto.' : 'Nessun riporto esce dal byte.') + ' Intanto il gruppo alto completa i propri bit: ' + c.ha + ' + ' + c.hb + ' + ' + c.c4 + ' lascia ' + B4(c.s >> 4) + '. Il risultato è ' + H(c.s) + '.',
        { calc: c.g + ' OR (' + c.p + ' AND ' + c.c4 + ') = ' + c.c8 });
      st.flag = true;
      P({ flag: true }, 4, 'I quattro flag', 'ZF vale ' + c.zf + (c.zf ? ', perché tutti i bit del risultato valgono 0.' : ', perché almeno un bit del risultato vale 1.') + ' SF copia il bit più a sinistra, ' + c.sf + '. CF copia il riporto finale, ' + c.c8 + '. Per OF servono gli ultimi due riporti: nella colonna 7 ne entra ' + c.c7 + ' e ne esce ' + c.c8 + (c.of ? '. Sono diversi, quindi OF vale 1.' : '. Sono uguali, quindi OF vale 0.'),
        { calc: 'ZF = ' + c.zf + ' · SF = ' + c.sf + ' · CF = ' + c.c8 + ' · OF = ' + c.of });
      P({ flag: true, c8: true }, 4, 'Due letture dello stesso byte', 'Senza segno la somma vera è ' + p.a + ' + ' + p.b + ' = ' + (p.a + p.b) + (c.c8 ? ', che chiede un nono bit: CF = 1.' : ', che sta in otto bit: CF = 0.') + ' Con segno è ' + X.num(c.sa) + ' + ' + (c.sb < 0 ? '(' + X.num(c.sb) + ')' : X.num(c.sb)) + ' = ' + X.num(c.sa + c.sb) + (c.of ? ', fuori dall’intervallo da −128 a 127: OF = 1.' : ', dentro l’intervallo da −128 a 127: OF = 0.') + ' Il circuito ha prodotto i due flag con le stesse porte, senza sapere quale lettura interessa al programma.',
        { calc: 'CF = ' + c.c8 + ' · OF = ' + c.of, esito: [H(c.s) + ' · CF = ' + c.c8 + ' · OF = ' + c.of, 'si'] });
      return { passi, esito: c.g ? 'gen' : c.c8 ? 'prop' : 'no' };
    }
  },
  bilancio: {
    regola: [
      'Un gruppo di quattro bit genera un riporto quando la somma dei suoi due pezzi supera 15, e lo propaga quando vale esattamente 15. Il riporto in uscita vale G OR (P AND riporto in arrivo).',
      'I flag sono fili del sommatore: ZF dalla OR di tutti i bit, SF dal bit più a sinistra, CF dal riporto finale, OF dal confronto fra gli ultimi due riporti.'
    ],
    errori: [
      ['Credere che G e P dipendano dal riporto in arrivo.', 'Si calcolano dai soli bit del gruppo, ed è per questo che sono pronti in anticipo.'],
      ['Chiamare propagazione ogni somma grande.', 'Il gruppo propaga soltanto con una somma di 15 esatti. Con 14 assorbe il riporto in arrivo, con 16 ne genera uno comunque.'],
      ['Confondere CF e OF.', 'La somma 127 + 1 lascia CF = 0 e OF = 1: il totale 128 sta in otto bit senza segno ed esce dall’intervallo con segno.']
    ],
    saFare: ['Calcolare G e P di un gruppo dai suoi bit.', 'Ricavare il riporto in uscita da G, P e dal riporto in arrivo.', 'Indicare da quali fili del sommatore nasce ciascun flag.'],
    esercizi: [
      { d: 'Il gruppo alto di un sommatore riceve i pezzi 1010 e 0101. Quanto valgono i suoi segnali G e P?', guida: 'Si scelga la risposta.', o: [
        { t: 'G = 0 e P = 1', ok: true, fb: 'Dieci più cinque fa 15 esatti: in ogni colonna i due bit sono diversi, e il gruppo propaga.' },
        { t: 'G = 1 e P = 0', fb: 'Il gruppo genera quando la somma supera 15. Qui vale 15 esatti.' },
        { t: 'G = 0 e P = 0', fb: 'Sarebbe così con una somma minore di 15. Qui la somma vale 15.' }] },
      { d: 'Su otto bit si calcola 0x50 + 0x30, cioè 80 + 48. Quali flag valgono 1 fra CF e OF?', guida: 'Si scelga la risposta.', o: [
        { t: 'Soltanto OF', ok: true, fb: 'Il totale 128 sta in otto bit, quindi CF = 0. Con segno, 128 supera 127, quindi OF = 1.' },
        { t: 'Soltanto CF', fb: 'CF chiede un totale senza segno oltre 255. Qui il totale è 128.' },
        { t: 'Nessuno dei due', fb: 'Con segno il massimo è 127, e il totale 128 lo supera di uno.' },
        { t: 'CF e OF', fb: 'Il totale senza segno, 128, sta in otto bit: CF vale 0.' }] }
    ]
  }
});
SL.unita316 = {
  H: (v) => '0x' + SL.x86.esa2(v),
  conto: (p) => {
    const la = p.a & 15, lb = p.b & 15, ha = p.a >> 4, hb = p.b >> 4, c4 = la + lb > 15 ? 1 : 0, g = ha + hb > 15 ? 1 : 0, pp = ha + hb === 15 ? 1 : 0, c8 = g | (pp & c4), s = (p.a + p.b) & 255;
    const c7 = ((p.a & 127) + (p.b & 127)) >> 7, sa = SL.x86.conSegno(p.a, 8), sb = SL.x86.conSegno(p.b, 8);
    return { la, lb, ha, hb, c4, g, p: pp, c8, s, c7, of: c7 ^ c8, zf: s === 0 ? 1 : 0, sf: s >> 7, sa, sb };
  }
};
