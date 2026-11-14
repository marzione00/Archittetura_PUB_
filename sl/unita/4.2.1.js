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
  obiettivo: 'Obiettivo: indicare il modo in cui il kernel, ricevuta una chiamata di sistema, individua il servizio da eseguire, e la ragione per cui il medesimo valore in RDI può avere significati diversi.',
  concetti: [['gate', 'Un solo ingresso'], ['tabella', 'Il numero individua il servizio'], ['register', 'Il servizio determina il significato degli argomenti']],
  filigrana: ['gate', 'tabella', 'register'],
  richiami: {
    carte: [
      { sim: 'gate', da: 'Dall’unità 2.5.1', t: 'SYSCALL', d: 'Trasferisce il processore nel modo privilegiato, e salva in RCX l’indirizzo di ripresa e in R11 i flag.' },
      { sim: 'tabella', da: 'Dall’unità 2.5.2', t: 'I registri delle chiamate', d: 'Il numero del servizio è trasmesso in RAX. Gli argomenti sono trasmessi in RDI, RSI, RDX, R10, R8 e R9.' },
      { sim: 'tabella', da: 'Dall’unità 4.1.3', t: 'La IDT', d: 'Per gli interrupt e le eccezioni, un vettore individua il gestore in una tabella.' }
    ],
    domanda: { d: 'Prima di proseguire: un’istruzione SYSCALL, lunga 2 byte, ha inizio all’indirizzo 0x4010. Quale valore salva in RCX?', o: [
      { t: '0x4012', ok: true, fb: 'RCX riceve l’indirizzo dell’istruzione che segue SYSCALL, dal quale il programma riprenderà.' },
      { t: '0x4010', fb: 'In tal caso il programma, al ritorno, ripeterebbe indefinitamente la medesima chiamata.' },
      { t: '0x4014', fb: 'SYSCALL occupa 2 byte, e l’istruzione seguente ha inizio a 0x4012.' }
    ] }
  },
  idea: {
    titolo: 'L’interpretazione dei registri da parte del kernel',
    termini: ['tabella delle chiamate di sistema', 'smistamento'],
    testo: [
      'L’unità 2.5.1 ha descritto la chiamata di sistema dal lato del programma: i registri da preparare, l’istruzione SYSCALL, il risultato in RAX. Questa unità la esamina dal lato del kernel, che riceve alcuni valori numerici e deve determinare il servizio richiesto.',
      'SYSCALL porta il processore al livello 0 e lo fa proseguire da un indirizzo fissato dal kernel all’avvio. A differenza degli interrupt, le chiamate di sistema non impiegano la IDT ed entrano tutte dal medesimo punto. Il processore annota in RCX l’indirizzo dell’istruzione che segue SYSCALL, e in R11 i flag.',
      'Da tale ingresso comune il kernel deve raggiungere il servizio richiesto. Esso impiega il numero che il programma ha scritto in RAX come indice in una tabella, la [[tabella delle chiamate di sistema]]: la voce 0 conduce a read, la voce 1 a write, la voce 60 a exit. Tale selezione prende il nome di [[smistamento]].',
      { fig: 'scena', w: 720, h: 206, titolo: 'Una richiesta con RAX = 0 e RDI = 3', nota: 'Il numero 0 individua read. Soltanto a quel punto il 3 in RDI assume il significato di descrittore di file.', els: SL.unita421.quadro('g', { s: 'read', a: 3 }, 4, { x: 10, y: 8, w1: 210, w2: 240, gap: 20, h: 54, hc: 36 }) },
      'Soltanto dopo lo smistamento gli altri registri acquistano un significato. RDI contiene sempre il primo argomento, e ciò che esso rappresenta è stabilito dal servizio. Per read e write è un descrittore di file. Per exit è il codice di uscita, il numero che il programma lascia al processo che lo ha avviato. Il medesimo 3 in RDI può indicare il file aperto numero 3 oppure la terminazione con il codice 3.',
      'Un numero esterno alla tabella non conduce ad alcun servizio. Il kernel risponde con un errore, e il programma prosegue.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma prepara i registri ed esegue SYSCALL all’indirizzo 0x4010. I controlli fissano il servizio richiesto e il valore del primo argomento.',
      'La richiesta è seguita all’interno del kernel: l’ingresso, lo smistamento, il significato attribuito a RDI e l’effetto. Dopo il caso proposto, è istruttivo lasciare invariato il valore in RDI e modificare soltanto il servizio.'
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
      domanda: (p) => 'Il programma scrive ' + SL.unita421.S[p.s].n + ' in RAX e ' + p.a + ' in RDI, poi esegue SYSCALL. Come interpreta il kernel il valore ' + p.a + '?',
      opzioni: () => [['r', 'Come il descrittore dal quale leggere'], ['w', 'Come il descrittore sul quale scrivere'], ['x', 'Come il codice di uscita del programma']]
    },
    confronto: (pred, esito, p) => { const N = { r: 'il descrittore dal quale leggere', w: 'il descrittore sul quale scrivere', x: 'il codice di uscita' }; return 'La previsione indicava ' + N[pred] + '. Per il kernel è ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il significato di RDI dipende dal servizio, e RAX = ' + SL.unita421.S[p.s].n + ' sceglie ' + p.s + '.'); },
    costruisci(p) {
      const U = SL.unita421, passi = [], s = U.S[p.s];
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'REGISTRI', 'mono'), SL.el.nota('t1', 290, 0, 'TABELLA DELLE CHIAMATE', 'mono'), SL.el.nota('t2', 590, 0, 'SERVIZIO', 'mono')].concat(U.quadro('q', p, f, { x: 20, y: 24, w1: 250, w2: 280, gap: 20, h: 58, hc: 38 }));
      const hud = (f) => [['RAX', String(s.n), 'a'], ['Servizio', f >= 2 ? p.s : '·'], ['RDI è un', f >= 3 ? (p.s === 'exit' ? 'codice' : 'descrittore') : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La richiesta', 'Il programma scrive in RAX il numero ' + s.n + ' e in RDI il valore ' + p.a + '.' + (p.s === 'exit' ? '' : ' RSI contiene l’indirizzo di un buffer, e RDX il numero 8.') + ' Esegue poi SYSCALL, che ha inizio all’indirizzo 0x4010 e occupa 2 byte.',
        { chiedi: { d: 'Il kernel riceve soltanto valori numerici nei registri. Quale registro indica il servizio richiesto?', o: ['RAX', 'RDI', 'RCX'], g: 0, no: 'Il numero del servizio è trasmesso in RAX. RDI contiene il primo argomento, RCX è impiegato per il ritorno.' } });
      P(1, 1, 'L’ingresso', 'SYSCALL porta il processore al livello 0 e salva in RCX l’indirizzo di ripresa, 0x4012. L’esecuzione prosegue dall’unico punto di ingresso fissato dal kernel per le chiamate di sistema, qualunque sia il servizio richiesto.', { calc: 'RCX = 0x4010 + 2 = 0x4012' });
      P(2, 2, 'Lo smistamento', 'Il kernel impiega RAX come indice nella tabella delle chiamate di sistema. La voce ' + s.n + ' contiene l’indirizzo della routine che realizza ' + p.s + '.', { calc: 'voce ' + s.n + ' → ' + p.s });
      P(3, 3, 'Il significato di RDI', p.s === 'exit' ? 'La routine di exit legge RDI e lo interpreta come codice di uscita: il programma dichiara di essere terminato con il codice ' + p.a + '.' : 'La routine di ' + p.s + ' legge RDI e lo interpreta come descrittore di file: il programma indica il proprio canale aperto numero ' + p.a + (p.s === 'read' ? ', dal quale intende leggere.' : ', sul quale intende scrivere.'), { calc: 'RDI = ' + p.a + ': ' + s.ruolo, esito: [s.ruolo, 'si'] });
      P(4, 3, 'L’effetto', p.s === 'read' ? 'Il servizio legge dal descrittore ' + p.a + ' fino a 8 byte e li copia nel buffer indicato da RSI. Scrive poi in RAX il numero di byte letti e restituisce il controllo: il programma riprende da 0x4012.' : p.s === 'write' ? 'Il servizio preleva fino a 8 byte dal buffer indicato da RSI e li scrive sul descrittore ' + p.a + '. Scrive poi in RAX il numero di byte scritti e restituisce il controllo: il programma riprende da 0x4012.' : 'Il servizio termina il programma e ne conserva il codice di uscita ' + p.a + '. L’indirizzo 0x4012 salvato in RCX resta inutilizzato, poiché exit non prevede ritorno.', { calc: s.effetto, esito: [s.ruolo, 'si'] });
      return { passi, esito: s.come };
    }
  },
  bilancio: {
    regola: [
      'Tutte le chiamate di sistema entrano nel kernel dal medesimo punto. Il numero in RAX è l’indice nella tabella delle chiamate di sistema, e individua il servizio.',
      'Gli argomenti acquistano significato soltanto dopo lo smistamento: il medesimo valore in RDI è un descrittore per read e write, un codice di uscita per exit.'
    ],
    errori: [
      ['Attribuire a RDI un significato fisso.', 'RDI è il primo argomento. Ciò che esso rappresenta dipende dal servizio individuato da RAX.'],
      ['Cercare le chiamate di sistema nella IDT.', 'SYSCALL ha un ingresso proprio, unico. La selezione del servizio avviene in seguito, nella tabella delle chiamate.'],
      ['Attendersi un ritorno da exit.', 'RCX riceve comunque l’indirizzo di ripresa, che resta inutilizzato: il programma termina.']
    ],
    saFare: ['Descrivere lo smistamento di una chiamata di sistema.', 'Indicare il servizio che corrisponde a RAX = 0, 1 e 60.', 'Interpretare RDI secondo il servizio richiesto.'],
    esercizi: [
      { d: 'Un programma esegue SYSCALL con RAX = 60 e RDI = 2. Quale richiesta rivolge al kernel?', guida: 'Si scelga la risposta.', o: [
        { t: 'La terminazione con il codice di uscita 2', ok: true, fb: 'Il numero 60 individua exit, per la quale RDI è il codice di uscita.' },
        { t: 'La scrittura sul descrittore 2', fb: 'Per la scrittura occorrerebbe RAX = 1. Con RAX = 60 il servizio è exit.' },
        { t: 'La lettura di 60 byte dal descrittore 2', fb: 'RAX contiene il numero del servizio. La quantità di byte sarebbe trasmessa in RDX.' }] },
      { d: 'Una SYSCALL ha inizio all’indirizzo 0x40A6. Quale valore riceve RCX? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['40a8', '0x40a8', '40a8h'],
        ok: 'SYSCALL occupa 2 byte: 0x40A6 + 2 = 0x40A8.',
        diagnosi: [
          { se: ['40a6', '0x40a6', '40a6h'], msg: 'Questo è l’indirizzo della SYSCALL stessa. RCX riceve quello dell’istruzione seguente.' },
          { se: ['40aa', '0x40aa', '40aah'], msg: 'SYSCALL occupa 2 byte.' }
        ],
        altro: 'Il valore è diverso. RCX riceve l’indirizzo dell’istruzione che segue SYSCALL, lunga 2 byte.',
        indizi: ['RCX riceve l’indirizzo di ripresa.', 'SYSCALL occupa 2 byte.', '0x40A6 + 2.'],
        svolgimento: ['Indirizzo di SYSCALL: 0x40A6.', 'Lunghezza: 2 byte.', 'RCX = 0x40A8.'] },
      { d: 'Due programmi eseguono SYSCALL, il primo con RAX = 0 e il secondo con RAX = 1. Da quale indirizzo del kernel ha inizio l’esecuzione nei due casi?', guida: 'Si scelga la risposta.', o: [
        { t: 'Dal medesimo indirizzo', ok: true, fb: 'L’ingresso è unico. I due percorsi si separano in seguito, allo smistamento.' },
        { t: 'Da due indirizzi diversi, determinati da RAX', fb: 'RAX è impiegato dal kernel, come indice nella tabella. Il processore entra sempre dal medesimo punto.' },
        { t: 'Dall’indirizzo contenuto in RCX', fb: 'RCX riceve l’indirizzo di ripresa nel programma, impiegato al ritorno.' }] }
    ],
    sfida: ['cslez4_2_01_syscalls_01', 'Numeri, argomenti e registri delle syscall']
  }
});
