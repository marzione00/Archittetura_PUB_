'use strict';
SL.catalogo.push({
  "id": "4.1",
  "title": "Flusso di controllo eccezionale e ingresso protetto",
  "units": [
    {
      "id": "4.1.1",
      "title": "Interruzione del flusso sequenziale",
      "experiment": "Fissa il RIP iniziale. Esegui una traccia con il timer e una con la pagina assente. Confronta gli indirizzi di ripresa.",
      "skill": "Ricostruire il trasferimento di controllo",
      "check": "Il timer interrompe il flusso fra istruzioni. Dopo il recupero della pagina, il caricamento riparte dal proprio indirizzo."
    },
    {
      "id": "4.1.2",
      "title": "Interrupt, fault, trap e abort",
      "experiment": "Mantieni lo stesso RIP e cambia la causa fra INT3, pagina assente e guasto grave. In ogni traccia confronta il punto di ripresa con l’indirizzo iniziale.",
      "skill": "Classificare l’evento",
      "check": "Per INT3 il RIP salvato supera di un byte l’indirizzo iniziale. Il fault conserva l’indirizzo del caricamento. L’abort lascia indeterminata la ripresa."
    },
    {
      "id": "4.1.3",
      "title": "Vettori, privilegi e ingresso protetto",
      "experiment": "Scegli il vettore 48 e una porta con DPL 0. Confronta INT da CPL 3 con una richiesta hardware, poi prova il vettore 14 per il dispositivo.",
      "skill": "Indirizzare un descrittore",
      "check": "Con il vettore 48 entrambe le origini individuano la stessa porta. Il DPL regola l’invocazione software. Il vettore 14 viene escluso dalla mappa dei dispositivi prima dell’accesso alla IDT."
    },
    {
      "id": "4.1.4",
      "title": "Ingresso preciso in una macchina con pipeline",
      "experiment": "Mantieni il registro iniziale a 12 e sposta il fault dal quarto al secondo ADD. Conta le istruzioni ritirate e leggi il registro nel gestore.",
      "skill": "Ricostruire uno stato preciso",
      "check": "Ogni ADD ritirato ha già incrementato il registro. Il RIP salvato identifica il primo ADD da ripetere."
    },
    {
      "id": "4.1.5",
      "title": "Codice di ingresso Linux e contesto salvato",
      "experiment": "Con RSP a 0x2008 e otto registri da salvare, confronta il page fault con l’errore di divisione. Annota RSP dopo l’ingresso hardware e dopo lo stub.",
      "skill": "Leggere una traccia di ingresso",
      "check": "Il codice di errore del page fault e lo slot sintetico dell’altro percorso occupano entrambi otto byte. Cambia la ripartizione fra hardware e software. A parità di registri salvati il RSP finale coincide."
    },
    {
      "id": "4.1.6",
      "title": "Stato da preservare all’ingresso",
      "experiment": "Scegli il valore iniziale di RAX. Ripeti l’interrupt con e senza il salvataggio di RAX e confronta le due letture dopo IRETQ.",
      "skill": "Verificare il ripristino",
      "check": "Entrambe le tracce riprendono allo stesso RIP. RAX contiene il valore del programma solo nel percorso che ne ripristina la copia salvata."
    },
    {
      "id": "4.1.7",
      "title": "Ripresa, annidamento e priorità",
      "experiment": "Riabilita IF dopo il prologo. Confronta una richiesta di priorità 4 con una di priorità 5, poi mantieni IF a zero e ripeti la seconda prova.",
      "skill": "Tracciare eventi annidati",
      "check": "Con priorità attiva 4, la richiesta più urgente entra nel gestore esterno solo se IF è attivo. La profondità e il primo contesto ripristinato distinguono l’annidamento dall’attesa."
    },
    {
      "id": "4.1.8",
      "title": "Problemi svolti",
      "experiment": "Parti da IF = 1. Prevedi il valore che leggerà il gestore e segui i due tipi di porta a partire dallo stesso stato.",
      "skill": "Confrontare gli effetti delle porte sul flag IF",
      "check": "Confronta il flag salvato con il flag attivo. La differenza fra le due porte compare nei flag del gestore.",
      "kind": "esercizi"
    },
    {
      "id": "4.1.9",
      "title": "Esercizi",
      "experiment": "Apri «Indirizzare una porta della IDT». Per ogni traccia ricava dalla modalità la dimensione della voce, quindi calcola offset e indirizzo.",
      "skill": "Calcolare l’indirizzo della voce",
      "check": "L’indice conta voci. Il confronto con la seconda traccia mostra perché la stessa formula deve usare la dimensione della porta indicata nella consegna.",
      "kind": "esercizi"
    },
    {
      "id": "4.1.10",
      "title": "Soluzioni",
      "experiment": "Scegli «Misurare il frame di ingresso» e ripercorri la seconda traccia. Tieni separati allineamento, campi di ritorno e codice di errore.",
      "skill": "Distinguere frame hardware e allineamento della pila",
      "check": "La differenza tra il puntatore iniziale e quello finale comprende anche i byte persi per l’allineamento. La sola dimensione del frame conta i campi effettivamente impilati.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez4_1_01_exceptions_01",
      "title": "Vettori e voci della IDT",
      "format": "intero",
      "variants": [
        "m4.1.g1.entry-size",
        "m4.1.g1.entry-address",
        "m4.1.g1.page-fault-vector",
        "m4.1.g1.table-cardinality"
      ]
    },
    {
      "id": "cslez4_1_02_exceptions_02",
      "title": "Classificare fault, trap e interrupt",
      "format": "scelta multipla",
      "variants": [
        "m4.1.g2.divide-class",
        "m4.1.g2.breakpoint-class",
        "m4.1.g2.nmi-class",
        "m4.1.g2.fault-rip"
      ]
    },
    {
      "id": "cslez4_1_03_exceptions_03",
      "title": "Campi del frame di ingresso",
      "format": "scelta multipla",
      "variants": [
        "m4.1.g3.base-frame",
        "m4.1.g3.privilege-extra",
        "m4.1.g3.page-error-code",
        "m4.1.g3.divide-no-code"
      ]
    },
    {
      "id": "cslez4_1_04_exceptions_04",
      "title": "Mascheramento e privilegi",
      "format": "scelta multipla",
      "variants": [
        "m4.1.g4.interrupt-if",
        "m4.1.g4.trap-if",
        "m4.1.g4.dpl-check",
        "m4.1.g4.nmi-mask"
      ]
    },
    {
      "id": "cslez4_1_05_exceptions_05",
      "title": "Indirizzo del gestore, esecuzione e ritorno",
      "format": "scelta multipla",
      "variants": [
        "m4.1.g5.handler-order",
        "m4.1.g5.return",
        "m4.1.g5.flush-purpose",
        "m4.1.g5.handler-address"
      ]
    }
  ]
});
