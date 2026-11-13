'use strict';
SL.registra('2.1.3', {
  titolo: 'Lettura di brevi sequenze di istruzioni',
  obiettivo: 'Alla fine saprai leggere una sequenza di MOV e ADD compilando una traccia, cioè annotando il contenuto dei registri dopo ogni istruzione.',
  concetti: [['tabella', 'Traccia'], ['puntatore', 'Destinazione e sorgente'], ['register', 'Copie indipendenti']],
  filigrana: ['tabella', 'register', 'alu'],
  richiami: {
    carte: [
      { sim: 'operation', da: 'Dall’unità 2.1.1', t: 'MOV e ADD', d: 'MOV copia un valore nella destinazione. ADD somma un valore alla destinazione e scrive lì il risultato.' },
      { sim: 'register', da: 'Dall’unità 2.1.1', t: 'Lo stato cambia a piccoli passi', d: 'Ogni istruzione modifica una piccola parte dello stato e lascia intatto tutto il resto.' },
      { sim: 'strati', da: 'Dall’unità 2.1.2', t: 'Le viste da 32 bit', d: 'EAX ed ECX sono le metà basse di RAX e di RCX. Una scrittura in una vista da 32 bit azzera la metà alta.' }
    ],
    domanda: { d: 'Prima di proseguire: EAX contiene 9. Il processore esegue una MOV che copia EAX in ECX. Quanto vale EAX subito dopo?', o: [
      { t: '9', ok: true, fb: 'MOV copia. La sorgente viene letta e conserva il proprio contenuto.' },
      { t: '0', fb: 'MOV lascia la sorgente com’era. Il nome fa pensare a uno spostamento, ma l’operazione è una copia.' },
      { t: 'Un valore imprevedibile', fb: 'La sorgente viene soltanto letta, quindi resta 9.' }
    ] }
  },
  idea: {
    titolo: 'Leggere un programma una riga alla volta',
    termini: ['sintassi intel', 'traccia di esecuzione'],
    testo: [
      'Un programma in assembly è un elenco di istruzioni eseguite dall’alto verso il basso. Per capirlo conviene fare quello che fa il processore: partire dallo stato iniziale e applicare un’istruzione alla volta, annotando che cosa cambia.',
      'Prima serve una regola di lettura. Le istruzioni x86-64 si possono scrivere in due modi, e in questo corso useremo la [[sintassi intel|sintassi Intel]]. Dopo il nome dell’istruzione viene la destinazione, poi una virgola, poi la sorgente. L’istruzione `add eax, ecx` si legge quindi così: somma a EAX il contenuto di ECX e scrivi il risultato in EAX. La destinazione ha due compiti, perché fornisce uno degli addendi e riceve il risultato.',
      'Il secondo operando resta com’era. Dopo `add eax, ecx` il registro ECX contiene quello che conteneva prima. Lo stesso vale per `mov ecx, eax`: EAX viene letto, ECX viene scritto, e da quel momento i due registri contengono due copie indipendenti dello stesso numero. Modificarne una lascia intatta l’altra.',
      'Un’istruzione legge tutti i suoi operandi prima di scrivere il risultato. Il caso in cui la precisazione conta è `add eax, eax`: il processore legge due volte il vecchio contenuto di EAX, somma i due valori e soltanto alla fine scrive. Il registro raddoppia.',
      'Lo strumento per orientarsi è la [[traccia di esecuzione]], una tabella con una riga per istruzione e una colonna per ogni registro che interessa. In ogni riga si scrive il contenuto dei registri dopo quell’istruzione. Un registro che l’istruzione non usa come destinazione conserva il valore della riga precedente.',
      { fig: 'scena', w: 620, h: 232, titolo: 'Una traccia di tre istruzioni', nota: 'In ogni riga è accesa la sola casella che l’istruzione ha scritto.', els: [
        SL.el.nota('h1', 300, 0, 'EAX', 'mono'), SL.el.nota('h2', 440, 0, 'ECX', 'mono'),
        SL.el.box('i0', 10, 26, 250, 44, null, 'stato iniziale', '', { cls: 'stretta' }), SL.el.cella('a0', 280, 26, 120, 44, '?', 'off', { piccola: true }), SL.el.cella('c0', 420, 26, 120, 44, '?', 'off', { piccola: true }),
        SL.el.box('i1', 10, 78, 250, 44, null, 'mov eax, 5', '', { cls: 'stretta' }), SL.el.cella('a1', 280, 78, 120, 44, '5', 'att', { piccola: true }), SL.el.cella('c1', 420, 78, 120, 44, '?', 'off', { piccola: true }),
        SL.el.box('i2', 10, 130, 250, 44, null, 'mov ecx, eax', '', { cls: 'stretta' }), SL.el.cella('a2', 280, 130, 120, 44, '5', '', { piccola: true }), SL.el.cella('c2', 420, 130, 120, 44, '5', 'att', { piccola: true }),
        SL.el.box('i3', 10, 182, 250, 44, null, 'add eax, 1', '', { cls: 'stretta' }), SL.el.cella('a3', 280, 182, 120, 44, '6', 'att', { piccola: true }), SL.el.cella('c3', 420, 182, 120, 44, '5', '', { piccola: true })] },
      'Il valore di un registro è quello dell’ultima scrittura che lo ha raggiunto. La regola sembra ovvia, ed è all’origine della maggior parte degli errori di lettura: si attribuisce a un registro il valore che aveva tre righe prima, dimenticando una scrittura avvenuta nel mezzo.',
      'I registri EAX ed ECX di questa unità sono le viste da 32 bit di RAX e di RCX. Per la regola dell’unità precedente ogni loro scrittura azzera la metà alta del registro, quindi nella traccia basta seguire i 32 bit bassi.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processore esegue quattro istruzioni su due registri, EAX ed ECX. Sceglierai il numero di partenza e l’incremento della prima somma.',
      'Compileremo la traccia una riga alla volta. Per ogni istruzione guarderemo prima quali valori legge, poi quale registro scrive. Tieni d’occhio la terza riga, dove un risultato intermedio viene messo da parte. Dopo il caso proposto, cambia l’incremento e prevedi il nuovo risultato.'
    ],
    vedrai: [
      ['tabella', 'Il programma', 'A sinistra: le quattro istruzioni con i loro indirizzi.'],
      ['register', 'La traccia', 'Al centro: una riga per istruzione, con il contenuto di EAX e di ECX dopo averla eseguita.'],
      ['alu', 'Il lavoro in corso', 'A destra: i valori letti dall’istruzione e il calcolo svolto.']
    ]
  },
  lab: {
    titolo: 'Quattro istruzioni, due registri',
    scena: { w: 860, h: 330 },
    atti: ['Lo stato iniziale', 'La prima somma', 'La copia', 'La seconda somma', 'Il risultato'],
    controlli: [
      { id: 'x', tipo: 'num', eti: 'Numero di partenza', min: 0, max: 30, salti: [1, 5], valore: 5 },
      { id: 'd', tipo: 'num', eti: 'Incremento della prima somma', min: 1, max: 9, salti: [1], valore: 3 }
    ],
    previsione: {
      domanda: (p) => 'Il programma è: `mov eax, ' + p.x + '`, `add eax, ' + p.d + '`, `mov ecx, eax`, `add eax, ecx`. Quanto varrà EAX alla fine?',
      opzioni: (p) => Array.from(new Set([2 * (p.x + p.d), p.x + p.d, p.x + 2 * p.d, 2 * p.x + p.d])).sort((a, b) => a - b)
    },
    confronto: (pred, esito, p) => 'Avevi previsto EAX uguale a ' + pred + '. Vale ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'La terza istruzione copia in ECX la prima somma, ' + (p.x + p.d) + '. L’ultima istruzione aggiunge quella copia a EAX, che contiene lo stesso numero: ' + (p.x + p.d) + ' + ' + (p.x + p.d) + ' = ' + esito + '.'),
    costruisci(p) {
      const el = SL.el, passi = [];
      const x = p.x, d = p.d, s1 = x + d, fin = 2 * s1;
      const IST = [['0x401000', 'mov eax, ' + x], ['0x401005', 'add eax, ' + d], ['0x401008', 'mov ecx, eax'], ['0x40100A', 'add eax, ecx']];
      // La traccia: riga 0 è lo stato iniziale, poi una riga per istruzione. null indica un contenuto ignoto.
      const T = [[null, null], [x, null], [s1, null], [s1, s1], [fin, s1]], SCRIVE = [null, 0, 0, 1, 0];
      const Y = (k) => 30 + k * 56, V = (v) => (v == null ? '?' : String(v));
      const quadro = (o) => {
        o = o || {};
        const fatte = o.fatte, els = [el.nota('h0', 40, 0, 'ISTRUZIONE', 'mono'), el.nota('h1', 330, 0, 'EAX DOPO', 'mono'), el.nota('h2', 470, 0, 'ECX DOPO', 'mono')];
        els.push(el.box('i0', 40, Y(0), 260, 48, null, 'stato iniziale', '', { cls: 'stretta' }));
        IST.forEach((r, k) => els.push(el.box('i' + (k + 1), 40, Y(k + 1), 260, 48, r[0], r[1], o.riga === k + 1 ? 'att' : k + 1 <= fatte ? 'on' : '', { cls: 'stretta' })));
        for (let k = 0; k <= 4; k++) for (let c = 0; c < 2; c++) {
          const visibile = k <= fatte, v = T[k][c];
          els.push(el.cella('t' + k + c, 330 + c * 140, Y(k), 120, 48, visibile ? V(v) : '·', !visibile ? 'off' : o.leggi && o.leggi.includes(k + ':' + c) ? 'att' : k === fatte && SCRIVE[k] === c && o.scritta ? 'att' : v == null ? 'off' : 'on', { piccola: true }));
        }
        els.push(el.box('lav', 620, 30, 210, 104, 'valori letti', o.letti || '·', o.letti ? 'on' : '', { sim: 'lente', cls: 'stretta' }));
        els.push(el.box('cal', 620, 148, 210, 104, 'calcolo', o.calcolo || '·', o.calcolo ? 'att' : '', { sim: 'alu', cls: 'stretta' }));
        return els;
      };
      const hud = (k) => [['Istruzioni eseguite', k + ' su 4', 'a'], ['EAX', V(T[k][0])], ['ECX', V(T[k][1]), 'c']];
      const P = (k, o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(k), els: quadro(Object.assign({ fatte: k }, o)) }, extra));

      P(0, {}, 0, 'Lo stato iniziale', 'EAX ed ECX contengono quello che vi hanno lasciato le istruzioni precedenti. Il programma non fa affidamento su quei valori, e nella traccia li segniamo con un punto interrogativo.');
      P(0, { riga: 1, letti: 'immediato ' + x }, 1, 'Prima istruzione: che cosa legge', 'La destinazione è EAX, la sorgente è l’immediato ' + x + '. MOV legge soltanto la sorgente: il vecchio contenuto di EAX viene ignorato.', { calc: 'mov eax, ' + x });
      P(1, { riga: 1, scritta: true, letti: 'immediato ' + x, calcolo: 'EAX ← ' + x }, 1, 'Prima istruzione: che cosa scrive', 'EAX riceve ' + x + '. ECX resta fuori dall’istruzione e conserva il contenuto di prima, ancora ignoto.', { calc: 'EAX = ' + x });
      P(1, { riga: 2, leggi: ['1:0'], letti: 'EAX = ' + x + ' · immediato ' + d }, 1, 'Seconda istruzione: che cosa legge', 'ADD legge entrambi gli operandi: la destinazione EAX, che vale ' + x + ', e l’immediato ' + d + '.', { calc: 'add eax, ' + d });
      P(2, { riga: 2, scritta: true, letti: 'EAX = ' + x + ' · immediato ' + d, calcolo: x + ' + ' + d + ' = ' + s1 }, 1, 'Seconda istruzione: che cosa scrive', 'La somma, ' + s1 + ', viene scritta nella destinazione. Il vecchio contenuto di EAX è perduto: da qui in poi EAX vale ' + s1 + '.',
        { calc: x + ' + ' + d + ' = ' + s1, chiedi: { d: 'La prossima istruzione è `mov ecx, eax`. Dopo averla eseguita, quanto varrà EAX?', o: [String(s1), '0', 'Un valore ignoto'], g: 0, no: 'MOV legge la sorgente e la lascia com’era. EAX conserva ' + s1 + '.' } });
      P(2, { riga: 3, leggi: ['2:0'], letti: 'EAX = ' + s1 }, 2, 'Terza istruzione: che cosa legge', 'Questa volta la destinazione è ECX e la sorgente è EAX. MOV legge EAX, che vale ' + s1 + '.', { calc: 'mov ecx, eax' });
      const opz = Array.from(new Set([s1, fin, 0])).sort((a, b) => a - b).map(String);
      P(3, { riga: 3, scritta: true, letti: 'EAX = ' + s1, calcolo: 'ECX ← ' + s1 }, 2, 'Terza istruzione: che cosa scrive', 'ECX riceve una copia di ' + s1 + '. EAX è stato soltanto letto e conserva il proprio valore. I due registri contengono ora lo stesso numero, in due posti distinti.',
        { calc: 'ECX = ' + s1, chiedi: { d: 'L’ultima istruzione è `add eax, ecx`. Dopo averla eseguita, quanto varrà ECX?', o: opz, g: opz.indexOf(String(s1)), no: 'La destinazione è EAX. ECX è la sorgente: viene letto e resta ' + s1 + '.' } });
      P(3, { riga: 4, leggi: ['3:0', '3:1'], letti: 'EAX = ' + s1 + ' · ECX = ' + s1 }, 3, 'Quarta istruzione: che cosa legge', 'ADD legge i due operandi prima di scrivere: EAX vale ' + s1 + ' ed ECX vale ' + s1 + '.', { calc: 'add eax, ecx' });
      P(4, { riga: 4, scritta: true, letti: 'EAX = ' + s1 + ' · ECX = ' + s1, calcolo: s1 + ' + ' + s1 + ' = ' + fin }, 3, 'Quarta istruzione: che cosa scrive', 'La somma, ' + fin + ', va nella destinazione EAX. ECX conserva la copia della prima somma.', { calc: s1 + ' + ' + s1 + ' = ' + fin });
      P(4, {}, 4, 'La traccia completa', 'L’ultima riga dà lo stato finale: EAX vale ' + fin + ' ed ECX vale ' + s1 + '. Il programma ha calcolato il doppio di ' + x + ' + ' + d + ', e la copia fatta alla terza riga è il motivo del raddoppio.', { calc: 'EAX = 2 × (' + x + ' + ' + d + ') = ' + fin });
      return { passi, esito: fin };
    }
  },
  bilancio: {
    regola: [
      'In sintassi Intel la destinazione viene per prima e la sorgente per seconda. Un’istruzione legge i suoi operandi, poi scrive la destinazione. La sorgente resta com’era.',
      'Una traccia di esecuzione ha una riga per istruzione e una colonna per registro. Il valore di un registro è quello dell’ultima scrittura che lo ha raggiunto; se un’istruzione non lo scrive, vale quello della riga precedente.'
    ],
    errori: [
      ['Leggere gli operandi al contrario.', 'In `mov ecx, eax` il registro scritto è ECX. EAX è la sorgente e resta com’era.'],
      ['Usare un valore vecchio.', 'Prima di usare un registro conviene risalire la traccia fino all’ultima riga che lo ha scritto.'],
      ['Pensare che due registri con lo stesso valore siano legati.', 'Dopo una copia i due registri sono indipendenti. Una scrittura in uno lascia l’altro com’era.']
    ],
    saFare: ['Leggo un’istruzione in sintassi Intel, distinguendo destinazione e sorgente.', 'Compilo la traccia di una breve sequenza di MOV e ADD.', 'Ricavo dalla traccia la formula che il programma calcola.'],
    esercizi: [
      { d: 'Compila la traccia di questo programma: `mov eax, 4`, `mov ecx, eax`, `add ecx, 3`, `add eax, ecx`. Quanto vale EAX alla fine?', segnaposto: 'Un numero', giuste: ['11', '0xb', '0x0b'],
        ok: 'Dopo la terza istruzione ECX vale 7 ed EAX vale ancora 4. L’ultima somma dà 4 + 7 = 11.',
        diagnosi: [
          { se: ['8'], msg: 'Hai sommato a EAX il valore che ECX aveva subito dopo la copia. La terza istruzione ha poi aumentato ECX di 3.' },
          { se: ['7'], msg: 'Questo è il valore finale di ECX. EAX riceve la somma dei due registri.' },
          { se: ['14'], msg: 'Hai aumentato di 3 anche EAX. La terza istruzione ha per destinazione ECX, e la copia in EAX resta a 4.' }
        ],
        altro: 'Il valore è diverso. Scrivi una riga per istruzione, con due colonne, e riporta ogni volta il registro che resta invariato.',
        indizi: ['Dopo le prime due istruzioni EAX ed ECX valgono entrambi 4.', 'La terza istruzione scrive soltanto ECX, che diventa 7.', 'L’ultima istruzione legge EAX = 4 ed ECX = 7.'],
        svolgimento: ['`mov eax, 4`: EAX = 4.', '`mov ecx, eax`: EAX = 4, ECX = 4.', '`add ecx, 3`: EAX = 4, ECX = 7.', '`add eax, ecx`: EAX = 4 + 7 = 11, ECX = 7.'] },
      { d: 'EAX contiene 6. Quanto vale dopo `add eax, eax`?', guida: 'Scegli la risposta.', o: [
        { t: '12', ok: true, fb: 'L’istruzione legge due volte il vecchio contenuto di EAX, somma 6 e 6, e scrive il risultato.' },
        { t: '6', fb: 'ADD scrive il risultato nella destinazione, che quindi cambia.' },
        { t: '24', fb: 'La somma viene fatta una volta sola, sui valori letti prima della scrittura: 6 + 6.' }] }
    ]
  }
});
