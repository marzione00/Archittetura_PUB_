'use strict';
SL.catalogo.push({
  "id": "3.3",
  "title": "Il repertorio Y86-64 e le fasi di esecuzione",
  "units": [
    {
      "id": "3.3.1",
      "title": "Dalla logica al contratto dell’ISA",
      "experiment": "Imposta %rax=7 e %rbx=−7. Esegui addq, poi rrmovq con gli stessi registri iniziali. Confronta %rbx, PC e codici di condizione.",
      "skill": "Descrivere un’istruzione",
      "check": "Entrambe le istruzioni occupano due byte e aggiornano %rbx. La copia conserva i flag iniziali, mentre la somma li ricava dal risultato."
    },
    {
      "id": "3.3.2",
      "title": "Codifica e confini delle istruzioni",
      "experiment": "Conserva PC e costante iniziali. Confronta le sequenze per irmovq, jne e ret e conta i byte prima di leggere valP.",
      "skill": "Decodificare il formato Y86-64",
      "check": "Il byte dei registri e gli otto byte della costante compaiono secondo la classe dell’istruzione. La loro presenza determina il confine successivo."
    },
    {
      "id": "3.3.3",
      "title": "Semantica delle istruzioni e flusso dei dati",
      "experiment": "Imposta %rbx=16 e spostamento 4. Individua gli otto byte letti. Porta lo spostamento a 5 e segui la nuova parola fino a %rax.",
      "skill": "Distinguere indirizzo effettivo e parola letta",
      "check": "Spostando l’indirizzo di un byte, sette celle restano nella finestra di lettura e assumono pesi diversi nella parola. Il byte all’indirizzo minore occupa la posizione meno significativa."
    },
    {
      "id": "3.3.4",
      "title": "Classi di istruzioni, stato e controllo",
      "experiment": "Scegli mrmovq nella memoria da 64 byte. Confronta gli indirizzi iniziali 56 e 57, poi prova halt e la classe riservata F0.",
      "skill": "Interpretare lo stato Y86-64",
      "check": "Una lettura è valida solo se anche l’ottavo byte rientra nella memoria. HLT e INS dipendono dal primo byte dell’istruzione e prescindono dall’indirizzo dei dati."
    },
    {
      "id": "3.3.5",
      "title": "Tracce complete delle istruzioni",
      "experiment": "Scegli PC, %rsp e destinazione di call. Segui l’indirizzo salvato in pila, poi confronta lo stato dopo ret con quello precedente a call.",
      "skill": "Seguire la chiamata Y86-64",
      "check": "Il valore prelevato da ret è il PC dell’istruzione successiva a call. Il puntatore cresce di una parola e torna alla posizione iniziale."
    },
    {
      "id": "3.3.6",
      "title": "Assemblaggio manuale come verifica",
      "experiment": "Fissa il PC iniziale e aumenta di uno il numero di nop fra jmp e fine. Confronta la tabella dei simboli e gli otto byte della destinazione.",
      "skill": "Assemblare in due passate",
      "check": "Una nop aggiunge un byte prima dell’etichetta. L’indirizzo assoluto codificato nel salto cresce di uno, mentre la lunghezza del salto resta di nove byte."
    },
    {
      "id": "3.3.7",
      "title": "Problemi svolti",
      "experiment": "Leggi i quattro bit alti e i quattro bit bassi di 0x63, poi avanza fino al nome dell’operazione.",
      "skill": "Separare icode e ifun",
      "check": "Il nibble alto seleziona la famiglia OPq. Il nibble basso sceglie un’operazione all’interno di quella famiglia.",
      "kind": "esercizi"
    },
    {
      "id": "3.3.8",
      "title": "Esercizi",
      "experiment": "Apri «Ricostruire lunghezza e confine di un’istruzione». Distingui il byte iniziale dai campi opzionali, poi calcola la lunghezza e valP per entrambe le tracce.",
      "skill": "Calcolare la lunghezza di un’istruzione",
      "check": "A parità di costante da otto byte, l’eventuale byte dei registri sposta il confine di una posizione. La differenza valP − PC misura la lunghezza.",
      "kind": "esercizi"
    },
    {
      "id": "3.3.9",
      "title": "Soluzioni",
      "experiment": "Scegli «Separare l’indirizzo dal valore di un carico». Segui la formazione di valE, la lettura degli otto byte e la scrittura del nuovo PC.",
      "skill": "Seguire indirizzo, valore caricato e PC",
      "check": "La base e lo spostamento spiegano valE. Il contenuto degli otto byte a quell’indirizzo spiega invece il valore scritto in %rax.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez3_3_01_random_assembly",
      "title": "Decodificare icode e ifun",
      "format": "assembly",
      "variants": [
        "m3.3.b1.icode-high",
        "m3.3.b1.ifun-low",
        "m3.3.b1.opcode-pack",
        "m3.3.b1.needs-regbyte",
        "m3.3.b1.needs-valc",
        "m3.3.b1.invalid-icode",
        "m3.3.b1.low-two-ifun",
        "m3.3.b1.condition-code"
      ]
    },
    {
      "id": "cslez3_3_02_random_assembly",
      "title": "Lunghezza e campi di un’istruzione",
      "format": "assembly",
      "variants": [
        "m3.3.b2.len-halt",
        "m3.3.b2.len-rrmov",
        "m3.3.b2.len-irmov",
        "m3.3.b2.len-jump",
        "m3.3.b2.length-by-regbyte",
        "m3.3.b2.offset-regbyte",
        "m3.3.b2.offset-valc",
        "m3.3.b2.fetch-byte-address"
      ]
    },
    {
      "id": "cslez3_3_03_random_assembly",
      "title": "Registri sorgente e destinazione",
      "format": "assembly",
      "variants": [
        "m3.3.b3.srcA-rrmov",
        "m3.3.b3.srcB-opq",
        "m3.3.b3.none-id",
        "m3.3.b3.srcA-select",
        "m3.3.b3.srcB-select",
        "m3.3.b3.dstE-select",
        "m3.3.b3.dstM-select",
        "m3.3.b3.regbyte-valid"
      ]
    },
    {
      "id": "cslez3_3_04_random_assembly",
      "title": "Operazioni Y86-64 e codici di condizione",
      "format": "assembly",
      "variants": [
        "m3.3.b4.op-add",
        "m3.3.b4.op-sub",
        "m3.3.b4.op-and",
        "m3.3.b4.op-xor",
        "m3.3.b4.op-select",
        "m3.3.b4.zf-add",
        "m3.3.b4.sf-add",
        "m3.3.b4.zf-xor"
      ]
    },
    {
      "id": "cslez3_3_05_random_assembly",
      "title": "Memoria, scrittura dei risultati e aggiornamento del PC",
      "format": "assembly",
      "variants": [
        "m3.3.b5.mem-read-address",
        "m3.3.b5.writeback-e",
        "m3.3.b5.pc-precedence-ret",
        "m3.3.b5.memory-error",
        "m3.3.b5.alignment",
        "m3.3.b5.write-enable",
        "m3.3.b5.read-enable",
        "m3.3.b5.commit-valid"
      ]
    }
  ]
});
