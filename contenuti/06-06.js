'use strict';
SL.catalogo.push({
  "id": "6.6",
  "title": "Consistenza e recupero dopo un arresto",
  "units": [
    {
      "id": "6.6.1",
      "title": "Perché la persistenza richiede un modello di consistenza",
      "experiment": "Scegli un ordine di persistenza e ferma l’aggiornamento dopo una o due scritture. Leggi il bit di allocazione, il puntatore nell’inode e il contenuto del blocco 9 dopo il riavvio.",
      "skill": "Leggere uno stato durevole parziale",
      "check": "Il prefisso durevole determina separatamente quali byte sopravvivono, se l’allocatore considera il blocco occupato e se il file può raggiungerlo."
    },
    {
      "id": "6.6.2",
      "title": "Ricostruzione e riparazione",
      "experiment": "Lascia presente il riferimento al blocco e imposta la bitmap su «Libero». Poi scambia le due condizioni e confronta la modifica apportata al bit nei due casi.",
      "skill": "Diagnosticare un’incoerenza con fsck",
      "check": "Con inode integri la mappa riparata segue la raggiungibilità del blocco. Segnarlo libero mentre è ancora usato crea un rischio di doppia assegnazione."
    },
    {
      "id": "6.6.3",
      "title": "Journal redo e soglia del commit durevole",
      "experiment": "Confronta il recupero con ultimo passo durevole 1, 2 e 3. Annota per A e B i valori prima e dopo il riavvio.",
      "skill": "Decidere quando eseguire il replay",
      "check": "Il commit separa i record da ignorare dalle immagini da installare. Un blocco già aggiornato conserva lo stesso valore se il redo lo riscrive."
    },
    {
      "id": "6.6.4",
      "title": "Journaling di dati e metadati: garanzie e costi",
      "experiment": "Mantieni gli stessi blocchi dati e metadati. Cambia tra modalità completa e ordinata e confronta i conteggi prima del commit e dopo il checkpoint.",
      "skill": "Distinguere costo e copertura del journal",
      "check": "In entrambe le modalità il commit richiede dati e record di metadati durevoli. La modalità completa deve anche copiare i dati dal journal alla sede definitiva."
    },
    {
      "id": "6.6.5",
      "title": "Esercizi",
      "experiment": "Scegli «Diagnosticare uno stato persistente parziale». Per ogni traccia confronta il bit della bitmap con i puntatori degli inode, quindi associa il rischio alla discrepanza osservata.",
      "skill": "Classificare le transazioni al riavvio",
      "check": "Un blocco riservato e irraggiungibile sottrae spazio al volume. Un blocco raggiungibile che risulta libero può essere assegnato una seconda volta.",
      "kind": "esercizi"
    },
    {
      "id": "6.6.6",
      "title": "Soluzioni",
      "experiment": "Apri «Recuperare due transazioni indipendenti». Individua il commit di ciascuna transazione e confronta i valori dopo il primo e il secondo recupero.",
      "skill": "Dimostrare l’idempotenza del record",
      "check": "La decisione relativa a un blocco dipende dal commit della transazione che lo aggiorna. Ripetere l’installazione della stessa immagine ne conserva il contenuto.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez6_6_01_consistency",
      "title": "Consistenza del file system",
      "format": "intero / scelta multipla / sequenza",
      "variants": [
        "m6v-656187300b",
        "m6v-0d05a7898f",
        "m6v-aeb9400f0c",
        "m6v-5bea46f03f"
      ]
    },
    {
      "id": "cslez6_6_02_fsck",
      "title": "Controllo con fsck",
      "format": "intero / scelta multipla",
      "variants": [
        "m6v-52704962ee",
        "m6v-d57ab51d64",
        "m6v-c3b3bada2e",
        "m6v-3f2fed9873"
      ]
    },
    {
      "id": "cslez6_6_03_write_order",
      "title": "Ordine delle scritture",
      "format": "scelta multipla / sequenza",
      "variants": [
        "m6v-3ba672cb4f",
        "m6v-109251a527",
        "m6v-5e86dca4ac",
        "m6v-27d76609d8"
      ]
    },
    {
      "id": "cslez6_6_04_journaling",
      "title": "Registro delle modifiche e commit",
      "format": "scelta multipla / sequenza",
      "variants": [
        "m6v-30a25f9573",
        "m6v-ecc10c3edc",
        "m6v-90a91e2bbb",
        "m6v-42e2178354"
      ]
    },
    {
      "id": "cslez6_6_05_crash_recovery",
      "title": "Recupero dopo un arresto",
      "format": "intero / scelta multipla / sequenza",
      "variants": [
        "m6v-9da46ac0b0",
        "m6v-9c1c7c267a",
        "m6v-2eb7598be5",
        "m6v-5cfae51618"
      ]
    }
  ]
});
