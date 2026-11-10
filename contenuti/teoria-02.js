'use strict';

// Guida completa di ogni unità: scopo, teoria, casi, lettura e risultati.
(() => {
  const percorsi = {
  "2.1.1": {
    "scopo": "Un registro può esaurire le combinazioni disponibili mentre il calcolo prosegue. Segui un incremento alla frontiera di un byte e confrontalo con un incremento che rimane entro il limite, osservando insieme il dato e i segnali di stato.",
    "teoria": [
      "Mentre esegue un programma, il processore conserva i numeri sui quali sta lavorando in piccole memorie interne chiamate registri. Uno di questi, RAX, contiene 64 bit. Un bit è una cifra che può assumere i valori zero e uno. Il nome AL designa gli otto bit all’estremità destra di RAX. Questi bit formano un byte e rappresentano le unità e le potenze di due fino a 128, così che le loro combinazioni permettano di contare da 0 a 255.",
      "Le posizioni di un byte si numerano da zero partendo da destra: il bit 0 pesa 1, il bit 1 pesa 2 e il bit 7 pesa 128. La scrittura 0x introduce la base sedici, nella quale A, B, C, D, E e F valgono da 10 a 15; così 0xFF vale 15 × 16 + 15 = 255. Un immediato è un numero scritto direttamente nel comando, come il 254 di MOV. I flag sono indicatori binari: qui se ne osservano due, CF e ZF.",
      "Il comando MOV AL, 254 scrive il numero 254 in AL. Quando segue ADD AL, 1, il processore somma uno al contenuto del registro e lo porta a 255. Un ulteriore incremento richiederebbe una nona cifra binaria. Poiché la destinazione ne contiene otto, gli otto bit che vi restano sono tutti zero.",
      "La macchina registra anche due informazioni sulla somma. Il segnale CF vale uno quando si genera un riporto oltre il byte, mentre ZF vale uno quando il byte ottenuto è zero. La riga dedicata a MOV conserva i segnali precedenti. È la riga di ADD a descrivere gli effetti del calcolo."
    ],
    "introduzione": [
      "La simulazione permette di comprendere come la capacità di un registro condizioni il risultato di una somma. AL è una piccola memoria del processore che contiene otto bit, cioè otto cifre binarie, sufficienti per rappresentare valori da zero a 255. Le caselle mostrano il valore conservato, mentre CF segnala un riporto esterno e ZF un risultato nullo.",
      "Carica il caso con «Byte da caricare» pari a 255 e usa «Passo successivo» per distinguere il caricamento MOV dall’incremento ADD. Confronta poi il caso con 254: osserva insieme le otto caselle e i due indicatori. Il passaggio da 255 a zero va spiegato collegando la capacità del byte al riporto registrato separatamente."
    ],
    "lettura": "Le otto caselle superiori rappresentano AL, con il bit 7 a sinistra e il bit 0 a destra. Il riquadro dell’istruzione indica l’operazione corrente; CF e ZF mostrano rispettivamente il riporto oltre il byte e l’annullamento del risultato.",
    "conclusione": "La larghezza del registro determina il valore conservato; i flag descrivono proprietà ulteriori dell’operazione. Per riconoscere il superamento di 255 occorre leggere CF insieme agli otto bit di AL.",
    "controlli": {
      "a": "Intero senza segno da scrivere in AL prima dell’incremento. AL contiene otto bit, quindi il campo ammette da 0 a 255."
    },
    "esperienze": [
      {
        "titolo": "Oltre il limite del byte",
        "parametri": {
          "a": 255
        },
        "passi": [
          "Premi «Carica questo caso»: Byte da caricare = 255. Parti dal primo passo e avanza con «Passo successivo».",
          "Nel passo «MOV AL, immediato» leggi il byte e annota CF e ZF prima della somma.",
          "Confronta le otto caselle dopo ADD con i due flag: il riporto ha una sede distinta dal byte.",
          "Raggiungi «ADD AL, 1» e confronta i valori finali con il risultato previsto qui sotto. Ricostruisci il passaggio usando gli intermedi appena annotati."
        ],
        "risultato": "AL = 0x00; ZF = 1; CF = 1.",
        "ragionamento": "Il caricamento deposita 255, cioè 11111111, in AL. Aggiungendo uno si ottiene matematicamente 256 = 1 00000000 in binario: il byte conserva 0, CF registra il riporto e ZF vale 1 perché tutti i bit conservati sono zero.",
        "attesi": [
          {
            "passo": 2,
            "campo": "AL",
            "valore": "0x00"
          },
          {
            "passo": 2,
            "campo": "ZF",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "CF",
            "valore": "1"
          }
        ]
      },
      {
        "titolo": "Un incremento ancora rappresentabile",
        "parametri": {
          "a": 254
        },
        "passi": [
          "Premi «Carica questo caso»: Byte da caricare = 254. Parti dal primo passo e avanza con «Passo successivo».",
          "Nel passo «MOV AL, immediato» leggi il byte e annota CF e ZF prima della somma.",
          "Confronta le otto caselle dopo ADD con i due flag: il riporto ha una sede distinta dal byte.",
          "Raggiungi «ADD AL, 1» e confronta i valori finali con il risultato previsto qui sotto. Ricostruisci il passaggio usando gli intermedi appena annotati."
        ],
        "risultato": "AL = 0xFF; ZF = 0; CF = 0.",
        "ragionamento": "Partendo da 254, l’incremento produce 255 = 11111111, che occupa esattamente otto bit. CF rimane 0 perché manca un riporto esterno; ZF rimane 0 perché il byte contiene un valore positivo.",
        "attesi": [
          {
            "passo": 2,
            "campo": "AL",
            "valore": "0xFF"
          },
          {
            "passo": 2,
            "campo": "ZF",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "CF",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "2.1.2": {
    "scopo": "I nomi AL, AX ed EAX selezionano porzioni sovrapposte del registro RAX. Scrivi lo stesso dato attraverso due di queste viste e individua quali byte conservano FF e quali diventano zero.",
    "teoria": [
      "Un registro è una piccola memoria che il processore può leggere o scrivere per nome. Lo stesso registro a 64 bit, RAX, offre più punti di accesso. AL ne designa gli ultimi otto bit a destra, AX gli ultimi sedici ed EAX gli ultimi trentadue. Si tratta di porzioni sovrapposte dello stesso dato, così che modificare AL cambia anche il valore che si legge in AX.",
      "Il prefisso 0x introduce un numero scritto in base sedici. Le cifre da A a F valgono da dieci a quindici, e ogni coppia di cifre rappresenta un byte. Se gli otto byte di RAX valgono tutti FF, scrivere 0xAB in AL sostituisce soltanto l’ultima coppia. Scrivere lo stesso numero in AX produce 00AB nelle ultime quattro cifre, poiché la destinazione comprende due byte.",
      "Una maschera è una configurazione di bit che delimita le posizioni interessate da un’operazione. In questa figura i suoi uno indicano la parte del registro scelta come destinazione. «Parte conservata» indica invece il contributo dei vecchi byte al nuovo RAX: le posizioni da riscrivere vi compaiono già azzerate, pronte ad accogliere il dato.",
      "In modalità a 64 bit, la scrittura in EAX ha un effetto ulteriore previsto dalle istruzioni x86. I quattro byte alti di RAX vengono azzerati. Nel risultato completo si può così distinguere la parte occupata dal dato da quella che la scelta del registro ha conservato o azzerato."
    ],
    "introduzione": [
      "Questa attività chiarisce perché scrivere una parte di un registro possa avere effetti diversi sul registro completo. RAX contiene otto byte, gruppi di otto bit; AL, AX ed EAX ne selezionano rispettivamente uno, due e quattro. La striscia rende osservabile la relazione fra destinazione scelta, byte sostituiti e byte conservati, includendo l’azzeramento previsto per una scrittura in EAX.",
      "Con «Carica questo caso» avvia la scrittura di 171 in AL e raggiungi «Scrittura» usando «Passo successivo». Usa «Fissa per confronto» e carica il caso EAX, che impiega lo stesso dato. Leggi separatamente il byte AB e quelli che lo precedono: la scomparsa degli FF rende visibile l’effetto della destinazione sull’intero RAX."
    ],
    "lettura": "La striscia mostra gli otto byte di RAX dal più significativo a sinistra al meno significativo a destra. Gli indici inferiori contano i byte da destra; l’evidenziazione delimita la vista scelta e rende visibile anche l’azzeramento della metà alta dopo una scrittura in EAX.",
    "conclusione": "Una scrittura parziale va interpretata secondo la destinazione precisa. AL e AX preservano i byte esterni alla vista; una destinazione EAX porta a zero anche i 32 bit superiori di RAX.",
    "controlli": {
      "dest": "Vista del registro usata come destinazione: AL occupa 8 bit, AX 16, EAX 32. La scelta stabilisce anche quali byte esterni vengono conservati.",
      "b": "Dato immediato da copiare, fra 0 e 255. Nelle viste più larghe il dato viene completato con zeri prima della scrittura."
    },
    "esperienze": [
      {
        "titolo": "Scrittura nel solo AL",
        "parametri": {
          "dest": "8",
          "b": 171
        },
        "passi": [
          "Premi «Carica questo caso»: Destinazione = AL; Valore da scrivere = 171. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Selezione della vista» conta i bit delimitati dalla maschera.",
          "Dopo «Scrittura» confronta separatamente il byte AB e le sette coppie che lo precedono."
        ],
        "risultato": "Parte conservata = 0xFFFFFFFFFFFFFF00; RAX = 0xFFFFFFFFFFFFFFAB.",
        "ragionamento": "Il dato 171 si scrive AB in esadecimale. Con AL come destinazione si sostituisce soltanto l’ultimo byte di FFFFFFFFFFFFFFFF: i sette byte superiori conservano FF e RAX diventa 0xFFFFFFFFFFFFFFAB.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Parte conservata",
            "valore": "0xFFFFFFFFFFFFFF00"
          },
          {
            "passo": 2,
            "campo": "RAX",
            "valore": "0xFFFFFFFFFFFFFFAB"
          }
        ]
      },
      {
        "titolo": "Scrittura in EAX e metà alta azzerata",
        "parametri": {
          "dest": "32",
          "b": 171
        },
        "passi": [
          "Premi «Carica questo caso»: Destinazione = EAX; Valore da scrivere = 171. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Selezione della vista» conta i bit delimitati dalla maschera.",
          "Dopo «Scrittura» confronta separatamente il byte AB e le sette coppie che lo precedono."
        ],
        "risultato": "Parte conservata = 0x0000000000000000; RAX = 0x00000000000000AB.",
        "ragionamento": "Il dato 171 occupa EAX come 0x000000AB. La scrittura a 32 bit azzera per regola architetturale la metà alta di RAX, perciò il registro completo vale 0x00000000000000AB.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Parte conservata",
            "valore": "0x0000000000000000"
          },
          {
            "passo": 2,
            "campo": "RAX",
            "valore": "0x00000000000000AB"
          }
        ]
      }
    ]
  },
  "2.1.3": {
    "scopo": "Una copia fra registri conserva un risultato intermedio che un’istruzione successiva può riutilizzare. Ricostruisci la sequenza di MOV e ADD per capire perché il risultato finale raddoppi la prima somma.",
    "teoria": [
      "Per seguire un breve programma conviene attribuire un posto distinto a ogni registro, cioè a ciascuna delle piccole memorie interne del processore. EAX ed ECX possono contenere numeri uguali pur occupando posti diversi. Nella scrittura Intel l’istruzione nomina per prima la destinazione, sulla quale agirà il comando, e per seconda la sorgente, dalla quale ricaverà il dato.",
      "MOV è il comando di copia, mentre ADD somma alla destinazione il valore della sorgente. Un numero scritto nel comando, come 5, è un immediato; un nome come EAX chiede invece di leggere il registro corrispondente. Nella traccia compare anche ALU, abbreviazione di unità aritmetico-logica: è il circuito che esegue la somma. EAX ed ECX contengono ciascuno 32 bit.",
      "Con valore iniziale 5 e incremento 3, MOV colloca in EAX il numero 5 e ADD vi scrive la somma 8. Il successivo MOV ECX, EAX legge quell’8 e ne deposita una copia in ECX. Da questo istante entrambe le caselle contengono 8 e ciascuna può essere modificata separatamente.",
      "Nell’ultimo ADD la macchina legge EAX ed ECX prima di aggiornare la destinazione. EAX riceve dunque 16 e in ECX rimane 8. La riga in cui compare la copia spiega perché la seconda somma raddoppi il risultato intermedio: riducendo il primo incremento da 3 a 1 si porta l’intermedio a 6 e il risultato a 12."
    ],
    "introduzione": [
      "Seguire questa sequenza serve a comprendere come un programma costruisca un risultato attraverso valori intermedi. EAX ed ECX sono registri distinti: MOV copia un dato e ADD somma alla destinazione il contenuto della sorgente. Le due righe del diagramma mostrano come la copia conservi la prima somma, rendendola disponibile per il calcolo successivo.",
      "Carica il caso con valore iniziale 5 e primo incremento 3, quindi avanza fino a «MOV ECX, EAX». Confronta le due caselle della colonna e osserva quale cambia nell’ultimo ADD. Ripeti con incremento 1: collega il passaggio dell’intermedio da 8 a 6 al risultato finale, che passa da 16 a 12."
    ],
    "lettura": "Ogni colonna corrisponde a un’istruzione; EAX è nella riga superiore ed ECX in quella inferiore. Le frecce seguono prima l’evoluzione di EAX, poi la copia in ECX e infine il contributo di ECX alla somma finale.",
    "conclusione": "Il valore di un registro dipende dall’ultima scrittura che lo ha raggiunto. La sequenza realizza EAX = 2(x + d) e conserva x + d in ECX.",
    "controlli": {
      "x": "Numero caricato inizialmente in EAX da MOV. Il campo ammette interi da 0 a 30.",
      "d": "Quantità aggiunta dal primo ADD. La copia in ECX avviene dopo questo incremento, quindi anche il suo contributo viene raddoppiato."
    },
    "esperienze": [
      {
        "titolo": "Copia dell’intermedio 8",
        "parametri": {
          "x": 5,
          "d": 3
        },
        "passi": [
          "Premi «Carica questo caso»: Valore iniziale = 5; Primo incremento = 3. Parti dal primo passo e avanza con «Passo successivo».",
          "Avanza fino a «MOV ECX, EAX» e confronta le due righe della stessa colonna.",
          "Nell’ultimo ADD annota la destinazione modificata e il registro che conserva la copia.",
          "Raggiungi «ADD EAX, ECX» e confronta i valori finali con il risultato previsto qui sotto. Ricostruisci il passaggio usando gli intermedi appena annotati."
        ],
        "risultato": "Dopo l’ultimo ADD, EAX contiene 16, mentre ECX conserva la copia dell’intermedio 8.",
        "ragionamento": "MOV prepara EAX = 5 e il primo ADD aggiunge 3, ottenendo 8. MOV ECX, EAX conserva una copia di 8; l’ultimo ADD somma 8 + 8 e lascia EAX = 16, mentre ECX rimane 8.",
        "attesi": [
          {
            "passo": 3,
            "campo": "EAX",
            "valore": "16"
          },
          {
            "passo": 3,
            "campo": "ECX",
            "valore": "8"
          }
        ]
      },
      {
        "titolo": "Incremento ridotto, intermedio 6",
        "parametri": {
          "x": 5,
          "d": 1
        },
        "passi": [
          "Premi «Carica questo caso»: Valore iniziale = 5; Primo incremento = 1. Parti dal primo passo e avanza con «Passo successivo».",
          "Avanza fino a «MOV ECX, EAX» e confronta le due righe della stessa colonna.",
          "Nell’ultimo ADD annota la destinazione modificata e il registro che conserva la copia.",
          "Raggiungi «ADD EAX, ECX» e confronta i valori finali con il risultato previsto qui sotto. Ricostruisci il passaggio usando gli intermedi appena annotati."
        ],
        "risultato": "Dopo l’ultimo ADD, EAX contiene 12, mentre ECX conserva la copia dell’intermedio 6.",
        "ragionamento": "Con lo stesso valore iniziale 5 e incremento 1, il primo risultato è 6. La copia porta 6 in ECX e la somma finale vale 12; ridurre d di 2 riduce il risultato finale di 4.",
        "attesi": [
          {
            "passo": 3,
            "campo": "EAX",
            "valore": "12"
          },
          {
            "passo": 3,
            "campo": "ECX",
            "valore": "6"
          }
        ]
      }
    ]
  },
  "2.1.4": {
    "scopo": "Due operazioni indipendenti possono essere eseguite insieme quando esistono circuiti sufficienti. Confronta una macchina con una ALU e una con due ALU per distinguere il valore prodotto dal tempo necessario.",
    "teoria": [
      "Un processore può ospitare più circuiti capaci di fare somme. Ciascun circuito prende il nome di unità aritmetico-logica, abbreviato in ALU. In questa macchina ogni addizione si conclude in un ciclo, ossia nell’intervallo fra due battiti consecutivi del segnale che scandisce il lavoro. La durata del programma dipende sia dai circuiti disponibili sia dai numeri che occorrono per cominciare ciascun calcolo.",
      "I registri R8 e R9 sono piccole memorie interne nelle quali le istruzioni leggono e scrivono i numeri. I valori che il programma può osservare fanno parte dello stato architetturale. Il numero di ALU appartiene invece all’implementazione, cioè alla scelta dei circuiti che realizzano quelle istruzioni. INC aumenta di uno il registro nominato; ADD R8, R9 somma i due contenuti e scrive il risultato in R8.",
      "Supponiamo che i registri R8 e R9 contengano 4 e 9. Aggiungere uno a R8 produce 5 e aggiungere uno a R9 produce 10. Poiché ogni incremento legge il proprio registro, due ALU possono eseguirli durante lo stesso ciclo. Per formare la somma 5 + 10, invece, occorre che entrambi gli incrementi siano terminati.",
      "Con una sola ALU gli incrementi occupano due cicli distinti e il terzo serve alla somma. Con due ALU il risultato è già pronto alla fine del secondo ciclo. Il numero 15 che compare nel registro R8 permette di controllare separatamente il risultato del programma e il tempo che ha richiesto."
    ],
    "introduzione": [
      "Il confronto proposto aiuta a distinguere il risultato di un programma dal tempo necessario per ottenerlo. Una ALU è un circuito che esegue operazioni aritmetiche; nel modello ciascuna operazione dura un ciclo. Le corsie del diagramma mostrano quando due incrementi indipendenti possono procedere insieme e perché la somma successiva debba attenderne entrambi i risultati.",
      "Carica il caso con una ALU e valore di partenza 4, poi avanza fino a «Dipendenza finale». Usa «Fissa per confronto» e carica il caso con due ALU. Confronta il ciclo che completa R9, l’ultimo ciclo e il valore finale di R8: il risultato resta 15 mentre la durata scende da tre a due cicli."
    ],
    "lettura": "Ogni colonna del diagramma dura un ciclo e ogni corsia corrisponde a una ALU, cioè a un’unità aritmetico-logica. Gli incrementi di R8 e R9 possono occupare corsie diverse; l’ADD finale segue il completamento di entrambi.",
    "conclusione": "Il parallelismo riduce i cicli soltanto dove gli operandi sono già disponibili e le operazioni sono indipendenti. In questo modello ogni somma richiede un ciclo e il valore finale rimane invariato al cambiare del numero di ALU.",
    "controlli": {
      "alu": "Numero di circuiti di calcolo utilizzabili nello stesso ciclo. Ogni ALU può svolgere un incremento o una somma per ciclo.",
      "x": "Valore iniziale di R8. Il modello prepara R9 con cinque unità in più, poi incrementa entrambi prima di sommarli."
    },
    "esperienze": [
      {
        "titolo": "I tre cicli con una ALU",
        "parametri": {
          "alu": "1",
          "x": 4
        },
        "passi": [
          "Premi «Carica questo caso»: ALU disponibili = Una; Valore di partenza = 4. Parti dal primo passo e avanza con «Passo successivo».",
          "Nel passo «Due incrementi» individua il ciclo nel quale si completa R9.",
          "In «Dipendenza finale» leggi insieme «Ultimo ciclo» e R8, verificando separatamente durata e risultato."
        ],
        "risultato": "Ultimo ciclo = 3; R8 = 15; R9 = 10.",
        "ragionamento": "Con R8 = 4 e R9 = 9, gli incrementi producono 5 e 10. Una sola ALU li esegue nei cicli 1 e 2; l’ADD dipendente si conclude al ciclo 3 e scrive 15 in R8.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Ultimo ciclo",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "R8",
            "valore": "15"
          },
          {
            "passo": 2,
            "campo": "R9",
            "valore": "10"
          }
        ]
      },
      {
        "titolo": "Due incrementi nello stesso ciclo",
        "parametri": {
          "alu": "2",
          "x": 4
        },
        "passi": [
          "Premi «Carica questo caso»: ALU disponibili = Due; Valore di partenza = 4. Parti dal primo passo e avanza con «Passo successivo».",
          "Nel passo «Due incrementi» individua il ciclo nel quale si completa R9.",
          "In «Dipendenza finale» leggi insieme «Ultimo ciclo» e R8, verificando separatamente durata e risultato."
        ],
        "risultato": "Ultimo ciclo = 2; R8 = 15; R9 = 10.",
        "ragionamento": "Le due ALU completano 4 + 1 e 9 + 1 durante il ciclo 1. Il ciclo 2 può quindi sommare 5 e 10: R8 vale ancora 15, con un ciclo di esecuzione in meno.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Ultimo ciclo",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "R8",
            "valore": "15"
          },
          {
            "passo": 2,
            "campo": "R9",
            "valore": "10"
          }
        ]
      }
    ]
  },
  "2.1.5": {
    "scopo": "Una scrittura su AX modifica soltanto due degli otto byte di RAX. Ricostruisci il registro completo dopo MOV, mantenendo distinte la porzione sostituita e quella conservata.",
    "teoria": [
      "Un registro a 64 bit contiene otto gruppi di otto cifre binarie, i byte. Per leggerne il contenuto si usa spesso la base sedici, nella quale una coppia di cifre rappresenta esattamente un byte. Le coppie di maggior peso si scrivono a sinistra. Il nome AX individua i due byte di minor peso del registro chiamato RAX.",
      "Il prefisso 0x segnala la base sedici. Ogni cifra rappresenta quattro bit; A, B, C, D, E e F corrispondono ai valori da 10 a 15. MOV è un comando di copia: il nuovo dato prende il posto del vecchio soltanto nelle posizioni comprese nella destinazione AX.",
      "Nel caso proposto RAX vale 0x1122334455667788. Il sottoregistro AX contiene dunque 0x7788 e i sei byte superiori formano 0x112233445566. La scrittura di 0xABCD sostituisce esattamente i due byte di AX, poiché MOV agisce sulla larghezza indicata dalla destinazione.",
      "La figura assegna una cella a ogni coppia di cifre. Il confine dopo il sesto byte separa la parte conservata dalla parte riscritta: accostando 112233445566 e ABCD si legge 0x112233445566ABCD. La verifica deve quindi includere anche i byte esterni ad AX."
    ],
    "introduzione": [
      "La ricostruzione permette di verificare una scrittura parziale osservando anche la parte del registro che conserva il valore precedente. RAX comprende otto byte e AX identifica i due di minor peso, disegnati a destra. Ogni coppia di cifre esadecimali rappresenta un byte: questa corrispondenza rende visibile il confine fra la porzione sostituita da MOV e quella preservata.",
      "Parti dai dati iniziali e formula la tua previsione per RAX. Con «Passo successivo» raggiungi «Scrittura a 16 bit», confrontando gli ultimi due byte con i sei che li precedono. In «Rileggere RAX» riunisci le porzioni e controlla il risultato completo: ABCD deve sostituire 7788, mentre 112233445566 conserva la propria posizione."
    ],
    "lettura": "Le coppie esadecimali sono byte ordinati dal più significativo a sinistra. Il confine fra i sei byte superiori e AX delimita esattamente l’effetto della scrittura.",
    "conclusione": "La larghezza della destinazione stabilisce quanti byte sostituire. Ricomporre il registro completo permette di verificare anche la parte conservata.",
    "procedura": [
      "Leggi i dati iniziali: RAX vale 0x1122334455667788 e AX deve ricevere 0xABCD. Separa sul foglio le ultime quattro cifre dalle dodici che le precedono.",
      "Inserisci la tua previsione per RAX, poi avanza fino a «Scrittura a 16 bit». Verifica che cambi soltanto AX.",
      "In «Rileggere RAX» riunisci le due porzioni e confronta il numero completo con la previsione."
    ],
    "risultato": "Quale valore resta in RAX? 0x112233445566ABCD.",
    "ragionamento": "RAX contiene otto byte, dei quali AX occupa gli ultimi due. MOV sostituisce 0x7788 con 0xABCD in questa porzione. I sei byte superiori conservano 0x112233445566; accostando la parte conservata alla parte scritta si ottiene 0x112233445566ABCD."
  },
  "2.1.6": {
    "scopo": "Un’istruzione associa una trasformazione a una destinazione precisa. Nell’esercizio iniziale ricostruisci chi esegue ADD e dove viene scritto il risultato.",
    "teoria": [
      "Un’istruzione è un comando elementare che il processore esegue sui dati. In ADD EAX, EBX, EAX ed EBX designano due registri, piccole memorie interne. La sintassi Intel indica per prima la destinazione: il nuovo risultato sostituisce il vecchio contenuto di EAX.",
      "L’unità di controllo riconosce il comando: questa lettura dell’istruzione prende il nome di decodifica. Il banco dei registri, ossia l’insieme dei registri con i collegamenti che consentono di leggerli e scriverli, fornisce il vecchio contenuto di EAX e quello di EBX. L’unità aritmetico-logica, abbreviata ALU, calcola la somma. Il percorso del dato permette così di distinguere i componenti che lo conservano da quello che lo trasforma.",
      "Con EAX = 6 ed EBX = 4, l’ALU riceve 6 e 4 e produce 10. Il risultato viene scritto in EAX, mentre EBX conserva 4. Per controllare una traccia si possono quindi verificare sia il valore calcolato sia la sede che lo ha ricevuto."
    ],
    "introduzione": [
      "L’esercizio iniziale serve a riconoscere il percorso di una somma dentro il processore. Il banco dei registri conserva gli operandi, l’unità di controllo interpreta l’istruzione e l’ALU, unità aritmetico-logica, esegue il calcolo. La ricostruzione collega questi ruoli alla scrittura del risultato: in ADD EAX, EBX la prima sede nominata, EAX, riceve la somma.",
      "Premi «Carica l’esempio guidato», scegli la tua risposta per «Unità di calcolo» e usa «Registra la previsione» per avviare la ricostruzione. Procedi con «Passo successivo», confrontando i valori iniziali 6 e 4 con quelli finali dei due registri. Verifica che EAX riceva 10 e che EBX conservi 4, poi collega ciascun passaggio al componente responsabile."
    ],
    "lettura": "La ricostruzione segue l’istruzione, gli operandi forniti dal banco dei registri e il risultato dell’ALU. Leggi EAX come destinazione ed EBX come sorgente conservata.",
    "conclusione": "Separare decodifica, fornitura degli operandi e calcolo aiuta a riconoscere il ruolo dei componenti. In sintassi Intel la prima sede dell’ADD è quella che riceve la somma.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per aprire l’esercizio 1 «Dall’istruzione al risultato», traccia 1. Leggi la consegna e annota i dati iniziali; i risultati illustrati qui si riferiscono a questa traccia.",
      "Prevedi il campo «Unità di calcolo» e premi «Registra la previsione». Avanza poi nella ricostruzione, collegando ogni passaggio ai dati della consegna.",
      "Al termine controlla tutti i campi richiesti: Unità di calcolo; EAX finale. Apri «Apri la prova completa» per inserire anche le risposte successive e verificarne lo svolgimento integrale."
    ],
    "risultato": "Per l’esercizio 1, traccia 1: Unità di calcolo = ALU; EAX finale = 10.",
    "ragionamento": "L’unità di controllo decodifica ADD EAX, EBX e seleziona i due ingressi. Il banco dei registri fornisce 6 e 4 all’ALU. La somma vale 10. Il risultato viene scritto in EAX. EBX conserva 4."
  },
  "2.1.7": {
    "scopo": "Un accesso di più byte può restare in una sola linea di cache oppure attraversarne un confine. Nel caso iniziale controlla primo e ultimo indirizzo per contare le linee effettivamente coinvolte.",
    "teoria": [
      "Per abbreviare le letture, il processore conserva vicino a sé una copia di alcuni tratti di memoria in un deposito chiamato cache. Il tratto trasferito insieme prende il nome di linea. Gli indirizzi numerano i singoli byte, perciò un oggetto lungo più byte può trovarsi a cavallo di due linee.",
      "Quando tutte le linee hanno la stessa dimensione, la divisione dell’indirizzo per il numero di byte di una linea fornisce due informazioni. Il quoziente intero numerato da zero identifica la linea e il resto indica la posizione del byte al suo interno.",
      "Per una lettura di n byte il primo indirizzo è già incluso nel conteggio: l’ultimo si ottiene aggiungendo n − 1. Una richiesta la cui linea manca nella cache è detta miss e richiede di caricarla. Il caso esclude il prefetch, ossia il caricamento anticipato di linee, e le espulsioni, ossia la rimozione di linee già presenti per liberare spazio. Si può quindi contare un caricamento per ciascuna linea distinta richiesta.",
      "Nel caso proposto le linee misurano trentadue byte e la lettura di quattro byte parte da 0x3C, cioè 60. Il primo byte appartiene alla linea 1, come l’ultimo, che ha indirizzo 63. Tutti e quattro gli indirizzi restano nella stessa linea, quindi basta un caricamento dalla cache inizialmente vuota."
    ],
    "introduzione": [
      "Ripercorrere questa soluzione aiuta a contare le linee di cache interessate da una lettura. La cache conserva copie di blocchi della memoria, detti linee; ciascuna comprende qui 32 byte consecutivi. Poiché l’indirizzo identifica un singolo byte, occorre individuare entrambi gli estremi della richiesta e verificare se appartengano alla stessa linea.",
      "Con «Carica l’esempio guidato» apri la lettura di quattro byte da 0x3C, poi avanza mediante «Passo successivo». Confronta il primo indirizzo, 60, con l’ultimo, 63, e controlla i rispettivi numeri di linea. Il solo caricamento richiesto dalla cache vuota deriva dalla loro appartenenza alla linea 1; usa «Precedente» per rivedere il conteggio degli estremi."
    ],
    "lettura": "Il diagramma colloca gli indirizzi nella linea da 32 byte. Segui i due estremi della lettura: i numeri di linea si ottengono dividendo ciascun indirizzo per 32 e prendendo il quoziente intero.",
    "conclusione": "Il numero di linee dipende dall’intervallo completo della lettura. La cache vuota provoca un caricamento per ogni linea distinta nel modello privo di prefetch ed espulsioni.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per aprire l’esercizio 4 «Indirizzi consecutivi e linee di cache», traccia 1. Leggi la consegna e annota i dati iniziali; i risultati illustrati qui si riferiscono a questa traccia.",
      "Avanza nella ricostruzione con «Passo successivo», fermandoti dopo ogni scrittura o trasformazione. Confronta il dato ottenuto con il passaggio dello svolgimento.",
      "Al termine controlla tutti i campi richiesti: Numero della prima linea; Linee da caricare. Apri «Apri la prova completa» per inserire anche le risposte successive e verificarne lo svolgimento integrale."
    ],
    "risultato": "Per l’esercizio 4, traccia 1: Numero della prima linea = 1; Linee da caricare = 1.",
    "ragionamento": "Il primo indirizzo è 60 e appartiene alla linea 1. L’ultimo byte ha indirizzo 60 + 4 − 1 = 63 e appartiene alla linea 1. Le linee distinte sono 1 − 1 + 1 = 1. Ogni prima lettura della linea causa un miss."
  },
  "2.2.1": {
    "scopo": "La stessa sequenza di bit può rappresentare un conteggio positivo oppure un numero con segno. Studia due addizioni a otto bit per distinguere il riporto senza segno dall’overflow nella lettura con segno.",
    "teoria": [
      "Una fila di otto bit offre 256 combinazioni. Se serve a contare oggetti, queste combinazioni valgono da 0 a 255. Se occorre rappresentare anche numeri negativi, la convenzione detta complemento a due assegna alle combinazioni da 128 a 255 i valori da −128 a −1, sottraendo 256. Perciò la stessa fila di otto cifre a uno può indicare sia 255 sia −1.",
      "Nella formula generale w indica il numero di bit della destinazione. Le combinazioni disponibili sono 2ʷ e il risultato senza segno conservato è il resto della divisione della somma per 2ʷ: questo è il significato di aritmetica modulo 2ʷ. Con otto bit il modulo è 256; con sedici è 65536. Nella lettura con segno metà delle combinazioni rappresenta numeri negativi, secondo il complemento a due.",
      "In un’addizione il circuito somma le cifre e conserva tante posizioni quante ne contiene il registro. A otto bit, 127 + 1 produce 10000000. Come conteggio senza segno il valore 128 entra esattamente nel registro. Letto con segno, lo stesso disegno significa −128, mentre la somma matematica dei due addendi era positiva.",
      "Due segnali distinti annotano questi eventi. CF indica il riporto oltre l’ultima posizione, mentre OF segnala che la somma con segno è uscita dall’intervallo rappresentabile. Passando a sedici bit cambia il peso della posizione di segno e quindi cambia anche l’interpretazione degli stessi ingressi numerici."
    ],
    "introduzione": [
      "La simulazione aiuta a distinguere due modi di interpretare gli stessi bit e i rispettivi limiti aritmetici. Un byte rappresenta valori da zero a 255 senza segno oppure da −128 a 127 in complemento a due, la convenzione usata per gli interi con segno. CF segnala il riporto esterno, mentre OF segnala il superamento dell’intervallo con segno.",
      "Carica la somma 255 più 1 su otto bit e avanza dall’interpretazione degli ingressi alla riduzione del risultato. Confrontala con il caso 127 più 1, leggendo prima le somme matematiche e poi CF e OF. Associa ogni indicatore al proprio intervallo: nel primo caso si accende CF, nel secondo OF, benché entrambi i calcoli conservino soltanto otto bit."
    ],
    "lettura": "In alto compaiono gli operandi interpretati con segno e la loro somma matematica. La riga centrale mostra i bit effettivamente conservati, mentre CF e OF indicano due verifiche differenti della stessa addizione.",
    "conclusione": "CF e OF rispondono a intervalli diversi: da 0 a 2ʷ − 1 senza segno, da −2ʷ⁻¹ a 2ʷ⁻¹ − 1 con segno. Uno dei due può accendersi mentre l’altro resta spento.",
    "controlli": {
      "w": "Numero di bit della destinazione. La larghezza stabilisce il modulo dell’addizione e la posizione del bit di segno.",
      "a": "Configurazione iniziale del primo operando, immessa come intero da 0 a 255. A otto bit i valori da 128 a 255 hanno lettura con segno negativa.",
      "b": "Configurazione iniziale del secondo operando. Il modello ne mostra la lettura con segno prima della somma."
    },
    "esperienze": [
      {
        "titolo": "Riporto nella lettura senza segno",
        "parametri": {
          "w": "8",
          "a": 255,
          "b": 1
        },
        "passi": [
          "Premi «Carica questo caso»: Larghezza = 8 bit; Primo operando = 255; Secondo operando = 1. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Interpretazione» trascrivi il valore con segno di ogni ingresso.",
          "Confronta «Somme matematiche» con «Riduzione alla larghezza» e attribuisci separatamente CF e OF."
        ],
        "risultato": "Risultato = 0x00; CF = 1; OF = 0.",
        "ragionamento": "A otto bit 255 rappresenta −1 con segno. La somma senza segno 255 + 1 vale 256 e genera CF = 1, mentre la somma con segno −1 + 1 vale 0 e rimane rappresentabile, perciò OF = 0; il byte conservato è 0x00.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "0x00"
          },
          {
            "passo": 2,
            "campo": "CF",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "OF",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Overflow nella lettura con segno",
        "parametri": {
          "w": "8",
          "a": 127,
          "b": 1
        },
        "passi": [
          "Premi «Carica questo caso»: Larghezza = 8 bit; Primo operando = 127; Secondo operando = 1. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Interpretazione» trascrivi il valore con segno di ogni ingresso.",
          "Confronta «Somme matematiche» con «Riduzione alla larghezza» e attribuisci separatamente CF e OF."
        ],
        "risultato": "Risultato = 0x80; CF = 0; OF = 1.",
        "ragionamento": "Con A = 127 e B = 1 la somma matematica vale 128. Il valore entra nell’intervallo senza segno e CF = 0, mentre supera il massimo con segno 127: il byte è 0x80, interpretato come −128, e OF = 1.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "0x80"
          },
          {
            "passo": 2,
            "campo": "CF",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "OF",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "2.2.2": {
    "scopo": "Una funzione deve conservare gli argomenti ancora utili mentre costruisce il risultato. Segui il calcolo a × b + c nei registri e verifica quale valore rimane disponibile dopo la moltiplicazione.",
    "teoria": [
      "Una funzione è una parte di programma che riceve argomenti, svolge un compito e restituisce un risultato al punto che l’ha chiamata. System V stabilisce qui l’accordo fra chiamante e funzione sulle sedi degli argomenti e del risultato. Nella sintassi Intel usata dai comandi, la prima sede è la destinazione: MOV vi copia un dato, IMUL vi scrive il prodotto e ADD vi scrive la somma.",
      "Quando un programma chiama una funzione, deve consegnarle i numeri con cui lavorare. La convenzione System V usata qui assegna ai primi tre argomenti interi a 32 bit tre registri del processore, chiamati EDI, ESI ed EDX. Un registro è una piccola memoria interna. Al termine della funzione il chiamante cerca il risultato intero in un quarto registro, EAX.",
      "Per calcolare a × b + c conviene usare EAX anche per il prodotto intermedio. Con a uguale a 4, b a 7 e c a 3, MOV EAX, EDI copia il primo fattore in EAX. L’istruzione IMUL EAX, ESI moltiplica i due interi con segno e sostituisce il 4 di EAX con 28.",
      "Il terzo argomento, rimasto in EDX durante la moltiplicazione, è ancora disponibile quando arriva ADD. La somma con 3 porta EAX a 31. Cambiando il segno di b si ottiene prima −28 e poi −25: la successione in EAX rivela a quale passaggio dell’espressione corrisponda ciascuna scrittura."
    ],
    "introduzione": [
      "Questa simulazione mostra come tradurre l’espressione a × b + c rispettando la disponibilità degli argomenti. La convenzione System V è l’accordo che assegna i primi tre interi ai registri EDI, ESI ed EDX e il risultato a EAX. Le frecce permettono di seguire prodotto e somma, verificando che c rimanga disponibile fino all’ultima istruzione.",
      "Con «Carica questo caso» imposta a = 4, b = 7 e c = 3. Avanza con «Passo successivo» e, dopo IMUL, confronta EAX con EDX: il prodotto vale 28 e l’addendo resta 3. Ripeti con b = −7 e collega il prodotto −28 al risultato −25, osservando la stessa successione di registri."
    ],
    "lettura": "I tre riquadri superiori contengono gli argomenti in EDI, ESI ed EDX. Le frecce convergono sul riquadro EAX, che viene aggiornato da MOV, IMUL e ADD; EDX conserva c fino all’ultimo passaggio.",
    "conclusione": "Un registro di risultato può accumulare gli intermedi senza distruggere gli argomenti nelle rispettive sedi. Per gli intervalli offerti il prodotto e la somma rimangono rappresentabili su 32 bit con segno.",
    "controlli": {
      "a": "Primo fattore, consegnato dalla funzione chiamante in EDI e copiato in EAX.",
      "b": "Secondo fattore con segno, disponibile in ESI. Un valore negativo permette di seguire il segno del prodotto.",
      "c": "Addendo conservato in EDX durante IMUL e utilizzato soltanto dall’ADD finale."
    },
    "esperienze": [
      {
        "titolo": "Prodotto positivo e addendo conservato",
        "parametri": {
          "a": 4,
          "b": 7,
          "c": 3
        },
        "passi": [
          "Premi «Carica questo caso»: a = 4; b = 7; c = 3. Parti dal primo passo e avanza con «Passo successivo».",
          "Ferma la traccia dopo «IMUL EAX, ESI» e leggi EAX insieme a EDX.",
          "Confronta il contenuto finale di EAX con il prodotto intermedio più c.",
          "Raggiungi «ADD EAX, EDX» e confronta i valori finali con il risultato previsto qui sotto. Ricostruisci il passaggio usando gli intermedi appena annotati."
        ],
        "risultato": "Il risultato finale dell’espressione a × b + c è 31 e si trova nel registro EAX.",
        "ragionamento": "MOV copia a = 4 in EAX. IMUL produce 4 × 7 = 28, mentre EDX conserva 3; ADD completa 28 + 3 = 31 e lascia questo valore in EAX.",
        "attesi": [
          {
            "passo": 2,
            "campo": "EAX",
            "valore": "31"
          }
        ]
      },
      {
        "titolo": "Secondo fattore negativo",
        "parametri": {
          "a": 4,
          "b": -7,
          "c": 3
        },
        "passi": [
          "Premi «Carica questo caso»: a = 4; b = -7; c = 3. Parti dal primo passo e avanza con «Passo successivo».",
          "Ferma la traccia dopo «IMUL EAX, ESI» e leggi EAX insieme a EDX.",
          "Confronta il contenuto finale di EAX con il prodotto intermedio più c.",
          "Raggiungi «ADD EAX, EDX» e confronta i valori finali con il risultato previsto qui sotto. Ricostruisci il passaggio usando gli intermedi appena annotati."
        ],
        "risultato": "Il risultato finale dell’espressione a × b + c è -25 e si trova nel registro EAX.",
        "ragionamento": "Sostituendo b con −7, IMUL produce 4 × (−7) = −28. EDX contiene ancora 3 e l’ultima somma restituisce −25: il segno del prodotto si propaga al calcolo senza cambiare la posizione dell’addendo.",
        "attesi": [
          {
            "passo": 2,
            "campo": "EAX",
            "valore": "-25"
          }
        ]
      }
    ]
  },
  "2.2.3": {
    "scopo": "Una divisione intera produce un quoziente e un resto, che insieme permettono di ricostruire il dividendo. Confronta una divisione valida con il caso di divisore zero e segui il punto in cui l’istruzione si arresta.",
    "teoria": [
      "Distribuendo diciassette oggetti in gruppi completi di cinque si ottengono tre gruppi e avanzano due oggetti. Il primo numero è il quoziente intero, il secondo è il resto, che deve essere minore del divisore. Il processore può calcolare entrambi con una sola istruzione, DIV, destinata alla divisione di numeri senza segno.",
      "Nella forma DIV RCX il registro RCX contiene il divisore. RDX e RAX sono registri di 64 bit, piccole memorie interne al processore. Il numero da dividere occupa la coppia RDX:RAX: RDX è la metà alta e pesa 2⁶⁴ volte il proprio contenuto, mentre RAX è la metà bassa. Ponendo RDX a zero si ottiene un dividendo uguale al numero scritto in RAX. Terminata la divisione, RAX contiene il quoziente e RDX il resto. Il controllo 3 × 5 + 2 = 17 ricostruisce il dividendo.",
      "Un divisore uguale a zero impedisce di formare i gruppi. In questo caso il processore segnala un’eccezione, ossia un evento che interrompe l’istruzione, indicata con #DE. I valori ancora visibili nei due registri appartengono allo stato precedente."
    ],
    "introduzione": [
      "L’attività permette di comprendere insieme il significato della divisione intera e le condizioni necessarie per completarla. DIV legge il dividendo nella coppia RDX:RAX e il divisore in RCX; consegna poi quoziente e resto in RAX e RDX. I riquadri mostrano questi cambiamenti di ruolo e distinguono i risultati prodotti dallo stato conservato quando interviene un’eccezione.",
      "Carica il caso 17 diviso 5 e procedi fino a «Quoziente e resto». Verifica che 3 × 5 + 2 ricostruisca 17 e che il resto sia inferiore al divisore. Carica poi il caso con divisore zero: osserva #DE, il segnale di errore, e interpreta 17 e zero nei registri come valori precedenti alla divisione."
    ],
    "lettura": "I riquadri superiori mostrano RDX:RAX come coppia alta e bassa del dividendo e RCX come divisore. Quelli inferiori mostrano i registri dopo DIV; nel caso di eccezione la figura li etichetta come conservati.",
    "conclusione": "Il controllo quoziente × divisore + resto deve ricostruire il dividendo e il resto deve essere minore del divisore. Con divisore zero DIV segnala #DE prima di consegnare un quoziente.",
    "controlli": {
      "a": "Dividendo senza segno inserito nella metà bassa RAX. La metà alta RDX viene preparata a zero.",
      "b": "Divisore letto in RCX. Il valore zero seleziona il percorso di eccezione, mentre i valori positivi consentono quoziente e resto."
    },
    "esperienze": [
      {
        "titolo": "Quoziente e resto di 17 diviso 5",
        "parametri": {
          "a": 17,
          "b": 5
        },
        "passi": [
          "Premi «Carica questo caso»: Dividendo = 17; Divisore = 5. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Leggi il divisore» verifica RCX prima di cercare quoziente e resto.",
          "Nell’ultimo passo distingui i risultati di una divisione completata dai valori conservati quando compare #DE.",
          "Raggiungi «Quoziente e resto» e confronta i valori finali con il risultato previsto qui sotto. Ricostruisci il passaggio usando gli intermedi appena annotati."
        ],
        "risultato": "RAX = 3; RDX = 2; Quoziente × divisore + resto = 17.",
        "ragionamento": "Diciassette contiene tre gruppi completi di cinque, che consumano quindici unità, e ne avanzano due. DIV scrive quindi RAX = 3 e RDX = 2; la verifica 3 × 5 + 2 restituisce 17.",
        "attesi": [
          {
            "passo": 2,
            "campo": "RAX",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "RDX",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "Quoziente × divisore + resto",
            "valore": "17"
          }
        ]
      },
      {
        "titolo": "Divisore zero ed eccezione",
        "parametri": {
          "a": 17,
          "b": 0
        },
        "passi": [
          "Premi «Carica questo caso»: Dividendo = 17; Divisore = 0. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Leggi il divisore» verifica RCX prima di cercare quoziente e resto.",
          "Nell’ultimo passo distingui i risultati di una divisione completata dai valori conservati quando compare #DE.",
          "Raggiungi «Eccezione #DE» e confronta i valori finali con il risultato previsto qui sotto. Ricostruisci il passaggio usando gli intermedi appena annotati."
        ],
        "risultato": "RDX = 0; RAX = 17.",
        "ragionamento": "Il divisore zero rende indefinita la divisione richiesta. DIV genera #DE e i risultati restano da produrre: RAX conserva il dividendo 17 e RDX la metà alta zero preparata prima dell’istruzione.",
        "attesi": [
          {
            "passo": 2,
            "campo": "RDX",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "RAX",
            "valore": "17"
          }
        ]
      }
    ]
  },
  "2.2.4": {
    "scopo": "Le scale offerte dal calcolo degli indirizzi permettono di costruire coefficienti aritmetici. Ricostruisci 7a + 3b − 4 seguendo i contributi separati, poi cambia il segno di a e prevedi il nuovo risultato.",
    "teoria": [
      "La memoria è una successione di byte numerati. Per trovare rapidamente un dato, il processore sa calcolare un indirizzo sommando un numero di partenza, un secondo numero moltiplicato per una scala e una correzione fissa. L’istruzione LEA, il cui nome significa «carica l’indirizzo efficace», deposita questo calcolo in un registro. Il numero ottenuto può anche servire come termine di un’espressione aritmetica.",
      "I registri sono piccole memorie interne al processore: RAX è quello in cui il modello raccoglie il risultato finale. Il termine scala indica il moltiplicatore applicato a un solo contributo; spiazzamento indica la correzione fissa aggiunta alla fine, qui −4. Durante questa attività i numeri calcolati vengono usati come valori aritmetici; LEA forma il numero senza trasferire dati dalla memoria.",
      "Poiché le scale disponibili sono 1, 2, 4 e 8, il prodotto per sette si costruisce prendendo otto volte il fattore e sottraendolo una volta. Per a = 3 si passa da 24 a 21. Il prodotto per tre si ottiene invece sommando il secondo fattore al proprio doppio. Se b vale 2, questo termine vale 2 + 4, ossia 6.",
      "La correzione fissa −4 si applica alla somma dei due termini. Nel registro RAX arriva quindi 21 + 6 − 4. Le quantità intermedie permettono di riconoscere l’origine dei coefficienti anche quando il programma contiene soltanto somme, scale e una sottrazione."
    ],
    "introduzione": [
      "Il percorso serve a riconoscere un’espressione aritmetica costruita attraverso scale e somme. LEA calcola un numero combinando registri e una correzione fissa, detta spiazzamento. Poiché le scale ammesse comprendono 2 e 8, il diagramma rende visibile come ottenere 7a sottraendo a da 8a e 3b sommando b al suo doppio, prima della correzione finale.",
      "Carica a = 3 e b = 2, quindi avanza fino a «Combina i fattori». Annota i contributi 21 e 6 e confronta la somma parziale 27 con RAX dopo lo spiazzamento −4. Ripeti con a = −3: segui soprattutto la sottrazione di un numero negativo e verifica come il primo ramo conduca al risultato −19."
    ],
    "lettura": "Il ramo superiore parte da 8a e sottrae a; quello inferiore parte da b e forma b + 2b. I due rami convergono nel riquadro finale, dove viene applicata la correzione −4.",
    "conclusione": "La scelta delle scale rende riconoscibile un’espressione anche quando il codice contiene LEA e sottrazioni. LEA deposita il valore del calcolo di indirizzo in un registro, senza eseguire una lettura dalla cella così numerata.",
    "controlli": {
      "a": "Primo argomento con segno. Il modello forma prima 8a e poi sottrae a per ottenere 7a.",
      "b": "Secondo argomento con segno. Il suo contributo viene costruito come b + 2b, prima della correzione fissa −4."
    },
    "esperienze": [
      {
        "titolo": "Due contributi positivi",
        "parametri": {
          "a": 3,
          "b": 2
        },
        "passi": [
          "Premi «Carica questo caso»: a = 3; b = 2. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Combina i fattori» annota separatamente 7a e 3b.",
          "In «Applica lo spiazzamento» confronta la somma parziale con RAX e individua la correzione di quattro unità."
        ],
        "risultato": "Somma parziale = 27; RAX = 23.",
        "ragionamento": "Con a = 3 il primo ramo vale 8 × 3 − 3 = 21; con b = 2 il secondo vale 2 + 2 × 2 = 6. La somma parziale 27, corretta di −4, produce RAX = 23.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Somma parziale",
            "valore": "27"
          },
          {
            "passo": 2,
            "campo": "RAX",
            "valore": "23"
          }
        ]
      },
      {
        "titolo": "Primo contributo negativo",
        "parametri": {
          "a": -3,
          "b": 2
        },
        "passi": [
          "Premi «Carica questo caso»: a = -3; b = 2. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Combina i fattori» annota separatamente 7a e 3b.",
          "In «Applica lo spiazzamento» confronta la somma parziale con RAX e individua la correzione di quattro unità."
        ],
        "risultato": "Somma parziale = -15; RAX = -19.",
        "ragionamento": "Con a = −3, 8a vale −24 e sottrarre a significa aggiungere 3, ottenendo −21. Il contributo di b resta 6: −21 + 6 − 4 dà RAX = −19.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Somma parziale",
            "valore": "-15"
          },
          {
            "passo": 2,
            "campo": "RAX",
            "valore": "-19"
          }
        ]
      }
    ]
  },
  "2.2.5": {
    "scopo": "Un salto condizionale legge uno stato lasciato dalle istruzioni precedenti. Confronta LEA e ADD che producono lo stesso incremento in EAX e osserva come cambia la decisione di JZ.",
    "teoria": [
      "Un programma può scegliere l’istruzione successiva consultando un piccolo segnale memorizzato nel processore. Il segnale chiamato ZF, abbreviazione di zero flag, vale uno quando il risultato dell’ultima operazione che lo aggiorna è zero. Il comando JZ usa quel segnale per saltare a un indirizzo stabilito. Quando ZF vale zero, l’esecuzione continua in ordine.",
      "Il contratto di un’istruzione è l’insieme degli effetti che essa promette su registri, flag e controllo dell’esecuzione. In LEA EAX, [RAX+1] le parentesi racchiudono l’espressione da calcolare. LEA ne scrive il valore in EAX; in questa istruzione le parentesi indicano la forma del calcolo e la memoria resta estranea all’operazione. Il salto JZ significa «salta se zero» e verifica ZF al momento in cui viene eseguito.",
      "Due istruzioni possono lasciare lo stesso numero in EAX, un registro a 32 bit, pur producendo effetti diversi sul segnale. ADD EAX, 1 prende il valore contenuto in EAX, somma uno e aggiorna ZF. LEA EAX, [RAX+1] forma la stessa espressione aritmetica e conserva lo ZF che trovava all’ingresso.",
      "Con EAX inizialmente uguale a 5 e ZF a uno, entrambe le operazioni scrivono 6. Dopo ADD il successivo JZ prosegue in ordine, perché l’addizione ha prodotto 6. Dopo LEA lo stesso salto trova ancora il valore uno lasciato da un’operazione precedente."
    ],
    "introduzione": [
      "Confrontare LEA e ADD permette di capire perché il contratto di un’istruzione comprenda anche gli effetti sui flag. Un flag è un indicatore binario conservato dal processore; ZF indica se il risultato dell’ultima operazione che lo aggiorna è zero. La figura segue separatamente EAX e ZF, mostrando come il salto JZ possa scegliere percorsi diversi a parità di valore numerico.",
      "Carica il caso LEA con EAX iniziale 5 e ZF iniziale 1. Avanza fino a «JZ destinazione» e usa «Fissa per confronto», poi carica il caso ADD con gli stessi ingressi. EAX raggiunge 6 in entrambi: ricostruisci invece la provenienza di ZF per spiegare il salto preso dopo LEA e la prosecuzione ordinaria dopo ADD."
    ],
    "lettura": "La riga superiore segue il valore numerico in EAX. In basso si vede da dove proviene ZF: il percorso di LEA collega il flag iniziale al salto, mentre ADD fornisce un nuovo flag dal proprio risultato.",
    "conclusione": "Per sostituire un’istruzione con un’altra occorre confrontare tutti gli effetti successivamente osservati. Qui lo stesso valore di EAX accompagna due percorsi di controllo diversi perché soltanto ADD aggiorna ZF.",
    "controlli": {
      "op": "Operazione che incrementa EAX: LEA conserva i flag, ADD li aggiorna in base al risultato.",
      "x": "Contenuto iniziale di EAX. L’opzione 0xFFFFFFFF permette di esplorare anche il ritorno a zero dopo un incremento a 32 bit.",
      "z": "Valore del flag di zero prima dell’operazione. JZ lo usa direttamente se l’operazione scelta lo conserva."
    },
    "esperienze": [
      {
        "titolo": "LEA conserva il flag precedente",
        "parametri": {
          "op": "lea",
          "x": "5",
          "z": "1"
        },
        "passi": [
          "Premi «Carica questo caso»: Istruzione = LEA; EAX iniziale = 5; ZF iniziale = 1. Parti dal primo passo e avanza con «Passo successivo».",
          "Dopo «Calcolo» annota EAX prima di leggere il percorso del salto.",
          "In «JZ destinazione» collega ZF alla sua sorgente nella figura e verifica quale ramo è preso."
        ],
        "risultato": "ZF = 1; Percorso = salto preso.",
        "ragionamento": "LEA porta EAX da 5 a 6 e lascia ZF al valore iniziale 1. JZ trova quindi il flag acceso e prende il salto, benché EAX contenga 6.",
        "attesi": [
          {
            "passo": 2,
            "campo": "ZF",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Percorso",
            "valore": "salto preso"
          }
        ]
      },
      {
        "titolo": "ADD aggiorna il flag di zero",
        "parametri": {
          "op": "add",
          "x": "5",
          "z": "1"
        },
        "passi": [
          "Premi «Carica questo caso»: Istruzione = ADD; EAX iniziale = 5; ZF iniziale = 1. Parti dal primo passo e avanza con «Passo successivo».",
          "Dopo «Calcolo» annota EAX prima di leggere il percorso del salto.",
          "In «JZ destinazione» collega ZF alla sua sorgente nella figura e verifica quale ramo è preso."
        ],
        "risultato": "ZF = 0; Percorso = istruzione successiva.",
        "ragionamento": "ADD produce anch’essa EAX = 6, poi aggiorna ZF a 0 perché il risultato differisce da zero. JZ prosegue con l’istruzione successiva: il cambiamento dipende dal flag aggiornato.",
        "attesi": [
          {
            "passo": 2,
            "campo": "ZF",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Percorso",
            "valore": "istruzione successiva"
          }
        ]
      }
    ]
  },
  "2.2.6": {
    "scopo": "La posizione del bit di segno cambia quando cambia la larghezza dell’operazione. Esegui la stessa sottrazione con otto e sedici bit per capire il diverso valore di OF.",
    "teoria": [
      "Sottrarre uno dal numero 128 dà 127. Per capire i segnali che accompagnano la sottrazione, tuttavia, bisogna prima sapere con quante cifre binarie si stanno rappresentando i numeri. In otto bit il disegno di 128 è 10000000. Se si leggono gli stessi bit come un intero con segno in complemento a due, quel disegno rappresenta −128, il valore minimo.",
      "In SUB A, B il minuendo è A, il sottraendo è B e la differenza cercata è A − B. I flag sono indicatori binari, ciascuno dedicato a una proprietà del risultato: CF significa carry flag, OF overflow flag, SF sign flag e ZF zero flag. Per la sottrazione senza segno CF vale uno quando A è minore di B e serve un prestito esterno. OF riguarda invece la rappresentabilità della differenza con segno.",
      "L’istruzione SUB trattiene gli otto bit di minor peso della differenza. Calcolando 10000000 meno uno si ottiene 01111111, il cui valore è 127. Nella lettura con segno la differenza matematica sarebbe −129, che richiederebbe più spazio. Il segnale OF registra questo superamento. CF risponde a una domanda distinta, ossia se per sottrarre i due valori senza segno occorresse un prestito oltre la posizione più alta.",
      "Il segnale SF copia il bit più a sinistra del risultato conservato, mentre ZF indica che il risultato è zero. Se la larghezza passa a sedici bit, il bit che determina il segno si trova più a sinistra e il numero 128 iniziale diventa positivo anche nella lettura con segno."
    ],
    "introduzione": [
      "Questa attività rende osservabile la dipendenza dei flag dalla larghezza dell’operazione. Con la rappresentazione in complemento a due, il bit più alto determina il segno: la configurazione 128 indica −128 su otto bit e +128 su sedici. La sottrazione permette così di distinguere OF, che segnala un risultato con segno fuori intervallo, da CF, che registra il prestito senza segno.",
      "Carica la sottrazione 128 meno 1 su otto bit e usa «Passo successivo» per leggere prima gli operandi con segno e poi la differenza ideale. Confronta il caso su sedici bit mantenendo gli ingressi. Sebbene il valore conservato sia 127 in entrambi, collega OF ai limiti mostrati: −129 scende sotto il minimo del primo caso, mentre 127 rientra nel secondo."
    ],
    "lettura": "In alto si leggono gli operandi e la differenza nella lettura con segno. Sotto compaiono i bit conservati e quattro flag: CF per il prestito senza segno, OF per l’overflow con segno, SF per il bit più alto e ZF per il risultato zero.",
    "conclusione": "Un giudizio sul segno richiede la larghezza dell’operazione. La stessa cifra numerica 128 significa −128 in una parola con segno a otto bit e +128 in una parola a sedici bit.",
    "controlli": {
      "w": "Larghezza di SUB e posizione del bit di segno. Il modello conserva tanti bit quanti ne indica questa scelta.",
      "a": "Minuendo immesso come configurazione da 0 a 255. Il passo iniziale ne espone l’interpretazione con segno alla larghezza scelta.",
      "b": "Sottraendo, anch’esso interpretato alla larghezza selezionata prima del calcolo dei flag."
    },
    "esperienze": [
      {
        "titolo": "La frontiera degli otto bit",
        "parametri": {
          "w": "8",
          "a": 128,
          "b": 1
        },
        "passi": [
          "Premi «Carica questo caso»: Larghezza = 8 bit; Minuendo = 128; Sottraendo = 1. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Leggi gli operandi» controlla il valore attribuito ad A con segno.",
          "In «Sottrai» confronta la differenza ideale con minimo e massimo; soltanto dopo leggi i flag di «Stato dopo SUB»."
        ],
        "risultato": "Risultato = 0x7F; CF = 0; OF = 1; SF = 0; ZF = 0.",
        "ragionamento": "Su otto bit 128 rappresenta −128. La differenza con segno −128 − 1 = −129 scende sotto il minimo −128: i bit conservati sono 0x7F e OF = 1; il confronto senza segno 128 ≥ 1 lascia CF = 0.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "0x7F"
          },
          {
            "passo": 2,
            "campo": "CF",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "OF",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "SF",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "ZF",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Gli stessi ingressi su sedici bit",
        "parametri": {
          "w": "16",
          "a": 128,
          "b": 1
        },
        "passi": [
          "Premi «Carica questo caso»: Larghezza = 16 bit; Minuendo = 128; Sottraendo = 1. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Leggi gli operandi» controlla il valore attribuito ad A con segno.",
          "In «Sottrai» confronta la differenza ideale con minimo e massimo; soltanto dopo leggi i flag di «Stato dopo SUB»."
        ],
        "risultato": "Risultato = 0x007F; CF = 0; OF = 0; SF = 0; ZF = 0.",
        "ragionamento": "Su sedici bit gli stessi ingressi rappresentano +128 e +1. La differenza 127 è valida con entrambe le interpretazioni: il registro contiene 0x007F e CF, OF, SF e ZF valgono tutti zero.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "0x007F"
          },
          {
            "passo": 2,
            "campo": "CF",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "OF",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "SF",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "ZF",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "2.2.7": {
    "scopo": "Una funzione può separare il calcolo di un candidato dalla scelta del valore da restituire. Esamina la soglia b < 10 nella funzione score, provando i due interi consecutivi che stanno ai lati della decisione.",
    "teoria": [
      "Un candidato è un valore provvisorio che il programma ha già calcolato e può ancora scegliere o modificare. La funzione è un tratto di programma che riceve a, b e c e restituisce un numero. CMP confronta due valori aggiornando i flag, piccoli indicatori del processore, e lascia gli operandi disponibili. Il simbolo < indica un confronto stretto: il caso di uguaglianza deve seguire l’altro ramo.",
      "Una funzione può prima calcolare un risultato provvisorio e poi scegliere se restituirlo o cambiarne il segno. Nella funzione score, a e c determinano il candidato 7a + c. A decidere il percorso è invece b, interpretato come intero senza segno e confrontato con la soglia dieci.",
      "Con a = 2 e c = 1, il calcolo prende otto volte 2, sottrae 2 e aggiunge 1, ottenendo 15. L’istruzione CMP b, 10 esamina la sottrazione b − 10 per aggiornare i segnali del processore. Quando b vale 9, la sottrazione senza segno richiede un prestito e il segnale CF si accende. JB, che significa «salta se inferiore» per gli interi senza segno, legge proprio CF.",
      "Con il salto preso il programma conserva 15. Ponendo b uguale a 10, il confronto dà uguaglianza e il percorso raggiunge l’operazione che rende il candidato opposto, pari a −15. Per decidere dove collocare il caso di uguaglianza occorre seguire la condizione precisa del salto."
    ],
    "introduzione": [
      "La simulazione permette di separare il calcolo di un valore provvisorio dalla decisione sul risultato da restituire. La funzione score forma 7a + c e usa b per scegliere il percorso. CMP confronta b con dieci aggiornando i flag; JB legge CF per riconoscere un valore inferiore senza segno. Il diagramma rende visibile il trattamento dell’uguaglianza alla soglia.",
      "Carica il caso a = 2, b = 9 e c = 1. Avanza dal candidato 15 al confronto e annota il ramo seguito. Carica poi il caso b = 10, mantenendo a e c: confronta CF e il ritorno finale. Il passaggio da 15 a −15 permette di verificare che l’uguaglianza appartenga al ramo che cambia segno."
    ],
    "lettura": "Il riquadro sinistro contiene 7a + c, già pronto prima del confronto. Da CMP partono i due rami: CF = 1 conserva il candidato e CF = 0 ne cambia il segno.",
    "conclusione": "Il confronto senza segno determina il ramo indipendentemente dal candidato aritmetico. Con una condizione stretta b < 10, il valore di confine 10 appartiene al percorso che nega il risultato.",
    "controlli": {
      "a": "Argomento del termine 7a. Il modello lo moltiplica per otto e ne sottrae una copia.",
      "b": "Intero senza segno confrontato con dieci. Questo ingresso sceglie il ramo della funzione.",
      "c": "Addendo sommato a 7a prima del confronto; modifica il candidato, lasciando a b la decisione sul segno finale."
    },
    "esperienze": [
      {
        "titolo": "Appena sotto la soglia",
        "parametri": {
          "a": 2,
          "b": 9,
          "c": 1
        },
        "passi": [
          "Premi «Carica questo caso»: a = 2; b senza segno = 9; c = 1. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Forma il candidato» calcola 7a + c prima di esaminare b.",
          "In «CMP b, 10» leggi CF e segui il ramo corrispondente fino a «Seleziona il ritorno»."
        ],
        "risultato": "Percorso = candidato invariato; Risultato = 15.",
        "ragionamento": "Con a = 2 e c = 1, il candidato vale 16 − 2 + 1 = 15. Per b = 9, CMP esamina 9 − 10 e genera CF = 1; JB prende il ramo che restituisce il candidato invariato, quindi 15.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Percorso",
            "valore": "candidato invariato"
          },
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "15"
          }
        ]
      },
      {
        "titolo": "Uguaglianza con la soglia",
        "parametri": {
          "a": 2,
          "b": 10,
          "c": 1
        },
        "passi": [
          "Premi «Carica questo caso»: a = 2; b senza segno = 10; c = 1. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Forma il candidato» calcola 7a + c prima di esaminare b.",
          "In «CMP b, 10» leggi CF e segui il ramo corrispondente fino a «Seleziona il ritorno»."
        ],
        "risultato": "Percorso = opposto del candidato; Risultato = -15.",
        "ragionamento": "Il candidato resta 15, mentre b = 10 produce uguaglianza con la soglia e CF = 0. Il percorso raggiunge la negazione e restituisce −15; l’uguaglianza appartiene a questo secondo ramo.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Percorso",
            "valore": "opposto del candidato"
          },
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "-15"
          }
        ]
      }
    ]
  },
  "2.2.8": {
    "scopo": "Due LEA possono comporre un coefficiente usando risultati intermedi. Ricostruisci 7a mantenendo disponibile a mentre il primo risultato diventa l’indice della seconda operazione.",
    "teoria": [
      "La sigla LEA indica il comando che calcola una combinazione base + indice × scala e ne scrive il valore in un registro. I registri sono piccole memorie interne. L’operazione mantiene separate la produzione di un numero e una lettura di dati in memoria: nel frammento proposto si svolge soltanto il primo compito.",
      "Base e indice indicano i numeri letti da due registri, che possono anche coincidere. Le scale ammesse sono 1, 2, 4 e 8. Usando lo stesso valore a come base e indice, per esempio, la scala 2 produce a + 2a = 3a; mantenendo disponibile a si possono poi comporre altri prodotti con una seconda istruzione.",
      "Con a = 5, una prima LEA che combini il valore con il suo doppio produce 5 + 10, cioè 15. Il registro originario conserva ancora 5, mentre un altro contiene 15. Una seconda LEA può così usare 5 come base e 15 come indice con scala 2, ottenendo 5 + 30.",
      "Il risultato 35 corrisponde a 7a perché a + 2(3a) = a + 6a. Per leggere il frammento occorre distinguere la copia iniziale di a dall’intermedio 3a e applicare la scala soltanto all’operando che occupa il ruolo di indice."
    ],
    "introduzione": [
      "La ricostruzione insegna a riconoscere una moltiplicazione composta da due calcoli con LEA. Questa istruzione somma una base a un indice moltiplicato per una scala e deposita il numero ottenuto in un registro. La figura separa i contributi, così da seguire il passaggio da a + 2a a a + 2(3a), mantenendo disponibile il valore originario di a.",
      "Con a = 5, inserisci la previsione per il secondo risultato e avanza mediante «Passo successivo». Nella «Prima LEA» confronta base 5, contributo scalato 10 e intermedio 15. Nella «Seconda LEA» osserva che la base resta 5 mentre l’indice diventa 15: il nuovo contributo 30 spiega perché il risultato raggiunga 35."
    ],
    "lettura": "Le celle separano base, indice scalato e risultato. Alla seconda LEA la base rimane a, mentre il valore 3a prodotto prima viene moltiplicato per due.",
    "conclusione": "L’origine di ciascun operando rende leggibile il calcolo: a + 2a produce 3a e a + 2(3a) produce 7a.",
    "procedura": [
      "Con a = 5, prevedi prima il valore di a + 2a e poi quello di a + 2(3a). Inserisci la previsione per il secondo risultato.",
      "Avanza fino a «Prima LEA» e verifica i contributi 5 e 10. Conserva separatamente il 5 originario e l’intermedio 15.",
      "In «Seconda LEA» osserva quale valore viene raddoppiato e confronta 5 + 30 con la previsione."
    ],
    "risultato": "Con a = 5, quanto vale il secondo risultato? 35.",
    "ragionamento": "Il registro della base contiene a = 5. LEA forma combinazioni di registri senza leggere la memoria. La base più due volte la base dà 3a = 5 + 10. Si usa a come base e 3a come indice con scala due. Il risultato è 5 + 30."
  },
  "2.2.9": {
    "scopo": "Una funzione può richiedere insieme un risultato e la conservazione di un argomento. Nel caso iniziale segui il prodotto in EAX per verificare entrambi i requisiti.",
    "teoria": [
      "Nel linguaggio del processore ogni nome di registro, per esempio EAX, designa un piccolo spazio che conserva un numero. Quando un’operazione scrive in quello stesso spazio, per poter recuperare il valore iniziale occorre averne fatto una copia. IMUL calcola un prodotto e ADD una somma.",
      "Nel caso proposto a, b e c sono i tre ingressi della funzione, conservati rispettivamente in EDI, ESI ed EDX. EAX è la sede scelta per il risultato. Il contratto citato nella consegna raccoglie due requisiti: ottenere a × b + c e lasciare disponibile il valore originale di a. Una trasformazione è detta distruttiva quando sovrascrive il dato presente nella propria destinazione.",
      "Nella sintassi Intel il primo operando è la destinazione delle operazioni qui mostrate. Se il contratto di una funzione richiede di preservare il primo argomento, anche il suo registro fa parte del risultato da verificare. Una copia eseguita dopo la moltiplicazione salverebbe il prodotto quando il valore originale è già stato sostituito.",
      "Con EDI = 4, ESI = 7 ed EDX = 3, la copia iniziale porta 4 in EAX. IMUL aggiorna soltanto EAX con 28 e ADD lo porta a 31. EDI continua a contenere 4, quindi la sequenza soddisfa insieme la formula richiesta e il vincolo di conservazione."
    ],
    "introduzione": [
      "L’esercizio permette di verificare un calcolo insieme ai dati che deve preservare. Una trasformazione distruttiva sovrascrive la propria destinazione: IMUL a due operandi sostituisce quindi un valore con il prodotto. La ricostruzione mostra come una copia preliminare in EAX offra uno spazio di lavoro, lasciando a in EDI mentre vengono calcolati prodotto e somma.",
      "Premi «Carica l’esempio guidato», prevedi «EAX dopo IMUL» e registra la previsione per sbloccare i passaggi. Confronta EDI ed EAX dopo la copia e dopo il prodotto, poi raggiungi la somma finale. I valori 28 e 31 in EAX vanno controllati insieme al 4 conservato in EDI, perché il contratto riguarda entrambe le sedi."
    ],
    "lettura": "La ricostruzione tiene separati il registro EDI che conserva a e il registro EAX che riceve gli intermedi. ESI fornisce il secondo fattore ed EDX l’addendo.",
    "conclusione": "Una copia iniziale crea lo spazio di lavoro necessario a un calcolo distruttivo. La verifica deve riguardare il risultato e i registri che il contratto richiede di preservare.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per aprire l’esercizio 1 «Copia prima del prodotto», traccia 1. Leggi la consegna e annota i dati iniziali; i risultati illustrati qui si riferiscono a questa traccia.",
      "Prevedi il campo «EAX dopo IMUL» e premi «Registra la previsione». Avanza poi nella ricostruzione, collegando ogni passaggio ai dati della consegna.",
      "Al termine controlla tutti i campi richiesti: EAX dopo IMUL; EAX finale. Apri «Apri la prova completa» per inserire anche le risposte successive e verificarne lo svolgimento integrale."
    ],
    "risultato": "Per l’esercizio 1, traccia 1: EAX dopo IMUL = 28; EAX finale = 31.",
    "ragionamento": "MOV copia 4 in EAX e conserva EDI. IMUL usa 4 × 7 = 28 come nuovo EAX. ADD somma 3 e porta EAX a 31. EDI contiene ancora 4."
  },
  "2.2.10": {
    "scopo": "La scelta del minimo deve rispettare l’interpretazione senza segno richiesta. Individua la copia condizionale corretta e applicala a una coppia che distingue chiaramente gli ordinamenti.",
    "teoria": [
      "Per scegliere il minore tra due quantità, un programma può conservare provvisoriamente la prima in un registro. Il comando CMP valuta una sottrazione per stabilire l’ordine e ne conserva gli indizi in piccoli indicatori binari, i flag. La copia condizionale consulta quegli indicatori.",
      "CMOV è una copia condizionale: legge i flag e, quando la condizione del suffisso è soddisfatta, copia il secondo operando nel primo. Il suffisso A significa above, cioè maggiore nel confronto senza segno. In CMOVA EAX, ESI la destinazione è EAX e il valore alternativo si trova in ESI. EDI ed ESI sono registri che conservano i due argomenti; la copia iniziale pone il primo anche in EAX.",
      "Il flag CF registra il prestito che occorrerebbe per sottrarre il secondo intero senza segno dal primo. ZF vale uno quando la differenza è zero. Perché il primo intero sia strettamente maggiore del secondo devono dunque valere zero entrambi i flag.",
      "Nel caso proposto 0xFFFFFFFF vale 4294967295 senza segno e il secondo operando vale 2. Il confronto produce CF = 0 e ZF = 0, perciò CMOVA sostituisce il primo candidato con 2. La condizione «sopra» conserva così l’ordinamento richiesto per interi senza segno."
    ],
    "introduzione": [
      "Lo svolgimento aiuta a scegliere una copia condizionale coerente con l’ordine richiesto dai dati. CMP confronta due valori aggiornando i flag; CMOVA copia il secondo candidato quando il primo è maggiore senza segno, cioè con CF e ZF entrambi a zero. La ricostruzione mostra come questi indicatori determinino la sostituzione del candidato provvisorio conservato in EAX.",
      "Apri il caso con «Carica l’esempio guidato» e segui mediante «Passo successivo» il confronto fra 0xFFFFFFFF e 2. Interpreta il primo valore senza segno come 4294967295, poi confronta i flag prodotti con la condizione di CMOVA. Osserva EAX prima e dopo la copia: il passaggio al valore 2 conferma la selezione del minimo richiesto."
    ],
    "lettura": "EAX contiene il candidato provvisorio. La ricostruzione mostra i flag di CMP e la condizione che permette a ESI di sostituire quel candidato.",
    "conclusione": "Il suffisso della copia condizionale esprime il tipo di confronto. Per il minimo senza segno la sostituzione avviene quando il primo candidato è sopra il secondo, cioè con CF = 0 e ZF = 0.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per aprire l’esercizio 5 «Selezionare il minimo senza segno», traccia 1. Leggi la consegna e annota i dati iniziali; i risultati illustrati qui si riferiscono a questa traccia.",
      "Avanza nella ricostruzione con «Passo successivo», fermandoti dopo ogni scrittura o trasformazione. Confronta il dato ottenuto con il passaggio dello svolgimento.",
      "Al termine controlla tutti i campi richiesti: Istruzione dopo CMP EDI, ESI; EAX finale. Apri «Apri la prova completa» per inserire anche le risposte successive e verificarne lo svolgimento integrale."
    ],
    "risultato": "Per l’esercizio 5, traccia 1: Istruzione dopo CMP EDI, ESI = CMOVA EAX, ESI; EAX finale = 2.",
    "ragionamento": "MOV prepara 4294967295 come candidato in EAX. CMP calcola i flag di EDI−ESI: CF=0, ZF=0. CMOVA copia ESI se CF e ZF sono entrambi zero. Il minimo vale 2."
  },
  "2.3.1": {
    "scopo": "Un indirizzo individua il primo byte di un accesso, mentre l’ampiezza stabilisce quanti byte partecipano al valore. Leggi dalla stessa posizione prima quattro byte e poi due, ricostruendo il numero secondo l’ordine little-endian.",
    "teoria": [
      "La memoria conserva i dati in celle numerate. Ogni cella contiene un byte, cioè otto cifre binarie, e il suo numero è l’indirizzo. Per leggere un intero servono dunque due indicazioni, l’indirizzo del primo byte e il numero di byte che appartengono al dato. La stessa cella può essere il punto di partenza di letture di ampiezza diversa.",
      "Offset significa distanza dalla base, misurata qui in byte: offset 4 da 0x1000 conduce a 0x1004. Nei numeri esadecimali le cifre A–F valgono da 10 a 15. Il byte 0x78 vale dunque 7 × 16 + 8 = 120 e il byte 0x56 vale 86. In una parola little-endian i byte successivi pesano 1, 256, 256² e 256³, perché ogni byte aggiunge otto posizioni binarie.",
      "Il prefisso 0x introduce la scrittura esadecimale, nella quale una coppia di cifre rappresenta un byte. All’offset 4 dalla base 0x1000 il modello conserva 78 e, nelle tre celle successive, 56, 34 e 12. Nell’ordine detto little-endian il byte trovato per primo ha il peso minore. I quattro byte insieme formano quindi 0x12345678.",
      "Limitando l’accesso a due byte, vengono letti soltanto 78 e 56. Il numero vale 120 + 86 × 256 = 22136, ossia 0x5678. L’istruzione MOVZX completa con zeri le posizioni rimaste libere di EAX, il registro a 32 bit, e produce 0x00005678. Perciò la stessa posizione iniziale può fornire numeri diversi secondo la larghezza della lettura."
    ],
    "introduzione": [
      "La simulazione serve a distinguere la posizione di un dato dalla quantità di memoria letta per ricostruirlo. Ogni indirizzo identifica un byte, mentre l’ampiezza dell’accesso stabilisce quanti byte consecutivi partecipano al valore. Nell’ordine little-endian il primo byte ha il peso minore: la striscia di memoria e il registro EAX rendono visibile questa corrispondenza.",
      "Carica il caso con offset 4 e ampiezza di quattro byte. Avanza fino a «Ricostruzione» e collega le celle 78, 56, 34 e 12 alle coppie del valore 0x12345678. Confronta poi la lettura di due byte dallo stesso offset: il punto iniziale resta 0x1004, mentre EAX contiene 0x00005678 perché vengono letti soltanto 78 e 56."
    ],
    "lettura": "La striscia superiore segue gli indirizzi crescenti della memoria; sotto ogni byte compare il suo indirizzo. Le celle evidenziate formano l’accesso e la freccia porta al registro EAX, nel quale il byte letto per primo occupa le posizioni di peso minore.",
    "conclusione": "Indirizzo, ampiezza e ordine dei byte concorrono alla ricostruzione di un valore. Cambiare l’ampiezza conserva il punto di partenza e modifica il segmento letto.",
    "controlli": {
      "i": "Distanza in byte dalla base 0x1000 al primo byte richiesto. L’offset 4 seleziona la cella 0x1004.",
      "w": "Numero di byte consecutivi da leggere. Per uno e due byte il modello completa con zeri il resto di EAX; per quattro byte riempie l’intero registro."
    },
    "esperienze": [
      {
        "titolo": "Quattro byte dalla stessa base",
        "parametri": {
          "i": 4,
          "w": "4"
        },
        "passi": [
          "Premi «Carica questo caso»: Offset dalla base = 4; Ampiezza = 4 byte. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Accesso» individua il primo indirizzo e conta le celle incluse.",
          "In «Ricostruzione» lega ogni coppia esadecimale di EAX al byte che occupava quell’indirizzo."
        ],
        "risultato": "EAX = 0x12345678; Decimale = 305419896.",
        "ragionamento": "Dall’offset 4 si leggono 78, 56, 34 e 12 in esadecimale. I pesi little-endian danno 120 + 86 × 256 + 52 × 65536 + 18 × 16777216 = 305419896, ossia EAX = 0x12345678.",
        "attesi": [
          {
            "passo": 2,
            "campo": "EAX",
            "valore": "0x12345678"
          },
          {
            "passo": 2,
            "campo": "Decimale",
            "valore": "305419896"
          }
        ]
      },
      {
        "titolo": "Due byte dalla stessa base",
        "parametri": {
          "i": 4,
          "w": "2"
        },
        "passi": [
          "Premi «Carica questo caso»: Offset dalla base = 4; Ampiezza = 2 byte. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Accesso» individua il primo indirizzo e conta le celle incluse.",
          "In «Ricostruzione» lega ogni coppia esadecimale di EAX al byte che occupava quell’indirizzo."
        ],
        "risultato": "EAX = 0x00005678; Decimale = 22136.",
        "ragionamento": "La lettura di due byte allo stesso offset comprende soltanto 78 e 56. Il numero vale 120 + 86 × 256 = 22136 e l’estensione con zeri produce EAX = 0x00005678.",
        "attesi": [
          {
            "passo": 2,
            "campo": "EAX",
            "valore": "0x00005678"
          },
          {
            "passo": 2,
            "campo": "Decimale",
            "valore": "22136"
          }
        ]
      }
    ]
  },
  "2.3.2": {
    "scopo": "Un indice conta elementi, mentre la memoria è numerata in byte. Costruisci un indirizzo efficace da base, indice, scala e spiazzamento, isolando l’effetto della scala sullo stesso indice.",
    "teoria": [
      "Gli indirizzi di memoria contano byte, mentre la posizione in una raccolta conta elementi. Se ogni elemento è un intero di quattro byte, dalla posizione zero alla posizione tre ci sono dodici byte. La distanza fra l’inizio di due elementi consecutivi prende il nome di passo. Moltiplicare l’indice per il passo traduce il conteggio degli elementi nell’unità usata dalla memoria.",
      "Un registro è una piccola memoria interna al processore. La base è l’indirizzo di partenza e lo spiazzamento è una correzione già espressa in byte; offset netto indica la distanza totale dalla base dopo aver sommato indice scalato e correzione. La sigla LEA significa «carica l’indirizzo efficace»: scrive il numero ottenuto dal calcolo. La scala graduata della figura usa tacche da otto byte, indipendenti dal fattore di scala scelto per l’indice.",
      "L’istruzione LEA costruisce un indirizzo efficace, cioè il numero che individua la cella desiderata. Nel modello RDI è il registro che conserva la base, RSI quello che conserva l’indice. Con la base a 4096, l’indice a 3, la scala a 4 e uno spiazzamento supplementare di 8 byte, il calcolo è 4096 + 12 + 8 = 4116.",
      "La scrittura 0x1014 è la forma esadecimale di 4116. L’ultimo termine si aggiunge una sola volta, perché esprime già una distanza in byte. Per vedere il contenuto della cella indicata servirebbe un successivo caricamento dalla memoria."
    ],
    "introduzione": [
      "Costruire un indirizzo efficace permette di comprendere il passaggio dagli elementi ai byte. L’indice conta posizioni, la scala indica quanti byte separano due posizioni e lo spiazzamento aggiunge una distanza già espressa in byte. La linea graduata mostra questi contributi separati, mentre LEA raccoglie nel registro il numero ottenuto sommando anche la base.",
      "Con «Carica questo caso» imposta base 4096, indice 3, scala 4 e spiazzamento 8. Avanza fino all’indirizzo finale e confronta il contributo dell’indice, 12 byte, con l’offset netto di 20. Ripeti con scala 8: la nuova distanza complessiva è 32 byte e l’indirizzo diventa 0x1020, mentre lo spiazzamento resta uguale."
    ],
    "lettura": "Sulla linea degli indirizzi la prima freccia misura indice × scala a partire dalla base. La seconda aggiunge lo spiazzamento; il punto finale indica il risultato di LEA, cioè l’indirizzo calcolato.",
    "conclusione": "La formula base + indice × scala + spiazzamento mantiene distinti i contributi. Lo spiazzamento è già in byte e si aggiunge una sola volta; una lettura del contenuto richiederebbe un’ulteriore istruzione.",
    "controlli": {
      "base": "Indirizzo di partenza conservato in RDI, espresso in decimale nel controllo e in esadecimale nella traccia.",
      "i": "Indice intero in RSI. Conta quanti passi della dimensione indicata dalla scala occorre percorrere.",
      "s": "Fattore che trasforma l’indice in byte: x86 ammette 1, 2, 4 e 8 in questo campo di indirizzamento.",
      "d": "Correzione finale in byte. Un valore negativo riporta il punto di arrivo verso indirizzi inferiori."
    },
    "esperienze": [
      {
        "titolo": "Indice con scala quattro",
        "parametri": {
          "base": 4096,
          "i": 3,
          "s": "4",
          "d": 8
        },
        "passi": [
          "Premi «Carica questo caso»: Base = 4096; Indice = 3; Scala = 4; Spiazzamento in byte = 8. Parti dal primo passo e avanza con «Passo successivo».",
          "Nel passo «Offset in byte» confronta l’indice scalato con lo spiazzamento.",
          "In «Indirizzo efficace» somma i due contributi e poi aggiungili alla base."
        ],
        "risultato": "Offset netto = 20; Indirizzo = 0x1014.",
        "ragionamento": "Con base 4096, indice 3 e scala 4 il contributo dell’indice è 12 byte. Lo spiazzamento 8 porta l’offset netto a 20; 4096 + 20 = 4116, scritto 0x1014.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Offset netto",
            "valore": "20"
          },
          {
            "passo": 2,
            "campo": "Indirizzo",
            "valore": "0x1014"
          }
        ]
      },
      {
        "titolo": "Indice con scala otto",
        "parametri": {
          "base": 4096,
          "i": 3,
          "s": "8",
          "d": 8
        },
        "passi": [
          "Premi «Carica questo caso»: Base = 4096; Indice = 3; Scala = 8; Spiazzamento in byte = 8. Parti dal primo passo e avanza con «Passo successivo».",
          "Nel passo «Offset in byte» confronta l’indice scalato con lo spiazzamento.",
          "In «Indirizzo efficace» somma i due contributi e poi aggiungili alla base."
        ],
        "risultato": "Offset netto = 32; Indirizzo = 0x1020.",
        "ragionamento": "La scala 8 porta il contributo dell’indice a 3 × 8 = 24 byte. Aggiungendo lo stesso spiazzamento 8 si ottiene offset 32 e indirizzo 4128 = 0x1020.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Offset netto",
            "valore": "32"
          },
          {
            "passo": 2,
            "campo": "Indirizzo",
            "valore": "0x1020"
          }
        ]
      }
    ]
  },
  "2.3.3": {
    "scopo": "Una matrice bidimensionale deve essere collocata nella memoria lineare. Individua la cella richiesta contando le righe complete e gli elementi della riga corrente, poi osserva quanto dista la stessa colonna nella riga successiva.",
    "teoria": [
      "Una matrice si disegna su un foglio come una tabella di righe e colonne. In memoria, dove ogni byte segue il precedente, occorre scegliere un ordine per disporre gli elementi. Il linguaggio C colloca in sequenza tutti gli elementi della prima riga, poi quelli della seconda e così via. Gli indici di riga e colonna partono da zero.",
      "Un array è una sequenza di elementi dello stesso tipo; la matrice del modello è un array di quattro righe, ciascuna formata da cinque elementi. L’etichetta int32 indica un intero memorizzato in 32 bit, equivalenti a quattro byte. Offset indica la distanza in byte dalla base; r e c sono rispettivamente l’indice di riga e quello di colonna.",
      "Qui ogni riga ospita cinque numeri interi da quattro byte. Per raggiungere la riga di indice 2 occorre oltrepassare dieci elementi, cioè quaranta byte. La colonna di indice 3 richiede altri tre elementi, pari a dodici byte. La posizione [2][3] comincia così cinquantadue byte dopo l’inizio della matrice.",
      "La base è 0x3000, dove il prefisso 0x indica la scrittura in base sedici. Cinquantadue si scrive 34 in quella base, per cui il primo byte cercato si trova a 0x3034. Nella figura il passaggio alla riga successiva vale sempre venti byte, mentre lo spostamento di una colonna ne vale quattro."
    ],
    "introduzione": [
      "L’attività rende visibile la corrispondenza fra coordinate di una matrice e posizione nella memoria lineare. Nel modello ogni riga contiene cinque interi di quattro byte e gli indici iniziano da zero. Per raggiungere una cella si oltrepassano prima le righe complete e poi gli elementi della riga scelta: i collegamenti mostrano come queste due distanze si sommino.",
      "Carica riga 2 e colonna 3 e usa «Passo successivo» per leggere separatamente offset di riga e di colonna. Confronta i contributi 40 e 12 con l’offset totale 52. Passa poi alla riga 3 mantenendo la colonna: l’indirizzo passa da 0x3034 a 0x3048, e la distanza di 20 byte corrisponde esattamente a una riga."
    ],
    "lettura": "A sinistra compare la matrice di quattro righe e cinque colonne, con coordinate numerate da zero. A destra ogni posizione mostra l’offset in byte da 0x3000; il collegamento evidenziato associa la cella scelta alla sua posizione in memoria.",
    "conclusione": "Con cinque interi da quattro byte per riga, spostarsi di una riga aggiunge 20 byte e spostarsi di una colonna ne aggiunge 4. Il primo indirizzo della cella è base + 4(5r + c).",
    "controlli": {
      "r": "Indice della riga, da 0 a 3. Ogni riga precedente aggiunge cinque interi, quindi venti byte.",
      "c": "Indice della colonna, da 0 a 4. Ogni elemento precedente nella stessa riga aggiunge quattro byte."
    },
    "esperienze": [
      {
        "titolo": "La cella della terza riga",
        "parametri": {
          "r": 2,
          "c": 3
        },
        "passi": [
          "Premi «Carica questo caso»: Riga da zero = 2; Colonna da zero = 3. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Salto di riga» annota la dimensione della riga e il suo offset.",
          "Aggiungi «Offset colonna» e verifica in «Posizione della cella» l’offset totale prima dell’indirizzo."
        ],
        "risultato": "Offset totale = 52; Indirizzo = 0x3034.",
        "ragionamento": "La riga 2 richiede 2 × 20 = 40 byte; la colonna 3 aggiunge 3 × 4 = 12 byte. L’offset totale è 52 = 0x34 e la cella [2][3] comincia a 0x3034.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Offset totale",
            "valore": "52"
          },
          {
            "passo": 2,
            "campo": "Indirizzo",
            "valore": "0x3034"
          }
        ]
      },
      {
        "titolo": "La stessa colonna nella riga successiva",
        "parametri": {
          "r": 3,
          "c": 3
        },
        "passi": [
          "Premi «Carica questo caso»: Riga da zero = 3; Colonna da zero = 3. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Salto di riga» annota la dimensione della riga e il suo offset.",
          "Aggiungi «Offset colonna» e verifica in «Posizione della cella» l’offset totale prima dell’indirizzo."
        ],
        "risultato": "Offset totale = 72; Indirizzo = 0x3048.",
        "ragionamento": "Nella cella [3][3] la colonna contribuisce ancora 12 byte, mentre la riga contribuisce 60. L’offset 72 = 0x48 dà indirizzo 0x3048, distante 20 byte dalla cella precedente.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Offset totale",
            "valore": "72"
          },
          {
            "passo": 2,
            "campo": "Indirizzo",
            "valore": "0x3048"
          }
        ]
      }
    ]
  },
  "2.3.4": {
    "scopo": "I membri di una struttura occupano posizioni stabilite anche dai vincoli di allineamento. Inverti char e int per seguire lo spostamento del riempimento e l’indirizzo del secondo membro in un array di strutture.",
    "teoria": [
      "Una struttura C riunisce in un solo oggetto dati che possono avere dimensioni diverse. Nella disposizione System V AMD64 qui considerata, il tipo char occupa un byte e il tipo int ne occupa quattro. Un int richiede allineamento a quattro, ossia deve cominciare a un indirizzo divisibile per quattro. Il compilatore rispetta questa regola anche quando i dati sono elencati uno dopo l’altro nel programma.",
      "Un membro è uno dei dati nominati all’interno della struttura. Un array di strutture ne conserva più copie consecutive, numerate da zero. System V AMD64 è la convenzione di disposizione adottata in questo esempio: stabilisce anche dimensioni e allineamenti dei tipi. L’operatore C sizeof restituisce la dimensione totale dell’oggetto in byte, comprendendo il riempimento necessario fra copie consecutive.",
      "L’array comincia all’indirizzo 0x4000 e ogni struttura occupa otto byte. La struttura di indice 1 parte quindi a 0x4008. Se contiene prima il char, dopo il suo unico byte il primo indirizzo adatto all’int è 0x400C. Le tre posizioni intermedie sono byte di riempimento, detti padding, che contano nella dimensione senza appartenere ai valori dei due membri.",
      "Se l’int precede il char, il primo membro occupa i byte da 0 a 3 e il secondo il byte 4. Questa volta le tre posizioni di riempimento si trovano in coda, affinché, in una successione di strutture uguali, l’int successivo cominci di nuovo a un indirizzo allineato."
    ],
    "introduzione": [
      "La simulazione spiega perché la dimensione di una struttura possa superare la somma dei suoi dati. L’allineamento richiede che un int inizi a un indirizzo multiplo di quattro; il padding è il riempimento inserito per rispettare tale vincolo. Le caselle distinguono byte dei membri e spazi aggiunti, mostrando anche il passo necessario fra strutture consecutive.",
      "Carica l’ordine «char, int» con indice della struttura 1 e osserva «Allinea il secondo». Confronta poi «int, char», mantenendo l’indice. I tre byte di riempimento passano dall’interno alla coda, mentre la struttura conserva dimensione otto. Leggi insieme indirizzo e tipo del secondo membro: 0x400C identifica un int nel primo caso e un char nel secondo."
    ],
    "lettura": "Ogni casella della striscia rappresenta un byte: C appartiene al char, I all’int e il punto al riempimento. Gli offset sottostanti partono da zero all’inizio della struttura; la nota finale riporta gli indirizzi nell’elemento dell’array selezionato.",
    "conclusione": "L’ordine dei membri modifica gli offset e la posizione del padding. Per entrambe le strutture mostrate sizeof vale otto byte, così che gli elementi consecutivi mantengano l’allineamento richiesto dagli int.",
    "controlli": {
      "ordine": "Ordine di dichiarazione dei due membri. L’int occupa quattro byte con allineamento quattro; il char ne occupa uno.",
      "i": "Indice della struttura nell’array con base 0x4000. Ogni struttura avanza di otto byte, inclusi quelli di riempimento."
    },
    "esperienze": [
      {
        "titolo": "Riempimento fra i membri",
        "parametri": {
          "ordine": "ci",
          "i": 1
        },
        "passi": [
          "Premi «Carica questo caso»: Ordine dei membri = char, int; Indice della struttura = 1. Parti dal primo passo e avanza con «Passo successivo».",
          "Nel passo «Allinea il secondo» distingui padding interno e padding in coda.",
          "In «Indicizza l’array» confronta insieme indirizzo e tipo del secondo membro."
        ],
        "risultato": "Inizio struttura = 0x4008; Secondo membro = 0x400C; Tipo letto = int.",
        "ragionamento": "Con char seguito da int, l’int deve iniziare all’offset 4: i byte 1, 2 e 3 costituiscono padding interno. La struttura di indice 1 inizia a 0x4008 e il suo secondo membro, l’int, a 0x400C.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Inizio struttura",
            "valore": "0x4008"
          },
          {
            "passo": 2,
            "campo": "Secondo membro",
            "valore": "0x400C"
          },
          {
            "passo": 2,
            "campo": "Tipo letto",
            "valore": "int"
          }
        ]
      },
      {
        "titolo": "Riempimento in coda",
        "parametri": {
          "ordine": "ic",
          "i": 1
        },
        "passi": [
          "Premi «Carica questo caso»: Ordine dei membri = int, char; Indice della struttura = 1. Parti dal primo passo e avanza con «Passo successivo».",
          "Nel passo «Allinea il secondo» distingui padding interno e padding in coda.",
          "In «Indicizza l’array» confronta insieme indirizzo e tipo del secondo membro."
        ],
        "risultato": "Inizio struttura = 0x4008; Secondo membro = 0x400C; Tipo letto = char.",
        "ragionamento": "Con int seguito da char, l’int occupa gli offset 0–3 e il char inizia all’offset 4. I tre byte di padding si trovano in coda: nella struttura di indice 1 il secondo membro resta a 0x400C, mentre il suo tipo diventa char.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Inizio struttura",
            "valore": "0x4008"
          },
          {
            "passo": 2,
            "campo": "Secondo membro",
            "valore": "0x400C"
          },
          {
            "passo": 2,
            "campo": "Tipo letto",
            "valore": "char"
          }
        ]
      }
    ]
  },
  "2.3.5": {
    "scopo": "Due puntatori distinti possono designare lo stesso elemento e rendere visibile una scrittura attraverso nomi diversi. Modifica la destinazione di q e confronta il valore letto da p, che rimane fermo.",
    "teoria": [
      "In C un puntatore è un valore che permette di designare un oggetto attraverso il suo indirizzo. Scrivere *p significa accedere all’oggetto indicato da p. Due puntatori possono avere nomi distinti e tuttavia portare allo stesso intero. In quel caso una scrittura eseguita attraverso il primo sarà visibile a chi legga attraverso il secondo. Questa coincidenza prende il nome di aliasing.",
      "L’indice conta gli elementi da zero; ciascun int del modello occupa quattro byte e la base dell’array è 0x5000. Un oggetto è qui la porzione di memoria riservata a uno di questi interi. Il controllo prima della scrittura è un’operazione esplicita del programma simulato. Il linguaggio C richiede al programma di rispettare i limiti: una scrittura attraverso il puntatore di fine avrebbe comportamento indefinito. Tutti gli elementi rappresentati rimangono esistenti per l’intera traccia.",
      "L’array contiene quattro interi, inizialmente pari a 10, 20, 30 e 40. Se p e q indicano entrambi l’elemento di indice 2, la scrittura di 99 attraverso q sostituisce il 30. La successiva lettura attraverso p restituisce quindi 99. Se q indica l’elemento successivo, a cambiare è il 40 e p continua a leggere 30.",
      "Un puntatore può anche indicare il limite immediatamente successivo all’array, che qui corrisponde all’indice 4. Serve a riconoscere la fine di un percorso. Il programma verifica tale limite prima della scrittura, perché a quella posizione l’array ha esaurito i propri elementi."
    ],
    "introduzione": [
      "Questo esperimento permette di comprendere l’aliasing, cioè la possibilità che puntatori diversi indichino lo stesso oggetto. Un puntatore rappresenta un indirizzo e la scrittura *q modifica l’elemento raggiunto da q. Le frecce sullo stesso array mostrano quando tale aggiornamento diventi visibile alla lettura *p, collegando l’effetto ai luoghi effettivamente raggiunti dai due nomi.",
      "Carica p = 2 e q = 2, confronta gli indirizzi iniziali e avanza fino a «Leggi *p». Ripeti con q = 3 lasciando p fermo: osserva quale cella riceve 99 e perché la lettura finale passi da 99 a 30. Puoi poi impostare q = 4 e premere «Applica i parametri» per seguire il controllo del limite."
    ],
    "lettura": "Le quattro celle dell’array sono seguite dalla casella «limite», che indica il puntatore immediatamente successivo all’ultimo elemento. La freccia q individua la scrittura di 99; la freccia p individua la lettura finale.",
    "conclusione": "L’aliasing dipende dall’oggetto effettivamente designato. Quando p e q coincidono, la lettura osserva la scrittura; se designano elementi diversi, ciascuna cella conserva la propria storia.",
    "controlli": {
      "p": "Indice dell’elemento letto alla fine. Il campo ammette solo gli elementi esistenti, da 0 a 3.",
      "q": "Indice della destinazione della scrittura di 99. Il valore 4 rappresenta il puntatore di fine: il controllo del modello arresta la scrittura a quel limite."
    },
    "esperienze": [
      {
        "titolo": "Due nomi della stessa cella",
        "parametri": {
          "p": 2,
          "q": 2
        },
        "passi": [
          "Premi «Carica questo caso»: Indice di p = 2; Indice di q (4 = fine) = 2. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Array di quattro int» confronta gli indirizzi di p e q prima della scrittura.",
          "Avanza fino a «Leggi *p» e collega il risultato alla cella indicata da p."
        ],
        "risultato": "Stessa cella = sì; Valore letto = 99.",
        "ragionamento": "Con p = q = 2, entrambi gli indirizzi valgono 0x5000 + 2 × 4 = 0x5008. La scrittura attraverso q sostituisce 30 con 99 e la successiva lettura di *p restituisce 99.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Stessa cella",
            "valore": "sì"
          },
          {
            "passo": 2,
            "campo": "Valore letto",
            "valore": "99"
          }
        ]
      },
      {
        "titolo": "Scrittura nella cella successiva",
        "parametri": {
          "p": 2,
          "q": 3
        },
        "passi": [
          "Premi «Carica questo caso»: Indice di p = 2; Indice di q (4 = fine) = 3. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Array di quattro int» confronta gli indirizzi di p e q prima della scrittura.",
          "Avanza fino a «Leggi *p» e collega il risultato alla cella indicata da p."
        ],
        "risultato": "Stessa cella = no; Valore letto = 30.",
        "ragionamento": "Con p = 2 e q = 3, la scrittura raggiunge 0x500C e sostituisce 40 con 99. La lettura resta a 0x5008, dove il valore è ancora 30: i puntatori designano elementi distinti.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Stessa cella",
            "valore": "no"
          },
          {
            "passo": 2,
            "campo": "Valore letto",
            "valore": "30"
          }
        ]
      }
    ]
  },
  "2.3.6": {
    "scopo": "La codifica di un’istruzione deve rappresentare anche il modo con cui viene formato l’indirizzo. Cambia la scala del byte SIB e segui il passaggio dai bit del formato all’indirizzo letto.",
    "teoria": [
      "Per essere eseguita, un’istruzione deve diventare una sequenza di byte che il processore sappia interpretare. Alcuni byte identificano l’operazione, altri dicono dove reperire i dati. Per un indirizzo ottenuto da una base e da un indice moltiplicato per una scala, la codifica x86 può includere il byte SIB, il cui nome deriva dai termini inglesi scale, index e base, ossia scala, indice e base.",
      "L’opcode è il byte che identifica l’operazione: 8B sceglie qui MOV dalla memoria verso un registro. Il byte ModR/M precisa destinazione e forma dell’operando; nel caso mostrato 04 seleziona EAX e annuncia il byte SIB successivo. I nomi RBX e RCX indicano i registri che forniscono i numeri per l’indirizzo. Le cifre del codice sono esadecimali, mentre i campi separati del SIB sono mostrati in binario.",
      "Il byte si divide in tre campi, ossia in tre gruppi di cifre binarie. I primi due bit a sinistra contengono l’esponente della scala. Se valgono 10 in binario, l’esponente è 2 e la scala è 2², cioè 4. I tre bit seguenti, 001, scelgono il registro indice RCX. Gli ultimi tre, 011, scelgono il registro base RBX.",
      "Nel codice 8B 04 8B il primo byte identifica un caricamento e il secondo annuncia il SIB. L’ultimo 8B deriva proprio dai campi 10, 001 e 011. Se RBX contiene 0x6000 e RCX contiene 3, l’istruzione leggerà dodici byte oltre la base, cioè all’indirizzo 0x600C."
    ],
    "introduzione": [
      "L’attività collega il formato binario di un’istruzione al calcolo dell’indirizzo usato in memoria. Il byte SIB contiene tre campi: scala, registro indice e registro base. Nei due bit della scala viene scritto il suo esponente, perciò 10 in binario indica il fattore quattro. Le caselle permettono di seguire questa codifica fino all’indirizzo finale.",
      "Carica scala 4 e RCX = 3, poi avanza da «Campi» a «Composizione» e «Decodifica». Confronta il SIB 0x8B con quello ottenuto scegliendo scala 8, 0xCB. Individua il campo di due bit della scala: passando da 10 a 11 cambia un solo bit. Collega la nuova scala all’offset: con base 0x6000 la lettura passa da 0x600C a 0x6018, conservando gli stessi registri."
    ],
    "lettura": "Gli otto bit del SIB sono separati in scala a due bit, indice a tre bit e base a tre bit. I riquadri inferiori mostrano i byte dell’istruzione e l’indirizzo che essa seleziona con RBX e RCX.",
    "conclusione": "Il campo ss memorizza l’esponente della scala: 00, 01, 10 e 11 rappresentano i fattori 1, 2, 4 e 8. I codici dei registri restano costanti quando cambia soltanto la scala.",
    "controlli": {
      "s": "Scala applicata al valore di RCX. Il byte SIB ne registra l’esponente nei due bit più alti.",
      "i": "Valore numerico del registro indice RCX. Il registro base RBX rimane fissato a 0x6000."
    },
    "esperienze": [
      {
        "titolo": "Codificare la scala quattro",
        "parametri": {
          "s": "4",
          "i": 3
        },
        "passi": [
          "Premi «Carica questo caso»: Scala = 4; Valore di RCX = 3. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Campi» leggi ss come esponente e identifica i due codici dei registri.",
          "Confronta il SIB di «Composizione» con l’indirizzo di «Decodifica»."
        ],
        "risultato": "RCX = 3; Indirizzo = 0x600C.",
        "ragionamento": "Per la scala 4, ss vale 10 in binario. Accostando ss = 10, index = 001 e base = 011 si ottiene 10001011 = 0x8B; con RCX = 3 l’indirizzo è 0x6000 + 12 = 0x600C.",
        "attesi": [
          {
            "passo": 2,
            "campo": "RCX",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "Indirizzo",
            "valore": "0x600C"
          }
        ]
      },
      {
        "titolo": "Codificare la scala otto",
        "parametri": {
          "s": "8",
          "i": 3
        },
        "passi": [
          "Premi «Carica questo caso»: Scala = 8; Valore di RCX = 3. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Campi» leggi ss come esponente e identifica i due codici dei registri.",
          "Confronta il SIB di «Composizione» con l’indirizzo di «Decodifica»."
        ],
        "risultato": "RCX = 3; Indirizzo = 0x6018.",
        "ragionamento": "La scala 8 richiede ss = 11 e produce il SIB 11001011 = 0xCB. Con RCX ancora uguale a 3 l’offset diventa 24 e la lettura parte da 0x6018.",
        "attesi": [
          {
            "passo": 2,
            "campo": "RCX",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "Indirizzo",
            "valore": "0x6018"
          }
        ]
      }
    ]
  },
  "2.3.7": {
    "scopo": "La posizione di un elemento va tradotta in una distanza in byte. Calcola dove comincia l’elemento 7 di un array di interi da quattro byte e individua anche il suo ultimo byte.",
    "teoria": [
      "Un array conserva elementi dello stesso tipo in posizioni contigue. La sua base è l’indirizzo del primo byte del primo elemento. Poiché in C l’indice iniziale vale zero, un indice esprime anche il numero di elementi interi che occorre oltrepassare. Agli indirizzi di memoria si aggiunge una distanza in byte, che si ricava moltiplicando quell’indice per la dimensione di ciascun elemento.",
      "Il prefisso 0x indica che il numero è scritto in base sedici, dove C vale dodici e F vale quindici. Per convertire 28 si divide per 16: si ottengono un gruppo di sedici e dodici unità, perciò 28 = 0x1C. La parola offset usata nella traccia indica proprio questa distanza dalla base.",
      "Nell’array proposto la base è 0x2000 e ciascun intero occupa quattro byte. Per raggiungere l’elemento 7 occorre oltrepassare sette interi, dunque 28 byte. Ventotto si scrive 1C in esadecimale: l’elemento comincia a 0x201C e termina a 0x201F.",
      "Nel disegno del problema ogni casella rappresenta un intero completo. Per interpretare la distanza mostrata conviene leggere ogni salto tra caselle come un avanzamento di quattro indirizzi e conservare la base assegnata al caso."
    ],
    "introduzione": [
      "La ricostruzione serve a convertire un indice di array nell’intervallo di byte occupato dall’elemento. Gli indici partono da zero e ogni casella del disegno rappresenta un intero completo di quattro byte. L’offset è la distanza dalla base: contarvi gli elementi oltrepassati e moltiplicare per la loro dimensione permette di individuare il primo indirizzo corretto.",
      "Leggi base 0x2000 e indice 7, quindi inserisci la previsione per il primo indirizzo. Avanza con «Passo successivo» fino a «Offset» e confronta i sette elementi oltrepassati con la distanza di 28 byte. In «Indirizzo» verifica gli estremi 0x201C e 0x201F: contando anche il primo, l’intervallo contiene esattamente i quattro byte dell’elemento."
    ],
    "lettura": "Ogni casella dell’array rappresenta un intero completo. L’offset misura quindi quattro byte per ogni salto fra caselle; gli estremi della casella selezionata sono indirizzi di singoli byte.",
    "conclusione": "L’indirizzo iniziale di un elemento è base + indice × dimensione. Per un oggetto di quattro byte l’ultimo indirizzo è tre unità oltre il primo.",
    "procedura": [
      "Leggi base 0x2000, indice 7 e dimensione 4 byte. Prevedi la distanza dalla base e inserisci l’indirizzo iniziale atteso.",
      "In «Offset» verifica che vengano oltrepassati sette elementi completi, cioè 28 byte.",
      "In «Indirizzo» confronta primo e ultimo byte, controllando che l’intervallo contenga quattro indirizzi."
    ],
    "risultato": "Qual è l’indirizzo del primo byte dell’elemento? 0x201C.",
    "ragionamento": "Gli elementi sono numerati da zero e ciascuno occupa quattro byte. Per raggiungere l’elemento di indice 7 si oltrepassano sette interi. Lo spostamento misura 7 × 4 = 28 byte, cioè 0x1C. Si somma lo spostamento alla base. I quattro byte dell’elemento vanno da 0x201C a 0x201F."
  },
  "2.3.8": {
    "scopo": "Per scrivere un elemento di array occorre calcolarne l’indirizzo e disporre correttamente i byte. Nel caso iniziale segui LEA e MOV per verificare entrambe le operazioni.",
    "teoria": [
      "La memoria può essere immaginata come una fila di celle numerate, ciascuna capace di contenere un byte. L’indirizzo è il numero della cella. Un array è una sequenza di elementi della stessa larghezza che occupano celle consecutive. Numerando gli elementi da zero, la distanza fra la base e un elemento è il prodotto del suo indice per la larghezza in byte.",
      "Una dword x86 è una parola di quattro byte e occupa quindi quattro indirizzi successivi. LEA calcola l’indirizzo della parola e lo deposita in RAX, un registro cioè una piccola memoria interna al processore. Una scrittura MOV a quell’indirizzo dispone i quattro byte in ordine little-endian, con il byte meno significativo nella prima cella.",
      "LEA e MOV svolgono compiti diversi: LEA scrive in RAX il numero della cella da raggiungere, mentre MOV trasferisce il dato alle celle di memoria individuate. Il prefisso 0x introduce la base sedici. La base 0x4000 vale 16384 in decimale; aggiungendo otto byte si ottiene 16392, che si scrive 0x4008. EDX è il registro che fornisce il valore di quattro byte da scrivere.",
      "Con base 0x4000 e indice 2, l’offset è 2 × 4 = 8 byte e LEA ottiene 0x4008. Il valore 0x12345678 contenuto in EDX viene disposto come 78, 56, 34 e 12 in indirizzi crescenti. La prima cella riceve quindi 0x78, ossia 120 in decimale."
    ],
    "introduzione": [
      "L’esercizio iniziale permette di distinguere il calcolo di una destinazione dalla scrittura del dato che deve occuparla. Una dword contiene quattro byte: LEA calcola l’indirizzo dell’elemento e MOV vi trasferisce il valore di EDX. La ricostruzione mostra sia la scala dell’indice sia l’ordine little-endian, nel quale il byte di minor peso occupa l’indirizzo più basso.",
      "Premi «Carica l’esempio guidato», prevedi «Indirizzo dell’elemento» e scegli «Registra la previsione». Avanza confrontando l’indice 2 con l’offset di otto byte e l’indirizzo 0x4008. Segui poi la scrittura di 0x12345678: il primo byte depositato è 0x78, cioè 120. Distingui nella figura il numero conservato in RAX dai byte effettivamente trasferiti in memoria."
    ],
    "lettura": "La ricostruzione mostra prima la scala dell’indice, poi RAX come indirizzo e infine il dato scomposto nei quattro byte della dword. L’indirizzo più basso riceve il byte di minor peso.",
    "conclusione": "Il calcolo dell’indirizzo usa la dimensione dell’elemento; la disposizione little-endian usa il peso dei byte del valore. Sono due passaggi distinti della stessa scrittura.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per aprire l’esercizio 2 «Scrivere usando un indirizzo calcolato», traccia 1. Leggi la consegna e annota i dati iniziali; i risultati illustrati qui si riferiscono a questa traccia.",
      "Prevedi il campo «Indirizzo dell’elemento» e premi «Registra la previsione». Avanza poi nella ricostruzione, collegando ogni passaggio ai dati della consegna.",
      "Al termine controlla tutti i campi richiesti: Indirizzo dell’elemento; Byte al primo indirizzo. Apri «Apri la prova completa» per inserire anche le risposte successive e verificarne lo svolgimento integrale."
    ],
    "risultato": "Per l’esercizio 2, traccia 1: Indirizzo dell’elemento = 16392; Byte al primo indirizzo = 120.",
    "ragionamento": "La scala 4 produce un offset di 8 byte. LEA scrive 0x4008 in RAX. MOV trasferisce quattro byte. Il primo vale 0x78 perché contiene i bit da 0 a 7."
  },
  "2.3.9": {
    "scopo": "Un caricamento in un registro più largo deve stabilire quali bit aggiungere. Confronta MOVZX e MOVSX sullo stesso dato di memoria per riconoscere il valore che ciascuna istruzione conserva.",
    "teoria": [
      "Un byte ammette 256 combinazioni, insufficienti a rappresentare molti valori di uso comune. Il processore può affiancare due byte formando una parola. Quando copia questa parola in un registro più largo, deve stabilire quale configurazione scrivere nei posti aggiuntivi.",
      "In x86 il termine word indica una parola di sedici bit. Gli otto bit di peso minore occupano l’indirizzo minore. Le istruzioni MOVZX e MOVSX possono allargare la parola fino ai trentadue bit del registro EAX. La scelta dell’istruzione determina il contenuto dei sedici bit aggiunti.",
      "Nella rappresentazione in complemento a due, una parola di w bit il cui bit più alto vale uno rappresenta il valore senza segno meno 2ʷ. Perciò 0xFF80, letto su sedici bit, vale 65408 − 65536 = −128. Replicare quel bit nei posti aggiunti conserva questa differenza anche dopo l’allargamento. La sigla ZX indica estensione con zeri, mentre SX indica estensione del segno.",
      "Con i byte 80 e FF in ordine di indirizzo, la parola vale 128 + 255 × 256 = 65408, cioè 0xFF80. MOVZX produce 0x0000FF80, mentre MOVSX replica il bit 15 e produce 0xFFFFFF80. Quest’ultimo valore rappresenta −128 su 32 bit, come la word originale su sedici."
    ],
    "introduzione": [
      "Confrontare questi caricamenti aiuta a capire come allargare un dato preservandone l’interpretazione scelta. Una word x86 contiene sedici bit, mentre EAX ne contiene trentadue. MOVZX riempie le nuove posizioni con zeri; MOVSX replica il bit di segno. La ricostruzione permette di osservare come queste regole producano valori diversi partendo dagli stessi due byte di memoria.",
      "Carica l’esempio guidato e usa «Passo successivo» per ricomporre prima i byte 80 e FF nella word 0xFF80. Confronta poi i bit aggiunti dalle due istruzioni: MOVZX produce 65408 e MOVSX conserva il valore con segno −128. Rileggi i passaggi con «Precedente», distinguendo l’ordine dei byte dalla successiva scelta dell’estensione."
    ],
    "lettura": "I byte sono mostrati in ordine di indirizzo crescente. Ricomponi prima la word a sedici bit, poi osserva i sedici bit aggiunti in EAX dalle due istruzioni.",
    "conclusione": "L’estensione con zeri conserva il valore senza segno e quella con il bit di segno conserva il valore con segno. Prima di estendere occorre ricostruire la parola nell’ordine dei byte previsto.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per aprire l’esercizio 1 «Caricare e interpretare una word», traccia 1. Leggi la consegna e annota i dati iniziali; i risultati illustrati qui si riferiscono a questa traccia.",
      "Avanza nella ricostruzione con «Passo successivo», fermandoti dopo ogni scrittura o trasformazione. Confronta il dato ottenuto con il passaggio dello svolgimento.",
      "Al termine controlla tutti i campi richiesti: Valore esteso con zeri; Valore con segno su 32 bit dopo MOVSX. Apri «Apri la prova completa» per inserire anche le risposte successive e verificarne lo svolgimento integrale."
    ],
    "risultato": "Per l’esercizio 1, traccia 1: Valore esteso con zeri = 65408; Valore con segno su 32 bit dopo MOVSX = -128.",
    "ragionamento": "Little-endian dà 128 + 256 × 255 = 65408. MOVZX scrive 0x0000FF80 in EAX. MOVSX estende il bit 15 e scrive 0xFFFFFF80 in EAX, interpretato come -128 su 32 bit."
  },
  "2.4.1": {
    "scopo": "Uno scorrimento a destra può riempire le posizioni libere con zeri oppure con il bit di segno. Confronta SHR e SAR sullo stesso byte per collegare la trasformazione dei bit alla lettura numerica.",
    "teoria": [
      "Scorrere a destra un byte significa spostare ognuna delle sue otto cifre binarie verso una posizione di peso minore. La cifra all’estrema destra esce dal byte e a sinistra si apre una posizione. La scelta della cifra con cui riempirla dipende dal significato che si dà al dato di partenza.",
      "Nel complemento a due un byte con il bit più alto a uno rappresenta il proprio valore senza segno meno 256; 253 diventa quindi −3. Le posizioni sono numerate da 0 a 7 partendo da destra. Uno scorrimento di k posti ripete lo spostamento k volte: ciascuna posizione perde un fattore due di peso e CF, il flag di riporto, conserva l’ultimo bit uscito.",
      "L’istruzione SHR, scorrimento logico a destra, inserisce uno zero. SAR, scorrimento aritmetico a destra, ricopia invece il bit più a sinistra, che nel complemento a due indica il segno. Per esempio il byte 11111101, che vale 253 senza segno e −3 con segno, diventa 01111110 con SHR di una posizione. Con SAR diventa 11111110, che come intero con segno vale −2.",
      "Il valore −2 si comprende osservando che −3 diviso per due dà −1,5 e che lo scorrimento aritmetico arrotonda verso l’intero inferiore. Nelle due righe il segnale CF registra l’ultimo bit uscito a destra. Per questo byte, con uno spostamento di una posizione, vale uno in entrambi i casi."
    ],
    "introduzione": [
      "La simulazione permette di comprendere come il riempimento delle posizioni libere determini il significato di uno scorrimento a destra. SHR inserisce zeri, mentre SAR replica il bit di segno, il più alto nella rappresentazione in complemento a due. Le tre righe confrontano lo stesso ingresso e rendono distinguibili i bit introdotti dall’ultimo bit espulso, registrato in CF.",
      "Carica il byte 128 con una posizione di scorrimento e confronta le righe SHR e SAR: ottieni rispettivamente 64 e −64 nella lettura pertinente. Ripeti con byte 253, che con segno rappresenta −3. Osserva il risultato −2 di SAR e il flag CF = 1: il caso dispari mostra l’arrotondamento verso l’intero inferiore e il bit uscito."
    ],
    "lettura": "Le tre righe mostrano l’ingresso, il risultato di SHR e quello di SAR. Le celle in ambra segnano i bit introdotti a sinistra; i riquadri CF conservano l’ultimo bit uscito a destra.",
    "conclusione": "SHR segue la lettura senza segno, mentre SAR conserva il segno e realizza un arrotondamento verso l’intero inferiore. Il bit espulso e i bit inseriti descrivono due effetti diversi dello scorrimento.",
    "controlli": {
      "x": "Configurazione del byte, immessa da 0 a 255. Il primo passo mostra anche il valore con segno, ottenuto sottraendo 256 quando il bit 7 è uno.",
      "k": "Numero di posizioni di scorrimento a destra, da 1 a 7. CF riceve l’ultimo bit che supera il margine destro."
    },
    "esperienze": [
      {
        "titolo": "Dimezzare il minimo con segno",
        "parametri": {
          "x": 128,
          "k": 1
        },
        "passi": [
          "Premi «Carica questo caso»: Byte di partenza = 128; Posizioni = 1. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Leggi il byte» riconosci il bit più alto e la lettura con segno.",
          "Avanza da «SHR» a «SAR» confrontando le posizioni riempite e CF, oltre al valore numerico."
        ],
        "risultato": "Byte = 0xC0; Risultato con segno = -64; CF = 0.",
        "ragionamento": "0x80 è 10000000 e rappresenta −128 con segno. Con uno scorrimento SHR inserisce zero e dà 0x40, cioè 64; SAR replica il bit di segno e dà 0xC0, cioè −64. Il bit uscito vale zero, quindi CF = 0.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Byte",
            "valore": "0xC0"
          },
          {
            "passo": 2,
            "campo": "Risultato con segno",
            "valore": "-64"
          },
          {
            "passo": 2,
            "campo": "CF",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Un valore negativo dispari",
        "parametri": {
          "x": 253,
          "k": 1
        },
        "passi": [
          "Premi «Carica questo caso»: Byte di partenza = 253; Posizioni = 1. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Leggi il byte» riconosci il bit più alto e la lettura con segno.",
          "Avanza da «SHR» a «SAR» confrontando le posizioni riempite e CF, oltre al valore numerico."
        ],
        "risultato": "Byte = 0xFE; Risultato con segno = -2; CF = 1.",
        "ragionamento": "0xFD è 11111101 e vale −3 con segno. SHR di uno dà 01111110 = 0x7E; SAR dà 11111110 = 0xFE, cioè −2, l’intero inferiore a −1,5. Il bit espulso è uno e CF = 1.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Byte",
            "valore": "0xFE"
          },
          {
            "passo": 2,
            "campo": "Risultato con segno",
            "valore": "-2"
          },
          {
            "passo": 2,
            "campo": "CF",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "2.4.2": {
    "scopo": "Una maschera con un solo bit acceso permette di selezionare una posizione. Sposta il bit dalla fine di un byte all’inizio del successivo per rendere esplicita la numerazione delle posizioni.",
    "teoria": [
      "Sul foglio si può contrassegnare una posizione tracciando un segno nella casella scelta. In un registro del processore lo stesso compito si svolge con una maschera, ossia con un disegno di bit nel quale una cifra uno identifica la posizione desiderata. Le cifre si numerano da destra a partire da zero, così che la posizione del bit corrisponda all’esponente della potenza di due che esso rappresenta.",
      "Il registro RAX, una piccola memoria interna al processore, ospita sessantaquattro bit. Partendo dal valore uno, l’istruzione SHL RAX, CL sposta la cifra accesa verso sinistra del numero di posti contenuto in CL, la porzione di otto bit inferiori del registro RCX. La sigla SHL indica lo scorrimento a sinistra. Con uno spostamento di otto posti la cifra passa dalla posizione 0 alla posizione 8 e il valore diventa 256, scritto 0x100 in base sedici.",
      "La separazione in gruppi di otto bit rende leggibile il passaggio di confine. La posizione 7 è l’ultima del byte numero zero, la posizione 8 è la prima del byte numero uno. Dividendo la posizione per otto, il quoziente indica il byte e il resto la posizione interna."
    ],
    "introduzione": [
      "Questa attività mostra come costruire una maschera che selezioni una sola posizione di un registro. Una maschera è una configurazione di bit usata per individuare posizioni; partendo da uno, SHL sposta l’unico bit acceso verso sinistra. La suddivisione di RAX in otto byte collega l’indice globale del bit al byte che lo contiene e alla sua posizione interna.",
      "Con «Carica questo caso» scegli k = 7 e avanza dal seme iniziale fino a «Isola il byte». Confronta poi k = 8, seguendo l’unico uno nella striscia. Il valore passa da 0x80 a 0x100: il byte interessato diventa il numero 1 e la posizione interna torna a zero, perché entrambi i conteggi iniziano da zero."
    ],
    "lettura": "La figura segue il singolo bit acceso nella parola a 64 bit. Il quoziente e il resto della divisione per otto identificano rispettivamente il byte contato da destra e la posizione all’interno di quel byte.",
    "conclusione": "La posizione k corrisponde al valore 2ᵏ. Gli indici dei byte e quelli dei bit iniziano entrambi da zero, perciò il passaggio da k = 7 a k = 8 attraversa il confine fra due byte.",
    "controlli": {
      "k": "Posizione da accendere, contando il bit meno significativo come posizione zero. L’intervallo 0–63 mantiene lo spostamento entro la larghezza di RAX."
    },
    "esperienze": [
      {
        "titolo": "Ultimo bit del primo byte",
        "parametri": {
          "k": 7
        },
        "passi": [
          "Premi «Carica questo caso»: Posizione k = 7. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Seme» verifica RAX = 1 e il conteggio in CL.",
          "Dopo «SHL RAX, CL» confronta la parola completa con «Isola il byte», seguendo quoziente e resto."
        ],
        "risultato": "Byte da destra = 0; Bit nel byte = 7; Valore del byte = 0x80.",
        "ragionamento": "Il seme vale uno e SHL di sette posizioni lo trasforma in 2⁷ = 128, cioè 0x80. Poiché 7 = 0 × 8 + 7, il bit resta nel byte numero zero alla posizione interna 7.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Byte da destra",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Bit nel byte",
            "valore": "7"
          },
          {
            "passo": 2,
            "campo": "Valore del byte",
            "valore": "0x80"
          }
        ]
      },
      {
        "titolo": "Primo bit del secondo byte",
        "parametri": {
          "k": 8
        },
        "passi": [
          "Premi «Carica questo caso»: Posizione k = 8. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Seme» verifica RAX = 1 e il conteggio in CL.",
          "Dopo «SHL RAX, CL» confronta la parola completa con «Isola il byte», seguendo quoziente e resto."
        ],
        "risultato": "Byte da destra = 1; Bit nel byte = 0; Valore del byte = 0x01.",
        "ragionamento": "Con k = 8 il valore diventa 2⁸ = 256, cioè 0x100. La divisione 8 = 1 × 8 + 0 colloca il bit nel byte numero uno alla posizione interna zero, dove il byte vale 0x01.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Byte da destra",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Bit nel byte",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Valore del byte",
            "valore": "0x01"
          }
        ]
      }
    ]
  },
  "2.4.3": {
    "scopo": "Due piccoli valori possono condividere un byte se vengono assegnati a campi distinti. Segui selezione, spostamento e unione per riconoscere quali bit delle sorgenti entrano davvero nel risultato.",
    "teoria": [
      "In una sola casella di memoria da un byte si possono conservare due piccoli numeri, purché ciascuno richieda al massimo quattro bit. Quattro bit formano un semibyte e corrispondono a una cifra esadecimale, che può valere da zero a quindici. Nella scrittura 0xBA, per esempio, B è la cifra alta e A quella bassa.",
      "Il programma preleva la cifra bassa da ciascuna delle due sorgenti. Per farlo applica AND con 0x0F, una maschera i cui quattro bit inferiori valgono uno. AND mantiene un bit soltanto dove entrambe le cifre confrontate valgono uno. Applicando la maschera a 0xBA e 0x25 si ottengono quindi 0x0A e 0x05.",
      "Il primo gruppo deve occupare le quattro posizioni superiori del byte finale. Lo scorrimento a sinistra di quattro posti lo porta a 0xA0. OR riunisce le due file, accendendo ciascuna posizione che contenga un uno in almeno una sorgente. Poiché i gruppi occupano spazi disgiunti, il risultato si legge direttamente come 0xA5."
    ],
    "introduzione": [
      "La composizione guidata serve a comprendere come due piccoli valori possano condividere un byte. Un semibyte comprende quattro bit e rappresenta una cifra esadecimale; AND seleziona quelli utili, lo scorrimento assegna loro una posizione e OR riunisce i contributi. La figura permette di seguire l’origine di ciascuna metà del risultato, separando i bit scelti da quelli esclusi.",
      "Carica sorgente alta 186 e sorgente bassa 37 e avanza attraverso «Seleziona», «Posiziona» e «Unisci». Confronta i semibyte A e 5 con i contributi A0 e 05, poi con il byte A5. Ripeti usando 15 come sorgente alta: il risultato F5 mostra che varia soltanto il campo alto, mentre la cifra bassa conserva la propria origine."
    ],
    "lettura": "La figura separa i semibyte selezionati con AND, il contributo spostato nella metà alta e quello mantenuto nella metà bassa. Nel byte finale ogni cifra esadecimale proviene da una delle due sorgenti.",
    "conclusione": "La maschera elimina i bit estranei prima dello spostamento. Quando i campi occupano posizioni disgiunte, OR li unisce conservando il valore di ciascuno.",
    "controlli": {
      "h": "Byte sorgente del campo alto. Il modello ne conserva soltanto i quattro bit bassi e li sposta a sinistra di quattro posizioni.",
      "l": "Byte sorgente del campo basso. I quattro bit bassi vengono conservati nella loro posizione originale."
    },
    "esperienze": [
      {
        "titolo": "Comporre A e 5",
        "parametri": {
          "h": 186,
          "l": 37
        },
        "passi": [
          "Premi «Carica questo caso»: Sorgente alta = 186; Sorgente bassa = 37. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Seleziona» annota soltanto i semibyte che sopravvivono ad AND.",
          "Confronta «Posiziona» con «Unisci» e associa ciascuna cifra del byte finale alla sorgente corretta."
        ],
        "risultato": "Il byte formato dai due semibyte selezionati è 0xA5: la prima cifra esadecimale occupa il campo alto e la seconda quello basso.",
        "ragionamento": "186 si scrive 0xBA e 37 si scrive 0x25. AND 0x0F ricava A e 5; spostando A di quattro bit si ottiene A0 e OR con 05 produce A5, cioè 165.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Byte",
            "valore": "0xA5"
          }
        ]
      },
      {
        "titolo": "Riempire il campo alto con F",
        "parametri": {
          "h": 15,
          "l": 37
        },
        "passi": [
          "Premi «Carica questo caso»: Sorgente alta = 15; Sorgente bassa = 37. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Seleziona» annota soltanto i semibyte che sopravvivono ad AND.",
          "Confronta «Posiziona» con «Unisci» e associa ciascuna cifra del byte finale alla sorgente corretta."
        ],
        "risultato": "Il byte formato dai due semibyte selezionati è 0xF5: la prima cifra esadecimale occupa il campo alto e la seconda quello basso.",
        "ragionamento": "Con la sorgente alta 15 = 0x0F, la maschera conserva F e lo spostamento produce F0. La sorgente bassa conserva 5: F0 OR 05 dà F5, cioè 245.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Byte",
            "valore": "0xF5"
          }
        ]
      }
    ]
  },
  "2.4.4": {
    "scopo": "Estrarre un campo richiede di isolarne le posizioni e riportarlo sulle unità. Costruisci la maschera di tre bit e spostala nella stessa parola per confrontare due campi diversi.",
    "teoria": [
      "Un formato può assegnare alcune cifre binarie consecutive a una sola informazione, per esempio al numero di un canale. Questo gruppo è un campo. Per leggerlo occorre sia delimitarne i confini nella parola che lo contiene, sia ricondurre la sua prima cifra alla posizione delle unità. Le posizioni si numerano da destra e la prima ha indice zero.",
      "Con un campo di tre bit si parte da 111 in binario, che vale sette e si ottiene con 2³ − 1. Se il campo comincia alla posizione 4, spostare la maschera di quattro posti verso sinistra produce 01110000. L’operazione AND conserva, fra i bit della parola, quelli che cadono sotto gli uno della maschera.",
      "Prendiamo la parola 0x1234, scritta in base sedici. Mascherando con 0x0070 rimane 0x0030. Questo valore conserva la posizione che il campo occupava nella parola. Uno scorrimento di quattro bit a destra lo riporta sulle unità, dove si legge il numero 3."
    ],
    "introduzione": [
      "Estrarre un campo permette di comprendere la differenza fra selezionare bit e leggerne il valore. Un campo è un gruppo di posizioni consecutive della parola; una maschera di pari larghezza lo delimita con cifre uno. La figura mostra prima l’allineamento della maschera, poi l’isolamento con AND e infine lo scorrimento che riporta il campo alla posizione zero.",
      "Carica parola 4660, primo bit 4 e ampiezza 3. Avanza fino a «Normalizzazione» confrontando la maschera 0x0070, il risultato intermedio 0x0030 e il valore estratto 3. Ripeti con primo bit 8: la larghezza resta uguale e il massimo resta 7, mentre il campo letto vale 2. Collega il cambiamento alla posizione selezionata nella stessa parola."
    ],
    "lettura": "La maschera elementare contiene tanti uno quanti sono i bit del campo. La maschera allineata delimita le posizioni nella parola; il risultato di AND conserva ancora quello spostamento, mentre la normalizzazione riporta il campo al bit zero.",
    "conclusione": "Per un campo di larghezza w che inizia al bit k, la maschera è (2ʷ − 1) × 2ᵏ. Il valore estratto si ottiene isolando il campo e scorrendolo a destra di k posizioni.",
    "controlli": {
      "k": "Indice del bit meno significativo del campo. Determina quanto spostare sia la maschera in avanti sia il campo estratto verso destra.",
      "w": "Numero di bit consecutivi del campo, fra 1 e 8. Il valore massimo rappresentabile nel campo è 2ʷ − 1.",
      "v": "Parola a sedici bit da esaminare, immessa come numero da 0 a 65535. Nella traccia viene mostrata in esadecimale."
    },
    "esperienze": [
      {
        "titolo": "Il campo dai bit 4 a 6",
        "parametri": {
          "k": 4,
          "w": 3,
          "v": 4660
        },
        "passi": [
          "Premi «Carica questo caso»: Primo bit = 4; Ampiezza del campo = 3; Parola = 4660. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Maschera elementare» conta gli uno necessari a w bit.",
          "Segui «Selezione nella parola» fino a «Normalizzazione» distinguendo il valore ancora spostato da quello del campo."
        ],
        "risultato": "Valore = 3; Massimo del campo = 7.",
        "ragionamento": "Con w = 3 la maschera elementare vale 2³ − 1 = 7. Al bit k = 4 diventa 0x0070; 0x1234 AND 0x0070 dà 0x0030 e lo scorrimento di quattro bit restituisce 3.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Valore",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "Massimo del campo",
            "valore": "7"
          }
        ]
      },
      {
        "titolo": "Il campo dai bit 8 a 10",
        "parametri": {
          "k": 8,
          "w": 3,
          "v": 4660
        },
        "passi": [
          "Premi «Carica questo caso»: Primo bit = 8; Ampiezza del campo = 3; Parola = 4660. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Maschera elementare» conta gli uno necessari a w bit.",
          "Segui «Selezione nella parola» fino a «Normalizzazione» distinguendo il valore ancora spostato da quello del campo."
        ],
        "risultato": "Valore = 2; Massimo del campo = 7.",
        "ragionamento": "Spostando lo stesso campo al bit 8, la maschera diventa 0x0700. L’AND con 0x1234 produce 0x0200; lo scorrimento di otto bit riporta il valore sulle unità e restituisce 2.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Valore",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "Massimo del campo",
            "valore": "7"
          }
        ]
      }
    ]
  },
  "2.4.5": {
    "scopo": "Un formato binario può riunire operazione, registri e immediato nella stessa parola. Componi i quattro campi del formato didattico e usa la decodifica per controllare che ogni valore sia recuperabile.",
    "teoria": [
      "Per rappresentare un comando mediante un numero si può riservare un gruppo di bit a ogni sua parte. Nel formato didattico di questa figura il comando occupa sempre 32 bit. Sei specificano l’operazione da eseguire, cinque identificano il primo registro, altri cinque il secondo. I sedici bit restanti custodiscono un valore immediato, cioè un numero scritto direttamente nell’istruzione. La macchina x86 usa formati propri di lunghezza variabile.",
      "Un registro è una piccola memoria interna al processore. Nel codice dell’istruzione il numero del registro serve a sceglierlo: A = 3 identifica la sede numero tre, qualunque sia il dato che essa contiene. Opcode è il nome inglese del codice operativo. Il modello usa il valore 35 per illustrare la costruzione dei bit; il diagramma compone e scompone il comando, mentre l’esecuzione della sua operazione resta fuori dalla simulazione.",
      "Ciascun numero entra nel suo spazio spostandosi verso sinistra del numero di posizioni che lo precedono a destra. Il codice operativo 35 viene moltiplicato per 2²⁶ e dà 0x8C000000; il registro A numero 3 viene spostato di 21 posizioni e il registro B numero 5 di 16. L’immediato 0x1234 occupa invece le sedici posizioni inferiori, già allineate alle unità.",
      "I gruppi occupano intervalli distinti. I contributi si possono quindi unire senza che due campi modifichino la stessa cifra. La decodifica compie il percorso inverso, riportando ogni gruppo a destra e tenendo soltanto il numero di bit stabilito dal formato."
    ],
    "introduzione": [
      "Questa simulazione insegna a comporre e controllare un formato binario suddiviso in campi. Nella parola didattica di 32 bit, l’opcode identifica l’operazione, due campi identificano i registri e l’immediato contiene un numero scritto direttamente nel comando. Le regioni separate mostrano come gli spostamenti assegnino a ogni informazione una posizione e come la decodifica recuperi i valori iniziali.",
      "Carica opcode 35, registro A 3, registro B 5 e immediato 4660. Avanza dalla distribuzione alla parola 0x8C651234, poi confronta i quattro valori decodificati con gli ingressi. Carica il caso con immediato 65535: osserva che soltanto le ultime quattro cifre diventano FFFF e verifica che opcode e identificatori dei registri conservino i valori precedenti."
    ],
    "lettura": "Le regioni della parola sono assegnate a opcode, registro A, registro B e immediato. I contributi spostati indicano la posizione occupata da ogni campo; la decodifica finale riporta i quattro valori separati.",
    "conclusione": "Una composizione corretta richiede campi delimitati e valori entro la rispettiva larghezza. Il formato fisso qui studiato serve a comprendere l’impacchettamento; le istruzioni x86 hanno propri formati a lunghezza variabile.",
    "controlli": {
      "op": "Codice operativo di sei bit, quindi da 0 a 63. Occupa i bit dal 31 al 26.",
      "a": "Identificatore di cinque bit del registro A. Occupa i bit dal 25 al 21.",
      "b": "Identificatore di cinque bit del registro B. Occupa i bit dal 20 al 16.",
      "imm": "Valore immediato senza segno di sedici bit, collocato nei bit dal 15 allo 0."
    },
    "esperienze": [
      {
        "titolo": "Immediato 0x1234",
        "parametri": {
          "op": 35,
          "a": 3,
          "b": 5,
          "imm": 4660
        },
        "passi": [
          "Premi «Carica questo caso»: Opcode = 35; Registro A = 3; Registro B = 5; Immediato = 4660. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Distribuzione» individua il primo bit di ciascuno dei campi superiori.",
          "Leggi la parola di «Componi», poi verifica separatamente i quattro valori in «Decodifica di controllo»."
        ],
        "risultato": "Opcode = 35; A = 3; B = 5; Immediato = 4660.",
        "ragionamento": "Opcode 35, A = 3 e B = 5 producono 0x8C000000, 0x00600000 e 0x00050000. Unendo questi contributi con l’immediato 4660 = 0x1234 si ottiene 0x8C651234; i campi disgiunti permettono di recuperare gli stessi quattro ingressi.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Opcode",
            "valore": "35"
          },
          {
            "passo": 2,
            "campo": "A",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "B",
            "valore": "5"
          },
          {
            "passo": 2,
            "campo": "Immediato",
            "valore": "4660"
          }
        ]
      },
      {
        "titolo": "Tutti i bit dell’immediato accesi",
        "parametri": {
          "op": 35,
          "a": 3,
          "b": 5,
          "imm": 65535
        },
        "passi": [
          "Premi «Carica questo caso»: Opcode = 35; Registro A = 3; Registro B = 5; Immediato = 65535. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Distribuzione» individua il primo bit di ciascuno dei campi superiori.",
          "Leggi la parola di «Componi», poi verifica separatamente i quattro valori in «Decodifica di controllo»."
        ],
        "risultato": "Opcode = 35; A = 3; B = 5; Immediato = 65535.",
        "ragionamento": "L’immediato 65535 occupa tutti i sedici bit bassi e si scrive FFFF. I tre campi superiori restano invariati, perciò la parola diventa 0x8C65FFFF; la decodifica restituisce 35, 3, 5 e 65535.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Opcode",
            "valore": "35"
          },
          {
            "passo": 2,
            "campo": "A",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "B",
            "valore": "5"
          },
          {
            "passo": 2,
            "campo": "Immediato",
            "valore": "65535"
          }
        ]
      }
    ]
  },
  "2.4.6": {
    "scopo": "Il semibyte alto occupa una posizione che moltiplica il suo valore per sedici. Isolalo dal byte iniziale e riportalo sulle unità per leggerlo come numero da zero a quindici.",
    "teoria": [
      "Un byte contiene otto cifre binarie e si può rappresentare con due cifre in base sedici. Ciascuna corrisponde a un gruppo di quattro bit, detto semibyte. Il gruppo alto occupa la metà sinistra. Quando si vuole usare il suo contenuto come numero da zero a quindici, occorre prima separarlo dalla metà destra e poi portarlo nella posizione delle unità.",
      "AND confronta le cifre nella stessa posizione e restituisce uno soltanto se entrambe valgono uno. SHR è il comando di scorrimento logico a destra: sposta le cifre verso pesi minori e inserisce zeri da sinistra. Le posizioni del byte sono numerate 0…7 da destra, quindi il campo alto comprende i bit 4, 5, 6 e 7.",
      "Nel byte 0xAB il gruppo da recuperare è 1010 e quello da scartare è 1011. La maschera 11110000 vale 0xF0. Applicando AND rimane 10100000, perché la maschera conserva le cifre di sinistra e azzera quelle di destra. In questa fase il numero nel byte è ancora sedici volte il valore del campo.",
      "Lo scorrimento logico di quattro posizioni verso destra trasforma 10100000 in 00001010, il cui valore è dieci, scritto 0x0A. Le due operazioni svolgono ruoli distinti: AND seleziona i bit del campo e SHR ne ristabilisce il peso a partire dalle unità."
    ],
    "introduzione": [
      "La ricostruzione aiuta a leggere il semibyte alto come numero autonomo. Un semibyte comprende quattro bit e corrisponde a una cifra esadecimale; nella metà alta del byte il suo peso è moltiplicato per sedici. La maschera F0 seleziona quelle posizioni e lo scorrimento SHR le riporta sulle unità, rendendo osservabili i due compiti distinti.",
      "Parti dal byte 0xAB e inserisci una previsione per il risultato dopo lo scorrimento. Avanza con «Passo successivo» fino a «Mascherare», confrontando 10101011 con 10100000. In «Scorrere» segui i quattro bit verso destra: il passaggio da 0xA0 a 0x0A conserva il campo selezionato e gli attribuisce il valore dieci, leggibile nelle posizioni di minor peso."
    ],
    "lettura": "Le righe binarie distinguono il byte, la maschera F0 e il risultato di AND. Lo spostamento finale porta i quattro bit selezionati dalla metà alta a quella bassa.",
    "conclusione": "La maschera delimita il campo, mentre lo scorrimento ne ristabilisce il peso. Il dato dopo AND è ancora allineato alla posizione originaria.",
    "procedura": [
      "Scrivi 0xAB come 10101011 e separa i bit 7–4. Prevedi il valore del campo dopo lo scorrimento.",
      "In «Mascherare» applica 11110000 e controlla che rimanga 10100000.",
      "In «Scorrere» sposta quel risultato di quattro posizioni verso destra e confronta 0x0A con la previsione."
    ],
    "risultato": "Quale valore si ottiene dopo lo scorrimento? 0x0A.",
    "ragionamento": "Nel byte 0xAB, cioè 10101011 in binario, i quattro bit di peso maggiore formano il campo richiesto. La maschera F0 lascia attivi solo i bit del campo. Uno scorrimento logico di quattro posizioni a destra riporta il campo al bit zero."
  },
  "2.4.7": {
    "scopo": "Aggiornare un campo richiede di sostituirne i bit senza alterare quelli esterni. Nel caso iniziale esegui pulizia, inserimento e rilettura del campo per verificare la scrittura.",
    "teoria": [
      "Quando un registro contiene più piccoli valori, ciascuno occupa un gruppo di bit chiamato campo. Una maschera indica con cifre uno le posizioni di interesse. AND conserva una posizione se entrambi gli ingressi valgono uno. OR vi scrive uno se almeno uno dei due lo vale.",
      "La posizione più a destra ha indice zero. Quando un campo comincia più a sinistra, il suo nuovo valore va spostato prima di applicare OR. Per controllare la scrittura si può percorrere la strada inversa, isolando il campo e riportandolo nelle posizioni di peso minore, dove il suo valore è più facile da leggere.",
      "La maschera complementare scambia zero e uno in tutte le otto posizioni del byte. Poiché 0x1C è 00011100, il suo complemento a otto bit è 11100011, cioè 0xE3. AND con questo complemento porta a zero soltanto il campo da sostituire, lasciando il resto disponibile per l’unione. AL e DL sono porzioni di otto bit di due registri del processore: il primo contiene il byte aggiornato e il secondo riceve la rilettura del campo.",
      "Nel byte 0xB6 il campo di tre bit che comincia alla posizione 2 è delimitato dalla maschera 0x1C. La pulizia con la maschera complementare 0xE3 conserva 0xA2. Il nuovo valore 3, spostato di due posizioni, vale 0x0C: OR produce 0xAE e la successiva estrazione restituisce 3."
    ],
    "introduzione": [
      "L’esercizio permette di verificare una sostituzione di campo considerando sia il nuovo dato sia i bit da preservare. La maschera delimita le posizioni interessate; il suo complemento, che scambia zeri e uno, serve a pulirle con AND. La ricostruzione segue poi l’inserimento mediante OR e la rilettura, mostrando come controllare l’aggiornamento all’interno del byte completo.",
      "Con «Carica l’esempio guidato» apri la modifica di 0xB6 e registra la previsione per «Maschera del campo». Avanza confrontando la maschera 0x1C, la parte conservata 0xA2 e il nuovo contributo 0x0C. Il risultato 0xAE deve restituire 3 quando il campo viene riletto in DL; confronta anche i bit esterni con quelli del byte iniziale."
    ],
    "lettura": "La figura distingue i bit del campo dalla parte conservata di AL. Dopo l’OR, la seconda estrazione porta il campo in DL e permette di confrontarlo con il valore da inserire.",
    "conclusione": "La rilettura del campo verifica il dato inserito, mentre il confronto dei bit esterni verifica la conservazione del resto del byte. Entrambi appartengono al contratto della modifica.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per aprire l’esercizio 4 «Sostituire un campo e verificarlo», traccia 1. Leggi la consegna e annota i dati iniziali; i risultati illustrati qui si riferiscono a questa traccia.",
      "Prevedi il campo «Maschera del campo» e premi «Registra la previsione». Avanza poi nella ricostruzione, collegando ogni passaggio ai dati della consegna.",
      "Al termine controlla tutti i campi richiesti: Maschera del campo; Byte modificato; Campo riletto in DL. Apri «Apri la prova completa» per inserire anche le risposte successive e verificarne lo svolgimento integrale."
    ],
    "risultato": "Per l’esercizio 4, traccia 1: Maschera del campo = 28; Byte modificato = 174; Campo riletto in DL = 3.",
    "ragionamento": "La maschera è 0x7 << 2 = 0x1C. La maschera complementare su otto bit lascia 0xA2 nella destinazione. OR con 0x0C produce 0xAE. Estraendo i bit si ritrova 3."
  },
  "2.4.8": {
    "scopo": "Un indirizzo può dover essere arrotondato al successivo multiplo di una potenza di due. Nel caso iniziale ricostruisci perché la somma preliminare permette alla maschera di arrotondare verso l’alto.",
    "teoria": [
      "Un indirizzo è allineato a sedici byte se il suo numero è un multiplo di sedici. Qualora un’area debba iniziare più avanti dell’indirizzo disponibile, si cerca il primo multiplo uguale o superiore. Azzerare direttamente i bit inferiori darebbe il multiplo precedente.",
      "Per un allineamento A che sia una potenza di due, i numeri multipli di A terminano con un numero fisso di zeri binari. Sedici è 2⁴, quindi occorrono quattro zeri. Sommare A − 1 e cancellare gli ultimi bit arrotonda verso l’alto, purché la somma sia rappresentabile nel registro.",
      "AND confronta le cifre binarie di due numeri posizione per posizione e mantiene uno soltanto dove entrambi hanno uno. Su un registro di 64 bit, −16 in complemento a due si scrive con sessanta uno seguiti da quattro zeri: questa configurazione conserva la parte alta e cancella i quattro bit inferiori. TEST applica lo stesso confronto per aggiornare i flag lasciando il dato nel registro; ZF, il flag di zero, vale uno se tutti i bit selezionati risultano zero.",
      "Partendo da 0x1031, l’aggiunta di quindici produce 0x1040. AND con −16 conserva quel valore e azzera i quattro bit bassi, che TEST con 15 trova già nulli. Il risultato 0x1040, cioè 4160, è il primo multiplo di sedici raggiungibile verso l’alto."
    ],
    "introduzione": [
      "Ripercorrere questo calcolo serve a comprendere l’arrotondamento di un indirizzo al multiplo successivo di sedici. Un indirizzo così allineato termina con quattro bit a zero. La ricostruzione distingue l’aggiunta preliminare di quindici dall’azzeramento con AND, mostrando perché la loro successione raggiunga un indirizzo maggiore o uguale all’ingresso, nell’intervallo rappresentabile previsto dal caso.",
      "Premi «Carica l’esempio guidato» e avanza con «Passo successivo» partendo da 0x1031. Confronta l’indirizzo dopo ADD con quello dopo AND: l’aggiunta porta a 0x1040 e la maschera conserva il multiplo raggiunto. Segui infine TEST sui quattro bit bassi; ZF = 1 conferma che sono tutti zero e quindi che il risultato rispetta l’allineamento."
    ],
    "lettura": "Segui separatamente l’indirizzo iniziale, quello dopo ADD e quello dopo AND. Il controllo TEST sui bit bassi riconosce l’allineamento del risultato.",
    "conclusione": "Per allineamento A potenza di due, (indirizzo + A − 1) AND −A arrotonda verso l’alto quando la somma è rappresentabile. I bit bassi azzerati attestano la divisibilità per A.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per aprire l’esercizio 5 «Allineare un puntatore alla potenza di due», traccia 1. Leggi la consegna e annota i dati iniziali; i risultati illustrati qui si riferiscono a questa traccia.",
      "Avanza nella ricostruzione con «Passo successivo», fermandoti dopo ogni scrittura o trasformazione. Confronta il dato ottenuto con il passaggio dello svolgimento.",
      "Al termine controlla tutti i campi richiesti: Termine da aggiungere; Indirizzo allineato. Apri «Apri la prova completa» per inserire anche le risposte successive e verificarne lo svolgimento integrale."
    ],
    "risultato": "Per l’esercizio 5, traccia 1: Termine da aggiungere = 15; Indirizzo allineato = 4160.",
    "ragionamento": "La quantità da aggiungere è 16 − 1 = 15. ADD genera 0x1040. AND con −16 azzera i 4 bit bassi. La destinazione è 0x1040. TEST RAX,15 produce zero e quindi ZF=1, a conferma dell’allineamento."
  },
  "2.5.1": {
    "scopo": "Il registro RAX trasporta prima la richiesta al kernel e poi la risposta. Segui una scrittura e una richiesta dell’identificatore del processo per riconoscere il significato dei registri nelle diverse fasi.",
    "teoria": [
      "Un programma in esecuzione, chiamato processo, lavora entro uno spazio di memoria che il sistema operativo gli assegna. Quando vuole scrivere su un file, deve chiedere al kernel, la parte del sistema che controlla gli accessi alle risorse. Una chiamata di sistema è il passaggio attraverso il quale il programma formula la richiesta e il kernel la prende in carico.",
      "Il descrittore di file, abbreviato fd, è il numero con cui il processo indica al kernel una risorsa aperta: qui fd 1 identifica la destinazione della scrittura. Il buffer è la regione di memoria che contiene il messaggio; RSI ne conserva l’indirizzo iniziale e RDX il numero di byte da trasferire, mentre RDI contiene il descrittore. Le sigle RCX e R11 indicano altri registri. I flag sono bit che descrivono condizioni del processore; il valore 0x202 mostrato in R11 rappresenta il loro stato salvato. Il prefisso 0x segnala una scrittura numerica in base sedici.",
      "In Linux su x86-64 il registro RAX, una piccola memoria interna del processore, ospita il numero del servizio. Per write questo numero è 1. In altri tre registri il programma indica dove scrivere, a quale indirizzo si trovano i byte del messaggio e quanti ne offre. All’esecuzione di SYSCALL, il processore conserva in RCX l’indirizzo a cui riprendere e in R11 i segnali di stato del chiamante.",
      "Dopo una scrittura completa di otto byte, in RAX si legge 8. Per getpid il programma parte invece dal numero di servizio 39 e ritrova in RAX l’identificatore del processo, qui 417. È dunque il momento in cui si osserva il registro a stabilire se quel numero designi una richiesta o una risposta."
    ],
    "introduzione": [
      "La simulazione permette di comprendere il passaggio dalla richiesta di un programma alla risposta del kernel, la parte del sistema operativo che gestisce le risorse. Una chiamata di sistema assegna ai registri ruoli convenuti: RAX identifica inizialmente il servizio e al rientro ne contiene l’esito. I riquadri mostrano come il significato del numero dipenda dal momento osservato.",
      "Carica il caso «Scrivere otto byte» e avanza attraverso richiesta, ingresso con SYSCALL e rientro. Confronta RAX prima e dopo, distinguendo il servizio 1 dal conteggio 8. Carica poi getpid: RAX passa da 39 all’identificatore 417. Segui anche RCX e R11, nei quali SYSCALL conserva rispettivamente l’indirizzo di ripresa e i flag del chiamante."
    ],
    "lettura": "La figura separa preparazione utente, ingresso nel kernel e rientro. RAX cambia ruolo lungo il percorso; RCX conserva l’indirizzo di ripresa e R11 i flag utente salvati da SYSCALL.",
    "conclusione": "Un valore di registro acquista significato dal servizio e dal momento di osservazione. La simulazione assume una write completa e un processo di PID 417, così da isolare il passaggio fra richiesta e risposta.",
    "controlli": {
      "req": "Servizio richiesto: write usa il numero 1 per scrivere sul descrittore 1; getpid usa 39 e restituisce l’identificatore del processo.",
      "n": "Lunghezza del messaggio offerto a write, in byte. Il controllo interviene soltanto quando è selezionato quel servizio."
    },
    "esperienze": [
      {
        "titolo": "Scrivere otto byte",
        "parametri": {
          "req": "write",
          "n": 8
        },
        "passi": [
          "Premi «Carica questo caso»: Servizio = write su fd 1; Byte del messaggio (per write) = 8. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Richiesta» attribuisci un ruolo a ogni registro mostrato.",
          "Dopo «Ingresso con SYSCALL» leggi «Rientro» e interpreta RAX usando il servizio selezionato."
        ],
        "risultato": "RAX = 8; Significato = byte scritti.",
        "ragionamento": "Per write, RAX = 1 seleziona il servizio, RDI = 1 la destinazione, RSI = 0x5000 il buffer e RDX = 8 la lunghezza. SYSCALL salva 0x401002 in RCX; il trasferimento completo restituisce RAX = 8, ora interpretato come numero di byte scritti.",
        "attesi": [
          {
            "passo": 2,
            "campo": "RAX",
            "valore": "8"
          },
          {
            "passo": 2,
            "campo": "Significato",
            "valore": "byte scritti"
          }
        ]
      },
      {
        "titolo": "Leggere l’identità del processo",
        "parametri": {
          "req": "pid",
          "n": 8
        },
        "passi": [
          "Premi «Carica questo caso»: Servizio = getpid; Byte del messaggio (per write) = 8. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Richiesta» attribuisci un ruolo a ogni registro mostrato.",
          "Dopo «Ingresso con SYSCALL» leggi «Rientro» e interpreta RAX usando il servizio selezionato."
        ],
        "risultato": "RAX = 417; Significato = identificatore del processo.",
        "ragionamento": "Per getpid, RAX contiene inizialmente 39. Dopo lo stesso passaggio attraverso SYSCALL il kernel restituisce 417 in RAX; la lunghezza del messaggio resta irrilevante perché questo servizio richiede soltanto l’identità del processo.",
        "attesi": [
          {
            "passo": 2,
            "campo": "RAX",
            "valore": "417"
          },
          {
            "passo": 2,
            "campo": "Significato",
            "valore": "identificatore del processo"
          }
        ]
      }
    ]
  },
  "2.5.2": {
    "scopo": "Una funzione di raccordo deve adattare gli argomenti alla convenzione richiesta dal kernel. Confronta il quarto e il terzo argomento per individuare il registro che richiede una copia.",
    "teoria": [
      "Se due parti di un programma si scambiano sei numeri, un accordo sull’ordine permette al destinatario di identificarli anche quando mancano i nomi delle variabili. Nel codice macchina questo accordo prende il nome di ABI, interfaccia binaria. Stabilisce anche la posizione fisica degli argomenti, per esempio in quali registri, le piccole memorie interne del processore, il chiamante debba depositarli.",
      "Una funzione C che segue la convenzione System V per questi sei interi li riceve, nell’ordine, in RDI, RSI, RDX, RCX, R8 e R9. Per chiedere un servizio al kernel Linux, la parte del sistema operativo che gestisce le risorse, si usa l’istruzione SYSCALL. L’ordine dei numeri rimane quello della richiesta, mentre la quarta sede diventa R10: il processore usa RCX per conservare l’indirizzo al quale riprenderà l’esecuzione.",
      "La breve funzione di raccordo, chiamata wrapper, effettua la copia prima di entrare nel kernel. Se il quarto argomento vale 34, il percorso parte da RCX con 34 e arriva a R10 con 34. Per il terzo argomento la sede RDX è già quella attesa dal kernel."
    ],
    "introduzione": [
      "Questa attività spiega perché una funzione di raccordo debba adattare gli argomenti prima di una chiamata al kernel. L’ABI è l’accordo che stabilisce dove collocare ciascun dato nel codice macchina. La convenzione delle funzioni System V e quella delle syscall Linux differiscono nella quarta posizione: i collegamenti fra registri permettono di osservare lo spostamento conservando valore e ordine dell’argomento.",
      "Carica argomento numero 4 con valore 34 e usa «Passo successivo» per seguire il percorso da RCX a R10. Confronta poi l’argomento numero 3 con lo stesso valore: RDX è già la sede richiesta. Leggi insieme posizione, registro e contenuto all’ingresso nel kernel, così da riconoscere una variazione della sede a fronte del dato conservato."
    ],
    "lettura": "Le sedi della chiamata C sono affiancate a quelle della syscall. Segui la posizione dell’argomento e il suo valore lungo il collegamento fra registri; per la quarta posizione il percorso va da RCX a R10.",
    "conclusione": "L’ABI, cioè l’interfaccia binaria, stabilisce dove il destinatario cerca ciascun argomento. Il wrapper conserva valore e ordine degli argomenti mentre adatta la quarta sede al contratto di SYSCALL.",
    "controlli": {
      "arg": "Posizione dell’argomento intero nell’elenco da uno a sei. La scelta determina i registri d’ingresso e d’uscita del wrapper.",
      "v": "Valore che deve raggiungere il kernel senza cambiamenti. Serve a seguire il dato anche quando cambia il nome del registro."
    },
    "esperienze": [
      {
        "titolo": "Il quarto argomento cambia registro",
        "parametri": {
          "arg": 4,
          "v": 34
        },
        "passi": [
          "Premi «Carica questo caso»: Numero dell’argomento = 4; Valore intero = 34. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Ingresso nel wrapper» annota posizione, registro C e valore.",
          "Confronta «Adatta gli argomenti» con «Ingresso nel kernel», controllando sia la sede sia il contenuto letto."
        ],
        "risultato": "Posizione letta = 4; Registro letto = R10; Contenuto letto = 34.",
        "ragionamento": "Il quarto argomento di valore 34 entra nel wrapper in RCX. La preparazione esegue MOV R10, RCX, perciò il kernel legge 34 da R10; RCX è disponibile per l’indirizzo di ripresa salvato da SYSCALL.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Posizione letta",
            "valore": "4"
          },
          {
            "passo": 2,
            "campo": "Registro letto",
            "valore": "R10"
          },
          {
            "passo": 2,
            "campo": "Contenuto letto",
            "valore": "34"
          }
        ]
      },
      {
        "titolo": "Il terzo conserva la propria sede",
        "parametri": {
          "arg": 3,
          "v": 34
        },
        "passi": [
          "Premi «Carica questo caso»: Numero dell’argomento = 3; Valore intero = 34. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Ingresso nel wrapper» annota posizione, registro C e valore.",
          "Confronta «Adatta gli argomenti» con «Ingresso nel kernel», controllando sia la sede sia il contenuto letto."
        ],
        "risultato": "Posizione letta = 3; Registro letto = RDX; Contenuto letto = 34.",
        "ragionamento": "Il terzo argomento entra in RDX e la convenzione della syscall lo cerca già in RDX. Il valore 34 resta nella stessa sede e il passaggio richiede soltanto di conservarlo fino all’ingresso nel kernel.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Posizione letta",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "Registro letto",
            "valore": "RDX"
          },
          {
            "passo": 2,
            "campo": "Contenuto letto",
            "valore": "34"
          }
        ]
      }
    ]
  },
  "2.5.3": {
    "scopo": "Un programma che copia dati deve usare i byte davvero trasferiti da ogni chiamata. Segui una lettura breve e confronta una scrittura completa con una che lascia ancora un suffisso da inviare.",
    "teoria": [
      "Per copiare un file si può leggere una porzione di dati in un buffer, ossia in un tratto di memoria riservato a quei byte, e poi inviarla alla destinazione. In Linux un piccolo numero intero, detto descrittore, individua il file aperto. La chiamata read indica il descrittore di ingresso, l’indirizzo del buffer e il numero massimo di byte che può ricevere.",
      "read trasferisce dati dal file alla memoria del processo; write compie il trasferimento verso la destinazione. I registri sono piccole memorie del processore: nella convenzione illustrata RAX riceve il conteggio restituito da read, mentre RDX deve contenere il conteggio offerto alla successiva write. Un puntatore è l’indirizzo di una cella di memoria. Aggiungergli due, quando le celle contengono byte, lo sposta al terzo byte: gli indici cominciano da zero. Il prefisso 0x introduce gli indirizzi scritti in base sedici.",
      "Supponiamo che il programma chieda otto byte e che nel file ne restino cinque. La lettura restituisce cinque, quanti sono i byte effettivamente collocati nel buffer. Su un file ordinario, con una richiesta positiva, un ritorno zero indica che si è raggiunta la fine. Per preparare write si usa il conteggio restituito da read, così che la richiesta comprenda soltanto dati appena acquisiti.",
      "Se la prima write accetta due dei cinque byte, ne restano tre da emettere. Con un buffer che inizia a 0x7000, il primo byte pendente si trova a 0x7002. Indirizzo e conteggio descrivono insieme la parte di messaggio che attende ancora la scrittura."
    ],
    "introduzione": [
      "Il percorso aiuta a distinguere byte richiesti, letti e scritti durante una copia. Il buffer è la regione di memoria che riceve i dati da read; il risultato della chiamata indica quanti byte sono validi. La figura segue poi il prefisso accettato da write e il suffisso residuo, mostrando perché puntatore e conteggio debbano essere aggiornati insieme.",
      "Carica il caso «Tre byte letti e tutti scritti» e confronta il ritorno di read con il conteggio preparato per write. Passa poi a «Cinque letti, due scritti» e avanza fino al cursore aggiornato. Verifica che il puntatore raggiunga 0x7002 e restino tre byte: la somma fra byte emessi e residui deve coincidere con i cinque effettivamente letti."
    ],
    "lettura": "La figura distingue il buffer disponibile, il tratto riempito da read e il prefisso accettato da write. Il puntatore aggiornato individua il primo byte residuo; il conteggio indica quanti byte restano da emettere.",
    "conclusione": "La quantità richiesta a read, la quantità letta e la quantità scritta descrivono momenti diversi. Per proseguire una write breve occorre avanzare il puntatore dei byte emessi e ridurre della stessa quantità il conteggio residuo.",
    "controlli": {
      "n": "Numero massimo di byte richiesti a read. Il buffer del modello ha capacità sufficiente per questa richiesta.",
      "cap": "Byte ancora disponibili nel file ordinario di ingresso. Se sono meno della richiesta, read si ferma alla fine del file.",
      "out": "Numero massimo di byte che la prima write può accettare nel caso simulato. Una capacità inferiore ai byte letti lascia un suffisso da scrivere."
    },
    "esperienze": [
      {
        "titolo": "Tre byte letti e tutti scritti",
        "parametri": {
          "n": 8,
          "cap": 3,
          "out": 3
        },
        "passi": [
          "Premi «Carica questo caso»: Byte richiesti a read = 8; Byte disponibili in ingresso = 3; Capacità della prima write = 3. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Prepara write» confronta RAX dopo read con RDX destinato a write.",
          "In «Aggiorna il cursore» verifica che byte emessi e byte residui sommino al conteggio effettivamente letto."
        ],
        "risultato": "Byte emessi = 3; Puntatore successivo = 0x7003; Byte da emettere = 0.",
        "ragionamento": "read richiede 8 byte e ne trova 3, quindi restituisce 3. write riceve quel conteggio e accetta tutti e tre i byte: il puntatore passa da 0x7000 a 0x7003 e il residuo vale zero.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Byte emessi",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "Puntatore successivo",
            "valore": "0x7003"
          },
          {
            "passo": 2,
            "campo": "Byte da emettere",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Cinque letti, due scritti",
        "parametri": {
          "n": 8,
          "cap": 5,
          "out": 2
        },
        "passi": [
          "Premi «Carica questo caso»: Byte richiesti a read = 8; Byte disponibili in ingresso = 5; Capacità della prima write = 2. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Prepara write» confronta RAX dopo read con RDX destinato a write.",
          "In «Aggiorna il cursore» verifica che byte emessi e byte residui sommino al conteggio effettivamente letto."
        ],
        "risultato": "Byte emessi = 2; Puntatore successivo = 0x7002; Byte da emettere = 3.",
        "ragionamento": "Degli 8 byte richiesti da read sono disponibili 5. La prima write ne accetta 2: i byte pendenti sono 5 − 2 = 3 e cominciano a 0x7000 + 2 = 0x7002.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Byte emessi",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "Puntatore successivo",
            "valore": "0x7002"
          },
          {
            "passo": 2,
            "campo": "Byte da emettere",
            "valore": "3"
          }
        ]
      }
    ]
  },
  "2.5.4": {
    "scopo": "Sostituire il programma eseguito da un processo modifica la sua immagine in memoria. Confronta un execve riuscito e un percorso assente per seguire separatamente identità del processo e destinazione del controllo.",
    "teoria": [
      "Un processo è il soggetto al quale il sistema assegna un’identità, indicata dal numero PID. La sua immagine comprende il programma in esecuzione e le regioni di memoria che contengono codice e dati. Una regione resa accessibile a determinati indirizzi del processo si chiama mappatura. La chiamata di sistema execve permette al medesimo processo di proseguire eseguendo un altro programma.",
      "Una pagina è un blocco di memoria gestito come unità dal sistema. La pagina anonima privata del disegno contiene dati del processo A: «anonima» indica che manca un file che le fornisca direttamente il contenuto, mentre «privata» descrive l’isolamento delle sue modifiche. La sostituzione riuscita elimina questa mappatura della vecchia immagine. Per isolare tale effetto, il modello usa un eseguibile statico, il cui avvio può essere rappresentato direttamente con l’ingresso di B.",
      "Supponiamo che il processo numero 417 stia eseguendo A. Se il file richiesto contiene l’eseguibile valido B, il kernel installa la nuova immagine. La pagina privata che apparteneva ad A viene rilasciata. Il registro RIP, che identifica l’indirizzo della prossima istruzione, indica ora l’ingresso di B, posto in questo esempio a 0x501000. Il PID continua a valere 417.",
      "Se manca il file, la ricerca si arresta prima della sostituzione. La vecchia pagina è ancora presente e RIP torna al punto di ripresa di A. Il risultato −2 della chiamata diretta corrisponde a ENOENT, il nome con cui Linux identifica in questo caso l’assenza del file."
    ],
    "introduzione": [
      "Il confronto permette di comprendere come execve sostituisca il programma eseguito mantenendo l’identità del processo. Il PID identifica il processo; la sua immagine comprende codice e dati in memoria, organizzati in regioni dette mappature. I riquadri seguono questi elementi insieme a RIP, il registro che indica la prossima istruzione, separando il successo dall’errore nella ricerca del file.",
      "Carica l’eseguibile valido con PID 417 e avanza fino a «Prossima istruzione utente». Confronta il PID conservato con l’immagine B, la pagina rilasciata e RIP a 0x501000. Ripeti con «File assente»: l’immagine A e la pagina restano disponibili, RIP torna a 0x401082 e il valore −2 comunica l’errore al chiamante."
    ],
    "lettura": "I riquadri mostrano il PID, l’immagine in esecuzione e la pagina privata del programma A. RIP individua la prossima istruzione utente: al successo punta all’ingresso di B, mentre l’errore riporta il controllo al chiamante A.",
    "conclusione": "Un execve riuscito conserva il PID e installa un nuovo programma. Un errore durante la ricerca del file lascia disponibile l’immagine chiamante, che può interpretare il codice restituito.",
    "controlli": {
      "file": "Esito della ricerca del percorso: un eseguibile statico valido porta all’immagine B; un file assente produce l’errore ENOENT.",
      "pid": "Identificatore del processo osservato. Il confronto permette di verificarne la continuità durante la sostituzione dell’immagine."
    },
    "esperienze": [
      {
        "titolo": "Ingresso nel nuovo programma",
        "parametri": {
          "file": "ok",
          "pid": 417
        },
        "passi": [
          "Premi «Carica questo caso»: Percorso richiesto = Eseguibile valido; PID = 417. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Vecchia immagine» annota PID, programma e pagina privata.",
          "Dopo «Ricerca del file» confronta questi tre elementi con «Prossima istruzione utente» e leggi RIP."
        ],
        "risultato": "PID = 417; Immagine = B; Pagina della vecchia immagine = rilasciata; RIP = 0x501000; Ritorno della syscall = nessun ritorno al chiamante.",
        "ragionamento": "Il processo 417 parte nell’immagine A con la pagina privata a 0x700000. Trovato l’eseguibile, il kernel installa B, rilascia quella pagina e riprende a RIP = 0x501000; il PID rimane 417 e il vecchio chiamante viene sostituito.",
        "attesi": [
          {
            "passo": 2,
            "campo": "PID",
            "valore": "417"
          },
          {
            "passo": 2,
            "campo": "Immagine",
            "valore": "B"
          },
          {
            "passo": 2,
            "campo": "Pagina della vecchia immagine",
            "valore": "rilasciata"
          },
          {
            "passo": 2,
            "campo": "RIP",
            "valore": "0x501000"
          },
          {
            "passo": 2,
            "campo": "Ritorno della syscall",
            "valore": "nessun ritorno al chiamante"
          }
        ]
      },
      {
        "titolo": "Ritorno dopo un file assente",
        "parametri": {
          "file": "enoent",
          "pid": 417
        },
        "passi": [
          "Premi «Carica questo caso»: Percorso richiesto = File assente; PID = 417. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Vecchia immagine» annota PID, programma e pagina privata.",
          "Dopo «Ricerca del file» confronta questi tre elementi con «Prossima istruzione utente» e leggi RIP."
        ],
        "risultato": "PID = 417; Immagine = A; Pagina della vecchia immagine = ancora presente; RIP = 0x401082; Ritorno della syscall = -2.",
        "ragionamento": "Con il file assente, la ricerca produce ENOENT, rappresentato da −2 nel ritorno della syscall diretta. Il processo conserva PID 417, immagine A e pagina privata; RIP riprende a 0x401082, dove il chiamante può trattare l’errore.",
        "attesi": [
          {
            "passo": 2,
            "campo": "PID",
            "valore": "417"
          },
          {
            "passo": 2,
            "campo": "Immagine",
            "valore": "A"
          },
          {
            "passo": 2,
            "campo": "Pagina della vecchia immagine",
            "valore": "ancora presente"
          },
          {
            "passo": 2,
            "campo": "RIP",
            "valore": "0x401082"
          },
          {
            "passo": 2,
            "campo": "Ritorno della syscall",
            "valore": "-2"
          }
        ]
      }
    ]
  },
  "2.5.5": {
    "scopo": "Due descrittori riferiti allo stesso file possono condividere il cursore oppure possederne due distinti. Confronta dup con una seconda open seguendo due letture successive.",
    "teoria": [
      "Quando un processo apre un file, il kernel gli assegna un descrittore, cioè un piccolo intero che funge da indice in una tabella. La voce così individuata rinvia a una descrizione di file aperto. Fra le informazioni conservate nella descrizione c’è l’offset, la distanza in byte dall’inizio del file alla posizione da cui partirà la prossima lettura ordinaria.",
      "La chiamata dup crea un secondo descrittore che rinvia alla medesima descrizione. Se dal descrittore 3 si leggono i primi tre byte del file, l’offset avanza da 0 a 3. Una lettura attraverso il descrittore 4, ottenuto con dup, comincia allora dal byte di indice 3, perché segue il medesimo cursore.",
      "Anche una seconda open può produrre un descrittore 4 riferito allo stesso file. Questa volta, però, il kernel crea una descrizione distinta con il proprio cursore. Mentre il primo avanza, il secondo resta a zero fino alla sua prima lettura. Le due configurazioni mostrano perché il nome del file, da solo, sia insufficiente a stabilire quale byte verrà letto."
    ],
    "introduzione": [
      "La simulazione chiarisce dove venga conservata la posizione di lettura di un file. Un descrittore è un indice nella tabella del processo; la descrizione di file aperto è l’oggetto a cui rimanda e contiene il cursore, detto offset. I collegamenti mostrano come due descrittori possano condividere tale oggetto oppure raggiungere descrizioni distinte dello stesso file.",
      "Carica il caso con dup e due letture da tre byte. Avanza dopo ciascuna read, confrontando gli offset visti da fd 3 e fd 4: il cursore comune passa da zero a tre e poi a sei. Ripeti con «Seconda open» e osserva che la lettura da fd 4 parte da zero, perché possiede un cursore separato."
    ],
    "lettura": "I descrittori 3 e 4 rinviano alle descrizioni aperte rappresentate nel disegno. Quando i collegamenti raggiungono lo stesso oggetto, l’offset è condiviso; con due descrizioni, ogni lettura aggiorna soltanto il proprio cursore.",
    "conclusione": "Il descrittore è una voce della tabella del processo, mentre l’offset appartiene alla descrizione di file aperto. La condivisione di quest’ultima spiega perché una lettura possa spostare anche la posizione vista dall’altro descrittore.",
    "controlli": {
      "mode": "Modo in cui viene ottenuto fd 4: dup condivide la descrizione di fd 3, una seconda open ne crea una distinta.",
      "n": "Byte trasferiti dalla prima lettura su fd 3. Il file è abbastanza lungo e il modello assume lettura completa.",
      "k": "Byte trasferiti dalla seconda lettura su fd 4. Il suo indirizzo iniziale dipende dall’eventuale condivisione dell’offset."
    },
    "esperienze": [
      {
        "titolo": "Un cursore condiviso con dup",
        "parametri": {
          "mode": "dup",
          "n": 3,
          "k": 3
        },
        "passi": [
          "Premi «Carica questo caso»: Origine di fd 4 = dup di fd 3; Byte letti da fd 3 = 3; Byte letti da fd 4 = 3. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Apertura» conta le descrizioni aperte, oltre ai descrittori.",
          "Segui «read su fd 3» e «read su fd 4» annotando a ogni passaggio entrambi gli offset."
        ],
        "risultato": "Primo byte letto = 3; Offset finale fd 4 = 6; Offset finale fd 3 = 6.",
        "ragionamento": "Con dup esiste una sola descrizione aperta. La lettura di 3 byte da fd 3 porta il cursore comune a 3; fd 4 parte da quel byte e ne legge altri 3, lasciando entrambi gli offset a 6.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Primo byte letto",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "Offset finale fd 4",
            "valore": "6"
          },
          {
            "passo": 2,
            "campo": "Offset finale fd 3",
            "valore": "6"
          }
        ]
      },
      {
        "titolo": "Due cursori dopo due open",
        "parametri": {
          "mode": "open",
          "n": 3,
          "k": 3
        },
        "passi": [
          "Premi «Carica questo caso»: Origine di fd 4 = Seconda open; Byte letti da fd 3 = 3; Byte letti da fd 4 = 3. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Apertura» conta le descrizioni aperte, oltre ai descrittori.",
          "Segui «read su fd 3» e «read su fd 4» annotando a ogni passaggio entrambi gli offset."
        ],
        "risultato": "Primo byte letto = 0; Offset finale fd 4 = 3; Offset finale fd 3 = 3.",
        "ragionamento": "La seconda open crea due descrizioni. Dopo la prima lettura fd 3 si trova a 3 e fd 4 a 0; la seconda lettura parte dal byte zero e porta il proprio offset a 3, mentre fd 3 rimane a 3.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Primo byte letto",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Offset finale fd 4",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "Offset finale fd 3",
            "valore": "3"
          }
        ]
      }
    ]
  },
  "2.5.6": {
    "scopo": "Il codice che un processo richiede alla terminazione attraversa un formato di stato prima di essere letto dal genitore. Confronta due richieste distanti 256 per individuare la parte che viene conservata.",
    "teoria": [
      "Quando un programma termina, il sistema operativo può trasmettere a chi lo ha avviato un piccolo numero che ne riassume l’esito. Il processo che termina si chiama figlio, quello che ne raccoglie l’esito si chiama genitore. Nel caso illustrato il figlio esegue un solo flusso di istruzioni e la chiamata Linux exit ne conclude l’esecuzione.",
      "I registri RAX e RDI sono piccole memorie interne del processore; _start è il nome dell’ingresso dal quale comincia il programma del caso. Una macro, come WEXITSTATUS, è una notazione del linguaggio C che esprime un’operazione sui dati: qui estrae il codice dalla parola di stato. Per la terminazione normale illustrata, gli otto bit del codice occupano le posizioni da 8 a 15, perciò 7 diventa 7 × 256 = 1792, scritto 0x0700 in base sedici. L’estrazione riporta quel campo al valore 7. Il controllo preliminare della terminazione normale si esprime con WIFEXITED.",
      "Il figlio colloca il numero 60, che identifica exit per Linux x86-64, nel registro RAX e il codice richiesto nel registro RDI. Il genitore usa waitpid per attendere il figlio e ricevere una parola di stato. Questa parola contiene anche informazioni sulla modalità di terminazione. Dopo avere accertato che la terminazione è normale, WEXITSTATUS ne estrae il codice disponibile al genitore.",
      "Per il codice sono disponibili otto bit, sufficienti per 256 valori. Se il figlio richiede 263, la parte conservata vale 263 − 256, cioè 7, come per una richiesta diretta di 7. La parola di stato grezza ha un aspetto differente, poiché Linux colloca il codice in un campo interno che WEXITSTATUS riporta sulle unità."
    ],
    "introduzione": [
      "L’attività permette di comprendere come un codice di terminazione raggiunga il processo genitore. Il figlio richiede un valore a exit; il genitore riceve da waitpid una parola che descrive l’esito complessivo. Per la terminazione normale illustrata, il codice occupa un campo di otto bit e WEXITSTATUS lo estrae: le righe binarie rendono visibili selezione e collocazione del campo.",
      "Carica «Codice richiesto» pari a 7 e avanza dalla preparazione di RDI all’attesa del genitore. Confronta il codice estratto con la parola di stato 0x0700, poi carica 263. Osserva che entrambi producono WEXITSTATUS = 7: i valori differiscono di 256 e condividono gli otto bit bassi, che il modello conserva per comunicare la terminazione normale."
    ],
    "lettura": "La traccia segue RDI all’ingresso di exit, gli otto bit bassi del codice e la parola raccolta da waitpid. Il riquadro WEXITSTATUS mostra il campo riportato al suo valore numerico.",
    "conclusione": "Per la terminazione normale illustrata, il genitore osserva gli otto bit bassi del codice. La parola grezza di waitpid include anche il formato di stato, perciò il suo valore va interpretato attraverso le macro previste.",
    "controlli": {
      "code": "Codice richiesto a exit, inserito in RDI. Il genitore riceverà la parte compresa negli otto bit meno significativi."
    },
    "esperienze": [
      {
        "titolo": "Il codice sette",
        "parametri": {
          "code": 7
        },
        "passi": [
          "Premi «Carica questo caso»: Codice richiesto = 7. Parti dal primo passo e avanza con «Passo successivo».",
          "Nel passo «Termina» confronta il codice richiesto con gli otto bit bassi di RDI.",
          "In «Attesa del genitore» distingui la parola di stato dal codice estratto."
        ],
        "risultato": "Stato wait Linux = 0x0700; WEXITSTATUS = 7.",
        "ragionamento": "Il codice richiesto 7 occupa gli otto bit bassi come 0x07. Linux lo colloca nel campo di stato mostrato come 0x0700; dopo il controllo di terminazione normale, WEXITSTATUS estrae 7.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Stato wait Linux",
            "valore": "0x0700"
          },
          {
            "passo": 2,
            "campo": "WEXITSTATUS",
            "valore": "7"
          }
        ]
      },
      {
        "titolo": "Una richiesta superiore di 256",
        "parametri": {
          "code": 263
        },
        "passi": [
          "Premi «Carica questo caso»: Codice richiesto = 263. Parti dal primo passo e avanza con «Passo successivo».",
          "Nel passo «Termina» confronta il codice richiesto con gli otto bit bassi di RDI.",
          "In «Attesa del genitore» distingui la parola di stato dal codice estratto."
        ],
        "risultato": "Stato wait Linux = 0x0700; WEXITSTATUS = 7.",
        "ragionamento": "La richiesta 263 vale 256 + 7, quindi i suoi otto bit bassi coincidono con quelli di 7. Lo stato mostrato è ancora 0x0700 e WEXITSTATUS restituisce ancora 7, rendendo visibile la riduzione modulo 256.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Stato wait Linux",
            "valore": "0x0700"
          },
          {
            "passo": 2,
            "campo": "WEXITSTATUS",
            "valore": "7"
          }
        ]
      }
    ]
  },
  "2.5.7": {
    "scopo": "Una write può trasferire solo un prefisso del buffer. Individua dove deve iniziare il tentativo successivo e quanti byte deve comprendere.",
    "teoria": [
      "Il kernel è la parte del sistema operativo che gestisce i trasferimenti richiesti dal programma. Il descrittore è un piccolo numero che identifica la destinazione aperta. Il simbolo p rappresenta l’indirizzo del primo byte del buffer; p + 1 indica il secondo byte e p + 2 il terzo. Nel testo del caso ogni lettera occupa un byte, perciò contare le lettere equivale a contare i byte trasferiti.",
      "Un programma che invia dati a un file o a un altro destinatario consegna al kernel l’indirizzo iniziale di un buffer, il descrittore della destinazione e il numero di byte che intende scrivere. Il buffer è un tratto di memoria nel quale il messaggio occupa celle consecutive. Al ritorno, un risultato positivo della chiamata write conta i byte del prefisso che il kernel ha accettato.",
      "Il buffer del caso contiene ABCDE. La prima richiesta comprende cinque byte e il kernel ne accetta due, quindi A e B risultano già trasferiti. Il primo byte ancora da inviare è C, che si trova a due byte di distanza dall’inizio p, mentre il suffisso CDE occupa tre byte.",
      "Per riprendere il trasferimento si fanno quindi due aggiornamenti coordinati. All’indirizzo iniziale si aggiunge la quantità già accettata e dal conteggio offerto si sottrae la stessa quantità. Applicando il ragionamento ai byte della figura si può individuare sia la prima cella da cui ripartire sia l’estensione del tratto residuo."
    ],
    "introduzione": [
      "La ricostruzione serve a preparare correttamente una nuova richiesta dopo una scrittura breve. Il buffer contiene byte consecutivi e il risultato positivo di write conta il prefisso già accettato dal kernel. Separando il messaggio in parte consegnata e parte residua, la figura rende evidente la relazione fra avanzamento del puntatore e riduzione del numero di byte ancora da inviare.",
      "Leggi il messaggio ABCDE e inserisci una previsione per il conteggio della seconda write. Con «Passo successivo» raggiungi «Risultato parziale» e confronta AB con CDE. In «Preparare il seguito» controlla insieme base p + 2 e conteggio 3: il primo dato individua la C, mentre il secondo delimita tutto il suffisso che resta da trasferire."
    ],
    "lettura": "Il buffer ABCDE è diviso nel prefisso già accettato AB e nel suffisso pendente CDE. Il puntatore e il conteggio della seconda richiesta descrivono soltanto il suffisso.",
    "conclusione": "Dopo un ritorno positivo k, il puntatore avanza di k e il residuo diminuisce di k. Aggiornare entrambi evita sia la ripetizione dei byte sia l’omissione di una parte del messaggio.",
    "procedura": [
      "Leggi i dati: cinque byte richiesti a partire da p e due accettati. Segna i caratteri già consegnati e inserisci la previsione sul nuovo conteggio.",
      "In «Risultato parziale» confronta i tratti AB e CDE con la divisione prevista.",
      "In «Preparare il seguito» verifica insieme la nuova base p + 2 e il conteggio 3."
    ],
    "risultato": "Quanti byte deve richiedere la seconda write? 3.",
    "ragionamento": "Il buffer contiene ABCDE all’indirizzo p. La prima write richiede cinque byte. Il kernel accetta due byte. Il prefisso già consegnato è AB. La richiesta successiva parte da p + 2 e comprende cinque meno due byte."
  },
  "2.5.8": {
    "scopo": "Il buffer può avere più spazio dei dati effettivamente acquisiti. Nel caso iniziale calcola il suffisso valido da inviare usando il ritorno di read e l’offset richiesto.",
    "teoria": [
      "Un programma può chiedere al sistema operativo di trasferire alcuni byte tra un file e una regione di memoria, detta buffer. La quantità desiderata indica il limite della richiesta. Per proseguire il lavoro il programma deve conoscere quanti byte sono stati effettivamente trasferiti.",
      "read acquisisce byte dal file di ingresso e write li invia a una destinazione aperta; i numeri fd 0 e fd 1 indicano qui ingresso e uscita. L’offset è la distanza, misurata in byte, dall’inizio del buffer: offset 2 significa saltare i byte di indice 0 e 1. Un prefisso è il tratto iniziale, mentre un suffisso è il tratto che prosegue fino alla fine dei dati considerati. Nel listato CMP RAX,2 confronta il conteggio con 2 e JLE raggiunge fine quando esso è minore o uguale a 2; così il percorso della write richiede almeno tre byte validi.",
      "Nella convenzione di Linux x86-64 per le chiamate read e write, RDX porta il conteggio richiesto e RAX riceve l’esito. Un valore positivo al ritorno conta i byte davvero trasferiti. La capacità del buffer indica invece lo spazio disponibile, che può essere maggiore di entrambe le quantità.",
      "Nel caso proposto il buffer ha capacità otto, read restituisce sei byte validi e il suffisso richiesto comincia all’offset 2. La scrittura deve dunque partire da buf + 2 e comprendere 6 − 2 = 4 byte. Il controllo preliminare sul ritorno di read verifica che il prefisso da saltare sia effettivamente disponibile."
    ],
    "introduzione": [
      "L’esercizio iniziale aiuta a individuare i dati validi dentro un buffer più capiente. La capacità misura lo spazio disponibile, mentre il ritorno positivo di read conta i byte appena ricevuti. Un suffisso è il tratto finale di questi dati, a partire da un offset, cioè una distanza dalla base. La ricostruzione mostra come determinarne indirizzo e lunghezza.",
      "Premi «Carica l’esempio guidato», prevedi l’offset iniziale e usa «Registra la previsione». Avanza confrontando gli otto byte di capacità con i sei restituiti da read. Dopo il controllo del conteggio, segui la coppia preparata per write: buf + 2 salta i primi due byte e RDX = 4 comprende soltanto il suffisso valido della lettura."
    ],
    "lettura": "La ricostruzione segue il conteggio passato a read, il valore restituito in RAX e la coppia puntatore-conteggio preparata per write. Il prefisso saltato appartiene ai dati letti, mentre lo spazio inutilizzato resta fuori dalla scrittura.",
    "conclusione": "La capacità limita la lettura, mentre il suo ritorno determina i dati validi. Un suffisso che inizia all’offset k contiene letti − k byte soltanto dopo avere verificato che quel prefisso esista.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per aprire l’esercizio 2 «Scrivere il suffisso appena letto», traccia 1. Leggi la consegna e annota i dati iniziali; i risultati illustrati qui si riferiscono a questa traccia.",
      "Prevedi il campo «Offset iniziale del suffisso» e premi «Registra la previsione». Avanza poi nella ricostruzione, collegando ogni passaggio ai dati della consegna.",
      "Al termine controlla tutti i campi richiesti: Offset iniziale del suffisso; RDX per write. Apri «Apri la prova completa» per inserire anche le risposte successive e verificarne lo svolgimento integrale."
    ],
    "risultato": "Per l’esercizio 2, traccia 1: Offset iniziale del suffisso = 2; RDX per write = 4.",
    "ragionamento": "read riceve fd 0, l’indirizzo di buf e la capacità 8. RAX al ritorno vale 6. Controlla che la lunghezza superi 2. Si parte da buf+2 e rimangono 6 − 2 = 4 byte. write riceve fd 1, il puntatore avanzato e il conteggio residuo. Il ramo fine copre anche EOF o errore di read."
  },
  "2.5.9": {
    "scopo": "Un risultato zero di read va interpretato insieme al conteggio richiesto. Il caso iniziale permette di distinguere una richiesta di zero byte da una verifica della fine del file.",
    "teoria": [
      "Quando un file ordinario viene aperto per la lettura, il sistema conserva la posizione dalla quale partire alla richiesta successiva. Questa distanza in byte dall’inizio prende il nome di offset. Il conteggio richiesto è un dato di ingresso, mentre il numero restituito racconta l’esito della lettura.",
      "Il buffer è la regione di memoria destinata a ricevere i dati. Per chiedere il trasferimento, il programma prepara i registri, piccole memorie del processore: RDX contiene quanti byte si desidera leggere e RAX riceve il risultato della chiamata. Il descrittore, qui fd 3, identifica il file aperto. La simulazione assume che il file e il buffer siano validi e che la chiamata termini senza errori, così da isolare il significato del conteggio zero.",
      "La chiamata read deposita nel buffer i dati che ha potuto leggere. Per un file ordinario, se erano stati richiesti byte e la lettura parte dalla fine del file, il risultato è zero. Nessun avanzamento è necessario, perché il primo byte ancora da leggere si trova tuttora alla stessa posizione.",
      "La richiesta del caso iniziale usa conteggio zero. Quel solo dato spiega il trasferimento nullo anche se il file avesse altri byte disponibili: RAX vale zero e l’offset resta invariato. Per usare un ritorno zero come segnale di fine del file ordinario occorre prima avere richiesto una quantità positiva."
    ],
    "introduzione": [
      "Lo svolgimento permette di interpretare un ritorno zero di read tenendo conto della richiesta. RDX contiene il numero di byte domandati, RAX il numero trasferito e l’offset indica la posizione della prossima lettura nel file. Nel caso senza errori, chiedere zero byte spiega già il trasferimento nullo: il confronto fra questi dati chiarisce il significato del risultato.",
      "Carica l’esempio guidato e avanza con «Passo successivo», leggendo prima RDX e poi RAX. Confronta la richiesta di zero byte con il ritorno zero e osserva che l’offset conserva la posizione iniziale. Interpreta questo risultato a partire dal conteggio richiesto: per riconoscere la fine di un file ordinario mediante read occorre una richiesta positiva."
    ],
    "lettura": "La traccia espone RDX come richiesta, RAX come risultato e l’offset del file. Osserva che un trasferimento nullo lascia il cursore nella posizione iniziale.",
    "conclusione": "Una read di zero byte può restituire zero a prescindere dai dati ancora disponibili. Il significato di fine del file per un file ordinario richiede una richiesta positiva.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per aprire l’esercizio 4 «Interpretare zero al ritorno di read», traccia 1. Leggi la consegna e annota i dati iniziali; i risultati illustrati qui si riferiscono a questa traccia.",
      "Avanza nella ricostruzione con «Passo successivo», fermandoti dopo ogni scrittura o trasformazione. Confronta il dato ottenuto con il passaggio dello svolgimento.",
      "Al termine controlla tutti i campi richiesti: Significato basato sul conteggio; Incremento dell’offset. Apri «Apri la prova completa» per inserire anche le risposte successive e verificarne lo svolgimento integrale."
    ],
    "risultato": "Per l’esercizio 4, traccia 1: Significato basato sul conteggio = richiesta di zero byte; Incremento dell’offset = 0.",
    "ragionamento": "Il descrittore punta a un file ordinario e la richiesta usa RDX=0. Il conteggio zero dà zero byte anche in presenza di dati disponibili. Il trasferimento è nullo: RAX=0 e l’offset rimane alla posizione iniziale."
  },
  "2.6.1": {
    "scopo": "Una convenzione di chiamata indica dove cercare gli argomenti di una funzione. Confronta il settimo e il sesto argomento intero per osservare il passaggio fra pila e registri.",
    "teoria": [
      "Una funzione è una sequenza di istruzioni alla quale un altro tratto del programma trasferisce il controllo insieme ad alcuni valori, chiamati argomenti. Perché la funzione li ritrovi, il codice che chiama e quello chiamato devono seguire la stessa convenzione. Nella convenzione System V AMD64 i primi sei argomenti interi di questo esempio entrano in sei registri, piccole memorie interne chiamate RDI, RSI, RDX, RCX, R8 e R9.",
      "Il settimo argomento viene predisposto in memoria sulla pila, una zona che cresce verso indirizzi più piccoli. Qui ogni argomento occupa otto byte. Subito prima della chiamata il settimo si trova a 0x8000. L’istruzione CALL aggiunge alla pila un indirizzo di ritorno di otto byte, per cui all’ingresso della funzione la nuova cima è a 0x7FF8.",
      "Il registro RSP indica quella cima. L’espressione [RSP + 8] chiede di leggere la cella che comincia otto byte più avanti, proprio a 0x8000. Per stabilire dove leggere un argomento conta la sua posizione nell’elenco, indipendentemente dal numero che vi era stato assegnato.",
      "L’indirizzo di ritorno identifica l’istruzione da eseguire quando la funzione ha terminato. La pila lo colloca alla propria cima, separandolo dagli argomenti già predisposti dal chiamante. Nel quadro dei valori compare anche «RSP modulo 16»: è il resto della divisione dell’indirizzo per sedici. La cima iniziale 0x8000 è un multiplo di sedici; sottraendo gli otto byte del ritorno si ottiene 0x7FF8, il cui resto è otto. Questo dato descrive l’allineamento richiesto dalla convenzione nel caso illustrato."
    ],
    "introduzione": [
      "La simulazione permette di individuare gli argomenti di una funzione seguendo la convenzione di chiamata. In questo caso System V AMD64 assegna i primi sei interi ai registri e il settimo alla pila, la regione di memoria la cui cima è indicata da RSP. La figura mostra come CALL aggiunga il ritorno e modifichi la distanza dell’argomento dalla cima.",
      "Carica la posizione 7 con primo valore 10 e avanza fino a «Ingresso». Confronta RSP a 0x7FF8 con la sede del settimo argomento a 0x8000, quindi leggi il valore 16 da [RSP + 8]. Ripeti scegliendo la posizione 6: il valore 15 viene letto da R9, mentre la disposizione della pila resta la stessa."
    ],
    "lettura": "Ogni colonna rappresenta un argomento: in alto si legge il valore e in basso la sede assegnata. Le prime sei sedi sono registri e la settima è indicata come pila; la nota sotto il disegno precisa che il ritorno occupa [RSP] e il settimo argomento si trova a [RSP + 8].",
    "conclusione": "La posizione nell’elenco stabilisce la sede dell’argomento. Nel caso mostrato, i primi sei interi occupano registri e il settimo resta a otto byte dalla cima dopo la chiamata.",
    "controlli": {
      "i": "Posizione dell’argomento da leggere, contando da uno. La posizione 7 richiede la pila; da 1 a 6 si usano i registri della convenzione System V AMD64.",
      "base": "Valore del primo argomento. I successivi aumentano di uno, così da riconoscere il dato associato a ciascuna posizione."
    },
    "esperienze": [
      {
        "titolo": "Settimo argomento sulla pila",
        "parametri": {
          "i": 7,
          "base": 10
        },
        "passi": [
          "Premi «Carica questo caso»: Posizione dell’argomento = 7; Valore del primo argomento = 10. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Ingresso» verifica RSP e l’indirizzo del settimo argomento.",
          "In «Lettura» collega la posizione selezionata alla sede e al valore riportati."
        ],
        "risultato": "Posizione = 7; Sede = [RSP + 8]; Valore = 16.",
        "ragionamento": "I sette argomenti valgono 10, 11, 12, 13, 14, 15 e 16. CALL porta RSP da 0x8000 a 0x7FF8, quindi il settimo resta a [RSP + 8] = 0x8000 e vale 16.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Posizione",
            "valore": "7"
          },
          {
            "passo": 2,
            "campo": "Sede",
            "valore": "[RSP + 8]"
          },
          {
            "passo": 2,
            "campo": "Valore",
            "valore": "16"
          }
        ]
      },
      {
        "titolo": "Sesto argomento in R9",
        "parametri": {
          "i": 6,
          "base": 10
        },
        "passi": [
          "Premi «Carica questo caso»: Posizione dell’argomento = 6; Valore del primo argomento = 10. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Ingresso» verifica RSP e l’indirizzo del settimo argomento.",
          "In «Lettura» collega la posizione selezionata alla sede e al valore riportati."
        ],
        "risultato": "Posizione = 6; Sede = R9; Valore = 15.",
        "ragionamento": "Il sesto argomento della stessa sequenza vale 15. La convenzione lo assegna a R9, perciò la lettura usa quel registro; RSP dopo CALL rimane 0x7FF8 e il settimo conserva la propria sede sulla pila.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Posizione",
            "valore": "6"
          },
          {
            "passo": 2,
            "campo": "Sede",
            "valore": "R9"
          },
          {
            "passo": 2,
            "campo": "Valore",
            "valore": "15"
          }
        ]
      }
    ]
  },
  "2.6.2": {
    "scopo": "CALL deve conservare il punto di ripresa prima di trasferire il controllo alla funzione. Cambia lo spazio locale del chiamante per distinguere l’indirizzo salvato dalla posizione di memoria in cui viene scritto.",
    "teoria": [
      "Quando un programma affida un compito a una funzione, occorre ricordare il punto da cui proseguire dopo che la funzione avrà terminato. Il processore conserva quell’indirizzo sulla pila, una regione di memoria nella quale l’ultimo valore inserito è il primo disponibile al prelievo. Due registri aiutano a seguire il viaggio. RIP indica quale istruzione eseguire e RSP indica la posizione in memoria della cima della pila.",
      "L’istruzione CALL del modello occupa cinque byte. Se comincia a 0x400200, il punto di ripresa si trova a 0x400205. La macchina sottrae otto da RSP, poiché un indirizzo a 64 bit occupa otto byte, e deposita questa informazione alla nuova cima. Soltanto dopo il trasferimento RIP indica l’ingresso della funzione.",
      "Al ritorno, RET preleva l’indirizzo dalla cima e aumenta RSP di otto. Se la funzione ha ripristinato la propria pila, RIP ritrova così 0x400205. Lo spazio locale che il chiamante aveva riservato modifica l’indirizzo del salvataggio, mentre il valore da salvare dipende dalla posizione e dalla lunghezza della CALL."
    ],
    "introduzione": [
      "Seguire CALL e RET serve a distinguere l’indirizzo di ritorno dalla cella che lo conserva. RIP indica l’istruzione da eseguire e RSP la cima della pila. CALL salva l’indirizzo dell’istruzione seguente in otto byte di memoria; RET lo recupera. I due percorsi affiancati permettono di osservare separatamente il movimento del controllo e quello della cima.",
      "Carica il caso senza blocchi locali e avanza da «Prima della CALL» a «Dopo RET». Confronta RSP con il valore scritto in [RSP], che è 0x400205. Ripeti con due blocchi locali: la sede del salvataggio scende a 0x8FD8, mentre il ritorno resta identico. Collega quindi il valore salvato alla lunghezza della CALL e la sua sede alla pila disponibile."
    ],
    "lettura": "RIP segue il flusso delle istruzioni e RSP segue la cima della pila. Il riquadro [RSP] rappresenta il dato depositato in memoria da CALL; dopo RET quel dato torna in RIP e la cima risale di otto byte.",
    "conclusione": "L’indirizzo di ritorno dipende da posizione e lunghezza della CALL. La sua sede sulla pila dipende invece da RSP; RET recupera il dato da quella sede quando la funzione ha ripristinato la propria pila.",
    "controlli": {
      "off": "Distanza in byte della CALL dalla base 0x400200. La chiamata del modello occupa cinque byte, quindi il ritorno si trova cinque byte oltre il suo inizio.",
      "slots": "Blocchi da sedici byte riservati dal chiamante prima di CALL. Modificano la cima della pila senza cambiare il codice eseguito."
    },
    "esperienze": [
      {
        "titolo": "Salvataggio alla cima iniziale",
        "parametri": {
          "off": 0,
          "slots": 0
        },
        "passi": [
          "Premi «Carica questo caso»: Offset della CALL da 0x400200 = 0; Blocchi locali del chiamante da 16 byte = 0. Parti dal primo passo e avanza con «Passo successivo».",
          "Prima della chiamata annota separatamente RIP e RSP.",
          "In «Dopo la CALL» distingui RSP dall’indirizzo contenuto in [RSP], poi verifica i due registri in «Dopo RET»."
        ],
        "risultato": "RIP = 0x400205; RSP = 0x9000.",
        "ragionamento": "La CALL parte da 0x400200 e occupa cinque byte, quindi salva 0x400205. RSP passa da 0x9000 a 0x8FF8; RET preleva il ritorno, porta RIP a 0x400205 e ripristina RSP a 0x9000.",
        "attesi": [
          {
            "passo": 2,
            "campo": "RIP",
            "valore": "0x400205"
          },
          {
            "passo": 2,
            "campo": "RSP",
            "valore": "0x9000"
          }
        ]
      },
      {
        "titolo": "Stesso ritorno, cima più bassa",
        "parametri": {
          "off": 0,
          "slots": 2
        },
        "passi": [
          "Premi «Carica questo caso»: Offset della CALL da 0x400200 = 0; Blocchi locali del chiamante da 16 byte = 2. Parti dal primo passo e avanza con «Passo successivo».",
          "Prima della chiamata annota separatamente RIP e RSP.",
          "In «Dopo la CALL» distingui RSP dall’indirizzo contenuto in [RSP], poi verifica i due registri in «Dopo RET»."
        ],
        "risultato": "RIP = 0x400205; RSP = 0x8FE0.",
        "ragionamento": "Due blocchi locali occupano 32 byte e portano la cima precedente a CALL a 0x8FE0. La chiamata salva lo stesso 0x400205 a 0x8FD8; RET riporta RSP a 0x8FE0 e RIP al punto di ripresa invariato.",
        "attesi": [
          {
            "passo": 2,
            "campo": "RIP",
            "valore": "0x400205"
          },
          {
            "passo": 2,
            "campo": "RSP",
            "valore": "0x8FE0"
          }
        ]
      }
    ]
  },
  "2.6.3": {
    "scopo": "La scelta del minore dipende dall’interpretazione degli stessi byte. Confronta il comportamento dei salti con segno e senza segno sul caso 0xFF e 0x01, nel quale i due ordinamenti divergono.",
    "teoria": [
      "Per scegliere il minore di due numeri occorre stabilire come interpretarne i bit. Un byte, composto da otto cifre binarie, può indicare un intero tra 0 e 255 oppure, in complemento a due, un intero tra −128 e 127. Il byte con tutte le cifre a uno si scrive 0xFF e vale rispettivamente 255 o −1. La differenza emerge quando lo si confronta, per esempio, con 1.",
      "AL e BL indicano porzioni di registro larghe un byte. In CMP AL,BL il primo valore è il minuendo e il secondo il sottraendo. Le cifre dopo 0x sono in base sedici: FF equivale a 15 × 16 + 15 = 255. Nel complemento a due a otto bit, un byte fra 128 e 255 rappresenta il valore senza segno meno 256, perciò FF rappresenta anche −1. La sottrazione conserva soltanto gli otto bit bassi; quando esce dall’intervallo da −128 a 127, OF permette al salto con segno di correggerne l’interpretazione.",
      "L’istruzione CMP esamina la sottrazione fra i byte custoditi nei registri AL e BL. Gli operandi restano disponibili e il processore registra alcuni segnali. CF indica un prestito nella sottrazione senza segno, SF copia il bit di segno della differenza conservata e OF segnala uno sconfinamento della differenza con segno.",
      "Il salto JB sceglie il primo operando quando CF vale uno, applicando l’ordine senza segno. Il salto JL sceglie il primo quando SF e OF differiscono, così da correggere anche i casi in cui il segno della differenza è stato alterato dallo sconfinamento. Il confronto fra 0xFF e 1 produce dunque due scelte diverse, ciascuna coerente con l’ordine adottato."
    ],
    "introduzione": [
      "L’attività permette di capire come i salti condizionali interpretino i flag dello stesso confronto. CMP valuta una sottrazione conservando gli operandi; JB usa CF per l’ordine senza segno, mentre JL confronta SF e OF per l’ordine con segno. Il byte 0xFF, interpretabile come 255 oppure −1, rende osservabile l’effetto della scelta sul minimo restituito.",
      "Carica A = 255 e B = 1 con confronto «Con segno», poi avanza fino a «Seleziona». Confronta il risultato con il caso «Senza segno», mantenendo gli stessi byte. La differenza temporanea e i flag restano uguali; cambia il salto che li legge. Collega la scelta di A oppure B ai valori −1 oppure 1 mostrati nel risultato."
    ],
    "lettura": "La prima parte mostra i byte e la differenza temporanea di CMP. La seconda espone i flag usati da JL o JB; il riquadro finale identifica l’operando scelto e il valore attribuito al suo byte.",
    "conclusione": "CMP produce i flag da una sottrazione, mentre il salto decide come interpretarli. JL usa SF diverso da OF per l’ordine con segno; JB usa CF per quello senza segno.",
    "controlli": {
      "a": "Configurazione del byte A, inserita come numero da 0 a 255. Il tipo di confronto stabilisce il valore attribuito al bit più alto.",
      "b": "Configurazione del byte B, seconda sorgente del confronto CMP AL, BL.",
      "t": "Interpretazione richiesta dal confronto: con segno in complemento a due oppure senza segno."
    },
    "esperienze": [
      {
        "titolo": "Il minimo nella lettura con segno",
        "parametri": {
          "a": 255,
          "b": 1,
          "t": "s"
        },
        "passi": [
          "Premi «Carica questo caso»: Byte A = 255; Byte B = 1; Confronto = Con segno. Parti dal primo passo e avanza con «Passo successivo».",
          "In «CMP AL, BL» annota la differenza senza assegnarle subito un significato di ordine.",
          "In «Decidi il salto» identifica il flag o la coppia di flag letti dall’istruzione selezionata e segui «Seleziona»."
        ],
        "risultato": "Origine = A; Byte = 0xFF; Interpretazione = -1.",
        "ragionamento": "La differenza 0xFF − 0x01 conserva 0xFE e produce SF = 1, OF = 0 e CF = 0. JL vede SF diverso da OF e sceglie A: nella lettura con segno 0xFF vale −1, inferiore a 1.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Origine",
            "valore": "A"
          },
          {
            "passo": 2,
            "campo": "Byte",
            "valore": "0xFF"
          },
          {
            "passo": 2,
            "campo": "Interpretazione",
            "valore": "-1"
          }
        ]
      },
      {
        "titolo": "Il minimo nella lettura senza segno",
        "parametri": {
          "a": 255,
          "b": 1,
          "t": "u"
        },
        "passi": [
          "Premi «Carica questo caso»: Byte A = 255; Byte B = 1; Confronto = Senza segno. Parti dal primo passo e avanza con «Passo successivo».",
          "In «CMP AL, BL» annota la differenza senza assegnarle subito un significato di ordine.",
          "In «Decidi il salto» identifica il flag o la coppia di flag letti dall’istruzione selezionata e segui «Seleziona»."
        ],
        "risultato": "Origine = B; Byte = 0x01; Interpretazione = 1.",
        "ragionamento": "I flag di CMP restano gli stessi, mentre JB consulta CF = 0 e sceglie B. Nella lettura senza segno A vale 255 e B vale 1, perciò il minimo è 0x01.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Origine",
            "valore": "B"
          },
          {
            "passo": 2,
            "campo": "Byte",
            "valore": "0x01"
          },
          {
            "passo": 2,
            "campo": "Interpretazione",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "2.6.4": {
    "scopo": "Un ciclo può sommare una successione mentre riduce il contatore dei termini residui. Segui la somma da quattro a uno e confrontala con la sequenza vuota, che deve saltare direttamente all’uscita.",
    "teoria": [
      "Una somma di molti termini può essere eseguita ripetendo poche istruzioni. Occorrono due memorie interne distinte. La prima, EAX, conserva la somma raggiunta e per questo svolge la funzione di accumulatore. La seconda, ECX, contiene il prossimo termine e al tempo stesso indica quanti termini restano. Ogni passaggio nel corpo del ciclo modifica entrambe.",
      "Con ECX inizialmente uguale a 4, la prima somma porta EAX da zero a 4. DEC riduce ECX a 3 e, poiché il risultato differisce da zero, il comando JNZ torna all’inizio del corpo. Le somme successive aggiungono 3, 2 e 1: EAX passa per 7 e 9 fino a 10, mentre l’ultimo decremento porta ECX a zero.",
      "JNZ decide il salto attraverso ZF, il segnale di risultato nullo aggiornato da DEC. Quando ZF vale uno si raggiunge il ritorno e il chiamante trova la somma in EAX. Un controllo distinto, eseguito da TEST all’ingresso, consente al programma di restituire subito zero quando la sequenza di termini è vuota.",
      "Il controllo finale n(n+1)/2 offre una seconda strada per calcolare la somma. Scrivendo 1 + 2 + … + n una volta in ordine crescente e una volta in ordine decrescente, ogni coppia verticale vale n+1; le n coppie danno n(n+1), che è il doppio della somma cercata. TEST ECX,ECX aggiorna ZF in base al contenuto di ECX, lasciandolo intatto: ZF vale uno esattamente quando il contatore è zero. RET riconsegna il controllo al chiamante, che legge in EAX il risultato già calcolato."
    ],
    "introduzione": [
      "La simulazione insegna a leggere un ciclo attraverso il suo stato. EAX funziona da accumulatore, conservando la somma dei termini già elaborati; ECX contiene il prossimo termine e diminuisce a ogni ripetizione. La figura mostra come questi valori evolvano insieme e collega l’uscita al flag ZF aggiornato dal decremento, distinguendola dal controllo iniziale sulla sequenza vuota.",
      "Carica «Contatore iniziale» pari a 4 e avanza con «Passo successivo», annotando EAX ed ECX dopo ogni gruppo ADD, DEC e JNZ. Confronta la somma finale 10 con 4 × 5 / 2. Carica poi zero e osserva il percorso da TEST a RET: l’accumulatore resta zero perché il controllo iniziale riconosce subito l’assenza di termini."
    ],
    "lettura": "EAX è l’accumulatore e ECX è il prossimo termine. Ogni ripetizione di ADD, DEC e JNZ aggiorna entrambi; il percorso di TEST all’ingresso permette di riconoscere subito il caso ECX = 0.",
    "conclusione": "Una traccia di ciclo si comprende distinguendo stato iniziale, corpo ripetuto e condizione di uscita. L’accumulatore contiene la somma dei termini già consumati; ECX indica quelli ancora da aggiungere.",
    "controlli": {
      "n": "Numero iniziale dei termini, da 0 a 8. Il ciclo aggiunge n, n − 1 e così via fino a uno; zero seleziona la sequenza vuota."
    },
    "esperienze": [
      {
        "titolo": "Somma di quattro termini",
        "parametri": {
          "n": 4
        },
        "passi": [
          "Premi «Carica questo caso»: Contatore iniziale = 4. Parti dal primo passo e avanza con «Passo successivo».",
          "In «TEST ECX, ECX» individua il ramo iniziale prima di avanzare.",
          "Se compaiono i passi «ADD, DEC, JNZ», annota EAX ed ECX a ogni ripetizione; al ritorno confronta la somma con n(n+1)/2.",
          "Raggiungi «RET» e confronta i valori finali con il risultato previsto qui sotto. Ricostruisci il passaggio usando gli intermedi appena annotati."
        ],
        "risultato": "Risultato = 10; Controllo n(n+1)/2 = 10.",
        "ragionamento": "Con n = 4, EAX assume in successione 4, 7, 9 e 10 mentre ECX scende a 3, 2, 1 e 0. L’ultimo DEC accende ZF, JNZ termina il ciclo e RET restituisce 10, confermato da 4 × 5 / 2.",
        "attesi": [
          {
            "passo": 6,
            "campo": "Risultato",
            "valore": "10"
          },
          {
            "passo": 6,
            "campo": "Controllo n(n+1)/2",
            "valore": "10"
          }
        ]
      },
      {
        "titolo": "Uscita per la sequenza vuota",
        "parametri": {
          "n": 0
        },
        "passi": [
          "Premi «Carica questo caso»: Contatore iniziale = 0. Parti dal primo passo e avanza con «Passo successivo».",
          "In «TEST ECX, ECX» individua il ramo iniziale prima di avanzare.",
          "Se compaiono i passi «ADD, DEC, JNZ», annota EAX ed ECX a ogni ripetizione; al ritorno confronta la somma con n(n+1)/2.",
          "Raggiungi «RET» e confronta i valori finali con il risultato previsto qui sotto. Ricostruisci il passaggio usando gli intermedi appena annotati."
        ],
        "risultato": "Risultato = 0; Controllo n(n+1)/2 = 0.",
        "ragionamento": "Con n = 0, EAX è già zero e TEST rileva subito ECX nullo. Il corpo viene saltato e RET restituisce 0, coerente con una somma priva di termini.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Controllo n(n+1)/2",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "2.6.5": {
    "scopo": "Una chiamata variadica deve descrivere anche l’uso dei registri vettoriali. Confronta una piccola struttura di due double con una struttura più grande seguita da un double, ricostruendo le sedi degli argomenti e il minimo valido per AL.",
    "teoria": [
      "Una funzione può ricevere più dati raggruppati in una struttura. In un passaggio per valore il chiamante le consegna il contenuto della struttura. La convenzione System V AMD64 decide se collocarlo nei registri oppure nella memoria della pila, considerando dimensioni e tipi dei componenti. Un double rappresenta un numero in virgola mobile e occupa otto byte. I registri XMM possono trasportare questi valori.",
      "La scrittura struct { double x, y; } descrive due componenti chiamati x e y; char s[32] descrive invece trentadue celle da un byte, numerate da s[0] a s[31]. Il puntatore al formato è l’indirizzo del testo con cui il chiamante descrive gli argomenti successivi, ed entra nel registro RDI. «Variadica» significa appunto che tali argomenti possono cambiare in numero e tipo. ABI è il nome dell’accordo binario di chiamata; nella figura MEMORY indica che il contenuto passa nell’area argomenti della pila, mentre AL è la porzione bassa di otto bit del registro RAX.",
      "Qui una coppia di double occupa sedici byte e, quando i registri sono disponibili, i due componenti viaggiano in XMM0 e XMM1. La sigla SSE nella classificazione indica qui due gruppi destinati ai registri vettoriali. Una struttura che racchiude un double e trentadue byte di caratteri occupa invece quaranta byte e viene consegnata interamente in memoria. Un eventuale double successivo riceve il primo registro XMM ancora libero.",
      "La funzione considerata accetta un numero variabile di argomenti dopo quello fisso che descrive il formato. Il chiamante indica in AL, un registro di otto bit, un limite superiore al numero di registri vettoriali usati per gli argomenti. Il minimo consentito si ottiene contando i registri XMM realmente assegnati, inclusi quelli eventualmente occupati dalla struttura."
    ],
    "introduzione": [
      "Questa attività permette di determinare il valore minimo di AL per una chiamata variadica, capace di ricevere argomenti diversi per numero e tipo. La convenzione System V classifica prima le strutture e assegna poi registri o memoria. I riquadri mostrano perché AL debba descrivere i registri vettoriali XMM effettivamente usati, anziché il semplice numero di componenti double, numeri in virgola mobile di otto byte.",
      "Carica la struttura di due double senza argomento successivo e avanza da «Classifica» all’assegnazione delle sedi. Conta XMM0 e XMM1 e confronta il totale con AL minimo = 2. Carica poi la struttura di quaranta byte seguita da un double: osserva la struttura sulla pila e il solo XMM0 occupato, che porta il minimo valido a 1."
    ],
    "lettura": "La figura parte dalla classificazione della struttura, poi mostra l’assegnazione ai registri XMM o alla memoria. Il conteggio finale riguarda i registri vettoriali effettivamente usati dagli argomenti, inclusa l’eventuale struttura.",
    "conclusione": "Il numero di valori in virgola mobile contenuti in una struttura, da solo, è insufficiente a determinare AL. Prima si applicano le regole di passaggio dell’aggregato, poi si contano i registri vettoriali assegnati.",
    "controlli": {
      "typ": "Tipo della struttura passata per valore dopo il puntatore al formato. La coppia di double occupa sedici byte; la struttura con trentadue caratteri ne occupa quaranta.",
      "extra": "Presenza di un ulteriore argomento double dopo la struttura. Il suo registro dipende da quelli già occupati."
    },
    "esperienze": [
      {
        "titolo": "Due double nei registri",
        "parametri": {
          "typ": "pair",
          "extra": "none"
        },
        "passi": [
          "Premi «Carica questo caso»: Argomento dopo il formato = struct { double x, y; }; Argomento successivo = Assente. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Classifica» leggi dimensione e classe prima di contare i registri.",
          "In «Assegna le sedi» individua gli XMM usati, poi verifica il conteggio in «Prepara la CALL variadica»."
        ],
        "risultato": "Registri vettoriali usati = 2; AL minimo = 2.",
        "ragionamento": "La struttura di due double occupa 16 byte ed è classificata SSE, SSE: i due componenti entrano in XMM0 e XMM1. In assenza di altri argomenti vettoriali i registri usati sono due, quindi il minimo valido in AL è 2.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Registri vettoriali usati",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "AL minimo",
            "valore": "2"
          }
        ]
      },
      {
        "titolo": "Struttura in memoria e un double",
        "parametri": {
          "typ": "large",
          "extra": "d"
        },
        "passi": [
          "Premi «Carica questo caso»: Argomento dopo il formato = struct { double x; char s[32]; }; Argomento successivo = Un double. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Classifica» leggi dimensione e classe prima di contare i registri.",
          "In «Assegna le sedi» individua gli XMM usati, poi verifica il conteggio in «Prepara la CALL variadica»."
        ],
        "risultato": "Registri vettoriali usati = 1; AL minimo = 1.",
        "ragionamento": "La struttura di 40 byte passa in memoria e lascia liberi i registri XMM. Il double successivo usa XMM0: il conteggio effettivo è uno e il minimo valido in AL è 1.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Registri vettoriali usati",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "AL minimo",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "2.6.6": {
    "scopo": "Per riconoscere una funzione dal codice occorre seguire ingressi, decisione e punto di riunione dei rami. Confronta due argomenti opposti e ricostruisci il valore restituito dal frammento.",
    "teoria": [
      "Per riconoscere il compito di una funzione si possono seguire il valore che entra, la decisione che divide i percorsi e il numero che entrambi riconsegnano al chiamante. Qui EDI è il registro che porta l’argomento intero con segno. EAX è il registro del risultato. MOV EAX, EDI comincia copiando l’argomento, così che ciascun ramo abbia già a disposizione il numero sul quale operare.",
      "Il contenuto di EDI ed EAX viene mostrato anche in esadecimale, riconoscibile dal prefisso 0x. Su 32 bit il complemento a due rappresenta −7 con 2^32 − 7 = 4294967289, scritto 0xFFFFFFF9; il valore positivo 7 si scrive 0x00000007. Il bit più a sinistra permette di riconoscere il segno in questa interpretazione. Le due scritture descrivono gli stessi bit osservati prima nel registro e poi dal confronto; la funzione lavora qui su interi compresi fra −50 e 50.",
      "CMP EDI, 0 esamina la differenza fra l’argomento e zero. SF copia il bit di segno della differenza, mentre OF segnala se la differenza con segno esce dall’intervallo rappresentabile; in questo confronto OF vale zero. JGE, «salta se maggiore o uguale», prende il ramo finale quando SF e OF coincidono. Con ingresso 7, entrambi valgono zero e la funzione restituisce la copia già presente in EAX. Anche zero segue quel percorso.",
      "Per un ingresso di −7 il programma raggiunge invece NEG EAX. Questa istruzione calcola zero meno il valore conservato e lascia 7 nel registro. Osservando dove i due rami si riuniscono si riconosce il valore assoluto, che per tutti gli ingressi ammessi nel modello è rappresentabile con i 32 bit del risultato."
    ],
    "introduzione": [
      "Ricostruire i due percorsi permette di riconoscere il compito di una funzione dal codice macchina. EDI porta l’argomento ed EAX ne riceve una copia; CMP confronta l’ingresso con zero e JGE seleziona il percorso secondo i flag. La figura mostra dove il dato viene conservato oppure trasformato da NEG, che ne calcola l’opposto, prima della riunione dei rami.",
      "Carica l’argomento −7 e avanza dalla copia al confronto, osservando SF e OF prima di seguire NEG. Usa «Fissa per confronto» e carica +7: il salto raggiunge direttamente la fine e conserva la copia. Confronta le operazioni eseguite con EAX, pari a 7 in entrambi, per riconoscere il valore assoluto nel dominio degli ingressi proposti."
    ],
    "lettura": "EDI contiene l’argomento ed EAX ne riceve una copia. Il confronto con zero divide il percorso fra ritorno diretto e NEG; l’ultimo riquadro mostra il valore ottenuto quando i rami si riuniscono.",
    "conclusione": "Nel dominio consentito, i due percorsi realizzano il valore assoluto. Il ramo negativo applica zero meno l’argomento, mentre quello non negativo conserva la copia iniziale.",
    "controlli": {
      "a": "Argomento con segno fra −50 e 50. Questo intervallo rende sempre rappresentabile il valore assoluto nel risultato a 32 bit."
    },
    "esperienze": [
      {
        "titolo": "Il percorso che esegue NEG",
        "parametri": {
          "a": -7
        },
        "passi": [
          "Premi «Carica questo caso»: Argomento con segno = -7. Parti dal primo passo e avanza con «Passo successivo».",
          "Dopo «MOV EAX, EDI» interpreta i bit della copia con il segno dell’argomento.",
          "In «CMP EDI, 0 / JGE fine» individua il ramo e verifica in «Unione dei percorsi» se è stata eseguita NEG."
        ],
        "risultato": "Operazione = NEG EAX; EAX = 7.",
        "ragionamento": "L’ingresso −7 si scrive 0xFFFFFFF9 su 32 bit. CMP con zero produce SF = 1 e OF = 0, quindi JGE lascia passare verso NEG; zero meno −7 dà EAX = 7.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Operazione",
            "valore": "NEG EAX"
          },
          {
            "passo": 2,
            "campo": "EAX",
            "valore": "7"
          }
        ]
      },
      {
        "titolo": "Il percorso che conserva la copia",
        "parametri": {
          "a": 7
        },
        "passi": [
          "Premi «Carica questo caso»: Argomento con segno = 7. Parti dal primo passo e avanza con «Passo successivo».",
          "Dopo «MOV EAX, EDI» interpreta i bit della copia con il segno dell’argomento.",
          "In «CMP EDI, 0 / JGE fine» individua il ramo e verifica in «Unione dei percorsi» se è stata eseguita NEG."
        ],
        "risultato": "Operazione = nessuna modifica; EAX = 7.",
        "ragionamento": "Con ingresso +7, CMP con zero dà SF = OF = 0 e JGE raggiunge direttamente la fine. EAX conserva la copia 7: il risultato coincide, mentre il percorso eseguito cambia.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Operazione",
            "valore": "nessuna modifica"
          },
          {
            "passo": 2,
            "campo": "EAX",
            "valore": "7"
          }
        ]
      }
    ]
  },
  "2.6.7": {
    "scopo": "La funzione chiamata può usare temporaneamente un registro che deve poi restituire intatto. Segui R12 e la copia salvata per verificare il rispetto della convenzione al ritorno.",
    "teoria": [
      "Durante una chiamata il programma sospende un calcolo, lascia lavorare una funzione e riprende dal punto in cui si era fermato. Può avere ancora bisogno di un numero conservato in un registro, cioè in una piccola memoria interna al processore. La convenzione System V AMD64 stabilisce quali registri la funzione chiamata debba restituire nello stato in cui li aveva trovati. R12 appartiene a questo gruppo.",
      "La funzione riceve R12 con valore 42 e vuole usarlo come temporaneo per 7. Prima di sovrascriverlo copia 42 sulla pila, una zona di memoria organizzata per salvataggi temporanei. Quando il lavoro con 7 è finito, recupera il valore accantonato e lo riscrive in R12.",
      "Il vincolo riguarda il valore visibile al chiamante al momento del ritorno. Per leggere il caso proposto occorre quindi seguire sia il registro, che può cambiare durante la funzione, sia la sede in cui la funzione ha conservato il numero originario."
    ],
    "introduzione": [
      "La ricostruzione chiarisce il significato di un registro preservato dalla convenzione di chiamata. R12 deve tornare al chiamante con il valore d’ingresso, anche quando la funzione lo usa temporaneamente per altri calcoli. Tenere distinta la copia sulla pila dal contenuto corrente del registro rende osservabile come salvataggio e ripristino soddisfino questo accordo al momento del ritorno.",
      "Leggi R12 iniziale pari a 42 e prevedi il valore che il chiamante dovrà ritrovare. Usa «Passo successivo» per raggiungere «Salvare e lavorare», confrontando il 42 accantonato con il 7 temporaneamente scritto nel registro. In «Ripristinare» segui la copia che torna in R12 e verifica che il valore osservabile dal chiamante coincida con quello iniziale."
    ],
    "lettura": "Il diagramma tiene distinta la cella R12 dalla copia accantonata. Durante il lavoro i valori possono differire; prima di RET la copia deve tornare nel registro.",
    "conclusione": "Un registro preservato dalla convenzione può essere utilizzato durante la funzione purché il valore d’ingresso venga restituito al chiamante. La verifica riguarda il momento del ritorno.",
    "procedura": [
      "Leggi R12 iniziale uguale a 42 e il temporaneo 7 richiesto dal chiamato. Prevedi il valore che il chiamante deve ritrovare.",
      "In «Salvare e lavorare» segui la copia di 42 e il nuovo 7 in R12 come due dati separati.",
      "In «Ripristinare» controlla che la copia venga rimessa in R12 prima del ritorno."
    ],
    "risultato": "Quale valore deve poter leggere il chiamante in R12 dopo il ritorno? 42.",
    "ragionamento": "Il chiamante mette 42 in R12. La funzione decide di usare lo stesso registro come temporaneo. Prima dell’uso il chiamato salva 42. Durante il calcolo può scrivere 7 in R12. La convenzione System V AMD64 richiede che R12 torni al valore d’ingresso prima di RET."
  },
  "2.6.8": {
    "scopo": "Avanzare di una sola istruzione permette di collegare il disassemblato allo stato dei registri. Nel caso iniziale calcola separatamente il nuovo RIP e il risultato di LEA.",
    "teoria": [
      "Un programma in esecuzione attraversa posizioni di memoria nelle quali sono scritte le sue istruzioni. RIP è il registro che indica l’istruzione da eseguire. Un debugger sospende il programma e ne permette l’avanzamento di un’istruzione, rendendo visibili indirizzi e registri prima e dopo.",
      "Il disassemblato presenta, per ogni istruzione macchina, l’indirizzo e il nome dell’operazione. Poiché istruzioni diverse possono avere lunghezze diverse, aggiungere sempre uno all’indirizzo porterebbe talvolta dentro l’istruzione appena eseguita.",
      "LEA calcola il numero descritto dalle parentesi e lo scrive nella destinazione: LEA EAX,[RDI+5] somma cinque al dato di partenza e conserva il risultato nei 32 bit di EAX. EDI è la porzione bassa di 32 bit di RDI, quindi il dato 4 produce qui 4 + 5 = 9. Un breakpoint è un punto di arresto del debugger; nel caso si trova all’ingresso f. Gli indirizzi con prefisso 0x sono esadecimali: 0x401083 corrisponde a 4 × 16^5 + 1 × 16^3 + 8 × 16 + 3 = 4198531, lo stesso indirizzo richiesto nel campo numerico.",
      "Il disassemblato colloca LEA EAX, [RDI+5] a 0x401080 e ne specifica la lunghezza di tre byte. Partendo da EDI = 4, l’istruzione porta EAX a 9; RIP avanza invece a 0x401083, dove si trova RET. Il calcolo del dato e l’avanzamento del controllo usano quindi addendi diversi."
    ],
    "introduzione": [
      "L’esercizio iniziale insegna a interpretare un singolo passo macchina distinguendo dati e controllo. Il disassemblato associa ogni istruzione al proprio indirizzo e RIP indica quella che deve ancora essere eseguita. LEA aggiorna EAX attraverso i suoi operandi, mentre l’avanzamento sequenziale di RIP dipende dalla lunghezza dell’istruzione: la ricostruzione permette di verificare separatamente i due effetti.",
      "Premi «Carica l’esempio guidato», inserisci la previsione per «RIP dopo LEA» e registrala. Avanza confrontando l’indirizzo iniziale 0x401080 con la lunghezza di tre byte e lo spiazzamento aritmetico di cinque. Prima di RET, RIP deve indicare 0x401083 ed EAX deve contenere 9: il primo risultato deriva dalla posizione del codice, il secondo dall’argomento 4."
    ],
    "lettura": "Il listato associa ogni istruzione al proprio indirizzo. La ricostruzione segue da un lato il calcolo in EAX e dall’altro il numero di byte necessari a raggiungere RET.",
    "conclusione": "RIP avanza della lunghezza dell’istruzione eseguita quando il flusso prosegue in sequenza. Il valore calcolato da LEA dipende invece dai suoi operandi e va verificato nella destinazione indicata.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per aprire l’esercizio 2 «Seguire una funzione nel debugger», traccia 1. Leggi la consegna e annota i dati iniziali; i risultati illustrati qui si riferiscono a questa traccia.",
      "Prevedi il campo «RIP dopo LEA» e premi «Registra la previsione». Avanza poi nella ricostruzione, collegando ogni passaggio ai dati della consegna.",
      "Al termine controlla tutti i campi richiesti: RIP dopo LEA; EAX dopo LEA. Apri «Apri la prova completa» per inserire anche le risposte successive e verificarne lo svolgimento integrale."
    ],
    "risultato": "Per l’esercizio 2, traccia 1: RIP dopo LEA = 4198531; EAX dopo LEA = 9.",
    "ragionamento": "Un breakpoint su f arresta il programma prima di LEA a 0x401080. L’istruzione utilizza EDI=4 e lo spiazzamento 5; EAX diventa 9. Dopo una singola istruzione RIP punta a RET, all’indirizzo 0x401083. In GDB si può verificare con info registers eax rip."
  },
  "2.6.9": {
    "scopo": "Una funzione può leggere un elemento e affidarne l’elaborazione a un’altra funzione. Segui valore, argomento, risultato e ripristino della pila nel caso iniziale.",
    "teoria": [
      "Una funzione è un tratto di programma al quale si affidano alcuni dati per ottenere un risultato. Perché due funzioni compilate separatamente possano collaborare, devono concordare dove lasciare l’argomento, dove cercare il risultato e come riprendere l’esecuzione dopo la chiamata.",
      "Nella convenzione System V AMD64 qui utilizzata il primo argomento intero di 32 bit viene posto in EDI e un risultato dello stesso tipo viene restituito in EAX. CALL salva sulla pila l’indirizzo a cui proseguire. RET lo recupera quando il lavoro della funzione è terminato.",
      "Un array conserva elementi dello stesso tipo in celle consecutive. Qui ciascun int32 occupa quattro byte e gli indici iniziano da zero: l’indice 2 seleziona il terzo elemento, a 2 × 4 = 8 byte dalla base. RSP è il registro che indica la cima della pila. «8 modulo 16» significa che, dividendo il suo indirizzo per sedici, resta otto; sottrarre otto lo rende quindi multiplo di sedici, come richiede questa chiamata. La riserva temporanea viene liberata aggiungendo gli stessi otto byte dopo il ritorno da doppio.",
      "Nell’array [4, 9, 6, 7], l’elemento di indice 2 vale 6 e si trova otto byte oltre la base. Il chiamante lo deposita in EDI, adegua RSP prima della CALL e riceve 12 da doppio. Dopo aver liberato lo spazio della riserva, il suo RET conserva il risultato in EAX e lo consegna al chiamante esterno."
    ],
    "introduzione": [
      "Lo svolgimento permette di seguire una chiamata interna dall’elemento di array al risultato restituito. Gli int32 occupano quattro byte e la convenzione System V colloca il primo argomento intero in EDI e il risultato in EAX. La ricostruzione affianca questo percorso ai cambiamenti di RSP, mostrando come preparare l’allineamento della pila e liberare poi la riserva temporanea.",
      "Carica l’esempio guidato e avanza dal terzo elemento dell’array, indice 2, al suo caricamento in EDI. Confronta l’offset di otto byte con il valore 6 effettivamente letto. Attraverso CALL doppio segui il risultato 12 in EAX; osserva anche la sottrazione e la successiva aggiunta di otto a RSP, necessarie per ripristinare la pila prima del ritorno esterno."
    ],
    "lettura": "La ricostruzione parte dall’array, porta il valore scelto in EDI e attraversa CALL doppio. EAX segue il risultato, mentre RSP documenta la riserva per l’allineamento e il suo rilascio.",
    "conclusione": "Una chiamata interna deve soddisfare la convenzione per gli argomenti e per la pila. Il risultato restituito in EAX rimane disponibile alla funzione esterna, che in questo frammento lo riconsegna invariato.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per aprire l’esercizio 4 «Dall’array alla chiamata», traccia 1. Leggi la consegna e annota i dati iniziali; i risultati illustrati qui si riferiscono a questa traccia.",
      "Avanza nella ricostruzione con «Passo successivo», fermandoti dopo ogni scrittura o trasformazione. Confronta il dato ottenuto con il passaggio dello svolgimento.",
      "Al termine controlla tutti i campi richiesti: Offset dell’elemento in byte; EAX al ritorno. Apri «Apri la prova completa» per inserire anche le risposte successive e verificarne lo svolgimento integrale."
    ],
    "risultato": "Per l’esercizio 4, traccia 1: Offset dell’elemento in byte = 8; EAX al ritorno = 12.",
    "ragionamento": "Il caricamento usa offset 8 e legge 6. Questo valore entra in EDI, primo argomento intero. SUB RSP,8 rende RSP multiplo di sedici prima di CALL. doppio raddoppia 6 e consegna 12 in EAX. Al rientro il chiamante libera otto byte. Il suo RET conserva EAX, quindi la funzione restituisce 12."
  },
  "2.7.1": {
    "scopo": "Un frame organizza dati locali e informazioni da recuperare al ritorno. Cambia la dimensione dell’area locale per distinguere il riferimento stabile RBP dalla cima mobile RSP.",
    "teoria": [
      "Quando una funzione è in esecuzione, può avere bisogno di spazio per dati che servono soltanto durante quella chiamata. Si chiama frame la porzione di pila impiegata per organizzarli insieme ai salvataggi della funzione. La pila è una regione di memoria la cui cima, in questa architettura, avanza verso indirizzi minori quando si riserva spazio. Il registro RSP contiene l’indirizzo della cima corrente.",
      "All’ingresso della funzione l’indirizzo di ritorno è già stato depositato dalla chiamata. Il prologo, cioè la sequenza di preparazione, esegue PUSH RBP per salvare sulla pila il precedente punto di riferimento. Con MOV RBP, RSP fissa poi il nuovo riferimento in RBP. Nella figura questo punto si trova a 0x8FF0 e l’indirizzo di ritorno occupa gli otto byte che cominciano otto posizioni più avanti.",
      "Riservando un blocco di sedici byte, RSP scende a 0x8FE0 e RBP rimane a 0x8FF0. Si può quindi misurare la dimensione dell’area locale dalla distanza fra i due registri, anche mentre la cima si sposta.",
      "RBP viene chiamato frame pointer perché conserva un indirizzo di riferimento per il frame. PUSH RBP sottrae otto a RSP e scrive in quelle otto celle il precedente contenuto di RBP; MOV RBP,RSP copia poi la nuova cima nel registro di riferimento. L’area locale termina nel byte immediatamente precedente a RBP. Se RBP vale 0x8FF0, l’ultimo byte locale è perciò 0x8FEF; il conteggio fra gli estremi inclusi è RBP − RSP, poiché la cella a RBP appartiene già al salvataggio."
    ],
    "introduzione": [
      "La simulazione aiuta a leggere l’organizzazione di un frame, la porzione di pila usata da una funzione per locali e salvataggi. RSP indica la cima corrente, mentre il prologo fissa in RBP un riferimento stabile. Gli intervalli del disegno mostrano come la riserva dei locali sposti RSP verso indirizzi inferiori lasciando ferme le sedi del vecchio RBP e del ritorno.",
      "Carica quattro blocchi locali da sedici byte e avanza dal salvataggio di RBP alla riserva. Confronta RBP a 0x8FF0 con RSP a 0x8FB0: la distanza misura 64 byte. Ripeti con un blocco e osserva RSP a 0x8FE0. Verifica che l’ultimo byte locale resti 0x8FEF, immediatamente prima della cella destinata al salvataggio."
    ],
    "lettura": "La figura rappresenta la pila con indirizzi e intervalli separati per ritorno, vecchio RBP e dati locali. RBP resta sul punto di riferimento dopo il prologo; RSP scende quando viene riservata l’area locale.",
    "conclusione": "Il frame pointer permette di riferire le posizioni a una base stabile mentre la cima cambia. La struttura mostrata è una convenzione di questo prologo; altre funzioni possono organizzare il proprio frame diversamente.",
    "controlli": {
      "slots": "Numero di blocchi locali da sedici byte da riservare dopo il salvataggio di RBP. Il prodotto 16 × blocchi determina la distanza fra RBP e RSP."
    },
    "esperienze": [
      {
        "titolo": "Un’area locale di 64 byte",
        "parametri": {
          "slots": 4
        },
        "passi": [
          "Premi «Carica questo caso»: Blocchi locali da 16 byte = 4. Parti dal primo passo e avanza con «Passo successivo».",
          "In «PUSH RBP / MOV RBP, RSP» individua il nuovo riferimento e la cella di ritorno.",
          "In «SUB RSP, dimensione» misura la distanza fra RSP e RBP e confrontala con i byte locali dichiarati."
        ],
        "risultato": "RSP = 0x8FB0; Ultimo byte locale = 0x8FEF; Byte locali = 64.",
        "ragionamento": "CALL ha lasciato RSP a 0x8FF8 e il prologo salva RBP otto byte più in basso, a 0x8FF0. Quattro blocchi locali valgono 64 byte: RSP scende a 0x8FB0 e l’ultimo byte locale resta 0x8FEF.",
        "attesi": [
          {
            "passo": 2,
            "campo": "RSP",
            "valore": "0x8FB0"
          },
          {
            "passo": 2,
            "campo": "Ultimo byte locale",
            "valore": "0x8FEF"
          },
          {
            "passo": 2,
            "campo": "Byte locali",
            "valore": "64"
          }
        ]
      },
      {
        "titolo": "Un’area locale di 16 byte",
        "parametri": {
          "slots": 1
        },
        "passi": [
          "Premi «Carica questo caso»: Blocchi locali da 16 byte = 1. Parti dal primo passo e avanza con «Passo successivo».",
          "In «PUSH RBP / MOV RBP, RSP» individua il nuovo riferimento e la cella di ritorno.",
          "In «SUB RSP, dimensione» misura la distanza fra RSP e RBP e confrontala con i byte locali dichiarati."
        ],
        "risultato": "RSP = 0x8FE0; Ultimo byte locale = 0x8FEF; Byte locali = 16.",
        "ragionamento": "Con un solo blocco locale si riservano 16 byte. RBP resta 0x8FF0, mentre RSP diventa 0x8FE0; la cella di ritorno rimane a 0x8FF8 e il confine superiore dell’area locale a 0x8FEF.",
        "attesi": [
          {
            "passo": 2,
            "campo": "RSP",
            "valore": "0x8FE0"
          },
          {
            "passo": 2,
            "campo": "Ultimo byte locale",
            "valore": "0x8FEF"
          },
          {
            "passo": 2,
            "campo": "Byte locali",
            "valore": "16"
          }
        ]
      }
    ]
  },
  "2.7.2": {
    "scopo": "Una copia può superare la capacità del buffer prima di raggiungere altri dati significativi. Conta i byte visitati nel layout mostrato per distinguere il primo sconfinamento dal raggiungimento del contatore e del dato di controllo.",
    "teoria": [
      "Un buffer è una zona riservata a una sequenza di byte. Se la sua capacità è otto, il primo byte occupa la posizione zero e l’ultimo la posizione sette. La quantità da copiare e l’indice dell’ultima cella raggiunta differiscono dunque di uno. Per una copia di lunghezza positiva n, l’ultimo indice visitato è n − 1.",
      "L’offset è la distanza in byte dall’inizio del buffer. Il riempimento, chiamato padding nella figura, è spazio interposto fra gli oggetti del layout; il contatore rappresenta un numero usato dal programma, mentre il dato di controllo rappresenta un’informazione che può influenzarne il percorso, come un indirizzo di ritorno. I nomi servono a distinguere gli effetti possibili di una corruzione. Qui si contano soltanto le celle raggiunte nella disposizione indicata, senza attribuire alla copia un esito ulteriore.",
      "La figura mostra una disposizione concreta di memoria. Agli otto byte del buffer seguono quattro byte di riempimento, poi quattro byte di contatore e infine otto byte di un dato di controllo. Una copia di nove byte raggiunge già il primo byte del riempimento; una di diciassette arriva all’offset 16. In questo secondo caso i nove byte esterni al buffer comprendono quattro posizioni di riempimento, quattro del contatore e una del controllo.",
      "Questo conteggio descrive gli indirizzi del disegno. Nel linguaggio C la scrittura oltre il limite dell’oggetto ha comportamento indefinito, per cui il linguaggio lascia indeterminati gli effetti dell’esecuzione. Il confine da rispettare è quello del buffer, anche quando la cella subito successiva appare libera perché destinata al riempimento."
    ],
    "introduzione": [
      "L’attività permette di riconoscere il primo sconfinamento di una copia e distinguerlo dalle regioni raggiunte in seguito. Un buffer è un oggetto con capacità definita; qui comprende gli offset da zero a sette. Il layout affianca riempimento, contatore e dato di controllo, così da contare le celle coinvolte, ricordando che in C l’accesso oltre l’oggetto ha comportamento indefinito.",
      "Carica nove byte da copiare e avanza fino a «Intervallo di scrittura»: l’ultimo offset è otto, già esterno al buffer. Confronta poi il caso da diciassette byte, il cui ultimo offset è sedici. Nei conteggi finali distingui quattro byte di contatore e un byte di controllo raggiunti; collega ogni quantità ai confini rappresentati, senza attribuire alla copia ulteriori effetti."
    ],
    "lettura": "Le regioni sono disposte per offset crescenti: buffer 0–7, padding 8–11, contatore 12–15 e controllo 16–23. L’intervallo della copia termina a n − 1; le quantità finali contano i byte di ciascuna regione raggiunti.",
    "conclusione": "Il limite valido è quello dell’oggetto di destinazione. Il layout consente di contare gli indirizzi del modello, mentre in C una scrittura fuori dal buffer ha comportamento indefinito anche quando cade nel padding.",
    "controlli": {
      "n": "Numero di byte che la copia tenterebbe di scrivere partendo dall’offset zero. Per n positivo l’ultimo offset raggiunto è n − 1."
    },
    "esperienze": [
      {
        "titolo": "Il primo byte oltre il buffer",
        "parametri": {
          "n": 9
        },
        "passi": [
          "Premi «Carica questo caso»: Byte da copiare = 9. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Layout in ordine di indirizzo» segna i quattro confini.",
          "In «Intervallo di scrittura» confronta n − 1 con quei confini e verifica i conteggi di «Conta i byte per oggetto»."
        ],
        "risultato": "Ultima regione = padding; Byte contatore = 0; Byte di controllo = 0.",
        "ragionamento": "Una copia di 9 byte visita gli offset da 0 a 8. Otto appartengono al buffer e uno al padding: il primo sconfinamento è già all’offset 8, mentre contatore e dato di controllo restano oltre l’intervallo.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Ultima regione",
            "valore": "padding"
          },
          {
            "passo": 2,
            "campo": "Byte contatore",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Byte di controllo",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Raggiungere il dato di controllo",
        "parametri": {
          "n": 17
        },
        "passi": [
          "Premi «Carica questo caso»: Byte da copiare = 17. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Layout in ordine di indirizzo» segna i quattro confini.",
          "In «Intervallo di scrittura» confronta n − 1 con quei confini e verifica i conteggi di «Conta i byte per oggetto»."
        ],
        "risultato": "Ultima regione = dato di controllo; Byte contatore = 4; Byte di controllo = 1.",
        "ragionamento": "Con 17 byte l’ultimo offset è 16. Oltre agli otto byte del buffer si raggiungono quattro byte di padding, quattro di contatore e il primo byte del controllo: i byte esterni al buffer sono nove.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Ultima regione",
            "valore": "dato di controllo"
          },
          {
            "passo": 2,
            "campo": "Byte contatore",
            "valore": "4"
          },
          {
            "passo": 2,
            "campo": "Byte di controllo",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "2.7.3": {
    "scopo": "Una sentinella rileva certe alterazioni prima del ritorno della funzione. Confronta una modifica del byte sorvegliato con una modifica limitata al dato locale per capire quale proprietà viene verificata.",
    "teoria": [
      "Fra le variabili locali di una funzione e le informazioni che serviranno per il ritorno si può collocare una sentinella, ossia una sequenza di byte di cui si conserva un valore atteso. Una scrittura che oltrepassi lo spazio assegnato ai dati potrebbe attraversarla. Controllandola alla fine della funzione si ha allora la possibilità di riconoscere l’alterazione prima di riprendere l’esecuzione nel chiamante.",
      "Nell’esempio tutti i byte della sentinella tranne quello in esame mantengono il proprio valore. Il byte seguito vale inizialmente 0xA6, cioè 166 in decimale. Se la scrittura lo sostituisce con zero, il confronto finale rileva due valori differenti e il controllo passa alla gestione dell’errore.",
      "Una scrittura confinata al dato locale lascia la sentinella uguale al valore atteso. Anche riscrivere esattamente 166 sulla sua cella lascia uguali i contenuti confrontati. La prova riguarda dunque lo stato dei byte al momento della verifica. RET, l’istruzione di ritorno, viene raggiunta lungo il percorso ordinario soltanto quando il confronto ha esito favorevole."
    ],
    "introduzione": [
      "La simulazione chiarisce quale proprietà controlli una sentinella prima del ritorno di una funzione. La sentinella è una sequenza di byte confrontata con un valore atteso per rilevare alterazioni. Nel modello si segue un solo byte, mantenendo invariati gli altri. I riquadri separano questo controllo dallo stato del dato locale, permettendo di osservare la portata precisa della verifica.",
      "Carica la modifica della sentinella con byte sostitutivo zero e avanza dal prologo al confronto finale. Confronta 0x00 con il valore atteso 0xA6 e segui il percorso verso l’errore. Ripeti con «Solo locale»: il dato cambia, mentre la sentinella resta uguale. Osserva l’epilogo ordinario e interpreta l’esito rispetto ai soli byte effettivamente confrontati."
    ],
    "lettura": "Il disegno separa byte atteso, byte salvato e dato locale. Il prologo è la preparazione della funzione, nella quale viene salvata la sentinella; la fase di scrittura evidenzia la regione scelta. Il confronto finale verifica l’uguaglianza della sentinella e decide fra gestore di errore ed epilogo ordinario, cioè la sequenza conclusiva che raggiunge RET.",
    "conclusione": "Il controllo della sentinella osserva l’uguaglianza dei suoi byte al momento della verifica. Un dato locale può risultare alterato pur lasciando superato quel controllo, che riguarda una proprietà specifica della memoria.",
    "controlli": {
      "where": "Regione che riceve la scrittura: il dato locale oppure un byte della sentinella. Gli altri byte della sentinella sono assunti invariati.",
      "value": "Nuovo contenuto del byte selezionato, da 0 a 255. Il byte atteso della sentinella è 0xA6, cioè 166."
    },
    "esperienze": [
      {
        "titolo": "Alterazione della sentinella",
        "parametri": {
          "where": "guard",
          "value": 0
        },
        "passi": [
          "Premi «Carica questo caso»: Regione toccata = Un byte della sentinella; Byte sostitutivo = 0. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Prologo» annota separatamente sentinella e locale.",
          "In «Scrittura simulata» individua il byte cambiato e collega soltanto la sentinella al «Confronto prima del ritorno»."
        ],
        "risultato": "Uguali = no; Percorso = gestore di errore.",
        "ragionamento": "La sentinella attesa contiene 0xA6. Scrivere zero nel byte sorvegliato lascia 0x00 nella copia salvata: il confronto rileva la differenza e seleziona il gestore di errore.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Uguali",
            "valore": "no"
          },
          {
            "passo": 2,
            "campo": "Percorso",
            "valore": "gestore di errore"
          }
        ]
      },
      {
        "titolo": "Alterazione del solo locale",
        "parametri": {
          "where": "local",
          "value": 0
        },
        "passi": [
          "Premi «Carica questo caso»: Regione toccata = Solo locale; Byte sostitutivo = 0. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Prologo» annota separatamente sentinella e locale.",
          "In «Scrittura simulata» individua il byte cambiato e collega soltanto la sentinella al «Confronto prima del ritorno»."
        ],
        "risultato": "Uguali = sì; Percorso = epilogo ordinario.",
        "ragionamento": "Scrivere zero soltanto nel locale cambia 0x31 in 0x00, mentre il byte salvato resta 0xA6. La sentinella coincide con il valore atteso e il percorso ordinario raggiunge RET, benché il dato locale sia cambiato.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Uguali",
            "valore": "sì"
          },
          {
            "passo": 2,
            "campo": "Percorso",
            "valore": "epilogo ordinario"
          }
        ]
      }
    ]
  },
  "2.7.4": {
    "scopo": "RET seleziona una destinazione usando il valore alla cima della pila. Nel modello astratto cambia l’ordine di due blocchi aritmetici e osserva come la sequenza delle destinazioni modifica il risultato.",
    "teoria": [
      "Ogni blocco di istruzioni occupa una posizione in memoria dalla quale il processore può iniziare a eseguirlo. L’istruzione RET preleva dalla cima della pila un indirizzo e lo usa come destinazione. La pila è una sequenza di celle e il registro RSP indica la prima ancora da prelevare. Poiché ogni indirizzo occupa otto byte, dopo un prelievo RSP aumenta di otto.",
      "Nel modello gli indirizzi sono rappresentati con i nomi dei blocchi ai quali conducono. Un blocco aggiunge tre al numero in lavorazione e un altro lo raddoppia. Quel numero si chiama accumulatore perché conserva il risultato di un passaggio e lo offre al successivo. Partendo da 4, sommare tre e poi raddoppiare dà 14. Eseguire prima il raddoppio porta invece a 8, dal quale la somma produce 11.",
      "I blocchi eseguono le stesse operazioni in entrambe le disposizioni. A cambiare è la successione degli indirizzi sulla pila, dalla quale dipende il valore che ogni blocco riceve. La terza voce conduce alla fine e conclude il percorso."
    ],
    "introduzione": [
      "Questo modello astratto permette di comprendere come una sequenza di destinazioni determini l’ordine dei calcoli. RET legge dalla pila la prossima destinazione e RSP avanza di otto byte. Le etichette rappresentano due blocchi, uno che aggiunge tre e uno che raddoppia: l’accumulatore conserva l’uscita di ciascun blocco e la consegna al successivo, rendendo osservabile la composizione delle operazioni.",
      "Carica accumulatore 4 e ordine «Aggiungi 3, poi raddoppia». Avanza con «Passo successivo», confrontando i valori 7 e 14 con le etichette consumate. Ripeti invertendo l’ordine: ottieni prima 8 e poi 11. In entrambi i casi segui l’ultimo RET fino a RSP = 0x9018, distinguendo il risultato aritmetico dal numero di voci prelevate."
    ],
    "lettura": "Le tre voci della pila contengono le etichette dei blocchi da visitare. A ogni RET, RSP avanza di otto byte; l’accumulatore mostra il risultato che il blocco appena eseguito consegna al successivo.",
    "conclusione": "La stessa coppia di operazioni può dare esiti diversi quando cambia l’ordine. Qui la pila di destinazioni determina la composizione dei blocchi; il modello usa etichette astratte per rendere visibile il trasferimento di controllo.",
    "controlli": {
      "order": "Ordine delle due etichette prima di Fine. La scelta cambia quale operazione riceve il valore iniziale.",
      "x": "Numero nell’accumulatore prima del primo blocco. Il secondo blocco userà il risultato già modificato dal primo."
    },
    "esperienze": [
      {
        "titolo": "Aggiungere e poi raddoppiare",
        "parametri": {
          "order": "ad",
          "x": 4
        },
        "passi": [
          "Premi «Carica questo caso»: Ordine delle etichette = Aggiungi 3, poi raddoppia; Accumulatore iniziale = 4. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Pila delle destinazioni» leggi le etichette a partire da 0x9000.",
          "Confronta l’accumulatore di «Primo RET e blocco» con quello di «Secondo RET e blocco»; osserva poi l’ultimo avanzamento di RSP.",
          "Raggiungi «Ultimo RET» e confronta i valori finali con il risultato previsto qui sotto. Ricostruisci il passaggio usando gli intermedi appena annotati."
        ],
        "risultato": "Dopo il secondo blocco l’accumulatore vale 14. RSP = 0x9018; Destinazione = Fine.",
        "ragionamento": "Con accumulatore 4, il primo blocco aggiunge 3 e produce 7; il secondo raddoppia 7 e produce 14. Due RET portano RSP a 0x9010 e il terzo raggiunge Fine con RSP = 0x9018.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Accumulatore",
            "valore": "14"
          },
          {
            "passo": 3,
            "campo": "RSP",
            "valore": "0x9018"
          },
          {
            "passo": 3,
            "campo": "Destinazione",
            "valore": "Fine"
          }
        ]
      },
      {
        "titolo": "Raddoppiare e poi aggiungere",
        "parametri": {
          "order": "da",
          "x": 4
        },
        "passi": [
          "Premi «Carica questo caso»: Ordine delle etichette = Raddoppia, poi aggiungi 3; Accumulatore iniziale = 4. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Pila delle destinazioni» leggi le etichette a partire da 0x9000.",
          "Confronta l’accumulatore di «Primo RET e blocco» con quello di «Secondo RET e blocco»; osserva poi l’ultimo avanzamento di RSP.",
          "Raggiungi «Ultimo RET» e confronta i valori finali con il risultato previsto qui sotto. Ricostruisci il passaggio usando gli intermedi appena annotati."
        ],
        "risultato": "Dopo il secondo blocco l’accumulatore vale 11. RSP = 0x9018; Destinazione = Fine.",
        "ragionamento": "Invertendo i blocchi, il raddoppio iniziale produce 8 e la successiva aggiunta di 3 produce 11. Le tre voci consumate portano ancora RSP a 0x9018: cambia il calcolo dell’accumulatore, mentre il consumo della pila è uguale.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Accumulatore",
            "valore": "11"
          },
          {
            "passo": 3,
            "campo": "RSP",
            "valore": "0x9018"
          },
          {
            "passo": 3,
            "campo": "Destinazione",
            "valore": "Fine"
          }
        ]
      }
    ]
  },
  "2.7.5": {
    "scopo": "La necessità di memoria locale dipende dal lavoro della funzione e dalle chiamate che essa effettua. Confronta una funzione che calcola nei registri con una che deve conservare un temporaneo attraverso un’altra chiamata.",
    "teoria": [
      "Una funzione può custodire un risultato provvisorio in un registro oppure in memoria. La pila offre memoria per la durata della chiamata e il registro RSP ne indica la cima. In un programma utente che segue la convenzione System V AMD64, i 128 byte a indirizzi immediatamente inferiori a RSP formano la red zone. Chi gestisce un segnale asincrono deve rispettare tale area.",
      "Un segnale asincrono è una notifica del sistema operativo che può interrompere il programma fra due istruzioni; il suo gestore deve rispettare la red zone dell’esecuzione interrotta. Questo vincolo riguarda il programma utente e la convenzione indicata. «RSP allineato a sedici» significa che il suo indirizzo è un multiplo di sedici: i 24 byte sottratti alla cima 0x9FF8, che lascia resto otto, conducono a 0x9FE0. Nel caso add_one, RDI contiene l’argomento e LEA RAX,[RDI+1] scrive la somma nel registro RAX destinato al risultato.",
      "Una funzione foglia è una funzione che termina senza chiamarne altre. Se le servono ventiquattro byte provvisori, può impiegare una parte della red zone lasciando RSP fermo. Se le basta sommare uno a un argomento già in un registro, come fa add_one, persino lo spazio temporaneo in memoria diventa superfluo.",
      "Una chiamata interna richiede un’altra scelta per i valori che dovranno sopravviverle. CALL scrive sulla pila l’indirizzo di ritorno e la funzione chiamata può usare a sua volta lo spazio sotto la propria cima. Nel caso con un temporaneo da ventiquattro byte, sottrarre 24 da 0x9FF8 riserva lo spazio e porta RSP a 0x9FE0, un indirizzo multiplo di sedici adatto alla chiamata."
    ],
    "introduzione": [
      "Il confronto permette di capire quando una funzione abbia bisogno di riservare memoria sulla pila. Una funzione foglia termina senza chiamarne altre; in spazio utente System V può usare la red zone, un’area di 128 byte sotto RSP, per temporanei appropriati. La figura distingue il calcolo nei registri dalla riserva necessaria a conservare un dato attraverso una chiamata interna.",
      "Carica «add_one nei registri» con argomento 41 e osserva il risultato 42 e l’assenza di byte locali riservati. Confronta poi «Chiama una funzione» con temporaneo di 24 byte. Avanza fino alla collocazione a 0x9FE0 e al ripristino di RSP a 0x9FF8: collega la riserva alla durata del temporaneo e all’allineamento prima della CALL interna."
    ],
    "lettura": "RSP indica il confine della pila e la regione inferiore mostra lo spazio temporaneo. Nel caso add_one il calcolo rimane in RAX; nei casi con temporaneo la figura distingue l’uso della red zone dallo spazio riservato prima della chiamata.",
    "conclusione": "Una funzione foglia può usare la red zone prevista dalla convenzione System V AMD64 in spazio utente. Un temporaneo che deve sopravvivere a una chiamata interna richiede una riserva adeguata e il rispetto dell’allineamento di RSP.",
    "controlli": {
      "call": "Corpo da simulare: add_one nei registri, funzione foglia con temporaneo oppure funzione che chiama un’altra funzione.",
      "arg": "Intero fornito ad add_one. Negli altri due corpi il percorso studia lo spazio temporaneo e questo valore resta fuori dal calcolo.",
      "n": "Dimensione in byte del temporaneo per i due corpi che lo usano. I valori 8, 24 e 40 consentono di osservare anche l’allineamento prima di CALL."
    },
    "esperienze": [
      {
        "titolo": "Risultato nei registri",
        "parametri": {
          "call": "reg",
          "arg": 41,
          "n": "24"
        },
        "passi": [
          "Premi «Carica questo caso»: Corpo della funzione = add_one nei registri; Argomento (solo per add_one) = 41; Dimensione (solo per i casi con temporaneo) = 24 byte. Parti dal primo passo e avanza con «Passo successivo».",
          "Nel passo iniziale identifica il corpo scelto e la quota d’ingresso di RSP.",
          "Segui la riserva e l’eventuale chiamata, distinguendo l’area temporanea dal dato di ritorno che CALL deposita sulla pila.",
          "Raggiungi «RET» e confronta i valori finali con il risultato previsto qui sotto. Ricostruisci il passaggio usando gli intermedi appena annotati."
        ],
        "risultato": "RAX = 42; RSP = 0xA000.",
        "ragionamento": "add_one riceve 41 e usa LEA per produrre 42 direttamente in RAX. Prima di RET RSP resta 0x9FF8 e i byte locali riservati sono zero; il ritorno preleva otto byte e riporta RSP a 0xA000.",
        "attesi": [
          {
            "passo": 2,
            "campo": "RAX",
            "valore": "42"
          },
          {
            "passo": 2,
            "campo": "RSP",
            "valore": "0xA000"
          }
        ]
      },
      {
        "titolo": "Temporaneo attraverso una chiamata",
        "parametri": {
          "call": "calls",
          "arg": 41,
          "n": "24"
        },
        "passi": [
          "Premi «Carica questo caso»: Corpo della funzione = Chiama una funzione; Argomento (solo per add_one) = 41; Dimensione (solo per i casi con temporaneo) = 24 byte. Parti dal primo passo e avanza con «Passo successivo».",
          "Nel passo iniziale identifica il corpo scelto e la quota d’ingresso di RSP.",
          "Segui la riserva e l’eventuale chiamata, distinguendo l’area temporanea dal dato di ritorno che CALL deposita sulla pila.",
          "Raggiungi «Fine utilizzo» e confronta i valori finali con il risultato previsto qui sotto. Ricostruisci il passaggio usando gli intermedi appena annotati."
        ],
        "risultato": "Chiamata interna = con RSP allineato; RSP = 0x9FF8.",
        "ragionamento": "Il corpo con chiamata deve conservare 24 byte temporanei oltre la chiamata interna. Sottrarre 24 da 0x9FF8 produce 0x9FE0, multiplo di sedici, riservando l’area prima di CALL; al rientro la funzione può liberarla ripristinando la cima d’ingresso.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Chiamata interna",
            "valore": "con RSP allineato"
          },
          {
            "passo": 2,
            "campo": "RSP",
            "valore": "0x9FF8"
          }
        ]
      }
    ]
  },
  "2.7.6": {
    "scopo": "Una pila ombra può conservare una copia protetta dell’indirizzo di ritorno. Confronta l’alterazione della copia ordinaria con quella di un dato locale per individuare l’oggetto verificato da RET.",
    "teoria": [
      "Quando il processore passa a una funzione, deve ricordare l’indirizzo a cui tornare. Normalmente CALL lo deposita sulla pila ordinaria, una zona di memoria che ospita anche dati del programma. Se una scrittura accidentale modifica quell’indirizzo, una semplice lettura dalla pila al momento del ritorno consegnerebbe una destinazione diversa da quella inizialmente salvata.",
      "La tecnologia Intel CET, dedicata alla protezione del flusso di controllo, prevede una seconda pila detta pila ombra. Quando questo meccanismo è attivo, CALL deposita anche lì una copia dell’indirizzo. Le ordinarie scritture del programma sulla pila dei dati lasciano la copia protetta al riparo. RET, prima di accettare la destinazione, confronta i due indirizzi.",
      "Nel caso illustrato la chiamata salva 0x401080. Se alla copia ordinaria si aggiunge uno scarto di otto byte, al ritorno si confrontano 0x401088 e 0x401080. La differenza provoca l’eccezione di protezione #CP. Un cambiamento limitato a una variabile locale lascia invece identiche le due copie e consente la ripresa all’indirizzo salvato.",
      "La CPU, cioè il processore, tratta un’eccezione come un evento che interrompe il percorso ordinario dell’istruzione e consegna il controllo alla gestione prevista dal sistema. La sigla #CP identifica qui l’eccezione di protezione del controllo: una discordanza impedisce a RET di usare l’indirizzo alterato come destinazione. Le variabili locali sono dati impiegati dalla funzione, distinti dagli indirizzi di ritorno. Il confronto delle due copie fornisce quindi una risposta precisa sull’integrità del ritorno, mentre lascia separato lo stato di quei dati."
    ],
    "introduzione": [
      "L’attività permette di comprendere come la pila ombra protegga gli indirizzi di ritorno. Con questo meccanismo attivo, CALL salva una copia ordinaria e una copia protetta; RET le confronta prima di accettare la destinazione. Le due colonne rendono visibile la verifica e permettono di distinguerla dalla conservazione delle variabili locali, che rappresentano dati separati dal ritorno.",
      "Carica la modifica dell’indirizzo ordinario con scarto otto e avanza da CALL alla verifica della CPU. Confronta 0x401088 con la copia protetta 0x401080 e interpreta #CP come l’eccezione che arresta il ritorno ordinario. Ripeti modificando soltanto un dato locale: gli indirizzi coincidono e la ripresa avviene a 0x401080, benché quel dato sia cambiato."
    ],
    "lettura": "Le due colonne rappresentano pila ordinaria e pila ombra. CALL scrive lo stesso indirizzo in entrambe; prima di RET il confronto verifica le due copie, mentre la nota del passo descrive l’eventuale alterazione distinta del dato locale.",
    "conclusione": "La protezione del ritorno controlla la coerenza fra destinazione ordinaria e copia protetta. Un dato locale modificato può lasciare questa coerenza intatta, perciò il meccanismo riguarda il flusso di ritorno e richiede altre difese per gli altri dati.",
    "controlli": {
      "case": "Oggetto modificato prima di RET: nessuno, indirizzo sullo stack ordinario oppure dato locale. La copia ombra resta protetta nel modello.",
      "d": "Scarto in byte aggiunto alla copia ordinaria dell’indirizzo di ritorno quando è selezionata quella modifica."
    },
    "esperienze": [
      {
        "titolo": "Due ritorni discordanti",
        "parametri": {
          "case": "ret",
          "d": 8
        },
        "passi": [
          "Premi «Carica questo caso»: Modifica prima di RET = Indirizzo sullo stack ordinario; Scarto (solo per la modifica dell’indirizzo) = 8. Parti dal primo passo e avanza con «Passo successivo».",
          "Dopo «CALL» verifica l’uguaglianza dei due indirizzi.",
          "In «Stato prima di RET» identifica la modifica, poi collega soltanto le copie del ritorno alla «Verifica della CPU»."
        ],
        "risultato": "Confronto = diverso; Esito = eccezione #CP.",
        "ragionamento": "CALL registra 0x401080 in entrambe le pile. Lo scarto 8 porta la copia ordinaria a 0x401088, mentre quella ombra resta 0x401080; RET rileva la differenza e provoca l’eccezione #CP.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Confronto",
            "valore": "diverso"
          },
          {
            "passo": 2,
            "campo": "Esito",
            "valore": "eccezione #CP"
          }
        ]
      },
      {
        "titolo": "Ritorni uguali e dato alterato",
        "parametri": {
          "case": "data",
          "d": 8
        },
        "passi": [
          "Premi «Carica questo caso»: Modifica prima di RET = Solo un dato locale; Scarto (solo per la modifica dell’indirizzo) = 8. Parti dal primo passo e avanza con «Passo successivo».",
          "Dopo «CALL» verifica l’uguaglianza dei due indirizzi.",
          "In «Stato prima di RET» identifica la modifica, poi collega soltanto le copie del ritorno alla «Verifica della CPU»."
        ],
        "risultato": "Confronto = uguale; Esito = ripresa a 0x401080.",
        "ragionamento": "La modifica del solo dato locale lascia le due copie a 0x401080. Il confronto trova uguaglianza e permette il ritorno a quell’indirizzo, pur mantenendo osservabile il cambiamento del dato locale.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Confronto",
            "valore": "uguale"
          },
          {
            "passo": 2,
            "campo": "Esito",
            "valore": "ripresa a 0x401080"
          }
        ]
      }
    ]
  },
  "2.7.7": {
    "scopo": "Una stringa C richiede spazio anche per il terminatore. Confronta due lunghezze consecutive rispetto a un buffer di otto byte, stabilendo se l’intera copia possa essere eseguita.",
    "teoria": [
      "Il linguaggio C rappresenta una stringa come una successione di byte di testo seguita da un byte di valore zero, chiamato terminatore. Quel segnale di fine occupa una cella anche quando il testo è vuoto. Per decidere se il testo entra in un buffer, cioè in un’area predisposta per riceverlo, bisogna conoscere sia il numero di byte di contenuto sia la capacità effettiva della destinazione.",
      "Una destinazione di otto byte possiede le celle da 0 a 7. Una stringa con sette byte di testo le occupa tutte, poiché i caratteri prendono le prime sette e il terminatore va alla posizione 7. Otto byte di testo collocherebbero invece lo zero alla posizione 8, che è già esterna alla destinazione.",
      "Se il contenuto ha lunghezza n e la capacità vale C, l’indice n del terminatore deve essere strettamente minore di C. La routine controlla questa disuguaglianza prima di iniziare la copia. Quando il controllo fallisce, il conteggio dei byte scritti rimane a zero, compreso il caso di capacità nulla."
    ],
    "introduzione": [
      "La simulazione serve a verificare lo spazio richiesto da una stringa C completa. Oltre ai byte del contenuto, una stringa occupa un byte zero chiamato terminatore, che ne indica la fine. Le celle mostrano perché il suo indice debba restare inferiore alla capacità del buffer e perché il controllo debba precedere l’intera copia, anche quando il contenuto da solo entrerebbe.",
      "Carica capacità otto e contenuto otto, poi avanza confrontando spazio richiesto e indice del terminatore. La posizione otto è esterna agli indici disponibili da zero a sette: osserva la richiesta respinta e zero byte scritti. Carica quindi contenuto sette a pari capacità; il terminatore trova posto nella cella sette e la routine scrive gli otto byte complessivi."
    ],
    "lettura": "Conta le celle da sinistra, assegnando indice zero alla prima. Le caselle piene delimitano il buffer, mentre quelle tratteggiate rappresentano posizioni esterne. La freccia indica la cella richiesta dal terminatore: se ricade oltre la capacità, il modello respinge la richiesta prima di scrivere; se rientra nel buffer, il passo finale mostra d per i byte di contenuto e 0 per il terminatore.",
    "conclusione": "Per una capacità C e n byte di contenuto occorre n < C, perché il terminatore occupa la cella di indice n. Il controllo precede la copia e rende esplicito anche il caso limite in cui il contenuto, da solo, riempirebbe il buffer.",
    "controlli": {
      "cap": "Numero totale di byte disponibili nella destinazione, compreso lo spazio necessario al terminatore.",
      "n": "Numero di byte del contenuto prima del terminatore. La richiesta completa occupa n + 1 byte."
    },
    "esperienze": [
      {
        "titolo": "Spazio esaurito dal contenuto",
        "parametri": {
          "cap": 8,
          "n": 8
        },
        "passi": [
          "Premi «Carica questo caso»: Capacità in byte = 8; Byte di contenuto = 8. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Misura» confronta contenuto, spazio richiesto e capacità.",
          "In «Valuta il limite» verifica l’indice del terminatore, poi controlla decisione e byte scritti in «Applica il controllo»."
        ],
        "risultato": "Decisione = richiesta respinta; Byte scritti = 0.",
        "ragionamento": "Con otto byte di contenuto servono 8 + 1 = 9 celle. Il buffer offre gli indici 0–7, mentre il terminatore richiederebbe l’indice 8: la richiesta è respinta e i byte scritti sono zero.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Decisione",
            "valore": "richiesta respinta"
          },
          {
            "passo": 2,
            "campo": "Byte scritti",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Posto anche per il terminatore",
        "parametri": {
          "cap": 8,
          "n": 7
        },
        "passi": [
          "Premi «Carica questo caso»: Capacità in byte = 8; Byte di contenuto = 7. Parti dal primo passo e avanza con «Passo successivo».",
          "In «Misura» confronta contenuto, spazio richiesto e capacità.",
          "In «Valuta il limite» verifica l’indice del terminatore, poi controlla decisione e byte scritti in «Applica il controllo»."
        ],
        "risultato": "Decisione = copia ammessa; Byte scritti = 8.",
        "ragionamento": "Con sette byte di contenuto servono otto celle. Il terminatore occupa l’indice 7, ancora interno al buffer; il controllo accetta la richiesta e vengono scritti tutti gli otto byte.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Decisione",
            "valore": "copia ammessa"
          },
          {
            "passo": 2,
            "campo": "Byte scritti",
            "valore": "8"
          }
        ]
      }
    ]
  },
  "2.7.8": {
    "scopo": "Una PUSH a 64 bit deve riservare otto byte prima di scrivere il dato. Segui l’indirizzo della nuova cima e la disposizione little-endian del valore.",
    "teoria": [
      "La pila è una zona di memoria in cui si aggiungono e si recuperano valori a partire dalla cima. Il registro RSP contiene l’indirizzo di quella posizione. In una PUSH di un registro a 64 bit il processore riserva otto byte, poiché un byte comprende otto bit. In questa architettura la pila cresce verso indirizzi più piccoli, perciò la riserva si compie sottraendo otto a RSP.",
      "RAX è il registro che contiene il valore da salvare. Gli otto byte della sua parola a 64 bit possono essere scritti come 00 00 00 00 00 00 00 55, dal più significativo al meno significativo. Il formato little-endian deposita per primo il byte meno significativo, cioè quello che contribuisce con peso uno al valore. Tutte le coppie della figura sono esadecimali: 55 indica 5 × 16 + 5 = 85 in decimale, e 0x1000 − 8 equivale a 4096 − 8 = 4088, scritto 0x0FF8.",
      "Prima di PUSH RAX la cima si trova a 0x1000 e il dato a 64 bit vale 0x55. La nuova cima è 0x0FF8, otto byte più in basso. Il formato little-endian colloca 55 a quell’indirizzo; i sette byte superiori, tutti zero, occupano le celle da 0x0FF9 a 0x0FFF.",
      "Per ricostruire l’operazione si calcola prima l’intervallo di memoria occupato dalla parola a 64 bit e poi vi si distribuiscono i byte del dato. La quantità numerica 0x55 richiede un solo byte significativo, mentre PUSH RAX riserva comunque tutti gli otto byte previsti dall’operando."
    ],
    "introduzione": [
      "La ricostruzione permette di comprendere una PUSH separando la riserva di memoria dalla disposizione del dato. RSP indica la cima della pila e PUSH RAX la abbassa di otto byte, quanti ne occupa il registro a 64 bit. Il formato little-endian colloca poi il byte meno significativo all’indirizzo più basso: i passaggi rendono osservabili queste due regole distinte.",
      "Parti da RSP = 0x1000 e RAX = 0x55 e inserisci la previsione per l’indirizzo del byte 55. Avanza fino a «Riservare lo spazio», verificando la nuova cima 0x0FF8. In «Scrivere la parola» confronta il byte significativo con i sette zeri successivi e conta l’intervallo fino a 0x0FFF: l’operando occupa comunque tutti gli otto byte."
    ],
    "lettura": "La prima fase mostra RSP prima della scrittura, la seconda il nuovo intervallo di otto byte. Il byte meno significativo 55 si trova al primo indirizzo dell’intervallo e i sette successivi contengono zero.",
    "conclusione": "La crescita della pila determina l’indirizzo iniziale della scrittura. L’ordine little-endian determina invece la disposizione del valore nei byte già riservati.",
    "procedura": [
      "Parti da RSP = 0x1000 e RAX = 0x55. Sottrai otto per prevedere l’indirizzo del byte 55.",
      "In «Riservare lo spazio» verifica la nuova cima 0x0FF8 prima di distribuire il valore.",
      "In «Scrivere la parola» conta il byte 55 e i sette zeri successivi, controllando l’estremo 0x0FFF."
    ],
    "risultato": "A quale indirizzo si trova il byte 0x55 dopo la push? 0x0FF8.",
    "ragionamento": "RSP vale 0x1000 e RAX contiene il valore a 64 bit 0x55. La pila cresce verso indirizzi inferiori. La push riserva otto byte, quindi RSP passa da 0x1000 a 0x0FF8. Il formato little-endian colloca 55 al primo indirizzo. I sette byte successivi valgono zero."
  },
  "2.7.9": {
    "scopo": "La pila restituisce per primo l’ultimo valore depositato. Nel caso iniziale segui due PUSH e un POP, ricostruendo sia il dato prelevato sia la quota finale di RSP.",
    "teoria": [
      "Si chiama pila una zona di memoria dalla quale l’ultimo elemento depositato è il primo a essere prelevato. Su x86-64 RSP conserva l’indirizzo della cima. Nelle operazioni a otto byte considerate, PUSH riduce RSP di otto e vi deposita il dato, mentre POP legge la cima e fa risalire il puntatore.",
      "La pila serve anche a riservare spazio temporaneo a una funzione. L’istruzione SUB RSP riduce il puntatore e rende disponibile una regione sotto la vecchia cima. Per interpretare una traccia è utile distinguere questa riserva da una PUSH che, oltre a muovere il puntatore, scrive un valore.",
      "RAX e RBX sono i registri sorgente delle due PUSH; RCX è il registro di destinazione del POP. Una scrittura nel registro di destinazione sostituisce il suo contenuto con il valore prelevato. Le parentesi, quando compaiono in [RSP], indicano invece il contenuto della memoria all’indirizzo conservato da RSP. Il bilancio degli spostamenti è −8 − 8 + 8 = −8 byte: dalla cima 0x9000, pari a 36864 in decimale, si arriva a 36856, ossia 0x8FF8.",
      "Con RSP iniziale a 0x9000, PUSH RAX deposita 8 a 0x8FF8 e PUSH RBX deposita 17 a 0x8FF0. POP RCX legge il valore più recente, quindi 17, e fa risalire RSP a 0x8FF8. Il dato 8 resta nella pila alla cima ripristinata."
    ],
    "introduzione": [
      "L’esercizio iniziale permette di ricostruire sia i valori sia gli indirizzi durante depositi e prelievi sulla pila. La regola fondamentale prevede che l’ultimo dato depositato sia il primo recuperato. PUSH riduce RSP di otto byte e scrive alla nuova cima; POP legge quella cima e la fa risalire. Le celle rendono visibile la relazione fra ordine temporale e posizione.",
      "Premi «Carica l’esempio guidato», prevedi «RCX finale» e registra la previsione. Avanza seguendo prima il deposito di 8 a 0x8FF8 e poi quello di 17 a 0x8FF0. Confronta la cella letta da POP con quella rimasta in cima: RCX riceve 17, RSP torna a 0x8FF8 e il valore 8 resta disponibile sulla pila."
    ],
    "lettura": "Le celle seguono gli indirizzi della pila e conservano i valori delle due PUSH. La freccia RSP indica la cella letta da POP; dopo il prelievo la cima torna sul primo valore depositato.",
    "conclusione": "La sequenza dei valori spiega il risultato di POP, mentre il bilancio dei movimenti di otto byte spiega RSP. I due controlli verificano aspetti complementari della traccia.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per aprire l’esercizio 1 «Due push e un pop», traccia 1. Leggi la consegna e annota i dati iniziali; i risultati illustrati qui si riferiscono a questa traccia.",
      "Prevedi il campo «RCX finale» e premi «Registra la previsione». Avanza poi nella ricostruzione, collegando ogni passaggio ai dati della consegna.",
      "Al termine controlla tutti i campi richiesti: RCX finale; RSP finale. Apri «Apri la prova completa» per inserire anche le risposte successive e verificarne lo svolgimento integrale."
    ],
    "risultato": "Per l’esercizio 1, traccia 1: RCX finale = 17; RSP finale = 36856.",
    "ragionamento": "Il primo PUSH scrive 8 a 0x8FF8. Il secondo PUSH scrive 17 a 0x8FF0. RSP indica ora questa cella. POP copia 17 in RCX e riporta RSP a 0x8FF8, dove resta 8."
  },
  "2.7.10": {
    "scopo": "Un prologo deve riservare i dati locali conservando i registri richiesti e l’allineamento della pila. Nel caso iniziale segui il salvataggio di RBX attraverso una chiamata interna fino al ritorno esterno.",
    "teoria": [
      "Ogni funzione usa alcuni registri per i propri calcoli. Le regole di chiamata specificano quali valori essa debba restituire intatti e da quale indirizzo possa effettuare una chiamata successiva. Per liberare temporaneamente un registro, la funzione può salvarne il contenuto sulla pila.",
      "Nella convenzione System V AMD64 il contenuto di RBX va restituito al chiamante. Per le chiamate ordinarie qui considerate, prima di CALL il valore di RSP deve inoltre essere un multiplo di sedici. La riserva per i dati locali si calcola quindi tenendo conto anche degli otto byte già occupati da ciascun salvataggio.",
      "Il prologo prepara la funzione: PUSH RBX sottrae otto al puntatore RSP, che indica la cima della pila, e vi deposita il valore da conservare. Il registro RBX può poi essere usato per il lavoro interno. Al ritorno, ADD RSP,16 libera la riserva locale e POP RBX legge la copia salvata, riportando la cima sull’indirizzo di ritorno esterno. Gli indirizzi sono scritti in esadecimale: 0x8FE0 vale 8 × 4096 + 15 × 256 + 14 × 16 = 36832, un multiplo di sedici perché 36832 / 16 = 2302.",
      "Con RSP d’ingresso a 0x8FF8, PUSH RBX salva il valore 5 a 0x8FF0. La riserva di sedici byte porta RSP a 0x8FE0, multiplo di sedici adatto alla CALL interna. Al rientro la funzione libera i sedici byte, recupera 5 in RBX e ritrova l’indirizzo di ritorno esterno alla posizione originaria."
    ],
    "introduzione": [
      "Lo svolgimento permette di verificare un prologo insieme al ripristino promesso al chiamante. La convenzione System V richiede di preservare RBX e, nel caso illustrato, di allineare RSP a sedici byte prima della chiamata interna. Le regioni della pila distinguono copia del registro, locali e indirizzi di ritorno, così da seguire sia la preparazione sia il recupero nell’ordine corretto.",
      "Carica l’esempio guidato e usa «Passo successivo» per seguire il salvataggio di RBX = 5 e la riserva locale di sedici byte. Confronta RSP prima della CALL, 0x8FE0, con la sede del ritorno interno a 0x8FD8. Al rientro verifica il rilascio della riserva e il recupero di 5 in RBX, prima che RET legga il ritorno esterno."
    ],
    "lettura": "Le aree della pila separano il salvataggio di RBX, i sedici byte locali e gli indirizzi di ritorno delle due chiamate. RSP permette di riconoscere quale elemento verrà recuperato a ogni passaggio.",
    "conclusione": "Il corretto risultato di una funzione comprende il ripristino del contesto promesso al chiamante. I salvataggi e le riserve devono essere recuperati nell’ordine che riporta RSP all’indirizzo di ritorno originario.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per aprire l’esercizio 5 «Salvare RBX e ristabilire l’allineamento», traccia 1. Leggi la consegna e annota i dati iniziali; i risultati illustrati qui si riferiscono a questa traccia.",
      "Avanza nella ricostruzione con «Passo successivo», fermandoti dopo ogni scrittura o trasformazione. Confronta il dato ottenuto con il passaggio dello svolgimento.",
      "Al termine controlla tutti i campi richiesti: RSP immediatamente prima di CALL; RBX restituito al chiamante. Apri «Apri la prova completa» per inserire anche le risposte successive e verificarne lo svolgimento integrale."
    ],
    "risultato": "Per l’esercizio 5, traccia 1: RSP immediatamente prima di CALL = 36832; RBX restituito al chiamante = 5.",
    "ragionamento": "PUSH RBX salva 5 a 0x8FF0. La sottrazione porta RSP a 0x8FE0, multiplo di 16. CALL deposita il proprio ritorno a 0x8FD8. RET della funzione interna ripristina la quota precedente. La funzione libera 16 byte e POP RBX recupera 5. Il RET esterno legge l’indirizzo originario a 0x8FF8."
  },
  "modulo-2": {
    "scopo": "Per elaborare una misura il processore deve prima localizzarla, poi leggerla e infine calcolare il nuovo valore. Segui una cella di matrice attraverso queste tre operazioni, distinguendo gli indirizzi dai dati.",
    "teoria": [
      "Consideriamo una tabella di misure nella quale ogni riga appartenga a una prova e ogni colonna a uno strumento. Per recuperare una misura, noi indichiamo una riga e una colonna. La memoria del calcolatore dispone invece di celle numerate, ciascuna capace di ospitare un byte, cioè otto cifre binarie. Occorre quindi tradurre le due coordinate nell’indirizzo del primo byte della misura cercata.",
      "La matrice dispone in ordine quattro righe di cinque interi. Le coordinate partono da zero e ogni intero occupa quattro byte. Alla posizione [2][3] precedono dieci elementi delle prime due righe e tre della terza, in tutto tredici elementi e quindi cinquantadue byte. Sommandoli alla base 0x3000 si raggiunge 0x3034. LEA calcola questo indirizzo e lo deposita nel registro RDX, una piccola memoria interna del processore.",
      "Le coppie dei byte e gli indirizzi del disegno sono esadecimali: 24 significa 2 × 16 + 4 = 36, mentre 52 byte di spostamento si scrivono 0x34. La lettura little-endian assegna ai quattro byte, nell’ordine degli indirizzi, i pesi 1, 256, 256² e 256³; pertanto 24 00 00 00 rappresenta proprio 36. Le parentesi in MOV EAX,[RDX] indicano l’accesso alla memoria; LEA, invece, forma il numero dell’indirizzo. RSI, RBX e RCX sono registri intermedi: conservano rispettivamente riga, colonna e indice lineare 5r + c.",
      "Per distinguere le celle, il modello assegna a ciascuna il valore 16 × riga + colonna + 1. La cella [2][3] contiene dunque 36. MOV EAX, [RDX] legge i quattro byte 24 00 00 00, con il byte di minor peso per primo, e ricostruisce 36 in EAX. ADD somma la variazione scelta: aggiungendo 4 si ottiene 40. CF segnala il riporto senza segno, ZF un risultato zero, SF copia il bit di segno e OF segnala l’overflow con segno del risultato a 32 bit.",
      "Il risultato aritmetico è conservato su 32 bit. Nella rappresentazione con segno in complemento a due, −32 usa gli stessi bit dell’intero senza segno 2^32 − 32. Aggiungendolo ai 36 letti si ottiene, come somma senza segno, 2^32 + 4: i 32 bit bassi conservano 4 e il bit oltre la larghezza produce CF = 1. Come calcolo con segno, 36 − 32 = 4 rimane nell’intervallo rappresentabile, quindi OF = 0. I parametri del modello mantengono sempre la somma con segno in tale intervallo."
    ],
    "introduzione": [
      "Il laboratorio riunisce indirizzamento, lettura e aritmetica per comprendere come una cella di matrice diventi un risultato nel processore. Ogni elemento occupa quattro byte e gli indici partono da zero. LEA traduce riga e colonna in un indirizzo, MOV ne legge il contenuto e ADD modifica EAX: il percorso rende distinguibili coordinate, posizione in memoria, valore caricato e valore elaborato.",
      "Carica riga 2, colonna 3 e variazione 4, poi avanza dall’indice lineare 13 all’indirizzo 0x3034. Confronta i byte 24 00 00 00 con il valore caricato 36 e il risultato 40. Ripeti con variazione −32 mantenendo la cella: EAX diventa 4 e CF si accende, mentre OF resta zero perché la somma con segno rimane rappresentabile."
    ],
    "lettura": "La matrice 4 × 5 mostra la riga e la colonna selezionate; il percorso porta all’indice lineare, all’indirizzo in RDX e ai quattro byte letti. EAX contiene prima la misura caricata e poi il risultato dell’ADD, affiancato dai flag.",
    "conclusione": "Coordinate, indirizzo, contenuto e risultato sono grandezze distinte. LEA traduce le coordinate in posizione, MOV acquisisce il contenuto e ADD modifica il registro: variare l’addendo cambia l’elaborazione lasciando ferma la cella letta.",
    "controlli": {
      "r": "Indice della riga da 0 a 3. Ogni riga comprende cinque interi da quattro byte e occupa venti byte.",
      "c": "Indice della colonna da 0 a 4. Insieme alla riga determina la cella e il suo valore convenzionale 16r + c + 1.",
      "delta": "Intero con segno aggiunto a EAX dopo il caricamento. L’ADD conserva 32 bit e aggiorna CF, ZF, SF e OF."
    },
    "esperienze": [
      {
        "titolo": "Caricamento e incremento",
        "parametri": {
          "r": 2,
          "c": 3,
          "delta": 4
        },
        "passi": [
          "Premi «Carica questo caso»: Riga (da 0) = 2; Colonna (da 0) = 3; Variazione dopo il caricamento = 4. Parti dal primo passo e avanza con «Passo successivo».",
          "Segui «Forma l’indice lineare» e «Calcola l’indirizzo efficace» separando elementi e byte.",
          "In «Leggi i quattro byte» ricostruisci il contenuto, poi confrontalo con EAX e i flag di «Aggiorna il registro e i flag»."
        ],
        "risultato": "Variazione con segno = 4; EAX = 0x00000028; Valore con segno = 40; CF = 0; ZF = 0; SF = 0; OF = 0.",
        "ragionamento": "La cella [2][3] ha indice lineare 2 × 5 + 3 = 13 e offset 13 × 4 = 52, quindi indirizzo 0x3034. Il suo valore è 16 × 2 + 3 + 1 = 36, letto dai byte 24 00 00 00; aggiungendo 4 si ottiene EAX = 40 = 0x00000028.",
        "attesi": [
          {
            "passo": 4,
            "campo": "Variazione con segno",
            "valore": "4"
          },
          {
            "passo": 4,
            "campo": "EAX",
            "valore": "0x00000028"
          },
          {
            "passo": 4,
            "campo": "Valore con segno",
            "valore": "40"
          },
          {
            "passo": 4,
            "campo": "CF",
            "valore": "0"
          },
          {
            "passo": 4,
            "campo": "ZF",
            "valore": "0"
          },
          {
            "passo": 4,
            "campo": "SF",
            "valore": "0"
          },
          {
            "passo": 4,
            "campo": "OF",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Stessa lettura, variazione negativa",
        "parametri": {
          "r": 2,
          "c": 3,
          "delta": -32
        },
        "passi": [
          "Premi «Carica questo caso»: Riga (da 0) = 2; Colonna (da 0) = 3; Variazione dopo il caricamento = -32. Parti dal primo passo e avanza con «Passo successivo».",
          "Segui «Forma l’indice lineare» e «Calcola l’indirizzo efficace» separando elementi e byte.",
          "In «Leggi i quattro byte» ricostruisci il contenuto, poi confrontalo con EAX e i flag di «Aggiorna il registro e i flag»."
        ],
        "risultato": "Variazione con segno = -32; EAX = 0x00000004; Valore con segno = 4; CF = 1; ZF = 0; SF = 0; OF = 0.",
        "ragionamento": "Riga e colonna restano [2][3], perciò l’indirizzo è ancora 0x3034 e MOV carica 36. ADD con −32 produce 4 = 0x00000004; nella lettura senza segno l’immediato a 32 bit vale 2³² − 32 e genera un riporto, mentre la somma con segno è rappresentabile e lascia OF a zero.",
        "attesi": [
          {
            "passo": 4,
            "campo": "Variazione con segno",
            "valore": "-32"
          },
          {
            "passo": 4,
            "campo": "EAX",
            "valore": "0x00000004"
          },
          {
            "passo": 4,
            "campo": "Valore con segno",
            "valore": "4"
          },
          {
            "passo": 4,
            "campo": "CF",
            "valore": "1"
          },
          {
            "passo": 4,
            "campo": "ZF",
            "valore": "0"
          },
          {
            "passo": 4,
            "campo": "SF",
            "valore": "0"
          },
          {
            "passo": 4,
            "campo": "OF",
            "valore": "0"
          }
        ]
      }
    ]
  }
};
  Object.assign(SL.guide, percorsi);
  for (const [id, guida] of Object.entries(percorsi)) SL.lezioni[id] = guida.teoria;
})();
