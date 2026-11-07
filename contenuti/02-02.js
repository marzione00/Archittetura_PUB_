'use strict';
SL.catalogo.push({
  "id": "2.2",
  "title": "Aritmetica intera e flag di condizione",
  "units": [
    {
      "id": "2.2.1",
      "title": "Larghezza, segno e aritmetica a precisione fissa",
      "experiment": "Mantieni gli operandi a 255 e 1. Esegui la somma prima a otto bit, poi a sedici, e confronta il risultato, CF e OF.",
      "skill": "Tracciare la larghezza dell’operazione",
      "check": "Aumentando la larghezza cambia sia l’intervallo con segno sia il numero di bit conservati. CF risponde al riporto oltre la parola, OF al superamento dell’intervallo con segno."
    },
    {
      "id": "2.2.2",
      "title": "Un’espressione in tre registri: a × b + c",
      "experiment": "Segui EAX dopo MOV, IMUL e ADD. Modifica soltanto c e ripeti annotando anche EDX dopo la moltiplicazione.",
      "skill": "Ricostruire un’espressione assembly",
      "check": "Il prodotto resta in EAX fino ad ADD e c resta in EDX. Cambiando solo c, le due esecuzioni divergono alla somma finale."
    },
    {
      "id": "2.2.3",
      "title": "Moltiplicazione, divisione e calcolo dell’indirizzo efficace",
      "experiment": "Dividi 17 per 5 e ricomponi il dividendo dai registri finali. Ripeti con divisore zero e osserva il punto di arresto.",
      "skill": "Seguire gli operandi impliciti di DIV",
      "check": "Con un divisore positivo, quoziente × divisore + resto restituisce il dividendo. Con divisore zero compare #DE e i registri mantengono i valori d’ingresso."
    },
    {
      "id": "2.2.4",
      "title": "Combinare i fattori di scala: 7a + 3b − 4",
      "experiment": "Varia prima a, poi b. Per ciascuna esecuzione segui i termini 8a, 7a e 3b prima dello spiazzamento finale.",
      "skill": "Derivare un calcolo scalato",
      "check": "L’incremento unitario di a cambia di sette il risultato, quello di b lo cambia di tre. Lo spiazzamento sottrae quattro in entrambi i casi."
    },
    {
      "id": "2.2.5",
      "title": "Leggere il contratto di un’istruzione",
      "experiment": "Imposta EAX a 5 e ZF a 1. Esegui LEA, osserva la decisione di JZ, poi ripeti con ADD e gli stessi dati.",
      "skill": "Individuare gli effetti sui flag",
      "check": "L’incremento produce lo stesso valore in EAX. LEA conserva ZF all’ingresso, mentre ADD determina ZF dai bit del risultato. I due salti possono così seguire rami diversi."
    },
    {
      "id": "2.2.6",
      "title": "Flag di condizione e larghezza",
      "experiment": "Sottrai 1 da 128 a otto bit e a sedici bit. Confronta l’interpretazione del minuendo, il risultato e OF.",
      "skill": "Riconoscere il prestito e l’overflow con segno",
      "check": "Il bit 7 è il segno solo nella parola da otto bit. Cambiando larghezza, gli stessi valori senza segno possono descrivere una sottrazione con segno diversa."
    },
    {
      "id": "2.2.7",
      "title": "Traduzione completa di un calcolo aritmetico",
      "experiment": "Lascia a = 2 e c = 1. Esegui score con b = 9, poi con b = 10. Confronta il candidato prima di CMP e il valore restituito.",
      "skill": "Ricostruire la selezione condizionale",
      "check": "Il candidato 7a + c è indipendente da b. Al passaggio della soglia cambia CF, quindi il ramo scelto conserva il candidato oppure ne cambia il segno."
    },
    {
      "id": "2.2.8",
      "title": "Problemi svolti",
      "experiment": "Parti da a = 5. Ricava il contenuto del registro dopo ciascuna delle due LEA, distinguendo base e indice nella seconda istruzione.",
      "skill": "Seguire un risultato intermedio fra due LEA",
      "check": "La prima istruzione forma un multiplo che la seconda riutilizza con scala due. Il valore originario di a fornisce la base della seconda somma.",
      "kind": "esercizi"
    },
    {
      "id": "2.2.9",
      "title": "Esercizi",
      "experiment": "Apri «Copia prima del prodotto», annota EAX dopo IMUL e dopo ADD. In «Selezionare il minimo senza segno» individua i flag letti dalla CMOV prima di scegliere il registro finale.",
      "skill": "Distinguere calcolo di un intermedio e selezione di un candidato",
      "check": "Nel primo caso il risultato attraversa due operazioni aritmetiche. Nel secondo il confronto aggiorna i flag e la copia condizionale sceglie fra due valori già disponibili.",
      "kind": "esercizi"
    },
    {
      "id": "2.2.10",
      "title": "Soluzioni",
      "experiment": "Nello svolgimento «Selezionare il minimo senza segno» percorri entrambe le tracce. Confronta EAX prima di CMP con EAX dopo la copia condizionale.",
      "skill": "Giustificare la scelta del minimo dai flag",
      "check": "CF e ZF spiegano quando ESI sostituisce il primo candidato. Nel ramo che conserva EAX puoi risalire al valore caricato dal MOV iniziale.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez2_2_01_random_assembly_01",
      "title": "Copia e aritmetica nei registri",
      "format": "assembly",
      "variants": [
        "m2.2.copy",
        "m2.2.add2",
        "m2.2.sub2",
        "m2.2.mul3"
      ]
    },
    {
      "id": "cslez2_2_02_random_assembly_02",
      "title": "Incrementi, somme e combinazioni lineari",
      "format": "assembly",
      "variants": [
        "m2.2.inc",
        "m2.2.dec",
        "m2.2.sum3",
        "m2.2.lincomb"
      ]
    },
    {
      "id": "cslez2_2_03_random_assembly_03",
      "title": "Differenze e operazioni logiche",
      "format": "assembly",
      "variants": [
        "m2.2.difference-sum",
        "m2.2.and",
        "m2.2.or",
        "m2.2.xor"
      ]
    },
    {
      "id": "cslez2_2_04_random_assembly_04",
      "title": "Complemento, scorrimenti e uguaglianza",
      "format": "assembly",
      "variants": [
        "m2.2.not",
        "m2.2.shift-left",
        "m2.2.shift-right",
        "m2.2.eq"
      ]
    },
    {
      "id": "cslez2_2_05_random_assembly_05",
      "title": "Confronti e selezione condizionale",
      "format": "assembly",
      "variants": [
        "m2.2.ltu",
        "m2.2.max",
        "m2.2.conditional",
        "m2.2.absdiff"
      ]
    }
  ]
});
