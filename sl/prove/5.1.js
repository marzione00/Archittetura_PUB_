'use strict';
/* Prova del capitolo 5.1: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const H = (v) => '0x' + v.toString(16).toUpperCase(), EH = (v) => { const h = v.toString(16); return [h, '0x' + h, h + 'h']; };

  SL.registraProva('5.1', { domande: [
    // 5.1.1 · una sequenza di scritture in processi diversi, poi una lettura
    (r) => {
      const N = r.int(0, 1) === 0 ? ['A', 'B'] : ['A', 'B', 'C'], ind = r.scegli([0x1000, 0x2000, 0x4000, 0x8000]), k = r.int(2, 4), ops = [], mem = {};
      const usati = new Set(); for (let j = 0; j < k; j++) { let v; do { v = r.int(1, 99); } while (usati.has(v)); usati.add(v); const chi = r.scegli(N); ops.push([chi, v]); mem[chi] = v; }
      const lett = r.scegli(N), v = mem[lett] == null ? 0 : mem[lett], giuste = I(v), ultimo = ops[ops.length - 1][1];
      return { u: '5.1.1', d: 'I processi ' + N.slice(0, -1).join(', ') + ' e ' + N[N.length - 1] + ' eseguono il medesimo programma, con una variabile all’indirizzo virtuale ' + H(ind) + ' che all’inizio vale 0 in ciascuno. Nell’ordine: ' + ops.map((o) => o[0] + ' vi scrive ' + o[1]).join(', poi ') + '. Infine ' + lett + ' legge l’indirizzo ' + H(ind) + '. Quale valore trova?', segnaposto: 'Un numero', giuste,
        ok: mem[lett] == null ? lett + ' non ha mai scritto nella propria cella, che vale ancora 0.' : lett + ' legge attraverso la propria tabella, e ritrova l’ultimo valore che aveva scritto: ' + v + '.',
        diagnosi: DIAG(giuste, [
          { se: I(ultimo), msg: 'Questo è l’ultimo valore scritto, e la scrittura è di ' + ops[ops.length - 1][0] + ', nella propria cella. La tabella di ' + lett + ' conduce altrove.' },
          { se: I(ops.reduce((x, o) => x + o[1], 0)), msg: 'Le scritture riguardano celle diverse, e i valori non si sommano.' },
          mem[lett] != null ? { se: I(0), msg: lett + ' aveva scritto nella propria cella, e nessun altro processo può modificarla.' } : null
        ]),
        altro: 'Il valore è diverso. Si considerino soltanto le scritture compiute da ' + lett + '.',
        indizi: ['Ogni processo ha la propria tabella, e quindi la propria cella.', mem[lett] == null ? lett + ' non compare fra i processi che hanno scritto.' : 'L’ultima scrittura di ' + lett + ' è ' + v + '.', 'La cella di ' + lett + ' contiene ' + v + '.'],
        svolgimento: N.map((x) => 'Cella di ' + x + ': ' + (mem[x] == null ? 0 : mem[x]) + '.').concat([lett + ' legge ' + v + '.']) };
    },
    // 5.1.2 · lo stato dopo un evento, oppure i turni di attesa in coda
    (r) => {
      if (r.int(0, 3) === 0) { const coda = r.mescola(['B', 'C', 'D', 'E', 'F']).slice(0, r.int(1, 4)), giuste = I(coda.length); return { u: '5.1.2', d: 'La coda dei pronti contiene, nell’ordine, ' + coda.join(', ') + '. Il processo A, in esecuzione, esaurisce il time slice. Il dispatcher seleziona sempre il primo della coda, e nessun processo si blocca o termina. Quanti turni di altri processi trascorrono prima che A riceva di nuovo il processore?', segnaposto: 'Un numero', giuste,
        ok: 'A passa all’ultima posizione della coda: ' + coda.concat(['A']).join(', ') + '. È preceduto da ' + coda.length + (coda.length === 1 ? ' processo.' : ' processi.'),
        diagnosi: DIAG(giuste, [
          { se: I(coda.length + 1), msg: 'Si contano soltanto i processi che precedono A, che sono ' + coda.length + '.' },
          { se: I(0), msg: 'A torna all’ultima posizione della coda, dopo i processi già pronti.' }
        ]),
        altro: 'Il numero è diverso. Si scriva la coda dopo il ritorno di A e si contino i processi che lo precedono.',
        indizi: ['A torna pronto, all’ultima posizione della coda.', 'La coda diviene ' + coda.concat(['A']).join(', ') + '.', 'Processi che precedono A: ' + coda.length + '.'],
        svolgimento: ['Coda dopo la scadenza: ' + coda.concat(['A']).join(', ') + '.', 'Turni prima di A: ' + coda.length + '.'] }; }
      const E = r.scegli([
        ['è in esecuzione e richiede al kernel una lettura dal disco', 'Bloccato', 'Gli manca un evento, la risposta del disco.'],
        ['è in esecuzione e si pone in attesa di un tasto dalla tastiera', 'Bloccato', 'Gli manca un evento, la pressione del tasto.'],
        ['è in esecuzione quando il timer segnala la fine del suo time slice, e ha ancora calcoli da svolgere', 'Pronto', 'Potrebbe proseguire immediatamente: gli manca soltanto il turno.'],
        ['è bloccato in attesa di dati dal disco, e i dati giungono mentre un altro processo è in esecuzione', 'Pronto', 'L’evento si è verificato. Per eseguire gli occorre ancora il processore.'],
        ['è pronto, in testa alla coda, e il dispatcher gli consegna il processore', 'In esecuzione', 'Il dispatcher lo ha selezionato, e ora impiega il processore.'],
        ['è in esecuzione ed esegue la sua ultima istruzione', 'Terminato', 'Non ha più istruzioni da eseguire, e lascia il sistema.']
      ]);
      return { u: '5.1.2', d: 'Un processo ' + E[0] + '. In quale stato passa?', guida: 'Si scelga la risposta.', o: r.mescola(['Pronto', 'Bloccato', 'In esecuzione', 'Terminato'].map((t) => ({ t, ok: t === E[1], fb: E[2] }))) };
    },
    // 5.1.3 · il contatore salvato, oppure le istruzioni completate
    (r) => {
      const base = r.scegli([0x1000, 0x2400, 0x3000, 0x4800, 0x7000]), L = r.scegli([4, 4, 8]), n = r.int(2, 15), pc = base + L * n;
      if (r.int(0, 2) > 0) { const giuste = EH(pc); return { u: '5.1.3', d: 'Un processo ha inizio all’indirizzo ' + H(base) + '. Ogni istruzione occupa ' + L + ' byte. Il timer lo interrompe dopo che ha completato ' + n + ' istruzioni. Quale valore salva il kernel come contatore di programma? Si risponda in esadecimale.', segnaposto: 'Un indirizzo', giuste,
        ok: n + ' × ' + L + ' = ' + L * n + ', che si scrive ' + H(L * n) + '. ' + H(base) + ' + ' + H(L * n) + ' = ' + H(pc) + '.',
        diagnosi: DIAG(giuste, [
          { se: EH(base + n), msg: 'È stato sommato il numero di istruzioni. Ognuna occupa ' + L + ' byte: lo spostamento è ' + L * n + '.' },
          { se: EH(pc - L), msg: H(pc - L) + ' è l’indirizzo dell’ultima istruzione completata. La successiva si trova ' + L + ' byte più avanti.' },
          { se: EH(parseInt(base.toString(16).slice(0, -String(L * n).length) + String(L * n), 16)), msg: 'Lo spostamento ' + L * n + ' è in base dieci. In esadecimale si scrive ' + H(L * n) + '.' },
          { se: EH(base), msg: 'Il processo riprende dal punto raggiunto: il contatore è avanzato di ' + L * n + ' byte.' }
        ]),
        altro: 'L’indirizzo è diverso. Si moltiplichino le istruzioni per ' + L + ' e si sommi il risultato, in esadecimale, a ' + H(base) + '.',
        indizi: [n + ' istruzioni occupano ' + L * n + ' byte.', L * n + ' = ' + Math.floor(L * n / 16) + ' × 16 + ' + (L * n) % 16 + ', cioè ' + H(L * n) + '.', H(base) + ' + ' + H(L * n) + ' = ' + H(pc) + '.'],
        svolgimento: ['Byte percorsi: ' + n + ' × ' + L + ' = ' + L * n + '.', L * n + ' = ' + H(L * n) + '.', 'Contatore salvato: ' + H(pc) + '.'] }; }
      const giuste = I(n);
      return { u: '5.1.3', d: 'Un processo ha inizio all’indirizzo ' + H(base) + ', e ogni istruzione occupa ' + L + ' byte. Al cambio di contesto il kernel salva per esso il contatore di programma ' + H(pc) + '. Quante istruzioni aveva completato?', segnaposto: 'Un numero', giuste,
        ok: H(pc) + ' − ' + H(base) + ' = ' + H(L * n) + ', cioè ' + L * n + ' byte. ' + L * n + ' ÷ ' + L + ' = ' + n + '.',
        diagnosi: DIAG(giuste, [
          { se: I(L * n), msg: 'Questi sono i byte percorsi. Ogni istruzione ne occupa ' + L + '.' },
          { se: I(n + 1), msg: 'Il contatore indica l’istruzione successiva, ancora da eseguire.' },
          { se: I(n - 1), msg: 'Le istruzioni completate sono tutte quelle che precedono l’indirizzo salvato.' }
        ]),
        altro: 'Il numero è diverso. Si sottragga l’indirizzo iniziale dal contatore salvato e si divida per ' + L + '.',
        indizi: ['Differenza: ' + H(pc) + ' − ' + H(base) + ' = ' + H(L * n) + '.', H(L * n) + ' vale ' + L * n + ' in base dieci.', L * n + ' ÷ ' + L + ' = ' + n + '.'],
        svolgimento: ['Byte percorsi: ' + H(L * n) + ' = ' + L * n + '.', 'Istruzioni: ' + L * n + ' ÷ ' + L + ' = ' + n + '.'] };
    },
    // 5.1.4 · una voce della tabella, oppure la coda in cui si trova un PCB
    (r) => {
      if (r.int(0, 1) === 0) { const bl = r.mescola([2, 3, 4, 5, 6, 7, 9, 11, 12, 14]).slice(0, 4), pag = r.int(0, 3), giuste = I(bl[pag]); return { u: '5.1.4', d: 'Il dispatcher attiva la tabella delle pagine indicata nel PCB di un processo. La tabella associa le pagine 0, 1, 2 e 3 ai blocchi ' + bl.slice(0, 3).join(', ') + ' e ' + bl[3] + ' della memoria fisica. Il processo accede a un indirizzo della pagina ' + pag + '. In quale blocco si trova il dato?', segnaposto: 'Un numero', giuste,
        ok: 'La voce della pagina ' + pag + ' indica il blocco ' + bl[pag] + '.',
        diagnosi: DIAG(giuste, [
          pag > 0 ? { se: I(bl[pag - 1]), msg: 'Il blocco ' + bl[pag - 1] + ' corrisponde alla pagina ' + (pag - 1) + '. Le pagine sono numerate da 0.' } : null,
          { se: I(pag), msg: 'Questo è il numero della pagina. Il blocco si legge nella tabella.' }
        ]),
        altro: 'Il numero è diverso. Si contino le voci della tabella a partire dalla pagina 0.',
        indizi: ['La pagina 0 corrisponde al blocco ' + bl[0] + '.', 'Le voci seguono l’ordine delle pagine: ' + bl.join(', ') + '.', 'Pagina ' + pag + ' → blocco ' + bl[pag] + '.'],
        svolgimento: ['Pagine 0, 1, 2, 3 → blocchi ' + bl.join(', ') + '.', 'Pagina ' + pag + ' → blocco ' + bl[pag] + '.'] }; }
      const E = r.scegli([
        ['ha richiesto una lettura dal disco D, che non ha ancora risposto', 'Nella coda di attesa del disco D', 'Il processo è bloccato, e la sua scheda si trova fra quelle in attesa di tale disco.'],
        ['aveva richiesto una lettura dal disco D, che ha appena risposto mentre un altro processo è in esecuzione', 'Nella coda dei pronti', 'Il gestore lo ha rimosso dalla coda di attesa: ora gli manca soltanto il processore.'],
        ['ha esaurito il time slice e ha ancora calcoli da svolgere', 'Nella coda dei pronti', 'Attende soltanto un nuovo turno, senza alcun evento.'],
        ['attende un pacchetto dalla scheda di rete, che deve ancora giungere', 'Nella coda di attesa della scheda di rete', 'Il processo è bloccato, e la sua scheda si trova fra quelle in attesa di tale periferica.']
      ]);
      return { u: '5.1.4', d: 'Un processo ' + E[0] + '. In quale elenco del kernel si trova il suo PCB?', guida: 'Si scelga la risposta.', o: r.mescola(['Nella coda dei pronti', 'Nella coda di attesa del disco D', 'Nella coda di attesa della scheda di rete'].map((t) => ({ t, ok: t === E[1], fb: E[2] }))) };
    }
  ] });
})();
