'use strict';
SL.catalogo.push({
  "id": "5.2",
  "title": "Creazione dei processi, sostituzione del programma e terminazione",
  "units": [
    {
      "id": "5.2.1",
      "title": "Creazione per duplicazione",
      "experiment": "Scegli il valore iniziale di x e avanza oltre fork. Confronta i valori di ritorno nei due rami e le letture di x dopo l’incremento del figlio.",
      "skill": "Seguire i valori restituiti da fork",
      "check": "Padre e figlio riconoscono il proprio ramo dal valore restituito da fork. La scrittura sulla pagina privata cambia la lettura del figlio."
    },
    {
      "id": "5.2.2",
      "title": "Avvio di un comando e redirezione dell’uscita",
      "experiment": "Esegui prima echo con la redirezione a esito.txt e poi senza redirezione. Segui il descrittore 1 del figlio fino alla scrittura.",
      "skill": "Seguire i descrittori dopo una redirezione",
      "check": "dup2 associa l’uscita del figlio al file. L’uscita della shell resta sul terminale, dove ricompare il prompt."
    },
    {
      "id": "5.2.3",
      "title": "Sostituire il programma di un processo",
      "experiment": "Confronta l’avvio di un eseguibile accessibile con il tentativo su un file assente. Segui il descrittore 4 e identifica il programma che prosegue.",
      "skill": "Distinguere identità e immagine del processo",
      "check": "Il caricamento riuscito conserva il PID e chiude il descrittore con FD_CLOEXEC. Se manca l’eseguibile, il chiamante riceve l’errore e conserva il descrittore."
    },
    {
      "id": "5.2.4",
      "title": "Attesa, terminazione e registrazione finale del processo",
      "experiment": "Imposta il codice di uscita del figlio. Avanza dalla sua terminazione fino a waitpid e confronta il PID restituito con il codice estratto dallo stato.",
      "skill": "Raccogliere lo stato d’uscita",
      "check": "waitpid identifica il figlio raccolto. Per una terminazione normale, WEXITSTATUS estrae il codice che quel figlio ha passato a _exit."
    },
    {
      "id": "5.2.5",
      "title": "Fork in un processo multithread",
      "experiment": "Confronta i due percorsi del figlio dopo fork. Individua il thread rimasto nel figlio e segui il mutex fino a execve oppure a _exit.",
      "skill": "Riconoscere i vincoli del figlio dopo fork",
      "check": "La copia della memoria conserva un mutex occupato da un thread rimasto nel padre. Il solo thread presente nel figlio può caricare il nuovo programma oppure terminare dopo l’errore di avvio."
    },
    {
      "id": "5.2.6",
      "title": "Problemi svolti",
      "experiment": "Fai avanzare la lettura del padre e poi quella del figlio. Annota per ciascuna la posizione di partenza e l’offset dopo i byte effettivamente letti.",
      "skill": "Calcolare lo spostamento dell’offset",
      "check": "La seconda lettura comincia nel punto raggiunto dalla prima. L’offset finale tiene conto dei byte restituiti a entrambi i processi.",
      "kind": "esercizi"
    },
    {
      "id": "5.2.7",
      "title": "Esercizi",
      "experiment": "Nella prova sul ritorno di fork identifica il chiamante originario. Registra il valore che riceve e conta i figli creati, sia nel caso riuscito sia in quello fallito.",
      "skill": "Interpretare il successo o il fallimento di fork",
      "check": "Un nuovo ramo di esecuzione compare solo dopo una creazione riuscita. Il numero dei rami fornisce un controllo indipendente sulla risposta.",
      "kind": "esercizi"
    },
    {
      "id": "5.2.8",
      "title": "Soluzioni",
      "experiment": "Apri lo svolgimento sui rami condizionali. Dopo il primo fork, valuta il confronto su r separatamente in ciascun processo prima di contare le esecuzioni di fine().",
      "skill": "Ricostruire i rami percorsi dai discendenti",
      "check": "Ogni invocazione riuscita aggiunge un processo. La differenza fra i due alberi nasce dai rami che raggiungono il secondo fork.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez5_2_01_process_control",
      "title": "Valori restituiti da fork",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.2.g1.return-values",
        "m5.2.g1.fork-failure",
        "m5.2.g1.one-fork-processes",
        "m5.2.g1.wait-branch-count"
      ]
    },
    {
      "id": "cslez5_2_02_process_control",
      "title": "Risorse ereditate e copia su scrittura",
      "format": "scelta multipla",
      "variants": [
        "m5.2.g2.private-global",
        "m5.2.g2.shared-open-description",
        "m5.2.g2.cow-write",
        "m5.2.g2.pipe-inheritance"
      ]
    },
    {
      "id": "cslez5_2_03_process_control",
      "title": "Sostituzione del programma con exec",
      "format": "scelta multipla",
      "variants": [
        "m5.2.g3.exec-no-create",
        "m5.2.g3.pid-preserved",
        "m5.2.g3.no-return",
        "m5.2.g3.cloexec"
      ]
    },
    {
      "id": "cslez5_2_04_process_control",
      "title": "Terminazione, wait e processi zombie",
      "format": "scelta multipla",
      "variants": [
        "m5.2.g4.zombie",
        "m5.2.g4.orphan",
        "m5.2.g4.wait-purpose",
        "m5.2.g4.status-interpretation"
      ]
    },
    {
      "id": "cslez5_2_05_process_control",
      "title": "Fork condizionali e sequenze della shell",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.2.g5.shell-order",
        "m5.2.g5.exec-failure-exit",
        "m5.2.g5.conditional-fork",
        "m5.2.g5.child-exec-branch"
      ]
    }
  ]
});
