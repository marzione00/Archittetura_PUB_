'use strict';
SL.catalogo.push({
  "id": "5.4",
  "title": "Thread, concorrenza ed esecuzione parallela",
  "units": [
    {
      "id": "5.4.1",
      "title": "Memoria condivisa e registri dei thread"
    },
    {
      "id": "5.4.2",
      "title": "Concorrenza ed esecuzione simultanea"
    },
    {
      "id": "5.4.3",
      "title": "Chi decide quale thread eseguire?"
    },
    {
      "id": "5.4.4",
      "title": "Argomenti e raccolta dei thread POSIX"
    },
    {
      "id": "5.4.5",
      "title": "Isolamento dei guasti in processi e thread"
    },
    {
      "id": "5.4.6",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "5.4.7",
      "provaIniziale": 1,
      "title": "Esercizi",
      "kind": "esercizi"
    },
    {
      "id": "5.4.8",
      "provaIniziale": 4,
      "title": "Soluzioni",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez5_4_01_threads",
      "title": "Risorse condivise e stato privato",
      "format": "scelta multipla",
      "variants": [
        "m5.4.g1.heap",
        "m5.4.g1.stack",
        "m5.4.g1.registers",
        "m5.4.g1.open-files"
      ]
    },
    {
      "id": "cslez5_4_02_threads",
      "title": "Concorrenza, parallelismo e isolamento",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.4.g2.concurrent-not-parallel",
        "m5.4.g2.max-parallel-two-cores",
        "m5.4.g2.untrusted-plugins",
        "m5.4.g2.shared-work-queue"
      ]
    },
    {
      "id": "cslez5_4_03_threads",
      "title": "Modelli di associazione tra thread",
      "format": "scelta multipla",
      "variants": [
        "m5.4.g3.many-one-block",
        "m5.4.g3.many-one-cores",
        "m5.4.g3.kernel-block",
        "m5.4.g3.many-many"
      ]
    },
    {
      "id": "cslez5_4_04_threads",
      "title": "Creazione, join e durata degli argomenti",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.4.g4.pthread-create",
        "m5.4.g4.pthread-join",
        "m5.4.g4.loop-variable",
        "m5.4.g4.array-lifetime"
      ]
    },
    {
      "id": "cslez5_4_05_threads",
      "title": "Stack, cambi di thread e isolamento dei guasti",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.4.g5.one-address-space",
        "m5.4.g5.five-stacks",
        "m5.4.g5.thread-switch",
        "m5.4.g5.fault-isolation"
      ]
    }
  ]
});
