'use strict';
/* Prova del capitolo 1.2: sei domande sulle quattro unità. */
(() => {
  const I = SL.scritture.intero, X = SL.scritture.esa;
  const H = (v) => v.toString(16).toUpperCase().padStart(2, '0');
  const BIN = (v) => v.toString(2).padStart(8, '0').replace(/(....)(....)/, '$1 $2');
  const PESI = [128, 64, 32, 16, 8, 4, 2, 1];
  const V = (x) => x.toFixed(1).replace('.', ',');

  SL.registraProva('1.2', { domande: [
    // 1.2.1 · dalle tensioni alle cifre
    (r) => {
      const fili = r.int(3, 4);
      let bit = '';
      while (!bit.includes('0') || !bit.includes('1')) { bit = ''; for (let k = 0; k < fili; k++) bit += r.int(0, 1); }
      const volt = bit.split('').map((b) => (b === '1' ? 20 + r.int(1, 13) : r.int(1, 7)) / 10);
      const rovescio = bit.split('').map((b) => (b === '1' ? '0' : '1')).join('');
      return { u: '1.2.1', d: 'Un ricevitore ha le soglie a 0,8 V e a 2,0 V. Su ' + (fili === 3 ? 'tre' : 'quattro') + ' fili, da sinistra a destra, si misurano ' + volt.map((v) => V(v) + ' V').join(', ') + '. Quali cifre sono lette?', segnaposto: 'Cifre binarie', giuste: [bit],
        ok: 'Le misure fino a 0,8 V si leggono 0 e quelle a partire da 2,0 V si leggono 1: ' + bit + '.',
        diagnosi: [
          { se: [rovescio], msg: 'Le due letture sono state scambiate. Al di sotto della soglia bassa si legge 0, al di sopra della soglia alta si legge 1.' },
          { se: [bit.split('').reverse().join('')], msg: 'Le cifre sono corrette e disposte in ordine inverso. Vanno scritte da sinistra a destra, nell’ordine dei fili.' }
        ],
        altro: 'Le cifre sono diverse. Si confronti ogni misura con le due soglie, un filo alla volta.',
        indizi: ['Una misura che non supera 0,8 V si legge 0.', 'Una misura che raggiunge 2,0 V si legge 1.', 'La prima misura, ' + V(volt[0]) + ' V, si legge ' + bit[0] + '.'],
        svolgimento: volt.map((v, k) => 'Filo ' + (k + 1) + ': ' + V(v) + ' V, ' + (bit[k] === '1' ? 'sopra 2,0 V, si legge 1.' : 'sotto 0,8 V, si legge 0.')).concat(['Cifre lette: ' + bit + '.']) };
    },
    // 1.2.1 · le combinazioni di n bit
    (r) => {
      const n = r.scegli([3, 4, 6, 7, 9, 10]), giusto = Math.pow(2, n);
      return { u: '1.2.1', d: 'Quante combinazioni diverse si possono formare con ' + n + ' bit?', segnaposto: 'Un numero', giuste: I(giusto),
        ok: 'Ogni bit aggiunto raddoppia le combinazioni: 2 moltiplicato per se stesso ' + n + ' volte dà ' + giusto + '.',
        diagnosi: [
          { se: I(2 * n), msg: 'È stato moltiplicato 2 per ' + n + '. Ogni bit raddoppia le combinazioni, e il 2 va quindi moltiplicato per se stesso ' + n + ' volte.' },
          { se: I(n * n), msg: 'È stato moltiplicato ' + n + ' per se stesso. Il numero da moltiplicare per se stesso è 2, e le volte sono ' + n + '.' },
          { se: I(giusto - 1), msg: 'Questo è il massimo numero rappresentabile. Le combinazioni comprendono anche quella di soli zeri.' },
          { se: I(giusto / 2), msg: 'Questo è il numero di combinazioni con un bit in meno.' }
        ],
        altro: 'Il numero è diverso. Si parta da 2 combinazioni con un bit e si raddoppi a ogni bit aggiunto.',
        indizi: ['Un bit distingue due casi.', 'Ogni bit aggiunto raddoppia le combinazioni.', 'Con ' + (n - 1) + ' bit le combinazioni sono ' + giusto / 2 + '.'],
        svolgimento: ['Con 1 bit: 2 combinazioni.', 'A ogni bit aggiunto il numero raddoppia.', 'Con ' + n + ' bit: 2 moltiplicato per se stesso ' + n + ' volte, cioè ' + giusto + '.'] };
    },
    // 1.2.2 · dal binario alla base dieci
    (r) => {
      let v = 0; while (v < 17 || v.toString(2).replace(/0/g, '').length < 3 || v.toString(2).replace(/0/g, '').length > 5) v = r.int(17, 254);
      const b = v.toString(2).padStart(8, '0'), usati = PESI.filter((p, k) => b[k] === '1');
      const rovescio = parseInt(b.split('').reverse().join(''), 2);
      return { u: '1.2.2', d: 'Quanto vale, in base dieci, il byte `' + BIN(v) + '`?', segnaposto: 'Un numero in base dieci', giuste: I(v),
        ok: 'I pesi dei bit a 1 sono ' + usati.join(', ') + ', e la loro somma è ' + v + '.',
        diagnosi: [
          { se: I(rovescio), msg: 'I pesi sono stati assegnati in ordine inverso. Il bit più a destra ha peso 1 e quello più a sinistra ha peso 128.' },
          { se: I(usati.length), msg: 'Sono stati contati i bit a 1. Ciascuno contribuisce con il proprio peso.' }
        ],
        altro: 'Il valore è diverso. Si scriva sotto ogni bit il relativo peso e si sommino quelli dei bit a 1.',
        indizi: ['Da sinistra a destra i pesi sono 128, 64, 32, 16, 8, 4, 2, 1.', 'I bit a 1 sono ' + usati.length + '.', 'I pesi da sommare sono ' + usati.join(', ') + '.'],
        svolgimento: ['Pesi dei bit a 1: ' + usati.join(', ') + '.', 'Somma: ' + usati.join(' + ') + ' = ' + v + '.'] };
    },
    // 1.2.2 · dal binario all'esadecimale
    (r) => {
      let v = 0; while ((v >> 4) === (v & 15) || (v >> 4) < 2 || ((v >> 4) < 10 && (v & 15) < 10)) v = r.int(0x20, 0xFE);
      const alto = v >> 4, basso = v & 15, scambio = (basso << 4) | alto;
      return { u: '1.2.2', d: 'Si scriva in esadecimale il byte `' + BIN(v) + '`.', segnaposto: 'Due cifre esadecimali', giuste: X(v, 2),
        ok: 'Il gruppo di sinistra vale ' + alto + ', cioè la cifra ' + alto.toString(16).toUpperCase() + '. Il gruppo di destra vale ' + basso + ', cioè la cifra ' + basso.toString(16).toUpperCase() + '.',
        diagnosi: [
          { se: X(scambio, 2), msg: 'Le due cifre sono corrette e scambiate di posto. Il gruppo di sinistra fornisce la prima cifra.' },
          { se: I(v), msg: 'Questo è il valore in base dieci. In esadecimale ogni gruppo di quattro bit è sostituito da una cifra.' },
          { se: [String(alto) + String(basso)], msg: 'I valori dei due gruppi sono corretti. Un valore da 10 a 15 si scrive con una lettera da A a F.' }
        ],
        altro: 'La scrittura è diversa. Si divida il byte in due gruppi di quattro bit e si converta ciascun gruppo in una cifra.',
        indizi: ['I due gruppi sono ' + BIN(v).split(' ').join(' e ') + '.', 'Il primo gruppo vale ' + alto + ', il secondo ' + basso + '.', 'I valori da 10 a 15 si scrivono A, B, C, D, E, F.'],
        svolgimento: ['Gruppo di sinistra: ' + BIN(v).split(' ')[0] + ' = ' + alto + ', cifra ' + alto.toString(16).toUpperCase() + '.', 'Gruppo di destra: ' + BIN(v).split(' ')[1] + ' = ' + basso + ', cifra ' + basso.toString(16).toUpperCase() + '.', 'Il byte si scrive 0x' + H(v) + '.'] };
    },
    // 1.2.3 · l'ordine dei byte in memoria
    (r) => {
      const byte = r.mescola([0x0A, 0x1B, 0x2C, 0x3D, 0x4E, 0x5F, 0x60, 0x71, 0x82, 0x93]).slice(0, 4);   // dal più al meno significativo
      const piccolo = r.int(0, 1) === 0, k = r.int(0, 3), base = r.scegli([0x100, 0x200, 0x300, 0x400]);
      const mem = piccolo ? byte.slice().reverse() : byte, altra = piccolo ? byte : byte.slice().reverse();
      const nome = piccolo ? 'little-endian' : 'big-endian', IND = (j) => '0x' + (base + j).toString(16).toUpperCase();
      return { u: '1.2.3', d: 'Il numero 0x' + byte.map(H).join('') + ' viene scritto in ' + nome + ' a partire dall’indirizzo ' + IND(0) + '. Quale byte si trova all’indirizzo ' + IND(k) + '?', segnaposto: 'Un byte in esadecimale', giuste: X(mem[k], 2),
        ok: 'In ' + nome + ' l’indirizzo più basso contiene il byte ' + (piccolo ? 'meno' : 'più') + ' significativo. Le quattro celle contengono ' + mem.map(H).join(' ') + '.',
        diagnosi: [
          { se: X(altra[k], 2), msg: 'Questo è il byte che occuperebbe quell’indirizzo con la convenzione opposta. In ' + nome + ' l’indirizzo più basso contiene il byte ' + (piccolo ? 'meno' : 'più') + ' significativo.' },
          { se: X(mem[Math.min(3, k + 1)], 2), msg: 'Gli indirizzi si contano a partire da ' + IND(0) + ', che contiene il primo byte scritto.' }
        ],
        altro: 'Il byte è diverso. Si scrivano i quattro byte nell’ordine in cui sono disposti in memoria e si contino le celle a partire da ' + IND(0) + '.',
        indizi: ['Il numero è formato dai byte ' + byte.map(H).join(', ') + ', dal più al meno significativo.', 'In ' + nome + ' si scrive per primo il byte ' + (piccolo ? 'meno' : 'più') + ' significativo.', 'In memoria, da ' + IND(0) + ' in avanti: ' + mem.map(H).join(' ') + '.'],
        svolgimento: mem.map((b, j) => 'Indirizzo ' + IND(j) + ': ' + H(b) + '.').concat(['All’indirizzo ' + IND(k) + ' si trova ' + H(mem[k]) + '.']) };
    },
    // 1.2.4 · il carattere di una cifra e il suo valore
    (r) => {
      const c = r.int(0, 9), k = r.int(1, 5), giusto = 48 + c + k;
      return { u: '1.2.4', d: 'Un programma riceve dalla tastiera il carattere «' + c + '» e, senza convertirlo, gli somma il numero ' + k + '. Quale valore ottiene?', segnaposto: 'Un numero in base dieci', giuste: I(giusto),
        ok: 'Il carattere «' + c + '» ha codice ASCII ' + (48 + c) + '. Sommando ' + k + ' si ottiene ' + giusto + '.',
        diagnosi: [
          { se: I(c + k), msg: 'È stato sommato il valore della cifra. Il programma ha ricevuto il codice ASCII del carattere, che supera di 48 il valore della cifra.' },
          { se: I(48 + c), msg: 'Questo è il codice del carattere. Va ancora sommato ' + k + '.' },
          { se: [String(c) + String(k)], msg: 'Le due cifre sono state accostate. Il programma esegue una somma fra numeri.' }
        ],
        altro: 'Il valore è diverso. Si determini il codice ASCII del carattere e gli si sommi ' + k + '.',
        indizi: ['Dalla tastiera giunge un codice ASCII.', 'Il carattere di una cifra e il valore della cifra differiscono di 48.', 'Il carattere «' + c + '» ha codice ' + (48 + c) + '.'],
        svolgimento: ['Codice ASCII di «' + c + '»: 48 + ' + c + ' = ' + (48 + c) + '.', 'Somma: ' + (48 + c) + ' + ' + k + ' = ' + giusto + '.'] };
    }
  ] });
})();
