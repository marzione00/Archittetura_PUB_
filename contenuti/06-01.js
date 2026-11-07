'use strict';
SL.catalogo.push({
  "id": "6.1",
  "title": "Gerarchie di memoria e località",
  "units": [
    {
      "id": "6.1.1",
      "title": "Perché le memorie formano una gerarchia",
      "experiment": "Scegli 63 come indirizzo del secondo byte e osserva i due caricamenti. Ripeti con 64 e confronta la sorgente di R0 e il tempo cumulato.",
      "skill": "Associare tecnologia, capacità e latenza",
      "check": "Il primo caricamento porta in cache l’intera linea che contiene l’indirizzo 0. Il costo del secondo cambia al confine della linea."
    },
    {
      "id": "6.1.2",
      "title": "Località e stato di una cache",
      "experiment": "Esegui le due scansioni con passo di un intero. Ripeti con passo di sedici interi e confronta gli hit della seconda passata.",
      "skill": "Distinguere località spaziale e temporale",
      "check": "I byte vicini condividono una linea. Quando il passo porta i quattro accessi su quattro blocchi, due sole posizioni di cache possono costringere a ricaricarli."
    },
    {
      "id": "6.1.3",
      "title": "Tempo medio di accesso e ipotesi del modello",
      "experiment": "Lascia la penalità a 50 ns, passa da 10 a 20 miss ogni cento richieste e confronta il costo medio finale.",
      "skill": "Applicare il modello AMAT",
      "check": "Ogni richiesta paga 2 ns di consultazione. La differenza fra le due medie dipende soltanto dai dieci rifornimenti aggiuntivi distribuiti su cento richieste."
    },
    {
      "id": "6.1.4",
      "title": "Esercizi",
      "experiment": "Scegli «Espulsioni e blocchi sporchi». Per ciascuna operazione segna indice, tag e stato del bit dirty, poi inserisci i conteggi richiesti.",
      "skill": "Predire hit, miss ed espulsioni",
      "check": "Il confronto dei tag distingue hit e miss. Una riscrittura verso la RAM richiede anche l’espulsione di una linea modificata.",
      "kind": "esercizi"
    },
    {
      "id": "6.1.5",
      "title": "Soluzioni",
      "experiment": "Apri «Pesare il costo di un miss», segui prima il costo delle consultazioni e poi quello dei rifornimenti. Ripeti con la seconda traccia.",
      "skill": "Verificare lo stato di tag e bit dirty",
      "check": "La somma dei due tempi riguarda cento richieste. Solo dopo la divisione per cento il risultato esprime nanosecondi per accesso.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez6_1_01_memory_technologies",
      "title": "Tecnologie di memoria",
      "format": "scelta multipla",
      "variants": [
        "m6v-5dd4678c59",
        "m6v-ad1f873797",
        "m6v-83748ecc21",
        "m6v-595b1b0579"
      ]
    },
    {
      "id": "cslez6_1_02_locality",
      "title": "Località",
      "format": "intero / scelta multipla",
      "variants": [
        "m6v-bab0192925",
        "m6v-4531b00c0d",
        "m6v-bde3a1ce36",
        "m6v-54d6b81944"
      ]
    },
    {
      "id": "cslez6_1_03_cache_behavior",
      "title": "Comportamento della cache",
      "format": "intero / sequenza",
      "variants": [
        "m6v-f4b9624159",
        "m6v-ca2a64309d",
        "m6v-9dcd76d4f7",
        "m6v-7cbdfc5ce6"
      ]
    },
    {
      "id": "cslez6_1_04_cache_performance",
      "title": "Prestazioni della cache",
      "format": "decimale / scelta multipla",
      "variants": [
        "m6v-7c26e0c955",
        "m6v-1595aa2da1",
        "m6v-402e05ec89",
        "m6v-2099cd7429"
      ]
    },
    {
      "id": "cslez6_1_05_hierarchy_design",
      "title": "Progetto della gerarchia di memoria",
      "format": "scelta multipla",
      "variants": [
        "m6v-2548806d79",
        "m6v-2897b118bf",
        "m6v-a97da6aade",
        "m6v-28493b0d8f"
      ]
    }
  ]
});
