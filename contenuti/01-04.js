'use strict';
SL.catalogo.push({
  "id": "1.4",
  "title": "Interi con segno e complemento a due",
  "units": [
    {
      "id": "1.4.1",
      "title": "Il complemento a due a larghezza fissata"
    },
    {
      "id": "1.4.2",
      "title": "Somma, sottrazione e overflow"
    },
    {
      "id": "1.4.3",
      "title": "Il linguaggio C: rappresentazione, operazioni e conversioni"
    },
    {
      "id": "1.4.4",
      "title": "Controllare l’aritmetica prima dell’operazione"
    },
    {
      "id": "1.4.5",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "1.4.6",
      "provaIniziale": 1,
      "title": "Esercizi",
      "kind": "esercizi"
    },
    {
      "id": "1.4.7",
      "provaIniziale": 4,
      "title": "Soluzioni",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "lez04_01_encode_negative_twos",
      "title": "Codificare interi negativi",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.4.enc.algorithm-order",
        "m1.4.enc.sign-extension-count",
        "m1.4.enc.min-width-neg",
        "m1.4.enc.add-one-step",
        "m1.4.enc.invert-step",
        "m1.4.enc.sign-bit",
        "m1.4.enc.direct-neg",
        "m1.4.enc.extend-positive"
      ]
    },
    {
      "id": "lez04_02_decode_twos",
      "title": "Decodificare il complemento a due",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.4.dec.algorithm-order",
        "m1.4.dec.minimum-absolute",
        "m1.4.dec.all-ones",
        "m1.4.dec.direct-negative",
        "m1.4.dec.hex-negative",
        "m1.4.dec.sixteen-bit",
        "m1.4.dec.two-bit",
        "m1.4.dec.unsigned-comparison"
      ]
    },
    {
      "id": "lez04_03_signed_range",
      "title": "Intervallo degli interi con segno",
      "format": "intero",
      "variants": [
        "m1.4.range.overlap",
        "m1.4.range.count8",
        "m1.4.range.formula-max",
        "m1.4.range.formula-min",
        "m1.4.range.negative-count4",
        "m1.4.range.nonnegative-count4",
        "m1.4.range.excess200",
        "m1.4.range.max16"
      ]
    },
    {
      "id": "lez04_04_fixed_width_add_sub",
      "title": "Somma e sottrazione a larghezza fissa",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.4.fixed.sub-procedure",
        "m1.4.fixed.repeated-add",
        "m1.4.fixed.signed-add",
        "m1.4.fixed.signed-sub",
        "m1.4.fixed.wrap-sub",
        "m1.4.fixed.carry-out",
        "m1.4.fixed.low-byte",
        "m1.4.fixed.modulus"
      ]
    },
    {
      "id": "lez04_05_overflow_detector",
      "title": "Rilevare il traboccamento",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.4.ov.check-add",
        "m1.4.ov.safe-sum-value",
        "m1.4.ov.wrapped-pattern-value",
        "m1.4.ov.boundary-headroom",
        "m1.4.ov.result-pattern",
        "m1.4.ov.sign-detection",
        "m1.4.ov.signed-vs-carry",
        "m1.4.ov.compiler-language"
      ]
    }
  ]
});
