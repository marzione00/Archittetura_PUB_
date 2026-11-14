'use strict';
SL.unita554 = (() => {
  const ammessi = (p) => (p.caso === 'relaxed' ? 'due' : 'uno');
  const NOMI = { relaxed: 'accessi senza ordine garantito', ra: 'pubblicazione release, lettura acquire', mutex: 'un mutex per entrambe le celle' };
  // fase: 0 l'inizio · 1 il produttore scrive il dato · 2 pubblica il segnale · 3 il consumatore legge il segnale · 4 legge il dato
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], w3 = (o.w - 20) / 3, rel = p.caso === 'relaxed';
    els.push(el.nota(pre + 't0', o.x, o.y, 'PRODUTTORE', 'mono'), el.nota(pre + 't1', o.x + w3 + 10, o.y, 'CELLE CONDIVISE', 'mono'), el.nota(pre + 't2', o.x + 2 * (w3 + 10), o.y, 'CONSUMATORE', 'mono'));
    els.push(el.box(pre + 'a', o.x, o.y + 24, w3, o.h, 'prima scrive', f >= 1 ? 'dato = ' + p.v : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'b', o.x, o.y + 24 + o.h + 12, w3, o.h, 'poi pubblica', f >= 2 ? 'pronto = 1' : '·', f === 2 ? 'att' : f > 2 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'c', o.x + w3 + 10, o.y + 24, w3, o.h, 'cella dato', f >= 1 ? String(p.v) : '0', f === 1 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'd', o.x + w3 + 10, o.y + 24 + o.h + 12, w3, o.h, 'cella pronto', f >= 2 ? '1' : '0', f === 2 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'e', o.x + 2 * (w3 + 10), o.y + 24, w3, o.h, 'prima legge pronto', f >= 3 ? '1' : '·', f === 3 ? 'att' : f > 3 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'g', o.x + 2 * (w3 + 10), o.y + 24 + o.h + 12, w3, o.h, 'poi legge dato', f >= 4 ? (rel ? '0 oppure ' + p.v : String(p.v)) : '·', f >= 4 ? (rel ? 'err' : 'att') : '', { cls: 'stretta' }));
    return els;
  };
  return { ammessi, NOMI, quadro };
})();
SL.registra('5.5.4', {
  titolo: 'Atomicità, visibilità e ordinamento',
  obiettivo: 'Obiettivo: distinguere tre garanzie diverse sugli accessi alla memoria condivisa, e indicare in quali condizioni una scrittura è certamente visibile a un altro thread.',
  concetti: [['bit', 'Un accesso indivisibile'], ['lente', 'Il valore osservato dall’altro thread'], ['coda', 'Un ordine fra thread diversi']],
  filigrana: ['lente', 'thread', 'coda'],
  richiami: {
    carte: [
      { sim: 'conflitto', da: 'Dall’unità 5.5.1', t: 'L’operazione atomica', d: 'Un’operazione che avviene per intero, e che nessun thread può osservare in uno stato intermedio.' },
      { sim: 'cache', da: 'Dall’unità 4.7.4', t: 'Il dato rimasto nella cache', d: 'Una scrittura può restare per un certo intervallo nella cache del processore, prima di giungere nella RAM.' },
      { sim: 'thread', da: 'Dall’unità 5.4.1', t: 'La sincronizzazione', d: 'Un accordo che fissa l’ordine fra gli accessi di thread diversi.' }
    ],
    domanda: { d: 'Prima di proseguire: all’interno di un solo thread, la seconda istruzione osserva sempre l’effetto della prima?', o: [
      { t: 'Sì, un thread osserva le proprie operazioni nell’ordine del programma', ok: true, fb: 'La questione sorge quando l’osservatore è un altro thread.' },
      { t: 'No, dipende dallo scheduler', fb: 'Lo scheduler può sospendere il thread, e tuttavia alla ripresa l’ordine è quello del programma.' },
      { t: 'Soltanto se impiega un mutex', fb: 'All’interno di un solo thread l’ordine del programma è sempre rispettato.' }
    ] }
  },
  idea: {
    titolo: 'Tre garanzie distinte',
    termini: ['visibilità', 'happens-before', 'release e acquire'],
    testo: [
      'Un produttore predispone un dato per un consumatore: scrive 42 nella cella dato, e quindi pone a 1 la cella pronto, che funge da segnale. Il consumatore legge pronto, lo trova a 1, e legge dato. Il valore atteso è 42, poiché il produttore ha scritto il dato prima del segnale. Su un calcolatore attuale, in assenza di precauzioni, il consumatore può trovare 0.',
      'La ragione è che l’ordine in cui un thread esegue le proprie scritture non coincide necessariamente con l’ordine in cui un altro thread le osserva. Il compilatore può scambiare due scritture indipendenti, e il processore può trattenere una scrittura nella propria cache mentre un’altra è già giunta in memoria. Per il thread che scrive l’effetto è nullo, mentre per un osservatore esterno il segnale può apparire prima del dato. La garanzia mancante prende il nome di [[visibilità]]: la certezza che una scrittura sia osservabile da un altro thread.',
      { fig: 'scena', w: 720, h: 156, titolo: 'Il consumatore ha letto il segnale, senza alcuna garanzia di ordine', nota: 'L’osservazione di pronto = 1 lascia indeterminato il valore del dato: sono ammessi sia 0 sia 42.', els: SL.unita554.quadro('g', { caso: 'relaxed', v: 42 }, 4, { x: 10, y: 0, w: 700, h: 50 }) },
      'Le garanzie coinvolte sono dunque tre. L’atomicità riguarda il singolo accesso, che è indivisibile. La visibilità riguarda ciò che un altro thread può osservare. L’ordinamento collega le due, e si esprime con la relazione [[happens-before]], «accade prima»: se una scrittura accade prima di una lettura in questo senso, la lettura la osserva con certezza. All’interno di un thread la relazione segue l’ordine del programma. Fra thread diversi esiste soltanto dove un’operazione di sincronizzazione la crea.',
      'Un primo modo per crearla è la coppia [[release e acquire]]. Il produttore pubblica il segnale con una scrittura di tipo release, e il consumatore lo legge con una lettura di tipo acquire. Se la acquire legge il valore scritto dalla release, tutte le operazioni compiute dal produttore prima della release accadono prima di tutte quelle compiute dal consumatore dopo la acquire. La scrittura di 42 è compresa, e il consumatore deve trovare 42. Il secondo modo è un mutex che protegga entrambe le celle: il rilascio e l’acquisizione successiva creano la medesima relazione.'
    ]
  },
  esperimento: {
    faremo: [
      'Un produttore scrive un valore nella cella dato e quindi pubblica il segnale pronto. Il consumatore legge il segnale, lo trova a 1, e legge il dato. I controlli fissano il valore, e la garanzia di ordine adottata dai due thread.',
      'L’esperimento segue i quattro accessi, e al termine elenca i valori che il consumatore può trovare. È istruttivo confrontare il primo caso con gli altri due.'
    ],
    vedrai: [
      ['thread', 'Il produttore', 'A sinistra: le sue due scritture, nell’ordine del programma.'],
      ['memory', 'Le celle', 'Al centro: dato e pronto, con il contenuto scritto dal produttore.'],
      ['lente', 'Il consumatore', 'A destra: i valori letti. L’ultima cella elenca i valori ammessi.']
    ]
  },
  lab: {
    titolo: 'I valori che il consumatore può leggere',
    scena: { w: 860, h: 156 },
    atti: ['L’inizio', 'Il produttore', 'Il consumatore'],
    controlli: [
      { id: 'caso', tipo: 'scelta', eti: 'Garanzia di ordine', opzioni: [['relaxed', 'nessuna, soltanto accessi atomici'], ['ra', 'release sul segnale, acquire in lettura'], ['mutex', 'un mutex per entrambe le celle']], valore: 'relaxed' },
      { id: 'v', tipo: 'scelta', eti: 'Valore del dato', opzioni: [[42, '42'], [7, '7']], valore: 42 }
    ],
    nota: 'I passi sono sempre cinque. Il consumatore legge il dato soltanto dopo avere osservato il segnale a 1.',
    previsione: {
      domanda: (p) => 'La cella dato contiene 0. Il produttore vi scrive ' + p.v + ' e quindi pone a 1 il segnale pronto. Il consumatore legge pronto, lo trova a 1, e legge dato. I due thread adottano: ' + SL.unita554.NOMI[p.caso] + '. Quali valori può trovare il consumatore?',
      opzioni: (p) => [['uno', 'Soltanto ' + p.v], ['due', '0 oppure ' + p.v], ['zero', 'Soltanto 0']]
    },
    confronto: (pred, esito, p) => { const N = { uno: 'soltanto ' + p.v, due: '0 oppure ' + p.v, zero: 'soltanto 0' }; return 'La previsione indicava: ' + N[pred] + '. I valori ammessi sono: ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.caso === 'relaxed' ? 'Senza una relazione di ordine fra i due thread, l’osservazione del segnale non garantisce la visibilità del dato.' : p.caso === 'ra' ? 'La acquire ha letto il valore pubblicato dalla release, e la scrittura del dato, che la precedeva, è quindi visibile.' : 'Il consumatore entra nel mutex dopo il rilascio del produttore, e osserva tutte le scritture del produttore.'); },
    costruisci(p) {
      const U = SL.unita554, passi = [], rel = p.caso === 'relaxed', ra = p.caso === 'ra';
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Dato', f >= 1 ? String(p.v) : '0', 'a'], ['Segnale', f >= 2 ? '1' : '0'], ['Valori ammessi', f >= 4 ? (rel ? '0, ' + p.v : String(p.v)) : '·', 'c']], els: U.quadro('q', p, f, { x: 20, y: 0, w: 820, h: 52 }) }, extra));

      P(0, 0, 'Due celle, due thread', 'La cella dato contiene 0, e la cella pronto contiene 0. Ogni singolo accesso alle celle è atomico. ' + (rel ? 'Oltre a ciò, i due thread non adottano alcuna forma di sincronizzazione.' : ra ? 'Il produttore pubblicherà il segnale con una scrittura release, e il consumatore lo leggerà con una acquire.' : 'Entrambi i thread accedono alle due celle in possesso del medesimo mutex.'), {});
      P(1, 1, 'Il produttore scrive il dato', 'Il produttore ' + (p.caso === 'mutex' ? 'acquisisce il mutex e ' : '') + 'scrive ' + p.v + ' nella cella dato. Nel suo programma questa è la prima delle due scritture.', { calc: 'dato ← ' + p.v });
      P(2, 1, 'Il produttore pubblica il segnale', 'Il produttore pone a 1 la cella pronto' + (ra ? ', con una scrittura di tipo release.' : p.caso === 'mutex' ? ', e quindi rilascia il mutex.' : '.') + ' Per il produttore il dato è stato scritto in precedenza.', { calc: 'pronto ← 1' + (ra ? ' · release' : '') });
      P(3, 2, 'Il consumatore legge il segnale', 'Il consumatore ' + (p.caso === 'mutex' ? 'acquisisce il mutex, dopo il rilascio del produttore, e ' : '') + 'legge pronto' + (ra ? ' con una lettura di tipo acquire' : '') + ', e trova 1. ' + (rel ? 'Questa lettura attesta che il segnale è giunto, e lascia indeterminato l’ordine rispetto alle altre scritture del produttore.' : ra ? 'La acquire ha letto il valore pubblicato dalla release: fra le due operazioni si stabilisce una relazione di ordine.' : 'Il rilascio del produttore accade prima di questa acquisizione.'), { calc: 'pronto = 1', chiedi: { d: 'Il consumatore ha osservato il segnale. È certo che osserverà anche il dato scritto in precedenza?', o: ['Sì', 'No'], g: rel ? 1 : 0, no: rel ? 'Nessuna relazione di ordine lega la scrittura del dato a questa lettura.' : 'La sincronizzazione adottata rende visibili tutte le operazioni precedenti del produttore.' } });
      P(4, 2, rel ? 'Due esiti ammessi' : 'Un solo esito ammesso', rel ? 'Il consumatore legge dato. Può trovare ' + p.v + ', e può trovare ancora 0: la scrittura del dato può non essergli ancora visibile, anche se quella del segnale lo era. Entrambi gli esiti sono ammessi, e un programma corretto non può presupporre alcuno dei due.' : 'Il consumatore legge dato. La scrittura di ' + p.v + ' accade prima di questa lettura, nel senso della relazione happens-before, e nessun altro thread scrive nella cella. Il solo valore ammesso è ' + p.v + '.', { calc: rel ? 'dato ∈ {0, ' + p.v + '}' : 'dato = ' + p.v, esito: [rel ? '0 oppure ' + p.v : 'soltanto ' + p.v, rel ? 'no' : 'si'] });
      return { passi, esito: U.ammessi(p) };
    }
  },
  bilancio: {
    regola: [
      'Atomicità: il singolo accesso è indivisibile. Visibilità: una scrittura è osservabile da un altro thread. Sono garanzie distinte.',
      'Una scrittura è sicuramente visibile a una lettura di un altro thread soltanto se accade prima di essa nella relazione happens-before, creata da una sincronizzazione: release e acquire, oppure un mutex.'
    ],
    errori: [
      ['Dedurre la visibilità dall’atomicità.', 'Una cella atomica è sempre letta per intero, e può comunque restituire un valore superato.'],
      ['Ragionare sull’ordine delle righe del programma di un altro thread.', 'Quell’ordine vale per il thread che le esegue. Per gli altri vale soltanto quanto garantito da una sincronizzazione.'],
      ['Considerare impossibile un esito mai osservato.', 'Un esito ammesso può non presentarsi su un calcolatore e presentarsi su un altro.']
    ],
    saFare: ['Distinguere atomicità, visibilità e ordinamento.', 'Riconoscere l’esistenza di una relazione happens-before fra due thread.', 'Elencare i valori che una lettura può restituire.'],
    esercizi: [
      { d: 'Un thread scrive 15 in una cella atomica che conteneva 0, e quindi pone a 1 un segnale, senza alcuna sincronizzazione. Un altro thread osserva il segnale a 1 e legge la cella. Quanti valori diversi può trovare?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: 'Può trovare 0 oppure 15: due valori.',
        diagnosi: [
          { se: ['1', 'uno'], msg: 'Senza una relazione di ordine fra i thread, la scrittura di 15 può non essere ancora visibile.' },
          { se: ['16'], msg: 'L’accesso è atomico: la cella non è mai letta in uno stato intermedio. I valori possibili sono il precedente e il nuovo.' }
        ],
        altro: 'Il numero è diverso. Si elenchino i valori che la cella ha avuto.',
        indizi: ['La cella ha contenuto 0 e poi 15.', 'L’atomicità esclude valori intermedi.', 'Senza sincronizzazione sono ammessi entrambi: 2.'],
        svolgimento: ['Valori della cella: 0, 15.', 'Garanzia di ordine: nessuna.', 'Valori ammessi: 2.'] },
      { d: 'Nella medesima situazione, il segnale è pubblicato con una release e letto con una acquire, che trova quel valore. Quanti valori diversi può trovare ora il secondo thread nella cella?', segnaposto: 'Un numero', giuste: ['1', 'uno'],
        ok: 'La scrittura di 15 accade prima della lettura: il solo valore ammesso è 15.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'La coppia release e acquire crea la relazione di ordine che in precedenza mancava.' },
          { se: ['0', 'zero'], msg: 'La lettura restituisce sempre un valore. In questo caso è obbligato: 15.' }
        ],
        altro: 'Il numero è diverso. Si stabilisca se la scrittura del dato accade prima della sua lettura.',
        indizi: ['La scrittura del dato precede la release.', 'La acquire legge il valore della release.', 'Resta ammesso soltanto 15: un valore.'],
        svolgimento: ['Scrittura del dato → release → acquire → lettura del dato.', 'Valori ammessi: soltanto 15.'] },
      { d: 'Quale di queste affermazioni riguarda l’atomicità?', guida: 'Si scelga la risposta.', o: [
        { t: 'Nessun thread può osservare una scrittura in uno stato intermedio', ok: true, fb: 'L’atomicità riguarda il singolo accesso, che è indivisibile.' },
        { t: 'Una scrittura è certamente osservabile dagli altri thread', fb: 'Questa è la visibilità, che richiede una sincronizzazione.' },
        { t: 'Le scritture di un thread sono osservate dagli altri nell’ordine del programma', fb: 'Questo è l’ordinamento, che fra thread diversi non è garantito senza sincronizzazione.' }] }
    ]
  }
});
