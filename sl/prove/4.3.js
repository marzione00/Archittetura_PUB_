'use strict';
/* Prova del capitolo 4.3: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const H2 = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0'), E2 = (v) => { const h = v.toString(16), l = h.padStart(2, '0'); return Array.from(new Set([l, '0x' + l, l + 'h', h, '0x' + h])); };

  SL.registraProva('4.3', { domande: [
    // 4.3.1 · il ciclo della lettura, oppure il ritardo
    (r) => {
      const fine = r.int(3, 9), t = r.int(1, 14), letto = Math.max(fine, t), cosa = t > fine && r.int(0, 1) === 1 ? 1 : 0;
      const testa = 'Un driver avvia una misura al ciclo 0, e il controller la completa al ciclo ' + fine + '. Il driver legge STATUS per la prima volta al ciclo ' + t + ', e preleva il dato appena READY vale 1. ';
      if (cosa === 0) { const giuste = I(letto); return { u: '4.3.1', d: testa + 'In quale ciclo legge il dato?', segnaposto: 'Un numero', giuste,
        ok: t < fine ? 'Al ciclo ' + t + ' READY vale ancora 0. Il dato diventa leggibile al ciclo ' + fine + '.' : 'Al ciclo ' + t + ' READY vale già 1, e il driver legge subito.',
        diagnosi: DIAG(giuste, [
          { se: I(t < fine ? t : fine), msg: t < fine ? 'Al ciclo ' + t + ' la misura è ancora in corso, e READY vale 0.' : 'Il dato è pronto dal ciclo ' + fine + ', ma il driver arriva soltanto al ciclo ' + t + '.' },
          { se: I(t + fine), msg: 'I due numeri sono istanti, contati entrambi dal ciclo 0. Vale il più grande dei due.' }
        ]),
        altro: 'Il numero è diverso. Il dato si legge nel primo ciclo in cui il driver è presente e READY vale 1.',
        indizi: ['READY passa a 1 al ciclo ' + fine + '.', 'Il driver guarda dal ciclo ' + t + '.', 'Vale il più grande fra ' + fine + ' e ' + t + '.'],
        svolgimento: ['Dato pronto: ciclo ' + fine + '.', 'Prima lettura di STATUS: ciclo ' + t + '.', 'Lettura del dato: ciclo ' + letto + '.'] }; }
      const giuste = I(t - fine);
      return { u: '4.3.1', d: testa + 'Di quanti cicli la lettura è in ritardo rispetto al primo momento possibile?', segnaposto: 'Un numero', giuste,
        ok: 'Il dato era pronto dal ciclo ' + fine + ', e la lettura avviene al ciclo ' + t + ': ' + t + ' − ' + fine + ' = ' + (t - fine) + '.',
        diagnosi: DIAG(giuste, [
          { se: I(t), msg: 'Questo è il ciclo della lettura. Il ritardo si conta da quando il dato era pronto.' },
          { se: I(fine), msg: 'Questo è il ciclo in cui il dato diventa pronto.' },
          { se: I(0), msg: 'Il dato era pronto prima dell’arrivo del driver.' }
        ]),
        altro: 'Il numero è diverso. Si sottragga il ciclo in cui il dato è pronto dal ciclo della lettura.',
        indizi: ['Il dato è pronto dal ciclo ' + fine + '.', 'Il driver lo legge al ciclo ' + t + '.', t + ' − ' + fine + '.'],
        svolgimento: ['Dato pronto: ciclo ' + fine + '.', 'Lettura: ciclo ' + t + '.', 'Ritardo: ' + (t - fine) + ' cicli.'] };
    },
    // 4.3.2 · ritardo e lavoro del polling
    (r) => {
      const per = r.scegli([4, 5, 8, 10, 12, 20]), t = r.int(per + 1, 6 * per - 1), costo = r.scegli([3, 4, 5]), n = Math.ceil(t / per), cosa = r.int(0, 1);
      const testa = 'Un driver controlla una periferica ogni ' + per + ' µs, a partire da ' + per + ' µs. Ogni controllo costa ' + costo + ' cicli di processore. Un evento avviene a ' + t + ' µs. ';
      if (cosa === 0) { const v = n * per - t, giuste = I(v).concat([v + '\u00b5s', v + '\u03bcs']); return { u: '4.3.2', d: testa + 'Quanti microsecondi passano fra l’evento e la sua scoperta?', segnaposto: 'Un numero', giuste,
        ok: 'Il primo controllo dopo l’evento avviene a ' + (n * per) + ' µs: ' + (n * per) + ' − ' + t + ' = ' + v + '.',
        diagnosi: DIAG(giuste, [
          { se: I(t - (n - 1) * per), msg: 'Questa è la distanza dal controllo precedente, che è avvenuto prima dell’evento.' },
          { se: I(n * per), msg: 'Questo è l’istante della scoperta. Il ritardo si conta dall’evento.' },
          { se: I(per), msg: 'Il ritardo vale un periodo intero soltanto se l’evento cade subito dopo un controllo.' }
        ]),
        altro: 'Il numero è diverso. Si determini il primo controllo che avviene dopo ' + t + ' µs, poi si sottragga.',
        indizi: ['I controlli avvengono ai multipli di ' + per + '.', 'Il primo dopo l’evento è a ' + (n * per) + ' µs.', (n * per) + ' − ' + t + '.'],
        svolgimento: ['Controlli: ' + Array.from({ length: n }, (_, k) => (k + 1) * per).join(', ') + ' µs.', 'Primo controllo utile: ' + (n * per) + ' µs.', 'Ritardo: ' + v + ' µs.'] }; }
      const v = n * costo, giuste = I(v);
      return { u: '4.3.2', d: testa + 'Quanti cicli ha speso il driver in controlli fino alla scoperta, compreso quello utile?', segnaposto: 'Un numero', giuste,
        ok: 'I controlli sono ' + n + ', da ' + costo + ' cicli ciascuno: ' + n + ' × ' + costo + ' = ' + v + '.',
        diagnosi: DIAG(giuste, [
          { se: I((n - 1) * costo), msg: 'Conta anche il controllo che scopre l’evento.' },
          { se: I(costo), msg: 'Questo è il costo di un solo controllo. Vanno contati anche quelli a vuoto.' },
          { se: I(n), msg: 'Questo è il numero dei controlli. Ognuno costa ' + costo + ' cicli.' }
        ]),
        altro: 'Il numero è diverso. Conta tutti i controlli fino a quello utile, compreso, e moltiplica per ' + costo + '.',
        indizi: ['Il primo controllo utile è a ' + (n * per) + ' µs.', 'I controlli fino a quel momento sono ' + n + '.', n + ' × ' + costo + '.'],
        svolgimento: ['Controlli: ' + n + '.', 'Costo di ciascuno: ' + costo + ' cicli.', 'Totale: ' + v + ' cicli.'] };
    },
    // 4.3.3 · il vettore e la voce della IDT, oppure l'ordine delle conferme
    (r) => {
      if (r.int(0, 1) === 0) {
        const q = r.int(0, 15), v = 32 + q, cosa = r.int(0, 1), giusto = cosa ? 16 * v : v, giuste = I(giusto);
        return { u: '4.3.3', d: 'Un controller degli interrupt assegna alla linea n il vettore 32 + n. Una periferica attiva la linea ' + q + '. ' + (cosa ? 'Quanti byte separano dall’inizio della IDT la voce usata, se ogni voce occupa 16 byte?' : 'Quale vettore riceve il processore?'), segnaposto: 'Un numero', giuste,
          ok: cosa ? 'Il vettore è 32 + ' + q + ' = ' + v + ', e la voce dista ' + v + ' × 16 = ' + (16 * v) + ' byte.' : 'Il vettore è 32 + ' + q + ' = ' + v + '.',
          diagnosi: DIAG(giuste, [
            cosa ? { se: I(16 * q), msg: 'Alla linea va prima aggiunto 32: il vettore è ' + v + '.' } : { se: I(q), msg: 'Il numero della linea va aumentato di 32, perché i primi vettori sono riservati alle eccezioni.' },
            cosa ? { se: I(v), msg: 'Questo è il vettore. La distanza in byte si ottiene moltiplicandolo per 16.' } : { se: I(16 * v), msg: 'Questa è la distanza in byte della voce. Il vettore è il numero della voce.' },
            cosa ? { se: I(8 * v), msg: 'Le voci occupano 16 byte, il doppio di 8.' } : null
          ]),
          altro: cosa ? 'Il numero è diverso. Si ricavi prima il vettore, poi si moltiplichi per 16.' : 'Il numero è diverso. Si aggiunga 32 al numero della linea.',
          indizi: cosa ? ['Vettore: 32 + ' + q + '.', 'Ogni voce occupa 16 byte.', v + ' × 16.'] : ['I primi 32 vettori sono riservati.', 'La linea 0 riceve il vettore 32.', '32 + ' + q + '.'],
          svolgimento: cosa ? ['Vettore: ' + v + '.', 'Voce: ' + v + ' × 16.', 'Distanza: ' + (16 * v) + ' byte.'] : ['Linea: ' + q + '.', 'Vettore: 32 + ' + q + '.', 'Vettore: ' + v + '.'] };
      }
      const caso = r.int(0, 2), q = r.int(1, 12);
      const D = ['Il gestore di un interrupt a livello sulla linea ' + q + ' toglie la causa nella periferica, e poi manda EOI al controller. Che cosa accade dopo EOI?', 'Il gestore di un interrupt a livello sulla linea ' + q + ' manda EOI al controller mentre la linea è ancora attiva. Che cosa accade dopo EOI?', 'Il gestore di un interrupt a livello sulla linea ' + q + ' toglie la causa nella periferica, e termina senza mandare EOI al controller. Che cosa accade?'][caso];
      const OPZ = ['Il servizio è chiuso, e nessuna nuova consegna avviene', 'Il controller consegna di nuovo la stessa richiesta', 'Il controller trattiene le richieste di priorità pari o inferiore'];
      const PERCHE = ['La linea è a riposo e il controller è libero: l’evento è chiuso su entrambi i fronti.', 'Tornato libero, il controller vede la linea attiva e la tratta come una richiesta nuova.', 'Senza EOI il controller considera il servizio ancora in corso.'];
      return { u: '4.3.3', d: D, guida: 'Si scelga la risposta.', o: [{ t: OPZ[caso], ok: true, fb: PERCHE[caso] }].concat([0, 1, 2].filter((k) => k !== caso).map((k) => ({ t: OPZ[k], fb: k === 0 ? (caso === 1 ? 'La linea è ancora attiva quando il controller torna libero.' : 'Al controller manca la conferma: per lui il servizio è ancora in corso.') : k === 1 ? (caso === 0 ? 'Quando arriva EOI la linea è già a riposo, e non c’è nulla da consegnare.' : 'La linea è a riposo. Il problema è la conferma mancante al controller.') : (caso === 0 ? 'EOI è arrivato, e il controller è tornato libero.' : 'EOI è arrivato, e il controller è libero. Il problema è la linea ancora attiva.') }))) };
    },
    // 4.3.4 · il costo di una coda raggruppata, oppure un registro W1C
    (r) => {
      if (r.int(0, 1) === 0) {
        const b = r.scegli([2, 4, 5, 8, 10, 16]), n = r.int(b + 1, 6 * b), fisso = r.scegli([30, 40, 50]), dato = r.scegli([2, 3, 4]), irq = Math.ceil(n / b), cosa = r.int(0, 1), v = cosa ? irq * fisso + n * dato : irq, giuste = I(v);
        const testa = 'Un controller riceve ' + n + ' campioni e manda un interrupt ogni ' + b + ', più uno per i campioni rimasti alla fine. ';
        return { u: '4.3.4', d: testa + (cosa ? 'Un ingresso nel gestore costa ' + fisso + ' cicli, la lettura di un campione ' + dato + '. Quanti cicli servono in tutto?' : 'Quanti interrupt partono?'), segnaposto: 'Un numero', giuste,
          ok: cosa ? 'Gli interrupt sono ' + irq + ': ' + irq + ' × ' + fisso + ' + ' + n + ' × ' + dato + ' = ' + v + '.' : (n % b ? Math.floor(n / b) + ' gruppi pieni, più uno per i campioni rimasti: ' + irq + '.' : n + ' diviso ' + b + ' fa ' + irq + ', senza resto.'),
          diagnosi: DIAG(giuste, [
            n % b ? { se: I(cosa ? Math.floor(n / b) * fisso + n * dato : Math.floor(n / b)), msg: 'I campioni rimasti alla fine chiedono un interrupt in più.' } : null,
            cosa ? { se: I(irq * fisso), msg: 'Mancano le letture dei campioni, ' + dato + ' cicli ciascuna.' } : { se: I(n), msg: 'Così sarebbe con un interrupt per campione.' },
            cosa ? { se: I(n * (fisso + dato)), msg: 'Questo sarebbe il costo con un interrupt per campione.' } : null
          ]),
          altro: cosa ? 'Il numero è diverso. Conta gli interrupt arrotondando per eccesso, poi somma ingressi e letture.' : 'Il numero è diverso. Si dividano i campioni per la dimensione del gruppo, arrotondando per eccesso.',
          indizi: [n + ' / ' + b + ' = ' + Math.floor(n / b) + (n % b ? ' con resto ' + (n % b) + '.' : ', senza resto.'), 'Gli interrupt sono ' + irq + '.', cosa ? irq + ' × ' + fisso + ' + ' + n + ' × ' + dato + '.' : 'Il gruppo incompleto conta come gli altri.'],
          svolgimento: cosa ? ['Interrupt: ' + irq + '.', 'Ingressi: ' + irq + ' × ' + fisso + ' = ' + (irq * fisso) + '.', 'Letture: ' + n + ' × ' + dato + ' = ' + (n * dato) + '.', 'Totale: ' + v + ' cicli.'] : ['Gruppi pieni: ' + Math.floor(n / b) + '.', n % b ? 'Campioni rimasti: ' + (n % b) + ', un gruppo in più.' : 'Nessun campione rimasto.', 'Interrupt: ' + irq + '.'] };
      }
      const pesi = r.mescola([1, 2, 4, 8]), nomi = ['READY', 'ERROR', 'OVERRUN'], att = [pesi[0], pesi[1], pesi[2]], stato = r.scegli([att[0] | att[1], att[0] | att[1] | att[2], att[0] | att[2]]);
      const accesi = [0, 1, 2].filter((k) => stato & att[k]), k0 = r.scegli(accesi), cosa = r.int(0, 1);
      const legenda = [0, 1, 2].map((k) => nomi[k] + ' è il bit di peso ' + att[k]).join(', ');
      if (cosa === 0) { const giuste = E2(att[k0]); return { u: '4.3.4', d: 'Un registro di stato segue la regola W1C. ' + legenda + '. Il registro vale ' + H2(stato) + '. Quale valore va scritto per cancellare soltanto ' + nomi[k0] + '? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x02', giuste,
        ok: 'Si scrive 1 nel solo bit da cancellare: ' + H2(att[k0]) + '.',
        diagnosi: DIAG(giuste, [
          { se: E2(stato & ~att[k0]), msg: 'Questo è il valore che vorresti ottenere. In un registro W1C si scrive ciò che si vuole cancellare.' },
          { se: E2(stato), msg: 'Così si cancellerebbero tutti i flag accesi.' },
          { se: E2(0), msg: 'Uno zero non cancella nulla.' }
        ]),
        altro: 'Il valore è diverso. Si scriva 1 soltanto nel bit del flag da cancellare.',
        indizi: ['Ogni 1 scritto cancella il proprio flag.', nomi[k0] + ' è il bit di peso ' + att[k0] + '.', 'Il valore è ' + H2(att[k0]) + '.'],
        svolgimento: ['Flag da cancellare: ' + nomi[k0] + '.', 'Peso: ' + att[k0] + '.', 'Valore da scrivere: ' + H2(att[k0]) + '.'] }; }
      const scritto = r.scegli([att[k0], stato & ~att[k0], stato]), dopo = stato & ~scritto, giuste = E2(dopo);
      return { u: '4.3.4', d: 'Un registro di stato segue la regola W1C. ' + legenda + '. Il registro vale ' + H2(stato) + ', e il driver vi scrive ' + H2(scritto) + '. Quanto vale il registro subito dopo? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x02', giuste,
        ok: 'Ogni bit a 1 del valore scritto cancella il proprio flag: da ' + H2(stato) + ' resta ' + H2(dopo) + '.',
        diagnosi: DIAG(giuste, [
          { se: E2(scritto), msg: 'In un registro W1C il valore scritto fa da maschera. I flag che nomina vengono cancellati.' },
          { se: E2(stato), msg: 'La scrittura ha effetto: ogni 1 cancella il flag corrispondente.' },
          { se: E2(stato | scritto), msg: 'Scrivere 1 cancella il flag, senza accenderlo.' }
        ]),
        altro: 'Il valore è diverso. Spegni nel registro i bit che nel valore scritto valgono 1.',
        indizi: ['Il registro vale ' + H2(stato) + '.', 'Il valore scritto, ' + H2(scritto) + ', dice quali bit spegnere.', 'Gli altri bit restano come sono.'],
        svolgimento: ['Prima: ' + H2(stato) + '.', 'Bit cancellati: quelli a 1 in ' + H2(scritto) + '.', 'Dopo: ' + H2(dopo) + '.'] };
    }
  ] });
})();
