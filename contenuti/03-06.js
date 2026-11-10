'use strict';
SL.catalogo.push({
  "id": "3.6",
  "title": "Il processore in pipeline a cinque stadi",
  "units": [
    {
      "id": "3.6.1",
      "title": "Dalla sovrapposizione alla pipeline controllata"
    },
    {
      "id": "3.6.2",
      "title": "Stato della pipeline e controllo del prelievo"
    },
    {
      "id": "3.6.3",
      "title": "Dipendenze dei dati e forwarding"
    },
    {
      "id": "3.6.4",
      "title": "Conflitti di controllo, stalli e bolle"
    },
    {
      "id": "3.6.5",
      "title": "Priorità dei conflitti e stato preciso"
    },
    {
      "id": "3.6.6",
      "title": "Traccia e conteggio delle prestazioni"
    },
    {
      "id": "3.6.7",
      "title": "Misurare e spiegare le prestazioni"
    },
    {
      "id": "3.6.8",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "3.6.9",
      "title": "Esercizi",
      "kind": "esercizi",
      "provaIniziale": 2
    },
    {
      "id": "3.6.10",
      "title": "Soluzioni",
      "kind": "soluzioni",
      "provaIniziale": 4
    }
  ],
  "pwn": [
    {
      "id": "cslez3_6_01_random_assembly",
      "title": "Istruzioni presenti nei cinque stadi",
      "format": "assembly",
      "variants": [
        "m3.6.b1.stage-of",
        "m3.6.b1.in-f",
        "m3.6.b1.in-d",
        "m3.6.b1.in-e",
        "m3.6.b1.in-m",
        "m3.6.b1.in-w",
        "m3.6.b1.active",
        "m3.6.b1.occupancy"
      ]
    },
    {
      "id": "cslez3_6_02_random_assembly",
      "title": "Abilitazione e controllo dei registri di pipeline",
      "format": "assembly",
      "variants": [
        "m3.6.b2.fd-pc",
        "m3.6.b2.reg-enable",
        "m3.6.b2.reg-stall",
        "m3.6.b2.stall-bubble-priority",
        "m3.6.b2.cc-not-register",
        "m3.6.b2.valid-bit",
        "m3.6.b2.control-pack",
        "m3.6.b2.data-control-consistency"
      ]
    },
    {
      "id": "cslez3_6_03_random_assembly",
      "title": "Priorità nella selezione del PC",
      "format": "assembly",
      "variants": [
        "m3.6.b3.pc-fallthrough",
        "m3.6.b3.pc-jump",
        "m3.6.b3.pc-prev-cycle",
        "m3.6.b3.pc-status",
        "m3.6.b3.pc-priority",
        "m3.6.b3.pc-hold",
        "m3.6.b3.pc-valid",
        "m3.6.b3.pc-sequential-length"
      ]
    },
    {
      "id": "cslez3_6_04_random_assembly",
      "title": "Cronologia degli stadi e completamento",
      "format": "assembly",
      "variants": [
        "m3.6.b4.stage-code",
        "m3.6.b4.active-count",
        "m3.6.b4.fetch-cycle",
        "m3.6.b4.writeback-cycle",
        "m3.6.b4.stage-distance",
        "m3.6.b4.full-pipeline",
        "m3.6.b4.remaining-stages",
        "m3.6.b4.next-stage"
      ]
    },
    {
      "id": "cslez3_6_05_random_assembly",
      "title": "Trasferimenti tra stadi e bolle",
      "format": "assembly",
      "variants": [
        "m3.6.b5.fd-valid",
        "m3.6.b5.de-hold",
        "m3.6.b5.em-pack",
        "m3.6.b5.mw-select",
        "m3.6.b5.bubble-control",
        "m3.6.b5.pipeline-register",
        "m3.6.b5.signal-naming",
        "m3.6.b5.two-stage-transfer"
      ]
    }
  ]
});
