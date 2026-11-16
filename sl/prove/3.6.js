'use strict';
/* Prova del capitolo 3.6: una domanda per unità, sulla CPU con pipeline del caso di studio. */
(() => {
  const I = SL.scritture.intero, ESA = SL.scritture.esa, C = SL.isa, H = C.esa;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const PS = (v) => I(v).concat(I(v).map((x) => x + 'ps'));
  // le scritture accettate di un valore arrotondato al millesimo: 1.273, 1.27, 1.272 · 1.250, 1.25 · 2.000, 2.00, 2.0, 2
  const DEC3 = (x) => { const out = [x.toFixed(3)]; let s = out[0]; while (s.endsWith('0')) { s = s.slice(0, -1); if (s.endsWith('.')) { s = s.slice(0, -1); out.push(s); break; } out.push(s); } [x.toFixed(2), (Math.floor(x * 1000 + 1e-9) / 1000).toFixed(3)].forEach((v) => { if (!out.includes(v)) out.push(v); }); return out; };
  const V3 = (x) => x.toFixed(3).replace('.', ',');
  const STADI = ['F', 'D', 'E', 'M', 'W'], REG = ['rax', 'rcx', 'rdx', 'rbx', 'rsi', 'rdi'];

  SL.registraProva('3.6', { domande: [
    // 3.6.1 · il contenuto di un registro dopo il fronte
    (r) => {
      const n = r.int(5, 9), j = r.int(1, 4), c = r.int(Math.max(3, j), n), a = c + 1 - j, giuste = [String(a), 'i' + a];
      return { u: '3.6.1', d: 'Un flusso di ' + n + ' istruzioni indipendenti entra nella CPU con pipeline, una per ciclo dal ciclo 1. Quale istruzione contiene il registro ' + STADI[j] + ' immediatamente dopo il fronte che chiude il ciclo ' + c + '? Si risponda con il suo numero.', segnaposto: 'Un numero', giuste,
        ok: 'Durante il ciclo ' + c + ' l’istruzione I' + a + ' occupa lo stadio ' + STADI[j - 1] + '. Al fronte avanza di una posizione, nel registro ' + STADI[j] + '.',
        diagnosi: DIAG(giuste, [
          a - 1 >= 1 ? { se: [String(a - 1), 'i' + (a - 1)], msg: 'I' + (a - 1) + ' occupa lo stadio ' + STADI[j] + ' prima del fronte. Al fronte avanza di una posizione, e lascia il registro alla successiva.' } : null,
          { se: [String(a + 1), 'i' + (a + 1)], msg: 'Ogni istruzione avanza di una sola posizione per fronte.' },
          { se: [String(c), 'i' + c], msg: 'I' + c + ' durante il ciclo ' + c + ' è nello stadio F, e al fronte passa in D.' }
        ]),
        altro: 'Il numero è diverso. Si determini l’istruzione che durante il ciclo ' + c + ' occupa lo stadio ' + STADI[j - 1] + ': al fronte passa nel registro ' + STADI[j] + '.',
        indizi: ['Durante il ciclo ' + c + ' lo stadio F ospita I' + c + '.', 'Lo stadio ' + STADI[j - 1] + ' si trova ' + (j - 1 === 0 ? 'all’inizio' : j - 1 === 1 ? 'una posizione dopo F' : (j - 1) + ' posizioni dopo F') + ', e ospita I' + a + '.', 'Al fronte I' + a + ' passa nel registro ' + STADI[j] + '.'],
        svolgimento: ['Ciclo ' + c + ': lo stadio ' + STADI[j - 1] + ' ospita I' + a + '.', 'Al fronte ogni istruzione avanza di una posizione.', 'Dopo il fronte il registro ' + STADI[j] + ' contiene I' + a + '.'] };
    },
    // 3.6.2 · la selezione del PC dai valori dell'istruzione precedente
    (r) => {
      const pc = 0x40 + 4 * r.int(0, 200), tipo = r.scegli(['je', 'je', 'op', 'mr', 'ir']), cnd = r.int(0, 1), dest = 0x300 + 16 * r.int(0, 60);
      const X = { je: { t: 'je ' + H(dest), ic: 7, l: 9 }, op: { t: r.scegli(['add rax, rbx', 'sub rcx, rdx', 'or rsi, rdi']), ic: 6, l: 2 }, mr: { t: 'mov rax, 8(rbx)', ic: 4, l: 10 }, ir: { t: 'mov rdx, 291', ic: 3, l: 10 } }[tipo];
      const vp = pc + X.l, salta = tipo === 'je' && cnd === 1, giusto = salta ? dest : vp, giuste = ESA(giusto, 3);
      return { u: '3.6.2', d: 'L’istruzione completata nel ciclo precedente è `' + X.t + '`, all’indirizzo ' + H(pc) + (tipo === 'je' ? ', con pCnd = ' + cnd : '') + '. Quale indirizzo sceglie la selezione del PC per il prelievo? Si risponda in esadecimale.', segnaposto: 'Per esempio ' + H(pc + 16), giuste,
        ok: salta ? 'pIcode è la categoria di `je` e pCnd vale 1: il PC riceve pValC = ' + H(dest) + '.' : 'La condizione per pValC richiede un `je` con pCnd = 1. Il PC riceve pValP = ' + H(pc) + ' + ' + X.l + ' = ' + H(vp) + '.',
        diagnosi: DIAG(giuste, [
          tipo === 'je' ? { se: ESA(salta ? vp : dest, 3), msg: salta ? 'Con pCnd = 1 il PC riceve la destinazione, pValC.' : 'La destinazione è scelta soltanto con pCnd = 1. Qui pCnd vale 0.' } : null,
          { se: ESA(pc, 3), msg: 'Questo è l’indirizzo dell’istruzione precedente. Il prelievo riguarda la successiva.' },
          { se: ESA(pc + X.l + 1, 3), msg: 'La lunghezza di `' + X.t + '` è di ' + X.l + ' byte.' }
        ]),
        altro: 'Il valore è diverso. Si verifichi se pIcode è la categoria di `je` con pCnd = 1, e quindi si scelga fra pValC e pValP.',
        indizi: ['pIcode vale ' + X.ic + '.', tipo === 'je' ? 'pCnd vale ' + cnd + '.' : 'L’istruzione precedente non è un salto.', salta ? 'Il PC riceve pValC.' : 'pValP = ' + H(pc) + ' + ' + X.l + '.'],
        svolgimento: ['pIcode = ' + X.ic + (tipo === 'je' ? ', pCnd = ' + cnd : '') + '.', 'Condizione per pValC: ' + (salta ? 'soddisfatta.' : 'non soddisfatta.'), 'PC = ' + H(giusto) + '.'] };
    },
    // 3.6.3 · le nop necessarie, oppure il valore letto
    (r) => {
      const reg = r.mescola(REG), w = reg[0], rd = reg[1], v = r.int(2, 60), k0 = r.int(0, 2), cosa = r.int(0, 1), W = w.toUpperCase();
      if (cosa === 0) {
        const giusto = 3 - k0, giuste = I(giusto).concat(giusto === 0 ? ['nessuna', 'zero'] : []);
        return { u: '3.6.3', d: 'Fra `mov ' + w + ', ' + v + '` e `add ' + rd + ', ' + w + '` si trovano ' + (k0 === 0 ? 'zero istruzioni' : k0 === 1 ? 'un’istruzione indipendente' : k0 + ' istruzioni indipendenti') + '. Quante `nop` occorre aggiungere affinché `add` legga ' + W + ' = ' + v + '?', segnaposto: 'Un numero', giuste,
          ok: 'La regola delle tre istruzioni richiede tre istruzioni intermedie: ' + (k0 ? k0 + ' sono già presenti, e ne mancano ' + giusto + '.' : 'ne mancano tre.'),
          diagnosi: DIAG(giuste, [
            k0 ? { se: I(3), msg: 'Le istruzioni intermedie richieste sono tre in tutto, e ' + k0 + ' sono già presenti.' } : null,
            { se: I(4 - k0), msg: 'Fra le due istruzioni ne bastano tre: con una in più il ritardo sarebbe superfluo.' },
            { se: I(2 - k0 < 0 ? 0 : 2 - k0), msg: 'Con una nop in meno `add` sarebbe in D nel ciclo in cui ' + W + ' è scritto, e leggerebbe il valore precedente.' }
          ]),
          altro: 'Il numero è diverso. Fra le due istruzioni dipendenti devono trovarsi tre istruzioni.',
          indizi: ['La regola richiede tre istruzioni fra quella che scrive e quella che legge.', 'Ne sono già presenti ' + k0 + '.', '3 − ' + k0 + '.'],
          svolgimento: ['Istruzioni richieste fra le due: 3.', 'Già presenti: ' + k0 + '.', 'nop da aggiungere: ' + giusto + '.'] };
      }
      const k = r.int(0, 3), ok = k >= 3, giusta = ok ? String(v) : 'il valore precedente di ' + W;
      const perche = '`mov` è in W al ciclo 5, e ' + W + ' è leggibile dal ciclo 6. `add`, prelevata al ciclo ' + (2 + k) + ', è in D al ciclo ' + (3 + k) + (ok ? ': il valore è aggiornato.' : ': troppo presto.');
      return { u: '3.6.3', d: 'Il programma inizia con `mov ' + w + ', ' + v + '`, seguita da ' + (k === 0 ? 'nessuna `nop`' : k === 1 ? 'una `nop`' : k + ' `nop`') + ' e da `add ' + rd + ', ' + w + '`. Quale valore di ' + W + ' legge `add` nello stadio D?', guida: 'Si scelga la risposta.',
        o: [{ t: String(v), ok, fb: perche }, { t: 'Il valore precedente di ' + W, ok: !ok, fb: perche }, { t: 'Un valore inoltrato dallo stadio E', fb: 'Lo stadio D della CPU del caso di studio legge i valori soltanto dal banco dei registri. ' + perche }] };
    },
    // 3.6.4 · nop e cicli di una sequenza
    (r) => {
      const g = r.int(2, 9), vicino = r.int(0, 1) === 1, cosa = r.int(0, 2), n = 3 * g, nop = (vicino ? 3 : 2) * g, cicli = n + nop + 4, ordine = vicino ? 'L, U, I' : 'L, I, U';
      const testa = 'Il gruppo ' + ordine + ' è ripetuto ' + g + ' volte a partire dalla pipeline vuota. L legge una parola dalla memoria, U ne impiega il dato, I è indipendente dalle altre due. Le `nop` sono inserite secondo la regola delle tre istruzioni. ';
      if (cosa === 0) { const giuste = I(nop); return { u: '3.6.4', d: testa + 'Quante `nop` contiene la sequenza?', segnaposto: 'Un numero', giuste,
        ok: vicino ? 'In ogni gruppo U segue immediatamente L: tre nop per gruppo, ' + nop + ' complessive.' : 'In ogni gruppo I separa L da U: due nop per gruppo, ' + nop + ' complessive.',
        diagnosi: DIAG(giuste, [
          { se: I(vicino ? 2 * g : 3 * g), msg: vicino ? 'In quest’ordine U segue immediatamente L, e richiede tre nop.' : 'In quest’ordine fra L e U è già presente I, e bastano due nop.' },
          { se: I(vicino ? 3 : 2), msg: 'La situazione si ripete in ognuno dei ' + g + ' gruppi.' },
          { se: I(g), msg: 'Ogni gruppo richiede più di una nop.' }
        ]),
        altro: 'Il numero è diverso. Si consideri che cosa separa ogni L dalla propria U.',
        indizi: ['Fra L e U devono trovarsi tre istruzioni.', 'In quest’ordine fra L e U ' + (vicino ? 'non è presente alcuna istruzione.' : 'è presente I.'), 'I gruppi sono ' + g + '.'],
        svolgimento: ['Ordine: ' + ordine + '.', 'nop per gruppo: ' + (vicino ? 3 : 2) + '.', 'nop: ' + nop + '.'] }; }
      const giuste = I(cicli);
      return { u: '3.6.4', d: testa + 'Quanti cicli occupa la sequenza?', segnaposto: 'Un numero', giuste,
        ok: 'Le istruzioni utili sono ' + n + ', le nop ' + nop + ' e il riempimento vale 4 cicli: ' + n + ' + ' + nop + ' + 4 = ' + cicli + '.',
        diagnosi: DIAG(giuste, [
          { se: I(vicino ? n + 2 * g + 4 : n + 3 * g + 4), msg: vicino ? 'Questo è il conteggio dell’ordine L, I, U. In quest’ordine le nop sono tre per gruppo.' : 'Questo è il conteggio dell’ordine L, U, I. In questo caso basta una nop in meno per gruppo.' },
          { se: I(n + 4), msg: 'Questo è il flusso senza nop, che darebbe a U un valore non aggiornato.' },
          { se: I(cicli - 4), msg: 'Mancano i 4 cicli di riempimento.' },
          { se: I(5 * n), msg: 'Le istruzioni si sovrappongono, e a regime ne esce una per ciclo.' }
        ]),
        altro: 'Il numero è diverso. Si sommino le istruzioni utili, le nop e i 4 cicli di riempimento.',
        indizi: ['Le istruzioni utili sono 3 × ' + g + ' = ' + n + '.', 'Le nop sono ' + (vicino ? 3 : 2) + ' × ' + g + ' = ' + nop + '.', n + ' + ' + nop + ' + 4.'],
        svolgimento: ['Istruzioni utili: ' + n + '.', 'nop: ' + nop + '.', 'Totale: ' + n + ' + ' + nop + ' + 4 = ' + cicli + ' cicli.'] };
    },
    // 3.6.5 · tempo, risparmio, CPI e accelerazione
    (r) => {
      const g = r.scegli([2, 3, 4, 5, 6, 8, 10]), t = r.scegli([40, 50, 60, 65, 80, 100]), n = 3 * g, A = n + 3 * g + 4, B = n + 2 * g + 4, cosa = r.int(0, 3);
      const testa = 'Un programma ripete ' + g + ' volte il gruppo L, U, I, con tre `nop` per gruppo, a partire dalla pipeline vuota e con un periodo di ' + t + ' ps. Riordinato in L, I, U, ogni gruppo richiede due `nop`. ';
      if (cosa === 0) { const giuste = PS(g * t); return { u: '3.6.5', d: testa + 'Quanto tempo risparmia il riordino, in picosecondi?', segnaposto: 'Un tempo in ps', giuste,
        ok: 'Il riordino sostituisce una nop per gruppo: ' + g + ' cicli da ' + t + ' ps, cioè ' + (g * t) + ' ps.',
        diagnosi: DIAG(giuste, [
          { se: PS(t), msg: 'Il riordino sostituisce una nop per ogni gruppo, e i gruppi sono ' + g + '.' },
          { se: I(g), msg: 'Questi sono i cicli risparmiati. Il tempo si ottiene moltiplicandoli per il periodo.' },
          { se: PS(B * t), msg: 'Questo è il tempo della versione riordinata. Il risparmio è la differenza fra i due tempi.' },
          { se: PS(4 * t), msg: 'I 4 cicli di riempimento restano in entrambe le versioni. È eliminata una nop per gruppo.' }
        ]),
        altro: 'Il valore è diverso. Si contino le nop eliminate, una per gruppo, e si moltiplichi per il periodo.',
        indizi: ['La versione originale ha tre nop per gruppo, quella riordinata due.', 'Le nop eliminate sono ' + g + '.', g + ' × ' + t + '.'],
        svolgimento: ['Cicli originali: ' + n + ' + ' + (3 * g) + ' + 4 = ' + A + '.', 'Cicli riordinati: ' + n + ' + ' + (2 * g) + ' + 4 = ' + B + '.', 'Risparmio: ' + (A - B) + ' × ' + t + ' = ' + (g * t) + ' ps.'] }; }
      if (cosa === 1) { const giuste = PS(A * t); return { u: '3.6.5', d: testa + 'Quanto dura la versione originale, in picosecondi?', segnaposto: 'Un tempo in ps', giuste,
        ok: 'I cicli sono ' + n + ' + ' + (3 * g) + ' + 4 = ' + A + ', e il tempo ' + A + ' × ' + t + ' = ' + (A * t) + ' ps.',
        diagnosi: DIAG(giuste, [
          { se: PS(B * t), msg: 'Questo è il tempo della versione riordinata, con due nop per gruppo.' },
          { se: I(A), msg: 'Questi sono i cicli. Il tempo si ottiene moltiplicandoli per il periodo.' },
          { se: PS((A - 4) * t), msg: 'Mancano i 4 cicli di riempimento.' },
          { se: PS(n * t), msg: 'Mancano i 4 cicli di riempimento e le ' + (3 * g) + ' nop.' }
        ]),
        altro: 'Il valore è diverso. Si contino i cicli, comprese le nop e il riempimento, poi si moltiplichi per il periodo.',
        indizi: ['Le istruzioni utili sono 3 × ' + g + ' = ' + n + ', le nop ' + (3 * g) + '.', 'I cicli sono ' + n + ' + ' + (3 * g) + ' + 4 = ' + A + '.', A + ' × ' + t + '.'],
        svolgimento: ['Istruzioni utili: ' + n + '. nop: ' + (3 * g) + '.', 'Cicli: ' + n + ' + ' + (3 * g) + ' + 4 = ' + A + '.', 'Tempo: ' + A + ' × ' + t + ' = ' + (A * t) + ' ps.'] }; }
      if (cosa === 2) { const giuste = DEC3(A / B); return { u: '3.6.5', d: testa + 'Quanto vale l’accelerazione dovuta al riordino? Si arrotondi al millesimo.', segnaposto: 'Un numero con la virgola', giuste,
        ok: 'I cicli passano da ' + A + ' a ' + B + ', e il periodo è il medesimo: ' + A + ' / ' + B + ' = ' + V3(A / B) + '.',
        diagnosi: DIAG(giuste, [
          { se: DEC3(B / A), msg: 'Il rapporto è invertito. Il tempo originale è il dividendo, quello migliorato il divisore.' },
          { se: PS(g * t), msg: 'Questo è il risparmio in picosecondi. L’accelerazione è un rapporto fra i due tempi.' },
          { se: DEC3(6 / 5), msg: 'Questo è il valore al quale l’accelerazione si avvicina nei programmi molto lunghi. In questo caso sono rilevanti anche i 4 cicli di riempimento.' },
          { se: I(g), msg: 'Questa è la differenza in cicli. L’accelerazione è un rapporto.' }
        ]),
        altro: 'Il valore è diverso. Si dividano i cicli della versione originale per quelli della versione riordinata.',
        indizi: ['Cicli originali: ' + n + ' + ' + (3 * g) + ' + 4 = ' + A + '.', 'Cicli riordinati: ' + n + ' + ' + (2 * g) + ' + 4 = ' + B + '.', A + ' / ' + B + '.'],
        svolgimento: ['Tempo originale: ' + A + ' × ' + t + ' = ' + (A * t) + ' ps.', 'Tempo riordinato: ' + B + ' × ' + t + ' = ' + (B * t) + ' ps.', 'Accelerazione: ' + (A * t) + ' / ' + (B * t) + ' = ' + V3(A / B) + '.'] }; }
      const orig = r.int(0, 1) === 1, C = orig ? A : B, giuste = DEC3(C / n);
      return { u: '3.6.5', d: testa + 'Quanto vale il CPI della versione ' + (orig ? 'originale' : 'riordinata in L, I, U') + '? Si arrotondi al millesimo.', segnaposto: 'Un numero con la virgola', giuste,
        ok: 'I cicli sono ' + C + ' e le istruzioni utili ' + n + ': ' + C + ' / ' + n + ' = ' + V3(C / n) + '. Le nop non sono contate fra le istruzioni.',
        diagnosi: DIAG(giuste, [
          { se: DEC3((orig ? B : A) / n), msg: 'Questo è il CPI dell’altra versione. Va verificato il numero di nop per gruppo.' },
          { se: DEC3(C / (n + (orig ? 3 : 2) * g)), msg: 'Le nop sono state contate fra le istruzioni. Il CPI divide i cicli per le sole istruzioni utili.' },
          { se: DEC3(n / C), msg: 'La divisione è invertita. I cicli vanno divisi per le istruzioni.' },
          { se: DEC3((C - 4) / n), msg: 'Mancano i 4 cicli di riempimento.' },
          { se: I(C), msg: 'Questi sono i cicli. Il CPI si ottiene dividendoli per le ' + n + ' istruzioni.' }
        ]),
        altro: 'Il valore è diverso. Si contino i cicli di questa versione, poi si dividano per le istruzioni.',
        indizi: ['Le istruzioni utili sono ' + n + '.', 'I cicli sono ' + n + ' + ' + ((orig ? 3 : 2) * g) + ' + 4 = ' + C + '.', C + ' / ' + n + '.'],
        svolgimento: ['Istruzioni utili: ' + n + '.', 'Cicli: ' + C + '.', 'CPI = ' + C + ' / ' + n + ' = ' + V3(C / n) + '.'] };
    }
  ] });
})();
