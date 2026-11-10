'use strict';
SL.catalogo.push({
  "id": "4.7",
  "title": "Classi di dispositivi e accesso diretto alla memoria",
  "units": [
    {
      "id": "4.7.1",
      "title": "I/O programmato e motivazione del DMA"
    },
    {
      "id": "4.7.2",
      "title": "Il DMA come transazione di memoria delegata"
    },
    {
      "id": "4.7.3",
      "title": "Interfacce, descrittori e proprietà dei buffer"
    },
    {
      "id": "4.7.4",
      "title": "Coerenza, ordinamento e indirizzi visibili al dispositivo"
    },
    {
      "id": "4.7.5",
      "title": "Completamento e ritorno allo scheduling"
    },
    {
      "id": "4.7.6",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "4.7.7",
      "title": "Esercizi",
      "provaIniziale": 3,
      "kind": "esercizi"
    },
    {
      "id": "4.7.8",
      "title": "Soluzioni",
      "provaIniziale": 5,
      "tracciaIniziale": 2,
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez4_7_01_dma_01",
      "title": "Dispositivi a caratteri e a blocchi",
      "format": "scelta multipla",
      "variants": [
        "m4.7.g1.char",
        "m4.7.g1.block",
        "m4.7.g1.random",
        "m4.7.g1.stream"
      ]
    },
    {
      "id": "cslez4_7_02_dma_02",
      "title": "Driver e gestione delle richieste",
      "format": "scelta multipla",
      "variants": [
        "m4.7.g2.driver-role",
        "m4.7.g2.request-order",
        "m4.7.g2.status",
        "m4.7.g2.abstraction"
      ]
    },
    {
      "id": "cslez4_7_03_dma_03",
      "title": "Configurazione e completamento del DMA",
      "format": "scelta multipla",
      "variants": [
        "m4.7.g3.dma-config",
        "m4.7.g3.dma-order",
        "m4.7.g3.final",
        "m4.7.g3.bus-master"
      ]
    },
    {
      "id": "cslez4_7_04_dma_04",
      "title": "Costo temporale e impegno della CPU",
      "format": "decimale / intero / scelta multipla",
      "variants": [
        "m4.7.g4.time",
        "m4.7.g4.interrupts",
        "m4.7.g4.cpu-saving",
        "m4.7.g4.rate"
      ]
    },
    {
      "id": "cslez4_7_05_dma_05",
      "title": "Confrontare I/O programmato e DMA",
      "format": "scelta multipla",
      "variants": [
        "m4.7.g5.pio-dma",
        "m4.7.g5.arbitration",
        "m4.7.g5.cpu-role",
        "m4.7.g5.end-to-end"
      ]
    }
  ]
});
