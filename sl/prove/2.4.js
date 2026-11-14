'use strict';
/* Prova del capitolo 2.4: una domanda per unità, due per l'unità 2.4.4. */
(() => {
  const I = SL.scritture.intero, ESA = SL.scritture.esa, X = SL.x86;
  const H2 = (v) => '0x' + X.esa2(v), H4 = (v) => '0x' + v.toString(16).toUpperCase().padStart(4, '0'), H8 = (v) => '0x' + v.toString(16).toUpperCase().padStart(8, '0');
  const FORMATO = 'Un formato di 32 bit assegna i bit da 31 a 26 al codice operativo, da 25 a 21 al registro A, da 20 a 16 al registro B e da 15 a 0 all’immediato. ';

  SL.registraProva('2.4', { domande: [
    // 2.4.1 · il risultato di uno scorrimento
    (r) => {
      const op = r.scegli(['shr', 'sar', 'sar', 'shl']), k = r.int(1, 3), x = op === 'shl' ? r.int(0x11, 0xEE) : r.scegli([r.int(0x81, 0xEE), r.int(0x81, 0xEE), r.int(0x12, 0x7E)]);
      const fai = (o, n) => { const sx = x >= 128 ? x - 256 : x, D = Math.pow(2, n); return o === 'shl' ? (x * D) % 256 : o === 'shr' ? Math.floor(x / D) : ((Math.floor(sx / D) % 256) + 256) % 256; };
      const giusto = fai(op, k), POS = k === 1 ? 'una posizione' : k + ' posizioni';
      const diagnosi = [];
      if (op !== 'shl' && fai('shr', k) !== fai('sar', k)) diagnosi.push({ se: ESA(fai(op === 'shr' ? 'sar' : 'shr', k), 2), msg: op === 'sar' ? 'Il valore indicato è il risultato di SHR, che fa entrare zeri. SAR copia il bit di segno, che in questo caso vale 1.' : 'Il valore indicato è il risultato di SAR, che copia il bit di segno. SHR fa entrare zeri.' });
      diagnosi.push({ se: ESA(fai(op === 'shl' ? 'shr' : 'shl', k), 2), msg: op === 'shl' ? 'Il valore indicato corrisponde a uno scorrimento verso destra. SHL sposta i bit verso sinistra.' : 'Il valore indicato corrisponde a uno scorrimento verso sinistra. L’istruzione sposta i bit verso destra.' });
      diagnosi.push({ se: ESA(fai(op, k === 3 ? 2 : k + 1), 2), msg: 'Il numero di posizioni è diverso: l’istruzione ne richiede ' + k + '.' });
      return { u: '2.4.1', d: 'AL contiene ' + H2(x) + ', in binario ' + X.bin8(x) + '. Quale byte contiene dopo `' + op + ' al, ' + k + '`? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x3C', giuste: ESA(giusto, 2),
        ok: 'I bit si spostano di ' + POS + ' verso ' + (op === 'shl' ? 'sinistra, e da destra entrano zeri.' : 'destra, e da sinistra ' + (op === 'shr' ? 'entrano zeri.' : 'entrano copie del bit di segno, che vale ' + (x >= 128 ? 1 : 0) + '.')) + ' Il byte diventa ' + X.bin8(giusto) + '.',
        diagnosi,
        altro: 'Il byte è diverso. Si spostino gli otto bit e si riempiano le posizioni rimaste libere.',
        indizi: ['I bit si spostano di ' + POS + ' verso ' + (op === 'shl' ? 'sinistra.' : 'destra.'), op === 'shl' ? 'Da destra entrano zeri.' : op === 'shr' ? 'Da sinistra entrano zeri.' : 'Da sinistra entrano copie del bit 7, che vale ' + (x >= 128 ? 1 : 0) + '.', 'Il byte diventa ' + X.bin8(giusto) + '.'],
        svolgimento: ['Bit di partenza: ' + X.bin8(x) + '.', 'Dopo lo spostamento di ' + POS + ' e il riempimento: ' + X.bin8(giusto) + '.', 'In esadecimale: ' + H2(giusto) + '.'] };
    },
    // 2.4.2 · un bit acceso, spento, invertito oppure letto
    (r) => {
      const x = r.int(0x12, 0xED), k = r.int(0, 7), m = 1 << k, b = (x >> k) & 1, op = r.scegli(['or', 'and', 'xor', 'test']);
      const TESTA = 'AL contiene ' + H2(x) + ', in binario ' + X.bin8(x) + '. ';
      if (op === 'test') {
        const SPIEGA = 'La maschera ' + H2(m) + ' ha acceso il solo bit ' + k + ', che in AL vale ' + b + '. L’AND è ' + (b ? 'diverso da zero, e ZF vale 0.' : 'zero, e ZF vale 1.');
        const z = b ? 0 : 1, RESTA = ', AL resta ' + H2(x), CAMBIA = ', AL diventa ' + H2(x & m);
        return { u: '2.4.2', d: TESTA + 'Quanto valgono ZF e AL dopo `test al, ' + H2(m) + '`?', guida: 'Si scelga la risposta.', o: [
          { t: 'ZF = ' + z + RESTA, ok: true, fb: SPIEGA + ' TEST scarta il risultato dell’AND, e AL resta invariato.' },
          { t: 'ZF = ' + (1 - z) + RESTA, fb: SPIEGA },
          { t: 'ZF = ' + z + CAMBIA, fb: 'Il flag è corretto. TEST scarta tuttavia il risultato dell’AND e lascia AL invariato: la modifica di AL spetterebbe all’istruzione AND.' },
          { t: 'ZF = ' + (1 - z) + CAMBIA, fb: SPIEGA + ' Inoltre TEST scarta il risultato dell’AND, e AL resta invariato.' }] };
      }
      const imm = op === 'and' ? (~m) & 255 : m, giusto = op === 'or' ? x | m : op === 'and' ? x & imm : x ^ m;
      const diagnosi = [];
      if (op === 'xor' && b) diagnosi.push({ se: ESA(x | m, 2), msg: 'In tal modo il bit resta acceso, come con OR. XOR inverte il bit: da 1 passa a 0.' });
      if (op === 'or') diagnosi.push({ se: ESA(x ^ m, 2).concat(ESA(m, 2)), msg: 'OR accende il bit della maschera e lascia passare tutti gli altri bit di AL.' });
      if (op === 'and') diagnosi.push({ se: ESA(x & m, 2).concat(ESA(x | imm, 2)), msg: 'AND lascia passare i bit di AL dove la maschera vale 1. In questo caso la maschera ha un solo 0, nella posizione ' + k + '.' });
      const m2 = m === 128 ? 64 : m * 2, vicino = op === 'or' ? x | m2 : op === 'and' ? x & ~m2 & 255 : x ^ m2;
      if (vicino !== x) diagnosi.push({ se: ESA(vicino, 2), msg: 'Il bit modificato è un altro. La maschera ' + H2(imm) + ' riguarda la posizione ' + k + '.' });
      if (giusto !== x) diagnosi.push({ se: ESA(x, 2), msg: 'In tal modo AL resterebbe invariato. Il bit ' + k + ' vale ' + b + ', e l’operazione lo porta a ' + (1 - b) + '.' });
      return { u: '2.4.2', d: TESTA + 'Quale byte contiene dopo `' + op + ' al, ' + H2(imm) + '`? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x4C', giuste: ESA(giusto, 2),
        ok: 'La maschera ' + H2(imm) + ', in binario ' + X.bin8(imm) + ', riguarda il bit ' + k + ', che in AL vale ' + b + '. ' + (op === 'or' ? 'OR lo accende.' : op === 'and' ? 'AND lo spegne.' : 'XOR lo inverte.') + ' Gli altri bit restano invariati.',
        diagnosi,
        altro: 'Il byte è diverso. Si scrivano AL e la maschera in binario, l’uno sopra l’altra, e si proceda colonna per colonna.',
        indizi: ['La maschera in binario è ' + X.bin8(imm) + '.', 'Il bit ' + k + ' di AL vale ' + b + '.', op === 'or' ? 'OR con un 1 dà 1, con uno 0 lascia passare.' : op === 'and' ? 'AND con uno 0 dà 0, con un 1 lascia passare.' : 'XOR con un 1 inverte, con uno 0 lascia passare.'],
        svolgimento: ['AL: ' + X.bin8(x) + '. Maschera: ' + X.bin8(imm) + '.', 'Il bit ' + k + ' passa da ' + b + ' a ' + ((giusto >> k) & 1) + ', gli altri restano invariati.', 'Risultato: ' + X.bin8(giusto) + ' = ' + H2(giusto) + '.'] };
    },
    // 2.4.3 · due valori riuniti in un byte, con o senza maschera
    (r) => {
      const h = r.int(1, 14), maschera = r.int(0, 2) > 0; let l = r.int(0x11, 0xFE); if ((l & 15) === 0) l += 3;
      const a1 = (h << 4) & 255, d1 = maschera ? l & 15 : l, giusto = a1 | d1, altra = a1 | (maschera ? l : l & 15);
      const IST = ['`shl al, 4`'].concat(maschera ? ['`and dl, 0x0F`'] : []).concat(['`or al, dl`']);
      const diagnosi = [];
      if (altra !== giusto) diagnosi.push({ se: ESA(altra, 2), msg: maschera ? 'In tal modo DL entra nell’OR senza maschera. La seconda istruzione azzera la sua metà alta.' : 'In tal modo DL risulta ridotto ai quattro bit bassi. In questo caso la maschera è assente, e DL entra nell’OR con tutti i suoi bit.' });
      diagnosi.push({ se: ESA(((l & 15) << 4) | h, 2), msg: 'I due campi sono scambiati. Lo scorrimento riguarda AL, che occupa il campo alto.' });
      diagnosi.push({ se: ESA(h | d1, 2), msg: 'Manca lo scorrimento di AL, che porta il suo valore nel campo alto.' });
      return { u: '2.4.3', d: 'AL contiene ' + H2(h) + ' e DL contiene ' + H2(l) + '. Quale byte contiene AL dopo ' + IST.slice(0, -1).join(', ') + ' e ' + IST[IST.length - 1] + '? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x3E', giuste: ESA(giusto, 2),
        ok: 'Lo scorrimento porta AL a ' + H2(a1) + '. ' + (maschera ? 'La maschera riduce DL a ' + H2(d1) + '. ' : 'DL resta ' + H2(l) + '. ') + 'OR dà ' + X.bin8(a1) + ' OR ' + X.bin8(d1) + ' = ' + X.bin8(giusto) + '.',
        diagnosi,
        altro: 'Il byte è diverso. Si eseguano le istruzioni una alla volta, in binario.',
        indizi: ['Dopo `shl al, 4`, AL vale ' + H2(a1) + '.', maschera ? 'Dopo `and dl, 0x0F`, DL vale ' + H2(d1) + '.' : 'DL resta invariato, cioè ' + H2(l) + '.', 'OR colonna per colonna: ' + X.bin8(a1) + ' e ' + X.bin8(d1) + '.'],
        svolgimento: ['`shl al, 4`: ' + X.bin8(h) + ' diventa ' + X.bin8(a1) + '.'].concat(maschera ? ['`and dl, 0x0F`: ' + X.bin8(l) + ' diventa ' + X.bin8(d1) + '.'] : []).concat(['`or al, dl`: ' + X.bin8(a1) + ' OR ' + X.bin8(d1) + ' = ' + X.bin8(giusto) + '.', 'AL = ' + H2(giusto) + '.']) };
    },
    // 2.4.4 · il valore di un campo
    (r) => {
      const w = r.int(2, 5), k = r.int(1, 10), m0 = Math.pow(2, w) - 1; let v = r.int(0x1001, 0xFFFE), giri = 0;
      while ((((v >> k) & m0) === 0 || ((v >> k) & m0) === m0) && giri++ < 50) v = r.int(0x1001, 0xFFFE);
      const m = m0 << k, iso = v & m, giusto = iso >> k, B16 = v.toString(2).padStart(16, '0').replace(/(....)(?=.)/g, '$1 ');
      const diagnosi = [{ se: I(iso).concat(ESA(iso, 4)), msg: 'Il valore indicato è il campo isolato, ancora nella propria posizione. Va riportato alle unità, con uno scorrimento a destra di ' + k + (k === 1 ? ' posizione.' : ' posizioni.') }];
      if ((v & m0) !== giusto) diagnosi.push({ se: I(v & m0), msg: 'Il valore indicato corrisponde ai ' + w + ' bit più bassi della parola. Il campo comincia dal bit ' + k + '.' });
      if (((v >> (k + 1)) & m0) !== giusto) diagnosi.push({ se: I((v >> (k + 1)) & m0), msg: 'In tal modo il campo comincia dal bit ' + (k + 1) + '. Le posizioni sono contate da zero, a partire da destra.' });
      return { u: '2.4.4', d: 'EAX contiene ' + H4(v) + ', in binario ' + B16 + '. Un campo largo ' + w + ' bit comincia dal bit ' + k + '. Quale numero contiene il campo?', segnaposto: 'Un numero', giuste: I(giusto),
        ok: 'Il campo occupa i bit da ' + k + ' a ' + (k + w - 1) + ', che valgono ' + giusto.toString(2).padStart(w, '0') + '. Riportati alle unità formano il numero ' + giusto + '.',
        diagnosi,
        altro: 'Il numero è diverso. Si individuino i bit del campo, dalla posizione ' + k + ' alla ' + (k + w - 1) + ', e li si legga come un numero a sé.',
        indizi: ['Il campo occupa i bit da ' + k + ' a ' + (k + w - 1) + '. Il bit 0 è il più a destra.', 'La maschera è ' + H4(m) + ', e l’AND lascia ' + H4(iso) + '.', 'I bit del campo sono ' + giusto.toString(2).padStart(w, '0') + '.'],
        svolgimento: ['Maschera: ' + m0 + ' × 2 alla ' + k + ' = ' + H4(m) + '.', H4(v) + ' AND ' + H4(m) + ' = ' + H4(iso) + '.', 'Scorrimento a destra di ' + k + ': ' + giusto + '.'] };
    },
    // 2.4.4 · la maschera di un campo
    (r) => {
      const w = r.int(2, 6), k = r.int(1, 9), m0 = Math.pow(2, w) - 1, m = m0 * Math.pow(2, k), bin = m.toString(2);
      return { u: '2.4.4', d: 'Qual è la maschera di un campo largo ' + w + ' bit che comincia dal bit ' + k + '? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x03C0', giuste: ESA(m, 4),
        ok: 'Occorrono ' + w + ' bit a 1, cioè ' + m0 + ', scorsi a sinistra di ' + k + (k === 1 ? ' posizione' : ' posizioni') + ': in binario ' + bin + '.',
        diagnosi: [
          { se: ESA(m0, 4), msg: 'Il valore indicato è la fila di ' + w + ' uni, ancora alle unità. Va fatta scorrere a sinistra di ' + k + (k === 1 ? ' posizione.' : ' posizioni.') },
          { se: ESA(Math.pow(2, w + k), 4), msg: 'Il valore indicato è 2 elevato a ' + w + ', scorso di ' + k + ': un solo bit. Prima dello scorrimento va sottratto 1.' },
          { se: ESA(m0 * Math.pow(2, k - 1), 4), msg: 'In tal modo la fila di uni comincia dal bit ' + (k - 1) + '. Le posizioni sono contate da zero.' },
          { se: ESA(m0 * Math.pow(2, k + 1), 4), msg: 'In tal modo la fila di uni comincia dal bit ' + (k + 1) + '. Il campo comincia dal bit ' + k + '.' }
        ],
        altro: 'La maschera è diversa. Si scrivano ' + w + ' bit a 1 seguiti da ' + k + (k === 1 ? ' zero' : ' zeri') + ', e si converta poi in esadecimale.',
        indizi: [w + ' bit a 1 valgono 2 elevato a ' + w + ', meno 1, cioè ' + m0 + '.', 'Lo scorrimento aggiunge ' + k + (k === 1 ? ' zero' : ' zeri') + ' a destra.', 'In binario: ' + bin + '.'],
        svolgimento: ['2 elevato a ' + w + ' = ' + (m0 + 1) + '. Meno 1: ' + m0 + '.', 'Scorrimento a sinistra di ' + k + ': ' + bin + ' in binario.', 'In esadecimale: ' + H4(m) + '.'] };
    },
    // 2.4.5 · comporre una parola, oppure rileggerne un campo
    (r) => {
      const op = r.int(1, 62), a = r.int(1, 30); let b = r.int(1, 30); if (b === a) b += 1; const imm = r.int(0x0101, 0xFFFE);
      const P26 = Math.pow(2, 26), P21 = Math.pow(2, 21), P16 = Math.pow(2, 16), W = op * P26 + a * P21 + b * P16 + imm;
      if (r.int(0, 1) === 0) {
        return { u: '2.4.5', d: FORMATO + 'Quale parola si ottiene con codice operativo ' + op + ', A = ' + a + ', B = ' + b + ' e immediato ' + H4(imm) + '? Si risponda in esadecimale, con otto cifre.', segnaposto: 'Per esempio 0x8C651234', giuste: ESA(W, 8),
          ok: 'I contributi sono ' + H8(op * P26) + ', ' + H8(a * P21) + ', ' + H8(b * P16) + ' e ' + H8(imm) + '. Riuniti danno ' + H8(W) + '.',
          diagnosi: [
            { se: ESA(op * P26 + b * P21 + a * P16 + imm, 8), msg: 'I due registri sono scambiati. Il registro A occupa i bit da 25 a 21, il registro B quelli da 20 a 16.' },
            { se: ESA(op * P26 + a * P21 + b * P16, 8), msg: 'Manca l’immediato, che occupa i sedici bit più bassi.' },
            { se: ESA(W - op * P26, 8), msg: 'Manca il codice operativo, che occupa i sei bit più alti.' }
          ],
          altro: 'La parola è diversa. Si calcolino separatamente i quattro contributi, e li si riunisca poi.',
          indizi: ['Il codice operativo scorre di 26 posizioni: ' + op + ' × 2 alla 26 = ' + H8(op * P26) + '.', 'A scorre di 21 posizioni: ' + H8(a * P21) + '. B scorre di 16: ' + H8(b * P16) + '.', 'Vanno riuniti i tre contributi e l’immediato ' + H8(imm) + '.'],
          svolgimento: ['Codice operativo: ' + op + ' × 2 alla 26 = ' + H8(op * P26) + '.', 'Registro A: ' + a + ' × 2 alla 21 = ' + H8(a * P21) + '.', 'Registro B: ' + b + ' × 2 alla 16 = ' + H8(b * P16) + '.', 'Immediato: ' + H8(imm) + '. Unione: ' + H8(W) + '.'] };
      }
      const quale = r.int(0, 2), NOME = ['il codice operativo', 'il registro A', 'il registro B'][quale], SC = [26, 21, 16][quale], MS = [63, 31, 31][quale], giusto = [op, a, b][quale];
      const alto = Math.floor(W / Math.pow(2, SC)), B32 = W.toString(2).padStart(32, '0').replace(/(....)(?=.)/g, '$1 ');
      const diagnosi = [];
      if (quale > 0) diagnosi.push({ se: I([a, b][2 - quale]), msg: 'Il valore indicato è l’altro registro. Il registro A occupa i bit da 25 a 21, il registro B quelli da 20 a 16.' });
      if (alto !== giusto) diagnosi.push({ se: I(alto), msg: 'Lo scorrimento è corretto. Manca la maschera: dopo lo scorrimento restano anche i bit dei campi più alti.' });
      diagnosi.push({ se: I(alto % 16), msg: 'In tal modo il campo è letto come una cifra esadecimale. La sua larghezza è di ' + (quale === 0 ? 6 : 5) + ' bit.' });
      return { u: '2.4.5', d: FORMATO + 'La parola ' + H8(W) + ', in binario ' + B32 + ', segue questo formato. Quanto vale ' + NOME + '?', segnaposto: 'Un numero', giuste: I(giusto),
        ok: 'Scorrendo la parola a destra di ' + SC + ' posizioni e applicando la maschera ' + MS + ' si ottiene ' + giusto + '.',
        diagnosi,
        altro: 'Il valore è diverso. Si individuino nel binario i bit del campo e li si legga come un numero a sé.',
        indizi: ['Il campo occupa i bit da ' + (SC + (quale === 0 ? 5 : 4)) + ' a ' + SC + '.', 'Contando da destra a partire da zero, i bit del campo sono ' + giusto.toString(2).padStart(quale === 0 ? 6 : 5, '0') + '.', 'In decimale: ' + giusto + '.'],
        svolgimento: ['Scorrimento a destra di ' + SC + ' posizioni: restano i bit dal ' + SC + ' in su.', 'Maschera di ' + (quale === 0 ? 6 : 5) + ' uni, cioè ' + MS + ': resta ' + giusto.toString(2).padStart(quale === 0 ? 6 : 5, '0') + '.', 'Il valore è ' + giusto + '.'] };
    }
  ] });
})();
