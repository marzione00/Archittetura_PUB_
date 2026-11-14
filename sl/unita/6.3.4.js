'use strict';
SL.unita634 = (() => {
  const PAG = 4096, VA = 0x1FFC, V1 = 19;
  const H = (v) => '0x' + v.toString(16).toUpperCase();
  // Stato della pagina 2: 'valida' (voce 41), 'invalida' (voce 40), 'fuori' (la tabella ha soltanto le voci 0 e 1)
  const analisi = (p) => {
    const ultimo = VA + p.n - 1, pagine = [], tratti = [];
    for (let a = VA; a <= ultimo; a++) { const v = Math.floor(a / PAG); if (pagine.indexOf(v) < 0) pagine.push(v); }
    let esito = 'ok';
    for (const v of pagine) {
      const da = Math.max(VA, v * PAG), a = Math.min(ultimo, v * PAG + PAG - 1), byte = a - da + 1;
      if (v === 2 && p.p2 === 'fuori') { tratti.push({ v, da, a, byte, stato: 'limite' }); esito = 'limite'; break; }
      const pte = v === 1 ? V1 : p.p2 === 'valida' ? 41 : 40;
      if (pte % 2 === 0) { tratti.push({ v, da, a, byte, pte, stato: 'invalida' }); esito = 'invalida'; break; }
      const pfn = Math.floor(pte / 2);
      tratti.push({ v, da, a, byte, pte, pfn, pda: pfn * PAG + da % PAG, pa: pfn * PAG + a % PAG, stato: 'ok' });
    }
    return { ultimo, pagine, tratti, esito, voci: p.p2 === 'fuori' ? 2 : 3 };
  };
  // f: 0 richiesta · 1 ultimo indirizzo · 2 pagine toccate · 3 primo tratto · 4 secondo tratto · 5 esito
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], A = analisi(p), wc = (o.w - 7 * 6) / 8, w3 = (o.w - 20) / 3, t1 = A.tratti[0], t2 = A.tratti[1];
    els.push(el.nota(pre + 't', o.x, o.y, 'I BYTE RICHIESTI · indirizzi virtuali, da ' + H(VA), 'mono'));
    for (let k = 0; k < 8; k++) { const a = VA + k, dentro = k < p.n, v = Math.floor(a / PAG), tr = A.tratti.find((x) => x.v === v), vis = dentro && ((v === 1 && f >= 3) || (v === 2 && f >= 4)); els.push(el.cella(pre + 'b' + k, o.x + k * (wc + 6), o.y + 44, wc, 34, dentro ? (f >= 2 ? 'pag. ' + v : 'byte') : '', !dentro ? '' : vis && tr ? (tr.stato === 'ok' ? 'on' : 'err') : (f === 1 && k === p.n - 1) || (f === 2) ? 'att' : 'zero', { so: H(a), gi: vis && tr && tr.stato === 'ok' ? H(tr.pfn * PAG + a % PAG) : '', piccola: true })); }
    const txt = (t) => (!t ? 'non richiesto' : t.stato === 'ok' ? 'frame ' + t.pfn + ' · ' + t.byte + ' byte' : t.stato === 'invalida' ? 'voce ' + t.pte + ' · invalida' : 'indice 2 · oltre la tabella');
    els.push(el.box(pre + 'u', o.x, o.y + 112, w3, 54, 'ultimo indirizzo', f >= 1 ? H(A.ultimo) : '·', f === 1 ? 'att' : f >= 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'p1', o.x + w3 + 10, o.y + 112, w3, 54, 'pagina 1 · voce 19', f >= 3 ? txt(t1) : '·', f === 3 ? 'att' : f >= 3 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'p2', o.x + 2 * (w3 + 10), o.y + 112, w3, 54, 'pagina 2 · ' + (p.p2 === 'fuori' ? 'nessuna voce' : 'voce ' + (p.p2 === 'valida' ? 41 : 40)), f >= 4 ? txt(t2) : '·', f >= 4 && t2 && t2.stato !== 'ok' ? 'err' : f === 4 ? 'att' : f >= 4 && t2 ? 'on' : '', { cls: 'stretta' }));
    return els;
  };
  return { PAG, VA, H, analisi, quadro };
})();
SL.registra('6.3.4', {
  titolo: 'Valori di errore, limiti e funzioni eseguibili',
  obiettivo: 'Obiettivo: controllare una richiesta di più byte prima di eseguirla, calcolandone l’ultimo indirizzo, individuando le pagine interessate, e verificando per ciascuna il limite della tabella e la validità della voce.',
  concetti: [['byte', 'Una richiesta è un intervallo'], ['conflitto', 'Il confine di pagina la divide'], ['scudo', 'Ogni pagina va controllata']],
  filigrana: ['byte', 'scudo', 'tabella'],
  richiami: {
    carte: [
      { sim: 'hex', da: 'Dall’unità 6.3.1', t: 'Il valore di errore', d: 'Sessantaquattro bit a 1: segnala al codice che ha richiesto la traduzione di rinunciare all’accesso.' },
      { sim: 'bit', da: 'Dall’unità 6.3.2', t: 'La validità', d: 'Nel formato 2 × PFN + valid una voce pari è priva di frame.' },
      { sim: 'scudo', da: 'Dall’unità 2.7.2', t: 'Il controllo dei limiti', d: 'Prima di impiegare un indice, si verifica che ricada all’interno dell’array.' }
    ],
    domanda: { d: 'Prima di proseguire: una lettura di 8 byte ha inizio all’indirizzo 100. Qual è l’indirizzo dell’ultimo byte letto?', o: [
      { t: '107', ok: true, fb: 'Gli otto byte vanno da 100 a 107: primo + numero − 1.' },
      { t: '108', fb: '108 è il primo byte dopo la lettura. Gli otto byte sono 100, 101, fino a 107.' },
      { t: '100', fb: 'Il valore indicato è il primo byte. La lettura ne comprende altri sette.' }
    ] }
  },
  idea: {
    titolo: 'Una lettura può estendersi su due pagine',
    termini: ['confine di pagina', 'controllo dei limiti della tabella'],
    testo: [
      'Nelle unità precedenti è stato tradotto un byte per volta. I programmi leggono tuttavia quasi sempre gruppi di byte: un intero ne occupa quattro, un puntatore otto. Una richiesta di otto byte è un intervallo di otto indirizzi consecutivi, dal primo fino a quello che dista sette posizioni. L’ultimo indirizzo si calcola come primo + numero di byte − 1.',
      'Se l’intervallo è contenuto per intero in una pagina, è sufficiente una traduzione. L’intervallo può tuttavia attraversare un [[confine di pagina]], cioè il punto in cui una pagina termina e ha inizio la successiva. In questa unità le pagine sono di nuovo da 4096 byte. Una lettura di otto byte che ha inizio a 0x1FFC comprende quattro byte della pagina 1, che termina a 0x1FFF, e quattro della pagina 2, che ha inizio a 0x2000.',
      { fig: 'scena', w: 720, h: 176, titolo: 'Otto byte da 0x1FFC: quattro nella pagina 1, quattro nella pagina 2', nota: 'Gli indirizzi virtuali sono consecutivi. Quelli fisici passano da 0x9FFF a 0x14000, poiché le due pagine si trovano in frame distanti.', els: SL.unita634.quadro('g', { n: 8, p2: 'valida' }, 5, { x: 10, y: 4, w: 700 }) },
      'Le due pagine si traducono separatamente, e possono trovarsi in frame molto distanti. Se la voce della pagina 1 vale 19, il frame è il 9, e il primo tratto occupa gli indirizzi fisici da 0x9FFC a 0x9FFF. Se la voce della pagina 2 vale 41, il frame è il 20, e il secondo tratto va da 0x14000 a 0x14003. Per il programma i byte sono consecutivi, mentre nella RAM occupano due zone distinte.',
      'Per questa ragione un traduttore scritto come funzione deve controllare l’intera richiesta prima di dichiararla utilizzabile. I controlli sono due per ogni pagina interessata. Il primo è il [[controllo dei limiti della tabella]]: il numero della pagina deve essere minore del numero di voci. In caso contrario la lettura della «voce» sarebbe una lettura di memoria situata oltre la fine della tabella, con un contenuto qualsiasi. Il secondo è la validità della voce, ed è eseguibile soltanto dopo il primo.',
      'Se anche un solo tratto fallisce, la funzione restituisce il valore di errore per l’intera richiesta, e si arresta al primo controllo fallito. L’accettazione dei primi quattro byte con il rifiuto degli altri consegnerebbe al chiamante un dato incompleto. L’ordine dei controlli è pertanto: ultimo indirizzo, pagine interessate, e per ciascuna limite e validità. Soltanto al termine si compongono gli indirizzi fisici.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma richiede alcuni byte a partire dall’indirizzo 0x1FFC, quattro byte prima della fine della pagina 1. I controlli fissano il numero dei byte richiesti, e lo stato della pagina 2.',
      'L’esperimento calcola l’ultimo indirizzo, individua le pagine interessate, e controlla ogni tratto. Con quattro byte lo stato della pagina 2 è irrilevante.'
    ],
    vedrai: [
      ['byte', 'I byte richiesti', 'In alto: otto celle. Sopra ciascuna l’indirizzo virtuale, all’interno la pagina, sotto l’indirizzo fisico quando il tratto è accettato.'],
      ['tabella', 'I controlli', 'In basso: l’ultimo indirizzo della richiesta, e l’esito del controllo per ciascuna pagina.']
    ]
  },
  lab: {
    titolo: 'Una richiesta attraverso il confine di pagina',
    scena: { w: 860, h: 176 },
    atti: ['La richiesta', 'Le pagine interessate', 'I controlli', 'L’esito'],
    controlli: [
      { id: 'n', tipo: 'scelta', eti: 'Byte richiesti', opzioni: [[4, '4'], [8, '8']], valore: 8 },
      { id: 'p2', tipo: 'scelta', eti: 'La pagina 2', opzioni: [['valida', 'voce 41 · valida'], ['invalida', 'voce 40 · invalida'], ['fuori', 'assente: la tabella ha due voci']], valore: 'valida' }
    ],
    nota: 'Il numero dei passi dipende dal caso. Le pagine sono da 4096 byte, e le voci valgono 2 × PFN + valid.',
    previsione: {
      domanda: (p) => 'Un programma richiede ' + p.n + ' byte a partire dall’indirizzo 0x1FFC, con pagine da 4096 byte. La voce della pagina 1 vale 19. ' + (p.p2 === 'valida' ? 'La voce della pagina 2 vale 41.' : p.p2 === 'invalida' ? 'La voce della pagina 2 vale 40.' : 'La tabella ha soltanto due voci, con indici 0 e 1.') + ' Quale esito ha il controllo della richiesta?',
      opzioni: () => [['ok', 'Accettata, poiché ogni byte ha un indirizzo fisico'], ['invalida', 'Rifiutata, poiché una voce è invalida'], ['limite', 'Rifiutata, poiché una pagina è esterna alla tabella']]
    },
    confronto: (pred, esito, p) => { const N = { ok: 'accettata', invalida: 'rifiutata per una voce invalida', limite: 'rifiutata per una pagina esterna alla tabella' }; return 'La previsione indicava «' + N[pred] + '». La richiesta è ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'ok' && p.n === 4 ? 'Quattro byte da 0x1FFC terminano a 0x1FFF, l’ultimo byte della pagina 1. La pagina 2 non è interessata, e il suo stato è irrilevante.' : esito === 'ok' ? 'Entrambe le voci sono dispari, e pertanto valide: 19 indica il frame 9, e 41 il frame 20.' : esito === 'invalida' ? 'La voce 40 è pari. Il secondo tratto è privo di frame, e l’intera richiesta è rifiutata.' : 'La pagina 2 avrebbe indice 2, e la tabella termina all’indice 1. La voce non esiste, e la sua lettura è vietata.'); },
    costruisci(p) {
      const U = SL.unita634, A = U.analisi(p), passi = [], H = U.H, t1 = A.tratti[0], t2 = A.tratti[1];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Ultimo indirizzo', f >= 1 ? H(A.ultimo) : '·', 'a'], ['Pagine interessate', f >= 2 ? A.pagine.join(' e ') : '·'], ['Esito', f >= 5 ? (A.esito === 'ok' ? 'accettata' : 'rifiutata') : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'La richiesta', 'Il programma richiede ' + p.n + ' byte a partire dall’indirizzo virtuale 0x1FFC. La tabella ha ' + A.voci + ' voci, e le pagine sono da 4096 byte.', {});
      P(1, 0, 'L’ultimo indirizzo', 'L’ultimo byte richiesto si trova a primo + numero − 1: 0x1FFC + ' + p.n + ' − 1 = ' + H(A.ultimo) + '.', { calc: '0x1FFC + ' + p.n + ' − 1 = ' + H(A.ultimo) });
      P(2, 1, 'Le pagine interessate', 'La pagina 1 va da 0x1000 a 0x1FFF. ' + (A.pagine.length === 1 ? 'L’ultimo indirizzo è 0x1FFF: la richiesta termina esattamente sull’ultimo byte della pagina 1, ed è contenuta per intero in essa.' : 'L’ultimo indirizzo, ' + H(A.ultimo) + ', è oltre tale limite: la richiesta attraversa il confine. Quattro byte sono nella pagina 1 e ' + (p.n - 4) + ' nella pagina 2.'), { calc: A.pagine.length === 1 ? 'una pagina: la 1' : 'due pagine: 4 + ' + (p.n - 4) + ' byte', chiedi: { d: 'Quante voci della tabella vanno controllate per questa richiesta?', o: ['Una', 'Due', p.n + ', una per byte'], g: A.pagine.length - 1, no: 'Si controlla una voce per ogni pagina interessata. In questo caso le pagine interessate sono ' + A.pagine.length + '.' } });
      P(3, 2, 'Il tratto nella pagina 1', 'L’indice 1 è minore del numero di voci, ' + A.voci + ': la voce esiste. Il suo valore, 19, è dispari: la voce è valida, e indica il frame 9. I ' + t1.byte + ' byte del tratto occupano gli indirizzi fisici da ' + H(t1.pda) + ' a ' + H(t1.pa) + '.', { calc: '19 = 2 × 9 + 1 · ' + H(t1.pda) + ' … ' + H(t1.pa) });
      if (t2) P(4, 2, 'Il tratto nella pagina 2', t2.stato === 'ok' ? 'L’indice 2 è minore di 3: la voce esiste. Il suo valore, 41, è dispari: la voce è valida, e indica il frame 20. I ' + t2.byte + ' byte del tratto occupano gli indirizzi da ' + H(t2.pda) + ' a ' + H(t2.pa) + '. Gli indirizzi virtuali erano consecutivi, mentre quelli fisici presentano una discontinuità.' : t2.stato === 'invalida' ? 'L’indice 2 è minore di 3: la voce esiste. Il suo valore, 40, è pari: il bit di validità è 0. La pagina 2 è priva di frame, e il controllo si arresta.' : 'L’indice 2 è uguale al numero di voci, 2, e pertanto è esterno alla tabella. Una lettura a tale indirizzo accederebbe a memoria estranea alla tabella. Il controllo si arresta senza alcuna lettura.', { calc: t2.stato === 'ok' ? '41 = 2 × 20 + 1 · ' + H(t2.pda) + ' … ' + H(t2.pa) : t2.stato === 'invalida' ? '40 = 2 × 20 + 0 · invalida' : 'indice 2 ≥ 2 voci' });
      P(5, 3, 'L’esito', A.esito === 'ok' ? 'Ogni pagina interessata ha superato i due controlli. La richiesta è accettata, con ' + (t2 ? 'due tratti: ' + t1.byte + ' + ' + t2.byte + ' = ' + p.n + ' byte.' : 'un solo tratto di ' + p.n + ' byte.') : 'Il controllo del secondo tratto è fallito. La funzione restituisce il valore di errore per l’intera richiesta: la consegna è negata anche ai quattro byte della pagina 1, che erano traducibili.', { esito: [A.esito === 'ok' ? 'accettata · ' + p.n + ' byte' : A.esito === 'invalida' ? 'rifiutata · voce invalida' : 'rifiutata · oltre la tabella', A.esito === 'ok' ? 'si' : 'no'] });
      return { passi, esito: A.esito };
    }
  },
  bilancio: {
    regola: [
      'Ultimo indirizzo = primo + numero di byte − 1. Le pagine interessate vanno da quella del primo a quella dell’ultimo.',
      'Per ogni pagina interessata: prima il limite della tabella, quindi la validità della voce. Un solo fallimento comporta il rifiuto dell’intera richiesta.'
    ],
    errori: [
      ['Tradurre soltanto il primo byte.', 'Una richiesta di più byte può terminare in un’altra pagina, che ha un altro frame oppure nessuno.'],
      ['Leggere una voce senza controllarne l’indice.', 'Oltre la fine della tabella si trova altra memoria, con valori qualsiasi.'],
      ['Supporre che byte consecutivi restino consecutivi nella RAM.', 'Oltre il confine di pagina l’indirizzo fisico riprende dall’inizio di un altro frame.']
    ],
    saFare: ['Calcolare l’ultimo indirizzo di una richiesta.', 'Determinare le pagine interessate e i byte di ogni tratto.', 'Applicare i controlli nell’ordine corretto.'],
    esercizi: [
      { d: 'Con pagine da 4096 byte, una lettura di 8 byte ha inizio all’indirizzo 0x2FFA. Quanti byte ricadono nella pagina successiva?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: 'Da 0x2FFA a 0x2FFF sono compresi 6 byte. Ne restano 2, a 0x3000 e 0x3001.',
        diagnosi: [
          { se: ['6', 'sei'], msg: 'Sei sono i byte nella prima pagina. La domanda riguarda quelli nella successiva.' },
          { se: ['0', 'zero'], msg: 'La pagina termina a 0x2FFF, e l’ultimo byte richiesto si trova a 0x3001.' },
          { se: ['8', 'otto'], msg: 'La lettura ha inizio sei byte prima del confine.' }
        ],
        altro: 'Il numero è diverso. Si contino i byte da 0x2FFA fino alla fine della pagina, 0x2FFF.',
        indizi: ['Ultimo indirizzo: 0x2FFA + 7 = 0x3001.', 'La pagina 2 termina a 0x2FFF.', 'Oltre il confine: 0x3000 e 0x3001.'],
        svolgimento: ['Byte nella pagina 2: da 0x2FFA a 0x2FFF, 6.', 'Byte nella pagina 3: 2.'] },
      { d: 'Una tabella ha 8 voci. Per quale di questi numeri di pagina il controllo dei limiti fallisce?', guida: 'Si scelga la risposta.', o: [
        { t: 'Per la pagina 8', ok: true, fb: 'Gli indici validi vanno da 0 a 7.' },
        { t: 'Per la pagina 7', fb: 'Sette è l’ultimo indice valido di una tabella con 8 voci.' },
        { t: 'Per la pagina 0', fb: 'Zero è il primo indice della tabella.' }] },
      { d: 'Una richiesta interessa due pagine: la prima voce è valida, la seconda è invalida. Che cosa restituisce la funzione di traduzione?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il valore di errore, per l’intera richiesta', ok: true, fb: 'Un dato consegnato in parte sarebbe più dannoso dell’assenza del dato.' },
        { t: 'L’indirizzo fisico del primo tratto', fb: 'Il chiamante impiegherebbe otto byte ritenendoli tutti traducibili.' },
        { t: 'L’indirizzo fisico del primo tratto, ripetuto', fb: 'I byte della seconda pagina sono privi di frame.' }] }
    ],
    sfida: ['cslez6_3_04_page_table_control', 'Controllo della traduzione']
  }
});
