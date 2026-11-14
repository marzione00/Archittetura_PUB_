'use strict';
/* Strumenti comuni alle unità del Modulo II (x86-64): scrittura dei numeri, viste dei registri,
   disegno sul palco di registri, bit, flag e listati. I registri sono numeri interi a 64 bit (BigInt). */
SL.x86 = (() => {
  const M64 = 0xFFFFFFFFFFFFFFFFn;
  const u64 = (v) => BigInt.asUintN(64, BigInt(v));
  // Scrittura esadecimale con un numero fisso di cifre.
  const esa = (v, cifre) => '0x' + u64(v).toString(16).toUpperCase().padStart(cifre || 2, '0');
  const esa2 = (v) => Number(v).toString(16).toUpperCase().padStart(2, '0');
  // Gli otto byte di un registro, dal più significativo.
  const byteDi = (v) => { const out = []; let x = u64(v); for (let k = 0; k < 8; k++) { out.unshift(Number(x & 255n)); x >>= 8n; } return out; };
  // Larghezza in bit della vista indicata da un nome di registro: rax 64, eax 32, ax 16, al 8; r8 64, r8d 32, r8w 16, r8b 8.
  const larghezza = (nome) => {
    const n = nome.toLowerCase();
    if (/^r\d+$/.test(n)) return 64; if (/^r\d+d$/.test(n)) return 32; if (/^r\d+w$/.test(n)) return 16; if (/^r\d+b$/.test(n)) return 8;
    if (n[0] === 'r') return 64; if (n[0] === 'e') return 32; if (/[lh]$/.test(n) && n.length <= 3 && !/^(sp|bp|si|di)$/.test(n)) return 8; return 16;
  };
  /* Scrittura in una vista di un registro. Le viste da 8 e da 16 bit conservano gli altri bit;
     la vista da 32 bit azzera la metà alta, come prescrive l'architettura a 64 bit. */
  const scrivi = (vecchio, bit, valore) => {
    const v = BigInt.asUintN(bit, BigInt(valore));
    if (bit >= 32) return v;
    const m = (1n << BigInt(bit)) - 1n;
    return (u64(vecchio) & ~m & M64) | v;
  };
  const leggi = (reg, bit) => BigInt.asUintN(bit, u64(reg));
  const dentro = (r, k) => !!r && k >= r[0] && k < r[1];

  /* Disegno: la striscia degli otto byte di un registro, dal più significativo.
     o.att, o.err, o.on: intervalli [da, a) di posizioni nella striscia (0 è il byte più significativo). */
  const registro = (pre, v, o) => {
    const x = o.x == null ? 40 : o.x, passo = o.passo || 62;
    return byteDi(v).map((b, k) => SL.el.cella(pre + k, x + k * passo, o.y, passo - 6, o.h || 50, esa2(b), dentro(o.err, k) ? 'err' : dentro(o.att, k) ? 'att' : dentro(o.on, k) ? 'on' : (o.st || ''), { cls: 'minuta', so: o.indici === false ? null : 'byte ' + (7 - k) }));
  };
  // Disegno: gli otto bit di un byte, dal bit 7 al bit 0. o.att: elenco dei bit da mettere in evidenza.
  const bit = (pre, v, o) => {
    const x = o.x == null ? 40 : o.x, passo = o.passo || 62;
    return Array.from({ length: 8 }, (_, k) => {
      const b = (v >> (7 - k)) & 1;
      return SL.el.cella(pre + k, x + k * passo, o.y, passo - 6, o.h || 50, String(b), (o.att || []).includes(7 - k) ? 'att' : o.st || (b ? 'on' : 'zero'), { piccola: true, so: o.indici === false ? null : 'bit ' + (7 - k) });
    });
  };
  /* Disegno: gli n bit di un valore (n fino a 32), dal più significativo. o.att, o.on, o.err, o.off: elenchi di posizioni;
     o.vuoto: posizioni mostrate con un puntino; o.tagli: posizioni dopo le quali lasciare uno spazio di o.gap punti;
     o.indici: false per togliere i numeri sopra le caselle, oppure una funzione che sceglie quali mostrare. */
  const fila = (pre, v, n, o) => Array.from({ length: n }, (_, j) => {
    const k = n - 1 - j, b = Math.floor(v / Math.pow(2, k)) % 2, passo = o.passo || 44;
    const x = (o.x == null ? 40 : o.x) + j * passo + (o.tagli || []).filter((t) => t > k).length * (o.gap || 10);
    const vuoto = (o.vuoto || []).includes(k);
    const st = (o.err || []).includes(k) ? 'err' : (o.att || []).includes(k) ? 'att' : vuoto || (o.off || []).includes(k) ? 'off' : (o.on || []).includes(k) ? 'on' : o.st != null ? o.st : (b ? 'on' : 'zero');
    return SL.el.cella(pre + k, x, o.y, passo - 4, o.h || 40, vuoto ? '·' : String(b), st, { piccola: true, cls: 'minuta', so: o.indici === false ? null : typeof o.indici === 'function' ? o.indici(k) : String(k) });
  });
  /* Disegno: un tratto di pila, una casella da otto byte per riga, con gli indirizzi più alti in alto.
     righe: [{ a: indirizzo, txt, nota, st }]; o.rsp: indirizzo contenuto in RSP; o.rbp: indirizzo contenuto in RBP. */
  const pila = (pre, righe, o) => {
    const x = o.x == null ? 40 : o.x, w = o.w || 200, passo = o.passo || 46, els = [];
    righe.forEach((r, k) => {
      const y = o.y + k * passo, cima = r.a === o.rsp, base = o.rbp != null && r.a === o.rbp;
      if (cima || base) els.push(SL.el.nota(pre + 'p' + k, x, y + 10, cima && base ? 'RSP RBP' : cima ? 'RSP →' : 'RBP →', 'mono minuta', cima ? 'att' : 'on'));
      els.push(SL.el.nota(pre + 'a' + k, x + 78, y + 10, '0x' + r.a.toString(16).toUpperCase(), 'mono minuta', cima ? 'att' : ''));
      els.push(SL.el.cella(pre + 'c' + k, x + 140, y, w, passo - 6, r.txt == null ? '·' : String(r.txt), r.st || (r.txt == null ? 'off' : 'on'), { piccola: true, cls: 'minuta' }));
      if (r.nota) els.push(SL.el.nota(pre + 'n' + k, x + 150 + w, y + 10, r.nota, 'mono minuta', r.st === 'att' ? 'att' : r.st === 'err' ? 'err' : ''));
    });
    return els;
  };
  // Disegno: un listato, una riga per istruzione. righe: [[indirizzo, testo]]; corrente: la riga in esecuzione.
  const listato = (pre, righe, corrente, o) => righe.map((r, k) => SL.el.box(pre + k, o.x == null ? 40 : o.x, o.y + k * (o.passo || 66), o.w || 250, (o.passo || 66) - 8, r[0], r[1], k === corrente ? 'att' : corrente != null && k < corrente ? 'on' : '', { cls: 'stretta' }));
  // Disegno: una casella per flag. valori: { CF: 0, ZF: 1 }; o.att: nomi dei flag appena scritti.
  const flag = (pre, valori, o) => Object.keys(valori).map((n, k) => SL.el.box(pre + n, o.x + k * (o.passo || 90), o.y, (o.passo || 90) - 10, o.h || 58, n, valori[n] == null ? '·' : String(valori[n]), (o.att || []).includes(n) ? 'att' : valori[n] ? 'on' : ''));
  // Scrittura in binario di un byte, a gruppi di quattro.
  const bin8 = (v) => (v & 255).toString(2).padStart(8, '0').replace(/(....)(....)/, '$1 $2');
  // Lettura con segno, in complemento a due, di una configurazione di w bit (w fino a 32).
  const conSegno = (v, w) => { const m = Math.pow(2, w); v = ((v % m) + m) % m; return v >= m / 2 ? v - m : v; };
  // Somma e differenza di due configurazioni di w bit, con il risultato conservato e i quattro flag.
  const fuori = (sv, w) => (sv > Math.pow(2, w - 1) - 1 || sv < -Math.pow(2, w - 1) ? 1 : 0);
  const somma = (a, b, w) => { const m = Math.pow(2, w), vero = a + b, r = vero % m, sa = conSegno(a, w), sb = conSegno(b, w); return { vero, r, sa, sb, sv: sa + sb, sr: conSegno(r, w), cf: vero >= m ? 1 : 0, of: fuori(sa + sb, w), zf: r === 0 ? 1 : 0, sf: r >= m / 2 ? 1 : 0 }; };
  const differenza = (a, b, w) => { const m = Math.pow(2, w), vero = a - b, r = ((vero % m) + m) % m, sa = conSegno(a, w), sb = conSegno(b, w); return { vero, r, sa, sb, sv: sa - sb, sr: conSegno(r, w), cf: a < b ? 1 : 0, of: fuori(sa - sb, w), zf: r === 0 ? 1 : 0, sf: r >= m / 2 ? 1 : 0 }; };
  // Scrittura di un numero con il segno meno tipografico e i gruppi di tre cifre.
  const num = (v) => (v < 0 ? '−' : '') + SL.num(Math.abs(v));

  /* Esperimento comune alle unità 2.2.1 (somma) e 2.2.6 (differenza): la stessa operazione su w bit,
     letta senza segno e con segno, con i flag che ne derivano. tipo: 'add' oppure 'sub'. */
  const labFlag = (tipo, scelteA, scelteB, predefiniti) => {
    const ADD = tipo === 'add', SEGNO = ADD ? '+' : '−';
    const NOMI = { '00': 'nessuno dei due', '10': 'soltanto CF', '01': 'soltanto OF', '11': 'CF e OF' };
    const conto = (p) => (ADD ? somma(p.a, p.b, p.w) : differenza(p.a, p.b, p.w));
    const HX = (v, w) => '0x' + v.toString(16).toUpperCase().padStart(w / 4, '0');
    return {
      titolo: ADD ? 'Una somma, due letture, due flag' : 'Una differenza, due letture, quattro flag',
      scena: { w: 860, h: 318 },
      atti: ADD ? ['Gli addendi', 'Il risultato conservato', 'Senza segno', 'Con segno', 'I flag insieme'] : ['Gli operandi', 'Il risultato conservato', 'Senza segno', 'Con segno', 'Segno e zero', 'I flag insieme'],
      controlli: [
        { id: 'w', tipo: 'scelta', eti: 'Larghezza', opzioni: [[8, '8 bit'], [16, '16 bit']], valore: 8 },
        { id: 'a', tipo: 'scelta', eti: ADD ? 'Primo addendo' : 'Minuendo', opzioni: scelteA.map((v) => [v, HX(v, 8)]), valore: predefiniti[0] },
        { id: 'b', tipo: 'scelta', eti: ADD ? 'Secondo addendo' : 'Sottraendo', opzioni: scelteB.map((v) => [v, HX(v, 8)]), valore: predefiniti[1] }
      ],
      previsione: {
        domanda: (p) => 'Su ' + p.w + ' bit si calcola ' + HX(p.a, p.w) + ' ' + SEGNO + ' ' + HX(p.b, p.w) + '. Quali flag varranno 1 fra CF e OF?',
        opzioni: () => [['00', 'Nessuno dei due'], ['10', 'Soltanto CF'], ['01', 'Soltanto OF'], ['11', 'CF e OF']]
      },
      confronto: (pred, esito, p) => {
        const c = conto(p), max = Math.pow(2, p.w) - 1, smin = -Math.pow(2, p.w - 1), smax = Math.pow(2, p.w - 1) - 1;
        return 'La previsione indicava: ' + NOMI[pred] + '. Esito: ' + NOMI[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.'
          : 'Senza segno ' + (ADD ? 'la somma esatta vale ' + num(c.vero) + (c.cf ? ', oltre il massimo ' + num(max) + '.' : ', entro il massimo ' + num(max) + '.') : (c.cf ? 'il minuendo è minore del sottraendo, e occorre un prestito.' : 'il minuendo è sufficiente, e nessun prestito è richiesto.'))
          + ' Con segno il risultato esatto vale ' + num(c.sv) + (c.of ? ', esterno all’intervallo da ' + num(smin) + ' a ' + num(smax) + '.' : ', interno all’intervallo da ' + num(smin) + ' a ' + num(smax) + '.'));
      },
      costruisci(p) {
        const el = SL.el, passi = [], w = p.w, c = conto(p), max = Math.pow(2, w) - 1, smin = -Math.pow(2, w - 1), smax = Math.pow(2, w - 1) - 1;
        const A = HX(p.a, w), B = HX(p.b, w), R = HX(c.r, w), COL = [230, 430, 630], RIGA = [28, 96, 164];
        const st = { fl: ADD ? { CF: null, OF: null } : { CF: null, OF: null, SF: null, ZF: null } };
        const quadro = (o) => {
          o = o || {};
          const els = [el.nota('h0', 230, 0, ADD ? 'PRIMO ADDENDO' : 'MINUENDO', 'mono'), el.nota('h1', 430, 0, ADD ? 'SECONDO ADDENDO' : 'SOTTRAENDO', 'mono'), el.nota('h2', 630, 0, 'RISULTATO IN ' + w + ' BIT', 'mono'),
            el.nota('r0', 40, 42, 'i bit, in esadecimale', 'mono'), el.nota('r1', 40, 110, 'letti senza segno', 'mono', o.riga === 1 ? 'att' : ''), el.nota('r2', 40, 178, 'letti con segno', 'mono', o.riga === 2 ? 'att' : '')];
          const cella = (id, col, riga, txt, vista, forte) => els.push(el.cella(id, COL[col], RIGA[riga], col === 2 ? 190 : 180, 52, vista ? txt : '·', !vista ? 'off' : forte === 'err' ? 'err' : forte ? 'att' : 'on', { piccola: true }));
          cella('a0', 0, 0, A, true); cella('b0', 1, 0, B, true); cella('c0', 2, 0, R, o.fase >= 2, o.fase === 2);
          cella('a1', 0, 1, num(p.a), o.fase >= 1, o.riga === 1 && o.fase === 1); cella('b1', 1, 1, num(p.b), o.fase >= 1, o.riga === 1 && o.fase === 1); cella('c1', 2, 1, num(c.r), o.fase >= 3, o.fase === 3 ? (c.cf ? 'err' : true) : false);
          cella('a2', 0, 2, num(c.sa), o.fase >= 1, false); cella('b2', 1, 2, num(c.sb), o.fase >= 1, false); cella('c2', 2, 2, num(c.sr), o.fase >= 4, o.fase === 4 ? (c.of ? 'err' : true) : false);
          els.push(el.box('op', 40, 240, 170, 62, 'operazione', (ADD ? 'A + B' : 'A − B') + ' su ' + w + ' bit', '', { cls: 'stretta' }));
          flag('f', st.fl, { x: 230, y: 240, passo: ADD ? 200 : 150, h: 62, att: o.flag || [] }).forEach((e) => els.push(e));
          return els;
        };
        const hud = () => [['Larghezza', w + ' bit', 'a'], ['CF · OF', (st.fl.CF == null ? '·' : st.fl.CF) + ' · ' + (st.fl.OF == null ? '·' : st.fl.OF)], ['Risultato', st.vis ? R : '·', 'c']];
        const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

        P({ fase: 0 }, 0, 'Due configurazioni di bit', 'L’operazione è eseguita su ' + w + ' bit. I due operandi sono le configurazioni ' + A + ' e ' + B + (w === 16 ? ', scritte con quattro cifre esadecimali.' : ', scritte con due cifre esadecimali.') + ' Il processore le tratta come semplici sequenze di bit.');
        P({ fase: 1, riga: 1 }, 0, 'Le due letture degli operandi', 'Tali bit ammettono due letture. Senza segno valgono ' + num(p.a) + ' e ' + num(p.b) + '. In complemento a due su ' + w + ' bit valgono ' + num(c.sa) + ' e ' + num(c.sb) + (c.sa === p.a && c.sb === p.b ? ': il bit di segno è 0 in entrambi, e le due letture coincidono.' : ', poiché dove il bit di segno vale 1 si sottrae ' + num(max + 1) + '.'),
          { chiedi: ADD ? { d: 'La somma esatta dei valori senza segno è ' + num(c.vero) + '. Su ' + w + ' bit il massimo è ' + num(max) + '. Uscirà un riporto?', o: ['Sì', 'No'], g: c.cf ? 0 : 1, no: c.cf ? num(c.vero) + ' supera ' + num(max) + ', e occorre quindi un bit in più.' : num(c.vero) + ' rientra in ' + num(max) + ', e i ' + w + ' bit sono quindi sufficienti.' }
            : { d: 'Senza segno il minuendo vale ' + num(p.a) + ' e il sottraendo ' + num(p.b) + '. La sottrazione richiederà un prestito oltre l’ultimo bit?', o: ['Sì', 'No'], g: c.cf ? 0 : 1, no: c.cf ? 'Il minuendo è minore del sottraendo, e la sottrazione richiede quindi un prestito dall’esterno.' : 'Il minuendo è maggiore o uguale al sottraendo, e nessun prestito è quindi richiesto.' } });
        st.vis = true;
        P({ fase: 2 }, 1, 'Il risultato conservato', 'Il circuito ' + (ADD ? 'somma' : 'sottrae') + ' le due configurazioni colonna per colonna e conserva ' + w + ' bit. Il risultato è ' + R + ', il medesimo per entrambe le letture.', { calc: A + ' ' + SEGNO + ' ' + B + ' → ' + R });
        st.fl.CF = c.cf;
        P({ fase: 3, riga: 1, flag: ['CF'] }, 2, 'La lettura senza segno e CF', ADD ? 'Senza segno la somma esatta è ' + num(p.a) + ' + ' + num(p.b) + ' = ' + num(c.vero) + '. ' + (c.cf ? 'Essa supera il massimo, ' + num(max) + ', pertanto in ' + w + ' bit resta ' + num(c.r) + ' e il riporto uscente porta CF a 1.' : 'Essa rientra nel massimo, ' + num(max) + ', pertanto il risultato conservato è corretto e CF vale 0.')
            : 'Senza segno la differenza esatta è ' + num(p.a) + ' − ' + num(p.b) + ' = ' + num(c.vero) + '. ' + (c.cf ? 'Essa è negativa, e i numeri senza segno escludono i valori negativi. La sottrazione richiede un prestito dall’esterno, in ' + w + ' bit resta ' + num(c.r) + ' e CF vale 1.' : 'Essa è un numero senza segno valido, pertanto il risultato conservato è corretto e CF vale 0.'),
          { calc: num(p.a) + ' ' + SEGNO + ' ' + num(p.b) + ' = ' + num(c.vero) + ' · CF = ' + c.cf, chiedi: { d: 'Con segno il risultato esatto vale ' + num(c.sa) + ' ' + SEGNO + ' ' + (c.sb < 0 ? '(' + num(c.sb) + ')' : num(c.sb)) + ' = ' + num(c.sv) + '. Su ' + w + ' bit l’intervallo con segno si estende da ' + num(smin) + ' a ' + num(smax) + '. Il risultato vi rientra?', o: ['Sì', 'No'], g: c.of ? 1 : 0, no: c.of ? num(c.sv) + ' è esterno all’intervallo.' : num(c.sv) + ' è interno all’intervallo.' } });
        st.fl.OF = c.of;
        P({ fase: 4, riga: 2, flag: ['OF'] }, 3, 'La lettura con segno e OF', 'Con segno il risultato esatto è ' + num(c.sa) + ' ' + SEGNO + ' ' + (c.sb < 0 ? '(' + num(c.sb) + ')' : num(c.sb)) + ' = ' + num(c.sv) + '. ' + (c.of ? 'Esso è esterno all’intervallo da ' + num(smin) + ' a ' + num(smax) + ': i bit conservati, letti con segno, valgono ' + num(c.sr) + ', un numero di segno errato. OF vale 1.' : 'Esso rientra nell’intervallo da ' + num(smin) + ' a ' + num(smax) + ', e i bit conservati letti con segno valgono appunto ' + num(c.sr) + '. OF vale 0.'),
          { calc: num(c.sa) + ' ' + SEGNO + ' ' + (c.sb < 0 ? '(' + num(c.sb) + ')' : num(c.sb)) + ' = ' + num(c.sv) + ' · OF = ' + c.of });
        if (!ADD) {
          st.fl.SF = c.sf; st.fl.ZF = c.zf;
          P({ fase: 5, flag: ['SF', 'ZF'] }, 4, 'SF e ZF', 'Gli altri due flag descrivono i bit del risultato conservato. SF copia il bit più a sinistra, che in ' + R + ' vale ' + c.sf + '. ZF vale 1 soltanto se tutti i bit sono zero, e in questo caso vale ' + c.zf + '.', { calc: 'SF = ' + c.sf + ' · ZF = ' + c.zf });
        }
        P({ fase: 6 }, ADD ? 4 : 5, 'I flag insieme', (c.cf && c.of ? 'Il risultato è errato in entrambe le letture, e i due flag lo segnalano.' : c.cf ? 'Il risultato è errato nella lettura senza segno e corretto in complemento a due.' : c.of ? 'Il risultato è corretto nella lettura senza segno ed errato in complemento a due.' : 'Il risultato è corretto in entrambe le letture, e i due flag restano a 0.') + ' Il processore scrive sempre tutti i flag. Spetta al programma, che conosce il significato dei propri dati, considerare il flag pertinente.',
          { calc: 'CF = ' + c.cf + ' · OF = ' + c.of + (ADD ? '' : ' · SF = ' + c.sf + ' · ZF = ' + c.zf) });
        return { passi, esito: '' + c.cf + c.of };
      }
    };
  };
  /* Disegno: una traccia di esecuzione. ist: testi delle righe; colonne: intestazioni; T: valori riga per riga
     (null = ignoto); riga: ultima riga compilata; leggi: colonne lette, nella riga precedente; scrive: colonna scritta. */
  const traccia = (o) => {
    const passo = o.passo || 54, wI = o.wI || 260, wc = o.wc || 116, x0 = 40 + wI + 30, gap = wc + 12;
    const els = [SL.el.nota('th', 40, 0, 'ISTRUZIONE', 'mono')];
    o.colonne.forEach((n, j) => els.push(SL.el.nota('th' + j, x0 + j * gap, 0, n, 'mono', j === o.evid ? 'att' : '')));
    // Una riga di T uguale a null è un’istruzione saltata: resta spenta, con un trattino nelle caselle.
    o.ist.forEach((t, k) => els.push(SL.el.box('ti' + k, 40, 30 + k * passo, wI, passo - 8, null, t, o.T[k] === null && k <= o.riga ? 'off' : k === o.riga ? 'att' : k < o.riga ? 'on' : '', { cls: 'stretta' })));
    o.T.forEach((r, k) => (r || o.colonne.map(() => '−')).forEach((v, j) => {
      const vista = k <= o.riga && r !== null;
      els.push(SL.el.cella('tc' + k + '_' + j, x0 + j * gap, 30 + k * passo, wc, passo - 8, r === null && k <= o.riga ? '−' : !vista ? '·' : v == null ? '?' : (typeof v === 'number' ? num(v) : String(v)),
        !vista || v == null ? 'off' : (o.leggi || []).includes(j) && k === o.riga - 1 ? 'att' : k === o.riga && j === o.scrive ? 'att' : 'on', { piccola: true }));
    }));
    return els;
  };
  return { u64, esa, esa2, byteDi, larghezza, scrivi, leggi, registro, bit, fila, pila, listato, flag, bin8, conSegno, somma, differenza, num, labFlag, traccia };
})();

