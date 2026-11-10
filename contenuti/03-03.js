'use strict';
SL.catalogo.push({
  "id": "3.3",
  "title": "Il repertorio Y86-64 e le fasi di esecuzione",
  "units": [
    {
      "id": "3.3.1",
      "title": "Dalla logica al contratto dell’ISA"
    },
    {
      "id": "3.3.2",
      "title": "Codifica e confini delle istruzioni"
    },
    {
      "id": "3.3.3",
      "title": "Semantica delle istruzioni e flusso dei dati"
    },
    {
      "id": "3.3.4",
      "title": "Classi di istruzioni, stato e controllo"
    },
    {
      "id": "3.3.5",
      "title": "Tracce complete delle istruzioni"
    },
    {
      "id": "3.3.6",
      "title": "Assemblaggio manuale come verifica"
    },
    {
      "id": "3.3.7",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "3.3.8",
      "title": "Esercizi",
      "kind": "esercizi",
      "provaIniziale": 2
    },
    {
      "id": "3.3.9",
      "title": "Soluzioni",
      "kind": "soluzioni",
      "provaIniziale": 5
    }
  ],
  "pwn": [
    {
      "id": "cslez3_3_01_random_assembly",
      "title": "Decodificare icode e ifun",
      "format": "assembly",
      "variants": [
        "m3.3.b1.icode-high",
        "m3.3.b1.ifun-low",
        "m3.3.b1.opcode-pack",
        "m3.3.b1.needs-regbyte",
        "m3.3.b1.needs-valc",
        "m3.3.b1.invalid-icode",
        "m3.3.b1.low-two-ifun",
        "m3.3.b1.condition-code"
      ]
    },
    {
      "id": "cslez3_3_02_random_assembly",
      "title": "Lunghezza e campi di un’istruzione",
      "format": "assembly",
      "variants": [
        "m3.3.b2.len-halt",
        "m3.3.b2.len-rrmov",
        "m3.3.b2.len-irmov",
        "m3.3.b2.len-jump",
        "m3.3.b2.length-by-regbyte",
        "m3.3.b2.offset-regbyte",
        "m3.3.b2.offset-valc",
        "m3.3.b2.fetch-byte-address"
      ]
    },
    {
      "id": "cslez3_3_03_random_assembly",
      "title": "Registri sorgente e destinazione",
      "format": "assembly",
      "variants": [
        "m3.3.b3.srcA-rrmov",
        "m3.3.b3.srcB-opq",
        "m3.3.b3.none-id",
        "m3.3.b3.srcA-select",
        "m3.3.b3.srcB-select",
        "m3.3.b3.dstE-select",
        "m3.3.b3.dstM-select",
        "m3.3.b3.regbyte-valid"
      ]
    },
    {
      "id": "cslez3_3_04_random_assembly",
      "title": "Operazioni Y86-64 e codici di condizione",
      "format": "assembly",
      "variants": [
        "m3.3.b4.op-add",
        "m3.3.b4.op-sub",
        "m3.3.b4.op-and",
        "m3.3.b4.op-xor",
        "m3.3.b4.op-select",
        "m3.3.b4.zf-add",
        "m3.3.b4.sf-add",
        "m3.3.b4.zf-xor"
      ]
    },
    {
      "id": "cslez3_3_05_random_assembly",
      "title": "Memoria, scrittura dei risultati e aggiornamento del PC",
      "format": "assembly",
      "variants": [
        "m3.3.b5.mem-read-address",
        "m3.3.b5.writeback-e",
        "m3.3.b5.pc-precedence-ret",
        "m3.3.b5.memory-error",
        "m3.3.b5.alignment",
        "m3.3.b5.write-enable",
        "m3.3.b5.read-enable",
        "m3.3.b5.commit-valid"
      ]
    }
  ]
});
