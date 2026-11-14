'use strict';
SL.unita555 = (() => {
  const conto = (p) => { const spin = p.modo === 'spin'; return { cpu: spin ? p.d : 0, presa: spin ? p.d : p.d + p.r }; };
  // fase: 0 la richiesta · 1 l'attesa · 2 il rilascio · 3 il conto
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], c = conto(p), spin = p.modo === 'spin', n = Math.max(10, c.presa + 1), passo = o.wc + 3;
    els.push(el.nota(pre + 't0', o.x, o.y, 'CORE 0 · il thread A, che possiede il lock', 'mono'), el.nota(pre + 't1', o.x, o.y + 84, 'CORE 1 · il thread B, che lo aspetta', 'mono'));
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
  obiettivo: 'Obiettivo: confrontare i due modi di aspettare un lock, e scegliere fra essi in base alla durata dell’attesa.',
  concetti: [['lucchetto', 'Il lock ha un proprietario'], ['cpu', 'Aspettare girando a vuoto'], ['coda', 'Aspettare dormendo']],
  filigrana: ['lucchetto', 'cpu', 'clock'],
  richiami: {
    carte: [
      { sim: 'lucchetto', da: 'Dall’unità 5.5.2', t: 'La mutua esclusione', d: 'Nella sezione critica entra un thread per volta. Gli altri aspettano.' },
      { sim: 'coda', da: 'Dall’unità 5.1.2', t: 'Lo stato bloccato', d: 'Un thread bloccato non usa il processore, e attende un evento.' },
      { sim: 'register', da: 'Dall’unità 5.3.3', t: 'Il costo del cambio di contesto', d: 'Sospendere un thread e riprenderlo richiede tempo.' }
    ],
    domanda: { d: 'Prima di proseguire: un thread bloccato consuma tempo di processore?', o: [
      { t: 'No: il core viene dato ad altri', ok: true, fb: 'È il vantaggio dello stato bloccato rispetto a un controllo ripetuto.' },
      { t: 'Sì: continua a controllare se l’evento è arrivato', fb: 'Questo sarebbe il polling. Un thread bloccato viene risvegliato dal kernel.' },
      { t: 'Sì, ma soltanto in modo kernel', fb: 'Un thread bloccato non esegue alcuna istruzione, in nessun modo.' }
    ] }
  },
  idea: {
    titolo: 'Come si aspetta un lock',
    termini: ['attesa attiva', 'spinlock', 'proprietario del lock'],
    testo: [
      'Lock è il nome generico di ciò che un mutex realizza: un diritto di accesso esclusivo, che un thread prende e poi restituisce. Chi lo ha preso è il [[proprietario del lock]], e soltanto lui può rilasciarlo. La questione di questa unità riguarda gli altri, cioè il comportamento di un thread che trova il lock occupato e deve aspettare.',
      'La prima risposta è riprovare di continuo. Il thread esegue un ciclo stretto che controlla il lock, lo trova occupato, e ricontrolla. Si chiama [[attesa attiva]], e un lock che funziona così è uno [[spinlock]]. Il thread resta in esecuzione, e si accorge del rilascio nell’istante stesso in cui avviene. In compenso tiene impegnato un core per tutta l’attesa, senza produrre nulla. Su un solo core sarebbe anche inutile, perché il proprietario non potrebbe eseguire per arrivare al rilascio.',
      { fig: 'scena', w: 720, h: 170, titolo: 'A tiene il lock per 4 ms, e B aspetta girando', nota: 'B ottiene il lock a 4 ms, e nel frattempo ha consumato 4 ms di processore sul core 1.', els: SL.unita555.quadro('g', { d: 4, modo: 'spin', r: 0 }, 3, { x: 10, y: 0, wc: 60 }) },
      'La seconda risposta è la sospensione. Il thread chiede il lock al kernel, che lo mette nello stato bloccato e assegna il core a qualcun altro. Al rilascio il kernel lo risveglia. Durante l’attesa il consumo di processore del thread è nullo. Il prezzo sta ai due estremi: sospendere e risvegliare sono cambi di contesto, e il thread risvegliato non riparte nell’istante del rilascio.',
      'La scelta dipende dalla durata. Se il proprietario terrà il lock per un tempo più breve di un cambio di contesto, conviene girare: sospendersi costerebbe più dell’attesa. Se lo terrà a lungo, conviene dormire e lasciare il core ad altri. Molti mutex reali combinano le due cose: girano per un breve tratto, e se il lock non si libera passano alla sospensione.'
    ]
  },
  esperimento: {
    faremo: [
      'Il thread A possiede un lock e lo terrà ancora per un certo tempo. Il thread B, su un altro core, lo chiede. Sceglierai quanto dura ancora la sezione critica di A, come aspetta B, e quanto costa un risveglio.',
      'Misureremo due cose: quando B ottiene il lock, e quanto processore ha consumato aspettando. Prova un’attesa di 1 ms con un risveglio di 2 ms.'
    ],
    vedrai: [
      ['cpu', 'Il core 0', 'In alto: il thread A dentro la sezione critica, un millisecondo per casella.'],
      ['cpu', 'Il core 1', 'In basso: che cosa accade sul core di B. «gira» è attesa attiva, «altri» è lavoro di altri thread, «avvio» è il tempo che serve a rimettere B in esecuzione.']
    ]
  },
  lab: {
    titolo: 'Girare oppure dormire',
    scena: { w: 860, h: 172 },
    atti: ['La richiesta', 'L’attesa', 'Il rilascio', 'Il conto'],
    controlli: [
      { id: 'd', tipo: 'scelta', eti: 'A tiene il lock ancora per', opzioni: [[1, '1 ms'], [4, '4 ms'], [8, '8 ms']], valore: 4 },
      { id: 'modo', tipo: 'scelta', eti: 'B aspetta', opzioni: [['spin', 'con attesa attiva'], ['blocco', 'sospendendosi']], valore: 'spin' },
      { id: 'r', tipo: 'scelta', eti: 'Costo del risveglio', opzioni: [[0, 'nullo'], [2, '2 ms']], valore: 0 }
    ],
    nota: 'I passi sono sempre quattro. Il costo del risveglio conta soltanto se B si sospende.',
    previsione: {
      domanda: (p) => 'A possiede un lock e lo rilascerà fra ' + p.d + ' ms. B, su un altro core, lo chiede e aspetta ' + (p.modo === 'spin' ? 'con attesa attiva.' : 'sospendendosi.') + ' Quanti millisecondi di processore consuma B durante l’attesa?',
      opzioni: (p) => [[0, '0 ms'], [p.d, p.d + ' ms']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' ms. B consuma ' + esito + ' ms di processore. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.modo === 'spin' ? 'Nell’attesa attiva B resta in esecuzione, e occupa il core per tutta la durata.' : 'Un thread sospeso non esegue, e il suo core serve ad altri.'),
    costruisci(p) {
      const U = SL.unita555, c = U.conto(p), passi = [], spin = p.modo === 'spin';
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Rilascio di A', f >= 2 ? p.d + ' ms' : '·', 'a'], ['B ottiene il lock', f >= 2 ? c.presa + ' ms' : '·'], ['Processore di B', f >= 3 ? c.cpu + ' ms' : '·', 'c']], els: U.quadro('q', p, f, { x: 20, y: 0, wc: 71 }) }, extra));

      P(0, 0, 'B chiede il lock', 'All’istante 0 il thread A è dentro la sezione critica, sul core 0, e ne uscirà fra ' + p.d + ' ms. Il thread B, sul core 1, chiede lo stesso lock e lo trova occupato.', {});
      P(1, 1, spin ? 'B gira' : 'B si sospende', spin ? 'B esegue un ciclo che controlla il lock di continuo. Il core 1 è tutto suo, e per ' + p.d + ' ms non produce nulla di utile.' : 'B chiede al kernel di essere sospeso finché il lock non si libera. Il kernel lo blocca, e assegna il core 1 ad altri thread, che lavorano per ' + p.d + ' ms.', { calc: spin ? 'core 1: ' + p.d + ' ms di attesa attiva' : 'core 1: ' + p.d + ' ms per altri', chiedi: { d: 'Chi può rilasciare il lock?', o: ['B, se aspetta abbastanza', 'Soltanto A, che ne è il proprietario', 'Il kernel, allo scadere del quanto'], g: 1, no: 'Il lock viene rilasciato dal thread che lo possiede, quando esce dalla sezione critica.' } });
      P(2, 2, 'A rilascia', 'All’istante ' + p.d + ' ms A esce dalla sezione critica e rilascia il lock. ' + (spin ? 'B se ne accorge al controllo successivo, e lo prende subito.' : p.r === 0 ? 'Il kernel risveglia B, che in questo modello riparte all’istante, e prende il lock.' : 'Il kernel risveglia B. Rimetterlo in esecuzione richiede ' + p.r + ' ms: B prende il lock a ' + c.presa + ' ms.'), { calc: 'B ottiene il lock a ' + c.presa + ' ms' });
      P(3, 3, 'Il conto', 'B ha ottenuto il lock dopo ' + c.presa + ' ms, e nell’attesa ha consumato ' + c.cpu + ' ms di processore. ' + (spin ? (p.d <= 2 ? 'Per un’attesa così breve, girare è ragionevole: una sospensione costerebbe almeno quanto l’attesa.' : 'Per un’attesa di questa durata è uno spreco: il core 1 poteva servire ad altri.') : (p.r > p.d ? 'Il risveglio è costato più dell’attesa stessa: con una sezione critica così breve conveniva girare.' : 'Il core 1 è rimasto disponibile per altri thread, al prezzo di un risveglio.')), { calc: 'tempo ' + c.presa + ' ms · processore ' + c.cpu + ' ms', esito: [c.cpu + ' ms di processore', ''] });
      return { passi, esito: c.cpu };
    }
  },
  bilancio: {
    regola: [
      'Attesa attiva: il thread resta in esecuzione e consuma processore per tutta l’attesa. Sospensione: il thread viene bloccato, lascia libero il processore, e paga il costo del risveglio.',
      'Conviene l’attesa attiva quando il lock viene tenuto per meno tempo di quanto costa sospendersi e risvegliarsi.'
    ],
    errori: [
      ['Usare l’attesa attiva per sezioni critiche lunghe.', 'Un core resta impegnato a non fare nulla per tutta la durata.'],
      ['Usare l’attesa attiva su un solo core.', 'Chi gira impedisce al proprietario di eseguire, e quindi di rilasciare il lock.'],
      ['Considerare gratuita la sospensione.', 'Bloccare e risvegliare un thread sono cambi di contesto.']
    ],
    saFare: ['Descrivere i due modi di aspettare un lock.', 'Calcolare il processore consumato nell’attesa.', 'Scegliere fra i due modi in base alla durata.'],
    esercizi: [
      { d: 'Un thread aspetta con attesa attiva un lock che viene rilasciato dopo 6 ms. Quanti millisecondi di processore consuma nell’attesa?', segnaposto: 'Un numero', giuste: ['6', '6ms', 'sei'],
        ok: 'Nell’attesa attiva il thread esegue per tutta la durata: 6 ms.',
        diagnosi: [
          { se: ['0', '0ms'], msg: 'Zero sarebbe il consumo di un thread sospeso. Qui il thread gira.' },
          { se: ['12', '12ms'], msg: 'Il thread che aspetta consuma soltanto il proprio core, per 6 ms.' }
        ],
        altro: 'Il valore è diverso. Nell’attesa attiva il consumo coincide con la durata dell’attesa.',
        indizi: ['Il thread resta in esecuzione.', 'L’attesa dura 6 ms.', 'Consumo: 6 ms.'],
        svolgimento: ['Durata dell’attesa: 6 ms.', 'Processore consumato: 6 ms.'] },
      { d: 'Un thread si sospende in attesa di un lock, che viene rilasciato dopo 6 ms. Il risveglio costa 2 ms. A quale istante il thread ottiene il lock, contando dalla richiesta?', segnaposto: 'Un numero', giuste: ['8', '8ms', 'otto'],
        ok: '6 ms di attesa più 2 ms di risveglio.',
        diagnosi: [
          { se: ['6', '6ms'], msg: 'A 6 ms il lock è libero. Il thread deve ancora essere rimesso in esecuzione.' },
          { se: ['2', '2ms'], msg: 'Due millisecondi è il solo risveglio, che comincia al rilascio.' }
        ],
        altro: 'Il valore è diverso. Somma l’attesa del rilascio e il costo del risveglio.',
        indizi: ['Il lock si libera a 6 ms.', 'Il risveglio richiede 2 ms.', '6 + 2 = 8.'],
        svolgimento: ['Rilascio: 6 ms.', 'Risveglio: 2 ms.', 'Lock ottenuto: 8 ms.'] },
      { d: 'Una sezione critica dura pochi microsecondi, e un cambio di contesto ne costa molti di più. Su una macchina con più core, come conviene aspettare il lock?', guida: 'Si scelga la risposta.', o: [
        { t: 'Con attesa attiva', ok: true, fb: 'L’attesa è più breve del costo di una sospensione.' },
        { t: 'Sospendendosi', fb: 'Sospendersi e risvegliarsi costerebbe più dell’attesa stessa.' },
        { t: 'È indifferente', fb: 'I due modi hanno costi diversi, e qui l’attesa è molto breve.' }] }
    ]
  }
});
