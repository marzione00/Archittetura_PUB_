'use strict';

// Guida completa di ogni unità: scopo, teoria, casi, lettura e risultati.
(() => {
  const percorsi = {
  "6.1.1": {
    "scopo": "Una prima lettura porta vicino al processore un intero gruppo di byte. Seguirai una seconda lettura per stabilire quando quel trasferimento serve anche una richiesta successiva e quanto tempo permette di risparmiare.",
    "teoria": [
      "Quando il processore, indicato nella figura con CPU, esegue un’istruzione di lettura, indica il numero della posizione da cui vuole prelevare un byte. Un byte raccoglie otto bit, cifre binarie che valgono zero oppure uno. Il numero della posizione è l’indirizzo. Il byte che vi si trova viene copiato in un registro, una piccola memoria interna al processore che la figura chiama R0; la scritta M[8], per esempio, significa contenuto della memoria all’indirizzo 8.",
      "La memoria principale, o RAM, contiene molti più dati di quanti ne entrino vicino al processore. Poiché raggiungerla richiede tempo, una memoria più piccola e veloce, la cache, trattiene una copia dei dati letti di recente. Qui il trasferimento avviene per gruppi di 64 byte consecutivi, detti linee. Così, quando la prima richiesta porta in cache il byte 0, arrivano insieme anche i byte da 1 a 63.",
      "Una seconda lettura all’indirizzo 8 trova la linea già disponibile. Questo successo, chiamato hit, costa i soli 2 nanosecondi della ricerca, ossia due miliardesimi di secondo. Poiché all’indirizzo 64 comincia un’altra linea, al tempo di ricerca si aggiungono i 50 nanosecondi del rifornimento. Il contatore cumulativo somma i costi delle due letture, mentre la sorgente indica chi ha fornito il dato richiesto."
    ],
    "introduzione": [
      "Per capire perché il processore usi memorie di velocità diversa, seguirai due letture e misurerai il vantaggio del riuso. La cache è una piccola memoria veloce che conserva copie provenienti dalla RAM, la memoria principale. Poiché ogni trasferimento porta una linea di 64 byte consecutivi, la disponibilità del secondo byte dipende dal gruppo al quale appartiene.",
      "Carica il caso «Riutilizzare la prima linea» con «Carica questo caso», quindi avanza con «Passo successivo» e confronta sorgente, costo della singola lettura e tempo cumulato. Ripeti con il secondo indirizzo pari a 64. I totali di 54 e 104 ns, dove ns indica nanosecondi, mostrano il costo del trasferimento aggiuntivo richiesto attraversando il confine della linea."
    ],
    "lettura": "Le due righe della RAM rappresentano i gruppi 0–63 e 64–127. Segui la freccia dalla RAM alla cache quando occorre caricare una linea, poi dalla cache al registro R0; la scritta M[8], per esempio, indica il contenuto della cella di indirizzo 8. Il tempo cumulato comprende entrambe le letture.",
    "conclusione": "Per verificare il riuso della linea, confronta le seconde letture agli indirizzi 8 e 64: la prima usa ancora i byte 0–63 e porta il totale a 54 ns; la seconda richiede un altro rifornimento e porta il totale a 104 ns. La differenza di 50 ns coincide con il costo del trasferimento aggiuntivo.",
    "controlli": {
      "a": "Indirizzo, in byte, della seconda lettura. La prima legge sempre il byte 0; da 0 a 63 si rimane nella stessa linea, da 64 a 127 si passa alla successiva."
    },
    "esperienze": [
      {
        "titolo": "Riutilizzare la prima linea",
        "parametri": {
          "a": 8
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Indirizzo del secondo byte = 8.",
          "Avanza a «Caricamento 1» e osserva il trasferimento del blocco 0: annota i 52 ns già trascorsi.",
          "In «Caricamento 2» cerca il byte 8 nella linea 0–63 e leggi la sorgente indicata accanto alla freccia verso R0.",
          "Confronta il costo di questa seconda lettura con il tempo cumulato; separa i 2 ns appena spesi dai 54 ns complessivi."
        ],
        "risultato": "La seconda lettura arriva dalla cache, costa 2 ns e porta il totale a 54 ns.",
        "ragionamento": "La prima richiesta carica tutti i byte da 0 a 63, pagando 2 + 50 = 52 ns. Il byte 8 appartiene a quel gruppo e richiede soltanto un’altra consultazione da 2 ns, per un totale di 54 ns.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Costo",
            "valore": "2 ns"
          },
          {
            "passo": 2,
            "campo": "Tempo cumulato",
            "valore": "54 ns"
          }
        ]
      },
      {
        "titolo": "Attraversare il confine della linea",
        "parametri": {
          "a": 64
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Indirizzo del secondo byte = 64.",
          "Avanza a «Caricamento 1» e ritrova il medesimo costo di 52 ns per il byte 0.",
          "Prima di «Caricamento 2» localizza 64: è il primo indirizzo della seconda linea. Segui il nuovo trasferimento dalla RAM.",
          "Leggi il costo della seconda richiesta e il totale, quindi confrontali con i 2 e 54 ns del caso precedente."
        ],
        "risultato": "Il byte 64 richiede la RAM: la seconda lettura costa 52 ns e il totale sale a 104 ns.",
        "ragionamento": "La divisione intera 64 ÷ 64 seleziona il blocco 1, ancora assente. Le due richieste pagano ciascuna 2 ns di consultazione e 50 ns di trasferimento: 2 × 52 = 104 ns.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Costo",
            "valore": "52 ns"
          },
          {
            "passo": 2,
            "campo": "Tempo cumulato",
            "valore": "104 ns"
          }
        ]
      }
    ]
  },
  "6.1.2": {
    "scopo": "Due scansioni possono leggere gli stessi quattro interi e tuttavia produrre molti rifornimenti. Confronterai una scansione ravvicinata con una che salta di un’intera linea, seguendo il contenuto effettivo delle due posizioni di cache.",
    "teoria": [
      "Un programma che scorre un array, cioè una successione di elementi dello stesso tipo, passa fra i loro indirizzi di memoria. Qui ogni intero occupa quattro byte, ciascuno formato da otto cifre binarie. Il primo intero inizia all’indirizzo 0, il secondo a 4, il terzo a 8. L’array è allineato: il suo inizio coincide con l’inizio di un blocco di 64 byte. Quando il processore legge il primo elemento, la cache, una piccola memoria veloce, conserva tutto quel blocco in una linea. I sedici interi che contiene diventano disponibili insieme.",
      "La vicinanza fra indirizzi, detta località spaziale, spiega perché quattro letture consecutive possano richiedere un solo trasferimento dalla memoria principale, la RAM. Trovare già il blocco in cache produce un hit; doverlo caricare produce un miss. Se il programma torna all’inizio mentre il blocco è ancora presente, lo riusa anche a distanza di tempo: questa proprietà prende il nome di località temporale. Nelle etichette della figura il prefisso 0x segnala i numeri esadecimali: 0xC vale 12 e 0x40 vale 64.",
      "La figura mostra due posizioni di cache, numerate con gli indici 0 e 1. Il numero del blocco è il quoziente intero dell’indirizzo diviso per 64: gli indirizzi 0–63 appartengono al blocco 0, quelli 64–127 al blocco 1. I blocchi pari concorrono per la posizione 0 e i dispari per la posizione 1. Col passo di sedici interi si leggono 0, 64, 128 e 192, cosicché già alla terza lettura il blocco 2 sostituisce il blocco 0. Da quel momento conta anche l’ordine in cui si torna sui blocchi.",
      "Il tag è l’etichetta che distingue i blocchi ammessi alla stessa posizione. Per due posizioni, l’indice è il resto della divisione del numero di blocco per 2, scritto anche blocco modulo 2; il tag è il quoziente intero della stessa divisione. La voce Dirty finale indica se la copia è stata modificata: vale uno per una copia modificata e zero per una copia pulita. Qui le richieste sono tutte letture, quindi Dirty resta zero; anche il contatore write-back, che conta le riscritture di copie modificate verso la RAM, resta zero."
    ],
    "introduzione": [
      "Leggere nuovamente gli stessi elementi permette di risparmiare tempo soltanto se le copie utili sono ancora disponibili. L’esperimento ti farà distinguere la vicinanza degli indirizzi, detta località spaziale, dal riuso nel tempo, detto località temporale. Nella cache diretta ogni blocco può occupare una sola posizione, perciò un altro blocco destinato alla stessa posizione può sostituirlo prima del riuso.",
      "Scegli «Scorrere interi vicini» mediante «Carica questo caso» e segui entrambe le passate con «Passo successivo», contando gli hit, cioè le richieste soddisfatte dalla copia presente. Confronta poi «Saltare di una linea a ogni intero»: il passo di sedici interi equivale a 64 byte. I quattro miss della seconda passata si spiegano indicando, per ogni richiesta, il blocco che occupa quella posizione."
    ],
    "lettura": "Le due file superiori elencano i quattro indirizzi della prima e della seconda passata. Il riquadro in ambra indica la richiesta corrente; i due riquadri inferiori mostrano quale blocco risiede negli indici 0 e 1 dopo quella lettura. L’etichetta hit o miss riguarda ciascun accesso, mentre il riepilogo separa le due passate.",
    "conclusione": "Con passo 1 la seconda passata produce quattro hit, perché tutti gli interi appartengono alla linea rimasta in cache. Con passo 16 produce quattro miss: prima di ogni riuso, un altro blocco ha occupato la stessa posizione. Per giustificare un risultato, indica sempre il blocco richiesto e il blocco residente al suo indice.",
    "controlli": {
      "stride": "Distanza fra due interi selezionati, espressa in interi da quattro byte. Il passo 16 produce quindi una distanza di 64 byte e seleziona un blocco diverso a ogni lettura."
    },
    "esperienze": [
      {
        "titolo": "Scorrere interi vicini",
        "parametri": {
          "stride": "1"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Passo in interi = Un intero.",
          "In «Array allineato» verifica gli indirizzi 0, 4, 8 e 12; individua il gruppo di 64 byte che li contiene.",
          "Avanza da «Accesso 1 · lettura» a «Accesso 4 · lettura» e annota un miss seguito da tre hit, mentre la linea dell’indice 0 conserva il blocco 0.",
          "Completa gli accessi 5–8 e apri «Confronto delle scansioni»: verifica i quattro hit della seconda passata."
        ],
        "risultato": "La prima passata produce 3 hit, la seconda 4 hit e zero miss.",
        "ragionamento": "I quattro interi ricadono tutti nel blocco 0. Il primo accesso lo carica; le altre sette richieste lo riusano, perché nessuna chiede un blocco concorrente per la stessa posizione.",
        "attesi": [
          {
            "passo": 9,
            "campo": "Hit nella seconda scansione",
            "valore": "4"
          },
          {
            "passo": 9,
            "campo": "Miss nella seconda scansione",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Saltare di una linea a ogni intero",
        "parametri": {
          "stride": "16"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Passo in interi = Sedici interi.",
          "In «Array allineato» verifica il passo di 64 byte e gli indirizzi 0, 64, 128 e 192.",
          "Fermati a «Accesso 3 · lettura»: il blocco 2 prende l’indice 0 e sostituisce il blocco 0; al quarto accesso il blocco 3 sostituisce il blocco 1.",
          "Prosegui fino a «Confronto delle scansioni» e conta anche i miss del ritorno agli indirizzi iniziali."
        ],
        "risultato": "Entrambe le passate producono zero hit; la seconda conta 4 miss.",
        "ragionamento": "I blocchi 0 e 2 competono per l’indice 0, mentre 1 e 3 competono per l’indice 1. Alla fine della prima passata sono rimasti 2 e 3; ogni lettura della seconda sostituisce nuovamente un blocco che servirà poco dopo.",
        "attesi": [
          {
            "passo": 9,
            "campo": "Hit nella seconda scansione",
            "valore": "0"
          },
          {
            "passo": 9,
            "campo": "Miss nella seconda scansione",
            "valore": "4"
          }
        ]
      }
    ]
  },
  "6.1.3": {
    "scopo": "Misurerai il costo medio di cento letture distinguendo il tempo pagato da ogni richiesta dalla penalità delle sole richieste che trovano la cache vuota per quel blocco. Il confronto mostra come una frequenza di miss maggiore cambi la media.",
    "teoria": [
      "Se si cronometra una lettura di memoria, il risultato dipende da dove si trova il dato. Il processore interroga anzitutto la cache, una memoria veloce che conserva copie di piccoli gruppi di byte. Se trova il gruppo richiesto, ottiene un hit. Se la ricerca fallisce, si ha un miss e occorre prelevare il gruppo dal livello di memoria successivo.",
      "Nel cronometrare cento letture eseguite una dopo l’altra, si possono separare due tempi. Il primo, pari a 2 nanosecondi per richiesta, ricorre cento volte. Un nanosecondo corrisponde a un miliardesimo di secondo. Il secondo, chiamato penalità di miss, ricorre soltanto quando occorre il rifornimento. Con dieci miss e una penalità aggiuntiva di 50 nanosecondi, i tempi da sommare sono quindi 200 e 500 nanosecondi.",
      "La media si ottiene distribuendo i 700 nanosecondi complessivi sulle cento letture. I 7 nanosecondi per accesso che ne risultano esprimono il costo medio, indicato con AMAT, dall’inglese average memory access time. Una singola lettura, nelle stesse condizioni, richiede 2 oppure 52 nanosecondi, mentre la media descrive l’intera sequenza."
    ],
    "introduzione": [
      "Il tempo medio di accesso descrive il costo distribuito su un’intera sequenza di richieste. Lo ricaverai separando la consultazione della cache, pagata sempre, dal rifornimento necessario quando il blocco cercato manca, evento chiamato miss. Nel modello gli accessi avvengono in serie: aumentando la frequenza dei miss a penalità costante, cresce soltanto la quota media dovuta ai rifornimenti.",
      "Con «Carica questo caso» imposta dieci miss su cento e una penalità aggiuntiva di 50 ns, ossia nanosecondi. Avanza fino a «Media», verificando i 200 ns delle consultazioni e i 500 ns dei rifornimenti. Porta poi i miss a venti e premi «Applica i parametri»: confrontare 7 e 12 ns permette di attribuire l’aumento ai dieci trasferimenti ulteriori."
    ],
    "lettura": "Le cento caselle rappresentano cento richieste. In ambra compaiono quelle che richiedono un rifornimento; i riquadri a destra separano le cento consultazioni, le penalità e la divisione finale per cento. Ogni casella ha lo stesso peso statistico.",
    "conclusione": "Con accessi in serie, AMAT = tempo di consultazione + frazione di miss × penalità aggiuntiva. Verifica la media moltiplicandola per cento e confrontandola con il tempo totale. Il singolo accesso costa 2 ns se trova la copia e 2 ns più la penalità scelta se richiede un rifornimento; i 52 ns valgono per la penalità iniziale di 50 ns.",
    "controlli": {
      "m": "Numero di miss nella sequenza di cento accessi. Dividendo questo numero per cento ottieni la frazione di richieste che paga la penalità.",
      "pen": "Tempo supplementare di un rifornimento, in nanosecondi. Si aggiunge ai 2 ns della consultazione già pagata anche dalle richieste in miss."
    },
    "esperienze": [
      {
        "titolo": "Dieci rifornimenti su cento richieste",
        "parametri": {
          "m": 10,
          "pen": 50
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Miss ogni cento accessi = 10; Penalità aggiuntiva (ns) = 50.",
          "In «Consultazione» annota il costo comune di 200 ns per tutte le cento richieste.",
          "Avanza a «Rifornimenti» e moltiplica i 10 miss per 50 ns, controllando i 500 ns aggiuntivi.",
          "In «Media» somma i due costi e dividi per cento; confronta il risultato con AMAT."
        ],
        "risultato": "Il totale è 700 ns e il tempo medio AMAT è 7 ns.",
        "ragionamento": "Le cento consultazioni costano 100 × 2 = 200 ns. I dieci rifornimenti aggiungono 10 × 50 = 500 ns; (200 + 500) ÷ 100 = 7 ns.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Totale",
            "valore": "700 ns"
          },
          {
            "passo": 2,
            "campo": "AMAT",
            "valore": "7 ns"
          }
        ]
      },
      {
        "titolo": "Raddoppiare la frequenza dei miss",
        "parametri": {
          "m": 20,
          "pen": 50
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Miss ogni cento accessi = 20; Penalità aggiuntiva (ns) = 50.",
          "In «Consultazione» verifica che il costo comune resti 200 ns e che gli hit scendano a 80.",
          "In «Rifornimenti» conta 20 richieste in ambra e confronta la penalità totale con quella del primo caso.",
          "Raggiungi «Media» e ricava l’incremento di 5 ns rispetto ai 7 ns iniziali."
        ],
        "risultato": "Venti miss aggiungono 1000 ns: il totale è 1200 ns e AMAT vale 12 ns.",
        "ragionamento": "La consultazione resta identica per ogni accesso. Dieci rifornimenti aggiuntivi costano 500 ns, ripartiti sulle cento richieste: la media cresce di 5 ns, da 7 a 12 ns.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Totale",
            "valore": "1200 ns"
          },
          {
            "passo": 2,
            "campo": "AMAT",
            "valore": "12 ns"
          }
        ]
      }
    ]
  },
  "6.1.4": {
    "scopo": "Una scrittura può sporcare una linea che dovrà essere riscritta quando viene sostituita. Ricostruirai quattro accessi distinguendo hit, caricamenti e write-back, così da spiegare ciascun conteggio.",
    "teoria": [
      "La cache conserva vicino al processore copie di piccoli gruppi di byte chiamati linee. Una lettura o scrittura è un hit se la copia giusta è già presente e un miss quando occorre cercarla nel livello successivo. La posizione in cui la linea può essere inserita dipende dal tipo di cache.",
      "Nella corrispondenza diretta ogni blocco ha una sola posizione possibile in cache. La politica write-allocate carica la linea quando una scrittura la trova assente. Con write-back la linea modificata viene riscritta verso la memoria sottostante quando deve lasciare il posto a un altro blocco.",
      "Nella cache della prova ci sono due posizioni e ogni linea contiene 16 byte. Scrivere all’indirizzo 0 carica il blocco 0 nella posizione 0 e lo segna sporco; leggere 4 riusa la stessa copia. Il blocco 2, richiesto dall’indirizzo 32, compete per la posizione 0 e ne espelle la copia modificata, che deve essere riscritta. Scrivere 16 usa invece la posizione 1, ancora libera. Il conteggio si arresta dopo questi accessi e lascia in cache le linee residue.",
      "Per ricostruire ogni riga della traccia, dividi l’indirizzo per 16 e conserva il quoziente intero, che è il numero di blocco. Dividendo quel numero per 2, il resto sceglie l’indice 0 oppure 1 e il quoziente fornisce il tag, l’etichetta che distingue i blocchi destinati alla stessa posizione. Per l’indirizzo 32 si ottengono blocco 2, indice 0 e tag 1. Il bit Dirty vale uno quando una scrittura ha modificato la copia e zero quando è pulita; espellere una copia con Dirty uguale a uno causa un write-back."
    ],
    "introduzione": [
      "Questi esercizi ti allenano a ricostruire lo stato della cache dopo ciascun accesso, affinché i conteggi derivino dalle copie effettivamente presenti. Nel caso guidato una scrittura carica il blocco assente, secondo la politica write-allocate, e lo marca sporco. La politica write-back conserva le modifiche nella cache finché la sostituzione della copia richiede di riscriverle nella memoria principale.",
      "Premi «Carica l’esempio guidato» e verifica l’esercizio 3, traccia 1. Per la sequenza scrivi 0, leggi 4, leggi 32, scrivi 16, inserisci il numero previsto di hit e premi «Registra la previsione». Avanza con «Passo successivo», confrontando la lettura di 4 con quella di 32: soltanto la seconda espelle una copia sporca. Nella prova completa verifica anche il conteggio dei write-back."
    ],
    "lettura": "La ricostruzione segue gli indirizzi nell’ordine della traccia e aggiorna indice, tag e bit dirty. Guarda soprattutto la sostituzione del blocco 0 con il blocco 2: il conteggio delle riscritture dipende dallo stato della vittima.",
    "conclusione": "La traccia produce un hit, alla lettura di 4, e un write-back, quando la lettura di 32 espelle il blocco 0 modificato. La linea del blocco 1 rimane sporca al termine: aggiungerne la riscrittura al conto significherebbe includere uno svuotamento finale estraneo alla sequenza richiesta.",
    "procedura": [
      "Premi «Carica l’esempio guidato» e verifica esercizio 3, «Espulsioni e blocchi sporchi», traccia 1.",
      "Per scrivi 0 → leggi 4 → leggi 32 → scrivi 16, dividi gli indirizzi per 16 e assegna gli indici mediante blocco modulo due.",
      "Inserisci una previsione nel campo Hit e premi «Registra la previsione». Avanza fino all’accesso a 32, spiegando perché la vittima richiede una scrittura.",
      "Completa la ricostruzione; apri «Apri la prova completa» per inserire anche Write-back e confrontare entrambi i conteggi con lo svolgimento."
    ],
    "risultato": "Per la traccia iniziale si ottengono 1 hit e 1 write-back.",
    "ragionamento": "Scrivere 0 carica e sporca il blocco 0; leggere 4 riusa quella linea e produce l’unico hit. Leggere 32 chiede il blocco 2 allo stesso indice e fa riscrivere la vittima sporca. Scrivere 16 carica il blocco 1 nella posizione libera; la sua modifica resta in cache al termine."
  },
  "6.1.5": {
    "scopo": "Il tempo medio di una cache deriva dalla frequenza dei percorsi. Ripercorrerai il conto di cento richieste per verificare che la penalità venga assegnata soltanto ai dieci miss.",
    "teoria": [
      "Il processore può trovare un dato in una memoria vicina e veloce, la cache, oppure doverlo chiedere a una memoria più lenta. Tutti gli accessi cominciano con la ricerca in cache: un successo è chiamato hit, un insuccesso miss. Il miss richiede il tempo aggiuntivo necessario a portare il dato più vicino.",
      "Il tempo di rifornimento è qui una penalità aggiuntiva rispetto alla ricerca iniziale. Le durate si misurano in ns, nanosecondi: un nanosecondo è un miliardesimo di secondo. Per trovare la media si somma una ricerca per ciascun accesso e una penalità per ciascun miss, quindi si divide il totale per il numero di accessi.",
      "Nella traccia cento ricerche costano 2 ns ciascuna, per 200 ns. Dieci rifornimenti da 50 ns aggiungono 500 ns. La somma di 700 ns divisa per cento dà 7 ns per accesso. Dividere per due la somma dei tempi di un hit e di un miss assegnerebbe la stessa frequenza a eventi presenti nelle proporzioni 90% e 10%."
    ],
    "introduzione": [
      "Ripercorrere il calcolo della latenza media serve a controllare che ogni durata riceva il peso della propria frequenza. Un hit trova il blocco nella cache, mentre un miss richiede anche il rifornimento. Verificherai che sommare tutte le consultazioni e le sole penalità conduca allo stesso totale ottenuto contando separatamente i percorsi completi di hit e miss.",
      "Ripristina con «Carica l’esempio guidato» l’esercizio 4, traccia 1, poi usa «Passo successivo» per seguire consultazioni, rifornimenti e divisione finale. Confronta i 700 ns complessivi con il conto alternativo di novanta hit da 2 ns e dieci miss da 52 ns. La coincidenza dei totali giustifica i 7 ns medi e rende visibile il ruolo delle frequenze."
    ],
    "lettura": "Segui i riquadri delle consultazioni, dei rifornimenti e del totale. La quantità finale divide il tempo complessivo per cento, mentre i tempi intermedi appartengono all’intera sequenza.",
    "conclusione": "Controlla la media ricostruendo i 700 ns totali: novanta hit costano 90 × 2 ns e dieci miss costano 10 × 52 ns. La loro somma, divisa per cento, deve dare gli stessi 7 ns ottenuti separando consultazioni e rifornimenti.",
    "procedura": [
      "Premi «Carica l’esempio guidato» e verifica esercizio 4, «Pesare il costo di un miss», traccia 1.",
      "Leggi i dati della traccia: consultazione 2 ns, dieci miss su cento e penalità aggiuntiva 50 ns.",
      "Usa «Passo successivo» per controllare separatamente 100 × 2 e 10 × 50; annota le unità in nanosecondi.",
      "Completa la ricostruzione e verifica la divisione del totale per cento. Puoi usare «Apri la prova completa» per svolgere il conto prima di rivedere i passaggi."
    ],
    "risultato": "Il tempo medio della traccia è 7 ns per accesso.",
    "ragionamento": "Le consultazioni producono 200 ns e i rifornimenti 500 ns. Il totale di 700 ns distribuito su cento accessi dà 7 ns; le frequenze dei due percorsi sono 90% e 10%."
  },
  "6.2.1": {
    "scopo": "Due processi emettono lo stesso indirizzo virtuale. Variando una delle loro tabelle studierai quando le richieste raggiungono celle fisiche diverse e quando condividono esattamente lo stesso byte.",
    "teoria": [
      "Due programmi possono indicare con lo stesso numero due celle diverse di memoria. Ciascun programma in esecuzione, chiamato processo, usa infatti indirizzi virtuali, il cui significato dipende dalla tabella che il sistema gli ha assegnato. Per sapere dove trovare un byte nella memoria fisica occorre consultare la tabella del processo che effettua la richiesta.",
      "Lo spazio virtuale è suddiviso in pagine e la memoria fisica in porzioni della stessa grandezza, chiamate frame. Qui ciascuna contiene 4096 byte. Il numero della pagina virtuale, abbreviato VPN, sceglie la riga della tabella. In quella riga si trova il numero del frame fisico, o PFN. La posizione del byte entro la pagina, detta offset, si conserva durante il passaggio.",
      "Con un offset di 100 byte, A cerca il dato a 100 byte dall’inizio del frame 4, cioè all’indirizzo fisico 4 × 4096 + 100 = 16 484. Se la tabella di B indica anch’essa il frame 4 per la pagina 3, le due richieste raggiungono lo stesso byte. Assegnando a B il frame 8 si sposta la base fisica di B, mentre l’offset rimane 100.",
      "Le etichette VA e PA significano rispettivamente indirizzo virtuale e indirizzo fisico. Per la pagina 3 il VA si calcola come 3 × 4096 + offset, mentre ogni PA si calcola come PFN × 4096 + offset. Il numero di frame PFN è dunque un indice di gruppi di byte; il PA è l’indirizzo del singolo byte.",
      "La figura scrive gli indirizzi in esadecimale, riconoscibile dal prefisso 0x. In questa numerazione ogni posizione pesa sedici volte quella alla sua destra: 0x64 vale 6 × 16 + 4 = 100, mentre 0x1000 vale 4096. Perciò 0x4064 indica la base 4 × 4096 più l’offset 100. Le due forme numeriche descrivono la medesima posizione di memoria."
    ],
    "introduzione": [
      "Lo stesso indirizzo virtuale può condurre a byte fisici diversi perché ogni processo, cioè programma in esecuzione, dispone della propria tabella. Studierai questa dipendenza confrontando due traduzioni. La pagina raggruppa gli indirizzi virtuali, il frame è il gruppo fisico della stessa dimensione e l’offset indica la posizione del byte, che resta invariata quando cambia il frame assegnato.",
      "Carica «Stesso VA, due celle fisiche» con «Carica questo caso» e segui le tabelle di A e B mediante «Passo successivo». Mantieni lo scostamento a 100 byte, cambia «Frame di B per VPN 3» da 8 a 4 e premi «Applica i parametri». Confronta gli indirizzi finali: quando coincidono sia frame sia offset, le due richieste raggiungono esattamente lo stesso byte."
    ],
    "lettura": "Il riquadro VPN 3 si biforca verso le tabelle A e B. Ciascuna freccia porta al frame scelto dalla propria tabella; i riquadri finali mostrano gli indirizzi fisici. Lo stesso offset compare in entrambi i calcoli, per cui la differenza deriva dalla base del frame.",
    "conclusione": "Per stabilire se A e B condividano il byte, confronta insieme frame e offset. Con offset 100 e frame 4 per entrambi ottieni un solo PA, 0x4064; assegnando il frame 8 a B ottieni 0x8064. L’uguaglianza dei soli indirizzi virtuali lascia ancora da consultare le due tabelle.",
    "controlli": {
      "offset": "Posizione del byte nella pagina, in byte da 0 a 4095. È la stessa per A e B e viene aggiunta alla base di ciascun frame.",
      "frame": "Numero del frame fisico associato alla pagina virtuale 3 del processo B. La tabella di A mantiene il frame 4: scegliendo 4 anche per B ottieni condivisione."
    },
    "esperienze": [
      {
        "titolo": "Stesso VA, due celle fisiche",
        "parametri": {
          "offset": 100,
          "frame": 8
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Scostamento nella pagina = 100; Frame di B per VPN 3 = 8.",
          "In «Indirizzo emesso» ricomponi pagina 3 e offset 100, ottenendo il VA 0x3064.",
          "In «Tabella di A» annota il frame 4 e il PA 0x4064; avanza a «Tabella di B» e confronta il frame 8.",
          "Verifica che i due indirizzi fisici conservino l’offset 0x64 e differiscano nelle basi dei frame."
        ],
        "risultato": "A raggiunge 0x4064 e B raggiunge 0x8064: i due byte fisici sono distinti.",
        "ragionamento": "Il VA comune è 3 × 4096 + 100. Le tabelle sostituiscono il numero 3 con 4 e 8: 4 × 4096 + 100 = 16484 e 8 × 4096 + 100 = 32868.",
        "attesi": [
          {
            "passo": 2,
            "campo": "PFN",
            "valore": "8"
          },
          {
            "passo": 2,
            "campo": "PA di B",
            "valore": "0x8064"
          }
        ]
      },
      {
        "titolo": "Condividere lo stesso frame",
        "parametri": {
          "offset": 100,
          "frame": 4
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Scostamento nella pagina = 100; Frame di B per VPN 3 = 4.",
          "In «Indirizzo emesso» verifica che il VA resti 0x3064.",
          "Segui prima «Tabella di A» e poi «Tabella di B»: entrambe le voci della pagina 3 indicano ora il frame 4.",
          "Confronta i due riquadri fisici e stabilisci se riguardino un solo byte o due byte distinti."
        ],
        "risultato": "Entrambi i processi raggiungono lo stesso PA 0x4064.",
        "ragionamento": "La base fisica è per entrambi 4 × 4096 e l’offset comune è 100. L’uguaglianza di frame e offset rende identico il byte raggiunto, benché le traduzioni appartengano a due processi.",
        "attesi": [
          {
            "passo": 2,
            "campo": "PFN",
            "valore": "4"
          },
          {
            "passo": 2,
            "campo": "PA di B",
            "valore": "0x4064"
          }
        ]
      }
    ]
  },
  "6.2.2": {
    "scopo": "Una pagina assente può appartenere a un file leggibile oppure trovarsi fuori dalle regioni ammesse al processo. Seguirai la decisione del kernel per capire quando un fault conduce al caricamento e quando termina con una violazione.",
    "teoria": [
      "Un programma può leggere un documento come se i suoi byte occupassero già una regione della propria memoria. Il sistema operativo associa quella regione al file e può caricarne il contenuto una pagina per volta, quando viene richiesto. Una pagina è qui un gruppo di 4096 byte, che trova posto in una porzione di memoria fisica della stessa grandezza, il frame.",
      "Quando l’istruzione di lettura richiede un byte, un circuito del processore, l’unità di gestione della memoria (MMU), cerca la pagina e ne verifica i permessi. Il campo Present è un bit, cioè una cifra binaria: vale uno quando la pagina è residente nella memoria principale, detta RAM. Se vale zero, l’istruzione si interrompe e passa il controllo al kernel, la parte del sistema operativo incaricata di gestire la memoria. Questa eccezione prende il nome di page fault ed è sincrona perché nasce dalla lettura che si sta eseguendo.",
      "Per la pagina di file assente, il kernel trova una regione leggibile, carica i byte nel frame 7 e fa ripetere l’istruzione. Il byte di offset 16 si trova allora all’indirizzo 7 × 4096 + 16. Se la stessa pagina è già residente, si raggiunge quel byte direttamente. Con un indirizzo esterno alle regioni ammesse, il kernel segnala invece una violazione e il contatore delle letture dal file resta a zero.",
      "VPN significa numero di pagina virtuale e PA significa indirizzo fisico del byte. Il bit Present descrive la residenza nella RAM; il permesso della regione descrive se il programma in esecuzione, chiamato processo, può effettuare la lettura. Il kernel combina le due informazioni prima di recuperare i dati. Nella figura I/O indica il trasferimento di dati fra file e memoria; il PA 0x7010 è scritto in base sedici e vale 7 × 4096 + 16 = 28688."
    ],
    "introduzione": [
      "Una pagina assente dalla memoria richiede una decisione prima che il programma possa proseguire. Seguirai il page fault, l’eccezione che interrompe l’istruzione e affida il controllo al kernel, la parte del sistema operativo che gestisce la memoria. Il confronto chiarirà perché la residenza descritta dal bit Present e il permesso della regione virtuale determinino insieme la possibilità del caricamento.",
      "Avvia «Caricare una pagina ammessa» con «Carica questo caso», poi usa «Passo successivo» per osservare la lettura dal file e il nuovo tentativo dell’istruzione. Ripeti con «Rifiutare un indirizzo estraneo alle regioni», confrontando i contatori e il campo dell’indirizzo fisico. Lo zero nelle letture dal file va interpretato insieme all’esito, perché può accompagnare tanto una pagina già residente quanto una richiesta respinta."
    ],
    "lettura": "La richiesta passa dalla pagina 2 a uno dei tre rami: frame già in RAM, lettura dal file o regione assente. Il campo P è il bit di presenza. Nel riquadro finale compare un indirizzo fisico soltanto se il cammino ha prodotto una traduzione utilizzabile; i contatori distinguono trasferimenti e tentativi dell’istruzione.",
    "conclusione": "La previsione riguarda le letture dal file: conta una lettura per la pagina ammessa e assente, zero per la pagina già residente e zero per l’indirizzo esterno alle regioni. Per distinguere i due zeri, osserva l’esito: nel primo caso il byte viene letto, nel secondo viene segnalata la violazione.",
    "controlli": {
      "cond": "Situazione iniziale della pagina virtuale 2: residente, caricabile dal file oppure esterna alle regioni del processo. La richiesta conserva offset 16 in tutti i casi."
    },
    "esperienze": [
      {
        "titolo": "Caricare una pagina ammessa",
        "parametri": {
          "cond": "file"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Pagina richiesta = Pagina di file assente.",
          "In «Richiesta» osserva Present = 0 e il permesso di lettura della regione.",
          "Avanza a «Eccezione sincrona»: annota una lettura da file e il frame destinazione 7.",
          "In «Esito» verifica Present finale = 1, il PA 0x7010 e il singolo tentativo ripetuto dell’istruzione."
        ],
        "risultato": "La pagina viene caricata nel frame 7; il dato è a 0x7010 e l’istruzione viene ritentata una volta.",
        "ragionamento": "La regione ammette la lettura, quindi il kernel può riempire il frame. Con pagine da 4096 byte, il PA è 7 × 4096 + 16 = 28688, ossia 0x7010.",
        "attesi": [
          {
            "passo": 2,
            "campo": "PA del dato",
            "valore": "0x7010"
          },
          {
            "passo": 2,
            "campo": "Istruzioni ritentate",
            "valore": "1"
          }
        ]
      },
      {
        "titolo": "Rifiutare un indirizzo estraneo alle regioni",
        "parametri": {
          "cond": "fuori"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Pagina richiesta = Indirizzo fuori dalle regioni.",
          "In «Richiesta» osserva ancora Present = 0 e leggi «nessuna regione» nel campo dei permessi.",
          "In «Eccezione sincrona» controlla che il kernel interrompa il percorso prima di scegliere un frame o leggere il file.",
          "In «Esito» confronta i contatori con il caso precedente e interpreta il trattino al posto del PA."
        ],
        "risultato": "La richiesta termina con una violazione: zero letture da file, zero istruzioni ritentate e nessun PA.",
        "ragionamento": "L’assenza della pagina provoca l’esame del kernel in entrambi i casi. Qui manca una regione ammessa che giustifichi il caricamento, perciò il trasferimento e il nuovo tentativo rimangono esclusi dal percorso.",
        "attesi": [
          {
            "passo": 2,
            "campo": "PA del dato",
            "valore": "—"
          },
          {
            "passo": 2,
            "campo": "Istruzioni ritentate",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "6.2.3": {
    "scopo": "Un programma legge la sequenza A, B, A, C, D, A, C. Misurerai quante pagine compaiono nei riferimenti recenti e confronterai due capacità della RAM per osservare le sostituzioni provocate da LRU.",
    "teoria": [
      "Mentre esegue un calcolo, un programma può tornare più volte sugli stessi dati. La sequenza A, B, A, C, D, A, C indica, in ordine di tempo, le pagine di memoria che gli servono. Ciascuna pagina occupa un posto, chiamato frame, nella memoria fisica. Quando arriva una richiesta per una pagina assente, si verifica un evento chiamato page fault, che in questo caso richiede di caricare la pagina.",
      "Una finestra di osservazione raccoglie un certo numero di richieste consecutive. Le pagine distinte che compaiono nella finestra formano l’insieme di lavoro, o working set; la sua cardinalità è il numero di pagine diverse. Subito dopo la quarta richiesta, per esempio, una finestra larga quattro contiene A, B, A, C. Le pagine da tenere disponibili sono tre, perché le due richieste per A riguardano la stessa pagina.",
      "Se i tre frame sono pieni quando arriva D, occorre scegliere una pagina da sostituire. Il criterio LRU, dall’inglese least recently used, sceglie quella il cui ultimo utilizzo è più lontano nel tempo. La seconda visita ad A ha reso A più recente di B, perciò esce B. La finestra racconta quali pagine sono servite di recente, mentre la coda dei residenti registra quali si trovano ancora in memoria."
    ],
    "introduzione": [
      "La memoria necessaria a un programma dipende dalle pagine diverse che usa nello stesso periodo. Misurerai l’insieme di lavoro, formato dalle pagine presenti nella finestra dei riferimenti recenti, e lo confronterai con i frame disponibili. Seguirai inoltre LRU, il criterio che sostituisce la pagina usata meno recentemente, per distinguere il fabbisogno osservato dalla storia dei caricamenti.",
      "Con «Carica questo caso» avvia la traccia con finestra quattro e tre frame; attraverso «Passo successivo» osserva l’ordine dei residenti e l’espulsione di B all’arrivo di D. Ripeti con due frame, mantenendo la stessa finestra. Confronta i quattro e sei fault complessivi con il deficit finale di zero e un frame: i primi descrivono l’intera traccia, il secondo soltanto l’ultima finestra."
    ],
    "lettura": "La parentesi sotto la sequenza delimita la finestra corrente. Sotto di essa i riquadri residenti sono ordinati dal meno recente, a sinistra, al più recente, a destra. Il contatore dei fault cresce soltanto quando la pagina richiesta manca dai residenti; la cardinalità dell’insieme conta ogni lettera una volta.",
    "conclusione": "Nell’ultima finestra di quattro richieste compaiono C, D, A, C, quindi l’insieme di lavoro contiene tre pagine: servono zero frame aggiuntivi con capacità tre e uno con capacità due. Questo è il valore richiesto dalla previsione. I fault cumulati, rispettivamente quattro e sei, descrivono invece l’intera storia dei caricamenti.",
    "controlli": {
      "w": "Numero massimo di riferimenti recenti osservati nella finestra. Cambia l’insieme di lavoro calcolato, mentre la politica LRU considera l’ordine effettivo degli accessi.",
      "f": "Numero di pagine che possono risiedere contemporaneamente. Quando tutti i frame sono occupati, una richiesta assente sostituisce la pagina usata meno di recente."
    },
    "esperienze": [
      {
        "titolo": "Tre frame per la traccia",
        "parametri": {
          "w": 4,
          "f": 3
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Ampiezza della finestra = 4; Frame disponibili = 3.",
          "Avanza fino a «Riferimento 4 · C»: annota l’insieme A, B, C e l’ordine dei residenti B, A, C.",
          "Al «Riferimento 5 · D» osserva l’espulsione di B, la pagina usata meno di recente; conta quattro fault cumulati.",
          "Completa i riferimenti ad A e C e confronta l’insieme finale con i residenti D, A, C."
        ],
        "risultato": "La traccia termina con 4 fault, tre pagine distinte nella finestra e residenti D, A, C.",
        "ragionamento": "I primi accessi ad A, B e C caricano tre pagine. D richiede il quarto caricamento ed espelle B; le successive A e C sono ancora residenti, quindi il contatore resta a quattro.",
        "attesi": [
          {
            "passo": 6,
            "campo": "Frame aggiuntivi per l’insieme",
            "valore": "0"
          },
          {
            "passo": 6,
            "campo": "Fault cumulati",
            "valore": "4"
          }
        ]
      },
      {
        "titolo": "Due frame e riusi persi",
        "parametri": {
          "w": 4,
          "f": 2
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Ampiezza della finestra = 4; Frame disponibili = 2.",
          "Fermati a «Riferimento 4 · C»: i due frame impongono già l’espulsione di B.",
          "In «Riferimento 5 · D» annota l’uscita di A e verifica che l’insieme recente contenga quattro pagine a fronte di due frame.",
          "Segui «Riferimento 6 · A» e «Riferimento 7 · C»: conta i due nuovi fault e leggi il deficit finale."
        ],
        "risultato": "La traccia termina con 6 fault, residenti A, C e un frame aggiuntivo necessario per l’insieme finale.",
        "ragionamento": "Con due frame, dopo C restano A e C; D espelle A. La richiesta successiva di A espelle C e quella di C espelle D. I due riusi finali richiedono così nuovi caricamenti, facendo salire i fault da quattro a sei.",
        "attesi": [
          {
            "passo": 6,
            "campo": "Frame aggiuntivi per l’insieme",
            "valore": "1"
          },
          {
            "passo": 6,
            "campo": "Fault cumulati",
            "valore": "6"
          }
        ]
      }
    ]
  },
  "6.2.4": {
    "scopo": "Anche una piccola quota di page fault può dominare il tempo di accesso. Distribuirai il loro costo su un milione di richieste, mantenendo esplicita la conversione fra millisecondi e nanosecondi.",
    "teoria": [
      "Il sistema raggruppa gli indirizzi di un programma in pagine, porzioni di uguale dimensione. Quando il processore chiede un dato la cui pagina è già nella memoria principale, detta RAM, il servizio della richiesta può essere molto rapido. Se la pagina manca, il sistema deve prima procurarsela e poi riprendere l’istruzione interrotta. Questo evento, il page fault, può richiedere un trasferimento da un dispositivo assai più lento della memoria. Poche attese lunghe possono così incidere sul tempo complessivo di un programma.",
      "Il modello misura un milione di richieste. Ciascuna riceve 100 nanosecondi di servizio ordinario, ai quali si aggiunge, per ogni fault, la penalità scelta. Un nanosecondo è un miliardesimo di secondo, mentre un millisecondo è un millesimo. Per riportare la penalità sulla scala del servizio ordinario, ogni millisecondo va quindi moltiplicato per un milione.",
      "Con mille fault da un millisecondo, le attese aggiuntive durano un miliardo di nanosecondi. Distribuite su un milione di richieste, incidono per 1000 nanosecondi su ciascuna, portando la media a 1100. Riducendo i fault a dieci, la quota supplementare scende a 10 nanosecondi e la media a 110. Il costo del singolo fault rimane identico; cambia la frequenza con cui viene pagato."
    ],
    "introduzione": [
      "Un evento raro può pesare molto sulla media quando richiede un’attesa lunga. Valuterai questo effetto per il page fault, che impone di procurare una pagina assente prima di riprendere l’istruzione. Il modello somma a ogni richiesta 100 nanosecondi ordinari e distribuisce le penalità dei fault su un milione di richieste, rendendo essenziale la conversione delle unità.",
      "Carica «Mille fault nel milione» con «Carica questo caso» e avanza fino alla conversione: un millisecondo contiene un milione di nanosecondi. Confronta poi il caso con dieci fault, lasciando invariata la penalità individuale di 1 ms. Le medie di 1100 e 110 ns mostrano che ridurre cento volte gli eventi riduce cento volte il supplemento, mentre i 100 ns ordinari rimangono."
    ],
    "lettura": "La barra ciano rappresenta i 100 ns ordinari per richiesta. Dopo la conversione compare la quota supplementare in ambra; la lunghezza totale esprime la media. Il conteggio dei fault si riferisce al milione di richieste, mentre la penalità in millisecondi riguarda un solo fault.",
    "conclusione": "Moltiplica il numero di fault per milione per la penalità espressa in ms: grazie alla conversione 1 ms = 1 000 000 ns, ottieni il supplemento medio in ns. Aggiungi poi i 100 ns ordinari. Con 10 fault e penalità 1 ms devi ritrovare 110 ns; il risultato riguarda la media delle richieste, mentre ciascun fault conserva la propria attesa di 1 ms.",
    "controlli": {
      "fault": "Numero di fault osservati su un milione di richieste. Il valore 1000 corrisponde a una richiesta ogni mille.",
      "ms": "Attesa aggiuntiva per ciascun fault, in millisecondi. Il modello la somma al servizio ordinario e assume richieste servite in serie."
    },
    "esperienze": [
      {
        "titolo": "Mille fault nel milione",
        "parametri": {
          "fault": 1000,
          "ms": 1
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Fault per milione di richieste = 1000; Penalità per fault (ms) = 1.",
          "In «Intervallo osservato» annota 1000 fault e 100 000 000 ns ordinari.",
          "In «Conversione» verifica che 1000 penalità da 1 ms producano 1 000 000 000 ns aggiuntivi.",
          "In «Costo effettivo» dividi la penalità per il milione di richieste e osserva il rapporto fra le porzioni ciano e ambra."
        ],
        "risultato": "Il supplemento medio è 1000 ns e il tempo medio totale è 1100 ns.",
        "ragionamento": "Mille fault costano 1000 × 1 000 000 ns. Distribuendo questo miliardo su un milione di richieste si ottengono 1000 ns per richiesta; aggiungendo 100 ns di servizio ordinario si arriva a 1100 ns.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Supplemento medio",
            "valore": "1000 ns"
          },
          {
            "passo": 2,
            "campo": "Tempo medio",
            "valore": "1100 ns"
          }
        ]
      },
      {
        "titolo": "Dieci fault nel milione",
        "parametri": {
          "fault": 10,
          "ms": 1
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Fault per milione di richieste = 10; Penalità per fault (ms) = 1.",
          "In «Intervallo osservato» verifica che le richieste ordinarie siano ancora un milione e che i fault siano scesi a 10.",
          "In «Conversione» ricava 10 000 000 ns di penalità complessiva.",
          "In «Costo effettivo» confronta i 10 ns supplementari con i 100 ns ordinari e con il risultato iniziale."
        ],
        "risultato": "Il supplemento medio scende a 10 ns e il totale a 110 ns.",
        "ragionamento": "La penalità del singolo fault rimane 1 ms, mentre gli eventi sono cento volte meno frequenti. La quota media passa da 1000 a 10 ns; il costo ordinario rimane 100 ns.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Supplemento medio",
            "valore": "10 ns"
          },
          {
            "passo": 2,
            "campo": "Tempo medio",
            "valore": "110 ns"
          }
        ]
      }
    ]
  },
  "6.2.5": {
    "scopo": "La finestra dei riferimenti recenti consente di stimare quante pagine un programma sta usando. Distinguerai il numero di accessi dal numero di pagine distinte e confronterai il risultato con tre frame disponibili.",
    "teoria": [
      "Un programma raggiunge la memoria attraverso indirizzi che il sistema raggruppa in pagine di uguale dimensione. La memoria fisica offre un numero limitato di posti della stessa grandezza, i frame. Per stimare quanti ne occorrano, si possono osservare le pagine toccate nelle ultime richieste.",
      "Si chiama finestra l’insieme delle posizioni recenti considerate nella traccia. Una pagina compare nell’insieme di lavoro se è stata usata almeno una volta entro quella finestra. Quando l’accesso più vecchio esce dalla finestra, la sua pagina scompare dall’insieme solo se nessun altro accesso recente la nomina.",
      "Nella sequenza A, B, A, C, D una finestra di quattro riferimenti all’ultimo istante conserva B, A, C, D. La prima A è uscita dall’intervallo; le quattro lettere rimaste sono tutte diverse. L’insieme ha quindi cardinalità quattro, cioè contiene quattro pagine, e richiede quattro frame. Il budget indica la capacità disponibile: rispetto ai tre frame assegnati manca un posto. La formula max(0, cardinalità − budget) sceglie il maggiore fra zero e la differenza, così esprime zero quando i posti bastano."
    ],
    "introduzione": [
      "Per stimare quanti frame servano a un programma, dovrai passare dalla sequenza degli accessi all’insieme delle pagine distinte. La finestra seleziona un numero di riferimenti recenti; l’insieme di lavoro conserva ogni pagina una sola volta. L’esercizio rende osservabile questa differenza e permette di confrontare la capacità richiesta con il budget, ossia il numero di frame disponibili.",
      "Apri l’esercizio 5, traccia 1, con «Carica l’esempio guidato» e considera gli ultimi quattro riferimenti di A, B, A, C, D. Inserisci la previsione nel campo «Pagine distinte» e premi «Registra la previsione». Seguendo «Passo successivo», confronta le quattro pagine rimaste con i tre frame disponibili; «Apri la prova completa» permette di verificare anche l’unico frame aggiuntivo richiesto."
    ],
    "lettura": "La sequenza mostra i riferimenti in ordine. La finestra termina sull’ultimo D e comprende soltanto le quattro posizioni più recenti; l’insieme riporta ogni lettera una volta.",
    "conclusione": "Verifica separatamente le due operazioni: la finestra finale seleziona quattro richieste, poi l’insieme conserva ogni pagina una sola volta. Qui le quattro pagine distinte superano i tre frame di una unità. Ripetizioni aggiuntive della stessa pagina dentro la finestra occuperebbero altri posti nella traccia, lasciando invariato il numero di frame richiesto per quella pagina.",
    "procedura": [
      "Premi «Carica l’esempio guidato» e verifica esercizio 5, «Stimare il budget di frame», traccia 1.",
      "Nella traccia A B A C D, seleziona mentalmente gli ultimi quattro riferimenti: B A C D.",
      "Prevedi il numero di pagine distinte, registra il tentativo e segui la costruzione dell’insieme.",
      "Confronta la cardinalità con il budget di tre frame; nella prova completa inserisci anche quanti frame aggiuntivi servono."
    ],
    "risultato": "La finestra contiene 4 pagine distinte e richiede 1 frame aggiuntivo.",
    "ragionamento": "La prima A cade fuori dalla finestra. Le quattro lettere rimaste sono tutte diverse, perciò la cardinalità è quattro; max(0, 4 − 3) = 1 è il deficit."
  },
  "6.2.6": {
    "scopo": "Un page fault può richiedere di liberare un frame. Seguirai il caso di una vittima pulita per distinguere il salvataggio della vittima dalla lettura della pagina richiesta e localizzare il momento della ripresa.",
    "teoria": [
      "Il sistema divide la memoria di un programma in pagine di uguale grandezza. Quando un’istruzione richiede una pagina assente dalla memoria fisica si verifica un page fault: l’istruzione si interrompe e il kernel, la parte del sistema operativo che gestisce la memoria, deve procurare un frame capace di contenerla. Se tutti i frame sono occupati, sceglie una pagina da rimuovere, detta vittima. Il costo dipende dalle modifiche che la vittima ha ricevuto da quando è stata caricata.",
      "Una pagina si dice pulita quando la copia conservata altrove è ancora valida. Un indicatore di modifica segnala invece una pagina sporca, della quale è necessario salvare il contenuto prima di liberare il frame. La scelta della vittima e le operazioni necessarie al suo sgombero rispondono dunque a domande differenti.",
      "Se la copia su disco è ancora attuale, il frame può essere riutilizzato. Se il programma ha scritto nella pagina e l’unica copia aggiornata si trova nel frame, prima del riuso bisogna conservare quelle modifiche. Nella sequenza delle operazioni questo secondo caso introduce una scrittura oltre alla lettura della pagina richiesta.",
      "La mappatura è la voce di tabella che associa una pagina virtuale al suo frame fisico. Prima di riutilizzare il frame, il kernel ritira la vecchia associazione e rende inutilizzabili le sue copie conservate per accelerare la traduzione. Dopo aver letto completamente la pagina richiesta, installa la nuova associazione e fa ripetere l’istruzione. Si contano come trasferimenti soltanto il salvataggio e il caricamento delle pagine fra memoria e disco."
    ],
    "introduzione": [
      "Quando la RAM è piena, recuperare una pagina assente richiede prima di rendere disponibile un frame. Lo svolgimento ti aiuterà a distinguere le modifiche alle tabelle dai trasferimenti di intere pagine. Una vittima pulita possiede già una copia utilizzabile altrove; una vittima sporca contiene invece modifiche che devono essere salvate prima che il suo spazio venga riutilizzato.",
      "Con «Carica l’esempio guidato» scegli l’esercizio 4, traccia 1, e avanza con «Passo successivo» annotando soltanto le operazioni che trasferiscono pagine fra RAM e disco. Confronta il singolo caricamento necessario con le modifiche delle tabelle, che aggiornano i riferimenti. Individua infine l’installazione della nuova mappatura: insieme alla disponibilità completa dei dati, questa condizione permette di ritentare l’istruzione interrotta."
    ],
    "lettura": "I passaggi seguono il kernel dalla scelta della vittima all’installazione della mappatura. Conta soltanto i trasferimenti di pagine su disco, tenendo separate le modifiche amministrative alle tabelle.",
    "conclusione": "Nel caso guidato la vittima pulita ha già una copia utilizzabile: il solo trasferimento è la lettura della pagina richiesta. Con una vittima modificata da salvare nello stesso frame, occorrerebbero una scrittura e una lettura. In entrambi i casi l’istruzione riparte quando il contenuto completo e la nuova mappatura sono pronti.",
    "procedura": [
      "Premi «Carica l’esempio guidato» e verifica esercizio 4, «Recuperare una pagina con RAM piena», traccia 1.",
      "Leggi le ipotesi: accesso ammesso, pagina di file assente, RAM piena e vittima pulita.",
      "Avanza nei passaggi e annota quali operazioni muovono un’intera pagina fra RAM e disco.",
      "Raggiungi l’installazione della nuova mappatura e collega a quel punto il tentativo ripetuto dell’istruzione; verifica il totale dei trasferimenti."
    ],
    "risultato": "Serve un solo trasferimento, la lettura della pagina dal file. L’istruzione riprende dopo l’installazione della nuova mappatura.",
    "ragionamento": "La vittima pulita dispone già di una copia valida e può cedere il frame. Il kernel ritira la vecchia mappatura, invalida le traduzioni interessate, legge la pagina richiesta e installa la nuova corrispondenza prima di ritentare il caricamento."
  },
  "6.3.1": {
    "scopo": "Tradurre un indirizzo richiede tre coordinate diverse: pagina virtuale, posizione della voce in tabella e byte fisico. Ricostruirai il percorso dell’indirizzo 0xC33, attribuendo a ciascun numero il proprio significato.",
    "teoria": [
      "Per tradurre un indirizzo virtuale, cioè il numero con cui un programma indica un byte, conviene separare il gruppo cui il byte appartiene dalla sua posizione nel gruppo. Un byte contiene otto bit, cifre che valgono zero oppure uno. Con pagine da 1 KiB, dove KiB significa 1024 byte, ogni gruppo contiene 1024 byte. Dividendo l’indirizzo per 1024, il quoziente intero dà il numero della pagina virtuale (VPN) e il resto dà la posizione interna, detta offset.",
      "A ogni pagina corrisponde una voce di tabella, che occupa otto byte e conserva l’informazione necessaria a trovare il gruppo fisico di destinazione, o frame. Per consultare la voce 3 si avanza di 3 × 8 = 24 byte dall’inizio della tabella. Se quell’inizio è 0x100000, la voce si legge a 0x100018. Il prefisso 0x indica la scrittura in base sedici, nella quale il numero scritto 18 vale sedici più otto.",
      "L’indirizzo iniziale 0xC33 equivale a 3123: C vale dodici, quindi 12 × 16² + 3 × 16 + 3 = 3123. Sono tre pagine intere più 51 byte. Dal valore 35 della voce 3 si ricava il frame 17, poiché il formato registra 2 × PFN + valid, con PFN numero del frame e valid bit di validità. Una voce dispari ha valid uguale a uno; sottraendo uno e dividendo per due si trova il PFN. Il dato è dunque a 17 × 1024 + 51 = 0x4433: la tabella ha dato una base nuova, conservando la posizione del byte nella pagina.",
      "VA indica l’indirizzo virtuale e PA quello fisico. RAX è il registro, una piccola memoria del processore, di 64 bit nel quale questa routine restituisce il risultato. Una voce invalida o un indice fuori limite produce sessantaquattro bit a uno, scritti 0xFFFFFFFFFFFFFFFF perché ogni cifra F rappresenta quattro uno. Questa configurazione è la sentinella di errore: comunica al programma che ha richiesto la traduzione di interrompere l’accesso."
    ],
    "introduzione": [
      "Tradurre un indirizzo significa collegare quantità che hanno ruoli diversi: il numero della pagina sceglie una voce, l’indirizzo della voce permette di leggerla e il suo contenuto identifica il frame fisico. Ricostruirai questi passaggi conservando l’offset, la posizione del byte nella pagina. La tabella diventa così una corrispondenza verificabile fra gruppi virtuali e gruppi di memoria fisica.",
      "Premi «Ripristina esempio» e verifica indirizzo 0xC33, pagina da 1 KiB, ossia 1024 byte, e otto voci. Con «Passo successivo» confronta l’indice 3, l’indirizzo della voce 0x100018 e il valore letto 35. Quest’ultimo codifica frame 17 e validità uno: seguendo il risultato 0x4433, controlla che i 51 byte di offset rimangano identici dall’ingresso all’uscita della traduzione."
    ],
    "lettura": "In alto i 32 bit del VA sono separati fra numero di pagina e offset. La freccia seleziona la voce della tabella; la riga evidenziata mostra indice, indirizzo e valore grezzo in colonne distinte. I registri a destra rivelano le quantità soltanto quando il relativo passo le ha calcolate.",
    "conclusione": "Nella traduzione iniziale distingui tre quantità: indice 3, indirizzo della voce 0x100018 e valore letto 35. Soltanto quest’ultimo codifica il frame 17; combinandolo con l’offset 51 ottieni RAX = 0x4433. Una risposta che restituisse 0x100018 confonderebbe la posizione della voce con l’indirizzo del dato.",
    "controlli": {
      "addr": "Indirizzo virtuale del primo byte, fra 0 e 0xFFFFFFFF. Puoi scriverlo in decimale oppure usare i prefissi 0x per l’esadecimale e 0b per il binario. Dopo aver cambiato i parametri, premi «Applica» per ricostruire la traccia con i valori inseriti.",
      "pagebits": "Dimensione della pagina e numero dei bit di offset. Per esempio 1 KiB significa 1024 byte e richiede 10 bit per la posizione interna.",
      "length": "Numero di voci disponibili nella tabella, da 1 a 16. La VPN deve essere minore di questo numero prima che si possa leggere la relativa voce. Le voci sono numerate a partire da zero: otto voci ammettono gli indici da 0 a 7.",
      "cellidx": "Indice della voce da modificare. Il selettore mostra le righe effettivamente disponibili; selezionandone una puoi leggere il suo valore attuale.",
      "cellvalue": "Parola grezza da registrare nella voce selezionata, fra 0 e 32767. Premi «Scrivi nella tabella» per applicarla: nel formato con validità, 2 × PFN + 1 è valido e 2 × PFN è invalido. Questa scrittura usa il proprio pulsante e riporta la traccia al primo passo."
    },
    "procedura": [
      "Premi «Ripristina esempio»: verifica VA 0xC33, pagina da 1 KiB e otto voci. La tabella deve contenere 35 all’indice 3.",
      "Avanza con «Passo successivo» fino a «Campi»: dividi 3123 per 1024 e verifica VPN 3 e offset 0x33, cioè 51.",
      "In «Limite» controlla che 3 sia fra 0 e 7; in «Lettura» separa l’indirizzo 0x100018 dal valore 35 restituito.",
      "In «Decodifica» ricava il frame 17 e in «Risultato» verifica RAX 0x4433. Confronta il calcolo con la base e l’offset mostrati.",
      "Per ripetere l’esperimento con valori scelti da te, cambia i parametri e premi «Applica». Per cambiare il contenuto di una voce, apri «Modifica una voce della tabella», scegli l’indice, inserisci il valore grezzo e premi «Scrivi nella tabella». I pulsanti dei casi già preparati applicano subito il proprio stato."
    ],
    "risultato": "Nell’esempio ripristinato, VPN = 3, offset = 51, voce letta a 0x100018, PFN = 17 e PA restituito in RAX = 0x4433.",
    "ragionamento": "0xC33 vale 3123 = 3 × 1024 + 51. La voce 3 occupa l’indirizzo 0x100000 + 3 × 8 = 0x100018 e contiene 35 = 2 × 17 + 1. Il bit basso autorizza la traduzione e 17 × 1024 + 51 = 17459, cioè 0x4433."
  },
  "6.3.2": {
    "scopo": "Una stessa parola in tabella cambia significato quando cambia il formato. Decodificherai la voce 35 prima come numero di frame accompagnato da validità, poi come PFN diretto, osservando il PA ottenuto.",
    "teoria": [
      "Un indirizzo virtuale, VA, numera i byte di un programma; dividendolo per la dimensione della pagina si ottengono il numero di pagina, VPN, e il resto, chiamato offset. La tabella associa ogni pagina a un frame, una porzione di memoria fisica della stessa grandezza. Ogni voce, detta PTE dall’inglese page table entry, è una parola di memoria che può contenere il numero del frame e un segnale che autorizza a usare la corrispondenza. Il segnale occupa un bit, una cifra binaria che vale zero oppure uno.",
      "Il formato «PFN e bit valido» riserva al segnale l’ultima cifra a destra. PFN indica il numero del frame fisico. La voce 35 si scrive 100011 in binario: l’ultima cifra uno autorizza l’uso della mappatura, mentre le cifre rimaste, 10001, valgono 17. La relazione è PTE = 2 × PFN + valid, dove valid vale zero oppure uno. Il frame zero rimane una destinazione possibile quando il bit di validità vale uno.",
      "Nel formato diretto tutte le cifre appartengono al numero di frame, perciò la stessa voce 35 indica il frame 35. L’indirizzo virtuale, VA, 0xC33 conserva in entrambi i casi l’offset 51 nella pagina da 1024 byte. L’indirizzo fisico, PA, passa quindi da 17 × 1024 + 51 = 0x4433 a 35 × 1024 + 51 = 0x8C33. Cambia la base dalla quale si misura la medesima distanza.",
      "Il prefisso 0x segnala la base sedici, nella quale C vale dodici: 0xC33 corrisponde a 3123 = 3 × 1024 + 51. La sigla KiB nei controlli vale 1024 byte. RAX è il registro del processore che restituisce il PA; nel formato con validità, un bit basso zero conduce alla sentinella 0xFFFFFFFFFFFFFFFF. Nel formato diretto ogni valore della voce è un PFN, incluso zero: la possibilità di leggerla dipende ancora dal controllo del suo indice entro la tabella."
    ],
    "introduzione": [
      "Il significato di una parola memorizzata dipende dal formato che la interpreta. Confronterai due letture della stessa voce di tabella: come numero di frame diretto oppure come numero accompagnato dal bit di validità. Nel secondo formato il bit basso decide se usare la mappatura, mentre i bit rimanenti identificano il frame; la posizione interna del byte resta determinata dall’indirizzo virtuale.",
      "Riparti con «Ripristina esempio» e avanza fino alla decodifica della voce 35. Dopo aver annotato frame 17 e risultato 0x4433, seleziona «PFN diretto» nel controllo «Formato» e premi «Applica». Ripercorri gli stessi passi confrontando la parola binaria, il frame 35 e il risultato 0x8C33. Il cambiamento dell’indirizzo fisico deriva dall’interpretazione della voce, dato che indirizzo virtuale e offset sono rimasti uguali."
    ],
    "lettura": "Dopo «Lettura» compare la parola grezza in binario. Nel formato con validità l’ultimo bit a destra viene evidenziato separatamente; gli altri bit determinano il PFN. Nel formato diretto tutte le cifre appartengono al numero di frame. Segui il campo PFN prima di confrontare RAX.",
    "conclusione": "Controlla che il passaggio fra i formati lasci invariati VA, offset e valore grezzo della voce. Cambia soltanto l’interpretazione di 35: il formato con validità fornisce frame 17 e PA 0x4433, quello diretto frame 35 e PA 0x8C33. Per decidere l’esito di una voce pari occorre quindi conoscere prima il formato selezionato.",
    "controlli": {
      "addr": "Indirizzo virtuale del primo byte, fra 0 e 0xFFFFFFFF. Puoi scriverlo in decimale oppure usare i prefissi 0x per l’esadecimale e 0b per il binario. Dopo aver cambiato i parametri, premi «Applica» per ricostruire la traccia con i valori inseriti.",
      "pagebits": "Dimensione della pagina e numero dei bit di offset. Per esempio 1 KiB significa 1024 byte e richiede 10 bit per la posizione interna.",
      "length": "Numero di voci disponibili nella tabella, da 1 a 16. La VPN deve essere minore di questo numero prima che si possa leggere la relativa voce. Le voci sono numerate a partire da zero: otto voci ammettono gli indici da 0 a 7.",
      "cellidx": "Indice della voce da modificare. Il selettore mostra le righe effettivamente disponibili; selezionandone una puoi leggere il suo valore attuale.",
      "cellvalue": "Parola grezza da registrare nella voce selezionata, fra 0 e 32767. Premi «Scrivi nella tabella» per applicarla: nel formato con validità, 2 × PFN + 1 è valido e 2 × PFN è invalido. Questa scrittura usa il proprio pulsante e riporta la traccia al primo passo.",
      "format": "Regola con cui interpretare la stessa parola grezza: «PFN e bit valido» riserva il bit basso alla validità; «PFN diretto» usa tutto il valore come numero del frame."
    },
    "procedura": [
      "Premi «Ripristina esempio» e verifica formato «PFN e bit valido», VA 0xC33 e pagina da 1 KiB.",
      "Avanza a «Lettura» e osserva 35, cioè 100011 in binario; in «Decodifica» separa il bit basso uno dai bit del frame.",
      "Raggiungi «Risultato» e annota PFN 17 e RAX 0x4433.",
      "Scegli «PFN diretto» nel campo Formato e premi «Applica». Ripercorri i passi: la stessa voce 35 indica ora il frame 35 e porta a 0x8C33.",
      "Per confrontare anche la validità, apri «Modifica una voce della tabella», scegli l’indice 3 e inserisci un valore pari; premi «Scrivi nella tabella». Ripeti il percorso nei due formati, applicando ogni cambio di Formato con «Applica», e giustifica la differenza fra numero di frame e segnale di validità."
    ],
    "risultato": "Con la voce grezza 35, il formato con validità restituisce PFN 17 e PA 0x4433; il formato diretto restituisce PFN 35 e PA 0x8C33.",
    "ragionamento": "Nel primo formato 35 = 2 × 17 + 1: il bit basso vale uno e il numero del frame è 17. Nel secondo formato si conserva tutto il valore 35. L’offset resta 51, quindi i due calcoli sono 17 × 1024 + 51 = 17459 e 35 × 1024 + 51 = 35891."
  },
  "6.3.3": {
    "scopo": "Seguirai una routine di traduzione istruzione per istruzione, collegando registri, indirizzi letti e operazioni sui bit. L’obiettivo è spiegare come il VA iniziale diventi il risultato in RAX e perché il controllo di validità preceda la composizione del PA.",
    "teoria": [
      "Una routine è un breve programma al quale un altro programma, il chiamante, affida un compito. Qui la routine traduce un indirizzo virtuale, VA, nell’indirizzo fisico del byte, PA, usando istruzioni dell’architettura x86-64 scritte in assembly. I registri sono piccole memorie interne al processore: RDI contiene il VA, RSI la base della tabella, RAX il risultato provvisorio e poi quello finale; RCX offre uno spazio di lavoro. Ogni registro R contiene 64 bit, cifre che valgono zero oppure uno. MOV fra registri copia il valore della sorgente nella destinazione, indicata per prima nel listato.",
      "Lo spazio virtuale è diviso in pagine e la memoria fisica in frame della stessa grandezza. Con pagine da 1024 = 2¹⁰ byte, i dieci bit a destra del VA descrivono l’offset, la posizione del byte nella pagina. SHR sposta una copia del VA verso destra di dieci bit, eliminando quel resto: RAX contiene così il numero di pagina virtuale, VPN. Nel caso 0xC33, scritto in base sedici, il valore decimale è 3123 = 3 × 1024 + 51 e la VPN è 3.",
      "Ogni voce della tabella, chiamata PTE, occupa otto byte. MOV con parentesi quadre legge la memoria all’indirizzo racchiuso nelle parentesi. Per VPN 3, [RSI + RAX*8] significa quindi leggere otto byte a 0x100000 + 3 × 8 = 0x100018. Il valore 35 ottenuto sostituisce in RAX il precedente indice 3. Questa voce segue il formato PTE = 2 × PFN + valid, dove PFN è il numero del frame e valid è il bit basso che autorizza a usarlo.",
      "TEST RAX, 1 esegue AND bit per bit: il risultato conserva un uno soltanto dove entrambi gli operandi hanno uno. Poiché il valore 1 ha acceso il solo bit basso, il risultato identifica la validità. TEST conserva la PTE e aggiorna ZF, un indicatore che vale uno quando quel risultato è zero. Con PTE 35 il bit basso è uno e ZF vale zero: JZ, salto se zero, lascia eseguire la riga successiva. Con una PTE pari ZF vale uno e JZ trasferisce l’esecuzione al ramo di errore.",
      "Sul ramo valido SHR di un bit divide la PTE per due scartando il bit di validità e ricava PFN 17. SHL di dieci bit moltiplica questo numero per 1024, producendo la base fisica 0x4400. In RCX si copia il VA e si esegue AND con 1023 = 2¹⁰ − 1, la maschera con dieci uno a destra: restano i dieci bit dell’offset 0x33. OR pone a uno ogni posizione presente in almeno uno degli operandi. Poiché base e offset occupano campi separati, OR li compone come una somma e produce PA 0x4433.",
      "Il ramo di errore scrive −1 in RAX, ossia sessantaquattro uno nella rappresentazione in complemento a due: 0xFFFFFFFFFFFFFFFF è la sentinella concordata con il chiamante. RDI e RSI conservano gli ingressi lungo entrambi i percorsi. Prima di iniziare il listato, il chiamante verifica che la VPN rientri nel numero di voci disponibili: questa verifica precede il caricamento, mentre TEST esamina il contenuto di una voce già letta."
    ],
    "introduzione": [
      "Seguire le istruzioni permette di vedere come una formula di traduzione diventi un programma. Ricostruirai il valore dei registri, piccole memorie del processore, mentre il codice ricava la pagina, legge la voce e compone l’indirizzo fisico. Il controllo del bit di validità precede l’estrazione del frame, perché quel bit determina se il percorso possa raggiungere il risultato oppure debba segnalare errore.",
      "Usa «Ripristina esempio», quindi «Passo successivo» per seguire RAX quando contiene pagina 3, voce 35, frame 17 e indirizzo finale 0x4433. Confronta i riquadri evidenziati con la riga appena eseguita, verificando che RDI e RSI conservino gli ingressi. Scegli poi «Voce invalida»: il test imposta a 1 ZF, l’indicatore di risultato nullo, e il salto conduce alla sentinella di errore."
    ],
    "lettura": "Il listato evidenzia la riga appena eseguita. I quattro riquadri rappresentano RDI, RSI, RAX e RCX; quelli cambiati diventano ambra. Una lettura di memoria riporta l’indirizzo fra parentesi quadre e il dato che entra in RAX. Il flag ZF compare accanto ai registri.",
    "conclusione": "Nel caso iniziale RAX deve assumere in successione VPN 3, PTE 35, PFN 17, base 0x4400 e PA 0x4433. Controlla il significato del valore a ogni passaggio e verifica che RDI e RSI restino quelli iniziali. Con «Voce invalida» osserva invece ZF = 1 e la sentinella finale; l’assenza della voce per indice fuori limite interrompe il chiamante prima del listato.",
    "controlli": {
      "addr": "Indirizzo virtuale del primo byte, fra 0 e 0xFFFFFFFF. Puoi scriverlo in decimale oppure usare i prefissi 0x per l’esadecimale e 0b per il binario. Dopo aver cambiato i parametri, premi «Applica» per ricostruire la traccia con i valori inseriti.",
      "pagebits": "Dimensione della pagina e numero dei bit di offset. Per esempio 1 KiB significa 1024 byte e richiede 10 bit per la posizione interna.",
      "length": "Numero di voci disponibili nella tabella, da 1 a 16. La VPN deve essere minore di questo numero prima che si possa leggere la relativa voce. Le voci sono numerate a partire da zero: otto voci ammettono gli indici da 0 a 7.",
      "cellidx": "Indice della voce da modificare. Il selettore mostra le righe effettivamente disponibili; selezionandone una puoi leggere il suo valore attuale.",
      "cellvalue": "Parola grezza da registrare nella voce selezionata, fra 0 e 32767. Premi «Scrivi nella tabella» per applicarla: nel formato con validità, 2 × PFN + 1 è valido e 2 × PFN è invalido. Questa scrittura usa il proprio pulsante e riporta la traccia al primo passo."
    },
    "procedura": [
      "Premi «Ripristina esempio» e verifica RDI = 0xC33, RSI = 0x100000, pagina da 1 KiB e voce 3 pari a 35.",
      "Avanza con «Passo successivo» attraverso MOV e SHR: la copia in RAX diventa 3. Alla lettura con [RSI + RAX*8], controlla l’indirizzo 0x100018 e il valore 35.",
      "Alla riga TEST RAX, 1 osserva ZF = 0; JZ lascia eseguire la riga seguente del ramo valido. Segui i due shift, spostamenti dei bit, che ricavano il frame 17 e poi la sua base 0x4400.",
      "Segui RCX mentre conserva il VA e ne isola l’offset con AND. All’OR finale verifica RAX = 0x4433 e controlla che RDI e RSI abbiano conservato gli ingressi.",
      "Per ripetere l’esperimento con valori scelti da te, cambia i parametri e premi «Applica». Per cambiare il contenuto di una voce, apri «Modifica una voce della tabella», scegli l’indice, inserisci il valore grezzo e premi «Scrivi nella tabella». I pulsanti dei casi già preparati applicano subito il proprio stato."
    ],
    "risultato": "La routine termina con RAX = 0x4433, RDI = 0xC33 e RSI = 0x100000. Il test della voce 35 produce ZF = 0 e lascia percorrere il ramo valido.",
    "ragionamento": "SHR di dieci bit equivale alla divisione intera per 1024 e produce VPN 3. La lettura restituisce 35; TEST con 1 isola il bit basso, pari a uno, e azzera ZF. Dopo aver ricavato PFN 17, SHL di dieci bit produce 0x4400. AND con 1023 conserva l’offset 0x33 e OR riunisce i campi senza sovrapposizione."
  },
  "6.3.4": {
    "scopo": "Una lettura di otto byte può attraversare il confine di pagina e usare frame lontani. Seguirai separatamente i due tratti per verificare limiti, validità e corrispondenza di ciascun byte.",
    "teoria": [
      "Una richiesta di otto byte descrive otto posizioni consecutive, dalla prima fino a quella che dista sette byte. Il programma le numera nel proprio spazio virtuale. La memoria fisica le ospita in gruppi, i frame, ai quali corrispondono gruppi virtuali della stessa dimensione, le pagine. Il numero della pagina virtuale si abbrevia VPN e seleziona una voce della tabella; l’indirizzo fisico del singolo byte si abbrevia PA. Quando la richiesta attraversa un confine di pagina, occorre cercare anche il frame della pagina successiva.",
      "Nella lettura su due pagine, ogni pagina contiene 4096 byte. La prima posizione è 0x1FFC, a quattro byte dalla pagina che comincia a 0x2000. Il prefisso 0x indica la numerazione esadecimale, nella quale le cifre dopo 9 proseguono da A a F. Quattro byte appartengono quindi alla pagina virtuale 1 e quattro alla pagina 2. Poiché le rispettive voci rinviano ai frame 9 e 20, il primo tratto termina a 0x9FFF e il secondo riprende a 0x14000.",
      "L’ultimo indirizzo di una richiesta si calcola come VA iniziale + numero di byte − 1. Prima di tradurre, il controllore verifica che tale estremo rientri fra zero e 2³² − 1, rappresentabili con 32 cifre binarie. Per ogni pagina verifica poi che il suo indice esista nella tabella e che la voce abbia validità uno. Una voce, o PTE, registra 2 × PFN + valid: 19 codifica frame 9 valido e 41 codifica frame 20 valido. Per ogni tratto si aggiunge alla base PFN × 4096 l’offset, cioè la distanza dalla propria pagina.",
      "Nel caso iniziale il primo tratto fisico va da 0x9FFC a 0x9FFF e il secondo da 0x14000 a 0x14003, con estremi inclusi. La simulazione controlla l’intero intervallo prima di dichiararlo utilizzabile e si arresta al primo tratto che fallisce. La sua sentinella segnala un errore del traduttore didattico. Il modello considera utilizzabili le voci valide ed esamina limiti e validità; i permessi separati di lettura e scrittura richiedono informazioni ulteriori."
    ],
    "introduzione": [
      "Una richiesta di più byte può attraversare due pagine virtuali anche quando i suoi indirizzi sono consecutivi. Imparerai a dividere l’intervallo e a controllare ogni mappatura, poiché pagine adiacenti possono occupare frame fisici lontani. La lunghezza comprende entrambi gli estremi: per otto byte l’ultimo indirizzo dista sette dal primo, e il controllo deve raggiungere anche la pagina che lo contiene.",
      "Premi «Lettura su due pagine» e verifica indirizzo 0x1FFC, pagina da 4 KiB e otto byte da leggere. Con «Passo successivo» confronta i quattro byte diretti a 0x9FFC–0x9FFF con i quattro diretti a 0x14000–0x14003. Per osservare l’arresto sulla seconda pagina, apri «Modifica una voce della tabella», scegli indice 2, scrivi 40 mediante «Scrivi nella tabella» e ripeti il controllo."
    ],
    "lettura": "La fila superiore elenca gli indirizzi virtuali dei byte richiesti; sotto ciascuno appare il PA quando la sua pagina è stata controllata. La tabella raggruppa gli indirizzi per pagina, con VPN, esito e intervallo fisico. Leggi le estremità come incluse, contando quattro byte in ciascuna riga del caso iniziale.",
    "conclusione": "Conta quattro byte nel primo tratto e quattro nel secondo: la somma deve restituire gli otto richiesti. La continuità virtuale 0x1FFF → 0x2000 corrisponde qui al salto fisico 0x9FFF → 0x14000. Modificando la validità della seconda voce, identifica nella tabella il primo tratto che impedisce di accettare la richiesta completa.",
    "controlli": {
      "addr": "Indirizzo virtuale del primo byte, fra 0 e 0xFFFFFFFF. Puoi scriverlo in decimale oppure usare i prefissi 0x per l’esadecimale e 0b per il binario. Dopo aver cambiato i parametri, premi «Applica» per ricostruire la traccia con i valori inseriti.",
      "pagebits": "Dimensione della pagina e numero dei bit di offset. Per esempio 1 KiB significa 1024 byte e richiede 10 bit per la posizione interna.",
      "length": "Numero di voci disponibili nella tabella, da 1 a 16. La VPN deve essere minore di questo numero prima che si possa leggere la relativa voce. Le voci sono numerate a partire da zero: otto voci ammettono gli indici da 0 a 7.",
      "cellidx": "Indice della voce da modificare. Il selettore mostra le righe effettivamente disponibili; selezionandone una puoi leggere il suo valore attuale.",
      "cellvalue": "Parola grezza da registrare nella voce selezionata, fra 0 e 32767. Premi «Scrivi nella tabella» per applicarla: nel formato con validità, 2 × PFN + 1 è valido e 2 × PFN è invalido. Questa scrittura usa il proprio pulsante e riporta la traccia al primo passo.",
      "width": "Numero di byte consecutivi richiesti, fra 1, 2, 4 e 8. L’ultimo VA è il primo più questa lunghezza meno uno; il controllo deve includere ogni pagina attraversata."
    },
    "procedura": [
      "Premi «Ripristina esempio» oppure «Lettura su due pagine»: verifica VA 0x1FFC, pagina da 4 KiB e lunghezza di otto byte.",
      "Prima di avanzare calcola l’ultimo VA, 0x2003. Separa i primi quattro byte, 0x1FFC–0x1FFF, dai quattro successivi, 0x2000–0x2003.",
      "Premi «Passo successivo» per verificare la pagina 1: la voce 19 indica il frame 9 e compare l’intervallo fisico 0x9FFC–0x9FFF.",
      "Avanza per verificare la pagina 2: la voce 41 indica il frame 20. Completa il controllo e confronta 0x14000–0x14003 con il termine del primo intervallo.",
      "Per ripetere l’esperimento con valori scelti da te, cambia i parametri e premi «Applica». Per cambiare il contenuto di una voce, apri «Modifica una voce della tabella», scegli l’indice, inserisci il valore grezzo e premi «Scrivi nella tabella». I pulsanti dei casi già preparati applicano subito il proprio stato."
    ],
    "risultato": "Gli otto byte virtuali da 0x1FFC a 0x2003 attraversano due pagine valide. I tratti fisici sono 0x9FFC–0x9FFF e 0x14000–0x14003, separati nella memoria.",
    "ragionamento": "0x1FFC = 1 × 4096 + 4092, perciò restano quattro byte nella pagina 1. La voce 19 = 2 × 9 + 1 seleziona il frame 9. I quattro byte rimanenti hanno VPN 2 e offset da zero a tre; la voce 41 seleziona il frame 20. La seconda base fisica è 20 × 4096 = 0x14000."
  },
  "6.3.5": {
    "scopo": "Un controllo di validità deve esaminare il bit previsto dal formato. Correggerai un test su tutta la voce, distinguendo una pagina valida nel frame zero da una voce invalida che contiene comunque bit a uno.",
    "teoria": [
      "Il processore può nominare un byte mediante un indirizzo virtuale, che il sistema traduce prima di accedere alla memoria fisica. Immaginiamo di suddividere entrambe in blocchi uguali. Il numero della pagina virtuale identifica una riga della tabella di traduzione. Il contenuto della riga stabilisce in quale blocco fisico, chiamato frame, si trovano i dati.",
      "Il frammento è scritto in assembly x86-64, un linguaggio che nomina le istruzioni del processore. RDI, RSI e RAX sono registri, piccole memorie interne: RDI contiene l’indirizzo virtuale, RSI la base della tabella e RAX la voce letta e poi il risultato. La routine estrae il numero della pagina per trovare la voce e conserva lo spostamento, detto offset, che servirà per raggiungere il byte dentro il frame.",
      "Con pagine da 1024 byte, il VA 0xC33 vale 3123 = 3 × 1024 + 51. La pagina è dunque 3 e l’offset è 51. La PTE, voce della tabella, contiene 2 × PFN + valid, dove PFN è il numero del frame e valid il bit basso. Per la voce 1 il frame è zero e la validità è uno: il PA, indirizzo fisico, coincide quindi con 51, ossia 0x33. La voce 14 ha invece validità zero pur essendo una parola diversa da zero.",
      "Il test deve esaminare il bit di validità mentre la voce è ancora integra. TEST esegue AND bit per bit, conservando un uno soltanto nelle posizioni in cui entrambi gli operandi hanno uno; aggiorna ZF e lascia RAX invariato. ZF è un indicatore che vale uno quando il risultato del test è zero. TEST RAX, RAX esamina l’intera parola e produce zero soltanto per una PTE tutta a zero; TEST RAX, 1 isola invece il bit basso. JZ sceglie il ramo di errore quando ZF vale uno. Dopo un test riuscito, SHR di un bit divide la voce per due e ricava il frame, che può legittimamente valere zero."
    ],
    "introduzione": [
      "Un controllo corretto deve esaminare l’informazione prevista dal formato della voce. In questi esercizi confronterai una mappatura valida nel frame zero con una voce invalida che contiene altri bit accesi. La voce codifica due volte il numero del frame più il bit di validità: verificare quel solo bit permette di separare l’utilizzabilità della mappatura dal valore numerico del frame.",
      "Carica l’esercizio 18, traccia 1, con «Carica l’esempio guidato» e confronta le voci 1 e 14, scritte in binario come 0001 e 1110. Registra la previsione della falsa accettazione mediante «Registra la previsione», poi avanza nella ricostruzione. Con «Apri la prova completa» confronta TEST RAX, RAX con TEST RAX, 1: il secondo isola la validità e conserva correttamente il frame zero."
    ],
    "lettura": "La ricostruzione affianca le PTE 1 e 14 e mette in evidenza il bit basso. Nel listato della prova completa individua TEST e il salto JZ immediatamente successivo; osserva il registro RAX prima che lo shift elimini la validità.",
    "conclusione": "Il collaudo deve distinguere PTE 1, valida e diretta al frame zero, da PTE 14, invalida pur avendo altri bit accesi. Il test sul solo bit basso accetta la prima e respinge la seconda. Per la prima controlla PA 0x33; per la seconda controlla l’intera sentinella di 64 bit.",
    "procedura": [
      "Premi «Carica l’esempio guidato» e verifica esercizio 18, «Una mappatura valida nel frame zero», traccia 1.",
      "Confronta PTE 1 e PTE 14: trascrivile come 0001 e 1110 e prevedi quale parola viene accettata erroneamente da TEST RAX, RAX.",
      "Registra la previsione e segui la ricostruzione fino al test sul solo bit basso. Calcola l’offset di 0xC33 con pagine da 1024 byte.",
      "Apri «Apri la prova completa»: inserisci 14, scegli TEST RAX, 1 e ricava il PA per la voce 1. Nell’editor sostituisci il test e usa il collaudo della routine."
    ],
    "risultato": "La falsa accettazione riguarda PTE 14. Il test corretto è TEST RAX, 1; per PTE 1 il PA valido è 0x33.",
    "ragionamento": "TEST RAX, RAX considera diverso da zero anche 14, benché il suo bit basso sia zero. TEST RAX, 1 verifica invece la sola validità e lascia integra la voce. Per PTE 1 si ottiene frame zero e offset 51, quindi PA = 0 × 1024 + 51 = 0x33."
  },
  "6.3.6": {
    "scopo": "La sentinella di errore deve avere la larghezza stabilita dal contratto della routine. Ricostruirai il valore prodotto da una scrittura in EAX e lo confronterai con i sessantaquattro bit richiesti al ritorno in RAX.",
    "teoria": [
      "Un registro è una piccola memoria nel processore, composta da bit che valgono zero oppure uno. Nell’architettura x86-64 il nome RAX indica 64 bit, mentre EAX indica i 32 bit della parte bassa. Una routine è un breve programma che restituisce il risultato al programma chiamante. Per segnalare un errore può restituire una configurazione speciale, detta sentinella; il contratto stabilisce quale configurazione il chiamante debba riconoscere.",
      "Quando un’istruzione scrive in EAX, il processore azzera anche i trentadue bit superiori di RAX. Questo dettaglio diventa visibile nei casi in cui il programma debba distinguere una parola piena di uno da una parola che contiene bit a uno soltanto nella metà inferiore.",
      "MOV copia nella destinazione, scritta per prima, il valore indicato dopo la virgola. Nella rappresentazione in complemento a due, −1 è formato da tutti uno alla larghezza scelta. Se il contratto richiede sessantaquattro uno, MOV EAX, −1 ne scrive trentadue e restituisce in RAX 0x00000000FFFFFFFF. Il prefisso 0x indica la base sedici e ciascuna F rappresenta quattro uno. MOV RAX, −1 scrive invece 0xFFFFFFFFFFFFFFFF. Per riconoscere l’errore si deve confrontare l’intero registro con la configurazione del contratto.",
      "Nel traduttore del caso guidato RDI contiene l’indirizzo virtuale e RSI la base della tabella. Correggere il ramo di errore deve conservare questi ingressi e il calcolo del ramo valido, che usa pagine da 8192 byte. Il collaudo controlla perciò sia la sentinella completa sia un indirizzo fisico valido: verificare soltanto la metà bassa lascerebbe indistinguibili le due istruzioni sul ramo di errore."
    ],
    "introduzione": [
      "Una sentinella è un valore convenuto con cui una routine comunica un errore al programma chiamante. Verificherai perché anche la larghezza del registro faccia parte di questo accordo: RAX contiene 64 bit, mentre EAX ne indica i 32 inferiori. Nell’architettura x86-64 scrivere EAX azzera la metà alta di RAX, quindi due istruzioni apparentemente simili producono configurazioni diverse.",
      "Con «Carica l’esempio guidato» richiama l’esercizio 20, traccia 1, e usa «Passo successivo» per separare le due metà del risultato di MOV EAX, −1. Confronta gli zeri superiori con gli uno richiesti dalla sentinella completa. Apri la prova completa e sostituisci l’istruzione con MOV RAX, −1; il controllo del ramo valido serve anche a verificare che la riparazione conservi il normale indirizzo restituito."
    ],
    "lettura": "I riquadri dividono il registro in metà alta e metà bassa. Segui prima i trentadue bit scritti da MOV EAX, −1, poi l’azzeramento della metà superiore; nell’ultimo quadro confronta la scrittura corretta in RAX.",
    "conclusione": "Dopo MOV EAX, −1 leggi metà alta 00000000 e metà bassa FFFFFFFF; dopo MOV RAX, −1 entrambe devono essere FFFFFFFF. Il controllo del ramo valido completa la verifica: la riparazione deve cambiare la sentinella lasciando corretti indirizzo fisico e registri di ingresso.",
    "procedura": [
      "Premi «Carica l’esempio guidato» e verifica esercizio 20, «La larghezza della sentinella», traccia 1.",
      "Leggi il ramo di errore fornito e individua MOV EAX, −1. Prevedi le due metà da 32 bit di RAX.",
      "Avanza nei quadri e verifica metà alta zero e metà bassa 0xFFFFFFFF.",
      "Apri la prova completa e sostituisci il ramo con MOV RAX, −1. Esegui il collaudo su ramo valido e invalido, verificando anche la conservazione di RDI e RSI."
    ],
    "risultato": "Il difetto produce 0x00000000FFFFFFFF. La riparazione MOV RAX, −1 restituisce 0xFFFFFFFFFFFFFFFF sul ramo invalido.",
    "ragionamento": "−1 su 32 bit contiene trentadue uno. La scrittura in EAX colloca quei bit nella metà inferiore e azzera la superiore; usare RAX scrive invece la rappresentazione a 64 bit richiesta dal contratto."
  },
  "6.4.1": {
    "scopo": "La stessa pagina virtuale può avere destinazioni diverse in due processi. Seguirai tre richieste per verificare come la TLB distingua gli spazi e come una capacità ridotta possa costringere a rileggere le tabelle.",
    "teoria": [
      "Un processo è un programma in esecuzione che dispone di un proprio spazio di indirizzi, suddiviso in gruppi di 4096 byte chiamati pagine. Per raggiungere un byte, il processore deve individuare il frame, un gruppo della stessa grandezza nella memoria fisica che ospita quella pagina. L’unità di gestione della memoria, o MMU, conserva alcune corrispondenze recenti in una piccola cache chiamata TLB, translation lookaside buffer. Questa cache conserva traduzioni, cioè associazioni fra pagine e frame, e permette di evitare la lettura della tabella a ogni richiesta.",
      "Ogni voce della TLB identifica sia lo spazio, tramite il codice ASID, address space identifier, sia il numero di pagina virtuale, VPN. La doppia indicazione serve perché la pagina 3 dello spazio A corrisponde qui al frame 7, mentre quella di B corrisponde al frame 12. Il numero del frame fisico si abbrevia PFN. L’offset è la distanza del byte dall’inizio della pagina: moltiplicando il PFN per 4096 e aggiungendo l’offset 15 si ottiene il PA, indirizzo fisico. Le destinazioni sono 28687 e 49167, scritte in base sedici come 0x700F e 0xC00F.",
      "Una corrispondenza trovata è un hit; quando manca, si verifica un miss e occorre consultare la tabella. Nella sequenza A, A, B la seconda lettura di A riusa la voce appena inserita, producendo un solo hit. La TLB ordina le voci dal meno recentemente usato, LRU, al più recente, MRU. Con un solo posto e la sequenza A, B, A, ogni cambio di spazio sostituisce la voce precedente, così anche il ritorno di A richiede una nuova ricerca."
    ],
    "introduzione": [
      "Conservare una traduzione recente permette di evitare una nuova ricerca nelle tabelle delle pagine. Studierai questa funzione della TLB, la piccola memoria che associa pagine virtuali a frame fisici. Ogni chiave comprende anche l’identificatore dello spazio del processo, ASID, perché la stessa pagina numerata 3 può avere destinazioni diverse per A e B; la capacità determina quali traduzioni restano disponibili.",
      "Avvia «Riutilizzare la traduzione di A» con «Carica questo caso» e segui le tre richieste mediante «Passo successivo», confrontando la coppia spazio/pagina con le voci residenti. Ripeti «Alternare gli spazi in una sola voce». Le due e tre consultazioni delle tabelle si spiegano rispettivamente con il riuso del secondo A e con le sostituzioni imposte dall’unico posto disponibile nella TLB."
    ],
    "lettura": "A sinistra compare la coppia richiesta, come A / VPN 3. Le file centrale superiore e inferiore mostrano il contenuto della TLB prima e dopo la ricerca; LRU → MRU significa dal meno al più recentemente usato. A destra leggi il PA prodotto, mentre il contatore registra le consultazioni delle tabelle.",
    "conclusione": "Nella sequenza A, A, B con due voci, prevedi due consultazioni delle tabelle: il secondo A usa la traduzione ancora presente. Con un posto e A, B, A ne servono tre. Per spiegare ciascun hit confronta la coppia completa ASID/VPN con la voce residente, poiché la VPN 3 compare in entrambi gli spazi.",
    "controlli": {
      "seq": "Ordine dei tre processi che richiedono la pagina 3. A e B mantengono tabelle diverse; ripetere una lettera significa effettuare una nuova lettura nello stesso spazio.",
      "cap": "Numero di traduzioni conservabili nella TLB. Se manca una voce libera, viene sostituita la traduzione usata meno di recente."
    },
    "esperienze": [
      {
        "titolo": "Riutilizzare la traduzione di A",
        "parametri": {
          "seq": "AAB",
          "cap": 2
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Contesti delle tre letture = A, A, B; Voci della TLB = 2.",
          "In «Lettura 1 · spazio A» annota il miss e la nuova voce A / 3.",
          "Avanza a «Lettura 2 · spazio A» e verifica l’hit: il contatore delle consultazioni resta a uno.",
          "In «Lettura 3 · spazio B» confronta la nuova chiave B / 3 e il nuovo PA con quelli di A."
        ],
        "risultato": "La sequenza A, A, B produce miss, hit, miss e due consultazioni delle tabelle.",
        "ragionamento": "La seconda lettura usa la stessa coppia spazio/pagina ancora residente. B richiede una chiave diversa e una traduzione al frame 12: il PA finale è 12 × 4096 + 15 = 0xC00F.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Consultazioni delle tabelle",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "PA",
            "valore": "0xC00F"
          }
        ]
      },
      {
        "titolo": "Alternare gli spazi in una sola voce",
        "parametri": {
          "seq": "ABA",
          "cap": 1
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Contesti delle tre letture = A, B, A; Voci della TLB = 1.",
          "In «Lettura 1 · spazio A» osserva l’inserimento di A / 3 nell’unico posto.",
          "In «Lettura 2 · spazio B» verifica che B / 3 sostituisca A / 3, pur riguardando la stessa VPN.",
          "In «Lettura 3 · spazio A» cerca nuovamente A / 3 e conta la terza consultazione."
        ],
        "risultato": "A, B, A con una sola voce produce tre miss e tre consultazioni; il PA finale è 0x700F.",
        "ragionamento": "Ogni cambio di spazio richiede una coppia diversa. Poiché la capacità è uno, B ha espulso la traduzione di A; il ritorno di A deve rileggerla e ricompone 7 × 4096 + 15.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Consultazioni delle tabelle",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "PA",
            "valore": "0x700F"
          }
        ]
      }
    ]
  },
  "6.4.2": {
    "scopo": "Un processo può utilizzare poche regioni entro uno spazio virtuale molto ampio. Calcolerai quanto spazio occupano una tabella lineare completa e una struttura a due livelli che alloca soltanto le figlie necessarie.",
    "teoria": [
      "Per sapere dove si trova un byte di un programma, il processore consulta una tabella che associa ogni pagina virtuale a un frame della memoria fisica. Pagine e frame sono gruppi di byte della stessa grandezza; la posizione interna del byte si conserva nel passaggio. Una tabella lineare riserva una voce per ciascuna pagina virtuale, comprese quelle inutilizzate. Tale spazio può essere ingente quando il programma usa soltanto alcune regioni di un insieme di indirizzi molto vasto.",
      "Un bit può assumere due valori, zero e uno: n bit distinguono perciò 2ⁿ combinazioni. Con un indirizzo virtuale, VA, di 32 bit si possono numerare 2³² byte. Una pagina da 4 KiB, con 1 KiB uguale a 1024 byte, contiene 4096 = 2¹² byte: dodici bit ne identificano la posizione interna, chiamata offset. I venti bit rimanenti formano il numero di pagina virtuale, VPN, e distinguono 2²⁰ = 1 048 576 pagine. La tabella lineare riserva otto byte per ciascuna, per un totale di 8 388 608 byte.",
      "Nell’organizzazione iniziale a due livelli, i venti bit della VPN sono divisi in due campi da dieci. Il primo sceglie una delle 1024 regioni nella tabella radice e il secondo una delle 1024 voci nella tabella figlia. La radice comprende tutte le regioni; una figlia viene allocata, cioè riceve spazio in memoria, soltanto quando la regione contiene pagine mappate, associate a una destinazione. Due regioni richiedono quindi (1024 + 2 × 1024) × 8 = 24 576 byte. Ogni regione aggiuntiva costa una figlia intera da 8192 byte. Il conto considera le sole voci, escludendo lo spazio eventualmente aggiunto per far iniziare le tabelle agli indirizzi di allineamento richiesti.",
      "Quando cambi la larghezza del VA o la dimensione della pagina, il simulatore ridivide i bit della VPN fra i due livelli. La figlia riceve metà dei bit arrotondata verso il basso; alla radice restano gli altri. Con VA di 31 bit e offset di 12, la VPN ha 19 bit: 10 scelgono una delle 1024 voci della radice e 9 una delle 512 voci di ciascuna figlia. Con due regioni occupate, il totale è (1024 + 2 × 512) × 8 = 16 384 byte. Questa ripartizione è la scelta del modello a due livelli usato qui."
    ],
    "introduzione": [
      "Una tabella lineare occupa spazio per tutte le pagine virtuali possibili, anche quando il programma usa poche regioni. Calcolerai il vantaggio di una struttura a due livelli, nella quale una radice completa conduce soltanto alle tabelle figlie necessarie. Il numero di bit assegnati agli indici determina la quantità di voci, mentre la loro dimensione trasforma quel conteggio in byte occupati.",
      "Carica «Due sole regioni utilizzate» con «Carica questo caso» e avanza dal conteggio delle pagine al confronto delle tabelle. Con indirizzi di 32 bit e pagine da 4 KiB, verifica la radice e le figlie da 1024 voci ciascuna. Ripeti con otto regioni: i 49 152 byte aggiunti corrispondono a sei figlie, mentre gli 8 388 608 byte della tabella lineare restano invariati."
    ],
    "lettura": "La fascia superiore separa i bit che scelgono la pagina da quelli dell’offset. La barra della tabella lineare conta una voce per ogni pagina possibile. Il disegno inferiore mostra una radice e una scatola F per ciascuna figlia allocata; il totale include sempre la radice completa.",
    "conclusione": "Con la geometria iniziale, passando da due a otto regioni occupate aggiungi sei figlie da 8192 byte: il totale deve crescere da 24 576 a 73 728 byte, mentre la tabella lineare resta di 8 388 608 byte. Questo confronto misura lo spazio delle voci; strutture amministrative e arrotondamenti di allineamento restano fuori dal conto.",
    "controlli": {
      "bits": "Larghezza dell’indirizzo virtuale, in bit. Con b bit lo spazio può numerare 2^b byte, anche quando il programma ne utilizza pochi. Se i bit della VPN sono dispari, la radice ne riceve uno in più della figlia.",
      "off": "Dimensione di ogni pagina: 4 KiB richiedono 12 bit di offset, 16 KiB ne richiedono 14. I bit rimanenti selezionano la pagina.",
      "used": "Numero di regioni che contengono almeno una pagina mappata. Ciascuna regione richiede una tabella figlia completa, oltre alla radice condivisa."
    },
    "esperienze": [
      {
        "titolo": "Due sole regioni utilizzate",
        "parametri": {
          "bits": 32,
          "off": "12",
          "used": 2
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Bit dell’indirizzo virtuale = 32; Dimensione della pagina = 4 KiB; Regioni con pagine mappate = 2.",
          "In «Conteggio delle pagine» sottrai 12 bit di offset da 32 e verifica 20 bit VPN.",
          "In «Tabella lineare» moltiplica 1 048 576 voci per otto byte.",
          "In «Due livelli» conta una radice da 1024 voci e due figlie della stessa dimensione; confronta i byte complessivi."
        ],
        "risultato": "La tabella lineare occupa 8 388 608 byte; i due livelli con due figlie occupano 24 576 byte.",
        "ragionamento": "Il numero di pagine è 2²⁰ = 1 048 576. La struttura gerarchica usa (1024 + 2 × 1024) voci da otto byte, cioè 24 576 byte; il risparmio deriva dalle figlie delle regioni inutilizzate che restano assenti.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Figlie allocate",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "Byte complessivi",
            "valore": "24576"
          }
        ]
      },
      {
        "titolo": "Popolare otto regioni",
        "parametri": {
          "bits": 32,
          "off": "12",
          "used": 8
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Bit dell’indirizzo virtuale = 32; Dimensione della pagina = 4 KiB; Regioni con pagine mappate = 8.",
          "In «Conteggio delle pagine» e «Tabella lineare» verifica che larghezza e numero totale delle pagine siano rimasti identici.",
          "In «Due livelli» conta otto figlie oltre alla radice.",
          "Calcola la crescita dovuta alle sei figlie aggiuntive e confronta il totale con quello del primo caso."
        ],
        "risultato": "La tabella lineare resta a 8 388 608 byte; la struttura gerarchica sale a 73 728 byte.",
        "ragionamento": "Ogni figlia richiede 1024 × 8 = 8192 byte. Sei nuove regioni aggiungono 6 × 8192 = 49 152 byte ai 24 576 iniziali, per un totale di 73 728 byte.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Figlie allocate",
            "valore": "8"
          },
          {
            "passo": 2,
            "campo": "Byte complessivi",
            "valore": "73728"
          }
        ]
      }
    ]
  },
  "6.4.3": {
    "scopo": "Per tradurre un indirizzo a due livelli occorre distinguere il luogo in cui si legge una voce dal valore ricavato. Seguirai entrambi i caricamenti e confronterai una foglia presente con una assente.",
    "teoria": [
      "L’indirizzo virtuale, VA, è il numero con cui il programma indica un byte. Per ricavare il corrispondente indirizzo fisico, PA, il processore può leggere due voci successive. Una voce di tabella si chiama PTE, page table entry. La PTE della radice fornisce la base di una tabella figlia; l’ultima voce del percorso, detta foglia, contiene presenza e numero del frame fisico, PFN. Il frame è il gruppo di 4096 byte che ospita la pagina nella memoria fisica.",
      "L’unità di gestione della memoria, MMU, separa i 32 bit del VA in tre campi: dieci per la radice L1, dieci per la figlia L2 e dodici per la posizione interna, detta offset. Ogni bit è una cifra binaria; i numeri preceduti da 0x sono invece scritti in base sedici. Nel caso 0xC0504D i tre campi valgono 3, 5 e 77. La ricomposizione 3 × 2²² + 5 × 4096 + 77 restituisce il VA, perché il primo campo lascia 22 bit alla sua destra e il secondo ne lascia 12. Poiché ogni voce occupa otto byte, l’indice 3 sceglie la voce a 0x100000 + 3 × 8 = 0x100018.",
      "La lettura della prima voce restituisce nel modello 0x306000, che diventa la base della figlia. Il secondo indice porta quindi a 0x306000 + 5 × 8 = 0x306028. Qui si legge la PTE 27, codificata come 2 × 13 + 1: il bit basso uno segnala presenza e i bit rimanenti indicano PFN 13. L’offset 77 conserva la posizione del byte nel gruppo, perciò PA = 13 × 4096 + 77 = 0xD04D.",
      "Se la foglia è assente, i due indirizzi delle voci restano gli stessi e cambia il contenuto dell’ultima lettura. Il campo Present vale zero e la MMU interrompe la ricerca con un’eccezione, prima di accedere al byte. Questa struttura didattica usa un solo bit di presenza e separa esplicitamente indirizzi delle voci, contenuti letti e indirizzo del dato."
    ],
    "introduzione": [
      "Una traduzione a due livelli procede attraverso letture dipendenti: il contenuto della prima voce fornisce la base dalla quale cercare la seconda. Seguirai questo percorso distinguendo indirizzi delle voci e valori letti. La voce finale, detta foglia, contiene presenza e numero del frame fisico; soltanto una foglia presente permette di combinare il frame con l’offset, la posizione interna del byte.",
      "Con «Carica questo caso» avvia «Completare i due caricamenti» e usa «Passo successivo» per annotare separatamente 0x100018 → 0x306000 e 0x306028 → 27. Confronta poi «Fermarsi alla foglia assente», mantenendo indici 3 e 5 e offset 77. Gli indirizzi delle letture restano uguali, mentre il contenuto finale cambia: la presenza della foglia decide fra il risultato 0xD04D e l’arresto della traduzione."
    ],
    "lettura": "I tre riquadri superiori contengono indice L1, indice L2 e offset. Le frecce portano prima dalla radice alla base della figlia, poi alla voce foglia e infine al PA. Le diciture sotto il disegno mostrano gli indirizzi delle voci lette: hanno un ruolo diverso dal numero di frame contenuto nella foglia.",
    "conclusione": "Segui la dipendenza fra le letture: 0x100018 contiene la base 0x306000, dalla quale l’indice 5 porta a 0x306028. La voce 27 lì letta fornisce il frame 13 e, con offset 77, il PA 0xD04D. Se la foglia è assente, i due indirizzi di tabella restano calcolabili e l’accesso al byte si arresta.",
    "controlli": {
      "i": "Indice della voce nella radice L1, compreso fra 0 e 1023. Sposta l’indirizzo della prima lettura di otto byte per ogni unità.",
      "j": "Indice nella tabella figlia L2, compreso fra 0 e 1023. La scala di otto byte si applica alla base ricavata dalla prima lettura.",
      "d": "Posizione del byte nella pagina di 4096 byte. Questi 12 bit restano uguali nel passaggio dall’indirizzo virtuale al fisico.",
      "pres": "Presenza della foglia. Se è assente, il modello produce un’eccezione e lascia vuoti PFN e PA."
    },
    "esperienze": [
      {
        "titolo": "Completare i due caricamenti",
        "parametri": {
          "i": 3,
          "j": 5,
          "d": 77,
          "pres": "1"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Indice nella radice = 3; Indice nella figlia = 5; Offset = 77; Stato della foglia = Presente.",
          "In «Scomposizione» annota i campi 3, 5 e 77.",
          "In «Lettura della radice» leggi la voce a 0x100018 e conserva il valore 0x306000 come base L2; in «Lettura della foglia» verifica l’accesso a 0x306028.",
          "In «Esito» decodifica 27 e ricomponi il PA, tenendo distinto il valore letto dall’indirizzo a cui è stato letto."
        ],
        "risultato": "La foglia 27 contiene PFN 13 e presenza 1; il PA finale è 0xD04D.",
        "ragionamento": "La prima voce è a 0x100000 + 8 × 3. La seconda è a 0x306000 + 8 × 5 e restituisce 27; togliendo il bit basso si ottiene 13, quindi 13 × 4096 + 77 = 53325 = 0xD04D.",
        "attesi": [
          {
            "passo": 3,
            "campo": "PFN",
            "valore": "13"
          },
          {
            "passo": 3,
            "campo": "PA",
            "valore": "0xD04D"
          }
        ]
      },
      {
        "titolo": "Fermarsi alla foglia assente",
        "parametri": {
          "i": 3,
          "j": 5,
          "d": 77,
          "pres": "0"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Indice nella radice = 3; Indice nella figlia = 5; Offset = 77; Stato della foglia = Assente.",
          "Segui «Scomposizione» e «Lettura della radice»: gli indici e la base L2 sono uguali al primo caso.",
          "In «Lettura della foglia» osserva la PTE pari a zero e Present = 0 nello stesso indirizzo 0x306028.",
          "Avanza a «Esito» e verifica l’arresto, con PFN e PA indicati mediante un trattino."
        ],
        "risultato": "La foglia assente provoca il fault; la traduzione termina senza PFN utilizzabile e senza PA.",
        "ragionamento": "Gli indirizzi dei due accessi dipendono dagli indici e dalle basi, rimasti invariati. È il contenuto della foglia a impedire il completamento: il bit Present vale zero e la MMU interrompe il cammino.",
        "attesi": [
          {
            "passo": 3,
            "campo": "PFN",
            "valore": "—"
          },
          {
            "passo": 3,
            "campo": "PA",
            "valore": "—"
          }
        ]
      }
    ]
  },
  "6.4.4": {
    "scopo": "Un miss della TLB aggiunge letture delle tabelle prima della lettura del dato. Calcolerai il costo dei due percorsi e il loro peso medio, confrontando tabelle di due e quattro livelli.",
    "teoria": [
      "Anche quando il byte è già nella memoria principale, il processore deve conoscerne l’indirizzo fisico. Gli indirizzi del programma sono raggruppati in pagine, ospitate in gruppi della stessa grandezza nella memoria fisica, detti frame. La TLB, translation lookaside buffer, è la piccola memoria che conserva alcune associazioni fra pagine e frame. Trovare la traduzione è un hit e permette di passare alla lettura del dato. Se la traduzione manca nella TLB, si ha un miss e occorre cercarla nella tabella delle pagine.",
      "Qui le letture si susseguono una alla volta. Consultare la TLB costa un nanosecondo, cioè un miliardesimo di secondo; leggere la memoria principale ne costa cinquanta. Su un hit il costo è quindi 1 + 50. Su un miss in una tabella a due livelli, la prima lettura di memoria trova la tabella successiva e la seconda fornisce il frame. Soltanto con la terza lettura si preleva il dato. Il totale sale a 151 nanosecondi.",
      "Se novanta richieste su cento trovano la traduzione, soltanto dieci percorrono la tabella. I cento nanosecondi aggiuntivi di ciascuna delle dieci ricerche incidono per dieci nanosecondi sulla media, che arriva a 61. Ogni livello ulteriore allunga il percorso dei soli miss. Il contatore delle letture aiuta a stabilire su quale frazione delle richieste distribuire questo costo.",
      "Tutte le pagine della simulazione sono residenti, già presenti in memoria fisica. Un miss della TLB richiede quindi la ricerca della traduzione; un page fault indicherebbe invece un’eccezione nella traduzione, per esempio dovuta a una pagina assente. La penalità per recuperare una pagina dal disco è esclusa, così il conteggio isola le letture delle tabelle e del dato."
    ],
    "introduzione": [
      "Per valutare il costo della traduzione occorre contare anche la lettura del dato dopo le tabelle. Confronterai il percorso di hit, che trova la corrispondenza nella TLB, con quello di miss, che attraversa tutti i livelli. Poiché il modello considera pagine residenti e letture seriali, ogni livello aggiunge una lettura di memoria soltanto alle richieste che mancano nella TLB.",
      "Carica «Due livelli e novanta hit» mediante «Carica questo caso» e segui «Passo successivo», verificando 51 ns per un hit e 151 ns per un miss. Confronta poi quattro livelli mantenendo novanta hit su cento. La media cresce da 61 a 71 ns: le due letture aggiuntive costano 100 ns per miss, distribuiti soltanto sul dieci per cento delle richieste."
    ],
    "lettura": "Ogni casella L rappresenta una lettura di voce da 50 ns; la casella dato è una lettura ulteriore. La TLB compare una sola volta in ciascun percorso e costa 1 ns. Il riepilogo finale pesa il percorso breve con il numero di hit e quello lungo con i miss.",
    "conclusione": "Per verificare la media, usa 51 ns + frazione di miss × numero di livelli × 50 ns. Con il 90% di hit e due livelli devi ottenere 61 ns; con quattro livelli, 71 ns. L’aumento riguarda il 10% delle richieste che percorre le tabelle, nell’ipotesi di letture seriali e pagine residenti.",
    "controlli": {
      "levels": "Numero di voci lette lungo un cammino completo in tabella. Sul miss si aggiunge anche una lettura del dato.",
      "hits": "Numero di richieste su cento che trovano la traduzione nella TLB. Le altre cento meno questo valore percorrono tutti i livelli."
    },
    "esperienze": [
      {
        "titolo": "Due livelli e novanta hit",
        "parametri": {
          "levels": 2,
          "hits": 90
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Livelli della tabella = 2; Hit per cento richieste = 90.",
          "In «Percorso di hit» conta una consultazione TLB e una lettura RAM, per 51 ns.",
          "In «Percorso di miss» conta due letture delle voci e una del dato, per 151 ns.",
          "In «Media ponderata» assegna il percorso breve a 90 richieste e il lungo a 10; verifica 61 ns."
        ],
        "risultato": "Il miss costa 151 ns e la media su cento richieste è 61 ns.",
        "ragionamento": "Novanta hit costano 90 × 51 ns e dieci miss costano 10 × 151 ns. Il totale è 6100 ns, che diviso per cento dà 61 ns; rispetto agli hit, i miss aggiungono due letture RAM ciascuno.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Miss",
            "valore": "10"
          },
          {
            "passo": 2,
            "campo": "Tempo medio",
            "valore": "61 ns"
          }
        ]
      },
      {
        "titolo": "Quattro livelli alla stessa frequenza",
        "parametri": {
          "levels": 4,
          "hits": 90
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Livelli della tabella = 4; Hit per cento richieste = 90.",
          "In «Percorso di hit» verifica che il costo sia ancora 51 ns.",
          "In «Percorso di miss» conta quattro voci e il dato: cinque letture RAM più la TLB.",
          "In «Media ponderata» confronta i 71 ns ottenuti con i 61 ns del primo caso."
        ],
        "risultato": "Il miss sale a 251 ns e la media a 71 ns.",
        "ragionamento": "Ogni miss aggiunge due letture RAM rispetto al primo caso, ossia 100 ns. Poiché i miss sono dieci su cento, il supplemento medio è 10 ns; gli hit conservano il percorso da 51 ns.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Miss",
            "valore": "10"
          },
          {
            "passo": 2,
            "campo": "Tempo medio",
            "valore": "71 ns"
          }
        ]
      }
    ]
  },
  "6.4.5": {
    "scopo": "Per leggere una tabella gerarchica bisogna estrarre correttamente i campi dell’indirizzo. Scomporrai un VA con ripartizione 8/12/12, verificando il risultato mediante la ricomposizione.",
    "teoria": [
      "In una tabella di traduzione a due livelli, cercare una pagina significa prima scegliere una tabella più piccola e poi scegliere una riga al suo interno. Una pagina è un gruppo di byte consecutivi nello spazio virtuale del programma. L’indirizzo virtuale è scritto con cifre binarie, i bit, che valgono zero oppure uno; suddividendole in campi si ottengono i due indici e la posizione del byte nella pagina.",
      "La prima tabella, detta radice, serve a trovare l’indirizzo iniziale della tabella figlia. La seconda consente di trovare il frame fisico, il gruppo di byte che ospita la pagina in memoria. L’ultimo campo, chiamato offset, rappresenta la distanza del byte dall’inizio della pagina e viene conservato nella traduzione.",
      "Nel VA 0x67DEF123, indirizzo virtuale a 32 bit, il prefisso 0x indica la base sedici: dopo 9 le cifre A, B, C, D, E e F valgono da dieci a quindici. Ogni cifra esadecimale occupa quattro bit, perché quattro bit distinguono 2⁴ = 16 valori. La ripartizione 8/12/12 separa quindi 67, DEF e 123. I valori decimali sono 6 × 16 + 7 = 103, 13 × 16² + 14 × 16 + 15 = 3567 e 1 × 16² + 2 × 16 + 3 = 291. Per ricomporre il VA si moltiplica il primo indice per 2²⁴, il secondo per 2¹² e si aggiunge l’offset: i pesi derivano dai bit che ciascun campo lascia alla propria destra."
    ],
    "introduzione": [
      "Estrarre gli indici di una tabella gerarchica richiede di rispettare la ripartizione dei bit dell’indirizzo. Ti eserciterai a separare indice della radice, indice della figlia e offset, cioè posizione del byte nella pagina, verificandoli poi mediante ricomposizione. Poiché ogni cifra esadecimale rappresenta quattro bit, la geometria 8/12/12 permette di riconoscere direttamente tre gruppi di cifre nella parola iniziale.",
      "Premi «Carica l’esempio guidato» per l’esercizio 3, traccia 1, e separa 0x67DEF123 nei gruppi 67, DEF e 123. Inserisci l’indice superiore previsto e premi «Registra la previsione», poi avanza nella ricostruzione. Confronta i valori decimali 103, 3567 e 291 con i gruppi iniziali; moltiplicare ciascun indice per il peso dei bit alla sua destra deve restituire esattamente l’indirizzo di partenza."
    ],
    "lettura": "I riquadri dividono la parola dall’alto verso il basso in indice superiore, indice inferiore e offset. Ogni cifra esadecimale rappresenta quattro bit, quindi i confini cadono dopo due, altre tre e ultime tre cifre.",
    "conclusione": "Ricostruisci l’indirizzo con 103 × 2²⁴ + 3567 × 2¹² + 291 e confrontalo con 0x67DEF123. La divisione per i pesi dei campi deve restituire gli stessi indici e lo stesso resto. Cambiare ripartizione cambia gli indici ricavati, anche quando l’indirizzo iniziale rimane identico.",
    "procedura": [
      "Premi «Carica l’esempio guidato» e verifica esercizio 3, «Separare gli indici per due geometrie», traccia 1.",
      "Per 0x67DEF123 separa i gruppi 67, DEF e 123, rispettando gli 8, 12 e 12 bit.",
      "Prevedi l’indice superiore e registra il tentativo. Segui la conversione dei tre gruppi in decimale.",
      "Nella prova completa inserisci 103, 3567 e 291; controlla la ricomposizione prima di concludere."
    ],
    "risultato": "I campi sono indice superiore 103, indice inferiore 3567 e offset 291.",
    "ragionamento": "0x67 = 6 × 16 + 7 = 103; 0xDEF = 13 × 256 + 14 × 16 + 15 = 3567; 0x123 = 291. Ricomponendo (103 × 4096 + 3567) × 4096 + 291 si ritrova il VA originale."
  },
  "6.4.6": {
    "scopo": "Nel cammino a due livelli la prima lettura fornisce la base della seconda. Ricostruirai gli indirizzi dei due load e il PA, distinguendo i valori letti dalle loro posizioni in memoria.",
    "teoria": [
      "Un indirizzo virtuale, VA, può richiedere due letture di tabella prima di produrre l’indirizzo fisico, PA. La tabella iniziale, detta radice, fornisce la base della tabella figlia. L’ultima voce, detta foglia, fornisce il numero del frame fisico, PFN, insieme alla validità. Un frame è il gruppo di 4096 byte che ospita una pagina virtuale. Ogni lettura ha un indirizzo, il luogo della voce, e un contenuto, l’informazione ricavata.",
      "Nel frammento assembly x86-64, che esprime il programma mediante istruzioni del processore, i registri sono piccole memorie interne. RDI contiene il VA 0xC0504D e RSI la base della radice 0x100000; il prefisso 0x indica la base sedici. La ripartizione 10/10/12 produce indici 3 e 5 e offset 77, posizione del byte nella pagina. La prima lettura, o load, va a 0x100000 + 8 × 3 e restituisce 0x300000, conservato in RDX come base della figlia. Moltiplicare l’indice per otto lo converte in byte, poiché ogni voce occupa otto byte.",
      "La seconda lettura usa la base appena caricata: 0x300000 + 8 × 5 = 0x300028. La foglia valida 27 = 2 × 13 + 1 fornisce il frame 13 dopo uno shift a destra di un bit, che divide per due scartando il bit basso di validità. Lo shift a sinistra di dodici bit moltiplica poi per 4096 e lascia a zero le dodici posizioni dell’offset. OR accende un bit quando è acceso in almeno uno dei due operandi: unendo la base 0xD000 all’offset 77, pari a 0x4D, produce 0xD04D in RAX, registro del risultato. Usare per la seconda lettura l’indirizzo della prima voce confonderebbe il luogo dell’indicazione con la base indicata."
    ],
    "introduzione": [
      "La ricostruzione di un percorso a due livelli ti farà seguire il dato che diventa l’indirizzo iniziale della lettura successiva. Nel listato assembly, i registri sono piccole memorie del processore: RSI conserva la base della radice e RDX riceve quella della figlia. Tenere distinti indirizzo letto e contenuto ottenuto consente di spiegare come la foglia conduca infine al byte fisico.",
      "Ripristina l’esercizio 4, traccia 1, con «Carica l’esempio guidato» e avanza con «Passo successivo». Confronta il primo caricamento, 0x100018 → 0x300000, con il secondo, 0x300028 → 27: la nuova base proviene dal primo valore letto. Decodifica poi 27 come frame 13 valido e verifica 0xD04D aggiungendo l’offset 77. Ogni freccia chiarisce quale informazione rende possibile il passaggio seguente."
    ],
    "lettura": "Nel listato segui RSI come base della radice, RDX come base caricata della figlia e RAX come voce foglia e poi PA. I quadri intermedi riportano separatamente indirizzi delle voci e loro contenuti.",
    "conclusione": "Per i due load scrivi separatamente indirizzo letto e valore ottenuto: 0x100018 → 0x300000, poi 0x300028 → 27. Il primo risultato diventa una base; il secondo codifica il frame 13. Soltanto alla fine il frame si combina con l’offset e restituisce 0xD04D, cioè 53325.",
    "procedura": [
      "Premi «Carica l’esempio guidato» e verifica esercizio 4, «Seguire i due caricamenti in assembly», traccia 1.",
      "Dal VA 0xC0504D ricava i campi 3, 5 e 77 della ripartizione 10/10/12.",
      "Avanza al primo load e calcola 0x100000 + 8 × 3; conserva il valore letto 0x300000 come nuova base.",
      "Segui il secondo load a 0x300000 + 8 × 5, decodifica la foglia 27 e verifica RAX finale con l’offset 77."
    ],
    "risultato": "Gli indirizzi delle voci sono 1048600 e 3145768; il PA in RAX è 53325, ossia 0xD04D.",
    "ragionamento": "La prima voce si legge a 0x100018 e restituisce 0x300000. La seconda è a 0x300028 e restituisce 27 = 2 × 13 + 1. Il frame 13 produce base 13 × 4096; aggiungendo 77 si ottiene 53325."
  },
  "6.5.1": {
    "scopo": "Due nomi possono raggiungere un unico file. Scriverai attraverso uno dei due e seguirai la rimozione di quel nome, osservando se cambiano il contenuto e l’accessibilità dall’altro.",
    "teoria": [
      "Un file contiene una successione di byte, ciascuno formato da otto cifre binarie. Quando lo si apre scrivendone il nome, il sistema cerca quel nome in una directory, una raccolta di voci che associano ciascun nome a un oggetto. Qui l’oggetto è identificato dal numero di inode. L’inode è la struttura che descrive il file e indica i blocchi del dispositivo nei quali si trovano i byte; queste informazioni descrittive sono chiamate metadati.",
      "Una directory può contenere due nomi che rimandano allo stesso inode. Si parla in questo caso di collegamenti fisici, o hard link. Nella figura, «appunti» e «copia» rinviano entrambi all’inode 42. La creazione del secondo nome aggiunge una via per raggiungere gli stessi dati, perciò lo spazio occupato dal contenuto rimane quello del file originario.",
      "Se attraverso «appunti» si scrive 90 al posto del primo byte, una lettura attraverso «copia» restituisce anch’essa 90, perché il blocco raggiunto è lo stesso. L’operazione unlink cancella dalla directory il nome indicato: rimosso «appunti», il contatore dei collegamenti scende da due a uno e «copia» permette ancora di leggere il byte appena scritto. Scegliendo copia come nome di scrittura e rimozione si ottiene il caso simmetrico, nel quale sopravvive appunti."
    ],
    "introduzione": [
      "Un nome di file costituisce una via per raggiungere un oggetto, mentre l’identità e i dati dell’oggetto possono restare condivisi fra più nomi. Seguirai due collegamenti fisici, o hard link, diretti allo stesso inode, la struttura che descrive il file. Il confronto mostrerà perché scrivere attraverso un nome cambia il contenuto letto dall’altro e perché rimuovere un nome lascia utilizzabile quello superstite.",
      "Carica «Scrivere e rimuovere appunti» con «Carica questo caso», poi usa «Passo successivo» per seguire il primo byte da 65 a 90 e il contatore dei collegamenti da due a uno. Confronta il caso in cui si scrive e si rimuove copia. Cambia il nome residuo, mentre inode 42 e byte letto restano uguali: entrambe le voci di directory raggiungevano lo stesso contenuto."
    ],
    "lettura": "Le due voci di directory convergono sullo stesso inode 42, che conduce a un solo primo byte. Dopo la rimozione una voce viene barrata, mentre il collegamento superstite resta visibile. Il contatore Link misura i nomi rimasti, distinto dal valore del dato.",
    "conclusione": "Dopo la scrittura di 90, verifica che il secondo nome legga anch’esso 90: entrambi conducono all’inode 42 e agli stessi blocchi. Dopo unlink il contatore scende da due a uno e il nome rimasto continua a leggere quel valore. La creazione del secondo nome ha aggiunto un collegamento al contenuto esistente.",
    "controlli": {
      "name": "Nome attraverso cui il modello scrive e che poi rimuove dalla directory. Entrambe le scelte raggiungono l’inode 42.",
      "value": "Valore del primo byte da scrivere, da 0 a 255. Il dato originario vale 65 e la scrittura si osserva attraverso entrambi i nomi."
    },
    "esperienze": [
      {
        "titolo": "Scrivere e rimuovere appunti",
        "parametri": {
          "name": "appunti",
          "value": 90
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Nome usato per scrivere = appunti; Nuovo primo byte = 90.",
          "In «Creazione del collegamento» verifica che appunti e copia rinviino entrambi all’inode 42 e che il byte iniziale valga 65.",
          "In «Scrittura» osserva 90 sia da appunti sia da copia.",
          "In «Rimozione di appunti» segui il collegamento superstite e annota nome residuo, Link e primo byte."
        ],
        "risultato": "Resta il nome copia, con un link e il primo byte pari a 90.",
        "ragionamento": "La scrittura attraversa appunti e modifica il contenuto dell’inode condiviso. La successiva rimozione elimina una delle due voci di directory, lasciando copia collegata allo stesso byte già aggiornato.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Link",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Primo byte",
            "valore": "90"
          }
        ]
      },
      {
        "titolo": "Scrivere e rimuovere copia",
        "parametri": {
          "name": "copia",
          "value": 90
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Nome usato per scrivere = copia; Nuovo primo byte = 90.",
          "In «Creazione del collegamento» ritrova gli stessi due nomi e lo stesso inode.",
          "In «Scrittura» segui la freccia da copia al byte 90 e controlla la lettura attraverso appunti.",
          "In «Rimozione di copia» confronta il nome residuo con il primo caso e verifica che valore e conteggio siano conservati."
        ],
        "risultato": "Resta il nome appunti, con un link e il primo byte pari a 90.",
        "ragionamento": "Il nome scelto cambia il cammino nella directory, mentre l’inode raggiunto è sempre 42. Entrambi i casi lasciano un collegamento allo stesso contenuto; cambia soltanto il nome sopravvissuto.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Link",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Primo byte",
            "valore": "90"
          }
        ]
      }
    ]
  },
  "6.5.2": {
    "scopo": "Un percorso relativo acquista significato a partire dalla directory corrente. Eseguirai la stessa ricerca in due directory per riconoscere il punto in cui la destinazione cambia.",
    "teoria": [
      "Il nome «testo» può designare due file diversi sullo stesso dispositivo. A stabilire quale dei due si raggiunga è la directory in cui il sistema cerca il nome. Una directory conserva, accanto a ogni nome, un numero di inode che identifica l’oggetto corrispondente. Quando quell’oggetto è a sua volta una directory, la ricerca può proseguire al suo interno.",
      "Un percorso è una sequenza di nomi separati dal segno /. Se comincia con /, la ricerca parte dalla radice, la directory che si trova all’origine dell’albero. Negli altri casi parte dalla directory corrente del processo, cioè del programma in esecuzione. Il componente . indica la posizione raggiunta; il componente .. indica la directory che la contiene, chiamata padre.",
      "Se la directory corrente è /corso, il percorso ./testo conserva dapprima la posizione in /corso e poi raggiunge il file con inode 31. Partendo da /casa, la stessa sequenza conduce all’inode 55. Il percorso assoluto /casa/testo riparte invece sempre dalla radice. Ogni riga dell’esperimento conserva sia la directory interrogata sia l’inode raggiunto, così si può individuare il primo passo in cui le due ricerche divergono."
    ],
    "introduzione": [
      "Il significato di un percorso relativo dipende dalla directory dalla quale comincia la ricerca. Ricostruirai questa dipendenza seguendo un componente alla volta: il punto conserva la posizione corrente e ciascun nome viene cercato nella directory raggiunta. L’inode, numero che identifica l’oggetto, permette di verificare se due ricerche della stessa stringa arrivino davvero allo stesso file.",
      "Avvia «Cercare testo da corso» con «Carica questo caso» e segui il cursore nell’albero mediante «Passo successivo». Conserva il percorso ./testo, cambia «Directory corrente» in /casa e premi «Applica i parametri». Confronta gli inode finali 31 e 55; prova quindi /casa/testo da entrambe le partenze. La barra iniziale sceglie la radice e rende l’esito indipendente dalla directory corrente."
    ],
    "lettura": "L’albero mostra la radice in alto, le directory corso e casa al centro e i file in basso. Ogni nodo riporta nome e inode. Il nodo in ambra è la posizione corrente; le frecce seguono i componenti già consumati e il risultato finale riporta l’inode raggiunto.",
    "conclusione": "Per verificare il risultato di un percorso relativo, annota la directory di partenza e l’oggetto raggiunto dopo ogni componente. ./testo conduce qui a 31 da /corso e a 55 da /casa; /casa/testo conduce a 55 da entrambe. L’eventuale insuccesso va localizzato nella prima directory che manca del nome richiesto.",
    "controlli": {
      "cwd": "Directory da cui parte un percorso relativo. /corso corrisponde all’inode 7 e /casa all’inode 11.",
      "path": "Sequenza di componenti da risolvere. Il punto mantiene la directory, due punti risalgono al genitore e una barra iniziale fa partire dalla radice."
    },
    "esperienze": [
      {
        "titolo": "Cercare testo da corso",
        "parametri": {
          "cwd": "7",
          "path": "./testo"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Directory corrente = /corso; Percorso = ./testo.",
          "In «Punto di partenza» identifica l’inode 7 della directory /corso.",
          "In «Componente .» verifica che il cursore rimanga su 7; poi in «Componente testo» segui la voce verso 31.",
          "In «Risultato» annota l’inode finale e il tipo di oggetto."
        ],
        "risultato": "Il percorso ./testo da /corso raggiunge il file con inode 31.",
        "ragionamento": "Il punto conserva la directory corrente. La successiva ricerca del nome testo avviene quindi in /corso, dove la voce contiene l’inode 31.",
        "attesi": [
          {
            "passo": 3,
            "campo": "Inode finale",
            "valore": "31"
          },
          {
            "passo": 3,
            "campo": "Tipo",
            "valore": "file"
          }
        ]
      },
      {
        "titolo": "Cercare lo stesso nome da casa",
        "parametri": {
          "cwd": "11",
          "path": "./testo"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Directory corrente = /casa; Percorso = ./testo.",
          "In «Punto di partenza» identifica l’inode 11 della directory /casa.",
          "Segui «Componente .» e «Componente testo»: il primo mantiene 11, il secondo seleziona il figlio di casa.",
          "In «Risultato» confronta l’inode 55 con il 31 ottenuto partendo da corso."
        ],
        "risultato": "La stessa sequenza ./testo da /casa raggiunge il file con inode 55.",
        "ragionamento": "La stringa del percorso è rimasta identica e la directory iniziale è cambiata. Il nome testo viene risolto nella directory 11, la cui voce identifica il file 55.",
        "attesi": [
          {
            "passo": 3,
            "campo": "Inode finale",
            "valore": "55"
          },
          {
            "passo": 3,
            "campo": "Tipo",
            "valore": "file"
          }
        ]
      }
    ]
  },
  "6.5.3": {
    "scopo": "Il numero di blocchi necessari a un file cambia quando la lunghezza supera un confine di blocco. Confronterai 4096 e 4097 byte, calcolando la posizione dell’ultimo byte e lo spazio riservato che rimane inutilizzato.",
    "teoria": [
      "Per chi scrive un file, i byte si susseguono dalla posizione zero fino all’ultimo. Il dispositivo, invece, riserva lo spazio per blocchi, che qui contengono 4096 byte ciascuno. Perciò un file lungo esattamente 4096 byte riempie un blocco e ha il suo ultimo byte alla posizione 4095. Aggiungendo un solo byte occorre già un secondo blocco, benché in quel blocco si usi soltanto la prima posizione.",
      "Il quoziente intero fra posizione del byte e grandezza del blocco dà l’indice logico, cioè il posto del blocco nella successione che forma il file. Il resto è la posizione al suo interno, chiamata offset. Gli indici partono da zero, quindi l’indice 1 individua il secondo blocco. Resta da stabilire dove questo si trovi sul dispositivo, poiché blocchi consecutivi del file possono essere collocati in posizioni fisiche distanti.",
      "Con allocazione contigua, se il primo blocco fisico è 7 il secondo è 8. In una catena FAT, file allocation table, la tabella indica per ciascun blocco quale lo segue: la voce del blocco 7 conduce qui a 14. Nell’allocazione indicizzata il numero 14 si legge direttamente nella seconda voce dell’indice. Cambia il cammino seguito per raggiungere il byte, del quale si conservano la posizione logica e l’offset.",
      "Per un file di S byte il numero di blocchi è ceil(S/4096), dove ceil significa arrotondamento all’intero superiore: 4097/4096 è appena maggiore di uno e richiede due blocchi. Lo spazio riservato è allora 2 × 4096 = 8192 byte e la parte inutilizzata vale 8192 − 4097 = 4095 byte. La posizione dell’ultimo byte è S − 1 perché la numerazione comincia da zero."
    ],
    "introduzione": [
      "Quando un file cresce oltre il confine di un blocco, anche un solo byte può richiedere nuovo spazio. Calcolerai blocchi necessari, posizione dell’ultimo byte e capacità inutilizzata, distinguendo il blocco logico nella sequenza del file dal blocco fisico sul dispositivo. Il metodo di allocazione collega queste due numerazioni, mentre il resto della divisione individua l’offset, la posizione interna del byte.",
      "Con «Carica questo caso» confronta «Riempire esattamente un blocco» e «Un byte oltre il primo blocco», avanzando fino alla posizione fisica. Il passaggio da 4096 a 4097 byte sposta l’ultimo byte dall’offset 4095 del primo blocco all’offset zero del secondo. Mantieni poi 4097 byte, scegli «Catena FAT» e premi «Applica i parametri»: il blocco fisico diventa 14, conservando indice logico e offset."
    ],
    "lettura": "Le barre superiori rappresentano blocchi logici da 4096 byte; la parte colorata indica quanto del blocco appartiene al file. L’indicatore sull’ultimo blocco segnala l’offset dell’ultimo byte. I riquadri inferiori mostrano i numeri fisici raggiunti secondo il metodo scelto.",
    "conclusione": "Con 4097 byte l’ultimo byte è alla posizione 4096: indice logico 1 e offset zero. Per prevedere il blocco fisico devi ancora seguire il metodo scelto: ottieni 8 con allocazione contigua e 14 con la catena o l’indice del modello. Confronta questo passaggio con il file da 4096 byte, che occupa un solo blocco interamente.",
    "controlli": {
      "size": "Numero totale di byte del file. La posizione dell’ultimo byte è questo valore meno uno, perché la numerazione comincia da zero.",
      "mode": "Regola con cui i blocchi logici raggiungono quelli fisici: consecutivi, collegati dalla FAT oppure elencati in un indice. Il file e la sua lunghezza restano gli stessi."
    },
    "esperienze": [
      {
        "titolo": "Un byte oltre il primo blocco",
        "parametri": {
          "size": 4097,
          "mode": "cont"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Lunghezza del file (byte) = 4097; Metodo = Contigua.",
          "In «Dimensionamento» verifica che 4097 byte richiedano due blocchi.",
          "In «Posizione logica» considera l’ultimo byte, di posizione 4096: annota indice 1 e offset 0.",
          "In «Posizione fisica» parti dal blocco 7, aggiungi l’indice e misura lo spazio inutilizzato del secondo blocco."
        ],
        "risultato": "Il file usa due blocchi; l’ultimo byte è nel blocco fisico 8 a offset 0 e restano 4095 byte inutilizzati.",
        "ragionamento": "4097 ÷ 4096 richiede un arrotondamento a due blocchi. La posizione 4096 è l’inizio del secondo; nell’allocazione contigua il blocco è 7 + 1 = 8 e la capienza inutilizzata è 8192 − 4097 = 4095 byte.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Blocco fisico",
            "valore": "8"
          },
          {
            "passo": 2,
            "campo": "Byte inutilizzati",
            "valore": "4095"
          }
        ]
      },
      {
        "titolo": "Riempire esattamente un blocco",
        "parametri": {
          "size": 4096,
          "mode": "cont"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Lunghezza del file (byte) = 4096; Metodo = Contigua.",
          "In «Dimensionamento» verifica che 4096 byte stiano in un solo blocco.",
          "In «Posizione logica» sottrai uno alla lunghezza: la posizione 4095 dà indice 0 e offset 4095.",
          "In «Posizione fisica» confronta il blocco raggiunto e lo spazio inutilizzato con il caso da 4097 byte."
        ],
        "risultato": "L’ultimo byte appartiene al blocco fisico 7, offset 4095; i byte inutilizzati sono zero.",
        "ragionamento": "La lunghezza coincide con la capienza del primo blocco. Poiché la numerazione parte da zero, l’ultimo byte rimane alla posizione 4095; passare a 4097 byte oltrepassa proprio questo confine.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Blocco fisico",
            "valore": "7"
          },
          {
            "passo": 2,
            "campo": "Byte inutilizzati",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "6.5.4": {
    "scopo": "La bitmap descrive l’occupazione del volume, mentre la FAT ordina i blocchi di ciascun file. Cercherai il byte 2400 in due file, conservando la stessa posizione logica e seguendo catene fisiche differenti.",
    "teoria": [
      "Per leggere il byte di un file occorre sapere quali blocchi gli appartengano e in quale ordine vadano percorsi. Un volume è l’area del dispositivo organizzata per conservare file; quello rappresentato offre sedici blocchi dati, numerati da 2 a 17. La numerazione è una scelta di questo modello. Una mappa di occupazione, o bitmap, riserva un bit, cifra binaria, a ciascun blocco. Uno indica un blocco assegnato a un file, zero un blocco disponibile per una nuova assegnazione.",
      "Per ricostruire l’ordine dei blocchi di uno specifico file si usa la FAT, file allocation table, una tabella nella quale la voce di ciascun blocco contiene il numero del successivo oppure un segno di fine. La directory, che associa ai nomi le informazioni per ritrovare i file, fornisce il numero iniziale. Seguendo A si incontrano nell’ordine 3, 9, 5 e 11, anche se la bitmap elenca i blocchi secondo la loro posizione sul volume.",
      "Ogni blocco ospita 1024 byte numerati da zero. La posizione 2400 richiede il blocco di indice 2 e l’offset 352, perché 2400 = 2 × 1024 + 352. Partendo dal primo blocco di A occorre seguire due successori: 3 porta a 9 e 9 porta a 5. Per B i due passaggi vanno da 8 a 4 e da 4 a 12. La bitmap del volume rimane la stessa, mentre il contenuto delle catene stabilisce quale blocco raggiungere."
    ],
    "introduzione": [
      "Per trovare un byte servono informazioni diverse da quelle usate per decidere se un blocco sia libero. Studierai la FAT, tabella che indica il successore di ciascun blocco del file, e la bitmap, che descrive l’occupazione del volume. La posizione richiesta determina quanti collegamenti seguire e quale offset conservare, mentre la catena scelta determina la destinazione fisica.",
      "Carica «Seguire la catena del file A» con «Carica questo caso» e avanza attraverso le coordinate logiche e i due passaggi della FAT. Per il byte 2400 verifica indice 2 e offset 352, quindi confronta il caso del file B. Il percorso cambia da 3 → 9 → 5 a 8 → 4 → 12, mentre la bitmap continua a descrivere gli stessi otto blocchi liberi."
    ],
    "lettura": "Ogni riquadro FAT[n] contiene il numero del blocco successivo a n. Parti dal blocco indicato dalla directory e conta i collegamenti attraversati. Nella bitmap iniziale ogni cifra corrisponde al numero di blocco stampato sotto di essa: uno significa assegnato e zero libero.",
    "conclusione": "Alla posizione 2400 corrispondono indice logico 2 e offset 352. Conta quindi due collegamenti a partire dal blocco iniziale: A raggiunge 5 e B raggiunge 12. La bitmap conta gli stessi otto blocchi liberi in entrambi i casi, perché scegliere il file da leggere cambia il percorso nella FAT e conserva l’occupazione del volume.",
    "controlli": {
      "file": "File la cui catena vuoi percorrere. A comincia dal blocco 3, B dal blocco 8; entrambi contengono quattro blocchi da 1024 byte.",
      "pos": "Posizione del byte nel file, contando da zero. Il quoziente della divisione per 1024 è il numero di collegamenti da seguire e il resto è l’offset."
    },
    "esperienze": [
      {
        "titolo": "Seguire la catena del file A",
        "parametri": {
          "file": "a",
          "pos": 2400
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Primo blocco = File A · blocco 3; Posizione del byte = 2400.",
          "In «Directory» annota l’inizio 3 e la catena 3 → 9 → 5 → 11; conta anche gli otto blocchi liberi nella bitmap.",
          "In «Coordinate logiche» dividi 2400 per 1024: annota indice 2 e offset 352.",
          "Segui «Passaggio 1» e «Passaggio 2», poi in «Lettura» controlla il blocco 5 e lo stesso offset."
        ],
        "risultato": "Il byte 2400 di A si trova nel blocco 5 a offset 352, dopo due successori.",
        "ragionamento": "2400 = 2 × 1024 + 352. Dal blocco iniziale 3 il primo collegamento porta a 9 e il secondo a 5; il resto 352 individua il byte entro quel blocco.",
        "attesi": [
          {
            "passo": 4,
            "campo": "Offset",
            "valore": "352"
          },
          {
            "passo": 4,
            "campo": "Successori seguiti",
            "valore": "2"
          }
        ]
      },
      {
        "titolo": "Conservare la posizione nel file B",
        "parametri": {
          "file": "b",
          "pos": 2400
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Primo blocco = File B · blocco 8; Posizione del byte = 2400.",
          "In «Directory» confronta l’inizio 8 e la catena 8 → 4 → 12 → 6 con quelli di A; la bitmap è la stessa.",
          "In «Coordinate logiche» verifica che indice 2 e offset 352 siano rimasti uguali.",
          "Segui i due passaggi fino a «Lettura» e annota il diverso blocco fisico raggiunto."
        ],
        "risultato": "Il byte 2400 di B si trova nel blocco 12 a offset 352, ancora dopo due successori.",
        "ragionamento": "La posizione nel file determina il medesimo quoziente e resto. Cambia la catena: da 8 si passa a 4 e poi a 12, che ospita il byte richiesto.",
        "attesi": [
          {
            "passo": 4,
            "campo": "Offset",
            "valore": "352"
          },
          {
            "passo": 4,
            "campo": "Successori seguiti",
            "valore": "2"
          }
        ]
      }
    ]
  },
  "6.5.5": {
    "scopo": "La bitmap deve rappresentare esattamente i blocchi del volume. Calcolerai quanti byte servono e se rimangono posizioni di riempimento, tenendo distinti bit della mappa e byte dei dati.",
    "teoria": [
      "Un volume è un’area di un dispositivo organizzata per conservare file. Per decidere dove collocare i loro dati, il sistema può numerarne i blocchi e riservare un bit a ciascuno. Un bit è una cifra che vale zero oppure uno; la fila di queste cifre si chiama bitmap. Per interpretare lo stato dei blocchi bisogna conoscere la convenzione che assegna a zero e uno il significato di libero oppure occupato.",
      "Per calcolare le dimensioni della mappa conta il numero dei blocchi rappresentati, qualunque sia la loro grandezza. Un byte contiene otto bit, quindi ogni gruppo di otto blocchi richiede un byte di mappa. Anche un gruppo finale incompleto richiede un byte intero. La formula ceil(numero di blocchi / 8) esprime proprio questo arrotondamento verso l’intero superiore.",
      "Il volume dell’esempio contiene 32768 blocchi e richiede quindi 32768 bit di mappa. Dividendo per otto si ottengono esattamente 4096 byte, con zero bit di riempimento. In generale un numero di blocchi che lasci un resto nella divisione per otto richiede comunque l’ultimo byte intero; le posizioni eccedenti appartengono alla rappresentazione e vanno escluse dal conteggio dei blocchi disponibili."
    ],
    "introduzione": [
      "Dimensionare una bitmap richiede di distinguere la risorsa rappresentata dallo spazio della sua rappresentazione. Calcolerai quanti byte servano quando ogni blocco del volume occupa un bit della mappa. Poiché un byte contiene otto bit, l’ultimo gruppo va riservato interamente anche quando resta incompleto; le eventuali posizioni di riempimento appartengono alla mappa e rimangono esterne ai blocchi gestiti.",
      "Richiama l’esercizio 4, traccia 1, con «Carica l’esempio guidato» e prevedi i byte necessari per 32768 blocchi. Premi «Registra la previsione», quindi segui «Passo successivo» controllando il passaggio da blocchi a bit e da bit a byte. Confronta i 4096 byte ottenuti con 4096 × 8 posizioni disponibili: la corrispondenza esatta spiega perché, in questo caso, il riempimento sia zero."
    ],
    "lettura": "La ricostruzione passa dal numero di blocchi al numero di bit, poi li raggruppa a otto per formare i byte. Il conteggio del riempimento confronta le posizioni fisicamente riservate con quelle effettivamente utilizzate.",
    "conclusione": "Per controllare la dimensione della bitmap moltiplica i byte ottenuti per otto e sottrai il numero dei blocchi: la differenza è il riempimento. Con 32768 blocchi e 4096 byte la differenza è zero. In una mappa con riempimento, quelle posizioni finali restano esterne alla numerazione dei blocchi.",
    "procedura": [
      "Premi «Carica l’esempio guidato» e verifica esercizio 4, «Dimensionare la bitmap di un volume», traccia 1.",
      "Per i 32768 blocchi indicati, assegna un bit a ciascuno e prevedi il numero minimo di byte.",
      "Registra la previsione e segui la divisione per otto, controllando se compare un resto.",
      "Apri la prova completa per inserire anche i bit di riempimento: ricava questo valore da byte × 8 meno blocchi."
    ],
    "risultato": "La bitmap richiede 4096 byte e zero bit di riempimento.",
    "ragionamento": "32768 bit divisi per otto danno esattamente 4096 byte. I byte riservati contengono 4096 × 8 = 32768 posizioni, tutte utilizzate per i blocchi del volume."
  },
  "6.5.6": {
    "scopo": "La durata di un file dipende dai nomi e dai riferimenti ancora aperti. Seguirai la rimozione di due hard link mentre un processo mantiene un descrittore, per stabilire quando lo spazio diventa recuperabile.",
    "teoria": [
      "Un file può avere due nomi che conducono agli stessi dati. Nei sistemi Unix il nome si trova nella directory, una raccolta di nomi e riferimenti, mentre l’inode descrive il file e i blocchi che ne conservano i byte. Quando un processo, cioè un programma in esecuzione, apre il file, ottiene un descrittore: un numero attraverso il quale può continuare a richiedere letture e scritture sul file aperto.",
      "Un hard link è uno dei nomi che designano l’inode nella directory; il link count conta questi collegamenti. La richiesta unlink elimina il nome indicato e diminuisce il contatore. Il descrittore ottenuto all’apertura mantiene un riferimento distinto, attraverso il quale il processo può raggiungere il file anche quando il nome originario è scomparso.",
      "Se due nomi designano lo stesso inode, cancellare il primo lascia accessibile il secondo. Anche dopo la rimozione dell’ultimo nome un processo che abbia ancora il descrittore aperto può leggere i dati. Il numero dei nomi e l’esistenza di riferimenti aperti spiegano insieme quando il sistema può recuperare lo spazio."
    ],
    "introduzione": [
      "La scomparsa dell’ultimo nome e la fine della vita di un file possono avvenire in momenti diversi. Lo svolgimento ti farà distinguere gli hard link, nomi che designano l’inode, dai riferimenti mantenuti dai processi. Un descrittore ottenuto aprendo il file consente di continuare a usarlo; nelle ipotesi della traccia lo spazio diventa recuperabile quando scompaiono sia i nomi sia l’ultimo riferimento aperto.",
      "Premi «Carica l’esempio guidato» per l’esercizio 3, traccia 1, e avanza con «Passo successivo» attraverso le rimozioni di a e b. Confronta il contatore dei nomi, che arriva a zero, con il descrittore ancora aperto. Segui poi il rilascio di quest’ultimo riferimento: il confronto fra prima e dopo la chiusura permette di individuare quando, nelle ipotesi della traccia, i blocchi diventano recuperabili."
    ],
    "lettura": "I quadri tengono separati i nomi a e b, l’inode 30 e il descrittore aperto del processo. Dopo ogni unlink osserva quali collegamenti restano e leggi il contatore dei nomi senza confonderlo con il riferimento aperto.",
    "conclusione": "Dopo la rimozione di a e b, il link count dell’inode 30 deve valere zero. Verifica poi il riferimento aperto: nel caso guidato il descrittore mantiene il file utilizzabile fino alla chiusura. Nelle ipotesi della traccia, che esclude altri riferimenti, quel momento rende recuperabili i blocchi.",
    "procedura": [
      "Premi «Carica l’esempio guidato» e verifica esercizio 3, «Vita del file dopo unlink», traccia 1.",
      "Annota due nomi iniziali, a e b, e il descrittore che resta aperto su a.",
      "Avanza attraverso i due unlink: il link count passa da due a uno e poi a zero.",
      "Completa lo svolgimento individuando il riferimento ancora vivo e il momento in cui viene rilasciato."
    ],
    "risultato": "Il link count finale è zero. I blocchi diventano recuperabili alla chiusura dell’ultimo descrittore aperto.",
    "ragionamento": "Le due rimozioni eliminano entrambe le voci di directory. Il processo continua però a mantenere un riferimento all’inode 30 attraverso il descrittore; il suo rilascio conclude la durata dell’oggetto, essendo esclusi altri riferimenti dalla traccia."
  },
  "6.6.1": {
    "scopo": "Un’estensione di file aggiorna dati, bitmap e inode mediante scritture separate. Interromperai il lavoro in due punti per ricostruire lo stato durevole e stabilire quali byte siano raggiungibili dopo il riavvio.",
    "teoria": [
      "Quando un file cresce, il sistema scrive i nuovi byte in un blocco, un gruppo di posizioni sul dispositivo, e aggiorna le informazioni che permettono di ritrovarli. La mappa di occupazione, o bitmap, riserva un bit a ogni blocco: uno lo dichiara occupato, zero libero. L’inode, la struttura che descrive il file, conserva il riferimento al blocco assegnato. Uno stato coerente deve accordare questi riferimenti con la mappa e con i dati che il file rende leggibili.",
      "Nel modello il blocco 9 parte libero e conserva ancora vecchi byte. Le tre scritture sul dispositivo riguardano rispettivamente i dati, la bitmap e l’inode. Una scrittura è durevole quando sopravvive all’arresto del sistema, chiamato anche crash. Ciascuna è qui atomica: al riavvio la si ritrova interamente eseguita oppure ancora da eseguire. L’arresto può cadere tra due scritture; sopravvive allora la parte iniziale, detta prefisso, dell’ordine scelto.",
      "Se diventano durevoli prima i dati e poi la bitmap, un arresto dopo il secondo passo lascia il blocco 9 occupato e pieno di byte nuovi, mentre al file manca il riferimento per raggiungerlo. Se diventa durevole per primo l’inode, un arresto subito successivo rende invece leggibili i vecchi byte attraverso il file. La distinta indicazione del contenuto fisico e del contenuto visibile rivela questa differenza."
    ],
    "introduzione": [
      "Un aggiornamento diviso in più scritture può lasciare, dopo un arresto, soltanto una parte del nuovo stato. Ricostruirai questa situazione distinguendo i dati del blocco, il bit della bitmap che lo dichiara occupato e il riferimento dell’inode che lo rende raggiungibile. Nel modello ogni scrittura è atomica, interamente presente oppure assente, e sopravvive il prefisso già durevole dell’ordine scelto.",
      "Avvia «Dati e bitmap durevoli» con «Carica questo caso» e segui «Passo successivo» fino al riavvio. Confronta i nuovi dati fisicamente presenti con l’assenza del riferimento che permetterebbe al file di leggerli. Ripeti «Rendere durevole prima il puntatore»: il file raggiunge invece vecchi byte in un blocco ancora libero secondo la bitmap. Le tre colonne spiegano perché i due stati parziali producano rischi differenti."
    ],
    "lettura": "La fila superiore ordina le tre scritture; il segno verticale indica dove cade l’arresto. Le tre colonne inferiori tengono separati il riferimento nell’inode, il bit della bitmap e il contenuto del blocco 9. Confronta il contenuto fisico con quello visibile attraverso il file.",
    "conclusione": "Dopo dati → bitmap, con due scritture durevoli, il blocco 9 contiene byte nuovi ed è riservato, mentre al file manca il riferimento. Dopo il solo inode, il file raggiunge invece vecchi byte in un blocco ancora marcato libero. Per verificare una sequenza ricostruisci separatamente riferimento, bit e contenuto, assumendo atomiche le singole scritture.",
    "controlli": {
      "order": "Ordine in cui diventano durevoli dati, bitmap e inode. Le lettere del modello sono d, b e i; la schermata ne mostra i nomi completi.",
      "cut": "Numero di scritture già durevoli al momento dell’arresto, da zero a tre. Si conserva esattamente il prefisso di questa lunghezza dell’ordine scelto."
    },
    "esperienze": [
      {
        "titolo": "Dati e bitmap durevoli",
        "parametri": {
          "order": "dbi",
          "cut": 2
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Ordine durevole = Dati → bitmap → inode; Scritture durevoli al crash = 2.",
          "In «Prima dell’estensione» verifica bitmap zero e puntatore assente per il blocco 9.",
          "In «Persistenza» segui il prefisso dati → bitmap, fermato prima dell’inode.",
          "In «Dopo il riavvio» confronta i nuovi dati nel blocco con il contenuto visibile dal file."
        ],
        "risultato": "Il blocco contiene nuovi dati ed è occupato, mentre il file vede nessun contenuto di quel blocco.",
        "ragionamento": "Le prime due scritture hanno cambiato dati e bit di allocazione. Manca ancora il puntatore dell’inode: il blocco è riservato e irraggiungibile, quindi il volume ha perso spazio disponibile fino alla riconciliazione.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Contenuto nel blocco",
            "valore": "nuovi dati"
          },
          {
            "passo": 2,
            "campo": "Contenuto visibile dal file",
            "valore": "nessuno"
          }
        ]
      },
      {
        "titolo": "Rendere durevole prima il puntatore",
        "parametri": {
          "order": "idb",
          "cut": 1
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Ordine durevole = Inode → dati → bitmap; Scritture durevoli al crash = 1.",
          "In «Prima dell’estensione» osserva lo stesso stato iniziale.",
          "In «Persistenza» fermati dopo il solo inode: verifica il riferimento a 9 e la bitmap ancora zero.",
          "In «Dopo il riavvio» leggi sia il contenuto fisico sia quello visibile e identifica i vecchi byte."
        ],
        "risultato": "Il file raggiunge vecchi dati nel blocco 9, che la bitmap considera ancora libero.",
        "ragionamento": "La prima scrittura ha pubblicato il puntatore mentre dati e bitmap conservano lo stato iniziale. Il riferimento espone i vecchi byte e consente all’allocatore, basandosi sul bit zero, di assegnare nuovamente un blocco ancora raggiungibile.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Contenuto nel blocco",
            "valore": "vecchi dati"
          },
          {
            "passo": 2,
            "campo": "Contenuto visibile dal file",
            "valore": "vecchi dati"
          }
        ]
      }
    ]
  },
  "6.6.2": {
    "scopo": "Dopo un arresto, la bitmap può contraddire i riferimenti degli inode. Esaminerai i due tipi opposti di incoerenza e seguirai la riparazione che rende la mappa coerente con i proprietari ricostruiti.",
    "teoria": [
      "Un dispositivo diviso in blocchi deve poter indicare quali siano ancora disponibili per un nuovo file. A questo scopo mantiene una bitmap, cioè una sequenza di cifre binarie nella quale ogni posizione corrisponde a un blocco. Ciascuna cifra, o bit, vale uno per un blocco occupato e zero per uno libero. Parallelamente, la descrizione di ciascun file, detta inode, contiene i riferimenti ai blocchi che ne ospitano i dati. Se il sistema si arresta durante un aggiornamento, le due descrizioni possono divergere.",
      "Il verificatore della figura assume che gli inode siano integri e che ogni blocco possa appartenere al più a un file. Per stabilire se il blocco 12 sia in uso percorre dunque gli inode e cerca un riferimento a 12. Solo dopo aver stabilito se esiste un proprietario confronta il risultato con il bit registrato nella mappa.",
      "Se un inode punta a 12 e il bit vale zero, il gestore dello spazio potrebbe assegnare lo stesso blocco a un altro file e sovrascrivere dati ancora raggiungibili. Portare il bit a uno elimina questo rischio. Nel caso inverso, con bit a uno e nessun riferimento, la politica adottata dal simulatore restituisce il blocco allo spazio libero. I dati usati per la diagnosi spiegano anche perché talvolta il numero di bit modificati sia zero."
    ],
    "introduzione": [
      "Riparare una mappa di occupazione richiede una fonte attendibile con cui confrontarla. Verificherai il bit del blocco 12 usando i riferimenti ricostruiti dagli inode, le strutture che descrivono i file. Il modello assume inode integri e un solo proprietario per blocco: con queste ipotesi, presenza del proprietario e bit di occupazione devono concordare prima che lo spazio venga nuovamente assegnato.",
      "Con «Carica questo caso» avvia «Proteggere un blocco raggiungibile» e avanza dalla scansione alla riparazione, osservando il passaggio del bit da zero a uno. Confronta poi «Restituire un blocco orfano», nel quale il bit passa da uno a zero. In entrambi cambia una sola posizione, mentre cambia lo scopo della correzione: proteggere dati raggiungibili oppure recuperare spazio riservato privo di proprietario."
    ],
    "lettura": "Il riquadro della scansione indica se esiste un riferimento al blocco 12. La casella evidenziata della bitmap mostra prima il bit osservato, poi il bit corretto. Le altre posizioni sono omesse; la freccia di riparazione collega la proprietà ricostruita alla mappa aggiornata.",
    "conclusione": "Confronta il bit finale con la presenza del proprietario ricostruito: devono coincidere. Un riferimento con bit zero richiede di impostare uno; zero riferimenti con bit uno richiede di azzerarlo. Se i valori già coincidono, il numero di bit modificati è zero. La conclusione vale assumendo inode integri e un solo proprietario possibile per blocco.",
    "controlli": {
      "owner": "Presenza di un riferimento valido al blocco 12 nella scansione completa degli inode. È la fonte considerata attendibile dal modello.",
      "bit": "Bit di allocazione osservato dopo l’arresto: zero significa libero, uno occupato. Il confronto con i riferimenti determina se va modificato."
    },
    "esperienze": [
      {
        "titolo": "Proteggere un blocco raggiungibile",
        "parametri": {
          "owner": "1",
          "bit": "0"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Riferimento negli inode = Presente; Stato nella bitmap = Libero.",
          "In «Scansione degli inode» annota un riferimento al blocco 12.",
          "In «Confronto» osserva il conflitto con la bitmap zero e prevedi il rischio di una seconda assegnazione.",
          "In «Riparazione» verifica che il bit diventi uno e che venga contato un bit modificato."
        ],
        "risultato": "La riparazione porta il bit a 1 e modifica una posizione della bitmap.",
        "ragionamento": "Il riferimento dell’inode prova, nelle ipotesi del modello, che il blocco appartiene a un file. Impostare il bit di allocazione impedisce che venga scelto come spazio libero per altri dati.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Bit dopo il controllo",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Bit modificati",
            "valore": "1"
          }
        ]
      },
      {
        "titolo": "Restituire un blocco orfano",
        "parametri": {
          "owner": "0",
          "bit": "1"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Riferimento negli inode = Assente; Stato nella bitmap = Occupato.",
          "In «Scansione degli inode» verifica che la ricerca completa trovi zero riferimenti a 12.",
          "In «Confronto» osserva il bit uno che riserva ancora il blocco.",
          "In «Riparazione» segui il passaggio a zero e confronta la direzione della correzione con il primo caso."
        ],
        "risultato": "Il blocco viene liberato: il bit finale è 0 e i bit modificati sono 1.",
        "ragionamento": "Il bit uno sottraeva spazio all’allocatore pur in assenza di un proprietario. La politica del simulatore usa gli inode come fonte attendibile e riporta la mappa al valore zero.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Bit dopo il controllo",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Bit modificati",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "6.6.3": {
    "scopo": "Una transazione vuole portare A a 7 e B a 9. Sceglierai il punto dell’arresto per capire come la presenza del commit decida se il recupero debba installare quelle immagini finali.",
    "teoria": [
      "Si immagini un aggiornamento che debba cambiare insieme due blocchi di un dispositivo. Questa operazione composta è una transazione. Poiché le scritture terminano in momenti diversi, un’interruzione potrebbe lasciare soltanto metà del lavoro nelle posizioni definitive. Un journal è un’area del dispositivo nella quale il sistema prepara le registrazioni, dette record, che permetteranno di completare l’aggiornamento dopo un arresto, o crash.",
      "Nel journal di tipo redo, cioè da riapplicare durante il recupero, i record conservano le immagini finali: i contenuti che i blocchi dovranno assumere. Qui A passa da 2 a 7 e B da 4 a 9. Una scrittura è durevole quando sopravvive all’arresto. Una volta rese durevoli entrambe le immagini, il sistema scrive il commit, un contrassegno che conferma l’intera transazione. Solo dopo questa conferma comincia a copiare le immagini nei blocchi definitivi.",
      "Se l’arresto cade al primo passo, i record sono già presenti; al riavvio rimangono in uso 2 e 4, poiché manca la conferma. Dopo il terzo passo il commit è durevole e A contiene già 7. Il recupero può riscrivere 7 in A e 9 in B, cambiando soltanto il valore di B. Applicare più volte la stessa immagine lascia il blocco nello stesso stato finale: questa proprietà si chiama idempotenza."
    ],
    "introduzione": [
      "Il recupero di una transazione deve stabilire se gli aggiornamenti siano stati confermati prima dell’arresto. Studierai il journal redo, registro che conserva le immagini finali da reinstallare, e il commit, contrassegno durevole della conferma. Poiché riscrivere la stessa immagine conserva il valore già raggiunto, il recupero è idempotente: può essere ripetuto anche quando alcuni blocchi risultano già aggiornati.",
      "Carica «Recuperare dopo la prima copia» mediante «Carica questo caso» e avanza fino al crash, dove A vale già 7 e B vale ancora 4. Confronta il recupero delle due immagini con l’unico valore che cambia. Ripeti «Arrestarsi prima del commit»: i record sono presenti, però la conferma manca e rimangono 2 e 4. Il confronto individua nel commit la soglia che autorizza il redo."
    ],
    "lettura": "La fila in alto ordina record, commit e copie definitive. La barra dell’arresto distingue ciò che è durevole. Nei riquadri inferiori segui i valori di A e B prima e dopo il recupero; le frecce dal journal compaiono quando il commit autorizza il redo.",
    "conclusione": "Con arresto al passo 3, il recupero applica due immagini e soltanto B cambia valore: il contatore degli aggiornamenti necessari vale uno. Al passo 1 manca il commit, quindi restano A = 2 e B = 4 e il contatore vale zero. Distingui sempre il numero di immagini disponibili dal numero di valori che devono ancora cambiare.",
    "controlli": {
      "stage": "Ultimo passo già durevole al crash: 0 nessuno, 1 record A e B, 2 commit, 3 copia A, 4 copia B. Il recupero parte dai blocchi effettivamente scritti fino a quel punto."
    },
    "esperienze": [
      {
        "titolo": "Recuperare dopo la prima copia",
        "parametri": {
          "stage": 3
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Ultimo passo durevole (0–4) = 3.",
          "In «Transazione» identifica record, commit, copia A e copia B nell’ordine previsto.",
          "In «Al crash» verifica commit durevole, A già a 7 e B ancora a 4.",
          "In «Recupero» segui entrambe le immagini e conta quante richiedevano un cambiamento effettivo."
        ],
        "risultato": "Il recupero produce A = 7 e B = 9; soltanto un’immagine richiedeva aggiornamento.",
        "ragionamento": "Il commit autorizza l’installazione di entrambe le immagini. A conteneva già 7, quindi la sua riscrittura conserva il valore; B passa da 4 a 9. La ripetibilità deriva dall’uso di assegnazioni finali.",
        "attesi": [
          {
            "passo": 2,
            "campo": "B finale",
            "valore": "9"
          },
          {
            "passo": 2,
            "campo": "Immagini che richiedevano aggiornamento",
            "valore": "1"
          }
        ]
      },
      {
        "titolo": "Arrestarsi prima del commit",
        "parametri": {
          "stage": 1
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Ultimo passo durevole (0–4) = 1.",
          "In «Transazione» individua il confine fra record e commit.",
          "In «Al crash» verifica record completi e commit assente, con A = 2 e B = 4.",
          "In «Recupero» controlla che i due valori restino quelli iniziali e che gli aggiornamenti richiesti siano zero."
        ],
        "risultato": "A rimane 2 e B rimane 4; il recupero esclude la transazione priva di commit.",
        "ragionamento": "I record descrivono l’intenzione di scrivere 7 e 9. Il modello differisce le copie definitive fino al commit; poiché l’arresto precede quella conferma, i blocchi conservano i valori iniziali.",
        "attesi": [
          {
            "passo": 2,
            "campo": "B finale",
            "valore": "4"
          },
          {
            "passo": 2,
            "campo": "Immagini che richiedevano aggiornamento",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "6.6.4": {
    "scopo": "Le modalità di journaling offrono materiali di recupero differenti e richiedono un diverso numero di scritture. Conterai i trasferimenti di tre blocchi dati e quattro di metadati prima del commit e durante il checkpoint.",
    "teoria": [
      "Un aggiornamento di file comprende i dati, ossia i byte che l’utente intende conservare, e i metadati, le informazioni con cui il sistema localizza quei byte e tiene traccia dello spazio occupato. Entrambi si scrivono per blocchi. Un journal riserva sul dispositivo un’area in cui registrare gli aggiornamenti che il sistema potrà completare dopo un’interruzione.",
      "Nel journaling completo, sia i dati sia i metadati transitano nel journal. Quando le immagini sono durevoli, cioè conservate anche dopo un arresto, il sistema registra il commit, il contrassegno che conferma l’operazione. Poi tutti i blocchi vengono copiati nelle posizioni definitive. Il checkpoint conclude questa installazione. Con tre blocchi dati e quattro di metadati si contano sette scritture nel journal e sette nelle sedi finali, per un totale di quattordici.",
      "Nella modalità ordinata dei soli metadati, i tre blocchi dati arrivano direttamente alle posizioni definitive prima del commit. I quattro blocchi di metadati compiono invece entrambi i passaggi, per cui il totale diventa 3 + 2 × 4 = 11 scritture. Le immagini del journal costituiscono il redo, il materiale che il recupero può riapplicare: nella modalità completa comprendono anche i dati, in quella ordinata comprendono i metadati. Il conteggio riguarda i blocchi del carico descritto ed esclude i record che registrano commit, checkpoint e altre informazioni di controllo."
    ],
    "introduzione": [
      "Le modalità di journaling differiscono per i blocchi conservati nel registro di recupero e per il numero di scritture necessarie. Confronterai dati, cioè contenuto del file, e metadati, informazioni che lo descrivono e localizzano. Nel journaling completo entrambi transitano nel journal; nella modalità ordinata i dati diventano durevoli direttamente nelle sedi finali prima del commit, la conferma della transazione.",
      "Imposta tre blocchi dati e quattro di metadati caricando il caso completo con «Carica questo caso». Attraverso «Passo successivo» confronta le sette scritture precedenti al commit con le sette copie definitive del checkpoint. Ripeti il caso «Soli metadati, ordinata»: il totale scende da quattordici a undici perché i dati vengono scritti una volta sola. Il conto esclude i record di controllo di commit e checkpoint."
    ],
    "lettura": "Ogni piccola casella rappresenta una scrittura di blocco: ciano per dati, ambra per metadati. Le due righe separano la fase precedente al commit dal checkpoint, quando le immagini vengono installate definitivamente. Leggi anche la destinazione della prima riga, che cambia fra le modalità.",
    "conclusione": "Per prevedere le scritture totali, conta due copie per ogni blocco che transita nel journal e una per i dati diretti alla sede finale. Con tre blocchi dati e quattro di metadati ottieni 14 oppure 11. Le tre scritture risparmiate corrispondono alle immagini dei dati assenti dal journal ordinato; commit e checkpoint restano esclusi da questo conto.",
    "controlli": {
      "data": "Numero di blocchi che contengono il contenuto del file. Nella modalità completa transitano nel journal; in quella ordinata arrivano direttamente alle posizioni finali.",
      "meta": "Numero di blocchi che descrivono file e allocazione. In entrambe le modalità vengono scritti nel journal e poi nelle sedi definitive.",
      "mode": "Politica da confrontare: registrazione completa oppure soli metadati con dati resi durevoli prima del commit."
    },
    "esperienze": [
      {
        "titolo": "Registrare dati e metadati",
        "parametri": {
          "data": 3,
          "meta": 4,
          "mode": "full"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Blocchi dati = 3; Blocchi di metadati = 4; Modalità = Completa.",
          "In «Prima del commit» conta 3 blocchi dati e 4 metadati, tutti diretti al journal.",
          "In «Dopo il commit» verifica che restino sette immagini da installare nelle posizioni definitive.",
          "In «Contabilità» somma le due fasi e controlla se il journal contiene anche le immagini dei dati."
        ],
        "risultato": "Si effettuano 14 scritture di blocco; il journal permette di riprodurre anche i dati.",
        "ragionamento": "Il carico comprende sette blocchi. Ciascuno viene scritto nel journal e poi nella posizione finale: 2 × (3 + 4) = 14 scritture, escluse quelle dei record di controllo.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Scritture totali",
            "valore": "14"
          },
          {
            "passo": 2,
            "campo": "Dati riproducibili dal journal",
            "valore": "sì"
          }
        ]
      },
      {
        "titolo": "Registrare soltanto i metadati in ordine",
        "parametri": {
          "data": 3,
          "meta": 4,
          "mode": "ordered"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Blocchi dati = 3; Blocchi di metadati = 4; Modalità = Soli metadati, ordinata.",
          "In «Prima del commit» separa tre scritture dei dati nelle sedi finali da quattro scritture nel journal.",
          "In «Dopo il commit» conta soltanto le quattro immagini dei metadati ancora da installare.",
          "In «Contabilità» confronta le 11 scritture con le 14 del primo caso e leggi quali immagini sono disponibili nel journal."
        ],
        "risultato": "Si effettuano 11 scritture di blocco; il journal contiene i metadati e i dati sono già durevoli nelle sedi finali.",
        "ragionamento": "I dati vengono scritti una volta e i metadati due: 3 + 2 × 4 = 11. Il risparmio di tre scritture corrisponde esattamente alle copie dei dati nel journal che questa modalità omette.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Scritture totali",
            "valore": "11"
          },
          {
            "passo": 2,
            "campo": "Dati riproducibili dal journal",
            "valore": "no"
          }
        ]
      }
    ]
  },
  "6.6.5": {
    "scopo": "La bitmap e gli inode possono descrivere in modo incompatibile lo stesso blocco. Classificherai il blocco 17 dopo un arresto e collegherai la diagnosi alla decisione che prenderebbe l’allocatore.",
    "teoria": [
      "Per conservare un file su disco occorre registrare sia i blocchi che gli appartengono sia il fatto che quei blocchi siano occupati. L’inode descrive il file e contiene i riferimenti ai blocchi dei dati. La bitmap è una sequenza di bit, cifre zero oppure uno: nella convenzione della traccia uno indica occupato e zero libero. L’allocatore è il componente che usa questa mappa per scegliere un blocco da assegnare a nuovi dati.",
      "Per stabilire la natura di un’incoerenza conviene cercare lo stesso numero di blocco nelle due strutture. La bitmap dice se l’allocatore lo considera disponibile. Il puntatore nell’inode, cioè il numero che permette di raggiungere il blocco, dice se un file vi accede ancora. La diagnosi assume una scansione completa di inode integri: un riferimento mancante nella scansione deve significare assenza effettiva di un proprietario.",
      "Per il blocco 17 la bitmap vale uno e la scansione completa trova zero riferimenti negli inode. Il blocco è quindi riservato e irraggiungibile: l’allocatore lo considera occupato, mentre nessun file lo usa. Questa combinazione perde spazio disponibile fino alla riconciliazione. La combinazione opposta, con un riferimento a un blocco dichiarato libero, permetterebbe invece una nuova assegnazione su dati ancora raggiungibili."
    ],
    "introduzione": [
      "Diagnosticare uno stato persistente parziale significa incrociare due descrizioni dello stesso blocco. Imparerai a confrontare la bitmap, che guida l’assegnazione dello spazio, con i riferimenti degli inode, che rendono raggiungibili i dati dei file. Un blocco dichiarato occupato e privo di riferimenti sottrae capacità utilizzabile; la combinazione opposta espone dati ancora raggiungibili a una nuova assegnazione.",
      "Con «Carica l’esempio guidato» apri l’esercizio 1, traccia 1, e osserva bitmap uno e zero riferimenti per il blocco 17. Scegli la diagnosi, premi «Registra la previsione» e segui la ricostruzione. Confronta la decisione dell’allocatore, che considera occupato il blocco, con l’assenza di file capaci di raggiungerlo: questa discordanza spiega la perdita di spazio disponibile e giustifica il rischio richiesto nella prova completa."
    ],
    "lettura": "I quadri affiancano il bit di allocazione del blocco 17 e il numero di riferimenti raccolti negli inode. La diagnosi deriva dall’incrocio di queste due informazioni, mentre il rischio descrive l’effetto sullo spazio utilizzabile.",
    "conclusione": "Per il blocco 17, bit uno e zero riferimenti significano spazio riservato e irraggiungibile: l’allocatore lo scarta mentre i file esaminati lasciano inutilizzata quella capacità. Per controllare la diagnosi, scambia le due condizioni: un riferimento con bit zero espone invece dati raggiungibili a una nuova assegnazione.",
    "procedura": [
      "Premi «Carica l’esempio guidato» e verifica esercizio 1, «Diagnosticare uno stato persistente parziale», traccia 1.",
      "Leggi bitmap = 1, con convenzione 1 = allocato, e zero riferimenti trovati dalla scansione completa.",
      "Scegli una diagnosi e registra la previsione; segui la verifica delle due fonti.",
      "Nella prova completa collega la diagnosi al rischio, spiegando perché l’allocatore scarterebbe il blocco nelle nuove assegnazioni."
    ],
    "risultato": "Il blocco è riservato e irraggiungibile; il rischio è perdita di spazio disponibile.",
    "ragionamento": "La bitmap impedisce di assegnare il blocco 17, mentre gli inode integri esaminati nella traccia lasciano quel blocco fuori dall’insieme raggiungibile. Il risultato è spazio occupato senza un file che possa usarlo."
  },
  "6.6.6": {
    "scopo": "Un recupero redo deve decidere separatamente quali transazioni siano confermate. Seguirai due aggiornamenti con un solo commit durevole e ripeterai idealmente il recupero per verificarne l’idempotenza.",
    "teoria": [
      "Il file system è la parte del sistema operativo che organizza nomi, file e spazio sul dispositivo. Può annotare in un registro persistente, il journal, le operazioni da rendere definitive. Più modifiche destinate a valere insieme formano una transazione. Il commit è il contrassegno di conferma della transazione, riconoscibile anche al successivo riavvio.",
      "Nel journal di tipo redo mostrato qui il record contiene il valore finale da installare e il recupero lo usa quando trova il commit durevole della transazione. Durevole significa che la conferma era stata scritta in una forma che sopravvive all’arresto. Il semplice inizio di una transazione lascia invece aperto il suo esito.",
      "Nel caso guidato T1 vuole portare A da 3 a 12 e T2 vuole portare B da 6 a 21. Il commit è durevole soltanto per T1, quindi il recupero produce A = 12 e B = 6. Ripetere l’assegnazione di 12 ad A conserva 12: il procedimento è idempotente. Una prescrizione relativa, come aggiungere una quantità al valore presente, potrebbe invece applicare due volte lo stesso aggiornamento."
    ],
    "introduzione": [
      "Quando due transazioni modificano blocchi distinti, ciascuna conserva una propria decisione di conferma. Verificherai il recupero valutando separatamente i commit, i contrassegni durevoli che autorizzano a installare le immagini registrate nel journal. Il confronto fra una prima e una seconda esecuzione mostrerà l’idempotenza del redo: assegnare nuovamente lo stesso valore finale lascia invariato lo stato già ottenuto.",
      "Ripristina l’esercizio 5, traccia 1, con «Carica l’esempio guidato» e annota i valori iniziali A = 3 e B = 6. Avanza con «Passo successivo», confrontando il commit presente di T1 con quello assente di T2. Dopo aver ottenuto la coppia 12 e 6, applica mentalmente le stesse decisioni una seconda volta: il risultato identico dipende da assegnazioni finali, invece che da incrementi ripetuti."
    ],
    "lettura": "La ricostruzione distingue T1 su A e T2 su B, ciascuna con il proprio commit. I valori iniziali sono ancora nelle sedi definitive al crash; segui soltanto la transazione autorizzata e poi confronta una seconda applicazione delle stesse immagini.",
    "conclusione": "Per ogni transazione controlla il proprio commit prima di assegnare il valore registrato. Con la sola T1 confermata la coppia deve essere (12, 6); ripetendo il recupero deve restare identica. L’idempotenza dipende dai record che assegnano valori finali, e il confronto fra i due recuperi permette di verificarla.",
    "procedura": [
      "Premi «Carica l’esempio guidato» e verifica esercizio 5, «Recuperare due transazioni indipendenti», traccia 1.",
      "Annota A = 3 e B = 6 al crash, immagini obiettivo 12 e 21, commit durevole soltanto per T1.",
      "Avanza nei passaggi: applica l’immagine di T1 ad A e conserva B per la transazione priva di commit.",
      "Ripeti il ragionamento con i valori appena ottenuti e confronta la coppia dopo il secondo recupero."
    ],
    "risultato": "Il recupero produce la coppia (12, 6), che resta identica dopo una seconda esecuzione.",
    "ragionamento": "T1 è confermata e autorizza A = 12. T2 manca della conferma, quindi B conserva 6. Riscrivere l’immagine assoluta 12 in A lascia ancora 12, mentre B continua a rimanere fuori dagli aggiornamenti autorizzati."
  },
  "6.7.1": {
    "scopo": "Una sessione autenticata può richiedere un’operazione estranea ai diritti del proprio ruolo. Confronterai lettura e modifica da parte dello studente, seguendo separatamente identificazione e decisione sul fascicolo.",
    "teoria": [
      "Un fascicolo condiviso in un corso deve poter essere letto dagli studenti e aggiornato dal docente. Quando una richiesta raggiunge il servizio, sapere quale fascicolo sia stato indicato basta a individuare l’oggetto, mentre per decidere se mostrarlo o modificarlo occorrono anche l’identità di chi lo chiede e l’operazione desiderata.",
      "Il servizio verifica le credenziali, prove dell’identità come una password, attraverso l’autenticazione. Associa così un’identità alla sessione, l’insieme delle interazioni riconosciute come provenienti dallo stesso accesso. L’autorizzazione confronta poi l’operazione richiesta con i diritti attribuiti a quell’identità. Qui i diritti dipendono dal ruolo, una categoria di account con le medesime facoltà: lo studente può leggere il fascicolo, il docente può leggerlo e modificarlo. Quando mancano le credenziali, il servizio si ferma prima di applicare i diritti di un ruolo.",
      "Una richiesta di modifica da parte di uno studente autenticato arriva dunque fino all’esame della politica e lì viene respinta. Se la stessa richiesta proviene dal docente, il servizio applica la modifica. Una lettura autorizzata lascia invece il contatore delle modifiche a zero. Il significato di quel numero dipende perciò sia dalla decisione presa sia dal tipo di richiesta."
    ],
    "introduzione": [
      "Riconoscere l’identità di chi presenta una richiesta e decidere se concederla sono due passaggi distinti. Li seguirai sul fascicolo del corso: l’autenticazione verifica le credenziali della sessione, mentre l’autorizzazione confronta l’operazione con i diritti del ruolo. Il confronto fra lettura e modifica dello studente renderà visibile perché la stessa identità riconosciuta possa ricevere decisioni diverse sul medesimo oggetto.",
      "Avvia «Leggere con il ruolo studente» mediante «Carica questo caso» e segui identificazione, politica e decisione con «Passo successivo». Mantieni le credenziali, cambia «Operazione» in «Modifica» e premi «Applica i parametri». Confronta gli esiti insieme al contatore delle modifiche: lo zero accompagna sia la lettura concessa sia la modifica negata, perché operazioni e decisioni spiegano insieme lo stato finale del fascicolo."
    ],
    "lettura": "La sessione compare a sinistra, la politica al centro e il fascicolo a destra. L indica lettura e M modifica. La freccia finale dipende dall’autorizzazione, mentre il contatore delle modifiche cresce soltanto per una modifica concessa.",
    "conclusione": "Con il ruolo studente, prevedi lettura consentita e modifica negata. In entrambi i casi il contatore delle modifiche resta zero: nel primo perché leggere conserva il contenuto, nel secondo perché la richiesta è respinta. Per interpretare quel contatore devi quindi controllare anche operazione ed esito.",
    "controlli": {
      "role": "Credenziali e ruolo della sessione. Lo studente dispone della lettura, il docente anche della modifica; senza credenziali il servizio interrompe l’accesso.",
      "op": "Operazione richiesta sullo stesso fascicolo. Una lettura concessa restituisce il contenuto e lascia a zero il numero di modifiche."
    },
    "esperienze": [
      {
        "titolo": "Leggere con il ruolo studente",
        "parametri": {
          "role": "studente",
          "op": "lettura"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Credenziali = Studente autenticato; Operazione = Lettura.",
          "In «Identificazione» verifica l’autenticazione riuscita della sessione studente.",
          "In «Politica» confronta l’operazione lettura con i diritti del ruolo.",
          "In «Decisione» interpreta insieme accesso consentito e zero modifiche applicate."
        ],
        "risultato": "La lettura è consentita e il contatore delle modifiche resta a zero.",
        "ragionamento": "Il ruolo studente comprende il diritto di lettura. La richiesta viene quindi servita, e il contatore resta a zero perché restituire il fascicolo conserva il suo contenuto.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Accesso",
            "valore": "consentito"
          },
          {
            "passo": 2,
            "campo": "Modifiche applicate",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Richiedere una modifica con lo stesso ruolo",
        "parametri": {
          "role": "studente",
          "op": "modifica"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Credenziali = Studente autenticato; Operazione = Modifica.",
          "In «Identificazione» verifica che la medesima sessione sia ancora autenticata.",
          "In «Politica» confronta la richiesta di modifica con il solo diritto di lettura.",
          "In «Decisione» annota il rifiuto e confrontalo con la lettura concessa nel primo caso."
        ],
        "risultato": "La modifica è negata; le modifiche applicate sono zero.",
        "ragionamento": "L’identità dello studente è riconosciuta, mentre la politica gli attribuisce soltanto lettura. La decisione sull’operazione esclude dunque la modifica e lascia il fascicolo invariato.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Accesso",
            "valore": "negato"
          },
          {
            "passo": 2,
            "campo": "Modifiche applicate",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "6.7.2": {
    "scopo": "L’apertura di /corso/esiti richiede controlli lungo il percorso prima di raggiungere il file. Confronterai il solo attraversamento con il solo elenco della directory per individuare il punto esatto dell’eventuale rifiuto.",
    "teoria": [
      "Per aprire in lettura /corso/esiti, il sistema cerca prima la directory corso nella radice, indicata da /, poi il nome esiti dentro corso. Una directory contiene nomi e riferimenti agli oggetti corrispondenti; l’inode è la struttura che descrive l’oggetto raggiunto e ne conserva i permessi. Cercare un nome noto ed enumerare tutti i nomi della directory sono operazioni distinte, ciascuna con un permesso proprio.",
      "In una directory, il permesso x autorizza l’attraversamento, ossia la ricerca di una voce per nome. Il permesso r autorizza la lettura dell’elenco dei nomi. Sul file finale la lettera r autorizza invece a leggere il contenuto. Nel percorso dell’esperimento l’attraversamento della radice è già concesso, perciò il primo controllo che può fermare la ricerca riguarda la directory /corso.",
      "Con il solo permesso x su /corso, chi conosce il nome esiti può raggiungere il file e, se anche la lettura del file è concessa, ottenere un descrittore: il numero attraverso cui il programma accede al file aperto. Questa apertura è chiamata open. Con il solo r sulla directory si possono elencare i nomi; la ricerca necessaria all’apertura si arresta per mancanza di x. La voce «Lettura del file verificata» distingue così il rifiuto avvenuto lungo il percorso da quello deciso sull’oggetto finale."
    ],
    "introduzione": [
      "Raggiungere un file attraverso il suo nome richiede controlli lungo il percorso prima di verificare il contenuto richiesto. Studierai la distinzione fra il permesso r della directory, che consente di elencarne i nomi, e x, che consente di cercare una voce nota. Soltanto dopo aver raggiunto il file viene esaminato il suo permesso di lettura, anch’esso indicato con r.",
      "Carica «Aprire conoscendo il nome» con «Carica questo caso» e segui /corso/esiti mediante «Passo successivo», osservando l’attraversamento della directory e il controllo finale sul file. Confronta poi «Elencare la directory senza attraversarla». Il permesso di lettura del file resta concesso in entrambi i casi, però con il solo r sulla directory il percorso si ferma prima: il campo «Lettura del file verificata» localizza questo arresto."
    ],
    "lettura": "I tre riquadri seguono radice, directory corso e file esiti. Ogni freccia richiede che il controllo precedente riesca. Il riquadro del file può restare saltato quando la ricerca si ferma nella directory; il riepilogo segnala se la lettura del file è stata verificata.",
    "conclusione": "Cercare il nome noto esiti richiede x su /corso; leggere il contenuto richiede poi r sul file. Con il solo r della directory, l’esito è negato e la lettura del file resta da verificare. Con il solo x e il permesso r sul file, l’apertura riesce: il successo va giustificato seguendo entrambi i controlli.",
    "controlli": {
      "dir": "Permessi effettivi sulla directory /corso: x permette di cercare un nome, r di leggerne l’elenco, rx entrambe le operazioni.",
      "file": "Permesso effettivo di lettura del file esiti. Viene esaminato soltanto dopo aver raggiunto il suo inode attraverso la directory."
    },
    "esperienze": [
      {
        "titolo": "Aprire conoscendo il nome",
        "parametri": {
          "dir": "x",
          "file": "1"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Permessi su /corso = Solo attraversamento (x); Lettura su esiti = Concessa.",
          "In «Radice» osserva che il percorso ha già raggiunto /corso.",
          "In «Ricerca del nome» verifica il permesso x e il raggiungimento dell’inode di esiti.",
          "In «Apertura» controlla il permesso r sul file e l’esito aperto."
        ],
        "risultato": "Il file viene aperto e il controllo della sua lettura viene eseguito.",
        "ragionamento": "Il permesso x permette di cercare esiti dentro corso quando il nome è già noto. Raggiunto l’inode, il permesso di lettura sul file autorizza open a restituire il descrittore.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Lettura del file verificata",
            "valore": "sì"
          },
          {
            "passo": 2,
            "campo": "Esito",
            "valore": "aperto"
          }
        ]
      },
      {
        "titolo": "Elencare la directory senza attraversarla",
        "parametri": {
          "dir": "r",
          "file": "1"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Permessi su /corso = Solo elenco (r); Lettura su esiti = Concessa.",
          "In «Radice» ritrova lo stesso punto di partenza.",
          "In «Ricerca del nome» osserva il solo r sulla directory e l’arresto prima dell’inode del file.",
          "In «Apertura» verifica «Lettura del file verificata: no» e spiega perché il permesso del file resta inutilizzato."
        ],
        "risultato": "L’accesso è negato durante la ricerca del nome; la lettura sul file rimane da verificare.",
        "ragionamento": "Il permesso r permette di leggere l’elenco della directory. Cercare un nome per raggiungere il suo oggetto richiede x: mancando quel diritto, il percorso si arresta prima del controllo sul file finale.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Lettura del file verificata",
            "valore": "no"
          },
          {
            "passo": 2,
            "campo": "Esito",
            "valore": "accesso negato"
          }
        ]
      }
    ]
  },
  "6.7.3": {
    "scopo": "La cifratura del disco e i permessi del file agiscono in punti differenti del percorso dei dati. Sposterai l’osservatore dal supporto spento a una sessione autorizzata per stabilire quale forma del contenuto diventi visibile.",
    "teoria": [
      "Il contenuto di un documento cambia aspetto secondo il punto in cui lo si osserva. Un volume è un’area del dispositivo organizzata per contenere file. Se il volume è cifrato, i byte vi sono conservati in una forma trasformata, il testo cifrato. Per ricostruire i byte originali, detti in chiaro, occorre una chiave, un’informazione segreta usata dalla decifratura. Il procedimento che trasforma i dati si chiama cifrario. La cifratura a riposo riguarda la copia registrata sul supporto.",
      "Chi rimuove il disco a macchina spenta può leggerne fisicamente i blocchi. Nelle condizioni dell’esperimento, in cui la chiave rimane segreta e il cifrario è sicuro, la copia ottenuta contiene testo cifrato. Dopo lo sblocco, invece, il sistema dispone della chiave e può decifrare i blocchi per servire le richieste di un programma.",
      "Il volume montato è reso disponibile dal sistema attraverso i nomi dei file. Nell’esperimento, quando è anche sbloccato, il sistema possiede la chiave e può servire le richieste dell’account, l’identità digitale a cui sono associati i permessi. La sessione, cioè l’accesso del programma sotto quell’identità, riceve il documento in chiaro se dispone della lettura. Se la lettura è negata riceve un errore di apertura. Le due sessioni interrogano lo stesso volume sbloccato e ottengono risposte diverse per la decisione sul file."
    ],
    "introduzione": [
      "Per valutare la protezione di un documento occorre stabilire da dove l’osservatore acceda ai suoi byte. Confronterai la copia fisica di un volume cifrato con l’interfaccia del file in una sessione sbloccata. La cifratura trasforma il contenuto mediante una chiave segreta; dopo lo sblocco, il sistema può decifrarlo e applica i permessi dell’account alle richieste che gestisce.",
      "Con «Carica questo caso» avvia «Osservare il supporto spento» e procedi fino all’esito, localizzando l’osservatore sul dispositivo e la chiave assente. Confronta «Leggere da una sessione autorizzata», dove il sistema possiede la chiave e concede la lettura. Il passaggio da testo cifrato a testo in chiaro dipende dal percorso osservato; selezionando la sessione senza lettura e applicando i parametri compare invece l’errore di apertura."
    ],
    "lettura": "Il dispositivo a sinistra contiene blocchi cifrati. Al centro il volume indica se è sbloccato e a destra l’interfaccia del file mostra il controllo di lettura. Il punto osservatore cambia posizione fra i casi: è da quel punto che va interpretata la scritta finale.",
    "conclusione": "Prima di interpretare il risultato, localizza l’osservatore: sul disco spento e privo della chiave ottiene testo cifrato; attraverso una sessione sbloccata e autorizzata riceve testo in chiaro. Una sessione priva del diritto riceve un errore. Questi esiti dipendono dalle ipotesi di chiave segreta, cifrario sicuro e percorso di accesso mostrato.",
    "controlli": {
      "where": "Posizione e possibilità dell’osservatore: accesso al disco spento senza chiave, oppure richiesta attraverso una sessione sbloccata con lettura concessa o negata."
    },
    "esperienze": [
      {
        "titolo": "Osservare il supporto spento",
        "parametri": {
          "where": "disk"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Punto di osservazione = Disco rimosso a macchina spenta.",
          "In «Supporto» localizza l’osservatore sul dispositivo e verifica volume montato: no.",
          "In «Mediazione» osserva la chiave assente e il controllo sul file fuori percorso.",
          "In «Osservazione» leggi la forma del contenuto restituita dalla copia fisica del disco."
        ],
        "risultato": "L’osservatore ottiene testo cifrato.",
        "ragionamento": "Il disco espone i blocchi così come sono memorizzati. Poiché l’osservatore manca della chiave e il modello assume un cifrario sicuro, i byte copiati conservano la forma cifrata.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Controllo sul file",
            "valore": "fuori percorso"
          },
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "testo cifrato"
          }
        ]
      },
      {
        "titolo": "Leggere da una sessione autorizzata",
        "parametri": {
          "where": "allow"
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Punto di osservazione = Sessione sbloccata con lettura.",
          "In «Supporto» osserva lo spostamento all’interfaccia del file e il volume montato.",
          "In «Mediazione» verifica chiave disponibile e lettura concessa all’account.",
          "In «Osservazione» confronta il testo in chiaro con il contenuto cifrato visibile dal supporto spento."
        ],
        "risultato": "La sessione autorizzata riceve testo in chiaro.",
        "ragionamento": "Il sistema sbloccato dispone della chiave e decifra i blocchi per servire l’interfaccia del file. Il controllo dei diritti concede la lettura, perciò il programma riceve il documento originale.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Controllo sul file",
            "valore": "lettura concessa"
          },
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "testo in chiaro"
          }
        ]
      }
    ]
  },
  "6.7.4": {
    "scopo": "Un registro contiene richieste di account diversi, su oggetti diversi e con decisioni diverse. Filtrerai gli eventi di tesi per due account, contando separatamente richieste concesse e negate e precisando l’attribuzione sostenuta dai dati.",
    "teoria": [
      "Quando un servizio conserva un registro di controllo, chiamato registro di audit, diventa possibile ricostruire a posteriori gli eventi osservati. Ogni riga riunisce un istante, l’account, l’oggetto interessato, l’operazione e la decisione. L’account è l’identità digitale associata alle credenziali usate per accedere; le credenziali sono le prove presentate al servizio, come una password. L’istante, qui espresso in minuti dall’avvio, colloca la riga nell’intervallo da esaminare.",
      "Per contare le richieste di un account su un oggetto occorre selezionare le righe che soddisfano insieme tutti i criteri. Fino al minuto 9 incluso, ada compare su tesi ai minuti 2 e 6; la lettura di dati al minuto 8 riguarda un altro oggetto e resta esclusa. Le due righe selezionate registrano una lettura e una modifica, entrambe concesse.",
      "Per leo sullo stesso oggetto e nello stesso periodo compaiono ancora due richieste: una modifica negata al minuto 4 e una lettura concessa al minuto 9. Il numero delle righe è uguale, mentre gli esiti sostengono conclusioni differenti. Il registro attribuisce ogni richiesta alle credenziali utilizzate; per identificare la persona che le ha adoperate occorrerebbero informazioni ulteriori."
    ],
    "introduzione": [
      "Un registro di audit raccoglie gli eventi necessari a ricostruire richieste e decisioni del servizio. Imparerai a selezionare le righe che soddisfano insieme account, oggetto e intervallo temporale, prima di contare concessioni e rifiuti. L’account identifica le credenziali usate nell’evento; distinguere questo dato dall’identità della persona e separare tentativo da concessione permette di formulare conclusioni proporzionate alle evidenze.",
      "Carica il caso di ada su tesi con «Carica questo caso» e mantieni il minuto finale incluso a 9. Avanza con «Passo successivo», confrontando le righe selezionate ai minuti 2 e 6 con gli eventi esclusi. Cambia poi account in leo e premi «Applica i parametri»: restano ancora due richieste, però una è negata. Il medesimo conteggio di righe sostiene quindi conclusioni diverse sugli esiti."
    ],
    "lettura": "La tabella conserva le colonne minuto, account, oggetto, operazione ed esito. Il primo passo evidenzia il periodo; il secondo mantiene in ambra le righe che soddisfano anche account e oggetto. Il riepilogo conta gli esiti soltanto di queste righe.",
    "conclusione": "Fino al minuto 9, il filtro ada/tesi conserva i minuti 2 e 6 e dà due concessioni; leo/tesi conserva 4 e 9 e dà una concessione e un rifiuto. Verifica ciascun conteggio sulle righe selezionate. Una concessione attesta la decisione del servizio, mentre l’identità della persona che usava l’account richiede altri riscontri.",
    "controlli": {
      "user": "Account da cercare nel registro. Il nome indica le credenziali associate all’evento.",
      "obj": "Oggetto su cui filtrare le richieste. Gli eventi dello stesso account su altri oggetti restano fuori dal conteggio.",
      "time": "Estremo finale incluso del periodo, in minuti dall’avvio. L’intervallo comincia sempre da zero."
    },
    "esperienze": [
      {
        "titolo": "Ricostruire gli accessi di ada a tesi",
        "parametri": {
          "user": "ada",
          "obj": "tesi",
          "time": 9
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Account = ada; Oggetto = tesi; Minuto finale incluso = 9.",
          "In «Intervallo» includi tutti i cinque eventi fino al minuto 9.",
          "In «Filtro» mantieni soltanto account ada e oggetto tesi: individua le righe dei minuti 2 e 6.",
          "In «Ricostruzione» conta gli esiti e collega ogni concessione alla propria operazione."
        ],
        "risultato": "Le due richieste selezionate sono entrambe concesse: lettura al minuto 2 e modifica al minuto 6.",
        "ragionamento": "Il filtro elimina l’evento di ada su dati e quelli presentati da leo. Rimangono due righe con oggetto tesi; il loro campo esito vale concessa in entrambi i casi, quindi il conteggio è 2 e 0.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Richieste concesse",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "Richieste negate",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Distinguere rifiuto e concessione per leo",
        "parametri": {
          "user": "leo",
          "obj": "tesi",
          "time": 9
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Account = leo; Oggetto = tesi; Minuto finale incluso = 9.",
          "In «Intervallo» conserva il medesimo periodo fino al minuto 9.",
          "In «Filtro» individua le righe leo / tesi dei minuti 4 e 9.",
          "In «Ricostruzione» separa la modifica negata dalla lettura concessa e formula una conclusione riferita all’account."
        ],
        "risultato": "Per leo su tesi risulta una richiesta concessa e una negata.",
        "ragionamento": "Il minuto 4 registra una modifica respinta; il minuto 9 una lettura accolta. Il numero delle righe coincide con il caso di ada, mentre la distribuzione degli esiti è diversa e riguarda le credenziali registrate.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Richieste concesse",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Richieste negate",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "6.7.5": {
    "scopo": "Una lista di controllo degli accessi può concedere diritti attraverso una voce individuale e una di gruppo. Applicherai la politica additiva dichiarata per stabilire se Ada possa modificare la relazione.",
    "teoria": [
      "Per decidere se un account possa leggere o modificare un file, il sistema deve riconoscere l’identità digitale che presenta la richiesta e le sue appartenenze. Un gruppo raccoglie account ai quali si vogliono attribuire alcuni diritti comuni. Una lista di controllo degli accessi associa diritti a account o gruppi per un determinato file; la decisione dipende anche dalla regola che combina le voci applicabili.",
      "La sigla ACL, access control list, designa questa lista. Una voce individuale si applica all’account nominato, una voce di gruppo agli account che ne fanno parte. Nella politica additiva dell’esercizio si riuniscono i diritti concessi da tutte le voci applicabili e si verifica se l’operazione richiesta appartenga al risultato. La traccia esclude regole deny, cioè divieti espliciti, e altri privilegi.",
      "Nella politica additiva dell’esercizio, se Ada dispone individualmente della lettura e un suo gruppo dispone della scrittura, Ada ottiene entrambe. Se il diritto di scrittura appartiene a un gruppo al quale Ada è estranea, quella voce resta fuori dal calcolo. La scelta delle righe pertinenti precede dunque l’unione dei diritti."
    ],
    "introduzione": [
      "Una lista di controllo degli accessi, chiamata ACL, attribuisce diritti a singoli account oppure a gruppi dei quali fanno parte. Applicherai la politica additiva dichiarata nell’esercizio, che unisce i diritti di tutte le voci pertinenti. Prima di decidere se la modifica sia concessa, occorre quindi verificare l’appartenenza al gruppo e distinguere i diritti presenti nella lista da quelli effettivamente applicabili all’account.",
      "Premi «Carica l’esempio guidato» per l’esercizio 2, traccia 1, e individua la lettura assegnata ad Ada e la modifica assegnata ai revisori. Dopo aver verificato l’appartenenza di Ada, scegli i diritti effettivi e premi «Registra la previsione». Avanza confrontando le singole voci con la loro unione: la modifica è concessa perché compare nell’insieme risultante, secondo la politica additiva e l’assenza dichiarata di divieti."
    ],
    "lettura": "La ricostruzione distingue la voce dell’account Ada da quella del gruppo revisori. Segui prima l’appartenenza al gruppo, poi l’unione dei diritti applicabili e infine il confronto con l’operazione modifica.",
    "conclusione": "Per Ada, membro di revisori, unisci lettura individuale e modifica del gruppo: la modifica viene concessa. Se togli l’appartenenza a revisori, quella voce cessa di contribuire e resta soltanto la lettura. Questa verifica usa la politica additiva dichiarata, che stabilisce come combinare le voci.",
    "procedura": [
      "Premi «Carica l’esempio guidato» e verifica esercizio 2, «Comporre i diritti individuali e di gruppo», traccia 1.",
      "Individua lettura nella voce di Ada e modifica nella voce di revisori; verifica che Ada appartenga al gruppo.",
      "Prevedi i diritti effettivi e registra il tentativo. Segui l’unione delle due voci.",
      "Nella prova completa scegli la decisione sulla modifica e motiva il confronto con l’insieme ricavato."
    ],
    "risultato": "Ada dispone di lettura e modifica; la richiesta di modifica è concessa.",
    "ragionamento": "La voce individuale fornisce lettura e quella del gruppo revisori si applica perché Ada ne è membro. La politica riunisce i due diritti, quindi modifica appartiene all’insieme autorizzato."
  },
  "6.7.6": {
    "scopo": "Un registro permette di ricostruire richieste e decisioni entro un periodo preciso. Filtrerai gli eventi di ada su tesi fino al minuto 6 e distinguerai l’account registrato dall’identità della persona.",
    "teoria": [
      "Un registro di audit è una raccolta di righe conservate per ricostruire gli eventi del sistema. Ogni riga può documentare momento, account, file, operazione richiesta ed esito. L’account è l’identità digitale sotto cui avviene la richiesta; le credenziali, come una password, sono le prove usate per presentarsi con quell’identità. Scegliere un filtro significa selezionare gli eventi che soddisfano i criteri dell’indagine.",
      "Filtrare per account, file e intervallo di tempo produce un insieme di righe pertinenti. Per interpretarle occorre ancora distinguere il tipo di operazione e il suo esito. Due righe che mostrano lo stesso account e lo stesso file possono così sostenere conclusioni diverse.",
      "Una riga che documenta una scrittura respinta dimostra che l’account ha tentato quell’operazione. Per sostenere che una scrittura sia stata concessa serve una riga con quell’esito. Analogamente, il nome dell’account identifica le credenziali registrate durante l’evento. L’identità della persona che le usava richiede altre informazioni."
    ],
    "introduzione": [
      "Leggere uno svolgimento di audit significa controllare il percorso che conduce dalle righe alla conclusione. Verificherai prima il filtro per tempo, account e oggetto, poi gli esiti delle operazioni rimaste. Il registro documenta richieste associate a un’identità digitale: una modifica negata prova un tentativo respinto, mentre una concessione descrive la decisione del servizio e richiede ulteriori riscontri per identificare la persona.",
      "Con «Carica l’esempio guidato» richiama l’esercizio 5, traccia 1, e segui «Passo successivo» mantenendo l’estremo temporale al minuto 6 incluso. Confronta le righe di ada su tesi ai minuti 2 e 6 con quella di leo al minuto 4 e con gli eventi successivi. Le due righe pertinenti documentano entrambe concessioni; formula il risultato citando l’account registrato, l’operazione e il relativo esito."
    ],
    "lettura": "Le righe riportano minuto, account, oggetto, operazione ed esito. Mantieni visibili soltanto quelle che soddisfano contemporaneamente i tre criteri temporale, soggettivo e relativo all’oggetto; il conteggio delle concessioni si effettua dopo il filtro.",
    "conclusione": "Entro il minuto 6 incluso, ada/tesi seleziona la lettura del minuto 2 e la modifica del minuto 6: due richieste e due concessioni. Il minuto 4 riguarda leo e resta escluso. Per formulare il risultato cita account, operazione ed esito delle righe, mantenendo distinta l’ulteriore identificazione della persona.",
    "procedura": [
      "Premi «Carica l’esempio guidato» e verifica esercizio 5, «Delimitare una conclusione di audit», traccia 1.",
      "Leggi l’estremo finale incluso, minuto 6, e i filtri account ada e oggetto tesi.",
      "Avanza nella ricostruzione e conserva le righe dei minuti 2 e 6, scartando quelle fuori periodo o riferite ad altri account.",
      "Conta le concessioni nelle due righe rimaste e verifica che l’attribuzione conclusiva riguardi l’account registrato."
    ],
    "risultato": "Restano 2 richieste, entrambe concesse; l’attribuzione sostenuta è all’account registrato.",
    "ragionamento": "La riga del minuto 2 è una lettura concessa di ada su tesi, quella del minuto 6 una modifica concessa sullo stesso oggetto. Il minuto 4 riguarda leo e viene escluso. Il nome nel registro identifica le credenziali usate durante questi eventi."
  },
  "modulo-6": {
    "scopo": "Seguirai un byte virtuale dalla richiesta del processo fino alla memoria fisica. Il confronto fra pagina residente e pagina di file assente mostra quando interviene il kernel e perché la stessa lettura possa richiedere percorsi diversi.",
    "teoria": [
      "Quando un programma in esecuzione, chiamato processo, legge un byte, il suo indirizzo virtuale, VA, indica una posizione nel proprio spazio di memoria. Un byte contiene otto cifre binarie, i bit. Per raggiungerlo nella memoria principale, la RAM, il processore deve ricavare l’indirizzo fisico, PA, e verificare che l’operazione sia consentita. Qui una pagina virtuale raccoglie 4096 byte: VPN è il suo numero e offset è la distanza del byte dall’inizio. Per VPN 3 e offset 77, VA = 3 × 4096 + 77 = 12365, scritto 0x304D in base sedici.",
      "Una porzione di RAM grande quanto una pagina si chiama frame; il suo numero è il PFN. L’unità di gestione della memoria, MMU, traduce le pagine in frame. Una piccola memoria di traduzioni recenti, la TLB, translation lookaside buffer, conserva per alcune pagine PFN e permessi. Ogni voce porta anche ASID, l’identificatore dello spazio di indirizzi, perché i processi A e B possono assegnare destinazioni diverse alla stessa VPN. La coppia A / 3 identifica quindi la traduzione cercata.",
      "Trovare quella coppia nella TLB produce un hit; la sua assenza produce un miss. In caso di miss il modello legge due voci di tabella, le PTE: una nella tabella iniziale, detta radice, e una nell’ultima tabella, detta foglia. La prima permette di raggiungere la seconda, che indica frame e permessi. Present è il bit di presenza: vale uno se il frame è utilizzabile. Per una pagina residente nel frame 10, il byte di offset 77 si trova a 10 × 4096 + 77 = 41037 = 0xA04D.",
      "Se Present vale zero perché la pagina di file è ancora assente, il cammino provoca un’eccezione chiamata page fault. Il kernel, la parte del sistema operativo che gestisce la memoria, esamina la regione, l’intervallo di indirizzi assegnato al processo, e i suoi permessi. Per una lettura ammessa trasferisce la pagina dal file al frame 10, installa la mappatura, cioè l’associazione pagina–frame, e fa ripetere l’istruzione. Nella figura I/O indica questo trasferimento. Il modello esegue poi un nuovo cammino di due PTE prima di riempire la TLB: il totale è quattro letture delle voci e una lettura del file, pur arrivando allo stesso PA.",
      "Residenza e diritti sono proprietà distinte. R permette la lettura e R/W anche la scrittura; la MMU confronta sempre questi permessi con l’operazione richiesta. Una scrittura su una pagina residente di sola lettura viene respinta anche quando la traduzione è già nella TLB. Un indirizzo esterno alle regioni ammesse si arresta durante l’esame del kernel, prima del trasferimento dal file. I contatori separano quindi le operazioni necessarie a trovare la destinazione dal byte effettivamente letto o scritto."
    ],
    "introduzione": [
      "Seguire un byte dalla richiesta alla memoria permette di collegare traduzione, residenza e autorizzazione. Ricostruirai il percorso attraverso la TLB, piccola memoria di traduzioni recenti, e le tabelle che associano pagine virtuali a frame fisici. Se la pagina manca, interviene il kernel, la parte del sistema operativo che la recupera; i permessi stabiliscono comunque se l’operazione richiesta possa raggiungere il byte.",
      "Carica «Leggere una pagina già residente» con «Carica questo caso» e avanza fino all’indirizzo 0xA04D, osservando le due letture delle voci di tabella. Confronta poi «Caricare la stessa pagina dal file», mantenendo offset 77 e TLB vuota. Il medesimo indirizzo finale richiede ora una lettura del file e quattro letture delle voci: il nuovo tentativo ripete la traduzione dopo il caricamento della pagina."
    ],
    "lettura": "La fila superiore dispone VA, TLB, foglia e permessi nell’ordine dei controlli. Il percorso può scendere al kernel e al caricamento del frame; l’ambra indica la fase corrente. Il riepilogo separa letture delle voci di tabella, letture del file e byte effettivamente acceduti.",
    "conclusione": "Con la TLB vuota, la pagina residente e quella caricata dal file raggiungono entrambe 0xA04D: la prima richiede due letture PTE e zero letture dal file, la seconda quattro letture PTE e una lettura dal file. Per verificare la previsione del PA controlla prima i diritti: una scrittura sulla pagina di sola lettura deve dare «accesso negato», anche con traduzione già disponibile.",
    "controlli": {
      "mapping": "Stato e permessi della pagina 3 di A. La pagina residente si trova nel frame 10; la pagina di file assente può essere caricata per una lettura ammessa.",
      "tlb": "Contenuto iniziale della cache di traduzioni. La voce dello spazio B ha lo stesso numero di pagina e una chiave diversa da A; la precarica di A è possibile soltanto per pagine residenti.",
      "op": "Lettura o scrittura richiesta. La MMU confronta questa operazione con i permessi R, lettura, oppure R/W, lettura e scrittura.",
      "offset": "Distanza del byte dall’inizio della pagina da 4096 byte. Si aggiunge prima alla base virtuale della pagina 3, poi alla base fisica del frame 10."
    },
    "esperienze": [
      {
        "titolo": "Leggere una pagina già residente",
        "parametri": {
          "mapping": "rw",
          "tlb": "empty",
          "op": "r",
          "offset": 77
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Mappatura della pagina = Residente, lettura e scrittura; Preparazione della TLB = Vuota; Operazione = Lettura; Offset nella pagina (byte) = 77.",
          "In «Richiesta del processo A» ricomponi il VA 0x304D, poi verifica il miss in «Confronto nella TLB».",
          "In «Cammino nelle tabelle» annota due letture PTE e Present = 1; in «Controllo dei diritti» confronta lettura con R/W.",
          "In «Accesso al byte» verifica 0xA04D, zero letture di file e un byte acceduto."
        ],
        "risultato": "La lettura raggiunge 0xA04D dopo due letture PTE, senza trasferimenti dal file.",
        "ragionamento": "Il miss iniziale richiede le due voci di tabella. La foglia è residente e autorizza la lettura; il frame 10 dà base 40960 e l’offset 77 produce 41037 = 0xA04D.",
        "attesi": [
          {
            "passo": 4,
            "campo": "Letture di file",
            "valore": "0"
          },
          {
            "passo": 4,
            "campo": "Byte acceduti",
            "valore": "1"
          }
        ]
      },
      {
        "titolo": "Caricare la stessa pagina dal file",
        "parametri": {
          "mapping": "file",
          "tlb": "empty",
          "op": "r",
          "offset": 77
        },
        "passi": [
          "Premi «Carica questo caso» e verifica i parametri: Mappatura della pagina = Pagina di file assente, sola lettura; Preparazione della TLB = Vuota; Operazione = Lettura; Offset nella pagina (byte) = 77.",
          "Segui richiesta, confronto TLB e «Cammino nelle tabelle»: osserva Present = 0 dopo due letture PTE.",
          "In «Esame del fault» verifica la regione leggibile; in «Riempimento del frame» annota una lettura dal file verso il frame 10.",
          "Segui «Nuovo tentativo», «Controllo dei diritti» e «Accesso al byte»: confronta il PA uguale e i quattro accessi PTE complessivi."
        ],
        "risultato": "Il PA è ancora 0xA04D, con una lettura del file, un’istruzione ritentata e quattro letture PTE.",
        "ragionamento": "Il primo cammino trova la pagina assente e passa al kernel. Dopo il caricamento il modello ripete la traduzione leggendo altre due voci; l’offset e il frame finale coincidono con il caso residente, mentre il lavoro amministrativo cresce.",
        "attesi": [
          {
            "passo": 7,
            "campo": "Letture di file",
            "valore": "1"
          },
          {
            "passo": 7,
            "campo": "Byte acceduti",
            "valore": "1"
          }
        ]
      }
    ]
  }
};
  Object.assign(SL.guide, percorsi);
  for (const [id, guida] of Object.entries(percorsi)) SL.lezioni[id] = guida.teoria;
})();
