'use strict';
SL.unita413 = (() => {
  const H = SL.kern.H, BASE = 0x4000;
  const voce = (v) => BASE + 16 * v, gestore = (v) => 0x8000 + 32 * v;
  const ammesso = (p) => p.via === 'hw' || p.dpl === 3;
  // fase: 0 la richiesta · 1 l'indice · 2 la voce · 3 il controllo · 4 l'esito
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], ok = ammesso(p), sw = p.via === 'int', x2 = o.x + o.w1 + o.gap, x3 = x2 + o.w2 + o.gap, py = o.h + 16;
    els.push(el.box(pre + 'r', o.x, o.y, o.w1, o.h, 'richiesta', sw ? 'int ' + p.v : 'una periferica', f === 0 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'c', o.x, o.y + py, o.w1, o.h, 'livello corrente', 'CPL = 3', f === 3 && sw ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'v', o.x, o.y + 2 * py, o.w1, o.h, 'vettore', String(p.v), f === 1 ? 'att' : 'on', { cls: 'stretta' }));
    [-1, 0, 1].forEach((d, k) => els.push(el.cella(pre + 't' + k, x2, o.y + k * (o.hc + 8), o.w2, o.hc, 'voce ' + (p.v + d) + ' · ' + H(voce(p.v + d)), d === 0 && f >= 1 ? (f <= 2 ? 'att' : 'on') : d === 0 ? '' : 'off', { piccola: true, cls: 'minuta' })));
    els.push(el.box(pre + 'd', x2, o.y + 2 * py, o.w2, o.h, 'contenuto della voce ' + p.v, f >= 2 ? 'gestore ' + H(gestore(p.v)) + ' · DPL ' + p.dpl : '·', f === 2 ? 'att' : f > 2 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'k', x3, o.y, o.w1, o.h, 'controllo dei privilegi', f >= 3 ? (sw ? 'CPL ≤ DPL: ' + (ok ? 'vero' : 'falso') : 'non richiesto') : '·', f === 3 ? (ok ? 'att' : 'err') : f > 3 ? (ok ? 'on' : 'err') : '', { cls: 'stretta' }),
      el.box(pre + 'e', x3, o.y + py, o.w1, o.h, 'esito', f >= 4 ? (ok ? 'ingresso al gestore' : 'eccezione #GP') : '·', f >= 4 ? (ok ? 'att' : 'err') : '', { cls: 'stretta' }),
      el.box(pre + 'p', x3, o.y + 2 * py, o.w1, o.h, 'prossima istruzione', f >= 4 ? (ok ? 'RIP = ' + H(gestore(p.v)) : 'gestore di #GP') : '·', f >= 4 ? (ok ? 'on' : 'err') : '', { cls: 'stretta' }));
    els.push(el.linea(pre + 'l1', o.x + o.w1, o.y + 2 * py + o.h / 2, x2, o.y + o.hc + 8 + o.hc / 2, f === 1 ? 'att' : ''), el.linea(pre + 'l2', x2 + o.w2, o.y + 2 * py + o.h / 2, x3, o.y + o.h / 2, f === 3 ? 'att' : ''));
    return els;
  };
  return { H, BASE, voce, gestore, ammesso, quadro };
})();
SL.registra('4.1.3', {
  titolo: 'Vettori, privilegi e ingresso protetto',
  obiettivo: 'Obiettivo: trovare nella IDT la voce di un vettore, e dire se una richiesta arrivata da un programma oppure da una periferica può raggiungere il gestore.',
  concetti: [['tabella', 'Un numero sceglie il gestore'], ['privilegi', 'Chi può chiedere che cosa'], ['scudo', 'Il rifiuto del processore']],
  filigrana: ['tabella', 'privilegi', 'scudo'],
  richiami: {
    carte: [
      { sim: 'gate', da: 'Dall’unità 4.1.1', t: 'Il gestore', d: 'La routine del kernel che serve un evento.' },
      { sim: 'privilegi', da: 'Dall’unità 2.5.1', t: 'Due modi di funzionamento', d: 'Nel modo utente le operazioni sui dispositivi sono vietate. Nel modo privilegiato gira soltanto il kernel.' },
      { sim: 'hex', da: 'Dall’unità 1.2.4', t: 'L’esadecimale', d: 'Sedici si scrive 0x10. Moltiplicare per sedici aggiunge uno zero in fondo.' }
    ],
    domanda: { d: 'Prima di proseguire: quanto vale 16 × 3, scritto in esadecimale?', o: [
      { t: '0x30', ok: true, fb: 'Moltiplicare per sedici sposta le cifre esadecimali di un posto: 3 diventa 0x30, cioè 48.' },
      { t: '0x48', fb: 'Quarantotto è il valore in base dieci. In base sedici si scrive 0x30.' },
      { t: '0x13', fb: '0x13 vale 16 + 3 = 19. Il prodotto è 48, cioè 0x30.' }
    ] }
  },
  idea: {
    titolo: 'Una tabella di ingressi sorvegliati',
    termini: ['vettore di interruzione', 'idt', 'livello di privilegio', 'dpl', 'protezione generale'],
    testo: [
      'Gli eventi sono molti, e ciascuno ha il proprio gestore. Per trovare quello giusto il processore usa un numero da 0 a 255, il [[vettore di interruzione|vettore]]. La divisione per zero ha il vettore 0, il breakpoint il 3, la pagina assente il 14. I vettori da 0 a 31 sono riservati alle eccezioni. Quelli da 32 in su vengono assegnati alle periferiche e ai servizi del kernel.',
      'Il vettore è un indice in una tabella che il kernel prepara all’avvio, la [[idt|IDT]]. Ogni voce occupa 16 byte e contiene, fra l’altro, l’indirizzo di un gestore. Un registro del processore conserva l’indirizzo a cui la tabella comincia. La voce del vettore v si trova quindi 16 × v byte dopo l’inizio.',
      { fig: 'scena', w: 720, h: 226, titolo: 'Una periferica chiede attenzione sul vettore 48', nota: 'La voce 48 si trova 16 × 48 = 768 byte dopo l’inizio della tabella, cioè a 0x4300.', els: SL.unita413.quadro('g', { v: 48, via: 'hw', dpl: 0 }, 4, { x: 10, y: 8, w1: 190, w2: 280, gap: 20, h: 56, hc: 40 }) },
      'Resta da stabilire chi può usare una voce. Il processore distingue quattro [[livello di privilegio|livelli di privilegio]], numerati in senso contrario all’intuizione: il livello 0 è quello del kernel, il livello 3 quello dei programmi ordinari. Il livello del codice in esecuzione si abbrevia CPL.',
      'Un programma può chiedere un ingresso con l’istruzione `int n`, dove n è il vettore. Ogni voce della IDT porta un numero, il [[dpl|DPL]], che dice fino a quale livello l’istruzione è permessa: serve CPL ≤ DPL. Una voce con DPL 0 è riservata al kernel. Se un programma di livello 3 prova a usarla, il processore rifiuta e solleva l’eccezione di [[protezione generale]], abbreviata #GP. Il kernel mette DPL 3 soltanto sulle poche voci che vuole offrire ai programmi.',
      'Il controllo riguarda soltanto le richieste fatte con `int`. Quando l’evento è una eccezione vera oppure la richiesta di una periferica, il processore entra nel gestore qualunque sia il DPL. In questo modo un programma non può chiamare a piacere i gestori del kernel, fingendo per esempio un guasto del disco, mentre gli eventi veri arrivano sempre a destinazione.'
    ]
  },
  esperimento: {
    faremo: [
      'Mentre gira un programma di livello 3 arriverà una richiesta di ingresso nel kernel. Sceglierai il vettore, l’origine della richiesta e il DPL scritto nella voce.',
      'Troveremo la voce nella IDT, ne leggeremo il contenuto e applicheremo il controllo dei privilegi. Dopo il caso proposto, lascia tutto com’è e cambia soltanto l’origine.'
    ],
    vedrai: [
      ['interrupt', 'La richiesta', 'A sinistra: chi chiede l’ingresso, con quale livello e con quale vettore.'],
      ['tabella', 'La IDT', 'Al centro: tre voci consecutive della tabella e il contenuto di quella scelta.'],
      ['scudo', 'Il controllo', 'A destra: il confronto dei privilegi e l’esito.']
    ]
  },
  lab: {
    titolo: 'Una richiesta davanti alla IDT',
    scena: { w: 860, h: 256 },
    atti: ['La richiesta', 'La voce', 'Il controllo', 'L’esito'],
    controlli: [
      { id: 'via', tipo: 'scelta', eti: 'Origine', opzioni: [['int', 'istruzione int del programma'], ['hw', 'richiesta di una periferica']], valore: 'int' },
      { id: 'v', tipo: 'scelta', eti: 'Vettore', opzioni: [[33, '33'], [48, '48'], [128, '128']], valore: 48 },
      { id: 'dpl', tipo: 'scelta', eti: 'DPL della voce', opzioni: [[0, '0'], [3, '3']], valore: 0 }
    ],
    nota: 'I passi sono sempre sei. La IDT del modello comincia a 0x4000, e il programma in esecuzione ha CPL 3.',
    previsione: {
      domanda: (p) => 'Gira un programma di livello 3. ' + (p.via === 'int' ? 'Il programma esegue `int ' + p.v + '`.' : 'Una periferica chiede attenzione sul vettore ' + p.v + '.') + ' La voce ' + p.v + ' della IDT ha DPL ' + p.dpl + '. Che cosa fa il processore?',
      opzioni: () => [['ok', 'Entra nel gestore indicato dalla voce'], ['gp', 'Rifiuta, e solleva #GP']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + (pred === 'ok' ? 'l’ingresso nel gestore' : 'il rifiuto con #GP') + '. Il processore ' + (esito === 'ok' ? 'entra nel gestore' : 'solleva #GP') + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.via === 'hw' ? 'Il DPL limita soltanto l’istruzione `int`. La richiesta di una periferica entra comunque.' : p.dpl === 3 ? 'Con DPL 3 la voce è offerta anche ai programmi di livello 3.' : 'Serve CPL ≤ DPL, e 3 ≤ 0 è falso.'),
    costruisci(p) {
      const U = SL.unita413, H = U.H, passi = [], sw = p.via === 'int', ok = U.ammesso(p), a = U.voce(p.v), g = U.gestore(p.v);
      const quadro = (f) => [SL.el.nota('t0', 290, 0, 'IDT · INIZIO ' + H(U.BASE), 'mono')].concat(U.quadro('q', p, f, { x: 20, y: 24, w1: 240, w2: 300, gap: 20, h: 62, hc: 44 }));
      const hud = (f) => [['Vettore', String(p.v), 'a'], ['Indirizzo della voce', f >= 1 ? H(a) : '·'], ['Esito', f >= 4 ? (ok ? 'gestore' : '#GP') : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La richiesta', (sw ? 'Il programma, che gira al livello 3, esegue `int ' + p.v + '`: chiede di entrare nel kernel attraverso il vettore ' + p.v + '.' : 'Mentre gira un programma di livello 3, una periferica chiede attenzione. Il circuito che raccoglie le richieste comunica al processore il vettore ' + p.v + '.') + ' Il processore deve trovare il gestore associato a quel numero.',
        { chiedi: { d: 'Ogni voce della IDT occupa 16 byte. Quanti byte separano la voce ' + p.v + ' dall’inizio della tabella?', o: [String(p.v), String(8 * p.v), String(16 * p.v)], g: 2, no: 'Prima della voce ' + p.v + ' ci sono ' + p.v + ' voci da 16 byte: ' + p.v + ' × 16 = ' + (16 * p.v) + '.' } });
      P(1, 1, 'L’indice nella tabella', 'La tabella comincia a ' + H(U.BASE) + '. La voce ' + p.v + ' si trova ' + p.v + ' × 16 = ' + (16 * p.v) + ' byte più avanti. In esadecimale ' + (16 * p.v) + ' si scrive ' + H(16 * p.v) + ', e l’indirizzo della voce è ' + H(a) + '.', { calc: H(U.BASE) + ' + ' + H(16 * p.v) + ' = ' + H(a) });
      P(2, 1, 'Il contenuto della voce', 'Il processore legge i 16 byte che cominciano a ' + H(a) + '. Vi trova l’indirizzo del gestore, ' + H(g) + ', e il DPL, che vale ' + p.dpl + '.', { calc: 'gestore ' + H(g) + ' · DPL ' + p.dpl });
      P(3, 2, 'Il controllo dei privilegi', sw ? 'La richiesta viene da una istruzione `int`, e va controllata. Il livello corrente è CPL = 3, il DPL della voce è ' + p.dpl + '. La condizione CPL ≤ DPL diventa 3 ≤ ' + p.dpl + ', che è ' + (ok ? 'vera.' : 'falsa.') : 'La richiesta viene da una periferica. Il DPL limita soltanto l’istruzione `int`, e qui nessun controllo è richiesto: un evento vero deve sempre poter raggiungere il proprio gestore.', { calc: sw ? '3 ≤ ' + p.dpl + ': ' + (ok ? 'vero' : 'falso') : 'controllo non richiesto' });
      P(4, 3, ok ? 'L’ingresso' : 'Il rifiuto', ok ? 'Il processore passa al livello 0 e mette in RIP l’indirizzo letto nella voce. La prossima istruzione eseguita è la prima del gestore, a ' + H(g) + '.' : 'Il processore rifiuta l’ingresso. Al posto del gestore richiesto parte quello dell’eccezione di protezione generale, #GP, che di solito termina il programma. Il gestore a ' + H(g) + ' resta irraggiungibile.', { calc: ok ? 'RIP = ' + H(g) : '#GP', esito: [ok ? 'ingresso al gestore' : 'eccezione #GP', ok ? 'si' : 'no'] });
      P(4, 3, 'A che cosa serve il DPL', sw ? (ok ? 'Il kernel ha messo DPL 3 su questa voce perché vuole offrirla ai programmi. È una scelta rara, riservata a pochi ingressi studiati per essere chiamati da chiunque.' : 'Il kernel ha messo DPL 0 su questa voce perché il suo gestore serve un evento che i programmi non devono poter simulare. Senza il controllo un programma potrebbe chiamarlo quando vuole.') : 'Se lo stesso vettore fosse stato chiesto con `int ' + p.v + '` da questo programma, con DPL ' + p.dpl + ' il processore avrebbe ' + (p.dpl === 3 ? 'accettato.' : 'rifiutato.') + ' La periferica entra in ogni caso, perché il suo evento è reale.', { calc: 'DPL: limite per l’istruzione int', esito: [ok ? 'ingresso al gestore' : 'eccezione #GP', ok ? 'si' : 'no'] });
      return { passi, esito: ok ? 'ok' : 'gp' };
    }
  },
  bilancio: {
    regola: [
      'Il vettore sceglie una voce della IDT. La voce del vettore v si trova 16 × v byte dopo l’inizio della tabella, e contiene l’indirizzo del gestore.',
      'L’istruzione `int n` può usare una voce soltanto se CPL ≤ DPL, altrimenti il processore solleva #GP. Le eccezioni vere e le richieste delle periferiche entrano qualunque sia il DPL.'
    ],
    errori: [
      ['Usare il vettore come indirizzo.', 'Il vettore è un indice. L’indirizzo della voce si ottiene moltiplicandolo per 16 e aggiungendo l’inizio della tabella.'],
      ['Leggere i livelli di privilegio al contrario.', 'Al livello 0 tutto è permesso, al livello 3 quasi nulla. La condizione CPL ≤ DPL chiede un livello numericamente basso.'],
      ['Applicare il DPL alle periferiche.', 'Il DPL limita soltanto l’istruzione `int`. Un evento reale raggiunge sempre il proprio gestore.']
    ],
    saFare: ['Calcolare l’indirizzo di una voce della IDT.', 'Applicare la condizione CPL ≤ DPL a una istruzione int.', 'Distinguere una richiesta software da un evento reale.'],
    esercizi: [
      { d: 'Una IDT comincia all’indirizzo 0x4000, con voci da 16 byte. A quale indirizzo si trova la voce del vettore 14? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['40e0', '0x40e0', '40e0h'],
        ok: 'Il vettore 14 dista 14 × 16 = 224 byte, cioè 0xE0: la voce è a 0x40E0.',
        diagnosi: [
          { se: ['400e', '0x400e', '400eh'], msg: 'Il vettore va moltiplicato per 16, la lunghezza di una voce.' },
          { se: ['4070', '0x4070', '4070h'], msg: 'Le voci occupano 16 byte, il doppio di 8.' },
          { se: ['4224', '0x4224', '4224h'], msg: '224 è in base dieci. In esadecimale si scrive 0xE0.' },
          { se: ['4140', '0x4140', '4140h'], msg: 'Moltiplicare per 16 aggiunge uno zero alla scrittura esadecimale del vettore: 14 è 0xE, e diventa 0xE0.' }
        ],
        altro: 'Il valore è diverso. Si moltiplichi il vettore per 16, si scriva il prodotto in esadecimale e lo si sommi a 0x4000.',
        indizi: ['Prima della voce 14 ci sono 14 voci da 16 byte.', '14 × 16 = 224, cioè 0xE0.', '0x4000 + 0xE0.'],
        svolgimento: ['Distanza: 14 × 16 = 224 byte.', '224 = 0xE0.', 'Indirizzo: 0x4000 + 0xE0 = 0x40E0.'] },
      { d: 'Un programma di livello 3 esegue `int 14`. La voce 14, quella della pagina assente, ha DPL 0. Che cosa accade?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il processore solleva #GP', ok: true, fb: 'La condizione 3 ≤ 0 è falsa, e l’ingresso viene rifiutato.' },
        { t: 'Parte il gestore della pagina assente', fb: 'Così accadrebbe per una pagina assente vera. Con `int` il processore controlla il DPL.' },
        { t: 'L’istruzione viene ignorata', fb: 'Il processore segnala il tentativo con una eccezione, che il kernel può punire terminando il programma.' }] },
      { d: 'Mentre gira un programma di livello 3, una periferica chiede attenzione sul vettore 40, la cui voce ha DPL 0. Che cosa accade?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il processore entra nel gestore della voce 40', ok: true, fb: 'Il DPL limita soltanto l’istruzione `int`. La richiesta di una periferica entra comunque.' },
        { t: 'Il processore solleva #GP, perché 3 ≤ 0 è falso', fb: 'Il confronto fra CPL e DPL si applica soltanto alle richieste fatte con `int`.' },
        { t: 'La richiesta attende che il programma termini', fb: 'Il processore accetta la richiesta al confine fra due istruzioni, senza attendere la fine del programma.' }] }
    ],
    sfida: ['cslez4_1_01_exceptions_01', 'Vettori e voci della IDT']
  }
});
