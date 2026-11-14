'use strict';
SL.unita661 = (() => {
  const NOMI = { d: 'dati', b: 'bitmap', i: 'inode' };
  const stato = (p, k) => { const fatte = p.ord.slice(0, k); return { d: fatte.indexOf('d') >= 0, b: fatte.indexOf('b') >= 0, i: fatte.indexOf('i') >= 0 }; };
  const diagnosi = (s) => (s.i && !(s.b && s.d) ? 'esposto' : !s.i && s.b ? 'perso' : 'coerente');
  // k: scritture durevoli mostrate · riavvio: mostra ciò che vede il file e la diagnosi
  const quadro = (pre, p, k, riavvio, o) => {
    const el = SL.el, els = [], s = stato(p, k), w3 = (o.w - 20) / 3, dg = diagnosi(s), ultima = k > 0 ? p.ord[k - 1] : '';
    els.push(el.nota(pre + 't', o.x, o.y, 'LE TRE SCRITTURE · nell’ordine in cui diventano durevoli', 'mono'));
    p.ord.split('').forEach((c, j) => els.push(el.cella(pre + 'o' + j, o.x + j * (w3 + 10), o.y + 24, w3, 32, NOMI[c], j < k ? (j === k - 1 && !riavvio ? 'att' : 'on') : riavvio ? 'err' : '', { gi: j < k ? 'durevole' : riavvio ? 'mai avvenuta' : 'da fare', piccola: true })));
    els.push(el.box(pre + 'd', o.x, o.y + 84, w3, 54, 'blocco 9 · contenuto', s.d ? 'byte nuovi' : 'byte vecchi', ultima === 'd' && !riavvio ? 'att' : s.d ? 'on' : 'zero', { cls: 'stretta' }));
    els.push(el.box(pre + 'b', o.x + w3 + 10, o.y + 84, w3, 54, 'bitmap · bit del blocco 9', s.b ? '1 · occupato' : '0 · libero', ultima === 'b' && !riavvio ? 'att' : s.b ? 'on' : 'zero', { cls: 'stretta' }));
    els.push(el.box(pre + 'i', o.x + 2 * (w3 + 10), o.y + 84, w3, 54, 'inode · riferimento', s.i ? 'al blocco 9' : 'assente', ultima === 'i' && !riavvio ? 'att' : s.i ? 'on' : 'zero', { cls: 'stretta' }));
    els.push(el.box(pre + 'v', o.x, o.y + 148, (o.w - 10) / 2, 54, 'che cosa legge il file nel blocco 9', !riavvio ? '·' : !s.i ? 'nulla: non lo raggiunge' : s.d ? 'i byte nuovi' : 'i byte vecchi', !riavvio ? '' : s.i && !s.d ? 'err' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'g', o.x + (o.w - 10) / 2 + 10, o.y + 148, (o.w - 10) / 2, 54, 'stato dopo il riavvio', !riavvio ? '·' : dg === 'coerente' ? (k === 3 ? 'coerente · file esteso' : 'coerente · file come prima') : dg === 'perso' ? 'blocco occupato e irraggiungibile' : s.b ? 'il file espone byte vecchi' : 'file su un blocco segnato libero', !riavvio ? '' : dg === 'coerente' ? 'att' : 'err', { cls: 'stretta' }));
    return els;
  };
  return { NOMI, stato, diagnosi, quadro };
})();
SL.registra('6.6.1', {
  titolo: 'Perché la persistenza richiede un modello di consistenza',
  obiettivo: 'Obiettivo: ricostruire lo stato di un volume dopo un arresto improvviso, sapendo quali scritture erano già durevoli, e riconoscere le incoerenze che ne nascono.',
  concetti: [['storage', 'Tre scritture per una sola operazione'], ['conflitto', 'L’arresto cade nel mezzo'], ['scudo', 'L’ordine decide il danno']],
  filigrana: ['storage', 'conflitto', 'journal'],
  richiami: {
    carte: [
      { sim: 'bit', da: 'Dall’unità 6.5.4', t: 'La bitmap dei blocchi', d: 'Un bit per blocco: 1 se è assegnato a un file, 0 se è libero.' },
      { sim: 'inode', da: 'Dall’unità 6.5.1', t: 'L’inode', d: 'Contiene i metadati del file e i riferimenti ai suoi blocchi.' },
      { sim: 'bilancio', da: 'Dall’unità 6.5.4', t: 'La contabilità dei blocchi', d: 'Ogni blocco segnato come occupato deve appartenere a un file, e a uno solo.' }
    ],
    domanda: { d: 'Prima di proseguire: un file cresce di un blocco. Quante strutture diverse del volume vanno aggiornate?', o: [
      { t: 'Tre: il blocco dei dati, la bitmap e l’inode', ok: true, fb: 'I byte vanno scritti, il blocco va segnato occupato, e l’inode deve indicarlo.' },
      { t: 'Una: il blocco dei dati', fb: 'Senza aggiornare inode e bitmap, il file non raggiungerebbe quei byte e il blocco risulterebbe libero.' },
      { t: 'Due: i dati e la directory', fb: 'Il nome del file resta lo stesso. Cambiano bitmap e inode.' }
    ] }
  },
  idea: {
    titolo: 'Un’operazione, tre scritture, e la corrente che se ne va',
    termini: ['crash', 'scrittura durevole', 'consistenza del file system'],
    testo: [
      'La memoria principale dimentica tutto quando manca la corrente. Il disco conserva. Un file system deve dunque reggere a un evento che un programma ordinario può ignorare: l’arresto improvviso della macchina nel bel mezzo di un’operazione. Lo chiamiamo [[crash]], qualunque ne sia la causa. Dopo il riavvio, del lavoro in corso resta soltanto ciò che era già arrivato sul disco.',
      'Una scrittura che sopravvive a un crash si dice [[scrittura durevole]]. In questo capitolo supponiamo che ogni singola scrittura di un blocco sia atomica: al riavvio la si ritrova fatta per intero, oppure non fatta. La difficoltà è che le operazioni utili richiedono più scritture. Per aggiungere un blocco a un file ne servono tre: i nuovi byte nel blocco, il bit della bitmap che lo dichiara occupato, e il riferimento nell’inode. Il disco le esegue una dopo l’altra, e il crash può cadere fra due qualsiasi.',
      'Al riavvio sopravvive un prefisso della sequenza: le prime scritture, fino al punto dell’arresto. Le tre strutture possono allora raccontare storie diverse. Si chiama [[consistenza del file system]] la proprietà che le tiene d’accordo: ogni blocco raggiunto da un inode è segnato occupato, ogni blocco occupato appartiene a un file, e ciò che un file rende leggibile sono i suoi dati.',
      { fig: 'scena', w: 720, h: 210, titolo: 'Ordine dati, bitmap, inode: il crash dopo due scritture', nota: 'Il blocco 9 contiene i byte nuovi ed è segnato occupato. All’inode manca il riferimento: il blocco è perso, e nessun dato sbagliato è visibile.', els: SL.unita661.quadro('g', { ord: 'dbi', k: 2 }, 2, true, { x: 10, y: 4, w: 700 }) },
      'Gli stati incoerenti sono di due specie, e la differenza è grande. Se la bitmap segna occupato un blocco che nessun inode indica, quel blocco è perso: spazio sprecato, finché un controllo non lo recupera. È un danno lieve. Se invece un inode indica un blocco che la bitmap considera libero, il sistema può assegnare lo stesso blocco a un altro file, e i due file si sovrascriverebbero a vicenda. Se poi l’inode indica un blocco in cui i byte nuovi non sono mai arrivati, il file mostra byte vecchi, forse appartenuti a qualcun altro.',
      'Poiché sopravvive un prefisso, l’ordine delle scritture decide quali stati intermedi sono possibili. Scrivendo per ultimo l’inode, ogni arresto lascia al più un blocco perso: il riferimento compare soltanto quando i dati e il bit sono già al loro posto. Scrivendo l’inode per primo, ogni arresto intermedio espone qualcosa di sbagliato. La regola pratica è pubblicare un riferimento soltanto dopo avere reso durevole ciò a cui conduce.'
    ]
  },
  esperimento: {
    faremo: [
      'Un file cresce di un blocco, il 9, che all’inizio è libero e contiene byte vecchi. Servono tre scritture: dati, bitmap, inode. Sceglierai l’ordine in cui diventano durevoli, e dopo quante scritture avviene il crash.',
      'Ricostruiremo le tre strutture come le trova il riavvio, e ne trarremo la diagnosi. Cerca un ordine che non esponga mai dati sbagliati, in qualunque punto cada il crash.'
    ],
    vedrai: [
      ['riproduci', 'Le tre scritture', 'In alto: le scritture nell’ordine scelto. Sotto ciascuna, se era già durevole al momento del crash.'],
      ['storage', 'Le tre strutture', 'Al centro: il contenuto del blocco 9, il suo bit nella bitmap, e il riferimento nell’inode.'],
      ['lente', 'La diagnosi', 'In basso: ciò che il file legge nel blocco 9 dopo il riavvio, e lo stato del volume.']
    ]
  },
  lab: {
    titolo: 'Un crash fra tre scritture',
    scena: { w: 860, h: 212 },
    atti: ['Prima', 'Le scritture', 'Il crash', 'Il riavvio'],
    controlli: [
      { id: 'ord', tipo: 'scelta', eti: 'Ordine delle scritture', opzioni: [['dbi', 'dati, bitmap, inode'], ['idb', 'inode, dati, bitmap'], ['bid', 'bitmap, inode, dati']], valore: 'dbi' },
      { id: 'k', tipo: 'scelta', eti: 'Scritture durevoli prima del crash', opzioni: [[0, '0'], [1, '1'], [2, '2'], [3, '3']], valore: 2 }
    ],
    nota: 'Il numero dei passi dipende dal punto del crash. Ogni singola scrittura è atomica: al riavvio è fatta per intero, oppure non fatta.',
    previsione: {
      domanda: (p) => { const N = SL.unita661.NOMI; return 'Per aggiungere il blocco 9 a un file servono tre scritture, che diventano durevoli in quest’ordine: ' + p.ord.split('').map((c) => N[c]).join(', ') + '. Il crash avviene quando ' + (p.k === 0 ? 'nessuna scrittura è' : p.k === 1 ? 'soltanto la prima è' : p.k === 2 ? 'le prime due sono' : 'tutte e tre sono') + ' durevol' + (p.k === 1 ? 'e' : p.k === 0 ? 'e' : 'i') + '. In che stato si trova il volume al riavvio?'; },
      opzioni: () => [['coerente', 'Coerente: file come prima, oppure esteso per intero'], ['perso', 'Un blocco segnato occupato, che nessun file raggiunge'], ['esposto', 'Il file raggiunge un blocco con byte vecchi, oppure segnato libero']]
    },
    confronto: (pred, esito, p) => { const N = { coerente: 'coerente', perso: 'con un blocco perso', esposto: 'con dati esposti' }, s = SL.unita661.stato(p, p.k); return 'La previsione indicava un volume ' + N[pred] + '. Al riavvio il volume è ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'coerente' ? (p.k === 0 ? 'Nessuna scrittura era durevole: il volume è rimasto com’era.' : p.k === 3 ? 'Le tre scritture erano tutte durevoli: l’operazione è completa.' : 'Sono arrivati sul disco soltanto i dati, in un blocco rimasto libero e fuori da ogni file. Per il file system è come se nulla fosse accaduto.') : esito === 'perso' ? 'La bitmap segna occupato il blocco 9, e l’inode non lo indica ancora.' : s.b ? 'L’inode indica il blocco 9, in cui i byte nuovi non sono mai arrivati.' : 'L’inode indica il blocco 9, che la bitmap considera ancora libero.'); },
    costruisci(p) {
      const U = SL.unita661, passi = [], N = U.NOMI, fin = U.stato(p, p.k), dg = U.diagnosi(fin);
      const P = (k, riavvio, atto, titolo, testo, extra) => { const s = U.stato(p, k); passi.push(Object.assign({ atto, titolo, testo, hud: [['Dati', s.d ? 'nuovi' : 'vecchi', 'a'], ['Bit', s.b ? '1' : '0'], ['Riferimento', s.i ? 'sì' : 'no', 'c']], els: U.quadro('b', p, k, riavvio, { x: 20, y: 4, w: 820 }) }, extra)); };
      const D = { d: 'I nuovi byte vengono scritti nel blocco 9, al posto di quelli vecchi.', b: 'Il bit del blocco 9 nella bitmap passa da 0 a 1: il blocco risulta occupato.', i: 'L’inode del file riceve il riferimento al blocco 9: da ora il file lo raggiunge.' };
      P(0, false, 0, 'Prima dell’operazione', 'Il blocco 9 è libero: il suo bit vale 0, nessun inode lo indica, e contiene byte vecchi, lasciati da un file cancellato. Un file sta per crescere, e gli verrà assegnato proprio il blocco 9.', {});
      for (let k = 1; k <= p.k; k++) P(k, false, 1, 'Scrittura ' + k + ' · ' + N[p.ord[k - 1]], D[p.ord[k - 1]] + ' La scrittura è durevole.', { calc: N[p.ord[k - 1]] + ': durevole' });
      P(p.k, true, 2, 'Il crash', 'La macchina si arresta. ' + (p.k === 3 ? 'Le tre scritture erano già tutte sul disco.' : p.k === 0 ? 'Nessuna scrittura era arrivata sul disco.' : 'Sul disco ' + (p.k === 1 ? 'era arrivata la prima scrittura' : 'erano arrivate le prime due scritture') + '. ' + (p.k === 1 ? 'Le altre due non avverranno mai.' : 'La terza non avverrà mai.')), { calc: p.k + ' su 3 durevoli', chiedi: { d: 'Al riavvio, il file riesce a raggiungere il blocco 9?', o: ['Sì: l’inode lo indica', 'No: all’inode manca il riferimento'], g: fin.i ? 0 : 1, no: fin.i ? 'La scrittura dell’inode era fra quelle durevoli.' : 'La scrittura dell’inode non era ancora avvenuta.' } });
      P(p.k, true, 3, 'Il riavvio', dg === 'coerente' ? (p.k === 3 ? 'Dati, bitmap e inode concordano: il blocco 9 contiene i byte nuovi, è occupato, e il file lo raggiunge. L’operazione è completa.' : p.k === 0 ? 'Le tre strutture sono rimaste com’erano. Il file ha la lunghezza di prima: l’operazione è come mai cominciata.' : 'I byte nuovi sono nel blocco 9, che però resta libero e non raggiunto. Per il file system nulla è cambiato: il file è come prima, e quei byte verranno sovrascritti dal prossimo che userà il blocco.') : dg === 'perso' ? 'La bitmap dichiara occupato il blocco 9, e nessun inode lo indica. Il blocco è perso: nessuno può usarlo, e nessuno può liberarlo, finché un controllo del volume non se ne accorge. Nessun dato sbagliato è visibile.' : fin.b ? 'L’inode indica il blocco 9, che è segnato occupato. I byte nuovi però mancano, perché quella scrittura è rimasta da fare. Leggendo, il file mostra i byte vecchi di un altro file.' : 'L’inode indica il blocco 9, che la bitmap considera libero. Il sistema potrebbe assegnarlo a un altro file, e i due si sovrascriverebbero.' + (fin.d ? '' : ' Per di più il blocco contiene ancora i byte vecchi.'), { esito: [dg === 'coerente' ? 'volume coerente' : dg === 'perso' ? 'blocco perso' : 'dati esposti', dg === 'coerente' ? 'si' : dg === 'perso' ? '' : 'no'] });
      return { passi, esito: dg };
    }
  },
  bilancio: {
    regola: [
      'Dopo un crash sopravvive un prefisso delle scritture: per ricostruire lo stato si considerano fatte le prime, fino al punto dell’arresto.',
      'Un riferimento va reso durevole dopo ciò a cui conduce: prima i dati e il bit, per ultimo l’inode.'
    ],
    errori: [
      ['Pensare che un’operazione avvenga tutta insieme.', 'Le scritture sono separate, e il crash può cadere fra due qualsiasi.'],
      ['Mettere sullo stesso piano tutte le incoerenze.', 'Un blocco perso spreca spazio. Un riferimento a un blocco libero, o a byte vecchi, corrompe o espone dati.'],
      ['Pubblicare subito il riferimento.', 'Un inode che indica un blocco non ancora scritto mostra al file byte che non gli appartengono.']
    ],
    saFare: ['Ricostruire dati, bitmap e inode dopo un crash.', 'Distinguere un blocco perso da un dato esposto.', 'Scegliere un ordine di scrittura prudente.'],
    esercizi: [
      { d: 'L’ordine delle scritture è bitmap, dati, inode. Il crash avviene dopo la prima. Che cosa trova il riavvio?', guida: 'Si scelga la risposta.', o: [
        { t: 'Un blocco segnato occupato, che nessun file raggiunge', ok: true, fb: 'Il bit è a 1, e l’inode non ha ancora il riferimento.' },
        { t: 'Un file che mostra byte vecchi', fb: 'All’inode manca il riferimento, e il file resta lontano dal blocco.' },
        { t: 'Un volume coerente', fb: 'La bitmap dichiara occupato un blocco senza proprietario.' }] },
      { d: 'Le scritture sono tre, e il crash può cadere prima della prima, fra due scritture, oppure dopo l’ultima. Quanti stati diversi può trovare il riavvio?', segnaposto: 'Un numero', giuste: ['4', 'quattro'],
        ok: 'Zero, una, due oppure tre scritture durevoli: quattro stati.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Conta anche lo stato in cui nessuna scrittura è avvenuta.' },
          { se: ['8', 'otto'], msg: 'Otto sarebbero le combinazioni se le scritture fossero indipendenti. Qui sopravvive sempre un prefisso dell’ordine.' },
          { se: ['2', 'due'], msg: 'Fra «nulla» e «tutto» ci sono due stati intermedi.' }
        ],
        altro: 'Il numero è diverso. Conta i prefissi possibili di una sequenza di tre scritture.',
        indizi: ['Può essere durevole nessuna scrittura.', 'Oppure la prima, oppure le prime due.', 'Oppure tutte e tre: quattro casi.'],
        svolgimento: ['Prefissi: 0, 1, 2, 3 scritture.', 'Stati: 4.'] },
      { d: 'Quale ordine garantisce che, in qualunque punto cada il crash, il file non mostri mai byte vecchi?', guida: 'Si scelga la risposta.', o: [
        { t: 'Dati, bitmap, inode', ok: true, fb: 'Il riferimento compare per ultimo, quando i byte nuovi sono già nel blocco.' },
        { t: 'Inode, dati, bitmap', fb: 'Dopo la prima scrittura l’inode indica un blocco che contiene ancora byte vecchi.' },
        { t: 'Bitmap, inode, dati', fb: 'Dopo la seconda scrittura l’inode indica un blocco in cui i dati non sono ancora arrivati.' }] }
    ],
    sfida: ['cslez6_6_03_write_order', 'Ordine delle scritture']
  }
});
