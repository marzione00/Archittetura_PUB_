'use strict';
SL.catalogo.push({
  "id": "6.5",
  "title": "File, nomi e allocazione",
  "units": [
    {
      "id": "6.5.1",
      "title": "File, metadati e nomi nelle directory",
      "experiment": "Scegli il nome da usare per la scrittura e cambia il primo byte. Dopo la rimozione del nome scelto, leggi il conteggio dei link e il byte raggiunto dal nome rimasto.",
      "skill": "Distinguere nome e identità del file",
      "check": "La scrittura modifica lo stesso file attraverso entrambi i nomi. La rimozione di una voce cambia il conteggio dei collegamenti, mentre l’altra voce continua a designare l’inode."
    },
    {
      "id": "6.5.2",
      "title": "Risolvere un percorso",
      "experiment": "Risolvi ./testo partendo prima da /corso e poi da /casa. Ripeti con /casa/testo e confronta gli inode raggiunti a ogni componente.",
      "skill": "Risolvere un nome passo per passo",
      "check": "Il percorso relativo parte dall’inode della directory corrente. Un percorso assoluto parte dalla radice, anche quando cambia la directory corrente."
    },
    {
      "id": "6.5.3",
      "title": "Allocare i blocchi",
      "experiment": "Confronta file di 4096 e 4097 byte. Per il secondo file prova i tre metodi di allocazione e osserva posizione logica, blocco fisico e byte inutilizzati.",
      "skill": "Calcolare blocchi dati e frammentazione interna",
      "check": "Un solo byte oltre il confine richiede un altro blocco intero. A parità di dimensione del file, il metodo può cambiare il blocco fisico raggiunto."
    },
    {
      "id": "6.5.4",
      "title": "Spazio libero e contabilità dell’allocazione",
      "experiment": "Seleziona il file A e prova le posizioni 1023 e 1024. Segui la catena e confronta i blocchi assegnati ai due file con quelli liberi nel volume. Per leggere la catena di B, seleziona il file B.",
      "skill": "Seguire una catena di blocchi",
      "check": "Il confine logico richiede un passaggio in più nella FAT. La mappa distingue i blocchi liberi da quelli già assegnati, indipendentemente dal byte letto."
    },
    {
      "id": "6.5.5",
      "title": "Esercizi",
      "experiment": "Scegli «Dimensionare la bitmap di un volume». Calcola i byte minimi della mappa e individua eventuali bit inutilizzati nell’ultimo byte. Confronta le due tracce.",
      "skill": "Collegare directory, file e blocchi",
      "check": "La bitmap assegna un bit a ciascun blocco. La capacità cresce di un byte appena il numero di blocchi supera un multiplo di otto.",
      "kind": "esercizi"
    },
    {
      "id": "6.5.6",
      "title": "Soluzioni",
      "experiment": "Apri «Vita del file dopo unlink». Confronta la traccia con un descrittore aperto e quella con tutti i descrittori chiusi. Segui la rimozione dei due nomi.",
      "skill": "Verificare la contabilità dello spazio",
      "check": "Il conteggio dei nomi e i riferimenti aperti cambiano in momenti diversi. La loro combinazione determina quando lo spazio può tornare disponibile.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez6_5_01_files_metadata",
      "title": "File e metadati",
      "format": "scelta multipla",
      "variants": [
        "m6v-6aeda707d6",
        "m6v-bd318a0bc8",
        "m6v-1551326fd7",
        "m6v-e5fed35b7b"
      ]
    },
    {
      "id": "cslez6_5_02_path_resolution",
      "title": "Risoluzione dei percorsi",
      "format": "intero / scelta multipla / sequenza",
      "variants": [
        "m6v-65ef2ccf91",
        "m6v-0bc238a1e3",
        "m6v-0e2fa69a3d",
        "m6v-93b828cd56"
      ]
    },
    {
      "id": "cslez6_5_03_links",
      "title": "Collegamenti ai file",
      "format": "intero / scelta multipla",
      "variants": [
        "m6v-f5aaa71806",
        "m6v-b6a4e19b90",
        "m6v-7a4ca583f5",
        "m6v-ca231ece11"
      ]
    },
    {
      "id": "cslez6_5_04_space_allocation",
      "title": "Allocazione dello spazio",
      "format": "intero / scelta multipla",
      "variants": [
        "m6v-1e61b47e44",
        "m6v-33492434b6",
        "m6v-b7ca65e6da",
        "m6v-a1b9e86a80"
      ]
    },
    {
      "id": "cslez6_5_05_inode_fat",
      "title": "Inode e FAT",
      "format": "intero / scelta multipla / sequenza",
      "variants": [
        "m6v-b81e1765dd",
        "m6v-3718dc4a08",
        "m6v-a12f3cbb45",
        "m6v-b873ebbb63"
      ]
    }
  ]
});
