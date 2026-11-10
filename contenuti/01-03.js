'use strict';
SL.catalogo.push({
  "id": "1.3",
  "title": "Codificare testo, immagini e suoni",
  "units": [
    {
      "id": "1.3.1",
      "title": "La codifica come accordo tra significato e byte"
    },
    {
      "id": "1.3.2",
      "title": "Unicode, punti di codice e UTF-8"
    },
    {
      "id": "1.3.3",
      "title": "Dimensionare una registrazione PCM"
    },
    {
      "id": "1.3.4",
      "title": "Formati binari, validazione e contesto"
    },
    {
      "id": "1.3.5",
      "title": "Un metodo per decodificare i dati"
    },
    {
      "id": "1.3.6",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "1.3.7",
      "provaIniziale": 4,
      "title": "Esercizi",
      "kind": "esercizi"
    },
    {
      "id": "1.3.8",
      "provaIniziale": 5,
      "title": "Soluzioni",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "lez03_01_same_bits_two_meanings",
      "title": "Interpretare una sequenza di bit",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.3.meaning.two-bytes",
        "m1.3.meaning.byte-range",
        "m1.3.meaning.unsigned",
        "m1.3.meaning.boolean-vector",
        "m1.3.meaning.file-format",
        "m1.3.meaning.ascii",
        "m1.3.meaning.context",
        "m1.3.meaning.metadata"
      ]
    },
    {
      "id": "lez03_02_ascii_hex_string",
      "title": "Stringhe ASCII in esadecimale",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.3.ascii.c-length",
        "m1.3.ascii.length",
        "m1.3.ascii.numeric-digit",
        "m1.3.ascii.offset",
        "m1.3.ascii.encode-word",
        "m1.3.ascii.hex-text",
        "m1.3.ascii.concat",
        "m1.3.ascii.decode-word"
      ]
    },
    {
      "id": "lez03_03_utf8_decode",
      "title": "Lunghezza e struttura delle sequenze UTF-8",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.3.utf8.continuations-in-three",
        "m1.3.utf8.payload-two",
        "m1.3.utf8.count-bytes",
        "m1.3.utf8.count-codepoints",
        "m1.3.utf8.length-from-prefix",
        "m1.3.utf8.payload-three",
        "m1.3.utf8.replacement",
        "m1.3.utf8.boundary"
      ]
    },
    {
      "id": "lez03_04_rgb_image_size",
      "title": "Immagini RGB e indirizzi dei pixel",
      "format": "intero",
      "variants": [
        "m1.3.rgb.channel-offset",
        "m1.3.rgb.index-offset",
        "m1.3.rgb.monochrome-size",
        "m1.3.rgb.palette-index",
        "m1.3.rgb.pixel-colors",
        "m1.3.rgb.raw-size",
        "m1.3.rgb.bits-to-bytes",
        "m1.3.rgb.bytes-to-mib"
      ]
    },
    {
      "id": "lez03_05_multi_interpretation",
      "title": "Formato e interpretazione dei dati",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.3.multi.decode-process",
        "m1.3.multi.byte-as-number",
        "m1.3.multi.schema",
        "m1.3.multi.byte-as-char",
        "m1.3.multi.two-bytes-text",
        "m1.3.multi.self-describing",
        "m1.3.multi.executable-header",
        "m1.3.multi.timestamp"
      ]
    }
  ]
});
