'use strict';
SL.unita556 = (() => {
  const SEQ = { ww: [['A', 'wait'], ['B', 'wait'], ['P', 'signal'], ['Q', 'signal']], ws: [['A', 'wait'], ['P', 'signal'], ['B', 'wait'], ['Q', 'signal']] };
  const esegui = (p) => { let n = p.s; const coda = [], S = [{ n, coda: [], op: null, nota: '' }]; SEQ[p.ord].forEach((e) => { let nota; if (e[1] === 'wait') { if (n > 0) { n--; nota = 'prende'; } else { coda.push(e[0]); nota = 'blocca'; } } else if (coda.length) { nota = 'passa:' + coda.shift(); } else { n++; nota = 'libera'; } S.push({ n, coda: coda.slice(), op: e, nota }); }); return S; };
  const finale = (p) => { const S = esegui(p); return S[S.length - 1].n; };
  const scena = (pre, s, o) => {
    const el = SL.el, w3 = (o.w - 20) / 3;
    return [el.box(pre + 'n', o.x, o.y, w3, o.h, 'permessi liberi', String(s.n), s.nota === 'prende' || s.nota === 'libera' ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'c', o.x + w3 + 10, o.y, w3, o.h, 'coda dei bloccati', s.coda.length ? s.coda.join(', ') : 'vuota', s.nota === 'blocca' || s.nota.startsWith('passa') ? 'att' : s.coda.length ? 'zero' : 'on', { cls: 'stretta' }),
      el.box(pre + 'o', o.x + 2 * (w3 + 10), o.y, w3, o.h, 'operazione', s.op ? s.op[0] + ' · ' + s.op[1] : '·', s.op ? 'att' : '', { cls: 'stretta' })];
  };
  const striscia = (pre, p, cur, o) => { const el = SL.el, w4 = (o.w - 30) / 4; return SEQ[p.ord].map((e, j) => el.box(pre + j, o.x + j * (w4 + 10), o.y, w4, o.h, (j + 1) + 'ª operazione', e[0] + ' · ' + e[1], j + 1 === cur ? 'att' : j + 1 < cur ? 'on' : '', { cls: 'stretta' })); };
  return { SEQ, esegui, finale, scena, striscia };
})();
SL.registra('5.5.6', {
  titolo: 'Permessi dei semafori e ordine degli eventi',
  obiettivo: 'Obiettivo: seguire lo stato di un semaforo attraverso una sequenza di wait e signal, tenendo d’occhio insieme il contatore dei permessi e la coda dei thread bloccati.',
  concetti: [['semaforo', 'Un contatore di permessi'], ['coda', 'Chi non ne trova aspetta in coda'], ['thread', 'Un permesso può passare di mano']],
  filigrana: ['semaforo', 'coda', 'thread'],
  richiami: {
    carte: [
      { sim: 'lucchetto', da: 'Dall’unità 5.5.5', t: 'Il lock', d: 'Un diritto esclusivo: un proprietario per volta, e soltanto lui lo rilascia.' },
      { sim: 'coda', da: 'Dall’unità 5.1.4', t: 'La coda di attesa', d: 'L’elenco dei thread che aspettano lo stesso evento.' },
      { sim: 'coda', da: 'Dall’unità 4.5.3', t: 'L’ordine di arrivo', d: 'Servire per primo chi è arrivato per primo.' }
    ],
    domanda: { d: 'Prima di proseguire: un servizio ha 3 posti. Sono entrati 3 clienti. Arriva un quarto. Che cosa fa?', o: [
      { t: 'Aspetta che un posto si liberi', ok: true, fb: 'I posti sono finiti, e il quarto si mette in attesa.' },
      { t: 'Entra comunque', fb: 'I posti sono 3, e sono tutti occupati.' },
      { t: 'Fa uscire il primo cliente', fb: 'Chi è dentro esce quando ha finito. Il nuovo arrivato aspetta.' }
    ] }
  },
  idea: {
    titolo: 'Un mutex con più di un posto',
    termini: ['semaforo', 'wait e signal'],
    testo: [
      'Un mutex ammette un thread per volta. Molte risorse però ne ammettono più d’uno: tre stampanti, dieci connessioni, cinque posti in un buffer. Lo strumento adatto è il [[semaforo]]: un contatore di permessi, accompagnato da una coda di thread in attesa. Il contatore dice quanti permessi sono liberi in questo momento.',
      'Le operazioni sono due, e formano la coppia [[wait e signal]]. Con wait un thread chiede un permesso. Se il contatore è maggiore di zero lo decrementa, e il thread prosegue. Se è zero, il thread viene bloccato e messo in coda. Con signal un thread restituisce un permesso, oppure ne crea uno nuovo: a differenza del mutex, chi esegue signal può essere un thread diverso da quello che aveva eseguito wait.',
      { fig: 'scena', w: 720, h: 62, titolo: 'Un permesso iniziale: A lo ha preso, e B si è bloccato', nota: 'I permessi liberi sono 0, e B è in coda. La prossima signal consegnerà il permesso a B.', els: SL.unita556.scena('g', SL.unita556.esegui({ s: 1, ord: 'ww' })[2], { x: 10, y: 4, w: 700, h: 54 }) },
      'Il punto delicato è che cosa accade a una signal quando qualcuno aspetta. Il permesso salta il contatore e passa direttamente al primo thread in coda, che viene risvegliato. Il contatore resta a zero, perché quel permesso ha già un destinatario. Soltanto se la coda è vuota la signal fa salire il contatore.',
      'Seguiamo un caso, con un permesso iniziale. A esegue wait: il contatore scende da 1 a 0. B esegue wait: trova 0, e si blocca in coda. P esegue signal: la coda contiene B, che riceve il permesso e torna pronto, e il contatore resta 0. Q esegue signal: la coda è vuota, e il contatore sale a 1. Per leggere un semaforo servono sempre entrambi i dati, contatore e coda. Un contatore a zero con la coda vuota e un contatore a zero con tre thread in coda sono situazioni molto diverse.'
    ]
  },
  esperimento: {
    faremo: [
      'Due thread, A e B, eseguono una wait ciascuno. Altri due, P e Q, eseguono una signal ciascuno. Sceglierai quanti permessi ha il semaforo all’inizio, e in quale ordine avvengono le quattro operazioni.',
      'Dopo ogni operazione guarderemo il contatore e la coda. Fai attenzione alle signal: alcune fanno salire il contatore, altre no.'
    ],
    vedrai: [
      ['semaforo', 'Il semaforo', 'In alto: il contatore dei permessi liberi e la coda dei thread bloccati, insieme all’operazione appena eseguita.'],
      ['coda', 'La sequenza', 'In basso: le quattro operazioni nell’ordine scelto. Quella appena eseguita è accesa.']
    ]
  },
  lab: {
    titolo: 'Quattro operazioni su un semaforo',
    scena: { w: 860, h: 136 },
    atti: ['L’inizio', 'Le operazioni', 'La fine'],
    controlli: [
      { id: 's', tipo: 'scelta', eti: 'Permessi iniziali', opzioni: [[0, '0'], [1, '1'], [2, '2']], valore: 1 },
      { id: 'ord', tipo: 'scelta', eti: 'Ordine', opzioni: [['ww', 'A wait, B wait, P signal, Q signal'], ['ws', 'A wait, P signal, B wait, Q signal']], valore: 'ww' }
    ],
    nota: 'I passi sono sempre sei. La coda serve i thread nell’ordine in cui si sono bloccati.',
    previsione: {
      domanda: (p) => 'Un semaforo ha ' + (p.s === 1 ? '1 permesso libero' : p.s + ' permessi liberi') + ' e la coda vuota. Avvengono nell’ordine: ' + (p.ord === 'ww' ? 'A wait, B wait, P signal, Q signal' : 'A wait, P signal, B wait, Q signal') + '. Quanti permessi liberi ci sono alla fine?',
      opzioni: () => [0, 1, 2].map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Alla fine i permessi liberi sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Due wait e due signal si compensano: il semaforo torna al numero iniziale, ' + p.s + '. I permessi passati direttamente a un thread in coda non compaiono mai nel contatore.'),
    costruisci(p) {
      const U = SL.unita556, S = U.esegui(p), passi = [], fin = S[4].n;
      const P = (k, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Permessi liberi', String(S[k].n), 'a'], ['In coda', S[k].coda.length ? S[k].coda.join(', ') : 'nessuno'], ['Operazione', S[k].op ? S[k].op[0] + ' ' + S[k].op[1] : '·', 'c']], els: U.scena('q', S[k], { x: 20, y: 6, w: 820, h: 56 }).concat(U.striscia('t', p, atto === 2 ? 5 : k, { x: 20, y: 74, w: 820, h: 56 })) }, extra));
      const D = (s, prec) => { const chi = s.op[0]; return s.nota === 'prende' ? chi + ' chiede un permesso. Il contatore vale ' + prec.n + ', maggiore di zero: scende a ' + s.n + ', e ' + chi + ' prosegue.' : s.nota === 'blocca' ? chi + ' chiede un permesso. Il contatore vale 0: ' + chi + ' viene bloccato e messo in coda.' : s.nota === 'libera' ? chi + ' restituisce un permesso. La coda è vuota, e il contatore sale da ' + prec.n + ' a ' + s.n + '.' : chi + ' restituisce un permesso. In coda c’è ' + s.nota.slice(6) + ', che lo riceve direttamente e torna pronto. Il contatore resta a ' + s.n + '.'; };

      P(0, 0, 'Il semaforo all’inizio', 'Il semaforo ha ' + (p.s === 0 ? 'il contatore a 0: nessun permesso libero.' : p.s === 1 ? '1 permesso libero.' : p.s + ' permessi liberi.') + ' La coda dei bloccati è vuota.', {});
      let chiesto = false;
      for (let k = 1; k <= 4; k++) { const s = S[k], extra = { calc: s.op[0] + ' ' + s.op[1] + ' · permessi ' + s.n };
        if (!chiesto && s.op[1] === 'signal') { chiesto = true; extra.chiedi = { d: 'Dopo questa signal, il contatore dei permessi liberi è salito?', o: ['Sì', 'No: il permesso è andato a un thread in coda'], g: s.nota === 'libera' ? 0 : 1, no: s.nota === 'libera' ? 'La coda era vuota, e il permesso è rimasto libero.' : 'In coda c’era un thread, che ha ricevuto il permesso.' }; }
        P(k, 1, s.op[0] + ' · ' + s.op[1], D(s, S[k - 1]), extra); }
      P(4, 2, 'Lo stato finale', 'Alla fine i permessi liberi sono ' + fin + ' e la coda è vuota. Due wait hanno tolto due permessi e due signal ne hanno restituiti due: il semaforo è tornato al valore iniziale. A e B hanno entrambi ottenuto il proprio permesso, subito oppure dopo un’attesa.', { esito: [fin + (fin === 1 ? ' permesso libero' : ' permessi liberi'), ''] });
      return { passi, esito: fin };
    }
  },
  bilancio: {
    regola: [
      'wait: se il contatore è maggiore di zero lo decrementa, altrimenti blocca il thread in coda.',
      'signal: se la coda contiene qualcuno, gli consegna il permesso e lo risveglia, senza toccare il contatore. Se la coda è vuota, incrementa il contatore.'
    ],
    errori: [
      ['Incrementare il contatore a ogni signal.', 'Se un thread è in coda, il permesso va a lui e il contatore resta com’è.'],
      ['Leggere soltanto il contatore.', 'Uno zero con la coda vuota e uno zero con thread in attesa sono stati diversi.'],
      ['Trattare il semaforo come un mutex.', 'Un semaforo è privo di proprietario: la signal può venire da un thread che non ha mai fatto wait.']
    ],
    saFare: ['Aggiornare contatore e coda dopo una wait.', 'Aggiornare contatore e coda dopo una signal.', 'Distinguere un permesso libero da uno già assegnato.'],
    esercizi: [
      { d: 'Un semaforo ha 2 permessi liberi e la coda vuota. Cinque thread eseguono wait, uno dopo l’altro. Quanti restano bloccati in coda?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'I primi due prendono i permessi, gli altri tre si bloccano.',
        diagnosi: [
          { se: ['5', 'cinque'], msg: 'I primi due trovano un permesso libero e proseguono.' },
          { se: ['2', 'due'], msg: 'Due sono i thread che ottengono il permesso. Gli altri si bloccano.' }
        ],
        altro: 'Il numero è diverso. Si sottragga dai thread i permessi disponibili.',
        indizi: ['I permessi sono 2.', 'I thread sono 5.', '5 − 2 = 3.'],
        svolgimento: ['Proseguono: 2.', 'Si bloccano: 3.'] },
      { d: 'Nella stessa situazione, con 3 thread in coda e il contatore a 0, un altro thread esegue una signal. Quanto vale il contatore subito dopo?', segnaposto: 'Un numero', giuste: ['0', 'zero'],
        ok: 'Il permesso passa al primo thread in coda, e il contatore resta a 0.',
        diagnosi: [
          { se: ['1', 'uno'], msg: 'Il contatore sale soltanto se la coda è vuota. Qui il permesso va al primo thread in attesa.' },
          { se: ['2', 'due'], msg: 'Due è il numero dei thread rimasti in coda dopo la signal.' }
        ],
        altro: 'Il valore è diverso. Ci si chieda a chi va il permesso restituito.',
        indizi: ['La coda non è vuota.', 'Il permesso va al primo thread in coda.', 'Il contatore resta 0.'],
        svolgimento: ['Coda prima: 3 thread.', 'La signal risveglia il primo.', 'Contatore: 0. Coda: 2 thread.'] },
      { d: 'In che cosa un semaforo differisce da un mutex?', guida: 'Si scelga la risposta.', o: [
        { t: 'Ammette più permessi, e la signal può venire da un thread diverso', ok: true, fb: 'Il mutex ha un solo permesso e un proprietario, che è il solo a poterlo rilasciare.' },
        { t: 'Non blocca mai i thread', fb: 'Una wait con il contatore a zero blocca il thread.' },
        { t: 'Funziona soltanto su più core', fb: 'Semafori e mutex funzionano con qualunque numero di core.' }] }
    ],
    sfida: ['cslez5_5_03_semaphores', 'Stato del semaforo durante wait e signal']
  }
});
