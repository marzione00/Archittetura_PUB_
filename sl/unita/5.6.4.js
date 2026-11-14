'use strict';
SL.unita564 = (() => {
  const esito = (p) => (p.pol === 'lettori' ? p.k : 0);
  const traccia = (p) => {
    const T = [], lett = p.pol === 'lettori', nuovi = []; for (let j = 2; j <= p.k + 1; j++) nuovi.push('L' + j);
    let attivi = ['L1'], coda = [], sorpassi = 0, scrive = false;
    const S = (atto, titolo, testo, acc, extra) => T.push(Object.assign({ atto, titolo, testo, attivi: attivi.slice(), coda: coda.slice(), sorpassi, scrive, acc }, extra ? { extra } : {}));
    S(0, 'L1 sta leggendo', 'Il lettore L1 sta consultando i dati. Nessun thread è in attesa.', 'a', { calc: 'lettori attivi 1' });
    coda.push('S');
    S(1, 'S richiede la scrittura', 'Lo scrittore S richiede l’accesso. Una lettura è in corso, e una scrittura deve avvenire in modo esclusivo: S si pone in attesa.', 'c', { calc: 'S in attesa', chiedi: { d: 'L1 sta leggendo. S può entrare immediatamente a scrivere?', o: ['No, una scrittura esclude ogni altro accesso', 'Sì, lettura e scrittura sono compatibili'], g: 0, no: 'Uno scrittore modifica i dati, e un lettore attivo osserverebbe una versione parziale.' } });
    if (lett) {
      nuovi.forEach((L, j) => {
        attivi.push(L); sorpassi++;
        S(1, L + ' giunge ed entra', L + ' richiede la lettura. La sua lettura è compatibile con quella in corso, e la politica assegna la precedenza ai lettori: ' + L + ' entra immediatamente, prima di S.', 'as', { calc: 'lettori attivi ' + attivi.length + ' · anteposti ' + sorpassi });
        const esce = attivi.shift(), ultimo = j === nuovi.length - 1;
        if (!ultimo) S(1, esce + ' esce', esce + ' ha terminato la lettura. All’interno resta ' + attivi.join(', ') + ': i lettori attivi sono ancora ' + attivi.length + ', e S continua ad attendere.', 'a', { calc: 'lettori attivi ' + attivi.length });
        else S(1, esce + ' esce', esce + ' ha terminato la lettura. All’interno resta ' + attivi.join(', ') + ', e S continua ad attendere. In questo caso nessun altro lettore è in arrivo.', 'a', { calc: 'lettori attivi ' + attivi.length });
      });
      const ultimoL = attivi.shift(); coda = []; scrive = true; attivi = ['S'];
      S(2, ultimoL + ' esce · S entra', ultimoL + ' ha terminato, e nessun lettore è più all’interno. S ottiene l’accesso esclusivo e scrive.', 'aw', { calc: 'lettori attivi 0 · S scrive' });
      S(3, 'Il bilancio', 'Prima di S ' + (p.k === 1 ? 'è stato ammesso 1 lettore giunto' : 'sono stati ammessi ' + p.k + ' lettori giunti') + ' dopo di esso. S è entrato soltanto poiché gli arrivi si sono interrotti. Con un flusso continuo di lettori la sua attesa sarebbe proseguita senza limite.', 's', { esito: [p.k + (p.k === 1 ? ' lettore prima di S' : ' lettori prima di S'), ''] });
    } else {
      nuovi.forEach((L) => { coda.push(L); S(1, L + ' giunge e si accoda', L + ' richiede la lettura. La sua lettura sarebbe compatibile con quella in corso. La politica rispetta tuttavia l’ordine di arrivo, e in attesa è già presente S: ' + L + ' si accoda dopo S.', 'c', { calc: 'in attesa: ' + coda.join(', ') }); });
      attivi = ['S']; coda.shift(); scrive = true;
      S(2, 'L1 esce · S entra', 'L1 ha terminato la lettura, e nessun lettore è più all’interno. S è il primo della coda: ottiene l’accesso esclusivo e scrive.', 'aw', { calc: 'lettori attivi 0 · S scrive' });
      attivi = coda.slice(); coda = []; scrive = false;
      S(2, 'S esce · ' + (p.k === 1 ? 'entra L2' : 'entrano i lettori'), 'S ha terminato la scrittura. ' + (p.k === 1 ? 'L2, che era in attesa, entra e legge i dati aggiornati.' : 'I lettori in coda sono consecutivi, e le loro letture sono compatibili: entrano tutti insieme.'), 'ac', { calc: 'lettori attivi ' + attivi.length });
      S(3, 'Il bilancio', 'Nessun lettore giunto dopo S lo ha preceduto. L’attesa di S è durata quanto la lettura di L1. Il costo è stato il rinvio di ' + (p.k === 1 ? 'una lettura che sarebbe stata compatibile.' : p.k + ' letture che sarebbero state compatibili.'), 's', { esito: ['0 lettori prima di S', ''] });
    }
    return T;
  };
  const quadro = (pre, s, o) => {
    const el = SL.el, w2 = (o.w - 10) / 2, w3 = (o.w - 20) / 3, a = (c) => s.acc.indexOf(c) >= 0, lettori = s.scrive ? 0 : s.attivi.length;
    return [
      el.box(pre + 'c', o.x, o.y, w2, 54, 'in attesa · ordine di arrivo', s.coda.length ? s.coda.join(', ') : 'nessuno', a('c') ? 'att' : s.coda.length ? 'zero' : 'on', { cls: 'stretta' }),
      el.box(pre + 'a', o.x + w2 + 10, o.y, w2, 54, 'accedono ai dati', s.attivi.length ? s.attivi.join(', ') : 'nessuno', a('a') ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'l', o.x, o.y + 64, w3, 54, 'lettori attivi', String(lettori), a('a') && !s.scrive ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'w', o.x + w3 + 10, o.y + 64, w3, 54, 'scrittore attivo', s.scrive ? 'S' : 'nessuno', a('w') ? 'att' : s.scrive ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 's', o.x + 2 * (w3 + 10), o.y + 64, w3, 54, 'lettori anteposti a S', String(s.sorpassi), s.sorpassi > 0 ? 'err' : a('s') ? 'att' : 'on', { cls: 'stretta' })
    ];
  };
  return { esito, traccia, quadro };
})();
SL.registra('5.6.4', {
  titolo: 'Lettori e scrittori: sicurezza e politica di ammissione',
  obiettivo: 'Obiettivo: stabilire quali accessi sono compatibili su dati condivisi, e confrontare due politiche di ammissione rispetto all’attesa massima di uno scrittore.',
  concetti: [['tabella', 'Più lettori insieme, un solo scrittore'], ['coda', 'L’ammissione fra più richieste in attesa'], ['clock', 'Un’attesa priva di limite']],
  filigrana: ['tabella', 'coda', 'clock'],
  richiami: {
    carte: [
      { sim: 'lucchetto', da: 'Dall’unità 5.5.2', t: 'La mutua esclusione', d: 'Un thread per volta nella sezione critica.' },
      { sim: 'coda', da: 'Dall’unità 4.5.3', t: 'L’ordine di arrivo', d: 'Il servizio secondo l’ordine di arrivo delle richieste.' },
      { sim: 'clock', da: 'Dall’unità 5.3.4', t: 'Le attese senza limite', d: 'Un lavoro preceduto senza interruzione può attendere indefinitamente, in assenza di un meccanismo che lo faccia avanzare.' }
    ],
    domanda: { d: 'Prima di proseguire: due thread leggono la medesima variabile nel medesimo momento, e nessuno la scrive. Può verificarsi una corsa critica?', o: [
      { t: 'No, senza scritture il valore letto è il medesimo per tutti', ok: true, fb: 'Una corsa critica richiede almeno una scrittura.' },
      { t: 'Sì, sempre', fb: 'Due letture lasciano invariato il dato, e l’ordine in cui avvengono è indifferente.' },
      { t: 'Sì, se i thread sono su core diversi', fb: 'Il numero dei core è irrilevante: senza scritture nessun esito dipende dall’ordine.' }
    ] }
  },
  idea: {
    titolo: 'Letture condivise, scrittura esclusiva',
    termini: ['lettori e scrittori', 'politica di ammissione', 'starvation'],
    testo: [
      'Una tabella consultata da molti thread e modificata di rado presenta un’esigenza specifica. Due letture contemporanee sono innocue, poiché nessuna modifica i dati. Una scrittura deve invece avvenire in modo esclusivo: un lettore attivo durante la modifica potrebbe osservare una riga aggiornata e una ancora precedente. Un mutex ordinario risolverebbe il problema con l’ingresso di un thread per volta, e impedirebbe tutte le letture che potevano procedere insieme.',
      'Lo schema che si fonda su questa differenza prende il nome di [[lettori e scrittori]]. Le regole di compatibilità sono due: più lettori possono accedere insieme, mentre uno scrittore accede soltanto in modo esclusivo, senza lettori e senza altri scrittori. Tali regole garantiscono la sicurezza, poiché nessun lettore osserverà mai dati parziali. Lasciano tuttavia aperta una seconda decisione.',
      'Si supponga che il lettore L1 stia leggendo e che lo scrittore S richieda l’ingresso: S deve attendere. Giunge quindi un secondo lettore, L2. La sua lettura è compatibile con quella di L1, e le alternative sono due: l’ingresso immediato, oppure l’accodamento dopo S. La regola che seleziona fra le due è la [[politica di ammissione]].',
      { fig: 'scena', w: 720, h: 126, titolo: 'Precedenza ai lettori: L1 è uscito, e S attende ancora', nota: 'L2 è entrato insieme a L1, prima di S. Finché un lettore è all’interno, lo scrittore resta in attesa.', els: SL.unita564.quadro('g', SL.unita564.traccia({ pol: 'lettori', k: 1 })[3], { x: 10, y: 4, w: 700 }) },
      'Con la precedenza ai lettori L2 entra. Quando L1 esce resta all’interno L2, e S attende ancora. Se nel frattempo giunge L3, entra a sua volta. Finché i lettori continuano a giungere prima dell’uscita dell’ultimo, il gruppo dei lettori attivi resta popolato, e il turno di S può essere rinviato senza limite. Un thread che resta pronto a entrare ed è preceduto indefinitamente subisce una [[starvation]]. A differenza del deadlock, in questo caso il sistema prosegue il lavoro, e un singolo thread resta escluso.',
      'Con l’ordine di arrivo L2 si accoda dopo S. All’uscita di L1 il gruppo dei lettori è vuoto, e S entra in modo esclusivo. Quando S esce entrano i lettori in attesa. L’attesa di S ha ora un limite, e il costo è il rinvio di una lettura che sarebbe stata compatibile. Sicurezza ed equità sono dunque due proprietà separate: la prima stabilisce quali accessi sono compatibili, la seconda quale richiesta è ammessa quando più richieste sono in attesa.'
    ]
  },
  esperimento: {
    faremo: [
      'L1 sta leggendo, e lo scrittore S richiede l’ingresso. Giungono quindi altri lettori, ciascuno prima dell’uscita del precedente. I controlli fissano la politica di ammissione e il numero dei lettori in arrivo.',
      'L’esperimento segue i thread in attesa e i thread che accedono ai dati. Un contatore registra i lettori ammessi prima di S pur essendo giunti dopo.'
    ],
    vedrai: [
      ['coda', 'La coda e l’accesso', 'In alto: a sinistra i thread in attesa, nell’ordine di arrivo. A destra i thread che accedono ai dati.'],
      ['clock', 'I conteggi', 'In basso: i lettori attivi, lo scrittore attivo, e i lettori anteposti a S.']
    ]
  },
  lab: {
    titolo: 'Uno scrittore in attesa, e i lettori in arrivo',
    scena: { w: 860, h: 130 },
    atti: ['L’inizio', 'Gli arrivi', 'Il turno di S', 'Il bilancio'],
    controlli: [
      { id: 'pol', tipo: 'scelta', eti: 'Politica di ammissione', opzioni: [['lettori', 'precedenza ai lettori'], ['arrivo', 'ordine di arrivo']], valore: 'lettori' },
      { id: 'k', tipo: 'scelta', eti: 'Lettori che giungono dopo S', opzioni: [[1, '1'], [3, '3']], valore: 3 }
    ],
    nota: 'Il numero dei passi dipende dalla politica e dagli arrivi. Ogni lettore giunge prima dell’uscita del precedente.',
    previsione: {
      domanda: (p) => 'L1 sta leggendo, e lo scrittore S richiede l’ingresso. In seguito ' + (p.k === 1 ? 'giunge un altro lettore, L2' : 'giungono altri tre lettori, L2, L3 e L4, ciascuno prima dell’uscita del precedente') + '. La politica è: ' + (p.pol === 'lettori' ? 'precedenza ai lettori' : 'ordine di arrivo') + '. Quanti di questi nuovi lettori accedono ai dati prima di S?',
      opzioni: () => [0, 1, 3].map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Prima di S ' + (esito === 1 ? 'è entrato 1 nuovo lettore' : 'sono entrati ' + esito + ' nuovi lettori') + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.pol === 'lettori' ? 'Con la precedenza ai lettori ogni nuovo lettore trova una lettura in corso e vi si unisce, prima di S.' : 'Con l’ordine di arrivo i nuovi lettori si accodano dopo S, anche se la loro lettura sarebbe compatibile con quella in corso.'),
    costruisci(p) {
      const U = SL.unita564, T = U.traccia(p);
      const passi = T.map((s) => Object.assign({ atto: s.atto, titolo: s.titolo, testo: s.testo, hud: [['In attesa', s.coda.length ? s.coda.join(', ') : 'nessuno'], ['Accedono', s.attivi.length ? s.attivi.join(', ') : 'nessuno', 'a'], ['Sorpassi', String(s.sorpassi), 'c']], els: U.quadro('b', s, { x: 20, y: 4, w: 820 }) }, s.extra || {}));
      return { passi, esito: U.esito(p) };
    }
  },
  bilancio: {
    regola: [
      'Compatibilità: più lettori insieme, oppure un solo scrittore. È la regola che garantisce la sicurezza.',
      'Ammissione: precedenza ai lettori oppure ordine di arrivo. È la regola che determina l’attesa massima di uno scrittore.'
    ],
    errori: [
      ['Confondere sicurezza ed equità.', 'Una politica può garantire dati coerenti e lasciare uno scrittore in attesa senza limite.'],
      ['Scambiare la starvation per un deadlock.', 'Nella starvation il sistema prosegue il lavoro, e un thread è preceduto indefinitamente. Nel deadlock nessuno dei thread coinvolti può più proseguire.'],
      ['Impiegare un mutex ordinario per dati quasi sempre letti.', 'Le letture, che potrebbero procedere insieme, sarebbero eseguite in successione.']
    ],
    saFare: ['Stabilire se due accessi sono compatibili.', 'Seguire la coda e gli accessi sotto una politica data.', 'Riconoscere un’attesa priva di limite.'],
    esercizi: [
      { d: 'Con la precedenza ai lettori, uno scrittore attende mentre un lettore legge. Giungono altri 5 lettori, ciascuno prima dell’uscita del precedente. Quanti lettori accedono complessivamente ai dati prima dello scrittore?', segnaposto: 'Un numero', giuste: ['6', 'sei'],
        ok: 'Il lettore già all’interno, più i cinque giunti dopo: 6.',
        diagnosi: [
          { se: ['5', 'cinque'], msg: 'Va contato anche il lettore che stava già leggendo.' },
          { se: ['1', 'uno'], msg: 'Con la precedenza ai lettori ogni nuovo lettore entra immediatamente, prima dello scrittore.' },
          { se: ['0', 'zero'], msg: 'Un lettore sta già leggendo, e gli altri vi si uniscono.' }
        ],
        altro: 'Il numero è diverso. Si sommino il lettore già all’interno e quelli che entrano prima dello scrittore.',
        indizi: ['Un lettore è già all’interno.', 'Ogni nuovo lettore trova una lettura in corso, ed entra.', '1 + 5 = 6.'],
        svolgimento: ['Lettore iniziale: 1.', 'Lettori giunti dopo: 5.', 'Totale prima dello scrittore: 6.'] },
      { d: 'Quale coppia di accessi può avvenire nel medesimo momento?', guida: 'Si scelga la risposta.', o: [
        { t: 'Due letture', ok: true, fb: 'Nessuna delle due modifica i dati.' },
        { t: 'Una lettura e una scrittura', fb: 'Il lettore potrebbe osservare i dati durante la modifica.' },
        { t: 'Due scritture', fb: 'Le due modifiche potrebbero intercalarsi, come gli incrementi dell’unità 5.5.1.' }] },
      { d: 'Con l’ordine di arrivo, L1 sta leggendo. Giungono nell’ordine S1, L2, L3, S2. Escono prima L1 e quindi S1. Quanti thread accedono ai dati immediatamente dopo l’uscita di S1?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: 'L2 e L3 sono lettori consecutivi nella coda, ed entrano insieme. S2 attende.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'S2 è uno scrittore, e uno scrittore entra soltanto in modo esclusivo.' },
          { se: ['1', 'uno'], msg: 'L2 e L3 sono due lettori consecutivi, e possono entrare insieme.' }
        ],
        altro: 'Il numero è diverso. Si scriva la coda dopo l’uscita di S1 e si ammettano tutti i lettori che precedono lo scrittore successivo.',
        indizi: ['Dopo l’uscita di S1 la coda è L2, L3, S2.', 'L2 e L3 sono compatibili fra loro.', 'Entrano in 2.'],
        svolgimento: ['Coda: L2, L3, S2.', 'Entrano: L2 e L3.', 'Resta in attesa: S2.'] }
    ],
    sfida: ['cslez5_6_04_classical_sync', 'Accesso di lettori e scrittori']
  }
});
