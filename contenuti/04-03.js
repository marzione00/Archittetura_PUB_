'use strict';
SL.catalogo.push({
  "id": "4.3",
  "title": "Controller dei dispositivi, polling e interrupt",
  "units": [
    {
      "id": "4.3.1",
      "title": "Interfaccia del controller e notifiche"
    },
    {
      "id": "4.3.2",
      "title": "Polling e interrupt"
    },
    {
      "id": "4.3.3",
      "title": "Instradamento, vettori e conferma dell’interrupt"
    },
    {
      "id": "4.3.4",
      "title": "Registri del dispositivo, costo e struttura del driver"
    },
    {
      "id": "4.3.5",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "4.3.6",
      "title": "Esercizi",
      "provaIniziale": 1,
      "kind": "esercizi"
    },
    {
      "id": "4.3.7",
      "title": "Soluzioni",
      "provaIniziale": 3,
      "tracciaIniziale": 2,
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez4_3_01_io_interrupts_01",
      "title": "Registri di comando, stato e dati",
      "format": "scelta multipla",
      "variants": [
        "m4.3.g1.command",
        "m4.3.g1.status",
        "m4.3.g1.data",
        "m4.3.g1.controller-order"
      ]
    },
    {
      "id": "cslez4_3_02_io_interrupts_02",
      "title": "Frequenza e costo del polling",
      "format": "intero / scelta multipla",
      "variants": [
        "m4.3.g2.polling-choice",
        "m4.3.g2.poll-count",
        "m4.3.g2.poll-cost",
        "m4.3.g2.poll-meaning"
      ]
    },
    {
      "id": "cslez4_3_03_io_interrupts_03",
      "title": "Consegna e riconoscimento di un interrupt",
      "format": "scelta multipla",
      "variants": [
        "m4.3.g3.irq-order",
        "m4.3.g3.apic",
        "m4.3.g3.mask",
        "m4.3.g3.ack"
      ]
    },
    {
      "id": "cslez4_3_04_io_interrupts_04",
      "title": "Fronte, livello e priorità",
      "format": "scelta multipla",
      "variants": [
        "m4.3.g4.level",
        "m4.3.g4.edge",
        "m4.3.g4.priority",
        "m4.3.g4.mask-reason"
      ]
    },
    {
      "id": "cslez4_3_05_io_interrupts_05",
      "title": "Percorso di un evento da tastiera",
      "format": "intero / scelta multipla",
      "variants": [
        "m4.3.g5.keyboard-flow",
        "m4.3.g5.scancode",
        "m4.3.g5.status-ready",
        "m4.3.g5.irq-cycles"
      ]
    }
  ]
});
