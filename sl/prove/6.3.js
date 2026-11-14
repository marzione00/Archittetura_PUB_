'use strict';
/* Prova del capitolo 6.3: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const H = (v) => '0x' + v.toString(16).toUpperCase();
  const HEX = (v) => ['0x' + v.toString(16), H(v), v.toString(16), v.toString(16).toUpperCase(), v.toString(16) + 'h'];

  SL.registraProva('6.3', { domande: [
    // 6.3.1 · indirizzo della voce, oppure indirizzo fisico dalla voce
    (r) => {
      const base = r.scegli([0x100000, 0x200000, 0x40000]), vpn = r.int(1, 15), off = r.int(1, 1023), va = vpn * 1024 + off;
      if (r.int(0, 1) === 0) { const ind = base + 8 * vpn, giuste = HEX(ind);
        return { u: '6.3.1', d: 'Le pagine sono da 1024 byte. La tabella delle pagine comincia a ' + H(base) + ', con voci da 8 byte. A quale indirizzo si trova la voce da leggere per tradurre l’indirizzo virtuale ' + va + '? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1000', giuste,
          ok: va + ' / 1024 = ' + vpn + ', e ' + vpn + ' × 8 = ' + 8 * vpn + ' = ' + H(8 * vpn) + ': la voce sta a ' + H(ind) + '.',
          diagnosi: DIAG(giuste, [
            { se: HEX(base + vpn), msg: 'Ogni voce occupa 8 byte: l’indice ' + vpn + ' va moltiplicato per 8.' },
            { se: [H(base).slice(0, -2) + String(8 * vpn).padStart(2, '0'), '0x' + (H(base).slice(2, -2) + String(8 * vpn).padStart(2, '0')).toLowerCase()], msg: 'Hai accostato alla base il valore decimale ' + 8 * vpn + '. In esadecimale si scrive ' + H(8 * vpn) + '.' },
            { se: HEX(base + 8 * va), msg: 'L’indice è il solo numero di pagina, ' + vpn + '.' }
          ]),
          altro: 'L’indirizzo è diverso. Si calcoli il numero di pagina, moltiplicalo per 8 e lo si sommi alla base.',
          indizi: ['Numero di pagina: ' + va + ' / 1024 = ' + vpn + '.', vpn + ' × 8 = ' + 8 * vpn + ', cioè ' + H(8 * vpn) + '.', H(base) + ' + ' + H(8 * vpn) + ' = ' + H(ind) + '.'],
          svolgimento: ['VPN: ' + vpn + '.', 'Spostamento: ' + H(8 * vpn) + '.', 'Indirizzo della voce: ' + H(ind) + '.'] }; }
      const pfn = r.int(2, 40), pte = 2 * pfn + 1, pa = pfn * 1024 + off, giuste = I(pa).concat(HEX(pa));
      return { u: '6.3.1', d: 'Le pagine sono da 1024 byte, e ogni voce della tabella vale 2 × PFN + valid. Per l’indirizzo virtuale ' + va + ' il programma legge la voce ' + pte + '. Qual è, in decimale, l’indirizzo fisico?', segnaposto: 'Un numero', giuste,
        ok: 'Offset: ' + off + '. Frame: (' + pte + ' − 1) / 2 = ' + pfn + '. Indirizzo fisico: ' + pfn + ' × 1024 + ' + off + ' = ' + pa + '.',
        diagnosi: DIAG(giuste, [
          { se: I(pte * 1024 + off), msg: 'Hai usato il valore della voce come frame. Il frame è la metà intera: ' + pfn + '.' },
          { se: I(pfn * 1024), msg: 'Questo è l’inizio del frame ' + pfn + '. Aggiungi l’offset, ' + off + '.' },
          { se: I(pfn * 1024 + va), msg: 'All’inizio del frame va aggiunto il solo offset, ' + off + '.' }
        ]),
        altro: 'Il numero è diverso. Si ricavi offset e frame, poi si applichi frame × 1024 + offset.',
        indizi: ['Offset: ' + va + ' − ' + vpn + ' × 1024 = ' + off + '.', 'Frame: (' + pte + ' − 1) / 2 = ' + pfn + '.', pfn + ' × 1024 + ' + off + ' = ' + pa + '.'],
        svolgimento: ['Offset: ' + off + '.', 'Frame: ' + pfn + '.', 'Indirizzo fisico: ' + pa + '.'] };
    },
    // 6.3.2 · decodificare, oppure costruire, una voce
    (r) => {
      if (r.int(0, 1) === 0) { const v = r.int(4, 120), dir = r.int(0, 2) === 0, e = dir ? 1 : v % 2 === 1 ? 0 : 2;
        const fb = dir ? 'Nel formato diretto tutti i bit sono il numero del frame.' : v % 2 === 1 ? v + ' è dispari: la voce è valida, e il frame è (' + v + ' − 1) / 2 = ' + Math.floor(v / 2) + '.' : v + ' è pari: il bit di validità vale 0.';
        return { u: '6.3.2', d: 'Una voce della tabella delle pagine contiene ' + v + '. Il formato è ' + (dir ? '«PFN diretto»: voce = PFN.' : '«PFN e bit valido»: voce = 2 × PFN + valid.') + ' Che cosa indica?', guida: 'Si scelga la risposta.', o: r.mescola([
          { t: 'Il frame ' + Math.floor(v / 2), ok: e === 0, fb },
          { t: 'Il frame ' + v, ok: e === 1, fb },
          { t: 'Nulla: la voce è invalida', ok: e === 2, fb }]) }; }
      const f = r.int(2, 60), valida = r.int(0, 2) > 0, v = 2 * f + (valida ? 1 : 0), giuste = I(v);
      return { u: '6.3.2', d: 'Nel formato voce = 2 × PFN + valid, quale valore ha una voce ' + (valida ? 'valida' : 'invalida') + ' il cui campo PFN contiene ' + f + '?', segnaposto: 'Un numero', giuste,
        ok: '2 × ' + f + ' + ' + (valida ? 1 : 0) + ' = ' + v + '.',
        diagnosi: DIAG(giuste, [
          { se: I(valida ? 2 * f : 2 * f + 1), msg: valida ? 'Questa voce ha il bit di validità a 0. Una voce valida è dispari.' : 'Questa voce ha il bit di validità a 1. Una voce invalida è pari.' },
          { se: I(f), msg: 'Il PFN va spostato di una posizione a sinistra, cioè moltiplicato per 2.' },
          { se: I(f + 1), msg: 'Il PFN va moltiplicato per 2 prima di aggiungere il bit di validità.' }
        ]),
        altro: 'Il valore è diverso. Si applichi la formula con PFN ' + f + ' e valid ' + (valida ? 1 : 0) + '.',
        indizi: ['2 × ' + f + ' = ' + 2 * f + '.', 'valid vale ' + (valida ? 1 : 0) + '.', 2 * f + ' + ' + (valida ? 1 : 0) + ' = ' + v + '.'],
        svolgimento: ['2 × ' + f + ' = ' + 2 * f + '.', 'Voce: ' + v + '.'] };
    },
    // 6.3.3 · il contenuto di un registro dopo uno scorrimento o una maschera
    (r) => {
      const n = r.scegli([10, 12]), g = Math.pow(2, n), vpn = r.int(1, 20), off = r.int(1, g - 1), va = vpn * g + off, cosa = r.int(0, 2);
      if (cosa === 2) { const pfn = r.int(2, 30), v = pfn * g, giuste = I(v).concat(HEX(v));
        return { u: '6.3.3', d: 'RAX contiene il numero di frame ' + pfn + '. Quanto contiene, in decimale, dopo l’istruzione shl rax, ' + n + '?', segnaposto: 'Un numero', giuste,
          ok: 'Scorrere a sinistra di ' + n + ' bit moltiplica per ' + g + ': ' + pfn + ' × ' + g + ' = ' + v + '.',
          diagnosi: DIAG(giuste, [
            { se: I(pfn * n), msg: 'Lo scorrimento di ' + n + ' bit moltiplica per 2 alla ' + n + ', cioè per ' + g + '.' },
            { se: I(pfn + g), msg: 'Lo scorrimento moltiplica: ' + pfn + ' × ' + g + '.' }
          ]),
          altro: 'Il numero è diverso. Scorrere a sinistra di ' + n + ' bit equivale a moltiplicare per ' + g + '.',
          indizi: ['2 alla ' + n + ' vale ' + g + '.', 'shl rax, ' + n + ' moltiplica RAX per ' + g + '.', pfn + ' × ' + g + ' = ' + v + '.'],
          svolgimento: ['Fattore: ' + g + '.', 'RAX: ' + v + '.'] }; }
      const v = cosa === 0 ? vpn : off, giuste = I(v).concat(HEX(v));
      return { u: '6.3.3', d: (cosa === 0 ? 'RAX' : 'RCX') + ' contiene l’indirizzo virtuale ' + va + '. Quanto contiene, in decimale, dopo l’istruzione ' + (cosa === 0 ? 'shr rax, ' + n : 'and rcx, ' + (g - 1)) + '?', segnaposto: 'Un numero', giuste,
        ok: va + ' = ' + vpn + ' × ' + g + ' + ' + off + '. ' + (cosa === 0 ? 'Lo scorrimento conserva il quoziente: ' + vpn + '.' : 'La maschera conserva il resto: ' + off + '.'),
        diagnosi: DIAG(giuste, [
          { se: I(cosa === 0 ? off : vpn), msg: cosa === 0 ? 'Questo è il resto, cioè l’offset. Lo scorrimento a destra conserva il quoziente.' : 'Questo è il quoziente, cioè il numero di pagina. La maschera conserva i ' + n + ' bit più bassi, cioè il resto.' },
          { se: I(va), msg: cosa === 0 ? 'Lo scorrimento a destra di ' + n + ' bit divide per ' + g + '.' : 'La maschera ' + (g - 1) + ' azzera tutti i bit sopra i ' + n + ' più bassi.' }
        ]),
        altro: 'Il numero è diverso. Si scriva ' + va + ' come quoziente × ' + g + ' + resto.',
        indizi: [vpn + ' × ' + g + ' = ' + vpn * g + '.', va + ' − ' + vpn * g + ' = ' + off + '.', cosa === 0 ? 'RAX contiene il quoziente: ' + vpn + '.' : 'RCX contiene il resto: ' + off + '.'],
        svolgimento: [va + ' = ' + vpn + ' × ' + g + ' + ' + off + '.', (cosa === 0 ? 'RAX: ' + vpn : 'RCX: ' + off) + '.'] };
    },
    // 6.3.4 · byte oltre il confine, oppure esito del controllo di una richiesta
    (r) => {
      const pg = r.int(1, 6), d = r.int(1, 7), n = r.scegli([2, 4, 8]), va = (pg + 1) * 4096 - d, oltre = Math.max(0, n - d);
      if (r.int(0, 4) < 3) { const giuste = I(oltre);
        return { u: '6.3.4', d: 'Le pagine sono da 4096 byte. Una lettura di ' + n + ' byte comincia all’indirizzo ' + H(va) + '. Quanti byte cadono nella pagina successiva?', segnaposto: 'Un numero', giuste,
          ok: 'Fino alla fine della pagina, ' + H((pg + 1) * 4096 - 1) + ', ci sono ' + d + ' byte. ' + (oltre ? 'Ne restano ' + n + ' − ' + d + ' = ' + oltre + '.' : 'La lettura finisce prima del confine.'),
          diagnosi: DIAG(giuste, [
            { se: I(Math.min(n, d)), msg: 'Questi sono i byte nella prima pagina. La domanda riguarda quelli oltre il confine.' },
            { se: I(n), msg: 'I primi byte stanno ancora nella pagina di partenza, che finisce a ' + H((pg + 1) * 4096 - 1) + '.' },
            oltre > 0 ? { se: I(0), msg: 'L’ultimo byte sta a ' + H(va + n - 1) + ', oltre la fine della pagina.' } : { se: I(n - 1), msg: 'L’ultimo byte sta a ' + H(va + n - 1) + ', ancora dentro la pagina.' }
          ]),
          altro: 'Il numero è diverso. Conta i byte da ' + H(va) + ' alla fine della pagina, e toglili dal totale.',
          indizi: ['La pagina finisce a ' + H((pg + 1) * 4096 - 1) + '.', 'Da ' + H(va) + ' alla fine ci sono ' + d + ' byte.', oltre ? n + ' − ' + d + ' = ' + oltre + '.' : 'I byte richiesti sono ' + n + ', e non superano il confine.'],
          svolgimento: ['Ultimo indirizzo: ' + H(va + n - 1) + '.', 'Byte nella prima pagina: ' + Math.min(n, d) + '.', 'Byte nella successiva: ' + oltre + '.'] }; }
      const voci = r.int(0, 2) === 0 ? pg + 1 : pg + 2, v1 = 2 * r.int(2, 30) + 1, v2 = 2 * r.int(2, 30) + r.int(0, 1), e = oltre === 0 ? 0 : voci === pg + 1 ? 2 : v2 % 2 === 0 ? 1 : 0;
      const fb = oltre === 0 ? 'La lettura resta nella pagina ' + pg + ', la cui voce è dispari, e quindi valida.' : e === 2 ? 'La richiesta tocca anche la pagina ' + (pg + 1) + ', e la tabella arriva all’indice ' + pg + '.' : e === 1 ? 'La richiesta tocca anche la pagina ' + (pg + 1) + ', la cui voce, ' + v2 + ', è pari.' : 'Le due voci toccate, ' + v1 + ' e ' + v2 + ', sono entrambe dispari.';
      return { u: '6.3.4', d: 'Le pagine sono da 4096 byte, e le voci valgono 2 × PFN + valid. La tabella ha ' + voci + ' voci, con indici da 0 a ' + (voci - 1) + '. La voce ' + pg + ' vale ' + v1 + (voci === pg + 2 ? ', e la voce ' + (pg + 1) + ' vale ' + v2 : '') + '. Un programma chiede ' + n + ' byte a partire da ' + H(va) + '. Come finisce il controllo?', guida: 'Si scelga la risposta.', o: r.mescola([
        { t: 'Accettata: ogni byte ha un indirizzo fisico', ok: e === 0, fb },
        { t: 'Rifiutata: una voce è invalida', ok: e === 1, fb },
        { t: 'Rifiutata: una pagina è fuori dalla tabella', ok: e === 2, fb }]) };
    }
  ] });
})();
