'use strict';
SL.catalogo.push({
  "id": "3.1",
  "title": "Logica combinatoria: dalle tabelle di verità all’ALU",
  "units": [
    {
      "id": "3.1.1",
      "title": "Dalla specifica booleana ai blocchi del percorso dati",
      "experiment": "Parti da A=1, B=0, C=1. Porta B a 1 e segui i segnali AB, AC e BC fino alla porta OR.",
      "skill": "Ricavare la maggioranza di tre bit",
      "check": "La OR mantiene l’uscita alta in entrambi i casi. A cambiare è il numero di coppie con entrambi gli ingressi alti."
    },
    {
      "id": "3.1.2",
      "title": "Selezionare un ingresso con un multiplexer",
      "experiment": "Assegna quattro valori diversi a I0, I1, I2 e I3. Confronta il percorso del dato con il selettore a 2 e poi a 3.",
      "skill": "Leggere un selettore",
      "check": "Il bit alto mantiene selezionata la coppia I2/I3. Cambiando il bit basso cambia il membro della coppia che arriva in uscita."
    },
    {
      "id": "3.1.3",
      "title": "Aritmetica e costruzione dell’ALU",
      "experiment": "Imposta A=7, B=1 e riporto iniziale 0. Avanza dalla colonna di peso 1 a quella di peso 8. Ripeti con A=15.",
      "skill": "Propagare il riporto",
      "check": "La freccia di riporto spiega come possa cambiare una colonna alla quale arrivano due bit uguali a zero. Il riporto dell’ultima colonna ha peso 16."
    },
    {
      "id": "3.1.4",
      "title": "Dai blocchi combinatori al controllo del processore",
      "experiment": "Conserva A=3 e B=1 e passa dalla somma alla differenza B − A. Confronta i risultati candidati con la parola che esce dal selettore.",
      "skill": "Scegliere la funzione dell’ALU",
      "check": "I quattro rami ricevono gli stessi byte in entrambe le prove. La funzione selezionata decide quale parola viene esaminata dal rilevatore di zero."
    },
    {
      "id": "3.1.5",
      "title": "Tempi, costo e realizzazione fisica",
      "experiment": "Assegna 30 ps al ramo AND, 65 ps al ramo XOR e 20 ps alla OR. Aumenta il ritardo AND prima a 50 ps e poi a 80 ps.",
      "skill": "Individuare il cammino critico",
      "check": "Finché arriva per ultimo il ramo XOR, il ritardo totale resta invariato. Quando diventa più lento il ramo AND, il limite cresce insieme al suo ritardo."
    },
    {
      "id": "3.1.6",
      "title": "Implementazioni alternative e flag di stato",
      "experiment": "Somma 127 e 1 su otto bit. Ripeti con 255 e 1, confrontando il riporto CF e il flag OF nei due risultati.",
      "skill": "Distinguere CF e OF",
      "check": "CF segnala il superamento di 255 nella lettura senza segno. OF segnala una somma matematica fuori dall’intervallo da −128 a 127 nella lettura con segno."
    },
    {
      "id": "3.1.7",
      "title": "Problemi svolti",
      "experiment": "Somma 1001 e 1011 a partire dal bit meno significativo. Segna il riporto prima di passare alla colonna successiva.",
      "skill": "Seguire una somma a larghezza fissa",
      "check": "In ciascuna colonna il totale dei tre ingressi è uguale al bit scritto più il doppio del riporto uscente. La relazione permette di verificare anche il riporto finale.",
      "kind": "esercizi"
    },
    {
      "id": "3.1.8",
      "title": "Esercizi",
      "experiment": "Apri «Programmare la maggioranza di tre bit». Indica quante coppie sono attive, poi calcola il bit in EAX. Confronta le due tracce.",
      "skill": "Calcolare il bit di maggioranza",
      "check": "Il conteggio distingue quante porte AND producono uno. Il bit di maggioranza dipende dalla presenza di almeno una coppia attiva.",
      "kind": "esercizi"
    },
    {
      "id": "3.1.9",
      "title": "Soluzioni",
      "experiment": "Scegli «Separare overflow, zero e segno dell’ALU» e percorri entrambe le tracce. Confronta ogni flag con la parola finale e con la somma matematica con segno.",
      "skill": "Ricostruire i flag di un’addizione",
      "check": "La parola troncata basta per ricostruire ZF e SF. Per spiegare OF servono anche i segni degli operandi e l’intervallo rappresentabile.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez3_1_01_random_assembly",
      "title": "Funzioni booleane di uno o più ingressi",
      "format": "assembly",
      "variants": [
        "m3.1.b1.not-x",
        "m3.1.b1.and-xy",
        "m3.1.b1.xor-xy",
        "m3.1.b1.nand-xy",
        "m3.1.b1.majority",
        "m3.1.b1.parity3",
        "m3.1.b1.exactly-one",
        "m3.1.b1.implication"
      ]
    },
    {
      "id": "cslez3_1_02_random_assembly",
      "title": "Selezione dei dati con multiplexer",
      "format": "assembly",
      "variants": [
        "m3.1.b2.mux2",
        "m3.1.b2.mux2-inverted",
        "m3.1.b2.select-four",
        "m3.1.b2.bit-select",
        "m3.1.b2.mask-select",
        "m3.1.b2.route-parity",
        "m3.1.b2.conditional-invert",
        "m3.1.b2.choose-min"
      ]
    },
    {
      "id": "cslez3_1_03_random_assembly",
      "title": "Somme, differenze e riporti",
      "format": "assembly",
      "variants": [
        "m3.1.b3.packed-half",
        "m3.1.b3.packed-full",
        "m3.1.b3.increment4",
        "m3.1.b3.add4",
        "m3.1.b3.carry4",
        "m3.1.b3.sub4",
        "m3.1.b3.borrow4",
        "m3.1.b3.sum-select"
      ]
    },
    {
      "id": "cslez3_1_04_random_assembly",
      "title": "Operazioni e segnali di uscita dell’ALU",
      "format": "assembly",
      "variants": [
        "m3.1.b4.alu-add-sub",
        "m3.1.b4.alu-and-or",
        "m3.1.b4.alu-four",
        "m3.1.b4.alu-shifts",
        "m3.1.b4.alu-compare",
        "m3.1.b4.alu-zero",
        "m3.1.b4.alu-carry",
        "m3.1.b4.alu-output-pack"
      ]
    },
    {
      "id": "cslez3_1_05_random_assembly",
      "title": "Transizioni e stato di un latch SR",
      "format": "assembly",
      "variants": [
        "m3.1.b5.sr-set",
        "m3.1.b5.sr-reset",
        "m3.1.b5.sr-general",
        "m3.1.b5.valid-state",
        "m3.1.b5.sr-hold",
        "m3.1.b5.sr-forbidden",
        "m3.1.b5.sr-transition",
        "m3.1.b5.sr-qbar"
      ]
    }
  ]
});
