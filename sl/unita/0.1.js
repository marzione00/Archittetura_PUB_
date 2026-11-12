'use strict';
SL.registra('0.1', {
  titolo: 'Che cos’è un calcolatore',
  obiettivo: 'Alla fine saprai nominare le quattro parti di ogni calcolatore e descrivere il viaggio di un dato dall’ingresso all’uscita.',
  concetti: [['dispositivo', 'Ingresso'], ['memory', 'Memoria'], ['cpu', 'Processore'], ['terminale', 'Uscita']],
  filigrana: ['cpu', 'memory', 'dispositivo'],
  richiami: {
    guida: 'Questa è la prima unità del corso e si può affrontare senza conoscenze precedenti. Basta la curiosità di guardare dentro una macchina che usi ogni giorno.',
    carte: [],
    domanda: { d: 'Per scaldarti: quale di questi oggetti contiene un calcolatore?', o: [
      { t: 'Un telefono', fb: 'È vero, e vale anche per la lavatrice moderna: la risposta più completa è «entrambi».' },
      { t: 'Una lavatrice moderna', fb: 'È vero, e vale anche per il telefono: la risposta più completa è «entrambi».' },
      { t: 'Entrambi', ok: true, fb: 'Tutti e due contengono una macchina che riceve dati, li trasforma e restituisce un risultato.' }
    ] }
  },
  idea: {
    titolo: 'Quattro parti, un solo mestiere',
    termini: ['calcolatore', 'dispositivo', 'memoria', 'processore', 'dato'],
    testo: [
      'Un telefono, un portatile, il cruscotto di un’automobile e la cassa di un supermercato sembrano oggetti lontanissimi fra loro. Dentro ciascuno lavora la stessa specie di macchina, il [[calcolatore]]. Il suo mestiere è sempre uguale e si può dire in una riga: riceve dei dati, li trasforma e restituisce un risultato.',
      'Per riuscirci ogni calcolatore è fatto di quattro parti. La prima è l’insieme dei [[dispositivo|dispositivi di ingresso]], da cui i dati entrano: una tastiera, uno schermo tattile, un microfono, un sensore. La seconda è la [[memoria]], un grande casellario in cui i dati aspettano di essere usati. La terza è il [[processore]], l’unica parte che esegue le operazioni: confronta, somma, sposta. La quarta è l’insieme dei [[dispositivo|dispositivi di uscita]], da cui il risultato raggiunge il mondo: uno schermo, un altoparlante, una stampante.',
      'Pensa a una cucina. Gli ingredienti arrivano dalla porta sul retro, vengono sistemati sugli scaffali, il cuoco li prende quando gli servono e li lavora sul suo banco, e il piatto finito esce dalla porta della sala. Gli scaffali conservano e il cuoco cucina. Ogni parte ha un compito solo. In un calcolatore la porta sul retro è l’ingresso, gli scaffali sono la memoria, il cuoco è il processore e la porta della sala è l’uscita.',
      { fig: 'scena', w: 700, h: 230, titolo: 'Le quattro parti e le strade che le collegano', nota: 'Fra l’ingresso e l’uscita manca una strada diretta. Ogni dato passa dalla memoria.', els: [
        SL.el.linea('l1', 170, 60, 270, 60, 'on'), SL.el.linea('l2', 430, 60, 530, 60, 'on'), SL.el.linea('l3', 350, 100, 350, 140, 'att'),
        SL.el.box('i', 20, 20, 150, 80, 'ingresso', 'tastiera', '', { sim: 'dispositivo' }),
        SL.el.box('m', 270, 20, 160, 80, 'memoria', 'caselle', '', { sim: 'memory' }),
        SL.el.box('u', 530, 20, 150, 80, 'uscita', 'schermo', '', { sim: 'terminale' }),
        SL.el.box('p', 270, 140, 160, 80, 'processore', 'operazioni', '', { sim: 'cpu' })] },
      'Ciò che viaggia fra le quattro parti si chiama [[dato]]: un numero, una lettera, un punto di un’immagine. Nel viaggio dall’ingresso all’uscita ogni dato passa sempre dalla memoria, perché il processore lavora soltanto su ciò che trova lì, e in memoria ritorna il risultato prima di essere mostrato.',
      'Quando premi il tasto 2 su una calcolatrice, il numero raggiunge lo schermo dopo un piccolo viaggio. Il tasto lo consegna alla memoria, il processore lo legge e decide che va mostrato, e lo schermo lo riceve. Tutto avviene in un tempo così breve da sembrare immediato. Nell’esperimento rallenteremo la scena e seguiremo una somma, un passaggio alla volta.'
    ]
  },
  esperimento: {
    faremo: [
      'Useremo una calcolatrice ridotta all’osso per sommare due numeri di una cifra. Seguiremo ogni dato dal momento in cui viene digitato fino al momento in cui il risultato compare sullo schermo.',
      'A ogni passo un solo dato si muove, da una parte a quella vicina. Tieni d’occhio le caselle della memoria: sono il punto in cui tutte le strade si incrociano.'
    ],
    vedrai: [
      ['dispositivo', 'L’ingresso', 'A sinistra, la tastiera da cui entrano i due numeri e il comando di somma.'],
      ['memory', 'La memoria', 'In alto al centro, tre caselle: una per ciascun numero e una per il risultato.'],
      ['cpu', 'Il processore', 'In basso al centro. È l’unico che esegue la somma.'],
      ['terminale', 'L’uscita', 'A destra, lo schermo su cui compare il risultato.']
    ]
  },
  lab: {
    titolo: 'Una somma al rallentatore',
    scena: { w: 860, h: 300 },
    atti: ['Preparazione', 'I dati entrano', 'Il processore lavora', 'Il risultato esce'],
    nota: 'I passi sono gli stessi per ogni coppia di numeri: la strada seguita dai dati resta uguale qualunque sia il loro valore.',
    controlli: [
      { id: 'a', tipo: 'num', eti: 'Primo numero', min: 0, max: 9, salti: [1], valore: 2 },
      { id: 'b', tipo: 'num', eti: 'Secondo numero', min: 0, max: 9, salti: [1], valore: 3 }
    ],
    previsione: {
      domanda: (p) => 'Sommeremo ' + p.a + ' e ' + p.b + '. Da quale parte passerà il risultato subito prima di arrivare allo schermo?',
      opzioni: () => [['ingresso', 'Dalla tastiera'], ['memoria', 'Dalla memoria'], ['processore', 'Dal processore']]
    },
    confronto: (pred, esito) => { const n = { ingresso: 'dalla tastiera', memoria: 'dalla memoria', processore: 'dal processore' }; return 'Avevi previsto che il risultato arrivasse allo schermo ' + n[pred] + '. Nell’esperimento è arrivato ' + n[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il processore deposita il risultato in una casella, e lo schermo lo riceve da lì.'); },
    costruisci(p) {
      const el = SL.el, s = p.a + p.b, passi = [];
      const mem = { A: null, B: null, R: null };
      const quadro = (o) => {
        o = o || {};
        const els = [
          el.linea('l1', 190, 150, 270, 96, o.via === 'im' ? 'on' : ''), el.linea('l2', 430, 118, 430, 190, o.via === 'mp' ? 'on' : ''), el.linea('l3', 590, 96, 670, 150, o.via === 'mu' ? 'on' : ''),
          el.box('i', 20, 100, 170, 100, 'ingresso', o.tasto ? 'tasto ' + o.tasto : 'tastiera', o.att === 'i' ? 'att' : '', { sim: 'dispositivo' }),
          el.zona('z', 250, 6, 360, 112, 'memoria', o.att === 'm' ? 'att' : ''),
          el.box('p', 330, 190, 200, 96, 'processore', o.op || 'in attesa', o.att === 'p' ? 'att' : '', { sim: 'cpu' }),
          el.box('u', 670, 100, 170, 100, 'uscita', o.schermo == null ? 'schermo vuoto' : 'schermo: ' + o.schermo, o.att === 'u' ? 'on' : '', { sim: 'terminale' })
        ];
        ['A', 'B', 'R'].forEach((k, j) => els.push(el.cella('c' + k, 270 + j * 112, 32, 96, 54, mem[k] === null ? '·' : String(mem[k]), o.cella === k ? 'att' : mem[k] === null ? '' : 'on', { gi: 'casella ' + k })));
        if (o.pacco) els.push(el.pacco('pk', o.pacco[0], o.pacco[1], o.pacco[2]));
        return els;
      };
      const hud = (dove, dato) => [['Dato in viaggio', dato == null ? '·' : dato, 'a'], ['Si trova', dove || '·'], ['Caselle occupate', Object.keys(mem).filter((k) => mem[k] !== null).length, 'c']];
      passi.push({ atto: 0, titolo: 'La calcolatrice è accesa', hud: hud(), els: quadro(),
        testo: 'Le quattro parti sono pronte. La memoria ha tre caselle vuote, il processore è in attesa e lo schermo non mostra nulla.' });
      [['A', p.a], ['B', p.b]].forEach(([k, v], j) => {
        passi.push({ atto: 1, titolo: 'Viene premuto il tasto ' + v, hud: hud('ingresso', v), els: quadro({ att: 'i', tasto: v, pacco: [150, 76, String(v)] }),
          testo: 'Il ' + (j ? 'secondo' : 'primo') + ' numero entra dalla tastiera. Per ora il dato si trova nel dispositivo di ingresso.',
          chiedi: j === 0 ? { d: 'Dove va adesso il numero ' + v + '?', o: ['Direttamente allo schermo', 'In una casella della memoria', 'Dentro il processore'], g: 1, no: 'Dall’ingresso parte una sola strada, e porta alla memoria. Lo schermo e il processore ricevono i dati da lì.' } : null });
        passi.push({ atto: 1, titolo: 'Il numero viaggia verso la memoria', hud: hud('in viaggio', v), els: quadro({ via: 'im', cella: k, pacco: [270 + j * 112 + 30, 4, String(v)] }),
          testo: 'La tastiera consegna il numero alla memoria, che gli riserva la casella ' + k + '.' });
        mem[k] = v;
        passi.push({ atto: 1, titolo: 'La casella ' + k + ' contiene ' + v, hud: hud('memoria', v), els: quadro({ att: 'm', cella: k }),
          testo: 'Il numero ' + v + ' ora è conservato nella casella ' + k + ' e ci resterà finché qualcuno non lo sostituirà.' });
      });
      passi.push({ atto: 2, titolo: 'Viene premuto il tasto +', hud: hud('ingresso', '+'), els: quadro({ att: 'i', tasto: '+' }),
        testo: 'Il tasto di somma porta un comando, a differenza dei due tasti precedenti che portavano numeri. Avverte il processore che è il momento di lavorare.',
        chiedi: { d: 'Dove prende il processore i due numeri da sommare?', o: ['Dalla tastiera', 'Dalle caselle A e B della memoria', 'Dallo schermo'], g: 1, no: 'La tastiera ha già consegnato i numeri alla memoria. Il processore lavora su ciò che trova nelle caselle.' } });
      passi.push({ atto: 2, titolo: 'Il processore legge la casella A', hud: hud('in viaggio', p.a), els: quadro({ via: 'mp', att: 'p', cella: 'A', op: 'leggo A', pacco: [390, 136, String(p.a)] }),
        testo: 'Il processore chiede alla memoria il contenuto della casella A e riceve una copia del numero ' + p.a + '. La casella conserva il suo contenuto.' });
      passi.push({ atto: 2, titolo: 'Il processore legge la casella B', hud: hud('in viaggio', p.b), els: quadro({ via: 'mp', att: 'p', cella: 'B', op: 'leggo B', pacco: [440, 136, String(p.b)] }),
        testo: 'Allo stesso modo riceve una copia del numero ' + p.b + ' dalla casella B. Adesso ha tutto ciò che serve.' });
      passi.push({ atto: 2, titolo: 'La somma', calc: p.a + ' + ' + p.b + ' = ' + s, hud: hud('processore', s), els: quadro({ att: 'p', op: p.a + ' + ' + p.b + ' = ' + s }),
        testo: 'Il processore esegue l’operazione. È l’unico momento in cui un dato nuovo viene creato: il numero ' + s + ' prima non esisteva in nessuna parte della macchina.',
        chiedi: { d: 'Dove va ora il risultato ' + s + '?', o: ['Direttamente allo schermo', 'In una casella della memoria', 'Torna alla tastiera'], g: 1, no: 'L’unica strada che parte dal processore porta alla memoria. Il risultato viene depositato lì, da dove l’uscita potrà prenderlo.' } });
      passi.push({ atto: 3, titolo: 'Il risultato torna in memoria', hud: hud('in viaggio', s), els: quadro({ via: 'mp', cella: 'R', pacco: [524, 136, String(s)] }),
        testo: 'Il processore consegna il risultato alla memoria, che lo sistema nella casella R.' });
      mem.R = s;
      passi.push({ atto: 3, titolo: 'La casella R contiene ' + s, hud: hud('memoria', s), els: quadro({ att: 'm', cella: 'R' }),
        testo: 'Tutte e tre le caselle sono occupate: i due numeri di partenza e il risultato.' });
      passi.push({ atto: 3, titolo: 'Il risultato viaggia verso lo schermo', hud: hud('in viaggio', s), els: quadro({ via: 'mu', cella: 'R', pacco: [620, 76, String(s)] }),
        testo: 'Una copia del contenuto della casella R parte verso il dispositivo di uscita.' });
      passi.push({ atto: 3, titolo: 'Lo schermo mostra ' + s, calc: p.a + ' + ' + p.b + ' = ' + s, hud: hud('uscita', s), els: quadro({ att: 'u', schermo: s }),
        testo: 'Il risultato è arrivato a destinazione. Ha attraversato la memoria due volte: i numeri vi sono entrati dalla tastiera, e il risultato vi è passato prima di raggiungere lo schermo.' });
      return { passi, esito: 'memoria' };
    }
  },
  bilancio: {
    regola: [
      'Ogni calcolatore ha quattro parti: i dispositivi di ingresso, la memoria, il processore e i dispositivi di uscita.',
      'I dati entrano dall’ingresso e sostano in memoria. Il processore li legge, li trasforma e deposita il risultato in memoria, da dove l’uscita lo preleva.'
    ],
    errori: [
      ['Pensare che il processore conservi i dati.', 'Il processore li lavora per il tempo di un’operazione, e la memoria li conserva.'],
      ['Far saltare la memoria.', 'Un numero digitato raggiunge lo schermo passando dalle caselle.'],
      ['Separare troppo ingresso e uscita.', 'Uno schermo tattile è entrambe le cose: riceve i tocchi e mostra le immagini.']
    ],
    saFare: ['Nomino le quattro parti di un calcolatore e il compito di ciascuna.', 'Descrivo il cammino di un dato dall’ingresso all’uscita.', 'Riconosco in un oggetto di tutti i giorni ingresso, memoria, processore e uscita.'],
    esercizi: [
      { d: 'In quale parte del calcolatore avviene la somma di due numeri?', guida: 'Scegli la parte.', o: [
        { t: 'Nella memoria', fb: 'La memoria conserva i due numeri e il risultato. L’operazione la esegue un’altra parte.' },
        { t: 'Nel processore', ok: true, fb: 'Il processore è l’unica parte che esegue operazioni sui dati.' },
        { t: 'Nello schermo', fb: 'Lo schermo è un dispositivo di uscita: mostra il risultato che riceve.' }] },
      { d: 'Hai appena digitato un numero e non hai premuto altro. Dove si trova in questo momento?', guida: 'Scegli la parte.', o: [
        { t: 'Nella tastiera', fb: 'La tastiera lo ha già consegnato: un dispositivo di ingresso non trattiene i dati.' },
        { t: 'Nella memoria', ok: true, fb: 'Il numero aspetta in una casella che il processore lo usi.' },
        { t: 'Nel processore', fb: 'Il processore lo leggerà solo quando avrà un’operazione da eseguire. Nel frattempo il numero aspetta in memoria.' }] }
    ]
  }
});
