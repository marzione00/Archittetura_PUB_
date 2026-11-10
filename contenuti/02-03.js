'use strict';
SL.catalogo.push({
  "id": "2.3",
  "title": "Indirizzi, array e disposizione dei dati",
  "units": [
    {
      "id": "2.3.1",
      "title": "Indirizzi, valori e ampiezza degli accessi"
    },
    {
      "id": "2.3.2",
      "title": "Formare un indirizzo efficace"
    },
    {
      "id": "2.3.3",
      "title": "Array e matrici contigue"
    },
    {
      "id": "2.3.4",
      "title": "Strutture, allineamento e riempimento"
    },
    {
      "id": "2.3.5",
      "title": "Validità degli oggetti e aliasing"
    },
    {
      "id": "2.3.6",
      "title": "Codificare e riconoscere i calcoli di indirizzo"
    },
    {
      "id": "2.3.7",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "2.3.8",
      "title": "Esercizi",
      "kind": "esercizi",
      "provaIniziale": 2
    },
    {
      "id": "2.3.9",
      "title": "Soluzioni",
      "kind": "soluzioni",
      "provaIniziale": 1
    }
  ],
  "pwn": [
    {
      "id": "cslez2_3_01_random_assembly_01",
      "title": "Caricamenti di diversa larghezza",
      "format": "assembly",
      "variants": [
        "m2.3.load-qword",
        "m2.3.load-byte",
        "m2.3.load-word",
        "m2.3.load-dword"
      ]
    },
    {
      "id": "cslez2_3_02_random_assembly_02",
      "title": "Scritture e calcolo di indirizzi con LEA",
      "format": "assembly",
      "variants": [
        "m2.3.store-qword",
        "m2.3.store-byte",
        "m2.3.lea-displacement",
        "m2.3.lea-index2"
      ]
    },
    {
      "id": "cslez2_3_03_random_assembly_03",
      "title": "Indici, spiazzamenti e doppia indirezione",
      "format": "assembly",
      "variants": [
        "m2.3.lea-index4-disp",
        "m2.3.array-element",
        "m2.3.double-indirect",
        "m2.3.copy-memory"
      ]
    },
    {
      "id": "cslez2_3_04_random_assembly_04",
      "title": "Scambi e aggiornamenti di elementi",
      "format": "assembly",
      "variants": [
        "m2.3.swap-memory",
        "m2.3.sum-elements",
        "m2.3.increment-element",
        "m2.3.store-indexed"
      ]
    },
    {
      "id": "cslez2_3_05_random_assembly_05",
      "title": "Estremi di array, larghezze e indici",
      "format": "assembly",
      "variants": [
        "m2.3.end-pointer",
        "m2.3.load-selected-width",
        "m2.3.reverse-two",
        "m2.3.byte-to-index"
      ]
    }
  ]
});
