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
  obiettivo: 'Obiettivo: dire che cosa contiene la scheda che il kernel tiene per ogni processo, e come la usa per ritrovare un processo e per rimetterlo in esecuzione.',
  concetti: [['tabella', 'Una scheda per processo'], ['coda', 'Le code sono elenchi di schede'], ['memory', 'Nella scheda c’è anche la mappa']],
  filigrana: ['tabella', 'coda', 'process'],
  richiami: {
    carte: [
      { sim: 'register', da: 'Dall’unità 5.1.3', t: 'Il cambio di contesto', d: 'I registri del processo uscente vengono salvati nella sua scheda.' },
      { sim: 'coda', da: 'Dall’unità 5.1.2', t: 'Pronto e bloccato', d: 'Al pronto manca il turno, al bloccato manca un evento.' },
      { sim: 'tabella', da: 'Dall’unità 5.1.1', t: 'La tabella delle pagine', d: 'Associa gli indirizzi virtuali di un processo alla memoria fisica.' }
    ],
    domanda: { d: 'Prima di proseguire: arriva la risposta di un disco. Come fa il kernel a sapere quale processo la aspettava?', o: [
      { t: 'Lo aveva annotato quando il processo ha fatto la richiesta', ok: true, fb: 'Il kernel tiene traccia di chi aspetta che cosa.' },
      { t: 'Lo chiede al processo in esecuzione', fb: 'Il processo in esecuzione è un altro, e non sa nulla della richiesta.' },
      { t: 'Risveglia tutti i processi bloccati', fb: 'Sarebbe inutile e costoso: uno solo aspettava quella risposta.' }
    ] }
  },
  idea: {
    titolo: 'La scheda del processo',
    termini: ['pcb', 'coda di attesa'],
    testo: [
      'Per il kernel un processo è una scheda. Si chiama blocco di controllo del processo, abbreviato [[pcb|PCB]] dall’inglese «process control block», e ne esiste una per ogni processo vivo. La scheda contiene il PID, lo stato, i registri salvati all’ultimo cambio di contesto, il riferimento alla tabella delle pagine, e l’elenco delle risorse in uso, come i file aperti.',
      'Anche le code viste finora sono fatte di schede. La coda dei pronti è l’elenco dei PCB dei processi pronti, da cui il dispatcher estrae il prossimo. Ogni dispositivo ha poi una [[coda di attesa]], con i PCB dei processi che aspettano una sua risposta. Cambiare stato a un processo significa spostare la sua scheda da un elenco a un altro.',
      { fig: 'scena', w: 720, h: 138, titolo: 'Il disco ha risposto: A lascia la coda del disco', nota: 'La scheda di A passa nella coda dei pronti. B resta in esecuzione, con la sua tabella TB.', els: SL.unita514.quadro('g', { pag: 2, not: 'si' }, 4, { x: 10, y: 0, w: 700, h: 54 }) },
      'Seguiamo due usi della scheda. Il processo A chiede una lettura dal disco D. Il kernel segna nel suo PCB lo stato bloccato e lo aggancia alla coda di attesa di D. Quando il disco risponde, il gestore dell’interrupt guarda in quella coda, vi trova il PCB di A, e lo sposta nella coda dei pronti. Nessuna ricerca fra tutti i processi: la coda dice già chi aspettava.',
      'Il secondo uso riguarda la memoria. Quando il dispatcher sceglie B, legge dal suo PCB i registri da ripristinare e il riferimento alla tabella delle pagine, qui chiamata TB, e la mette in uso. Da quel momento gli indirizzi di B vengono tradotti con TB: se B accede alla sua pagina 2, la tabella indica il blocco 9 della memoria fisica. Il cambio di contesto ripristina quindi i registri e anche la visione della memoria.'
    ]
  },
  esperimento: {
    faremo: [
      'A è in esecuzione e B è pronto. A chiederà una lettura dal disco D, e il processore passerà a B. Sceglierai a quale pagina accede B, e se la risposta del disco arriva durante il suo turno.',
      'Seguiremo le schede dei due processi fra le code, e la tabella che il dispatcher mette in uso. Guarda dove si trova la scheda di A alla fine, nei due casi.'
    ],
    vedrai: [
      ['tabella', 'Le schede', 'In alto: i PCB di A e di B, con lo stato e la coda in cui si trovano.'],
      ['coda', 'Le code', 'In basso: la coda dei pronti e la coda di attesa del disco D.'],
      ['memory', 'La tabella di B', 'In basso a destra: la traduzione della pagina a cui B accede.']
    ]
  },
  lab: {
    titolo: 'Le schede al lavoro',
    scena: { w: 860, h: 140 },
    atti: ['Le schede', 'La richiesta', 'Il turno di B', 'Il disco'],
    controlli: [
      { id: 'pag', tipo: 'scelta', eti: 'B accede alla pagina', opzioni: [[0, '0'], [1, '1'], [2, '2']], valore: 2 },
      { id: 'not', tipo: 'scelta', eti: 'Risposta del disco', opzioni: [['si', 'arriva durante il turno di B'], ['no', 'non è ancora arrivata']], valore: 'si' }
    ],
    nota: 'I passi sono sempre sei. La tabella TB associa le pagine 0, 1 e 2 di B ai blocchi 5, 7 e 9.',
    previsione: {
      domanda: (p) => 'A chiede una lettura dal disco D, e il dispatcher assegna il processore a B. ' + (p.not === 'si' ? 'Durante il turno di B il disco risponde.' : 'Il turno di B prosegue, e il disco non ha ancora risposto.') + ' In quale stato si trova A?',
      opzioni: () => [['esecuzione', 'In esecuzione'], ['pronto', 'Pronto'], ['bloccato', 'Bloccato']]
    },
    confronto: (pred, esito, p) => { const N = { esecuzione: 'in esecuzione', pronto: 'pronto', bloccato: 'bloccato' }; return 'La previsione indicava: ' + N[pred] + '. A è ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.not === 'si' ? 'La risposta del disco sposta la scheda di A nella coda dei pronti. Il processore resta a B.' : 'Finché il disco non risponde, la scheda di A resta nella coda di attesa di D.'); },
    costruisci(p) {
      const U = SL.unita514, passi = [], arr = p.not === 'si', bl = U.TB[p.pag];
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, h: 56 });
      const hud = (f) => [['Stato di A', f === 0 ? 'in esecuzione' : f >= 4 && arr ? 'pronto' : 'bloccato', 'a'], ['In esecuzione', f === 0 ? 'A' : f === 1 ? 'nessuno' : 'B'], ['Pagina ' + p.pag, f >= 3 ? 'blocco ' + bl : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Due schede', 'Il kernel tiene un PCB per A, PID 34, e uno per B, PID 35. A è in esecuzione. B è pronto, e la sua scheda è nella coda dei pronti.', {});
      P(1, 1, 'A chiede il disco', 'A chiede una lettura dal disco D. Il kernel salva i suoi registri nel PCB, vi segna lo stato bloccato, e aggancia la scheda alla coda di attesa di D.', { calc: 'PCB 34 → coda del disco D' });
      P(2, 2, 'Il dispatcher sceglie B', 'Il dispatcher estrae dalla coda dei pronti il PCB di B. Vi legge i registri da ripristinare e il riferimento alla tabella delle pagine TB, che mette in uso.', { calc: 'in uso: tabella TB', chiedi: { d: 'Dove ha trovato il dispatcher l’indicazione di quale tabella usare?', o: ['Nel PCB di B', 'Nel PCB di A', 'Nel registro del disco'], g: 0, no: 'Ogni PCB conserva il riferimento alla tabella del proprio processo.' } });
      P(3, 2, 'B accede alla memoria', 'B usa un indirizzo della sua pagina ' + p.pag + '. Il processore consulta TB, che associa la pagina ' + p.pag + ' al blocco ' + bl + ' della memoria fisica.', { calc: 'pagina ' + p.pag + ' → blocco ' + bl });
      P(4, 3, arr ? 'Il disco risponde' : 'Il disco lavora ancora', arr ? 'Il disco D segnala il completamento. Il gestore guarda nella coda di attesa di D, vi trova il PCB di A, lo segna pronto e lo sposta nella coda dei pronti. B continua il suo turno.' : 'Il disco D non ha ancora finito. Il PCB di A resta nella coda di attesa di D, e il kernel non deve fare nulla. B continua il suo turno.', { calc: arr ? 'PCB 34 → coda dei pronti' : 'PCB 34 resta nella coda di D' });
      P(5, 3, 'Dove sono le schede', arr ? 'A è pronto, e aspetta soltanto che il dispatcher lo scelga. La coda di attesa di D è vuota.' : 'A è bloccato. Quando il disco risponderà, il kernel saprà chi risvegliare leggendo la coda di attesa di D.', { esito: ['A ' + (arr ? 'pronto' : 'bloccato'), ''] });
      return { passi, esito: arr ? 'pronto' : 'bloccato' };
    }
  },
  bilancio: {
    regola: [
      'Il PCB di un processo contiene PID, stato, registri salvati, riferimento alla tabella delle pagine e risorse in uso.',
      'Le code del kernel sono elenchi di PCB. Un cambio di stato sposta la scheda da una coda a un’altra.'
    ],
    errori: [
      ['Pensare che alla risposta di un dispositivo il kernel esamini tutti i processi.', 'Gli basta la coda di attesa di quel dispositivo.'],
      ['Dimenticare la tabella delle pagine nel cambio di contesto.', 'Con i registri di B e la tabella di A, B leggerebbe la memoria di A.'],
      ['Confondere la coda dei pronti con una coda di attesa.', 'Nella prima si aspetta il processore, nella seconda un evento.']
    ],
    saFare: ['Elencare il contenuto di un PCB.', 'Seguire una scheda fra coda di attesa e coda dei pronti.', 'Spiegare come il dispatcher ritrova la tabella di un processo.'],
    esercizi: [
      { d: 'Un processo bloccato aspettava il disco D. Il disco risponde. Che cosa fa il kernel con il suo PCB?', guida: 'Si scelga la risposta.', o: [
        { t: 'Lo toglie dalla coda di attesa di D e lo mette nella coda dei pronti', ok: true, fb: 'Lo stato passa da bloccato a pronto.' },
        { t: 'Lo mette subito in esecuzione', fb: 'Il processore è occupato. Il processo torna pronto e attende il dispatcher.' },
        { t: 'Lo lascia nella coda di D fino al turno successivo', fb: 'L’evento è arrivato: restare in quella coda non avrebbe senso.' }] },
      { d: 'La tabella di un processo associa le pagine 0, 1, 2 e 3 ai blocchi 12, 4, 9 e 6. Il processo accede a un indirizzo della pagina 3. In quale blocco della memoria fisica si trova il dato?', segnaposto: 'Un numero', giuste: ['6', 'sei'],
        ok: 'La quarta voce della tabella, quella della pagina 3, indica il blocco 6.',
        diagnosi: [
          { se: ['9', 'nove'], msg: 'Il blocco 9 corrisponde alla pagina 2. Le pagine sono numerate da 0.' },
          { se: ['3', 'tre'], msg: 'Tre è il numero della pagina. Il blocco si legge nella tabella.' }
        ],
        altro: 'Il numero è diverso. Conta le voci della tabella partendo dalla pagina 0.',
        indizi: ['La pagina 0 va nel blocco 12.', 'La pagina 1 nel 4, la pagina 2 nel 9.', 'La pagina 3 nel blocco 6.'],
        svolgimento: ['Pagine 0, 1, 2, 3 → blocchi 12, 4, 9, 6.', 'Pagina 3 → blocco 6.'] },
      { d: 'Quale di queste informazioni non sta nel PCB di un processo?', guida: 'Si scelga la risposta.', o: [
        { t: 'Le istruzioni del programma', ok: true, fb: 'Le istruzioni stanno nella memoria del processo. Il PCB contiene i dati con cui il kernel lo gestisce.' },
        { t: 'Il contatore di programma salvato', fb: 'Fa parte dei registri salvati al cambio di contesto.' },
        { t: 'Il riferimento alla tabella delle pagine', fb: 'Serve al dispatcher per ripristinare la visione della memoria.' }] }
    ],
    sfida: ['cslez5_1_03_processes', 'Contesto salvato e PCB']
  }
});
