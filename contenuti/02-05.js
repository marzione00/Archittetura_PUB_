'use strict';
SL.catalogo.push({
  "id": "2.5",
  "title": "Chiamate di sistema Linux e confine tra utente e kernel",
  "units": [
    {
      "id": "2.5.1",
      "title": "Dalla richiesta dell’utente all’ingresso nel kernel",
      "experiment": "Esegui write con otto byte, poi seleziona getpid. Confronta RAX prima della syscall e al rientro, quindi individua i registri aggiornati durante SYSCALL.",
      "skill": "Distinguere libreria e kernel",
      "check": "Prima dell’ingresso RAX seleziona il servizio. Al rientro contiene il numero di byte scritti oppure il PID. La lunghezza del messaggio riguarda solo write."
    },
    {
      "id": "2.5.2",
      "title": "L’ABI delle syscall Linux x86-64",
      "experiment": "Segui prima l’argomento 4 dal wrapper C all’ingresso nel kernel. Ripeti con l’argomento 3, lasciando invariato il valore intero.",
      "skill": "Applicare la convenzione delle syscall",
      "check": "Per l’argomento 4 il wrapper deve trasferire il valore in R10 perché SYSCALL occupa RCX. Per l’argomento 3 entrambe le convenzioni usano lo stesso registro."
    },
    {
      "id": "2.5.3",
      "title": "I/O tramite descrittori di file",
      "experiment": "Richiedi otto byte da un file con cinque byte disponibili e limita la prima write a due byte. Segui RDX prima delle due chiamate e il puntatore dopo write.",
      "skill": "Gestire letture brevi",
      "check": "La quantità offerta a write dipende dai byte effettivamente letti. Il puntatore avanza poi dei soli byte accettati da write, lasciando il resto nel buffer."
    },
    {
      "id": "2.5.4",
      "title": "Mappature e sostituzione dell’immagine di processo",
      "experiment": "Mantieni lo stesso PID e alterna «Eseguibile valido» e «File assente». Segui l’immagine attiva, RIP e l’esito di execve.",
      "skill": "Interpretare la sostituzione dello spazio di indirizzi",
      "check": "Il PID identifica lo stesso processo in entrambi i casi. Il successo avvia la nuova immagine. Con ENOENT il programma originario riprende dopo la syscall."
    },
    {
      "id": "2.5.5",
      "title": "Identità dei descrittori e stato aperto condiviso",
      "experiment": "Confronta fd 4 ottenuto con dup e fd 4 ottenuto da una seconda open dello stesso file. Mantieni uguali le lunghezze delle due letture.",
      "skill": "Seguire l’offset condiviso",
      "check": "Con dup, la prima lettura sposta anche il punto di partenza della seconda. Una seconda open crea un’altra descrizione aperta con un proprio offset."
    },
    {
      "id": "2.5.6",
      "title": "Dall’ingresso nel programma all’uscita del processo",
      "experiment": "Confronta i codici richiesti 7 e 263 per la syscall exit. Segui RDI all’ingresso e WEXITSTATUS dopo la raccolta da parte del genitore.",
      "skill": "Distinguere terminazione e ritorno da funzione",
      "check": "I due codici differiscono di 256 e hanno gli stessi otto bit bassi. Il genitore osserva quindi lo stesso codice, pur partendo da due valori diversi in RDI."
    },
    {
      "id": "2.5.7",
      "title": "Problemi svolti",
      "experiment": "Segui una write che accetta i primi due byte di ABCDE. Prima di avanzare indica da quale cella deve partire la scrittura successiva.",
      "skill": "Riprendere una scrittura parziale senza duplicare il prefisso",
      "check": "Il prefisso già emesso precede il nuovo puntatore. Puntatore avanzato e conteggio residuo delimitano esattamente il suffisso ancora da trasferire.",
      "kind": "esercizi"
    },
    {
      "id": "2.5.8",
      "title": "Esercizi",
      "experiment": "In «Scrivere il suffisso appena letto» confronta capacità del buffer, byte letti e offset iniziale. Poi prova «Recuperare dopo una write breve» per determinare gli argomenti della seconda write.",
      "skill": "Preparare un intervallo valido per una write",
      "check": "RSI identifica il primo byte da emettere e RDX il conteggio residuo. In ogni passaggio l’intervallo così descritto resta entro la porzione valida del buffer.",
      "kind": "esercizi"
    },
    {
      "id": "2.5.9",
      "title": "Soluzioni",
      "experiment": "Nello svolgimento «Interpretare zero al ritorno di read» alterna le due tracce. Leggi il conteggio richiesto prima di interpretare RAX e l’offset finale.",
      "skill": "Interpretare un ritorno zero insieme al conteggio richiesto",
      "check": "Sul file ordinario della prova, zero dopo una richiesta positiva indica la fine del file. Con un conteggio richiesto pari a zero lo stesso ritorno è compatibile anche con dati ancora disponibili.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez2_5_01_random_assembly_01",
      "title": "Scrittura sui descrittori e terminazione",
      "format": "assembly",
      "variants": [
        "m2.5.write-stdout",
        "m2.5.write-stderr-no-output",
        "m2.5.exit-constant",
        "m2.5.exit-register"
      ]
    },
    {
      "id": "cslez2_5_02_random_assembly_02",
      "title": "Lettura in un buffer e scrittura di porzioni",
      "format": "assembly",
      "variants": [
        "m2.5.read-buffer",
        "m2.5.read-then-write",
        "m2.5.write-substring",
        "m2.5.write-two-chunks"
      ]
    },
    {
      "id": "cslez2_5_03_random_assembly_03",
      "title": "Lunghezze, stack e posizioni nel buffer",
      "format": "assembly",
      "variants": [
        "m2.5.read-exit-count",
        "m2.5.write-length-register",
        "m2.5.write-stack",
        "m2.5.read-offset"
      ]
    },
    {
      "id": "cslez2_5_04_random_assembly_04",
      "title": "Valori restituiti e trasferimenti di zero byte",
      "format": "assembly",
      "variants": [
        "m2.5.read-and-transform-status",
        "m2.5.write-return-count",
        "m2.5.write-zero",
        "m2.5.read-zero"
      ]
    },
    {
      "id": "cslez2_5_05_random_assembly_05",
      "title": "Sequenze di letture e scritture",
      "format": "assembly",
      "variants": [
        "m2.5.write-choice",
        "m2.5.read-write-prefix",
        "m2.5.exit-after-write",
        "m2.5.read-twice"
      ]
    }
  ]
});
