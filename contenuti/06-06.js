'use strict';
SL.catalogo.push({
  "id": "6.6",
  "title": "Consistenza e recupero dopo un arresto",
  "units": [
    {
      "id": "6.6.1",
      "title": "Perché la persistenza richiede un modello di consistenza"
    },
    {
      "id": "6.6.2",
      "title": "Ricostruzione e riparazione"
    },
    {
      "id": "6.6.3",
      "title": "Journal redo e soglia del commit durevole"
    },
    {
      "id": "6.6.4",
      "title": "Journaling di dati e metadati: garanzie e costi"
    },
    {
      "id": "6.6.5",
      "title": "Esercizi",
      "kind": "esercizi",
      "provaIniziale": 1
    },
    {
      "id": "6.6.6",
      "title": "Soluzioni",
      "kind": "soluzioni",
      "provaIniziale": 5
    }
  ],
  "pwn": [
    {
      "id": "cslez6_6_01_consistency",
      "title": "Consistenza del file system",
      "format": "intero / scelta multipla / sequenza",
      "variants": [
        "m6v-656187300b",
        "m6v-0d05a7898f",
        "m6v-aeb9400f0c",
        "m6v-5bea46f03f"
      ]
    },
    {
      "id": "cslez6_6_02_fsck",
      "title": "Controllo con fsck",
      "format": "intero / scelta multipla",
      "variants": [
        "m6v-52704962ee",
        "m6v-d57ab51d64",
        "m6v-c3b3bada2e",
        "m6v-3f2fed9873"
      ]
    },
    {
      "id": "cslez6_6_03_write_order",
      "title": "Ordine delle scritture",
      "format": "scelta multipla / sequenza",
      "variants": [
        "m6v-3ba672cb4f",
        "m6v-109251a527",
        "m6v-5e86dca4ac",
        "m6v-27d76609d8"
      ]
    },
    {
      "id": "cslez6_6_04_journaling",
      "title": "Registro delle modifiche e commit",
      "format": "scelta multipla / sequenza",
      "variants": [
        "m6v-30a25f9573",
        "m6v-ecc10c3edc",
        "m6v-90a91e2bbb",
        "m6v-42e2178354"
      ]
    },
    {
      "id": "cslez6_6_05_crash_recovery",
      "title": "Recupero dopo un arresto",
      "format": "intero / scelta multipla / sequenza",
      "variants": [
        "m6v-9da46ac0b0",
        "m6v-9c1c7c267a",
        "m6v-2eb7598be5",
        "m6v-5cfae51618"
      ]
    }
  ]
});
