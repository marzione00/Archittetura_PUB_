'use strict';
SL.catalogo.push({
  "id": "4.2",
  "title": "Chiamate di sistema e ingresso controllato nel kernel",
  "units": [
    {
      "id": "4.2.1",
      "title": "Dalla richiesta utente all’esecuzione nel kernel"
    },
    {
      "id": "4.2.2",
      "title": "Il percorso di write oltre il confine di privilegio"
    },
    {
      "id": "4.2.3",
      "title": "Convalida, valori di ritorno e avanzamento parziale"
    },
    {
      "id": "4.2.4",
      "title": "Quando una chiamata di sistema si blocca"
    },
    {
      "id": "4.2.5",
      "title": "Meccanismo, politica e struttura del sistema operativo"
    },
    {
      "id": "4.2.6",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "4.2.7",
      "title": "Esercizi",
      "provaIniziale": 1,
      "kind": "esercizi"
    },
    {
      "id": "4.2.8",
      "title": "Soluzioni",
      "provaIniziale": 4,
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez4_2_01_syscalls_01",
      "title": "Numeri, argomenti e registri delle syscall",
      "format": "scelta multipla",
      "variants": [
        "m4.2.g1.number",
        "m4.2.g1.args",
        "m4.2.g1.return",
        "m4.2.g1.instruction"
      ]
    },
    {
      "id": "cslez4_2_02_syscalls_02",
      "title": "Passaggio dalla modalità utente al kernel",
      "format": "scelta multipla",
      "variants": [
        "m4.2.g2.flow",
        "m4.2.g2.mode",
        "m4.2.g2.hw-save",
        "m4.2.g2.stack-switch"
      ]
    },
    {
      "id": "cslez4_2_03_syscalls_03",
      "title": "Preparare read, write ed exit",
      "format": "scelta multipla",
      "variants": [
        "m4.2.g3.read",
        "m4.2.g3.write",
        "m4.2.g3.exit",
        "m4.2.g3.write-registers"
      ]
    },
    {
      "id": "cslez4_2_04_syscalls_04",
      "title": "Trasferimenti parziali, EOF ed errori",
      "format": "intero",
      "variants": [
        "m4.2.g4.read-result",
        "m4.2.g4.eof",
        "m4.2.g4.errno",
        "m4.2.g4.partial"
      ]
    },
    {
      "id": "cslez4_2_05_syscalls_05",
      "title": "Selezione del servizio e funzione di libreria",
      "format": "scelta multipla",
      "variants": [
        "m4.2.g5.number-stability",
        "m4.2.g5.dispatch",
        "m4.2.g5.wrapper",
        "m4.2.g5.dispatch-order"
      ]
    }
  ]
});
