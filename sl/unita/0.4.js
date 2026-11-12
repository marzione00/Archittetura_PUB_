'use strict';
SL.registra('0.4', {
  titolo: 'Come si usa il laboratorio',
  obiettivo: 'Alla fine saprai muoverti fra le cinque fasi di un’unità e usare tutti i comandi di un esperimento.',
  concetti: [['richiami', 'Richiami'], ['idea', 'Idea'], ['esperimento', 'Esperimento'], ['riproduci', 'Esecuzione'], ['bilancio', 'Bilancio']],
  filigrana: ['riproduci', 'esperimento', 'idea'],
  richiami: {
    guida: 'Questa unità è diversa dalle altre, perché il suo argomento è il sito stesso. I tre richiami qui sotto mostrano come si presenta, in ogni unità, ciò che è già stato studiato.',
    carte: [
      { sim: 'cpu', da: 'Dall’unità 0.1', t: 'Le quattro parti', d: 'Ingresso, memoria, processore e uscita: ogni calcolatore è fatto così.' },
      { sim: 'operation', da: 'Dall’unità 0.2', t: 'Programma e dati', d: 'Un programma è un elenco ordinato di istruzioni. Durante l’esecuzione resta fermo, mentre i dati cambiano.' },
      { sim: 'puntatore', da: 'Dall’unità 0.3', t: 'Posizione e peso', d: 'Una cifra vale la cifra stessa moltiplicata per il peso della posizione che occupa.' }
    ],
    domanda: { d: 'Ogni richiamo si chiude con una domanda rapida come questa. Quante fasi vedi nella striscia qui sopra?', o: [
      { t: '3', fb: 'Conta le caselle della striscia sotto il titolo: sono cinque.' },
      { t: '5', ok: true, fb: 'Richiami, idea, esperimento, esecuzione guidata e bilancio.' },
      { t: '7', fb: 'Conta le caselle della striscia sotto il titolo: sono cinque.' }
    ] }
  },
  idea: {
    titolo: 'Cinque fasi, sempre le stesse',
    termini: ['esperimento', 'previsione', 'passo'],
    testo: [
      'Ogni unità del sito è costruita allo stesso modo, in cinque fasi che si percorrono da sinistra a destra. La striscia in alto le mostra sempre tutte. Quella in cui ti trovi è accesa in ambra, e puoi passare a un’altra con un clic. Tutte le fasi restano sempre aperte, e del punto in cui sei arrivato il sito non conserva traccia. L’ordine è un consiglio per chi incontra l’argomento per la prima volta.',
      'La prima fase, i richiami, raccoglie le poche idee già viste che serviranno. La seconda, l’idea, racconta il concetto nuovo con parole di tutti i giorni; i termini tecnici compaiono evidenziati e un clic ne apre la definizione. La terza fase prepara l’[[esperimento]]: spiega che cosa si farà, descrive che cosa comparirà sulla scena e ti chiede una [[previsione]].',
      'La previsione è la parte più importante. Prima di vedere che cosa accade, dichiari che cosa ti aspetti. Se si rivela giusta, hai la conferma che l’idea è chiara. Se si rivela sbagliata hai guadagnato ancora di più, perché hai scoperto il punto esatto in cui il tuo ragionamento e la macchina si separano.',
      'La quarta fase è l’esecuzione guidata. La scena avanza di un [[passo]] alla volta, e ogni passo è raccontato a parole. Puoi andare avanti e indietro, lasciare che la scena proceda da sola, oppure scegliere il modo guidato, in cui a ogni bivio sei tu a decidere la mossa. Puoi anche cambiare i dati di partenza e ripetere l’esperimento su un caso tuo.',
      'La quinta fase, il bilancio, confronta la previsione con l’esito, enuncia la regola a parole, elenca gli errori più frequenti e propone qualche esercizio. Il correttore riconosce gli sbagli tipici e risponde con un messaggio diverso per ciascuno. Se resti bloccato puoi chiedere fino a tre indizi, dal più vago al più esplicito.'
    ]
  },
  esperimento: {
    faremo: [
      'Proveremo i comandi su un esperimento volutamente semplice. Tre lampade sono spente, e un elenco di comandi le accende o le spegne, uno per volta.',
      'Ogni comando inverte lo stato di una lampada: se era spenta la accende, se era accesa la spegne. Scegli quanti comandi eseguire, registra la previsione qui a fianco e passa alla fase 4.'
    ],
    vedrai: [
      ['idea', 'Le tre lampade', 'In alto. Una lampada accesa è azzurra, una spenta è grigia.'],
      ['richiami', 'L’elenco dei comandi', 'In basso. Il comando in esecuzione è acceso in ambra.'],
      ['riproduci', 'I pulsanti', '«Passo successivo» avanza di una mossa, «Riproduci» procede da solo, la barra permette di saltare a un passo qualsiasi.']
    ]
  },
  lab: {
    titolo: 'Tre lampade e un elenco di comandi',
    scena: { w: 860, h: 300 },
    atti: ['Preparazione', 'I comandi', 'Bilancio'],
    nota: 'Il numero di passi dipende dal numero di comandi scelto: un passo per ogni comando, più l’inizio e la fine.',
    controlli: [{ id: 'n', tipo: 'num', eti: 'Comandi da eseguire', min: 4, max: 8, salti: [1], valore: 5 }],
    previsione: {
      domanda: (p) => 'Verranno eseguiti i primi ' + p.n + ' comandi dell’elenco: 1, 2, 1, 3, 2, 2, 1, 3. Ogni numero indica la lampada da invertire. Quante lampade resteranno accese?',
      opzioni: () => [0, 1, 2, 3]
    },
    confronto: (pred, esito) => 'Avevi previsto ' + pred + (pred === 1 ? ' lampada accesa' : ' lampade accese') + '. Alla fine sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Una lampada invertita un numero pari di volte torna spenta: conta quante volte compare ciascun numero nell’elenco.'),
    costruisci(p) {
      const el = SL.el, SEQ = [1, 2, 1, 3, 2, 2, 1, 3].slice(0, p.n), passi = [];
      const on = [false, false, false];
      const quadro = (k) => {
        const els = [];
        on.forEach((a, j) => els.push(el.box('L' + j, 150 + j * 200, 14, 160, 110, 'lampada ' + (j + 1), a ? 'accesa' : 'spenta', k >= 0 && SEQ[k] === j + 1 ? (a ? 'on' : 'att') : a ? 'on' : 'off', { sim: 'idea', simL: 50 })));
        els.push(el.nota('tc', 38, 150, 'ELENCO DEI COMANDI', 'mono'));
        SEQ.forEach((c, j) => els.push(el.box('c' + j, 38 + j * 98, 180, 94, 64, 'comando ' + (j + 1), 'inverti ' + c, j === k ? 'att' : j < k ? 'on' : '', { cls: 'stretta' })));
        return els;
      };
      const accese = () => on.filter(Boolean).length;
      const hud = (k) => [['Comando', k == null ? '·' : (k + 1) + ' di ' + SEQ.length, 'a'], ['Lampade accese', accese(), 'c']];
      passi.push({ atto: 0, titolo: 'Tutto spento', hud: hud(null), els: quadro(-1),
        testo: 'Le tre lampade sono spente e nessun comando è stato eseguito. Premi «Passo successivo» per eseguire il primo, oppure «Riproduci» per lasciar scorrere la scena.' });
      SEQ.forEach((c, k) => {
        const prima = on[c - 1];
        const chiedi = { d: 'Il prossimo comando inverte la lampada ' + c + ', che ora è ' + (prima ? 'accesa' : 'spenta') + '. Dopo il comando sarà…', o: ['accesa', 'spenta'], g: prima ? 1 : 0, no: 'Il comando inverte lo stato: una lampada ' + (prima ? 'accesa si spegne.' : 'spenta si accende.') };
        if (passi.length) passi[passi.length - 1].chiedi = chiedi;
        on[c - 1] = !prima;
        passi.push({ atto: 1, titolo: 'Comando ' + (k + 1) + ': inverti la lampada ' + c, calc: 'lampada ' + c + ': ' + (prima ? 'accesa → spenta' : 'spenta → accesa'), hud: hud(k), els: quadro(k),
          testo: 'La lampada ' + c + ' era ' + (prima ? 'accesa e si spegne' : 'spenta e si accende') + '. Le lampade accese sono ora ' + accese() + '.' + (k === 1 ? ' Con «Passo precedente» puoi tornare indietro in qualsiasi momento.' : k === 2 ? ' Prova a trascinare la barra sotto la scena per saltare a un altro passo.' : '') });
      });
      passi.push({ atto: 2, titolo: 'Elenco terminato', calc: 'lampade accese = ' + accese(), hud: hud(null), els: quadro(SEQ.length),
        testo: 'Tutti i comandi sono stati eseguiti. Sotto la scena compare il confronto fra la tua previsione e l’esito. Cambia il numero di comandi, in alto, per ripetere l’esperimento su un caso diverso.' });
      return { passi, esito: accese() };
    }
  },
  bilancio: {
    regola: [
      'Ogni unità ha cinque fasi: richiami, idea, esperimento, esecuzione guidata e bilancio. Si possono aprire in qualsiasi ordine.',
      'Negli esperimenti la previsione viene prima dell’esecuzione. Il confronto fra ciò che ti aspettavi e ciò che accade è il momento in cui si impara di più.'
    ],
    errori: [
      ['Scegliere la previsione a caso.', 'Una previsione ragionata, anche sbagliata, dice dove il ragionamento va corretto.'],
      ['Guardare la scena senza leggere il racconto.', 'Ogni passo spiega a parole perché la scena è cambiata.'],
      ['Fermarsi al caso proposto.', 'Cambiando i dati si scopre se la regola è stata capita o soltanto ricordata.']
    ],
    saFare: ['Passo da una fase all’altra con la striscia in alto.', 'Faccio una previsione e la confronto con l’esito.', 'Uso i modi «Osserva» e «Guidato» e cambio i dati di un esperimento.'],
    esercizi: [
      { d: 'Esercizio di prova per conoscere il correttore: quanto fa 6 + 7? Prima di dare la risposta giusta, prova a scrivere 67 oppure 42 e leggi i messaggi.', segnaposto: 'Un numero', giuste: ['13'],
        ok: 'La somma è 13. Negli esercizi veri il messaggio verde spiega anche perché la risposta è giusta.',
        diagnosi: [
          { se: ['67'], msg: 'Hai accostato le due cifre. Il correttore ha riconosciuto questo errore preciso: è così che funziona in tutti gli esercizi.' },
          { se: ['42'], msg: 'Hai moltiplicato i due numeri. Anche questo è un errore che il correttore sa riconoscere.' },
          { se: ['1'], msg: 'Hai sottratto. La domanda chiede una somma.' }
        ],
        altro: 'La risposta è diversa. Per gli errori che sfuggono all’elenco di quelli tipici, il correttore indica comunque la strada: qui basta sommare 6 e 7.',
        indizi: ['Gli indizi partono vaghi: si tratta di una somma.', 'Il secondo indizio è più preciso: 6 + 7 è uguale a 6 + 4 + 3.', 'Il terzo indizio porta quasi alla risposta: 10 + 3.'],
        svolgimento: ['6 + 7 = 13.', 'Negli esercizi veri lo svolgimento compare dopo due tentativi e mostra tutti i passaggi.'] },
      { d: 'Secondo esercizio di prova, questa volta a scelta. Una lampada spenta riceve tre volte di seguito il comando che ne inverte lo stato. Come si trova alla fine?', guida: 'Scegli la risposta. Ogni opzione ha un messaggio suo.', o: [
        { t: 'Accesa', ok: true, fb: 'Dopo la prima inversione è accesa, dopo la seconda è spenta, dopo la terza è di nuovo accesa.' },
        { t: 'Spenta', fb: 'Spenta tornerebbe dopo due inversioni. La terza la riaccende.' },
        { t: 'Dipende dalle altre lampade', fb: 'Ogni comando agisce su una lampada sola, senza toccare le altre.' }] }
    ]
  }
});
