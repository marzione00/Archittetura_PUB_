'use strict';
SL.registra('2.4.4', {
  titolo: 'Derivare le maschere di campo',
  obiettivo: 'Alla fine saprai ricavare la maschera di un campo dalla sua posizione e dalla sua larghezza, e usarla per leggere il valore del campo.',
  concetti: [['scudo', 'Posizione e larghezza'], ['bit', 'Una fila di uni'], ['lente', 'Isolare e riportare']],
  filigrana: ['scudo', 'bit', 'lente'],
  richiami: {
    carte: [
      { sim: 'bit', da: 'Dall’unità 2.4.2', t: 'La maschera di un bit', d: 'Il numero 1 scorso a sinistra di k posizioni ha acceso il solo bit k, e vale 2 elevato a k.' },
      { sim: 'porta', da: 'Dall’unità 2.4.3', t: 'Isolare e riunire', d: 'AND lascia passare i bit dove la maschera vale 1 e azzera gli altri. OR riunisce campi che occupano posizioni diverse.' },
      { sim: 'tabella', da: 'Dall’unità 1.3.4', t: 'Campo', d: 'Una parte di un formato, con una posizione e una larghezza stabilite.' }
    ],
    domanda: { d: 'Prima di proseguire: come si scrive in binario il numero 2 elevato a 3, diminuito di 1?', o: [
      { t: '111', ok: true, fb: 'Due elevato a 3 fa 8, in binario 1000. Togliendo 1 si ottiene 7, cioè tre bit a 1.' },
      { t: '1000', fb: 'Questo è 2 elevato a 3, cioè 8. Va ancora tolto 1.' },
      { t: '011', fb: 'Questo è il numero 3. Due elevato a 3 fa 8, e 8 − 1 fa 7.' }
    ] }
  },
  idea: {
    titolo: 'Due numeri bastano a descrivere un campo',
    termini: ['maschera di campo'],
    testo: [
      'I semibyte dell’unità precedente sono un caso particolare. Un formato può assegnare a un’informazione un gruppo di bit di qualunque larghezza, in qualunque punto della parola: tre bit per un numero di canale, cinque per il numero di un registro. Per descrivere un campo bastano due numeri: la posizione k del suo bit più basso e la larghezza w.',
      'Da questi due numeri si ricava la [[maschera di campo]], che ha w bit a 1 nelle posizioni del campo e zeri altrove. Il calcolo ha due passaggi. Il numero 2 elevato a w, in binario, è un 1 seguito da w zeri. Togliendo 1 si ottengono w bit a 1: con w = 3, da 1000 si passa a 111, cioè 7. Poi la fila di uni scorre a sinistra di k posizioni.',
      { fig: 'celle', titolo: 'La maschera di un campo di tre bit che comincia dal bit 4', nota: 'Tre uni, cioè 7, scorsi a sinistra di quattro posizioni: la maschera vale 0x70.', celle: [
        { so: 'bit 7', v: '0', st: '' }, { so: 'bit 6', v: '1', st: 'amb' }, { so: 'bit 5', v: '1', st: 'amb' }, { so: 'bit 4', v: '1', st: 'amb' }, { so: 'bit 3', v: '0', st: '' }, { so: 'bit 2', v: '0', st: '' }, { so: 'bit 1', v: '0', st: '' }, { so: 'bit 0', v: '0', st: '' }] },
      'Con la maschera il campo si legge in due istruzioni. AND isola i bit del campo e azzera gli altri. SHR li riporta alle unità, scorrendo a destra di k posizioni. Per la parola 0x1234, con k = 4 e w = 3, `and eax, 0x70` lascia 0x0030 e `shr eax, 4` lascia 3.',
      'Per scrivere nel campo le mosse sono tre. AND con la maschera rovesciata fa posto, azzerando il campo. Il nuovo valore scorre a sinistra di k posizioni. OR lo inserisce.',
      'Una maschera serve anche ad arrotondare. L’istruzione `and rax, -8` azzera i tre bit più bassi, perché −8 in complemento a due è una fila di uni che termina con 000. Il risultato è il più grande multiplo di 8 che non supera il numero di partenza. È lo stesso calcolo dei multipli incontrato con l’allineamento, nell’unità 2.3.4.'
    ]
  },
  esperimento: {
    faremo: [
      'EAX contiene una parola di sedici bit. Sceglierai la parola, la posizione k e la larghezza w di un campo.',
      'Ricaveremo la maschera in due passaggi, isoleremo il campo con AND e lo riporteremo alle unità con SHR. Dopo il caso proposto, sposta il campo al bit 8 senza cambiare la larghezza.'
    ],
    vedrai: [
      ['bit', 'Quattro file di sedici bit', 'Al centro, dall’alto: la parola, la maschera, il campo isolato e il campo riportato alle unità.'],
      ['scudo', 'La maschera', 'In basso a sinistra: i due passaggi con cui si ricava la maschera.'],
      ['lente', 'Il valore', 'In basso a destra: il campo isolato e il numero che contiene.']
    ]
  },
  lab: {
    titolo: 'Dalla posizione e dalla larghezza al valore del campo',
    scena: { w: 860, h: 362 },
    atti: ['La parola e il campo', 'La maschera', 'Isolare', 'Riportare alle unità', 'Il valore'],
    controlli: [
      { id: 'v', tipo: 'scelta', eti: 'Parola in EAX', opzioni: [[0x1234, '0x1234'], [0xBEEF, '0xBEEF'], [0xA5C3, '0xA5C3']], valore: 0x1234 },
      { id: 'k', tipo: 'scelta', eti: 'Posizione k', opzioni: [[0, '0'], [4, '4'], [5, '5'], [8, '8']], valore: 4 },
      { id: 'w', tipo: 'scelta', eti: 'Larghezza w', opzioni: [[2, '2 bit'], [3, '3 bit'], [4, '4 bit'], [6, '6 bit']], valore: 3 }
    ],
    nota: 'Sopra la prima fila sono riportate le posizioni dei bit, da 15 a 0.',
    previsione: {
      domanda: (p) => 'EAX contiene ' + SL.unita244.H4(p.v) + ', in binario ' + SL.unita244.B16(p.v) + '. Un campo largo ' + p.w + ' bit comincia dal bit ' + p.k + '. Quale numero contiene?',
      opzioni: (p) => { const m = Math.pow(2, p.w) - 1; return Array.from(new Set([(p.v >> p.k) & m, p.v & (m << p.k), (p.v >> (p.k + 1)) & m, p.v & m, (p.v >> p.k) & (2 * m + 1)])).slice(0, 4).sort((a, b) => a - b).map((x) => [x, String(x)]); }
    },
    confronto: (pred, esito, p) => { const U = SL.unita244, m = Math.pow(2, p.w) - 1; return 'Avevi previsto ' + pred + '. Il campo contiene ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il campo occupa i bit da ' + p.k + ' a ' + (p.k + p.w - 1) + '. La maschera vale ' + U.H4(m << p.k) + ', l’AND lascia ' + U.H4(p.v & (m << p.k)) + (p.k ? ', e lo scorrimento di ' + p.k + ' posizioni riporta il campo alle unità.' : ', già alle unità.')); },
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita244, passi = [], k = p.k, w = p.w, m0 = Math.pow(2, w) - 1, m = m0 << k, iso = p.v & m, val = iso >> k;
      const CAMPO = Array.from({ length: w }, (_, i) => k + i), BASSI = Array.from({ length: w }, (_, i) => i), TUTTI = Array.from({ length: 16 }, (_, i) => i);
      const FILA = { x: 170, passo: 40, tagli: [12, 8, 4], gap: 8, h: 38 };
      const st = { m: null, iso: null, val: null };
      const riga = (pre, valore, y, o) => (valore == null ? X.fila(pre, 0, 16, Object.assign({}, FILA, { y, indici: false, vuoto: TUTTI })) : X.fila(pre, valore, 16, Object.assign({}, FILA, { y, indici: false }, o)));
      const quadro = (o) => {
        const f = o.fase, els = [el.nota('n1', 20, 40, 'parola', 'mono'), el.nota('n2', 20, 104, 'maschera', 'mono'), el.nota('n3', 20, 168, 'isolato', 'mono'), el.nota('n4', 20, 232, 'alle unità', 'mono')];
        X.fila('v', p.v, 16, Object.assign({}, FILA, { y: 30, att: f === 0 || f === 3 ? CAMPO : [], on: CAMPO, st: f >= 3 ? '' : null })).forEach((e) => els.push(e));
        riga('m', st.m, 94, { att: f === 1 ? BASSI : f === 2 ? CAMPO : [] }).forEach((e) => els.push(e));
        riga('i', st.iso, 158, { att: f === 3 ? CAMPO : [] }).forEach((e) => els.push(e));
        riga('u', st.val, 222, { att: f >= 4 ? BASSI : [] }).forEach((e) => els.push(e));
        els.push(el.box('q1', 20, 290, 196, 60, w + ' bit a 1', f >= 1 ? '2 alla ' + w + ' − 1 = ' + m0 : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }),
          el.box('q2', 228, 290, 210, 60, 'al posto del campo', f >= 2 ? m0 + ' × 2 alla ' + k + ' = ' + U.H4(m) : '·', f === 2 ? 'att' : f > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('q3', 450, 290, 190, 60, 'campo isolato', f >= 3 ? U.H4(iso) : '·', f === 3 ? 'att' : f > 3 ? 'on' : '', { cls: 'stretta' }),
          el.box('q4', 652, 290, 188, 60, 'valore del campo', f >= 4 ? String(val) : '·', f >= 4 ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Maschera', st.m == null ? '·' : U.H4(st.m), 'a'], ['Campo isolato', st.iso == null ? '·' : U.H4(st.iso)], ['Valore', st.val == null ? '·' : String(st.val), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      const o0 = Array.from(new Set([Math.pow(2, w), m0, 2 * w])).sort((a, b) => a - b);
      P({ fase: 0 }, 0, 'La parola e il campo', 'EAX contiene ' + U.H4(p.v) + '. Il campo è largo ' + w + ' bit e comincia dal bit ' + k + ': occupa le posizioni da ' + k + ' a ' + (k + w - 1) + '. Gli altri ' + (16 - w) + ' bit della parola appartengono ad altre informazioni.',
        { chiedi: { d: 'Quanti numeri diversi può contenere un campo di ' + w + ' bit?', o: o0.map(String), g: o0.indexOf(Math.pow(2, w)), no: 'Con ' + w + ' bit si formano 2 elevato a ' + w + ' combinazioni, cioè ' + Math.pow(2, w) + ': i numeri da 0 a ' + m0 + '.' } });
      st.m = m0;
      const o1 = Array.from(new Set([m, m0, Math.pow(2, k), m * 2])).sort((a, b) => a - b);
      P({ fase: 1 }, 1, 'Tanti uni quanti sono i bit', 'Il numero 2 elevato a ' + w + ' fa ' + Math.pow(2, w) + ', in binario un 1 seguito da ' + w + ' zeri. Togliendo 1 restano ' + w + ' bit a 1: il numero ' + m0 + '. Per ora la fila di uni sta alle unità.',
        { calc: '2 alla ' + w + ' − 1 = ' + m0, chiedi: { d: 'La fila di ' + w + ' uni va spostata a sinistra di ' + k + (k === 1 ? ' posizione' : ' posizioni') + '. Quanto varrà la maschera?', o: o1.map(U.H4), g: o1.indexOf(m), no: k === 0 ? 'Il campo comincia dal bit 0, e la fila di uni è già al suo posto: ' + U.H4(m) + '.' : 'Ogni posizione raddoppia: ' + m0 + ' × ' + Math.pow(2, k) + ' = ' + m + ', in esadecimale ' + U.H4(m) + '.' } });
      st.m = m;
      P({ fase: 2 }, 1, k === 0 ? 'La maschera è già al suo posto' : 'La maschera al posto del campo', (k === 0 ? 'Il campo comincia dal bit 0, e la fila di uni si trova già sotto di esso.' : 'La fila di uni scorre a sinistra di ' + k + ' posizioni e si ferma sotto il campo.') + ' La maschera vale ' + U.H4(m) + ': ' + w + ' bit a 1 nelle posizioni da ' + k + ' a ' + (k + w - 1) + ', zeri altrove.', { calc: m0 + ' × 2 alla ' + k + ' = ' + U.H4(m) });
      st.iso = iso;
      const o3 = Array.from(new Set([k, w, k + w])).sort((a, b) => a - b);
      P({ fase: 3 }, 2, 'Il campo isolato', 'L’istruzione `and eax, ' + U.H4(m) + '` lascia passare i bit della parola che stanno sotto gli uni della maschera e azzera tutti gli altri. Il risultato, ' + U.H4(iso) + ', conserva il campo nella posizione in cui si trovava.',
        { calc: U.H4(p.v) + ' AND ' + U.H4(m) + ' = ' + U.H4(iso), chiedi: { d: 'Per leggere il campo come numero, di quante posizioni va fatto scorrere a destra?', o: o3.map(String), g: o3.indexOf(k), no: 'Il bit più basso del campo sta nella posizione ' + k + ' e deve arrivare nella posizione 0.' } });
      st.val = val;
      P({ fase: 4 }, 3, k === 0 ? 'Già alle unità' : 'Il campo riportato alle unità', (k === 0 ? 'Il campo comincia dal bit 0, e nessuno scorrimento è necessario.' : 'L’istruzione `shr eax, ' + k + '` fa scendere il campo di ' + k + ' posizioni. Il suo bit più basso arriva nella posizione 0.') + ' EAX contiene ' + val + '.', { calc: U.H4(iso) + (k ? ' ÷ 2 alla ' + k : '') + ' = ' + val });
      P({ fase: 5 }, 4, 'Il valore e il suo massimo', 'Il campo contiene ' + val + ', su un massimo di ' + m0 + '. ' + (iso !== val ? 'Prima dello scorrimento lo stesso gruppo di bit, letto nella sua posizione, valeva ' + iso + ': la posizione dà ai bit un peso che il campo, da solo, ignora.' : 'Il campo stava già alle unità, e il valore isolato coincide con il valore del campo.') + ' Per scrivervi un nuovo numero si userebbe la maschera rovesciata per fare posto, e poi OR.', { calc: 'campo = ' + val, esito: ['campo = ' + val, 'si'] });
      return { passi, esito: val };
    }
  },
  bilancio: {
    regola: [
      'La maschera di un campo largo w che comincia dal bit k si ottiene da 2 elevato a w, meno 1, scorso a sinistra di k posizioni.',
      'Per leggere il campo: AND con la maschera, poi SHR di k posizioni. Per scriverlo: AND con la maschera rovesciata, poi OR con il valore scorso a sinistra di k posizioni.'
    ],
    errori: [
      ['Dimenticare lo scorrimento finale.', 'La parola 0x1234, mascherata con 0x0070, dà 0x0030, cioè 48. Il campo vale 3: va riportato alle unità.'],
      ['Usare 2 elevato a w come maschera.', 'Due elevato a 3 è 1000, un bit solo. Servono tre uni: 2 elevato a 3, meno 1.'],
      ['Sbagliare l’ultimo bit del campo.', 'Un campo di 3 bit che comincia dal bit 4 occupa i bit 4, 5 e 6. L’ultimo è k + w − 1.']
    ],
    saFare: ['Ricavo la maschera di un campo da posizione e larghezza.', 'Leggo il valore di un campo con AND e SHR.', 'Descrivo le mosse per scrivere un valore in un campo.'],
    esercizi: [
      { d: 'Qual è la maschera di un campo largo 5 bit che comincia dal bit 3? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x3C', giuste: ['0xf8', 'f8', 'f8h', '0x00f8', '00f8'],
        ok: 'Cinque bit a 1 valgono 2 elevato a 5, meno 1, cioè 31. Scorsi di tre posizioni: 1111 1000, cioè 0xF8.',
        diagnosi: [
          { se: ['0x1f', '1f'], msg: 'Questa è la fila di cinque uni, ancora alle unità. Va fatta scorrere a sinistra di tre posizioni.' },
          { se: ['0x100', '100'], msg: 'Questo è 2 elevato a 5, scorso di tre posizioni: un bit solo. Prima dello scorrimento va tolto 1.' },
          { se: ['0x7c', '7c'], msg: 'Così la fila di uni comincia dal bit 2. Il campo comincia dal bit 3.' },
          { se: ['11111000', '1111 1000'], msg: 'I bit sono giusti. Scrivi le due cifre esadecimali: 1111 e 1000.' }
        ],
        altro: 'La maschera è diversa. Scrivi cinque bit a 1 e falli scorrere a sinistra di tre posizioni.',
        indizi: ['Cinque bit a 1: 2 elevato a 5, meno 1, cioè 31.', '31 in binario è 1 1111.', 'Scorso di tre posizioni: 1111 1000.'],
        svolgimento: ['2 elevato a 5 = 32. Meno 1: 31, in binario 1 1111.', 'Scorrimento a sinistra di 3: 1111 1000.', '1111 è F, 1000 è 8: la maschera vale 0xF8.'] },
      { d: 'EAX contiene 0xABCD. Quale coppia di istruzioni lascia in EAX il valore del campo di 4 bit che comincia dal bit 8?', guida: 'Scegli la risposta.', o: [
        { t: 'and eax, 0xF00 · shr eax, 8', ok: true, fb: 'La maschera 0xF00 isola i bit da 8 a 11, cioè la cifra B. Lo scorrimento di 8 posizioni la riporta alle unità: EAX vale 0xB.' },
        { t: 'and eax, 0xF0 · shr eax, 4', fb: 'La maschera 0xF0 isola i bit da 4 a 7, cioè la cifra C. Il campo richiesto comincia dal bit 8.' },
        { t: 'shr eax, 8 · and eax, 0xF00', fb: 'Dopo lo scorrimento il campo sta già alle unità, e la maschera 0xF00 guarda altri bit: il risultato è 0.' }] }
    ],
    sfida: ['cslez2_4_04_random_assembly_04', 'Estrarre, inserire e verificare campi']
  }
});
SL.unita244 = {
  H4: (v) => '0x' + v.toString(16).toUpperCase().padStart(4, '0'),
  B16: (v) => v.toString(2).padStart(16, '0').replace(/(....)(?=.)/g, '$1 ')
};
