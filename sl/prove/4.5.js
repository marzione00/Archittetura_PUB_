'use strict';
/* Prova del capitolo 4.5: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const CON = (v, coda) => I(v).concat(coda.map((c) => v + c));
  const MS = (v) => CON(v, ['ms', 'millisecondi']), US = (v) => CON(v, ['µs', 'μs', 'us', 'microsecondi']), CIL = (v) => CON(v, ['cilindri']);
  const FR = { 1: 'un quarto di giro', 2: 'mezzo giro', 3: 'tre quarti di giro' };

  SL.registraProva('4.5', { domande: [
    // 4.5.1 · durata di un giro, attesa media, oppure tempo fino al primo byte
    (r) => {
      const D = r.scegli([[3000, 20, [1, 2, 3]], [5000, 12, [1, 2, 3]], [7500, 8, [1, 2, 3]], [15000, 4, [1, 2, 3]], [6000, 10, [2]], [10000, 6, [2]]]), rpm = D[0], giro = D[1], cosa = r.int(0, 3);
      if (cosa === 0) { const giuste = MS(giro); return { u: '4.5.1', d: 'Un disco ruota a ' + rpm + ' giri al minuto. Quanti millisecondi dura un giro?', segnaposto: 'Un numero', giuste,
        ok: '60 000 ÷ ' + rpm + ' = ' + giro + ' ms.',
        diagnosi: DIAG(giuste, [
          { se: MS(rpm / 60), msg: 'Questi sono i giri al secondo. La durata di un giro è 60 000 ms diviso i giri al minuto.' },
          { se: MS(giro / 2), msg: 'Questo è mezzo giro, l’attesa media. Un giro intero dura il doppio.' }
        ]),
        altro: 'Il valore è diverso. Si dividano i millisecondi di un minuto per i giri al minuto.',
        indizi: ['Un minuto vale 60 000 ms.', 'In tale tempo il disco compie ' + rpm + ' giri.', '60 000 ÷ ' + rpm + ' = ' + giro + '.'],
        svolgimento: ['Millisecondi in un minuto: 60 000.', 'Giri in un minuto: ' + rpm + '.', 'Un giro: ' + giro + ' ms.'] }; }
      if (cosa === 1) { const giuste = MS(giro / 2); return { u: '4.5.1', d: 'Un disco ruota a ' + rpm + ' giri al minuto. Quanto vale, in media, il ritardo di rotazione, in millisecondi?', segnaposto: 'Un numero', giuste,
        ok: 'Un giro dura ' + giro + ' ms, e in media si attende mezzo giro: ' + giro / 2 + ' ms.',
        diagnosi: DIAG(giuste, [
          { se: MS(giro), msg: 'Questa è la durata di un giro intero. In media il settore dista mezzo giro.' },
          { se: MS(rpm / 60), msg: 'Questi sono i giri al secondo. Occorre anzitutto la durata di un giro: 60 000 ÷ ' + rpm + '.' }
        ]),
        altro: 'Il valore è diverso. Si calcoli la durata di un giro e se ne prenda la metà.',
        indizi: ['Un giro: 60 000 ÷ ' + rpm + ' ms.', 'Un giro dura ' + giro + ' ms.', 'Metà giro: ' + giro / 2 + ' ms.'],
        svolgimento: ['Un giro: 60 000 ÷ ' + rpm + ' = ' + giro + ' ms.', 'Attesa media: ' + giro + ' ÷ 2 = ' + giro / 2 + ' ms.'] }; }
      const k = r.scegli(D[2]), s = r.int(2, 12), rot = giro * k / 4, v = s + rot, giuste = MS(v);
      return { u: '4.5.1', d: 'Un disco ruota a ' + rpm + ' giri al minuto. Il seek dura ' + s + ' ms, e all’arrivo della testina sul cilindro manca ' + FR[k] + ' al settore richiesto. Dopo quanti millisecondi è leggibile il primo byte?', segnaposto: 'Un numero', giuste,
        ok: 'Un giro dura ' + giro + ' ms, e ' + FR[k] + ' vale ' + rot + ' ms. ' + s + ' + ' + rot + ' = ' + v + ' ms.',
        diagnosi: DIAG(giuste, [
          { se: MS(rot), msg: 'Questa è la sola rotazione residua. Essa è preceduta dal seek, di ' + s + ' ms.' },
          { se: MS(s + giro), msg: 'È stato sommato un giro intero. Ne manca soltanto ' + FR[k] + '.' },
          k !== 2 ? { se: MS(s + giro / 2), msg: 'Mezzo giro è l’attesa media. In questo caso manca ' + FR[k] + '.' } : null,
          { se: MS(s), msg: 'Questo è il solo seek. Segue l’attesa che il settore giunga sotto la testina.' }
        ]),
        altro: 'Il valore è diverso. Si calcoli la durata di un giro, se ne prenda la frazione indicata e la si sommi al seek.',
        indizi: ['Un giro dura 60 000 ÷ ' + rpm + ' = ' + giro + ' ms.', 'La frazione mancante vale ' + giro + ' × ' + k + ' ÷ 4 = ' + rot + ' ms.', s + ' + ' + rot + ' = ' + v + '.'],
        svolgimento: ['Un giro: ' + giro + ' ms.', 'Rotazione residua: ' + rot + ' ms.', 'Seek: ' + s + ' ms.', 'Primo byte: ' + v + ' ms.'] };
    },
    // 4.5.2 · ultimo blocco, byte di partenza, oppure tempo di servizio
    (r) => {
      const b = r.scegli([512, 1024, 2048, 4096]), l = r.int(1, 200), n = r.scegli([4, 8, 16, 32, 64]), cosa = r.int(0, 2);
      if (cosa === 0) { const v = l + n - 1, giuste = I(v); return { u: '4.5.2', d: 'Una lettura ha inizio al blocco ' + l + ' e comprende ' + n + ' blocchi consecutivi. Qual è il numero dell’ultimo blocco letto?', segnaposto: 'Un numero', giuste,
        ok: l + ' + ' + n + ' − 1 = ' + v + '.',
        diagnosi: DIAG(giuste, [
          { se: I(l + n), msg: 'Il blocco ' + l + ' è già compreso nel conteggio: l’ultimo è ' + l + ' + ' + n + ' − 1.' },
          { se: I(n), msg: 'Questo è il numero dei blocchi. L’ultimo si determina a partire dal ' + l + '.' },
          { se: I(v - 1), msg: 'Dal ' + l + ' al ' + (v - 1) + ' i blocchi sono ' + (n - 1) + '.' }
        ]),
        altro: 'Il numero è diverso. Si contino ' + n + ' blocchi a partire dal ' + l + ' compreso.',
        indizi: ['Il primo blocco è il ' + l + '.', 'Ne seguono altri ' + (n - 1) + '.', l + ' + ' + (n - 1) + ' = ' + v + '.'],
        svolgimento: ['Primo: ' + l + '.', 'Ultimo: ' + l + ' + ' + n + ' − 1 = ' + v + '.'] }; }
      if (cosa === 1) { const v = l * b, giuste = CON(v, ['byte']); return { u: '4.5.2', d: 'I blocchi di un disco contengono ' + b + ' byte e sono numerati da 0. A quale byte ha inizio il blocco ' + l + '?', segnaposto: 'Un numero', giuste,
        ok: l + ' × ' + b + ' = ' + v + '.',
        diagnosi: DIAG(giuste, [
          { se: I((l + 1) * b), msg: 'Il blocco ' + l + ' è preceduto da ' + l + ' blocchi, dal numero 0 al numero ' + (l - 1) + '.' },
          { se: I((l - 1) * b), msg: 'Il blocco ' + l + ' è preceduto da ' + l + ' blocchi interi: la numerazione ha inizio da 0.' },
          { se: I(l + b), msg: 'Numero del blocco e dimensione vanno moltiplicati.' }
        ]),
        altro: 'Il numero è diverso. Si moltiplichi il numero del blocco per la dimensione.',
        indizi: ['Il blocco ' + l + ' è preceduto da ' + l + ' blocchi.', 'Ognuno occupa ' + b + ' byte.', l + ' × ' + b + ' = ' + v + '.'],
        svolgimento: ['Blocchi precedenti: ' + l + '.', 'Byte: ' + l + ' × ' + b + ' = ' + v + '.'] }; }
      const s = r.int(2, 9), rot = r.int(1, 5), byte = n * b, tras = byte / 128, v = (s + rot) * 1000 + tras, giuste = US(v);
      return { u: '4.5.2', d: 'Un disco legge ' + n + ' blocchi consecutivi da ' + b + ' byte. Il seek dura ' + s + ' ms, la rotazione ' + rot + ' ms, e il trasferimento procede a 128 byte per microsecondo. Qual è il tempo di servizio, in microsecondi?', segnaposto: 'Un numero', giuste,
        ok: (s + rot) + ' ms sono ' + (s + rot) * 1000 + ' µs. I byte sono ' + byte + ', e ' + byte + ' ÷ 128 = ' + tras + ' µs. Totale: ' + v + ' µs.',
        diagnosi: DIAG(giuste, [
          { se: US(s + rot + tras), msg: 'Sono stati sommati millisecondi e microsecondi. I ' + (s + rot) + ' ms valgono ' + (s + rot) * 1000 + ' µs.' },
          { se: US(tras), msg: 'Questo è il solo trasferimento. Mancano seek e rotazione.' },
          { se: US((s + rot) * 1000), msg: 'Questo è il solo posizionamento. Manca il trasferimento.' },
          { se: US(n * (s + rot) * 1000 + tras), msg: 'I blocchi sono consecutivi: seek e rotazione avvengono una sola volta.' }
        ]),
        altro: 'Il valore è diverso. Si convertano seek e rotazione in microsecondi e si sommi il trasferimento.',
        indizi: ['Posizionamento: ' + s + ' + ' + rot + ' = ' + (s + rot) + ' ms, cioè ' + (s + rot) * 1000 + ' µs.', 'Byte: ' + n + ' × ' + b + ' = ' + byte + '. Trasferimento: ' + byte + ' ÷ 128 = ' + tras + ' µs.', (s + rot) * 1000 + ' + ' + tras + ' = ' + v + '.'],
        svolgimento: ['Posizionamento: ' + (s + rot) + ' ms = ' + (s + rot) * 1000 + ' µs.', 'Byte richiesti: ' + byte + '.', 'Trasferimento: ' + tras + ' µs.', 'Servizio: ' + v + ' µs.'] };
    },
    // 4.5.3 · il cammino della testina
    (r) => {
      const giro = (pos, coda, sstf) => { const q = coda.slice(), t = []; let p = pos, tot = 0; while (q.length) { let i = 0; if (sstf) q.forEach((x, j) => { if (Math.abs(x - p) < Math.abs(q[i] - p)) i = j; }); const a = q.splice(i, 1)[0]; tot += Math.abs(a - p); t.push([p, a, Math.abs(a - p)]); p = a; } return { tot, t }; };
      const pari = (pos, coda) => { const q = coda.slice(); let p = pos; while (q.length > 1) { const d = q.map((x) => Math.abs(x - p)).sort((x, y) => x - y); if (d[0] === d[1]) return true; let i = 0; q.forEach((x, j) => { if (Math.abs(x - p) < Math.abs(q[i] - p)) i = j; }); p = q.splice(i, 1)[0]; } return false; };
      let pos, coda; do { pos = 5 * r.int(0, 20); coda = r.mescola([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]).slice(0, 3).map((x) => 5 * x); } while (coda.includes(pos) || pari(pos, coda));
      const sstf = r.int(0, 1) === 1, cache = r.int(0, 3) === 0, eff = cache ? coda.slice(1) : coda, G = giro(pos, eff, sstf), A = giro(pos, eff, !sstf), v = G.tot, giuste = CIL(v);
      const unaVolta = (() => { const q = eff.slice().sort((x, y) => Math.abs(x - pos) - Math.abs(y - pos)); let p = pos, tot = 0; q.forEach((x) => { tot += Math.abs(x - p); p = x; }); return tot; })();
      return { u: '4.5.3', d: 'La testina di un disco è sul cilindro ' + pos + '. Le richieste in coda riguardano, in ordine di arrivo, i cilindri ' + coda.join(', ') + '. ' + (cache ? 'Il blocco richiesto dalla prima richiesta si trova già nella cache. ' : '') + 'Quanti cilindri percorre complessivamente la testina con la regola ' + (sstf ? 'SSTF' : 'FCFS') + '?', segnaposto: 'Un numero', giuste,
        ok: 'Il percorso è ' + pos + ' → ' + G.t.map((x) => x[1]).join(' → ') + ': ' + G.t.map((x) => x[2]).join(' + ') + ' = ' + v + ' cilindri.',
        diagnosi: DIAG(giuste, [
          { se: CIL(A.tot), msg: sstf ? 'Questo è il cammino con FCFS. SSTF seleziona ogni volta la richiesta più vicina.' : 'Questo è il cammino con SSTF. FCFS segue l’ordine di arrivo.' },
          cache ? { se: CIL(giro(pos, coda, sstf).tot), msg: 'La prima richiesta è soddisfatta dalla cache, e il suo cilindro è escluso dal percorso.' } : null,
          sstf ? { se: CIL(unaVolta), msg: 'La selezione della più vicina va ripetuta dopo ogni lettura, dalla nuova posizione.' } : null,
          { se: CIL(eff.reduce((x, y) => x + y, 0)), msg: 'Sono stati sommati i numeri dei cilindri. Vanno sommate le distanze fra una posizione e la successiva.' }
        ]),
        altro: 'Il numero è diverso. Si scriva l’ordine di servizio e si sommino le distanze fra posizioni consecutive.',
        indizi: [(cache ? 'Il disco deve servire soltanto i cilindri ' + eff.join(' e ') + '. ' : '') + (sstf ? 'Da ' + pos + ' la richiesta più vicina è ' + G.t[0][1] + '.' : 'La prima richiesta da servire è ' + G.t[0][1] + '.'), 'Ordine: ' + G.t.map((x) => x[1]).join(', ') + '.', G.t.map((x) => x[2]).join(' + ') + ' = ' + v + '.'],
        svolgimento: G.t.map((x) => x[0] + ' → ' + x[1] + ': ' + x[2] + ' cilindri.').concat(['Cammino: ' + v + ' cilindri.']) };
    }
  ] });
})();
