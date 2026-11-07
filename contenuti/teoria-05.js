'use strict';

Object.assign(SL.lezioni, {
  // 5.1 · Processi, stati e cambi di contesto
  '5.1.1': [
    "Se apri due volte lo stesso programma, ciascuna copia può conservare un documento diverso. Il file che contiene le istruzioni è comune, mentre ciascuna esecuzione ha un’identità propria e dispone di memoria in cui conservare i suoi dati. Il sistema operativo chiama processo ciascuna di queste esecuzioni e le assegna un numero identificativo, il PID.",
    "Quando un’istruzione legge una variabile, usa un indirizzo virtuale, cioè un numero che indica una posizione nella memoria vista da quel processo. Per trovare la cella effettiva, il processore consulta una tabella scelta per il processo in esecuzione. La memoria è suddivisa in porzioni di uguale dimensione, dette pagine, che la tabella associa a porzioni di memoria fisica.",
    "A e B chiamano entrambi x la loro variabile privata e la raggiungono all’indirizzo 0x1000, scritto in base sedici. Se A vi deposita 7, cambia la cella a cui conduce la tabella di A. Quando il processore passa a B, lo stesso indirizzo conduce alla cella di B, dove si trova ancora il valore iniziale."
  ],
  '5.1.2': [
    "Un calcolo e una lettura da disco impegnano risorse diverse. Il core, ossia l’unità del processore che esegue le istruzioni, può passare a un altro processo mentre il disco cerca i dati richiesti dal primo. Per decidere a chi concedere il core, il sistema operativo tiene distinta la disponibilità a lavorare dall’effettiva esecuzione.",
    "Un processo, cioè un programma in esecuzione con i propri dati, è pronto quando possiede tutto ciò che gli occorre per eseguire la prossima istruzione e aspetta il proprio turno. È bloccato quando dipende da un evento ancora atteso. Nella lettura di A quell’evento è il completamento della richiesta al disco. Alla notifica del dispositivo, A rientra fra i pronti e B può proseguire fino alla fine del turno.",
    "Nel secondo caso il turno di A termina perché è scaduto il tempo assegnato, detto quanto. A avrebbe ancora lavoro immediatamente eseguibile, perciò il sistema lo accoda dietro B. Anche se il core passa a B in entrambe le sequenze, lo stato di A rivela quale evento gli consentirà di tornare in esecuzione."
  ],
  '5.1.3': [
    "Un lettore che interrompe un libro conserva il punto da cui dovrà ripartire. Anche un processo, quando cede il processore, deve ritrovare la propria posizione nella sequenza di istruzioni. Il contatore di programma, abbreviato PC, è un registro, ossia una piccola memoria interna al processore, che in questa macchina contiene l’indirizzo della prossima istruzione.",
    "Nella macchina simulata le posizioni in memoria sono numerate per byte e ogni istruzione occupa quattro byte. Il prefisso 0x indica la base sedici, nella quale dopo 9 compaiono le cifre da A a F. Se A inizia all’indirizzo 0x1000 e completa due istruzioni consecutive, ha percorso otto byte. Quando il timer segnala che il turno è scaduto, il sistema operativo conserva dunque 0x1008 nella scheda di A, insieme agli altri registri necessari a riprendere il lavoro.",
    "Durante il turno di B il registro fisico del core contiene un indirizzo appartenente a B. È la copia salvata nella scheda di A che consente, al ritorno, di caricare il PC giusto. La riga dedicata al prossimo prelievo indica dove riprende la lettura delle istruzioni."
  ],
  '5.1.4': [
    "Quando arriva il risultato di una lettura da disco, il sistema deve ritrovare il programma che l’aveva richiesta, anche se nel frattempo il processore ha eseguito altre istruzioni. A tale scopo il kernel, la parte del sistema operativo che governa l’hardware e le risorse comuni, conserva una scheda per ciascun processo. La scheda associa il suo identificativo allo stato corrente e alle risorse che usa.",
    "Per una richiesta ancora aperta, il kernel collega il processo alla coda del dispositivo, cioè all’elenco di chi ne aspetta il servizio. Nella sequenza della lettura, la notifica del disco D permette di rimuovere A da quella coda e di inserirlo fra i pronti. L’assegnazione del processore avverrà in una decisione successiva.",
    "La scheda conserva anche il riferimento alla tabella che traduce gli indirizzi di memoria. Se viene scelto B, entra in uso la sua tabella TB. La tabella indica che i dati della pagina virtuale numero 2, un blocco di indirizzi visto da B, occupano il blocco numero 9 nella memoria fisica. Il nome frame indica proprio un blocco di memoria fisica capace di contenere una pagina."
  ],
  '5.1.5': [
    "Per riprendere un programma interrotto occorrono sia l’indirizzo dell’istruzione da eseguire sia i valori temporanei sui quali essa dovrà operare. Il processore custodisce queste informazioni nei suoi registri. Quando il sistema operativo salva i valori necessari alla ripresa, ne forma il contesto, una copia che appartiene al singolo processo anche durante il turno di un altro.",
    "Si immagini che un processo P debba proseguire da 0x28 e che un processo Q abbia lasciato il proprio lavoro a 0xB0. I due numeri sono indirizzi scritti in base sedici. Prima di assegnare il core a Q, il sistema copia 0x28 nella scheda di P e carica 0xB0 nel registro che guida il prelievo delle istruzioni.",
    "Per ricostruire il viaggio di un indirizzo conviene seguirlo attraverso le sue due sedi, prima nel registro fisico, poi nella scheda personale. Al cambio successivo la direzione della copia si inverte per il processo che rientra. Questo criterio permette di separare l’indirizzo temporaneamente presente sul core da quello che ciascun processo conserva per il proprio ritorno."
  ],
  '5.1.6': [
    "Un programma diventa un processo quando il sistema operativo gli assegna memoria e conserva le informazioni necessarie per eseguirlo. Per compiere un’istruzione, il processo deve ricevere un core, cioè una delle unità del processore capaci di eseguire il codice. Vi sono però momenti in cui il core, da solo, sarebbe inutile.",
    "Il sistema chiama bloccato un processo che aspetta un evento esterno, pronto uno che ha già tutto ciò che serve tranne il turno sul core, in esecuzione uno che ha ricevuto quel turno. Il completamento di una lettura e l’assegnazione del core possono quindi avvenire in due istanti distinti.",
    "Un processo che ha già chiesto al disco il prossimo blocco deve aspettare che quel blocco arrivi. Quando il disco ha finito, il processo può trovarsi ancora fermo perché il core sta lavorando per qualcun altro. Il motivo per cui l’esecuzione è sospesa permette di distinguere le due attese."
  ],
  '5.1.7': [
    "Un core può eseguire un flusso di istruzioni per volta nel modello considerato. A ogni istante il sistema operativo tiene quindi separati i processi che stanno usando i core, quelli in grado di usarli appena se ne libera uno e quelli che aspettano un evento esterno.",
    "Si chiama dispatcher il meccanismo che consegna effettivamente il core al processo scelto. Il completamento di un’operazione di ingresso o uscita dati, indicata con I/O, può far crescere il numero dei processi pronti anche mentre tutti i core sono già occupati.",
    "Se due processi monothread, ciascuno con un solo flusso di istruzioni, sono pronti e i core disponibili sono tre, i due processi possono occupare due core. Un terzo processo in attesa del disco potrà occupare il core libero soltanto dopo il completamento della lettura e la successiva assegnazione."
  ],

  // 5.2 · Creazione dei processi, sostituzione del programma e terminazione
  '5.2.1': [
    "Un programma può affidare parte del lavoro a un secondo processo che riparta dallo stesso punto. Nei sistemi Unix la chiamata fork crea questo processo figlio. Quando la chiamata riesce, padre e figlio raggiungono entrambi l’istruzione successiva, dove possono scegliere lavori diversi in base al valore restituito. Il padre riceve l’identificativo del figlio e il figlio riceve zero.",
    "Fra i dati ereditati vi è anche x. Benché ciascun processo la consideri una variabile privata, all’inizio il sistema può far leggere a entrambi la stessa pagina fisica, ossia lo stesso blocco di memoria. Questa tecnica prende il nome di copia su scrittura, perché il sistema separa i contenuti quando uno dei due tenta di modificare la pagina condivisa.",
    "Se nella variabile era stato scritto 6, entrambe le letture iniziali restituiscono 6. L’incremento eseguito dal figlio porta a 7 soltanto la sua x. Accanto ai due contenuti, la coppia di valori restituiti da fork permette di riconoscere chi sta eseguendo ciascun ramo."
  ],
  '5.2.2': [
    "Quando si digita un comando nel terminale, lo interpreta un programma chiamato shell. Il comando esterno echo produce una riga di testo e la scrive sulla propria uscita standard. Per consegnare i byte, echo usa un numero, il descrittore 1. È la tabella dei descrittori del processo a stabilire se quel numero conduce al terminale oppure a un file.",
    "Nella scrittura «echo ciao > esito.txt», il segno > chiede alla shell di preparare una diversa destinazione. La shell crea un figlio, che eredita inizialmente le associazioni del padre. Il figlio apre esito.txt ottenendo il descrittore 3. Con dup2(3,1) associa anche il posto 1 della propria tabella al file aperto, dopodiché può chiudere il posto 3.",
    "Quando il figlio carica echo, la scrittura della parola ciao passa dunque dal descrittore 1 al file. La shell, il cui descrittore 1 conduce ancora al terminale, attende la fine del comando prima di mostrare il nuovo invito a digitare. I due percorsi spiegano perché la riga e l’invito possano apparire in luoghi distinti."
  ],
  '5.2.3': [
    "Un piccolo programma di avvio può preparare i file di lavoro per un secondo programma e poi cedergli il proprio posto. La chiamata execve chiede al sistema operativo di caricare un eseguibile all’interno del processo chiamante. Se l’operazione riesce, iniziano le istruzioni del nuovo programma e il processo conserva il proprio numero identificativo, il PID.",
    "Oltre ai dati in memoria, un processo possiede una tabella dei file aperti, ai quali accede mediante piccoli interi detti descrittori. Per tenere aperto un file temporaneo soltanto durante la preparazione, il programma può marcare il suo descrittore con FD_CLOEXEC, l’indicazione di chiuderlo al caricamento riuscito del nuovo eseguibile.",
    "Nel caso illustrato il processo 71 tiene il file di lavoro sul descrittore 3 e quello temporaneo sul 4. Se parte il programma analisi, trova ancora aperto il primo. Se invece il percorso richiesto è assente, il programma di avvio riceve un errore e conserva entrambi. L’identità di chi esegue l’istruzione successiva permette di interpretare lo stato della tabella."
  ],
  '5.2.4': [
    "Un processo che abbia affidato un lavoro al figlio può avere bisogno di sapere come si sia concluso. Il figlio comunica un piccolo intero, detto codice di uscita, quando termina normalmente. Poiché il padre potrebbe essere impegnato altrove, il sistema operativo trattiene le informazioni essenziali sulla conclusione finché il padre le raccoglie.",
    "Durante questa attesa il figlio, che ha già smesso di eseguire istruzioni, prende il nome di zombie. Quando il padre chiama waitpid, ottiene l’identificativo del figlio raccolto e riceve, in una variabile distinta, lo stato di terminazione codificato. WIFEXITED verifica se la conclusione è stata normale. In tal caso WEXITSTATUS estrae il codice che era stato consegnato dal figlio.",
    "Se il figlio 52 termina chiamando _exit(13), 52 identifica il processo e 13 descrive l’esito che quel processo ha voluto comunicare. La riga della raccolta separa questi due numeri. Il passaggio da zombie a raccolto indica quando il sistema può eliminare la registrazione finale."
  ],
  '5.2.5': [
    "Un programma può contenere più thread, cioè più sequenze di istruzioni che avanzano nello stesso processo e usano la stessa memoria. Per aggiornare una struttura comune, un thread può acquisire un mutex, un vincolo che riserva temporaneamente l’accesso a un solo partecipante. Il segno che il mutex è occupato rimane nella memoria del processo.",
    "Se T2 crea un processo figlio con fork mentre T1 possiede il mutex M, il figlio eredita una copia della memoria e riprende dal punto in cui T2 ha chiamato fork. T1 continua nel padre. La copia di M risulta quindi occupata, benché il thread che la potrebbe rilasciare sia assente dal figlio. Anche una funzione di libreria apparentemente innocua potrebbe aver bisogno di un vincolo ereditato in questo stato.",
    "POSIX, la specifica di queste interfacce, prescrive per questo tratto le operazioni utilizzabili con sicurezza anche durante la gestione di un segnale, un avviso che può interrompere una funzione mentre sta lavorando. Le due sequenze illustrano execve, che sostituisce il programma, e _exit, che termina direttamente il figlio se il caricamento fallisce."
  ],
  '5.2.6': [
    "Per leggere un file in più riprese occorre ricordare dove inizierà la lettura successiva. Il sistema operativo conserva la posizione corrente, chiamata offset, nella descrizione del file aperto. L’offset conta i byte dall’inizio del file, assegnando al primo byte la posizione zero. Il descrittore è il piccolo intero mediante il quale il processo raggiunge quella descrizione. Più descrittori possono condurre allo stesso cursore.",
    "Dopo fork, che crea un processo figlio copiando la tabella dei descrittori del padre, i due processi dispongono ciascuno della propria tabella. Le voci ereditate continuano a riferirsi alla medesima apertura del file. Se il cursore fosse inizialmente sul byte numero 4 e il padre ricevesse due byte, il figlio troverebbe il cursore sul byte 6.",
    "Una lettura sposta il cursore della quantità effettivamente restituita. Per seguire le letture consecutive rappresentate sul nastro, conviene segnare il confine fra i byte già consegnati e quelli ancora da leggere. Chi compie la seconda lettura eredita il confine lasciato dalla prima, anche quando a eseguirla è l’altro processo."
  ],
  '5.2.7': [
    "Un processo può chiedere al sistema operativo di crearne un altro che prosegua dallo stesso punto del programma. Nei sistemi Unix questa operazione prende il nome di fork. Se riesce, dopo la chiamata esistono due processi, ciascuno con la propria esecuzione e con un identificativo detto PID.",
    "Il sistema dispone le cose affinché entrambi i processi vedano un risultato della fork. Il programma può esaminare quel risultato nello stesso punto del codice e assegnare al nuovo processo un compito diverso da quello del processo originario.",
    "Il figlio riceve zero come risultato della chiamata. Il padre riceve il PID del figlio, che gli permette di riconoscerlo. Se invece la creazione fallisce, il chiamante riceve −1 e prosegue da solo. Prima di contare quante volte verrà eseguita la riga successiva conviene distinguere questi tre possibili risultati."
  ],
  '5.2.8': [
    "Il testo del programma compare una sola volta, anche quando più processi ne stanno eseguendo le righe. Dopo una fork riuscita il padre e il figlio si trovano alla stessa istruzione successiva. Poiché conservano valori di ritorno diversi, una condizione può indirizzarli verso due rami differenti.",
    "Per disegnare l’albero delle creazioni, si aggiunge un ramo figlio soltanto quando una chiamata effettivamente raggiunta termina con successo. I processi che avevano già scelto un altro percorso mantengono il loro posto nell’albero.",
    "Supponiamo che soltanto chi ha ricevuto zero esegua una seconda fork e che entrambe le creazioni riescano. Il padre iniziale prosegue da solo nel proprio ramo, mentre dal ramo del primo figlio escono due processi. Alla riunione dei rami arrivano così tre esecuzioni. A ogni diramazione si contano i processi che hanno realmente raggiunto la chiamata."
  ],

  // 5.3 · Scheduling della CPU e condivisione del tempo
  '5.3.1': [
    "Mentre un programma aspetta un dato dal disco, il processore può eseguire un altro programma. Quando il dispositivo ha finito, invia al sistema operativo un segnale chiamato interrupt. Il processo in attesa torna pronto, perché ora esistono i dati necessari alla prossima istruzione. Per eseguirla deve però ottenere il core, l’unità di calcolo che in questo istante può essere ancora assegnata a qualcun altro.",
    "Nella traccia A calcola dal tempo zero e B attende il disco. Se il dato arriva al tempo 2 e A mantiene il suo turno fino al tempo 5, B spende tre millisecondi fra i pronti. La misura parte dalla notifica del dispositivo, così il tempo impiegato dal disco resta separato dall’attesa del processore.",
    "La prelazione permette al sistema di interrompere il turno già iniziato. Quando la politica assegna a B una priorità superiore, l’assegnazione coincide con il suo risveglio, poiché il cambio è considerato istantaneo. I due istanti segnati sulla linea del tempo mostrano da dove provenga la differenza."
  ],
  '5.3.2': [
    "Tre lavori, tutti pronti allo stesso istante, devono usare lo stesso core, l’unità del processore che ne esegue le istruzioni. Ogni lavoro richiede un intervallo ininterrotto di calcolo, indicato nella figura con il termine inglese burst. Poiché il core può soddisfare una richiesta per volta, l’ordine scelto determina quanto attende ciascun lavoro prima di cominciare.",
    "FCFS, dalle iniziali di first come, first served, conserva l’ordine di arrivo. Per arrivi simultanei vale qui l’ordine A, B, C. Se A dura 8 millisecondi, B ne dura 3 e C ne dura 1, A inizia subito, B al tempo 8 e C al tempo 11. L’attesa media è la somma di questi tre ritardi divisa per tre.",
    "SJF, shortest job first, sceglie ogni volta il lavoro pronto di durata minore, che in questa prova è conosciuta in anticipo. Nell’esempio comincia C, poi tocca a B e infine ad A. La somma dei tempi di servizio rimane dodici millisecondi. Cambiano le posizioni degli inizi sulla linea del tempo e, di conseguenza, l’attesa media."
  ],
  '5.3.3': [
    "Perché un lavoro breve possa iniziare anche mentre un altro ha molto calcolo da compiere, il sistema può suddividere il tempo del processore in turni. La politica round-robin prende il primo processo dalla coda dei pronti e gli concede al massimo un intervallo chiamato quanto. Se il lavoro termina prima della scadenza, il core passa subito al successivo. Se resta del lavoro, il processo si accoda in fondo.",
    "Un cambio fra processi ha un costo, perché occorre conservare i dati temporanei del processo uscente e ripristinare quelli del processo entrante. Con un quanto di 2 millisecondi, A, che ne richiede 5, lascia 3 millisecondi ancora da svolgere al termine del primo turno. Se il cambio dura 1 millisecondo, B può iniziare al tempo 3.",
    "Il tempo della prima risposta di B si misura dal suo arrivo alla sua prima assegnazione. Per ottenere invece la durata dell’intero lavoro occorre percorrere tutti i turni, includendo i cambi effettivi. Quando resta un solo processo, la scadenza del suo quanto può riportare al core lo stesso processo senza un passaggio ad altri."
  ],
  '5.3.4': [
    "La priorità esprime la precedenza che il sistema accorda a ciascun lavoro pronto quando più lavori chiedono lo stesso core. La scelta si complica quando H, pur avendo priorità alta, aspetta un mutex posseduto da L, che ha priorità bassa. Il mutex riserva temporaneamente una risorsa al suo possessore. Affinché H possa procedere, L deve quindi ottenere abbastanza tempo per completare il lavoro e rilasciarlo.",
    "Con priorità fisse, un terzo processo M di priorità intermedia può precedere L. Nella traccia M calcola per 4 millisecondi e L ne richiede ancora 2 per liberare la risorsa. L’ereditarietà della priorità permette a L di usare temporaneamente quella di H, così da completare quei due millisecondi prima del turno di M.",
    "Le altre due politiche modificano la priorità per ragioni diverse. Nelle code a retroazione A scende di livello perché consuma tutto il turno, mentre B mantiene il proprio livello quando si ferma per una lettura. Con l’invecchiamento è invece il tempo già trascorso in attesa a far salire il punteggio di A fino al sorpasso."
  ],
  '5.3.5': [
    "Quando il processore offre due core, ossia due unità capaci di calcolare nello stesso istante, ogni core può ricevere un elenco distinto di lavori pronti. Un elenco molto più lungo dell’altro fa sì che uno dei core resti libero mentre l’altro deve ancora eseguire diversi lavori. Il bilanciamento consiste nel ridistribuire i lavori che entrambi i core sono in grado di svolgere.",
    "Supponiamo che al tempo zero sei lavori siano assegnati al core 0 e uno al core 1. Se ogni lavoro dura un millisecondo, i due core iniziano insieme e il gruppo termina al tempo 6, quando finisce l’ultimo lavoro. Il core 1, che ha finito al tempo 1, rimane disponibile nei cinque millisecondi successivi.",
    "Trasferendo due lavori prima dell’avvio, le code diventano di quattro e tre elementi. I sette millisecondi di lavoro complessivi si distribuiscono ora su quattro millisecondi di orologio. Qui lo spostamento è istantaneo. La lunghezza della coda più lunga determina il momento dell’ultima conclusione. Un solo core inattivo per un millisecondo corrisponde, nella misura complessiva della figura, a un core·ms inutilizzato."
  ],
  '5.3.6': [
    "Quando un solo core riceve due richieste, il momento di arrivo della seconda può cadere dentro l’intervallo in cui il primo lavoro è già in esecuzione. La politica FCFS serve le richieste nell’ordine in cui arrivano. Nel caso in esame il lavoro iniziato prosegue fino a compimento, anche se nel frattempo è comparsa una nuova richiesta.",
    "Per fissare le idee, un lavoro X che inizi a zero e duri cinque millisecondi occupa il core fino all’istante 5. Se Y arriva a 2 e richiede tre millisecondi di servizio, può iniziare a 5 e conclude a 8. L’intervallo da 2 a 5 misura il suo tempo di attesa, quello da 5 a 8 il tempo durante il quale il processore ne esegue le istruzioni.",
    "Sulla linea del tempo conviene perciò collocare tre segni separati per il secondo lavoro, uno per l’arrivo, uno per l’inizio effettivo e uno per la conclusione. Quando il cambio di processo è istantaneo, l’estremo finale del primo servizio coincide con l’inizio del successivo, purché la richiesta sia già in coda."
  ],
  '5.3.7': [
    "Quando più processi sono pronti sullo stesso core, lo scheduler decide quale servire. Un burst è un tratto di lavoro che richiede continuativamente la CPU, il processore. SJF, dall’inglese Shortest Job First, sceglie il lavoro disponibile più breve. SRTF, Shortest Remaining Time First, considera la durata che rimane da eseguire e può sospendere chi ha il turno.",
    "Con SJF senza prelazione, cioè senza interruzione del turno, la scelta viene fatta alla fine del tratto di lavoro in corso. Con SRTF, l’arrivo di una nuova richiesta può far cambiare subito il processo in esecuzione se il nuovo arrivato ha meno lavoro residuo.",
    "Un processo con otto millisecondi di lavoro residuo può vedersi affiancare da uno che ne richiede due. Se il turno già iniziato è indivisibile, il secondo attende. Se il turno può essere interrotto, viene servita per prima la richiesta con due millisecondi residui. In entrambi i confronti importa il lavoro ancora da fare all’istante dell’arrivo."
  ],
  '5.3.8': [
    "Una traccia temporale permette di distinguere la prima occasione in cui un processo usa il core dall’istante in cui ne conclude definitivamente l’uso. Fra queste due date possono cadere più turni di lavoro e più attese, che occorre leggere separatamente.",
    "Il tempo di risposta si misura dall’arrivo al primo turno. Il tempo complessivo di attraversamento, chiamato turnaround, si misura dall’arrivo alla fine dell’ultimo turno. Per ricavare l’attesa si sommano invece soltanto gli intervalli in cui il processo era pronto e il core serviva qualcun altro.",
    "Se un processo arriva al tempo 1, usa il core da 3 a 5 e da 7 a 8, la prima risposta arriva dopo due unità e il completamento dopo sette. Supponendo che negli intervalli rimanenti sia sempre pronto, trascorre in coda quattro unità, due prima di ciascun turno. La somma del lavoro e dell’attesa ricostruisce l’intero intervallo."
  ],

  // 5.4 · Thread, concorrenza ed esecuzione parallela
  '5.4.1': [
    "Un programma che, mentre prepara una risposta, continua ad accogliere nuove richieste può affidare le due attività a thread distinti. Ciascun thread è una sequenza di istruzioni che ha i propri registri per i calcoli in corso e il proprio stack, l’area in cui si conservano le chiamate di funzione e i loro dati locali. I thread dello stesso processo possono però raggiungere gli stessi oggetti in memoria.",
    "Qui entrambi ricevono l’indirizzo della cella h, ricavata nell’heap, l’area in cui il programma può riservare memoria durante l’esecuzione. Un puntatore contiene quell’indirizzo. Leggere attraverso il puntatore significa raggiungere h e prelevarne il contenuto, che è distinto dal numero usato per localizzarla.",
    "Se T1 scrive 9 in h mentre il registro r di T2 contiene 3, la scrittura modifica h. Il registro di T2 continua a valere 3 finché T2 esegue la propria lettura. La sincronizzazione assicura che quel prelievo avvenga dopo la scrittura, permettendo a T2 di ricevere il 9 attraverso la cella comune."
  ],
  '5.4.2': [
    "Suddividere un lavoro in più attività consente di farle avanzare indipendentemente. Ciascuna sequenza di istruzioni che il programma può avviare è qui un thread. Più thread sono concorrenti quando la loro vita si sovrappone. Perché due di essi eseguano davvero nello stesso istante servono abbastanza unità hardware, che nel modello corrispondono ai core disponibili.",
    "Se cinque thread diventano pronti insieme e ciascuno occupa un core per un millisecondo, due core possono servire i primi due nello stesso intervallo. Nel secondo millisecondo ne completano altri due. Il quinto, pur essendo pronto fin dall’inizio, ha bisogno di un terzo turno in cui uno dei core rimane libero.",
    "Si può leggere il risultato contando quante volte occorre riempire un gruppo di posti, uno per core, per esaurire i thread disponibili. Se l’ultimo gruppo è incompleto, richiede comunque un millisecondo. Questa relazione presuppone lavori di uguale durata che possono procedere indipendentemente e diventano tutti pronti al tempo zero."
  ],
  '5.4.3': [
    "Una libreria può offrire al programma quattro thread utente, cioè quattro attività tra le quali sa distribuire il lavoro, anche se il sistema operativo vede un numero diverso di entità da eseguire. La figura chiama worker ciascuna entità alla quale il kernel, la parte del sistema operativo che distribuisce le risorse, può assegnare un core di calcolo. Per eseguire un thread utente occorrono dunque sia un worker disponibile sia un core sul quale farlo avanzare.",
    "Se i quattro thread dipendono da un unico worker e U1 avvia una lettura bloccante, quel worker deve attendere i dati del dispositivo. Gli altri tre thread sono pronti, eppure durante l’attesa manca chi possa portarli su uno dei core liberi. Con due worker la sospensione di U1 ne lascia invece uno utilizzabile.",
    "Nell’associazione uno a uno ciascun thread utente dispone del proprio worker. La lettura di U1 ne occupa uno e i tre restanti possono lavorare contemporaneamente sui core disponibili. Il confronto riguarda una dotazione fissa di worker, così che il risultato dipende direttamente dal collegamento rappresentato fra i due livelli."
  ],
  '5.4.4': [
    "Nel creare più attività per elaborare elementi diversi di un elenco, il programma deve comunicare a ciascuna quale elemento le spetti. La funzione pthread_create passa al nuovo thread un puntatore, ossia l’indirizzo di un oggetto. Se nel frattempo il contenuto dell’oggetto cambia, la lettura successiva troverà il valore presente al momento dell’accesso.",
    "Tre puntatori a tre celle inizializzate con 0, 1 e 2 portano ogni lavoratore alla propria cella. Tre puntatori alla stessa variabile i portano invece tutti allo stesso indirizzo. Nella prova una barriera, che trattiene i lavoratori fino al segnale di avvio, colloca le letture dopo la fine del ciclo. A quel punto i vale 3 per tutti.",
    "Anche la durata degli oggetti conta. Il creatore conserva le celle finché pthread_join ha atteso la fine dei thread avviati. Se la terza creazione fallisce, esistono soltanto due lavoratori da far partire e attendere. I conti dei valori distinti e dei join descrivono perciò due proprietà diverse, gli indirizzi effettivamente letti e le creazioni effettivamente riuscite."
  ],
  '5.4.5': [
    "Un servizio che risponde a molte richieste può assegnarle a più lavoratori. Se i lavoratori sono thread dello stesso processo, dispongono di un’unica mappa della memoria. Se ciascuno è un processo a sé, ha una mappa distinta e può scambiare dati con gli altri attraverso canali predisposti dal sistema, fra i quali le pipe, canali da cui un processo può leggere i byte che un altro vi ha scritto.",
    "Quando B tenta di leggere una pagina di memoria priva del permesso di lettura per quel processo, il sistema operativo segnala la violazione, qui con il segnale SIGSEGV. Con il comportamento predefinito adottato nella prova, tale errore termina il processo che contiene l’attività responsabile. Il confine del processo stabilisce dunque quali altri lavoratori vengono coinvolti nella terminazione.",
    "Nel servizio con tre thread, anche A e C appartengono al processo che termina. Nel servizio con tre processi, A e C mantengono le proprie risorse e continuano a servire richieste. Il supervisore che li ha avviati rimane esterno in entrambe le organizzazioni e può intervenire per il riavvio."
  ],
  '5.4.6': [
    "Quando un programma consegna a più lavoratori i dati da elaborare, può raggrupparli in un array, una sequenza di celle numerate a partire da zero. Le parentesi quadre indicano l’indice della cella, mentre il simbolo & davanti al nome di una cella indica che interessa il suo indirizzo. Attraverso quell’indirizzo il lavoratore potrà raggiungere il contenuto.",
    "Si consideri un array di tre temperature con valori 14, 18 e 21. Un lavoratore al quale viene passato &temperature[2] riceve il riferimento alla terza cella. Quando la legge ottiene 21, purché la cella esista ancora e nessuno ne abbia modificato il contenuto. Il numero 2 serve a scegliere una posizione e il numero 21 è il valore conservato in quella posizione.",
    "Lo schema della prova dispone in corrispondenza ogni lavoratore e il suo indirizzo. Il creatore mantiene in vita l’array finché i join hanno atteso tutti i lavoratori. Questo ordine assicura che anche l’ultimo arrivato alla propria lettura trovi l’oggetto che gli era stato indicato."
  ],
  '5.4.7': [
    "Un processo può avere più thread, cioè più flussi di istruzioni. Mentre ogni thread conserva nei propri registri i valori sui quali sta lavorando, tutti possono raggiungere la stessa area di memoria dinamica, chiamata heap. Anche un dato privato in un registro può avere lo stesso valore numerico di un dato condiviso senza essere la stessa cella.",
    "Una scrittura nell’heap è visibile a entrambi quando gli accessi sono opportunamente sincronizzati. Il registro appartiene invece al contesto del singolo thread, che il sistema conserva anche se al thread viene temporaneamente tolto il core.",
    "Se A scrive 8 in una cella condivisa e B conserva 3 in un proprio registro, una lettura successiva della cella da parte di B può restituire 8. Il registro contenente 3 conserva il suo valore finché B vi scrive. La barriera è il punto di incontro che situa la lettura dopo le operazioni che gli altri thread devono aver completato."
  ],
  '5.4.8': [
    "Quando si avvia un thread, un argomento può indicare la posizione in cui esso troverà il proprio lavoro. Due copie di un indirizzo conducono alla stessa cella. Se il programma che prepara i lavori continua a riscrivere quella cella, il valore letto dipende anche dall’ordine fra scrittura e lettura.",
    "Una serie di celle contigue, chiamata array, offre un’alternativa alla cella unica. Il programma scrive un indice diverso in ciascuna posizione e passa a ogni thread l’indirizzo della propria cella. Quella zona di memoria deve restare disponibile per tutto il tempo in cui i thread vi accedono.",
    "Supponiamo che due lavoratori aspettino entrambi una barriera e ricevano l’indirizzo dello stesso contatore. Al termine della preparazione, entrambi possono trovarvi l’ultimo valore scritto. Riservando invece una cella per ciascun lavoratore e mantenendole valide fino alle letture, ciascuno ritrova il valore che gli era stato assegnato."
  ],

  // 5.5 · Stato condiviso, sezioni critiche e semafori
  '5.5.1': [
    "Due lavoratori registrano ciascuno l’arrivo di una richiesta aggiungendo uno allo stesso contatore. Per eseguire l’incremento, ciascuno legge il numero in memoria, lo conserva temporaneamente in un registro e restituisce alla cella il numero letto aumentato di uno. Fra la lettura e la scrittura di A può cadere una lettura di B.",
    "Partendo da 4, se entrambi leggono prima che qualcuno scriva, A conserva localmente 4 e anche B conserva 4. Le due scritture depositano quindi 5 nella stessa cella. Si parla di aggiornamento perso perché il contatore registra una sola delle due richieste. Se invece B legge dopo che A ha scritto 5, parte dal valore aggiornato e porta la cella a 6. Basta cambiare l’ordine relativo delle operazioni per produrre due esiti diversi.",
    "Nella macchina rappresentata ciascuna operazione di lettura o scrittura è atomica, cioè appare agli altri come un singolo evento indivisibile. Tutti osservano questi eventi in un ordine comune. La figura separa i valori locali dalla cella condivisa affinché si possa individuare da quale lettura provenga ciascuna scrittura."
  ],
  '5.5.2': [
    "Si vorrebbe che due richieste facessero crescere di due unità un contatore comune. Poiché l’aggiornamento usa il valore che il contatore aveva al momento della lettura, è necessario conservarne la validità fino alla scrittura. Un mutex concede a un solo lavoratore per volta l’accesso alla parte di programma che si è deciso di proteggere, chiamata sezione critica.",
    "Se la sezione critica comincia soltanto davanti alla scrittura, A e B possono aver già letto entrambi 10. Per quanto le due scritture avvengano ordinatamente, ciascun lavoratore si presenta con lo stesso risultato calcolato, 11. Il secondo deposito lascia perciò invariato il numero che aveva appena scritto il primo.",
    "Se la protezione comincia prima della lettura, B attende che A abbia scritto e rilasciato il mutex prima di leggere a sua volta. Il valore di partenza di B contiene già il contributo di A. Nel confrontare le due sequenze, il primo passaggio in cui differiscono è proprio il valore disponibile per questa lettura."
  ],
  '5.5.3': [
    "Nello stesso programma possono avanzare più sequenze di istruzioni, dette thread. Un thread creatore ripartisce fra due lavoratori il compito di contare degli eventi e vuole leggere un unico totale a lavori conclusi. Occorre risolvere due problemi distinti. Durante gli aggiornamenti ciascun lavoratore deve partire dal valore lasciato dal precedente. Al momento della lettura finale entrambi devono aver completato tutti gli incrementi loro assegnati.",
    "Il mutex M protegge un aggiornamento per volta. Chi lo acquisisce legge il contatore, aggiunge uno, scrive il risultato e poi rilascia M. Se i lavoratori partono da zero e compiono tre incrementi ciascuno, si osservano sei rilasci che lasciano nella cella, nell’ordine, i numeri da 1 a 6. L’alternanza di A e B è una sequenza possibile.",
    "Il creatore esegue un join per ciascun lavoratore, ossia ne attende la terminazione. Solo dopo entrambe le attese il valore letto rappresenta il totale definitivo e il mutex può essere distrutto. La sequenza dei rilasci giustifica l’esattezza del conteggio, mentre i join giustificano la scelta dell’istante in cui leggerlo."
  ],
  '5.5.4': [
    "Un produttore prepara un valore e avverte un consumatore quando è pronto. Per farlo usa due celle, dato per il contenuto e pronto per il segnale. Entrambe sono atomiche, cioè ciascuna lettura o scrittura della singola cella viene trattata come un evento indivisibile. Rimane da stabilire quale scrittura di dato sia visibile al consumatore quando vede comparire il segnale.",
    "Inizialmente le celle contengono zero. Il produttore scrive 42 in dato, poi scrive 1 in pronto. Se questa seconda scrittura ha ordine release e il consumatore legge proprio quell’1 con una lettura di ordine acquire, il segnale collega le due sequenze di operazioni. La scrittura di 42 risulta così ordinata prima della successiva lettura di dato. In assenza di altri scrittori il consumatore troverà 42.",
    "Con l’ordine relaxed sul segnale rimane garantita l’atomicità dei singoli accessi. Manca però il collegamento che ordina gli accessi alle due celle fra i thread. Per questo la figura riporta un insieme di valori ammessi, 0 oppure 42, anche mantenendo fisso l’1 che il consumatore ha letto in pronto."
  ],
  '5.5.5': [
    "Se due attività devono aggiornare in esclusiva la stessa struttura, il primo lavoratore acquisisce un lock, cioè il diritto di eseguire la parte protetta, e lo restituisce quando ha finito. Chi arriva nel frattempo può aspettare in modi diversi. Per descriverli servono due misure, il tempo che passa sull’orologio e il tempo di processore impiegato da chi attende.",
    "A lavora su un core e deve tenere il lock per altri quattro millisecondi. B, su un secondo core, può ripetere il tentativo di acquisizione finché riesce. Questa attesa attiva, detta spin, impegna il secondo core per i quattro millisecondi durante i quali A finisce il lavoro.",
    "Quando B sceglie la sospensione, il sistema lo blocca e rende il secondo core disponibile per altre attività. Anche in questo caso il lock viene rilasciato dopo quattro millisecondi, durante i quali B consuma zero millisecondi di CPU. Il modello considera istantaneo il risveglio e B è l’unico richiedente al momento del rilascio."
  ],
  '5.5.6': [
    "Un servizio che disponga di pochi posti può rappresentarli mediante permessi. Il semaforo tiene il conto dei permessi ancora liberi e registra i richiedenti che devono attendere. L’operazione wait prende un permesso, se disponibile, oppure sospende chi lo chiede. L’operazione signal mette un permesso a disposizione di chi ne ha bisogno.",
    "Se inizialmente è libero un solo permesso, A lo prende con la prima wait e il contatore scende a zero. La successiva richiesta di B lo aggiunge alla coda. Alla signal di P il permesso passa direttamente a B, il quale diventa pronto. In questo passaggio il contatore dei permessi liberi resta a zero, perché il permesso ha già un destinatario.",
    "Alla signal di Q la coda è vuota, perciò stavolta compare un permesso libero. Con più persone in attesa la prova serve la prima arrivata, secondo l’ordine FIFO (first in, first out, ossia in ordine di arrivo). Per leggere ogni passaggio conviene seguire insieme il contatore e i nomi in coda, che distinguono un permesso disponibile da uno già assegnato."
  ],
  '5.5.7': [
    "Due clienti tentano di prenotare l’ultima poltrona. Il servizio deve garantire che alla poltrona corrisponda una sola conferma. La decisione dipende dal contenuto di una cella che vale 1 finché il posto è libero e passa a 0 quando viene occupato. Tra il controllo di disponibilità e la registrazione potrebbe intervenire l’altro cliente.",
    "Se A e B controllano prima di acquisire il lock, entrambi possono leggere 1 e autorizzare la propria richiesta. Anche scrivendo 0 uno dopo l’altro, finiranno per inviare due conferme. Se chi controlla trattiene il lock fino alla registrazione, il secondo cliente trova invece il valore che il primo ha già aggiornato.",
    "Il confronto e scambio, o compare-exchange, riunisce verifica e modifica in una singola operazione indivisibile. Il richiedente indica il valore atteso 1 e chiede di sostituirlo con 0. Quando il posto risulta già occupato, il confronto fallisce e restituisce al richiedente il valore effettivamente osservato. Il numero di conferme mostra se la decisione è rimasta legata a una disponibilità reale."
  ],
  '5.5.8': [
    "Un conto il cui saldo debba essere ricalcolato con la stessa regola dopo ogni operazione richiede che il secondo calcolo usi il risultato del primo. Se due lavoratori leggessero il saldo insieme, potrebbero consegnare due risultati ottenuti dalla stessa base. Un mutex, che accorda l’accesso a un solo lavoratore alla volta, permette di riservare l’intero intervallo dalla lettura alla nuova scrittura.",
    "Per esempio, su una cella che inizialmente valga 3 si potrebbe applicare due volte la regola «raddoppia e aggiungi due». Il primo lavoratore porta la cella a 8. Quando il secondo acquisisce il mutex, parte da 8 e scrive 18. Il mutex stabilisce l’ordine dei calcoli, mentre è la regola aritmetica a determinare i numeri.",
    "Nella figura ciascun turno corrisponde a una sezione critica completa. Il valore da riportare all’ingresso del secondo turno è pertanto quello presente nella cella dopo la prima scrittura. Seguendo tale passaggio si può applicare la regola assegnata al problema senza confondere il valore iniziale con quello intermedio."
  ],
  '5.5.9': [
    "Un gruppo di processi può condividere pochi esemplari di una risorsa. Un semaforo contatore registra quanti permessi si possono ancora acquisire. L’operazione wait ne richiede uno. Se tutti sono già impegnati, il richiedente si sospende. Con signal si restituisce un permesso oppure lo si consegna a chi aspettava.",
    "Nell’esercizio la coda segue l’ordine di arrivo. Quando qualcuno è sospeso, il risveglio gli assegna il permesso che si sta restituendo. Quando la coda è vuota, il rilascio incrementa invece il numero di permessi che un futuro richiedente potrà trovare liberi.",
    "Con un solo permesso, A riesce a entrare e B resta in coda. Quando A rilascia il permesso, nel modello mostrato questo passa direttamente a B. Il contatore dei permessi disponibili può quindi restare a zero anche se la coda si è accorciata. Per capire chi può avanzare occorre seguire entrambe le informazioni."
  ],
  '5.5.10': [
    "Due richieste possono contendersi l’ultimo posto libero. Se un lavoratore osserva la disponibilità e viene sospeso prima di registrare la prenotazione, un altro può vedere il medesimo posto e prendere la stessa decisione. Un mutex è un vincolo di esclusione che lascia entrare un solo lavoratore nel tratto di programma protetto.",
    "Il tratto da proteggere comprende la lettura del posto e la registrazione della decisione. Nel confrontare due tracce, il valore decisivo è quello che ciascun lavoratore vede quando effettua il controllo, insieme all’intervallo durante il quale possiede il mutex.",
    "Proteggere la sola scrittura impedisce che due scritture avvengano insieme, sebbene entrambe le decisioni possano risalire a una lettura già superata. Se la disponibilità viene letta e aggiornata durante lo stesso possesso del mutex, il secondo lavoratore trova lo stato prodotto dal primo e può decidere su dati aggiornati."
  ],

  // 5.6 · Semafori contatori e problemi classici di sincronizzazione
  '5.6.1': [
    "Un programma che produce dati e un altro che li consuma possono procedere a velocità diverse. Tra i due si colloca un buffer, una zona di memoria con un numero fisso di posti. Per evitare che il produttore occupi un posto già usato o che il consumatore legga troppo presto, ciascuno deve ottenere il permesso adatto alla propria operazione.",
    "I due contatori di permessi, o semafori, chiamati vuoti e pieni, contano rispettivamente i posti disponibili per una scrittura e i dati pubblicati disponibili per una lettura. Con quattro posti inizialmente vuoti, la prenotazione di un posto da parte del produttore lascia tre permessi liberi. Il quarto è in transito, perché appartiene già al produttore e il consumatore deve ancora ricevere il diritto di usarlo.",
    "Durante l’inserimento un mutex protegge il posto e l’indice che indica dove scrivere. La successiva pubblicazione aggiunge un permesso a pieni. Anche nell’intervallo in cui il dato è già in memoria, per contare correttamente tutti i posti occorre comprendere quelli riservati. La somma dei permessi liberi, pubblicati e in transito resta pari alla capacità."
  ],
  '5.6.2': [
    "Una coda che possa contenere un solo elemento deve concedere a chi produce sia il diritto di usare uno spazio libero sia l’accesso esclusivo alla cella per aggiornarla. Il primo diritto è contato da un semaforo, chiamato vuoti. Il secondo è concesso dal mutex, che protegge anche il lavoro di chi rimuove l’elemento.",
    "Quando il buffer è pieno, il produttore P può iniziare chiedendo un permesso a vuoti. Il sistema lo sospende finché si libera spazio. Poiché P ha lasciato disponibile il mutex, il consumatore C può acquisirlo, togliere il dato e segnalare il nuovo posto. È proprio l’operazione di C a rendere nuovamente pronto P.",
    "Se invece P trattiene il mutex mentre attende un posto libero, C si ferma davanti al mutex anche avendo il permesso di consumare il dato. Le attese si richiudono l’una sull’altra. Nella figura la cella resta piena perché l’unica attività capace di svuotarla dipende da chi ne sta aspettando lo svuotamento."
  ],
  '5.6.3': [
    "Un consumatore può togliere un dato da una coda se, nel momento in cui la esamina, vi si trova almeno un elemento. Questa affermazione, che può risultare vera o falsa, si chiama predicato. I partecipanti lo verificano sotto mutex, così che nessun altro possa cambiare il contenuto della coda durante il controllo e la conseguente rimozione.",
    "Se il predicato è falso, C1 si sospende su una variabile di condizione, l’oggetto attraverso il quale un produttore potrà segnalargli un cambiamento. La funzione pthread_cond_wait unisce il rilascio del mutex e l’ingresso in attesa, consentendo al produttore di acquisire il mutex, depositare il dato e segnalare l’evento. Prima di restituire il controllo a C1, la funzione deve riacquisire il mutex.",
    "Fra il segnale e la riacquisizione può inserirsi un secondo consumatore C2. Se è lui a prendere per primo il dato, C1 trova la coda di nuovo vuota. Il risveglio autorizza dunque un nuovo esame del predicato. Un ciclo che ricontrolla la coda a ogni ritorno dall’attesa permette di decidere correttamente in entrambe le sequenze."
  ],
  '5.6.4': [
    "Molte persone possono consultare nello stesso momento una tabella di sola lettura. Per modificarne le righe occorre invece un intervallo esclusivo, affinché chi legge trovi una versione coerente. Un meccanismo per lettori e scrittori deve assicurare questa compatibilità e stabilire quale richiesta ammettere quando varie persone sono in attesa.",
    "L1 sta già leggendo quando lo scrittore S chiede di entrare. Poiché una lettura è in corso, S attende. Nel frattempo arriva un secondo lettore, L2. Con precedenza ai lettori, L2 può unirsi a L1. Quando L1 se ne va, rimane L2, e lo scrittore deve ancora aspettare. Un flusso continuo di lettori potrebbe prolungarne l’attesa indefinitamente.",
    "L’ordine di arrivo colloca invece L2 dietro S. All’uscita di L1 il gruppo dei lettori attivi è vuoto e lo scrittore in testa ottiene l’esclusiva. Osservare il conteggio dei lettori proprio a quell’istante permette di riconoscere l’effetto della politica di ammissione a parità di richieste."
  ],
  '5.6.5': [
    "Per trasferire un valore tra due strutture condivise può essere necessario proteggerle entrambe per tutta la durata dell’operazione. A ogni struttura è associato qui un lock, un diritto di accesso esclusivo che il possessore mantiene fino al rilascio. Se due lavoratori prendono ciascuno un lock e aspettano il lock dell’altro, la possibilità di avanzare dipende da un rilascio che entrambi hanno rinviato.",
    "Nella sequenza in cui A inizia da X e B da Y, A arriva a chiedere Y mentre B aspetta X. Nel grafo delle dipendenze la freccia A → B indica che A può proseguire soltanto dopo un’azione di B. Le due frecce opposte formano un ciclo, che in queste condizioni corrisponde a uno stallo, o deadlock.",
    "Se ogni lavoratore comincia da X, B si ferma già alla prima richiesta, lasciando Y libero per A. L’ordine comune garantisce questa proprietà anche con più risorse quando a ognuna si assegna un rango e tutte le acquisizioni successive rispettano ranghi crescenti."
  ],
  '5.6.6': [
    "Fra due attività che si scambiano dati, il buffer conserva gli elementi finché qualcuno li ritira. Ciascun posto attraversa più stati. È libero finché un produttore lo prenota, rimane riservato finché quel produttore prepara il dato e diviene disponibile al consumatore quando il dato viene pubblicato. La presenza di un posto riservato incide già sulla disponibilità di spazio.",
    "Per esempio, un buffer da cinque posti senza elementi pubblicati può avere due produttori che hanno prenotato un posto ciascuno. Restano tre posti liberi, due riservati e zero dati pronti da ritirare. Se uno dei produttori pubblica il proprio dato, i posti liberi rimangono tre, mentre un posto passa dalla categoria dei riservati a quella dei pubblicati.",
    "La conservazione del numero totale di posti consente di controllare ogni passaggio della figura. Se un produttore viene sospeso, il posto assegnato resta in transito anche mentre il processore esegue un’altra attività. Per dedurre la disponibilità ai consumatori occorre quindi individuare il momento della pubblicazione."
  ],
  '5.6.7': [
    "Un buffer è uno spazio temporaneo in cui un produttore deposita dati che un consumatore preleverà. Quando i posti sono limitati, un contatore indica quanti sono disponibili per scrivere e un altro quanti contengono dati pronti da leggere. Inizialmente la somma dei due deve corrispondere alla capacità, se ogni posto ha uno dei due stati.",
    "Un semaforo contatore è il meccanismo che conserva una quantità di permessi e consente di acquisirli o restituirli. Il produttore acquisisce un permesso fra i vuoti e, dopo aver depositato il dato, ne rende disponibile uno fra i pieni. Il consumatore compie il percorso inverso.",
    "Con cinque posti e due dati pronti si contano tre vuoti e due pieni. Un’inserzione completa porta i conteggi a due vuoti e tre pieni. La capacità resta cinque, poiché il produttore ha cambiato la destinazione di un posto già esistente."
  ],
  '5.6.8': [
    "Per aggiungere un dato a un buffer condiviso, un produttore può prima riservare il posto e in seguito comunicare che il dato è pronto. Durante questo intervallo il posto è già indisponibile agli altri produttori e deve ancora essere annunciato ai consumatori. Il modello rende visibile questo passaggio intermedio.",
    "Un semaforo è il contatore attraverso il quale più partecipanti acquisiscono e restituiscono permessi. I due semafori, vuoti e pieni, contano soltanto i permessi pubblicati. Per misurare tutti i posti mentre un’operazione è in corso occorre tener conto anche dei permessi già acquisiti.",
    "Immaginiamo quattro posti tutti vuoti. Dopo una sola prenotazione si contano tre permessi su vuoti e zero su pieni. Il quarto posto è nelle mani del produttore. Quando questi pubblica il dato, il permesso compare tra i pieni. Seguendo il titolare del permesso si ricostruisce la capacità anche a metà dell’operazione."
  ],

  // 5.7 · Deadlock, starvation e livelock
  '5.7.1': [
    "Quando un lavoro attende una risorsa, per stabilire se potrà ripartire occorre sapere chi la possiede e chi potrebbe liberarla. Un grafo di assegnazione registra queste relazioni con frecce. Una freccia dal processo alla risorsa indica una richiesta, mentre una freccia dalla risorsa al processo indica un’assegnazione. Un’istanza è una singola unità disponibile di quel tipo di risorsa.",
    "Con una sola X e una sola Y, A possiede X e aspetta Y, che appartiene a B. B a sua volta aspetta X. Seguendo le frecce si torna al processo di partenza. Entrambi sono bloccati e ciascuno conserva ciò che ha ricevuto. Si produce così un deadlock, uno stallo in cui manca chi possa effettuare il rilascio necessario.",
    "Se di Y esistono due istanze, una può appartenere a C, che è in grado di terminare con ciò che possiede. Quando C libera la sua Y, A ottiene quanto gli serve e in seguito restituisce X a B. Per interpretare il ciclo occorre dunque contare le istanze e guardare anche ai possessori esterni al ciclo."
  ],
  '5.7.2': [
    "Uno stallo si può prevenire imponendo una regola prima che inizino le richieste. Le condizioni di Coffman descrivono quattro caratteristiche necessarie allo stallo fra risorse riutilizzabili. C’è esclusione mutua quando una risorsa serve un solo partecipante per volta. C’è possesso durante l’attesa quando chi chiede trattiene quanto ha già ottenuto. Mancanza di prelazione significa che il sistema lascia il rilascio al possessore. L’attesa è circolare quando ciascuno aspetta una risorsa in mano al successivo, fino al ritorno al primo.",
    "Una regola assegna alle risorse un ordine fisso, per esempio X prima di Y. Chi già possiede Y dovrebbe tornare indietro per richiedere X e il protocollo esclude proprio quella richiesta. Lungo una catena di acquisizioni i ranghi crescono, rendendo impossibile un ritorno al rango iniziale.",
    "L’altra regola concede insieme tutte le risorse richieste. Se A ha ottenuto X e Y, B aspetta finché entrambe sono libere. Lo zero accanto alle risorse possedute da B permette di riconoscere la condizione esclusa da questa seconda regola."
  ],
  '5.7.3': [
    "Prima di concedere risorse, il sistema può domandarsi se rimanga un ordine di completamento che permetta a tutti di finire, anche se ciascuno arriverà al massimo dichiarato. Questo è il test di sicurezza dell’algoritmo del banchiere. I due numeri di una coppia si riferiscono a risorse diverse, X e Y. Un’eccedenza di X lascia comunque scoperto un eventuale bisogno di Y.",
    "Per ogni processo si sottrae dal massimo la quantità già assegnata. B, che possiede una X e una Y e dichiara al massimo due X e una Y, richiede ancora una X e zero Y. Se inizialmente sono libere una X e una Y, si può dunque ipotizzare che B completi. A questo punto tornerebbero libere due X e due Y, poiché B ha restituito anche quelle che possedeva all’inizio.",
    "La prova ripete il ragionamento sul nuovo disponibile. Lo stato è sicuro se si riesce a collocare tutti i processi nella sequenza. Uno stato insicuro esprime l’assenza di questa garanzia rispetto ai massimi dichiarati. Per accertare un blocco già in corso servirebbero anche le richieste effettive."
  ],
  '5.7.4': [
    "In un sistema che gestisce transazioni, più modifiche vengono trattate come un’unica operazione da completare o da annullare. Mentre lavora, ciascuna transazione può riservarsi dati mediante lock esclusivi. Se A conserva il lock X aspettando Y e B conserva Y aspettando X, entrambi attendono una risorsa che l’altro tratterrà fino alla fine. Le richieste pendenti formano un ciclo che il gestore può rilevare.",
    "Per sciogliere lo stallo si può annullare una delle transazioni. Il rollback usa le informazioni registrate nel log, il registro delle modifiche, per ripristinare i dati interessati. Il gestore ritira quindi la richiesta della transazione annullata e libera i lock che essa possedeva. Questo rende il recupero compatibile con lo stato dei dati protetti.",
    "Se viene annullata A, scompare la sua richiesta di Y e X torna disponibile per B, che può completare. Scegliere B come vittima inverte i ruoli. Per leggere il grafo dopo il rollback occorre distinguere la freccia di richiesta cancellata dal lock effettivamente liberato."
  ],
  '5.7.5': [
    "Per capire se un servizio fa progressi conviene contare le richieste concluse e identificare i richiedenti che continuano ad aspettare. Nella starvation il sistema porta a termine del lavoro, mentre una particolare richiesta può restare esclusa indefinitamente. Nel livelock più partecipanti continuano ad agire in risposta l’uno all’altro e ripetono una sequenza che li riporta al punto di partenza.",
    "Se uno scrittore richiede accesso esclusivo mentre i lettori possono entrare a gruppi, un nuovo lettore può aggiungersi prima che l’ultimo esca. Dopo tre giri della prova, tre lettori hanno concluso e lo scrittore è ancora in attesa. Se il medesimo avvicendamento prosegue senza fine, almeno una lettura è sempre in corso.",
    "Nell’altra sequenza A e B tentano entrambi di acquisire il secondo lock, rinunciano insieme e insieme riprovano. Gli stati cambiano, eppure il conteggio delle operazioni completate resta a zero. I pochi giri della figura mostrano il meccanismo. La diagnosi di attesa indefinita presuppone che la sequenza continui a ripetersi."
  ],
  '5.7.6': [
    "Per studiare un insieme di lavori che si dividono una risorsa disponibile in più esemplari, si può tentare a mano una sequenza di completamento. Il bisogno residuo di un lavoro è quanto ancora gli manca. Se gli esemplari liberi bastano a coprirlo, è possibile immaginare che quel lavoro riceva il necessario, termini e restituisca l’intera propria dotazione.",
    "Si supponga che P possieda già due unità di una risorsa, che gliene manchi una e che due siano ancora libere. Si può concedere a P una delle due e lasciarlo terminare. Dopo la restituzione, le libere diventano quattro. Le due unità inizialmente libere sono di nuovo disponibili, e a esse si aggiungono le due che P possedeva prima del tentativo.",
    "Il test prosegue confrontando il bisogno di chi rimane con la nuova disponibilità. Nella figura ciascuna casella rappresenta un esemplare, mentre la lettera ne identifica il possessore. Per scegliere il primo candidato è sufficiente il confronto iniziale. I rilasci che seguirebbero servono a stabilire se il candidato scelto apra la strada anche agli altri."
  ],
  '5.7.7': [
    "Un grafo è un disegno di nodi uniti da frecce. Per studiare le attese, alcuni nodi rappresentano processi e altri le risorse di cui hanno bisogno. Seguendo la direzione delle frecce si distinguono i beni che un processo possiede da quelli per i quali deve ancora aspettare.",
    "Una freccia dal processo verso la risorsa indica una richiesta in attesa. Nel verso opposto indica che una specifica istanza è già stata assegnata. Un ciclo di frecce suggerisce dove cercare un’attesa circolare, mentre il conteggio delle istanze dice se qualcuno possa ancora sbloccarla.",
    "Se A trattiene l’unica stampante mentre aspetta l’unico scanner, e B trattiene lo scanner mentre aspetta la stampante, ciascuno dipende dal rilascio dell’altro. Se esiste una seconda istanza libera dello scanner, A può invece procedere e restituire la stampante. La forma del ciclo acquista significato insieme al numero delle istanze."
  ],
  '5.7.8': [
    "Per decidere se vi siano abbastanza risorse da far concludere tutti i processi, si può cercare un ordine nel quale ciascuno riceva ancora quanto gli serve e poi restituisca la propria dotazione. Nel modello del banchiere ogni processo dichiara in anticipo la quantità massima che potrà richiedere.",
    "Dal massimo dichiarato si sottraggono le unità che il processo possiede. Se quelle libere bastano a coprire la differenza, si può immaginare il suo completamento e aggiungere alla disponibilità iniziale ciò che il processo già deteneva. Su questa nuova disponibilità si ripete il calcolo.",
    "Con due unità libere, un processo che ne possiede tre e dichiara un massimo di cinque può ricevere le due mancanti. Quando termina, libera tutte e cinque le unità. Simulare questo completamento cambia le possibilità degli altri. L’ordine trovato dimostra che un’esecuzione completa è possibile secondo le ipotesi del modello."
  ],

  'modulo-5': [
    "Un programma che elabora dati ricevuti da un disco alterna due lavori diversi. Nei tratti di calcolo servono le istruzioni del processore, mentre durante una lettura è il dispositivo a svolgere il servizio richiesto. Sul core, l’unità che esegue le istruzioni, può quindi avanzare un secondo processo, cioè un’altra esecuzione dotata dei propri dati. Qui A deve calcolare per due millisecondi, leggere dal disco e calcolare per altri due. B richiede cinque millisecondi di solo calcolo.",
    "Il sistema raccoglie nella coda dei pronti i processi in grado di lavorare. Con la politica round-robin, chi esaurisce il tempo massimo concesso per turno, chiamato quanto, torna in fondo alla coda se ha ancora calcolo da compiere. Chi chiede il disco resta invece bloccato fino al completamento della lettura. Al risveglio A si accoda fra i pronti, anche se nel frattempo B si trova ancora sul core.",
    "Con un quanto di due millisecondi, A può completare il suo primo calcolo in un solo turno. Se il passaggio a B richiede un millisecondo, il core dedica alla sostituzione l’intervallo dal tempo 2 al tempo 3. Nel diagramma Δ indica il cambio, una lettera il processo in esecuzione e un punto l’inattività. La prima assegnazione è gratuita, come la ripresa dopo l’inattività. Se A si risveglia proprio mentre scade il turno di B, entra in coda prima che vi rientri B."
  ]
});
