'use strict';
SL.unita632 = (() => {
  const PAG = 1024, VA = 0xC33, OFF = VA % PAG;
  const H = (v) => '0x' + v.toString(16).toUpperCase();
  const leggi = (p) => { const dir = p.fmt === 'diretto', valida = dir || p.v % 2 === 1, pfn = dir ? p.v : Math.floor(p.v / 2); return { dir, valida, pfn, pa: pfn * PAG + OFF, esito: dir ? 'tutto' : valida ? 'meta' : 'nessuno' }; };
  // f: 0 valore grezzo · 1 bit · 2 formato · 3 validità · 4 frame · 5 indirizzo fisico
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], c = leggi(p), w4 = (o.w - 30) / 4, wc = 64, x0 = o.x + (o.w - (8 * (wc + 6) - 6)) / 2;
    els.push(el.nota(pre + 't', o.x, o.y, 'LA VOCE · ' + p.v + ' scritto in binario, dal bit 7 al bit 0', 'mono'));
    for (let k = 7; k >= 0; k--) { const b = (p.v >> k) & 1, basso = k === 0 && !c.dir; els.push(el.cella(pre + 'b' + k, x0 + (7 - k) * (wc + 6), o.y + 44, wc, 36, f >= 1 ? String(b) : '', f < 2 ? (f === 1 ? 'on' : '') : basso ? (b ? 'att' : 'err') : 'on', { so: 'bit ' + k, gi: f >= 2 ? (basso ? 'valid' : 'PFN') : '' })); }
    els.push(el.box(pre + 'q0', o.x, o.y + 112, w4, 54, 'formato', f >= 2 ? (c.dir ? 'PFN diretto' : 'PFN e bit valido') : '·', f === 2 ? 'att' : f >= 2 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q1', o.x + w4 + 10, o.y + 112, w4, 54, 'bit di validità', f >= 3 ? (c.dir ? 'assente' : String(p.v % 2)) : '·', f >= 3 && !c.valida ? 'err' : f === 3 ? 'att' : f >= 3 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q2', o.x + 2 * (w4 + 10), o.y + 112, w4, 54, 'frame', f >= 4 ? (c.valida ? String(c.pfn) : 'nessuno') : '·', f >= 4 && !c.valida ? 'err' : f === 4 ? 'att' : f >= 4 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q3', o.x + 3 * (w4 + 10), o.y + 112, w4, 54, 'indirizzo fisico', f >= 5 ? (c.valida ? H(c.pa) : 'valore di errore') : '·', f >= 5 ? (c.valida ? 'att' : 'err') : '', { cls: 'stretta' }));
    return els;
  };
  return { PAG, VA, OFF, H, leggi, quadro };
})();
SL.registra('6.3.2', {
  titolo: 'Formato e validità delle voci',
  obiettivo: 'Obiettivo: decodificare una voce della tabella secondo il suo formato, separando il bit di validità dal numero del frame, e spiegare per quale ragione la medesima parola può indicare frame diversi.',
  concetti: [['bit', 'Un bit per indicare «utilizzabile»'], ['hex', 'Gli altri bit contengono il frame'], ['lente', 'Prima il formato, quindi il valore']],
  filigrana: ['bit', 'hex', 'lente'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 6.3.1', t: 'La voce', d: 'Un elemento di 8 byte della tabella. Il suo valore va decodificato per ottenere il frame.' },
      { sim: 'operation', da: 'Dall’unità 2.4.1', t: 'Lo scorrimento a destra', d: 'Lo scorrimento di una posizione a destra divide per due e scarta il bit meno significativo.' },
      { sim: 'scudo', da: 'Dall’unità 1.5.3', t: 'La maschera', d: 'Una parola con bit a 1 nelle posizioni da isolare.' }
    ],
    domanda: { d: 'Prima di proseguire: come si riconosce un numero dispari dalla sua scrittura in binario?', o: [
      { t: 'Il bit più a destra vale 1', ok: true, fb: 'Il bit 0 ha peso 1: è l’unico che può rendere dispari il numero.' },
      { t: 'Il bit più a sinistra vale 1', fb: 'Tale bit ha il peso maggiore, sempre pari.' },
      { t: 'I bit a 1 sono in numero dispari', fb: '3 si scrive 11, con due bit a 1, ed è dispari.' }
    ] }
  },
  idea: {
    titolo: 'Una parola, due letture',
    termini: ['formato della voce'],
    testo: [
      'Una voce della tabella è una parola di 64 bit, e una parola è priva di significato in assenza di una convenzione che assegni un significato a ciascun gruppo di bit. Tale convenzione è il [[formato della voce]]. Il codice che scrive la tabella e quello che la legge devono impiegare il medesimo formato, altrimenti il medesimo numero sarà interpretato in due modi.',
      'Il formato del capitolo riserva il bit più a destra, il bit 0, al [[bit di validità]]: vale 1 se la voce descrive una corrispondenza utilizzabile, 0 se la pagina è priva di frame. Tutti gli altri bit contengono il numero del frame. In formula, voce = 2 × PFN + valid. La moltiplicazione per 2 sposta il PFN di una posizione a sinistra, e libera il bit 0 per la validità.',
      { fig: 'scena', w: 720, h: 176, titolo: 'La voce 35 nel formato «PFN e bit valido»', nota: 'Il bit 0 vale 1: la voce è valida. I bit rimanenti, 10001, valgono 17: il frame.', els: SL.unita632.quadro('g', { v: 35, fmt: 'valido' }, 4, { x: 10, y: 4, w: 700 }) },
      'Si consideri la voce 35, che in binario è 100011. Il bit 0 vale 1: la voce è valida. Rimosso tale bit restano le cifre 10001, cioè 17: è il risultato di uno scorrimento a destra di una posizione, l’operazione SHR dell’unità 2.4.1. Il frame è il 17, e con l’offset 51 dell’indirizzo 0xC33 il dato si trova a 17 × 1024 + 51, cioè 0x4433.',
      'Il bit di validità consente una distinzione altrimenti impossibile. La voce 1 è valida e indica il frame 0, che è un frame ordinario. La voce 0 ha il medesimo PFN, 0, e il bit di validità a 0, e pertanto è priva di frame. In assenza di tale bit, «frame 0» e «nessun frame» avrebbero la medesima scrittura.',
      'Esiste anche un formato più semplice, in cui l’intera parola è il numero del frame, denominato in questo corso PFN diretto. Con tale lettura la medesima voce 35 indica il frame 35, e il dato si troverebbe a 35 × 1024 + 51, cioè 0x8C33. Il valore in memoria è identico, e l’indirizzo fisico è diverso. Per questa ragione l’interpretazione di una voce richiede anzitutto la conoscenza del formato. Le voci dei processori reali seguono il medesimo principio, con più bit di servizio: presenza, permesso di scrittura, accesso dal modo utente.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento decodifica una voce della tabella, scritta bit per bit. I controlli fissano il valore della voce, e il formato con cui leggerla. L’indirizzo virtuale è sempre 0xC33, con offset 51.',
      'È istruttivo variare il formato a parità di valore, e confrontare frame e indirizzo fisico. I valori 34 e 1 mettono in evidenza il ruolo del bit di validità.'
    ],
    vedrai: [
      ['bit', 'I bit della voce', 'In alto: gli otto bit più bassi della voce. Sotto ciascuno, il campo a cui appartiene secondo il formato.'],
      ['lente', 'La decodifica', 'In basso: il formato, il bit di validità, il frame e l’indirizzo fisico.']
    ]
  },
  lab: {
    titolo: 'La medesima voce, letta in due formati',
    scena: { w: 860, h: 176 },
    atti: ['La voce', 'Il formato', 'Il risultato'],
    controlli: [
      { id: 'v', tipo: 'scelta', eti: 'Valore della voce', opzioni: [[35, '35'], [34, '34'], [1, '1']], valore: 35 },
      { id: 'fmt', tipo: 'scelta', eti: 'Formato', opzioni: [['valido', 'PFN e bit valido: voce = 2 × PFN + valid'], ['diretto', 'PFN diretto: voce = PFN']], valore: 'valido' }
    ],
    nota: 'I passi sono sempre sei. Le pagine sono da 1024 byte, e l’indirizzo virtuale 0xC33 ha offset 51.',
    previsione: {
      domanda: (p) => 'Una voce della tabella contiene ' + p.v + '. Il formato è «' + (p.fmt === 'valido' ? 'PFN e bit valido», cioè voce = 2 × PFN + valid' : 'PFN diretto», cioè voce = PFN') + '. Quale frame indica?',
      opzioni: (p) => [['meta', 'Il frame ' + Math.floor(p.v / 2)], ['tutto', 'Il frame ' + p.v], ['nessuno', 'Nessuno, poiché la voce è invalida']]
    },
    confronto: (pred, esito, p) => { const N = { meta: 'il frame ' + Math.floor(p.v / 2), tutto: 'il frame ' + p.v, nessuno: 'nessun frame' }; return 'La previsione indicava ' + N[pred] + '. La voce indica ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'tutto' ? 'Nel formato diretto tutti i bit formano il numero del frame, e un bit di validità non esiste.' : esito === 'meta' ? 'Il bit 0 vale 1 ed è il bit di validità. Il frame si legge nei bit rimanenti: ' + p.v + ' diviso 2, senza resto.' : 'Il bit 0 vale 0: la voce è invalida, qualunque numero contengano gli altri bit.'); },
    costruisci(p) {
      const U = SL.unita632, c = U.leggi(p), passi = [], bin = p.v.toString(2), H = U.H;
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Voce', String(p.v), 'a'], ['Frame', f >= 4 ? (c.valida ? String(c.pfn) : 'nessuno') : '·'], ['Fisico', f >= 5 ? (c.valida ? H(c.pa) : 'errore') : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'Il valore grezzo', 'Il programma ha letto dalla tabella la voce della pagina 3, e ha ottenuto ' + p.v + '. Il valore è per ora soltanto un numero.', {});
      P(1, 0, 'I bit della voce', 'In binario ' + p.v + ' si scrive ' + bin + '. Gli altri bit della parola, fino al bit 63, valgono 0.', { calc: p.v + ' = ' + bin + ' in binario' });
      P(2, 1, 'La regola di lettura', c.dir ? 'Il formato è «PFN diretto»: tutti i bit, dal primo all’ultimo, formano il numero del frame.' : 'Il formato è «PFN e bit valido»: il bit 0 indica se la voce è utilizzabile, e i bit dall’1 in poi formano il numero del frame.', { calc: c.dir ? 'voce = PFN' : 'voce = 2 × PFN + valid', chiedi: { d: 'In questo formato, che cosa rappresenta il bit 0?', o: c.dir ? ['La cifra meno significativa del numero di frame', 'La validità della voce'] : ['La validità della voce', 'La cifra meno significativa del numero di frame'], g: 0, no: c.dir ? 'Nel formato diretto nessun bit è riservato: appartengono tutti al PFN.' : 'Il formato riserva il bit 0 alla validità. Il PFN ha inizio dal bit 1.' } });
      P(3, 1, c.dir ? 'Nessun bit di validità' : 'Il bit di validità', c.dir ? 'In questo formato manca un bit di validità. Ogni valore, anche 0, è un numero di frame.' : 'Il bit 0 di ' + p.v + ' vale ' + (p.v % 2) + '. ' + (c.valida ? 'La voce è valida.' : 'La voce è invalida: la pagina è priva di frame.'), { calc: c.dir ? 'ogni valore è un PFN' : 'valid = ' + (p.v % 2) });
      P(4, 2, 'Il frame', c.dir ? 'Il frame coincide con il valore: ' + p.v + '.' : c.valida ? 'Il bit 0 è scartato con uno scorrimento a destra di una posizione: ' + p.v + ' diviene ' + c.pfn + '. Il frame è il ' + c.pfn + '.' : 'Gli altri bit contengono ' + c.pfn + ', e vanno ignorati: una voce invalida è priva di frame.', { calc: c.dir ? 'PFN = ' + p.v : c.valida ? 'PFN = ' + p.v + ' / 2 = ' + c.pfn : 'nessun frame' });
      P(5, 2, c.valida ? 'L’indirizzo fisico' : 'Il valore di errore', c.valida ? 'Con l’offset 51 dell’indirizzo 0xC33, il dato si trova a ' + c.pfn + ' × 1024 + 51 = ' + (c.pfn * 1024 + 51) + ', cioè ' + H(c.pa) + '.' + (p.v === 1 && !c.dir ? ' Il frame 0 è una destinazione legittima: a renderla tale è il bit di validità.' : '') : 'La traduzione non esiste, e il programma restituisce il valore di errore, 0xFFFFFFFFFFFFFFFF.', { calc: c.valida ? c.pfn + ' × 1024 + 51 = ' + H(c.pa) : 'valore di errore', esito: [c.valida ? 'frame ' + c.pfn + ' · ' + H(c.pa) : 'voce invalida', c.valida ? 'si' : 'no'] });
      return { passi, esito: c.esito };
    }
  },
  bilancio: {
    regola: [
      'Formato «PFN e bit valido»: valid = bit 0 della voce, PFN = voce scorsa a destra di una posizione.',
      'Una voce si interpreta soltanto dopo avere stabilito il formato: il medesimo valore, in formati diversi, indica frame diversi.'
    ],
    errori: [
      ['Leggere il frame senza controllare la validità.', 'Nel formato con bit valido una voce pari è priva di frame.'],
      ['Trattare il frame 0 come «nessun frame».', 'La voce 1 è valida e indica il frame 0. A distinguere i due casi è il bit di validità.'],
      ['Decodificare con il formato errato.', 'La voce 35 è il frame 17 in un formato e il frame 35 nell’altro.']
    ],
    saFare: ['Separare bit di validità e PFN.', 'Riconoscere una voce invalida.', 'Confrontare la lettura della medesima voce in due formati.'],
    esercizi: [
      { d: 'Nel formato voce = 2 × PFN + valid, quale valore ha una voce valida che indica il frame 20?', segnaposto: 'Un numero', giuste: ['41', 'quarantuno'],
        ok: '2 × 20 + 1 = 41.',
        diagnosi: [
          { se: ['40', 'quaranta'], msg: 'Quaranta ha il bit di validità a 0: sarebbe una voce invalida. Va aggiunto 1.' },
          { se: ['20', 'venti'], msg: 'Il PFN va spostato di una posizione a sinistra, cioè moltiplicato per 2, e quindi si aggiunge il bit di validità.' },
          { se: ['21', 'ventuno'], msg: 'Il PFN va moltiplicato per 2 prima di aggiungere il bit di validità.' }
        ],
        altro: 'Il valore è diverso. Si applichi la formula con PFN 20 e valid 1.',
        indizi: ['2 × 20 = 40.', 'La voce è valida: valid vale 1.', '40 + 1 = 41.'],
        svolgimento: ['2 × 20 = 40.', '40 + 1 = 41.'] },
      { d: 'Nel formato voce = 2 × PFN + valid, una voce contiene 18. Che cosa indica?', guida: 'Si scelga la risposta.', o: [
        { t: 'Nessun frame, poiché la voce è invalida', ok: true, fb: '18 è pari: il bit di validità vale 0.' },
        { t: 'Il frame 9', fb: 'Nove è il contenuto degli altri bit. Con il bit di validità a 0 non va impiegato.' },
        { t: 'Il frame 18', fb: 'Sarebbe vero nel formato diretto. In questo formato il bit 0 è riservato alla validità.' }] },
      { d: 'Con pagine da 1024 byte e formato «PFN diretto», una voce contiene 6. Qual è, in decimale, l’indirizzo fisico del byte di offset 10?', segnaposto: 'Un numero', giuste: ['6154', '6 154', '0x180a', '0x180A'],
        ok: 'Il frame è 6: 6 × 1024 + 10 = 6 154.',
        diagnosi: [
          { se: ['3082', '3 082'], msg: 'La voce è stata dimezzata, come nel formato con bit valido. Nel formato diretto il frame è 6.' },
          { se: ['6144', '6 144'], msg: 'Questo è l’inizio del frame 6. Va aggiunto l’offset, 10.' }
        ],
        altro: 'Il numero è diverso. Nel formato diretto il valore della voce è il frame.',
        indizi: ['Frame: 6.', '6 × 1024 = 6 144.', '6 144 + 10 = 6 154.'],
        svolgimento: ['Frame: 6.', 'Indirizzo fisico: 6 154.'] }
    ],
    sfida: ['cslez6_3_03_page_table_lookup_assembly', 'Lettura di una voce della tabella in assembly']
  }
});
