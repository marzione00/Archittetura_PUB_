'use strict';
SL.catalogo.push({
  "id": "2.4",
  "title": "Operazioni bit a bit, scorrimenti e maschere",
  "units": [
    {
      "id": "2.4.1",
      "title": "Maschere e scorrimenti come operazioni macchina"
    },
    {
      "id": "2.4.2",
      "title": "Un solo bit a uno in posizione k"
    },
    {
      "id": "2.4.3",
      "title": "Impacchettare campi e costruire valori vincolati"
    },
    {
      "id": "2.4.4",
      "title": "Derivare le maschere di campo"
    },
    {
      "id": "2.4.5",
      "title": "Comporre una parola nel formato di un’istruzione"
    },
    {
      "id": "2.4.6",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "2.4.7",
      "title": "Esercizi",
      "kind": "esercizi",
      "provaIniziale": 4
    },
    {
      "id": "2.4.8",
      "title": "Soluzioni",
      "kind": "soluzioni",
      "provaIniziale": 5
    }
  ],
  "pwn": [
    {
      "id": "cslez2_4_01_random_assembly_01",
      "title": "Maschere per byte e singoli bit",
      "format": "assembly",
      "variants": [
        "m2.4.keep-low-byte",
        "m2.4.keep-high-nibble",
        "m2.4.extract-bit5",
        "m2.4.set-bit7"
      ]
    },
    {
      "id": "cslez2_4_02_random_assembly_02",
      "title": "Modificare bit e combinare semibyte",
      "format": "assembly",
      "variants": [
        "m2.4.clear-bit3",
        "m2.4.toggle-bit2",
        "m2.4.merge-nibbles",
        "m2.4.swap-nibbles"
      ]
    },
    {
      "id": "cslez2_4_03_random_assembly_03",
      "title": "XOR, inversioni e scorrimenti",
      "format": "assembly",
      "variants": [
        "m2.4.xor-mask",
        "m2.4.invert-byte",
        "m2.4.logical-shift",
        "m2.4.left-shift-mask"
      ]
    },
    {
      "id": "cslez2_4_04_random_assembly_04",
      "title": "Estrarre, inserire e verificare campi",
      "format": "assembly",
      "variants": [
        "m2.4.field-extract",
        "m2.4.field-insert",
        "m2.4.test-any",
        "m2.4.test-all"
      ]
    },
    {
      "id": "cslez2_4_05_random_assembly_05",
      "title": "Allineamento, potenze di due e flag",
      "format": "assembly",
      "variants": [
        "m2.4.power-two",
        "m2.4.align-down",
        "m2.4.round-up16",
        "m2.4.compose-flags"
      ]
    }
  ]
});
