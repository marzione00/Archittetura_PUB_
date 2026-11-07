'use strict';
SL.catalogo.push({
  "id": "1.1",
  "title": "Il calcolatore e la vita di un programma",
  "units": [
    {
      "id": "1.1.1",
      "title": "Un programma, diversi livelli di interpretazione",
      "experiment": "Seleziona «Aè» come argomento di puts. Segui i byte fino al descrittore 1, poi cambia la destinazione da terminale a file.",
      "skill": "Collegare i livelli del sistema",
      "check": "La sequenza UTF-8 termina con LF in entrambi i casi. Cambia l’oggetto al quale il kernel consegna i byte."
    },
    {
      "id": "1.1.2",
      "title": "La macchina fisica sotto le astrazioni",
      "experiment": "Parti dallo spostamento 0 e ripeti la lettura con spostamento 1. Per ciascun accesso individua la cella sulla striscia di memoria.",
      "skill": "Distinguere processore, memoria e periferiche",
      "check": "Un incremento dello spostamento seleziona l’indirizzo successivo. Il registro riceve il byte di quella cella, espresso anche in decimale."
    },
    {
      "id": "1.1.3",
      "title": "Dai byte del sorgente al file eseguibile",
      "experiment": "Scegli prima gcc -S hello.c, poi gcc -c hello.c. Confronta l’ultima fase raggiunta e il nome del file conservato.",
      "skill": "Ricostruire la compilazione",
      "check": "Il primo comando conserva il testo assembly. Il secondo prosegue fino all’oggetto rilocabile. Il collegamento serve per ottenere l’eseguibile."
    },
    {
      "id": "1.1.4",
      "title": "Nomi, file e shell",
      "experiment": "Scegli ../dati/./riga e cambia la directory corrente. Segui il cursore attraverso ogni componente. Ripeti con /tmp/../var/log.",
      "skill": "Risolvere percorsi relativi",
      "check": "Un percorso relativo parte dalla directory scelta. Un percorso che inizia con / parte dalla radice. Il componente .. risale al genitore e il punto conserva la posizione."
    },
    {
      "id": "1.1.5",
      "title": "Dal file eseguibile al processo",
      "experiment": "Imposta il PID del figlio e un codice di uscita. Avanza da fork a execve e infine a waitpid, poi cambia soltanto il codice.",
      "skill": "Seguire l’avvio di un processo",
      "check": "Il nuovo programma conserva il PID del figlio. Alla terminazione normale la shell può ottenere dallo stato raccolto il codice di uscita scelto."
    },
    {
      "id": "1.1.6",
      "title": "Seguire hello attraverso il sistema",
      "experiment": "Confronta ./hello, ./hello > esito e ./hello >> esito. Controlla dove punta il descrittore 1 e leggi il file finale in esadecimale.",
      "skill": "Attribuire gli eventi a shell, kernel e processo",
      "check": "Nel primo caso i byte raggiungono il terminale. Con > il file viene troncato prima della scrittura. Con >> i due byte iniziali precedono la nuova sequenza."
    },
    {
      "id": "1.1.7",
      "title": "Problemi svolti",
      "experiment": "Segui il byte A dal primo comando al terzo. Per ogni passaggio individua il processo che scrive e quello che legge.",
      "skill": "Leggere una pipeline della shell",
      "check": "Ogni pipe collega l’uscita di un processo all’ingresso del successivo. Il processo intermedio legge dalla prima pipe e scrive nella seconda.",
      "kind": "esercizi"
    },
    {
      "id": "1.1.8",
      "title": "Esercizi",
      "experiment": "Scegli «Prevedere il contenuto di un file». Annota i byte iniziali e la sequenza emessa da printf. Calcola lunghezza e contenuto dopo la redirezione.",
      "skill": "Localizzare un guasto",
      "check": "Le risposte devono descrivere lo stesso file: contando gli ottetti della sequenza finale si deve ottenere la lunghezza indicata, compreso il carattere di fine riga.",
      "kind": "esercizi"
    },
    {
      "id": "1.1.9",
      "title": "Soluzioni",
      "experiment": "Apri «Localizzare una fase di costruzione» e confronta le due tracce. Identifica il file disponibile e la fase che avrebbe bisogno del simbolo esterno.",
      "skill": "Verificare l’ordine degli eventi",
      "check": "La dichiarazione rende possibile compilare la chiamata. Per collegare l’eseguibile occorre anche una definizione. Il comando GCC scelto stabilisce quale fase si raggiunge.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "lez01_01_layers_order",
      "title": "Livelli di astrazione e percorso dei dati",
      "format": "scelta multipla",
      "variants": [
        "m1.1.layers.abstraction-order",
        "m1.1.layers.file-read-flow",
        "m1.1.layers.cooperation",
        "m1.1.layers.application-purpose",
        "m1.1.layers.closest-hardware",
        "m1.1.layers.digital-system",
        "m1.1.layers.input-output",
        "m1.1.layers.portability"
      ]
    },
    {
      "id": "lez01_02_hardware_roles",
      "title": "Componenti hardware e loro funzioni",
      "format": "scelta multipla",
      "variants": [
        "m1.1.hw.data-path",
        "m1.1.hw.clock-purpose",
        "m1.1.hw.cpu-role",
        "m1.1.hw.actuator",
        "m1.1.hw.parallel-examples",
        "m1.1.hw.memory-hierarchy",
        "m1.1.hw.sensor",
        "m1.1.hw.alu-role"
      ]
    },
    {
      "id": "lez01_03_special_paths",
      "title": "Nomi e percorsi nel file system",
      "format": "scelta multipla",
      "variants": [
        "m1.1.path.resolve-sequence",
        "m1.1.path.extension",
        "m1.1.path.dirname",
        "m1.1.path.hidden",
        "m1.1.path.join",
        "m1.1.path.special-device",
        "m1.1.path.trailing-slash",
        "m1.1.path.absolute"
      ]
    },
    {
      "id": "lez01_04_filesystem_ops",
      "title": "Operazioni elementari sui file",
      "format": "scelta multipla",
      "variants": [
        "m1.1.fs.safe-copy-sequence",
        "m1.1.fs.append",
        "m1.1.fs.create-empty",
        "m1.1.fs.display",
        "m1.1.fs.link-concept",
        "m1.1.fs.permissions",
        "m1.1.fs.pipe",
        "m1.1.fs.print-dir"
      ]
    },
    {
      "id": "lez01_05_build_pipeline",
      "title": "Dal sorgente C al programma eseguibile",
      "format": "scelta multipla",
      "variants": [
        "m1.1.build.full-pipeline",
        "m1.1.build.error-localization",
        "m1.1.build.relocation",
        "m1.1.build.compiler-output",
        "m1.1.build.runtime-error",
        "m1.1.build.syntax-error",
        "m1.1.build.undefined-reference",
        "m1.1.build.assembler-output"
      ]
    }
  ]
});
