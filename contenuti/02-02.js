'use strict';
SL.catalogo.push({
  "id": "2.2",
  "title": "Aritmetica intera e flag di condizione",
  "units": [
    {
      "id": "2.2.1",
      "title": "Larghezza, segno e aritmetica a precisione fissa"
    },
    {
      "id": "2.2.2",
      "title": "Un’espressione in tre registri: a × b + c"
    },
    {
      "id": "2.2.3",
      "title": "Moltiplicazione, divisione e calcolo dell’indirizzo efficace"
    },
    {
      "id": "2.2.4",
      "title": "Combinare i fattori di scala: 7a + 3b − 4"
    },
    {
      "id": "2.2.5",
      "title": "Leggere il contratto di un’istruzione"
    },
    {
      "id": "2.2.6",
      "title": "Flag di condizione e larghezza"
    },
    {
      "id": "2.2.7",
      "title": "Traduzione completa di un calcolo aritmetico"
    },
    {
      "id": "2.2.8",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "2.2.9",
      "title": "Esercizi",
      "kind": "esercizi",
      "provaIniziale": 1
    },
    {
      "id": "2.2.10",
      "title": "Soluzioni",
      "kind": "soluzioni",
      "provaIniziale": 5
    }
  ],
  "pwn": [
    {
      "id": "cslez2_2_01_random_assembly_01",
      "title": "Copia e aritmetica nei registri",
      "format": "assembly",
      "variants": [
        "m2.2.copy",
        "m2.2.add2",
        "m2.2.sub2",
        "m2.2.mul3"
      ]
    },
    {
      "id": "cslez2_2_02_random_assembly_02",
      "title": "Incrementi, somme e combinazioni lineari",
      "format": "assembly",
      "variants": [
        "m2.2.inc",
        "m2.2.dec",
        "m2.2.sum3",
        "m2.2.lincomb"
      ]
    },
    {
      "id": "cslez2_2_03_random_assembly_03",
      "title": "Differenze e operazioni logiche",
      "format": "assembly",
      "variants": [
        "m2.2.difference-sum",
        "m2.2.and",
        "m2.2.or",
        "m2.2.xor"
      ]
    },
    {
      "id": "cslez2_2_04_random_assembly_04",
      "title": "Complemento, scorrimenti e uguaglianza",
      "format": "assembly",
      "variants": [
        "m2.2.not",
        "m2.2.shift-left",
        "m2.2.shift-right",
        "m2.2.eq"
      ]
    },
    {
      "id": "cslez2_2_05_random_assembly_05",
      "title": "Confronti e selezione condizionale",
      "format": "assembly",
      "variants": [
        "m2.2.ltu",
        "m2.2.max",
        "m2.2.conditional",
        "m2.2.absdiff"
      ]
    }
  ]
});
