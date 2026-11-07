'use strict';
SL.catalogo.push({
  "id": "6.2",
  "title": "Memoria virtuale e paginazione su richiesta",
  "units": [
    {
      "id": "6.2.1",
      "title": "Spazi di indirizzamento, pagine e frame",
      "experiment": "Fissa lo scostamento. Assegna alla pagina 3 di B prima il frame 4 e poi il frame 8. Confronta i due indirizzi fisici con quello di A.",
      "skill": "Separare indirizzo virtuale e fisico",
      "check": "Lo scostamento si conserva. Gli indirizzi fisici coincidono quando le due tabelle associano alla pagina lo stesso frame."
    },
    {
      "id": "6.2.2",
      "title": "Residenza, eccezioni e paginazione su richiesta",
      "experiment": "Segui la stessa lettura nei tre casi del selettore «Pagina richiesta». Confronta letture da file, indirizzo fisico e ritentativi dell’istruzione.",
      "skill": "Seguire la gestione di un page fault",
      "check": "La residenza consente l’accesso immediato. Una pagina di file ammessa può essere caricata. Un indirizzo esterno alle regioni del processo porta al rifiuto."
    },
    {
      "id": "6.2.3",
      "title": "Insieme di lavoro e rimpiazzo",
      "experiment": "Imposta quattro riferimenti per finestra e tre frame. Avanza lungo la sequenza A, B, A, C, D, A, C. Osserva l’insieme distinto e la coda dei residenti a ogni riferimento.",
      "skill": "Calcolare il working set di una finestra",
      "check": "La finestra conta le pagine distinte usate di recente. La coda LRU contiene quelle ancora in RAM e identifica la vittima quando occorre un frame."
    },
    {
      "id": "6.2.4",
      "title": "Valutare il costo dei page fault",
      "experiment": "Mantieni la penalità a 1 ms. Confronta 0 e 1000 fault per milione di richieste, convertendo prima la penalità in nanosecondi.",
      "skill": "Pesare i costi con le probabilità",
      "check": "Il costo ordinario resta 100 ns per richiesta. Il supplemento medio è la penalità di un fault moltiplicata per la frequenza dei fault."
    },
    {
      "id": "6.2.5",
      "title": "Esercizi",
      "experiment": "Scegli «Stimare il budget di frame». Delimita gli ultimi riferimenti indicati dalla traccia, conta le pagine distinte e confronta il conteggio con i frame disponibili.",
      "skill": "Riconoscere il rischio di thrashing",
      "check": "Le ripetizioni della stessa pagina nella finestra occupano un solo posto nel conteggio. Il deficit misura quanti altri frame servirebbero per l’intero insieme.",
      "kind": "esercizi"
    },
    {
      "id": "6.2.6",
      "title": "Soluzioni",
      "experiment": "Apri «Recuperare una pagina con RAM piena» e confronta le due tracce. Segui l’espulsione della vittima, il caricamento dal file e il ritentativo.",
      "skill": "Verificare una stima del tempo medio",
      "check": "Il trasferimento aggiuntivo dipende dalle modifiche della pagina vittima. La lettura del processo riprende dopo l’installazione della nuova mappatura.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez6_2_01_address_spaces",
      "title": "Spazi di indirizzi",
      "format": "scelta multipla",
      "variants": [
        "m6v-e9d754d0a0",
        "m6v-2b3a0bb2a7",
        "m6v-d932c413f8",
        "m6v-0466005fd7"
      ]
    },
    {
      "id": "cslez6_2_02_paging",
      "title": "Paginazione",
      "format": "intero",
      "variants": [
        "m6v-9aabd9de7c",
        "m6v-92dcea17d3",
        "m6v-ba4335386f",
        "m6v-7076d92b97"
      ]
    },
    {
      "id": "cslez6_2_03_page_tables",
      "title": "Tabelle delle pagine",
      "format": "intero / scelta multipla",
      "variants": [
        "m6v-19f5daf00c",
        "m6v-d3cf4f0f94",
        "m6v-5ac2ebf629",
        "m6v-67d045aaf0"
      ]
    },
    {
      "id": "cslez6_2_04_page_faults",
      "title": "Errori di pagina",
      "format": "scelta multipla / sequenza",
      "variants": [
        "m6v-921a06ec4e",
        "m6v-08ea8d7bb1",
        "m6v-96cdd1fffe",
        "m6v-d088a48e23"
      ]
    },
    {
      "id": "cslez6_2_05_working_set",
      "title": "Insieme di lavoro",
      "format": "decimale / intero / scelta multipla",
      "variants": [
        "m6v-3379cfc156",
        "m6v-afd23e5300",
        "m6v-17d4c838cc",
        "m6v-b7ce1209af"
      ]
    }
  ]
});
