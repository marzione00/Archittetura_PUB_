'use strict';
SL.registra('1.4.1', {
  titolo: 'Il complemento a due a larghezza fissata',
  obiettivo: 'Alla fine saprai leggere un byte come numero con segno, scrivere un numero negativo in otto bit e dire quale intervallo di numeri un byte può contenere.',
  concetti: [['segno', 'Segno'], ['bit', 'Bit di segno'], ['bilancio', 'Pesi']],
  filigrana: ['segno', 'bit', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'bilancio', da: 'Dall’unità 1.2.2', t: 'I pesi di un byte', d: 'Da sinistra a destra gli otto bit pesano 128, 64, 32, 16, 8, 4, 2 e 1. Il valore è la somma dei pesi dei bit a 1.' },
      { sim: 'pila', da: 'Dall’unità 0.3', t: 'Il riporto', d: 'Quando una posizione esaurisce le sue cifre torna a zero e passa un’unità alla posizione di sinistra.' },
      { sim: 'char', da: 'Dall’unità 1.2.4', t: 'I bit non portano etichette', d: 'La stessa combinazione di bit ha significati diversi secondo la regola con cui la si legge.' }
    ],
    domanda: { d: 'Prima di proseguire: quanto vale il byte 11111111 letto con i pesi dell’unità 1.2.2?', o: [
      { t: '255', ok: true, fb: 'Tutti i pesi sono presenti: 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1.' },
      { t: '256', fb: 'Le combinazioni sono 256 e la più grande vale 255, perché si parte da zero.' },
      { t: '8', fb: 'Otto è il numero dei bit. Il valore è la somma dei loro pesi.' }
    ] }
  },
  idea: {
    titolo: 'Un peso che cambia segno',
    termini: ['intero senza segno', 'intero con segno', 'complemento a due', 'bit di segno'],
    testo: [
      'Fin qui un byte ha rappresentato i numeri da 0 a 255. Si chiamano [[intero senza segno|interi senza segno]], perché sono tutti positivi o nulli. Un programma ha bisogno anche di numeri negativi: una temperatura sotto zero, un debito, uno spostamento all’indietro. Le combinazioni di otto bit restano 256, e bisogna spartirle fra positivi e negativi.',
      'La regola usata da tutti i calcolatori di oggi cambia una cosa sola. Il bit più a sinistra, che pesava 128, pesa −128. Gli altri sette conservano i pesi di sempre. Questa convenzione si chiama [[complemento a due]], e i numeri letti così sono [[intero con segno|interi con segno]].',
      { fig: 'celle', titolo: 'I pesi di un byte in complemento a due', nota: 'Il byte 11111000 vale −128 + 64 + 32 + 16 + 8, cioè −8.', celle: [
        { so: '−128', v: '1', st: 'amb' }, { so: '64', v: '1', st: 'on' }, { so: '32', v: '1', st: 'on' }, { so: '16', v: '1', st: 'on' }, { so: '8', v: '1', st: 'on' }, { so: '4', v: '0' }, { so: '2', v: '0' }, { so: '1', v: '0' }] },
      'Quando il bit di sinistra vale 0 il peso negativo resta fuori, e il numero è lo stesso di prima, fra 0 e 127. Quando vale 1 si parte da −128 e gli altri bit aggiungono al massimo 127, quindi il risultato è negativo, fra −128 e −1. Per questo il bit di sinistra si chiama [[bit di segno]]. L’intervallo completo va da −128 a 127: i negativi sono uno in più dei positivi, perché lo zero occupa un posto fra i non negativi.',
      'Fra le due letture c’è un legame semplice. Se il bit di segno vale 1, il suo peso passa da +128 a −128 e la lettura scende di 256. Il byte 11111111 vale 255 senza segno e 255 − 256, cioè −1, con segno.',
      'Per scrivere un numero negativo esiste una ricetta in tre mosse: si scrive in binario il suo valore senza il segno meno, si invertono tutti i bit, si aggiunge uno. Invertire tutti i bit di un numero x dà 255 − x, e aggiungere uno dà 256 − x. Letta con segno, quella combinazione vale proprio −x.',
      'La larghezza fa parte della regola. Con sedici bit il peso negativo è −32 768 e l’intervallo si allarga. Gli stessi otto bit 11111000 valgono −8 in un byte, mentre in una parola di sedici bit, preceduti da otto zeri, valgono 248. Prima di leggere un numero con segno bisogna sapere quanti bit occupa.'
    ]
  },
  esperimento: {
    faremo: [
      'Sceglierai un numero negativo, da −1 a −128, e lo scriveremo in un byte con la ricetta in tre mosse: valore assoluto, inversione, aggiunta di uno.',
      'Sotto i bit due riquadri mostrano come la parola verrebbe letta in quel momento, senza segno e con segno. Guardali cambiare a ogni mossa.'
    ],
    vedrai: [
      ['bit', 'Gli otto bit', 'In alto, con i pesi scritti sopra. Il primo a sinistra pesa −128.'],
      ['bilancio', 'Le due letture', 'In basso: la stessa parola, letta senza segno e con segno.'],
      ['pila', 'Il riporto', 'Il cartellino «+1» che, nell’ultima mossa, risale i bit da destra.']
    ]
  },
  lab: {
    titolo: 'Scrivere un numero negativo in otto bit',
    scena: { w: 860, h: 300 },
    atti: ['Il numero', 'Il valore assoluto', 'L’inversione', 'L’aggiunta di uno', 'La verifica'],
    nota: 'L’inversione richiede sempre otto passi. L’aggiunta di uno ne richiede di più quando il riporto deve risalire molti bit.',
    controlli: [{ id: 'n', tipo: 'num', eti: 'Numero da scrivere', min: -128, max: -1, salti: [1, 10], valore: -37, pronti: [-1, -37, -100, -128] }],
    previsione: {
      domanda: (p) => 'Scriveremo ' + String(p.n).replace('-', '−') + ' in un byte. Chi leggesse quello stesso byte come numero senza segno, quale valore troverebbe?',
      opzioni: (p) => Array.from(new Set([256 + p.n, 255 + p.n, -p.n, 128 - p.n > 255 ? 127 : 128 - p.n])).sort((a, b) => a - b)
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + pred + '. La lettura senza segno è ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 255 + p.n ? 'Quello è il valore dopo la sola inversione. Manca l’aggiunta di uno.' : pred === -p.n ? 'Quello è il valore assoluto, cioè il punto di partenza della ricetta.' : 'Hai acceso il bit di segno lasciando gli altri com’erano. In complemento a due vanno invertiti tutti i bit, e poi si aggiunge uno.'),
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

      P({}, 0, 'Il numero da scrivere', 'Vogliamo scrivere ' + M(p.n) + ' in un byte, in complemento a due. Il numero è negativo, quindi il bit di segno dovrà valere 1. Applichiamo la ricetta in tre mosse.');
      bit = m.toString(2).padStart(8, '0').split('').map(Number); fase = 'valore assoluto';
      P({ box: 2 }, 1, 'Il valore assoluto in binario', 'Togliamo il segno meno e scriviamo ' + m + ' in otto bit, come nell’unità 1.2.2: ' + somma(false).join(' + ') + ' = ' + m + '. Per ora le due letture coincidono' + (m === 128 ? ', salvo che 128 non entra fra i numeri con segno.' : '.'),
        { calc: m + ' = ' + bit.join(''), chiedi: { d: 'La seconda mossa inverte tutti i bit. Il primo a sinistra vale ' + bit[0] + '. Dopo l’inversione varrà…', o: ['0', '1'], g: 1 - bit[0], no: 'Invertire un bit significa scambiare 0 e 1.' } });
      fase = 'inversione';
      for (let j = 0; j < 8; j++) {
        const prima = bit[j]; bit[j] = 1 - prima;
        P({ att: j }, 2, 'Invertiamo il bit di peso ' + Math.abs(PESI[j]), 'Il bit valeva ' + prima + ' e diventa ' + bit[j] + '.' + (j === 0 ? ' È il bit di segno: da questo momento la lettura con segno è negativa.' : j === 7 ? ' L’inversione è completa: la lettura senza segno è 255 − ' + m + ', cioè ' + U() + '.' : ''),
          Object.assign({ calc: bit.join('') }, j === 7 ? { chiedi: { d: 'La terza mossa aggiunge 1 partendo da destra. L’ultimo bit vale ' + bit[7] + '. Che cosa accade?', o: ['Diventa 1 e il riporto si ferma', 'Diventa 0 e il riporto passa a sinistra'], g: bit[7] === 0 ? 0 : 1, no: bit[7] === 0 ? 'In binario 0 + 1 fa 1, senza riporto.' : 'In binario 1 + 1 fa 0 con riporto 1, come 9 + 1 nel contachilometri.' } } : {}));
      }
      fase = 'più uno';
      for (let j = 7; j >= 0; j--) {
        if (bit[j] === 1) { bit[j] = 0; P({ att: j, piu: j }, 3, 'Uno più uno nella colonna di peso ' + Math.abs(PESI[j]), 'Il bit valeva 1. In binario 1 + 1 fa 0 con riporto 1: la colonna torna a 0 e il riporto passa a sinistra.', { calc: bit.join('') }); }
        else { bit[j] = 1; P({ att: j, piu: j }, 3, 'Il riporto si ferma', 'Il bit di peso ' + Math.abs(PESI[j]) + ' valeva 0. Con l’uno in arrivo diventa 1, e non c’è altro da riportare. La parola è completa.', { calc: bit.join(''), chiedi: { d: 'Il bit di segno della parola ottenuta vale 1. Quanto pesa nella lettura con segno?', o: ['128', '−128', '−1'], g: 1, no: 'In complemento a due il bit più a sinistra di un byte pesa −128.' } }); break; }
      }
      fase = 'verifica';
      P({ box: 3 }, 4, 'La lettura con segno', 'Sommiamo i pesi dei bit a 1, ricordando che il primo è negativo: ' + somma(true).map(M).join(' + ').replace(/\+ −/g, '− ') + ' = ' + M(S()) + '. È il numero che volevamo scrivere.', { calc: bit.join('') + ' = ' + M(S()) });
      P({ box: 2 }, 4, 'La lettura senza segno', 'Chi ignorasse la convenzione leggerebbe ' + U() + '. Le due letture differiscono di 256, il doppio del peso del bit di segno: ' + U() + ' − 256 = ' + M(S()) + '.', { calc: U() + ' − 256 = ' + M(S()) });
      return { passi, esito: U() };
    }
  },
  bilancio: {
    regola: [
      'In complemento a due il bit più a sinistra di un byte pesa −128 e gli altri conservano i loro pesi. L’intervallo va da −128 a 127.',
      'Un numero negativo si scrive partendo dal suo valore assoluto, invertendo tutti i bit e aggiungendo uno. Quando il bit di segno vale 1, la lettura con segno è quella senza segno meno 256.'
    ],
    errori: [
      ['Accendere soltanto il bit di segno.', 'La parola 10100101 vale −91. Per scrivere −37 vanno invertiti tutti i bit di 37, e poi si aggiunge uno.'],
      ['Dimenticare l’aggiunta di uno.', 'La sola inversione dà un numero più piccolo di uno: invece di −37 si ottiene −38.'],
      ['Leggere senza conoscere la larghezza.', 'Il peso negativo appartiene al bit più a sinistra, e quale sia dipende da quanti bit ha la parola.']
    ],
    saFare: ['Leggo un byte come intero con segno usando il peso −128.', 'Scrivo un numero negativo in otto bit con la ricetta in tre mosse.', 'Indico l’intervallo dei numeri con segno su otto bit.'],
    esercizi: [
      { d: 'Il byte 11110100 è un intero con segno. Quanto vale?', segnaposto: 'Un numero', giuste: ['-12', '−12'],
        ok: 'Con i pesi: −128 + 64 + 32 + 16 + 4 = −12. Con la scorciatoia: 244 − 256 = −12.',
        diagnosi: [
          { se: ['244'], msg: 'Quella è la lettura senza segno. Il bit di sinistra vale 1, quindi con segno il numero è negativo: 244 − 256.' },
          { se: ['-116', '−116'], msg: 'Hai usato il primo bit come un semplice segno meno davanti agli altri sette. In complemento a due quel bit pesa −128 e si somma agli altri.' },
          { se: ['12'], msg: 'Il valore assoluto è giusto. Il bit di segno vale 1, quindi il numero è negativo.' }
        ],
        altro: 'Il valore è diverso. Somma i pesi dei bit a 1, dando −128 al primo.',
        indizi: ['I bit a 1 hanno pesi −128, 64, 32, 16 e 4.', 'La somma dei pesi positivi è 116.', 'Il valore è −128 + 116.'],
        svolgimento: ['Bit a 1: quelli di peso −128, 64, 32, 16, 4.', '64 + 32 + 16 + 4 = 116.', '−128 + 116 = −12.'] },
      { d: 'Qual è il numero più piccolo che un byte può contenere in complemento a due?', guida: 'Scegli la risposta.', o: [
        { t: '−127', fb: 'Il byte 10000001 vale −127, ma esiste una combinazione ancora più piccola: 10000000.' },
        { t: '−128', ok: true, fb: 'È il byte 10000000: il peso negativo da solo, senza nessun peso positivo ad alzarlo.' },
        { t: '−255', fb: 'Il peso negativo vale −128. Per arrivare a −255 servirebbero più bit.' }] }
    ],
    sfida: ['lez04_01_encode_negative_twos', 'Codificare interi negativi']
  }
});
