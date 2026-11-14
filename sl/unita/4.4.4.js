'use strict';
SL.unita444 = (() => {
  const IDS = ['A', 'B', 'C'];
  const ordine = (p) => { const s = p.pol === 'rr' ? (IDS.indexOf(p.last) + 1) % 3 : 0; return IDS.slice(s).concat(IDS.slice(0, s)); };
  const attesa = (p) => 5 * ordine(p).indexOf(p.oss);
  // griglia dei turni: «turni» quanti turni sono già disegnati, «evid» il richiedente da evidenziare
  const griglia = (pre, p, turni, evid, o) => {
    const el = SL.el, ord = ordine(p), els = [];
    for (let t = 0; t < 3; t++) {
      const chi = ord[t], fatto = t < turni, x0 = o.x + t * 5 * (o.w + 2), forte = fatto && evid === chi;
      els.push(el.nota(pre + 'n' + t, x0, o.y - 22, fatto ? 'turno di ' + chi : '', 'mono', forte ? 'att' : ''));
      for (let k = 0; k < 5; k++) els.push(el.cella(pre + (t * 5 + k), x0 + k * (o.w + 2), o.y, o.w, o.h, fatto ? (k === 0 ? 'AR' : chi) : '', !fatto ? '' : forte ? (k === 0 ? 'zero' : 'att') : evid ? 'off' : k === 0 ? 'zero' : 'on', { gi: String(t * 5 + k), piccola: true }));
    }
    return els;
  };
  return { IDS, ordine, attesa, griglia };
})();
SL.registra('4.4.4', {
  titolo: 'Banda, coordinamento e arbitraggio',
  obiettivo: 'Obiettivo: ricostruire l’ordine in cui un arbitro serve richieste simultanee, e calcolare l’attesa di ciascun richiedente.',
  concetti: [['semaforo', 'L’ordine di servizio'], ['coda', 'La successione dei turni'], ['clock', 'L’attesa in cicli']],
  filigrana: ['semaforo', 'coda', 'clock'],
  richiami: {
    carte: [
      { sim: 'semaforo', da: 'Dall’unità 4.4.1', t: 'L’arbitro', d: 'Il circuito che concede il bus a un iniziatore per volta.' },
      { sim: 'bus', da: 'Dall’unità 4.4.3', t: 'La raffica', d: 'Più parole consecutive in una sola transazione.' },
      { sim: 'clock', da: 'Dall’unità 2.1.4', t: 'Il ciclo di clock', d: 'L’unità con cui si misura il tempo sul bus.' }
    ],
    domanda: { d: 'Prima di proseguire: un turno sul bus dura 5 cicli. Due turni precedono quello di un richiedente. Quanti cicli attende il richiedente prima che il suo turno abbia inizio?', o: [
      { t: '10', ok: true, fb: 'Due turni da 5 cicli occupano 10 cicli.' },
      { t: '5', fb: 'I turni precedenti sono due, ciascuno di 5 cicli.' },
      { t: '15', fb: 'Quindici cicli comprendono anche il turno del richiedente. L’attesa riguarda soltanto i due precedenti.' }
    ] }
  },
  idea: {
    titolo: 'Due regole di ordinamento',
    termini: ['priorità fissa', 'round-robin'],
    testo: [
      'Tre componenti, A, B e C, richiedono il bus nel medesimo istante. L’arbitro deve servirli in successione, e la regola con cui stabilisce l’ordine determina l’attesa di ciascuno. Nel modello di questa unità ogni turno dura cinque cicli: nel primo l’arbitro assegna il bus, nei quattro seguenti è trasferita una raffica di quattro parole.',
      'La regola più semplice è la [[priorità fissa]]. I richiedenti hanno un rango stabilito in modo permanente, in questo caso A, poi B, poi C, e l’arbitro seleziona sempre quello di rango più alto fra i richiedenti in attesa. La regola è di facile realizzazione e ha un difetto: se A e B presentano una nuova richiesta non appena serviti, C resta sempre preceduto da entrambi e può attendere senza limite.',
      'La regola a rotazione, denominata [[round-robin]], memorizza l’ultimo richiedente servito e riprende dal successivo in un ordine circolare: ad A segue B, a B segue C, a C segue di nuovo A. Il richiedente appena servito passa all’ultima posizione, e nessuno resta escluso.',
      { fig: 'scena', w: 720, h: 112, titolo: 'Round-robin, ultimo servito B', nota: 'AR è il ciclo di arbitraggio. I cicli sono numerati da 0: il numero di un ciclo indica quanti cicli lo precedono.', els: SL.unita444.griglia('g', { pol: 'rr', last: 'B', oss: 'B' }, 3, 'B', { x: 10, y: 28, w: 44, h: 36 }) },
      'Nella figura l’ultimo servito era B. La rotazione riprende da C, prosegue con A e giunge a B per ultimo. I due turni che precedono B occupano i cicli da 0 a 9. Il turno di B ha inizio al ciclo 10 con l’arbitraggio, il suo primo dato è trasferito nel ciclo 11, e il trasferimento è completo quando sono trascorsi 15 cicli. I tre istanti sono distinti: l’inizio del turno misura l’attesa, mentre il completamento comprende anche il lavoro svolto.'
    ]
  },
  esperimento: {
    faremo: [
      'A, B e C richiedono il bus insieme. I controlli fissano la regola dell’arbitro, l’ultimo richiedente servito e il richiedente da osservare.',
      'L’esperimento dispone i tre turni sulla griglia dei cicli e ne ricava tre istanti: l’inizio del turno osservato, il suo primo dato, il completamento. Con la priorità fissa, è istruttivo modificare l’ultimo servito e verificare se l’ordine varia.'
    ],
    vedrai: [
      ['semaforo', 'L’arbitro', 'In alto: la regola, l’ultimo servito e l’ordine deciso.'],
      ['clock', 'La griglia dei cicli', 'In basso: una cella per ciclo, numerata da 0. AR indica l’arbitraggio.']
    ]
  },
  lab: {
    titolo: 'Tre richieste, un bus',
    scena: { w: 860, h: 230 },
    atti: ['Le richieste', 'L’ordine', 'I turni', 'L’attesa'],
    controlli: [
      { id: 'pol', tipo: 'scelta', eti: 'Regola', opzioni: [['rr', 'round-robin'], ['fissa', 'priorità A, B, C']], valore: 'rr' },
      { id: 'last', tipo: 'scelta', eti: 'Ultimo servito', opzioni: [['A', 'A'], ['B', 'B'], ['C', 'C']], valore: 'B' },
      { id: 'oss', tipo: 'scelta', eti: 'Richiedente osservato', opzioni: [['A', 'A'], ['B', 'B'], ['C', 'C']], valore: 'B' }
    ],
    nota: 'I passi sono sempre sei. Ogni turno dura cinque cicli: uno di arbitraggio e quattro di dati.',
    previsione: {
      domanda: (p) => 'A, B e C richiedono il bus nel medesimo istante. La regola è ' + (p.pol === 'rr' ? 'il round-robin' : 'la priorità fissa A, B, C') + ', e l’ultimo servito era ' + p.last + '. Quanti cicli attende ' + p.oss + ' prima che il suo turno abbia inizio?',
      opzioni: () => [[0, 'Nessuno, poiché è il primo'], [5, '5 cicli'], [10, '10 cicli']]
    },
    confronto: (pred, esito, p) => { const U = SL.unita444, ord = U.ordine(p); return 'La previsione indicava un’attesa di ' + pred + ' cicli. L’ordine è ' + ord.join(', ') + ', e ' + p.oss + ' attende ' + esito + ' cicli. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.pol === 'rr' ? 'La rotazione riprende dal successivo di ' + p.last + ', cioè da ' + ord[0] + '.' : 'Con la priorità fissa l’ultimo servito è ininfluente: l’ordine è sempre A, B, C.'); },
    costruisci(p) {
      const U = SL.unita444, el = SL.el, passi = [], ord = U.ordine(p), pos = ord.indexOf(p.oss), att = 5 * pos, rr = p.pol === 'rr';
      const quadro = (f, turni, evid) => {
        const els = [el.nota('t0', 20, 0, 'RICHIEDENTI', 'mono'), el.nota('t1', 470, 0, 'ARBITRO', 'mono')];
        U.IDS.forEach((id, k) => { const t = ord.indexOf(id); els.push(el.box('r' + id, 20 + k * 144, 24, 132, 56, 'richiedente ' + id, t < turni ? 'servito' : f >= 2 && t === turni ? 'ha il bus' : 'in attesa', id === p.oss && evid ? 'att' : t < turni ? 'off' : 'on', { cls: 'stretta' })); });
        els.push(el.box('ar1', 470, 24, 170, 56, rr ? 'ultimo servito' : 'rango', rr ? p.last : 'A, B, C', f === 1 ? 'att' : 'on', { cls: 'stretta' }), el.box('ar2', 652, 24, 188, 56, 'ordine deciso', f >= 1 ? ord.join(' → ') : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }));
        els.push(el.nota('t2', 20, 100, 'GRIGLIA DEI CICLI', 'mono'));
        return els.concat(U.griglia('c', p, turni, evid ? p.oss : '', { x: 20, y: 146, w: 52, h: 36 }));
      };
      const hud = (f) => [['Inizio del turno', f >= 5 ? 'ciclo ' + att : '·', 'a'], ['Primo dato', f >= 5 ? 'ciclo ' + (att + 1) : '·'], ['Completamento', f >= 5 ? 'dopo ' + (att + 5) + ' cicli' : '·', 'c']];
      const P = (f, turni, evid, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f, turni, evid) }, extra));

      P(0, 0, false, 0, 'Tre richieste insieme', 'All’inizio del ciclo 0 i tre componenti richiedono il bus. Ciascuno deve trasferire una raffica di quattro parole, e il bus può servirne uno per volta.', {});
      P(1, 0, false, 1, 'La regola', rr ? 'La regola è il round-robin. L’arbitro memorizza l’ultimo servito, ' + p.last + ', e riprende dal successivo nell’ordine circolare A, B, C: il turno spetta a ' + ord[0] + ', poi a ' + ord[1] + ', infine a ' + ord[2] + '.' : 'La regola è la priorità fissa. L’arbitro seleziona sempre il rango più alto fra i richiedenti in attesa: A, poi B, poi C. L’ultimo servito, ' + p.last + ', è ininfluente.',
        { calc: 'ordine: ' + ord.join(' → '), chiedi: { d: 'Quale richiedente ottiene il primo turno?', o: ['A', 'B', 'C'], g: U.IDS.indexOf(ord[0]), no: rr ? 'Dopo ' + p.last + ' la rotazione prosegue con ' + ord[0] + '.' : 'Il rango più alto è quello di A.' } });
      ord.forEach((id, t) => P(2 + t, t + 1, false, 2, ['Il primo turno', 'Il secondo turno', 'Il terzo turno'][t], 'Il turno di ' + id + ' occupa i cicli da ' + 5 * t + ' a ' + (5 * t + 4) + '. Nel ciclo ' + 5 * t + ' l’arbitro gli assegna il bus, nei quattro cicli seguenti sono trasferite le sue quattro parole.' + (t < 2 ? ' Gli altri attendono.' : ' Tutte le richieste sono state servite in 15 cicli.'), { calc: 'cicli da ' + 5 * t + ' a ' + (5 * t + 4) + ': ' + id }));
      P(5, 3, true, 3, 'L’attesa di ' + p.oss, (pos === 0 ? p.oss + ' è il primo dell’ordine, e il suo turno ha inizio immediatamente, al ciclo 0.' : 'Prima di ' + p.oss + ' sono serviti ' + (pos === 1 ? 'un turno' : 'due turni') + ' da cinque cicli: il suo turno ha inizio al ciclo ' + att + ', dopo ' + att + ' cicli di attesa.') + ' Il primo dato è trasferito nel ciclo ' + (att + 1) + ', e il trasferimento è completo quando sono trascorsi ' + (att + 5) + ' cicli.', { calc: 'attesa: 5 × ' + pos + ' = ' + att + ' · completamento: ' + att + ' + 5 = ' + (att + 5), esito: ['attesa di ' + att + ' cicli', ''] });
      return { passi, esito: att };
    }
  },
  bilancio: {
    regola: [
      'La priorità fissa serve sempre il rango più alto fra i richiedenti in attesa. Il round-robin riprende dal successivo dell’ultimo servito, in ordine circolare.',
      'Attesa = durata di un turno × turni che precedono. Completamento = attesa + durata del proprio turno.'
    ],
    errori: [
      ['Applicare la rotazione partendo dall’ultimo servito.', 'La rotazione ha inizio dal successivo: il richiedente appena servito passa all’ultima posizione.'],
      ['Confondere l’inizio del turno con il completamento.', 'Fra i due istanti è compreso l’intero turno: arbitraggio e dati.'],
      ['Tenere conto dell’ultimo servito con la priorità fissa.', 'La priorità fissa considera soltanto il rango.']
    ],
    saFare: ['Ricavare l’ordine con la priorità fissa.', 'Ricavare l’ordine con il round-robin.', 'Calcolare attesa e completamento di un richiedente.'],
    esercizi: [
      { d: 'Arbitro round-robin, ordine circolare A, B, C. L’ultimo servito è stato A. Le tre richieste giungono insieme, e ogni turno dura 5 cicli. Dopo quanti cicli di attesa ha inizio il turno di C?', segnaposto: 'Un numero', giuste: ['5', 'cinque', '5cicli'],
        ok: 'L’ordine è B, C, A. C è preceduto da un solo turno, di 5 cicli.',
        diagnosi: [
          { se: ['10', '10cicli'], msg: 'C sarebbe terzo con la priorità fissa. In questo caso la rotazione riprende da B, e C è secondo.' },
          { se: ['0', '0cicli'], msg: 'Dopo A la rotazione riprende da B, che è servito per primo.' },
          { se: ['6', '6cicli'], msg: 'Il ciclo 6 è quello del primo dato di C. Il turno ha inizio un ciclo prima, con l’arbitraggio.' }
        ],
        altro: 'Il numero è diverso. Si scriva l’ordine dei turni partendo dal successivo di A.',
        indizi: ['Ad A segue B.', 'L’ordine è B, C, A.', 'Un turno precede C: 5 cicli.'],
        svolgimento: ['Ultimo servito: A.', 'Ordine: B, C, A.', 'Attesa di C: 1 × 5 = 5 cicli.'] },
      { d: 'Nella medesima situazione, quanti cicli sono trascorsi dall’arrivo delle richieste quando A ha completato il suo trasferimento?', segnaposto: 'Un numero', giuste: ['15', 'quindici', '15cicli'],
        ok: 'A è terzo: attende 10 cicli, e il suo turno ne dura altri 5.',
        diagnosi: [
          { se: ['10', '10cicli'], msg: 'Dopo 10 cicli il turno di A ha inizio. Per il completamento occorrono altri 5 cicli.' },
          { se: ['5', '5cicli'], msg: 'A è stato l’ultimo servito, e la rotazione lo colloca all’ultima posizione: è terzo.' },
          { se: ['11', '11cicli'], msg: 'Nel ciclo 11 è trasferito il primo dato di A. Le parole sono quattro.' }
        ],
        altro: 'Il numero è diverso. Si sommi l’attesa di A alla durata del suo turno.',
        indizi: ['L’ordine è B, C, A.', 'A attende due turni: 10 cicli.', '10 + 5 = 15.'],
        svolgimento: ['Attesa di A: 2 × 5 = 10 cicli.', 'Turno di A: 5 cicli.', 'Completamento: 15 cicli.'] },
      { d: 'Un arbitro adotta la priorità fissa A, B, C. A e B presentano una nuova richiesta ogni volta che sono serviti. Che cosa accade a C?', guida: 'Si scelga la risposta.', o: [
        { t: 'Può attendere senza limite', ok: true, fb: 'A ogni scelta è presente una richiesta di rango più alto, e C è sempre preceduto.' },
        { t: 'È servito una volta ogni tre turni', fb: 'Questo accadrebbe con il round-robin.' },
        { t: 'Dopo due turni passa alla prima posizione', fb: 'Nella priorità fissa il rango resta quello stabilito all’inizio.' }] }
    ],
    sfida: ['cslez4_4_03_buses_03', 'Arbitraggio e tempi di attesa']
  }
});
