'use strict';
SL.catalogo.push({
  "id": "5.3",
  "title": "Scheduling della CPU e condivisione del tempo",
  "units": [
    {
      "id": "5.3.1",
      "title": "Eventi che attivano lo scheduler"
    },
    {
      "id": "5.3.2",
      "title": "Ordine di servizio e attesa media in FCFS e SJF"
    },
    {
      "id": "5.3.3",
      "title": "Round-robin e costo della prelazione"
    },
    {
      "id": "5.3.4",
      "title": "Priorità, retroazione e inversione"
    },
    {
      "id": "5.3.5",
      "title": "Scheduling su più processori logici"
    },
    {
      "id": "5.3.6",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "5.3.7",
      "provaIniziale": 3,
      "title": "Esercizi",
      "kind": "esercizi"
    },
    {
      "id": "5.3.8",
      "provaIniziale": 1,
      "title": "Soluzioni",
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
