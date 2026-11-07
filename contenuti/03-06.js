'use strict';
SL.catalogo.push({
  "id": "3.6",
  "title": "Il processore in pipeline a cinque stadi",
  "units": [
    {
      "id": "3.6.1",
      "title": "Dalla sovrapposizione alla pipeline controllata",
      "experiment": "Scegli sei istruzioni e il ciclo 4. Annota le occupazioni correnti, poi confronta gli ingressi D, E, M, W con lo stato acquisito al fronte successivo.",
      "skill": "Leggere lo stato simultaneo",
      "check": "Ciascuna destinazione acquisisce il dato del proprio predecessore nello stesso istante. Un’unica istruzione può quindi avanzare di un solo stadio per fronte."
    },
    {
      "id": "3.6.2",
      "title": "Stato della pipeline e controllo del prelievo",
      "experiment": "Assegna tre PC distinti. Attiva ret in W, poi attiva anche la correzione del salto in M. Confronta il nome della sorgente scelta e f_pc.",
      "skill": "Selezionare il prossimo PC",
      "check": "Con entrambi i controlli attivi vince la correzione del salto. In sua assenza il ritorno ha precedenza sull’indirizzo predetto."
    },
    {
      "id": "3.6.3",
      "title": "Dipendenze dei dati e forwarding",
      "experiment": "Imposta un carico verso %rax in M. In E passa dall’addq che scrive %rax alla cmov con condizione falsa e confronta fonte e valore di d_valA.",
      "skill": "Scegliere il bypass corretto",
      "check": "Un risultato più recente ha precedenza solo se la sua destinazione è valida e coincide con la sorgente. La cmov fallita lascia disponibile il valore del produttore in M."
    },
    {
      "id": "3.6.4",
      "title": "Conflitti di controllo, stalli e bolle",
      "experiment": "Scegli indirizzo del salto e destinazione. Confronta condizione vera e falsa seguendo P0 e P1 al fronte successivo e annotando il nuovo indirizzo di prelievo.",
      "skill": "Eliminare istruzioni speculative",
      "check": "Quando la previsione è errata, D ed E ricevono bolle al fronte e il salto ormai in M fornisce il PC sequenziale. Una previsione corretta conserva le due istruzioni giovani."
    },
    {
      "id": "3.6.5",
      "title": "Priorità dei conflitti e stato preciso",
      "experiment": "Confronta popq %rsp seguita da ret con addq seguita da ret. Nel secondo caso passa dallo stato AOK a un errore ADR in M e osserva anche la scrittura dei flag.",
      "skill": "Risolvere richieste concorrenti di controllo",
      "check": "La dipendenza del ritorno dal carico decide se D deve conservare l’istruzione. L’errore più anziano in M blocca separatamente gli effetti dell’addq più giovane."
    },
    {
      "id": "3.6.6",
      "title": "Traccia e conteggio delle prestazioni",
      "experiment": "Con un solo blocco confronta gli ordini L·U·I e L·I·U. Annota quando U resta in D e quando l’ultima istruzione completa W. Aumenta poi il numero di blocchi.",
      "skill": "Attribuire cicli persi a una causa",
      "check": "Ogni uso immediato del carico richiede un ciclo di attesa. Interporre la copia indipendente lascia arrivare il dato in tempo per l’ingresso del consumatore in E."
    },
    {
      "id": "3.6.7",
      "title": "Misurare e spiegare le prestazioni",
      "experiment": "Fissa il numero di ripetizioni e raddoppia il periodo di clock. Confronta i cicli dei due ordini, il tempo risparmiato e il rapporto fra i tempi.",
      "skill": "Spiegare una differenza di CPI",
      "check": "Il riordino elimina gli stalli ripetuti. Raddoppiando il periodo a parità di programma raddoppiano i tempi assoluti, mentre il rapporto di accelerazione resta invariato."
    },
    {
      "id": "3.6.8",
      "title": "Problemi svolti",
      "experiment": "Osserva I2 in D e I1 in E. Annota il dato preparato per ciascuna destinazione e confronta le tue previsioni con i registri subito dopo il fronte.",
      "skill": "Calcolare gli aggiornamenti al fronte",
      "check": "Dopo il fronte M contiene l’istruzione che si trovava prima in E. Quella che D ha appena trasferito in E arriverà in M al fronte seguente.",
      "kind": "esercizi"
    },
    {
      "id": "3.6.9",
      "title": "Esercizi",
      "experiment": "Apri «Applicare il controllo di D ed E». Esamina prima i segnali di stallo, poi quelli di bolla e confronta i valori cambiando traccia.",
      "skill": "Derivare i segnali di stallo e di bolla",
      "check": "Se D deve trattenere il consumatore per una dipendenza, resta occupato da quell’istruzione. La bolla a valle permette al produttore di avanzare.",
      "kind": "esercizi"
    },
    {
      "id": "3.6.10",
      "title": "Soluzioni",
      "experiment": "Scegli «Datare la scrittura del consumatore». Segui separatamente il primo ingresso di U in D, l’eventuale attesa e il ciclo in cui U raggiunge W.",
      "skill": "Datare la scrittura del consumatore",
      "check": "Inserire un’istruzione indipendente sposta l’ingresso iniziale di U. Per ricavare il ciclo di scrittura occorre tenere conto sia della posizione di U sia dei cicli trascorsi in attesa del dato.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez3_6_01_random_assembly",
      "title": "Istruzioni presenti nei cinque stadi",
      "format": "assembly",
      "variants": [
        "m3.6.b1.stage-of",
        "m3.6.b1.in-f",
        "m3.6.b1.in-d",
        "m3.6.b1.in-e",
        "m3.6.b1.in-m",
        "m3.6.b1.in-w",
        "m3.6.b1.active",
        "m3.6.b1.occupancy"
      ]
    },
    {
      "id": "cslez3_6_02_random_assembly",
      "title": "Abilitazione e controllo dei registri di pipeline",
      "format": "assembly",
      "variants": [
        "m3.6.b2.fd-pc",
        "m3.6.b2.reg-enable",
        "m3.6.b2.reg-stall",
        "m3.6.b2.stall-bubble-priority",
        "m3.6.b2.cc-not-register",
        "m3.6.b2.valid-bit",
        "m3.6.b2.control-pack",
        "m3.6.b2.data-control-consistency"
      ]
    },
    {
      "id": "cslez3_6_03_random_assembly",
      "title": "Priorità nella selezione del PC",
      "format": "assembly",
      "variants": [
        "m3.6.b3.pc-fallthrough",
        "m3.6.b3.pc-jump",
        "m3.6.b3.pc-prev-cycle",
        "m3.6.b3.pc-status",
        "m3.6.b3.pc-priority",
        "m3.6.b3.pc-hold",
        "m3.6.b3.pc-valid",
        "m3.6.b3.pc-sequential-length"
      ]
    },
    {
      "id": "cslez3_6_04_random_assembly",
      "title": "Cronologia degli stadi e completamento",
      "format": "assembly",
      "variants": [
        "m3.6.b4.stage-code",
        "m3.6.b4.active-count",
        "m3.6.b4.fetch-cycle",
        "m3.6.b4.writeback-cycle",
        "m3.6.b4.stage-distance",
        "m3.6.b4.full-pipeline",
        "m3.6.b4.remaining-stages",
        "m3.6.b4.next-stage"
      ]
    },
    {
      "id": "cslez3_6_05_random_assembly",
      "title": "Trasferimenti tra stadi e bolle",
      "format": "assembly",
      "variants": [
        "m3.6.b5.fd-valid",
        "m3.6.b5.de-hold",
        "m3.6.b5.em-pack",
        "m3.6.b5.mw-select",
        "m3.6.b5.bubble-control",
        "m3.6.b5.pipeline-register",
        "m3.6.b5.signal-naming",
        "m3.6.b5.two-stage-transfer"
      ]
    }
  ]
});
