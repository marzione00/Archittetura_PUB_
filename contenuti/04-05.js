'use strict';
SL.catalogo.push({
  "id": "4.5",
  "title": "Memoria magnetica e analisi dei tempi di accesso",
  "units": [
    {
      "id": "4.5.1",
      "title": "Geometria e latenza meccanica",
      "experiment": "Imposta 7200 giri/min e mantieni costante il seek. Confronta zero e quattro ottavi di giro residuo, leggendo la latenza al primo byte.",
      "skill": "Convertire giri al minuto in tempi",
      "check": "La quota di giro residua si misura dopo il posizionamento della testina. A settore già allineato rimane il solo seek. Con mezzo giro si aggiunge metà periodo."
    },
    {
      "id": "4.5.2",
      "title": "Blocchi logici e prestazioni quantitative",
      "experiment": "Mantieni LBA, dimensione del blocco, seek e rotazione. Raddoppia i blocchi consecutivi da 8 a 16 e confronta scostamento iniziale e tempo di servizio.",
      "skill": "Ricavare scostamento e durata di una lettura",
      "check": "Lo scostamento iniziale dipende dal primo LBA e dalla dimensione del blocco. Raddoppiano i byte e il tempo di trasferimento. Il costo iniziale di accesso si paga una volta."
    },
    {
      "id": "4.5.3",
      "title": "Code, scheduling e cache",
      "experiment": "Parti dal cilindro 40 con cache vuota. Confronta FCFS e SSTF, poi rendi disponibile in cache il blocco sul cilindro 80. Segui le letture rimaste sul disco.",
      "skill": "Confrontare politiche del disco",
      "check": "FCFS segue la coda. SSTF ricalcola il cilindro più vicino dopo ogni movimento. Un blocco servito dalla cache scompare dal cammino della testina."
    },
    {
      "id": "4.5.4",
      "title": "Problemi svolti",
      "experiment": "Ripartisci i 10 000 byte del file in blocchi da 4096 byte. Distingui i byte effettivamente occupati nell’ultimo blocco da quelli assegnati al file.",
      "skill": "Arrotondare il numero di blocchi",
      "check": "Sommando lo spazio inutilizzato alla dimensione del file ritrovi un multiplo intero della dimensione del blocco.",
      "kind": "esercizi"
    },
    {
      "id": "4.5.5",
      "title": "Esercizi",
      "experiment": "Scegli «Calcolare tempo di trasferimento e risposta». Per entrambe le tracce ricava la durata della copia e componi coda, posizionamento e trasferimento.",
      "skill": "Separare attesa, posizionamento e trasferimento",
      "check": "La risposta si misura dall’arrivo della richiesta al completamento. Una volta espresso tutto in millisecondi, la somma include anche l’attesa prima del servizio.",
      "kind": "esercizi"
    },
    {
      "id": "4.5.6",
      "title": "Soluzioni",
      "experiment": "Apri «Calcolare gli spostamenti della testina». Ripercorri FCFS e SSTF con la stessa posizione iniziale e somma le distanze tra i cilindri visitati.",
      "skill": "Ricostruire il cammino della testina",
      "check": "Nel caso SSTF la richiesta scelta dipende dalla posizione raggiunta al passo precedente. Il cammino totale è la somma dei singoli tratti in valore assoluto.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez4_5_01_disks_01",
      "title": "Geometria e capacità di un disco",
      "format": "intero",
      "variants": [
        "m4.5.g1.capacity",
        "m4.5.g1.track",
        "m4.5.g1.cylinder",
        "m4.5.g1.surfaces"
      ]
    },
    {
      "id": "cslez4_5_02_disks_02",
      "title": "Rotazione, posizionamento e tempo di accesso",
      "format": "decimale / scelta multipla",
      "variants": [
        "m4.5.g2.period",
        "m4.5.g2.avg-rotation",
        "m4.5.g2.access",
        "m4.5.g2.seek-purpose"
      ]
    },
    {
      "id": "cslez4_5_03_disks_03",
      "title": "Indirizzamento a blocchi e frammentazione",
      "format": "intero / scelta multipla",
      "variants": [
        "m4.5.g3.offset",
        "m4.5.g3.blocks",
        "m4.5.g3.fragment",
        "m4.5.g3.lba-meaning"
      ]
    },
    {
      "id": "cslez4_5_04_disks_04",
      "title": "Velocità e tempo di trasferimento",
      "format": "decimale / intero / scelta multipla",
      "variants": [
        "m4.5.g4.rate",
        "m4.5.g4.sequential",
        "m4.5.g4.transfer",
        "m4.5.g4.queue-total"
      ]
    },
    {
      "id": "cslez4_5_05_disks_05",
      "title": "Ordine delle letture e località",
      "format": "decimale / scelta multipla",
      "variants": [
        "m4.5.g5.read-order",
        "m4.5.g5.locality",
        "m4.5.g5.average",
        "m4.5.g5.geometry-abstraction"
      ]
    }
  ]
});
