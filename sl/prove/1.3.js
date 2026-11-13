'use strict';
/* Prova del capitolo 1.3: una domanda per unità, più una seconda sull’UTF-8. */
(() => {
  const I = SL.scritture.intero, N = SL.num;
  const H = (v) => v.toString(16).toUpperCase().padStart(2, '0');
  const BIN = (v) => v.toString(2).padStart(8, '0').replace(/(....)(....)/, '$1 $2');

  SL.registraProva('1.3', { domande: [
    // 1.3.1 · lo spostamento di un pixel
    (r) => {
      const W = r.int(6, 20), riga = r.int(1, 5), col = r.int(1, W - 1), pixel = riga * W + col, giusto = 3 * pixel;
      return { u: '1.3.1', d: 'Un’immagine a tre canali è larga ' + W + ' pixel. A quale spostamento comincia il pixel in colonna ' + col + ', riga ' + riga + '?', segnaposto: 'Un numero di byte', giuste: I(giusto),
        ok: 'Prima di quel pixel ce ne sono ' + riga + ' × ' + W + ' + ' + col + ' = ' + pixel + ', e ciascuno occupa tre byte: 3 × ' + pixel + ' = ' + giusto + '.',
        diagnosi: [
          { se: I(pixel), msg: 'Questo è il numero dei pixel che precedono. Ogni pixel occupa tre byte.' },
          { se: I(3 * (col * W + riga)), msg: 'Hai scambiato riga e colonna. Le righe intere che precedono sono ' + riga + ', ciascuna di ' + W + ' pixel.' },
          { se: I(3 * ((riga - 1) * W + (col - 1))), msg: 'Righe e colonne si contano da zero: la riga ' + riga + ' è preceduta da ' + riga + ' righe intere.' },
          { se: I(3 * riga * W), msg: 'Questo è lo spostamento del primo pixel della riga. Mancano i pixel che precedono nella stessa riga.' }
        ],
        altro: 'Lo spostamento è diverso. Conta i pixel che precedono, riga per riga, e moltiplica per tre.',
        indizi: ['I pixel sono scritti una riga dopo l’altra.', 'Prima della riga ' + riga + ' ci sono ' + riga + ' righe intere, cioè ' + riga * W + ' pixel.', 'I pixel che precedono sono ' + riga * W + ' + ' + col + ' = ' + pixel + '.'],
        svolgimento: ['Pixel nelle righe precedenti: ' + riga + ' × ' + W + ' = ' + riga * W + '.', 'Pixel precedenti nella stessa riga: ' + col + '.', 'Pixel che precedono: ' + pixel + '.', 'Spostamento: 3 × ' + pixel + ' = ' + giusto + '.'] };
    },
    // 1.3.2 · il primo byte annuncia la lunghezza
    (r) => {
      const b = r.scegli([0x41, 0x6D, 0x7A, 0xC2, 0xC3, 0xCE, 0xD0, 0xE2, 0xE3, 0xEF, 0xF0]);
      const lung = b < 0x80 ? 1 : b < 0xE0 ? 2 : b < 0xF0 ? 3 : 4, prefisso = ['0', '110', '1110', '11110'][lung - 1];
      return { u: '1.3.2', d: 'Una sequenza UTF-8 comincia con il byte `0x' + H(b) + '`. Quanti byte occupa in tutto il carattere?', segnaposto: 'Un numero di byte', giuste: I(lung).concat([['uno', 'due', 'tre', 'quattro'][lung - 1]]),
        ok: 'In binario 0x' + H(b) + ' è ' + BIN(b) + '. Comincia con ' + prefisso + ', il prefisso dei caratteri di ' + (lung === 1 ? 'un solo byte.' : lung + ' byte.'),
        diagnosi: [
          { se: lung > 1 ? I(lung - 1) : ['0'], msg: lung > 1 ? 'Il conto comprende anche il primo byte, oltre ai byte di continuazione.' : 'Un carattere occupa almeno un byte. Il primo bit a 0 annuncia un carattere di un solo byte.' },
          { se: I(lung + 1), msg: 'Lo zero che chiude il prefisso resta fuori dal conto. Contano soltanto gli 1 iniziali.' }
        ],
        altro: 'Il numero è diverso. Scrivi il byte in binario e guarda con quali bit comincia.',
        indizi: ['In binario 0x' + H(b) + ' è ' + BIN(b) + '.', 'I prefissi sono 0 per un byte, 110 per due, 1110 per tre, 11110 per quattro.', 'Questo byte comincia con ' + prefisso + '.'],
        svolgimento: ['0x' + H(b) + ' in binario: ' + BIN(b) + '.', 'Il byte comincia con ' + prefisso + '.', 'Il carattere occupa ' + (lung === 1 ? '1 byte.' : lung + ' byte: il primo e ' + (lung - 1) + ' di continuazione.')] };
    },
    // 1.3.2 · i byte di una parola con lettere accentate
    (r) => {
      const [parola, accenti] = r.scegli([['città', 1], ['caffè', 1], ['così', 1], ['più', 1], ['virtù', 1], ['età', 1], ['lunedì', 1], ['però', 1], ['è già', 2], ['là e qua', 1]]);
      const car = parola.length, giusto = car + accenti, spazi = parola.includes(' ');
      return { u: '1.3.2', d: 'Il testo «' + parola + '» ha ' + car + ' caratteri' + (spazi ? ', spazi compresi' : '') + '. Quanti byte occupa in UTF-8?', segnaposto: 'Un numero di byte', giuste: I(giusto),
        ok: 'I caratteri ASCII occupano un byte ciascuno. ' + (accenti === 1 ? 'La lettera accentata ne occupa due' : 'Le due lettere accentate ne occupano due ciascuna') + ': ' + (car - accenti) + ' + ' + 2 * accenti + ' = ' + giusto + '.',
        diagnosi: [
          { se: I(car), msg: 'Hai contato un byte per carattere. Le lettere accentate escono dalla tabella ASCII e in UTF-8 occupano due byte.' },
          { se: I(2 * car), msg: 'Soltanto le lettere accentate occupano due byte. Gli altri caratteri sono ASCII e ne occupano uno.' },
          { se: I(car + 2 * accenti), msg: 'Una lettera accentata occupa due byte in tutto, cioè uno in più di una lettera ASCII.' }
        ],
        altro: 'Il numero è diverso. Separa i caratteri ASCII dalle lettere accentate e conta i byte di ciascun gruppo.',
        indizi: ['Lettere senza accento e spazi sono caratteri ASCII, da un byte.', 'Le lettere accentate italiane occupano due byte in UTF-8.', 'Nel testo le lettere accentate sono ' + accenti + ' e gli altri caratteri ' + (car - accenti) + '.'],
        svolgimento: ['Caratteri ASCII: ' + (car - accenti) + ', un byte ciascuno.', 'Lettere accentate: ' + accenti + ', due byte ciascuna.', 'Totale: ' + (car - accenti) + ' + ' + 2 * accenti + ' = ' + giusto + ' byte.'] };
    },
    // 1.3.3 · la dimensione di una registrazione
    (r) => {
      const F = r.scegli([8000, 16000, 22050, 44100, 48000]), C = r.int(1, 2), bit = r.scegli([8, 16]), S = r.scegli([2, 5, 10, 30, 60]);
      const B = bit / 8, giusto = F * C * B * S;
      return { u: '1.3.3', d: 'Una registrazione PCM usa ' + N(F) + ' campioni al secondo, ' + (C === 1 ? 'un canale' : 'due canali') + ' e ' + bit + ' bit per campione. Quanti byte occupano ' + S + ' secondi?', segnaposto: 'Un numero di byte', giuste: I(giusto),
        ok: 'Byte per campione, canali, campioni al secondo e secondi si moltiplicano: ' + B + ' × ' + C + ' × ' + N(F) + ' × ' + S + ' = ' + N(giusto) + '.',
        diagnosi: [
          { se: I(giusto * 8), msg: 'Hai contato i bit. Un campione di ' + bit + ' bit occupa ' + B + (B === 1 ? ' byte.' : ' byte.') },
          { se: C === 2 ? I(giusto / 2) : [], msg: 'Manca il secondo canale: con due canali i campioni raddoppiano.' },
          { se: I(giusto / S), msg: 'Questo è il numero di byte in un secondo. La registrazione ne dura ' + S + '.' },
          { se: B === 2 ? I(giusto / 2) : [], msg: 'Un campione di 16 bit occupa due byte.' }
        ],
        altro: 'Il numero è diverso. Moltiplica i quattro fattori: byte per campione, canali, campioni al secondo, secondi.',
        indizi: ['Un campione di ' + bit + ' bit occupa ' + B + ' byte.', 'In un secondo i byte sono ' + B + ' × ' + C + ' × ' + N(F) + ' = ' + N(F * C * B) + '.', 'I secondi sono ' + S + '.'],
        svolgimento: ['Byte per campione: ' + bit + ' ÷ 8 = ' + B + '.', 'Byte al secondo: ' + B + ' × ' + C + ' × ' + N(F) + ' = ' + N(F * C * B) + '.', 'Byte in ' + S + ' secondi: ' + N(F * C * B) + ' × ' + S + ' = ' + N(giusto) + '.'] };
    },
    // 1.3.4 · una lunghezza dichiarata e i byte disponibili
    (r) => {
      const R = r.int(8, 20), K = r.int(2, R - 3), rim = R - K, accetta = r.int(0, 1) === 1;
      const L = accetta ? r.int(1, rim) : rim + r.int(1, 4), giusto = accetta ? K + L : K;
      return { u: '1.3.4', d: 'Un lettore ha ricevuto ' + R + ' byte e il cursore è sul byte ' + K + '. Il campo successivo dichiara una lunghezza di ' + L + ' byte. Su quale byte si trova il cursore dopo che il lettore ha trattato il campo?', segnaposto: 'Il numero di un byte', giuste: I(giusto),
        ok: 'Dopo il cursore restano ' + R + ' − ' + K + ' = ' + rim + ' byte. ' + (accetta ? 'Il campo ne chiede ' + L + ' e viene letto: il cursore avanza a ' + K + ' + ' + L + ' = ' + giusto + '.' : 'Il campo ne chiede ' + L + ' e viene rifiutato: il cursore resta sul byte ' + K + '.'),
        diagnosi: accetta
          ? [{ se: I(K), msg: 'I byte rimasti sono ' + rim + ' e bastano. Il campo viene letto e il cursore avanza della sua larghezza.' }, { se: I(L), msg: 'Il cursore partiva dal byte ' + K + '. La larghezza del campo va sommata a quella posizione.' }, { se: I(R), msg: 'Il cursore avanza della larghezza del campo. I byte che restano dopo appartengono al campo successivo.' }]
          : [{ se: I(K + L), msg: 'Il campo dichiara ' + L + ' byte e ne restano ' + rim + '. Viene rifiutato, e il cursore resta fermo.' }, { se: I(R), msg: 'Il cursore avanza soltanto di campi interi. Un campo incompleto lo lascia dov’era.' }],
        altro: 'La posizione è diversa. Calcola i byte rimasti dopo il cursore e confrontali con la lunghezza dichiarata.',
        indizi: ['I byte rimasti dopo il cursore sono ' + R + ' − ' + K + '.', 'Il campo si può leggere soltanto se la lunghezza dichiarata sta nei byte rimasti.', 'Qui la lunghezza è ' + L + ' e i byte rimasti sono ' + rim + '.'],
        svolgimento: ['Byte rimasti: ' + R + ' − ' + K + ' = ' + rim + '.', 'Confronto: ' + L + (accetta ? ' ≤ ' : ' > ') + rim + '.', accetta ? 'Il campo viene letto e il cursore avanza a ' + K + ' + ' + L + ' = ' + giusto + '.' : 'Il campo viene rifiutato e il cursore resta sul byte ' + K + '.'] };
    },
    // 1.3.5 · due byte, due letture
    (r) => {
      const a = r.int(0x01, 0x2F), b = r.int(0x01, 0x0F), piccolo = r.int(0, 1) === 0;
      const le = a + 256 * b, be = 256 * a + b, giusto = piccolo ? le : be, nome = piccolo ? 'little-endian' : 'big-endian';
      const alto = piccolo ? b : a, basso = piccolo ? a : b;
      return { u: '1.3.5', d: 'Un campo di due byte contiene `' + H(a) + ' ' + H(b) + '`, in quest’ordine, ed è un numero ' + nome + ' senza segno. Quanto vale in base dieci?', segnaposto: 'Un numero in base dieci', giuste: I(giusto),
        ok: 'In ' + nome + ' il byte più significativo è il ' + (piccolo ? 'secondo' : 'primo') + ': ' + alto + ' × 256 + ' + basso + ' = ' + giusto + '.',
        diagnosi: [
          { se: I(piccolo ? be : le), msg: 'Questo è il valore con la convenzione opposta. In ' + nome + ' il byte più significativo è il ' + (piccolo ? 'secondo.' : 'primo.') },
          { se: I(a + b), msg: 'I due byte formano un solo numero. Il più significativo va moltiplicato per 256.' },
          { se: [H(alto).toLowerCase() + H(basso).toLowerCase(), '0x' + H(alto).toLowerCase() + H(basso).toLowerCase()], msg: 'La parola in esadecimale è giusta. La domanda chiede il valore in base dieci.' }
        ],
        altro: 'Il valore è diverso. Stabilisci quale byte è il più significativo, moltiplicalo per 256 e somma l’altro.',
        indizi: ['In ' + nome + ' si incontra per primo il byte ' + (piccolo ? 'meno' : 'più') + ' significativo.', 'In base dieci i due byte valgono ' + a + ' e ' + b + '.', 'Il byte più significativo vale ' + alto + ' e pesa 256.'],
        svolgimento: ['Byte più significativo: ' + H(alto) + ' = ' + alto + '.', 'Byte meno significativo: ' + H(basso) + ' = ' + basso + '.', 'Valore: ' + alto + ' × 256 + ' + basso + ' = ' + giusto + '.'] };
    }
  ] });
})();
