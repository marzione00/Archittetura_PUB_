'use strict';
SL.catalogo.push({
  "id": "3.4",
  "title": "Il processore sequenziale",
  "units": [
    {
      "id": "3.4.1",
      "title": "Dalle fasi dell’ISA a una macchina sincrona"
    },
    {
      "id": "3.4.2",
      "title": "Il percorso dati a ciclo singolo di SEQ"
    },
    {
      "id": "3.4.3",
      "title": "Temporizzazione e aggiornamento dello stato"
    },
    {
      "id": "3.4.4",
      "title": "Equazioni di controllo, traccia e verifica"
    },
    {
      "id": "3.4.5",
      "title": "Oltre SEQ a ciclo singolo"
    },
    {
      "id": "3.4.6",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "3.4.7",
      "title": "Esercizi",
      "kind": "esercizi",
      "provaIniziale": 1
    },
    {
      "id": "3.4.8",
      "title": "Soluzioni",
      "kind": "soluzioni",
      "provaIniziale": 5
    }
  ],
  "pwn": [
    {
      "id": "cslez3_4_01_random_assembly",
      "title": "Ingressi dell’ALU e aggiornamento dello stack",
      "format": "assembly",
      "variants": [
        "m3.4.b1.aluA-valA",
        "m3.4.b1.aluA-minus8",
        "m3.4.b1.aluA-plus8",
        "m3.4.b1.aluB-zero",
        "m3.4.b1.alu-add-inputs",
        "m3.4.b1.alu-sub-inputs",
        "m3.4.b1.push-new-rsp",
        "m3.4.b1.pop-new-rsp"
      ]
    },
    {
      "id": "cslez3_4_02_random_assembly",
      "title": "Indirizzi di memoria e limiti degli accessi",
      "format": "assembly",
      "variants": [
        "m3.4.b2.addr-base-disp",
        "m3.4.b2.addr-index8",
        "m3.4.b2.addr-stack-old",
        "m3.4.b2.addr-stack-new",
        "m3.4.b2.mem-size-qword",
        "m3.4.b2.mem-end",
        "m3.4.b2.mem-align",
        "m3.4.b2.mem-cross-page"
      ]
    },
    {
      "id": "cslez3_4_03_random_assembly",
      "title": "Segnali di controllo di SEQ",
      "format": "assembly",
      "variants": [
        "m3.4.b3.reg-write-e",
        "m3.4.b3.set-cc",
        "m3.4.b3.mem-read",
        "m3.4.b3.mem-write",
        "m3.4.b3.use-valc",
        "m3.4.b3.use-valp",
        "m3.4.b3.pc-src-ret",
        "m3.4.b3.exclusive-memory"
      ]
    },
    {
      "id": "cslez3_4_04_random_assembly",
      "title": "Cammino critico e periodo di clock",
      "format": "assembly",
      "variants": [
        "m3.4.b4.sum-path",
        "m3.4.b4.critical-max",
        "m3.4.b4.clock-period",
        "m3.4.b4.cycles-per-microsecond",
        "m3.4.b4.instruction-time",
        "m3.4.b4.path-fetch-exec",
        "m3.4.b4.path-store",
        "m3.4.b4.slack"
      ]
    },
    {
      "id": "cslez3_4_05_random_assembly",
      "title": "Selezione del PC e stato successivo",
      "format": "assembly",
      "variants": [
        "m3.4.b5.pc-seq",
        "m3.4.b5.pc-jump",
        "m3.4.b5.pc-call",
        "m3.4.b5.rsp-push",
        "m3.4.b5.rsp-pop",
        "m3.4.b5.dst-conditional",
        "m3.4.b5.halt-freeze",
        "m3.4.b5.reset-state"
      ]
    }
  ]
});
