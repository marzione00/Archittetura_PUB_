'use strict';
SL.unita545 = (() => {
  const vivi = (p) => (p.g === 'no' ? 3 : p.org === 'thread' ? 0 : 2);
  // fase: 0 il servizio · 1 l'accesso · 2 il segnale · 3 chi resta
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], th = p.org === 'thread', guasto = p.g !== 'no', w3 = (o.w - 20) / 3;
    els.push(el.box(pre + 's', o.x, o.y, o.w, 46, 'supervisore · processo separato', f >= 3 && guasto ? 'attivo · può riavviare' : 'attivo', f >= 3 && guasto ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.nota(pre + 't', o.x, o.y + 60, th ? 'UN PROCESSO · tre thread, una sola memoria' : 'TRE PROCESSI · ciascuno con la propria memoria', 'mono'));
    ['A', 'B', 'C'].forEach((n, k) => { const colp = guasto && n === p.g, morto = f >= 2 && guasto && (th || colp); els.push(el.box(pre + n, o.x + k * (w3 + 10), o.y + 84, w3, 54, 'lavoratore ' + n + (th ? ' · thread' : ' · processo'), morto ? 'terminato' : f >= 1 && colp ? 'accesso vietato' : 'serve richieste', morto ? 'err' : f === 1 && colp ? 'att' : 'on', { cls: 'stretta' })); });
    return els;
  };
  return { vivi, quadro };
})();
SL.registra('5.4.5', {
  titolo: 'Isolamento dei guasti in processi e thread',
  obiettivo: 'Obiettivo: prevedere quali lavoratori di un servizio sopravvivono a un errore di memoria, secondo che siano thread di un processo oppure processi distinti.',
  concetti: [['thread', 'I thread terminano insieme'], ['scudo', 'Il confine è il processo'], ['process', 'Processi separati, a costo maggiore']],
  filigrana: ['scudo', 'thread', 'process'],
  richiami: {
    carte: [
      { sim: 'thread', da: 'Dall’unità 5.4.1', t: 'La memoria condivisa', d: 'I thread di un processo hanno una sola mappa della memoria.' },
      { sim: 'process', da: 'Dall’unità 5.1.1', t: 'L’isolamento fra processi', d: 'Ogni processo ha il proprio spazio di indirizzamento.' },
      { sim: 'interrupt', da: 'Dall’unità 4.1.2', t: 'Il fault', d: 'L’eccezione sollevata da un’istruzione che non può essere eseguita, come un accesso a memoria vietata.' }
    ],
    domanda: { d: 'Prima di proseguire: un thread scrive per errore su una struttura impiegata da un altro thread del medesimo processo. Il kernel può impedirlo?', o: [
      { t: 'No, per il kernel quella memoria appartiene a entrambi', ok: true, fb: 'La protezione della memoria agisce fra processi. Fra i thread di un medesimo processo è assente.' },
      { t: 'Sì, ogni thread ha la propria tabella delle pagine', fb: 'La tabella delle pagine è una sola per tutto il processo.' },
      { t: 'Sì, se i thread hanno priorità diverse', fb: 'La priorità riguarda il processore, senza alcun effetto sulla protezione della memoria.' }
    ] }
  },
  idea: {
    titolo: 'L’estensione di un guasto',
    termini: ['sigsegv', 'isolamento dei guasti'],
    testo: [
      'Un servizio che risponde a molte richieste le distribuisce fra più lavoratori, che possono essere thread di un solo processo oppure processi distinti. I thread comunicano agevolmente, poiché hanno la memoria in comune, e hanno un costo ridotto. I processi devono scambiare i dati attraverso canali predisposti dal kernel, come le pipe, e hanno un costo maggiore. La differenza principale emerge tuttavia in presenza di un errore.',
      'Si supponga che il lavoratore B, per un difetto del programma, tenti di leggere una pagina di memoria alla quale non ha diritto di accesso. Il processore solleva un fault, e il kernel lo comunica al responsabile con un avviso denominato [[sigsegv|SIGSEGV]]. Se il programma non ha previsto altro, la reazione è la terminazione. Termina il processo che contiene il responsabile, nella sua interezza, poiché una memoria in cui si è verificato un accesso errato non offre più garanzie ad alcuno dei suoi thread.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Tre thread nel medesimo processo, e B commette l’errore', nota: 'Il processo è terminato, e con esso A e C, estranei all’errore. Il supervisore, che è un altro processo, resta attivo.', els: SL.unita545.quadro('g', { org: 'thread', g: 'B' }, 3, { x: 10, y: 0, w: 700 }) },
      'Il confine del danno coincide pertanto con il confine del processo. Se A, B e C sono thread del medesimo processo, terminano tutti e tre, e le richieste che A e C stavano servendo sono perdute. Se sono tre processi, termina soltanto B, mentre A e C conservano la propria memoria e proseguono il servizio. Tale proprietà prende il nome di [[isolamento dei guasti]].',
      'In entrambe le organizzazioni è opportuno un supervisore: un processo separato che ha avviato i lavoratori, ne raccoglie la terminazione con waitpid, e li riavvia. Poiché è esterno al processo guasto, sopravvive in ogni caso. La scelta fra thread e processi è dunque un compromesso fra efficienza e robustezza. Molti programmi impiegano thread per le parti che devono collaborare strettamente, e processi separati per le parti che eseguono codice meno affidabile.'
    ]
  },
  esperimento: {
    faremo: [
      'Un servizio ha tre lavoratori, A, B e C, e un supervisore esterno. I controlli fissano l’organizzazione dei lavoratori, thread di un processo oppure processi distinti, e il lavoratore che compie un accesso vietato alla memoria.',
      'L’esperimento segue l’errore fino alle sue conseguenze, e conta i lavoratori residui. È istruttivo mantenere fisso il guasto e variare l’organizzazione.'
    ],
    vedrai: [
      ['process', 'Il supervisore', 'In alto: il processo che ha avviato il servizio, e che può riavviarlo.'],
      ['thread', 'I lavoratori', 'In basso: i tre lavoratori, con il loro stato.']
    ]
  },
  lab: {
    titolo: 'Un errore, e la sua estensione',
    scena: { w: 860, h: 150 },
    atti: ['Il servizio', 'L’errore', 'Le conseguenze'],
    controlli: [
      { id: 'org', tipo: 'scelta', eti: 'I lavoratori sono', opzioni: [['thread', 'tre thread di un processo'], ['proc', 'tre processi']], valore: 'thread' },
      { id: 'g', tipo: 'scelta', eti: 'Accesso vietato', opzioni: [['B', 'lo compie B'], ['A', 'lo compie A'], ['no', 'nessuno']], valore: 'B' }
    ],
    nota: 'I passi sono sempre quattro. Il segnale SIGSEGV ha in questo caso la sua azione predefinita, cioè la terminazione.',
    previsione: {
      domanda: (p) => 'Un servizio ha tre lavoratori, A, B e C, realizzati come ' + (p.org === 'thread' ? 'thread del medesimo processo' : 'tre processi distinti') + '. ' + (p.g === 'no' ? 'Nessun lavoratore compie errori.' : p.g + ' tenta di leggere una pagina di memoria vietata, e riceve SIGSEGV.') + ' Quanti lavoratori restano attivi?',
      opzioni: () => [[0, 'Nessuno'], [2, 'Due'], [3, 'Tre']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Restano attivi ' + esito + ' lavoratori. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.g === 'no' ? 'Senza errori nessun lavoratore è terminato.' : p.org === 'thread' ? 'Il segnale termina l’intero processo, e i tre thread ne fanno parte.' : 'Il segnale termina soltanto il processo di ' + p.g + '. Gli altri due hanno memoria propria.'),
    costruisci(p) {
      const U = SL.unita545, v = U.vivi(p), passi = [], th = p.org === 'thread', guasto = p.g !== 'no';
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Organizzazione', th ? 'thread' : 'processi', 'a'], ['Terminati', f >= 2 && guasto ? String(3 - v) : '0'], ['Attivi', f >= 2 ? String(v) : '3', 'c']], els: U.quadro('q', p, f, { x: 20, y: 0, w: 820 }) }, extra));

      P(0, 0, 'Il servizio in funzione', (th ? 'A, B e C sono thread di un unico processo, e condividono la medesima memoria.' : 'A, B e C sono tre processi, ciascuno con la propria memoria.') + ' Un supervisore, in un processo separato, li ha avviati e ne attende la terminazione.', {});
      P(1, 1, guasto ? 'L’accesso vietato' : 'Nessun errore', guasto ? p.g + ' incontra un difetto del programma, e tenta di leggere una pagina alla quale non ha diritto di accesso. Il processore blocca l’istruzione e solleva un fault.' : 'I tre lavoratori servono le richieste senza errori. Nessuna istruzione accede a memoria vietata.', guasto ? { chiedi: { d: 'A quale destinatario il kernel comunica l’errore?', o: ['Al processo che contiene ' + p.g, 'Al supervisore', 'A tutti i processi del sistema'], g: 0, no: 'Il segnale SIGSEGV è inviato al processo in cui si è verificato l’accesso.' } } : {});
      P(2, 2, guasto ? 'Il segnale e la terminazione' : 'Il servizio prosegue', guasto ? 'Il kernel consegna SIGSEGV. L’azione predefinita è la terminazione del processo che contiene ' + p.g + '. ' + (th ? 'Quel processo contiene anche gli altri due lavoratori: terminano tutti e tre i thread.' : 'Quel processo contiene soltanto ' + p.g + ': gli altri due restano indenni.') : 'Il kernel non ha alcun segnale da consegnare.', { calc: guasto ? 'terminati: ' + (3 - v) : 'terminati: 0' });
      P(3, 2, 'I lavoratori residui', !guasto ? 'Restano attivi tutti e tre i lavoratori. La differenza fra le due organizzazioni emerge soltanto in presenza di un errore.' : th ? 'Nessun lavoratore è rimasto attivo. Le richieste che gli altri due stavano servendo sono perdute. Il supervisore raccoglie la terminazione e deve riavviare l’intero servizio.' : 'Restano attivi due lavoratori, che continuano a servire richieste. Il supervisore raccoglie la terminazione di ' + p.g + ' e ne avvia un sostituto.', { esito: [v + ' attivi', v === 3 ? 'si' : v === 0 ? 'no' : ''] });
      return { passi, esito: v };
    }
  },
  bilancio: {
    regola: [
      'Un accesso vietato alla memoria provoca SIGSEGV, che per azione predefinita termina l’intero processo responsabile.',
      'I thread di un processo terminano insieme. Processi distinti sono isolati: ne termina uno solo.'
    ],
    errori: [
      ['Ritenere che termini soltanto il thread responsabile dell’errore.', 'Il segnale riguarda il processo, e la memoria comune non è più affidabile per alcun thread.'],
      ['Collocare il supervisore all’interno del processo sorvegliato.', 'Terminerebbe insieme ai lavoratori, e nessun processo potrebbe riavviarli.'],
      ['Adottare sempre i processi in quanto più robusti.', 'Hanno un costo maggiore e comunicano con maggiore difficoltà. La scelta dipende dal grado di collaborazione richiesto fra le parti.']
    ],
    saFare: ['Prevedere quali lavoratori sopravvivono a un errore di memoria.', 'Spiegare per quale ragione il confine del danno è il processo.', 'Confrontare thread e processi per costo e robustezza.'],
    esercizi: [
      { d: 'Un servizio ha 8 lavoratori, realizzati come thread del medesimo processo. Uno di essi compie un accesso vietato e riceve SIGSEGV, con l’azione predefinita. Quanti lavoratori restano attivi?', segnaposto: 'Un numero', giuste: ['0', 'zero', 'nessuno'],
        ok: 'Il segnale termina il processo, e con esso tutti gli 8 thread.',
        diagnosi: [
          { se: ['7', 'sette'], msg: 'Sette resterebbero se i lavoratori fossero processi distinti. In questo caso sono thread di un solo processo.' },
          { se: ['8', 'otto'], msg: 'L’azione predefinita di SIGSEGV è la terminazione del processo.' }
        ],
        altro: 'Il numero è diverso. Si determini il processo al quale appartengono gli altri sette.',
        indizi: ['SIGSEGV termina il processo responsabile.', 'Tutti i lavoratori sono thread di quel processo.', 'Non ne resta alcuno.'],
        svolgimento: ['Processo terminato: quello con gli 8 thread.', 'Lavoratori attivi: 0.'] },
      { d: 'Il medesimo servizio è riscritto con 8 processi distinti. Uno compie un accesso vietato. Quanti lavoratori restano attivi?', segnaposto: 'Un numero', giuste: ['7', 'sette'],
        ok: 'Termina soltanto il processo responsabile: 8 − 1 = 7.',
        diagnosi: [
          { se: ['0', 'zero'], msg: 'Questo è l’esito con i thread. I processi hanno memorie separate.' },
          { se: ['8', 'otto'], msg: 'Il processo responsabile è comunque terminato.' }
        ],
        altro: 'Il numero è diverso. Il segnale riguarda un solo processo.',
        indizi: ['Ogni lavoratore è un processo distinto.', 'Termina il processo responsabile dell’errore.', '8 − 1 = 7.'],
        svolgimento: ['Processi: 8.', 'Terminati: 1.', 'Attivi: 7.'] },
      { d: 'Per quale ragione il supervisore di un servizio è un processo separato dai lavoratori?', guida: 'Si scelga la risposta.', o: [
        { t: 'Affinché sopravviva ai loro errori, e possa riavviarli', ok: true, fb: 'All’interno del medesimo processo terminerebbe insieme a essi.' },
        { t: 'I processi sono più veloci dei thread', fb: 'I processi hanno un costo maggiore. La ragione è la robustezza.' },
        { t: 'Un thread non può creare altri thread', fb: 'Un thread può crearne altri. La ragione è restare all’esterno del processo guasto.' }] }
    ],
    sfida: ['cslez5_4_05_threads', 'Stack, cambi di thread e isolamento dei guasti']
  }
});
