'use strict';
SL.unita555 = (() => {
  const conto = (p) => { const spin = p.modo === 'spin'; return { cpu: spin ? p.d : 0, presa: spin ? p.d : p.d + p.r }; };
  // fase: 0 la richiesta · 1 l'attesa · 2 il rilascio · 3 il conto
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], c = conto(p), spin = p.modo === 'spin', passo = o.wc + 3;
    els.push(el.nota(pre + 't0', o.x, o.y, 'CORE 0 · il thread A, che possiede il lock', 'mono'), el.nota(pre + 't1', o.x, o.y + 84, 'CORE 1 · il thread B, che lo attende', 'mono'));
    for (let k = 0; k < 11; k++) {
      const vis = f >= 1 && (f >= 2 || k < p.d);
      els.push(el.cella(pre + 'a' + k, o.x + k * passo, o.y + 24, o.wc, 32, vis ? (k < p.d ? 'A' : '') : '', vis && k < p.d ? 'on' : '', { gi: String(k), piccola: true }));
      const tb = k < p.d ? (spin ? 'gira' : 'altri') : k < c.presa ? 'avvio' : k === c.presa ? 'B' : '';
      els.push(el.cella(pre + 'b' + k, o.x + k * passo, o.y + 108, o.wc, 32, vis && (k < p.d || f >= 2) ? tb : '', !vis || !tb ? '' : tb === 'gira' ? 'err' : tb === 'altri' ? 'zero' : tb === 'B' ? 'att' : 'err', { piccola: true }));
    }
    return els;
  };
  return { conto, quadro };
})();
SL.registra('5.5.5', {
  titolo: 'Attesa attiva, sospensione e proprietà del lock',
  obiettivo: 'Obiettivo: confrontare le due modalità di attesa di un lock, e selezionare fra esse in base alla durata dell’attesa.',
  concetti: [['lucchetto', 'Il lock ha un proprietario'], ['cpu', 'L’attesa con un ciclo di controllo'], ['coda', 'L’attesa con sospensione']],
  filigrana: ['lucchetto', 'cpu', 'clock'],
  richiami: {
    carte: [
      { sim: 'lucchetto', da: 'Dall’unità 5.5.2', t: 'La mutua esclusione', d: 'Nella sezione critica entra un thread per volta. Gli altri attendono.' },
      { sim: 'coda', da: 'Dall’unità 5.1.2', t: 'Lo stato bloccato', d: 'Un thread bloccato non impiega il processore, e attende un evento.' },
      { sim: 'register', da: 'Dall’unità 5.3.3', t: 'Il costo del cambio di contesto', d: 'La sospensione e la ripresa di un thread richiedono tempo.' }
    ],
    domanda: { d: 'Prima di proseguire: un thread bloccato consuma tempo di processore?', o: [
      { t: 'No, il core è assegnato ad altri', ok: true, fb: 'Si tratta del vantaggio dello stato bloccato rispetto a un controllo ripetuto.' },
      { t: 'Sì, continua a controllare se l’evento si è verificato', fb: 'Questo sarebbe il polling. Un thread bloccato è risvegliato dal kernel.' },
      { t: 'Sì, soltanto in modo kernel', fb: 'Un thread bloccato non esegue alcuna istruzione, in alcun modo.' }
    ] }
  },
  idea: {
    titolo: 'Le modalità di attesa di un lock',
    termini: ['attesa attiva', 'spinlock', 'proprietario del lock'],
    testo: [
      'Lock è il nome generico del meccanismo realizzato da un mutex: un diritto di accesso esclusivo, che un thread acquisisce e in seguito restituisce. Il thread che lo ha acquisito è il [[proprietario del lock]], ed è il solo a poterlo rilasciare. L’unità esamina il comportamento degli altri thread, cioè di un thread che trova il lock occupato e deve attendere.',
      'La prima soluzione consiste nel ripetere il tentativo senza interruzione. Il thread esegue un ciclo breve che controlla il lock, lo trova occupato, e ripete il controllo. Tale modalità prende il nome di [[attesa attiva]], e un lock che opera in questo modo è uno [[spinlock]]. Il thread resta in esecuzione, e rileva il rilascio nell’istante in cui avviene. Per contro impegna un core per l’intera attesa, senza alcun lavoro utile. Su un solo core la soluzione sarebbe inoltre inutile, poiché il proprietario non potrebbe eseguire fino al rilascio.',
      { fig: 'scena', w: 720, h: 170, titolo: 'A possiede il lock per 4 ms, e B attende con attesa attiva', nota: 'B ottiene il lock a 4 ms, e nel frattempo ha consumato 4 ms di processore sul core 1.', els: SL.unita555.quadro('g', { d: 4, modo: 'spin', r: 0 }, 3, { x: 10, y: 0, wc: 60 }) },
      'La seconda soluzione è la sospensione. Il thread richiede il lock al kernel, che lo pone nello stato bloccato e assegna il core a un altro thread. Al rilascio il kernel lo risveglia. Durante l’attesa il consumo di processore del thread è nullo. Il costo si colloca ai due estremi: la sospensione e il risveglio sono cambi di contesto, e il thread risvegliato riprende con un ritardo rispetto all’istante del rilascio.',
      'La scelta dipende dalla durata. Se il proprietario conserverà il lock per un tempo più breve di un cambio di contesto, è preferibile l’attesa attiva, poiché la sospensione costerebbe più dell’attesa. Se lo conserverà a lungo, è preferibile la sospensione, che lascia il core ad altri thread. Molti mutex reali combinano le due modalità: adottano l’attesa attiva per un breve intervallo, e se il lock non si libera passano alla sospensione.'
    ]
  },
  esperimento: {
    faremo: [
      'Il thread A possiede un lock e lo conserverà ancora per un certo tempo, mentre il thread B, su un altro core, lo richiede. I controlli fissano la durata residua della sezione critica di A, la modalità di attesa di B, e il costo di un risveglio.',
      'L’esperimento misura due grandezze: l’istante in cui B ottiene il lock, e il processore consumato nell’attesa. È istruttivo il caso di un’attesa di 1 ms con un risveglio di 2 ms.'
    ],
    vedrai: [
      ['cpu', 'Il core 0', 'In alto: il thread A nella sezione critica, un millisecondo per cella.'],
      ['cpu', 'Il core 1', 'In basso: l’attività sul core di B. «gira» è attesa attiva, «altri» è lavoro di altri thread, «avvio» è il tempo necessario a riportare B in esecuzione.']
    ]
  },
  lab: {
    titolo: 'Attesa attiva oppure sospensione',
    scena: { w: 860, h: 172 },
    atti: ['La richiesta', 'L’attesa', 'Il rilascio', 'Il totale'],
    controlli: [
      { id: 'd', tipo: 'scelta', eti: 'A conserva il lock ancora per', opzioni: [[1, '1 ms'], [4, '4 ms'], [8, '8 ms']], valore: 4 },
      { id: 'modo', tipo: 'scelta', eti: 'B attende', opzioni: [['spin', 'con attesa attiva'], ['blocco', 'sospendendosi']], valore: 'spin' },
      { id: 'r', tipo: 'scelta', eti: 'Costo del risveglio', opzioni: [[0, 'nullo'], [2, '2 ms']], valore: 0 }
    ],
    nota: 'I passi sono sempre quattro. Il costo del risveglio è rilevante soltanto se B si sospende.',
    previsione: {
      domanda: (p) => 'A possiede un lock e lo rilascerà fra ' + p.d + ' ms. B, su un altro core, lo richiede e attende ' + (p.modo === 'spin' ? 'con attesa attiva.' : 'sospendendosi.') + ' Quanti millisecondi di processore consuma B durante l’attesa?',
      opzioni: (p) => [[0, '0 ms'], [p.d, p.d + ' ms']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' ms. B consuma ' + esito + ' ms di processore. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.modo === 'spin' ? 'Nell’attesa attiva B resta in esecuzione, e occupa il core per tutta la durata.' : 'Un thread sospeso non esegue, e il suo core è disponibile per altri.'),
    costruisci(p) {
      const U = SL.unita555, c = U.conto(p), passi = [], spin = p.modo === 'spin';
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Rilascio di A', f >= 2 ? p.d + ' ms' : '·', 'a'], ['B ottiene il lock', f >= 2 ? c.presa + ' ms' : '·'], ['Processore di B', f >= 3 ? c.cpu + ' ms' : '·', 'c']], els: U.quadro('q', p, f, { x: 20, y: 0, wc: 71 }) }, extra));

      P(0, 0, 'B richiede il lock', 'All’istante 0 il thread A è nella sezione critica, sul core 0, e ne uscirà fra ' + p.d + ' ms. Il thread B, sul core 1, richiede il medesimo lock e lo trova occupato.', {});
      P(1, 1, spin ? 'B in attesa attiva' : 'B si sospende', spin ? 'B esegue un ciclo che controlla il lock senza interruzione. Il core 1 è interamente occupato da B, e per ' + p.d + ' ms non svolge alcun lavoro utile.' : 'B richiede al kernel la sospensione fino alla liberazione del lock. Il kernel lo blocca, e assegna il core 1 ad altri thread, che eseguono per ' + p.d + ' ms.', { calc: spin ? 'core 1: ' + p.d + ' ms di attesa attiva' : 'core 1: ' + p.d + ' ms per altri', chiedi: { d: 'Quale entità può rilasciare il lock?', o: ['B, dopo un’attesa sufficiente', 'Soltanto A, che ne è il proprietario', 'Il kernel, allo scadere del time slice'], g: 1, no: 'Il lock è rilasciato dal thread che lo possiede, all’uscita dalla sezione critica.' } });
      P(2, 2, 'A rilascia', 'All’istante ' + p.d + ' ms A esce dalla sezione critica e rilascia il lock. ' + (spin ? 'B lo rileva al controllo successivo, e lo acquisisce immediatamente.' : p.r === 0 ? 'Il kernel risveglia B, che in questo modello riprende immediatamente, e acquisisce il lock.' : 'Il kernel risveglia B. Il ritorno in esecuzione richiede ' + p.r + ' ms: B acquisisce il lock a ' + c.presa + ' ms.'), { calc: 'B ottiene il lock a ' + c.presa + ' ms' });
      P(3, 3, 'Il totale', 'B ha ottenuto il lock dopo ' + c.presa + ' ms, e nell’attesa ha consumato ' + c.cpu + ' ms di processore. ' + (spin ? (p.d <= 2 ? 'Per un’attesa di questa brevità l’attesa attiva è ragionevole: una sospensione costerebbe almeno quanto l’attesa.' : 'Per un’attesa di questa durata il consumo è ingiustificato: il core 1 poteva essere assegnato ad altri.') : (p.r > p.d ? 'Il risveglio è costato più dell’attesa: con una sezione critica di questa brevità era preferibile l’attesa attiva.' : 'Il core 1 è rimasto disponibile per altri thread, al costo di un risveglio.')), { calc: 'tempo ' + c.presa + ' ms · processore ' + c.cpu + ' ms', esito: [c.cpu + ' ms di processore', ''] });
      return { passi, esito: c.cpu };
    }
  },
  bilancio: {
    regola: [
      'Attesa attiva: il thread resta in esecuzione e consuma processore per tutta l’attesa. Sospensione: il thread è bloccato, lascia libero il processore, e sostiene il costo del risveglio.',
      'L’attesa attiva è preferibile quando il lock è conservato per un tempo inferiore al costo della sospensione e del risveglio.'
    ],
    errori: [
      ['Impiegare l’attesa attiva per sezioni critiche lunghe.', 'Un core resta impegnato senza lavoro utile per l’intera durata.'],
      ['Impiegare l’attesa attiva su un solo core.', 'Il thread in attesa attiva impedisce al proprietario di eseguire, e quindi di rilasciare il lock.'],
      ['Considerare la sospensione priva di costo.', 'Il blocco e il risveglio di un thread sono cambi di contesto.']
    ],
    saFare: ['Descrivere le due modalità di attesa di un lock.', 'Calcolare il processore consumato nell’attesa.', 'Selezionare la modalità in base alla durata.'],
    esercizi: [
      { d: 'Un thread attende con attesa attiva un lock che è rilasciato dopo 6 ms. Quanti millisecondi di processore consuma nell’attesa?', segnaposto: 'Un numero', giuste: ['6', '6ms', 'sei'],
        ok: 'Nell’attesa attiva il thread esegue per tutta la durata: 6 ms.',
        diagnosi: [
          { se: ['0', '0ms'], msg: 'Zero sarebbe il consumo di un thread sospeso. In questo caso il thread è in attesa attiva.' },
          { se: ['12', '12ms'], msg: 'Il thread in attesa consuma soltanto il proprio core, per 6 ms.' }
        ],
        altro: 'Il valore è diverso. Nell’attesa attiva il consumo coincide con la durata dell’attesa.',
        indizi: ['Il thread resta in esecuzione.', 'L’attesa dura 6 ms.', 'Consumo: 6 ms.'],
        svolgimento: ['Durata dell’attesa: 6 ms.', 'Processore consumato: 6 ms.'] },
      { d: 'Un thread si sospende in attesa di un lock, che è rilasciato dopo 6 ms. Il risveglio costa 2 ms. A quale istante il thread ottiene il lock, a partire dalla richiesta?', segnaposto: 'Un numero', giuste: ['8', '8ms', 'otto'],
        ok: '6 ms di attesa più 2 ms di risveglio.',
        diagnosi: [
          { se: ['6', '6ms'], msg: 'A 6 ms il lock è libero. Il thread deve ancora tornare in esecuzione.' },
          { se: ['2', '2ms'], msg: 'Due millisecondi è il solo risveglio, che ha inizio al rilascio.' }
        ],
        altro: 'Il valore è diverso. Si sommino l’attesa del rilascio e il costo del risveglio.',
        indizi: ['Il lock si libera a 6 ms.', 'Il risveglio richiede 2 ms.', '6 + 2 = 8.'],
        svolgimento: ['Rilascio: 6 ms.', 'Risveglio: 2 ms.', 'Lock ottenuto: 8 ms.'] },
      { d: 'Una sezione critica dura pochi microsecondi, e un cambio di contesto ne costa molti di più. Su una macchina con più core, quale modalità di attesa del lock è preferibile?', guida: 'Si scelga la risposta.', o: [
        { t: 'L’attesa attiva', ok: true, fb: 'L’attesa è più breve del costo di una sospensione.' },
        { t: 'La sospensione', fb: 'La sospensione e il risveglio costerebbero più dell’attesa.' },
        { t: 'È indifferente', fb: 'Le due modalità hanno costi diversi, e in questo caso l’attesa è molto breve.' }] }
    ]
  }
});
