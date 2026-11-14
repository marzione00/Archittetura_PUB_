'use strict';
SL.unita421 = (() => {
  const S = { read: { n: 0, ruolo: 'descrittore da leggere', effetto: 'fino a 8 byte letti', come: 'r' }, write: { n: 1, ruolo: 'descrittore da scrivere', effetto: 'fino a 8 byte scritti', come: 'w' }, exit: { n: 60, ruolo: 'codice di uscita', effetto: 'il programma termina', come: 'x' } };
  // fase: 0 i registri · 1 SYSCALL · 2 lo smistamento · 3 il significato di RDI · 4 l'effetto
  const quadro = (pre, p, f, o) => {
    const el = SL.el, s = S[p.s], els = [], x2 = o.x + o.w1 + o.gap, x3 = x2 + o.w2 + o.gap, py = o.h + 12;
    els.push(el.box(pre + 'a', o.x, o.y, o.w1, o.h, 'numero del servizio', 'RAX = ' + s.n, f === 0 || f === 2 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'b', o.x, o.y + py, o.w1, o.h, 'primo argomento', 'RDI = ' + p.a, f === 0 || f === 3 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'c', o.x, o.y + 2 * py, o.w1, o.h, 'indirizzo di ripresa', f >= 1 ? 'RCX = 0x4012' : 'RCX = ·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }));
    ['read', 'write', 'exit'].forEach((k, j) => els.push(el.cella(pre + 't' + j, x2, o.y + j * (o.hc + 8), o.w2, o.hc, 'voce ' + S[k].n + ' · ' + k, f >= 2 && k === p.s ? (f === 2 ? 'att' : 'on') : f >= 2 ? 'off' : '', { piccola: true, cls: 'minuta' })));
    els.push(el.box(pre + 'd', x2, o.y + 2 * py, o.w2, o.h, 'ingresso nel kernel', f >= 1 ? 'uno solo per tutte' : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'e', x3, o.y, o.w1, o.h, 'servizio scelto', f >= 2 ? p.s : '·', f === 2 ? 'att' : f > 2 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'g', x3, o.y + py, o.w1, o.h, 'il valore ' + p.a + ' in RDI è', f >= 3 ? s.ruolo : '·', f === 3 ? 'att' : f > 3 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'h', x3, o.y + 2 * py, o.w1, o.h, 'effetto', f >= 4 ? s.effetto : '·', f >= 4 ? 'att' : '', { cls: 'stretta' }));
    els.push(el.linea(pre + 'l1', o.x + o.w1, o.y + o.h / 2, x2, o.y + ['read', 'write', 'exit'].indexOf(p.s) * (o.hc + 8) + o.hc / 2, f === 2 ? 'att' : ''));
    return els;
  };
  return { S, quadro };
})();
SL.registra('4.2.1', {
  titolo: 'Dalla richiesta utente all’esecuzione nel kernel',
  obiettivo: 'Obiettivo: dire come il kernel, ricevuta una chiamata di sistema, sceglie il servizio da eseguire, e perché lo stesso valore in RDI può avere significati diversi.',
  concetti: [['gate', 'Un solo ingresso'], ['tabella', 'Il numero sceglie il servizio'], ['register', 'Il servizio dà senso agli argomenti']],
  filigrana: ['gate', 'tabella', 'register'],
  richiami: {
    carte: [
      { sim: 'gate', da: 'Dall’unità 2.5.1', t: 'SYSCALL', d: 'Porta il processore nel modo privilegiato. Salva in RCX l’indirizzo di ripresa e in R11 i flag.' },
      { sim: 'tabella', da: 'Dall’unità 2.5.2', t: 'I registri delle chiamate', d: 'Il numero del servizio va in RAX. Gli argomenti vanno in RDI, RSI, RDX, R10, R8 e R9.' },
      { sim: 'tabella', da: 'Dall’unità 4.1.3', t: 'La IDT', d: 'Per gli interrupt e le eccezioni, un vettore sceglie il gestore in una tabella.' }
    ],
    domanda: { d: 'Prima di proseguire: una istruzione SYSCALL, lunga 2 byte, comincia all’indirizzo 0x4010. Quale valore salva in RCX?', o: [
      { t: '0x4012', ok: true, fb: 'RCX riceve l’indirizzo dell’istruzione che segue SYSCALL, da cui il programma riprenderà.' },
      { t: '0x4010', fb: 'Così il programma, al ritorno, ripeterebbe la stessa chiamata all’infinito.' },
      { t: '0x4014', fb: 'SYSCALL occupa 2 byte, e l’istruzione seguente comincia a 0x4012.' }
    ] }
  },
  idea: {
    titolo: 'Che cosa fa il kernel con una manciata di numeri',
    termini: ['tabella delle chiamate di sistema', 'smistamento'],
    testo: [
      'Nell’unità 2.5.1 abbiamo visto la chiamata di sistema dal lato del programma: i registri da preparare, l’istruzione SYSCALL, il risultato in RAX. Ora la guardiamo dal lato del kernel, che riceve una manciata di numeri e deve capire che cosa gli viene chiesto.',
      'SYSCALL porta il processore al livello 0 e lo fa proseguire da un indirizzo fissato dal kernel all’avvio. A differenza degli interrupt, le chiamate di sistema fanno a meno della IDT ed entrano tutte dallo stesso punto. Il processore annota in RCX l’indirizzo dell’istruzione che segue SYSCALL, e in R11 i flag.',
      'Da quell’ingresso comune il kernel deve raggiungere il servizio richiesto. Usa il numero che il programma ha messo in RAX come indice in una tabella, la [[tabella delle chiamate di sistema]]: la voce 0 porta a read, la voce 1 a write, la voce 60 a exit. Questa scelta si chiama [[smistamento]].',
      { fig: 'scena', w: 720, h: 206, titolo: 'Una richiesta con RAX = 0 e RDI = 3', nota: 'Il numero 0 sceglie read. Soltanto a quel punto il 3 in RDI diventa un descrittore di file.', els: SL.unita421.quadro('g', { s: 'read', a: 3 }, 4, { x: 10, y: 8, w1: 210, w2: 240, gap: 20, h: 54, hc: 36 }) },
      'Soltanto dopo lo smistamento gli altri registri acquistano un significato. RDI contiene sempre il primo argomento, e che cosa rappresenti lo decide il servizio. Per read e write è un descrittore di file. Per exit è il codice di uscita, il numero che il programma lascia a chi lo ha avviato. Lo stesso 3 in RDI può voler dire «il file aperto numero 3» oppure «ho terminato con il codice 3».',
      'Un numero che cade fuori dalla tabella non porta ad alcun servizio. Il kernel risponde con un errore, e il programma prosegue.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma prepara i registri ed esegue SYSCALL all’indirizzo 0x4010. Sceglierai il servizio richiesto e il valore del primo argomento.',
      'Seguiremo la richiesta dentro il kernel: l’ingresso, lo smistamento, il significato dato a RDI e l’effetto. Dopo il caso proposto, lascia lo stesso valore in RDI e cambia soltanto il servizio.'
    ],
    vedrai: [
      ['register', 'I registri', 'A sinistra: il numero del servizio, il primo argomento e l’indirizzo di ripresa.'],
      ['tabella', 'La tabella', 'Al centro: tre voci della tabella delle chiamate di sistema.'],
      ['gate', 'Il servizio', 'A destra: il servizio scelto, il significato di RDI e l’effetto.']
    ]
  },
  lab: {
    titolo: 'Dai registri al servizio',
    scena: { w: 860, h: 236 },
    atti: ['La richiesta', 'L’ingresso', 'Lo smistamento', 'Il servizio'],
    controlli: [
      { id: 's', tipo: 'scelta', eti: 'Servizio', opzioni: [['read', 'read'], ['write', 'write'], ['exit', 'exit']], valore: 'read' },
      { id: 'a', tipo: 'scelta', eti: 'Valore in RDI', opzioni: [[0, '0'], [3, '3'], [7, '7']], valore: 3 }
    ],
    nota: 'I passi sono sempre cinque. Per read e write il programma prepara anche RSI, con l’indirizzo del buffer, e RDX = 8.',
    previsione: {
      domanda: (p) => 'Il programma mette ' + SL.unita421.S[p.s].n + ' in RAX e ' + p.a + ' in RDI, poi esegue SYSCALL. Come interpreta il kernel il valore ' + p.a + '?',
      opzioni: () => [['r', 'Come il descrittore da cui leggere'], ['w', 'Come il descrittore su cui scrivere'], ['x', 'Come il codice di uscita del programma']]
    },
    confronto: (pred, esito, p) => { const N = { r: 'il descrittore da cui leggere', w: 'il descrittore su cui scrivere', x: 'il codice di uscita' }; return 'La previsione indicava ' + N[pred] + '. Per il kernel è ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il significato di RDI dipende dal servizio, e RAX = ' + SL.unita421.S[p.s].n + ' sceglie ' + p.s + '.'); },
    costruisci(p) {
      const U = SL.unita421, passi = [], s = U.S[p.s];
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'REGISTRI', 'mono'), SL.el.nota('t1', 290, 0, 'TABELLA DELLE CHIAMATE', 'mono'), SL.el.nota('t2', 590, 0, 'SERVIZIO', 'mono')].concat(U.quadro('q', p, f, { x: 20, y: 24, w1: 250, w2: 280, gap: 20, h: 58, hc: 38 }));
      const hud = (f) => [['RAX', String(s.n), 'a'], ['Servizio', f >= 2 ? p.s : '·'], ['RDI è un', f >= 3 ? (p.s === 'exit' ? 'codice' : 'descrittore') : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La richiesta', 'Il programma mette in RAX il numero ' + s.n + ' e in RDI il valore ' + p.a + '.' + (p.s === 'exit' ? '' : ' In RSI c’è l’indirizzo di un buffer, e in RDX il numero 8.') + ' Poi esegue SYSCALL, che comincia all’indirizzo 0x4010 e occupa 2 byte.',
        { chiedi: { d: 'Il kernel riceve soltanto numeri nei registri. Quale registro gli dice quale servizio è richiesto?', o: ['RAX', 'RDI', 'RCX'], g: 0, no: 'Il numero del servizio viaggia in RAX. RDI contiene il primo argomento, RCX servirà per il ritorno.' } });
      P(1, 1, 'L’ingresso', 'SYSCALL porta il processore al livello 0 e salva in RCX l’indirizzo di ripresa, 0x4012. L’esecuzione prosegue dall’unico punto di ingresso che il kernel ha fissato per le chiamate di sistema. Qualunque servizio venga chiesto, si entra da lì.', { calc: 'RCX = 0x4010 + 2 = 0x4012' });
      P(2, 2, 'Lo smistamento', 'Il kernel usa RAX come indice nella tabella delle chiamate di sistema. La voce ' + s.n + ' contiene l’indirizzo della routine che realizza ' + p.s + '.', { calc: 'voce ' + s.n + ' → ' + p.s });
      P(3, 3, 'Il significato di RDI', p.s === 'exit' ? 'La routine di exit legge RDI e lo interpreta come codice di uscita: il programma dichiara di avere terminato con il codice ' + p.a + '.' : 'La routine di ' + p.s + ' legge RDI e lo interpreta come descrittore di file: il programma indica il proprio canale aperto numero ' + p.a + (p.s === 'read' ? ', da cui vuole leggere.' : ', su cui vuole scrivere.'), { calc: 'RDI = ' + p.a + ': ' + s.ruolo, esito: [s.ruolo, 'si'] });
      P(4, 3, 'L’effetto', p.s === 'read' ? 'Il servizio legge dal descrittore ' + p.a + ' fino a 8 byte e li copia nel buffer indicato da RSI. Poi mette in RAX il numero di byte letti e restituisce il controllo: il programma riprende da 0x4012.' : p.s === 'write' ? 'Il servizio prende fino a 8 byte dal buffer indicato da RSI e li scrive sul descrittore ' + p.a + '. Poi mette in RAX il numero di byte scritti e restituisce il controllo: il programma riprende da 0x4012.' : 'Il servizio termina il programma e ne conserva il codice di uscita ' + p.a + '. L’indirizzo 0x4012 salvato in RCX resta inutilizzato, perché da exit non si torna.', { calc: s.effetto, esito: [s.ruolo, 'si'] });
      return { passi, esito: s.come };
    }
  },
  bilancio: {
    regola: [
      'Tutte le chiamate di sistema entrano nel kernel dallo stesso punto. Il numero in RAX fa da indice nella tabella delle chiamate di sistema, e sceglie il servizio.',
      'Gli argomenti acquistano significato soltanto dopo lo smistamento: lo stesso valore in RDI è un descrittore per read e write, un codice di uscita per exit.'
    ],
    errori: [
      ['Attribuire a RDI un significato fisso.', 'RDI è il primo argomento. Che cosa rappresenti dipende dal servizio scelto da RAX.'],
      ['Cercare le chiamate di sistema nella IDT.', 'SYSCALL ha un ingresso proprio, unico. La scelta del servizio avviene dopo, nella tabella delle chiamate.'],
      ['Aspettarsi un ritorno da exit.', 'RCX riceve comunque l’indirizzo di ripresa, che resta inutilizzato: il programma termina.']
    ],
    saFare: ['Descrivere lo smistamento di una chiamata di sistema.', 'Indicare quale servizio corrisponde a RAX = 0, 1 e 60.', 'Interpretare RDI secondo il servizio richiesto.'],
    esercizi: [
      { d: 'Un programma esegue SYSCALL con RAX = 60 e RDI = 2. Che cosa chiede al kernel?', guida: 'Si scelga la risposta.', o: [
        { t: 'Di terminare con il codice di uscita 2', ok: true, fb: 'Il numero 60 sceglie exit, per cui RDI è il codice di uscita.' },
        { t: 'Di scrivere sul descrittore 2', fb: 'Per scrivere servirebbe RAX = 1. Con RAX = 60 il servizio è exit.' },
        { t: 'Di leggere 60 byte dal descrittore 2', fb: 'RAX contiene il numero del servizio. La quantità di byte viaggerebbe in RDX.' }] },
      { d: 'Una SYSCALL comincia all’indirizzo 0x40A6. Quale valore riceve RCX? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['40a8', '0x40a8', '40a8h'],
        ok: 'SYSCALL occupa 2 byte: 0x40A6 + 2 = 0x40A8.',
        diagnosi: [
          { se: ['40a6', '0x40a6', '40a6h'], msg: 'Questo è l’indirizzo della SYSCALL stessa. RCX riceve quello dell’istruzione seguente.' },
          { se: ['40aa', '0x40aa', '40aah'], msg: 'SYSCALL occupa 2 byte.' }
        ],
        altro: 'Il valore è diverso. RCX riceve l’indirizzo dell’istruzione che segue SYSCALL, lunga 2 byte.',
        indizi: ['RCX riceve l’indirizzo di ripresa.', 'SYSCALL occupa 2 byte.', '0x40A6 + 2.'],
        svolgimento: ['Indirizzo di SYSCALL: 0x40A6.', 'Lunghezza: 2 byte.', 'RCX = 0x40A8.'] },
      { d: 'Due programmi eseguono SYSCALL, il primo con RAX = 0 e il secondo con RAX = 1. Da quale indirizzo del kernel comincia l’esecuzione nei due casi?', guida: 'Si scelga la risposta.', o: [
        { t: 'Dallo stesso indirizzo', ok: true, fb: 'L’ingresso è unico. I due percorsi si separano dopo, allo smistamento.' },
        { t: 'Da due indirizzi diversi, scelti da RAX', fb: 'RAX viene usato dal kernel, come indice nella tabella. Il processore entra sempre dallo stesso punto.' },
        { t: 'Dall’indirizzo contenuto in RCX', fb: 'RCX riceve l’indirizzo di ripresa nel programma, che servirà al ritorno.' }] }
    ],
    sfida: ['cslez4_2_01_syscalls_01', 'Numeri, argomenti e registri delle syscall']
  }
});
