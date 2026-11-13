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
  obiettivo: 'Alla fine saprai preparare la chiamata successiva dopo una write che ha consegnato soltanto una parte dei byte, e dire che cosa cambia quando la chiamata restituisce un errore.',
  concetti: [['puntatore', 'Da dove ripartire'], ['bilancio', 'Quanto resta'], ['scudo', 'Un errore lascia tutto com’è']],
  filigrana: ['puntatore', 'bilancio', 'scudo'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 2.5.3', t: 'Il trasferimento parziale', d: 'Una write può consegnare meno byte di quelli chiesti. Il valore restituito dice quanti.' },
      { sim: 'scudo', da: 'Dall’unità 4.2.2', t: 'EBADF', d: 'Con un descrittore non valido il kernel restituisce −9, senza copiare nulla.' },
      { sim: 'hex', da: 'Dall’unità 1.2.4', t: 'L’esadecimale', d: 'Dopo 0x5009 viene 0x500A, e dopo 0x500F viene 0x5010.' }
    ],
    domanda: { d: 'Prima di proseguire: un buffer comincia all’indirizzo 0x5000. A quale indirizzo si trova il suo sesto byte?', o: [
      { t: '0x5005', ok: true, fb: 'Il primo byte è a 0x5000, e il sesto sta cinque posti più avanti.' },
      { t: '0x5006', fb: 'A 0x5006 si trova il settimo byte, perché il primo è a 0x5000.' },
      { t: '0x5060', fb: 'Ogni byte fa avanzare l’indirizzo di una unità.' }
    ] }
  },
  idea: {
    titolo: 'Tenere il conto di ciò che è partito',
    termini: ['ciclo di scrittura'],
    testo: [
      'Una write riuscita può avere consegnato soltanto la parte iniziale del buffer. Capita quando la destinazione ha poco spazio: una pipe quasi piena, una connessione lenta. Il kernel copia ciò che entra e restituisce quel conteggio. Sta al programma consegnare il resto.',
      'Il conteggio dice due cose insieme. I byte confermati sono partiti, e vanno tolti dalla lunghezza. Il primo byte ancora da consegnare si trova tanti posti più avanti quanti sono i byte confermati, e lì va spostato il puntatore. Se da 0x5000 si chiedono dodici byte e ne partono cinque, sono partiti quelli da 0x5000 a 0x5004. La chiamata successiva comincia da 0x5005 e chiede sette byte.',
      { fig: 'scena', w: 720, h: 86, titolo: 'Dodici byte richiesti, cinque confermati', nota: 'Le caselle azzurre sono partite. La scrittura riprende dalla casella gialla, a 0x5005.', els: SL.unita423.quadro('g', { n: 12, cap: 5, esito: 'ok' }, 4, { x: 10, y: 8, w: 700, hc: 34 }) },
      'Ripetendo l’operazione finché la lunghezza arriva a zero si ottiene un [[ciclo di scrittura]]. I due aggiornamenti vanno sempre fatti insieme, e con lo stesso numero: quello restituito dal kernel, che può essere diverso a ogni giro.',
      'Un valore negativo è un’altra storia. La convalida è fallita prima di ogni copia, e nessun byte è partito. Il puntatore e la lunghezza restano quelli di prima. Ripetere subito la stessa chiamata darebbe lo stesso errore: prima va rimossa la causa.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma deve consegnare un buffer che comincia a 0x5000. La destinazione accetta pochi byte per volta. Sceglierai quanti byte ha il buffer, quanti ne entrano a ogni chiamata, e se la chiamata riesce.',
      'Dopo la prima write aggiorneremo il puntatore e la lunghezza per la chiamata successiva. Dopo il caso proposto, fai fallire la chiamata con un errore e osserva che cosa resta da fare.'
    ],
    vedrai: [
      ['memory', 'Il buffer', 'In alto: una casella per byte. Le caselle azzurre sono già partite.'],
      ['register', 'Richiesta e risposta', 'In basso a sinistra: i valori passati al kernel e quello restituito.'],
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
    nota: 'I passi sono sempre sei. Il buffer comincia all’indirizzo 0x5000.',
    previsione: {
      domanda: (p) => 'Il programma chiama write con RSI = 0x5000 e RDX = ' + p.n + '. ' + (p.esito === 'ok' ? 'La destinazione accetta ' + p.cap + ' byte.' : 'Il kernel restituisce −9, l’errore EBADF.') + ' Con quali valori va fatta la chiamata successiva?',
      opzioni: (p) => { const H = SL.kern.H, k = Math.min(p.n, p.cap); return [[0x5000 + ':' + p.n, 'RSI = 0x5000 e RDX = ' + p.n], [(0x5000 + k) + ':' + (p.n - k), 'RSI = ' + H(0x5000 + k) + ' e RDX = ' + (p.n - k)], [(0x5000 + k) + ':' + p.n, 'RSI = ' + H(0x5000 + k) + ' e RDX = ' + p.n], [0x5000 + ':' + (p.n - k), 'RSI = 0x5000 e RDX = ' + (p.n - k)]]; }
    },
    confronto: (pred, esito, p) => { const H = SL.kern.H, N = (v) => { const x = v.split(':'); return 'RSI = ' + H(Number(x[0])) + ' e RDX = ' + x[1]; }; return 'Avevi previsto ' + N(pred) + '. I valori giusti sono ' + N(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.esito === 'errore' ? 'Dopo un errore nessun byte è partito, e la richiesta resta quella di prima.' : 'Puntatore e lunghezza si aggiornano insieme, con il numero di byte confermati.'); },
    costruisci(p) {
      const U = SL.unita423, H = U.H, passi = [], c = U.conti(p), R = c.ok ? String(c.k) : '−9';
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'BUFFER DEL PROGRAMMA', 'mono')].concat(U.quadro('q', p, f, { x: 20, y: 24, w: 820, hc: 36, conti: true, h: 60, gap: 14 }));
      const hud = (f) => [['Byte richiesti', String(p.n), 'a'], ['Byte confermati', f >= 1 ? String(c.k) : '·'], ['Byte residui', f >= 4 ? String(c.resto) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La richiesta', 'Il buffer contiene ' + p.n + ' byte, da ' + H(U.BASE) + ' a ' + H(U.BASE + p.n - 1) + '. Il programma chiama write con RSI = ' + H(U.BASE) + ' e RDX = ' + p.n + ': chiede di consegnarli tutti.', {});
      P(1, 1, 'La risposta del kernel', c.ok ? (c.k < p.n ? 'La destinazione ha spazio per ' + p.cap + ' byte soltanto. Il kernel copia i primi ' + c.k + ' e restituisce RAX = ' + c.k + '. La chiamata è riuscita, anche se ha fatto meno di quanto chiesto.' : 'La destinazione ha spazio per tutti. Il kernel copia i ' + c.k + ' byte e restituisce RAX = ' + c.k + '.') : 'La convalida del descrittore fallisce. Il kernel restituisce RAX = −9, l’errore EBADF, senza avere copiato nulla.', { calc: 'RAX = ' + R,
        chiedi: { d: 'Quanti byte sono partiti, secondo il valore restituito?', o: [String(p.n), String(Math.min(p.n, p.cap)), '0'], g: c.ok ? (c.k === p.n ? 0 : 1) : 2, no: c.ok ? 'Un valore positivo in RAX è il numero di byte consegnati: ' + c.k + '.' : 'Un valore negativo è un errore, e nessun byte è partito.' } });
      P(2, 2, 'I byte confermati', c.ok ? 'I byte confermati sono ' + c.k + ', quelli da ' + H(U.BASE) + ' a ' + H(U.BASE + c.k - 1) + '. Sono usciti dal programma e non vanno consegnati di nuovo.' : 'Nessun byte è confermato. Tutto il buffer è ancora da consegnare.', { calc: 'confermati: ' + c.k });
      P(3, 2, 'Il nuovo puntatore', c.ok ? (c.resto ? 'Il primo byte ancora da consegnare si trova ' + c.k + ' posti dopo l’inizio: ' + H(U.BASE) + ' + ' + c.k + ' = ' + H(c.ptr) + '. Questo valore va in RSI per la chiamata successiva.' : 'Il puntatore avanzerebbe fino a ' + H(c.ptr) + ', oltre l’ultimo byte del buffer. Non resta nulla da cui ripartire.') : 'Il puntatore resta a ' + H(U.BASE) + '. Avanzare dopo un errore farebbe perdere i byte saltati.', { calc: H(U.BASE) + ' + ' + c.k + ' = ' + H(c.ptr) });
      P(4, 2, 'La nuova lunghezza', c.ok ? (c.resto ? 'Restano da consegnare ' + p.n + ' − ' + c.k + ' = ' + c.resto + ' byte. Questo valore va in RDX. I due aggiornamenti usano lo stesso numero, ' + c.k + '.' : 'Restano ' + p.n + ' − ' + c.k + ' = 0 byte. La consegna è completa.') : 'La lunghezza resta ' + p.n + '. La richiesta successiva, quando la causa dell’errore sarà rimossa, è identica alla prima.', { calc: p.n + ' − ' + c.k + ' = ' + c.resto, esito: [c.resto ? 'RSI = ' + H(c.ptr) + ' · RDX = ' + c.resto : 'consegna completa', c.ok ? 'si' : 'no'] });
      P(5, 3, c.ok ? 'Il ciclo di scrittura' : 'Prima la causa', c.ok ? (c.giri === 1 ? 'Una sola chiamata è bastata.' : 'Ripetendo chiamata e aggiornamento il programma consegna tutto il buffer. Se la destinazione continua ad accettare ' + p.cap + ' byte per volta servono ' + c.giri + ' chiamate in tutto. Il conteggio può cambiare a ogni giro, e va letto ogni volta da RAX.') : 'Ripetere subito la stessa write darebbe di nuovo −9. Il programma deve prima capire perché il descrittore non è valido, per esempio perché è stato chiuso per errore, e rimediare.', { calc: c.ok ? 'chiamate necessarie: ' + c.giri : 'nessun avanzamento', esito: [c.resto ? 'RSI = ' + H(c.ptr) + ' · RDX = ' + c.resto : 'consegna completa', c.ok ? 'si' : 'no'] });
      return { passi, esito: c.ptr + ':' + c.resto };
    }
  },
  bilancio: {
    regola: [
      'Dopo una write riuscita il valore in RAX è il numero di byte confermati. Il puntatore avanza di quel numero, e la lunghezza diminuisce dello stesso numero.',
      'Un valore negativo segnala un errore avvenuto prima di ogni copia. Puntatore e lunghezza restano invariati, e la causa va rimossa prima di riprovare.'
    ],
    errori: [
      ['Ripartire dall’inizio del buffer.', 'I byte confermati sono già arrivati. Rimandarli li consegnerebbe due volte.'],
      ['Aggiornare soltanto la lunghezza.', 'Con il puntatore fermo la chiamata successiva rimanderebbe i primi byte, e gli ultimi andrebbero perduti.'],
      ['Usare il valore negativo per avanzare.', 'Sottrarre 9 al puntatore o sommarlo alla lunghezza sarebbe privo di senso, perché dopo un errore nulla si è mosso.']
    ],
    saFare: ['Calcolo il puntatore per la chiamata successiva.', 'Calcolo i byte residui.', 'Tratto un valore negativo come un errore, senza avanzare.'],
    esercizi: [
      { d: 'Un programma chiama write con RSI = 0x7000 e RDX = 30. Il kernel restituisce 11. Quale valore va in RSI per la chiamata successiva? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['700b', '0x700b', '700bh'],
        ok: 'Il puntatore avanza dei byte confermati: 0x7000 + 11 = 0x700B.',
        diagnosi: [
          { se: ['7011', '0x7011', '7011h'], msg: 'Undici in esadecimale si scrive 0xB.' },
          { se: ['7000', '0x7000', '7000h'], msg: 'I primi 11 byte sono già partiti. Ripartire da qui li rimanderebbe.' },
          { se: ['701e', '0x701e', '701eh'], msg: 'Questo è l’indirizzo che segue la fine del buffer. Sono partiti soltanto 11 byte.' }
        ],
        altro: 'Il valore è diverso. Somma al puntatore i byte confermati, in esadecimale.',
        indizi: ['I byte confermati sono 11.', '11 in esadecimale è 0xB.', '0x7000 + 0xB.'],
        svolgimento: ['Byte confermati: 11 = 0xB.', 'Nuovo puntatore: 0x7000 + 0xB.', 'RSI = 0x700B.'] },
      { d: 'Nella stessa situazione, quale valore va in RDX per la chiamata successiva?', segnaposto: 'Un numero', giuste: ['19', 'diciannove'],
        ok: 'La lunghezza diminuisce dei byte confermati: 30 − 11 = 19.',
        diagnosi: [
          { se: ['30', 'trenta'], msg: 'Con la lunghezza invariata la chiamata chiederebbe 11 byte oltre la fine del buffer.' },
          { se: ['11', 'undici'], msg: 'Questi sono i byte già partiti. Servono quelli che restano.' }
        ],
        altro: 'Il numero è diverso. Togli dai byte richiesti quelli confermati.',
        indizi: ['Erano richiesti 30 byte.', 'Ne sono partiti 11.', '30 − 11.'],
        svolgimento: ['Richiesti: 30.', 'Confermati: 11.', 'RDX = 19.'] },
      { d: 'Una write con RSI = 0x7000 e RDX = 30 restituisce −9. Come va preparata la chiamata successiva?', guida: 'Scegli la risposta.', o: [
        { t: 'Con gli stessi valori, dopo avere rimosso la causa dell’errore', ok: true, fb: 'Nessun byte è partito, e la richiesta resta quella di prima.' },
        { t: 'Con RSI = 0x7009 e RDX = 21', fb: 'Il 9 è il codice dell’errore. Nessun byte è partito.' },
        { t: 'Con RSI = 0x6FF7 e RDX = 39', fb: 'Un valore negativo resta fuori dai conti, perché segnala soltanto che la chiamata è fallita.' }] }
    ],
    sfida: ['cslez4_2_04_syscalls_04', 'Trasferimenti parziali, EOF ed errori']
  }
});
