'use strict';
SL.catalogo.push({
  "id": "4.1",
  "title": "Flusso di controllo eccezionale e ingresso protetto",
  "units": [
    {
      "id": "4.1.1",
      "title": "Interruzione del flusso sequenziale"
    },
    {
      "id": "4.1.2",
      "title": "Interrupt, fault, trap e abort"
    },
    {
      "id": "4.1.3",
      "title": "Vettori, privilegi e ingresso protetto"
    },
    {
      "id": "4.1.4",
      "title": "Ingresso preciso in una macchina con pipeline"
    },
    {
      "id": "4.1.5",
      "title": "Codice di ingresso Linux e contesto salvato"
    },
    {
      "id": "4.1.6",
      "title": "Stato da preservare all’ingresso"
    },
    {
      "id": "4.1.7",
      "title": "Ripresa, annidamento e priorità"
    },
    {
      "id": "4.1.8",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "4.1.9",
      "title": "Esercizi",
      "provaIniziale": 1,
      "kind": "esercizi"
    },
    {
      "id": "4.1.10",
      "title": "Soluzioni",
      "provaIniziale": 3,
      "tracciaIniziale": 2,
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
