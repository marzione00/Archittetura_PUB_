'use strict';
SL.unita563 = (() => {
  const esito = (p) => (p.primo === 'c1' ? 'rimuove' : p.modo === 'while' ? 'attende' : 'errore');
  const traccia = (p) => {
    const c2 = p.primo === 'c2', ciclo = p.modo === 'while', T = [];
    const S = (atto, titolo, testo, s, extra) => T.push(Object.assign({ atto, titolo, testo, n: 0, mutex: '', cond: '', P: 'in arrivo', C1: '', C2: c2 ? 'in arrivo' : 'assente', pred: '·', acc: '', guasto: false }, s, extra ? { extra } : {}));
    S(0, 'C1 controlla la coda', 'Il consumatore C1 possiede il mutex e valuta il predicato elementi > 0. La coda è vuota: il predicato è falso, e C1 deve attendere.', { mutex: 'C1', C1: 'ha il mutex', pred: 'falso', acc: '1q' }, { calc: 'elementi = 0 · predicato falso' });
    S(0, 'C1 si pone in attesa', 'C1 chiama l’attesa sulla condizione. Con una sola operazione atomica rilascia il mutex e si sospende. Il mutex è ora libero per il thread che deve modificare la coda.', { cond: 'C1', C1: 'in attesa', acc: '1mc' }, { calc: 'mutex libero · C1 in attesa' });
    S(1, 'P deposita e segnala', 'Il produttore P acquisisce il mutex, deposita un elemento, segnala la condizione e rilascia il mutex. C1 è risvegliato, e prima di proseguire deve riacquisire il mutex, in competizione con ogni altro thread che lo richieda.', { n: 1, P: 'ha depositato', C1: 'sveglio · senza mutex', pred: 'da ricontrollare', acc: 'Pnc' }, { calc: 'elementi 0 → 1 · segnale', chiedi: { d: 'C1 è stato risvegliato. È certo che al suo turno la coda conterrà un elemento?', o: ['No, un altro thread può precederlo', 'Sì, il segnale lo garantisce'], g: 0, no: 'Il segnale indica che la coda è cambiata. Fra il segnale e la ripresa di C1 il mutex è libero, e altri thread possono entrare.' } });
    if (c2) S(1, 'C2 precede C1', 'Un secondo consumatore, C2, ottiene il mutex prima di C1, trova un elemento, lo rimuove e rilascia il mutex. La coda è di nuovo vuota.', { n: 0, P: 'ha depositato', C1: 'sveglio · senza mutex', C2: 'ha rimosso', pred: 'da ricontrollare', acc: '2n' }, { calc: 'elementi 1 → 0' });
    const n = c2 ? 0 : 1, dopo = c2 ? 'ha rimosso' : 'assente';
    S(2, 'C1 riacquisisce il mutex', 'C1 ottiene il mutex, e la sua chiamata di attesa ritorna. In questo momento la coda contiene ' + (n === 1 ? '1 elemento.' : '0 elementi.'), { n, mutex: 'C1', P: 'ha depositato', C1: 'ha il mutex', C2: dopo, pred: 'da ricontrollare', acc: '1m' }, { calc: 'mutex di C1 · elementi = ' + n });
    if (ciclo && !c2) S(2, 'C1 ricontrolla il predicato', 'L’attesa era interna a un ciclo, e C1 valuta nuovamente elementi > 0. Il predicato è vero: C1 rimuove l’elemento, e la coda scende a 0.', { n: 0, mutex: 'C1', P: 'ha depositato', C1: 'ha rimosso', C2: dopo, pred: 'vero', acc: '1nq' }, { calc: 'predicato vero · elementi 1 → 0' });
    else if (ciclo) S(2, 'C1 ricontrolla il predicato', 'L’attesa era interna a un ciclo, e C1 valuta nuovamente elementi > 0. Il predicato è falso: C1 torna ad attendere sulla condizione, e rilascia nuovamente il mutex.', { n: 0, cond: 'C1', P: 'ha depositato', C1: 'in attesa', C2: dopo, pred: 'falso', acc: '1qc' }, { calc: 'predicato falso · C1 in attesa' });
    else if (!c2) S(2, 'C1 prosegue senza nuovo controllo', 'Il programma impiega un «se» in luogo del ciclo, e C1 passa direttamente alla rimozione. La coda conteneva un elemento, e la rimozione riesce. L’esito corretto deriva dall’ordine in cui si sono svolti gli eventi, senza alcuna garanzia da parte del programma.', { n: 0, mutex: 'C1', P: 'ha depositato', C1: 'ha rimosso', C2: dopo, pred: 'saltato', acc: '1nq' }, { calc: 'controllo omesso · elementi 1 → 0' });
    else S(2, 'C1 prosegue senza nuovo controllo', 'Il programma impiega un «se» in luogo del ciclo, e C1 passa direttamente alla rimozione. La coda è vuota: C1 preleva un elemento inesistente. Si tratta di un errore, e da questo punto il contenuto della coda è inattendibile.', { n: 0, mutex: 'C1', P: 'ha depositato', C1: 'rimuove a vuoto', C2: dopo, pred: 'saltato', acc: '1nq', guasto: true }, { calc: 'controllo omesso · coda vuota' });
    const e = esito(p), u = T[T.length - 1];
    S(3, 'L’esito', e === 'rimuove' ? (ciclo ? 'C1 ha rimosso l’elemento dopo avere verificato nuovamente il predicato.' : 'C1 ha rimosso l’elemento. L’omissione del controllo è rimasta in questo caso senza conseguenze, poiché nessun thread è entrato prima di C1.') : e === 'attende' ? 'C1 è tornato ad attendere. Il risveglio lo aveva autorizzato a un nuovo controllo, e il controllo ha trovato la coda vuota. Nessuna rimozione da coda vuota è avvenuta.' : 'C1 ha rimosso da una coda vuota. Il segnale era giunto quando la coda conteneva un elemento, e C2 lo ha rimosso prima che C1 riacquisisse il mutex.', { n: u.n, mutex: u.mutex, cond: u.cond, P: u.P, C1: u.C1, C2: u.C2, pred: u.pred, guasto: u.guasto }, { esito: [e === 'rimuove' ? 'C1 rimuove l’elemento' : e === 'attende' ? 'C1 torna ad attendere' : 'rimozione da coda vuota', e === 'errore' ? 'no' : 'si'] });
    return T;
  };
  const quadro = (pre, s, o) => {
    const el = SL.el, w3 = (o.w - 20) / 3, a = (c) => s.acc.indexOf(c) >= 0, st = (acceso, rosso) => (rosso ? 'err' : acceso ? 'att' : 'on');
    return [
      el.box(pre + 'n', o.x, o.y, w3, 54, 'elementi in coda', String(s.n), st(a('n'), s.guasto), { cls: 'stretta' }),
      el.box(pre + 'm', o.x + w3 + 10, o.y, w3, 54, 'mutex', s.mutex ? 'di ' + s.mutex : 'libero', st(a('m'), false), { cls: 'stretta' }),
      el.box(pre + 'c', o.x + 2 * (w3 + 10), o.y, w3, 54, 'attende la condizione', s.cond || 'nessuno', st(a('c'), false), { cls: 'stretta' }),
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
  obiettivo: 'Obiettivo: seguire un’attesa su una variabile di condizione, dal rilascio del mutex al risveglio, e spiegare per quale ragione il predicato va verificato nuovamente a ogni ritorno.',
  concetti: [['lente', 'Un predicato: vero oppure falso'], ['coda', 'La sospensione con rilascio del mutex'], ['riproduci', 'Dopo il risveglio il controllo si ripete']],
  filigrana: ['lente', 'coda', 'lucchetto'],
  richiami: {
    carte: [
      { sim: 'lucchetto', da: 'Dall’unità 5.6.2', t: 'L’attesa in possesso di un lock', d: 'Un thread in attesa di un evento deve lasciare libere le risorse necessarie al thread che lo produce.' },
      { sim: 'conflitto', da: 'Dall’unità 5.5.7', t: 'Lo schema «controlla e poi agisci»', d: 'Controllo e azione vanno eseguiti insieme sotto il medesimo lock.' },
      { sim: 'coda', da: 'Dall’unità 5.1.4', t: 'Bloccato e risvegliato', d: 'Un thread bloccato lascia il processore, e torna pronto quando si verifica il suo evento.' }
    ],
    domanda: { d: 'Prima di proseguire: un thread controlla una coda sotto mutex, la trova vuota e rilascia il mutex. In seguito lo riacquisisce. Quale informazione ha sulla coda?', o: [
      { t: 'Nessuna, e deve controllarla nuovamente', ok: true, fb: 'Mentre il mutex era libero, altri thread possono averla modificata.' },
      { t: 'È ancora vuota', fb: 'Un produttore può avere depositato nel frattempo.' },
      { t: 'Contiene un elemento', fb: 'Nessuna garanzia lo assicura. La coda va controllata nuovamente.' }
    ] }
  },
  idea: {
    titolo: 'L’attesa di una condizione vera',
    termini: ['predicato', 'variabile di condizione', 'pthread_cond_wait'],
    testo: [
      'Un semaforo esprime un conteggio. Molte attese riguardano tuttavia condizioni che un contatore descrive in modo inadeguato: la coda contiene almeno un elemento, il saldo copre il prelievo, tutti i lavoratori hanno terminato. Una condizione di questo tipo, che in un dato istante è vera oppure falsa, prende il nome di [[predicato]]. Un consumatore può rimuovere un elemento da una coda soltanto se il predicato «elementi > 0» è vero nel momento in cui agisce.',
      'Il predicato riguarda dati condivisi, e va quindi valutato sotto mutex. In caso contrario un altro thread potrebbe modificare la coda fra il controllo e la rimozione, come nell’unità 5.5.7. Ne deriva una difficoltà: se il predicato è falso il consumatore deve attendere, e se attendesse in possesso del mutex nessun produttore potrebbe entrare a depositare. Si avrebbe il medesimo deadlock dell’unità precedente.',
      'Lo strumento adatto è la [[variabile di condizione]]: un punto di attesa associato a un mutex. La sua operazione di attesa, denominata [[pthread_cond_wait]] nella libreria dei thread, compie due azioni come un’unica operazione atomica: rilascia il mutex e sospende il thread. Il produttore può in tal modo acquisire il mutex, depositare il dato e segnalare la condizione. Il thread risvegliato, prima di proseguire, deve riacquisire il mutex.',
      { fig: 'scena', w: 720, h: 190, titolo: 'C1 è stato risvegliato, e C2 lo ha preceduto', nota: 'Il segnale è stato emesso quando la coda conteneva un elemento. Al turno di C1 la coda è di nuovo vuota.', els: SL.unita563.quadro('g', SL.unita563.traccia({ primo: 'c2', modo: 'while' })[3], { x: 10, y: 4, w: 700 }) },
      'Quest’ultimo passaggio contiene un’insidia. Fra il segnale e la riacquisizione del mutex trascorre un intervallo, durante il quale il mutex è libero. Un secondo consumatore può acquisirlo, trovare l’elemento e rimuoverlo. Quando il primo consumatore riprende, la coda è di nuovo vuota. Il segnale aveva indicato un cambiamento, senza garantire che il predicato sarebbe stato ancora vero al ritorno.',
      'Il rimedio è una riga di programma. L’attesa va scritta all’interno di un ciclo: finché il predicato è falso, il thread attende. A ogni ritorno dall’attesa il thread possiede di nuovo il mutex e ripete il controllo. Se il predicato è vero procede, e se è falso torna in attesa. Con un «se» in luogo del ciclo il thread proseguirebbe senza verifica, e la notifica sarebbe scambiata per una verifica, mentre si tratta di due eventi distinti.'
    ]
  },
  esperimento: {
    faremo: [
      'Il consumatore C1 trova la coda vuota e si sospende sulla condizione. Un produttore deposita un elemento e lo risveglia. I controlli fissano il thread che ottiene per primo il mutex dopo il segnale, e la ripetizione o l’omissione del controllo del predicato al ritorno di C1.',
      'L’esperimento segue gli elementi in coda, il proprietario del mutex e il thread in attesa sulla condizione. In basso è riportato il valore del predicato noto a C1.'
    ],
    vedrai: [
      ['coda', 'La coda, il mutex e la condizione', 'In alto: gli elementi in coda, il proprietario del mutex, e il thread in attesa sulla condizione.'],
      ['thread', 'I tre thread', 'Al centro: lo stato del produttore P e dei consumatori C1 e C2.'],
      ['lente', 'Il predicato', 'In basso: il valore di elementi > 0 secondo l’ultimo controllo di C1.']
    ]
  },
  lab: {
    titolo: 'Un segnale, e l’ordine di accesso al mutex',
    scena: { w: 860, h: 194 },
    atti: ['L’attesa', 'Il segnale', 'La ripresa', 'L’esito'],
    controlli: [
      { id: 'primo', tipo: 'scelta', eti: 'Dopo il segnale ottiene il mutex', opzioni: [['c1', 'C1 per primo'], ['c2', 'un altro consumatore, C2']], valore: 'c2' },
      { id: 'modo', tipo: 'scelta', eti: 'Al ritorno C1', opzioni: [['while', 'ripete il controllo del predicato (ciclo)'], ['if', 'prosegue senza nuovo controllo (se)']], valore: 'while' }
    ],
    nota: 'Il numero dei passi dipende dal caso. Il produttore deposita sempre un solo elemento.',
    previsione: {
      domanda: (p) => 'C1 è in attesa su una coda vuota. P deposita un elemento e segnala. Dopo il segnale il mutex è acquisito per primo da ' + (p.primo === 'c1' ? 'C1' : 'un altro consumatore, C2, che rimuove l’elemento') + '. Al ritorno dall’attesa C1 ' + (p.modo === 'while' ? 'ripete il controllo del predicato in un ciclo' : 'prosegue senza nuovo controllo') + '. Quale operazione compie C1?',
      opzioni: () => [['rimuove', 'La rimozione dell’elemento'], ['attende', 'Il ritorno in attesa'], ['errore', 'La rimozione da una coda vuota']]
    },
    confronto: (pred, esito, p) => { const N = { rimuove: 'rimuove l’elemento', attende: 'torna ad attendere', errore: 'rimuove da una coda vuota' }; return 'La previsione indicava che C1 «' + N[pred] + '». C1 ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'rimuove' ? 'Nessun thread è entrato fra il segnale e la ripresa di C1, e l’elemento era ancora in coda.' : esito === 'attende' ? 'C2 ha rimosso l’elemento. Il ciclo ha imposto a C1 un nuovo controllo del predicato, risultato falso.' : 'C2 ha rimosso l’elemento, e C1, senza nuovo controllo, ha agito su una coda vuota.'); },
    costruisci(p) {
      const U = SL.unita563, T = U.traccia(p);
      const passi = T.map((s) => Object.assign({ atto: s.atto, titolo: s.titolo, testo: s.testo, hud: [['Elementi', String(s.n), 'a'], ['Mutex', s.mutex ? 'di ' + s.mutex : 'libero'], ['Predicato', s.pred, 'c']], els: U.quadro('b', s, { x: 20, y: 4, w: 820 }) }, s.extra || {}));
      return { passi, esito: U.esito(p) };
    }
  },
  bilancio: {
    regola: [
      'L’attesa su una condizione rilascia il mutex e sospende il thread in un’unica operazione atomica. Al ritorno il thread possiede di nuovo il mutex.',
      'L’attesa va scritta all’interno di un ciclo: finché il predicato è falso, il thread attende. Il predicato va verificato nuovamente a ogni ritorno.'
    ],
    errori: [
      ['Scambiare il segnale per una garanzia.', 'Il segnale annuncia un cambiamento. Il predicato può essere tornato falso prima che il thread riacquisisca il mutex.'],
      ['Proteggere l’attesa con un «se».', 'Dopo il risveglio il thread proseguirebbe senza verificare se la condizione vale ancora.'],
      ['Valutare il predicato senza mutex.', 'La coda potrebbe cambiare fra il controllo e l’azione.']
    ],
    saFare: ['Seguire mutex e condizione durante un’attesa.', 'Spiegare per quale ragione l’attesa rilascia il mutex.', 'Scrivere l’attesa all’interno di un ciclo sul predicato.'],
    esercizi: [
      { d: 'Per quale ragione l’attesa su una variabile di condizione rilascia il mutex?', guida: 'Si scelga la risposta.', o: [
        { t: 'Per consentire l’ingresso al thread che deve rendere vero il predicato', ok: true, fb: 'Il produttore richiede il mutex per depositare.' },
        { t: 'Per risparmiare memoria', fb: 'Un mutex occupa la medesima memoria da libero e da occupato.' },
        { t: 'Un mutex scade dopo un certo tempo', fb: 'Un mutex resta in possesso del proprietario fino al rilascio.' }] },
      { d: 'Una coda è vuota, e 3 consumatori sono in attesa sulla medesima condizione. Un produttore deposita 1 elemento e li risveglia tutti e tre. Ognuno ripete il controllo del predicato in un ciclo. Quanti tornano ad attendere?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: 'Il primo consumatore che ottiene il mutex rimuove l’elemento. Gli altri due trovano la coda vuota.',
        diagnosi: [
          { se: ['0', 'zero', 'nessuno'], msg: 'L’elemento è uno solo, ed è rimosso dal primo consumatore che ottiene il mutex.' },
          { se: ['3', 'tre'], msg: 'Il primo consumatore che ottiene il mutex trova l’elemento e lo rimuove.' },
          { se: ['1', 'uno'], msg: 'Uno è il consumatore che rimuove. Gli altri trovano la coda vuota.' }
        ],
        altro: 'Il numero è diverso. Si contino i consumatori che trovano il predicato vero.',
        indizi: ['L’elemento depositato è uno.', 'Un solo consumatore trova elementi > 0.', '3 − 1 = 2.'],
        svolgimento: ['Consumatori risvegliati: 3.', 'Trovano un elemento: 1.', 'Tornano ad attendere: 2.'] },
      { d: 'Quale forma è corretta per l’attesa di un consumatore?', guida: 'Si scelga la risposta.', o: [
        { t: 'Finché elementi vale 0, attesa sulla condizione', ok: true, fb: 'Il ciclo verifica nuovamente il predicato a ogni risveglio.' },
        { t: 'Se elementi vale 0, attesa sulla condizione', fb: 'Dopo il risveglio il thread proseguirebbe senza nuovo controllo.' },
        { t: 'Attesa sulla condizione, senza esaminare elementi', fb: 'Con un elemento già in coda, il thread resterebbe in attesa di un segnale già emesso.' }] }
    ],
    sfida: ['cslez5_6_03_classical_sync', 'Posti occupati, prenotazioni e blocchi']
  }
});
