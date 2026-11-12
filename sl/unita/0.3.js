'use strict';
SL.registra('0.3', {
  titolo: 'Cifre e posti',
  obiettivo: 'Alla fine saprai spiegare perché la stessa cifra vale di più quando si sposta verso sinistra e scomporre un numero nei suoi pesi.',
  concetti: [['puntatore', 'Posizione'], ['bilancio', 'Peso'], ['pila', 'Riporto']],
  filigrana: ['puntatore', 'bilancio', 'pila'],
  richiami: {
    carte: [
      { sim: 'input', da: 'Dall’unità 0.1', t: 'I dati', d: 'Ciò che viaggia fra le parti del calcolatore si chiama dato. Moltissimi dati sono numeri.' },
      { sim: 'operation', da: 'Dall’unità 0.2', t: 'Un passo alla volta', d: 'Il processore esegue un’istruzione per volta, e a ogni istruzione una casella può cambiare valore.' }
    ],
    domanda: { d: 'Prima di proseguire: nel numero 507, quanto vale la cifra 5?', o: [
      { t: '5', fb: 'Cinque è la cifra. Trovandosi al terzo posto da destra, vale cinque centinaia.' },
      { t: '50', fb: 'Varrebbe cinquanta al secondo posto da destra. Qui occupa il terzo, quello delle centinaia.' },
      { t: '500', ok: true, fb: 'La cifra 5 occupa il terzo posto da destra, quello delle centinaia.' }
    ] }
  },
  idea: {
    titolo: 'Il contachilometri',
    termini: ['cifra', 'riporto', 'posizione', 'peso'],
    testo: [
      'Pensa al contachilometri meccanico di una vecchia automobile. È fatto di rotelle affiancate, e su ciascuna sono stampate le dieci [[cifra|cifre]] da 0 a 9. La rotella più a destra avanza di uno scatto a ogni chilometro. Quando ha mostrato tutte le sue cifre e torna a 0, trascina di uno scatto la rotella alla sua sinistra. Questo trascinamento si chiama [[riporto]].',
      'Per questa ragione la stessa cifra vale di più quanto più si trova a sinistra. Un 3 sulla prima rotella da destra indica tre chilometri. Sulla seconda indica trenta chilometri, perché quella rotella avanza di uno scatto ogni dieci. Sulla terza indica trecento.',
      'Il posto occupato da una cifra si chiama [[posizione]], e conviene contarlo da destra partendo da zero: posizione 0, posizione 1, posizione 2. Il valore che una posizione attribuisce alla cifra che la occupa si chiama [[peso]]. Nel contachilometri i pesi sono 1, 10, 100, 1000: a ogni passo verso sinistra il peso si moltiplica per dieci, perché dieci sono le cifre stampate su ogni rotella.',
      { fig: 'celle', titolo: 'Il numero 352 e i pesi delle sue cifre', nota: 'Ogni cifra viene moltiplicata per il peso della sua posizione: 300 + 50 + 2 = 352.', celle: [
        { so: 'peso 100', v: '3', st: 'amb', gi: '300' }, { so: 'peso 10', v: '5', st: 'amb', gi: '50' }, { so: 'peso 1', v: '2', st: 'amb', gi: '2' }] },
      'Leggere un numero significa allora fare una somma. Ogni cifra viene moltiplicata per il peso della sua posizione, e i prodotti si sommano. Lo zero ha un compito prezioso, che è tenere occupata una posizione vuota. Nel numero 305 mancano le decine, e senza lo zero il 3 scivolerebbe sul peso sbagliato.',
      'Questa regola, che a scuola si impara senza farci caso, è la chiave di tutto il Modulo I. I calcolatori scrivono i numeri con gli stessi pesi, usando però due cifre soltanto. Per ora restiamo sulle dieci cifre di sempre e guardiamo le rotelle girare.'
    ]
  },
  esperimento: {
    faremo: [
      'Faremo avanzare un contachilometri a quattro rotelle, uno scatto alla volta. Ogni volta che una rotella passa da 9 a 0 la vedremo trascinare la vicina.',
      'Finiti gli scatti, scomporremo il numero raggiunto: una cifra per volta, moltiplicata per il suo peso.'
    ],
    vedrai: [
      ['puntatore', 'Le quattro rotelle', 'Ciascuna mostra una cifra. Sopra è scritto il peso della sua posizione.'],
      ['pila', 'Il riporto', 'La rotella che riceve il trascinamento si accende in ambra.'],
      ['bilancio', 'I prodotti', 'Alla fine, sotto ogni rotella compare la cifra moltiplicata per il peso.']
    ]
  },
  lab: {
    titolo: 'Le rotelle che girano',
    scena: { w: 860, h: 280 },
    atti: ['Preparazione', 'Gli scatti', 'La scomposizione', 'Bilancio'],
    nota: 'Il numero di passi dipende dai dati: ogni riporto aggiunge un passo, e ogni cifra diversa da zero ne aggiunge uno nella scomposizione.',
    controlli: [
      { id: 'n', tipo: 'num', eti: 'Numero di partenza', min: 0, max: 9980, salti: [1, 10, 100], pronti: [7, 96, 198, 995], valore: 96 },
      { id: 'k', tipo: 'num', eti: 'Scatti', min: 1, max: 12, salti: [1], valore: 6 }
    ],
    previsione: {
      domanda: (p) => 'Il contachilometri parte da ' + p.n + ' e avanza di ' + p.k + (p.k === 1 ? ' scatto' : ' scatti') + '. Quante volte, in tutto, una rotella trascinerà la sua vicina?',
      opzioni: () => [0, 1, 2, 3, 4, 5]
    },
    confronto: (pred, esito) => 'Avevi previsto ' + pred + (pred === 1 ? ' riporto' : ' riporti') + '. I riporti sono stati ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Un riporto avviene ogni volta che una rotella passa da 9 a 0, e può propagarsi a più rotelle nello stesso scatto.'),
    costruisci(p) {
      const el = SL.el, passi = [], PESI = [1000, 100, 10, 1];
      let d = String(p.n).padStart(4, '0').split('').map(Number), riporti = 0;
      const val = () => Number(d.join(''));
      const quadro = (att, prod) => {
        const els = [];
        d.forEach((c, j) => els.push(el.cella('w' + j, 190 + j * 125, 60, 106, 120, String(c), att.includes(j) ? 'att' : prod && prod[j] != null ? 'on' : 'zero', { so: 'peso ' + PESI[j], gi: prod && prod[j] != null ? prod[j] : '' })));
        return els;
      };
      const hud = (sc) => [['Scatto', sc == null ? '·' : sc + ' di ' + p.k, 'a'], ['Numero', val()], ['Riporti', riporti, 'c']];
      passi.push({ atto: 0, titolo: 'Il contachilometri segna ' + p.n, hud: hud(null), els: quadro([]),
        testo: 'Le quattro rotelle mostrano il numero di partenza. Sopra ciascuna è scritto il peso della sua posizione: da destra, 1, 10, 100 e 1000.' });
      for (let sc = 1; sc <= p.k; sc++) {
        const prima = val(), nove = d[3] === 9;
        d[3] = (d[3] + 1) % 10;
        passi.push({ atto: 1, titolo: 'Scatto ' + sc, calc: nove ? 'unità: 9 → 0' : prima + ' + 1 = ' + (prima + 1), hud: hud(sc), els: quadro([3]),
          testo: nove ? 'La rotella delle unità mostrava 9, l’ultima delle sue cifre. Con questo scatto torna a 0 e deve trascinare la rotella vicina.' : 'La rotella delle unità avanza di una cifra. Le altre rotelle restano ferme.',
          chiedi: nove ? { d: 'La rotella delle unità è tornata a 0. Che cosa accade ora?', o: ['Nient’altro: lo scatto è finito', 'La rotella delle decine avanza di uno', 'Tutte le rotelle tornano a 0'], g: 1, no: 'Una rotella che torna a 0 trascina di uno scatto la rotella alla sua sinistra, e soltanto quella.' } : null });
        let j = 3;
        while (d[j] === 0 && j > 0 && (j === 3 ? nove : true)) {
          const era9 = d[j - 1] === 9;
          d[j - 1] = (d[j - 1] + 1) % 10; riporti++;
          passi.push({ atto: 1, titolo: 'Riporto sulla rotella di peso ' + PESI[j - 1], calc: 'riporto → peso ' + PESI[j - 1], esito: ['RIPORTO', 'si'], hud: hud(sc), els: quadro([j - 1]),
            testo: 'La rotella di peso ' + PESI[j] + ' è tornata a 0 e trascina quella di peso ' + PESI[j - 1] + ', che ' + (era9 ? 'mostrava 9 e torna anch’essa a 0: il riporto prosegue.' : 'avanza di una cifra. Il contachilometri segna ' + val() + '.') });
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
        testo: 'Sommando i contributi delle cifre si ritrova il numero segnato, ' + finale + '. Le rotelle che mostrano 0 contribuiscono alla somma con zero, e intanto tengono al loro posto tutte le altre.' });
      return { passi, esito: riporti };
    }
  },
  bilancio: {
    regola: [
      'La posizione di una cifra si conta da destra partendo da zero. A ogni posizione corrisponde un peso: 1, 10, 100, 1000, moltiplicando per dieci a ogni passo verso sinistra.',
      'Il valore di un numero è la somma delle sue cifre, ciascuna moltiplicata per il peso della posizione. Quando una posizione esaurisce le sue cifre torna a 0 e passa un riporto alla posizione vicina.'
    ],
    errori: [
      ['Contare le posizioni da sinistra.', 'La posizione 0, quella di peso 1, è la prima a destra.'],
      ['Dimenticare lo zero che tiene il posto.', '305 e 35 sono numeri diversi proprio perché lo zero occupa una posizione.'],
      ['Sommare le cifre senza pesarle.', 'In 352 la somma 3 + 5 + 2 dà 10; il numero vale 300 + 50 + 2.']
    ],
    saFare: ['Dico la posizione e il peso di ogni cifra di un numero.', 'Scompongo un numero nella somma dei contributi delle sue cifre.', 'Prevedo quando uno scatto produce un riporto e fin dove si propaga.'],
    esercizi: [
      { d: 'Nel numero 4072, quanto vale la cifra 7?', segnaposto: 'Un numero', giuste: ['70'],
        ok: 'La cifra 7 occupa la posizione 1, che pesa 10: vale 7 × 10 = 70.',
        diagnosi: [
          { se: ['7'], msg: 'Hai scritto la cifra. Il suo valore si ottiene moltiplicandola per il peso della posizione che occupa.' },
          { se: ['700'], msg: 'Hai usato il peso 100. Conta le posizioni da destra partendo da zero: la cifra 7 è in posizione 1.' },
          { se: ['72'], msg: 'Hai unito due cifre. La domanda riguarda soltanto la cifra 7 e il peso della sua posizione.' },
          { se: ['1', '10'], msg: 'Hai indicato la posizione o il peso. Il valore della cifra è il prodotto fra la cifra e il peso.' }
        ],
        altro: 'Il valore è diverso. Trova la posizione della cifra 7 contando da destra a partire da zero, poi moltiplica per il peso.',
        indizi: ['Da destra, le posizioni di 4072 sono occupate da 2, 7, 0 e 4.', 'La cifra 7 è in posizione 1.', 'La posizione 1 pesa 10.'],
        svolgimento: ['Le cifre di 4072, da destra, occupano le posizioni 0, 1, 2 e 3.', 'La cifra 7 è in posizione 1, che pesa 10.', 'Il suo valore è 7 × 10 = 70.'] },
      { d: 'Un contachilometri segna 1999. Dopo uno scatto, quante rotelle hanno cambiato cifra?', segnaposto: 'Un numero', giuste: ['4'],
        ok: 'Le tre rotelle che mostravano 9 tornano a 0, una dopo l’altra, e l’ultimo riporto porta la quarta da 1 a 2.',
        diagnosi: [
          { se: ['1'], msg: 'La rotella delle unità passa da 9 a 0, quindi trascina la vicina. Segui il riporto fin dove arriva.' },
          { se: ['3'], msg: 'Le tre rotelle con il 9 tornano a 0, ed è giusto. L’ultima di queste trascina anche la quarta, che passa da 1 a 2.' },
          { se: ['2000'], msg: 'Duemila è il numero segnato dopo lo scatto. La domanda chiede quante rotelle hanno cambiato cifra.' }
        ],
        altro: 'Il conto è diverso. Scrivi il numero prima e dopo lo scatto e confronta le cifre una per una.',
        indizi: ['Dopo lo scatto il contachilometri segna 2000.', 'Confronta 1999 e 2000 cifra per cifra.', 'Nessuna delle quattro cifre è rimasta uguale.'],
        svolgimento: ['La rotella delle unità passa da 9 a 0 e trascina quella delle decine.', 'Anche le decine e le centinaia passano da 9 a 0, e il riporto raggiunge le migliaia.', 'Le migliaia passano da 1 a 2: le rotelle cambiate sono quattro.'] }
    ]
  }
});
