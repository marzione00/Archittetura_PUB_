'use strict';
/* Prova del capitolo 6.4: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const NS = (v) => I(v).concat([v + ' ns', v + 'ns']);
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const H = (v) => '0x' + v.toString(16).toUpperCase();
  const HEX = (v) => ['0x' + v.toString(16), H(v), v.toString(16), v.toString(16).toUpperCase(), v.toString(16) + 'h'];

  SL.registraProva('6.4', { domande: [
    // 6.4.1 · miss di una sequenza di richieste in una TLB con ASID e LRU
    (r) => {
      const cap = r.int(1, 2), n = r.int(4, 5), rich = []; for (let k = 0; k < n; k++) rich.push([r.scegli(['A', 'B']), r.scegli([3, 3, 4])]);
      const voci = []; let miss = 0; const righe = rich.map((q, t) => { const chiave = q[0] + q[1], i = voci.findIndex((x) => x.k === chiave); if (i >= 0) { voci[i].t = t; return q[0] + ' pagina ' + q[1] + ': hit.'; } miss++; let fuori = ''; if (voci.length === cap) { let v = 0; voci.forEach((x, j) => { if (x.t < voci[v].t) v = j; }); fuori = voci[v].k; voci.splice(v, 1); } voci.push({ k: chiave, t }); return q[0] + ' pagina ' + q[1] + ': miss' + (fuori ? ', esce la voce di ' + fuori[0] + ' pagina ' + fuori[1] + '.' : '.'); });
      const giuste = I(miss), distinte = new Set(rich.map((q) => q[0] + q[1])).size, soloPagine = new Set(rich.map((q) => q[1])).size;
      return { u: '6.4.1', d: 'Una TLB ha ' + (cap === 1 ? 'una voce' : 'due voci') + ' con ASID, ed è vuota. Quando è piena esce la voce usata meno di recente. Le richieste sono, nell’ordine: ' + rich.map((q) => q[0] + ' pagina ' + q[1]).join(', ') + '. Quanti miss avvengono?', segnaposto: 'Un numero', giuste,
        ok: 'Confrontando ogni volta processo e pagina con le voci presenti, i miss sono ' + miss + '.',
        diagnosi: DIAG(giuste, [
          { se: I(soloPagine), msg: 'Hai confrontato soltanto il numero di pagina. La stessa pagina, in due processi, richiede due voci distinte.' },
          { se: I(distinte), msg: 'Questo è il numero delle coppie diverse. Una voce scacciata e richiesta di nuovo provoca un altro miss.' },
          { se: I(n - miss), msg: 'Questo è il numero degli hit. La domanda riguarda i miss.' },
          { se: I(n), msg: 'Una richiesta che ritrova la propria voce nella TLB è un hit.' }
        ]),
        altro: 'Il numero è diverso. Si tenga l’elenco delle voci presenti, ciascuna con processo, pagina e ultimo uso.',
        indizi: ['Un hit richiede che coincidano sia il processo sia la pagina.', 'La TLB contiene al massimo ' + (cap === 1 ? 'una voce.' : 'due voci.'), righe.join(' ')],
        svolgimento: righe.concat(['Miss: ' + miss + '.']) };
    },
    // 6.4.2 · byte di una tabella lineare oppure di una a due livelli
    (r) => {
      const bit = r.scegli([32, 30, 28, 26]), vpn = bit - 12, nf = Math.pow(2, Math.floor(vpn / 2)), nr = Math.pow(2, vpn - Math.floor(vpn / 2)), reg = r.int(1, 9), lin = Math.pow(2, vpn) * 8, due = (nr + reg * nf) * 8;
      if (r.int(0, 2) === 0) { const giuste = I(lin);
        return { u: '6.4.2', d: 'Indirizzi virtuali di ' + bit + ' bit, pagine da 4096 byte, voci da 8 byte. Quanti byte occupa una tabella delle pagine lineare?', segnaposto: 'Un numero', giuste,
          ok: 'Le pagine sono 2 alla ' + vpn + ' = ' + Math.pow(2, vpn) + ', e ogni voce occupa 8 byte: ' + lin + ' byte.',
          diagnosi: DIAG(giuste, [
            { se: I(Math.pow(2, vpn)), msg: 'Queste sono le voci. Ogni voce occupa 8 byte.' },
            { se: I(Math.pow(2, vpn) * 4096), msg: 'Questo è il numero dei byte dello spazio di indirizzamento. La tabella ha una voce da 8 byte per pagina.' }
          ]),
          altro: 'Il numero è diverso. Si calcoli 2 elevato ai bit del numero di pagina, e si moltiplichi per 8.',
          indizi: ['Bit del numero di pagina: ' + bit + ' − 12 = ' + vpn + '.', '2 alla ' + vpn + ' = ' + Math.pow(2, vpn) + ' voci.', Math.pow(2, vpn) + ' × 8 = ' + lin + '.'],
          svolgimento: ['Voci: ' + Math.pow(2, vpn) + '.', 'Byte: ' + lin + '.'] }; }
      const giuste = I(due);
      return { u: '6.4.2', d: 'Una tabella a due livelli ha una radice di ' + nr + ' voci e tabelle figlie di ' + nf + ' voci, con voci da 8 byte. Il programma usa ' + (reg === 1 ? 'una sola regione' : reg + ' regioni') + '. Quanti byte occupano in tutto le tabelle?', segnaposto: 'Un numero', giuste,
        ok: '(' + nr + ' + ' + reg + ' × ' + nf + ') × 8 = ' + due + ' byte.',
        diagnosi: DIAG(giuste, [
          { se: I(reg * nf * 8), msg: 'Manca la radice: ' + nr + ' voci, cioè ' + nr * 8 + ' byte.' },
          { se: I(nr + reg * nf), msg: 'Queste sono le voci. Ogni voce occupa 8 byte.' },
          { se: I(lin), msg: 'Questo è lo spazio della tabella lineare, con una voce per ogni pagina possibile.' },
          { se: I((nr + nf) * 8), msg: 'Le figlie sono ' + reg + ', una per ogni regione usata.' }
        ]),
        altro: 'Il numero è diverso. Somma le voci della radice e delle figlie, e moltiplica per 8.',
        indizi: ['Radice: ' + nr + ' voci.', 'Figlie: ' + reg + ' × ' + nf + ' = ' + reg * nf + ' voci.', (nr + reg * nf) + ' × 8 = ' + due + '.'],
        svolgimento: ['Voci: ' + nr + ' + ' + reg * nf + ' = ' + (nr + reg * nf) + '.', 'Byte: ' + due + '.'] };
    },
    // 6.4.3 · indirizzo della foglia, indirizzo fisico, oppure un campo dell'indirizzo
    (r) => {
      const i = r.int(1, 15), j = r.int(1, 15), off = r.int(1, 4095), fig = r.scegli([0x200000, 0x306000, 0x40A000, 0x518000]), pfn = r.int(2, 60), va = i * 4194304 + j * 4096 + off, cosa = r.int(0, 2);
      if (cosa === 0) { const a2 = fig + 8 * j, giuste = HEX(a2);
        return { u: '6.4.3', d: 'In una traduzione a due livelli, con voci da 8 byte, la voce della radice contiene ' + H(fig) + ': è la base della tabella figlia. L’indice L2 vale ' + j + '. A quale indirizzo si legge la voce foglia? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1000', giuste,
          ok: j + ' × 8 = ' + 8 * j + ' = ' + H(8 * j) + ': la foglia sta a ' + H(a2) + '.',
          diagnosi: DIAG(giuste, [
            { se: HEX(fig + j), msg: 'Ogni voce occupa 8 byte: l’indice va moltiplicato per 8.' },
            { se: HEX(0x100000 + 8 * j), msg: 'La seconda lettura parte dalla base della figlia, ' + H(fig) + '.' },
            { se: HEX(fig + 8 * i), msg: 'Nella figlia si usa l’indice L2, ' + j + '.' }
          ]),
          altro: 'L’indirizzo è diverso. Somma alla base della figlia 8 volte l’indice L2.',
          indizi: [j + ' × 8 = ' + 8 * j + '.', 8 * j + ' in esadecimale è ' + H(8 * j) + '.', H(fig) + ' + ' + H(8 * j) + ' = ' + H(a2) + '.'],
          svolgimento: ['Spostamento: ' + H(8 * j) + '.', 'Indirizzo della foglia: ' + H(a2) + '.'] }; }
      if (cosa === 1) { const foglia = 2 * pfn + 1, pa = pfn * 4096 + off, giuste = I(pa).concat(HEX(pa));
        return { u: '6.4.3', d: 'Al termine di un cammino a due livelli la voce foglia contiene ' + foglia + ', nel formato 2 × PFN + valid. Le pagine sono da 4096 byte, e l’offset dell’indirizzo virtuale è ' + off + '. Qual è, in decimale, l’indirizzo fisico?', segnaposto: 'Un numero', giuste,
          ok: 'Frame: (' + foglia + ' − 1) / 2 = ' + pfn + '. Indirizzo fisico: ' + pfn + ' × 4096 + ' + off + ' = ' + pa + '.',
          diagnosi: DIAG(giuste, [
            { se: I(foglia * 4096 + off), msg: 'Hai usato il valore della foglia come frame. Il frame è la metà intera: ' + pfn + '.' },
            { se: I(pfn * 4096), msg: 'Questo è l’inizio del frame ' + pfn + '. Aggiungi l’offset, ' + off + '.' },
            { se: I(pfn * 1024 + off), msg: 'Qui le pagine sono da 4096 byte.' }
          ]),
          altro: 'Il numero è diverso. Si ricavi il frame dalla foglia, poi si applichi frame × 4096 + offset.',
          indizi: ['Frame: (' + foglia + ' − 1) / 2 = ' + pfn + '.', pfn + ' × 4096 = ' + pfn * 4096 + '.', pfn * 4096 + ' + ' + off + ' = ' + pa + '.'],
          svolgimento: ['Frame: ' + pfn + '.', 'Indirizzo fisico: ' + pa + '.'] }; }
      const quale = r.int(0, 1), v = quale === 0 ? i : j, giuste = I(v);
      return { u: '6.4.3', d: 'Un indirizzo virtuale di 32 bit è diviso in tre campi: 10 bit di indice L1, 10 bit di indice L2, 12 bit di offset. L’indirizzo vale ' + va + ', cioè ' + i + ' × 4194304 + ' + j + ' × 4096 + ' + off + '. Quanto vale l’indice ' + (quale === 0 ? 'L1' : 'L2') + '?', segnaposto: 'Un numero', giuste,
        ok: 'L1 moltiplica 2 alla 22, L2 moltiplica 4096, e il resto è l’offset: L1 = ' + i + ', L2 = ' + j + '.',
        diagnosi: DIAG(giuste, [
          { se: I(quale === 0 ? j : i), msg: quale === 0 ? 'Questo è l’indice L2, che moltiplica 4096. L1 moltiplica 4194304.' : 'Questo è l’indice L1, che moltiplica 4194304. L2 moltiplica 4096.' },
          { se: I(off), msg: 'Questo è l’offset, cioè ciò che resta dopo avere tolto i contributi dei due indici.' }
        ]),
        altro: 'Il numero è diverso. Guarda quale fattore moltiplica 2 alla 22 e quale moltiplica 4096.',
        indizi: ['2 alla 22 vale 4194304.', 'L1 è il fattore di 4194304: ' + i + '.', 'L2 è il fattore di 4096: ' + j + '.'],
        svolgimento: ['L1: ' + i + '.', 'L2: ' + j + '.', 'Offset: ' + off + '.'] };
    },
    // 6.4.4 · costo di un miss, oppure tempo medio
    (r) => {
      const liv = r.int(2, 4), t = r.scegli([1, 2]), ram = r.scegli([40, 50, 100]), miss = r.scegli([2, 4, 10, 20]), cHit = t + ram, cMiss = t + liv * ram + ram, media = cHit + miss * liv * ram / 100;
      if (r.int(0, 1) === 0) { const giuste = NS(cMiss);
        return { u: '6.4.4', d: 'La TLB si consulta in ' + t + ' ns, e ogni lettura di memoria costa ' + ram + ' ns. La tabella delle pagine ha ' + liv + ' livelli. Quanto dura, in nanosecondi, un accesso in caso di miss della TLB?', segnaposto: 'Un numero', giuste,
          ok: t + ' + ' + liv + ' × ' + ram + ' + ' + ram + ' = ' + cMiss + ' ns.',
          diagnosi: DIAG(giuste, [
            { se: NS(t + liv * ram), msg: 'Manca la lettura del dato: dopo avere trovato il frame, il dato va ancora letto.' },
            { se: NS(liv * ram + ram), msg: 'Anche in un miss la TLB viene consultata per prima: ' + t + ' ns.' },
            { se: NS(cHit), msg: 'Questo è il tempo di un hit. In un miss vanno lette le tabelle, una voce per livello.' }
          ]),
          altro: 'Il valore è diverso. Somma la TLB, una lettura per livello e la lettura del dato.',
          indizi: ['TLB: ' + t + ' ns.', 'Tabelle: ' + liv + ' × ' + ram + ' = ' + liv * ram + ' ns.', 'Dato: ' + ram + ' ns. Totale ' + cMiss + ' ns.'],
          svolgimento: ['TLB: ' + t + ' ns.', 'Tabelle: ' + liv * ram + ' ns.', 'Dato: ' + ram + ' ns.', 'Totale: ' + cMiss + ' ns.'] }; }
      const giuste = NS(media);
      return { u: '6.4.4', d: 'La TLB si consulta in ' + t + ' ns, e ogni lettura di memoria costa ' + ram + ' ns. La tabella delle pagine ha ' + liv + ' livelli. Su cento accessi, ' + (100 - miss) + ' trovano la traduzione nella TLB. Qual è il tempo medio di un accesso, in nanosecondi?', segnaposto: 'Un numero', giuste,
        ok: 'Hit: ' + cHit + ' ns. Costo in più di un miss: ' + liv + ' × ' + ram + ' = ' + liv * ram + ' ns. Media: ' + cHit + ' + ' + String(miss / 100).replace('.', ',') + ' × ' + liv * ram + ' = ' + media + ' ns.',
        diagnosi: DIAG(giuste, [
          { se: NS(cHit), msg: 'Questo è il tempo di un hit. I ' + miss + ' miss su cento alzano la media.' },
          { se: NS(cMiss), msg: 'Questo è il tempo di un miss. I miss sono soltanto ' + miss + ' su cento.' },
          { se: NS(cHit + miss * cMiss / 100), msg: 'Il costo in più di un miss sono le sole letture delle tabelle: TLB e dato sono già contati nell’hit.' }
        ]),
        altro: 'Il valore è diverso. Si applichi costo di un hit + frazione di miss × livelli × tempo di una lettura.',
        indizi: ['Costo di un hit: ' + t + ' + ' + ram + ' = ' + cHit + ' ns.', 'Frazione di miss: ' + String(miss / 100).replace('.', ',') + '. Costo in più: ' + liv * ram + ' ns.', cHit + ' + ' + miss * liv * ram / 100 + ' = ' + media + ' ns.'],
        svolgimento: ['Hit: ' + (100 - miss) + ' × ' + cHit + ' = ' + (100 - miss) * cHit + ' ns.', 'Miss: ' + miss + ' × ' + cMiss + ' = ' + miss * cMiss + ' ns.', 'Media: ' + media + ' ns.'] };
    }
  ] });
})();
