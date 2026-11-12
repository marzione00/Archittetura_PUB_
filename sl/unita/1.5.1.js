'use strict';
SL.registra('1.5.1', {
  titolo: 'Funzioni booleane e porte elementari',
  obiettivo: 'Alla fine saprai dire che cosa calcolano le porte AND, OR, NOT e XOR, compilare la tabella di verità di una porta e seguire un segnale attraverso due porte in cascata.',
  concetti: [['porta', 'Porta logica'], ['tabella', 'Tabella di verità'], ['bit', 'Bit']],
  filigrana: ['porta', 'tabella', 'bit'],
  richiami: {
    carte: [
      { sim: 'bit', da: 'Dall’unità 1.2.1', t: 'Il bit', d: 'Un’informazione con due soli valori, 0 e 1. In un circuito è una tensione bassa oppure alta su un filo.' },
      { sim: 'bit', da: 'Dall’unità 1.2.1', t: 'Le combinazioni', d: 'Con due bit le combinazioni sono quattro: 00, 01, 10 e 11. Ogni bit aggiunto le raddoppia.' },
      { sim: 'cpu', da: 'Dall’unità 0.1', t: 'Il processore', d: 'È la parte del calcolatore che esegue le operazioni. In questo capitolo guardiamo di che cosa è fatto.' }
    ],
    domanda: { d: 'Prima di proseguire: quante combinazioni diverse possono assumere tre bit?', o: [
      { t: '6', fb: 'Le combinazioni si raddoppiano a ogni bit: 2, 4, 8. Sei sarebbe il risultato di una somma.' },
      { t: '8', ok: true, fb: 'Due per due per due: da 000 a 111.' },
      { t: '3', fb: 'Tre è il numero dei bit. Ciascuno raddoppia le combinazioni del gruppo.' }
    ] }
  },
  idea: {
    titolo: 'Tre mattoni per ogni decisione',
    termini: ['funzione booleana', 'and', 'or', 'not', 'porta logica', 'xor', 'tabella di verità'],
    testo: [
      'Un bit può rappresentare una decisione: 1 per «sì», 0 per «no». Un calcolatore prende decisioni combinandone altre. Il tornello si apre se il biglietto è valido e il passaggio è libero. L’allarme suona se si apre la porta oppure si rompe un vetro. Una regola che riceve alcuni bit e ne restituisce uno si chiama [[funzione booleana]].',
      'Le funzioni elementari sono tre. La [[and|AND]] restituisce 1 soltanto quando entrambi gli ingressi valgono 1: è la «e» del tornello. La [[or|OR]] restituisce 1 quando almeno un ingresso vale 1: è l’«oppure» dell’allarme. La [[not|NOT]] ha un solo ingresso e lo rovescia: da 1 fa 0, da 0 fa 1.',
      'Il circuito che calcola una di queste funzioni si chiama [[porta logica]]. È fatto di pochi interruttori elettronici. Riceve i bit come tensioni sui fili di ingresso, secondo le fasce dell’unità 1.2.1, e produce una tensione sul filo di uscita.',
      'Altre porte molto usate si ottengono dalle prime tre. La [[xor|XOR]] restituisce 1 quando i due ingressi sono diversi: uno dei due, e uno soltanto. La NAND è una AND seguita da una NOT, e la NOR è una OR seguita da una NOT.',
      'Per descrivere una funzione senza ambiguità si elencano tutte le combinazioni degli ingressi, ciascuna con l’uscita corrispondente. L’elenco si chiama [[tabella di verità]]. Con due ingressi le righe sono quattro e si scrivono nell’ordine dei numeri binari: 00, 01, 10, 11.',
      { fig: 'celle', titolo: 'La tabella di verità della porta AND', nota: 'Sopra ogni casella i due ingressi, dentro l’uscita. La AND vale 1 in una riga sola.', celle: [
        { so: 'A=0 B=0', v: '0' }, { so: 'A=0 B=1', v: '0' }, { so: 'A=1 B=0', v: '0' }, { so: 'A=1 B=1', v: '1', st: 'on' }] },
      'Le porte si collegano fra loro: l’uscita di una diventa l’ingresso di un’altra. Per sapere che cosa esce da una catena si procede nell’ordine in cui scorre il segnale, risolvendo una porta alla volta e annotando ogni valore intermedio.'
    ]
  },
  esperimento: {
    faremo: [
      'Sceglierai una porta e compileremo la sua tabella di verità, una riga alla volta. Per ogni riga applicheremo gli ingressi e guarderemo che cosa esce.',
      'Poi potrai aggiungere una seconda porta, che riceve l’uscita della prima e un terzo ingresso. Le righe diventano otto e ogni riga richiede due mosse: prima il valore intermedio, poi l’uscita.'
    ],
    vedrai: [
      ['porta', 'Il circuito', 'A sinistra: gli ingressi, le porte e l’uscita. Un filo che porta 1 è acceso.'],
      ['tabella', 'La tabella', 'A destra: una riga per ogni combinazione degli ingressi, compilata man mano.'],
      ['bit', 'Il valore intermedio', 'Con due porte, il filo M porta l’uscita della prima all’ingresso della seconda.']
    ]
  },
  lab: {
    titolo: 'Compilare una tabella di verità',
    scena: { w: 860, h: 312 },
    atti: ['Il circuito', 'Le righe della tabella', 'Il conteggio'],
    nota: 'Con una porta le righe sono quattro. Con due porte in cascata gli ingressi sono tre e le righe diventano otto.',
    controlli: [
      { id: 'g1', tipo: 'scelta', eti: 'Prima porta', opzioni: ['AND', 'OR', 'XOR', 'NAND', 'NOR'], valore: 'XOR' },
      { id: 'g2', tipo: 'scelta', eti: 'Seconda porta', opzioni: [['no', 'Nessuna'], ['AND', 'AND'], ['OR', 'OR'], ['XOR', 'XOR']], valore: 'no' }
    ],
    previsione: {
      domanda: (p) => (p.g2 === 'no' ? 'Compileremo la tabella della porta ' + p.g1 + ', che ha quattro righe.' : 'Il circuito ha una porta ' + p.g1 + ' seguita da una porta ' + p.g2 + ', e la tabella ha otto righe.') + ' In quante righe l’uscita varrà 1?',
      opzioni: (p) => { const G = { AND: (a, b) => a & b, OR: (a, b) => a | b, XOR: (a, b) => a ^ b, NAND: (a, b) => 1 - (a & b), NOR: (a, b) => 1 - (a | b) }; if (p.g2 === 'no') return [0, 1, 2, 3, 4]; let n = 0; for (let r = 0; r < 8; r++) n += G[p.g2](G[p.g1]((r >> 2) & 1, (r >> 1) & 1), r & 1); return [0, 1, 2, 3, 4, 5, 6, 7, 8].filter((k) => Math.abs(k - n) <= 2 || k === 4); }
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + pred + (pred === 1 ? ' riga' : ' righe') + ' con uscita 1. Sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.g2 === 'no' ? 'Ripassa la regola della porta ' + p.g1 + ' e applicala alle quattro combinazioni.' : 'Con due porte conviene risolvere prima il valore intermedio M, riga per riga, e poi la seconda porta.'),
    costruisci(p) {
      const el = SL.el, passi = [];
      const G = { AND: (a, b) => a & b, OR: (a, b) => a | b, XOR: (a, b) => a ^ b, NAND: (a, b) => 1 - (a & b), NOR: (a, b) => 1 - (a | b) };
      const REGOLA = { AND: 'vale 1 soltanto quando entrambi gli ingressi valgono 1', OR: 'vale 1 quando almeno un ingresso vale 1', XOR: 'vale 1 quando i due ingressi sono diversi', NAND: 'vale 0 soltanto quando entrambi gli ingressi valgono 1', NOR: 'vale 1 soltanto quando entrambi gli ingressi valgono 0' };
      const due = p.g2 !== 'no', N = due ? 8 : 4;
      const riga = (r) => { const a = due ? (r >> 2) & 1 : (r >> 1) & 1, b = due ? (r >> 1) & 1 : r & 1, c = r & 1, m = G[p.g1](a, b); return { a, b, c, m, y: due ? G[p.g2](m, c) : m }; };
      const tab = Array.from({ length: N }, () => ({ m: null, y: null }));
      const COL = due ? ['A', 'B', 'C', 'M', 'Y'] : ['A', 'B', 'Y'];
      const quadro = (o) => {
        o = o || {};
        const v = o.r == null ? null : riga(o.r), acc = (x) => (x ? 'on' : '');
        const els = [
          el.box('ia', 40, 30, 84, 48, 'A', v ? String(v.a) : '·', v ? (v.a ? 'on' : 'zero') : '', { cls: 'stretta' }),
          el.box('ib', 40, 100, 84, 48, 'B', v ? String(v.b) : '·', v ? (v.b ? 'on' : 'zero') : '', { cls: 'stretta' }),
          el.box('g1', 200, 52, 140, 66, 'porta 1', p.g1, o.porta === 1 ? 'att' : '', { sim: 'porta', riga: true }),
          el.linea('la', 124, 54, 200, 72, v && v.a ? 'on' : ''), el.linea('lb', 124, 124, 200, 98, v && v.b ? 'on' : '')
        ];
        if (!due) {
          els.push(el.box('y', 420, 60, 96, 50, 'Y', o.y != null ? String(o.y) : '·', o.y != null ? (o.y ? 'on' : 'zero') : '', { cls: 'stretta' }), el.linea('ly', 340, 85, 420, 85, o.y ? 'on' : ''));
        } else {
          els.push(el.box('ic', 40, 222, 84, 48, 'C', v ? String(v.c) : '·', v ? (v.c ? 'on' : 'zero') : '', { cls: 'stretta' }),
            el.box('g2', 380, 160, 140, 66, 'porta 2', p.g2, o.porta === 2 ? 'att' : '', { sim: 'porta', riga: true }),
            el.linea('lm', 340, 85, 380, 178, o.m ? 'on' : ''), el.linea('lc', 124, 246, 380, 208, v && v.c ? 'on' : ''),
            el.nota('nm', 352, 96, 'M = ' + (o.m != null ? o.m : '·'), 'mono', o.m ? 'on' : ''),
            el.box('y', 550, 168, 76, 50, 'Y', o.y != null ? String(o.y) : '·', o.y != null ? (o.y ? 'on' : 'zero') : '', { cls: 'stretta' }), el.linea('ly', 520, 193, 550, 193, o.y ? 'on' : ''));
        }
        const x0 = due ? 652 : 700;
        for (let r = 0; r < N; r++) {
          const q = riga(r), val = due ? [q.a, q.b, q.c, tab[r].m, tab[r].y] : [q.a, q.b, tab[r].y];
          val.forEach((x, c) => els.push(el.cella('t' + r + '-' + c, x0 + c * 40, 30 + r * 33, 34, 27, x === null ? '' : String(x), o.r === r ? 'att' : x === null ? 'off' : (c >= COL.length - (due ? 2 : 1) ? acc(x) || 'zero' : 'zero'), { cls: 'minuta', so: r === 0 ? COL[c] : null })));
        }
        return els;
      };
      const fatte = () => tab.filter((t) => t.y !== null).length;
      const hud = (r) => [['Riga', r == null ? '·' : (r + 1) + ' di ' + N, 'a'], ['Righe compilate', fatte()], ['Uscite a 1', tab.filter((t) => t.y === 1).length, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.r), els: quadro(o) }, extra));
      const domanda = (r) => { const q = riga(r); return due
        ? { d: 'Nella prossima riga A vale ' + q.a + ' e B vale ' + q.b + '. Quanto vale M, l’uscita della porta ' + p.g1 + '?', o: ['0', '1'], g: q.m, no: 'La porta ' + p.g1 + ' ' + REGOLA[p.g1] + '.' }
        : { d: 'Nella prossima riga A vale ' + q.a + ' e B vale ' + q.b + '. Che cosa esce dalla porta ' + p.g1 + '?', o: ['0', '1'], g: q.y, no: 'La porta ' + p.g1 + ' ' + REGOLA[p.g1] + '.' }; };

      P({}, 0, 'Il circuito e la tabella vuota', (due
        ? 'Il circuito ha tre ingressi. La porta ' + p.g1 + ' riceve A e B e produce il valore intermedio M. La porta ' + p.g2 + ' riceve M e C e produce l’uscita Y. Le combinazioni di tre ingressi sono otto.'
        : 'La porta ' + p.g1 + ' ha due ingressi, A e B, e un’uscita, Y. Le combinazioni degli ingressi sono quattro, e la tabella ha una riga per ciascuna.'), { chiedi: domanda(0) });
      for (let r = 0; r < N; r++) {
        const q = riga(r);
        if (due) {
          tab[r].m = q.m;
          P({ r, porta: 1, m: q.m }, 1, 'Riga ' + (r + 1) + ': il valore intermedio', 'Gli ingressi valgono A = ' + q.a + ', B = ' + q.b + ', C = ' + q.c + '. La porta ' + p.g1 + ' ' + REGOLA[p.g1] + ': con ' + q.a + ' e ' + q.b + ' produce M = ' + q.m + '.', { calc: q.a + ' ' + p.g1 + ' ' + q.b + ' = ' + q.m });
          tab[r].y = q.y;
          P({ r, porta: 2, m: q.m, y: q.y }, 1, 'Riga ' + (r + 1) + ': l’uscita', 'La porta ' + p.g2 + ' riceve M = ' + q.m + ' e C = ' + q.c + ', e produce Y = ' + q.y + '. La riga è completa.', Object.assign({ calc: q.m + ' ' + p.g2 + ' ' + q.c + ' = ' + q.y }, r === 0 || r === 4 ? { chiedi: domanda(r + 1) } : {}));
        } else {
          P({ r }, 1, 'Riga ' + (r + 1) + ': gli ingressi', 'Applichiamo la combinazione ' + q.a + q.b + ': A vale ' + q.a + ' e B vale ' + q.b + '. ' + (q.a || q.b ? 'I fili che portano 1 si accendono.' : 'Entrambi i fili restano spenti.'), { calc: 'A = ' + q.a + ', B = ' + q.b });
          tab[r].y = q.y;
          P({ r, porta: 1, y: q.y }, 1, 'Riga ' + (r + 1) + ': l’uscita', 'La porta ' + p.g1 + ' ' + REGOLA[p.g1] + '. Con ' + q.a + ' e ' + q.b + ' l’uscita è ' + q.y + '.', Object.assign({ calc: q.a + ' ' + p.g1 + ' ' + q.b + ' = ' + q.y }, r === 0 || r === 1 ? { chiedi: domanda(r + 1) } : {}));
        }
      }
      const uni = tab.filter((t) => t.y === 1).length;
      P({}, 2, 'La tabella è completa', 'Le righe con uscita 1 sono ' + uni + ' su ' + N + '. ' + (due ? 'Ogni riga è stata risolta in due mosse, seguendo il verso del segnale: prima la porta ' + p.g1 + ', poi la porta ' + p.g2 + '.' : 'La tabella conferma la regola: la porta ' + p.g1 + ' ' + REGOLA[p.g1] + '.'), { calc: 'uscite a 1: ' + uni + ' su ' + N });
      return { passi, esito: uni };
    }
  },
  bilancio: {
    regola: [
      'La AND vale 1 quando entrambi gli ingressi valgono 1, la OR quando almeno uno vale 1, la XOR quando sono diversi. La NOT rovescia il suo ingresso.',
      'La tabella di verità elenca l’uscita per ogni combinazione degli ingressi. In una cascata si risolve una porta alla volta, nell’ordine in cui scorre il segnale.'
    ],
    errori: [
      ['Confondere OR e XOR.', 'Con entrambi gli ingressi a 1 la OR dà 1 e la XOR dà 0.'],
      ['Saltare il valore intermedio.', 'In una cascata l’uscita della prima porta va calcolata e annotata prima di affrontare la seconda.'],
      ['Dimenticare righe della tabella.', 'Con n ingressi le righe sono 2 moltiplicato per se stesso n volte, e vanno elencate tutte.']
    ],
    saFare: ['Dico l’uscita di AND, OR, NOT e XOR per ogni combinazione.', 'Compilo la tabella di verità di una porta.', 'Seguo un segnale attraverso due porte in cascata.'],
    esercizi: [
      { d: 'Una porta ha questa tabella di verità: con ingressi 00 esce 0, con 01 esce 1, con 10 esce 1, con 11 esce 0. Quale porta è?', guida: 'Scegli la risposta.', o: [
        { t: 'OR', fb: 'La OR dà 1 anche con entrambi gli ingressi a 1. Qui l’ultima riga vale 0.' },
        { t: 'XOR', ok: true, fb: 'L’uscita vale 1 esattamente nelle due righe in cui gli ingressi sono diversi.' },
        { t: 'NAND', fb: 'La NAND dà 1 anche nella riga 00. Qui la prima riga vale 0.' }] },
      { d: 'I due ingressi di una porta NAND valgono entrambi 1. Quanto vale l’uscita?', segnaposto: '0 oppure 1', giuste: ['0'],
        ok: 'La AND di 1 e 1 dà 1, e la NOT che la segue lo rovescia in 0.',
        diagnosi: [{ se: ['1'], msg: 'Quello è il risultato della AND. La NAND aggiunge una NOT in uscita.' }],
        altro: 'L’uscita di una porta è un bit: 0 oppure 1.',
        indizi: ['Una NAND è una AND seguita da una NOT.', 'La AND di 1 e 1 vale 1.', 'La NOT trasforma 1 in 0.'],
        svolgimento: ['Prima porta, AND: 1 e 1 danno 1.', 'Seconda porta, NOT: 1 diventa 0.', 'L’uscita della NAND è 0.'] }
    ],
    sfida: ['lez05_01_single_gate', 'Calcolare l’uscita delle porte']
  }
});
