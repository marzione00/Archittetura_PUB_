'use strict';
SL.registra('1.4.1', {
  titolo: 'Il complemento a due a larghezza fissata',
  obiettivo: 'Obiettivo: leggere un byte come numero con segno, scrivere un numero negativo in otto bit e indicare l’intervallo di numeri rappresentabile in un byte.',
  concetti: [['segno', 'Segno'], ['bit', 'Bit di segno'], ['bilancio', 'Pesi']],
  filigrana: ['segno', 'bit', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'bilancio', da: 'Dall’unità 1.2.2', t: 'I pesi di un byte', d: 'Da sinistra a destra gli otto bit hanno peso 128, 64, 32, 16, 8, 4, 2 e 1. Il valore è la somma dei pesi dei bit a 1.' },
      { sim: 'pila', da: 'Dall’unità 0.3', t: 'Il riporto', d: 'Quando una posizione esaurisce le proprie cifre ritorna a zero e trasferisce un’unità alla posizione di sinistra.' },
      { sim: 'char', da: 'Dall’unità 1.2.4', t: 'Bit privi di etichetta', d: 'La medesima combinazione di bit assume significati diversi secondo la regola di lettura.' }
    ],
    domanda: { d: 'Prima di proseguire: quanto vale il byte 11111111 letto con i pesi dell’unità 1.2.2?', o: [
      { t: '255', ok: true, fb: 'Tutti i pesi sono presenti: 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1.' },
      { t: '256', fb: 'Le combinazioni sono 256 e la maggiore vale 255, poiché la numerazione parte da zero.' },
      { t: '8', fb: 'Otto è il numero dei bit. Il valore è la somma dei loro pesi.' }
    ] }
  },
  idea: {
    titolo: 'Un peso che cambia segno',
    termini: ['intero senza segno', 'intero con segno', 'complemento a due', 'bit di segno'],
    testo: [
      'Finora un byte ha rappresentato i numeri da 0 a 255, che prendono il nome di [[intero senza segno|interi senza segno]] poiché sono tutti positivi o nulli. Un programma opera anche su numeri negativi, quali una temperatura inferiore a zero, un saldo passivo o uno spostamento all’indietro. Le combinazioni di otto bit restano 256, e vanno ripartite fra positivi e negativi.',
      'La regola adottata da tutti i calcolatori attuali modifica un solo elemento. Il bit più a sinistra, che aveva peso 128, assume peso −128. Gli altri sette conservano i pesi consueti. Tale convenzione prende il nome di [[complemento a due]], e i numeri letti secondo essa sono [[intero con segno|interi con segno]].',
      { fig: 'celle', titolo: 'I pesi di un byte in complemento a due', nota: 'Il byte 11111000 vale −128 + 64 + 32 + 16 + 8, cioè −8.', celle: [
        { so: '−128', v: '1', st: 'amb' }, { so: '64', v: '1', st: 'on' }, { so: '32', v: '1', st: 'on' }, { so: '16', v: '1', st: 'on' }, { so: '8', v: '1', st: 'on' }, { so: '4', v: '0' }, { so: '2', v: '0' }, { so: '1', v: '0' }] },
      'Quando il bit di sinistra vale 0 il peso negativo è assente, e il numero coincide con quello della lettura precedente, fra 0 e 127. Quando vale 1 la somma parte da −128 e gli altri bit aggiungono al massimo 127: il risultato è pertanto negativo, fra −128 e −1. Per questa ragione il bit di sinistra prende il nome di [[bit di segno]]. L’intervallo completo va da −128 a 127: i negativi superano di uno i positivi, poiché lo zero occupa una combinazione fra i non negativi.',
      'Le due letture sono legate da una relazione elementare. Se il bit di segno vale 1, il suo peso passa da +128 a −128 e la lettura diminuisce di 256. Il byte 11111111 vale 255 senza segno e 255 − 256, cioè −1, con segno.',
      'La scrittura di un numero negativo segue un procedimento in tre passaggi: si scrive in binario il valore privo del segno meno, si invertono tutti i bit, si aggiunge uno. L’inversione di tutti i bit di un numero x fornisce 255 − x, e l’aggiunta di uno fornisce 256 − x. Letta con segno, tale combinazione vale esattamente −x.',
      'La larghezza è parte integrante della regola. Con sedici bit il peso negativo è −32 768 e l’intervallo si estende. I medesimi otto bit 11111000 valgono −8 in un byte, mentre in una parola di sedici bit, preceduti da otto zeri, valgono 248. La lettura di un numero con segno presuppone la conoscenza del numero di bit che esso occupa.'
    ]
  },
  esperimento: {
    faremo: [
      'Un numero negativo, compreso fra −1 e −128, viene scritto in un byte con il procedimento in tre passaggi: valore assoluto, inversione, aggiunta di uno.',
      'Sotto i bit due riquadri riportano la lettura corrente della parola, senza segno e con segno, e si aggiornano a ogni passaggio.'
    ],
    vedrai: [
      ['bit', 'Gli otto bit', 'In alto, con i pesi indicati sopra. Il primo a sinistra ha peso −128.'],
      ['bilancio', 'Le due letture', 'In basso: la stessa parola, letta senza segno e con segno.'],
      ['pila', 'Il riporto', 'Il contrassegno «+1» che, nell’ultimo passaggio, risale i bit da destra.']
    ]
  },
  lab: {
    titolo: 'Scrittura di un numero negativo in otto bit',
    scena: { w: 860, h: 300 },
    atti: ['Il numero', 'Il valore assoluto', 'L’inversione', 'L’aggiunta di uno', 'La verifica'],
    nota: 'L’inversione richiede sempre otto passi. L’aggiunta di uno ne richiede di più quando il riporto deve risalire molti bit.',
    controlli: [{ id: 'n', tipo: 'num', eti: 'Numero da scrivere', min: -128, max: -1, salti: [1, 10], valore: -37, pronti: [-1, -37, -100, -128] }],
    previsione: {
      domanda: (p) => 'Si scrive ' + String(p.n).replace('-', '−') + ' in un byte. Quale valore fornisce la lettura del medesimo byte come numero senza segno?',
      opzioni: (p) => Array.from(new Set([256 + p.n, 255 + p.n, -p.n, 128 - p.n > 255 ? 127 : 128 - p.n])).sort((a, b) => a - b)
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. La lettura senza segno è ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 255 + p.n ? 'Il valore indicato è quello successivo alla sola inversione. Manca l’aggiunta di uno.' : pred === -p.n ? 'Il valore indicato è il valore assoluto, cioè il punto di partenza del procedimento.' : 'È stato posto a 1 il bit di segno lasciando invariati gli altri. In complemento a due vanno invertiti tutti i bit, e si aggiunge poi uno.'),
    costruisci(p) {
      const el = SL.el, passi = [];
      const PESI = [-128, 64, 32, 16, 8, 4, 2, 1];
      const M = (v) => String(v).replace('-', '−');
      const m = -p.n;
      let bit = null, fase = '';
      const U = () => bit.reduce((s, b, j) => s + b * Math.abs(PESI[j]), 0);
      const S = () => bit.reduce((s, b, j) => s + b * PESI[j], 0);
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('fa', 40, 78, fase, 'mono', 'att')];
        PESI.forEach((w, j) => els.push(el.cella('b' + j, 170 + j * 76, 56, 64, 64, bit ? String(bit[j]) : '·', o.att === j ? 'att' : bit && bit[j] ? 'on' : 'zero', { so: M(w) })));
        if (o.piu != null) els.push(el.pacco('pk', 170 + o.piu * 76 + 14, 130, '+1', 'att'));
        els.push(el.box('q1', 40, 196, 230, 76, 'numero da scrivere', M(p.n), '', { sim: 'segno', riga: true }));
        els.push(el.box('q2', 300, 196, 250, 76, 'lettura senza segno', bit ? String(U()) : '·', o.box === 2 ? 'att' : '', { sim: 'bilancio', riga: true }));
        els.push(el.box('q3', 580, 196, 250, 76, 'lettura con segno', bit ? M(S()) : '·', o.box === 3 ? 'att' : bit && S() === p.n ? 'on' : '', { sim: 'bit', riga: true }));
        return els;
      };
      const hud = () => [['Numero', M(p.n), 'a'], ['Senza segno', bit ? U() : '·'], ['Con segno', bit ? M(S()) : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const somma = (segno) => bit.map((b, j) => (b ? (segno ? PESI[j] : Math.abs(PESI[j])) : null)).filter((x) => x !== null);

      P({}, 0, 'Il numero da scrivere', 'Si deve scrivere ' + M(p.n) + ' in un byte, in complemento a due. Il numero è negativo, e il bit di segno dovrà quindi valere 1. Si applica il procedimento in tre passaggi.');
      bit = m.toString(2).padStart(8, '0').split('').map(Number); fase = 'valore assoluto';
      P({ box: 2 }, 1, 'Il valore assoluto in binario', 'Rimosso il segno meno, si scrive ' + m + ' in otto bit, come nell’unità 1.2.2: ' + somma(false).join(' + ') + ' = ' + m + '. Per il momento le due letture coincidono' + (m === 128 ? ', salvo che 128 è esterno all’intervallo dei numeri con segno.' : '.'),
        { calc: m + ' = ' + bit.join(''), chiedi: { d: 'Il secondo passaggio inverte tutti i bit. Il primo a sinistra vale ' + bit[0] + '. Dopo l’inversione varrà…', o: ['0', '1'], g: 1 - bit[0], no: 'Invertire un bit significa scambiare 0 e 1.' } });
      fase = 'inversione';
      for (let j = 0; j < 8; j++) {
        const prima = bit[j]; bit[j] = 1 - prima;
        P({ att: j }, 2, 'Inversione del bit di peso ' + Math.abs(PESI[j]), 'Il bit valeva ' + prima + ' e diventa ' + bit[j] + '.' + (j === 0 ? ' È il bit di segno: da questo momento la lettura con segno è negativa.' : j === 7 ? ' L’inversione è completa: la lettura senza segno è 255 − ' + m + ', cioè ' + U() + '.' : ''),
          Object.assign({ calc: bit.join('') }, j === 7 ? { chiedi: { d: 'Il terzo passaggio aggiunge 1 a partire da destra. L’ultimo bit vale ' + bit[7] + '. Che cosa accade?', o: ['Diventa 1 e il riporto si arresta', 'Diventa 0 e il riporto passa a sinistra'], g: bit[7] === 0 ? 0 : 1, no: bit[7] === 0 ? 'In binario 0 + 1 dà 1, senza riporto.' : 'In binario 1 + 1 dà 0 con riporto 1, come 9 + 1 nel contatore decimale.' } } : {}));
      }
      fase = 'più uno';
      for (let j = 7; j >= 0; j--) {
        if (bit[j] === 1) { bit[j] = 0; P({ att: j, piu: j }, 3, 'Uno più uno nella colonna di peso ' + Math.abs(PESI[j]), 'Il bit valeva 1. In binario 1 + 1 dà 0 con riporto 1: la colonna ritorna a 0 e il riporto passa a sinistra.', { calc: bit.join('') }); }
        else { bit[j] = 1; P({ att: j, piu: j }, 3, 'Il riporto si arresta', 'Il bit di peso ' + Math.abs(PESI[j]) + ' valeva 0. Con l’unità in arrivo diventa 1, e nessun riporto ulteriore è necessario. La parola è completa.', { calc: bit.join(''), chiedi: { d: 'Il bit di segno della parola ottenuta vale 1. Quale peso ha nella lettura con segno?', o: ['128', '−128', '−1'], g: 1, no: 'In complemento a due il bit più a sinistra di un byte ha peso −128.' } }); break; }
      }
      fase = 'verifica';
      P({ box: 3 }, 4, 'La lettura con segno', 'Si sommano i pesi dei bit a 1, tenendo conto che il primo è negativo: ' + somma(true).map(M).join(' + ').replace(/\+ −/g, '− ') + ' = ' + M(S()) + '. È il numero che si doveva scrivere.', { calc: bit.join('') + ' = ' + M(S()) });
      P({ box: 2 }, 4, 'La lettura senza segno', 'Una lettura che ignorasse la convenzione fornirebbe ' + U() + '. Le due letture differiscono di 256, il doppio del peso del bit di segno: ' + U() + ' − 256 = ' + M(S()) + '.', { calc: U() + ' − 256 = ' + M(S()) });
      return { passi, esito: U() };
    }
  },
  bilancio: {
    regola: [
      'In complemento a due il bit più a sinistra di un byte ha peso −128 e gli altri conservano i propri pesi. L’intervallo va da −128 a 127.',
      'Un numero negativo si scrive a partire dal valore assoluto, invertendo tutti i bit e aggiungendo uno. Quando il bit di segno vale 1, la lettura con segno è pari a quella senza segno diminuita di 256.'
    ],
    errori: [
      ['Porre a 1 soltanto il bit di segno.', 'La parola 10100101 vale −91. Per scrivere −37 vanno invertiti tutti i bit di 37, e poi si aggiunge uno.'],
      ['Omettere l’aggiunta di uno.', 'La sola inversione fornisce un numero inferiore di un’unità: in luogo di −37 si ottiene −38.'],
      ['Leggere senza conoscere la larghezza.', 'Il peso negativo appartiene al bit più a sinistra, la cui posizione dipende dal numero di bit della parola.']
    ],
    saFare: ['Leggere un byte come intero con segno usando il peso −128.', 'Scrivere un numero negativo in otto bit con il procedimento in tre passaggi.', 'Indicare l’intervallo dei numeri con segno su otto bit.'],
    esercizi: [
      { d: 'Il byte 11110100 è un intero con segno. Quanto vale?', segnaposto: 'Un numero', giuste: ['-12', '−12'],
        ok: 'Con i pesi: −128 + 64 + 32 + 16 + 4 = −12. Con la relazione fra le due letture: 244 − 256 = −12.',
        diagnosi: [
          { se: ['244'], msg: 'Il valore indicato è la lettura senza segno. Il bit di sinistra vale 1, e con segno il numero è quindi negativo: 244 − 256.' },
          { se: ['-116', '−116'], msg: 'Il primo bit è stato trattato come un segno meno anteposto agli altri sette. In complemento a due tale bit ha peso −128 e si somma agli altri.' },
          { se: ['12'], msg: 'Il valore assoluto è corretto. Il bit di segno vale 1, e il numero è quindi negativo.' }
        ],
        altro: 'Il valore è diverso. Si sommino i pesi dei bit a 1, attribuendo −128 al primo.',
        indizi: ['I bit a 1 hanno pesi −128, 64, 32, 16 e 4.', 'La somma dei pesi positivi è 116.', 'Il valore è −128 + 116.'],
        svolgimento: ['Bit a 1: quelli di peso −128, 64, 32, 16, 4.', '64 + 32 + 16 + 4 = 116.', '−128 + 116 = −12.'] },
      { d: 'Qual è il minimo numero che un byte può contenere in complemento a due?', guida: 'Si scelga la risposta.', o: [
        { t: '−127', fb: 'Il byte 10000001 vale −127, ed esiste una combinazione di valore inferiore: 10000000.' },
        { t: '−128', ok: true, fb: 'È il byte 10000000: il solo peso negativo, privo di pesi positivi che ne aumentino il valore.' },
        { t: '−255', fb: 'Il peso negativo vale −128. Per raggiungere −255 occorrerebbero più bit.' }] }
    ],
    sfida: ['lez04_01_encode_negative_twos', 'Codificare interi negativi']
  }
});
