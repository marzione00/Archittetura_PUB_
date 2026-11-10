'use strict';
SL.catalogo.push({
  "id": "1.5",
  "title": "Circuiti booleani e calcolo a livello di bit",
  "units": [
    {
      "id": "1.5.1",
      "title": "Funzioni booleane e porte elementari"
    },
    {
      "id": "1.5.2",
      "title": "Dalla tabella di verità al circuito"
    },
    {
      "id": "1.5.3",
      "title": "Vettori di bit, maschere e operatori del C"
    },
    {
      "id": "1.5.4",
      "title": "Tempi, propagazione e impulsi transitori"
    },
    {
      "id": "1.5.5",
      "title": "Dalle porte all’aritmetica"
    },
    {
      "id": "1.5.6",
      "title": "Ragionamento booleano nel codice di sistema"
    },
    {
      "id": "1.5.7",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "1.5.8",
      "provaIniziale": 4,
      "title": "Esercizi",
      "kind": "esercizi"
    },
    {
      "id": "1.5.9",
      "provaIniziale": 1,
      "title": "Soluzioni",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "lez05_01_single_gate",
      "title": "Calcolare l’uscita delle porte",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.5.gate.and",
        "m1.5.gate.compose",
        "m1.5.gate.de-morgan-one",
        "m1.5.gate.de-morgan-two",
        "m1.5.gate.nand",
        "m1.5.gate.nor",
        "m1.5.gate.not",
        "m1.5.gate.or"
      ]
    },
    {
      "id": "lez05_02_bitwise_on_bytes",
      "title": "Operazioni bit a bit su un byte",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.5.bytes.extract-field",
        "m1.5.bytes.count-ones",
        "m1.5.bytes.test-bit",
        "m1.5.bytes.and",
        "m1.5.bytes.not",
        "m1.5.bytes.or",
        "m1.5.bytes.xor",
        "m1.5.bytes.clear-low"
      ]
    },
    {
      "id": "lez05_03_identify_gate",
      "title": "Riconoscere una porta dalla sua tabella",
      "format": "scelta multipla",
      "variants": [
        "m1.5.ident.from-table",
        "m1.5.ident.parity",
        "m1.5.ident.active-low-and",
        "m1.5.ident.all-zero-detector",
        "m1.5.ident.output-vector-or",
        "m1.5.ident.universal-choice",
        "m1.5.ident.all-zero",
        "m1.5.ident.any-zero"
      ]
    },
    {
      "id": "lez05_04_c_bitwise_expression",
      "title": "Espressioni e maschere in C",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.5.c.field-update",
        "m1.5.c.and",
        "m1.5.c.clear",
        "m1.5.c.clear-field",
        "m1.5.c.combine",
        "m1.5.c.extract",
        "m1.5.c.mask-test",
        "m1.5.c.not"
      ]
    },
    {
      "id": "lez05_05_truth_table_rows",
      "title": "Costruire una tabella di verità",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.5.truth.construct",
        "m1.5.truth.infer-inputs",
        "m1.5.truth.output-column-size",
        "m1.5.truth.output-vector",
        "m1.5.truth.row-index",
        "m1.5.truth.and-ones",
        "m1.5.truth.enumerate2",
        "m1.5.truth.functions2"
      ]
    }
  ]
});
