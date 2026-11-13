'use strict';
SL.registra('4.1.2', {
  titolo: 'Interrupt, fault, trap e abort',
  obiettivo: 'Alla fine saprai classificare un evento come interrupt, fault, trap o abort, e dire per ciascuna classe quale indirizzo viene salvato per la ripresa.',
  concetti: [['interrupt', 'Dall’esterno, oppure dall’istruzione'], ['lente', 'Durante oppure dopo'], ['conflitto', 'Quando la ripresa manca']],
  filigrana: ['interrupt', 'conflitto', 'lente'],
  richiami: {
    carte: [
      { sim: 'gate', da: 'Dall’unità 4.1.1', t: 'Il gestore', d: 'La routine del kernel che serve un evento. Al termine il programma riprende dall’indirizzo salvato.' },
      { sim: 'interrupt', da: 'Dall’unità 4.1.1', t: 'Due riprese diverse', d: 'Dopo il timer si prosegue con l’istruzione seguente. Dopo una pagina assente si ripete l’istruzione interrotta.' },
      { sim: 'conflitto', da: 'Dall’unità 2.2.3', t: 'L’eccezione del processore', d: 'Un evento provocato da una istruzione, come la divisione per zero, che passa il controllo al sistema operativo.' }
    ],
    domanda: { d: 'Prima di proseguire: un interrupt del timer arriva durante una istruzione di 4 byte che comincia a 0x2040. Quale indirizzo viene salvato?', o: [
      { t: '0x2044', ok: true, fb: 'L’istruzione viene completata, e si riprende dalla seguente.' },
      { t: '0x2040', fb: 'Questo indirizzo verrebbe salvato se l’istruzione fosse rimasta incompiuta, come dopo una pagina assente.' },
      { t: '0x2041', fb: 'L’istruzione occupa 4 byte, e la seguente comincia dopo l’ultimo.' }
    ] }
  },
  idea: {
    titolo: 'Quattro classi di eventi',
    termini: ['fault', 'trap', 'breakpoint', 'abort'],
    testo: [
      'Gli eventi che deviano il flusso si distinguono per il loro rapporto con l’istruzione in corso. Gli interrupt arrivano dall’esterno, da un timer o da una periferica, e sono estranei a ciò che il programma sta facendo. Le [[eccezione del processore|eccezioni]] nascono invece dall’istruzione stessa, e si dividono in tre classi.',
      'Un [[fault]] viene scoperto mentre l’istruzione è in corso, prima che abbia prodotto effetti. La pagina assente è un fault, e lo è anche la divisione per zero. L’indirizzo salvato è quello dell’istruzione che ha fallito, perché il gestore può rimuovere la causa e farla ripetere. Quando la causa è irrimediabile, come nella divisione per zero, il gestore termina il programma, e l’indirizzo salvato indica dove è avvenuto l’errore.',
      'Una [[trap]] viene segnalata dopo che l’istruzione è terminata. L’esempio classico è `int3`, una istruzione di un solo byte che i programmi di diagnosi inseriscono nel punto in cui vogliono fermare un programma. Quel punto si chiama [[breakpoint]]. L’istruzione ha fatto il proprio lavoro, che consiste appunto nel chiamare il gestore, e l’indirizzo salvato è quello dell’istruzione seguente.',
      { fig: 'scena', w: 720, h: 196, titolo: 'Le quattro classi a confronto', nota: 'L’istruzione comincia a 0x1010. Le istruzioni ordinarie occupano 4 byte, int3 ne occupa 1.', els: (() => {
        const el = SL.el, els = [], col = ['origine', 'momento', 'indirizzo salvato'], righe = [['interrupt', ['esterna', 'fra due istruzioni', '0x1014'], 'on'], ['fault', ['l’istruzione', 'durante', '0x1010'], 'att'], ['trap', ['l’istruzione', 'dopo', '0x1011'], 'on'], ['abort', ['un guasto', 'imprevedibile', 'inaffidabile'], 'err']];
        col.forEach((c, k) => els.push(el.nota('gh' + k, 136 + k * 196, 0, c, 'mono minuta')));
        righe.forEach((r, j) => { els.push(el.nota('gn' + j, 10, 34 + j * 40, r[0], 'mono minuta', r[2] === 'on' ? '' : r[2])); r[1].forEach((v, k) => els.push(el.cella('gc' + j + '_' + k, 130 + k * 196, 26 + j * 40, 184, 30, v, r[2], { piccola: true, cls: 'minuta' }))); });
        return els; })() },
      'Un [[abort]] segnala un guasto grave, per esempio un errore dell’hardware che ha rovinato i dati interni del processore. Lo stato del programma può essere compromesso, e nessun indirizzo salvato garantisce una ripresa corretta. Il kernel di solito termina il programma, oppure si ferma del tutto.',
      'La classe decide quindi il destino dell’istruzione: completata e superata per un interrupt e per una trap, da ripetere per un fault, perduta per un abort.'
    ]
  },
  esperimento: {
    faremo: [
      'Riprenderemo il programma dell’unità precedente, e durante l’istruzione centrale faremo accadere quattro eventi diversi: un breakpoint, una pagina assente, un interrupt del timer e un guasto grave.',
      'Per ciascuno guarderemo la classe, il momento in cui viene segnalato e l’indirizzo salvato. Dopo il caso proposto, prova il guasto grave e osserva che cosa manca.'
    ],
    vedrai: [
      ['puntatore', 'Il programma', 'In alto: tre istruzioni consecutive. Quella centrale dipende dall’evento scelto.'],
      ['interrupt', 'L’evento', 'Al centro: l’evento, il gestore e l’indirizzo salvato.'],
      ['lente', 'La classe e la ripresa', 'In basso: la classe dell’evento e il destino dell’istruzione.']
    ]
  },
  lab: {
    titolo: 'Quattro eventi, quattro riprese',
    scena: { w: 860, h: 276 },
    atti: ['L’istruzione', 'La classe', 'L’indirizzo salvato', 'La ripresa'],
    controlli: [
      { id: 'evento', tipo: 'scelta', eti: 'Evento', opzioni: [['bp', 'breakpoint (int3)'], ['pf', 'pagina assente'], ['irq', 'interrupt del timer'], ['abort', 'guasto grave']], valore: 'bp' },
      { id: 'pc', tipo: 'scelta', eti: 'Indirizzo dell’istruzione', opzioni: [[0x1010, '0x1010'], [0x2040, '0x2040'], [0x40F8, '0x40F8']], valore: 0x1010 }
    ],
    nota: 'I passi sono sempre cinque. Le istruzioni ordinarie del modello occupano 4 byte, int3 ne occupa 1.',
    previsione: {
      domanda: (p) => { const e = SL.kern.EVENTI[p.evento]; return 'L’istruzione `' + e.ist + '` comincia a ' + SL.kern.H(p.pc) + ' e occupa ' + (e.lung === 1 ? 'un byte' : e.lung + ' byte') + '. L’evento è: ' + e.nome + '. Quale indirizzo viene salvato per la ripresa?'; },
      opzioni: (p) => [[p.pc, SL.kern.H(p.pc) + ', la stessa istruzione'], [p.pc + 1, SL.kern.H(p.pc + 1)], [p.pc + 4, SL.kern.H(p.pc + 4)], [0, 'Nessuno affidabile']]
    },
    confronto: (pred, esito, p) => { const K = SL.kern, e = K.EVENTI[p.evento], N = (v) => (v ? K.H(v) : 'nessun indirizzo affidabile'); return 'Avevi previsto ' + N(pred) + '. L’esito è ' + N(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : e.classe === 'trap' ? 'Una trap viene segnalata dopo l’istruzione, e `int3` occupa un solo byte.' : e.classe === 'fault' ? 'Un fault lascia l’istruzione incompiuta, e l’indirizzo salvato è il suo.' : e.classe === 'interrupt' ? 'Un interrupt viene accettato dopo l’istruzione in corso, che occupa 4 byte.' : 'Dopo un abort lo stato può essere compromesso, e nessun indirizzo garantisce la ripresa.'); },
    costruisci(p) {
      const K = SL.kern, H = K.H, passi = [], pc = p.pc, e = K.EVENTI[p.evento], r = K.ripresa(p.evento, pc), R = r ? H(r) : 'inaffidabile';
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'PROGRAMMA IN MODO UTENTE', 'mono')].concat(K.flusso('q', p.evento, pc, f, { x: 20, y: 24, w: 264, gap: 14, h: 62, classe: true }));
      const hud = (f) => [['Evento', e.nome, 'a'], ['Classe', f >= 1 ? e.classe : '·'], ['Indirizzo salvato', f >= 2 ? R : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'L’istruzione in corso', 'Il processore esegue `' + e.ist + '`, che comincia a ' + H(pc) + ' e occupa ' + (e.lung === 1 ? 'un solo byte' : e.lung + ' byte') + '. L’istruzione seguente comincia a ' + H(pc + e.lung) + '.' + (p.evento === 'bp' ? ' Un programma di diagnosi ha messo qui `int3` per fermare il programma in questo punto.' : ''),
        { chiedi: { d: 'L’evento sarà: ' + e.nome + '. Da dove nasce?', o: ['Dall’esterno del processore', 'Dall’istruzione in corso', 'Da un guasto'], g: p.evento === 'irq' ? 0 : p.evento === 'abort' ? 2 : 1, no: p.evento === 'irq' ? 'Il timer è un circuito esterno, estraneo a ciò che il programma sta facendo.' : p.evento === 'abort' ? 'Un guasto grave non dipende dall’istruzione in corso, e nemmeno da una periferica che chiede attenzione.' : 'L’evento è provocato dall’istruzione stessa.' } });
      P(1, 1, 'La classe', p.evento === 'bp' ? '`int3` viene eseguita per intero, e il suo effetto è chiamare il gestore. L’evento viene segnalato dopo l’istruzione: è una trap.' : p.evento === 'pf' ? 'La lettura dalla memoria fallisce mentre l’istruzione è in corso, prima che RAX sia stato scritto. L’evento viene scoperto durante l’istruzione: è un fault.' : p.evento === 'irq' ? 'La richiesta del timer arriva dall’esterno. Il processore completa l’istruzione in corso e accetta la richiesta al confine con la seguente: è un interrupt.' : 'Un circuito di controllo segnala un errore dell’hardware. L’evento è indipendente dal programma, e lo stato del processore può essere rovinato: è un abort.', { calc: 'classe: ' + e.classe });
      P(2, 2, 'L’indirizzo salvato', e.classe === 'trap' ? 'Dopo una trap il lavoro dell’istruzione è finito. L’indirizzo salvato è quello della seguente: ' + H(pc) + ' + 1 = ' + H(r) + '.' : e.classe === 'fault' ? 'Dopo un fault l’istruzione è incompiuta. L’indirizzo salvato è il suo, ' + H(r) + ', perché andrà ripetuta.' : e.classe === 'interrupt' ? 'L’istruzione è stata completata. L’indirizzo salvato è quello della seguente: ' + H(pc) + ' + 4 = ' + H(r) + '.' : 'Il processore salva un indirizzo, che però può essere privo di valore: dopo un guasto nessuno può garantire che registri e memoria siano integri.', { calc: 'indirizzo salvato: ' + R });
      P(3, 2, 'Il gestore', p.evento === 'bp' ? 'Il gestore passa il controllo al programma di diagnosi, che può mostrare registri e memoria del programma fermo.' : p.evento === 'pf' ? 'Il gestore prepara la pagina mancante e la collega all’indirizzo richiesto.' : p.evento === 'irq' ? 'Il gestore del timer aggiorna l’ora e decide a chi dare il processore.' : 'Il gestore registra il guasto. Di solito termina il programma, oppure ferma l’intero sistema.', { calc: 'gestore al lavoro' });
      P(4, 3, r ? 'La ripresa' : 'Nessuna ripresa', e.classe === 'trap' ? 'Il programma riprende da ' + H(r) + ', l’istruzione che segue `int3`.' : e.classe === 'fault' ? 'Il programma riprende da ' + H(r) + ' e ripete `' + e.ist + '`, che ora trova la pagina e si completa.' : e.classe === 'interrupt' ? 'Il programma riprende da ' + H(r) + ', l’istruzione seguente.' : 'Il programma resta fermo. L’indirizzo ' + H(pc + 4) + ' esisterebbe, e tuttavia riprendere con uno stato forse rovinato produrrebbe risultati imprevedibili.', { calc: r ? 'RIP = ' + H(r) : 'ripresa non garantita', esito: [r ? 'RIP = ' + H(r) : 'ripresa non garantita', r ? 'si' : 'no'] });
      return { passi, esito: r };
    }
  },
  bilancio: {
    regola: [
      'Un interrupt arriva dall’esterno e viene accettato fra due istruzioni. Un fault nasce durante una istruzione, che resta incompiuta. Una trap viene segnalata dopo l’istruzione che la provoca. Un abort segnala un guasto grave.',
      'L’indirizzo salvato è quello dell’istruzione seguente per interrupt e trap, quello della stessa istruzione per un fault. Dopo un abort la ripresa non è garantita.'
    ],
    errori: [
      ['Trattare una trap come un fault.', 'Dopo `int3` si riprende dal byte seguente. Ripetere l’istruzione fermerebbe di nuovo il programma nello stesso punto.'],
      ['Usare sempre 4 byte per trovare la seguente.', 'La lunghezza dipende dall’istruzione. `int3` occupa un solo byte.'],
      ['Fidarsi dell’indirizzo salvato dopo un abort.', 'Un indirizzo numerico esiste comunque. Manca la garanzia che lo stato del programma sia integro.']
    ],
    saFare: ['Classifico un evento in una delle quattro classi.', 'Dico se l’istruzione è stata completata.', 'Calcolo l’indirizzo salvato per la ripresa.'],
    esercizi: [
      { d: 'Un programma di diagnosi mette `int3`, lunga un byte, all’indirizzo 0x5020. Quale indirizzo viene salvato quando il programma la esegue? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['5021', '0x5021', '5021h'],
        ok: 'Una trap viene segnalata dopo l’istruzione: 0x5020 + 1 = 0x5021.',
        diagnosi: [
          { se: ['5020', '0x5020', '5020h'], msg: 'Questo varrebbe per un fault. Una trap viene segnalata a istruzione terminata.' },
          { se: ['5024', '0x5024', '5024h'], msg: '`int3` occupa un solo byte.' }
        ],
        altro: 'Il valore è diverso. Dopo una trap si riprende dall’istruzione seguente, e `int3` occupa un byte.',
        indizi: ['`int3` provoca una trap.', 'Una trap viene segnalata dopo l’istruzione.', '0x5020 + 1.'],
        svolgimento: ['Classe: trap.', 'Lunghezza di `int3`: 1 byte.', 'Indirizzo salvato: 0x5021.'] },
      { d: 'Una istruzione `div` divide per zero. A quale classe appartiene l’evento?', guida: 'Scegli la risposta.', o: [
        { t: 'Fault', ok: true, fb: 'L’errore viene scoperto durante l’istruzione, prima che produca un risultato. L’indirizzo salvato è quello della `div`.' },
        { t: 'Trap', fb: 'Una trap viene segnalata dopo che l’istruzione ha finito. Qui la divisione non può produrre alcun risultato.' },
        { t: 'Interrupt', fb: 'Un interrupt arriva dall’esterno. Qui la causa è l’istruzione stessa.' },
        { t: 'Abort', fb: 'L’hardware funziona correttamente, e lo stato del programma è integro. L’errore sta nei dati del programma.' }] },
      { d: 'La tastiera segnala che è stato premuto un tasto. A quale classe appartiene l’evento?', guida: 'Scegli la risposta.', o: [
        { t: 'Interrupt', ok: true, fb: 'La richiesta arriva da una periferica, in un momento estraneo a ciò che il programma sta facendo.' },
        { t: 'Fault', fb: 'Un fault nasce da una istruzione che non riesce a completarsi. La tastiera è esterna al programma.' },
        { t: 'Trap', fb: 'Una trap è provocata da una istruzione del programma. La tastiera è esterna.' }] }
    ],
    sfida: ['cslez4_1_02_exceptions_02', 'Classificare fault, trap e interrupt']
  }
});
