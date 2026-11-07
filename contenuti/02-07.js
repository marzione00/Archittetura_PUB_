'use strict';
SL.catalogo.push({
  "id": "2.7",
  "title": "Frame dello stack, sicurezza della memoria e riuso del flusso di controllo",
  "units": [
    {
      "id": "2.7.1",
      "title": "I frame dello stack come convenzioni",
      "experiment": "Confronta uno e quattro blocchi locali da 16 byte. In ciascun frame individua la cella del vecchio RBP, la cella dell’indirizzo di ritorno e l’ultimo byte locale.",
      "skill": "Ricostruire la disposizione del frame",
      "check": "La riserva amplia la regione dei locali verso gli indirizzi minori. RBP resta fermo, quindi le due celle salvate mantengono gli stessi indirizzi."
    },
    {
      "id": "2.7.2",
      "title": "Dalla scrittura fuori limite ai dati di controllo",
      "experiment": "Prova copie da 8, 9, 13 e 17 byte. Per ciascuna identifica l’ultimo offset scritto e la prima regione raggiunta oltre il buffer.",
      "skill": "Calcolare un intervallo di scrittura",
      "check": "Il primo byte esterno cade nel riempimento. Una copia più lunga può raggiungere prima il contatore e poi il dato di controllo, secondo l’ordine degli oggetti nel frame simulato."
    },
    {
      "id": "2.7.3",
      "title": "Protezioni e loro limiti",
      "experiment": "Seleziona la sentinella e confronta una scrittura di 166 con una di 0. Applica poi la stessa scrittura al solo locale. Segui il controllo prima di RET.",
      "skill": "Localizzare il rilevamento di una corruzione",
      "check": "L’epilogo confronta il byte finale della sentinella con la copia attesa. Una scrittura sul locale e una che ripristina il byte originario superano entrambe questo confronto."
    },
    {
      "id": "2.7.4",
      "title": "Riuso del flusso di controllo",
      "experiment": "Mantieni l’accumulatore iniziale a 4 e prova i due ordini delle etichette. Confronta l’accumulatore dopo il secondo blocco e RSP dopo l’ultimo RET.",
      "skill": "Ricostruire un trasferimento indiretto",
      "check": "Le due operazioni possono produrre risultati diversi se scambiate di posto. In entrambi gli ordini RET consuma lo stesso numero di voci e porta RSP allo stesso indirizzo finale."
    },
    {
      "id": "2.7.5",
      "title": "Ottimizzazioni dello stack e dettagli ABI",
      "experiment": "Confronta la funzione foglia con temporaneo e il caso con chiamata interna, scegliendo 24 byte in entrambi. Osserva l’indirizzo del temporaneo e RSP subito prima della chiamata.",
      "skill": "Riconoscere una funzione foglia priva di locali",
      "check": "La funzione foglia usa la red zone al di sotto di RSP. La funzione che chiama riserva invece un’area nel proprio frame e prepara RSP con l’allineamento richiesto."
    },
    {
      "id": "2.7.6",
      "title": "Stack ombra e protezioni complementari",
      "experiment": "Modifica prima l’indirizzo sullo stack ordinario e poi soltanto un dato locale. Confronta le due copie dell’indirizzo subito prima di RET.",
      "skill": "Verificare l’integrità del ritorno",
      "check": "RET segnala #CP se le due destinazioni differiscono. La modifica di un locale lascia intatto il confronto fra gli indirizzi e il ritorno può proseguire."
    },
    {
      "id": "2.7.7",
      "title": "Verifiche per una revisione di sicurezza della memoria",
      "experiment": "Lascia la capacità a otto byte e prova contenuti da sette e da otto byte. Per ogni caso colloca il terminatore e confronta il suo indice con l’ultimo indice disponibile.",
      "skill": "Controllare capacità e lunghezza effettiva",
      "check": "Il terminatore richiede una cella oltre il contenuto. Il controllo accetta la copia soltanto quando anche quella cella appartiene al buffer."
    },
    {
      "id": "2.7.8",
      "title": "Problemi svolti",
      "experiment": "Con RSP = 0x1000 e RAX = 0x55, segui PUSH RAX. Indica il nuovo puntatore e individua il byte meno significativo nella parola appena salvata.",
      "skill": "Collegare la variazione di RSP all’ordine dei byte scritti",
      "check": "La diminuzione di RSP determina il primo indirizzo di scrittura. Il formato little-endian stabilisce quale degli otto byte compare in quella cella.",
      "kind": "esercizi"
    },
    {
      "id": "2.7.9",
      "title": "Esercizi",
      "experiment": "In «Due push e un pop» annota il contenuto della cima dopo ciascuna PUSH. Prevedi il valore destinato a RCX e la posizione finale di RSP, poi esegui la traccia alternativa.",
      "skill": "Seguire separatamente il valore estratto e la posizione della cima",
      "check": "POP legge la voce salvata più di recente. Ogni salvataggio e ogni estrazione spostano RSP di una parola in direzioni opposte.",
      "kind": "esercizi"
    },
    {
      "id": "2.7.10",
      "title": "Soluzioni",
      "experiment": "In «Salvare RBX e ristabilire l’allineamento» segui il salvataggio, la riserva locale e la CALL interna. Confronta RSP prima della chiamata con RBX dopo il ripristino.",
      "skill": "Controllare l’allineamento di RSP e il ripristino di RBX",
      "check": "La riserva locale determina l’allineamento di RSP. POP recupera dalla cella salvata il valore di RBX spettante al chiamante, anche se la funzione lo ha usato come temporaneo.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez2_7_01_random_assembly_01",
      "title": "Operazioni sulla cima dello stack",
      "format": "assembly",
      "variants": [
        "m2.7.push-pop",
        "m2.7.swap-top",
        "m2.7.sum-top",
        "m2.7.peek-top"
      ]
    },
    {
      "id": "cslez2_7_02_random_assembly_02",
      "title": "Spazio locale e prologo di funzione",
      "format": "assembly",
      "variants": [
        "m2.7.discard-top",
        "m2.7.allocate-local",
        "m2.7.deallocate-local",
        "m2.7.frame-prologue"
      ]
    },
    {
      "id": "cslez2_7_03_random_assembly_03",
      "title": "Epilogo, variabili locali e chiamate",
      "format": "assembly",
      "variants": [
        "m2.7.frame-epilogue",
        "m2.7.local-store-rbp",
        "m2.7.stack-argument",
        "m2.7.call-helper"
      ]
    },
    {
      "id": "cslez2_7_04_random_assembly_04",
      "title": "Ordine e duplicazione dei valori sullo stack",
      "format": "assembly",
      "variants": [
        "m2.7.push-order",
        "m2.7.duplicate-top",
        "m2.7.replace-top",
        "m2.7.reverse-three"
      ]
    },
    {
      "id": "cslez2_7_05_random_assembly_05",
      "title": "Allineamento, registri salvati e indirizzo di ritorno",
      "format": "assembly",
      "variants": [
        "m2.7.align-stack",
        "m2.7.save-two-registers",
        "m2.7.return-address-observe",
        "m2.7.manual-push"
      ]
    }
  ]
});
