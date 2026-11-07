'use strict';
SL.catalogo.push({
  "id": "1.5",
  "title": "Circuiti booleani e calcolo a livello di bit",
  "units": [
    {
      "id": "1.5.1",
      "title": "Funzioni booleane e porte elementari",
      "experiment": "Scegli XOR e prova tutte le coppie di A e B. Mantieni una coppia con ingressi diversi e seleziona AND. Leggi la medesima riga nelle due tabelle.",
      "skill": "Calcolare l’uscita di una porta",
      "check": "La coppia AB determina la riga in tutte le tabelle. La porta determina la colonna di uscita e il valore associato a quella riga."
    },
    {
      "id": "1.5.2",
      "title": "Dalla tabella di verità al circuito",
      "experiment": "Attiva soltanto l’uscita per 01. Aggiungi poi la riga 10 e confronta le due espressioni ottenute.",
      "skill": "Sintetizzare una somma di prodotti",
      "check": "Ogni riga attiva introduce un prodotto che riconosce proprio quella combinazione. L’espressione finale collega i prodotti mediante OR."
    },
    {
      "id": "1.5.3",
      "title": "Vettori di bit, maschere e operatori del C",
      "experiment": "Confronta A = 2 e B = 4 con i due operatori. Porta quindi A a zero e osserva se il secondo operando viene valutato.",
      "skill": "Scegliere l’operatore corretto",
      "check": "L’AND bit a bit seleziona gli uno sovrapposti. L’AND logico tratta ogni intero come condizione e può saltare la valutazione di B."
    },
    {
      "id": "1.5.4",
      "title": "Tempi, propagazione e impulsi transitori",
      "experiment": "Imposta i ritardi diretto e invertito a 2 e 5 ns. Scambiali, poi rendili uguali. Segui la discesa di A sul cronogramma.",
      "skill": "Individuare un glitch",
      "check": "L’uscita scende solo se il ramo diretto diventa zero prima che il ramo invertito salga. La distanza fra i due arrivi determina la durata dell’impulso."
    },
    {
      "id": "1.5.5",
      "title": "Dalle porte all’aritmetica",
      "experiment": "Fissa A = 1 e B = 0, poi cambia il riporto entrante da 0 a 1. Segui i due XOR e osserva il riporto uscente.",
      "skill": "Verificare un sommatore a un bit",
      "check": "Il bit di somma rappresenta le unità e il riporto uscente vale due unità. La loro somma pesata deve coincidere con la somma dei tre ingressi."
    },
    {
      "id": "1.5.6",
      "title": "Ragionamento booleano nel codice di sistema",
      "experiment": "Mantieni il registro a 5 e confronta le maschere 4, 12 e 0. Segui le colonne mantenute dall’AND e le posizioni mancanti.",
      "skill": "Distinguere uno o tutti i bit richiesti",
      "check": "L’esito è positivo quando l’intersezione coincide con la maschera. Con la maschera zero l’insieme dei bit richiesti è vuoto."
    },
    {
      "id": "1.5.7",
      "title": "Problemi svolti",
      "experiment": "Parti da 0xA5. Segui prima l’AND che libera il semibyte basso e poi l’OR che inserisce il nuovo campo.",
      "skill": "Aggiornare un campo preservando i bit vicini",
      "check": "Confrontando i due estremi si vede che i quattro bit alti conservano il valore originale; cambiano soltanto le posizioni riservate al campo.",
      "kind": "esercizi"
    },
    {
      "id": "1.5.8",
      "title": "Esercizi",
      "experiment": "Scegli «Aggiornare un campo senza alterare i vicini». Costruisci la maschera alla posizione indicata, cancella il vecchio campo e inserisci i bit del nuovo.",
      "skill": "Verificare una rete booleana",
      "check": "Per controllare la scrittura, estrai il campo aggiornato e confrontalo con il valore richiesto. Le posizioni esterne devono coincidere con il byte iniziale.",
      "kind": "esercizi"
    },
    {
      "id": "1.5.9",
      "title": "Soluzioni",
      "experiment": "Nella soluzione «Seguire due porte in cascata» individua l’uscita della NAND e usala come ingresso della XOR. Confronta le due tracce.",
      "skill": "Dimostrare un’identità per enumerazione",
      "check": "Il valore intermedio collega le due porte. Rifacendo la seconda operazione su quel valore e su C si deve ritrovare l’uscita finale.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "lez05_01_single_gate",
      "title": "Calcolare l’uscita delle porte",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.5.gate.and",
        "m1.5.gate.compose",
        "m1.5.gate.de-morgan-one",
        "m1.5.gate.de-morgan-two",
        "m1.5.gate.nand",
        "m1.5.gate.nor",
        "m1.5.gate.not",
        "m1.5.gate.or"
      ]
    },
    {
      "id": "lez05_02_bitwise_on_bytes",
      "title": "Operazioni bit a bit su un byte",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.5.bytes.extract-field",
        "m1.5.bytes.count-ones",
        "m1.5.bytes.test-bit",
        "m1.5.bytes.and",
        "m1.5.bytes.not",
        "m1.5.bytes.or",
        "m1.5.bytes.xor",
        "m1.5.bytes.clear-low"
      ]
    },
    {
      "id": "lez05_03_identify_gate",
      "title": "Riconoscere una porta dalla sua tabella",
      "format": "scelta multipla",
      "variants": [
        "m1.5.ident.from-table",
        "m1.5.ident.parity",
        "m1.5.ident.active-low-and",
        "m1.5.ident.all-zero-detector",
        "m1.5.ident.output-vector-or",
        "m1.5.ident.universal-choice",
        "m1.5.ident.all-zero",
        "m1.5.ident.any-zero"
      ]
    },
    {
      "id": "lez05_04_c_bitwise_expression",
      "title": "Espressioni e maschere in C",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.5.c.field-update",
        "m1.5.c.and",
        "m1.5.c.clear",
        "m1.5.c.clear-field",
        "m1.5.c.combine",
        "m1.5.c.extract",
        "m1.5.c.mask-test",
        "m1.5.c.not"
      ]
    },
    {
      "id": "lez05_05_truth_table_rows",
      "title": "Costruire una tabella di verità",
      "format": "intero / scelta multipla",
      "variants": [
        "m1.5.truth.construct",
        "m1.5.truth.infer-inputs",
        "m1.5.truth.output-column-size",
        "m1.5.truth.output-vector",
        "m1.5.truth.row-index",
        "m1.5.truth.and-ones",
        "m1.5.truth.enumerate2",
        "m1.5.truth.functions2"
      ]
    }
  ]
});
