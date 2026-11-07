'use strict';

Object.assign(SL.lezioni, {
  // 1.1 · Il calcolatore e la vita di un programma
  '1.1.1': [
    "Quando un programma in linguaggio C stampa una parola, affida a una funzione di libreria il testo che intende scrivere. Una libreria raccoglie operazioni già pronte, che più programmi possono richiamare. La funzione qui impiegata, puts, riceve una stringa, ossia una successione di byte che rappresenta il testo, e la invia all’uscita standard, aggiungendo un carattere di fine riga.",
    "Un byte è un gruppo di otto cifre binarie. Per trascriverlo in modo compatto si usano due cifre esadecimali, che possono comprendere anche le lettere da A a F. Nella codifica dei caratteri UTF-8, «A» occupa il byte 41 e «è» occupa C3 A8. Per scrivere «Aè» seguita dal fine riga, indicato con LF, occorre dunque la sequenza 41 C3 A8 0A.",
    "La libreria può trattenere quei byte in un’area di memoria temporanea. Quando li consegna al kernel, la parte del sistema operativo che gestisce le risorse della macchina, usa in questa traccia la richiesta write. Il suo primo argomento, 1, identifica l’uscita standard del processo. Dal collegamento associato a quel numero dipende se la stessa parola comparirà sul terminale oppure finirà in un file."
  ],
  '1.1.2': [
    "Per leggere un dato, il processore, indicato anche con la sigla CPU, deve prima localizzarlo. La memoria della figura si può immaginare come una fila di caselle numerate, ciascuna delle quali conserva un byte, ossia otto cifre binarie. Il numero scritto accanto a una casella è il suo indirizzo. Il valore che vi si trova può cambiare pur rimanendo nella stessa posizione.",
    "Il processore conosce l’indirizzo della prima casella e calcola quanto deve allontanarsene. Nella scrittura 0x1000 il prefisso 0x introduce un numero in base sedici. Partendo da questa base, uno spostamento di un byte conduce a 0x1001, la seconda casella, perché la prima occupa già la posizione con spostamento zero.",
    "Dopo aver ricevuto l’indirizzo, la memoria restituisce il contenuto selezionato. A 0x1001 si trova 0x65, che vale 6 × 16 + 5, dunque 101. È questo 101 che entra nel registro, una piccola sede di memorizzazione interna al processore. Le due direzioni della lettura diventano così riconoscibili seguendo prima l’indirizzo e poi il byte che ritorna."
  ],
  '1.1.3': [
    "Nel file hello.c un programmatore può scrivere il nome di una funzione, come puts, e indicare il testo da stampare. Per avviare il programma su una macchina reale occorre tradurre quelle espressioni in istruzioni che il processore riconosca e stabilire come il programma raggiungerà le funzioni di cui si serve. Il comando gcc dirige i programmi che provvedono alle diverse trasformazioni.",
    "Il preprocessore tratta le direttive del sorgente, per esempio quella che include le dichiarazioni di una libreria. Il compilatore traduce il risultato in assembly, una scrittura testuale nella quale le istruzioni della macchina hanno nomi leggibili. L’assemblatore trasforma tali istruzioni in byte e li raccoglie in un file oggetto, che può ancora contenere riferimenti da risolvere.",
    "Con gcc -S hello.c ci si ferma quando è pronto hello.s, che si può leggere come testo. Con gcc -c hello.c si arriva invece a hello.o. Se si richiede l’eseguibile hello, entra in gioco anche il collegatore, che combina il codice con gli oggetti e le librerie necessari. Il file indicato alla fine della traccia è il prodotto conservato dal comando scelto."
  ],
  '1.1.4': [
    "Il nome di un file identifica una voce all’interno di una directory, ossia una raccolta di nomi. Poiché anche una directory può comparire dentro un’altra, per raggiungere un file si può dover attraversare una successione di directory. Un percorso descrive questa successione separando i nomi con il carattere /.",
    "Prima di interpretare il primo nome bisogna stabilire da dove partire. Una barra iniziale designa la radice, il punto da cui ha origine l’intero albero. Quando la barra manca, la ricerca parte dalla directory corrente del processo. In questo albero il nome speciale «..» conduce alla directory che contiene quella raggiunta, mentre «.» indica la directory in cui ci si trova già.",
    "Se la posizione iniziale è /home/lea/src, il percorso ../dati/./riga risale dapprima a /home/lea, entra in dati, conserva quella posizione al punto e raggiunge la voce riga. Cambiando il punto di partenza, le stesse indicazioni possono condurre altrove. Il percorso /tmp/../var/log, che comincia dalla radice, consente di seguire il caso opposto."
  ],
  '1.1.5': [
    "Un file eseguibile conserva le istruzioni di un programma. Ogni volta che quelle istruzioni vengono messe in esecuzione, il sistema operativo deve tener conto della memoria usata, della posizione raggiunta e delle risorse aperte. L’entità a cui appartengono queste informazioni si chiama processo. Il sistema le assegna un numero, il PID, con cui gli altri processi possono identificarla.",
    "La shell, l’interprete davanti al quale si digita un comando, è a sua volta un processo. Qui chiama fork per crearne un secondo, detto figlio. Al termine della chiamata il padre riceve il PID del figlio, mentre il figlio riceve zero. Quest’ultimo valore serve al programma per riconoscere il ramo in cui sta proseguendo.",
    "Se la shell ha PID 700 e il figlio riceve 702, è ancora il processo 702 che esegue hello dopo la chiamata riuscita a execve, la quale sostituisce il programma in esecuzione. Quando hello termina normalmente con codice 3, waitpid permette alla shell di raccogliere lo stato finale. Il numero 702 identifica chi è terminato e il codice 3 riferisce l’esito comunicato da quel programma."
  ],
  '1.1.6': [
    "Il programma hello scrive sempre sullo stesso canale, l’uscita standard, che il sistema identifica con il descrittore 1. Un descrittore è un numero con cui il programma designa una risorsa aperta. Spetta alla shell, l’interprete del comando, preparare il collegamento prima di avviare hello. Per questo si può cambiare il luogo in cui apparirà il saluto agendo sulla riga di comando.",
    "Nel file esito si trovano già la lettera X e il segno di fine riga, dunque due byte. Con ./hello, che chiede di avviare il programma dalla directory corrente, l’uscita resta collegata al terminale. La forma ./hello > esito chiede alla shell di aprire il file azzerandone la lunghezza, così che la nuova scrittura parta dall’inizio.",
    "Il doppio segno >> apre il file per l’aggiunta in coda. Ai due byte già presenti seguono allora le cinque lettere di hello e il nuovo fine riga, per un totale di otto byte. Affiancando i contenuti finali si può risalire al lavoro svolto dalla shell ancor prima che il programma scrivesse il primo carattere."
  ],
  '1.1.7': [
    "Quando un programma produce dati che un altro deve elaborare subito, la shell può collegarli mediante una pipe. La pipe è un canale che il sistema operativo mette a disposizione di due estremità, una alla quale si scrive e una dalla quale si legge. I dati vi transitano come sequenza di byte e il lettore li ritrova nell’ordine in cui sono stati scritti.",
    "Si considerino due processi, uno che emette la lettera B e uno che conta i byte ricevuti. Per metterli in comunicazione, la shell associa l’uscita standard del primo all’estremità di scrittura del canale e l’ingresso standard del secondo all’estremità di lettura. Il contatore può essere già in esecuzione mentre attende che arrivi la lettera.",
    "Se nella sequenza compare un programma che riceve un dato e lo inoltra, conviene considerare separatamente i suoi due collegamenti. Sul lato d’ingresso si cerca chi gli consegna il byte. Sul lato d’uscita si individua chi potrà riceverlo. Nella figura si può così seguire il percorso dello stesso dato anche quando i processi lavorano contemporaneamente."
  ],
  '1.1.8': [
    "Un programma che stampa una riga consegna una sequenza di caratteri a un’uscita. Di solito la riga appare sul terminale. Quando si scrive un comando, si può però scegliere un file come destinazione. A interpretare questa scelta è la shell, il programma che riceve il comando dalla tastiera.",
    "Due segni maggiori consecutivi (>>) chiedono di scrivere in coda. Con un solo segno (>) la shell apre il file per riscriverlo dall’inizio e ne azzera il contenuto precedente. Quando printf emette i primi caratteri, la destinazione è quindi già pronta a riceverli.",
    "Se il file contiene già AB e il programma emette C, l’aggiunta in coda produce ABC. Se insieme a C viene emesso un carattere che manda a capo, la nuova riga può sembrare vuota sullo schermo, sebbene nel file sia stato scritto un byte in più."
  ],
  '1.1.9': [
    "Chi scrive un programma in C può dividere il lavoro fra più file. Per tradurre una chiamata, il compilatore ha bisogno di conoscere il nome della funzione, gli argomenti che accetta e il tipo del risultato. Queste informazioni costituiscono la sua dichiarazione. Il corpo, che descrive le operazioni da eseguire, può trovarsi altrove.",
    "La prima traduzione produce un file oggetto che contiene istruzioni macchina. Per la chiamata a una funzione esterna contiene anche il suo nome, detto simbolo. Il collegatore raccoglie i file oggetto e usa quel nome per associare la chiamata alla funzione corretta nell’eseguibile.",
    "Se un file chiama una funzione chiamata doppio e un altro contiene la sua definizione, la compilazione separata del primo può riuscire. Sarà il collegamento a richiedere il secondo oggetto, dal quale si ricava la destinazione della chiamata."
  ],

  // 1.2 · Rappresentazione binaria ed esadecimale
  '1.2.1': [
    "Un filo collegato a un circuito porta una tensione elettrica che può assumere molti valori. Per trattarla come un bit, cioè una scelta fra zero e uno, il circuito che la riceve deve stabilire quali tensioni riconoscere con sicurezza. La misura si riferisce alla massa, il riferimento al quale qui si assegna la tensione di zero volt.",
    "I valori sulla scala sono espressi in millivolt, millesimi di volt. La soglia VIL indica la massima tensione per cui l’ingresso garantisce uno zero, qui 800 mV. La soglia VIH indica la minima tensione che garantisce un uno, qui 2000 mV. Anche un valore esattamente uguale alla rispettiva soglia appartiene alla fascia garantita.",
    "Un ingresso a 1200 mV cade fra i due limiti. Il ricevitore potrebbe reagire in modi diversi e la specifica lascia aperto l’esito logico. Portando la misura a 2000 mV si entra nella fascia alta. Il passaggio fra le regioni della scala mostra perché, per attribuire un bit a una tensione misurata, occorra conoscere le caratteristiche dell’ingresso."
  ],
  '1.2.2': [
    "Nella scrittura decimale un 1 può valere un’unità, una decina oppure un centinaio secondo la posizione che occupa. Nella scrittura binaria si usa lo stesso principio, con due cifre possibili, 0 e 1, e con un raddoppio del peso a ogni passo verso sinistra. Un bit è una di queste cifre. Otto bit accostati formano un byte.",
    "La numerazione delle posizioni comincia da zero, sul margine destro. I primi quattro pesi sono dunque 1, 2, 4 e 8. Nella parola 00001000 la sola cifra diversa da zero si trova in posizione 3, che pesa 2³, cioè 8. Gli zeri a sinistra conservano la larghezza di otto posizioni prevista dalla memoria.",
    "La stessa parola ammette una trascrizione più breve in base sedici, nella quale ogni gruppo di quattro bit occupa una cifra. Separando 0000 da 1000 si ricava 0x08. Quando nella figura il bit attivo si sposta di una casella verso sinistra, si può prevedere il nuovo valore raddoppiando quello precedente."
  ],
  '1.2.3': [
    "Un numero di 32 bit occupa quattro byte, poiché ogni byte raccoglie otto cifre binarie. La memoria assegna un indirizzo distinto a ciascun byte. Per scrivere il numero occorre quindi stabilire quale delle quattro parti vada al primo indirizzo, quale al secondo e così via. La convenzione che fissa questo ordine permette a chi legge di ricostruire il valore.",
    "Il prefisso 0x segnala la scrittura esadecimale, in cui due cifre bastano per un byte. In 0x12345678, il gruppo 78 contiene le posizioni di peso minore, mentre 12 contiene quelle di peso maggiore. In ordine little-endian, la memoria che parte da 0x1000 contiene, per indirizzi crescenti, 78, 56, 34 e 12.",
    "Nell’ordine big-endian si incontrano 12, 34, 56 e 78. I bit interni a ciascun gruppo conservano la loro disposizione. Per leggere la figura conviene dunque tenere distinti il verso in cui aumentano gli indirizzi e il peso che la convenzione attribuisce al byte selezionato."
  ],
  '1.2.4': [
    "Una cella della memoria può conservare otto bit, cioè otto cifre che ammettono i valori 0 e 1. Quando le usa per rappresentare un intero senza segno, il programma assegna alle posizioni, a partire da destra, i pesi 1, 2, 4, 8 e così via. Somma poi soltanto i pesi delle posizioni in cui legge un uno.",
    "La sequenza 01000001 vale quindi 64 + 1, ossia 65. Se il programma sta trattando un testo, può usare questo numero per consultare la tabella ASCII, una convenzione che associa numeri a caratteri. Alla voce 65 trova la lettera A. La notazione esadecimale 0x41 è un’altra maniera di scrivere gli stessi otto bit.",
    "Si consideri anche il valore 32. Nella tabella dei caratteri indica uno spazio, che durante la stampa separa due parole pur senza lasciare un segno di inchiostro. Confrontando il numero della cella, i pesi e la voce della tabella, si riconosce il lavoro svolto dal programma per passare da una configurazione di bit al suo significato."
  ],
  '1.2.5': [
    "La scrittura esadecimale abbrevia le lunghe successioni di zeri e di uni. Le sue cifre da 0 a 9 hanno il valore abituale, mentre A, B, C, D, E e F indicano i valori da dieci a quindici. Poiché quattro posizioni binarie consentono sedici combinazioni, ciascuna cifra esadecimale si può tradurre in un gruppo di esattamente quattro bit.",
    "Per esempio, in 0x6B la cifra 6 si scompone nei pesi 4 e 2, e quindi si scrive 0110. Per B, che vale undici, occorrono 8, 2 e 1, da cui 1011. Accostando i gruppi nello stesso ordine in cui compaiono le cifre si ottiene 01101011. Lo zero iniziale occupa il posto riservato al peso 8 del primo gruppo.",
    "Nel problema si può applicare il procedimento a ciascuna cifra prima di riunire le due metà. Per verificare la trascrizione basta ripercorrere ogni gruppo da sinistra verso destra con i pesi 8, 4, 2 e 1. La somma deve restituire il valore della cifra dalla quale si è partiti."
  ],
  '1.2.6': [
    "Quando si scrive un numero in base due, ogni cifra può valere zero oppure uno. A partire da destra le posizioni pesano 1, 2, 4 e 8, cosicché con quattro cifre si rappresentano sedici valori. La scrittura esadecimale offre appunto sedici simboli, che vanno da 0 a 9 e poi da A a F.",
    "Nel numero esadecimale la prima cifra a destra ha peso uno, la successiva ha peso sedici. Poiché sedici è la potenza quarta di due, salire di una posizione in esadecimale equivale a salire di quattro posizioni in binario. Ecco perché i gruppi si formano cominciando da destra.",
    "La sequenza 0010 1011 comprende un gruppo che vale due e uno che vale undici. Poiché undici si scrive B, la medesima sequenza prende il nome esadecimale 2B. Uno zero aggiunto a sinistra per completare un gruppo lascia intatti i pesi delle altre cifre."
  ],
  '1.2.7': [
    "Un carattere appartiene al testo che si legge. Un byte è invece un gruppo di otto bit che la memoria può conservare a un indirizzo. Per riservare lo spazio occorrente a una parola serve conoscere la regola con cui i caratteri vengono tradotti in byte.",
    "Una delle regole di codifica più diffuse si chiama UTF-8. Una lettera latina senza accento vi occupa un byte, mentre per molti altri caratteri ne occorrono due o più. In C chi riserva spazio per una stringa deve contare anche il byte di valore zero che ne segna la fine.",
    "La parola «tè», quando la lettera «è» è codificata come un solo carattere, contiene due caratteri e occupa tre byte in UTF-8. Per conservarla come stringa C occorre una quarta cella per lo zero finale, grazie al quale una funzione può individuare la fine del testo."
  ],

  // 1.3 · Codificare testo, immagini e suoni
  '1.3.1': [
    "Se si digita 7 sulla tastiera, un programma che acquisisce testo può ricevere il carattere «7». Per eseguire una moltiplicazione per sette deve prima ricavare il numero indicato da quel segno. La tabella ASCII assegna infatti un codice a ogni cifra, proprio come assegna un codice alle lettere e ai segni di punteggiatura.",
    "Nella tabella, la cifra «0» ha codice 48 e le nove cifre successive occupano posizioni consecutive. La cifra «7» ha dunque codice 55. Poiché il numero che interessa è la distanza dal primo elemento della successione, basta calcolare 55 − 48 per ottenere 7. Questa regola si applica dopo avere accertato che il carattere appartenga all’intervallo delle cifre.",
    "In memoria si incontrerà 0x37, dove 0x introduce la base sedici e 3 × 16 + 7 dà appunto 55. Seguendo prima il byte e poi la sottrazione si possono distinguere i due usi dello stesso ingresso, la conservazione di un testo leggibile e la preparazione di un valore sul quale calcolare."
  ],
  '1.3.2': [
    "Perché una lettera sopravviva al passaggio fra due macchine, occorre che entrambe sappiano identificarla. Unicode assegna numeri ai caratteri e li indica nella forma U+ seguita dal numero in base sedici. UTF-8 prescrive come scrivere questi numeri usando da uno a quattro byte. Ogni byte contiene otto bit, ossia otto cifre binarie.",
    "Per «è» si ricevono i byte C3 A8, qui scritti con due cifre esadecimali ciascuno. In binario C3 si legge 11000011. L’inizio 110 annuncia una sequenza di due byte e lascia il gruppo utile 00011, che vale 3. A8 si legge 10101000. Le prime due cifre, 10, segnalano una continuazione, mentre le ultime sei, 101000, valgono 40.",
    "Per accostare i due gruppi si fa spazio a sei cifre binarie moltiplicando 3 per 64, poi si aggiunge 40. Si ottiene 232, che in esadecimale è E8 e identifica U+00E8. Scegliendo un simbolo che richiede più byte, si può seguire lo stesso accumulatore mentre incorpora altri gruppi di sei bit."
  ],
  '1.3.3': [
    "Per registrare un suono si misura l’ampiezza del segnale a intervalli regolari. Il valore assegnato a una misura prende il nome di campione. Nell’audio PCM lineare considerato qui ogni campione viene scritto usando un numero prestabilito di bit. La frequenza di campionamento indica quanti istanti di misura si susseguono in un secondo per ciascun canale.",
    "Una registrazione stereo ha due canali, uno per il segnale sinistro e uno per il destro. Se ciascun campione usa 16 bit, per conservarlo servono due byte, poiché un byte contiene otto bit. A ogni istante si scrivono quindi quattro byte. Alla frequenza di 48 000 istanti al secondo si ottengono 48 000 × 4, ossia 192 000 byte di campioni.",
    "I tre fattori hanno effetti distinguibili. La frequenza stabilisce quante volte si ripete la misura, il numero di canali stabilisce quanti valori si raccolgono insieme e la profondità in bit stabilisce quanto spazio occupa ciascuno. Il conteggio termina con l’ultimo campione e riguarda un secondo di dati audio contigui."
  ],
  '1.3.4': [
    "Quando il contenuto di un messaggio può avere lunghezza variabile, chi lo invia può scriverne la lunghezza prima del contenuto. Il destinatario sa così dove terminerebbe il campo e dove comincerebbe il successivo. Ogni posizione del messaggio contiene un byte, un gruppo di otto bit. I byte arrivati vengono raccolti in una zona di memoria detta buffer.",
    "Qui il primo byte dichiara quanti byte dovrebbe occupare il campo. Una volta letta la dichiarazione, il cursore vale 1, poiché indica la posizione del primo byte ancora da consumare, contando da zero. Se la lunghezza dichiarata è 6 e dopo il prefisso sono arrivati 5 byte, il calcolo 6 − 5 indica che ne manca uno.",
    "La figura permette di separare la promessa contenuta nel prefisso dalla disponibilità effettiva. Nel caso incompleto il lettore conserva il cursore all’inizio del campo. Se riceve tutti e sei i byte, può invece superare il campo in un solo passo e portare il cursore a 7, posizione dalla quale riprenderebbe una lettura successiva."
  ],
  '1.3.5': [
    "Una sequenza di byte acquista un significato quando si conoscono i confini dei suoi campi. Se il campo da leggere contiene un intero senza segno di sedici bit, servono due byte contigui. Il cursore indica la posizione del primo. Prima della conversione il lettore deve accertarsi che anche il successivo appartenga alla memoria ricevuta.",
    "Nel buffer 41 01 02 FF, dove ogni coppia è un byte in base sedici, le posizioni si contano da zero. Alla posizione 1 comincia la coppia 01 02. Per assegnarle un valore bisogna sapere quale byte ha peso 256. Con la convenzione big-endian quel peso spetta al primo, per cui si ricava 1 × 256 + 2 = 258. Con little-endian spetta al secondo, per cui si ottiene 513.",
    "Una lettura riuscita ha consumato due byte e il cursore passa da 1 a 3 qualunque sia l’ordine scelto. Partendo da 3 resta disponibile soltanto FF. In quel punto la traccia si arresta prima di attribuire un numero al campo incompleto."
  ],
  '1.3.6': [
    "Un testo memorizzato in C occupa una successione di celle di tipo char, ciascuna delle quali contiene qui un byte. Un byte raccoglie otto bit. Con la codifica UTF-8 alcuni caratteri richiedono un solo byte e altri ne richiedono più di uno. Per scegliere la dimensione della memoria occorre quindi contare i byte che compongono il testo.",
    "A questo conteggio si aggiunge una convenzione delle stringhe C. Dopo il contenuto si scrive un byte di valore zero, detto terminatore NUL, che permette alle funzioni di riconoscere dove finisce la stringa. Per conservare la sola lettera A si incontrerebbero quindi le celle 41 e 00, in esadecimale. La seconda stabilisce il confine e rimane presente anche se la stringa viene stampata senza alcun carattere successivo.",
    "Per una lettera accentata si può disegnare una casella per ogni byte della sua codifica e riservarne poi una per il terminatore. Nel leggere lo svolgimento conviene tenere distinti il numero dei caratteri del testo, la lunghezza della loro codifica e il numero di celle richieste alla memoria."
  ],
  '1.3.7': [
    "Un’immagine digitale suddivide la superficie in punti chiamati pixel. Il colore di ciascun punto nasce da tre intensità, una per il rosso, una per il verde e una per il blu. Quando le intensità sono scritte consecutivamente in memoria, l’indirizzo di una componente dipende tanto dalla posizione del punto quanto dal colore cercato.",
    "Nella sigla RGB24 le tre lettere indicano i colori e il numero indica i bit complessivi di un pixel. Dato che ogni intensità ne occupa otto, per ciascuna serve un byte. Nella disposizione qui scelta le righe si susseguono senza spazi. Un salto di riga equivale dunque a tanti gruppi di tre byte quanti sono i pixel in larghezza.",
    "Con quattro pixel per riga si attraversano dodici byte prima di raggiungere la seconda riga. Il verde del primo pixel di quella riga si trova un byte oltre il suo inizio, perché il rosso lo precede. Il conteggio degli spostamenti comincia da zero."
  ],
  '1.3.8': [
    "La memoria custodisce sequenze di bit che un programma può trattare come lettere oppure come numeri. Per interpretare una coppia di byte occorre quindi sapere quale formato abbia scelto chi ha scritto i dati. Il prefisso 0x introduce cifre esadecimali, ciascuna delle quali rappresenta quattro bit.",
    "Per i caratteri il codice ASCII associa un numero a un simbolo. Per un intero di due byte si usano invece i pesi 1 e 256. La convenzione little-endian assegna peso uno al byte che si incontra per primo in memoria, mentre la convenzione big-endian attribuisce a quel byte il peso maggiore.",
    "I byte 0x41 e 0x42, in quest’ordine, corrispondono alle lettere A e B nel codice ASCII. Se rappresentano un intero il cui byte meno significativo viene per primo, il valore è 0x4241. Cambiando la convenzione sull’ordine dei byte si ottiene 0x4142, sebbene le celle di memoria conservino esattamente lo stesso contenuto."
  ],

  // 1.4 · Interi con segno e complemento a due
  '1.4.1': [
    "Una fila di otto cifre binarie offre 256 configurazioni. Per rappresentare soltanto quantità positive o nulle, si attribuiscono alle cifre, partendo da destra, i pesi 1, 2, 4, 8, 16, 32, 64 e 128. Per comprendere anche i numeri negativi occorre distribuire altrimenti le stesse 256 possibilità. Il complemento a due conserva i primi sette pesi e assegna −128 alla posizione più a sinistra.",
    "Si prendano i sette bit inferiori che insieme valgono 5. Con il bit alto spento la parola è 00000101 e vale 5 in entrambe le letture. Accendendo quel bit si ottiene 10000101. Nella lettura senza segno si sommano 128 e 5, ottenendo 133. Nella lettura con segno si sommano −128 e 5, ottenendo −123.",
    "La distanza di 256 fra i due risultati dipende interamente dal peso attribuito alla posizione 7. La parola conservata nella cella è identica. È l’interpretazione prevista per quel dato a stabilire se il bit più alto contribuisca in senso positivo oppure negativo."
  ],
  '1.4.2': [
    "La parte del processore che esegue le operazioni aritmetiche, detta ALU, dispone qui di otto posizioni binarie per scrivere il risultato. Se il calcolo richiede una posizione ulteriore, nella destinazione rimangono gli otto bit inferiori. Per informare il programma su quanto è accaduto, l’ALU aggiorna anche alcuni bit di stato, detti flag.",
    "Il flag CF riguarda la lettura senza segno e segnala il riporto oltre 255 in una somma oppure il prestito quando si sottrae un byte più grande da uno più piccolo. Il flag OF riguarda gli stessi byte interpretati in complemento a due, dove i valori vanno da −128 a 127. Si accende quando il risultato esatto di quel calcolo esce dall’intervallo.",
    "Sommando 127 e 1 si ottiene matematicamente 128. Per un intero senza segno il risultato entra nel byte e CF vale zero. Per un intero con segno 128 supera il massimo, quindi OF vale uno. La configurazione scritta, 10000000, si può leggere in entrambi i modi perché la posizione più alta pesa 128 oppure −128 secondo la convenzione adottata."
  ],
  '1.4.3': [
    "Nel linguaggio C il tipo di una variabile stabilisce quali valori possa rappresentare e quali conversioni si applichino quando compare in un’espressione. Nel modello un int rappresenta valori anche negativi, mentre un unsigned int rappresenta soltanto valori da zero in su. Entrambi occupano 32 bit e l’intervallo senza segno termina a 2³² − 1.",
    "Per i due tipi mostrati, che sono le versioni con e senza segno dello stesso tipo intero, il linguaggio stabilisce che il confronto avvenga fra due unsigned int. Il primo operando viene perciò convertito. Un valore già compreso nell’intervallo conserva il proprio valore numerico. Un negativo viene sostituito dal corrispondente residuo modulo 2³², cioè dal valore nell’intervallo che si ottiene aggiungendo o sottraendo multipli di 2³².",
    "Nell’espressione −1 < 1u il suffisso u designa la costante senza segno. Il primo operando diventa 4 294 967 295, perciò il confronto restituisce 0, il valore che in C indica falso. Nella figura la riga della conversione permette di riconoscere in quale momento il confronto del programma si discosta da quello che si farebbe leggendo −1 e 1 sulla retta dei numeri."
  ],
  '1.4.4': [
    "Una moltiplicazione può produrre un valore troppo grande per la cella che dovrà contenerlo. Un byte ha otto posizioni binarie e consente di scrivere, senza segno, gli interi da 0 a 255. Se si conservano soltanto quelle posizioni, ogni gruppo completo di 256 unità scompare dalla scrittura e rimane il resto della divisione per 256.",
    "Per verificare in anticipo se A × B entra nella cella, quando B è positivo si può dividere il massimo 255 per B e prendere la parte intera del quoziente. Con B = 16, poiché 255 diviso 16 dà 15 con resto 15, il massimo A ammesso è 15. Il calcolo 15 × 16 dà 240, mentre 16 × 16 dà 256, la prima unità che richiederebbe un nono bit.",
    "Nel secondo caso il residuo mostrato è zero, benché il prodotto esatto sia positivo. Affiancare soglia, prodotto e residuo permette di capire perché la decisione vada presa sul valore che si vuole conservare. Se B vale zero, il prodotto vale zero per qualunque A e la divisione preliminare diventa superflua."
  ],
  '1.4.5': [
    "Quando un registro più largo deve accogliere un intero con segno, occorre costruire una nuova sequenza di bit che rappresenti lo stesso numero. Un registro è una piccola memoria interna al processore. Nel complemento a due la posizione più alta ha peso negativo, mentre le altre hanno i consueti pesi positivi, che raddoppiano andando verso sinistra.",
    "Si consideri −3 su otto bit. La configurazione 11111101, che senza segno varrebbe 253, rappresenta 253 − 256 = −3. Volendola portare a sedici bit, si copia nelle otto nuove posizioni la cifra del segno, in questo caso 1. Si ottiene 11111111 11111101, che senza segno varrebbe 65 533 e nella lettura con segno vale 65 533 − 65 536 = −3.",
    "Se il bit iniziale del segno è zero, gli zeri aggiunti a sinistra lasciano intatta la somma dei pesi. La verifica nello svolgimento consiste perciò nel leggere la parola iniziale alla sua larghezza e quella estesa alla nuova larghezza, confrontando i due valori con segno."
  ],
  '1.4.6': [
    "Un contatore di otto bit dispone di 256 configurazioni. Se si aumenta di uno la configurazione composta da otto cifre uno, nel contatore rimangono otto zeri. Il complemento a due sfrutta questo comportamento per rappresentare anche gli interi negativi.",
    "Al codice di zero si arriva incrementando quello di −1, che contiene otto uno. Proseguendo a ritroso si ottengono gli altri numeri negativi. Per un intero negativo rappresentabile in otto bit, aggiungere 256 dà il numero senza segno i cui bit coincidono con il codice cercato.",
    "Il codice di −2 è 11111110, che letto senza segno vale 254. Se vi si aggiunge 2, la somma ordinaria è 256 e gli otto bit conservati valgono zero. Questa prova permette di controllare sia il segno sia la larghezza della parola che si è costruita."
  ],
  '1.4.7': [
    "Il registro è una piccola memoria interna al processore. Quando dispone di otto posizioni binarie, conserva soltanto gli otto bit inferiori di ogni somma. Il circuito che somma, chiamato unità aritmetico-logica, registra alcuni dettagli dell’operazione in bit di stato detti flag.",
    "Nell’architettura x86, CF registra il riporto che esce dall’ultima posizione in un’addizione, oppure il prestito in una sottrazione. OF segnala invece se la somma o la differenza matematica, calcolata leggendo gli operandi con segno, esce dall’intervallo da −128 a 127.",
    "Se si sommano 127 e 1, nel registro compare 10000000. Il risultato senza segno, 128, rientra in un byte. Letta con segno, la stessa configurazione designa −128, mentre la somma matematica era positiva. Da questa differenza si capisce perché il flag dello sconfinamento con segno possa accendersi anche quando il riporto è zero."
  ],

  // 1.5 · Circuiti booleani e calcolo a livello di bit
  '1.5.1': [
    "Una porta logica riceve segnali ai quali si assegnano i due valori 0 e 1. Quando gli ingressi si sono stabilizzati, la porta produce il valore prescritto dalla sua funzione. Con due ingressi, chiamati A e B, si hanno quattro casi possibili. La tabella di verità li elenca e scrive accanto a ciascuno l’uscita corrispondente.",
    "AND richiede che entrambi gli ingressi valgano uno. Per OR basta che valga uno almeno uno dei due. XOR vale uno quando i due ingressi differiscono, quindi con A = 0 e B = 1 dà uno e con A = 1 e B = 1 dà zero. NAND inverte il risultato di AND e NOR inverte quello di OR, scambiando ogni zero con un uno e viceversa.",
    "Nella tabella le coppie sono ordinate come 00, 01, 10 e 11. Contando le righe da zero, la coppia 10 occupa la riga 2 perché A pesa due posizioni e B una. Si può così scegliere dapprima la riga mediante gli ingressi e prevedere poi la cifra in uscita applicando la definizione della porta."
  ],
  '1.5.2': [
    "Supponiamo di conoscere il comportamento desiderato di un circuito attraverso una tabella che, per ogni coppia di ingressi A e B, prescrive se l’uscita debba valere zero oppure uno. Per costruire l’espressione del circuito si può cercare una condizione che riconosca, da sola, una delle righe in cui l’uscita deve valere uno.",
    "Per riconoscere la coppia A = 0 e B = 1 si inverte A, scrivendo ¬A. Si richiedono poi insieme ¬A e B mediante l’operazione AND, indicata dal punto. Il termine ¬A·B vale uno soltanto per quella coppia. Un termine che usa tutti gli ingressi in forma diretta o invertita e riconosce una sola riga si chiama mintermine.",
    "Se devono attivare l’uscita sia 01 sia 10, si aggiunge il termine A·¬B e si collegano i due termini con OR. Il segno + fra i prodotti esprime qui l’alternativa logica. Seguendo nella figura le righe scelte si può verificare a quale riga appartiene ogni prodotto e perché basta che ne sia vero uno perché l’uscita si attivi."
  ],
  '1.5.3': [
    "In un programma C la parola «e» può indicare due operazioni, secondo che si debbano confrontare singole posizioni binarie oppure intere condizioni. Un operando è semplicemente uno dei valori sui quali agisce un’operazione. Il segno & mette in corrispondenza le cifre binarie dei due operandi e scrive uno nelle posizioni dove entrambi hanno uno.",
    "Se A vale 2 e B vale 4, le rispettive scritture su quattro bit sono 0010 e 0100. I due uno cadono in colonne diverse, quindi A & B produce 0000. Il doppio segno && considera invece ciascun operando come condizione. In C zero è falso e ogni intero diverso da zero è vero. Poiché entrambi i valori sono diversi da zero, A && B restituisce 1.",
    "Con A uguale a zero, la prima condizione è già falsa. La regola di && prescrive allora di saltare la valutazione della seconda, poiché l’esito è già determinato. Nella figura si distinguono così l’accostamento verticale dei bit e la successione dei due controlli logici."
  ],
  '1.5.4': [
    "Si colleghi un segnale A a una porta OR lungo due percorsi. Il primo trasporta A direttamente, mentre un invertitore lungo il secondo scambia uno con zero e zero con uno. A segnali stabili, una delle due entrate della porta vale sempre uno, quindi anche l’uscita F vale uno. Durante un cambiamento bisogna però considerare il tempo necessario a ciascun segnale per raggiungere la porta.",
    "All’istante iniziale A passa da uno a zero. Se il ramo diretto impiega 2 nanosecondi e quello invertito ne impiega 5, dopo 2 nanosecondi al primo ingresso è già arrivato lo zero. Il secondo ingresso conserva ancora il vecchio zero. La porta può tornare a produrre uno quando, al tempo 5, giunge il nuovo segnale invertito.",
    "L’intervallo basso dura dunque 5 − 2 = 3 nanosecondi, dove un nanosecondo è un miliardesimo di secondo. Per leggere il diagramma temporale si confrontano le due transizioni sulla stessa scala. La porta OR è qui considerata istantanea, perciò il suo tracciato riflette subito ogni variazione dei rami."
  ],
  '1.5.5': [
    "Nella somma in colonna un riporto nasce quando le cifre della colonna contengono abbastanza unità da formarne una nella posizione successiva. In base due ne bastano due. Il circuito che tratta una colonna riceve quindi i due bit da sommare, A e B, e il riporto proveniente dalla colonna immediatamente a destra, chiamato Cin.",
    "Con A = 1, B = 1 e Cin = 0 il totale locale è due, scritto 10 in binario. La cifra di peso uno, S, vale zero e resta nella colonna corrente. La cifra di peso due, Cout, vale uno e passa alla colonna successiva. Se alla stessa coppia arriva anche un riporto, il totale è tre e si scrive 11, dunque entrambe le uscite valgono uno.",
    "Nel disegno G indica che la coppia A, B genera già un riporto perché entrambi valgono uno. P indica che differiscono e quindi un riporto entrante passerebbe oltre. L’operazione XOR, che vale uno per ingressi diversi, serve anche a trovare S. Il controllo numerico finale riunisce i due risultati assegnando a Cout il peso due."
  ],
  '1.5.6': [
    "In un dispositivo più condizioni possono essere raccolte in un unico byte di stato. Ogni posizione vale uno quando la condizione corrispondente è presente. Un programma che debba controllarne soltanto alcune prepara una seconda configurazione di otto bit, la maschera, nella quale scrive uno nelle posizioni da esaminare e zero nelle altre.",
    "L’operazione AND confronta i bit che si fronteggiano e conserva un uno soltanto dove lo trova su entrambi i lati. Con stato 5, cioè 00000101, e maschera 12, cioè 00001100, sopravvive soltanto 00000100. La maschera richiedeva anche la posizione di peso otto. Perciò la presenza del bit di peso quattro, presa da sola, lascia insoddisfatta la richiesta.",
    "Per stabilire se siano presenti tutte le condizioni richieste si confronta l’intersezione con la maschera intera. Le posizioni in cui differiscono indicano le condizioni mancanti. Anche una maschera di otto zeri ha un significato preciso. Poiché l’insieme delle condizioni richieste è vuoto, il confronto riesce per qualunque stato."
  ],
  '1.5.7': [
    "Un byte può contenere due informazioni distinte, ciascuna affidata a quattro degli otto bit disponibili. Poiché una sola cifra esadecimale rappresenta quattro bit, in una scrittura come 0x4E la cifra 4 identifica la metà alta ed E la metà bassa. Per aggiornare la seconda senza danneggiare la prima occorre isolare le posizioni interessate.",
    "Si immagini di voler scrivere 9 nella metà bassa di 0x4E. La maschera 0xF0 ha quattro uno nella metà alta e quattro zeri nella metà bassa. Con AND si conservano i bit per i quali la maschera vale uno e si ottiene 0x40. Si accosta poi il nuovo campo 0x09 mediante OR, che accende ogni posizione in cui uno dei due operandi ha un uno. Il byte risultante è 0x49.",
    "L’azzeramento preliminare permette di sostituire anche uno con zero, operazione che il solo OR lascerebbe incompiuta. Nel problema la verifica può quindi procedere metà per metà, confrontando le cifre alte prima e dopo e leggendo separatamente il valore entrato nelle quattro posizioni basse."
  ],
  '1.5.8': [
    "Un solo byte può contenere diverse impostazioni. Ciascuna occupa determinate posizioni, che formano un campo. Per modificarne una conservando le altre si prepara una maschera, ossia una parola binaria i cui uno individuano le posizioni su cui operare.",
    "Per liberare un campo si applica AND con una maschera che ha zeri nella zona da riscrivere e uno altrove. Dopo questa operazione, OR con il valore nuovo, già spostato nelle posizioni giuste, può riempire il campo senza modificare i bit vicini.",
    "Per sostituire i bit 3 e 2, numerati da destra a partire da zero, la maschera è 00001100. L’operazione AND con 11110011 libera quei due posti. Se il nuovo campo vale 01, la parola 00000100 lo inserisce mediante OR e lascia alle altre posizioni il valore che avevano prima."
  ],
  '1.5.9': [
    "In un circuito digitale si rappresentano due livelli di segnale con 0 e 1. Una porta logica riceve uno o più di questi segnali e ne produce uno secondo una regola fissa. Se l’uscita di una porta arriva all’ingresso di un’altra, il filo che le unisce ha un valore proprio, che si può annotare per seguire il calcolo.",
    "La porta AND vale uno se entrambi gli ingressi valgono uno. Una NAND ne rovescia l’uscita e dà quindi zero soltanto in quel caso. La porta XOR, che riceve il segnale prodotto dalla NAND e un altro ingresso, vale uno quando i due segnali che le arrivano sono diversi.",
    "Con entrambi gli ingressi a 1, la prima porta NAND produce 0. Se alla seconda porta XOR arrivano quel valore e un terzo ingresso a 1, l’uscita finale vale 1. Variando il terzo ingresso cambia soltanto la seconda operazione."
  ],

  // 1.6 · Numeri frazionari e virgola mobile IEEE 754
  '1.6.1': [
    "Anche dopo la virgola il valore di una cifra dipende dalla posizione. Come nella scrittura decimale si incontrano decimi, centesimi e millesimi, nella scrittura binaria si incontrano metà, quarti e ottavi. Per rappresentare 5/8 bisogna scegliere quali di questi pesi sommare. Una metà vale quattro ottavi, quindi per arrivare a cinque ottavi basta aggiungere un ottavo. Le tre cifre sono perciò 101.",
    "Il raddoppio della frazione consente di ottenere le stesse cifre in ordine. Raddoppiando 5/8 si ricava 10/8, cioè un intero più 2/8. L’intero uno diventa la prima cifra. Raddoppiando il resto 2/8 si ottiene 4/8, la cui parte intera zero diventa la seconda cifra. L’ultimo raddoppio porta a 8/8 e produce la cifra uno.",
    "La figura mantiene ogni resto in ottavi, così i passaggi si possono controllare senza approssimazioni. Leggendo 0,101 da sinistra a destra si ritrova infatti 1/2 + 0/4 + 1/8. Il denominatore otto garantisce che per tutti i numeratori proposti bastino queste tre posizioni."
  ],
  '1.6.2': [
    "Per rappresentare grandezze molto diverse, un calcolatore può conservare separatamente le cifre significative di un numero e il fattore che ne stabilisce la scala. Il formato binary32 dello standard IEEE 754 riserva 32 bit a questo scopo. Il primo, S, indica il segno. I successivi otto formano E, l’esponente codificato, e gli ultimi ventitré formano F, il campo della frazione.",
    "Per un numero normale la parte significativa, detta significanda, vale 1 + F/2²³. L’uno iniziale è sottinteso. Per ottenere l’esponente effettivo si sottrae 127 da E. Nella parola 0x3F800000 si leggono S = 0, E = 127 e F = 0. Il segno è positivo e il numero vale 1 × 2⁰, quindi 1.",
    "I due valori estremi del campo E richiedono regole proprie. Con E uguale a zero compare soltanto la parte frazionaria F/2²³ e la scala è 2⁻¹²⁶. Se F vale uno, il prodotto è 2⁻¹⁴⁹, il più piccolo numero subnormale positivo. Se F vale zero, resta lo zero con il segno prescritto da S. Con E uguale a 255, F uguale a zero indica un infinito e F diverso da zero indica NaN, la codifica di un risultato privo di valore numerico. Si legge quindi la classe prima di applicare una formula."
  ],
  '1.6.3': [
    "Il calcolatore conserva una misura usando un numero finito di cifre. Ne segue che, anche quando due numeri reali sono vicinissimi, può esserci spazio per rappresentarne soltanto uno. Per misurare questa granularità si prende un valore registrabile, si cerca il più piccolo valore registrabile che lo supera, detto successore, e si calcola la loro distanza.",
    "Nel formato a 32 bit chiamato binary32 un numero positivo normale si scrive come una parte significativa che comincia con 1, seguita da ventitré cifre binarie frazionarie, moltiplicata per una potenza di due. Attorno a 1 il contributo dell’ultima cifra vale 2⁻²³. Attorno a 2, sul lato dei valori più grandi, la medesima cifra viene moltiplicata per due e vale 2⁻²².",
    "Con esponente 23 la potenza iniziale è 8 388 608. Aggiungendo uno all’ultima posizione della parola codificata si raggiunge 8 388 609. Con esponente 24 il passo verso destra è già due. La figura mostra così perché uno stesso numero di cifre, quando serve a rappresentare quantità più grandi, separi valori consecutivi di una distanza maggiore."
  ],
  '1.6.4': [
    "Per sommare due misure scritte con potenze di due diverse occorre prima riferire le cifre allo stesso peso. Nella somma 1 + 2⁻ᵏ si sceglie come riferimento l’unità. Se k vale 2, il contributo del secondo addendo cade due posizioni a destra della virgola binaria. Si ottiene 1,01 in base due, cioè 1,25 in decimale.",
    "Il formato binary32 dispone, vicino a 1, di ventitré posizioni frazionarie utilizzabili. Con k = 23 il secondo addendo accende proprio l’ultima di quelle posizioni e porta al successore di 1. Con k = 24 la somma matematica cade invece a metà strada fra 1 e il successore. Per scegliere fra i due si applica la regola di arrotondamento al più vicino, con preferenza, a parità di distanza, per l’ultima cifra pari.",
    "In binario l’unica cifra pari è zero. Poiché la scrittura di 1 termina con zero e quella del successore con uno, in questo caso si conserva 1. Nella figura i due valori da confrontare sono la somma esatta dopo l’allineamento e il numero che può essere effettivamente registrato."
  ],
  '1.6.5': [
    "Una parola in virgola mobile può descrivere una misura ordinaria oppure una situazione per cui il formato prevede una codifica particolare. Nel formato binary32 ogni parola ha 32 bit, raggruppati in un bit di segno, otto bit di esponente e ventitré bit di frazione. Il termine campo indica uno di questi gruppi, al quale il formato attribuisce un compito preciso.",
    "Per capire perché si esaminino i campi in un ordine stabilito si possono confrontare due parole con esponente codificato zero e segno positivo. Se anche la frazione è zero, la prima parola indica +0. Se la frazione vale uno, la seconda indica il più piccolo numero positivo subnormale. A parità di esponente cambia dunque la classe alla quale appartiene la parola.",
    "All’altro estremo, quando tutti e otto i bit dell’esponente sono accesi, la frazione distingue l’infinito dal codice NaN. L’infinito ha tutti i bit della frazione a zero. NaN segnala un risultato privo di valore numerico, come quello che si ottiene dividendo zero per zero nell’aritmetica in virgola mobile con le eccezioni disabilitate. Il confronto fra le due parole richiede dunque di ispezionare anche la frazione."
  ],
  '1.6.6': [
    "Una misura in virgola mobile conserva un numero finito di cifre significative e un esponente che ne stabilisce la scala. Aumentando la grandezza dei valori, aumenta anche la distanza tra due numeri consecutivi che si possono memorizzare. Di conseguenza la somma matematica e il numero scritto nel registro possono differire.",
    "Nel formato binary32 un numero normale ha ventiquattro cifre binarie significative, contando anche quella iniziale. Fra 2²⁴ incluso e 2²⁵ escluso si può memorizzare un intero ogni due. Per scrivere un intero dispari nell’intervallo occorre scegliere fra i due vicini.",
    "Per visualizzare un pareggio, si immagini una scala le cui tacche siano 8, 10 e 12. Il numero 11 cade alla stessa distanza da 10 e 12. Nella modalità di arrotondamento al più vicino con pareggio al pari, decide l’ultimo bit conservato della significanda. La scelta si fonda su quel bit anche quando entrambe le tacche sono numeri interi pari."
  ],
  '1.6.7': [
    "Una scrittura come 1,5 × 2³ separa le cifre significative dalla scala. Il formato binary32 applica la stessa idea in base due e distribuisce l’informazione su 32 bit. Per i numeri normali, cioè quelli ai quali si applica l’uno iniziale implicito, l’esponente reale si ottiene sottraendo 127 dal valore del campo esponente.",
    "Nella significanda binaria di un numero normale, la cifra che precede la virgola è sempre uno. Il formato la sottintende e riserva il campo frazione alle cifre successive. Rimane un bit separato per il segno, che si applica dopo aver ricostruito la grandezza della misura.",
    "Un campo esponente pari a 129 dà quindi una scala di 2². Se la significanda è 1,1 in base due, il suo valore è uno più un mezzo. Con segno positivo si ricostruisce così 1,5 × 4 = 6. Le prime cifre dopo la virgola binaria hanno peso un mezzo, un quarto e un ottavo."
  ],

  // 1.7 · Casi integrati: dai byte al comportamento
  '1.7.1': [
    "Un sensore deve inviare il proprio nome insieme a due misure. Perché il destinatario possa distinguere queste informazioni in una successione di byte, mittente e lettore seguono uno stesso formato, qui chiamato TLM1. Un insieme di informazioni così organizzato prende il nome di record. Ogni sua parte, detta campo, occupa un intervallo preciso della sequenza.",
    "La firma iniziale, composta dai quattro caratteri TLM1, permette di riconoscere il formato. Seguono un byte di indicatori e un byte che dice quanto è lungo il nome. Nel record proposto il nome «Aè» usa tre byte perché la codifica del testo, UTF-8, ne assegna uno ad A e due a è. Alla fine del nome sono stati quindi consumati 4 + 1 + 1 + 3 = 9 byte.",
    "La temperatura occupa i due byte successivi e la tensione gli ultimi quattro. Se alla ricezione sono disponibili quattordici byte, dopo la temperatura ne restano tre. Il lettore si ferma all’inizio della tensione perché occorrerebbe l’intero campo per interpretarla. Nella striscia il cursore segna sempre la prima posizione che attende ancora di essere consumata."
  ],
  '1.7.2': [
    "Due sensori possono inviare le stesse misure e produrre messaggi di lunghezza diversa se i loro nomi occupano spazi diversi. Il formato del messaggio, TLM1, dedica sei byte all’intestazione iniziale. Nell’ultimo di questi scrive la lunghezza del nome in byte. L’offset di un campo è il numero di byte che lo precedono, contando a partire dall’inizio del messaggio.",
    "Per il nome «Z» basta un byte, dunque la temperatura comincia all’offset 7. «Aè» ne richiede tre nella codifica UTF-8, per cui la temperatura comincia all’offset 9. La misura occupa due byte e rappresenta un numero intero di centesimi di grado. Il primo byte ha il peso maggiore, come stabilisce l’ordine big-endian. Con i byte 00 64 si legge 100 in decimale, quindi 1 °C.",
    "La tensione segue immediatamente quei due byte e occupa quattro posizioni. Qui l’ordine è little-endian, che pone per primo il byte di peso minore. Per esempio, i byte 00 00 80 3F danno la parola 0x3F800000. Il formato in virgola mobile binary32 ne distingue segno, cifre significative e scala, che insieme indicano 1 volt. Cambiando il nome si spostano entrambe le misure, ciascuna delle quali conserva la propria regola di lettura."
  ],
  '1.7.3': [
    "Un’immagine digitale si può descrivere come una griglia di pixel, le sue unità elementari. Nel formato RGBA ogni pixel conserva quattro componenti, rosso, verde, blu e alfa, che regola l’opacità. Qui ogni componente occupa un byte, perciò a una riga larga 128 pixel servono 512 byte. L’immagine intera contiene tante righe quante ne indica l’altezza.",
    "Con larghezza e altezza pari a 2048, il numero di pixel è 4 194 304. Per conservarli servono 16 777 216 byte, cioè 16 MiB, dove un mebibyte equivale a 1 048 576 byte. La quantità entra in un intero senza segno di 32 bit. Se però la memoria assegnata è limitata a 8 MiB, l’allocazione, ossia la riserva di spazio, va rifiutata.",
    "Con lati entrambi pari a 65 536, anche la capacità del contatore diventa decisiva. Il solo numero di pixel raggiunge 2³² e i byte richiesti sono quattro volte tanti. Conservando soltanto i 32 bit inferiori del prodotto si leggerebbe zero. Il calcolo ampio della figura consente di confrontare il fabbisogno reale sia con la capacità del contatore sia con la memoria disponibile."
  ],
  '1.7.4': [
    "Per decidere se autorizzare una modifica, il programma riceve un byte, ossia otto bit, ai quali il formato assegna significati diversi. Le posizioni si contano da destra a partire da zero. Alla posizione 1 il bit W indica il permesso di scrittura, alla posizione 3 il bit O indica il proprietario e alla posizione 4 il bit A identifica un amministratore.",
    "La decisione richiede dapprima una parola valida. Le posizioni 5, 6 e 7 sono riservate e devono valere zero. Per isolarle si usa la maschera 11100000, che in esadecimale si scrive 0xE0. L’operazione AND copia dal byte solo i bit che incontrano un uno nella maschera. Un risultato diverso da zero segnala quindi la presenza di almeno un bit riservato acceso.",
    "Superato questo esame, la regola richiede W insieme ad almeno uno tra O e A. Con W e A attivi e gli altri bit spenti si ottiene 00010010, che permette la modifica. Accendendo anche il bit 7 si conserva la combinazione di ruolo e permesso, e la richiesta si arresta già al controllo di validità. I due controlli nella traccia spiegano a quale decisione appartenga ciascun bit."
  ],
  '1.7.5': [
    "Per tenere un conto in euro si può conservare ogni importo come un numero intero di centesimi. Dieci centesimi hanno allora la rappresentazione esatta 10 e ogni nuova quota si aggiunge con un’addizione intera. Un’altra possibilità è conservare l’importo direttamente in euro usando binary64, un formato in virgola mobile che dispone di un numero finito di cifre binarie.",
    "La quota di 0,10 euro si scrive come la frazione 1/10. Per esprimere esattamente una frazione mediante un numero finito di cifre dopo la virgola binaria, il suo denominatore ridotto deve essere una potenza di due. Poiché 10 contiene anche il fattore 5, il formato sceglie una rappresentazione vicina. A ogni somma il risultato deve ancora rientrare nelle cifre disponibili.",
    "Sommando dieci quote da dieci centesimi, la colonna degli interi raggiunge 100, ossia 1 euro. Nell’altra colonna la stampa a diciassette cifre rende visibile un valore appena inferiore a 1. Con quote da venticinque centesimi si parte invece dalla frazione 1/4, che in binario termina dopo due cifre. Lo scarto finale si misura rispetto al totale dei centesimi convertito in euro con una sola divisione, così da poter confrontare i due percorsi di calcolo."
  ],
  '1.7.6': [
    "Un programma che legga dal proprio ingresso standard può ricevere dati digitati da una persona oppure byte conservati in un file. La shell, cioè l’interprete dei comandi, prepara la sorgente prima di avviare il programma. Nella forma leggi < file il segno < le chiede di aprire file per la lettura e di collegarlo all’ingresso identificato dal descrittore 0.",
    "Una volta avviato, leggi cerca nei primi quattro byte la firma TLM1, una sequenza convenuta per riconoscere il formato. La lettera T corrisponde al byte esadecimale 54. Se al suo posto si riceve X, il cui codice è 58, la lettura è riuscita e il confronto delle firme identifica una sequenza diversa da quella prescritta.",
    "Un file vuoto si può aprire regolarmente. La prima lettura restituisce zero byte, indicando che si è già alla fine del file. Se invece manca il file stesso, la shell riceve durante l’apertura l’errore ENOENT, che segnala l’assenza del nome cercato. La traccia si ferma così prima che il lettore abbia occasione di esaminare una firma."
  ],
  '1.7.7': [
    "Quando una misura attraversa un collegamento, il sensore deve trasformare un nome e alcuni numeri in una sequenza di byte. Questa trasformazione si chiama codifica. Al ricevimento si compie l’operazione inversa, detta decodifica. Una prova di andata e ritorno confronta i valori riletti con quelli immessi, così da verificare che il formato conservi l’informazione voluta.",
    "TLM1 specifica la firma iniziale che identifica il formato, un byte di indicatori, la lunghezza del nome e il nome stesso, scritto con la codifica di testo UTF-8. Il nome può occupare fino a sedici byte e nel byte degli indicatori solo le prime due posizioni a partire da destra sono utilizzabili. Seguono due byte per la temperatura e quattro per la tensione. Se il nome è «Z», i byte previsti sono tredici, cioè sei di intestazione, uno di nome e sei di misure. Eliminando l’ultimo byte se ne ricevono dodici e il lettore può individuare il troncamento prima di interpretare la tensione.",
    "Anche un messaggio lungo quanto previsto può essere inaccettabile. Se si accende il bit 7 degli indicatori, il lettore riconosce l’uso di una posizione riservata. Una tensione negativa è invece un numero leggibile che esce dal dominio ammesso per la misura. La parola che identifica il primo controllo fallito permette di risalire alla proprietà che la copia alterata ha perso."
  ],
  '1.7.8': [
    "Un sensore può trasmettere in un unico messaggio il proprio nome e due misure. Il ricevitore deve stabilire dove termina un campo e dove comincia il successivo. Nel formato TLM1 il nome occupa uno spazio variabile, la cui lunghezza in byte è registrata nella parte iniziale del messaggio.",
    "L’intestazione occupa sei byte. Subito dopo vengono il nome, la temperatura su due byte e la tensione su quattro. Nell’intestazione si conta la lunghezza del nome già codificato, sicché una lettera che occupa più byte sposta l’inizio della temperatura di altrettante posizioni.",
    "Se il nome occupa quattro byte, il primo byte della temperatura dista dieci posizioni dall’inizio. Per leggere la misura, che usa due byte, si assegna peso 256 al primo e peso uno al secondo. La tensione comincia due posizioni dopo e segue l’ordine inverso per i propri byte."
  ],
  '1.7.9': [
    "Durante una copia si può perdere l’ultimo byte di un messaggio oppure alterarne uno all’interno. Il ricevitore dispone di due indizi diversi per riconoscere questi casi. Conosce la lunghezza dichiarata per il nome e conosce le posizioni che possono essere usate per i segnali di stato, detti flag.",
    "Ai sei byte iniziali si aggiungono quelli del nome, due per la temperatura e quattro per la tensione. Il numero atteso è quindi dodici più la lunghezza del nome. Per verificare i flag occorre invece esaminare le singole cifre binarie, poiché il formato ammette l’uso delle sole due posizioni più a destra.",
    "Per un nome di tre byte il record completo ne contiene quindici. Se ne arrivano quattordici manca una parte del messaggio. Se ne arrivano quindici e il byte dei flag vale 00000100, è invece attiva una posizione riservata. La dimensione da sola avrebbe lasciato passare questa seconda alterazione."
  ],

  'modulo-1': [
    "Un sensore ha misurato −1,23 °C e una tensione di 10 volt. Perché il computer che riceve la misura possa attribuirla al sensore giusto, occorre trasmettere con i due numeri anche il nome dello strumento. Il formato TLM1 riunisce queste informazioni in un record, una successione di byte nella quale mittente e destinatario hanno concordato la posizione e il significato di ciascun campo.",
    "I primi quattro byte riproducono le lettere e la cifra di TLM1 e permettono di riconoscere il formato. Seguono un byte di indicatori e un byte che dichiara la lunghezza del nome. Un byte contiene otto cifre binarie. La codifica UTF-8 del testo può usarne diversi per un carattere, così «Aè» occupa tre byte. I sei byte iniziali, i tre del nome e i sei destinati alle misure portano la lunghezza prevista a quindici byte.",
    "Per la temperatura si legge per primo il byte di peso maggiore. I due byte FF 85 danno 65 413 se letti come intero senza segno. La codifica con segno, detta complemento a due, richiede qui di sottrarre 65 536 perché il primo bit vale uno. Si ottengono così −123 centesimi di grado. I quattro byte della tensione seguono l’ordine opposto e rappresentano un numero in virgola mobile, che conserva separatamente segno, cifre significative e scala.",
    "Se alla copia manca l’ultimo byte, il controllo di lunghezza interrompe la lettura. Un valore di tensione negativo richiede invece di arrivare fino all’interpretazione della misura prima di rifiutarla. Seguendo dove si ferma il lettore si può distinguere una trasmissione incompleta da un valore estraneo all’intervallo ammesso."
  ]
});
