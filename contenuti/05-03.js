'use strict';
SL.catalogo.push({
  "id": "5.3",
  "title": "Scheduling della CPU e condivisione del tempo",
  "units": [
    {
      "id": "5.3.1",
      "title": "Eventi che attivano lo scheduler",
      "experiment": "Scegli l’istante in cui B riceve la risposta del dispositivo. A parità di istante confronta la fine del quanto di A con la prelazione al risveglio di B.",
      "skill": "Misurare l’attesa dopo un risveglio",
      "check": "L’attesa di B nella coda dei pronti è l’intervallo fra risveglio e prima assegnazione. Il costo del cambio è nullo in entrambe le tracce."
    },
    {
      "id": "5.3.2",
      "title": "Ordine di servizio e attesa media in FCFS e SJF",
      "experiment": "Imposta la durata di A e confronta FCFS e SJF lasciando invariati B e C. Ripeti con A da 3 ms e osserva lo spareggio con B.",
      "skill": "Calcolare l’attesa media",
      "check": "Le attese si leggono dagli inizi dei turni, perché tutti i lavori arrivano insieme. In SJF la parità di durata si risolve con l’ordine di ingresso."
    },
    {
      "id": "5.3.3",
      "title": "Round-robin e costo della prelazione",
      "experiment": "Lascia invariato il costo di cambio e confronta due durate del quanto. Poi mantieni il quanto e varia il costo. Misura il primo avvio di B e l’istante finale.",
      "skill": "Contare i cambi effettivi di processo",
      "check": "Il primo turno di A precede la prima assegnazione a B. Le fasce di cambio aggiungono tempo alla durata dei tre lavori."
    },
    {
      "id": "5.3.4",
      "title": "Priorità, retroazione e inversione",
      "experiment": "Confronta prima priorità fisse ed ereditarietà seguendo il proprietario del mutex. Nei casi di retroazione e invecchiamento individua l’evento che modifica la priorità.",
      "skill": "Individuare il prossimo processo a partire dalle priorità",
      "check": "Con l’ereditarietà la priorità di L cambia finché H attende il suo mutex. Negli altri due casi intervengono il consumo del quanto o il tempo trascorso in coda."
    },
    {
      "id": "5.3.5",
      "title": "Scheduling su più processori logici",
      "experiment": "Imposta i lavori iniziali del core 0. Confronta le code conservate con il bilanciamento prima della partenza e leggi tempo totale e inattività dei core.",
      "skill": "Confrontare durata e inattività di due core",
      "check": "L’istante finale coincide con il completamento della coda più lunga. L’altro core può restare inattivo anche se all’inizio entrambi avevano lavoro."
    },
    {
      "id": "5.3.6",
      "title": "Problemi svolti",
      "experiment": "Segna l’arrivo di B sulla corsia di A. Segui il passaggio del core da A a B e prevedi l’istante in cui B completa il proprio servizio.",
      "skill": "Ricostruire una linea temporale",
      "check": "L’arrivo di B cade durante il turno di A. Tra arrivo e completamento di B puoi distinguere l’attesa e i millisecondi effettivi di CPU.",
      "kind": "esercizi"
    },
    {
      "id": "5.3.7",
      "title": "Esercizi",
      "experiment": "Apri il confronto fra SJF e SRTF. All’arrivo di B calcola il lavoro ancora richiesto da A, quindi determina il completamento di B con le due politiche.",
      "skill": "Decidere una prelazione",
      "check": "I due diagrammi si separano all’arrivo di B. La scelta dipende dalla possibilità di interrompere A e dal lavoro residuo dei due processi.",
      "kind": "esercizi"
    },
    {
      "id": "5.3.8",
      "title": "Soluzioni",
      "experiment": "Nella soluzione «Misurare le attese su una traccia», individua l’arrivo, il primo avvio e la fine di P. Somma separatamente i due intervalli passati in coda.",
      "skill": "Verificare le metriche di scheduling",
      "check": "La risposta copre soltanto la prima attesa. Nella traccia, senza sospensioni per I/O, l’attesa complessiva più il servizio CPU ricostruiscono il tempo dall’arrivo alla fine.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez5_3_01_scheduling",
      "title": "Tempi di attesa, risposta e completamento",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.3.g1.cpu-bound",
        "m5.3.g1.turnaround",
        "m5.3.g1.response",
        "m5.3.g1.waiting-simple"
      ]
    },
    {
      "id": "cslez5_3_02_scheduling",
      "title": "Ordinamento FCFS e prestazioni",
      "format": "decimale / intero / scelta multipla",
      "variants": [
        "m5.3.g2.fcfs-average",
        "m5.3.g2.fcfs-completion",
        "m5.3.g2.convoy",
        "m5.3.g2.throughput"
      ]
    },
    {
      "id": "cslez5_3_03_scheduling",
      "title": "SJF e SRTF su una traccia di arrivi",
      "format": "decimale / intero / scelta multipla",
      "variants": [
        "m5.3.g3.sjf-order",
        "m5.3.g3.sjf-average",
        "m5.3.g3.srtf-arrival-preemptions",
        "m5.3.g3.sjf-optimal-assumption"
      ]
    },
    {
      "id": "cslez5_3_04_scheduling",
      "title": "Round-robin con quanto di tempo",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.3.g4.rr-sequence",
        "m5.3.g4.rr-p3-response",
        "m5.3.g4.rr-dispatches",
        "m5.3.g4.quantum-limits"
      ]
    },
    {
      "id": "cslez5_3_05_scheduling",
      "title": "Priorità, attese e invecchiamento",
      "format": "scelta multipla",
      "variants": [
        "m5.3.g5.starvation",
        "m5.3.g5.aging",
        "m5.3.g5.priority-inversion",
        "m5.3.g5.inheritance"
      ]
    }
  ]
});
