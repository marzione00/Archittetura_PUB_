'use strict';
/* Prova del capitolo 5.4: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const MS = (v) => I(v).concat([v + 'ms', v + 'millisecondi']);

  SL.registraProva('5.4', { domande: [
    // 5.4.1 · che cosa legge T2 da una cella comune, secondo l'ordine degli accessi
    (r) => {
      let h0, x, y, r0; do { h0 = r.int(1, 30); x = r.int(31, 60); y = r.int(61, 99); r0 = r.int(1, 30); } while (h0 === r0);
      const pos = r.int(0, 2), ev = ['T1 scrive ' + x + ' nella cella', 'T1 scrive ' + y + ' nella cella']; ev.splice(pos, 0, 'T2 copia la cella nel proprio registro');
      const v = [h0, x, y][pos], giuste = I(v);
      return { u: '5.4.1', d: 'T1 e T2 sono thread dello stesso processo. Una cella comune contiene ' + h0 + ', e il registro di T2 contiene ' + r0 + '. Avvengono, in quest’ordine, tre accessi: ' + ev.join('; ') + '. Quanto vale alla fine il registro di T2?', segnaposto: 'Un numero', giuste,
        ok: 'Nel momento della lettura la cella conteneva ' + v + '. Le scritture successive non cambiano il registro.',
        diagnosi: DIAG(giuste, [
          { se: I(y), msg: 'Questo è il contenuto finale della cella. Il registro conserva ciò che T2 ha letto, e non si aggiorna da solo.' },
          { se: I(r0), msg: 'La lettura ha sostituito il vecchio contenuto del registro.' },
          pos > 0 ? { se: I(h0), msg: 'Prima della lettura di T2 la cella è stata scritta.' } : { se: I(x), msg: 'La lettura di T2 viene prima di tutte le scritture.' }
        ]),
        altro: 'Il valore è diverso. Si segua il contenuto della cella fino al momento in cui T2 la legge.',
        indizi: ['Il registro di T2 cambia soltanto con la lettura di T2.', 'La lettura è l’accesso numero ' + (pos + 1) + '.', 'In quel momento la cella contiene ' + v + '.'],
        svolgimento: ev.map((e, k) => (k + 1) + '. ' + e + '.').concat(['Registro di T2: ' + v + '.']) };
    },
    // 5.4.2 · durata, thread in parallelo, core liberi nell'ultimo intervallo
    (r) => {
      const k = r.scegli([2, 3, 4, 6, 8]), n = r.int(2, 20), d = r.scegli([1, 1, 2, 5]), gruppi = Math.ceil(n / k), cosa = r.int(0, 2);
      const testa = n + ' thread indipendenti sono pronti insieme, e ciascuno richiede ' + d + ' ms di calcolo. I core sono ' + k + '. ';
      if (cosa === 0) { const v = gruppi * d, giuste = MS(v); return { u: '5.4.2', d: testa + 'Dopo quanti millisecondi hanno finito tutti?', segnaposto: 'Un numero', giuste,
        ok: 'Servono ' + gruppi + (gruppi === 1 ? ' gruppo' : ' gruppi') + ' da ' + k + ', ciascuno di ' + d + ' ms: ' + v + ' ms.',
        diagnosi: DIAG(giuste, [
          { se: MS(n * d), msg: 'Questa sarebbe la durata su un solo core. Qui in ogni intervallo eseguono fino a ' + k + ' thread.' },
          n % k !== 0 ? { se: MS(Math.floor(n / k) * d), msg: 'Restano ' + (n % k) + ' thread, che occupano un altro intervallo intero.' } : null,
          d > 1 ? { se: MS(gruppi), msg: 'Questi sono i gruppi. Ogni gruppo dura ' + d + ' ms.' } : null
        ]),
        altro: 'Il valore è diverso. Si dividano i thread per i core, arrotonda per eccesso, e si moltiplichi per ' + d + '.',
        indizi: ['In ogni intervallo eseguono al più ' + k + ' thread.', n + ' ÷ ' + k + ', per eccesso, dà ' + gruppi + '.', gruppi + ' × ' + d + ' = ' + v + '.'],
        svolgimento: ['Gruppi: ' + gruppi + '.', 'Durata di un gruppo: ' + d + ' ms.', 'Durata: ' + v + ' ms.'] }; }
      if (cosa === 1) { const v = Math.min(n, k), giuste = I(v); return { u: '5.4.2', d: testa + 'Quanti thread, al più, eseguono nello stesso istante?', segnaposto: 'Un numero', giuste,
        ok: 'Ogni thread occupa un core: il massimo è il più piccolo fra ' + n + ' thread e ' + k + ' core.',
        diagnosi: DIAG(giuste, [
          { se: I(Math.max(n, k)), msg: n > k ? 'I thread sono ' + n + ', ma i core sono soltanto ' + k + '.' : 'I core sono ' + k + ', ma i thread da eseguire sono soltanto ' + n + '.' },
          { se: I(1), msg: 'Con più core, più thread eseguono davvero insieme.' }
        ]),
        altro: 'Il numero è diverso. Si prenda il più piccolo fra thread e core.',
        indizi: ['Un core esegue un thread per volta.', 'Thread: ' + n + '. Core: ' + k + '.', 'Il minore è ' + v + '.'],
        svolgimento: ['Thread pronti: ' + n + '.', 'Core: ' + k + '.', 'In parallelo, al più: ' + v + '.'] }; }
      const v = gruppi * k - n, giuste = I(v);
      return { u: '5.4.2', d: testa + 'Nell’ultimo intervallo di lavoro, quanti core restano liberi?', segnaposto: 'Un numero', giuste,
        ok: 'L’ultimo gruppo contiene ' + (n - (gruppi - 1) * k) + ' thread: i core liberi sono ' + k + ' − ' + (n - (gruppi - 1) * k) + ' = ' + v + '.',
        diagnosi: DIAG(giuste, [
          { se: I(n - (gruppi - 1) * k), msg: 'Questi sono i thread dell’ultimo gruppo. I core liberi sono gli altri.' },
          v > 0 ? { se: I(0), msg: 'L’ultimo gruppo è incompleto: ha soltanto ' + (n - (gruppi - 1) * k) + ' thread.' } : null
        ]),
        altro: 'Il numero è diverso. Si determini quanti thread restano per l’ultimo gruppo, e li si sottragga dai core.',
        indizi: ['I gruppi pieni che precedono l’ultimo sono ' + (gruppi - 1) + '.', 'Per l’ultimo restano ' + (n - (gruppi - 1) * k) + ' thread.', k + ' − ' + (n - (gruppi - 1) * k) + ' = ' + v + '.'],
        svolgimento: ['Thread nell’ultimo gruppo: ' + (n - (gruppi - 1) * k) + '.', 'Core: ' + k + '.', 'Core liberi: ' + v + '.'] };
    },
    // 5.4.3 · quanti thread utente eseguono insieme
    (r) => {
      const u = r.int(3, 9), w = r.int(1, 8), c = r.scegli([2, 4, 8]), bl = r.int(0, 2) > 0, pronti = bl ? u - 1 : u, disp = bl ? w - 1 : w, v = Math.min(pronti, disp, c), giuste = I(v);
      return { u: '5.4.3', d: 'Un programma ha ' + u + ' thread utente, appoggiati su ' + (w === 1 ? 'un solo thread del kernel' : w + ' thread del kernel') + ', e gira su ' + c + ' core. ' + (bl ? 'Uno dei thread utente chiede una lettura bloccante, e sospende il thread del kernel su cui si trovava. Quanti degli altri thread utente eseguono nello stesso istante, al più?' : 'Nessuno è bloccato. Quanti thread utente eseguono nello stesso istante, al più?'), segnaposto: 'Un numero', giuste,
        ok: 'Thread pronti ' + pronti + ', thread del kernel disponibili ' + disp + ', core ' + c + ': il più piccolo è ' + v + '.',
        diagnosi: DIAG(giuste, [
          { se: I(Math.min(pronti, c)), msg: 'Servono anche i thread del kernel: quelli disponibili sono ' + disp + '.' },
          bl ? { se: I(Math.min(u - 1, w, c)), msg: 'Il thread del kernel su cui poggiava la lettura è sospeso, e non è disponibile.' } : null,
          { se: I(pronti), msg: 'I thread pronti sono ' + pronti + ', ma non tutti trovano un thread del kernel e un core.' }
        ]),
        altro: 'Il numero è diverso. Si prenda il più piccolo fra thread pronti, thread del kernel disponibili e core.',
        indizi: ['Thread utente pronti: ' + pronti + '.', 'Thread del kernel disponibili: ' + disp + '. Core: ' + c + '.', 'Il minore è ' + v + '.'],
        svolgimento: ['Pronti: ' + pronti + '.', 'Thread del kernel disponibili: ' + disp + '.', 'Core: ' + c + '.', 'In esecuzione: ' + v + '.'] };
    },
    // 5.4.4 · il valore letto attraverso l'argomento, oppure i join dovuti
    (r) => {
      const n = r.int(3, 9), cosa = r.int(0, 2);
      if (cosa === 2) { const f = r.int(1, n - 1), giuste = I(n - f); return { u: '5.4.4', d: 'Un programma chiede la creazione di ' + n + ' thread con pthread_create. ' + (f === 1 ? 'Una chiamata fallisce' : f + ' chiamate falliscono') + ' con EAGAIN, e le altre riescono. Quante chiamate a pthread_join deve fare?', segnaposto: 'Un numero', giuste,
        ok: 'Si attende ogni thread creato con successo: ' + n + ' − ' + f + ' = ' + (n - f) + '.',
        diagnosi: DIAG(giuste, [
          { se: I(n), msg: (f === 1 ? 'Un thread non è mai stato creato, e non può essere atteso.' : f + ' thread non sono mai stati creati, e non possono essere attesi.') },
          { se: I(f), msg: 'Queste sono le creazioni fallite. I join riguardano i thread esistenti.' }
        ]),
        altro: 'Il numero è diverso. Conta i thread che esistono davvero.',
        indizi: ['Le creazioni riuscite sono ' + n + ' − ' + f + '.', 'Ogni thread esistente va atteso una volta.', 'Join: ' + (n - f) + '.'],
        svolgimento: ['Richiesti: ' + n + '.', 'Creati: ' + (n - f) + '.', 'Join: ' + (n - f) + '.'] }; }
      const j = r.int(1, n), loop = cosa === 0, v = loop ? n : j - 1, giuste = I(v);
      return { u: '5.4.4', d: 'Un ciclo con i da 0 a ' + (n - 1) + ' crea ' + n + ' thread. ' + (loop ? 'A ciascuno passa come argomento l’indirizzo &i della variabile del ciclo.' : 'Al thread creato nel giro i passa come argomento l’indirizzo &a[i], e la cella a[i] contiene i.') + ' I thread leggono attraverso il puntatore dopo la fine del ciclo. Quale valore legge il thread creato per ' + (j === 1 ? 'primo' : j === n ? 'ultimo' : j + '°') + '?', segnaposto: 'Un numero', giuste,
        ok: loop ? 'A ciclo finito i vale ' + n + ', e tutti i thread leggono quella stessa cella.' : 'Il thread creato per ' + j + '° nasce nel giro i = ' + (j - 1) + ', e legge a[' + (j - 1) + '], che contiene ' + (j - 1) + '.',
        diagnosi: DIAG(giuste, [
          loop ? { se: I(j - 1), msg: 'Questo era il valore di i al momento della creazione. Il thread legge più tardi, attraverso l’indirizzo.' } : { se: I(n), msg: 'Questo accadrebbe passando a tutti &i. Qui ogni thread ha una cella propria.' },
          loop ? { se: I(n - 1), msg: 'Alla fine del ciclo i viene incrementata ancora una volta, e vale ' + n + '.' } : { se: I(j), msg: 'Il primo thread nasce nel giro i = 0: i giri sono numerati da 0.' }
        ]),
        altro: 'Il numero è diverso. Si individui la cella indicata dal puntatore e il suo contenuto al momento della lettura.',
        indizi: loop ? ['Tutti i thread hanno lo stesso indirizzo, quello di i.', 'La lettura avviene a ciclo finito.', 'A quel punto i vale ' + n + '.'] : ['Ogni thread ha l’indirizzo di una cella diversa.', 'Il thread creato per ' + j + '° nasce con i = ' + (j - 1) + '.', 'a[' + (j - 1) + '] contiene ' + (j - 1) + '.'],
        svolgimento: loop ? ['Argomento: &i.', 'Valore di i a ciclo finito: ' + n + '.', 'Valore letto: ' + n + '.'] : ['Giro di creazione: i = ' + (j - 1) + '.', 'Argomento: &a[' + (j - 1) + '].', 'Valore letto: ' + (j - 1) + '.'] };
    },
    // 5.4.5 · quanti lavoratori sopravvivono
    (r) => {
      const n = r.int(3, 12), th = r.int(0, 1) === 0, guasti = r.int(0, 3) === 0 ? 0 : 1, v = guasti === 0 ? n : th ? 0 : n - 1, giuste = I(v).concat(v === 0 ? ['nessuno'] : []);
      return { u: '5.4.5', d: 'Un servizio ha ' + n + ' lavoratori, realizzati come ' + (th ? 'thread dello stesso processo' : 'processi distinti') + ', e un supervisore in un processo a parte. ' + (guasti === 0 ? 'Nessun lavoratore compie errori. ' : 'Uno dei lavoratori compie un accesso vietato alla memoria e riceve SIGSEGV, con l’azione predefinita. ') + 'Quanti lavoratori restano attivi?', segnaposto: 'Un numero', giuste,
        ok: guasti === 0 ? 'Senza errori nessuno viene terminato: restano tutti e ' + n + '.' : th ? 'Il segnale termina il processo, e con lui tutti i ' + n + ' thread.' : 'Termina soltanto il processo responsabile: ' + n + ' − 1 = ' + v + '.',
        diagnosi: DIAG(giuste, [
          guasti ? { se: I(th ? n - 1 : 0), msg: th ? 'Questo accadrebbe con processi distinti. Qui i lavoratori sono thread di un solo processo.' : 'Questo accadrebbe con i thread. I processi hanno memorie separate.' } : null,
          guasti ? { se: I(n), msg: 'L’azione predefinita di SIGSEGV è la terminazione del processo responsabile.' } : { se: I(n - 1), msg: 'Nessun lavoratore ha sbagliato, e nessuno viene terminato.' },
          { se: I(n + 1), msg: 'Il supervisore non è un lavoratore.' }
        ]),
        altro: 'Il numero è diverso. Si stabilisca quale processo viene terminato, e chi ne fa parte.',
        indizi: [guasti === 0 ? 'Non c’è alcun segnale.' : 'SIGSEGV termina il processo responsabile.', th ? 'Tutti i lavoratori sono thread dello stesso processo.' : 'Ogni lavoratore è un processo a sé.', 'Restano attivi ' + v + '.'],
        svolgimento: ['Lavoratori: ' + n + '.', 'Terminati: ' + (n - v) + '.', 'Attivi: ' + v + '.'] };
    }
  ] });
})();
