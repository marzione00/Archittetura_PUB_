'use strict';
SL.catalogo.push({
  "id": "5.2",
  "title": "Creazione dei processi, sostituzione del programma e terminazione",
  "units": [
    {
      "id": "5.2.1",
      "title": "Creazione per duplicazione"
    },
    {
      "id": "5.2.2",
      "title": "Avvio di un comando e redirezione dell’uscita"
    },
    {
      "id": "5.2.3",
      "title": "Sostituire il programma di un processo"
    },
    {
      "id": "5.2.4",
      "title": "Attesa, terminazione e registrazione finale del processo"
    },
    {
      "id": "5.2.5",
      "title": "Fork in un processo multithread"
    },
    {
      "id": "5.2.6",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "5.2.7",
      "provaIniziale": 1,
      "title": "Esercizi",
      "kind": "esercizi"
    },
    {
      "id": "5.2.8",
      "provaIniziale": 5,
      "title": "Soluzioni",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez5_2_01_process_control",
      "title": "Valori restituiti da fork",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.2.g1.return-values",
        "m5.2.g1.fork-failure",
        "m5.2.g1.one-fork-processes",
        "m5.2.g1.wait-branch-count"
      ]
    },
    {
      "id": "cslez5_2_02_process_control",
      "title": "Risorse ereditate e copia su scrittura",
      "format": "scelta multipla",
      "variants": [
        "m5.2.g2.private-global",
        "m5.2.g2.shared-open-description",
        "m5.2.g2.cow-write",
        "m5.2.g2.pipe-inheritance"
      ]
    },
    {
      "id": "cslez5_2_03_process_control",
      "title": "Sostituzione del programma con exec",
      "format": "scelta multipla",
      "variants": [
        "m5.2.g3.exec-no-create",
        "m5.2.g3.pid-preserved",
        "m5.2.g3.no-return",
        "m5.2.g3.cloexec"
      ]
    },
    {
      "id": "cslez5_2_04_process_control",
      "title": "Terminazione, wait e processi zombie",
      "format": "scelta multipla",
      "variants": [
        "m5.2.g4.zombie",
        "m5.2.g4.orphan",
        "m5.2.g4.wait-purpose",
        "m5.2.g4.status-interpretation"
      ]
    },
    {
      "id": "cslez5_2_05_process_control",
      "title": "Fork condizionali e sequenze della shell",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.2.g5.shell-order",
        "m5.2.g5.exec-failure-exit",
        "m5.2.g5.conditional-fork",
        "m5.2.g5.child-exec-branch"
      ]
    }
  ]
});
