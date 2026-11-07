'use strict';
SL.catalogo.push({
  "id": "4.7",
  "title": "Classi di dispositivi e accesso diretto alla memoria",
  "units": [
    {
      "id": "4.7.1",
      "title": "I/O programmato e motivazione del DMA",
      "experiment": "Fissa la preparazione DMA a 32 cicli e prova richieste di 6, 7 e 8 parole. Confronta i cicli CPU dei due percorsi e il segno del risparmio.",
      "skill": "Separare costo fisso e costo per byte",
      "check": "Il costo dell’I/O programmato cresce di sei cicli per parola. Il costo CPU del DMA rimane fisso per richiesta e comprende anche il servizio di completamento."
    },
    {
      "id": "4.7.2",
      "title": "Il DMA come transazione di memoria delegata",
      "experiment": "Richiedi 37 byte e confronta transazioni massime da 8 e da 16 byte. Inverti la direzione e leggi il tipo di accesso alla RAM.",
      "skill": "Tracciare un trasferimento DMA",
      "check": "La larghezza può cambiare il numero di transazioni e l’indirizzo di inizio dell’ultima. A lunghezza uguale l’ultimo byte del buffer conserva il proprio indirizzo."
    },
    {
      "id": "4.7.3",
      "title": "Interfacce, descrittori e proprietà dei buffer",
      "experiment": "Imposta quattro slot e sei richieste. Porta i completamenti da zero a due e segui il passaggio di proprietà nell’anello.",
      "skill": "Seguire il passaggio di proprietà",
      "check": "Le richieste in eccesso restano in attesa. Ogni completamento recuperato libera uno slot. La somma di slot ancora attivi e liberi coincide con la capacità dell’anello."
    },
    {
      "id": "4.7.4",
      "title": "Coerenza, ordinamento e indirizzi visibili al dispositivo",
      "experiment": "Fissa l’offset e prova tutte e tre le preparazioni del driver. Confronta indirizzo programmato, contenuto della RAM e byte ricevuto dal dispositivo.",
      "skill": "Verificare indirizzo e autorizzazione DMA",
      "check": "L’indirizzo DMA corretto abilita la traduzione. A indirizzo valido, una cache CPU ancora sporca lascia al dispositivo il vecchio byte in RAM."
    },
    {
      "id": "4.7.5",
      "title": "Completamento e ritorno allo scheduling",
      "experiment": "Mantieni fissi trasferimento e notifica, poi aumenta l’attesa dello scheduler. Confronta gli istanti dell’ultimo byte, del risveglio e della ripresa.",
      "skill": "Distinguere completamento e ripresa",
      "check": "Una maggiore attesa dei pronti sposta solo la ripresa. Il ritardo misurato dall’ultimo byte comprende notifica, servizio del driver e attesa del core."
    },
    {
      "id": "4.7.6",
      "title": "Problemi svolti",
      "experiment": "Segui la richiesta da 8 MiB fino all’ultimo byte. Calcola la durata in secondi, converti in millisecondi e individua i due interventi del driver.",
      "skill": "Separare durata e occupazione CPU",
      "check": "La divisione fra MiB e MiB/s misura il tempo dati. Le fasi di preparazione e completamento individuano i periodi di lavoro della CPU.",
      "kind": "esercizi"
    },
    {
      "id": "4.7.7",
      "title": "Esercizi",
      "experiment": "Apri «Configurare indirizzo e direzione DMA». Segui il pacchetto in ricezione nella prima traccia e ricostruisci l’intervallo letto per la trasmissione nella seconda.",
      "skill": "Determinare direzione e intervallo di un trasferimento DMA",
      "check": "Ricezione e trasmissione producono accessi alla RAM di verso opposto. Nell’intervallo contiguo il conteggio include sia il primo byte sia l’ultimo.",
      "kind": "esercizi"
    },
    {
      "id": "4.7.8",
      "title": "Soluzioni",
      "experiment": "Apri «Confrontare costo fisso e completamento effettivo». Nella seconda traccia disponi in ordine ultimo byte, notifica, fine del servizio e ritorno sul core.",
      "skill": "Separare fine del DMA, notifica e ripresa del thread",
      "check": "La differenza fra ultimo e primo istante della sequenza coincide con la somma di tre durate. La distinzione fra pronto e in esecuzione spiega l’ultimo intervallo.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez4_7_01_dma_01",
      "title": "Dispositivi a caratteri e a blocchi",
      "format": "scelta multipla",
      "variants": [
        "m4.7.g1.char",
        "m4.7.g1.block",
        "m4.7.g1.random",
        "m4.7.g1.stream"
      ]
    },
    {
      "id": "cslez4_7_02_dma_02",
      "title": "Driver e gestione delle richieste",
      "format": "scelta multipla",
      "variants": [
        "m4.7.g2.driver-role",
        "m4.7.g2.request-order",
        "m4.7.g2.status",
        "m4.7.g2.abstraction"
      ]
    },
    {
      "id": "cslez4_7_03_dma_03",
      "title": "Configurazione e completamento del DMA",
      "format": "scelta multipla",
      "variants": [
        "m4.7.g3.dma-config",
        "m4.7.g3.dma-order",
        "m4.7.g3.final",
        "m4.7.g3.bus-master"
      ]
    },
    {
      "id": "cslez4_7_04_dma_04",
      "title": "Costo temporale e impegno della CPU",
      "format": "decimale / intero / scelta multipla",
      "variants": [
        "m4.7.g4.time",
        "m4.7.g4.interrupts",
        "m4.7.g4.cpu-saving",
        "m4.7.g4.rate"
      ]
    },
    {
      "id": "cslez4_7_05_dma_05",
      "title": "Confrontare I/O programmato e DMA",
      "format": "scelta multipla",
      "variants": [
        "m4.7.g5.pio-dma",
        "m4.7.g5.arbitration",
        "m4.7.g5.cpu-role",
        "m4.7.g5.end-to-end"
      ]
    }
  ]
});
