'use strict';
/* Prova del capitolo 6.5: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const ALBERO = { 2: { nome: '/', voci: { '.': 2, '..': 2, a: 5, b: 9 } }, 5: { nome: '/a', voci: { '.': 5, '..': 2, x: 20, y: 21, sub: 6 } }, 6: { nome: '/a/sub', voci: { '.': 6, '..': 5, x: 30 } }, 9: { nome: '/b', voci: { '.': 9, '..': 2, x: 40 } } };
  const risolvi = (cwd, path) => { let qui = path[0] === '/' ? 2 : cwd; const righe = []; for (const c of path.split('/').filter((x) => x)) { const d = ALBERO[qui]; if (!d || d.voci[c] == null) return null; righe.push('«' + c + '» in ' + d.nome + ' → inode ' + d.voci[c] + '.'); qui = d.voci[c]; } return { inode: qui, righe }; };

  SL.registraProva('6.5', { domande: [
    // 6.5.1 · contatore dei collegamenti dopo creazioni e rimozioni
    (r) => {
      const n = r.int(1, 3), k = r.int(0, 3), rim = r.int(1, n + k), v = n + k - rim, giuste = I(v);
      return { u: '6.5.1', d: 'Un inode ha ' + (n === 1 ? '1 collegamento' : n + ' collegamenti') + '. ' + (k === 0 ? 'Nessun altro hard link viene creato.' : k === 1 ? 'Viene creato 1 altro hard link.' : 'Vengono creati altri ' + k + ' hard link.') + ' Poi ' + (rim === 1 ? 'viene rimosso 1 nome' : 'vengono rimossi ' + rim + ' nomi') + ' con unlink. Quanto vale il contatore dei collegamenti?', segnaposto: 'Un numero', giuste,
        ok: n + ' + ' + k + ' − ' + rim + ' = ' + v + '.' + (v === 0 ? ' A zero, il sistema libera inode e blocchi.' : ''),
        diagnosi: DIAG(giuste, [
          { se: I(n + k), msg: 'Questo è il valore prima delle rimozioni. Ogni unlink toglie un collegamento.' },
          k > 0 ? { se: I(Math.max(0, n - rim)), msg: 'Vanno contati anche gli hard link creati: ciascuno aggiunge 1 al contatore.' } : null,
          { se: I(rim), msg: 'Questo è il numero dei nomi rimossi. La domanda riguarda i collegamenti rimasti.' }
        ]),
        altro: 'Il numero è diverso. Si aggiunga 1 per ogni hard link creato e si tolga 1 per ogni nome rimosso.',
        indizi: ['All’inizio: ' + n + '.', 'Dopo le creazioni: ' + (n + k) + '.', 'Dopo le rimozioni: ' + v + '.'],
        svolgimento: [n + ' + ' + k + ' = ' + (n + k) + '.', (n + k) + ' − ' + rim + ' = ' + v + '.'] };
    },
    // 6.5.2 · inode raggiunto da un percorso in un albero dato
    (r) => {
      const scelte = [[5, './x'], [5, 'sub/x'], [5, '../b/x'], [5, './sub/../y'], [9, './x'], [9, '../a/y'], [9, '/a/sub/x'], [9, '../a/sub/x'], [6, './x'], [6, '../x'], [6, '../../b/x'], [6, '/b/x'], [6, '../y'], [5, '/b/x']];
      const q = r.scegli(scelte), R = risolvi(q[0], q[1]), giuste = I(R.inode), altra = risolvi(q[0] === 5 ? 9 : 5, q[1]);
      return { u: '6.5.2', d: 'La radice contiene «a», con inode 5, e «b», con inode 9. La directory /a contiene «x» (inode 20), «y» (inode 21) e la directory «sub» (inode 6). La directory /a/sub contiene «x» (inode 30). La directory /b contiene «x» (inode 40). La directory corrente è ' + ALBERO[q[0]].nome + '. Quale inode raggiunge il percorso ' + q[1] + '?', segnaposto: 'Un numero', giuste,
        ok: R.righe.join(' '),
        diagnosi: DIAG(giuste, [
          altra && q[1][0] !== '/' ? { se: I(altra.inode), msg: 'Questo sarebbe il risultato da un’altra directory corrente. Qui si parte da ' + ALBERO[q[0]].nome + '.' } : null,
          { se: I(q[0]), msg: 'Questo è l’inode della directory corrente. Il percorso va risolto fino all’ultimo componente.' },
          { se: I(20), msg: 'Venti è «x» in /a. Controlla in quale directory viene cercato l’ultimo componente.' },
          { se: I(30), msg: 'Trenta è «x» in /a/sub. Controlla in quale directory viene cercato l’ultimo componente.' },
          { se: I(40), msg: 'Quaranta è «x» in /b. Controlla in quale directory viene cercato l’ultimo componente.' }
        ]),
        altro: 'Il numero è diverso. Risolvi un componente alla volta, annotando la directory in cui lo cerchi.',
        indizi: [q[1][0] === '/' ? 'Il percorso comincia con una barra: si parte dalla radice.' : 'Il percorso è relativo: si parte da ' + ALBERO[q[0]].nome + '.', R.righe[0], R.righe.slice(1).join(' ') || 'L’inode raggiunto è ' + R.inode + '.'],
        svolgimento: R.righe.concat(['Inode: ' + R.inode + '.']) };
    },
    // 6.5.3 · blocchi necessari, spazio inutilizzato, oppure posizione logica dell'ultimo byte
    (r) => {
      const bl = r.scegli([1024, 4096]), nb = r.int(1, 5), usati = r.int(1, bl), s = (nb - 1) * bl + usati, spreco = nb * bl - s, cosa = r.int(0, 2), v = cosa === 0 ? nb : cosa === 1 ? spreco : nb - 1, giuste = I(v);
      return { u: '6.5.3', d: 'I blocchi sono da ' + bl + ' byte. Un file è lungo ' + s + ' byte. ' + (cosa === 0 ? 'Quanti blocchi occupa?' : cosa === 1 ? 'Quanti byte restano inutilizzati nel suo ultimo blocco?' : 'In quale blocco logico, contando da 0, si trova il suo ultimo byte?'), segnaposto: 'Un numero', giuste,
        ok: 'Servono ' + nb + (nb === 1 ? ' blocco' : ' blocchi') + ', cioè ' + nb * bl + ' byte riservati. Inutilizzati: ' + spreco + '. L’ultimo byte, in posizione ' + (s - 1) + ', sta nel blocco logico ' + (nb - 1) + '.',
        diagnosi: DIAG(giuste, cosa === 0 ? [
          { se: I(nb - 1), msg: (nb - 1) + (nb - 1 === 1 ? ' blocco contiene ' : ' blocchi contengono ') + (nb - 1) * bl + ' byte, meno della lunghezza del file. La divisione va arrotondata all’intero superiore.' },
          { se: I(nb + 1), msg: nb + (nb === 1 ? ' blocco contiene ' : ' blocchi contengono ') + nb * bl + ' byte, che bastano.' }
        ] : cosa === 1 ? [
          { se: I(usati), msg: 'Questi sono i byte usati nell’ultimo blocco. La domanda riguarda quelli rimasti vuoti.' },
          { se: I(bl), msg: 'L’ultimo blocco contiene ' + usati + ' byte del file.' }
        ] : [
          { se: I(nb), msg: 'I blocchi logici si contano da 0: l’ultimo dei ' + nb + ' ha numero ' + (nb - 1) + '.' },
          { se: I(usati - 1), msg: 'Questo è l’offset dell’ultimo byte dentro il blocco. La domanda riguarda il numero del blocco.' }
        ]),
        altro: 'Il numero è diverso. Si divida la lunghezza per ' + bl + ', e ragiona su quoziente e resto.',
        indizi: [(nb - 1) + ' × ' + bl + ' = ' + (nb - 1) * bl + ', e ' + nb + ' × ' + bl + ' = ' + nb * bl + '.', 'Il file, di ' + s + ' byte, sta fra questi due valori: servono ' + nb + (nb === 1 ? ' blocco.' : ' blocchi.'), cosa === 0 ? 'Blocchi: ' + nb + '.' : cosa === 1 ? nb * bl + ' − ' + s + ' = ' + spreco + '.' : 'Ultimo byte in posizione ' + (s - 1) + ': blocco logico ' + (nb - 1) + '.'],
        svolgimento: ['Blocchi: ' + nb + '.', 'Riservati: ' + nb * bl + ' byte.', 'Inutilizzati: ' + spreco + ' byte.', 'Ultimo byte: blocco logico ' + (nb - 1) + '.'] };
    },
    // 6.5.4 · blocco raggiunto seguendo una catena, oppure blocchi liberi di una bitmap
    (r) => {
      if (r.int(0, 2) === 0) { const n = r.int(10, 16), bit = []; for (let k = 0; k < n; k++) bit.push(r.int(0, 1)); const zeri = bit.filter((b) => b === 0).length, giuste = I(zeri);
        return { u: '6.5.4', d: 'La bitmap di un volume di ' + n + ' blocchi è ' + bit.join(' ') + '. Quanti blocchi sono liberi?', segnaposto: 'Un numero', giuste,
          ok: 'I bit a 0 sono ' + zeri + '.',
          diagnosi: DIAG(giuste, [
            { se: I(n - zeri), msg: 'Questi sono i bit a 1, cioè i blocchi occupati. I liberi sono gli zeri.' },
            { se: I(n), msg: 'Questi sono i blocchi in tutto.' }
          ]),
          altro: 'Il numero è diverso. Conta i bit a 0.',
          indizi: ['Un bit a 0 indica un blocco libero.', 'I bit a 1 sono ' + (n - zeri) + '.', n + ' − ' + (n - zeri) + ' = ' + zeri + '.'],
          svolgimento: ['Occupati: ' + (n - zeri) + '.', 'Liberi: ' + zeri + '.'] }; }
      const len = r.int(4, 5), cat = r.mescola([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]).slice(0, len), ind = r.int(1, len - 1), off = r.int(0, 1023), pos = ind * 1024 + off, giuste = I(cat[ind]);
      return { u: '6.5.4', d: 'I blocchi sono da 1024 byte. Un file comincia nel blocco ' + cat[0] + ', e la FAT dice: ' + cat.slice(1).map((b, k) => 'dopo il ' + cat[k] + ' viene il ' + b).join(', ') + '. In quale blocco del volume si trova il byte di posizione ' + pos + '?', segnaposto: 'Un numero', giuste,
        ok: pos + ' = ' + ind + ' × 1024 + ' + off + ': blocco logico ' + ind + '. Catena: ' + cat.slice(0, ind + 1).join(', ') + '.',
        diagnosi: DIAG(giuste, [
          { se: I(ind), msg: 'Questo è il numero del blocco logico. Il blocco del volume si trova seguendo la catena per ' + ind + (ind === 1 ? ' anello.' : ' anelli.') },
          ind + 1 < len ? { se: I(cat[ind + 1]), msg: 'Hai seguito un anello di troppo: il primo blocco è già il blocco logico 0.' } : null,
          { se: I(cat[ind - 1]), msg: 'Manca un anello: per il blocco logico ' + ind + ' se ne seguono ' + ind + '.' },
          { se: I(cat[0] + ind), msg: 'I blocchi del file sono sparsi: vanno letti nella FAT.' }
        ]),
        altro: 'Il numero è diverso. Si calcoli il blocco logico, poi si segua la catena dal primo blocco.',
        indizi: [pos + ' / 1024 = ' + ind + ', con resto ' + off + '.', 'Blocco logico 0: il ' + cat[0] + '.', 'Seguendo ' + ind + (ind === 1 ? ' anello' : ' anelli') + ': ' + cat.slice(0, ind + 1).join(' → ') + '.'],
        svolgimento: ['Blocco logico: ' + ind + '.', 'Catena: ' + cat.slice(0, ind + 1).join(' → ') + '.', 'Blocco del volume: ' + cat[ind] + '.'] };
    }
  ] });
})();
