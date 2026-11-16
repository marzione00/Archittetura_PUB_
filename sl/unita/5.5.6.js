'use strict';
SL.unita556 = (() => {
  const SEQ = { ww: [['A', 'down'], ['B', 'down'], ['P', 'up'], ['Q', 'up']], ws: [['A', 'down'], ['P', 'up'], ['B', 'down'], ['Q', 'up']] };
  const esegui = (p) => { let n = p.s; const coda = [], S = [{ n, coda: [], op: null, nota: '' }]; SEQ[p.ord].forEach((e) => { let nota; if (e[1] === 'down') { if (n > 0) { n--; nota = 'prende'; } else { coda.push(e[0]); nota = 'blocca'; } } else if (coda.length) { nota = 'passa:' + coda.shift(); } else { n++; nota = 'libera'; } S.push({ n, coda: coda.slice(), op: e, nota }); }); return S; };
  const finale = (p) => { const S = esegui(p); return S[S.length - 1].n; };
  const scena = (pre, s, o) => {
    const el = SL.el, w3 = (o.w - 20) / 3;
    return [el.box(pre + 'n', o.x, o.y, w3, o.h, 'valore del semaforo', String(s.n), s.nota === 'prende' || s.nota === 'libera' ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'c', o.x + w3 + 10, o.y, w3, o.h, 'coda dei bloccati', s.coda.length ? s.coda.join(', ') : 'vuota', s.nota === 'blocca' || s.nota.startsWith('passa') ? 'att' : s.coda.length ? 'zero' : 'on', { cls: 'stretta' }),
      el.box(pre + 'o', o.x + 2 * (w3 + 10), o.y, w3, o.h, 'operazione', s.op ? s.op[0] + ' · ' + s.op[1] : '·', s.op ? 'att' : '', { cls: 'stretta' })];
  };
  const striscia = (pre, p, cur, o) => { const el = SL.el, w4 = (o.w - 30) / 4; return SEQ[p.ord].map((e, j) => el.box(pre + j, o.x + j * (w4 + 10), o.y, w4, o.h, (j + 1) + 'ª operazione', e[0] + ' · ' + e[1], j + 1 === cur ? 'att' : j + 1 < cur ? 'on' : '', { cls: 'stretta' })); };
  return { SEQ, esegui, finale, scena, striscia };
})();
SL.registra('5.5.6', {
  titolo: 'Il valore del semaforo e l’ordine degli eventi',
  obiettivo: 'Obiettivo: seguire lo stato di un semaforo attraverso una sequenza di operazioni down e up, con l’osservazione congiunta del valore del semaforo e della coda dei thread bloccati.',
  concetti: [['semaforo', 'Un intero condiviso, con una coda'], ['coda', 'Con il valore a zero il thread attende in coda'], ['thread', 'Una up può risvegliare un thread']],
  filigrana: ['semaforo', 'coda', 'thread'],
  richiami: {
    carte: [
      { sim: 'lucchetto', da: 'Dall’unità 5.5.5', t: 'Il lock', d: 'Un diritto esclusivo: un proprietario per volta, il solo a poterlo rilasciare.' },
      { sim: 'coda', da: 'Dall’unità 5.1.4', t: 'La coda di attesa', d: 'L’elenco dei thread in attesa del medesimo evento.' },
      { sim: 'coda', da: 'Dall’unità 4.5.3', t: 'L’ordine di arrivo', d: 'Il servizio secondo l’ordine di arrivo delle richieste.' }
    ],
    domanda: { d: 'Prima di proseguire: una risorsa ammette 3 thread per volta, e 3 thread vi sono entrati. Giunge un quarto thread. Quale comportamento è corretto?', o: [
      { t: 'Attende che un accesso si liberi', ok: true, fb: 'Gli accessi sono esauriti, e il quarto thread si pone in attesa.' },
      { t: 'Accede comunque', fb: 'Gli accessi sono 3, e sono tutti occupati.' },
      { t: 'Impone l’uscita del primo thread', fb: 'Un thread interno esce al termine del proprio lavoro. Il nuovo thread attende.' }
    ] }
  },
  idea: {
    titolo: 'Un semaforo con valore maggiore di uno',
    termini: ['semaforo', 'down e up'],
    testo: [
      'Un mutex ammette un thread per volta. Molte risorse ne ammettono tuttavia più d’uno: tre stampanti, dieci connessioni, cinque posizioni in un buffer. Lo strumento adatto è il [[semaforo]]: una variabile intera condivisa, accompagnata da una coda di thread in attesa. Il valore del semaforo indica quante unità della risorsa sono disponibili in un dato momento.',
      'Le operazioni sono due, e formano la coppia [[down e up]], indicata anche come P e V, oppure wait e signal. Con down un thread richiede un’unità della risorsa. Se il valore è maggiore di zero lo decrementa, e il thread prosegue. Se è zero, il thread è bloccato e posto in coda. Con up un thread restituisce un’unità, oppure segnala un evento: a differenza del mutex, la up può essere eseguita da un thread diverso da quello che aveva eseguito down. Il sistema garantisce l’atomicità di entrambe le operazioni.',
      { fig: 'scena', w: 720, h: 62, titolo: 'Valore iniziale 1: A ha eseguito down, e B si è bloccato', nota: 'Il valore del semaforo è 0, e B è in coda. La prossima up risveglierà B.', els: SL.unita556.scena('g', SL.unita556.esegui({ s: 1, ord: 'ww' })[2], { x: 10, y: 4, w: 700, h: 54 }) },
      'L’aspetto critico è l’effetto di una up in presenza di thread in attesa. Il primo thread in coda è risvegliato e prosegue, come se la propria down fosse appena riuscita, e il valore resta a zero, poiché l’unità restituita ha già un destinatario. Soltanto se la coda è vuota la up incrementa il valore.',
      'Si consideri un caso, con valore iniziale 1. A esegue down, e il valore scende da 1 a 0. B esegue down, trova 0, e si blocca in coda. P esegue up: la coda contiene B, che è risvegliato e torna pronto, mentre il valore resta 0. Q esegue up con la coda vuota, e il valore sale a 1. La lettura di un semaforo richiede sempre entrambi i dati, valore e coda: un valore nullo con la coda vuota e un valore nullo con tre thread in coda sono stati diversi.'
    ]
  },
  esperimento: {
    faremo: [
      'Due thread, A e B, eseguono una down ciascuno, e altri due, P e Q, eseguono una up ciascuno. I controlli fissano il valore iniziale del semaforo e l’ordine delle quattro operazioni.',
      'Dopo ogni operazione l’esperimento mostra il valore e la coda. Vanno osservate in particolare le up: soltanto alcune incrementano il valore.'
    ],
    vedrai: [
      ['semaforo', 'Il semaforo', 'In alto: il valore del semaforo e la coda dei thread bloccati, insieme all’operazione appena eseguita.'],
      ['coda', 'La sequenza', 'In basso: le quattro operazioni nell’ordine selezionato. Quella appena eseguita è evidenziata.']
    ]
  },
  lab: {
    titolo: 'Quattro operazioni su un semaforo',
    scena: { w: 860, h: 136 },
    atti: ['L’inizio', 'Le operazioni', 'La fine'],
    controlli: [
      { id: 's', tipo: 'scelta', eti: 'Valore iniziale', opzioni: [[0, '0'], [1, '1'], [2, '2']], valore: 1 },
      { id: 'ord', tipo: 'scelta', eti: 'Ordine', opzioni: [['ww', 'A down, B down, P up, Q up'], ['ws', 'A down, P up, B down, Q up']], valore: 'ww' }
    ],
    nota: 'I passi sono sempre sei. La coda serve i thread nell’ordine in cui si sono bloccati.',
    previsione: {
      domanda: (p) => 'Un semaforo ha valore ' + p.s + ' e la coda vuota. Le operazioni avvengono nell’ordine: ' + (p.ord === 'ww' ? 'A down, B down, P up, Q up' : 'A down, P up, B down, Q up') + '. Quale valore ha il semaforo al termine?',
      opzioni: () => [0, 1, 2].map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Al termine il semaforo vale ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Due down e due up si compensano: il semaforo torna al valore iniziale, ' + p.s + '. Una up che risveglia un thread in coda non modifica il valore.'),
    costruisci(p) {
      const U = SL.unita556, S = U.esegui(p), passi = [], fin = S[4].n;
      const P = (k, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Valore', String(S[k].n), 'a'], ['In coda', S[k].coda.length ? S[k].coda.join(', ') : 'nessuno'], ['Operazione', S[k].op ? S[k].op[0] + ' ' + S[k].op[1] : '·', 'c']], els: U.scena('q', S[k], { x: 20, y: 6, w: 820, h: 56 }).concat(U.striscia('t', p, atto === 2 ? 5 : k, { x: 20, y: 74, w: 820, h: 56 })) }, extra));
      const D = (s, prec) => { const chi = s.op[0]; return s.nota === 'prende' ? chi + ' esegue down. Il valore è ' + prec.n + ', maggiore di zero: scende a ' + s.n + ', e ' + chi + ' prosegue.' : s.nota === 'blocca' ? chi + ' esegue down. Il valore è 0: ' + chi + ' è bloccato e posto in coda.' : s.nota === 'libera' ? chi + ' esegue up. La coda è vuota, e il valore sale da ' + prec.n + ' a ' + s.n + '.' : chi + ' esegue up. In coda è presente ' + s.nota.slice(6) + ', che è risvegliato e torna pronto. Il valore resta ' + s.n + '.'; };

      P(0, 0, 'Lo stato iniziale del semaforo', 'Il semaforo ha valore ' + p.s + (p.s === 0 ? ': nessuna unità della risorsa è disponibile.' : '.') + ' La coda dei bloccati è vuota.', {});
      let chiesto = false;
      for (let k = 1; k <= 4; k++) { const s = S[k], extra = { calc: s.op[0] + ' ' + s.op[1] + ' · valore ' + s.n };
        if (!chiesto && s.op[1] === 'up') { chiesto = true; extra.chiedi = { d: 'Dopo questa up, il valore del semaforo è salito?', o: ['Sì', 'No, un thread in coda è stato risvegliato'], g: s.nota === 'libera' ? 0 : 1, no: s.nota === 'libera' ? 'La coda era vuota, e la up ha incrementato il valore.' : 'In coda era presente un thread, che è stato risvegliato.' }; }
        P(k, 1, s.op[0] + ' · ' + s.op[1], D(s, S[k - 1]), extra); }
      P(4, 2, 'Lo stato finale', 'Al termine il semaforo vale ' + fin + ' e la coda è vuota. Due down e due up si compensano: il semaforo è tornato al valore iniziale. A e B hanno entrambi proseguito, immediatamente oppure dopo un’attesa.', { esito: ['valore ' + fin, ''] });
      return { passi, esito: fin };
    }
  },
  bilancio: {
    regola: [
      'down: se il valore è maggiore di zero lo decrementa, altrimenti blocca il thread e lo pone in coda.',
      'up: se la coda contiene un thread, lo risveglia senza modificare il valore. Se la coda è vuota, incrementa il valore.'
    ],
    errori: [
      ['Incrementare il valore a ogni up.', 'Se un thread è in coda, la up lo risveglia e il valore resta invariato.'],
      ['Leggere soltanto il valore.', 'Uno zero con la coda vuota e uno zero con thread in attesa sono stati diversi.'],
      ['Trattare il semaforo come un mutex.', 'Un semaforo è privo di proprietario: la up può provenire da un thread che non ha mai eseguito down.']
    ],
    saFare: ['Aggiornare valore e coda dopo una down.', 'Aggiornare valore e coda dopo una up.', 'Distinguere una up che incrementa il valore da una up che risveglia un thread.'],
    esercizi: [
      { d: 'Un semaforo ha valore 2 e la coda vuota. Cinque thread eseguono down, in successione. Quanti restano bloccati in coda?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'I primi due trovano il valore maggiore di zero e proseguono, gli altri tre si bloccano.',
        diagnosi: [
          { se: ['5', 'cinque'], msg: 'I primi due trovano il valore maggiore di zero e proseguono.' },
          { se: ['2', 'due'], msg: 'Due sono i thread che proseguono. Gli altri si bloccano.' }
        ],
        altro: 'Il numero è diverso. Si sottragga dal numero dei thread il valore iniziale.',
        indizi: ['Il valore iniziale è 2.', 'I thread sono 5.', '5 − 2 = 3.'],
        svolgimento: ['Proseguono: 2.', 'Si bloccano: 3.'] },
      { d: 'Nella medesima situazione, con 3 thread in coda e il valore a 0, un altro thread esegue una up. Quanto vale il semaforo immediatamente dopo?', segnaposto: 'Un numero', giuste: ['0', 'zero'],
        ok: 'La up risveglia il primo thread in coda, e il valore resta 0.',
        diagnosi: [
          { se: ['1', 'uno'], msg: 'Il valore sale soltanto se la coda è vuota. In questo caso la up risveglia il primo thread in attesa.' },
          { se: ['2', 'due'], msg: 'Due è il numero dei thread residui in coda dopo la up.' }
        ],
        altro: 'Il valore è diverso. Si verifichi se la coda contiene thread.',
        indizi: ['La coda non è vuota.', 'La up risveglia il primo thread in coda.', 'Il valore resta 0.'],
        svolgimento: ['Coda prima: 3 thread.', 'La up risveglia il primo.', 'Valore: 0. Coda: 2 thread.'] },
      { d: 'In che cosa un semaforo differisce da un mutex?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il valore può superare 1, e la up può provenire da un thread diverso', ok: true, fb: 'Il mutex ammette un solo thread e ha un proprietario, il solo a poterlo rilasciare.' },
        { t: 'Non blocca mai i thread', fb: 'Una down con il valore a zero blocca il thread.' },
        { t: 'È utilizzabile soltanto su più core', fb: 'Semafori e mutex funzionano con qualunque numero di core.' }] }
    ],
    sfida: ['cslez5_5_03_semaphores', 'Stato del semaforo durante wait e signal']
  }
});
