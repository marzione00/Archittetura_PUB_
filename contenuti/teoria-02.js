'use strict';

Object.assign(SL.lezioni, {
  // 2.1 · Stato della macchina, registri e memoria
  '2.1.1': [
    "Mentre esegue un programma, il processore conserva i numeri sui quali sta lavorando in piccole memorie interne chiamate registri. Uno di questi, RAX, contiene 64 bit. Un bit è una cifra che può assumere i valori zero e uno. Il nome AL designa gli otto bit all’estremità destra di RAX. Questi bit formano un byte e rappresentano le unità e le potenze di due fino a 128, così che le loro combinazioni permettano di contare da 0 a 255.",
    "Il comando MOV AL, 254 scrive il numero 254 in AL. Quando segue ADD AL, 1, il processore somma uno al contenuto del registro e lo porta a 255. Un ulteriore incremento richiederebbe una nona cifra binaria. Poiché la destinazione ne contiene otto, gli otto bit che vi restano sono tutti zero.",
    "La macchina registra anche due informazioni sulla somma. Il segnale CF vale uno quando si genera un riporto oltre il byte, mentre ZF vale uno quando il byte ottenuto è zero. La riga dedicata a MOV conserva i segnali precedenti. È la riga di ADD a descrivere gli effetti del calcolo."
  ],
  '2.1.2': [
    "Un registro è una piccola memoria che il processore può leggere o scrivere per nome. Lo stesso registro a 64 bit, RAX, offre più punti di accesso. AL ne designa gli ultimi otto bit a destra, AX gli ultimi sedici ed EAX gli ultimi trentadue. Si tratta di porzioni sovrapposte dello stesso dato, così che modificare AL cambia anche il valore che si legge in AX.",
    "Il prefisso 0x introduce un numero scritto in base sedici. Le cifre da A a F valgono da dieci a quindici, e ogni coppia di cifre rappresenta un byte. Se gli otto byte di RAX valgono tutti FF, scrivere 0x12 in AL sostituisce soltanto l’ultima coppia. Scrivere lo stesso numero in AX produce 0012 nelle ultime quattro cifre, poiché la destinazione comprende due byte.",
    "In modalità a 64 bit, la scrittura in EAX ha un effetto ulteriore previsto dalle istruzioni x86. I quattro byte alti di RAX vengono azzerati. Nel risultato completo si può così distinguere la parte occupata dal dato da quella che la scelta del registro ha conservato o azzerato."
  ],
  '2.1.3': [
    "Per seguire un breve programma conviene attribuire un posto distinto a ogni registro, cioè a ciascuna delle piccole memorie interne del processore. EAX ed ECX possono contenere numeri uguali pur occupando posti diversi. Nella scrittura Intel l’istruzione nomina per prima la destinazione, sulla quale agirà il comando, e per seconda la sorgente, dalla quale ricaverà il dato.",
    "Se il valore iniziale è 4 e l’incremento vale 2, MOV colloca in EAX il numero 4 e ADD vi scrive la somma 6. Il successivo MOV ECX, EAX legge quel 6 e ne deposita una copia in ECX. Da questo istante entrambe le caselle contengono 6 e ciascuna può essere modificata separatamente.",
    "Nell’ultimo ADD la macchina legge EAX ed ECX prima di aggiornare la destinazione. EAX riceve dunque 12 e in ECX rimane 6. La riga in cui compare la copia è quella che spiega perché la seconda somma raddoppi il risultato intermedio."
  ],
  '2.1.4': [
    "Un processore può ospitare più circuiti capaci di fare somme. Ciascun circuito prende il nome di unità aritmetico-logica, abbreviato in ALU. In questa macchina ogni addizione si conclude in un ciclo, ossia nell’intervallo fra due battiti consecutivi del segnale che scandisce il lavoro. La durata del programma dipende sia dai circuiti disponibili sia dai numeri che occorrono per cominciare ciascun calcolo.",
    "Supponiamo che i registri R8 e R9 contengano 4 e 9. Aggiungere uno a R8 produce 5 e aggiungere uno a R9 produce 10. Poiché ogni incremento legge il proprio registro, due ALU possono eseguirli durante lo stesso ciclo. Per formare la somma 5 + 10, invece, occorre che entrambi gli incrementi siano terminati.",
    "Con una sola ALU gli incrementi occupano due cicli distinti e il terzo serve alla somma. Con due ALU il risultato è già pronto alla fine del secondo ciclo. Il numero 15 che compare nel registro R8 permette di controllare separatamente il risultato del programma e il tempo che ha richiesto."
  ],
  '2.1.5': [
    "Un registro a 64 bit contiene otto gruppi di otto cifre binarie, i byte. Per leggerne il contenuto si usa spesso la base sedici, nella quale una coppia di cifre rappresenta esattamente un byte. Le coppie di maggior peso si scrivono a sinistra. Il nome AX individua i due byte di minor peso del registro chiamato RAX.",
    "Per esempio, se gli ultimi tre byte di RAX sono 44 55 66 e si scrive 0x1234 in AX, quelle tre posizioni diventano 44 12 34. I byte più a sinistra di 44 conservano a loro volta il contenuto precedente. L’istruzione MOV copia un dato della larghezza indicata dalla destinazione, che in questo caso comprende precisamente quattro cifre esadecimali.",
    "Nella figura ogni coppia occupa una cella. Allineando le quattro cifre del nuovo dato all’estremità destra del registro, si riconosce il confine al quale fermare la sostituzione e si può ricomporre il valore completo del caso proposto."
  ],
  '2.1.6': [
    "Un’istruzione è un comando elementare che il processore esegue sui dati. Nel comando ADD EAX, 3, per esempio, EAX designa un registro, cioè una piccola memoria interna, e il 3 è una quantità già scritta nell’istruzione. Il nuovo valore deve prendere il posto del vecchio contenuto di EAX.",
    "L’unità di controllo riconosce il comando, il banco dei registri fornisce il vecchio contenuto di EAX e l’unità aritmetico-logica, abbreviata ALU, calcola la somma. Il percorso del dato permette così di distinguere i componenti che lo conservano da quello che lo trasforma.",
    "Se all’inizio EAX contiene 7, l’addizione vi deposita 10. Sapere quale risultato verrà scritto e determinare quanto tempo occorra per scriverlo sono due domande distinte. Un ciclo è l’intervallo fra due battiti del clock, il segnale che scandisce il lavoro dei circuiti."
  ],
  '2.1.7': [
    "Per abbreviare le letture, il processore conserva vicino a sé una copia di alcuni tratti di memoria in un deposito chiamato cache. Il tratto trasferito insieme prende il nome di linea. Gli indirizzi numerano i singoli byte, perciò un oggetto lungo più byte può trovarsi a cavallo di due linee.",
    "Quando tutte le linee hanno la stessa dimensione, la divisione dell’indirizzo per il numero di byte di una linea fornisce due informazioni. Il quoziente intero numerato da zero identifica la linea e il resto indica la posizione del byte al suo interno.",
    "Immaginando linee di sedici byte, gli indirizzi da 0 a 15 appartengono alla prima linea. Una lettura di quattro byte che parte da 14 riguarda 14, 15, 16 e 17. Il confronto fra il primo e l’ultimo indirizzo mostra che sono necessarie due linee, anche se il programma ha emesso una sola richiesta."
  ],

  // 2.2 · Aritmetica intera e flag di condizione
  '2.2.1': [
    "Una fila di otto bit offre 256 combinazioni. Se serve a contare oggetti, queste combinazioni valgono da 0 a 255. Se occorre rappresentare anche numeri negativi, la convenzione detta complemento a due assegna alle combinazioni da 128 a 255 i valori da −128 a −1, sottraendo 256. Perciò la stessa fila di otto cifre a uno può indicare sia 255 sia −1.",
    "In un’addizione il circuito somma le cifre e conserva tante posizioni quante ne contiene il registro. A otto bit, 127 + 1 produce 10000000. Come conteggio senza segno il valore 128 entra esattamente nel registro. Letto con segno, lo stesso disegno significa −128, mentre la somma matematica dei due addendi era positiva.",
    "Due segnali distinti annotano questi eventi. CF indica il riporto oltre l’ultima posizione, mentre OF segnala che la somma con segno è uscita dall’intervallo rappresentabile. Passando a sedici bit cambia il peso della posizione di segno e quindi cambia anche l’interpretazione degli stessi ingressi numerici."
  ],
  '2.2.2': [
    "Quando un programma chiama una funzione, deve consegnarle i numeri con cui lavorare. La convenzione System V usata qui assegna ai primi tre argomenti interi a 32 bit tre registri del processore, chiamati EDI, ESI ed EDX. Un registro è una piccola memoria interna. Al termine della funzione il chiamante cerca il risultato intero in un quarto registro, EAX.",
    "Per calcolare a × b + c conviene usare EAX anche per il prodotto intermedio. Con a uguale a 3, b a −2 e c a 5, MOV EAX, EDI copia il primo fattore in EAX. L’istruzione IMUL EAX, ESI moltiplica i due interi con segno e sostituisce il 3 di EAX con −6.",
    "Il terzo argomento, rimasto in EDX durante la moltiplicazione, è ancora disponibile quando arriva ADD. La somma con 5 porta EAX a −1. La successione dei valori in EAX rivela a quale passaggio dell’espressione corrisponda ciascuna scrittura."
  ],
  '2.2.3': [
    "Distribuendo diciassette oggetti in gruppi completi di cinque si ottengono tre gruppi e avanzano due oggetti. Il primo numero è il quoziente intero, il secondo è il resto, che deve essere minore del divisore. Il processore può calcolare entrambi con una sola istruzione, DIV, destinata alla divisione di numeri senza segno.",
    "Nella forma DIV RCX il registro RCX contiene il divisore. Il numero da dividere occupa una coppia di registri, RDX e RAX, accostati come due metà di un unico numero. Ponendo a zero RDX, che è la metà di maggior peso, si ottiene un dividendo uguale al numero scritto in RAX. Terminata la divisione, RAX contiene il quoziente e RDX il resto. Il controllo 3 × 5 + 2 = 17 ricostruisce il dividendo.",
    "Un divisore uguale a zero impedisce di formare i gruppi. In questo caso il processore segnala un’eccezione, ossia un evento che interrompe l’istruzione, indicata con #DE. I valori ancora visibili nei due registri appartengono allo stato precedente."
  ],
  '2.2.4': [
    "La memoria è una successione di byte numerati. Per trovare rapidamente un dato, il processore sa calcolare un indirizzo sommando un numero di partenza, un secondo numero moltiplicato per una scala e una correzione fissa. L’istruzione LEA, il cui nome significa «carica l’indirizzo efficace», deposita questo calcolo in un registro. Il numero ottenuto può anche servire come termine di un’espressione aritmetica.",
    "Poiché le scale disponibili sono 1, 2, 4 e 8, il prodotto per sette si costruisce prendendo otto volte il fattore e sottraendolo una volta. Per a = 3 si passa da 24 a 21. Il prodotto per tre si ottiene invece sommando il secondo fattore al proprio doppio. Se b vale 2, questo termine vale 2 + 4, ossia 6.",
    "La correzione fissa −4 si applica alla somma dei due termini. Nel registro RAX arriva quindi 21 + 6 − 4. Le quantità intermedie permettono di riconoscere l’origine dei coefficienti anche quando il programma contiene soltanto somme, scale e una sottrazione."
  ],
  '2.2.5': [
    "Un programma può scegliere l’istruzione successiva consultando un piccolo segnale memorizzato nel processore. Il segnale chiamato ZF, abbreviazione di zero flag, vale uno quando il risultato dell’ultima operazione che lo aggiorna è zero. Il comando JZ usa quel segnale per saltare a un indirizzo stabilito. Quando ZF vale zero, l’esecuzione continua in ordine.",
    "Due istruzioni possono lasciare lo stesso numero in EAX, un registro a 32 bit, pur producendo effetti diversi sul segnale. ADD EAX, 1 prende il valore contenuto in EAX, somma uno e aggiorna ZF. LEA EAX, [RAX+1] calcola lo stesso incremento mediante il circuito di calcolo degli indirizzi e conserva lo ZF che trovava all’ingresso.",
    "Con EAX inizialmente uguale a 5 e ZF a uno, entrambe le operazioni scrivono 6. Dopo ADD il successivo JZ prosegue in ordine, perché l’addizione ha prodotto 6. Dopo LEA lo stesso salto trova ancora il valore uno lasciato da un’operazione precedente."
  ],
  '2.2.6': [
    "Sottrarre uno dal numero 128 dà 127. Per capire i segnali che accompagnano la sottrazione, tuttavia, bisogna prima sapere con quante cifre binarie si stanno rappresentando i numeri. In otto bit il disegno di 128 è 10000000. Se si leggono gli stessi bit come un intero con segno in complemento a due, quel disegno rappresenta −128, il valore minimo.",
    "L’istruzione SUB trattiene gli otto bit di minor peso della differenza. Calcolando 10000000 meno uno si ottiene 01111111, il cui valore è 127. Nella lettura con segno la differenza matematica sarebbe −129, che richiederebbe più spazio. Il segnale OF registra questo superamento. CF risponde a una domanda distinta, ossia se per sottrarre i due valori senza segno occorresse un prestito oltre la posizione più alta.",
    "Il segnale SF copia il bit più a sinistra del risultato conservato, mentre ZF indica che il risultato è zero. Se la larghezza passa a sedici bit, il bit che determina il segno si trova più a sinistra e il numero 128 iniziale diventa positivo anche nella lettura con segno."
  ],
  '2.2.7': [
    "Una funzione può prima calcolare un risultato provvisorio e poi scegliere se restituirlo o cambiarne il segno. Nella funzione score, a e c determinano il candidato 7a + c. A decidere il percorso è invece b, interpretato come intero senza segno e confrontato con la soglia dieci.",
    "Con a = 3 e c = 2, il calcolo prende otto volte 3, sottrae 3 e aggiunge 2, ottenendo 23. L’istruzione CMP b, 10 esamina la sottrazione b − 10 per aggiornare i segnali del processore. Quando b vale 9, la sottrazione senza segno richiede un prestito e il segnale CF si accende. JB, che significa «salta se inferiore» per gli interi senza segno, legge proprio CF.",
    "Con il salto preso il programma conserva 23. Ponendo b uguale a 10, il confronto dà uguaglianza e il percorso raggiunge l’operazione che rende il candidato opposto, pari a −23. Per decidere dove collocare il caso di uguaglianza conviene seguire la condizione precisa del salto."
  ],
  '2.2.8': [
    "Il processore dispone di un circuito che sa sommare una base e un indice moltiplicato per una scala. I termini base e indice indicano semplicemente due numeri letti dai registri, che sono piccole memorie interne. L’istruzione LEA registra la somma così formata. Dal momento che le scale ammesse comprendono 2, 4 e 8, il circuito permette anche di costruire prodotti a partire da poche somme.",
    "Per esempio, se un registro contiene 4, una prima LEA che combini il valore con il suo doppio produce 4 + 8, cioè 12. Finché il registro di partenza conserva 4 e un altro contiene 12, una seconda istruzione può usare quei due numeri in ruoli diversi. Scegliendo 12 come base e 4 come indice con scala 4, si otterrebbe 12 + 16.",
    "Nel problema la seconda LEA ha una propria scelta di base, indice e scala. Per leggerla, conviene tenere separati il valore iniziale e il risultato della prima istruzione, quindi applicare il fattore di scala soltanto al numero che occupa la posizione di indice."
  ],
  '2.2.9': [
    "Nel linguaggio del processore ogni nome di registro, per esempio EAX, designa un piccolo spazio che conserva un numero. Quando un’operazione scrive in quello stesso spazio, per poter recuperare il valore iniziale occorre averne fatto una copia. IMUL calcola un prodotto e ADD una somma.",
    "Nella sintassi Intel il primo operando è la destinazione delle operazioni qui mostrate. Il comando CMP confronta due numeri e registra l’esito in alcuni bit di stato detti flag. Un comando CMOV, cioè una copia condizionale, usa quei bit per decidere se riscrivere la destinazione.",
    "Se EAX contiene 3 e il programma ne copia il contenuto in un secondo registro prima di moltiplicarlo per 4, dopo la moltiplicazione sono disponibili sia 12 sia 3. Mediante una copia condizionale, invece, il processore può conservare il primo candidato o sostituirlo con il secondo in base al confronto."
  ],
  '2.2.10': [
    "Per scegliere il minore tra due quantità, un programma può conservare provvisoriamente la prima in un registro. Il comando CMP valuta una sottrazione per stabilire l’ordine e ne conserva gli indizi in piccoli indicatori binari, i flag. La copia condizionale consulta quegli indicatori.",
    "Il flag CF registra il prestito che occorrerebbe per sottrarre il secondo intero senza segno dal primo. ZF vale uno quando la differenza è zero. Perché il primo intero sia strettamente maggiore del secondo devono dunque valere zero entrambi i flag.",
    "Se il primo candidato vale 9 e il secondo 4, la sottrazione 9 − 4 termina senza prestito e con un risultato diverso da zero. La condizione «sopra» è vera e il primo candidato può essere sostituito con 4. Se entrambi valgono 9, il flag di zero distingue l’uguaglianza dal caso appena descritto."
  ],

  // 2.3 · Indirizzi, array e disposizione dei dati
  '2.3.1': [
    "La memoria conserva i dati in celle numerate. Ogni cella contiene un byte, cioè otto cifre binarie, e il suo numero è l’indirizzo. Per leggere un intero servono dunque due indicazioni, l’indirizzo del primo byte e il numero di byte che appartengono al dato. La stessa cella può essere il punto di partenza di letture di ampiezza diversa.",
    "Il prefisso 0x introduce la scrittura esadecimale, nella quale una coppia di cifre rappresenta un byte. All’indirizzo iniziale 0x1000 il modello conserva 02 e, nella cella successiva, 11. Con l’ordine detto little-endian il byte trovato per primo ha il peso minore. Letti insieme, quei due byte valgono 2 + 17 × 256 = 4354, che si scrive 0x1102.",
    "Se la lettura comprende un solo byte, entra nel registro EAX il valore 2. L’istruzione MOVZX completa con zeri le posizioni rimaste libere del registro a 32 bit. Le cifre che EAX mostra a sinistra dipendono quindi anche dall’ampiezza dell’accesso."
  ],
  '2.3.2': [
    "Gli indirizzi di memoria contano byte, mentre la posizione in una raccolta conta elementi. Se ogni elemento è un intero di quattro byte, dalla posizione zero alla posizione tre ci sono dodici byte. La distanza fra l’inizio di due elementi consecutivi prende il nome di passo. Moltiplicare l’indice per il passo traduce il conteggio degli elementi nell’unità usata dalla memoria.",
    "L’istruzione LEA costruisce un indirizzo efficace, cioè il numero che individua la cella desiderata. Nel modello RDI è il registro che conserva la base, RSI quello che conserva l’indice. Con la base a 4096, l’indice a 3, la scala a 4 e uno spiazzamento supplementare di 8 byte, il calcolo è 4096 + 12 + 8 = 4116.",
    "La scrittura 0x1014 è la forma esadecimale di 4116. L’ultimo termine si aggiunge una sola volta, perché esprime già una distanza in byte. Per vedere il contenuto della cella indicata servirebbe un successivo caricamento dalla memoria."
  ],
  '2.3.3': [
    "Una matrice si disegna su un foglio come una tabella di righe e colonne. In memoria, dove ogni byte segue il precedente, occorre scegliere un ordine per disporre gli elementi. Il linguaggio C colloca in sequenza tutti gli elementi della prima riga, poi quelli della seconda e così via. Gli indici di riga e colonna partono da zero.",
    "Qui ogni riga ospita cinque numeri interi da quattro byte. Per raggiungere la riga di indice 1 occorre quindi oltrepassare cinque elementi, cioè venti byte. La colonna di indice 2 richiede altri due elementi, pari a otto byte. La posizione [1][2] comincia così ventotto byte dopo l’inizio della matrice.",
    "La base è 0x3000, dove il prefisso 0x indica la scrittura in base sedici. Ventotto si scrive 1C in quella base, per cui il primo byte cercato si trova a 0x301C. Nella figura il passaggio alla riga successiva vale sempre venti byte, mentre lo spostamento di una colonna ne vale quattro."
  ],
  '2.3.4': [
    "Una struttura C riunisce in un solo oggetto dati che possono avere dimensioni diverse. Nella disposizione System V AMD64 qui considerata, il tipo char occupa un byte e il tipo int ne occupa quattro. Un int richiede allineamento a quattro, ossia deve cominciare a un indirizzo divisibile per quattro. Il compilatore rispetta questa regola anche quando i dati sono elencati uno dopo l’altro nel programma.",
    "Supponiamo che la struttura cominci all’indirizzo 0x4000 e contenga prima il char. Dopo il suo unico byte, il primo indirizzo adatto all’int è 0x4004. Le tre posizioni lasciate fra i due membri sono byte di riempimento, detti padding. Contano nella dimensione della struttura e nessuno dei due membri li usa per il proprio valore.",
    "Se l’int precede il char, il primo membro occupa i byte da 0 a 3 e il secondo il byte 4. Questa volta le tre posizioni di riempimento si trovano in coda, affinché, in una successione di strutture uguali, l’int successivo cominci di nuovo a un indirizzo allineato."
  ],
  '2.3.5': [
    "In C un puntatore è un valore che permette di designare un oggetto attraverso il suo indirizzo. Scrivere *p significa accedere all’oggetto indicato da p. Due puntatori possono avere nomi distinti e tuttavia portare allo stesso intero. In quel caso una scrittura eseguita attraverso il primo sarà visibile a chi legga attraverso il secondo. Questa coincidenza prende il nome di aliasing.",
    "L’array del modello contiene quattro interi, inizialmente pari a 10, 20, 30 e 40. Se p e q indicano entrambi l’elemento di indice 1, la scrittura di 99 attraverso q sostituisce il 20. La successiva lettura attraverso p restituisce quindi 99. Se q indica l’elemento successivo, a cambiare è il 30 e p continua a leggere 20.",
    "Un puntatore può anche indicare il limite immediatamente successivo all’array, che qui corrisponde all’indice 4. Serve a riconoscere la fine di un percorso. Il programma verifica tale limite prima della scrittura, perché a quella posizione l’array ha esaurito i propri elementi."
  ],
  '2.3.6': [
    "Per essere eseguita, un’istruzione deve diventare una sequenza di byte che il processore sappia interpretare. Alcuni byte identificano l’operazione, altri dicono dove reperire i dati. Per un indirizzo ottenuto da una base e da un indice moltiplicato per una scala, la codifica x86 può includere il byte SIB, il cui nome deriva dai termini inglesi scale, index e base, ossia scala, indice e base.",
    "Il byte si divide in tre campi, ossia in tre gruppi di cifre binarie. I primi due bit a sinistra contengono l’esponente della scala. Se valgono 10 in binario, l’esponente è 2 e la scala è 2², cioè 4. I tre bit seguenti, 001, scelgono il registro indice RCX. Gli ultimi tre, 011, scelgono il registro base RBX.",
    "Nel codice 8B 04 8B il primo byte identifica un caricamento e il secondo annuncia il SIB. L’ultimo 8B deriva proprio dai campi 10, 001 e 011. Se RBX contiene 0x6000 e RCX contiene 3, l’istruzione leggerà dodici byte oltre la base, cioè all’indirizzo 0x600C."
  ],
  '2.3.7': [
    "Un array conserva elementi dello stesso tipo in posizioni contigue. La sua base è l’indirizzo del primo byte del primo elemento. Poiché in C l’indice iniziale vale zero, un indice esprime anche il numero di elementi interi che occorre oltrepassare. Agli indirizzi di memoria si aggiunge una distanza in byte, che si ricava moltiplicando quell’indice per la dimensione di ciascun elemento.",
    "In un array di interi da quattro byte con base 0x1000, per esempio, l’elemento di indice 3 comincia dopo dodici byte. In esadecimale dodici si scrive C, per cui il primo dei quattro byte cercati è a 0x100C e l’ultimo è a 0x100F. L’elemento seguente comincia a 0x1010.",
    "Nel disegno del problema ogni casella rappresenta un intero completo. Per interpretare la distanza mostrata conviene leggere ogni salto tra caselle come un avanzamento di quattro indirizzi e conservare la base assegnata al caso."
  ],
  '2.3.8': [
    "La memoria può essere immaginata come una fila di celle numerate, ciascuna capace di contenere un byte. L’indirizzo è il numero della cella. Un puntatore è un valore che il programma interpreta a sua volta come indirizzo. Per questo una lettura può fornire l’indicazione per localizzarne una seconda.",
    "In una tabella di puntatori le celle contengono indirizzi di altri oggetti. La larghezza del puntatore stabilisce quanti byte leggere dalla tabella, mentre il tipo dell’oggetto stabilisce quanti byte leggere una volta raggiunta la destinazione.",
    "Se all’indirizzo 80 si trova un puntatore che vale 200, la prima lettura recupera il numero 200. Per ottenere il dato a cui punta occorre leggere nella cella 200 con la larghezza prevista per quel dato. Copiare un numero dal primo indirizzo e usarlo al secondo sono due operazioni distinte."
  ],
  '2.3.9': [
    "Un byte ammette 256 combinazioni, insufficienti a rappresentare molti valori di uso comune. Il processore può affiancare due byte formando una parola. Quando copia questa parola in un registro più largo, deve stabilire quale configurazione scrivere nei posti aggiuntivi.",
    "In x86 il termine word indica una parola di sedici bit. Gli otto bit di peso minore occupano l’indirizzo minore. Le istruzioni MOVZX e MOVSX possono allargare la parola fino ai trentadue bit del registro EAX. La scelta dell’istruzione determina il contenuto dei sedici bit aggiunti.",
    "Con i byte 00 e 80 in ordine di indirizzo, la parola è 0x8000. MOVZX riempie di zeri le posizioni superiori e dà 0x00008000. MOVSX vi replica il bit più alto della parola e dà 0xFFFF8000. In questo modo la prima istruzione conserva il valore senza segno e la seconda quello con segno."
  ],

  // 2.4 · Operazioni bit a bit, scorrimenti e maschere
  '2.4.1': [
    "Scorrere a destra un byte significa spostare ognuna delle sue otto cifre binarie verso una posizione di peso minore. La cifra all’estrema destra esce dal byte e a sinistra si apre una posizione. La scelta della cifra con cui riempirla dipende dal significato che si dà al dato di partenza.",
    "L’istruzione SHR, scorrimento logico a destra, inserisce uno zero. SAR, scorrimento aritmetico a destra, ricopia invece il bit più a sinistra, che nel complemento a due indica il segno. Per esempio il byte 11111101, che vale 253 senza segno e −3 con segno, diventa 01111110 con SHR di una posizione. Con SAR diventa 11111110, che come intero con segno vale −2.",
    "Il valore −2 si comprende osservando che −3 diviso per due dà −1,5 e che lo scorrimento aritmetico arrotonda verso l’intero inferiore. Nelle due righe il segnale CF registra l’ultimo bit uscito a destra. Per questo byte, con uno spostamento di una posizione, vale uno in entrambi i casi."
  ],
  '2.4.2': [
    "Sul foglio si può contrassegnare una posizione tracciando un segno nella casella scelta. In un registro del processore lo stesso compito si svolge con una maschera, ossia con un disegno di bit nel quale una cifra uno identifica la posizione desiderata. Le cifre si numerano da destra a partire da zero, così che la posizione del bit corrisponda all’esponente della potenza di due che esso rappresenta.",
    "Il registro RAX ospita sessantaquattro bit. Partendo dal valore uno, l’istruzione SHL RAX, CL sposta la cifra accesa verso sinistra del numero di posti contenuto in CL, un altro piccolo registro. Con uno spostamento di otto posti la cifra passa dalla posizione 0 alla posizione 8 e il valore diventa 256, scritto 0x100 in base sedici.",
    "La separazione in gruppi di otto bit rende leggibile il passaggio di confine. La posizione 7 è l’ultima del byte numero zero, la posizione 8 è la prima del byte numero uno. Dividendo la posizione per otto, il quoziente indica il byte e il resto la posizione interna."
  ],
  '2.4.3': [
    "In una sola casella di memoria da un byte si possono conservare due piccoli numeri, purché ciascuno richieda al massimo quattro bit. Quattro bit formano un semibyte e corrispondono a una cifra esadecimale, che può valere da zero a quindici. Nella scrittura 0xBA, per esempio, B è la cifra alta e A quella bassa.",
    "Il programma preleva la cifra bassa da ciascuna delle due sorgenti. Per farlo applica AND con 0x0F, una maschera i cui quattro bit inferiori valgono uno. AND mantiene un bit soltanto dove entrambe le cifre confrontate valgono uno. Applicando la maschera a 0xBA e 0x25 si ottengono quindi 0x0A e 0x05.",
    "Il primo gruppo deve occupare le quattro posizioni superiori del byte finale. Lo scorrimento a sinistra di quattro posti lo porta a 0xA0. OR riunisce le due file, accendendo ciascuna posizione che contenga un uno in almeno una sorgente. Poiché i gruppi occupano spazi disgiunti, il risultato si legge direttamente come 0xA5."
  ],
  '2.4.4': [
    "Un formato può assegnare alcune cifre binarie consecutive a una sola informazione, per esempio al numero di un canale. Questo gruppo è un campo. Per leggerlo occorre sia delimitarne i confini nella parola che lo contiene, sia ricondurre la sua prima cifra alla posizione delle unità. Le posizioni si numerano da destra e la prima ha indice zero.",
    "Con un campo di tre bit si parte da 111 in binario, che vale sette e si ottiene con 2³ − 1. Se il campo comincia alla posizione 4, spostare la maschera di quattro posti verso sinistra produce 01110000. L’operazione AND conserva, fra i bit della parola, quelli che cadono sotto gli uno della maschera.",
    "Prendiamo la parola 0x1234, scritta in base sedici. Mascherando con 0x0070 rimane 0x0030. Questo valore conserva la posizione che il campo occupava nella parola. Uno scorrimento di quattro bit a destra lo riporta sulle unità, dove si legge il numero 3."
  ],
  '2.4.5': [
    "Per rappresentare un comando mediante un numero si può riservare un gruppo di bit a ogni sua parte. Nel formato didattico di questa figura il comando occupa sempre 32 bit. Sei specificano l’operazione da eseguire, cinque identificano il primo registro, altri cinque il secondo. I sedici bit restanti custodiscono un valore immediato, cioè un numero scritto direttamente nell’istruzione. La macchina x86 usa formati propri di lunghezza variabile.",
    "Ciascun numero entra nel suo spazio spostandosi verso sinistra del numero di posizioni che lo precedono a destra. Se il codice operativo vale 1 e gli altri campi valgono zero, si accende il bit 26. Se a questo comando si aggiunge un immediato pari a 3, si accendono anche i due bit all’estrema destra.",
    "I gruppi occupano intervalli distinti. I contributi si possono quindi unire senza che due campi modifichino la stessa cifra. La decodifica compie il percorso inverso, riportando ogni gruppo a destra e tenendo soltanto il numero di bit stabilito dal formato."
  ],
  '2.4.6': [
    "Un byte contiene otto cifre binarie e si può rappresentare con due cifre in base sedici. Ciascuna corrisponde a un gruppo di quattro bit, detto semibyte. Il gruppo alto occupa la metà sinistra. Quando si vuole usare il suo contenuto come numero da zero a quindici, occorre prima separarlo dalla metà destra e poi portarlo nella posizione delle unità.",
    "Nel byte 0x6D, per esempio, il gruppo da recuperare è 0110 e quello da scartare è 1101. La maschera 11110000 vale 0xF0. Applicando AND rimane 01100000, perché la maschera lascia passare le cifre di sinistra e azzera quelle di destra. In questa fase il numero scritto nel byte è ancora sedici volte il valore del gruppo.",
    "Lo scorrimento logico di quattro posizioni verso destra trasforma 01100000 in 00000110, il cui valore è sei. Nel problema cambiano le cifre del dato iniziale. Restano identificabili le due operazioni, una che seleziona e una che ristabilisce il peso corretto delle cifre."
  ],
  '2.4.7': [
    "Quando un registro contiene più piccoli valori, ciascuno occupa un gruppo di bit chiamato campo. Una maschera indica con cifre uno le posizioni di interesse. AND conserva una posizione se entrambi gli ingressi valgono uno. OR vi scrive uno se almeno uno dei due lo vale.",
    "La posizione più a destra ha indice zero. Quando un campo comincia più a sinistra, il suo nuovo valore va spostato prima di applicare OR. Per controllare la scrittura si può percorrere la strada inversa, isolando il campo e riportandolo nelle posizioni di peso minore, dove il suo valore è più facile da leggere.",
    "Nel byte 11110000 si possono sostituire i due bit più a destra con 01. Dopo la pulizia delle posizioni il byte vale ancora 11110000, perché in origine erano già vuote. Inserendo il nuovo campo si ottiene 11110001. Isolare di nuovo le due posizioni permette di verificare la scrittura senza confonderla con il valore dell’intero registro."
  ],
  '2.4.8': [
    "Un indirizzo è allineato a otto byte se il suo numero è un multiplo di otto. Qualora un’area debba iniziare più avanti dell’indirizzo disponibile, si cerca il primo multiplo uguale o superiore. Azzerare direttamente i bit inferiori darebbe il multiplo precedente.",
    "Per un allineamento A che sia una potenza di due, i numeri multipli di A terminano con un numero fisso di zeri binari. Otto è 2³, quindi occorrono tre zeri. Sommare A − 1 e cancellare gli ultimi bit arrotonda verso l’alto, purché la somma sia rappresentabile nel registro.",
    "Per portare 19 al successivo multiplo di otto si aggiunge prima 7, ottenendo 26, poi si cancellano gli ultimi tre bit, ottenendo 24. Se si parte da 24, lo stesso procedimento restituisce 24. Questi due casi spiegano sia la scelta di aggiungere A − 1 sia la necessità di controllare gli indirizzi già allineati."
  ],

  // 2.5 · Chiamate di sistema Linux e confine tra utente e kernel
  '2.5.1': [
    "Un programma in esecuzione, chiamato processo, lavora entro uno spazio di memoria che il sistema operativo gli assegna. Quando vuole scrivere su un file, deve chiedere al kernel, la parte del sistema che controlla gli accessi alle risorse. Una chiamata di sistema è il passaggio attraverso il quale il programma formula la richiesta e il kernel la prende in carico.",
    "In Linux su x86-64 il registro RAX, una piccola memoria interna del processore, ospita il numero del servizio. Per write questo numero è 1. In altri tre registri il programma indica dove scrivere, a quale indirizzo si trovano i byte del messaggio e quanti ne offre. All’esecuzione di SYSCALL, il processore conserva in RCX l’indirizzo a cui riprendere e in R11 i segnali di stato del chiamante.",
    "Dopo una scrittura completa di otto byte, in RAX si legge 8. Per getpid il programma parte invece dal numero di servizio 39 e ritrova in RAX l’identificatore del processo, qui 417. È dunque il momento in cui si osserva il registro a stabilire se quel numero designi una richiesta o una risposta."
  ],
  '2.5.2': [
    "Se due parti di un programma si scambiano sei numeri, un accordo sull’ordine permette al destinatario di identificarli anche quando mancano i nomi delle variabili. Nel codice macchina questo accordo prende il nome di ABI, interfaccia binaria. Stabilisce anche la posizione fisica degli argomenti, per esempio in quali registri, le piccole memorie interne del processore, il chiamante debba depositarli.",
    "Una funzione C che segue la convenzione System V per questi sei interi li riceve, nell’ordine, in RDI, RSI, RDX, RCX, R8 e R9. Per chiedere al kernel Linux un servizio mediante l’istruzione SYSCALL, l’ordine dei numeri rimane quello della richiesta, mentre la quarta sede diventa R10. Il processore usa infatti RCX per conservare l’indirizzo al quale riprenderà l’esecuzione.",
    "La breve funzione di raccordo, chiamata wrapper, effettua la copia prima di entrare nel kernel. Se il quarto argomento vale 34, il percorso parte da RCX con 34 e arriva a R10 con 34. Per il terzo argomento la sede RDX è già quella attesa dal kernel."
  ],
  '2.5.3': [
    "Per copiare un file si può leggere una porzione di dati in un buffer, ossia in un tratto di memoria riservato a quei byte, e poi inviarla alla destinazione. In Linux un piccolo numero intero, detto descrittore, individua il file aperto. La chiamata read indica il descrittore di ingresso, l’indirizzo del buffer e il numero massimo di byte che può ricevere.",
    "Supponiamo che il programma chieda otto byte e che nel file ne restino cinque. La lettura restituisce cinque, quanti sono i byte effettivamente collocati nel buffer. Su un file ordinario, con una richiesta positiva, un ritorno zero indica che si è raggiunta la fine. Per preparare write si usa il conteggio restituito da read, così che la richiesta comprenda soltanto dati appena acquisiti.",
    "Se la prima write accetta due dei cinque byte, ne restano tre da emettere. Con un buffer che inizia a 0x7000, il primo byte pendente si trova a 0x7002. Indirizzo e conteggio descrivono insieme la parte di messaggio che attende ancora la scrittura."
  ],
  '2.5.4': [
    "Un processo è il soggetto al quale il sistema assegna un’identità, indicata dal numero PID. La sua immagine comprende il programma in esecuzione e le regioni di memoria che contengono codice e dati. Una regione resa accessibile a determinati indirizzi del processo si chiama mappatura. La chiamata di sistema execve permette al medesimo processo di proseguire eseguendo un altro programma.",
    "Supponiamo che il processo numero 417 stia eseguendo A. Se il file richiesto contiene l’eseguibile valido B, il kernel installa la nuova immagine. La pagina privata che apparteneva ad A viene rilasciata. Il registro RIP, che identifica l’indirizzo della prossima istruzione, indica ora l’ingresso di B, posto in questo esempio a 0x501000. Il PID continua a valere 417.",
    "Se manca il file, la ricerca si arresta prima della sostituzione. La vecchia pagina è ancora presente e RIP torna al punto di ripresa di A. Il risultato −2 della chiamata diretta corrisponde a ENOENT, il nome con cui Linux identifica in questo caso l’assenza del file."
  ],
  '2.5.5': [
    "Quando un processo apre un file, il kernel gli assegna un descrittore, cioè un piccolo intero che funge da indice in una tabella. La voce così individuata rinvia a una descrizione di file aperto. Fra le informazioni conservate nella descrizione c’è l’offset, la distanza in byte dall’inizio del file alla posizione da cui partirà la prossima lettura ordinaria.",
    "La chiamata dup crea un secondo descrittore che rinvia alla medesima descrizione. Se dal descrittore 3 si leggono i primi tre byte del file, l’offset avanza da 0 a 3. Una lettura attraverso il descrittore 4, ottenuto con dup, comincia allora dal byte di indice 3, perché segue il medesimo cursore.",
    "Anche una seconda open può produrre un descrittore 4 riferito allo stesso file. Questa volta, però, il kernel crea una descrizione distinta con il proprio cursore. Mentre il primo avanza, il secondo resta a zero fino alla sua prima lettura. Le due configurazioni mostrano perché il nome del file, da solo, sia insufficiente a stabilire quale byte verrà letto."
  ],
  '2.5.6': [
    "Quando un programma termina, il sistema operativo può trasmettere a chi lo ha avviato un piccolo numero che ne riassume l’esito. Il processo che termina si chiama figlio, quello che ne raccoglie l’esito si chiama genitore. Nel caso illustrato il figlio esegue un solo flusso di istruzioni e la chiamata Linux exit ne conclude l’esecuzione.",
    "Il figlio colloca il numero 60, che identifica exit per Linux x86-64, nel registro RAX e il codice richiesto nel registro RDI. Il genitore usa waitpid per attendere il figlio e ricevere una parola di stato. Questa parola contiene anche informazioni sulla modalità di terminazione. Dopo avere accertato che la terminazione è normale, WEXITSTATUS ne estrae il codice disponibile al genitore.",
    "Per il codice sono disponibili otto bit, sufficienti per 256 valori. Se il figlio richiede 260, la parte conservata vale 260 − 256, cioè 4. Il numero che si legge nella parola di stato grezza può avere un aspetto differente, poiché Linux colloca il codice in un campo interno che WEXITSTATUS riporta sulle unità."
  ],
  '2.5.7': [
    "Un programma che invia dati a un file o a un altro destinatario consegna al kernel l’indirizzo iniziale di un buffer, il descrittore della destinazione e il numero di byte che intende scrivere. Il buffer è un tratto di memoria nel quale il messaggio occupa celle consecutive. Al ritorno, un risultato positivo della chiamata write conta i byte del prefisso che il kernel ha accettato.",
    "Se il buffer contiene SALUTO e una prima richiesta di sei byte ne trasferisce quattro, risultano già inviati S, A, L e U. Il prossimo tentativo deve partire dalla quinta lettera, T, che si trova a quattro byte di distanza dall’inizio. La parte ancora da scrivere comprende T e O.",
    "Per riprendere il trasferimento si fanno quindi due aggiornamenti coordinati. All’indirizzo iniziale si aggiunge la quantità già accettata e dal conteggio offerto si sottrae la stessa quantità. Applicando il ragionamento ai byte della figura si può individuare sia la prima cella da cui ripartire sia l’estensione del tratto residuo."
  ],
  '2.5.8': [
    "Un programma può chiedere al sistema operativo di trasferire alcuni byte tra un file e una regione di memoria, detta buffer. La quantità desiderata indica il limite della richiesta. Per proseguire il lavoro il programma deve conoscere quanti byte sono stati effettivamente trasferiti.",
    "Nella convenzione di Linux x86-64 per le chiamate read e write, RDX porta il conteggio richiesto e RAX riceve l’esito. Un valore positivo al ritorno conta i byte davvero trasferiti. La capacità del buffer indica invece lo spazio disponibile, che può essere maggiore di entrambe le quantità.",
    "Se si chiede di scrivere sette byte e il sistema ne accetta quattro, i primi quattro sono già stati consegnati. Una seconda richiesta deve iniziare dal quinto byte del buffer e riguardare i tre rimasti. Ripartire dallo stesso indirizzo ripeterebbe dati che il destinatario ha già ricevuto."
  ],
  '2.5.9': [
    "Quando un file ordinario viene aperto per la lettura, il sistema conserva la posizione dalla quale partire alla richiesta successiva. Questa distanza in byte dall’inizio prende il nome di offset. Il conteggio richiesto è un dato di ingresso, mentre il numero restituito racconta l’esito della lettura.",
    "La chiamata read deposita nel buffer i dati che ha potuto leggere. Per un file ordinario, se erano stati richiesti byte e la lettura parte dalla fine del file, il risultato è zero. Nessun avanzamento è necessario, perché il primo byte ancora da leggere si trova tuttora alla stessa posizione.",
    "Se si chiedono tre byte e se ne ricevono due, la posizione avanza di due. Una richiesta di zero byte può invece restituire zero anche se il file contiene altri dati. Per distinguere questo caso dalla fine del file bisogna dunque leggere insieme la richiesta e il risultato."
  ],

  // 2.6 · Procedure, flusso di controllo e analisi del codice macchina
  '2.6.1': [
    "Una funzione è una sequenza di istruzioni alla quale un altro tratto del programma trasferisce il controllo insieme ad alcuni valori, chiamati argomenti. Perché la funzione li ritrovi, il codice che chiama e quello chiamato devono seguire la stessa convenzione. Nella convenzione System V AMD64 i primi sei argomenti interi di questo esempio entrano in sei registri, piccole memorie interne chiamate RDI, RSI, RDX, RCX, R8 e R9.",
    "Il settimo argomento viene predisposto in memoria sulla pila, una zona che cresce verso indirizzi più piccoli. Qui ogni argomento occupa otto byte. Subito prima della chiamata il settimo si trova a 0x8000. L’istruzione CALL aggiunge alla pila un indirizzo di ritorno di otto byte, per cui all’ingresso della funzione la nuova cima è a 0x7FF8.",
    "Il registro RSP indica quella cima. L’espressione [RSP + 8] chiede di leggere la cella che comincia otto byte più avanti, proprio a 0x8000. Per stabilire dove leggere un argomento conta la sua posizione nell’elenco, indipendentemente dal numero che vi era stato assegnato."
  ],
  '2.6.2': [
    "Quando un programma affida un compito a una funzione, occorre ricordare il punto da cui proseguire dopo che la funzione avrà terminato. Il processore conserva quell’indirizzo sulla pila, una regione di memoria nella quale l’ultimo valore inserito è il primo disponibile al prelievo. Due registri aiutano a seguire il viaggio. RIP indica quale istruzione eseguire e RSP indica la posizione in memoria della cima della pila.",
    "L’istruzione CALL del modello occupa cinque byte. Se comincia a 0x400210, il punto di ripresa si trova a 0x400215. La macchina sottrae otto da RSP, poiché un indirizzo a 64 bit occupa otto byte, e deposita questa informazione alla nuova cima. Soltanto dopo il trasferimento RIP indica l’ingresso della funzione.",
    "Al ritorno, RET preleva l’indirizzo dalla cima e aumenta RSP di otto. Se la funzione ha ripristinato la propria pila, RIP ritrova così 0x400215. La quantità di spazio locale che il chiamante aveva riservato modifica l’indirizzo del salvataggio, mentre il valore da salvare dipende dalla posizione e dalla lunghezza della CALL."
  ],
  '2.6.3': [
    "Per scegliere il minore di due numeri occorre stabilire come interpretarne i bit. Un byte, composto da otto cifre binarie, può indicare un intero tra 0 e 255 oppure, in complemento a due, un intero tra −128 e 127. Il byte con tutte le cifre a uno si scrive 0xFF e vale rispettivamente 255 o −1. La differenza emerge quando lo si confronta, per esempio, con 1.",
    "L’istruzione CMP esamina la sottrazione fra i byte custoditi nei registri AL e BL. Gli operandi restano disponibili e il processore registra alcuni segnali. CF indica un prestito nella sottrazione senza segno, SF copia il bit di segno della differenza conservata e OF segnala uno sconfinamento della differenza con segno.",
    "Il salto JB sceglie il primo operando quando CF vale uno, applicando l’ordine senza segno. Il salto JL sceglie il primo quando SF e OF differiscono, così da correggere anche i casi in cui il segno della differenza è stato alterato dallo sconfinamento. Il confronto fra 0xFF e 1 produce dunque due scelte diverse, ciascuna coerente con l’ordine adottato."
  ],
  '2.6.4': [
    "Una somma di molti termini può essere eseguita ripetendo poche istruzioni. Occorrono due memorie interne distinte. La prima, EAX, conserva la somma raggiunta e per questo svolge la funzione di accumulatore. La seconda, ECX, contiene il prossimo termine e al tempo stesso indica quanti termini restano. Ogni passaggio nel corpo del ciclo modifica entrambe.",
    "Con ECX inizialmente uguale a 3, la prima somma porta EAX da zero a 3. DEC riduce ECX a 2 e, poiché il risultato differisce da zero, il comando JNZ torna all’inizio del corpo. La somma successiva vale 3 + 2. Alla terza ripetizione si aggiunge uno, portando EAX a 6, e il decremento porta ECX a zero.",
    "JNZ decide il salto attraverso ZF, il segnale di risultato nullo aggiornato da DEC. Quando ZF vale uno si raggiunge il ritorno e il chiamante trova la somma in EAX. Un controllo distinto, eseguito da TEST all’ingresso, consente al programma di restituire subito zero quando la sequenza di termini è vuota."
  ],
  '2.6.5': [
    "Una funzione può ricevere più dati raggruppati in una struttura. In un passaggio per valore il chiamante le consegna il contenuto della struttura. La convenzione System V AMD64 decide se collocarlo nei registri oppure nella memoria della pila, considerando dimensioni e tipi dei componenti. Un double rappresenta un numero in virgola mobile e occupa otto byte. I registri XMM possono trasportare questi valori.",
    "Qui una coppia di double occupa sedici byte e, quando i registri sono disponibili, i due componenti viaggiano in XMM0 e XMM1. Una struttura che racchiude un double e trentadue byte di caratteri occupa invece quaranta byte e viene consegnata interamente in memoria. Se dopo la struttura compare un ulteriore double, esso riceve il primo registro XMM ancora libero.",
    "La funzione considerata accetta un numero variabile di argomenti dopo quello fisso che descrive il formato. Il chiamante indica in AL, un registro di otto bit, un limite superiore al numero di registri vettoriali usati per gli argomenti. Il minimo consentito si ottiene contando i registri XMM realmente assegnati, inclusi quelli eventualmente occupati dalla struttura."
  ],
  '2.6.6': [
    "Per riconoscere il compito di una funzione si possono seguire il valore che entra, la decisione che divide i percorsi e il numero che entrambi riconsegnano al chiamante. Qui EDI è il registro che porta l’argomento intero con segno. EAX è il registro del risultato. MOV EAX, EDI comincia copiando l’argomento, così che ciascun ramo abbia già a disposizione il numero sul quale operare.",
    "CMP EDI, 0 esamina la differenza fra l’argomento e zero e prepara i segnali per il salto JGE, che significa «salta se maggiore o uguale» nella lettura con segno. Se l’ingresso vale 6, il salto porta direttamente alla fine e la funzione restituisce la copia già presente in EAX. Anche zero segue quel percorso.",
    "Per un ingresso di −6 il programma raggiunge invece NEG EAX. Questa istruzione calcola zero meno il valore conservato e lascia 6 nel registro. Osservando dove i due rami si riuniscono si riconosce il valore assoluto, che per tutti gli ingressi ammessi nel modello è rappresentabile con i 32 bit del risultato."
  ],
  '2.6.7': [
    "Durante una chiamata il programma sospende un calcolo, lascia lavorare una funzione e riprende dal punto in cui si era fermato. Può avere ancora bisogno di un numero conservato in un registro, cioè in una piccola memoria interna al processore. La convenzione System V AMD64 stabilisce quali registri la funzione chiamata debba restituire nello stato in cui li aveva trovati. R12 appartiene a questo gruppo.",
    "Supponiamo che una funzione riceva R12 con il valore 18 e voglia usarlo per conservare un risultato provvisorio pari a 3. Prima di sovrascriverlo può copiare 18 sulla pila, una zona di memoria organizzata per salvataggi temporanei. Quando il lavoro con il valore 3 è finito, la funzione recupera il numero accantonato e lo riscrive in R12.",
    "Il vincolo riguarda il valore visibile al chiamante al momento del ritorno. Per leggere il caso proposto occorre quindi seguire sia il registro, che può cambiare durante la funzione, sia la sede in cui la funzione ha conservato il numero originario."
  ],
  '2.6.8': [
    "Un programma in esecuzione attraversa posizioni di memoria nelle quali sono scritte le sue istruzioni. RIP è il registro che indica l’istruzione da eseguire. Un debugger sospende il programma e ne permette l’avanzamento di un’istruzione, rendendo visibili indirizzi e registri prima e dopo.",
    "Il disassemblato presenta, per ogni istruzione macchina, l’indirizzo e il nome dell’operazione. Poiché istruzioni diverse possono avere lunghezze diverse, aggiungere sempre uno all’indirizzo porterebbe talvolta dentro l’istruzione appena eseguita.",
    "Un’istruzione di quattro byte situata all’indirizzo 100 occupa 100, 101, 102 e 103. Se il flusso prosegue in sequenza, RIP diventa 104. Un’istruzione LEA può nello stesso passo calcolare un indirizzo e scriverlo in un altro registro. Quel calcolo e l’avanzamento di RIP hanno operandi e destinazioni differenti."
  ],
  '2.6.9': [
    "Una funzione è un tratto di programma al quale si affidano alcuni dati per ottenere un risultato. Perché due funzioni compilate separatamente possano collaborare, devono concordare dove lasciare l’argomento, dove cercare il risultato e come riprendere l’esecuzione dopo la chiamata.",
    "Nella convenzione System V AMD64 qui utilizzata il primo argomento intero di 32 bit viene posto in EDI e un risultato dello stesso tipo viene restituito in EAX. CALL salva sulla pila l’indirizzo a cui proseguire. RET lo recupera quando il lavoro della funzione è terminato.",
    "Se una funzione legge 6 da un array e lo passa a una seconda funzione che raddoppia il proprio argomento, al primo ritorno EAX contiene 12. La funzione esterna può ancora cambiare quel numero prima di tornare a chi l’ha chiamata. Per leggere la traccia contano quindi sia il valore sia il punto a cui si sta ritornando."
  ],

  // 2.7 · Frame dello stack, sicurezza della memoria e riuso del flusso di controllo
  '2.7.1': [
    "Quando una funzione è in esecuzione, può avere bisogno di spazio per dati che servono soltanto durante quella chiamata. Si chiama frame la porzione di pila impiegata per organizzarli insieme ai salvataggi della funzione. La pila è una regione di memoria la cui cima, in questa architettura, avanza verso indirizzi minori quando si riserva spazio. Il registro RSP contiene l’indirizzo della cima corrente.",
    "All’ingresso della funzione l’indirizzo di ritorno è già stato depositato dalla chiamata. Il prologo, cioè la sequenza di preparazione, esegue PUSH RBP per salvare sulla pila il precedente punto di riferimento. Con MOV RBP, RSP fissa poi il nuovo riferimento in RBP. Nella figura questo punto si trova a 0x8FF0 e l’indirizzo di ritorno occupa gli otto byte che cominciano otto posizioni più avanti.",
    "Riservando un blocco di sedici byte, RSP scende a 0x8FE0 e RBP rimane a 0x8FF0. Si può quindi misurare la dimensione dell’area locale dalla distanza fra i due registri, anche mentre la cima si sposta."
  ],
  '2.7.2': [
    "Un buffer è una zona riservata a una sequenza di byte. Se la sua capacità è otto, il primo byte occupa la posizione zero e l’ultimo la posizione sette. La quantità da copiare e l’indice dell’ultima cella raggiunta differiscono dunque di uno. Per una copia di lunghezza positiva n, l’ultimo indice visitato è n − 1.",
    "La figura mostra una disposizione concreta di memoria. Agli otto byte del buffer seguono quattro byte di riempimento, poi quattro byte di contatore e infine otto byte di un dato di controllo. Una copia di tredici byte tenterebbe di raggiungere l’indice 12, ossia il primo byte del contatore. I cinque byte esterni al buffer comprenderebbero quattro posizioni di riempimento e una del contatore.",
    "Questo conteggio descrive gli indirizzi del disegno. Nel linguaggio C la scrittura oltre il limite dell’oggetto ha comportamento indefinito, per cui il linguaggio lascia indeterminati gli effetti dell’esecuzione. Il confine da rispettare è quello del buffer, anche quando la cella subito successiva appare libera perché destinata al riempimento."
  ],
  '2.7.3': [
    "Fra le variabili locali di una funzione e le informazioni che serviranno per il ritorno si può collocare una sentinella, ossia una sequenza di byte di cui si conserva un valore atteso. Una scrittura che oltrepassi lo spazio assegnato ai dati potrebbe attraversarla. Controllandola alla fine della funzione si ha allora la possibilità di riconoscere l’alterazione prima di riprendere l’esecuzione nel chiamante.",
    "Nell’esempio tutti i byte della sentinella tranne quello in esame mantengono il proprio valore. Il byte seguito vale inizialmente 0xA6, cioè 166 in decimale. Se la scrittura lo sostituisce con zero, il confronto finale rileva due valori differenti e il controllo passa alla gestione dell’errore.",
    "Una scrittura confinata al dato locale lascia la sentinella uguale al valore atteso. Anche riscrivere esattamente 166 sulla sua cella lascia uguali i contenuti confrontati. La prova riguarda dunque lo stato dei byte al momento della verifica. RET, l’istruzione di ritorno, viene raggiunta lungo il percorso ordinario soltanto quando il confronto ha esito favorevole."
  ],
  '2.7.4': [
    "Ogni blocco di istruzioni occupa una posizione in memoria dalla quale il processore può iniziare a eseguirlo. L’istruzione RET preleva dalla cima della pila un indirizzo e lo usa come destinazione. La pila è una sequenza di celle e il registro RSP indica la prima ancora da prelevare. Poiché ogni indirizzo occupa otto byte, dopo un prelievo RSP aumenta di otto.",
    "Nel modello gli indirizzi sono rappresentati con i nomi dei blocchi ai quali conducono. Un blocco aggiunge tre al numero in lavorazione e un altro lo raddoppia. Quel numero si chiama accumulatore perché conserva il risultato di un passaggio e lo offre al successivo. Partendo da 4, sommare tre e poi raddoppiare dà 14. Eseguire prima il raddoppio porta invece a 8, dal quale la somma produce 11.",
    "I blocchi eseguono le stesse operazioni in entrambe le disposizioni. A cambiare è la successione degli indirizzi sulla pila, dalla quale dipende il valore che ogni blocco riceve. La terza voce conduce alla fine e conclude il percorso."
  ],
  '2.7.5': [
    "Una funzione può custodire un risultato provvisorio in un registro oppure in memoria. La pila offre memoria per la durata della chiamata e il registro RSP ne indica la cima. In un programma utente che segue la convenzione System V AMD64, i 128 byte a indirizzi immediatamente inferiori a RSP formano la red zone. Chi gestisce un segnale asincrono deve rispettare tale area.",
    "Una funzione foglia è una funzione che termina senza chiamarne altre. Se le servono ventiquattro byte provvisori, può impiegare una parte della red zone lasciando RSP fermo. Se le basta sommare uno a un argomento già in un registro, come fa add_one, persino lo spazio temporaneo in memoria diventa superfluo.",
    "Una chiamata interna richiede un’altra scelta per i valori che dovranno sopravviverle. CALL scrive sulla pila l’indirizzo di ritorno e la funzione chiamata può usare a sua volta lo spazio sotto la propria cima. Nel caso con un temporaneo da ventiquattro byte, sottrarre 24 da 0x9FF8 riserva lo spazio e porta RSP a 0x9FE0, un indirizzo multiplo di sedici adatto alla chiamata."
  ],
  '2.7.6': [
    "Quando il processore passa a una funzione, deve ricordare l’indirizzo a cui tornare. Normalmente CALL lo deposita sulla pila ordinaria, una zona di memoria che ospita anche dati del programma. Se una scrittura accidentale modifica quell’indirizzo, una semplice lettura dalla pila al momento del ritorno consegnerebbe una destinazione diversa da quella inizialmente salvata.",
    "La tecnologia Intel CET, dedicata alla protezione del flusso di controllo, prevede una seconda pila detta pila ombra. Quando questo meccanismo è attivo, CALL deposita anche lì una copia dell’indirizzo. Le ordinarie scritture del programma sulla pila dei dati lasciano la copia protetta al riparo. RET, prima di accettare la destinazione, confronta i due indirizzi.",
    "Nel caso illustrato la chiamata salva 0x401080. Se alla copia ordinaria si aggiunge uno scarto di otto byte, al ritorno si confrontano 0x401088 e 0x401080. La differenza provoca l’eccezione di protezione #CP. Un cambiamento limitato a una variabile locale lascia invece identiche le due copie e consente la ripresa all’indirizzo salvato."
  ],
  '2.7.7': [
    "Il linguaggio C rappresenta una stringa come una successione di byte di testo seguita da un byte di valore zero, chiamato terminatore. Quel segnale di fine occupa una cella anche quando il testo è vuoto. Per decidere se il testo entra in un buffer, cioè in un’area predisposta per riceverlo, bisogna conoscere sia il numero di byte di contenuto sia la capacità effettiva della destinazione.",
    "Una destinazione di otto byte possiede le celle da 0 a 7. Una stringa con sette byte di testo le occupa tutte, poiché i caratteri prendono le prime sette e il terminatore va alla posizione 7. Otto byte di testo collocherebbero invece lo zero alla posizione 8, che è già esterna alla destinazione.",
    "Se il contenuto ha lunghezza n e la capacità vale C, l’indice n del terminatore deve essere strettamente minore di C. La routine controlla questa disuguaglianza prima di iniziare la copia. Quando il controllo fallisce, il conteggio dei byte scritti rimane a zero, compreso il caso di capacità nulla."
  ],
  '2.7.8': [
    "La pila è una zona di memoria in cui si aggiungono e si recuperano valori a partire dalla cima. Il registro RSP contiene l’indirizzo di quella posizione. In una PUSH di un registro a 64 bit il processore riserva otto byte, poiché un byte comprende otto bit. In questa architettura la pila cresce verso indirizzi più piccoli, perciò la riserva si compie sottraendo otto a RSP.",
    "Supponiamo che la cima si trovi a 0x2010 e che il dato a 64 bit abbia valore 0x1234. La nuova cima si trova a 0x2008. La disposizione little-endian, che mette il byte di minor peso all’indirizzo minore, colloca 34 a 0x2008 e 12 a 0x2009. I sei byte di peso superiore, in questo esempio tutti zero, occupano gli indirizzi seguenti.",
    "Nel problema cambiano la quota iniziale della pila e il contenuto del registro. Conviene prima stabilire dove si apre l’intervallo di otto byte e solo dopo distribuire le coppie di cifre del dato negli indirizzi compresi in quell’intervallo."
  ],
  '2.7.9': [
    "Si chiama pila una zona di memoria dalla quale l’ultimo elemento depositato è il primo a essere prelevato. Su x86-64 RSP conserva l’indirizzo della cima. Nelle operazioni a otto byte considerate, PUSH riduce RSP di otto e vi deposita il dato, mentre POP legge la cima e fa risalire il puntatore.",
    "La pila serve anche a riservare spazio temporaneo a una funzione. L’istruzione SUB RSP riduce il puntatore e rende disponibile una regione sotto la vecchia cima. Per interpretare una traccia è utile distinguere questa riserva da una PUSH che, oltre a muovere il puntatore, scrive un valore.",
    "Depositate in successione le quantità 5 e 9, un solo prelievo restituisce 9. Il numero 5 si trova ancora nella pila e RSP torna a indicarlo. Conoscere il valore prelevato serve a ricostruire il registro di destinazione, mentre contare i depositi e i prelievi serve a ricostruire RSP."
  ],
  '2.7.10': [
    "Ogni funzione usa alcuni registri per i propri calcoli. Le regole di chiamata specificano quali valori essa debba restituire intatti e da quale indirizzo possa effettuare una chiamata successiva. Per liberare temporaneamente un registro, la funzione può salvarne il contenuto sulla pila.",
    "Nella convenzione System V AMD64 il contenuto di RBX va restituito al chiamante. Per le chiamate ordinarie qui considerate, prima di CALL il valore di RSP deve inoltre essere un multiplo di sedici. La riserva per i dati locali si calcola quindi tenendo conto anche degli otto byte già occupati da ciascun salvataggio.",
    "Con RSP pari a 0x1020 subito prima di CALL, l’indirizzo di ripresa viene scritto otto byte più in basso, a 0x1018. La funzione chiamata può salvare RBX con un ulteriore deposito, che porta RSP a 0x1010. Seguire le due scritture separatamente chiarisce a chi appartiene ciascun valore e in quale ordine andrà recuperato."
  ],

  'modulo-2': [
    "Consideriamo una tabella di misure nella quale ogni riga appartenga a una prova e ogni colonna a uno strumento. Per recuperare una misura, noi indichiamo una riga e una colonna. La memoria del calcolatore dispone invece di celle numerate, ciascuna capace di ospitare un byte, cioè otto cifre binarie. Occorre quindi tradurre le due coordinate nell’indirizzo del primo byte della misura cercata.",
    "La matrice della figura dispone in ordine quattro righe di cinque interi. Le coordinate partono da zero e ogni intero occupa quattro byte. Alla posizione [1][2] precedono cinque elementi della prima riga e due della seconda, in tutto sette elementi e quindi ventotto byte. Sommandoli alla base 0x3000, espressa in esadecimale, si raggiunge 0x301C. LEA calcola questo indirizzo e lo deposita nel registro RDX, una piccola memoria interna del processore.",
    "Per distinguere le celle, il modello assegna a ciascuna il valore 16 × riga + colonna + 1. La cella [1][2] contiene dunque 19. L’istruzione MOV EAX, [RDX] legge quattro byte, cominciando da quello di minor peso, e ricostruisce 19 nel registro EAX. Se la variazione vale −3, la successiva ADD aggiorna EAX a 16. Le ultime due caselle della figura mostrano così sia il valore effettivamente letto dalla matrice sia quello che il processore ha poi calcolato."
  ]
});
