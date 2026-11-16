'use strict';
SL.unita661 = (() => {
  const NOMI = { d: 'dati', b: 'bit map', i: 'inode' };
  const stato = (p, k) => { const fatte = p.ord.slice(0, k); return { d: fatte.indexOf('d') >= 0, b: fatte.indexOf('b') >= 0, i: fatte.indexOf('i') >= 0 }; };
  const diagnosi = (s) => (s.i && !(s.b && s.d) ? 'esposto' : !s.i && s.b ? 'perso' : 'coerente');
  // k: scritture durevoli mostrate · riavvio: mostra ciò che vede il file e la diagnosi
  const quadro = (pre, p, k, riavvio, o) => {
    const el = SL.el, els = [], s = stato(p, k), w3 = (o.w - 20) / 3, dg = diagnosi(s), ultima = k > 0 ? p.ord[k - 1] : '';
    els.push(el.nota(pre + 't', o.x, o.y, 'LE TRE SCRITTURE · nell’ordine in cui divengono durevoli', 'mono'));
    p.ord.split('').forEach((c, j) => els.push(el.cella(pre + 'o' + j, o.x + j * (w3 + 10), o.y + 24, w3, 32, NOMI[c], j < k ? (j === k - 1 && !riavvio ? 'att' : 'on') : riavvio ? 'err' : '', { gi: j < k ? 'durevole' : riavvio ? 'mai avvenuta' : 'da fare', piccola: true })));
    els.push(el.box(pre + 'd', o.x, o.y + 84, w3, 54, 'blocco 9 · contenuto', s.d ? 'byte nuovi' : 'byte precedenti', ultima === 'd' && !riavvio ? 'att' : s.d ? 'on' : 'zero', { cls: 'stretta' }));
    els.push(el.box(pre + 'b', o.x + w3 + 10, o.y + 84, w3, 54, 'bit map · bit del blocco 9', s.b ? '0 · occupato' : '1 · libero', ultima === 'b' && !riavvio ? 'att' : s.b ? 'on' : 'zero', { cls: 'stretta' }));
    els.push(el.box(pre + 'i', o.x + 2 * (w3 + 10), o.y + 84, w3, 54, 'inode · riferimento', s.i ? 'al blocco 9' : 'assente', ultima === 'i' && !riavvio ? 'att' : s.i ? 'on' : 'zero', { cls: 'stretta' }));
    els.push(el.box(pre + 'v', o.x, o.y + 148, (o.w - 10) / 2, 54, 'che cosa legge il file nel blocco 9', !riavvio ? '·' : !s.i ? 'nulla · non raggiunto' : s.d ? 'i byte nuovi' : 'i byte precedenti', !riavvio ? '' : s.i && !s.d ? 'err' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'g', o.x + (o.w - 10) / 2 + 10, o.y + 148, (o.w - 10) / 2, 54, 'stato dopo il riavvio', !riavvio ? '·' : dg === 'coerente' ? (k === 3 ? 'coerente · file esteso' : 'coerente · file invariato') : dg === 'perso' ? 'blocco occupato e irraggiungibile' : s.b ? 'il file espone byte precedenti' : 'file su un blocco segnato libero', !riavvio ? '' : dg === 'coerente' ? 'att' : 'err', { cls: 'stretta' }));
    return els;
  };
  return { NOMI, stato, diagnosi, quadro };
})();
SL.registra('6.6.1', {
  titolo: 'Perché la persistenza richiede un modello di consistenza',
  obiettivo: 'Obiettivo: ricostruire lo stato di un volume dopo un arresto improvviso, note le scritture già durevoli, e riconoscere le incoerenze che ne derivano.',
  concetti: [['storage', 'Tre scritture per una sola operazione'], ['conflitto', 'L’arresto avviene fra due scritture'], ['scudo', 'L’ordine determina il danno']],
  filigrana: ['storage', 'conflitto', 'journal'],
  richiami: {
    carte: [
      { sim: 'bit', da: 'Dall’unità 6.5.4', t: 'La bit map dei blocchi', d: 'Un bit per blocco: 1 se è libero, 0 se è assegnato a un file.' },
      { sim: 'inode', da: 'Dall’unità 6.5.1', t: 'L’inode', d: 'Contiene i metadati del file e i riferimenti ai suoi blocchi.' },
      { sim: 'bilancio', da: 'Dall’unità 6.5.4', t: 'La contabilità dei blocchi', d: 'Ogni blocco segnato come occupato deve appartenere a un file, e a uno soltanto.' }
    ],
    domanda: { d: 'Prima di proseguire: un file cresce di un blocco. Quante strutture diverse del volume vanno aggiornate?', o: [
      { t: 'Tre, cioè il blocco dei dati, la bit map e l’inode', ok: true, fb: 'I byte vanno scritti, il blocco va segnato occupato, e l’inode deve indicarlo.' },
      { t: 'Una, il blocco dei dati', fb: 'Senza l’aggiornamento di inode e bit map, il file non raggiungerebbe tali byte e il blocco risulterebbe libero.' },
      { t: 'Due, i dati e la directory', fb: 'Il nome del file resta invariato, mentre variano bit map e inode.' }
    ] }
  },
  idea: {
    titolo: 'Un’operazione, tre scritture, e un’interruzione dell’alimentazione',
    termini: ['crash', 'scrittura durevole', 'consistenza del file system'],
    testo: [
      'La memoria principale perde il proprio contenuto quando manca l’alimentazione, mentre il disco lo conserva. Un file system deve pertanto tollerare un evento che un programma ordinario può ignorare: l’arresto improvviso della macchina durante un’operazione. Tale evento è denominato [[crash]], qualunque ne sia la causa. Dopo il riavvio, del lavoro in corso resta soltanto quanto era già stato scritto sul disco.',
      'Una scrittura che sopravvive a un crash è detta [[scrittura durevole]]. In questo capitolo si assume che ogni singola scrittura di un blocco sia atomica: al riavvio risulta eseguita per intero, oppure non eseguita. La difficoltà deriva dal fatto che le operazioni utili richiedono più scritture. Per aggiungere un blocco a un file ne occorrono tre: i nuovi byte nel blocco, il bit della bit map che lo dichiara occupato, e il riferimento nell’inode. Il disco le esegue in successione, e il crash può avvenire fra due qualsiasi.',
      'Al riavvio sopravvive un prefisso della sequenza: le prime scritture, fino al punto dell’arresto. Le tre strutture possono allora descrivere stati diversi. Prende il nome di [[consistenza del file system]] la proprietà che ne garantisce la coerenza: ogni blocco raggiunto da un inode è segnato occupato, ogni blocco occupato appartiene a un file, e il contenuto che un file rende leggibile è costituito dai suoi dati.',
      { fig: 'scena', w: 720, h: 210, titolo: 'Ordine dati, bit map, inode: il crash dopo due scritture', nota: 'Il blocco 9 contiene i byte nuovi ed è segnato occupato. All’inode manca il riferimento: il blocco è perso, e nessun dato errato è visibile.', els: SL.unita661.quadro('g', { ord: 'dbi', k: 2 }, 2, true, { x: 10, y: 4, w: 700 }) },
      'Gli stati incoerenti sono di due specie, di gravità molto diversa. Se la bit map segna occupato un blocco che nessun inode indica, tale blocco è perso: lo spazio resta sprecato fino a quando un controllo lo recupera, e il danno è lieve. Se invece un inode indica un blocco che la bit map considera libero, il sistema può assegnare il medesimo blocco a un altro file, e i due file si sovrascriverebbero a vicenda. Se infine l’inode indica un blocco in cui i byte nuovi non sono mai stati scritti, il file espone byte precedenti, eventualmente appartenuti a un altro file.',
      'Poiché sopravvive un prefisso, l’ordine delle scritture determina gli stati intermedi possibili. Con l’inode scritto per ultimo, ogni arresto lascia al più un blocco perso: il riferimento compare soltanto quando i dati e il bit sono già durevoli. Con l’inode scritto per primo, ogni arresto intermedio espone un contenuto errato. La regola pratica consiste nel pubblicare un riferimento soltanto dopo avere reso durevole il contenuto a cui conduce.'
    ]
  },
  esperimento: {
    faremo: [
      'Un file cresce di un blocco, il 9, che inizialmente è libero e contiene byte precedenti. Occorrono tre scritture: dati, bit map, inode. I controlli fissano l’ordine in cui divengono durevoli, e il numero di scritture dopo il quale avviene il crash.',
      'L’esperimento ricostruisce le tre strutture nello stato in cui le trova il riavvio, e ne ricava la diagnosi. È istruttivo individuare un ordine che non esponga mai dati errati, in qualunque punto avvenga il crash.'
    ],
    vedrai: [
      ['riproduci', 'Le tre scritture', 'In alto: le scritture nell’ordine fissato. Sotto ciascuna è indicato se era già durevole al momento del crash.'],
      ['storage', 'Le tre strutture', 'Al centro: il contenuto del blocco 9, il suo bit nella bit map, e il riferimento nell’inode.'],
      ['lente', 'La diagnosi', 'In basso: ciò che il file legge nel blocco 9 dopo il riavvio, e lo stato del volume.']
    ]
  },
  lab: {
    titolo: 'Un crash fra tre scritture',
    scena: { w: 860, h: 212 },
    atti: ['Prima', 'Le scritture', 'Il crash', 'Il riavvio'],
    controlli: [
      { id: 'ord', tipo: 'scelta', eti: 'Ordine delle scritture', opzioni: [['dbi', 'dati, bit map, inode'], ['idb', 'inode, dati, bit map'], ['bid', 'bit map, inode, dati']], valore: 'dbi' },
      { id: 'k', tipo: 'scelta', eti: 'Scritture durevoli prima del crash', opzioni: [[0, '0'], [1, '1'], [2, '2'], [3, '3']], valore: 2 }
    ],
    nota: 'Il numero dei passi dipende dal punto del crash. Ogni singola scrittura è atomica: al riavvio risulta eseguita per intero, oppure non eseguita.',
    previsione: {
      domanda: (p) => { const N = SL.unita661.NOMI; return 'Per aggiungere il blocco 9 a un file occorrono tre scritture, che divengono durevoli in quest’ordine: ' + p.ord.split('').map((c) => N[c]).join(', ') + '. Il crash avviene quando ' + (p.k === 0 ? 'nessuna scrittura è' : p.k === 1 ? 'soltanto la prima è' : p.k === 2 ? 'le prime due sono' : 'tutte e tre sono') + ' durevol' + (p.k === 1 ? 'e' : p.k === 0 ? 'e' : 'i') + '. In quale stato si trova il volume al riavvio?'; },
      opzioni: () => [['coerente', 'Coerente, con il file invariato oppure esteso per intero'], ['perso', 'Un blocco segnato occupato, che nessun file raggiunge'], ['esposto', 'Il file raggiunge un blocco con byte precedenti, oppure segnato libero']]
    },
    confronto: (pred, esito, p) => { const N = { coerente: 'coerente', perso: 'con un blocco perso', esposto: 'con dati esposti' }, s = SL.unita661.stato(p, p.k); return 'La previsione indicava un volume ' + N[pred] + '. Al riavvio il volume è ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'coerente' ? (p.k === 0 ? 'Nessuna scrittura era durevole: il volume è invariato.' : p.k === 3 ? 'Le tre scritture erano tutte durevoli: l’operazione è completa.' : 'Sul disco sono stati scritti soltanto i dati, in un blocco ancora libero ed esterno a ogni file. Per il file system lo stato equivale a quello iniziale.') : esito === 'perso' ? 'La bit map segna occupato il blocco 9, e l’inode non lo indica ancora.' : s.b ? 'L’inode indica il blocco 9, in cui i byte nuovi non sono mai stati scritti.' : 'L’inode indica il blocco 9, che la bit map considera ancora libero.'); },
    costruisci(p) {
      const U = SL.unita661, passi = [], N = U.NOMI, fin = U.stato(p, p.k), dg = U.diagnosi(fin);
      const P = (k, riavvio, atto, titolo, testo, extra) => { const s = U.stato(p, k); passi.push(Object.assign({ atto, titolo, testo, hud: [['Dati', s.d ? 'nuovi' : 'precedenti', 'a'], ['Bit', s.b ? '0' : '1'], ['Riferimento', s.i ? 'sì' : 'no', 'c']], els: U.quadro('b', p, k, riavvio, { x: 20, y: 4, w: 820 }) }, extra)); };
      const D = { d: 'I nuovi byte sono scritti nel blocco 9, in luogo di quelli precedenti.', b: 'Il bit del blocco 9 nella bit map passa da 1 a 0: il blocco risulta occupato.', i: 'L’inode del file riceve il riferimento al blocco 9: da questo momento il file lo raggiunge.' };
      P(0, false, 0, 'Prima dell’operazione', 'Il blocco 9 è libero: il suo bit vale 0, nessun inode lo indica, e contiene byte precedenti, lasciati da un file cancellato. Un file è in procinto di crescere, e gli sarà assegnato il blocco 9.', {});
      for (let k = 1; k <= p.k; k++) P(k, false, 1, 'Scrittura ' + k + ' · ' + N[p.ord[k - 1]], D[p.ord[k - 1]] + ' La scrittura è durevole.', { calc: N[p.ord[k - 1]] + ': durevole' });
      P(p.k, true, 2, 'Il crash', 'La macchina si arresta. ' + (p.k === 3 ? 'Le tre scritture erano già tutte sul disco.' : p.k === 0 ? 'Nessuna scrittura era stata completata sul disco.' : 'Sul disco ' + (p.k === 1 ? 'era stata completata la prima scrittura' : 'erano state completate le prime due scritture') + '. ' + (p.k === 1 ? 'Le altre due non avverranno mai.' : 'La terza non avverrà mai.')), { calc: p.k + ' su 3 durevoli', chiedi: { d: 'Al riavvio, il file raggiunge il blocco 9?', o: ['Sì, l’inode lo indica', 'No, all’inode manca il riferimento'], g: fin.i ? 0 : 1, no: fin.i ? 'La scrittura dell’inode era fra quelle durevoli.' : 'La scrittura dell’inode non era ancora avvenuta.' } });
      P(p.k, true, 3, 'Il riavvio', dg === 'coerente' ? (p.k === 3 ? 'Dati, bit map e inode concordano: il blocco 9 contiene i byte nuovi, è occupato, e il file lo raggiunge. L’operazione è completa.' : p.k === 0 ? 'Le tre strutture sono invariate. Il file ha la lunghezza precedente: l’operazione risulta mai iniziata.' : 'I byte nuovi sono nel blocco 9, che tuttavia resta libero e irraggiungibile. Per il file system lo stato è invariato: il file è quello precedente, e tali byte saranno sovrascritti dal prossimo file a cui sarà assegnato il blocco.') : dg === 'perso' ? 'La bit map dichiara occupato il blocco 9, e nessun inode lo indica. Il blocco è perso: nessun file può impiegarlo né liberarlo, fino a quando un controllo del volume rileva l’anomalia. Nessun dato errato è visibile.' : fin.b ? 'L’inode indica il blocco 9, che è segnato occupato. I byte nuovi sono tuttavia assenti, poiché tale scrittura non è stata eseguita. In lettura il file espone i byte precedenti di un altro file.' : 'L’inode indica il blocco 9, che la bit map considera libero. Il sistema potrebbe assegnarlo a un altro file, e i due si sovrascriverebbero.' + (fin.d ? '' : ' Il blocco contiene inoltre ancora i byte precedenti.'), { esito: [dg === 'coerente' ? 'volume coerente' : dg === 'perso' ? 'blocco perso' : 'dati esposti', dg === 'coerente' ? 'si' : dg === 'perso' ? '' : 'no'] });
      return { passi, esito: dg };
    }
  },
  bilancio: {
    regola: [
      'Dopo un crash sopravvive un prefisso delle scritture: per ricostruire lo stato si considerano eseguite le prime, fino al punto dell’arresto.',
      'Un riferimento va reso durevole dopo ciò a cui conduce: prima i dati e il bit, per ultimo l’inode.'
    ],
    errori: [
      ['Ritenere che un’operazione avvenga in un’unica scrittura.', 'Le scritture sono separate, e il crash può avvenire fra due qualsiasi.'],
      ['Attribuire la medesima gravità a tutte le incoerenze.', 'Un blocco perso spreca spazio. Un riferimento a un blocco libero, o a byte precedenti, corrompe o espone dati.'],
      ['Pubblicare il riferimento per primo.', 'Un inode che indica un blocco non ancora scritto espone al file byte che non gli appartengono.']
    ],
    saFare: ['Ricostruire dati, bit map e inode dopo un crash.', 'Distinguere un blocco perso da un dato esposto.', 'Individuare un ordine di scrittura sicuro.'],
    esercizi: [
      { d: 'L’ordine delle scritture è bit map, dati, inode, e il crash avviene dopo la prima. Che cosa trova il riavvio?', guida: 'Si scelga la risposta.', o: [
        { t: 'Un blocco segnato occupato, che nessun file raggiunge', ok: true, fb: 'Il bit è a 1, e l’inode non ha ancora il riferimento.' },
        { t: 'Un file che espone byte precedenti', fb: 'All’inode manca il riferimento, e il file non raggiunge il blocco.' },
        { t: 'Un volume coerente', fb: 'La bit map dichiara occupato un blocco senza proprietario.' }] },
      { d: 'Le scritture sono tre, e il crash può avvenire prima della prima, fra due scritture, oppure dopo l’ultima. Quanti stati diversi può trovare il riavvio?', segnaposto: 'Un numero', giuste: ['4', 'quattro'],
        ok: 'Zero, una, due oppure tre scritture durevoli: quattro stati.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Va contato anche lo stato in cui nessuna scrittura è avvenuta.' },
          { se: ['8', 'otto'], msg: 'Otto sarebbero le combinazioni se le scritture fossero indipendenti. In questo caso sopravvive sempre un prefisso dell’ordine.' },
          { se: ['2', 'due'], msg: 'Fra «nessuna scrittura» e «tutte le scritture» sono compresi due stati intermedi.' }
        ],
        altro: 'Il numero è diverso. Si contino i prefissi possibili di una sequenza di tre scritture.',
        indizi: ['Può essere durevole nessuna scrittura.', 'Oppure la prima, oppure le prime due.', 'Oppure tutte e tre: quattro casi.'],
        svolgimento: ['Prefissi: 0, 1, 2, 3 scritture.', 'Stati: 4.'] },
      { d: 'Quale ordine garantisce che, in qualunque punto avvenga il crash, il file non esponga mai byte precedenti?', guida: 'Si scelga la risposta.', o: [
        { t: 'Dati, bit map, inode', ok: true, fb: 'Il riferimento compare per ultimo, quando i byte nuovi sono già nel blocco.' },
        { t: 'Inode, dati, bit map', fb: 'Dopo la prima scrittura l’inode indica un blocco che contiene ancora byte precedenti.' },
        { t: 'Bit map, inode, dati', fb: 'Dopo la seconda scrittura l’inode indica un blocco in cui i dati non sono ancora stati scritti.' }] }
    ],
    sfida: ['cslez6_6_03_write_order', 'Ordine delle scritture']
  }
});
