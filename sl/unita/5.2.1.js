'use strict';
SL.unita521 = (() => {
  const finali = (p) => ({ padre: p.x + (p.chi === 'padre' ? 1 : 0), figlio: p.x + (p.chi === 'figlio' ? 1 : 0) });
  const chiave = (p) => { const f = finali(p); return f.padre + ',' + f.figlio; };
  // fase: 0 prima di fork · 1 fork · 2 le letture · 3 il tentativo di scrittura · 4 la copia · 5 la fine
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], fin = finali(p), w3 = (o.w - 2 * o.gap) / 3, scr = p.chi !== 'nessuno', copiata = scr && f >= 4, chi = p.chi;
    const blocco = (k) => (copiata && chi === k ? 20 : 12);
    els.push(el.box(pre + 'pp', o.x, o.y, w3, o.h, 'padre · PID 80', f === 0 ? 'chiama fork' : 'fork ha restituito 81', f === 1 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'tp', o.x + w3 + o.gap, o.y, w3, o.h, 'padre · pagina di x', '→ blocco ' + blocco('padre'), f === 3 && chi === 'padre' ? 'err' : f === 4 && chi === 'padre' ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'b0', o.x + 2 * (w3 + o.gap), o.y, w3, o.h, 'memoria · blocco 12', 'x = ' + (copiata && f >= 5 ? (chi === 'padre' ? fin.figlio : fin.padre) : p.x), f === 2 ? 'att' : 'on', { cls: 'stretta' }));
    if (f >= 1) els.push(el.box(pre + 'pf', o.x, o.y + o.h + 14, w3, o.h, 'figlio · PID 81', 'fork ha restituito 0', f === 1 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'tf', o.x + w3 + o.gap, o.y + o.h + 14, w3, o.h, 'figlio · pagina di x', '→ blocco ' + blocco('figlio'), f === 3 && chi === 'figlio' ? 'err' : f === 4 && chi === 'figlio' ? 'att' : f === 1 ? 'att' : 'on', { cls: 'stretta' }));
    if (copiata) els.push(el.box(pre + 'b1', o.x + 2 * (w3 + o.gap), o.y + o.h + 14, w3, o.h, 'memoria · blocco 20', 'x = ' + (f >= 5 ? p.x + 1 : p.x), 'att', { cls: 'stretta' }));
    return els;
  };
  return { finali, chiave, quadro };
})();
SL.registra('5.2.1', {
  titolo: 'Creazione per duplicazione',
  obiettivo: 'Obiettivo: dire che cosa restituisce fork al padre e al figlio, e come le loro variabili restano indipendenti pur partendo dalla stessa memoria.',
  concetti: [['fork', 'Un processo ne genera un altro'], ['process', 'Due ritorni dalla stessa chiamata'], ['memory', 'La copia arriva alla prima scrittura']],
  filigrana: ['fork', 'process', 'memory'],
  richiami: {
    carte: [
      { sim: 'process', da: 'Dall’unità 5.1.1', t: 'Lo spazio di indirizzamento', d: 'Ogni processo ha la propria memoria, raggiunta con la propria tabella delle pagine.' },
      { sim: 'tabella', da: 'Dall’unità 5.1.4', t: 'Il PCB', d: 'La scheda con cui il kernel descrive un processo.' },
      { sim: 'privilegi', da: 'Dall’unità 2.5.1', t: 'La chiamata di sistema', d: 'La richiesta di un servizio al kernel.' }
    ],
    domanda: { d: 'Prima di proseguire: due processi hanno tabelle delle pagine che conducono allo stesso blocco fisico. Finché si limitano a leggere, c’è qualche rischio?', o: [
      { t: 'No: nessuno dei due può alterare ciò che legge l’altro', ok: true, fb: 'Il problema nascerebbe soltanto con una scrittura.' },
      { t: 'Sì: le letture si disturbano', fb: 'Una lettura lascia il contenuto com’è.' },
      { t: 'Sì: il blocco appartiene a un processo solo', fb: 'Un blocco può comparire in più tabelle, se nessuno lo modifica.' }
    ] }
  },
  idea: {
    titolo: 'Un processo che si sdoppia',
    termini: ['fork', 'copia su scrittura'],
    testo: [
      'Nei sistemi Unix un processo nuovo nasce in un modo sorprendente: per duplicazione di uno esistente. La chiamata di sistema [[fork]] crea un processo figlio che è una copia quasi perfetta del chiamante, il padre. Stesso programma, stessi dati, stessi file aperti, e soprattutto stesso punto di esecuzione: entrambi proseguono dall’istruzione che segue la chiamata.',
      'Due processi identici devono pur poter fare cose diverse, e la differenza sta nel valore restituito. Al padre fork restituisce il PID del figlio, un numero positivo. Al figlio restituisce 0. Il programma controlla questo valore subito dopo la chiamata e sceglie il ramo: di solito il padre continua il proprio lavoro, e il figlio ne comincia un altro.',
      { fig: 'scena', w: 720, h: 138, titolo: 'Dopo fork, il figlio ha incrementato x', nota: 'Il figlio ha ricevuto una copia della pagina nel blocco 20, e lì x vale 7. Il padre legge ancora 6 nel blocco 12.', els: SL.unita521.quadro('g', { x: 6, chi: 'figlio' }, 5, { x: 10, y: 0, w: 700, gap: 12, h: 54 }) },
      'Il figlio riceve una copia della memoria del padre, variabili comprese. Copiare davvero tutte le pagine sarebbe uno spreco, perché spesso il figlio cambia programma un attimo dopo. Il kernel usa allora la [[copia su scrittura]]: all’inizio le tabelle dei due processi conducono agli stessi blocchi fisici, segnati come di sola lettura. Finché entrambi leggono, non serve altro.',
      'Quando uno dei due prova a scrivere, il processore solleva una eccezione, e il kernel interviene. Copia quella sola pagina in un blocco nuovo, aggiorna la tabella di chi stava scrivendo, e lascia ripetere la scrittura. Se x valeva 6 e il figlio la incrementa, il figlio legge 7 e il padre continua a leggere 6. Dal punto di vista dei programmi, le variabili sono state separate fin dall’inizio. La copia fisica è stata soltanto rinviata al momento del bisogno.'
    ]
  },
  esperimento: {
    faremo: [
      'Un processo con una variabile x chiama fork. Sceglierai il valore di x, e quale dei due processi, dopo la chiamata, la incrementa.',
      'Seguiremo i valori restituiti da fork, le tabelle delle pagine e i blocchi di memoria. Scegli «nessuno» e guarda quanti blocchi contengono x alla fine.'
    ],
    vedrai: [
      ['process', 'I due processi', 'A sinistra: padre e figlio, con il valore restituito da fork.'],
      ['tabella', 'Le tabelle', 'Al centro: il blocco a cui conduce, per ciascuno, la pagina di x.'],
      ['memory', 'La memoria fisica', 'A destra: i blocchi, con il valore di x che contengono.']
    ]
  },
  lab: {
    titolo: 'Padre e figlio dopo fork',
    scena: { w: 860, h: 140 },
    atti: ['Prima di fork', 'La duplicazione', 'La scrittura', 'La fine'],
    controlli: [
      { id: 'x', tipo: 'scelta', eti: 'Valore di x', opzioni: [[6, '6'], [10, '10'], [41, '41']], valore: 6 },
      { id: 'chi', tipo: 'scelta', eti: 'Dopo fork incrementa x', opzioni: [['figlio', 'il figlio'], ['padre', 'il padre'], ['nessuno', 'nessuno']], valore: 'figlio' }
    ],
    nota: 'I passi sono sei, quattro se nessuno scrive. Il padre ha PID 80, il figlio 81.',
    previsione: {
      domanda: (p) => 'Un processo ha la variabile x uguale a ' + p.x + ' e chiama fork. Dopo la chiamata ' + (p.chi === 'nessuno' ? 'nessuno dei due modifica x' : 'il ' + p.chi + ' esegue x = x + 1') + '. Quanto vale x, alla fine, nel padre e nel figlio?',
      opzioni: (p) => [[p.x + ',' + p.x, p.x + ' nel padre, ' + p.x + ' nel figlio'], [p.x + ',' + (p.x + 1), p.x + ' nel padre, ' + (p.x + 1) + ' nel figlio'], [(p.x + 1) + ',' + p.x, (p.x + 1) + ' nel padre, ' + p.x + ' nel figlio'], [(p.x + 1) + ',' + (p.x + 1), (p.x + 1) + ' in entrambi']]
    },
    confronto: (pred, esito, p) => { const T = (c) => c.split(',').join(' nel padre e ') + ' nel figlio'; return 'La previsione indicava ' + T(pred) + '. I valori sono ' + T(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.chi === 'nessuno' ? 'Nessuno ha scritto, e i due processi leggono ancora lo stesso blocco.' : 'La scrittura del ' + p.chi + ' avviene su una copia privata della pagina, e l’altro processo conserva il valore di partenza.'); },
    costruisci(p) {
      const U = SL.unita521, passi = [], fin = U.finali(p), scr = p.chi !== 'nessuno', altro = p.chi === 'padre' ? 'figlio' : 'padre';
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, gap: 14, h: 56 });
      const hud = (f) => [['x nel padre', String(f >= 5 ? fin.padre : p.x), 'a'], ['x nel figlio', f >= 1 ? String(f >= 5 ? fin.figlio : p.x) : '·'], ['Blocchi con x', scr && f >= 4 ? '2' : '1', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Prima di fork', 'Esiste un solo processo, con PID 80. La sua variabile x vale ' + p.x + ', e la pagina che la contiene sta nel blocco 12 della memoria fisica. Il processo chiama fork.', {});
      P(1, 1, 'La duplicazione', 'Il kernel crea un secondo processo, con PID 81, e gli prepara una tabella delle pagine uguale a quella del padre: anche la sua pagina di x conduce al blocco 12. La chiamata ritorna due volte: 81 nel padre, 0 nel figlio.', { calc: 'padre: 81 · figlio: 0', chiedi: { d: 'Un processo riceve 0 da fork. Chi è?', o: ['Il padre', 'Il figlio'], g: 1, no: 'Al padre fork restituisce il PID del figlio, che è positivo. Lo 0 va al figlio.' } });
      P(2, 1, 'Due letture', 'Entrambi leggono x e trovano ' + p.x + '. Stanno leggendo lo stesso blocco, che il kernel ha segnato come di sola lettura in tutte e due le tabelle. Nessuna pagina è stata copiata.', { calc: 'x = ' + p.x + ' in entrambi' });
      if (scr) {
        P(3, 2, 'Il ' + p.chi + ' prova a scrivere', 'Il ' + p.chi + ' esegue x = x + 1. La pagina è di sola lettura, e la scrittura provoca una eccezione. Il kernel riconosce il caso: è una pagina condivisa dopo fork, da separare.', { calc: 'scrittura su pagina condivisa' });
        P(4, 2, 'La copia', 'Il kernel copia la pagina nel blocco 20 e aggiorna la tabella del ' + p.chi + ', che ora vi conduce. Il ' + altro + ' resta sul blocco 12. Poi lascia ripetere l’istruzione interrotta.', { calc: p.chi + ': pagina di x → blocco 20' });
        P(5, 3, 'I valori finali', 'La scrittura riesce, nel blocco 20: per il ' + p.chi + ' x vale ' + (p.x + 1) + '. Il ' + altro + ' legge ancora ' + p.x + ' nel blocco 12. Le due variabili hanno lo stesso nome e lo stesso indirizzo virtuale, e sono ormai due celle distinte.', { calc: 'padre ' + fin.padre + ' · figlio ' + fin.figlio, esito: ['padre ' + fin.padre + ', figlio ' + fin.figlio, ''] });
      } else P(5, 3, 'I valori finali', 'Nessuno dei due ha scritto. Padre e figlio leggono ancora ' + p.x + ' dallo stesso blocco 12, e la copia della pagina non è mai stata necessaria. È il risparmio che la copia su scrittura rende possibile.', { calc: 'padre ' + p.x + ' · figlio ' + p.x, esito: ['padre ' + p.x + ', figlio ' + p.x, ''] });
      return { passi, esito: U.chiave(p) };
    }
  },
  bilancio: {
    regola: [
      'fork crea un figlio che prosegue dallo stesso punto del padre. Al padre restituisce il PID del figlio, al figlio restituisce 0.',
      'Le variabili dei due processi sono indipendenti. Con la copia su scrittura una pagina viene duplicata soltanto quando uno dei due la modifica.'
    ],
    errori: [
      ['Aspettarsi che una modifica del figlio si veda nel padre.', 'Dopo fork ogni processo ha le proprie variabili.'],
      ['Scambiare i due valori restituiti.', 'Lo 0 va al figlio. Il padre riceve il PID del figlio.'],
      ['Pensare che fork copi subito tutta la memoria.', 'All’inizio le pagine sono condivise in sola lettura. La copia avviene alla prima scrittura, pagina per pagina.']
    ],
    saFare: ['Riconoscere padre e figlio dal valore restituito.', 'Prevedere il valore di una variabile nei due processi.', 'Spiegare quando una pagina viene davvero copiata.'],
    esercizi: [
      { d: 'Un processo ha una variabile n uguale a 20 e chiama fork. Poi il padre esegue n = n + 5, e il figlio esegue n = n − 3. Quanto vale n nel figlio?', segnaposto: 'Un numero', giuste: ['17', 'diciassette'],
        ok: 'Il figlio parte da 20 e sottrae 3. La somma eseguita dal padre riguarda un’altra cella.',
        diagnosi: [
          { se: ['22'], msg: 'Hai applicato entrambe le operazioni alla stessa variabile. Dopo fork le variabili sono due.' },
          { se: ['25'], msg: 'Questo è il valore nel padre.' },
          { se: ['20'], msg: 'Il figlio ha eseguito la propria sottrazione.' }
        ],
        altro: 'Il valore è diverso. Si applichi al valore di partenza soltanto l’operazione del figlio.',
        indizi: ['Al momento di fork, n vale 20 in entrambi.', 'Il figlio esegue n = n − 3.', '20 − 3 = 17.'],
        svolgimento: ['Dopo fork: padre 20, figlio 20.', 'Padre: 20 + 5 = 25.', 'Figlio: 20 − 3 = 17.'] },
      { d: 'Subito dopo fork, un processo controlla il valore restituito e trova 4312. Che cosa può concludere?', guida: 'Si scelga la risposta.', o: [
        { t: 'È il padre, e 4312 è il PID del figlio', ok: true, fb: 'Soltanto il padre riceve un numero positivo.' },
        { t: 'È il figlio, e 4312 è il proprio PID', fb: 'Al figlio fork restituisce 0.' },
        { t: 'È il figlio, e 4312 è il PID del padre', fb: 'Al figlio fork restituisce 0, qualunque sia il PID del padre.' }] },
      { d: 'Dopo fork né il padre né il figlio modificano una certa pagina. Quante copie fisiche di quella pagina esistono?', guida: 'Si scelga la risposta.', o: [
        { t: 'Una, condivisa in sola lettura', ok: true, fb: 'La copia su scrittura duplica una pagina soltanto alla prima modifica.' },
        { t: 'Due, una per processo', fb: 'Sarebbe così senza la copia su scrittura.' },
        { t: 'Nessuna: la pagina resta al padre', fb: 'Il figlio la raggiunge attraverso la propria tabella, e può leggerla.' }] }
    ],
    sfida: ['cslez5_2_01_process_control', 'Valori restituiti da fork']
  }
});
