'use strict';
SL.registra('3.3.4', {
  titolo: 'Categorie di istruzioni, stato e controllo',
  obiettivo: 'Obiettivo: indicare il codice di stato prodotto da un’istruzione, e stabilire se un accesso di otto byte rientra per intero nella memoria disponibile.',
  concetti: [['scudo', 'Quattro esiti possibili'], ['memory', 'I due estremi di una parola'], ['conflitto', 'Un errore blocca le scritture']],
  filigrana: ['scudo', 'memory', 'conflitto'],
  richiami: {
    carte: [
      { sim: 'cpu', da: 'Dall’unità 3.3.1', t: 'Il codice di stato', d: 'Fa parte dello stato della CPU del caso di studio, e indica se l’esecuzione procede regolarmente.' },
      { sim: 'memory', da: 'Dall’unità 3.3.3', t: 'Otto celle per parola', d: 'Una lettura o una scrittura di 64 bit impiega le celle da valE a valE + 7.' },
      { sim: 'register', da: 'Dall’unità 3.2.3', t: 'L’abilitazione di scrittura', d: 'Un registro o una cella cambiano al fronte soltanto se la loro abilitazione di scrittura vale 1.' }
    ],
    domanda: { d: 'Prima di proseguire: una memoria ha 64 celle, numerate da 0 a 63. Una parola di otto byte ha inizio alla cella 56. Qual è la sua ultima cella?', o: [
      { t: '63', ok: true, fb: 'Otto celle a partire da 56: l’ultima è 56 + 7 = 63.' },
      { t: '64', fb: 'La prima cella è la 56 stessa, quindi l’ottava è 56 + 7.' },
      { t: '56', fb: 'La cella 56 è la prima delle otto. La parola prosegue nelle sette successive.' }
    ] }
  },
  idea: {
    titolo: 'Le istruzioni che non possono essere completate',
    termini: ['saok', 'shlt', 'sadr', 'sins'],
    testo: [
      'Fino a questo punto ogni istruzione è stata completata regolarmente. La CPU deve trattare anche gli altri casi, e deve segnalarli in modo che il resto del sistema ne sia informato. A tale scopo essa imposta il codice di stato, che assume uno fra quattro valori.',
      'Il valore [[saok|SAOK]] è il caso normale: l’istruzione è stata eseguita e l’esecuzione prosegue. [[shlt|SHLT]] segnala che il programma ha eseguito `halt`, l’istruzione di arresto. [[sadr|SADR]] segnala un indirizzo esterno alla memoria disponibile, incontrato nella lettura dell’istruzione oppure nell’accesso ai dati. [[sins|SINS]] segnala un codice operativo non previsto, cioè un primo byte al quale non corrisponde alcuna categoria di istruzioni.',
      'I due errori sono rilevati in fasi diverse. SINS è rilevato nel prelievo, alla lettura del primo byte: le categorie previste hanno icode da 0 a 7. SADR per un dato è rilevato nella fase di memoria, quando l’indirizzo valE è noto.',
      'Il controllo dell’indirizzo riguarda entrambi gli estremi della parola. Un accesso di otto byte che ha inizio a valE impiega le celle fino a valE + 7, e tutte devono esistere. In una memoria di 64 celle, numerate da 0 a 63, l’ultimo inizio valido è 56.',
      { fig: 'celle', titolo: 'La fine di una memoria di 64 celle', nota: 'Un accesso da 56 impiega le celle in evidenza. Un accesso da 57 richiederebbe anche la cella 64, che è inesistente.', celle: [
        { so: '55', v: '·' }, { so: '56', v: '·', st: 'on' }, { so: '57', v: '·', st: 'on' }, { so: '58', v: '·', st: 'on' }, { so: '59', v: '·', st: 'on' }, { so: '60', v: '·', st: 'on' }, { so: '61', v: '·', st: 'on' }, { so: '62', v: '·', st: 'on' }, { so: '63', v: '·', st: 'on' }, { so: '64', v: '×', st: 'amb' }] },
      'Con uno stato diverso da SAOK la sequenza normale si interrompe. Con SHLT la CPU si arresta; con un errore il PC riceve l’indirizzo del codice che gestisce l’eccezione, oggetto del Modulo IV. L’istruzione che ha provocato l’errore deve restare priva di effetti: nessun registro e nessuna cella sono scritti. Il codice di stato comanda quindi le abilitazioni di scrittura dell’unità 3.2.3, e le mantiene a 0 in presenza di un errore.'
    ]
  },
  esperimento: {
    faremo: [
      'La memoria dei dati ha 64 celle, numerate da 0 a 63. I controlli fissano l’istruzione da eseguire e il valore di RBX, impiegato come indirizzo.',
      'Si seguono i due controlli, quello sul primo byte e quello sull’indirizzo, e si osserva quali scritture restano abilitate. Dopo il caso proposto, è istruttivo esaminare RBX = 56 e poi `halt`.'
    ],
    vedrai: [
      ['hex', 'Il primo byte', 'In alto a sinistra: il codice dell’istruzione e la sua categoria.'],
      ['memory', 'Le celle richieste', 'Al centro: un tratto della memoria, con le celle che l’accesso impiegherebbe.'],
      ['scudo', 'Scritture e stato', 'In basso: l’abilitazione di scrittura e il codice di stato.']
    ]
  },
  lab: {
    titolo: 'Quattro esiti',
    scena: { w: 860, h: 300 },
    atti: ['Il prelievo', 'L’istruzione è valida', 'L’indirizzo è valido', 'Le scritture', 'Il codice di stato'],
    controlli: [
      { id: 'op', tipo: 'scelta', eti: 'Istruzione', opzioni: [['mr', 'mov rax, 0(rbx)'], ['rm', 'mov 0(rbx), rax'], ['halt', 'halt'], ['ris', 'primo byte F0']], valore: 'mr' },
      { id: 'a', tipo: 'scelta', eti: 'RBX', opzioni: [[40, '40'], [56, '56'], [57, '57'], [63, '63'], [64, '64']], valore: 57 }
    ],
    nota: 'I passi sono sempre cinque. La memoria dei dati ha 64 celle, da 0 a 63.',
    previsione: {
      domanda: (p) => 'La memoria dei dati ha 64 celle, numerate da 0 a 63, e RBX vale ' + p.a + '. ' + SL.unita334.DESCR[p.op] + ' Quale codice di stato ne risulta?',
      opzioni: () => ['SAOK', 'SHLT', 'SADR', 'SINS']
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Il codice di stato è ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'SINS' ? 'Il primo byte F0 ha icode F, al quale non corrisponde alcuna categoria.' : esito === 'SHLT' ? '`halt` è un’istruzione valida, che richiede l’arresto.' : esito === 'SADR' ? 'L’accesso impiegherebbe le celle da ' + p.a + ' a ' + (p.a + 7) + ', e la memoria termina alla cella 63.' : 'Le celle da ' + p.a + ' a ' + (p.a + 7) + ' esistono tutte, e l’istruzione è completata.'),
    costruisci(p) {
      const el = SL.el, passi = [], op = p.op, a = p.a, mem = op === 'mr' || op === 'rm', B0 = { mr: '40', rm: '50', halt: '00', ris: 'F0' }[op];
      const fuori = mem && a + 7 > 63, stat = op === 'ris' ? 'SINS' : op === 'halt' ? 'SHLT' : fuori ? 'SADR' : 'SAOK', s0 = a <= 44 ? a - 2 : 54;
      const st = { cls: false, ind: false, scr: false, fine: false };
      const quadro = (o) => {
        const els = [el.box('b0', 20, 8, 150, 68, 'primo byte', B0, o.byte ? 'att' : 'on', { cls: 'stretta' }),
          el.box('b1', 180, 8, 250, 68, 'categoria', !st.cls ? '·' : op === 'ris' ? 'nessuna' : SL.isa.FORMA[op], !st.cls ? '' : op === 'ris' ? 'err' : o.cls ? 'att' : 'on', { cls: 'stretta' }),
          el.box('b2', 440, 8, 200, 68, 'RBX', String(a), mem && o.ind ? 'att' : mem ? 'on' : '', { cls: 'stretta' }),
          el.box('b3', 650, 8, 196, 68, 'celle richieste', !st.ind ? '·' : mem ? 'da ' + a + ' a ' + (a + 7) : 'nessuna', !st.ind ? '' : fuori ? 'err' : mem ? 'on' : 'off', { cls: 'stretta' }),
          el.nota('tm', 20, 94, 'MEMORIA DEI DATI', 'mono')];
        for (let k = 0; k < 12; k++) {
          const c = s0 + k, esiste = c <= 63, usata = mem && st.ind && c >= a && c <= a + 7;
          els.push(el.cella('m' + k, 20 + k * 68, 142, 62, 42, esiste ? '·' : '×', usata ? (esiste ? (o.ind ? 'att' : 'on') : 'err') : esiste ? '' : 'off', { piccola: true, cls: 'minuta', so: String(c) }));
        }
        if (s0 + 11 >= 64) els.push(el.nota('nf', 640, 94, 'ultima cella: 63', 'mono minuta'));
        els.push(el.box('b4', 20, 222, 400, 68, op === 'rm' ? 'scrittura in memoria' : 'scrittura in RAX', !st.scr ? '·' : !mem ? 'nessuna richiesta' : stat === 'SAOK' ? 'abilitata' : 'bloccata', !st.scr ? '' : !mem ? 'off' : stat === 'SAOK' ? (o.scr ? 'att' : 'on') : 'err', { cls: 'stretta' }),
          el.box('b5', 440, 222, 406, 68, 'codice di stato', st.fine ? stat : '·', !st.fine ? '' : stat === 'SAOK' ? 'att' : stat === 'SHLT' ? 'on' : 'err', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Primo byte', B0, 'a'], ['Celle', !st.ind ? '·' : mem ? 'da ' + a + ' a ' + (a + 7) : 'nessuna'], ['Stat', st.fine ? stat : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ byte: true }, 0, 'Il primo byte', 'La CPU preleva il primo byte dell’istruzione, che vale ' + B0 + '. La cifra alta, ' + B0[0] + ', è icode.',
        { chiedi: { d: 'Le categorie previste hanno icode da 0 a 7. Il primo byte ' + B0 + ' indica un’istruzione valida?', o: ['Sì', 'No'], g: op === 'ris' ? 1 : 0, no: 'L’icode è la cifra alta, ' + B0[0] + (op === 'ris' ? ', e nessuna categoria ha questo numero.' : ', che corrisponde a una categoria prevista.') } });
      st.cls = true;
      P({ cls: true }, 1, op === 'ris' ? 'Nessuna categoria corrisponde' : 'Una categoria esiste', op === 'ris' ? 'All’icode F non corrisponde alcuna categoria. Alla CPU mancano le informazioni per proseguire, poiché ignora quanti byte seguono e come trattarli. L’istruzione è invalida, e ciò è noto già nel prelievo. Le fasi successive devono restare prive di effetti.' : op === 'halt' ? 'L’icode 0 è la categoria di `halt`, un’istruzione valida di un solo byte. Essa richiede l’arresto della CPU, senza letture né scritture di dati.' : 'L’icode ' + B0[0] + ' è la categoria di `' + SL.isa.FORMA[op] + '`, un’istruzione valida che ' + (op === 'mr' ? 'legge' : 'scrive') + ' la memoria dei dati. L’indirizzo sarà valE = RBX + 0 = ' + a + '.',
        { calc: op === 'ris' ? 'icode F: istruzione invalida' : 'icode ' + B0[0] + ': ' + SL.isa.FORMA[op], chiedi: mem ? { d: 'L’accesso ha inizio alla cella ' + a + ' e occupa otto celle. Qual è l’ultima?', o: [a, a + 7, a + 8].map(String), g: 1, no: 'La prima cella è la ' + a + ' stessa, quindi l’ottava è ' + a + ' + 7 = ' + (a + 7) + '.' } : null });
      if (!passi[passi.length - 1].chiedi) delete passi[passi.length - 1].chiedi;
      st.ind = true;
      P({ ind: true }, 2, !mem ? 'Nessun accesso ai dati' : fuori ? 'L’accesso eccede la memoria' : 'L’accesso rientra nella memoria', !mem ? (op === 'halt' ? '`halt` è priva di accessi alla memoria dei dati, quindi nessun indirizzo richiede un controllo. Il valore di RBX è irrilevante.' : 'L’istruzione è invalida, e nessun accesso ai dati è tentato. Il valore di RBX è irrilevante.') : 'L’accesso impiegherebbe le celle da ' + a + ' a ' + (a + 7) + '. ' + (fuori ? (a > 63 ? 'La memoria termina alla cella 63, e nessuna di queste celle esiste.' : 'La memoria termina alla cella 63: la prima cella esiste, ' + (a + 7 - 63 === 1 ? 'mentre l’ultima è inesistente.' : 'le ultime ' + (a + 7 - 63) + ' no.') + ' L’accesso è invalido per intero.') : 'Esistono tutte, poiché ' + (a + 7) + ' rientra nel limite di 63.' + (a === 56 ? ' Si tratta dell’ultimo inizio possibile.' : '')),
        { calc: mem ? a + ' + 7 = ' + (a + 7) + (fuori ? ' > 63' : ' ≤ 63') : 'nessun indirizzo da controllare' });
      st.scr = true;
      P({ scr: true }, 3, !mem ? 'Nessuna scrittura' : stat === 'SAOK' ? 'La scrittura è abilitata' : 'La scrittura è bloccata', !mem ? 'Questa istruzione è priva di scritture, sia nei registri sia nelle celle. Lo stato del programma resta invariato.' : stat === 'SAOK' ? (op === 'mr' ? 'La memoria fornisce la parola valM, e l’abilitazione di scrittura del banco dei registri vale 1: al fronte RAX riceverà valM.' : 'L’abilitazione di scrittura della memoria vale 1: al fronte le otto celle riceveranno il contenuto di RAX.') : (op === 'mr' ? 'La memoria non può fornire una parola intera. L’abilitazione di scrittura del banco vale 0, e RAX conserva il valore precedente.' : 'L’abilitazione di scrittura della memoria vale 0. Nessuna cella è modificata, comprese quelle esistenti.'),
        { calc: !mem ? 'nessuna scrittura' : 'abilitazione = ' + (stat === 'SAOK' ? 1 : 0) });
      st.fine = true;
      P({}, 4, 'Stat = ' + stat, stat === 'SAOK' ? 'L’istruzione è stata completata. Il codice di stato vale SAOK, e la CPU prosegue con l’istruzione all’indirizzo valP.' : stat === 'SHLT' ? 'Il codice di stato vale SHLT. La CPU si arresta su richiesta del programma: è una conclusione regolare.' : stat === 'SADR' ? 'Il codice di stato vale SADR, errore di indirizzo. La sequenza normale si interrompe: lo stato visibile è quello che precedeva l’istruzione, e il PC riceverà l’indirizzo del codice che gestisce l’eccezione.' : 'Il codice di stato vale SINS, istruzione invalida. La sequenza normale si interrompe senza alcuna modifica dello stato, e il PC riceverà l’indirizzo del codice che gestisce l’eccezione.',
        { calc: 'Stat = ' + stat, esito: ['Stat = ' + stat, stat === 'SAOK' ? 'si' : stat === 'SHLT' ? '' : 'no'] });
      return { passi, esito: stat };
    }
  },
  bilancio: {
    regola: [
      'Il codice di stato vale SAOK quando l’istruzione è completata, SHLT dopo `halt`, SADR per un indirizzo esterno alla memoria, SINS per un primo byte al quale non corrisponde alcuna categoria.',
      'Un accesso di otto byte è valido soltanto se esistono tutte le celle da valE a valE + 7. Con uno stato diverso da SAOK la sequenza normale si interrompe, e l’istruzione resta priva di effetti.'
    ],
    errori: [
      ['Controllare soltanto la prima cella.', 'In una memoria di 64 celle un accesso da 57 parte da una cella esistente e terminerebbe alla 64, che manca.'],
      ['Trattare SHLT come un errore.', '`halt` è un’istruzione valida: il programma ha richiesto l’arresto, e lo stato lo registra.'],
      ['Consentire le scritture dell’istruzione errata.', 'Con SADR o SINS le abilitazioni di scrittura restano a 0; in caso contrario lo stato visibile conterrebbe insieme valori precedenti e successivi all’errore.']
    ],
    saFare: ['Associare a ogni situazione il suo codice di stato.', 'Verificare che un accesso di otto byte rientri per intero nella memoria.', 'Spiegare perché un errore blocca le scritture dell’istruzione.'],
    esercizi: [
      { d: 'Una memoria ha 256 celle, numerate da 0 a 255. Qual è l’indirizzo più alto dal quale può avere inizio un accesso di otto byte?', segnaposto: 'Un numero', giuste: ['248', 'duecentoquarantotto'],
        ok: 'L’ultima cella impiegata è valE + 7, e deve valere al massimo 255: valE = 248.',
        diagnosi: [
          { se: ['255'], msg: 'Da 255 la prima cella esiste, mentre le sette successive mancano.' },
          { se: ['247'], msg: 'Da 247 l’accesso termina alla cella 254. L’inizio può essere spostato di una cella in avanti.' },
          { se: ['249'], msg: 'Da 249 l’accesso terminerebbe alla cella 256, che è inesistente.' }
        ],
        altro: 'Il numero è diverso. L’ultima cella impiegata, valE + 7, deve essere al massimo 255.',
        indizi: ['L’accesso impiega le celle da valE a valE + 7.', 'Deve valere valE + 7 ≤ 255.', '255 − 7.'],
        svolgimento: ['Ultima cella impiegata: valE + 7.', 'Condizione: valE + 7 ≤ 255.', 'valE massimo: 255 − 7 = 248.'] },
      { d: 'Il primo byte di un’istruzione vale 00. Quale codice di stato ne risulta?', guida: 'Si scelga la risposta.', o: [
        { t: 'SHLT', ok: true, fb: 'Il byte 00 ha icode 0, la categoria di `halt`.' },
        { t: 'SINS', fb: 'L’icode 0 corrisponde a una categoria prevista, quella di `halt`.' },
        { t: 'SAOK', fb: 'SAOK accompagna le istruzioni dopo le quali l’esecuzione prosegue. `halt` richiede l’arresto.' },
        { t: 'SADR', fb: '`halt` è priva di accessi alla memoria dei dati, quindi nessun indirizzo può risultare invalido.' }] }
    ],
    sfida: ['cslez3_3_01_random_assembly', 'Decodificare icode e ifun']
  }
});
SL.unita334 = { DESCR: { mr: 'Si esegue `mov rax, 0(rbx)`.', rm: 'Si esegue `mov 0(rbx), rax`.', halt: 'Si esegue `halt`.', ris: 'Il primo byte dell’istruzione vale F0.' } };
