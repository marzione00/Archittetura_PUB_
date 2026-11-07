'use strict';

Object.assign(SL.lezioni, {
  // 3.1 · Logica combinatoria: dalle tabelle di verità all’ALU
  '3.1.1': [
    "Tre sensori sorvegliano la stessa porta. Per accendere una spia si richiede che almeno due segnalino l’apertura. Ciascun sensore comunica un bit, cioè una cifra che può valere 0 oppure 1. Se 1 significa «aperto», il gruppo di tre cifre descrive una situazione precisa. Un elenco di tutte le situazioni con la rispettiva risposta prende il nome di tabella di verità.",
    "Per costruire il circuito basta osservare che, dove esistono due segnalazioni, esiste almeno una coppia di sensori entrambi attivi. Una porta AND realizza proprio questa verifica su due fili, poiché dà 1 soltanto quando entrambi portano 1. Le tre coppie possibili sono AB, AC e BC. Una porta OR raccoglie i tre esiti e accende la spia appena uno di essi vale 1.",
    "Con A e C attivi e B a zero, il segnale giunge alla spia attraverso il ramo AC. Se si attiva anche B, si aprono altri due percorsi verso la stessa uscita. Il disegno consente così di distinguere le ragioni per cui la spia rimane accesa."
  ],
  '3.1.2': [
    "Un circuito che debba inviare al calcolatore una di quattro misure riceve quattro dati e un comando che identifica la misura desiderata. Ogni dato è qui una parola di quattro bit, capace di rappresentare gli interi da 0 a 15. Il comando può essere più corto perché, per scegliere fra quattro ingressi, bastano le quattro combinazioni di due bit.",
    "Il componente che compie la scelta si chiama multiplexer. Nel disegno è costruito con tre selettori a due ingressi. Il bit destro del comando, S0, sceglie il primo o il secondo membro di ciascuna coppia. Dal primo livello escono quindi due parole. Il bit sinistro, S1, stabilisce quale delle due raggiunga il filo di uscita.",
    "Con gli ingressi 3, 8, 5 e 13, il comando 2 si scrive 10 in binario. Lo zero lascia passare 3 e 5 al primo livello, mentre l’uno sceglie la seconda coppia. Il valore osservato è dunque la parola 5, della quale il circuito ha trasportato tutti e quattro i bit."
  ],
  '3.1.3': [
    "Nell’addizione in colonna, quando le unità arrivano a dieci si riporta una decina nella colonna successiva. In base due si cambia colonna già al due. Le quattro posizioni di una parola, lette da destra, hanno perciò peso 1, 2, 4 e 8. La parola 0111 rappresenta sette perché sono presenti le unità di peso 1, 2 e 4.",
    "Il circuito assegna a ogni posizione una piccola cella che riceve il bit di ciascun addendo e l’eventuale riporto da destra. Se il totale locale è due, la cella scrive zero e invia uno alla vicina. Se è tre, scrive uno e invia ancora uno. Per questo una posizione può cambiare anche quando entrambi gli addendi vi presentano zero.",
    "Aggiungendo 1 a 0111, il riporto attraversa tre celle e si ferma in quella di peso 8, dove compare il primo uno della parola 1000. La freccia che esce dall’ultima cella ha invece peso 16 e va letta separatamente dai quattro bit conservati."
  ],
  '3.1.4': [
    "Un processore usa spesso gli stessi due numeri per operazioni diverse. Al circuito arrivano perciò due operandi, ossia i dati da elaborare, insieme a un comando che indica l’operazione richiesta. Il componente prende il nome di unità aritmetico-logica, abbreviato ALU. Qui ciascun operando occupa un byte, un gruppo di otto bit.",
    "La somma e la sottrazione combinano le cifre tenendo conto dei riporti o dei prestiti fra posizioni vicine. AND e XOR lavorano invece posizione per posizione. AND scrive uno dove entrambi i bit sono uno, mentre XOR scrive uno dove i due bit differiscono. I quattro risultati candidati giungono al selettore, che collega all’uscita il ramo indicato dal comando.",
    "Con A uguale a 3 e B uguale a 1, le ultime cifre sono rispettivamente 11 e 01. L’AND restituisce 1 e lo XOR restituisce 2. Il prefisso 0x introduce la scrittura in base sedici, perciò questi byte appaiono come 0x01 e 0x02. Il segnale ZF, indicatore di zero, si accende soltanto se l’intero byte selezionato vale zero."
  ],
  '3.1.5': [
    "Quando cambia la tensione su un ingresso, i componenti attraversati dal segnale impiegano un breve intervallo per portare l’uscita al livello previsto. Questo intervallo si chiama ritardo di propagazione. Un picosecondo, abbreviato ps, è un millesimo di miliardesimo di secondo. A questa scala anche la scelta del percorso incide sul momento in cui un risultato si può leggere con sicurezza.",
    "Nel ramo AND la porta verifica che due ingressi siano entrambi attivi. Nel ramo XOR verifica che siano diversi. Le due valutazioni cominciano insieme e raggiungono una porta OR, la cui uscita indica se almeno una verifica è riuscita. Per garantire il risultato in ogni combinazione occorre attendere il più lento dei due rami e poi concedere alla OR il suo tempo di risposta.",
    "Se AND richiede 30 ps, XOR 65 ps e OR 20 ps, il limite è 85 ps. Portare AND a 50 ps lo lascia invariato, poiché XOR arriva ancora per ultima. Le barre rendono visibile il cammino critico, cioè il percorso che determina il limite complessivo."
  ],
  '3.1.6': [
    "Un sommatore che conserva otto cifre binarie dispone di 256 configurazioni. Se le si interpreta come interi senza segno, rappresentano i numeri da 0 a 255. Con la convenzione chiamata complemento a due, la cifra più a sinistra ha peso −128 e le altre conservano i pesi da 1 a 64. Le stesse otto cifre rappresentano allora i numeri da −128 a 127.",
    "Sommando 127 e 1 si ottiene 10000000. Il numero 128 entra nell’intervallo senza segno, sicché il riporto oltre l’ottava posizione, indicato da CF, vale zero. Letta con segno, però, quella parola significa −128, mentre la somma di due numeri positivi darebbe +128. L’indicatore di superamento dell’intervallo con segno, OF, vale quindi uno.",
    "La figura mostra anche il calcolo del riporto per gruppi di quattro cifre. Il gruppo alto può generare da sé un riporto oppure trasmettere quello ricevuto dal gruppo basso. Seguire queste due vie spiega come il circuito possa ottenere CF senza attendere il passaggio del segnale attraverso ogni singola colonna."
  ],
  '3.1.7': [
    "Quattro posizioni binarie contengono le unità, le coppie, i gruppi di quattro e quelli di otto. Per sommare due parole si allineano le posizioni di uguale peso. Si comincia da destra perché un’unità che avanza dalla prima colonna può contribuire alla seconda, e da lì a tutte quelle successive.",
    "Si consideri una somma diversa da quella proposta, 0111 + 0101. Nella colonna delle unità, 1 + 1 produce due unità, che diventano una coppia. La cifra scritta è zero e la colonna successiva riceve uno di riporto. Nella seconda colonna si sommano allora 1, 0 e quel riporto. Anche qui si scrive zero e si trasmette uno.",
    "Tenere separati sul foglio il bit scritto e il riporto permette di controllare ciascuna cella prima di proseguire. Alla fine si leggono i quattro bit scritti dal peso otto al peso uno. Un eventuale riporto oltre la quarta posizione si aggiunge solo quando si vuole ricostruire il totale matematico."
  ],
  '3.1.8': [
    "Una votazione fra tre segnali può essere affidata a un circuito, attribuendo a ciascun voto il valore 1 per il sì e 0 per il no. La maggioranza è raggiunta quando almeno una coppia di voti vale 1. Una porta AND riconosce una coppia concorde sul sì, mentre una porta OR riunisce i risultati delle diverse coppie.",
    "Scrivere AB significa qui prendere la AND fra i segnali di A e di B. Le tre coppie AB, AC e BC esauriscono i modi di trovare due voti favorevoli su tre. Quando tutti votano sì, le coppie favorevoli diventano tre e l’uscita complessiva resta una sola cifra uno.",
    "Con A e C a 1 e B a 0, soltanto la coppia AC vota sì all’unanimità. Il segnale che esce da quella porta basta ad attivare l’uscita complessiva. Il programma riproduce lo stesso ragionamento sui bit e raccoglie la decisione nel registro EAX."
  ],
  '3.1.9': [
    "Per eseguire un’addizione su un byte, il processore mette a disposizione otto bit, cioè otto cifre binarie. AL è il nome degli otto bit inferiori di un suo registro. Alcune informazioni che accompagnano la somma vengono conservate a parte, affinché un’istruzione successiva possa ancora leggerle.",
    "ZF vale uno quando tutti i bit del risultato sono zero. SF copia il bit più alto, che in complemento a due indica il segno. OF segnala che la somma matematica con segno supera la capacità del byte. SETcc è una famiglia di istruzioni che trasforma una condizione sui flag in un byte di valore zero oppure uno.",
    "Sommando 255 e 1 si ottiene 256, il cui codice binario richiede nove posizioni. Negli otto bit di AL rimangono zeri. I flag permettono di distinguere il fatto che il byte sia nullo dal fatto che una cifra sia uscita dal suo margine. Nell’interpretazione con segno gli stessi operandi rappresentavano −1 e 1, la cui somma è rappresentabile."
  ],

  // 3.2 · Logica sequenziale: stato, registri e memoria
  '3.2.1': [
    "Se due display sono collegati al medesimo cavo dati, possono ancora mostrare cifre diverse purché ciascuno conservi l’ultima parola che ha acquisito. Questo è il compito di un registro, un insieme di celle capace di trattenere un gruppo di bit. Qui ogni registro contiene quattro bit e la sua uscita, indicata con Q, mostra la parola conservata.",
    "La scrittura avviene in un istante stabilito da un segnale periodico, il clock. Si chiama fronte l’istante in cui il segnale passa da un livello all’altro. Prima del fronte di acquisizione un selettore, comandato da Carica, presenta al registro il dato esterno D oppure il suo stesso Q. Nel secondo caso ciò che ritorna all’ingresso viene scritto di nuovo e la parola si conserva.",
    "Con i registri inizialmente a 3 e a 12 e il cavo D a 7, il comando disabilitato mantiene due uscite distinte. Quando è abilitato, i registri ricevono entrambi 0111, cioè sette. Per capire una differenza fra le due configurazioni basta risalire dal selettore al filo da cui proveniva la parola al fronte."
  ],
  '3.2.2': [
    "Per conservare l’esito di un sensore occorre stabilire in quale momento leggerlo. Due celle che ricevono il medesimo dato D possono ricordare valori diversi quando seguono regole di acquisizione diverse. La loro uscita Q rappresenta il valore conservato. Il clock è un segnale che alterna un livello basso e uno alto, mentre il fronte di salita è il passaggio dal primo al secondo.",
    "Un latch D rimane aperto per tutto il livello alto. Se il sensore cambia durante quell’intervallo, la variazione raggiunge l’uscita dopo il breve ritardo della cella. Quando il livello torna basso, il latch trattiene l’ultimo valore acquisito. Un flip-flop D, invece, legge il dato al fronte di salita e lo conserva fino al fronte di salita successivo.",
    "Se D vale uno al primo fronte e torna a zero quando il clock è ancora alto, sulle due tracce si leggono rispettivamente zero per il latch e uno per il flip-flop. I cambiamenti del dato sono distanziati dai fronti quanto basta perché il campionamento abbia un esito determinato."
  ],
  '3.2.3': [
    "Un registro è una piccola memoria che conserva una parola. Quando più registri sono raccolti in un banco, ciascuno riceve un numero con cui il circuito può sceglierlo. Nel banco di quattro posti gli indirizzi 0, 1, 2 e 3 identificano rispettivamente R0, R1, R2 e R3. L’indirizzo indica una posizione, il dato è il numero che quella posizione contiene.",
    "Le due porte di lettura sono collegamenti indipendenti, perciò possono presentare allo stesso tempo due parole diverse oppure la medesima parola. La porta di scrittura ha un indirizzo proprio e agisce al fronte, l’istante scandito dal segnale periodico di clock. Se la scrittura è abilitata, soltanto il registro prescelto acquisisce il dato che gli viene presentato.",
    "Con le porte A e B puntate su R1 e R2 si leggono inizialmente 5 e 11. Scrivendo 21 in R2, la lettura di B passa a 21 dopo il fronte, mentre A continua a mostrare 5. Nella riga del banco si può riconoscere la sola posizione che ha ricevuto la scrittura."
  ],
  '3.2.4': [
    "Due registri si passano una parola attraverso un circuito che la elabora. A ogni fronte, cioè a ogni istante di campionamento scandito dal clock, il primo registro avvia l’invio di una nuova parola e il secondo acquisisce quella preparata nel ciclo precedente. Qui il fronte arriva contemporaneamente ai due registri. Il tempo fra due fronti successivi si chiama periodo.",
    "La parola da acquisire deve arrivare al secondo registro con un certo anticipo sul fronte successivo, detto tempo di setup. Con 30 picosecondi (ps) al massimo per uscire dal primo registro, 65 per attraversare la logica e 15 di setup, occorrono almeno 110 ps. Se il periodo è 120 ps, restano 10 ps di margine.",
    "Dopo il fronte corrente il secondo registro richiede anche che la vecchia parola rimanga stabile per 18 ps, il tempo di hold. Il nuovo dato può uscire già dopo 12 ps e attraversare il circuito in 8. L’arrivo più precoce è quindi a 20 ps e il margine vale 2 ps. Allungare il periodo sposta il prossimo fronte e lascia invariato questo secondo confronto."
  ],
  '3.2.5': [
    "Un distributore vende un prodotto al prezzo di tre unità e accetta monete da una o due. Quando entra una moneta da uno, il distributore deve sapere quanto è già stato versato per decidere se erogare il prodotto. La memoria necessaria si riduce al credito accumulato. Due sequenze di monete che abbiano lasciato lo stesso credito avranno lo stesso seguito a parità di nuovi ingressi.",
    "Si parla di macchina a stati perché i crediti possibili sono un insieme finito, qui zero, uno e due. A ogni ingresso la macchina calcola il totale provvisorio. Se è inferiore a tre registra il nuovo credito, se è uguale a tre eroga e azzera il credito, se supera tre restituisce l’ultima moneta conservando quanto era già stato accettato.",
    "Partendo da zero con le monete 2, 2 e 1, il primo versamento lascia due unità disponibili. Il secondo porterebbe il totale a quattro e viene restituito. L’ultima moneta completa il prezzo. Le uscite Eroga e Restituisce permettono di leggere l’evento separatamente dal credito che resta dopo il passaggio."
  ],
  '3.2.6': [
    "Una cella può ricordare una cifra binaria anche quando il filo che portava quella cifra ha già cambiato valore. Nel latch D si distinguono il dato in ingresso D, il comando di apertura EN e l’uscita Q, che rende visibile il dato trattenuto. Per leggere la storia del latch occorre conoscere il valore iniziale di Q e l’ordine in cui si stabilizzano gli ingressi.",
    "Si supponga che Q parta da uno. Se EN vale zero mentre D scende a zero, la cella resta chiusa e mostra ancora uno. Se successivamente EN sale a uno mentre D resta a zero, il percorso si apre e Q raggiunge zero dopo il tempo necessario alla propagazione del segnale.",
    "Conviene annotare, accanto a ogni coppia della traccia, il valore acquisito nel tratto precedente. Con EN alto si legge il dato presente in quell’intervallo, con EN basso si riporta la parola già conservata. Procedendo nell’ordine temporale si può spiegare ogni segmento della linea di uscita, compresi quelli in cui cambia soltanto l’ingresso."
  ],
  '3.2.7': [
    "Un circuito con memoria conserva un’informazione anche quando il suo ingresso cambia. Nel flip-flop D l’ingresso D propone il valore nuovo e l’uscita Q espone quello memorizzato. Il clock è il segnale periodico che stabilisce quando può avvenire il passaggio da D a Q.",
    "Il fronte di salita è la transizione dal livello basso al livello alto del clock. Un solo valore alto dice dove si trova il segnale, mentre la coppia precedente–attuale consente di riconoscere se il fronte si è appena verificato.",
    "Se il clock passa da 0 a 1 mentre D vale 1, Q acquisisce 1. Supponiamo ora che D scenda a 0 quando il clock si trova ancora a 1. Q conserva il valore acquisito, perché due osservazioni successive entrambe a 1 descrivono un livello stabile. La variazione dell’ingresso da sola lascia quindi intatta la memoria del circuito."
  ],
  '3.2.8': [
    "Due registri che seguono lo stesso clock possono cambiare entrambi al medesimo fronte, cioè nell’istante in cui il segnale passa da 0 a 1. Ciascuno acquisisce il valore che il proprio ingresso presentava subito prima di quell’istante. È questa simultaneità a determinare quali numeri entrano nel calcolo.",
    "Nel circuito in esame il nuovo A proviene dal vecchio B, mentre il nuovo B è il vecchio A aumentato di uno. I registri sono larghi quattro bit e conservano il resto della divisione per sedici. Il segnale di reset, quando viene selezionato, sostituisce entrambi gli ingressi con zero.",
    "Se prima del fronte A vale 2 e B vale 7, il collegamento ordinario porta 7 in A e 3 in B. Per trovare 3 si è usato il vecchio valore 2. Quando è attivo il reset sincrono, entrambi ricevono zero al fronte scelto."
  ],

  // 3.3 · Il repertorio Y86-64 e le fasi di esecuzione
  '3.3.1': [
    "Per seguire un ordine tanto semplice quanto «aggiungi questo numero al precedente», occorre sapere dove il processore custodisce i due numeri e dove deporrà il risultato. Un registro è una piccola memoria interna identificata da un nome. Nella macchina didattica Y86-64, %rax e %rbx sono due registri da 64 bit, mentre il contatore di programma, o PC, contiene l’indirizzo dell’istruzione da prelevare.",
    "L’istruzione rrmovq %rax,%rbx copia nel secondo registro la parola contenuta nel primo. L’istruzione addq %rax,%rbx usa invece anche il vecchio contenuto della destinazione e vi scrive la somma. Se i valori iniziali sono 7 e −7, la copia lascia 7 in entrambi i registri, mentre l’addizione lascia 7 nella sorgente e zero nella destinazione.",
    "La somma aggiorna tre indicatori di un bit. ZF segnala un risultato nullo, SF ne riporta il segno e OF indica che la somma matematica con segno è uscita dall’intervallo rappresentabile. La copia conserva gli indicatori precedenti. Entrambe le istruzioni occupano due byte, perciò il PC avanza di due posizioni in memoria."
  ],
  '3.3.2': [
    "Per eseguire un programma il processore legge una sequenza di byte, gruppi di otto cifre binarie che occupano posizioni consecutive in memoria. Deve potervi riconoscere il confine tra due istruzioni, anche se hanno lunghezze diverse. Nella macchina didattica Y86-64 il primo byte indica come leggere i successivi. Le quattro cifre binarie di sinistra formano la classe, detta icode, e le quattro di destra la funzione, ifun.",
    "La notazione esadecimale, introdotta da 0x, usa una cifra per ogni gruppo di quattro bit. Così nel byte 0x30 si leggono direttamente classe 3 e funzione 0. Questo codice introduce irmovq, che scrive una costante in un registro. Seguono un byte che identifica la destinazione e otto byte per la costante.",
    "La costante 291, cioè 0x123, appare in memoria come 23 01 seguito da sei byte nulli, poiché la convenzione little-endian colloca prima il byte di peso minore. Dal primo indirizzo 0x40, l’intera istruzione occupa dieci posizioni. Il nome valP indica 0x4A, la prima posizione che resta dopo l’ultimo byte prelevato."
  ],
  '3.3.3': [
    "Si può pensare alla memoria come a una fila di celle numerate. Ogni cella contiene un byte, ossia otto bit, e il suo numero è un indirizzo. Il processore dispone inoltre di piccoli contenitori interni, i registri. Nel comando mrmovq D(%rbx),%rax il registro %rbx indica da dove partire, D di quante celle spostarsi e %rax dove conservare il dato letto.",
    "Se la base vale 16 e lo spostamento vale 4, il primo byte si trova all’indirizzo 20. La somma 16 + 4, chiamata valE nella figura, serve alla memoria per scegliere la prima cella. Il dato richiesto è una parola da 64 bit, quindi la lettura comprende anche le sette celle successive, fino alla posizione 27.",
    "In questo esempio ogni cella contiene il triplo del proprio indirizzo ridotto a un byte. La prima contiene 60 e l’ultima 81, scritti 3C e 51 in base sedici. Poiché la macchina memorizza per primo il byte di peso minore, nella parola letta, valM, 3C si trova all’estremità destra e 51 all’estremità sinistra."
  ],
  '3.3.4': [
    "Per leggere una parola dalla memoria il processore deve sia riconoscere l’istruzione, sia poter raggiungere tutti i byte richiesti. Sono due controlli distinti. Nella macchina didattica Y86-64 un byte contiene otto bit e ciascun byte ha un proprio indirizzo. Il modello fornisce per intero l’istruzione da decodificare, mentre la memoria destinata ai dati comprende le 64 posizioni numerate da 0 a 63.",
    "Il comando mrmovq richiede otto byte consecutivi. Un accesso che cominci da 56 tocca le celle da 56 a 63 e termina regolarmente, con lo stato AOK. Partendo da 57 si dovrebbe raggiungere anche la posizione 64, per cui compare ADR, il segnale di errore di indirizzo. La verifica riguarda dunque entrambi gli estremi della parola.",
    "Un comando halt ordina esplicitamente l’arresto, contrassegnato da HLT. Un primo byte di classe riservata produce invece INS, con cui si segnala che la codifica letta è invalida. In questi due casi il processore decide già dalla codifica del comando e il valore scelto per l’indirizzo dati perde rilievo."
  ],
  '3.3.5': [
    "Un programma che affidi un calcolo a una procedura deve riprendere dal punto giusto quando la procedura finisce. Il processore conserva perciò due indirizzi distinti, quello della procedura da raggiungere e quello dell’istruzione che seguirà la chiamata. Il contatore di programma, o PC, dice da dove prelevare il prossimo comando. Nella macchina didattica Y86-64, call esegue la chiamata e ret realizza il ritorno.",
    "L’indirizzo da ricordare trova posto sulla pila, una porzione di memoria in cui si recupera per primo l’ultimo valore depositato. Il registro %rsp indica la cima corrente. Poiché ciascun indirizzo occupa otto byte e la pila cresce verso gli indirizzi minori, call sottrae otto a %rsp e scrive l’indirizzo di ritorno nella parola appena riservata.",
    "Se call comincia al byte 64 e occupa nove byte, la ripresa è al byte 73, ossia 0x49 in base sedici. Con %rsp inizialmente a 192, quel valore viene depositato alla posizione 184. La procedura dell’esempio contiene soltanto ret, che legge 73 dalla pila, lo consegna al PC e riporta %rsp a 192."
  ],
  '3.3.6': [
    "Nel testo di un programma si può scrivere «salta a fine» anche quando la posizione di fine dipende dalla lunghezza delle istruzioni che la precedono. Fine è un’etichetta, cioè un nome assegnato a una posizione del programma. L’assemblatore, che traduce le istruzioni scritte dal programmatore nei byte letti dal processore, deve sostituire a quel nome un indirizzo.",
    "Alla prima lettura del testo l’assemblatore conta quanti byte richiede ogni istruzione e associa a ciascuna etichetta la posizione così raggiunta. Una seconda lettura gli permette di inserire nei salti gli indirizzi ormai noti. Nel modello Y86-64 il comando irmovq occupa dieci byte, il salto jmp ne occupa nove e ciascuna nop, che lascia proseguire l’esecuzione, ne occupa uno.",
    "Se il programma comincia al byte 64 e fra jmp e fine si inseriscono tre nop, fine si trova a 64 + 10 + 9 + 3, cioè 86. L’etichetta designa il primo byte di halt senza occupare spazio. Nel salto la destinazione 86 compare come 56 in base sedici, seguito da sette byte nulli, secondo l’ordine dal byte meno significativo al più significativo."
  ],
  '3.3.7': [
    "L’indirizzo di prelievo porta il processore al primo byte di un’istruzione. Per stabilire quale circuito attivare occorre interpretare i campi di quel byte secondo le regole della macchina. Nel formato didattico Y86-64 i bit sono ripartiti in due gruppi uguali. Il gruppo di sinistra identifica una famiglia di operazioni, chiamata icode, mentre il gruppo di destra sceglie un membro di quella famiglia, ifun.",
    "Un byte contiene otto cifre binarie e si può scrivere con due cifre esadecimali, perché ciascuna cifra in base sedici rappresenta esattamente quattro bit. Il prefisso 0x avverte che la scrittura è esadecimale. Nel caso 0x61 si riconoscono così la famiglia 6, riservata alle operazioni aritmetiche e logiche su registri, e la funzione 1, che in quella famiglia seleziona la sottrazione.",
    "La cifra della funzione acquista significato entro la famiglia stabilita dalla prima cifra. Per interpretare il byte proposto conviene tenere separate le due informazioni fino alla consultazione della corrispondenza tra i codici e i nomi delle operazioni."
  ],
  '3.3.8': [
    "Il processore legge le istruzioni dalla memoria sotto forma di byte. Il registro PC conserva l’indirizzo del primo byte dell’istruzione corrente. Il formato didattico Y86-64 assegna al primo byte il compito di indicare l’operazione, dalla quale si stabilisce quanti altri byte appartengano alla stessa istruzione.",
    "Nelle etichette, rA e rB identificano due registri. I loro numeri condividono un byte, quattro bit per ciascuno. Il campo valC, quando è previsto, contiene invece una costante che occupa otto byte. L’ordine dei campi consente di delimitare l’istruzione prima di eseguirla.",
    "Con un byte di operazione, un byte per i registri e otto per una costante, l’istruzione occupa dieci indirizzi consecutivi. Se comincia a 100, l’ultimo di questi è 109 e l’istruzione seguente comincia a 110. Si arriva a quel numero contando tutti i campi presenti, indipendentemente dal valore che essi contengono."
  ],
  '3.3.9': [
    "Per caricare un numero dalla memoria si calcola dapprima la posizione da cui leggere, poi si preleva il contenuto conservato in quella posizione. Nel processore didattico Y86-64 l’istruzione mrmovq legge otto byte. Può ottenere l’indirizzo sommando a una base uno spostamento scritto nell’istruzione.",
    "Nella traccia valE è il risultato del calcolo dell’indirizzo, mentre valM è il contenuto che la memoria fornisce a quell’indirizzo. La dimensione degli otto byte letti riguarda il dato. I byte che codificano l’istruzione si trovano nella regione del programma indicata dal PC, il contatore delle istruzioni.",
    "Con base 80 e spostamento 8, il primo byte si trova a 88. Se agli indirizzi da 88 a 95 è memorizzata la parola 300, nel registro di destinazione entra 300. Per individuare la prossima istruzione si torna invece all’indirizzo del codice e si aggiunge la lunghezza dell’istruzione appena eseguita."
  ],

  // 3.4 · Il processore sequenziale
  '3.4.1': [
    "Un’istruzione che sottrae due numeri si conclude soltanto quando il processore ha conservato il risultato e sa da dove leggere il prossimo comando. Nel processore sequenziale SEQ tutte queste operazioni trovano posto fra due fronti del clock, il segnale che scandisce gli aggiornamenti. Il disegno separa le fasi affinché si possa seguire la propagazione dei dati all’interno di quel singolo intervallo.",
    "Il contatore di programma, indicato con PC, seleziona i due byte 61 e 03, scritti in base sedici. Il primo identifica la sottrazione, il secondo sceglie due registri, piccole memorie interne chiamate %rax e %rbx. Il banco fornisce i loro vecchi contenuti all’unità aritmetica, che per subq %rax,%rbx sottrae il primo operando dal secondo.",
    "Con %rax a 9 e %rbx a 4, il risultato interno valE è −5. Prima del fronte il valore conservato in %rbx è ancora 4. Al fronte il registro acquisisce −5, l’indicatore di segno si attiva e il PC acquisisce l’indirizzo due byte più avanti. L’operazione aritmetica lascia libera la memoria dati."
  ],
  '3.4.2': [
    "Quando un programma deve mettere da parte un valore per usarlo più tardi, può depositarlo sulla pila. La pila è una zona di memoria in cui l’ultimo valore depositato risulta anche il primo disponibile per il prelievo. Nel processore SEQ il registro %rsp conserva l’indirizzo della cima, mentre l’istruzione pushq %rax deposita una copia del valore custodito nel registro %rax.",
    "La memoria assegna un indirizzo a ogni byte e la parola trasferita occupa otto byte. Poiché la pila cresce verso gli indirizzi minori, riservare una parola richiede di sottrarre otto al vecchio %rsp. Il circuito aritmetico, indicato con ALU, esegue la sottrazione. Il suo risultato valE deve arrivare sia alla memoria, affinché scelga le celle giuste, sia al registro %rsp, affinché conservi la nuova cima.",
    "Con %rsp a 112 e %rax a 43, la parola comincia all’indirizzo 104, scritto 0x68 in base sedici. Il valore depositato è 43, ovvero 0x2B. Nel disegno il filo proveniente da %rax porta il contenuto, mentre il bivio all’uscita dell’ALU distribuisce l’indirizzo."
  ],
  '3.4.3': [
    "In un processore a ciclo singolo ogni istruzione dispone dello stesso intervallo per concludersi. Il periodo di clock è la durata di quell’intervallo, compreso fra due istanti di acquisizione dei registri. Se un risultato arriva troppo tardi, il registro a cui è destinato può campionare un valore ancora in transizione. Per scegliere il periodo serve quindi il tempo richiesto dall’istruzione più lenta fra quelle considerate.",
    "I due percorsi rappresentati cominciano dal prelievo dell’istruzione, proseguono con la lettura dei registri e attraversano l’unità aritmetica, l’ALU. Un’operazione aritmetica passa poi attraverso il selettore che sceglie il risultato. Un’istruzione di carico, che deve copiare un dato dalla memoria in un registro, usa invece l’indirizzo appena calcolato per leggere la memoria dati.",
    "Con 85 picosecondi (ps) di prelievo, 30 di lettura e 45 per l’ALU, il tratto comune dura 160 ps. Un selettore da 25 ps porta il totale aritmetico a 185 ps, una memoria da 95 porta il carico a 255. A quest’ultimo totale occorre aggiungere i 15 ps riservati ai registri."
  ],
  '3.4.4': [
    "La pila conserva le parole nell’ordine in cui vi vengono depositate e consente di riprenderle in ordine inverso. Il processore tiene in un registro, %rsp, l’indirizzo della parola in cima. La sua memoria è numerata per byte, mentre ogni parola della pila occupa otto byte consecutivi. Gli indirizzi più piccoli corrispondono allo spazio che la pila può occupare crescendo.",
    "Per aggiungere una parola con pushq, il processore riduce %rsp di otto e usa il nuovo indirizzo per scrivere il contenuto del registro %rax. Per prelevare con popq deve invece raggiungere la parola che è già in cima. Legge quindi al vecchio indirizzo, copia la parola letta in %rax e porta %rsp otto byte più avanti.",
    "Se la cima iniziale è a 96, una pushq scrive a 88 e lascia 88 nel puntatore. Una popq eseguita separatamente dallo stesso stato legge a 96 e lascia 104 nel puntatore. La casella mem_addr indica l’indirizzo usato per lo scambio con la memoria, mentre valE mostra il nuovo valore calcolato per il registro."
  ],
  '3.4.5': [
    "Per confrontare due processori che eseguono lo stesso programma occorre misurare il tempo trascorso dall’inizio alla fine. Il clock scandisce intervalli regolari, detti cicli. La durata di un ciclo è il periodo. Un periodo breve permette di avviare più cicli nello stesso tempo, mentre il numero di cicli necessari dipende da come ciascuna macchina suddivide il lavoro.",
    "La macchina sequenziale SEQ completa ogni istruzione in un ciclo da 240 picosecondi (ps). La macchina multiciclo affronta un’istruzione alla volta suddividendola in operazioni più brevi. Qui la somma o un’altra istruzione aritmetica richiede tre cicli, mentre un carico, che legge la memoria per portare il dato in un registro, richiede cinque cicli.",
    "Per quattro istruzioni aritmetiche e tre carichi, SEQ impiega sette cicli, ossia 1680 ps. La seconda macchina conta dodici cicli aritmetici e quindici per i carichi. Se il suo periodo è 55 ps, i ventisette cicli occupano 1485 ps. Cambiando la proporzione fra carichi e calcoli si può risalire, dalle due durate, al lavoro che pesa maggiormente su ciascun progetto."
  ],
  '3.4.6': [
    "Una parola che debba restare disponibile mentre il processore svolge altri calcoli può essere depositata sulla pila. Gli indirizzi della memoria numerano singoli byte. Un registro speciale, %rsp, conserva l’indirizzo della parola più recente. In questa macchina la pila si estende verso le celle di indirizzo minore e ogni deposito eseguito dall’istruzione pushq riserva otto byte, quanti ne occorrono per archiviare 64 bit.",
    "Si immagini una pila con la cima all’indirizzo 0x40. Il prefisso 0x indica che il numero è scritto in base sedici, per cui 0x40 vale 64. Per deporre una parola il processore riserva gli otto byte che cominciano da 56, ossia 0x38, e arrivano fino a 63. Il nuovo puntatore identifica il primo byte del gruppo appena occupato.",
    "Nel percorso della figura viaggiano due informazioni diverse. Il valore del registro sorgente raggiunge la porta dati della memoria, mentre l’indirizzo ottenuto dalla sottrazione raggiunge la porta indirizzi e il registro della cima. Tenere annotate queste due destinazioni permette di ricostruire lo stato finale della pila."
  ],
  '3.4.7': [
    "Una pila è una regione di memoria nella quale si aggiungono e si prelevano dati dalla stessa estremità, chiamata cima. Il puntatore alla pila contiene l’indirizzo di quell’estremità. Quando la pila cresce verso i numeri più piccoli, depositare e prelevare richiedono un ordine diverso fra uso e aggiornamento del puntatore.",
    "Nella traccia aluA è il primo ingresso dell’unità che calcola il nuovo puntatore e valE è il risultato di quel calcolo. Il segnale mem_addr dice a quale indirizzo la memoria debba effettivamente scrivere o leggere. Confrontarlo con il vecchio puntatore chiarisce quale dei due sia già stato aggiornato.",
    "Con la cima a 80, una push di otto byte scrive a 72. Una pop che inizi dalla medesima cima a 80 legge a 80 e lascia il puntatore a 88. Il primo caso usa per la memoria la posizione appena calcolata, il secondo la posizione da cui si era partiti."
  ],
  '3.4.8': [
    "Un salto condizionale dà al processore due possibili indirizzi di continuazione. Uno si trova subito dopo l’istruzione di salto, l’altro è scritto nell’istruzione stessa. La scelta dipende da un’informazione di stato che una precedente operazione ha lasciato disponibile.",
    "Il nome jne significa «salta se diverso». L’istruzione usa il flag ZF, che vale uno se il precedente risultato era zero. Quando ZF vale zero il salto è preso. Quando vale uno si usa valP, il nome dato nella traccia all’indirizzo che segue il codice dell’istruzione.",
    "Nel processore didattico Y86-64, se jne comincia all’indirizzo 100, la continuazione in sequenza si trova a 109. Se il bersaglio indicato è 180, il PC, cioè il registro dell’istruzione successiva, può dunque ricevere 109 oppure 180. Per conoscere il ramo si deve leggere il valore di ZF, il bit che segnala se il risultato precedente era zero."
  ],

  // 3.5 · Pipeline: sovrapposizione, capacità di completamento e conflitti
  '3.5.1': [
    "Mentre un’istruzione sta compiendo un calcolo, il circuito che ha già letto quella istruzione dalla memoria può dedicarsi alla successiva. La pipeline sfrutta questa possibilità dividendo l’esecuzione in stadi e assegnando a ciascuno una parte del lavoro. A ogni ciclo del clock ciascuna istruzione avanza di una posizione, purché lo stadio seguente sia disponibile e l’istruzione disponga dei dati che le servono.",
    "In questo esperimento gli stadi impiegano un ciclo ciascuno e le istruzioni sono indipendenti, sicché possono procedere senza attendersi. Con cinque stadi da 40 picosecondi (ps), la prima istruzione che entra nel ciclo 1 completa alla fine del ciclo 5. Ha attraversato tutti gli stadi impiegando 200 ps. Questo tempo, misurato per una singola istruzione, si chiama latenza.",
    "La seconda istruzione è entrata un solo ciclo dopo la prima, perciò completa nel ciclo 6. Dopo il riempimento si osserva una conclusione ogni 40 ps. Per sette istruzioni, la settima termina sei cicli dopo la prima. Il diagramma consente di leggere separatamente il tempo trascorso dalla singola istruzione e la cadenza delle conclusioni."
  ],
  '3.5.2': [
    "Quando un processore lavora contemporaneamente su istruzioni diverse, l’espressione «siamo al ciclo quattro» descrive un istante dell’intero processore. Per sapere a quale istruzione appartenga un valore occorre anche conoscere lo stadio in cui quel valore si trova. La figura assegna per questo un nome a ogni istruzione, I1, I2 e così via, nell’ordine con cui comincia l’esecuzione.",
    "F preleva i byte dalla memoria, D decodifica il comando e legge gli operandi, E esegue il calcolo, M effettua un eventuale accesso ai dati e W scrive il risultato. Queste cinque fasi formano una pipeline. Ogni stadio trattiene una sola istruzione per ciclo, mentre il ciclo successivo può ospitare l’istruzione che si trovava nello stadio precedente.",
    "Con cinque istruzioni indipendenti, al ciclo 4 I1 si trova in M, I2 in E, I3 in D e I4 in F. W è ancora vuoto. Un ciclo più tardi entra I5 e la prima istruzione arriva in W. Seguire I1 fra le due righe permette di ricostruire il movimento a cui corrisponde ciascun cambio di etichetta."
  ],
  '3.5.3': [
    "Una pipeline ripartisce il lavoro fra prelievo dell’istruzione (F), lettura dei suoi operandi (D), calcolo (E), accesso alla memoria dati (M) e scrittura del risultato (W). Le istruzioni possono occupare stadi diversi nello stesso ciclo. La sovrapposizione diventa problematica quando un’istruzione ha bisogno di qualcosa che in quel momento è ancora indisponibile.",
    "Se un carico deve portare un dato dalla memoria nel registro %rax e la somma seguente deve leggere proprio %rax, compare una dipendenza di lettura dopo scrittura, abbreviata RAW. Nel modello il dato diventa disponibile durante M. La somma aspetta un ciclo in D e in E compare una bolla, ossia un posto privo di istruzione utile. Scegliendo un registro indipendente, la somma può procedere subito.",
    "Due istruzioni possono anche contendersi una risorsa fisica. Con una sola porta di memoria, il prelievo e la lettura dati simultanei devono essere serviti in turni distinti. Un salto introduce un terzo caso, perché solo in E si conosce la direzione corretta. Se il prelievo ha seguito la direzione sbagliata, le due operazioni iniziate in F e in D vengono scartate."
  ],
  '3.5.4': [
    "Il contatore dei cicli avanza a ogni intervallo del clock, anche durante un’attesa. Il contatore delle istruzioni completate avanza soltanto quando un’istruzione arriva alla fine. Il rapporto fra questi due conteggi si chiama CPI, cicli per istruzione. Essendo una media sul programma osservato, il CPI può avere una parte decimale anche quando ogni istruzione occupa soltanto intervalli interi.",
    "La pipeline del modello distribuisce l’esecuzione su cinque stadi e inizialmente è vuota. L’istruzione entrata al ciclo 1 termina al ciclo 5. In condizioni ideali la successiva termina al 6 e così via, per cui al numero di istruzioni bisogna aggiungere quattro cicli per ottenere la durata dell’intero tratto. Gli eventuali arresti dovuti ai dati o ai salti si aggiungono qui in intervalli distinti.",
    "Per dodici istruzioni, due cicli persi in attesa di dati e due per i salti si contano 12 + 4 + 2 + 2 = 20 cicli. Dividendo 20 per 12 si ottiene circa 1,667. La voce relativa al solo riempimento isola la frazione 4/12, utile per interpretare la misura su un tratto breve."
  ],
  '3.5.5': [
    "Supponiamo che ogni comando del programma debba attraversare tre stadi, ciascuno dei quali richiede un ciclo. Se i tre stadi possono lavorare contemporaneamente su comandi diversi, si parla di pipeline. Le istruzioni sono indipendenti quando nessuna deve attendere il risultato di un’altra. Per prevedere quando termina l’ultima, bisogna tenere conto anche dei posti che all’inizio sono vuoti.",
    "In questo esempio a tre stadi, durante il ciclo 1 la prima istruzione è appena entrata. Al ciclo 2 raggiunge il secondo stadio e lascia libero il primo per la seconda istruzione. Durante il ciclo 3 la prima arriva all’ultimo stadio, la seconda occupa quello centrale e la terza è appena entrata. La prima conclusione si conta alla fine di quel ciclo.",
    "A partire da quel momento ogni istruzione successiva ha una sola posizione di ritardo rispetto a quella che la precede. Per trasferire il ragionamento alla configurazione proposta occorre individuare dapprima il ciclo del primo completamento, quindi contare quante altre istruzioni devono ancora uscire."
  ],
  '3.5.6': [
    "In un processore suddiviso in stadi, più istruzioni possono essere in lavorazione nello stesso ciclo. Talvolta uno stadio deve attendere, perché un dato arriva in ritardo o perché una risorsa è già occupata. Per misurare il tempo perso bisogna riconoscere se due cause hanno fermato lo stesso ciclo.",
    "Una maschera temporale usa il bit in posizione zero per il primo ciclo rappresentato e assegna le posizioni successive ai cicli seguenti. Due uno sovrapposti indicano due richieste simultanee. Contare le posizioni occupate permette di misurare per quanto tempo il lavoro si è fermato.",
    "Se la prima causa interessa i cicli 1 e 2 e la seconda i cicli 2 e 4, il fermo riguarda tre cicli distinti. Le cause coincidono al ciclo 2. Attribuendo una posizione binaria a ciascun ciclo, AND individua l’intersezione e OR l’insieme dei cicli interessati."
  ],
  '3.5.7': [
    "In una pipeline il lavoro su un’istruzione viene ripartito in stadi. Mentre un’istruzione termina, un’altra può già cercare i valori di cui avrà bisogno. Se la seconda usa il risultato della prima, nasce una dipendenza. Il tempo necessario dipende dall’istante in cui il risultato diventa leggibile.",
    "In questo modello il banco dei registri è l’insieme delle piccole memorie interne dalle quali si leggono gli operandi. Lo stadio W vi scrive nella prima metà del ciclo, lo stadio D vi legge nella seconda. Le due operazioni possono dunque avvenire nello stesso ciclo, in un ordine preciso.",
    "Supponiamo che il produttore scriva il registro nel ciclo 5 e che il consumatore si presenti per la lettura nel ciclo 4. Con la scrittura nella prima metà del ciclo e la lettura nella seconda, il consumatore può leggere nel ciclo 5. Inserire un’istruzione indipendente fra i due può assorbire un ciclo altrimenti trascorso in attesa."
  ],

  // 3.6 · Il processore in pipeline a cinque stadi
  '3.6.1': [
    "Nel processore PIPE le istruzioni passano dal prelievo (F) alla decodifica (D), al calcolo (E), all’eventuale accesso alla memoria (M) e alla scrittura (W). Tra due fasi successive c’è un registro che trattiene i dati di un’istruzione per tutto un ciclo. Grazie a questa separazione, uno stadio può elaborare un comando mentre quello seguente sta terminando il lavoro su un comando precedente.",
    "Ogni registro presenta due lati. Durante il ciclo rende disponibile in uscita la parola già conservata e riceve in ingresso quella che lo stadio precedente sta preparando. Il fronte del clock è l’istante in cui tutti i registri acquisiscono il rispettivo ingresso. Le nuove uscite diventano disponibili dopo quel fronte e alimentano le elaborazioni del ciclo appena iniziato.",
    "Con sei istruzioni indipendenti, nel ciclo 4 I1 occupa M e I2 occupa E. Al fronte W acquisisce i dati di I1, mentre M acquisisce quelli di I2. Confrontare la riga degli ingressi con la successiva riga delle uscite mostra perché ogni istruzione avanzi di un solo posto, pur essendo simultanei tutti i trasferimenti."
  ],
  '3.6.2': [
    "Per prelevare un’istruzione occorre un indirizzo di memoria. In un processore che esegue più istruzioni sovrapponendone le fasi, il prelievo può dover iniziare prima che un salto o un ritorno abbia stabilito quell’indirizzo. PIPE prepara allora un indirizzo previsto, F_predPC. L’uscita f_pc indica l’indirizzo che la memoria istruzioni riceve effettivamente nel ciclo considerato.",
    "Un salto condizionale può smentire la previsione di raggiungere la destinazione. L’indirizzo che segue il salto in memoria è stato conservato affinché si possa riprendere da lì. Quando il salto raggiunge lo stadio M, dedicato agli accessi ai dati, quell’indirizzo si trova nel campo M_valA. Nel caso di ret, che termina una procedura, occorre invece l’indirizzo di ritorno letto dalla pila e portato nel campo W_valM dello stadio di scrittura W.",
    "Con indirizzi candidati 64, 98 e 150, il comando di ritorno da solo seleziona 150. Se si forza anche il segnale di correzione del salto, la rete seleziona 98. I due segnali sono regolabili separatamente proprio per rendere osservabile la priorità fra le sorgenti."
  ],
  '3.6.3': [
    "Se un’istruzione deve usare un numero che un’istruzione precedente sta ancora calcolando, leggere subito il registro può fornire un valore ormai superato. In PIPE le istruzioni si sovrappongono. Mentre la più giovane raccoglie gli operandi nello stadio di decodifica D, altre possono trovarsi nel calcolo E, nell’accesso ai dati M o nella scrittura finale W. Si parla di dipendenza RAW, lettura dopo scrittura, perché l’ordine previsto dal programma impone di usare il nuovo dato.",
    "Un collegamento di inoltro, detto forwarding, porta il risultato direttamente alla lettura di D. Il circuito confronta il nome del registro richiesto, qui %rax, con la destinazione delle istruzioni precedenti. Fra quelle che scrivono realmente quel registro occorre scegliere la più vicina nell’ordine del programma, perché il suo risultato sostituisce quelli prodotti prima.",
    "Se la somma in E destina 52 a %rax e il carico in M ha letto 93 per lo stesso registro, D riceve 52. Se in E c’è invece una copia condizionale la cui condizione è falsa, quella destinazione manca. Il valore pertinente diviene allora 93, quale compare sulla porta d_valA."
  ],
  '3.6.4': [
    "Un salto condizionale fa proseguire un programma da uno fra due indirizzi. Per esempio, a seconda dell’esito di un confronto si può ripetere un calcolo oppure passare all’istruzione successiva. PIPE, che sovrappone più istruzioni, deve scegliere da dove prelevare mentre il salto attende ancora di essere valutato. Nel modello si prevede sempre che il salto raggiunga la destinazione indicata.",
    "Quando il salto arriva al calcolo E, il prelievo F e la decodifica D hanno già impegnato due posizioni del cammino previsto. Se la condizione è falsa, questi comandi sono estranei all’esecuzione richiesta. Il controllo ne sopprime il trasferimento inserendo in D e in E due bolle, ossia due posizioni prive di effetti sul programma. Il salto porta intanto l’indirizzo sequenziale nello stadio M.",
    "Un salto che cominci al byte 64 e ne occupi nove lascia come successore sequenziale il byte 73. Se la destinazione prevista è 384 e la condizione è vera, proseguono invece le due istruzioni nop già prelevate a 384 e 385. Una nop lascia proseguire il programma senza modificare i dati. Qui occupa un byte, perciò il successivo prelievo avviene a 386."
  ],
  '3.6.5': [
    "Nel processore PIPE possono esserci nello stesso istante un’istruzione anziana che legge la memoria e una più giovane che esegue un calcolo. Le parole anziana e giovane si riferiscono all’ordine nel programma. Occorre conservare quell’ordine anche quando un’istruzione deve aspettare un dato o quando la memoria segnala che un accesso è impossibile.",
    "Un carico porta una parola dalla memoria a un registro. Se l’istruzione seguente ne ha subito bisogno, il prelievo F e la decodifica D si fermano, mentre nell’esecuzione E entra una bolla, una posizione senza istruzione utile. Il comando ret, che torna da una procedura, richiede inoltre l’indirizzo salvato in pila. Nel caso popq %rsp si preleva una parola dalla pila per usarla come nuovo puntatore alla cima. Poiché ret userà quel puntatore per cercare l’indirizzo di ritorno, il controllo conserva ret in D finché la parola è disponibile.",
    "I codici di condizione, o CC, registrano proprietà di un risultato aritmetico, come l’essere zero. Con una somma in E e lo stato normale AOK dell’istruzione anziana in M, il calcolo può aggiornare i CC. Se dalla memoria esce ADR, segnale di errore di indirizzo, questi indicatori devono conservare il valore precedente, così che l’arresto rifletta soltanto gli effetti delle istruzioni ammesse."
  ],
  '3.6.6': [
    "Tre istruzioni possono richiedere tempi diversi a seconda dell’ordine con cui il processore le incontra. Nella sequenza qui rappresentata, L legge la memoria e porta un valore nel registro %rax. U usa quel valore in un’addizione. I è indipendente da entrambi e può quindi occupare la posizione tra la lettura e l’uso del dato.",
    "La pipeline distribuisce il lavoro tra prelievo F, decodifica D, esecuzione E, memoria M e scrittura W. Per un carico E calcola l’indirizzo e M legge il contenuto. Se U segue immediatamente L, si trova in D mentre L è ancora in E. A quell’istante è pronto l’indirizzo, mentre il valore necessario all’addizione arriverà durante il passaggio di L in M.",
    "Con un solo gruppo L, U, I, la traccia mostra U per due cicli consecutivi in D. Il posto vuoto che nel frattempo avanza in E prende il nome di bolla. Nell’ordine L, I, U la memoria può servire L mentre U prepara gli operandi. Le sigle L1, U1 e I1 identificano le istruzioni del primo gruppo e consentono di seguirle anche quando si aggiunge un gruppo successivo."
  ],
  '3.6.7': [
    "Un programma può guadagnare tempo anche eseguendo esattamente le stesse istruzioni. Qui L legge una parola dalla memoria nel registro %rax, U somma quella parola a %rbx e I copia %rsi in %rdi. Dal momento che la copia tocca registri separati e conserva gli indicatori aritmetici, anticiparla rispetto alla somma lascia invariati i valori che le altre due istruzioni leggono e scrivono.",
    "Il vantaggio dipende dalla pipeline, che fa avanzare più istruzioni contemporaneamente attraverso cinque stadi di un ciclo. Quando U segue subito L, il processore deve aspettare un ciclo affinché la memoria fornisca il dato. Interponendo I, si occupa quel ciclo con un’operazione utile e la somma riceve il suo operando al momento in cui le serve.",
    "Con due gruppi di tre istruzioni e un periodo di 65 picosecondi, l’esecuzione senza attese dura dieci cicli, inclusi i quattro del riempimento. Nell’ordine originario si aggiungono due attese, una per gruppo. La differenza fra dodici e dieci cicli equivale quindi a 130 picosecondi. Il rapporto fra le due durate, pari a 1,2 in questo caso, misura l’accelerazione."
  ],
  '3.6.8': [
    "La pipeline è un insieme di stadi nei quali istruzioni diverse possono lavorare contemporaneamente. Un piccolo registro separa ogni stadio dal successivo. Per tutta la durata del ciclo il registro offre a valle i dati che ha conservato, mentre il circuito a monte prepara al suo ingresso i dati da acquisire al prossimo fronte, l’istante di aggiornamento indicato dal clock.",
    "Per capire una fotografia della pipeline è utile distinguere i nomi dei posti da quelli degli occupanti. D designa la decodifica, E l’esecuzione e M lo stadio di memoria. Un’etichetta come I4 segue invece una specifica istruzione durante il viaggio. Una bolla indica che in quel posto manca un’istruzione capace di produrre effetti.",
    "Si immagini, in un’altra configurazione, che D contenga I5 ed E contenga I4. Al fronte E riceve I5 dal tratto che sta a monte, mentre lo stadio seguente può acquisire i dati elaborati da I4. Per ricostruire l’aggiornamento proposto basta quindi considerare gli occupanti immediatamente precedenti al fronte e individuare, per ciascuna destinazione, il suo collegamento d’ingresso."
  ],
  '3.6.9': [
    "In una linea di esecuzione a più stadi, ciascun registro di passaggio conserva l’istruzione diretta allo stadio seguente. Se manca un dato, talvolta occorre trattenere l’istruzione dov’è e consentire che lo stadio successivo riceva un’operazione senza effetti. In altri casi bisogna sospendere il prelievo finché sarà noto l’indirizzo da cui proseguire.",
    "Due segnali governano questa attesa. Lo stallo conserva il contenuto del registro interessato. La bolla introduce invece un’operazione neutra che attraverserà lo stadio. Le lettere D ed E indicano rispettivamente la posizione di decodifica e quella di esecuzione.",
    "Una ret, l’istruzione che ritorna a chi ha chiamato una funzione, deve recuperare dalla pila l’indirizzo di ripresa. Se attende anche il valore del puntatore alla pila, le due esigenze coesistono. La tabella dei segnali va letta registro per registro, osservando dove resta l’istruzione vera e dove compare il posto vuoto."
  ],
  '3.6.10': [
    "Quando un’istruzione usa un valore che un’altra sta per leggere dalla memoria, il momento in cui quel dato arriva limita la velocità della coppia. Il forwarding, o inoltro, porta il risultato direttamente da uno stadio all’altro appena diventa disponibile. Nel frattempo il processore può svolgere lavoro indipendente.",
    "La lettera D indica la posizione in cui l’istruzione prepara gli operandi, W lo stadio finale che scrive il risultato. Se l’istruzione resta due cicli in D, nella riga temporale compaiono due caselle con quella stessa lettera. Contarle permette di spiegare lo scarto fra il primo ingresso in D e l’arrivo in W.",
    "Immaginiamo una lettura seguita immediatamente da una somma che usa il dato letto. Fra le due si può collocare una copia che lavora su altri registri, purché ne siano rispettate tutte le dipendenze. Nella traccia il guadagno si riconosce dal ciclo in cui la somma riesce ad avanzare e infine a scrivere il proprio risultato."
  ],

  'modulo-3': [
    "Un processore deve sommare due numeri e usare subito il risultato per aggiungervi uno. Il programma comprende due istruzioni. La prima, P, produce la somma da conservare nel registro R, una piccola memoria interna. La seconda, U, consuma quella somma. Ciascun numero è qui una parola di quattro bit, le cui posizioni, da destra, pesano 1, 2, 4 e 8. Se il risultato supera 15, il registro conserva il resto della divisione per 16.",
    "Le istruzioni attraversano cinque stadi, nei quali possono trovarsi contemporaneamente. F preleva l’istruzione, D riconosce l’operazione e raccoglie gli operandi, E esegue il calcolo, M consente un eventuale accesso alla memoria e W scrive il risultato. Nel ciclo 3 P si trova in E. Le quattro colonne della figura scompongono il lavoro del suo sommatore durante quello stesso ciclo. Per 7 + 1, il riporto corre dalle unità fino alla posizione di peso otto e la parola diventa 1000.",
    "U attende quella parola in D. Con l’inoltro, un filo conduce il valore appena prodotto da E alla lettura di D, cosicché U può iniziare il proprio calcolo nel ciclo 4. Usando il solo banco dei registri, U deve invece attendere il ciclo 5, quando P scrive R nella prima metà del ciclo e D può leggerlo nella seconda. Seguendo U fino a W si distingue il valore finale dal momento in cui viene conservato."
  ]
});
