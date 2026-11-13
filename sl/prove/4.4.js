'use strict';
/* Prova del capitolo 4.4: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const H2 = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0');
  const CON = (v, coda) => I(v).concat(coda.map((c) => v + c));
  const MB = (v) => CON(v, ['mb/s', 'mb']), CI = (v) => CON(v, ['cicli']), US = (v) => CON(v, ['µs', 'μs', 'us', 'microsecondi']);

  SL.registraProva('4.4', { domande: [
    // 4.4.1 · chi risponde a un indirizzo, oppure il numero del registro
    (r) => {
      const base = r.scegli([0x80, 0xA0, 0xC0]), fine = base + 15, testa = 'Su un bus la RAM occupa gli indirizzi da 0x00 a 0x7F, e i registri di un controller quelli da ' + H2(base) + ' a ' + H2(fine) + '. ';
      if (r.int(0, 1) === 0) {
        const n = r.int(1, 15), a = base + n, giuste = Array.from(new Set(I(n).concat([n.toString(16), '0x' + n.toString(16), '0x0' + n.toString(16)])));
        return { u: '4.4.1', d: testa + 'Quale registro del controller, contando da 0, corrisponde all’indirizzo ' + H2(a) + '?', segnaposto: 'Un numero', giuste,
          ok: H2(a) + ' − ' + H2(base) + ' = ' + n + '.',
          diagnosi: DIAG(giuste, [
            { se: I(a), msg: 'Questo è l’indirizzo sul bus in base dieci. Va sottratto l’inizio dell’intervallo, ' + base + '.' },
            { se: [a.toString(16), '0x' + a.toString(16)], msg: 'Questo è l’indirizzo sul bus. Il numero del registro si conta dall’inizio dell’intervallo.' },
            { se: I(n + 1), msg: 'Il primo registro è il numero 0, all’indirizzo ' + H2(base) + '.' }
          ]),
          altro: 'Il numero è diverso. Sottrai dall’indirizzo l’inizio dell’intervallo del controller.',
          indizi: ['L’intervallo del controller comincia a ' + H2(base) + '.', 'In base dieci: ' + a + ' − ' + base + '.', a + ' − ' + base + ' = ' + n + '.'],
          svolgimento: ['Indirizzo: ' + H2(a) + ' = ' + a + '.', 'Inizio dell’intervallo: ' + H2(base) + ' = ' + base + '.', 'Registro: ' + n + '.'] };
      }
      const cat = r.scegli(['ram', 'ctl', 'no']), a = cat === 'ram' ? r.int(0, 127) : cat === 'ctl' ? r.int(base, fine) : (base > 128 && r.int(0, 1) === 0 ? r.int(128, base - 1) : r.int(fine + 1, 255));
      const perche = cat === 'ram' ? H2(a) + ' è minore di 0x80, e appartiene alla RAM.' : cat === 'ctl' ? H2(a) + ' sta fra ' + H2(base) + ' e ' + H2(fine) + '.' : H2(a) + ' cade fuori dai due intervalli.';
      return { u: '4.4.1', d: testa + 'Un iniziatore ottiene il turno e mette sul bus l’indirizzo ' + H2(a) + '. Quale componente risponde?', guida: 'Scegli la risposta.', o: r.mescola([
        { t: 'La RAM', ok: cat === 'ram', fb: perche },
        { t: 'Il controller', ok: cat === 'ctl', fb: perche },
        { t: 'Nessuno, e la transazione si chiude con un errore', ok: cat === 'no', fb: perche }]) };
    },
    // 4.4.2 · la banda aggregata
    (r) => {
      const w = r.scegli([16, 32, 64]), f = r.scegli([25, 50, 100, 125, 200, 250]), ddr = r.int(0, 1) === 1, link = r.int(1, 2), b = w / 8, beat = ddr ? 2 : 1, tot = b * beat * f * link, giuste = MB(tot);
      return { u: '4.4.2', d: 'Due flussi continui di dati usano ' + (link === 1 ? 'un solo bus condiviso, largo ' : 'due link indipendenti, uno per flusso, larghi ') + w + ' bit, con un clock a ' + f + ' MHz in modo ' + (ddr ? 'DDR' : 'SDR') + '. Qual è la banda aggregata, in MB/s?', segnaposto: 'Un numero', giuste,
        ok: b + ' byte × ' + beat + ' × ' + f + ' MHz × ' + link + ' = ' + tot + ' MB/s.',
        diagnosi: DIAG(giuste, [
          { se: MB(w * beat * f * link), msg: 'Hai moltiplicato i bit. La larghezza va divisa per otto: ' + b + ' byte per trasferimento.' },
          ddr ? { se: MB(b * f * link), msg: 'In modo DDR ogni ciclo porta due trasferimenti.' } : { se: MB(b * 2 * f * link), msg: 'In modo SDR ogni ciclo porta un solo trasferimento.' },
          link === 2 ? { se: MB(b * beat * f), msg: 'Questa è la capacità di un link. I link attivi insieme sono due.' } : { se: MB(b * beat * f * 2), msg: 'I due flussi si alternano sullo stesso bus, che resta una risorsa sola.' }
        ]),
        altro: 'Il valore è diverso. I fattori sono quattro: byte per trasferimento, trasferimenti per ciclo, megahertz, collegamenti attivi insieme.',
        indizi: [w + ' bit sono ' + b + ' byte.', 'Trasferimenti per ciclo: ' + beat + '. Collegamenti attivi insieme: ' + link + '.', b + ' × ' + beat + ' × ' + f + ' × ' + link + ' = ' + tot + '.'],
        svolgimento: ['Byte per trasferimento: ' + w + ' ÷ 8 = ' + b + '.', 'Un collegamento: ' + b + ' × ' + beat + ' × ' + f + ' = ' + b * beat * f + ' MB/s.', 'Collegamenti attivi insieme: ' + link + '.', 'Banda aggregata: ' + tot + ' MB/s.'] };
    },
    // 4.4.3 · i cicli di una raffica o di transazioni singole, oppure il risparmio
    (r) => {
      const n = r.int(2, 12), w = r.int(0, 5), raff = 1 + w + n, sing = n * (2 + w), cosa = r.int(0, 2), testa = 'Un protocollo prevede un ciclo per l’indirizzo, seguito da ' + (w === 0 ? 'nessun ciclo' : w === 1 ? 'un ciclo' : w + ' cicli') + ' di attesa, e poi una parola per ciclo. Vanno trasferite ' + n + ' parole consecutive. ';
      if (cosa === 2) { const v = sing - raff, giuste = CI(v); return { u: '4.4.3', d: testa + 'Quanti cicli fa risparmiare una raffica rispetto a ' + n + ' transazioni singole?', segnaposto: 'Un numero', giuste,
        ok: 'Transazioni singole: ' + sing + ' cicli. Raffica: ' + raff + ' cicli. La differenza è ' + v + '.',
        diagnosi: DIAG(giuste, [
          { se: CI(raff), msg: 'Questa è la durata della raffica. Il risparmio è la differenza con le transazioni singole.' },
          { se: CI(sing), msg: 'Questa è la durata delle transazioni singole. Va sottratta la durata della raffica.' },
          { se: CI(n * (1 + w)), msg: 'Anche la raffica paga una volta indirizzo e attesa: le ripetizioni risparmiate sono ' + (n - 1) + '.' }
        ]),
        altro: 'Il numero è diverso. Calcola le due durate e sottrai.',
        indizi: ['Singole: ' + n + ' × (1 + ' + w + ' + 1).', 'Raffica: 1 + ' + w + ' + ' + n + '.', sing + ' − ' + raff + ' = ' + v + '.'],
        svolgimento: ['Transazioni singole: ' + n + ' × ' + (2 + w) + ' = ' + sing + ' cicli.', 'Raffica: 1 + ' + w + ' + ' + n + ' = ' + raff + ' cicli.', 'Risparmio: ' + v + ' cicli.'] }; }
      const R = cosa === 0, v = R ? raff : sing, giuste = CI(v);
      return { u: '4.4.3', d: testa + 'Quanti cicli servono in tutto con ' + (R ? 'una sola raffica?' : n + ' transazioni singole?'), segnaposto: 'Un numero', giuste,
        ok: R ? '1 + ' + w + ' + ' + n + ' = ' + raff + ' cicli.' : 'Ogni transazione dura 1 + ' + w + ' + 1 = ' + (2 + w) + ' cicli, e ' + n + ' × ' + (2 + w) + ' = ' + sing + '.',
        diagnosi: DIAG(giuste, [
          { se: CI(R ? sing : raff), msg: R ? 'Questa è la durata delle transazioni singole. La raffica paga indirizzo e attesa una volta.' : 'Questa è la durata della raffica. Qui ogni parola ripete indirizzo e attesa.' },
          { se: CI(n), msg: 'Questi sono i soli cicli di dati. Vanno aggiunti indirizzo e attese.' },
          R ? { se: CI(w + n), msg: 'Manca il ciclo di indirizzo.' } : { se: CI(n * (1 + w)), msg: 'A ogni transazione va aggiunto il ciclo in cui viaggia il dato.' }
        ]),
        altro: 'Il numero è diverso. Conta le presentazioni di indirizzo, le attese che le seguono e i cicli di dati.',
        indizi: R ? ['L’indirizzo si presenta una volta.', 'Indirizzo e attesa: 1 + ' + w + ' cicli.', (1 + w) + ' + ' + n + ' = ' + raff + '.'] : ['Ogni parola ha la propria transazione.', 'Una transazione: 1 + ' + w + ' + 1 = ' + (2 + w) + ' cicli.', n + ' × ' + (2 + w) + ' = ' + sing + '.'],
        svolgimento: R ? ['Indirizzo: 1 ciclo.', 'Attesa: ' + w + ' cicli.', 'Dati: ' + n + ' cicli.', 'Totale: ' + raff + ' cicli.'] : ['Una transazione: ' + (2 + w) + ' cicli.', 'Transazioni: ' + n + '.', 'Totale: ' + sing + ' cicli.'] };
    },
    // 4.4.4 · attesa o completamento di un richiedente
    (r) => {
      const IDS = ['A', 'B', 'C'], rr = r.int(0, 2) > 0, last = r.scegli(IDS), oss = r.scegli(IDS), T = r.scegli([4, 5, 6, 8]), fine = r.int(0, 1) === 1;
      const ord = (rot, l) => { const s = rot ? (IDS.indexOf(l) + 1) % 3 : 0; return IDS.slice(s).concat(IDS.slice(0, s)); };
      const o = ord(rr, last), pos = o.indexOf(oss), v = T * pos + (fine ? T : 0), giuste = CI(v), altra = T * ord(!rr, last).indexOf(oss) + (fine ? T : 0), daUltimo = T * ((IDS.indexOf(oss) - IDS.indexOf(last) + 3) % 3) + (fine ? T : 0);
      return { u: '4.4.4', d: 'Tre componenti, A, B e C, chiedono un bus nello stesso istante. L’arbitro usa ' + (rr ? 'il round-robin con ordine circolare A, B, C' : 'la priorità fissa A, B, C') + ', e l’ultimo servito è stato ' + last + '. Ogni turno dura ' + T + ' cicli. ' + (fine ? 'Quanti cicli sono trascorsi dall’arrivo delle richieste quando ' + oss + ' ha completato il suo turno?' : 'Dopo quanti cicli di attesa comincia il turno di ' + oss + '?'), segnaposto: 'Un numero', giuste,
        ok: 'L’ordine è ' + o.join(', ') + '. Prima di ' + oss + ' ' + (pos === 1 ? 'c’è 1 turno' : 'ci sono ' + pos + ' turni') + ': ' + T + ' × ' + pos + ' = ' + T * pos + (fine ? ', e ' + T * pos + ' + ' + T + ' = ' + v + '.' : '.'),
        diagnosi: DIAG(giuste, [
          { se: CI(altra), msg: rr ? 'Questo sarebbe il risultato con la priorità fissa. La rotazione riparte dal successivo di ' + last + '.' : 'Questo sarebbe il risultato con il round-robin. La priorità fissa ignora l’ultimo servito.' },
          rr ? { se: CI(daUltimo), msg: 'La rotazione riparte dal successivo di ' + last + ', che va in fondo.' } : null,
          { se: CI(fine ? T * pos : T * pos + T), msg: fine ? 'Questo è l’inizio del turno. Per il completamento vanno aggiunti i ' + T + ' cicli del turno.' : 'Questo è il completamento. L’attesa termina quando il turno comincia.' }
        ]),
        altro: 'Il numero è diverso. Scrivi l’ordine dei tre turni e conta quelli che precedono ' + oss + '.',
        indizi: [rr ? 'Dopo ' + last + ' la rotazione riparte da ' + o[0] + '.' : 'Con la priorità fissa l’ordine è sempre A, B, C.', 'Ordine: ' + o.join(', ') + '. Turni prima di ' + oss + ': ' + pos + '.', fine ? T + ' × ' + pos + ' + ' + T + ' = ' + v + '.' : T + ' × ' + pos + ' = ' + v + '.'],
        svolgimento: ['Ordine dei turni: ' + o.join(', ') + '.', 'Turni che precedono ' + oss + ': ' + pos + '.', 'Attesa: ' + T + ' × ' + pos + ' = ' + T * pos + ' cicli.'].concat(fine ? ['Completamento: ' + T * pos + ' + ' + T + ' = ' + v + ' cicli.'] : []) };
    },
    // 4.4.5 · la latenza attraverso un ponte
    (r) => {
      const b = r.scegli([32, 64, 96, 128, 160, 192, 256]), vin = r.scegli([16, 32]), vout = r.scegli([8, 16]), tp = r.int(1, 3), q = r.int(0, 4), usc = r.scegli(['solo', 'stessa', 'distinta']);
      const rx = b / vin, tx = b / vout, dav = q + (usc === 'stessa' ? 1 : 0), v = rx + tp + dav * tx + tx, giuste = US(v);
      return { u: '4.4.5', d: 'Un pacchetto di ' + b + ' byte raggiunge un ponte store-and-forward su un link da ' + vin + ' byte per microsecondo. Il ponte impiega ' + tp + ' µs a scegliere l’uscita, che porta ' + vout + ' byte per microsecondo. Davanti a quell’uscita ' + (q === 0 ? 'non attende alcun pacchetto' : q === 1 ? 'attende già 1 pacchetto della stessa taglia' : 'attendono già ' + q + ' pacchetti della stessa taglia') + '. ' + (usc === 'stessa' ? 'Un secondo flusso, con un pacchetto della stessa taglia, chiede la stessa uscita e viene servito prima. ' : usc === 'distinta' ? 'Un secondo flusso, con un pacchetto della stessa taglia, attraversa il ponte verso un’uscita diversa. ' : '') + 'Qual è la latenza del pacchetto, in microsecondi?', segnaposto: 'Un numero', giuste,
        ok: rx + ' di ricezione, ' + tp + ' nel ponte, ' + dav * tx + ' di coda, ' + tx + ' di invio: ' + v + ' µs.',
        diagnosi: DIAG(giuste, [
          { se: US(v - tp), msg: 'Manca il tempo speso dal ponte, ' + tp + ' µs.' },
          usc === 'stessa' ? { se: US(v - tx), msg: 'Il secondo flusso passa per la stessa uscita prima del pacchetto: i pacchetti davanti sono ' + dav + '.' } : null,
          usc === 'distinta' ? { se: US(v + tx), msg: 'Il secondo flusso usa un’altra uscita e procede in parallelo.' } : null,
          { se: US(rx + tp + dav * tx), msg: 'Dopo la coda va aggiunto l’invio del pacchetto stesso, ' + tx + ' µs.' },
          vin !== vout ? { se: US(rx + tp + dav * rx + rx), msg: 'Coda e invio dipendono dalla velocità dell’uscita, ' + vout + ' byte per microsecondo.' } : null
        ]),
        altro: 'Il valore è diverso. Somma ricezione, tempo del ponte, coda e invio.',
        indizi: ['Ricezione: ' + b + ' ÷ ' + vin + ' = ' + rx + ' µs. Un pacchetto sull’uscita: ' + b + ' ÷ ' + vout + ' = ' + tx + ' µs.', 'Pacchetti davanti: ' + dav + '. Coda: ' + dav * tx + ' µs.', rx + ' + ' + tp + ' + ' + dav * tx + ' + ' + tx + ' = ' + v + '.'],
        svolgimento: ['Ricezione: ' + b + ' ÷ ' + vin + ' = ' + rx + ' µs.', 'Ponte: ' + tp + ' µs.', 'Coda: ' + dav + ' × ' + tx + ' = ' + dav * tx + ' µs.', 'Invio: ' + tx + ' µs.', 'Latenza: ' + v + ' µs.'] };
    }
  ] });
})();
