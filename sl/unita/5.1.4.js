'use strict';
SL.unita514 = (() => {
  const TB = { 0: 5, 1: 7, 2: 9 };
  // fase: 0 le schede · 1 A chiede il disco · 2 il dispatcher sceglie B · 3 B accede alla memoria · 4 il disco · 5 il bilancio
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], arr = p.not === 'si', w2 = (o.w - 12) / 2, w3 = (o.w - 24) / 3;
    const statoA = f === 0 ? 'in esecuzione' : f >= 4 && arr ? 'pronto' : 'bloccato', codaA = f === 0 ? 'nessuna coda' : f >= 4 && arr ? 'coda dei pronti' : 'coda del disco D';
    const statoB = f <= 1 ? 'pronto' : 'in esecuzione';
    els.push(el.box(pre + 'a', o.x, o.y, w2, o.h, 'scheda · PID 34 · A', statoA + ' · ' + codaA, f === 1 || f === 4 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'b', o.x + w2 + 12, o.y, w2, o.h, 'scheda · PID 35 · B', statoB + ' · tabella TB', f === 2 ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'q1', o.x, o.y + o.h + 14, w3, o.h, 'coda dei pronti', f <= 1 ? 'B' : f >= 4 && arr ? 'A' : 'vuota', f === 2 || (f === 4 && arr) ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'q2', o.x + w3 + 12, o.y + o.h + 14, w3, o.h, 'coda del disco D', f >= 1 && !(f >= 4 && arr) ? 'A' : 'vuota', f === 1 || f === 4 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'tb', o.x + 2 * (w3 + 12), o.y + o.h + 14, w3, o.h, 'tabella TB · pagina ' + p.pag, f >= 3 ? '→ blocco ' + TB[p.pag] : f === 2 ? 'in uso' : '·', f === 3 ? 'att' : f >= 2 ? 'on' : '', { cls: 'stretta' }));
    return els;
  };
  return { TB, quadro };
})();
SL.registra('5.1.4', {
  titolo: 'Quali dati conserva il kernel',
  obiettivo: 'Obiettivo: indicare il contenuto della scheda che il kernel mantiene per ogni processo, e il modo in cui la impiega per individuare un processo e per riportarlo in esecuzione.',
  concetti: [['tabella', 'Una scheda per processo'], ['coda', 'Le code sono elenchi di schede'], ['memory', 'La scheda contiene anche la mappa']],
  filigrana: ['tabella', 'coda', 'process'],
  richiami: {
    carte: [
      { sim: 'register', da: 'Dall’unità 5.1.3', t: 'Il cambio di contesto', d: 'I registri del processo uscente sono salvati nella sua scheda.' },
      { sim: 'coda', da: 'Dall’unità 5.1.2', t: 'Pronto e bloccato', d: 'Al processo pronto manca il turno, al processo bloccato manca un evento.' },
      { sim: 'tabella', da: 'Dall’unità 5.1.1', t: 'La tabella delle pagine', d: 'Associa gli indirizzi virtuali di un processo alla memoria fisica.' }
    ],
    domanda: { d: 'Prima di proseguire: giunge la risposta di un disco. In quale modo il kernel individua il processo che la attendeva?', o: [
      { t: 'Con la registrazione compiuta al momento della richiesta', ok: true, fb: 'Il kernel registra per ogni processo in attesa l’evento atteso.' },
      { t: 'Con una richiesta al processo in esecuzione', fb: 'Il processo in esecuzione è un altro, e ignora la richiesta.' },
      { t: 'Con il risveglio di tutti i processi bloccati', fb: 'Sarebbe inutile e costoso: un solo processo attendeva tale risposta.' }
    ] }
  },
  idea: {
    titolo: 'La scheda del processo',
    termini: ['pcb', 'coda di attesa'],
    testo: [
      'Per il kernel un processo è rappresentato da una scheda. Essa prende il nome di blocco di controllo del processo, abbreviato [[pcb|PCB]] dall’inglese «process control block», e ne esiste una per ogni processo attivo. La scheda contiene il PID, lo stato, i registri salvati all’ultimo cambio di contesto, il riferimento alla tabella delle pagine, e l’elenco delle risorse impiegate, come i file aperti.',
      'Anche le code descritte finora sono costituite da schede. La coda dei pronti è l’elenco dei PCB dei processi pronti, da cui il dispatcher estrae il successivo. Ogni dispositivo ha inoltre una [[coda di attesa]], con i PCB dei processi che attendono una sua risposta. Il cambio di stato di un processo consiste nello spostamento della sua scheda da un elenco a un altro.',
      { fig: 'scena', w: 720, h: 138, titolo: 'Il disco ha risposto: A lascia la coda del disco', nota: 'La scheda di A passa nella coda dei pronti. B resta in esecuzione, con la sua tabella TB.', els: SL.unita514.quadro('g', { pag: 2, not: 'si' }, 4, { x: 10, y: 0, w: 700, h: 54 }) },
      'Si considerino due impieghi della scheda. Il processo A richiede una lettura dal disco D. Il kernel registra nel suo PCB lo stato bloccato e lo inserisce nella coda di attesa di D. Quando il disco risponde, il gestore dell’interrupt esamina tale coda, vi trova il PCB di A, e lo sposta nella coda dei pronti. Una ricerca fra tutti i processi è superflua, poiché la coda indica già il processo in attesa.',
      'Il secondo impiego riguarda la memoria. Quando il dispatcher seleziona B, legge dal suo PCB i registri da ripristinare e il riferimento alla tabella delle pagine, in questo caso denominata TB, e la attiva. Da tale istante gli indirizzi di B sono tradotti con TB: se B accede alla sua pagina 2, la tabella indica il blocco 9 della memoria fisica. Il cambio di contesto ripristina pertanto i registri e anche la visione della memoria.'
    ]
  },
  esperimento: {
    faremo: [
      'A è in esecuzione e B è pronto. A richiederà una lettura dal disco D, e il processore passerà a B. I controlli fissano la pagina a cui accede B, e l’arrivo della risposta del disco durante il suo turno.',
      'L’esperimento segue le schede dei due processi fra le code, e la tabella che il dispatcher attiva. È istruttivo osservare la posizione finale della scheda di A nei due casi.'
    ],
    vedrai: [
      ['tabella', 'Le schede', 'In alto: i PCB di A e di B, con lo stato e la coda in cui si trovano.'],
      ['coda', 'Le code', 'In basso: la coda dei pronti e la coda di attesa del disco D.'],
      ['memory', 'La tabella di B', 'In basso a destra: la traduzione della pagina a cui B accede.']
    ]
  },
  lab: {
    titolo: 'L’impiego delle schede',
    scena: { w: 860, h: 140 },
    atti: ['Le schede', 'La richiesta', 'Il turno di B', 'Il disco'],
    controlli: [
      { id: 'pag', tipo: 'scelta', eti: 'B accede alla pagina', opzioni: [[0, '0'], [1, '1'], [2, '2']], valore: 2 },
      { id: 'not', tipo: 'scelta', eti: 'Risposta del disco', opzioni: [['si', 'giunge durante il turno di B'], ['no', 'non è ancora giunta']], valore: 'si' }
    ],
    nota: 'I passi sono sempre sei. La tabella TB associa le pagine 0, 1 e 2 di B ai blocchi 5, 7 e 9.',
    previsione: {
      domanda: (p) => 'A richiede una lettura dal disco D, e il dispatcher assegna il processore a B. ' + (p.not === 'si' ? 'Durante il turno di B il disco risponde.' : 'Il turno di B prosegue, e il disco non ha ancora risposto.') + ' In quale stato si trova A?',
      opzioni: () => [['esecuzione', 'In esecuzione'], ['pronto', 'Pronto'], ['bloccato', 'Bloccato']]
    },
    confronto: (pred, esito, p) => { const N = { esecuzione: 'in esecuzione', pronto: 'pronto', bloccato: 'bloccato' }; return 'La previsione indicava: ' + N[pred] + '. A è ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.not === 'si' ? 'La risposta del disco sposta la scheda di A nella coda dei pronti. Il processore resta a B.' : 'Finché il disco non risponde, la scheda di A resta nella coda di attesa di D.'); },
    costruisci(p) {
      const U = SL.unita514, passi = [], arr = p.not === 'si', bl = U.TB[p.pag];
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, h: 56 });
      const hud = (f) => [['Stato di A', f === 0 ? 'in esecuzione' : f >= 4 && arr ? 'pronto' : 'bloccato', 'a'], ['In esecuzione', f === 0 ? 'A' : f === 1 ? 'nessuno' : 'B'], ['Pagina ' + p.pag, f >= 3 ? 'blocco ' + bl : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Due schede', 'Il kernel mantiene un PCB per A, PID 34, e uno per B, PID 35. A è in esecuzione, mentre B è pronto, e la sua scheda è nella coda dei pronti.', {});
      P(1, 1, 'A richiede il disco', 'A richiede una lettura dal disco D. Il kernel salva i suoi registri nel PCB, vi registra lo stato bloccato, e inserisce la scheda nella coda di attesa di D.', { calc: 'PCB 34 → coda del disco D' });
      P(2, 2, 'Il dispatcher seleziona B', 'Il dispatcher estrae dalla coda dei pronti il PCB di B. Vi legge i registri da ripristinare e il riferimento alla tabella delle pagine TB, che attiva.', { calc: 'attiva: tabella TB', chiedi: { d: 'Dove ha trovato il dispatcher l’indicazione della tabella da attivare?', o: ['Nel PCB di B', 'Nel PCB di A', 'Nel registro del disco'], g: 0, no: 'Ogni PCB conserva il riferimento alla tabella del proprio processo.' } });
      P(3, 2, 'B accede alla memoria', 'B impiega un indirizzo della sua pagina ' + p.pag + '. Il processore consulta TB, che associa la pagina ' + p.pag + ' al blocco ' + bl + ' della memoria fisica.', { calc: 'pagina ' + p.pag + ' → blocco ' + bl });
      P(4, 3, arr ? 'Il disco risponde' : 'Il disco è ancora in attività', arr ? 'Il disco D segnala il completamento. Il gestore esamina la coda di attesa di D, vi trova il PCB di A, lo contrassegna come pronto e lo sposta nella coda dei pronti. B prosegue il proprio turno.' : 'Il disco D non ha ancora terminato. Il PCB di A resta nella coda di attesa di D, e nessun intervento del kernel è necessario. B prosegue il proprio turno.', { calc: arr ? 'PCB 34 → coda dei pronti' : 'PCB 34 resta nella coda di D' });
      P(5, 3, 'La posizione delle schede', arr ? 'A è pronto, e attende soltanto la scelta del dispatcher. La coda di attesa di D è vuota.' : 'A è bloccato. Quando il disco risponderà, il kernel individuerà il processo da risvegliare nella coda di attesa di D.', { esito: ['A ' + (arr ? 'pronto' : 'bloccato'), ''] });
      return { passi, esito: arr ? 'pronto' : 'bloccato' };
    }
  },
  bilancio: {
    regola: [
      'Il PCB di un processo contiene PID, stato, registri salvati, riferimento alla tabella delle pagine e risorse in uso.',
      'Le code del kernel sono elenchi di PCB. Un cambio di stato sposta la scheda da una coda a un’altra.'
    ],
    errori: [
      ['Ritenere che alla risposta di un dispositivo il kernel esamini tutti i processi.', 'Al kernel è sufficiente la coda di attesa di tale dispositivo.'],
      ['Trascurare la tabella delle pagine nel cambio di contesto.', 'Con i registri di B e la tabella di A, B leggerebbe la memoria di A.'],
      ['Confondere la coda dei pronti con una coda di attesa.', 'Nella prima si attende il processore, nella seconda un evento.']
    ],
    saFare: ['Elencare il contenuto di un PCB.', 'Seguire una scheda fra coda di attesa e coda dei pronti.', 'Spiegare il modo in cui il dispatcher individua la tabella di un processo.'],
    esercizi: [
      { d: 'Un processo bloccato attendeva il disco D. Il disco risponde. Quale operazione compie il kernel sul suo PCB?', guida: 'Si scelga la risposta.', o: [
        { t: 'Lo sposta dalla coda di attesa di D alla coda dei pronti', ok: true, fb: 'Lo stato passa da bloccato a pronto.' },
        { t: 'Lo pone immediatamente in esecuzione', fb: 'Il processore è occupato. Il processo torna pronto e attende il dispatcher.' },
        { t: 'Lo lascia nella coda di D fino al turno successivo', fb: 'L’evento si è verificato, e la permanenza in tale coda sarebbe priva di ragione.' }] },
      { d: 'La tabella di un processo associa le pagine 0, 1, 2 e 3 ai blocchi 12, 4, 9 e 6. Il processo accede a un indirizzo della pagina 3. In quale blocco della memoria fisica si trova il dato?', segnaposto: 'Un numero', giuste: ['6', 'sei'],
        ok: 'La quarta voce della tabella, quella della pagina 3, indica il blocco 6.',
        diagnosi: [
          { se: ['9', 'nove'], msg: 'Il blocco 9 corrisponde alla pagina 2. Le pagine sono numerate da 0.' },
          { se: ['3', 'tre'], msg: 'Tre è il numero della pagina. Il blocco si legge nella tabella.' }
        ],
        altro: 'Il numero è diverso. Si contino le voci della tabella a partire dalla pagina 0.',
        indizi: ['La pagina 0 corrisponde al blocco 12.', 'La pagina 1 al 4, la pagina 2 al 9.', 'La pagina 3 al blocco 6.'],
        svolgimento: ['Pagine 0, 1, 2, 3 → blocchi 12, 4, 9, 6.', 'Pagina 3 → blocco 6.'] },
      { d: 'Quale di queste informazioni è assente dal PCB di un processo?', guida: 'Si scelga la risposta.', o: [
        { t: 'Le istruzioni del programma', ok: true, fb: 'Le istruzioni si trovano nella memoria del processo. Il PCB contiene i dati con cui il kernel lo gestisce.' },
        { t: 'Il contatore di programma salvato', fb: 'Fa parte dei registri salvati al cambio di contesto.' },
        { t: 'Il riferimento alla tabella delle pagine', fb: 'È necessario al dispatcher per ripristinare la visione della memoria.' }] }
    ],
    sfida: ['cslez5_1_03_processes', 'Contesto salvato e PCB']
  }
});
