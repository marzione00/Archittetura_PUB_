'use strict';
SL.registra('4.1.1', {
  titolo: 'Interruzione del flusso sequenziale',
  obiettivo: 'Obiettivo: indicare che cosa accade quando un evento sospende un programma, e da quale indirizzo il programma riprende dopo un interrupt del timer e dopo una pagina assente.',
  concetti: [['puntatore', 'Il flusso normale'], ['interrupt', 'La deviazione prodotta da un evento'], ['gate', 'Il gestore e la ripresa']],
  filigrana: ['interrupt', 'puntatore', 'gate'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 2.1.1', t: 'Il puntatore di istruzione', d: 'Il registro RIP contiene l’indirizzo della prossima istruzione da eseguire.' },
      { sim: 'privilegi', da: 'Dall’unità 2.5.1', t: 'Kernel e modo utente', d: 'Soltanto il kernel è eseguito nel modo privilegiato. I programmi ordinari sono eseguiti nel modo utente.' },
      { sim: 'memory', da: 'Dall’unità 2.5.4', t: 'La pagina', d: 'Il kernel assegna la memoria ai processi a blocchi di 4096 byte.' }
    ],
    domanda: { d: 'Prima di proseguire: un’istruzione di 4 byte ha inizio all’indirizzo 0x1010. A quale indirizzo ha inizio la successiva?', o: [
      { t: '0x1014', ok: true, fb: 'L’istruzione occupa i byte da 0x1010 a 0x1013, e la successiva ha inizio immediatamente dopo.' },
      { t: '0x1011', fb: 'L’istruzione occupa 4 byte, da 0x1010 a 0x1013.' },
      { t: '0x1020', fb: 'In base sedici 0x1010 + 4 dà 0x1014. Il valore 0x1020 dista 16 byte.' }
    ] }
  },
  idea: {
    titolo: 'Una deviazione seguita dal ritorno',
    termini: ['flusso di controllo eccezionale', 'gestore', 'interrupt', 'pagina assente'],
    testo: [
      'Un programma procede in sequenza: eseguita un’istruzione, il processore passa a quella che segue, oppure a quella indicata da un salto. In entrambi i casi la scelta dipende dal programma. Esistono tuttavia eventi estranei alle sue scelte: la scadenza di un intervallo di tempo, la disponibilità di un dato su una periferica, la richiesta di un dato mancante da parte di un’istruzione. Il processore deve reagire immediatamente, sospendendo il programma nel punto raggiunto.',
      'La reazione prende il nome di [[flusso di controllo eccezionale]]. Il processore sospende il programma, annota l’indirizzo dal quale potrà riprendere e passa a eseguire una routine del kernel predisposta per quell’evento, il [[gestore]]. Al termine del gestore il processore recupera l’indirizzo annotato e il programma prosegue, senza alcuna traccia della sospensione nei propri dati.',
      'Il primo esempio è l’[[interrupt]] del timer. Un circuito esterno al processore misura il tempo e a intervalli regolari richiede l’intervento del processore, in modo che il kernel possa assegnare il processore a un altro programma. La richiesta giunge in un istante qualunque. Il processore completa l’istruzione in corso, e soltanto dopo passa al gestore. L’indirizzo annotato è quello dell’istruzione seguente.',
      { fig: 'scena', w: 720, h: 232, titolo: 'Un interrupt del timer durante l’istruzione a 0x1010', nota: 'L’istruzione corrente è completata. Il programma riprende dalla seguente, a 0x1014.', els: SL.kern.flusso('g', 'irq', 0x1010, 4, { x: 10, y: 8, w: 224, gap: 14, h: 56 }) },
      'Il secondo esempio è la [[pagina assente]]. L’istruzione `mov rax, [rdi+8]` richiede un dato contenuto in una pagina di memoria ancora da predisporre. La lettura fallisce, e l’istruzione resta incompiuta. Il gestore predispone la pagina, poi il programma deve ripetere l’istruzione dall’inizio. In questo caso l’indirizzo annotato è quello dell’istruzione interrotta.',
      'La differenza risiede nel lavoro già compiuto. Dopo il timer l’istruzione è completa, e la sua ripetizione produrrebbe due volte il medesimo effetto. Dopo la pagina assente l’istruzione è incompleta, e la sua omissione lascerebbe RAX privo del dato. In entrambi i casi l’indirizzo salvato indica la prima operazione ancora da compiere.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento segue un programma durante l’esecuzione di tre istruzioni di 4 byte ciascuna. Durante quella centrale si verifica un evento: i controlli lo fissano fra l’interrupt del timer e la pagina assente.',
      'Si osserva quale indirizzo è salvato, l’azione del gestore e l’indirizzo dal quale il programma riprende. Dopo il caso proposto, è istruttivo modificare soltanto l’evento e confrontare i due indirizzi di ripresa.'
    ],
    vedrai: [
      ['puntatore', 'Il programma', 'In alto: tre istruzioni consecutive, con i rispettivi indirizzi.'],
      ['interrupt', 'L’evento e il gestore', 'Al centro: l’evento, la routine del kernel e l’indirizzo salvato.'],
      ['gate', 'La ripresa', 'In basso: il valore di RIP quando il programma riparte.']
    ]
  },
  lab: {
    titolo: 'Un evento durante un’istruzione',
    scena: { w: 860, h: 276 },
    atti: ['Il programma', 'L’evento', 'Il gestore', 'La ripresa'],
    controlli: [
      { id: 'evento', tipo: 'scelta', eti: 'Evento', opzioni: [['irq', 'interrupt del timer'], ['pf', 'pagina assente']], valore: 'irq' },
      { id: 'pc', tipo: 'scelta', eti: 'Indirizzo dell’istruzione', opzioni: [[0x1010, '0x1010'], [0x2040, '0x2040'], [0x40F8, '0x40F8']], valore: 0x1010 }
    ],
    nota: 'I passi sono sempre sei. Le tre istruzioni del modello occupano 4 byte ciascuna.',
    previsione: {
      domanda: (p) => 'L’istruzione corrente ha inizio a ' + SL.kern.H(p.pc) + ' e occupa 4 byte. ' + (p.evento === 'irq' ? 'Durante la sua esecuzione il timer richiede l’intervento del processore.' : 'Il dato richiesto si trova in una pagina assente.') + ' Da quale indirizzo riprenderà il programma dopo il gestore?',
      opzioni: (p) => [p.pc, p.pc + 4, p.pc + 8].map((v) => [v, SL.kern.H(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + SL.kern.H(pred) + '. Il programma riprende da ' + SL.kern.H(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.evento === 'irq' ? 'Il processore completa l’istruzione prima di servire il timer, e riprende dalla seguente.' : 'L’istruzione è rimasta incompiuta, e va ripetuta dall’inizio.'),
    costruisci(p) {
      const K = SL.kern, H = K.H, passi = [], pc = p.pc, irq = p.evento === 'irq', r = K.ripresa(p.evento, pc), ist = K.EVENTI[p.evento].ist;
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'PROGRAMMA IN MODO UTENTE', 'mono')].concat(K.flusso('q', p.evento, pc, f, { x: 20, y: 24, w: 264, gap: 14, h: 62 }));
      const hud = (f) => [['Istruzione corrente', H(pc), 'a'], ['Indirizzo salvato', f >= 2 ? H(r) : '·'], ['RIP alla ripresa', f >= 4 ? H(r) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Il programma avanza', 'Il programma ha appena eseguito l’istruzione a ' + H(pc - 4) + '. Ora il processore esegue `' + ist + '`, che ha inizio a ' + H(pc) + ' e occupa 4 byte. In assenza di eventi, la successiva sarà l’istruzione a ' + H(pc + 4) + '.',
        { chiedi: { d: 'L’istruzione corrente occupa i byte da ' + H(pc) + ' a ' + H(pc + 3) + '. A quale indirizzo ha inizio la seguente?', o: [H(pc + 1), H(pc + 4), H(pc + 8)], g: 1, no: 'La seguente ha inizio immediatamente dopo l’ultimo byte: ' + H(pc) + ' + 4 = ' + H(pc + 4) + '.' } });
      P(1, 1, 'L’evento', irq ? 'Mentre l’istruzione è in corso, il timer segnala la scadenza dell’intervallo. La richiesta resta in attesa per un breve tempo, poiché il processore completa l’istruzione iniziata: RAX riceve il nuovo valore.' : 'L’istruzione richiede il dato contenuto all’indirizzo RDI + 8. Tale indirizzo appartiene a una pagina assente, e la memoria non può rispondere. La lettura fallisce, e RAX resta invariato.', { calc: irq ? 'istruzione completata, poi il timer' : 'lettura fallita, istruzione incompiuta' });
      P(2, 1, 'L’indirizzo salvato', irq ? 'Il processore annota l’indirizzo dal quale il programma dovrà riprendere. L’istruzione a ' + H(pc) + ' è completata, e la prima operazione ancora da compiere è l’istruzione seguente.' : 'Il processore annota l’indirizzo dal quale il programma dovrà riprendere. L’istruzione a ' + H(pc) + ' è incompiuta, e la prima operazione ancora da compiere è l’istruzione stessa.', { calc: 'indirizzo salvato = ' + H(r) });
      P(3, 2, 'Il gestore', 'Il processore passa al modo privilegiato e inizia a eseguire il gestore, una routine del kernel. ' + (irq ? 'Il gestore del timer aggiorna l’ora e stabilisce se il programma può continuare oppure deve cedere il processore a un altro.' : 'Il gestore della pagina assente individua una pagina di memoria libera, la predispone e la collega all’indirizzo richiesto.') + ' Nel frattempo il programma è sospeso.', { calc: irq ? 'gestore del timer' : 'gestore della pagina assente' });
      P(4, 3, 'La ripresa', 'Il gestore è terminato. Il processore torna al modo utente e ripristina in RIP l’indirizzo salvato, ' + H(r) + '. ' + (irq ? 'Il programma prosegue con l’istruzione seguente, come se nessun evento si fosse verificato.' : 'Il programma ripete `' + ist + '`. La pagina è ora presente, la lettura riesce e RAX riceve il dato.'), { calc: 'RIP = ' + H(r), esito: ['RIP = ' + H(r), 'si'] });
      P(4, 3, 'La ragione dell’indirizzo salvato', irq ? 'La ripresa da ' + H(pc) + ' ripeterebbe un’istruzione già completata, e RAX sarebbe aumentato due volte. L’indirizzo ' + H(r) + ' è la prima operazione ancora da compiere.' : 'La ripresa da ' + H(pc + 4) + ' ometterebbe un’istruzione rimasta incompiuta, e RAX resterebbe privo del dato. L’indirizzo ' + H(r) + ' è la prima operazione ancora da compiere.', { calc: 'la prima operazione da compiere: ' + H(r), esito: ['RIP = ' + H(r), 'si'] });
      return { passi, esito: r };
    }
  },
  bilancio: {
    regola: [
      'Un evento può sospendere un programma fra un’istruzione e la successiva, oppure durante un’istruzione. Il processore salva l’indirizzo di ripresa, esegue il gestore del kernel e poi restituisce il controllo al programma.',
      'Dopo un interrupt il programma riprende dall’istruzione seguente, poiché quella in corso è stata completata. Dopo una pagina assente riprende dalla medesima istruzione, che va ripetuta.'
    ],
    errori: [
      ['Ritenere che un interrupt interrompa a metà l’istruzione in corso.', 'Il processore accetta la richiesta al confine fra due istruzioni, dopo avere completato quella in corso.'],
      ['Riprendere sempre dall’istruzione seguente.', 'Dopo una pagina assente l’istruzione è incompiuta. La sua omissione lascerebbe il programma privo del dato.'],
      ['Ritenere che il programma rilevi la sospensione.', 'Il gestore opera per conto del kernel. Al ritorno il programma ritrova i propri dati e prosegue.']
    ],
    saFare: ['Descrivere il percorso da un evento al gestore e il ritorno.', 'Calcolare l’indirizzo di ripresa dopo un interrupt.', 'Calcolare l’indirizzo di ripresa dopo una pagina assente.'],
    esercizi: [
      { d: 'Un’istruzione di 4 byte ha inizio all’indirizzo 0x3008. Durante la sua esecuzione si verifica un interrupt del timer. Quale indirizzo è salvato per la ripresa? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['300c', '0x300c', '300ch'],
        ok: 'L’istruzione è completata, e il programma riprende dalla seguente: 0x3008 + 4 = 0x300C.',
        diagnosi: [
          { se: ['3008', '0x3008', '3008h'], msg: 'Questo è l’indirizzo dell’istruzione in corso, che dopo un interrupt è già stata completata.' },
          { se: ['3012', '0x3012', '3012h'], msg: 'La somma va eseguita in base sedici: 8 + 4 dà C.' },
          { se: ['3009', '0x3009', '3009h'], msg: 'L’istruzione occupa 4 byte, e la seguente ha inizio dopo l’ultimo.' }
        ],
        altro: 'Il valore è diverso. Dopo un interrupt il programma riprende dall’istruzione seguente.',
        indizi: ['L’istruzione in corso è completata.', 'La seguente ha inizio 4 byte più avanti.', '0x3008 + 4.'],
        svolgimento: ['Istruzione in corso: da 0x3008 a 0x300B.', 'Dopo un interrupt il programma riprende dalla seguente.', 'Indirizzo salvato: 0x300C.'] },
      { d: 'La medesima istruzione, a 0x3008, incontra una pagina assente. Quale indirizzo è salvato? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['3008', '0x3008', '3008h'],
        ok: 'L’istruzione è rimasta incompiuta, e va ripetuta: l’indirizzo salvato è il suo.',
        diagnosi: [
          { se: ['300c', '0x300c', '300ch'], msg: 'Questo è l’indirizzo della seguente. Dopo una pagina assente l’istruzione interrotta va ripetuta.' }
        ],
        altro: 'Il valore è diverso. Dopo una pagina assente il programma ripete l’istruzione interrotta.',
        indizi: ['La lettura è fallita.', 'L’istruzione è incompiuta.', 'La ripresa avviene dalla medesima istruzione: 0x3008.'],
        svolgimento: ['La pagina manca, e l’istruzione resta incompiuta.', 'Il gestore predispone la pagina.', 'Indirizzo salvato: 0x3008.'] },
      { d: 'Si supponga che, dopo un interrupt del timer, il processore riprenda per errore dalla medesima istruzione, `add rax, 8`. Che cosa accadrebbe a RAX?', guida: 'Si scelga la risposta.', o: [
        { t: 'Sarebbe aumentato di 16 in luogo di 8', ok: true, fb: 'L’istruzione era già stata completata, e la sua ripetizione ne raddoppia l’effetto.' },
        { t: 'Resterebbe corretto, poiché l’istruzione è la medesima', fb: 'L’istruzione è la medesima, e per questa ragione il suo effetto sarebbe applicato due volte.' },
        { t: 'Sarebbe azzerato dal gestore', fb: 'Il gestore lascia invariati i dati del programma. L’errore risiederebbe nell’indirizzo di ripresa.' }] }
    ],
    sfida: ['cslez4_1_05_exceptions_05', 'Indirizzo del gestore, esecuzione e ritorno']
  }
});
