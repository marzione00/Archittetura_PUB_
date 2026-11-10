'use strict';
SL.catalogo.push({
  "id": "1.6",
  "title": "Numeri frazionari e virgola mobile IEEE 754",
  "units": [
    {
      "id": "1.6.1",
      "title": "Frazioni binarie, scala e precisione"
    },
    {
      "id": "1.6.2",
      "title": "Il formato IEEE 754"
    },
    {
      "id": "1.6.3",
      "title": "Arrotondamento, distanza tra valori e programmi"
    },
    {
      "id": "1.6.4",
      "title": "Dal formato IEEE al percorso dei dati in virgola mobile"
    },
    {
      "id": "1.6.5",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "1.6.6",
      "provaIniziale": 5,
      "title": "Esercizi",
      "kind": "esercizi"
    },
    {
      "id": "1.6.7",
      "provaIniziale": 4,
      "title": "Soluzioni",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "lez06_01_fractional_binary",
      "title": "Frazioni binarie e pesi posizionali",
      "format": "decimale / intero / scelta multipla",
      "variants": [
        "m1.6.frac.convert-method",
        "m1.6.frac.shift-left",
        "m1.6.frac.shift-right",
        "m1.6.frac.direct",
        "m1.6.frac.decompose",
        "m1.6.frac.second-place-denominator",
        "m1.6.frac.append-bit",
        "m1.6.frac.bit-weight"
      ]
    },
    {
      "id": "lez06_02_exact_or_approx",
      "title": "Rappresentazione esatta e approssimazione",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.6.exact.error-analysis",
        "m1.6.exact.blocking-factor",
        "m1.6.exact.exponent-range",
        "m1.6.exact.precision-range",
        "m1.6.exact.binary-friendly",
        "m1.6.exact.repeated-sum",
        "m1.6.exact.cancellation",
        "m1.6.exact.comparison"
      ]
    },
    {
      "id": "lez06_03_normalize_binary",
      "title": "Normalizzazione ed esponente con bias",
      "format": "decimale / intero / scelta multipla",
      "variants": [
        "m1.6.norm.algorithm",
        "m1.6.norm.reconstruct",
        "m1.6.norm.bias-purpose",
        "m1.6.norm.double-bias",
        "m1.6.norm.encode-exp",
        "m1.6.norm.exponent",
        "m1.6.norm.single-bias",
        "m1.6.norm.unbias"
      ]
    },
    {
      "id": "lez06_04_ieee754_single_decode",
      "title": "Leggere un numero IEEE 754 a precisione singola",
      "format": "decimale / intero / scelta multipla",
      "variants": [
        "m1.6.ieee.decode-order",
        "m1.6.ieee.decode-one",
        "m1.6.ieee.exp-bits",
        "m1.6.ieee.frac-bits",
        "m1.6.ieee.precision-bits",
        "m1.6.ieee.sign-bits",
        "m1.6.ieee.exp-field-1",
        "m1.6.ieee.unbiased-half"
      ]
    },
    {
      "id": "lez06_05_c_float_pitfalls",
      "title": "Precisione delle operazioni in C",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.6.cfp.robust-compare",
        "m1.6.cfp.cancellation",
        "m1.6.cfp.cast-loss",
        "m1.6.cfp.accumulation",
        "m1.6.cfp.assoc",
        "m1.6.cfp.eq-tenth",
        "m1.6.cfp.int-exact-range",
        "m1.6.cfp.large-small"
      ]
    }
  ]
});
