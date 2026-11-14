'use strict';
/* Prova del capitolo 5.7: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };

  SL.registraProva('5.7', { domande: [
    // 5.7.1 · catena o ciclo: processi bloccati, oppure processi del ciclo
    (r) => {
      const n = r.int(3, 5), j = r.int(0, 2) === 0 ? 0 : r.int(1, n - 1), cosa = r.int(0, 1), righe = [];
      for (let i = 1; i <= n; i++) righe.push('P' + i + ' possiede R' + i + (i < n ? ' e chiede R' + (i + 1) : j ? ' e chiede R' + j : ' e ha tutto ciò che gli serve'));
      const bloccati = j ? n : 0, ciclo = j ? n - j + 1 : 0, v = cosa === 0 ? bloccati : ciclo, giuste = I(v);
      return { u: '5.7.1', d: 'Ogni risorsa ha una sola istanza. ' + righe.join('. ') + '. ' + (cosa === 0 ? 'Quanti processi restano bloccati per sempre?' : 'Quanti processi fanno parte di un ciclo?'), segnaposto: 'Un numero', giuste,
        ok: j ? 'P' + n + ' chiede R' + j + ', che è di P' + j + ': il ciclo va da P' + j + ' a P' + n + ' e conta ' + ciclo + ' processi. ' + (j > 1 ? 'Anche i processi che lo precedono aspettano una risorsa che non verrà mai rilasciata.' : 'Tutti i processi ne fanno parte.') : 'P' + n + ' può terminare, e la catena si scioglie dal fondo: nessun ciclo, nessun processo bloccato per sempre.',
        diagnosi: DIAG(giuste, cosa === 0 ? [
          j > 1 ? { se: I(ciclo), msg: 'Questi sono i processi del ciclo. Anche chi aspetta una risorsa del ciclo, standone fuori, resta bloccato per sempre.' } : null,
          !j ? { se: I(n - 1), msg: 'Quei processi aspettano, e la loro attesa finisce: P' + n + ' può terminare e rilasciare.' } : null,
          !j ? { se: I(n), msg: 'P' + n + ' ha tutto ciò che gli serve. Terminando, mette in moto gli altri.' } : { se: I(0), msg: 'Le frecce tornano a un processo già incontrato: c’è un ciclo.' }
        ] : [
          j > 1 ? { se: I(n), msg: 'Questi sono tutti i processi bloccati. Nel ciclo stanno soltanto quelli da P' + j + ' a P' + n + '.' } : null,
          !j ? { se: I(n), msg: 'Le frecce finiscono senza tornare a un processo già incontrato: è una catena.' } : { se: I(0), msg: 'P' + n + ' chiede una risorsa posseduta da un processo che lo precede: le frecce si chiudono.' },
          j > 1 ? { se: I(j), msg: 'Conta i processi da P' + j + ' a P' + n + ', estremi compresi.' } : null
        ]),
        altro: 'Il numero è diverso. Si seguano le frecce: da ogni processo alla risorsa che chiede, e da quella al processo che la possiede.',
        indizi: ['Guarda che cosa fa l’ultimo processo, P' + n + '.', j ? 'P' + n + ' chiede R' + j + ', che è di P' + j + '.' : 'P' + n + ' può terminare, e rilascia R' + n + '.', cosa === 0 ? 'Bloccati per sempre: ' + bloccati + '.' : 'Processi nel ciclo: ' + ciclo + '.'],
        svolgimento: ['Processi: ' + n + '.', j ? 'Ciclo: da P' + j + ' a P' + n + ', ' + ciclo + ' processi.' : 'Nessun ciclo.', 'Bloccati per sempre: ' + bloccati + '.'] };
    },
    // 5.7.2 · la condizione esclusa da un protocollo
    (r) => {
      const P = r.scegli([
        ['Ogni thread acquisisce i lock per rango crescente, in ogni circostanza.', 'circolare'],
        ['Ogni thread chiede tutti i lock che gli servono con una sola richiesta indivisibile.', 'possesso'],
        ['Un thread a cui viene negato un lock rilascia subito quelli che possiede, e riprova più tardi.', 'prelazione'],
        ['Prima di chiedere un nuovo lock, un thread deve avere rilasciato tutti quelli che possedeva.', 'possesso'],
        ['Il sistema può togliere un lock a un thread in attesa, annullandone il lavoro, per darlo a chi lo chiede.', 'prelazione'],
        ['I lock sono numerati, e un thread che possiede il numero k può chiedere soltanto numeri maggiori di k.', 'circolare'],
        ['La tabella diventa di sola lettura, e tutti i thread possono consultarla insieme senza lock.', 'mutua']
      ]);
      const fb = { circolare: 'Lungo una catena di attese i numeri salgono sempre, e un cerchio dovrebbe tornare indietro.', possesso: 'Nessun thread si trova mai a possedere un lock mentre ne aspetta un altro.', prelazione: 'Un lock può essere tolto a un thread fermo: nessuno resta bloccato tenendo una risorsa.', mutua: 'La risorsa è condivisa da tutti nello stesso momento: nessuno deve aspettarla.' }[P[1]];
      return { u: '5.7.2', d: 'Un sistema adotta questo protocollo. ' + P[0] + ' Quale condizione di Coffman viene esclusa?', guida: 'Si scelga la risposta.', o: r.mescola([
        { t: 'Mutua esclusione', ok: P[1] === 'mutua', fb },
        { t: 'Possesso e attesa', ok: P[1] === 'possesso', fb },
        { t: 'Assenza di prelazione', ok: P[1] === 'prelazione', fb },
        { t: 'Attesa circolare', ok: P[1] === 'circolare', fb }]) };
    },
    // 5.7.3 · disponibile dopo un completamento, oppure verdetto della prova di sicurezza
    (r) => {
      if (r.int(0, 4) < 2) { const a = r.int(0, 3), b = r.int(0, 3), p1 = r.int(0, 3), p2 = r.int(0, 3), n1 = r.int(0, a), n2 = r.int(0, b), m1 = p1 + n1, m2 = p2 + n2, cosa = r.int(0, 1), d0 = cosa === 0 ? a : b, ha = cosa === 0 ? p1 : p2, mx = cosa === 0 ? m1 : m2, v = d0 + ha, giuste = I(v), nome = cosa === 0 ? 'X' : 'Y';
        return { u: '5.7.3', d: 'Il disponibile è (' + a + ',' + b + '). Un processo possiede (' + p1 + ',' + p2 + ') e ha dichiarato un massimo di (' + m1 + ',' + m2 + '). Riceve ciò che gli manca, completa e restituisce tutto. Quante istanze di ' + nome + ' sono disponibili dopo?', segnaposto: 'Un numero', giuste,
          ok: 'Al disponibile si aggiunge ciò che il processo possedeva: ' + d0 + ' + ' + ha + ' = ' + v + '.',
          diagnosi: DIAG(giuste, [
            { se: I(d0 + mx), msg: 'Hai aggiunto il massimo. Il prestito era già contato nel disponibile: si aggiunge soltanto ciò che il processo possedeva.' },
            { se: I(d0), msg: 'Terminando, il processo libera anche le istanze che possedeva.' },
            { se: I(d0 - (mx - ha)), msg: 'Questo è il disponibile durante il prestito. Alla fine il processo restituisce tutto.' },
            { se: I(cosa === 0 ? b + p2 : a + p1), msg: 'Questa è l’altra componente. La domanda riguarda ' + nome + '.' }
          ]),
          altro: 'Il numero è diverso. Somma al disponibile di ' + nome + ' le istanze di ' + nome + ' che il processo possedeva.',
          indizi: ['Disponibile di ' + nome + ': ' + d0 + '.', 'Il processo possedeva ' + ha + ' ' + nome + '.', d0 + ' + ' + ha + ' = ' + v + '.'],
          svolgimento: ['Disponibile: (' + a + ',' + b + ').', 'Posseduto: (' + p1 + ',' + p2 + ').', 'Dopo: (' + (a + p1) + ',' + (b + p2) + ').'] }; }
      const D = r.int(0, 3), ha = [r.int(0, 3), r.int(0, 3), r.int(0, 3)], bs = [r.int(1, 4), r.int(1, 4), r.int(1, 4)];
      let disp = D; const fatti = []; let mosso = true;
      while (mosso) { mosso = false; for (let i = 0; i < 3; i++) if (fatti.indexOf(i) < 0 && bs[i] <= disp) { disp += ha[i]; fatti.push(i); mosso = true; break; } }
      const e = fatti.length === 3 ? 0 : fatti.length === 0 ? 1 : 2;
      const fb = 'I bisogni residui sono ' + bs.join(', ') + '. ' + (e === 0 ? 'Nell’ordine ' + fatti.map((i) => 'P' + (i + 1)).join(', ') + ' ognuno trova il proprio bisogno coperto.' : e === 1 ? 'Con ' + D + (D === 1 ? ' istanza libera' : ' istanze libere') + ' nessun bisogno è coperto.' : 'Dopo ' + fatti.map((i) => 'P' + (i + 1)).join(' e ') + ' il disponibile è ' + disp + ', e i bisogni rimasti sono più grandi.');
      return { u: '5.7.3', d: 'Una risorsa ha ' + D + (D === 1 ? ' istanza libera' : ' istanze libere') + '. ' + [0, 1, 2].map((i) => 'P' + (i + 1) + ' possiede ' + ha[i] + (ha[i] === 1 ? ' istanza' : ' istanze') + ' e ha dichiarato un massimo di ' + (ha[i] + bs[i])).join('. ') + '. Che cosa dice la prova di sicurezza?', guida: 'Si scelga la risposta.', o: r.mescola([
        { t: 'Lo stato è sicuro: tutti possono completare, in un ordine opportuno', ok: e === 0, fb },
        { t: 'Lo stato è insicuro: nessun processo può completare per primo', ok: e === 1, fb },
        { t: 'Lo stato è insicuro: qualcuno completa, e poi gli altri restano scoperti', ok: e === 2, fb }]) };
    },
    // 5.7.4 · un dato dopo il rollback, oppure il valore finale dopo il recupero
    (r) => {
      if (r.int(0, 1) === 0) { const nomi = r.mescola(['P', 'Q', 'R', 'S', 'T']).slice(0, 3), prima = [], dopo = []; nomi.forEach(() => { const a = r.int(1, 9); let b = r.int(1, 9); if (b === a) b = a === 9 ? 1 : a + 1; prima.push(a); dopo.push(b); }); const k = r.int(0, 2), giuste = I(prima[k]);
        return { u: '5.7.4', d: 'Una transazione ha modificato tre dati: ' + nomi.map((n, i) => n + ' da ' + prima[i] + ' a ' + dopo[i]).join(', ') + '. Viene scelta come vittima di un recupero. Quanto vale ' + nomi[k] + ' dopo il rollback?', segnaposto: 'Un numero', giuste,
          ok: 'Il rollback rimette in ' + nomi[k] + ' il valore annotato nel log: ' + prima[k] + '.',
          diagnosi: DIAG(giuste, [
            { se: I(dopo[k]), msg: 'Questo è il valore scritto dalla transazione. Il rollback lo annulla.' },
            { se: I(0), msg: 'Il rollback rimette il valore precedente, annotato nel log.' }
          ]),
          altro: 'Il valore è diverso. Cerca il valore che ' + nomi[k] + ' aveva prima della transazione.',
          indizi: ['Il log annota il valore precedente di ogni dato modificato.', 'Per ' + nomi[k] + ' il log dice: era ' + prima[k] + '.', 'Dopo il rollback ' + nomi[k] + ' vale ' + prima[k] + '.'],
          svolgimento: ['Log: ' + nomi.map((n, i) => n + ' era ' + prima[i]).join(', ') + '.', 'Dopo il rollback ' + nomi[k] + ' = ' + prima[k] + '.'] }; }
      const x0 = r.int(10, 40), y0 = r.int(10, 40), da = r.int(2, 5), db = r.int(6, 9), vA = r.int(0, 1) === 0, rip = r.int(0, 1) === 0, cosa = r.scegli(['X', 'Y']), base = cosa === 'X' ? x0 : y0;
      const v = base + (vA ? db : da) + (rip ? (vA ? da : db) : 0), giuste = I(v), V = vA ? 'A' : 'B', S = vA ? 'B' : 'A';
      return { u: '5.7.4', d: 'Il dato X vale ' + x0 + ' e il dato Y vale ' + y0 + '. La transazione A aggiunge ' + da + ' a X, e poi deve aggiungere ' + da + ' a Y. La transazione B aggiunge ' + db + ' a Y, e poi deve aggiungere ' + db + ' a X. Ciascuna ha fatto la prima modifica, e ora si aspettano a vicenda. Il gestore annulla ' + V + ' con un rollback, ' + S + ' completa, ' + (rip ? 'e poi ' + V + ' viene ritentata da capo e completa.' : 'e ' + V + ' viene abbandonata.') + ' Quanto vale ' + cosa + ' alla fine?', segnaposto: 'Un numero', giuste,
        ok: rip ? 'Alla fine entrambe le transazioni hanno completato: ' + base + ' + ' + da + ' + ' + db + ' = ' + v + '.' : 'Resta soltanto il lavoro di ' + S + ': ' + base + ' + ' + (vA ? db : da) + ' = ' + v + '.',
        diagnosi: DIAG(giuste, [
          !rip ? { se: I(base + da + db), msg: 'Il lavoro di ' + V + ' è stato annullato, e ' + V + ' non è stata ritentata.' } : { se: I(base + (vA ? db : da)), msg: 'Dopo il recupero ' + V + ' viene ritentata, e questa volta completa.' },
          { se: I(base), msg: S + ' completa, e modifica anche ' + cosa + '.' },
          rip ? null : { se: I(base + (vA ? da : db)), msg: 'Questo è il contributo di ' + V + ', che è stata annullata. Resta quello di ' + S + '.' }
        ]),
        altro: 'Il valore è diverso. Si applichi il rollback, poi il lavoro completo di ' + S + (rip ? ', poi quello di ' + V + '.' : '.'),
        indizi: ['Dopo il rollback di ' + V + ', il dato che aveva modificato torna al valore iniziale.', S + ' completa: aggiunge ' + (vA ? db : da) + ' a X e a Y.', rip ? V + ', ritentata, aggiunge ' + (vA ? da : db) + ' a X e a Y. ' + cosa + ' = ' + v + '.' : V + ' viene abbandonata. ' + cosa + ' = ' + v + '.'],
        svolgimento: ['Valore iniziale di ' + cosa + ': ' + base + '.', 'Contributo di ' + S + ': ' + (vA ? db : da) + '.', 'Contributo di ' + V + ': ' + (rip ? (vA ? da : db) : 0) + '.', cosa + ' = ' + v + '.'] };
    },
    // 5.7.5 · la diagnosi dai due contatori
    (r) => {
      const caso = r.scegli(['dead', 'live', 'starve']), T = r.scegli([5, 10, 30, 60]), N = caso === 'dead' ? 0 : r.int(2, 90) * 100, M = caso === 'starve' ? r.int(5, 90) * 10 : 0;
      const fb = caso === 'dead' ? 'Nessun tentativo e nessun completamento: i thread sono fermi, e nessun evento futuro può sbloccarli.' : caso === 'live' ? 'I tentativi sono ' + N + ' e i completamenti zero: i thread si muovono senza avanzare.' : 'Il gruppo completa ' + M + ' operazioni, e una richiesta resta esclusa per tutto il tempo.';
      return { u: '5.7.5', d: 'Una traccia di ' + T + ' secondi riporta, per un gruppo di thread: tentativi di acquisizione ' + N + ', operazioni completate ' + M + '. ' + (caso === 'starve' ? 'Una richiesta presentata all’inizio è ancora in attesa alla fine.' : caso === 'dead' ? 'Tutti i thread del gruppo risultano bloccati.' : 'Tutti i thread del gruppo risultano in esecuzione.') + ' Se la sequenza continua così, qual è la diagnosi?', guida: 'Si scelga la risposta.', o: r.mescola([
        { t: 'Deadlock', ok: caso === 'dead', fb },
        { t: 'Livelock', ok: caso === 'live', fb },
        { t: 'Starvation', ok: caso === 'starve', fb }]) };
    }
  ] });
})();
