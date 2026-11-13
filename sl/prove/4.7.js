'use strict';
/* Prova del capitolo 4.7: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const CON = (v, coda) => I(v).concat(coda.map((c) => v + c));
  const CI = (v) => CON(v, ['cicli']), US = (v) => CON(v, ['µs', 'μs', 'us', 'microsecondi']);
  const H = (v) => '0x' + v.toString(16).toUpperCase(), EH = (v) => { const h = v.toString(16); return [h, '0x' + h, h + 'h']; };

  SL.registraProva('4.7', { domande: [
    // 4.7.1 · costo del DMA, risparmio, oppure soglia
    (r) => {
      const c = r.scegli([4, 5, 6, 8]), s = 4 * r.int(3, 20), f = r.scegli([4, 8, 12]), fisso = s + f, soglia = Math.floor(fisso / c) + 1, cosa = r.int(0, 2);
      const testa = 'Con l’I/O programmato ogni parola costa al processore ' + c + ' cicli. Una richiesta DMA gli costa ' + s + ' cicli di preparazione e ' + f + ' di completamento. ';
      if (cosa === 0) { const giuste = I(soglia).concat([soglia + 'parole']); return { u: '4.7.1', d: testa + 'Qual è la prima lunghezza, in parole, per cui il DMA fa risparmiare?', segnaposto: 'Un numero', giuste,
        ok: 'Il costo fisso è ' + fisso + ' cicli. ' + c + ' × ' + (soglia - 1) + ' = ' + c * (soglia - 1) + (c * (soglia - 1) === fisso ? ' è il pareggio' : ' resta sotto') + ', e ' + c + ' × ' + soglia + ' = ' + c * soglia + ' lo supera.',
        diagnosi: DIAG(giuste, [
          { se: I(soglia - 1), msg: c * (soglia - 1) === fisso ? 'Con ' + (soglia - 1) + ' parole i due costi sono uguali. Il risparmio comincia dalla parola successiva.' : 'Con ' + (soglia - 1) + ' parole l’I/O programmato costa ' + c * (soglia - 1) + ' cicli, ancora meno di ' + fisso + '.' },
          { se: I(soglia + 1), msg: 'Già con ' + soglia + ' parole l’I/O programmato costa ' + c * soglia + ' cicli, più di ' + fisso + '.' },
          { se: I(Math.floor(s / c) + 1), msg: 'Nel costo fisso vanno contati anche i ' + f + ' cicli del completamento.' }
        ]),
        altro: 'Il numero è diverso. Cerca la prima lunghezza per cui ' + c + ' × n supera ' + fisso + '.',
        indizi: ['Costo fisso del DMA: ' + s + ' + ' + f + ' = ' + fisso + ' cicli.', c + ' × ' + (soglia - 1) + ' = ' + c * (soglia - 1) + ', ' + c + ' × ' + soglia + ' = ' + c * soglia + '.', 'Il primo valore che supera ' + fisso + ' si ha con ' + soglia + ' parole.'],
        svolgimento: ['Costo del DMA: ' + fisso + ' cicli.', c + ' × ' + (soglia - 1) + ' = ' + c * (soglia - 1) + ': il DMA non fa ancora risparmiare.', c + ' × ' + soglia + ' = ' + c * soglia + ': conviene il DMA.'] }; }
      const n = soglia + r.int(1, 30), pio = c * n, v = cosa === 1 ? pio - fisso : fisso, giuste = CI(v);
      if (cosa === 2) return { u: '4.7.1', d: testa + 'Per un trasferimento di ' + n + ' parole, quanti cicli costa al processore il DMA?', segnaposto: 'Un numero', giuste,
        ok: 'Il costo del DMA è fisso: ' + s + ' + ' + f + ' = ' + fisso + ' cicli, qualunque sia la lunghezza.',
        diagnosi: DIAG(giuste, [
          { se: CI(pio), msg: 'Questo è il costo dell’I/O programmato. Con il DMA le parole le sposta il dispositivo.' },
          { se: CI(fisso + pio), msg: 'Con il DMA il processore paga soltanto preparazione e completamento.' },
          { se: CI(s), msg: 'Vanno aggiunti i ' + f + ' cicli del completamento.' }
        ]),
        altro: 'Il numero è diverso. Il processore prepara la richiesta e ne controlla l’esito, e nient’altro.',
        indizi: ['Il numero di parole non conta.', 'Preparazione: ' + s + ' cicli. Completamento: ' + f + ' cicli.', s + ' + ' + f + ' = ' + fisso + '.'],
        svolgimento: ['Preparazione: ' + s + ' cicli.', 'Completamento: ' + f + ' cicli.', 'Costo del DMA: ' + fisso + ' cicli.'] };
      return { u: '4.7.1', d: testa + 'Per un trasferimento di ' + n + ' parole, quanti cicli fa risparmiare il DMA al processore?', segnaposto: 'Un numero', giuste,
        ok: 'I/O programmato: ' + c + ' × ' + n + ' = ' + pio + ' cicli. DMA: ' + fisso + ' cicli. Differenza: ' + v + '.',
        diagnosi: DIAG(giuste, [
          { se: CI(fisso), msg: 'Questo è il costo del DMA. Il risparmio è la differenza con i ' + pio + ' cicli dell’I/O programmato.' },
          { se: CI(pio), msg: 'Questo è il costo dell’I/O programmato. Va sottratto il costo del DMA.' },
          { se: CI(pio - s), msg: 'Al DMA vanno addebitati anche i ' + f + ' cicli del completamento.' }
        ]),
        altro: 'Il numero è diverso. Calcola i due costi e sottrai.',
        indizi: ['I/O programmato: ' + c + ' × ' + n + ' = ' + pio + '.', 'DMA: ' + s + ' + ' + f + ' = ' + fisso + '.', pio + ' − ' + fisso + ' = ' + v + '.'],
        svolgimento: ['I/O programmato: ' + pio + ' cicli.', 'DMA: ' + fisso + ' cicli.', 'Risparmio: ' + v + ' cicli.'] };
    },
    // 4.7.2 · transazioni, ultimo byte, inizio dell'ultima transazione
    (r) => {
      const base = r.scegli([0x4000, 0x6000, 0x8000, 0xA000]), w = r.scegli([8, 16, 32]), n = r.int(w + 1, 120), k = Math.ceil(n / w), inizio = base + (k - 1) * w, fine = base + n - 1, cosa = r.int(0, 2);
      const testa = 'Un descrittore indica un buffer che comincia all’indirizzo ' + H(base) + ' ed è lungo ' + n + ' byte. Ogni transazione porta al massimo ' + w + ' byte. ';
      if (cosa === 0) { const giuste = I(k); return { u: '4.7.2', d: testa + 'Quante transazioni emette il dispositivo?', segnaposto: 'Un numero', giuste,
        ok: n % w === 0 ? n + ' ÷ ' + w + ' = ' + k + ', senza resto.' : Math.floor(n / w) + ' transazioni piene coprono ' + Math.floor(n / w) * w + ' byte, e i ' + (n % w) + ' rimasti ne richiedono un’altra.',
        diagnosi: DIAG(giuste, [
          n % w !== 0 ? { se: I(k - 1), msg: (k - 1) + ' transazioni coprono ' + (k - 1) * w + ' byte. Ne restano ' + (n % w) + ', che vanno trasferiti.' } : null,
          { se: I(k + 1), msg: 'Dopo le transazioni piene, i byte rimasti stanno in una sola transazione.' }
        ]),
        altro: 'Il numero è diverso. Dividi ' + n + ' per ' + w + ' e arrotonda per eccesso.',
        indizi: [w + ' × ' + Math.floor(n / w) + ' = ' + Math.floor(n / w) * w + '.', n % w === 0 ? 'Non avanza alcun byte.' : 'Restano ' + (n % w) + ' byte.', 'Transazioni: ' + k + '.'],
        svolgimento: ['Transazioni piene: ' + Math.floor(n / w) + ', per ' + Math.floor(n / w) * w + ' byte.', 'Byte rimasti: ' + (n % w) + '.', 'Transazioni: ' + k + '.'] }; }
      if (cosa === 1) { const giuste = EH(fine); return { u: '4.7.2', d: testa + 'Qual è l’indirizzo dell’ultimo byte del buffer? Rispondi in esadecimale.', segnaposto: 'Un indirizzo', giuste,
        ok: n + ' − 1 = ' + (n - 1) + ', che si scrive ' + H(n - 1) + '. ' + H(base) + ' + ' + H(n - 1) + ' = ' + H(fine) + '.',
        diagnosi: DIAG(giuste, [
          { se: EH(base + n), msg: H(base + n) + ' è il primo indirizzo dopo la fine del buffer. Va sottratto 1.' },
          { se: EH(inizio), msg: H(inizio) + ' è l’indirizzo da cui parte l’ultima transazione.' },
          { se: [String(base.toString(16).slice(0, 2)) + String(n - 1).padStart(2, '0'), '0x' + base.toString(16).slice(0, 2) + String(n - 1).padStart(2, '0')], msg: 'Lo scostamento ' + (n - 1) + ' è in base dieci. In esadecimale si scrive ' + H(n - 1) + '.' }
        ]),
        altro: 'L’indirizzo è un altro. Somma all’inizio la lunghezza meno 1, scritta in esadecimale.',
        indizi: ['Lo scostamento dell’ultimo byte è ' + (n - 1) + '.', (n - 1) + ' = ' + Math.floor((n - 1) / 16) + ' × 16 + ' + ((n - 1) % 16) + ', cioè ' + H(n - 1) + '.', H(base) + ' + ' + H(n - 1) + ' = ' + H(fine) + '.'],
        svolgimento: ['Scostamento: ' + n + ' − 1 = ' + (n - 1) + '.', (n - 1) + ' = ' + H(n - 1) + '.', 'Ultimo byte: ' + H(fine) + '.'] }; }
      const giuste = EH(inizio);
      return { u: '4.7.2', d: testa + 'Da quale indirizzo parte l’ultima transazione? Rispondi in esadecimale.', segnaposto: 'Un indirizzo', giuste,
        ok: 'Le transazioni sono ' + k + '. L’ultima parte ' + (k - 1) + ' × ' + w + ' = ' + (k - 1) * w + ' byte dopo l’inizio: ' + H(base) + ' + ' + H((k - 1) * w) + ' = ' + H(inizio) + '.',
        diagnosi: DIAG(giuste, [
          { se: EH(fine), msg: H(fine) + ' è l’ultimo byte del buffer. L’ultima transazione comincia prima.' },
          { se: EH(base + k * w), msg: 'Le transazioni che precedono l’ultima sono ' + (k - 1) + ', e coprono ' + (k - 1) * w + ' byte.' },
          { se: EH(base), msg: 'Questo è l’inizio del buffer, da cui parte la prima transazione.' }
        ]),
        altro: 'L’indirizzo è un altro. Conta i byte coperti dalle transazioni precedenti e sommali all’inizio.',
        indizi: ['Transazioni in tutto: ' + k + '.', 'Byte coperti dalle prime ' + (k - 1) + ': ' + (k - 1) * w + ', cioè ' + H((k - 1) * w) + '.', H(base) + ' + ' + H((k - 1) * w) + ' = ' + H(inizio) + '.'],
        svolgimento: ['Transazioni: ' + k + '.', 'Byte prima dell’ultima: ' + (k - 1) * w + ' = ' + H((k - 1) * w) + '.', 'Inizio dell’ultima: ' + H(inizio) + '.'] };
    },
    // 4.7.3 · slot liberi, richieste in attesa, slot ancora del dispositivo
    (r) => {
      const cap = r.scegli([4, 8, 16]), rich = r.int(2, cap + 8), fin = r.int(0, 10), pub = Math.min(cap, rich), rit = Math.min(pub, fin), cosa = r.int(0, 2);
      const testa = 'Un anello di descrittori ha ' + cap + ' slot, tutti liberi. Il driver deve pubblicare ' + rich + ' richieste, e in seguito il dispositivo ne completa ' + rit + ', che il driver recupera. ';
      const v = cosa === 0 ? cap - pub + rit : cosa === 1 ? rich - pub : pub - rit, giuste = I(v);
      const D = ['Quanti slot sono liberi dopo il recupero?', 'Quante richieste sono rimaste in attesa di uno slot?', 'Quanti slot appartengono ancora al dispositivo dopo il recupero?'][cosa];
      return { u: '4.7.3', d: testa + D, segnaposto: 'Un numero', giuste,
        ok: 'Pubblicate: ' + pub + '. ' + (cosa === 0 ? 'Liberi: ' + cap + ' − ' + pub + ' + ' + rit + ' = ' + v + '.' : cosa === 1 ? 'In attesa: ' + rich + ' − ' + pub + ' = ' + v + '.' : 'Ancora del dispositivo: ' + pub + ' − ' + rit + ' = ' + v + '.'),
        diagnosi: DIAG(giuste, cosa === 0 ? [
          { se: I(cap - pub), msg: 'Questi erano liberi dopo la pubblicazione. Vanno aggiunti i ' + rit + ' slot recuperati.' },
          { se: I(rit), msg: 'Questi sono gli slot recuperati. Vanno aggiunti quelli mai usati.' },
          rich > cap ? { se: I(cap - rich + rit), msg: 'Le richieste pubblicate sono al massimo ' + cap + ', quanti sono gli slot.' } : null
        ] : cosa === 1 ? [
          { se: I(pub), msg: 'Queste sono le richieste pubblicate. In attesa restano le altre.' },
          { se: I(rich), msg: 'Le prime ' + pub + ' trovano subito uno slot.' },
          { se: I(Math.max(0, rich - pub - rit)), msg: 'Il modello si ferma prima di ripubblicare: gli slot recuperati non sono ancora stati riusati.' }
        ] : [
          { se: I(pub), msg: 'Questi erano gli slot ceduti. ' + rit + ' sono tornati al driver con il recupero.' },
          { se: I(rit), msg: 'Questi sono gli slot recuperati dal driver. Al dispositivo restano gli altri.' },
          { se: I(Math.max(0, rich - rit)), msg: 'Al dispositivo appartengono soltanto gli slot pubblicati, che sono ' + pub + '.' }
        ]),
        altro: 'Il numero è diverso. Calcola prima quante richieste vengono pubblicate: il minore fra slot e richieste.',
        indizi: ['Pubblicate: il minore fra ' + cap + ' e ' + rich + ', cioè ' + pub + '.', cosa === 0 ? 'Liberi dopo la pubblicazione: ' + (cap - pub) + '. Recuperati: ' + rit + '.' : cosa === 1 ? 'Le richieste sono ' + rich + '.' : 'Recuperati dal driver: ' + rit + '.', cosa === 0 ? (cap - pub) + ' + ' + rit + ' = ' + v + '.' : cosa === 1 ? rich + ' − ' + pub + ' = ' + v + '.' : pub + ' − ' + rit + ' = ' + v + '.'],
        svolgimento: ['Pubblicate: ' + pub + '.', 'In attesa: ' + (rich - pub) + '.', 'Recuperate: ' + rit + '.', 'Ancora del dispositivo: ' + (pub - rit) + '. Liberi: ' + (cap - pub + rit) + '.'] };
    },
    // 4.7.4 · che cosa riceve il dispositivo, oppure l'indirizzo per il descrittore
    (r) => {
      const B = r.mescola([0x2000, 0x3000, 0x5000, 0x7000, 0x9000, 0xB000, 0xC000, 0xE000]), cpu = B[0], ram = B[1], dma = B[2], off = 4 * r.int(1, 63);
      const testa = 'La pagina di un buffer è vista dal programma all’indirizzo ' + H(cpu) + ', si trova nella RAM alla posizione ' + H(ram) + ' e ha indirizzo DMA ' + H(dma) + '. ';
      if (r.int(0, 1) === 0) { const giuste = EH(dma + off); return { u: '4.7.4', d: testa + 'Quale indirizzo va scritto nel descrittore per il byte di scostamento ' + H(off) + '? Rispondi in esadecimale.', segnaposto: 'Un indirizzo', giuste,
        ok: 'Al dispositivo va l’indirizzo DMA: ' + H(dma) + ' + ' + H(off) + ' = ' + H(dma + off) + '.',
        diagnosi: DIAG(giuste, [
          { se: EH(cpu + off), msg: 'Questo è l’indirizzo usato dal programma. La IOMMU non lo concede al dispositivo.' },
          { se: EH(ram + off), msg: 'Questa è la posizione nella RAM. Il dispositivo deve presentare l’indirizzo DMA, che la IOMMU traduce.' },
          { se: EH(dma), msg: 'Questo è l’inizio della pagina. Va aggiunto lo scostamento ' + H(off) + '.' }
        ]),
        altro: 'L’indirizzo è un altro. Parti dall’indirizzo DMA della pagina e aggiungi lo scostamento.',
        indizi: ['Il dispositivo usa l’indirizzo DMA.', 'La pagina ha indirizzo DMA ' + H(dma) + '.', H(dma) + ' + ' + H(off) + ' = ' + H(dma + off) + '.'],
        svolgimento: ['Numerazione giusta: indirizzo DMA.', 'Base: ' + H(dma) + '.', 'Indirizzo: ' + H(dma + off) + '.'] }; }
      const vecchio = r.int(10, 99), nuovo = vecchio + r.int(1, 99), op = r.scegli(['ok', 'cache', 'ptr']);
      const fb = op === 'ok' ? 'La RAM è aggiornata e l’indirizzo è quello DMA: le due condizioni sono rispettate.' : op === 'cache' ? 'Il ' + nuovo + ' è rimasto nella cache del processore. Il dispositivo legge la RAM, che contiene ancora ' + vecchio + '.' : 'L’indirizzo del programma non è fra quelli che la IOMMU concede al dispositivo.';
      return { u: '4.7.4', d: testa + 'Il processore cambia un byte del buffer da ' + vecchio + ' a ' + nuovo + '. Il driver ' + (op === 'ok' ? 'sincronizza il buffer e scrive nel descrittore un indirizzo che comincia da ' + H(dma) : op === 'cache' ? 'scrive nel descrittore un indirizzo che comincia da ' + H(dma) + ', senza sincronizzare il buffer' : 'sincronizza il buffer e scrive nel descrittore un indirizzo che comincia da ' + H(cpu)) + '. Che cosa riceve il dispositivo?', guida: 'Scegli la risposta.', o: r.mescola([
        { t: 'Il valore nuovo, ' + nuovo, ok: op === 'ok', fb },
        { t: 'Il valore vecchio, ' + vecchio, ok: op === 'cache', fb },
        { t: 'Nulla: l’accesso viene respinto', ok: op === 'ptr', fb }]) };
    },
    // 4.7.5 · istante della ripresa, intervallo, istante in cui il processo è pronto
    (r) => {
      const t = r.int(20, 90), b = r.int(0, 15), g = r.int(2, 5), s = r.int(0, 30), irq = t + b, pronto = irq + g, ripresa = pronto + s, cosa = r.int(0, 2);
      const testa = 'L’ultimo byte di un trasferimento DMA arriva nella memoria all’istante ' + t + ' µs. L’interrupt di completamento parte ' + (b === 0 ? 'subito' : 'dopo ' + b + ' µs') + ', il gestore impiega ' + g + ' µs a risvegliare il processo, e lo scheduler lo fa attendere ' + s + ' µs. ';
      const v = cosa === 0 ? ripresa : cosa === 1 ? b + g + s : pronto, giuste = US(v);
      const D = ['A quale istante riprende il processo, in microsecondi?', 'Quanti microsecondi passano fra l’ultimo byte e la ripresa del processo?', 'A quale istante il processo diventa pronto, in microsecondi?'][cosa];
      return { u: '4.7.5', d: testa + D, segnaposto: 'Un numero', giuste,
        ok: cosa === 0 ? t + ' + ' + b + ' + ' + g + ' + ' + s + ' = ' + v + ' µs.' : cosa === 1 ? b + ' + ' + g + ' + ' + s + ' = ' + v + ' µs.' : t + ' + ' + b + ' + ' + g + ' = ' + v + ' µs.',
        diagnosi: DIAG(giuste, cosa === 0 ? [
          { se: US(b + g + s), msg: 'Questo è l’intervallo dopo l’ultimo byte. L’istante si conta dall’inizio: va sommato ' + t + '.' },
          { se: US(ripresa - g), msg: 'Mancano i ' + g + ' µs del gestore.' },
          { se: US(pronto), msg: 'A ' + pronto + ' µs il processo è pronto. Poi attende ' + s + ' µs il proprio turno.' }
        ] : cosa === 1 ? [
          { se: US(ripresa), msg: 'Questo è l’istante della ripresa. L’intervallo si conta dall’ultimo byte, a ' + t + ' µs.' },
          { se: US(b + s), msg: 'Mancano i ' + g + ' µs del gestore.' },
          { se: US(s), msg: 'Questa è la sola attesa dello scheduler. Prima ci sono notifica e gestore.' }
        ] : [
          { se: US(ripresa), msg: 'Questo è l’istante della ripresa. Il processo è pronto prima, quando il gestore lo risveglia.' },
          { se: US(irq), msg: 'A ' + irq + ' µs parte l’interrupt. Il gestore impiega altri ' + g + ' µs.' },
          { se: US(b + g), msg: 'Questo è il tempo trascorso dall’ultimo byte. L’istante si conta dall’inizio: va sommato ' + t + '.' }
        ]),
        altro: 'Il valore è diverso. Metti in fila gli istanti: ultimo byte, interrupt, processo pronto, ripresa.',
        indizi: ['Interrupt: ' + t + ' + ' + b + ' = ' + irq + ' µs.', 'Processo pronto: ' + irq + ' + ' + g + ' = ' + pronto + ' µs.', 'Ripresa: ' + pronto + ' + ' + s + ' = ' + ripresa + ' µs.'],
        svolgimento: ['Interrupt: ' + irq + ' µs.', 'Processo pronto: ' + pronto + ' µs.', 'Ripresa: ' + ripresa + ' µs.', 'Dall’ultimo byte alla ripresa: ' + (b + g + s) + ' µs.'] };
    }
  ] });
})();
