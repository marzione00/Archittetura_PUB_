'use strict';
SL.catalogo.push({
  "id": "2.6",
  "title": "Procedure, flusso di controllo e analisi del codice macchina",
  "units": [
    {
      "id": "2.6.1",
      "title": "La convenzione delle chiamate di funzione"
    },
    {
      "id": "2.6.2",
      "title": "Frame dello stack e trasferimenti di controllo"
    },
    {
      "id": "2.6.3",
      "title": "Il flusso di controllo dentro una funzione"
    },
    {
      "id": "2.6.4",
      "title": "Leggere una funzione compilata"
    },
    {
      "id": "2.6.5",
      "title": "Argomenti aggregati e chiamate variadiche"
    },
    {
      "id": "2.6.6",
      "title": "Un metodo di analisi del codice macchina"
    },
    {
      "id": "2.6.7",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "2.6.8",
      "title": "Esercizi",
      "kind": "esercizi",
      "provaIniziale": 2
    },
    {
      "id": "2.6.9",
      "title": "Soluzioni",
      "kind": "soluzioni",
      "provaIniziale": 4
    }
  ],
  "pwn": [
    {
      "id": "cslez2_6_01_random_assembly_01",
      "title": "Preprocessore, compilatore e file oggetto",
      "format": "scelta multipla",
      "variants": [
        "m2.6.compile.preprocess",
        "m2.6.compile.S",
        "m2.6.compile.c",
        "m2.6.compile.object"
      ]
    },
    {
      "id": "cslez2_6_02_random_assembly_02",
      "title": "Disassemblaggio, simboli e debugger",
      "format": "scelta multipla",
      "variants": [
        "m2.6.tools.objdump",
        "m2.6.tools.disassemble",
        "m2.6.tools.symbols",
        "m2.6.tools.debugger"
      ]
    },
    {
      "id": "cslez2_6_03_random_assembly_03",
      "title": "Valore restituito, confronti e salti",
      "format": "scelta multipla",
      "variants": [
        "m2.6.disasm.return",
        "m2.6.disasm.compare",
        "m2.6.disasm.memory",
        "m2.6.disasm.branch"
      ]
    },
    {
      "id": "cslez2_6_04_random_assembly_04",
      "title": "Espressioni, array e chiamate",
      "format": "intero / scelta multipla",
      "variants": [
        "m2.6.c.expr",
        "m2.6.c.if",
        "m2.6.c.array",
        "m2.6.c.call"
      ]
    },
    {
      "id": "cslez2_6_05_random_assembly_05",
      "title": "Argomenti e lettura del codice ottimizzato",
      "format": "scelta multipla",
      "variants": [
        "m2.6.abi.args",
        "m2.6.abi.return",
        "m2.6.reverse.goal",
        "m2.6.reverse.optimization"
      ]
    }
  ]
});
