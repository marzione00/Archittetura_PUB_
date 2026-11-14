'use strict';
SL.registra('2.6.2', {
  titolo: 'Frame dello stack e trasferimenti di controllo',
  obiettivo: 'Obiettivo: seguire RSP e RIP dall’istruzione CALL all’istruzione RET, e indicare il contenuto di ogni cella del frame di una funzione.',
  concetti: [['puntatore', 'CALL e RET'], ['pila', 'Il frame'], ['register', 'Registri da conservare']],
  filigrana: ['pila', 'puntatore', 'register'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 2.6.1', t: 'CALL', d: 'L’istruzione deposita sulla pila l’indirizzo di ritorno, cioè l’indirizzo dell’istruzione che la segue, e salta alla funzione.' },
      { sim: 'pila', da: 'Dall’unità 2.6.1', t: 'PUSH', d: 'L’istruzione sottrae 8 a RSP e scrive un dato di otto byte nella nuova cima della pila.' },
      { sim: 'register', da: 'Dall’unità 2.1.1', t: 'RIP', d: 'Il registro che contiene l’indirizzo della prossima istruzione da eseguire.' }
    ],
    domanda: { d: 'Prima di proseguire: RSP vale 0x7FF0 e il programma esegue una CALL. Quanto vale RSP all’ingresso della funzione?', o: [
      { t: '0x7FE8', ok: true, fb: 'CALL deposita l’indirizzo di ritorno, un dato di otto byte: 0x7FF0 − 8 = 0x7FE8.' },
      { t: '0x7FF8', fb: 'La pila cresce verso gli indirizzi bassi. Il deposito di un dato fa diminuire RSP.' },
      { t: '0x7FF0', fb: 'CALL deposita sulla pila l’indirizzo di ritorno, e RSP scende di otto byte.' }
    ] }
  },
  idea: {
    titolo: 'Ogni chiamata ha la propria porzione di pila',
    termini: ['ret', 'pop', 'frame'],
    testo: [
      'CALL lascia in cima alla pila l’indirizzo di ritorno. L’istruzione [[ret|RET]] compie il percorso inverso: preleva dalla cima un indirizzo, lo scrive in RIP e aggiunge 8 a RSP. Il programma riprende dall’istruzione che seguiva la CALL.',
      'RET preleva gli otto byte presenti in cima, qualunque ne sia il contenuto, senza alcun controllo. Affinché il ritorno sia corretto, la funzione deve avere riportato RSP esattamente al valore lasciato da CALL.',
      'Durante la propria esecuzione una funzione impiega la pila per sé. Vi salva i registri che dovrà restituire invariati, e vi riserva lo spazio per le proprie variabili. L’istruzione [[pop|POP]] è l’inversa di PUSH: legge il dato in cima, lo scrive in un registro e aggiunge 8 a RSP. Lo spazio per le variabili è riservato sottraendo a RSP il numero di byte necessari, ed è restituito con la somma del medesimo numero.',
      'La porzione di pila che appartiene a una chiamata prende il nome di [[frame]]. Essa comprende l’indirizzo di ritorno, i registri salvati e lo spazio locale. Ogni chiamata in corso ha il proprio frame, e quello della funzione in esecuzione si trova sempre in cima.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Il frame di una funzione che salva RBX e riserva sedici byte', nota: 'Dall’alto: il dato depositato da CALL, quello depositato dalla funzione, lo spazio riservato.', els:
        SL.x86.pila('p', [{ a: 0x7FE8, txt: 'indirizzo di ritorno', nota: 'depositato da CALL', st: 'att' }, { a: 0x7FE0, txt: 'RBX del chiamante', nota: 'push rbx' }, { a: 0x7FD0, txt: 'spazio locale, 16 byte', nota: 'sub rsp, 16' }], { x: 60, y: 6, w: 260, rsp: 0x7FD0 }) },
      'La convenzione divide i registri in due gruppi. RAX, RCX, RDX, RSI, RDI e quelli da R8 a R11 possono essere sovrascritti da una funzione: il chiamante non deve fare affidamento sul loro contenuto dopo la chiamata. RBX, RBP e quelli da R12 a R15 devono essere restituiti invariati. Una funzione che li impiega li salva con PUSH all’inizio e li ripristina con POP alla fine.',
      'Il frame è rimosso nell’ordine inverso a quello di costruzione. Lo spazio locale, riservato per ultimo, è restituito per primo. Seguono i registri, che sono ripristinati. Soltanto a questo punto la cima della pila contiene di nuovo l’indirizzo di ritorno, e RET può prelevarlo.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma chiama una funzione che salva RBX, riserva spazio locale, esegue il proprio corpo e ritorna. I controlli fissano l’indirizzo della CALL e la quantità di spazio locale.',
      'RIP e RSP sono seguiti a ogni istruzione, con il contenuto di ogni cella della pila. Dopo il caso proposto, è istruttivo escludere lo spazio locale e individuare i passi che scompaiono.'
    ],
    vedrai: [
      ['operation', 'I due listati', 'A sinistra: in alto la CALL del chiamante, in basso le istruzioni della funzione.'],
      ['pila', 'La pila', 'A destra: le celle della pila, con la cima indicata da RSP.'],
      ['register', 'RIP e RBX', 'In basso: l’indirizzo della prossima istruzione e il contenuto di RBX.']
    ]
  },
  lab: {
    titolo: 'Da CALL a RET, una cella alla volta',
    scena: { w: 860, h: 392 },
    atti: ['Prima della chiamata', 'La chiamata', 'La costruzione del frame', 'Il corpo', 'La rimozione del frame', 'Il ritorno'],
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'Indirizzo della CALL', opzioni: [[0x400200, '0x400200'], [0x40021B, '0x40021B'], [0x4002F7, '0x4002F7']], valore: 0x400200 },
      { id: 'loc', tipo: 'scelta', eti: 'Spazio locale', opzioni: [[0, 'nessuno'], [16, '16 byte'], [32, '32 byte']], valore: 16 }
    ],
    nota: 'Il numero di passi dipende dallo spazio locale. La CALL occupa 5 byte, e prima della chiamata RSP vale 0x7FF0.',
    previsione: {
      domanda: (p) => 'Una CALL di 5 byte si trova all’indirizzo ' + SL.unita262.HA(p.a) + ' e chiama una funzione che comincia a 0x400400. La funzione salva RBX, ' + (p.loc ? 'riserva ' + p.loc + ' byte, ' : '') + 'esegue il proprio corpo e rimuove correttamente il frame. Quale indirizzo contiene RIP subito dopo RET?',
      opzioni: (p) => [p.a, p.a + 5, p.a + 8, 0x400400].sort((x, y) => x - y).map(SL.unita262.HA)
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. RIP contiene ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'RET preleva l’indirizzo depositato da CALL: quello dell’istruzione successiva alla CALL, cioè ' + SL.unita262.HA(p.a) + ' + 5.'),
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita262, HA = U.HA, passi = [], A = p.a, RIT = A + 5, L = p.loc, RSP0 = 0x7FF0;
      // Le istruzioni della funzione con i loro indirizzi: push 1 byte, sub e add 4, corpo 27, pop e ret 1.
      let ind = 0x400400;
      const FUN = [['push rbx', 1]].concat(L ? [['sub rsp, ' + L, 4]] : []).concat([['mov ebx, 5 …', 27]]).concat(L ? [['add rsp, ' + L, 4]] : []).concat([['pop rbx', 1], ['ret', 1]]).map((r) => { const riga = [HA(ind), r[0]]; ind += r[1]; return riga; });
      const iF = (t) => FUN.findIndex((r) => r[1].startsWith(t));
      const st = { rsp: RSP0, rip: HA(A), rbx: 77, rit: null, sal: null, loc: false, locUso: false };
      const quadro = (o) => {
        const els = [el.nota('n1', 20, 0, 'IL CHIAMANTE', 'mono'), el.nota('n2', 20, 128, 'LA FUNZIONE', 'mono'), el.nota('n3', 300, 0, 'LA PILA', 'mono')];
        [[HA(A), 'call 0x400400'], [HA(RIT), 'mov ecx, eax']].forEach((r, k) => els.push(el.box('c' + k, 20, 24 + k * 48, 250, 42, r[0], r[1], o.ch === k ? 'att' : '', { cls: 'stretta' })));
        FUN.forEach((r, k) => els.push(el.box('f' + k, 20, 152 + k * 38, 250, 34, null, r[1], o.fu === k ? 'att' : o.fu > k ? 'on' : '', { cls: 'stretta' })));
        const righe = [{ a: RSP0, txt: 'del chiamante', st: '' }, { a: RSP0 - 8, txt: st.rit, nota: st.rit ? 'indirizzo di ritorno' : null, st: o.cella === 'rit' ? 'att' : null }, { a: RSP0 - 16, txt: st.sal, nota: st.sal != null ? 'RBX del chiamante' : null, st: o.cella === 'sal' ? 'att' : null }];
        for (let k = 0; k < L / 8; k++) righe.push({ a: RSP0 - 24 - 8 * k, txt: st.loc ? (st.locUso ? 'variabile locale' : 'riservata') : null, nota: null, st: o.cella === 'loc' ? 'att' : null });
        X.pila('s', righe, { x: 300, y: 24, w: 190, passo: 40, rsp: st.rsp }).forEach((e) => els.push(e));
        els.push(el.box('rip', 300, 326, 260, 58, 'RIP, prossima istruzione', st.rip, o.rip ? 'att' : 'on', { cls: 'stretta' }),
          el.box('rbx', 580, 326, 260, 58, 'RBX', String(st.rbx), o.rbx ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['RIP', st.rip, 'a'], ['RSP', HA(st.rsp)], ['RBX', String(st.rbx), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      const o0 = [A, RIT, 0x400400].sort((x, y) => x - y);
      P({ ch: 0, rip: true }, 0, 'Prima della chiamata', 'Il chiamante sta per eseguire la CALL che si trova a ' + HA(A) + '. RSP vale 0x7FF0, e RBX contiene 77, un valore che il chiamante deve ritrovare dopo la chiamata.',
        { chiedi: { d: 'La CALL comincia a ' + HA(A) + ' e occupa 5 byte. Quale indirizzo depositerà sulla pila?', o: o0.map(HA), g: o0.indexOf(RIT), no: 'L’indirizzo di ritorno è quello dell’istruzione che segue la CALL: ' + HA(A) + ' + 5 = ' + HA(RIT) + '.' } });
      st.rsp = RSP0 - 8; st.rit = HA(RIT); st.rip = '0x400400';
      P({ ch: 0, cella: 'rit', rip: true }, 1, 'CALL deposita l’indirizzo e salta', 'CALL sottrae 8 a RSP e scrive nella nuova cima l’indirizzo di ritorno, ' + HA(RIT) + '. Scrive poi in RIP l’indirizzo della funzione, 0x400400. Il valore depositato dipende soltanto dalla posizione e dalla lunghezza della CALL.', { calc: HA(A) + ' + 5 = ' + HA(RIT) });
      st.rsp = RSP0 - 16; st.sal = 77; st.rip = FUN[1][0];
      P({ fu: 0, cella: 'sal' }, 2, 'Il registro salvato', 'La funzione impiegherà RBX, che la convenzione le impone di restituire invariato. Come prima operazione ne deposita il contenuto sulla pila: RSP scende a ' + HA(st.rsp) + ', e la cella riceve 77.', { calc: 'push rbx · RSP = ' + HA(st.rsp) });
      if (L) {
        st.rsp = RSP0 - 16 - L; st.loc = true; st.rip = FUN[2][0];
        P({ fu: 1, cella: 'loc' }, 2, 'Lo spazio locale', 'La funzione sottrae ' + L + ' a RSP e si riserva così ' + L + ' byte per le proprie variabili. Nessun dato è scritto: le celle le appartengono per il solo fatto che RSP le ha oltrepassate. Il frame è completo: indirizzo di ritorno, registro salvato, spazio locale.', { calc: HA(RSP0 - 16) + ' − ' + L + ' = ' + HA(st.rsp) });
      }
      st.rbx = 5; st.locUso = true; st.rip = FUN[iF('mov') + 1][0];
      const o4 = Array.from(new Set([RSP0 - 8, RSP0 - 16, st.rsp, RSP0])).sort((x, y) => x - y);
      P({ fu: iF('mov'), rbx: true, cella: L ? 'loc' : null }, 3, 'Il corpo della funzione', 'La funzione esegue il proprio corpo. Impiega RBX, che ora contiene 5' + (L ? ', e scrive nelle proprie variabili locali.' : '.') + ' Il valore 77 del chiamante è preservato sulla pila. RSP vale ' + HA(st.rsp) + '.',
        { chiedi: { d: 'Prima di RET, RSP deve tornare sulla cella che contiene l’indirizzo di ritorno. Qual è il suo indirizzo?', o: o4.map(HA), g: o4.indexOf(RSP0 - 8), no: 'L’indirizzo di ritorno si trova dove CALL lo ha depositato: a ' + HA(RSP0 - 8) + ', otto byte sotto la cima precedente alla chiamata.' } });
      if (L) {
        st.rsp = RSP0 - 16; st.loc = false; st.locUso = false; st.rip = FUN[iF('pop')][0];
        P({ fu: iF('add') }, 4, 'Lo spazio locale restituito', 'La funzione somma ' + L + ' a RSP e restituisce lo spazio locale. Le celle conservano il proprio contenuto, e tuttavia cessano di appartenerle. La cima torna a ' + HA(st.rsp) + ', sul valore salvato di RBX.', { calc: HA(RSP0 - 16 - L) + ' + ' + L + ' = ' + HA(st.rsp) });
      }
      st.rsp = RSP0 - 8; st.rbx = 77; st.sal = null; st.rip = FUN[iF('ret')][0];
      P({ fu: iF('pop'), rbx: true, cella: 'rit' }, 4, 'Il registro ripristinato', 'POP legge il dato in cima, 77, lo riscrive in RBX e aggiunge 8 a RSP. Il chiamante ritroverà il registro invariato. La cima della pila è di nuovo l’indirizzo di ritorno, a ' + HA(st.rsp) + '.', { calc: 'pop rbx · RSP = ' + HA(st.rsp) });
      st.rsp = RSP0; st.rit = null; st.rip = HA(RIT);
      P({ fu: iF('ret'), ch: 1, rip: true }, 5, 'RET riprende dal chiamante', 'RET preleva dalla cima l’indirizzo ' + HA(RIT) + ', lo scrive in RIP e aggiunge 8 a RSP. Il programma riprende dall’istruzione che segue la CALL, e RSP è tornato a 0x7FF0, il valore precedente alla chiamata. Il frame è stato rimosso per intero.', { calc: 'RIP = ' + HA(RIT) + ' · RSP = 0x7FF0', esito: ['RIP = ' + HA(RIT), 'si'] });
      return { passi, esito: HA(RIT) };
    }
  },
  bilancio: {
    regola: [
      'CALL deposita l’indirizzo di ritorno e salta. RET lo preleva dalla cima e lo scrive in RIP. Fra le due, la funzione deve riportare RSP al valore lasciato da CALL.',
      'Il frame di una chiamata comprende l’indirizzo di ritorno, i registri salvati e lo spazio locale. È rimosso nell’ordine inverso a quello di costruzione.'
    ],
    errori: [
      ['Assumere come indirizzo di ritorno quello della CALL.', 'Il programma deve riprendere dall’istruzione successiva. Per una CALL di 5 byte l’indirizzo di ritorno si trova 5 byte più avanti.'],
      ['Eseguire RET con un valore errato di RSP.', 'RET preleva il contenuto della cima. Se la cima è una variabile locale, il programma salta a un indirizzo privo di significato.'],
      ['Ripristinare i registri nell’ordine in cui sono stati salvati.', 'Dopo `push rbx` e `push r12`, in cima si trova il valore di R12. Vanno eseguiti prima `pop r12` e poi `pop rbx`.']
    ],
    saFare: ['Calcolare l’indirizzo di ritorno di una CALL.', 'Seguire RSP attraverso PUSH, SUB, ADD, POP e RET.', 'Indicare il contenuto di ogni cella del frame di una funzione.'],
    esercizi: [
      { d: 'Una CALL di 5 byte comincia all’indirizzo 0x40103B. Quale indirizzo deve trovare RET in cima alla pila? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x401020', giuste: ['0x401040', '401040', '401040h'],
        ok: 'L’indirizzo di ritorno è quello dell’istruzione che segue la CALL: 0x40103B + 5 = 0x401040.',
        diagnosi: [
          { se: ['0x40103b', '40103b'], msg: 'Il valore indicato è l’indirizzo della CALL. Con un ritorno a tale indirizzo il programma la eseguirebbe di nuovo, senza termine.' },
          { se: ['0x401036', '401036'], msg: 'L’istruzione successiva si trova più avanti: i 5 byte della CALL vanno sommati.' },
          { se: ['0x401310', '0x40103g', '0x4010310'], msg: 'La somma va eseguita in esadecimale: B vale 11, e 11 + 5 dà 16, cioè 10 con il riporto di una sedicina.' }
        ],
        altro: 'L’indirizzo è diverso. Si sommi all’indirizzo della CALL la sua lunghezza, in esadecimale.',
        indizi: ['L’indirizzo di ritorno è l’indirizzo della CALL più la sua lunghezza.', '0x3B + 5: la cifra B vale 11.', '11 + 5 = 16: si scrive 0 e si riporta 1 sulla cifra 3.'],
        svolgimento: ['Indirizzo della CALL: 0x40103B. Lunghezza: 5 byte.', '0x3B + 5 = 0x40.', 'Indirizzo di ritorno: 0x401040.'] },
      { d: 'Una funzione comincia con `push rbx` e `sub rsp, 24`. Con quali istruzioni deve finire?', guida: 'Si scelga la risposta.', o: [
        { t: 'add rsp, 24 · pop rbx · ret', ok: true, fb: 'Il frame è rimosso in ordine inverso: prima lo spazio locale, poi il registro salvato, infine il ritorno.' },
        { t: 'pop rbx · add rsp, 24 · ret', fb: 'Con lo spazio locale ancora in cima, POP scriverebbe in RBX una variabile locale. RET troverebbe poi in cima il valore salvato di RBX.' },
        { t: 'add rsp, 24 · ret', fb: 'Senza POP la cima contiene ancora il valore salvato di RBX. RET lo impiegherebbe come indirizzo di ritorno.' }] }
    ]
  }
});
SL.unita262 = { HA: (a) => '0x' + a.toString(16).toUpperCase() };
