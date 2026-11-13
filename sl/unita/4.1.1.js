'use strict';
SL.registra('4.1.1', {
  titolo: 'Interruzione del flusso sequenziale',
  obiettivo: 'Alla fine saprai dire che cosa accade quando un evento sospende un programma, e da quale indirizzo il programma riprende dopo un interrupt del timer e dopo una pagina assente.',
  concetti: [['puntatore', 'Il flusso normale'], ['interrupt', 'Un evento lo devia'], ['gate', 'Il gestore e la ripresa']],
  filigrana: ['interrupt', 'puntatore', 'gate'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 2.1.1', t: 'Il puntatore di istruzione', d: 'Il registro RIP contiene l’indirizzo della prossima istruzione da eseguire.' },
      { sim: 'privilegi', da: 'Dall’unità 2.5.1', t: 'Kernel e modo utente', d: 'Soltanto il kernel gira nel modo privilegiato. I programmi ordinari girano nel modo utente.' },
      { sim: 'memory', da: 'Dall’unità 2.5.4', t: 'La pagina', d: 'Il kernel distribuisce la memoria ai processi a blocchi di 4096 byte.' }
    ],
    domanda: { d: 'Prima di proseguire: una istruzione di 4 byte comincia all’indirizzo 0x1010. A quale indirizzo comincia la successiva?', o: [
      { t: '0x1014', ok: true, fb: 'L’istruzione occupa i byte da 0x1010 a 0x1013, e la successiva comincia subito dopo.' },
      { t: '0x1011', fb: 'L’istruzione occupa 4 byte, da 0x1010 a 0x1013.' },
      { t: '0x1020', fb: 'In base sedici 0x1010 + 4 fa 0x1014. Il valore 0x1020 dista 16 byte.' }
    ] }
  },
  idea: {
    titolo: 'Una deviazione, poi il ritorno',
    termini: ['flusso di controllo eccezionale', 'gestore', 'interrupt', 'pagina assente'],
    testo: [
      'Un programma procede in fila: eseguita una istruzione, il processore passa a quella che segue, oppure a quella indicata da un salto. In entrambi i casi decide il programma. Esistono però eventi estranei alle sue decisioni: scade un intervallo di tempo, una periferica ha un dato pronto, una istruzione chiede un dato che manca. Il processore deve reagire subito, lasciando il programma dov’è.',
      'La reazione si chiama [[flusso di controllo eccezionale]]. Il processore sospende il programma, annota l’indirizzo da cui potrà riprendere e passa a eseguire una routine del kernel preparata per quell’evento, il [[gestore]]. Quando il gestore ha finito, il processore recupera l’indirizzo annotato e il programma prosegue, ignaro della sospensione.',
      'Il primo esempio è l’[[interrupt]] del timer. Un circuito esterno al processore misura il tempo e a intervalli regolari chiede attenzione, così che il kernel possa affidare il processore a un altro programma. La richiesta arriva in un momento qualunque. Il processore completa l’istruzione che sta eseguendo, e soltanto dopo passa al gestore. L’indirizzo annotato è quello dell’istruzione seguente.',
      { fig: 'scena', w: 720, h: 232, titolo: 'Un interrupt del timer durante l’istruzione a 0x1010', nota: 'L’istruzione corrente viene completata. Il programma riprende dalla seguente, a 0x1014.', els: SL.kern.flusso('g', 'irq', 0x1010, 4, { x: 10, y: 8, w: 224, gap: 14, h: 56 }) },
      'Il secondo esempio è la [[pagina assente]]. L’istruzione `mov rax, [rdi+8]` chiede un dato che sta in una pagina di memoria ancora da preparare. La lettura fallisce, e l’istruzione resta incompiuta. Il gestore prepara la pagina, poi il programma deve ripetere l’istruzione dall’inizio. Questa volta l’indirizzo annotato è quello dell’istruzione interrotta.',
      'La differenza sta nel lavoro già fatto. Dopo il timer l’istruzione è completa, e ripeterla produrrebbe due volte lo stesso effetto. Dopo la pagina assente l’istruzione è incompleta, e saltarla lascerebbe RAX senza il dato. In tutti e due i casi l’indirizzo salvato indica il primo lavoro ancora da fare.'
    ]
  },
  esperimento: {
    faremo: [
      'Seguiremo un programma mentre esegue tre istruzioni di 4 byte ciascuna. Durante quella centrale accadrà un evento: sceglierai fra l’interrupt del timer e la pagina assente.',
      'Guarderemo quale indirizzo viene salvato, che cosa fa il gestore e da dove il programma riprende. Dopo il caso proposto, cambia soltanto l’evento e confronta i due indirizzi di ripresa.'
    ],
    vedrai: [
      ['puntatore', 'Il programma', 'In alto: tre istruzioni consecutive, con il loro indirizzo.'],
      ['interrupt', 'L’evento e il gestore', 'Al centro: che cosa è accaduto, la routine del kernel e l’indirizzo salvato.'],
      ['gate', 'La ripresa', 'In basso: il valore di RIP quando il programma riparte.']
    ]
  },
  lab: {
    titolo: 'Un evento durante una istruzione',
    scena: { w: 860, h: 276 },
    atti: ['Il programma', 'L’evento', 'Il gestore', 'La ripresa'],
    controlli: [
      { id: 'evento', tipo: 'scelta', eti: 'Evento', opzioni: [['irq', 'interrupt del timer'], ['pf', 'pagina assente']], valore: 'irq' },
      { id: 'pc', tipo: 'scelta', eti: 'Indirizzo dell’istruzione', opzioni: [[0x1010, '0x1010'], [0x2040, '0x2040'], [0x40F8, '0x40F8']], valore: 0x1010 }
    ],
    nota: 'I passi sono sempre sei. Le tre istruzioni del modello occupano 4 byte ciascuna.',
    previsione: {
      domanda: (p) => 'L’istruzione corrente comincia a ' + SL.kern.H(p.pc) + ' e occupa 4 byte. ' + (p.evento === 'irq' ? 'Mentre viene eseguita, il timer chiede attenzione.' : 'Il dato che chiede si trova in una pagina assente.') + ' Da quale indirizzo riprenderà il programma dopo il gestore?',
      opzioni: (p) => [p.pc, p.pc + 4, p.pc + 8].map((v) => [v, SL.kern.H(v)])
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + SL.kern.H(pred) + '. Il programma riprende da ' + SL.kern.H(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.evento === 'irq' ? 'Il processore completa l’istruzione prima di servire il timer, e riprende dalla seguente.' : 'L’istruzione è rimasta incompiuta, e va ripetuta dall’inizio.'),
    costruisci(p) {
      const K = SL.kern, H = K.H, passi = [], pc = p.pc, irq = p.evento === 'irq', r = K.ripresa(p.evento, pc), ist = K.EVENTI[p.evento].ist;
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'PROGRAMMA IN MODO UTENTE', 'mono')].concat(K.flusso('q', p.evento, pc, f, { x: 20, y: 24, w: 264, gap: 14, h: 62 }));
      const hud = (f) => [['Istruzione corrente', H(pc), 'a'], ['Indirizzo salvato', f >= 2 ? H(r) : '·'], ['RIP alla ripresa', f >= 4 ? H(r) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Il programma avanza', 'Il programma ha appena eseguito l’istruzione a ' + H(pc - 4) + '. Ora il processore esegue `' + ist + '`, che comincia a ' + H(pc) + ' e occupa 4 byte. Se nulla accade, dopo di lei toccherà all’istruzione a ' + H(pc + 4) + '.',
        { chiedi: { d: 'L’istruzione corrente occupa i byte da ' + H(pc) + ' a ' + H(pc + 3) + '. Dove comincia la seguente?', o: [H(pc + 1), H(pc + 4), H(pc + 8)], g: 1, no: 'La seguente comincia subito dopo l’ultimo byte: ' + H(pc) + ' + 4 = ' + H(pc + 4) + '.' } });
      P(1, 1, 'L’evento', irq ? 'Mentre l’istruzione è in corso, il timer segnala che l’intervallo è scaduto. La richiesta resta in attesa per qualche istante, perché il processore porta a termine l’istruzione che ha cominciato: RAX riceve il nuovo valore.' : 'L’istruzione chiede il dato che si trova all’indirizzo RDI + 8. Quell’indirizzo cade in una pagina assente, e la memoria non può rispondere. La lettura fallisce, e RAX resta com’era.', { calc: irq ? 'istruzione completata, poi il timer' : 'lettura fallita, istruzione incompiuta' });
      P(2, 1, 'L’indirizzo salvato', irq ? 'Il processore annota l’indirizzo da cui il programma dovrà riprendere. L’istruzione a ' + H(pc) + ' è finita, e il primo lavoro ancora da fare è l’istruzione seguente.' : 'Il processore annota l’indirizzo da cui il programma dovrà riprendere. L’istruzione a ' + H(pc) + ' è incompiuta, e il primo lavoro ancora da fare è proprio lei.', { calc: 'indirizzo salvato = ' + H(r) });
      P(3, 2, 'Il gestore', 'Il processore passa al modo privilegiato e comincia a eseguire il gestore, una routine del kernel. ' + (irq ? 'Il gestore del timer aggiorna l’ora e decide se il programma può continuare oppure deve cedere il processore a un altro.' : 'Il gestore della pagina assente trova una pagina di memoria libera, la prepara e la collega all’indirizzo richiesto.') + ' Il programma intanto è fermo.', { calc: irq ? 'gestore del timer' : 'gestore della pagina assente' });
      P(4, 3, 'La ripresa', 'Il gestore ha finito. Il processore torna al modo utente e rimette in RIP l’indirizzo salvato, ' + H(r) + '. ' + (irq ? 'Il programma prosegue con l’istruzione seguente, come se nulla fosse accaduto.' : 'Il programma ripete `' + ist + '`. Ora la pagina esiste, la lettura riesce e RAX riceve il dato.'), { calc: 'RIP = ' + H(r), esito: ['RIP = ' + H(r), 'si'] });
      P(4, 3, 'Perché quell’indirizzo', irq ? 'Riprendere da ' + H(pc) + ' ripeterebbe una istruzione già completata, e RAX verrebbe aumentato due volte. L’indirizzo ' + H(r) + ' è il primo lavoro ancora da fare.' : 'Riprendere da ' + H(pc + 4) + ' salterebbe una istruzione rimasta incompiuta, e RAX resterebbe senza il dato. L’indirizzo ' + H(r) + ' è il primo lavoro ancora da fare.', { calc: 'il primo lavoro ancora da fare: ' + H(r), esito: ['RIP = ' + H(r), 'si'] });
      return { passi, esito: r };
    }
  },
  bilancio: {
    regola: [
      'Un evento può sospendere un programma fra una istruzione e l’altra, oppure durante una istruzione. Il processore salva l’indirizzo di ripresa, esegue il gestore del kernel e poi restituisce il controllo al programma.',
      'Dopo un interrupt il programma riprende dall’istruzione seguente, perché quella in corso è stata completata. Dopo una pagina assente riprende dalla stessa istruzione, che va ripetuta.'
    ],
    errori: [
      ['Pensare che un interrupt tronchi l’istruzione in corso.', 'Il processore accetta la richiesta al confine fra due istruzioni, dopo aver completato quella in corso.'],
      ['Riprendere sempre dall’istruzione seguente.', 'Dopo una pagina assente l’istruzione è incompiuta. Saltarla lascerebbe il programma senza il dato.'],
      ['Credere che il programma si accorga della sospensione.', 'Il gestore lavora per conto del kernel. Al ritorno il programma ritrova i propri dati e prosegue.']
    ],
    saFare: ['Descrivo il percorso da un evento al gestore e ritorno.', 'Calcolo l’indirizzo di ripresa dopo un interrupt.', 'Calcolo l’indirizzo di ripresa dopo una pagina assente.'],
    esercizi: [
      { d: 'Una istruzione di 4 byte comincia all’indirizzo 0x3008. Mentre viene eseguita arriva un interrupt del timer. Quale indirizzo viene salvato per la ripresa? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['300c', '0x300c', '300ch'],
        ok: 'L’istruzione viene completata, e il programma riprende dalla seguente: 0x3008 + 4 = 0x300C.',
        diagnosi: [
          { se: ['3008', '0x3008', '3008h'], msg: 'Questo è l’indirizzo dell’istruzione in corso, che dopo un interrupt è già stata completata.' },
          { se: ['3012', '0x3012', '3012h'], msg: 'La somma va fatta in base sedici: 8 + 4 fa C.' },
          { se: ['3009', '0x3009', '3009h'], msg: 'L’istruzione occupa 4 byte, e la seguente comincia dopo l’ultimo.' }
        ],
        altro: 'Il valore è diverso. Dopo un interrupt si riprende dall’istruzione seguente.',
        indizi: ['L’istruzione in corso viene completata.', 'La seguente comincia 4 byte più avanti.', '0x3008 + 4.'],
        svolgimento: ['Istruzione in corso: da 0x3008 a 0x300B.', 'Dopo un interrupt si riprende dalla seguente.', 'Indirizzo salvato: 0x300C.'] },
      { d: 'La stessa istruzione, a 0x3008, incontra invece una pagina assente. Quale indirizzo viene salvato? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['3008', '0x3008', '3008h'],
        ok: 'L’istruzione è rimasta incompiuta, e va ripetuta: l’indirizzo salvato è il suo.',
        diagnosi: [
          { se: ['300c', '0x300c', '300ch'], msg: 'Questo è l’indirizzo della seguente. Dopo una pagina assente l’istruzione interrotta va ripetuta.' }
        ],
        altro: 'Il valore è diverso. Dopo una pagina assente il programma ripete l’istruzione interrotta.',
        indizi: ['La lettura è fallita.', 'L’istruzione è incompiuta.', 'Si riprende da lei: 0x3008.'],
        svolgimento: ['La pagina manca, e l’istruzione resta incompiuta.', 'Il gestore prepara la pagina.', 'Indirizzo salvato: 0x3008.'] },
      { d: 'Dopo un interrupt del timer il processore riprendesse per errore dalla stessa istruzione, `add rax, 8`. Che cosa accadrebbe a RAX?', guida: 'Scegli la risposta.', o: [
        { t: 'Verrebbe aumentato di 16 al posto di 8', ok: true, fb: 'L’istruzione era già stata completata, e ripeterla ne raddoppia l’effetto.' },
        { t: 'Resterebbe corretto, perché l’istruzione è la stessa', fb: 'L’istruzione è la stessa, e proprio per questo il suo effetto si sommerebbe due volte.' },
        { t: 'Verrebbe azzerato dal gestore', fb: 'Il gestore lascia i dati del programma come li ha trovati. L’errore starebbe nell’indirizzo di ripresa.' }] }
    ],
    sfida: ['cslez4_1_05_exceptions_05', 'Indirizzo del gestore, esecuzione e ritorno']
  }
});
