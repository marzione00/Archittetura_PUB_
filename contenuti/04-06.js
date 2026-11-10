'use strict';
SL.catalogo.push({
  "id": "4.6",
  "title": "RAID e memoria a stato solido",
  "units": [
    {
      "id": "4.6.1",
      "title": "Ridondanza, modelli di guasto e RAID"
    },
    {
      "id": "4.6.2",
      "title": "Scritture di parità, modalità degradata e ricostruzione"
    },
    {
      "id": "4.6.3",
      "title": "Memoria flash e traduzione"
    },
    {
      "id": "4.6.4",
      "title": "FTL, durata e latenza dipendente dallo stato"
    },
    {
      "id": "4.6.5",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "4.6.6",
      "title": "Esercizi",
      "provaIniziale": 1,
      "kind": "esercizi"
    },
    {
      "id": "4.6.7",
      "title": "Soluzioni",
      "provaIniziale": 3,
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez4_6_01_raid_ssd_01",
      "title": "Affidabilità e disponibilità",
      "format": "decimale / scelta multipla",
      "variants": [
        "m4.6.g1.reliability",
        "m4.6.g1.availability",
        "m4.6.g1.unavailability",
        "m4.6.g1.distinction"
      ]
    },
    {
      "id": "cslez4_6_02_raid_ssd_02",
      "title": "Distribuzione dei dati in RAID 0",
      "format": "intero / scelta multipla",
      "variants": [
        "m4.6.g2.raid0-capacity",
        "m4.6.g2.raid0-fault",
        "m4.6.g2.raid0-purpose",
        "m4.6.g2.raid0-risk"
      ]
    },
    {
      "id": "cslez4_6_03_raid_ssd_03",
      "title": "Copie e ricostruzione in RAID 1",
      "format": "intero / scelta multipla",
      "variants": [
        "m4.6.g3.raid1-capacity",
        "m4.6.g3.raid1-fault",
        "m4.6.g3.raid1-copies",
        "m4.6.g3.rebuild"
      ]
    },
    {
      "id": "cslez4_6_04_raid_ssd_04",
      "title": "Parità e capacità in RAID 5 e RAID 10",
      "format": "intero",
      "variants": [
        "m4.6.g4.raid5-min",
        "m4.6.g4.raid5-capacity",
        "m4.6.g4.raid5-fault",
        "m4.6.g4.raid10-capacity"
      ]
    },
    {
      "id": "cslez4_6_05_raid_ssd_05",
      "title": "Lettura, cancellazione e usura negli SSD",
      "format": "scelta multipla",
      "variants": [
        "m4.6.g5.ssd-read-unit",
        "m4.6.g5.ssd-erase-unit",
        "m4.6.g5.no-seek",
        "m4.6.g5.wear"
      ]
    }
  ]
});
