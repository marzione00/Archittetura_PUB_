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
  obiettivo: 'Alla fine saprai ricostruire l’ordine in cui un arbitro serve richieste simultanee, e calcolare quanto attende ciascun richiedente.',
  concetti: [['semaforo', 'Chi passa per primo'], ['coda', 'I turni si mettono in fila'], ['clock', 'L’attesa si conta in cicli']],
  filigrana: ['semaforo', 'coda', 'clock'],
  richiami: {
    carte: [
      { sim: 'semaforo', da: 'Dall’unità 4.4.1', t: 'L’arbitro', d: 'Il circuito che concede il bus a un iniziatore per volta.' },
      { sim: 'bus', da: 'Dall’unità 4.4.3', t: 'La raffica', d: 'Più parole consecutive in una sola transazione.' },
      { sim: 'clock', da: 'Dall’unità 2.1.4', t: 'Il ciclo di clock', d: 'L’unità con cui si misura il tempo sul bus.' }
    ],
    domanda: { d: 'Prima di proseguire: un turno sul bus dura 5 cicli. Due turni precedono il tuo. Quanti cicli attendi prima che cominci?', o: [
      { t: '10', ok: true, fb: 'Due turni da 5 cicli occupano 10 cicli.' },
      { t: '5', fb: 'I turni davanti sono due, ciascuno di 5 cicli.' },
      { t: '15', fb: 'Quindici cicli comprendono anche il tuo turno. L’attesa riguarda soltanto i due precedenti.' }
    ] }
  },
  idea: {
    titolo: 'Due modi di mettere in fila',
    termini: ['priorità fissa', 'round-robin'],
    testo: [
      'Tre componenti, A, B e C, chiedono il bus nello stesso istante. L’arbitro deve servirli uno dopo l’altro, e la regola con cui sceglie l’ordine decide quanto attende ciascuno. Nel modello di questa unità ogni turno dura cinque cicli: nel primo l’arbitro assegna il bus, nei quattro seguenti viaggia una raffica di quattro parole.',
      'La regola più semplice è la [[priorità fissa]]. I richiedenti hanno un rango stabilito una volta per tutte, qui A, poi B, poi C, e l’arbitro sceglie sempre quello di rango più alto fra chi sta aspettando. La regola è facile da realizzare e ha un difetto. Se A e B presentano una nuova richiesta appena servite, C continua a trovarsele davanti e può attendere senza limite.',
      'La regola a rotazione, chiamata [[round-robin]], ricorda chi è stato servito per ultimo e riparte dal successivo in un ordine circolare: dopo A viene B, dopo B viene C, dopo C di nuovo A. Chi è appena stato servito finisce in fondo, e nessuno resta escluso.',
      { fig: 'scena', w: 720, h: 112, titolo: 'Round-robin, ultimo servito B', nota: 'AR è il ciclo di arbitraggio. I cicli sono numerati da 0: il numero di un ciclo dice quanti cicli lo precedono.', els: SL.unita444.griglia('g', { pol: 'rr', last: 'B', oss: 'B' }, 3, 'B', { x: 10, y: 28, w: 44, h: 36 }) },
      'Nella figura l’ultimo servito era B. La rotazione riparte da C, prosegue con A e arriva a B per ultimo. I due turni che precedono B occupano i cicli da 0 a 9. Il turno di B comincia al ciclo 10 con l’arbitraggio, il suo primo dato viaggia nel ciclo 11, e il trasferimento è completo quando sono trascorsi 15 cicli. Sono tre istanti diversi: l’inizio del turno misura l’attesa, il completamento comprende anche il lavoro svolto.'
    ]
  },
  esperimento: {
    faremo: [
      'A, B e C chiedono il bus insieme. Sceglierai la regola dell’arbitro, chi era stato servito per ultimo, e quale richiedente osservare.',
      'Disegneremo i tre turni sulla griglia dei cicli e leggeremo tre istanti: l’inizio del turno osservato, il suo primo dato, il completamento. Con la priorità fissa, cambia l’ultimo servito e controlla se l’ordine si sposta.'
    ],
    vedrai: [
      ['semaforo', 'L’arbitro', 'In alto: la regola, l’ultimo servito e l’ordine deciso.'],
      ['clock', 'La griglia dei cicli', 'In basso: una casella per ciclo, numerata da 0. AR segna l’arbitraggio.']
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
      domanda: (p) => 'A, B e C chiedono il bus nello stesso istante. La regola è ' + (p.pol === 'rr' ? 'il round-robin' : 'la priorità fissa A, B, C') + ', e l’ultimo servito era ' + p.last + '. Quanti cicli attende ' + p.oss + ' prima che cominci il suo turno?',
      opzioni: () => [[0, 'Nessuno: è il primo'], [5, '5 cicli'], [10, '10 cicli']]
    },
    confronto: (pred, esito, p) => { const U = SL.unita444, ord = U.ordine(p); return 'Avevi previsto un’attesa di ' + pred + ' cicli. L’ordine è ' + ord.join(', ') + ', e ' + p.oss + ' attende ' + esito + ' cicli. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.pol === 'rr' ? 'La rotazione riparte dal successivo di ' + p.last + ', cioè da ' + ord[0] + '.' : 'Con la priorità fissa l’ultimo servito è ininfluente: l’ordine è sempre A, B, C.'); },
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

      P(0, 0, false, 0, 'Tre richieste insieme', 'All’inizio del ciclo 0 i tre componenti chiedono il bus. Ciascuno vuole trasferire una raffica di quattro parole. Il bus può servirne uno per volta.', {});
      P(1, 0, false, 1, 'La regola', rr ? 'La regola è il round-robin. L’arbitro tiene memoria dell’ultimo servito, ' + p.last + ', e riparte dal successivo nell’ordine circolare A, B, C: tocca a ' + ord[0] + ', poi a ' + ord[1] + ', infine a ' + ord[2] + '.' : 'La regola è la priorità fissa. L’arbitro sceglie sempre il rango più alto fra chi aspetta: A, poi B, poi C. L’ultimo servito, ' + p.last + ', è ininfluente.',
        { calc: 'ordine: ' + ord.join(' → '), chiedi: { d: 'Chi ottiene il primo turno?', o: ['A', 'B', 'C'], g: U.IDS.indexOf(ord[0]), no: rr ? 'Dopo ' + p.last + ' la rotazione prosegue con ' + ord[0] + '.' : 'Il rango più alto è quello di A.' } });
      ord.forEach((id, t) => P(2 + t, t + 1, false, 2, ['Il primo turno', 'Il secondo turno', 'Il terzo turno'][t], 'Il turno di ' + id + ' occupa i cicli da ' + 5 * t + ' a ' + (5 * t + 4) + '. Nel ciclo ' + 5 * t + ' l’arbitro gli assegna il bus, nei quattro cicli seguenti viaggiano le sue quattro parole.' + (t < 2 ? ' Gli altri attendono.' : ' Tutte le richieste sono state servite in 15 cicli.'), { calc: 'cicli da ' + 5 * t + ' a ' + (5 * t + 4) + ': ' + id }));
      P(5, 3, true, 3, 'L’attesa di ' + p.oss, (pos === 0 ? p.oss + ' è il primo dell’ordine, e il suo turno comincia subito, al ciclo 0.' : 'Prima di ' + p.oss + ' vengono serviti ' + (pos === 1 ? 'un turno' : 'due turni') + ' da cinque cicli: il suo turno comincia al ciclo ' + att + ', dopo ' + att + ' cicli di attesa.') + ' Il primo dato viaggia nel ciclo ' + (att + 1) + ', e il trasferimento è completo quando sono trascorsi ' + (att + 5) + ' cicli.', { calc: 'attesa: 5 × ' + pos + ' = ' + att + ' · completamento: ' + att + ' + 5 = ' + (att + 5), esito: ['attesa di ' + att + ' cicli', ''] });
      return { passi, esito: att };
    }
  },
  bilancio: {
    regola: [
      'La priorità fissa serve sempre il rango più alto fra chi aspetta. Il round-robin riparte dal successivo dell’ultimo servito, in ordine circolare.',
      'Attesa = durata di un turno × turni che precedono. Completamento = attesa + durata del proprio turno.'
    ],
    errori: [
      ['Applicare la rotazione partendo dall’ultimo servito.', 'Si parte dal successivo: chi è appena stato servito va in fondo.'],
      ['Confondere l’inizio del turno con il completamento.', 'Fra i due istanti c’è l’intero turno: arbitraggio e dati.'],
      ['Tenere conto dell’ultimo servito con la priorità fissa.', 'La priorità fissa guarda soltanto il rango.']
    ],
    saFare: ['Ricavo l’ordine con la priorità fissa.', 'Ricavo l’ordine con il round-robin.', 'Calcolo attesa e completamento di un richiedente.'],
    esercizi: [
      { d: 'Arbitro round-robin, ordine circolare A, B, C. L’ultimo servito è stato A. Le tre richieste arrivano insieme, e ogni turno dura 5 cicli. Dopo quanti cicli di attesa comincia il turno di C?', segnaposto: 'Un numero', giuste: ['5', 'cinque', '5cicli'],
        ok: 'L’ordine è B, C, A. Prima di C c’è un solo turno, di 5 cicli.',
        diagnosi: [
          { se: ['10', '10cicli'], msg: 'C sarebbe terzo con la priorità fissa. Qui la rotazione riparte da B, e C è secondo.' },
          { se: ['0', '0cicli'], msg: 'Dopo A la rotazione riparte da B, che viene servito per primo.' },
          { se: ['6', '6cicli'], msg: 'Il ciclo 6 è quello del primo dato di C. Il turno comincia un ciclo prima, con l’arbitraggio.' }
        ],
        altro: 'Il numero è diverso. Scrivi l’ordine dei turni partendo dal successivo di A.',
        indizi: ['Dopo A viene B.', 'L’ordine è B, C, A.', 'Un turno precede C: 5 cicli.'],
        svolgimento: ['Ultimo servito: A.', 'Ordine: B, C, A.', 'Attesa di C: 1 × 5 = 5 cicli.'] },
      { d: 'Nella stessa situazione, quanti cicli sono trascorsi dall’arrivo delle richieste quando A ha completato il suo trasferimento?', segnaposto: 'Un numero', giuste: ['15', 'quindici', '15cicli'],
        ok: 'A è terzo: attende 10 cicli, e il suo turno ne dura altri 5.',
        diagnosi: [
          { se: ['10', '10cicli'], msg: 'Dopo 10 cicli il turno di A comincia. Per il completamento servono altri 5 cicli.' },
          { se: ['5', '5cicli'], msg: 'A è stato l’ultimo servito, e la rotazione lo mette in fondo: è terzo.' },
          { se: ['11', '11cicli'], msg: 'Nel ciclo 11 viaggia il primo dato di A. Le parole sono quattro.' }
        ],
        altro: 'Il numero è diverso. Somma l’attesa di A alla durata del suo turno.',
        indizi: ['L’ordine è B, C, A.', 'A attende due turni: 10 cicli.', '10 + 5 = 15.'],
        svolgimento: ['Attesa di A: 2 × 5 = 10 cicli.', 'Turno di A: 5 cicli.', 'Completamento: 15 cicli.'] },
      { d: 'Un arbitro usa la priorità fissa A, B, C. A e B presentano una nuova richiesta ogni volta che vengono servite. Che cosa accade a C?', guida: 'Scegli la risposta.', o: [
        { t: 'Può attendere senza limite', ok: true, fb: 'A ogni scelta c’è una richiesta di rango più alto, e C viene sempre scavalcato.' },
        { t: 'Viene servito una volta ogni tre turni', fb: 'Questo accadrebbe con il round-robin.' },
        { t: 'Dopo due turni passa in testa', fb: 'Nella priorità fissa il rango resta quello stabilito all’inizio.' }] }
    ],
    sfida: ['cslez4_4_03_buses_03', 'Arbitraggio e tempi di attesa']
  }
});
