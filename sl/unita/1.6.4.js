'use strict';
SL.registra('1.6.4', {
  titolo: 'Dal formato IEEE al percorso dei dati in virgola mobile',
  obiettivo: 'Obiettivo: sommare due numeri in virgola mobile secondo le fasi eseguite dal processore: allineamento, somma, normalizzazione, arrotondamento.',
  concetti: [['alu', 'Somma'], ['pipeline', 'Tappe'], ['conflitto', 'Arrotondamento']],
  filigrana: ['alu', 'pipeline', 'virgola'],
  richiami: {
    carte: [
      { sim: 'virgola', da: 'Dall’unità 1.6.2', t: 'Significando ed esponente', d: 'Il significando contiene le cifre, con una sola cifra prima della virgola. L’esponente indica di quante posizioni spostare la virgola.' },
      { sim: 'conflitto', da: 'Dall’unità 1.6.3', t: 'Arrotondamento e pareggio al pari', d: 'Un risultato compreso fra due tacche è riportato sulla più vicina. A metà esatta è riportato su quella con l’ultimo bit a 0.' },
      { sim: 'alu', da: 'Dall’unità 1.5.5', t: 'Il sommatore', d: 'Una serie di sommatori completi somma due numeri interi, colonna per colonna.' }
    ],
    domanda: { d: 'Prima di proseguire: il numero binario 1,100 × 2³ quanto vale?', o: [
      { t: '1,5', fb: 'Uno e mezzo è il significando. Va moltiplicato per due alla terza, cioè per 8.' },
      { t: '12', ok: true, fb: 'Il significando vale 1,5 e la potenza vale 8: 1,5 × 8 = 12.' },
      { t: '8', fb: 'Otto è la potenza di due. Va moltiplicata per il significando, che vale 1,5.' }
    ] }
  },
  idea: {
    titolo: 'L’allineamento delle virgole',
    termini: ['allineamento', 'normalizzazione'],
    testo: [
      'La somma di 12,5 e 0,75 richiede che le virgole siano incolonnate: la somma delle cifre nell’ordine in cui si presentano fornirebbe un risultato privo di significato. Lo stesso vale per due numeri in notazione scientifica: prima di sommare i significandi occorre ricondurli al medesimo esponente.',
      'Il processore somma due numeri in virgola mobile in quattro fasi. La prima confronta gli esponenti e fa scorrere verso destra il significando del numero minore, di tante posizioni quanta è la differenza. A ogni posizione il relativo esponente cresce di uno, finché i due coincidono. Tale fase prende il nome di [[allineamento]].',
      'La seconda fase somma i due significandi, come numeri interi. La terza verifica la forma del risultato: se prima della virgola sono comparse due cifre, il significando scorre di una posizione a destra e l’esponente cresce di uno. La riduzione del risultato alla forma con una sola cifra prima della virgola prende il nome di [[normalizzazione]].',
      'La quarta fase è l’arrotondamento. Durante l’allineamento alcune cifre del numero minore sono scorse oltre l’ultima posizione conservata dal formato. Il processore le mantiene fino al termine, le impiega per stabilire se arrotondare per eccesso o per difetto, e infine le scarta.',
      { fig: 'scena', w: 700, h: 76, titolo: 'Le fasi di una somma in virgola mobile', nota: 'Ogni fase è realizzata da un circuito distinto. Nel loro insieme i circuiti formano il percorso attraversato dai dati.', els: [
        SL.el.box('q1', 0, 6, 160, 60, '1', 'allinea', 'on', { cls: 'stretta' }), SL.el.box('q2', 180, 6, 160, 60, '2', 'somma', 'on', { cls: 'stretta' }), SL.el.box('q3', 360, 6, 160, 60, '3', 'normalizza', 'on', { cls: 'stretta' }), SL.el.box('q4', 540, 6, 160, 60, '4', 'arrotonda', 'att', { cls: 'stretta' }),
        SL.el.linea('a', 160, 36, 180, 36, 'on'), SL.el.linea('b', 340, 36, 360, 36, 'on'), SL.el.linea('c', 520, 36, 540, 36, 'on')] },
      'Se la differenza fra gli esponenti supera il numero di cifre conservate, il numero minore scorre per intero oltre l’ultima posizione. La somma restituisce il numero maggiore, immutato. Si tratta del fenomeno dell’unità 1.6.3 osservato nel suo meccanismo: l’aggiunta va perduta durante l’allineamento.',
      'Per ragioni di leggibilità l’esperimento impiega un formato ridotto, con quattro cifre di significando. Il formato a 32 bit ne ha ventiquattro e segue le medesime regole. La presenza di quattro circuiti in serie in luogo di uno solo rende conto anche del maggior tempo richiesto, in un processore, da una somma in virgola mobile rispetto a una somma fra interi.'
    ]
  },
  esperimento: {
    faremo: [
      'Due numeri sono sommati in un formato ridotto, con quattro cifre di significando. Il primo vale sempre 8, cioè 1,000 × 2³. Del secondo si fissano il significando e la differenza fra gli esponenti.',
      'L’esperimento segue le quattro fasi. Vanno osservate le cifre che, durante l’allineamento, escono dalla zona conservata, poiché da esse dipende l’arrotondamento.'
    ],
    vedrai: [
      ['bit', 'Le cifre dei due numeri', 'Due righe, con la virgola nella stessa colonna. A sinistra di ciascuna, l’esponente.'],
      ['lente', 'La zona conservata', 'Le prime quattro colonne. Le colonne più a destra contengono cifre in eccesso, mantenute per l’arrotondamento.'],
      ['alu', 'La somma', 'La terza riga, sotto la linea.']
    ]
  },
  lab: {
    titolo: 'Addizione di due numeri con esponenti diversi',
    scena: { w: 860, h: 348 },
    atti: ['I due numeri', 'L’allineamento', 'La somma', 'Normalizzazione e arrotondamento'],
    nota: 'Il numero di passi dipende dalla differenza fra gli esponenti: ogni posizione di scorrimento è un passo.',
    controlli: [
      { id: 'sb', tipo: 'scelta', eti: 'Significando del secondo numero', opzioni: [[12, '1,100'], [10, '1,010']], valore: 12 },
      { id: 'd', tipo: 'num', eti: 'Differenza fra gli esponenti', min: 0, max: 5, salti: [1], valore: 3 }
    ],
    previsione: {
      domanda: (p) => { const b = (p.sb / 8) * Math.pow(2, 3 - p.d); return 'Si sommano 8 e ' + String(b).replace('.', ',') + ' in un formato con quattro cifre di significando. La somma esatta è ' + String(8 + b).replace('.', ',') + '. Quale numero verrà conservato?'; },
      opzioni: (p) => { const b = (p.sb / 8) * Math.pow(2, 3 - p.d), s = 8 + b, passo = s >= 16 ? 2 : 1, giu = Math.floor(s / passo) * passo; return Array.from(new Set([s, giu, giu + passo, 8])).sort((x, y) => x - y).map((v) => [v, String(v).replace('.', ',')]); }
    },
    confronto: (pred, esito, p) => { const b = (p.sb / 8) * Math.pow(2, 3 - p.d), s = 8 + b, T = (v) => String(v).replace('.', ','); return 'La previsione indicava ' + T(pred) + '. Il valore conservato è ' + T(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : s === esito ? 'La somma esatta è contenuta in quattro cifre, ed è quindi conservata senza arrotondamenti.' : pred === s ? 'La somma esatta, ' + T(s) + ', richiede più di quattro cifre di significando. Il formato deve arrotondarla.' : 'Vanno considerate le cifre in eccesso: oltre la metà si arrotonda per eccesso, sotto la metà per difetto, a metà esatta si sceglie la tacca con l’ultimo bit a 0.'); },
    costruisci(p) {
      const el = SL.el, passi = [];
      const T = (v) => String(v).replace('.', ',');
      // Significandi come interi in 512-esimi: nove cifre dopo la virgola, abbastanza per ogni scorrimento.
      const A = 512;
      let B = p.sb * 64, espB = 3 - p.d, scorsi = 0;
      let somma = null, espR = 3, tenuto = null, fase = '';
      const bitDi = (v) => { const s = v.toString(2).padStart(11, '0'); return s.split('').map(Number); };   // 2 cifre intere + 9 dopo la virgola
      const COL = (j) => 250 + j * 50;
      const riga = (id, y, v, nome, st, o) => {
        const els = [], b = v === null ? null : bitDi(v);
        for (let j = 0; j < 11; j++) {
          if (j === 0 && (b === null || b[0] === 0)) continue;                                    // la cifra di riporto compare soltanto se serve
          const conserva = o.norm ? j <= 3 : j >= 1 && j <= 4;
          if (j > 9) continue;
          els.push(el.cella(id + j, COL(j), y, 44, 44, b === null ? '·' : String(b[j]), b === null ? 'off' : o.att === id ? 'att' : !conserva ? (b[j] ? 'err' : 'off') : b[j] ? 'on' : 'zero', { piccola: true }));
        }
        els.push(el.nota('n' + id, 40, y + 12, nome, 'mono', st));
        return els;
      };
      const quadro = (o) => {
        o = o || {};
        const z = o.norm ? 0 : 1;
        const els = [el.nota('vg', COL(z) + 40, 244, ',  ← la virgola', 'mono', 'att'), el.nota('t1', COL(z), 0, 'CIFRE CONSERVATE', 'mono', 'on'), el.nota('t2', COL(z + 4) + 6, 0, 'CIFRE IN ECCESSO', 'mono'),
          el.linea('sep', COL(z + 4) - 3, 22, COL(z + 4) - 3, 250, 'on', true), el.linea('li', COL(0), 180, COL(9) + 44, 180, 'att')];
        riga('a', 44, A, 'A · × 2^3', '', o).forEach((x) => els.push(x));
        riga('b', 110, B, 'B · × 2^' + espB, o.att === 'b' ? 'att' : '', o).forEach((x) => els.push(x));
        riga('s', 196, somma, 'somma · × 2^' + espR, 'att', o).forEach((x) => els.push(x));
        els.push(el.box('fa', 40, 276, 300, 62, 'fase in corso', fase || '·', 'att', { cls: 'stretta' }));
        els.push(el.box('rs', 370, 276, 460, 62, 'valore conservato', tenuto === null ? '·' : tenuto, tenuto === null ? '' : 'on', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Esponente di A', 3, 'a'], ['Esponente di B', espB], ['Posizioni scorse', scorsi + ' di ' + p.d, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const vB = (p.sb / 8) * Math.pow(2, 3 - p.d), esatta = 8 + vB;

      P({}, 0, 'I due numeri', 'Il primo numero è A = 1,000 × 2³, cioè 8. Il secondo è B = ' + (p.sb === 12 ? '1,100' : '1,010') + ' × 2^' + espB + ', cioè ' + T(vB) + '. ' + (p.d ? 'Le due righe hanno esponenti diversi, e la medesima colonna ha quindi peso diverso nell’una e nell’altra.' : 'Le due righe hanno lo stesso esponente, e le colonne hanno quindi già lo stesso peso.'),
        p.d ? { chiedi: { d: 'L’esponente di A è 3 e quello di B è ' + espB + '. Di quante posizioni deve scorrere a destra il significando di B?', o: [String(Math.max(0, p.d - 1)), String(p.d), String(p.d + 1)], g: 1, no: 'Ogni posizione di scorrimento fa crescere l’esponente di uno. La differenza da colmare è 3 − ' + (espB < 0 ? '(' + espB + ')' : espB) + '.' } } : {});
      fase = 'allineamento';
      if (!p.d) P({ att: 'b' }, 1, 'Nessuno scorrimento', 'Gli esponenti sono già uguali. L’allineamento è superfluo.', { calc: '3 − 3 = 0 posizioni' });
      for (let k = 0; k < p.d; k++) {
        B = B / 2; espB++; scorsi++;
        const fuori = B % 64 !== 0;
        P({ att: 'b' }, 1, 'Scorrimento ' + scorsi + ' di ' + p.d, 'Il significando di B scorre di una posizione a destra e il relativo esponente sale a ' + espB + '. Il valore di B resta invariato.' + (fuori ? ' Alcune sue cifre si trovano ormai oltre la zona conservata.' : ''), { calc: 'B = ' + (B / 512).toString(2).replace('.', ',') + ' × 2^' + espB });
      }
      fase = 'somma';
      somma = A + B;
      P({ att: 's' }, 2, 'La somma dei significandi', 'Le colonne hanno ora lo stesso peso e i due significandi si sommano come interi, colonna per colonna. Il risultato è ' + (somma / 512).toString(2).replace('.', ',') + ' × 2³.', { calc: '1,000 + ' + (B / 512).toString(2).replace('.', ',') + ' = ' + (somma / 512).toString(2).replace('.', ',') });
      fase = 'normalizzazione';
      const riporto = somma >= 1024;
      if (riporto) espR = 4;
      P({ att: 's', norm: riporto }, 3, riporto ? 'Due cifre prima della virgola' : 'Forma già normalizzata', riporto
        ? 'La somma ha due cifre prima della virgola. Per ricondurla alla forma con una sola cifra la virgola si sposta di una posizione a sinistra e l’esponente sale a 4. La zona conservata si sposta di conseguenza.'
        : 'La somma ha una sola cifra prima della virgola, ed è quindi già normalizzata. L’esponente resta 3.', { calc: 'esponente del risultato = ' + espR });
      fase = 'arrotondamento';
      const unita = riporto ? 128 : 64, tenute = Math.floor(somma / unita), resto = somma % unita, meta = unita / 2;
      let finali = tenute, motivo;
      if (resto === 0) motivo = 'Le cifre in eccesso valgono tutte zero. Nessun arrotondamento è necessario.';
      else if (resto > meta) { finali++; motivo = 'Le cifre in eccesso valgono più di metà dell’ultima posizione conservata. Si arrotonda per eccesso.'; }
      else if (resto < meta) motivo = 'Le cifre in eccesso valgono meno di metà dell’ultima posizione conservata. Si arrotonda per difetto, cioè si troncano.';
      else if (tenute % 2) { finali++; motivo = 'Le cifre in eccesso valgono esattamente metà. L’ultima cifra conservata è 1, e il pareggio al pari arrotonda quindi per eccesso, verso la tacca che termina con 0.'; }
      else motivo = 'Le cifre in eccesso valgono esattamente metà. L’ultima cifra conservata è già 0, e il pareggio al pari le tronca.';
      const ris = (finali / 8) * Math.pow(2, espR);
      P({ att: 's', norm: riporto }, 3, 'Le cifre in eccesso', motivo, { calc: 'cifre conservate: ' + (tenute / 8).toString(2).replace('.', ',') + ' · eccesso: ' + (resto === 0 ? 'zero' : resto > meta ? 'più di metà' : resto < meta ? 'meno di metà' : 'metà esatta') });
      tenuto = (finali / 8).toString(2).replace('.', ',') + ' × 2^' + espR + ' = ' + T(ris);
      P({ norm: riporto }, 3, 'Il risultato', 'Il valore conservato è ' + T(ris) + '. La somma esatta era ' + T(esatta) + '. ' + (ris === esatta ? 'I due numeri coincidono: la somma era contenuta nelle quattro cifre.' : ris === 8 ? 'Il secondo numero è andato interamente perduto: tutte le sue cifre sono scorse oltre la zona conservata.' : 'La differenza, ' + T(Math.abs(ris - esatta)) + ', è l’errore di arrotondamento di questa operazione.'), { calc: 'esatta: ' + T(esatta) + ' · conservata: ' + T(ris) });
      return { passi, esito: ris };
    }
  },
  bilancio: {
    regola: [
      'Una somma in virgola mobile comprende quattro fasi: l’allineamento degli esponenti mediante lo scorrimento del numero minore, la somma dei significandi, la normalizzazione, l’arrotondamento.',
      'Le cifre che lo scorrimento porta oltre la precisione determinano l’arrotondamento e sono poi scartate. Se lo scorrimento è eccessivo, il numero minore va perduto.'
    ],
    errori: [
      ['Sommare i significandi senza allineare.', 'Con esponenti diversi le colonne hanno pesi diversi, e la somma delle cifre non ha significato.'],
      ['Far scorrere il numero maggiore.', 'Scorre il minore, verso destra. In tal modo le cifre perdute sono quelle di peso minore.'],
      ['Omettere la normalizzazione.', 'Dopo la somma possono comparire due cifre prima della virgola. Il risultato va ricondotto alla forma con una sola.']
    ],
    saFare: ['Allineare due numeri in virgola mobile allo stesso esponente.', 'Sommare i significandi e normalizzare il risultato.', 'Stabilire l’arrotondamento in base alle cifre in eccesso.'],
    esercizi: [
      { d: 'Per sommare 1,000 × 2⁵ e 1,100 × 2², di quante posizioni deve scorrere a destra il significando del secondo numero?', segnaposto: 'Un numero di posizioni', giuste: ['3', 'tre'],
        ok: 'La differenza fra gli esponenti è 5 − 2 = 3.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Due è l’esponente del secondo numero. Le posizioni sono la differenza fra i due esponenti.' },
          { se: ['7', 'sette'], msg: 'Gli esponenti sono stati sommati. Occorre la loro differenza.' },
          { se: ['5', 'cinque'], msg: 'Cinque è l’esponente del primo numero, cioè quello da raggiungere. Il secondo parte da 2.' }
        ],
        altro: 'Il numero è diverso. Ogni posizione di scorrimento fa salire di uno l’esponente del numero minore.',
        indizi: ['L’esponente da raggiungere è 5.', 'Il secondo numero parte dall’esponente 2.', 'Occorrono 5 − 2 scorrimenti.'],
        svolgimento: ['Esponente del numero maggiore: 5.', 'Esponente del numero minore: 2.', 'Scorrimenti necessari: 5 − 2 = 3.'] },
      { d: 'In un formato con quattro cifre di significando si somma 8 con un numero che, dopo l’allineamento, ha tutte le sue cifre oltre la zona conservata e vale meno di metà dell’ultima posizione. Che cosa restituisce la somma?', guida: 'Si scelga la risposta.', o: [
        { t: '8', ok: true, fb: 'Le cifre in eccesso valgono meno di metà: l’arrotondamento le tronca e resta il primo numero.' },
        { t: '9', fb: 'Per salire alla tacca successiva le cifre in eccesso dovrebbero valere più di metà dell’ultima posizione.' },
        { t: 'Un errore', fb: 'La somma viene eseguita regolarmente. Il risultato è soltanto arrotondato, senza alcuna segnalazione.' }] }
    ],
    sfida: ['lez06_03_normalize_binary', 'Normalizzazione ed esponente con bias']
  }
});
