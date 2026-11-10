'use strict';
SL.catalogo.push({
  "id": "5.1",
  "title": "Processi, stati e cambi di contesto",
  "units": [
    {
      "id": "5.1.1",
      "title": "Il processo come astrazione di esecuzione e protezione"
    },
    {
      "id": "5.1.2",
      "title": "Dall’esecuzione agli stati di pronto e bloccato"
    },
    {
      "id": "5.1.3",
      "title": "Il cambio di contesto e la continuità dell’esecuzione"
    },
    {
      "id": "5.1.4",
      "title": "Quali dati conserva il kernel"
    },
    {
      "id": "5.1.5",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "5.1.6",
      "provaIniziale": 2,
      "title": "Esercizi",
      "kind": "esercizi"
    },
    {
      "id": "5.1.7",
      "provaIniziale": 5,
      "title": "Soluzioni",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez5_1_01_processes",
      "title": "Programmi, processi e parallelismo",
      "format": "scelta multipla",
      "variants": [
        "m5.1.g1.program-file",
        "m5.1.g1.multiprogramming",
        "m5.1.g1.single-core-pseudoparallel",
        "m5.1.g1.true-parallelism"
      ]
    },
    {
      "id": "cslez5_1_02_processes",
      "title": "Transizioni fra gli stati di un processo",
      "format": "scelta multipla",
      "variants": [
        "m5.1.g2.io-request",
        "m5.1.g2.io-completion",
        "m5.1.g2.quantum-expiry",
        "m5.1.g2.admission"
      ]
    },
    {
      "id": "cslez5_1_03_processes",
      "title": "Contesto salvato e PCB",
      "format": "scelta multipla",
      "variants": [
        "m5.1.g3.saved-pc",
        "m5.1.g3.pcb-not-memory",
        "m5.1.g3.interrupt-no-switch",
        "m5.1.g3.context-components"
      ]
    },
    {
      "id": "cslez5_1_04_processes",
      "title": "Costo dei cambi e tempi di risposta",
      "format": "decimale / intero",
      "variants": [
        "m5.1.g4.switch-overhead",
        "m5.1.g4.fourth-response",
        "m5.1.g4.two-core-running",
        "m5.1.g4.ready-count"
      ]
    },
    {
      "id": "cslez5_1_05_processes",
      "title": "Ordine di esecuzione e assegnazione ai core",
      "format": "scelta multipla",
      "variants": [
        "m5.1.g5.completion-scheduling",
        "m5.1.g5.multicore-placement",
        "m5.1.g5.ready-vs-blocked-scenario",
        "m5.1.g5.switch-order"
      ]
    }
  ]
});
