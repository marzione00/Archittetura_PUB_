'use strict';
SL.registra('2.5.2', {
  titolo: 'L’ABI delle syscall Linux x86-64',
  obiettivo: 'Alla fine saprai dire in quale registro il kernel cerca ciascun argomento di una chiamata di sistema, e come si riconosce un errore nel valore restituito.',
  concetti: [['tabella', 'Un accordo sui registri'], ['register', 'Il quarto argomento'], ['scudo', 'Gli errori in RAX']],
  filigrana: ['tabella', 'register', 'scudo'],
  richiami: {
    carte: [
      { sim: 'gate', da: 'Dall’unità 2.5.1', t: 'SYSCALL', d: 'Porta il processore nel modo privilegiato. Salva in RCX l’indirizzo di ripresa e in R11 i flag.' },
      { sim: 'input', da: 'Dall’unità 2.2.2', t: 'Convenzione di chiamata', d: 'L’accordo che fissa in quali registri stanno gli argomenti di una funzione e dove torna il risultato.' },
      { sim: 'segno', da: 'Dall’unità 1.4.1', t: 'Interi con segno', d: 'In complemento a due, lo stesso registro può contenere numeri positivi e negativi.' }
    ],
    domanda: { d: 'Prima di proseguire: un programma ha un dato importante in RCX ed esegue SYSCALL. Che cosa accade a quel dato?', o: [
      { t: 'Viene sovrascritto dall’indirizzo di ripresa', ok: true, fb: 'SYSCALL salva in RCX l’indirizzo dell’istruzione successiva. Qualunque valore vi si trovasse è perduto.' },
      { t: 'Resta intatto', fb: 'SYSCALL usa RCX per ricordare da dove riprendere. Il contenuto precedente viene sovrascritto.' },
      { t: 'Viene passato al kernel come argomento', fb: 'Quando il kernel prende il controllo, RCX contiene già l’indirizzo di ripresa. Il dato che c’era prima è perduto.' }
    ] }
  },
  idea: {
    titolo: 'Sei registri, con una eccezione',
    termini: ['abi', 'funzione di raccordo', 'errno'],
    testo: [
      'Chi chiama una funzione e chi la scrive devono accordarsi su dove stanno gli argomenti. Lo stesso vale fra un programma e il kernel. L’insieme di questi accordi, a livello dei registri e della memoria, si chiama [[abi|ABI]], dall’inglese per interfaccia binaria delle applicazioni. È ciò che permette a due pezzi di codice macchina, scritti da persone diverse, di capirsi.',
      'Per le funzioni, la convenzione di Linux assegna ai primi sei argomenti interi i registri RDI, RSI, RDX, RCX, R8 e R9, in quest’ordine. Per le chiamate di sistema l’elenco è quasi lo stesso: RDI, RSI, RDX, R10, R8 e R9. Cambia soltanto il quarto posto.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Gli argomenti, dal primo al sesto', nota: 'Cinque registri su sei coincidono. Il quarto argomento cambia sede, da RCX a R10.', els: [
        SL.el.nota('n1', 0, 14, 'funzione', 'mono'), SL.el.nota('n2', 0, 98, 'kernel', 'mono')]
        .concat(['RDI', 'RSI', 'RDX', 'RCX', 'R8', 'R9'].map((r, k) => SL.el.box('f' + k, 100 + k * 102, 0, 94, 50, (k + 1) + '°', r, k === 3 ? 'att' : 'on', { cls: 'stretta' })))
        .concat(['RDI', 'RSI', 'RDX', 'R10', 'R8', 'R9'].map((r, k) => SL.el.box('k' + k, 100 + k * 102, 84, 94, 50, (k + 1) + '°', r, k === 3 ? 'att' : 'on', { cls: 'stretta' })))
        .concat([0, 1, 2, 3, 4, 5].map((k) => SL.el.linea('l' + k, 147 + k * 102, 50, 147 + k * 102, 84, k === 3 ? 'att' : 'on'))) },
      'La ragione sta nell’unità precedente. L’istruzione SYSCALL scrive in RCX l’indirizzo di ripresa, e un argomento lasciato lì verrebbe distrutto prima che il kernel possa leggerlo. Il quarto argomento viaggia perciò in R10.',
      'I programmi scritti in C raramente eseguono SYSCALL da sé. Chiamano una [[funzione di raccordo]] della libreria, per esempio `write`, che riceve gli argomenti come ogni funzione e li sistema per il kernel: copia RCX in R10, mette in RAX il numero del servizio, esegue SYSCALL.',
      'Anche il valore restituito segue un accordo. Il kernel segnala un errore restituendo in RAX un numero negativo compreso fra −4095 e −1, il cui valore assoluto dice quale errore si è verificato: 2 significa che un file manca, 22 che un argomento è privo di senso. La funzione di raccordo traduce: conserva il codice in una variabile chiamata [[errno]] e restituisce −1 al programma.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma chiama la funzione di raccordo di un servizio con sei argomenti: quello che chiede al kernel una nuova zona di memoria, numero 9. Sceglierai quale argomento seguire e se la richiesta riesce.',
      'Vedremo dove l’argomento entra nella funzione di raccordo, dove lo trova il kernel e come viene trattato il valore restituito. Dopo il caso proposto, segui il terzo argomento e confronta.'
    ],
    vedrai: [
      ['input', 'I registri della funzione', 'In alto: i sei registri in cui la funzione di raccordo riceve gli argomenti.'],
      ['privilegi', 'I registri del kernel', 'Al centro: i sei registri in cui il kernel li cerca.'],
      ['operation', 'La funzione di raccordo', 'In basso: le sue istruzioni e il valore che restituisce.']
    ]
  },
  lab: {
    titolo: 'Un argomento seguito fino al kernel',
    scena: { w: 860, h: 366 },
    atti: ['Sei argomenti', 'La copia del quarto', 'Il numero e il passaggio', 'Il valore restituito', 'La traduzione dell’errore'],
    controlli: [
      { id: 'k', tipo: 'num', eti: 'Argomento da seguire', min: 1, max: 6, salti: [1], valore: 4 },
      { id: 'e', tipo: 'scelta', eti: 'Esito della richiesta', opzioni: [['ok', 'riuscita'], ['err', 'fallita']], valore: 'ok' }
    ],
    nota: 'I sei argomenti valgono 0, 4096, 3, 34, −1 e 0. Il servizio è il numero 9.',
    previsione: {
      domanda: (p) => 'Una funzione di raccordo riceve sei argomenti nei registri RDI, RSI, RDX, RCX, R8 e R9. In quale registro il kernel cercherà l’argomento numero ' + p.k + '?',
      opzioni: (p) => { const U = SL.unita252; return Array.from(new Set([U.SIS[p.k - 1], 'RCX', 'R10', U.FUN[p.k % 6]])).sort(); }
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + pred + '. Il kernel lo cerca in ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.k === 4 ? 'Il quarto argomento è l’unico a cambiare sede: SYSCALL sovrascrive RCX, e la funzione di raccordo lo copia in R10.' : 'Per tutti gli argomenti tranne il quarto, il registro della funzione e quello del kernel coincidono.'),
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita252, passi = [], k = p.k - 1, OK = p.e === 'ok', V = [0, 4096, 3, 34, -1, 0], N = X.num;
      const LIS = [['il quarto cambia sede', 'mov r10, rcx'], ['il numero del servizio', 'mov eax, 9'], ['il passaggio', 'syscall'], ['se RAX indica un errore', 'errno = −RAX · RAX = −1'], ['ritorno al programma', 'ret']];
      const st = { r10: null, rax: null, rcx: 34, errno: null };
      const quadro = (o) => {
        const els = [el.nota('n1', 20, 18, 'la funzione riceve', 'mono minuta'), el.nota('n2', 20, 106, 'il kernel legge', 'mono minuta')];
        U.FUN.forEach((r, j) => els.push(el.box('f' + j, 190 + j * 110, 0, 102, 56, (j + 1) + '° · ' + r, j === 3 && o.rotto ? 'ripresa' : N(V[j]), j === 3 && o.rotto ? 'err' : j === k && o.fase <= 1 ? 'att' : 'on', { cls: 'stretta' })));
        U.SIS.forEach((r, j) => { const pronto = j === 3 ? st.r10 != null : true; els.push(el.box('s' + j, 190 + j * 110, 88, 102, 56, (j + 1) + '° · ' + r, pronto ? N(V[j]) : '·', !pronto ? '' : j === k && o.fase >= 1 ? 'att' : o.fase >= 2 ? 'on' : '', { cls: 'stretta' })); els.push(el.linea('l' + j, 241 + j * 110, 56, 241 + j * 110, 88, j === k ? 'att' : j === 3 && !pronto ? '' : 'on')); });
        LIS.forEach((r, j) => els.push(el.box('i' + j, 20, 168 + j * 40, 400, 36, null, r[1], o.riga === j ? 'att' : o.riga > j ? (j === 3 && OK ? 'off' : 'on') : '', { cls: 'stretta' })));
        els.push(el.box('rax', 440, 168, 190, 62, 'RAX', st.rax == null ? '·' : st.rax, o.rax ? 'att' : st.rax != null ? 'on' : '', { cls: 'stretta' }),
          el.box('rcx', 650, 168, 190, 62, 'RCX', o.rotto ? '0x401216' : '34', o.rotto && o.fase === 2 ? 'err' : '', { cls: 'stretta' }),
          el.box('err', 440, 244, 190, 62, 'errno', st.errno == null ? '·' : String(st.errno), o.errno ? 'att' : st.errno != null ? 'on' : '', { cls: 'stretta' }),
          el.box('fin', 650, 244, 190, 62, 'al programma', o.fine ? (OK ? '0x7F0000' : '−1') : '·', o.fine ? 'att' : '', { cls: 'stretta' }),
          el.box('sig', 440, 318, 400, 40, null, o.sig || '·', o.sig ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (o) => [['Argomento ' + p.k, N(V[k]), 'a'], ['Sede nel kernel', o.fase >= 1 ? U.SIS[k] : '·'], ['RAX', st.rax == null ? '·' : st.rax, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o), els: quadro(o) }, extra));

      P({ fase: 0 }, 0, 'Sei argomenti in sei registri', 'Il programma ha chiamato la funzione di raccordo come una funzione qualunque. I sei argomenti sono arrivati nei registri previsti dalla convenzione: RDI, RSI, RDX, RCX, R8 e R9. Quello che seguiamo è il numero ' + p.k + ', che vale ' + N(V[k]) + ' e si trova in ' + U.FUN[k] + '.',
        { chiedi: { d: 'Fra poco verrà eseguita SYSCALL. Quale di questi sei registri verrà sovrascritto dal processore?', o: ['RDX', 'RCX', 'R8'], g: 1, no: 'SYSCALL salva in RCX l’indirizzo di ripresa. Il quarto argomento, che sta lì, andrebbe perduto.' } });
      st.r10 = 34;
      P({ fase: 1, riga: 0 }, 1, k === 3 ? 'Il quarto argomento cambia sede' : 'Soltanto il quarto si sposta', 'La prima istruzione copia RCX in R10, mettendo in salvo il quarto argomento. ' + (k === 3 ? 'È proprio quello che stiamo seguendo: il valore 34 si trova ora anche in R10, dove il kernel lo cercherà.' : 'L’argomento numero ' + p.k + ' resta dov’è: ' + U.FUN[k] + ' è già il registro in cui il kernel lo cercherà.'), { calc: 'R10 = RCX = 34' });
      st.rax = '9';
      P({ fase: 2, riga: 1, rax: true }, 2, 'Il numero del servizio', 'La seconda istruzione mette in RAX il numero 9, che in Linux indica il servizio richiesto. A questo punto la richiesta è completa: il numero in RAX e i sei argomenti nei registri che il kernel si aspetta.', { calc: 'RAX = 9' });
      P({ fase: 2, riga: 2, rotto: true }, 2, 'Il passaggio', 'SYSCALL porta il processore nel modo privilegiato e scrive in RCX l’indirizzo di ripresa. Il valore 34 che RCX conteneva è perduto, ma la sua copia in R10 è al sicuro. Il kernel legge l’argomento numero ' + p.k + ' in ' + U.SIS[k] + ' e vi trova ' + N(V[k]) + '.',
        { calc: U.SIS[k] + ' = ' + N(V[k]), chiedi: { d: 'Il kernel ha finito e restituisce un valore in RAX. Quali valori indicano un errore?', o: ['Lo zero', 'I numeri negativi da −4095 a −1', 'Tutti i numeri dispari'], g: 1, no: 'Il kernel segnala un errore con un numero negativo compreso fra −4095 e −1. Il valore assoluto è il codice dell’errore.' } });
      st.rax = OK ? '0x7F0000' : '−22';
      P({ fase: 3, riga: 2, rotto: true, rax: true, sig: OK ? 'RAX è fuori dall’intervallo degli errori' : 'RAX sta fra −4095 e −1: è un errore' }, 3, OK ? 'Un valore valido' : 'Un numero negativo', (OK ? 'Il kernel ha riservato la zona di memoria e ne restituisce l’indirizzo, 0x7F0000. Il valore cade fuori dall’intervallo da −4095 a −1, quindi la richiesta è riuscita.' : 'Il kernel ha rifiutato la richiesta e restituisce −22. Il valore cade nell’intervallo da −4095 a −1, quindi è un errore: il codice 22 dice che un argomento era privo di senso.'), { calc: 'RAX = ' + st.rax });
      if (!OK) { st.errno = 22; st.rax = '−1'; }
      P({ fase: 4, riga: OK ? 4 : 3, rotto: true, rax: !OK, errno: !OK, fine: true, sig: OK ? 'il valore passa al programma così com’è' : 'il codice va in errno, al programma arriva −1' }, 4, OK ? 'Nessuna traduzione' : 'La traduzione dell’errore', (OK ? 'La funzione di raccordo controlla RAX, non vi trova un errore e ritorna. Il programma riceve l’indirizzo 0x7F0000 come valore della funzione.' : 'La funzione di raccordo cambia di segno il valore e conserva il codice 22 nella variabile errno. Poi restituisce −1, il segnale che il programma in C si aspetta. Chi vuole sapere che cosa è andato storto legge errno.') + ' In entrambi i casi RCX e R11 contengono ora valori scritti dal processore.',
        { calc: OK ? 'valore restituito = 0x7F0000' : 'errno = 22 · valore restituito = −1', esito: [U.SIS[k], 'si'] });
      return { passi, esito: U.SIS[k] };
    }
  },
  bilancio: {
    regola: [
      'In una chiamata di sistema il numero del servizio sta in RAX e gli argomenti in RDI, RSI, RDX, R10, R8 e R9. Rispetto alle funzioni cambia soltanto il quarto registro, perché SYSCALL sovrascrive RCX.',
      'Il kernel segnala un errore restituendo in RAX un numero fra −4095 e −1. La funzione di raccordo conserva il codice in errno e restituisce −1.'
    ],
    errori: [
      ['Lasciare il quarto argomento in RCX.', 'Quando il kernel prende il controllo, RCX contiene l’indirizzo di ripresa. Il quarto argomento va copiato in R10.'],
      ['Trattare come errore ogni valore diverso da zero.', 'Molti servizi restituiscono numeri positivi utili: byte scritti, indirizzi, PID. Sono errori soltanto i valori fra −4095 e −1.'],
      ['Cercare il codice dell’errore nel valore restituito dalla funzione C.', 'La funzione di raccordo restituisce sempre −1 in caso di errore. Il codice sta in errno.']
    ],
    saFare: ['Elenco i registri degli argomenti di una chiamata di sistema.', 'Spiego perché il quarto argomento usa R10.', 'Riconosco un errore dal valore restituito in RAX.'],
    esercizi: [
      { d: 'Dopo una chiamata di sistema RAX contiene −13. Quale codice di errore conserverà in errno la funzione di raccordo?', segnaposto: 'Un numero', giuste: ['13', 'tredici'],
        ok: 'Il valore sta fra −4095 e −1, quindi è un errore. Il codice è il valore cambiato di segno: 13.',
        diagnosi: [
          { se: ['-13', '−13'], msg: 'Questo è il valore restituito dal kernel. In errno va il codice positivo, ottenuto cambiando segno.' },
          { se: ['-1', '−1'], msg: 'Meno uno è il valore che la funzione di raccordo restituisce al programma. In errno conserva il codice dell’errore.' },
          { se: ['0'], msg: 'Zero vorrebbe dire nessun errore. Un valore fra −4095 e −1 è un errore, e il codice è il suo valore assoluto.' }
        ],
        altro: 'Il codice è diverso. Il kernel restituisce il codice dell’errore cambiato di segno.',
        indizi: ['Un valore fra −4095 e −1 indica un errore.', 'Il codice dell’errore è il valore assoluto del numero restituito.', 'Il valore assoluto di −13.'],
        svolgimento: ['RAX = −13: cade fra −4095 e −1, quindi è un errore.', 'La funzione di raccordo cambia segno: 13.', 'errno = 13, e al programma arriva −1.'] },
      { d: 'Un programma in assembly vuole eseguire da sé una chiamata di sistema con quattro argomenti. In quali registri li deve mettere, dal primo al quarto?', guida: 'Scegli la risposta.', o: [
        { t: 'RDI, RSI, RDX, R10', ok: true, fb: 'I primi tre coincidono con quelli delle funzioni. Il quarto va in R10, perché SYSCALL sovrascrive RCX.' },
        { t: 'RDI, RSI, RDX, RCX', fb: 'Questo è l’ordine delle funzioni. SYSCALL scrive in RCX l’indirizzo di ripresa, e il quarto argomento andrebbe perduto.' },
        { t: 'RAX, RDI, RSI, RDX', fb: 'RAX contiene il numero del servizio, che è un’informazione a parte. Gli argomenti cominciano da RDI.' }] }
    ],
    sfida: ['cslez2_5_04_random_assembly_04', 'Valori restituiti e trasferimenti di zero byte']
  }
});
SL.unita252 = { FUN: ['RDI', 'RSI', 'RDX', 'RCX', 'R8', 'R9'], SIS: ['RDI', 'RSI', 'RDX', 'R10', 'R8', 'R9'] };
