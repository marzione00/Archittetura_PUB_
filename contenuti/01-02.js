'use strict';
SL.catalogo.push({
  "id": "1.2",
  "title": "Rappresentazione binaria ed esadecimale",
  "units": [
    {
      "id": "1.2.1",
      "title": "Dagli stati fisici ai simboli binari",
      "experiment": "Varia la tensione d’ingresso attorno a 800 mV e a 2000 mV. Per ciascun valore confronta la misura con le due soglie del ricevitore.",
      "skill": "Associare intervalli di tensione a livelli logici",
      "check": "Le soglie sono incluse nelle rispettive fasce garantite. Fra le soglie il risultato è indeterminato: due soli livelli garantiti lasciano una zona intermedia."
    },
    {
      "id": "1.2.2",
      "title": "Notazione posizionale ed esadecimale",
      "experiment": "Scegli la posizione 0, poi una posizione alla sua sinistra. Osserva il peso e le scritture binaria ed esadecimale della parola.",
      "skill": "Calcolare il peso di una cifra",
      "check": "Spostare l’unico bit a uno di una posizione verso sinistra raddoppia il valore. I gruppi di quattro bit determinano le cifre esadecimali."
    },
    {
      "id": "1.2.3",
      "title": "Memoria a byte, larghezza e ordine dei byte",
      "experiment": "Mantieni 12345678 come parola. Scrivila in little-endian e poi in big-endian. Controlla la cella 0x1000 e rileggi l’intera parola.",
      "skill": "Ricostruire una parola da un dump",
      "check": "Cambiano gli indirizzi dei quattro byte. Rileggendo con lo stesso ordine della scrittura si ritrova il valore iniziale."
    },
    {
      "id": "1.2.4",
      "title": "Leggere i byte e dichiararne il significato",
      "experiment": "Scegli 65 come valore della cella, poi prova 97. Per ogni byte confronta i pesi dei bit attivi con il carattere ASCII mostrato.",
      "skill": "Applicare un’interpretazione ai dati",
      "check": "Il valore intero deriva dalla somma dei pesi. La tabella ASCII usa quel valore come indice per individuare il carattere."
    },
    {
      "id": "1.2.5",
      "title": "Problemi svolti",
      "experiment": "Dividi 0xAD in due cifre. Ricostruisci il gruppo di quattro bit associato a ciascuna, poi accostali mantenendo l’ordine iniziale.",
      "skill": "Convertire per gruppi di bit",
      "check": "Nel gruppo alto i quattro pesi relativi sono gli stessi del gruppo basso. La posizione della cifra alta moltiplica il suo contributo per sedici.",
      "kind": "esercizi"
    },
    {
      "id": "1.2.6",
      "title": "Esercizi",
      "experiment": "Apri «Raggruppare i bit in cifre esadecimali». Parti dal bit di peso uno e dividi la parola in gruppi di quattro. Indica quanti gruppi usi e ricava le cifre.",
      "skill": "Determinare una larghezza",
      "check": "Gli eventuali zeri aggiunti a sinistra completano il primo gruppo e conservano il valore. Riconvertendo ogni cifra si ritrova la sequenza di partenza.",
      "kind": "esercizi"
    },
    {
      "id": "1.2.7",
      "title": "Soluzioni",
      "experiment": "Nella soluzione «Dimensionare un buffer per il testo» confronta la sequenza UTF-8 delle due tracce. Separa i byte del testo dal terminatore.",
      "skill": "Giustificare l’ordine dei pesi",
      "check": "La capacità minima del buffer supera di un byte la lunghezza del testo codificato. Il numero di caratteri, da solo, può sottostimare lo spazio richiesto.",
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
