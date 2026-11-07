'use strict';
SL.catalogo.push({
  "id": "5.5",
  "title": "Stato condiviso, sezioni critiche e semafori",
  "units": [
    {
      "id": "5.5.1",
      "title": "Intercalazioni e aggiornamenti persi",
      "experiment": "Mantieni fisso il valore iniziale e confronta «Letture consecutive» con «Un incremento completo per volta». Annota i valori locali prima di ciascuna scrittura.",
      "skill": "Produrre un aggiornamento perso",
      "check": "La scrittura usa il valore letto in precedenza dal suo autore. Due letture della stessa versione possono produrre due scritture identiche."
    },
    {
      "id": "5.5.2",
      "title": "Scegliere i confini della sezione critica",
      "experiment": "Partendo da 10, confronta la protezione della sola scrittura con quella dell’intero incremento. Controlla il valore letto da B nei due percorsi.",
      "skill": "Proteggere un invariante",
      "check": "Se B legge prima della scrittura di A, conserva una copia superata. Estendere il mutex alla lettura cambia la base del suo incremento."
    },
    {
      "id": "5.5.3",
      "title": "Un contatore completo protetto da mutex",
      "experiment": "Scegli quanti incrementi deve eseguire ciascuno dei due thread. Segui il valore del contatore ai rilasci del mutex e rileggilo dopo entrambi i join.",
      "skill": "Associare l’intero aggiornamento al mutex",
      "check": "Il mutex impone un ordine agli incrementi. La lettura dopo i join comprende tutti gli aggiornamenti completati dai due thread."
    },
    {
      "id": "5.5.4",
      "title": "Atomicità, visibilità e ordinamento",
      "experiment": "Confronta release/acquire e relaxed tenendo fermo il valore 1 letto dal flag pronto. Nell’ultimo passo osserva l’insieme dei valori ammessi per il dato.",
      "skill": "Riconoscere la relazione di sincronizzazione",
      "check": "La lettura acquire che osserva lo store release ordina anche la pubblicazione del dato. Con operazioni relaxed sul flag manca quel vincolo fra i due oggetti."
    },
    {
      "id": "5.5.5",
      "title": "Attesa attiva, sospensione e proprietà del lock",
      "experiment": "Fissa i millisecondi ancora necessari ad A e scegli prima spin continuo, poi sospensione immediata. Confronta l’attesa trascorsa con i millisecondi di CPU consumati da B.",
      "skill": "Distinguere tempo di CPU e tempo di attesa",
      "check": "B può attendere lo stesso rilascio consumando il secondo core oppure restando sospeso. La differenza appare nel tempo CPU attribuito a B."
    },
    {
      "id": "5.5.6",
      "title": "Permessi dei semafori e ordine degli eventi",
      "experiment": "Imposta i permessi iniziali e percorri le wait di A e B, poi le signal di P e Q. Annota a ogni passaggio il contatore libero e il primo sospeso.",
      "skill": "Seguire le assegnazioni dei permessi in ordine FIFO",
      "check": "Con una richiesta in coda, la signal consegna il permesso direttamente al primo sospeso. A coda vuota il permesso incrementa il contatore libero."
    },
    {
      "id": "5.5.7",
      "title": "Aggiornamenti condizionati e granularità dei lock",
      "experiment": "Con un solo posto disponibile, confronta il controllo prima del lock, il controllo protetto e la prenotazione con compare-exchange. Conta le conferme in ogni caso.",
      "skill": "Aggiornare una condizione condivisa",
      "check": "Una lettura precedente al lock può autorizzare due conferme sullo stesso posto. Una decisione indivisibile lega la conferma alla prenotazione riuscita."
    },
    {
      "id": "5.5.8",
      "title": "Problemi svolti",
      "experiment": "Parti da x = 1. Al termine della sezione di W1 annota il valore scritto e usalo come ingresso di W2 nell’espressione 2x + 1.",
      "skill": "Tracciare una lettura-modifica-scrittura",
      "check": "Il secondo worker applica la trasformazione al risultato del primo. L’ordine imposto dal mutex si può seguire attraversando le due letture.",
      "kind": "esercizi"
    },
    {
      "id": "5.5.9",
      "title": "Esercizi",
      "experiment": "Scegli la prova sui permessi al risveglio. Applica nell’ordine le tre wait e la signal, ricordando quali richieste si sono sospese.",
      "skill": "Prevedere un blocco per permesso mancante",
      "check": "La signal può ridurre il numero dei sospesi senza aumentare i permessi liberi. La coda FIFO identifica il beneficiario.",
      "kind": "esercizi"
    },
    {
      "id": "5.5.10",
      "title": "Soluzioni",
      "experiment": "Nello svolgimento sulla prenotazione dell’ultimo posto, ritrova la lettura con cui ogni worker decide di confermare. Confrontala con l’istante in cui acquisisce il mutex.",
      "skill": "Riconoscere una prenotazione duplicata",
      "check": "Mettere in fila le scritture lascia intatte le decisioni già prese dai worker. Il confronto tra posti e conferme rivela la prenotazione in eccesso.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez5_5_01_semaphores",
      "title": "Corse sui dati e aggiornamenti persi",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.5.g1.lost-increment",
        "m5.5.g1.data-race",
        "m5.5.g1.logical-race",
        "m5.5.g1.critical-boundary"
      ]
    },
    {
      "id": "cslez5_5_02_semaphores",
      "title": "Proprietà di una sezione critica",
      "format": "scelta multipla",
      "variants": [
        "m5.5.g2.mutual-exclusion",
        "m5.5.g2.strict-progress",
        "m5.5.g2.bounded-waiting",
        "m5.5.g2.outside-independence"
      ]
    },
    {
      "id": "cslez5_5_03_semaphores",
      "title": "Stato del semaforo durante wait e signal",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.5.g3.mutex-initial",
        "m5.5.g3.two-waits",
        "m5.5.g3.third-wait",
        "m5.5.g3.wake-ready"
      ]
    },
    {
      "id": "cslez5_5_04_semaphores",
      "title": "Semafori per precedenze e risorse",
      "format": "intero / scelta multipla",
      "variants": [
        "m5.5.g4.event-order",
        "m5.5.g4.three-resources",
        "m5.5.g4.binary-vs-mutex",
        "m5.5.g4.signal-before-wait"
      ]
    },
    {
      "id": "cslez5_5_05_semaphores",
      "title": "Errori di sincronizzazione",
      "format": "scelta multipla",
      "variants": [
        "m5.5.g5.write-only-lock",
        "m5.5.g5.missing-signal",
        "m5.5.g5.non-atomic-wait",
        "m5.5.g5.plain-spin-flag"
      ]
    }
  ]
});
