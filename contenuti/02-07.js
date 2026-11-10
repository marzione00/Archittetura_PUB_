'use strict';
SL.catalogo.push({
  "id": "2.7",
  "title": "Frame dello stack, sicurezza della memoria e riuso del flusso di controllo",
  "units": [
    {
      "id": "2.7.1",
      "title": "I frame dello stack come convenzioni"
    },
    {
      "id": "2.7.2",
      "title": "Dalla scrittura fuori limite ai dati di controllo"
    },
    {
      "id": "2.7.3",
      "title": "Protezioni e loro limiti"
    },
    {
      "id": "2.7.4",
      "title": "Riuso del flusso di controllo"
    },
    {
      "id": "2.7.5",
      "title": "Ottimizzazioni dello stack e dettagli ABI"
    },
    {
      "id": "2.7.6",
      "title": "Stack ombra e protezioni complementari"
    },
    {
      "id": "2.7.7",
      "title": "Verifiche per una revisione di sicurezza della memoria"
    },
    {
      "id": "2.7.8",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "2.7.9",
      "title": "Esercizi",
      "kind": "esercizi",
      "provaIniziale": 1
    },
    {
      "id": "2.7.10",
      "title": "Soluzioni",
      "kind": "soluzioni",
      "provaIniziale": 5
    }
  ],
  "pwn": [
    {
      "id": "cslez2_7_01_random_assembly_01",
      "title": "Operazioni sulla cima dello stack",
      "format": "assembly",
      "variants": [
        "m2.7.push-pop",
        "m2.7.swap-top",
        "m2.7.sum-top",
        "m2.7.peek-top"
      ]
    },
    {
      "id": "cslez2_7_02_random_assembly_02",
      "title": "Spazio locale e prologo di funzione",
      "format": "assembly",
      "variants": [
        "m2.7.discard-top",
        "m2.7.allocate-local",
        "m2.7.deallocate-local",
        "m2.7.frame-prologue"
      ]
    },
    {
      "id": "cslez2_7_03_random_assembly_03",
      "title": "Epilogo, variabili locali e chiamate",
      "format": "assembly",
      "variants": [
        "m2.7.frame-epilogue",
        "m2.7.local-store-rbp",
        "m2.7.stack-argument",
        "m2.7.call-helper"
      ]
    },
    {
      "id": "cslez2_7_04_random_assembly_04",
      "title": "Ordine e duplicazione dei valori sullo stack",
      "format": "assembly",
      "variants": [
        "m2.7.push-order",
        "m2.7.duplicate-top",
        "m2.7.replace-top",
        "m2.7.reverse-three"
      ]
    },
    {
      "id": "cslez2_7_05_random_assembly_05",
      "title": "Allineamento, registri salvati e indirizzo di ritorno",
      "format": "assembly",
      "variants": [
        "m2.7.align-stack",
        "m2.7.save-two-registers",
        "m2.7.return-address-observe",
        "m2.7.manual-push"
      ]
    }
  ]
});
