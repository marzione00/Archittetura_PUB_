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
          { se: I(k * n), msg: 'Il prodotto vale per una macchina che esegue un’istruzione alla volta. Qui le istruzioni si sovrappongono.' },
          { se: I(k + n), msg: 'Il ciclo d’ingresso conta già come primo stadio: dopo l’ingresso restano ' + (k - 1) + ' stadi.' },
          { se: I(n), msg: 'Al ciclo ' + n + ' l’ultima istruzione entra nel primo stadio. Deve ancora percorrere gli altri.' }
        ]),
        altro: 'Il numero è diverso. Trova il ciclo in cui entra l’ultima istruzione, poi aggiungi gli stadi che le restano.',
        indizi: ['L’ultima istruzione entra al ciclo ' + n + '.', 'Dopo il primo stadio ne restano ' + (k - 1) + '.', n + ' + ' + (k - 1) + '.'],
        svolgimento: ['Ingresso dell’ultima istruzione: ciclo ' + n + '.', 'Stadi restanti: ' + (k - 1) + '.', 'Uscita: ciclo ' + n + ' + ' + (k - 1) + ' = ' + cicli + '.'] }; }
      if (cosa === 1) { const giuste = PS(k * T); return { u: '3.5.1', d: testa + 'Quanto vale la latenza di una singola istruzione, in picosecondi?', segnaposto: 'Un tempo in ps', giuste,
        ok: 'Ogni istruzione attraversa ' + k + ' stadi da ' + T + ' ps: ' + k + ' × ' + T + ' = ' + (k * T) + ' ps.',
        diagnosi: DIAG(giuste, [
          { se: PS(T), msg: 'Questo è il periodo, cioè l’intervallo fra due uscite a regime. La latenza riguarda il percorso intero di una istruzione.' },
          { se: PS(cicli * T), msg: 'Questa è la durata dell’intero flusso. La latenza riguarda una sola istruzione.' },
          { se: PS((k - 1) * T), msg: 'Gli stadi da attraversare sono ' + k + ', compreso il primo.' }
        ]),
        altro: 'Il valore è diverso. Moltiplica il numero di stadi per il periodo.',
        indizi: ['Una istruzione attraversa tutti gli stadi.', 'Gli stadi sono ' + k + ', e ciascuno dura un periodo.', k + ' × ' + T + '.'],
        svolgimento: ['Stadi: ' + k + '.', 'Periodo: ' + T + ' ps.', 'Latenza: ' + k + ' × ' + T + ' = ' + (k * T) + ' ps.'] }; }
      const giuste = PS(cicli * T);
      return { u: '3.5.1', d: testa + 'Dopo quanti picosecondi esce l’ultima istruzione?', segnaposto: 'Un tempo in ps', giuste,
        ok: 'I cicli sono ' + k + ' + ' + n + ' − 1 = ' + cicli + ', ciascuno da ' + T + ' ps: ' + (cicli * T) + ' ps.',
        diagnosi: DIAG(giuste, [
          { se: PS(k * n * T), msg: 'Questo è il tempo di una macchina che esegue un’istruzione alla volta. Nella pipeline i cicli sono ' + cicli + '.' },
          { se: PS(n * T), msg: 'Mancano i ' + (k - 1) + ' cicli che l’ultima istruzione spende dopo l’ingresso.' },
          { se: PS((k + n) * T), msg: 'I cicli sono ' + k + ' + ' + n + ' − 1: il ciclo d’ingresso conta già come primo stadio.' },
          { se: I(cicli), msg: 'Questi sono i cicli. Per ottenere il tempo moltiplica per il periodo.' }
        ]),
        altro: 'Il valore è diverso. Conta i cicli fino all’uscita dell’ultima istruzione, poi moltiplica per il periodo.',
        indizi: ['L’ultima istruzione esce al ciclo ' + k + ' + ' + n + ' − 1.', 'I cicli sono ' + cicli + '.', cicli + ' × ' + T + '.'],
        svolgimento: ['Cicli: ' + k + ' + ' + n + ' − 1 = ' + cicli + '.', 'Periodo: ' + T + ' ps.', 'Tempo: ' + cicli + ' × ' + T + ' = ' + (cicli * T) + ' ps.'] };
    },
    // 3.5.2 · leggere il diagramma per colonne e per righe
    (r) => {
      const testa = 'In una pipeline di cinque stadi F, D, E, M, W entrano dodici istruzioni indipendenti, I1, I2 e così via, una per ciclo a partire dal ciclo 1. ';
      if (r.int(0, 1) === 0) {
        const t = r.int(1, 4), c = r.int(t + 2, 12), j = c - t, giuste = [String(j), 'i' + j];
        return { u: '3.5.2', d: testa + 'Quale istruzione occupa lo stadio ' + STADI[t] + ' al ciclo ' + c + '? Rispondi con il suo numero.', segnaposto: 'Un numero', giuste,
          ok: 'Lo stadio ' + STADI[t] + ' sta ' + (t === 1 ? 'un passo' : t + ' passi') + ' dopo F, quindi ospita l’istruzione entrata al ciclo ' + c + ' − ' + t + ' = ' + j + '.',
          diagnosi: DIAG(giuste, [
            { se: [String(c), 'i' + c], msg: 'I' + c + ' al ciclo ' + c + ' entra in F. Lo stadio ' + STADI[t] + ' ospita un’istruzione entrata prima.' },
            { se: [String(j - 1), 'i' + (j - 1)], msg: 'Conta i passi a partire da F: lo stadio ' + STADI[t] + ' ne dista ' + t + '.' },
            { se: [String(j + 1), 'i' + (j + 1)], msg: 'Conta i passi a partire da F: lo stadio ' + STADI[t] + ' ne dista ' + t + '.' }
          ]),
          altro: 'Il numero è diverso. Conta di quanti passi lo stadio ' + STADI[t] + ' segue F, e sottraili dal ciclo.',
          indizi: ['Gli stadi, nell’ordine, sono F, D, E, M, W.', 'Lo stadio ' + STADI[t] + ' sta ' + (t === 1 ? 'un passo' : t + ' passi') + ' dopo F.', c + ' − ' + t + '.'],
          svolgimento: ['Distanza di ' + STADI[t] + ' da F: ' + t + '.', 'Ciclo d’ingresso: ' + c + ' − ' + t + ' = ' + j + '.', 'È I' + j + '.'] };
      }
      const j = r.int(1, 8), t = r.int(0, 4), c = j + t, altre = r.mescola([0, 1, 2, 3, 4].filter((x) => x !== t)).slice(0, 3);
      const dove = (x) => (c - x >= 1 ? 'Al ciclo ' + c + ' lo stadio ' + STADI[x] + ' ospita I' + (c - x) + '.' : 'Al ciclo ' + c + ' lo stadio ' + STADI[x] + ' è ancora vuoto.');
      return { u: '3.5.2', d: testa + 'In quale stadio si trova I' + j + ' al ciclo ' + c + '?', guida: 'Scegli la risposta.', o: [{ t: 'Nello stadio ' + STADI[t], ok: true, fb: 'I' + j + ' entra in F al ciclo ' + j + ' e avanza di uno stadio per ciclo: al ciclo ' + c + ' ha fatto ' + (t === 1 ? 'un passo' : t + ' passi') + '.' }].concat(altre.map((x) => ({ t: 'Nello stadio ' + STADI[x], fb: dove(x) }))) };
    },
    // 3.5.3 · riconoscere il conflitto, oppure contare i cicli perduti
    (r) => {
      const OPZ = ['Un conflitto sui dati: uno stallo di un ciclo', 'Un conflitto strutturale: il prelievo attende un ciclo', 'Un conflitto di controllo: due istruzioni annullate', 'Nessun conflitto: il flusso resta ideale'];
      const tipo = r.int(0, 3);
      if (tipo === 0) {
        const reg = r.mescola(['rax', 'rbx', 'rcx', 'rdx', 'rsi', 'rdi']), op = r.scegli(['addq', 'subq', 'andq', 'xorq']), caso = r.int(0, 2), a = caso === 0 ? reg[0] : reg[1], b = caso === 1 ? reg[0] : reg[2], g = caso === 2 ? 3 : 0;
        return { u: '3.5.3', d: 'Una `mrmovq` carica un valore in %' + reg[0] + '. L’istruzione successiva è `' + op + ' %' + a + ', %' + b + '`. Che cosa accade nella pipeline?', guida: 'Scegli la risposta.', o: [{ t: OPZ[g], ok: true, fb: g === 0 ? 'La `' + op + '` legge %' + reg[0] + ', che la `mrmovq` consegna soltanto alla fine dello stadio M.' : 'La `' + op + '` legge %' + a + ' e %' + b + ', che la `mrmovq` non modifica.' }]
          .concat([0, 1, 2, 3].filter((x) => x !== g).map((x) => ({ t: OPZ[x], fb: x === 0 ? 'Gli operandi della `' + op + '` sono %' + a + ' e %' + b + ', e il registro caricato è un altro.' : x === 3 ? 'La `' + op + '` legge %' + reg[0] + ', che non è ancora arrivato dalla memoria.' : x === 1 ? 'Il conflitto strutturale nasce da una risorsa contesa fra due stadi. Qui conta il valore di un registro.' : 'Il conflitto di controllo riguarda i salti condizionati. Qui non ce ne sono.' }))) };
      }
      if (tipo === 1) {
        const esito = r.int(0, 1), g = esito ? 3 : 2;
        return { u: '3.5.3', d: 'La pipeline prevede che un salto condizionato venga eseguito, e preleva due istruzioni dalla destinazione. Nello stadio E la condizione risulta ' + (esito ? 'vera' : 'falsa') + '. Che cosa accade?', guida: 'Scegli la risposta.', o: [{ t: OPZ[g], ok: true, fb: esito ? 'La previsione era giusta, e le istruzioni prelevate sono quelle da eseguire.' : 'La previsione era sbagliata: le due istruzioni prelevate dalla destinazione vengono annullate.' }]
          .concat([0, 1, 2, 3].filter((x) => x !== g).map((x) => ({ t: OPZ[x], fb: x === 2 ? 'Le istruzioni vengono annullate soltanto quando la previsione è sbagliata. Qui la condizione è vera, come previsto.' : x === 3 ? 'La condizione è falsa, e la pipeline aveva previsto il contrario.' : x === 0 ? 'Il conflitto sui dati riguarda un valore non ancora prodotto. Qui la questione è la strada scelta dopo un salto.' : 'Il conflitto strutturale nasce da una risorsa contesa. Qui la questione è la strada scelta dopo un salto.' }))) };
      }
      if (tipo === 2) {
        const caso = r.int(0, 1), g = caso ? 3 : 1;
        return { u: '3.5.3', d: 'Istruzioni e dati stanno in una memoria con una sola porta. In un certo ciclo lo stadio F deve prelevare un’istruzione, e lo stadio M ospita una `' + (caso ? r.scegli(['addq', 'xorq', 'rrmovq']) : r.scegli(['mrmovq', 'rmmovq'])) + '`. Che cosa accade?', guida: 'Scegli la risposta.', o: [{ t: OPZ[g], ok: true, fb: caso ? 'L’istruzione nello stadio M non accede alla memoria dei dati, e la porta è libera per il prelievo.' : 'L’istruzione nello stadio M usa la porta per i dati, e il prelievo deve attendere.' }]
          .concat([0, 1, 2, 3].filter((x) => x !== g).map((x) => ({ t: OPZ[x], fb: x === 1 ? 'L’istruzione nello stadio M lavora soltanto sui registri, e lascia libera la porta.' : x === 3 ? 'L’istruzione nello stadio M accede alla memoria, e la porta è una sola.' : x === 0 ? 'Il conflitto sui dati riguarda un valore non ancora prodotto. Qui la questione è l’uso della porta di memoria.' : 'Il conflitto di controllo riguarda i salti condizionati. Qui non ce ne sono.' }))) };
      }
      const L = r.int(1, 5), S = r.int(2, 6), E = r.int(1, S - 1), persi = L + 2 * E, giuste = I(persi);
      return { u: '3.5.3', d: 'Un tratto di programma contiene ' + (L === 1 ? 'un carico seguito' : L + ' carichi seguiti') + ' subito da un uso, e ' + S + ' salti condizionati, di cui ' + (E === 1 ? 'uno previsto' : E + ' previsti') + ' male. Quanti cicli perde la pipeline rispetto al flusso ideale?', segnaposto: 'Un numero', giuste,
        ok: 'Le attese costano ' + L + ' × 1 = ' + L + (L === 1 ? ' ciclo' : ' cicli') + ', i salti previsti male ' + E + ' × 2 = ' + (2 * E) + ': in tutto ' + persi + '.',
        diagnosi: DIAG(giuste, [
          { se: I(L + 2 * S), msg: 'I salti previsti bene non costano nulla. Contano soltanto ' + (E === 1 ? 'quello previsto' : 'i ' + E + ' previsti') + ' male.' },
          { se: I(L + E), msg: 'Ogni salto previsto male costa due cicli, uno per ciascuna istruzione annullata.' },
          { se: I(2 * E), msg: 'Mancano le attese sui dati: un ciclo per ogni carico seguito subito da un uso.' },
          { se: I(L), msg: 'Mancano i salti previsti male, che costano due cicli ciascuno.' }
        ]),
        altro: 'Il numero è diverso. Conta un ciclo per ogni attesa e due per ogni salto previsto male.',
        indizi: ['Ogni carico seguito subito da un uso costa 1 ciclo.', 'Ogni salto previsto male costa 2 cicli.', L + ' + ' + E + ' × 2.'],
        svolgimento: ['Attese sui dati: ' + L + ' × 1 = ' + L + '.', 'Salti previsti male: ' + E + ' × 2 = ' + (2 * E) + '.', 'Cicli perduti: ' + L + ' + ' + (2 * E) + ' = ' + persi + '.'] };
    },
    // 3.5.4 · cicli totali e CPI di un tratto
    (r) => {
      const n = r.scegli([8, 10, 20, 25, 40, 50]), L = r.int(0, 4), S = r.int(L === 0 ? 1 : 0, 3), C = n + 4 + L + 2 * S;
      const testa = 'Un tratto di ' + n + ' istruzioni entra in una pipeline vuota di cinque stadi. ' + (L === 0 ? 'Nessun carico è seguito' : L === 1 ? 'Un carico è seguito' : L + ' carichi sono seguiti') + ' subito da un uso, e ' + (S === 0 ? 'nessun salto viene previsto' : S === 1 ? 'un salto viene previsto' : S + ' salti vengono previsti') + ' male. ';
      if (r.int(0, 1) === 0) { const giuste = I(C); return { u: '3.5.4', d: testa + 'Quanti cicli occupa il tratto?', segnaposto: 'Un numero', giuste,
        ok: 'Riempimento 4, uscite ' + n + ', attese ' + L + ', salti ' + (2 * S) + ': in tutto ' + C + ' cicli.',
        diagnosi: DIAG(giuste, [
          { se: I(C - 4), msg: 'Mancano i 4 cicli di riempimento, durante i quali nessuna istruzione esce.' },
          S > 0 ? { se: I(C - S), msg: 'Ogni salto previsto male costa due cicli, uno per ciascuna istruzione annullata.' } : null,
          { se: I(n + 4), msg: 'Questo è il flusso ideale. Vanno aggiunte le penalità.' },
          { se: I(C + 1), msg: 'Il riempimento dura 4 cicli: al quinto la prima istruzione attraversa già l’ultimo stadio.' },
          { se: I(5 * n), msg: 'Le istruzioni si sovrappongono, e a regime ne esce una per ciclo.' }
        ]),
        altro: 'Il numero è diverso. Somma quattro parti: riempimento, uscite, attese sui dati e salti previsti male.',
        indizi: ['Il flusso ideale occupa ' + n + ' + 4 cicli.', 'Le attese costano un ciclo ciascuna: ' + L + '.', 'I salti previsti male costano due cicli ciascuno: ' + (2 * S) + '.'],
        svolgimento: ['Flusso ideale: ' + n + ' + 4 = ' + (n + 4) + ' cicli.', 'Attese sui dati: ' + L + ' × 1 = ' + L + '.', 'Salti previsti male: ' + S + ' × 2 = ' + (2 * S) + '.', 'Totale: ' + (n + 4) + ' + ' + L + ' + ' + (2 * S) + ' = ' + C + ' cicli.'] }; }
      const giuste = DEC3(C / n);
      return { u: '3.5.4', d: testa + 'Quanto vale il CPI del tratto?', segnaposto: 'Un numero con la virgola', giuste,
        ok: 'I cicli sono ' + n + ' + 4 + ' + L + ' + ' + (2 * S) + ' = ' + C + ', e il CPI vale ' + C + ' / ' + n + ' = ' + V3(C / n) + '.',
        diagnosi: DIAG(giuste, [
          { se: DEC3((C - 4) / n), msg: 'Mancano i 4 cicli di riempimento, che fanno parte dei cicli spesi.' },
          S > 0 ? { se: DEC3((C - S) / n), msg: 'Ogni salto previsto male costa due cicli, uno per ciascuna istruzione annullata.' } : null,
          { se: DEC3((n + 4) / n), msg: 'Questo è il CPI del flusso ideale. Ai cicli vanno aggiunte le penalità.' },
          { se: I(C), msg: 'Questi sono i cicli. Il CPI si ottiene dividendoli per le ' + n + ' istruzioni.' },
          { se: ['1', '1.0', '1.00', '1.000'], msg: 'Il valore 1 vale a regime e senza conflitti. Qui contano il riempimento e le penalità.' }
        ]),
        altro: 'Il valore è diverso. Conta i cicli del tratto, poi dividili per le istruzioni.',
        indizi: ['Cicli: ' + n + ' + 4 + ' + L + ' + ' + (2 * S) + '.', 'I cicli sono ' + C + '.', C + ' / ' + n + '.'],
        svolgimento: ['Cicli: ' + n + ' + 4 + ' + L + ' + ' + (2 * S) + ' = ' + C + '.', 'Istruzioni completate: ' + n + '.', 'CPI = ' + C + ' / ' + n + ' = ' + V3(C / n) + '.'] };
    }
  ] });
})();
