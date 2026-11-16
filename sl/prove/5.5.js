'use strict';
/* Prova del capitolo 5.5: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const MS = (v) => I(v).concat([v + 'ms', v + 'millisecondi']);

  SL.registraProva('5.5', { domande: [
    // 5.5.1 · il contatore dopo k incrementi, con g letture anticipate
    (r) => {
      const x = r.int(3, 60), k = r.int(2, 5), g = r.int(1, k), v = g === 1 ? x + k : x + 1 + (k - g), giuste = I(v);
      return { u: '5.5.1', d: 'Un contatore vale ' + x + '. ' + k + ' thread lo incrementano una volta ciascuno, senza alcuna protezione. ' + (g === 1 ? 'Ogni thread legge soltanto dopo la scrittura del precedente.' : g === k ? 'Tutti leggono prima di qualunque scrittura, e quindi scrivono in successione.' : 'I primi ' + g + ' leggono prima di qualunque scrittura, e quindi scrivono. Ciascuno dei rimanenti legge e scrive soltanto dopo la scrittura del precedente.') + ' Quanto vale il contatore al termine?', segnaposto: 'Un numero', giuste,
        ok: g === 1 ? 'Nessuna lettura è anticipata: ogni incremento è registrato, e il contatore vale ' + x + ' + ' + k + ' = ' + v + '.' : 'I ' + g + ' thread che leggono insieme scrivono tutti ' + (x + 1) + ': ne è registrato uno solo.' + (k > g ? ' Gli altri ' + (k - g) + ' sono registrati per intero.' : '') + ' Il contatore vale ' + v + '.',
        diagnosi: DIAG(giuste, [
          g > 1 ? { se: I(x + k), msg: 'Questo sarebbe il valore senza aggiornamenti persi. I ' + g + ' thread che leggono insieme operano tutti su ' + x + '.' } : { se: I(x + 1), msg: 'Questo sarebbe l’esito se tutti leggessero ' + x + '. In questo caso ogni thread legge dopo la scrittura del precedente.' },
          { se: I(x), msg: 'Almeno una scrittura di ' + (x + 1) + ' avviene.' },
          g > 1 && g < k ? { se: I(x + 1), msg: 'I thread rimanenti leggono dopo le scritture precedenti, e i loro incrementi sono registrati.' } : null
        ]),
        altro: 'Il valore è diverso. Si annoti per ogni thread il valore letto e quello scritto.',
        indizi: [g === 1 ? 'Ogni thread legge il valore lasciato dal precedente.' : 'I ' + g + ' thread che leggono insieme hanno tutti ' + x + ' nel registro.', g === 1 ? 'Nessun incremento è perso.' : 'Scrivono tutti ' + (x + 1) + ': gli incrementi persi sono ' + (g - 1) + '.', 'Valore finale: ' + x + ' + ' + k + ' − ' + (g === 1 ? 0 : g - 1) + ' = ' + v + '.'],
        svolgimento: ['Incrementi richiesti: ' + k + '.', 'Incrementi persi: ' + (g === 1 ? 0 : g - 1) + '.', 'Valore finale: ' + v + '.'] };
    },
    // 5.5.2 · il caso peggiore secondo i confini della sezione critica
    (r) => {
      const x = r.int(5, 80), k = r.int(2, 6), zona = r.scegli(['nessuna', 'scrittura', 'tutto']), v = zona === 'tutto' ? x + k : x + 1, giuste = I(v);
      return { u: '5.5.2', d: 'Un contatore vale ' + x + ', e ' + k + ' thread lo incrementano una volta ciascuno. ' + (zona === 'nessuna' ? 'Il programma non impiega alcun mutex.' : zona === 'scrittura' ? 'Ogni thread esegue, nell’ordine: lettura, lock, scrittura, unlock.' : 'Ogni thread esegue, nell’ordine: lock, lettura, scrittura, unlock.') + ' Nel caso peggiore, quanto vale il contatore al termine?', segnaposto: 'Un numero', giuste,
        ok: zona === 'tutto' ? 'La lettura è interna alla sezione critica: nessun incremento è perso, e il contatore vale ' + v + '.' : 'Nel caso peggiore tutti leggono ' + x + ' prima di ogni scrittura, e tutti scrivono ' + v + '.',
        diagnosi: DIAG(giuste, [
          { se: I(zona === 'tutto' ? x + 1 : x + k), msg: zona === 'tutto' ? 'Questo sarebbe l’esito con le letture all’esterno del mutex. In questo caso la lettura è protetta.' : zona === 'scrittura' ? 'Questo è il caso migliore. Le letture sono all’esterno del mutex, e possono avvenire tutte prima delle scritture.' : 'Questo è il caso migliore. Senza mutex le letture possono precedere tutte le scritture.' },
          { se: I(x), msg: 'Almeno una scrittura di ' + (x + 1) + ' avviene.' }
        ]),
        altro: 'Il valore è diverso. Si stabilisca se la lettura di ogni thread è protetta dal medesimo mutex della scrittura.',
        indizi: [zona === 'tutto' ? 'Ogni incremento è una sezione critica completa.' : 'Le letture non sono protette.', zona === 'tutto' ? 'Ogni thread legge il valore lasciato dal precedente.' : 'Nel caso peggiore tutti leggono ' + x + '.', 'Valore finale: ' + v + '.'],
        svolgimento: zona === 'tutto' ? ['Incrementi: ' + k + '.', 'Persi: 0.', 'Valore finale: ' + v + '.'] : ['Letture: tutte ' + x + '.', 'Scritture: tutte ' + (x + 1) + '.', 'Valore finale: ' + v + '.'] };
    },
    // 5.5.3 · il totale letto dal creatore
    (r) => {
      const w = r.int(2, 6), n = r.int(3, 30), tot = w * n, pres = r.int(0, 2) === 0, m = pres ? r.int(1, n - 1) : 0, v = tot - m, giuste = I(v);
      return { u: '5.5.3', d: w + ' lavoratori eseguono ' + n + ' incrementi ciascuno su un contatore con valore iniziale 0, tutti sotto il medesimo mutex. ' + (pres ? 'Il creatore legge il contatore quando tutti hanno terminato tranne uno, al quale mancano ancora ' + m + (m === 1 ? ' incremento.' : ' incrementi.') : 'Il creatore attende tutti i lavoratori con pthread_join, e quindi legge il contatore.') + ' Quale valore trova?', segnaposto: 'Un numero', giuste,
        ok: pres ? 'Il totale sarà ' + tot + ', e tuttavia al momento della lettura mancano ' + m + ' incrementi: ' + v + '.' : w + ' × ' + n + ' = ' + tot + ', senza incrementi persi.',
        diagnosi: DIAG(giuste, [
          pres ? { se: I(tot), msg: 'Questo sarà il totale definitivo. Al momento della lettura mancano ancora ' + m + ' incrementi.' } : { se: I(n), msg: 'Questi sono gli incrementi di un solo lavoratore.' },
          pres ? { se: I(tot - n), msg: 'Anche l’ultimo lavoratore ha già eseguito una parte dei suoi incrementi: ' + (n - m) + '.' } : { se: I(tot - 1), msg: 'Dopo tutti i join ogni incremento è avvenuto, e il mutex li conserva tutti.' }
        ]),
        altro: 'Il valore è diverso. Si contino gli incrementi già avvenuti al momento della lettura.',
        indizi: ['Incrementi complessivi: ' + w + ' × ' + n + ' = ' + tot + '.', pres ? 'Ne mancano ancora ' + m + '.' : 'Dopo i join sono avvenuti tutti.', pres ? tot + ' − ' + m + ' = ' + v + '.' : 'Valore letto: ' + tot + '.'],
        svolgimento: ['Totale definitivo: ' + tot + '.', 'Incrementi mancanti: ' + m + '.', 'Valore letto: ' + v + '.'] };
    },
    // 5.5.4 · i valori che il consumatore può trovare
    (r) => {
      const vecchio = r.scegli([0, 0, 5, 12]), nuovo = vecchio + r.int(10, 80), caso = r.scegli(['nessuna', 'ra', 'mutex']);
      const fb = caso === 'nessuna' ? 'Senza una relazione di ordine fra i thread, l’osservazione del segnale non garantisce la visibilità del dato.' : caso === 'ra' ? 'La acquire legge il valore della release, e la scrittura del dato, che la precede, è visibile.' : 'Il consumatore entra nel mutex dopo il rilascio del produttore, e osserva tutte le scritture precedenti.';
      return { u: '5.5.4', d: 'Una cella atomica contiene ' + vecchio + '. Un produttore vi scrive ' + nuovo + ' e quindi pone a 1 un segnale. Un consumatore legge il segnale, lo trova a 1, e legge la cella. ' + (caso === 'nessuna' ? 'I due thread non adottano alcuna sincronizzazione.' : caso === 'ra' ? 'Il segnale è pubblicato con una release e letto con una acquire.' : 'Entrambi accedono alla cella e al segnale in possesso del medesimo mutex.') + ' Nessun altro thread scrive nella cella. Quali valori può trovare il consumatore?', guida: 'Si scelga la risposta.', o: r.mescola([
        { t: 'Soltanto ' + nuovo, ok: caso !== 'nessuna', fb },
        { t: vecchio + ' oppure ' + nuovo, ok: caso === 'nessuna', fb },
        { t: 'Soltanto ' + vecchio, ok: false, fb }]) };
    },
    // 5.5.5 · processore consumato, oppure istante in cui si ottiene il lock
    (r) => {
      const d = r.int(1, 12), rs = r.int(1, 4), spin = r.int(0, 1) === 0, cosa = r.int(0, 1), v = cosa === 0 ? (spin ? d : 0) : (spin ? d : d + rs), giuste = MS(v);
      return { u: '5.5.5', d: 'Un thread richiede un lock occupato, che sarà rilasciato dopo ' + d + ' ms. Attende ' + (spin ? 'con attesa attiva, su un core proprio.' : 'sospendendosi, e il suo risveglio costa ' + rs + ' ms.') + ' ' + (cosa === 0 ? 'Quanti millisecondi di processore consuma durante l’attesa del rilascio?' : 'Dopo quanti millisecondi dalla richiesta ottiene il lock?'), segnaposto: 'Un numero', giuste,
        ok: cosa === 0 ? (spin ? 'Nell’attesa attiva il thread esegue per tutta la durata: ' + d + ' ms.' : 'Un thread sospeso non esegue e consuma 0 ms.') : (spin ? 'Il thread in attesa attiva rileva immediatamente il rilascio: ' + d + ' ms.' : d + ' ms di attesa più ' + rs + ' ms di risveglio: ' + v + ' ms.'),
        diagnosi: DIAG(giuste, cosa === 0 ? [
          { se: MS(spin ? 0 : d), msg: spin ? 'Zero sarebbe il consumo di un thread sospeso. In questo caso il thread è in attesa attiva.' : 'Questo sarebbe il consumo con l’attesa attiva. Un thread sospeso lascia libero il core.' },
          !spin ? { se: MS(d + rs), msg: 'Questo è l’istante in cui ottiene il lock. Durante l’attesa del rilascio il thread non esegue.' } : null
        ] : [
          spin ? { se: MS(d + rs), msg: 'Il risveglio riguarda soltanto un thread sospeso. Il thread in attesa attiva acquisisce il lock appena è libero.' } : { se: MS(d), msg: 'A ' + d + ' ms il lock è libero. Il thread deve ancora tornare in esecuzione.' },
          { se: MS(0), msg: 'Il lock resta occupato per ' + d + ' ms.' }
        ]),
        altro: 'Il valore è diverso. Si distingua il tempo trascorso dal tempo di processore consumato.',
        indizi: ['Il lock è rilasciato a ' + d + ' ms.', spin ? 'Nell’attesa attiva il thread esegue per l’intera durata.' : 'Un thread sospeso non esegue, e al rilascio va risvegliato.', 'Risposta: ' + v + ' ms.'],
        svolgimento: ['Rilascio: ' + d + ' ms.', 'Processore consumato nell’attesa: ' + (spin ? d : 0) + ' ms.', 'Lock ottenuto a: ' + (spin ? d : d + rs) + ' ms.'] };
    },
    // 5.5.6 · valore oppure coda dopo una sequenza di down e up
    (r) => {
      const s = r.int(0, 3), k = r.int(4, 6), nomi = ['A', 'B', 'C', 'D', 'E', 'F'], ops = []; let n = s, w = 0; const coda = [];
      for (let j = 0; j < k; j++) { if (r.int(0, 2) > 0 && w < 6) { const chi = nomi[w++]; ops.push(chi + ' esegue down'); if (n > 0) n--; else coda.push(chi); } else { ops.push('un altro thread esegue up'); if (coda.length) coda.shift(); else n++; } }
      const cosa = r.int(0, 1), v = cosa === 0 ? n : coda.length, giuste = I(v);
      return { u: '5.5.6', d: 'Un semaforo ha valore ' + s + ' e la coda vuota. Avvengono, in quest’ordine: ' + ops.join('; ') + '. ' + (cosa === 0 ? 'Quale valore ha il semaforo al termine?' : 'Quanti thread sono bloccati in coda al termine?'), segnaposto: 'Un numero', giuste,
        ok: 'Al termine il semaforo vale ' + n + ', e la coda ' + (coda.length === 0 ? 'è vuota.' : coda.length === 1 ? 'contiene ' + coda[0] + '.' : 'contiene ' + coda.join(', ') + '.'),
        diagnosi: DIAG(giuste, [
          { se: I(cosa === 0 ? coda.length : n), msg: cosa === 0 ? 'Questo è il numero dei thread in coda. La domanda riguarda il valore del semaforo.' : 'Questo è il valore del semaforo. La domanda riguarda la coda.' },
          { se: I(Math.max(0, s + ops.filter((x) => / up$/.test(x)).length - (cosa === 0 ? 0 : 99))), msg: 'Una up incrementa il valore soltanto se la coda è vuota, e ogni down che non blocca lo decrementa.' }
        ]),
        altro: 'Il numero è diverso. Si aggiornino valore e coda dopo ogni operazione.',
        indizi: ['down: se il valore è maggiore di zero scende di 1, altrimenti il thread è posto in coda.', 'up: se la coda contiene un thread lo risveglia, altrimenti il valore sale di 1.', 'Al termine: valore ' + n + ', thread in coda ' + coda.length + '.'],
        svolgimento: ['Valore iniziale: ' + s + '.', 'Operazioni: ' + ops.length + '.', 'Valore finale: ' + n + '.', 'Thread in coda: ' + coda.length + '.'] };
    },
    // 5.5.7 · conferme inviate, oppure esito di una serie di confronti e scambi
    (r) => {
      if (r.int(0, 2) === 0) { let c = r.int(1, 4); const c0 = c, k = r.int(2, 4), ops = []; for (let j = 0; j < k; j++) { const att = r.int(0, 1) === 0 ? c : r.int(0, 4), nuovo = r.int(0, 9); ops.push('atteso ' + att + ', nuovo ' + nuovo); if (c === att) c = nuovo; } const giuste = I(c);
        return { u: '5.5.7', d: 'Una cella vale ' + c0 + '. Sono eseguite, in quest’ordine, ' + k + ' operazioni di confronto e scambio: ' + ops.join('; ') + '. Quanto vale la cella al termine?', segnaposto: 'Un numero', giuste,
          ok: 'Ogni operazione scrive il valore nuovo soltanto se la cella contiene quello atteso. Al termine la cella vale ' + c + '.',
          diagnosi: DIAG(giuste, [
            { se: I(Number(ops[ops.length - 1].split('nuovo ')[1])), msg: 'L’ultima operazione scrive soltanto se trova nella cella il valore atteso.' },
            { se: I(c0), msg: 'Almeno una delle operazioni trova il valore atteso, e modifica la cella.' }
          ]),
          altro: 'Il valore è diverso. Si applichino le operazioni una per volta, confrontando ogni volta la cella con il valore atteso.',
          indizi: ['Il valore iniziale della cella è ' + c0 + '.', 'Un’operazione con valore atteso diverso dal contenuto fallisce e lascia invariata la cella.', 'Valore finale: ' + c + '.'],
          svolgimento: ['Valore iniziale: ' + c0 + '.', 'Operazioni: ' + ops.join('; ') + '.', 'Valore finale: ' + c + '.'] }; }
      const posti = r.int(1, 4), cl = posti + r.int(1, 4), schema = r.scegli(['fuori', 'dentro', 'cas']), v = schema === 'fuori' ? cl : posti, giuste = I(v);
      return { u: '5.5.7', d: (posti === 1 ? 'Resta 1 posto libero' : 'Restano ' + posti + ' posti liberi') + ', e ' + cl + ' clienti tentano di prenotare nel medesimo momento. ' + (schema === 'fuori' ? 'Ogni cliente controlla la disponibilità all’esterno del lock, tutti prima di qualunque modifica, e quindi prenota all’interno del lock senza ripetere il controllo.' : schema === 'dentro' ? 'Ogni cliente acquisisce il lock, controlla la disponibilità, prenota se un posto è libero, e rilascia il lock.' : 'Ogni cliente prenota con un confronto e scambio sulla cella dei posti, e rinuncia se trova zero posti.') + ' Quante conferme sono inviate?', segnaposto: 'Un numero', giuste,
        ok: schema === 'fuori' ? 'Tutti i ' + cl + ' clienti hanno trovato posti liberi, e tutti confermano.' : 'Controllo e modifica sono legati: confermano soltanto i primi ' + posti + '.',
        diagnosi: DIAG(giuste, [
          { se: I(schema === 'fuori' ? posti : cl), msg: schema === 'fuori' ? 'Queste sarebbero le conferme corrette. In questo caso nessuno ripete il controllo, e tutti si ritengono autorizzati.' : 'Questo sarebbe l’esito con il controllo all’esterno del lock. In questo caso ogni cliente trova la cella aggiornata dai precedenti.' },
          { se: I(cl - posti), msg: 'Questi sono i clienti in più rispetto ai posti. La domanda riguarda le conferme inviate.' }
        ]),
        altro: 'Il numero è diverso. Si stabilisca quanti clienti, al momento della decisione, trovano ancora un posto libero.',
        indizi: [schema === 'fuori' ? 'Tutti controllano prima di ogni modifica.' : 'Ogni cliente decide sul valore corrente della cella.', schema === 'fuori' ? 'Tutti trovano ' + posti + (posti === 1 ? ' posto libero.' : ' posti liberi.') : 'Dopo ' + posti + (posti === 1 ? ' prenotazione' : ' prenotazioni') + ' la cella vale 0.', 'Conferme: ' + v + '.'],
        svolgimento: ['Posti: ' + posti + '. Clienti: ' + cl + '.', 'Clienti che decidono di prenotare: ' + v + '.', 'Conferme: ' + v + '.'] };
    }
  ] });
})();
