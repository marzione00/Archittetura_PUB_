'use strict';
/* Prova del capitolo 5.3: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const MS = (v) => I(v).concat([v + 'ms', v + 'millisecondi']);
  // round-robin con costo di cambio fra processi diversi
  const rr = (lav, q, s) => { const coda = lav.map((x) => x.slice()), t = []; let ora = 0, prec = null, cambi = 0; const prima = {}, fine = {}; while (coda.length) { const j = coda.shift(); if (prec && prec !== j[0]) { cambi++; ora += s; } if (prima[j[0]] == null) prima[j[0]] = ora; const d = Math.min(q, j[1]); t.push(j[0] + ' ' + ora + '→' + (ora + d)); ora += d; prec = j[0]; if (j[1] - d > 0) coda.push([j[0], j[1] - d]); else fine[j[0]] = ora; } return { ora, cambi, prima, fine, t }; };

  SL.registraProva('5.3', { domande: [
    // 5.3.1 · attesa dopo il risveglio, oppure istante di inizio
    (r) => {
      const t = r.int(2, 14), fine = t + r.int(2, 9), prel = r.int(0, 2) === 0, ini = prel ? t : fine, cosa = r.int(0, 1), v = cosa === 0 ? ini - t : ini, giuste = MS(v);
      return { u: '5.3.1', d: 'Un processo bloccato attende un dato dal disco, che giunge all’istante ' + t + ' ms. In quel momento un altro processo è in esecuzione, e il suo turno scade a ' + fine + ' ms. ' + (prel ? 'La politica assegna la precedenza al processo risvegliato e ammette la prelazione, con cambio istantaneo. ' : 'La politica consente la conclusione del turno in corso, e quindi assegna il processore al processo risvegliato. ') + (cosa === 0 ? 'Quanti millisecondi attende fra i pronti il processo risvegliato?' : 'A quale istante inizia l’esecuzione del processo risvegliato, in millisecondi?'), segnaposto: 'Un numero', giuste,
        ok: prel ? 'Con la prelazione il processo esegue dall’istante del risveglio, ' + t + ' ms: l’attesa è nulla.' : 'Il processo è pronto da ' + t + ' ms e inizia l’esecuzione a ' + fine + ' ms: attende ' + (fine - t) + ' ms.',
        diagnosi: DIAG(giuste, [
          { se: MS(cosa === 0 ? ini : ini - t), msg: cosa === 0 ? 'Questo è l’istante in cui inizia l’esecuzione. L’attesa si conta dal risveglio.' : 'Questa è la durata dell’attesa. La domanda richiede l’istante di inizio.' },
          { se: MS(cosa === 0 ? (prel ? fine - t : 0) : (prel ? fine : t)), msg: prel ? 'La politica ammette la prelazione: il turno in corso è interrotto.' : 'Senza prelazione il turno in corso è portato a termine.' },
          cosa === 0 ? { se: MS(t), msg: 'Questo è l’istante del risveglio. In precedenza il processo era bloccato, cioè in attesa del disco.' } : null
        ]),
        altro: 'Il valore è diverso. Si stabilisca l’istante in cui il processo riceve il processore, e lo si confronti con l’istante del risveglio.',
        indizi: ['Il processo è pronto da ' + t + ' ms.', prel ? 'Con la prelazione riceve immediatamente il processore.' : 'Riceve il processore alla scadenza del turno, a ' + fine + ' ms.', cosa === 0 ? ini + ' − ' + t + ' = ' + v + '.' : 'Ha inizio a ' + ini + ' ms.'],
        svolgimento: ['Pronto da: ' + t + ' ms.', 'In esecuzione da: ' + ini + ' ms.', 'Attesa: ' + (ini - t) + ' ms.'] };
    },
    // 5.3.2 · somma delle attese, oppure attesa di un processo
    (r) => {
      const B = r.mescola([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), N = ['P', 'Q', 'R'], sjf = r.int(0, 1) === 1, L = N.map((n, k) => [n, B[k]]), ord = sjf ? L.slice().sort((a, b) => a[1] - b[1]) : L, att = {}; let t = 0; ord.forEach((x) => { att[x[0]] = t; t += x[1]; });
      const somma = N.reduce((s, n) => s + att[n], 0), altro = (() => { const o2 = sjf ? L : L.slice().sort((a, b) => a[1] - b[1]); let t2 = 0, s2 = 0; o2.forEach((x) => { s2 += t2; t2 += x[1]; }); return s2; })();
      const testa = 'Tre processi sono pronti insieme, nell’ordine di arrivo P, Q, R, con burst di ' + B[0] + ', ' + B[1] + ' e ' + B[2] + ' ms. La politica è ' + (sjf ? 'SJF' : 'FCFS') + '. ';
      if (r.int(0, 2) === 0) { const chi = r.scegli(N), v = att[chi], giuste = MS(v); return { u: '5.3.2', d: testa + 'Quanti millisecondi attende ' + chi + ' prima di iniziare l’esecuzione?', segnaposto: 'Un numero', giuste,
        ok: 'L’ordine di servizio è ' + ord.map((x) => x[0]).join(', ') + '. ' + chi + ' è preceduto da processi per complessivi ' + v + ' ms.',
        diagnosi: DIAG(giuste, [
          { se: MS(v + B[N.indexOf(chi)]), msg: 'Questo è l’istante in cui ' + chi + ' termina. L’attesa si conclude all’inizio dell’esecuzione.' },
          { se: MS((() => { const o2 = sjf ? L : L.slice().sort((a, b) => a[1] - b[1]); let t2 = 0, w = 0; o2.forEach((x) => { if (x[0] === chi) w = t2; t2 += x[1]; }); return w; })()), msg: sjf ? 'Questa sarebbe l’attesa con FCFS. SJF serve prima i burst più brevi.' : 'Questa sarebbe l’attesa con SJF. FCFS segue l’ordine di arrivo.' }
        ]),
        altro: 'Il valore è diverso. Si scriva l’ordine di servizio e si sommino i burst dei processi che precedono ' + chi + '.',
        indizi: ['Ordine di servizio: ' + ord.map((x) => x[0]).join(', ') + '.', 'Burst nel medesimo ordine: ' + ord.map((x) => x[1]).join(', ') + '.', chi + ' ha inizio a ' + v + ' ms.'],
        svolgimento: ord.map((x) => x[0] + ': attesa ' + att[x[0]] + ' ms.') }; }
      const giuste = MS(somma);
      return { u: '5.3.2', d: testa + 'Quanto vale la somma delle tre attese, in millisecondi?', segnaposto: 'Un numero', giuste,
        ok: 'L’ordine è ' + ord.map((x) => x[0]).join(', ') + ', e le attese sono ' + ord.map((x) => att[x[0]]).join(', ') + ': complessivamente ' + somma + ' ms.',
        diagnosi: DIAG(giuste, [
          { se: MS(altro), msg: sjf ? 'Questa è la somma con FCFS. SJF serve prima i burst più brevi.' : 'Questa è la somma con SJF. FCFS segue l’ordine di arrivo P, Q, R.' },
          { se: MS(B[0] + B[1] + B[2]), msg: 'Questa è la somma dei burst. Le attese sono gli istanti di inizio dei tre processi.' },
          { se: MS(somma + B[0] + B[1] + B[2]), msg: 'Sono stati sommati gli istanti di fine. L’attesa termina all’inizio del processo.' }
        ]),
        altro: 'Il valore è diverso. Per ogni processo si sommino i burst dei processi che lo precedono, e quindi le tre attese.',
        indizi: ['Ordine di servizio: ' + ord.map((x) => x[0]).join(', ') + '.', 'Inizi: ' + ord.map((x) => att[x[0]]).join(', ') + '.', ord.map((x) => att[x[0]]).join(' + ') + ' = ' + somma + '.'],
        svolgimento: ord.map((x) => x[0] + ': attesa ' + att[x[0]] + ' ms.').concat(['Somma: ' + somma + ' ms.']) };
    },
    // 5.3.3 · round-robin: fine di tutto, primo turno del secondo, cambi di contesto
    (r) => {
      const q = r.int(2, 4), s = r.int(0, 2), tre = r.int(0, 1) === 1, lav = (tre ? [['X', r.int(2, 6)], ['Y', r.int(1, 5)], ['Z', r.int(1, 4)]] : [['X', r.int(3, 8)], ['Y', r.int(2, 6)]]), T = rr(lav, q, s), cosa = r.int(0, 2);
      const v = cosa === 0 ? T.ora : cosa === 1 ? T.prima.Y : T.cambi, giuste = cosa === 2 ? I(v) : MS(v);
      return { u: '5.3.3', d: (tre ? 'Tre processi, X, Y e Z,' : 'Due processi, X e Y,') + ' sono pronti insieme in quest’ordine, con burst di ' + lav.map((x) => x[1]).join(tre ? ', ' : ' e ').replace(/, (\d+)$/, ' e $1') + ' ms. La politica è round-robin con time slice di ' + q + ' ms, e ogni cambio fra processi diversi ' + (s === 0 ? 'è istantaneo' : 'costa ' + s + ' ms') + '. ' + ['A quale istante termina l’ultimo processo, in millisecondi?', 'A quale istante Y riceve il suo primo turno, in millisecondi?', 'Quanti cambi di contesto fra processi diversi si verificano complessivamente?'][cosa], segnaposto: 'Un numero', giuste,
        ok: 'I turni sono: ' + T.t.join(', ') + '. I cambi sono ' + T.cambi + ', e l’ultimo processo termina a ' + T.ora + ' ms.',
        diagnosi: DIAG(giuste, cosa === 0 ? [
          { se: MS(lav.reduce((a, x) => a + x[1], 0)), msg: 'Questo è il solo lavoro utile. Vanno aggiunti i ' + T.cambi + ' cambi di contesto.' },
          { se: MS(T.ora + s), msg: 'L’ultimo turno non è seguito da alcun cambio.' }
        ] : cosa === 1 ? [
          { se: MS(Math.min(q, lav[0][1])), msg: 'Al primo turno di X segue il cambio di contesto.' },
          { se: MS(lav[0][1] + s), msg: 'X è interrotto alla scadenza del time slice, anche se non ha terminato.' }
        ] : [
          { se: I(T.t.length), msg: 'Questi sono i turni. I cambi si collocano fra un turno e il successivo, quando il processo è diverso.' },
          { se: I(T.t.length - 1), msg: 'Quando resta un solo processo, i suoi turni si susseguono senza cambio.' }
        ]),
        altro: 'Il valore è diverso. Si traccino i turni in successione, con un cambio ogni volta che il processo è diverso dal precedente.',
        indizi: ['Primo turno: ' + T.t[0] + '.', 'Turni: ' + T.t.join(', ') + '.', 'Cambi: ' + T.cambi + '. Fine: ' + T.ora + ' ms.'],
        svolgimento: T.t.map((x) => x + ' ms.').concat(['Cambi di contesto: ' + T.cambi + '.', 'Fine: ' + T.ora + ' ms.']) };
    },
    // 5.3.4 · inversione ed ereditarietà, oppure invecchiamento
    (r) => {
      if (r.int(0, 2) === 0) { const s0 = r.int(1, 3), rivale = s0 + r.int(1, 3), d = r.int(2, 5), v = (rivale - s0 + 1) * d, giuste = MS(v); return { u: '5.3.4', d: 'Con l’invecchiamento, un processo in coda ha punteggio iniziale ' + s0 + ' e acquisisce 1 punto ogni ' + d + ' ms interi di attesa. È selezionato quando supera il punteggio ' + rivale + ' di un concorrente, che prevale in caso di parità. Dopo quanti millisecondi è selezionato?', segnaposto: 'Un numero', giuste,
        ok: 'Deve raggiungere ' + (rivale + 1) + ' punti: ne acquisisce ' + (rivale - s0 + 1) + ', in ' + (rivale - s0 + 1) + ' × ' + d + ' = ' + v + ' ms.',
        diagnosi: DIAG(giuste, [
          { se: MS((rivale - s0) * d), msg: 'In quell’istante il punteggio è ' + rivale + ', pari a quello del concorrente, che in caso di parità prevale.' },
          { se: MS(rivale - s0 + 1), msg: 'Questi sono i punti da acquisire. Ogni punto richiede ' + d + ' ms.' }
        ]),
        altro: 'Il valore è diverso. Si determini il punteggio da raggiungere e si moltiplichino i punti mancanti per ' + d + '.',
        indizi: ['Per superare ' + rivale + ' occorre il punteggio ' + (rivale + 1) + '.', 'Punti da acquisire: ' + (rivale + 1) + ' − ' + s0 + ' = ' + (rivale - s0 + 1) + '.', (rivale - s0 + 1) + ' × ' + d + ' = ' + v + '.'],
        svolgimento: ['Punteggio da raggiungere: ' + (rivale + 1) + '.', 'Punti mancanti: ' + (rivale - s0 + 1) + '.', 'Attesa: ' + v + ' ms.'] }; }
      const l = r.int(1, 5), M = r.int(0, 1) === 0 ? [r.int(2, 8)] : [r.int(2, 8), r.int(2, 8)], er = r.int(0, 1) === 1, sm = M.reduce((a, b) => a + b, 0), v = er ? l : sm + l, giuste = MS(v);
      return { u: '5.3.4', d: 'H, di priorità alta, è bloccato su un mutex posseduto da L, di priorità bassa, che ha ancora ' + l + ' ms di esecuzione prima del rilascio. ' + (M.length === 1 ? 'Diviene pronto un processo di priorità media, con ' + M[0] + ' ms di esecuzione. ' : 'Divengono pronti due processi di priorità media, con ' + M[0] + ' e ' + M[1] + ' ms di esecuzione. ') + 'Il sistema adotta ' + (er ? 'l’ereditarietà della priorità' : 'priorità fisse') + ', e i cambi sono istantanei. Dopo quanti millisecondi H ottiene il mutex?', segnaposto: 'Un numero', giuste,
        ok: er ? 'L eredita la priorità di H, precede i processi medi e rilascia il mutex dopo ' + l + ' ms.' : 'Prima eseguono i processi medi, ' + sm + ' ms, poi L per ' + l + ' ms: ' + v + ' ms.',
        diagnosi: DIAG(giuste, [
          { se: MS(er ? sm + l : l), msg: er ? 'Questo è l’esito con priorità fisse. Con l’ereditarietà L precede i processi medi.' : 'Questo valore sarebbe sufficiente con l’ereditarietà. Con priorità fisse i processi medi precedono L.' },
          { se: MS(sm), msg: 'Va contata l’esecuzione di L, necessaria per rilasciare il mutex.' }
        ]),
        altro: 'Il valore è diverso. Si stabilisca quali processi eseguono prima di L, e si sommino i tempi di esecuzione fino al rilascio.',
        indizi: [er ? 'L riceve la priorità di H.' : 'I processi medi hanno priorità maggiore di L.', er ? 'L esegue immediatamente, per ' + l + ' ms.' : 'Processi di priorità media: ' + sm + ' ms. Poi L: ' + l + ' ms.', 'Attesa di H: ' + v + ' ms.'],
        svolgimento: er ? ['L eredita la priorità alta.', 'L lavora ' + l + ' ms e rilascia.', 'Attesa di H: ' + v + ' ms.'] : ['Processi di priorità media: ' + sm + ' ms.', 'L: ' + l + ' ms.', 'Attesa di H: ' + v + ' ms.'] };
    },
    // 5.3.5 · fine del gruppo, tempo in ozio, trasferimenti per bilanciare
    (r) => {
      const b = r.int(1, 5), a = b + 2 * r.int(1, 4), cosa = r.int(0, 2), v = cosa === 0 ? a : cosa === 1 ? 2 * a - (a + b) : (a - b) / 2, giuste = cosa === 2 ? I(v) : MS(v);
      return { u: '5.3.5', d: 'Due core hanno ciascuno la propria coda. Il core 0 ha in coda ' + a + ' processi, il core 1 ne ha ' + b + ', tutti da 1 ms, e i due core hanno inizio insieme. ' + ['Senza alcun trasferimento, a quale istante termina l’ultimo processo, in millisecondi?', 'Senza alcun trasferimento, quanti millisecondi di calcolo restano inutilizzati fino alla fine del gruppo?', 'Quanti processi è opportuno trasferire dal core 0 al core 1 per terminare nel minor tempo?'][cosa], segnaposto: 'Un numero', giuste,
        ok: cosa === 0 ? 'È determinante la coda più lunga: ' + a + ' ms.' : cosa === 1 ? 'Il gruppo termina a ' + a + ' ms. I core offrivano ' + 2 * a + ' ms, e i processi ne hanno impiegati ' + (a + b) + '.' : 'I processi sono ' + (a + b) + ': code da ' + (a + b) / 2 + ' ciascuna, con il trasferimento di ' + v + '.',
        diagnosi: DIAG(giuste, cosa === 0 ? [
          { se: MS(a + b), msg: 'I due core operano contemporaneamente: le durate delle code non si sommano.' },
          { se: MS((a + b) / 2), msg: 'Questo sarebbe il risultato con code bilanciate. In questo caso nessun processo è trasferito.' }
        ] : cosa === 1 ? [
          { se: MS(a), msg: 'Questa è la durata del gruppo. Il tempo inutilizzato è 2 × ' + a + ' − ' + (a + b) + '.' },
          { se: MS(a + b), msg: 'Questo è il calcolo svolto. Il tempo inutilizzato è la parte residua dei ' + 2 * a + ' ms offerti.' }
        ] : [
          { se: I((a + b) / 2), msg: 'Questa è la lunghezza delle code bilanciate. I processi da trasferire sono ' + a + ' − ' + (a + b) / 2 + '.' },
          { se: I(a - b), msg: 'Con il trasferimento dell’intera differenza lo sbilanciamento si ripresenta sull’altra coda. È sufficiente la metà.' }
        ]),
        altro: 'Il valore è diverso. I core operano insieme, e il gruppo termina con la coda più lunga.',
        indizi: cosa === 2 ? ['I processi sono complessivamente ' + (a + b) + '.', 'Code uguali: ' + (a + b) / 2 + ' e ' + (a + b) / 2 + '.', a + ' − ' + (a + b) / 2 + ' = ' + v + '.'] : ['La coda più lunga dura ' + a + ' ms.', 'I due core offrono 2 × ' + a + ' = ' + 2 * a + ' ms.', cosa === 0 ? 'Il gruppo termina a ' + a + ' ms.' : 2 * a + ' − ' + (a + b) + ' = ' + v + '.'],
        svolgimento: cosa === 2 ? ['Totale: ' + (a + b) + ' processi.', 'Obiettivo: ' + (a + b) / 2 + ' per coda.', 'Trasferimenti: ' + v + '.'] : ['Durata: ' + a + ' ms.', 'Offerti: ' + 2 * a + ' ms.', 'Impiegati: ' + (a + b) + ' ms.', 'Inutilizzati: ' + (a - b) + ' ms.'] };
    }
  ] });
})();
