'use strict';
SL.catalogo.push({
  "id": "1.4",
  "title": "Interi con segno e complemento a due",
  "units": [
    {
      "id": "1.4.1",
      "title": "Il complemento a due a larghezza fissata",
      "experiment": "Fissa i sette bit inferiori e porta il bit 7 da zero a uno. Confronta le letture con e senza segno delle due parole.",
      "skill": "Interpretare il bit di segno",
      "check": "L’aggiunta del bit alto aumenta di 128 il valore senza segno e diminuisce di 128 il valore in complemento a due. Il contributo degli altri bit resta identico."
    },
    {
      "id": "1.4.2",
      "title": "Somma, sottrazione e overflow",
      "experiment": "Somma 1 prima a 127 e poi a 255. Confronta CF, OF e il byte scritto. Ripeti con la sottrazione per individuare un prestito.",
      "skill": "Distinguere riporto e overflow",
      "check": "CF segue il calcolo senza segno. OF segue quello con segno. Il registro conserva in entrambi i casi gli otto bit bassi."
    },
    {
      "id": "1.4.3",
      "title": "Il linguaggio C: rappresentazione, operazioni e conversioni",
      "experiment": "Confronta −1 con 1u. Mantieni 1u e sostituisci −1 con 0. Leggi il primo operando prima e dopo la conversione.",
      "skill": "Applicare le conversioni aritmetiche del C",
      "check": "Il confronto C si svolge fra due valori senza segno. Un primo operando negativo diventa il suo residuo modulo 2³² e può invertire l’esito rispetto al confronto matematico."
    },
    {
      "id": "1.4.4",
      "title": "Controllare l’aritmetica prima dell’operazione",
      "experiment": "Mantieni B = 16 e confronta A = 15 con A = 16. Prevedi l’esito del controllo usando la divisione intera, poi osserva prodotto e residuo.",
      "skill": "Verificare la moltiplicazione",
      "check": "Il passaggio da un fattore al successivo può portare il prodotto oltre 255. Il residuo a otto bit può allora essere piccolo anche se il prodotto esatto eccede la capacità."
    },
    {
      "id": "1.4.5",
      "title": "Problemi svolti",
      "experiment": "Interpreta 0xF8 come intero con segno a otto bit. Estendilo a sedici bit copiando il bit di segno, poi rileggi il valore.",
      "skill": "Estendere il segno",
      "check": "Il nuovo byte alto contiene otto copie del bit di segno. La parola si allunga e il valore con segno si conserva.",
      "kind": "esercizi"
    },
    {
      "id": "1.4.6",
      "title": "Esercizi",
      "experiment": "Apri «Codificare un numero negativo su otto bit». Determina il residuo fra 0 e 255 e traduci quel residuo in una parola di otto bit.",
      "skill": "Codificare un intero negativo",
      "check": "Una volta scritto il byte, puoi controllarlo attribuendo al bit 7 peso −128. La somma dei pesi deve restituire l’intero della consegna.",
      "kind": "esercizi"
    },
    {
      "id": "1.4.7",
      "title": "Soluzioni",
      "experiment": "Nello svolgimento «Calcolare risultato e flag su un byte» ricostruisci prima il calcolo senza segno, poi rileggi i due operandi con segno.",
      "skill": "Spiegare due interpretazioni della stessa somma",
      "check": "Il byte finale è il residuo modulo 256. Il controllo per CF riguarda riporto o prestito, quello per OF riguarda il superamento dell’intervallo con segno.",
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
