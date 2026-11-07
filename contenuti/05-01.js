'use strict';
SL.catalogo.push({
  "id": "5.1",
  "title": "Processi, stati e cambi di contesto",
  "units": [
    {
      "id": "5.1.1",
      "title": "Il processo come astrazione di esecuzione e protezione",
      "experiment": "Scegli il valore che A scrive in x. Avanza fino alla lettura di B e confronta le due celle indicate con 0x1000.",
      "skill": "Distinguere programma e processo",
      "check": "L’indirizzo virtuale coincide, mentre il valore letto dipende dalla pagina privata del processo selezionato."
    },
    {
      "id": "5.1.2",
      "title": "Dall’esecuzione agli stati di pronto e bloccato",
      "experiment": "Seleziona la lettura su disco, poi ripeti con la fine del quanto. Per ogni evento annota lo stato di A appena B riceve il core, poi osserva il passo finale.",
      "skill": "Tracciare le transizioni di stato",
      "check": "La lettura sospende A fino al completamento del disco. Alla scadenza del quanto, A entra direttamente nella coda dei pronti."
    },
    {
      "id": "5.1.3",
      "title": "Il cambio di contesto e la continuità dell’esecuzione",
      "experiment": "Imposta il numero di istruzioni completate da A. Annota il PC salvato all’arrivo del timer e confrontalo con quello caricato al ritorno di A.",
      "skill": "Salvare e ripristinare i registri",
      "check": "Ogni istruzione fa avanzare il PC di quattro byte. Il turno di B lascia intatto il valore conservato per A."
    },
    {
      "id": "5.1.4",
      "title": "Quali dati conserva il kernel",
      "experiment": "Per la lettura individua A nella coda del disco. Poi seleziona il cambio di processo e segui il riferimento alla tabella delle pagine di B.",
      "skill": "Individuare la coda di attesa e la tabella delle pagine",
      "check": "La notifica del disco identifica il processo da risvegliare attraverso la coda. Il cambio di processo seleziona la radice che tradurrà l’indirizzo successivo."
    },
    {
      "id": "5.1.5",
      "title": "Problemi svolti",
      "experiment": "Annota il PC di A prima del cambio. Segui la copia nella scheda di A e confrontala con il PC del core quando A riprende.",
      "skill": "Ordinare salvataggio e ripristino",
      "check": "Il PC del core cambia durante il turno di B. Il valore nella scheda di A permette di ritrovare l’indirizzo da cui A deve riprendere.",
      "kind": "esercizi"
    },
    {
      "id": "5.1.6",
      "title": "Esercizi",
      "experiment": "Scegli la prova sulle transizioni di A. Indica il suo stato subito dopo ciascun evento, poi confronta l’altra traccia.",
      "skill": "Classificare gli eventi del processo",
      "check": "Lo stato dipende dall’evento atteso. A può attendere il completamento della richiesta oppure l’assegnazione del core.",
      "kind": "esercizi"
    },
    {
      "id": "5.1.7",
      "title": "Soluzioni",
      "experiment": "Ripercorri «Assegnare i pronti ai core». Conta prima i processi in attesa della rete, poi quelli a cui il dispatcher può assegnare un core.",
      "skill": "Contare i processi pronti, bloccati e in esecuzione",
      "check": "Il totale si ricostruisce sommando processi in esecuzione, pronti rimasti in coda e bloccati. Una notifica di rete può cambiare quest’ultimo gruppo.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez5_1_01_processes",
      "title": "Programmi, processi e parallelismo",
      "format": "scelta multipla",
      "variants": [
        "m5.1.g1.program-file",
        "m5.1.g1.multiprogramming",
        "m5.1.g1.single-core-pseudoparallel",
        "m5.1.g1.true-parallelism"
      ]
    },
    {
      "id": "cslez5_1_02_processes",
      "title": "Transizioni fra gli stati di un processo",
      "format": "scelta multipla",
      "variants": [
        "m5.1.g2.io-request",
        "m5.1.g2.io-completion",
        "m5.1.g2.quantum-expiry",
        "m5.1.g2.admission"
      ]
    },
    {
      "id": "cslez5_1_03_processes",
      "title": "Contesto salvato e PCB",
      "format": "scelta multipla",
      "variants": [
        "m5.1.g3.saved-pc",
        "m5.1.g3.pcb-not-memory",
        "m5.1.g3.interrupt-no-switch",
        "m5.1.g3.context-components"
      ]
    },
    {
      "id": "cslez5_1_04_processes",
      "title": "Costo dei cambi e tempi di risposta",
      "format": "decimale / intero",
      "variants": [
        "m5.1.g4.switch-overhead",
        "m5.1.g4.fourth-response",
        "m5.1.g4.two-core-running",
        "m5.1.g4.ready-count"
      ]
    },
    {
      "id": "cslez5_1_05_processes",
      "title": "Ordine di esecuzione e assegnazione ai core",
      "format": "scelta multipla",
      "variants": [
        "m5.1.g5.completion-scheduling",
        "m5.1.g5.multicore-placement",
        "m5.1.g5.ready-vs-blocked-scenario",
        "m5.1.g5.switch-order"
      ]
    }
  ]
});
