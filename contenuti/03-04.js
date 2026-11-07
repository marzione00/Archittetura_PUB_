'use strict';
SL.catalogo.push({
  "id": "3.4",
  "title": "Il processore sequenziale",
  "units": [
    {
      "id": "3.4.1",
      "title": "Dalle fasi dell’ISA a una macchina sincrona",
      "experiment": "Scegli %rax=9 e %rbx=4. Segui subq attraverso decodifica e ALU. Confronta il valore interno valE con %rbx e i flag acquisiti al fronte.",
      "skill": "Separare calcolo e aggiornamento",
      "check": "L’ALU sottrae la sorgente %rax dal vecchio %rbx. Il risultato si forma durante il ciclo e diventa stato architetturale al fronte."
    },
    {
      "id": "3.4.2",
      "title": "Il percorso dati a ciclo singolo di SEQ",
      "experiment": "Mantieni fisso %rsp e cambia il dato in %rax. Confronta la parola scritta, il suo indirizzo e il nuovo puntatore. Ripeti variando solo %rsp.",
      "skill": "Seguire i dati di pushq in SEQ",
      "check": "Il dato scritto proviene da %rax. Il vecchio puntatore meno otto fornisce sia l’indirizzo di memoria sia il nuovo %rsp."
    },
    {
      "id": "3.4.3",
      "title": "Temporizzazione e aggiornamento dello stato",
      "experiment": "Mantieni fisso il ritardo di prelievo. Imposta la memoria dati a un ritardo superiore a quello del selettore aritmetico, poi rendila più veloce del selettore.",
      "skill": "Dimensionare il ciclo",
      "check": "Il tratto comune pesa su entrambe le istruzioni. Il maggiore dei due ritardi finali identifica il cammino critico al quale si aggiunge il costo dei registri."
    },
    {
      "id": "3.4.4",
      "title": "Equazioni di controllo, traccia e verifica",
      "experiment": "Con lo stesso %rsp iniziale, esegui prima pushq %rax e poi popq %rax. Segui mem_addr, gli abilitatori di lettura e scrittura e il valore finale di %rax.",
      "skill": "Derivare il segnale mem_addr",
      "check": "La push indirizza la nuova cima e vi scrive il registro. La pop indirizza la vecchia cima e trasferisce in %rax il dato appena letto."
    },
    {
      "id": "3.4.5",
      "title": "Oltre SEQ a ciclo singolo",
      "experiment": "Scegli il numero di operazioni aritmetiche e di carichi. Varia soltanto il periodo multiciclo e osserva la differenza tra i tempi totali in picosecondi.",
      "skill": "Confrontare due microarchitetture",
      "check": "Ogni carico costa cinque cicli nel multiciclo e ogni operazione aritmetica tre. La convenienza dipende insieme dal periodo e dalla composizione del programma."
    },
    {
      "id": "3.4.6",
      "title": "Problemi svolti",
      "experiment": "Parti da %rsp=0x1000 e dato 0xAA. Individua prima il valore calcolato dall’ALU, poi l’indirizzo e il dato sulla porta di memoria.",
      "skill": "Calcolare l’indirizzo dello stack",
      "check": "La stessa uscita valE prepara il nuovo puntatore e indirizza la memoria. Il dato salvato arriva dalla porta di lettura del registro sorgente.",
      "kind": "esercizi"
    },
    {
      "id": "3.4.7",
      "title": "Esercizi",
      "experiment": "Seleziona «Confrontare le due direzioni dello stack». Calcola aluA, valE e mem_addr per pushq e per popq, tenendo separati puntatore e indirizzo dei dati.",
      "skill": "Seguire il puntatore e l’indirizzo della pila",
      "check": "Su una push la porta di memoria seleziona valE. Su una pop serve la vecchia cima mentre l’ALU prepara il valore incrementato del puntatore.",
      "kind": "esercizi"
    },
    {
      "id": "3.4.8",
      "title": "Soluzioni",
      "experiment": "Scegli «Scegliere il PC dopo jne». Confronta il PC sequenziale con la destinazione e verifica come il vecchio ZF determina il PC finale nelle due tracce.",
      "skill": "Selezionare il PC dopo un salto condizionale",
      "check": "Il salto lascia intatto ZF. Il selettore del PC si basa su quel flag e sceglie fra l’indirizzo sequenziale e il bersaglio già decodificato.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez3_4_01_random_assembly",
      "title": "Ingressi dell’ALU e aggiornamento dello stack",
      "format": "assembly",
      "variants": [
        "m3.4.b1.aluA-valA",
        "m3.4.b1.aluA-minus8",
        "m3.4.b1.aluA-plus8",
        "m3.4.b1.aluB-zero",
        "m3.4.b1.alu-add-inputs",
        "m3.4.b1.alu-sub-inputs",
        "m3.4.b1.push-new-rsp",
        "m3.4.b1.pop-new-rsp"
      ]
    },
    {
      "id": "cslez3_4_02_random_assembly",
      "title": "Indirizzi di memoria e limiti degli accessi",
      "format": "assembly",
      "variants": [
        "m3.4.b2.addr-base-disp",
        "m3.4.b2.addr-index8",
        "m3.4.b2.addr-stack-old",
        "m3.4.b2.addr-stack-new",
        "m3.4.b2.mem-size-qword",
        "m3.4.b2.mem-end",
        "m3.4.b2.mem-align",
        "m3.4.b2.mem-cross-page"
      ]
    },
    {
      "id": "cslez3_4_03_random_assembly",
      "title": "Segnali di controllo di SEQ",
      "format": "assembly",
      "variants": [
        "m3.4.b3.reg-write-e",
        "m3.4.b3.set-cc",
        "m3.4.b3.mem-read",
        "m3.4.b3.mem-write",
        "m3.4.b3.use-valc",
        "m3.4.b3.use-valp",
        "m3.4.b3.pc-src-ret",
        "m3.4.b3.exclusive-memory"
      ]
    },
    {
      "id": "cslez3_4_04_random_assembly",
      "title": "Cammino critico e periodo di clock",
      "format": "assembly",
      "variants": [
        "m3.4.b4.sum-path",
        "m3.4.b4.critical-max",
        "m3.4.b4.clock-period",
        "m3.4.b4.cycles-per-microsecond",
        "m3.4.b4.instruction-time",
        "m3.4.b4.path-fetch-exec",
        "m3.4.b4.path-store",
        "m3.4.b4.slack"
      ]
    },
    {
      "id": "cslez3_4_05_random_assembly",
      "title": "Selezione del PC e stato successivo",
      "format": "assembly",
      "variants": [
        "m3.4.b5.pc-seq",
        "m3.4.b5.pc-jump",
        "m3.4.b5.pc-call",
        "m3.4.b5.rsp-push",
        "m3.4.b5.rsp-pop",
        "m3.4.b5.dst-conditional",
        "m3.4.b5.halt-freeze",
        "m3.4.b5.reset-state"
      ]
    }
  ]
});
