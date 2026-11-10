'use strict';
SL.catalogo.push({
  "id": "4.5",
  "title": "Memoria magnetica e analisi dei tempi di accesso",
  "units": [
    {
      "id": "4.5.1",
      "title": "Geometria e latenza meccanica"
    },
    {
      "id": "4.5.2",
      "title": "Blocchi logici e prestazioni quantitative"
    },
    {
      "id": "4.5.3",
      "title": "Code, scheduling e cache"
    },
    {
      "id": "4.5.4",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "4.5.5",
      "title": "Esercizi",
      "provaIniziale": 4,
      "kind": "esercizi"
    },
    {
      "id": "4.5.6",
      "title": "Soluzioni",
      "provaIniziale": 5,
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez4_5_01_disks_01",
      "title": "Geometria e capacità di un disco",
      "format": "intero",
      "variants": [
        "m4.5.g1.capacity",
        "m4.5.g1.track",
        "m4.5.g1.cylinder",
        "m4.5.g1.surfaces"
      ]
    },
    {
      "id": "cslez4_5_02_disks_02",
      "title": "Rotazione, posizionamento e tempo di accesso",
      "format": "decimale / scelta multipla",
      "variants": [
        "m4.5.g2.period",
        "m4.5.g2.avg-rotation",
        "m4.5.g2.access",
        "m4.5.g2.seek-purpose"
      ]
    },
    {
      "id": "cslez4_5_03_disks_03",
      "title": "Indirizzamento a blocchi e frammentazione",
      "format": "intero / scelta multipla",
      "variants": [
        "m4.5.g3.offset",
        "m4.5.g3.blocks",
        "m4.5.g3.fragment",
        "m4.5.g3.lba-meaning"
      ]
    },
    {
      "id": "cslez4_5_04_disks_04",
      "title": "Velocità e tempo di trasferimento",
      "format": "decimale / intero / scelta multipla",
      "variants": [
        "m4.5.g4.rate",
        "m4.5.g4.sequential",
        "m4.5.g4.transfer",
        "m4.5.g4.queue-total"
      ]
    },
    {
      "id": "cslez4_5_05_disks_05",
      "title": "Ordine delle letture e località",
      "format": "decimale / scelta multipla",
      "variants": [
        "m4.5.g5.read-order",
        "m4.5.g5.locality",
        "m4.5.g5.average",
        "m4.5.g5.geometry-abstraction"
      ]
    }
  ]
});
