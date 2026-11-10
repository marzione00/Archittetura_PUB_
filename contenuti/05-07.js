'use strict';
SL.catalogo.push({
  "id": "5.7",
  "title": "Deadlock, starvation e livelock",
  "units": [
    {
      "id": "5.7.1",
      "title": "Il deadlock come struttura di dipendenze"
    },
    {
      "id": "5.7.2",
      "title": "Le condizioni di Coffman e la prevenzione"
    },
    {
      "id": "5.7.3",
      "title": "Evitamento e sequenze sicure di completamento"
    },
    {
      "id": "5.7.4",
      "title": "Rilevamento e recupero"
    },
    {
      "id": "5.7.5",
      "title": "Distinguere starvation e livelock nelle tracce"
    },
    {
      "id": "5.7.6",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "5.7.7",
      "provaIniziale": 3,
      "title": "Esercizi",
      "kind": "esercizi"
    },
    {
      "id": "5.7.8",
      "provaIniziale": 5,
      "title": "Soluzioni",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez5_7_01_deadlock",
      "title": "Stallo, attesa indefinita e livelock",
      "format": "scelta multipla",
      "variants": [
        "m5.7.g1.starvation",
        "m5.7.g1.livelock",
        "m5.7.g1.deadlock",
        "m5.7.g1.temporary-block"
      ]
    },
    {
      "id": "cslez5_7_02_deadlock",
      "title": "Condizioni di Coffman",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.7.g2.mutual-exclusion",
        "m5.7.g2.hold-wait",
        "m5.7.g2.no-preemption",
        "m5.7.g2.coffman-count"
      ]
    },
    {
      "id": "cslez5_7_03_deadlock",
      "title": "Cicli nel grafo delle risorse",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.7.g3.edge-directions",
        "m5.7.g3.two-lock-edge-count",
        "m5.7.g3.cycle-single-instance",
        "m5.7.g3.cycle-multiple"
      ]
    },
    {
      "id": "cslez5_7_04_deadlock",
      "title": "Prevenzione e ordine di acquisizione",
      "format": "scelta multipla",
      "variants": [
        "m5.7.g4.global-order",
        "m5.7.g4.rank-violation",
        "m5.7.g4.all-at-once",
        "m5.7.g4.preemptable"
      ]
    },
    {
      "id": "cslez5_7_05_deadlock",
      "title": "Stati sicuri, rilevamento e recupero",
      "format": "scelta multipla",
      "variants": [
        "m5.7.g5.unsafe-not-deadlocked",
        "m5.7.g5.avoidance-info",
        "m5.7.g5.detection-recovery",
        "m5.7.g5.safe-sequence"
      ]
    }
  ]
});
