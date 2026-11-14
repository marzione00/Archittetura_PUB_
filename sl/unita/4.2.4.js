'use strict';
SL.unita424 = (() => {
  // fase: 0 la chiamata · 1 l'esame della pipe · 2 l'attesa · 3 l'arrivo del byte · 4 l'assegnazione del processore · 5 il confronto
  const quadro = (pre, p, f, o) => {
    const el = SL.el, bl = p.modo === 'blocco', t = p.t, T = o.T || 14, u = o.w / T, els = [];
    for (let k = 0; k <= T; k += 2) els.push(el.nota(pre + 'k' + k, o.x + k * u - 4, o.y, String(k), 'mono minuta'));
    const seg = (id, da, a, txt, st) => els.push(el.cella(pre + id, o.x + da * u, o.y + 22, (a - da) * u - 3, o.hc, txt, st, { piccola: true, cls: 'minuta' }));
    if (bl) {
      if (f >= 1) seg('s1', 0, f >= 3 ? t : Math.min(t, 2), 'sospeso', f <= 2 ? 'att' : 'zero');
      if (f >= 3) seg('s2', t, t + 1, 'pronto', f === 3 ? 'att' : 'on');
      if (f >= 4) seg('s3', t + 1, T, 'in esecuzione', f === 4 ? 'att' : 'on');
    } else if (f >= 1) seg('s1', 0, f >= 3 ? T : 2, 'in esecuzione', f <= 2 ? 'att' : 'on');
    if (f >= 3) els.push(el.nota(pre + 'ev', o.x + t * u - 4, o.y + 22 + o.hc + 6, '↑ byte a ' + t + ' ms', 'mono minuta', 'att'));
    if (o.conti) {
      const y2 = o.y + 22 + o.hc + 40, w = (o.w - 3 * o.gap) / 4;
      const stato = f === 0 ? 'chiama read' : bl ? (f <= 2 ? 'sospeso' : f === 3 ? 'pronto' : 'in esecuzione') : 'in esecuzione';
      const nellaPipe = f < 3 ? 0 : bl ? (f >= 4 ? 0 : 1) : 1;
      els.push(el.box(pre + 'q1', o.x, y2, w, o.h, 'processo lettore', stato, f >= 1 && f <= 3 && bl ? 'att' : 'on', { cls: 'stretta' }),
        el.box(pre + 'q2', o.x + w + o.gap, y2, w, o.h, 'byte nella pipe', String(nellaPipe), f === 3 ? 'att' : 'on', { cls: 'stretta' }),
        el.box(pre + 'q3', o.x + 2 * (w + o.gap), y2, w, o.h, 'valore restituito', bl ? (f >= 4 ? 'RAX = 1' : 'RAX = ·') : (f >= 1 ? 'RAX = −11' : 'RAX = ·'), (bl ? f === 4 : f === 1) ? 'att' : (bl ? f > 4 : f > 1) ? 'on' : '', { cls: 'stretta' }),
        el.box(pre + 'q4', o.x + 3 * (w + o.gap), y2, w, o.h, 'fine della chiamata', bl ? (f >= 4 ? (t + 1) + ' ms' : '·') : (f >= 1 ? '0 ms' : '·'), (bl ? f >= 4 : f >= 1) ? 'att' : '', { cls: 'stretta' }));
    }
    return els;
  };
  return { quadro };
})();
SL.registra('4.2.4', {
  titolo: 'Quando una chiamata di sistema si blocca',
  obiettivo: 'Obiettivo: indicare l’istante in cui termina una read su una pipe vuota, nel modo bloccante e nel modo non bloccante, e la sorte del byte che giunge in seguito.',
  concetti: [['coda', 'L’attesa all’interno della chiamata'], ['clock', 'Tre momenti distinti'], ['scudo', 'Il ritorno immediato con un errore']],
  filigrana: ['clock', 'coda', 'scudo'],
  richiami: {
    carte: [
      { sim: 'bus', da: 'Dall’unità 4.2.2', t: 'La pipe', d: 'I byte scritti a una estremità si leggono dall’altra, nel medesimo ordine.' },
      { sim: 'scudo', da: 'Dall’unità 4.2.2', t: 'Il valore restituito', d: 'Un valore positivo è un conteggio di byte, mentre un valore negativo è un errore.' },
      { sim: 'interrupt', da: 'Dall’unità 4.1.1', t: 'Il timer', d: 'A intervalli regolari il kernel riprende il controllo, e può affidare il processore a un altro programma.' }
    ],
    domanda: { d: 'Prima di proseguire: un programma chiama read su una pipe che contiene già 3 byte, chiedendone 1. Che cosa accade?', o: [
      { t: 'La read restituisce immediatamente 1', ok: true, fb: 'Il byte è presente, e il kernel lo consegna senza attese.' },
      { t: 'La read attende che la pipe si riempia', fb: 'Per una lettura è sufficiente la presenza di almeno un byte.' },
      { t: 'La read restituisce 3', fb: 'Il programma ha richiesto un solo byte, e gli altri due restano nella pipe.' }
    ] }
  },
  idea: {
    titolo: 'Il comportamento in assenza del dato',
    termini: ['chiamata bloccante', 'scheduler', 'o_nonblock', 'eagain'],
    testo: [
      'Una read su una pipe che contiene byte termina immediatamente. Su una pipe vuota il comportamento è diverso. Se all’altra estremità è ancora presente un programma in grado di scrivere, un byte potrebbe giungere dopo un istante oppure dopo un’ora. Il kernel è privo del dato da consegnare, e deve stabilire la sorte del lettore.',
      'Il comportamento ordinario è l’attesa. La read diviene una [[chiamata bloccante]]: il kernel sospende il processo che l’ha eseguita, e affida il processore ad altri processi. Il processo sospeso non consuma tempo di calcolo. Quando un byte giunge nella pipe, il kernel contrassegna il processo come pronto a riprendere.',
      'Lo stato di pronto è distinto dall’esecuzione. La scelta del processo che riceve il processore, e dell’istante in cui lo riceve, spetta allo [[scheduler]], la parte del kernel che distribuisce il tempo di calcolo. Fra l’arrivo del byte e la ripresa del lettore trascorre pertanto un intervallo, breve se il processore è libero, più lungo se altri processi sono in attesa. Soltanto alla ripresa la read consegna il byte e restituisce 1.',
      { fig: 'scena', w: 720, h: 96, titolo: 'Una read bloccante, con il byte a 5 ms e il processore a 6 ms', nota: 'Il processo è sospeso fino a 5 ms, pronto fino a 6 ms, poi di nuovo in esecuzione.', els: SL.unita424.quadro('g', { modo: 'blocco', t: 5 }, 5, { x: 16, y: 4, w: 690, hc: 30, T: 12 }) },
      'Un programma con altre operazioni da svolgere può richiedere al kernel di evitare la sospensione, aprendo la pipe con l’opzione [[o_nonblock|O_NONBLOCK]]. In tal caso una read su una pipe vuota ritorna immediatamente con −11, il codice dell’errore [[eagain|EAGAIN]], il cui significato è «ripetere più tardi». Il valore ha la forma di un errore, e tuttavia segnala soltanto che in quel momento la pipe è priva di dati da leggere.',
      'Il byte che giunge in seguito resta nella pipe, in attesa della read successiva. Il programma deve tuttavia ripetere la richiesta, poiché nessun avviso gli è recapitato.'
    ]
  },
  esperimento: {
    faremo: [
      'All’istante 0 un processo chiama read su una pipe vuota, richiedendo un byte. Lo scrittore è ancora attivo, e consegnerà un byte in seguito. I controlli fissano il modo della lettura e l’istante di arrivo del byte.',
      'L’esperimento segue sull’asse del tempo lo stato del lettore. Nel modo bloccante lo scheduler gli assegna il processore un millisecondo dopo il risveglio. Dopo il caso proposto, è istruttivo selezionare il modo non bloccante.'
    ],
    vedrai: [
      ['clock', 'L’asse del tempo', 'In alto: i millisecondi, e lo stato del lettore in ogni intervallo.'],
      ['bus', 'La pipe', 'In basso: il numero di byte contenuti.'],
      ['register', 'L’esito', 'In basso a destra: il valore restituito e l’istante in cui la chiamata termina.']
    ]
  },
  lab: {
    titolo: 'Una read su una pipe vuota',
    scena: { w: 860, h: 190 },
    atti: ['La chiamata', 'L’attesa', 'L’arrivo del byte', 'Il confronto'],
    controlli: [
      { id: 'modo', tipo: 'scelta', eti: 'Modo della lettura', opzioni: [['blocco', 'bloccante'], ['subito', 'non bloccante (O_NONBLOCK)']], valore: 'blocco' },
      { id: 't', tipo: 'scelta', eti: 'Arrivo del byte', opzioni: [[3, 'a 3 ms'], [5, 'a 5 ms'], [9, 'a 9 ms']], valore: 5 }
    ],
    nota: 'I passi sono sempre sei. Nel modo bloccante il lettore riceve il processore 1 ms dopo essere tornato pronto.',
    previsione: {
      domanda: (p) => 'All’istante 0 un processo chiama read su una pipe vuota, nel modo ' + (p.modo === 'blocco' ? 'bloccante' : 'non bloccante') + '. Un byte giungerà nella pipe a ' + p.t + ' ms. A quale istante la read restituisce il controllo al programma?',
      opzioni: (p) => [[0, 'A 0 ms'], [p.t, 'A ' + p.t + ' ms'], [p.t + 1, 'A ' + (p.t + 1) + ' ms']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' ms. La read termina a ' + esito + ' ms. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.modo === 'subito' ? 'Nel modo non bloccante la read ritorna immediatamente con EAGAIN, senza attendere il byte.' : pred === p.t ? 'All’arrivo del byte il lettore torna pronto. Per riprendere deve ancora ricevere il processore dallo scheduler.' : 'Nel modo bloccante il lettore resta sospeso finché la pipe è vuota.'),
    costruisci(p) {
      const U = SL.unita424, passi = [], bl = p.modo === 'blocco', t = p.t, fine = bl ? t + 1 : 0;
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'TEMPO IN MILLISECONDI · STATO DEL LETTORE', 'mono')].concat(U.quadro('q', p, f, { x: 24, y: 22, w: 812, hc: 32, conti: true, h: 58, gap: 14 }));
      const hud = (f) => [['Modo', bl ? 'bloccante' : 'non bloccante', 'a'], ['Tempo', (f <= 1 ? 0 : f === 2 ? Math.min(2, t) : f === 3 ? t : f === 4 ? t + 1 : 14) + ' ms'], ['Fine della read', (bl ? f >= 4 : f >= 1) ? fine + ' ms' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La chiamata', 'All’istante 0 il processo lettore chiama read sulla pipe, richiedendo un byte. La pipe è vuota. All’altra estremità uno scrittore è ancora attivo, e dopo ' + t + ' ms consegnerà un byte.',
        { chiedi: { d: 'La pipe è vuota, e tuttavia lo scrittore è ancora attivo. Il kernel può segnalare al lettore che i dati sono terminati?', o: ['Sì, la pipe è vuota', 'No, un byte può ancora giungere'], g: 1, no: 'Finché una estremità di scrittura è aperta, altri byte possono giungere. I dati sono terminati soltanto quando tutti gli scrittori hanno chiuso la propria estremità.' } });
      P(1, 0, 'L’esame della pipe', bl ? 'Il kernel rileva la pipe vuota e uno scrittore attivo. Nel modo bloccante sospende il lettore e lo iscrive fra i processi in attesa su questa pipe. La read resta in corso.' : 'Il kernel rileva la pipe vuota. Nel modo non bloccante nessun processo è sospeso, e la read ritorna immediatamente con RAX = −11, l’errore EAGAIN. Il programma riprende a 0 ms.', { calc: bl ? 'lettore sospeso' : 'RAX = −11 · fine a 0 ms', esito: bl ? undefined : ['fine a 0 ms', 'si'] });
      P(2, 1, 'Intanto', bl ? 'Il lettore è sospeso e non consuma tempo di calcolo. Lo scheduler affida il processore ad altri processi.' : 'Il programma può svolgere altre operazioni, come l’aggiornamento dello schermo o il servizio di un altro canale. Per ottenere il byte dovrà chiamare di nuovo read in seguito.', { calc: bl ? 'processore ad altri processi' : 'il programma prosegue' });
      P(3, 2, 'L’arrivo del byte', 'A ' + t + ' ms lo scrittore consegna un byte, che entra nella pipe. ' + (bl ? 'Il kernel rimuove il lettore dall’elenco di attesa e lo contrassegna come pronto. In questo istante il processore è occupato da un altro processo, e il lettore deve attendere il proprio turno.' : 'Nessuna read è in corso. Il byte resta nella pipe, e il programma è privo di qualsiasi avviso.'), { calc: bl ? t + ' ms: lettore pronto' : t + ' ms: 1 byte nella pipe' });
      P(4, 2, bl ? 'Il processore torna al lettore' : 'Il byte in attesa', bl ? 'A ' + (t + 1) + ' ms lo scheduler assegna il processore al lettore. La read riprende, preleva il byte dalla pipe, lo copia nel buffer e restituisce RAX = 1. La chiamata è durata ' + (t + 1) + ' ms.' : 'Il byte è ancora nella pipe. La read successiva, nel momento in cui il programma la eseguirà, lo troverà immediatamente e restituirà 1.', { calc: bl ? 'RAX = 1 · fine a ' + (t + 1) + ' ms' : 'byte nella pipe: 1', esito: ['fine a ' + fine + ' ms', 'si'] });
      P(5, 3, 'I due modi a confronto', bl ? 'Nel modo bloccante la read è durata ' + (t + 1) + ' ms e ha consegnato il byte. Arrivo del byte, risveglio e assegnazione del processore sono stati tre momenti distinti. Nel modo non bloccante la chiamata sarebbe terminata a 0 ms con EAGAIN, e il byte sarebbe rimasto nella pipe.' : 'Nel modo non bloccante la read è terminata a 0 ms senza dati, e il programma ha proseguito senza attese. Nel modo bloccante sarebbe terminata a ' + (t + 1) + ' ms, con il byte già consegnato e senza necessità di ripetere la chiamata.', { calc: 'con attesa ' + (t + 1) + ' ms · senza attesa 0 ms', esito: ['fine a ' + fine + ' ms', 'si'] });
      return { passi, esito: fine };
    }
  },
  bilancio: {
    regola: [
      'Una read bloccante su una pipe vuota sospende il processo finché giunge un byte. All’arrivo il processo torna pronto, e la chiamata termina quando lo scheduler gli assegna il processore.',
      'Con O_NONBLOCK la medesima read ritorna immediatamente con −11, l’errore EAGAIN. Il byte che giunge in seguito resta nella pipe, per una lettura successiva.'
    ],
    errori: [
      ['Far terminare la read all’arrivo del byte.', 'All’arrivo il lettore diviene pronto, e per proseguire deve ricevere il processore.'],
      ['Trattare EAGAIN come un guasto.', 'Il codice segnala soltanto che in quel momento il dato è assente. La medesima chiamata, in seguito, può riuscire.'],
      ['Ritenere perduto il byte giunto dopo EAGAIN.', 'Il byte resta nella pipe finché una read lo preleva.']
    ],
    saFare: ['Distinguere una chiamata bloccante da una non bloccante.', 'Separare l’arrivo del dato, il risveglio e l’assegnazione del processore.', 'Interpretare il valore −11.'],
    esercizi: [
      { d: 'Un processo chiama read, nel modo bloccante, su una pipe vuota. Un byte giunge dopo 8 ms, e lo scheduler assegna il processore al lettore 2 ms dopo il risveglio. Dopo quanti millisecondi termina la read?', segnaposto: 'Un numero', giuste: ['10', 'dieci', '10ms'],
        ok: 'Il byte giunge a 8 ms, il processore a 8 + 2 = 10 ms.',
        diagnosi: [
          { se: ['8', 'otto', '8ms'], msg: 'A 8 ms il lettore torna pronto. Per terminare la read deve ricevere il processore.' },
          { se: ['2', 'due', '2ms'], msg: 'I 2 ms si contano dal risveglio, che avviene a 8 ms.' },
          { se: ['0', 'zero', '0ms'], msg: 'Nel modo bloccante la read attende il byte.' }
        ],
        altro: 'Il numero è diverso. Si sommino l’istante di arrivo del byte e l’attesa per il processore.',
        indizi: ['Il lettore torna pronto a 8 ms.', 'Riceve il processore 2 ms dopo.', '8 + 2.'],
        svolgimento: ['Arrivo del byte e risveglio: 8 ms.', 'Attesa del processore: 2 ms.', 'Fine della read: 10 ms.'] },
      { d: 'Il medesimo processo impiega invece O_NONBLOCK. Quale valore trova in RAX, e in quale istante?', guida: 'Si scelga la risposta.', o: [
        { t: '−11, immediatamente', ok: true, fb: 'La pipe è vuota, e la read ritorna all’istante 0 con EAGAIN.' },
        { t: '1, dopo 8 ms', fb: 'Questo è, in prima approssimazione, il comportamento del modo bloccante. Con O_NONBLOCK la read non attende.' },
        { t: '0, immediatamente', fb: 'Uno zero indicherebbe che i dati sono terminati. In questo caso lo scrittore è ancora attivo, e il kernel risponde con EAGAIN.' }] },
      { d: 'Dopo tale read non bloccante, il byte giunge nella pipe a 8 ms. Dove si trova a 20 ms, se il programma non ha più chiamato read?', guida: 'Si scelga la risposta.', o: [
        { t: 'Nella pipe', ok: true, fb: 'La pipe conserva i byte finché una read li preleva.' },
        { t: 'Nel buffer del programma', fb: 'Nel buffer i byte giungono soltanto durante una read.' },
        { t: 'È andato perduto', fb: 'Un byte scritto in una pipe resta disponibile al lettore.' }] }
    ]
  }
});
