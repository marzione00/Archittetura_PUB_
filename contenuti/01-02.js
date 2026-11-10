'use strict';
SL.catalogo.push({
  "id": "1.2",
  "title": "Rappresentazione binaria ed esadecimale",
  "units": [
    {
      "id": "1.2.1",
      "title": "Dagli stati fisici ai simboli binari"
    },
    {
      "id": "1.2.2",
      "title": "Notazione posizionale ed esadecimale"
    },
    {
      "id": "1.2.3",
      "title": "Memoria a byte, larghezza e ordine dei byte"
    },
    {
      "id": "1.2.4",
      "title": "Leggere i byte e dichiararne il significato"
    },
    {
      "id": "1.2.5",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "1.2.6",
      "provaIniziale": 3,
      "title": "Esercizi",
      "kind": "esercizi"
    },
    {
      "id": "1.2.7",
      "provaIniziale": 5,
      "title": "Soluzioni",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "lez02_01_voltage_to_bits",
      "title": "Bit, byte e capacità di rappresentazione",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.2.bits.byte-size",
        "m1.2.bits.bytes-64",
        "m1.2.bits.nibble-size",
        "m1.2.bits.capacity-ratio",
        "m1.2.bits.bit-position-weight",
        "m1.2.bits.min-bits-17",
        "m1.2.bits.values-3",
        "m1.2.bits.binary-states"
      ]
    },
    {
      "id": "lez02_02_dec_to_bin",
      "title": "Dal decimale al binario",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.2.decbin.append-one",
        "m1.2.decbin.division-method",
        "m1.2.decbin.inverse",
        "m1.2.decbin.popcount",
        "m1.2.decbin.left-shift",
        "m1.2.decbin.min-width",
        "m1.2.decbin.msb-index",
        "m1.2.decbin.powers"
      ]
    },
    {
      "id": "lez02_03_bin_to_hex",
      "title": "Dal binario all’esadecimale",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.2.binhex.bit-capacity",
        "m1.2.binhex.nibble-count",
        "m1.2.binhex.storage",
        "m1.2.binhex.grouping",
        "m1.2.binhex.append-hex-zero",
        "m1.2.binhex.byte-split",
        "m1.2.binhex.hex-digits",
        "m1.2.binhex.direct"
      ]
    },
    {
      "id": "lez02_04_hex_to_dec",
      "title": "Dall’esadecimale al decimale",
      "format": "intero",
      "variants": [
        "m1.2.hexdec.address-offset",
        "m1.2.hexdec.direct",
        "m1.2.hexdec.shift-left-digit",
        "m1.2.hexdec.shift-right-digit",
        "m1.2.hexdec.positional",
        "m1.2.hexdec.range-two-digits",
        "m1.2.hexdec.digit-value",
        "m1.2.hexdec.high-byte"
      ]
    },
    {
      "id": "lez02_05_utf8_bytes_and_ascii",
      "title": "Byte occupati da ASCII e UTF-8",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.2.enc.c-string-storage",
        "m1.2.enc.ascii-string-bytes",
        "m1.2.enc.ascii-width",
        "m1.2.enc.utf8-ascii-bytes",
        "m1.2.enc.utf8-emoji-bytes",
        "m1.2.enc.utf8-euro-bytes",
        "m1.2.enc.ascii-code-A",
        "m1.2.enc.decode-context"
      ]
    }
  ]
});
