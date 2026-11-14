'use strict';
/* Prova del capitolo 6.1: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const NS = (v) => I(v).concat([v + ' ns', v + 'ns']);
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };

  SL.registraProva('6.1', { domande: [
    // 6.1.1 · tempo totale, oppure numero di miss, di una breve sequenza di letture
    (r) => {
      const L = r.scegli([16, 32, 64]), t = r.int(1, 3), pen = r.scegli([20, 40, 50, 100]), n = r.int(3, 4), ind = [], viste = [];
      for (let k = 0; k < n; k++) ind.push(k > 0 && r.int(0, 1) === 0 ? Math.floor(ind[r.int(0, k - 1)] / L) * L + r.int(0, L - 1) : r.int(0, 4 * L - 1));
      let miss = 0; const righe = ind.map((a) => { const l = Math.floor(a / L), ok = viste.indexOf(l) >= 0; if (!ok) { viste.push(l); miss++; } return 'Byte ' + a + ': linea ' + l + ', ' + (ok ? 'hit, ' + t + ' ns.' : 'miss, ' + (t + pen) + ' ns.'); });
      const tot = n * t + miss * pen, cosa = r.int(0, 1), giuste = cosa === 0 ? NS(tot) : I(miss);
      return { u: '6.1.1', d: 'La cache è vuota, e può contenere tutte le linee che servono. Le linee sono di ' + L + ' byte. Una consultazione costa ' + t + ' ns, e un rifornimento ' + pen + ' ns in più. Il processore legge, nell’ordine, i byte ' + ind.join(', ') + '. ' + (cosa === 0 ? 'Quanti nanosecondi servono in tutto?' : 'Quante letture finiscono in miss?'), segnaposto: 'Un numero', giuste,
        ok: cosa === 0 ? n + ' consultazioni e ' + miss + (miss === 1 ? ' rifornimento: ' : ' rifornimenti: ') + n + ' × ' + t + ' + ' + miss + ' × ' + pen + ' = ' + tot + ' ns.' : 'Le linee diverse toccate sono ' + miss + ', e ciascuna costa un miss alla prima lettura.',
        diagnosi: DIAG(giuste, cosa === 0 ? [
          { se: NS(n * (t + pen)), msg: 'Hai contato un rifornimento per ogni lettura. Una linea già in cache si paga con la sola consultazione.' },
          { se: NS(miss * pen), msg: 'Mancano le consultazioni: ogni lettura, hit o miss, paga ' + t + ' ns.' },
          { se: NS(miss * (t + pen)), msg: 'Anche gli hit pagano la consultazione.' }
        ] : [
          { se: I(n), msg: 'Una lettura che cade in una linea già arrivata in cache è un hit.' },
          { se: I(n - miss), msg: 'Questo è il numero degli hit. La domanda riguarda i miss.' }
        ]),
        altro: 'Il numero è diverso. Si calcoli per ogni byte la linea, e si controlli se è già stata letta.',
        indizi: ['La linea di un byte è il quoziente intero fra indirizzo e ' + L + '.', righe.join(' '), cosa === 0 ? 'Totale: ' + tot + ' ns.' : 'Miss: ' + miss + '.'],
        svolgimento: righe.concat([cosa === 0 ? 'Totale: ' + tot + ' ns.' : 'Miss: ' + miss + '.']) };
    },
    // 6.1.2 · indice o tag di un indirizzo, oppure hit di una sequenza di blocchi
    (r) => {
      if (r.int(0, 1) === 0) { const P = r.scegli([2, 4, 8]), b = r.int(1, 31), a = b * 64 + r.int(0, 63), ind = b % P, tag = Math.floor(b / P), cosa = r.int(0, 1), v = cosa === 0 ? ind : tag, giuste = I(v);
        return { u: '6.1.2', d: 'Una cache ha ' + P + ' posizioni, con blocchi di 64 byte. Ogni blocco ha una sola posizione ammessa, data dal resto fra il suo numero e ' + P + '. Qual è ' + (cosa === 0 ? 'l’indice' : 'il tag') + ' per l’indirizzo ' + a + '?', segnaposto: 'Un numero', giuste,
          ok: a + ' / 64 = ' + b + '. ' + b + ' diviso ' + P + ' dà quoziente ' + tag + ' e resto ' + ind + ': indice ' + ind + ', tag ' + tag + '.',
          diagnosi: DIAG(giuste, [
            { se: I(cosa === 0 ? tag : ind), msg: cosa === 0 ? 'Questo è il tag, cioè il quoziente. L’indice è il resto.' : 'Questo è l’indice, cioè il resto. Il tag è il quoziente.' },
            { se: I(b), msg: 'Questo è il numero del blocco. Dividilo per ' + P + '.' },
            { se: I(a % 64), msg: 'Questa è la posizione del byte dentro il blocco. Serve il numero del blocco.' }
          ]),
          altro: 'Il numero è diverso. Si calcoli il blocco, poi lo si divida per il numero di posizioni.',
          indizi: ['Blocco: ' + a + ' / 64 = ' + b + '.', b + ' = ' + P + ' × ' + tag + ' + ' + ind + '.', (cosa === 0 ? 'Indice: ' + ind : 'Tag: ' + tag) + '.'],
          svolgimento: ['Blocco: ' + b + '.', 'Indice: ' + ind + '.', 'Tag: ' + tag + '.'] }; }
      const P = r.scegli([2, 4]), n = r.int(5, 7), seq = []; for (let k = 0; k < n; k++) seq.push(r.int(0, P + 2));
      const pos = []; let hit = 0; const righe = seq.map((b) => { const i = b % P, ok = pos[i] === b; if (ok) hit++; const era = pos[i]; pos[i] = b; return 'Blocco ' + b + ', posizione ' + i + ': ' + (ok ? 'hit.' : era == null ? 'miss, la posizione era vuota.' : 'miss, c’era il blocco ' + era + '.'); });
      const giuste = I(hit), ripet = n - new Set(seq).size;
      return { u: '6.1.2', d: 'Una cache ha ' + P + ' posizioni, e ogni blocco ha una sola posizione ammessa: il resto fra il suo numero e ' + P + '. La cache è vuota. Il programma chiede, nell’ordine, i blocchi ' + seq.join(', ') + '. Quanti hit si contano?', segnaposto: 'Un numero', giuste,
        ok: 'Seguendo le posizioni una lettura per volta, gli hit sono ' + hit + '.',
        diagnosi: DIAG(giuste, [
          { se: I(ripet), msg: 'Hai contato ogni blocco già chiesto in precedenza. Un blocco può essere stato scacciato da un altro con lo stesso indice.' },
          { se: I(n - hit), msg: 'Questo è il numero dei miss. La domanda riguarda gli hit.' },
          { se: I(n), msg: 'La cache è vuota all’inizio: la prima lettura di ogni blocco è un miss.' }
        ]),
        altro: 'Il numero è diverso. Si tenga traccia, per ogni posizione, del blocco che la occupa.',
        indizi: ['La posizione di un blocco è il resto fra il suo numero e ' + P + '.', 'Un hit richiede che nella posizione ci sia proprio il blocco chiesto.', righe.join(' ')],
        svolgimento: righe.concat(['Hit: ' + hit + '.']) };
    },
    // 6.1.3 · tempo medio di accesso, oppure tempo totale
    (r) => {
      const t = r.int(1, 4), m = r.scegli([5, 10, 20, 25, 50]), pen = r.scegli([20, 40, 60, 80, 100, 200]), amat = t + m * pen / 100, fr = String(m / 100).replace('.', ',');
      if (r.int(0, 1) === 0) { const giuste = NS(amat);
        return { u: '6.1.3', d: 'Su cento letture, ' + m + ' finiscono in miss. La consultazione costa ' + t + ' ns, e la penalità di miss ' + pen + ' ns. Quanto vale il tempo medio di accesso, in nanosecondi?', segnaposto: 'Un numero', giuste,
          ok: t + ' + ' + fr + ' × ' + pen + ' = ' + amat + ' ns.',
          diagnosi: DIAG(giuste, [
            { se: NS(amat - t), msg: 'Questo è il contributo delle penalità. Aggiungi la consultazione, pagata da tutte le letture.' },
            { se: NS(t + pen), msg: 'Questo è il tempo di un singolo miss. La penalità pesa soltanto per ' + m + ' letture su cento.' },
            { se: NS(100 * t + m * pen), msg: 'Questo è il tempo totale delle cento letture. Dividilo per cento.' }
          ]),
          altro: 'Il valore è diverso. Si applichi AMAT = consultazione + frazione di miss × penalità.',
          indizi: ['Frazione di miss: ' + m + ' / 100 = ' + fr + '.', fr + ' × ' + pen + ' = ' + (m * pen / 100) + ' ns.', t + ' + ' + (m * pen / 100) + ' = ' + amat + ' ns.'],
          svolgimento: ['Frazione di miss: ' + fr + '.', 'Contributo delle penalità: ' + (m * pen / 100) + ' ns.', 'AMAT: ' + amat + ' ns.'] }; }
      const k = r.int(1, 5), N = 100 * k, M = m * k, tot = N * t + M * pen, giuste = NS(tot);
      return { u: '6.1.3', d: 'Un programma esegue ' + N + ' letture, con ' + M + ' miss. La consultazione costa ' + t + ' ns, e la penalità di miss ' + pen + ' ns. Quanti nanosecondi servono in tutto?', segnaposto: 'Un numero', giuste,
        ok: N + ' × ' + t + ' + ' + M + ' × ' + pen + ' = ' + tot + ' ns.',
        diagnosi: DIAG(giuste, [
          { se: NS(M * pen), msg: 'Mancano le consultazioni: ' + N + ' letture da ' + t + ' ns.' },
          { se: NS((N - M) * t + M * pen), msg: 'La consultazione è pagata da tutte le letture, miss compresi.' },
          { se: NS(amat), msg: 'Questa è la media. La domanda riguarda il totale.' },
          { se: NS(N * (t + pen)), msg: 'La penalità è pagata soltanto dai ' + M + ' miss.' }
        ]),
        altro: 'Il totale è diverso. Somma le consultazioni di tutte le letture e le penalità dei soli miss.',
        indizi: ['Consultazioni: ' + N + ' × ' + t + ' = ' + N * t + ' ns.', 'Penalità: ' + M + ' × ' + pen + ' = ' + M * pen + ' ns.', N * t + ' + ' + M * pen + ' = ' + tot + ' ns.'],
        svolgimento: ['Consultazioni: ' + N * t + ' ns.', 'Penalità: ' + M * pen + ' ns.', 'Totale: ' + tot + ' ns.'] };
    }
  ] });
})();
