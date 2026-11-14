'use strict';
SL.registra('0.3', {
  titolo: 'Cifre e posizioni',
  obiettivo: 'Obiettivo: spiegare perché il valore di una cifra dipende dalla posizione che occupa, e scomporre un numero nella somma dei contributi delle sue cifre.',
  concetti: [['puntatore', 'Posizione'], ['bilancio', 'Peso'], ['pila', 'Riporto']],
  filigrana: ['puntatore', 'bilancio', 'pila'],
  richiami: {
    carte: [
      { sim: 'input', da: 'Dall’unità 0.1', t: 'I dati', d: 'Ciò che transita fra le parti del calcolatore prende il nome di dato. Gran parte dei dati è costituita da numeri.' },
      { sim: 'operation', da: 'Dall’unità 0.2', t: 'Esecuzione sequenziale', d: 'Il processore esegue un’istruzione alla volta, e a ogni istruzione una casella può cambiare valore.' }
    ],
    domanda: { d: 'Prima di proseguire: nel numero 507, quanto vale la cifra 5?', o: [
      { t: '5', fb: 'Cinque è la cifra. Poiché occupa il terzo posto da destra, vale cinque centinaia.' },
      { t: '50', fb: 'Varrebbe cinquanta al secondo posto da destra. Qui occupa il terzo, corrispondente alle centinaia.' },
      { t: '500', ok: true, fb: 'La cifra 5 occupa il terzo posto da destra, corrispondente alle centinaia.' }
    ] }
  },
  idea: {
    titolo: 'Notazione posizionale e contatore decimale',
    termini: ['cifra', 'riporto', 'posizione', 'peso'],
    testo: [
      'Si consideri un contatore decimale meccanico, del genere impiegato nei contachilometri. Il contatore è formato da ruote affiancate, su ciascuna delle quali sono riportate le dieci [[cifra|cifre]] da 0 a 9. La ruota più a destra avanza di una cifra a ogni unità contata. Quando ha esaurito le cifre e ritorna a 0, fa avanzare di una cifra la ruota alla propria sinistra. Questo avanzamento indotto prende il nome di [[riporto]].',
      'Ne consegue che il valore di una cifra cresce con la distanza dal margine destro. Un 3 sulla prima ruota da destra indica tre unità. Sulla seconda indica trenta unità, poiché quella ruota avanza di una cifra ogni dieci unità contate. Sulla terza ne indica trecento.',
      'Il posto occupato da una cifra è la sua [[posizione]], che si numera da destra a partire da zero: posizione 0, posizione 1, posizione 2. Il valore che una posizione attribuisce alla cifra che la occupa è il [[peso]]. Nel contatore decimale i pesi sono 1, 10, 100, 1000: a ogni posizione verso sinistra il peso si moltiplica per dieci, quante sono le cifre riportate su ogni ruota.',
      { fig: 'celle', titolo: 'Il numero 352 e i pesi delle sue cifre', nota: 'Ogni cifra è moltiplicata per il peso della propria posizione: 300 + 50 + 2 = 352.', celle: [
        { so: 'peso 100', v: '3', st: 'amb', gi: '300' }, { so: 'peso 10', v: '5', st: 'amb', gi: '50' }, { so: 'peso 1', v: '2', st: 'amb', gi: '2' }] },
      'La lettura di un numero equivale dunque a una somma: ogni cifra è moltiplicata per il peso della propria posizione, e i prodotti sono sommati. Lo zero ha il compito di occupare una posizione priva di contributo. Nel numero 305 mancano le decine; senza lo zero la cifra 3 verrebbe a trovarsi su un peso errato.',
      'Questa regola è alla base dell’intero Modulo I. I calcolatori rappresentano i numeri con il medesimo sistema di pesi, impiegando tuttavia due sole cifre. L’unità si limita alle dieci cifre della notazione ordinaria, osservate sul contatore a ruote.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento fa avanzare un contatore decimale a quattro ruote, una unità alla volta. Ogni passaggio di una ruota da 9 a 0 produce l’avanzamento della ruota adiacente.',
      'Al termine degli avanzamenti il numero raggiunto viene scomposto: una cifra alla volta, moltiplicata per il proprio peso.'
    ],
    vedrai: [
      ['puntatore', 'Le quattro ruote', 'Ciascuna presenta una cifra. Sopra è indicato il peso della posizione.'],
      ['pila', 'Il riporto', 'La ruota che riceve il riporto è evidenziata in ambra.'],
      ['bilancio', 'I prodotti', 'Al termine, sotto ogni ruota compare la cifra moltiplicata per il peso.']
    ]
  },
  lab: {
    titolo: 'Avanzamento delle ruote',
    scena: { w: 860, h: 280 },
    atti: ['Preparazione', 'Avanzamenti', 'Scomposizione', 'Bilancio'],
    nota: 'Il numero di passi dipende dai dati: ogni riporto aggiunge un passo, e ogni cifra diversa da zero ne aggiunge uno nella scomposizione.',
    controlli: [
      { id: 'n', tipo: 'num', eti: 'Numero di partenza', min: 0, max: 9980, salti: [1, 10, 100], pronti: [7, 96, 198, 995], valore: 96 },
      { id: 'k', tipo: 'num', eti: 'Avanzamenti', min: 1, max: 12, salti: [1], valore: 6 }
    ],
    previsione: {
      domanda: (p) => 'Il contatore parte da ' + p.n + ' e avanza di ' + p.k + (p.k === 1 ? ' unità' : ' unità') + '. Quante volte, in totale, una ruota fa avanzare la ruota adiacente?',
      opzioni: () => [0, 1, 2, 3, 4, 5]
    },
    confronto: (pred, esito) => 'La previsione indicava ' + pred + (pred === 1 ? ' riporto' : ' riporti') + '. I riporti sono stati ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Un riporto si verifica ogni volta che una ruota passa da 9 a 0, e può propagarsi a più ruote nel medesimo avanzamento.'),
    costruisci(p) {
      const el = SL.el, passi = [], PESI = [1000, 100, 10, 1];
      let d = String(p.n).padStart(4, '0').split('').map(Number), riporti = 0;
      const val = () => Number(d.join(''));
      const quadro = (att, prod) => {
        const els = [];
        d.forEach((c, j) => els.push(el.cella('w' + j, 190 + j * 125, 60, 106, 120, String(c), att.includes(j) ? 'att' : prod && prod[j] != null ? 'on' : 'zero', { so: 'peso ' + PESI[j], gi: prod && prod[j] != null ? prod[j] : '' })));
        return els;
      };
      const hud = (sc) => [['Avanzamento', sc == null ? '·' : sc + ' di ' + p.k, 'a'], ['Numero', val()], ['Riporti', riporti, 'c']];
      passi.push({ atto: 0, titolo: 'Il contatore indica ' + p.n, hud: hud(null), els: quadro([]),
        testo: 'Le quattro ruote presentano il numero di partenza. Sopra ciascuna è indicato il peso della posizione: da destra, 1, 10, 100 e 1000.' });
      for (let sc = 1; sc <= p.k; sc++) {
        const prima = val(), nove = d[3] === 9;
        d[3] = (d[3] + 1) % 10;
        passi.push({ atto: 1, titolo: 'Avanzamento ' + sc, calc: nove ? 'unità: 9 → 0' : prima + ' + 1 = ' + (prima + 1), hud: hud(sc), els: quadro([3]),
          testo: nove ? 'La ruota delle unità presentava 9, l’ultima delle sue cifre. Con questo avanzamento ritorna a 0 e fa avanzare la ruota adiacente.' : 'La ruota delle unità avanza di una cifra. Le altre ruote restano ferme.',
          chiedi: nove ? { d: 'La ruota delle unità è ritornata a 0. Che cosa accade ora?', o: ['Nulla: l’avanzamento è concluso', 'La ruota delle decine avanza di una cifra', 'Tutte le ruote ritornano a 0'], g: 1, no: 'Una ruota che ritorna a 0 fa avanzare di una cifra la ruota alla propria sinistra, e soltanto quella.' } : null });
        let j = 3;
        while (d[j] === 0 && j > 0 && (j === 3 ? nove : true)) {
          const era9 = d[j - 1] === 9;
          d[j - 1] = (d[j - 1] + 1) % 10; riporti++;
          passi.push({ atto: 1, titolo: 'Riporto sulla ruota di peso ' + PESI[j - 1], calc: 'riporto → peso ' + PESI[j - 1], esito: ['RIPORTO', 'si'], hud: hud(sc), els: quadro([j - 1]),
            testo: 'La ruota di peso ' + PESI[j] + ' è ritornata a 0 e fa avanzare quella di peso ' + PESI[j - 1] + ', che ' + (era9 ? 'presentava 9 e ritorna anch’essa a 0: il riporto prosegue.' : 'avanza di una cifra. Il contatore indica ' + val() + '.') });
          if (!era9) break;
          j--;
        }
      }
      const finale = val(), prod = [null, null, null, null], termini = [];
      d.forEach((c, j) => {
        if (c === 0) return;
        prod[j] = c + ' × ' + PESI[j]; termini.push(c * PESI[j]);
        passi.push({ atto: 2, titolo: 'La cifra ' + c + ' in posizione ' + (3 - j), calc: c + ' × ' + PESI[j] + ' = ' + c * PESI[j], hud: hud(p.k), els: quadro([j], prod.slice()),
          testo: 'La cifra ' + c + ' occupa la posizione ' + (3 - j) + ', che pesa ' + PESI[j] + '. Il suo contributo al numero è ' + c * PESI[j] + '.' });
      });
      passi.push({ atto: 3, titolo: 'La somma dei contributi', calc: (termini.length ? termini.join(' + ') : '0') + ' = ' + finale, hud: hud(p.k), els: quadro([], prod),
        testo: 'La somma dei contributi delle cifre restituisce il numero indicato, ' + finale + '. Le ruote che presentano 0 contribuiscono alla somma con zero, e mantengono le altre cifre nella posizione corretta.' });
      return { passi, esito: riporti };
    }
  },
  bilancio: {
    regola: [
      'La posizione di una cifra si numera da destra a partire da zero. A ogni posizione corrisponde un peso: 1, 10, 100, 1000, con un fattore dieci a ogni posizione verso sinistra.',
      'Il valore di un numero è la somma delle sue cifre, ciascuna moltiplicata per il peso della posizione. Una posizione che ha esaurito le cifre ritorna a 0 e trasmette un riporto alla posizione adiacente.'
    ],
    errori: [
      ['Numerare le posizioni da sinistra.', 'La posizione 0, di peso 1, è la prima da destra.'],
      ['Omettere lo zero che occupa una posizione.', '305 e 35 sono numeri diversi perché lo zero occupa una posizione.'],
      ['Sommare le cifre senza moltiplicarle per i pesi.', 'In 352 la somma 3 + 5 + 2 dà 10; il numero vale 300 + 50 + 2.']
    ],
    saFare: ['Indicare la posizione e il peso di ogni cifra di un numero.', 'Scomporre un numero nella somma dei contributi delle sue cifre.', 'Prevedere quando un avanzamento produce un riporto, e fino a quale posizione esso si propaga.'],
    esercizi: [
      { d: 'Nel numero 4072, quanto vale la cifra 7?', segnaposto: 'Un numero', giuste: ['70'],
        ok: 'La cifra 7 occupa la posizione 1, di peso 10: vale 7 × 10 = 70.',
        diagnosi: [
          { se: ['7'], msg: 'Il valore indicato è la cifra. Il suo valore si ottiene moltiplicandola per il peso della posizione occupata.' },
          { se: ['700'], msg: 'È stato impiegato il peso 100. Numerando le posizioni da destra a partire da zero, la cifra 7 risulta in posizione 1.' },
          { se: ['72'], msg: 'Sono state unite due cifre. La domanda riguarda soltanto la cifra 7 e il peso della sua posizione.' },
          { se: ['1', '10'], msg: 'Il valore indicato è la posizione, oppure il peso. Il valore della cifra è il prodotto fra la cifra e il peso.' }
        ],
        altro: 'Il valore è diverso. Si determini la posizione della cifra 7 contando da destra a partire da zero, poi si moltiplichi per il peso.',
        indizi: ['Da destra, le posizioni di 4072 sono occupate da 2, 7, 0 e 4.', 'La cifra 7 è in posizione 1.', 'La posizione 1 ha peso 10.'],
        svolgimento: ['Le cifre di 4072, da destra, occupano le posizioni 0, 1, 2 e 3.', 'La cifra 7 è in posizione 1, di peso 10.', 'Il suo valore è 7 × 10 = 70.'] },
      { d: 'Un contatore decimale indica 1999. Dopo l’avanzamento di una unità, quante ruote hanno cambiato cifra?', segnaposto: 'Un numero', giuste: ['4'],
        ok: 'Le tre ruote che presentavano 9 ritornano a 0, una dopo l’altra, e l’ultimo riporto porta la quarta da 1 a 2.',
        diagnosi: [
          { se: ['1'], msg: 'La ruota delle unità passa da 9 a 0, e fa quindi avanzare la ruota adiacente. Il riporto va seguito fino alla posizione in cui si arresta.' },
          { se: ['3'], msg: 'Le tre ruote con il 9 ritornano a 0, correttamente. L’ultima di esse fa avanzare anche la quarta, che passa da 1 a 2.' },
          { se: ['2000'], msg: 'Duemila è il numero indicato dopo l’avanzamento. La domanda riguarda il numero di ruote che hanno cambiato cifra.' }
        ],
        altro: 'Il conto è diverso. Si scriva il numero prima e dopo l’avanzamento, e si confrontino le cifre una alla volta.',
        indizi: ['Dopo l’avanzamento il contatore indica 2000.', 'Si confrontino 1999 e 2000 una cifra alla volta.', 'Nessuna delle quattro cifre è rimasta uguale.'],
        svolgimento: ['La ruota delle unità passa da 9 a 0 e fa avanzare quella delle decine.', 'Anche le decine e le centinaia passano da 9 a 0, e il riporto raggiunge le migliaia.', 'Le migliaia passano da 1 a 2: le ruote che hanno cambiato cifra sono quattro.'] }
    ]
  }
});
