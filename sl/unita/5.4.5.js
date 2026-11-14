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
  concetti: [['thread', 'Insieme nella buona sorte'], ['scudo', 'Il confine è il processo'], ['process', 'Separati, ma più costosi']],
  filigrana: ['scudo', 'thread', 'process'],
  richiami: {
    carte: [
      { sim: 'thread', da: 'Dall’unità 5.4.1', t: 'La memoria condivisa', d: 'I thread di un processo hanno una sola mappa della memoria.' },
      { sim: 'process', da: 'Dall’unità 5.1.1', t: 'L’isolamento fra processi', d: 'Ogni processo ha il proprio spazio di indirizzamento.' },
      { sim: 'interrupt', da: 'Dall’unità 4.1.2', t: 'Il fault', d: 'L’eccezione sollevata da una istruzione che non può essere eseguita, come un accesso a memoria vietata.' }
    ],
    domanda: { d: 'Prima di proseguire: un thread scrive per errore su una struttura usata da un altro thread dello stesso processo. Il kernel può impedirlo?', o: [
      { t: 'No: per il kernel quella memoria appartiene a entrambi', ok: true, fb: 'La protezione della memoria agisce fra processi. Fra i thread di uno stesso processo è assente.' },
      { t: 'Sì: ogni thread ha la propria tabella delle pagine', fb: 'La tabella delle pagine è una sola per tutto il processo.' },
      { t: 'Sì, se i thread hanno priorità diverse', fb: 'La priorità riguarda il processore, e non protegge la memoria.' }
    ] }
  },
  idea: {
    titolo: 'Quando uno sbaglia, chi cade',
    termini: ['sigsegv', 'isolamento dei guasti'],
    testo: [
      'Un servizio che risponde a molte richieste le distribuisce fra più lavoratori. I lavoratori possono essere thread di un solo processo, oppure processi distinti. I thread comunicano senza fatica, perché hanno la memoria in comune, e costano poco. I processi devono scambiarsi i dati attraverso canali predisposti dal kernel, come le pipe, e costano di più. La differenza più importante emerge però quando qualcosa va storto.',
      'Supponiamo che il lavoratore B, per un difetto del programma, tenti di leggere una pagina di memoria a cui non ha diritto. Il processore solleva un fault, e il kernel lo comunica al responsabile con un avviso chiamato [[sigsegv|SIGSEGV]]. Se il programma non ha previsto altro, la reazione è la terminazione. A terminare è il processo che contiene il responsabile: tutto il processo, perché una memoria in cui è avvenuto un accesso sbagliato non dà più garanzie a nessuno dei suoi thread.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Tre thread nello stesso processo, e B sbaglia', nota: 'Il processo viene terminato, e con lui A e C, che non avevano fatto nulla. Il supervisore, che è un altro processo, resta attivo.', els: SL.unita545.quadro('g', { org: 'thread', g: 'B' }, 3, { x: 10, y: 0, w: 700 }) },
      'Il confine del danno coincide quindi con il confine del processo. Se A, B e C sono thread dello stesso processo, cadono tutti e tre, e le richieste che A e C stavano servendo vanno perdute. Se sono tre processi, termina soltanto B. A e C conservano la propria memoria e continuano a lavorare. Questa proprietà si chiama [[isolamento dei guasti]].',
      'In entrambe le organizzazioni conviene un supervisore: un processo separato che ha avviato i lavoratori, ne raccoglie la terminazione con waitpid, e li riavvia. Poiché è fuori dal processo guasto, sopravvive sempre. La scelta fra thread e processi è dunque un compromesso fra efficienza e robustezza. Molti programmi usano thread per le parti che devono collaborare strettamente, e processi separati per le parti che eseguono codice meno affidabile.'
    ]
  },
  esperimento: {
    faremo: [
      'Un servizio ha tre lavoratori, A, B e C, e un supervisore esterno. Sceglierai se i lavoratori sono thread di un processo oppure processi distinti, e quale di loro compie un accesso vietato alla memoria.',
      'Seguiremo l’errore fino alle sue conseguenze, e conteremo i lavoratori rimasti. Tieni fermo il guasto e cambia l’organizzazione.'
    ],
    vedrai: [
      ['process', 'Il supervisore', 'In alto: il processo che ha avviato il servizio, e che può riavviarlo.'],
      ['thread', 'I lavoratori', 'In basso: i tre lavoratori, con il loro stato.']
    ]
  },
  lab: {
    titolo: 'Un errore, e il suo raggio',
    scena: { w: 860, h: 150 },
    atti: ['Il servizio', 'L’errore', 'Le conseguenze'],
    controlli: [
      { id: 'org', tipo: 'scelta', eti: 'I lavoratori sono', opzioni: [['thread', 'tre thread di un processo'], ['proc', 'tre processi']], valore: 'thread' },
      { id: 'g', tipo: 'scelta', eti: 'Accesso vietato', opzioni: [['B', 'lo compie B'], ['A', 'lo compie A'], ['no', 'nessuno']], valore: 'B' }
    ],
    nota: 'I passi sono sempre quattro. Il segnale SIGSEGV ha qui la sua azione predefinita, cioè la terminazione.',
    previsione: {
      domanda: (p) => 'Un servizio ha tre lavoratori, A, B e C, realizzati come ' + (p.org === 'thread' ? 'thread dello stesso processo' : 'tre processi distinti') + '. ' + (p.g === 'no' ? 'Nessuno compie errori.' : p.g + ' tenta di leggere una pagina di memoria vietata, e riceve SIGSEGV.') + ' Quanti lavoratori restano attivi?',
      opzioni: () => [[0, 'Nessuno'], [2, 'Due'], [3, 'Tre']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Restano attivi ' + esito + ' lavoratori. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.g === 'no' ? 'Senza errori nessuno viene terminato.' : p.org === 'thread' ? 'Il segnale termina l’intero processo, e i tre thread ne fanno parte.' : 'Il segnale termina soltanto il processo di ' + p.g + '. Gli altri due hanno memoria propria.'),
    costruisci(p) {
      const U = SL.unita545, v = U.vivi(p), passi = [], th = p.org === 'thread', guasto = p.g !== 'no';
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Organizzazione', th ? 'thread' : 'processi', 'a'], ['Terminati', f >= 2 && guasto ? String(3 - v) : '0'], ['Attivi', f >= 2 ? String(v) : '3', 'c']], els: U.quadro('q', p, f, { x: 20, y: 0, w: 820 }) }, extra));

      P(0, 0, 'Il servizio al lavoro', (th ? 'A, B e C sono thread di un unico processo, e condividono la stessa memoria.' : 'A, B e C sono tre processi, ciascuno con la propria memoria.') + ' Un supervisore, in un processo a parte, li ha avviati e ne attende la terminazione.', {});
      P(1, 1, guasto ? 'L’accesso vietato' : 'Nessun errore', guasto ? p.g + ' incontra un difetto del programma, e tenta di leggere una pagina a cui non ha diritto. Il processore blocca l’istruzione e solleva un fault.' : 'I tre lavoratori servono le richieste senza incidenti. Nessuna istruzione tocca memoria vietata.', guasto ? { chiedi: { d: 'A chi comunica il kernel l’errore?', o: ['Al processo che contiene ' + p.g, 'Al supervisore', 'A tutti i processi del sistema'], g: 0, no: 'Il segnale SIGSEGV va al processo in cui è avvenuto l’accesso.' } } : {});
      P(2, 2, guasto ? 'Il segnale e la terminazione' : 'Tutto prosegue', guasto ? 'Il kernel consegna SIGSEGV. L’azione predefinita è terminare il processo che contiene ' + p.g + '. ' + (th ? 'Quel processo contiene anche gli altri due lavoratori: terminano tutti e tre i thread.' : 'Quel processo contiene soltanto ' + p.g + ': gli altri due non sono toccati.') : 'Il kernel non ha alcun segnale da consegnare.', { calc: guasto ? 'terminati: ' + (3 - v) : 'terminati: 0' });
      P(3, 2, 'Chi resta', !guasto ? 'Restano attivi tutti e tre i lavoratori. La differenza fra le due organizzazioni si vede soltanto quando qualcosa va storto.' : th ? 'Nessun lavoratore è rimasto. Le richieste che gli altri due stavano servendo sono perdute. Il supervisore raccoglie la terminazione e deve riavviare l’intero servizio.' : 'Restano attivi due lavoratori, che continuano a servire richieste. Il supervisore raccoglie la terminazione di ' + p.g + ' e ne avvia un sostituto.', { esito: [v + ' attivi', v === 3 ? 'si' : v === 0 ? 'no' : ''] });
      return { passi, esito: v };
    }
  },
  bilancio: {
    regola: [
      'Un accesso vietato alla memoria provoca SIGSEGV, che per azione predefinita termina l’intero processo responsabile.',
      'I thread di un processo cadono insieme. Processi distinti sono isolati: ne termina uno solo.'
    ],
    errori: [
      ['Pensare che termini soltanto il thread che ha sbagliato.', 'Il segnale riguarda il processo, e la memoria comune non è più affidabile per nessuno.'],
      ['Mettere il supervisore dentro il processo che sorveglia.', 'Cadrebbe insieme ai lavoratori, e nessuno potrebbe riavviarli.'],
      ['Scegliere sempre i processi perché più robusti.', 'Costano di più e comunicano con più fatica. La scelta dipende da quanto le parti devono collaborare.']
    ],
    saFare: ['Prevedere chi sopravvive a un errore di memoria.', 'Spiegare perché il confine del danno è il processo.', 'Confrontare thread e processi per costo e robustezza.'],
    esercizi: [
      { d: 'Un servizio ha 8 lavoratori, realizzati come thread dello stesso processo. Uno di essi compie un accesso vietato e riceve SIGSEGV, con l’azione predefinita. Quanti lavoratori restano attivi?', segnaposto: 'Un numero', giuste: ['0', 'zero', 'nessuno'],
        ok: 'Il segnale termina il processo, e con lui tutti gli 8 thread.',
        diagnosi: [
          { se: ['7', 'sette'], msg: 'Sette resterebbero se i lavoratori fossero processi distinti. Qui sono thread di un solo processo.' },
          { se: ['8', 'otto'], msg: 'L’azione predefinita di SIGSEGV è la terminazione del processo.' }
        ],
        altro: 'Il numero è diverso. Ci si chieda a quale processo appartengono gli altri sette.',
        indizi: ['SIGSEGV termina il processo responsabile.', 'Tutti i lavoratori sono thread di quel processo.', 'Non ne resta nessuno.'],
        svolgimento: ['Processo terminato: quello con gli 8 thread.', 'Lavoratori attivi: 0.'] },
      { d: 'Lo stesso servizio viene riscritto con 8 processi distinti. Uno compie un accesso vietato. Quanti lavoratori restano attivi?', segnaposto: 'Un numero', giuste: ['7', 'sette'],
        ok: 'Termina soltanto il processo responsabile: 8 − 1 = 7.',
        diagnosi: [
          { se: ['0', 'zero'], msg: 'Questo accadrebbe con i thread. I processi hanno memorie separate.' },
          { se: ['8', 'otto'], msg: 'Il processo responsabile viene comunque terminato.' }
        ],
        altro: 'Il numero è diverso. Il segnale riguarda un solo processo.',
        indizi: ['Ogni lavoratore è un processo a sé.', 'Termina quello che ha sbagliato.', '8 − 1 = 7.'],
        svolgimento: ['Processi: 8.', 'Terminati: 1.', 'Attivi: 7.'] },
      { d: 'Perché il supervisore di un servizio è un processo separato dai lavoratori?', guida: 'Si scelga la risposta.', o: [
        { t: 'Perché sopravviva ai loro errori, e possa riavviarli', ok: true, fb: 'Dentro lo stesso processo cadrebbe insieme a loro.' },
        { t: 'Perché i processi sono più veloci dei thread', fb: 'I processi costano di più. La ragione è la robustezza.' },
        { t: 'Perché un thread non può creare altri thread', fb: 'Può farlo. Il punto è restare fuori dal raggio di un guasto.' }] }
    ],
    sfida: ['cslez5_4_05_threads', 'Stack, cambi di thread e isolamento dei guasti']
  }
});
