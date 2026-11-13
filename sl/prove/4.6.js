'use strict';
/* Prova del capitolo 4.6: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const CON = (v, coda) => I(v).concat(coda.map((c) => v + c));
  const TB = (v) => CON(v, ['tb']), US = (v) => CON(v, ['µs', 'μs', 'us', 'microsecondi']);
  const H2 = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0'), E2 = (v) => { const h = v.toString(16), l = h.padStart(2, '0'); return Array.from(new Set([l, '0x' + l, l + 'h', h, '0x' + h])); };
  const B8 = (v) => { const b = v.toString(2).padStart(8, '0'); return b.slice(0, 4) + ' ' + b.slice(4); };

  SL.registraProva('4.6', { domande: [
    // 4.6.1 · capacità utile, oppure guasti sopportati
    (r) => {
      const liv = r.scegli(['0', '1', '5', '6', '10']), n = liv === '10' ? r.scegli([4, 6, 8]) : r.scegli([4, 5, 6, 8]), c = r.scegli([1, 2, 4, 8]);
      const utili = { 0: n, 1: 1, 5: n - 1, 6: n - 2, 10: n / 2 }[liv], sopporta = { 0: 0, 1: n - 1, 5: 1, 6: 2, 10: 1 }[liv];
      const testa = n + ' dischi da ' + c + ' TB sono organizzati in RAID ' + liv + (liv === '10' ? ', a coppie di due' : liv === '1' ? ', ciascuno con una copia completa' : '') + '. ';
      if (r.int(0, 2) > 0) { const v = utili * c, giuste = TB(v); return { u: '4.6.1', d: testa + 'Qual è la capacità utile, in terabyte?', segnaposto: 'Un numero', giuste,
        ok: (liv === '0' ? 'Senza ridondanza tutti i dischi contengono dati' : liv === '1' ? 'Ogni disco è una copia, e il volume ha la capacità di uno solo' : liv === '5' ? 'La parità occupa l’equivalente di un disco' : liv === '6' ? 'Le due parità occupano l’equivalente di due dischi' : 'Ogni coppia vale quanto un disco') + ': ' + utili + ' × ' + c + ' = ' + v + ' TB.',
        diagnosi: DIAG(giuste, [
          { se: TB(n * c), msg: 'Questa è la capacità grezza. Una parte dello spazio serve alla ridondanza.' },
          liv === '6' ? { se: TB((n - 1) * c), msg: 'Una sola parità è quella di RAID 5. RAID 6 ne conserva due.' } : null,
          liv === '5' ? { se: TB((n - 2) * c), msg: 'Due parità sono quelle di RAID 6. RAID 5 ne conserva una.' } : null,
          liv === '10' ? { se: TB(c), msg: 'Le coppie sono ' + n / 2 + ', e ciascuna contiene dati diversi.' } : null,
          liv === '1' ? { se: TB(n * c / 2), msg: 'Qui tutti i dischi contengono la stessa copia: la capacità è quella di uno solo.' } : null
        ]),
        altro: 'Il valore è diverso. Conta quanti dischi contengono dati distinti e moltiplica per ' + c + '.',
        indizi: ['Dischi in tutto: ' + n + '.', 'Dischi che contano per i dati: ' + utili + '.', utili + ' × ' + c + ' = ' + v + '.'],
        svolgimento: ['Capacità grezza: ' + n + ' × ' + c + ' = ' + n * c + ' TB.', 'Dischi utili per i dati: ' + utili + '.', 'Capacità utile: ' + v + ' TB.'] }; }
      const giuste = I(sopporta);
      return { u: '4.6.1', d: testa + 'Quanti dischi possono guastarsi, comunque siano scelti, senza che il volume perda dati?', segnaposto: 'Un numero', giuste,
        ok: liv === '0' ? 'Nessuno: ogni blocco esiste in una sola copia.' : liv === '1' ? 'Basta che resti un disco: ' + n + ' − 1 = ' + sopporta + '.' : liv === '5' ? 'Una parità per striscia ricava un solo blocco mancante.' : liv === '6' ? 'Due parità per striscia ricavano due blocchi mancanti.' : 'Uno. Due guasti nella stessa coppia cancellerebbero tutte le copie dei suoi blocchi.',
        diagnosi: DIAG(giuste, [
          liv === '10' ? { se: I(n / 2), msg: 'Tanti guasti sono innocui soltanto se cadono in coppie diverse. La domanda chiede guasti scelti comunque.' } : null,
          liv === '0' ? { se: I(1), msg: 'RAID 0 è privo di copie e di parità, e il primo guasto fa perdere dei blocchi.' } : null,
          liv === '5' ? { se: I(2), msg: 'Due guasti sono il limite di RAID 6. RAID 5 ha una sola parità.' } : null,
          liv === '6' ? { se: I(1), msg: 'Un guasto è il limite di RAID 5. RAID 6 ha due parità.' } : null,
          liv === '1' ? { se: I(n), msg: 'Deve restare almeno un disco con la copia.' } : null
        ]),
        altro: 'Il numero è diverso. Chiediti quante copie, o quante relazioni di parità, proteggono ogni blocco.',
        indizi: liv === '0' ? ['Ogni blocco sta su un solo disco.', 'Non ci sono copie né parità.', 'Nessun guasto è sopportato: 0.'] : liv === '1' ? ['Ogni disco contiene tutto il volume.', 'Basta un superstite.', n + ' − 1 = ' + sopporta + '.'] : liv === '10' ? ['Ogni blocco ha due copie, sui due dischi di una coppia.', 'Il caso peggiore sono due guasti nella stessa coppia.', 'Il numero garantito è 1.'] : ['Ogni striscia ha ' + (liv === '5' ? 'una parità' : 'due parità') + '.', 'Ogni parità ricava un blocco mancante.', 'Guasti sopportati: ' + sopporta + '.'],
        svolgimento: [liv === '0' ? 'Protezione: nessuna.' : liv === '1' ? 'Copie complete: ' + n + '.' : liv === '10' ? 'Copie di ogni blocco: 2, nella stessa coppia.' : 'Parità per striscia: ' + sopporta + '.', 'Guasti sopportati comunque scelti: ' + sopporta + '.'] };
    },
    // 4.6.2 · parità, parità aggiornata, oppure byte ricostruito
    (r) => {
      let a, b, n; do { a = r.int(1, 255); b = r.int(1, 255); n = r.int(0, 255); } while (a === b || n === a || n === b || (a ^ b) === n);
      const cosa = r.int(0, 2), pv = a ^ b, pn = n ^ b;
      if (cosa === 0) { const giuste = E2(pv); return { u: '4.6.2', d: 'In una striscia con due blocchi di dati, A = ' + H2(a) + ' e B = ' + H2(b) + '. Quanto vale la parità P? Rispondi in esadecimale.', segnaposto: 'Un byte', giuste,
        ok: B8(a) + ' XOR ' + B8(b) + ' = ' + B8(pv) + ', cioè ' + H2(pv) + '.',
        diagnosi: DIAG(giuste, [
          { se: E2(a | b), msg: 'Questo è OR. XOR dà 0 dove entrambi i bit valgono 1.' },
          { se: E2(a & b), msg: 'Questo è AND. XOR segnala le colonne in cui i bit sono diversi.' },
          { se: E2((a + b) & 255), msg: 'Questa è la somma. XOR lavora colonna per colonna, senza riporti.' }
        ]),
        altro: 'Il valore è diverso. Scrivi i due byte in binario e confronta le colonne.',
        indizi: ['P = A XOR B.', H2(a) + ' è ' + B8(a) + ', ' + H2(b) + ' è ' + B8(b) + '.', 'Il risultato è ' + B8(pv) + '.'],
        svolgimento: ['A = ' + B8(a) + '.', 'B = ' + B8(b) + '.', 'P = ' + B8(pv) + ' = ' + H2(pv) + '.'] }; }
      if (cosa === 1) { const giuste = E2(pn); return { u: '4.6.2', d: 'Una striscia ha parità P = ' + H2(pv) + '. Il blocco A, che valeva ' + H2(a) + ', viene riscritto con ' + H2(n) + '. Quanto vale la nuova parità? Rispondi in esadecimale.', segnaposto: 'Un byte', giuste,
        ok: H2(pv) + ' XOR ' + H2(a) + ' = ' + H2(b) + ', e ' + H2(b) + ' XOR ' + H2(n) + ' = ' + H2(pn) + '.',
        diagnosi: DIAG(giuste, [
          { se: E2(pv ^ n), msg: 'Hai aggiunto il nuovo A senza togliere il vecchio. Serve anche lo XOR con ' + H2(a) + '.' },
          { se: E2(a ^ n), msg: 'Questo è lo XOR fra vecchio e nuovo A. Va applicato alla vecchia parità, ' + H2(pv) + '.' },
          { se: E2(pv), msg: 'La parità deve cambiare ogni volta che cambia un dato della striscia.' }
        ]),
        altro: 'Il valore è diverso. Applica alla vecchia parità due XOR: con il vecchio A e con il nuovo A.',
        indizi: ['P nuova = P vecchia XOR A vecchio XOR A nuovo.', H2(pv) + ' XOR ' + H2(a) + ' = ' + H2(b) + '.', H2(b) + ' XOR ' + H2(n) + ' = ' + H2(pn) + '.'],
        svolgimento: [H2(pv) + ' XOR ' + H2(a) + ' = ' + H2(b) + ': è il contributo degli altri dati.', H2(b) + ' XOR ' + H2(n) + ' = ' + H2(pn) + '.'] }; }
      const giuste = E2(a);
      return { u: '4.6.2', d: 'Il disco che conteneva il blocco A si è guastato. Sui superstiti si leggono B = ' + H2(b) + ' e la parità P = ' + H2(pv) + '. Quanto valeva A? Rispondi in esadecimale.', segnaposto: 'Un byte', giuste,
        ok: B8(b) + ' XOR ' + B8(pv) + ' = ' + B8(a) + ', cioè ' + H2(a) + '.',
        diagnosi: DIAG(giuste, [
          { se: E2(b | pv), msg: 'Questo è OR. Per ricavare il blocco mancante serve XOR.' },
          { se: E2(b & pv), msg: 'Questo è AND. Per ricavare il blocco mancante serve XOR.' },
          { se: E2(pv), msg: 'La parità da sola contiene anche il contributo di B, che va tolto con uno XOR.' }
        ]),
        altro: 'Il valore è diverso. Calcola B XOR P in binario.',
        indizi: ['A = B XOR P.', H2(b) + ' è ' + B8(b) + ', ' + H2(pv) + ' è ' + B8(pv) + '.', 'Il risultato è ' + B8(a) + '.'],
        svolgimento: ['B = ' + B8(b) + '.', 'P = ' + B8(pv) + '.', 'A = ' + B8(a) + ' = ' + H2(a) + '.'] };
    },
    // 4.6.3 · la pagina corrente, oppure le pagine invalide
    (r) => {
      const s = r.int(0, 3), k = r.int(2, 4), f = r.int(s + 2, 12), ultima = f + k - 1, lista = Array.from({ length: k }, (_, j) => 'P' + (f + j));
      const testa = 'In un’unità a stato solido una pagina logica si trova nella pagina fisica P' + s + '. Viene aggiornata ' + k + ' volte, e il controller usa le pagine libere ' + lista.slice(0, -1).join(', ') + ' e ' + lista[k - 1] + ', in quest’ordine. ';
      if (r.int(0, 1) === 0) { const giuste = ['p' + ultima, String(ultima)]; return { u: '4.6.3', d: testa + 'In quale pagina fisica si trova alla fine il valore corrente?', segnaposto: 'Una pagina', giuste,
        ok: 'Ogni aggiornamento usa una pagina nuova, e l’ultimo va in P' + ultima + '.',
        diagnosi: DIAG(giuste, [
          { se: ['p' + s, String(s)], msg: 'La flash esclude le correzioni sul posto: ogni aggiornamento va in una pagina libera.' },
          { se: ['p' + f, String(f)], msg: 'P' + f + ' riceve il primo aggiornamento. Ne seguono altri.' },
          { se: ['p' + (ultima + 1), String(ultima + 1)], msg: 'Le pagine usate sono ' + k + ', da P' + f + ' a P' + ultima + '.' }
        ]),
        altro: 'La pagina è un’altra. Assegna una pagina libera a ciascun aggiornamento, nell’ordine indicato.',
        indizi: ['Il primo aggiornamento va in P' + f + '.', 'Gli aggiornamenti sono ' + k + '.', 'L’ultimo va in P' + ultima + '.'],
        svolgimento: lista.map((x, j) => 'Aggiornamento ' + (j + 1) + ': ' + x + '.').concat(['Valore corrente: P' + ultima + '.']) }; }
      const giuste = I(k);
      return { u: '4.6.3', d: testa + 'Quante pagine fisiche contengono alla fine versioni superate di quel dato?', segnaposto: 'Un numero', giuste,
        ok: 'Sono invalide P' + s + ' e le prime ' + (k - 1) + ' pagine usate. Soltanto P' + ultima + ' è valida.',
        diagnosi: DIAG(giuste, [
          { se: I(k - 1), msg: 'Anche la pagina di partenza, P' + s + ', contiene una versione superata.' },
          { se: I(k + 1), msg: 'L’ultima pagina scritta, P' + ultima + ', contiene la versione corrente.' },
          { se: I(1), msg: 'Ogni aggiornamento rende invalida la pagina precedente, e gli aggiornamenti sono ' + k + '.' }
        ]),
        altro: 'Il numero è diverso. Elenca le pagine che hanno contenuto il dato ed escludi l’ultima.',
        indizi: ['Il dato è passato per P' + s + ' e per ' + k + ' pagine nuove.', 'In tutto sono ' + (k + 1) + ' pagine, e soltanto l’ultima è valida.', (k + 1) + ' − 1 = ' + k + '.'],
        svolgimento: ['Pagine che hanno contenuto il dato: ' + (k + 1) + '.', 'Valida: P' + ultima + '.', 'Invalide: ' + k + '.'] };
    },
    // 4.6.4 · latenza di una scrittura, oppure amplificazione
    (r) => {
      const v = r.int(1, 7), tr = r.scegli([25, 50]), tp = r.scegli([200, 250, 300]), te = r.scegli([1500, 2000, 3000]), cosa = r.int(0, 3);
      const testa = 'In un’unità a stato solido la lettura di una pagina richiede ' + tr + ' µs, la programmazione ' + tp + ' µs, la cancellazione di un blocco ' + te + ' µs. ';
      if (cosa === 3) { const giuste = US(tp); return { u: '4.6.4', d: testa + 'Il computer chiede di scrivere una pagina, e il controller ha già una pagina libera. Un altro blocco contiene ' + v + ' pagine valide. Quanto dura la scrittura, in microsecondi?', segnaposto: 'Un numero', giuste,
        ok: 'Con una pagina già libera basta la programmazione richiesta: ' + tp + ' µs.',
        diagnosi: DIAG(giuste, [
          { se: US(v * (tr + tp) + te + tp), msg: 'Nessun blocco va recuperato: la pagina libera c’è già.' },
          { se: US(tp + te), msg: 'La cancellazione serve soltanto quando mancano pagine libere.' }
        ]),
        altro: 'Il valore è diverso. Chiediti quali operazioni servono quando una pagina libera è già pronta.',
        indizi: ['Non serve alcuna migrazione.', 'Non serve alcuna cancellazione.', 'Resta la programmazione: ' + tp + ' µs.'],
        svolgimento: ['Migrazioni: nessuna.', 'Cancellazione: nessuna.', 'Programmazione richiesta: ' + tp + ' µs.'] }; }
      const coda = 'Il computer chiede di scrivere una pagina, e il controller deve prima recuperare un blocco che contiene ' + (v === 1 ? '1 pagina valida' : v + ' pagine valide') + '. ';
      if (cosa === 2) { const giuste = I(v + 1); return { u: '4.6.4', d: testa + coda + 'Quanto vale l’amplificazione di scrittura?', segnaposto: 'Un numero', giuste,
        ok: (v === 1 ? 'Una copia' : v + ' copie') + ' più la pagina richiesta: ' + (v + 1) + ' programmazioni per una pagina.',
        diagnosi: DIAG(giuste, [
          { se: I(v), msg: 'Alle copie va aggiunta la pagina che il computer aveva chiesto di scrivere.' },
          { se: I(1), msg: 'Varrebbe 1 se non servisse alcun recupero.' }
        ]),
        altro: 'Il numero è diverso. Conta tutte le pagine programmate e dividi per quelle richieste, che sono una.',
        indizi: ['Le pagine copiate sono ' + v + '.', 'A queste si aggiunge la pagina richiesta.', (v + 1) + ' ÷ 1 = ' + (v + 1) + '.'],
        svolgimento: ['Programmazioni per le copie: ' + v + '.', 'Programmazione richiesta: 1.', 'Amplificazione: ' + (v + 1) + '.'] }; }
      const tot = v * (tr + tp) + te + tp, giuste = US(tot);
      return { u: '4.6.4', d: testa + coda + 'Quanto dura la scrittura, in microsecondi?', segnaposto: 'Un numero', giuste,
        ok: v + ' × ' + (tr + tp) + ' = ' + v * (tr + tp) + ', più ' + te + ' di cancellazione, più ' + tp + ' per la pagina richiesta: ' + tot + ' µs.',
        diagnosi: DIAG(giuste, [
          { se: US(tot - tp), msg: 'Manca la programmazione della pagina richiesta, ' + tp + ' µs.' },
          { se: US(v * tp + te + tp), msg: 'Ogni migrazione comprende anche la lettura della pagina: ' + (tr + tp) + ' µs.' },
          { se: US(te + tp), msg: 'Mancano le migrazioni delle pagine valide.' },
          { se: US(v * (tr + tp) + tp), msg: 'Manca la cancellazione del blocco, ' + te + ' µs.' }
        ]),
        altro: 'Il valore è diverso. Somma migrazioni, cancellazione e scrittura richiesta.',
        indizi: ['Una migrazione: ' + tr + ' + ' + tp + ' = ' + (tr + tp) + ' µs.', 'Migrazioni: ' + v + ' × ' + (tr + tp) + ' = ' + v * (tr + tp) + ' µs.', v * (tr + tp) + ' + ' + te + ' + ' + tp + ' = ' + tot + '.'],
        svolgimento: ['Migrazioni: ' + v + ' × ' + (tr + tp) + ' = ' + v * (tr + tp) + ' µs.', 'Cancellazione: ' + te + ' µs.', 'Scrittura richiesta: ' + tp + ' µs.', 'Latenza: ' + tot + ' µs.'] };
    }
  ] });
})();
