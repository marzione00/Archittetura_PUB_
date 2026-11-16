'use strict';
/* Prova del capitolo 3.5: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const PS = (v) => I(v).concat(I(v).map((x) => x + 'ps'));
  // le scritture accettate di un valore con al più tre decimali: 1.450, 1.45 · 2.000, 2.00, 2.0, 2
  const DEC3 = (x) => { const out = [x.toFixed(3)]; let s = out[0]; while (s.endsWith('0')) { s = s.slice(0, -1); if (s.endsWith('.')) { s = s.slice(0, -1); out.push(s); break; } out.push(s); } return out; };
  const V3 = (x) => DEC3(x).pop().replace('.', ',');
  const STADI = ['F', 'D', 'E', 'M', 'W'];

  SL.registraProva('3.5', { domande: [
    // 3.5.1 · ultimo ciclo, latenza, durata del flusso
    (r) => {
      const k = r.scegli([4, 5, 6]), T = 10 * r.int(3, 9), n = r.int(3, 12), cosa = r.int(0, 2), cicli = k + n - 1;
      const testa = 'Una pipeline di ' + k + ' stadi ha un periodo di ' + T + ' ps. Vi entrano ' + n + ' istruzioni indipendenti, una per ciclo, a partire dalla pipeline vuota. ';
      if (cosa === 0) { const giuste = I(cicli); return { u: '3.5.1', d: testa + 'Alla fine di quale ciclo esce l’ultima istruzione?', segnaposto: 'Un numero', giuste,
        ok: 'L’ultima istruzione entra al ciclo ' + n + ' e percorre altri ' + (k - 1) + ' stadi: ' + n + ' + ' + (k - 1) + ' = ' + cicli + '.',
        diagnosi: DIAG(giuste, [
          { se: I(k * n), msg: 'Il prodotto vale per una CPU che esegue un’istruzione alla volta. In questo caso le istruzioni si sovrappongono.' },
          { se: I(k + n), msg: 'Il ciclo d’ingresso corrisponde già al primo stadio: dopo l’ingresso restano ' + (k - 1) + ' stadi.' },
          { se: I(n), msg: 'Al ciclo ' + n + ' l’ultima istruzione entra nel primo stadio. Deve ancora percorrere gli altri.' }
        ]),
        altro: 'Il numero è diverso. Si determini il ciclo in cui entra l’ultima istruzione, poi si aggiungano gli stadi residui.',
        indizi: ['L’ultima istruzione entra al ciclo ' + n + '.', 'Dopo il primo stadio ne restano ' + (k - 1) + '.', n + ' + ' + (k - 1) + '.'],
        svolgimento: ['Ingresso dell’ultima istruzione: ciclo ' + n + '.', 'Stadi restanti: ' + (k - 1) + '.', 'Uscita: ciclo ' + n + ' + ' + (k - 1) + ' = ' + cicli + '.'] }; }
      if (cosa === 1) { const giuste = PS(k * T); return { u: '3.5.1', d: testa + 'Quanto vale la latenza di una singola istruzione, in picosecondi?', segnaposto: 'Un tempo in ps', giuste,
        ok: 'Ogni istruzione attraversa ' + k + ' stadi da ' + T + ' ps: ' + k + ' × ' + T + ' = ' + (k * T) + ' ps.',
        diagnosi: DIAG(giuste, [
          { se: PS(T), msg: 'Questo è il periodo, cioè l’intervallo fra due uscite a regime. La latenza riguarda l’intero percorso di un’istruzione.' },
          { se: PS(cicli * T), msg: 'Questa è la durata dell’intero flusso. La latenza riguarda una sola istruzione.' },
          { se: PS((k - 1) * T), msg: 'Gli stadi da attraversare sono ' + k + ', compreso il primo.' }
        ]),
        altro: 'Il valore è diverso. Si moltiplichi il numero di stadi per il periodo.',
        indizi: ['Un’istruzione attraversa tutti gli stadi.', 'Gli stadi sono ' + k + ', e ciascuno dura un periodo.', k + ' × ' + T + '.'],
        svolgimento: ['Stadi: ' + k + '.', 'Periodo: ' + T + ' ps.', 'Latenza: ' + k + ' × ' + T + ' = ' + (k * T) + ' ps.'] }; }
      const giuste = PS(cicli * T);
      return { u: '3.5.1', d: testa + 'Dopo quanti picosecondi esce l’ultima istruzione?', segnaposto: 'Un tempo in ps', giuste,
        ok: 'I cicli sono ' + k + ' + ' + n + ' − 1 = ' + cicli + ', ciascuno da ' + T + ' ps: ' + (cicli * T) + ' ps.',
        diagnosi: DIAG(giuste, [
          { se: PS(k * n * T), msg: 'Questo è il tempo di una CPU che esegue un’istruzione alla volta. Nella pipeline i cicli sono ' + cicli + '.' },
          { se: PS(n * T), msg: 'Mancano i ' + (k - 1) + ' cicli che l’ultima istruzione impiega dopo l’ingresso.' },
          { se: PS((k + n) * T), msg: 'I cicli sono ' + k + ' + ' + n + ' − 1: il ciclo d’ingresso corrisponde già al primo stadio.' },
          { se: I(cicli), msg: 'Questi sono i cicli. Il tempo si ottiene moltiplicandoli per il periodo.' }
        ]),
        altro: 'Il valore è diverso. Si contino i cicli fino all’uscita dell’ultima istruzione, poi si moltiplichi per il periodo.',
        indizi: ['L’ultima istruzione esce al ciclo ' + k + ' + ' + n + ' − 1.', 'I cicli sono ' + cicli + '.', cicli + ' × ' + T + '.'],
        svolgimento: ['Cicli: ' + k + ' + ' + n + ' − 1 = ' + cicli + '.', 'Periodo: ' + T + ' ps.', 'Tempo: ' + cicli + ' × ' + T + ' = ' + (cicli * T) + ' ps.'] };
    },
    // 3.5.2 · leggere il diagramma per colonne e per righe
    (r) => {
      const testa = 'In una pipeline di cinque stadi F, D, E, M, W entrano dodici istruzioni indipendenti, I1, I2 e così via, una per ciclo a partire dal ciclo 1. ';
      if (r.int(0, 1) === 0) {
        const t = r.int(1, 4), c = r.int(t + 2, 12), j = c - t, giuste = [String(j), 'i' + j];
        return { u: '3.5.2', d: testa + 'Quale istruzione occupa lo stadio ' + STADI[t] + ' al ciclo ' + c + '? Si risponda con il suo numero.', segnaposto: 'Un numero', giuste,
          ok: 'Lo stadio ' + STADI[t] + ' segue F di ' + (t === 1 ? 'una posizione' : t + ' posizioni') + ', quindi ospita l’istruzione entrata al ciclo ' + c + ' − ' + t + ' = ' + j + '.',
          diagnosi: DIAG(giuste, [
            { se: [String(c), 'i' + c], msg: 'I' + c + ' al ciclo ' + c + ' entra in F. Lo stadio ' + STADI[t] + ' ospita un’istruzione entrata prima.' },
            { se: [String(j - 1), 'i' + (j - 1)], msg: 'Si contino le posizioni a partire da F: lo stadio ' + STADI[t] + ' ne dista ' + t + '.' },
            { se: [String(j + 1), 'i' + (j + 1)], msg: 'Si contino le posizioni a partire da F: lo stadio ' + STADI[t] + ' ne dista ' + t + '.' }
          ]),
          altro: 'Il numero è diverso. Si contino le posizioni di cui lo stadio ' + STADI[t] + ' segue F, e si sottraggano dal ciclo.',
          indizi: ['Gli stadi, nell’ordine, sono F, D, E, M, W.', 'Lo stadio ' + STADI[t] + ' segue F di ' + (t === 1 ? 'una posizione' : t + ' posizioni') + '.', c + ' − ' + t + '.'],
          svolgimento: ['Distanza di ' + STADI[t] + ' da F: ' + t + '.', 'Ciclo d’ingresso: ' + c + ' − ' + t + ' = ' + j + '.', 'È I' + j + '.'] };
      }
      const j = r.int(1, 8), t = r.int(0, 4), c = j + t, altre = r.mescola([0, 1, 2, 3, 4].filter((x) => x !== t)).slice(0, 3);
      const dove = (x) => (c - x >= 1 ? 'Al ciclo ' + c + ' lo stadio ' + STADI[x] + ' ospita I' + (c - x) + '.' : 'Al ciclo ' + c + ' lo stadio ' + STADI[x] + ' è ancora vuoto.');
      return { u: '3.5.2', d: testa + 'In quale stadio si trova I' + j + ' al ciclo ' + c + '?', guida: 'Si scelga la risposta.', o: [{ t: 'Nello stadio ' + STADI[t], ok: true, fb: 'I' + j + ' entra in F al ciclo ' + j + ' e avanza di uno stadio per ciclo: al ciclo ' + c + ' è avanzata di ' + (t === 1 ? 'una posizione' : t + ' posizioni') + '.' }].concat(altre.map((x) => ({ t: 'Nello stadio ' + STADI[x], fb: dove(x) }))) };
    },
    // 3.5.3 · riconoscere il legame fra due istruzioni, oppure i cicli fra lettura e scrittura
    (r) => {
      const OPZ = ['Una dipendenza dei dati', 'Una dipendenza del controllo', 'Nessuna dipendenza'];
      const tipo = r.int(0, 3);
      if (tipo < 3) {
        const reg = r.mescola(['rax', 'rbx', 'rcx', 'rdx', 'rsi', 'rdi']), w = reg[0], v = r.int(2, 90), op = r.scegli(['add', 'sub', 'and', 'or']), prima = r.scegli(['mov ' + w + ', ' + v, 'add ' + w + ', ' + reg[3], 'mov ' + w + ', 8(' + reg[4] + ')']);
        let seconda, g, perche;
        if (tipo === 0) { const sui = r.int(0, 1); seconda = sui ? op + ' ' + reg[1] + ', ' + w : op + ' ' + w + ', ' + reg[1]; g = 0; perche = 'La seconda istruzione legge ' + w.toUpperCase() + ', che la prima scrive: è una dipendenza dei dati.'; }
        else if (tipo === 1) { seconda = op + ' ' + reg[1] + ', ' + reg[2]; g = 2; perche = 'La seconda istruzione legge ' + reg[1].toUpperCase() + ' e ' + reg[2].toUpperCase() + ', mentre la prima scrive soltanto ' + w.toUpperCase() + ': le due istruzioni sono indipendenti.'; }
        else { seconda = 'je ' + r.scegli(['fine', 'ciclo', 'stop']); g = 1; perche = '`je` sceglie l’istruzione successiva in base a ZF: le istruzioni che la seguono dipendono dal suo esito.'; }
        const pre = tipo === 2 ? 'sub ' + reg[1] + ', ' + reg[2] : prima;
        return { u: '3.5.3', d: 'Due istruzioni entrano nella pipeline in cicli consecutivi: `' + pre + '` e poi `' + seconda + '`. Quale legame unisce la seconda alla prima?', guida: 'Si scelga la risposta.', o: OPZ.map((tx, k) => (k === g ? { t: tx, ok: true, fb: perche } : { t: tx, fb: perche })) };
      }
      const f = r.int(1, 6), dist = r.int(1, 3), w = f + 4, d = f + dist + 1, giusto = w - d, giuste = I(giusto);
      return { u: '3.5.3', d: 'Un’istruzione prelevata al ciclo ' + f + ' scrive un registro nello stadio W. Un’istruzione prelevata al ciclo ' + (f + dist) + ' lo legge nello stadio D. Di quanti cicli la lettura precede la scrittura?', segnaposto: 'Un numero', giuste,
        ok: 'La scrittura avviene al ciclo ' + f + ' + 4 = ' + w + ', la lettura al ciclo ' + (f + dist) + ' + 1 = ' + d + ': ' + w + ' − ' + d + ' = ' + giusto + '.',
        diagnosi: DIAG(giuste, [
          { se: I(dist), msg: 'Questa è la distanza fra i due prelievi. La lettura avviene in D, un ciclo dopo il prelievo, la scrittura in W, quattro cicli dopo.' },
          { se: I(w), msg: 'Questo è il ciclo della scrittura. Va sottratto quello della lettura.' },
          { se: I(d), msg: 'Questo è il ciclo della lettura. Va sottratto dal ciclo della scrittura.' }
        ]),
        altro: 'Il numero è diverso. Si calcolino il ciclo di W della prima istruzione e il ciclo di D della seconda.',
        indizi: ['W segue il prelievo di quattro cicli: ' + f + ' + 4.', 'D segue il prelievo di un ciclo: ' + (f + dist) + ' + 1.', w + ' − ' + d + '.'],
        svolgimento: ['Scrittura in W: ciclo ' + w + '.', 'Lettura in D: ciclo ' + d + '.', 'Distanza: ' + w + ' − ' + d + ' = ' + giusto + '.'] };
    },
    // 3.5.4 · cicli totali e CPI di un tratto
    (r) => {
      const n = r.scegli([8, 10, 20, 25, 40, 50]), L = r.int(0, 3), S = r.int(L === 0 ? 1 : 0, 3), C = n + 4 + 3 * L + 2 * S;
      const testa = 'Un tratto di ' + n + ' istruzioni entra in una pipeline vuota di cinque stadi. ' + (L === 0 ? 'Nessuna istruzione impiega' : L === 1 ? 'Un’istruzione impiega' : L + ' istruzioni impiegano') + ' il risultato di quella che la precede, con tre cicli di ritardo ciascuna, e ' + (S === 0 ? 'nessuna impiega' : S === 1 ? 'una impiega' : S + ' impiegano') + ' quello dell’istruzione che le precede di due posizioni, con due cicli di ritardo ciascuna. ';
      if (r.int(0, 1) === 0) { const giuste = I(C); return { u: '3.5.4', d: testa + 'Quanti cicli occupa il tratto?', segnaposto: 'Un numero', giuste,
        ok: 'Riempimento 4, uscite ' + n + ', ritardi ' + (3 * L) + ' + ' + (2 * S) + ': in tutto ' + C + ' cicli.',
        diagnosi: DIAG(giuste, [
          { se: I(C - 4), msg: 'Mancano i 4 cicli di riempimento, durante i quali nessuna istruzione esce.' },
          L > 0 ? { se: I(n + 4 + L + 2 * S), msg: 'Una dipendenza fra istruzioni adiacenti costa tre cicli.' } : null,
          { se: I(n + 4), msg: 'Questo è il flusso ideale. Vanno aggiunti i cicli di ritardo.' },
          { se: I(C + 1), msg: 'Il riempimento dura 4 cicli: al quinto la prima istruzione attraversa già l’ultimo stadio.' },
          { se: I(5 * n), msg: 'Le istruzioni si sovrappongono, e a regime ne esce una per ciclo.' }
        ]),
        altro: 'Il numero è diverso. Si sommino quattro parti: riempimento, uscite e i due tipi di ritardo.',
        indizi: ['Il flusso ideale occupa ' + n + ' + 4 cicli.', 'Le dipendenze adiacenti costano 3 cicli ciascuna: ' + (3 * L) + '.', 'Quelle a distanza due costano 2 cicli ciascuna: ' + (2 * S) + '.'],
        svolgimento: ['Flusso ideale: ' + n + ' + 4 = ' + (n + 4) + ' cicli.', 'Dipendenze adiacenti: ' + L + ' × 3 = ' + (3 * L) + '.', 'Dipendenze a distanza due: ' + S + ' × 2 = ' + (2 * S) + '.', 'Totale: ' + (n + 4) + ' + ' + (3 * L) + ' + ' + (2 * S) + ' = ' + C + ' cicli.'] }; }
      const giuste = DEC3(C / n);
      return { u: '3.5.4', d: testa + 'Quanto vale il CPI del tratto, compreso il riempimento?', segnaposto: 'Un numero con la virgola', giuste,
        ok: 'I cicli sono ' + n + ' + 4 + ' + (3 * L) + ' + ' + (2 * S) + ' = ' + C + ', e il CPI vale ' + C + ' / ' + n + ' = ' + V3(C / n) + '.',
        diagnosi: DIAG(giuste, [
          { se: DEC3((C - 4) / n), msg: 'Questo è il CPI che trascura il riempimento. La domanda lo include.' },
          { se: DEC3((n + 4) / n), msg: 'Questo è il CPI del flusso ideale. Ai cicli vanno aggiunti i ritardi.' },
          { se: I(C), msg: 'Questi sono i cicli. Il CPI si ottiene dividendoli per le ' + n + ' istruzioni.' },
          { se: ['1', '1.0', '1.00', '1.000'], msg: 'Il valore 1 vale a regime e senza dipendenze. In questo caso sono rilevanti il riempimento e i ritardi.' }
        ]),
        altro: 'Il valore è diverso. Si contino i cicli del tratto, poi si dividano per le istruzioni.',
        indizi: ['Cicli: ' + n + ' + 4 + ' + (3 * L) + ' + ' + (2 * S) + '.', 'I cicli sono ' + C + '.', C + ' / ' + n + '.'],
        svolgimento: ['Cicli: ' + n + ' + 4 + ' + (3 * L) + ' + ' + (2 * S) + ' = ' + C + '.', 'Istruzioni completate: ' + n + '.', 'CPI = ' + C + ' / ' + n + ' = ' + V3(C / n) + '.'] };
    }
  ] });
})();