/* Strumenti comuni alle unità sul repertorio Y86-64: registri, lunghezze, codifica in byte e scrittura
   delle istruzioni. Un'istruzione è { n: nome, a: registro rA, b: registro rB, c: costante }. */
SL.y86 = (() => {
  const REG = ['rax', 'rcx', 'rdx', 'rbx', 'rsp', 'rbp', 'rsi', 'rdi', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14'];
  const OP = { addq: 0, subq: 1, andq: 2, xorq: 3 }, J = { jmp: 0, jle: 1, jl: 2, je: 3, jne: 4, jge: 5, jg: 6 };
  const ICODE = { halt: 0, nop: 1, rrmovq: 2, irmovq: 3, rmmovq: 4, mrmovq: 5, opq: 6, jxx: 7, call: 8, ret: 9, pushq: 10, popq: 11 };
  const classe = (n) => (n in OP ? 'opq' : n in J ? 'jxx' : n);
  const conRegistri = (n) => ['rrmovq', 'irmovq', 'rmmovq', 'mrmovq', 'opq', 'pushq', 'popq'].includes(classe(n));
  const conCostante = (n) => ['irmovq', 'rmmovq', 'mrmovq', 'jxx', 'call'].includes(classe(n));
  const lung = (n) => 1 + (conRegistri(n) ? 1 : 0) + (conCostante(n) ? 8 : 0);
  const esa2 = (v) => v.toString(16).toUpperCase().padStart(2, '0');
  const esa = (v) => '0x' + v.toString(16).toUpperCase();
  // Gli otto byte di una costante, dal meno significativo.
  const le8 = (v) => { let x = BigInt.asUintN(64, BigInt(v)); const out = []; for (let k = 0; k < 8; k++) { out.push(Number(x & 255n)); x >>= 8n; } return out; };
  const idReg = (r) => (r == null ? 15 : REG.indexOf(r));
  const byteIst = (i) => {
    const c = classe(i.n), b = [(ICODE[c] << 4) | (c === 'opq' ? OP[i.n] : c === 'jxx' ? J[i.n] : 0)];
    if (conRegistri(i.n)) b.push((idReg(i.a) << 4) | idReg(i.b));
    if (conCostante(i.n)) le8(i.c).forEach((x) => b.push(x));
    return b;
  };
  const testo = (i) => {
    const c = classe(i.n);
    return c === 'rrmovq' || c === 'opq' ? i.n + ' %' + i.a + ', %' + i.b : c === 'irmovq' ? 'irmovq $' + i.c + ', %' + i.b : c === 'rmmovq' ? 'rmmovq %' + i.a + ', ' + i.c + '(%' + i.b + ')'
      : c === 'mrmovq' ? 'mrmovq ' + i.c + '(%' + i.b + '), %' + i.a : c === 'jxx' || c === 'call' ? i.n + ' ' + esa(i.c) : c === 'pushq' || c === 'popq' ? i.n + ' %' + i.a : i.n;
  };
  return { REG, OP, J, ICODE, classe, conRegistri, conCostante, lung, esa2, esa, le8, idReg, byteIst, testo };
})();

/* Diagramma di una pipeline: una riga per istruzione, una colonna per ciclo.
   righe: [{ n: 'I1', da: 1, s: ['F', 'D', 'E', 'M', 'W'], err: [cicli da segnare] }], dove s[j] è lo stadio occupato nel ciclo da + j.
   o: { x, y, passo, py, h, cicli, fino: ultimo ciclo mostrato, evid: ciclo in evidenza }. */
SL.pipe = (() => {
  const stadioIn = (r, c) => { const j = c - r.da; return j >= 0 && j < r.s.length ? r.s[j] : null; };
  const diagramma = (pre, righe, o) => {
    const x = o.x == null ? 150 : o.x, passo = o.passo || 60, h = o.h || 28, py = o.py || 34, els = [];
    for (let c = 1; c <= o.cicli; c++) els.push(SL.el.nota(pre + 'c' + c, x + (c - 1) * passo + passo / 2 - (c > 9 ? 12 : 7), o.y, String(c), 'mono minuta', c === o.evid ? 'att' : ''));
    righe.forEach((r, k) => {
      els.push(SL.el.nota(pre + 'n' + k, o.xn == null ? 20 : o.xn, o.y + 28 + k * py, r.n, 'mono minuta', r.st || ''));
      for (let c = 1; c <= o.cicli; c++) {
        const s = stadioIn(r, c), vista = o.fino == null || c <= o.fino;
        if (s) els.push(SL.el.cella(pre + k + '_' + c, x + (c - 1) * passo, o.y + 24 + k * py, passo - 6, h, vista ? s : '·', !vista ? 'off' : s === '○' ? 'zero' : (r.err || []).includes(c) ? 'err' : c === o.evid ? 'att' : 'on', { piccola: true, cls: 'minuta' }));
      }
    });
    return els;
  };
  // La fila dei cinque stadi con i loro occupanti. occ: cinque testi (vuoto se manca); o: { x, y, w, h, gap, st: [stati], et: [etichette] }
  const NOMI = ['F', 'D', 'E', 'M', 'W'];
  const stadi = (pre, occ, o) => {
    const w = o.w || 158, gap = o.gap == null ? 8 : o.gap, h = o.h || 74;
    return NOMI.map((s, j) => SL.el.box(pre + j, o.x + j * (w + gap), o.y, w, h, (o.et && o.et[j]) || 'stadio ' + s, occ[j] || 'vuoto', (o.st && o.st[j]) || (occ[j] ? 'on' : 'off'), { cls: 'stretta' }));
  };
  return { stadioIn, diagramma, stadi, NOMI };
})();

/* Strumenti del Modulo IV: eventi che deviano il flusso di controllo, e la scena comune alle unità 4.1.1 e 4.1.2. */
SL.kern = (() => {
  const H = (v) => '0x' + v.toString(16).toUpperCase();
  // ripresa: 'seguente' = dall'istruzione successiva · 'stessa' = l'istruzione viene ripetuta · 'nessuna' = ripresa non garantita
  const EVENTI = {
    irq: { nome: 'interrupt del timer', classe: 'interrupt', ripresa: 'seguente', lung: 4, ist: 'add rax, 8' },
    pf: { nome: 'pagina assente', classe: 'fault', ripresa: 'stessa', lung: 4, ist: 'mov rax, [rdi+8]' },
    bp: { nome: 'breakpoint', classe: 'trap', ripresa: 'seguente', lung: 1, ist: 'int3' },
    abort: { nome: 'guasto grave', classe: 'abort', ripresa: 'nessuna', lung: 4, ist: 'add rax, 8' }
  };
  const ripresa = (ev, pc) => { const e = EVENTI[ev]; return e.ripresa === 'nessuna' ? 0 : pc + (e.ripresa === 'seguente' ? e.lung : 0); };
  /* Scena: tre istruzioni in fila, il gestore sotto, l'indirizzo salvato e la ripresa.
     fase: 0 il programma avanza · 1 l'evento · 2 l'indirizzo salvato · 3 il gestore lavora · 4 la ripresa.
     o: { x, y, w (larghezza di una istruzione), gap, h, classe: true per mostrare la classe dell'evento } */
  const flusso = (pre, ev, pc, f, o) => {
    const el = SL.el, e = EVENTI[ev], r = ripresa(ev, pc), w = o.w, gap = o.gap, h = o.h, x = o.x, y = o.y, y2 = y + h + 32, els = [];
    const ind = [pc - 4, pc, pc + e.lung], testi = ['add rbx, 8', e.ist, 'add rax, 1'];
    ind.forEach((a, k) => els.push(el.box(pre + 'i' + k, x + k * (w + gap), y, w, h, 'indirizzo ' + H(a), testi[k], k === 0 ? 'on' : k === 1 ? (f === 0 ? 'att' : f >= 1 && f <= 3 ? (e.ripresa === 'stessa' || e.ripresa === 'nessuna' ? 'err' : 'on') : r === a ? 'att' : e.ripresa === 'nessuna' ? 'err' : 'on') : f >= 4 && r === a ? 'att' : '', { cls: 'stretta' })));
    els.push(el.box(pre + 'e', x, y2, w, h, 'evento', f >= 1 ? e.nome : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'g', x + w + gap, y2, w, h, 'gestore del kernel', f === 3 ? 'al lavoro' : f > 3 ? 'ha finito' : 'in attesa', f === 3 ? 'att' : f > 3 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 's', x + 2 * (w + gap), y2, w, h, 'indirizzo salvato', f >= 2 ? (r ? H(r) : 'inaffidabile') : '·', f === 2 ? (r ? 'att' : 'err') : f > 2 ? (r ? 'on' : 'err') : '', { cls: 'stretta' }));
    els.push(el.linea(pre + 'l1', x + w + gap + w / 2, y + h, x + w + gap + w / 2, y2, f === 3 ? 'att' : f > 3 ? 'on' : ''));
    if (o.classe) els.push(el.box(pre + 'c', x, y2 + h + 20, w, h, 'classe dell’evento', f >= 1 ? e.classe : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'r', x + (o.classe ? w + gap : 0), y2 + h + 20, o.classe ? 2 * w + gap : 3 * w + 2 * gap, h, 'alla ripresa', f >= 4 ? (r ? 'RIP = ' + H(r) + (e.ripresa === 'stessa' ? ' · l’istruzione viene ripetuta' : ' · si prosegue con la seguente') : 'ripresa non garantita') : '·', f >= 4 ? (r ? 'att' : 'err') : '', { cls: 'stretta' }));
    return els;
  };
  return { H, EVENTI, ripresa, flusso };
})();
