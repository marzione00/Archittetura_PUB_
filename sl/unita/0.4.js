'use strict';
SL.registra('0.4', {
  titolo: 'Uso del laboratorio',
  obiettivo: 'Obiettivo: percorrere le cinque fasi di un’unità e impiegare tutti i comandi di un esperimento.',
  concetti: [['richiami', 'Richiami'], ['idea', 'Idea'], ['esperimento', 'Esperimento'], ['riproduci', 'Esecuzione'], ['bilancio', 'Bilancio']],
  filigrana: ['riproduci', 'esperimento', 'idea'],
  richiami: {
    guida: 'L’unità ha per argomento il sito stesso. I tre richiami che seguono mostrano la forma in cui, in ogni unità, sono riproposti gli argomenti già trattati.',
    carte: [
      { sim: 'cpu', da: 'Dall’unità 0.1', t: 'Le quattro parti', d: 'Ingresso, memoria, processore e uscita: ogni calcolatore è composto da queste quattro parti.' },
      { sim: 'operation', da: 'Dall’unità 0.2', t: 'Programma e dati', d: 'Un programma è una sequenza ordinata di istruzioni. Durante l’esecuzione resta invariato, mentre i dati cambiano.' },
      { sim: 'puntatore', da: 'Dall’unità 0.3', t: 'Posizione e peso', d: 'Il valore di una cifra è il prodotto fra la cifra e il peso della posizione occupata.' }
    ],
    domanda: { d: 'Ogni richiamo si conclude con una breve domanda, come la seguente. Quante fasi compaiono nella barra posta sotto il titolo?', o: [
      { t: '3', fb: 'Le caselle della barra posta sotto il titolo sono cinque.' },
      { t: '5', ok: true, fb: 'Richiami, esposizione, esperimento, esecuzione guidata e bilancio.' },
      { t: '7', fb: 'Le caselle della barra posta sotto il titolo sono cinque.' }
    ] }
  },
  idea: {
    titolo: 'Le cinque fasi di un’unità',
    termini: ['esperimento', 'previsione', 'passo'],
    testo: [
      'Ogni unità del sito è organizzata nello stesso modo, in cinque fasi disposte da sinistra a destra. La barra posta sotto il titolo le presenta tutte: la fase corrente è evidenziata in ambra, e ogni altra fase è raggiungibile con un clic. Tutte le fasi sono sempre accessibili, e il sito non conserva traccia del punto raggiunto. L’ordine indicato è quello consigliato a chi affronta l’argomento per la prima volta.',
      'La prima fase, i richiami, riunisce i prerequisiti necessari. La seconda, l’esposizione, tratta l’argomento nuovo; i termini tecnici vi compaiono evidenziati, e un clic ne mostra la definizione. La terza fase introduce l’[[esperimento]]: ne descrive lo svolgimento, elenca gli elementi presenti sulla scena e richiede una [[previsione]].',
      'La previsione precede l’osservazione dell’esito, e consiste nel dichiarare il risultato atteso. Una previsione corretta conferma la comprensione dell’argomento. Una previsione errata è ancora più utile, poiché individua il punto preciso in cui il ragionamento si discosta dal comportamento della macchina.',
      'La quarta fase è l’esecuzione guidata. La scena avanza di un [[passo]] alla volta, e ogni passo è accompagnato da una descrizione. È possibile procedere in avanti e all’indietro, avviare l’avanzamento automatico, oppure selezionare il modo guidato, nel quale alcuni passi richiedono una risposta. I dati di partenza sono modificabili, e l’esperimento può essere ripetuto su un caso diverso.',
      'La quinta fase, il bilancio, confronta la previsione con l’esito, enuncia la regola, elenca gli errori più frequenti e propone alcuni esercizi. La correzione riconosce gli errori tipici e risponde a ciascuno con un commento specifico. Sono disponibili fino a tre indizi, via via più dettagliati.'
    ]
  },
  esperimento: {
    faremo: [
      'I comandi sono presentati su un esperimento elementare. Tre lampade sono spente, e una sequenza di comandi le accende o le spegne, una alla volta.',
      'Ogni comando inverte lo stato di una lampada: una lampada spenta si accende, una lampada accesa si spegne. Si selezioni il numero di comandi da eseguire, si indichi la previsione nel riquadro a fianco e si passi alla fase 4.'
    ],
    vedrai: [
      ['idea', 'Le tre lampade', 'In alto. Una lampada accesa è azzurra, una spenta è grigia.'],
      ['richiami', 'La sequenza dei comandi', 'In basso. Il comando in esecuzione è evidenziato in ambra.'],
      ['riproduci', 'I pulsanti', '«Passo successivo» avanza di un passo, «Riproduzione» avvia l’avanzamento automatico, la barra consente di raggiungere un passo qualsiasi.']
    ]
  },
  lab: {
    titolo: 'Tre lampade e una sequenza di comandi',
    scena: { w: 860, h: 300 },
    atti: ['Preparazione', 'I comandi', 'Bilancio'],
    nota: 'Il numero dei passi dipende dal numero di comandi selezionato: un passo per ogni comando, oltre a quello iniziale e a quello finale.',
    controlli: [{ id: 'n', tipo: 'num', eti: 'Comandi da eseguire', min: 4, max: 8, salti: [1], valore: 5 }],
    previsione: {
      domanda: (p) => 'Vengono eseguiti i primi ' + p.n + ' comandi della sequenza 1, 2, 1, 3, 2, 2, 1, 3. Ogni numero indica la lampada da invertire. Quante lampade risultano accese al termine?',
      opzioni: () => [0, 1, 2, 3]
    },
    confronto: (pred, esito) => 'La previsione indicava ' + pred + (pred === 1 ? ' lampada accesa' : ' lampade accese') + '. Al termine sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Una lampada invertita un numero pari di volte ritorna spenta: occorre contare le occorrenze di ciascun numero nella sequenza.'),
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
      passi.push({ atto: 0, titolo: 'Stato iniziale', hud: hud(null), els: quadro(-1),
        testo: 'Le tre lampade sono spente, e nessun comando è stato eseguito. «Passo successivo» esegue il primo comando; «Riproduzione» avvia l’avanzamento automatico.' });
      SEQ.forEach((c, k) => {
        const prima = on[c - 1];
        const chiedi = { d: 'Il prossimo comando inverte la lampada ' + c + ', che ora è ' + (prima ? 'accesa' : 'spenta') + '. In quale stato si troverà dopo il comando?', o: ['accesa', 'spenta'], g: prima ? 1 : 0, no: 'Il comando inverte lo stato: una lampada ' + (prima ? 'accesa si spegne.' : 'spenta si accende.') };
        if (passi.length) passi[passi.length - 1].chiedi = chiedi;
        on[c - 1] = !prima;
        passi.push({ atto: 1, titolo: 'Comando ' + (k + 1) + ': inversione della lampada ' + c, calc: 'lampada ' + c + ': ' + (prima ? 'accesa → spenta' : 'spenta → accesa'), hud: hud(k), els: quadro(k),
          testo: 'La lampada ' + c + ' era ' + (prima ? 'accesa e si spegne' : 'spenta e si accende') + '. Le lampade accese sono ora ' + accese() + '.' + (k === 1 ? ' «Passo precedente» consente di tornare indietro in qualsiasi momento.' : k === 2 ? ' La barra posta sotto la scena consente di raggiungere direttamente un altro passo.' : '') });
      });
      passi.push({ atto: 2, titolo: 'Sequenza terminata', calc: 'lampade accese = ' + accese(), hud: hud(null), els: quadro(SEQ.length),
        testo: 'Tutti i comandi sono stati eseguiti. Sotto la scena compare il confronto fra la previsione e l’esito. Modificando il numero di comandi, in alto, l’esperimento si ripete su un caso diverso.' });
      return { passi, esito: accese() };
    }
  },
  bilancio: {
    regola: [
      'Ogni unità comprende cinque fasi: richiami, esposizione, esperimento, esecuzione guidata e bilancio. L’ordine di consultazione è libero.',
      'Negli esperimenti la previsione precede l’esecuzione. Il confronto fra il risultato atteso e quello osservato è il momento di maggiore efficacia didattica.'
    ],
    errori: [
      ['Formulare la previsione a caso.', 'Una previsione ragionata, anche se errata, indica il punto in cui il ragionamento va corretto.'],
      ['Osservare la scena senza leggere la descrizione.', 'Ogni passo motiva il cambiamento avvenuto sulla scena.'],
      ['Limitarsi al caso proposto.', 'La modifica dei dati mostra se la regola è stata compresa, oppure soltanto memorizzata.']
    ],
    saFare: ['Passare da una fase all’altra mediante la barra posta sotto il titolo.', 'Formulare una previsione e confrontarla con l’esito.', 'Impiegare i modi «Osserva» e «Guidato», e modificare i dati di un esperimento.'],
    esercizi: [
      { d: 'Esercizio dimostrativo sul funzionamento della correzione: quanto vale 6 + 7? Prima della risposta corretta è utile inserire 67 oppure 42, e leggere i commenti.', segnaposto: 'Un numero', giuste: ['13'],
        ok: 'La somma è 13. Negli esercizi delle altre unità il commento motiva anche la correttezza della risposta.',
        diagnosi: [
          { se: ['67'], msg: 'Le due cifre sono state accostate. La correzione ha riconosciuto questo errore specifico: lo stesso meccanismo opera in tutti gli esercizi.' },
          { se: ['42'], msg: 'I due numeri sono stati moltiplicati. Anche questo errore è fra quelli riconosciuti.' },
          { se: ['1'], msg: 'È stata eseguita una sottrazione. La domanda richiede una somma.' }
        ],
        altro: 'La risposta è diversa. Per gli errori estranei all’elenco di quelli tipici la correzione fornisce comunque un’indicazione: qui occorre sommare 6 e 7.',
        indizi: ['Il primo indizio è generico: si tratta di una somma.', 'Il secondo indizio è più preciso: 6 + 7 è uguale a 6 + 4 + 3.', 'Il terzo indizio conduce in prossimità della risposta: 10 + 3.'],
        svolgimento: ['6 + 7 = 13.', 'Negli esercizi delle altre unità lo svolgimento diventa disponibile dopo due tentativi, e riporta tutti i passaggi.'] },
      { d: 'Secondo esercizio dimostrativo, a scelta. Una lampada spenta riceve tre volte di seguito il comando che ne inverte lo stato. In quale stato si trova al termine?', guida: 'Si scelga la risposta. Ogni opzione dispone di un proprio commento.', o: [
        { t: 'Accesa', ok: true, fb: 'Dopo la prima inversione è accesa, dopo la seconda è spenta, dopo la terza è di nuovo accesa.' },
        { t: 'Spenta', fb: 'Sarebbe spenta dopo due inversioni. La terza la riaccende.' },
        { t: 'Dipende dalle altre lampade', fb: 'Ogni comando agisce su una sola lampada, senza effetti sulle altre.' }] }
    ]
  }
});
