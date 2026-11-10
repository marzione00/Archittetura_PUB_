'use strict';
SL.catalogo.push({
  "id": "3.1",
  "title": "Logica combinatoria: dalle tabelle di verità all’ALU",
  "units": [
    {
      "id": "3.1.1",
      "title": "Dalla specifica booleana ai blocchi del percorso dati"
    },
    {
      "id": "3.1.2",
      "title": "Selezionare un ingresso con un multiplexer"
    },
    {
      "id": "3.1.3",
      "title": "Aritmetica e costruzione dell’ALU"
    },
    {
      "id": "3.1.4",
      "title": "Dai blocchi combinatori al controllo del processore"
    },
    {
      "id": "3.1.5",
      "title": "Tempi, costo e realizzazione fisica"
    },
    {
      "id": "3.1.6",
      "title": "Implementazioni alternative e flag di stato"
    },
    {
      "id": "3.1.7",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "3.1.8",
      "title": "Esercizi",
      "kind": "esercizi",
      "provaIniziale": 1
    },
    {
      "id": "3.1.9",
      "title": "Soluzioni",
      "kind": "soluzioni",
      "provaIniziale": 4
    }
  ],
  "pwn": [
    {
      "id": "cslez3_1_01_random_assembly",
      "title": "Funzioni booleane di uno o più ingressi",
      "format": "assembly",
      "variants": [
        "m3.1.b1.not-x",
        "m3.1.b1.and-xy",
        "m3.1.b1.xor-xy",
        "m3.1.b1.nand-xy",
        "m3.1.b1.majority",
        "m3.1.b1.parity3",
        "m3.1.b1.exactly-one",
        "m3.1.b1.implication"
      ]
    },
    {
      "id": "cslez3_1_02_random_assembly",
      "title": "Selezione dei dati con multiplexer",
      "format": "assembly",
      "variants": [
        "m3.1.b2.mux2",
        "m3.1.b2.mux2-inverted",
        "m3.1.b2.select-four",
        "m3.1.b2.bit-select",
        "m3.1.b2.mask-select",
        "m3.1.b2.route-parity",
        "m3.1.b2.conditional-invert",
        "m3.1.b2.choose-min"
      ]
    },
    {
      "id": "cslez3_1_03_random_assembly",
      "title": "Somme, differenze e riporti",
      "format": "assembly",
      "variants": [
        "m3.1.b3.packed-half",
        "m3.1.b3.packed-full",
        "m3.1.b3.increment4",
        "m3.1.b3.add4",
        "m3.1.b3.carry4",
        "m3.1.b3.sub4",
        "m3.1.b3.borrow4",
        "m3.1.b3.sum-select"
      ]
    },
    {
      "id": "cslez3_1_04_random_assembly",
      "title": "Operazioni e segnali di uscita dell’ALU",
      "format": "assembly",
      "variants": [
        "m3.1.b4.alu-add-sub",
        "m3.1.b4.alu-and-or",
        "m3.1.b4.alu-four",
        "m3.1.b4.alu-shifts",
        "m3.1.b4.alu-compare",
        "m3.1.b4.alu-zero",
        "m3.1.b4.alu-carry",
        "m3.1.b4.alu-output-pack"
      ]
    },
    {
      "id": "cslez3_1_05_random_assembly",
      "title": "Transizioni e stato di un latch SR",
      "format": "assembly",
      "variants": [
        "m3.1.b5.sr-set",
        "m3.1.b5.sr-reset",
        "m3.1.b5.sr-general",
        "m3.1.b5.valid-state",
        "m3.1.b5.sr-hold",
        "m3.1.b5.sr-forbidden",
        "m3.1.b5.sr-transition",
        "m3.1.b5.sr-qbar"
      ]
    }
  ]
});
