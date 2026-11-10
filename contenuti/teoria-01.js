'use strict';

// Guida completa di ogni unità: scopo, teoria, casi, lettura e risultati.
(() => {
  const percorsi = {
  "1.1.1": {
    "scopo": "Una riga stampata dal programma attraversa la libreria e il kernel prima di raggiungere la destinazione. Seguirai i byte di quella riga per collegare il testo scritto nel codice alla richiesta che trasferisce i dati.",
    "teoria": [
      "Quando un programma in linguaggio C stampa una parola, richiama una funzione, cioè un’operazione dotata di un nome e di dati in ingresso. La funzione puts appartiene alla libreria standard, la raccolta di operazioni comuni fornita al programma: riceve il testo e lo invia all’uscita standard, chiamata stdout, aggiungendo un carattere di fine riga. L’uscita standard è il collegamento attraverso il quale il programma consegna normalmente il proprio testo.",
      "Un byte è un gruppo di otto bit, cifre che valgono zero oppure uno. Per trascriverlo si usano due cifre esadecimali: dopo 0–9 compaiono A–F, con valori da dieci a quindici. Una codifica stabilisce quali byte rappresentino i caratteri. UTF-8 conserva i codici ASCII delle lettere latine senza accento: ciascuna lettera di hello occupa un byte. Nella stessa codifica «A» occupa 41 ed «è» occupa C3 A8; con il fine riga LF, rappresentato da 0A, «Aè» richiede la sequenza 41 C3 A8 0A.",
      "Durante l’esecuzione il programma appartiene a un processo, l’entità che il sistema operativo usa per seguirne memoria e risorse. La libreria può trattenere il testo in un buffer, un’area temporanea di memoria, prima di affidarlo al kernel, la parte del sistema operativo che gestisce le risorse della macchina. Nel caso della parola hello, la richiesta write(1, …, 6) significa trasferire sei byte dal buffer alla risorsa indicata dal descrittore 1. Il descrittore, abbreviato fd nella figura, è un numero che identifica un collegamento aperto del processo; il valore 1 è quello di stdout. Le frecce permettono di seguire il collegamento fino al terminale, dove il testo appare a video, oppure fino al file che lo conserva."
    ],
    "introduzione": [
      "La simulazione permette di collegare una chiamata del programma ai byte consegnati al sistema operativo. puts riceve testo e aggiunge il fine riga LF; la libreria prepara la sequenza, mentre il kernel la trasferisce alla risorsa associata a stdout. Il descrittore 1 identifica questa uscita: la lunghezza della richiesta dipende dalla codifica dei caratteri.",
      "Carica il caso «Una parola ASCII sul terminale» e avanza con «Passo successivo» fino alla richiesta write. Conta le coppie esadecimali, includendo 0A, e confrontale con la lunghezza indicata. Passa poi al caso «Una lettera accentata nel file»: osserva che è occupa due byte e che la destinazione cambia insieme al collegamento di stdout."
    ],
    "lettura": "Segui le frecce dal riquadro puts alla fila dei byte, poi al riquadro «kernel» e alla destinazione. Ogni coppia esadecimale nella fila occupa un byte; l’ultima, 0A, è il fine riga aggiunto da puts. Il numero fd 1 identifica il collegamento usato dal processo.",
    "conclusione": "Il testo determina la sequenza e la lunghezza della scrittura; il collegamento di stdout determina la destinazione. La traccia rappresenta una consegna completa con write, assumendo che tutti i byte richiesti vengano trasferiti.",
    "controlli": {
      "parola": "Testo passato a puts. La codifica UTF-8 può usare più byte per una lettera accentata; puts aggiunge un byte LF dopo il testo.",
      "uscita": "Risorsa collegata al descrittore 1, cioè stdout. Cambia il luogo che riceve la stessa sequenza di byte."
    },
    "esperienze": [
      {
        "titolo": "Una parola ASCII sul terminale",
        "parametri": {
          "parola": "hello",
          "uscita": "terminale"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Argomento di puts = hello; Destinazione di stdout = terminale.",
          "Conta le cinque lettere di hello e aggiungi un posto per LF; prevedi così la lunghezza richiesta a write.",
          "Usa «Passo successivo» fino a «Libreria standard». Leggi «Byte esadecimali» e «Lunghezza» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Consegna al kernel». Confronta «Richiesta» e «Destinazione» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Consegna al kernel» si leggono: Richiesta = write(1, …, 6); Destinazione = terminale.",
        "ragionamento": "Le cinque lettere di hello appartengono ad ASCII e occupano cinque byte. Il fine riga 0A porta il totale a sei, che è il terzo argomento della richiesta write sul descrittore 1.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Richiesta",
            "valore": "write(1, …, 6)"
          },
          {
            "passo": 2,
            "campo": "Destinazione",
            "valore": "terminale"
          },
          {
            "passo": 1,
            "campo": "Byte esadecimali",
            "valore": "68 65 6C 6C 6F 0A"
          }
        ]
      },
      {
        "titolo": "Una lettera accentata nel file",
        "parametri": {
          "parola": "Aè",
          "uscita": "file"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Argomento di puts = Aè; Destinazione di stdout = file.",
          "Assegna un byte ad A, due a è e uno a LF; confronta poi questo conteggio con il numero di caratteri visibili.",
          "Usa «Passo successivo» fino a «Libreria standard». Leggi «Byte esadecimali» e «Lunghezza» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Consegna al kernel». Confronta «Richiesta» e «Destinazione» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Consegna al kernel» si leggono: Richiesta = write(1, …, 4); Destinazione = file.",
        "ragionamento": "A usa 41 ed è usa C3 A8, quindi i due caratteri richiedono tre byte. Con LF si arriva a quattro: write(1, …, 4) consegna quei byte al file al quale è collegato stdout.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Richiesta",
            "valore": "write(1, …, 4)"
          },
          {
            "passo": 2,
            "campo": "Destinazione",
            "valore": "file"
          },
          {
            "passo": 1,
            "campo": "Byte esadecimali",
            "valore": "41 C3 A8 0A"
          }
        ]
      }
    ]
  },
  "1.1.2": {
    "scopo": "Per leggere una cella occorre inviarne l’indirizzo alla memoria e ricevere il dato conservato in quella posizione. Variando lo spostamento riconoscerai separatamente il calcolo della posizione e il valore che torna nel registro.",
    "teoria": [
      "Per leggere un dato, il processore, indicato anche con la sigla CPU, deve prima localizzarlo. La memoria della figura si può immaginare come una fila di caselle numerate, ciascuna delle quali conserva un byte, ossia otto cifre binarie. Il numero scritto accanto a una casella è il suo indirizzo. Il valore che vi si trova può cambiare pur rimanendo nella stessa posizione. La sigla RAM etichetta questa memoria di lavoro, nella quale il processore trova i dati da leggere.",
      "Il processore conosce l’indirizzo della prima casella e calcola quanto deve allontanarsene. Nella scrittura 0x1000 il prefisso 0x introduce un numero in base sedici. Partendo da questa base, uno spostamento di un byte conduce a 0x1001, la seconda casella, perché la prima occupa già la posizione con spostamento zero.",
      "Dopo aver ricevuto l’indirizzo, la memoria restituisce il contenuto selezionato. A 0x1001 si trova 0x65, che vale 6 × 16 + 5, dunque 101. È questo 101 che entra nel registro, una piccola sede di memorizzazione interna al processore. Le due direzioni della lettura diventano così riconoscibili seguendo prima l’indirizzo e poi il byte che ritorna."
    ],
    "introduzione": [
      "Questa lettura simulata chiarisce come il processore raggiunga un dato in memoria. Ogni cella della RAM contiene un byte e possiede un indirizzo, cioè il numero che ne identifica la posizione. Sommando uno spostamento alla base si seleziona la cella; il suo contenuto torna quindi al processore e viene caricato in un registro, una piccola memoria interna.",
      "Carica «La seconda cella» e segui i passaggi dal calcolo 0x1000 + 1 al registro. Confronta l’indirizzo 0x1001 con il byte 0x65 e con il suo valore decimale 101. Fissa il risultato per confronto, imposta lo spostamento a 3 e applica i parametri: la cella raggiunta diventa 0x1003 e il dato restituito vale 33."
    ],
    "lettura": "La fila RAM contiene quattro celle, etichettate da +0 a +3 rispetto alla base 0x1000. La freccia superiore trasporta l’indirizzo verso la cella evidenziata; il percorso inferiore riporta il suo contenuto al registro della CPU.",
    "conclusione": "Lo spostamento seleziona una posizione; il valore letto dipende dal contenuto di quella posizione. Gli indirizzi della memoria e i dati presenti nelle celle svolgono quindi ruoli distinti durante una lettura.",
    "controlli": {
      "offset": "Numero di byte da aggiungere alla base 0x1000. Zero seleziona la prima delle quattro celle; tre seleziona l’ultima."
    },
    "esperienze": [
      {
        "titolo": "La seconda cella",
        "parametri": {
          "offset": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Spostamento dalla base (byte) = 1.",
          "Somma 1 alla base 0x1000 e cerca nella fila il byte associato a +1.",
          "Usa «Passo successivo» fino a «Selezione della cella». Leggi «Indirizzo» e «Memoria da 0x1000» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Ritorno dei dati». Confronta «Byte letto» e «Registro (decimale)» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Ritorno dei dati» si leggono: Byte letto = 0x65; Registro (decimale) = 101.",
        "ragionamento": "Il calcolo 0x1000 + 1 seleziona 0x1001. La cella contiene 0x65, il cui valore decimale è 6 × 16 + 5 = 101; il registro riceve dunque 101.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Byte letto",
            "valore": "0x65"
          },
          {
            "passo": 2,
            "campo": "Registro (decimale)",
            "valore": "101"
          },
          {
            "passo": 1,
            "campo": "Indirizzo",
            "valore": "0x1001"
          }
        ]
      },
      {
        "titolo": "L’ultima cella",
        "parametri": {
          "offset": 3
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Spostamento dalla base (byte) = 3.",
          "Somma 3 alla base 0x1000 e leggi il contenuto della cella +3 prima che venga copiato nel registro.",
          "Usa «Passo successivo» fino a «Selezione della cella». Leggi «Indirizzo» e «Memoria da 0x1000» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Ritorno dei dati». Confronta «Byte letto» e «Registro (decimale)» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Ritorno dei dati» si leggono: Byte letto = 0x21; Registro (decimale) = 33.",
        "ragionamento": "Il calcolo 0x1000 + 3 seleziona 0x1003. In quella cella è conservato 0x21, cioè 2 × 16 + 1 = 33, che diventa il valore del registro.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Byte letto",
            "valore": "0x21"
          },
          {
            "passo": 2,
            "campo": "Registro (decimale)",
            "valore": "33"
          },
          {
            "passo": 1,
            "campo": "Indirizzo",
            "valore": "0x1003"
          }
        ]
      }
    ]
  },
  "1.1.3": {
    "scopo": "Il sorgente C attraversa diverse trasformazioni prima di diventare un programma avviabile. Sceglierai un comando nel simulatore e seguirai i file prodotti, confrontando una costruzione completa con un arresto alla forma assembly.",
    "teoria": [
      "Il sorgente hello.c è un file di testo nel quale il programmatore descrive operazioni in linguaggio C. Una chiamata come puts richiede un’operazione già definita altrove. Per avviare il programma occorre trasformare il sorgente in istruzioni macchina, sequenze di bit che il processore sa eseguire, e predisporre i riferimenti alle operazioni esterne. GCC è il sistema di strumenti invocato con il comando gcc; le opzioni precedute da un trattino stabiliscono il prodotto richiesto.",
      "Il preprocessore esegue le direttive, istruzioni che preparano il testo prima della traduzione. Per esempio, un’inclusione inserisce dichiarazioni provenienti da un header, un file che descrive i nomi e i tipi delle funzioni disponibili. Una dichiarazione specifica i dati accettati dalla funzione e il tipo del risultato. Il compilatore traduce poi il testo preparato in assembly, una rappresentazione leggibile delle istruzioni macchina. L’assemblatore codifica tali istruzioni in byte e le raccoglie in un file oggetto. Un riferimento ancora da risolvere è, per esempio, una chiamata che conserva il nome della funzione in attesa di conoscerne la destinazione.",
      "Con gcc -S hello.c ci si ferma quando è pronto hello.s, che si può leggere come testo. Con gcc -c hello.c si arriva invece a hello.o. Se si richiede l’eseguibile hello, entra in gioco anche il collegatore, che combina il codice con gli oggetti e le librerie necessari. Il file indicato alla fine della traccia è il prodotto conservato dal comando scelto."
    ],
    "introduzione": [
      "Il percorso animato serve a riconoscere le trasformazioni che rendono eseguibile un sorgente C. La preelaborazione prepara il testo, la compilazione produce assembly leggibile e l’assemblaggio codifica istruzioni in un file oggetto. Il collegamento riunisce oggetti e librerie. L’opzione scelta per GCC stabilisce dove termina questa catena e quale prodotto viene conservato.",
      "Carica «Costruire l’eseguibile» e usa «Passo successivo» per associare ogni freccia alla forma raggiunta, fino a hello. Confronta poi «Fermarsi all’assembly», oppure seleziona gcc -S hello.c e premi «Applica i parametri». Osserva dove il percorso si arresta e leggi «File da esaminare»: hello.s contiene il testo assembly, mentre l’eseguibile richiede anche le fasi successive."
    ],
    "lettura": "Ogni foglio rappresenta il prodotto di una fase, da hello.c fino a hello. La freccia illuminata indica la trasformazione in corso; i fogli ancora da raggiungere mostrano puntini. La riga inferiore indica il file effettivamente conservato dal comando scelto.",
    "conclusione": "L’opzione di GCC stabilisce fino a quale fase proseguire. Per riconoscere il contenuto del file prodotto si deve conoscere il punto di arresto della catena di traduzione.",
    "controlli": {
      "modo": "Comando che dirige la costruzione: -E conserva il testo preprocessato, -S l’assembly, -c l’oggetto; il comando completo richiede anche il collegamento."
    },
    "esperienze": [
      {
        "titolo": "Costruire l’eseguibile",
        "parametri": {
          "modo": "link"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Comando GCC = gcc hello.c -o hello.",
          "Prevedi quali prodotti seguano hello.c e individua la fase che può risolvere i riferimenti alle funzioni esterne.",
          "Usa «Passo successivo» fino a «Assemblaggio». Leggi «Forma intermedia» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Uscita del comando». Confronta «File da esaminare» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Uscita del comando» si leggono: File da esaminare = hello.",
        "ragionamento": "Il comando completo esegue preelaborazione, compilazione, assemblaggio e collegamento. Il collegatore combina oggetti e librerie per produrre hello; la traccia nomina le forme intermedie anche quando GCC le mantiene internamente.",
        "attesi": [
          {
            "passo": 5,
            "campo": "File da esaminare",
            "valore": "hello"
          },
          {
            "passo": 3,
            "campo": "Forma intermedia",
            "valore": "hello.o"
          }
        ]
      },
      {
        "titolo": "Fermarsi all’assembly",
        "parametri": {
          "modo": "S"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Comando GCC = gcc -S hello.c.",
          "Leggi l’opzione -S e individua il foglio che dovrà essere conservato quando il comando termina.",
          "Usa «Passo successivo» fino a «Compilazione». Leggi «Prodotto richiesto» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Uscita del comando». Confronta «File da esaminare» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Uscita del comando» si leggono: File da esaminare = hello.s.",
        "ragionamento": "Con -S la traduzione si ferma dopo la compilazione. Il risultato hello.s contiene assembly leggibile; assemblaggio e collegamento sono fasi successive che questo comando lascia da eseguire.",
        "attesi": [
          {
            "passo": 3,
            "campo": "File da esaminare",
            "valore": "hello.s"
          },
          {
            "passo": 2,
            "campo": "Prodotto richiesto",
            "valore": "hello.s"
          }
        ]
      }
    ]
  },
  "1.1.4": {
    "scopo": "Un percorso relativo descrive spostamenti a partire dalla directory in cui si trova il processo. Userai la stessa sequenza di nomi da due origini per capire da quali informazioni dipenda il file raggiunto.",
    "teoria": [
      "Il nome di un file identifica una voce all’interno di una directory, ossia una raccolta di nomi. Poiché anche una directory può comparire dentro un’altra, per raggiungere un file si può dover attraversare una successione di directory. Un percorso descrive questa successione separando i nomi con il carattere /.",
      "Prima di interpretare il primo nome bisogna stabilire da dove partire. Un processo è un programma durante la sua esecuzione; fra le informazioni che il sistema conserva per esso vi è la directory corrente. Anche la shell, il programma che interpreta i comandi digitati, possiede questa posizione di lavoro. Una barra iniziale nel percorso impone di partire dalla radice, origine dell’intero albero; quando manca, la ricerca parte dalla directory corrente. In questo albero il nome speciale «..» conduce alla directory che contiene quella raggiunta, mentre «.» conserva la posizione.",
      "Se la posizione iniziale è /home/lea/src, il percorso ../dati/./riga risale dapprima a /home/lea, entra in dati, conserva quella posizione al punto e raggiunge la voce riga. Cambiando il punto di partenza, le stesse indicazioni possono condurre altrove. Il percorso /tmp/../var/log, che comincia dalla radice, consente di seguire il caso opposto."
    ],
    "introduzione": [
      "L’attività mostra perché un percorso relativo acquisti significato solo insieme alla directory corrente, la cartella da cui il processo avvia la ricerca. Ogni componente separata da una barra indica un passo: un nome entra nella directory corrispondente, due punti risalgono al genitore e un punto conserva la posizione. Una barra iniziale fissa invece l’origine nella radice.",
      "Mantieni il percorso ../dati/./riga e carica il caso che parte dalla cartella personale. Avanza componente per componente, leggendo il cammino raggiunto sotto la figura. Confrontalo poi con il caso del progetto sul server: le stesse istruzioni conducono a due file diversi. Puoi infine applicare /tmp/../var/log e osservare che l’origine viene fissata dalla barra iniziale."
    ],
    "lettura": "La striscia superiore scompone il percorso nei nomi letti uno alla volta. Sotto compare il cammino già raggiunto, a partire dalla radice /; l’ultimo riquadro indica la posizione corrente dopo la componente evidenziata.",
    "conclusione": "Un nome relativo descrive un percorso a partire dalla directory corrente: quando questa cambia, lo stesso nome può individuare un file diverso. Il percorso assoluto fissa l’origine nella radice; qui si osserva una risoluzione lessicale, assumendo directory accessibili e prive di collegamenti simbolici.",
    "controlli": {
      "path": "Sequenza di componenti separate da /. Il nome .. risale al genitore, . conserva la posizione e la barra iniziale impone di partire dalla radice.",
      "cwd": "Directory corrente, usata come origine quando il percorso scelto è relativo."
    },
    "esperienze": [
      {
        "titolo": "Partire dalla cartella personale",
        "parametri": {
          "path": "../dati/./riga",
          "cwd": "/home/lea/src"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Percorso = ../dati/./riga; Directory corrente = /home/lea/src.",
          "Parti da /home/lea/src, risali con .. e aggiungi dati; il punto successivo conserva la directory raggiunta.",
          "Usa «Passo successivo» fino a «Componente dati». Leggi «Percorso raggiunto» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Componente riga». Confronta «Percorso raggiunto» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Componente riga» si leggono: Percorso raggiunto = /home/lea/dati/riga.",
        "ragionamento": "La componente .. elimina src dal cammino, portando a /home/lea. Dopo dati, il punto conserva /home/lea/dati e riga individua /home/lea/dati/riga.",
        "attesi": [
          {
            "passo": 4,
            "campo": "Percorso raggiunto",
            "valore": "/home/lea/dati/riga"
          },
          {
            "passo": 2,
            "campo": "Percorso raggiunto",
            "valore": "/home/lea/dati"
          }
        ]
      },
      {
        "titolo": "Partire dal progetto sul server",
        "parametri": {
          "path": "../dati/./riga",
          "cwd": "/srv/progetto/src"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Percorso = ../dati/./riga; Directory corrente = /srv/progetto/src.",
          "Applica gli stessi spostamenti a /srv/progetto/src e prevedi quale parte del percorso finale cambierà.",
          "Usa «Passo successivo» fino a «Componente dati». Leggi «Percorso raggiunto» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Componente riga». Confronta «Percorso raggiunto» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Componente riga» si leggono: Percorso raggiunto = /srv/progetto/dati/riga.",
        "ragionamento": "La risalita da /srv/progetto/src porta a /srv/progetto. Le componenti dati, . e riga conducono quindi a /srv/progetto/dati/riga, poiché il percorso iniziale era relativo.",
        "attesi": [
          {
            "passo": 4,
            "campo": "Percorso raggiunto",
            "valore": "/srv/progetto/dati/riga"
          },
          {
            "passo": 2,
            "campo": "Percorso raggiunto",
            "valore": "/srv/progetto/dati"
          }
        ]
      }
    ]
  },
  "1.1.5": {
    "scopo": "L’avvio di hello coinvolge una shell e un processo figlio. Seguirai il numero che identifica il figlio e il codice che esso restituisce, per capire quali informazioni rimangano costanti durante la sostituzione del programma.",
    "teoria": [
      "Un file eseguibile conserva le istruzioni di un programma. Ogni volta che quelle istruzioni vengono messe in esecuzione, il sistema operativo deve tener conto della memoria usata, della posizione raggiunta e delle risorse aperte. L’entità a cui appartengono queste informazioni si chiama processo. Il sistema le assegna un numero, il PID, con cui gli altri processi possono identificarla.",
      "La shell, l’interprete davanti al quale si digita un comando, è a sua volta un processo. Qui chiama fork per crearne un secondo, detto figlio. Al termine della chiamata il padre riceve il PID del figlio, mentre il figlio riceve zero. Quest’ultimo valore serve al programma per riconoscere il ramo in cui sta proseguendo. Il risultato zero letto dal figlio riguarda la chiamata fork; il suo identificativo rimane il PID assegnato dal sistema.",
      "Se la shell ha PID 700 e il figlio riceve 702, è ancora il processo 702 che esegue hello dopo la chiamata riuscita a execve. Quest’ultima sostituisce l’immagine del processo, cioè il programma e le aree di memoria predisposte per eseguirlo. Quando hello termina normalmente con codice 3, waitpid permette alla shell di raccogliere lo stato finale. Il numero 702 identifica chi è terminato; il codice 3 riferisce l’esito comunicato dal programma. Il significato del codice dipende dal programma, mentre il valore zero viene comunemente usato per segnalare il completamento riuscito."
    ],
    "introduzione": [
      "La simulazione aiuta a distinguere il programma conservato in un file dal processo che lo esegue. La shell crea un figlio mediante fork; execve sostituisce il programma del figlio conservandone il PID, il numero identificativo. Alla terminazione, waitpid permette al padre di raccogliere uno stato dal quale ricavare il codice di uscita comunicato dal programma.",
      "Carica il caso con PID 702 e codice 3. Avanza seguendo la corsia del figlio e confronta il PID restituito al padre con quello indicato dopo execve e alla raccolta finale. Fissa il risultato per confronto, quindi carica il caso con codice 0: osserva che cambia l’esito, mentre l’identità del processo resta 702."
    ],
    "lettura": "Le due corsie appartengono alla shell con PID 700 e al figlio con il PID scelto. Il ramo fork crea la seconda corsia; execve cambia il nome dell’immagine in quella corsia, mentre la freccia di waitpid riporta alla shell lo stato della terminazione.",
    "conclusione": "PID e codice di uscita hanno funzioni differenti: il primo identifica il processo, il secondo descrive l’esito comunicato dal programma. Nel percorso mostrato execve conserva il PID del figlio.",
    "controlli": {
      "pid": "Identificativo assegnato dal sistema al nuovo processo figlio; la shell rimane il processo 700.",
      "esito": "Valore che hello comunica terminando normalmente. La shell lo ricava dallo stato restituito da waitpid."
    },
    "esperienze": [
      {
        "titolo": "Il figlio termina con codice 3",
        "parametri": {
          "pid": 702,
          "esito": 3
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: PID assegnato al figlio = 702; Codice di uscita = 3.",
          "Annota 702 come PID del figlio e 3 come codice: prevedi quale dei due apparirà subito dopo execve.",
          "Usa «Passo successivo» fino a «Nuova immagine». Leggi «Immagine» e «PID dopo execve» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Raccolta». Confronta «PID raccolto» e «Codice» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Raccolta» si leggono: PID raccolto = 702; Codice = 3.",
        "ragionamento": "fork restituisce 702 alla shell e zero al figlio. execve sostituisce l’immagine del processo 702; alla terminazione waitpid identifica ancora 702 e permette di estrarre il codice 3.",
        "attesi": [
          {
            "passo": 2,
            "campo": "PID raccolto",
            "valore": "702"
          },
          {
            "passo": 2,
            "campo": "Codice",
            "valore": "3"
          },
          {
            "passo": 1,
            "campo": "Immagine",
            "valore": "hello"
          }
        ]
      },
      {
        "titolo": "Lo stesso figlio termina con codice 0",
        "parametri": {
          "pid": 702,
          "esito": 0
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: PID assegnato al figlio = 702; Codice di uscita = 0.",
          "Lascia il PID a 702 e porta il codice a zero; prevedi quale campo della raccolta cambierà.",
          "Usa «Passo successivo» fino a «Nuova immagine». Leggi «Immagine» e «PID dopo execve» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Raccolta». Confronta «PID raccolto» e «Codice» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Raccolta» si leggono: PID raccolto = 702; Codice = 0.",
        "ragionamento": "Il numero 702 accompagna lo stesso processo dalla creazione alla raccolta. Cambia soltanto il codice comunicato da hello, che ora vale 0; l’interpretazione di quel codice dipende dal programma.",
        "attesi": [
          {
            "passo": 2,
            "campo": "PID raccolto",
            "valore": "702"
          },
          {
            "passo": 2,
            "campo": "Codice",
            "valore": "0"
          },
          {
            "passo": 1,
            "campo": "Immagine",
            "valore": "hello"
          }
        ]
      }
    ]
  },
  "1.1.6": {
    "scopo": "La shell può collegare l’uscita dello stesso programma a destinazioni diverse. Osserverai il file esito prima e dopo hello per capire come la redirezione in coda modifichi il contenuto conservato.",
    "teoria": [
      "Il programma hello scrive sempre sullo stesso canale, l’uscita standard, che il sistema identifica con il descrittore 1. Un descrittore è un numero con cui il programma designa una risorsa aperta. Spetta alla shell, l’interprete del comando, preparare il collegamento prima di avviare hello. Per questo si può cambiare il luogo in cui apparirà il saluto agendo sulla riga di comando.",
      "Nel file esito si trovano già la lettera X e il segno di fine riga LF: due byte, scritti in esadecimale come 58 0A. Ogni coppia di cifre indica un byte; LF fa proseguire il testo sulla riga successiva. Con ./hello, che chiede di avviare il programma dalla directory corrente, l’uscita standard stdout resta collegata al terminale. La forma ./hello > esito chiede alla shell di aprire il file con troncamento, cioè azzerandone la lunghezza, così che la nuova scrittura parta dall’inizio.",
      "Il doppio segno >> apre il file per l’aggiunta in coda. Ai due byte già presenti seguono allora le cinque lettere di hello e il nuovo fine riga, per un totale di otto byte. Affiancando i contenuti finali si può risalire al lavoro svolto dalla shell ancor prima che il programma scrivesse il primo carattere."
    ],
    "introduzione": [
      "Questo esperimento rende visibile il rapporto fra redirezione della shell e contenuto di un file. hello emette sempre sei byte attraverso stdout, l’uscita identificata dal descrittore 1. La shell prepara la destinazione prima dell’esecuzione: il terminale mostra il testo, il segno > azzera il file e il segno >> aggiunge la nuova sequenza in coda.",
      "Carica «Scrivere sul terminale» e avanza fino all’osservazione finale, controllando i due byte iniziali del file esito. Confronta poi «Aggiungere in coda al file»: davanti ai sei byte di hello rimangono 58 0A, per un totale di otto. Seleziona infine il comando con > e applica i parametri per collegare il troncamento alla sequenza finale."
    ],
    "lettura": "Il riquadro fd 1 è l’uscita di hello. La freccia raggiunge il terminale oppure il file, rappresentato dalla fila di celle in basso; ogni coppia è un byte e 0A indica il fine riga.",
    "conclusione": "La shell prepara il collegamento prima della scrittura. La forma >> conserva i byte esistenti e aggiunge i nuovi; la lunghezza finale si ricava contando entrambe le sequenze, compresi i fine riga.",
    "controlli": {
      "modo": "Comando della shell: ./hello usa il terminale, > apre esito con troncamento, >> apre esito per l’aggiunta in coda."
    },
    "esperienze": [
      {
        "titolo": "Scrivere sul terminale",
        "parametri": {
          "modo": "term"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Comando = ./hello.",
          "Sei byte verranno scritti su fd 1: individua la sua destinazione e prevedi se il file di due byte verrà modificato.",
          "Usa «Passo successivo» fino a «Esecuzione di hello». Leggi «Byte scritti» e «Lunghezza» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Osservazione». Confronta «File esito» e «Byte nel file» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Osservazione» si leggono: File esito = 58 0A; Byte nel file = 2.",
        "ragionamento": "stdout è collegato al terminale, quindi i sei byte emessi raggiungono quel dispositivo. Il file esito conserva la sequenza iniziale 58 0A, lunga due byte.",
        "attesi": [
          {
            "passo": 2,
            "campo": "File esito",
            "valore": "58 0A"
          },
          {
            "passo": 2,
            "campo": "Byte nel file",
            "valore": "2"
          },
          {
            "passo": 1,
            "campo": "Byte scritti",
            "valore": "68 65 6C 6C 6F 0A"
          }
        ]
      },
      {
        "titolo": "Aggiungere in coda al file",
        "parametri": {
          "modo": "appendi"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Comando = ./hello >> esito.",
          "Conta i due byte iniziali 58 0A e i sei byte di hello seguito da LF; prevedi il loro ordine finale.",
          "Usa «Passo successivo» fino a «Esecuzione di hello». Leggi «Byte scritti» e «Lunghezza» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Osservazione». Confronta «File esito» e «Byte nel file» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Osservazione» si leggono: File esito = 58 0A 68 65 6C 6C 6F 0A; Byte nel file = 8.",
        "ragionamento": "La redirezione >> mantiene 58 0A e colloca dopo di essi 68 65 6C 6C 6F 0A. La somma 2 + 6 dà otto byte, conservati nello stesso ordine in cui i due testi sono stati scritti.",
        "attesi": [
          {
            "passo": 2,
            "campo": "File esito",
            "valore": "58 0A 68 65 6C 6C 6F 0A"
          },
          {
            "passo": 2,
            "campo": "Byte nel file",
            "valore": "8"
          },
          {
            "passo": 1,
            "campo": "Byte scritti",
            "valore": "68 65 6C 6C 6F 0A"
          }
        ]
      }
    ]
  },
  "1.1.7": {
    "scopo": "Una pipeline collega tre processi che producono, copiano e consumano un byte. Ricostruirai i collegamenti prima di seguire A, per riconoscere il ruolo dei due canali nel lavoro del processo intermedio.",
    "teoria": [
      "Quando un programma produce dati che un altro deve elaborare subito, la shell può collegarli mediante una pipe. La pipe è un canale che il sistema operativo mette a disposizione di due estremità, una alla quale si scrive e una dalla quale si legge. I dati vi transitano come sequenza di byte e il lettore li ritrova nell’ordine in cui sono stati scritti.",
      "La pipeline comprende tre processi, cioè tre programmi in esecuzione: il primo emette A, il secondo copia i byte che riceve e il terzo li legge. Ciascun processo dispone di un ingresso standard, chiamato standard input, dal quale ricevere normalmente dati, e di un’uscita standard alla quale consegnarli. La shell associa l’uscita del primo alla prima pipe e l’ingresso del secondo alla sua estremità di lettura. Una seconda pipe collega l’uscita del processo intermedio all’ingresso dell’ultimo.",
      "Se nella sequenza compare un programma che riceve un dato e lo inoltra, conviene considerare separatamente i suoi due collegamenti. Sul lato d’ingresso si cerca chi gli consegna il byte. Sul lato d’uscita si individua chi potrà riceverlo. Nella figura si può così seguire il percorso dello stesso dato anche quando i processi lavorano contemporaneamente."
    ],
    "introduzione": [
      "La ricostruzione permette di capire come una pipeline trasporti dati fra programmi in esecuzione. Una pipe è un canale con un’estremità di scrittura e una di lettura. Nella catena proposta, il processo centrale riceve il byte A dal primo e lo inoltra al terzo: ogni coppia di vicini richiede quindi un collegamento distinto.",
      "Leggi i dati iniziali e scrivi nel campo di previsione quante pipe servono per collegare i tre processi. Con «Passo successivo» raggiungi «Preparare i collegamenti», poi segui A nelle due letture. Confronta i due lati del processo centrale: l’ingresso riceve dalla prima pipe e l’uscita alimenta la seconda. Alla fine verifica la previsione contando i canali attraversati."
    ],
    "lettura": "Segui A lungo i riquadri dei tre processi e delle due pipe. La presenza del byte in un riquadro indica chi lo possiede in quella fase; il processo centrale riceve da un canale e scrive sull’altro.",
    "conclusione": "Una catena di tre processi richiede due collegamenti fra vicini. In generale una pipeline lineare di n processi usa n − 1 pipe, ciascuna con un’estremità di lettura e una di scrittura.",
    "procedura": [
      "Leggi i dati iniziali e indica i due collegamenti necessari: uscita del primo verso ingresso del secondo, uscita del secondo verso ingresso del terzo.",
      "Nel campo di previsione scrivi il numero di pipe che hai contato; poi avanza fino a «Preparare i collegamenti».",
      "In «Prima lettura» segui A dalla prima pipe al processo intermedio e identifica il suo ingresso.",
      "In «Seconda lettura» segui lo stesso byte fino al terzo processo e confronta «Pipe usate» con la previsione."
    ],
    "risultato": "Il terzo processo riceve A attraverso la seconda pipe. I tre processi sono collegati da due pipe.",
    "ragionamento": "Il primo confine fra processi richiede un canale, il secondo confine ne richiede un altro. Il processo centrale ha perciò ingresso e uscita collegati a due pipe distinte, mentre il contenuto che inoltra rimane il byte A."
  },
  "1.1.8": {
    "scopo": "La forma di una redirezione stabilisce come il nuovo testo si combini con il contenuto esistente. Nell’esercizio 4, traccia 1, ricostruirai il file byte per byte, contando anche i caratteri di fine riga.",
    "teoria": [
      "Un programma che stampa una riga consegna una sequenza di caratteri a un’uscita. Di solito la riga appare sul terminale. Quando si scrive un comando, si può però scegliere un file come destinazione. A interpretare questa scelta è la shell, il programma che riceve il comando dalla tastiera.",
      "Due segni maggiori consecutivi (>>) chiedono di scrivere in coda. Con un solo segno (>) la shell apre il file per riscriverlo dall’inizio e ne azzera il contenuto precedente. Quando printf emette i primi caratteri, la destinazione è quindi già pronta a riceverli.",
      "Nel caso proposto il file contiene A seguito dal fine riga LF, due byte. Il comando printf produce il testo descritto dal suo argomento: nella scrittura printf 'B\\n', la sequenza \\n richiede un fine riga dopo B. La consegna assume una shell conforme a POSIX, la specifica che definisce il comportamento dei comandi e delle redirezioni qui usati. printf emette quindi B e LF, altri due byte. Con >> la sequenza finale contiene A, LF, B, LF: quattro celle anche se sullo schermo i due byte LF producono soltanto il passaggio alla riga successiva."
    ],
    "introduzione": [
      "L’esercizio guidato serve a prevedere il contenuto di un file dopo una redirezione in coda. La shell interpreta >> e conserva i byte esistenti prima che printf produca la nuova uscita. Ogni fine riga LF occupa un byte, anche se sullo schermo appare come un cambio di riga: la lunghezza si calcola quindi sulla sequenza memorizzata.",
      "Premi «Carica l’esempio guidato» per aprire l’esercizio 4, traccia 1. Disponi su un foglio A e LF, poi B e LF, e inserisci il numero di byte previsto. Premi «Registra la previsione» e avanza nella ricostruzione. Confronta la sequenza finale 41 0A 42 0A con la traccia 2, che chiede di risalire alla redirezione osservando il file."
    ],
    "lettura": "Il disegno mette in sequenza contenuto iniziale, byte emessi dal comando e contenuto finale. Ogni cella rappresenta un byte; 0A corrisponde a LF e deve essere contato insieme alle lettere.",
    "conclusione": "Per ricostruire una redirezione si applica prima l’effetto dell’apertura e poi la scrittura. Con >> il contenuto già presente precede l’intera sequenza nuova.",
    "procedura": [
      "Premi «Carica l’esempio guidato»: si selezionano l’esercizio 4, «Interpretare gli effetti di una redirezione», e la traccia 1.",
      "Scrivi su un foglio i byte di A seguito da LF e quelli prodotti da printf con B seguito da LF; disponi le due coppie secondo >>.",
      "Inserisci la lunghezza prevista nel primo campo e premi «Registra la previsione»; percorri poi i tre passaggi della ricostruzione.",
      "Apri la prova completa per indicare anche la sequenza esadecimale e confrontala con la fila finale."
    ],
    "risultato": "Il file contiene quattro byte, nell’ordine 41 0A 42 0A.",
    "ragionamento": "La sequenza iniziale A e LF occupa 41 0A. printf produce B e LF, cioè 42 0A; >> conserva la prima coppia e accoda la seconda, portando la lunghezza da due a quattro byte."
  },
  "1.1.9": {
    "scopo": "Un file oggetto può contenere una chiamata il cui corpo verrà trovato durante il collegamento. Nell’esercizio 5, traccia 1, localizzerai un errore di simbolo irrisolto usando il prodotto che è già stato costruito.",
    "teoria": [
      "Chi scrive un programma in C può dividere il lavoro fra più file. Per tradurre una chiamata, il compilatore ha bisogno di conoscere il nome della funzione, gli argomenti che accetta e il tipo del risultato. Queste informazioni costituiscono la sua dichiarazione. Il corpo, che descrive le operazioni da eseguire, può trovarsi altrove. Un header è un file che raccoglie dichiarazioni da includere nei sorgenti che le usano.",
      "La prima traduzione produce un file oggetto che contiene istruzioni macchina. Per la chiamata a una funzione esterna contiene anche il suo nome, detto simbolo. Il collegatore raccoglie i file oggetto e usa quel nome per associare la chiamata alla funzione corretta nell’eseguibile.",
      "Se un file chiama una funzione chiamata doppio e un altro contiene la sua definizione, la compilazione separata del primo può riuscire. L’opzione -c chiede a GCC di fermarsi al file oggetto; perciò l’esistenza di hello.o segnala che quella costruzione è arrivata fino all’assemblaggio. Sarà il collegamento a richiedere il secondo oggetto, dal quale si ricava la destinazione della chiamata. Il messaggio undefined reference significa «riferimento privo di una definizione trovata»: invita a controllare gli oggetti e le librerie forniti al collegatore."
    ],
    "introduzione": [
      "Lo svolgimento mostra come localizzare un errore nella costruzione di un programma usando i prodotti già ottenuti. Una dichiarazione descrive come chiamare una funzione; la definizione ne fornisce il corpo. Il file oggetto può conservare un riferimento esterno, cioè il nome della funzione da associare al suo codice durante il collegamento che costruisce l’eseguibile.",
      "Carica l’esempio guidato dell’esercizio 5, traccia 1, e parti dal fatto che gcc -c ha prodotto hello.o. Avanza con «Passo successivo» confrontando dichiarazione, riferimento nell’oggetto e ricerca della definizione. Collega il messaggio «undefined reference» al passaggio finale; poi seleziona la traccia 2 per confrontare questo arresto con quello richiesto esplicitamente dall’opzione -S."
    ],
    "lettura": "La ricostruzione segue la chiamata dalla dichiarazione fino al riferimento conservato nell’oggetto. Il passaggio finale cerca la definizione che il collegatore deve associare al simbolo della funzione.",
    "conclusione": "La dichiarazione consente di tradurre la chiamata; per costruire l’eseguibile occorre anche fornire la definizione attraverso un oggetto o una libreria appropriata.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 5, «Localizzare una fase di costruzione», traccia 1.",
      "Leggi che gcc -c ha già prodotto hello.o e indica quali fasi devono quindi essere riuscite.",
      "Avanza nei passaggi distinguendo dichiarazione, riferimento esterno e ricerca della definizione.",
      "Al termine collega l’errore «undefined reference» alla fase che unisce gli oggetti e confronta l’azione correttiva proposta."
    ],
    "risultato": "Il problema emerge nel collegamento. L’azione pertinente è aggiungere l’oggetto che definisce la funzione.",
    "ragionamento": "Il compilatore conosce il tipo della funzione dalla dichiarazione e può produrre una chiamata con un riferimento esterno. L’oggetto conserva quel riferimento finché il collegatore trova il corpo della funzione in un altro oggetto o in una libreria."
  },
  "1.2.1": {
    "scopo": "La tensione su un filo diventa un simbolo binario solo dopo essere stata interpretata dal ricevitore. Confronterai un ingresso nella fascia incerta con un ingresso sulla soglia alta per capire dove la specifica garantisca il bit.",
    "teoria": [
      "Un filo collegato a un circuito porta una tensione elettrica che può assumere molti valori. Per trattarla come un bit, cioè una scelta fra zero e uno, il circuito che la riceve deve stabilire quali tensioni riconoscere con sicurezza. La misura si riferisce alla massa, il riferimento al quale qui si assegna la tensione di zero volt.",
      "I valori sulla scala sono espressi in millivolt, millesimi di volt. La soglia VIL indica la massima tensione per cui l’ingresso garantisce uno zero, qui 800 mV. La soglia VIH indica la minima tensione che garantisce un uno, qui 2000 mV. Anche un valore esattamente uguale alla rispettiva soglia appartiene alla fascia garantita.",
      "Un ingresso a 1200 mV cade fra i due limiti. Il ricevitore potrebbe reagire in modi diversi e la specifica lascia aperto l’esito logico. Portando la misura a 2000 mV si entra nella fascia alta. Il passaggio fra le regioni della scala mostra perché, per attribuire un bit a una tensione misurata, occorra conoscere le caratteristiche dell’ingresso."
    ],
    "introduzione": [
      "La simulazione chiarisce come un circuito interpreti una tensione elettrica come simbolo binario. Il ricevitore garantisce zero fino alla soglia VIL di 800 millivolt e uno dalla soglia VIH di 2000 millivolt. Fra questi limiti l’esito rimane indeterminato: attribuire un significato logico al valore misurato richiede dunque di conoscere le soglie del circuito che lo riceve.",
      "Carica «Un ingresso tra le soglie» e avanza dalla misura al confronto, localizzando 1200 mV sulla scala. Fissa l’esito per confronto, poi carica «Il limite della fascia alta». Osserva perché 2000 mV garantisce uno. Puoi applicare anche 800 mV e il valore immediatamente superiore disponibile per verificare l’inclusione del limite basso e l’ingresso nella fascia incerta."
    ],
    "lettura": "La scala orizzontale misura millivolt e la freccia indica l’ingresso scelto. Le tacche 800 e 2000 delimitano le fasce basso, indeterminato e alto; il risultato compare dopo il confronto con entrambe le soglie.",
    "conclusione": "Le soglie appartengono al ricevitore considerato. «Indeterminato» significa che la specifica lascia aperta la lettura: il modello identifica le fasce garantite e trascura il comportamento elettrico dettagliato nella zona intermedia.",
    "controlli": {
      "mv": "Tensione applicata rispetto alla massa, espressa in millivolt. Un volt equivale a 1000 mV; i passi di regolazione sono di 100 mV."
    },
    "esperienze": [
      {
        "titolo": "Un ingresso tra le soglie",
        "parametri": {
          "mv": 1200
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Tensione in ingresso (mV) = 1200.",
          "Confronta 1200 con 800 e 2000 e colloca la freccia nella fascia corrispondente.",
          "Usa «Passo successivo» fino a «Confronto». Leggi «VIL massimo» e «VIH minimo» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Decodifica». Confronta «Livello» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Decodifica» si leggono: Livello = indeterminato.",
        "ragionamento": "1200 mV supera il massimo basso di 800 mV e resta inferiore al minimo alto di 2000 mV. La specifica lascia quindi indeterminato il livello riconosciuto.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Livello",
            "valore": "indeterminato"
          },
          {
            "passo": 1,
            "campo": "VIL massimo",
            "valore": "800 mV"
          }
        ]
      },
      {
        "titolo": "Il limite della fascia alta",
        "parametri": {
          "mv": 2000
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Tensione in ingresso (mV) = 2000.",
          "Considera che il limite VIH è inclusivo: prevedi la lettura di un ingresso esattamente pari a 2000 mV.",
          "Usa «Passo successivo» fino a «Confronto». Leggi «VIL massimo» e «VIH minimo» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Decodifica». Confronta «Livello» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Decodifica» si leggono: Livello = 1.",
        "ragionamento": "La fascia alta comprende tutti gli ingressi da 2000 mV in su entro l’intervallo del modello. Un ingresso esattamente pari a VIH soddisfa la condizione e viene riconosciuto come uno.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Livello",
            "valore": "1"
          },
          {
            "passo": 1,
            "campo": "VIL massimo",
            "valore": "800 mV"
          }
        ]
      }
    ]
  },
  "1.2.2": {
    "scopo": "La posizione di un bit stabilisce il suo peso numerico. Sposterai l’unico uno presente nel byte di una posizione per collegare la figura binaria, la potenza di due e la scrittura esadecimale.",
    "teoria": [
      "Nella scrittura decimale un 1 può valere un’unità, una decina oppure un centinaio secondo la posizione che occupa. Nella scrittura binaria si usa lo stesso principio, con due cifre possibili, 0 e 1, e con un raddoppio del peso a ogni passo verso sinistra. Un bit è una di queste cifre. Otto bit accostati formano un byte.",
      "La numerazione delle posizioni comincia da zero, sul margine destro. I primi quattro pesi sono dunque 1, 2, 4 e 8. Nella parola 00001000 la sola cifra diversa da zero si trova in posizione 3, che pesa 2³, cioè 8. Gli zeri a sinistra conservano la larghezza di otto posizioni prevista dalla memoria. La notazione 2^k usata nei controlli equivale a 2 elevato a k: per k maggiore di zero moltiplica fra loro k fattori uguali a due; per k = 0 il peso è uno.",
      "La stessa parola ammette una trascrizione più breve in base sedici, detta esadecimale: le cifre sono 0–9 e A–F, dove le lettere valgono da dieci a quindici. Ogni gruppo di quattro bit occupa una cifra. Separando 0000 da 1000 si ricava 0x08; il prefisso 0x dichiara la base e resta esterno alle cifre del numero. Quando nella figura il bit attivo si sposta di una casella verso sinistra, il nuovo valore si prevede raddoppiando quello precedente."
    ],
    "introduzione": [
      "Con un solo bit acceso, l’esperimento rende evidente il legame fra posizione e valore. In un byte, formato da otto bit, l’indice zero appartiene alla cifra più a destra e ogni spostamento verso sinistra raddoppia il peso. Raggruppando quattro bit per volta si ottengono inoltre le due cifre esadecimali che rappresentano lo stesso byte.",
      "Carica «Il bit di peso otto» e avanza fino a vedere indice 3, peso 8 e scrittura 0x08. Confronta poi «Un passo verso sinistra»: il bit passa all’indice 4, il peso diventa 16 e la scrittura è 0x10. Usa le parentesi sotto le celle per spiegare il passaggio dalla cifra esadecimale bassa a quella alta."
    ],
    "lettura": "Le otto celle sono ordinate dal bit 7 a sinistra al bit 0 a destra. Sotto ciascuna appaiono il suo indice o il suo peso; le due parentesi raggruppano i bit nelle cifre esadecimali alta e bassa.",
    "conclusione": "Spostando un uno di una posizione verso sinistra si raddoppia il valore, finché la posizione resta nella larghezza disponibile. Quattro bit consecutivi corrispondono a una cifra esadecimale.",
    "controlli": {
      "k": "Indice dell’unico bit acceso. Il bit più a destra ha indice 0 e peso 1; l’indice k assegna il peso 2^k."
    },
    "esperienze": [
      {
        "titolo": "Il bit di peso otto",
        "parametri": {
          "k": 3
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Posizione del bit, contando da destra = 3.",
          "Partendo da peso 1, esegui tre raddoppi per prevedere il peso della posizione 3.",
          "Usa «Passo successivo» fino a «Peso». Leggi «Potenza» e «Peso» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Parola». Confronta «Binario» e «Esadecimale» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Parola» si leggono: Binario = 00001000; Esadecimale = 0x08.",
        "ragionamento": "La posizione 3 pesa 2³ = 8. Il gruppo alto 0000 vale 0 e quello basso 1000 vale 8, perciò il byte si scrive 0x08.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Binario",
            "valore": "00001000"
          },
          {
            "passo": 2,
            "campo": "Esadecimale",
            "valore": "0x08"
          },
          {
            "passo": 1,
            "campo": "Potenza",
            "valore": "2^3"
          }
        ]
      },
      {
        "titolo": "Un passo verso sinistra",
        "parametri": {
          "k": 4
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Posizione del bit, contando da destra = 4.",
          "Porta il bit alla posizione 4 e prevedi come cambieranno sia il valore sia il gruppo esadecimale che contiene l’uno.",
          "Usa «Passo successivo» fino a «Peso». Leggi «Potenza» e «Peso» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Parola». Confronta «Binario» e «Esadecimale» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Parola» si leggono: Binario = 00010000; Esadecimale = 0x10.",
        "ragionamento": "La posizione 4 pesa 2⁴ = 16, il doppio del caso precedente. L’uno entra nel gruppo alto: 0001 0000 si scrive 0x10 e rappresenta sedici.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Binario",
            "valore": "00010000"
          },
          {
            "passo": 2,
            "campo": "Esadecimale",
            "valore": "0x10"
          },
          {
            "passo": 1,
            "campo": "Potenza",
            "valore": "2^4"
          }
        ]
      }
    ]
  },
  "1.2.3": {
    "scopo": "Un valore di quattro byte deve essere distribuito su quattro indirizzi. Conserverai lo stesso numero cambiando la convenzione di scrittura, così da riconoscere il peso dei byte separatamente dalla posizione in memoria.",
    "teoria": [
      "Un numero di 32 bit occupa quattro byte, poiché ogni byte raccoglie otto cifre binarie. La memoria assegna un indirizzo distinto a ciascun byte. Per scrivere il numero occorre quindi stabilire quale delle quattro parti vada al primo indirizzo, quale al secondo e così via. La convenzione che fissa questo ordine permette a chi legge di ricostruire il valore. L’indirizzo è il numero che individua la cella; il peso indica invece il contributo del byte al valore complessivo. Poiché un byte ha 256 configurazioni, passando al byte successivo per significatività il peso viene moltiplicato per 256.",
      "Il prefisso 0x segnala la scrittura esadecimale, in cui due cifre bastano per un byte. In 0x12345678, il gruppo 78 contiene le posizioni di peso minore, mentre 12 contiene quelle di peso maggiore. In ordine little-endian, la memoria che parte da 0x1000 contiene, per indirizzi crescenti, 78, 56, 34 e 12.",
      "Nell’ordine big-endian si incontrano 12, 34, 56 e 78. I bit interni a ciascun gruppo conservano la loro disposizione. Per leggere la figura conviene dunque tenere distinti il verso in cui aumentano gli indirizzi e il peso che la convenzione attribuisce al byte selezionato."
    ],
    "introduzione": [
      "Questo laboratorio mostra come uno stesso numero venga distribuito fra più indirizzi di memoria. Una parola di 32 bit occupa quattro byte; la convenzione little-endian colloca quello meno significativo all’indirizzo più basso, mentre big-endian vi colloca quello più significativo. Il peso di un byte nel numero e la posizione della sua cella sono informazioni distinte.",
      "Carica il caso «Prima il byte meno significativo» e segui le frecce da 0x12345678 alle celle che iniziano a 0x1000. Fissa la disposizione per confronto, poi carica «Prima il byte più significativo». Leggi entrambe le righe per indirizzi crescenti e prosegui alla rilettura: cambia l’ordine delle quattro parti, mentre la parola ricostruita resta 0x12345678."
    ],
    "lettura": "La riga alta mostra i byte del numero dal più significativo al meno significativo. In basso gli indirizzi aumentano da 0x1000 a 0x1003; le frecce collegano ciascun byte alla cella scelta e si invertono durante la rilettura.",
    "conclusione": "L’ordine dei byte stabilisce quale parte del numero occupi l’indirizzo più basso. Usando la stessa convenzione per scrivere e rileggere si ricostruisce il medesimo valore in entrambi i casi.",
    "controlli": {
      "word": "Otto cifre esadecimali che rappresentano 32 bit, divisi in quattro byte. Ogni coppia di cifre occupa una cella.",
      "ordine": "Convenzione per la disposizione in memoria: little-endian colloca per primo il byte di peso minore, big-endian quello di peso maggiore."
    },
    "esperienze": [
      {
        "titolo": "Prima il byte meno significativo",
        "parametri": {
          "word": "12345678",
          "ordine": "little-endian"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Parola a 32 bit = 12345678; Ordine = little-endian.",
          "Scomponi 12345678 nelle coppie 12, 34, 56, 78; con little-endian individua la coppia da mettere a 0x1000.",
          "Usa «Passo successivo» fino a «Memoria». Leggi «0x1000» e «0x1001» e «0x1002» e «0x1003» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Rilettura». Confronta «Ordine» e «Parola ricostruita» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Rilettura» si leggono: Ordine = little-endian; Parola ricostruita = 0x12345678.",
        "ragionamento": "Il byte di peso minore è 78, seguito da 56, 34 e 12 per pesi crescenti. In memoria si legge quindi 78 56 34 12; assegnando quei pesi durante la rilettura si ricompone 0x12345678.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Ordine",
            "valore": "little-endian"
          },
          {
            "passo": 2,
            "campo": "Parola ricostruita",
            "valore": "0x12345678"
          },
          {
            "passo": 1,
            "campo": "0x1000",
            "valore": "78"
          },
          {
            "passo": 1,
            "campo": "0x1001",
            "valore": "56"
          },
          {
            "passo": 1,
            "campo": "0x1002",
            "valore": "34"
          },
          {
            "passo": 1,
            "campo": "0x1003",
            "valore": "12"
          }
        ]
      },
      {
        "titolo": "Prima il byte più significativo",
        "parametri": {
          "word": "12345678",
          "ordine": "big-endian"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Parola a 32 bit = 12345678; Ordine = big-endian.",
          "Conserva il valore 12345678 e assegna a 0x1000 la coppia che contiene le posizioni di peso maggiore.",
          "Usa «Passo successivo» fino a «Memoria». Leggi «0x1000» e «0x1001» e «0x1002» e «0x1003» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Rilettura». Confronta «Ordine» e «Parola ricostruita» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Rilettura» si leggono: Ordine = big-endian; Parola ricostruita = 0x12345678.",
        "ragionamento": "Big-endian dispone 12 34 56 78 per indirizzi crescenti. La prima cella contribuisce ai bit più alti, perciò la rilettura restituisce ancora 0x12345678.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Ordine",
            "valore": "big-endian"
          },
          {
            "passo": 2,
            "campo": "Parola ricostruita",
            "valore": "0x12345678"
          },
          {
            "passo": 1,
            "campo": "0x1000",
            "valore": "12"
          },
          {
            "passo": 1,
            "campo": "0x1001",
            "valore": "34"
          },
          {
            "passo": 1,
            "campo": "0x1002",
            "valore": "56"
          },
          {
            "passo": 1,
            "campo": "0x1003",
            "valore": "78"
          }
        ]
      }
    ]
  },
  "1.2.4": {
    "scopo": "Gli stessi otto bit possono rappresentare un numero oppure un carattere. Confronterai queste letture, includendo uno spazio, per capire perché il contenuto di una cella acquisti significato attraverso una convenzione.",
    "teoria": [
      "Una cella della memoria può conservare otto bit, cioè otto cifre che ammettono i valori 0 e 1. Quando le usa per rappresentare un intero senza segno, il programma assegna alle posizioni, a partire da destra, i pesi 1, 2, 4, 8 e così via. Somma poi soltanto i pesi delle posizioni in cui legge un uno.",
      "La sequenza 01000001 vale quindi 64 + 1, ossia 65. Se il programma sta trattando un testo, può usare questo numero per consultare la tabella ASCII, una convenzione che associa numeri a caratteri. Alla voce 65 trova la lettera A. La notazione esadecimale 0x41 è un’altra maniera di scrivere gli stessi otto bit.",
      "Si consideri anche il valore 32. Nella tabella dei caratteri indica uno spazio, che durante la stampa separa due parole pur senza lasciare un segno di inchiostro. Confrontando il numero della cella, i pesi e la voce della tabella, si riconosce il lavoro svolto dal programma per passare da una configurazione di bit al suo significato."
    ],
    "introduzione": [
      "L’attività serve a riconoscere il ruolo della convenzione nell’interpretazione dei dati. Gli otto bit di una cella possono essere letti come intero senza segno, sommando i pesi delle posizioni a uno, oppure come codice di un carattere ASCII. La configurazione rimane identica: cambia la regola con cui il programma attribuisce significato al byte.",
      "Carica «Il byte della lettera A» e avanza lungo i due percorsi della figura. Confronta 01000001, 0x41 e il valore 65, quindi osserva la lettera ottenuta consultando ASCII. Ripeti con «Il byte dello spazio»: il valore 32 identifica un carattere che occupa comunque un byte, benché nella stampa produca soltanto una separazione visiva."
    ],
    "lettura": "La fila superiore contiene gli otto bit della cella. Da essa partono due percorsi: la somma dei pesi produce l’intero, mentre la consultazione della tabella ASCII produce il carattere. Quando il codice seleziona uno spazio, il riquadro lo nomina «spazio» per renderlo riconoscibile.",
    "conclusione": "La rappresentazione numerica e quella testuale possono condividere lo stesso byte. Per decodificarlo occorre conoscere il tipo di informazione che il programma attribuisce alla cella.",
    "controlli": {
      "v": "Intero da 32 a 126, intervallo dei caratteri ASCII stampabili incluso lo spazio. Il modello mostra i suoi otto bit e il carattere associato."
    },
    "esperienze": [
      {
        "titolo": "Il byte della lettera A",
        "parametri": {
          "v": 65
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Valore della cella = 65.",
          "Nella parola 01000001 somma i pesi 64 e 1, poi cerca il carattere associato al totale.",
          "Usa «Passo successivo» fino a «Intero». Leggi «Addendi» e «Valore» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Carattere». Confronta «Carattere» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Carattere» si leggono: Carattere = A.",
        "ragionamento": "Le posizioni accese hanno pesi 64 e 1, quindi la lettura intera è 65. La tabella ASCII associa a 65 la lettera A, che si ritrova seguendo l’altro percorso.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Carattere",
            "valore": "A"
          },
          {
            "passo": 1,
            "campo": "Addendi",
            "valore": "1 + 64"
          }
        ]
      },
      {
        "titolo": "Il byte dello spazio",
        "parametri": {
          "v": 32
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Valore della cella = 32.",
          "Scrivi 32 come potenza di due e prevedi la posizione dell’unico bit; considera il carattere che separa due parole.",
          "Usa «Passo successivo» fino a «Intero». Leggi «Addendi» e «Valore» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Carattere». Confronta «Carattere» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Carattere» si leggono: Carattere = spazio.",
        "ragionamento": "Il peso 32 appartiene alla posizione 5 e dà la parola 00100000. ASCII assegna a questo numero lo spazio: la cella contiene un byte preciso anche quando la stampa lascia una distanza vuota.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Carattere",
            "valore": "spazio"
          },
          {
            "passo": 1,
            "campo": "Addendi",
            "valore": "32"
          }
        ]
      }
    ]
  },
  "1.2.5": {
    "scopo": "La conversione esadecimale-binario permette di leggere singolarmente i bit di un byte. Scomporrai 0xAD in due gruppi di quattro posizioni, verificando ogni cifra attraverso i suoi pesi.",
    "teoria": [
      "La scrittura esadecimale abbrevia le lunghe successioni di zeri e di uni. Le sue cifre da 0 a 9 hanno il valore abituale, mentre A, B, C, D, E e F indicano i valori da dieci a quindici. Poiché quattro posizioni binarie consentono sedici combinazioni, ciascuna cifra esadecimale si può tradurre in un gruppo di esattamente quattro bit. Il prefisso 0x, come in 0xAD, dichiara che le cifre successive sono esadecimali.",
      "Per esempio, in 0xAD la cifra A vale dieci e si scompone nei pesi 8 e 2, quindi si scrive 1010. Per D, che vale tredici, occorrono 8, 4 e 1, da cui 1101. Accostando i gruppi nello stesso ordine delle cifre si ottiene 10101101. Ogni gruppo conserva esattamente quattro posizioni.",
      "Nel problema si può applicare il procedimento a ciascuna cifra prima di riunire le due metà. Per verificare la trascrizione basta ripercorrere ogni gruppo da sinistra verso destra con i pesi 8, 4, 2 e 1. La somma deve restituire il valore della cifra dalla quale si è partiti."
    ],
    "introduzione": [
      "Il problema svolto rende comprensibile la corrispondenza fra una cifra esadecimale e quattro bit. Quattro posizioni binarie ammettono sedici combinazioni, tante quante le cifre da 0 a F. Convertire 0xAD significa quindi tradurre separatamente A e D usando i pesi 8, 4, 2 e 1, poi mantenere l’ordine dei due gruppi.",
      "Prima di avanzare, inserisci nel campo di previsione gli otto bit che attribuisci a 0xAD. Usa «Passo successivo» per separare le cifre e assegnare i pesi: A corrisponde a 8 + 2, D a 8 + 4 + 1. Confronta la parola ricomposta 10101101 con la tua previsione e riconverti ciascuna metà per controllare il risultato."
    ],
    "lettura": "I due gruppi mantengono l’ordine delle cifre A e D. Le posizioni in ciascun gruppo pesano 8, 4, 2 e 1; accostando i gruppi si ricostruisce la parola completa dal bit 7 al bit 0.",
    "conclusione": "Ogni cifra esadecimale corrisponde esattamente a quattro bit. La conversione conserva l’ordine dei gruppi e richiede anche gli zeri che completano ciascun gruppo.",
    "procedura": [
      "Leggi 0xAD e scrivi i valori decimali di A e D: dieci e tredici.",
      "Prevedi gli otto bit usando per ciascuna cifra i pesi 8, 4, 2 e 1; inserisci la parola nel campo di previsione.",
      "Avanza a «Assegnare i pesi» e verifica quali posizioni siano accese nei due gruppi.",
      "In «Ricomporre» unisci il gruppo di A a quello di D e rileggi il risultato per tornare alle due cifre iniziali."
    ],
    "risultato": "Il byte 0xAD si scrive 10101101 in binario.",
    "ragionamento": "A vale 10 = 8 + 2 e produce 1010. D vale 13 = 8 + 4 + 1 e produce 1101; mettendo il primo gruppo davanti al secondo si ottiene 10101101."
  },
  "1.2.6": {
    "scopo": "Raggruppare i bit evita di convertire un numero attraverso la base dieci. Nell’esercizio 3, traccia 1, dividerai una parola di otto bit e tradurrai separatamente i due gruppi in cifre esadecimali.",
    "teoria": [
      "Quando si scrive un numero in base due, ogni cifra può valere zero oppure uno. A partire da destra le posizioni pesano 1, 2, 4 e 8, cosicché con quattro cifre si rappresentano sedici valori. La scrittura esadecimale offre appunto sedici simboli, che vanno da 0 a 9 e poi da A a F. Le lettere A, B, C, D, E e F valgono rispettivamente 10, 11, 12, 13, 14 e 15.",
      "Nel numero esadecimale la prima cifra a destra ha peso uno, la successiva ha peso sedici. Poiché sedici è la potenza quarta di due, salire di una posizione in esadecimale equivale a salire di quattro posizioni in binario. Ecco perché i gruppi si formano cominciando da destra.",
      "La parola 10110110 comprende il gruppo alto 1011 e quello basso 0110. Il primo vale 8 + 2 + 1 = 11 e si indica con B; il secondo vale 4 + 2 = 6. La medesima parola si scrive quindi B6. In una sequenza più corta, eventuali zeri aggiunti a sinistra per completare un gruppo lasciano intatti i pesi delle altre cifre."
    ],
    "introduzione": [
      "Questa esercitazione permette di passare direttamente dai bit alla scrittura esadecimale conservando il valore. Poiché 16 equivale a 2⁴, ogni gruppo di quattro bit rappresenta una cifra. Il raggruppamento parte dal lato destro, dove si trova il peso uno; eventuali zeri di completamento si aggiungono a sinistra, lasciando intatti i pesi già assegnati.",
      "Carica l’esempio guidato dell’esercizio 3, traccia 1, e separa 10110110 in gruppi di quattro. Registra il numero di gruppi previsto, poi avanza e calcola i valori di 1011 e 0110. Confronta B6 con la parola iniziale. Seleziona quindi la traccia 2 per osservare perché aggiungere zeri a destra altera il valore durante la conversione."
    ],
    "lettura": "La divisione in gruppi segue quattro posizioni consecutive, cominciando dal lato destro. I pesi scritti sotto i bit permettono di ricavare il valore di ciascun gruppo prima di scegliere la cifra.",
    "conclusione": "La corrispondenza fra quattro bit e una cifra esadecimale deriva da 16 = 2⁴. Raggruppare da destra mantiene l’allineamento dei pesi anche per parole che richiedono zeri iniziali.",
    "procedura": [
      "Premi «Carica l’esempio guidato» e verifica l’esercizio 3, «Raggruppare i bit in cifre esadecimali», traccia 1.",
      "Separa 10110110 in due gruppi di quattro bit partendo da destra; registra il numero di gruppi previsto.",
      "Avanza e somma i pesi di 1011 e di 0110 separatamente.",
      "Apri la prova completa per scegliere la scrittura esadecimale e controlla che, riconvertendola, si riottengano tutti gli otto bit."
    ],
    "risultato": "Occorrono due gruppi e la scrittura esadecimale è B6.",
    "ragionamento": "Il gruppo 1011 vale 8 + 2 + 1 = 11, rappresentato dalla cifra B. Il gruppo 0110 vale 4 + 2 = 6; mantenendo l’ordine si forma B6."
  },
  "1.2.7": {
    "scopo": "La capacità di una stringa C deve comprendere sia la codifica del testo sia il terminatore. Nell’esercizio 5, traccia 1, ricostruirai la memoria necessaria per Aè, distinguendo lettere, byte e celle allocate.",
    "teoria": [
      "Un carattere appartiene al testo che si legge. Un byte è invece un gruppo di otto bit che la memoria può conservare a un indirizzo. Per riservare lo spazio occorrente a una parola serve conoscere la regola con cui i caratteri vengono tradotti in byte.",
      "UTF-8 è una regola per scrivere il testo in byte. Una lettera latina senza accento vi occupa un byte, mentre molti altri caratteri ne richiedono due o più. Il buffer è la porzione di memoria riservata a questi byte; la sua capacità è il numero di celle disponibili. Una stringa C termina con NUL, un byte di valore zero scritto 00, che va contato nella capacità. Questo valore serve da segnale di fine: la cifra stampabile «0» possiede invece un proprio codice testuale.",
      "Unicode identifica un carattere mediante un numero chiamato punto di codice. Nel caso proposto «è» è il carattere U+00E8, il cui numero è scritto in base sedici dopo U+. La parola «Aè» contiene così due punti di codice e occupa tre byte in UTF-8: 41 C3 A8. Per conservarla come stringa C occorre una quarta cella per lo zero finale, grazie al quale una funzione può individuare la fine del testo."
    ],
    "introduzione": [
      "La ricostruzione aiuta a dimensionare la memoria necessaria a una stringa C. Il numero di caratteri del testo e il numero di byte della codifica UTF-8 sono quantità diverse: A richiede un byte, è ne richiede due. Il buffer, cioè l’area riservata alla stringa, deve contenere anche NUL, il byte zero che segnala la fine.",
      "Premi «Carica l’esempio guidato» e controlla l’esercizio 5, traccia 1. Avanza disponendo 41 per A e C3 A8 per è, poi osserva la cella finale 00. Confronta i tre byte del testo con le quattro celle richieste. Nella traccia 2 applica lo stesso conteggio ad A€B e verifica quale prefisso entra nel buffer disponibile."
    ],
    "lettura": "La fila contiene una cella per ciascun byte della codifica e una cella finale 00. I gruppi del testo mostrano che A occupa una cella ed è ne occupa due; il terminatore stabilisce dove le funzioni della stringa si fermano.",
    "conclusione": "Il numero di caratteri, la lunghezza UTF-8 e la capacità del buffer misurano quantità diverse. Il terminatore C aggiunge un byte alla lunghezza codificata del testo.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per aprire l’esercizio 5, «Dimensionare un buffer per il testo», traccia 1.",
      "Assegna 41 ad A e C3 A8 a è, disponendo una casella per ciascun byte.",
      "Avanza nello svolgimento e aggiungi la casella 00 del terminatore dopo il testo.",
      "Confronta i due campi finali: byte del testo e capacità minima del buffer."
    ],
    "risultato": "Il testo Aè occupa tre byte; la stringa C richiede una capacità minima di quattro byte.",
    "ragionamento": "La codifica UTF-8 è 41 C3 A8: un byte per A e due per è. Il terminatore 00 occupa una quarta cella, pur essendo escluso dal conteggio dei byte del testo."
  },
  "1.3.1": {
    "scopo": "Una cifra ricevuta come testo possiede un codice diverso dal valore che servirà in un calcolo. Seguirai la sottrazione dal codice di zero per trasformare il byte della cifra in un intero.",
    "teoria": [
      "Se si digita 7 sulla tastiera, un programma che acquisisce testo può ricevere il carattere «7». Per eseguire una moltiplicazione per sette deve prima ricavare il numero indicato da quel segno. La tabella ASCII assegna infatti un codice a ogni cifra, proprio come assegna un codice alle lettere e ai segni di punteggiatura.",
      "Nella tabella, la cifra «0» ha codice 48 e le nove cifre successive occupano posizioni consecutive. La cifra «7» ha dunque codice 55. Poiché il numero che interessa è la distanza dal primo elemento della successione, basta calcolare 55 − 48 per ottenere 7. Questa regola si applica dopo avere accertato che il carattere appartenga all’intervallo delle cifre. In questo caso il controllo consiste nel verificare che il codice sia almeno 48 e al massimo 57, le posizioni assegnate a «0» e «9».",
      "In memoria si incontrerà 0x37, dove 0x introduce la base sedici e 3 × 16 + 7 dà appunto 55. Seguendo prima il byte e poi la sottrazione si possono distinguere i due usi dello stesso ingresso, la conservazione di un testo leggibile e la preparazione di un valore sul quale calcolare."
    ],
    "introduzione": [
      "La simulazione permette di distinguere il codice di una cifra dal numero che essa rappresenta. In ASCII i caratteri da «0» a «9» occupano dieci posizioni consecutive a partire da 48. Una volta verificata l’appartenenza a questo intervallo, sottrarre il codice di «0» restituisce il valore della cifra da impiegare nei calcoli.",
      "Carica «Convertire il carattere zero» e confronta il carattere 0 con il byte 0x30 e l’intero 48. Avanza fino alla sottrazione, poi carica il caso del carattere sette. Osserva la distanza sulla fila ASCII e ricostruisci 55 − 48 = 7: il risultato numerico nasce dalla conversione del codice che conserva il testo."
    ],
    "lettura": "La fila mostra i caratteri da 0 a 9 con i rispettivi codici ASCII. La parentesi misura la distanza dalla voce zero; i riquadri separano il codice conservato e il valore ottenuto dopo la conversione.",
    "conclusione": "I codici ASCII delle cifre sono consecutivi. Dopo aver verificato che il carattere sia una cifra, la sua distanza dal codice di 0 restituisce il valore decimale corrispondente.",
    "controlli": {
      "n": "Cifra che viene prima codificata come carattere ASCII. Il controllo seleziona il simbolo testuale da cui il lettore ricaverà il valore numerico."
    },
    "esperienze": [
      {
        "titolo": "Convertire il carattere zero",
        "parametri": {
          "n": 0
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Cifra decimale = 0.",
          "Il carattere 0 ha codice 48: prevedi la differenza fra questo codice e il codice di 0 stesso.",
          "Usa «Passo successivo» fino a «Lettura senza segno». Leggi «Intero» e «Bit» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Conversione della cifra». Confronta «Sottrazione» e «Risultato» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Conversione della cifra» si leggono: Sottrazione = 48 − 48; Risultato = 0.",
        "ragionamento": "Il byte del carattere 0 è 0x30, cioè 48. Sottraendo il codice iniziale 48 si ottiene 0, il valore da usare nei calcoli.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Sottrazione",
            "valore": "48 − 48"
          },
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "0"
          },
          {
            "passo": 1,
            "campo": "Intero",
            "valore": "48"
          }
        ]
      },
      {
        "titolo": "Convertire il carattere sette",
        "parametri": {
          "n": 7
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Cifra decimale = 7.",
          "Parti da 48 e conta sette posizioni nella tabella; prevedi il codice del carattere prima della sottrazione.",
          "Usa «Passo successivo» fino a «Lettura senza segno». Leggi «Intero» e «Bit» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Conversione della cifra». Confronta «Sottrazione» e «Risultato» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Conversione della cifra» si leggono: Sottrazione = 55 − 48; Risultato = 7.",
        "ragionamento": "La cifra 7 è sette posizioni dopo 0 e ha codice 48 + 7 = 55, cioè 0x37. Il calcolo 55 − 48 restituisce 7.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Sottrazione",
            "valore": "55 − 48"
          },
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "7"
          },
          {
            "passo": 1,
            "campo": "Intero",
            "valore": "55"
          }
        ]
      }
    ]
  },
  "1.3.2": {
    "scopo": "Un carattere UTF-8 può occupare più byte, ciascuno dei quali contiene un prefisso e una parte dell’informazione. Ricostruirai il numero Unicode da quei gruppi per capire come una sequenza di byte torni a essere un carattere.",
    "teoria": [
      "Perché una lettera sopravviva al passaggio fra due macchine, occorre che entrambe sappiano identificarla. Unicode assegna ai caratteri numeri chiamati punti di codice e li scrive nella forma U+ seguita dal numero in base sedici. UTF-8 stabilisce come rappresentare ciascuno di questi numeri con uno, due, tre o quattro byte. Ogni byte contiene otto bit, cifre binarie che valgono zero oppure uno.",
      "L’inizio del primo byte, detto prefisso, annuncia la lunghezza della sequenza: 0 introduce un solo byte, 110 due byte, 1110 tre e 11110 quattro. I byte che seguono iniziano con 10 e sono detti continuazioni. Tolti i prefissi, rimangono i bit che compongono il numero Unicode. L’accumulatore è il valore parziale nel quale questi gruppi vengono riuniti durante la lettura.",
      "Per «è» si ricevono i byte C3 A8, qui scritti con due cifre esadecimali ciascuno. In binario C3 si legge 11000011. L’inizio 110 annuncia una sequenza di due byte e lascia il gruppo utile 00011, che vale 3. A8 si legge 10101000. Le prime due cifre, 10, segnalano una continuazione, mentre le ultime sei, 101000, valgono 40.",
      "Per accostare i due gruppi si fa spazio a sei cifre binarie moltiplicando 3 per 64, poi si aggiunge 40. Si ottiene 232, che in esadecimale è E8 e identifica U+00E8. Scegliendo un simbolo che richiede più byte, si può seguire lo stesso accumulatore mentre incorpora altri gruppi di sei bit."
    ],
    "introduzione": [
      "Il laboratorio mostra come ricostruire un carattere Unicode dai byte della sua codifica UTF-8. Unicode identifica il carattere mediante un numero, detto punto di codice. I prefissi dei byte indicano la lunghezza e le continuazioni; i bit rimanenti trasportano il numero. Un accumulatore raccoglie progressivamente questi gruppi, moltiplicando il valore precedente per 64 a ogni continuazione.",
      "Carica «Due byte per è» e avanza distinguendo i prefissi dai gruppi utili di C3 A8. Segui l’accumulatore da 3 a 232 mediante 3 × 64 + 40. Confronta poi il caso di €: la sequenza E2 82 AC richiede due continuazioni e porta a 8364. Interpreta l’aumento dei passaggi come conseguenza della maggiore lunghezza della codifica."
    ],
    "lettura": "Ogni byte è scritto sopra i suoi otto bit. Le parti iniziali meno evidenti sono prefissi; i gruppi utili confluiscono nell’accumulatore in basso. A ogni continuazione il valore precedente si sposta di sei bit e incorpora il nuovo gruppo.",
    "conclusione": "UTF-8 distribuisce il punto di codice fra gruppi di bit utili. Il percorso mostrato decodifica caratteri già validi; un lettore di dati esterni deve anche verificare prefissi, numero di continuazioni e intervallo del punto di codice.",
    "controlli": {
      "lettera": "Carattere da codificare e poi rileggere. Le scelte richiedono da uno a quattro byte e permettono di osservare un diverso numero di continuazioni."
    },
    "esperienze": [
      {
        "titolo": "Due byte per è",
        "parametri": {
          "lettera": "è"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Carattere = è.",
          "In C3 conserva 00011 e in A8 conserva 101000; prevedi il valore di 3 × 64 + 40.",
          "Usa «Passo successivo» fino a «Continuazione 0xA8». Leggi «Calcolo» e «Accumulatore» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Carattere». Confronta «Punto di codice» e «Carattere» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Carattere» si leggono: Punto di codice = U+00E8; Carattere = è.",
        "ragionamento": "C3 lascia il gruppo utile 00011, pari a 3, mentre A8 lascia 101000, pari a 40. Accostare i gruppi equivale a 3 × 64 + 40 = 232, ossia U+00E8.",
        "attesi": [
          {
            "passo": 3,
            "campo": "Punto di codice",
            "valore": "U+00E8"
          },
          {
            "passo": 3,
            "campo": "Carattere",
            "valore": "è"
          },
          {
            "passo": 2,
            "campo": "Calcolo",
            "valore": "3 × 64 + 40"
          }
        ]
      },
      {
        "titolo": "Tre byte per il simbolo euro",
        "parametri": {
          "lettera": "€"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Carattere = €.",
          "Segui i tre byte E2 82 AC: dopo il prefisso, ogni nuova continuazione aggiunge sei posizioni utili all’accumulatore.",
          "Usa «Passo successivo» fino a «Continuazione 0x82». Leggi «Calcolo» e «Accumulatore» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Carattere». Confronta «Punto di codice» e «Carattere» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Carattere» si leggono: Punto di codice = U+20AC; Carattere = €.",
        "ragionamento": "E2 lascia 2; 82 aggiunge il gruppo 2, portando l’accumulatore a 130. AC aggiunge 44 e si ottiene 130 × 64 + 44 = 8364, cioè U+20AC, il simbolo euro.",
        "attesi": [
          {
            "passo": 4,
            "campo": "Punto di codice",
            "valore": "U+20AC"
          },
          {
            "passo": 4,
            "campo": "Carattere",
            "valore": "€"
          },
          {
            "passo": 2,
            "campo": "Calcolo",
            "valore": "2 × 64 + 2"
          }
        ]
      }
    ]
  },
  "1.3.3": {
    "scopo": "Una registrazione PCM conserva una misura per ciascun canale a ogni istante di campionamento. Confronterai due profondità di campione mantenendo fissi frequenza e canali, per ricavare lo spazio occupato in un secondo.",
    "teoria": [
      "Per registrare un suono si misura l’ampiezza del segnale, cioè il suo valore istantaneo, a intervalli regolari. Il numero assegnato a una misura prende il nome di campione. Nell’audio PCM lineare, dall’inglese Pulse Code Modulation, ogni campione viene scritto con un numero prestabilito di bit. La frequenza di campionamento indica quanti istanti di misura si susseguono in un secondo per ciascun canale; l’unità Hz equivale qui a un campione al secondo per canale. Nelle etichette della figura B significa byte, composto da otto bit.",
      "Una registrazione stereo ha due canali, uno per il segnale sinistro e uno per il destro. Se ciascun campione usa 16 bit, per conservarlo servono due byte, poiché un byte contiene otto bit. A ogni istante si scrivono quindi quattro byte. Alla frequenza di 48 000 istanti al secondo si ottengono 48 000 × 4, ossia 192 000 byte di campioni.",
      "I tre fattori hanno effetti distinguibili. La frequenza stabilisce quante volte si ripete la misura, il numero di canali stabilisce quanti valori si raccolgono insieme e la profondità in bit stabilisce quanto spazio occupa ciascuno. Il conteggio termina con l’ultimo campione e riguarda un secondo di dati audio contigui."
    ],
    "introduzione": [
      "L’esperimento serve a calcolare lo spazio occupato da un secondo di audio PCM, nel quale ogni misura del segnale è conservata come campione. La frequenza indica quanti istanti si registrano per secondo e per canale; la profondità stabilisce i bit di ciascun campione. Il prodotto fra frequenza, canali e byte per campione determina la dimensione dei dati.",
      "Carica «Stereo a sedici bit» e avanza dal singolo campione all’istante multicanale, poi al secondo completo. Verifica che due byte per ciascuno dei due canali producano quattro byte per istante. Confronta il caso a ventiquattro bit mantenendo 48000 istanti e due canali: il totale passa da 192000 a 288000 byte, perché ogni campione occupa tre byte."
    ],
    "lettura": "Ogni riga C1, C2 e così via rappresenta un canale; ogni colonna rappresenta uno stesso istante. I riquadri a destra separano i byte di un campione dai byte di un istante multicanale; il prodotto finale ripete quell’istante tante volte quante indica la frequenza. Le colonne disegnate sono un piccolo estratto del tempo: il numero completo di istanti del secondo compare nel prodotto finale.",
    "conclusione": "La dimensione dei soli campioni PCM è frequenza × canali × bit per campione / 8 × durata. Qui la durata è un secondo e i dati sono contigui; un eventuale contenitore aggiungerebbe la propria intestazione.",
    "controlli": {
      "hz": "Numero di campioni acquisiti in un secondo per ciascun canale. Aumentando la frequenza aumenta il numero di colonne temporali da memorizzare.",
      "canali": "Numero di segnali misurati nello stesso istante; stereo corrisponde a due canali.",
      "bit": "Numero di bit usati per un campione di un singolo canale. Dividendo per otto si ottengono i byte occupati."
    },
    "esperienze": [
      {
        "titolo": "Stereo a sedici bit",
        "parametri": {
          "hz": "48000",
          "canali": 2,
          "bit": "16"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Campioni al secondo per canale = 48000; Canali = 2; Bit per campione = 16.",
          "Dividi 16 per 8 e moltiplica per due canali; usa il risultato per prevedere i byte di 48000 istanti.",
          "Usa «Passo successivo» fino a «Istante multicanale». Leggi «Canali» e «Byte per istante» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Un secondo». Confronta «Istanti in un secondo» e «Dimensione» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Un secondo» si leggono: Istanti in un secondo = 48000; Dimensione = 192000 B.",
        "ragionamento": "Un campione di 16 bit occupa 2 byte. Due canali richiedono 4 byte per istante e 48000 × 4 = 192000 byte per un secondo.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Istanti in un secondo",
            "valore": "48000"
          },
          {
            "passo": 2,
            "campo": "Dimensione",
            "valore": "192000 B"
          },
          {
            "passo": 1,
            "campo": "Canali",
            "valore": "2"
          }
        ]
      },
      {
        "titolo": "Stereo a ventiquattro bit",
        "parametri": {
          "hz": "48000",
          "canali": 2,
          "bit": "24"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Campioni al secondo per canale = 48000; Canali = 2; Bit per campione = 24.",
          "Conserva due canali e 48000 campioni al secondo, portando ciascun campione a tre byte.",
          "Usa «Passo successivo» fino a «Istante multicanale». Leggi «Canali» e «Byte per istante» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Un secondo». Confronta «Istanti in un secondo» e «Dimensione» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Un secondo» si leggono: Istanti in un secondo = 48000; Dimensione = 288000 B.",
        "ragionamento": "Con 24 bit un campione occupa 3 byte e l’istante stereo ne occupa 6. Il totale diventa 48000 × 6 = 288000 byte, un aumento del 50% dovuto alla maggiore larghezza del campione.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Istanti in un secondo",
            "valore": "48000"
          },
          {
            "passo": 2,
            "campo": "Dimensione",
            "valore": "288000 B"
          },
          {
            "passo": 1,
            "campo": "Canali",
            "valore": "2"
          }
        ]
      }
    ]
  },
  "1.3.4": {
    "scopo": "Un prefisso può dichiarare un campo più lungo dei dati effettivamente ricevuti. Confronterai una copia troncata con una completa, seguendo il cursore per capire quando sia possibile consumare il campo.",
    "teoria": [
      "Un messaggio può contenere più parti, dette campi, ciascuna con un significato stabilito dal formato. Quando un campo ha lunghezza variabile, chi lo invia può scriverne la lunghezza prima del contenuto: questo valore iniziale è il prefisso. Il destinatario ricava così il confine atteso del campo e l’inizio del successivo. Ogni posizione contiene un byte, gruppo di otto bit, e i byte arrivati vengono raccolti in una zona di memoria detta buffer. Consumare un campo significa averne accettato tutti i byte e spostare il cursore oltre il suo confine.",
      "Qui il primo byte dichiara quanti byte dovrebbe occupare il campo. Una volta letta la dichiarazione, il cursore vale 1, poiché indica la posizione del primo byte ancora da consumare, contando da zero. Se la lunghezza dichiarata è 6 e dopo il prefisso sono arrivati 5 byte, il calcolo 6 − 5 indica che ne manca uno.",
      "La figura permette di separare la promessa contenuta nel prefisso dalla disponibilità effettiva. Nel caso incompleto il lettore conserva il cursore all’inizio del campo. Se riceve tutti e sei i byte, può invece superare il campo in un solo passo e portare il cursore a 7, posizione dalla quale riprenderebbe una lettura successiva."
    ],
    "introduzione": [
      "La simulazione insegna a verificare un campo prima di accettarne il contenuto. Il prefisso è il byte iniziale che dichiara la lunghezza attesa; il buffer contiene invece i byte effettivamente ricevuti. Il cursore indica la prima posizione ancora da consumare. Confrontare lunghezza richiesta e disponibilità consente di decidere se il lettore può oltrepassare il campo.",
      "Carica «Manca l’ultimo byte» e avanza dalla lettura del prefisso 06 alla misura del residuo. Confronta i sei byte richiesti con i cinque presenti e osserva il cursore fermo a 1. Carica quindi «Il campo arriva completo»: con sei byte disponibili, il cursore raggiunge 7. Usa la tacca di fine buffer per distinguere dati ricevuti e posizioni soltanto attese."
    ],
    "lettura": "La prima cella contiene la lunghezza dichiarata. La tacca verticale segna il limite dei byte presenti e la parentesi la lunghezza richiesta; il triangolo individua la prima posizione ancora da consumare. Le posizioni oltre la tacca servono a visualizzare il campo richiesto; i byte ricevuti terminano alla tacca.",
    "conclusione": "La lunghezza dichiarata è una richiesta da verificare contro la disponibilità reale. Il cursore supera il campo solo quando tutti i suoi byte sono presenti, così una lettura successiva parte da un confine corretto.",
    "controlli": {
      "n": "Numero di byte che il prefisso dichiara per il contenuto, escluso il prefisso stesso.",
      "presenti": "Byte realmente disponibili dopo il prefisso. Il buffer totale comprende anche il byte iniziale che dichiara la lunghezza."
    },
    "esperienze": [
      {
        "titolo": "Manca l’ultimo byte",
        "parametri": {
          "n": 6,
          "presenti": 5
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Lunghezza dichiarata (byte) = 6; Byte presenti dopo il prefisso = 5.",
          "Il prefisso richiede sei byte e ne sono presenti cinque: prevedi quanto manca e dove dovrà restare il cursore.",
          "Usa «Passo successivo» fino a «Limite». Leggi «Dimensione totale» e «Residuo» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Decisione». Confronta «Byte mancanti» e «Cursore finale» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Decisione» si leggono: Byte mancanti = 1; Cursore finale = 1.",
        "ragionamento": "Dopo il prefisso il cursore vale 1. Sei byte richiesti superano i cinque disponibili, quindi manca un byte e il cursore resta a 1 in attesa del campo completo.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Byte mancanti",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Cursore finale",
            "valore": "1"
          },
          {
            "passo": 1,
            "campo": "Dimensione totale",
            "valore": "6"
          }
        ]
      },
      {
        "titolo": "Il campo arriva completo",
        "parametri": {
          "n": 6,
          "presenti": 6
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Lunghezza dichiarata (byte) = 6; Byte presenti dopo il prefisso = 6.",
          "Con sei byte disponibili, aggiungi il prefisso per prevedere la posizione immediatamente successiva al campo.",
          "Usa «Passo successivo» fino a «Limite». Leggi «Dimensione totale» e «Residuo» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Decisione». Confronta «Byte mancanti» e «Cursore finale» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Decisione» si leggono: Byte mancanti = 0; Cursore finale = 7.",
        "ragionamento": "La disponibilità coincide con la richiesta di sei byte. Consumandoli dalla posizione 1 il cursore raggiunge 1 + 6 = 7; il conteggio dei byte mancanti scende a zero.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Byte mancanti",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Cursore finale",
            "valore": "7"
          },
          {
            "passo": 1,
            "campo": "Dimensione totale",
            "valore": "7"
          }
        ]
      }
    ]
  },
  "1.3.5": {
    "scopo": "Per interpretare un campo di due byte occorre stabilirne posizione, completezza e ordine. Leggerai la stessa coppia con le due convenzioni per separare il valore ricostruito dal numero di byte consumati.",
    "teoria": [
      "Un buffer è una zona di memoria che conserva una sequenza di byte; un array ne organizza gli elementi in posizioni successive. Il formato suddivide la sequenza in campi, ciascuno con una larghezza e un significato. Per un intero senza segno di sedici bit servono due byte contigui, poiché ogni byte contiene otto bit. Il cursore indica l’offset del primo, ossia il numero di byte che lo separano dall’inizio del buffer. Prima della conversione il lettore verifica che anche la posizione successiva appartenga ai dati ricevuti.",
      "Nel buffer 41 01 02 FF, dove ogni coppia è un byte in base sedici, le posizioni si contano da zero. Alla posizione 1 comincia la coppia 01 02. Per assegnarle un valore bisogna sapere quale byte ha peso 256. Con la convenzione big-endian quel peso spetta al primo, per cui si ricava 1 × 256 + 2 = 258. Con little-endian spetta al secondo, per cui si ottiene 513. Il peso 256 deriva da 2⁸: spostarsi di un byte nel numero significa spostarsi di otto posizioni binarie.",
      "Una lettura riuscita ha consumato due byte e il cursore passa da 1 a 3 qualunque sia l’ordine scelto. Partendo da 3 resta disponibile soltanto FF. In quel punto la traccia si arresta prima di attribuire un numero al campo incompleto."
    ],
    "introduzione": [
      "Questa lettura guidata mette in relazione posizione, larghezza e ordine di un campo binario. Il cursore sceglie il primo byte nel buffer; un intero di sedici bit richiede due celle consecutive. Dopo averne verificato la presenza, la convenzione big-endian o little-endian assegna al primo oppure al secondo byte il peso 256 e permette di ricostruire il valore.",
      "Carica la lettura di 01 02 in big-endian e segui delimitazione e interpretazione. Fissa il risultato per confronto, poi carica la variante little-endian: il valore passa da 258 a 513, mentre il cursore finale resta 3. Imposta infine la posizione iniziale a 3 e applica i parametri per osservare l’arresto quando rimane disponibile soltanto il byte FF."
    ],
    "lettura": "La fila contiene il buffer 41 01 02 FF con offset da zero. Il triangolo indica l’inizio del campo e le due celle evidenziate sono i byte selezionati; le frecce li assegnano ai riquadri di peso 256 e peso 1.",
    "conclusione": "Il numero ricostruito dipende dall’ordine dei byte, mentre l’avanzamento del cursore dipende dalla larghezza del campo. La verifica di disponibilità precede entrambi i calcoli.",
    "controlli": {
      "pos": "Offset del primo byte del campo, contando da zero nell’array di quattro byte. Una lettura richiede anche il byte successivo.",
      "ord": "Ordine atteso per l’intero di sedici bit: big-endian assegna peso 256 al primo byte, little-endian al secondo."
    },
    "esperienze": [
      {
        "titolo": "Leggere 01 02 in big-endian",
        "parametri": {
          "pos": 1,
          "ord": "big-endian"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Posizione iniziale = 1; Ordine = big-endian.",
          "Parti dall’offset 1 e seleziona 01 02; assegna peso 256 al primo byte e calcola il totale.",
          "Usa «Passo successivo» fino a «Delimitazione». Leggi «Disponibili» e «Campo» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Interpretazione». Confronta «Ordine» e «Intero» e «Cursore finale» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Interpretazione» si leggono: Ordine = big-endian; Intero = 258; Cursore finale = 3.",
        "ragionamento": "Il campo contiene 01 e 02, entrambi disponibili. In big-endian il valore è 1 × 256 + 2 = 258; consumare due byte porta il cursore da 1 a 3.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Ordine",
            "valore": "big-endian"
          },
          {
            "passo": 2,
            "campo": "Intero",
            "valore": "258"
          },
          {
            "passo": 1,
            "campo": "Disponibili",
            "valore": "3"
          }
        ]
      },
      {
        "titolo": "Leggere 01 02 in little-endian",
        "parametri": {
          "pos": 1,
          "ord": "little-endian"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Posizione iniziale = 1; Ordine = little-endian.",
          "Seleziona la stessa coppia e assegna peso 256 a 02; prevedi se l’avanzamento del cursore cambierà.",
          "Usa «Passo successivo» fino a «Delimitazione». Leggi «Disponibili» e «Campo» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Interpretazione». Confronta «Ordine» e «Intero» e «Cursore finale» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Interpretazione» si leggono: Ordine = little-endian; Intero = 513; Cursore finale = 3.",
        "ragionamento": "In little-endian il primo byte pesa 1 e il secondo 256, dando 1 + 2 × 256 = 513. La larghezza resta di due byte, quindi il cursore termina ancora a 3.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Ordine",
            "valore": "little-endian"
          },
          {
            "passo": 2,
            "campo": "Intero",
            "valore": "513"
          },
          {
            "passo": 1,
            "campo": "Disponibili",
            "valore": "3"
          }
        ]
      }
    ]
  },
  "1.3.6": {
    "scopo": "Una sola lettera accentata può richiedere più celle di memoria. Seguirai la costruzione della stringa C che contiene è, distinguendo il contenuto UTF-8 dal byte che ne indica la fine.",
    "teoria": [
      "Un array è una successione di elementi dello stesso tipo conservati in posizioni contigue. Il tipo char del linguaggio C occupa un byte, qui formato da otto bit, e può conservare un elemento della codifica di un testo; in un array di char ogni elemento occupa dunque una cella di un byte. Le posizioni sono numerate da zero e il loro numero è chiamato indice oppure, quando misura una distanza in byte, offset. Con la codifica UTF-8 alcuni caratteri richiedono un solo byte e altri più di uno; per scegliere la capacità dell’array occorre quindi contare i byte del testo. Il nome Unicode U+00E8 identifica il punto di codice della lettera «è», ossia il numero assegnato a quel carattere, scritto in esadecimale dopo U+.",
      "La stringa C segue una convenzione precisa: dopo i byte del testo si scrive un byte di valore zero, detto terminatore NUL, attraverso il quale le funzioni riconoscono la fine. La lettera è si codifica con C3 A8; il terminatore 00 occupa quindi una terza cella. La funzione strlen restituisce il numero di byte che precedono il primo terminatore: qui due. La capacità minima comprende anche la cella del terminatore e vale tre.",
      "Per una lettera accentata si può disegnare una casella per ogni byte della sua codifica e riservarne poi una per il terminatore. Nel leggere lo svolgimento conviene tenere distinti il numero dei caratteri del testo, la lunghezza della loro codifica e il numero di celle richieste alla memoria."
    ],
    "introduzione": [
      "Il problema svolto permette di distinguere la lunghezza di una stringa dalla capacità dell’array che la contiene. Ogni elemento char occupa qui un byte; la lettera è usa i due byte UTF-8 C3 A8. La convenzione delle stringhe C aggiunge il terminatore NUL, di valore zero, mentre strlen conta soltanto i byte che precedono tale terminatore.",
      "Leggi i dati iniziali e prevedi quante celle servano per conservare è come stringa C. Avanza con «Passo successivo» dal punto di codice U+00E8 ai due byte del testo, poi alla cella 00. Confronta l’ultimo offset, pari a 2, con la capacità di tre byte e con la lunghezza due restituita da strlen."
    ],
    "lettura": "La figura aggiunge prima i byte del carattere agli offset 0 e 1, poi il terminatore all’offset 2. Le etichette permettono di confrontare l’ultimo indice con il numero complessivo di celle.",
    "conclusione": "Una stringa C in UTF-8 ha una lunghezza in byte e una capacità che include il terminatore. L’ultimo offset è inferiore di uno al numero delle celle quando la numerazione parte da zero.",
    "procedura": [
      "Leggi che l’array deve contenere la lettera è e il terminatore; prevedi il numero totale di celle.",
      "In «Il carattere» identifica U+00E8, poi avanza a «I byte del testo» per leggere C3 A8.",
      "In «Terminare la stringa» osserva la cella 00 e confronta l’offset 2 con la capacità totale.",
      "Rileggi il risultato distinguendo i due byte contati da strlen dai tre byte occupati dall’array minimo."
    ],
    "risultato": "Servono tre byte: C3 A8 per è e 00 per il terminatore.",
    "ragionamento": "La codifica UTF-8 del punto di codice U+00E8 richiede due byte. La convenzione delle stringhe C aggiunge un byte zero, quindi la capacità minima è 2 + 1 = 3."
  },
  "1.3.7": {
    "scopo": "Un’immagine memorizzata per righe trasforma coordinate e canale in uno spostamento lineare. Nell’esercizio 4, traccia 1, localizzerai il verde di un pixel contando prima righe, poi pixel e infine componenti.",
    "teoria": [
      "Un’immagine digitale suddivide la superficie in punti chiamati pixel. Il colore di ciascun punto nasce da tre intensità, una per il rosso, una per il verde e una per il blu. Quando le intensità sono scritte consecutivamente in memoria, l’indirizzo di una componente dipende tanto dalla posizione del punto quanto dal colore cercato.",
      "Nella sigla RGB24 le tre lettere indicano i colori e il numero indica i bit complessivi di un pixel. Dato che ogni intensità ne occupa otto, per ciascuna serve un byte. Nella disposizione qui scelta le righe si susseguono senza spazi. Un salto di riga equivale dunque a tanti gruppi di tre byte quanti sono i pixel in larghezza. Le coordinate (x, y) contano da zero: x individua il pixel lungo la riga e y la riga nell’ordine di memorizzazione. L’offset è il numero di byte da superare partendo dal primo byte dell’immagine.",
      "Con otto pixel per riga si attraversano ventiquattro byte prima di raggiungere la riga successiva. Il pixel di coordinate (3, 2), contando da zero, viene dopo due righe e tre pixel: il suo primo byte è all’offset 2 × 24 + 3 × 3 = 57. Il verde segue il rosso di un byte e si trova a 58. Se si riceve lo spostamento anziché le coordinate, divisioni e resti permettono di ricostruire questo percorso."
    ],
    "introduzione": [
      "L’esercizio rende osservabile il passaggio dalle coordinate di un’immagine a una posizione in memoria. Nel formato RGB24 ogni pixel occupa tre byte, nell’ordine rosso, verde e blu. Con righe contigue e coordinate contate da zero, lo spostamento di un canale si ottiene contando prima le righe complete, poi i pixel nella riga e infine il canale.",
      "Carica l’esempio guidato dell’esercizio 4, traccia 1. Calcola la dimensione dell’immagine 8 × 4 e premi «Registra la previsione». Avanza verso il pixel (3, 2): due righe occupano 48 byte e tre pixel altri nove. Confronta il suo inizio a 57 con il verde a 58, poi usa la traccia 2 per ricavare coordinate e canale da un offset."
    ],
    "lettura": "La figura distingue la posizione del pixel e i tre byte R, G, B che lo compongono. Le righe sono contigue: l’offset cresce attraversando tutti i byte di una riga prima di cominciare la successiva.",
    "conclusione": "Per RGB24 contiguo, l’offset di una componente è 3 × (y × larghezza + x) più l’indice del canale. Origine delle coordinate e disposizione delle righe devono essere dichiarate per applicare la formula.",
    "procedura": [
      "Premi «Carica l’esempio guidato» e seleziona l’esercizio 4, «Localizzare un canale in un’immagine RGB», traccia 1.",
      "Per l’immagine 8 × 4, calcola tre byte per pixel e ventiquattro byte per riga; registra la dimensione totale.",
      "Segui la ricostruzione del pixel (3, 2), contando due righe complete e tre pixel nella riga corrente.",
      "Apri la prova completa e aggiungi un byte per passare dal rosso al verde del pixel, confrontando l’offset ottenuto con 58."
    ],
    "risultato": "L’immagine occupa 96 byte e il canale verde del pixel (3, 2) si trova all’offset 58.",
    "ragionamento": "La dimensione è 8 × 4 × 3 = 96 byte. Il pixel cercato ha indice 2 × 8 + 3 = 19 e comincia all’offset 19 × 3 = 57; G è il secondo canale e aggiunge uno, dando 58."
  },
  "1.3.8": {
    "scopo": "La stessa coppia di byte ammette una lettura testuale e due letture numeriche. Nell’esercizio 5, traccia 1, applicherai separatamente ASCII e i due ordini di un intero a sedici bit.",
    "teoria": [
      "La memoria custodisce sequenze di bit che un programma può trattare come lettere oppure come numeri. Per interpretare una coppia di byte occorre quindi sapere quale formato abbia scelto chi ha scritto i dati. Il prefisso 0x introduce cifre esadecimali, ciascuna delle quali rappresenta quattro bit. In questo modello byte e ottetto indicano entrambi un gruppo di otto bit.",
      "Per i caratteri il codice ASCII associa un numero a un simbolo. Per un intero di due byte si usano invece i pesi 1 e 256. La convenzione little-endian assegna peso uno al byte che si incontra per primo in memoria, mentre la convenzione big-endian attribuisce a quel byte il peso maggiore. Un byte possiede 2⁸ = 256 configurazioni: quando occupa il gruppo successivo di otto posizioni nel numero, il suo contributo viene quindi moltiplicato per 256.",
      "I byte 0x41 e 0x42, in quest’ordine, corrispondono alle lettere A e B nel codice ASCII. Se rappresentano un intero il cui byte meno significativo viene per primo, il valore è 0x4241. Cambiando la convenzione sull’ordine dei byte si ottiene 0x4142, sebbene le celle di memoria conservino esattamente lo stesso contenuto."
    ],
    "introduzione": [
      "Lo svolgimento serve a confrontare tre significati attribuibili alla stessa coppia di byte. ASCII usa sette bit per assegnare i codici da 0 a 127 a caratteri e funzioni di controllo; un intero di sedici bit combina invece i due valori con pesi 1 e 256. Big-endian assegna il peso maggiore al primo byte in memoria, little-endian al secondo. La scelta del formato determina quindi il risultato.",
      "Carica l’esempio guidato dell’esercizio 5, traccia 1, e mantieni come riferimento le celle 41 e 42 nell’ordine fornito. Con «Passo successivo» confronta il testo AB con 16706 in big-endian e 16961 in little-endian. Ricostruisci le due somme pesate osservando le frecce: cambiano le assegnazioni dei pesi, mentre i byte nelle celle conservano le loro posizioni."
    ],
    "lettura": "Le due celle conservano sempre 41 e 42 in ordine di indirizzo. I diversi percorsi assegnano loro un simbolo ASCII oppure i pesi numerici 1 e 256; confronta il percorso di lettura senza scambiare il contenuto delle celle.",
    "conclusione": "Cambiare la regola di interpretazione può cambiare il valore ottenuto da una memoria identica. Il formato deve quindi specificare sia il tipo di dato sia, per gli interi multibyte, l’ordine dei byte.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per l’esercizio 5, «Due ottetti, tre letture», traccia 1.",
      "Leggi 41 e 42 come codici ASCII e annota le lettere nell’ordine fornito.",
      "Avanza alla lettura big-endian: attribuisci peso 256 al primo byte.",
      "Avanza alla lettura little-endian e attribuisci quel peso al secondo byte, verificando tutti e tre i risultati finali."
    ],
    "risultato": "La coppia testuale è AB. L’intero big-endian vale 16706 e quello little-endian 16961.",
    "ragionamento": "0x41 vale 65 e 0x42 vale 66, associati ad A e B. Big-endian dà 65 × 256 + 66 = 16706; little-endian dà 66 × 256 + 65 = 16961."
  },
  "1.4.1": {
    "scopo": "Una stessa parola di otto bit può designare un intero senza segno oppure un intero in complemento a due. Mantieni il bit alto acceso e cambia i sette bit inferiori per ricostruire entrambi i valori usando i rispettivi pesi.",
    "teoria": [
      "Una fila di otto cifre binarie offre 256 configurazioni. Per rappresentare soltanto quantità positive o nulle, si attribuiscono alle cifre, partendo da destra, i pesi 1, 2, 4, 8, 16, 32, 64 e 128. Per comprendere anche i numeri negativi occorre distribuire altrimenti le stesse 256 possibilità. Il complemento a due conserva i primi sette pesi e assegna −128 alla posizione più a sinistra.",
      "Si prendano i sette bit inferiori che insieme valgono 5. Con il bit alto spento la parola è 00000101 e vale 5 in entrambe le letture. Accendendo quel bit si ottiene 10000101. Nella lettura senza segno si sommano 128 e 5, ottenendo 133. Nella lettura con segno si sommano −128 e 5, ottenendo −123.",
      "La distanza di 256 fra i due risultati dipende interamente dal peso attribuito alla posizione 7. La parola conservata nella cella è identica. È l’interpretazione prevista per quel dato a stabilire se il bit più alto contribuisca in senso positivo oppure negativo."
    ],
    "introduzione": [
      "L’esperimento permette di interpretare uno stesso byte sia senza segno sia in complemento a due. Nella prima lettura il bit più alto pesa 128; nella seconda pesa −128, mentre i sette pesi inferiori restano identici. Su otto bit questa scelta distribuisce le 256 configurazioni rispettivamente fra 0 e 255 oppure fra −128 e 127.",
      "Carica «Il minimo con segno» e avanza osservando la parola 10000000 sulle due scale: vale 128 oppure −128 secondo il peso del bit 7. Confronta poi «Cinque unità sopra il minimo». I sette bit inferiori aggiungono cinque in entrambe le letture, producendo 133 e −123; verifica che la distanza fra i risultati rimanga 256."
    ],
    "lettura": "La fila mostra il byte, con il bit 7 evidenziato all’estrema sinistra. Le due scale inferiori hanno intervalli diversi: da 0 a 255 per la lettura senza segno e da −128 a 127 per il complemento a due; il punto indica il valore della stessa parola su ciascuna scala.",
    "conclusione": "Quando il bit 7 vale uno, la lettura con segno si ottiene sottraendo 256 dalla lettura senza segno. La larghezza di otto bit è parte della regola e deve essere fissata prima di interpretare la parola.",
    "controlli": {
      "bassi": "Valore complessivo delle posizioni da 0 a 6, comprese fra 0 e 127; il modello lo scrive su sette bit.",
      "alto": "Valore del bit 7. Il suo peso è +128 senza segno e −128 nel complemento a due."
    },
    "esperienze": [
      {
        "titolo": "Il minimo con segno",
        "parametri": {
          "bassi": 0,
          "alto": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Sette bit inferiori, in decimale = 0; Bit 7 = 1.",
          "Con il bit 7 acceso e tutti gli altri spenti, prevedi il contributo sulla scala senza segno e su quella con segno.",
          "Usa «Passo successivo» fino a «Lettura senza segno». Leggi «Calcolo» e «Valore» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Complemento a due». Confronta «Calcolo» e «Valore» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Complemento a due» si leggono: Calcolo = 1 × (−128) + 0; Valore = -128.",
        "ragionamento": "La parola 10000000 contiene soltanto il contributo della posizione 7. Il peso +128 dà 128 nella lettura senza segno, mentre il peso −128 dà il minimo rappresentabile con segno.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Calcolo",
            "valore": "1 × (−128) + 0"
          },
          {
            "passo": 2,
            "campo": "Valore",
            "valore": "-128"
          },
          {
            "passo": 1,
            "campo": "Calcolo",
            "valore": "1 × 128 + 0"
          }
        ]
      },
      {
        "titolo": "Cinque unità sopra il minimo",
        "parametri": {
          "bassi": 5,
          "alto": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Sette bit inferiori, in decimale = 5; Bit 7 = 1.",
          "Aggiungi 5 ai sette bit inferiori conservando il bit alto a uno; somma separatamente +128 e −128.",
          "Usa «Passo successivo» fino a «Lettura senza segno». Leggi «Calcolo» e «Valore» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Complemento a due». Confronta «Calcolo» e «Valore» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Complemento a due» si leggono: Calcolo = 1 × (−128) + 5; Valore = -123.",
        "ragionamento": "La parola 10000101 contiene i pesi bassi 4 e 1. Il valore senza segno è 128 + 5 = 133; quello con segno è −128 + 5 = −123.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Calcolo",
            "valore": "1 × (−128) + 5"
          },
          {
            "passo": 2,
            "campo": "Valore",
            "valore": "-123"
          },
          {
            "passo": 1,
            "campo": "Calcolo",
            "valore": "1 × 128 + 5"
          }
        ]
      }
    ]
  },
  "1.4.2": {
    "scopo": "Un’operazione su byte produce una parola e alcuni indicatori del suo rapporto con gli intervalli rappresentabili. Confronterai una somma che supera il massimo con segno con una somma che genera un riporto senza segno.",
    "teoria": [
      "La parte del processore che esegue le operazioni aritmetiche e logiche, detta ALU, dispone qui di otto posizioni binarie per scrivere il risultato. Se il calcolo richiede una posizione ulteriore, nella destinazione rimangono gli otto bit inferiori. Conservare soltanto questi bit equivale a ricondurre il risultato nell’intervallo 0…255 aggiungendo o sottraendo multipli di 256: si ottiene il residuo modulo 256. Per descrivere quanto è accaduto, l’ALU aggiorna alcuni indicatori di un bit, detti flag.",
      "CF significa Carry Flag e riguarda la lettura senza segno. Nella somma segnala una cifra di riporto oltre il byte, quindi un totale superiore a 255; nella sottrazione segue qui la convenzione x86 e segnala il prestito necessario quando si sottrae un byte più grande da uno più piccolo. OF significa Overflow Flag e riguarda gli stessi byte interpretati in complemento a due, con valori da −128 a 127. Il termine overflow indica che il risultato matematico esce da quell’intervallo; in tal caso OF vale uno.",
      "Sommando 127 e 1 si ottiene matematicamente 128. Per un intero senza segno il risultato entra nel byte e CF vale zero. Per un intero con segno 128 supera il massimo, quindi OF vale uno. La configurazione scritta, 10000000, si può leggere in entrambi i modi perché la posizione più alta pesa 128 oppure −128 secondo la convenzione adottata."
    ],
    "introduzione": [
      "Il laboratorio chiarisce il significato di due indicatori dell’aritmetica su otto bit. L’ALU, il circuito che svolge il calcolo, conserva gli otto bit inferiori del risultato. CF segnala il riporto nella somma senza segno; OF segnala che il risultato matematico con segno supera l’intervallo −128…127. Entrambi descrivono gli stessi operandi secondo criteri diversi.",
      "Carica «Superare il massimo con segno» e segui 127 + 1 nei due percorsi: il risultato 128 entra nell’intervallo senza segno, mentre oltrepassa il massimo con segno. Confronta poi 255 + 1 nel secondo caso. Osserva CF = 1 e OF = 0, rileggendo 0xFF come −1, e distingui il risultato matematico dal byte 0x00 conservato."
    ],
    "lettura": "Le due rette collocano i risultati matematici negli intervalli evidenziati: 0…255 sopra e −128…127 sotto. I riquadri CF e OF si riferiscono rispettivamente a queste due letture; il byte conservato compare nella riga finale.",
    "conclusione": "CF e OF descrivono criteri differenti applicati agli stessi bit. Il byte scritto è il residuo modulo 256; per decidere se rappresenti il risultato voluto occorre stabilire prima la lettura con segno o senza segno.",
    "controlli": {
      "a": "Primo byte, immesso come intero da 0 a 255. Se vale almeno 128, la lettura in complemento a due sottrae 256.",
      "b": "Secondo byte, anch’esso da interpretare sia senza segno sia in complemento a due.",
      "op": "Somma A + B oppure sottrazione A − B. CF segue la convenzione x86: riporto per la somma, prestito per la sottrazione."
    },
    "esperienze": [
      {
        "titolo": "Superare il massimo con segno",
        "parametri": {
          "a": 127,
          "b": 1,
          "op": "somma"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Byte A = 127; Byte B = 1; Operazione = somma.",
          "Calcola 127 + 1 e confronta 128 con entrambi gli estremi massimi, 255 e 127.",
          "Usa «Passo successivo» fino a «Percorso senza segno». Leggi «Risultato matematico» e «CF» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Percorso con segno». Confronta «Risultato matematico» e «OF» e «Byte scritto» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Percorso con segno» si leggono: Risultato matematico = 128; OF = 1; Byte scritto = 0x80.",
        "ragionamento": "La somma senza segno 127 + 1 = 128 rientra nell’intervallo, quindi CF vale 0. La stessa somma con segno supera 127 e accende OF; gli otto bit scritti formano 0x80.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Risultato matematico",
            "valore": "128"
          },
          {
            "passo": 2,
            "campo": "OF",
            "valore": "1"
          },
          {
            "passo": 1,
            "campo": "Risultato matematico",
            "valore": "128"
          }
        ]
      },
      {
        "titolo": "Generare il riporto senza segno",
        "parametri": {
          "a": 255,
          "b": 1,
          "op": "somma"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Byte A = 255; Byte B = 1; Operazione = somma.",
          "Leggi il byte 255 anche come −1; prevedi i risultati di 255 + 1 e di −1 + 1 prima di ridurre a otto bit.",
          "Usa «Passo successivo» fino a «Percorso senza segno». Leggi «Risultato matematico» e «CF» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Percorso con segno». Confronta «Risultato matematico» e «OF» e «Byte scritto» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Percorso con segno» si leggono: Risultato matematico = 0; OF = 0; Byte scritto = 0x00.",
        "ragionamento": "Senza segno, 255 + 1 = 256 produce un riporto e lascia il residuo zero. Con segno si sommano −1 e 1, ottenendo zero entro l’intervallo: CF vale 1 e OF vale 0.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Risultato matematico",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "OF",
            "valore": "0"
          },
          {
            "passo": 1,
            "campo": "Risultato matematico",
            "valore": "256"
          }
        ]
      }
    ]
  },
  "1.4.3": {
    "scopo": "In un confronto C i tipi degli operandi possono imporre una conversione prima che venga valutata la relazione. Confronterai prima un int negativo e poi lo zero con lo stesso unsigned int, seguendo il valore realmente confrontato.",
    "teoria": [
      "Nel linguaggio C una variabile associa un nome a un valore conservato durante l’esecuzione, mentre un’espressione combina valori mediante operazioni. Il tipo stabilisce l’intervallo della variabile e le conversioni da applicare nelle espressioni. Nel modello int rappresenta anche valori negativi e unsigned int soltanto valori da zero in su; entrambi occupano 32 bit. Le 2³² configurazioni danno all’intero senza segno l’intervallo da 0 a 2³² − 1. Nel confronto A < B, il simbolo < chiede se A sia minore di B: il risultato è 1 quando la relazione è vera e 0 quando è falsa.",
      "Per i due tipi mostrati, che sono le versioni con e senza segno dello stesso tipo intero, il linguaggio stabilisce che il confronto avvenga fra due unsigned int. Il primo operando viene perciò convertito. Un valore già compreso nell’intervallo conserva il proprio valore numerico. Un negativo viene sostituito dal corrispondente residuo modulo 2³², cioè dal valore nell’intervallo che si ottiene aggiungendo o sottraendo multipli di 2³².",
      "Nell’espressione −1 < 1u il suffisso u designa la costante senza segno. Il primo operando diventa 4 294 967 295, perciò il confronto restituisce 0, il valore che in C indica falso. Nella figura la riga della conversione permette di riconoscere in quale momento il confronto del programma si discosta da quello che si farebbe leggendo −1 e 1 sulla retta dei numeri."
    ],
    "introduzione": [
      "La simulazione rende visibile la conversione che precede un confronto fra int e unsigned int nel modello a 32 bit. Il tipo unsigned int rappresenta i valori da zero a 2³² − 1; quando il confronto richiede questo tipo, un int negativo diventa il corrispondente residuo modulo 2³². La relazione viene quindi valutata sui valori convertiti.",
      "Carica «Un int negativo nel confronto» e avanza dall’espressione −1 < 1u alla conversione del primo operando in 4294967295. Confronta l’esito C, pari a zero, con quello matematico iniziale. Passa poi a «Lo zero nel confronto»: osserva che zero conserva il proprio valore e che 0 < 1u risulta vero, rappresentato dall’intero uno."
    ],
    "lettura": "I riquadri a sinistra mostrano i due operandi con i rispettivi tipi. La freccia superiore conduce alla conversione del primo in unsigned; solo dopo entrambi i percorsi raggiungono il riquadro del confronto <.",
    "conclusione": "Nel caso di int e unsigned int della stessa larghezza il confronto avviene nel tipo senza segno. La conversione conserva i valori già rappresentabili e associa ai negativi il loro residuo modulo 2³²; qui entrambi i tipi sono assunti larghi 32 bit.",
    "controlli": {
      "a": "Operando di tipo int con segno. Il modello assume int a 32 bit e mostra la conversione richiesta dal confronto con unsigned int.",
      "b": "Operando unsigned int a 32 bit; nel testo dell’espressione il suffisso u identifica il tipo senza segno."
    },
    "esperienze": [
      {
        "titolo": "Un int negativo nel confronto",
        "parametri": {
          "a": -1,
          "b": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Operando int = -1; Operando unsigned int = 1.",
          "Converti −1 aggiungendo 2³² e confronta il valore ottenuto con 1.",
          "Usa «Passo successivo» fino a «Conversione». Leggi «Primo operando convertito» e «Secondo operando» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Valutazione». Confronta «Esito C» e «Confronto matematico iniziale» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Valutazione» si leggono: Esito C = 0; Confronto matematico iniziale = 1.",
        "ragionamento": "La conversione di −1 a unsigned int dà 2³² − 1 = 4294967295. Questo numero supera 1, quindi l’espressione C restituisce 0, mentre il confronto matematico dei valori iniziali sarebbe vero.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Esito C",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Confronto matematico iniziale",
            "valore": "1"
          },
          {
            "passo": 1,
            "campo": "Primo operando convertito",
            "valore": "4294967295"
          }
        ]
      },
      {
        "titolo": "Lo zero nel confronto",
        "parametri": {
          "a": 0,
          "b": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Operando int = 0; Operando unsigned int = 1.",
          "Lo zero è già rappresentabile come unsigned int: prevedi se la conversione cambierà il confronto 0 < 1.",
          "Usa «Passo successivo» fino a «Conversione». Leggi «Primo operando convertito» e «Secondo operando» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Valutazione». Confronta «Esito C» e «Confronto matematico iniziale» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Valutazione» si leggono: Esito C = 1; Confronto matematico iniziale = 1.",
        "ragionamento": "Zero appartiene all’intervallo di unsigned int e conserva il proprio valore. Il confronto 0 < 1 restituisce 1, che rappresenta vero in C.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Esito C",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Confronto matematico iniziale",
            "valore": "1"
          },
          {
            "passo": 1,
            "campo": "Primo operando convertito",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "1.4.4": {
    "scopo": "Prima di conservare un prodotto in un byte si può verificare che rientri nel massimo disponibile. Confronterai due fattori vicini alla soglia per capire perché un residuo piccolo possa nascondere un prodotto troppo grande.",
    "teoria": [
      "Una moltiplicazione può produrre un valore troppo grande per la cella che dovrà contenerlo. Un byte ha otto posizioni binarie e consente di scrivere, senza segno, gli interi da 0 a 255. Se si conservano soltanto quelle posizioni, ogni gruppo completo di 256 unità scompare dalla scrittura e rimane il resto della divisione per 256.",
      "Per verificare in anticipo se A × B entra nella cella, quando B è positivo si può dividere il massimo 255 per B e prendere la parte intera del quoziente. Con B = 16, poiché 255 diviso 16 dà 15 con resto 15, il massimo A ammesso è 15. Il calcolo 15 × 16 dà 240, mentre 16 × 16 dà 256, la prima unità che richiederebbe un nono bit. Le parentesi ⌊ ⌋ indicano il più grande intero minore o uguale al numero racchiuso: per 255/16 = 15,9375 si prende dunque 15.",
      "Nel secondo caso il residuo mostrato è zero, benché il prodotto esatto sia positivo. Affiancare soglia, prodotto e residuo permette di capire perché la decisione vada presa sul valore che si vuole conservare. Se B vale zero, il prodotto vale zero per qualunque A e la divisione preliminare diventa superflua."
    ],
    "introduzione": [
      "L’attività mostra come verificare un prodotto prima di memorizzarlo in un byte senza segno. Il massimo rappresentabile è 255: per un secondo fattore positivo B, il primo fattore A deve essere al massimo la parte intera di 255/B. Questo controllo collega la capacità della destinazione al prodotto desiderato, prima che una riduzione a otto bit ne conservi soltanto il resto.",
      "Carica «Un prodotto appena troppo grande» e confronta A = 16 con la soglia 15 ricavata da 255/16. Avanza al prodotto esatto 256 e al residuo zero, poi carica il caso con A = 15. Osserva che il prodotto esatto e il residuo coincidono a 240. Puoi infine applicare B = 0 per verificare il ramo che evita la divisione."
    ],
    "lettura": "Il triangolo rappresenta A sulla scala dei byte; il tratto evidenziato indica i valori ammessi per il B scelto. Sotto si leggono la soglia ottenuta dalla divisione e, alla fine, il prodotto esatto accanto al residuo su otto bit.",
    "conclusione": "Per B positivo, la condizione A ≤ ⌊255/B⌋ evita di calcolare un prodotto fuori intervallo nella destinazione. Il caso B = 0 richiede soltanto di riconoscere che il prodotto è zero.",
    "controlli": {
      "a": "Primo fattore intero da 0 a 255, confrontato con la soglia ammessa prima della moltiplicazione.",
      "b": "Secondo fattore. Se è positivo divide il limite 255 per ricavare il massimo A sicuro; se vale zero il prodotto è sempre zero."
    },
    "esperienze": [
      {
        "titolo": "Un prodotto appena troppo grande",
        "parametri": {
          "a": 16,
          "b": 16
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Primo fattore = 16; Secondo fattore = 16.",
          "Dividi 255 per 16 prendendo la parte intera e confronta il quoziente con A = 16.",
          "Usa «Passo successivo» fino a «Controllo preliminare». Leggi «Massimo primo fattore» e «Prodotto ammesso» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Confronto con il residuo». Confronta «Prodotto esatto» e «Residuo modulo 256» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Confronto con il residuo» si leggono: Prodotto esatto = 256; Residuo modulo 256 = 0.",
        "ragionamento": "La parte intera di 255/16 è 15. A = 16 supera la soglia e produce 256, che modulo 256 diventa zero: il residuo perde l’informazione sul prodotto esatto.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Prodotto esatto",
            "valore": "256"
          },
          {
            "passo": 2,
            "campo": "Residuo modulo 256",
            "valore": "0"
          },
          {
            "passo": 1,
            "campo": "Massimo primo fattore",
            "valore": "15"
          }
        ]
      },
      {
        "titolo": "Il fattore appena sotto la soglia",
        "parametri": {
          "a": 15,
          "b": 16
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Primo fattore = 15; Secondo fattore = 16.",
          "Conserva B = 16 e porta A = 15; calcola il prodotto atteso prima di esaminare il residuo.",
          "Usa «Passo successivo» fino a «Controllo preliminare». Leggi «Massimo primo fattore» e «Prodotto ammesso» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Confronto con il residuo». Confronta «Prodotto esatto» e «Residuo modulo 256» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Confronto con il residuo» si leggono: Prodotto esatto = 240; Residuo modulo 256 = 240.",
        "ragionamento": "A = 15 coincide con il massimo ammesso. Il prodotto 15 × 16 = 240 rientra nel byte e il residuo resta 240, quindi la conversione conserva il risultato.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Prodotto esatto",
            "valore": "240"
          },
          {
            "passo": 2,
            "campo": "Residuo modulo 256",
            "valore": "240"
          },
          {
            "passo": 1,
            "campo": "Massimo primo fattore",
            "valore": "15"
          }
        ]
      }
    ]
  },
  "1.4.5": {
    "scopo": "Un intero negativo deve conservare il proprio valore quando entra in un registro più largo. Estenderai 0xF8 da otto a sedici bit copiando il segno, poi verificherai il numero risultante alla nuova larghezza.",
    "teoria": [
      "Quando un registro più largo deve accogliere un intero con segno, occorre costruire una nuova sequenza di bit che rappresenti lo stesso numero. Un registro è una piccola memoria interna al processore. Nel complemento a due la posizione più alta ha peso negativo, mentre le altre hanno i consueti pesi positivi, che raddoppiano andando verso sinistra.",
      "Si consideri −8 su otto bit. Il prefisso 0x indica la base sedici, nella quale F vale 15: la parola 0xF8, ossia 11111000, vale senza segno 15 × 16 + 8 = 248 e con segno 248 − 256 = −8. Per portarla a sedici bit si copia nelle otto nuove posizioni la cifra del segno, in questo caso 1, ottenendo 11111111 11111000. Il nuovo byte alto FF vale 255 e ha peso 256, perciò la parola estesa vale senza segno 255 × 256 + 248 = 65528. Alla nuova larghezza la lettura con segno dà 65528 − 65536 = −8.",
      "Se il bit iniziale del segno è zero, gli zeri aggiunti a sinistra lasciano intatta la somma dei pesi. La verifica nello svolgimento consiste perciò nel leggere la parola iniziale alla sua larghezza e quella estesa alla nuova larghezza, confrontando i due valori con segno."
    ],
    "introduzione": [
      "Il problema svolto spiega come trasferire un numero con segno in un registro più largo conservandone il valore. In complemento a due, l’estensione del segno replica il bit più alto nelle nuove posizioni. Il codice esadecimale cambia perché aumenta la larghezza, mentre il valore si verifica interpretando ciascuna parola con il modulo appropriato: 256 oppure 65536.",
      "Leggi 0xF8 su otto bit e ricava −8 sottraendo 256 dalla lettura senza segno 248. Prevedi nel campo dedicato la parola a sedici bit, poi avanza con «Passo successivo». Osserva gli otto uno aggiunti sopra F8 e confronta 0xFFF8 con la previsione. La verifica finale 65528 − 65536 mostra che il numero rappresentato resta −8."
    ],
    "lettura": "Il disegno mantiene il byte F8 sul lato basso e aggiunge le nuove posizioni a sinistra. Il riempimento degli otto nuovi bit dipende dal bit 7 originario; la lettura finale usa il peso negativo della posizione 15.",
    "conclusione": "L’estensione del segno copia il bit più alto nelle nuove posizioni. La verifica deve usare per ciascuna parola il modulo corrispondente alla sua larghezza.",
    "procedura": [
      "Leggi il byte 0xF8 come 248 senza segno e sottrai 256 per prevederne il valore con segno.",
      "In «Leggere il segno» individua il bit alto a uno e scegli il valore degli otto bit aggiunti.",
      "In «Estendere» affianca FF al byte F8 e scrivi la parola prevista.",
      "In «Verificare il valore» sottrai 65536 dalla nuova lettura senza segno e confronta il risultato con −8."
    ],
    "risultato": "L’estensione è 0xFFF8, che rappresenta ancora −8.",
    "ragionamento": "Su otto bit 0xF8 vale 248 − 256 = −8. Copiando il segno nelle posizioni aggiunte si ottiene 65528 su sedici bit; 65528 − 65536 restituisce lo stesso −8."
  },
  "1.4.6": {
    "scopo": "Per rappresentare −37 su otto bit partirai dal suo valore assoluto, invertirai ogni bit e aggiungerai uno. Nell’esercizio 1, traccia 1, controllerai la codifica ottenuta rileggendola con segno.",
    "teoria": [
      "Un contatore di otto bit dispone di 256 configurazioni. Se si aumenta di uno la configurazione composta da otto cifre uno, nel contatore rimangono otto zeri. Il complemento a due sfrutta questo comportamento per rappresentare anche gli interi negativi.",
      "Al codice di zero si arriva incrementando quello di −1, che contiene otto uno. Proseguendo a ritroso si ottengono gli altri numeri negativi. Per un intero negativo rappresentabile in otto bit, aggiungere 256 dà il numero senza segno i cui bit coincidono con il codice cercato.",
      "Il valore assoluto di −37, cioè la sua distanza da zero pari a 37, si scrive 00100101. Invertire ciascun bit produce 11011010, cioè 255 − 37 = 218; aggiungere uno dà 11011011, pari a 219. Il controllo 219 − 256 = −37 conferma che la parola costruita rappresenta il negativo voluto alla larghezza di otto bit. Invertire un bit significa sostituire 0 con 1 oppure 1 con 0."
    ],
    "introduzione": [
      "L’esercizio guidato serve a costruire la rappresentazione di un intero negativo in complemento a due. Su otto bit, invertire le cifre del valore assoluto produce 255 meno quel valore; aggiungere uno permette di ottenere il residuo rispetto a 256. Il codice così costruito si verifica rileggendolo con segno, cioè sottraendo 256 quando il bit alto vale uno.",
      "Carica l’esempio guidato dell’esercizio 1, traccia 1. Scrivi 37 su otto posizioni e inverti ogni bit per prevedere il valore della parola intermedia. Premi «Registra la previsione», poi avanza dall’inversione 11011010 all’incremento 11011011. Confronta 218 e 219 e controlla il codice finale mediante 219 − 256 = −37, mantenendo sempre la larghezza di otto bit."
    ],
    "lettura": "La ricostruzione affianca il valore assoluto, la parola dopo l’inversione e quella dopo l’incremento. Tutte le righe mantengono otto posizioni, così si può verificare ogni cambiamento bit per bit.",
    "conclusione": "Per un negativo rappresentabile su otto bit, invertire i bit del valore assoluto e aggiungere uno equivale a sommare 256 al valore negativo. La prova finale consiste nel sottrarre 256 dalla lettura senza segno del codice.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per l’esercizio 1, «Codificare un numero negativo su otto bit», traccia 1.",
      "Scrivi 37 in binario su otto posizioni e inverti ogni cifra; registra il valore decimale della parola invertita.",
      "Avanza nella ricostruzione e aggiungi uno alla parola invertita, mantenendo la larghezza di otto bit.",
      "Apri la prova completa per indicare anche il byte finale e verifica che, sottraendogli 256, si ottenga −37."
    ],
    "risultato": "Dopo l’inversione si ottiene 218; dopo l’incremento il byte finale è 219, cioè 11011011.",
    "ragionamento": "37 si scrive 00100101. L’inversione produce 11011010, pari a 255 − 37 = 218; aggiungere uno dà 219, e 219 − 256 = −37 verifica il codice."
  },
  "1.4.7": {
    "scopo": "Gli stessi operandi possono generare un riporto senza produrre overflow con segno. Nell’esercizio 4, traccia 1, calcolerai entrambe le letture di F4 + 18 e riconoscerai il significato dei flag.",
    "teoria": [
      "Il registro è una piccola memoria interna al processore. Quando dispone di otto posizioni binarie, conserva soltanto gli otto bit inferiori di ogni somma. Il circuito che somma, chiamato unità aritmetico-logica, registra alcuni dettagli dell’operazione in bit di stato detti flag.",
      "Nell’architettura x86, CF registra il riporto che esce dall’ultima posizione in un’addizione, oppure il prestito in una sottrazione. OF segnala invece se la somma o la differenza matematica, calcolata leggendo gli operandi con segno, esce dall’intervallo da −128 a 127.",
      "Nella somma proposta, 0xF4 + 0x18, le cifre sono esadecimali e F vale 15. Gli operandi senza segno valgono quindi 15 × 16 + 4 = 244 e 1 × 16 + 8 = 24. La somma matematica è 268; il registro conserva il resto della divisione per 256, cioè 12, e CF vale uno per il riporto. In complemento a due il bit alto di F4 è uno e il suo valore è 244 − 256 = −12. La somma con segno è dunque −12 + 24 = 12 e rientra nell’intervallo −128…127, quindi OF rimane zero."
    ],
    "introduzione": [
      "Questa soluzione guidata permette di separare il risultato scritto nel registro dai flag che descrivono l’operazione. In una somma su otto bit, CF registra il riporto oltre 255, mentre OF controlla l’intervallo dei valori con segno da −128 a 127. Per attribuire correttamente i flag occorre interpretare gli operandi prima di confrontare i risultati matematici.",
      "Carica l’esempio guidato dell’esercizio 4, traccia 1, e avanza attraverso la somma F4 + 18. Confronta prima 244 + 24 = 268 con il massimo senza segno e ricava il byte residuo 12. Rileggi poi F4 come −12: la somma −12 + 24 rientra nell’intervallo con segno. Collega così CF = 1 e OF = 0 alle rispettive verifiche."
    ],
    "lettura": "Segui separatamente il calcolo senza segno e quello con segno. Il residuo identifica il byte scritto; i campi CF e OF riportano i due controlli di intervallo applicati prima della riduzione.",
    "conclusione": "Il valore del byte risultante e i flag descrivono aspetti complementari dell’operazione. L’interpretazione voluta stabilisce quale controllo di intervallo sia pertinente.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per l’esercizio 4, «Calcolare risultato e flag su un byte», traccia 1.",
      "Converti F4 e 18 in 244 e 24 e calcola il totale senza segno prima della riduzione.",
      "Avanza e conserva il residuo modulo 256, verificando CF rispetto al massimo 255.",
      "Rileggi F4 come −12, calcola −12 + 24 e controlla OF rispetto all’intervallo −128…127."
    ],
    "risultato": "Il byte scritto vale 12, cioè 0x0C. CF vale 1 e OF vale 0.",
    "ragionamento": "Senza segno, 244 + 24 = 268 supera 255 e il residuo è 268 − 256 = 12, con CF = 1. Con segno, −12 + 24 = 12 rientra nell’intervallo e lascia OF = 0."
  },
  "1.5.1": {
    "scopo": "Una porta logica assegna un’uscita a ciascuna coppia di ingressi. Userai la tabella della XOR con due coppie per verificare come la condizione «ingressi diversi» diventi una riga e poi un segnale in uscita.",
    "teoria": [
      "Una porta logica riceve segnali ai quali si assegnano i due valori 0 e 1. Quando gli ingressi si sono stabilizzati, la porta produce il valore prescritto dalla sua funzione. Con due ingressi, chiamati A e B, si hanno quattro casi possibili. La tabella di verità li elenca e scrive accanto a ciascuno l’uscita corrispondente. La funzione è detta booleana perché i suoi ingressi e la sua uscita assumono soltanto i valori 0 e 1.",
      "AND richiede che entrambi gli ingressi valgano uno. Per OR basta che valga uno almeno uno dei due. XOR vale uno quando i due ingressi differiscono, quindi con A = 0 e B = 1 dà uno e con A = 1 e B = 1 dà zero. NAND inverte il risultato di AND e NOR inverte quello di OR, scambiando ogni zero con un uno e viceversa.",
      "Nella tabella le coppie sono ordinate come 00, 01, 10 e 11. Contando le righe da zero, la coppia 10 occupa la riga 2 perché A pesa due posizioni e B una. Si può così scegliere dapprima la riga mediante gli ingressi e prevedere poi la cifra in uscita applicando la definizione della porta."
    ],
    "introduzione": [
      "La simulazione collega una porta logica alla sua tabella di verità, che elenca l’uscita prevista per ogni combinazione degli ingressi. Due bit A e B formano quattro coppie, ordinate da 00 a 11. La funzione XOR assegna uno alle coppie diverse e zero a quelle uguali; la riga selezionata rende verificabile questa regola sui segnali assestati.",
      "Carica «Ingressi diversi nella XOR» e avanza dalla coppia 01 alla riga corrispondente della tabella, poi all’uscita uno. Confronta il caso con ingressi 11 e osserva l’uscita zero. Mantieni questa coppia, seleziona OR e premi «Applica i parametri»: il nuovo risultato permette di distinguere «almeno un ingresso a uno» da «ingressi diversi»."
    ],
    "lettura": "La tabella a sinistra enumera 00, 01, 10 e 11; la riga evidenziata dipende dagli ingressi A e B. I fili portano quegli ingressi alla porta scelta e il valore finale compare alla sua destra.",
    "conclusione": "La tabella di verità descrive il comportamento assestato della porta per tutte le combinazioni possibili. Il numero di riga 2A + B serve a localizzare il caso; la funzione della porta stabilisce il suo esito.",
    "controlli": {
      "porta": "Funzione logica applicata ai due ingressi. AND richiede entrambi a uno, OR almeno uno, XOR ingressi diversi; NAND e NOR invertono AND e OR.",
      "a": "Primo ingresso binario, usato anche come bit alto nell’indice della riga.",
      "b": "Secondo ingresso binario, usato come bit basso nell’indice della riga."
    },
    "esperienze": [
      {
        "titolo": "Ingressi diversi nella XOR",
        "parametri": {
          "porta": "XOR",
          "a": 0,
          "b": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Porta = XOR; Ingresso A = 0; Ingresso B = 1.",
          "Individua 01 nella tabella: calcola l’indice 2 × 0 + 1 e applica la definizione della XOR.",
          "Usa «Passo successivo» fino a «Tabella di XOR». Leggi «Colonna di uscita» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Uscita assestata». Confronta «Funzione» e «Uscita» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Uscita assestata» si leggono: Funzione = XOR(0, 1); Uscita = 1.",
        "ragionamento": "Con A = 0 e B = 1 si seleziona la riga 1, contando da zero. I due ingressi differiscono e la XOR produce 1.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Funzione",
            "valore": "XOR(0, 1)"
          },
          {
            "passo": 2,
            "campo": "Uscita",
            "valore": "1"
          },
          {
            "passo": 1,
            "campo": "Colonna di uscita",
            "valore": "0 1 1 0"
          }
        ]
      },
      {
        "titolo": "Ingressi uguali nella XOR",
        "parametri": {
          "porta": "XOR",
          "a": 1,
          "b": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Porta = XOR; Ingresso A = 1; Ingresso B = 1.",
          "Individua 11 nella stessa tabella e prevedi l’uscita confrontando i due ingressi.",
          "Usa «Passo successivo» fino a «Tabella di XOR». Leggi «Colonna di uscita» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Uscita assestata». Confronta «Funzione» e «Uscita» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Uscita assestata» si leggono: Funzione = XOR(1, 1); Uscita = 0.",
        "ragionamento": "Con A = 1 e B = 1 si seleziona la riga 3. Gli ingressi coincidono, quindi la XOR produce 0 anche se entrambi sono attivi.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Funzione",
            "valore": "XOR(1, 1)"
          },
          {
            "passo": 2,
            "campo": "Uscita",
            "valore": "0"
          },
          {
            "passo": 1,
            "campo": "Colonna di uscita",
            "valore": "0 1 1 0"
          }
        ]
      }
    ]
  },
  "1.5.2": {
    "scopo": "Partendo dalla tabella desiderata si può costruire una funzione logica che riconosca le righe vere. Aggiungerai una riga al caso XOR per capire come cambia la somma di mintermini e quale comportamento descrive.",
    "teoria": [
      "Supponiamo di conoscere il comportamento desiderato di un circuito attraverso una tabella che, per ogni coppia di ingressi A e B, prescrive se l’uscita debba valere zero oppure uno. Per costruire l’espressione del circuito si può cercare una condizione che riconosca, da sola, una delle righe in cui l’uscita deve valere uno.",
      "Per riconoscere la coppia A = 0 e B = 1 si inverte A, scrivendo ¬A. Si richiedono poi insieme ¬A e B mediante l’operazione AND, indicata dal punto. Il termine ¬A·B vale uno soltanto per quella coppia. Un termine che usa tutti gli ingressi in forma diretta o invertita e riconosce una sola riga si chiama mintermine.",
      "Se devono attivare l’uscita sia 01 sia 10, si aggiunge il termine A·¬B e si collegano i due termini con OR. Il segno + fra i prodotti indica questa operazione: l’uscita vale uno quando almeno un termine vale uno. Seguendo i rami della figura si verifica quale combinazione riconosca ciascun prodotto. Se tutte le righe richieste valgono zero, nessun ramo deve attivarsi e la funzione resta sempre zero; se tutte valgono uno, ogni combinazione attiva il proprio ramo e l’uscita resta sempre uno."
    ],
    "introduzione": [
      "L’attività mostra come costruire una funzione logica partendo dalle righe in cui si desidera uscita uno. Un mintermine è una condizione che riconosce una sola coppia di ingressi: per esempio ¬A·B richiede A uguale a zero e B uguale a uno. Collegare con OR i mintermini scelti realizza tutte le combinazioni richieste dalla tabella.",
      "Carica «Due righe vere: XOR» e segui la trasformazione delle righe 01 e 10 nei rispettivi prodotti. Confronta l’espressione ottenuta con «Tre righe vere: OR»: l’aggiunta della riga 11 introduce il ramo A·B. Osserva i collegamenti verso la porta OR comune e verifica che ogni nuovo ramo corrisponda esattamente a una riga con uscita uno."
    ],
    "lettura": "Ogni riga collega una coppia di ingressi al suo mintermine. Quando l’uscita prescritta vale uno, compare il prodotto che riconosce quella coppia e il suo ramo raggiunge la porta OR comune.",
    "conclusione": "Ogni mintermine seleziona esattamente una combinazione degli ingressi. L’OR dei mintermini selezionati realizza tutte e sole le righe per le quali si è prescritta uscita uno; l’espressione mostrata è canonica, senza semplificazione algebrica.",
    "controlli": {
      "r0": "Uscita desiderata quando A = 0 e B = 0. Se scegli uno viene incluso il termine ¬A·¬B.",
      "r1": "Uscita desiderata per A = 0 e B = 1; la riga corrisponde al termine ¬A·B.",
      "r2": "Uscita desiderata per A = 1 e B = 0; la riga corrisponde al termine A·¬B.",
      "r3": "Uscita desiderata per A = 1 e B = 1; la riga corrisponde al termine A·B."
    },
    "esperienze": [
      {
        "titolo": "Due righe vere: XOR",
        "parametri": {
          "r0": 0,
          "r1": 1,
          "r2": 1,
          "r3": 0
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Uscita per 00 = 0; Uscita per 01 = 1; Uscita per 10 = 1; Uscita per 11 = 0.",
          "Segna 01 e 10 come righe vere; scrivi per ciascuna il prodotto che riconosce entrambi gli ingressi.",
          "Usa «Passo successivo» fino a «Prodotti». Leggi «Mintermini» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Somma logica». Confronta «Espressione» e «Righe vere» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Somma logica» si leggono: Espressione = ¬A·B + A·¬B; Righe vere = 2.",
        "ragionamento": "Per 01 serve ¬A·B e per 10 serve A·¬B. La loro somma logica riconosce gli ingressi diversi e realizza XOR con due mintermini.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Espressione",
            "valore": "¬A·B + A·¬B"
          },
          {
            "passo": 2,
            "campo": "Righe vere",
            "valore": "2"
          },
          {
            "passo": 1,
            "campo": "Mintermini",
            "valore": "¬A·B, A·¬B"
          }
        ]
      },
      {
        "titolo": "Tre righe vere: OR",
        "parametri": {
          "r0": 0,
          "r1": 1,
          "r2": 1,
          "r3": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Uscita per 00 = 0; Uscita per 01 = 1; Uscita per 10 = 1; Uscita per 11 = 1.",
          "Aggiungi 11 alle righe vere e prevedi quale nuovo prodotto raggiungerà la OR finale.",
          "Usa «Passo successivo» fino a «Prodotti». Leggi «Mintermini» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Somma logica». Confronta «Espressione» e «Righe vere» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Somma logica» si leggono: Espressione = ¬A·B + A·¬B + A·B; Righe vere = 3.",
        "ragionamento": "Aggiungendo 11 si include A·B accanto agli altri due prodotti. La funzione diventa vera per ogni coppia che contiene almeno un uno, cioè realizza OR attraverso tre mintermini.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Espressione",
            "valore": "¬A·B + A·¬B + A·B"
          },
          {
            "passo": 2,
            "campo": "Righe vere",
            "valore": "3"
          },
          {
            "passo": 1,
            "campo": "Mintermini",
            "valore": "¬A·B, A·¬B, A·B"
          }
        ]
      }
    ]
  },
  "1.5.3": {
    "scopo": "In C & opera sulle singole posizioni, mentre && combina la verità degli operandi. Esaminerai due numeri con bit attivi in posizioni diverse e poi uno zero, per riconoscere anche la valutazione in cortocircuito.",
    "teoria": [
      "In un programma C la parola «e» può indicare due operazioni, secondo che si debbano confrontare singole posizioni binarie oppure intere condizioni. Un operando è semplicemente uno dei valori sui quali agisce un’operazione. Il segno & mette in corrispondenza le cifre binarie dei due operandi e scrive uno nelle posizioni dove entrambi hanno uno. Un vettore di bit è una sequenza ordinata di zeri e uno. Quando un operando serve a selezionare determinate posizioni dell’altro, viene chiamato maschera: i suoi uno indicano le posizioni da conservare con &.",
      "Se A vale 2 e B vale 4, le rispettive scritture su quattro bit sono 0010 e 0100. I due uno cadono in colonne diverse, quindi A & B produce 0000. Il doppio segno && considera invece ciascun operando come condizione. In C zero è falso e ogni intero diverso da zero è vero. Poiché entrambi i valori sono diversi da zero, A && B restituisce 1.",
      "Con A uguale a zero, la prima condizione è già falsa. La regola di && prescrive allora di saltare la valutazione della seconda, poiché l’esito è già determinato. Nella figura si distinguono così l’accostamento verticale dei bit e la successione dei due controlli logici. Questa interruzione anticipata della valutazione si chiama cortocircuito logico."
    ],
    "introduzione": [
      "Questo confronto serve a distinguere due operatori C dal comportamento diverso. L’operatore & esegue AND fra bit nella stessa posizione; && interpreta invece ciascun valore come condizione, con zero falso e ogni altro intero vero. Inoltre && usa il cortocircuito: se il primo operando è falso, l’esito è già deciso e la valutazione del secondo viene saltata.",
      "Carica il caso con A = 2 e B = 4 e allinea le parole 0010 e 0100. Avanza confrontando il risultato zero di & con l’uno di &&: le posizioni attive sono diverse, mentre entrambe le condizioni sono vere. Carica poi «Un primo operando falso» e osserva il campo «B valutato» insieme all’esito logico zero."
    ],
    "lettura": "A sinistra i due vettori sono allineati per colonna e la riga inferiore contiene l’AND dei bit. A destra i riquadri trasformano ciascun valore in una condizione e indicano se B venga valutato prima del risultato di &&.",
    "conclusione": "L’AND dei bit conserva le posizioni condivise. L’AND logico restituisce 0 o 1 e valuta il secondo operando soltanto quando il primo risulta vero.",
    "controlli": {
      "a": "Primo operando intero fra 0 e 15, rappresentato con quattro bit; nell’AND logico zero è falso e ogni altro valore è vero.",
      "b": "Secondo operando. I suoi bit partecipano sempre al modello di &, mentre && lo valuta soltanto se A è vero."
    },
    "esperienze": [
      {
        "titolo": "Due numeri veri senza bit comuni",
        "parametri": {
          "a": 2,
          "b": 4
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: A = 2; B = 4.",
          "Allinea 0010 e 0100 e cerca eventuali colonne con due uno; valuta poi separatamente la verità di 2 e 4.",
          "Usa «Passo successivo» fino a «AND bit a bit». Leggi «Bit risultanti» e «A & B» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «AND logico». Confronta «A vero» e «B valutato» e «A && B» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «AND logico» si leggono: A vero = sì; B valutato = sì; A && B = 1.",
        "ragionamento": "I bit attivi di 2 e 4 occupano colonne differenti, quindi 0010 & 0100 dà 0000. Entrambi gli operandi sono diversi da zero: il confronto logico considera entrambe le condizioni vere e restituisce 1.",
        "attesi": [
          {
            "passo": 2,
            "campo": "A vero",
            "valore": "sì"
          },
          {
            "passo": 2,
            "campo": "B valutato",
            "valore": "sì"
          },
          {
            "passo": 1,
            "campo": "Bit risultanti",
            "valore": "0000"
          }
        ]
      },
      {
        "titolo": "Un primo operando falso",
        "parametri": {
          "a": 0,
          "b": 4
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: A = 0; B = 4.",
          "Porta A a zero e prevedi sia il vettore dell’AND sia la necessità di valutare B in &&.",
          "Usa «Passo successivo» fino a «AND bit a bit». Leggi «Bit risultanti» e «A & B» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «AND logico». Confronta «A vero» e «B valutato» e «A && B» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «AND logico» si leggono: A vero = no; B valutato = no; A && B = 0.",
        "ragionamento": "Con A = 0 l’AND bit a bit è zero in ogni colonna. Nell’AND logico la prima condizione è già falsa, perciò la valutazione di B viene saltata e il risultato è 0.",
        "attesi": [
          {
            "passo": 2,
            "campo": "A vero",
            "valore": "no"
          },
          {
            "passo": 2,
            "campo": "B valutato",
            "valore": "no"
          },
          {
            "passo": 1,
            "campo": "Bit risultanti",
            "valore": "0000"
          }
        ]
      }
    ]
  },
  "1.5.4": {
    "scopo": "La funzione A OR ¬A vale uno a segnali stabili. Durante una transizione i due rami possono arrivare in tempi diversi: confronterai due ritardi per capire quando nasca un impulso basso e quanto duri.",
    "teoria": [
      "Una porta OR produce uno quando almeno un segnale in ingresso vale uno. Si colleghi il segnale A a questa porta lungo due percorsi: il primo lo trasporta direttamente, mentre un invertitore lungo il secondo scambia zero e uno, producendo il segnale indicato con ¬A. A segnali stabili, una delle due entrate vale sempre uno e anche l’uscita F vale uno. Durante un cambiamento bisogna però considerare il tempo necessario a ciascun segnale per raggiungere la porta.",
      "All’istante iniziale A passa da uno a zero. Se il ramo diretto impiega 2 nanosecondi e quello invertito ne impiega 5, dopo 2 nanosecondi al primo ingresso è già arrivato lo zero. Il secondo ingresso conserva ancora il vecchio zero. La porta può tornare a produrre uno quando, al tempo 5, giunge il nuovo segnale invertito.",
      "L’intervallo basso dura dunque 5 − 2 = 3 nanosecondi, dove un nanosecondo è un miliardesimo di secondo. Per leggere il diagramma temporale si confrontano le due transizioni sulla stessa scala. La porta OR è qui considerata istantanea, perciò il suo tracciato riflette subito ogni variazione dei rami. Un ritardo di trasporto sposta ciascuna transizione in avanti di un intervallo fissato: il modello conserva tutte le transizioni e separa così il loro ordine di arrivo dall’ulteriore risposta fisica di una porta reale."
    ],
    "introduzione": [
      "La simulazione permette di capire perché una funzione costante a segnali stabili possa generare un impulso durante una transizione. A OR ¬A vale uno, però il ramo diretto e quello invertito trasportano il cambiamento con ritardi diversi. Quando A scende, può esistere un intervallo in cui entrambi gli ingressi della OR valgono zero; la sua durata dipende dall’ordine degli arrivi.",
      "Carica «Tre nanosecondi di impulso» e avanza sulla scala temporale comune ai quattro tracciati. Confronta l’arrivo dello zero sul ramo diretto a 2 ns con la salita del ramo invertito a 5 ns: l’uscita resta bassa per tre nanosecondi. Ripeti con il ramo diretto a 6 ns e osserva l’uscita sempre alta nel modello con OR istantanea."
    ],
    "lettura": "I quattro tracciati condividono la stessa scala temporale: ingresso A, ramo diretto, ramo invertito e uscita OR. Un tratto alto vale uno, un tratto basso zero; la linea verticale indica l’istante che il passo sta esaminando.",
    "conclusione": "Per la discesa di A, l’impulso basso esiste quando il ramo diretto scende prima che quello invertito salga. La durata è il massimo fra zero e ritardo invertito meno ritardo diretto; la OR è assunta istantanea e i rami usano ritardi di trasporto.",
    "controlli": {
      "diretto": "Tempo, in nanosecondi, impiegato dalla discesa di A per raggiungere direttamente la OR.",
      "inverso": "Tempo, in nanosecondi, dopo il quale la OR riceve la salita di ¬A. Un nanosecondo equivale a un miliardesimo di secondo."
    },
    "esperienze": [
      {
        "titolo": "Tre nanosecondi di impulso",
        "parametri": {
          "diretto": 2,
          "inverso": 5
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Ritardo del ramo diretto (ns) = 2; Ritardo del ramo invertito (ns) = 5.",
          "Segna la discesa del ramo diretto a 2 ns e la salita di quello invertito a 5 ns; trova l’intervallo in cui entrambi valgono zero.",
          "Usa «Passo successivo» fino a «Al tempo 5 ns». Leggi «Diretto» e «Invertito» e «F» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Durata dell’impulso». Confronta «Durata bassa» e «Uscita finale» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Durata dell’impulso» si leggono: Durata bassa = 3 ns; Uscita finale = 1.",
        "ragionamento": "Fra 2 ns e 5 ns il ramo diretto è già zero e quello invertito conserva ancora zero. La OR resta bassa per 5 − 2 = 3 ns, poi torna a uno.",
        "attesi": [
          {
            "passo": 3,
            "campo": "Durata bassa",
            "valore": "3 ns"
          },
          {
            "passo": 3,
            "campo": "Uscita finale",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Diretto",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Il ramo invertito arriva prima",
        "parametri": {
          "diretto": 6,
          "inverso": 5
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Ritardo del ramo diretto (ns) = 6; Ritardo del ramo invertito (ns) = 5.",
          "Confronta la salita invertita a 5 ns con la discesa diretta a 6 ns e cerca se rimanga un intervallo con due zeri.",
          "Usa «Passo successivo» fino a «Al tempo 6 ns». Leggi «Diretto» e «Invertito» e «F» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Durata dell’impulso». Confronta «Durata bassa» e «Uscita finale» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Durata dell’impulso» si leggono: Durata bassa = 0 ns; Uscita finale = 1.",
        "ragionamento": "Il ramo invertito sale a 5 ns mentre quello diretto conserva uno fino a 6 ns. Almeno un ingresso della OR rimane alto durante tutta la transizione, quindi la durata bassa è zero.",
        "attesi": [
          {
            "passo": 3,
            "campo": "Durata bassa",
            "valore": "0 ns"
          },
          {
            "passo": 3,
            "campo": "Uscita finale",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Diretto",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "1.5.5": {
    "scopo": "Un sommatore completo tratta una colonna binaria e il riporto proveniente dalla colonna precedente. Confronterai il totale con e senza riporto entrante per assegnare correttamente i pesi alle due uscite.",
    "teoria": [
      "Nella somma in colonna un riporto nasce quando le cifre della colonna contengono abbastanza unità da formarne una nella posizione successiva. In base due ne bastano due. Il circuito che tratta una colonna riceve quindi i due bit da sommare, A e B, e il riporto proveniente dalla colonna immediatamente a destra, chiamato Cin.",
      "Con A = 1, B = 1 e Cin = 0 il totale locale è due, scritto 10 in binario. La cifra di peso uno, S, vale zero e resta nella colonna corrente. La cifra di peso due, Cout, vale uno e passa alla colonna successiva. Se alla stessa coppia arriva anche un riporto, il totale è tre e si scrive 11, dunque entrambe le uscite valgono uno.",
      "Nel disegno G = A AND B indica la generazione del riporto: AND vale uno quando entrambi gli ingressi valgono uno. P = A XOR B indica la propagazione: XOR vale uno quando gli ingressi differiscono, situazione in cui un riporto entrante passerebbe oltre. La somma locale è S = P XOR Cin. Il riporto uscente è Cout = G OR (P AND Cin), dove OR richiede almeno un ingresso a uno: si produce quindi un riporto se la coppia lo genera già oppure se propaga quello entrante. Il controllo numerico finale riunisce S e Cout assegnando al secondo il peso due."
    ],
    "introduzione": [
      "Il sommatore completo rende visibile il collegamento fra porte logiche e somma binaria. Riceve due bit A e B e un riporto entrante Cin dalla colonna precedente. Restituisce il bit di somma S e il riporto uscente Cout, che appartiene alla posizione di peso doppio. Le due uscite rappresentano quindi il totale locale attraverso S + 2 × Cout.",
      "Carica «Sommare due uno» e avanza dai segnali P di propagazione e G di generazione del riporto alle uscite S = 0 e Cout = 1. Confronta il totale due con la parola binaria 10. Carica poi lo stesso caso con riporto entrante uno: S diventa uno e Cout resta uno. Usa l’ultima riga per verificare che 1 + 2 × 1 ricostruisca il totale tre."
    ],
    "lettura": "A sinistra compaiono A, B e Cin; i riquadri centrali producono P e G. A destra S conserva il bit della colonna corrente, mentre Cout rappresenta una unità nella colonna di peso doppio; l’ultima riga verifica S + 2 × Cout.",
    "conclusione": "Le uscite S e Cout rappresentano insieme il totale locale A + B + Cin. Il valore di Cout va moltiplicato per due perché appartiene alla posizione successiva.",
    "controlli": {
      "a": "Bit del primo addendo nella colonna corrente.",
      "b": "Bit del secondo addendo nella stessa colonna.",
      "c": "Riporto entrante Cin dalla colonna di peso immediatamente inferiore; nel totale locale conta come una unità."
    },
    "esperienze": [
      {
        "titolo": "Sommare due uno",
        "parametri": {
          "a": 1,
          "b": 1,
          "c": 0
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: A = 1; B = 1; Riporto entrante = 0.",
          "Somma 1 + 1 + 0 e scrivi due in binario, separando la cifra corrente da quella di riporto.",
          "Usa «Passo successivo» fino a «Riporto entrante». Leggi «S» e «Cout» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Verifica aritmetica». Confronta «A + B + Cin» e «S + 2 × Cout» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Verifica aritmetica» si leggono: A + B + Cin = 2; S + 2 × Cout = 2.",
        "ragionamento": "A XOR B dà P = 0, mentre A AND B dà G = 1. Con Cin = 0 si ottengono S = 0 e Cout = 1; 0 + 2 × 1 ricostruisce il totale due.",
        "attesi": [
          {
            "passo": 2,
            "campo": "A + B + Cin",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "S + 2 × Cout",
            "valore": "2"
          },
          {
            "passo": 1,
            "campo": "S",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Sommare due uno con riporto",
        "parametri": {
          "a": 1,
          "b": 1,
          "c": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: A = 1; B = 1; Riporto entrante = 1.",
          "Aggiungi un’unità di riporto al totale precedente e prevedi quali delle due uscite cambieranno.",
          "Usa «Passo successivo» fino a «Riporto entrante». Leggi «S» e «Cout» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Verifica aritmetica». Confronta «A + B + Cin» e «S + 2 × Cout» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Verifica aritmetica» si leggono: A + B + Cin = 3; S + 2 × Cout = 3.",
        "ragionamento": "La coppia A = B = 1 genera già un riporto. Cin = 1 porta S a uno, mentre Cout resta uno: 1 + 2 × 1 = 3 corrisponde alla parola binaria 11.",
        "attesi": [
          {
            "passo": 2,
            "campo": "A + B + Cin",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "S + 2 × Cout",
            "valore": "3"
          },
          {
            "passo": 1,
            "campo": "S",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "1.5.6": {
    "scopo": "Un controllo di stato può richiedere che siano presenti diversi bit contemporaneamente. Confronterai uno stato che soddisfa solo parte della maschera con uno che la soddisfa tutta, individuando esattamente le posizioni mancanti.",
    "teoria": [
      "In un dispositivo più condizioni possono essere raccolte in un unico byte di stato. Ogni posizione vale uno quando la condizione corrispondente è presente. Un programma che debba controllarne soltanto alcune prepara una seconda configurazione di otto bit, la maschera, nella quale scrive uno nelle posizioni da esaminare e zero nelle altre.",
      "L’operazione AND confronta i bit che si fronteggiano e conserva un uno soltanto dove lo trova su entrambi i lati. Con stato 5, cioè 00000101, e maschera 12, cioè 00001100, sopravvive soltanto 00000100. La maschera richiedeva anche la posizione di peso otto. Perciò la presenza del bit di peso quattro, presa da sola, lascia insoddisfatta la richiesta.",
      "Il simbolo & rappresenta l’AND bit a bit. Per stabilire se tutte le condizioni richieste siano presenti si confronta l’intersezione stato & maschera con la maschera intera. XOR restituisce uno quando i due bit confrontati differiscono: maschera XOR intersezione evidenzia quindi le sole posizioni richieste ancora assenti. Anche una maschera di otto zeri ha un significato preciso: poiché l’insieme delle condizioni richieste è vuoto, il confronto riesce per qualunque stato."
    ],
    "introduzione": [
      "L’esperimento aiuta a verificare più condizioni raccolte in un registro di stato. Ogni bit a uno della maschera indica una condizione richiesta; l’AND fra stato e maschera conserva quelle presenti. La richiesta è soddisfatta quando l’intersezione coincide con l’intera maschera. La differenza fra maschera e intersezione, calcolata con XOR, individua le condizioni ancora assenti.",
      "Carica «Una condizione richiesta manca» e allinea lo stato 00000101 con la maschera 00001100. Avanza fino all’intersezione 00000100, poi osserva il bit mancante di peso otto. Confronta il caso con stato 13: l’intersezione coincide con 00001100 e la riga dei mancanti contiene soltanto zeri. Leggi l’esito finale come verifica di tutte le posizioni richieste."
    ],
    "lettura": "Le quattro righe allineano stato, maschera, bit presenti e bit mancanti. Gli uno nella maschera definiscono le posizioni richieste; quelli nella riga mancanti segnalano le richieste che lo stato deve ancora soddisfare.",
    "conclusione": "Per chiedere tutti i bit della maschera si verifica (stato & maschera) = maschera. La presenza di un singolo bit richiesto è insufficiente quando la maschera ne seleziona più di uno.",
    "controlli": {
      "stato": "Byte delle condizioni presenti. Ogni uno indica una condizione attiva nella propria posizione.",
      "maschera": "Byte delle condizioni richieste: gli uno selezionano i bit che devono comparire nello stato."
    },
    "esperienze": [
      {
        "titolo": "Una condizione richiesta manca",
        "parametri": {
          "stato": 5,
          "maschera": 12
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Registro di stato = 5; Maschera richiesta = 12.",
          "Allinea 00000101 e 00001100; segna quale posizione richiesta sopravvive all’AND e quale manca.",
          "Usa «Passo successivo» fino a «Intersezione». Leggi «Stato & maschera» e «Bit richiesti presenti» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Verifica». Confronta «Bit mancanti» e «Tutti presenti» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Verifica» si leggono: Bit mancanti = 00001000; Tutti presenti = no.",
        "ragionamento": "L’AND di 5 e 12 vale 4, cioè 00000100. La maschera richiede anche il bit di peso 8, che manca: 00001100 XOR 00000100 dà 00001000 e la richiesta fallisce.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Bit mancanti",
            "valore": "00001000"
          },
          {
            "passo": 2,
            "campo": "Tutti presenti",
            "valore": "no"
          },
          {
            "passo": 1,
            "campo": "Stato & maschera",
            "valore": "00000100"
          }
        ]
      },
      {
        "titolo": "Entrambe le condizioni sono presenti",
        "parametri": {
          "stato": 13,
          "maschera": 12
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Registro di stato = 13; Maschera richiesta = 12.",
          "Porta lo stato a 00001101, mantenendo la richiesta 00001100; confronta l’intersezione con la maschera completa.",
          "Usa «Passo successivo» fino a «Intersezione». Leggi «Stato & maschera» e «Bit richiesti presenti» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Verifica». Confronta «Bit mancanti» e «Tutti presenti» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Verifica» si leggono: Bit mancanti = 00000000; Tutti presenti = sì.",
        "ragionamento": "Lo stato 13 contiene i bit di peso 8, 4 e 1. L’AND con 12 conserva 8 e 4, esattamente l’intera maschera; i bit mancanti sono zero e la richiesta riesce.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Bit mancanti",
            "valore": "00000000"
          },
          {
            "passo": 2,
            "campo": "Tutti presenti",
            "valore": "sì"
          },
          {
            "passo": 1,
            "campo": "Stato & maschera",
            "valore": "00001100"
          }
        ]
      }
    ]
  },
  "1.5.7": {
    "scopo": "Per sostituire un campo occorre prima liberare le posizioni che lo contengono. Aggiornerai la metà bassa di A5 con il valore 3, controllando che la metà alta resti identica.",
    "teoria": [
      "Un byte può contenere due informazioni distinte, ciascuna affidata a quattro degli otto bit disponibili. Poiché una sola cifra esadecimale rappresenta quattro bit, in una scrittura come 0xA5 la cifra A identifica la metà alta e 5 la metà bassa. Per aggiornare la seconda conservando la prima occorre isolare le posizioni interessate. Un gruppo di quattro bit è chiamato semibyte; il prefisso 0x indica la base sedici, nella quale A vale 10 e F vale 15. I bit si numerano da zero a partire dalla posizione più a destra.",
      "Si vuole scrivere 3 nella metà bassa di 0xA5. La maschera 0xF0 ha quattro uno nella metà alta e quattro zeri nella metà bassa. Con AND si conservano i bit per i quali la maschera vale uno e si ottiene 0xA0. Si accosta poi il nuovo campo 0x03 mediante OR, che accende ogni posizione in cui uno dei due operandi ha un uno. Il byte risultante è 0xA3.",
      "L’azzeramento preliminare permette di sostituire anche uno con zero, operazione che il solo OR lascerebbe incompiuta. Nel problema la verifica può quindi procedere metà per metà, confrontando le cifre alte prima e dopo e leggendo separatamente il valore entrato nelle quattro posizioni basse."
    ],
    "introduzione": [
      "La ricostruzione mostra come sostituire una parte di un byte preservando le posizioni esterne. Ogni cifra esadecimale occupa quattro bit, chiamati semibyte. Per cambiare la metà bassa di A5 si applica prima AND con F0, che la azzera conservando la metà alta; OR inserisce poi il nuovo valore nelle posizioni liberate.",
      "Leggi il byte iniziale come due campi, A e 5, e prevedi il risultato finale richiesto nel campo dedicato. Avanza con «Passo successivo» osservando l’intermedio A0 dopo l’azzeramento e A3 dopo l’inserimento di 03. Confronta separatamente le due cifre prima e dopo: la metà alta deve restare A, mentre quella bassa deve assumere esattamente il valore 3."
    ],
    "lettura": "La parola è divisa in due gruppi di quattro bit. La maschera F0 mantiene il gruppo alto e azzera quello basso; il secondo passaggio inserisce 03 nelle posizioni liberate.",
    "conclusione": "La sostituzione di un campo si compone di azzeramento e inserimento. Il controllo finale deve verificare sia il nuovo campo sia la conservazione dei bit esterni.",
    "procedura": [
      "Leggi A5 come due campi, A nelle posizioni 7…4 e 5 nelle posizioni 3…0.",
      "Prevedi il risultato di A5 AND F0 e avanza a «Azzerare il campo» per confrontarlo con A0.",
      "In «Inserire» applica OR con 03 e annota il byte risultante.",
      "Controlla separatamente che il gruppo alto resti A e quello basso sia diventato 3."
    ],
    "risultato": "Il byte aggiornato è 0xA3.",
    "ragionamento": "AND con F0 conserva i quattro bit alti e produce A0. Poiché i quattro bit bassi sono stati azzerati, OR con 03 li imposta esattamente al nuovo valore, formando A3."
  },
  "1.5.8": {
    "scopo": "Un aggiornamento può lasciare il byte apparentemente identico quando il campo aveva già il valore richiesto. Nell’esercizio 4, traccia 1, seguirai comunque maschera, azzeramento e inserimento per verificare la procedura.",
    "teoria": [
      "Un solo byte può contenere diverse impostazioni. Ciascuna occupa determinate posizioni, che formano un campo. Per modificarne una conservando le altre si prepara una maschera, ossia una parola binaria i cui uno individuano le posizioni su cui operare.",
      "Per liberare un campo si applica AND, che conserva un uno soltanto dove entrambi gli operandi valgono uno, usando una maschera con zeri nella zona da riscrivere e uno altrove. Si applica poi OR con il valore nuovo, già spostato nelle posizioni giuste. Poiché OR produce uno quando almeno un operando vale uno, il nuovo valore riempie il campo azzerato e gli zeri nelle posizioni esterne lasciano intatti i bit vicini.",
      "Per sostituire i bit 3 e 2, numerati da destra a partire da zero, la maschera è 00001100. L’operazione AND con 11110011 libera quei due posti. Se il nuovo campo vale 01, la parola 00000100 lo inserisce mediante OR e lascia alle altre posizioni il valore che avevano prima.",
      "Nel frammento C della prova, & indica AND, | indica OR e ~ inverte ciascun bit del suo operando. Lo spostamento a sinistra << 2 porta ogni bit due posizioni verso i pesi maggiori e lo spostamento a destra >> 2 riporta il campo alle posizioni basse. Il suffisso u, come in 3u, sceglie un intero senza segno; unsigned int è il relativo tipo. Il segno = assegna alla variabile a sinistra il risultato calcolato a destra. Il tipo può essere più largo di otto bit: la consegna osserva gli otto bit del byte, mentre i bit alti iniziali di x sono zero e rimangono zero."
    ],
    "introduzione": [
      "L’esercizio consente di controllare una sostituzione di campo anche quando il byte finale coincide con quello iniziale. La maschera individua le posizioni da aggiornare; il suo complemento permette di azzerarle con AND. Il nuovo valore, spostato nella posizione corretta, viene inserito con OR. La validità dell’operazione dipende dal contenuto del campo e dalla conservazione dei vicini.",
      "Carica l’esempio guidato dell’esercizio 4, traccia 1, e costruisci la maschera dei bit 3 e 2 contando da destra. Registra la previsione, poi segui A5 verso A1 durante l’azzeramento e di nuovo verso A5 inserendo 04. Confronta il campo iniziale e quello finale: entrambi valgono 01, cioè il valore uno richiesto dalla consegna."
    ],
    "lettura": "Le posizioni del campo sono i bit 3 e 2, contando da destra a partire da zero. La maschera li individua; la ricostruzione mostra prima la parola liberata e poi quella con il nuovo valore allineato.",
    "conclusione": "Il controllo di una sostituzione richiede di estrarre il campo finale e confrontarlo con il valore richiesto. Un risultato uguale al byte iniziale è corretto quando il campo conteneva già quel valore.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per l’esercizio 4, «Aggiornare un campo senza alterare i vicini», traccia 1.",
      "Disegna due uno e spostali di due posizioni: prevedi la maschera del campo e registra il suo valore decimale.",
      "Avanza seguendo l’azzeramento dei bit 3 e 2 di A5, poi l’inserimento di 01 nelle stesse posizioni.",
      "Apri la prova completa e verifica che (risultato AND 0C) spostato a destra di due restituisca 1."
    ],
    "risultato": "La maschera vale 12, cioè 0x0C. Il byte aggiornato vale 165, cioè 0xA5.",
    "ragionamento": "La maschera di due bit è 3, che spostata di due posti dà 12. A5 AND F3 produce A1; OR con 04 riporta ad A5, perché il campo originario aveva già il valore 01."
  },
  "1.5.9": {
    "scopo": "Quando due porte sono in cascata, l’uscita della prima diventa un dato per la seconda. Nell’esercizio 1, traccia 1, annoterai il segnale intermedio per seguire NAND e XOR senza saltare passaggi.",
    "teoria": [
      "In un circuito digitale si rappresentano due livelli di segnale con 0 e 1. Una porta logica riceve uno o più di questi segnali e ne produce uno secondo una regola fissa. Se l’uscita di una porta arriva all’ingresso di un’altra, il filo che le unisce ha un valore proprio, che si può annotare per seguire il calcolo.",
      "La porta AND vale uno se entrambi gli ingressi valgono uno. Una NAND ne rovescia l’uscita e dà quindi zero soltanto in quel caso. La porta XOR, che riceve il segnale prodotto dalla NAND e un altro ingresso, vale uno quando i due segnali che le arrivano sono diversi.",
      "Con A = 1 e B = 0, AND produce zero e la prima porta NAND lo inverte in uno. Alla seconda porta XOR arrivano quindi quel valore e il terzo ingresso C = 1; poiché coincidono, l’uscita finale vale zero. Annotare il valore sul filo intermedio rende controllabile il passaggio fra le due porte."
    ],
    "introduzione": [
      "Lo svolgimento rende esplicita la dipendenza fra due porte in cascata: l’uscita della prima costituisce un ingresso della seconda. La NAND inverte l’AND e restituisce zero soltanto quando entrambi i suoi ingressi valgono uno. La XOR successiva restituisce uno quando riceve segnali diversi. Annotare il valore intermedio consente di verificare separatamente le due regole.",
      "Carica l’esempio guidato dell’esercizio 1, traccia 1, e avanza partendo da A = 1 e B = 0. Calcola l’AND zero e osserva la NAND uno sul filo intermedio. Confronta poi quel segnale con C = 1 all’ingresso della XOR: essendo uguali, producono zero. Controlla entrambe le uscite richieste seguendo l’ordine delle connessioni."
    ],
    "lettura": "Il filo che unisce NAND e XOR conserva l’uscita intermedia. Leggi prima A e B sulla NAND, poi confronta il suo risultato con C all’ingresso della XOR.",
    "conclusione": "Per analizzare una cascata si risolve una porta alla volta nell’ordine delle dipendenze. Il segnale intermedio permette di controllare separatamente ogni regola logica.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per l’esercizio 1, «Seguire due porte in cascata», traccia 1.",
      "Con A = 1 e B = 0 calcola prima AND, poi inverti il suo valore per ottenere la NAND.",
      "Avanza fino al filo intermedio e annota il bit che raggiunge la seconda porta.",
      "Confronta quel bit con C = 1 usando la regola della XOR e verifica le due uscite finali."
    ],
    "risultato": "La NAND produce 1; la XOR successiva produce 0.",
    "ragionamento": "AND fra 1 e 0 vale zero, quindi la NAND lo inverte in uno. Alla XOR arrivano così 1 e 1: essendo uguali, producono zero."
  },
  "1.6.1": {
    "scopo": "Una frazione può essere ricostruita scegliendo i pesi binari dopo la virgola. Trasformerai due quantità espresse in ottavi in tre cifre binarie, seguendo il resto dopo ogni raddoppio.",
    "teoria": [
      "Anche dopo la virgola il valore di una cifra dipende dalla posizione. Come nella scrittura decimale si incontrano decimi, centesimi e millesimi, nella scrittura binaria si incontrano metà, quarti e ottavi. Per rappresentare 5/8 bisogna scegliere quali di questi pesi sommare. Una metà vale quattro ottavi, quindi per arrivare a cinque ottavi basta aggiungere un ottavo. Le tre cifre sono perciò 101.",
      "Il raddoppio della frazione consente di ottenere le stesse cifre in ordine. Raddoppiando 5/8 si ricava 10/8, cioè un intero più 2/8. L’intero uno diventa la prima cifra. Raddoppiando il resto 2/8 si ottiene 4/8, la cui parte intera zero diventa la seconda cifra. L’ultimo raddoppio porta a 8/8 e produce la cifra uno.",
      "La figura mantiene ogni resto in ottavi, così i passaggi si possono controllare senza approssimazioni. Leggendo 0,101 da sinistra a destra si ritrova infatti 1/2 + 0/4 + 1/8. Il denominatore otto garantisce che per tutti i numeratori proposti bastino queste tre posizioni."
    ],
    "introduzione": [
      "L’esperimento rende osservabile il valore delle cifre dopo la virgola binaria. Le prime tre posizioni pesano una metà, un quarto e un ottavo. Una frazione espressa in ottavi si può convertire raddoppiando il resto: la parte intera ottenuta fornisce la cifra successiva, mentre la parte frazionaria alimenta il passo seguente fino al completamento della rappresentazione.",
      "Carica «Cinque ottavi» e avanza seguendo separatamente cifra estratta e resto conservato a ogni raddoppio. Leggi infine 0,101 come 1/2 + 1/8 e confronta il totale con 5/8. Ripeti con «Tre ottavi»: la prima cifra è zero e le due successive sono uno. Le tre caselle permettono di verificare i pesi senza ricorrere a un’approssimazione decimale."
    ],
    "lettura": "La fila superiore suddivide l’unità in otto parti e marca quelle comprese nel numeratore. I tre riquadri inferiori hanno pesi 1/2, 1/4 e 1/8; ciascun raddoppio fa comparire la cifra che occupa il peso successivo.",
    "conclusione": "La parte intera di ogni raddoppio fornisce una cifra e il resto alimenta il passo successivo. Con denominatore otto bastano tre posizioni, poiché 8 = 2³.",
    "controlli": {
      "n": "Numeratore della frazione n/8, compreso tra zero e sette. Si usa una frazione inferiore a uno per studiare soltanto le posizioni dopo la virgola."
    },
    "esperienze": [
      {
        "titolo": "Cinque ottavi",
        "parametri": {
          "n": 5
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Numeratore su otto = 5.",
          "Prevedi quali pesi fra 1/2, 1/4 e 1/8 compongano 5/8; poi controlla le cifre ottenute raddoppiando il resto.",
          "Usa «Passo successivo» fino a «Posizione 2». Leggi «Doppio» e «Cifra» e «Resto» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Ricostruzione». Confronta «Scrittura binaria» e «Pesi» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Ricostruzione» si leggono: Scrittura binaria = 0,101; Pesi = 1/2 + 1/8.",
        "ragionamento": "Il primo raddoppio dà 10/8, cioè 1 più 2/8; il secondo dà 4/8 e il terzo 8/8. Le parti intere sono 1, 0, 1, dunque 0,101 = 1/2 + 1/8 = 5/8.",
        "attesi": [
          {
            "passo": 4,
            "campo": "Scrittura binaria",
            "valore": "0,101"
          },
          {
            "passo": 4,
            "campo": "Pesi",
            "valore": "1/2 + 1/8"
          },
          {
            "passo": 2,
            "campo": "Doppio",
            "valore": "4/8"
          }
        ]
      },
      {
        "titolo": "Tre ottavi",
        "parametri": {
          "n": 3
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Numeratore su otto = 3.",
          "Raddoppia inizialmente 3/8: la parte intera vale zero; prosegui conservando il resto in ottavi.",
          "Usa «Passo successivo» fino a «Posizione 2». Leggi «Doppio» e «Cifra» e «Resto» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Ricostruzione». Confronta «Scrittura binaria» e «Pesi» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Ricostruzione» si leggono: Scrittura binaria = 0,011; Pesi = 1/4 + 1/8.",
        "ragionamento": "I raddoppi producono 6/8, poi 12/8 e infine 8/8, con parti intere 0, 1, 1. La scrittura 0,011 vale 1/4 + 1/8 = 3/8.",
        "attesi": [
          {
            "passo": 4,
            "campo": "Scrittura binaria",
            "valore": "0,011"
          },
          {
            "passo": 4,
            "campo": "Pesi",
            "valore": "1/4 + 1/8"
          },
          {
            "passo": 2,
            "campo": "Doppio",
            "valore": "12/8"
          }
        ]
      }
    ]
  },
  "1.6.2": {
    "scopo": "Una parola binary32 conserva il segno, la scala e le cifre di una misura in campi distinti. Decodificherai un numero positivo e uno negativo, seguendo l’ordine necessario per scegliere la regola di lettura.",
    "teoria": [
      "Per rappresentare grandezze molto diverse, un calcolatore può conservare separatamente le cifre significative di un numero e il fattore che ne stabilisce la scala. Il formato binary32 dello standard IEEE 754 riserva 32 bit a questo scopo. Il primo, S, indica il segno. I successivi otto formano E, l’esponente codificato, e gli ultimi ventitré formano F, il campo della frazione. Un esponente conta quante volte si moltiplica per due: 2³ vale 8, 2⁰ vale 1 e 2⁻³ vale 1/8. Per leggere la parola esadecimale si sostituisce ogni cifra con quattro bit, conservando gli zeri iniziali, e si separano i gruppi di lunghezza 1, 8 e 23 da sinistra.",
      "Un numero normale appartiene alla classe con E compreso fra 1 e 254. La sua parte significativa, detta significanda, vale 1 + F/2²³: F è il valore intero dei ventitré bit del campo, e dividerlo per 2²³ colloca quelle cifre dopo la virgola binaria. L’uno iniziale è sottinteso. Per ottenere l’esponente effettivo si sottrae 127 da E; il bit S vale 0 per il segno positivo e 1 per quello negativo. Nella parola 0x3F800000, la cui prima parte binaria è 0 | 01111111, si leggono S = 0, E = 127 e F = 0. Il numero vale quindi 1 × 2⁰ = 1.",
      "I due valori estremi del campo E richiedono regole proprie. Con E uguale a zero compare soltanto la parte frazionaria F/2²³ e la scala è 2⁻¹²⁶. Se F vale uno, il prodotto è 2⁻¹⁴⁹, il più piccolo numero subnormale positivo. Se F vale zero, resta lo zero con il segno prescritto da S. Con E uguale a 255, F uguale a zero indica un infinito e F diverso da zero indica NaN, la codifica di un risultato privo di valore numerico. Si legge quindi la classe prima di applicare una formula."
    ],
    "introduzione": [
      "La simulazione permette di leggere una parola binary32 separando tre campi: un bit di segno, otto di esponente e ventitré di frazione. La classe del numero stabilisce la regola di interpretazione. Per un numero normale si aggiunge l’uno implicito alla frazione e si sottrae 127 all’esponente codificato; segno e potenza di due completano il valore.",
      "Carica «La rappresentazione di uno» e avanza dai campi S = 0, E = 127, F = 0 alla classe normale e al valore 1. Confronta il caso negativo C0200000: osserva il segno, la significanda 1,25 e la scala due che producono −2,5. Seleziona poi 7F800000 e applica i parametri per vedere perché una classe speciale richiede un’altra regola."
    ],
    "lettura": "La striscia dei 32 bit è divisa in S, esponente e frazione. Il riquadro «classe» stabilisce la regola da applicare; la freccia conduce poi al valore calcolato usando quei campi.",
    "conclusione": "La decodifica richiede prima la classificazione mediante E e F, poi la formula appropriata. Per i numeri normali il valore è (−1)^S × (1 + F/2²³) × 2^(E−127).",
    "controlli": {
      "word": "Otto cifre esadecimali della parola binary32. Le scelte includono numeri normali, un subnormale, zero negativo, infinito e NaN per confrontare le rispettive regole."
    },
    "esperienze": [
      {
        "titolo": "La rappresentazione di uno",
        "parametri": {
          "word": "3F800000"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Parola esadecimale = 3F800000.",
          "Preleva S, E e F da 3F800000; con E = 127 prevedi la potenza di due effettiva.",
          "Usa «Passo successivo» fino a «Regola di lettura». Leggi «Classe» e «Bit frazione» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Valore». Confronta «Parola» e «Risultato» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Valore» si leggono: Parola = 0x3F800000; Risultato = 1.",
        "ragionamento": "I campi sono S = 0, E = 127 e F = 0. Il numero è normale, quindi la significanda è 1 e la scala è 2⁰; il risultato è +1.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Parola",
            "valore": "0x3F800000"
          },
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "1"
          },
          {
            "passo": 1,
            "campo": "Classe",
            "valore": "normale"
          }
        ]
      },
      {
        "titolo": "Un numero negativo con frazione",
        "parametri": {
          "word": "C0200000"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Parola esadecimale = C0200000.",
          "Preleva i tre campi di C0200000 e ricava il segno, l’esponente E − 127 e la frazione F/2²³.",
          "Usa «Passo successivo» fino a «Regola di lettura». Leggi «Classe» e «Bit frazione» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Valore». Confronta «Parola» e «Risultato» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Valore» si leggono: Parola = 0xC0200000; Risultato = -2,5.",
        "ragionamento": "I campi sono S = 1, E = 128 e F = 2097152. La frazione è 1/4, la significanda 1,25 e la scala 2¹; applicando il segno si ottiene −2,5.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Parola",
            "valore": "0xC0200000"
          },
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "-2,5"
          },
          {
            "passo": 1,
            "campo": "Classe",
            "valore": "normale"
          }
        ]
      }
    ]
  },
  "1.6.3": {
    "scopo": "La distanza fra due valori binary32 consecutivi dipende dalla loro grandezza. Osserverai la potenza di due scelta e il suo successore per capire come la precisione assoluta cambi con la scala.",
    "teoria": [
      "Il calcolatore conserva una misura usando un numero finito di cifre. Ne segue che, anche quando due numeri reali sono vicinissimi, può esserci spazio per rappresentarne soltanto uno. Per misurare questa granularità si prende un valore registrabile, si cerca il più piccolo valore registrabile che lo supera, detto successore, e si calcola la loro distanza.",
      "Nel formato a 32 bit chiamato binary32 un numero positivo normale si scrive come una parte significativa che comincia con 1, seguita da ventitré cifre binarie frazionarie, moltiplicata per una potenza di due. Attorno a 1 il contributo dell’ultima cifra vale 2⁻²³. Attorno a 2, sul lato dei valori più grandi, la medesima cifra viene moltiplicata per due e vale 2⁻²². Le cifre significative sono quindi ventiquattro, contando anche l’uno iniziale. La scrittura 2⁻²³ significa 1/2²³: l’esponente negativo produce una frazione.",
      "Con esponente 23 la potenza iniziale è 8 388 608. Aggiungendo uno all’ultima posizione della parola codificata si raggiunge 8 388 609. Con esponente 24 il passo verso destra è già due. La figura mostra così perché uno stesso numero di cifre, quando serve a rappresentare quantità più grandi, separi valori consecutivi di una distanza maggiore. Nelle quantità stampate, e-7 abbrevia la moltiplicazione per 10⁻⁷: 1,1920928955078125e-7 rappresenta quindi 0,00000011920928955078125. L’incremento della parola riguarda la sua codifica binaria; la differenza numerica fra i valori decodificati è proprio la distanza cercata."
    ],
    "introduzione": [
      "Il laboratorio mostra come la precisione assoluta di binary32 cambi con la grandezza del numero. Il successore è il più piccolo valore rappresentabile maggiore di quello scelto; la distanza fra i due misura qui una ULP. Sopra la potenza 2^e questa distanza vale 2^(e−23), perché la significanda normale dispone di ventitré posizioni frazionarie oltre all’uno iniziale.",
      "Carica «Il successore di uno» e avanza confrontando le parole 3F800000 e 3F800001 con i valori che rappresentano. Fissa il risultato, poi carica il successore di 2²⁴: 16777216 è seguito da 16777218. Confronta le distanze numeriche, anche se la parentesi disegnata appare simile: la figura ingrandisce localmente intervalli che hanno ampiezze molto diverse."
    ],
    "lettura": "I due punti mostrano parole consecutive vicino alla potenza di due selezionata. La parentesi misura una ULP, cioè la distanza fra i due valori rappresentabili; la figura è una lente locale e la stessa larghezza grafica può corrispondere a distanze numeriche diverse.",
    "conclusione": "Sopra la potenza 2^e, nell’intervallo considerato, il passo binary32 vale 2^(e−23). Ventiquattro cifre significative danno quindi una distanza assoluta più grande quando cresce l’esponente.",
    "controlli": {
      "e": "Esponente della potenza iniziale 2^e. Il modello cerca il valore binary32 immediatamente maggiore sul lato destro della potenza scelta."
    },
    "esperienze": [
      {
        "titolo": "Il successore di uno",
        "parametri": {
          "e": 0
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Esponente della potenza di due = 0.",
          "Vicino a uno l’ultima cifra frazionaria pesa 2⁻²³; prevedi il salto prodotto dall’incremento della parola codificata.",
          "Usa «Passo successivo» fino a «Successore». Leggi «Parola successiva» e «Successore» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Distanza». Confronta «Esponente del passo» e «Distanza» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Distanza» si leggono: Esponente del passo = -23; Distanza = 1,1920928955078125e-7.",
        "ragionamento": "Per e = 0 il passo è 2⁻²³ = 0,00000011920928955078125. Incrementando 0x3F800000 si ottiene il successore di 1, la cui stampa nel browser arrotonda soltanto le ultime cifre decimali mostrate.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Esponente del passo",
            "valore": "-23"
          },
          {
            "passo": 2,
            "campo": "Distanza",
            "valore": "1,1920928955078125e-7"
          },
          {
            "passo": 1,
            "campo": "Parola successiva",
            "valore": "0x3F800001"
          }
        ]
      },
      {
        "titolo": "Il successore di 2²⁴",
        "parametri": {
          "e": 24
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Esponente della potenza di due = 24.",
          "Sostituisci e = 24 nella formula 2^(e−23) e prevedi se il successore si trovi una o due unità più avanti.",
          "Usa «Passo successivo» fino a «Successore». Leggi «Parola successiva» e «Successore» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Distanza». Confronta «Esponente del passo» e «Distanza» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Distanza» si leggono: Esponente del passo = 1; Distanza = 2.",
        "ragionamento": "Per e = 24 il passo è 2¹ = 2. Il valore iniziale 16777216 ha quindi come successore 16777218; un intero intermedio richiederebbe più precisione.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Esponente del passo",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Distanza",
            "valore": "2"
          },
          {
            "passo": 1,
            "campo": "Parola successiva",
            "valore": "0x4B800001"
          }
        ]
      }
    ]
  },
  "1.6.4": {
    "scopo": "Prima di sommare due numeri in virgola mobile bisogna allineare le loro cifre allo stesso esponente. Sposterai il secondo contributo fino al limite della precisione per capire come intervenga l’arrotondamento.",
    "teoria": [
      "Un numero binario positivo normale si può scrivere come una parte significativa che comincia con 1, chiamata significanda, moltiplicata per una potenza di due. Questa forma è detta normalizzata. Per sommare due numeri con potenze diverse occorre riferire le cifre allo stesso peso. Nella somma 1 + 2⁻ᵏ, dove 2⁻ᵏ significa 1/2ᵏ, si sceglie come riferimento l’unità. Se k vale 2, il contributo del secondo addendo cade due posizioni a destra della virgola binaria. Si ottiene 1,01 in base due, cioè 1,25 in decimale.",
      "Il formato binary32 dispone, vicino a 1, di ventitré posizioni frazionarie utilizzabili. Con k = 23 il secondo addendo accende proprio l’ultima di quelle posizioni e porta al successore di 1. Con k = 24 la somma matematica cade invece a metà strada fra 1 e il successore. Per scegliere fra i due si applica la regola di arrotondamento al più vicino, con preferenza, a parità di distanza, per l’ultima cifra pari.",
      "In binario l’unica cifra pari è zero. Poiché la scrittura di 1 termina con zero e quella del successore con uno, in questo caso si conserva 1. Nella figura i due valori da confrontare sono la somma esatta dopo l’allineamento e il numero che può essere effettivamente registrato. Per k maggiore di 24 la somma è più vicina a 1 e viene ancora arrotondata a 1. All’altro estremo, k = 0 produce 1 + 1 = 2: la forma normalizzata diventa 1 × 2¹ e cambia l’esponente."
    ],
    "introduzione": [
      "Questa somma simulata spiega come allineamento e precisione determinino il risultato in virgola mobile. Per sommare 1 e 2⁻ᵏ, le cifre del secondo contributo vengono spostate di k posizioni rispetto all’unità. Binary32 conserva ventiquattro cifre significative; quando la somma cade fra due valori disponibili, l’arrotondamento sceglie il più vicino e, in caso di pareggio, quello con ultimo bit zero.",
      "Carica il contributo con k = 2 e segui lo spostamento che produce 1,25, rappresentabile esattamente. Confronta poi «Un contributo esattamente a metà», con k = 24. Osserva il bit oltre la tacca di precisione e confronta la somma matematica con il risultato memorizzato 1: il pareggio riguarda 1 e il suo successore, dei quali il primo termina con bit zero."
    ],
    "lettura": "Le righe A e B mostrano le significande. All’inizio ciascuna ha un uno nella propria posizione iniziale; dopo l’allineamento l’uno di B si sposta di k colonne. La tacca verticale separa le 24 cifre disponibili dalle posizioni usate per decidere l’arrotondamento. Il campo «Somma esatta» indica il valore matematico 1 + 2⁻ᵏ; la sua scrittura decimale sullo schermo può essere abbreviata.",
    "conclusione": "Un contributo può essere esatto nella somma matematica e perdere effetto quando il risultato viene arrotondato. Il caso a metà fra due valori usa la regola del pareggio al pari, riferita all’ultimo bit conservato.",
    "controlli": {
      "k": "Differenza fra gli esponenti nella somma 1 + 2^−k. Dopo l’allineamento, il secondo uno si trova k posizioni a destra dell’unità."
    },
    "esperienze": [
      {
        "titolo": "Un contributo dentro la precisione",
        "parametri": {
          "k": 2
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Differenza tra gli esponenti = 2.",
          "Colloca il secondo uno due posizioni dopo la virgola e calcola 1 + 1/4.",
          "Usa «Passo successivo» fino a «Allineamento». Leggi «Spostamento» e «Contributo» e «Somma esatta» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Risultato binary32». Confronta «Risultato» e «Parola» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Risultato binary32» si leggono: Risultato = 1,25; Parola = 0x3FA00000.",
        "ragionamento": "Con k = 2 si sommano 1 e 0,25, entrambi esatti in binario. Il risultato 1,25 rientra nelle cifre disponibili e si codifica nella parola 0x3FA00000.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "1,25"
          },
          {
            "passo": 2,
            "campo": "Parola",
            "valore": "0x3FA00000"
          },
          {
            "passo": 1,
            "campo": "Spostamento",
            "valore": "2 posizioni"
          }
        ]
      },
      {
        "titolo": "Un contributo esattamente a metà",
        "parametri": {
          "k": 24
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Differenza tra gli esponenti = 24.",
          "Colloca il secondo uno alla posizione 24: confronta 2⁻²⁴ con metà della distanza 2⁻²³ fra 1 e il suo successore.",
          "Usa «Passo successivo» fino a «Allineamento». Leggi «Spostamento» e «Contributo» e «Somma esatta» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Risultato binary32». Confronta «Risultato» e «Parola» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Risultato binary32» si leggono: Risultato = 1; Parola = 0x3F800000.",
        "ragionamento": "La somma 1 + 2⁻²⁴ è a metà fra 1 e il successore. La significanda di 1 termina con bit zero, quindi il pareggio al pari conserva 1 e la parola 0x3F800000.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Parola",
            "valore": "0x3F800000"
          },
          {
            "passo": 1,
            "campo": "Spostamento",
            "valore": "24 posizioni"
          }
        ]
      }
    ]
  },
  "1.6.5": {
    "scopo": "Due parole con lo stesso esponente estremo possono appartenere a classi diverse. Confronterai frazione zero e frazione uno con E = 255, per capire perché occorra esaminare anche il campo frazione.",
    "teoria": [
      "Una parola in virgola mobile può descrivere una misura ordinaria oppure una situazione per cui il formato prevede una codifica particolare. Nel formato binary32 ogni parola ha 32 bit, raggruppati in un bit di segno, otto bit di esponente e ventitré bit di frazione. Il termine campo indica uno di questi gruppi, al quale il formato attribuisce un compito preciso.",
      "Nel problema le due parole hanno segno zero ed esponente codificato 255, cioè tutti gli otto bit dell’esponente a uno. Questo valore segnala una classe speciale e richiede di esaminare il campo frazione. Una frazione composta da soli zeri designa l’infinito positivo; una frazione diversa da zero designa NaN.",
      "NaN è la sigla inglese di Not a Number e identifica una codifica priva di valore numerico ordinario. Per esempio, zero diviso zero nell’aritmetica in virgola mobile segnala un’operazione non valida; quando tale segnalazione lascia proseguire il calcolo, il risultato restituito è un NaN. Con E = 255 basta un solo bit attivo della frazione per distinguere questa classe dall’infinito. La simulazione riconosce la classe della parola, senza eseguire ulteriori operazioni su di essa."
    ],
    "introduzione": [
      "Il problema svolto serve a riconoscere due classi speciali del formato binary32. Quando tutti gli otto bit dell’esponente valgono uno, il campo E vale 255 e la formula dei numeri normali cede il posto a una classificazione. La frazione zero identifica un infinito; una frazione diversa da zero identifica NaN, una codifica priva di valore numerico ordinario.",
      "Leggi le due parole iniziali, entrambe con segno zero ed esponente 255, e prevedi la classe richiesta quando la frazione è diversa da zero. Avanza con «Passo successivo» confrontando il caso F = 0 con F = 1. Osserva che il solo bit attivo della seconda frazione basta a passare dall’infinito positivo alla classe NaN."
    ],
    "lettura": "La ricostruzione mantiene segno ed esponente uguali nelle due parole e modifica soltanto la frazione. Il riquadro della classe collega quella differenza all’infinito oppure a NaN.",
    "conclusione": "Con E = 255 il campo frazione distingue infinito e NaN. La classificazione dei campi precede qualsiasi formula per i numeri normali.",
    "procedura": [
      "Leggi i dati: entrambe le parole hanno segno 0 ed esponente codificato 255, mentre cambia la frazione.",
      "In «Separare i campi» verifica quali gruppi restino uguali.",
      "In «Frazione nulla» osserva la classe dell’insieme con F = 0.",
      "In «Frazione diversa da zero» confronta F = 1 con il caso precedente e verifica la risposta alla previsione."
    ],
    "risultato": "La prima parola rappresenta +∞. La seconda, con frazione diversa da zero, appartiene alla classe NaN.",
    "ragionamento": "Il valore estremo E = 255 attiva le regole speciali del formato. F = 0 indica infinito con il segno assegnato; F diverso da zero indica NaN, una codifica priva di valore numerico ordinario."
  },
  "1.6.6": {
    "scopo": "Un incremento intero può essere più piccolo del salto fra due valori in virgola mobile. Nell’esercizio 5, traccia 1, localizzerai 2²⁴ + 1 fra i valori binary32 adiacenti e applicherai il pareggio al pari.",
    "teoria": [
      "Una misura in virgola mobile conserva un numero finito di cifre significative e un esponente che ne stabilisce la scala. Aumentando la grandezza dei valori, aumenta anche la distanza tra due numeri consecutivi che si possono memorizzare. Di conseguenza la somma matematica e il numero scritto nel registro possono differire.",
      "Nel formato binary32 un numero normale ha ventiquattro cifre binarie significative, contando anche quella iniziale. Questo gruppo di cifre si chiama significanda: le ventitré posizioni dopo l’uno iniziale danno all’ultima il peso 2⁻²³, che alla scala 2²⁴ diventa 2²⁴ × 2⁻²³ = 2. Fra 2²⁴ incluso e 2²⁵ escluso si può quindi memorizzare un intero ogni due. Per scrivere un intero dispari nell’intervallo occorre scegliere fra i due vicini.",
      "La somma 16777216 + 1 cade esattamente a metà fra 16777216 e 16777218. Nella modalità di arrotondamento al più vicino con pareggio al pari decide l’ultimo bit conservato della significanda. Dividendo i candidati per il passo due, il primo corrisponde a 8388608, pari, e il secondo a 8388609, dispari. Il primo viene quindi conservato e diventa l’operando di un’eventuale addizione successiva.",
      "Nel listato, float dichiara una variabile in virgola mobile che la consegna assume nel formato binary32; il suffisso f in 1.0f assegna lo stesso tipo alla costante. Il punto separa la parte intera da quella decimale nella sintassi del C. In x = x + 1.0f, il valore corrente di x entra nella somma e il risultato arrotondato viene assegnato di nuovo a x, diventando il punto di partenza dell’operazione successiva."
    ],
    "introduzione": [
      "L’esercizio aiuta a spiegare perché aggiungere uno a un valore float possa lasciarlo invariato nelle condizioni dichiarate. In binary32, fra 2²⁴ incluso e 2²⁵ escluso, i valori consecutivi distano due. La somma matematica con uno cade quindi nel punto medio; l’arrotondamento al più vicino con pareggio al pari sceglie il candidato la cui significanda intera termina con zero.",
      "Carica l’esempio guidato dell’esercizio 5, traccia 1. Calcola 16777216 + 1 fra interi e premi «Registra la previsione». Avanza collocando 16777217 fra i candidati 16777216 e 16777218. Confronta poi i loro indici rispetto al passo due: 8388608 è pari e 8388609 dispari. Il risultato memorizzato torna quindi al valore iniziale."
    ],
    "lettura": "La retta confronta la somma matematica con i due valori rappresentabili adiacenti. La scelta finale dipende dall’ultimo bit della significanda conservata, illustrato dal confronto dei due candidati.",
    "conclusione": "Ogni operazione memorizza un valore rappresentabile alla precisione scelta. Quando la somma esatta cade a metà fra due candidati, il pareggio al pari sceglie quello con l’ultimo bit significativo zero.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per l’esercizio 5, «Perdita di un incremento in binary32», traccia 1.",
      "Calcola fra interi la somma 16777216 + 1 e registra questa previsione nel primo campo.",
      "Avanza nello svolgimento e colloca la somma esatta fra 16777216 e 16777218, separati da un passo di due.",
      "Apri la prova completa e indica il valore memorizzato dopo aver applicato il pareggio al pari; confrontalo con la somma matematica."
    ],
    "risultato": "La somma matematica è 16777217, mentre il valore binary32 memorizzato rimane 16777216.",
    "ragionamento": "Vicino a 2²⁴, sul lato superiore, il passo è 2^(24−23) = 2. La somma è equidistante dai due candidati; dividendo per il passo si ottengono 8388608 e 8388609, e il primo ha significanda pari, quindi viene scelto."
  },
  "1.6.7": {
    "scopo": "Per decodificare una parola normale si devono ricostruire significanda e scala. Nell’esercizio 4, traccia 1, userai i campi di 0x3FC00000 per ottenere un valore esatto senza confondere l’esponente codificato con quello effettivo.",
    "teoria": [
      "Una scrittura come 1,5 × 2³ separa le cifre significative dalla scala. Il formato binary32 applica la stessa idea in base due e distribuisce l’informazione su 32 bit. Per i numeri normali, cioè quelli ai quali si applica l’uno iniziale implicito, l’esponente reale si ottiene sottraendo 127 dal valore del campo esponente. La costante 127 è chiamata bias: aggiunta in codifica e sottratta in decodifica, permette di rappresentare esponenti positivi e negativi mediante un campo letto senza segno. Nei numeri normali il campo E assume valori da 1 a 254.",
      "Nella significanda binaria di un numero normale, la cifra che precede la virgola è sempre uno. Il formato la sottintende e riserva il campo frazione alle cifre successive. Rimane un bit separato per il segno, che si applica dopo aver ricostruito la grandezza della misura.",
      "Per estrarre i campi da 0x3FC00000 si traduce ogni cifra esadecimale in quattro bit: 3 F C diventano 0011 1111 1100. Separando da sinistra un bit di segno e otto di esponente si ottiene 0 | 01111111 | 100…. Il campo esponente vale 127 e dà la scala 2⁰ = 1. Il primo uno della frazione pesa un mezzo; le posizioni successive, tutte a zero, avrebbero pesi un quarto, un ottavo e così via. Aggiungendo l’uno implicito si ricostruisce la significanda binaria 1,1, che vale 1,5 in decimale. Il segno positivo e la scala uno danno infine 1,5 × 1 = 1,5."
    ],
    "introduzione": [
      "La ricostruzione permette di decodificare un numero normale binary32 distinguendo esponente codificato ed esponente reale. Il bias 127 è una costante aggiunta in codifica e sottratta in lettura. La significanda comprende inoltre un uno iniziale implicito, seguito dai bit della frazione. Ricomporre questi elementi separatamente permette di controllare segno, grandezza e scala del valore ottenuto.",
      "Carica l’esempio guidato dell’esercizio 4, traccia 1, e avanza nella separazione di 0x3FC00000. Confronta il campo E = 127 con l’esponente reale zero; leggi poi il primo bit della frazione come un mezzo e aggiungi l’uno implicito. La significanda 1,5, il segno positivo e la scala 2⁰ ricostruiscono il risultato finale 1,5."
    ],
    "lettura": "I gruppi della parola distinguono segno, otto bit di esponente e ventitré di frazione. La ricostruzione esplicita l’uno iniziale della significanda e sottrae il bias prima di applicare la potenza di due.",
    "conclusione": "Per i numeri normali binary32 l’uno iniziale è implicito e il bias dell’esponente è 127. Ricostruire separatamente questi due elementi rende controllabile la conversione della parola in un numero.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per l’esercizio 4, «Passare fra un numero normale e la parola binary32», traccia 1.",
      "Separa segno, esponente e frazione di 3FC00000; verifica che l’esponente sia 01111111.",
      "Avanza e aggiungi l’uno implicito alla frazione 0,5 per ottenere la significanda.",
      "Applica segno e scala 2^(127−127), poi confronta il valore con il risultato dello svolgimento."
    ],
    "risultato": "L’esponente codificato E vale 127 e il numero rappresentato è 1,5.",
    "ragionamento": "Il segno zero rende positivo il risultato. La significanda vale 1 + 0,5 = 1,5 e l’esponente effettivo è 127 − 127 = 0; moltiplicare per 2⁰ conserva 1,5."
  },
  "1.7.1": {
    "scopo": "Un record ricevuto può interrompersi nel mezzo di un campo. Farai avanzare il cursore lungo una copia di quattordici byte e una completa, per riconoscere la verifica che deve precedere ogni interpretazione.",
    "teoria": [
      "Un sensore deve inviare il proprio nome insieme a due misure. Perché il destinatario possa distinguere queste informazioni in una successione di byte, mittente e lettore seguono uno stesso formato, qui chiamato TLM1. Un insieme di informazioni così organizzato prende il nome di record. Ogni sua parte, detta campo, occupa un intervallo preciso della sequenza. Un byte raccoglie otto bit, ciascuno uguale a zero o uno; il buffer è la zona di memoria che conserva i byte ricevuti. L’offset conta quanti byte precedono una posizione, partendo da zero. Gli indicatori del record, chiamati anche flag, occupano singole posizioni di un byte e segnalano condizioni del sensore.",
      "La firma iniziale, composta dai quattro caratteri TLM1, permette di riconoscere il formato. Seguono un byte di indicatori e un byte che dice quanto è lungo il nome. Nel record proposto il nome «Aè» usa tre byte perché la codifica del testo, UTF-8, ne assegna uno ad A e due a è. Alla fine del nome sono stati quindi consumati 4 + 1 + 1 + 3 = 9 byte.",
      "La temperatura occupa i due byte successivi e la tensione gli ultimi quattro. Se alla ricezione sono disponibili quattordici byte, dopo la temperatura ne restano tre. Il lettore si ferma all’inizio della tensione perché occorrerebbe l’intero campo per interpretarla. Nella striscia il cursore segna sempre la prima posizione che attende ancora di essere consumata."
    ],
    "introduzione": [
      "La simulazione permette di seguire un lettore che verifica la disponibilità dei byte campo per campo. Il record TLM1 riunisce firma, indicatori, lunghezza del nome, nome e due misure. Il cursore conta i byte già consumati e individua l’inizio del campo successivo. La larghezza richiesta dal formato deve rientrare nel residuo disponibile prima che la lettura possa avanzare.",
      "Carica «Il campo tensione è incompleto» e percorri i campi fino al cursore 11. Confronta i quattro byte richiesti per la tensione con i tre residui della copia di quattordici byte. Fissa l’esito per confronto e carica il record completo: il byte aggiuntivo permette di leggere l’ultimo campo e raggiungere il cursore 15. La croce individua la posizione assente."
    ],
    "lettura": "La striscia raggruppa i byte per campo e mostra sotto ciascuno l’offset nel buffer. La regione evidenziata è il campo richiesto nel passo; il cursore indica la sua posizione iniziale e la zona oltre i byte ricevuti segnala la parte indisponibile.",
    "conclusione": "La struttura del formato stabilisce larghezze e confini. Prima di leggere un campo il lettore confronta la larghezza richiesta con i byte residui, evitando di attribuire un valore a dati incompleti.",
    "controlli": {
      "n": "Numero di byte ricevuti dall’inizio del record campione, lungo 15 byte. Riducendo n si simula un troncamento del trasferimento."
    },
    "esperienze": [
      {
        "titolo": "Il campo tensione è incompleto",
        "parametri": {
          "n": 14
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Byte disponibili del record = 14.",
          "Conta sei byte iniziali, tre di nome e due di temperatura; calcola quanti dei quattordici byte restino per la tensione.",
          "Usa «Passo successivo» fino a «Lettura del campo nome UTF-8». Leggi «Offset» e «Byte» e «Cursore successivo» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Esito strutturale». Confronta «Esito» e «Cursore finale» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Esito strutturale» si leggono: Esito = troncamento in tensione; Cursore finale = 11.",
        "ragionamento": "Dopo 6 + 3 + 2 = 11 byte il cursore raggiunge la tensione. Restano 14 − 11 = 3 byte a fronte dei quattro richiesti, quindi il lettore si ferma all’offset 11.",
        "attesi": [
          {
            "passo": 7,
            "campo": "Esito",
            "valore": "troncamento in tensione"
          },
          {
            "passo": 7,
            "campo": "Cursore finale",
            "valore": "11"
          },
          {
            "passo": 4,
            "campo": "Offset",
            "valore": "6"
          }
        ]
      },
      {
        "titolo": "Tutti i campi sono disponibili",
        "parametri": {
          "n": 15
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Byte disponibili del record = 15.",
          "Ripeti il conteggio con quindici byte ricevuti e prevedi il cursore dopo l’ultimo campo di quattro byte.",
          "Usa «Passo successivo» fino a «Lettura del campo nome UTF-8». Leggi «Offset» e «Byte» e «Cursore successivo» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Esito strutturale». Confronta «Esito» e «Cursore finale» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Esito strutturale» si leggono: Esito = completo; Cursore finale = 15.",
        "ragionamento": "Il campo tensione comincia ancora all’offset 11 e dispone ora di 15 − 11 = 4 byte. Consumandoli il cursore raggiunge 15, esattamente la fine del record.",
        "attesi": [
          {
            "passo": 7,
            "campo": "Esito",
            "valore": "completo"
          },
          {
            "passo": 7,
            "campo": "Cursore finale",
            "valore": "15"
          },
          {
            "passo": 4,
            "campo": "Offset",
            "valore": "6"
          }
        ]
      }
    ]
  },
  "1.7.2": {
    "scopo": "Lo stesso messaggio combina testo, interi con scala e numeri in virgola mobile. Cambierai il nome del sensore mantenendo le misure per capire come la sua lunghezza sposti i campi successivi senza cambiarne l’interpretazione.",
    "teoria": [
      "Due sensori possono inviare le stesse misure e produrre messaggi di lunghezza diversa se i loro nomi occupano spazi diversi. TLM1 organizza il messaggio in un record, una sequenza di byte suddivisa in campi con un significato assegnato. Un byte contiene otto bit; l’offset di un campo conta i byte che lo precedono, partendo da zero. L’intestazione contiene quattro byte della firma TLM1, che identifica il formato, uno di indicatori chiamati flag e uno per la lunghezza del nome. Questi sei byte precedono il nome, tradotto in byte mediante UTF-8, una codifica che può impiegare più byte per carattere.",
      "Per il nome «Z» basta un byte, dunque la temperatura comincia all’offset 6 + 1 = 7. «Aè» ne richiede tre in UTF-8 e porta l’inizio della temperatura all’offset 9. La misura occupa due byte e rappresenta un numero intero di centesimi di grado. L’ordine big-endian attribuisce al primo byte il peso 256 e al secondo il peso uno. Le coppie di cifre sono esadecimali: 64 vale 6 × 16 + 4 = 100, perciò i byte 00 64 danno 0 × 256 + 100 = 100 centesimi, ossia 1 °C.",
      "La tensione segue immediatamente quei due byte e occupa quattro posizioni. Qui l’ordine è little-endian, che pone per primo il byte di peso minore. Per esempio, i byte 00 00 80 3F danno la parola 0x3F800000. Il formato in virgola mobile binary32 ne distingue segno, cifre significative e scala, che insieme indicano 1 volt. Cambiando il nome si spostano entrambe le misure, ciascuna delle quali conserva la propria regola di lettura.",
      "L’intero della temperatura ha sedici bit: se la prima cifra binaria vale uno, alla lettura senza segno si sottrae 65536 per ricavare il valore con segno. Per la tensione binary32 si separano un bit di segno S, otto di esponente E e ventitré di frazione F. Nei numeri normali il valore è (−1)^S × (1 + F/2²³) × 2^(E−127); nella parola 0x3F800000 i campi S = 0, E = 127 e F = 0 danno proprio 1. Il fattore (−1)^S applica il segno: vale +1 per S = 0 e −1 per S = 1. La scelta 0 V usa invece E = 0 e F = 0, con tutti i byte a zero; appartiene alla classe speciale dello zero."
    ],
    "introduzione": [
      "Questo record simulato mostra come un formato combini regole diverse nello stesso messaggio. Dopo sei byte iniziali, il nome UTF-8 occupa una lunghezza variabile; seguono una temperatura intera con segno in centesimi di grado e una tensione binary32. La temperatura usa big-endian, con byte più significativo per primo, mentre la tensione usa little-endian. La lunghezza del nome determina i loro offset.",
      "Carica «Un nome di un byte» e avanza identificando Z, temperatura e tensione. Confronta gli offset 7 e 9 delle misure con quelli del caso «Un nome di tre byte»: Aè sposta gli inizi a 9 e 11. Osserva che i byte numerici 00 64 e 00 00 80 3F restano identici, così come i valori 1 °C e 1 V."
    ],
    "lettura": "La striscia separa firma, flag, lunghezza, nome, temperatura e tensione. Il campo attivo si evidenzia insieme ai propri byte; gli offset dei due campi numerici si leggono contando i byte che li precedono.",
    "conclusione": "L’offset segue la lunghezza codificata del nome, mentre la regola numerica appartiene a ciascun campo. Il lettore deve tenere insieme delimitazione, ordine dei byte, segno e scala.",
    "controlli": {
      "nome": "Testo UTF-8 del sensore. Z occupa un byte, Aè ed € ne occupano tre; la lunghezza è scritta nel prefisso.",
      "temp": "Intero con segno in centesimi di grado Celsius, conservato su sedici bit big-endian; dividi per cento per ricavare i gradi.",
      "volt": "Valore in volt da codificare come binary32 little-endian, in quattro byte."
    },
    "esperienze": [
      {
        "titolo": "Un nome di un byte",
        "parametri": {
          "nome": "Z",
          "temp": 100,
          "volt": "1"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Nome del sensore = Z; Temperatura in centesimi di °C = 100; Tensione in V = 1.",
          "Per Z conta sei byte di prefisso e uno di nome; localizza temperatura e tensione prima di leggerne il valore.",
          "Usa «Passo successivo» fino a «Campo temperatura». Leggi «Offset» e «Byte» e «Temperatura» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Campo tensione». Confronta «Offset» e «Byte» e «Tensione» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Campo tensione» si leggono: Offset = 9; Byte = 00 00 80 3F; Tensione = 1 V.",
        "ragionamento": "Il prefisso occupa sei byte e Z occupa 5A, un solo byte. La temperatura inizia a 7 e la tensione a 9; 00 64 dà 100 centesimi, mentre 00 00 80 3F ricostruisce binary32 1 V.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Offset",
            "valore": "9"
          },
          {
            "passo": 2,
            "campo": "Byte",
            "valore": "00 00 80 3F"
          },
          {
            "passo": 1,
            "campo": "Offset",
            "valore": "7"
          }
        ]
      },
      {
        "titolo": "Un nome di tre byte",
        "parametri": {
          "nome": "Aè",
          "temp": 100,
          "volt": "1"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Nome del sensore = Aè; Temperatura in centesimi di °C = 100; Tensione in V = 1.",
          "Sostituisci Z con Aè, che occupa tre byte, e prevedi di quanti posti si spostino i due campi delle misure.",
          "Usa «Passo successivo» fino a «Campo temperatura». Leggi «Offset» e «Byte» e «Temperatura» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Campo tensione». Confronta «Offset» e «Byte» e «Tensione» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Campo tensione» si leggono: Offset = 11; Byte = 00 00 80 3F; Tensione = 1 V.",
        "ragionamento": "Aè si codifica come 41 C3 A8, quindi il nome occupa tre byte. La temperatura passa all’offset 9 e la tensione a 11; le loro sequenze restano 00 64 e 00 00 80 3F e mantengono i valori 1 °C e 1 V.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Offset",
            "valore": "11"
          },
          {
            "passo": 2,
            "campo": "Byte",
            "valore": "00 00 80 3F"
          },
          {
            "passo": 1,
            "campo": "Offset",
            "valore": "9"
          }
        ]
      }
    ]
  },
  "1.7.3": {
    "scopo": "Dopo aver decodificato le dimensioni di un’immagine occorre controllare lo spazio richiesto. Confronterai una griglia enorme con una che rientra nel budget, distinguendo il limite dell’intero dalla memoria effettivamente disponibile.",
    "teoria": [
      "Un’immagine digitale si può descrivere come una griglia di pixel, le sue unità elementari. Nel formato RGBA ogni pixel conserva quattro componenti, rosso, verde, blu e alfa, che regola l’opacità. Qui ogni componente occupa un byte, perciò a una riga larga 128 pixel servono 512 byte. L’immagine intera contiene tante righe quante ne indica l’altezza. Riservare la zona di memoria necessaria si chiama allocazione; il buffer è tale zona, destinata qui ai pixel.",
      "Con larghezza e altezza pari a 2048, il numero di pixel è 4194304. Per conservarli servono 16777216 byte, cioè 16 MiB, dove un mebibyte equivale a 1048576 byte. La quantità entra in un intero senza segno di 32 bit e nel budget di 64 MiB del confronto guidato. Se si esplora un budget più piccolo di 16 MiB, il vincolo di memoria diventa la causa del rifiuto.",
      "Con lati entrambi pari a 65 536, anche la capacità del contatore diventa decisiva. Il solo numero di pixel raggiunge 2³² e i byte richiesti sono quattro volte tanti. Conservando soltanto i 32 bit inferiori del prodotto si leggerebbe zero. Il calcolo ampio della figura consente di confrontare il fabbisogno reale sia con la capacità del contatore sia con la memoria disponibile. L’etichetta uint32 designa un intero senza segno di 32 bit, il cui massimo è 2³² − 1 = 4294967295. Il valore modulo 2³² è il resto dopo la divisione per 4294967296. «Allocazione consentita» indica che la richiesta supera entrambi i controlli del modello; rappresenta una decisione preliminare alla richiesta effettiva di memoria al sistema."
    ],
    "introduzione": [
      "L’attività insegna a collegare dimensioni dichiarate e memoria richiesta prima di riservare un buffer. Ogni pixel RGBA occupa quattro byte, quindi il fabbisogno è larghezza × altezza × 4. Il conteggio esatto deve rientrare sia nel massimo di un intero senza segno a 32 bit sia nel budget disponibile, espresso in MiB, ciascuno pari a 1048576 byte.",
      "Carica «Una richiesta oltre i 32 bit» e confronta i 17179869184 byte esatti con il residuo zero ottenuto conservando soltanto 32 bit. Passa all’immagine 2048 × 2048, che richiede 16 MiB e rientra nel budget di 64 MiB. Riduci poi il budget a 8 MiB e applica i parametri: il tipo resta sufficiente, mentre la memoria autorizzata diventa insufficiente."
    ],
    "lettura": "La figura parte dalla griglia di pixel e porta al conteggio dei byte. Le quantità esatte e quelle ridotte a 32 bit sono indicate separatamente; il confronto con il budget stabilisce se si possa riservare la memoria richiesta.",
    "conclusione": "Il fabbisogno reale deve essere calcolato senza perdere bit, poi confrontato sia con il massimo del tipo sia con il budget. Un residuo piccolo può corrispondere a una richiesta enorme.",
    "controlli": {
      "w": "Pixel per riga dell’immagine RGBA, con quattro byte per pixel.",
      "h": "Numero di righe da memorizzare; il prodotto w × h dà i pixel complessivi.",
      "mib": "Memoria massima assegnata all’immagine, in mebibyte. Un MiB equivale a 2²⁰ = 1048576 byte."
    },
    "esperienze": [
      {
        "titolo": "Una richiesta oltre i 32 bit",
        "parametri": {
          "w": "65536",
          "h": "65536",
          "mib": "64"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Larghezza in pixel = 65536; Altezza in pixel = 65536; Budget MiB = 64.",
          "Calcola 65536 × 65536 come 2¹⁶ × 2¹⁶ e moltiplica ancora per i quattro byte del pixel.",
          "Usa «Passo successivo» fino a «Spazio». Leggi «Byte esatti» e «Byte modulo 2³²» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Controlli». Confronta «Rappresentabile su 32 bit» e «Budget in byte» e «Allocazione consentita» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Controlli» si leggono: Rappresentabile su 32 bit = no; Budget in byte = 67108864; Allocazione consentita = no.",
        "ragionamento": "Il numero di pixel è 2³² e i byte sono 4 × 2³² = 17179869184. Il residuo a 32 bit vale zero, mentre la richiesta supera sia il limite del tipo sia il budget di 67108864 byte.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Rappresentabile su 32 bit",
            "valore": "no"
          },
          {
            "passo": 2,
            "campo": "Budget in byte",
            "valore": "67108864"
          },
          {
            "passo": 1,
            "campo": "Byte esatti",
            "valore": "17179869184"
          }
        ]
      },
      {
        "titolo": "Un’immagine che rientra nel budget",
        "parametri": {
          "w": "2048",
          "h": "2048",
          "mib": "64"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Larghezza in pixel = 2048; Altezza in pixel = 2048; Budget MiB = 64.",
          "Calcola i pixel di una griglia 2048 × 2048 e confronta i byte richiesti con 64 × 1048576.",
          "Usa «Passo successivo» fino a «Spazio». Leggi «Byte esatti» e «Byte modulo 2³²» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Controlli». Confronta «Rappresentabile su 32 bit» e «Budget in byte» e «Allocazione consentita» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Controlli» si leggono: Rappresentabile su 32 bit = sì; Budget in byte = 67108864; Allocazione consentita = sì.",
        "ragionamento": "2048 × 2048 dà 4194304 pixel e, moltiplicando per quattro, 16777216 byte, cioè 16 MiB. Il valore entra nei 32 bit e nel budget di 64 MiB, perciò l’allocazione è consentita.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Rappresentabile su 32 bit",
            "valore": "sì"
          },
          {
            "passo": 2,
            "campo": "Budget in byte",
            "valore": "67108864"
          },
          {
            "passo": 1,
            "campo": "Byte esatti",
            "valore": "16777216"
          }
        ]
      }
    ]
  },
  "1.7.4": {
    "scopo": "Un byte di autorizzazioni deve rispettare sia il formato sia la regola di accesso. Accenderai un bit riservato mantenendo ruolo e permesso validi, per capire perché la verifica strutturale preceda la decisione.",
    "teoria": [
      "Per decidere se autorizzare una modifica, il programma riceve un byte, ossia otto bit, ai quali il formato assegna significati diversi. Le posizioni si contano da destra a partire da zero. Alla posizione 1 il bit W indica il permesso di scrittura, alla posizione 3 il bit O indica il proprietario e alla posizione 4 il bit A identifica un amministratore.",
      "La decisione richiede dapprima una parola valida. Le posizioni 5, 6 e 7 sono riservate e devono valere zero. Per isolarle si usa la maschera 11100000, che in esadecimale si scrive 0xE0. L’operazione AND copia dal byte solo i bit che incontrano un uno nella maschera. Un risultato diverso da zero segnala quindi la presenza di almeno un bit riservato acceso. Una posizione riservata è lasciata senza significato utilizzabile da questa versione del formato. Il prefisso 0x indica la base sedici, nella quale E vale 14; E0 corrisponde quindi a 1110 0000.",
      "La politica di accesso richiede W insieme ad almeno uno tra O e A. OR vale uno quando almeno una condizione è presente, mentre AND richiede entrambe: la regola si scrive quindi W AND (O OR A). Con W e A attivi e gli altri bit spenti si ottiene 00010010, che permette la modifica. Accendendo anche il bit 7 si conserva la combinazione di ruolo e permesso, mentre il formato diventa invalido e basta già a rifiutare la richiesta. La traccia mantiene visibile anche il risultato della politica per mostrare separatamente i due requisiti; la decisione finale li richiede entrambi."
    ],
    "introduzione": [
      "Il laboratorio permette di separare validità di una rappresentazione e autorizzazione di un’azione. Nel byte ricevuto W indica scrittura, O proprietario e A amministratore; la politica richiede W insieme ad almeno uno dei due ruoli. Prima occorre verificare che i bit riservati 5, 6 e 7 siano zero, isolandoli mediante AND con la maschera 0xE0.",
      "Carica «Ruolo e permesso validi» e segui il byte 0x12 attraverso controllo strutturale e politica W AND (O OR A). Fissa l’esito, poi carica il caso con bit riservato attivo. Confronta 0x92 con il byte iniziale: ruolo e permesso rimangono validi, però l’intersezione 0x80 con la maschera riservata determina il rifiuto finale."
    ],
    "lettura": "La fila dei bit evidenzia W, O e A nelle posizioni assegnate. Il percorso del controllo di validità applica 0xE0; quello della politica combina O OR A e poi richiede W. La decisione raccoglie entrambi gli esiti.",
    "conclusione": "Un’autorizzazione richiede una rappresentazione valida e le condizioni previste dalla politica. Conservare i bit di ruolo e permesso lascia comunque necessaria la verifica delle posizioni riservate.",
    "controlli": {
      "w": "Bit 1 della parola: uno indica la presenza del permesso di scrittura.",
      "o": "Bit 3: uno indica che il richiedente è il proprietario.",
      "a": "Bit 4: uno indica il ruolo di amministratore.",
      "r": "Bit 7, riservato dal formato. Portarlo a uno consente di osservare un errore di validità anche con ruolo e permesso presenti."
    },
    "esperienze": [
      {
        "titolo": "Ruolo e permesso validi",
        "parametri": {
          "w": 1,
          "o": 0,
          "a": 1,
          "r": 0
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Scrittura W = 1; Proprietario O = 0; Amministratore A = 1; Bit riservato 7 = 0.",
          "Componi W nella posizione 1 e A nella 4: prevedi 0x12 e valuta W AND (O OR A).",
          "Usa «Passo successivo» fino a «Ruolo e permesso». Leggi «O OR A» e «W AND (O OR A)» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Decisione». Confronta «Modifica» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Decisione» si leggono: Modifica = consentita.",
        "ragionamento": "W = 1 e A = 1 producono il byte 0x12. I bit riservati sono zero, O OR A vale uno e la congiunzione con W autorizza la modifica.",
        "attesi": [
          {
            "passo": 3,
            "campo": "Modifica",
            "valore": "consentita"
          },
          {
            "passo": 2,
            "campo": "O OR A",
            "valore": "1"
          }
        ]
      },
      {
        "titolo": "Un bit riservato altera la parola",
        "parametri": {
          "w": 1,
          "o": 0,
          "a": 1,
          "r": 1
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Scrittura W = 1; Proprietario O = 0; Amministratore A = 1; Bit riservato 7 = 1.",
          "Conserva W e A e aggiungi il peso 128 del bit 7; prevedi l’intersezione con la maschera 0xE0.",
          "Usa «Passo successivo» fino a «Ruolo e permesso». Leggi «O OR A» e «W AND (O OR A)» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Decisione». Confronta «Modifica» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Decisione» si leggono: Modifica = negata.",
        "ragionamento": "Il bit 7 aggiunge 0x80 e porta la parola a 0x92. L’AND con 0xE0 dà 0x80: il formato risulta invalido e la modifica viene rifiutata. La traccia mostra che ruolo e permesso continuano a soddisfare la politica, rendendo evidente il motivo strutturale della decisione.",
        "attesi": [
          {
            "passo": 3,
            "campo": "Modifica",
            "valore": "negata"
          },
          {
            "passo": 2,
            "campo": "O OR A",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "1.7.5": {
    "scopo": "Sommerai importi in due rappresentazioni: centesimi interi ed euro binary64. Il confronto fra quote da dieci e da venticinque centesimi permette di vedere come la rappresentabilità iniziale influenzi il risultato delle addizioni.",
    "teoria": [
      "Per tenere un conto in euro si può conservare ogni importo come un numero intero di centesimi. Dieci centesimi hanno allora la rappresentazione esatta 10 e ogni nuova quota si aggiunge con un’addizione intera. Un’altra possibilità è conservare l’importo direttamente in euro usando binary64, un formato in virgola mobile che dispone di un numero finito di cifre binarie. Un accumulatore è il valore del totale provvisorio, aggiornato dopo ciascuna addizione.",
      "La quota di 0,10 euro si scrive come la frazione 1/10. Per esprimere esattamente una frazione mediante un numero finito di cifre dopo la virgola binaria, il suo denominatore ridotto deve essere una potenza di due. Poiché 10 contiene anche il fattore 5, il formato sceglie una rappresentazione vicina. A ogni somma il risultato deve ancora rientrare nelle cifre disponibili. Ridurre una frazione significa dividere numeratore e denominatore per tutti i fattori comuni: 25/100 diventa 1/4, mentre 1/10 è già ridotta.",
      "Sommando dieci quote da dieci centesimi, la colonna degli interi raggiunge 100, ossia 1 euro. Nell’altra colonna la stampa a diciassette cifre rende visibile un valore appena inferiore a 1. Con quote da venticinque centesimi si parte invece dalla frazione 1/4, che in binario termina dopo due cifre. Lo scarto finale si misura rispetto al totale dei centesimi convertito in euro con una sola divisione, così da poter confrontare i due percorsi di calcolo.",
      "Il nome binary64 indica un formato di 64 bit che, per i numeri normali, conserva 53 cifre binarie significative contando l’uno iniziale implicito. L’arrotondamento scelto è al valore rappresentabile più vicino, con preferenza per l’ultimo bit pari in caso di equidistanza. La stampa a diciassette cifre serve a distinguere valori vicinissimi che una normale visualizzazione a due decimali mostrerebbe uguali. Nella stampa dello scarto, e-16 significa × 10⁻¹⁶ e il punto svolge il ruolo della virgola decimale: −1.1102e-16 è uno scarto negativo piccolissimo, espresso in euro."
    ],
    "introduzione": [
      "La simulazione confronta due modi di accumulare importi: centesimi interi ed euro in binary64, un formato con un numero finito di cifre binarie significative. Una frazione termina in base due quando il denominatore ridotto è una potenza di due. Un quarto di euro è quindi rappresentabile esattamente, mentre un decimo richiede arrotondamento già nella quota iniziale.",
      "Carica dieci quote da dieci centesimi e avanza osservando i due accumulatori a ogni addizione. Confronta i 100 centesimi finali con la stampa binary64 0.99999999999999989 euro. Ripeti con dieci quote da venticinque centesimi, che arrivano esattamente a 2,5 euro. Leggi lo scarto finale rispetto al totale intero convertito in euro una sola volta, distinto dalla successione delle addizioni."
    ],
    "lettura": "Le due colonne mantengono accumuli paralleli della stessa quota. A ogni addizione confronta i centesimi interi con la stampa a diciassette cifre del valore in euro; il riquadro finale misura lo scarto rispetto al totale intero convertito una sola volta.",
    "conclusione": "Le frazioni con denominatore ridotto pari a una potenza di due hanno una rappresentazione binaria finita. Per importi fissati in centesimi, l’accumulo intero conserva esattamente l’unità scelta entro il suo intervallo.",
    "controlli": {
      "quota": "Importo di ogni quota, in centesimi interi; nel secondo percorso viene diviso per cento e rappresentato come euro binary64.",
      "n": "Numero di addizioni successive della stessa quota. Ogni passo aggiorna entrambi gli accumulatori."
    },
    "esperienze": [
      {
        "titolo": "Dieci quote da dieci centesimi",
        "parametri": {
          "quota": 10,
          "n": 10
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Centesimi per quota = 10; Numero di quote = 10.",
          "Prevedi 100 centesimi come totale intero e segui la stampa del valore binary64 dopo ciascuna delle dieci somme.",
          "Usa «Passo successivo» fino a «Addizione 6». Leggi «Totale intero» e «Totale binary64» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Confronto». Confronta «Totale monetario» e «Differenza tra i due binary64» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Confronto» si leggono: Totale monetario = 1,00 €; Differenza tra i due binary64 = -1.1102e-16 €.",
        "ragionamento": "Il percorso intero somma dieci volte 10 e raggiunge 100 centesimi. Il percorso binary64 parte da un’approssimazione di 0,1 e arrotonda ogni somma, arrivando a 0,99999999999999989 euro; lo scarto stampato è circa −1,1102 × 10⁻¹⁶ euro.",
        "attesi": [
          {
            "passo": 11,
            "campo": "Totale monetario",
            "valore": "1,00 €"
          },
          {
            "passo": 11,
            "campo": "Differenza tra i due binary64",
            "valore": "-1.1102e-16 €"
          },
          {
            "passo": 6,
            "campo": "Totale intero",
            "valore": "60 cent"
          }
        ]
      },
      {
        "titolo": "Dieci quote da un quarto di euro",
        "parametri": {
          "quota": 25,
          "n": 10
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Centesimi per quota = 25; Numero di quote = 10.",
          "Esprimi 25/100 come 1/4 e prevedi se i successivi totali possano essere rappresentati esattamente in binario.",
          "Usa «Passo successivo» fino a «Addizione 6». Leggi «Totale intero» e «Totale binary64» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Confronto». Confronta «Totale monetario» e «Differenza tra i due binary64» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Confronto» si leggono: Totale monetario = 2,50 €; Differenza tra i due binary64 = 0.0000e+0 €.",
        "ragionamento": "Un quarto di euro vale 2⁻² ed è esatto in binario. In questo intervallo anche tutti i totali successivi sono esatti, quindi dieci quote danno 250 centesimi e 2,5 euro, con differenza zero.",
        "attesi": [
          {
            "passo": 11,
            "campo": "Totale monetario",
            "valore": "2,50 €"
          },
          {
            "passo": 11,
            "campo": "Differenza tra i due binary64",
            "valore": "0.0000e+0 €"
          },
          {
            "passo": 6,
            "campo": "Totale intero",
            "valore": "150 cent"
          }
        ]
      }
    ]
  },
  "1.7.6": {
    "scopo": "La redirezione di ingresso prepara un file prima dell’avvio del lettore. Confronterai un record presente con un nome inesistente, distinguendo il lavoro della shell dal controllo dei dati eseguito dal programma.",
    "teoria": [
      "Un programma che legga dal proprio ingresso standard può ricevere dati digitati da una persona oppure byte conservati in un file. La shell, cioè l’interprete dei comandi, prepara la sorgente prima di avviare il programma. Nella forma leggi < file il segno < le chiede di aprire file per la lettura e di collegarlo all’ingresso identificato dal descrittore 0. Un descrittore di file, abbreviato fd, è il numero con cui un processo, cioè un programma in esecuzione, identifica una risorsa aperta. Il numero 0 designa per convenzione l’ingresso standard. L’operazione execve carica il programma da eseguire nel processo predisposto dalla shell; read chiede di prelevare byte dal descrittore indicato.",
      "Una volta avviato, leggi cerca nei primi quattro byte la firma TLM1, una sequenza convenuta per riconoscere il formato. La lettera T corrisponde al byte esadecimale 54. Se al suo posto si riceve X, il cui codice è 58, la lettura è riuscita e il confronto delle firme identifica una sequenza diversa da quella prescritta. ASCII è la tabella che associa un numero ai caratteri di questa firma; le due cifre esadecimali indicano quel numero in base sedici, quindi 54 vale 5 × 16 + 4 = 84.",
      "Un file vuoto si può aprire regolarmente. La prima lettura restituisce zero byte, indicando che si è già alla fine del file. Se invece manca il file stesso, la shell riceve durante l’apertura l’errore ENOENT, che segnala l’assenza del nome cercato. La traccia si ferma così prima che il lettore abbia occasione di esaminare una firma."
    ],
    "introduzione": [
      "La simulazione chiarisce quali operazioni precedano la lettura dei dati in un comando con redirezione. Con leggi < file, la shell apre il file e lo collega al descrittore 0, cioè all’ingresso standard del processo. Solo dopo l’avvio, il programma può acquisire i byte e confrontare la firma iniziale con TLM1 per riconoscere il formato.",
      "Carica «La firma raggiunge il lettore» e segui apertura, collegamento del descrittore e acquisizione dei quattro byte. Confronta poi «L’apertura fallisce nella shell»: ENOENT indica il nome assente e il programma resta privo di avvio. Seleziona infine «Firma XLM1» e applica i parametri per osservare un’apertura riuscita seguita da un rifiuto deciso dal lettore sul contenuto."
    ],
    "lettura": "Segui il collegamento dal file al descrittore 0 e poi al lettore. Il percorso raggiunge il controllo della firma soltanto dopo un’apertura riuscita; il punto in cui si arresta segnala quale componente possa produrre l’esito.",
    "conclusione": "Un errore di apertura precede l’avvio del programma. Una firma errata o un file vuoto richiedono invece che il lettore sia stato avviato e abbia tentato di acquisire i dati.",
    "controlli": {
      "file": "Situazione del file collegato da leggi < file: record valido, firma alterata, file vuoto oppure nome inesistente."
    },
    "esperienze": [
      {
        "titolo": "La firma raggiunge il lettore",
        "parametri": {
          "file": "valido"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Ingresso di leggi < file = Record TLM1.",
          "Segui l’apertura e il collegamento a fd 0; prevedi il codice ASCII del primo carattere della firma TLM1.",
          "Usa «Passo successivo» fino a «Descrittore». Leggi «Programma avviato» e «FD 0 del lettore» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Lettura della firma». Confronta «Primo byte» e «Esito» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Lettura della firma» si leggono: Primo byte = 0x54; Esito = firma accettata.",
        "ragionamento": "L’apertura riesce e il descrittore 0 viene collegato al file. Il lettore riceve la firma TLM1, che comincia con T = 0x54, e il confronto della firma riesce.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Primo byte",
            "valore": "0x54"
          },
          {
            "passo": 2,
            "campo": "Esito",
            "valore": "firma accettata"
          },
          {
            "passo": 1,
            "campo": "Programma avviato",
            "valore": "sì"
          }
        ]
      },
      {
        "titolo": "L’apertura fallisce nella shell",
        "parametri": {
          "file": "manca"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Ingresso di leggi < file = File inesistente.",
          "Scegli un nome inesistente e individua l’operazione che la shell deve completare prima di avviare leggi.",
          "Usa «Passo successivo» fino a «Descrittore». Leggi «Programma avviato» e «FD 0 del lettore» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Diagnosi prima dell’avvio». Confronta «Primo byte» e «Esito» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Diagnosi prima dell’avvio» si leggono: Primo byte = assente; Esito = errore di apertura.",
        "ragionamento": "La shell tenta di aprire il file prima di execve e riceve ENOENT, errore di nome assente. Il programma resta da avviare, quindi nessun controllo della firma può essere eseguito dal lettore.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Primo byte",
            "valore": "assente"
          },
          {
            "passo": 2,
            "campo": "Esito",
            "valore": "errore di apertura"
          },
          {
            "passo": 1,
            "campo": "Programma avviato",
            "valore": "no"
          }
        ]
      }
    ]
  },
  "1.7.7": {
    "scopo": "Una prova completa codifica una misura, altera eventualmente la copia trasmessa e tenta di rileggerla. Confronterai il record integro con una copia contenente una tensione negativa, per distinguere una struttura leggibile da un valore ammesso.",
    "teoria": [
      "Un sensore deve trasformare il proprio nome e due misure in una sequenza che un altro programma sappia leggere. La codifica costruisce questa sequenza; la decodifica ne ricava i dati. Il formato TLM1 assegna posizione, larghezza e significato a ogni campo, cioè a ciascuna porzione del messaggio. Un byte contiene otto bit e si trascrive con due cifre esadecimali.",
      "I primi quattro byte 54 4C 4D 31 rappresentano la firma TLM1. Seguono un byte di indicatori, detti flag, e un byte che dichiara la lunghezza del nome. Sono utilizzabili soltanto i bit 0 e 1 dei flag, numerati da destra; gli altri devono valere zero. Il nome usa UTF-8, che assegna un byte ad A e due a è: Aè occupa dunque 41 C3 A8, tre byte.",
      "La temperatura è un intero con segno di sedici bit espresso in centesimi di grado. Per −1,23 °C si conserva −123; il complemento a due associa a questo numero la configurazione di 65536 − 123 = 65413, cioè 0xFF85. Il primo byte FF ha il peso maggiore: questo ordine si chiama big-endian. In lettura, poiché il bit alto è uno, si sottrae 65536 e si divide il risultato per cento.",
      "La tensione occupa quattro byte nel formato binary32, suddiviso in un bit di segno, otto di esponente E e ventitré di frazione F. Per un numero normale la significanda, cioè il gruppo delle cifre significative, vale 1 + F/2²³ e l’esponente effettivo è E − 127. Il numero 10 si scrive 1,25 × 2³: il segno è zero, E = 3 + 127 = 130 e la frazione F/2²³ vale 0,25. I campi formano la parola 0x41200000, che l’ordine little-endian dispone dal byte di peso minore al maggiore, producendo 00 00 20 41. Il lettore ricostruisce il valore e lo confronta con il dominio, l’insieme delle misure ammesse: richiede una tensione finita e maggiore o uguale a zero. Finito esclude gli infiniti e NaN, la codifica priva di valore numerico ordinario.",
      "Ai sei byte iniziali si sommano quelli del nome e i sei delle misure: con Aè la lunghezza è 15. Una copia più corta fallisce il controllo di disponibilità e un byte aggiunto in coda viola la lunghezza prevista per il singolo record. Una copia lunga quanto previsto può fallire un controllo successivo, per esempio sui bit riservati, sulla sequenza UTF-8 o sul valore della tensione. Il guasto del testo sostituisce il primo byte del nome con FF, ossia 11111111: questa configurazione è esclusa dalle sequenze UTF-8 ammesse. La prova rende visibile il primo motivo di rifiuto, mentre il confronto grafico localizza la prima differenza fra originale e copia."
    ],
    "introduzione": [
      "Il laboratorio conclusivo verifica l’accordo fra codifica e lettura di un record TLM1. Il nome viene tradotto in UTF-8, la temperatura in un intero con segno espresso in centesimi e la tensione in binary32. La copia ricevuta deve rispettare lunghezza, codifiche e dominio delle misure, cioè l’insieme dei valori ammessi: qui la tensione deve essere finita e almeno zero.",
      "Carica «Codificare e rileggere la misura» e confronta originale, copia e valori recuperati. Passa poi al caso con tensione fuori dominio, mantenendo Aè: la copia conserva quindici byte, però all’offset 14 compare C1 al posto di 41. Osserva che il campo rimane leggibile come binary32 e che il rifiuto dipende dalla tensione negativa, distinta da una mancanza di byte."
    ],
    "lettura": "La striscia di byte è suddivisa nei campi del record. Gli offset contano i byte dall’inizio, partendo da zero. Confronta originale e copia prima di leggere l’esito: l’evidenziazione marca la prima differenza, che può trovarsi dentro un campo. Con il nome Aè, nel caso della tensione negativa cambia il byte all’offset 14, mentre il campo completo occupa gli offset 11…14.",
    "conclusione": "La correttezza richiede che la copia conservi i confini dei campi, le codifiche e il dominio delle misure. Una prova di andata e ritorno controlla l’accordo fra codificatore e lettore; le copie alterate mostrano separatamente i controlli di validazione.",
    "controlli": {
      "nome": "Nome UTF-8 del sensore: Aè ed € occupano tre byte, Z uno. La lunghezza del nome determina gli offset dei campi successivi.",
      "guasto": "Alterazione applicata alla copia prima della lettura. «Integra» conserva il record; le altre scelte isolano troncamento, flag riservati, UTF-8 illecito, dati in coda o tensione negativa."
    },
    "esperienze": [
      {
        "titolo": "Codificare e rileggere la misura",
        "parametri": {
          "nome": "Aè",
          "guasto": "ok"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Nome = Aè; Copia da verificare = Integra.",
          "Conta i byte del nome Aè e ricava la lunghezza 12 + 3; individua poi i due byte della temperatura e i quattro della tensione.",
          "Usa «Passo successivo» fino a «Banco di prova». Leggi «Copia» e «Dimensione» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Decodifica». Confronta «Nome» e «Flag» e «Temperatura» e «Tensione» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Decodifica» si leggono: Nome = Aè; Flag = 3; Temperatura = -1,23 °C; Tensione = 10 V.",
        "ragionamento": "Aè occupa 41 C3 A8. La temperatura −1,23 °C è l’intero −123, codificato su sedici bit come FF85; i quattro byte 00 00 20 41 ricostruiscono binary32 10 V, così la lettura restituisce tutte le misure iniziali.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Nome",
            "valore": "Aè"
          },
          {
            "passo": 2,
            "campo": "Flag",
            "valore": "3"
          },
          {
            "passo": 1,
            "campo": "Copia",
            "valore": "54 4C 4D 31 03 03 41 C3 A8 FF 85 00 00 20 41"
          }
        ]
      },
      {
        "titolo": "Un numero leggibile fuori dal dominio",
        "parametri": {
          "nome": "Aè",
          "guasto": "volt"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Nome = Aè; Copia da verificare = Tensione negativa.",
          "Conserva la lunghezza del record e applica l’alterazione «Tensione negativa»; prevedi se il rifiuto richieda già la lettura del campo numerico.",
          "Usa «Passo successivo» fino a «Banco di prova». Leggi «Copia» e «Dimensione» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Decodifica». Confronta «Esito» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Decodifica» si leggono: Esito = Tensione fuori dominio.",
        "ragionamento": "La copia conserva confini e lunghezza. Il campo tensione codifica un valore negativo, che il lettore riconosce ricostruendo il numero e confrontandolo con il dominio delle tensioni ammesse: valori finiti e maggiori o uguali a zero.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Esito",
            "valore": "Tensione fuori dominio"
          },
          {
            "passo": 1,
            "campo": "Copia",
            "valore": "54 4C 4D 31 03 03 41 C3 A8 FF 85 00 00 20 C1"
          }
        ]
      }
    ]
  },
  "1.7.8": {
    "scopo": "Una decodifica completa deve combinare confini, testo e due formati numerici. Nell’esercizio 1, traccia 1, leggerai il record TLM1 di un sensore chiamato Z, giustificando offset e misure attraverso i byte disponibili.",
    "teoria": [
      "Un sensore può trasmettere in un unico messaggio il proprio nome e due misure. Il ricevitore deve stabilire dove termina un campo e dove comincia il successivo. Nel formato TLM1 il nome occupa uno spazio variabile, la cui lunghezza in byte è registrata nella parte iniziale del messaggio. Un byte contiene otto bit e si scrive con due cifre esadecimali. Un campo è una porzione con significato assegnato; il suo offset è il numero di byte che lo precedono, contando da zero. UTF-8 è la codifica che trasforma i caratteri del nome in uno o più byte.",
      "L’intestazione, chiamata anche prefisso, occupa sei byte: quattro della firma TLM1, che identifica il formato, uno di indicatori chiamati flag e uno per la lunghezza del nome all’offset 5. Seguono il nome, la temperatura su due byte e la tensione su quattro. Il conteggio riguarda il nome già codificato, sicché una lettera che occupa più byte sposta l’inizio della temperatura di altrettante posizioni.",
      "Nel record proposto il nome Z occupa il solo byte 5A. La temperatura comincia all’offset 6 + 1 = 7 e usa l’ordine big-endian, con peso 256 per il primo byte. I byte 00 64 danno 0 × 256 + 100 = 100 centesimi, pari a 1 °C, poiché 64 esadecimale vale 6 × 16 + 4. La tensione comincia due posizioni dopo, all’offset 9, e usa little-endian: i byte partono dal peso minore, quindi 00 00 80 3F ricostruisce la parola 0x3F800000 quando le cifre di peso maggiore sono scritte a sinistra. Il totale 6 + 1 + 2 + 4 = 13 byte verifica i confini dei campi.",
      "La temperatura int16 usa sedici bit in complemento a due. Un primo bit uguale a zero, come in 00 64, permette di leggere direttamente il numero positivo; con primo bit uno si sottrarrebbe 65536 alla lettura senza segno. La tensione binary32 divide invece i 32 bit in segno S, esponente E di otto bit e frazione F di ventitré. Per un numero normale la frazione è F/2²³, l’uno iniziale è sottinteso e l’esponente effettivo è E − 127. In 0x3F800000 i campi S = 0, E = 127 e F = 0 danno quindi (−1)^0 × (1 + 0) × 2^(127−127) = 1, la tensione di 1 V."
    ],
    "introduzione": [
      "L’esercizio guidato riunisce delimitazione e interpretazione nella lettura di un record TLM1. I sei byte iniziali includono la lunghezza del nome UTF-8, dalla quale dipendono le posizioni delle misure. La temperatura occupa due byte big-endian in complemento a due e indica centesimi di grado; la tensione occupa quattro byte little-endian da leggere secondo il formato binary32.",
      "Carica l’esempio guidato dell’esercizio 1, traccia 1, e leggi all’offset 5 la lunghezza del nome. Registra la previsione e avanza: 5A identifica Z, 00 64 produce 1 °C e 00 00 80 3F ricostruisce 1 V. Confronta gli inizi dei campi numerici, agli offset 7 e 9, con il conteggio complessivo di tredici byte."
    ],
    "lettura": "La fila di byte viene suddivisa in prefisso, nome e campi numerici. Gli offset sono contati dall’inizio del record; la temperatura usa prima il byte di peso maggiore, mentre la tensione richiede di ricomporre la parola dai byte in ordine little-endian.",
    "conclusione": "Un record si interpreta campo per campo, mantenendo aggiornato il cursore e applicando a ciascun campo la propria regola. La lunghezza complessiva fornisce un controllo indipendente dei confini scelti.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per l’esercizio 1, «Decodificare un record di telemetria», traccia 1.",
      "Leggi il byte all’offset 5 e registra il numero di byte del nome; verifica che 5A identifichi Z.",
      "Avanza e calcola la temperatura dai byte 00 64 all’offset 7, dividendo i centesimi per cento.",
      "Apri la prova completa per indicare anche la tensione: ricomponi 00 00 80 3F nella parola binary32 e controlla il totale di 13 byte."
    ],
    "risultato": "Il nome occupa un byte ed è Z. La temperatura è 1 °C e la tensione è 1 V; il record contiene tredici byte.",
    "ragionamento": "Il prefisso occupa sei byte e il nome uno, quindi la temperatura comincia a 7. Big-endian 00 64 vale 100 centesimi; a 9 la parola little-endian 00 00 80 3F diventa 0x3F800000, che codifica 1 V. Il totale è 12 + 1 = 13."
  },
  "1.7.9": {
    "scopo": "Una diagnosi deve fermarsi al primo requisito che i byte ricevuti violano. Nell’esercizio 3, traccia 1, ricaverai la lunghezza attesa dal nome e individuerai la parte finale del record che manca.",
    "teoria": [
      "Durante una copia si può perdere l’ultimo byte di un messaggio oppure alterarne uno all’interno. Il ricevitore dispone di due indizi diversi per riconoscere questi casi. Conosce la lunghezza dichiarata per il nome e conosce le posizioni che possono essere usate per i segnali di stato, detti flag. Un byte contiene otto bit. Gli offset numerano le posizioni dei byte a partire da zero, così l’offset 5 identifica il sesto byte. La firma è la sequenza iniziale 54 4C 4D 31, che nella codifica del testo identifica TLM1.",
      "Ai sei byte iniziali si aggiungono quelli del nome, due per la temperatura e quattro per la tensione. Il numero atteso è quindi dodici più la lunghezza del nome. Per verificare i flag occorre invece esaminare le singole cifre binarie, poiché il formato ammette l’uso delle sole due posizioni più a destra. La maschera 0xFC, scritta 11111100 in binario, seleziona i bit riservati da 2 a 7. L’AND bit a bit conserva un uno soltanto dove entrambi gli operandi valgono uno: applicato ai flag rivela quindi ogni posizione riservata attiva. Il prefisso 0x indica la base sedici.",
      "Nel caso proposto il nome occupa un byte, perciò il record completo ne richiede tredici. La copia ne contiene undici: sono disponibili il prefisso, il nome, la temperatura e soltanto due dei quattro byte della tensione. Il controllo della lunghezza individua quindi il troncamento prima di attribuire un valore in volt al campo incompleto."
    ],
    "introduzione": [
      "Questa soluzione guidata insegna a formulare una diagnosi a partire dal primo requisito violato. Nel record TLM1 il nome ha lunghezza variabile n, mentre intestazione e misure occupano complessivamente dodici byte. Conoscere n permette di verificare la lunghezza attesa prima delle conversioni numeriche. Una firma corretta identifica il formato, lasciando ancora da accertare la presenza di tutti i campi.",
      "Carica l’esempio guidato dell’esercizio 3, traccia 1, e avanza dalla firma al byte di lunghezza all’offset 5. Con n = 1 sono attesi tredici byte, mentre la copia ne contiene undici. Confronta il campo tensione, che inizia a 9 e richiede quattro celle, con i soli due byte disponibili; collega il rifiuto per troncamento a queste posizioni mancanti."
    ],
    "lettura": "Confronta la lunghezza dichiarata con il limite della sequenza ricevuta. La ricostruzione evidenzia i campi completi e l’intervallo della tensione, che si estende oltre gli undici byte disponibili.",
    "conclusione": "La disponibilità di tutti i byte precede la conversione del campo. Una firma corretta permette di riconoscere il formato, mentre il controllo di lunghezza decide se la copia possa essere letta fino in fondo.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per l’esercizio 3, «Diagnosticare una copia alterata», traccia 1.",
      "Verifica la firma 54 4C 4D 31 e leggi n = 1 all’offset 5.",
      "Calcola 12 + n e confronta la lunghezza attesa con gli undici byte forniti.",
      "Avanza fino alla diagnosi, localizzando i due byte mancanti nel campo tensione e lasciando il valore della misura da determinare."
    ],
    "risultato": "La lunghezza attesa è 13 byte. La copia di 11 byte viene rifiutata come record troncato.",
    "ragionamento": "Il nome dichiarato occupa un byte, che porta la dimensione prevista a 12 + 1 = 13. La temperatura termina all’offset 8; della tensione, che comincia a 9 e richiede quattro byte, sono presenti soltanto i primi due."
  },
  "modulo-1": {
    "scopo": "Il sensore deve trasmettere un nome e due misure al lettore che le userà. Attraverserai tutte le verifiche del record, confrontando una copia completa con una priva dell’ultimo byte per collegare rappresentazioni e ordine dei controlli.",
    "teoria": [
      "Un sensore ha misurato −1,23 °C e una tensione di 10 volt. Perché il computer che riceve la misura possa attribuirla al sensore giusto, occorre trasmettere con i due numeri anche il nome dello strumento. Il formato TLM1 riunisce queste informazioni in un record, una successione di byte nella quale mittente e destinatario hanno concordato la posizione e il significato di ciascun campo.",
      "I primi quattro byte riproducono le lettere e la cifra di TLM1 e permettono di riconoscere il formato. Seguono un byte di indicatori e un byte che dichiara la lunghezza del nome. Un byte contiene otto cifre binarie. La codifica UTF-8 del testo può usarne diversi per un carattere, così «Aè» occupa tre byte. I sei byte iniziali, i tre del nome e i sei destinati alle misure portano la lunghezza prevista a quindici byte. Nella striscia ogni byte è scritto con due cifre in base sedici: dopo 0…9, le cifre A, B, C, D, E e F valgono 10, 11, 12, 13, 14 e 15. Il prefisso 0x segnala questa scrittura.",
      "Per la temperatura si legge per primo il byte di peso maggiore. FF vale 15 × 16 + 15 = 255 e 85 vale 8 × 16 + 5 = 133: i due byte FF 85 danno quindi 255 × 256 + 133 = 65413 come intero senza segno. La codifica con segno, detta complemento a due, richiede qui di sottrarre 65536 perché il primo bit vale uno. Si ottengono −123 centesimi di grado e, dividendo per cento, −1,23 °C. I quattro byte della tensione seguono l’ordine opposto e rappresentano un numero in virgola mobile, che conserva separatamente segno, cifre significative e scala.",
      "I flag sono indicatori raccolti in un byte: qui solo le due posizioni più a destra possono essere utilizzate, mentre le altre sono riservate. La maschera 0xFC, ossia 11111100, scrive uno proprio nelle posizioni riservate. L’AND confronta due bit della stessa posizione e produce uno soltanto se entrambi valgono uno; applicato a flag e maschera deve quindi dare zero. Per la tensione, l’ordine little-endian pone per primo il byte di peso minore e ricompone 00 00 20 41 nella parola 0x41200000.",
      "Il formato binary32 divide la parola della tensione in un bit di segno S, otto bit di esponente E e ventitré bit di frazione F. Per la parola proposta S = 0 indica il segno positivo, E = 130 dà l’esponente effettivo 130 − 127 = 3 e F/2²³ vale 0,25. Nei numeri normali si aggiunge l’uno iniziale sottinteso alla frazione: la significanda, cioè il gruppo delle cifre significative, vale 1,25. Moltiplicandola per la scala 2³ = 8 si ricostruiscono 10 V. Il formato ammette anche codifiche speciali; il lettore richiede qui una tensione finita e maggiore o uguale a zero.",
      "Se alla copia manca l’ultimo byte, il controllo di lunghezza interrompe la lettura. Un valore di tensione negativo richiede invece di arrivare fino all’interpretazione della misura prima di rifiutarla. Seguendo dove si ferma il lettore si può distinguere una trasmissione incompleta da un valore estraneo all’intervallo ammesso."
    ],
    "introduzione": [
      "Il percorso integra le rappresentazioni studiate seguendo un record di telemetria dal sensore al lettore. TLM1 stabilisce confini e significato dei campi: nome UTF-8, temperatura intera in centesimi e tensione binary32. L’accettazione richiede disponibilità dei byte, indicatori validi, testo corretto e misure nel dominio previsto. L’ordine dei controlli mostra quali informazioni servano prima di interpretare ciascun valore.",
      "Carica «Un record attraversa tutti i controlli» e avanza seguendo il campo evidenziato fino alle misure −1,23 °C e 10 V. Confronta poi la copia priva dell’ultimo byte: dal nome di tre byte si prevedono quindici byte totali, contro quattordici ricevuti. Osserva l’arresto già al controllo di lunghezza e l’evidenziazione dell’offset 14, che localizza il byte mancante."
    ],
    "lettura": "La sequenza dei campi è firma, flag, lunghezza del nome, nome, temperatura e tensione. La zona evidenziata segue il controllo in esame. L’offset conta i byte che precedono la zona, partendo da zero; l’ampiezza ne conta i byte. Con il nome Aè, alla fine della copia integra offset 11 e ampiezza 4 identificano la tensione appena verificata. Nella copia troncata offset 14 e ampiezza 1 identificano invece il byte mancante.",
    "conclusione": "La decodifica procede da disponibilità e struttura fino al significato dei valori. Un lettore può interpretare una misura solo dopo averne stabilito i confini, verificato la codifica e applicato la scala prescritta dal formato.",
    "controlli": {
      "nome": "Identificativo del sensore da scrivere in UTF-8. Il conteggio in byte del nome determina la lunghezza attesa 12 + n del record.",
      "guasto": "Copia consegnata al lettore: integra oppure alterata in una proprietà precisa. La scelta permette di localizzare il primo controllo che rifiuta il messaggio."
    },
    "esperienze": [
      {
        "titolo": "Un record attraversa tutti i controlli",
        "parametri": {
          "nome": "Aè",
          "guasto": "ok"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Nome = Aè; Copia da verificare = Integra.",
          "Ricava 15 byte da sei di prefisso, tre di nome e sei di misure; segui poi l’ordine firma, flag, testo e valori numerici.",
          "Usa «Passo successivo» fino a «Nome UTF-8». Leggi «Byte nome» e «Esito UTF-8» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Decisione del lettore». Confronta «Esito» e «Offset» e «Ampiezza» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Decisione del lettore» si leggono: Esito = accettato; Offset = 11; Ampiezza = 4.",
        "ragionamento": "Il nome Aè occupa tre byte, quindi il record ne richiede 12 + 3 = 15. La temperatura FF85 dà 65413 − 65536 = −123 centesimi; 00 00 20 41 ricostruisce 10 V: i controlli di struttura e dominio consentono l’accettazione.",
        "attesi": [
          {
            "passo": 7,
            "campo": "Esito",
            "valore": "accettato"
          },
          {
            "passo": 7,
            "campo": "Offset",
            "valore": "11"
          },
          {
            "passo": 4,
            "campo": "Byte nome",
            "valore": "41 C3 A8"
          }
        ]
      },
      {
        "titolo": "Il record perde l’ultimo byte",
        "parametri": {
          "nome": "Aè",
          "guasto": "taglio"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati applicati: Nome = Aè; Copia da verificare = Ultimo byte mancante.",
          "Con l’ultimo byte eliminato ne arrivano 14; confronta questa disponibilità con i 15 attesi prima di interpretare le misure.",
          "Usa «Passo successivo» fino a «Prefisso e lunghezza». Leggi «Firma» e «Byte nome» e «Attesi» e «Ricevuti» e collega i valori al passaggio appena previsto.",
          "Prosegui fino a «Decisione del lettore». Confronta «Esito» e «Offset» e «Ampiezza» con il risultato spiegato sotto la simulazione."
        ],
        "risultato": "Al termine di «Decisione del lettore» si leggono: Esito = Record troncato; Offset = 14; Ampiezza = 1.",
        "ragionamento": "La lunghezza dichiarata del nome rimane tre, perciò il formato richiede ancora 15 byte. La copia ne contiene 14 e il controllo riconosce un troncamento prima di interpretare il campo tensione incompleto.",
        "attesi": [
          {
            "passo": 3,
            "campo": "Esito",
            "valore": "Record troncato"
          },
          {
            "passo": 3,
            "campo": "Offset",
            "valore": "14"
          },
          {
            "passo": 2,
            "campo": "Firma",
            "valore": "54 4C 4D 31"
          }
        ]
      }
    ]
  }
};
  Object.assign(SL.guide, percorsi);
  for (const [id, guida] of Object.entries(percorsi)) SL.lezioni[id] = guida.teoria;
})();
