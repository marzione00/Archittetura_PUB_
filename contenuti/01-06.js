'use strict';
SL.catalogo.push({
  "id": "1.6",
  "title": "Numeri frazionari e virgola mobile IEEE 754",
  "units": [
    {
      "id": "1.6.1",
      "title": "Frazioni binarie, scala e precisione",
      "experiment": "Scegli 5 come numeratore della frazione in ottavi. A ogni raddoppio annota il bit estratto e il resto, poi ripeti con un altro numeratore.",
      "skill": "Convertire una frazione esatta",
      "check": "Le tre cifre corrispondono ai pesi 1/2, 1/4 e 1/8. Sommando i pesi attivi si ricostruisce esattamente la frazione iniziale."
    },
    {
      "id": "1.6.2",
      "title": "Il formato IEEE 754",
      "experiment": "Confronta le parole 7F800000 e 7FC00000. Leggi prima il campo esponente e poi la frazione. Ripeti con 00000001 per esaminare un subnormale.",
      "skill": "Leggere i campi di binary32",
      "check": "Due parole con esponente 255 possono avere classi diverse. Con esponente zero cambia anche la regola con cui si interpreta la significanda."
    },
    {
      "id": "1.6.3",
      "title": "Arrotondamento, distanza tra valori e programmi",
      "experiment": "Scegli e = 0 e poi e = 1. In ciascun caso confronta 2ᵉ con il suo successore binary32 e sottrai i due valori.",
      "skill": "Calcolare la spaziatura locale",
      "check": "Incrementare l’esponente di uno raddoppia la distanza dal successore della potenza di due, anche se le due codifiche del singolo esperimento differiscono ancora di una sola unità."
    },
    {
      "id": "1.6.4",
      "title": "Dal formato IEEE al percorso dei dati in virgola mobile",
      "experiment": "Imposta la differenza fra gli esponenti a 23, 24 e 25. Confronta la somma esatta con il valore binary32 scritto dopo l’arrotondamento.",
      "skill": "Tracciare le fasi di un’addizione floating point",
      "check": "A un’intera unità dell’ultima posizione il termine aggiunto è rappresentabile. A metà unità interviene la regola del pareggio; al di sotto di metà si sceglie il valore più vicino."
    },
    {
      "id": "1.6.5",
      "title": "Problemi svolti",
      "experiment": "Confronta le due parole con segno zero ed esponente 255. Muoviti dal campo esponente al campo frazione prima di assegnare la classe.",
      "skill": "Distinguere infinito e NaN",
      "check": "L’esponente colloca entrambe le parole fra i casi speciali. Il confronto fra frazione nulla e frazione diversa da zero determina le due classi.",
      "kind": "esercizi"
    },
    {
      "id": "1.6.6",
      "title": "Esercizi",
      "experiment": "Apri «Perdita di un incremento in binary32». Calcola la somma intera del listato e scegli il valore rappresentabile che verrà scritto in x.",
      "skill": "Codificare una potenza di due",
      "check": "Se due valori binary32 sono equidistanti dalla somma esatta, il bit meno significativo della significanda decide il pareggio. Puoi verificarlo confrontando i due candidati.",
      "kind": "esercizi"
    },
    {
      "id": "1.6.7",
      "title": "Soluzioni",
      "experiment": "Nella soluzione «Decodificare una parola normale binary32» separa segno, esponente e frazione nelle due varianti. Segui la ricostruzione del valore decimale.",
      "skill": "Spiegare una perdita di precisione",
      "check": "Al campo esponente va sottratto 127. Il fattore di segno si applica al prodotto fra significanda e potenza di due, anche nel caso della parola negativa.",
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
