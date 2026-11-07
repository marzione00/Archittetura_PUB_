'use strict';
SL.catalogo.push({
  "id": "4.3",
  "title": "Controller dei dispositivi, polling e interrupt",
  "units": [
    {
      "id": "4.3.1",
      "title": "Interfaccia del controller e notifiche",
      "experiment": "Mantieni fisso il campione e sposta la prima interrogazione dal ciclo 2 al ciclo 6. Segui READY prima e dopo la lettura di DATA.",
      "skill": "Interpretare i registri del dispositivo",
      "check": "Prima del ciclo 4 il driver attende il campione. Se interroga il controller più tardi, legge subito il dato già pronto. Il consumo del campione azzera READY."
    },
    {
      "id": "4.3.2",
      "title": "Polling e interrupt",
      "experiment": "Con periodo di polling di 8 µs, porta l’arrivo dell’evento da 16 a 17 µs. Confronta ritardo di rilevazione, numero di controlli e cicli CPU con la notifica via interrupt.",
      "skill": "Stimare il costo del polling",
      "check": "Un evento appena successivo a un’interrogazione attende il controllo seguente. Il ramo interrupt applica invece la latenza di consegna e il costo per evento indicati nella traccia."
    },
    {
      "id": "4.3.3",
      "title": "Instradamento, vettori e conferma dell’interrupt",
      "experiment": "Scegli la linea IRQ e seguila fino al vettore. Confronta i due ordini disponibili fra liberazione della causa ed EOI.",
      "skill": "Separare causa ed EOI",
      "check": "Se il dispositivo mantiene attiva la linea, la fine del servizio presso il controller può consentire una nuova consegna dello stesso evento."
    },
    {
      "id": "4.3.4",
      "title": "Registri del dispositivo, costo e struttura del driver",
      "experiment": "Con 25 campioni confronta gruppi da 4 e da 8. Poi mantieni la soglia fissa e alterna le maschere 0x01 e 0x04 nel registro STATUS.",
      "skill": "Aggiornare un registro W1C",
      "check": "Il raggruppamento modifica gli ingressi nel gestore a parità di campioni letti. In STATUS ogni uno della maschera cancella soltanto il flag nella posizione corrispondente."
    },
    {
      "id": "4.3.5",
      "title": "Problemi svolti",
      "experiment": "Individua il primo istante di interrogazione. Percorri i controlli fino al primo che trova READY attivo e verifica il suo numero d’ordine.",
      "skill": "Contare le interrogazioni",
      "check": "La numerazione parte dal controllo a 10 µs. Un completamento esattamente sul confine viene osservato nel controllo che cade su quel confine.",
      "kind": "esercizi"
    },
    {
      "id": "4.3.6",
      "title": "Esercizi",
      "experiment": "Scegli «Leggere il registro giusto al momento giusto». Nella prima traccia individua comando e dato. Nella seconda verifica il bit READY prima dell’accesso a DATA.",
      "skill": "Selezionare registro e istante di lettura",
      "check": "È possibile osservare un valore di STATUS diverso da zero con READY ancora basso. La maschera del singolo bit permette di decidere quando leggere il campione.",
      "kind": "esercizi"
    },
    {
      "id": "4.3.7",
      "title": "Soluzioni",
      "experiment": "Scegli «Instradare e chiudere una richiesta» e ripercorri la seconda traccia. Identifica il componente che riceve EOI e quello che mantiene attiva la linea.",
      "skill": "Diagnosticare una notifica ripetuta",
      "check": "Dopo EOI il controller può accettare una riconsegna se il livello resta attivo. Servire la causa nel dispositivo consente alla linea di tornare inattiva.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez4_3_01_io_interrupts_01",
      "title": "Registri di comando, stato e dati",
      "format": "scelta multipla",
      "variants": [
        "m4.3.g1.command",
        "m4.3.g1.status",
        "m4.3.g1.data",
        "m4.3.g1.controller-order"
      ]
    },
    {
      "id": "cslez4_3_02_io_interrupts_02",
      "title": "Frequenza e costo del polling",
      "format": "intero / scelta multipla",
      "variants": [
        "m4.3.g2.polling-choice",
        "m4.3.g2.poll-count",
        "m4.3.g2.poll-cost",
        "m4.3.g2.poll-meaning"
      ]
    },
    {
      "id": "cslez4_3_03_io_interrupts_03",
      "title": "Consegna e riconoscimento di un interrupt",
      "format": "scelta multipla",
      "variants": [
        "m4.3.g3.irq-order",
        "m4.3.g3.apic",
        "m4.3.g3.mask",
        "m4.3.g3.ack"
      ]
    },
    {
      "id": "cslez4_3_04_io_interrupts_04",
      "title": "Fronte, livello e priorità",
      "format": "scelta multipla",
      "variants": [
        "m4.3.g4.level",
        "m4.3.g4.edge",
        "m4.3.g4.priority",
        "m4.3.g4.mask-reason"
      ]
    },
    {
      "id": "cslez4_3_05_io_interrupts_05",
      "title": "Percorso di un evento da tastiera",
      "format": "intero / scelta multipla",
      "variants": [
        "m4.3.g5.keyboard-flow",
        "m4.3.g5.scancode",
        "m4.3.g5.status-ready",
        "m4.3.g5.irq-cycles"
      ]
    }
  ]
});
