'use strict';
SL.catalogo.push({
  "id": "3.5",
  "title": "Pipeline: sovrapposizione, capacità di completamento e conflitti",
  "units": [
    {
      "id": "3.5.1",
      "title": "Sovrapposizione, capacità di completamento e latenza",
      "experiment": "Conserva numero di stadi e periodo. Misura una sola istruzione, poi aggiungine tre e confronta il primo completamento con la durata totale.",
      "skill": "Distinguere latenza e intervallo di completamento",
      "check": "La prima istruzione attraversa tutti gli stadi. Dopo il riempimento, ogni istruzione indipendente aggiunta richiede un solo periodo in più."
    },
    {
      "id": "3.5.2",
      "title": "Leggere i diagrammi temporali della pipeline",
      "experiment": "Scegli cinque istruzioni e porta il ciclo osservato da 4 a 5. Segui I1 nelle tre righe che circondano ogni ciclo scelto.",
      "skill": "Leggere l’occupazione degli stadi",
      "check": "Lo stadio di una stessa istruzione avanza di una posizione per ciclo. I trattini si concentrano all’inizio e alla fine del tratto, durante riempimento e svuotamento."
    },
    {
      "id": "3.5.3",
      "title": "Conflitti dovuti alla sovrapposizione",
      "experiment": "Scegli un carico seguito da un uso e cambia la dipendenza del consumatore. Ripeti il confronto per la porta di memoria e per il salto scegliendo le due condizioni.",
      "skill": "Riconoscere conflitti di dati, risorse e controllo",
      "check": "Il carico dipendente fa attendere D, una richiesta simultanea contende la porta e una previsione di salto errata elimina i prelievi sul cammino sbagliato."
    },
    {
      "id": "3.5.4",
      "title": "Dalla portata ideale al CPI misurato",
      "experiment": "Tieni fissi i cicli persi per dati e salti. Aumenta le istruzioni completate e confronta il CPI con il contributo del riempimento.",
      "skill": "Calcolare il CPI",
      "check": "In una pipeline a cinque stadi il riempimento aggiunge quattro cicli al totale ideale. Distribuiti su più istruzioni, incidono meno su ogni completamento."
    },
    {
      "id": "3.5.5",
      "title": "Problemi svolti",
      "experiment": "Fissa il primo prelievo al ciclo 1. Individua il completamento della prima istruzione, poi conta gli intervalli fino alla ventesima.",
      "skill": "Calcolare i cicli di una sequenza",
      "check": "La distanza fra il primo e l’ultimo completamento dipende dal numero di istruzioni successive alla prima. La latenza iniziale entra nel totale una sola volta.",
      "kind": "esercizi"
    },
    {
      "id": "3.5.6",
      "title": "Esercizi",
      "experiment": "Apri «Contare i cicli di fermo sovrapposti». Allinea le due maschere sul ciclo del bit zero e calcola quanti cicli contengono entrambe le cause e quanti almeno una.",
      "skill": "Contare cicli di fermo sovrapposti",
      "check": "L’intersezione individua i cicli richiesti da entrambe le cause. L’unione conta una volta ogni ciclo effettivamente perso.",
      "kind": "esercizi"
    },
    {
      "id": "3.5.7",
      "title": "Soluzioni",
      "experiment": "Seleziona «Calcolare gli stalli dalla distanza fra istruzioni». Segui produttore e consumatore fino alla lettura del banco e confronta le due distanze proposte.",
      "skill": "Calcolare l’attesa del consumatore",
      "check": "Confrontando il primo ciclo D del consumatore con il ciclo W del produttore si risale alla durata dell’attesa. I semicicli stabiliscono se la lettura è già possibile.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez3_5_01_random_assembly",
      "title": "Riempimento, svuotamento e cicli di pipeline",
      "format": "assembly",
      "variants": [
        "m3.5.b1.latency-five",
        "m3.5.b1.cycles-n",
        "m3.5.b1.cycles-general",
        "m3.5.b1.fill-cycles",
        "m3.5.b1.drain-extra",
        "m3.5.b1.completion-cycle",
        "m3.5.b1.stage-at-cycle",
        "m3.5.b1.inflight"
      ]
    },
    {
      "id": "cslez3_5_02_random_assembly",
      "title": "Latenza, produttività e accelerazione",
      "format": "assembly",
      "variants": [
        "m3.5.b2.single-time",
        "m3.5.b2.pipe-time",
        "m3.5.b2.speedup-benefit",
        "m3.5.b2.asymptotic-speedup",
        "m3.5.b2.throughput-period",
        "m3.5.b2.clock-max-stage",
        "m3.5.b2.clock-overhead",
        "m3.5.b2.latency-pipe"
      ]
    },
    {
      "id": "cslez3_5_03_random_assembly",
      "title": "Dipendenze di lettura dopo scrittura",
      "format": "assembly",
      "variants": [
        "m3.5.b3.raw-srcA-dstE",
        "m3.5.b3.any-raw",
        "m3.5.b3.none-safe",
        "m3.5.b3.two-producers",
        "m3.5.b3.both-sources",
        "m3.5.b3.dependency-mask",
        "m3.5.b3.dependency-valid",
        "m3.5.b3.branch-dependency"
      ]
    },
    {
      "id": "cslez3_5_04_random_assembly",
      "title": "Conteggio e sovrapposizione degli stalli",
      "format": "assembly",
      "variants": [
        "m3.5.b4.raw-delay",
        "m3.5.b4.raw-present",
        "m3.5.b4.two-sources",
        "m3.5.b4.dependency-count",
        "m3.5.b4.control-gap",
        "m3.5.b4.stall-total",
        "m3.5.b4.stall-overlap",
        "m3.5.b4.cpi-from-stalls"
      ]
    },
    {
      "id": "cslez3_5_05_random_assembly",
      "title": "Distanza tra istruzioni dipendenti",
      "format": "assembly",
      "variants": [
        "m3.5.b5.independent-between",
        "m3.5.b5.sequence-length",
        "m3.5.b5.pipeline-cycles",
        "m3.5.b5.speedup-loss",
        "m3.5.b5.safe-distance",
        "m3.5.b5.independent-flag",
        "m3.5.b5.latency-throughput",
        "m3.5.b5.completion-cycle"
      ]
    }
  ]
});
