'use strict';
/* Prova del capitolo 2.3: una domanda per unità. */
(() => {
  const I = SL.scritture.intero, ESA = SL.scritture.esa, X = SL.x86, N = X.num;
  const H2 = (v) => X.esa2(v), HA = (a) => '0x' + a.toString(16).toUpperCase(), H8 = (v) => '0x' + v.toString(16).toUpperCase().padStart(8, '0');
  const PTR = { 1: 'byte ptr', 2: 'word ptr', 4: 'dword ptr' }, NOME = { 1: 'un byte', 2: 'due byte', 4: 'quattro byte' };

  SL.registraProva('2.3', { domande: [
    // 2.3.1 · un caricamento con ampiezza ed estensione
    (r) => {
      const b = [r.int(0x11, 0xEE), r.int(0x11, 0xEE), r.int(0x11, 0xEE), r.int(0x11, 0xEE)];
      const w = r.scegli([1, 2, 2, 4]), d = w === 4 ? 0 : r.int(0, 4 - w), ist = w === 4 ? 'mov' : r.scegli(['movzx', 'movsx']);
      const val = (da, quanti, come, inverso) => {
        let x = b.slice(da, da + quanti); if (inverso) x = x.slice().reverse();
        const u = x.reduce((s, y, j) => s + y * Math.pow(256, j), 0);
        return quanti < 4 && come === 'movsx' && x[quanti - 1] >= 128 ? u + Math.pow(2, 32) - Math.pow(256, quanti) : u;
      };
      const letti = b.slice(d, d + w), segno = letti[w - 1] >= 128 ? 1 : 0, giusto = val(d, w, ist), nudo = val(d, w, 'movzx');
      const OP = '[rdi' + (d ? ' + ' + d : '') + ']';
      const diagnosi = [];
      if (w > 1) diagnosi.push({ se: ESA(val(d, w, ist, true), 8), msg: 'I byte sono stati composti nell’ordine in cui compaiono in memoria. In little-endian il primo byte letto è il meno significativo e va scritto a destra.' });
      if (w < 4 && segno) diagnosi.push({ se: ESA(ist === 'movsx' ? nudo : val(d, w, 'movsx'), 8), msg: ist === 'movsx' ? 'Il bit più a sinistra del dato vale 1, e MOVSX lo copia nei bit liberi: i byte aggiunti valgono FF.' : 'MOVZX riempie sempre con zeri, qualunque sia il bit più a sinistra del dato.' });
      if (d > 0) diagnosi.push({ se: ESA(val(0, w, ist), 8), msg: 'L’accesso comincia a 0x2000 + ' + d + ', cioè ' + d + ' byte dopo la prima cella.' });
      if (w < 4 && d === 0) diagnosi.push({ se: ESA(val(0, 4, 'mov'), 8), msg: 'La parola chiave `' + PTR[w] + '` limita l’accesso a ' + NOME[w] + '. Le altre celle restano escluse dal numero.' });
      return { u: '2.3.1', d: 'RDI contiene 0x2000. Le celle da 0x2000 a 0x2003 contengono, nell’ordine, i byte ' + b.map(H2).join(' ') + '. Quanto vale EAX dopo `' + ist + ' eax, ' + PTR[w] + ' ' + OP + '`? Si risponda in esadecimale, con otto cifre.', segnaposto: 'Per esempio 0x0000A1B2', giuste: ESA(giusto, 8),
        ok: 'L’accesso parte da ' + HA(0x2000 + d) + ' e comprende ' + (w === 1 ? 'il byte ' : 'i byte ') + letti.map(H2).join(' ') + (w === 1 ? '.' : ', il primo dei quali è il meno significativo.') + (w === 4 ? ' Quattro byte riempiono EAX.' : ist === 'movsx' ? ' Il bit più a sinistra del dato vale ' + segno + ', e MOVSX lo copia nei bit liberi.' : ' MOVZX riempie con zeri i bit liberi.'),
        diagnosi,
        altro: 'Il valore è diverso. Si individuino le celle lette, le si componga dalla meno significativa e si riempiano poi i bit liberi di EAX.',
        indizi: ['L’accesso parte da ' + HA(0x2000 + d) + ' e comprende ' + NOME[w] + ': ' + letti.map(H2).join(' ') + '.', w === 1 ? 'Il dato letto è 0x' + H2(letti[0]) + ', e occupa il byte più basso di EAX.' : 'Il primo byte letto è il meno significativo: il dato vale 0x' + letti.slice().reverse().map(H2).join('') + '.', w === 4 ? 'Quattro byte riempiono EAX, senza alcuna estensione.' : ist === 'movsx' ? 'Il bit più a sinistra del dato vale ' + segno + ': i byte aggiunti valgono ' + (segno ? 'FF' : '00') + '.' : 'MOVZX aggiunge byte a zero.'],
        svolgimento: ['Celle lette: da ' + HA(0x2000 + d) + (w === 1 ? '' : ' a ' + HA(0x2000 + d + w - 1)) + ', cioè ' + letti.map(H2).join(' ') + '.', 'Dato in little-endian: 0x' + letti.slice().reverse().map(H2).join('') + '.', w === 4 ? 'Il dato occupa tutti i 32 bit.' : (ist === 'movsx' ? 'MOVSX copia il bit di segno, che vale ' + segno + '.' : 'MOVZX riempie con zeri.'), 'EAX = ' + H8(giusto) + '.'] };
    },
    // 2.3.2 · un indirizzo efficace con base, indice, scala e spiazzamento
    (r) => {
      const base = r.scegli([0x1000, 0x2000, 0x4000, 0x7000]), i = r.int(2, 11), s = r.scegli([2, 4, 8]), d = r.scegli([4, 8, 12, 16, 24]);
      const off = i * s + d, giusto = base + off;
      return { u: '2.3.2', d: 'RDI contiene ' + HA(base) + ' e RSI contiene ' + i + '. Quale indirizzo scrive in RAX l’istruzione `lea rax, [rdi + rsi*' + s + ' + ' + d + ']`? Si risponda in esadecimale.', segnaposto: 'Per esempio ' + HA(base + 0x10), giuste: ESA(giusto, 4),
        ok: 'L’indice ' + i + ', moltiplicato per la scala ' + s + ', dà ' + i * s + ' byte. Con lo spiazzamento la distanza è ' + off + ' byte, che in esadecimale si scrive ' + off.toString(16).toUpperCase() + '.',
        diagnosi: [
          { se: ESA(base + parseInt(String(off), 16), 4), msg: 'La distanza, ' + off + ' byte, è corretta. Prima della somma con la base va scritta in esadecimale.' },
          { se: ESA(base + (i + d) * s, 4), msg: 'La scala moltiplica soltanto l’indice. Lo spiazzamento è già in byte ed è sommato invariato.' },
          { se: ESA(base + i * s, 4), msg: 'Manca lo spiazzamento, la costante scritta al termine dell’espressione.' },
          { se: ESA(base + i + d, 4), msg: 'L’indice va moltiplicato per la scala: ' + i + ' × ' + s + '.' }
        ],
        altro: 'L’indirizzo è diverso. Si calcoli indice × scala, si sommi lo spiazzamento e si scriva la distanza in esadecimale.',
        indizi: ['La distanza dalla base è indice × scala + spiazzamento.', i + ' × ' + s + ' + ' + d + ' = ' + off + ' byte.', off + ' in esadecimale si scrive ' + off.toString(16).toUpperCase() + '.'],
        svolgimento: ['Indice × scala: ' + i + ' × ' + s + ' = ' + i * s + '.', 'Aggiunta dello spiazzamento: ' + i * s + ' + ' + d + ' = ' + off + ' byte.', off + ' = 0x' + off.toString(16).toUpperCase() + '.', 'Indirizzo: ' + HA(base) + ' + 0x' + off.toString(16).toUpperCase() + ' = ' + HA(giusto) + '.'] };
    },
    // 2.3.3 · l'indirizzo di un elemento di una matrice
    (r) => {
      const dim = r.scegli([4, 4, 8]), col = r.int(3, 7); let rig = r.int(3, 6); if (rig === col) rig += 1;
      const base = r.scegli([0x3000, 0x5000, 0x8000]), ri = r.int(1, rig - 1); let ci = r.int(1, col - 1); if (ci === ri) ci = ci === col - 1 ? ci - 1 : ci + 1;
      const k = col * ri + ci, off = k * dim, giusto = base + off;
      const diagnosi = [
        { se: ESA(base + parseInt(String(off), 16), 4), msg: 'La distanza, ' + off + ' byte, è corretta. Prima della somma con la base va scritta in esadecimale.' },
        { se: ESA(base + k, 4), msg: 'Il numero ' + k + ' è l’indice dell’elemento nella fila. Ogni elemento occupa ' + dim + ' byte.' },
        { se: ESA(base + (rig * ri + ci) * dim, 4), msg: 'La riga è stata moltiplicata per il numero di righe. Una riga contiene ' + col + ' elementi: il fattore è il numero di colonne.' }
      ];
      if (ci < rig && ri < col) diagnosi.push({ se: ESA(base + (col * ci + ri) * dim, 4), msg: 'Il valore indicato è l’indirizzo di [' + ci + '][' + ri + ']. Il primo indice è la riga.' });
      return { u: '2.3.3', d: 'Una matrice di interi da ' + dim + ' byte ha ' + rig + ' righe e ' + col + ' colonne e comincia all’indirizzo ' + HA(base) + '. A quale indirizzo comincia l’elemento [' + ri + '][' + ci + ']? Si risponda in esadecimale.', segnaposto: 'Per esempio ' + HA(base + 0x10), giuste: ESA(giusto, 4),
        ok: 'L’indice nella fila è ' + col + ' × ' + ri + ' + ' + ci + ' = ' + k + '. La distanza è ' + k + ' × ' + dim + ' = ' + off + ' byte, che in esadecimale si scrive ' + off.toString(16).toUpperCase() + '.',
        diagnosi,
        altro: 'L’indirizzo è diverso. Si contino gli elementi che precedono: ' + ri + (ri === 1 ? ' riga completa' : ' righe complete') + ' da ' + col + ', più ' + ci + '.',
        indizi: ['L’elemento è preceduto da ' + ri + (ri === 1 ? ' riga completa' : ' righe complete') + ' e da ' + ci + (ci === 1 ? ' elemento' : ' elementi') + ' della propria riga.', 'Indice nella fila: ' + col + ' × ' + ri + ' + ' + ci + ' = ' + k + '.', 'Distanza: ' + k + ' × ' + dim + ' = ' + off + ' byte, cioè 0x' + off.toString(16).toUpperCase() + '.'],
        svolgimento: ['Righe complete: ' + ri + ', da ' + col + ' elementi, per un totale di ' + col * ri + ' elementi.', 'Nella riga ' + ri + ', prima della colonna ' + ci + ': ' + ci + '. Il totale è ' + k + '.', 'Distanza: ' + k + ' × ' + dim + ' = ' + off + ' byte = 0x' + off.toString(16).toUpperCase() + '.', 'Indirizzo: ' + HA(base) + ' + 0x' + off.toString(16).toUpperCase() + ' = ' + HA(giusto) + '.'] };
    },
    // 2.3.4 · la disposizione dei membri di una struttura
    (r) => {
      const TIPI = { char: 1, short: 2, int: 4 }, NOMI = ['a', 'b', 'c', 'd'];
      let tipi = [], m = [], fine = 0, size = 0, somma = 0;
      for (let giri = 0; giri < 200; giri++) {
        tipi = Array.from({ length: r.int(3, 4) }, () => r.scegli(['char', 'char', 'short', 'int']));
        let off = 0; somma = 0;
        m = tipi.map((t, k) => { const dim = TIPI[t], libero = off, da = Math.ceil(off / dim) * dim; off = da + dim; somma += dim; return { nome: NOMI[k], tipo: t, dim, libero, da, nudo: somma - dim }; });
        fine = off; size = Math.ceil(off / 4) * 4;
        if (tipi.includes('int') && size > somma && m.some((x) => x.da !== x.nudo)) break;
      }
      const DICH = '`' + m.map((x) => x.tipo + ' ' + x.nome + ';').join(' ') + '`';
      const passi = m.map((x) => x.nome + ': primo libero ' + x.libero + (x.da === x.libero ? ', già adatto.' : ', primo multiplo di ' + x.dim + ' è ' + x.da + '.') + ' Occupa ' + (x.dim === 1 ? 'lo spostamento ' + x.da : 'da ' + x.da + ' a ' + (x.da + x.dim - 1)) + '.');
      const TESTA = 'Una struttura dichiara, nell’ordine, ' + DICH + '. Le dimensioni di char, short e int sono 1, 2 e 4 byte, e ogni membro comincia a un multiplo della propria dimensione. ';
      if (r.int(0, 1) === 0) {
        const diagnosi = [{ se: I(somma), msg: 'Il valore indicato è la somma delle dimensioni dei membri. Fra i membri e in coda il compilatore lascia byte di riempimento.' }];
        if (fine !== size && fine !== somma) diagnosi.push({ se: I(fine), msg: 'I membri terminano a tale spostamento. La dimensione deve essere un multiplo di 4, e in coda occorre altro riempimento.' });
        return { u: '2.3.4', d: TESTA + 'Quanti byte occupa la struttura, riempimento compreso?', segnaposto: 'Un numero', giuste: I(size),
          ok: 'I membri terminano allo spostamento ' + fine + '. La dimensione è il primo multiplo di 4 da ' + fine + ' in su, cioè ' + size + '.',
          diagnosi,
          altro: 'La dimensione è diversa. Si collochino i membri uno alla volta, e si arrotondi poi la fine al multiplo di 4 successivo.',
          indizi: ['Ogni membro comincia al primo spostamento libero che sia multiplo della propria dimensione.', 'I membri terminano allo spostamento ' + fine + '.', 'La dimensione deve essere un multiplo di 4, l’allineamento dell’int.'],
          svolgimento: passi.concat(['Fine dei membri: ' + fine + '. Primo multiplo di 4: ' + size + '.']) };
      }
      const cand = m.filter((x) => x.da !== x.nudo), x = cand[cand.length - 1];
      const diagnosi = [{ se: I(x.nudo), msg: 'In tal modo i membri sarebbero contigui. Ogni membro deve cominciare a un multiplo della propria dimensione, e fra l’uno e l’altro può restare riempimento.' }];
      if (x.libero !== x.da && x.libero !== x.nudo) diagnosi.push({ se: I(x.libero), msg: 'Il valore indicato è il primo spostamento libero. Un ' + x.tipo + ' deve cominciare a un multiplo di ' + x.dim + '.' });
      return { u: '2.3.4', d: TESTA + 'A quale spostamento comincia il membro ' + x.nome + '?', segnaposto: 'Un numero', giuste: I(x.da),
        ok: 'Prima di ' + x.nome + ' il primo spostamento libero è ' + x.libero + '. ' + (x.da === x.libero ? 'Tale valore è già un multiplo di ' + x.dim + '.' : 'Il primo multiplo di ' + x.dim + ' a partire da esso è ' + x.da + '.'),
        diagnosi,
        altro: 'Lo spostamento è diverso. Si collochino i membri uno alla volta, cercando per ciascuno il primo multiplo della propria dimensione.',
        indizi: ['Ogni membro comincia al primo spostamento libero che sia multiplo della propria dimensione.', 'Prima di ' + x.nome + ' il primo spostamento libero è ' + x.libero + '.', 'Il membro ' + x.nome + ' è ' + (x.tipo === 'short' ? 'uno short' : 'un ' + x.tipo) + ': richiede i multipli di ' + x.dim + '.'],
        svolgimento: passi.slice(0, m.indexOf(x) + 1) };
    },
    // 2.3.5 · una scrittura e una lettura attraverso due puntatori
    (r) => {
      const base = r.scegli([0x5000, 0x6000, 0x8000]), arr = r.mescola([12, 25, 37, 48, 56, 61, 73, 84]).slice(0, 4), ip = r.int(0, 3);
      const iq = r.int(0, 9) < 4 ? ip : (ip + r.int(1, 3)) % 4, v = r.scegli([90, 95, 99]), giusto = ip === iq ? v : arr[ip];
      const diagnosi = ip === iq ? [{ se: I(arr[ip]), msg: 'I due registri contengono il medesimo indirizzo. La scrittura modifica la cella letta dalla seconda istruzione.' }]
        : [{ se: I(v), msg: 'I due registri contengono indirizzi diversi. La scrittura modifica l’elemento ' + iq + ', mentre la lettura riguarda l’elemento ' + ip + '.' }, { se: I(arr[iq]), msg: 'Il valore indicato è quello sostituito dalla scrittura, nell’elemento ' + iq + '. La lettura avviene attraverso RDI, che indica l’elemento ' + ip + '.' }];
      return { u: '2.3.5', d: 'Un array di quattro interi da 4 byte comincia all’indirizzo ' + HA(base) + ' e contiene, nell’ordine, ' + arr.slice(0, 3).join(', ') + ' e ' + arr[3] + '. RDI contiene ' + HA(base + 4 * ip) + ' e RSI contiene ' + HA(base + 4 * iq) + '. Il processore esegue `mov dword ptr [rsi], ' + v + '` e poi `mov eax, [rdi]`. Quanto vale EAX?', segnaposto: 'Un numero', giuste: I(giusto),
        ok: 'RDI indica l’elemento ' + ip + ' e RSI l’elemento ' + iq + '. ' + (ip === iq ? 'La cella è la medesima, e la lettura trova il valore appena scritto.' : 'Le celle sono diverse, e la lettura trova il valore iniziale.'),
        diagnosi,
        altro: 'Il valore è diverso. Si stabilisca quale elemento indica ciascun registro, dividendo per 4 la distanza dalla base.',
        indizi: ['L’elemento di indice k comincia a ' + HA(base) + ' + 4 × k.', 'RSI indica l’elemento ' + iq + ', RDI l’elemento ' + ip + '.', ip === iq ? 'I due puntatori indicano la medesima cella.' : 'I due puntatori indicano celle diverse.'],
        svolgimento: ['RSI = ' + HA(base + 4 * iq) + ': elemento ' + iq + '. La scrittura vi pone ' + v + '.', 'RDI = ' + HA(base + 4 * ip) + ': elemento ' + ip + '.', ip === iq ? 'Medesima cella: EAX = ' + v + '.' : 'Cella diversa, rimasta a ' + arr[ip] + ': EAX = ' + arr[ip] + '.'] };
    },
    // 2.3.6 · i campi del byte SIB, nei due versi
    (r) => {
      const REG = [['rax', 0], ['rcx', 1], ['rdx', 2], ['rbx', 3], ['rsi', 6], ['rdi', 7]], due = r.mescola(REG).slice(0, 2), ix = due[0], bs = due[1];
      const s = r.scegli([1, 2, 4, 8]), esp = [1, 2, 4, 8].indexOf(s), sib = (esp << 6) | (ix[1] << 3) | bs[1], B3 = (x) => x.toString(2).padStart(3, '0'), SS = esp.toString(2).padStart(2, '0');
      const CODICI = 'I codici dei registri sono RAX 000, RCX 001, RDX 010, RBX 011, RSI 110, RDI 111.', OPE = (b, i, sc) => '[' + b + ' + ' + i + '*' + sc + ']';
      if (r.int(0, 1) === 0) {
        const s2 = { 1: 2, 2: 1, 4: 2, 8: 4 }[s];
        const SPIEGA = 'In binario il byte si scrive ' + SS + ' ' + B3(ix[1]) + ' ' + B3(bs[1]) + '. ';
        return { u: '2.3.6', d: 'Il byte SIB di un’istruzione vale 0x' + H2(sib) + '. ' + CODICI + ' Quale operando di memoria descrive?', guida: 'Si scelga la risposta.', o: [
          { t: OPE(bs[0], ix[0], s), ok: true, fb: SPIEGA + 'I bit della scala, ' + SS + ', sono l’esponente ' + esp + ': la scala è ' + s + '. Il campo centrale indica l’indice, ' + ix[0].toUpperCase() + ', e quello a destra la base, ' + bs[0].toUpperCase() + '.' },
          { t: OPE(ix[0], bs[0], s), fb: SPIEGA + 'La scala è corretta, mentre indice e base sono scambiati: il campo centrale è l’indice.' },
          { t: OPE(bs[0], ix[0], s2), fb: SPIEGA + 'I registri sono corretti. I bit della scala, ' + SS + ', sono un esponente: 2 elevato a ' + esp + ' dà ' + s + '.' },
          { t: OPE(ix[0], bs[0], s2), fb: SPIEGA + 'Il campo centrale è l’indice e quello a destra la base. I bit della scala sono un esponente: 2 elevato a ' + esp + ' dà ' + s + '.' }] };
      }
      const scambio = (esp << 6) | (bs[1] << 3) | ix[1], senza = (ix[1] << 3) | bs[1];
      const diagnosi = [{ se: ESA(scambio, 2), msg: 'Indice e base sono scambiati. Il campo centrale spetta all’indice, ' + ix[0].toUpperCase() + ', e quello a destra alla base, ' + bs[0].toUpperCase() + '.' }];
      if (esp > 0) diagnosi.push({ se: ESA(senza, 2), msg: 'I campi dei registri sono corretti. Mancano i due bit della scala: ' + s + ' è 2 elevato a ' + esp + ', quindi ' + SS + '.' });
      return { u: '2.3.6', d: 'Quale byte SIB codifica l’operando `' + OPE(bs[0], ix[0], s) + '`? ' + CODICI + ' Si risponda in esadecimale.', segnaposto: 'Per esempio 0x8B', giuste: ESA(sib, 2),
        ok: 'La scala ' + s + ' è 2 elevato a ' + esp + ', e i suoi bit sono quindi ' + SS + '. L’indice ' + ix[0].toUpperCase() + ' è ' + B3(ix[1]) + ' e la base ' + bs[0].toUpperCase() + ' è ' + B3(bs[1]) + '. In sequenza: ' + SS + ' ' + B3(ix[1]) + ' ' + B3(bs[1]) + '.',
        diagnosi,
        altro: 'Il byte è diverso. Si scrivano in sequenza i due bit della scala, i tre dell’indice e i tre della base, e li si raggruppi poi a quattro.',
        indizi: ['La scala ' + s + ' è 2 elevato a ' + esp + ': i due bit valgono ' + SS + '.', 'Indice ' + ix[0].toUpperCase() + ': ' + B3(ix[1]) + '. Base ' + bs[0].toUpperCase() + ': ' + B3(bs[1]) + '.', 'In sequenza ' + SS + ' ' + B3(ix[1]) + ' ' + B3(bs[1]) + '. A gruppi di quattro: ' + X.bin8(sib) + '.'],
        svolgimento: ['Scala ' + s + ' = 2 alla ' + esp + ': bit ' + SS + '.', 'Indice ' + ix[0].toUpperCase() + ': ' + B3(ix[1]) + '. Base ' + bs[0].toUpperCase() + ': ' + B3(bs[1]) + '.', 'Il byte è ' + SS + ' ' + B3(ix[1]) + ' ' + B3(bs[1]) + ' = ' + X.bin8(sib) + '.', 'In esadecimale: 0x' + H2(sib) + '.'] };
    }
  ] });
})();
