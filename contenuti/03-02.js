'use strict';
SL.catalogo.push({
  "id": "3.2",
  "title": "Logica sequenziale: stato, registri e memoria",
  "units": [
    {
      "id": "3.2.1",
      "title": "Dalla logica combinatoria allo stato memorizzato"
    },
    {
      "id": "3.2.2",
      "title": "Latch, flip-flop e clock"
    },
    {
      "id": "3.2.3",
      "title": "Registri, banchi di registri e memoria"
    },
    {
      "id": "3.2.4",
      "title": "Il modello sincrono e i limiti temporali"
    },
    {
      "id": "3.2.5",
      "title": "Dallo stato memorizzato alle macchine a stati"
    },
    {
      "id": "3.2.6",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "3.2.7",
      "title": "Esercizi",
      "kind": "esercizi",
      "provaIniziale": 3
    },
    {
      "id": "3.2.8",
      "title": "Soluzioni",
      "kind": "soluzioni",
      "provaIniziale": 5
    }
  ],
  "pwn": [
    {
      "id": "cslez3_2_01_random_assembly",
      "title": "Stati e ingressi di un latch SR",
      "format": "assembly",
      "variants": [
        "m3.2.b1.sr-hold",
        "m3.2.b1.sr-set",
        "m3.2.b1.sr-forbidden",
        "m3.2.b1.sr-valid",
        "m3.2.b1.sr-equation",
        "m3.2.b1.d-from-sr-reset",
        "m3.2.b1.d-no-forbidden",
        "m3.2.b1.state-pair-valid"
      ]
    },
    {
      "id": "cslez3_2_02_random_assembly",
      "title": "Trasparenza e abilitazione del latch D",
      "format": "assembly",
      "variants": [
        "m3.2.b2.d-transparent",
        "m3.2.b2.d-closed-hold",
        "m3.2.b2.d-general",
        "m3.2.b2.d-active-low",
        "m3.2.b2.d-reset",
        "m3.2.b2.d-set-reset",
        "m3.2.b2.d-enable-reset",
        "m3.2.b2.change-detect"
      ]
    },
    {
      "id": "cslez3_2_03_random_assembly",
      "title": "Acquisizione sul fronte di clock",
      "format": "assembly",
      "variants": [
        "m3.2.b3.edge-rising",
        "m3.2.b3.no-edge",
        "m3.2.b3.dff-rising",
        "m3.2.b3.dff-reset",
        "m3.2.b3.dff-enable",
        "m3.2.b3.edge-any",
        "m3.2.b3.capture-invert",
        "m3.2.b3.capture-xor"
      ]
    },
    {
      "id": "cslez3_2_04_random_assembly",
      "title": "Caricamento e modifica di un registro a quattro bit",
      "format": "assembly",
      "variants": [
        "m3.2.b4.load4",
        "m3.2.b4.clear4",
        "m3.2.b4.load-clear4",
        "m3.2.b4.parallel-load-mask",
        "m3.2.b4.set-bits",
        "m3.2.b4.clear-bits",
        "m3.2.b4.increment4",
        "m3.2.b4.shift-left-in"
      ]
    },
    {
      "id": "cslez3_2_05_random_assembly",
      "title": "Aggiornamenti paralleli e priorità dei comandi",
      "format": "assembly",
      "variants": [
        "m3.2.b5.parallel-load",
        "m3.2.b5.sync-clear",
        "m3.2.b5.clear-load-priority",
        "m3.2.b5.masked-update",
        "m3.2.b5.bit-enable",
        "m3.2.b5.two-register-sample",
        "m3.2.b5.change-flag",
        "m3.2.b5.parallel-capture"
      ]
    }
  ]
});
