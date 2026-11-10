'use strict';
SL.catalogo.push({
  "id": "2.5",
  "title": "Chiamate di sistema Linux e confine tra utente e kernel",
  "units": [
    {
      "id": "2.5.1",
      "title": "Dalla richiesta dell’utente all’ingresso nel kernel"
    },
    {
      "id": "2.5.2",
      "title": "L’ABI delle syscall Linux x86-64"
    },
    {
      "id": "2.5.3",
      "title": "I/O tramite descrittori di file"
    },
    {
      "id": "2.5.4",
      "title": "Mappature e sostituzione dell’immagine di processo"
    },
    {
      "id": "2.5.5",
      "title": "Identità dei descrittori e stato aperto condiviso"
    },
    {
      "id": "2.5.6",
      "title": "Dall’ingresso nel programma all’uscita del processo"
    },
    {
      "id": "2.5.7",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "2.5.8",
      "title": "Esercizi",
      "kind": "esercizi",
      "provaIniziale": 2
    },
    {
      "id": "2.5.9",
      "title": "Soluzioni",
      "kind": "soluzioni",
      "provaIniziale": 4
    }
  ],
  "pwn": [
    {
      "id": "cslez2_5_01_random_assembly_01",
      "title": "Scrittura sui descrittori e terminazione",
      "format": "assembly",
      "variants": [
        "m2.5.write-stdout",
        "m2.5.write-stderr-no-output",
        "m2.5.exit-constant",
        "m2.5.exit-register"
      ]
    },
    {
      "id": "cslez2_5_02_random_assembly_02",
      "title": "Lettura in un buffer e scrittura di porzioni",
      "format": "assembly",
      "variants": [
        "m2.5.read-buffer",
        "m2.5.read-then-write",
        "m2.5.write-substring",
        "m2.5.write-two-chunks"
      ]
    },
    {
      "id": "cslez2_5_03_random_assembly_03",
      "title": "Lunghezze, stack e posizioni nel buffer",
      "format": "assembly",
      "variants": [
        "m2.5.read-exit-count",
        "m2.5.write-length-register",
        "m2.5.write-stack",
        "m2.5.read-offset"
      ]
    },
    {
      "id": "cslez2_5_04_random_assembly_04",
      "title": "Valori restituiti e trasferimenti di zero byte",
      "format": "assembly",
      "variants": [
        "m2.5.read-and-transform-status",
        "m2.5.write-return-count",
        "m2.5.write-zero",
        "m2.5.read-zero"
      ]
    },
    {
      "id": "cslez2_5_05_random_assembly_05",
      "title": "Sequenze di letture e scritture",
      "format": "assembly",
      "variants": [
        "m2.5.write-choice",
        "m2.5.read-write-prefix",
        "m2.5.exit-after-write",
        "m2.5.read-twice"
      ]
    }
  ]
});
