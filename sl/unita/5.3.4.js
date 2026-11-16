'use strict';
SL.unita534 = (() => {
  const attesa = (p) => (p.caso === 'base' ? p.m + p.l : p.l);
  // riga del tempo: chi esegue in ogni millisecondo, dall'arrivo di M
  const riga = (p) => { const r = []; if (p.caso === 'base') { for (let k = 0; k < p.m; k++) r.push('M'); for (let k = 0; k < p.l; k++) r.push('L'); r.push('H'); r.push('H'); } else { for (let k = 0; k < p.l; k++) r.push('L'); r.push('H'); r.push('H'); for (let k = 0; k < p.m; k++) r.push('M'); } return r; };
  // fase: 0 la situazione · 1 arriva M · 2 la scelta · 3 chi esegue per primo · 4 il rilascio · 5 il conto
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], R = riga(p), base = p.caso === 'base', w3 = (o.w - 20) / 3, att = attesa(p);
    const fino = f <= 2 ? 0 : f === 3 ? (base ? p.m : p.l) : f === 4 ? att : R.length;
    els.push(el.box(pre + 'h', o.x, o.y, w3, o.h, 'H · priorità alta', f >= 5 ? 'esegue' : f >= 4 ? 'ha il mutex · pronto' : 'bloccato su Mx', f >= 4 ? 'att' : 'err', { cls: 'stretta' }),
      el.box(pre + 'm', o.x + w3 + 10, o.y, w3, o.h, 'M · priorità media', f === 0 ? 'non ancora arrivato' : 'pronto · ' + p.m + ' ms di CPU', f === 1 ? 'att' : f === 0 ? '' : 'on', { cls: 'stretta' }),
      el.box(pre + 'l', o.x + 2 * (w3 + 10), o.y, w3, o.h, 'L · priorità ' + (!base && f >= 2 && f < 4 ? 'alta, ereditata' : 'bassa'), f >= 4 ? 'ha rilasciato Mx' : 'possiede Mx · ' + p.l + ' ms', !base && f >= 2 && f < 4 ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.nota(pre + 't', o.x, o.y + o.h + 14, 'PROCESSORE · dall’arrivo di M', 'mono'));
    for (let k = 0; k < 11; k++) els.push(el.cella(pre + 'c' + k, o.x + k * (o.wc + 3), o.y + o.h + 38, o.wc, 34, k < fino && k < R.length ? R[k] : '', k < fino && k < R.length ? (R[k] === 'H' ? 'att' : R[k] === 'M' && base ? 'err' : 'on') : '', { gi: String(k), piccola: true }));
    return els;
  };
  return { attesa, riga, quadro };
})();
SL.registra('5.3.4', {
  titolo: 'Priorità, retroazione e inversione',
  obiettivo: 'Obiettivo: riconoscere una inversione di priorità e calcolarne l’effetto, e descrivere come la retroazione e l’invecchiamento correggono le priorità nel tempo.',
  concetti: [['privilegi', 'La precedenza al processo più urgente'], ['lucchetto', 'Un mutex può invertire l’ordine'], ['clock', 'Le priorità possono essere corrette']],
  filigrana: ['privilegi', 'lucchetto', 'coda'],
  richiami: {
    carte: [
      { sim: 'semaforo', da: 'Dall’unità 4.4.4', t: 'La priorità fissa', d: 'Il servizio costante del rango più alto. Un rango basso può attendere senza limite.' },
      { sim: 'lucchetto', da: 'Dall’unità 5.2.5', t: 'Il mutex', d: 'Il possessore ha accesso esclusivo, e gli altri thread attendono il rilascio.' },
      { sim: 'interrupt', da: 'Dall’unità 5.3.1', t: 'La prelazione', d: 'Lo scheduler può sottrarre il processore a un processo per assegnarlo a uno più urgente.' }
    ],
    domanda: { d: 'Prima di proseguire: un processo di priorità alta attende un mutex posseduto da un processo di priorità bassa. Da che cosa dipende la sua attesa?', o: [
      { t: 'Dalla rapidità con cui il processo di priorità bassa riesce a eseguire e a rilasciare il mutex', ok: true, fb: 'Finché il possessore non esegue, il mutex resta occupato.' },
      { t: 'Soltanto dalla propria priorità', fb: 'La priorità consente di ottenere il processore. Al processo manca il mutex.' },
      { t: 'Dalla durata del time slice', fb: 'Il processo è bloccato sul mutex, e nessun time slice può sbloccarlo.' }
    ] }
  },
  idea: {
    titolo: 'Il processo più urgente in attesa del meno urgente',
    termini: ['priorità di un processo', 'inversione di priorità', 'ereditarietà della priorità', 'coda a retroazione', 'invecchiamento'],
    testo: [
      'I processi hanno urgenze diverse. Lo scheduler può assegnare a ciascuno un numero, la [[priorità di un processo|priorità]], e servire sempre il processo pronto con la priorità più alta. Si considerino tre processi: H, di priorità alta, M, media, e L, bassa. Secondo la regola H non dovrebbe mai attendere gli altri due, e tuttavia un mutex è sufficiente a smentirla.',
      'L possiede il mutex Mx, e ha ancora 2 ms di esecuzione prima di rilasciarlo. H richiede il medesimo mutex e si blocca. Fino a questo punto l’attesa è ordinaria, e si limita a quei 2 ms. Giunge però M, pronto, con 4 ms di esecuzione. Fra i processi pronti M ha priorità più alta di L, e lo scheduler gli assegna il processore. L resta sospeso, il mutex resta occupato, e H attende i 4 ms di M oltre ai 2 di L. Un processo di priorità media ha ritardato quello di priorità alta: si tratta di una [[inversione di priorità]].',
      { fig: 'scena', w: 720, h: 148, titolo: 'Con priorità fisse, M precede L', nota: 'H può eseguire soltanto dopo 6 ms: i 4 di M, estraneo al mutex, e i 2 di L.', els: SL.unita534.quadro('g', { caso: 'base', m: 4, l: 2 }, 5, { x: 10, y: 0, w: 700, h: 50, wc: 60 }) },
      'Il rimedio consueto è l’[[ereditarietà della priorità]]. Finché un processo possiede un mutex atteso da uno più urgente, eredita la priorità del processo in attesa. L, con la priorità di H, precede M, esegue i propri 2 ms e rilascia Mx. In quel momento torna alla priorità bassa, H ottiene il mutex ed esegue. L’attesa di H si riduce da 6 a 2 ms.',
      'Le priorità possono inoltre essere corrette in base al comportamento. In una [[coda a retroazione]] un processo che consuma l’intero time slice è spostato a un livello più basso, poiché è probabilmente un processo di calcolo. Un processo che cede il processore prima della scadenza, per attendere un dispositivo, resta al livello alto, e al risveglio ha la precedenza. L’[[invecchiamento]] agisce invece sul tempo trascorso in coda: la priorità di un processo cresce con la durata dell’attesa, finché il processo ottiene il turno. In tal modo è escluso il rischio di attesa senza limite.'
    ]
  },
  esperimento: {
    faremo: [
      'H è bloccato sul mutex Mx, posseduto da L, e giunge M, pronto. I controlli fissano la durata dell’esecuzione di M, quella residua di L prima del rilascio, e il sistema adottato: priorità fisse oppure ereditarietà.',
      'L’esperimento segue le scelte dello scheduler sulla riga del tempo, e misura l’attesa di H dall’arrivo di M. È istruttivo confrontare i due sistemi con i medesimi valori.'
    ],
    vedrai: [
      ['process', 'I tre processi', 'In alto: priorità e stato di H, M e L.'],
      ['clock', 'La riga del tempo', 'In basso: il processo che impiega il processore in ogni millisecondo, a partire dall’arrivo di M.']
    ]
  },
  lab: {
    titolo: 'Un mutex fra tre priorità',
    scena: { w: 860, h: 150 },
    atti: ['La situazione', 'La scelta', 'L’esecuzione', 'Il totale'],
    controlli: [
      { id: 'caso', tipo: 'scelta', eti: 'Sistema', opzioni: [['base', 'priorità fisse'], ['eredita', 'ereditarietà della priorità']], valore: 'base' },
      { id: 'm', tipo: 'scelta', eti: 'Esecuzione di M', opzioni: [[4, '4 ms'], [6, '6 ms']], valore: 4 },
      { id: 'l', tipo: 'scelta', eti: 'A L restano', opzioni: [[2, '2 ms'], [3, '3 ms']], valore: 2 }
    ],
    nota: 'I passi sono sempre sei. I cambi di contesto sono considerati istantanei.',
    previsione: {
      domanda: (p) => 'H, di priorità alta, è bloccato sul mutex Mx. L, di priorità bassa, lo possiede e deve lavorare ancora ' + p.l + ' ms per rilasciarlo. Giunge M, di priorità media, con ' + p.m + ' ms di esecuzione. Il sistema adotta ' + (p.caso === 'base' ? 'priorità fisse' : 'l’ereditarietà della priorità') + '. Dopo quanti millisecondi H può eseguire?',
      opzioni: (p) => [p.l, p.m, p.m + p.l].sort((a, b) => a - b).map((v) => [v, v + ' ms'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' ms. H attende ' + esito + ' ms. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.caso === 'base' ? 'Con priorità fisse M precede L, e H deve attendere l’esecuzione di entrambi.' : 'L eredita la priorità di H e precede M: H attende soltanto l’esecuzione di L.'),
    costruisci(p) {
      const U = SL.unita534, passi = [], base = p.caso === 'base', att = U.attesa(p);
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, h: 52, wc: 71 });
      const hud = (f) => [['In esecuzione', f <= 2 ? '·' : f === 3 ? (base ? 'M' : 'L') : f === 4 ? (base ? 'L' : 'L') : 'H', 'a'], ['Mutex Mx', f >= 4 ? 'di H' : 'di L'], ['Attesa di H', f >= 5 ? att + ' ms' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'H attende un mutex', 'L, di priorità bassa, possiede il mutex Mx e deve lavorare ancora ' + p.l + ' ms prima di rilasciarlo. H, di priorità alta, ha richiesto Mx ed è bloccato. Fino a questo punto l’attesa è ordinaria.', {});
      P(1, 0, 'L’arrivo di M', 'Diviene pronto M, di priorità media, con ' + p.m + ' ms di calcolo. M è estraneo al mutex e indipendente da H. I processi pronti sono ora due: M e L.', { chiedi: { d: 'Fra M e L, quale processo ha la priorità più alta secondo i numeri assegnati?', o: ['M', 'L'], g: 0, no: 'M ha priorità media, L bassa.' } });
      P(2, 1, base ? 'Priorità fisse' : 'L eredita la priorità', base ? 'Lo scheduler confronta i pronti. M ha priorità media, L bassa: è selezionato M. Il fatto che L trattenga il processo più urgente del sistema è escluso dal confronto.' : 'Il sistema rileva che L possiede un mutex atteso da H, e gli attribuisce la priorità di H. Ora L ha priorità alta, M media: lo scheduler seleziona L.', { calc: base ? 'pronti: M (media), L (bassa)' : 'pronti: L (alta, ereditata), M (media)' });
      P(3, 2, base ? 'Esegue M' : 'Esegue L', base ? 'M impiega il processore per tutti i suoi ' + p.m + ' ms. L è sospeso, Mx resta occupato, e H continua ad attendere. Si tratta dell’inversione: un processo di priorità media ritarda quello di priorità alta.' : 'L esegue i ' + p.l + ' ms residui. M, meno urgente, attende.', { calc: (base ? 'M' : 'L') + ': ' + (base ? p.m : p.l) + ' ms' });
      P(4, 2, 'Il rilascio', base ? 'Terminato M, il processore passa a L, che esegue per ' + p.l + ' ms e rilascia Mx. H ottiene il mutex e torna pronto.' : 'L rilascia Mx e torna alla propria priorità bassa. H ottiene il mutex e torna pronto: è il più urgente, ed esegue immediatamente. M eseguirà in seguito.', { calc: 'Mx rilasciato dopo ' + att + ' ms' });
      P(5, 3, 'Il totale', base ? 'Dall’arrivo di M, H ha atteso ' + p.m + ' + ' + p.l + ' = ' + att + ' ms. Con l’ereditarietà ne avrebbe attesi ' + p.l + '.' : 'Dall’arrivo di M, H ha atteso soltanto ' + att + ' ms, l’esecuzione di L. Con priorità fisse ne avrebbe attesi ' + (p.m + p.l) + '.', { calc: base ? p.m + ' + ' + p.l + ' = ' + att + ' ms' : 'attesa di H: ' + att + ' ms', esito: ['H attende ' + att + ' ms', base ? 'no' : 'si'] });
      return { passi, esito: att };
    }
  },
  bilancio: {
    regola: [
      'Inversione di priorità: un processo urgente attende un mutex posseduto da uno poco urgente, che a sua volta è preceduto da processi intermedi.',
      'Con l’ereditarietà il possessore del mutex assume la priorità del processo in attesa, fino al rilascio. La retroazione corregge le priorità in base all’impiego del time slice, l’invecchiamento in base al tempo trascorso in coda.'
    ],
    errori: [
      ['Ritenere che la priorità alta garantisca sempre la precedenza.', 'Un processo bloccato su un mutex dipende dal suo possessore.'],
      ['Attribuire il ritardo al solo possessore del mutex.', 'Il ritardo maggiore deriva dai processi intermedi, estranei al mutex.'],
      ['Mantenere la priorità ereditata dopo il rilascio.', 'Rilasciato il mutex, il processo torna alla propria priorità.']
    ],
    saFare: ['Riconoscere una inversione di priorità.', 'Calcolare l’attesa con e senza ereditarietà.', 'Distinguere retroazione e invecchiamento.'],
    esercizi: [
      { d: 'H è bloccato su un mutex posseduto da L, che ha ancora 3 ms di esecuzione prima del rilascio. Divengono pronti due processi di priorità media, con 5 e 4 ms di esecuzione. Il sistema adotta priorità fisse. Dopo quanti millisecondi H ottiene il mutex?', segnaposto: 'Un numero', giuste: ['12', '12ms', 'dodici'],
        ok: 'Prima eseguono i due processi medi, 5 + 4 = 9 ms, poi L per 3 ms.',
        diagnosi: [
          { se: ['3', '3ms'], msg: 'Tre millisecondi sarebbero sufficienti con l’ereditarietà. Con priorità fisse i processi medi precedono L.' },
          { se: ['9', '9ms'], msg: 'Dopo i processi medi deve ancora eseguire L, per 3 ms.' },
          { se: ['8', '8ms'], msg: 'Entrambi i processi medi precedono L: 5 + 4 = 9 ms, più i 3 di L.' }
        ],
        altro: 'Il valore è diverso. Si sommino i tempi di esecuzione di tutti i processi che precedono L, e quindi quello di L.',
        indizi: ['I due processi medi hanno priorità maggiore di L.', 'Eseguono per 5 + 4 = 9 ms.', '9 + 3 = 12.'],
        svolgimento: ['Processi di priorità media: 9 ms.', 'L: 3 ms.', 'Attesa di H: 12 ms.'] },
      { d: 'In una coda a retroazione con time slice di 2 ms, il processo A impiega il processore per 2 ms interi, e il processo B lo cede dopo 1 ms per attendere il disco. Quale dei due resta al livello alto?', guida: 'Si scelga la risposta.', o: [
        { t: 'B, poiché ha ceduto il processore prima della scadenza', ok: true, fb: 'Un processo che consuma l’intero time slice, come A, scende di livello.' },
        { t: 'A, poiché ha eseguito più a lungo', fb: 'Il consumo dell’intero time slice comporta la discesa di livello.' },
        { t: 'Entrambi', fb: 'A ha esaurito il time slice, ed è spostato al livello basso.' }] },
      { d: 'Un processo ha punteggio iniziale 1 e acquisisce 1 punto ogni 2 ms interi di attesa in coda. È selezionato quando supera il punteggio 3 di un concorrente, che prevale in caso di parità. Dopo quanti millisecondi è selezionato?', segnaposto: 'Un numero', giuste: ['6', '6ms', 'sei'],
        ok: 'A 2 ms ha 2 punti, a 4 ms ne ha 3, cioè parità, a 6 ms ne ha 4 e supera il concorrente.',
        diagnosi: [
          { se: ['4', '4ms'], msg: 'A 4 ms il punteggio è 3, pari a quello del concorrente, che in caso di parità prevale.' },
          { se: ['3', '3ms'], msg: 'Il punteggio cresce di 1 ogni 2 ms: per acquisire 3 punti occorrono 6 ms.' },
          { se: ['8', '8ms'], msg: 'A 6 ms il punteggio è già 4, maggiore di 3.' }
        ],
        altro: 'Il valore è diverso. Si calcoli il punteggio a 2, 4 e 6 ms.',
        indizi: ['Dopo 2 ms: 2 punti. Dopo 4 ms: 3 punti.', 'A parità prevale il concorrente.', 'Dopo 6 ms: 4 punti, più di 3.'],
        svolgimento: ['2 ms → 2 punti.', '4 ms → 3 punti: parità, prevale il concorrente.', '6 ms → 4 punti: il processo è selezionato.'] }
    ],
    sfida: ['cslez5_3_05_scheduling', 'Priorità, attese e invecchiamento']
  }
});
