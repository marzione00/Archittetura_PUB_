'use strict';
SL.unita423 = (() => {
  const H = SL.kern.H, BASE = 0x5000;
  const conti = (p) => { const ok = p.esito === 'ok', k = ok ? Math.min(p.n, p.cap) : 0; return { ok, k, rax: ok ? k : -9, ptr: BASE + k, resto: p.n - k, giri: Math.ceil(p.n / p.cap) }; };
  // fase: 0 la richiesta · 1 la risposta · 2 i byte confermati · 3 il nuovo puntatore · 4 la nuova lunghezza · 5 il ciclo
  const quadro = (pre, p, f, o) => {
    const el = SL.el, c = conti(p), els = [], passo = o.w / 20;
    for (let i = 0; i < p.n; i++) els.push(el.cella(pre + 'b' + i, o.x + i * passo, o.y, passo - 4, o.hc, '', f >= 2 && i < c.k ? 'on' : f >= 3 && i === c.k ? 'att' : 'zero'));
    els.push(el.nota(pre + 'n0', o.x, o.y + o.hc + 6, H(BASE), 'mono minuta', f < 3 || c.k === 0 ? 'att' : ''));
    if (f >= 3 && c.k > 0 && c.k < p.n) els.push(el.nota(pre + 'n1', o.x + c.k * passo, o.y + o.hc + 6, H(c.ptr), 'mono minuta', 'att'));
    if (o.conti) {
      const y2 = o.y + o.hc + 40, w = (o.w - 3 * o.gap) / 4;
      const B = (id, k, eti, txt, da, st) => el.box(pre + id, o.x + k * (w + o.gap), y2, w, o.h, eti, f >= da ? txt : '·', f === da ? (st || 'att') : f > da ? (st === 'err' ? 'err' : 'on') : '', { cls: 'stretta' });
      els.push(B('q1', 0, 'richiesta', H(BASE) + ' · ' + p.n + ' byte', 0), B('q2', 1, 'risposta del kernel', 'RAX = ' + (c.ok ? c.k : '−9'), 1, c.ok ? 'att' : 'err'), B('q3', 2, 'puntatore successivo', c.resto ? 'RSI = ' + H(c.ptr) : 'nessuno', 3), B('q4', 3, 'lunghezza successiva', c.resto ? 'RDX = ' + c.resto : 'finito', 4));
    }
    return els;
  };
  return { H, BASE, conti, quadro };
})();
SL.registra('4.2.3', {
  titolo: 'Convalida, valori di ritorno e avanzamento parziale',
  obiettivo: 'Obiettivo: preparare la chiamata successiva dopo una write che ha consegnato soltanto una parte dei byte, e indicare che cosa cambia quando la chiamata restituisce un errore.',
  concetti: [['puntatore', 'Il punto di ripresa'], ['bilancio', 'I byte residui'], ['scudo', 'Un errore lascia invariata la richiesta']],
  filigrana: ['puntatore', 'bilancio', 'scudo'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 2.5.3', t: 'Il trasferimento parziale', d: 'Una write può consegnare meno byte di quelli richiesti. Il valore restituito ne indica il numero.' },
      { sim: 'scudo', da: 'Dall’unità 4.2.2', t: 'EBADF', d: 'Con un descrittore non valido il kernel restituisce −9, senza copiare alcun byte.' },
      { sim: 'hex', da: 'Dall’unità 1.2.4', t: 'L’esadecimale', d: 'A 0x5009 segue 0x500A, e a 0x500F segue 0x5010.' }
    ],
    domanda: { d: 'Prima di proseguire: un buffer ha inizio all’indirizzo 0x5000. A quale indirizzo si trova il suo sesto byte?', o: [
      { t: '0x5005', ok: true, fb: 'Il primo byte è a 0x5000, e il sesto si trova cinque posizioni più avanti.' },
      { t: '0x5006', fb: 'A 0x5006 si trova il settimo byte, poiché il primo è a 0x5000.' },
      { t: '0x5060', fb: 'Ogni byte incrementa l’indirizzo di una unità.' }
    ] }
  },
  idea: {
    titolo: 'Il conteggio dei byte consegnati',
    termini: ['ciclo di scrittura'],
    testo: [
      'Una write riuscita può avere consegnato soltanto la parte iniziale del buffer. Ciò accade quando la destinazione dispone di poco spazio: una pipe quasi piena, una connessione lenta. Il kernel copia i byte che la destinazione può accogliere e ne restituisce il numero. Spetta al programma consegnare il resto.',
      'Il conteggio fornisce due informazioni. I byte confermati sono stati consegnati, e vanno sottratti dalla lunghezza. Il primo byte ancora da consegnare si trova tante posizioni più avanti quanti sono i byte confermati, e a tale indirizzo va spostato il puntatore. Se da 0x5000 si richiedono dodici byte e ne sono consegnati cinque, si tratta di quelli da 0x5000 a 0x5004. La chiamata successiva ha inizio da 0x5005 e richiede sette byte.',
      { fig: 'scena', w: 720, h: 86, titolo: 'Dodici byte richiesti, cinque confermati', nota: 'Le celle azzurre sono state consegnate. La scrittura riprende dalla cella gialla, a 0x5005.', els: SL.unita423.quadro('g', { n: 12, cap: 5, esito: 'ok' }, 4, { x: 10, y: 8, w: 700, hc: 34 }) },
      'La ripetizione dell’operazione finché la lunghezza giunge a zero costituisce un [[ciclo di scrittura]]. I due aggiornamenti vanno sempre eseguiti insieme, e con il medesimo numero: quello restituito dal kernel, che può variare a ogni iterazione.',
      'Un valore negativo ha un significato diverso. La convalida è fallita prima di ogni copia, e nessun byte è stato consegnato. Il puntatore e la lunghezza restano invariati. La ripetizione immediata della medesima chiamata darebbe il medesimo errore: va prima rimossa la causa.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma deve consegnare un buffer che ha inizio a 0x5000. La destinazione accetta pochi byte per volta. I controlli fissano la lunghezza del buffer, il numero di byte accettati a ogni chiamata e l’esito della chiamata.',
      'Dopo la prima write si aggiornano il puntatore e la lunghezza per la chiamata successiva. Dopo il caso proposto, è istruttivo far fallire la chiamata con un errore e osservare le operazioni residue.'
    ],
    vedrai: [
      ['memory', 'Il buffer', 'In alto: una cella per byte. Le celle azzurre sono già state consegnate.'],
      ['register', 'Richiesta e risposta', 'In basso a sinistra: i valori trasmessi al kernel e quello restituito.'],
      ['puntatore', 'La chiamata successiva', 'In basso a destra: il nuovo puntatore e la nuova lunghezza.']
    ]
  },
  lab: {
    titolo: 'Dopo la prima write',
    scena: { w: 860, h: 188 },
    atti: ['La richiesta', 'La risposta', 'L’aggiornamento', 'Il ciclo'],
    controlli: [
      { id: 'esito', tipo: 'scelta', eti: 'La chiamata', opzioni: [['ok', 'riesce'], ['errore', 'fallisce con EBADF']], valore: 'ok' },
      { id: 'n', tipo: 'scelta', eti: 'Byte da consegnare', opzioni: [[12, '12'], [20, '20']], valore: 12 },
      { id: 'cap', tipo: 'scelta', eti: 'Byte accettati per chiamata', opzioni: [[5, '5'], [8, '8']], valore: 5 }
    ],
    nota: 'I passi sono sempre sei. Il buffer ha inizio all’indirizzo 0x5000.',
    previsione: {
      domanda: (p) => 'Il programma chiama write con RSI = 0x5000 e RDX = ' + p.n + '. ' + (p.esito === 'ok' ? 'La destinazione accetta ' + p.cap + ' byte.' : 'Il kernel restituisce −9, l’errore EBADF.') + ' Con quali valori va eseguita la chiamata successiva?',
      opzioni: (p) => { const H = SL.kern.H, k = Math.min(p.n, p.cap); return [[0x5000 + ':' + p.n, 'RSI = 0x5000 e RDX = ' + p.n], [(0x5000 + k) + ':' + (p.n - k), 'RSI = ' + H(0x5000 + k) + ' e RDX = ' + (p.n - k)], [(0x5000 + k) + ':' + p.n, 'RSI = ' + H(0x5000 + k) + ' e RDX = ' + p.n], [0x5000 + ':' + (p.n - k), 'RSI = 0x5000 e RDX = ' + (p.n - k)]]; }
    },
    confronto: (pred, esito, p) => { const H = SL.kern.H, N = (v) => { const x = v.split(':'); return 'RSI = ' + H(Number(x[0])) + ' e RDX = ' + x[1]; }; return 'La previsione indicava ' + N(pred) + '. I valori corretti sono ' + N(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.esito === 'errore' ? 'Dopo un errore nessun byte è stato consegnato, e la richiesta resta invariata.' : 'Puntatore e lunghezza si aggiornano insieme, con il numero di byte confermati.'); },
    costruisci(p) {
      const U = SL.unita423, H = U.H, passi = [], c = U.conti(p), R = c.ok ? String(c.k) : '−9';
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'BUFFER DEL PROGRAMMA', 'mono')].concat(U.quadro('q', p, f, { x: 20, y: 24, w: 820, hc: 36, conti: true, h: 60, gap: 14 }));
      const hud = (f) => [['Byte richiesti', String(p.n), 'a'], ['Byte confermati', f >= 1 ? String(c.k) : '·'], ['Byte residui', f >= 4 ? String(c.resto) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La richiesta', 'Il buffer contiene ' + p.n + ' byte, da ' + H(U.BASE) + ' a ' + H(U.BASE + p.n - 1) + '. Il programma chiama write con RSI = ' + H(U.BASE) + ' e RDX = ' + p.n + ': richiede la consegna di tutti i byte.', {});
      P(1, 1, 'La risposta del kernel', c.ok ? (c.k < p.n ? 'La destinazione dispone di spazio per ' + p.cap + ' byte soltanto. Il kernel copia i primi ' + c.k + ' e restituisce RAX = ' + c.k + '. La chiamata è riuscita, benché abbia consegnato meno byte di quelli richiesti.' : 'La destinazione dispone di spazio per tutti. Il kernel copia i ' + c.k + ' byte e restituisce RAX = ' + c.k + '.') : 'La convalida del descrittore fallisce. Il kernel restituisce RAX = −9, l’errore EBADF, senza avere copiato alcun byte.', { calc: 'RAX = ' + R,
        chiedi: { d: 'Quanti byte sono stati consegnati, secondo il valore restituito?', o: [String(p.n), String(Math.min(p.n, p.cap)), '0'], g: c.ok ? (c.k === p.n ? 0 : 1) : 2, no: c.ok ? 'Un valore positivo in RAX è il numero di byte consegnati: ' + c.k + '.' : 'Un valore negativo è un errore, e nessun byte è stato consegnato.' } });
      P(2, 2, 'I byte confermati', c.ok ? 'I byte confermati sono ' + c.k + ', quelli da ' + H(U.BASE) + ' a ' + H(U.BASE + c.k - 1) + '. Essi sono stati consegnati, e vanno esclusi dalla chiamata successiva.' : 'Nessun byte è confermato. L’intero buffer è ancora da consegnare.', { calc: 'confermati: ' + c.k });
      P(3, 2, 'Il nuovo puntatore', c.ok ? (c.resto ? 'Il primo byte ancora da consegnare si trova ' + c.k + ' posizioni dopo l’inizio: ' + H(U.BASE) + ' + ' + c.k + ' = ' + H(c.ptr) + '. Questo valore va scritto in RSI per la chiamata successiva.' : 'Il puntatore avanzerebbe fino a ' + H(c.ptr) + ', oltre l’ultimo byte del buffer. Nessun byte resta da consegnare.') : 'Il puntatore resta a ' + H(U.BASE) + '. Un avanzamento dopo un errore farebbe perdere i byte oltrepassati.', { calc: H(U.BASE) + ' + ' + c.k + ' = ' + H(c.ptr) });
      P(4, 2, 'La nuova lunghezza', c.ok ? (c.resto ? 'Restano da consegnare ' + p.n + ' − ' + c.k + ' = ' + c.resto + ' byte. Questo valore va scritto in RDX. I due aggiornamenti impiegano il medesimo numero, ' + c.k + '.' : 'Restano ' + p.n + ' − ' + c.k + ' = 0 byte. La consegna è completa.') : 'La lunghezza resta ' + p.n + '. La richiesta successiva, una volta rimossa la causa dell’errore, è identica alla prima.', { calc: p.n + ' − ' + c.k + ' = ' + c.resto, esito: [c.resto ? 'RSI = ' + H(c.ptr) + ' · RDX = ' + c.resto : 'consegna completa', c.ok ? 'si' : 'no'] });
      P(5, 3, c.ok ? 'Il ciclo di scrittura' : 'La rimozione della causa', c.ok ? (c.giri === 1 ? 'È stata sufficiente una sola chiamata.' : 'Ripetendo chiamata e aggiornamento il programma consegna l’intero buffer. Se la destinazione continua ad accettare ' + p.cap + ' byte per volta occorrono ' + c.giri + ' chiamate complessive. Il conteggio può variare a ogni iterazione, e va letto ogni volta da RAX.') : 'La ripetizione immediata della medesima write darebbe di nuovo −9. Il programma deve prima individuare la ragione per cui il descrittore non è valido, per esempio una chiusura per errore, e porvi rimedio.', { calc: c.ok ? 'chiamate necessarie: ' + c.giri : 'nessun avanzamento', esito: [c.resto ? 'RSI = ' + H(c.ptr) + ' · RDX = ' + c.resto : 'consegna completa', c.ok ? 'si' : 'no'] });
      return { passi, esito: c.ptr + ':' + c.resto };
    }
  },
  bilancio: {
    regola: [
      'Dopo una write riuscita il valore in RAX è il numero di byte confermati. Il puntatore avanza di quel numero, e la lunghezza diminuisce del medesimo numero.',
      'Un valore negativo segnala un errore avvenuto prima di ogni copia. Puntatore e lunghezza restano invariati, e la causa va rimossa prima di un nuovo tentativo.'
    ],
    errori: [
      ['Ripartire dall’inizio del buffer.', 'I byte confermati sono già stati consegnati. Un nuovo invio li consegnerebbe due volte.'],
      ['Aggiornare soltanto la lunghezza.', 'Con il puntatore invariato la chiamata successiva invierebbe di nuovo i primi byte, e gli ultimi andrebbero perduti.'],
      ['Impiegare il valore negativo per avanzare.', 'La sottrazione di 9 dal puntatore o la sua somma alla lunghezza sarebbero prive di senso, poiché dopo un errore nessun byte è stato consegnato.']
    ],
    saFare: ['Calcolare il puntatore per la chiamata successiva.', 'Calcolare i byte residui.', 'Trattare un valore negativo come un errore, senza avanzare.'],
    esercizi: [
      { d: 'Un programma chiama write con RSI = 0x7000 e RDX = 30. Il kernel restituisce 11. Quale valore va scritto in RSI per la chiamata successiva? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['700b', '0x700b', '700bh'],
        ok: 'Il puntatore avanza dei byte confermati: 0x7000 + 11 = 0x700B.',
        diagnosi: [
          { se: ['7011', '0x7011', '7011h'], msg: 'Undici in esadecimale si scrive 0xB.' },
          { se: ['7000', '0x7000', '7000h'], msg: 'I primi 11 byte sono già stati consegnati. Una ripresa da questo indirizzo li invierebbe di nuovo.' },
          { se: ['701e', '0x701e', '701eh'], msg: 'Questo è l’indirizzo che segue la fine del buffer. Sono stati consegnati soltanto 11 byte.' }
        ],
        altro: 'Il valore è diverso. Si sommino al puntatore i byte confermati, in esadecimale.',
        indizi: ['I byte confermati sono 11.', '11 in esadecimale è 0xB.', '0x7000 + 0xB.'],
        svolgimento: ['Byte confermati: 11 = 0xB.', 'Nuovo puntatore: 0x7000 + 0xB.', 'RSI = 0x700B.'] },
      { d: 'Nella medesima situazione, quale valore va scritto in RDX per la chiamata successiva?', segnaposto: 'Un numero', giuste: ['19', 'diciannove'],
        ok: 'La lunghezza diminuisce dei byte confermati: 30 − 11 = 19.',
        diagnosi: [
          { se: ['30', 'trenta'], msg: 'Con la lunghezza invariata la chiamata richiederebbe 11 byte oltre la fine del buffer.' },
          { se: ['11', 'undici'], msg: 'Questi sono i byte già consegnati. Occorrono quelli residui.' }
        ],
        altro: 'Il numero è diverso. Si sottraggano dai byte richiesti quelli confermati.',
        indizi: ['Erano richiesti 30 byte.', 'Ne sono stati consegnati 11.', '30 − 11.'],
        svolgimento: ['Richiesti: 30.', 'Confermati: 11.', 'RDX = 19.'] },
      { d: 'Una write con RSI = 0x7000 e RDX = 30 restituisce −9. Come va preparata la chiamata successiva?', guida: 'Si scelga la risposta.', o: [
        { t: 'Con i medesimi valori, dopo avere rimosso la causa dell’errore', ok: true, fb: 'Nessun byte è stato consegnato, e la richiesta resta invariata.' },
        { t: 'Con RSI = 0x7009 e RDX = 21', fb: 'Il 9 è il codice dell’errore. Nessun byte è stato consegnato.' },
        { t: 'Con RSI = 0x6FF7 e RDX = 39', fb: 'Un valore negativo è escluso dai calcoli, poiché segnala soltanto il fallimento della chiamata.' }] }
    ],
    sfida: ['cslez4_2_04_syscalls_04', 'Trasferimenti parziali, EOF ed errori']
  }
});
