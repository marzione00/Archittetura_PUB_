'use strict';
SL.registra('3.3.4', {
  titolo: 'Classi di istruzioni, stato e controllo',
  obiettivo: 'Obiettivo: dire quale codice di stato produce un’istruzione, e stabilire se un accesso di otto byte rientra per intero nella memoria disponibile.',
  concetti: [['scudo', 'Quattro esiti possibili'], ['memory', 'I due estremi di una parola'], ['conflitto', 'Un errore blocca le scritture']],
  filigrana: ['scudo', 'memory', 'conflitto'],
  richiami: {
    carte: [
      { sim: 'cpu', da: 'Dall’unità 3.3.1', t: 'Il codice di stato', d: 'Fa parte dello stato visibile di Y86-64, e dice se il programma procede regolarmente.' },
      { sim: 'memory', da: 'Dall’unità 3.3.3', t: 'Otto celle per parola', d: 'Una lettura o una scrittura di 64 bit usa le celle da valE a valE + 7.' },
      { sim: 'lente', da: 'Dall’unità 2.7.7', t: 'Il controllo prima della scrittura', d: 'Un controllo dei limiti va eseguito prima di scrivere, e in caso di fallimento nulla deve essere scritto.' }
    ],
    domanda: { d: 'Prima di proseguire: una memoria ha 64 celle, numerate da 0 a 63. Una parola di otto byte comincia alla cella 56. Qual è la sua ultima cella?', o: [
      { t: '63', ok: true, fb: 'Otto celle a partire da 56: l’ultima è 56 + 7 = 63.' },
      { t: '64', fb: 'La prima cella è la 56 stessa, quindi l’ottava è 56 + 7.' },
      { t: '56', fb: 'La cella 56 è la prima delle otto. La parola continua nelle sette successive.' }
    ] }
  },
  idea: {
    titolo: 'Quando un’istruzione non può andare a buon fine',
    termini: ['aok', 'hlt', 'adr', 'ins'],
    testo: [
      'Finora ogni istruzione è andata a buon fine. Un processore deve sapere che cosa fare anche negli altri casi, e deve dichiararlo in modo che il resto del sistema se ne accorga. Y86-64 lo fa con il codice di stato, abbreviato Stat, che assume uno fra quattro valori.',
      'Il valore [[aok|AOK]] è il caso normale: l’istruzione è stata eseguita e si prosegue. [[hlt|HLT]] segnala che il programma ha eseguito `halt`, l’istruzione di arresto. [[adr|ADR]] segnala un indirizzo fuori dalla memoria disponibile, incontrato leggendo l’istruzione oppure accedendo ai dati. [[ins|INS]] segnala un primo byte che non corrisponde ad alcuna classe di istruzioni.',
      'I due errori si scoprono in fasi diverse. INS si scopre nel prelievo, appena letto il primo byte: le classi valide hanno icode da 0 a B. ADR per un dato si scopre nella fase di memoria, quando l’indirizzo valE è noto.',
      'Il controllo dell’indirizzo riguarda entrambi gli estremi della parola. Un accesso di otto byte che comincia a valE usa le celle fino a valE + 7, e devono esistere tutte. In una memoria di 64 celle, numerate da 0 a 63, l’ultimo inizio valido è 56.',
      { fig: 'celle', titolo: 'La fine di una memoria di 64 celle', nota: 'Un accesso da 56 usa le celle in evidenza. Un accesso da 57 avrebbe bisogno anche della cella 64, che non esiste.', celle: [
        { so: '55', v: '·' }, { so: '56', v: '·', st: 'on' }, { so: '57', v: '·', st: 'on' }, { so: '58', v: '·', st: 'on' }, { so: '59', v: '·', st: 'on' }, { so: '60', v: '·', st: 'on' }, { so: '61', v: '·', st: 'on' }, { so: '62', v: '·', st: 'on' }, { so: '63', v: '·', st: 'on' }, { so: '64', v: '×', st: 'amb' }] },
      'Con uno stato diverso da AOK il processore si ferma. L’istruzione che ha provocato l’errore deve restare senza effetti: nessun registro e nessuna cella vengono scritti. Il codice di stato comanda quindi le abilitazioni di scrittura dell’unità 3.2.3, e le tiene a 0 quando qualcosa è andato storto.'
    ]
  },
  esperimento: {
    faremo: [
      'La memoria dei dati ha 64 celle, numerate da 0 a 63. Sceglierai l’istruzione da eseguire e il valore di %rbx, che fa da indirizzo.',
      'Seguiremo i due controlli, quello sul primo byte e quello sull’indirizzo, e vedremo quali scritture restano abilitate. Dopo il caso proposto prova con %rbx = 56, e poi con `halt`.'
    ],
    vedrai: [
      ['hex', 'Il primo byte', 'In alto a sinistra: il codice dell’istruzione e la sua classe.'],
      ['memory', 'Le celle richieste', 'Al centro: un tratto della memoria, con le celle che l’accesso userebbe.'],
      ['scudo', 'Scritture e stato', 'In basso: l’abilitazione di scrittura e il codice di stato.']
    ]
  },
  lab: {
    titolo: 'Quattro esiti',
    scena: { w: 860, h: 300 },
    atti: ['Il prelievo', 'L’istruzione è valida', 'L’indirizzo è valido', 'Le scritture', 'Il codice di stato'],
    controlli: [
      { id: 'op', tipo: 'scelta', eti: 'Istruzione', opzioni: [['mrmovq', 'mrmovq 0(%rbx), %rax'], ['rmmovq', 'rmmovq %rax, 0(%rbx)'], ['halt', 'halt'], ['ris', 'primo byte F0']], valore: 'mrmovq' },
      { id: 'a', tipo: 'scelta', eti: '%rbx', opzioni: [[40, '40'], [56, '56'], [57, '57'], [63, '63'], [64, '64']], valore: 57 }
    ],
    nota: 'I passi sono sempre cinque. La memoria dei dati ha 64 celle, da 0 a 63.',
    previsione: {
      domanda: (p) => 'La memoria dei dati ha 64 celle, numerate da 0 a 63, e %rbx vale ' + p.a + '. ' + SL.unita334.DESCR[p.op] + ' Quale codice di stato ne risulta?',
      opzioni: () => ['AOK', 'HLT', 'ADR', 'INS']
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Il codice di stato è ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'INS' ? 'Il primo byte F0 ha icode F, che non corrisponde ad alcuna classe.' : esito === 'HLT' ? '`halt` è un’istruzione valida, che chiede l’arresto.' : esito === 'ADR' ? 'L’accesso userebbe le celle da ' + p.a + ' a ' + (p.a + 7) + ', e la memoria finisce alla cella 63.' : 'Le celle da ' + p.a + ' a ' + (p.a + 7) + ' esistono tutte, e l’istruzione va a buon fine.'),
    costruisci(p) {
      const el = SL.el, U = SL.unita334, passi = [], op = p.op, a = p.a, mem = op === 'mrmovq' || op === 'rmmovq', B0 = { mrmovq: '50', rmmovq: '40', halt: '00', ris: 'F0' }[op];
      const fuori = mem && a + 7 > 63, stat = op === 'ris' ? 'INS' : op === 'halt' ? 'HLT' : fuori ? 'ADR' : 'AOK', s0 = a <= 44 ? a - 2 : 54;
      const st = { cls: false, ind: false, scr: false, fine: false };
      const quadro = (o) => {
        const els = [el.box('b0', 20, 8, 150, 68, 'primo byte', B0, o.byte ? 'att' : 'on', { cls: 'stretta' }),
          el.box('b1', 180, 8, 250, 68, 'classe', !st.cls ? '·' : op === 'ris' ? 'nessuna' : op, !st.cls ? '' : op === 'ris' ? 'err' : o.cls ? 'att' : 'on', { cls: 'stretta' }),
          el.box('b2', 440, 8, 200, 68, '%rbx', String(a), mem && o.ind ? 'att' : mem ? 'on' : '', { cls: 'stretta' }),
          el.box('b3', 650, 8, 196, 68, 'celle richieste', !st.ind ? '·' : mem ? 'da ' + a + ' a ' + (a + 7) : 'nessuna', !st.ind ? '' : fuori ? 'err' : mem ? 'on' : 'off', { cls: 'stretta' }),
          el.nota('tm', 20, 94, 'MEMORIA DEI DATI', 'mono')];
        for (let k = 0; k < 12; k++) {
          const c = s0 + k, esiste = c <= 63, usata = mem && st.ind && c >= a && c <= a + 7;
          els.push(el.cella('m' + k, 20 + k * 68, 142, 62, 42, esiste ? '·' : '×', usata ? (esiste ? (o.ind ? 'att' : 'on') : 'err') : esiste ? '' : 'off', { piccola: true, cls: 'minuta', so: String(c) }));
        }
        if (s0 + 11 >= 64) els.push(el.nota('nf', 640, 94, 'ultima cella: 63', 'mono minuta'));
        els.push(el.box('b4', 20, 222, 400, 68, op === 'rmmovq' ? 'scrittura in memoria' : 'scrittura in %rax', !st.scr ? '·' : !mem ? 'nessuna richiesta' : stat === 'AOK' ? 'abilitata' : 'bloccata', !st.scr ? '' : !mem ? 'off' : stat === 'AOK' ? (o.scr ? 'att' : 'on') : 'err', { cls: 'stretta' }),
          el.box('b5', 440, 222, 406, 68, 'codice di stato', st.fine ? stat : '·', !st.fine ? '' : stat === 'AOK' ? 'att' : stat === 'HLT' ? 'on' : 'err', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Primo byte', B0, 'a'], ['Celle', !st.ind ? '·' : mem ? 'da ' + a + ' a ' + (a + 7) : 'nessuna'], ['Stat', st.fine ? stat : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ byte: true }, 0, 'Il primo byte', 'Il processore preleva il primo byte dell’istruzione, che vale ' + B0 + '. La cifra alta, ' + B0[0] + ', è icode.',
        { chiedi: { d: 'Le classi valide hanno icode da 0 a B. Il primo byte ' + B0 + ' indica un’istruzione valida?', o: ['Sì', 'No'], g: op === 'ris' ? 1 : 0, no: 'L’icode è la cifra alta, ' + B0[0] + (op === 'ris' ? ', e nessuna classe ha questo numero.' : ', che corrisponde a una classe esistente.') } });
      st.cls = true;
      P({ cls: true }, 1, op === 'ris' ? 'Nessuna classe corrisponde' : 'Una classe esiste', op === 'ris' ? 'L’icode F non corrisponde ad alcuna classe. Al processore mancano le informazioni per proseguire, perché ignora quanti byte seguono e che cosa farne. L’istruzione è invalida, e lo si sa già nel prelievo. Le fasi successive non dovranno produrre effetti.' : op === 'halt' ? 'L’icode 0 è la classe di `halt`, un’istruzione valida di un solo byte. Chiede al processore di fermarsi, senza leggere né scrivere dati.' : 'L’icode ' + B0[0] + ' è la classe di `' + op + '`, un’istruzione valida che accede alla memoria dei dati. L’indirizzo sarà valE = %rbx + 0 = ' + a + '.',
        { calc: op === 'ris' ? 'icode F: istruzione invalida' : 'icode ' + B0[0] + ': ' + op, chiedi: mem ? { d: 'L’accesso comincia alla cella ' + a + ' e occupa otto celle. Qual è l’ultima?', o: [a, a + 7, a + 8].map(String), g: 1, no: 'La prima cella è la ' + a + ' stessa, quindi l’ottava è ' + a + ' + 7 = ' + (a + 7) + '.' } : null });
      if (!passi[passi.length - 1].chiedi) delete passi[passi.length - 1].chiedi;
      st.ind = true;
      P({ ind: true }, 2, !mem ? 'Nessun accesso ai dati' : fuori ? 'L’accesso esce dalla memoria' : 'L’accesso rientra nella memoria', !mem ? (op === 'halt' ? '`halt` non accede alla memoria dei dati, quindi sull’indirizzo non c’è nulla da controllare. Il valore di %rbx è irrilevante.' : 'L’istruzione è invalida, e nessun accesso ai dati viene tentato. Il valore di %rbx è irrilevante.') : 'L’accesso userebbe le celle da ' + a + ' a ' + (a + 7) + '. ' + (fuori ? (a > 63 ? 'La memoria finisce alla cella 63, e nessuna di queste celle esiste.' : 'La memoria finisce alla cella 63: la prima cella esiste, ' + (a + 7 - 63 === 1 ? 'l’ultima no.' : 'le ultime ' + (a + 7 - 63) + ' no.') + ' L’accesso è invalido per intero.') : 'Esistono tutte, perché ' + (a + 7) + ' non supera 63.' + (a === 56 ? ' È l’ultimo inizio possibile.' : '')),
        { calc: mem ? a + ' + 7 = ' + (a + 7) + (fuori ? ' > 63' : ' ≤ 63') : 'nessun indirizzo da controllare' });
      st.scr = true;
      P({ scr: true }, 3, !mem ? 'Nessuna scrittura' : stat === 'AOK' ? 'La scrittura è abilitata' : 'La scrittura è bloccata', !mem ? 'Questa istruzione non scrive né registri né celle. Lo stato del programma resta com’era.' : stat === 'AOK' ? (op === 'mrmovq' ? 'La memoria consegna la parola valM, e l’abilitazione di scrittura del banco dei registri vale 1: al fronte %rax riceverà valM.' : 'L’abilitazione di scrittura della memoria vale 1: al fronte le otto celle riceveranno il contenuto di %rax.') : (op === 'mrmovq' ? 'La memoria non può consegnare una parola intera. L’abilitazione di scrittura del banco vale 0, e %rax conserva il valore che aveva.' : 'L’abilitazione di scrittura della memoria vale 0. Nessuna cella viene modificata, nemmeno quelle che esistono.'),
        { calc: !mem ? 'nessuna scrittura' : 'abilitazione = ' + (stat === 'AOK' ? 1 : 0) });
      st.fine = true;
      P({}, 4, 'Stat = ' + stat, stat === 'AOK' ? 'L’istruzione è andata a buon fine. Il codice di stato vale AOK, e il processore prosegue con l’istruzione all’indirizzo valP.' : stat === 'HLT' ? 'Il codice di stato vale HLT. Il processore si ferma perché il programma lo ha chiesto: è una conclusione regolare.' : stat === 'ADR' ? 'Il codice di stato vale ADR, errore di indirizzo. Il processore si ferma, e lo stato visibile è quello che precedeva l’istruzione. Chi esamina il programma trova tutto com’era un istante prima dell’errore.' : 'Il codice di stato vale INS, istruzione invalida. Il processore si ferma senza avere modificato nulla.',
        { calc: 'Stat = ' + stat, esito: ['Stat = ' + stat, stat === 'AOK' ? 'si' : stat === 'HLT' ? '' : 'no'] });
      return { passi, esito: stat };
    }
  },
  bilancio: {
    regola: [
      'Il codice di stato vale AOK quando l’istruzione va a buon fine, HLT dopo `halt`, ADR per un indirizzo fuori dalla memoria, INS per un primo byte che non corrisponde ad alcuna classe.',
      'Un accesso di otto byte è valido soltanto se esistono tutte le celle da valE a valE + 7. Con uno stato diverso da AOK il processore si ferma, e l’istruzione resta senza effetti.'
    ],
    errori: [
      ['Controllare soltanto la prima cella.', 'In una memoria di 64 celle un accesso da 57 parte da una cella che esiste e finirebbe alla 64, che manca.'],
      ['Trattare HLT come un errore.', '`halt` è un’istruzione valida: il programma ha chiesto di fermarsi, e lo stato lo registra.'],
      ['Lasciare scrivere l’istruzione sbagliata.', 'Con ADR o INS le abilitazioni di scrittura restano a 0, altrimenti lo stato visibile mescolerebbe il prima e il dopo dell’errore.']
    ],
    saFare: ['Associare a ogni situazione il suo codice di stato.', 'Verificare che un accesso di otto byte stia per intero nella memoria.', 'Spiegare perché un errore blocca le scritture dell’istruzione.'],
    esercizi: [
      { d: 'Una memoria ha 256 celle, numerate da 0 a 255. Qual è l’indirizzo più alto da cui può cominciare un accesso di otto byte?', segnaposto: 'Un numero', giuste: ['248', 'duecentoquarantotto'],
        ok: 'L’ultima cella usata è valE + 7, e deve valere al massimo 255: valE = 248.',
        diagnosi: [
          { se: ['255'], msg: 'Da 255 la prima cella esiste, ma le sette successive no.' },
          { se: ['247'], msg: 'Da 247 l’accesso finisce alla cella 254. C’è posto per cominciare una cella più avanti.' },
          { se: ['249'], msg: 'Da 249 l’accesso finirebbe alla cella 256, che non esiste.' }
        ],
        altro: 'Il numero è diverso. L’ultima cella usata, valE + 7, deve essere al massimo 255.',
        indizi: ['L’accesso usa le celle da valE a valE + 7.', 'Deve valere valE + 7 ≤ 255.', '255 − 7.'],
        svolgimento: ['Ultima cella usata: valE + 7.', 'Condizione: valE + 7 ≤ 255.', 'valE massimo: 255 − 7 = 248.'] },
      { d: 'Il primo byte di un’istruzione vale 00. Quale codice di stato ne risulta?', guida: 'Si scelga la risposta.', o: [
        { t: 'HLT', ok: true, fb: 'Il byte 00 ha icode 0, la classe di `halt`.' },
        { t: 'INS', fb: 'L’icode 0 corrisponde a una classe esistente, quella di `halt`.' },
        { t: 'AOK', fb: 'AOK accompagna le istruzioni dopo le quali si prosegue. `halt` chiede l’arresto.' },
        { t: 'ADR', fb: '`halt` non accede alla memoria dei dati, quindi nessun indirizzo può risultare invalido.' }] }
    ],
    sfida: ['cslez3_3_01_random_assembly', 'Decodificare icode e ifun']
  }
});
SL.unita334 = { DESCR: { mrmovq: 'Si esegue `mrmovq 0(%rbx), %rax`.', rmmovq: 'Si esegue `rmmovq %rax, 0(%rbx)`.', halt: 'Si esegue `halt`.', ris: 'Il primo byte dell’istruzione vale F0.' } };
