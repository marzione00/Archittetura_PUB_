'use strict';
SL.catalogo.push({
  "id": "6.4",
  "title": "TLB e tabelle delle pagine multilivello",
  "units": [
    {
      "id": "6.4.1",
      "title": "Memorizzare le traduzioni nella TLB",
      "experiment": "Scegli la sequenza A, B, A. Eseguila prima con una sola voce TLB e poi con due. Confronta gli esiti della terza lettura.",
      "skill": "Seguire hit e miss della TLB",
      "check": "Il riuso richiede la stessa coppia ASID e VPN ancora presente nella TLB. Una capacità minore può espellerla durante la lettura di B."
    },
    {
      "id": "6.4.2",
      "title": "Perché una tabella lineare diventa grande",
      "experiment": "Imposta indirizzi a 32 bit e pagine da 4 KiB. Passa da una a più regioni mappate e confronta i byte totali delle due strutture.",
      "skill": "Calcolare numero di voci e occupazione",
      "check": "La tabella lineare ha una voce per ogni VPN. La struttura a due livelli mantiene la stessa radice e aggiunge una tabella figlia per ogni regione usata."
    },
    {
      "id": "6.4.3",
      "title": "Una traduzione simulata a due livelli",
      "experiment": "Fissa i due indici e l’offset, poi confronta una foglia presente con una assente. Segui gli indirizzi delle due voci prima di osservare l’esito.",
      "skill": "Ordinare gli accessi dipendenti",
      "check": "Entrambe le ricerche usano indici moltiplicati per otto. Il byte fisico si ottiene solo dopo aver verificato la presenza della foglia."
    },
    {
      "id": "6.4.4",
      "title": "Costo della traduzione e ipotesi sui tempi",
      "experiment": "Fissa due livelli e varia gli hit su cento richieste. Poi mantieni la frequenza di hit e aggiungi un livello. Confronta i costi dei due percorsi e la media.",
      "skill": "Calcolare il costo di un cammino",
      "check": "Ogni livello aggiunge una lettura della RAM durante un miss della TLB. In caso di hit basta leggere il dato dopo la consultazione della TLB."
    },
    {
      "id": "6.4.5",
      "title": "Esercizi",
      "experiment": "Scegli «Separare gli indici per due geometrie». Usa le larghezze della traccia per estrarre indice superiore, indice inferiore e offset. Ripeti con l’altra ripartizione.",
      "skill": "Riconoscere il cambio di tabella",
      "check": "L’ampiezza dell’indice inferiore determina dove termina quello superiore. La ricomposizione dei tre campi deve restituire l’indirizzo iniziale.",
      "kind": "esercizi"
    },
    {
      "id": "6.4.6",
      "title": "Soluzioni",
      "experiment": "Apri «Seguire i due caricamenti in assembly». Individua nel listato quale valore caricato dal primo MOV viene usato come base per il secondo. Segui infine il calcolo di RAX.",
      "skill": "Diagnosticare uno shift o una scala errata",
      "check": "La prima lettura restituisce un puntatore. La seconda restituisce una voce codificata. L’offset si somma alla base del frame ricavato da quest’ultima.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez6_4_01_tlb_behavior",
      "title": "Comportamento della TLB",
      "format": "intero / scelta multipla / sequenza",
      "variants": [
        "m6v-15466e37fa",
        "m6v-34780c2a65",
        "m6v-0db1f71d97",
        "m6v-b4a490b217"
      ]
    },
    {
      "id": "cslez6_4_02_tlb_lookup_assembly",
      "title": "Ricerca nella TLB in assembly",
      "format": "assembly",
      "variants": [
        "m6v-dcb9db247f",
        "m6v-7d1980f89e",
        "m6v-3a540ca1c5",
        "m6v-47a5f2deed"
      ]
    },
    {
      "id": "cslez6_4_03_multilevel_indexes",
      "title": "Indici delle tabelle multilivello",
      "format": "sequenza",
      "variants": [
        "m6v-8414f065ef",
        "m6v-e0174d95ee",
        "m6v-84acb7fa34",
        "m6v-c390022b93"
      ]
    },
    {
      "id": "cslez6_4_04_two_level_walk_assembly",
      "title": "Percorso nelle tabelle a due livelli in assembly",
      "format": "assembly",
      "variants": [
        "m6v-8f76243653",
        "m6v-82e8dcdc8a",
        "m6v-d9838591f9",
        "m6v-7cc8a4faac"
      ]
    },
    {
      "id": "cslez6_4_05_translation_cost",
      "title": "Costo della traduzione",
      "format": "decimale / intero",
      "variants": [
        "m6v-acce828514",
        "m6v-585a908954",
        "m6v-9e1bdb19a6",
        "m6v-7919bda61f"
      ]
    }
  ]
});
