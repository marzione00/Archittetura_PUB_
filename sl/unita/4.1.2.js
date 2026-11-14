'use strict';
SL.registra('4.1.2', {
  titolo: 'Interrupt, fault, trap e abort',
  obiettivo: 'Obiettivo: classificare un evento come interrupt, fault, trap o abort, e indicare per ciascuna classe l’indirizzo salvato per la ripresa.',
  concetti: [['interrupt', 'Dall’esterno oppure dall’istruzione'], ['lente', 'Durante oppure dopo'], ['conflitto', 'L’assenza di ripresa']],
  filigrana: ['interrupt', 'conflitto', 'lente'],
  richiami: {
    carte: [
      { sim: 'gate', da: 'Dall’unità 4.1.1', t: 'Il gestore', d: 'Routine del kernel che serve un evento. Al termine il programma riprende dall’indirizzo salvato.' },
      { sim: 'interrupt', da: 'Dall’unità 4.1.1', t: 'Due riprese diverse', d: 'Dopo il timer il programma prosegue con l’istruzione seguente. Dopo una pagina assente ripete l’istruzione interrotta.' },
      { sim: 'conflitto', da: 'Dall’unità 2.2.3', t: 'L’eccezione del processore', d: 'Evento provocato da un’istruzione, come la divisione per zero, che trasferisce il controllo al sistema operativo.' }
    ],
    domanda: { d: 'Prima di proseguire: un interrupt del timer si verifica durante un’istruzione di 4 byte che ha inizio a 0x2040. Quale indirizzo è salvato?', o: [
      { t: '0x2044', ok: true, fb: 'L’istruzione è completata, e il programma riprende dalla seguente.' },
      { t: '0x2040', fb: 'Questo indirizzo sarebbe salvato se l’istruzione fosse rimasta incompiuta, come dopo una pagina assente.' },
      { t: '0x2041', fb: 'L’istruzione occupa 4 byte, e la seguente ha inizio dopo l’ultimo.' }
    ] }
  },
  idea: {
    titolo: 'Quattro classi di eventi',
    termini: ['fault', 'trap', 'breakpoint', 'abort'],
    testo: [
      'Gli eventi che deviano il flusso si distinguono per il loro rapporto con l’istruzione in corso. Gli interrupt provengono dall’esterno, da un timer o da una periferica, e sono estranei all’attività del programma. Le [[eccezione del processore|eccezioni]] derivano invece dall’istruzione stessa, e si dividono in tre classi.',
      'Un [[fault]] è rilevato mentre l’istruzione è in corso, prima che abbia prodotto effetti. La pagina assente è un fault, e lo è anche la divisione per zero. L’indirizzo salvato è quello dell’istruzione che ha fallito, poiché il gestore può rimuovere la causa e farla ripetere. Quando la causa è irrimediabile, come nella divisione per zero, il gestore termina il programma, e l’indirizzo salvato indica il punto in cui è avvenuto l’errore.',
      'Una [[trap]] è segnalata dopo il termine dell’istruzione. L’esempio classico è `int3`, un’istruzione di un solo byte che i programmi di diagnosi inseriscono nel punto in cui intendono arrestare un programma. Tale punto prende il nome di [[breakpoint]]. L’istruzione ha compiuto la propria funzione, che consiste nel chiamare il gestore, e l’indirizzo salvato è quello dell’istruzione seguente.',
      { fig: 'scena', w: 720, h: 196, titolo: 'Le quattro classi a confronto', nota: 'L’istruzione ha inizio a 0x1010. Le istruzioni ordinarie occupano 4 byte, int3 ne occupa 1.', els: (() => {
        const el = SL.el, els = [], col = ['origine', 'momento', 'indirizzo salvato'], righe = [['interrupt', ['esterna', 'fra due istruzioni', '0x1014'], 'on'], ['fault', ['l’istruzione', 'durante', '0x1010'], 'att'], ['trap', ['l’istruzione', 'dopo', '0x1011'], 'on'], ['abort', ['un guasto', 'imprevedibile', 'inaffidabile'], 'err']];
        col.forEach((c, k) => els.push(el.nota('gh' + k, 136 + k * 196, 0, c, 'mono minuta')));
        righe.forEach((r, j) => { els.push(el.nota('gn' + j, 10, 34 + j * 40, r[0], 'mono minuta', r[2] === 'on' ? '' : r[2])); r[1].forEach((v, k) => els.push(el.cella('gc' + j + '_' + k, 130 + k * 196, 26 + j * 40, 184, 30, v, r[2], { piccola: true, cls: 'minuta' }))); });
        return els; })() },
      'Un [[abort]] segnala un guasto grave, per esempio un errore dell’hardware che ha alterato i dati interni del processore. Lo stato del programma può essere compromesso, e nessun indirizzo salvato garantisce una ripresa corretta. Di norma il kernel termina il programma, oppure arresta l’intero sistema.',
      'La classe determina quindi la sorte dell’istruzione: completata e superata per un interrupt e per una trap, da ripetere per un fault, perduta per un abort.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento riprende il programma dell’unità precedente, e durante l’istruzione centrale produce quattro eventi diversi: un breakpoint, una pagina assente, un interrupt del timer e un guasto grave.',
      'Per ciascuno si osservano la classe, l’istante della segnalazione e l’indirizzo salvato. Dopo il caso proposto, è istruttivo esaminare il guasto grave e osservare che cosa manca.'
    ],
    vedrai: [
      ['puntatore', 'Il programma', 'In alto: tre istruzioni consecutive. Quella centrale dipende dall’evento scelto.'],
      ['interrupt', 'L’evento', 'Al centro: l’evento, il gestore e l’indirizzo salvato.'],
      ['lente', 'La classe e la ripresa', 'In basso: la classe dell’evento e la sorte dell’istruzione.']
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
      domanda: (p) => { const e = SL.kern.EVENTI[p.evento]; return 'L’istruzione `' + e.ist + '` ha inizio a ' + SL.kern.H(p.pc) + ' e occupa ' + (e.lung === 1 ? 'un byte' : e.lung + ' byte') + '. L’evento è: ' + e.nome + '. Quale indirizzo è salvato per la ripresa?'; },
      opzioni: (p) => [[p.pc, SL.kern.H(p.pc) + ', la medesima istruzione'], [p.pc + 1, SL.kern.H(p.pc + 1)], [p.pc + 4, SL.kern.H(p.pc + 4)], [0, 'Nessuno affidabile']]
    },
    confronto: (pred, esito, p) => { const K = SL.kern, e = K.EVENTI[p.evento], N = (v) => (v ? K.H(v) : 'nessun indirizzo affidabile'); return 'La previsione indicava ' + N(pred) + '. L’esito è ' + N(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : e.classe === 'trap' ? 'Una trap è segnalata dopo l’istruzione, e `int3` occupa un solo byte.' : e.classe === 'fault' ? 'Un fault lascia l’istruzione incompiuta, e l’indirizzo salvato è il suo.' : e.classe === 'interrupt' ? 'Un interrupt è accettato dopo l’istruzione in corso, che occupa 4 byte.' : 'Dopo un abort lo stato può essere compromesso, e nessun indirizzo garantisce la ripresa.'); },
    costruisci(p) {
      const K = SL.kern, H = K.H, passi = [], pc = p.pc, e = K.EVENTI[p.evento], r = K.ripresa(p.evento, pc), R = r ? H(r) : 'inaffidabile';
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'PROGRAMMA IN MODO UTENTE', 'mono')].concat(K.flusso('q', p.evento, pc, f, { x: 20, y: 24, w: 264, gap: 14, h: 62, classe: true }));
      const hud = (f) => [['Evento', e.nome, 'a'], ['Classe', f >= 1 ? e.classe : '·'], ['Indirizzo salvato', f >= 2 ? R : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'L’istruzione in corso', 'Il processore esegue `' + e.ist + '`, che ha inizio a ' + H(pc) + ' e occupa ' + (e.lung === 1 ? 'un solo byte' : e.lung + ' byte') + '. L’istruzione seguente ha inizio a ' + H(pc + e.lung) + '.' + (p.evento === 'bp' ? ' Un programma di diagnosi ha inserito `int3` per arrestare il programma in questo punto.' : ''),
        { chiedi: { d: 'L’evento sarà: ' + e.nome + '. Qual è la sua origine?', o: ['Dall’esterno del processore', 'Dall’istruzione in corso', 'Da un guasto'], g: p.evento === 'irq' ? 0 : p.evento === 'abort' ? 2 : 1, no: p.evento === 'irq' ? 'Il timer è un circuito esterno, estraneo all’attività del programma.' : p.evento === 'abort' ? 'Un guasto grave è indipendente dall’istruzione in corso e dalle richieste delle periferiche.' : 'L’evento è provocato dall’istruzione stessa.' } });
      P(1, 1, 'La classe', p.evento === 'bp' ? '`int3` è eseguita per intero, e il suo effetto consiste nel chiamare il gestore. L’evento è segnalato dopo l’istruzione: è una trap.' : p.evento === 'pf' ? 'La lettura dalla memoria fallisce mentre l’istruzione è in corso, prima che RAX sia stato scritto. L’evento è rilevato durante l’istruzione: è un fault.' : p.evento === 'irq' ? 'La richiesta del timer proviene dall’esterno. Il processore completa l’istruzione in corso e accetta la richiesta al confine con la seguente: è un interrupt.' : 'Un circuito di controllo segnala un errore dell’hardware. L’evento è indipendente dal programma, e lo stato del processore può essere compromesso: è un abort.', { calc: 'classe: ' + e.classe });
      P(2, 2, 'L’indirizzo salvato', e.classe === 'trap' ? 'Dopo una trap l’istruzione è completata. L’indirizzo salvato è quello della seguente: ' + H(pc) + ' + 1 = ' + H(r) + '.' : e.classe === 'fault' ? 'Dopo un fault l’istruzione è incompiuta. L’indirizzo salvato è il suo, ' + H(r) + ', poiché andrà ripetuta.' : e.classe === 'interrupt' ? 'L’istruzione è stata completata. L’indirizzo salvato è quello della seguente: ' + H(pc) + ' + 4 = ' + H(r) + '.' : 'Il processore salva un indirizzo, che può tuttavia essere privo di valore: dopo un guasto l’integrità di registri e memoria non è garantita.', { calc: 'indirizzo salvato: ' + R });
      P(3, 2, 'Il gestore', p.evento === 'bp' ? 'Il gestore trasferisce il controllo al programma di diagnosi, che può mostrare registri e memoria del programma arrestato.' : p.evento === 'pf' ? 'Il gestore predispone la pagina mancante e la collega all’indirizzo richiesto.' : p.evento === 'irq' ? 'Il gestore del timer aggiorna l’ora e stabilisce a quale programma assegnare il processore.' : 'Il gestore registra il guasto. Di norma termina il programma, oppure arresta l’intero sistema.', { calc: 'gestore in esecuzione' });
      P(4, 3, r ? 'La ripresa' : 'Nessuna ripresa', e.classe === 'trap' ? 'Il programma riprende da ' + H(r) + ', l’istruzione che segue `int3`.' : e.classe === 'fault' ? 'Il programma riprende da ' + H(r) + ' e ripete `' + e.ist + '`, che ora trova la pagina e giunge a completamento.' : e.classe === 'interrupt' ? 'Il programma riprende da ' + H(r) + ', l’istruzione seguente.' : 'Il programma resta arrestato. L’indirizzo ' + H(pc + 4) + ' esisterebbe, e tuttavia una ripresa con uno stato forse compromesso produrrebbe risultati imprevedibili.', { calc: r ? 'RIP = ' + H(r) : 'ripresa non garantita', esito: [r ? 'RIP = ' + H(r) : 'ripresa non garantita', r ? 'si' : 'no'] });
      return { passi, esito: r };
    }
  },
  bilancio: {
    regola: [
      'Un interrupt proviene dall’esterno ed è accettato fra due istruzioni. Un fault si verifica durante un’istruzione, che resta incompiuta. Una trap è segnalata dopo l’istruzione che la provoca. Un abort segnala un guasto grave.',
      'L’indirizzo salvato è quello dell’istruzione seguente per interrupt e trap, quello della medesima istruzione per un fault. Dopo un abort la ripresa è priva di garanzie.'
    ],
    errori: [
      ['Trattare una trap come un fault.', 'Dopo `int3` il programma riprende dal byte seguente. La ripetizione dell’istruzione arresterebbe di nuovo il programma nel medesimo punto.'],
      ['Impiegare sempre 4 byte per individuare la seguente.', 'La lunghezza dipende dall’istruzione. `int3` occupa un solo byte.'],
      ['Ritenere affidabile l’indirizzo salvato dopo un abort.', 'Un indirizzo numerico esiste comunque. Manca la garanzia dell’integrità dello stato del programma.']
    ],
    saFare: ['Classificare un evento in una delle quattro classi.', 'Indicare se l’istruzione è stata completata.', 'Calcolare l’indirizzo salvato per la ripresa.'],
    esercizi: [
      { d: 'Un programma di diagnosi inserisce `int3`, lunga un byte, all’indirizzo 0x5020. Quale indirizzo è salvato quando il programma la esegue? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['5021', '0x5021', '5021h'],
        ok: 'Una trap è segnalata dopo l’istruzione: 0x5020 + 1 = 0x5021.',
        diagnosi: [
          { se: ['5020', '0x5020', '5020h'], msg: 'Ciò varrebbe per un fault. Una trap è segnalata a istruzione terminata.' },
          { se: ['5024', '0x5024', '5024h'], msg: '`int3` occupa un solo byte.' }
        ],
        altro: 'Il valore è diverso. Dopo una trap il programma riprende dall’istruzione seguente, e `int3` occupa un byte.',
        indizi: ['`int3` provoca una trap.', 'Una trap è segnalata dopo l’istruzione.', '0x5020 + 1.'],
        svolgimento: ['Classe: trap.', 'Lunghezza di `int3`: 1 byte.', 'Indirizzo salvato: 0x5021.'] },
      { d: 'Un’istruzione `div` divide per zero. A quale classe appartiene l’evento?', guida: 'Si scelga la risposta.', o: [
        { t: 'Fault', ok: true, fb: 'L’errore è rilevato durante l’istruzione, prima che produca un risultato. L’indirizzo salvato è quello della `div`.' },
        { t: 'Trap', fb: 'Una trap è segnalata dopo il termine dell’istruzione. In questo caso la divisione non può produrre alcun risultato.' },
        { t: 'Interrupt', fb: 'Un interrupt proviene dall’esterno. In questo caso la causa è l’istruzione stessa.' },
        { t: 'Abort', fb: 'L’hardware funziona correttamente, e lo stato del programma è integro. L’errore risiede nei dati del programma.' }] },
      { d: 'La tastiera segnala la pressione di un tasto. A quale classe appartiene l’evento?', guida: 'Si scelga la risposta.', o: [
        { t: 'Interrupt', ok: true, fb: 'La richiesta proviene da una periferica, in un istante estraneo all’attività del programma.' },
        { t: 'Fault', fb: 'Un fault deriva da un’istruzione che non riesce a completarsi. La tastiera è esterna al programma.' },
        { t: 'Trap', fb: 'Una trap è provocata da un’istruzione del programma. La tastiera è esterna.' }] }
    ],
    sfida: ['cslez4_1_02_exceptions_02', 'Classificare fault, trap e interrupt']
  }
});
