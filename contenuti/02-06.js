'use strict';
SL.catalogo.push({
  "id": "2.6",
  "title": "Procedure, flusso di controllo e analisi del codice macchina",
  "units": [
    {
      "id": "2.6.1",
      "title": "La convenzione delle chiamate di funzione",
      "experiment": "Seleziona la posizione 6 e poi la 7 mantenendo invariato il primo argomento. Confronta la sede di ciascun valore all’ingresso della funzione.",
      "skill": "Localizzare gli argomenti di funzione",
      "check": "Il settimo argomento intero da otto byte si trova sopra l’indirizzo di ritorno sulla pila. I primi sei occupano i registri previsti dalla convenzione."
    },
    {
      "id": "2.6.2",
      "title": "Frame dello stack e trasferimenti di controllo",
      "experiment": "Varia l’offset della CALL e osserva sia la cella scritta nello stack sia RIP dopo RET. Poi cambia soltanto il numero di blocchi locali.",
      "skill": "Ricostruire il passaggio tra chiamante e chiamato",
      "check": "La posizione della CALL determina l’indirizzo di ripresa. La riserva di locali cambia l’indirizzo della cella che lo conserva, lasciandone invariato il contenuto."
    },
    {
      "id": "2.6.3",
      "title": "Il flusso di controllo dentro una funzione",
      "experiment": "Confronta i byte 255 e 1 prima con segno e poi senza segno. Segui i flag prodotti da CMP fino alla scelta fra A e B.",
      "skill": "Seguire un ramo condizionale",
      "check": "CMP produce la stessa differenza a otto bit. JL usa SF e OF per ordinare i due valori con segno. JB usa CF per ordinarli senza segno."
    },
    {
      "id": "2.6.4",
      "title": "Leggere una funzione compilata",
      "experiment": "Esegui il ciclo prima con n = 4 e poi con n = 0. Per ogni iterazione annota EAX ed ECX dopo l’addizione e il decremento.",
      "skill": "Ricostruire un ciclo dal disassemblato",
      "check": "EAX accumula i termini già elaborati, mentre ECX conta quelli ancora da sommare. Con zero all’ingresso il test iniziale porta direttamente all’uscita."
    },
    {
      "id": "2.6.5",
      "title": "Argomenti aggregati e chiamate variadiche",
      "experiment": "Confronta i due tipi di struttura passati dopo il formato. In ciascun caso aggiungi un double successivo e osserva il registro che lo riceve e il minimo indicato per AL.",
      "skill": "Applicare le classi ABI agli aggregati",
      "check": "La struttura classificata in memoria lascia disponibili i registri vettoriali. Una coppia di double vi occupa invece due posti, cambiando la sede del double successivo e il conteggio per AL."
    },
    {
      "id": "2.6.6",
      "title": "Un metodo di analisi del codice macchina",
      "experiment": "Prova un argomento negativo, zero e un argomento positivo. Segui JGE nel disassemblato e annota se il ramo esegue NEG prima di RET.",
      "skill": "Verificare una ricostruzione semantica",
      "check": "Il confronto seleziona il ramo che raggiunge direttamente RET oppure quello che cambia il segno. EAX contiene il valore assoluto per tutti gli ingressi ammessi."
    },
    {
      "id": "2.6.7",
      "title": "Problemi svolti",
      "experiment": "Segui R12 dall’ingresso della funzione fino a RET. Distingui il valore usato durante il calcolo dalla copia che il chiamato conserva per il chiamante.",
      "skill": "Verificare il ripristino di un registro conservato dal chiamato",
      "check": "R12 può cambiare nel corpo della funzione. La copia salvata permette al chiamato di restituire al chiamante il valore d’ingresso.",
      "kind": "esercizi"
    },
    {
      "id": "2.6.8",
      "title": "Esercizi",
      "experiment": "Apri «Seguire una funzione nel debugger». Dal RIP iniziale e dalla lunghezza di LEA prevedi il RIP successivo. Usa operandi e spiazzamento per calcolare separatamente EAX.",
      "skill": "Ricostruire RIP e il registro di destinazione dopo un passo",
      "check": "Un’istruzione senza salto fa avanzare RIP della propria lunghezza in byte. La variazione del registro dati dipende invece dall’espressione eseguita.",
      "kind": "esercizi"
    },
    {
      "id": "2.6.9",
      "title": "Soluzioni",
      "experiment": "In «Dall’array alla chiamata» segui la lettura dell’elemento e il passaggio dell’argomento a doppio. Confronta EAX dopo il ritorno interno e dopo il ritorno al chiamante esterno.",
      "skill": "Distinguere i due ritorni di una chiamata annidata",
      "check": "L’indice seleziona il dato passato in EDI. La funzione interna deposita il risultato in EAX e l’epilogo della funzione esterna lo conserva.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez2_6_01_random_assembly_01",
      "title": "Preprocessore, compilatore e file oggetto",
      "format": "scelta multipla",
      "variants": [
        "m2.6.compile.preprocess",
        "m2.6.compile.S",
        "m2.6.compile.c",
        "m2.6.compile.object"
      ]
    },
    {
      "id": "cslez2_6_02_random_assembly_02",
      "title": "Disassemblaggio, simboli e debugger",
      "format": "scelta multipla",
      "variants": [
        "m2.6.tools.objdump",
        "m2.6.tools.disassemble",
        "m2.6.tools.symbols",
        "m2.6.tools.debugger"
      ]
    },
    {
      "id": "cslez2_6_03_random_assembly_03",
      "title": "Valore restituito, confronti e salti",
      "format": "scelta multipla",
      "variants": [
        "m2.6.disasm.return",
        "m2.6.disasm.compare",
        "m2.6.disasm.memory",
        "m2.6.disasm.branch"
      ]
    },
    {
      "id": "cslez2_6_04_random_assembly_04",
      "title": "Espressioni, array e chiamate",
      "format": "intero / scelta multipla",
      "variants": [
        "m2.6.c.expr",
        "m2.6.c.if",
        "m2.6.c.array",
        "m2.6.c.call"
      ]
    },
    {
      "id": "cslez2_6_05_random_assembly_05",
      "title": "Argomenti e lettura del codice ottimizzato",
      "format": "scelta multipla",
      "variants": [
        "m2.6.abi.args",
        "m2.6.abi.return",
        "m2.6.reverse.goal",
        "m2.6.reverse.optimization"
      ]
    }
  ]
});
