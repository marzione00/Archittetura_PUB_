'use strict';
SL.unita563 = (() => {
  const esito = (p) => (p.primo === 'c1' ? 'rimuove' : p.modo === 'while' ? 'attende' : 'errore');
  const traccia = (p) => {
    const c2 = p.primo === 'c2', ciclo = p.modo === 'while', T = [];
    const S = (atto, titolo, testo, s, extra) => T.push(Object.assign({ atto, titolo, testo, n: 0, mutex: '', cond: '', P: 'in arrivo', C1: '', C2: c2 ? 'in arrivo' : 'assente', pred: '·', acc: '', guasto: false }, s, extra ? { extra } : {}));
    S(0, 'C1 controlla la coda', 'Il consumatore C1 possiede il mutex e valuta il predicato elementi > 0. La coda è vuota: il predicato è falso, e C1 deve aspettare.', { mutex: 'C1', C1: 'ha il mutex', pred: 'falso', acc: '1q' }, { calc: 'elementi = 0 · predicato falso' });
    S(0, 'C1 si mette in attesa', 'C1 chiama l’attesa sulla condizione. Con una sola operazione atomica rilascia il mutex e si addormenta. Il mutex è ora libero per chi deve cambiare la coda.', { cond: 'C1', C1: 'dorme', acc: '1mc' }, { calc: 'mutex libero · C1 dorme' });
    S(1, 'P deposita e segnala', 'Il produttore P acquisisce il mutex, deposita un elemento, segnala la condizione e rilascia il mutex. C1 viene risvegliato. Prima di proseguire deve riacquisire il mutex, in gara con chiunque altro lo chieda.', { n: 1, P: 'ha depositato', C1: 'sveglio · senza mutex', pred: 'da ricontrollare', acc: 'Pnc' }, { calc: 'elementi 0 → 1 · segnale', chiedi: { d: 'C1 è stato risvegliato. Può dare per certo che al suo turno la coda conterrà un elemento?', o: ['No: prima di lui può passare un altro thread', 'Sì: il segnale lo garantisce'], g: 0, no: 'Il segnale dice che la coda è cambiata. Fra il segnale e la ripresa di C1 il mutex è libero, e altri possono entrare.' } });
    if (c2) S(1, 'C2 passa per primo', 'Un secondo consumatore, C2, ottiene il mutex prima di C1. Trova un elemento, lo rimuove e rilascia il mutex. La coda è di nuovo vuota.', { n: 0, P: 'ha depositato', C1: 'sveglio · senza mutex', C2: 'ha rimosso', pred: 'da ricontrollare', acc: '2n' }, { calc: 'elementi 1 → 0' });
    const n = c2 ? 0 : 1, dopo = c2 ? 'ha rimosso' : 'assente';
    S(2, 'C1 riacquisisce il mutex', 'C1 ottiene il mutex, e la sua chiamata di attesa ritorna. In questo momento la coda contiene ' + (n === 1 ? '1 elemento.' : '0 elementi.'), { n, mutex: 'C1', P: 'ha depositato', C1: 'ha il mutex', C2: dopo, pred: 'da ricontrollare', acc: '1m' }, { calc: 'mutex di C1 · elementi = ' + n });
    if (ciclo && !c2) S(2, 'C1 ricontrolla il predicato', 'L’attesa era dentro un ciclo, e C1 valuta di nuovo elementi > 0. Il predicato è vero: C1 rimuove l’elemento, e la coda scende a 0.', { n: 0, mutex: 'C1', P: 'ha depositato', C1: 'ha rimosso', C2: dopo, pred: 'vero', acc: '1nq' }, { calc: 'predicato vero · elementi 1 → 0' });
    else if (ciclo) S(2, 'C1 ricontrolla il predicato', 'L’attesa era dentro un ciclo, e C1 valuta di nuovo elementi > 0. Il predicato è falso: C1 torna ad attendere sulla condizione, rilasciando di nuovo il mutex.', { n: 0, cond: 'C1', P: 'ha depositato', C1: 'dorme', C2: dopo, pred: 'falso', acc: '1qc' }, { calc: 'predicato falso · C1 dorme' });
    else if (!c2) S(2, 'C1 prosegue senza ricontrollare', 'Il programma usa un «se» al posto del ciclo, e C1 passa direttamente alla rimozione. La coda conteneva un elemento, e la rimozione riesce. È andata bene per l’ordine in cui si sono svolti i fatti, senza alcuna garanzia da parte del programma.', { n: 0, mutex: 'C1', P: 'ha depositato', C1: 'ha rimosso', C2: dopo, pred: 'saltato', acc: '1nq' }, { calc: 'controllo saltato · elementi 1 → 0' });
    else S(2, 'C1 prosegue senza ricontrollare', 'Il programma usa un «se» al posto del ciclo, e C1 passa direttamente alla rimozione. La coda è vuota: C1 preleva un elemento che manca. È un errore, e da questo punto il contenuto della coda è inattendibile.', { n: 0, mutex: 'C1', P: 'ha depositato', C1: 'rimuove a vuoto', C2: dopo, pred: 'saltato', acc: '1nq', guasto: true }, { calc: 'controllo saltato · coda vuota' });
    const e = esito(p), u = T[T.length - 1];
    S(3, 'L’esito', e === 'rimuove' ? (ciclo ? 'C1 ha rimosso l’elemento dopo avere verificato di nuovo il predicato.' : 'C1 ha rimosso l’elemento. Il controllo saltato questa volta è passato inosservato, perché nessuno è entrato prima di lui.') : e === 'attende' ? 'C1 è tornato ad attendere. Il risveglio lo aveva autorizzato a un nuovo controllo, e il controllo ha trovato la coda vuota. Nessuna rimozione a vuoto è avvenuta.' : 'C1 ha rimosso da una coda vuota. Il segnale era arrivato quando la coda conteneva un elemento, e C2 lo ha portato via prima che C1 riprendesse il mutex.', { n: u.n, mutex: u.mutex, cond: u.cond, P: u.P, C1: u.C1, C2: u.C2, pred: u.pred, guasto: u.guasto }, { esito: [e === 'rimuove' ? 'C1 rimuove l’elemento' : e === 'attende' ? 'C1 torna ad attendere' : 'rimozione da coda vuota', e === 'errore' ? 'no' : 'si'] });
    return T;
  };
  const quadro = (pre, s, o) => {
    const el = SL.el, w3 = (o.w - 20) / 3, a = (c) => s.acc.indexOf(c) >= 0, st = (acceso, rosso) => (rosso ? 'err' : acceso ? 'att' : 'on');
    return [
      el.box(pre + 'n', o.x, o.y, w3, 54, 'elementi in coda', String(s.n), st(a('n'), s.guasto), { cls: 'stretta' }),
      el.box(pre + 'm', o.x + w3 + 10, o.y, w3, 54, 'mutex', s.mutex ? 'di ' + s.mutex : 'libero', st(a('m'), false), { cls: 'stretta' }),
      el.box(pre + 'c', o.x + 2 * (w3 + 10), o.y, w3, 54, 'dorme sulla condizione', s.cond || 'nessuno', st(a('c'), false), { cls: 'stretta' }),
      el.box(pre + 'P', o.x, o.y + 64, w3, 54, 'produttore P', s.P, a('P') ? 'att' : s.P === 'in arrivo' ? '' : 'on', { cls: 'stretta' }),
      el.box(pre + '1', o.x + w3 + 10, o.y + 64, w3, 54, 'consumatore C1', s.C1, st(a('1'), s.guasto), { cls: 'stretta' }),
      el.box(pre + '2', o.x + 2 * (w3 + 10), o.y + 64, w3, 54, 'consumatore C2', s.C2, a('2') ? 'att' : s.C2 === 'ha rimosso' ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'q', o.x, o.y + 128, o.w, 54, 'predicato · elementi > 0', s.pred, s.pred === 'saltato' ? 'err' : a('q') ? 'att' : s.pred === 'da ricontrollare' ? 'zero' : 'on', { cls: 'stretta' })
    ];
  };
  return { esito, traccia, quadro };
})();
SL.registra('5.6.3', {
  titolo: 'Attendere una condizione sotto mutex',
  obiettivo: 'Obiettivo: seguire un’attesa su una variabile di condizione, dal rilascio del mutex al risveglio, e spiegare perché il predicato va ricontrollato a ogni ritorno.',
  concetti: [['lente', 'Un predicato: vero oppure falso'], ['coda', 'Dormire rilasciando il mutex'], ['riproduci', 'Dopo il risveglio si ricontrolla']],
  filigrana: ['lente', 'coda', 'lucchetto'],
  richiami: {
    carte: [
      { sim: 'lucchetto', da: 'Dall’unità 5.6.2', t: 'Aspettare tenendo un lock', d: 'Chi aspetta un evento deve lasciare libero ciò che serve a chi lo produce.' },
      { sim: 'conflitto', da: 'Dall’unità 5.5.7', t: 'Controlla e poi agisci', d: 'Controllo e azione vanno tenuti insieme sotto lo stesso lock.' },
      { sim: 'coda', da: 'Dall’unità 5.1.4', t: 'Bloccato e risvegliato', d: 'Chi è bloccato lascia il processore, e torna pronto quando arriva il suo evento.' }
    ],
    domanda: { d: 'Prima di proseguire: un thread controlla una coda sotto mutex, la trova vuota e rilascia il mutex. Più tardi lo riprende. Che cosa sa della coda?', o: [
      { t: 'Nulla: deve controllarla di nuovo', ok: true, fb: 'Mentre il mutex era libero, altri thread possono averla cambiata.' },
      { t: 'È ancora vuota', fb: 'Un produttore può avere depositato nel frattempo.' },
      { t: 'Contiene un elemento', fb: 'Nessuno lo garantisce. La coda va controllata di nuovo.' }
    ] }
  },
  idea: {
    titolo: 'Aspettare che una cosa diventi vera',
    termini: ['predicato', 'variabile di condizione', 'pthread_cond_wait'],
    testo: [
      'Un semaforo conta. Molte attese però riguardano condizioni che un contatore descrive male: la coda contiene almeno un elemento, il saldo copre il prelievo, tutti i lavoratori hanno finito. Una condizione di questo tipo, che in un dato istante è vera oppure falsa, si chiama [[predicato]]. Un consumatore può togliere un elemento da una coda soltanto se il predicato «elementi > 0» è vero nel momento in cui agisce.',
      'Il predicato riguarda dati condivisi, e va quindi valutato sotto mutex. In caso contrario un altro thread potrebbe cambiare la coda fra il controllo e la rimozione, come nell’unità 5.5.7. Qui nasce una difficoltà. Se il predicato è falso il consumatore deve aspettare. Se aspettasse tenendo il mutex, nessun produttore potrebbe entrare a depositare: sarebbe lo stesso deadlock dell’unità precedente.',
      'Lo strumento adatto è la [[variabile di condizione]]: un punto di attesa associato a un mutex. La sua operazione di attesa, che nella libreria dei thread si chiama [[pthread_cond_wait]], compie due azioni come un’unica operazione atomica: rilascia il mutex e addormenta il thread. Il produttore può così acquisire il mutex, depositare il dato e segnalare la condizione. Il thread risvegliato, prima di proseguire, deve riacquisire il mutex.',
      { fig: 'scena', w: 720, h: 190, titolo: 'C1 è sveglio, e C2 è passato prima di lui', nota: 'Il segnale è partito quando la coda conteneva un elemento. Al turno di C1 la coda è di nuovo vuota.', els: SL.unita563.quadro('g', SL.unita563.traccia({ primo: 'c2', modo: 'while' })[3], { x: 10, y: 4, w: 700 }) },
      'In quest’ultimo passaggio si nasconde una trappola. Fra il segnale e la riacquisizione del mutex passa del tempo, e in quel tempo il mutex è libero. Un secondo consumatore può prenderlo, trovare l’elemento e portarselo via. Quando il primo consumatore riparte, la coda è di nuovo vuota. Il segnale gli aveva detto che qualcosa era cambiato, senza promettergli che il predicato sarebbe stato ancora vero al suo ritorno.',
      'Il rimedio è una riga di programma. L’attesa va scritta dentro un ciclo: finché il predicato è falso, attendi. A ogni ritorno dall’attesa il thread possiede di nuovo il mutex e ricontrolla. Se trova vero procede, e se trova falso torna a dormire. Con un «se» al posto del ciclo il thread proseguirebbe sulla fiducia, e la notifica verrebbe scambiata per una verifica. Sono due eventi distinti.'
    ]
  },
  esperimento: {
    faremo: [
      'Il consumatore C1 trova la coda vuota e si addormenta sulla condizione. Un produttore deposita un elemento e lo risveglia. Sceglierai chi ottiene per primo il mutex dopo il segnale, e se C1 ricontrolla il predicato al ritorno.',
      'Seguiremo gli elementi in coda, il proprietario del mutex e chi dorme sulla condizione. In basso c’è il valore del predicato, come lo conosce C1.'
    ],
    vedrai: [
      ['coda', 'La coda e i suoi guardiani', 'In alto: gli elementi in coda, il proprietario del mutex, e chi dorme sulla condizione.'],
      ['thread', 'I tre thread', 'Al centro: lo stato del produttore P e dei consumatori C1 e C2.'],
      ['lente', 'Il predicato', 'In basso: il valore di elementi > 0 secondo l’ultimo controllo di C1.']
    ]
  },
  lab: {
    titolo: 'Un segnale, e chi arriva prima al mutex',
    scena: { w: 860, h: 194 },
    atti: ['L’attesa', 'Il segnale', 'La ripresa', 'L’esito'],
    controlli: [
      { id: 'primo', tipo: 'scelta', eti: 'Dopo il segnale ottiene il mutex', opzioni: [['c1', 'C1 per primo'], ['c2', 'un altro consumatore, C2']], valore: 'c2' },
      { id: 'modo', tipo: 'scelta', eti: 'Al ritorno C1', opzioni: [['while', 'ricontrolla il predicato (ciclo)'], ['if', 'prosegue senza ricontrollare (se)']], valore: 'while' }
    ],
    nota: 'Il numero dei passi dipende dal caso. Il produttore deposita sempre un solo elemento.',
    previsione: {
      domanda: (p) => 'C1 dorme su una coda vuota. P deposita un elemento e segnala. Dopo il segnale il mutex viene preso per primo da ' + (p.primo === 'c1' ? 'C1' : 'un altro consumatore, C2, che rimuove l’elemento') + '. Al ritorno dall’attesa C1 ' + (p.modo === 'while' ? 'ricontrolla il predicato in un ciclo' : 'prosegue senza ricontrollare') + '. Che cosa fa C1?',
      opzioni: () => [['rimuove', 'Rimuove l’elemento'], ['attende', 'Torna ad attendere'], ['errore', 'Rimuove da una coda vuota']]
    },
    confronto: (pred, esito, p) => { const N = { rimuove: 'rimuove l’elemento', attende: 'torna ad attendere', errore: 'rimuove da una coda vuota' }; return 'La previsione indicava che C1 «' + N[pred] + '». C1 ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'rimuove' ? 'Nessuno è entrato fra il segnale e la ripresa di C1, e l’elemento era ancora in coda.' : esito === 'attende' ? 'C2 ha portato via l’elemento. Il ciclo ha fatto ricontrollare il predicato a C1, che lo ha trovato falso.' : 'C2 ha portato via l’elemento, e C1, senza ricontrollare, ha agito su una coda vuota.'); },
    costruisci(p) {
      const U = SL.unita563, T = U.traccia(p);
      const passi = T.map((s) => Object.assign({ atto: s.atto, titolo: s.titolo, testo: s.testo, hud: [['Elementi', String(s.n), 'a'], ['Mutex', s.mutex ? 'di ' + s.mutex : 'libero'], ['Predicato', s.pred, 'c']], els: U.quadro('b', s, { x: 20, y: 4, w: 820 }) }, s.extra || {}));
      return { passi, esito: U.esito(p) };
    }
  },
  bilancio: {
    regola: [
      'L’attesa su una condizione rilascia il mutex e addormenta il thread in un’unica operazione atomica. Al ritorno il thread possiede di nuovo il mutex.',
      'L’attesa va dentro un ciclo: finché il predicato è falso, attendi. Il predicato si ricontrolla a ogni ritorno.'
    ],
    errori: [
      ['Scambiare il segnale per una garanzia.', 'Il segnale annuncia un cambiamento. Il predicato può essere tornato falso prima che il thread riprenda il mutex.'],
      ['Proteggere l’attesa con un «se».', 'Dopo il risveglio il thread proseguirebbe senza sapere se la condizione vale ancora.'],
      ['Valutare il predicato senza mutex.', 'La coda potrebbe cambiare fra il controllo e l’azione.']
    ],
    saFare: ['Seguire mutex e condizione durante un’attesa.', 'Spiegare perché l’attesa rilascia il mutex.', 'Scrivere l’attesa dentro un ciclo sul predicato.'],
    esercizi: [
      { d: 'Perché l’attesa su una variabile di condizione rilascia il mutex?', guida: 'Si scelga la risposta.', o: [
        { t: 'Per lasciare entrare chi deve rendere vero il predicato', ok: true, fb: 'Il produttore ha bisogno del mutex per depositare.' },
        { t: 'Per risparmiare memoria', fb: 'Un mutex occupa la stessa memoria da libero e da occupato.' },
        { t: 'Perché un mutex scade dopo un certo tempo', fb: 'Un mutex resta del proprietario fino al rilascio.' }] },
      { d: 'Una coda è vuota, e 3 consumatori dormono sulla stessa condizione. Un produttore deposita 1 elemento e li risveglia tutti e tre. Ognuno ricontrolla il predicato in un ciclo. Quanti tornano ad attendere?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: 'Il primo che ottiene il mutex rimuove l’elemento. Gli altri due trovano la coda vuota.',
        diagnosi: [
          { se: ['0', 'zero', 'nessuno'], msg: 'L’elemento è uno solo, e lo rimuove il primo che ottiene il mutex.' },
          { se: ['3', 'tre'], msg: 'Il primo che ottiene il mutex trova l’elemento e lo rimuove.' },
          { se: ['1', 'uno'], msg: 'Uno è il consumatore che rimuove. Gli altri trovano la coda vuota.' }
        ],
        altro: 'Il numero è diverso. Conta quanti consumatori trovano il predicato vero.',
        indizi: ['L’elemento depositato è uno.', 'Un solo consumatore trova elementi > 0.', '3 − 1 = 2.'],
        svolgimento: ['Consumatori risvegliati: 3.', 'Trovano un elemento: 1.', 'Tornano ad attendere: 2.'] },
      { d: 'Quale forma è corretta per l’attesa di un consumatore?', guida: 'Si scelga la risposta.', o: [
        { t: 'Finché elementi vale 0: attendi sulla condizione', ok: true, fb: 'Il ciclo ricontrolla il predicato a ogni risveglio.' },
        { t: 'Se elementi vale 0: attendi sulla condizione', fb: 'Dopo il risveglio il thread proseguirebbe senza ricontrollare.' },
        { t: 'Attendi sulla condizione, senza guardare elementi', fb: 'Con un elemento già in coda, il thread dormirebbe aspettando un segnale già passato.' }] }
    ],
    sfida: ['cslez5_6_03_classical_sync', 'Posti occupati, prenotazioni e blocchi']
  }
});
