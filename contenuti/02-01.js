'use strict';
SL.catalogo.push({
  "id": "2.1",
  "title": "Stato della macchina, registri e memoria",
  "units": [
    {
      "id": "2.1.1",
      "title": "Stato architetturale ed esecuzione"
    },
    {
      "id": "2.1.2",
      "title": "Registri, indirizzi e memoria"
    },
    {
      "id": "2.1.3",
      "title": "Lettura di brevi sequenze di istruzioni"
    },
    {
      "id": "2.1.4",
      "title": "Stato architetturale, implementazione e prestazioni"
    },
    {
      "id": "2.1.5",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "2.1.6",
      "title": "Esercizi",
      "kind": "esercizi",
      "provaIniziale": 1
    },
    {
      "id": "2.1.7",
      "title": "Soluzioni",
      "kind": "soluzioni",
      "provaIniziale": 4
    }
  ],
  "pwn": [
    {
      "id": "cslez2_1_01_random_assembly_01",
      "title": "Registri, ALU e unità di controllo",
      "format": "scelta multipla",
      "variants": [
        "m2.1.cpu.datapath",
        "m2.1.cpu.alu",
        "m2.1.cpu.control",
        "m2.1.cpu.pc"
      ]
    },
    {
      "id": "cslez2_1_02_random_assembly_02",
      "title": "Periodo di clock, cicli e CPI",
      "format": "decimale / intero / scelta multipla",
      "variants": [
        "m2.1.perf.period",
        "m2.1.perf.cpi-time",
        "m2.1.perf.compare",
        "m2.1.perf.cycles"
      ]
    },
    {
      "id": "cslez2_1_03_random_assembly_03",
      "title": "Tecnologie della gerarchia di memoria",
      "format": "scelta multipla",
      "variants": [
        "m2.1.mem.order",
        "m2.1.mem.volatility",
        "m2.1.mem.cache-tech",
        "m2.1.mem.main-tech"
      ]
    },
    {
      "id": "cslez2_1_04_random_assembly_04",
      "title": "Cache, indirizzi e località",
      "format": "intero / scelta multipla",
      "variants": [
        "m2.1.mem.addresses",
        "m2.1.mem.hit-path",
        "m2.1.mem.locality",
        "m2.1.mem.spatial"
      ]
    },
    {
      "id": "cslez2_1_05_random_assembly_05",
      "title": "Bus, indirizzi e trasferimenti di dati",
      "format": "intero / scelta multipla",
      "variants": [
        "m2.1.bus.address",
        "m2.1.bus.data",
        "m2.1.bus.width",
        "m2.1.isa"
      ]
    }
  ]
});
