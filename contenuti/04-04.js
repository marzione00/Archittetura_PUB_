'use strict';
SL.catalogo.push({
  "id": "4.4",
  "title": "Bus, transazioni e interconnessioni",
  "units": [
    {
      "id": "4.4.1",
      "title": "Regole di comunicazione di un’interconnessione",
      "experiment": "Concedi il bus alla CPU e prova gli indirizzi 127, 128 e 144. Su un indirizzo ammesso cambia da lettura a scrittura e individua chi fornisce il dato.",
      "skill": "Distinguere arbitro e richiedente",
      "check": "Ai due lati del confine cambiano destinatario e offset locale. Oltre la regione del controller compare un errore di indirizzo prima del trasferimento."
    },
    {
      "id": "4.4.2",
      "title": "Larghezza, clock e topologia",
      "experiment": "Mantieni larghezza e clock costanti. Passa dal bus SDR condiviso ai due collegamenti SDR, poi ai due collegamenti DDR.",
      "skill": "Calcolare il flusso lordo",
      "check": "Un secondo collegamento indipendente aumenta i flussi serviti insieme. La modalità DDR aumenta invece il numero di trasferimenti per ciclo su ciascun collegamento."
    },
    {
      "id": "4.4.3",
      "title": "Transazioni e semantica del protocollo",
      "experiment": "Con quattro parole e due cicli di attesa per indirizzo, confronta la raffica con le transazioni singole. Conta presentazioni dell’indirizzo e cicli dati.",
      "skill": "Interpretare un handshake",
      "check": "Le parole trasferite occupano lo stesso numero di cicli dati. Con le transazioni singole si ripetono l’indirizzamento e le attese associate a ogni presentazione."
    },
    {
      "id": "4.4.4",
      "title": "Banda, coordinamento e arbitraggio",
      "experiment": "Fissa B come ultimo richiedente servito. Alterna round-robin e priorità fissa, quindi individua nella cronologia l’arbitraggio di B, il suo primo dato e il completamento.",
      "skill": "Calcolare attesa e risposta",
      "check": "Ogni richiedente davanti a B lo ritarda di un turno intero. Il primo dato di B viene dopo il suo ciclo di arbitraggio."
    },
    {
      "id": "4.4.5",
      "title": "Gerarchie e reti punto a punto",
      "experiment": "Mantieni fisso il numero di pacchetti davanti al tuo. Invia il secondo flusso prima sulla stessa uscita e poi su quella indipendente, osservando l’attesa al ponte.",
      "skill": "Localizzare la contesa",
      "check": "Soltanto il flusso che precede il pacchetto sulla sua uscita aggiunge un tempo di serializzazione alla coda. I tempi dei due collegamenti del pacchetto restano gli stessi."
    },
    {
      "id": "4.4.6",
      "title": "Problemi svolti",
      "experiment": "Ricava i byte per trasferimento dai 32 bit del bus. Avanza dalla banda lorda al carico utile applicando la quota dell’80%.",
      "skill": "Distinguere velocità lorda e utile",
      "check": "La banda utile si misura sui soli byte di dati. Dividendo banda utile per banda lorda si ritrova la quota di payload assegnata.",
      "kind": "esercizi"
    },
    {
      "id": "4.4.7",
      "title": "Esercizi",
      "experiment": "Scegli «Misurare tempo e banda utile». In ciascuna traccia converti la banda in byte per microsecondo e aggiungi al trasferimento il tempo di controllo.",
      "skill": "Calcolare la banda utile con un tempo di controllo",
      "check": "La durata della transazione comprende anche i cicli senza dati utili. Dividere il payload per questa durata restituisce la banda realmente disponibile all’applicazione.",
      "kind": "esercizi"
    },
    {
      "id": "4.4.8",
      "title": "Soluzioni",
      "experiment": "Apri «Misurare l’attesa per una concessione». Disegna l’ordine di servizio delle due tracce e somma le durate dei turni che precedono il richiedente osservato.",
      "skill": "Calcolare l’attesa di arbitraggio",
      "check": "Nel round-robin il punto di partenza dipende dall’ultimo servito. Nella catena a priorità fissa l’attesa dipende dai turni dei richiedenti di rango superiore.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez4_4_01_buses_01",
      "title": "Tempo di trasferimento e banda utile",
      "format": "decimale",
      "variants": [
        "m4.4.g1.transfer-time",
        "m4.4.g1.effective",
        "m4.4.g1.utilization",
        "m4.4.g1.payload"
      ]
    },
    {
      "id": "cslez4_4_02_buses_02",
      "title": "Larghezza del bus e cicli di trasferimento",
      "format": "decimale / intero",
      "variants": [
        "m4.4.g2.data-width",
        "m4.4.g2.address-space",
        "m4.4.g2.ddr-rate",
        "m4.4.g2.beats"
      ]
    },
    {
      "id": "cslez4_4_03_buses_03",
      "title": "Arbitraggio e tempi di attesa",
      "format": "intero / scelta multipla",
      "variants": [
        "m4.4.g3.round-robin",
        "m4.4.g3.daisy",
        "m4.4.g3.wait",
        "m4.4.g3.arbitration-purpose"
      ]
    },
    {
      "id": "cslez4_4_04_buses_04",
      "title": "Trasferimenti sincroni, asincroni e a raffica",
      "format": "scelta multipla",
      "variants": [
        "m4.4.g4.sync",
        "m4.4.g4.async",
        "m4.4.g4.burst",
        "m4.4.g4.handshake-order"
      ]
    },
    {
      "id": "cslez4_4_05_buses_05",
      "title": "Collegamenti bidirezionali, code e latenza",
      "format": "decimale / intero / scelta multipla",
      "variants": [
        "m4.4.g5.full-duplex",
        "m4.4.g5.queue",
        "m4.4.g5.latency",
        "m4.4.g5.order"
      ]
    }
  ]
});
