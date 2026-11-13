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
  obiettivo: 'Alla fine saprai dire quando termina una read su una pipe vuota, nel modo bloccante e nel modo non bloccante, e che fine fa il byte che arriva più tardi.',
  concetti: [['coda', 'Aspettare dentro la chiamata'], ['clock', 'Tre momenti distinti'], ['scudo', 'Tornare subito con un errore']],
  filigrana: ['clock', 'coda', 'scudo'],
  richiami: {
    carte: [
      { sim: 'bus', da: 'Dall’unità 4.2.2', t: 'La pipe', d: 'I byte scritti a una estremità si leggono dall’altra, nello stesso ordine.' },
      { sim: 'scudo', da: 'Dall’unità 4.2.2', t: 'Il valore restituito', d: 'Positivo: un conteggio di byte. Negativo: un errore.' },
      { sim: 'interrupt', da: 'Dall’unità 4.1.1', t: 'Il timer', d: 'A intervalli regolari il kernel riprende il controllo, e può affidare il processore a un altro programma.' }
    ],
    domanda: { d: 'Prima di proseguire: un programma chiama read su una pipe che contiene già 3 byte, chiedendone 1. Che cosa accade?', o: [
      { t: 'La read restituisce subito 1', ok: true, fb: 'Il byte c’è, e il kernel lo consegna senza attese.' },
      { t: 'La read attende che la pipe si riempia', fb: 'Per una lettura basta che ci sia almeno un byte.' },
      { t: 'La read restituisce 3', fb: 'Il programma ha chiesto un solo byte. Gli altri due restano nella pipe.' }
    ] }
  },
  idea: {
    titolo: 'Che cosa fare quando il dato manca',
    termini: ['chiamata bloccante', 'scheduler', 'o_nonblock', 'eagain'],
    testo: [
      'Una read su una pipe piena di byte termina subito. Su una pipe vuota le cose cambiano. Se dall’altra estremità c’è ancora un programma che può scrivere, un byte potrebbe arrivare fra un istante, oppure fra un’ora. Il kernel non può inventarlo, e deve decidere che cosa fare del lettore.',
      'Il comportamento normale è l’attesa. La read diventa una [[chiamata bloccante]]: il kernel sospende il processo che l’ha fatta, e affida il processore ad altri. Il processo sospeso non consuma tempo di calcolo. Quando un byte arriva nella pipe, il kernel lo segna come pronto a ripartire.',
      'Pronto non significa in esecuzione. A scegliere chi riceve il processore, e quando, è lo [[scheduler]], la parte del kernel che distribuisce il tempo di calcolo. Fra l’arrivo del byte e la ripresa del lettore passa quindi un intervallo, breve se il processore è libero, più lungo se altri sono in fila. Soltanto alla ripresa la read consegna il byte e restituisce 1.',
      { fig: 'scena', w: 720, h: 96, titolo: 'Una read bloccante: il byte arriva a 5 ms, il processore a 6 ms', nota: 'Il processo è sospeso fino a 5 ms, pronto fino a 6 ms, poi di nuovo in esecuzione.', els: SL.unita424.quadro('g', { modo: 'blocco', t: 5 }, 5, { x: 16, y: 4, w: 690, hc: 30, T: 12 }) },
      'Un programma che ha altro da fare può chiedere al kernel di non sospenderlo, aprendo la pipe con l’opzione [[o_nonblock|O_NONBLOCK]]. In quel caso una read su una pipe vuota torna subito con −11, il codice dell’errore [[eagain|EAGAIN]], che significa «riprova più tardi». È un errore soltanto di nome: segnala che in questo momento non c’è nulla da leggere.',
      'Il byte che arriva dopo non va perduto. Resta nella pipe, in attesa della prossima read. Il programma dovrà però tornare a chiedere, perché nessuno lo avviserà.'
    ]
  },
  esperimento: {
    faremo: [
      'All’istante 0 un processo chiama read su una pipe vuota, chiedendo un byte. Lo scrittore è ancora attivo, e consegnerà un byte più tardi. Sceglierai il modo della lettura e l’istante di arrivo del byte.',
      'Seguiremo sull’asse del tempo lo stato del lettore. Nel modo bloccante lo scheduler gli assegna il processore un millisecondo dopo il risveglio. Dopo il caso proposto, passa al modo non bloccante.'
    ],
    vedrai: [
      ['clock', 'L’asse del tempo', 'In alto: i millisecondi, e lo stato del lettore in ogni intervallo.'],
      ['bus', 'La pipe', 'In basso: quanti byte contiene.'],
      ['register', 'L’esito', 'In basso a destra: il valore restituito e l’istante in cui la chiamata finisce.']
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
      domanda: (p) => 'All’istante 0 un processo chiama read su una pipe vuota, nel modo ' + (p.modo === 'blocco' ? 'bloccante' : 'non bloccante') + '. Un byte arriverà nella pipe a ' + p.t + ' ms. A quale istante la read restituisce il controllo al programma?',
      opzioni: (p) => [[0, 'A 0 ms'], [p.t, 'A ' + p.t + ' ms'], [p.t + 1, 'A ' + (p.t + 1) + ' ms']]
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + pred + ' ms. La read termina a ' + esito + ' ms. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.modo === 'subito' ? 'Nel modo non bloccante la read torna subito con EAGAIN, senza attendere il byte.' : pred === p.t ? 'All’arrivo del byte il lettore torna pronto. Per ripartire deve ancora ricevere il processore dallo scheduler.' : 'Nel modo bloccante il lettore resta sospeso finché la pipe è vuota.'),
    costruisci(p) {
      const U = SL.unita424, passi = [], bl = p.modo === 'blocco', t = p.t, fine = bl ? t + 1 : 0;
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'TEMPO IN MILLISECONDI · STATO DEL LETTORE', 'mono')].concat(U.quadro('q', p, f, { x: 24, y: 22, w: 812, hc: 32, conti: true, h: 58, gap: 14 }));
      const hud = (f) => [['Modo', bl ? 'bloccante' : 'non bloccante', 'a'], ['Tempo', (f <= 1 ? 0 : f === 2 ? Math.min(2, t) : f === 3 ? t : f === 4 ? t + 1 : 14) + ' ms'], ['Fine della read', (bl ? f >= 4 : f >= 1) ? fine + ' ms' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La chiamata', 'All’istante 0 il processo lettore chiama read sulla pipe, chiedendo un byte. La pipe è vuota. Dall’altra estremità uno scrittore è ancora attivo, e fra ' + t + ' ms consegnerà un byte.',
        { chiedi: { d: 'La pipe è vuota, ma lo scrittore è ancora attivo. Il kernel può dire al lettore che i dati sono finiti?', o: ['Sì, la pipe è vuota', 'No, un byte può ancora arrivare'], g: 1, no: 'Finché una estremità di scrittura è aperta, altri byte possono arrivare. I dati sono finiti soltanto quando tutti gli scrittori hanno chiuso.' } });
      P(1, 0, 'L’esame della pipe', bl ? 'Il kernel trova la pipe vuota e uno scrittore attivo. Nel modo bloccante sospende il lettore e lo iscrive fra i processi che attendono questa pipe. La read non è ancora tornata.' : 'Il kernel trova la pipe vuota. Nel modo non bloccante nessuno viene sospeso, e la read torna subito con RAX = −11, l’errore EAGAIN. Il programma riprende a 0 ms.', { calc: bl ? 'lettore sospeso' : 'RAX = −11 · fine a 0 ms', esito: bl ? undefined : ['fine a 0 ms', 'si'] });
      P(2, 1, 'Intanto', bl ? 'Il lettore è sospeso e non consuma tempo di calcolo. Lo scheduler affida il processore ad altri processi.' : 'Il programma è libero di fare altro: aggiornare lo schermo, servire un altro canale. Per avere il byte dovrà chiamare di nuovo read, più tardi.', { calc: bl ? 'processore ad altri processi' : 'il programma prosegue' });
      P(3, 2, 'Arriva il byte', 'A ' + t + ' ms lo scrittore consegna un byte, che entra nella pipe. ' + (bl ? 'Il kernel toglie il lettore dall’elenco di attesa e lo segna come pronto. In questo istante il processore è occupato da un altro processo, e il lettore deve attendere il proprio turno.' : 'Nessuna read è in corso. Il byte resta nella pipe, e nessuno avvisa il programma.'), { calc: bl ? t + ' ms: lettore pronto' : t + ' ms: 1 byte nella pipe' });
      P(4, 2, bl ? 'Il processore torna al lettore' : 'Il byte attende', bl ? 'A ' + (t + 1) + ' ms lo scheduler assegna il processore al lettore. La read riprende, toglie il byte dalla pipe, lo copia nel buffer e restituisce RAX = 1. La chiamata è durata ' + (t + 1) + ' ms.' : 'Il byte è ancora nella pipe. La prossima read, quando il programma deciderà di farla, lo troverà subito e restituirà 1.', { calc: bl ? 'RAX = 1 · fine a ' + (t + 1) + ' ms' : 'byte nella pipe: 1', esito: ['fine a ' + fine + ' ms', 'si'] });
      P(5, 3, 'I due modi a confronto', bl ? 'Nel modo bloccante la read è durata ' + (t + 1) + ' ms e ha consegnato il byte. Arrivo del byte, risveglio e assegnazione del processore sono stati tre momenti distinti. Nel modo non bloccante la chiamata sarebbe finita a 0 ms con EAGAIN, e il byte sarebbe rimasto nella pipe.' : 'Nel modo non bloccante la read è finita a 0 ms senza dati, e il programma non ha perso tempo. Nel modo bloccante sarebbe finita a ' + (t + 1) + ' ms, con il byte già consegnato e senza bisogno di riprovare.', { calc: 'con attesa ' + (t + 1) + ' ms · senza attesa 0 ms', esito: ['fine a ' + fine + ' ms', 'si'] });
      return { passi, esito: fine };
    }
  },
  bilancio: {
    regola: [
      'Una read bloccante su una pipe vuota sospende il processo finché arriva un byte. All’arrivo il processo torna pronto, e la chiamata termina quando lo scheduler gli assegna il processore.',
      'Con O_NONBLOCK la stessa read torna subito con −11, l’errore EAGAIN. Il byte che arriva dopo resta nella pipe, per una lettura successiva.'
    ],
    errori: [
      ['Far terminare la read all’arrivo del byte.', 'All’arrivo il lettore diventa pronto. Per proseguire deve ricevere il processore.'],
      ['Trattare EAGAIN come un guasto.', 'Segnala soltanto che in questo momento manca il dato. La stessa chiamata, più tardi, può riuscire.'],
      ['Credere perduto il byte arrivato dopo EAGAIN.', 'Il byte resta nella pipe finché qualcuno lo legge.']
    ],
    saFare: ['Distinguo una chiamata bloccante da una non bloccante.', 'Separo l’arrivo del dato, il risveglio e l’assegnazione del processore.', 'Interpreto il valore −11.'],
    esercizi: [
      { d: 'Un processo chiama read, nel modo bloccante, su una pipe vuota. Un byte arriva dopo 8 ms, e lo scheduler assegna il processore al lettore 2 ms dopo il risveglio. Dopo quanti millisecondi termina la read?', segnaposto: 'Un numero', giuste: ['10', 'dieci', '10ms'],
        ok: 'Il byte arriva a 8 ms, il processore a 8 + 2 = 10 ms.',
        diagnosi: [
          { se: ['8', 'otto', '8ms'], msg: 'A 8 ms il lettore torna pronto. Per terminare la read deve ricevere il processore.' },
          { se: ['2', 'due', '2ms'], msg: 'I 2 ms si contano dal risveglio, che avviene a 8 ms.' },
          { se: ['0', 'zero', '0ms'], msg: 'Nel modo bloccante la read attende il byte.' }
        ],
        altro: 'Il numero è diverso. Somma l’istante di arrivo del byte e l’attesa per il processore.',
        indizi: ['Il lettore torna pronto a 8 ms.', 'Riceve il processore 2 ms dopo.', '8 + 2.'],
        svolgimento: ['Arrivo del byte e risveglio: 8 ms.', 'Attesa del processore: 2 ms.', 'Fine della read: 10 ms.'] },
      { d: 'Lo stesso processo usa invece O_NONBLOCK. Che cosa trova in RAX, e quando?', guida: 'Scegli la risposta.', o: [
        { t: '−11, subito', ok: true, fb: 'La pipe è vuota, e la read torna all’istante 0 con EAGAIN.' },
        { t: '1, dopo 8 ms', fb: 'Così si comporta, più o meno, il modo bloccante. Con O_NONBLOCK la read non attende.' },
        { t: '0, subito', fb: 'Uno zero significherebbe che i dati sono finiti. Qui lo scrittore è ancora attivo, e il kernel risponde con EAGAIN.' }] },
      { d: 'Dopo quella read non bloccante, il byte arriva nella pipe a 8 ms. Dove si trova a 20 ms, se il programma non ha più chiamato read?', guida: 'Scegli la risposta.', o: [
        { t: 'Nella pipe', ok: true, fb: 'La pipe conserva i byte finché una read li preleva.' },
        { t: 'Nel buffer del programma', fb: 'Nel buffer i byte arrivano soltanto durante una read.' },
        { t: 'È andato perduto', fb: 'Un byte scritto in una pipe resta disponibile al lettore.' }] }
    ]
  }
});
