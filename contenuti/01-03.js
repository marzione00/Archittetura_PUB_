'use strict';
SL.catalogo.push({
  "id": "1.3",
  "title": "Codificare testo, immagini e suoni",
  "units": [
    {
      "id": "1.3.1",
      "title": "La codifica come accordo tra significato e byte",
      "experiment": "Seleziona una cifra fra 0 e 9. Leggi il byte ASCII, interpretalo come intero e sottrai il codice del carattere «0».",
      "skill": "Distinguere cifra e codice",
      "check": "Cambiando la cifra di una unità, anche il codice ASCII avanza di uno. La distanza da 0x30 restituisce il valore della cifra."
    },
    {
      "id": "1.3.2",
      "title": "Unicode, punti di codice e UTF-8",
      "experiment": "Decodifica prima «è» e poi «€». Segui il primo byte e ciascuna continuazione, annotando l’accumulatore dopo ogni gruppo di bit.",
      "skill": "Decodificare una sequenza UTF-8",
      "check": "Il prefisso iniziale specifica la lunghezza. Ogni continuazione aggiunge sei bit e il valore finale dell’accumulatore coincide con il punto di codice."
    },
    {
      "id": "1.3.3",
      "title": "Dimensionare una registrazione PCM",
      "experiment": "Imposta un solo canale, mantieni fissi frequenza e bit per campione, poi passa a due canali. Calcola i byte registrati in un secondo.",
      "skill": "Calcolare la dimensione dei campioni",
      "check": "Raddoppiare i canali raddoppia i byte per istante e la dimensione totale. In questo formato il totale comprende soltanto i campioni."
    },
    {
      "id": "1.3.4",
      "title": "Formati binari, validazione e contesto",
      "experiment": "Imposta la lunghezza dichiarata a 6 byte. Prova prima con 5 byte disponibili dopo il prefisso e poi con 6. Confronta la posizione finale del cursore.",
      "skill": "Verificare i limiti prima della lettura",
      "check": "Il lettore consuma il prefisso in entrambi i casi. Avanza oltre il contenuto solo quando tutti i byte dichiarati sono disponibili."
    },
    {
      "id": "1.3.5",
      "title": "Un metodo per decodificare i dati",
      "experiment": "Parti dalla posizione 1 e interpreta gli stessi due byte nei due ordini. Sposta poi il cursore alla posizione 3 e riprova.",
      "skill": "Controllare l’ordine di decodifica",
      "check": "L’ordine dei byte determina quale dei due pesa 256. Se rimane un solo byte, il controllo di lunghezza arresta la lettura prima della conversione."
    },
    {
      "id": "1.3.6",
      "title": "Problemi svolti",
      "experiment": "Segui la codifica UTF-8 della lettera «è» e l’aggiunta del terminatore. Conta prima i byte del testo e poi le celle occupate nel buffer.",
      "skill": "Separare testo, lunghezza e terminatore",
      "check": "Il conteggio della stringa termina davanti a 00. La capacità richiesta al buffer comprende anche la cella del terminatore.",
      "kind": "esercizi"
    },
    {
      "id": "1.3.7",
      "title": "Esercizi",
      "experiment": "Scegli «Localizzare un canale in un’immagine RGB». Calcola i byte per riga, raggiungi il pixel indicato e aggiungi lo spostamento del canale richiesto.",
      "skill": "Calcolare il passo di una riga",
      "check": "Riga e colonna portano all’inizio del pixel. Passare da R a G oppure da G a B fa avanzare di un byte entro lo stesso pixel.",
      "kind": "esercizi"
    },
    {
      "id": "1.3.8",
      "title": "Soluzioni",
      "experiment": "Nella soluzione «Due ottetti, tre letture» segui la coppia ASCII e i due interi. Per ogni intero individua il byte che riceve peso 256.",
      "skill": "Verificare il prodotto tra passo e altezza",
      "check": "L’ordine degli indirizzi è lo stesso per tutte le letture. A cambiare sono il tipo di dato e il peso assegnato ai due ottetti.",
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
