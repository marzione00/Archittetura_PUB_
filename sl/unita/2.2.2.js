'use strict';
SL.registra('2.2.2', {
  titolo: 'Un’espressione in tre registri: a × b + c',
  obiettivo: 'Obiettivo: tradurre una breve espressione aritmetica in tre istruzioni, noti i registri che ricevono gli argomenti e il registro destinato al risultato.',
  concetti: [['input', 'Argomenti nei registri'], ['operation', 'IMUL'], ['output', 'Risultato in EAX']],
  filigrana: ['operation', 'register', 'output'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 2.1.3', t: 'La traccia', d: 'Una riga per istruzione, una colonna per registro. Un registro non scritto dall’istruzione conserva il valore precedente.' },
      { sim: 'strati', da: 'Dall’unità 2.1.2', t: 'Le viste da 32 bit', d: 'EAX, EDI, ESI ed EDX sono le metà basse di RAX, RDI, RSI e RDX. La scrittura di una di esse azzera la metà alta.' },
      { sim: 'file', da: 'Dall’unità 1.1.1', t: 'Le funzioni', d: 'Una funzione è un gruppo di istruzioni dotato di un nome, che riceve dati, svolge un compito e restituisce un risultato.' }
    ],
    domanda: { d: 'Prima di proseguire: EAX contiene 4 ed ECX contiene 9. Quanto vale ECX dopo `add eax, ecx`?', o: [
      { t: '9', ok: true, fb: 'ECX è la sorgente: è letto e resta invariato. Il risultato, 13, è scritto in EAX.' },
      { t: '13', fb: 'La somma è scritta nella destinazione, che in sintassi Intel è il primo operando: EAX.' },
      { t: '4', fb: 'ADD lascia invariata la sorgente, ed ECX conserva quindi 9.' }
    ] }
  },
  idea: {
    titolo: 'Tre argomenti, un risultato',
    termini: ['convenzione di chiamata', 'imul'],
    testo: [
      'Nelle unità precedenti i valori dei registri sono stati assegnati senza indicarne la provenienza. In un programma reale essi sono, nella maggior parte dei casi, gli argomenti di una funzione, cioè i dati che il codice che la chiama le fornisce per l’elaborazione.',
      'Il codice che chiama una funzione e la funzione chiamata devono concordare sulla posizione degli argomenti e su quella del risultato. Tale accordo prende il nome di [[convenzione di chiamata]]. Nei sistemi Linux a 64 bit i primi tre argomenti interi sono collocati nei registri RDI, RSI e RDX, in quest’ordine, e il risultato è restituito in RAX. Per i numeri di 32 bit si impiegano le viste corrispondenti: EDI, ESI, EDX ed EAX. La convenzione è ripresa per intero nel capitolo 2.6.',
      'Si consideri una funzione che calcola a × b + c. All’ingresso a si trova in EDI, b in ESI e c in EDX. La moltiplicazione fra interi con segno è eseguita da [[imul|IMUL]], che nella forma a due operandi moltiplica la destinazione per la sorgente e scrive il prodotto nella destinazione, come ADD con la somma.',
      'La traduzione richiede tre istruzioni. La prima, `mov eax, edi`, copia a nel registro del risultato. La seconda, `imul eax, esi`, lo moltiplica per b. La terza, `add eax, edx`, aggiunge c. EAX contiene dapprima un dato e in seguito ciascun risultato intermedio, fino a quello finale.',
      { fig: 'scena', w: 700, h: 100, titolo: 'Posizione dei dati all’ingresso e all’uscita', nota: 'I tre registri degli argomenti sono soltanto letti. Il risultato è costruito in EAX.', els: [
        SL.el.box('a', 10, 8, 150, 80, 'EDI', 'a', 'on'), SL.el.box('b', 170, 8, 150, 80, 'ESI', 'b', 'on'), SL.el.box('c', 330, 8, 150, 80, 'EDX', 'c', 'on'),
        SL.el.linea('l', 480, 48, 530, 48, 'att'), SL.el.box('d', 530, 8, 160, 80, 'EAX', 'a × b + c', 'att', { cls: 'stretta' })] },
      'È utile osservare ciò che il programma lascia invariato. I tre registri degli argomenti sono soltanto letti, e dopo la moltiplicazione c si trova ancora in EDX, disponibile per la somma. Se la prima istruzione fosse stata `imul edi, esi`, il prodotto sarebbe stato scritto in EDI e il valore di a sarebbe andato perduto.',
      'Con a = 4, b = 7 e c = 3 la traccia di EAX è 4, poi 28, poi 31. Con b = −7 è 4, poi −28, poi −25. IMUL tiene conto del segno, e i bit di −28 sono quelli del complemento a due su 32 bit.'
    ]
  },
  esperimento: {
    faremo: [
      'Una funzione riceve tre argomenti e restituisce a × b + c. I controlli fissano i tre valori, e a b può essere attribuito un segno negativo.',
      'L’esecuzione compila la traccia dei quattro registri coinvolti. EAX cambia a ogni istruzione, mentre i tre registri degli argomenti restano invariati. Dopo il caso proposto, è istruttivo rendere b negativo e prevedere i due risultati intermedi.'
    ],
    vedrai: [
      ['tabella', 'Le istruzioni', 'A sinistra: il corpo della funzione, una riga per istruzione.'],
      ['register', 'La traccia', 'Al centro: EDI, ESI, EDX ed EAX dopo ogni istruzione.'],
      ['alu', 'Il calcolo', 'In basso: l’operazione svolta nella riga corrente.']
    ]
  },
  lab: {
    titolo: 'La funzione che calcola a × b + c',
    scena: { w: 860, h: 372 },
    atti: ['L’ingresso', 'Il corpo della funzione', 'Il ritorno'],
    controlli: [
      { id: 'a', tipo: 'num', eti: 'a, in EDI', min: 2, max: 9, salti: [1], valore: 4 },
      { id: 'b', tipo: 'scelta', eti: 'b, in ESI', opzioni: [[7, '7'], [-7, '−7'], [3, '3'], [-2, '−2'], [10, '10']], valore: 7 },
      { id: 'c', tipo: 'num', eti: 'c, in EDX', min: 0, max: 9, salti: [1], valore: 3 }
    ],
    previsione: {
      domanda: (p) => 'All’ingresso EDI = ' + p.a + ', ESI = ' + SL.x86.num(p.b) + ', EDX = ' + p.c + '. La funzione esegue `mov eax, edi`, `imul eax, esi`, `add eax, edx`. Quanto varrà EAX al ritorno?',
      opzioni: (p) => Array.from(new Set([p.a * p.b + p.c, p.a * (p.b + p.c), p.a + p.b + p.c, p.a * p.b])).sort((x, y) => x - y).map((v) => [v, SL.x86.num(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava EAX uguale a ' + SL.x86.num(pred) + '. Vale ' + SL.x86.num(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Le istruzioni sono eseguite nell’ordine di scrittura: dapprima il prodotto ' + p.a + ' × ' + SL.x86.num(p.b) + ' = ' + SL.x86.num(p.a * p.b) + ', poi la somma con ' + p.c + '.'),
    costruisci(p) {
      const el = SL.el, N = SL.x86.num, passi = [];
      const a = p.a, b = p.b, c = p.c, prod = a * b, fin = prod + c;
      const IST = ['all’ingresso', 'mov eax, edi', 'imul eax, esi', 'add eax, edx', 'ritorno'];
      const T = [[a, b, c, null], [a, b, c, a], [a, b, c, prod], [a, b, c, fin], [a, b, c, fin]];
      const Y = (k) => 30 + k * 54, COL = ['EDI', 'ESI', 'EDX', 'EAX'];
      const quadro = (o) => {
        const els = [el.nota('h', 40, 0, 'ISTRUZIONE', 'mono')];
        COL.forEach((n, j) => els.push(el.nota('h' + j, 330 + j * 128, 0, n + (j === 0 ? ' · a' : j === 1 ? ' · b' : j === 2 ? ' · c' : ' · risultato'), 'mono', j === 3 ? 'att' : '')));
        IST.forEach((t, k) => els.push(el.box('i' + k, 40, Y(k), 260, 46, null, t, k === o.riga ? 'att' : k < o.riga ? 'on' : '', { cls: 'stretta' })));
        for (let k = 0; k < 5; k++) for (let j = 0; j < 4; j++) {
          const vista = k <= o.riga, v = T[k][j];
          els.push(el.cella('t' + k + j, 330 + j * 128, Y(k), 116, 46, !vista ? '·' : v == null ? '?' : N(v), !vista || v == null ? 'off' : (o.leggi || []).includes(j) && k === o.riga - 1 ? 'att' : k === o.riga && j === 3 && o.riga > 0 && o.riga < 4 ? 'att' : 'on', { piccola: true }));
        }
        els.push(el.box('cal', 330, 304, 500, 56, 'calcolo della riga', o.calcolo || '·', o.calcolo ? 'att' : '', { cls: 'stretta' }));
        els.push(el.box('rit', 40, 304, 260, 56, 'valore restituito', o.riga === 4 ? N(fin) : '·', o.riga === 4 ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (k) => [['Istruzioni eseguite', Math.min(3, k) + ' su 3', 'a'], ['EAX', T[k][3] == null ? '?' : N(T[k][3])], ['EDX', c, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.riga), els: quadro(o) }, extra));

      P({ riga: 0 }, 0, 'L’ingresso nella funzione', 'Il codice che ha chiamato la funzione ha collocato i tre argomenti nei registri prescritti dalla convenzione: a = ' + a + ' in EDI, b = ' + N(b) + ' in ESI, c = ' + c + ' in EDX. EAX contiene un valore arbitrario, che la funzione deve sostituire con il risultato.');
      const o1 = Array.from(new Set([prod, a + b, a])).sort((x, y) => x - y);
      P({ riga: 1, leggi: [0], calcolo: 'EAX ← EDI = ' + a }, 1, 'Il primo fattore è copiato in EAX', 'La funzione copia a nel registro del risultato. EDI è soltanto letto e conserva ' + a + '.',
        { calc: 'EAX = ' + a, chiedi: { d: 'EAX contiene ' + a + ' ed ESI contiene ' + N(b) + '. Quanto varrà EAX dopo `imul eax, esi`?', o: o1.map(N), g: o1.indexOf(prod), no: 'IMUL moltiplica la destinazione per la sorgente: ' + a + ' × ' + (b < 0 ? '(' + N(b) + ')' : b) + ' = ' + N(prod) + '.' } });
      P({ riga: 2, leggi: [1, 3], calcolo: a + ' × ' + (b < 0 ? '(' + N(b) + ')' : b) + ' = ' + N(prod) }, 1, 'Il prodotto', 'IMUL legge EAX ed ESI, li moltiplica come interi con segno e scrive il prodotto in EAX. Il contenuto precedente di EAX, cioè a, è sostituito, e in EDI ne resta la copia originale.' + (b < 0 ? ' Il prodotto è negativo, e in EAX sono scritti i bit del suo complemento a due.' : ''),
        { calc: a + ' × ' + (b < 0 ? '(' + N(b) + ')' : b) + ' = ' + N(prod), chiedi: { d: 'Resta da eseguire la somma con c. In quale registro si trova c a questo punto?', o: ['In EDX, dove è stato ricevuto', 'In EAX, insieme al prodotto', 'È andato perduto'], g: 0, no: 'Nessuna istruzione ha scritto EDX, e c vi si trova quindi ancora.' } });
      P({ riga: 3, leggi: [2, 3], calcolo: N(prod) + ' + ' + c + ' = ' + N(fin) }, 1, 'La somma', 'ADD legge EAX ed EDX e scrive la somma in EAX. Il registro del risultato contiene ora a × b + c.', { calc: N(prod) + ' + ' + c + ' = ' + N(fin) });
      P({ riga: 4 }, 2, 'Il ritorno', 'La funzione è terminata. Il codice che l’ha chiamata trova il risultato in EAX, come prescrive la convenzione: ' + N(fin) + '. I tre argomenti si trovano ancora nei rispettivi registri, poiché il corpo li ha soltanto letti.', { calc: 'EAX = ' + a + ' × ' + (b < 0 ? '(' + N(b) + ')' : b) + ' + ' + c + ' = ' + N(fin) });
      return { passi, esito: fin };
    }
  },
  bilancio: {
    regola: [
      'La convenzione di chiamata fissa la posizione degli argomenti e quella del risultato. Nei sistemi Linux a 64 bit i primi tre argomenti interi sono ricevuti in RDI, RSI e RDX, e il risultato è restituito in RAX.',
      'Un’espressione è tradotta un’operazione alla volta, con il registro del risultato impiegato per i valori intermedi. IMUL a due operandi moltiplica la destinazione per la sorgente. Gli argomenti ancora necessari vanno lasciati nei rispettivi registri.'
    ],
    errori: [
      ['Scrivere il risultato in un registro arbitrario.', 'Il codice che chiama la funzione legge EAX. Un risultato lasciato altrove va perduto.'],
      ['Sovrascrivere un argomento ancora necessario.', 'Dopo `imul edi, esi` il valore di a è assente da EDI. La scelta è ammissibile soltanto se nessuna istruzione successiva lo impiega.'],
      ['Sommare prima di moltiplicare.', 'Le istruzioni sono eseguite nell’ordine di scrittura. La precedenza fra le operazioni è stabilita dal programmatore mediante la scelta di tale ordine.']
    ],
    saFare: ['Indicare i registri che ricevono i primi tre argomenti interi e il registro del risultato.', 'Tradurre a × b + c in tre istruzioni.', 'Compilare la traccia e ricavare i risultati intermedi.'],
    esercizi: [
      { d: 'All’ingresso di una funzione EDI = 6, ESI = −4 ed EDX = 10. Il corpo è `mov eax, edi`, `imul eax, esi`, `add eax, edx`. Quanto vale EAX al ritorno?', segnaposto: 'Un numero, con il segno', giuste: ['-14', '−14'],
        ok: 'Il prodotto 6 × (−4) vale −24. Sommando 10 si ottiene −14.',
        diagnosi: [
          { se: ['36'], msg: 'La somma di −4 e 10 è stata eseguita prima della moltiplicazione. Le istruzioni eseguono dapprima il prodotto, poi la somma.' },
          { se: ['-24', '−24'], msg: 'Il valore indicato è il prodotto. Resta l’ultima istruzione, che aggiunge il contenuto di EDX.' },
          { se: ['34'], msg: 'Il prodotto di 6 per −4 è negativo: −24.' },
          { se: ['14'], msg: 'Il valore assoluto è corretto. Il prodotto vale −24, e la somma con 10 resta negativa.' }
        ],
        altro: 'Il valore è diverso. Si compili la traccia di EAX, una riga per istruzione.',
        indizi: ['Dopo la prima istruzione EAX vale 6.', 'Dopo la seconda EAX vale 6 × (−4) = −24.', 'La terza aggiunge il contenuto di EDX, che vale 10.'],
        svolgimento: ['`mov eax, edi`: EAX = 6.', '`imul eax, esi`: EAX = 6 × (−4) = −24.', '`add eax, edx`: EAX = −24 + 10 = −14.'] },
      { d: 'La medesima funzione ha appena eseguito le proprie tre istruzioni. Che cosa contiene EDI?', guida: 'Si scelga la risposta.', o: [
        { t: 'Ancora il valore di a', ok: true, fb: 'EDI compare soltanto come sorgente della prima istruzione. Nessuna istruzione lo ha scritto.' },
        { t: 'Il prodotto a × b', fb: 'Il prodotto è stato scritto in EAX, la destinazione di IMUL.' },
        { t: 'Zero', fb: 'La lettura lascia invariato un registro. EDI conserva il primo argomento.' }] }
    ],
    sfida: ['cslez2_2_01_random_assembly_01', 'Copia e aritmetica nei registri']
  }
});
