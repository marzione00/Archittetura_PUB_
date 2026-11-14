'use strict';
SL.registra('3.1.5', {
  titolo: 'Tempi, costo e realizzazione fisica',
  obiettivo: 'Obiettivo: trovare il cammino critico di un piccolo circuito e calcolare dopo quanto tempo la sua uscita è affidabile, e saprai dire perché la velocità di un circuito ha un costo.',
  concetti: [['clock', 'Ritardi in fila e in parallelo'], ['lente', 'Il cammino critico'], ['bilancio', 'Velocità contro superficie']],
  filigrana: ['clock', 'gate', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'clock', da: 'Dall’unità 1.5.4', t: 'Il ritardo di propagazione', d: 'Dopo un cambio degli ingressi, l’uscita di una porta impiega un certo tempo per assestarsi.' },
      { sim: 'alu', da: 'Dall’unità 3.1.3', t: 'I riporti in fila', d: 'Nel sommatore ogni colonna attende il riporto della colonna alla sua destra.' },
      { sim: 'alu', da: 'Dall’unità 3.1.4', t: 'Rami in parallelo', d: 'Nell’ALU i rami calcolano insieme, e un multiplexer raccoglie i loro risultati.' }
    ],
    domanda: { d: 'Prima di proseguire: un segnale attraversa due porte in fila, la prima con un ritardo di 2 ns e la seconda di 3 ns. Dopo quanto tempo l’uscita è assestata?', o: [
      { t: '5 ns', ok: true, fb: 'La seconda porta comincia a lavorare sul dato giusto soltanto quando la prima ha finito: i ritardi si sommano.' },
      { t: '3 ns', fb: 'Tre nanosecondi sono il ritardo della sola seconda porta, che deve prima attendere l’uscita della prima.' },
      { t: '2 ns', fb: 'Dopo due nanosecondi è pronta l’uscita della prima porta. La seconda deve ancora rispondere.' }
    ] }
  },
  idea: {
    titolo: 'Il percorso più lento decide',
    termini: ['picosecondo', 'cammino critico', 'transistor'],
    testo: [
      'Un circuito combinatorio risponde con un ritardo, come ha mostrato l’unità 1.5.4. Nei circuiti di un processore i ritardi delle porte sono brevissimi e si misurano in picosecondi. Un [[picosecondo]], abbreviato ps, è un millesimo di nanosecondo.',
      'Quando un segnale attraversa più porte in fila, i ritardi si sommano. Quando due rami lavorano in parallelo e poi confluiscono in una porta, quella porta deve attendere il più lento dei due prima di dare un’uscita affidabile. Fra tutti i percorsi che portano dagli ingressi all’uscita, quello che accumula il ritardo maggiore si chiama [[cammino critico]]. È lui a stabilire dopo quanto tempo il risultato del circuito si può leggere.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Due rami in parallelo e una porta comune', nota: 'Il cammino critico passa dal ramo più lento: 65 + 20 = 85 ps.', els: [
        SL.el.box('a', 150, 6, 190, 56, 'AND', '30 ps', '', { cls: 'stretta' }), SL.el.box('x', 150, 86, 190, 56, 'XOR', '65 ps', 'att', { cls: 'stretta' }),
        SL.el.linea('i1', 40, 34, 150, 34, ''), SL.el.linea('i2', 40, 114, 150, 114, 'att'), SL.el.nota('n0', 10, 62, 'ingressi', 'mono minuta'),
        SL.el.box('o', 450, 42, 130, 64, 'OR', '20 ps', 'att', { cls: 'stretta' }), SL.el.linea('l1', 340, 34, 450, 62, ''), SL.el.linea('l2', 340, 114, 450, 86, 'att'),
        SL.el.linea('u', 580, 74, 640, 74, 'att'), SL.el.nota('n1', 650, 62, 'uscita', 'mono minuta', 'att')
      ] },
      'La regola ha una conseguenza pratica. Rendere più veloce una porta che sta fuori dal cammino critico lascia invariato il tempo complessivo. Accelerarne una che vi appartiene aiuta, finché un altro percorso non diventa a sua volta il più lento.',
      'Il sommatore a propagazione di riporto mostra il problema su scala più grande. Nel caso peggiore un riporto nato nella colonna 0 deve attraversare tutte le celle, una dopo l’altra. Il cammino critico cresce con la larghezza: in un sommatore a 64 bit attraversa 64 celle.',
      'La velocità si paga. Ogni porta è fatta di [[transistor]], minuscoli interruttori incisi nel silicio, e ogni transistor occupa superficie e consuma energia. Un circuito più rapido richiede in genere più porte, quindi più superficie e più consumo. Il progettista sceglie fra circuiti equivalenti pesando tempo e costo, e l’unità 3.1.6 ne mostra un esempio sul sommatore.'
    ]
  },
  esperimento: {
    faremo: [
      'Due rami, una AND e una XOR, ricevono gli ingressi nello stesso istante e consegnano i loro risultati a una OR. Sceglierai i ritardi delle tre porte.',
      'Seguiremo il tempo su tre barre e vedremo quando l’uscita diventa affidabile. Dopo il caso proposto, porta il ritardo della AND a 50 ps: poi portalo a 90 ps e confronta.'
    ],
    vedrai: [
      ['clock', 'L’asse del tempo', 'In alto: i picosecondi trascorsi dal cambio degli ingressi.'],
      ['gate', 'Le tre barre', 'Al centro: una barra per porta, lunga quanto il suo ritardo. La barra della OR parte quando arriva il ramo più lento.'],
      ['bilancio', 'Il conto', 'In basso: gli arrivi dei due rami e il tempo totale.']
    ]
  },
  lab: {
    titolo: 'Quando l’uscita è affidabile',
    scena: { w: 860, h: 310 },
    atti: ['Il cambio degli ingressi', 'I due rami', 'La porta comune', 'Il cammino critico'],
    controlli: [
      { id: 'and', tipo: 'scelta', eti: 'Ritardo della AND', opzioni: [[30, '30 ps'], [50, '50 ps'], [90, '90 ps']], valore: 30 },
      { id: 'xor', tipo: 'scelta', eti: 'Ritardo della XOR', opzioni: [[65, '65 ps'], [40, '40 ps']], valore: 65 },
      { id: 'or', tipo: 'scelta', eti: 'Ritardo della OR', opzioni: [[20, '20 ps'], [35, '35 ps']], valore: 20 }
    ],
    nota: 'I passi sono sempre cinque. Le barre hanno lunghezze proporzionali ai ritardi scelti.',
    previsione: {
      domanda: (p) => 'La AND risponde in ' + p.and + ' ps e la XOR in ' + p.xor + ' ps. Lavorano in parallelo e consegnano a una OR, che risponde in ' + p.or + ' ps. Dopo quanti picosecondi dal cambio degli ingressi l’uscita è affidabile?',
      opzioni: (p) => Array.from(new Set([Math.max(p.and, p.xor) + p.or, Math.min(p.and, p.xor) + p.or, p.and + p.xor + p.or, Math.max(p.and, p.xor)])).sort((a, b) => a - b).map((v) => [v, v + ' ps'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' ps. L’uscita è affidabile dopo ' + esito + ' ps. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.and + p.xor + p.or ? 'I due rami lavorano nello stesso tempo, quindi fra i loro ritardi conta soltanto il maggiore.' : pred === Math.max(p.and, p.xor) ? 'All’arrivo del ramo più lento va aggiunto il ritardo della OR, che comincia a lavorare sui dati giusti soltanto in quel momento.' : 'La OR deve attendere il ramo più lento, che arriva dopo ' + Math.max(p.and, p.xor) + ' ps.'),
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

      P({ t: 0 }, 0, 'Gli ingressi cambiano', 'Al tempo zero gli ingressi del circuito cambiano valore. La AND e la XOR ricevono i nuovi dati nello stesso istante e cominciano a rispondere. La AND impiega ' + p.and + ' ps, la XOR ' + p.xor + ' ps.',
        { chiedi: { d: 'Quale dei due rami consegna per primo il proprio risultato alla OR?', o: ['Il ramo AND', 'Il ramo XOR'], g: p.and < p.xor ? 0 : 1, no: 'Arriva prima il ramo con il ritardo minore: ' + veloce + ' ps contro ' + lento + ' ps.' } });
      P({ t: veloce, arr: NV }, 1, 'Arriva il ramo più rapido', 'Dopo ' + veloce + ' ps il ramo ' + NV + ' ha consegnato il nuovo risultato. La OR ha ora un ingresso aggiornato e l’altro ancora fermo al valore vecchio. La sua uscita può cambiare, e resta comunque provvisoria.', { calc: 'ramo ' + NV + ': ' + veloce + ' ps' });
      P({ t: lento, arr: NL }, 1, 'Arriva il ramo più lento', 'Dopo ' + lento + ' ps consegna anche il ramo ' + NL + '. Soltanto adesso la OR ha davanti entrambi gli ingressi definitivi e può cominciare il calcolo che conta.',
        { calc: 'ramo ' + NL + ': ' + lento + ' ps', chiedi: { d: 'La OR risponde in ' + p.or + ' ps. Dopo quanti picosecondi dal cambio degli ingressi la sua uscita è affidabile?', o: Array.from(new Set([veloce + p.or, lento + p.or, p.and + p.xor + p.or])).sort((a, b) => a - b).map((v) => v + ' ps'), g: Array.from(new Set([veloce + p.or, lento + p.or, p.and + p.xor + p.or])).sort((a, b) => a - b).indexOf(lento + p.or), no: 'Il ritardo della OR si aggiunge all’arrivo del ramo più lento: ' + lento + ' + ' + p.or + ' = ' + tot + '.' } });
      P({ t: tot }, 2, 'La OR risponde', 'La OR impiega ' + p.or + ' ps a partire dall’arrivo del ramo più lento. L’uscita del circuito è affidabile dopo ' + lento + ' + ' + p.or + ' = ' + tot + ' ps. Chi la leggesse prima rischierebbe di trovare un valore provvisorio.', { calc: lento + ' + ' + p.or + ' = ' + tot + ' ps' });
      P({ t: tot, fine: true }, 3, 'Il cammino critico', 'Il percorso che fissa il limite passa dal ramo ' + NL + ' e dalla OR. Il ramo ' + NV + ' aveva finito ' + (lento - veloce) + ' ps prima, e quel margine è andato perduto nell’attesa. Rendere più rapida la porta ' + NV + ' lascerebbe il totale a ' + tot + ' ps. Per scendere bisogna accelerare la ' + NL + ' oppure la OR.',
        { calc: 'cammino critico: ' + NL + ' → OR, ' + tot + ' ps', esito: [tot + ' ps', 'si'] });
      return { passi, esito: tot };
    }
  },
  bilancio: {
    regola: [
      'I ritardi di porte in fila si sommano. Fra rami in parallelo conta il più lento. Il cammino critico è il percorso con il ritardo totale maggiore, e stabilisce quando l’uscita è affidabile.',
      'Accelerare una porta fuori dal cammino critico lascia invariato il tempo del circuito. La velocità si ottiene con più transistor, quindi con più superficie e più consumo.'
    ],
    errori: [
      ['Sommare i ritardi di tutti i rami.', 'Due rami in parallelo lavorano nello stesso tempo. Al totale contribuisce soltanto il più lento.'],
      ['Fermarsi all’arrivo del ramo più lento.', 'La porta che riunisce i rami comincia in quel momento il proprio lavoro, e il suo ritardo va aggiunto.'],
      ['Ottimizzare la porta sbagliata.', 'Portare la AND da 30 a 10 ps, con una XOR da 65 ps sull’altro ramo, lascia il totale dov’era.']
    ],
    saFare: ['Sommare i ritardi lungo un percorso e scelgo il maggiore fra rami paralleli.', 'Individuare il cammino critico di un circuito a pochi rami.', 'Spiegare perché il sommatore a propagazione rallenta con la larghezza.'],
    esercizi: [
      { d: 'Una AND da 40 ps e una XOR da 55 ps lavorano in parallelo e consegnano a una OR da 25 ps. Dopo quanti picosecondi l’uscita è affidabile?', segnaposto: 'Un numero di picosecondi', giuste: ['80', '80ps'],
        ok: 'Il ramo più lento arriva dopo 55 ps, e la OR aggiunge 25 ps.',
        diagnosi: [
          { se: ['120', '120ps'], msg: 'Hai sommato tutti e tre i ritardi. I due rami lavorano nello stesso tempo, e conta soltanto il più lento.' },
          { se: ['65', '65ps'], msg: 'Hai aggiunto la OR al ramo più rapido. La OR deve attendere anche l’altro ramo.' },
          { se: ['55', '55ps'], msg: 'Questo è l’arrivo del ramo più lento. Manca il ritardo della OR.' }
        ],
        altro: 'Il numero è diverso. Si prenda il maggiore fra i ritardi dei due rami e si aggiunga quello della OR.',
        indizi: ['I due rami lavorano in parallelo.', 'Il più lento arriva dopo 55 ps.', '55 + 25.'],
        svolgimento: ['Arrivi: 40 ps e 55 ps.', 'Il più lento: 55 ps.', 'Uscita affidabile: 55 + 25 = 80 ps.'] },
      { d: 'In un sommatore a propagazione di riporto ogni cella impiega 30 ps per produrre il proprio riporto. Nel caso peggiore, dopo quanti picosecondi è pronto il riporto finale di un sommatore a 8 bit?', segnaposto: 'Un numero di picosecondi', giuste: ['240', '240ps'],
        ok: 'Nel caso peggiore il riporto attraversa tutte le otto celle, una dopo l’altra: 8 × 30 = 240 ps.',
        diagnosi: [
          { se: ['30', '30ps'], msg: 'Trenta picosecondi bastano a una cella sola. Nel caso peggiore ciascuna deve attendere il riporto della precedente.' },
          { se: ['210', '210ps'], msg: 'Le celle da attraversare sono otto, dalla colonna 0 alla colonna 7.' },
          { se: ['38', '38ps'], msg: 'Le celle lavorano in fila, e i loro ritardi si sommano: otto volte 30 ps.' }
        ],
        altro: 'Il numero è diverso. Le celle sono in fila, quindi i loro ritardi si sommano.',
        indizi: ['Il riporto finale esce dall’ottava cella.', 'Nel caso peggiore ogni cella attende la precedente.', '8 × 30.'],
        svolgimento: ['Celle in fila: 8.', 'Ritardo di ciascuna: 30 ps.', 'Cammino critico: 8 × 30 = 240 ps.'] }
    ]
  }
});
