'use strict';
SL.catalogo.push({
  "id": "4.6",
  "title": "RAID e memoria a stato solido",
  "units": [
    {
      "id": "4.6.1",
      "title": "Ridondanza, modelli di guasto e RAID",
      "experiment": "Seleziona RAID 5 e confronta uno e due dischi guasti. Passa a RAID 10 e sposta il secondo guasto dalla stessa coppia a una coppia diversa.",
      "skill": "Valutare capacità utile e leggibilità del volume",
      "check": "La parità di RAID 5 permette di ricavare un byte assente per stripe. Nel RAID 10 la lettura dipende dalla presenza di una copia in ciascuna coppia."
    },
    {
      "id": "4.6.2",
      "title": "Scritture di parità, modalità degradata e ricostruzione",
      "experiment": "Fissa A e B, scegli il nuovo A e segui l’aggiornamento della parità. Dopo la perdita di A, confronta il byte ricostruito con il dato appena scritto.",
      "skill": "Tracciare un aggiornamento parziale",
      "check": "Lo XOR di B con la parità aggiornata restituisce il nuovo A. Le due letture e le due scritture nel passaggio precedente spiegano il costo dell’aggiornamento parziale."
    },
    {
      "id": "4.6.3",
      "title": "Memoria flash e traduzione",
      "experiment": "Scegli L0 e modifica il byte, quindi segui la mappa fino alla lettura. Ripeti per L1 e identifica la pagina fisica che diventa invalida in ogni caso.",
      "skill": "Distinguere pagina e blocco di cancellazione",
      "check": "Il controller legge dalla pagina fisica appena programmata. L’identità della pagina logica resta la stessa anche quando cambia il puntatore fisico."
    },
    {
      "id": "4.6.4",
      "title": "FTL, durata e latenza dipendente dallo stato",
      "experiment": "Con tre pagine valide nel blocco vittima confronta le due condizioni di spazio libero. Nel caso con recupero, aumenta di uno le pagine valide da migrare.",
      "skill": "Misurare l’amplificazione delle scritture",
      "check": "Una pagina valida in più richiede una lettura e una programmazione in più. Con una pagina libera già disponibile, la scrittura dell’host evita migrazione e cancellazione."
    },
    {
      "id": "4.6.5",
      "title": "Problemi svolti",
      "experiment": "Riunisci in un ciclo i due intervalli medi. Prima di calcolare la percentuale scegli quale durata appartiene al numeratore della disponibilità.",
      "skill": "Stimare la disponibilità",
      "check": "La quota operativa e quella di riparazione condividono lo stesso denominatore. La loro somma rappresenta l’intero ciclo.",
      "kind": "esercizi"
    },
    {
      "id": "4.6.6",
      "title": "Esercizi",
      "experiment": "Scegli «Separare continuità di servizio e disponibilità». Nella prima traccia usa le durate del ciclo, nella seconda conta separatamente sistemi integri e sistemi riparati.",
      "skill": "Distinguere disponibilità e continuità di servizio",
      "check": "Una riparazione può rendere disponibile un sistema all’istante finale dopo un guasto durante la missione. La scelta dell’intervallo osservato cambia il conteggio.",
      "kind": "esercizi"
    },
    {
      "id": "4.6.7",
      "title": "Soluzioni",
      "experiment": "Apri «Leggere e ricostruire una coppia speculare». Segui la perdita di una copia nella prima traccia e la ricostruzione del disco nella seconda.",
      "skill": "Verificare una stima di rebuild",
      "check": "La capacità logica dello specchio corrisponde a una copia dei dati. Il tempo di ricostruzione si ricava dai byte di quella copia e dalla velocità effettiva assegnata.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez4_6_01_raid_ssd_01",
      "title": "Affidabilità e disponibilità",
      "format": "decimale / scelta multipla",
      "variants": [
        "m4.6.g1.reliability",
        "m4.6.g1.availability",
        "m4.6.g1.unavailability",
        "m4.6.g1.distinction"
      ]
    },
    {
      "id": "cslez4_6_02_raid_ssd_02",
      "title": "Distribuzione dei dati in RAID 0",
      "format": "intero / scelta multipla",
      "variants": [
        "m4.6.g2.raid0-capacity",
        "m4.6.g2.raid0-fault",
        "m4.6.g2.raid0-purpose",
        "m4.6.g2.raid0-risk"
      ]
    },
    {
      "id": "cslez4_6_03_raid_ssd_03",
      "title": "Copie e ricostruzione in RAID 1",
      "format": "intero / scelta multipla",
      "variants": [
        "m4.6.g3.raid1-capacity",
        "m4.6.g3.raid1-fault",
        "m4.6.g3.raid1-copies",
        "m4.6.g3.rebuild"
      ]
    },
    {
      "id": "cslez4_6_04_raid_ssd_04",
      "title": "Parità e capacità in RAID 5 e RAID 10",
      "format": "intero",
      "variants": [
        "m4.6.g4.raid5-min",
        "m4.6.g4.raid5-capacity",
        "m4.6.g4.raid5-fault",
        "m4.6.g4.raid10-capacity"
      ]
    },
    {
      "id": "cslez4_6_05_raid_ssd_05",
      "title": "Lettura, cancellazione e usura negli SSD",
      "format": "scelta multipla",
      "variants": [
        "m4.6.g5.ssd-read-unit",
        "m4.6.g5.ssd-erase-unit",
        "m4.6.g5.no-seek",
        "m4.6.g5.wear"
      ]
    }
  ]
});
