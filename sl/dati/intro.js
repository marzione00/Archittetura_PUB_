'use strict';
/* Testi dell'introduzione al sito. Ogni scheda indica la pagina nella quale compare (rotta: '#/' per la pagina principale,
   oppure l'indirizzo di una fase di un'unità), l'elemento illuminato (bersaglio: un selettore o un elenco di selettori)
   e due paragrafi. Un selettore che individua più elementi li illumina tutti, in un unico riquadro. I segnaposto fra graffe sono calcolati dalla mappa del corso al momento della visualizzazione.
   interattiva: l'elemento illuminato resta attivo, e la scheda successiva è raggiungibile dopo una selezione.
   bivio: etichette dei due comandi che proseguono o chiudono l'introduzione.
   angolo: lato della finestra al quale la scheda si accosta quando l'elemento illuminato non lascia spazio libero. */
SL.introduzione = [
  {
    eti: 'Presentazione', titolo: 'Il laboratorio del corso di architettura dei sistemi', rotta: null, bersaglio: null,
    testo: [
      'SistemiLab accompagna il corso di architettura dei sistemi e la dispensa «Architecture of Computer Systems». Il materiale comprende {MODULI} moduli, {CAPITOLI} capitoli e {UNITA} unità, {PROVE} prove di fine capitolo e un glossario di {TERMINI} termini.',
      'Le {SCHEDE} schede di questa introduzione presentano l’organizzazione del sito, il percorso di studio consigliato e l’impiego del laboratorio; ciascuna illumina l’elemento della pagina al quale si riferisce. Il comando «Salta intro» la chiude immediatamente, mentre nelle schede successive la chiusura è affidata al pulsante posto nell’angolo superiore e al tasto Esc. L’introduzione resta disponibile dal riquadro «Percorso di studio» e dalla pagina «Guida».'
    ]
  },
  {
    eti: 'Metodo', titolo: 'Un argomento, un esperimento', rotta: null, bersaglio: null,
    testo: [
      'Ogni argomento del corso è trattato in un’unità dedicata, costruita attorno a un esperimento eseguibile un passo alla volta. Prima dell’esecuzione è richiesta una previsione sull’esito, e al termine la previsione è confrontata con il risultato.',
      'Una previsione corretta conferma la comprensione dell’argomento. Una previsione errata individua il punto in cui il ragionamento si discosta dal comportamento della macchina, e la sua origine è discussa nel bilancio dell’unità. Il metodo è il medesimo in tutte le {UNITA} unità del corso.'
    ]
  },
  {
    eti: 'Percorso di studio', titolo: 'Il percorso di studio', rotta: '#/', bersaglio: '[aria-label="Percorso di studio"]',
    testo: [
      'Il riquadro illuminato riassume in tre passi l’ordine di studio consigliato. Il primo passo è il Modulo 0, che non richiede conoscenze preliminari. Il secondo comprende i moduli tematici da {MPRIMO} a {MULTIMO}, da affrontare nell’ordine della rete, poiché ciascuno richiama nozioni dei precedenti.',
      'Il terzo passo descrive l’ordine interno di ogni capitolo: le unità nell’ordine indicato, quindi la prova del capitolo e infine le sfide in terminale. Sotto i tre passi, i comandi del riquadro aprono l’unità iniziale, l’unità dedicata al laboratorio, la guida e questa introduzione.'
    ]
  },
  {
    eti: 'Punto di partenza', titolo: 'L’inizio dal Modulo 0', rotta: '#/', bersaglio: '[aria-label="Percorso di studio"] a.bottone.primo',
    testo: [
      'Il comando illuminato apre l’unità 0.1, prima delle {N0} unità del Modulo 0. Le unità del modulo trattano la struttura di un calcolatore, la distinzione fra programmi e dati e il valore posizionale delle cifre, nozioni richiamate nei moduli successivi.',
      'L’unità 0.4 è dedicata al laboratorio, del quale presenta le cinque fasi e i comandi su un caso elementare. A chi affronta la materia per la prima volta è consigliabile percorrere il modulo per intero; chi possiede già tali nozioni può procedere dal Modulo {MPRIMO}.'
    ]
  },
  {
    eti: 'Moduli', titolo: 'I moduli del corso', rotta: '#/', bersaglio: '.linguette',
    testo: [
      'Le linguette elencano i {MODULI} moduli del corso, nell’ordine consigliato. La selezione di una linguetta mostra, sotto la rete, la scheda del modulo e l’elenco dei suoi capitoli; l’indirizzo della pagina cambia di conseguenza, e può essere conservato fra i segnalibri o condiviso.',
      'Ogni modulo resta accessibile in qualunque momento, e l’ordine ha valore di consiglio. Sugli schermi stretti la rete è rappresentata in scala ridotta, e le linguette ne costituiscono l’alternativa più leggibile.'
    ]
  },
  {
    eti: 'Rete', titolo: 'La rete del corso', rotta: '#/', bersaglio: '.rete-cornice', angolo: 'sinistra',
    testo: [
      'La rete dispone i moduli sulla fila di fondo, da sinistra a destra nell’ordine consigliato. Dal modulo selezionato una linea azzurra scende alla fila avanzata, che riporta i capitoli del modulo; per il Modulo 0 la fila avanzata riporta le sue {N0} unità.',
      'La selezione di un capitolo ne mostra la guida nel pannello posto nell’angolo inferiore della rete, insieme al comando che apre la pagina del capitolo. La legenda nell’angolo opposto riassume le convenzioni grafiche. Rete e linguette offrono il medesimo contenuto in due forme.'
    ]
  },
  {
    eti: 'Scheda del modulo', titolo: 'La scheda del modulo', rotta: '#/', bersaglio: '[data-r="modulo"]',
    testo: [
      'La scheda presenta il modulo selezionato in tre parti. L’argomento ne riassume i contenuti, capitolo per capitolo. I prerequisiti indicano i capitoli di altri moduli richiamati dalle unità, e ciascun numero conduce al capitolo corrispondente; il Modulo 0 è privo di prerequisiti.',
      'La terza parte elenca le competenze attese al termine del modulo. Il comando in fondo alla scheda apre il primo capitolo, oppure, per il Modulo 0, la prima unità.'
    ]
  },
  {
    eti: 'Capitoli', titolo: 'Dall’elenco alla pagina del capitolo', rotta: '#/', bersaglio: '[data-r="carte"]',
    testo: [
      'Sotto la scheda, l’elenco riporta i capitoli del modulo con il numero delle unità, la prova e le sfide di ciascuno; ogni voce apre la pagina del capitolo. Per il Modulo 0 l’elenco riporta direttamente le unità.',
      'La pagina di un capitolo ne espone la guida e i prerequisiti, quindi il percorso in tre passi: le unità nell’ordine indicato, ciascuna con il proprio obiettivo; la prova del capitolo, con domande in 999 varianti numerate; le sfide da svolgere in un terminale, sulla piattaforma indicata a lezione.'
    ]
  },
  {
    eti: 'Testata', titolo: 'Glossario, guida e dispensa', rotta: '#/', bersaglio: '.testa nav a',
    testo: [
      'La testata è presente in ogni pagina, e la voce «Rete del corso» riconduce alla pagina principale. Il glossario raccoglie i {TERMINI} termini del corso, ciascuno con la definizione e l’unità che lo introduce; nel testo delle unità i termini evidenziati ne mostrano la definizione alla selezione.',
      'La guida descrive in forma estesa l’organizzazione del sito e le modalità di consultazione. La dispensa, che raccoglierà la trattazione completa degli argomenti, è in costruzione, e la voce «Dispensa» ne riporta lo stato.'
    ]
  },
  {
    eti: 'Dati e ripresa', titolo: 'Nessun dato conservato', rotta: '#/', bersaglio: null, bivio: ['Visita del laboratorio', 'Fine dell’introduzione'],
    testo: [
      'Il sito non conserva alcun dato. Previsioni, risposte ed esiti delle prove esistono soltanto nella pagina aperta, e vanno perduti alla sua chiusura. Per la medesima ragione questa introduzione compare a ogni apertura della pagina principale, e il punto raggiunto si ritrova mediante le linguette dei moduli oppure la rete.',
      'La seconda parte dell’introduzione illustra il laboratorio sulla pagina dell’unità 0.4, in {LAB} schede. Il comando «Fine dell’introduzione» conduce invece al punto di partenza del percorso.'
    ]
  },
  {
    eti: 'Fasi dell’unità', titolo: 'Le cinque fasi di un’unità', rotta: '#/u/0.4/1', bersaglio: '#fasi',
    testo: [
      'La pagina mostrata è l’unità 0.4, dedicata al laboratorio. Sotto il titolo, la barra illuminata elenca le cinque fasi comuni a tutte le unità: richiami, esposizione, esperimento, esecuzione guidata e bilancio.',
      'La fase corrente è evidenziata in ambra, le fasi precedenti in azzurro. Ogni fase si raggiunge con una selezione, e l’ordine numerato è quello consigliato. In fondo alla pagina un comando conduce alla fase successiva, e l’occhiello sopra il titolo indica la posizione dell’unità nel capitolo o nel modulo.'
    ]
  },
  {
    eti: 'Attività della fase', titolo: 'L’attività di ogni fase', rotta: '#/u/0.4/1', bersaglio: '.consegna',
    testo: [
      'All’inizio di ogni fase, il riquadro «Attività della fase» indica che cosa è richiesto. Nella fase dei richiami si rileggono le nozioni già introdotte, ciascuna con l’unità di provenienza, e si risponde a una domanda di verifica.',
      'Una risposta errata segnala l’opportunità di rivedere tali nozioni prima di proseguire, e il commento associato a ciascuna opzione ne indica la ragione. Le fasi successive riportano un’indicazione analoga, riferita alle proprie attività.'
    ]
  },
  {
    eti: 'Previsione', titolo: 'La previsione', rotta: '#/u/0.4/3', bersaglio: '[data-r="prev"]', interattiva: true,
    testo: [
      'Nella terza fase l’esperimento è descritto prima dell’esecuzione: lo svolgimento, gli elementi della scena e una domanda sull’esito. La previsione consiste nella scelta di uno dei valori proposti, ed è confrontata con il risultato al termine dell’esecuzione.',
      'Per proseguire si selezioni ora uno dei valori nel riquadro illuminato. Il comando «Scheda successiva» si attiva dopo la selezione.'
    ]
  },
  {
    eti: 'Controlli', titolo: 'I controlli dell’esperimento', rotta: '#/u/0.4/4', bersaglio: '[data-r="comandi"]',
    testo: [
      'Nella quarta fase l’esperimento è eseguito. I controlli posti sopra la scena fissano i dati di partenza; in questa unità stabiliscono il numero dei comandi da eseguire sulle lampade.',
      'Ogni modifica dei dati ricostruisce la sequenza dei passi e richiede una nuova previsione. Il numero dei passi, la scena e il calcolo dipendono quindi dai valori scelti, e il medesimo esperimento può essere ripetuto su casi diversi.'
    ]
  },
  {
    eti: 'Avanzamento', titolo: 'L’esecuzione per passi', rotta: '#/u/0.4/4', bersaglio: ['.tacche', '[data-r="barra"]', '[data-r="bottoni"]'],
    testo: [
      'Sotto la scena, il riquadro di testo descrive il passo corrente. I pulsanti «Passo successivo» e «Passo precedente» spostano l’esperimento di un passo; «Riproduzione» ne avvia l’avanzamento automatico, e «Da capo» lo riporta all’inizio. Il cursore, e con il banco selezionato le frecce della tastiera, raggiungono un passo qualunque.',
      'Nel modo «Guidato», selezionabile sopra la scena, alcuni passi richiedono una risposta prima di proseguire. Al termine dell’esecuzione la previsione è confrontata con l’esito, e un comando conduce al bilancio.'
    ]
  },
  {
    eti: 'Bilancio', titolo: 'Il bilancio e gli esercizi', rotta: '#/u/0.4/5', bersaglio: '[data-es="0"]', finale: true,
    testo: [
      'La quinta fase conclude l’unità. Dopo un’esecuzione completa riporta il confronto fra previsione ed esito; espone quindi la regola, gli errori frequenti e le competenze da verificare.',
      'Seguono gli esercizi. Una risposta errata riceve un commento riferito all’errore commesso, e gli esercizi a risposta scritta dispongono di tre indizi progressivi e dello svolgimento completo. Con questa scheda l’introduzione è conclusa, e il comando finale apre l’unità 0.1.'
    ]
  }
];
