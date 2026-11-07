'use strict';
SL.catalogo.push({
  "id": "3.2",
  "title": "Logica sequenziale: stato, registri e memoria",
  "units": [
    {
      "id": "3.2.1",
      "title": "Dalla logica combinatoria allo stato memorizzato",
      "experiment": "Inizializza i due registri con parole distinte e scegli un valore comune per D. Confronta il passo successivo al fronte con «Carica» prima a 0 e poi a 1.",
      "skill": "Separare ingresso e stato",
      "check": "Con il ricircolo ogni registro conserva la propria parola. Aprendo il percorso da D, entrambi acquisiscono il medesimo dato al fronte."
    },
    {
      "id": "3.2.2",
      "title": "Latch, flip-flop e clock",
      "experiment": "Assegna 1 a D al primo fronte e 0 a D durante il livello alto. Segui entrambe le uscite fino alla chiusura del latch e al secondo fronte di salita.",
      "skill": "Leggere un diagramma temporale",
      "check": "Durante il livello alto il latch segue la variazione di D. Il flip-flop trattiene il valore campionato fino al successivo fronte di salita."
    },
    {
      "id": "3.2.3",
      "title": "Registri, banchi di registri e memoria",
      "experiment": "Fai leggere R1 alla porta A e R2 alla porta B. Con scrittura abilitata, scrivi 21 in R2 e confronta le due letture prima e dopo il fronte.",
      "skill": "Selezionare porte e destinazioni",
      "check": "La porta che seleziona la destinazione vede il nuovo dato dopo il fronte. L’altra porta continua a leggere il registro al proprio indirizzo."
    },
    {
      "id": "3.2.4",
      "title": "Il modello sincrono e i limiti temporali",
      "experiment": "Conserva i ritardi iniziali, riduci il periodo di clock e controlla i due margini. Ripristina il periodo e abbassa soltanto il ritardo minimo della logica.",
      "skill": "Verificare setup e hold",
      "check": "Accorciare il periodo riduce il margine di setup. Ridurre il ritardo minimo anticipa il nuovo dato e può violare l’hold anche con un periodo ampio."
    },
    {
      "id": "3.2.5",
      "title": "Dallo stato memorizzato alle macchine a stati",
      "experiment": "Con credito iniziale zero applica in ordine 2, 2 e 1. Per ogni ingresso annota il credito precedente, l’eventuale restituzione e il credito successivo.",
      "skill": "Tracciare stato e uscita",
      "check": "Una moneta che porterebbe il credito oltre il prezzo viene restituita e lascia invariato lo stato. Raggiungere esattamente il prezzo provoca l’erogazione e azzera il credito."
    },
    {
      "id": "3.2.6",
      "title": "Problemi svolti",
      "experiment": "Parti da Q=0 e leggi le coppie (EN,D) nell’ordine 01, 11, 00, 10. Prima di avanzare, annota se il latch segue D o conserva Q.",
      "skill": "Tracciare un latch",
      "check": "Nelle righe con EN basso la verifica richiede il valore acquisito nella riga precedente. Nelle righe con EN alto basta il valore attuale di D.",
      "kind": "esercizi"
    },
    {
      "id": "3.2.7",
      "title": "Esercizi",
      "experiment": "Apri «Riconoscere il fronte che campiona D». Leggi il livello precedente e quello attuale del clock, quindi prevedi l’impulso di acquisizione e il nuovo Q.",
      "skill": "Riconoscere il fronte di campionamento",
      "check": "La transizione 0→1 abilita la copia di D. Sul fronte opposto l’uscita dipende dal valore già memorizzato.",
      "kind": "esercizi"
    },
    {
      "id": "3.2.8",
      "title": "Soluzioni",
      "experiment": "Seleziona «Aggiornamento simultaneo con azzeramento prioritario». Confronta lo stato iniziale, i due candidati e la coppia acquisita, prima e dopo aver cambiato traccia.",
      "skill": "Ricostruire un aggiornamento simultaneo",
      "check": "I due candidati derivano dallo stesso stato iniziale. Se il reset è attivo, il fronte fa acquisire zero a entrambe le destinazioni.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez3_2_01_random_assembly",
      "title": "Stati e ingressi di un latch SR",
      "format": "assembly",
      "variants": [
        "m3.2.b1.sr-hold",
        "m3.2.b1.sr-set",
        "m3.2.b1.sr-forbidden",
        "m3.2.b1.sr-valid",
        "m3.2.b1.sr-equation",
        "m3.2.b1.d-from-sr-reset",
        "m3.2.b1.d-no-forbidden",
        "m3.2.b1.state-pair-valid"
      ]
    },
    {
      "id": "cslez3_2_02_random_assembly",
      "title": "Trasparenza e abilitazione del latch D",
      "format": "assembly",
      "variants": [
        "m3.2.b2.d-transparent",
        "m3.2.b2.d-closed-hold",
        "m3.2.b2.d-general",
        "m3.2.b2.d-active-low",
        "m3.2.b2.d-reset",
        "m3.2.b2.d-set-reset",
        "m3.2.b2.d-enable-reset",
        "m3.2.b2.change-detect"
      ]
    },
    {
      "id": "cslez3_2_03_random_assembly",
      "title": "Acquisizione sul fronte di clock",
      "format": "assembly",
      "variants": [
        "m3.2.b3.edge-rising",
        "m3.2.b3.no-edge",
        "m3.2.b3.dff-rising",
        "m3.2.b3.dff-reset",
        "m3.2.b3.dff-enable",
        "m3.2.b3.edge-any",
        "m3.2.b3.capture-invert",
        "m3.2.b3.capture-xor"
      ]
    },
    {
      "id": "cslez3_2_04_random_assembly",
      "title": "Caricamento e modifica di un registro a quattro bit",
      "format": "assembly",
      "variants": [
        "m3.2.b4.load4",
        "m3.2.b4.clear4",
        "m3.2.b4.load-clear4",
        "m3.2.b4.parallel-load-mask",
        "m3.2.b4.set-bits",
        "m3.2.b4.clear-bits",
        "m3.2.b4.increment4",
        "m3.2.b4.shift-left-in"
      ]
    },
    {
      "id": "cslez3_2_05_random_assembly",
      "title": "Aggiornamenti paralleli e priorità dei comandi",
      "format": "assembly",
      "variants": [
        "m3.2.b5.parallel-load",
        "m3.2.b5.sync-clear",
        "m3.2.b5.clear-load-priority",
        "m3.2.b5.masked-update",
        "m3.2.b5.bit-enable",
        "m3.2.b5.two-register-sample",
        "m3.2.b5.change-flag",
        "m3.2.b5.parallel-capture"
      ]
    }
  ]
});
