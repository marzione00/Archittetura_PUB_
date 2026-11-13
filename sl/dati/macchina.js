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
        return 'Avevi previsto: ' + NOMI[pred] + '. Esito: ' + NOMI[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.'
          : 'Senza segno ' + (ADD ? 'la somma vera vale ' + num(c.vero) + (c.cf ? ', oltre il massimo ' + num(max) + '.' : ', entro il massimo ' + num(max) + '.') : (c.cf ? 'il minuendo è più piccolo del sottraendo, e serve un prestito.' : 'il minuendo basta, e nessun prestito è richiesto.'))
          + ' Con segno il risultato vero vale ' + num(c.sv) + (c.of ? ', fuori dall’intervallo da ' + num(smin) + ' a ' + num(smax) + '.' : ', dentro l’intervallo da ' + num(smin) + ' a ' + num(smax) + '.'));
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

        P({ fase: 0 }, 0, 'Due configurazioni di bit', 'L’operazione lavora su ' + w + ' bit. I due operandi sono le configurazioni ' + A + ' e ' + B + (w === 16 ? ', scritte con quattro cifre esadecimali.' : ', scritte con due cifre esadecimali.') + ' Il processore le tratta come semplici file di bit.');
        P({ fase: 1, riga: 1 }, 0, 'Le due letture degli operandi', 'Chi guarda quei bit può leggerli in due modi. Senza segno valgono ' + num(p.a) + ' e ' + num(p.b) + '. In complemento a due su ' + w + ' bit valgono ' + num(c.sa) + ' e ' + num(c.sb) + (c.sa === p.a && c.sb === p.b ? ': il bit di segno è 0 in entrambi, e le due letture coincidono.' : ', perché dove il bit di segno vale 1 si toglie ' + num(max + 1) + '.'),
          { chiedi: ADD ? { d: 'La somma vera dei valori senza segno è ' + num(c.vero) + '. Su ' + w + ' bit il massimo è ' + num(max) + '. Uscirà un riporto?', o: ['Sì', 'No'], g: c.cf ? 0 : 1, no: c.cf ? num(c.vero) + ' supera ' + num(max) + ', quindi serve un bit in più.' : num(c.vero) + ' sta entro ' + num(max) + ', quindi i ' + w + ' bit bastano.' }
            : { d: 'Senza segno il minuendo vale ' + num(p.a) + ' e il sottraendo ' + num(p.b) + '. Per fare la sottrazione servirà un prestito oltre l’ultimo bit?', o: ['Sì', 'No'], g: c.cf ? 0 : 1, no: c.cf ? 'Il minuendo è più piccolo del sottraendo, quindi la sottrazione chiede un prestito dall’esterno.' : 'Il minuendo è grande almeno quanto il sottraendo, quindi nessun prestito è richiesto.' } });
        st.vis = true;
        P({ fase: 2 }, 1, 'Il risultato conservato', 'Il circuito ' + (ADD ? 'somma' : 'sottrae') + ' le due configurazioni colonna per colonna e conserva ' + w + ' bit. Il risultato è ' + R + ', lo stesso per entrambe le letture.', { calc: A + ' ' + SEGNO + ' ' + B + ' → ' + R });
        st.fl.CF = c.cf;
        P({ fase: 3, riga: 1, flag: ['CF'] }, 2, 'La lettura senza segno e CF', ADD ? 'Senza segno la somma vera è ' + num(p.a) + ' + ' + num(p.b) + ' = ' + num(c.vero) + '. ' + (c.cf ? 'Supera il massimo, ' + num(max) + ', quindi nei ' + w + ' bit resta ' + num(c.r) + ' e il riporto uscente accende CF.' : 'Sta entro il massimo, ' + num(max) + ', quindi il risultato conservato è quello giusto e CF vale 0.')
            : 'Senza segno la differenza vera è ' + num(p.a) + ' − ' + num(p.b) + ' = ' + num(c.vero) + '. ' + (c.cf ? 'È negativa, e fra i numeri senza segno i negativi mancano. La sottrazione prende un prestito dall’esterno, nei ' + w + ' bit resta ' + num(c.r) + ' e CF vale 1.' : 'È un numero senza segno valido, quindi il risultato conservato è quello giusto e CF vale 0.'),
          { calc: num(p.a) + ' ' + SEGNO + ' ' + num(p.b) + ' = ' + num(c.vero) + ' · CF = ' + c.cf, chiedi: { d: 'Con segno il risultato vero vale ' + num(c.sa) + ' ' + SEGNO + ' ' + (c.sb < 0 ? '(' + num(c.sb) + ')' : num(c.sb)) + ' = ' + num(c.sv) + '. Su ' + w + ' bit l’intervallo con segno va da ' + num(smin) + ' a ' + num(smax) + '. Il risultato vi rientra?', o: ['Sì', 'No'], g: c.of ? 1 : 0, no: c.of ? num(c.sv) + ' cade fuori dall’intervallo.' : num(c.sv) + ' cade dentro l’intervallo.' } });
        st.fl.OF = c.of;
        P({ fase: 4, riga: 2, flag: ['OF'] }, 3, 'La lettura con segno e OF', 'Con segno il risultato vero è ' + num(c.sa) + ' ' + SEGNO + ' ' + (c.sb < 0 ? '(' + num(c.sb) + ')' : num(c.sb)) + ' = ' + num(c.sv) + '. ' + (c.of ? 'Esce dall’intervallo da ' + num(smin) + ' a ' + num(smax) + ': i bit conservati, letti con segno, valgono ' + num(c.sr) + ', un numero di segno sbagliato. OF vale 1.' : 'Rientra nell’intervallo da ' + num(smin) + ' a ' + num(smax) + ', e i bit conservati letti con segno valgono proprio ' + num(c.sr) + '. OF vale 0.'),
          { calc: num(c.sa) + ' ' + SEGNO + ' ' + (c.sb < 0 ? '(' + num(c.sb) + ')' : num(c.sb)) + ' = ' + num(c.sv) + ' · OF = ' + c.of });
        if (!ADD) {
          st.fl.SF = c.sf; st.fl.ZF = c.zf;
          P({ fase: 5, flag: ['SF', 'ZF'] }, 4, 'SF e ZF', 'Gli altri due flag descrivono i bit del risultato conservato. SF copia il bit più a sinistra, che in ' + R + ' vale ' + c.sf + '. ZF vale 1 soltanto se tutti i bit sono zero, e qui vale ' + c.zf + '.', { calc: 'SF = ' + c.sf + ' · ZF = ' + c.zf });
        }
        P({ fase: 6 }, ADD ? 4 : 5, 'I flag insieme', (c.cf && c.of ? 'Il risultato è sbagliato in entrambe le letture, e i due flag lo segnalano.' : c.cf ? 'Il risultato è sbagliato per chi conta senza segno e giusto per chi usa il complemento a due.' : c.of ? 'Il risultato è giusto per chi conta senza segno e sbagliato per chi usa il complemento a due.' : 'Il risultato è giusto in entrambe le letture, e i due flag restano a 0.') + ' Il processore scrive sempre tutti i flag. Sta al programma, che conosce il significato dei propri dati, guardare quello che gli serve.',
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
