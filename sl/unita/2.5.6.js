'use strict';
SL.registra('2.5.6', {
  titolo: 'Dall’ingresso nel programma all’uscita del processo',
  obiettivo: 'Obiettivo: descrivere la terminazione di un processo, la parte del codice di uscita ricevuta dal genitore e il modo in cui il genitore la ricava dalla parola di stato.',
  concetti: [['riproduci', 'Il punto di ingresso'], ['gate', 'Il servizio exit'], ['scudo', 'La parola di stato']],
  filigrana: ['process', 'gate', 'bit'],
  richiami: {
    carte: [
      { sim: 'output', da: 'Dall’unità 1.1.5', t: 'Codice di uscita', d: 'Il numero che un programma restituisce quando termina. Per convenzione vale 0 in assenza di errori.' },
      { sim: 'scudo', da: 'Dall’unità 2.4.4', t: 'Leggere un campo', d: 'Uno scorrimento a destra porta il campo alle unità, e una maschera larga quanto il campo elimina il resto.' },
      { sim: 'fork', da: 'Dall’unità 2.5.4', t: 'Dopo execve', d: 'Il processore riparte dalla prima istruzione del nuovo programma, su una nuova immagine.' }
    ],
    domanda: { d: 'Prima di proseguire: quale codice di uscita segnala, per convenzione, che un programma è terminato senza errori?', o: [
      { t: '0', ok: true, fb: 'Zero indica un esito positivo. Ogni altro valore segnala un problema, e il suo significato è stabilito dal programma.' },
      { t: '1', fb: 'Uno è il codice più frequente per segnalare un errore generico. L’esito positivo è indicato dallo zero.' },
      { t: '255', fb: 'Duecentocinquantacinque è il codice massimo. L’esito positivo è indicato dallo zero.' }
    ] }
  },
  idea: {
    titolo: 'L’avvio e la terminazione di un processo',
    termini: ['punto di ingresso', 'parola di stato', 'waitpid'],
    testo: [
      'Dopo execve il processore riparte dalla prima istruzione del nuovo programma. Tale indirizzo prende il nome di [[punto di ingresso]] e reca per convenzione il nome `_start`. La funzione `main` di un programma in C è eseguita in seguito: a `_start` si trova un breve codice di avvio, fornito dalla libreria, che prepara l’ambiente e chiama poi `main`.',
      'Il medesimo codice di avvio provvede alla terminazione. Quando `main` ritorna, il valore restituito diventa il codice di uscita, e il codice di avvio lo trasmette al kernel con l’ultimo servizio che un processo possa richiedere: exit, numero 60, con il codice in RDI. Un programma in assembly privo di libreria deve richiedere exit direttamente. Se si limitasse a esaurire le istruzioni, il processore proseguirebbe con i byte successivi in memoria, qualunque ne sia il contenuto.',
      'Il kernel elimina l’immagine del processo e ne conserva soltanto un riassunto, la [[parola di stato]], a disposizione del processo genitore. Il genitore la ottiene con il servizio [[waitpid]], che attende la terminazione di un figlio.',
      { fig: 'scena', w: 720, h: 96, titolo: 'La parola di stato di un processo terminato con il codice 7', nota: 'La parola vale 0x0700. Il codice di uscita occupa i bit da 15 a 8.', els: [
        SL.el.box('a', 60, 10, 290, 64, 'bit da 15 a 8 · codice di uscita', '0000 0111', 'att'), SL.el.box('b', 370, 10, 290, 64, 'bit da 7 a 0 · modo di terminazione', '0000 0000', 'on')] },
      'La parola di stato è un valore impacchettato, come quelli del capitolo 2.4. I bit da 15 a 8 contengono il codice di uscita. I bit più bassi indicano il modo in cui il processo è terminato, e valgono zero in caso di terminazione volontaria. Il codice si ricava con uno scorrimento a destra di otto posizioni e la maschera 0xFF.',
      'Il campo è largo otto bit, e il codice ne eredita il limite: i valori possibili vanno da 0 a 255. Un codice maggiore è ridotto ai propri otto bit bassi. La richiesta del codice 256 equivale a quella del codice 0, e il programma risulta terminato con esito positivo.'
    ]
  },
  esperimento: {
    faremo: [
      'Un processo figlio termina con la richiesta al kernel del servizio exit. I controlli fissano il codice richiesto, anche esterno all’intervallo da 0 a 255.',
      'Il codice è seguito dal registro del figlio al kernel, all’interno della parola di stato, e fino al genitore che lo estrae. Dopo il caso proposto, è istruttivo richiedere il codice 256 e rilevare il valore letto dal genitore.'
    ],
    vedrai: [
      ['process', 'Il figlio', 'A sinistra: le tre istruzioni con cui il figlio richiede la terminazione.'],
      ['privilegi', 'Il kernel', 'Al centro: il codice richiesto e la parte conservata dal kernel.'],
      ['bit', 'La parola di stato', 'In basso: i sedici bit ricevuti dal genitore, divisi nei due campi.']
    ]
  },
  lab: {
    titolo: 'Un codice di uscita, dal figlio al genitore',
    scena: { w: 860, h: 366 },
    atti: ['La richiesta di uscita', 'Otto bit', 'La parola di stato', 'La lettura del genitore'],
    controlli: [
      { id: 'c', tipo: 'scelta', eti: 'Codice richiesto dal figlio', opzioni: [[7, '7'], [263, '263'], [0, '0'], [256, '256'], [300, '300'], [-1, '−1']], valore: 263 }
    ],
    nota: 'I passi sono sempre cinque. Il codice −1 è scritto in complemento a due su 32 bit.',
    previsione: {
      domanda: (p) => 'Un processo termina con `mov edi, ' + p.c + '`, `mov eax, 60` e `syscall`. Quale codice di uscita leggerà il processo genitore?',
      opzioni: (p) => { const c8 = ((p.c % 256) + 256) % 256; return Array.from(new Set([c8, p.c, c8 === 0 ? 1 : 0, 255, 1])).slice(0, 4).sort((a, b) => a - b).map((v) => [v, SL.x86.num(v)]); }
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + SL.x86.num(pred) + '. Il genitore legge ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il kernel conserva soltanto gli otto bit più bassi del codice richiesto. ' + (p.c >= 0 && p.c <= 255 ? 'Il numero ' + p.c + ' vi è contenuto per intero.' : p.c < 0 ? 'In complemento a due −1 è una fila di uni, e i suoi otto bit bassi valgono 255.' : 'Di ' + p.c + ' restano ' + p.c + ' − 256 = ' + esito + '.')),
    costruisci(p) {
      const el = SL.el, X = SL.x86, N = X.num, passi = [], c = p.c, c8 = ((c % 256) + 256) % 256, stato = c8 * 256, H4 = (v) => '0x' + v.toString(16).toUpperCase().padStart(4, '0'), H32 = '0x' + (c < 0 ? c + 4294967296 : c).toString(16).toUpperCase().padStart(8, '0');
      const LIS = [['il codice di uscita', 'mov edi, ' + c], ['il servizio exit', 'mov eax, 60'], ['il passaggio', 'syscall']];
      const ALTI = [8, 9, 10, 11, 12, 13, 14, 15], BASSI = [0, 1, 2, 3, 4, 5, 6, 7], TUTTI = ALTI.concat(BASSI);
      const quadro = (o) => {
        const f = o.fase, els = [el.zona('z1', 20, 0, 250, 176, 'il figlio', f <= 1 ? 'on' : ''), el.zona('z2', 290, 0, 280, 176, 'il kernel', f === 2 || f === 3 ? 'att' : ''), el.zona('z3', 590, 0, 250, 176, 'il genitore', f === 4 ? 'on' : '')];
        X.listato('li', LIS, o.riga, { x: 36, y: 34, w: 218, passo: 46 }).forEach((e) => els.push(e));
        els.push(el.box('k1', 306, 34, 248, 58, 'codice richiesto, su 32 bit', f >= 2 ? H32 : '·', f === 2 ? 'att' : f > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('k2', 306, 104, 248, 58, 'otto bit conservati', f >= 2 ? '0x' + X.esa2(c8) + ' = ' + c8 : '·', f === 2 ? 'att' : f > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('g1', 606, 34, 218, 58, 'parola di stato ricevuta', f >= 4 ? H4(stato) : '·', f === 4 ? 'on' : '', { cls: 'stretta' }),
          el.box('g2', 606, 104, 218, 58, 'codice di uscita letto', f >= 4 ? String(c8) : '·', f === 4 ? 'att' : '', { cls: 'stretta' }),
          el.nota('t1', 110, 188, 'CODICE DI USCITA', 'mono', f >= 3 ? 'att' : ''), el.nota('t2', 484, 188, 'MODO DI TERMINAZIONE', 'mono', f >= 3 ? 'on' : ''));
        X.fila('s', f >= 3 ? stato : 0, 16, { x: 110, y: 240, passo: 40, tagli: [8], gap: 54, h: 40, vuoto: f >= 3 ? [] : TUTTI, att: f === 3 ? ALTI : f === 4 ? ALTI : [], st: f >= 3 ? null : 'off' }).forEach((e) => els.push(e));
        els.push(el.box('est', 20, 300, 820, 58, 'estrazione del codice', f >= 4 ? '(' + H4(stato) + ' scorso a destra di 8) AND 0xFF = ' + c8 : f === 3 ? c8 + ' × 256 = ' + H4(stato) : '·', f >= 3 ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (f) => [['Codice richiesto', N(c), 'a'], ['Parola di stato', f >= 3 ? H4(stato) : '·'], ['Codice letto', f >= 4 ? String(c8) : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.fase), els: quadro(o) }, extra));

      P({ fase: 0 }, 0, 'L’ultima operazione', 'Il processo figlio ha concluso il proprio compito e deve terminare, comunicando il codice ' + N(c) + '. La terminazione va richiesta al kernel, poiché soltanto il kernel può eliminare un processo. Il servizio è denominato exit e ha il numero 60.',
        { chiedi: { d: 'Il codice di uscita è il primo, e unico, argomento di exit. In quale registro va scritto?', o: ['RAX', 'RDI', 'RSI'], g: 1, no: 'Il primo argomento di una chiamata di sistema è trasmesso in RDI. RAX contiene il numero del servizio.' } });
      const o1 = Array.from(new Set([c8, c, 255, 0])).slice(0, 3).sort((a, b) => a - b);
      P({ fase: 1, riga: 2 }, 0, 'La richiesta', 'Tre istruzioni: il codice ' + N(c) + ' in EDI, il numero 60 in EAX, e SYSCALL. A differenza delle altre chiamate di sistema, questa è priva di ritorno. Dopo SYSCALL il processo cessa di esistere, e le istruzioni successive restano ineseguite.',
        { calc: 'exit(' + N(c) + ')', chiedi: { d: 'Il kernel conserva soltanto gli otto bit più bassi del codice. Quanto vale ' + N(c) + ' ridotto a otto bit?', o: o1.map(N), g: o1.indexOf(c8), no: c >= 0 && c <= 255 ? 'Il numero ' + c + ' è contenuto in otto bit, e resta invariato.' : c < 0 ? 'In complemento a due −1 è una fila di uni. Gli otto bit più bassi, tutti a 1, valgono 255.' : c + ' supera 255. Sottraendo 256 resta ' + c8 + '.' } });
      P({ fase: 2, riga: 3 }, 1, c >= 0 && c <= 255 ? 'Un codice contenuto per intero' : 'Un codice ridotto a otto bit', 'Il kernel riceve in RDI il valore ' + H32 + ' e applica la maschera 0xFF. ' + (c >= 0 && c <= 255 ? 'Il codice ' + c + ' è già contenuto in otto bit, e passa invariato.' : c < 0 ? 'Il numero −1, su 32 bit, è una fila di uni. Gli otto bit bassi valgono 255: il genitore leggerà un codice positivo.' : c8 === 0 ? 'Di ' + c + ' gli otto bit bassi sono tutti zero. Il programma intendeva segnalare un problema e risulterà terminato con esito positivo.' : 'Di ' + c + ' restano gli otto bit bassi, che valgono ' + c + ' − 256 = ' + c8 + '.'), { calc: H32 + ' AND 0xFF = ' + c8 });
      P({ fase: 3, riga: 3 }, 2, 'La parola di stato', 'Il kernel elimina l’immagine del figlio e ne conserva un riassunto di sedici bit. Il codice è collocato nei bit da 15 a 8, cioè scorre a sinistra di otto posizioni: ' + c8 + ' × 256 = ' + H4(stato) + '. I bit da 7 a 0 valgono zero, poiché la terminazione è stata volontaria.',
        { calc: c8 + ' × 256 = ' + H4(stato), chiedi: { d: 'Il genitore riceverà la parola ' + H4(stato) + '. Quale calcolo ne ricava il codice di uscita?', o: ['AND con 0xFF', 'Scorrimento a destra di 8, poi AND con 0xFF', 'Scorrimento a sinistra di 8'], g: 1, no: 'Il codice occupa i bit da 15 a 8. Lo scorrimento a destra di 8 lo porta alle unità, e la maschera 0xFF elimina il resto.' } });
      P({ fase: 4, riga: 3 }, 3, 'Il genitore estrae il codice', 'Il genitore, che attendeva con waitpid, riceve la parola ' + H4(stato) + '. Il genitore verifica che i bit bassi siano zero, come avviene in una terminazione volontaria, poi fa scorrere la parola a destra di otto posizioni e applica la maschera 0xFF. Legge ' + c8 + '. Quando il genitore è la shell, è il numero stampato dal comando `echo $?`.', { calc: '(' + H4(stato) + ' ÷ 256) AND 0xFF = ' + c8, esito: ['codice letto: ' + c8, 'si'] });
      return { passi, esito: c8 };
    }
  },
  bilancio: {
    regola: [
      'Un programma comincia dal punto di ingresso, `_start`, e termina con la richiesta al kernel del servizio exit, numero 60, con il codice di uscita in RDI.',
      'Il kernel conserva gli otto bit bassi del codice nei bit da 15 a 8 della parola di stato. Il genitore la ottiene con waitpid e ricava il codice con uno scorrimento a destra di 8 e la maschera 0xFF.'
    ],
    errori: [
      ['Impiegare codici di uscita maggiori di 255.', 'Il codice 256 diventa 0, e il programma risulta terminato con esito positivo. Il codice 263 diventa 7.'],
      ['Interpretare la parola di stato come il codice.', 'Per il codice 7 la parola vale 0x0700, cioè 1792. Il codice va estratto dal proprio campo.'],
      ['Terminare un programma in assembly senza richiedere exit.', 'Esaurite le istruzioni, il processore prosegue con i byte successivi in memoria. Soltanto exit conclude il processo in modo ordinato.']
    ],
    saFare: ['Scrivere le istruzioni che terminano un processo con un codice assegnato.', 'Calcolare il codice letto dal genitore per una richiesta esterna all’intervallo.', 'Estrarre il codice di uscita da una parola di stato.'],
    esercizi: [
      { d: 'Un programma termina con `mov edi, 300`, `mov eax, 60` e `syscall`. Quale codice di uscita legge il genitore?', segnaposto: 'Un numero', giuste: ['44', 'quarantaquattro'],
        ok: 'Il kernel conserva gli otto bit più bassi. Trecento supera 255, e sottraendo 256 resta 44.',
        diagnosi: [
          { se: ['300'], msg: 'Trecento richiede nove bit. Il kernel ne conserva otto: va sottratto 256.' },
          { se: ['0'], msg: 'Zero si otterrebbe con la richiesta di 256. Per 300 restano 300 − 256.' },
          { se: ['60'], msg: 'Sessanta è il numero del servizio exit, contenuto in RAX. Il codice di uscita è in RDI.' },
          { se: ['45'], msg: 'Il calcolo è 300 − 256. I valori possibili sono 256, da 0 a 255.' }
        ],
        altro: 'Il codice è diverso. Si riduca 300 ai suoi otto bit più bassi.',
        indizi: ['Il kernel conserva soltanto gli otto bit più bassi del codice.', 'Otto bit rappresentano i numeri da 0 a 255. Per i numeri fino a 511 è sufficiente sottrarre 256.', '300 − 256.'],
        svolgimento: ['Codice richiesto: 300, in esadecimale 0x12C.', 'Otto bit bassi: 0x2C.', '0x2C = 44: è il codice letto dal genitore.'] },
      { d: 'Il genitore riceve da waitpid la parola di stato 0x2A00, per un figlio terminato di propria volontà. Qual era il codice di uscita?', guida: 'Si scelga la risposta.', o: [
        { t: '42', ok: true, fb: 'Con uno scorrimento a destra di otto posizioni si ottiene 0x2A, cioè 2 × 16 + 10 = 42.' },
        { t: '10752', fb: 'Il valore indicato è quello dell’intera parola, 0x2A00. Il codice di uscita ne occupa soltanto i bit da 15 a 8.' },
        { t: '0', fb: 'Zero è il contenuto dei bit da 7 a 0, che descrivono il modo di terminazione. Il codice occupa il campo più alto.' }] }
    ]
  }
});
