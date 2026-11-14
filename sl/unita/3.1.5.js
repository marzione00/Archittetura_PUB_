'use strict';
SL.registra('3.1.5', {
  titolo: 'Tempi, costo e realizzazione fisica',
  obiettivo: 'Obiettivo: individuare il cammino critico di un piccolo circuito, calcolare dopo quanto tempo la sua uscita è affidabile e spiegare perché la velocità di un circuito comporta un costo.',
  concetti: [['clock', 'Ritardi in serie e in parallelo'], ['lente', 'Il cammino critico'], ['bilancio', 'Velocità e superficie']],
  filigrana: ['clock', 'gate', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'clock', da: 'Dall’unità 1.5.4', t: 'Il ritardo di propagazione', d: 'Dopo una variazione degli ingressi, l’uscita di una porta impiega un certo tempo per assestarsi.' },
      { sim: 'alu', da: 'Dall’unità 3.1.3', t: 'I riporti in serie', d: 'Nel sommatore ogni colonna attende il riporto della colonna alla sua destra.' },
      { sim: 'alu', da: 'Dall’unità 3.1.4', t: 'Rami in parallelo', d: 'Nell’ALU i rami calcolano contemporaneamente, e un multiplexer ne raccoglie i risultati.' }
    ],
    domanda: { d: 'Prima di proseguire: un segnale attraversa due porte in serie, la prima con un ritardo di 2 ns e la seconda di 3 ns. Dopo quanto tempo l’uscita è assestata?', o: [
      { t: '5 ns', ok: true, fb: 'La seconda porta opera sul dato corretto soltanto quando la prima ha risposto: i ritardi si sommano.' },
      { t: '3 ns', fb: 'Tre nanosecondi sono il ritardo della sola seconda porta, che deve prima attendere l’uscita della prima.' },
      { t: '2 ns', fb: 'Dopo due nanosecondi è disponibile l’uscita della prima porta. La seconda deve ancora rispondere.' }
    ] }
  },
  idea: {
    titolo: 'Il percorso più lento determina il tempo',
    termini: ['picosecondo', 'cammino critico', 'transistor'],
    testo: [
      'Un circuito combinatorio risponde con un ritardo, come ha mostrato l’unità 1.5.4. Nei circuiti di un processore i ritardi delle porte si misurano in picosecondi. Un [[picosecondo]], abbreviato ps, è un millesimo di nanosecondo.',
      'Quando un segnale attraversa più porte in serie, i ritardi si sommano. Quando due rami operano in parallelo e confluiscono in una porta, quest’ultima deve attendere il più lento dei due prima di fornire un’uscita affidabile. Fra tutti i percorsi che conducono dagli ingressi all’uscita, quello che accumula il ritardo maggiore prende il nome di [[cammino critico]]. Esso stabilisce dopo quanto tempo il risultato del circuito può essere letto.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Due rami in parallelo e una porta comune', nota: 'Il cammino critico attraversa il ramo più lento: 65 + 20 = 85 ps.', els: [
        SL.el.box('a', 150, 6, 190, 56, 'AND', '30 ps', '', { cls: 'stretta' }), SL.el.box('x', 150, 86, 190, 56, 'XOR', '65 ps', 'att', { cls: 'stretta' }),
        SL.el.linea('i1', 40, 34, 150, 34, ''), SL.el.linea('i2', 40, 114, 150, 114, 'att'), SL.el.nota('n0', 10, 62, 'ingressi', 'mono minuta'),
        SL.el.box('o', 450, 42, 130, 64, 'OR', '20 ps', 'att', { cls: 'stretta' }), SL.el.linea('l1', 340, 34, 450, 62, ''), SL.el.linea('l2', 340, 114, 450, 86, 'att'),
        SL.el.linea('u', 580, 74, 640, 74, 'att'), SL.el.nota('n1', 650, 62, 'uscita', 'mono minuta', 'att')
      ] },
      'La regola ha una conseguenza pratica. Ridurre il ritardo di una porta esterna al cammino critico lascia invariato il tempo complessivo. Il medesimo intervento su una porta che vi appartiene riduce il tempo, finché un altro percorso non diviene a sua volta il più lento.',
      'Il sommatore a propagazione di riporto presenta il problema su scala maggiore. Nel caso peggiore un riporto generato nella colonna 0 deve attraversare tutte le celle, una dopo l’altra. Il cammino critico cresce con la larghezza: in un sommatore a 64 bit attraversa 64 celle.',
      'La velocità ha un costo. Ogni porta è composta da [[transistor]], interruttori di dimensioni microscopiche realizzati nel silicio, e ogni transistor occupa superficie e consuma energia. Un circuito più rapido richiede in genere più porte, quindi più superficie e più consumo. La scelta fra circuiti equivalenti dipende dal confronto fra tempo e costo, e l’unità 3.1.6 ne presenta un esempio sul sommatore.'
    ]
  },
  esperimento: {
    faremo: [
      'Due rami, una AND e una XOR, ricevono gli ingressi nel medesimo istante e forniscono i rispettivi risultati a una OR. I controlli fissano i ritardi delle tre porte.',
      'Il tempo è rappresentato su tre barre, che mostrano quando l’uscita diviene affidabile. Dopo il caso proposto, è istruttivo portare il ritardo della AND prima a 50 ps e poi a 90 ps, e confrontare i due esiti.'
    ],
    vedrai: [
      ['clock', 'L’asse del tempo', 'In alto: i picosecondi trascorsi dalla variazione degli ingressi.'],
      ['gate', 'Le tre barre', 'Al centro: una barra per porta, di lunghezza pari al suo ritardo. La barra della OR ha inizio all’arrivo del ramo più lento.'],
      ['bilancio', 'Il conto', 'In basso: gli arrivi dei due rami e il tempo totale.']
    ]
  },
  lab: {
    titolo: 'Quando l’uscita è affidabile',
    scena: { w: 860, h: 310 },
    atti: ['La variazione degli ingressi', 'I due rami', 'La porta comune', 'Il cammino critico'],
    controlli: [
      { id: 'and', tipo: 'scelta', eti: 'Ritardo della AND', opzioni: [[30, '30 ps'], [50, '50 ps'], [90, '90 ps']], valore: 30 },
      { id: 'xor', tipo: 'scelta', eti: 'Ritardo della XOR', opzioni: [[65, '65 ps'], [40, '40 ps']], valore: 65 },
      { id: 'or', tipo: 'scelta', eti: 'Ritardo della OR', opzioni: [[20, '20 ps'], [35, '35 ps']], valore: 20 }
    ],
    nota: 'I passi sono sempre cinque. Le barre hanno lunghezze proporzionali ai ritardi scelti.',
    previsione: {
      domanda: (p) => 'La AND risponde in ' + p.and + ' ps e la XOR in ' + p.xor + ' ps. Le due porte operano in parallelo e forniscono i risultati a una OR, che risponde in ' + p.or + ' ps. Dopo quanti picosecondi dalla variazione degli ingressi l’uscita è affidabile?',
      opzioni: (p) => Array.from(new Set([Math.max(p.and, p.xor) + p.or, Math.min(p.and, p.xor) + p.or, p.and + p.xor + p.or, Math.max(p.and, p.xor)])).sort((a, b) => a - b).map((v) => [v, v + ' ps'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' ps. L’uscita è affidabile dopo ' + esito + ' ps. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.and + p.xor + p.or ? 'I due rami operano contemporaneamente, quindi fra i loro ritardi conta soltanto il maggiore.' : pred === Math.max(p.and, p.xor) ? 'All’arrivo del ramo più lento va aggiunto il ritardo della OR, che opera sui dati corretti soltanto da quell’istante.' : 'La OR deve attendere il ramo più lento, che arriva dopo ' + Math.max(p.and, p.xor) + ' ps.'),
    costruisci(p) {
      const el = SL.el, passi = [], X0 = 150, K = 4.8, lento = Math.max(p.and, p.xor), veloce = Math.min(p.and, p.xor), tot = lento + p.or;
      const NL = p.and > p.xor ? 'AND' : 'XOR', NV = p.and > p.xor ? 'XOR' : 'AND';
      const quadro = (o) => {
        const t = o.t, els = [el.nota('t0', 20, 0, 'TEMPO, IN PS', 'mono')];
        for (let k = 0; k <= 140; k += 20) els.push(el.nota('k' + k, X0 + k * K - (k < 100 ? 8 : 12), 0, String(k), 'mono minuta'));
        els.push(el.nota('la', 20, 50, 'ramo AND', 'mono', o.fine && NL === 'AND' ? 'att' : ''), Object.assign(el.barra('ba', X0, 44, p.and * K, 30, Math.min(1, t / p.and)), o.fine && NL === 'AND' ? { st: 'err' } : null),
          el.nota('lx', 20, 108, 'ramo XOR', 'mono', o.fine && NL === 'XOR' ? 'att' : ''), Object.assign(el.barra('bx', X0, 102, p.xor * K, 30, Math.min(1, t / p.xor)), o.fine && NL === 'XOR' ? { st: 'err' } : null),
          el.nota('lo', 20, 166, 'porta OR', 'mono', o.fine ? 'att' : ''), Object.assign(el.barra('bo', X0 + lento * K, 160, p.or * K, 30, Math.max(0, Math.min(1, (t - lento) / p.or))), o.fine ? { st: 'err' } : null),
          el.linea('ora', X0 + t * K, 28, X0 + t * K, 200, 'att'));
        els.push(el.box('b1', 20, 222, 190, 76, 'arrivo della AND', t >= p.and ? p.and + ' ps' : '·', o.arr === 'AND' ? 'att' : t >= p.and ? 'on' : '', { cls: 'stretta' }),
          el.box('b2', 222, 222, 190, 76, 'arrivo della XOR', t >= p.xor ? p.xor + ' ps' : '·', o.arr === 'XOR' ? 'att' : t >= p.xor ? 'on' : '', { cls: 'stretta' }),
          el.box('b3', 424, 222, 210, 76, 'cammino critico', o.fine ? NL + ' → OR' : '·', o.fine ? 'att' : '', { cls: 'stretta' }),
          el.box('b4', 646, 222, 200, 76, 'uscita affidabile dopo', t >= tot ? tot + ' ps' : '·', t >= tot ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (t, fine) => [['Tempo trascorso', t + ' ps', 'a'], ['Ramo più lento', t >= lento ? NL : '·'], ['Uscita affidabile', t >= tot ? 'dopo ' + tot + ' ps' : 'non ancora', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.t, o.fine), els: quadro(o) }, extra));

      P({ t: 0 }, 0, 'Gli ingressi cambiano', 'Al tempo zero gli ingressi del circuito cambiano valore. La AND e la XOR ricevono i nuovi dati nel medesimo istante e iniziano a rispondere. La AND impiega ' + p.and + ' ps, la XOR ' + p.xor + ' ps.',
        { chiedi: { d: 'Quale dei due rami fornisce per primo il proprio risultato alla OR?', o: ['Il ramo AND', 'Il ramo XOR'], g: p.and < p.xor ? 0 : 1, no: 'Giunge per primo il ramo con il ritardo minore: ' + veloce + ' ps contro ' + lento + ' ps.' } });
      P({ t: veloce, arr: NV }, 1, 'L’arrivo del ramo più rapido', 'Dopo ' + veloce + ' ps il ramo ' + NV + ' ha fornito il nuovo risultato. La OR dispone ora di un ingresso aggiornato e di uno ancora al valore precedente. La sua uscita può cambiare, e resta comunque provvisoria.', { calc: 'ramo ' + NV + ': ' + veloce + ' ps' });
      P({ t: lento, arr: NL }, 1, 'L’arrivo del ramo più lento', 'Dopo ' + lento + ' ps fornisce il proprio risultato anche il ramo ' + NL + '. Soltanto da questo istante la OR dispone di entrambi gli ingressi definitivi e può iniziare il calcolo valido.',
        { calc: 'ramo ' + NL + ': ' + lento + ' ps', chiedi: { d: 'La OR risponde in ' + p.or + ' ps. Dopo quanti picosecondi dalla variazione degli ingressi la sua uscita è affidabile?', o: Array.from(new Set([veloce + p.or, lento + p.or, p.and + p.xor + p.or])).sort((a, b) => a - b).map((v) => v + ' ps'), g: Array.from(new Set([veloce + p.or, lento + p.or, p.and + p.xor + p.or])).sort((a, b) => a - b).indexOf(lento + p.or), no: 'Il ritardo della OR si aggiunge all’arrivo del ramo più lento: ' + lento + ' + ' + p.or + ' = ' + tot + '.' } });
      P({ t: tot }, 2, 'La OR risponde', 'La OR impiega ' + p.or + ' ps a partire dall’arrivo del ramo più lento. L’uscita del circuito è affidabile dopo ' + lento + ' + ' + p.or + ' = ' + tot + ' ps. Una lettura anticipata potrebbe restituire un valore provvisorio.', { calc: lento + ' + ' + p.or + ' = ' + tot + ' ps' });
      P({ t: tot, fine: true }, 3, 'Il cammino critico', 'Il percorso che determina il limite attraversa il ramo ' + NL + ' e la OR. Il ramo ' + NV + ' aveva risposto ' + (lento - veloce) + ' ps prima, e tale margine è andato perduto nell’attesa. Un ritardo minore della porta ' + NV + ' lascerebbe il totale a ' + tot + ' ps. Per ridurlo occorre rendere più rapida la ' + NL + ' oppure la OR.',
        { calc: 'cammino critico: ' + NL + ' → OR, ' + tot + ' ps', esito: [tot + ' ps', 'si'] });
      return { passi, esito: tot };
    }
  },
  bilancio: {
    regola: [
      'I ritardi di porte in serie si sommano, mentre fra rami in parallelo conta il più lento. Il cammino critico è il percorso con il ritardo totale maggiore, e stabilisce quando l’uscita è affidabile.',
      'La riduzione del ritardo di una porta esterna al cammino critico lascia invariato il tempo del circuito. La velocità si ottiene con più transistor, quindi con più superficie e più consumo.'
    ],
    errori: [
      ['Sommare i ritardi di tutti i rami.', 'Due rami in parallelo operano contemporaneamente. Al totale contribuisce soltanto il più lento.'],
      ['Arrestare il calcolo all’arrivo del ramo più lento.', 'La porta che riunisce i rami inizia in quell’istante a operare sui dati definitivi, e il suo ritardo va aggiunto.'],
      ['Ottimizzare una porta esterna al cammino critico.', 'La riduzione del ritardo della AND da 30 a 10 ps, con una XOR da 65 ps sull’altro ramo, lascia il totale invariato.']
    ],
    saFare: ['Sommare i ritardi lungo un percorso e scegliere il maggiore fra rami paralleli.', 'Individuare il cammino critico di un circuito a pochi rami.', 'Spiegare perché il sommatore a propagazione rallenta al crescere della larghezza.'],
    esercizi: [
      { d: 'Una AND da 40 ps e una XOR da 55 ps operano in parallelo e forniscono i risultati a una OR da 25 ps. Dopo quanti picosecondi l’uscita è affidabile?', segnaposto: 'Un numero di picosecondi', giuste: ['80', '80ps'],
        ok: 'Il ramo più lento arriva dopo 55 ps, e la OR aggiunge 25 ps.',
        diagnosi: [
          { se: ['120', '120ps'], msg: 'Sono stati sommati tutti e tre i ritardi. I due rami operano contemporaneamente, e conta soltanto il più lento.' },
          { se: ['65', '65ps'], msg: 'Il ritardo della OR è stato aggiunto al ramo più rapido. La OR deve attendere anche l’altro ramo.' },
          { se: ['55', '55ps'], msg: 'Questo è l’arrivo del ramo più lento. Manca il ritardo della OR.' }
        ],
        altro: 'Il numero è diverso. Si prenda il maggiore fra i ritardi dei due rami e si aggiunga quello della OR.',
        indizi: ['I due rami operano in parallelo.', 'Il più lento arriva dopo 55 ps.', '55 + 25.'],
        svolgimento: ['Arrivi: 40 ps e 55 ps.', 'Il più lento: 55 ps.', 'Uscita affidabile: 55 + 25 = 80 ps.'] },
      { d: 'In un sommatore a propagazione di riporto ogni cella impiega 30 ps per produrre il proprio riporto. Nel caso peggiore, dopo quanti picosecondi è disponibile il riporto finale di un sommatore a 8 bit?', segnaposto: 'Un numero di picosecondi', giuste: ['240', '240ps'],
        ok: 'Nel caso peggiore il riporto attraversa tutte le otto celle, una dopo l’altra: 8 × 30 = 240 ps.',
        diagnosi: [
          { se: ['30', '30ps'], msg: 'Trenta picosecondi sono sufficienti a una sola cella. Nel caso peggiore ciascuna deve attendere il riporto della precedente.' },
          { se: ['210', '210ps'], msg: 'Le celle da attraversare sono otto, dalla colonna 0 alla colonna 7.' },
          { se: ['38', '38ps'], msg: 'Le celle operano in serie, e i loro ritardi si sommano: otto volte 30 ps.' }
        ],
        altro: 'Il numero è diverso. Le celle sono in serie, quindi i loro ritardi si sommano.',
        indizi: ['Il riporto finale esce dall’ottava cella.', 'Nel caso peggiore ogni cella attende la precedente.', '8 × 30.'],
        svolgimento: ['Celle in serie: 8.', 'Ritardo di ciascuna: 30 ps.', 'Cammino critico: 8 × 30 = 240 ps.'] }
    ]
  }
});
