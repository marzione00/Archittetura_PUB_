'use strict';
SL.catalogo.push({
  "id": "5.5",
  "title": "Stato condiviso, sezioni critiche e semafori",
  "units": [
    {
      "id": "5.5.1",
      "title": "Intercalazioni e aggiornamenti persi"
    },
    {
      "id": "5.5.2",
      "title": "Scegliere i confini della sezione critica"
    },
    {
      "id": "5.5.3",
      "title": "Un contatore completo protetto da mutex"
    },
    {
      "id": "5.5.4",
      "title": "Atomicità, visibilità e ordinamento"
    },
    {
      "id": "5.5.5",
      "title": "Attesa attiva, sospensione e proprietà del lock"
    },
    {
      "id": "5.5.6",
      "title": "Permessi dei semafori e ordine degli eventi"
    },
    {
      "id": "5.5.7",
      "title": "Aggiornamenti condizionati e granularità dei lock"
    },
    {
      "id": "5.5.8",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "5.5.9",
      "provaIniziale": 3,
      "title": "Esercizi",
      "kind": "esercizi"
    },
    {
      "id": "5.5.10",
      "provaIniziale": 5,
      "title": "Soluzioni",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez5_5_01_semaphores",
      "title": "Corse sui dati e aggiornamenti persi",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.5.g1.lost-increment",
        "m5.5.g1.data-race",
        "m5.5.g1.logical-race",
        "m5.5.g1.critical-boundary"
      ]
    },
    {
      "id": "cslez5_5_02_semaphores",
      "title": "Proprietà di una sezione critica",
      "format": "scelta multipla",
      "variants": [
        "m5.5.g2.mutual-exclusion",
        "m5.5.g2.strict-progress",
        "m5.5.g2.bounded-waiting",
        "m5.5.g2.outside-independence"
      ]
    },
    {
      "id": "cslez5_5_03_semaphores",
      "title": "Stato del semaforo durante wait e signal",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.5.g3.mutex-initial",
        "m5.5.g3.two-waits",
        "m5.5.g3.third-wait",
        "m5.5.g3.wake-ready"
      ]
    },
    {
      "id": "cslez5_5_04_semaphores",
      "title": "Semafori per precedenze e risorse",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.5.g4.event-order",
        "m5.5.g4.three-resources",
        "m5.5.g4.binary-vs-mutex",
        "m5.5.g4.signal-before-wait"
      ]
    },
    {
      "id": "cslez5_5_05_semaphores",
      "title": "Errori di sincronizzazione",
      "format": "scelta multipla",
      "variants": [
        "m5.5.g5.write-only-lock",
        "m5.5.g5.missing-signal",
        "m5.5.g5.non-atomic-wait",
        "m5.5.g5.plain-spin-flag"
      ]
    }
  ]
});
