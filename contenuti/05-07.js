'use strict';
SL.catalogo.push({
  "id": "5.7",
  "title": "Deadlock, starvation e livelock",
  "units": [
    {
      "id": "5.7.1",
      "title": "Il deadlock come struttura di dipendenze",
      "experiment": "Esamina prima X e Y con una sola istanza. Aggiungi poi la seconda istanza di Y posseduta da C e segui il rilascio che C può effettuare.",
      "skill": "Leggere un grafo di attesa",
      "check": "Nel secondo caso compare una via di completamento esterna al ciclo. Per decidere se il sistema è bloccato conta anche chi può restituire un’istanza."
    },
    {
      "id": "5.7.2",
      "title": "Le condizioni di Coffman e la prevenzione",
      "experiment": "Confronta il rango crescente con la prenotazione in blocco. Per ciascuna regola osserva quali risorse possiede il processo costretto ad attendere.",
      "skill": "Collegare un vincolo alla prevenzione",
      "check": "L’ordine crescente impedisce il ritorno a un rango inferiore. La prenotazione dell’intero insieme lascia il processo in attesa a mani vuote."
    },
    {
      "id": "5.7.3",
      "title": "Evitamento e sequenze sicure di completamento",
      "experiment": "Imposta le quantità di X e Y inizialmente libere. Confronta i bisogni residui di ogni processo con entrambe le disponibilità e segui i completamenti proposti.",
      "skill": "Costruire una sequenza sicura",
      "check": "Dopo un completamento ipotetico, le risorse già assegnate al processo si aggiungono a quelle disponibili. Un bisogno deve rientrare nelle disponibilità per entrambe le componenti."
    },
    {
      "id": "5.7.4",
      "title": "Rilevamento e recupero",
      "experiment": "Prova prima il rollback di A, poi quello di B. Nel grafo segui la richiesta cancellata, il lock liberato e la transazione che può completare.",
      "skill": "Valutare una strategia di recupero",
      "check": "Il recupero libera il lock della vittima e ripristina i suoi dati. La risorsa tornata disponibile permette all’altra transazione di sciogliere l’attesa."
    },
    {
      "id": "5.7.5",
      "title": "Distinguere starvation e livelock nelle tracce",
      "experiment": "Mantieni fisso il numero di giri e confronta gli arrivi dei lettori con i ritiri simultanei dei due worker. Annota chi termina un’operazione dopo ciascun giro.",
      "skill": "Individuare la causa della mancanza di progresso",
      "check": "Nella sequenza dei lettori cresce il numero di completamenti e lo scrittore resta in coda. Nei ritiri simultanei i partecipanti compiono azioni e il totale dei completamenti resta fermo."
    },
    {
      "id": "5.7.6",
      "title": "Problemi svolti",
      "experiment": "Segui il test con una sola istanza libera. Confronta i bisogni di A e B con il disponibile, poi ricalcola il disponibile dopo il primo completamento possibile.",
      "skill": "Costruire una sequenza di completamenti con un’istanza libera",
      "check": "Il processo che può completare per primo restituisce anche l’istanza che possedeva all’inizio. Questa restituzione può rendere ammissibile il bisogno dell’altro.",
      "kind": "esercizi"
    },
    {
      "id": "5.7.7",
      "title": "Esercizi",
      "experiment": "Apri la prova sul ciclo nel grafo di assegnazione. Distingui gli archi di richiesta da quelli di possesso e confronta le due tracce contando le istanze di Y.",
      "skill": "Motivare la diagnosi di deadlock",
      "check": "Lo stesso ciclo ha esiti diversi se un processo esterno può liberare l’istanza richiesta. Il grafo va letto insieme ai possessori delle risorse.",
      "kind": "esercizi"
    },
    {
      "id": "5.7.8",
      "title": "Soluzioni",
      "experiment": "Ripercorri la prova sulla sequenza sicura. Calcola il bisogno residuo di B, quindi verifica se le istanze libere consentono un primo completamento.",
      "skill": "Verificare una sequenza di sicurezza",
      "check": "Un ordine di completamento che copre tutti i massimi dimostra la sicurezza. Un esito insicuro riguarda la garanzia futura. Per diagnosticare uno stallo attuale servono le richieste pendenti.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez5_7_01_deadlock",
      "title": "Stallo, attesa indefinita e livelock",
      "format": "scelta multipla",
      "variants": [
        "m5.7.g1.starvation",
        "m5.7.g1.livelock",
        "m5.7.g1.deadlock",
        "m5.7.g1.temporary-block"
      ]
    },
    {
      "id": "cslez5_7_02_deadlock",
      "title": "Condizioni di Coffman",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.7.g2.mutual-exclusion",
        "m5.7.g2.hold-wait",
        "m5.7.g2.no-preemption",
        "m5.7.g2.coffman-count"
      ]
    },
    {
      "id": "cslez5_7_03_deadlock",
      "title": "Cicli nel grafo delle risorse",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.7.g3.edge-directions",
        "m5.7.g3.two-lock-edge-count",
        "m5.7.g3.cycle-single-instance",
        "m5.7.g3.cycle-multiple"
      ]
    },
    {
      "id": "cslez5_7_04_deadlock",
      "title": "Prevenzione e ordine di acquisizione",
      "format": "scelta multipla",
      "variants": [
        "m5.7.g4.global-order",
        "m5.7.g4.rank-violation",
        "m5.7.g4.all-at-once",
        "m5.7.g4.preemptable"
      ]
    },
    {
      "id": "cslez5_7_05_deadlock",
      "title": "Stati sicuri, rilevamento e recupero",
      "format": "scelta multipla",
      "variants": [
        "m5.7.g5.unsafe-not-deadlocked",
        "m5.7.g5.avoidance-info",
        "m5.7.g5.detection-recovery",
        "m5.7.g5.safe-sequence"
      ]
    }
  ]
});
