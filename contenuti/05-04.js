'use strict';
SL.catalogo.push({
  "id": "5.4",
  "title": "Thread, concorrenza ed esecuzione parallela",
  "units": [
    {
      "id": "5.4.1",
      "title": "Memoria condivisa e registri dei thread",
      "experiment": "Imposta il valore scritto da T1. Confronta h e il registro di T2 prima della sincronizzazione e dopo la lettura esplicita di T2.",
      "skill": "Separare risorse condivise e stato del thread",
      "check": "La scrittura di T1 modifica la cella comune. Il registro di T2 cambia solo quando T2 carica il contenuto della cella."
    },
    {
      "id": "5.4.2",
      "title": "Concorrenza ed esecuzione simultanea",
      "experiment": "Fissa il numero di thread e varia i core disponibili. Prevedi quanti thread partiranno insieme e quanti resteranno nell’ultimo turno.",
      "skill": "Riconoscere sovrapposizione ed esecuzione simultanea",
      "check": "In un turno di 1 ms ogni core completa al massimo un thread. Un gruppo finale incompleto occupa comunque un intero turno."
    },
    {
      "id": "5.4.3",
      "title": "Chi decide quale thread eseguire?",
      "experiment": "Confronta le tre associazioni dei quattro thread utente ai thread del kernel. Segui la lettura che blocca U1 e conta i thread del kernel ancora eseguibili.",
      "skill": "Collegare thread utente e contesti del kernel",
      "check": "Durante l’I/O restano tre thread utente pronti. Il numero che può avanzare insieme dipende dai worker del kernel ancora disponibili."
    },
    {
      "id": "5.4.4",
      "title": "Argomenti e raccolta dei thread POSIX",
      "experiment": "Confronta una cella per worker con la cella condivisa del ciclo. Poi seleziona il fallimento della terza creazione. Annota quanti valori distinti vengono letti e quanti join occorrono.",
      "skill": "Gestire argomenti e pthread_join",
      "check": "Indirizzi distinti permettono letture distinte dopo la barriera. Nel caso di fallimento si raccolgono solo i thread di cui la creazione ha restituito successo."
    },
    {
      "id": "5.4.5",
      "title": "Isolamento dei guasti in processi e thread",
      "experiment": "Scegli tre thread nello stesso processo, poi tre processi separati. Avanza oltre l’accesso invalido di B e confronta i lavoratori ancora attivi.",
      "skill": "Scegliere il confine di isolamento",
      "check": "Con la gestione predefinita di SIGSEGV termina l’intero processo che contiene B. Il numero dei superstiti dipende da quali altri lavoratori condividono quel processo."
    },
    {
      "id": "5.4.6",
      "title": "Problemi svolti",
      "experiment": "Segui i puntatori da W0, W1 e W2 alle celle di ids. Prima di avanzare alla raccolta, prevedi il valore letto attraverso &ids[1].",
      "skill": "Verificare la durata degli argomenti",
      "check": "Il puntatore stabilisce quale cella legge W1. I join mantengono il chiamante nel blocco che contiene l’array fino al termine dei worker.",
      "kind": "esercizi"
    },
    {
      "id": "5.4.7",
      "title": "Esercizi",
      "experiment": "Nella prova su registri e heap individua la destinazione della scrittura di A. Prevedi il valore della cella e quello del registro di B dopo la barriera.",
      "skill": "Distinguere la scrittura in un registro dalla scrittura nell’heap",
      "check": "Seguire la destinazione della scrittura spiega quale valore cambia. La barriera stabilisce l’ordine fra scrittura e osservazione.",
      "kind": "esercizi"
    },
    {
      "id": "5.4.8",
      "title": "Soluzioni",
      "experiment": "Apri la soluzione sugli argomenti dopo la barriera. Confronta gli indirizzi ricevuti dai quattro thread e ricava l’insieme dei valori che leggono.",
      "skill": "Giustificare la scelta degli argomenti",
      "check": "Più puntatori allo stesso oggetto raggiungono l’ultimo valore di quell’oggetto. Con celle distinte puoi ricostruire separatamente i valori letti.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez5_4_01_threads",
      "title": "Risorse condivise e stato privato",
      "format": "scelta multipla",
      "variants": [
        "m5.4.g1.heap",
        "m5.4.g1.stack",
        "m5.4.g1.registers",
        "m5.4.g1.open-files"
      ]
    },
    {
      "id": "cslez5_4_02_threads",
      "title": "Concorrenza, parallelismo e isolamento",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.4.g2.concurrent-not-parallel",
        "m5.4.g2.max-parallel-two-cores",
        "m5.4.g2.untrusted-plugins",
        "m5.4.g2.shared-work-queue"
      ]
    },
    {
      "id": "cslez5_4_03_threads",
      "title": "Modelli di associazione tra thread",
      "format": "scelta multipla",
      "variants": [
        "m5.4.g3.many-one-block",
        "m5.4.g3.many-one-cores",
        "m5.4.g3.kernel-block",
        "m5.4.g3.many-many"
      ]
    },
    {
      "id": "cslez5_4_04_threads",
      "title": "Creazione, join e durata degli argomenti",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.4.g4.pthread-create",
        "m5.4.g4.pthread-join",
        "m5.4.g4.loop-variable",
        "m5.4.g4.array-lifetime"
      ]
    },
    {
      "id": "cslez5_4_05_threads",
      "title": "Stack, cambi di thread e isolamento dei guasti",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.4.g5.one-address-space",
        "m5.4.g5.five-stacks",
        "m5.4.g5.thread-switch",
        "m5.4.g5.fault-isolation"
      ]
    }
  ]
});
