'use strict';
/* Prova del capitolo 6.6: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };

  SL.registraProva('6.6', { domande: [
    // 6.6.1 · stato del volume dopo un crash, dato l'ordine delle scritture e il punto dell'arresto
    (r) => {
      const N = { d: 'dati', b: 'bitmap', i: 'inode' }, ord = r.scegli(['dbi', 'dib', 'bdi', 'bid', 'idb', 'ibd']), k = r.int(0, 3), fatte = ord.slice(0, k);
      const s = { d: fatte.indexOf('d') >= 0, b: fatte.indexOf('b') >= 0, i: fatte.indexOf('i') >= 0 }, e = s.i && !(s.b && s.d) ? 'esposto' : !s.i && s.b ? 'perso' : 'coerente';
      const durevoli = k === 0 ? 'nessuna' : fatte.split('').map((c) => N[c]).join(' e ');
      const fb = 'Scritture durevoli: ' + durevoli + '. ' + (e === 'coerente' ? (k === 0 ? 'Il volume è rimasto com’era.' : k === 3 ? 'L’operazione è completa.' : 'I byte nuovi stanno in un blocco ancora libero e fuori da ogni file: per il file system nulla è accaduto.') : e === 'perso' ? 'La bitmap segna occupato il blocco, e l’inode è rimasto senza riferimento.' : s.b ? 'L’inode indica un blocco in cui i byte nuovi sono mai arrivati.' : 'L’inode indica un blocco che la bitmap considera ancora libero.');
      return { u: '6.6.1', d: 'Per aggiungere un blocco a un file servono tre scritture, che diventano durevoli in quest’ordine: ' + ord.split('').map((c) => N[c]).join(', ') + '. Il crash avviene quando ' + ['nessuna scrittura è durevole', 'soltanto la prima è durevole', 'le prime due sono durevoli', 'tutte e tre sono durevoli'][k] + '. In che stato si trova il volume al riavvio?', guida: 'Si scelga la risposta.', o: r.mescola([
        { t: 'Coerente: file come prima, oppure esteso per intero', ok: e === 'coerente', fb },
        { t: 'Un blocco segnato occupato, che nessun file raggiunge', ok: e === 'perso', fb },
        { t: 'Il file raggiunge un blocco con byte vecchi, oppure segnato libero', ok: e === 'esposto', fb }]) };
    },
    // 6.6.2 · bit da modificare, oppure blocchi orfani, da inode e bitmap
    (r) => {
      const B = [20, 21, 22, 23, 24, 25, 26, 27], m = r.mescola(B), na = r.int(2, 3), nb = r.int(1, 3), A = m.slice(0, na).sort((x, y) => x - y), Bb = m.slice(na, na + nb).sort((x, y) => x - y);
      const uso = B.map((b) => (A.indexOf(b) >= 0 || Bb.indexOf(b) >= 0 ? 1 : 0)), nf = r.int(0, 3), guasti = r.mescola(B).slice(0, nf), bit = B.map((b, j) => (guasti.indexOf(b) >= 0 ? 1 - uso[j] : uso[j]));
      const orfani = B.filter((b, j) => bit[j] === 1 && uso[j] === 0), scoperti = B.filter((b, j) => bit[j] === 0 && uso[j] === 1), cosa = r.int(0, 1), v = cosa === 0 ? orfani.length + scoperti.length : orfani.length, giuste = I(v);
      const el = (l) => (l.length ? l.join(', ') : 'nessuno');
      return { u: '6.6.2', d: 'Un volume ha i blocchi da 20 a 27. L’inode A indica i blocchi ' + A.join(', ') + '. L’inode B indica ' + (Bb.length === 1 ? 'il blocco ' : 'i blocchi ') + Bb.join(', ') + '. La bitmap, dal blocco 20 al 27, è ' + bit.join(' ') + '. ' + (cosa === 0 ? 'Quanti bit deve modificare la riparazione?' : 'Quanti blocchi orfani trova il verificatore?'), segnaposto: 'Un numero', giuste,
        ok: 'Blocchi in uso segnati liberi: ' + el(scoperti) + '. Blocchi orfani: ' + el(orfani) + '.' + (cosa === 0 ? ' Bit da modificare: ' + v + '.' : ''),
        diagnosi: DIAG(giuste, cosa === 0 ? [
          { se: I(orfani.length), msg: 'Questi sono soltanto i blocchi orfani. Vanno corretti anche i bit a 0 dei blocchi che hanno un proprietario.' },
          { se: I(scoperti.length), msg: 'Questi sono soltanto i blocchi in uso segnati liberi. Vanno corretti anche i bit a 1 dei blocchi senza proprietario.' },
          { se: I(bit.filter((x) => x === 1).length), msg: 'Questi sono i bit a 1. La domanda riguarda i bit in disaccordo con gli inode.' }
        ] : [
          { se: I(scoperti.length), msg: 'Questi sono i blocchi in uso segnati liberi. Un blocco orfano ha il bit a 1 e nessun proprietario.' },
          { se: I(orfani.length + scoperti.length), msg: 'Queste sono tutte le discordanze. Un blocco orfano ha il bit a 1 e nessun proprietario.' },
          { se: I(bit.filter((x) => x === 0).length), msg: 'Questi sono i bit a 0. Un blocco orfano ha il bit a 1 e nessun proprietario.' }
        ]),
        altro: 'Il numero è diverso. Si scriva per ogni blocco il proprietario trovato negli inode, e lo si confronti con il bit.',
        indizi: ['Blocchi con un proprietario: ' + A.concat(Bb).sort((x, y) => x - y).join(', ') + '.', 'Bit a 1 nella bitmap: ' + el(B.filter((b, j) => bit[j] === 1)) + '.', 'In uso con bit a 0: ' + el(scoperti) + '. Senza proprietario con bit a 1: ' + el(orfani) + '.'],
        svolgimento: ['In uso secondo gli inode: ' + A.concat(Bb).sort((x, y) => x - y).join(', ') + '.', 'In uso segnati liberi: ' + el(scoperti) + '.', 'Orfani: ' + el(orfani) + '.', cosa === 0 ? 'Bit da modificare: ' + v + '.' : 'Blocchi orfani: ' + v + '.'] };
    },
    // 6.6.3 · valore di un blocco dopo il recupero dal journal
    (r) => {
      const c = r.mescola([1, 2, 3, 4, 5, 6, 7, 8, 9]), a0 = c[0], a1 = c[1], b0 = c[2], b1 = c[3], st = r.int(0, 4), chi = r.int(0, 1), nome = chi === 0 ? 'X' : 'Y', vecchio = chi === 0 ? a0 : b0, nuovo = chi === 0 ? a1 : b1, v = st >= 2 ? nuovo : vecchio, giuste = I(v);
      const sede = chi === 0 ? (st >= 3 ? a1 : a0) : (st >= 4 ? b1 : b0);
      return { u: '6.6.3', d: 'Una transazione deve portare X da ' + a0 + ' a ' + a1 + ' e Y da ' + b0 + ' a ' + b1 + '. I passi sono, nell’ordine: record nel journal, commit, copia di X, copia di Y. Il crash cade ' + ['prima del primo passo', 'subito dopo la scrittura dei record', 'subito dopo il commit', 'subito dopo la copia di X', 'subito dopo la copia di Y'][st] + '. Dopo il recupero, quanto vale ' + nome + '?', segnaposto: 'Un numero', giuste,
        ok: st >= 2 ? 'Il commit è durevole: il recupero riapplica i due record, e ' + nome + ' vale ' + nuovo + '.' : 'Il commit manca: la transazione viene scartata, e ' + nome + ' resta ' + vecchio + '.',
        diagnosi: DIAG(giuste, [
          st >= 2 ? { se: I(vecchio), msg: (sede === vecchio ? 'Questo è il valore sul disco al momento del crash. ' : '') + 'Il commit era durevole: il recupero riapplica tutti i record del journal.' } : { se: I(nuovo), msg: 'Senza commit la transazione viene scartata' + (st === 1 ? ', anche se i record erano già nel journal.' : '.') },
          { se: I(chi === 0 ? (st >= 2 ? b1 : b0) : (st >= 2 ? a1 : a0)), msg: 'Questo è il valore dell’altro blocco. La domanda riguarda ' + nome + '.' }
        ]),
        altro: 'Il numero è diverso. Guarda se il commit era durevole al momento del crash.',
        indizi: ['Il commit è il secondo passo.', st >= 2 ? 'Al momento del crash il commit era durevole.' : 'Al momento del crash il commit mancava.', st >= 2 ? 'Il recupero riapplica i record: ' + nome + ' = ' + nuovo + '.' : 'La transazione viene scartata: ' + nome + ' = ' + vecchio + '.'],
        svolgimento: [st >= 2 ? 'Commit presente: si riapplicano i record.' : 'Commit assente: la transazione si scarta.', nome + ' = ' + v + '.'] };
    },
    // 6.6.4 · scritture del journaling completo, di quello ordinato, oppure la differenza
    (r) => {
      const d = r.int(2, 12); let m = r.int(2, 6); if (m === d) m = m === 6 ? 5 : m + 1;
      const cosa = r.int(0, 2), completo = 2 * (d + m), ordinato = d + 2 * m, v = cosa === 0 ? completo : cosa === 1 ? ordinato : completo - ordinato, giuste = I(v);
      return { u: '6.6.4', d: 'Un aggiornamento comprende ' + d + ' blocchi di dati e ' + m + ' blocchi di metadati. ' + (cosa === 0 ? 'Quante scritture di blocco richiede il journaling completo, senza contare il commit?' : cosa === 1 ? 'Quante scritture di blocco richiede il journaling ordinato, senza contare il commit?' : 'Quante scritture di blocco risparmia il journaling ordinato rispetto a quello completo?'), segnaposto: 'Un numero', giuste,
        ok: 'Completo: 2 × (' + d + ' + ' + m + ') = ' + completo + '. Ordinato: ' + d + ' + 2 × ' + m + ' = ' + ordinato + '.' + (cosa === 2 ? ' Risparmio: ' + v + ', quanti i blocchi di dati.' : ''),
        diagnosi: DIAG(giuste, cosa === 0 ? [
          { se: I(d + m), msg: 'Questi sono i blocchi. Nel journaling completo ciascuno viene scritto due volte.' },
          { se: I(ordinato), msg: 'Questo è il conto del journaling ordinato. In quello completo anche i dati passano dal journal.' },
          { se: I(2 * d + m), msg: 'A essere scritti due volte sono tutti i blocchi, metadati compresi.' }
        ] : cosa === 1 ? [
          { se: I(d + m), msg: 'Questi sono i blocchi. I metadati passano dal journal, e vengono scritti due volte.' },
          { se: I(completo), msg: 'Questo è il conto del journaling completo. In quello ordinato i dati vengono scritti una volta sola.' },
          { se: I(2 * d + m), msg: 'A passare dal journal sono i metadati. I dati vengono scritti una volta sola.' }
        ] : [
          { se: I(m), msg: 'I metadati vengono scritti due volte in entrambe le modalità. A cambiare è il trattamento dei dati.' },
          { se: I(ordinato), msg: 'Queste sono le scritture del journaling ordinato. La domanda riguarda la differenza.' },
          { se: I(completo), msg: 'Queste sono le scritture del journaling completo. La domanda riguarda la differenza.' }
        ]),
        altro: 'Il numero è diverso. Conta quante volte viene scritto ogni blocco di dati, e quante ogni blocco di metadati.',
        indizi: ['Completo: ogni blocco due volte. Ordinato: i dati una volta, i metadati due.', 'Completo: 2 × ' + (d + m) + ' = ' + completo + '.', 'Ordinato: ' + d + ' + ' + 2 * m + ' = ' + ordinato + '.'],
        svolgimento: ['Completo: ' + completo + '.', 'Ordinato: ' + ordinato + '.'].concat(cosa === 2 ? ['Differenza: ' + v + '.'] : []) };
    }
  ] });
})();
