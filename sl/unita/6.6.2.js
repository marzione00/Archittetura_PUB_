'use strict';
SL.unita662 = (() => {
  const BLOCCHI = [10, 11, 12, 13, 14, 15];
  const inode = (p) => ({ A: [10, 11], B: p.own === 'si' ? [12, 13] : [13] });
  // bit della bit map: 1 se il blocco è libero, 0 se è occupato
  const bitmap = (p) => ({ 10: 0, 11: 0, 12: p.bit, 13: 0, 14: 1, 15: 1 });
  const padrone = (p, b, fino) => { const I = inode(p); if (fino >= 1 && I.A.indexOf(b) >= 0) return 'A'; if (fino >= 2 && I.B.indexOf(b) >= 0) return 'B'; return ''; };
  const esito = (p) => (p.own === 'si' && p.bit === 1 ? 'zero' : p.own === 'no' && p.bit === 0 ? 'uno' : 'nulla');
  // f: 0 situazione · 1 scansione di A · 2 scansione di B · 3 confronto · 4 riparazione
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], I = inode(p), bm = bitmap(p), wc = (o.w - 5 * 6) / 6, w3 = (o.w - 20) / 3, e = esito(p);
    els.push(el.nota(pre + 't', o.x, o.y, 'I BLOCCHI · in ciascuno il bit della bit map, sotto il proprietario negli inode', 'mono'));
    BLOCCHI.forEach((b, k) => { const pd = padrone(p, b, f >= 2 ? 2 : f), bit = f >= 4 && b === 12 && e !== 'nulla' ? (e === 'uno' ? 1 : 0) : bm[b], atteso = padrone(p, b, 2) ? 0 : 1, diverso = f >= 3 && bm[b] !== atteso;
      els.push(el.cella(pre + 'b' + b, o.x + k * (wc + 6), o.y + 44, wc, 34, String(bit), diverso ? (f >= 4 ? 'att' : 'err') : (f === 1 && I.A.indexOf(b) >= 0) || (f === 2 && I.B.indexOf(b) >= 0) ? 'att' : bit ? 'zero' : 'on', { so: 'blocco ' + b, gi: f >= 1 ? (pd ? 'inode ' + pd : f >= 2 ? 'nessuno' : '') : '', piccola: true })); });
    els.push(el.box(pre + 'a', o.x, o.y + 110, w3, 54, 'inode A · blocchi', I.A.join(', '), f === 1 ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'c', o.x + w3 + 10, o.y + 110, w3, 54, 'inode B · blocchi', I.B.join(', '), f === 2 ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'm', o.x + 2 * (w3 + 10), o.y + 110, w3, 54, 'bit modificati', f >= 4 ? (e === 'nulla' ? '0' : '1') : f >= 3 ? (e === 'nulla' ? 'nessuna discordanza' : 'una discordanza') : '·', f >= 3 ? (e === 'nulla' ? 'on' : f >= 4 ? 'att' : 'err') : '', { cls: 'stretta' }));
    return els;
  };
  return { BLOCCHI, inode, bitmap, esito, quadro };
})();
SL.registra('6.6.2', {
  titolo: 'Ricostruzione e riparazione',
  obiettivo: 'Obiettivo: controllare un volume dopo un crash, ricostruendo dagli inode l’elenco dei blocchi in uso, confrontandolo con la bit map, e stabilendo la correzione di ogni discordanza.',
  concetti: [['lente', 'Rileggere tutti gli inode'], ['bilancio', 'Confrontare con la bit map'], ['scudo', 'Correggere la mappa']],
  filigrana: ['lente', 'bit', 'inode'],
  richiami: {
    carte: [
      { sim: 'conflitto', da: 'Dall’unità 6.6.1', t: 'Le due incoerenze', d: 'Un blocco occupato senza proprietario è perso. Un blocco con proprietario segnato libero rischia di essere assegnato due volte.' },
      { sim: 'bilancio', da: 'Dall’unità 6.5.4', t: 'La contabilità dei blocchi', d: 'Bit map e file devono descrivere i medesimi blocchi occupati.' },
      { sim: 'inode', da: 'Dall’unità 6.5.3', t: 'L’indice dei blocchi', d: 'L’inode elenca i blocchi che contengono i dati del file.' }
    ],
    domanda: { d: 'Prima di proseguire: secondo la bit map il blocco 12 è libero, e un inode lo indica fra i propri blocchi. Qual è il rischio?', o: [
      { t: 'Il blocco può essere assegnato a un altro file, che sovrascriverebbe i dati', ok: true, fb: 'Per l’allocatore dello spazio, un bit a 1 significa «disponibile».' },
      { t: 'Nessuno, poiché i dati sono protetti dall’inode', fb: 'L’inode contiene il riferimento, mentre i dati si trovano nel blocco, che risulta libero.' },
      { t: 'Lo spreco di un blocco', fb: 'Lo spreco è il caso opposto: bit a 0 senza proprietario.' }
    ] }
  },
  idea: {
    titolo: 'Il ricalcolo completo della contabilità',
    termini: ['fsck', 'blocco orfano'],
    testo: [
      'Dopo un crash le strutture del volume possono discordare. Un file system può rimediare al riavvio con un programma che rilegge l’intero volume e ripristina la coerenza fra le strutture. Nei sistemi Unix tale verificatore prende il nome di [[fsck]], da file system check. Il verificatore non considera attendibili i dati riassuntivi, e li ricalcola a partire dalle strutture primarie.',
      'Le strutture primarie sono, in questo caso, gli inode. Il verificatore assume una fonte come attendibile, e nel modello del corso tale fonte è costituita dai riferimenti scritti negli inode. Il verificatore li percorre tutti, e per ogni blocco indicato annota il file proprietario. Al termine dispone di un elenco ricostruito dei blocchi in uso, ciascuno con il proprio file.',
      'Il verificatore confronta quindi l’elenco con la bit map, blocco per blocco. Dove le due fonti concordano non occorre alcuna correzione. Dove discordano, i casi sono due. Nel primo un inode indica il blocco, e il bit vale 1: il blocco è in uso e risulta libero, e potrebbe essere assegnato una seconda volta. La correzione consiste nel porre il bit a 0.',
      { fig: 'scena', w: 720, h: 172, titolo: 'Il blocco 12 ha un proprietario, e la bit map lo indica come libero', nota: 'La scansione degli inode trova il blocco 12 fra quelli di B. Il suo bit vale 1: è la discordanza da correggere.', els: SL.unita662.quadro('g', { own: 'si', bit: 1 }, 3, { x: 10, y: 4, w: 700 }) },
      'Il secondo caso è l’opposto: il bit vale 0, e nessun inode indica il blocco. Si tratta di un [[blocco orfano]], lo spazio perso dell’unità precedente. Il verificatore del modello lo restituisce allo spazio libero, ponendo il bit a 1. In entrambi i casi è corretta la bit map, per renderla coerente con gli inode.',
      'Il metodo ha due limiti. Il primo è il tempo: occorre leggere ogni inode del volume, e su un disco di grandi dimensioni possono essere necessarie ore. Il secondo è che il verificatore ripristina la coerenza fra le strutture, senza conoscere lo scopo dell’operazione interrotta. Un blocco orfano liberato poteva contenere dati appena scritti, che vanno perduti. Per questa ragione i file system moderni impiegano una tecnica diversa, argomento delle due unità successive, e riservano la scansione completa ai casi estremi.'
    ]
  },
  esperimento: {
    faremo: [
      'Un volume con sei blocchi e due file. Dopo un crash, il bit del blocco 12 e i riferimenti degli inode possono discordare. I controlli fissano la presenza del blocco 12 in un inode, e il valore del suo bit.',
      'L’esperimento percorre i due inode annotando i proprietari, e quindi confronta l’elenco con la bit map. Le combinazioni sono quattro: due sono coerenti, e due richiedono correzioni opposte.'
    ],
    vedrai: [
      ['bit', 'I blocchi', 'In alto: sei blocchi. All’interno di ciascuno il bit della bit map, sotto il proprietario trovato dalla scansione.'],
      ['inode', 'Gli inode', 'In basso: i blocchi indicati dai due inode, e il numero di bit corretti.']
    ]
  },
  lab: {
    titolo: 'Controllare un volume dopo un crash',
    scena: { w: 860, h: 172 },
    atti: ['Dopo il crash', 'La scansione', 'Il confronto', 'La riparazione'],
    controlli: [
      { id: 'own', tipo: 'scelta', eti: 'Un inode indica il blocco 12', opzioni: [['si', 'sì, è fra i blocchi di B'], ['no', 'no, nessun inode lo indica']], valore: 'si' },
      { id: 'bit', tipo: 'scelta', eti: 'Bit del blocco 12 nella bit map', opzioni: [[1, '1 · libero'], [0, '0 · occupato']], valore: 1 }
    ],
    nota: 'I passi sono sempre sei. Il modello considera attendibili gli inode, e ammette un solo proprietario per blocco.',
    previsione: {
      domanda: (p) => 'Dopo un crash, il verificatore percorre gli inode e ' + (p.own === 'si' ? 'trova il blocco 12 fra quelli del file B' : 'non trova il blocco 12 in nessun inode') + '. Nella bit map il bit del blocco 12 vale ' + p.bit + '. Quale azione compie la riparazione?',
      opzioni: () => [['uno', 'Pone il bit a 1'], ['zero', 'Pone il bit a 0'], ['nulla', 'Nessuna modifica alla bit map']]
    },
    confronto: (pred, esito, p) => { const N = { uno: 'pone il bit a 1', zero: 'pone il bit a 0', nulla: 'non modifica la bit map' }; return 'La previsione indicava che la riparazione «' + N[pred] + '». La riparazione ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'zero' ? 'Il blocco ha un proprietario, e va protetto: con il bit a 1 potrebbe essere assegnato a un altro file.' : esito === 'uno' ? 'Nessun inode indica il blocco: è orfano, ed è restituito ai blocchi liberi.' : 'Bit e proprietario concordano già: ' + (p.own === 'si' ? 'il blocco è in uso e segnato occupato.' : 'il blocco è libero e senza proprietario.')); },
    costruisci(p) {
      const U = SL.unita662, passi = [], I = U.inode(p), e = U.esito(p);
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Proprietario del 12', f >= 2 ? (p.own === 'si' ? 'B' : 'nessuno') : '·', 'a'], ['Bit del 12', f >= 4 && e !== 'nulla' ? (e === 'uno' ? '1' : '0') : String(p.bit)], ['Bit modificati', f >= 4 ? (e === 'nulla' ? '0' : '1') : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'Dopo il crash', 'Il sistema è riavviato dopo un arresto improvviso. La bit map indica i blocchi occupati, e tuttavia potrebbe riflettere uno stato precedente, oppure successivo, rispetto agli inode. Il verificatore non la considera attendibile.', {});
      P(1, 1, 'Scansione dell’inode A', 'Il verificatore legge l’inode A, che indica i blocchi 10 e 11, e annota A come proprietario di entrambi.', { calc: 'A → 10, 11' });
      P(2, 1, 'Scansione dell’inode B', 'Il verificatore legge l’inode B, che indica ' + (p.own === 'si' ? 'i blocchi 12 e 13' : 'il blocco 13') + '. La scansione è terminata: i blocchi ' + (p.own === 'si' ? '14 e 15' : '12, 14 e 15') + ' sono privi di proprietario.', { calc: 'B → ' + I.B.join(', '), chiedi: { d: 'Secondo gli inode, il blocco 12 è in uso?', o: ['Sì, lo indica B', 'No, nessun inode lo indica'], g: p.own === 'si' ? 0 : 1, no: p.own === 'si' ? 'Il 12 compare fra i blocchi dell’inode B.' : 'Né A né B indicano il blocco 12.' } });
      P(3, 2, 'Il confronto con la bit map', 'Per ogni blocco il verificatore confronta il bit con il proprietario trovato. I blocchi 10, 11 e 13 hanno un proprietario e il bit a 0. I blocchi 14 e 15 sono senza proprietario, e hanno il bit a 1. Il blocco 12 ' + (p.own === 'si' ? 'ha un proprietario' : 'è privo di proprietario') + ', e il suo bit vale ' + p.bit + '. ' + (e === 'nulla' ? 'Le due informazioni concordano.' : 'Le due informazioni discordano.'), { calc: 'blocco 12: ' + (p.own === 'si' ? 'proprietario B' : 'nessun proprietario') + ' · bit ' + p.bit });
      P(4, 3, 'La riparazione', e === 'zero' ? 'Il blocco 12 è in uso e risultava libero. Il verificatore pone il bit a 0: da questo momento il blocco non può essere assegnato a un altro file.' : e === 'uno' ? 'Il blocco 12 risultava occupato, ed è privo di proprietario: è un blocco orfano. Il verificatore pone il bit a 1, e lo restituisce allo spazio libero.' : 'Nessuna correzione è necessaria. Il numero di bit modificati è zero: anche questo è un esito del controllo, ed è il più frequente.', { calc: e === 'nulla' ? 'bit modificati: 0' : 'bit del blocco 12: ' + p.bit + ' → ' + (e === 'uno' ? 1 : 0) });
      P(4, 3, 'Il volume è coerente', 'Al termine ogni blocco con un proprietario ha il bit a 0, e ogni blocco privo di proprietario ha il bit a 1. ' + (e === 'uno' ? 'Se il blocco 12 conteneva dati appena scritti da un’operazione interrotta, tali dati sono perduti: il verificatore ripristina la coerenza fra le strutture, e ignora lo scopo dell’operazione.' : e === 'zero' ? 'Il file B conserva il suo blocco. Resta indeterminato se il blocco contenga i dati corretti: il verificatore non dispone di tale informazione.' : 'Il volume era già coerente.'), { esito: [e === 'uno' ? 'bit posto a 1' : e === 'zero' ? 'bit posto a 0' : 'nessuna modifica', e === 'nulla' ? 'si' : ''] });
      return { passi, esito: e };
    }
  },
  bilancio: {
    regola: [
      'Si percorrono tutti gli inode, annotando il proprietario di ogni blocco, e quindi si confronta l’elenco con la bit map.',
      'Bit map: 1 se il blocco è libero, 0 se è occupato. Proprietario e bit a 1: il bit è posto a 0. Nessun proprietario e bit a 0: il blocco è orfano, e il bit è posto a 1.'
    ],
    errori: [
      ['Correggere gli inode per renderli coerenti con la bit map.', 'Nel modello la fonte attendibile è costituita dagli inode: è ricalcolata la bit map.'],
      ['Attendersi sempre una correzione.', 'Se bit e proprietario concordano, i bit modificati sono zero.'],
      ['Ritenere che la riparazione recuperi i dati.', 'Il verificatore rende coerenti le strutture. I dati di un’operazione interrotta possono andare perduti.']
    ],
    saFare: ['Ricostruire i proprietari dei blocchi dagli inode.', 'Determinare le discordanze con la bit map.', 'Individuare la correzione per ciascun tipo di discordanza.'],
    esercizi: [
      { d: 'Gli inode di un volume indicano i blocchi 3, 4, 7 e 9. La bit map ha a 0 i bit dei blocchi 3, 4, 5 e 9, e a 1 quelli di tutti gli altri. Quanti bit deve modificare il verificatore?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: 'Il blocco 7 ha un proprietario e il bit a 1, mentre il blocco 5 ha il bit a 0 e nessun proprietario: le correzioni sono due.',
        diagnosi: [
          { se: ['1', 'uno'], msg: 'Le discordanze sono due, di tipo opposto: vanno considerati sia il blocco 5 sia il blocco 7.' },
          { se: ['4', 'quattro'], msg: 'I blocchi 3, 4 e 9 concordano già.' },
          { se: ['0', 'zero'], msg: 'Il blocco 7 è in uso e risulta libero, e il blocco 5 risulta occupato senza proprietario.' }
        ],
        altro: 'Il numero è diverso. Si confronti, blocco per blocco, il bit con la presenza di un proprietario.',
        indizi: ['Blocchi 3, 4, 9: proprietario e bit a 0, concordi.', 'Blocco 7: proprietario, bit a 1.', 'Blocco 5: nessun proprietario, bit a 0.'],
        svolgimento: ['Blocco 7: il bit è posto a 0.', 'Blocco 5: il bit è posto a 1.', 'Bit modificati: 2.'] },
      { d: 'Nel medesimo volume, quale blocco è orfano?', segnaposto: 'Un numero', giuste: ['5', 'cinque'],
        ok: 'Il blocco 5 è segnato occupato, e nessun inode lo indica.',
        diagnosi: [
          { se: ['7', 'sette'], msg: 'Il blocco 7 ha un proprietario: è il caso opposto, in uso e segnato libero.' }
        ],
        altro: 'Il numero è diverso. Si individui un blocco con il bit a 0 assente dagli inode.',
        indizi: ['Bit a 0: blocchi 3, 4, 5, 9.', 'Indicati dagli inode: 3, 4, 7, 9.', 'Il 5 ha il bit a 0 ed è assente dagli inode.'],
        svolgimento: ['Bit a 0 senza proprietario: blocco 5.'] },
      { d: 'Per quale ragione una scansione completa del volume è un rimedio costoso?', guida: 'Si scelga la risposta.', o: [
        { t: 'La scansione deve leggere tutti gli inode, anche se l’operazione interrotta ne modificava uno solo', ok: true, fb: 'Il tempo dipende dalla dimensione del volume, qualunque sia il danno.' },
        { t: 'La scansione cancella tutti i file', fb: 'La scansione legge gli inode e corregge la bit map, senza modificare i file.' },
        { t: 'La scansione richiede un secondo disco', fb: 'Il controllo è eseguito sul volume stesso.' }] }
    ],
    sfida: ['cslez6_6_02_fsck', 'Controllo con fsck']
  }
});
