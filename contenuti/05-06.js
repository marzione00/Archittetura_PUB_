'use strict';
SL.catalogo.push({
  "id": "5.6",
  "title": "Semafori contatori e problemi classici di sincronizzazione",
  "units": [
    {
      "id": "5.6.1",
      "title": "Derivare il buffer limitato dai suoi invarianti"
    },
    {
      "id": "5.6.2",
      "title": "L’ordine di acquisizione nella dimostrazione di correttezza"
    },
    {
      "id": "5.6.3",
      "title": "Attendere una condizione sotto mutex"
    },
    {
      "id": "5.6.4",
      "title": "Lettori e scrittori: sicurezza e politica di ammissione"
    },
    {
      "id": "5.6.5",
      "title": "Dagli invarianti locali all’ordinamento globale delle risorse"
    },
    {
      "id": "5.6.6",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "5.6.7",
      "provaIniziale": 1,
      "title": "Esercizi",
      "kind": "esercizi"
    },
    {
      "id": "5.6.8",
      "provaIniziale": 3,
      "title": "Soluzioni",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez5_6_01_classical_sync",
      "title": "Condizioni e risorse nel produttore–consumatore",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.6.g1.initial-slots",
        "m5.6.g1.events-two-one",
        "m5.6.g1.condition-vs-exclusion",
        "m5.6.g1.multi-producer-metadata"
      ]
    },
    {
      "id": "cslez5_6_02_classical_sync",
      "title": "Sequenza delle operazioni sul buffer",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.6.g2.full-initial",
        "m5.6.g2.consumer-order",
        "m5.6.g2.producer-publish",
        "m5.6.g2.spsc-assumption"
      ]
    },
    {
      "id": "cslez5_6_03_classical_sync",
      "title": "Posti occupati, prenotazioni e blocchi",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.6.g3.buffer-values",
        "m5.6.g3.consumer-final-empty",
        "m5.6.g3.wrong-order-deadlock",
        "m5.6.g3.producer-reservation"
      ]
    },
    {
      "id": "cslez5_6_04_classical_sync",
      "title": "Accesso di lettori e scrittori",
      "format": "scelta multipla",
      "variants": [
        "m5.6.g4.reader-concurrency",
        "m5.6.g4.writer-exclusive",
        "m5.6.g4.first-last-reader",
        "m5.6.g4.writer-starvation"
      ]
    },
    {
      "id": "cslez5_6_05_classical_sync",
      "title": "Uscita dei lettori e accesso equo",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.6.g5.invariant-caveat",
        "m5.6.g5.reader-exit-resource",
        "m5.6.g5.fair-admission",
        "m5.6.g5.semaphore-map"
      ]
    }
  ]
});
