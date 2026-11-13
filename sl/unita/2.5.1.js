'use strict';
SL.registra('2.5.1', {
  titolo: 'Dalla richiesta dell’utente all’ingresso nel kernel',
  obiettivo: 'Alla fine saprai descrivere che cosa accade quando un programma esegue SYSCALL: quali registri porta con sé, che cosa cambia nel processore e che cosa trova al ritorno.',
  concetti: [['privilegi', 'Due modi del processore'], ['gate', 'La chiamata di sistema'], ['register', 'RAX, prima e dopo']],
  filigrana: ['privilegi', 'gate', 'register'],
  richiami: {
    carte: [
      { sim: 'gate', da: 'Dall’unità 1.1.1', t: 'Sistema operativo', d: 'Il programma che resta sempre in funzione e governa le risorse condivise, come lo schermo e il disco, per conto di tutti gli altri.' },
      { sim: 'process', da: 'Dall’unità 1.1.5', t: 'Processo e PID', d: 'Un processo è un programma in esecuzione. Il sistema operativo lo identifica con un numero, il PID.' },
      { sim: 'input', da: 'Dall’unità 2.2.2', t: 'Convenzione di chiamata', d: 'I primi argomenti interi di una funzione viaggiano in RDI, RSI e RDX. Il risultato torna in RAX.' }
    ],
    domanda: { d: 'Prima di proseguire: un programma vuole scrivere una riga sul terminale. Chi governa il terminale?', o: [
      { t: 'Il sistema operativo', ok: true, fb: 'Il terminale è una risorsa condivisa fra tutti i programmi. La governa il sistema operativo, e i programmi gliela chiedono.' },
      { t: 'Il programma stesso', fb: 'Se ogni programma comandasse da sé il terminale, due programmi potrebbero scriverci insieme e rovinarsi a vicenda l’uscita.' },
      { t: 'Il compilatore', fb: 'Il compilatore traduce il programma prima che parta. Durante l’esecuzione ha già finito il suo lavoro.' }
    ] }
  },
  idea: {
    titolo: 'Una porta sorvegliata',
    termini: ['kernel', 'modo utente', 'chiamata di sistema', 'syscall'],
    testo: [
      'Le istruzioni viste finora lavorano su registri e memoria. Nessuna di esse scrive sullo schermo, legge un file o crea un processo. Queste operazioni toccano risorse condivise, e un programma che potesse compierle da solo potrebbe leggere i file altrui o bloccare l’intera macchina.',
      'Per impedirlo il processore funziona in due modi. Nel [[modo utente]], quello dei programmi ordinari, le istruzioni che comandano i dispositivi sono vietate e la memoria degli altri processi è irraggiungibile. Nel modo privilegiato tutto è permesso. In quel modo gira soltanto il [[kernel]], la parte centrale del sistema operativo.',
      'Fra i due modi esiste un passaggio controllato, la [[chiamata di sistema]]. Il programma prepara una richiesta e la consegna al kernel, che verifica se è lecita, la esegue per suo conto e restituisce un risultato. Il programma decide che cosa chiedere. Il kernel decide se e come farlo.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Il percorso di una chiamata di sistema', nota: 'Il programma si ferma sulla soglia. Riprende quando il kernel ha finito, dall’istruzione successiva.', els: [
        SL.el.zona('zu', 0, 0, 340, 144, 'modo utente', 'on'), SL.el.zona('zk', 380, 0, 340, 144, 'modo privilegiato', 'att'),
        SL.el.box('a', 20, 40, 300, 44, null, 'il programma prepara i registri', 'on', { cls: 'stretta' }), SL.el.box('b', 400, 40, 300, 44, null, 'il kernel esegue il servizio', 'att', { cls: 'stretta' }),
        SL.el.box('c', 20, 92, 300, 44, null, 'il programma riprende', 'on', { cls: 'stretta' }), SL.el.box('d', 400, 92, 300, 44, null, 'il risultato va in RAX', 'att', { cls: 'stretta' }),
        SL.el.linea('l1', 320, 62, 400, 62, 'att'), SL.el.linea('l2', 400, 114, 320, 114, 'on')] },
      'Sui processori x86-64 il passaggio è un’istruzione, [[syscall|SYSCALL]]. Prima di eseguirla il programma mette in RAX il numero del servizio desiderato: in Linux il numero 1 indica write, che scrive dei byte, e il 39 indica getpid, che restituisce il PID del processo. Gli argomenti viaggiano negli stessi registri delle funzioni: RDI, RSI, RDX.',
      'SYSCALL porta il processore nel modo privilegiato e fa proseguire l’esecuzione da un indirizzo che soltanto il kernel può stabilire. Per poter tornare, il processore salva in RCX l’indirizzo dell’istruzione successiva e in R11 una copia dei flag. Al ritorno il risultato si trova in RAX. Lo stesso registro, quindi, contiene il numero del servizio all’andata e la risposta al ritorno.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma chiede un servizio al kernel. Sceglierai fra write, che scrive sul terminale i primi byte di un messaggio, e getpid, che chiede il PID del processo.',
      'Seguiremo la richiesta dai registri del programma al kernel e ritorno, tenendo d’occhio RAX. Dopo il caso proposto, passa a getpid e confronta quanti registri servono.'
    ],
    vedrai: [
      ['process', 'Il programma', 'A sinistra, nel modo utente: le istruzioni e i quattro registri che portano la richiesta.'],
      ['privilegi', 'Il kernel', 'A destra, nel modo privilegiato: ciò che il processore salva e ciò che il kernel fa.'],
      ['register', 'Il significato di RAX', 'In basso: che cosa rappresenta in ogni momento il numero contenuto in RAX.']
    ]
  },
  lab: {
    titolo: 'Una richiesta al kernel, andata e ritorno',
    scena: { w: 860, h: 368 },
    atti: ['La richiesta', 'Il passaggio', 'Il kernel al lavoro', 'La risposta', 'Il ritorno'],
    controlli: [
      { id: 'req', tipo: 'scelta', eti: 'Servizio', opzioni: [['write', 'write'], ['getpid', 'getpid']], valore: 'write' },
      { id: 'n', tipo: 'scelta', eti: 'Byte da scrivere', opzioni: [[4, '4'], [8, '8'], [12, '12']], valore: 8 }
    ],
    nota: 'Il numero di passi dipende dal servizio. Il numero di byte riguarda soltanto write.',
    previsione: {
      domanda: (p) => (p.req === 'write' ? 'Il programma mette 1 in RAX, 1 in RDI, 0x5000 in RSI e ' + p.n + ' in RDX, poi esegue `syscall`. Il kernel scrive tutti i byte richiesti. Che cosa conterrà RAX quando il programma riprende?' : 'Il programma mette 39 in RAX ed esegue `syscall`. Il PID del processo è 417. Che cosa conterrà RAX quando il programma riprende?'),
      opzioni: (p) => (p.req === 'write' ? [[1, '1, il numero del servizio'], [p.n, p.n + ', i byte scritti'], [20480, '0x5000, l’indirizzo del messaggio']] : [[0, '0'], [39, '39, il numero del servizio'], [417, '417, il PID']])
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + pred + '. RAX contiene ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'All’andata RAX porta il numero del servizio. Al ritorno il kernel vi ha scritto il risultato: ' + (p.req === 'write' ? 'il numero di byte scritti.' : 'il PID del processo.')),
    costruisci(p) {
      const el = SL.el, X = SL.x86, passi = [], W = p.req === 'write', n = p.n, MSG = 'SistemiLab!!'.slice(0, n);
      const LIS = W ? [['0x401000', 'mov eax, 1'], ['0x401005', 'mov edi, 1'], ['0x40100A', 'mov rsi, 0x5000'], ['0x401011', 'mov edx, ' + n], ['0x401016', 'syscall']] : [['0x401000', 'mov eax, 39'], ['0x401005', 'syscall']];
      const RIP = W ? '0x401018' : '0x401007', esito = W ? n : 417;
      const st = { rax: null, rdi: null, rsi: null, rdx: null, rcx: null, r11: null, senso: '·', breve: '·' };
      const quadro = (o) => {
        const K = o.kernel, els = [el.zona('zu', 20, 0, 400, 300, 'modo utente · il programma', K ? '' : 'on'), el.zona('zk', 440, 0, 400, 300, 'modo privilegiato · il kernel', K ? 'att' : '')];
        X.listato('li', LIS, o.riga, { x: 36, y: 34, w: 216, passo: W ? 52 : 60 }).forEach((e) => els.push(e));
        [['RAX', st.rax], ['RDI', st.rdi], ['RSI', st.rsi], ['RDX', st.rdx]].forEach((r, k) => els.push(el.box('r' + k, 268, 34 + k * 64, 136, 56, r[0], r[1] == null ? '·' : String(r[1]), (o.reg || []).includes(r[0]) ? 'att' : r[1] != null ? 'on' : '', { cls: 'stretta' })));
        els.push(el.box('k1', 456, 34, 180, 56, 'RCX, dove riprendere', st.rcx || '·', o.salva ? 'att' : st.rcx ? 'on' : '', { cls: 'stretta' }),
          el.box('k2', 648, 34, 176, 56, 'R11, flag salvati', st.r11 || '·', o.salva ? 'att' : st.r11 ? 'on' : '', { cls: 'stretta' }),
          el.box('k3', 456, 104, 368, 56, 'servizio richiesto', o.fase >= 2 ? (W ? 'numero 1: write' : 'numero 39: getpid') : '·', o.fase === 2 ? 'att' : o.fase > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('k4', 456, 174, 368, 56, 'lavoro del kernel', o.fase >= 2 ? (W ? '«' + MSG + '» al descrittore 1' : 'legge il PID del processo: 417') : '·', o.fase === 2 ? 'att' : o.fase > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('k5', 456, 244, 368, 46, null, o.fase >= 3 ? 'risultato in RAX: ' + esito : '·', o.fase === 3 ? 'att' : o.fase > 3 ? 'on' : '', { cls: 'stretta' }),
          el.box('s1', 20, 312, 400, 50, 'in questo momento RAX contiene', st.senso, o.senso ? 'att' : '', { cls: 'stretta' }),
          el.box('s2', 440, 312, 400, 50, 'prossima istruzione del programma', o.fase >= 1 ? RIP : '·', o.fase === 4 ? 'att' : '', { cls: 'stretta' }));
        if (o.pacco) els.push(el.pacco('pk', o.pacco[0], o.pacco[1], o.pacco[2], 'att'));
        return els;
      };
      const hud = (o) => [['Modo del processore', o.kernel ? 'privilegiato' : 'utente', 'a'], ['RAX', st.rax == null ? '·' : String(st.rax)], ['RAX è', st.breve, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o), els: quadro(o) }, extra));

      P({ fase: 0 }, 0, 'Un lavoro che il programma non può fare da sé', (W ? 'Il programma vuole scrivere sul terminale i primi ' + n + ' byte di un messaggio che si trova in memoria, all’indirizzo 0x5000. ' : 'Il programma vuole conoscere il proprio PID, un numero che soltanto il kernel conosce. ') + 'Nel modo utente gli manca il permesso di farlo da solo: deve chiederlo al kernel con una chiamata di sistema.',
        { chiedi: { d: 'Il servizio ' + (W ? 'write ha il numero 1' : 'getpid ha il numero 39') + '. In quale registro va messo il numero del servizio?', o: ['RAX', 'RDI', 'RDX'], g: 0, no: 'Il numero del servizio viaggia in RAX. RDI e RDX portano gli argomenti.' } });
      st.rax = W ? 1 : 39; st.senso = 'il numero del servizio'; st.breve = 'il servizio';
      P({ fase: 0, riga: 0, reg: ['RAX'], senso: true }, 0, 'Il numero del servizio', 'La prima istruzione mette in RAX il numero ' + st.rax + ', che in Linux indica ' + (W ? 'write.' : 'getpid. Questo servizio non chiede argomenti, e la richiesta è già completa.') + (W ? ' Da solo, però, il numero dice soltanto che cosa fare: mancano i dettagli.' : ''), { calc: 'RAX = ' + st.rax });
      if (W) {
        st.rdi = 1; st.rsi = '0x5000'; st.rdx = n;
        P({ fase: 0, riga: 3, reg: ['RDI', 'RSI', 'RDX'] }, 0, 'Gli argomenti', 'Tre istruzioni preparano gli argomenti, negli stessi registri usati dalle funzioni. RDI dice dove scrivere: il numero 1 indica l’uscita standard. RSI contiene l’indirizzo del primo byte del messaggio. RDX dice quanti byte scrivere: ' + n + '.', { calc: 'write(1, 0x5000, ' + n + ')' });
      }
      st.rcx = RIP; st.r11 = 'copia dei flag';
      P({ fase: 1, riga: LIS.length - 1, kernel: true, salva: true, pacco: [470, 258, 'richiesta'] }, 1, 'SYSCALL attraversa il confine', 'L’istruzione SYSCALL porta il processore nel modo privilegiato. Prima salva due cose: in RCX l’indirizzo dell’istruzione successiva, ' + RIP + ', e in R11 una copia dei flag. Poi l’esecuzione prosegue da un indirizzo stabilito dal kernel. Il programma resta fermo sulla soglia.',
        { calc: 'RCX = ' + RIP, chiedi: { d: 'Il kernel deve capire quale servizio gli viene chiesto. Dove lo legge?', o: ['In RAX', 'In RCX', 'Nel testo del programma'], g: 0, no: 'Il kernel trova in RAX il numero che il programma vi ha messo, e lo cerca nella propria tabella dei servizi.' } });
      P({ fase: 2, riga: LIS.length - 1, kernel: true }, 2, 'Il kernel esegue il servizio', 'Il kernel legge ' + st.rax + ' in RAX e riconosce il servizio ' + (W ? 'write. Controlla che il descrittore 1 sia aperto e che i ' + n + ' byte a partire da 0x5000 appartengano davvero al processo. Poi li consegna al terminale: «' + MSG + '».' : 'getpid. Cerca nelle proprie tabelle il processo che ha fatto la richiesta e ne legge il PID, 417.'),
        { calc: W ? n + ' byte al terminale' : 'PID = 417', chiedi: { d: 'Il lavoro è finito. Che cosa scriverà il kernel in RAX?', o: W ? ['1', String(n), '0x5000'] : ['0', '39', '417'], g: W ? 1 : 2, no: W ? 'Il risultato di write è il numero di byte scritti: ' + n + '.' : 'Il risultato di getpid è il PID del processo: 417.' } });
      st.rax = esito; st.senso = W ? 'i byte scritti' : 'il PID del processo'; st.breve = W ? 'byte scritti' : 'il PID';
      P({ fase: 3, riga: LIS.length - 1, kernel: true, reg: ['RAX'], senso: true, pacco: [470, 258, 'risposta'] }, 3, 'Il risultato in RAX', 'Il kernel scrive il risultato in RAX: ' + esito + (W ? ', il numero di byte che ha scritto.' : ', il PID del processo.') + ' Il numero del servizio, che occupava lo stesso registro, è stato sovrascritto. Da questo momento lo stesso registro va letto in un altro modo.', { calc: 'RAX = ' + esito });
      P({ fase: 4, riga: LIS.length, reg: ['RAX'], pacco: [284, 258, 'risposta'] }, 4, 'Il ritorno nel modo utente', 'Il kernel restituisce il controllo: il processore torna nel modo utente, rimette a posto i flag da R11 e riprende dall’indirizzo salvato in RCX, ' + RIP + '. Il programma trova il risultato in RAX. Il prezzo del viaggio sono RCX e R11, che ora contengono valori del processore: chi li usava deve averli salvati altrove.', { calc: 'RAX = ' + esito, esito: ['RAX = ' + esito, 'si'] });
      return { passi, esito };
    }
  },
  bilancio: {
    regola: [
      'Una chiamata di sistema è la richiesta di un servizio al kernel. Il numero del servizio va in RAX, gli argomenti in RDI, RSI e RDX, e l’istruzione SYSCALL porta il processore nel modo privilegiato.',
      'Al ritorno RAX contiene il risultato. SYSCALL sovrascrive RCX con l’indirizzo di ripresa e R11 con i flag.'
    ],
    errori: [
      ['Leggere RAX sempre allo stesso modo.', 'Prima di SYSCALL contiene il numero del servizio, dopo contiene il risultato. Conta il momento in cui lo si guarda.'],
      ['Contare su RCX e R11 dopo una chiamata di sistema.', 'SYSCALL li usa per l’indirizzo di ripresa e per i flag. I valori che contenevano sono perduti.'],
      ['Pensare che il programma salti dove vuole nel kernel.', 'L’indirizzo da cui il kernel prosegue è fissato dal kernel. Il programma sceglie soltanto il numero del servizio.']
    ],
    saFare: ['Spiego perché un programma deve rivolgersi al kernel.', 'Preparo i registri per una chiamata di sistema semplice.', 'Dico che cosa contengono RAX, RCX e R11 dopo SYSCALL.'],
    esercizi: [
      { d: 'Un programma esegue `mov eax, 1`, `mov edi, 1`, `mov rsi, 0x6000`, `mov edx, 5` e `syscall`. Il kernel scrive tutti i byte richiesti. Quanto vale RAX dopo il ritorno?', segnaposto: 'Un numero', giuste: ['5', 'cinque'],
        ok: 'Il servizio numero 1 è write. Il suo risultato è il numero di byte scritti, che qui sono 5.',
        diagnosi: [
          { se: ['1'], msg: 'Uno è il numero del servizio, che RAX conteneva all’andata. Al ritorno il kernel vi ha scritto il risultato.' },
          { se: ['0'], msg: 'Zero vorrebbe dire nessun byte scritto. Il kernel ne ha scritti quanti indicava RDX.' },
          { se: ['0x6000', '6000', '24576'], msg: 'Questo è l’indirizzo del messaggio, contenuto in RSI. Il risultato di write è un numero di byte.' }
        ],
        altro: 'Il valore è diverso. Individua il servizio dal numero in RAX, poi chiediti che cosa restituisce.',
        indizi: ['Il numero 1 in RAX indica il servizio write.', 'write restituisce il numero di byte scritti.', 'I byte da scrivere sono indicati da RDX.'],
        svolgimento: ['RAX = 1: il servizio è write.', 'RDI = 1: uscita standard. RSI = 0x6000: indirizzo del messaggio. RDX = 5: lunghezza.', 'Il kernel scrive 5 byte e mette 5 in RAX.'] },
      { d: 'Un programma tiene in RCX un contatore ed esegue una chiamata di sistema. Che cosa trova in RCX dopo il ritorno?', guida: 'Scegli la risposta.', o: [
        { t: 'L’indirizzo dell’istruzione che segue SYSCALL', ok: true, fb: 'SYSCALL salva in RCX l’indirizzo di ripresa. Il contatore è perduto: andava copiato in un altro registro prima della chiamata.' },
        { t: 'Il contatore, intatto', fb: 'SYSCALL usa RCX per l’indirizzo di ripresa, e il valore precedente viene sovrascritto.' },
        { t: 'Il risultato della chiamata', fb: 'Il risultato torna in RAX. In RCX resta l’indirizzo di ripresa.' }] }
    ],
    sfida: ['cslez2_5_01_random_assembly_01', 'Scrittura sui descrittori e terminazione']
  }
});
