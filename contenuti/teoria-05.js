'use strict';

// Guida completa di ogni unità: scopo, teoria, casi, lettura e risultati.
(() => {
  const percorsi = {
  "5.1.1": {
    "scopo": "Due esecuzioni dello stesso programma possono usare lo stesso indirizzo e conservare dati diversi. Scriverai nella variabile di A e seguirai la lettura di B per individuare il ruolo della traduzione degli indirizzi nell’isolamento dei processi.",
    "teoria": [
      "Se apri due volte lo stesso programma, ciascuna copia può conservare un documento diverso. Il file che contiene le istruzioni è comune, mentre ciascuna esecuzione ha un’identità propria e dispone di memoria in cui conservare i suoi dati. Il sistema operativo chiama processo ciascuna di queste esecuzioni e le assegna un numero identificativo, il PID, dall’inglese process identifier. Il kernel, la parte del sistema operativo che governa le risorse comuni, conserva questa identità insieme alle informazioni sulla memoria del processo.",
      "Quando un’istruzione legge una variabile, usa un indirizzo virtuale, indicato con VA nella figura, cioè un numero che indica una posizione nella memoria vista da quel processo. Per trovare la cella effettiva, il processore consulta una tabella scelta per il processo in esecuzione. La memoria è suddivisa in porzioni di uguale dimensione, dette pagine, che la tabella associa a porzioni di memoria fisica.",
      "A e B chiamano entrambi x la loro variabile privata e la raggiungono all’indirizzo 0x1000, scritto in base sedici. Se A vi deposita 7, cambia la cella a cui conduce la tabella di A. Quando il dispatcher, il meccanismo che assegna il processore al processo scelto, fa entrare B, lo stesso indirizzo conduce alla cella di B, dove si trova ancora il valore iniziale."
    ],
    "introduzione": [
      "Due copie dello stesso programma possono conservare valori diversi in una variabile che ha lo stesso indirizzo. L’attività serve a spiegare questa separazione seguendo la traduzione degli indirizzi: ciascun processo, ossia ciascuna esecuzione identificata da un PID, usa una propria tabella, che collega l’indirizzo virtuale visto dal programma alla pagina effettiva della memoria.",
      "Carica il caso «Due pagine, uno stesso indirizzo» e avanza con «Passo successivo» dalla scrittura di A alla lettura di B. Segui le frecce delle due tabelle e confronta i valori delle celle. Ripeti con la scrittura di 23: il valore conservato da A cambia, mentre la lettura di B permette di verificare l’isolamento delle pagine."
    ],
    "lettura": "Le due righe appartengono ai processi A e B. Segui ogni freccia dal PID alla sua tabella e poi alla pagina privata: il numero 0x1000 compare in entrambe le traduzioni, mentre le celle finali restano separate. La riga evidenziata indica l’accesso in corso.",
    "conclusione": "Per verificare l’isolamento segui l’indirizzo 0x1000 attraverso ciascuna tabella: la scrittura di A modifica la sua cella privata, mentre B ritrova il valore iniziale nella propria. Due PID e due traduzioni permettono di distinguere esecuzioni dello stesso programma.",
    "controlli": {
      "dato": "Numero intero che A deposita nella propria cella x. B parte sempre da zero; cambia soltanto la scrittura effettuata da A."
    },
    "esperienze": [
      {
        "titolo": "Due pagine, uno stesso indirizzo",
        "risultato": "B legge 0; A conserva 7 nella propria pagina.",
        "ragionamento": "Il valore 7 percorre la traduzione di A e raggiunge la sua pagina privata. Quando entra B, viene usata la tabella di B, che conduce a una cella ancora uguale a zero: 0x1000 è il nome locale della posizione in ciascuno spazio.",
        "parametri": {
          "dato": 7
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Valore scritto da A: 7. La traccia riparte da «Avvio di due istanze».",
          "Premi «Passo successivo» e fermati a «Scrittura in A». Annota i valori delle due celle all’indirizzo virtuale 0x1000 e identifica quale delle due frecce trasporta il 7.",
          "Avanza fino a «Lettura in B», leggendo anche i passaggi intermedi. Confronta «valore letto» con «valore conservato da A»: indica a quale processo appartiene ciascuno."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "PID corrente",
            "valore": "42"
          },
          {
            "passo": 2,
            "campo": "valore letto",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "valore conservato da A",
            "valore": "7"
          },
          {
            "passo": 1,
            "campo": "A[0x1000]",
            "valore": "7"
          },
          {
            "passo": 1,
            "campo": "B[0x1000]",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Una scrittura più grande in A",
        "risultato": "B legge ancora 0; A conserva 23.",
        "ragionamento": "A cambia il contenuto della propria pagina da 0 a 23. Poiché la traduzione di B raggiunge una pagina distinta, il valore letto da B resta zero anche dopo questa scrittura; l’invarianza verifica l’isolamento delle due celle.",
        "parametri": {
          "dato": 23
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Valore scritto da A: 23. La traccia riparte da «Avvio di due istanze».",
          "Premi «Passo successivo» e fermati a «Scrittura in A». Controlla che 23 compaia nella pagina di A e che la pagina di B mantenga zero.",
          "Avanza fino a «Lettura in B», leggendo anche i passaggi intermedi. Segui la freccia attiva della lettura di B e confronta il suo esito con quello del primo caso."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "PID corrente",
            "valore": "42"
          },
          {
            "passo": 2,
            "campo": "valore letto",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "valore conservato da A",
            "valore": "23"
          },
          {
            "passo": 1,
            "campo": "A[0x1000]",
            "valore": "23"
          },
          {
            "passo": 1,
            "campo": "B[0x1000]",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "5.1.2": {
    "scopo": "Il core passa da A a B sia durante una lettura su disco sia alla scadenza del turno. Ricostruirai gli stati di A per capire quale evento gli consente di eseguire di nuovo.",
    "teoria": [
      "Un calcolo e una lettura da disco impegnano risorse diverse. Il core, ossia l’unità del processore che esegue le istruzioni, può passare a un altro processo mentre il disco cerca i dati richiesti dal primo. Per decidere a chi concedere il core, il sistema operativo tiene distinta la disponibilità a lavorare dall’effettiva esecuzione. Il dispatcher è il meccanismo che assegna il core al processo scelto; l’etichetta I/O indica le operazioni di ingresso e uscita dei dati, fra cui la lettura dal disco.",
      "Un processo, cioè un programma in esecuzione con i propri dati, è pronto quando possiede tutto ciò che gli occorre per eseguire la prossima istruzione e aspetta il proprio turno. È bloccato quando dipende da un evento ancora atteso. Nella lettura di A quell’evento è il completamento della richiesta al disco. Alla notifica del dispositivo, A rientra fra i pronti e B può proseguire fino alla fine del turno.",
      "Nel secondo caso il turno di A termina perché è scaduto il tempo assegnato, detto quanto. La scadenza viene segnalata da un timer, un dispositivo che misura il tempo. La politica round-robin dispone i processi pronti in una coda e assegna a ciascuno un turno a rotazione. A avrebbe ancora lavoro immediatamente eseguibile, perciò il sistema lo accoda dietro B. Anche se il core passa a B in entrambe le sequenze, lo stato di A rivela quale evento gli consentirà di tornare in esecuzione."
    ],
    "introduzione": [
      "Un processo può lasciare il core per ragioni che producono stati diversi. Qui imparerai a distinguere pronto, quando manca soltanto il turno sul processore, da bloccato, quando occorre attendere un evento esterno. Le due sequenze mostrano perché il completamento di una lettura renda possibile un’esecuzione successiva, mentre l’effettiva assegnazione del core richiede un’altra decisione.",
      "Nel controllo «Evento durante il turno di A» scegli «Lettura su disco», applica i parametri e segui A nei riquadri del core, dell’attesa e dei pronti. Confronta poi la sequenza ottenuta scegliendo «Fine del quanto». Quando B occupa il core in entrambi i casi, usa la collocazione di A per spiegare quale condizione gli consenta di tornare a eseguire."
    ],
    "lettura": "I tre riquadri distinguono il core, la coda dei pronti e l’attesa del disco. Nella coda la testa è a sinistra; una freccia evidenziata rappresenta il trasferimento del nome di un processo da un gruppo all’altro.",
    "conclusione": "La disponibilità del dato e la disponibilità del core sono condizioni separate. Una notifica può rendere A pronto; il passaggio in esecuzione richiede poi una scelta del dispatcher.",
    "controlli": {
      "caso": "Sceglie perché termina il turno di A: la lettura richiede un evento del disco, mentre la scadenza del quanto interrompe un calcolo ancora eseguibile."
    },
    "esperienze": [
      {
        "titolo": "A aspetta i dati del disco",
        "risultato": "Dopo la notifica A è pronto e B rimane in esecuzione.",
        "ragionamento": "La richiesta su disco blocca A perché manca il dato necessario a continuare. Al completamento il vincolo scompare e A entra nella coda dei pronti; la politica della prova lascia terminare il turno di B, che conserva il core.",
        "parametri": {
          "caso": "io"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Evento durante il turno di A: Lettura su disco. La traccia riparte da «Turno corrente».",
          "Premi «Passo successivo» e fermati a «Attesa del dispositivo». Trova A nel riquadro dell’attesa e B sul core. Spiega quale risorsa manca ad A in questo istante.",
          "Avanza fino a «Completamento», leggendo anche i passaggi intermedi. Segui A dall’attesa alla coda dei pronti e verifica che il core appartenga ancora a B."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "A",
            "valore": "pronto"
          },
          {
            "passo": 2,
            "campo": "B",
            "valore": "in esecuzione"
          }
        ]
      },
      {
        "titolo": "A esaurisce il quanto",
        "risultato": "B riceve il core; A resta nella coda dei pronti.",
        "ragionamento": "Alla scadenza A possiede ancora dati e istruzioni eseguibili, perciò il timer lo rimette pronto. La coda diventa B, A: il dispatcher estrae B dalla testa e lascia A in attesa soltanto del prossimo turno.",
        "parametri": {
          "caso": "timer"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Evento durante il turno di A: Fine del quanto. La traccia riparte da «Turno corrente».",
          "Premi «Passo successivo» e fermati a «Scadenza». Leggi la coda B, A e osserva che il riquadro dell’attesa del disco resta vuoto.",
          "Avanza fino a «Assegnazione», leggendo anche i passaggi intermedi. Individua B sul core e A nella coda; confronta il motivo di attesa con la lettura su disco."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "B",
            "valore": "in esecuzione"
          },
          {
            "passo": 2,
            "campo": "coda",
            "valore": "A"
          }
        ]
      }
    ]
  },
  "5.1.3": {
    "scopo": "Quando il core passa a un altro processo, l’esecuzione interrotta deve riprendere dall’istruzione corretta. Calcolerai l’indirizzo salvato dopo un numero noto di istruzioni e ne seguirai il ritorno al registro del core.",
    "teoria": [
      "Un lettore che interrompe un libro conserva il punto da cui dovrà ripartire. Anche un processo, quando cede il processore, deve ritrovare la propria posizione nella sequenza di istruzioni. Il contatore di programma, abbreviato PC, è un registro, ossia una piccola memoria interna al processore, che in questa macchina contiene l’indirizzo della prossima istruzione.",
      "Nella macchina simulata le posizioni in memoria sono numerate per byte e ogni istruzione occupa quattro byte. Il prefisso 0x indica la base sedici, nella quale dopo 9 compaiono le cifre da A a F. Se A inizia all’indirizzo 0x1000 e completa tre istruzioni consecutive, ha percorso dodici byte. Quando il timer, il dispositivo che misura la durata del turno, segnala che il turno è scaduto, il sistema operativo conserva dunque 0x100C nella scheda di A, insieme agli altri registri necessari a riprendere il lavoro.",
      "Durante il turno di B il registro fisico del core, l’unità del processore che esegue le istruzioni, contiene un indirizzo appartenente a B. È la copia salvata nella scheda di A che consente, al ritorno, di caricare il PC giusto. La riga dedicata al prossimo prelievo indica dove riprende la lettura delle istruzioni."
    ],
    "introduzione": [
      "Il cambio di processo conserva la continuità di un’esecuzione attraverso una copia dei suoi registri. Lo scopo è ricostruire il prossimo indirizzo di A e seguirne il salvataggio e il ripristino. Il PC, contatore di programma, indica la prossima istruzione; nella macchina proposta ogni istruzione consecutiva occupa quattro byte, perciò il suo avanzamento dipende dal numero di istruzioni completate.",
      "Carica il caso con tre istruzioni e calcola lo spostamento prima di premere «Passo successivo». Durante il turno di B confronta il PC del core con quello salvato nella scheda di A; al ritorno verifica quale copia viene ricaricata. Ripeti con cinque istruzioni e interpreta la differenza fra 0x100c e 0x1014 alla luce degli otto byte aggiuntivi percorsi."
    ],
    "lettura": "Il riquadro centrale è il PC fisicamente presente sul core; i riquadri laterali conservano i contesti di A e B. Le frecce indicano il salvataggio verso la scheda e il ripristino verso il core. Gli indirizzi sono esadecimali, mentre lo spostamento in byte è riportato anche in decimale.",
    "conclusione": "Salvare il prossimo indirizzo e ripristinarlo al ritorno conserva la continuità del flusso di istruzioni. La regola base + 4n dipende dall’ipotesi della prova: istruzioni consecutive lunghe quattro byte.",
    "controlli": {
      "n": "Numero di istruzioni completate da A prima del timer. Ogni istruzione della macchina didattica occupa quattro byte; il PC parte da 0x1000."
    },
    "esperienze": [
      {
        "titolo": "Ripresa dopo tre istruzioni",
        "risultato": "A riprende da 0x100c, dopo aver percorso 12 byte.",
        "ragionamento": "Tre istruzioni occupano 3 × 4 = 12 byte, cioè 0xC. Sommando lo spostamento a 0x1000 si ottiene 0x100C: il kernel conserva questo indirizzo mentre il core usa 0x2400 per B e lo ricarica quando torna ad A.",
        "parametri": {
          "n": 3
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Istruzioni completate da A: 3. La traccia riparte da «Esecuzione di A».",
          "Premi «Passo successivo» e fermati a «Timer e cambio». Calcola 3 × 4 e verifica il PC salvato di A, distinguendolo dal PC appena caricato per B.",
          "Avanza fino a «Ritorno ad A», leggendo anche i passaggi intermedi. Controlla che il PC del core coincida con la copia salvata di A e che lo spostamento sia 12 byte."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "PC del core",
            "valore": "0x100c"
          },
          {
            "passo": 2,
            "campo": "byte già percorsi da A",
            "valore": "12"
          }
        ]
      },
      {
        "titolo": "Ripresa dopo cinque istruzioni",
        "risultato": "A riprende da 0x1014, dopo 20 byte.",
        "ragionamento": "Cinque istruzioni occupano 5 × 4 = 20 byte; venti in base sedici si scrive 14. L’addizione 0x1000 + 0x14 dà 0x1014, che rimane nella scheda di A durante il turno di B e ritorna infine sul core.",
        "parametri": {
          "n": 5
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Istruzioni completate da A: 5. La traccia riparte da «Esecuzione di A».",
          "Premi «Passo successivo» e fermati a «Timer e cambio». Converti lo spostamento di 20 byte in 0x14 e confrontalo con il PC salvato.",
          "Avanza fino a «Ritorno ad A», leggendo anche i passaggi intermedi. Confronta 0x1014 con l’indirizzo del primo caso: le due istruzioni aggiunte avanzano il PC di otto byte."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "PC del core",
            "valore": "0x1014"
          },
          {
            "passo": 2,
            "campo": "byte già percorsi da A",
            "valore": "20"
          }
        ]
      }
    ]
  },
  "5.1.4": {
    "scopo": "Il kernel deve ritrovare sia chi aspetta un dispositivo sia la memoria del processo scelto. Esaminerai due informazioni della scheda di processo, seguendo una notifica del disco e il ripristino di una tabella degli indirizzi.",
    "teoria": [
      "Quando arriva il risultato di una lettura da disco, il sistema deve ritrovare il programma che l’aveva richiesta, anche se nel frattempo il processore ha eseguito altre istruzioni. A tale scopo il kernel, la parte del sistema operativo che governa l’hardware e le risorse comuni, conserva una scheda per ciascun processo. La scheda associa il suo numero identificativo, indicato con PID, allo stato corrente e alle risorse che usa.",
      "Per una richiesta ancora aperta, il kernel collega il processo alla coda del dispositivo, cioè all’elenco di chi ne aspetta il servizio. Nella sequenza della lettura, la notifica del disco D permette di rimuovere A da quella coda e di inserirlo fra i pronti, cioè fra i processi che aspettano soltanto un turno sul processore, indicato con CPU nella figura. L’assegnazione del processore avverrà in una decisione successiva.",
      "La scheda conserva anche il riferimento alla tabella che traduce gli indirizzi di memoria. Il dispatcher, che assegna il processore al processo scelto, attiva anche la tabella corrispondente. Se viene scelto B, entra in uso la sua tabella TB. La tabella indica che i dati della pagina virtuale numero 2, un blocco di indirizzi visto da B, occupano il blocco numero 9 nella memoria fisica. Il nome frame indica proprio un blocco di memoria fisica capace di contenere una pagina."
    ],
    "introduzione": [
      "La scheda di un processo permette al kernel, la parte del sistema operativo che governa le risorse, di ritrovare informazioni necessarie anche durante l’esecuzione di altri programmi. L’attività chiarisce due usi di questi collegamenti: riconoscere chi aspetta un dispositivo e attivare la corretta traduzione della memoria. Seguirai così il rapporto fra identità del processo, stato e risorse associate.",
      "Carica il caso «Dalla coda del disco ai pronti» e avanza fino alla notifica, confrontando la coda D con lo stato registrato per A. Passa poi a «Ripristino dello spazio di B» e segui la freccia dalla scheda alla tabella TB. Il passaggio dalla pagina virtuale 2 al frame fisico 9 mostra quale informazione rende utilizzabile lo spazio di B."
    ],
    "lettura": "Nel caso della lettura il collegamento unisce la scheda di A al luogo in cui si trova: CPU, disco D oppure pronti. Nel caso della memoria compaiono TA e TB; la freccia porta dalla scheda selezionata alla tabella attiva e poi alla traduzione della pagina 2.",
    "conclusione": "La scheda consente di seguire due collegamenti verificabili: dal processo A alla coda del disco D fino al suo ritorno fra i pronti, e dal processo B alla tabella TB fino alla traduzione della pagina 2 nel frame 9.",
    "controlli": {
      "caso": "Seleziona l’informazione da seguire nella scheda: la coda di una lettura pendente oppure il riferimento alla tabella che traduce gli indirizzi."
    },
    "esperienze": [
      {
        "titolo": "Dalla coda del disco ai pronti",
        "risultato": "La coda D diventa vuota e A passa pronto.",
        "ragionamento": "Alla richiesta il kernel associa A al dispositivo D e registra lo stato bloccato. La notifica individua quella richiesta, permette di togliere A dalla coda D e lo inserisce fra i candidati alla prossima assegnazione del core.",
        "parametri": {
          "caso": "sleep"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Operazione del kernel: Completare una lettura. La traccia riparte da «Richiesta».",
          "Premi «Passo successivo» e fermati a «Registrazione». Osserva il collegamento al disco D e la voce «bloccato» nella scheda di A.",
          "Avanza fino a «Notifica», leggendo anche i passaggi intermedi. Verifica insieme la scomparsa di A dalla coda D e il nuovo stato pronto."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "coda D",
            "valore": "vuota"
          },
          {
            "passo": 2,
            "campo": "stato",
            "valore": "pronto"
          }
        ]
      },
      {
        "titolo": "Ripristino dello spazio di B",
        "risultato": "La tabella TB traduce la pagina virtuale 2 nel frame fisico 9.",
        "ragionamento": "La scheda di B conserva il riferimento TB. Quando il dispatcher seleziona il processo 35, installa quella tabella; la sua voce per la pagina 2 identifica il frame 9, che contiene già i dati della pagina.",
        "parametri": {
          "caso": "memory"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Operazione del kernel: Ripristinare lo spazio di indirizzi. La traccia riparte da «Due spazi».",
          "Premi «Passo successivo» e fermati a «Selezione». Leggi PID entrante e tabella attiva, poi individua la freccia che proviene dalla scheda di B.",
          "Avanza fino a «Traduzione», leggendo anche i passaggi intermedi. Segui la traduzione della pagina 2 fino al frame 9 e separa il riferimento alla tabella dal contenuto della memoria."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "pagina",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "frame",
            "valore": "9"
          }
        ]
      }
    ]
  },
  "5.1.5": {
    "scopo": "A viene sospeso, il core esegue B e infine ritorna ad A. Ricostruirai il percorso dell’indirizzo di ripresa per capire perché il salvataggio debba precedere il caricamento dell’altro contesto.",
    "teoria": [
      "Per riprendere un programma interrotto occorrono sia l’indirizzo dell’istruzione da eseguire sia i valori temporanei sui quali essa dovrà operare. Il processore custodisce queste informazioni nei suoi registri, piccole memorie interne. Il registro PC, o contatore di programma, contiene l’indirizzo dell’istruzione da eseguire. Quando il sistema operativo salva i valori necessari alla ripresa, ne forma il contesto, una copia che appartiene al singolo processo anche durante il turno di un altro.",
      "A deve proseguire da 0x40 e B ha conservato il proprio indirizzo di ripresa 0x90. I due numeri sono indirizzi scritti in base sedici. Prima di assegnare a B il core, l’unità che esegue le istruzioni, il sistema copia 0x40 nella scheda di A e carica 0x90 nel registro che guida il prelievo delle istruzioni.",
      "Per ricostruire il viaggio di un indirizzo conviene seguirlo attraverso le sue due sedi, prima nel registro fisico, poi nella scheda personale. Al cambio successivo la direzione della copia si inverte per il processo che rientra. Questo criterio permette di separare l’indirizzo temporaneamente presente sul core da quello che ciascun processo conserva per il proprio ritorno."
    ],
    "introduzione": [
      "Riprendere un processo richiede che il sistema conservi il suo punto di arresto prima di usare i registri per un altro. Questo problema serve a ricostruire l’ordine delle copie durante due cambi di contesto. Il PC è il registro che indica la prossima istruzione: seguirai separatamente il valore sul core e quello custodito nella scheda personale di A.",
      "Leggi gli indirizzi iniziali 0x40 e 0x90 e scrivi nel campo di previsione da dove ripartirà A. Con «Passo successivo» raggiungi «Cambio A → B», quindi confronta la scheda di A con il PC del core. Avanza a «Riprendere A» e collega il risultato alla copia salvata: il confronto finale consente di verificare la previsione attraverso il percorso dell’indirizzo."
    ],
    "lettura": "Il PC del core indica l’indirizzo dal quale prosegue il processo attualmente in esecuzione. Le schede conservano gli indirizzi dei processi interrotti. Segui 0x40 dalla scheda di A al registro fisico quando A riprende, distinguendolo da 0x90, che appartiene a B.",
    "conclusione": "La copia conservata nella scheda permette a un processo di ritrovare la propria continuità anche dopo che il core ha usato registri appartenenti a un altro.",
    "procedura": [
      "Leggi i dati iniziali: PC di A uguale a 0x40 e copia di B uguale a 0x90. Registra la previsione sull’indirizzo da cui ripartirà A.",
      "Premi «Passo successivo» fino a «Cambio A → B» e annota separatamente il valore nella scheda di A e quello presente sul core.",
      "Avanza a «Riprendere A» e confronta il PC del core con l’indirizzo annotato prima del cambio."
    ],
    "risultato": "A riprende da 0x40, mentre 0x90 era l’indirizzo usato per B.",
    "ragionamento": "Prima di eseguire B, il kernel copia il PC 0x40 nella scheda di A. Il successivo ripristino di A recupera proprio quella copia: il passaggio intermedio del core a 0x90 lascia disponibile il punto di ripresa personale di A."
  },
  "5.1.6": {
    "scopo": "Una lettura su disco termina mentre B mantiene il core. Attribuirai uno stato ad A nei due momenti per distinguere l’attesa del dato dall’attesa del turno di esecuzione.",
    "teoria": [
      "Un programma diventa un processo quando il sistema operativo gli assegna memoria e conserva le informazioni necessarie per eseguirlo. Per compiere un’istruzione, il processo deve ricevere un core, cioè una delle unità del processore capaci di eseguire il codice. Vi sono però momenti in cui il core, da solo, sarebbe inutile.",
      "Il sistema chiama bloccato un processo che aspetta un evento esterno, pronto uno che ha già tutto ciò che serve tranne il turno sul core, in esecuzione uno che ha ricevuto quel turno. Il completamento di una lettura e l’assegnazione del core possono quindi avvenire in due istanti distinti. Lo scheduler sceglie fra i pronti; il dispatcher realizza la scelta assegnando il core al processo selezionato.",
      "Un processo che ha già chiesto al disco il prossimo blocco deve aspettare che quel blocco arrivi. Quando il disco ha finito, il processo può trovarsi ancora fermo perché il core sta lavorando per qualcun altro. Il motivo per cui l’esecuzione è sospesa permette di distinguere le due attese."
    ],
    "introduzione": [
      "Una richiesta al disco e il ritorno del dato dividono l’attesa di un processo in due situazioni diverse. L’esercizio ti aiuta ad attribuire uno stato in base alla risorsa mancante: bloccato quando occorre il dispositivo, pronto quando manca soltanto il core. La ricostruzione rende osservabile questa distinzione mentre B continua a eseguire durante il completamento della lettura.",
      "Premi «Carica l’esempio guidato» e, nell’esercizio sulle transizioni di A, scegli la previsione per «A dopo la richiesta». Registrala con il pulsante previsto, quindi avanza attraverso blocco, turno di B e completamento del disco. Aprendo la prova completa puoi rispondere anche sullo stato successivo: confronta i due esiti e giustificali indicando ogni volta la condizione ancora attesa da A."
    ],
    "lettura": "La ricostruzione sposta A fra esecuzione, attesa del dispositivo e pronti. Segui la destinazione di A dopo ciascun evento e controlla chi occupa il core durante il completamento della lettura.",
    "conclusione": "Il motivo della sospensione determina lo stato del processo. Quando il dato arriva, A può essere pronto pur lasciando il core a B fino alla successiva decisione dello scheduler.",
    "procedura": [
      "Premi «Carica l’esempio guidato»: seleziona l’esercizio 2, «Seguire le transizioni di A», traccia 1. I passaggi e i risultati seguenti si riferiscono a questa combinazione.",
      "Nel campo «A dopo la richiesta» scegli lo stato coerente con il dato ancora in transito e premi «Registra la previsione».",
      "Avanza nella ricostruzione: osserva prima il blocco di A, poi il passaggio del core a B e infine il completamento del disco.",
      "Apri «Apri la prova completa» per rispondere anche sullo stato successivo al completamento e confrontare entrambi i campi con lo svolgimento."
    ],
    "risultato": "A è bloccato dopo la richiesta e pronto subito dopo il completamento.",
    "ragionamento": "Finché il dato manca, assegnare il core ad A sarebbe insufficiente a proseguire la lettura, quindi A è bloccato. La notifica rimuove quel vincolo; poiché B conserva il turno, A entra fra i pronti e aspetta l’assegnazione."
  },
  "5.1.7": {
    "scopo": "Cinque processi monothread condividono due core e uno aspetta la rete. Ricostruirai il conteggio dei tre gruppi di stato, controllando che la somma conservi tutti i processi.",
    "teoria": [
      "Un core, l’unità del processore che esegue le istruzioni, può eseguire un flusso di istruzioni per volta nel modello considerato. A ogni istante il sistema operativo tiene quindi separati i processi che stanno usando i core, quelli in grado di usarli appena se ne libera uno e quelli che aspettano un evento esterno.",
      "Si chiama dispatcher il meccanismo che consegna effettivamente il core al processo scelto. Il completamento di un’operazione di ingresso o uscita dati, indicata con I/O, può far crescere il numero dei processi pronti anche mentre tutti i core sono già occupati.",
      "Cinque processi monothread, ciascuno con un solo flusso di istruzioni, condividono due core liberi. Uno aspetta la rete: restano quindi quattro candidati, dei quali due possono ricevere i core. Gli altri due rimangono pronti, mentre il processo in attesa della rete resta bloccato fino al completamento della richiesta."
    ],
    "introduzione": [
      "Contare i processi richiede di separare quelli assegnati ai core, quelli pronti e quelli sospesi per un evento esterno. Questa soluzione mostra come ricostruire i tre gruppi senza contare due volte la stessa esecuzione. Nel modello ogni processo monothread ha un solo flusso di istruzioni, quindi può occupare un core mentre gli altri candidati attendono il proprio turno.",
      "Ripristina con «Carica l’esempio guidato» il caso di cinque processi, due core e un’attesa di rete. Prima di avanzare sottrai dal totale il processo bloccato, poi confronta i candidati con i posti disponibili. Nei fotogrammi finali verifica i pronti rimasti in coda e somma i tre gruppi: ritrovare cinque processi conferma che l’assegnazione conserva tutte le identità."
    ],
    "lettura": "La figura distingue i processi assegnati ai core, quelli rimasti pronti e quelli bloccati sulla rete. Ogni nome appartiene a un solo gruppo nell’istantanea; usa questa separazione per evitare un doppio conteggio.",
    "conclusione": "Il numero dei processi candidati si ottiene togliendo i bloccati dal totale. L’assegnazione occupa poi al massimo tanti processi quanti sono i core, lasciando gli altri nella coda dei pronti.",
    "procedura": [
      "Premi «Carica l’esempio guidato»: seleziona l’esercizio 5, «Assegnare i pronti ai core», traccia 1. I passaggi e i risultati seguenti si riferiscono a questa combinazione.",
      "Annota cinque processi totali, un’attesa di rete e due core liberi. Sottrai il bloccato prima di assegnare i core.",
      "Avanza con «Passo successivo» e controlla i quattro candidati, i due assegnati e i due rimasti in coda.",
      "Nelle verifiche finali confronta i conteggi dei pronti e dei bloccati, poi somma anche i due processi in esecuzione."
    ],
    "risultato": "Restano due processi pronti e un processo bloccato; altri due sono in esecuzione.",
    "ragionamento": "I candidati sono 5 − 1 = 4. Due ricevono i core, quindi 4 − 2 = 2 restano pronti; la rete continua a trattenere un processo. La verifica complessiva è 2 in esecuzione + 2 pronti + 1 bloccato = 5."
  },
  "5.2.1": {
    "scopo": "Un figlio creato con fork eredita i dati del padre e può poi modificarli autonomamente. Seguirai i due valori restituiti dalla chiamata e la prima scrittura del figlio per distinguere duplicazione logica e copia fisica della pagina.",
    "teoria": [
      "Un programma può affidare parte del lavoro a un secondo processo che riparta dallo stesso punto. Nei sistemi Unix la chiamata fork crea questo processo figlio. Quando la chiamata riesce, padre e figlio raggiungono entrambi l’istruzione successiva, dove possono scegliere lavori diversi in base al valore restituito. Il padre riceve l’identificativo del figlio, detto PID, e il figlio riceve zero. Il kernel, la parte del sistema operativo che gestisce processi e memoria, prepara le informazioni necessarie a entrambe le esecuzioni.",
      "Fra i dati ereditati vi è anche x. Benché ciascun processo la consideri una variabile privata, all’inizio il sistema può far leggere a entrambi la stessa pagina fisica, ossia lo stesso blocco di memoria. La tecnica prende il nome di copia su scrittura, perché il sistema separa i contenuti quando uno dei due tenta di modificare la pagina condivisa. Le mappature, che associano gli indirizzi dei processi ai blocchi fisici, vengono allora aggiornate per raggiungere i due contenuti separati.",
      "Se nella variabile era stato scritto 6, entrambe le letture iniziali restituiscono 6. L’incremento eseguito dal figlio porta a 7 soltanto la sua x. Accanto ai due contenuti, la coppia di valori restituiti da fork permette di riconoscere chi sta eseguendo ciascun ramo."
    ],
    "introduzione": [
      "La creazione di un figlio con fork permette a due processi di ripartire dallo stesso punto conservando dati privati. L’attività serve a distinguere l’indipendenza logica delle variabili dalla separazione fisica delle pagine. Con la copia su scrittura, padre e figlio leggono inizialmente lo stesso blocco di memoria, mentre il primo aggiornamento del figlio rende visibili due contenuti distinti.",
      "Carica il caso con x uguale a sei e avanza fino al ritorno da fork, confrontando i valori restituiti ai due processi con i rispettivi PID. Osserva poi come cambiano le frecce alla scrittura del figlio. Ripeti il caso con dieci: confrontare i valori finali consente di riconoscere l’incremento nella copia del figlio e la conservazione del valore paterno."
    ],
    "lettura": "Padre e figlio sono disposti a sinistra, le pagine fisiche a destra. Subito dopo fork le due frecce raggiungono la stessa pagina; alla scrittura del figlio appare una destinazione separata. I PID 80 e 81 permettono di riconoscere le due esecuzioni.",
    "conclusione": "La copia su scrittura conserva l’indipendenza delle variabili private rinviando la duplicazione fisica al primo aggiornamento. I valori restituiti da fork consentono ai due processi di selezionare rami diversi del programma.",
    "controlli": {
      "x": "Contenuto iniziale della variabile privata del padre. Dopo fork entrambi leggono questo numero; il figlio esegue poi un solo incremento."
    },
    "esperienze": [
      {
        "titolo": "Eredità di x uguale a sei",
        "risultato": "Il padre conserva x = 6; il figlio legge x = 7 dopo il proprio incremento.",
        "ragionamento": "fork restituisce 81 al padre e 0 al figlio, mentre il valore iniziale 6 è visibile in entrambe le mappature. La scrittura del figlio richiede una pagina separata e vi deposita 6 + 1 = 7; il padre continua a leggere la pagina originale.",
        "parametri": {
          "x": 6
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Valore di partenza di x: 6. La traccia riparte da «Prima della duplicazione».",
          "Premi «Passo successivo» e fermati a «Ritorno da fork». Annota i due ritorni di fork e segui le frecce verso la pagina ancora condivisa.",
          "Avanza fino a «Copia alla scrittura», leggendo anche i passaggi intermedi. Confronta la pagina del padre con la copia del figlio e verifica l’incremento di una sola unità."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "x padre",
            "valore": "6"
          },
          {
            "passo": 2,
            "campo": "x figlio",
            "valore": "7"
          }
        ]
      },
      {
        "titolo": "Eredità di x uguale a dieci",
        "risultato": "Il padre conserva 10 e il figlio ottiene 11.",
        "ragionamento": "Il valore ereditato è ora 10. Cambia il contenuto della pagina, mentre restano identici il ruolo dei ritorni 81 e 0 e il meccanismo di separazione: il figlio scrive 10 + 1 nella propria copia.",
        "parametri": {
          "x": 10
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Valore di partenza di x: 10. La traccia riparte da «Prima della duplicazione».",
          "Premi «Passo successivo» e fermati a «Ritorno da fork». Controlla che i due processi leggano entrambi 10 subito dopo fork.",
          "Avanza fino a «Copia alla scrittura», leggendo anche i passaggi intermedi. Verifica che la differenza fra figlio e padre sia ancora uno e che soltanto il figlio abbia scritto."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "x padre",
            "valore": "10"
          },
          {
            "passo": 2,
            "campo": "x figlio",
            "valore": "11"
          }
        ]
      }
    ]
  },
  "5.2.2": {
    "scopo": "La stessa scrittura di echo può raggiungere il terminale oppure un file. Seguirai la preparazione del descrittore 1 nel figlio della shell per attribuire la scelta della destinazione alla corretta fase di avvio.",
    "teoria": [
      "Quando si digita un comando nel terminale, lo interpreta un programma chiamato shell. Il comando esterno echo produce una riga di testo e la scrive sulla propria uscita standard, indicata con stdout. Per consegnare i byte, echo usa un numero, il descrittore 1, abbreviato fd 1 dall’inglese file descriptor. È la tabella dei descrittori del processo a stabilire se quel numero conduce al terminale oppure a un file.",
      "Nella scrittura «echo ciao > esito.txt», il segno > chiede alla shell di preparare una diversa destinazione. Attraverso fork la shell crea un processo figlio, che eredita inizialmente le associazioni del padre. Il figlio apre esito.txt ottenendo il descrittore 3. Con dup2(3,1) associa anche il posto 1 della propria tabella al file aperto, dopodiché può chiudere il posto 3.",
      "Quando il figlio carica echo, la scrittura della parola ciao passa dunque dal descrittore 1 al file. La shell, il cui descrittore 1 conduce ancora al terminale, attende la fine del comando prima di mostrare il nuovo invito a digitare, chiamato prompt. I due percorsi spiegano perché la riga e l’invito possano apparire in luoghi distinti."
    ],
    "introduzione": [
      "La destinazione di una scrittura dipende dal collegamento associato al descrittore usato dal processo. Qui ricostruirai come la shell, il programma che interpreta i comandi, prepara l’uscita di echo prima del suo avvio. Il descrittore 1 identifica l’uscita standard; seguire la sua associazione rende osservabile perché la parola prodotta e il successivo prompt possano comparire in luoghi diversi.",
      "Seleziona «echo ciao > esito.txt» nel comando in primo piano, applica i parametri e avanza alla redirezione. Confronta il collegamento del descrittore 1 nel figlio con quello della shell, quindi segui la scrittura fino al file. Ripeti scegliendo «echo ciao»: la destinazione finale permette di attribuire l’effetto al collegamento preparato prima di eseguire il comando esterno."
    ],
    "lettura": "La riga superiore segue il descrittore 1 della shell; quella inferiore segue il figlio, che al caricamento diventa echo. Le frecce mostrano l’oggetto raggiunto dal descrittore, perciò la redirezione si riconosce dal collegamento del figlio al riquadro esito.txt.",
    "conclusione": "La redirezione viene preparata nella tabella dei descrittori del figlio prima di eseguire il comando. Il programma continua a scrivere su fd 1 e la shell conserva il proprio collegamento al terminale.",
    "controlli": {
      "caso": "Seleziona il comando completo. Il simbolo > richiede di collegare l’uscita standard del figlio al file esito.txt; l’altra scelta conserva il terminale."
    },
    "esperienze": [
      {
        "titolo": "Scrivere nel file",
        "risultato": "La parola ciao raggiunge esito.txt e il prompt della shell compare sul terminale.",
        "ragionamento": "Il figlio apre il file sul descrittore 3 e dup2(3,1) fa puntare anche fd 1 alla stessa apertura. Chiudere il descrittore 3 lascia attivo fd 1; echo usa quel collegamento, mentre la tabella della shell continua a raggiungere il terminale.",
        "parametri": {
          "caso": "file"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Comando in primo piano: echo ciao > esito.txt. La traccia riparte da «Duplicazione».",
          "Premi «Passo successivo» e fermati a «Redirezione nel figlio». Segui il descrittore 1 del figlio dopo dup2 e confrontalo con il descrittore 1 del padre.",
          "Avanza fino a «Esecuzione esterna», leggendo anche i passaggi intermedi. Individua la destinazione della parola e quella del prompt; spiega perché appartengano a processi diversi."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "destinazione di ciao",
            "valore": "esito.txt"
          },
          {
            "passo": 2,
            "campo": "prompt",
            "valore": "terminale"
          }
        ]
      },
      {
        "titolo": "Scrivere sul terminale",
        "risultato": "La parola ciao raggiunge il terminale; dopo la raccolta la shell è pronta per il comando successivo.",
        "ragionamento": "Il figlio eredita fd 1 dalla shell e carica echo conservando quell’associazione. La scrittura termina quindi sul terminale; la shell attende la conclusione prima di mostrare il nuovo prompt.",
        "parametri": {
          "caso": "tty"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Comando in primo piano: echo ciao. La traccia riparte da «Duplicazione».",
          "Premi «Passo successivo» e fermati a «Caricamento». Osserva che il caricamento di echo conserva il collegamento del figlio al terminale.",
          "Avanza fino a «Completamento», leggendo anche i passaggi intermedi. Confronta il percorso della parola con il primo caso e individua la preparazione che qui viene omessa."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "destinazione di ciao",
            "valore": "terminale"
          },
          {
            "passo": 2,
            "campo": "shell",
            "valore": "pronta per un comando"
          }
        ]
      }
    ]
  },
  "5.2.3": {
    "scopo": "Un programma di avvio vuole cedere il proprio processo a un eseguibile. Confronterai il caricamento riuscito e un percorso assente per seguire separatamente identità del processo, immagine in memoria e descrittori aperti.",
    "teoria": [
      "Un piccolo programma di avvio, chiamato wrapper nella figura, può preparare i file di lavoro per un secondo programma e poi cedergli il proprio posto. La chiamata execve chiede al sistema operativo di caricare un eseguibile all’interno del processo chiamante. Se l’operazione riesce, iniziano le istruzioni del nuovo programma e il processo conserva il proprio numero identificativo, il PID. Il termine immagine indica l’insieme di istruzioni e dati con cui il programma è installato nella memoria del processo.",
      "Oltre ai dati in memoria, un processo possiede una tabella dei file aperti, ai quali accede mediante piccoli interi detti descrittori. Per tenere aperto un file temporaneo soltanto durante la preparazione, il programma può marcare il suo descrittore con FD_CLOEXEC, l’indicazione di chiuderlo al caricamento riuscito del nuovo eseguibile.",
      "Nel caso illustrato il processo 71 tiene il file di lavoro sul descrittore 3 e quello temporaneo sul 4. Se parte il programma analisi, trova ancora aperto il primo. Se invece il percorso richiesto è assente, il programma di avvio riceve −1 come segnale di errore e conserva entrambi. La variabile errno precisa la causa: ENOENT indica qui l’assenza del file richiesto. Nel ramo riuscito la nuova esecuzione parte dal punto di ingresso, il cui indirizzo viene posto nel contatore di programma PC. L’identità di chi esegue l’istruzione successiva permette di interpretare lo stato della tabella."
    ],
    "introduzione": [
      "Caricare un nuovo eseguibile attraverso execve cambia il programma eseguito all’interno di un processo. L’obiettivo è riconoscere quali elementi si conservino e quali dipendano dal successo dell’operazione. Il PID identifica il processo, l’immagine comprende le sue istruzioni e i suoi dati, mentre la marcatura FD_CLOEXEC richiede la chiusura di un descrittore quando il caricamento riesce.",
      "Carica «Caricamento riuscito» e segui con «Passo successivo» il nome del programma, il PID e i due descrittori. Fissa il risultato per confronto, poi carica «Percorso assente». Confronta lo stato del descrittore 4 e il programma che prosegue: il ritorno di errore ENOENT, relativo al file assente, spiega perché il chiamante conservi ancora le proprie risorse."
    ],
    "lettura": "Il riquadro esterno porta il PID 71, che identifica il processo. All’interno l’immagine indica quale programma esegue le istruzioni; fd 3 e fd 4 mostrano lo stato dei file aperti. CLOEXEC sul descrittore 4 segnala la chiusura prevista al caricamento riuscito.",
    "conclusione": "execve riuscita sostituisce l’immagine del processo conservandone l’identità e i descrittori privi di close-on-exec. Un errore di ricerca restituisce il controllo al chiamante, il quale può ancora gestire le proprie risorse.",
    "controlli": {
      "caso": "Decide se il file richiesto da execve esiste ed è accessibile. Consente di confrontare la sostituzione riuscita con il ritorno di errore ENOENT."
    },
    "esperienze": [
      {
        "titolo": "Caricamento riuscito",
        "risultato": "Il nuovo programma analisi mantiene fd 3 aperto e trova fd 4 chiuso; il PID resta 71.",
        "ragionamento": "Il kernel installa la nuova immagine nello stesso processo. La marcatura close-on-exec di fd 4 provoca la sua chiusura durante il caricamento riuscito, mentre fd 3 resta disponibile al programma analisi.",
        "parametri": {
          "caso": "ok"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Percorso richiesto: Eseguibile accessibile. La traccia riparte da «Prima di exec».",
          "Premi «Passo successivo» e fermati a «Caricamento». Controlla che cambi il nome dell’immagine e che il PID mantenga il valore 71.",
          "Avanza fino a «Ingresso», leggendo anche i passaggi intermedi. Leggi separatamente lo stato di fd 3 e fd 4; collega la differenza alla marcatura CLOEXEC."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "fd 3",
            "valore": "aperto"
          },
          {
            "passo": 2,
            "campo": "fd 4",
            "valore": "chiuso"
          }
        ]
      },
      {
        "titolo": "Percorso assente",
        "risultato": "Il wrapper continua a eseguire e fd 4 resta aperto.",
        "ragionamento": "La ricerca del percorso fallisce con ritorno −1 ed errno ENOENT. Poiché la sostituzione dell’immagine fallisce, il wrapper riprende dal ramo di errore e conserva il descrittore temporaneo che aveva marcato per il caricamento riuscito.",
        "parametri": {
          "caso": "ko"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Percorso richiesto: File assente. La traccia riparte da «Prima di exec».",
          "Premi «Passo successivo» e fermati a «Ricerca». Annota −1 ed ENOENT, individuando la fase in cui si interrompe il tentativo.",
          "Avanza fino a «Gestione dell’errore», leggendo anche i passaggi intermedi. Controlla il nome dell’immagine e lo stato di fd 4, poi confrontali con il caso riuscito."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "immagine",
            "valore": "wrapper"
          },
          {
            "passo": 2,
            "campo": "fd 4",
            "valore": "aperto"
          }
        ]
      }
    ]
  },
  "5.2.4": {
    "scopo": "Un padre deve riconoscere quale figlio è terminato e quale esito abbia comunicato. Seguirai il passaggio attraverso lo stato zombie fino a waitpid, tenendo separati il PID e il codice di uscita.",
    "teoria": [
      "Un processo che abbia affidato un lavoro al figlio può avere bisogno di sapere come si sia concluso. Il figlio comunica un piccolo intero, detto codice di uscita, quando termina normalmente attraverso una chiamata come _exit. Il numero identificativo del processo, indicato con PID, serve invece a riconoscere chi ha terminato. Poiché il padre potrebbe essere impegnato altrove, il sistema operativo trattiene le informazioni essenziali sulla conclusione finché il padre le raccoglie.",
      "Durante questa attesa il figlio, che ha già smesso di eseguire istruzioni, prende il nome di zombie. Quando il padre chiama waitpid, ottiene l’identificativo del figlio raccolto e riceve, in una variabile distinta, lo stato di terminazione codificato. WIFEXITED verifica se la conclusione è stata normale. In tal caso WEXITSTATUS estrae il codice che era stato consegnato dal figlio.",
      "Se il figlio 52 termina chiamando _exit(13), 52 identifica il processo e 13 descrive l’esito che quel processo ha voluto comunicare. La riga della raccolta separa questi due numeri. Il passaggio da zombie a raccolto indica quando il sistema può eliminare la registrazione finale."
    ],
    "introduzione": [
      "Terminare un’elaborazione e raccoglierne l’esito sono due eventi distinti. L’attività serve a separare il PID, che identifica il figlio, dal codice di uscita, che comunica il risultato scelto dal programma. Dopo la terminazione il kernel conserva un record chiamato zombie, attraverso il quale il padre può recuperare quelle informazioni quando esegue waitpid.",
      "Carica l’uscita con codice tredici e avanza dalla terminazione alla raccolta, osservando insieme figlio, record e padre. Confronta il ritorno di waitpid con WEXITSTATUS, che estrae il codice dopo il controllo della terminazione normale. Ripeti con codice zero: mantenere il PID 52 mentre cambia l’esito aiuta ad assegnare un significato preciso ai due numeri mostrati."
    ],
    "lettura": "I tre riquadri rappresentano il figlio, il record conservato dal kernel e il padre. Le frecce seguono l’informazione di terminazione: prima rimane nel record zombie, poi raggiunge il padre durante la raccolta.",
    "conclusione": "La terminazione e la raccolta sono eventi distinti. waitpid identifica il figlio; dopo il controllo WIFEXITED, WEXITSTATUS permette di interpretare il codice comunicato dal figlio.",
    "controlli": {
      "status": "Piccolo intero passato dal figlio a _exit. Il PID del figlio rimane 52, così puoi riconoscere i due numeri anche quando il codice cambia."
    },
    "esperienze": [
      {
        "titolo": "Uscita con codice tredici",
        "risultato": "waitpid restituisce 52 e WEXITSTATUS vale 13; il record è raccolto.",
        "ragionamento": "Il figlio 52 termina consegnando 13 al kernel, che conserva entrambi i dati fino all’attesa del padre. La raccolta restituisce 52 come identità e permette di estrarre 13 dallo stato codificato dopo aver verificato la terminazione normale.",
        "parametri": {
          "status": 13
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Codice di uscita del figlio: 13. La traccia riparte da «Padre impegnato».",
          "Premi «Passo successivo» e fermati a «Terminazione normale». Osserva che il figlio ha smesso di eseguire mentre il kernel conserva il record zombie.",
          "Avanza fino a «Raccolta», leggendo anche i passaggi intermedi. Confronta il ritorno di waitpid con WEXITSTATUS e assegna a ciascuno il proprio significato."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "ritorno di waitpid",
            "valore": "52"
          },
          {
            "passo": 2,
            "campo": "WEXITSTATUS",
            "valore": "13"
          },
          {
            "passo": 2,
            "campo": "record",
            "valore": "raccolto"
          }
        ]
      },
      {
        "titolo": "Uscita con codice zero",
        "risultato": "waitpid restituisce ancora 52; WEXITSTATUS vale 0 e il record è raccolto.",
        "ragionamento": "Il codice 0 cambia l’esito comunicato dal figlio, mantenendo invariata la sua identità. Il padre raccoglie sempre il processo 52 e ricava zero dal campo di stato; la convenzione del programma può usare questo codice per indicare successo.",
        "parametri": {
          "status": 0
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Codice di uscita del figlio: 0. La traccia riparte da «Padre impegnato».",
          "Premi «Passo successivo» e fermati a «Terminazione normale». Trova lo stesso PID nel record e il nuovo codice consegnato a _exit.",
          "Avanza fino a «Raccolta», leggendo anche i passaggi intermedi. Verifica che sia cambiato soltanto il codice decodificato, confrontando i valori con il caso precedente."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "ritorno di waitpid",
            "valore": "52"
          },
          {
            "passo": 2,
            "campo": "WEXITSTATUS",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "record",
            "valore": "raccolto"
          }
        ]
      }
    ]
  },
  "5.2.5": {
    "scopo": "Un thread duplica un processo mentre un altro possiede un mutex. Seguirai i thread presenti nel figlio e i due percorsi di avvio per capire perché la memoria ereditata richieda attenzione prima della sostituzione del programma.",
    "teoria": [
      "Un programma può contenere più thread, cioè più sequenze di istruzioni che avanzano nello stesso processo e usano la stessa memoria. Per aggiornare una struttura comune, un thread può acquisire un mutex, chiamato anche lock nelle etichette della prova, un vincolo che riserva temporaneamente l’accesso a un solo partecipante. Il segno che il mutex è occupato rimane nella memoria del processo.",
      "Se T2 crea un processo figlio con fork mentre T1 possiede il mutex M, il figlio eredita una copia della memoria e riprende dal punto in cui T2 ha chiamato fork. T1 continua nel padre. La copia di M risulta quindi occupata, benché il thread che la potrebbe rilasciare sia assente dal figlio. Anche una funzione di libreria apparentemente innocua potrebbe aver bisogno di un vincolo ereditato in questo stato.",
      "POSIX, la specifica di queste interfacce, limita le operazioni eseguibili dal figlio prima della sostituzione del programma a quelle dette async-signal-safe: sono operazioni ammesse anche quando un segnale, cioè un avviso del sistema, interrompe una funzione mentre sta lavorando. Questa proprietà evita di dipendere da stati di libreria lasciati a metà dagli altri thread. Le due sequenze impiegano execve per sostituire il programma oppure _exit per terminare direttamente il figlio dopo un errore di caricamento. Nel secondo caso ENOENT segnala il percorso assente e 127 è il codice di uscita scelto dalla prova."
    ],
    "introduzione": [
      "Quando fork viene chiamata in un processo con più thread, il figlio riprende soltanto il flusso del chiamante e riceve la memoria ereditata. Lo scopo è comprendere la difficoltà introdotta da un mutex, il vincolo che riserva una risorsa a un thread, ancora occupato da un proprietario rimasto nel padre. La figura separa i thread presenti dallo stato copiato del vincolo.",
      "Carica «Sostituire subito l’immagine» e fermati alla separazione, contando i thread del padre e del figlio e individuando il proprietario di M. Segui poi execve fino alla nuova immagine. Confronta il percorso con «Terminare dopo il fallimento di execve»: l’uscita diretta con codice 127 mostra come termina il figlio, mentre entrambi i thread proseguono nel padre."
    ],
    "lettura": "Il riquadro del padre contiene T1 e T2; quello del figlio compare dopo fork e contiene soltanto la copia del chiamante T2. La scritta relativa a M descrive lo stato ereditato del mutex. L’ultimo riquadro mostra una nuova immagine oppure l’uscita del figlio.",
    "conclusione": "Dopo fork in un processo multithread, il figlio eredita memoria e lock senza ereditare gli altri thread. Il tratto prima di exec richiede le operazioni consentite in questo contesto; execve e l’uscita diretta illustrano due percorsi che evitano di dipendere dal possessore assente.",
    "controlli": {
      "caso": "Sceglie il percorso del figlio: sostituzione riuscita con execve oppure terminazione diretta con _exit dopo l’errore di caricamento."
    },
    "esperienze": [
      {
        "titolo": "Sostituire subito l’immagine",
        "risultato": "Il figlio carica un nuovo programma e la mappatura del vecchio mutex viene sostituita.",
        "ragionamento": "fork duplica il chiamante T2, mentre T1 resta nel padre. Il figlio trova M occupato nella memoria ereditata; execve carica una nuova immagine, eliminando quella vecchia mappatura senza richiedere un rilascio da T1 nel figlio.",
        "parametri": {
          "caso": "exec"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Passo successivo del figlio: Caricare il nuovo programma. La traccia riparte da «Preparazione».",
          "Premi «Passo successivo» e fermati a «Separazione». Conta i thread nei due riquadri e identifica chi potrebbe rilasciare M soltanto nel padre.",
          "Avanza fino a «execve», leggendo anche i passaggi intermedi. Osserva la sostituzione dell’immagine e spiega perché il vecchio mutex cessi di far parte del programma avviato."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "immagine",
            "valore": "nuovo programma"
          },
          {
            "passo": 2,
            "campo": "vecchio mutex",
            "valore": "mappatura sostituita"
          }
        ]
      },
      {
        "titolo": "Terminare dopo il fallimento di execve",
        "risultato": "Il figlio esce con codice 127; T1 e T2 continuano nel padre.",
        "ragionamento": "Il percorso assente fa fallire execve con ENOENT e lascia al figlio la vecchia immagine. Il ramo di errore usa _exit(127), terminando direttamente il figlio; il padre conserva entrambi i thread e potrà raccoglierne lo stato.",
        "parametri": {
          "caso": "exit"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Passo successivo del figlio: Terminare dopo execve fallita. La traccia riparte da «Preparazione».",
          "Premi «Passo successivo» e fermati a «Errore di avvio». Leggi ENOENT e controlla che nel figlio sia presente soltanto T2.",
          "Avanza fino a «Uscita diretta», leggendo anche i passaggi intermedi. Individua il codice 127 e separa la terminazione del figlio dalla prosecuzione dei thread del padre."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "codice di uscita",
            "valore": "127"
          },
          {
            "passo": 2,
            "campo": "padre",
            "valore": "continua con T1 e T2"
          }
        ]
      }
    ]
  },
  "5.2.6": {
    "scopo": "Padre e figlio leggono dallo stesso file dopo fork. Seguirai il cursore condiviso per calcolare da quale byte parte la seconda lettura e dove si trova l’offset finale.",
    "teoria": [
      "Per leggere un file in più riprese occorre ricordare dove inizierà la lettura successiva. Il sistema operativo conserva la posizione corrente, chiamata offset, nella descrizione del file aperto. L’offset conta i byte dall’inizio del file, assegnando al primo byte la posizione zero. Il descrittore è il piccolo intero mediante il quale il processo raggiunge quella descrizione. Più descrittori possono condurre allo stesso cursore.",
      "Dopo fork, che crea un processo figlio copiando la tabella dei descrittori del padre, i due processi dispongono ciascuno della propria tabella. Le voci ereditate continuano a riferirsi alla medesima apertura del file. Il cursore iniziale vale zero: quando il padre riceve due byte, avanza a due, e il figlio trova già questa nuova posizione per la propria lettura.",
      "Una lettura sposta il cursore della quantità effettivamente restituita. Per seguire le letture consecutive rappresentate sul nastro, conviene segnare il confine fra i byte già consegnati e quelli ancora da leggere. Chi compie la seconda lettura eredita il confine lasciato dalla prima, anche quando a eseguirla è l’altro processo."
    ],
    "introduzione": [
      "Due descrittori appartenenti a processi diversi possono raggiungere una stessa apertura del file. Questo problema serve a ricostruire le letture consecutive attraverso l’offset, cioè la posizione del prossimo byte da leggere. Dopo fork le tabelle dei descrittori sono distinte, mentre il cursore della descrizione aperta resta condiviso: ogni lettura riuscita modifica quindi il punto di partenza della successiva.",
      "Parti dai due e dai tre byte indicati nei dati iniziali e scrivi la previsione dell’offset finale. Avanza con «Passo successivo» alla lettura del padre, poi confronta la posizione raggiunta con quella da cui legge il figlio. Sul nastro dei byte verifica il passaggio da zero a due e infine a cinque, attribuendo ogni avanzamento alla lettura corrispondente."
    ],
    "lettura": "Benché i due descrittori appartengano a tabelle diverse, le frecce raggiungono la stessa descrizione aperta. Il nastro dei byte usa un unico cursore: la prima lettura lo sposta e la seconda riparte dal confine appena raggiunto.",
    "conclusione": "La duplicazione della tabella dei descrittori può conservare un’unica descrizione aperta e un unico offset. Le letture seriali avanzano quel cursore della quantità effettivamente restituita.",
    "procedura": [
      "Leggi offset iniziale zero, prima lettura di due byte e seconda di tre. Calcola l’offset finale e registra la previsione.",
      "Avanza a «Lettura del padre» e annota il nuovo offset 2 nella descrizione condivisa.",
      "Avanza a «Lettura del figlio» e conta tre byte a partire da 2, confrontando il cursore finale con la previsione."
    ],
    "risultato": "L’offset finale è 5.",
    "ragionamento": "Il padre riceve due byte e porta il cursore da 0 a 2. Il figlio usa la stessa descrizione aperta, parte da 2 e riceve tre byte: l’offset diventa 2 + 3 = 5."
  },
  "5.2.7": {
    "scopo": "Il processo 200 crea con successo il figlio 232. Interpreterai i valori restituiti da fork per riconoscere il chiamante originario e contare quante nuove identità siano state create.",
    "teoria": [
      "Un processo può chiedere al sistema operativo di crearne un altro che prosegua dallo stesso punto del programma. Nei sistemi Unix questa operazione prende il nome di fork. Se riesce, dopo la chiamata esistono due processi, ciascuno con la propria esecuzione e con un identificativo detto PID.",
      "Il sistema fa proseguire entrambi i processi dall’istruzione successiva a fork, predisponendo un valore di ritorno diverso nei due contesti. Il programma può esaminare quel risultato nello stesso punto del codice e assegnare al nuovo processo un compito diverso da quello del processo originario.",
      "Il figlio riceve zero come risultato della chiamata. Il padre riceve il PID del figlio, che gli permette di riconoscerlo. Se invece la creazione fallisce, il chiamante riceve −1 e prosegue da solo. Prima di contare quante volte verrà eseguita la riga successiva conviene distinguere questi tre possibili risultati."
    ],
    "introduzione": [
      "Una sola chiamata riuscita a fork produce due esecuzioni che proseguono dalla stessa istruzione con risultati diversi. L’esercizio ti aiuta a interpretare quei risultati senza confonderli con l’identità del chiamante: il padre riceve il PID assegnato al figlio, mentre il figlio riceve zero. L’albero consente di collegare ciascun valore al proprio ramo e di contare le nuove identità.",
      "Premi «Carica l’esempio guidato» e prevedi il valore restituito al processo originario, distinguendo il PID 200 dal nuovo PID 232. Dopo «Registra la previsione», avanza e confronta i due ritorni di fork. Apri la prova completa per contare i figli creati: collega ogni nuova identità a una creazione riuscita, distinguendo il numero dei processi finali da quello dei figli aggiunti."
    ],
    "lettura": "L’albero parte dal processo 200 e si divide nei rami padre e figlio. Le etichette del ritorno appartengono alla chiamata osservata da ciascun processo; il PID identifica invece l’esecuzione che prosegue su quel ramo.",
    "conclusione": "Una fork riuscita aggiunge un processo e produce due ritorni osservati da chiamanti ormai distinti. Il valore positivo nel padre permette di identificare il figlio; lo zero permette al figlio di riconoscere il proprio ramo.",
    "procedura": [
      "Premi «Carica l’esempio guidato»: seleziona l’esercizio 1, «Decodificare il ritorno di fork», traccia 1. I passaggi e i risultati seguenti si riferiscono a questa combinazione.",
      "Prevedi il «Valore restituito al chiamante originario» e registralo, tenendo separati il PID 200 del padre e il PID 232 assegnato al figlio.",
      "Avanza nei passaggi e annota il ritorno 232 nel padre e zero nel figlio.",
      "Apri la prova completa e indica quanti figli siano stati creati da questa singola chiamata."
    ],
    "risultato": "Il chiamante originario riceve 232 e la chiamata crea un solo figlio.",
    "ragionamento": "Al successo il kernel assegna al nuovo processo il PID 232 e restituisce quel numero al padre. Il figlio riprende con ritorno zero; la nuova identità aggiunta è una sola, benché entrambe le esecuzioni raggiungano il seguito del programma."
  },
  "5.2.8": {
    "scopo": "Una seconda fork è racchiusa nel ramo r > 0. Seguirai la condizione separatamente nelle esecuzioni nate dalla prima chiamata, così da contare invocazioni effettive e processi arrivati a fine().",
    "teoria": [
      "Una fork riuscita crea un processo figlio che riprende dall’istruzione successiva alla chiamata, come il padre. Il testo del programma compare una sola volta, mentre le sue righe possono essere eseguite da più processi distinti. La variabile r conserva il risultato di fork: nel padre contiene il numero identificativo positivo del figlio, nel figlio vale zero. Il confronto r > 0 è quindi vero soltanto nel padre.",
      "Per disegnare l’albero delle creazioni, si aggiunge un ramo figlio soltanto quando una chiamata effettivamente raggiunta termina con successo. I processi che avevano già scelto un altro percorso mantengono il loro posto nell’albero.",
      "Nel frammento proposto soltanto chi ha ricevuto un valore positivo esegue la seconda fork. Il padre iniziale crea quindi un secondo figlio, mentre il primo figlio, che ha ricevuto zero, salta quel ramo. La scrittura fine() indica una riga comune del programma, raggiunta separatamente da tre processi. Allargando la condizione a r >= 0, anche il primo figlio esegue la seconda chiamata: diventano tre invocazioni riuscite e quattro processi finali."
    ],
    "introduzione": [
      "Contare le righe che contengono fork è insufficiente quando più processi possono raggiungerle. Questa soluzione insegna a contare le invocazioni effettive valutando ogni condizione nel processo che la incontra. Il risultato r della prima chiamata è positivo nel padre e zero nel figlio: tale differenza determina quali rami dell’albero possano creare un’ulteriore esecuzione e raggiungere poi fine().",
      "Carica l’esempio guidato e leggi il confronto r > 0 nel listato prima di avanzare. Per ogni ramo annota il valore di r, poi confronta il numero di chiamate con i processi finali. Nelle verifiche conclusive collega ogni nuova biforcazione a un processo che raggiunge davvero la seconda fork: le foglie dell’albero devono corrispondere alle esecuzioni che arrivano a fine()."
    ],
    "lettura": "L’albero aggiunge un ramo soltanto quando un processo esegue una fork. Nel primo bivio etichetta il padre con r > 0 e il figlio con r = 0; soltanto il ramo del padre deve biforcarsi di nuovo.",
    "conclusione": "Controlla il conteggio con due operazioni separate: per ogni processo valuta la condizione sul suo r, poi aggiungi un figlio per ciascuna fork effettivamente eseguita. Con r > 0 le due chiamate producono tre processi; con r >= 0 le tre chiamate ne producono quattro.",
    "procedura": [
      "Premi «Carica l’esempio guidato»: seleziona l’esercizio 5, «Contare i discendenti nei rami condizionali», traccia 1. I passaggi e i risultati seguenti si riferiscono a questa combinazione.",
      "Leggi il listato e annota il valore di r nei due rami prodotti dalla prima fork.",
      "Avanza nella ricostruzione e applica r > 0 separatamente al padre e al figlio, segnando il solo chiamante della seconda fork.",
      "Conta le foglie che raggiungono fine() e le due invocazioni effettive, confrontandole con le verifiche finali."
    ],
    "risultato": "Tre processi raggiungono fine() e le chiamate a fork eseguite sono due.",
    "ragionamento": "La prima chiamata produce padre e figlio; soltanto il padre ha r positivo e compie la seconda chiamata. I due successi aggiungono due processi a quello iniziale: 1 + 2 = 3 esecuzioni arrivano a fine()."
  },
  "5.3.1": {
    "scopo": "Il completamento di una lettura rende B pronto mentre A sta usando il core. Misurerai quanto B aspetta dopo il risveglio, confrontando il mantenimento del turno di A con la prelazione per priorità.",
    "teoria": [
      "Lo scheduler è la parte del sistema operativo che sceglie il prossimo processo; il dispatcher gli assegna effettivamente il core. Mentre un programma aspetta un dato dal disco, il processore può eseguire un altro programma. Quando il dispositivo ha finito, invia al sistema operativo un segnale chiamato interrupt. Il processo in attesa torna pronto, perché ora esistono i dati necessari alla prossima istruzione. Per eseguirla deve però ottenere il core, l’unità di calcolo che in questo istante può essere ancora assegnata a qualcun altro.",
      "Nella traccia A calcola dal tempo zero e B attende il disco. Se il dato arriva al tempo 2 e A mantiene il suo turno fino al tempo 5, B spende tre millisecondi fra i pronti. La misura parte dalla notifica del dispositivo, così il tempo impiegato dal disco resta separato dall’attesa del processore.",
      "La prelazione permette al sistema di interrompere il turno già iniziato. Quando la politica assegna a B una priorità superiore, cioè una precedenza maggiore fra i processi pronti, l’assegnazione coincide con il suo risveglio, poiché il cambio è considerato istantaneo. I due istanti segnati sulla linea del tempo mostrano da dove provenga la differenza."
    ],
    "introduzione": [
      "Il completamento di una lettura rende un processo pronto, mentre il momento in cui ottiene il core dipende dalla politica di scelta. Qui misurerai la distanza fra questi eventi per distinguere il risveglio dall’assegnazione. La prelazione consente di interrompere il turno corrente: nella prova può anticipare B, che ha priorità superiore, assumendo istantaneo il cambio fra processi.",
      "Carica «A conserva il turno» e individua sulla linea temporale il risveglio di B a due millisecondi. Avanza fino alla sua assegnazione e misura l’intervallo fra i due segni. Confronta poi il caso «B prende il core al risveglio», mantenendo lo stesso arrivo del dato: la diversa attesa deriva dalla scelta dello scheduler, mentre la lettura termina nello stesso istante."
    ],
    "lettura": "Le tacche orizzontali misurano millisecondi a partire da zero. Il segno «B pronto» indica la notifica del disco; il riquadro B segna la prima assegnazione del core. La fascia fra i due istanti misura la sola attesa nella coda dei pronti.",
    "conclusione": "L’evento del dispositivo rende possibile l’esecuzione, mentre la politica di scheduling decide quando iniziarla. Qui la prelazione al risveglio elimina l’attesa aggiuntiva perché si assume nullo il costo del cambio.",
    "controlli": {
      "t": "Istante, in millisecondi dall’inizio, in cui arriva il dato di B. A è sul core dal tempo zero.",
      "pol": "Stabilisce se A conserva il quanto fino a 5 ms oppure viene interrotto appena B, di priorità superiore, torna pronto."
    },
    "esperienze": [
      {
        "titolo": "A conserva il turno",
        "risultato": "B inizia a 5 ms e aspetta 3 ms dopo il risveglio.",
        "ragionamento": "Dopo aver ricevuto il dato al tempo 2, B attende che il turno assegnato ad A termini al tempo 5. La differenza 5 − 2 = 3 misura l’attesa dopo il risveglio; il tempo precedente appartiene alla lettura su disco.",
        "parametri": {
          "t": 2,
          "pol": "rr"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Istante di risveglio di B (ms): 2; Politica: Quanto di A fino a 5 ms. La traccia riparte da «Turno di A».",
          "Premi «Passo successivo» e fermati a «Interrupt di completamento». Segna l’istante 2 ms e identifica il passaggio di B da bloccato a pronto.",
          "Avanza fino a «Scelta del dispatcher», leggendo anche i passaggi intermedi. Misura la distanza fra il risveglio e la prima assegnazione di B, poi confrontala con 3 ms."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "inizio B (ms)",
            "valore": "5"
          },
          {
            "passo": 2,
            "campo": "attesa dopo il risveglio (ms)",
            "valore": "3"
          }
        ]
      },
      {
        "titolo": "B prende il core al risveglio",
        "risultato": "B inizia a 2 ms e l’attesa dopo il risveglio vale 0 ms.",
        "ragionamento": "La priorità maggiore di B provoca la prelazione di A al completamento della lettura. Essendo gratuito il cambio, assegnazione e notifica cadono entrambe a 2 ms e l’attesa è 2 − 2 = 0.",
        "parametri": {
          "t": 2,
          "pol": "prio"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Istante di risveglio di B (ms): 2; Politica: Prelazione per priorità di B. La traccia riparte da «Turno di A».",
          "Premi «Passo successivo» e fermati a «Interrupt di completamento». Mantieni fisso il risveglio a 2 ms e osserva la priorità assegnata a B.",
          "Avanza fino a «Scelta del dispatcher», leggendo anche i passaggi intermedi. Controlla la coincidenza dei due segni temporali e confronta l’attesa con il primo caso."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "inizio B (ms)",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "attesa dopo il risveglio (ms)",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "5.3.2": {
    "scopo": "Tre lavori arrivano insieme e richiedono durate diverse sullo stesso core. Ricostruirai gli istanti di inizio e l’attesa media per capire l’effetto dell’ordine di servizio.",
    "teoria": [
      "Tre lavori, tutti pronti allo stesso istante, devono usare lo stesso core, l’unità del processore che ne esegue le istruzioni. Ogni lavoro richiede un intervallo ininterrotto di calcolo, indicato nella figura con il termine inglese burst. Poiché il core può soddisfare una richiesta per volta, l’ordine scelto determina quanto attende ciascun lavoro prima di cominciare.",
      "FCFS, dalle iniziali di first come, first served, conserva l’ordine di arrivo. Per arrivi simultanei vale qui l’ordine A, B, C. Se A dura 8 millisecondi, B ne dura 3 e C ne dura 1, A inizia subito, B al tempo 8 e C al tempo 11. L’attesa media è la somma di questi tre ritardi divisa per tre.",
      "SJF, shortest job first, sceglie ogni volta il lavoro pronto di durata minore, che in questa prova è conosciuta in anticipo. Nell’esempio comincia C, poi tocca a B e infine ad A. La somma dei tempi di servizio rimane dodici millisecondi. Cambiano le posizioni degli inizi sulla linea del tempo e, di conseguenza, l’attesa media."
    ],
    "introduzione": [
      "L’ordine di servizio può cambiare l’attesa dei lavori anche quando il calcolo complessivo rimane identico. L’attività serve a ricavare questa differenza dagli inizi dei turni: FCFS conserva l’ordine di arrivo, mentre SJF sceglie il lavoro pronto più breve. Poiché tutti arrivano a zero e le durate sono note, la barra temporale permette di calcolare direttamente ogni attesa e la media.",
      "Carica «FCFS con A lungo» e avanza annotando l’inizio di A, B e C, distinguendolo dalla durata del rispettivo burst, ossia il tratto di calcolo richiesto. Fissa il risultato per confronto e carica SJF con gli stessi burst. Confronta le medie e l’estremo finale della barra: cambiano le attese individuali, mentre i dodici millisecondi di servizio restano invariati."
    ],
    "lettura": "I riquadri superiori indicano le durate dei burst di A, B e C. La barra temporale si costruisce un turno alla volta: l’estremo sinistro di ciascun segmento è l’istante di inizio e, con arrivo comune a zero, coincide con l’attesa del lavoro.",
    "conclusione": "Spostare prima i lavori brevi riduce la somma delle attese in questo insieme di arrivi simultanei e durate note. Il servizio totale resta la somma dei burst, mentre la media dipende dall’ordine.",
    "controlli": {
      "burst": "Durata del lavoro di A in millisecondi. B richiede sempre 3 ms e C sempre 1 ms.",
      "pol": "FCFS conserva l’ordine di arrivo A, B, C; SJF ordina i tre lavori per durata crescente, conosciuta in questa prova."
    },
    "esperienze": [
      {
        "titolo": "FCFS con A lungo",
        "risultato": "L’ordine è A → B → C e l’attesa media è 6,33 ms.",
        "ragionamento": "A comincia a 0 e termina a 8, quindi B aspetta 8 ms. B termina a 11 e C aspetta 11 ms: la media è (0 + 8 + 11) / 3 = 19/3, arrotondata a 6,33 ms.",
        "parametri": {
          "burst": 8,
          "pol": "fcfs"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Durata A (ms): 8; Politica: FCFS. La traccia riparte da «Turno di A».",
          "Premi «Passo successivo» e fermati a «Turno di B». Nel turno di B annota l’inizio a 8 ms e distingui l’attesa dal suo burst di 3 ms.",
          "Avanza fino a «Attesa media», leggendo anche i passaggi intermedi. Somma le attese 0, 8 e 11 lette sulla barra e dividi per tre."
        ],
        "attesi": [
          {
            "passo": 3,
            "campo": "ordine",
            "valore": "A → B → C"
          },
          {
            "passo": 3,
            "campo": "media (ms)",
            "valore": "6,33"
          }
        ]
      },
      {
        "titolo": "SJF con gli stessi burst",
        "risultato": "L’ordine è C → B → A e l’attesa media è 1,67 ms.",
        "ragionamento": "C, che dura 1 ms, viene servito per primo; B inizia a 1 e termina a 4, quando parte A. La media diventa (0 + 1 + 4) / 3 = 5/3, cioè 1,67 ms; la durata complessiva resta 12 ms.",
        "parametri": {
          "burst": 8,
          "pol": "sjf"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Durata A (ms): 8; Politica: SJF. La traccia riparte da «Turno di C».",
          "Premi «Passo successivo» e fermati a «Turno di B». Nel turno di B annota l’inizio a 1 ms e confrontalo con quello ottenuto in FCFS.",
          "Avanza fino a «Attesa media», leggendo anche i passaggi intermedi. Ricava la media dagli inizi 0, 1 e 4, controllando che la barra finisca ancora a 12 ms."
        ],
        "attesi": [
          {
            "passo": 3,
            "campo": "ordine",
            "valore": "C → B → A"
          },
          {
            "passo": 3,
            "campo": "media (ms)",
            "valore": "1,67"
          }
        ]
      }
    ]
  },
  "5.3.3": {
    "scopo": "Un quanto breve anticipa il primo turno dei lavori in coda e moltiplica i cambi fra processi. Misurerai insieme la prima risposta di B e la durata totale per valutare questo compromesso.",
    "teoria": [
      "Perché un lavoro breve possa iniziare anche mentre un altro ha molto calcolo da compiere, il sistema può suddividere il tempo del processore in turni. La politica round-robin prende il primo processo dalla coda dei pronti e gli concede al massimo un intervallo chiamato quanto. Se il lavoro termina prima della scadenza, il core passa subito al successivo. Se resta del lavoro, il processo si accoda in fondo.",
      "Un cambio fra processi ha un costo, perché occorre conservare i dati temporanei del processo uscente e ripristinare quelli del processo entrante. A, B e C sono pronti al tempo zero, in questo ordine, e richiedono rispettivamente 5, 3 e 2 millisecondi di calcolo. Con un quanto di 2 millisecondi, A, che ne richiede 5, lascia 3 millisecondi ancora da svolgere al termine del primo turno. Se il cambio dura 1 millisecondo, B può iniziare al tempo 3.",
      "Il tempo della prima risposta di B si misura dal suo arrivo alla sua prima assegnazione. Per ottenere invece la durata dell’intero lavoro occorre percorrere tutti i turni, includendo i cambi effettivi. Quando resta un solo processo, la scadenza del suo quanto può riportare al core lo stesso processo senza un passaggio ad altri."
    ],
    "introduzione": [
      "Suddividere l’esecuzione in turni brevi anticipa l’accesso al core dei processi in coda e aumenta le occasioni di cambio. Questo esperimento serve a valutare insieme i due effetti nel round-robin, che assegna a rotazione un tempo massimo chiamato quanto. Il costo del cambio rappresenta il tempo necessario a conservare e ripristinare i contesti, durante il quale i lavori attendono.",
      "Carica il quanto di due millisecondi e segui residui e coda con «Passo successivo», includendo i segmenti Δ prima dei nuovi turni. Annota la prima risposta di B e il tempo finale, poi confrontali con il caso da quattro millisecondi. Spiega perché B inizi più tardi mentre il gruppo finisca prima, contando soltanto i cambi fra processi distinti previsti dal modello."
    ],
    "lettura": "La coda superiore ha la testa a sinistra e i riquadri indicano il lavoro residuo. Nella barra una lettera occupa il tempo utile di quel processo; Δ occupa il tempo del cambio. Dopo ogni turno confronta il residuo con il reinserimento o l’uscita del processo dalla coda.",
    "conclusione": "La durata del quanto modifica sia l’attesa della prima risposta sia il numero dei cambi effettivi. Un bilancio corretto somma il lavoro utile e il costo dei passaggi fra processi distinti, rispettando le ipotesi di costo della simulazione.",
    "controlli": {
      "q": "Massima durata di un turno, in millisecondi. Un processo può terminare prima; se conserva lavoro rientra in fondo alla coda.",
      "s": "Tempo in millisecondi per passare da un processo a un altro. La prima assegnazione e la continuazione dello stesso processo sono gratuite."
    },
    "esperienze": [
      {
        "titolo": "Quanto di due millisecondi",
        "risultato": "B risponde per la prima volta a 3 ms; tutti i lavori terminano a 15 ms.",
        "ragionamento": "A usa 2 ms e il primo cambio richiede 1 ms, perciò B comincia a 3. I turni sono A, B, C, A, B, A: cinque cambi aggiungono 5 ms ai 5 + 3 + 2 = 10 ms di calcolo, dando 15 ms complessivi.",
        "parametri": {
          "q": 2,
          "s": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Quanto (ms): 2; Costo di un cambio (ms): 1. La traccia riparte da «Coda iniziale».",
          "Premi «Passo successivo» e fermati a «Turno di A». Annota il residuo 3 di A e il suo reinserimento in coda. Al turno successivo includi il segmento Δ prima dell’inizio di B.",
          "Avanza fino a «Bilancio», leggendo anche i passaggi intermedi. Conta i cinque segmenti Δ e verifica separatamente la prima risposta di B e il tempo finale."
        ],
        "attesi": [
          {
            "passo": 7,
            "campo": "prima risposta B (ms)",
            "valore": "3"
          },
          {
            "passo": 7,
            "campo": "totale (ms)",
            "valore": "15"
          }
        ]
      },
      {
        "titolo": "Quanto di quattro millisecondi",
        "risultato": "B comincia a 5 ms; la durata totale scende a 13 ms.",
        "ragionamento": "A usa 4 ms prima del cambio da 1 ms, così B inizia a 5. I turni A, B, C, A richiedono soltanto tre cambi: ai 10 ms di lavoro si aggiungono 3 ms. Il miglioramento del tempo finale accompagna una prima risposta più tardiva per B.",
        "parametri": {
          "q": 4,
          "s": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Quanto (ms): 4; Costo di un cambio (ms): 1. La traccia riparte da «Coda iniziale».",
          "Premi «Passo successivo» e fermati a «Turno di A». Annota il solo millisecondo residuo di A e calcola l’inizio di B aggiungendo il primo cambio.",
          "Avanza fino a «Bilancio», leggendo anche i passaggi intermedi. Confronta 13 ms e 5 ms con i due indicatori del caso a quanto breve, spiegando perché cambino in direzioni diverse."
        ],
        "attesi": [
          {
            "passo": 5,
            "campo": "prima risposta B (ms)",
            "valore": "5"
          },
          {
            "passo": 5,
            "campo": "totale (ms)",
            "valore": "13"
          }
        ]
      }
    ]
  },
  "5.3.4": {
    "scopo": "Un processo urgente H aspetta un mutex posseduto da L, di priorità bassa. Confronterai priorità fisse ed ereditarietà per misurare il ritardo introdotto dal processo intermedio M. Le altre due scelte mostrano come la precedenza possa cambiare dopo un turno interamente consumato oppure dopo un’attesa prolungata.",
    "teoria": [
      "La priorità esprime la precedenza accordata a un processo pronto quando più processi chiedono lo stesso core, l’unità che esegue le istruzioni. La scelta spetta allo scheduler; il dispatcher assegna poi il core al processo scelto. H ha priorità alta, M intermedia e L bassa. H aspetta il mutex Mx, un vincolo di accesso esclusivo posseduto da L: per far ripartire H, L deve eseguire il lavoro necessario a rilasciarlo. Il termine lock indica qui il medesimo vincolo.",
      "Con priorità fisse M precede L, benché H sia più urgente di entrambi. Nella traccia M usa il core per 4 millisecondi e L deve ancora lavorare per 2: H aspetta quindi 6 millisecondi, contati dall’arrivo di M. Con l’ereditarietà L riceve temporaneamente la priorità di H, precede M e libera Mx dopo 2 millisecondi. Il costo dei cambi è assunto nullo; al rilascio L recupera la propria priorità.",
      "La retroazione modifica il livello in base all’uso del turno. A e B entrano nella coda alta, servita prima della bassa, con un quanto massimo di 2 millisecondi. A lo consuma interamente e viene spostato nella coda bassa. B usa soltanto un millisecondo prima di chiedere una lettura, perciò conserva il livello alto durante l’attesa del dispositivo. Quando B si risveglia, precede A e riceve il core. Questa regola descrive le due code della prova.",
      "L’invecchiamento modifica invece la precedenza in funzione del tempo già trascorso fra i pronti. A parte con punteggio 1 e guadagna un punto ogni 2 millisecondi interi di attesa. Il flusso concorrente ha punteggio 3 e prevale in caso di parità: a 4 millisecondi A ha raggiunto 3 e aspetta ancora; a 6 millisecondi raggiunge 4, supera il concorrente e viene scelto."
    ],
    "introduzione": [
      "Una priorità elevata può lasciare un processo in attesa quando la risorsa richiesta appartiene a un processo meno urgente. Qui comprenderai l’inversione di priorità seguendo H, il mutex Mx e il suo proprietario L. L’ereditarietà innalza temporaneamente la precedenza di L affinché possa liberare la risorsa; le altre politiche modificano invece la precedenza secondo il turno consumato o l’attesa accumulata.",
      "Carica il caso con priorità fisse e osserva chi riceve il core all’arrivo di M, poi misura l’attesa di H fino al rilascio. Confronta l’ereditarietà, seguendo la priorità effettiva di L. Nel selettore puoi inoltre applicare retroazione e invecchiamento: confronta rispettivamente le due code e i punteggi per individuare l’informazione che determina ogni nuova assegnazione del core."
    ],
    "lettura": "Per la previsione individua il processo scelto nella decisione evidenziata: M all’arrivo del lavoro intermedio con priorità fisse, L durante la donazione con ereditarietà, B al risveglio con retroazione, A a 6 ms con invecchiamento. Nei primi due casi segui inoltre H e il possessore di Mx, contando l’attesa di H dall’arrivo di M. Per la retroazione leggi le code alta e bassa; per l’invecchiamento confronta il punteggio crescente di A con 3 e applica la regola di parità.",
    "conclusione": "Per ogni politica identifica l’informazione che cambia la scelta: il possessore del mutex nell’ereditarietà, il consumo del quanto nella retroazione, il tempo trascorso in coda nell’invecchiamento. Puoi verificare il confronto ricavando 6 e 2 ms per H, il ritorno di B davanti ad A e il sorpasso di A al punteggio 4.",
    "controlli": {
      "caso": "Seleziona una delle quattro politiche. «Priorità fisse» ed «Ereditarietà» confrontano l’attesa di H, pari a 6 e 2 ms. «Retroazione su due code» segue la discesa di A e la precedenza di B al risveglio. «Invecchiamento dei pronti» segue il punteggio di A fino alla scelta a 6 ms."
    },
    "esperienze": [
      {
        "titolo": "Il processo intermedio precede L",
        "risultato": "H aspetta 6 ms prima di diventare pronto.",
        "ragionamento": "M usa il core per 4 ms perché precede L nella graduatoria. L esegue poi i 2 ms ancora necessari a rilasciare Mx: H attende 4 + 2 = 6 ms, benché M abbia priorità inferiore alla sua.",
        "parametri": {
          "caso": "base"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Politica di priorità: Priorità fisse. La traccia riparte da «Acquisizione».",
          "Premi «Passo successivo» e fermati a «Arrivo di M». Osserva M sul core e i 2 ms che L deve ancora eseguire sotto lock.",
          "Avanza fino a «Rilascio», leggendo anche i passaggi intermedi. Somma il turno di M e il lavoro residuo di L, poi verifica quando H diventa pronto."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "attesa di H",
            "valore": "6 ms"
          },
          {
            "passo": 2,
            "campo": "H",
            "valore": "pronto"
          }
        ]
      },
      {
        "titolo": "L eredita la priorità di H",
        "risultato": "H aspetta 2 ms e diventa il primo candidato dopo il rilascio.",
        "ragionamento": "L riceve temporaneamente la priorità alta di H e precede M sul core. Completa quindi subito i 2 ms residui, restituisce Mx e torna alla propria priorità; H può ottenere la risorsa prima del lavoro intermedio.",
        "parametri": {
          "caso": "inherit"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Politica di priorità: Ereditarietà. La traccia riparte da «Acquisizione».",
          "Premi «Passo successivo» e fermati a «Donazione». Leggi la priorità effettiva di L e identifica il motivo per cui il dispatcher lo sceglie.",
          "Avanza fino a «Rilascio», leggendo anche i passaggi intermedi. Confronta i 2 ms con i 6 del caso precedente e attribuisci i 4 ms risparmiati al turno rinviato di M."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "attesa di H",
            "valore": "2 ms"
          },
          {
            "passo": 2,
            "campo": "primo candidato",
            "valore": "H"
          }
        ]
      }
    ]
  },
  "5.3.5": {
    "scopo": "Due core ricevono code di lunghezza molto diversa. Ridistribuirai i lavori prima dell’avvio per osservare come cambino il tempo dell’ultimo completamento e la capacità rimasta inutilizzata.",
    "teoria": [
      "Quando il processore offre due core, ossia due unità capaci di calcolare nello stesso istante, ogni core può ricevere un elenco distinto di lavori pronti. Un elenco molto più lungo dell’altro fa sì che uno dei core resti libero mentre l’altro deve ancora eseguire diversi lavori. Il bilanciamento consiste nel ridistribuire i lavori che entrambi i core sono in grado di svolgere.",
      "Supponiamo che al tempo zero sei lavori siano assegnati al core 0 e uno al core 1. Se ogni lavoro dura un millisecondo, i due core iniziano insieme e il gruppo termina al tempo 6, quando finisce l’ultimo lavoro. Il core 1, che ha finito al tempo 1, rimane disponibile nei cinque millisecondi successivi.",
      "Trasferendo due lavori prima dell’avvio, le code diventano di quattro e tre elementi. I sette millisecondi di lavoro complessivi si distribuiscono ora su quattro millisecondi di orologio. Qui lo spostamento è istantaneo. La lunghezza della coda più lunga determina il momento dell’ultima conclusione. Un solo core inattivo per un millisecondo corrisponde, nella misura complessiva della figura, a un core·ms inutilizzato."
    ],
    "introduzione": [
      "Distribuire lo stesso lavoro fra due core può abbreviare il tempo necessario a completarlo. L’attività rende osservabile questa relazione attraverso code di lavori uguali, tutti pronti e trasferibili prima dell’avvio. La coda più lunga determina l’ultimo completamento, mentre l’inattività complessiva misura la capacità rimasta libera: un core inutilizzato per un millisecondo contribuisce un core·ms a tale misura.",
      "Carica «Code conservate» e conta le sei tessere sul primo core e l’unica sul secondo, ciascuna della durata di un millisecondo. Avanza al completamento, poi confronta «Due lavori trasferiti». Verifica che le code quattro e tre conservino sette lavori complessivi e interpreta insieme tempo finale e inattività, ricordando che nella prova il trasferimento iniziale avviene senza costo."
    ],
    "lettura": "Ogni riga appartiene a un core e ogni casella rappresenta un lavoro di 1 ms. Conta le caselle dopo la distribuzione: il core con la riga più lunga determina l’ultima conclusione, mentre i posti rimasti senza lavoro misurano l’inattività.",
    "conclusione": "Il bilanciamento può ridurre il tempo finale distribuendo il lavoro disponibile fra più core. In questo modello i lavori hanno uguale durata, sono tutti pronti e trasferibili, e la migrazione iniziale è gratuita.",
    "controlli": {
      "n": "Numero di lavori inizialmente assegnati al core 0; il core 1 ne riceve uno. Ogni lavoro dura 1 ms.",
      "balance": "Conserva l’assegnazione iniziale oppure trasferisce lavori al core 1 prima dell’avvio, cercando code di lunghezza vicina."
    },
    "esperienze": [
      {
        "titolo": "Code conservate",
        "risultato": "Il gruppo termina a 6 ms e accumula 5 core·ms di inattività.",
        "ragionamento": "Le code contengono sei lavori e un lavoro, quindi il completamento è max(6,1) = 6 ms. I due core offrono 2 × 6 = 12 core·ms durante quell’intervallo; sette sono utili e i restanti cinque rimangono inutilizzati.",
        "parametri": {
          "n": 6,
          "balance": "keep"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Lavori iniziali sul core 0: 6; Assegnazione: Conserva le code. La traccia riparte da «Code iniziali».",
          "Premi «Passo successivo» e fermati a «Distribuzione». Conta sei caselle sul core 0 e una sul core 1, verificando che nessun lavoro sia stato trasferito.",
          "Avanza fino a «Completamento», leggendo anche i passaggi intermedi. Calcola 2 × 6 − 7 e collega il risultato al tratto libero del core 1."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "tempo totale (ms)",
            "valore": "6"
          },
          {
            "passo": 2,
            "campo": "inattività complessiva (core·ms)",
            "valore": "5"
          }
        ]
      },
      {
        "titolo": "Due lavori trasferiti",
        "risultato": "Le code diventano 4 e 3; il tempo totale è 4 ms e l’inattività vale 1 core·ms.",
        "ragionamento": "Trasferire due lavori lascia 6 − 2 = 4 lavori sul core 0 e 1 + 2 = 3 sul core 1. L’ultimo completamento cade a 4 ms; degli otto core·ms disponibili, sette eseguono lavori e uno resta libero.",
        "parametri": {
          "n": 6,
          "balance": "move"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Lavori iniziali sul core 0: 6; Assegnazione: Bilancia prima di partire. La traccia riparte da «Code iniziali».",
          "Premi «Passo successivo» e fermati a «Distribuzione». Verifica i conteggi 4 e 3 e ritrova i sette lavori complessivi.",
          "Avanza fino a «Completamento», leggendo anche i passaggi intermedi. Confronta max(4,3) e 2 × 4 − 7 con gli indicatori finali."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "tempo totale (ms)",
            "valore": "4"
          },
          {
            "passo": 2,
            "campo": "inattività complessiva (core·ms)",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "5.3.6": {
    "scopo": "B arriva mentre A occupa già il solo core. Ricostruirai il suo arrivo, l’inizio del servizio e il completamento sotto FCFS per distinguere tempo di attesa e durata di calcolo.",
    "teoria": [
      "Quando un solo core, l’unità del processore che esegue le istruzioni, riceve due richieste, la seconda può arrivare mentre il primo lavoro è già in esecuzione. La politica FCFS, dall’inglese first come, first served, serve le richieste nell’ordine in cui arrivano. Il lavoro iniziato conserva il core fino a compimento anche se, nel frattempo, compare un’altra richiesta.",
      "Il tratto continuo di calcolo richiesto al processore prende il nome di burst. A inizia a zero e richiede quattro millisecondi, perciò occupa il core fino all’istante 4. B arriva a 1 e richiede due millisecondi di servizio: può iniziare a 4 e conclude a 6. L’intervallo da 1 a 4 misura l’attesa di B, quello da 4 a 6 il tempo durante il quale il processore ne esegue le istruzioni.",
      "Sulla linea del tempo conviene perciò collocare tre segni separati per il secondo lavoro, uno per l’arrivo, uno per l’inizio effettivo e uno per la conclusione. Quando il cambio di processo è istantaneo, l’estremo finale del primo servizio coincide con l’inizio del successivo, purché la richiesta sia già in coda."
    ],
    "introduzione": [
      "Arrivo, inizio del servizio e completamento sono istanti distinti, anche quando un processo richiede soltanto un breve calcolo. Il problema serve a collocarli correttamente nella politica FCFS, che serve in ordine di arrivo e lascia terminare il lavoro già iniziato. Il burst indica la durata del servizio richiesto: seguirai come questo intervallo si aggiunga all’attesa precedente di B.",
      "Leggi i quattro millisecondi richiesti da A e l’arrivo di B al tempo uno, poi scrivi la previsione del completamento di B. Avanza con «Passo successivo» e confronta il segno dell’arrivo con l’inizio del suo servizio. Aggiungi i due millisecondi del burst soltanto dopo quell’inizio, verificando sulla linea temporale la differenza fra attesa, servizio e istante finale."
    ],
    "lettura": "La linea temporale colloca A da 0 a 4 ms e B da 4 a 6 ms. Il segno dell’arrivo di B a 1 ms cade dentro il turno di A; la distanza da quel segno all’inizio di B misura la sua attesa.",
    "conclusione": "Con FCFS senza interruzioni e costo di cambio nullo, un lavoro già in coda comincia quando finisce il precedente. La durata del proprio burst si aggiunge poi a quell’istante di inizio.",
    "procedura": [
      "Leggi A: arrivo 0 e burst 4 ms; B: arrivo 1 e burst 2 ms. Prevedi l’istante finale di B e registra la risposta.",
      "Avanza a «Servizio di A» e segna l’intervallo nel quale B, già arrivato, attende ancora il core.",
      "Avanza a «Servizio di B» e aggiungi i suoi due millisecondi all’inizio a 4 ms."
    ],
    "risultato": "B termina al tempo 6 ms, dopo aver atteso 3 ms.",
    "ragionamento": "A occupa il core fino a 4 ms. B è arrivato a 1, perciò attende 4 − 1 = 3 ms; il servizio di B dura due millisecondi e termina a 4 + 2 = 6 ms."
  },
  "5.3.7": {
    "scopo": "Un lavoro breve arriva durante il burst di A. Calcolerai il completamento di B con SJF e con SRTF per riconoscere il ruolo della prelazione nella scelta del prossimo intervallo di servizio.",
    "teoria": [
      "Quando più processi sono pronti sullo stesso core, lo scheduler decide quale servire. Un burst è un tratto di lavoro che richiede continuativamente la CPU, il processore. SJF, dall’inglese Shortest Job First, sceglie il lavoro disponibile più breve. SRTF, Shortest Remaining Time First, considera la durata che rimane da eseguire e può sospendere chi ha il turno.",
      "Con SJF senza prelazione, cioè senza interruzione del turno, la scelta viene fatta alla fine del tratto di lavoro in corso. Con SRTF, l’arrivo di una nuova richiesta può far cambiare subito il processo in esecuzione se il nuovo arrivato ha meno lavoro residuo.",
      "Nella traccia i cambi fra processi sono istantanei. A richiede nove millisecondi e inizia a zero. Quando B arriva al tempo 2 con tre millisecondi di lavoro, ad A ne restano sette. Se il turno già iniziato è indivisibile, B aspetta la fine di A; se si applica la prelazione in base al residuo, viene servita prima la richiesta di B, che richiede tre millisecondi. Il confronto fra tre e sette rende distinguibili le scelte delle due politiche."
    ],
    "introduzione": [
      "La scelta del lavoro più breve dipende anche dalla possibilità di interrompere un turno già iniziato. L’esercizio permette di confrontare SJF, che qui attende la conclusione del burst corrente, con SRTF, che sceglie il lavoro residuo minore. Il residuo è il calcolo ancora necessario: misurarlo all’arrivo di B rende osservabile la decisione che separa le due politiche.",
      "Carica l’esempio guidato e prevedi il completamento di B con SJF, considerando i nove millisecondi iniziali di A e i tre richiesti da B. Registra la previsione e avanza fino all’arrivo al tempo due, quando A conserva sette millisecondi. Apri la prova completa per confrontare il completamento sotto SRTF e giustifica entrambi i risultati attraverso l’effettivo inizio di B."
    ],
    "lettura": "La ricostruzione usa gli stessi arrivi per entrambe le politiche. Individua l’istante 2 ms, quando arriva B, e confronta i 7 ms residui di A con i 3 ms richiesti da B prima di leggere i due ordini di servizio.",
    "conclusione": "La scelta del lavoro breve produce effetti diversi a seconda che possa interrompere un turno già iniziato. Per distinguere SJF e SRTF dalla traccia occorre esaminare una nuova richiesta più corta del residuo corrente.",
    "procedura": [
      "Premi «Carica l’esempio guidato»: seleziona l’esercizio 3, «Confrontare SJF e SRTF all’arrivo di B», traccia 1. I passaggi e i risultati seguenti si riferiscono a questa combinazione.",
      "Prevedi il completamento di B con SJF: A parte a zero con 9 ms e B arriva a 2 con 3 ms. Registra la previsione.",
      "Avanza nel calcolo del residuo di A al tempo 2 e confronta 9 − 2 con il burst di B.",
      "Apri la prova completa e calcola anche il completamento sotto SRTF, spiegando da quale istante cominci B in ciascuna politica."
    ],
    "risultato": "B termina a 12 ms con SJF e a 5 ms con SRTF.",
    "ragionamento": "SJF senza prelazione lascia A sul core fino a 9, poi serve B per tre millisecondi fino a 12. SRTF confronta 3 con il residuo 9 − 2 = 7, interrompe A e serve B da 2 a 5; A riprende successivamente."
  },
  "5.3.8": {
    "scopo": "Una traccia mostra due turni dello stesso processo separati da un’attesa. Misurerai risposta, attesa totale e turnaround usando confini temporali precisi, poi verificherai il bilancio fra servizio e attesa.",
    "teoria": [
      "Una traccia temporale permette di distinguere la prima occasione in cui un processo usa il core dall’istante in cui ne conclude definitivamente l’uso. Fra queste due date possono cadere più turni di lavoro e più attese, che occorre leggere separatamente.",
      "Il tempo di risposta si misura dall’arrivo al primo turno. Il tempo complessivo di attraversamento, chiamato turnaround, si misura dall’arrivo alla fine dell’ultimo turno. Per ricavare l’attesa si sommano invece soltanto gli intervalli in cui il processo era pronto e il core serviva qualcun altro.",
      "P arriva al tempo 2, usa il core da 5 a 7 e da 10 a 12. La prima risposta arriva dopo tre millisecondi e il completamento dopo dieci. Poiché gli intervalli rimanenti sono trascorsi fra i pronti, l’attesa vale tre millisecondi prima di ciascun turno, sei in tutto. Il lavoro utile dura quattro millisecondi e completa il bilancio 6 + 4 = 10. Una traccia che includesse attese di ingresso o uscita dei dati attraverso dispositivi, indicate con I/O, richiederebbe di contabilizzarle separatamente."
    ],
    "introduzione": [
      "La prima risposta e la conclusione di un processo descrivono momenti diversi della sua esecuzione. Questa soluzione insegna a misurare risposta, attesa totale e turnaround su una traccia con due turni. Il turnaround comprende l’intero intervallo dall’arrivo al completamento; poiché qui tutti gli intervalli fuori dal core sono trascorsi fra i pronti, servizio e attesa ne ricostruiscono la durata.",
      "Ripristina l’esempio guidato e annota l’arrivo a due, i turni da cinque a sette e da dieci a dodici. Con «Passo successivo» confronta il primo ritardo con la somma delle due attese, quindi controlla i risultati nelle verifiche finali. Sommare i quattro millisecondi di servizio ai sei di attesa permette di verificare il turnaround senza confonderlo con la prima risposta."
    ],
    "lettura": "Colloca sulla linea l’arrivo a 2 ms, i turni 5–7 e 10–12 e la fine a 12. I segmenti fuori CPU sono tutti trascorsi fra i pronti in questa traccia; puoi quindi sommarli senza introdurre tempi di I/O.",
    "conclusione": "Il tempo di risposta termina al primo avvio, l’attesa somma gli intervalli pronti e il turnaround termina alla conclusione. Con assenza di blocchi, servizio e attesa ricostruiscono l’intero turnaround.",
    "procedura": [
      "Premi «Carica l’esempio guidato»: seleziona l’esercizio 1, «Misurare le attese su una traccia», traccia 1. I passaggi e i risultati seguenti si riferiscono a questa combinazione.",
      "Annota arrivo, primo avvio, due intervalli di CPU e fine prima di avviare la ricostruzione.",
      "Avanza e calcola separatamente 5 − 2 per la risposta e (5 − 2) + (10 − 7) per l’attesa.",
      "Nelle verifiche finali confronta il turnaround 12 − 2 con la somma di attesa e durata dei due turni."
    ],
    "risultato": "Risposta 3 ms, attesa totale 6 ms, turnaround 10 ms.",
    "ragionamento": "La prima risposta avviene dopo 5 − 2 = 3 ms. Le due attese durano 3 ms ciascuna, dando 6; il servizio occupa (7 − 5) + (12 − 10) = 4 ms. Il turnaround è 12 − 2 = 10 ms e coincide con 6 + 4."
  },
  "5.4.1": {
    "scopo": "Due thread ricevono lo stesso puntatore e dispongono di registri propri. Seguirai una scrittura di T1 e una lettura sincronizzata di T2 per separare l’aggiornamento della memoria condivisa dall’aggiornamento del registro locale.",
    "teoria": [
      "Un programma che, mentre prepara una risposta, continua ad accogliere nuove richieste può affidare le due attività a thread distinti. Ciascun thread è una sequenza di istruzioni che ha i propri registri, piccole memorie del processore che contengono i valori del suo calcolo, e il proprio stack, l’area in cui si conservano le chiamate di funzione e i loro dati locali. I thread dello stesso processo possono però raggiungere gli stessi oggetti in memoria.",
      "Qui entrambi ricevono l’indirizzo della cella h, ricavata nell’heap, l’area in cui il programma può riservare memoria durante l’esecuzione. Un puntatore contiene quell’indirizzo. Leggere attraverso il puntatore significa raggiungere h e prelevarne il contenuto, che è distinto dal numero usato per localizzarla.",
      "Se T1 scrive 9 in h mentre il registro r di T2 contiene 3, la scrittura modifica h. Il registro di T2 continua a valere 3 finché T2 esegue la propria lettura. La sincronizzazione, un accordo fra thread che rende la scrittura precedente alla lettura secondo le regole di accesso alla memoria, assicura che quel prelievo avvenga dopo la scrittura, permettendo a T2 di ricevere il 9 attraverso la cella comune."
    ],
    "introduzione": [
      "Condividere una cella di memoria permette a due thread di scambiarsi un dato, mentre ciascun thread conserva registri propri. L’attività serve a seguire separatamente questi due tipi di stato. Un puntatore contiene l’indirizzo della cella h nell’heap, l’area di memoria dinamica del processo; la sincronizzazione colloca la lettura di T2 dopo la scrittura di T1 e ne rende giustificato il risultato.",
      "Carica il passaggio del valore nove e avanza fino alla scrittura, confrontando h con il registro di T2, ancora uguale a tre. Prosegui alla lettura sincronizzata e individua l’istruzione che aggiorna quel registro. Ripeti con quindici: seguire prima la freccia verso la memoria e poi quella verso T2 permette di attribuire ciascun cambiamento all’accesso che lo produce."
    ],
    "lettura": "La cella h è comune ai due thread, mentre i riquadri r di T1 e r di T2 sono distinti. Segui prima la freccia di scrittura verso h e poi quella di lettura verso T2: il numero entra nel registro di T2 soltanto al secondo accesso.",
    "conclusione": "Condividere una cella consente lo scambio dei dati, mentre i registri restano parte del contesto di ciascun thread. La sincronizzazione colloca la lettura dopo la scrittura e rende giustificata la previsione del valore ricevuto.",
    "controlli": {
      "x": "Valore che T1 carica nel proprio registro e scrive in h. T2 conserva inizialmente 3 nel proprio registro, poi esegue la lettura dopo la sincronizzazione."
    },
    "esperienze": [
      {
        "titolo": "Passaggio del valore nove",
        "risultato": "Dopo la lettura T2 vede h = 9 e il suo registro r vale 9.",
        "ragionamento": "La scrittura di T1 aggiorna h a 9 lasciando inizialmente r di T2 uguale a 3. Quando T2 legge h dopo la sincronizzazione, copia quel 9 nel proprio registro: il secondo cambiamento deriva da un’istruzione di T2.",
        "parametri": {
          "x": 9
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Valore scritto da T1: 9. La traccia riparte da «Creazione».",
          "Premi «Passo successivo» e fermati a «Scrittura». Confronta h e r di T2 subito dopo la scrittura: annota 9 e 3 nelle rispettive sedi.",
          "Avanza fino a «Lettura dopo la sincronizzazione», leggendo anche i passaggi intermedi. Verifica che r di T2 cambi soltanto alla lettura e colleghi il proprio nuovo valore a h."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "h visto da T2",
            "valore": "9"
          },
          {
            "passo": 2,
            "campo": "r di T2",
            "valore": "9"
          },
          {
            "passo": 1,
            "campo": "r di T1",
            "valore": "9"
          },
          {
            "passo": 1,
            "campo": "h",
            "valore": "9"
          },
          {
            "passo": 1,
            "campo": "r di T2",
            "valore": "3"
          }
        ]
      },
      {
        "titolo": "Passaggio del valore quindici",
        "risultato": "Dopo la lettura T2 vede h = 15 e r di T2 vale 15.",
        "ragionamento": "Il nuovo ingresso cambia in 15 il dato scritto da T1. Il registro di T2 conserva 3 durante quella scrittura e diventa 15 quando T2 copia la cella condivisa dopo il punto di sincronizzazione.",
        "parametri": {
          "x": 15
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Valore scritto da T1: 15. La traccia riparte da «Creazione».",
          "Premi «Passo successivo» e fermati a «Scrittura». Controlla il valore 15 in h e il valore 3 ancora presente nel registro di T2.",
          "Avanza fino a «Lettura dopo la sincronizzazione», leggendo anche i passaggi intermedi. Segui il trasferimento da h al registro di T2 e confronta la sequenza con il caso precedente."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "h visto da T2",
            "valore": "15"
          },
          {
            "passo": 2,
            "campo": "r di T2",
            "valore": "15"
          },
          {
            "passo": 1,
            "campo": "r di T1",
            "valore": "15"
          },
          {
            "passo": 1,
            "campo": "h",
            "valore": "15"
          },
          {
            "passo": 1,
            "campo": "r di T2",
            "valore": "3"
          }
        ]
      }
    ]
  },
  "5.4.2": {
    "scopo": "Cinque attività indipendenti sono pronte nello stesso istante. Cambierai il numero di core per distinguere la presenza di più thread dal numero di istruzioni che possono avanzare simultaneamente e dalla durata complessiva.",
    "teoria": [
      "Suddividere un lavoro in più attività consente di farle avanzare indipendentemente. Ciascuna sequenza di istruzioni che il programma può avviare è qui un thread. Più thread sono concorrenti quando la loro vita si sovrappone. Perché due di essi eseguano davvero nello stesso istante servono abbastanza unità hardware, che nel modello corrispondono ai core disponibili.",
      "Se cinque thread diventano pronti insieme e ciascuno occupa un core per un millisecondo, due core possono servire i primi due nello stesso intervallo. Nel secondo millisecondo ne completano altri due. Il quinto, pur essendo pronto fin dall’inizio, ha bisogno di un terzo turno in cui uno dei core rimane libero.",
      "Si può leggere il risultato contando quante volte occorre riempire un gruppo di posti, uno per core, per esaurire i thread disponibili. Se l’ultimo gruppo è incompleto, richiede comunque un millisecondo. Questa relazione presuppone lavori di uguale durata che possono procedere indipendentemente e diventano tutti pronti al tempo zero."
    ],
    "introduzione": [
      "Avere più thread pronti significa disporre di più attività che possono avanzare, mentre l’esecuzione simultanea richiede posti hardware sufficienti. Qui distinguerai concorrenza e parallelismo contando i gruppi serviti dai core. Ogni thread richiede un millisecondo e ogni core ne esegue uno per intervallo: anche un ultimo gruppo incompleto occupa un intero millisecondo e contribuisce alla durata complessiva.",
      "Carica «Cinque thread su due core» e confronta, nel primo turno, i thread assegnati con quelli rimasti in coda. Avanza all’ultimo turno e conta le colonne della figura, includendo quella con un solo posto occupato. Ripeti il caso su un core: il confronto fra tre e cinque millisecondi collega la disponibilità hardware alla durata, mantenendo uguale il lavoro richiesto."
    ],
    "lettura": "Ogni riga del disegno rappresenta un core e ogni colonna un intervallo di 1 ms. Una casella con T identifica il thread servito; il trattino segna un core libero. Conta le colonne necessarie per collocare tutti i thread.",
    "conclusione": "Il massimo parallelismo istantaneo dipende dai core disponibili e dai thread pronti. Con lavori indipendenti di 1 ms arrivati insieme, la durata è il numero di gruppi necessari, cioè il quoziente thread/core arrotondato verso l’alto.",
    "controlli": {
      "n": "Numero di thread pronti al tempo zero. Ognuno richiede esattamente 1 ms di calcolo indipendente.",
      "k": "Numero di core che possono eseguire simultaneamente. Ogni core riceve al massimo un thread per intervallo di 1 ms."
    },
    "esperienze": [
      {
        "titolo": "Cinque thread su due core",
        "risultato": "L’ultimo turno contiene un thread e il lavoro termina a 3 ms.",
        "ragionamento": "I primi due turni servono due thread ciascuno, per un totale di quattro. Il quinto occupa una sola casella nel terzo turno: 5/2 = 2,5 gruppi richiede tre intervalli interi di 1 ms.",
        "parametri": {
          "n": 5,
          "k": 2
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Thread da 1 ms: 5; Core disponibili: 2. La traccia riparte da «Ingresso».",
          "Premi «Passo successivo» e fermati a «Primo turno». Conta due thread in parallelo e tre in coda. Calcola i due turni ancora necessari e aggiungili al primo: il campo della previsione richiede la durata totale, in millisecondi.",
          "Avanza fino a «Ultimo turno», leggendo anche i passaggi intermedi. Controlla le tre colonne e il posto libero nell’ultima; confronta il conteggio con la durata di 3 ms."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "thread nell’ultimo turno",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "durata totale (ms)",
            "valore": "3"
          }
        ]
      },
      {
        "titolo": "Cinque thread su un core",
        "risultato": "Ogni turno contiene un thread e la durata totale è 5 ms.",
        "ragionamento": "Un unico core serve un thread per millisecondo. I cinque thread sono concorrenti perché le loro vite si sovrappongono, mentre il servizio procede in cinque turni successivi e la durata è 5/1 = 5 ms.",
        "parametri": {
          "n": 5,
          "k": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Thread da 1 ms: 5; Core disponibili: 1. La traccia riparte da «Ingresso».",
          "Premi «Passo successivo» e fermati a «Primo turno». Conta un solo thread sul core e quattro in coda, separando disponibilità del lavoro e disponibilità hardware.",
          "Avanza fino a «Ultimo turno», leggendo anche i passaggi intermedi. Verifica cinque colonne sulla singola riga e confronta il tempo totale con il caso a due core."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "thread nell’ultimo turno",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "durata totale (ms)",
            "valore": "5"
          }
        ]
      }
    ]
  },
  "5.4.3": {
    "scopo": "Una libreria offre quattro thread utente, che devono essere eseguiti attraverso worker visibili al kernel. Farai bloccare U1 su una lettura e conterai quanti altri thread possano usare i quattro core disponibili.",
    "teoria": [
      "Una libreria può offrire al programma quattro thread utente, cioè quattro attività tra le quali sa distribuire il lavoro, anche se il sistema operativo vede un numero diverso di entità da eseguire. La figura chiama worker ciascuna entità alla quale il kernel, la parte del sistema operativo che distribuisce le risorse, può assegnare un core di calcolo. Per eseguire un thread utente occorrono dunque sia un worker disponibile sia un core sul quale farlo avanzare.",
      "Se i quattro thread dipendono da un unico worker, una lettura bloccante di U1 sospende quel worker fino all’arrivo dei dati dal dispositivo. È un’operazione di ingresso dei dati, indicata con I/O nella figura. Gli altri tre thread sono pronti, eppure durante l’attesa manca chi possa portarli su uno dei core liberi. Con due worker la sospensione di U1 ne lascia invece uno utilizzabile.",
      "Nell’associazione uno a uno ciascun thread utente dispone del proprio worker. La lettura di U1 ne occupa uno e i tre restanti possono lavorare contemporaneamente sui core disponibili. Il confronto riguarda una dotazione fissa di worker, così che il risultato dipende direttamente dal collegamento rappresentato fra i due livelli."
    ],
    "introduzione": [
      "Un thread gestito da una libreria può eseguire soltanto attraverso un’entità alla quale il kernel assegni un core. L’attività serve a riconoscere questo vincolo intermedio, chiamato worker nella figura. Durante una lettura bloccante il worker interessato resta sospeso: confrontare thread pronti, worker utilizzabili e core disponibili spiega quanto lavoro possa procedere anche quando l’hardware offre posti liberi.",
      "Carica «Quattro thread su un worker» e segui la richiesta di U1 fino al blocco di W1. Conta gli altri thread pronti e confrontali con il numero di worker utilizzabili. Passa al caso con un worker per thread e ripeti il conteggio dopo la lettura: il massimo simultaneo dipende dalle entità rimaste disponibili, mentre i quattro core restano gli stessi."
    ],
    "lettura": "La riga Utente contiene U1–U4; la riga Kernel contiene i worker schedulabili. La freccia evidenziata segue la richiesta di U1 fino a W1, che attende il dispositivo. Conta i worker rimasti utilizzabili prima di dedurre il parallelismo degli altri thread.",
    "conclusione": "I core liberi bastano a eseguire un thread soltanto se esiste anche un worker disponibile che lo rappresenti al kernel. L’associazione fra i due livelli determina come il blocco di una chiamata si propaga alle altre attività.",
    "controlli": {
      "k": "Numero di worker kernel per quattro thread utente: uno, due oppure quattro. La prova dispone sempre di quattro core e mantiene fisso il numero di worker durante l’attesa."
    },
    "esperienze": [
      {
        "titolo": "Quattro thread su un worker",
        "risultato": "Dopo il blocco di U1, il massimo simultaneo degli altri tre thread è zero.",
        "ragionamento": "L’unico worker W1 attende il dispositivo. Rimangono tre thread utente pronti e zero worker disponibili per eseguirli; il limite è min(3,0,4) = 0, contando thread, worker e core.",
        "parametri": {
          "k": "1"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Associazione di 4 thread utente: Molti a uno. La traccia riparte da «Prima dell’I/O».",
          "Premi «Passo successivo» e fermati a «U1 chiede I/O». Verifica che il blocco di W1 lasci zero worker utilizzabili, pur con tre attività utente pronte.",
          "Avanza fino a «Durante l’attesa», leggendo anche i passaggi intermedi. Confronta il numero dei pronti con il massimo simultaneo e identifica il livello che impone il limite."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "thread pronti oltre U1",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "massimo simultaneo",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Un worker per thread",
        "risultato": "Dopo il blocco di U1, tre thread possono eseguire simultaneamente.",
        "ragionamento": "Dei quattro worker iniziali uno resta impegnato nell’attesa di U1 e tre rimangono disponibili. Essendoci anche tre thread pronti e quattro core, il limite diventa min(3,3,4) = 3.",
        "parametri": {
          "k": "4"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Associazione di 4 thread utente: Uno a uno. La traccia riparte da «Prima dell’I/O».",
          "Premi «Passo successivo» e fermati a «U1 chiede I/O». Conta il worker bloccato e i tre ancora utilizzabili.",
          "Avanza fino a «Durante l’attesa», leggendo anche i passaggi intermedi. Verifica il massimo simultaneo pari a tre e confrontalo con l’associazione molti a uno."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "thread pronti oltre U1",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "massimo simultaneo",
            "valore": "3"
          }
        ]
      }
    ]
  },
  "5.4.4": {
    "scopo": "Tre worker devono ricevere indici diversi. Seguirai gli indirizzi passati alla creazione e i valori letti dopo la barriera per comprendere la differenza fra una cella per worker e il puntatore ripetuto alla variabile del ciclo.",
    "teoria": [
      "Un thread è una sequenza di istruzioni che può avanzare insieme ad altre nello stesso processo. POSIX specifica le funzioni pthread_create, che avvia un nuovo thread, e pthread_join, che attende la conclusione di un thread già creato. Qui i nuovi thread sono chiamati worker perché ricevono una parte del lavoro. L’argomento passato alla creazione è un puntatore, ossia un indirizzo: per sapere quale valore leggerà il worker occorre individuare l’oggetto che si trova a quell’indirizzo.",
      "Un array raccoglie celle numerate a partire da zero. La scrittura a[1] indica la seconda cella, mentre &a[1] ne indica l’indirizzo. Il creatore può preparare a[0], a[1] e a[2] con i valori 0, 1 e 2 e passare un indirizzo diverso a ciascun worker. Se passa tre volte &i, tutti i puntatori identificano invece la medesima variabile i, che al termine del ciclo contiene 3.",
      "Il cancello di avvio, indicato come barriera nella traccia, trattiene i worker finché il creatore ha terminato la preparazione e consente poi le letture con i dati visibili. La prova può così confrontare 0, 1, 2 con 3, 3, 3 senza sovrapporre letture e incrementi di i. Il creatore mantiene in vita l’array o la variabile fino alla fine dei join, completando le attese prima di uscire dal blocco che contiene questi oggetti.",
      "Il terzo scenario include un errore di creazione: il codice EAGAIN segnala che il terzo tentativo fallisce. Il creatore conserva soltanto gli identificativi dei due successi e apre il cancello anche per questi due worker. A tale scopo aggiorna una condizione di avvio sotto mutex, un vincolo che riserva l’accesso a un partecipante per volta, e risveglia gli interessati affinché la ricontrollino. I due thread leggono 0 e 1; i join da completare sono quindi due."
    ],
    "introduzione": [
      "Passare un argomento a un thread significa indicargli un oggetto che dovrà leggere. L’esperimento chiarisce la differenza fra consegnare indirizzi di celle distinte e ripetere l’indirizzo della variabile del ciclo. La barriera trattiene le letture fino alla fine della preparazione, mentre i join attendono la conclusione dei worker: queste condizioni permettono di attribuire i risultati agli oggetti effettivamente raggiunti.",
      "Carica «Una cella per ciascun worker» e segui le frecce fino ai tre elementi dell’array. Alla barriera confronta le letture, poi verifica separatamente join e indici distinti. Ripeti con «Tre copie dello stesso indirizzo»: i tre worker leggono la medesima cella dopo il ciclo, quindi il confronto fra numero di thread e valori distinti rivela l’effetto dei puntatori uguali."
    ],
    "lettura": "Segui ogni freccia dal worker alla cella indicata dal suo puntatore. Nel caso con array le frecce terminano in tre celle distinte; nel caso con &i convergono sulla stessa cella. Con l’errore al terzo tentativo conta soltanto i due worker creati, poi verifica due letture distinte e due join.",
    "conclusione": "La previsione richiede tre conteggi distinti: gli oggetti raggiunti dai puntatori, i thread effettivamente creati e i join dovuti. Le tre configurazioni producono rispettivamente tre, uno e due valori distinti, mentre il creatore conserva gli oggetti fino alla conclusione dei lettori.",
    "controlli": {
      "caso": "Sceglie l’organizzazione degli argomenti: celle distinte, la stessa cella del ciclo oppure il fallimento della terza creazione. Nei casi guidati le letture avvengono dopo una barriera che rende deterministico il confronto."
    },
    "esperienze": [
      {
        "titolo": "Una cella per ciascun worker",
        "risultato": "I worker leggono 0, 1 e 2; si completano tre join e si ottengono tre indici distinti.",
        "ragionamento": "I puntatori &a[0], &a[1] e &a[2] raggiungono tre oggetti inizializzati separatamente. La barriera avvia le letture dopo la preparazione e i join precedono la fine della vita dell’array, così ciascun worker ritrova il proprio valore.",
        "parametri": {
          "caso": "el"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Passaggio degli argomenti e avvio: Una cella per worker. La traccia riparte da «Creazione».",
          "Premi «Passo successivo» e fermati a «Barriera». Segui le tre frecce fino alle celle e annota la sequenza delle letture 0, 1, 2.",
          "Avanza fino a «Raccolta», leggendo anche i passaggi intermedi. Verifica separatamente tre join e tre indici distinti; spiega quale proprietà controlla ciascun numero."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "join completati",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "indici distinti",
            "valore": "3"
          }
        ]
      },
      {
        "titolo": "Tre copie dello stesso indirizzo",
        "risultato": "Tutti leggono 3: i join sono tre e l’indice distinto è uno.",
        "ragionamento": "Ogni worker riceve &i, quindi le tre frecce raggiungono lo stesso oggetto. Dopo il ciclo i vale 3; la barriera colloca tutte le letture dopo quell’aggiornamento. I tre join confermano tre worker conclusi, mentre il valore osservato coincide per tutti.",
        "parametri": {
          "caso": "loop"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Passaggio degli argomenti e avvio: Una cella condivisa per il ciclo. La traccia riparte da «Creazione».",
          "Premi «Passo successivo» e fermati a «Barriera». Controlla che la cella i contenga 3 all’apertura della barriera e che tutte le frecce la raggiungano.",
          "Avanza fino a «Raccolta», leggendo anche i passaggi intermedi. Confronta i tre join con l’unico indice distinto, poi attribuisci il risultato all’identità dell’oggetto argomento."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "join completati",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "indici distinti",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "5.4.5": {
    "scopo": "Un lavoratore esegue un accesso di memoria invalido. Confronterai un servizio organizzato in thread con uno organizzato in processi per individuare quali attività vengono coinvolte nella terminazione.",
    "teoria": [
      "Un thread è un flusso di istruzioni; più thread dello stesso processo condividono la memoria accessibile a quel processo. Un servizio che risponde a molte richieste può assegnarle a più lavoratori. Se i lavoratori sono thread dello stesso processo, dispongono di un’unica mappa della memoria. Se ciascuno è un processo a sé, ha una mappa distinta e può scambiare dati con gli altri attraverso canali predisposti dal sistema, fra i quali le pipe, canali da cui un processo può leggere i byte che un altro vi ha scritto.",
      "Quando B tenta di leggere una pagina di memoria priva del permesso di lettura per quel processo, il sistema operativo segnala la violazione, qui con il segnale SIGSEGV. Con il comportamento predefinito adottato nella prova, tale errore termina il processo che contiene l’attività responsabile. Il confine del processo stabilisce dunque quali altri lavoratori vengono coinvolti nella terminazione.",
      "Nel servizio con tre thread, anche A e C appartengono al processo che termina. Nel servizio con tre processi, A e C mantengono le proprie risorse e continuano a servire richieste. Il supervisore che li ha avviati rimane esterno in entrambe le organizzazioni e può intervenire per il riavvio."
    ],
    "introduzione": [
      "Il confine di un processo determina quali attività siano coinvolte dalla sua terminazione. L’obiettivo è confrontare l’isolamento offerto da tre thread nello stesso processo con quello di tre processi distinti. Il guasto di B provoca SIGSEGV, il segnale di violazione della memoria: nella prova si applica la terminazione predefinita del processo, mentre il supervisore rimane esterno al servizio.",
      "Carica l’organizzazione con tre thread e fermati al guasto, individuando il contorno comune ad A, B e C. Avanza all’esito e conta i lavoratori superstiti. Confronta poi i tre processi separati, seguendo il solo contorno di B: i due risultati permettono di distinguere l’attività responsabile dell’accesso invalido dall’insieme coinvolto nella terminazione e dal supervisore ancora attivo."
    ],
    "lettura": "I contorni esterni identificano i domini di memoria dei processi. Nel primo caso A, B e C condividono un contorno; nel secondo ogni lavoratore ne ha uno proprio. Il segno SIGSEGV identifica B come origine del guasto, mentre l’ultimo fotogramma mostra i superstiti.",
    "conclusione": "Il confine di processo delimita gli effetti della terminazione causata dal segnale considerato. Il modello assume l’azione predefinita di SIGSEGV e un supervisore esterno, così permette di osservare il diverso isolamento delle due organizzazioni.",
    "controlli": {
      "caso": "Sceglie se A, B e C siano thread nello stesso processo oppure tre processi monothread separati. L’accesso invalido di B e il supervisore esterno restano gli stessi."
    },
    "esperienze": [
      {
        "titolo": "Tre thread nello stesso processo",
        "risultato": "Restano zero lavoratori; il supervisore è attivo.",
        "ragionamento": "L’accesso invalido di B provoca SIGSEGV con azione predefinita di terminazione del processo. Poiché A, B e C appartengono a quel processo, si chiudono tutti e tre; il supervisore resta esterno e può avviare un nuovo servizio.",
        "parametri": {
          "caso": "threads"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Organizzazione dei lavoratori: Tre thread in un processo. La traccia riparte da «Avvio».",
          "Premi «Passo successivo» e fermati a «Guasto». Individua il contorno comune e distingui il thread responsabile dall’insieme coinvolto nella terminazione.",
          "Avanza fino a «Esito», leggendo anche i passaggi intermedi. Conta i superstiti all’interno del servizio e verifica che il supervisore rimanga attivo."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "lavoratori superstiti",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "supervisore",
            "valore": "attivo"
          }
        ]
      },
      {
        "titolo": "Tre processi separati",
        "risultato": "A e C continuano: restano due lavoratori e il supervisore è attivo.",
        "ragionamento": "B appartiene a uno spazio di indirizzi proprio, perciò il segnale termina quel processo. A e C conservano le proprie esecuzioni e il supervisore può raccogliere B e sostituirlo.",
        "parametri": {
          "caso": "procs"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Organizzazione dei lavoratori: Tre processi separati. La traccia riparte da «Avvio».",
          "Premi «Passo successivo» e fermati a «Guasto». Trova i tre contorni distinti e individua il solo processo terminato.",
          "Avanza fino a «Esito», leggendo anche i passaggi intermedi. Conta A e C e confronta i due superstiti con l’esito dell’organizzazione a thread."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "lavoratori superstiti",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "supervisore",
            "valore": "attivo"
          }
        ]
      }
    ]
  },
  "5.4.6": {
    "scopo": "Tre worker ricevono gli indirizzi di tre elementi di un array. Seguirai il puntatore del secondo worker per distinguere indice, indirizzo e contenuto, controllando anche la durata dell’oggetto.",
    "teoria": [
      "Un programma può distribuire il lavoro fra più worker, thread che eseguono ciascuno una parte delle istruzioni. Per assegnare i dati a ciascuno può raggrupparli in un array, una sequenza di celle numerate a partire da zero. Le parentesi quadre indicano l’indice della cella, mentre il simbolo & davanti alla cella ne indica l’indirizzo. Leggere attraverso quell’indirizzo, operazione chiamata dereferenziazione, permette al worker di raggiungerne il contenuto.",
      "L’array ids conserva i valori 10, 20 e 30. Il worker W1 riceve &ids[1], cioè l’indirizzo della seconda cella, perché la numerazione degli elementi parte da zero. Quando legge attraverso quel puntatore ottiene 20, purché la cella esista ancora e il contenuto sia rimasto quello assegnato. L’indice 1 seleziona la posizione e il numero 20 è il valore conservato.",
      "Lo schema dispone in corrispondenza ogni lavoratore e il suo indirizzo. Il creatore attende la conclusione di ciascun worker mediante un join e mantiene in vita l’array fino al completamento di tutte queste attese. Questo ordine assicura che anche l’ultimo arrivato alla propria lettura trovi l’oggetto che gli era stato indicato."
    ],
    "introduzione": [
      "Un indice, un indirizzo e il contenuto di una cella hanno funzioni diverse. Questo problema serve a distinguerli seguendo l’argomento del secondo worker nell’array ids, una sequenza numerata da zero. Il simbolo & indica l’indirizzo della cella; leggerla attraverso il puntatore permette di ottenere il valore conservato, purché l’oggetto resti valido fino all’accesso del thread.",
      "Osserva i valori dieci, venti e trenta e scrivi la previsione per W1, che riceve &ids[1]. Avanza con «Passo successivo» e confronta la posizione raggiunta dalla freccia con il contenuto letto. Nel passaggio finale controlla che l’array rimanga in vita fino ai join: il risultato dipende sia dall’elemento selezionato sia dalla possibilità di leggerlo quando il worker esegue."
    ],
    "lettura": "Le celle sono numerate da zero e contengono 10, 20 e 30. La freccia da W1 raggiunge ids[1], cioè la seconda cella. L’ultimo passaggio collega la lettura alla durata dell’array, che si estende fino ai join.",
    "conclusione": "Passare un puntatore consegna una posizione dalla quale il worker leggerà il dato. Un oggetto distinto per ciascun lavoratore e una durata sufficiente conservano l’associazione voluta fra destinatario e valore.",
    "procedura": [
      "Leggi i tre valori dell’array e individua l’indice 1. Registra la previsione del contenuto letto da W1.",
      "Avanza a «Passare il puntatore» e segui &ids[1] fino alla seconda cella.",
      "Avanza a «Attendere» e verifica il valore letto e la condizione di durata dell’array fino ai join."
    ],
    "risultato": "Il worker W1 legge 20.",
    "ragionamento": "La numerazione comincia da zero: ids[0] contiene 10, ids[1] contiene 20 e ids[2] contiene 30. W1 riceve l’indirizzo della seconda cella e la dereferenzia mentre l’array è ancora vivo, ottenendo 20."
  },
  "5.4.7": {
    "scopo": "A modifica una cella dell’heap e B osserva la cella insieme a un proprio registro. Prevederai entrambi i valori per separare il dato condiviso dallo stato locale del thread.",
    "teoria": [
      "Un processo può avere più thread, cioè più flussi di istruzioni. Mentre ogni thread conserva nei propri registri, le piccole memorie del processore, i valori sui quali sta lavorando, tutti possono raggiungere la stessa area di memoria dinamica, chiamata heap. Anche un dato privato in un registro può avere lo stesso valore numerico di un dato condiviso senza essere la stessa cella.",
      "Una scrittura nell’heap è visibile a entrambi quando gli accessi sono opportunamente sincronizzati. Il registro appartiene invece al contesto del singolo thread, che il sistema conserva anche se al thread viene temporaneamente tolto il core.",
      "A scrive 42 nella cella condivisa h, che inizialmente vale 2, mentre B conserva 6 nel proprio registro r. La barriera è il punto di incontro che colloca l’osservazione di B dopo la scrittura di A e rende visibile h = 42. Il registro r conserva 6, perché nell’esperimento B lo esamina senza assegnargli un nuovo valore."
    ],
    "introduzione": [
      "Una scrittura nell’heap modifica un oggetto comune ai thread dello stesso processo, mentre i registri conservano lo stato locale di ciascun flusso. L’esercizio ti aiuta a prevedere entrambe le osservazioni di B senza sovrapporre le loro sedi. La barriera ordina l’osservazione dopo la scrittura di A e rende visibile il nuovo contenuto di h, lasciando distinto il registro personale r.",
      "Premi «Carica l’esempio guidato» e prevedi il valore di h che B leggerà dopo la scrittura di 42. Registra la risposta e avanza tenendo separata l’annotazione del registro r, inizialmente uguale a sei. Nella prova completa confronta i due risultati e indica quale operazione abbia modificato h, verificando se nella sequenza sia prevista anche un’assegnazione al registro di B."
    ],
    "lettura": "La cella h rappresenta la memoria comune, mentre r è conservato nel riquadro del contesto di B. La barriera colloca l’osservazione dopo la scrittura di A; confronta i due valori senza supporre che una scrittura nell’heap modifichi automaticamente r.",
    "conclusione": "I thread condividono gli oggetti del processo, mentre ciascuno conserva il proprio contesto di registri. La sincronizzazione consente di attribuire alla lettura di h il valore scritto da A.",
    "procedura": [
      "Premi «Carica l’esempio guidato»: seleziona l’esercizio 1, «Distinguere registri e heap», traccia 1. I passaggi e i risultati seguenti si riferiscono a questa combinazione.",
      "Nel campo iniziale prevedi il valore di h letto da B dopo la scrittura di 42 e registra la risposta.",
      "Segui la ricostruzione dalla cella h iniziale a 2 fino alla scrittura e alla barriera, tenendo annotato r di B uguale a 6.",
      "Apri la prova completa e rispondi anche sul registro, spiegando quale istruzione potrebbe modificarlo."
    ],
    "risultato": "B osserva h = 42 e il proprio registro r = 6.",
    "ragionamento": "A scrive nella cella comune h e la barriera ordina la successiva osservazione di B, che legge 42. Il registro r appartiene al contesto di B e nessuna istruzione descritta vi scrive: conserva pertanto 6."
  },
  "5.4.8": {
    "scopo": "Quattro worker ricevono puntatori agli elementi di un array inizializzato durante un ciclo. Ricostruirai i valori dopo la barriera per contare quanti siano distinti e sommarli.",
    "teoria": [
      "Quando si avvia un thread, cioè un flusso di istruzioni che condivide la memoria del processo, un argomento può indicare la posizione in cui esso troverà il proprio lavoro. Due copie di un indirizzo conducono alla stessa cella. Se il programma che prepara i lavori continua a riscrivere quella cella, il valore letto dipende anche dall’ordine fra scrittura e lettura.",
      "Una serie di celle contigue, chiamata array, offre un’alternativa alla cella unica. Il programma scrive un indice diverso in ciascuna posizione e passa a ogni thread l’indirizzo della propria cella, scritto &a[i]: il simbolo & significa «indirizzo di» e a[i] indica la cella di indice i. Quella zona di memoria deve restare disponibile per tutto il tempo in cui i thread vi accedono.",
      "Il creatore inizializza a[0], a[1], a[2] e a[3] con i numeri 0, 1, 2 e 3, passando a ciascun worker, il thread incaricato del lavoro, il puntatore alla cella corrispondente. Quando il ciclo termina, i vale 4, mentre i quattro valori copiati restano nelle rispettive celle. La barriera trattiene i worker fino al completamento della preparazione e colloca le loro letture dopo le scritture del creatore. Il creatore completa poi i join, cioè attende la fine dei worker, prima di uscire dal blocco che contiene l’array: gli oggetti restano così validi fino all’ultima lettura."
    ],
    "introduzione": [
      "Preparare una cella per ogni worker consente di conservare l’argomento assegnato durante un ciclo. Questa soluzione mostra come ricavare i valori letti seguendo i puntatori &a[i], che indicano elementi distinti dell’array. La barriera colloca le letture dopo la preparazione e i join mantengono gli oggetti disponibili: il valore finale della variabile del ciclo resta separato dai contenuti già copiati.",
      "Carica l’esempio guidato e annota, accanto ai quattro indirizzi, i valori zero, uno, due e tre. Avanza attraverso la barriera confrontando ogni lettura con la cella raggiunta, poi distingui questa sequenza dal valore finale i uguale a quattro. Nelle verifiche conclusive conta i valori distinti e calcola la loro somma, ricostruendo ciascun contributo attraverso il rispettivo puntatore."
    ],
    "lettura": "Segui ogni freccia dal worker al proprio elemento a[i]. La variabile del ciclo termina a 4, mentre le quattro celle mantengono 0, 1, 2 e 3; la figura separa l’indice usato durante la preparazione dai contenuti conservati.",
    "conclusione": "La copia del dato in oggetti distinti fissa gli argomenti per i worker. La barriera ordina le letture dopo la preparazione e i join precedono la fine della vita degli oggetti.",
    "procedura": [
      "Premi «Carica l’esempio guidato»: seleziona l’esercizio 4, «Ricostruire gli argomenti dopo la barriera», traccia 1. I passaggi e i risultati seguenti si riferiscono a questa combinazione.",
      "Annota gli indirizzi &a[0], &a[1], &a[2] e &a[3], insieme ai valori copiati in ciascuna cella.",
      "Avanza attraverso la barriera e scrivi il numero raggiunto da ciascun puntatore, distinguendolo dal valore finale i = 4.",
      "Conta i valori distinti e somma le quattro letture, poi confronta i risultati con le verifiche dello svolgimento."
    ],
    "risultato": "I valori distinti sono quattro e la somma è 6.",
    "ragionamento": "I worker leggono le celle separate inizializzate a 0, 1, 2 e 3, che restano valide fino ai join. I quattro numeri sono diversi e la loro somma è 0 + 1 + 2 + 3 = 6; il valore finale della variabile i lascia intatti gli argomenti già copiati."
  },
  "5.5.1": {
    "scopo": "Due incrementi dovrebbero aggiungere due al contatore. Cambierai soltanto l’intercalazione fra letture e scritture per localizzare l’aggiornamento perso e il momento in cui B sceglie il proprio valore di partenza.",
    "teoria": [
      "Due lavoratori registrano ciascuno l’arrivo di una richiesta aggiungendo uno allo stesso contatore. Per eseguire l’incremento, ciascuno legge il numero in memoria, lo conserva temporaneamente in un registro, una piccola memoria interna al processore, e restituisce alla cella il numero letto aumentato di uno. Fra la lettura e la scrittura di A può cadere una lettura di B.",
      "Partendo da 4, se entrambi leggono prima che qualcuno scriva, A conserva localmente 4 e anche B conserva 4. Le due scritture depositano quindi 5 nella stessa cella. Si parla di aggiornamento perso perché il contatore registra una sola delle due richieste. Se invece B legge dopo che A ha scritto 5, parte dal valore aggiornato e porta la cella a 6. Basta cambiare l’ordine relativo delle operazioni per produrre due esiti diversi.",
      "Nella macchina rappresentata ciascuna operazione di lettura o scrittura è atomica, cioè appare agli altri come un singolo evento indivisibile. Tutti osservano questi eventi in un ordine comune. La figura separa i valori locali dalla cella condivisa affinché si possa individuare da quale lettura provenga ciascuna scrittura."
    ],
    "introduzione": [
      "Due incrementi possono lasciare nel contatore un solo contributo quando entrambi partono dalla stessa lettura. Lo scopo è individuare l’aggiornamento perso seguendo i valori locali di A e B. Nella macchina proposta ogni lettura e scrittura è indivisibile, mentre l’incremento comprende due accessi separati: il loro ordine relativo determina quale valore ciascun lavoratore usi per calcolare il risultato.",
      "Carica «Entrambi leggono quattro» e avanza confrontando, dopo ogni accesso, la cella centrale con le due letture conservate ai lati. Prima della scrittura di B prevedi il numero che depositerà usando il proprio valore locale. Ripeti «Un incremento completo per volta» e individua il primo passaggio diverso: la nuova base letta da B spiega il cambiamento del totale finale."
    ],
    "lettura": "La cella centrale è condivisa; i riquadri laterali conservano l’ultimo valore letto da A e B. Una freccia dalla cella al lato è una lettura, una freccia verso il centro è una scrittura. Il valore laterale resta fermo fino alla successiva lettura di quel lavoratore.",
    "conclusione": "L’atomicità della singola lettura o scrittura lascia aperta l’intercalazione fra le due operazioni di un incremento. Per preservare entrambi gli aggiornamenti occorre che ciascuna trasformazione usi il risultato lasciato dalla precedente.",
    "controlli": {
      "x": "Numero contenuto nella cella prima dei due incrementi. Ciascun lavoratore aggiunge uno al valore che ha letto.",
      "ordine": "Sceglie due letture prima delle scritture oppure il completamento dell’incremento di A prima della lettura di B."
    },
    "esperienze": [
      {
        "titolo": "Entrambi leggono quattro",
        "risultato": "Dopo due scritture il contatore vale 5; il contributo di un incremento è perso.",
        "ragionamento": "A legge 4 e B legge lo stesso 4 prima di qualsiasi aggiornamento. Ciascuno calcola 4 + 1 e deposita 5: la seconda scrittura ripete il risultato della prima, perciò il totale cresce di una sola unità.",
        "parametri": {
          "x": 4,
          "ordine": "inter"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Contatore iniziale: 4; Ordine degli accessi: Letture consecutive. La traccia riparte da «A · lettura».",
          "Premi «Passo successivo» e fermati a «B · lettura». Confronta i due valori letti e annota che entrambi valgono 4.",
          "Avanza fino a «B · scrittura», leggendo anche i passaggi intermedi. Ricostruisci il calcolo scritto da B a partire dal suo registro, poi confronta 5 con il totale atteso 4 + 2."
        ],
        "attesi": [
          {
            "passo": 3,
            "campo": "cella",
            "valore": "5"
          },
          {
            "passo": 3,
            "campo": "lettura A",
            "valore": "4"
          },
          {
            "passo": 3,
            "campo": "lettura B",
            "valore": "4"
          }
        ]
      },
      {
        "titolo": "Un incremento completo per volta",
        "risultato": "Il contatore finale vale 6; B ha letto 5.",
        "ragionamento": "A legge 4 e scrive 5 prima che B prelevi la cella. B usa quindi 5 come base e scrive 5 + 1 = 6: l’ordine delle letture conserva i due contributi.",
        "parametri": {
          "x": 4,
          "ordine": "ser"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Contatore iniziale: 4; Ordine degli accessi: Un incremento completo per volta. La traccia riparte da «A · lettura».",
          "Premi «Passo successivo» e fermati a «A · scrittura». Dopo la scrittura di A annota 5 nella cella e osserva che B deve ancora leggere.",
          "Avanza fino a «B · scrittura», leggendo anche i passaggi intermedi. Verifica la lettura 5 di B e il risultato 6; confronta il punto di divergenza con il primo caso."
        ],
        "attesi": [
          {
            "passo": 3,
            "campo": "cella",
            "valore": "6"
          },
          {
            "passo": 3,
            "campo": "lettura A",
            "valore": "4"
          },
          {
            "passo": 3,
            "campo": "lettura B",
            "valore": "5"
          }
        ]
      }
    ]
  },
  "5.5.2": {
    "scopo": "Un mutex è già presente, eppure il contatore può ancora perdere un incremento. Sposterai il confine della sezione protetta per determinare se essa conserva anche la lettura da cui dipende il calcolo.",
    "teoria": [
      "Si vorrebbe che due richieste facessero crescere di due unità un contatore comune. Poiché l’aggiornamento usa il valore che il contatore aveva al momento della lettura, è necessario conservarne la validità fino alla scrittura. Un mutex concede a un solo lavoratore per volta l’accesso alla parte di programma che si è deciso di proteggere, chiamata sezione critica. Nelle etichette lock indica l’acquisizione del mutex e unlock il rilascio; read e write indicano lettura e scrittura.",
      "Se la sezione critica comincia soltanto davanti alla scrittura, A e B possono aver già letto entrambi 10. Per quanto le due scritture avvengano ordinatamente, ciascun lavoratore si presenta con lo stesso risultato calcolato, 11. Il secondo deposito lascia perciò invariato il numero che aveva appena scritto il primo.",
      "Se la protezione comincia prima della lettura, B attende che A abbia scritto e rilasciato il mutex prima di leggere a sua volta. Il valore di partenza di B contiene già il contributo di A. Nel confrontare le due sequenze, il primo passaggio in cui differiscono è proprio il valore disponibile per questa lettura."
    ],
    "introduzione": [
      "La presenza di un mutex protegge soltanto le operazioni racchiuse fra acquisizione e rilascio. Qui verificherai se quel tratto, chiamato sezione critica, comprenda anche la lettura da cui dipende l’incremento. Spostarne l’inizio rende osservabile perché due scritture eseguite una dopo l’altra possano ancora usare la stessa base e perdere uno degli aggiornamenti previsti.",
      "Nel controllo «Zona protetta» scegli «Sola scrittura», applica i parametri e segui i valori letti da A e B fino all’ultimo deposito. Confronta poi «Lettura e scrittura», osservando la parentesi che indica la protezione. Cerca il momento in cui cambia la lettura di B e collega quel valore al totale finale, spiegando quale dipendenza debba restare protetta."
    ],
    "lettura": "La parentesi superiore indica la porzione protetta: può iniziare alla scrittura oppure comprendere anche la lettura. Nei tre riquadri inferiori segui i valori locali di A e B e la cella comune, come in una copia fra memoria e registri.",
    "conclusione": "La sezione critica deve racchiudere l’intera decisione basata sul dato condiviso. Per un incremento, comprendere lettura, calcolo e scrittura impedisce che un lavoratore aggiorni la cella usando una base ormai superata.",
    "controlli": {
      "zona": "Sposta l’inizio del mutex: davanti alla sola scrittura oppure prima della lettura. La cella iniziale vale sempre 10 e i lavoratori aggiungono uno ciascuno."
    },
    "esperienze": [
      {
        "titolo": "Mutex intorno alla sola scrittura",
        "risultato": "La cella finale vale 11 e B ha letto 10.",
        "ragionamento": "A e B leggono entrambi 10 prima dell’acquisizione del mutex. Le scritture protette depositano poi 11 in successione; l’esclusione ordina i depositi, lasciando invariata la base già scelta da ciascun lavoratore.",
        "parametri": {
          "zona": "write"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Zona protetta: Sola scrittura. La traccia riparte da «Confine del mutex».",
          "Premi «Passo successivo» e fermati a «A · lettura». Controlla la posizione della parentesi e individua la lettura di A al di fuori della protezione.",
          "Avanza fino a «B · scrittura», leggendo anche i passaggi intermedi. Verifica che B usi ancora 10 e confronta il risultato 11 con i due incrementi richiesti."
        ],
        "attesi": [
          {
            "passo": 4,
            "campo": "cella",
            "valore": "11"
          },
          {
            "passo": 4,
            "campo": "lettura A",
            "valore": "10"
          },
          {
            "passo": 4,
            "campo": "lettura B",
            "valore": "10"
          }
        ]
      },
      {
        "titolo": "Mutex dalla lettura al rilascio",
        "risultato": "La cella finale vale 12 e B ha letto 11.",
        "ragionamento": "A acquisisce il mutex prima di leggere 10, scrive 11 e lo rilascia. Solo allora B può leggere 11 e scrivere 12: l’intero aggiornamento usa un valore che resta valido fino al deposito.",
        "parametri": {
          "zona": "all"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Zona protetta: Lettura e scrittura. La traccia riparte da «Confine del mutex».",
          "Premi «Passo successivo» e fermati a «A · lettura». Osserva la parentesi che comprende la lettura e segui il primo aggiornamento protetto.",
          "Avanza fino a «B · scrittura», leggendo anche i passaggi intermedi. Controlla il valore letto da B e ricava 11 + 1 = 12, attribuendo la differenza al nuovo confine."
        ],
        "attesi": [
          {
            "passo": 4,
            "campo": "cella",
            "valore": "12"
          },
          {
            "passo": 4,
            "campo": "lettura A",
            "valore": "10"
          },
          {
            "passo": 4,
            "campo": "lettura B",
            "valore": "11"
          }
        ]
      }
    ]
  },
  "5.5.3": {
    "scopo": "Due lavoratori aggiungono ciascuno un numero fissato di unità allo stesso contatore. Seguirai tutti gli ingressi nel mutex e la lettura successiva ai join per distinguere correttezza degli aggiornamenti e completamento del lavoro.",
    "teoria": [
      "Nello stesso programma possono avanzare più sequenze di istruzioni, dette thread. Un thread creatore ripartisce fra due lavoratori il compito di contare degli eventi e vuole leggere un unico totale a lavori conclusi. Occorre risolvere due problemi distinti. Durante gli aggiornamenti ciascun lavoratore deve partire dal valore lasciato dal precedente. Al momento della lettura finale entrambi devono aver completato tutti gli incrementi loro assegnati.",
      "Il mutex M protegge un aggiornamento per volta. Chi lo acquisisce legge il contatore, aggiunge uno, scrive il risultato e poi rilascia M. Se i lavoratori partono da zero e compiono tre incrementi ciascuno, si osservano sei rilasci che lasciano nella cella, nell’ordine, i numeri da 1 a 6. L’alternanza di A e B è una sequenza possibile.",
      "Il creatore esegue un join per ciascun lavoratore, ossia ne attende la terminazione. Solo dopo entrambe le attese il valore letto rappresenta il totale definitivo e il mutex può essere distrutto. La sequenza dei rilasci giustifica l’esattezza del conteggio, mentre i join giustificano la scelta dell’istante in cui leggerlo."
    ],
    "introduzione": [
      "Un conteggio condiviso deve conservare ogni incremento e deve essere letto quando tutti i lavoratori hanno concluso. L’attività distingue queste due condizioni: il mutex protegge lettura e scrittura durante ciascun aggiornamento, mentre i join attendono la fine dei thread. La fila degli incrementi completati permette di confrontare il totale costruito passo per passo con quello atteso dal numero delle operazioni.",
      "Carica «Tre incrementi a testa» e avanza osservando la crescita della cella dopo ogni rilascio. Confronta il numero di caselle completate con il valore del contatore, poi raggiungi la lettura successiva ai due join. Ripeti con cinque incrementi per lavoratore: il confronto dei totali chiarisce il ruolo della protezione, mentre l’ultimo passaggio giustifica quando il creatore possa considerare definitivo il risultato."
    ],
    "lettura": "Ogni casella della fila inferiore rappresenta un incremento concluso ed è marcata A oppure B. Il contatore registra il totale dopo il rilascio; il mutex appare libero perché ciascun fotogramma cade al confine della sezione critica, una volta completato l’aggiornamento.",
    "conclusione": "Il mutex conserva ogni incremento e i join rendono definitiva la lettura del creatore. L’alternanza illustrata è una sequenza possibile: con la stessa protezione il totale dipende dal numero degli incrementi completati.",
    "controlli": {
      "n": "Numero di incrementi richiesti a ciascuno dei due lavoratori. Il contatore parte da zero e ogni ingresso protetto aggiunge una sola unità."
    },
    "esperienze": [
      {
        "titolo": "Tre incrementi a testa",
        "risultato": "Dopo i due join il totale letto è 6, uguale agli incrementi attesi.",
        "ragionamento": "Due lavoratori eseguono tre incrementi ciascuno, quindi il totale previsto è 2 × 3 = 6. A ogni rilascio il valore cresce di uno perché lettura e scrittura sono protette insieme; i due join assicurano che i sei ingressi siano terminati.",
        "parametri": {
          "n": 3
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Incrementi per ciascuno dei due lavoratori: 3. La traccia riparte da «Inizializzazione».",
          "Premi «Passo successivo» e fermati a «Ingresso di A». Controlla il primo rilascio di A, che lascia 1 nella cella; segui poi la crescita senza salti dopo ogni ingresso.",
          "Avanza fino a «Dopo i due join», leggendo anche i passaggi intermedi. Conta sei caselle completate e verifica che il totale letto dopo i join coincida con 2 × 3."
        ],
        "attesi": [
          {
            "passo": 7,
            "campo": "incrementi attesi",
            "valore": "6"
          },
          {
            "passo": 7,
            "campo": "totale letto",
            "valore": "6"
          }
        ]
      },
      {
        "titolo": "Cinque incrementi a testa",
        "risultato": "Il totale definitivo è 10, uguale ai dieci incrementi attesi.",
        "ragionamento": "Il numero di operazioni diventa 2 × 5 = 10. Il protocollo resta invariato e la cella cresce da zero a dieci attraverso dieci sezioni critiche complete; la lettura finale viene effettuata quando entrambi i lavoratori sono stati attesi.",
        "parametri": {
          "n": 5
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Incrementi per ciascuno dei due lavoratori: 5. La traccia riparte da «Inizializzazione».",
          "Premi «Passo successivo» e fermati a «Ingresso di A». Segui il primo ingresso e prepara un conteggio separato delle cinque operazioni di A e delle cinque di B.",
          "Avanza fino a «Dopo i due join», leggendo anche i passaggi intermedi. Verifica dieci caselle completate e confronta il totale con la previsione 2 × 5."
        ],
        "attesi": [
          {
            "passo": 11,
            "campo": "incrementi attesi",
            "valore": "10"
          },
          {
            "passo": 11,
            "campo": "totale letto",
            "valore": "10"
          }
        ]
      }
    ]
  },
  "5.5.4": {
    "scopo": "Un produttore scrive un dato e poi pubblica un flag; un consumatore legge il flag prima del dato. Confronterai due ordini di memoria per stabilire quali valori del dato siano garantiti o ammessi dopo aver osservato il segnale.",
    "teoria": [
      "Due thread, cioè due flussi di istruzioni che condividono la memoria, si scambiano un dato. Il produttore prepara 42 nella cella dato e imposta a 1 la cella pronto; il consumatore legge pronto e poi dato. Il nome flag indica una variabile usata come segnale convenzionale: qui zero significa preparazione ancora attesa, uno annuncia la disponibilità. Entrambe le celle sono atomiche, quindi ciascuna singola lettura o scrittura avviene come un accesso indivisibile.",
      "La prova assume che il consumatore abbia letto proprio l’uno scritto dal produttore. Occorre stabilire quali valori possa allora ottenere da dato. L’ordine relaxed conserva l’atomicità del singolo accesso, lasciando prive di una relazione di sincronizzazione le operazioni sulle due celle. Leggere uno dal flag con questo ordine permette ancora di leggere zero, il valore iniziale di dato, oppure 42.",
      "La pubblicazione release e la lettura acquire costruiscono una relazione più forte. Il produttore scrive dato e poi pubblica pronto con release; il consumatore legge quella pubblicazione con acquire e solo dopo legge dato. Il collegamento fra la release e l’acquire è indicato con synchronizes-with, cioè «si sincronizza con». Attraverso questo collegamento la precedente scrittura di 42 risulta ordinata prima della successiva lettura del consumatore: la relazione complessiva prende il nome di happens-before.",
      "Nel modello il produttore è l’unico autore di scritture su dato dopo l’inizializzazione. La lettura del consumatore deve quindi restituire 42 nel caso release/acquire. La scrittura dato ∈ {0, 42} della seconda figura indica invece un insieme di risultati ammessi: il simbolo ∈ significa «appartiene a». La figura riassume le garanzie delle operazioni di memoria; ciascuna casella corrisponde a una relazione da verificare nel programma."
    ],
    "introduzione": [
      "Un segnale di disponibilità permette di prevedere il dato pubblicato soltanto quando gli accessi stabiliscono la relazione necessaria fra i thread. Questo laboratorio distingue atomicità, che rende indivisibile un singolo accesso, e ordinamento fra celle diverse. Con release sul flag e acquire nella lettura che ne riceve il valore, la scrittura precedente del dato viene collegata alla successiva osservazione del consumatore.",
      "Carica «Pubblicazione release/acquire» e segui le frecce dalla scrittura di 42 alla lettura del dato, passando per il flag uguale a uno. Confronta poi «Segnale con ordine relaxed», dove dato e flag restano atomici. Leggi il risultato come insieme dei valori ammessi e ricavane il minimo richiesto dalla previsione: distingui così una garanzia dall’elenco delle possibilità consentite."
    ],
    "lettura": "Le frecce orizzontali seguono le operazioni del singolo thread. Il collegamento release/acquire unisce la pubblicazione del flag alla lettura che ne riceve il valore. Con relaxed la figura riporta dato ∈ {0, 42}, un insieme di valori consentiti. Il campo della previsione richiede il minimo dell’insieme: 42 nel primo caso, zero nel secondo.",
    "conclusione": "Segui il percorso dalla scrittura di 42 alla lettura finale: una release sul flag, letta da un’acquire, collega i due thread e rende obbligatorio 42 nelle ipotesi indicate. Con accessi relaxed al flag restano ammessi 0 e 42. Il minimo richiesto nel campo di previsione vale rispettivamente 42 e zero; l’insieme ammesso descrive tutti gli esiti consentiti nelle ipotesi della prova.",
    "controlli": {
      "caso": "Sceglie release/acquire sul flag oppure accessi relaxed. Dato e flag sono entrambi atomici, partono da zero e il consumatore legge in ogni caso il flag uguale a uno."
    },
    "esperienze": [
      {
        "titolo": "Pubblicazione release/acquire",
        "risultato": "Il solo valore ammesso per dato è 42.",
        "ragionamento": "Il produttore scrive dato prima della release sul flag. Il consumatore legge con acquire proprio l’1 di quella pubblicazione: il collegamento ordina la scrittura del dato prima della sua lettura, che deve osservare 42 in assenza di altri scrittori.",
        "parametri": {
          "caso": "ra"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Ordine di memoria: Flag release/acquire. La traccia riparte da «Produttore».",
          "Premi «Passo successivo» e fermati a «Consumatore». Individua la lettura acquire del flag e la relazione synchronizes-with che collega i thread.",
          "Avanza fino a «Lettura del dato», leggendo anche i passaggi intermedi. Controlla il singolo valore ammesso e ricostruisci il percorso dalla scrittura di dato alla lettura del consumatore."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "valori ammessi",
            "valore": "42"
          },
          {
            "passo": 2,
            "campo": "dato pubblicato",
            "valore": "visibile"
          }
        ]
      },
      {
        "titolo": "Segnale con ordine relaxed",
        "risultato": "Per dato sono ammessi 0 oppure 42, pur avendo letto il flag uguale a 1.",
        "ragionamento": "Gli accessi relaxed mantengono indivisibili le operazioni sulle due celle atomiche. La lettura del flag lascia però assente la sincronizzazione fra thread, perciò il modello ammette che la successiva lettura del dato osservi ancora zero oppure il 42 pubblicato; la figura rappresenta possibilità consentite.",
        "parametri": {
          "caso": "relaxed"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Ordine di memoria: Flag relaxed. La traccia riparte da «Produttore».",
          "Premi «Passo successivo» e fermati a «Consumatore». Controlla il flag letto uguale a uno e la voce che indica sincronizzazione assente.",
          "Avanza fino a «Lettura del dato», leggendo anche i passaggi intermedi. Leggi l’insieme {0, 42} e spiega in quale senso ciascuno dei due valori sia consentito dal modello; la frequenza osservabile su una macchina concreta richiede misure ulteriori."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "valori ammessi",
            "valore": "0 oppure 42"
          },
          {
            "passo": 2,
            "campo": "oggetti atomici",
            "valore": "2"
          }
        ]
      }
    ]
  },
  "5.5.5": {
    "scopo": "B aspetta un lock che A terrà ancora per un tempo noto. Confronterai attesa attiva e sospensione misurando separatamente il tempo trascorso e il tempo di core consumato dal richiedente.",
    "teoria": [
      "Se due attività devono aggiornare in esclusiva la stessa struttura, il primo lavoratore acquisisce un lock, cioè il diritto di eseguire la parte protetta, e lo restituisce quando ha finito. Chi arriva nel frattempo può aspettare in modi diversi. Per descriverli servono due misure, il tempo che passa sull’orologio e il tempo di processore impiegato da chi attende.",
      "A lavora su un core, l’unità del processore che esegue le istruzioni, e deve tenere il lock per altri quattro millisecondi. B, su un secondo core, può ripetere il tentativo di acquisizione finché riesce. Questa attesa attiva, detta spin, impegna il secondo core per i quattro millisecondi durante i quali A finisce il lavoro.",
      "Quando B sceglie la sospensione, il sistema lo blocca e rende il secondo core disponibile per altre attività. Anche in questo caso il lock viene rilasciato dopo quattro millisecondi, durante i quali B consuma zero millisecondi di CPU. Il modello considera istantaneo il risveglio e B è l’unico richiedente al momento del rilascio."
    ],
    "introduzione": [
      "Attendere una risorsa occupata richiede tempo, mentre il consumo del processore dipende dal modo scelto per aspettare. L’esperimento separa queste due misure confrontando spin, cioè tentativi ripetuti sul core, e sospensione del richiedente. A conserva il lock per una durata nota; con B unico contendente e risveglio istantaneo, le due sequenze isolano l’uso del secondo core durante quell’intervallo.",
      "Carica l’attesa attiva e confronta sulla stessa scala le barre di A e B, annotando tempo trascorso e CPU consumata da B. Passa poi alla sospensione con la medesima durata residua del proprietario. Avanza fino al rilascio e confronta quando B ottiene il lock: l’attesa uguale, insieme al diverso consumo, spiega quale risorsa venga resa disponibile dalla sospensione."
    ],
    "lettura": "Le due righe CPU di A e CPU di B hanno la stessa scala temporale. La barra piena di B indica esecuzione durante lo spin; il tratto di sospensione lascia quel core disponibile. Il proprietario di M cambia soltanto al rilascio di A.",
    "conclusione": "A parità di rilascio, il modo di aspettare modifica l’uso del processore. Qui il risveglio è istantaneo e B è l’unico contendente: il confronto isola il consumo del core durante l’attesa.",
    "controlli": {
      "d": "Tempo residuo, in millisecondi, durante il quale A conserva il lock.",
      "mode": "Spin fa ripetere a B il tentativo sul secondo core; sospensione blocca B fino al rilascio, lasciando il core utilizzabile da altri lavori."
    },
    "esperienze": [
      {
        "titolo": "Attesa attiva sul secondo core",
        "risultato": "Dopo 4 ms B diventa proprietario; durante l’attesa ha consumato 4 ms di CPU.",
        "ragionamento": "A richiede ancora quattro millisecondi per liberare M. B continua a eseguire tentativi per tutto lo stesso intervallo, quindi il suo tempo trascorso e il suo consumo di CPU valgono entrambi 4 ms.",
        "parametri": {
          "d": 4,
          "mode": "spin"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Durata residua del proprietario (ms): 4; Attesa: Spin continuo. La traccia riparte da «Contesa».",
          "Premi «Passo successivo» e fermati a «Durante la sezione critica». Confronta le due barre piene di uguale durata e annota il consumo di CPU di B.",
          "Avanza fino a «Rilascio», leggendo anche i passaggi intermedi. Verifica il nuovo proprietario e distingui il momento del rilascio dal lavoro speso nei tentativi."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "attesa trascorsa (ms)",
            "valore": "4"
          },
          {
            "passo": 2,
            "campo": "nuovo proprietario",
            "valore": "B"
          },
          {
            "passo": 1,
            "campo": "stato B",
            "valore": "in esecuzione"
          },
          {
            "passo": 1,
            "campo": "CPU di B durante l’attesa (ms)",
            "valore": "4"
          }
        ]
      },
      {
        "titolo": "Sospensione del richiedente",
        "risultato": "B ottiene M dopo gli stessi 4 ms, consumando zero ms di CPU durante l’attesa.",
        "ragionamento": "La sospensione impedisce a B di consumare il core mentre A conclude i quattro millisecondi residui. Quando A rilascia M, B viene risvegliato e può acquisirlo; il modello trascura il costo di questa transizione.",
        "parametri": {
          "d": 4,
          "mode": "block"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Durata residua del proprietario (ms): 4; Attesa: Sospensione immediata. La traccia riparte da «Contesa».",
          "Premi «Passo successivo» e fermati a «Durante la sezione critica». Annota lo stato bloccato di B e il suo consumo zero, confrontando il tratto libero con la barra di A.",
          "Avanza fino a «Rilascio», leggendo anche i passaggi intermedi. Verifica che il tempo trascorso resti 4 ms e collega la differenza di consumo al diverso modo di aspettare."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "attesa trascorsa (ms)",
            "valore": "4"
          },
          {
            "passo": 2,
            "campo": "nuovo proprietario",
            "valore": "B"
          },
          {
            "passo": 1,
            "campo": "stato B",
            "valore": "bloccato"
          },
          {
            "passo": 1,
            "campo": "CPU di B durante l’attesa (ms)",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "5.5.6": {
    "scopo": "Due richieste di permesso sono seguite da due segnalazioni. Cambierai il numero di permessi iniziali per seguire il passaggio di un permesso a un richiedente sospeso e distinguerlo da un permesso ancora libero.",
    "teoria": [
      "Un servizio che disponga di pochi posti può rappresentarli mediante permessi. Il semaforo tiene il conto dei permessi ancora liberi e registra i richiedenti che devono attendere. L’operazione wait prende un permesso, se disponibile, oppure sospende chi lo chiede. L’operazione signal mette un permesso a disposizione di chi ne ha bisogno.",
      "Se inizialmente è libero un solo permesso, A lo prende con la prima wait e il contatore scende a zero. La successiva richiesta di B lo aggiunge alla coda. Alla signal di P il permesso passa direttamente a B, il quale diventa pronto, cioè candidato a un successivo turno sul processore. In questo passaggio il contatore dei permessi liberi resta a zero, perché il permesso ha già un destinatario.",
      "Alla signal di Q la coda è vuota, perciò stavolta compare un permesso libero. Con più persone in attesa la prova serve la prima arrivata, secondo l’ordine FIFO (first in, first out, ossia in ordine di arrivo). Per leggere ogni passaggio conviene seguire insieme il contatore e i nomi in coda, che distinguono un permesso disponibile da uno già assegnato."
    ],
    "introduzione": [
      "Un semaforo registra i permessi disponibili e le richieste sospese, che descrivono aspetti diversi dell’accesso a una risorsa. L’attività serve a seguire wait, che prende un permesso oppure sospende il richiedente, e signal, che rende disponibile un permesso. Nella consegna diretta della prova, un richiedente in coda riceve subito il permesso segnalato, mentre il contatore libero può restare invariato.",
      "Carica il caso con un permesso iniziale e avanza attraverso le richieste di A e B, leggendo insieme contatore e coda. Alla signal di P individua chi riceve il permesso, poi confronta l’effetto della signal di Q. Ripeti partendo da zero: seguire i nomi in ordine di arrivo chiarisce perché due risvegli possano lasciare ancora vuoto l’insieme dei permessi liberi."
    ],
    "lettura": "I punti nel riquadro sinistro contano i permessi disponibili; il riquadro destro conserva i nomi dei bloccati in ordine di arrivo. Una signal può accorciare la coda lasciando zero a sinistra, perché il permesso viene subito assegnato a chi aspetta.",
    "conclusione": "Il contatore e la coda descrivono due aspetti dello stesso semaforo. Una segnalazione soddisfa prima il richiedente in testa alla coda FIFO della prova; soltanto con coda vuota aumenta i permessi liberi.",
    "controlli": {
      "s": "Numero di permessi disponibili prima della wait di A. La sequenza resta A wait, B wait, P signal, Q signal e la coda serve i richiedenti in ordine di arrivo."
    },
    "esperienze": [
      {
        "titolo": "Un permesso disponibile all’inizio",
        "risultato": "Alla fine resta un permesso libero e la coda dei bloccati è vuota.",
        "ragionamento": "A consuma l’unico permesso e B si blocca. La signal di P assegna il proprio permesso a B; quando Q esegue signal la coda è ormai vuota, così il nuovo permesso rimane disponibile e il contatore diventa uno.",
        "parametri": {
          "s": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Permessi iniziali: 1. La traccia riparte da «A · wait».",
          "Premi «Passo successivo» e fermati a «B · wait». Osserva B in coda e zero permessi liberi dopo la sua wait.",
          "Avanza fino a «Q · signal», leggendo anche i passaggi intermedi. Confronta le due signal: individua quella che sveglia B e quella che incrementa il contatore."
        ],
        "attesi": [
          {
            "passo": 3,
            "campo": "permessi liberi",
            "valore": "1"
          },
          {
            "passo": 3,
            "campo": "bloccati",
            "valore": "nessuno"
          },
          {
            "passo": 1,
            "campo": "permessi liberi",
            "valore": "0"
          },
          {
            "passo": 1,
            "campo": "bloccati",
            "valore": "B"
          },
          {
            "passo": 2,
            "campo": "permessi liberi",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "bloccati",
            "valore": "nessuno"
          }
        ]
      },
      {
        "titolo": "Nessun permesso disponibile all’inizio",
        "risultato": "Dopo le due signal la coda è vuota e i permessi liberi sono ancora zero.",
        "ragionamento": "A e B si bloccano nell’ordine in cui chiamano wait. P trasferisce il primo permesso ad A e Q trasferisce il secondo a B: entrambi i permessi hanno già un destinatario, quindi nessuno resta libero.",
        "parametri": {
          "s": 0
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Permessi iniziali: 0. La traccia riparte da «A · wait».",
          "Premi «Passo successivo» e fermati a «B · wait». Leggi la coda A, B e individua chi riceverà la prima signal.",
          "Avanza fino a «Q · signal», leggendo anche i passaggi intermedi. Segui la rimozione dei due nomi e spiega perché coda vuota e contatore zero siano compatibili."
        ],
        "attesi": [
          {
            "passo": 3,
            "campo": "permessi liberi",
            "valore": "0"
          },
          {
            "passo": 3,
            "campo": "bloccati",
            "valore": "nessuno"
          },
          {
            "passo": 1,
            "campo": "permessi liberi",
            "valore": "0"
          },
          {
            "passo": 1,
            "campo": "bloccati",
            "valore": "A, B"
          },
          {
            "passo": 2,
            "campo": "permessi liberi",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "bloccati",
            "valore": "B"
          }
        ]
      }
    ]
  },
  "5.5.7": {
    "scopo": "Due richiedenti tentano di prenotare l’ultima poltrona. Sposterai il controllo di disponibilità dentro la sezione protetta per verificare se il numero di conferme rispetti il solo posto esistente.",
    "teoria": [
      "Due clienti tentano di prenotare l’ultima poltrona. Il servizio deve garantire che alla poltrona corrisponda una sola conferma. La decisione dipende dal contenuto di una cella che vale 1 finché il posto è libero e passa a 0 quando viene occupato. Tra il controllo di disponibilità e la registrazione potrebbe intervenire l’altro cliente.",
      "Il lock è il vincolo che riserva l’accesso a un solo richiedente per volta. Se A e B controllano la cella prima di acquisirlo, entrambi possono leggere 1 e autorizzare la propria richiesta. Anche scrivendo 0 uno dopo l’altro, finiranno per inviare due conferme. Se chi controlla trattiene il lock fino alla registrazione, il secondo cliente trova invece il valore che il primo ha già aggiornato.",
      "Il confronto e scambio, o compare-exchange, riunisce verifica e modifica in una singola operazione indivisibile. Il richiedente indica il valore atteso 1 e chiede di sostituirlo con 0. Quando il posto risulta già occupato, il confronto fallisce e restituisce al richiedente il valore effettivamente osservato. Il numero di conferme mostra se la decisione è rimasta legata a una disponibilità reale."
    ],
    "introduzione": [
      "Prenotare l’ultima poltrona richiede che la verifica della disponibilità resti valida fino alla registrazione. Qui userai il numero delle conferme per valutare questa proprietà, perché una cella finale uguale a zero può accompagnare anche due prenotazioni incompatibili. Il lock riserva il tratto protetto a un richiedente; compare-exchange riunisce invece controllo e modifica in un’unica operazione indivisibile.",
      "Carica «Due controlli prima del lock» e segui le decisioni di A e B prima delle scritture, poi confronta le conferme con l’unico posto. Ripeti «Decisione e prenotazione sotto lock» osservando quando B può leggere la disponibilità. Il selettore consente anche compare-exchange: confronta la conferma ottenuta e il tentativo fallito per riconoscere come la verifica rimanga collegata alla modifica."
    ],
    "lettura": "La cella centrale conta i posti liberi e i riquadri laterali seguono A e B. Le conferme inviate compaiono nella fila inferiore: confronta questo conteggio con la capacità iniziale, pari a uno, anche quando la cella finale vale zero in entrambi i casi.",
    "conclusione": "Verifica la prenotazione contando le conferme, oltre al valore finale del posto. Il controllo esterno al lock permette due conferme; il controllo protetto e il compare-exchange ne permettono una. Nel terzo caso il tentativo fallito aggiorna l’atteso di B a zero, rendendo riconoscibile l’occupazione già avvenuta.",
    "controlli": {
      "conf": "Seleziona il protocollo: controllo prima del lock, controllo e prenotazione nello stesso lock, oppure compare-exchange atomico. I casi guidati isolano l’effetto del confine della sezione critica."
    },
    "esperienze": [
      {
        "titolo": "Due controlli prima del lock",
        "risultato": "Il posto risulta occupato e vengono inviate due conferme per una sola poltrona.",
        "ragionamento": "A e B leggono entrambi libero prima della protezione e autorizzano ciascuno la propria prenotazione. Sebbene le successive scritture serializzate portino la cella a zero, ciascun cliente riceve una conferma: il totale due viola la capacità iniziale uno.",
        "parametri": {
          "conf": "split"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Protezione del posto: Controllo prima del lock. La traccia riparte da «Ultimo posto».",
          "Premi «Passo successivo» e fermati a «Controllo». Annota che entrambi sono ammessi prima della registrazione.",
          "Avanza fino a «Registrazione», leggendo anche i passaggi intermedi. Conta le due conferme e confrontale con l’unica poltrona, evitando di usare il solo valore finale della cella come verifica."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "posti liberi",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "conferme",
            "valore": "2"
          }
        ]
      },
      {
        "titolo": "Decisione e prenotazione sotto lock",
        "risultato": "Il posto è occupato e viene inviata una sola conferma.",
        "ragionamento": "A acquisisce il lock, vede l’unico posto libero e lo occupa prima del rilascio. B entra dopo e trova zero, perciò rinuncia: il conteggio delle conferme rimane uno e rispetta la capacità.",
        "parametri": {
          "conf": "together"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Protezione del posto: Controllo e prenotazione sotto lock. La traccia riparte da «Ultimo posto».",
          "Premi «Passo successivo» e fermati a «Controllo». Osserva A ammesso e B in attesa del lock. Ricava il valore che B leggerà dopo la prenotazione di A e usalo per stabilire quante conferme potranno essere emesse, la quantità richiesta nel campo della previsione.",
          "Avanza fino a «Registrazione», leggendo anche i passaggi intermedi. Verifica una conferma e zero posti liberi, confrontando i due conteggi con quelli del primo caso."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "posti liberi",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "conferme",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "5.5.8": {
    "scopo": "Due worker applicano la trasformazione x = 2x + 1 alla stessa cella. Seguirai due sezioni critiche complete per usare il risultato della prima operazione come ingresso della seconda.",
    "teoria": [
      "Un conto il cui saldo debba essere ricalcolato con la stessa regola dopo ogni operazione richiede che il secondo calcolo usi il risultato del primo. Se due lavoratori leggessero il saldo insieme, potrebbero consegnare due risultati ottenuti dalla stessa base. Un mutex, che accorda l’accesso a un solo lavoratore alla volta, permette di riservare l’intero intervallo dalla lettura alla nuova scrittura.",
      "La cella x parte da 1 e ogni worker applica una volta la regola «raddoppia e aggiungi uno». Il primo porta la cella a 2 × 1 + 1 = 3. Quando il secondo acquisisce il mutex, parte da 3 e scrive 2 × 3 + 1 = 7. Il mutex impone che i calcoli avvengano uno alla volta, mentre è la regola aritmetica a determinare i numeri.",
      "Nella figura ciascun turno corrisponde a una sezione critica completa. Il valore da riportare all’ingresso del secondo turno è pertanto quello presente nella cella dopo la prima scrittura. Seguendo tale passaggio si può applicare la regola assegnata al problema senza confondere il valore iniziale con quello intermedio."
    ],
    "introduzione": [
      "Applicare due volte una trasformazione a una cella condivisa richiede che il secondo calcolo parta dal risultato del primo. Il problema serve a ricostruire questa composizione quando il mutex comprende lettura, calcolo e scrittura. La regola raddoppia e aggiungi uno determina i valori, mentre l’esclusione garantisce che ogni worker possa completare l’aggiornamento prima dell’ingresso dell’altro.",
      "Parti da x uguale a uno e scrivi una previsione dopo due applicazioni della regola. Con «Passo successivo» raggiungi la prima scrittura e confronta il valore letto con quello depositato. Alla seconda scrittura usa il nuovo contenuto come ingresso del calcolo: seguire il passaggio da uno a tre e poi a sette permette di motivare il totale osservato."
    ],
    "lettura": "Ogni fotogramma conserva il proprietario del mutex e il valore della cella. Nelle due scritture confronta il valore letto con quello depositato: l’ingresso del secondo worker deve coincidere con l’uscita del primo.",
    "conclusione": "La verifica segue le due letture protette: il primo worker legge 1 e scrive 3, il secondo legge 3 e scrive 7. Il mutex mantiene unita ogni operazione dalla lettura alla scrittura; nella sequenza rappresentata W1 ottiene per primo l’accesso.",
    "procedura": [
      "Parti da x = 1 e applica mentalmente due volte la regola 2x + 1; registra la previsione del totale.",
      "Avanza a «Prima scrittura» e verifica 2 × 1 + 1 = 3, seguito dal rilascio del mutex.",
      "Avanza a «Seconda scrittura» e usa il 3 letto da W2 per calcolare il nuovo valore."
    ],
    "risultato": "Dopo entrambi i worker la cella contiene 7.",
    "ragionamento": "W1 aggiorna 1 in 2 × 1 + 1 = 3 e rilascia il mutex. W2 entra dopo quel rilascio, legge 3 e scrive 2 × 3 + 1 = 7: il secondo calcolo usa quindi il risultato del primo."
  },
  "5.5.9": {
    "scopo": "Tre richieste competono per un unico permesso e una signal arriva dopo le tre wait. Ricostruirai la coda FIFO per riconoscere chi venga risvegliato e quanti permessi restino disponibili.",
    "teoria": [
      "Un gruppo di processi può condividere pochi esemplari di una risorsa. Un semaforo contatore registra quanti permessi si possono ancora acquisire. L’operazione wait ne richiede uno. Se tutti sono già impegnati, il richiedente si sospende. Con signal si restituisce un permesso oppure lo si consegna a chi aspettava.",
      "Nell’esercizio la coda segue l’ordine di arrivo, indicato con FIFO dall’inglese first in, first out. Quando qualcuno è sospeso, il risveglio gli assegna il permesso che si sta restituendo. Quando la coda è vuota, il rilascio incrementa invece il numero di permessi che un futuro richiedente potrà trovare liberi.",
      "Con un solo permesso iniziale, A entra mentre B e C si accodano in quest’ordine. Alla successiva signal il permesso passa direttamente a B, che diventa pronto; C resta sospeso. Il contatore dei permessi liberi rimane zero, anche se la coda si è accorciata, perché il permesso è già assegnato a B."
    ],
    "introduzione": [
      "Il risveglio di una richiesta può consumare immediatamente il permesso appena segnalato. L’esercizio serve a distinguere quanti thread siano sospesi da quanti permessi rimangano liberi, seguendo una coda FIFO, che rispetta l’ordine di arrivo. Con un solo permesso iniziale, la sequenza delle tre wait stabilisce chi entra subito e chi diventa il destinatario della signal successiva.",
      "Premi «Carica l’esempio guidato» e prevedi quanti thread restino sospesi dopo le richieste di A, B e C. Registra il numero, quindi avanza ricostruendo la coda nell’ordine di arrivo. Nella prova completa confronta il nome risvegliato con il contatore dei permessi liberi: spiegare a chi sia già stato consegnato il permesso permette di giustificare entrambi i risultati."
    ],
    "lettura": "Il contatore misura i permessi liberi; i nomi in coda sono sospesi nell’ordine di arrivo. Dopo la signal segui il primo nome rimosso e distingui il permesso già consegnato da uno ancora utilizzabile da un nuovo richiedente.",
    "conclusione": "La signal può ridurre il numero dei sospesi senza aumentare il contatore libero. Nel protocollo della prova il permesso passa direttamente al primo richiedente in coda.",
    "procedura": [
      "Premi «Carica l’esempio guidato»: seleziona l’esercizio 3, «Seguire i permessi consegnati al risveglio», traccia 1. I passaggi e i risultati seguenti si riferiscono a questa combinazione.",
      "Prevedi quanti siano i sospesi dopo le wait di A, B e C con un solo permesso iniziale, poi registra il numero.",
      "Avanza e ricostruisci la coda B, C dopo l’ingresso di A; segui la consegna del permesso durante signal.",
      "Apri la prova completa e indica il nome risvegliato e il numero di permessi liberi subito dopo la segnalazione."
    ],
    "risultato": "Dopo le tre wait sono sospesi due thread; signal rende pronto B e lascia zero permessi liberi.",
    "ragionamento": "A acquisisce il solo permesso iniziale, mentre B e C entrano nella coda FIFO. La segnalazione consegna direttamente il permesso a B: C resta sospeso e il contatore libero rimane zero, perché il permesso ha già un destinatario."
  },
  "5.5.10": {
    "scopo": "Due worker confermano una prenotazione usando un controllo eseguito prima del mutex. Conterai le conferme e quelle in eccesso per localizzare il difetto nel tratto protetto.",
    "teoria": [
      "Due richieste possono contendersi l’ultimo posto libero. Se un lavoratore osserva la disponibilità e viene sospeso prima di registrare la prenotazione, un altro può vedere il medesimo posto e prendere la stessa decisione. Un mutex è un vincolo di esclusione che lascia entrare un solo lavoratore nel tratto di programma protetto.",
      "Il tratto da proteggere comprende la lettura del posto e la registrazione della decisione. Nel confrontare due tracce, il valore decisivo è quello che ciascun lavoratore vede quando effettua il controllo, insieme all’intervallo durante il quale possiede il mutex.",
      "Proteggere la sola scrittura impedisce che due scritture avvengano insieme, sebbene entrambe le decisioni possano risalire a una lettura già superata. Se la disponibilità viene letta e aggiornata durante lo stesso possesso del mutex, il secondo lavoratore trova lo stato prodotto dal primo e può decidere su dati aggiornati."
    ],
    "introduzione": [
      "La correttezza di una prenotazione dipende dal rapporto fra posti disponibili e conferme emesse. Questa soluzione aiuta a riconoscere un controllo eseguito troppo presto, anche quando le scritture successive sono protette dal mutex. Due worker possono conservare la stessa decisione positiva prima di entrare nella sezione critica: il conteggio delle conferme rende osservabile la violazione che il solo valore finale nasconde.",
      "Carica l’esempio guidato e annota l’unico posto insieme ai due controlli positivi precedenti alle scritture. Avanza attraverso gli ingressi nel mutex contando una conferma per ogni worker, poi confronta il totale con la capacità iniziale. Nelle verifiche finali ricava l’eccesso e individua dove dovrebbe avvenire la lettura decisiva affinché il secondo richiedente trovi la disponibilità aggiornata."
    ],
    "lettura": "Segui prima i due controlli positivi sulla disponibilità, poi le scritture seriali di zero e le conferme. Il valore finale disponibile = 0 descrive l’occupazione, mentre il numero di conferme rivela se l’unico posto sia stato promesso più volte.",
    "conclusione": "La correzione si verifica contando una conferma e un rifiuto: chi entra per secondo rilegge zero dentro la stessa sezione che protegge la prenotazione. Il solo valore finale disponibile = 0 sarebbe compatibile anche con le due conferme errate.",
    "procedura": [
      "Premi «Carica l’esempio guidato»: seleziona l’esercizio 5, «Trovare il difetto del controllo separato», traccia 1. I passaggi e i risultati seguenti si riferiscono a questa combinazione.",
      "Annota un posto iniziale e due decisioni positive prese prima della prima scrittura.",
      "Avanza attraverso i due ingressi nel mutex e conta una conferma per ciascun worker, anche quando la scrittura ripete zero.",
      "Confronta il totale delle conferme con l’unico posto e individua dove spostare il controllo per conservare il vincolo."
    ],
    "risultato": "Partono due conferme, di cui una in eccesso.",
    "ragionamento": "Entrambi i worker hanno letto disponibile = 1 e conservano quella decisione prima di entrare sotto mutex. Ognuno conferma, perciò il totale è due e l’eccesso rispetto alla capacità è 2 − 1 = 1; includere il controllo nel lock farebbe trovare zero al secondo."
  },
  "5.6.1": {
    "scopo": "Un produttore prenota un posto, scrive il dato e lo rende disponibile al consumatore. Seguirai le tre fasi per ricostruire la capacità del buffer anche durante un’operazione ancora in corso.",
    "teoria": [
      "Un programma che produce dati e un altro che li consuma possono procedere a velocità diverse. Tra i due si colloca un buffer, una zona di memoria con un numero fisso di posti. Per evitare che il produttore occupi un posto già usato o che il consumatore legga troppo presto, ciascuno deve ottenere il permesso adatto alla propria operazione.",
      "I due contatori di permessi, o semafori, chiamati vuoti e pieni, contano rispettivamente i posti disponibili per una scrittura e i dati pubblicati disponibili per una lettura. La chiamata wait(vuoti) acquisisce un permesso di spazio; signal(pieni) rende disponibile un permesso di lettura dopo l’inserimento. Con quattro posti inizialmente vuoti, la prenotazione di un posto da parte del produttore lascia tre permessi liberi. Il quarto è in transito, perché appartiene già al produttore e il consumatore deve ancora ricevere il diritto di usarlo.",
      "Durante l’inserimento un mutex, il vincolo che riserva l’accesso a un solo partecipante per volta, protegge il posto e l’indice che indica dove scrivere. La successiva pubblicazione aggiunge un permesso a pieni. Anche nell’intervallo in cui il dato è già in memoria, per contare correttamente tutti i posti occorre comprendere quelli riservati. Un invariante è una proprietà che resta vera dopo ciascun passaggio ammesso. La somma dei permessi liberi, pubblicati e in transito resta pari alla capacità."
    ],
    "introduzione": [
      "Un posto del buffer può essere libero, riservato da un produttore oppure già pubblicato per un consumatore. L’attività serve a conservare il conteggio della capacità anche mentre un’operazione è incompleta. I semafori vuoti e pieni contano permessi di scrittura e lettura; la categoria in transito raccoglie quelli già acquisiti che attendono ancora la pubblicazione, distinguendo presenza fisica del dato e disponibilità.",
      "Carica il buffer da quattro posti e avanza fino a wait(vuoti), sommando i tre contatori dopo la prenotazione. Osserva poi l’inserimento sotto mutex e confrontalo con signal(pieni), che pubblica il dato. Ripeti con due posti: ritrovare la capacità in ciascuna somma permette di seguire lo stesso permesso attraverso tutte le fasi, anche quando l’elemento è già nella cella."
    ],
    "lettura": "La fila superiore contiene i posti del buffer: P indica la prenotazione e x il dato scritto. I tre contatori inferiori separano vuoti, in transito e pieni. Il colore evidenziato accompagna il permesso durante il trasferimento da una categoria all’altra.",
    "conclusione": "La capacità si conserva sommando permessi liberi, dati pubblicati e prenotazioni in transito. La presenza fisica del dato precede la pubblicazione che concede al consumatore il diritto di leggerlo.",
    "controlli": {
      "cap": "Numero totale di posti del buffer, inizialmente tutti vuoti. Un solo produttore prenota e pubblica un elemento, qualunque sia la capacità scelta."
    },
    "esperienze": [
      {
        "titolo": "Un elemento in quattro posti",
        "risultato": "Dopo la pubblicazione si contano 3 vuoti, 1 pieno e 0 permessi in transito.",
        "ragionamento": "La wait sottrae un permesso ai quattro vuoti, dando 3 + 0 + 1 = 4. La scrittura fisica lascia il permesso in transito; signal(pieni) lo pubblica, così il bilancio diventa 3 + 1 + 0 = 4.",
        "parametri": {
          "cap": 4
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Capacità del buffer: 4. La traccia riparte da «Buffer vuoto».",
          "Premi «Passo successivo» e fermati a «wait(vuoti)». Controlla 3 vuoti e un permesso in transito; somma le tre categorie e ritrova quattro posti.",
          "Avanza fino a «signal(pieni)», leggendo anche i passaggi intermedi. Confronta l’inserimento fisico con signal(pieni) e individua quando pieni passa da zero a uno."
        ],
        "attesi": [
          {
            "passo": 3,
            "campo": "vuoti",
            "valore": "3"
          },
          {
            "passo": 3,
            "campo": "pieni",
            "valore": "1"
          },
          {
            "passo": 3,
            "campo": "in transito",
            "valore": "0"
          },
          {
            "passo": 1,
            "campo": "vuoti",
            "valore": "3"
          },
          {
            "passo": 1,
            "campo": "pieni",
            "valore": "0"
          },
          {
            "passo": 1,
            "campo": "in transito",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "elementi fisici",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "pieni",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "in transito",
            "valore": "1"
          }
        ]
      },
      {
        "titolo": "Un elemento in due posti",
        "risultato": "Il buffer termina con 1 vuoto, 1 pieno e 0 permessi in transito.",
        "ragionamento": "Da due posti disponibili, una prenotazione lascia 1 vuoto e 1 in transito. La pubblicazione sposta quel permesso fra i pieni, dando 1 + 1 = 2; cambia la capacità, mentre il percorso del singolo posto resta identico.",
        "parametri": {
          "cap": 2
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Capacità del buffer: 2. La traccia riparte da «Buffer vuoto».",
          "Premi «Passo successivo» e fermati a «wait(vuoti)». Verifica l’invariante 1 + 0 + 1 = 2 durante la prenotazione.",
          "Avanza fino a «signal(pieni)», leggendo anche i passaggi intermedi. Ricostruisci il bilancio 1 + 1 + 0 = 2 e confronta con il buffer da quattro posti."
        ],
        "attesi": [
          {
            "passo": 3,
            "campo": "vuoti",
            "valore": "1"
          },
          {
            "passo": 3,
            "campo": "pieni",
            "valore": "1"
          },
          {
            "passo": 3,
            "campo": "in transito",
            "valore": "0"
          },
          {
            "passo": 1,
            "campo": "vuoti",
            "valore": "1"
          },
          {
            "passo": 1,
            "campo": "pieni",
            "valore": "0"
          },
          {
            "passo": 1,
            "campo": "in transito",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "elementi fisici",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "pieni",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "in transito",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "5.6.2": {
    "scopo": "Il buffer è pieno e un produttore chiede spazio. Confronterai due ordini di acquisizione per stabilire se il consumatore possa ancora compiere l’operazione che rende disponibile quel posto.",
    "teoria": [
      "Una coda che possa contenere un solo elemento deve concedere a chi produce sia il diritto di usare uno spazio libero sia l’accesso esclusivo alla cella per aggiornarla. Il primo diritto è contato da un semaforo, chiamato vuoti. Il secondo è concesso dal mutex, che protegge anche il lavoro di chi rimuove l’elemento.",
      "Quando il buffer è pieno, il produttore P può iniziare chiedendo un permesso a vuoti con l’operazione wait(vuoti), che lo acquisisce appena è disponibile. Il sistema lo sospende finché si libera spazio. Poiché P ha lasciato disponibile il mutex, il consumatore C può acquisirlo, togliere il dato e segnalare il nuovo posto. È proprio l’operazione di C a rendere nuovamente pronto P.",
      "Se invece P trattiene il mutex mentre attende un posto libero, C si ferma davanti al mutex anche avendo il permesso di consumare il dato. Le attese si richiudono l’una sull’altra. Nella figura la cella resta piena perché l’unica attività capace di svuotarla dipende da chi ne sta aspettando lo svuotamento."
    ],
    "introduzione": [
      "Attendere spazio in un buffer pieno lascia il sistema avanzare soltanto se il consumatore può ancora rimuovere un dato. L’esperimento serve a verificare questa dipendenza confrontando l’ordine delle acquisizioni. Il semaforo vuoti concede un posto libero, mentre il mutex protegge la cella: trattenere il secondo mentre si aspetta il primo può impedire proprio l’azione necessaria al risveglio.",
      "Carica «Aspettare spazio prima del mutex» e segui la rimozione di C fino al permesso consegnato a P. Confronta poi il caso in cui P trattiene il mutex durante l’attesa. Per ciascuna freccia individua chi aspetta e chi potrebbe soddisfare la richiesta: il confronto fra la cella liberata e il ciclo P → C → P rende leggibile il diverso esito."
    ],
    "lettura": "Il riquadro centrale è l’unica cella del buffer, affiancata da P e C. Segui chi conserva il mutex mentre aspetta. Se compaiono due frecce opposte fra P e C, leggi ciascuna come dipendenza dal lavoro che l’altro dovrebbe compiere.",
    "conclusione": "Una richiesta di spazio deve lasciare eseguibile chi può liberarlo. Acquisire il permesso vuoti prima del mutex evita che il produttore trattenga proprio il lock necessario al consumatore per rimuovere il dato.",
    "controlli": {
      "caso": "Determina se P attende prima un permesso vuoti oppure acquisisce prima il mutex. Il buffer contiene inizialmente un elemento e dispone di una sola cella."
    },
    "esperienze": [
      {
        "titolo": "Aspettare spazio prima del mutex",
        "risultato": "C rimuove l’elemento; P torna pronto e riceve il permesso di spazio.",
        "ragionamento": "P si blocca su vuoti uguale a zero lasciando libero il mutex. C può acquisirlo, svuotare la cella e rilasciarlo; la successiva signal(vuoti) consegna a P il permesso che gli mancava.",
        "parametri": {
          "caso": "good"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Ordine del produttore: wait(vuoti) prima del mutex. La traccia riparte da «Buffer pieno».",
          "Premi «Passo successivo» e fermati a «Rimozione». Osserva C durante la rimozione e verifica che P abbia lasciato disponibile il mutex.",
          "Avanza fino a «Segnalazione», leggendo anche i passaggi intermedi. Controlla P pronto e il permesso riservato a P, collegando il risveglio alla rimozione di C."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "P",
            "valore": "pronto"
          },
          {
            "passo": 2,
            "campo": "permesso per P",
            "valore": "1"
          }
        ]
      },
      {
        "titolo": "Trattenere il mutex mentre si aspetta spazio",
        "risultato": "La cella resta occupata e si forma il ciclo P → C → P.",
        "ragionamento": "P trattiene il mutex mentre aspetta vuoti. Per consumare, C deve ottenere da P il mutex, pur possedendo già il permesso necessario al prelievo; soltanto C potrebbe svuotare la cella che P aspetta. Le due attese dipendono l’una dall’altra e arrestano il progresso.",
        "parametri": {
          "caso": "bad"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Ordine del produttore: Mutex prima di wait(vuoti). La traccia riparte da «Acquisizione».",
          "Premi «Passo successivo» e fermati a «Attesa di spazio». Identifica P in attesa di spazio e C in attesa del mutex, annotando chi potrebbe soddisfare ciascuna richiesta.",
          "Avanza fino a «Ciclo», leggendo anche i passaggi intermedi. Segui entrambe le frecce del ciclo e verifica che l’occupazione resti uno."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "occupazione",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "dipendenze",
            "valore": "P → C → P"
          }
        ]
      }
    ]
  },
  "5.6.3": {
    "scopo": "C1 aspetta che una coda contenga un elemento e viene risvegliato da un produttore. Cambierai l’ordine con cui i consumatori riacquisiscono il mutex per capire perché il predicato debba essere ricontrollato dopo il risveglio.",
    "teoria": [
      "Un consumatore può togliere un dato da una coda se, nel momento in cui la esamina, vi si trova almeno un elemento. Questa affermazione, che può risultare vera o falsa, si chiama predicato. I partecipanti lo verificano sotto mutex, un vincolo di accesso esclusivo, così che nessun altro possa cambiare il contenuto della coda durante il controllo e la conseguente rimozione.",
      "Se il predicato è falso, C1 si sospende su una variabile di condizione, l’oggetto attraverso il quale un produttore potrà segnalargli un cambiamento. La funzione pthread_cond_wait unisce il rilascio del mutex e l’ingresso in attesa mediante un’unica operazione atomica rispetto agli altri partecipanti, consentendo al produttore di acquisire il mutex, depositare il dato e segnalare l’evento. Prima di restituire il controllo a C1, la funzione deve riacquisire il mutex.",
      "Fra il segnale e la riacquisizione può inserirsi un secondo consumatore C2. Se è lui a prendere per primo il dato, C1 trova la coda di nuovo vuota. Il risveglio autorizza dunque un nuovo esame del predicato. Un ciclo che ricontrolla la coda a ogni ritorno dall’attesa permette di decidere correttamente in entrambe le sequenze."
    ],
    "introduzione": [
      "Essere risvegliati segnala un cambiamento da verificare, perché altri partecipanti possono intervenire prima della ripresa. Qui comprenderai perché il consumatore ricontrolli sotto mutex il predicato elementi > 0, cioè la condizione che autorizza il prelievo. L’attesa sulla variabile di condizione libera il mutex e lo riacquisisce prima del ritorno: l’ordine delle riacquisizioni determina il contenuto effettivamente trovato da C1.",
      "Carica il caso in cui C1 ottiene per primo il mutex e avanza dalla pubblicazione al ricontrollo, confrontando la condizione con la rimozione finale. Ripeti facendo arrivare C2 prima di C1. Segui l’unico elemento fino al suo consumatore e valuta il predicato quando C1 riprende: le zero rimozioni spiegano perché un ciclo debba decidere nuovamente dopo ogni risveglio."
    ],
    "lettura": "Il primo riquadro conta gli elementi, quello centrale segue C1 e quello destro registra l’eventuale intervento di C2. L’ultima casella valuta elementi > 0 nel momento in cui C1 possiede nuovamente il mutex.",
    "conclusione": "Dopo ogni risveglio C1 deve possedere di nuovo il mutex e valutare elementi > 0. Se legge vero può rimuovere; se C2 ha già consumato l’elemento legge falso e torna ad attendere. La notifica e la verifica del predicato sono quindi due eventi distinti della traccia.",
    "controlli": {
      "caso": "Sceglie chi ottiene per primo il mutex dopo che P ha prodotto e segnalato: C1 oppure un altro consumatore C2. La quantità prodotta è sempre un solo elemento."
    },
    "esperienze": [
      {
        "titolo": "C1 ottiene il mutex per primo",
        "risultato": "Il predicato è vero e C1 rimuove l’elemento, lasciando la coda a zero.",
        "ragionamento": "P deposita un elemento sotto mutex e segnala la condizione. C1 riacquisisce il mutex prima degli altri, trova elementi = 1 e può compiere la rimozione; dopo l’operazione resta 1 − 1 = 0.",
        "parametri": {
          "caso": "first"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Chi acquisisce il mutex dopo la produzione?: C1 riprende per primo. La traccia riparte da «Attesa».",
          "Premi «Passo successivo» e fermati a «Pubblicazione». Osserva l’elemento pubblicato e C1 ancora in attesa della riacquisizione del mutex.",
          "Avanza fino a «Ricontrollo», leggendo anche i passaggi intermedi. Leggi il predicato vero al controllo di C1 e verifica il conteggio finale zero."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "predicato al controllo",
            "valore": "vero"
          },
          {
            "passo": 2,
            "campo": "elementi finali",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "C2 consuma prima della ripresa di C1",
        "risultato": "C1 trova il predicato falso e compie zero rimozioni.",
        "ragionamento": "Dopo il segnale C2 acquisisce per primo il mutex e consuma l’unico elemento. Quando C1 riesce a riacquisirlo la coda vale già zero: il controllo impedisce una rimozione su coda vuota e C1 torna in attesa.",
        "parametri": {
          "caso": "second"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Chi acquisisce il mutex dopo la produzione?: C2 arriva prima di C1. La traccia riparte da «Attesa».",
          "Premi «Passo successivo» e fermati a «Intercalazione». Individua C2 come ultimo consumatore e annota che gli elementi sono tornati a zero.",
          "Avanza fino a «Ricontrollo», leggendo anche i passaggi intermedi. Verifica il predicato falso e le zero rimozioni di C1, distinguendo la notifica dal permesso effettivo di consumare."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "predicato al controllo",
            "valore": "falso"
          },
          {
            "passo": 2,
            "campo": "rimozioni di C1",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "5.6.4": {
    "scopo": "Uno scrittore è in coda mentre un lettore sta lavorando; nel frattempo arriva un altro lettore. Confronterai due politiche di ammissione per separare la compatibilità degli accessi dalla possibilità di garantire il turno allo scrittore.",
    "teoria": [
      "Molte persone possono consultare nello stesso momento una tabella di sola lettura. Per modificarne le righe occorre invece un intervallo esclusivo, affinché chi legge trovi una versione coerente. Nella prova lettori e scrittori sono thread, flussi di istruzioni che rispettivamente consultano o aggiornano i dati comuni. Un meccanismo per lettori e scrittori deve assicurare questa compatibilità e stabilire quale richiesta ammettere quando varie persone sono in attesa.",
      "L1 sta già leggendo quando lo scrittore S chiede di entrare. Poiché una lettura è in corso, S attende. Nel frattempo arriva un secondo lettore, L2. Con precedenza ai lettori, L2 può unirsi a L1. Quando L1 se ne va, rimane L2, e lo scrittore deve ancora aspettare. Un flusso continuo di lettori potrebbe prolungarne l’attesa indefinitamente.",
      "L’ordine di arrivo colloca invece L2 dietro S. All’uscita di L1 il gruppo dei lettori attivi è vuoto e lo scrittore in testa ottiene l’esclusiva. Osservare il conteggio dei lettori proprio a quell’istante permette di riconoscere l’effetto della politica di ammissione a parità di richieste."
    ],
    "introduzione": [
      "Più lettori possono consultare insieme gli stessi dati, mentre uno scrittore richiede un accesso esclusivo. L’attività distingue questa compatibilità dalla politica che decide chi attendere e chi ammettere. Seguendo un nuovo lettore arrivato dopo uno scrittore già in coda, potrai osservare come accessi individualmente compatibili possano prolungare l’attesa dello scrittore e come l’ordine di arrivo modifichi la scelta.",
      "Carica «Precedenza ai lettori» e osserva l’ingresso di L2 accanto a L1, poi conta i lettori ancora attivi quando L1 esce. Confronta la stessa sequenza con «Ammissione in ordine di arrivo», leggendo la coda S, L2. Il confronto finale mostra quale richiesta ottenga l’accesso e permette di spiegare il ritardo dello scrittore attraverso la regola sui nuovi arrivi."
    ],
    "lettura": "Il riquadro di sinistra mostra la coda d’attesa nell’ordine di arrivo; quello di destra mostra chi sta accedendo ai dati. Più lettori possono comparire insieme a destra, mentre lo scrittore entra da solo.",
    "conclusione": "Garantire accessi compatibili e limitare l’attesa sono proprietà diverse. Una politica che lascia entrare nuovi lettori davanti allo scrittore può prolungarne l’attesa; rispettare l’ordine d’arrivo impedisce quel sorpasso nel caso illustrato.",
    "controlli": {
      "caso": "Stabilisce se un nuovo lettore possa affiancare quello attivo oppure debba accodarsi dietro allo scrittore già in attesa."
    },
    "esperienze": [
      {
        "titolo": "Precedenza ai lettori",
        "risultato": "Dopo l’uscita di L1 resta un lettore attivo e S continua ad aspettare.",
        "ragionamento": "L2 si aggiunge a L1 perché le due letture sono compatibili. Quando L1 esce rimane L2, così lo scrittore deve ancora attendere l’accesso esclusivo; ripetuti arrivi analoghi potrebbero impedirgli il turno indefinitamente.",
        "parametri": {
          "caso": "readers"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Politica di ammissione: Precedenza ai lettori. La traccia riparte da «Primo lettore».",
          "Premi «Passo successivo» e fermati a «Secondo lettore». Osserva i due lettori attivi e S ancora nella coda.",
          "Avanza fino a «Uscita di L1», leggendo anche i passaggi intermedi. Conta il lettore rimasto dopo l’uscita di L1 e spiega quale evento servirebbe a S per entrare."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "lettori attivi",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "S",
            "valore": "in attesa"
          }
        ]
      },
      {
        "titolo": "Ammissione in ordine di arrivo",
        "risultato": "S entra come scrittore attivo e i lettori attivi diventano zero.",
        "ragionamento": "L2 arriva dopo S e si accoda dietro di lui. All’uscita di L1 il gruppo attivo si svuota, permettendo allo scrittore in testa di ottenere l’accesso esclusivo; L2 aspetta il suo rilascio.",
        "parametri": {
          "caso": "fair"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Politica di ammissione: Ordine di arrivo. La traccia riparte da «Primo lettore».",
          "Premi «Passo successivo» e fermati a «Secondo lettore». Leggi la coda S, L2 e controlla che il solo lettore attivo sia L1.",
          "Avanza fino a «Uscita di L1», leggendo anche i passaggi intermedi. Verifica S all’interno e zero lettori attivi, confrontando l’esito con la precedenza ai lettori."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "scrittore attivo",
            "valore": "S"
          },
          {
            "passo": 2,
            "campo": "lettori attivi",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "5.6.5": {
    "scopo": "Due lavoratori devono possedere entrambi i lock X e Y per completare. Cambierai l’ordine delle acquisizioni di B per verificare se le protezioni locali permettano anche un progresso globale.",
    "teoria": [
      "Per trasferire un valore tra due strutture condivise può essere necessario proteggerle entrambe per tutta la durata dell’operazione. A ogni struttura è associato qui un lock, un diritto di accesso esclusivo che il possessore mantiene fino al rilascio. Se due lavoratori prendono ciascuno un lock e aspettano il lock dell’altro, la possibilità di avanzare dipende da un rilascio che entrambi hanno rinviato.",
      "Nella sequenza in cui A inizia da X e B da Y, A arriva a chiedere Y mentre B aspetta X. Nel grafo delle dipendenze la freccia A → B indica che A può proseguire soltanto dopo un’azione di B. Le due frecce opposte formano un ciclo, che in queste condizioni corrisponde a uno stallo, o deadlock.",
      "Se ogni lavoratore comincia da X, B si ferma già alla prima richiesta, lasciando Y libero per A. L’ordine comune garantisce questa proprietà anche con più risorse quando a ognuna si assegna un rango, cioè un numero che fissa la posizione della risorsa nell’ordine comune, e tutte le acquisizioni successive rispettano ranghi crescenti."
    ],
    "introduzione": [
      "Proteggere separatamente due risorse può lasciare entrambi i lavoratori fermi se ciascuno trattiene quella richiesta dall’altro. Lo scopo è riconoscere questo stallo, chiamato deadlock, attraverso i proprietari dei lock e le dipendenze fra processi. Un ordine comune delle acquisizioni evita la chiusura del ciclo, perché chi attende la prima risorsa lascia ancora disponibile la seconda al suo possessore.",
      "Carica «Ordini opposti» e avanza dalla prima acquisizione alle richieste successive, collegando ogni attesa al proprietario del lock desiderato. Segui entrambe le frecce del ciclo, poi confronta «Ordine comune X prima di Y». Osserva dove si ferma B e quale risorsa rimane libera per A: il rilascio successivo spiega come anche B possa ottenere entrambi i lock e completare."
    ],
    "lettura": "I riquadri superiori identificano il proprietario di X e Y. In basso una freccia fra processi va da chi aspetta verso chi deve rilasciare la risorsa; due frecce opposte chiudono la dipendenza circolare.",
    "conclusione": "Un ordine comune delle risorse impedisce che due partecipanti trattengano ciascuno una risorsa mentre chiedono quella dell’altro. La proprietà si estende a più lock imponendo acquisizioni secondo ranghi strettamente crescenti.",
    "controlli": {
      "ordine": "A acquisisce sempre X poi Y. Questo controllo sceglie se B proceda nel verso opposto oppure rispetti lo stesso ordine X poi Y."
    },
    "esperienze": [
      {
        "titolo": "Ordini opposti",
        "risultato": "Il grafo chiude A → B → A e l’esito è deadlock.",
        "ragionamento": "A prende X e B prende Y. Alla seconda richiesta A aspetta Y da B, mentre B aspetta X da A; ciascuno trattiene il primo lock fino alla seconda acquisizione, perciò entrambi dipendono da un rilascio impossibile nella sequenza.",
        "parametri": {
          "ordine": "rev"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Acquisizioni di B: Y poi X. La traccia riparte da «Prima acquisizione».",
          "Premi «Passo successivo» e fermati a «Seconda acquisizione». Leggi i proprietari X = A e Y = B e identifica quale risorsa manca ad A.",
          "Avanza fino a «Progresso», leggendo anche i passaggi intermedi. Segui il ciclo completo delle attese e collega ogni freccia al lock che il destinatario dovrebbe rilasciare."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "dipendenze",
            "valore": "A → B → A"
          },
          {
            "passo": 2,
            "campo": "esito",
            "valore": "deadlock"
          }
        ]
      },
      {
        "titolo": "Ordine comune X prima di Y",
        "risultato": "A e B completano entrambi; la dipendenza B → A viene infine eliminata.",
        "ragionamento": "B si ferma già su X, che appartiene ad A, lasciando Y libero. A può acquisire Y, terminare e rilasciare entrambi; B ottiene poi X e Y nello stesso ordine, senza chiudere un ciclo.",
        "parametri": {
          "ordine": "ord"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Acquisizioni di B: X poi Y. La traccia riparte da «Prima acquisizione».",
          "Premi «Passo successivo» e fermati a «Seconda acquisizione». Controlla che A possieda entrambi i lock mentre B aspetta X.",
          "Avanza fino a «Progresso», leggendo anche i passaggi intermedi. Verifica la scomparsa della dipendenza dopo il rilascio e confronta il ruolo di Y nei due casi."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "dipendenze",
            "valore": "B → A, poi nessuna"
          },
          {
            "passo": 2,
            "campo": "esito",
            "valore": "entrambi completano"
          }
        ]
      }
    ]
  },
  "5.6.6": {
    "scopo": "Un produttore prenota uno dei tre posti vuoti e viene sospeso prima di pubblicare il dato. Conterai separatamente liberi, riservati e pubblicati per seguire il posto durante questa fase intermedia.",
    "teoria": [
      "Fra due attività che si scambiano dati, il buffer conserva gli elementi finché qualcuno li ritira. Ciascun posto attraversa più stati. È libero finché un produttore lo prenota, rimane riservato finché quel produttore prepara il dato e diviene disponibile al consumatore quando il dato viene pubblicato. La presenza di un posto riservato incide già sulla disponibilità di spazio.",
      "Il buffer dispone di tre posti, inizialmente tutti liberi. Quando un produttore ne prenota uno, restano due liberi, uno riservato e zero dati pubblicati. Se il produttore viene sospeso in questa fase, il permesso resta nelle sue mani; quando riprende e pubblica il dato, i liberi rimangono due e il posto riservato diviene pubblicato.",
      "La conservazione del numero totale di posti consente di controllare ogni passaggio della figura. Se un produttore viene sospeso, il posto assegnato resta in transito anche mentre il processore esegue un’altra attività. Per dedurre la disponibilità ai consumatori occorre quindi individuare il momento della pubblicazione."
    ],
    "introduzione": [
      "Una prenotazione riduce lo spazio disponibile prima che il dato diventi leggibile. Il problema serve a seguire un posto riservato durante la sospensione del produttore, conservando il totale delle celle del buffer. Separare liberi, riservati e pubblicati rende osservabile che il permesso appartiene già al produttore anche mentre il processore esegue altre attività e la pubblicazione deve ancora avvenire.",
      "Leggi i tre posti inizialmente vuoti e scrivi quanti resteranno liberi dopo una prenotazione. Con «Passo successivo» confronta i conteggi prima e dopo l’acquisizione, poi segui la medesima casella fino alla pubblicazione. In ciascun fotogramma somma le tre categorie: il totale costante permette di spiegare perché la pubblicazione cambi i riservati e i pubblicati lasciando invariati i posti liberi."
    ],
    "lettura": "Ogni casella è un posto del buffer e le etichette indicano a quale categoria appartiene. La prenotazione trasferisce una casella da libera a riservata; la pubblicazione sposta la stessa casella fra i dati disponibili al consumatore.",
    "conclusione": "Il posto prenotato appartiene già al produttore anche prima che il dato diventi leggibile dal consumatore. La somma delle tre categorie conserva la capacità in ogni fotogramma.",
    "procedura": [
      "Leggi tre posti inizialmente vuoti e una prenotazione. Registra il numero di posti che resteranno liberi.",
      "Avanza a «Dopo la prenotazione» e conta due liberi, uno riservato e zero pubblicati.",
      "Avanza a «Dopo la pubblicazione» e segui il trasferimento della stessa casella, verificando che il totale resti tre."
    ],
    "risultato": "Dopo la prenotazione restano due posti liberi; dopo la pubblicazione si contano due liberi e uno pubblicato.",
    "ragionamento": "La prenotazione sottrae un posto ai tre liberi, lasciandone 3 − 1 = 2 e assegnandone uno al produttore. La pubblicazione cambia la categoria di quel posto: il conteggio dei liberi resta due, mentre riservati scende a zero e pubblicati sale a uno."
  },
  "5.6.7": {
    "scopo": "Un buffer vuoto riceve quattro inserimenti e poi due rimozioni complete. Calcolerai i due semafori al termine, usando la conservazione della capacità come controllo del risultato.",
    "teoria": [
      "Un buffer è uno spazio temporaneo in cui un produttore deposita dati che un consumatore preleverà. Quando i posti sono limitati, un contatore indica quanti sono disponibili per scrivere e un altro quanti contengono dati pronti da leggere. Inizialmente la somma dei due deve corrispondere alla capacità, se ogni posto ha uno dei due stati.",
      "Un semaforo contatore è il meccanismo che conserva una quantità di permessi e consente di acquisirli o restituirli. Il produttore acquisisce un permesso fra i vuoti e, dopo aver depositato il dato, ne rende disponibile uno fra i pieni. Il consumatore compie il percorso inverso.",
      "Il buffer ha sei posti e parte vuoto, quindi vuoti vale sei e pieni zero. Quattro inserimenti completati producono quattro pieni e lasciano due vuoti. Due rimozioni successive restituiscono altrettanti permessi di spazio: pieni scende a due e vuoti sale a quattro. Poiché tutte le operazioni sono complete, i due conteggi ricostruiscono da soli la capacità sei."
    ],
    "introduzione": [
      "Ogni inserimento completo trasferisce un permesso dai posti vuoti agli elementi pubblicati; una rimozione compie il percorso inverso. L’esercizio serve a ricostruire entrambi i contatori del buffer dopo una sequenza di operazioni. Poiché tutte sono concluse, ogni posto compare in una delle due categorie e la loro somma deve coincidere con la capacità, offrendo una verifica indipendente del calcolo.",
      "Carica l’esempio guidato e prevedi il valore finale di pieni dopo quattro inserimenti e due rimozioni. Registra la risposta, poi avanza dal buffer vuoto da sei posti ai conteggi successivi agli inserimenti. Apri la prova completa per calcolare anche vuoti: confrontare il trasferimento dei due permessi restituiti con la somma finale permette di controllare insieme segni delle variazioni e capacità."
    ],
    "lettura": "I due conteggi rappresentano posti vuoti ed elementi pubblicati. Ogni operazione completa trasferisce un permesso da un conteggio all’altro; poiché ogni inserimento e rimozione è concluso, alla fine tutti i sei posti compaiono nei due semafori.",
    "conclusione": "Per operazioni completate, gli inserimenti aumentano pieni e riducono vuoti, mentre le rimozioni fanno il percorso inverso. La somma dei contatori coincide con la capacità quando mancano prenotazioni in transito.",
    "procedura": [
      "Premi «Carica l’esempio guidato»: seleziona l’esercizio 1, «Calcolare le disponibilità del buffer», traccia 1. I passaggi e i risultati seguenti si riferiscono a questa combinazione.",
      "Prevedi pieni dopo quattro inserimenti e due rimozioni, poi registra il numero nel campo iniziale.",
      "Avanza dalla situazione vuoti = 6 e pieni = 0 ai quattro inserimenti, annotando vuoti = 2 e pieni = 4.",
      "Apri la prova completa, applica le due rimozioni e verifica anche il valore finale di vuoti e la somma dei due contatori."
    ],
    "risultato": "Al termine pieni vale 2 e vuoti vale 4.",
    "ragionamento": "I quattro inserimenti pubblicano quattro dati e lasciano 6 − 4 = 2 posti vuoti. Le due rimozioni portano pieni a 4 − 2 = 2 e vuoti a 2 + 2 = 4; la somma 2 + 4 ritrova i sei posti."
  },
  "5.6.8": {
    "scopo": "Un’istantanea del buffer contiene una prenotazione ancora in corso. Ricostruirai i permessi liberi e la somma dei semafori per attribuire correttamente anche il posto già riservato al produttore.",
    "teoria": [
      "Un buffer è una zona di memoria con un numero finito di posti per i dati scambiati fra produttori e consumatori. Il semaforo vuoti conta i permessi di spazio ancora acquisibili dai produttori; pieni conta gli elementi già annunciati ai consumatori. Quando un produttore completa wait(vuoti), acquisisce un permesso e riduce vuoti di uno. Fino alla successiva signal(pieni), che pubblica il dato, quel posto appartiene a una prenotazione in corso.",
      "Il semaforo è il meccanismo che conserva il conteggio dei permessi e regola la loro acquisizione. Mentre un’operazione è in corso, un permesso può essere già stato sottratto a vuoti e attendere ancora la pubblicazione in pieni. Per ricostruire tutti i posti occorre quindi sommare vuoti, pieni e prenotazioni in corso.",
      "Dei cinque posti, due contengono dati già pubblicati. Prima della nuova prenotazione restano quindi tre vuoti. Il produttore ne acquisisce uno e porta vuoti a due, mentre pieni resta due: il posto mancante dalla somma dei semafori è quello in transito, già riservato al produttore. Aggiungendolo si ricostruisce 2 + 2 + 1 = 5."
    ],
    "introduzione": [
      "La somma dei semafori può risultare inferiore alla capacità quando un produttore possiede già un permesso ancora da pubblicare. Questa soluzione insegna a ricostruire il posto mancante distinguendo vuoti, pieni e prenotazioni in corso. Wait(vuoti) sottrae subito un permesso di spazio, mentre signal(pieni) avverrà dopo: l’istantanea intermedia deve quindi includere anche la disponibilità già assegnata al produttore.",
      "Ripristina l’esempio guidato con capacità cinque, due elementi pubblicati e una prenotazione. Prima di avanzare calcola i posti vuoti precedenti alla wait, poi confrontali con quelli ancora liberi dopo l’acquisizione. Nelle verifiche finali somma i due semafori e aggiungi separatamente il posto riservato: ricostruire cinque permette di interpretare lo scarto senza attribuirlo alla perdita di una cella."
    ],
    "lettura": "Tieni separate tre quantità: posti liberi per altre scritture, dati pubblicati e permessi in transito. La cella riservata compare nel bilancio della capacità anche se manca ancora dal contatore pieni.",
    "conclusione": "Durante un’operazione la sola somma vuoti + pieni può essere inferiore alla capacità. Lo scarto contabilizza i permessi già acquisiti che devono ancora essere restituiti o pubblicati.",
    "procedura": [
      "Premi «Carica l’esempio guidato»: seleziona l’esercizio 3, «Contabilizzare una prenotazione in corso», traccia 1. I passaggi e i risultati seguenti si riferiscono a questa combinazione.",
      "Annota capacità 5, due elementi pubblicati e un produttore che ha già eseguito wait(vuoti).",
      "Avanza nello svolgimento e calcola prima i tre vuoti precedenti alla prenotazione, poi sottrai il permesso acquisito.",
      "Nelle verifiche finali somma i due semafori e aggiungi separatamente il posto in transito per ritrovare la capacità."
    ],
    "risultato": "I permessi vuoti liberi sono 2 e vuoti + pieni vale 4.",
    "ragionamento": "Due dei cinque posti sono pubblicati, quindi prima della prenotazione rimangono tre vuoti. Il produttore ne prende uno: vuoti = 2 e pieni = 2, la cui somma è quattro. Il quinto posto è già riservato e completa il bilancio 2 + 2 + 1 = 5."
  },
  "5.7.1": {
    "scopo": "Un grafo presenta un ciclo di richieste e assegnazioni. Confronterai una sola istanza per risorsa con una seconda istanza di Y posseduta da C, così da stabilire quando il ciclo comporti uno stallo.",
    "teoria": [
      "Quando un lavoro attende una risorsa, per stabilire se potrà ripartire occorre sapere chi la possiede e chi potrebbe liberarla. Un grafo di assegnazione registra queste relazioni con frecce. Una freccia dal processo alla risorsa indica una richiesta, mentre una freccia dalla risorsa al processo indica un’assegnazione. Un’istanza è una singola unità disponibile di quel tipo di risorsa.",
      "Con una sola X e una sola Y, A possiede X e aspetta Y, che appartiene a B. B a sua volta aspetta X. Seguendo le frecce si torna al processo di partenza. Entrambi sono bloccati e ciascuno conserva ciò che ha ricevuto. Si produce così un deadlock, uno stallo in cui manca chi possa effettuare il rilascio necessario.",
      "Se di Y esistono due istanze, una può appartenere a C, che è in grado di terminare con ciò che possiede. Quando C libera la sua Y, A ottiene quanto gli serve e in seguito restituisce X a B. Per interpretare il ciclo occorre dunque contare le istanze e guardare anche ai possessori esterni al ciclo."
    ],
    "introduzione": [
      "Un ciclo nel grafo delle risorse richiede un’interpretazione che tenga conto delle istanze, cioè degli esemplari disponibili di ogni tipo. L’attività serve a distinguere uno stallo da una catena ancora risolvibile. Le frecce dal processo alla risorsa rappresentano richieste, quelle opposte assegnazioni: seguire anche i possessori esterni al ciclo permette di cercare un rilascio capace di far ripartire il lavoro.",
      "Carica «Una sola X e una sola Y» e avanza fino alle richieste, distinguendo i quattro archi del ciclo. Individua chi potrebbe liberare ciascuna risorsa, poi confronta il caso con una seconda Y posseduta da C. Segui il rilascio esterno e ricostruisci i completamenti successivi: la sequenza C → A → B spiega perché il ciclo iniziale possa essere sciolto."
    ],
    "lettura": "Le frecce processo → risorsa sono richieste; quelle risorsa → processo sono assegnazioni. Prima di concludere conta le istanze scritte nei riquadri X e Y e verifica se un possessore esterno al ciclo possa terminare.",
    "conclusione": "Con una sola istanza per tipo e i possessori bloccati, il ciclo descrive uno stallo. Con più istanze occorre esaminare anche i rilasci possibili dall’esterno, che possono interrompere la catena di attese.",
    "controlli": {
      "caso": "Sceglie il numero di istanze di Y e i possessori. Nel secondo scenario C possiede la seconda Y e può terminare senza ulteriori risorse."
    },
    "esperienze": [
      {
        "titolo": "Una sola X e una sola Y",
        "risultato": "A e B sono bloccati e l’esito è deadlock.",
        "ragionamento": "A conserva X chiedendo Y, mentre B conserva Y chiedendo X. Le uniche due istanze sono detenute da partecipanti bloccati: nessun rilascio esterno può soddisfare una delle richieste e il ciclo resta chiuso.",
        "parametri": {
          "caso": "one"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Istanze assegnate: X e Y con una sola istanza. La traccia riparte da «Assegnazione».",
          "Premi «Passo successivo» e fermati a «Richiesta». Distingui le due richieste dalle assegnazioni e conta quattro archi nel ciclo.",
          "Avanza fino a «Chiusura», leggendo anche i passaggi intermedi. Individua entrambi i possessori e spiega perché nessuno possa produrre il rilascio atteso dall’altro."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "processi bloccati",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "esito",
            "valore": "deadlock"
          }
        ]
      },
      {
        "titolo": "Una seconda Y può essere rilasciata",
        "risultato": "È possibile completare nell’ordine C → A → B.",
        "ragionamento": "C può terminare con la propria dotazione e restituisce una Y. A la acquisisce, completa e libera X, che diventa disponibile per B: il ciclo iniziale viene sciolto da un rilascio esterno.",
        "parametri": {
          "caso": "multi"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Istanze assegnate: Seconda istanza di Y in mano a C. La traccia riparte da «Assegnazione».",
          "Premi «Passo successivo» e fermati a «Richiesta». Osserva A e B bloccati insieme a C ancora eseguibile; conta due istanze di Y.",
          "Avanza fino a «Rilascio esterno», leggendo anche i passaggi intermedi. Segui il rilascio di C verso A e ricostruisci come la restituzione successiva di X consenta il completamento di B."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "ordine possibile",
            "valore": "C → A → B"
          },
          {
            "passo": 2,
            "campo": "esito",
            "valore": "completamento possibile"
          }
        ]
      }
    ]
  },
  "5.7.2": {
    "scopo": "Due partecipanti competono per X e Y. Metterai a confronto due protocolli preventivi per riconoscere quale condizione necessaria allo stallo venga eliminata da ciascuno.",
    "teoria": [
      "Uno stallo si verifica quando un insieme di partecipanti rimane bloccato perché ciascuno aspetta risorse trattenute da altri appartenenti allo stesso insieme. Si può prevenirlo imponendo una regola prima che inizino le richieste. Le condizioni di Coffman descrivono quattro caratteristiche necessarie allo stallo fra risorse riutilizzabili. C’è esclusione mutua quando una risorsa serve un solo partecipante per volta. C’è possesso durante l’attesa quando chi chiede trattiene quanto ha già ottenuto. Mancanza di prelazione significa che il sistema lascia il rilascio al possessore. L’attesa è circolare quando ciascuno aspetta una risorsa in mano al successivo, fino al ritorno al primo.",
      "Una regola assegna alle risorse un ordine fisso, rappresentato da numeri detti ranghi: X < Y significa che X deve essere acquisita prima di Y. Chi già possiede Y dovrebbe tornare indietro per richiedere X e il protocollo esclude proprio quella richiesta. Lungo una catena di acquisizioni i ranghi crescono, rendendo impossibile un ritorno al rango iniziale.",
      "L’altra regola concede insieme tutte le risorse richieste mediante una prenotazione atomica, cioè un’unica decisione indivisibile che assegna l’intero insieme oppure lascia il richiedente in attesa. Se A ha ottenuto X e Y, B aspetta finché entrambe sono libere. Lo zero accanto alle risorse possedute da B permette di riconoscere la condizione esclusa da questa seconda regola."
    ],
    "introduzione": [
      "Prevenire uno stallo significa imporre alle richieste una regola che elimini una condizione necessaria alla sua formazione. Qui confronterai due condizioni di Coffman: l’attesa circolare, che chiude le dipendenze fra possessori, e il possesso durante l’attesa, che permette di trattenere risorse chiedendone altre. Proprietari e richieste rendono osservabile quale condizione venga esclusa da ciascun protocollo prima che il ciclo si formi.",
      "Carica «Rango crescente» e segui B durante l’attesa di X, verificando che A possa ottenere anche Y. Confronta poi «Prenotazione dell’insieme completo», contando le risorse detenute da B mentre aspetta. Alla conclusione collega la condizione evidenziata alla regola osservata: l’ordine crescente limita la direzione delle richieste, mentre l’assegnazione indivisibile dell’insieme lascia senza risorse parziali chi deve attendere."
    ],
    "lettura": "I riquadri superiori mostrano i proprietari di X e Y. La freccia X → Y indica il rango crescente; la parentesi che le unisce indica una prenotazione unica. In basso viene evidenziata la condizione di Coffman interrotta dal protocollo.",
    "conclusione": "La prevenzione impone una regola prima che si formino le dipendenze pericolose. L’ordine dei ranghi elimina l’attesa circolare; la prenotazione dell’intero insieme elimina il possesso di risorse durante l’attesa di altre.",
    "controlli": {
      "caso": "Sceglie tra acquisizione secondo X < Y e assegnazione atomica di tutto l’insieme {X, Y}. In entrambi i casi A presenta per primo la richiesta."
    },
    "esperienze": [
      {
        "titolo": "Rango crescente",
        "risultato": "La condizione eliminata è l’attesa circolare; A può completare e rilasciare.",
        "ragionamento": "A e B devono entrambi cominciare da X. B attende X lasciando Y libero per A; ogni successiva richiesta sale di rango, mentre un ciclo richiederebbe prima o poi un ritorno a un rango minore.",
        "parametri": {
          "caso": "rank"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Regola imposta: Rango crescente X < Y. La traccia riparte da «Prima richiesta».",
          "Premi «Passo successivo» e fermati a «Durante l’attesa». Controlla che B aspetti X senza detenere Y e che A possa ottenere entrambe le risorse.",
          "Avanza fino a «Proprietà», leggendo anche i passaggi intermedi. Leggi la condizione evidenziata e giustificala seguendo il verso imposto X prima di Y."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "condizione eliminata",
            "valore": "attesa circolare"
          },
          {
            "passo": 2,
            "campo": "A",
            "valore": "può rilasciare"
          }
        ]
      },
      {
        "titolo": "Prenotazione dell’insieme completo",
        "risultato": "La condizione eliminata è il possesso durante l’attesa; dopo il rilascio B ottiene X e Y.",
        "ragionamento": "A riceve le due risorse insieme. La richiesta completa di B resta sospesa senza assegnargli una risorsa parziale; quando A rilascia, B riceve l’intero insieme. Chi aspetta possiede zero risorse di questa prenotazione.",
        "parametri": {
          "caso": "set"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Regola imposta: Prenotazione atomica dell’intero insieme. La traccia riparte da «Richiesta completa».",
          "Premi «Passo successivo» e fermati a «Durante l’attesa». Verifica il numero zero di risorse detenute da B durante l’attesa.",
          "Avanza fino a «Proprietà», leggendo anche i passaggi intermedi. Collega la condizione evidenziata alla prenotazione unica e controlla il nuovo possessore B."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "condizione eliminata",
            "valore": "possesso durante l’attesa"
          },
          {
            "passo": 2,
            "campo": "nuovo possessore",
            "valore": "B"
          }
        ]
      }
    ]
  },
  "5.7.3": {
    "scopo": "Tre processi dichiarano quanti esemplari di X e Y potrebbero ancora usare. Cercherai una sequenza di completamento e ridurrai la disponibilità iniziale per distinguere uno stato sicuro da uno privo di garanzia rispetto ai massimi.",
    "teoria": [
      "Prima di concedere risorse, il sistema può domandarsi se rimanga un ordine di completamento che permetta a tutti di finire, anche se ciascuno arriverà al massimo dichiarato. Questo è il test di sicurezza dell’algoritmo del banchiere. I due numeri di una coppia si riferiscono a risorse diverse, X e Y. Un’eccedenza di X lascia comunque scoperto un eventuale bisogno di Y.",
      "Per ogni processo si sottrae dal massimo la quantità già assegnata. B, che possiede una X e una Y e dichiara al massimo due X e una Y, richiede ancora una X e zero Y. Se inizialmente sono libere una X e una Y, si può dunque ipotizzare che B completi. Per completare B riceverebbe in prestito una X, quindi restituirebbe sia questa sia la dotazione iniziale di una X e una Y. Il prestito e la sua restituzione si compensano: al disponibile iniziale (1,1) si aggiunge la dotazione iniziale di B (1,1), ottenendo (2,2).",
      "La prova ripete il ragionamento sul nuovo disponibile. Lo stato è sicuro se si riesce a collocare tutti i processi nella sequenza. Uno stato insicuro esprime l’assenza di questa garanzia rispetto ai massimi dichiarati. Per accertare un blocco già in corso servirebbero anche le richieste effettive."
    ],
    "introduzione": [
      "Uno stato è sicuro se esiste almeno una sequenza che consenta a tutti i processi di raggiungere i massimi dichiarati e restituire le risorse. L’esperimento rende osservabile il test del banchiere calcolando il bisogno residuo, pari al massimo meno l’assegnazione corrente. Ogni coppia riguarda X e Y separatamente: coprire una componente lascia ancora da verificare l’altra prima del completamento ipotetico.",
      "Carica «Una X e una Y libere» e avanza ai bisogni residui, cercando il primo processo soddisfacibile. Segui poi l’aumento delle disponibilità dopo ogni completamento e confronta l’esito con il caso senza X libere. Se manca una sequenza, interpreta «insicuro» rispetto ai massimi dichiarati: per diagnosticare uno stallo già presente servirebbe conoscere anche le richieste effettivamente pendenti."
    ],
    "lettura": "La tabella separa dotazione posseduta, massimo dichiarato e bisogno residuo per A, B e C. Ogni coppia è ordinata come (X, Y). Il riquadro delle libere cresce dopo i completamenti ipotetici, indicati da una spunta; le dotazioni nella tabella restano quelle iniziali.",
    "conclusione": "Il test di sicurezza cerca almeno un ordine che permetta a tutti di raggiungere i massimi dichiarati. Un esito insicuro segnala l’assenza di questa garanzia; per diagnosticare uno stallo già avvenuto occorrono le richieste effettivamente pendenti.",
    "controlli": {
      "a": "Numero di istanze di X libere prima del test. Le assegnazioni e i massimi dei processi restano fissi.",
      "b": "Numero di istanze di Y libere prima del test. La disponibilità si confronta componente per componente con il bisogno di ciascun processo."
    },
    "esperienze": [
      {
        "titolo": "Una X e una Y libere",
        "risultato": "La sequenza B → A → C dimostra che lo stato è sicuro.",
        "ragionamento": "I bisogni sono A (1,2), B (1,0), C (0,2). Con (1,1) libero può finire B, che restituisce la sua dotazione iniziale (1,1) portando le libere a (2,2); A porta poi il disponibile a (3,2) e C a (4,2).",
        "parametri": {
          "a": 1,
          "b": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Istanze inizialmente libere di X: 1; Istanze inizialmente libere di Y: 1. La traccia riparte da «Assegnazioni e massimi».",
          "Premi «Passo successivo» e fermati a «Bisogni residui». Sottrai assegnazioni dai massimi e identifica B come primo bisogno coperto da (1,1).",
          "Avanza fino a «Esame conclusivo», leggendo anche i passaggi intermedi. Segui l’aumento delle disponibilità a ogni spunta e verifica che tutti e tre i processi compaiano nella sequenza."
        ],
        "attesi": [
          {
            "passo": 5,
            "campo": "sequenza",
            "valore": "B → A → C"
          },
          {
            "passo": 5,
            "campo": "stato",
            "valore": "sicuro"
          }
        ]
      },
      {
        "titolo": "Nessuna X e una sola Y libere",
        "risultato": "La sequenza contiene nessun passo e lo stato è insicuro.",
        "ragionamento": "Con (0,1) libero A richiederebbe ancora una X e due Y, B una X e C due Y. Nessuno dei bisogni rientra nella disponibilità corrente, quindi il test manca di un primo completamento da cui ricavare nuove risorse.",
        "parametri": {
          "a": 0,
          "b": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Istanze inizialmente libere di X: 0; Istanze inizialmente libere di Y: 1. La traccia riparte da «Assegnazioni e massimi».",
          "Premi «Passo successivo» e fermati a «Bisogni residui». Confronta ciascun bisogno con (0,1), controllando separatamente X e Y.",
          "Avanza fino a «Esame conclusivo», leggendo anche i passaggi intermedi. Spiega per ciascun processo quale componente manca e interpreta «insicuro» come esito sui massimi dichiarati."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "sequenza",
            "valore": "nessun passo"
          },
          {
            "passo": 2,
            "campo": "stato",
            "valore": "insicuro"
          }
        ]
      }
    ]
  },
  "5.7.4": {
    "scopo": "Due transazioni hanno formato un ciclo di attese sui lock X e Y. Sceglierai quale annullare e seguirai il ripristino dei dati e il rilascio della risorsa che permette all’altra di completare.",
    "teoria": [
      "In un sistema che gestisce transazioni, più modifiche vengono trattate come un’unica operazione da completare o da annullare. Mentre lavora, ciascuna transazione può riservarsi dati mediante lock esclusivi, permessi che riservano l’accesso a una sola transazione per volta. Se A conserva il lock X aspettando Y e B conserva Y aspettando X, entrambi attendono una risorsa che l’altro tratterrà fino alla fine. Le richieste pendenti formano un ciclo che il gestore può rilevare.",
      "Per sciogliere lo stallo si può annullare una delle transazioni. Il rollback, cioè l’annullamento degli aggiornamenti della transazione, usa le informazioni registrate nel log, il registro delle modifiche, per ripristinare i dati interessati. Il gestore ritira quindi la richiesta della transazione annullata e libera i lock che essa possedeva. Questo rende il recupero compatibile con lo stato dei dati protetti.",
      "Se viene annullata A, scompare la sua richiesta di Y e X torna disponibile per B, che può completare. Scegliere B come vittima inverte i ruoli. Per leggere il grafo dopo il rollback occorre distinguere la freccia di richiesta cancellata dal lock effettivamente liberato."
    ],
    "introduzione": [
      "Recuperare da uno stallo già formato richiede un intervento che renda possibile almeno un rilascio. Qui seguirai l’annullamento di una transazione, un insieme di modifiche trattate come un’unica operazione. Il rollback usa il registro delle modifiche per ripristinare i dati, ritira la richiesta della vittima e libera i suoi lock: il grafo mostra come queste azioni permettano all’altra transazione di completare.",
      "Carica «Annullamento di A» e confronta, nel passo del rollback, la richiesta A → Y rimossa con il lock X rilasciato. Avanza alla ripartenza e individua il primo completamento. Ripeti scegliendo B: seguire la risorsa liberata verso il richiedente permette di spiegare il risultato, mentre il ripristino tramite log chiarisce il contesto transazionale che rende possibile il recupero mostrato."
    ],
    "lettura": "I riquadri superiori mostrano i proprietari dei due lock; le frecce inferiori indicano le dipendenze fra A e B. Nel fotogramma del rollback compare il log di undo, che serve a ripristinare gli aggiornamenti della vittima prima di liberarne i lock.",
    "conclusione": "Il recupero rompe un ciclo già esistente ritirando una richiesta e liberando risorse. Nel contesto transazionale della prova, il rollback rende coerente questo rilascio con l’annullamento degli aggiornamenti della vittima.",
    "controlli": {
      "caso": "Sceglie A oppure B come transazione da annullare. La prova riguarda lock gestiti da un sistema transazionale capace di ripristinare i dati attraverso un log di undo, un registro che conserva le informazioni necessarie ad annullare le modifiche."
    },
    "esperienze": [
      {
        "titolo": "Annullamento di A",
        "risultato": "B completa per primo e il ciclo risulta sciolto.",
        "ragionamento": "Il rollback ripristina gli aggiornamenti di A, ritira la richiesta A → Y e libera X. B può allora acquisire X, completare e restituire i lock; A potrà essere ritentata con dati ripristinati.",
        "parametri": {
          "caso": "a"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Transazione scelta per il rollback: Annulla A. La traccia riparte da «Rilevamento».",
          "Premi «Passo successivo» e fermati a «Rollback di A». Distingui la richiesta rimossa A → Y dal lock liberato X.",
          "Avanza fino a «Ripartenza», leggendo anche i passaggi intermedi. Segui B fino al completamento e verifica la scomparsa del ciclo."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "primo completamento",
            "valore": "B"
          },
          {
            "passo": 2,
            "campo": "ciclo",
            "valore": "sciolto"
          }
        ]
      },
      {
        "titolo": "Annullamento di B",
        "risultato": "A completa per primo e il ciclo risulta sciolto.",
        "ragionamento": "Il gestore annulla B mediante il log, cancella B → X e restituisce Y. A riceve la risorsa che aspettava e completa; il successivo tentativo di B può ripartire dopo il ripristino dei suoi aggiornamenti.",
        "parametri": {
          "caso": "b"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Transazione scelta per il rollback: Annulla B. La traccia riparte da «Rilevamento».",
          "Premi «Passo successivo» e fermati a «Rollback di B». Individua la richiesta B → X cancellata e il rilascio di Y, invertendo i ruoli rispetto al primo caso.",
          "Avanza fino a «Ripartenza», leggendo anche i passaggi intermedi. Verifica A come primo completamento e spiega come la scelta della vittima determini la ripartenza."
        ],
        "attesi": [
          {
            "passo": 2,
            "campo": "primo completamento",
            "valore": "A"
          },
          {
            "passo": 2,
            "campo": "ciclo",
            "valore": "sciolto"
          }
        ]
      }
    ]
  },
  "5.7.5": {
    "scopo": "L’attività visibile di un sistema può nascondere una richiesta continuamente esclusa oppure tentativi privi di risultati. Conterai i completamenti durante una sequenza ripetuta per distinguere starvation e livelock.",
    "teoria": [
      "Per capire se un servizio fa progressi conviene contare le richieste concluse e identificare i richiedenti che continuano ad aspettare. Nella starvation il sistema porta a termine del lavoro, mentre una particolare richiesta può restare esclusa indefinitamente. Nel livelock più partecipanti continuano ad agire in risposta l’uno all’altro e ripetono una sequenza che li riporta al punto di partenza.",
      "Se uno scrittore, cioè un thread che modifica i dati condivisi, richiede accesso esclusivo mentre i lettori, i thread che consultano quei dati, possono entrare a gruppi, un nuovo lettore può aggiungersi prima che l’ultimo esca. Dopo tre giri della prova, tre lettori hanno concluso e lo scrittore è ancora in attesa. Se il medesimo avvicendamento prosegue senza fine, almeno una lettura è sempre in corso.",
      "Nell’altra sequenza i worker A e B sono due thread incaricati del lavoro. Ciascuno ha ottenuto un lock, un vincolo che riserva una risorsa al proprio possessore, e tenta di acquisire quello dell’altro. Al conflitto entrambi rinunciano e riprovano insieme, ricreando la stessa situazione. Gli stati cambiano, mentre il conteggio delle operazioni completate resta a zero. I pochi giri della figura mostrano il meccanismo; la diagnosi di attesa indefinita presuppone che la sequenza continui a ripetersi."
    ],
    "introduzione": [
      "Osservare molte azioni permette di riconoscere attività, mentre il progresso richiede di controllare anche il lavoro concluso. L’obiettivo è distinguere starvation, quando una richiesta resta esclusa mentre altre completano, e livelock, quando i partecipanti ripetono tentativi senza risultati. I giri mostrati rendono visibili i due meccanismi; la diagnosi di durata indefinita assume che lo schema continui a ripetersi senza termine.",
      "Carica «I lettori continuano, S aspetta» e avanza confrontando a ogni giro i completamenti con lo stato dello scrittore. Ripeti con «Entrambi ritentano senza concludere», mantenendo tre giri osservati. Confronta i contatori prima della diagnosi finale e identifica chi produca risultati in ciascuna sequenza: questa lettura separa il cambiamento degli stati dalla conclusione effettiva delle richieste."
    ],
    "lettura": "Ogni colonna è un giro osservato. Nel caso dei lettori la riga superiore mostra chi completa e quella inferiore S ancora in attesa; nel caso dei worker entrambe le righe mostrano i tentativi ripetuti. Confronta il numero delle azioni con il contatore del lavoro concluso.",
    "conclusione": "Usa i contatori per distinguere le tracce: dopo tre giri i lettori hanno concluso tre operazioni e S aspetta ancora; A e B hanno compiuto tentativi e concluso zero operazioni. Se le rispettive sequenze proseguono indefinitamente, il primo caso produce starvation di S e il secondo livelock dei due worker.",
    "controlli": {
      "caso": "Sceglie una richiesta di scrittura superata da lettori oppure due worker che rilasciano e ritentano contemporaneamente.",
      "n": "Numero di giri mostrati, da due a sei. Il responso finale interpreta la sequenza nell’ipotesi che continui a ripetersi senza fine."
    },
    "esperienze": [
      {
        "titolo": "I lettori continuano, S aspetta",
        "risultato": "Dopo tre giri la sequenza è classificata come starvation se prosegue indefinitamente.",
        "ragionamento": "A ogni giro entra un nuovo lettore prima che il precedente esca, mantenendo sempre almeno una lettura attiva. I lettori completano tre operazioni nei tre giri, mentre S resta escluso dall’accesso esclusivo; ripetere lo schema perpetua la sua attesa.",
        "parametri": {
          "caso": "starve",
          "n": 3
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Sequenza ripetuta: Un nuovo lettore supera lo scrittore; Giri osservati: 3. La traccia riparte da «Punto iniziale».",
          "Premi «Passo successivo» e fermati a «Giro 1». Conta il primo completamento e controlla che S sia ancora in coda.",
          "Avanza fino a «Diagnosi con ripetizione indefinita», leggendo anche i passaggi intermedi. Controlla i tre completamenti prima della diagnosi e identifica la sola richiesta che continua ad aspettare."
        ],
        "attesi": [
          {
            "passo": 4,
            "campo": "diagnosi",
            "valore": "starvation"
          },
          {
            "passo": 4,
            "campo": "giri osservati",
            "valore": "3"
          },
          {
            "passo": 3,
            "campo": "operazioni completate",
            "valore": "3"
          },
          {
            "passo": 3,
            "campo": "stato osservato",
            "valore": "S ancora in coda"
          }
        ]
      },
      {
        "titolo": "Entrambi ritentano senza concludere",
        "risultato": "Tre giri lasciano zero completamenti; con ripetizione indefinita la diagnosi è livelock.",
        "ragionamento": "A e B reagiscono al conflitto rilasciando e riprovando nello stesso istante. Ogni giro ricrea la situazione iniziale: gli stati cambiano e si compiono tentativi, mentre il lavoro completato resta zero.",
        "parametri": {
          "caso": "live",
          "n": 3
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Sequenza ripetuta: Due worker cedono insieme; Giri osservati: 3. La traccia riparte da «Punto iniziale».",
          "Premi «Passo successivo» e fermati a «Giro 1». Verifica che entrambi tornino pronti a tentare e che il contatore resti zero.",
          "Avanza fino a «Diagnosi con ripetizione indefinita», leggendo anche i passaggi intermedi. Confronta i tre giri con i tre completamenti del caso precedente, distinguendo movimento degli stati e avanzamento del lavoro."
        ],
        "attesi": [
          {
            "passo": 4,
            "campo": "diagnosi",
            "valore": "livelock"
          },
          {
            "passo": 4,
            "campo": "giri osservati",
            "valore": "3"
          },
          {
            "passo": 3,
            "campo": "operazioni completate",
            "valore": "0"
          },
          {
            "passo": 3,
            "campo": "stato osservato",
            "valore": "entrambi pronti al nuovo tentativo"
          }
        ]
      }
    ]
  },
  "5.7.6": {
    "scopo": "A e B possiedono un’istanza ciascuno e ne resta una libera. Proverai chi possa completare per primo, seguendo poi il rilascio che rende possibile anche il lavoro dell’altro.",
    "teoria": [
      "Per studiare un insieme di lavori che si dividono una risorsa disponibile in più esemplari, si può tentare a mano una sequenza di completamento. Il bisogno residuo di un lavoro è quanto ancora gli manca. Se gli esemplari liberi bastano a coprirlo, è possibile immaginare che quel lavoro riceva il necessario, termini e restituisca l’intera propria dotazione.",
      "A possiede già un’istanza e ne richiede ancora una; B possiede un’istanza e ne richiede ancora due. La terza istanza è libera, perciò A può riceverla e completare. Dopo il rilascio risultano libere due istanze, sufficienti a coprire il bisogno di B. Al termine di B tornano disponibili tutte e tre.",
      "Il test prosegue confrontando il bisogno di chi rimane con la nuova disponibilità. Nella figura ciascuna casella rappresenta un esemplare, mentre la lettera ne identifica il possessore. Per scegliere il primo candidato è sufficiente il confronto iniziale. I rilasci che seguirebbero servono a stabilire se il candidato scelto apra la strada anche agli altri."
    ],
    "introduzione": [
      "Un processo capace di terminare può liberare le risorse necessarie a chi, nell’istantanea iniziale, deve ancora aspettare. Il problema serve a costruire questa sequenza mediante il bisogno residuo, cioè le istanze ancora richieste per completare. Confrontando ogni bisogno con la disponibilità corrente e aggiornandola dopo i rilasci, potrai verificare se il primo candidato apra una via di completamento anche all’altro.",
      "Leggi l’unica istanza libera e i bisogni di A e B, poi scrivi chi possa completare per primo. Avanza con «Passo successivo» e confronta la disponibilità dopo A con le due istanze ancora necessarie a B. Nell’ultimo passaggio conta tutte le caselle libere: ritrovare le tre iniziali verifica sia l’ordine scelto sia la restituzione delle dotazioni possedute."
    ],
    "lettura": "Le tre caselle rappresentano le istanze totali; le lettere identificano i possessori e la casella libera è il disponibile. A ogni completamento ipotetico segui le restituzioni prima di confrontare il bisogno del processo successivo.",
    "conclusione": "Un completamento simulato può aumentare le possibilità di chi resta. Una sequenza che include tutti i processi dimostra la sicurezza rispetto ai bisogni dichiarati nelle ipotesi del modello.",
    "procedura": [
      "Confronta una sola istanza libera con bisogno A = 1 e bisogno B = 2. Registra chi possa completare per primo.",
      "Avanza a «Completare A» e verifica che il rilascio porti le istanze libere a due.",
      "Avanza a «Completare B» e controlla che il nuovo disponibile basti e che alla fine siano libere tutte e tre le istanze."
    ],
    "risultato": "A può completare per primo; la sequenza A → B restituisce infine tutte e tre le istanze.",
    "ragionamento": "L’unica istanza libera copre il bisogno residuo uno di A. Dopo il completamento tornano libere quella appena concessa e quella inizialmente posseduta da A, per un totale due; B può allora ricevere le due mancanti e restituire l’intera dotazione di tre."
  },
  "5.7.7": {
    "scopo": "Il ciclo fra A, B, X e Y convive con una seconda istanza di Y posseduta da C. Conterai gli archi e cercherai una sequenza di rilasci per verificare se il sistema sia già in stallo.",
    "teoria": [
      "Un grafo è un disegno di nodi uniti da frecce. Per studiare le attese, alcuni nodi rappresentano processi e altri le risorse di cui hanno bisogno. Seguendo la direzione delle frecce si distinguono i beni che un processo possiede da quelli per i quali deve ancora aspettare.",
      "Una freccia dal processo verso la risorsa indica una richiesta in attesa. Nel verso opposto indica che una specifica istanza, cioè un esemplare di quel tipo di risorsa, è già stata assegnata. Un ciclo di frecce suggerisce dove cercare un’attesa circolare, mentre il conteggio delle istanze dice se qualcuno possa ancora sbloccarla.",
      "A trattiene X e aspetta Y; B trattiene una Y e aspetta X. Una seconda istanza di Y appartiene a C, che può terminare subito e rilasciarla. Benché il ciclo A → Y → B → X → A contenga quattro archi, la restituzione di C può soddisfare A e avviare una sequenza di completamento. Il numero delle istanze e i possessori esterni sono dunque parte dell’interpretazione del disegno."
    ],
    "introduzione": [
      "Leggere un grafo di assegnazione richiede di distinguere il verso delle frecce e il numero degli esemplari di ogni risorsa. L’esercizio ti aiuta a verificare se un ciclo implichi già uno stallo, cercando un completamento esterno che possa interromperlo. Le richieste vanno dai processi alle risorse; le assegnazioni individuano i possessori delle istanze che potrebbero essere restituite.",
      "Carica l’esempio guidato, conta gli archi del percorso A → Y → B → X → A e registra la previsione. Avanza distinguendo le due richieste dalle due assegnazioni, poi individua la seconda Y posseduta da C. Nella prova completa confronta la diagnosi con la sequenza dei rilasci: il completamento di C rende possibile quello di A e successivamente quello di B."
    ],
    "lettura": "Segui il percorso A → Y → B → X → A e conta separatamente richieste e assegnazioni. Cerca poi l’istanza di Y in mano a C, esterna al ciclo, e la possibilità dichiarata che C termini subito.",
    "conclusione": "La presenza di un ciclo va interpretata insieme al numero di istanze e ai rilasci possibili. Un processo esterno capace di concludere può rendere eseguibile un partecipante al ciclo e sciogliere le altre attese.",
    "procedura": [
      "Premi «Carica l’esempio guidato»: seleziona l’esercizio 3, «Leggere un ciclo nel grafo di assegnazione», traccia 1. I passaggi e i risultati seguenti si riferiscono a questa combinazione.",
      "Conta gli archi nel ciclo indicato e registra la previsione nel campo iniziale.",
      "Avanza nella ricostruzione distinguendo le richieste A → Y e B → X dalle due assegnazioni opposte.",
      "Apri la prova completa e verifica la diagnosi di stallo seguendo prima il rilascio di C, poi i completamenti di A e B."
    ],
    "risultato": "Il ciclo contiene quattro archi; in questo stato il completamento rimane possibile attraverso la sequenza C → A → B.",
    "ragionamento": "Due richieste e due assegnazioni formano i quattro archi. C può restituire una seconda Y ad A, che completa e libera X per B: l’ordine C → A → B fornisce una via di uscita dal ciclo."
  },
  "5.7.8": {
    "scopo": "Tre processi condividono un solo tipo di risorsa e dichiarano i massimi. Calcolerai i bisogni residui e costruirai una sequenza di completamento per verificare la sicurezza dell’assegnazione corrente.",
    "teoria": [
      "Per decidere se vi siano abbastanza risorse da far concludere tutti i processi, si può cercare un ordine nel quale ciascuno riceva ancora quanto gli serve e poi restituisca la propria dotazione. Nel modello del banchiere ogni processo dichiara in anticipo la quantità massima che potrà richiedere.",
      "Dal massimo dichiarato si sottraggono le unità che il processo possiede. Se quelle libere bastano a coprire la differenza, si può immaginare il suo completamento e aggiungere alla disponibilità iniziale ciò che il processo già deteneva. Su questa nuova disponibilità si ripete il calcolo.",
      "A possiede due istanze su un massimo di cinque, B due su tre e C una su quattro. Con una sola istanza libera il bisogno di B, pari a 3 − 2 = 1, è già soddisfacibile. Il completamento di B restituisce anche le sue due istanze iniziali e porta il disponibile a tre, aprendo la strada ad A e poi a C."
    ],
    "introduzione": [
      "Verificare la sicurezza di un’assegnazione richiede di ricostruire quanto ciascun processo potrebbe ancora chiedere. Questa soluzione applica il test del banchiere a un solo tipo di risorsa, distinguendo bisogno residuo e dotazione posseduta. Il primo si confronta con le istanze libere; la seconda torna disponibile dopo il completamento ipotetico e può rendere soddisfacibile il bisogno del processo successivo.",
      "Ripristina l’esempio guidato e sottrai per A, B e C le assegnazioni dai massimi dichiarati. Avanza confrontando i bisogni con l’unica istanza libera, poi segui il disponibile che cresce dopo B, A e C. Nelle verifiche finali controlla che la sequenza comprenda tutti i processi e che le sei istanze tornino libere, collegando questi riscontri all’esito sicuro."
    ],
    "lettura": "Confronta per ogni processo il massimo con la quantità già posseduta. Il disponibile iniziale è uno e cresce dopo ogni completamento ipotetico della ricostruzione; conserva distinto il bisogno residuo dalla dotazione restituita.",
    "conclusione": "Verifica la sequenza B → A → C confrontando ogni bisogno con le istanze allora libere: 1 basta a B, 3 bastano ad A e 5 bastano a C. Alla fine ritrovi le sei istanze totali. La sicurezza dipende dall’esistenza di almeno una sequenza capace di coprire tutti i massimi dichiarati.",
    "procedura": [
      "Premi «Carica l’esempio guidato»: seleziona l’esercizio 5, «Verificare una sequenza sicura», traccia 1. I passaggi e i risultati seguenti si riferiscono a questa combinazione.",
      "Calcola i bisogni A = 5 − 2, B = 3 − 2 e C = 4 − 1, poi confrontali con l’unica istanza libera.",
      "Avanza nel completamento ipotetico di B e annota il disponibile che cresce da uno a tre.",
      "Prosegui con A e C, verificando che la sequenza includa tutti e che le disponibilità finali ricostruiscano le sei istanze totali."
    ],
    "risultato": "Il bisogno residuo di B è 1 e lo stato è sicuro, con sequenza B → A → C.",
    "ragionamento": "I bisogni sono A = 3, B = 1 e C = 3. B può iniziare con l’istanza libera e, completando, restituisce anche le due già possedute: il disponibile passa a tre. Seguono A, che lo porta a cinque, e C, che lo porta a sei."
  },
  "modulo-5": {
    "scopo": "A alterna calcolo e lettura su disco, mentre B svolge soltanto calcolo. Ridurrai il quanto della CPU per seguire code, risvegli e cambi di contesto e misurare insieme la prima risposta di B e il tempo complessivo.",
    "teoria": [
      "Un programma che elabora dati ricevuti da un disco alterna due lavori diversi. La sigla CPU indica il processore; I/O indica l’ingresso o l’uscita dei dati attraverso un dispositivo. Nei tratti di calcolo servono le istruzioni del processore, mentre durante una lettura è il dispositivo a svolgere il servizio richiesto. Sul core, l’unità che esegue le istruzioni, può quindi avanzare un secondo processo, cioè un’altra esecuzione dotata dei propri dati. Un burst è un tratto di calcolo richiesto prima della successiva attesa o della conclusione. Qui A deve calcolare per due millisecondi, leggere dal disco e calcolare per altri due. B richiede cinque millisecondi di solo calcolo.",
      "Il dispatcher è il meccanismo che assegna il core al processo scelto. Il sistema raccoglie nella coda dei pronti i processi in grado di lavorare. Con la politica round-robin, chi esaurisce il tempo massimo concesso per turno, chiamato quanto, torna in fondo alla coda se ha ancora calcolo da compiere. Chi chiede il disco resta invece bloccato fino al completamento della lettura. Al risveglio A si accoda fra i pronti, anche se nel frattempo B si trova ancora sul core.",
      "Con un quanto di due millisecondi, A può completare il suo primo calcolo in un solo turno. Se il passaggio a B richiede un millisecondo, il core dedica alla sostituzione l’intervallo dal tempo 2 al tempo 3. Nel diagramma Δ indica il cambio, una lettera il processo in esecuzione e un punto l’inattività. La prima assegnazione è gratuita, come la ripresa dopo l’inattività. Se A si risveglia proprio mentre scade il turno di B, entra in coda prima che vi rientri B."
    ],
    "introduzione": [
      "Il tempo di un processo si distribuisce fra calcolo, attesa del dispositivo e attesa del core. Questa simulazione collega tali stati alla scelta dei turni round-robin, ciascuno limitato da un quanto. A alterna calcolo e disco, mentre B richiede soltanto calcolo: seguirne la coda permette di valutare insieme la prima risposta di B e il tempo impiegato a completare entrambi.",
      "Carica il caso con quanto di due millisecondi e avanza dalla richiesta al disco alla prima assegnazione di B, distinguendo i segmenti di lavoro dai cambi indicati con Δ. Segui anche il risveglio di A, poi confronta il caso con quanto di un millisecondo. Mantieni uguali disco e costo del cambio: contare i nove millisecondi utili e i cambi effettivi spiega i due risultati finali."
    ],
    "lettura": "La linea temporale usa A e B per i tratti di lavoro utile, Δ per i cambi di processo e un punto per l’inattività. I riquadri dello stato distinguono core, pronti e attesa I/O. Il tempo avanza fra eventi significativi; più fotogrammi possono riferirsi allo stesso istante mentre cambia la posizione di un processo.",
    "conclusione": "Ricostruisci il bilancio separando i nove millisecondi di calcolo dai segmenti Δ e dalle eventuali pause. Nei casi guidati il quanto di 2 ms dà a B la prima risposta a 3 ms e conclude a 12; con quanto di 1 ms B parte a 2 ms e l’insieme termina a 15. Il confronto collega l’anticipo della risposta al maggior numero di cambi effettivi.",
    "controlli": {
      "quanto": "Massimo tempo di CPU assegnato per turno, in millisecondi. Chi conserva calcolo residuo si accoda di nuovo alla scadenza.",
      "io": "Durata della lettura di A, misurata dalla sua richiesta al completamento del disco. Durante questo intervallo A è bloccato.",
      "costo": "Millisecondi occupati da un passaggio tra processi distinti. La prima assegnazione, la ripresa dopo inattività e la prosecuzione dello stesso processo sono gratuite nel modello."
    },
    "esperienze": [
      {
        "titolo": "Quanto di due millisecondi",
        "risultato": "B riceve la CPU per la prima volta a 3 ms; l’esecuzione termina a 12 ms.",
        "ragionamento": "A completa il primo burst fra 0 e 2 e chiede il disco, che terminerà a 6. Dopo il cambio B parte a 3; al risveglio A si accoda e riprende a 8, finendo a 10. B conclude a 12: nove millisecondi di calcolo e tre cambi da un millisecondo riempiono il tempo del core.",
        "parametri": {
          "quanto": 2,
          "io": 4,
          "costo": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Quanto della CPU (ms): 2; Durata della lettura su disco (ms): 4; Costo di un cambio (ms): 1. La traccia riparte da «Arrivo di A e B».",
          "Premi «Passo successivo» e fermati a «Assegnazione a A». A prende il core al tempo zero. Segui poi «Richiesta al disco» a 2 ms e «Assegnazione a B» a 3 ms, annotando il cambio che li separa.",
          "Avanza fino a «Bilancio del core», leggendo anche i passaggi intermedi. Controlla il risveglio di A a 6 ms, i tre segmenti Δ e i due indicatori finali 3 e 12 ms."
        ],
        "attesi": [
          {
            "passo": 15,
            "campo": "tempo (ms)",
            "valore": "12"
          },
          {
            "passo": 15,
            "campo": "core",
            "valore": "libero"
          },
          {
            "passo": 15,
            "campo": "pronti",
            "valore": "nessuno"
          },
          {
            "passo": 15,
            "campo": "attesa I/O",
            "valore": "—"
          },
          {
            "passo": 15,
            "campo": "prima CPU di B (ms)",
            "valore": "3"
          }
        ]
      },
      {
        "titolo": "Quanto di un millisecondo",
        "risultato": "B inizia prima, a 2 ms, mentre il tempo totale sale a 15 ms.",
        "ragionamento": "A cede dopo il primo millisecondo e il cambio permette a B di partire a 2. A completa il primo burst soltanto a 5, perciò il disco termina a 9; i turni più brevi producono sei cambi effettivi. I nove millisecondi di calcolo più sei di cambio danno 15 ms.",
        "parametri": {
          "quanto": 1,
          "io": 4,
          "costo": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i parametri applicati: Quanto della CPU (ms): 1; Durata della lettura su disco (ms): 4; Costo di un cambio (ms): 1. La traccia riparte da «Arrivo di A e B».",
          "Premi «Passo successivo» e fermati a «Assegnazione a A». A riceve il core a zero. Segui la prima scadenza a 1 ms e la prima assegnazione di B a 2 ms; annota che A deve ancora completare il suo primo burst.",
          "Avanza fino a «Bilancio del core», leggendo anche i passaggi intermedi. Conta sei segmenti Δ e confronta 2 ms di prima risposta e 15 ms complessivi con il caso a quanto due."
        ],
        "attesi": [
          {
            "passo": 26,
            "campo": "tempo (ms)",
            "valore": "15"
          },
          {
            "passo": 26,
            "campo": "core",
            "valore": "libero"
          },
          {
            "passo": 26,
            "campo": "pronti",
            "valore": "nessuno"
          },
          {
            "passo": 26,
            "campo": "attesa I/O",
            "valore": "—"
          },
          {
            "passo": 26,
            "campo": "prima CPU di B (ms)",
            "valore": "2"
          }
        ]
      }
    ]
  }
};
  Object.assign(SL.guide, percorsi);
  for (const [id, guida] of Object.entries(percorsi)) SL.lezioni[id] = guida.teoria;
})();
