'use strict';
SL.unita441 = (() => {
  const H2 = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0');
  const dest = (a) => (a < 128 ? 'ram' : a < 144 ? 'ctl' : 'no');
  const NOMI = { ram: 'la RAM', ctl: 'il controller', no: 'nessuno' }, CHI = { cpu: 'il processore', ctl: 'un controller' };
  // fase: 0 le richieste · 1 l'arbitraggio · 2 indirizzo e comando · 3 la decodifica · 4 lo scambio
  const quadro = (pre, p, f, o) => {
    const el = SL.el, d = dest(p.a), ok = d !== 'no', lett = p.cmd === 'r', els = [], x2 = o.x + o.w + o.gap, x3 = x2 + o.w + o.gap, py = o.h + 12;
    els.push(el.box(pre + 'a', o.x, o.y, o.w, o.h, 'iniziatore · processore', f === 0 ? 'chiede il bus' : p.master === 'cpu' ? 'ha il turno' : 'attende', f >= 1 && p.master === 'cpu' ? 'att' : f >= 1 ? 'zero' : 'on', { cls: 'stretta' }),
      el.box(pre + 'b', o.x, o.y + py, o.w, o.h, 'iniziatore · controller', f === 0 ? 'chiede il bus' : p.master === 'ctl' ? 'ha il turno' : 'attende', f >= 1 && p.master === 'ctl' ? 'att' : f >= 1 ? 'zero' : 'on', { cls: 'stretta' }),
      el.box(pre + 'c', o.x, o.y + 2 * py, o.w, o.h, 'arbitro', f >= 1 ? 'turno a ' + (p.master === 'cpu' ? 'processore' : 'controller') : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'd', x2, o.y, o.w, o.h, 'bus · comando', f >= 2 ? (lett ? 'lettura' : 'scrittura di 0xA5') : '·', f === 2 ? 'att' : f > 2 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'e', x2, o.y + py, o.w, o.h, 'bus · indirizzo', f >= 2 ? H2(p.a) : '·', f === 2 || f === 3 ? 'att' : f > 3 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'g', x2, o.y + 2 * py, o.w, o.h, 'bus · risposta', f >= 4 ? (ok ? 'ACK · dato ' + H2(lett ? p.a : 0xA5) : 'errore di indirizzo') : '·', f >= 4 ? (ok ? 'att' : 'err') : '', { cls: 'stretta' }));
    [['ram', 'RAM · da 0x00 a 0x7F'], ['ctl', 'controller · da 0x80 a 0x8F'], ['no', 'da 0x90 in poi']].forEach((r, k) => els.push(el.box(pre + 'm' + k, x3, o.y + k * py, o.w, o.h, r[1], f >= 3 && d === r[0] ? (r[0] === 'no' ? 'nessun componente' : 'selezionato') : r[0] === 'no' ? 'nessun componente' : '·', f >= 3 && d === r[0] ? (r[0] === 'no' ? 'err' : 'att') : f >= 3 ? 'off' : '', { cls: 'stretta' })));
    return els;
  };
  return { H2, dest, NOMI, CHI, quadro };
})();
SL.registra('4.4.1', {
  titolo: 'Regole di comunicazione di un’interconnessione',
  obiettivo: 'Obiettivo: seguire una transazione su un bus condiviso: chi ottiene il turno, quale componente risponde all’indirizzo, e come si conclude lo scambio.',
  concetti: [['bus', 'Un fascio di fili per tutti'], ['semaforo', 'Uno alla volta'], ['tabella', 'L’indirizzo sceglie chi risponde']],
  filigrana: ['bus', 'tabella', 'semaforo'],
  richiami: {
    carte: [
      { sim: 'bus', da: 'Dall’unità 3.1.2', t: 'Il bus', d: 'Un fascio di fili che trasporta insieme i bit di una stessa parola.' },
      { sim: 'dispositivo', da: 'Dall’unità 4.3.1', t: 'I registri del dispositivo', d: 'Le caselle di un controller in cui il processore può leggere e scrivere.' },
      { sim: 'hex', da: 'Dall’unità 1.2.4', t: 'L’esadecimale', d: '0x80 vale 128, e 0x90 vale 144.' }
    ],
    domanda: { d: 'Prima di proseguire: gli indirizzi da 0x80 a 0x8F sono riservati a un controller. Quanti sono?', o: [
      { t: '16', ok: true, fb: 'Da 0x80 a 0x8F cambia soltanto l’ultima cifra esadecimale, che assume sedici valori.' },
      { t: '15', fb: 'Vanno contati entrambi gli estremi: da 0 a F i valori sono sedici.' },
      { t: '8', fb: 'L’ultima cifra va da 0 a F, cioè sedici valori.' }
    ] }
  },
  idea: {
    titolo: 'Chi parla, e chi risponde',
    termini: ['bus condiviso', 'transazione', 'arbitro', 'mappa degli indirizzi'],
    testo: [
      'Processore, memoria e controller devono scambiarsi dati. Collegare ogni componente a tutti gli altri con fili propri sarebbe ingombrante, e la soluzione classica è un [[bus condiviso]]: un solo fascio di fili a cui tutti sono attaccati. Su quei fili viaggia una richiesta per volta.',
      'Una richiesta completa, dall’inizio alla risposta, si chiama [[transazione]]. Chi la avvia è l’iniziatore. Di solito è il processore, a volte un controller capace di leggere e scrivere la memoria da solo. Se due iniziatori vogliono il bus nello stesso momento, un circuito, l’[[arbitro]], concede il turno a uno e fa attendere l’altro.',
      'Ottenuto il turno, l’iniziatore mette sul bus un comando, leggere oppure scrivere, e un indirizzo. Tutti i componenti vedono l’indirizzo, e uno solo deve rispondere. La scelta dipende dalla [[mappa degli indirizzi]], che assegna a ogni componente un intervallo. In questo modello gli indirizzi da 0x00 a 0x7F appartengono alla RAM, quelli da 0x80 a 0x8F ai registri di un controller.',
      { fig: 'scena', w: 720, h: 204, titolo: 'Il processore legge l’indirizzo 0x84', nota: 'L’indirizzo cade nell’intervallo del controller, che risponde con il dato e con la conferma.', els: SL.unita441.quadro('g', { a: 132, cmd: 'r', master: 'cpu' }, 4, { x: 10, y: 8, w: 222, gap: 17, h: 54 }) },
      'Il componente scelto completa lo scambio. In lettura mette il dato sul bus, in scrittura lo riceve, e in entrambi i casi conferma con un segnale chiamato ACK. Se l’indirizzo cade fuori da tutti gli intervalli nessuno risponde, e la transazione si chiude con un errore. Avere ottenuto il bus dà il diritto di chiedere. Che dall’altra parte ci sia qualcuno dipende dall’indirizzo.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processore e un controller chiedono il bus nello stesso momento. Sceglierai a chi va il turno, l’indirizzo richiesto e il comando.',
      'Seguiremo la transazione: l’arbitraggio, l’indirizzo sul bus, la scelta del componente che risponde e lo scambio del dato. Dopo il caso proposto, chiedi l’indirizzo 0x90.'
    ],
    vedrai: [
      ['semaforo', 'Gli iniziatori', 'A sinistra: chi chiede il bus, e la decisione dell’arbitro.'],
      ['bus', 'Il bus', 'Al centro: il comando, l’indirizzo e la risposta.'],
      ['tabella', 'La mappa degli indirizzi', 'A destra: i tre intervalli, e quello in cui cade l’indirizzo.']
    ]
  },
  lab: {
    titolo: 'Una transazione sul bus',
    scena: { w: 860, h: 232 },
    atti: ['Le richieste', 'Il turno', 'L’indirizzo', 'Lo scambio'],
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'Indirizzo', opzioni: [[36, '0x24'], [132, '0x84'], [144, '0x90']], valore: 132 },
      { id: 'cmd', tipo: 'scelta', eti: 'Comando', opzioni: [['r', 'lettura'], ['w', 'scrittura di 0xA5']], valore: 'r' },
      { id: 'master', tipo: 'scelta', eti: 'Turno concesso', opzioni: [['cpu', 'al processore'], ['ctl', 'al controller']], valore: 'cpu' }
    ],
    nota: 'I passi sono sempre cinque. Nel modello ogni byte leggibile contiene, all’inizio, il proprio indirizzo.',
    previsione: {
      domanda: (p) => 'L’iniziatore mette sul bus l’indirizzo ' + SL.unita441.H2(p.a) + '. La RAM occupa gli indirizzi da 0x00 a 0x7F, il controller quelli da 0x80 a 0x8F. Quale componente risponde?',
      opzioni: () => [['ram', 'La RAM'], ['ctl', 'Il controller'], ['no', 'Nessuno: errore di indirizzo']]
    },
    confronto: (pred, esito, p) => { const U = SL.unita441; return 'La previsione indicava: ' + U.NOMI[pred] + '. Risponde: ' + U.NOMI[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'L’indirizzo ' + U.H2(p.a) + (esito === 'ram' ? ' è minore di 0x80, e appartiene alla RAM.' : esito === 'ctl' ? ' sta fra 0x80 e 0x8F, l’intervallo del controller.' : ' supera 0x8F, l’ultimo indirizzo assegnato.')); },
    costruisci(p) {
      const U = SL.unita441, H2 = U.H2, passi = [], d = U.dest(p.a), ok = d !== 'no', lett = p.cmd === 'r', chi = p.master === 'cpu' ? 'il processore' : 'il controller', altro = p.master === 'cpu' ? 'il controller' : 'il processore', off = d === 'ctl' ? p.a - 128 : p.a;
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'INIZIATORI', 'mono'), SL.el.nota('t1', 300, 0, 'BUS', 'mono'), SL.el.nota('t2', 580, 0, 'MAPPA DEGLI INDIRIZZI', 'mono')].concat(U.quadro('q', p, f, { x: 20, y: 24, w: 264, gap: 14, h: 56 }));
      const hud = (f) => [['Indirizzo', H2(p.a), 'a'], ['Risponde', f >= 3 ? U.NOMI[d] : '·'], ['Esito', f >= 4 ? (ok ? 'ACK' : 'errore') : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Due richieste', 'Il processore e un controller vogliono usare il bus nello stesso momento. I fili sono gli stessi per entrambi, e due transazioni insieme si confonderebbero. Serve una decisione.', {});
      P(1, 1, 'Il turno', 'L’arbitro concede il bus a uno solo: questa volta tocca ' + (p.master === 'cpu' ? 'al processore' : 'al controller') + '. L’altro iniziatore, ' + altro + ', resta in attesa e riproverà quando il bus sarà libero.', { calc: 'turno: ' + chi.replace('il ', '') });
      P(2, 2, 'Indirizzo e comando', 'Ottenuto il turno, ' + chi + ' mette sul bus il comando, ' + (lett ? 'una lettura' : 'una scrittura del valore 0xA5') + ', e l’indirizzo ' + H2(p.a) + '. Tutti i componenti collegati lo vedono.',
        { calc: (lett ? 'lettura' : 'scrittura') + ' · indirizzo ' + H2(p.a), chiedi: { d: 'L’indirizzo ' + H2(p.a) + ' vale ' + p.a + ' in base dieci. In quale intervallo cade?', o: ['Da 0 a 127', 'Da 128 a 143', 'Oltre 143'], g: d === 'ram' ? 0 : d === 'ctl' ? 1 : 2, no: p.a + (d === 'ram' ? ' è minore di 128.' : d === 'ctl' ? ' sta fra 128 e 143.' : ' è maggiore di 143.') } });
      P(3, 2, 'Chi risponde', d === 'ram' ? 'L’indirizzo cade nell’intervallo della RAM. Gli altri componenti lo ignorano, e la RAM seleziona la propria cella numero ' + off + '.' : d === 'ctl' ? 'L’indirizzo cade nell’intervallo del controller, che comincia a 0x80. Il controller seleziona il proprio registro numero ' + H2(p.a) + ' − 0x80 = ' + off + '. La RAM ignora la richiesta.' : 'L’indirizzo supera 0x8F, l’ultimo assegnato. Nessun componente lo riconosce come proprio.', { calc: ok ? 'selezionato: ' + U.NOMI[d].replace(/^(la|il) /, '') + ' · posizione ' + off : 'nessun componente selezionato', esito: ['risponde ' + U.NOMI[d], ok ? 'si' : 'no'] });
      P(4, 3, ok ? 'Lo scambio' : 'L’errore', ok ? (lett ? U.NOMI[d].replace(/^l/, 'L').replace(/^i/, 'I') + ' mette sul bus il byte ' + H2(p.a) + ' e conferma con ACK. L’iniziatore lo raccoglie, e il bus torna libero.' : 'L’iniziatore mette sul bus il byte 0xA5. ' + U.NOMI[d].replace(/^l/, 'L').replace(/^i/, 'I') + ' lo registra e conferma con ACK. Il bus torna libero.') : 'Nessuno conferma. Dopo un tempo prestabilito il bus segnala un errore di indirizzo, e la transazione si chiude senza che alcun byte sia stato trasferito. Il turno era stato ottenuto regolarmente.', { calc: ok ? 'ACK · byte ' + H2(lett ? p.a : 0xA5) : 'errore di indirizzo', esito: ['risponde ' + U.NOMI[d], ok ? 'si' : 'no'] });
      return { passi, esito: d };
    }
  },
  bilancio: {
    regola: [
      'Su un bus condiviso viaggia una transazione per volta. L’arbitro decide quale iniziatore ottiene il turno.',
      'L’indirizzo messo sul bus sceglie, attraverso la mappa degli indirizzi, il componente che risponde. Se nessun intervallo lo contiene, la transazione si chiude con un errore.'
    ],
    errori: [
      ['Pensare che ottenere il bus basti a completare la richiesta.', 'Il turno autorizza a chiedere. La risposta dipende dall’indirizzo.'],
      ['Usare l’indirizzo del bus come numero del registro.', 'Il controller sottrae l’inizio del proprio intervallo: l’indirizzo 0x84 è il suo registro numero 4.'],
      ['Far rispondere due componenti.', 'Gli intervalli della mappa non si sovrappongono, e ogni indirizzo appartiene al più a un componente.']
    ],
    saFare: ['Descrivere le tappe di una transazione.', 'Determinare il componente che risponde a un indirizzo.', 'Riconoscere un errore di indirizzo.'],
    esercizi: [
      { d: 'In una mappa i registri di un controller occupano gli indirizzi da 0x80 a 0x8F. Quale registro del controller, contando da 0, corrisponde all’indirizzo 0x8B?', segnaposto: 'Un numero', giuste: ['11', 'undici', 'b', '0xb', '0x0b'],
        ok: '0x8B − 0x80 = 0x0B, cioè 11.',
        diagnosi: [
          { se: ['139'], msg: 'Questo è l’indirizzo sul bus in base dieci. Va sottratto l’inizio dell’intervallo, 128.' },
          { se: ['8b', '0x8b'], msg: 'Questo è l’indirizzo sul bus. Il numero del registro si conta dall’inizio dell’intervallo.' },
          { se: ['12', 'dodici'], msg: 'Il primo registro è il numero 0, all’indirizzo 0x80.' }
        ],
        altro: 'Il numero è diverso. Si sottragga dall’indirizzo l’inizio dell’intervallo del controller.',
        indizi: ['L’intervallo comincia a 0x80.', '0x8B − 0x80 = 0x0B.', '0x0B vale 11.'],
        svolgimento: ['Indirizzo: 0x8B.', 'Inizio dell’intervallo: 0x80.', 'Registro: 0x0B = 11.'] },
      { d: 'Con la stessa mappa, e la RAM da 0x00 a 0x7F, il processore ottiene il bus e chiede di leggere l’indirizzo 0xA0. Che cosa accade?', guida: 'Si scelga la risposta.', o: [
        { t: 'Nessuno risponde, e la transazione finisce con un errore', ok: true, fb: '0xA0 supera 0x8F, l’ultimo indirizzo assegnato.' },
        { t: 'Risponde il controller', fb: 'L’intervallo del controller termina a 0x8F.' },
        { t: 'L’arbitro nega il turno', fb: 'L’arbitro decide soltanto chi può usare il bus, senza guardare l’indirizzo.' }] },
      { d: 'Due iniziatori chiedono il bus nello stesso istante. Che cosa fa l’arbitro?', guida: 'Si scelga la risposta.', o: [
        { t: 'Concede il turno a uno, e l’altro attende', ok: true, fb: 'Sul bus condiviso può viaggiare una transazione per volta.' },
        { t: 'Li lascia trasmettere insieme', fb: 'Due indirizzi e due dati sugli stessi fili si confonderebbero.' },
        { t: 'Annulla entrambe le richieste', fb: 'Le richieste restano valide. Vengono soltanto messe in ordine.' }] }
    ]
  }
});
