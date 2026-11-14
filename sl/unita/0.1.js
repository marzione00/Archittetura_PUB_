'use strict';
SL.registra('0.1', {
  titolo: 'Struttura di un calcolatore',
  obiettivo: 'Obiettivo: indicare le quattro parti che compongono ogni calcolatore e descrivere il tragitto di un dato dall’ingresso all’uscita.',
  concetti: [['dispositivo', 'Ingresso'], ['memory', 'Memoria'], ['cpu', 'Processore'], ['terminale', 'Uscita']],
  filigrana: ['cpu', 'memory', 'dispositivo'],
  richiami: {
    guida: 'L’unità apre il corso e non richiede conoscenze preliminari.',
    carte: [],
    domanda: { d: 'Domanda preliminare: quale dei seguenti oggetti contiene un calcolatore?', o: [
      { t: 'Un telefono', fb: 'L’affermazione è corretta, e vale anche per la lavatrice moderna: la risposta completa è «entrambi».' },
      { t: 'Una lavatrice moderna', fb: 'L’affermazione è corretta, e vale anche per il telefono: la risposta completa è «entrambi».' },
      { t: 'Entrambi', ok: true, fb: 'Entrambi contengono una macchina che riceve dati, li elabora e restituisce un risultato.' }
    ] }
  },
  idea: {
    titolo: 'Le quattro parti e i rispettivi compiti',
    termini: ['calcolatore', 'dispositivo', 'memoria', 'processore', 'dato'],
    testo: [
      'Un telefono, un elaboratore portatile, la strumentazione di un’automobile e un registratore di cassa svolgono compiti molto diversi. All’interno di ciascuno opera tuttavia la medesima macchina, il [[calcolatore]], il cui compito si riassume in tre azioni: ricevere dati, elaborarli, restituire un risultato.',
      'Ogni calcolatore è composto da quattro parti. I [[dispositivo|dispositivi di ingresso]] acquisiscono i dati dall’esterno: una tastiera, uno schermo tattile, un microfono, un sensore. La [[memoria]] è un insieme ordinato di caselle, nelle quali i dati sono conservati in attesa di essere utilizzati. Il [[processore]] è la sola parte che esegue operazioni sui dati, quali il confronto, la somma e il trasferimento. I [[dispositivo|dispositivi di uscita]] rendono disponibile il risultato all’esterno: uno schermo, un altoparlante, una stampante.',
      'Le quattro parti hanno compiti distinti, e nessuna può sostituirne un’altra. I dispositivi di ingresso e di uscita mettono il calcolatore in comunicazione con l’esterno. La memoria conserva i dati senza modificarli, mentre il processore li modifica senza conservarli.',
      { fig: 'scena', w: 700, h: 230, titolo: 'Le quattro parti e i collegamenti fra di esse', nota: 'Ingresso e uscita sono privi di un collegamento diretto. Ogni dato transita dalla memoria.', els: [
        SL.el.linea('l1', 170, 60, 270, 60, 'on'), SL.el.linea('l2', 430, 60, 530, 60, 'on'), SL.el.linea('l3', 350, 100, 350, 140, 'att'),
        SL.el.box('i', 20, 20, 150, 80, 'ingresso', 'tastiera', '', { sim: 'dispositivo' }),
        SL.el.box('m', 270, 20, 160, 80, 'memoria', 'caselle', '', { sim: 'memory' }),
        SL.el.box('u', 530, 20, 150, 80, 'uscita', 'schermo', '', { sim: 'terminale' }),
        SL.el.box('p', 270, 140, 160, 80, 'processore', 'operazioni', '', { sim: 'cpu' })] },
      'Ciò che transita fra le quattro parti prende il nome di [[dato]]: un numero, una lettera, un punto di un’immagine. Nel tragitto dall’ingresso all’uscita ogni dato transita dalla memoria, poiché il processore opera esclusivamente sui dati che vi sono conservati, e in memoria deposita il risultato prima che questo venga presentato in uscita.',
      'Si consideri una calcolatrice sulla quale viene premuto il tasto 2. Il tasto trasmette il numero alla memoria, il processore lo legge e ne dispone la visualizzazione, e lo schermo lo riceve. L’intera sequenza si compie in un tempo troppo breve per essere percepita. L’esperimento la riproduce a velocità ridotta, seguendo una somma un passaggio alla volta.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento impiega una calcolatrice ridotta alle operazioni essenziali per sommare due numeri di una cifra. Ogni dato è seguito dal momento in cui viene digitato fino alla comparsa del risultato sullo schermo.',
      'A ogni passo si sposta un solo dato, da una parte a quella adiacente. Le caselle della memoria meritano particolare attenzione, poiché costituiscono il punto di passaggio comune a tutti i collegamenti.'
    ],
    vedrai: [
      ['dispositivo', 'L’ingresso', 'A sinistra, la tastiera dalla quale entrano i due numeri e il comando di somma.'],
      ['memory', 'La memoria', 'In alto al centro, tre caselle: una per ciascun numero e una per il risultato.'],
      ['cpu', 'Il processore', 'In basso al centro. È la sola parte che esegue la somma.'],
      ['terminale', 'L’uscita', 'A destra, lo schermo sul quale compare il risultato.']
    ]
  },
  lab: {
    titolo: 'Esecuzione rallentata di una somma',
    scena: { w: 860, h: 300 },
    atti: ['Preparazione', 'Ingresso dei dati', 'Elaborazione', 'Uscita del risultato'],
    nota: 'La sequenza dei passi è la stessa per ogni coppia di numeri: il tragitto dei dati è indipendente dal loro valore.',
    controlli: [
      { id: 'a', tipo: 'num', eti: 'Primo numero', min: 0, max: 9, salti: [1], valore: 2 },
      { id: 'b', tipo: 'num', eti: 'Secondo numero', min: 0, max: 9, salti: [1], valore: 3 }
    ],
    previsione: {
      domanda: (p) => 'Vengono sommati ' + p.a + ' e ' + p.b + '. Da quale parte transita il risultato immediatamente prima di raggiungere lo schermo?',
      opzioni: () => [['ingresso', 'Dalla tastiera'], ['memoria', 'Dalla memoria'], ['processore', 'Dal processore']]
    },
    confronto: (pred, esito) => { const n = { ingresso: 'dalla tastiera', memoria: 'dalla memoria', processore: 'dal processore' }; return 'La previsione indicava che il risultato raggiungesse lo schermo ' + n[pred] + '. Nell’esperimento lo ha raggiunto ' + n[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il processore deposita il risultato in una casella, e lo schermo lo riceve da questa.'); },
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
      const hud = (dove, dato) => [['Dato in transito', dato == null ? '·' : dato, 'a'], ['Sede', dove || '·'], ['Caselle occupate', Object.keys(mem).filter((k) => mem[k] !== null).length, 'c']];
      passi.push({ atto: 0, titolo: 'La calcolatrice è accesa', hud: hud(), els: quadro(),
        testo: 'Le quattro parti sono pronte. La memoria dispone di tre caselle vuote, il processore è in attesa e lo schermo è vuoto.' });
      [['A', p.a], ['B', p.b]].forEach(([k, v], j) => {
        passi.push({ atto: 1, titolo: 'Viene premuto il tasto ' + v, hud: hud('ingresso', v), els: quadro({ att: 'i', tasto: v, pacco: [150, 76, String(v)] }),
          testo: 'Il ' + (j ? 'secondo' : 'primo') + ' numero entra dalla tastiera. In questa fase il dato si trova nel dispositivo di ingresso.',
          chiedi: j === 0 ? { d: 'Qual è la destinazione del numero ' + v + '?', o: ['Direttamente lo schermo', 'Una casella della memoria', 'Il processore'], g: 1, no: 'Dall’ingresso parte un solo collegamento, diretto alla memoria. Lo schermo e il processore ricevono i dati da questa.' } : null });
        passi.push({ atto: 1, titolo: 'Trasferimento del numero alla memoria', hud: hud('in transito', v), els: quadro({ via: 'im', cella: k, pacco: [270 + j * 112 + 30, 4, String(v)] }),
          testo: 'La tastiera trasmette il numero alla memoria, che gli assegna la casella ' + k + '.' });
        mem[k] = v;
        passi.push({ atto: 1, titolo: 'La casella ' + k + ' contiene ' + v, hud: hud('memoria', v), els: quadro({ att: 'm', cella: k }),
          testo: 'Il numero ' + v + ' è ora conservato nella casella ' + k + ', e vi rimane fino a una successiva sostituzione.' });
      });
      passi.push({ atto: 2, titolo: 'Viene premuto il tasto +', hud: hud('ingresso', '+'), els: quadro({ att: 'i', tasto: '+' }),
        testo: 'Il tasto di somma trasmette un comando, mentre i due tasti precedenti trasmettevano numeri. Il comando segnala al processore che l’operazione può cominciare.',
        chiedi: { d: 'Da dove preleva il processore i due numeri da sommare?', o: ['Dalla tastiera', 'Dalle caselle A e B della memoria', 'Dallo schermo'], g: 1, no: 'La tastiera ha già trasmesso i numeri alla memoria. Il processore opera sui dati conservati nelle caselle.' } });
      passi.push({ atto: 2, titolo: 'Il processore legge la casella A', hud: hud('in transito', p.a), els: quadro({ via: 'mp', att: 'p', cella: 'A', op: 'lettura di A', pacco: [390, 136, String(p.a)] }),
        testo: 'Il processore richiede alla memoria il contenuto della casella A e riceve una copia del numero ' + p.a + '. La casella conserva il proprio contenuto.' });
      passi.push({ atto: 2, titolo: 'Il processore legge la casella B', hud: hud('in transito', p.b), els: quadro({ via: 'mp', att: 'p', cella: 'B', op: 'lettura di B', pacco: [440, 136, String(p.b)] }),
        testo: 'Analogamente, il processore riceve dalla casella B una copia del numero ' + p.b + '. Entrambi gli addendi sono ora disponibili.' });
      passi.push({ atto: 2, titolo: 'La somma', calc: p.a + ' + ' + p.b + ' = ' + s, hud: hud('processore', s), els: quadro({ att: 'p', op: p.a + ' + ' + p.b + ' = ' + s }),
        testo: 'Il processore esegue l’operazione. È il solo passo in cui viene prodotto un dato nuovo: fino a questo momento il numero ' + s + ' era assente da ogni parte della macchina.',
        chiedi: { d: 'Qual è la destinazione del risultato ' + s + '?', o: ['Direttamente lo schermo', 'Una casella della memoria', 'La tastiera'], g: 1, no: 'Dal processore parte un solo collegamento, diretto alla memoria. Il risultato viene depositato in una casella, dalla quale l’uscita lo preleva.' } });
      passi.push({ atto: 3, titolo: 'Deposito del risultato in memoria', hud: hud('in transito', s), els: quadro({ via: 'mp', cella: 'R', pacco: [524, 136, String(s)] }),
        testo: 'Il processore trasmette il risultato alla memoria, che lo colloca nella casella R.' });
      mem.R = s;
      passi.push({ atto: 3, titolo: 'La casella R contiene ' + s, hud: hud('memoria', s), els: quadro({ att: 'm', cella: 'R' }),
        testo: 'Le tre caselle sono occupate dai due addendi e dal risultato.' });
      passi.push({ atto: 3, titolo: 'Trasferimento del risultato allo schermo', hud: hud('in transito', s), els: quadro({ via: 'mu', cella: 'R', pacco: [620, 76, String(s)] }),
        testo: 'Una copia del contenuto della casella R viene trasmessa al dispositivo di uscita.' });
      passi.push({ atto: 3, titolo: 'Lo schermo mostra ' + s, calc: p.a + ' + ' + p.b + ' = ' + s, hud: hud('uscita', s), els: quadro({ att: 'u', schermo: s }),
        testo: 'Il risultato ha raggiunto la destinazione. La memoria è stata attraversata due volte: dai numeri provenienti dalla tastiera, e dal risultato diretto allo schermo.' });
      return { passi, esito: 'memoria' };
    }
  },
  bilancio: {
    regola: [
      'Ogni calcolatore è composto da quattro parti: i dispositivi di ingresso, la memoria, il processore e i dispositivi di uscita.',
      'I dati entrano dai dispositivi di ingresso e sono conservati in memoria. Il processore li legge, li elabora e deposita il risultato in memoria, da dove i dispositivi di uscita lo prelevano.'
    ],
    errori: [
      ['Attribuire al processore la conservazione dei dati.', 'Il processore trattiene un dato per la durata di una sola operazione. La conservazione spetta alla memoria.'],
      ['Trascurare il passaggio dalla memoria.', 'Un numero digitato raggiunge lo schermo soltanto dopo essere transitato dalle caselle.'],
      ['Considerare ingresso e uscita come dispositivi sempre distinti.', 'Uno schermo tattile svolge entrambi i compiti: acquisisce i tocchi e presenta le immagini.']
    ],
    saFare: ['Indicare le quattro parti di un calcolatore e il compito di ciascuna.', 'Descrivere il tragitto di un dato dall’ingresso all’uscita.', 'Individuare in un oggetto di uso comune ingresso, memoria, processore e uscita.'],
    esercizi: [
      { d: 'In quale parte del calcolatore viene eseguita la somma di due numeri?', guida: 'Si scelga la parte.', o: [
        { t: 'Nella memoria', fb: 'La memoria conserva i due numeri e il risultato. L’operazione è eseguita da un’altra parte.' },
        { t: 'Nel processore', ok: true, fb: 'Il processore è la sola parte che esegue operazioni sui dati.' },
        { t: 'Nello schermo', fb: 'Lo schermo è un dispositivo di uscita: presenta il risultato che riceve.' }] },
      { d: 'Un numero è stato appena digitato, e nessun altro tasto è stato premuto. In quale parte si trova?', guida: 'Si scelga la parte.', o: [
        { t: 'Nella tastiera', fb: 'La tastiera lo ha già trasmesso: un dispositivo di ingresso è privo della capacità di trattenere i dati.' },
        { t: 'Nella memoria', ok: true, fb: 'Il numero resta in una casella, in attesa di essere utilizzato dal processore.' },
        { t: 'Nel processore', fb: 'Il processore lo leggerà soltanto quando dovrà eseguire un’operazione. Fino ad allora il numero resta in memoria.' }] }
    ]
  }
});
