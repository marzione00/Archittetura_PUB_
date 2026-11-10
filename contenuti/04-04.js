'use strict';
SL.catalogo.push({
  "id": "4.4",
  "title": "Bus, transazioni e interconnessioni",
  "units": [
    {
      "id": "4.4.1",
      "title": "Regole di comunicazione di un’interconnessione"
    },
    {
      "id": "4.4.2",
      "title": "Larghezza, clock e topologia"
    },
    {
      "id": "4.4.3",
      "title": "Transazioni e semantica del protocollo"
    },
    {
      "id": "4.4.4",
      "title": "Banda, coordinamento e arbitraggio"
    },
    {
      "id": "4.4.5",
      "title": "Gerarchie e reti punto a punto"
    },
    {
      "id": "4.4.6",
      "title": "Problemi svolti",
      "kind": "esercizi"
    },
    {
      "id": "4.4.7",
      "title": "Esercizi",
      "provaIniziale": 1,
      "kind": "esercizi"
    },
    {
      "id": "4.4.8",
      "title": "Soluzioni",
      "provaIniziale": 3,
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez4_4_01_buses_01",
      "title": "Tempo di trasferimento e banda utile",
      "format": "decimale",
      "variants": [
        "m4.4.g1.transfer-time",
        "m4.4.g1.effective",
        "m4.4.g1.utilization",
        "m4.4.g1.payload"
      ]
    },
    {
      "id": "cslez4_4_02_buses_02",
      "title": "Larghezza del bus e cicli di trasferimento",
      "format": "decimale / intero",
      "variants": [
        "m4.4.g2.data-width",
        "m4.4.g2.address-space",
        "m4.4.g2.ddr-rate",
        "m4.4.g2.beats"
      ]
    },
    {
      "id": "cslez4_4_03_buses_03",
      "title": "Arbitraggio e tempi di attesa",
      "format": "intero / scelta multipla",
      "variants": [
        "m4.4.g3.round-robin",
        "m4.4.g3.daisy",
        "m4.4.g3.wait",
        "m4.4.g3.arbitration-purpose"
      ]
    },
    {
      "id": "cslez4_4_04_buses_04",
      "title": "Trasferimenti sincroni, asincroni e a raffica",
      "format": "scelta multipla",
      "variants": [
        "m4.4.g4.sync",
        "m4.4.g4.async",
        "m4.4.g4.burst",
        "m4.4.g4.handshake-order"
      ]
    },
    {
      "id": "cslez4_4_05_buses_05",
      "title": "Collegamenti bidirezionali, code e latenza",
      "format": "decimale / intero / scelta multipla",
      "variants": [
        "m4.4.g5.full-duplex",
        "m4.4.g5.queue",
        "m4.4.g5.latency",
        "m4.4.g5.order"
      ]
    }
  ]
});
