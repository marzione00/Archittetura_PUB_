'use strict';
SL.unita564 = (() => {
  const esito = (p) => (p.pol === 'lettori' ? p.k : 0);
  const traccia = (p) => {
    const T = [], lett = p.pol === 'lettori', nuovi = []; for (let j = 2; j <= p.k + 1; j++) nuovi.push('L' + j);
    let attivi = ['L1'], coda = [], sorpassi = 0, scrive = false;
    const S = (atto, titolo, testo, acc, extra) => T.push(Object.assign({ atto, titolo, testo, attivi: attivi.slice(), coda: coda.slice(), sorpassi, scrive, acc }, extra ? { extra } : {}));
    S(0, 'L1 sta leggendo', 'Il lettore L1 sta consultando i dati. Nessuno aspetta.', 'a', { calc: 'lettori attivi 1' });
    coda.push('S');
    S(1, 'S chiede di scrivere', 'Lo scrittore S chiede l’accesso. Una lettura è in corso, e una scrittura deve avvenire da sola: S si mette in attesa.', 'c', { calc: 'S in attesa', chiedi: { d: 'L1 sta leggendo. S può entrare subito a scrivere?', o: ['No: una scrittura esclude ogni altro accesso', 'Sì: lettura e scrittura sono compatibili'], g: 0, no: 'Uno scrittore modifica i dati, e chi sta leggendo vedrebbe una versione a metà.' } });
    if (lett) {
      nuovi.forEach((L, j) => {
        attivi.push(L); sorpassi++;
        S(1, L + ' arriva ed entra', L + ' chiede di leggere. La sua lettura è compatibile con quella in corso, e la politica dà la precedenza ai lettori: ' + L + ' entra subito, davanti a S.', 'as', { calc: 'lettori attivi ' + attivi.length + ' · sorpassi ' + sorpassi });
        const esce = attivi.shift(), ultimo = j === nuovi.length - 1;
        if (!ultimo) S(1, esce + ' esce', esce + ' ha finito di leggere. Dentro resta ' + attivi.join(', ') + ': i lettori attivi sono ancora ' + attivi.length + ', e S continua ad aspettare.', 'a', { calc: 'lettori attivi ' + attivi.length });
        else S(1, esce + ' esce', esce + ' ha finito di leggere. Dentro resta ' + attivi.join(', ') + ', e S continua ad aspettare. Questa volta nessun altro lettore è in arrivo.', 'a', { calc: 'lettori attivi ' + attivi.length });
      });
      const ultimoL = attivi.shift(); coda = []; scrive = true; attivi = ['S'];
      S(2, ultimoL + ' esce · S entra', ultimoL + ' ha finito, e nessun lettore è più dentro. S ottiene l’accesso esclusivo e scrive.', 'aw', { calc: 'lettori attivi 0 · S scrive' });
      S(3, 'Il bilancio', 'Davanti a S ' + (p.k === 1 ? 'è passato 1 lettore arrivato' : 'sono passati ' + p.k + ' lettori arrivati') + ' dopo di lui. S è entrato soltanto perché gli arrivi si sono interrotti. Con un flusso continuo di lettori la sua attesa sarebbe proseguita senza limite.', 's', { esito: [p.k + (p.k === 1 ? ' lettore davanti a S' : ' lettori davanti a S'), ''] });
    } else {
      nuovi.forEach((L) => { coda.push(L); S(1, L + ' arriva e si accoda', L + ' chiede di leggere. La sua lettura sarebbe compatibile con quella in corso. La politica però rispetta l’ordine di arrivo, e in attesa c’è già S: ' + L + ' si mette in fila dietro di lui.', 'c', { calc: 'in attesa: ' + coda.join(', ') }); });
      attivi = ['S']; coda.shift(); scrive = true;
      S(2, 'L1 esce · S entra', 'L1 ha finito di leggere, e nessun lettore è più dentro. S è il primo della fila: ottiene l’accesso esclusivo e scrive.', 'aw', { calc: 'lettori attivi 0 · S scrive' });
      attivi = coda.slice(); coda = []; scrive = false;
      S(2, 'S esce · ' + (p.k === 1 ? 'entra L2' : 'entrano i lettori'), 'S ha finito di scrivere. ' + (p.k === 1 ? 'L2, che aspettava, entra e legge i dati aggiornati.' : 'I lettori in fila sono consecutivi, e le loro letture sono compatibili: entrano tutti insieme.'), 'ac', { calc: 'lettori attivi ' + attivi.length });
      S(3, 'Il bilancio', 'Nessun lettore arrivato dopo S gli è passato davanti. L’attesa di S è durata quanto la lettura di L1. Il prezzo è stato rimandare ' + (p.k === 1 ? 'una lettura che sarebbe stata compatibile.' : p.k + ' letture che sarebbero state compatibili.'), 's', { esito: ['0 lettori davanti a S', ''] });
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
      el.box(pre + 's', o.x + 2 * (w3 + 10), o.y + 64, w3, 54, 'sorpassi subiti da S', String(s.sorpassi), s.sorpassi > 0 ? 'err' : a('s') ? 'att' : 'on', { cls: 'stretta' })
    ];
  };
  return { esito, traccia, quadro };
})();
SL.registra('5.6.4', {
  titolo: 'Lettori e scrittori: sicurezza e politica di ammissione',
  obiettivo: 'Obiettivo: stabilire quali accessi possono convivere su dati condivisi, e confrontare due politiche di ammissione guardando quanto può aspettare uno scrittore.',
  concetti: [['tabella', 'Molti a leggere, uno a scrivere'], ['coda', 'Chi entra, quando più richieste aspettano'], ['clock', 'Un’attesa che può non finire']],
  filigrana: ['tabella', 'coda', 'clock'],
  richiami: {
    carte: [
      { sim: 'lucchetto', da: 'Dall’unità 5.5.2', t: 'La mutua esclusione', d: 'Un thread per volta nella sezione critica.' },
      { sim: 'coda', da: 'Dall’unità 4.5.3', t: 'L’ordine di arrivo', d: 'Servire per primo chi è arrivato per primo.' },
      { sim: 'clock', da: 'Dall’unità 5.3.4', t: 'Le attese senza limite', d: 'Un lavoro scavalcato di continuo può aspettare all’infinito, se nulla lo fa avanzare.' }
    ],
    domanda: { d: 'Prima di proseguire: due thread leggono la stessa variabile nello stesso momento, e nessuno la scrive. Può nascere una corsa critica?', o: [
      { t: 'No: senza scritture il valore letto è lo stesso per tutti', ok: true, fb: 'Una corsa critica richiede almeno una scrittura.' },
      { t: 'Sì, sempre', fb: 'Due letture lasciano il dato com’è, e l’ordine in cui avvengono è indifferente.' },
      { t: 'Sì, se i thread sono su core diversi', fb: 'Il numero dei core è irrilevante: senza scritture nessun esito dipende dall’ordine.' }
    ] }
  },
  idea: {
    titolo: 'Molti a leggere, uno solo a scrivere',
    termini: ['lettori e scrittori', 'politica di ammissione', 'starvation'],
    testo: [
      'Una tabella consultata da molti thread e modificata di rado ha un’esigenza particolare. Due letture contemporanee sono innocue, perché nessuna cambia i dati. Una scrittura invece deve avvenire da sola: chi leggesse durante la modifica potrebbe vedere una riga aggiornata e una ancora vecchia. Un mutex ordinario risolverebbe il problema facendo entrare un thread per volta, e sprecherebbe tutte le letture che potevano procedere insieme.',
      'Lo schema che sfrutta questa differenza si chiama [[lettori e scrittori]]. Le regole di compatibilità sono due. Più lettori possono accedere insieme. Uno scrittore accede soltanto da solo, senza lettori e senza altri scrittori. Queste regole garantiscono la sicurezza: nessun lettore vedrà mai dati a metà. Lasciano però aperta una seconda decisione.',
      'Supponiamo che il lettore L1 stia leggendo e che lo scrittore S chieda di entrare. S deve aspettare. Arriva poi un secondo lettore, L2. La sua lettura è compatibile con quella di L1, e le strade sono due: farlo entrare subito, oppure metterlo in fila dietro S. La regola che sceglie fra le due è la [[politica di ammissione]].',
      { fig: 'scena', w: 720, h: 126, titolo: 'Precedenza ai lettori: L1 è uscito, e S aspetta ancora', nota: 'L2 è entrato accanto a L1 passando davanti a S. Finché un lettore è dentro, lo scrittore resta in attesa.', els: SL.unita564.quadro('g', SL.unita564.traccia({ pol: 'lettori', k: 1 })[3], { x: 10, y: 4, w: 700 }) },
      'Con la precedenza ai lettori L2 entra. Quando L1 esce resta dentro L2, e S aspetta ancora. Se nel frattempo arriva L3, entra anche lui. Finché i lettori continuano ad arrivare prima che l’ultimo sia uscito, il gruppo dei lettori attivi resta popolato, e il turno di S può slittare senza limite. Un thread che resta pronto a entrare e viene scavalcato a oltranza subisce una [[starvation]]. A differenza del deadlock, qui il sistema lavora: è un singolo thread a restare indietro.',
      'Con l’ordine di arrivo L2 si accoda dietro S. All’uscita di L1 il gruppo dei lettori è vuoto, e S entra da solo. Quando S esce entrano i lettori che aspettavano. L’attesa di S ha ora un limite, e il prezzo è una lettura rimandata che sarebbe stata compatibile. Sicurezza ed equità sono dunque due proprietà separate. La prima dice quali accessi possono convivere. La seconda dice chi viene ammesso quando più richieste aspettano.'
    ]
  },
  esperimento: {
    faremo: [
      'L1 sta leggendo, e lo scrittore S chiede di entrare. Poi arrivano altri lettori, ciascuno prima che il precedente sia uscito. Sceglierai la politica di ammissione e quanti lettori arrivano.',
      'Seguiremo chi è in attesa e chi accede ai dati. Un contatore terrà il conto dei lettori che passano davanti a S pur essendo arrivati dopo di lui.'
    ],
    vedrai: [
      ['coda', 'La fila e l’accesso', 'In alto: a sinistra chi aspetta, nell’ordine di arrivo. A destra chi sta accedendo ai dati.'],
      ['clock', 'I conteggi', 'In basso: i lettori attivi, lo scrittore attivo, e i sorpassi subiti da S.']
    ]
  },
  lab: {
    titolo: 'Uno scrittore in attesa, e i lettori che arrivano',
    scena: { w: 860, h: 130 },
    atti: ['L’inizio', 'Gli arrivi', 'Il turno di S', 'Il bilancio'],
    controlli: [
      { id: 'pol', tipo: 'scelta', eti: 'Politica di ammissione', opzioni: [['lettori', 'precedenza ai lettori'], ['arrivo', 'ordine di arrivo']], valore: 'lettori' },
      { id: 'k', tipo: 'scelta', eti: 'Lettori che arrivano dopo S', opzioni: [[1, '1'], [3, '3']], valore: 3 }
    ],
    nota: 'Il numero dei passi dipende dalla politica e dagli arrivi. Ogni lettore arriva prima che il precedente sia uscito.',
    previsione: {
      domanda: (p) => 'L1 sta leggendo, e lo scrittore S chiede di entrare. Poi ' + (p.k === 1 ? 'arriva un altro lettore, L2' : 'arrivano altri tre lettori, L2, L3 e L4, ciascuno prima che il precedente sia uscito') + '. La politica è: ' + (p.pol === 'lettori' ? 'precedenza ai lettori' : 'ordine di arrivo') + '. Quanti di questi nuovi lettori accedono ai dati prima di S?',
      opzioni: () => [0, 1, 3].map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Prima di S ' + (esito === 1 ? 'è entrato 1 nuovo lettore' : 'sono entrati ' + esito + ' nuovi lettori') + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.pol === 'lettori' ? 'Con la precedenza ai lettori ogni nuovo arrivato trova una lettura in corso e si unisce, davanti a S.' : 'Con l’ordine di arrivo i nuovi lettori si accodano dietro S, anche se la loro lettura sarebbe compatibile con quella in corso.'),
    costruisci(p) {
      const U = SL.unita564, T = U.traccia(p);
      const passi = T.map((s) => Object.assign({ atto: s.atto, titolo: s.titolo, testo: s.testo, hud: [['In attesa', s.coda.length ? s.coda.join(', ') : 'nessuno'], ['Accedono', s.attivi.length ? s.attivi.join(', ') : 'nessuno', 'a'], ['Sorpassi', String(s.sorpassi), 'c']], els: U.quadro('b', s, { x: 20, y: 4, w: 820 }) }, s.extra || {}));
      return { passi, esito: U.esito(p) };
    }
  },
  bilancio: {
    regola: [
      'Compatibilità: più lettori insieme, oppure un solo scrittore. È la regola che dà sicurezza.',
      'Ammissione: precedenza ai lettori oppure ordine di arrivo. È la regola che decide quanto può aspettare uno scrittore.'
    ],
    errori: [
      ['Confondere sicurezza ed equità.', 'Una politica può garantire dati coerenti e lasciare uno scrittore in attesa senza limite.'],
      ['Scambiare la starvation per un deadlock.', 'Nella starvation il sistema lavora, e un thread viene scavalcato. Nel deadlock nessuno dei thread coinvolti può più proseguire.'],
      ['Usare un mutex ordinario per dati quasi sempre letti.', 'Le letture, che potrebbero procedere insieme, verrebbero messe in fila una dopo l’altra.']
    ],
    saFare: ['Stabilire se due accessi sono compatibili.', 'Seguire la fila e gli accessi sotto una politica data.', 'Riconoscere una attesa che può non finire.'],
    esercizi: [
      { d: 'Con la precedenza ai lettori, uno scrittore aspetta mentre un lettore legge. Arrivano altri 5 lettori, ciascuno prima che il precedente sia uscito. Quanti lettori in tutto accedono ai dati prima dello scrittore?', segnaposto: 'Un numero', giuste: ['6', 'sei'],
        ok: 'Il lettore già dentro, più i cinque arrivati dopo: 6.',
        diagnosi: [
          { se: ['5', 'cinque'], msg: 'Conta anche il lettore che stava già leggendo.' },
          { se: ['1', 'uno'], msg: 'Con la precedenza ai lettori ogni nuovo arrivato entra subito, davanti allo scrittore.' },
          { se: ['0', 'zero'], msg: 'Un lettore sta già leggendo, e gli altri lo raggiungono.' }
        ],
        altro: 'Il numero è diverso. Somma il lettore già dentro e quelli che entrano davanti allo scrittore.',
        indizi: ['Un lettore è già dentro.', 'Ogni nuovo lettore trova una lettura in corso, ed entra.', '1 + 5 = 6.'],
        svolgimento: ['Lettore iniziale: 1.', 'Lettori arrivati dopo: 5.', 'Totale prima dello scrittore: 6.'] },
      { d: 'Quale coppia di accessi può avvenire nello stesso momento?', guida: 'Si scelga la risposta.', o: [
        { t: 'Due letture', ok: true, fb: 'Nessuna delle due modifica i dati.' },
        { t: 'Una lettura e una scrittura', fb: 'Il lettore potrebbe vedere i dati a metà della modifica.' },
        { t: 'Due scritture', fb: 'Le due modifiche potrebbero mescolarsi, come gli incrementi dell’unità 5.5.1.' }] },
      { d: 'Con l’ordine di arrivo, L1 sta leggendo. Arrivano nell’ordine S1, L2, L3, S2. Escono prima L1 e poi S1. Quanti thread accedono ai dati subito dopo l’uscita di S1?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: 'L2 e L3 sono lettori consecutivi nella fila, ed entrano insieme. S2 aspetta.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'S2 è uno scrittore, e uno scrittore entra soltanto da solo.' },
          { se: ['1', 'uno'], msg: 'L2 e L3 sono due lettori consecutivi, e possono entrare insieme.' }
        ],
        altro: 'Il numero è diverso. Si scriva la fila dopo l’uscita di S1 e si faccia entrare tutti i lettori che precedono il prossimo scrittore.',
        indizi: ['Dopo l’uscita di S1 la fila è L2, L3, S2.', 'L2 e L3 sono compatibili fra loro.', 'Entrano in 2.'],
        svolgimento: ['Fila: L2, L3, S2.', 'Entrano: L2 e L3.', 'Resta in attesa: S2.'] }
    ],
    sfida: ['cslez5_6_04_classical_sync', 'Accesso di lettori e scrittori']
  }
});
