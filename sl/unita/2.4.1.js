'use strict';
SL.registra('2.4.1', {
  titolo: 'Maschere e scorrimenti come operazioni macchina',
  obiettivo: 'Obiettivo: prevedere il risultato e il flag CF di uno scorrimento, e scegliere fra SHR e SAR secondo il tipo del dato.',
  concetti: [['porta', 'Bit a bit'], ['operation', 'Scorrimenti'], ['segno', 'Zeri oppure segno']],
  filigrana: ['operation', 'bit', 'segno'],
  richiami: {
    carte: [
      { sim: 'porta', da: 'Dall’unità 1.5.3', t: 'Operatori bit a bit', d: 'AND, OR, XOR e NOT operano colonna per colonna, senza riporti. Una maschera indica con i suoi bit a 1 le posizioni interessate.' },
      { sim: 'segno', da: 'Dall’unità 1.4.1', t: 'Complemento a due', d: 'Il bit più a sinistra è il bit di segno. Un byte che lo ha a 1 vale il proprio valore senza segno meno 256.' },
      { sim: 'flag', da: 'Dall’unità 2.1.1', t: 'Il flag CF', d: 'Un bit del registro dei flag in cui alcune istruzioni lasciano il bit uscito dal risultato.' }
    ],
    domanda: { d: 'Prima di proseguire: il byte 1111 1101 vale 253 senza segno. Quanto vale letto in complemento a due?', o: [
      { t: '−3', ok: true, fb: 'Il bit di segno vale 1, e al valore senza segno si sottrae quindi 256: 253 − 256 = −3.' },
      { t: '−125', fb: 'In tal modo il bit di segno è letto come un segno meno anteposto agli altri sette bit. In complemento a due si sottrae 256 al valore senza segno.' },
      { t: '253', fb: 'Il valore indicato è la lettura senza segno. Con il bit più a sinistra a 1, la lettura con segno dà un numero negativo.' }
    ] }
  },
  idea: {
    titolo: 'Lo spostamento dei bit',
    termini: ['shl', 'shr', 'sar'],
    testo: [
      'Le operazioni bit a bit dell’unità 1.5.3 esistono anche come istruzioni del processore: AND, OR, XOR e NOT. Esse operano su registri interi, una colonna alla volta, e scrivono il risultato nella destinazione. Un loro impiego ricorre in quasi ogni programma compilato: `xor eax, eax` azzera EAX, poiché ogni bit confrontato con sé stesso dà 0.',
      'Un’altra classe di istruzioni sposta i bit. Lo scorrimento a sinistra, [[shl|SHL]], porta ogni bit verso posizioni di peso maggiore. A destra entrano zeri, e i bit che superano il bordo sinistro escono. Ogni posizione di scorrimento raddoppia il valore, così come l’aggiunta di uno zero in coda a un numero decimale lo moltiplica per dieci.',
      'Lo scorrimento a destra dimezza. In questo caso le posizioni si liberano a sinistra, dove si trova il bit di segno, e le istruzioni sono due. [[shr|SHR]] fa entrare zeri: è lo scorrimento adatto ai numeri senza segno. [[sar|SAR]] fa entrare copie del bit di segno: è lo scorrimento adatto ai numeri con segno, poiché un numero negativo resta negativo.',
      { fig: 'scena', w: 720, h: 212, titolo: 'Il byte 0xFD scorre a destra di una posizione', nota: 'I sette bit di sinistra scendono di una posizione. Differisce soltanto il bit che entra.', els: [
        SL.el.nota('n0', 20, 12, 'prima', 'mono'), SL.el.nota('n1', 20, 82, 'dopo SHR', 'mono'), SL.el.nota('n2', 20, 152, 'dopo SAR', 'mono')]
        .concat(SL.x86.bit('p', 0xFD, { x: 130, y: 0, passo: 46, h: 40, indici: false }))
        .concat(SL.x86.bit('s', 0x7E, { x: 130, y: 70, passo: 46, h: 40, indici: false, att: [7] }))
        .concat(SL.x86.bit('a', 0xFE, { x: 130, y: 140, passo: 46, h: 40, indici: false, att: [7] }))
        .concat([SL.el.nota('v0', 520, 12, '253, oppure −3', 'mono'), SL.el.nota('v1', 520, 82, '126: entra uno zero', 'mono'), SL.el.nota('v2', 520, 152, '−2: entra il segno', 'mono')]) },
      'L’ultimo bit che esce dal registro è scritto nel flag CF. Gli altri bit usciti vanno perduti.',
      'Lo scorrimento a destra è una divisione per una potenza di due, con un’avvertenza. SAR arrotonda sempre verso il basso: −3 diviso 2 darebbe −1,5, e il risultato è −2. La divisione fra interi del C arrotonda invece verso lo zero e darebbe −1. Per i numeri positivi le due regole coincidono.',
      'Il numero di posizioni è scritto come immediato, per esempio `shr eax, 3`, oppure è letto dal registro CL: `shl eax, cl`.'
    ]
  },
  esperimento: {
    faremo: [
      'Il registro AL contiene un byte. I controlli fissano il byte, l’istruzione di scorrimento e il numero di posizioni.',
      'I bit sono seguiti uno per uno: quelli che si spostano, quelli che entrano, quello scritto in CF. Il byte è poi letto prima e dopo, senza segno e con segno. Dopo il caso proposto, è istruttivo passare da SAR a SHR sul medesimo byte.'
    ],
    vedrai: [
      ['bit', 'Il byte prima e dopo', 'Al centro: gli otto bit di AL, in alto prima dell’istruzione e in basso dopo, con le linee che ne seguono lo spostamento.'],
      ['flag', 'Il flag CF', 'A destra: il bit che l’istruzione lascia in CF.'],
      ['segno', 'Le due letture', 'A destra in alto: il valore prima e dopo, senza segno e con segno.']
    ]
  },
  lab: {
    titolo: 'Uno scorrimento seguito bit per bit',
    scena: { w: 860, h: 332 },
    atti: ['Il byte', 'Lo spostamento', 'I bit che entrano', 'Il bit che esce', 'Le due letture'],
    controlli: [
      { id: 'x', tipo: 'scelta', eti: 'Byte in AL', opzioni: [[0xFD, '0xFD'], [0x80, '0x80'], [0x96, '0x96'], [0x5A, '0x5A'], [0x07, '0x07']], valore: 0xFD },
      { id: 'op', tipo: 'scelta', eti: 'Istruzione', opzioni: [['sar', 'SAR'], ['shr', 'SHR'], ['shl', 'SHL']], valore: 'sar' },
      { id: 'k', tipo: 'num', eti: 'Posizioni', min: 1, max: 3, salti: [1], valore: 1 }
    ],
    nota: 'I passi sono sempre cinque. Con SHL i bit salgono verso sinistra e gli zeri entrano da destra.',
    previsione: {
      domanda: (p) => 'AL contiene ' + SL.unita241.H(p.x) + ', in binario ' + SL.x86.bin8(p.x) + '. Quale byte conterrà dopo `' + p.op + ' al, ' + p.k + '`?',
      opzioni: (p) => { const U = SL.unita241; return Array.from(new Set([U.calcola(p.x, p.op, p.k).r, U.calcola(p.x, 'shr', p.k).r, U.calcola(p.x, 'sar', p.k).r, U.calcola(p.x, 'shl', p.k).r, U.calcola(p.x, p.op, p.k + 1).r])).slice(0, 4).sort((a, b) => a - b).map(U.H); }
    },
    confronto: (pred, esito, p) => { const c = SL.unita241.calcola(p.x, p.op, p.k); return 'La previsione indicava ' + pred + '. AL contiene ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : (p.op === 'shl' ? 'I bit salgono di ' + p.k + (p.k === 1 ? ' posizione' : ' posizioni') + ' e da destra entrano zeri.' : 'I bit scendono di ' + p.k + (p.k === 1 ? ' posizione' : ' posizioni') + ' e da sinistra ' + (p.op === 'shr' ? 'entrano zeri.' : 'entrano copie del bit di segno, che vale ' + c.segno + '.'))); },
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita241, N = X.num, c = U.calcola(p.x, p.op, p.k), passi = [], k = p.k, SIN = p.op === 'shl';
      const IST = p.op + ' al, ' + k, PX = (b) => 150 + (7 - b) * 62, D = Math.pow(2, k), POS = k === 1 ? 'una posizione' : k + ' posizioni';
      const st = { cf: null, vis: false };
      const quadro = (o) => {
        const f = o.fase, els = [el.nota('n1', 20, 52, 'AL prima', 'mono'), el.nota('n2', 20, 196, 'AL dopo', 'mono'), el.box('ist', 20, 262, 250, 60, 'istruzione', IST, f === 0 ? 'att' : '', { cls: 'stretta' })];
        for (let b = 7; b >= 0; b--) {
          const bit = (p.x >> b) & 1, esce = c.usciti.includes(b);
          els.push(el.cella('a' + b, PX(b), 36, 56, 50, String(bit), f >= 3 && b === c.ultimo ? 'att' : f >= 1 && esce ? 'off' : bit ? 'on' : 'zero', { piccola: true, so: 'bit ' + b }));
          const da = SIN ? b - k : b + k, entra = da < 0 || da > 7, vis = entra ? f >= 2 : f >= 1;
          els.push(el.cella('r' + b, PX(b), 180, 56, 50, vis ? String((c.r >> b) & 1) : '·', !vis ? 'off' : entra ? (f === 2 ? 'att' : ((c.r >> b) & 1) ? 'on' : 'zero') : f === 1 ? 'att' : ((c.r >> b) & 1) ? 'on' : 'zero', { piccola: true }));
          if (!entra && f >= 1) els.push(el.linea('l' + b, PX(da) + 28, 86, PX(b) + 28, 180, f === 1 ? 'att' : 'on'));
        }
        els.push(el.box('u', 660, 0, 180, 62, 'senza segno', N(p.x) + (f >= 4 ? ' → ' + N(c.r) : ''), f === 4 && p.op !== 'sar' ? 'att' : '', { cls: 'stretta' }),
          el.box('s', 660, 72, 180, 62, 'con segno', N(c.sx) + (f >= 4 ? ' → ' + N(c.sr) : ''), f === 4 && p.op !== 'shr' ? 'att' : '', { cls: 'stretta' }),
          el.box('cf', 660, 174, 180, 62, 'CF, ultimo bit uscito', st.cf == null ? '·' : String(st.cf), f === 3 ? 'att' : st.cf != null ? 'on' : '', { cls: 'stretta' }),
          el.box('sig', 290, 262, 550, 60, 'calcolo eseguito', f >= 4 ? c.senso : '·', f >= 4 ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Istruzione', IST, 'a'], ['AL', st.vis ? U.H(c.r) : U.H(p.x)], ['CF', st.cf == null ? '·' : String(st.cf), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ fase: 0 }, 0, 'Il byte di partenza', 'AL contiene ' + U.H(p.x) + ', in binario ' + X.bin8(p.x) + '. Letto senza segno vale ' + p.x + '. ' + (c.segno ? 'Il bit 7 vale 1, e letto con segno il byte vale quindi ' + p.x + ' − 256 = ' + N(c.sx) + '.' : 'Il bit 7 vale 0, e la lettura con segno dà il medesimo numero.') + ' L’istruzione `' + IST + '` sposterà ogni bit di ' + POS + ' verso ' + (SIN ? 'sinistra.' : 'destra.'),
        { chiedi: SIN ? { d: 'I bit salgono di ' + POS + '. Quale posizione raggiungerà il bit 0?', o: ['0', '1', '2', '3'], g: k, no: 'Ogni bit sale di ' + POS + ': il bit 0 raggiunge la posizione ' + k + '.' }
          : { d: 'I bit scendono di ' + POS + '. Quale posizione raggiungerà il bit 7?', o: ['4', '5', '6', '7'], g: 3 - k, no: 'Ogni bit scende di ' + POS + ': il bit 7 raggiunge la posizione ' + (7 - k) + '.' } });
      P({ fase: 1 }, 1, 'Ogni bit cambia posizione', (SIN ? 'Ogni bit sale di ' + POS + ': quello nella posizione i passa nella posizione i + ' + k + '. ' : 'Ogni bit scende di ' + POS + ': quello nella posizione i passa nella posizione i − ' + k + '. ') + (k === 1 ? 'Un bit supera il bordo ' : k + ' bit superano il bordo ') + (SIN ? 'sinistro' : 'destro') + ' e ' + (k === 1 ? 'resta' : 'restano') + ' senza collocazione. Dal lato opposto ' + (k === 1 ? 'si libera una posizione.' : 'si liberano ' + k + ' posizioni.'),
        { chiedi: p.op === 'sar' ? { d: 'SAR riempie le posizioni libere con copie del bit di segno. Il bit 7 di partenza vale ' + c.segno + '. Quali bit entreranno?', o: ['Bit a 0', 'Bit a 1'], g: c.segno, no: 'SAR copia il bit di segno, che in questo caso vale ' + c.segno + '.' }
          : { d: (p.op === 'shr' ? 'SHR' : 'SHL') + ' riempie le posizioni libere. Il bit 7 di partenza vale ' + c.segno + '. Quali bit entreranno?', o: ['Bit a 0', 'Bit a 1'], g: 0, no: (p.op === 'shr' ? 'SHR' : 'SHL') + ' fa entrare sempre zeri, qualunque sia il bit di segno.' } });
      st.vis = true;
      P({ fase: 2 }, 2, p.op === 'sar' ? 'Entra il bit di segno' : 'Entrano zeri', (p.op === 'sar' ? 'SAR riempie le posizioni libere a sinistra con copie del bit di segno, che vale ' + c.segno + '. ' + (c.segno ? 'Il numero era negativo e resta negativo.' : 'Il numero era positivo e resta positivo.') : p.op === 'shr' ? 'SHR riempie le posizioni libere a sinistra con zeri, indipendentemente dal bit di segno.' : 'SHL riempie le posizioni libere a destra con zeri.') + ' Il byte diventa ' + X.bin8(c.r) + ', cioè ' + U.H(c.r) + '.', { calc: X.bin8(p.x) + ' → ' + X.bin8(c.r) });
      st.cf = c.cf;
      P({ fase: 3 }, 3, 'L’ultimo bit uscito', (k === 1 ? 'Dal registro è uscito un solo bit, quello situato nella posizione ' + c.ultimo + '.' : 'Dal registro sono usciti ' + k + ' bit. L’ultimo a superare il bordo è quello situato nella posizione ' + c.ultimo + '.') + ' Vale ' + c.cf + ', e l’istruzione lo conserva in CF.' + (k > 1 ? ' Gli altri bit usciti vanno perduti.' : ''), { calc: 'CF = bit ' + c.ultimo + ' di partenza = ' + c.cf });
      P({ fase: 4 }, 4, 'L’effetto sul numero', c.lettura, { calc: c.senso, esito: ['AL = ' + U.H(c.r) + ', CF = ' + c.cf, 'si'] });
      return { passi, esito: U.H(c.r) };
    }
  },
  bilancio: {
    regola: [
      'SHL sposta i bit a sinistra e fa entrare zeri: ogni posizione raddoppia. SHR e SAR spostano a destra: ogni posizione dimezza. SHR fa entrare zeri, SAR copie del bit di segno.',
      'CF riceve l’ultimo bit uscito. Per i numeri senza segno si impiega SHR, per quelli con segno SAR, che arrotonda verso il basso.'
    ],
    errori: [
      ['Impiegare SHR su un numero negativo.', 'Il byte 0xFD vale −3. Con SHR diventa 0x7E, cioè 126. Con SAR diventa 0xFE, cioè −2.'],
      ['Attendersi da SAR l’arrotondamento della divisione del C.', 'SAR porta −3 a −2, verso il basso. La divisione fra interi del C darebbe −1.'],
      ['Trascurare i bit che escono.', 'Con SHL il byte 0x96 diventa 0x2C: il bit 7 è uscito, e il doppio di 150 eccede gli otto bit.']
    ],
    saFare: ['Calcolare il risultato di SHL, SHR e SAR su un byte.', 'Indicare il bit scritto in CF.', 'Scegliere lo scorrimento a destra adatto al tipo del dato.'],
    esercizi: [
      { d: 'AL contiene 0xB4, in binario 1011 0100. Quale byte contiene dopo `sar al, 2`? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x3C', giuste: ['0xed', 'ed', 'edh'],
        ok: 'I bit scendono di due posizioni: 10 1101. A sinistra entrano due copie del bit di segno, che vale 1: 1110 1101.',
        diagnosi: [
          { se: ['0x2d', '2d'], msg: 'Il valore indicato è il risultato di SHR, che fa entrare zeri. SAR copia il bit di segno, che in questo caso vale 1.' },
          { se: ['0xda', 'da'], msg: 'Il valore indicato corrisponde allo scorrimento di una sola posizione. L’istruzione ne richiede due.' },
          { se: ['0xd0', 'd0'], msg: 'Il valore indicato corrisponde a uno scorrimento verso sinistra. SAR sposta i bit verso destra.' },
          { se: ['11101101', '1110 1101'], msg: 'I bit sono corretti. Vanno scritte le due cifre esadecimali: 1110 e 1101.' }
        ],
        altro: 'Il byte è diverso. Si spostino gli otto bit di due posizioni a destra e si riempiano le due posizioni libere con il bit di segno.',
        indizi: ['Si tolgano i due bit più a destra, 00: restano 10 1101.', 'A sinistra entrano due copie del bit di segno, che vale 1.', 'Il byte è 1110 1101.'],
        svolgimento: ['Bit di partenza: 1011 0100.', 'Dopo lo spostamento: i sei bit rimasti sono 10 1101.', 'SAR antepone due bit a 1: 1110 1101.', '1110 è E, 1101 è D: AL = 0xED.'] },
      { d: 'EAX contiene un numero senza segno. Quale istruzione lo divide per 8, scartando il resto?', guida: 'Si scelga la risposta.', o: [
        { t: 'shr eax, 3', ok: true, fb: 'Otto è 2 alla terza: tre posizioni verso destra. Per un numero senza segno entrano zeri.' },
        { t: 'shr eax, 8', fb: 'Otto posizioni dividono per 256. Il numero di posizioni è l’esponente della potenza di due.' },
        { t: 'sar eax, 3', fb: 'SAR copia il bit più a sinistra. Un numero senza segno grande, con tale bit a 1, sarebbe trattato come negativo.' },
        { t: 'shl eax, 3', fb: 'Lo scorrimento a sinistra moltiplica per 8.' }] }
    ],
    sfida: ['cslez2_4_03_random_assembly_03', 'XOR, inversioni e scorrimenti']
  }
});
SL.unita241 = (() => {
  const H = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0');
  const calcola = (x, op, k) => {
    const X = SL.x86, N = X.num, sx = X.conSegno(x, 8), segno = x >= 128 ? 1 : 0, D = Math.pow(2, k);
    const r = op === 'shl' ? (x * D) % 256 : op === 'shr' ? Math.floor(x / D) : ((Math.floor(sx / D) % 256) + 256) % 256;
    const usciti = []; for (let b = 0; b < 8; b++) if (op === 'shl' ? b + k > 7 : b - k < 0) usciti.push(b);
    const ultimo = op === 'shl' ? 8 - k : k - 1, cf = (x >> ultimo) & 1, sr = X.conSegno(r, 8);
    const senso = op === 'shr' ? x + ' ÷ ' + D + ' = ' + r + ', con il resto di ' + (x % D) : op === 'sar' ? N(sx) + ' ÷ ' + D + ', verso il basso: ' + N(sr) : x * D > 255 ? x + ' × ' + D + ' = ' + x * D + ' supera 255: resta ' + r : x + ' × ' + D + ' = ' + r;
    const lettura = op === 'shr' ? 'Letto senza segno, il byte è passato da ' + x + ' a ' + r + ': si tratta della divisione per ' + D + ', con il resto scartato. ' + (segno ? 'La lettura con segno, invece, è passata da ' + N(sx) + ' a ' + N(sr) + ', un numero privo di relazione con il primo: SHR è lo scorrimento dei numeri senza segno.' : 'Il numero era positivo, e la lettura con segno dà il medesimo risultato.')
      : op === 'sar' ? 'Letto con segno, il byte è passato da ' + N(sx) + ' a ' + N(sr) + ': si tratta della divisione per ' + D + ', arrotondata verso il basso. ' + (segno ? 'La lettura senza segno è passata da ' + x + ' a ' + r + ', valore estraneo alla divisione: SAR è lo scorrimento dei numeri con segno.' : 'Il numero era positivo, e SHR avrebbe dato il medesimo byte.')
        : x * D > 255 ? 'Il prodotto ' + x + ' × ' + D + ' vale ' + x * D + ' e supera 255. Nel byte restano gli otto bit bassi, ' + r + ', e i bit usciti a sinistra sono perduti. Il raddoppio è esatto soltanto finché il risultato rientra nella larghezza.' : 'Letto senza segno, il byte è passato da ' + x + ' a ' + r + ': si tratta della moltiplicazione per ' + D + '. Nessun bit a 1 è uscito, e il risultato è esatto.';
    return { r, sx, sr, segno, usciti, ultimo, cf, senso, lettura };
  };
  return { H, calcola };
})();
