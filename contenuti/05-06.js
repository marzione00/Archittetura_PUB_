'use strict';
SL.catalogo.push({
  "id": "5.6",
  "title": "Semafori contatori e problemi classici di sincronizzazione",
  "units": [
    {
      "id": "5.6.1",
      "title": "Derivare il buffer limitato dai suoi invarianti",
      "experiment": "Scegli la capacità del buffer vuoto. Segui lo stesso permesso attraverso wait(vuoti), l’inserimento e signal(pieni).",
      "skill": "Collegare permessi e occupazione",
      "check": "Tra prenotazione e pubblicazione, la somma dei due semafori è inferiore alla capacità. Il posto riservato completa il conteggio."
    },
    {
      "id": "5.6.2",
      "title": "L’ordine di acquisizione nella dimostrazione di correttezza",
      "experiment": "Confronta i due ordini di acquisizione con il buffer inizialmente pieno. Quando P attende uno spazio, controlla chi possiede il mutex necessario al consumatore.",
      "skill": "Costruire una dipendenza circolare",
      "check": "Il consumatore libera il posto solo se riesce a entrare nella sezione protetta. Il possesso del mutex durante l’attesa può bloccare entrambi i partecipanti."
    },
    {
      "id": "5.6.3",
      "title": "Attendere una condizione sotto mutex",
      "experiment": "Confronta i due ordini di riacquisizione del mutex dopo la produzione. Leggi il numero di elementi quando C1 esamina nuovamente il predicato.",
      "skill": "Ricontrollare il predicato dopo il risveglio",
      "check": "La notifica rende possibile il risveglio. Se C2 ha già consumato l’elemento, C1 ritrova il buffer vuoto al nuovo controllo."
    },
    {
      "id": "5.6.4",
      "title": "Lettori e scrittori: sicurezza e politica di ammissione",
      "experiment": "Seleziona la precedenza ai lettori, poi l’ordine di arrivo. Segui L2, entrato in scena dopo lo scrittore S, fino all’uscita di L1.",
      "skill": "Distinguere esclusione e progresso",
      "check": "Con una coda equa L2 rimane dietro S. Ammettere L2 nel gruppo già attivo prolunga invece l’intervallo durante il quale S attende."
    },
    {
      "id": "5.6.5",
      "title": "Dagli invarianti locali all’ordinamento globale delle risorse",
      "experiment": "A acquisisce sempre X prima di Y. Confronta la sequenza in cui B inizia da Y con quella in cui entrambi iniziano da X. Alla seconda richiesta individua chi possiede ciascun lock.",
      "skill": "Escludere un ciclo di attese fra lock ordinati",
      "check": "Con ordini opposti possono comparire le dipendenze A → B e B → A. Usando lo stesso ordine, il thread in attesa del primo lock lascia libero il secondo."
    },
    {
      "id": "5.6.6",
      "title": "Problemi svolti",
      "experiment": "Con tre slot inizialmente liberi, fermati dopo wait(vuoti), poi avanza alla pubblicazione. Conta gli slot liberi, riservati e pubblicati.",
      "skill": "Seguire un permesso in transito",
      "check": "Il produttore cambia la categoria di uno slot. La somma delle tre categorie resta uguale alla capacità in ciascuna istantanea.",
      "kind": "esercizi"
    },
    {
      "id": "5.6.7",
      "title": "Esercizi",
      "experiment": "Nella prova sulle disponibilità del buffer, conta gli inserimenti e le rimozioni completati. Calcola pieni e vuoti usando la capacità della traccia scelta.",
      "skill": "Calcolare lo stato del buffer",
      "check": "A operazioni concluse, i due semafori descrivono l’occupazione e lo spazio disponibile. La loro somma permette di controllare i risultati.",
      "kind": "esercizi"
    },
    {
      "id": "5.6.8",
      "title": "Soluzioni",
      "experiment": "Ripercorri «Contabilizzare una prenotazione in corso». Ricostruisci prima i contatori senza prenotazioni, poi sottrai i posti già acquisiti dai produttori.",
      "skill": "Verificare la conservazione delle risorse",
      "check": "I produttori in attesa di scrivere spiegano lo scarto tra capacità e somma dei semafori. Lo scarto sparisce alla pubblicazione dei loro elementi.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez5_6_01_classical_sync",
      "title": "Condizioni e risorse nel produttore–consumatore",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.6.g1.initial-slots",
        "m5.6.g1.events-two-one",
        "m5.6.g1.condition-vs-exclusion",
        "m5.6.g1.multi-producer-metadata"
      ]
    },
    {
      "id": "cslez5_6_02_classical_sync",
      "title": "Sequenza delle operazioni sul buffer",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.6.g2.full-initial",
        "m5.6.g2.consumer-order",
        "m5.6.g2.producer-publish",
        "m5.6.g2.spsc-assumption"
      ]
    },
    {
      "id": "cslez5_6_03_classical_sync",
      "title": "Posti occupati, prenotazioni e blocchi",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.6.g3.buffer-values",
        "m5.6.g3.consumer-final-empty",
        "m5.6.g3.wrong-order-deadlock",
        "m5.6.g3.producer-reservation"
      ]
    },
    {
      "id": "cslez5_6_04_classical_sync",
      "title": "Accesso di lettori e scrittori",
      "format": "scelta multipla",
      "variants": [
        "m5.6.g4.reader-concurrency",
        "m5.6.g4.writer-exclusive",
        "m5.6.g4.first-last-reader",
        "m5.6.g4.writer-starvation"
      ]
    },
    {
      "id": "cslez5_6_05_classical_sync",
      "title": "Uscita dei lettori e accesso equo",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.6.g5.invariant-caveat",
        "m5.6.g5.reader-exit-resource",
        "m5.6.g5.fair-admission",
        "m5.6.g5.semaphore-map"
      ]
    }
  ]
});
