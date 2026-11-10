'use strict';
SL.catalogo.push({
  "id": "3.5",
  "title": "Pipeline: sovrapposizione, capacità di completamento e conflitti",
  "units": [
    {
      "id": "3.5.1",
      "title": "Sovrapposizione, capacità di completamento e latenza"
    },
    {
      "id": "3.5.2",
      "title": "Leggere i diagrammi temporali della pipeline"
    },
    {
      "id": "3.5.3",
      "title": "Conflitti dovuti alla sovrapposizione"
    },
    {
      "id": "3.5.4",
      "title": "Dalla portata ideale al CPI misurato"
    },
    {
      "id": "3.5.5",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "3.5.6",
      "title": "Esercizi",
      "kind": "esercizi",
      "provaIniziale": 4
    },
    {
      "id": "3.5.7",
      "title": "Soluzioni",
      "kind": "soluzioni",
      "provaIniziale": 5
    }
  ],
  "pwn": [
    {
      "id": "cslez3_5_01_random_assembly",
      "title": "Riempimento, svuotamento e cicli di pipeline",
      "format": "assembly",
      "variants": [
        "m3.5.b1.latency-five",
        "m3.5.b1.cycles-n",
        "m3.5.b1.cycles-general",
        "m3.5.b1.fill-cycles",
        "m3.5.b1.drain-extra",
        "m3.5.b1.completion-cycle",
        "m3.5.b1.stage-at-cycle",
        "m3.5.b1.inflight"
      ]
    },
    {
      "id": "cslez3_5_02_random_assembly",
      "title": "Latenza, produttività e accelerazione",
      "format": "assembly",
      "variants": [
        "m3.5.b2.single-time",
        "m3.5.b2.pipe-time",
        "m3.5.b2.speedup-benefit",
        "m3.5.b2.asymptotic-speedup",
        "m3.5.b2.throughput-period",
        "m3.5.b2.clock-max-stage",
        "m3.5.b2.clock-overhead",
        "m3.5.b2.latency-pipe"
      ]
    },
    {
      "id": "cslez3_5_03_random_assembly",
      "title": "Dipendenze di lettura dopo scrittura",
      "format": "assembly",
      "variants": [
        "m3.5.b3.raw-srcA-dstE",
        "m3.5.b3.any-raw",
        "m3.5.b3.none-safe",
        "m3.5.b3.two-producers",
        "m3.5.b3.both-sources",
        "m3.5.b3.dependency-mask",
        "m3.5.b3.dependency-valid",
        "m3.5.b3.branch-dependency"
      ]
    },
    {
      "id": "cslez3_5_04_random_assembly",
      "title": "Conteggio e sovrapposizione degli stalli",
      "format": "assembly",
      "variants": [
        "m3.5.b4.raw-delay",
        "m3.5.b4.raw-present",
        "m3.5.b4.two-sources",
        "m3.5.b4.dependency-count",
        "m3.5.b4.control-gap",
        "m3.5.b4.stall-total",
        "m3.5.b4.stall-overlap",
        "m3.5.b4.cpi-from-stalls"
      ]
    },
    {
      "id": "cslez3_5_05_random_assembly",
      "title": "Distanza tra istruzioni dipendenti",
      "format": "assembly",
      "variants": [
        "m3.5.b5.independent-between",
        "m3.5.b5.sequence-length",
        "m3.5.b5.pipeline-cycles",
        "m3.5.b5.speedup-loss",
        "m3.5.b5.safe-distance",
        "m3.5.b5.independent-flag",
        "m3.5.b5.latency-throughput",
        "m3.5.b5.completion-cycle"
      ]
    }
  ]
});
