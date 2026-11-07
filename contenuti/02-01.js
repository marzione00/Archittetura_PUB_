'use strict';
SL.catalogo.push({
  "id": "2.1",
  "title": "Stato della macchina, registri e memoria",
  "units": [
    {
      "id": "2.1.1",
      "title": "Stato architetturale ed esecuzione",
      "experiment": "Carica 254 in AL e avanza da MOV ad ADD. Ripeti con 255 e confronta AL, ZF e CF dopo l’incremento.",
      "skill": "Tracciare lo stato osservabile",
      "check": "MOV conserva i flag presenti all’ingresso. Quando ADD oltrepassa 255, gli otto bit di AL ripartono da zero e il riporto esce dal byte."
    },
    {
      "id": "2.1.2",
      "title": "Registri, indirizzi e memoria",
      "experiment": "Scrivi lo stesso valore nelle tre destinazioni AL, AX ed EAX, ripartendo ogni volta da RAX con tutti i bit a uno. Confronta le coppie di cifre in esadecimale.",
      "skill": "Distinguere gli effetti delle scritture parziali",
      "check": "Ciascuna coppia corrisponde a un byte. AL sostituisce il byte basso, AX i due byte bassi. La scrittura in EAX porta a zero anche i 32 bit superiori di RAX."
    },
    {
      "id": "2.1.3",
      "title": "Lettura di brevi sequenze di istruzioni",
      "experiment": "Imposta 5 come valore iniziale e 3 come incremento. Annota EAX ed ECX subito dopo la copia, poi avanza fino all’ultimo ADD.",
      "skill": "Seguire le dipendenze tra istruzioni",
      "check": "Al momento della copia i registri contengono lo stesso valore. L’ultimo ADD somma le due copie e scrive soltanto in EAX, mentre ECX permette ancora di leggere la prima somma."
    },
    {
      "id": "2.1.4",
      "title": "Stato architetturale, implementazione e prestazioni",
      "experiment": "Esegui il caso con una ALU, poi con due, mantenendo fisso il valore di partenza. Confronta il ciclo di completamento di R9 e l’ultimo ciclo.",
      "skill": "Separare risultato architetturale e tempo di esecuzione",
      "check": "Con due unità gli incrementi di R8 e R9 possono condividere un ciclo. La somma finale attende entrambi e produce gli stessi valori nei registri."
    },
    {
      "id": "2.1.5",
      "title": "Problemi svolti",
      "experiment": "Parti da RAX = 0x1122334455667788. Annota quali byte interessa MOV AX,0xABCD, poi avanza alla rilettura di RAX.",
      "skill": "Ricomporre RAX dopo la scrittura in AX",
      "check": "Nella rilettura le quattro cifre esadecimali di AX occupano la coda della parola. Il prefisso di dodici cifre consente di controllare i sei byte conservati.",
      "kind": "esercizi"
    },
    {
      "id": "2.1.6",
      "title": "Esercizi",
      "experiment": "In «Dall’istruzione al risultato» scegli l’unità che esegue l’operazione e registra la previsione. Apri la prova completa per calcolare anche EAX. La seconda traccia usa SUB.",
      "skill": "Seguire un risultato dall’ALU al registro di destinazione",
      "check": "L’operazione indicata dal codice sceglie il calcolo dell’ALU. Sul percorso di ritorno puoi seguire il risultato fino alla destinazione, con il secondo operando ancora disponibile nel registro sorgente.",
      "kind": "esercizi"
    },
    {
      "id": "2.1.7",
      "title": "Soluzioni",
      "experiment": "Seleziona «Indirizzi consecutivi e linee di cache». Nei due svolgimenti individua il primo e l’ultimo byte della lettura, poi confronta le linee coinvolte.",
      "skill": "Riconoscere l’attraversamento di una linea di cache",
      "check": "Se i due estremi appartengono a linee diverse, una cache inizialmente vuota deve caricare entrambe. Due indirizzi distinti possono dunque richiedere lo stesso caricamento oppure due caricamenti.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez2_1_01_random_assembly_01",
      "title": "Registri, ALU e unità di controllo",
      "format": "scelta multipla",
      "variants": [
        "m2.1.cpu.datapath",
        "m2.1.cpu.alu",
        "m2.1.cpu.control",
        "m2.1.cpu.pc"
      ]
    },
    {
      "id": "cslez2_1_02_random_assembly_02",
      "title": "Periodo di clock, cicli e CPI",
      "format": "decimale / intero / scelta multipla",
      "variants": [
        "m2.1.perf.period",
        "m2.1.perf.cpi-time",
        "m2.1.perf.compare",
        "m2.1.perf.cycles"
      ]
    },
    {
      "id": "cslez2_1_03_random_assembly_03",
      "title": "Tecnologie della gerarchia di memoria",
      "format": "scelta multipla",
      "variants": [
        "m2.1.mem.order",
        "m2.1.mem.volatility",
        "m2.1.mem.cache-tech",
        "m2.1.mem.main-tech"
      ]
    },
    {
      "id": "cslez2_1_04_random_assembly_04",
      "title": "Cache, indirizzi e località",
      "format": "intero / scelta multipla",
      "variants": [
        "m2.1.mem.addresses",
        "m2.1.mem.hit-path",
        "m2.1.mem.locality",
        "m2.1.mem.spatial"
      ]
    },
    {
      "id": "cslez2_1_05_random_assembly_05",
      "title": "Bus, indirizzi e trasferimenti di dati",
      "format": "intero / scelta multipla",
      "variants": [
        "m2.1.bus.address",
        "m2.1.bus.data",
        "m2.1.bus.width",
        "m2.1.isa"
      ]
    }
  ]
});
