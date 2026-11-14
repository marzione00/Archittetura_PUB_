'use strict';
/* Prova del capitolo 6.2: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const NS = (v) => I(v).concat([v + ' ns', v + 'ns']);
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const HEX = (v) => ['0x' + v.toString(16), '0x' + v.toString(16).toUpperCase(), v.toString(16) + 'h'];

  SL.registraProva('6.2', { domande: [
    // 6.2.1 · indirizzo fisico, oppure pagina e offset di un indirizzo virtuale
    (r) => {
      const v = r.int(1, 15), off = r.int(1, 4095), va = v * 4096 + off; let f = r.int(1, 15); if (f === v) f = v === 15 ? 1 : v + 1;
      if (r.int(0, 4) < 3) { const pa = f * 4096 + off, giuste = I(pa).concat(HEX(pa));
        return { u: '6.2.1', d: 'Le pagine sono di 4096 byte. La tabella di un processo associa alla pagina ' + v + ' il frame ' + f + '. Qual è, in decimale, l’indirizzo fisico del byte di indirizzo virtuale ' + va + '?', segnaposto: 'Un numero', giuste,
          ok: va + ' = ' + v + ' × 4096 + ' + off + '. L’indirizzo fisico è ' + f + ' × 4096 + ' + off + ' = ' + pa + '.',
          diagnosi: DIAG(giuste, [
            { se: I(va), msg: 'Questo è l’indirizzo virtuale. Sostituisci la pagina ' + v + ' con il frame ' + f + '.' },
            { se: I(f * 4096), msg: 'Questo è l’inizio del frame ' + f + '. Aggiungi l’offset, ' + off + '.' },
            { se: I(f + off), msg: 'Il numero del frame va moltiplicato per 4096 prima di aggiungere l’offset.' },
            { se: I(f * 4096 + va), msg: 'All’inizio del frame va aggiunto il solo offset, cioè il resto fra l’indirizzo virtuale e 4096.' }
          ]),
          altro: 'Il numero è diverso. Si determini l’offset, poi si applichi frame × 4096 + offset.',
          indizi: ['Offset: ' + va + ' − ' + v + ' × 4096 = ' + off + '.', 'Inizio del frame ' + f + ': ' + f * 4096 + '.', f * 4096 + ' + ' + off + ' = ' + pa + '.'],
          svolgimento: ['Pagina ' + v + ', offset ' + off + '.', 'Frame: ' + f + '.', 'Indirizzo fisico: ' + pa + '.'] }; }
      const cosa = r.int(0, 1), giuste = I(cosa === 0 ? v : off);
      return { u: '6.2.1', d: 'Le pagine sono di 4096 byte. Qual è ' + (cosa === 0 ? 'il numero di pagina' : 'l’offset') + ' dell’indirizzo virtuale ' + va + '?', segnaposto: 'Un numero', giuste,
        ok: va + ' = ' + v + ' × 4096 + ' + off + ': pagina ' + v + ', offset ' + off + '.',
        diagnosi: DIAG(giuste, [
          { se: I(cosa === 0 ? off : v), msg: cosa === 0 ? 'Questo è l’offset, cioè il resto. La pagina è il quoziente.' : 'Questo è il numero di pagina, cioè il quoziente. L’offset è il resto.' },
          { se: I(cosa === 0 ? v + 1 : va), msg: cosa === 0 ? 'Le pagine sono numerate da 0: il quoziente intero è ' + v + '.' : 'L’offset è sempre minore di 4096.' }
        ]),
        altro: 'Il numero è diverso. Si divida l’indirizzo per 4096: il quoziente è la pagina, il resto è l’offset.',
        indizi: [v + ' × 4096 = ' + v * 4096 + '.', va + ' − ' + v * 4096 + ' = ' + off + '.', 'Pagina ' + v + ', offset ' + off + '.'],
        svolgimento: [va + ' / 4096 = ' + v + ', con resto ' + off + '.', (cosa === 0 ? 'Pagina: ' + v : 'Offset: ' + off) + '.'] };
    },
    // 6.2.2 · esito di un accesso secondo residenza, regione e permesso
    (r) => {
      const cond = r.scegli(['residente', 'assente', 'fuori']), scr = r.int(0, 1) === 1, rw = r.int(0, 1) === 1, e = cond === 'fuori' || (scr && !rw) ? 2 : cond === 'assente' ? 1 : 0;
      const fb = e === 2 ? (cond === 'fuori' ? 'Nessuna regione contiene l’indirizzo: il kernel non ha nulla da caricare.' : 'La regione ammette soltanto la lettura, e l’istruzione vuole scrivere.') : e === 1 ? 'La pagina manca, e l’accesso è fra quelli ammessi dalla regione: il kernel la carica e fa ripetere l’istruzione.' : 'La pagina è residente e l’accesso è permesso: la MMU completa la traduzione da sola.';
      return { u: '6.2.2', d: 'Un’istruzione vuole ' + (scr ? 'scrivere' : 'leggere') + ' un byte. ' + (cond === 'fuori' ? 'L’indirizzo sta fuori da ogni regione del processo.' : 'L’indirizzo cade in una regione che ammette ' + (rw ? 'lettura e scrittura' : 'soltanto la lettura') + '. La pagina ' + (cond === 'residente' ? 'è residente in RAM.' : 'ha il bit di presenza a 0.')) + ' Come finisce la richiesta?', guida: 'Si scelga la risposta.', o: r.mescola([
        { t: 'L’accesso riesce subito, senza il kernel', ok: e === 0, fb },
        { t: 'Il kernel carica la pagina, e l’istruzione viene ripetuta', ok: e === 1, fb },
        { t: 'Il kernel segnala una violazione', ok: e === 2, fb }]) };
    },
    // 6.2.3 · page fault di una sequenza con LRU oppure FIFO
    (r) => {
      const nf = r.int(2, 3), lru = r.int(0, 1) === 0, n = r.int(6, 7), nomi = ['A', 'B', 'C', 'D', 'E'].slice(0, nf + 2), seq = []; for (let k = 0; k < n; k++) seq.push(r.scegli(nomi));
      const fr = []; let fault = 0; const righe = seq.map((pg, t) => { const i = fr.findIndex((x) => x.pg === pg); if (i >= 0) { fr[i].uso = t; return pg + ': presente.'; } fault++; if (fr.length < nf) { fr.push({ pg, carico: t, uso: t }); return pg + ': page fault, frame libero.'; } let v = 0; fr.forEach((x, k) => { if ((lru ? x.uso : x.carico) < (lru ? fr[v].uso : fr[v].carico)) v = k; }); const esce = fr[v].pg; fr[v] = { pg, carico: t, uso: t }; return pg + ': page fault, esce ' + esce + '.'; });
      const giuste = I(fault), distinte = new Set(seq).size;
      return { u: '6.2.3', d: 'Un programma chiede, nell’ordine, le pagine ' + seq.join(', ') + '. I frame sono ' + nf + ', all’inizio liberi. Quando sono tutti occupati, ' + (lru ? 'la politica LRU fa uscire la pagina usata meno di recente.' : 'la politica FIFO fa uscire la pagina caricata per prima.') + ' Quanti page fault avvengono?', segnaposto: 'Un numero', giuste,
        ok: 'Seguendo i frame richiesta per richiesta, i page fault sono ' + fault + '.',
        diagnosi: DIAG(giuste, [
          { se: I(distinte), msg: 'Questo è il numero delle pagine distinte. Una pagina scacciata e richiesta di nuovo provoca un altro page fault.' },
          { se: I(n), msg: 'Una richiesta che trova la pagina in RAM non è un page fault.' },
          { se: I(n - fault), msg: 'Queste sono le richieste che trovano la pagina presente. La domanda riguarda i page fault.' }
        ]),
        altro: 'Il numero è diverso. Si tenga l’elenco delle pagine residenti, con l’istante ' + (lru ? 'dell’ultimo uso.' : 'del caricamento.'),
        indizi: ['Le prime ' + nf + ' pagine distinte entrano nei frame liberi.', lru ? 'A frame pieni esce la pagina con l’ultimo uso più lontano.' : 'A frame pieni esce la pagina caricata da più tempo.', righe.join(' ')],
        svolgimento: righe.concat(['Page fault: ' + fault + '.']) };
    },
    // 6.2.4 · tempo medio con page fault, oppure sola quota
    (r) => {
      const base = r.scegli([50, 100, 200]), f = r.scegli([10, 20, 50, 100, 200, 500, 1000]), ms = r.scegli([1, 2, 4, 5, 10]), quota = f * ms, media = base + quota, cosa = r.int(0, 2) === 0 ? 1 : 0, v = cosa === 0 ? media : quota, giuste = NS(v);
      return { u: '6.2.4', d: 'Su un milione di richieste, ciascuna con ' + base + ' ns di servizio ordinario, avvengono ' + f + ' page fault. Ogni page fault aggiunge ' + ms + ' ms. ' + (cosa === 0 ? 'Qual è il tempo medio di una richiesta, in nanosecondi?' : 'Di quanti nanosecondi cresce, in media, il tempo di una richiesta a causa dei page fault?'), segnaposto: 'Un numero', giuste,
        ok: 'Quota dei page fault: ' + f + ' × ' + ms + ' = ' + quota + ' ns.' + (cosa === 0 ? ' Media: ' + base + ' + ' + quota + ' = ' + media + ' ns.' : ''),
        diagnosi: DIAG(giuste, [
          { se: NS(cosa === 0 ? quota : media), msg: cosa === 0 ? 'Questa è la quota dei page fault. Aggiungi i ' + base + ' ns del servizio ordinario.' : 'Questo è il tempo medio complessivo. La domanda riguarda la sola parte dovuta ai page fault.' },
          { se: NS(base + f), msg: 'Ogni page fault dura ' + ms + ' ms: la quota è ' + f + ' × ' + ms + ' ns.' },
          { se: NS(base + ms * 1000000), msg: 'Questo è il tempo di una singola richiesta con page fault. La media lo distribuisce su un milione di richieste.' },
          { se: NS(base), msg: 'I page fault sono rari, e ciascuno dura milioni di nanosecondi: sulla media lasciano il segno.' }
        ]),
        altro: 'Il valore è diverso. Si converta la penalità in nanosecondi, moltiplica per i page fault e si divida per un milione.',
        indizi: [ms + ' ms = ' + ms * 1000000 + ' ns.', 'Quota: ' + f + ' × ' + ms * 1000000 + ' / 1 000 000 = ' + quota + ' ns.', cosa === 0 ? base + ' + ' + quota + ' = ' + media + ' ns.' : 'La quota è ' + quota + ' ns.'],
        svolgimento: ['Attese totali: ' + f * ms + ' milioni di ns.', 'Quota per richiesta: ' + quota + ' ns.', 'Media: ' + media + ' ns.'] };
    }
  ] });
})();
