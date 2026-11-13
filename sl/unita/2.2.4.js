'use strict';
SL.registra('2.2.4', {
  titolo: 'Combinare i fattori di scala: 7a + 3b − 4',
  obiettivo: 'Alla fine saprai costruire prodotti per piccole costanti con LEA e SUB, e riconoscere l’espressione calcolata da una sequenza di questo tipo.',
  concetti: [['puntatore', 'LEA e le scale'], ['operation', 'SUB'], ['tabella', 'Traccia con le lettere']],
  filigrana: ['tabella', 'puntatore', 'operation'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 2.2.3', t: 'LEA', d: 'Calcola base + indice × scala + spiazzamento e scrive il numero nella destinazione. La scala vale 1, 2, 4 oppure 8.' },
      { sim: 'input', da: 'Dall’unità 2.2.2', t: 'Gli argomenti', d: 'Il primo argomento intero arriva in RDI, il secondo in RSI. Il risultato torna in RAX.' },
      { sim: 'tabella', da: 'Dall’unità 2.1.3', t: 'La traccia', d: 'Una riga per istruzione, una colonna per registro, con il contenuto dopo ogni istruzione.' }
    ],
    domanda: { d: 'Prima di proseguire: RDI contiene 5. Quanto vale RAX dopo `lea rax, [rdi + rdi*2]`?', o: [
      { t: '15', ok: true, fb: 'La base vale 5 e l’indice, moltiplicato per la scala, vale 10. In tutto 15, cioè tre volte RDI.' },
      { t: '10', fb: 'Questo è soltanto il termine con la scala. Va sommata anche la base, che vale 5.' },
      { t: '20', fb: 'La scala scritta è 2: l’espressione vale 5 + 5 × 2.' }
    ] }
  },
  idea: {
    titolo: 'Moltiplicare con somme e scale',
    termini: ['sub'],
    testo: [
      'La moltiplicazione è una delle operazioni più lente del processore. Quando uno dei fattori è una piccola costante, i compilatori preferiscono evitarla e ricorrono a LEA, che svolge il calcolo con circuiti più semplici.',
      'Le scale disponibili sono soltanto quattro: 1, 2, 4 e 8. Sommando la base se ne ricavano altri coefficienti. L’istruzione `lea rax, [rdi + rdi*2]` calcola 3 × RDI, perché somma RDI al suo doppio. Allo stesso modo, con le scale 4 e 8, si ottengono 5 e 9.',
      'Per i coefficienti che restano fuori si combinano due passaggi. Il sette nasce da otto meno uno: prima `lea rax, [rdi*8]`, poi una sottrazione. L’istruzione [[sub|SUB]] sottrae la sorgente dalla destinazione e scrive lì la differenza, come ADD fa con la somma. Dopo `sub rax, rdi` il registro RAX contiene 8a − a, cioè 7a.',
      'Lo spiazzamento permette di aggiungere o togliere una costante nello stesso passaggio. L’istruzione `lea rax, [rax + rdx - 4]` somma due registri e toglie 4, in un colpo solo.',
      { fig: 'scena', w: 720, h: 232, titolo: 'La traccia di 7a + 3b − 4, scritta con le lettere', nota: 'Quattro istruzioni e nessuna moltiplicazione. L’ultima riga è l’espressione calcolata.', els: [
        SL.el.nota('h1', 330, 0, 'RAX', 'mono'), SL.el.nota('h2', 520, 0, 'RDX', 'mono'),
        SL.el.box('i1', 10, 26, 290, 44, null, 'lea rax, [rdi*8]', '', { cls: 'stretta' }), SL.el.cella('a1', 320, 26, 170, 44, '8a', 'att', { piccola: true }), SL.el.cella('c1', 510, 26, 170, 44, '?', 'off', { piccola: true }),
        SL.el.box('i2', 10, 78, 290, 44, null, 'sub rax, rdi', '', { cls: 'stretta' }), SL.el.cella('a2', 320, 78, 170, 44, '7a', 'att', { piccola: true }), SL.el.cella('c2', 510, 78, 170, 44, '?', 'off', { piccola: true }),
        SL.el.box('i3', 10, 130, 290, 44, null, 'lea rdx, [rsi + rsi*2]', '', { cls: 'stretta' }), SL.el.cella('a3', 320, 130, 170, 44, '7a', '', { piccola: true }), SL.el.cella('c3', 510, 130, 170, 44, '3b', 'att', { piccola: true }),
        SL.el.box('i4', 10, 182, 290, 44, null, 'lea rax, [rax + rdx - 4]', '', { cls: 'stretta' }), SL.el.cella('a4', 320, 182, 170, 44, '7a + 3b − 4', 'on', { piccola: true, cls: 'minuta' }), SL.el.cella('c4', 510, 182, 170, 44, '3b', '', { piccola: true })] },
      'Chi legge il codice prodotto da un compilatore incontra queste sequenze di continuo. Per riconoscere l’espressione di partenza basta compilare la traccia con le lettere al posto dei numeri, come nella figura: 8a, poi 7a, poi 3b, poi 7a + 3b − 4.',
      'Resta una differenza da tenere presente. LEA calcola e lascia i flag com’erano, mentre SUB li scrive, come ADD. Per l’espressione di questa unità la cosa è indifferente. Diventerà decisiva nella prossima.'
    ]
  },
  esperimento: {
    faremo: [
      'Una funzione riceve a in RDI e b in RSI, e restituisce 7a + 3b − 4 senza usare la moltiplicazione. Sceglierai i due valori, anche negativi.',
      'Compileremo la traccia delle quattro istruzioni, annotando accanto a ogni numero l’espressione che rappresenta. Dopo il caso proposto, cambia il segno di a e prevedi il nuovo risultato.'
    ],
    vedrai: [
      ['tabella', 'Le istruzioni', 'A sinistra: le quattro istruzioni della funzione.'],
      ['register', 'La traccia', 'Al centro: RDI, RSI, RAX e RDX dopo ogni istruzione.'],
      ['alu', 'Il significato', 'In basso: l’espressione che l’istruzione corrente ha appena costruito.']
    ]
  },
  lab: {
    titolo: 'La funzione che calcola 7a + 3b − 4',
    scena: { w: 860, h: 372 },
    atti: ['L’ingresso', 'Il termine 7a', 'Il termine 3b', 'La somma finale'],
    controlli: [
      { id: 'a', tipo: 'num', eti: 'a, in RDI', min: -5, max: 9, salti: [1], valore: 3 },
      { id: 'b', tipo: 'num', eti: 'b, in RSI', min: -5, max: 9, salti: [1], valore: 2 }
    ],
    previsione: {
      domanda: (p) => 'All’ingresso RDI = ' + SL.x86.num(p.a) + ' e RSI = ' + SL.x86.num(p.b) + '. La funzione esegue `lea rax, [rdi*8]`, `sub rax, rdi`, `lea rdx, [rsi + rsi*2]`, `lea rax, [rax + rdx - 4]`. Quanto varrà RAX al ritorno?',
      opzioni: (p) => Array.from(new Set([7 * p.a + 3 * p.b - 4, 8 * p.a + 3 * p.b - 4, 7 * p.a + 2 * p.b - 4, 7 * p.a + 3 * p.b])).sort((x, y) => x - y).map((v) => [v, SL.x86.num(v)])
    },
    confronto: (pred, esito, p) => 'Avevi previsto RAX uguale a ' + SL.x86.num(pred) + '. Vale ' + SL.x86.num(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'I tre contributi sono 7a = ' + SL.x86.num(7 * p.a) + ', 3b = ' + SL.x86.num(3 * p.b) + ' e la costante −4.'),
    costruisci(p) {
      const el = SL.el, X = SL.x86, N = X.num, passi = [];
      const a = p.a, b = p.b, a8 = 8 * a, a7 = 7 * a, b3 = 3 * b, fin = a7 + b3 - 4, PAR = (v) => (v < 0 ? '(' + N(v) + ')' : N(v));
      const IST = ['all’ingresso', 'lea rax, [rdi*8]', 'sub rax, rdi', 'lea rdx, [rsi + rsi*2]', 'lea rax, [rax + rdx - 4]'];
      const T = [[a, b, null, null], [a, b, a8, null], [a, b, a7, null], [a, b, a7, b3], [a, b, fin, b3]];
      const quadro = (o) => X.traccia({ ist: IST, colonne: ['RDI · a', 'RSI · b', 'RAX', 'RDX'], T, riga: o.riga, leggi: o.leggi, scrive: o.scrive, evid: 2 }).concat([
        el.box('sig', 40, 304, 260, 56, 'la riga ha costruito', o.sig || '·', o.sig ? 'att' : '', { cls: 'stretta' }),
        el.box('cal', 330, 304, 500, 56, 'calcolo della riga', o.calcolo || '·', o.calcolo ? 'on' : '', { cls: 'stretta' })]);
      const hud = (k) => [['Istruzioni eseguite', k + ' su 4', 'a'], ['RAX', T[k][2] == null ? '?' : N(T[k][2])], ['RDX', T[k][3] == null ? '?' : N(T[k][3]), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.riga), els: quadro(o) }, extra));

      P({ riga: 0 }, 0, 'L’ingresso nella funzione', 'I due argomenti sono nei registri previsti dalla convenzione: a = ' + N(a) + ' in RDI e b = ' + N(b) + ' in RSI. RAX e RDX contengono valori qualunque.');
      P({ riga: 1, leggi: [0], scrive: 2, sig: '8a', calcolo: PAR(a) + ' × 8 = ' + N(a8) }, 1, 'Otto volte a', 'La prima LEA usa RDI come indice, con la scala 8, e nient’altro. In RAX arriva otto volte a. RDI viene soltanto letto.',
        { calc: PAR(a) + ' × 8 = ' + N(a8), chiedi: { d: 'RAX contiene 8a. Con quale operazione si arriva a 7a?', o: ['Sottraendo a', 'Sottraendo 1', 'Sottraendo 8'], g: 0, no: 'Sette volte a è otto volte a meno una volta a: 8a − a.' } });
      P({ riga: 2, leggi: [0, 2], scrive: 2, sig: '8a − a = 7a', calcolo: N(a8) + ' − ' + PAR(a) + ' = ' + N(a7) }, 1, 'Sette volte a', 'SUB sottrae RDI da RAX e scrive la differenza in RAX. Otto volte a meno una volta a fa sette volte a. Il coefficiente 7, assente dalle scale, è stato costruito in due mosse.', { calc: N(a8) + ' − ' + PAR(a) + ' = ' + N(a7) });
      const fo = Array.from(new Set([fin, a7 + b3, a7 + b3 + 4])).sort((x, y) => x - y);
      P({ riga: 3, leggi: [1], scrive: 3, sig: 'b + 2b = 3b', calcolo: PAR(b) + ' + ' + PAR(b) + ' × 2 = ' + N(b3) }, 2, 'Tre volte b', 'La seconda LEA usa RSI due volte: come base e come indice con la scala 2. La somma dà tre volte b, che viene messa da parte in RDX. RAX conserva 7a.',
        { calc: PAR(b) + ' + ' + PAR(b) + ' × 2 = ' + N(b3), chiedi: { d: 'RAX contiene ' + N(a7) + ' e RDX contiene ' + N(b3) + '. Quanto varrà RAX dopo `lea rax, [rax + rdx - 4]`?', o: fo.map(N), g: fo.indexOf(fin), no: 'L’espressione fra parentesi vale ' + N(a7) + ' + ' + PAR(b3) + ' − 4 = ' + N(fin) + '.' } });
      P({ riga: 4, leggi: [2, 3], scrive: 2, sig: '7a + 3b − 4', calcolo: N(a7) + ' + ' + PAR(b3) + ' − 4 = ' + N(fin) }, 3, 'La somma finale', 'L’ultima LEA usa RAX come base, RDX come indice con la scala 1 e −4 come spiazzamento. In RAX arriva la somma dei due termini, diminuita di quattro.', { calc: N(a7) + ' + ' + PAR(b3) + ' − 4 = ' + N(fin) });
      P({ riga: 4, sig: '7a + 3b − 4', calcolo: '7 × ' + PAR(a) + ' + 3 × ' + PAR(b) + ' − 4 = ' + N(fin) }, 3, 'L’espressione riconosciuta', 'Le lettere annotate riga per riga ricostruiscono l’espressione: 8a, poi 7a, poi 3b, poi 7a + 3b − 4. Con a = ' + N(a) + ' e b = ' + N(b) + ' il valore restituito è ' + N(fin) + '. Gli argomenti sono ancora in RDI e in RSI.', { calc: '7a + 3b − 4 = ' + N(fin) });
      return { passi, esito: fin };
    }
  },
  bilancio: {
    regola: [
      'Con una sola LEA si moltiplica un registro per 2, 4 e 8, oppure per 3, 5 e 9 sommando la base. Gli altri coefficienti si costruiscono in due passaggi, per esempio 7 come 8 meno 1.',
      'SUB sottrae la sorgente dalla destinazione e scrive i flag. Per riconoscere l’espressione calcolata da una sequenza si compila la traccia con le lettere al posto dei numeri.'
    ],
    errori: [
      ['Scrivere una scala che non esiste.', 'Le scale ammesse sono 1, 2, 4 e 8. Una moltiplicazione per 7 scritta come `[rdi*7]` viene rifiutata.'],
      ['Dimenticare la base.', '`[rdi + rdi*2]` vale tre volte RDI. Il termine con la scala, da solo, ne vale due.'],
      ['Sovrascrivere un termine che serve ancora.', 'Il termine 3b viene costruito in RDX proprio per lasciare 7a in RAX fino alla somma finale.']
    ],
    saFare: ['Calcolo il valore scritto da una LEA con base, indice, scala e spiazzamento.', 'Costruisco un prodotto per una piccola costante con LEA e SUB.', 'Riconosco l’espressione calcolata da una sequenza di LEA, ADD e SUB.'],
    esercizi: [
      { d: 'RDI contiene 6. Quanto vale RAX dopo `lea rax, [rdi + rdi*4]`?', segnaposto: 'Un numero', giuste: ['30', 'trenta'],
        ok: 'La base vale 6 e il termine con la scala 6 × 4 = 24. In tutto 30, cioè cinque volte RDI.',
        diagnosi: [
          { se: ['24'], msg: 'Questo è soltanto il termine con la scala. Va sommata anche la base, che vale 6.' },
          { se: ['10'], msg: 'Hai sommato 6 e 4. La scala moltiplica l’indice: 6 × 4.' },
          { se: ['48'], msg: 'La somma si fa dopo la moltiplicazione: 6 + 6 × 4.' }
        ],
        altro: 'Il valore è diverso. Calcola prima indice × scala, poi somma la base.',
        indizi: ['L’espressione è base + indice × scala.', 'Base e indice sono lo stesso registro, che vale 6.', '6 + 6 × 4.'],
        svolgimento: ['Indice × scala: 6 × 4 = 24.', 'Più la base: 24 + 6 = 30.', 'RAX = 30, cioè 5 × RDI.'] },
      { d: 'Quale istruzione scrive in RAX nove volte il contenuto di RDI?', guida: 'Scegli la risposta.', o: [
        { t: 'lea rax, [rdi + rdi*8]', ok: true, fb: 'La base vale una volta RDI e il termine con la scala otto volte: in tutto nove.' },
        { t: 'lea rax, [rdi*9]', fb: 'Le scale ammesse sono 1, 2, 4 e 8. Il nove va costruito come otto più uno.' },
        { t: 'lea rax, [rdi*8 + 1]', fb: 'Lo spiazzamento aggiunge la costante 1. Il risultato sarebbe 8 × RDI + 1.' }] }
    ],
    sfida: ['cslez2_2_02_random_assembly_02', 'Incrementi, somme e combinazioni lineari']
  }
});
