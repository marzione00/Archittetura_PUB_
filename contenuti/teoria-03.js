'use strict';

// Guida completa di ogni unità: scopo, teoria, casi, lettura e risultati.
(() => {
  const percorsi = {
  "3.1.1": {
    "scopo": "Tre sensori devono accendere una spia soltanto quando almeno due segnalano una porta aperta. Costruirai la decisione a partire dalle coppie di ingressi, verificando quale ramo del circuito rende vera la maggioranza.",
    "teoria": [
      "Tre sensori sorvegliano la stessa porta. Per accendere una spia si richiede che almeno due segnalino l’apertura. Ciascun sensore comunica un bit, cioè una cifra che può valere 0 oppure 1. Se 1 significa «aperto», il gruppo di tre cifre descrive una situazione precisa. Un elenco di tutte le situazioni con la rispettiva risposta prende il nome di tabella di verità.",
      "Per costruire il circuito basta osservare che, dove esistono due segnalazioni, esiste almeno una coppia di sensori entrambi attivi. Una porta AND realizza questa verifica su due fili, poiché dà 1 soltanto quando entrambi portano 1. Le scritture AB e A·B indicano la stessa operazione AND; AC e BC indicano le altre due coppie. Una porta OR raccoglie i tre esiti e accende la spia appena uno vale 1. Nella formula il simbolo ∨ rappresenta OR: AB ∨ AC ∨ BC riunisce le tre verifiche.",
      "Con A e C attivi e B a zero, il segnale giunge alla spia attraverso il ramo AC. Se si attiva anche B, si aprono altri due percorsi verso la stessa uscita. Le etichette «ingressi alti» contano gli ingressi che valgono 1. La sigla MAJ indica la funzione di maggioranza, la regola che associa ai tre bit il risultato della votazione; si tratta di una funzione booleana perché ingressi e uscita assumono soltanto 0 oppure 1."
    ],
    "introduzione": [
      "La simulazione permette di comprendere come una regola espressa a parole diventi un circuito: la spia deve accendersi quando almeno due sensori segnalano apertura. Ogni sensore fornisce un bit, cioè 0 oppure 1. Le porte AND riconoscono le coppie attive; la porta OR riunisce i loro esiti in un unico segnale di maggioranza.",
      "Carica il caso «Due sensori concordi» e avanza con «Passo successivo», seguendo il ramo AC dalla coppia di ingressi alla spia. Con «Fissa per confronto» conserva il risultato; quindi carica «Un solo sensore attivo». Confronta le tre uscite AND prima della OR: il passaggio della spia da 1 a 0 deve essere spiegato dalla scomparsa dell’ultima coppia attiva."
    ],
    "lettura": "Le tre righe riportano le coppie A·B, A·C e B·C. Ciascun rettangolo AND verifica una coppia; i collegamenti convergono nella OR e nella spia a destra. Una traccia luminosa indica il ramo attivo nel passo mostrato; il punto centrale provvisorio indica un valore ancora da calcolare.",
    "conclusione": "La funzione di maggioranza vale AB OR AC OR BC: basta una coppia attiva per soddisfare la soglia di due sensori. Il conteggio delle coppie spiega la decisione, mentre il bit di uscita esprime soltanto se la soglia è raggiunta.",
    "controlli": {
      "a": "Segnale del primo sensore: 1 indica porta aperta, 0 indica assenza della segnalazione.",
      "b": "Segnale del secondo sensore, interpretato con la stessa convenzione di A.",
      "c": "Segnale del terzo sensore; modificarlo permette di passare da due voti favorevoli a uno."
    },
    "esperienze": [
      {
        "titolo": "Due sensori concordi",
        "parametri": {
          "a": 1,
          "b": 0,
          "c": 1
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: A = 1; B = 0; C = 1.",
          "Parti da «Ingressi» e annota ABC = 101, Ingressi alti = 2.",
          "Avanza a «Porte AND»: calcola separatamente 1 AND 0, 1 AND 1 e 0 AND 1. Individua la sola coppia che può alimentare OR.",
          "Raggiungi «Porta OR» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Porta OR» leggi Uscita = 1, Soglia = 2.",
        "ragionamento": "Con ABC=101 ci sono due ingressi alti. I prodotti AB=0, AC=1 e BC=0 danno 0 OR 1 OR 0=1, quindi la spia soddisfa la soglia due.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Uscita",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Soglia",
            "valore": "2"
          }
        ]
      },
      {
        "titolo": "Un solo sensore attivo",
        "parametri": {
          "a": 1,
          "b": 0,
          "c": 0
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: A = 1; B = 0; C = 0.",
          "Parti da «Ingressi» e annota ABC = 100, Ingressi alti = 1.",
          "Avanza a «Porte AND» e verifica che ciascuna coppia contenga almeno uno zero. Prevedi la spia prima di aprire «Porta OR».",
          "Raggiungi «Porta OR» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Porta OR» leggi Uscita = 0, Soglia = 2.",
        "ragionamento": "Con ABC=100 resta alto soltanto A. Ogni coppia comprende un ingresso zero: i tre AND danno 0 e la loro OR lascia spenta la spia.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Uscita",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Soglia",
            "valore": "2"
          }
        ]
      }
    ]
  },
  "3.1.2": {
    "scopo": "Un sistema riceve quattro parole e deve inoltrarne una sola. Studierai come i due bit di comando dirigono la parola attraverso due livelli di selettori, conservandone il contenuto.",
    "teoria": [
      "Un circuito che debba inviare al calcolatore una di quattro misure riceve quattro dati e un comando che identifica la misura desiderata. Ogni dato è qui una parola di quattro bit, cioè quattro cifre binarie 0 o 1, capace di rappresentare gli interi da 0 a 15. Gli ingressi si chiamano I0, I1, I2 e I3: il numero è la loro posizione, a partire da zero. Per scegliere fra quattro ingressi bastano le quattro combinazioni di due bit.",
      "Il componente che compie la scelta si chiama multiplexer, abbreviato MUX. Nel disegno è costruito con tre selettori a due ingressi. Il bit destro del comando, S0, sceglie il primo o il secondo membro di ciascuna coppia. Il bit sinistro, S1, stabilisce quale coppia raggiunga l’uscita. Il numero del comando vale 2·S1+S0: il bit sinistro pesa due, quello destro pesa uno. Ogni collegamento che trasporta una parola rappresenta quattro fili paralleli, uno per bit; l’intera parola segue la scelta comune.",
      "Con gli ingressi 3, 8, 5 e 13, il comando 2 si scrive 10 in binario. Lo zero lascia passare 3 e 5 al primo livello, mentre l’uno sceglie la seconda coppia. Il valore osservato è dunque la parola 5, della quale il circuito ha trasportato tutti e quattro i bit."
    ],
    "introduzione": [
      "Qui puoi comprendere come un multiplexer trasferisca una parola scelta fra più ingressi. Una parola di quattro bit rappresenta un numero da 0 a 15; il selettore è invece il comando che identifica la sua posizione. Seguendo i due livelli della figura vedrai come S0 scelga entro ciascuna coppia e S1 scelga la coppia destinata all’uscita.",
      "Usa «Carica questo caso» per «Instradare I2» e raggiungi il primo livello con «Passo successivo»: osserva i valori 3 e 5 lasciati passare da S0. Completa il percorso, quindi carica «Instradare I3». Confronta i comandi binari 10 e 11 e le uscite 5 e 13: cambia il membro selezionato nella seconda coppia, mentre la parola mantiene il proprio contenuto."
    ],
    "lettura": "A sinistra compaiono I0…I3, al centro le due coppie e a destra il selettore finale. S0 sceglie un membro di entrambe le coppie; S1 sceglie la coppia che raggiunge l’uscita. Segui la pista evidenziata e confronta il numero trasportato in ciascuna tappa.",
    "conclusione": "Il selettore rappresenta l’indice dell’ingresso da trasferire. La scelta avviene per livelli, mentre tutti i bit della parola selezionata percorrono insieme lo stesso cammino.",
    "controlli": {
      "x0": "Parola di quattro bit collegata a I0, selezionata dal comando 00.",
      "x1": "Parola di quattro bit collegata a I1, selezionata dal comando 01.",
      "x2": "Parola di quattro bit collegata a I2, selezionata dal comando 10.",
      "x3": "Parola di quattro bit collegata a I3, selezionata dal comando 11.",
      "s": "Indice da 0 a 3 dell’ingresso desiderato; la figura lo riscrive come S1 S0 in binario."
    },
    "esperienze": [
      {
        "titolo": "Instradare I2",
        "parametri": {
          "x0": 3,
          "x1": 8,
          "x2": 5,
          "x3": 13,
          "s": 2
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Ingresso I0 = 3; Ingresso I1 = 8; Ingresso I2 = 5; Ingresso I3 = 13; Selettore = 2.",
          "Parti da «Decodifica» e annota S1 S0 = 10, I0… I3 = 3 · 8 · 5 · 13.",
          "In «Primo livello» segui S0=0: devono avanzare I0 e I2. In «Secondo livello» usa S1=1 per scegliere la seconda coppia.",
          "Raggiungi «Secondo livello» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Secondo livello» leggi Ingresso = I2, Uscita = 5.",
        "ragionamento": "Il selettore 2 corrisponde a 10. S0=0 lascia passare 3 e 5, poi S1=1 sceglie 5, il valore collegato a I2.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Ingresso",
            "valore": "I2"
          },
          {
            "passo": 2,
            "campo": "Uscita",
            "valore": "5"
          }
        ]
      },
      {
        "titolo": "Instradare I3",
        "parametri": {
          "x0": 3,
          "x1": 8,
          "x2": 5,
          "x3": 13,
          "s": 3
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Ingresso I0 = 3; Ingresso I1 = 8; Ingresso I2 = 5; Ingresso I3 = 13; Selettore = 3.",
          "Parti da «Decodifica» e annota S1 S0 = 11, I0… I3 = 3 · 8 · 5 · 13.",
          "In «Primo livello» segui S0=1: devono avanzare I1 e I3. In «Secondo livello» conserva S1=1 e osserva la parola che arriva dalla seconda coppia.",
          "Raggiungi «Secondo livello» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Secondo livello» leggi Ingresso = I3, Uscita = 13.",
        "ragionamento": "Il selettore 3 corrisponde a 11. S0=1 lascia passare 8 e 13, poi S1=1 sceglie 13; il cambiamento del bit basso ha selezionato l’altro membro della stessa coppia.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Ingresso",
            "valore": "I3"
          },
          {
            "passo": 2,
            "campo": "Uscita",
            "valore": "13"
          }
        ]
      }
    ]
  },
  "3.1.3": {
    "scopo": "Sommerai due parole di quattro bit seguendo ciascuna colonna. L’obiettivo è ricostruire sia il valore che entra nel registro sia il riporto esterno, distinguendo il risultato memorizzato dal totale matematico.",
    "teoria": [
      "L’unità aritmetico-logica del processore, abbreviata ALU, contiene circuiti per calcoli e operazioni sui bit. Qui si studia il suo sommatore. Nell’addizione in colonna, quando le unità arrivano a dieci si riporta una decina nella colonna successiva. In base due si cambia colonna già al due. Un bit è una cifra 0 o 1; le quattro posizioni di una parola, lette da destra, hanno peso 1, 2, 4 e 8. La parola 0111 rappresenta sette perché sono presenti le unità di peso 1, 2 e 4.",
      "Il circuito assegna a ogni posizione una piccola cella che riceve il bit di ciascun addendo e l’eventuale riporto da destra. Se il totale locale è due, la cella scrive zero e invia uno alla vicina. Se è tre, scrive uno e invia ancora uno. Per questo una posizione può cambiare anche quando entrambi gli addendi vi presentano zero.",
      "Le colonne sono numerate da 0 a 3, partendo da destra: S0 è il bit prodotto nella colonna di peso 1, S3 quello di peso 8. C0 è il riporto iniziale; ciascuna cella consegna il proprio riporto alla colonna successiva. Aggiungendo 1 a 0111, il riporto attraversa tre celle e la parola diventa 1000. C4 esce oltre la quarta posizione e pesa 16. Un registro, piccola memoria di quattro bit, conserva soltanto S3S2S1S0; il totale matematico si ricostruisce aggiungendo a questa parola 16·C4."
    ],
    "introduzione": [
      "L’attività consente di ricostruire una somma binaria e di distinguere la parola conservata dal totale matematico. Ogni colonna combina due bit e il riporto ricevuto dalla colonna precedente. In quattro bit i pesi sono 1, 2, 4 e 8; il riporto esterno C4 pesa 16 e completa il valore che il registro può contenere solo in parte.",
      "Carica «Una somma oltre quattro bit» e usa «Passo successivo» per annotare separatamente ciascun bit Si e il riporto seguente. Alla fine confronta 0100 con il totale 20, ricomponendolo come 4 più 16. Ripeti con «Una catena di riporti interni»: segui il passaggio da 0111 a 1000 e spiega perché diversi riporti interni possono accompagnarsi a C4 uguale a zero."
    ],
    "lettura": "Le quattro celle sono disposte per peso: 8 a sinistra e 1 a destra. In ogni cella leggi i due bit e il riporto entrante; sotto compare Si, mentre Ci+1 prosegue verso la colonna di peso maggiore. Il riporto C4 vale sedici unità.",
    "conclusione": "La parola conservata è il resto della divisione del totale per 16. Il riporto finale permette di ricostruire la parte eccedente: totale = valore della parola + 16·C4.",
    "controlli": {
      "a": "Primo addendo senza segno, da 0 a 15; la figura ne mostra i quattro bit.",
      "b": "Secondo addendo senza segno, allineato per peso al primo.",
      "c": "Bit aggiunto alla colonna delle unità; può rappresentare il riporto proveniente da un gruppo precedente."
    },
    "esperienze": [
      {
        "titolo": "Una somma oltre quattro bit",
        "parametri": {
          "a": 9,
          "b": 11,
          "c": 0
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Parola A = 9; Parola B = 11; Riporto iniziale = 0.",
          "Parti da «Parole a quattro bit» e annota A = 1001, B = 1011, C0 = 0.",
          "Visita in ordine «Colonna 0», «Colonna 1», «Colonna 2», «Colonna 3». Scrivi separatamente ogni Si e il riporto trasmesso, poi leggi S3 S2 S1 S0.",
          "Raggiungi «Risultato» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Risultato» leggi Somma = 0100, C4 = 1, Totale = 20.",
        "ragionamento": "9+11=20. Le somme locali sono 2, 2, 1 e 2: producono S0=0, S1=0, S2=1, S3=0 e C4=1; 0100 vale 4 e 4+16=20.",
        "attesi": [
          {
            "passo": 5,
            "campo": "Somma",
            "valore": "0100"
          },
          {
            "passo": 5,
            "campo": "C4",
            "valore": "1"
          },
          {
            "passo": 5,
            "campo": "Totale",
            "valore": "20"
          }
        ]
      },
      {
        "titolo": "Una catena di riporti interni",
        "parametri": {
          "a": 7,
          "b": 1,
          "c": 0
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Parola A = 7; Parola B = 1; Riporto iniziale = 0.",
          "Parti da «Parole a quattro bit» e annota A = 0111, B = 0001, C0 = 0.",
          "Avanza da «Colonna 0» a «Colonna 3»: segui l’uno di riporto mentre attraversa le tre posizioni basse e raggiunge il peso otto.",
          "Raggiungi «Risultato» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Risultato» leggi Somma = 1000, C4 = 0, Totale = 8.",
        "ragionamento": "7+1=8. Le tre colonne basse sommano due e passano un riporto, mentre la colonna alta riceve 0+0+1 e scrive uno: la parola è 1000 e C4=0.",
        "attesi": [
          {
            "passo": 5,
            "campo": "Somma",
            "valore": "1000"
          },
          {
            "passo": 5,
            "campo": "C4",
            "valore": "0"
          },
          {
            "passo": 5,
            "campo": "Totale",
            "valore": "8"
          }
        ]
      }
    ]
  },
  "3.1.4": {
    "scopo": "Gli stessi operandi alimentano quattro operazioni dell’unità aritmetico-logica. Cambierai il comando per identificare il ramo scelto e interpretare il risultato su un byte, compreso il segnale di zero.",
    "teoria": [
      "Un processore usa spesso gli stessi due numeri per operazioni diverse. Al circuito arrivano perciò due operandi, ossia i dati da elaborare, insieme a un comando che indica l’operazione richiesta. Il componente prende il nome di unità aritmetico-logica, abbreviato ALU. Qui ciascun operando occupa un byte, un gruppo di otto bit.",
      "La somma e la sottrazione combinano le cifre tenendo conto dei riporti o dei prestiti fra posizioni vicine. AND e XOR lavorano invece posizione per posizione. AND scrive uno dove entrambi i bit sono uno, mentre XOR scrive uno dove i due bit differiscono. I quattro risultati candidati giungono al selettore, che collega all’uscita il ramo indicato dal comando.",
      "Con A uguale a 3 e B uguale a 1, le ultime cifre sono rispettivamente 11 e 01. L’AND restituisce 1 e lo XOR restituisce 2. Il prefisso 0x introduce la scrittura in base sedici, perciò questi byte appaiono come 0x01 e 0x02. Il segnale ZF, indicatore di zero, si accende soltanto se l’intero byte selezionato vale zero.",
      "Otto bit offrono 256 configurazioni. Per mantenere questa larghezza, somma e differenza conservano il resto modulo 256, cioè la configurazione ottenuta dopo aver aggiunto o sottratto multipli di 256. Per B−A=1−3=−2 si ottiene quindi 254, scritto 0xFE. Se la parola è interpretata con segno secondo il complemento a due, un valore senza segno da 128 a 255 si legge sottraendogli 256: lo stesso 0xFE rappresenta così −2. Il selettore instrada questi otto bit e ZF verifica se sono tutti zero."
    ],
    "introduzione": [
      "La simulazione permette di comprendere il ruolo del comando nell’unità aritmetico-logica, o ALU. Gli stessi operandi, cioè i dati del calcolo, alimentano quattro rami; un selettore porta all’uscita il risultato richiesto. Ogni parola occupa otto bit, detti byte, e il segnale ZF indica se tutti i bit della parola selezionata valgono zero.",
      "Carica «Scegliere la somma» e avanza fino ai risultati candidati, confrontando i quattro rami prima della selezione finale. Conserva l’esito con «Fissa per confronto», poi carica «Scegliere una differenza negativa». Osserva l’ordine B − A: 1 − 3 produce il byte 0xFE. Il prefisso 0x indica la base sedici; gli otto bit rappresentano 254 senza segno oppure −2 in complemento a due."
    ],
    "lettura": "Le parole A e B entrano da sinistra e alimentano i quattro rami. Nel passo centrale compaiono tutti i risultati candidati; il collegamento evidenziato conduce quello selezionato all’uscita. ZF riassume se gli otto bit finali sono tutti zero.",
    "conclusione": "Il comando dell’ALU seleziona una funzione sugli stessi ingressi. Il risultato occupa otto bit, quindi somme e differenze sono rappresentate modulo 256; ZF dipende dalla parola effettivamente selezionata.",
    "controlli": {
      "a": "Operando A su otto bit; nella sottrazione è il valore sottratto a B.",
      "b": "Operando B su otto bit; nella sottrazione è il valore da cui si parte.",
      "f": "Operazione che il selettore porterà all’uscita, fra somma, differenza, AND e XOR."
    },
    "esperienze": [
      {
        "titolo": "Scegliere la somma",
        "parametri": {
          "a": 3,
          "b": 1,
          "f": "add"
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Operando A = 3; Operando B = 1; Funzione = Somma B + A.",
          "Parti da «Decodifica» e annota Controllo = 0, A = 0x03, B = 0x01.",
          "In «Risultati candidati» confronta 0x04, 0xFE, 0x01 e 0x02. Prevedi quale parola verrà scelta dal comando Somma.",
          "Raggiungi «Uscita selezionata» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Uscita selezionata» leggi Risultato = 0x04, ZF = 0.",
        "ragionamento": "Il ramo aritmetico somma B+A=1+3=4, rappresentato da 0x04. Almeno un bit della parola è uno e il rilevatore di zero lascia ZF=0.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "0x04"
          },
          {
            "passo": 2,
            "campo": "ZF",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Scegliere una differenza negativa",
        "parametri": {
          "a": 3,
          "b": 1,
          "f": "sub"
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Operando A = 3; Operando B = 1; Funzione = Differenza B − A.",
          "Parti da «Decodifica» e annota Controllo = 1, A = 0x03, B = 0x01.",
          "In «Risultati candidati» ricava 1−3 e riscrivilo su otto bit. Poi segui il ramo Differenza fino a «Uscita selezionata».",
          "Raggiungi «Uscita selezionata» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Uscita selezionata» leggi Risultato = 0xFE, ZF = 0.",
        "ragionamento": "B−A=1−3=−2. Su otto bit il resto modulo 256 è 254, cioè 0xFE; in complemento a due questa stessa parola significa −2 e ZF resta 0.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Risultato",
            "valore": "0xFE"
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
  "3.1.5": {
    "scopo": "Due rami logici convergono in una porta OR. Individuerai quale arrivo limita il tempo di stabilizzazione e come cambia il ritardo complessivo quando il ramo inizialmente più veloce diventa il più lento.",
    "teoria": [
      "Quando cambia la tensione su un ingresso, i componenti attraversati dal segnale impiegano un breve intervallo per portare l’uscita al livello previsto. Questo intervallo si chiama ritardo di propagazione. Un picosecondo, abbreviato ps, è un millesimo di miliardesimo di secondo. A questa scala anche la scelta del percorso incide sul momento in cui un risultato si può leggere con sicurezza.",
      "Nel ramo AND la porta verifica che due ingressi siano entrambi attivi. Nel ramo XOR verifica che siano diversi. Le due valutazioni cominciano insieme e raggiungono una porta OR, la cui uscita indica se almeno una verifica è riuscita. Per garantire il risultato in ogni combinazione occorre attendere il più lento dei due rami e poi concedere alla OR il suo tempo di risposta.",
      "Se AND richiede 30 ps, XOR 65 ps e OR 20 ps, il limite è 85 ps. Portare AND a 50 ps lo lascia invariato, poiché XOR arriva ancora per ultima. Le barre rendono visibile il cammino critico, cioè il percorso che determina il limite complessivo.",
      "Il valore finale misura il tempo della sola rete di porte. Se l’uscita dovesse essere acquisita da un registro, cioè da una memoria aggiornata a un fronte del clock, dovrebbe essere stabile anche per un intervallo prima di quel fronte. Questo anticipo richiesto si chiama setup e andrebbe aggiunto separatamente. Le barre dell’esperimento consentono dunque di verificare l’arrivo del segnale, dal quale parte l’eventuale verifica del registro ricevente."
    ],
    "introduzione": [
      "Questo esperimento serve a individuare il cammino critico, ossia il percorso che fissa il tempo massimo necessario alla stabilizzazione dell’uscita. I rami AND e XOR lavorano contemporaneamente e confluiscono nella OR. Le barre temporali rendono osservabile la regola: si attende il ramo più lento e si aggiunge il ritardo della porta comune, misurato in picosecondi.",
      "Carica «Il limite è nel ramo XOR» e avanza con «Passo successivo», confrontando gli arrivi a 30 e 65 ps prima di aggiungere i 20 ps della OR. Fissa gli 85 ps per confronto e carica «Il limite passa al ramo AND». Spiega il nuovo totale di 110 ps attraverso il ramo da 90 ps, distinguendo i ritardi in parallelo da quello successivo."
    ],
    "lettura": "Le barre AND e XOR iniziano entrambe al tempo zero. La loro estremità indica quando ciascun segnale raggiunge OR; il tratto conclusivo aggiunge il ritardo della porta comune. Leggi i tempi in picosecondi sulla stessa scala.",
    "conclusione": "Per rami paralleli seguiti da una porta comune, il limite è max(ritardo AND, ritardo XOR)+ritardo OR. Il cammino critico può cambiare quando si modifica un componente; il modello rappresenta i ritardi massimi dichiarati.",
    "controlli": {
      "and": "Tempo massimo di propagazione del ramo AND, in picosecondi.",
      "xor": "Tempo massimo di propagazione del ramo XOR, avviato contemporaneamente ad AND.",
      "or": "Tempo massimo aggiuntivo della porta finale, dopo l’arrivo più tardivo."
    },
    "esperienze": [
      {
        "titolo": "Il limite è nel ramo XOR",
        "parametri": {
          "and": 30,
          "xor": 65,
          "or": 20
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Ritardo AND (ps) = 30; Ritardo XOR (ps) = 65; Ritardo OR (ps) = 20.",
          "Parti da «Variazione degli ingressi» e annota Ramo sinistro = AND, Ramo destro = XOR.",
          "In «Arrivo ai due ingressi OR» confronta 30 ps e 65 ps. Aggiungi i 20 ps della porta finale soltanto all’arrivo più tardivo.",
          "Raggiungi «Uscita stabile» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Uscita stabile» leggi Cammino critico = XOR → OR, Ritardo massimo (ps) = 85.",
        "ragionamento": "I due rami lavorano in parallelo e l’arrivo peggiore è 65 ps. La OR aggiunge 20 ps, perciò il limite complessivo è 85 ps sul cammino XOR→OR.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Cammino critico",
            "valore": "XOR → OR"
          },
          {
            "passo": 2,
            "campo": "Ritardo massimo (ps)",
            "valore": "85"
          }
        ]
      },
      {
        "titolo": "Il limite passa al ramo AND",
        "parametri": {
          "and": 90,
          "xor": 65,
          "or": 20
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Ritardo AND (ps) = 90; Ritardo XOR (ps) = 65; Ritardo OR (ps) = 20.",
          "Parti da «Variazione degli ingressi» e annota Ramo sinistro = AND, Ramo destro = XOR.",
          "In «Arrivo ai due ingressi OR» confronta 90 ps e 65 ps. Identifica il nuovo ramo critico prima di aprire «Uscita stabile».",
          "Raggiungi «Uscita stabile» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Uscita stabile» leggi Cammino critico = AND → OR, Ritardo massimo (ps) = 110.",
        "ragionamento": "L’AND richiede ora 90 ps e supera il ritardo XOR di 65 ps. La stabilizzazione garantita si sposta a 90+20=110 ps e il cammino critico diventa AND→OR.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Cammino critico",
            "valore": "AND → OR"
          },
          {
            "passo": 2,
            "campo": "Ritardo massimo (ps)",
            "valore": "110"
          }
        ]
      }
    ]
  },
  "3.1.6": {
    "scopo": "Interpreterai una somma di byte sia senza segno sia in complemento a due. Il confronto tra due casi chiarirà perché riporto CF e overflow OF rispondono a domande aritmetiche differenti.",
    "teoria": [
      "Un sommatore che conserva otto cifre binarie dispone di 256 configurazioni. Se le si interpreta come interi senza segno, rappresentano i numeri da 0 a 255. Con la convenzione chiamata complemento a due, la cifra più a sinistra ha peso −128 e le altre conservano i pesi da 1 a 64. Le stesse otto cifre rappresentano allora i numeri da −128 a 127.",
      "Sommando 127 e 1 si ottiene 10000000. Il numero 128 entra nell’intervallo senza segno, sicché il riporto oltre l’ottava posizione, indicato da CF, vale zero. Letta con segno, però, quella parola significa −128, mentre la somma di due numeri positivi darebbe +128. L’indicatore di superamento dell’intervallo con segno, OF, vale quindi uno.",
      "La figura divide la parola in due gruppi di quattro bit. Il gruppo basso, che comprende i pesi da 1 a 8, produce il riporto C4 diretto al gruppo alto. Per il gruppo alto G vale 1 quando la somma dei suoi due valori supera 15, generando un riporto anche con C4=0. P vale 1 quando in ciascuna delle sue quattro posizioni i bit degli addendi differiscono: lo XOR, che vale 1 per bit diversi, restituisce allora 1111. In questa situazione un riporto ricevuto dal basso attraversa tutto il gruppo.",
      "Il riporto finale segue la regola G OR (P AND C4). AND richiede che entrambe le condizioni valgano 1, mentre OR richiede che almeno una sia vera: il gruppo alto può quindi generare il riporto oppure propagare quello ricevuto. Questo risultato coincide con CF, l’indicatore di riporto fuori dalla parola. OF descrive invece il superamento dell’intervallo con segno. Il confronto fra i due indicatori permette di usare la stessa somma di bit nelle due interpretazioni numeriche."
    ],
    "introduzione": [
      "La simulazione aiuta a interpretare separatamente riporto e overflow nella stessa addizione. CF segnala un riporto oltre gli otto bit nella lettura senza segno; OF segnala il superamento dell’intervallo da −128 a 127 nella lettura con segno. La figura collega questi indicatori alla parola ottenuta e al passaggio del riporto fra due gruppi di quattro bit.",
      "Carica «Overflow con segno senza riporto finale» e avanza dalla doppia lettura degli operandi alla verifica conclusiva. Confronta il totale 128 con la parola interpretata come −128. Poi carica il caso con A=255 e B=1: osserva CF=1 e OF=0, spiegando il risultato mediante 255+1 senza segno e −1+1 con segno. La stessa configurazione di bit acquista significato dalla convenzione scelta."
    ],
    "lettura": "Le righe A, B e S mostrano otto bit, separati in due gruppi di quattro. A destra CF riguarda il nono bit e OF l’intervallo con segno. La riga C4, G, P spiega il passaggio del riporto dal gruppo basso a quello alto.",
    "conclusione": "CF segnala che il totale senza segno richiede un nono bit; OF segnala che il totale con segno supera l’intervallo da −128 a 127. La stessa parola risultante va interpretata insieme alla convenzione numerica scelta.",
    "controlli": {
      "a": "Configurazione del primo byte, introdotta come numero da 0 a 255; da 128 in su rappresenta un valore negativo in complemento a due.",
      "b": "Configurazione del secondo byte, letta con entrambe le convenzioni nella prima tappa."
    },
    "esperienze": [
      {
        "titolo": "Overflow con segno senza riporto finale",
        "parametri": {
          "a": 127,
          "b": 1
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Operando A = 127; Operando B = 1.",
          "Parti da «Due letture» e annota A senza / con segno = 127 / 127, B senza / con segno = 1 / 1.",
          "In «Somma estesa» separa il nono bit dagli otto inferiori. In «Riporto per gruppi» osserva C4; in «Verifica con segno» confronta 128 con il massimo 127.",
          "Raggiungi «Verifica con segno» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Verifica con segno» leggi Somma matematica = 128, Lettura del risultato = -128, OF = 1.",
        "ragionamento": "127+1=128 rientra nell’intervallo senza segno, quindi CF=0. In complemento a due +128 supera 127 e la parola 0x80 viene letta come −128: OF=1.",
        "attesi": [
          {
            "passo": 3,
            "campo": "Somma matematica",
            "valore": "128"
          },
          {
            "passo": 3,
            "campo": "Lettura del risultato",
            "valore": "-128"
          },
          {
            "passo": 3,
            "campo": "OF",
            "valore": "1"
          },
          {
            "passo": 1,
            "campo": "CF",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Riporto finale con somma con segno rappresentabile",
        "parametri": {
          "a": 255,
          "b": 1
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Operando A = 255; Operando B = 1.",
          "Parti da «Due letture» e annota A senza / con segno = 255 / -1, B senza / con segno = 1 / 1.",
          "In «Due letture» riconosci che 255 rappresenta −1 con segno. Segui CF in «Somma estesa» e confronta la somma matematica con OF nell’ultima tappa.",
          "Raggiungi «Verifica con segno» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Verifica con segno» leggi Somma matematica = 0, Lettura del risultato = 0, OF = 0.",
        "ragionamento": "255+1=256 richiede il nono bit, quindi il byte conservato è 0x00 e CF=1. Con segno gli operandi sono −1 e +1, la somma è zero rappresentabile e OF=0.",
        "attesi": [
          {
            "passo": 3,
            "campo": "Somma matematica",
            "valore": "0"
          },
          {
            "passo": 3,
            "campo": "Lettura del risultato",
            "valore": "0"
          },
          {
            "passo": 3,
            "campo": "OF",
            "valore": "0"
          },
          {
            "passo": 1,
            "campo": "CF",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "3.1.7": {
    "scopo": "Ricostruirai una somma binaria completa senza saltare il passaggio fra le colonne. Il problema serve a spiegare come una parola di quattro bit possa accompagnarsi a un riporto che conserva una parte essenziale del totale.",
    "teoria": [
      "Quattro posizioni binarie contengono le unità, le coppie, i gruppi di quattro e quelli di otto. Per sommare due parole si allineano le posizioni di uguale peso. Si comincia da destra perché un’unità che avanza dalla prima colonna può contribuire alla seconda, e da lì a tutte quelle successive.",
      "Si consideri 1001 + 1011. Nella colonna delle unità, 1 + 1 produce due unità, che diventano una coppia: la cifra scritta è zero e la colonna successiva riceve uno di riporto. Nella seconda colonna si sommano allora 0, 1 e quel riporto. Anche qui si scrive zero e si trasmette uno, che la terza colonna somma ai suoi due zeri.",
      "Tenere separati sul foglio il bit scritto e il riporto permette di controllare ciascuna cella prima di proseguire. Alla fine si leggono i quattro bit scritti dal peso otto al peso uno. Un eventuale riporto oltre la quarta posizione si aggiunge solo quando si vuole ricostruire il totale matematico."
    ],
    "introduzione": [
      "Il problema svolto permette di controllare una somma binaria sia colonna per colonna sia attraverso il suo valore complessivo. I simboli S indicano i bit scritti, mentre i simboli C indicano i riporti verso il peso successivo. Ricostruendo 1001+1011 vedrai perché il registro a quattro bit conserva solo una parte del totale.",
      "Scrivi la previsione nel campo «Quali quattro bit rimangono nel registro?» e premi «Passo successivo». Nei passaggi sulle colonne annota ogni coppia somma–riporto, quindi confronta la parola 0100 con il totale 10100. Usa «Precedente» per rintracciare il riporto esterno e «Ricomincia il percorso» per verificare nuovamente che i quattro bit conservati, insieme a 16·C4, ricostruiscano 20."
    ],
    "lettura": "Le colonne hanno peso 1, 2, 4 e 8 e sono numerate da 0, a destra, fino a 3. S0…S3 sono i bit scritti; C1…C4 sono i riporti diretti alla posizione successiva. Ricostruisci ciascuna somma locale con i due addendi e il riporto ricevuto. Leggi poi S3S2S1S0 come parola di quattro bit e aggiungi 16·C4 per controllare il totale 20.",
    "conclusione": "La somma binaria si controlla localmente colonna per colonna e globalmente ricostruendo il valore numerico. In quattro bit il riporto esterno pesa 16, mentre il registro conserva le sole quattro posizioni inferiori.",
    "procedura": [
      "Leggi i «Dati iniziali»: Somma 1001 e 1011 come interi senza segno. Il registro ha quattro bit e il riporto in ingresso alla colonna 0 vale zero.",
      "Scrivi una previsione per «Quali quattro bit rimangono nel registro?». Conservala mentre inizi la ricostruzione con «Passo successivo».",
      "Nei passaggi «Colonne 0 e 1» e «Colonne 2 e 3» annota separatamente i bit scritti e i riporti. Ricomponi S3 S2 S1 S0 prima della «Rilettura».",
      "Raggiungi «Rilettura» e confronta la previsione con i valori finali. Usa «Ricomincia il percorso» per ripetere i passaggi con il ragionamento ormai completo."
    ],
    "risultato": "La risposta alla previsione è 0100. Il totale completo è 10100, pari a 20. Nel registro a quattro bit rimangono 0100.",
    "ragionamento": "1001 vale 9 e 1011 vale 11. Le colonne producono S0=0, S1=0, S2=1 e S3=0, con C4=1: il registro contiene 0100=4 e il totale completo è 16+4=20."
  },
  "3.1.8": {
    "scopo": "Tradurrai la regola di maggioranza in operazioni sui bit e ne seguirai i risultati nei registri. L’esempio collega la porta logica alla sequenza di istruzioni che realizza la stessa decisione.",
    "teoria": [
      "Una votazione fra tre segnali può essere affidata a un circuito, attribuendo a ciascun voto il valore 1 per il sì e 0 per il no. La maggioranza è raggiunta quando almeno una coppia di voti vale 1. Una porta AND riconosce una coppia concorde sul sì, mentre una porta OR riunisce i risultati delle diverse coppie.",
      "Scrivere AB significa qui prendere la AND fra i segnali di A e di B. Le tre coppie AB, AC e BC esauriscono i modi di trovare due voti favorevoli su tre. Quando tutti votano sì, le coppie favorevoli diventano tre e l’uscita complessiva resta una sola cifra uno.",
      "Con A e C a 1 e B a 0, soltanto la coppia AC vota sì all’unanimità. Il segnale che esce da quella porta basta ad attivare l’uscita complessiva. Il programma riproduce lo stesso ragionamento sui bit e raccoglie la decisione nel registro EAX.",
      "Nel listato i registri sono piccole memorie interne: EDI contiene A, ESI contiene B ed EDX contiene C. Le istruzioni usano la sintassi Intel, nella quale il primo operando indica la destinazione. MOV copia il secondo operando nel primo; AND e OR aggiornano il primo applicando la rispettiva regola a ciascuna coppia di bit. I tre prodotti vengono conservati in EAX, ECX ed ESI, poi riuniti in EAX. Il conteggio delle coppie attive richiesto dal quesito si ricava sommando i tre esiti AND; il listato restituisce il solo bit di maggioranza."
    ],
    "introduzione": [
      "Questa esercitazione permette di riconoscere la stessa funzione di maggioranza nel circuito e nel programma. AND verifica se due bit valgono entrambi uno; OR raccoglie gli esiti in un solo bit. I registri, piccole memorie interne indicate da nomi come EAX, conservano i risultati intermedi. Il numero delle coppie attive e la decisione finale descrivono due informazioni distinte.",
      "Premi «Carica l’esempio guidato», calcola AB, AC e BC per 1, 0 e 1 e compila «Coppie attive». Dopo «Registra la previsione», avanza con «Passo successivo» e confronta i prodotti con il valore di EAX. Segui le copie nei registri prima delle operazioni OR: il solo prodotto AC vale uno, perciò basta a determinare l’uscita anche quando gli altri due valgono zero."
    ],
    "lettura": "La ricostruzione mostra i tre prodotti AB, AC e BC e la loro riunione tramite OR. I nomi EAX, ECX ed ESI indicano registri di lavoro, cioè piccole memorie interne usate per conservare gli esiti intermedi.",
    "conclusione": "Il circuito e il programma possono realizzare la stessa funzione booleana. Il numero di coppie attive e il bit di maggioranza esprimono informazioni diverse, ricavabili dagli stessi prodotti.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 1, «Programmare la maggioranza di tre bit», traccia 1. La spiegazione numerica seguente riguarda questa combinazione.",
      "Per A=1, B=0 e C=1 scrivi le tre coppie AB, AC e BC. Conta quante danno uno prima di prevedere il valore restituito in EAX.",
      "Compila la previsione per «Coppie attive» e premi «Registra la previsione». Poi avanza con «Passo successivo» per verificare il procedimento, anche se la risposta iniziale richiede una correzione.",
      "Confronta i campi del risultato con lo svolgimento. Per rispondere a tutti i quesiti, apri «Apri la prova completa»; con i selettori Esercizio e Traccia puoi poi scegliere altri dati."
    ],
    "risultato": "Per l’esercizio 1, traccia 1, i risultati sono: Coppie attive = 1; EAX = 1.",
    "ragionamento": "AB=1 AND 0=0, AC=1 AND 1=1 e BC=0 AND 1=0. Esiste una sola coppia attiva; l’OR 0 OR 1 OR 0 vale 1, che il listato conserva in EAX."
  },
  "3.1.9": {
    "scopo": "Seguirai i flag prodotti da una somma su otto bit. Il risultato servirà a collegare zero, segno e overflow alle operazioni SETcc che trasformano ciascuna condizione in un byte.",
    "teoria": [
      "Per eseguire un’addizione su un byte, il processore mette a disposizione otto bit, cioè otto cifre binarie. Un registro è una piccola memoria interna; AL e CL indicano gli otto bit inferiori di due registri e contengono gli addendi. Alcune informazioni sulla somma vengono conservate in indicatori di un bit chiamati flag, affinché un’istruzione successiva possa leggerle. Il prefisso 0x introduce la base sedici, nella quale A…F rappresentano i valori da 10 a 15: 0x7F vale quindi 7×16+15=127.",
      "ZF vale uno quando tutti i bit del risultato sono zero. SF copia il bit più alto, che nella rappresentazione in complemento a due ha peso −128, mentre gli altri sette bit hanno pesi positivi da 1 a 64. Questa rappresentazione copre l’intervallo da −128 a 127; OF segnala che la somma matematica con segno ne supera i limiti. SETcc è una famiglia di istruzioni che converte una condizione sui flag in un byte di valore zero oppure uno.",
      "Sommando i byte 0x7F e 0x01 si ottiene 0x80. La parola vale 128 senza segno ed è diversa da zero, perciò ZF vale zero; il bit più alto è uno e SF vale uno. Con la lettura in complemento a due gli operandi sono 127 e 1: la somma matematica supera il massimo 127, mentre 0x80 si legge −128. Questo superamento dell’intervallo con segno porta OF a uno.",
      "ADD AL,CL aggiunge CL ad AL e conserva il byte risultante in AL. SETZ copia il valore di ZF in DL; SETS copia SF in R8B; SETO copia OF in R9B. Questi tre nomi identificano destinazioni di un byte. MOVZX EAX,AL riporta infine gli otto bit di AL nel registro EAX, ponendo a zero i bit superiori: rende leggibile il valore senza segno del risultato e lascia disponibili i tre indicatori già raccolti."
    ],
    "introduzione": [
      "Lo svolgimento guidato serve a ricavare tre proprietà differenti da una somma su otto bit. ZF riconosce il risultato zero, SF copia il bit più alto e OF segnala un totale con segno fuori dall’intervallo rappresentabile. Le istruzioni SETZ, SETS e SETO rendono osservabili questi indicatori copiandoli in piccole destinazioni di un byte.",
      "Ripristina il caso con «Carica l’esempio guidato» e somma mentalmente 0x7F e 0x01 prima di premere «Passo successivo». Confronta il byte 0x80 con i valori ZF=0, SF=1 e OF=1. Per giustificarli, verifica separatamente la presenza di bit a uno, il bit più alto e il totale 127+1 rispetto al massimo 127; usa «Precedente» quando due verifiche sembrano coincidere."
    ],
    "lettura": "Osserva dapprima la parola risultante, poi i tre indicatori ZF, SF e OF. La ricostruzione confronta i bit della parola con la somma matematica; i registri byte DL, R8B e R9B ricevono le condizioni estratte.",
    "conclusione": "I flag descrivono proprietà diverse della stessa operazione. Per interpretare OF occorre leggere gli operandi con segno; ZF e SF si ricavano direttamente dalla parola conservata.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 4, «Separare overflow, zero e segno dell’ALU», traccia 1. La spiegazione numerica seguente riguarda questa combinazione.",
      "Somma 0x7F e 0x01, conserva otto bit e determina separatamente: parola uguale a zero, bit sette, compatibilità della somma con l’intervallo da −128 a 127.",
      "Avvia la ricostruzione con «Passo successivo» e controlla ogni trasformazione prima di passare alla successiva.",
      "Confronta i campi del risultato con lo svolgimento. Per rispondere a tutti i quesiti, apri «Apri la prova completa»; con i selettori Esercizio e Traccia puoi poi scegliere altri dati."
    ],
    "risultato": "Per l’esercizio 4, traccia 1, i risultati sono: Risultato senza segno = 128; ZF = 0; SF = 1; OF = 1.",
    "ragionamento": "0x7F+0x01=0x80, cioè 128 senza segno. La parola è diversa da zero e ha il bit sette a uno, quindi ZF=0 e SF=1; la somma con segno 127+1 supera 127, quindi OF=1."
  },
  "3.2.1": {
    "scopo": "Due registri ricevono lo stesso dato esterno, pur partendo da contenuti diversi. Confronterai il mantenimento e la scrittura per capire come il comando Carica decide quale informazione sarà conservata al fronte.",
    "teoria": [
      "Se due display sono collegati al medesimo cavo dati, possono mostrare cifre diverse purché ciascuno conservi l’ultima parola acquisita. Questo è il compito di un registro, un insieme di celle capace di trattenere un gruppo di bit, le cifre 0 e 1. Qui ogni registro contiene quattro bit e la sua uscita Q mostra la parola conservata. Il collegamento D, chiamato anche bus, raccoglie quattro fili che portano i quattro bit del dato comune.",
      "La scrittura avviene in un istante stabilito da un segnale periodico, il clock. Si chiama fronte il passaggio del segnale da un livello all’altro. Prima del fronte di acquisizione un multiplexer, il selettore indicato con MUX, presenta al registro il dato esterno D quando Carica vale 1 oppure il suo stesso Q quando Carica vale 0. Questo secondo collegamento è una retroazione: riporta l’uscita all’ingresso, così che riscrivere la stessa parola ne conservi il valore.",
      "Con i registri inizialmente a 3 e a 12 e il cavo D a 7, il comando disabilitato mantiene due uscite distinte. Quando è abilitato, i registri ricevono entrambi 0111, cioè sette. Per capire una differenza fra le due configurazioni basta risalire dal selettore al filo da cui proveniva la parola al fronte."
    ],
    "introduzione": [
      "L’esperimento permette di capire come il contenuto precedente contribuisca allo stato successivo di un registro, una memoria di più bit. Un selettore presenta al suo ingresso il dato esterno D oppure il valore Q già conservato, riportato indietro dalla retroazione. Il comando Carica decide la provenienza della parola che verrà acquisita al fronte del clock.",
      "Carica «Conservare due stati distinti» e avanza con «Passo successivo», seguendo i collegamenti che riportano Q1 e Q2 ai rispettivi ingressi. Confronta i valori prima e dopo il fronte, poi carica «Caricare lo stesso dato nei due registri». Le uscite diventano entrambe 0111: collega questa uguaglianza al dato comune 7 e alla scelta Carica=1, anziché ai precedenti contenuti 3 e 12."
    ],
    "lettura": "Ogni riga contiene un selettore MUX e un registro Q. Il filo D porta lo stesso dato ai due selettori; i percorsi che ritornano dalle uscite rappresentano la retroazione. Il collegamento evidenziato mostra da dove proviene il valore acquisito.",
    "conclusione": "La memoria dipende dal dato acquisito al fronte. Con Carica=0 ciascun registro riacquisisce il proprio contenuto; con Carica=1 entrambi acquisiscono il dato comune, perdendo la differenza iniziale.",
    "controlli": {
      "a": "Parola di quattro bit conservata inizialmente nel primo registro.",
      "b": "Parola iniziale del secondo registro, indipendente da quella del primo.",
      "d": "Parola esterna offerta contemporaneamente ai due registri.",
      "en": "Abilitazione di scrittura: 0 seleziona la retroazione, 1 seleziona il dato comune D."
    },
    "esperienze": [
      {
        "titolo": "Conservare due stati distinti",
        "parametri": {
          "a": 3,
          "b": 12,
          "d": 7,
          "en": 0
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Q iniziale del primo registro = 3; Q iniziale del secondo registro = 12; Dato comune D = 7; Carica = 0.",
          "Parti da «Prima del fronte» e annota Q1 = 0011, Q2 = 1100.",
          "In «Selettore di ingresso» segui i due anelli di retroazione. Prevedi i quattro bit di Q del secondo registro dopo il fronte; poi confronta anche il primo registro con il suo valore iniziale.",
          "Raggiungi «Dopo il fronte» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Dopo il fronte» leggi Q1 = 0011, Q2 = 1100.",
        "ragionamento": "Carica=0 instrada Q1 verso il proprio ingresso e Q2 verso il proprio ingresso. Al fronte vengono riscritti 0011 e 1100, quindi i due registri conservano rispettivamente 3 e 12.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Q1",
            "valore": "0011"
          },
          {
            "passo": 2,
            "campo": "Q2",
            "valore": "1100"
          }
        ]
      },
      {
        "titolo": "Caricare lo stesso dato nei due registri",
        "parametri": {
          "a": 3,
          "b": 12,
          "d": 7,
          "en": 1
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Q iniziale del primo registro = 3; Q iniziale del secondo registro = 12; Dato comune D = 7; Carica = 1.",
          "Parti da «Prima del fronte» e annota Q1 = 0011, Q2 = 1100.",
          "In «Selettore di ingresso» segui il filo proveniente da D. Prevedi i quattro bit di Q del secondo registro dopo l’acquisizione e confrontali poi con il contenuto del primo.",
          "Raggiungi «Dopo il fronte» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Dopo il fronte» leggi Q1 = 0111, Q2 = 0111.",
        "ragionamento": "Carica=1 collega D=7 a entrambi gli ingressi. Ciascun registro acquisisce 0111 al medesimo fronte, perciò Q1 e Q2 diventano entrambi 7.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Q1",
            "valore": "0111"
          },
          {
            "passo": 2,
            "campo": "Q2",
            "valore": "0111"
          }
        ]
      }
    ]
  },
  "3.2.2": {
    "scopo": "Il dato cambia sia vicino agli intervalli alti sia durante gli intervalli bassi del clock. Confronterai il latch e il flip-flop per identificare quando ciascun dispositivo segue l’ingresso e quando conserva il valore precedente.",
    "teoria": [
      "Per conservare l’esito di un sensore occorre stabilire in quale momento leggerlo. Due celle che ricevono il medesimo dato D possono ricordare valori diversi quando seguono regole di acquisizione diverse. La loro uscita Q rappresenta il valore conservato. Il clock è un segnale che alterna un livello basso e uno alto, mentre il fronte di salita è il passaggio dal primo al secondo.",
      "Un latch D rimane aperto per tutto il livello alto. Se il sensore cambia durante quell’intervallo, la variazione raggiunge l’uscita dopo il breve ritardo della cella. Quando il livello torna basso, il latch trattiene l’ultimo valore acquisito. Un flip-flop D, invece, legge il dato al fronte di salita e lo conserva fino al fronte di salita successivo.",
      "Se D vale uno al primo fronte e torna a zero quando il clock è ancora alto, sulle due tracce si leggono rispettivamente zero per il latch e uno per il flip-flop. I cambiamenti del dato sono distanziati dai fronti quanto basta perché il campionamento abbia un esito determinato.",
      "Per descrivere il circuito, AND produce 1 quando entrambi gli ingressi valgono 1; NOT scambia 0 e 1; OR produce 1 quando almeno un ingresso vale 1. Una porta NOR applica NOT al risultato della OR e produce quindi 1 soltanto con tutti gli ingressi a 0. La retroazione collega un’uscita a un ingresso, consentendo a due porte di sostenere lo stato già raggiunto.",
      "Il mantenimento può essere realizzato con due porte NOR collegate in retroazione. Nel latch SR così formato, un ingresso S attivo imposta Q a uno e un ingresso R attivo lo porta a zero. Con entrambi bassi resta lo stato raggiunto. Nel latch D trasparente si può formare S come G AND D e R come G AND NOT D, dove G è l’abilitazione. Con G basso entrambi sono a zero. Con G alto si attiva uno solo dei due, quello richiesto dal dato D. Questa relazione collega le variazioni di Q nel disegno alla funzione di scrittura e mantenimento."
    ],
    "introduzione": [
      "La simulazione consente di distinguere due regole di acquisizione dello stesso dato. Il latch è trasparente durante il livello alto del clock, quindi lascia passare le variazioni di D; il flip-flop acquisisce D al fronte di salita, cioè nel passaggio da basso ad alto. Le tracce mostrano quando questa differenza produce uscite Q diverse.",
      "Carica «D scende durante il livello alto» e raggiungi «Clock alto» con «Passo successivo». Confronta Q del latch, che vale 0, con Q del flip-flop, che conserva 1: la previsione riguarda proprio questa tappa. Prosegui fino al secondo fronte e osserva il ricongiungimento delle uscite, poi ripeti con «D sale durante il livello alto» per verificare la stessa distinzione a valori invertiti."
    ],
    "lettura": "Le quattro linee rappresentano Clock, D, Q del latch e Q del flip-flop. I livelli alti e bassi corrispondono a 1 e 0; t0…t5 ordinano eventi schematici. Allinea verticalmente le tracce per collegare ogni variazione dell’uscita al clock e al dato dello stesso istante.",
    "conclusione": "Il latch trasmette D durante il livello alto e conserva il valore alla chiusura. Il flip-flop acquisisce D al fronte di salita: due uscite possono quindi divergere durante il livello alto e tornare uguali al fronte seguente.",
    "controlli": {
      "q": "Bit ricordato inizialmente da entrambi i dispositivi, prima del primo fronte.",
      "d": "Bit presente su D durante il primo fronte di salita; torna su D durante il successivo intervallo basso.",
      "e": "Nuovo bit applicato a D mentre il clock è ancora alto, dopo il primo fronte."
    },
    "esperienze": [
      {
        "titolo": "D scende durante il livello alto",
        "parametri": {
          "q": 0,
          "d": 1,
          "e": 0
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Stato iniziale = 0; Dato al primo fronte = 1; Dato durante il livello alto = 0.",
          "Parti da «Preparazione» e annota Clock = 0, D = 1, Q latch = 0, Q flip-flop = 0.",
          "Avanza a «Fronte di salita» e annota entrambe le uscite. Prima di «Clock alto», prevedi Q del latch quando D passa a 0 durante il livello alto: è questo il valore richiesto dal campo di previsione. Confrontalo poi con Q del flip-flop e segui la chiusura.",
          "Raggiungi «Secondo fronte» con «Passo successivo» e confronta le due uscite finali con il risultato spiegato qui sotto. Il valore inserito nella previsione riguarda invece «Clock alto»: usa «Precedente» per tornare a quella tappa e verificare Q del latch."
        ],
        "risultato": "A «Clock alto» Q latch=0 e Q flip-flop=1. Dopo «Secondo fronte» entrambe le uscite valgono 1.",
        "ragionamento": "Al primo fronte entrambi acquisiscono 1. Quando D scende con clock alto, il latch passa a 0 e il flip-flop conserva 1; al secondo fronte D è tornato a 1 e le due uscite valgono di nuovo 1.",
        "attesi": [
          {
            "passo": 5,
            "campo": "Clock",
            "valore": "1"
          },
          {
            "passo": 5,
            "campo": "D",
            "valore": "1"
          },
          {
            "passo": 5,
            "campo": "Q latch",
            "valore": "1"
          },
          {
            "passo": 5,
            "campo": "Q flip-flop",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Q latch",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Q flip-flop",
            "valore": "1"
          }
        ]
      },
      {
        "titolo": "D sale durante il livello alto",
        "parametri": {
          "q": 0,
          "d": 0,
          "e": 1
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Stato iniziale = 0; Dato al primo fronte = 0; Dato durante il livello alto = 1.",
          "Parti da «Preparazione» e annota Clock = 0, D = 0, Q latch = 0, Q flip-flop = 0.",
          "Avanza a «Fronte di salita» con D=0. Prima di «Clock alto», prevedi Q del latch quando D passa a 1: il campo di previsione riguarda questa tappa. Confronta poi Q del flip-flop e verifica che la differenza sopravviva alla chiusura.",
          "Raggiungi «Secondo fronte» con «Passo successivo» e confronta le due uscite finali con il risultato spiegato qui sotto. Il valore inserito nella previsione riguarda invece «Clock alto»: usa «Precedente» per tornare a quella tappa e verificare Q del latch."
        ],
        "risultato": "A «Clock alto» Q latch=1 e Q flip-flop=0. Dopo «Secondo fronte» entrambe le uscite valgono 0.",
        "ragionamento": "Al primo fronte entrambi acquisiscono 0. Durante il livello alto D passa a 1, seguito soltanto dal latch; al secondo fronte D è tornato a 0 e le due uscite tornano entrambe a 0.",
        "attesi": [
          {
            "passo": 5,
            "campo": "Clock",
            "valore": "1"
          },
          {
            "passo": 5,
            "campo": "D",
            "valore": "0"
          },
          {
            "passo": 5,
            "campo": "Q latch",
            "valore": "0"
          },
          {
            "passo": 5,
            "campo": "Q flip-flop",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Q latch",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Q flip-flop",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "3.2.3": {
    "scopo": "Un banco permette di leggere due registri e di scriverne uno nello stesso circuito. Verificherai come una scrittura modifica la porta che seleziona quella destinazione e lascia intatta l’altra lettura.",
    "teoria": [
      "Un registro è una piccola memoria che conserva una parola. Quando più registri sono raccolti in un banco, ciascuno riceve un numero con cui il circuito può sceglierlo. Nel banco di quattro posti gli indirizzi 0, 1, 2 e 3 identificano rispettivamente R0, R1, R2 e R3. L’indirizzo indica una posizione, il dato è il numero che quella posizione contiene.",
      "Le due porte di lettura sono collegamenti indipendenti, perciò possono presentare allo stesso tempo due parole diverse oppure la medesima parola. Il dato viaggia su un bus, un insieme di fili che trasporta i bit della parola. La porta di scrittura possiede un indirizzo proprio: un circuito chiamato decodificatore trasforma tale numero nella selezione di uno fra R0, R1, R2 e R3. Al fronte del clock, l’istante periodico di acquisizione, il registro selezionato riceve il dato soltanto se l’abilitazione generale di scrittura vale 1.",
      "Con le porte A e B puntate su R1 e R2 si leggono inizialmente 5 e 11. Scrivendo 21 in R2, la lettura di B passa a 21 dopo il fronte, mentre A continua a mostrare 5. Nella riga del banco si può riconoscere la sola posizione che ha ricevuto la scrittura."
    ],
    "introduzione": [
      "L’attività permette di comprendere come un banco di registri separi la scelta delle parole dalla loro modifica. Un indirizzo identifica una posizione, mentre il dato è il contenuto conservato in quella posizione. Due porte leggono indipendentemente; una porta di scrittura aggiorna il solo registro selezionato al fronte del clock, quando l’abilitazione vale uno.",
      "Carica «Scrivere R2 mentre viene letto» e confronta le porte A e B prima della scrittura. Avanza con «Passo successivo» fino alle letture successive: B passa da 11 a 21, mentre A resta a 5. Carica poi «Disabilitare la scrittura» e confronta il banco finale: la presenza di 21 sul bus produce un aggiornamento soltanto quando il comando lo autorizza."
    ],
    "lettura": "La colonna centrale contiene R0…R3. Il bus a sinistra porta il dato nuovo al registro scelto; i due collegamenti a destra conducono alle porte di lettura A e B. Confronta il contenuto della cella evidenziata prima e dopo il fronte.",
    "conclusione": "Gli indirizzi di lettura selezionano parole già conservate. L’abilitazione e l’indirizzo di scrittura stabiliscono quale parola cambia al fronte; il cambiamento appare sulle porte che leggono proprio quella posizione.",
    "controlli": {
      "a": "Indice del registro collegato alla porta di lettura A, da R0 a R3.",
      "b": "Indice del registro collegato alla porta di lettura B, scelto indipendentemente da A.",
      "w": "Indice dell’unico registro che può acquisire il nuovo dato al fronte.",
      "v": "Parola offerta sul bus di scrittura; assume effetto quando l’abilitazione vale 1.",
      "en": "Con 1 la destinazione viene aggiornata al fronte; con 0 resta conservata la parola precedente."
    },
    "esperienze": [
      {
        "titolo": "Scrivere R2 mentre viene letto",
        "parametri": {
          "a": 1,
          "b": 2,
          "w": 2,
          "v": 21,
          "en": 1
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Indirizzo di lettura A = 1; Indirizzo di lettura B = 2; Indirizzo di scrittura = 2; Dato da scrivere = 21; Abilita scrittura = 1.",
          "Parti da «Letture prima del fronte» e annota Porta A = 5, Porta B = 11.",
          "In «Scrittura sincrona» collega destinazione R2 e dato 21 alla porta B. Prevedi la parola che B leggerà dopo il fronte, poi confronta separatamente l’uscita di A.",
          "Raggiungi «Letture dopo il fronte» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Letture dopo il fronte» leggi Porta A = 5, Porta B = 21, Banco R0…R3 = 2 · 5 · 21 · 13.",
        "ragionamento": "Il banco iniziale è [2,5,11,13]. La scrittura abilitata sostituisce R2=11 con 21: A legge R1=5 e B legge il nuovo R2=21.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Porta A",
            "valore": "5"
          },
          {
            "passo": 2,
            "campo": "Porta B",
            "valore": "21"
          },
          {
            "passo": 2,
            "campo": "Banco R0…R3",
            "valore": "2 · 5 · 21 · 13"
          }
        ]
      },
      {
        "titolo": "Disabilitare la scrittura",
        "parametri": {
          "a": 1,
          "b": 2,
          "w": 2,
          "v": 21,
          "en": 0
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Indirizzo di lettura A = 1; Indirizzo di lettura B = 2; Indirizzo di scrittura = 2; Dato da scrivere = 21; Abilita scrittura = 0.",
          "Parti da «Letture prima del fronte» e annota Porta A = 5, Porta B = 11.",
          "In «Scrittura sincrona» osserva il dato 21 sul bus e l’abilitazione a zero. Prevedi la parola letta da B dopo il fronte, ricavandola dal contenuto che R2 conserverà.",
          "Raggiungi «Letture dopo il fronte» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Letture dopo il fronte» leggi Porta A = 5, Porta B = 11, Banco R0…R3 = 2 · 5 · 11 · 13.",
        "ragionamento": "Con l’abilitazione a zero, R2 conserva il valore precedente anche quando sul bus compare 21. Il banco rimane [2,5,11,13], quindi le letture restano A=5 e B=11.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Porta A",
            "valore": "5"
          },
          {
            "passo": 2,
            "campo": "Porta B",
            "valore": "11"
          },
          {
            "passo": 2,
            "campo": "Banco R0…R3",
            "valore": "2 · 5 · 11 · 13"
          }
        ]
      }
    ]
  },
  "3.2.4": {
    "scopo": "Due registri si scambiano dati attraverso una rete logica. Controllerai separatamente l’arrivo più tardivo e quello più precoce per capire perché un periodo sufficiente possa coesistere con una violazione del mantenimento.",
    "teoria": [
      "Due registri si passano una parola attraverso un circuito che la elabora. A ogni fronte, cioè a ogni istante di campionamento scandito dal clock, il primo registro avvia l’invio di una nuova parola e il secondo acquisisce quella preparata nel ciclo precedente. Qui il fronte arriva contemporaneamente ai due registri. Il tempo fra due fronti successivi si chiama periodo.",
      "La parola da acquisire deve arrivare al secondo registro con un certo anticipo sul fronte successivo, detto tempo di setup. Un picosecondo, abbreviato ps, è un millesimo di miliardesimo di secondo. Con 30 ps al massimo per uscire dal primo registro e 65 per attraversare la logica, il dato arriva entro 95 ps. Aggiungendo i 15 ps di setup occorrono almeno 110 ps fra i fronti. Se il periodo è 120 ps, restano 10 ps di margine.",
      "Dopo il fronte corrente il secondo registro richiede anche che la vecchia parola rimanga stabile per 18 ps, il tempo di hold. Il nuovo dato può uscire già dopo 12 ps e attraversare il circuito in 8. L’arrivo più precoce è quindi a 20 ps e il margine vale 2 ps. Allungare il periodo sposta il prossimo fronte e lascia invariato questo secondo confronto.",
      "Il modello assume skew nullo, cioè arrivo simultaneo del fronte ai due registri, e usa i tempi minimo e massimo di uscita dal registro pari rispettivamente a 12 e 30 ps. Un margine negativo segnala una condizione fuori specifica: la figura individua la violazione temporale, senza attribuire un valore logico certo al campionamento in quelle condizioni."
    ],
    "introduzione": [
      "Questo esperimento serve a verificare due condizioni temporali diverse fra registri. Il setup richiede che il dato sia stabile prima del prossimo fronte; l’hold richiede che resti stabile dopo il fronte corrente. Gli arrivi più lento e più veloce rendono osservabili questi vincoli separati, assumendo che il clock raggiunga entrambi i registri nello stesso istante.",
      "Carica «Verificare entrambi i margini» e avanza con «Passo successivo», confrontando i margini di setup e hold, rispettivamente 10 e 2 ps. Carica poi «Un percorso troppo rapido per hold»: l’arrivo anticipato a 14 ps porta il margine a −4 ps. Aumenta «Periodo (ps)», premi «Applica i parametri» e verifica che migliori il setup mentre il difetto di hold rimane."
    ],
    "lettura": "La linea setup indica la finestra di 15 ps prima del fronte successivo; la linea hold indica i 18 ps dopo il fronte corrente. I marcatori mostrano gli arrivi lento e veloce. Un margine positivo misura il tempo disponibile oltre il requisito.",
    "conclusione": "Con clock simultanei, setup richiede T≥30+ritardo massimo+15 e hold richiede 12+ritardo minimo≥18. Aumentare T può correggere il primo vincolo; il secondo dipende dal percorso più veloce dopo il fronte corrente.",
    "controlli": {
      "t": "Intervallo in picosecondi fra il fronte di lancio e quello successivo di acquisizione.",
      "max": "Peggior tempo di attraversamento della logica; determina l’ultimo arrivo possibile.",
      "min": "Tempo minimo di attraversamento della logica; determina quanto presto può cambiare il dato al ricevitore."
    },
    "esperienze": [
      {
        "titolo": "Verificare entrambi i margini",
        "parametri": {
          "t": 120,
          "max": 65,
          "min": 8
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Periodo (ps) = 120; Logica, ritardo massimo (ps) = 65; Logica, ritardo minimo (ps) = 8.",
          "Parti da «Lancio» e annota Skew (ps) = 0, Setup richiesto (ps) = 15, Hold richiesto (ps) = 18.",
          "In «Percorso lento» calcola 30+65+15 e confrontalo con 120 ps. In «Percorso veloce» calcola 12+8 e confrontalo con 18 ps.",
          "Raggiungi «Percorso veloce» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Percorso veloce» leggi Arrivo più precoce (ps) = 20, Margine hold (ps) = 2, Esito = Entrambi i vincoli rispettati.",
        "ragionamento": "Il setup richiede 110 ps e il periodo di 120 ps lascia 10 ps. Il dato nuovo arriva al più presto a 20 ps, oltre il requisito hold di 18 ps, lasciando altri 2 ps.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Arrivo più precoce (ps)",
            "valore": "20"
          },
          {
            "passo": 2,
            "campo": "Margine hold (ps)",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "Esito",
            "valore": "Entrambi i vincoli rispettati"
          }
        ]
      },
      {
        "titolo": "Un percorso troppo rapido per hold",
        "parametri": {
          "t": 120,
          "max": 65,
          "min": 2
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Periodo (ps) = 120; Logica, ritardo massimo (ps) = 65; Logica, ritardo minimo (ps) = 2.",
          "Parti da «Lancio» e annota Skew (ps) = 0, Setup richiesto (ps) = 15, Hold richiesto (ps) = 18.",
          "In «Percorso lento» verifica che il margine setup sia rimasto 10 ps. In «Percorso veloce» confronta l’arrivo a 12+2 ps con i 18 ps di mantenimento.",
          "Raggiungi «Percorso veloce» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Percorso veloce» leggi Arrivo più precoce (ps) = 14, Margine hold (ps) = -4, Esito = Vincolo temporale violato.",
        "ragionamento": "Il percorso lento conserva il limite di 110 ps, quindi setup resta rispettato. Il percorso veloce arriva a 14 ps, quattro picosecondi prima della fine della finestra hold: il margine −4 ps segnala la violazione.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Arrivo più precoce (ps)",
            "valore": "14"
          },
          {
            "passo": 2,
            "campo": "Margine hold (ps)",
            "valore": "-4"
          },
          {
            "passo": 2,
            "campo": "Esito",
            "valore": "Vincolo temporale violato"
          }
        ]
      }
    ]
  },
  "3.2.5": {
    "scopo": "Un distributore conserva il credito e reagisce a ogni nuova moneta. Seguirai due sequenze per riconoscere il legame fra stato precedente, ingresso, erogazione e restituzione della moneta.",
    "teoria": [
      "Un distributore vende un prodotto al prezzo di tre unità e accetta monete da una o due. Quando entra una moneta da uno, il distributore deve sapere quanto è già stato versato per decidere se erogare il prodotto. La memoria necessaria si riduce al credito accumulato. Due sequenze di monete che abbiano lasciato lo stesso credito avranno lo stesso seguito a parità di nuovi ingressi.",
      "Si parla di macchina a stati perché i crediti possibili sono un insieme finito, qui zero, uno e due. A ogni ingresso la macchina calcola il totale provvisorio. Se è inferiore a tre registra il nuovo credito, se è uguale a tre eroga e azzera il credito, se supera tre restituisce l’ultima moneta conservando quanto era già stato accettato.",
      "Partendo da zero con le monete 2, 2 e 1, il primo versamento lascia due unità disponibili. Il secondo porterebbe il totale a quattro e viene restituito. L’ultima moneta completa il prezzo. Le uscite Eroga e Restituisce valgono 1 quando l’evento avviene nel passo corrente e 0 quando è assente; il credito indica invece quanto rimane disponibile per il passo seguente. Il valore 0 nel campo Moneta rappresenta un intervallo di attesa e conserva il credito."
    ],
    "introduzione": [
      "La simulazione permette di comprendere una macchina a stati attraverso il credito di un distributore. Lo stato è l’informazione conservata per decidere la risposta al prossimo ingresso; qui coincide con zero, una o due unità di credito. Ogni moneta può aggiornare quel credito, completare il prezzo con un’erogazione oppure essere restituita quando provocherebbe un eccesso.",
      "Carica «Restituire una moneta eccedente» e segui i tre ingressi con «Passo successivo», annotando credito prima, moneta e credito dopo. Confronta la seconda moneta da 2, restituita, con l’ultima da 1, che provoca l’erogazione. Ripeti con «Completare il prezzo prima dell’ultimo ingresso»: l’azzeramento al secondo ingresso spiega perché l’ultima moneta lasci credito 1 e appartenga a un nuovo acquisto."
    ],
    "lettura": "I tre cerchi sono gli stati di credito 0, 1 e 2. La freccia collega il credito prima dell’ingresso a quello successivo; un arco che ritorna sullo stesso cerchio indica un credito conservato. Le indicazioni Eroga e Restituisce descrivono l’evento prodotto da quel passaggio.",
    "conclusione": "La risposta a una moneta dipende dal credito già memorizzato. La somma inferiore a tre aggiorna lo stato, quella uguale a tre eroga e azzera, quella maggiore di tre respinge l’ultima moneta lasciando il credito precedente.",
    "controlli": {
      "q": "Credito già presente prima della prima moneta, espresso nelle unità del prezzo.",
      "m0": "Prima moneta della sequenza; 0 rappresenta un intervallo senza inserimento.",
      "m1": "Seconda moneta, valutata sul credito lasciato dalla prima.",
      "m2": "Terza moneta, valutata sul credito rimasto dopo il secondo ingresso."
    },
    "esperienze": [
      {
        "titolo": "Restituire una moneta eccedente",
        "parametri": {
          "q": 0,
          "m0": 2,
          "m1": 2,
          "m2": 1
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Credito iniziale = 0; Moneta 1 (0 = attesa) = 2; Moneta 2 (0 = attesa) = 2; Moneta 3 (0 = attesa) = 1.",
          "Parti da «Ingresso 1» e annota Credito prima = 0, Moneta = 2, Credito dopo = 2, Eroga = 0, Restituisce = 0.",
          "Leggi «Ingresso 1» e «Ingresso 2» in successione. Dopo il credito 2, valuta il totale 2+2 e controlla quale moneta viene restituita; porta poi la moneta 1 all’ultimo ingresso.",
          "Raggiungi «Ingresso 3» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Ingresso 3» leggi Credito prima = 2, Moneta = 1, Credito dopo = 0, Eroga = 1, Restituisce = 0.",
        "ragionamento": "La prima moneta porta il credito a 2. La seconda darebbe 4 e viene restituita: il credito resta 2; l’ultima porta il totale a 3, produce Eroga=1 e lascia credito 0.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Credito prima",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "Moneta",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Credito dopo",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Eroga",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Restituisce",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Completare il prezzo prima dell’ultimo ingresso",
        "parametri": {
          "q": 0,
          "m0": 2,
          "m1": 1,
          "m2": 1
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Credito iniziale = 0; Moneta 1 (0 = attesa) = 2; Moneta 2 (0 = attesa) = 1; Moneta 3 (0 = attesa) = 1.",
          "Parti da «Ingresso 1» e annota Credito prima = 0, Moneta = 2, Credito dopo = 2, Eroga = 0, Restituisce = 0.",
          "Dopo «Ingresso 1» usa «Passo successivo» per seguire la moneta 1. Annota l’azzeramento dopo l’erogazione e usa quel nuovo stato per interpretare la terza moneta.",
          "Raggiungi «Ingresso 3» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Ingresso 3» leggi Credito prima = 0, Moneta = 1, Credito dopo = 1, Eroga = 0, Restituisce = 0.",
        "ragionamento": "Le prime monete 2 e 1 raggiungono il prezzo 3: il secondo ingresso eroga e azzera. La terza moneta da 1 apre un nuovo acquisto, lasciando credito 1 ed Eroga=0.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Credito prima",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Moneta",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Credito dopo",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Eroga",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Restituisce",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "3.2.6": {
    "scopo": "Ricostruirai la memoria di un latch attraverso quattro intervalli. L’obiettivo è usare il valore precedente di Q ogni volta che il dispositivo è chiuso, distinguendolo dal dato presente sul filo D.",
    "teoria": [
      "Una cella può ricordare una cifra binaria anche quando il filo che portava quella cifra ha già cambiato valore. Nel latch D si distinguono il dato in ingresso D, il comando di apertura EN e l’uscita Q, che rende visibile il dato trattenuto. Per leggere la storia del latch occorre conoscere il valore iniziale di Q e l’ordine in cui si stabilizzano gli ingressi.",
      "Si parte da Q uguale a zero. Se EN vale zero mentre D è uno, la cella resta chiusa e mostra ancora zero. Se successivamente EN sale a uno mentre D resta uno, il percorso si apre e Q raggiunge uno dopo il tempo di propagazione. Chiudendo di nuovo il latch, quel valore resta memorizzato anche quando D scende a zero.",
      "Conviene annotare, accanto a ogni coppia della traccia, il valore acquisito nel tratto precedente. Con EN alto si legge il dato presente in quell’intervallo, con EN basso si riporta il bit già conservato. La coppia EN,D si legge in quest’ordine: per esempio 01 significa comando chiuso e dato uguale a 1. Procedendo nell’ordine temporale si può spiegare ogni segmento della linea di uscita, compresi quelli in cui cambia soltanto l’ingresso."
    ],
    "introduzione": [
      "Il problema permette di ricostruire la memoria di un latch, cioè una cella che conserva un bit. D propone il dato, EN stabilisce se il passaggio è aperto e Q mostra il valore raggiunto. L’ordine degli intervalli rende osservabile la dipendenza dalla storia: durante la chiusura conta il precedente Q, mentre durante l’apertura conta D.",
      "Inserisci una previsione per Q alla fine del quarto intervallo, poi avanza con «Passo successivo». Confronta soprattutto il secondo e il terzo intervallo: D scende da 1 a 0, mentre Q resta a 1 perché EN chiude il latch. Segui infine la riapertura, che porta Q a 0; con «Ricomincia il percorso» ricostruisci l’intera sequenza 0, 1, 1, 0."
    ],
    "lettura": "Le tracce EN e D descrivono i due ingressi nello stesso intervallo; Q conserva la storia. Allinea i tre valori per ogni tratto e osserva se il percorso verso l’uscita è aperto oppure chiuso.",
    "conclusione": "Per un latch trasparente alto, Q segue D quando EN=1 e conserva il valore raggiunto quando EN=0. Conoscere soltanto il dato corrente è insufficiente nei tratti chiusi: serve lo stato lasciato dalla storia precedente.",
    "procedura": [
      "Leggi i «Dati iniziali»: Il latch D parte da Q = 0. Le coppie (EN,D) si stabilizzano nell’ordine (0,1), (1,1), (0,0), (1,0).",
      "Scrivi una previsione per «Qual è Q alla fine del quarto intervallo?». Conservala mentre inizi la ricostruzione con «Passo successivo».",
      "Avanza da «Intervallo 1» a «Intervallo 4». Per ciascuno scrivi prima EN, poi scegli tra il dato D e il precedente Q, ottenendo una sequenza di quattro uscite.",
      "Raggiungi «Intervallo 4» e confronta la previsione con i valori finali. Usa «Ricomincia il percorso» per ripetere i passaggi con il ragionamento ormai completo."
    ],
    "risultato": "La risposta alla previsione è 0. Con EN alto e D basso l’uscita diventa zero dopo la propagazione.",
    "ragionamento": "Da Q iniziale 0, le coppie (EN,D)=(0,1),(1,1),(0,0),(1,0) danno Q=0,1,1,0. Il terzo intervallo conserva l’uno già acquisito, mentre il quarto riapre il latch e acquisisce lo zero."
  },
  "3.2.7": {
    "scopo": "Calcolerai il segnale che riconosce un fronte di salita e il valore acquisito dal flip-flop. Il problema mostra perché il campionamento dipenda dalla transizione del clock e richieda due osservazioni successive.",
    "teoria": [
      "Un circuito con memoria conserva un’informazione anche quando il suo ingresso cambia. Nel flip-flop D l’ingresso D propone il valore nuovo e l’uscita Q espone quello memorizzato. Il clock è il segnale periodico che stabilisce quando può avvenire il passaggio da D a Q.",
      "Il fronte di salita è la transizione dal livello basso al livello alto del clock. Un solo valore alto dice dove si trova il segnale, mentre la coppia precedente–attuale permette di riconoscere il passaggio 0→1. La traccia assume al massimo una transizione fra le due osservazioni: questa ipotesi consente di ricostruire l’evento dai due livelli registrati. Il modello descrive così la regola di acquisizione del flip-flop attraverso una successione di osservazioni.",
      "Se il clock passa da 0 a 1 mentre D vale 1, Q acquisisce 1. Supponiamo ora che D scenda a 0 quando il clock si trova ancora a 1. Q conserva il valore acquisito, perché due osservazioni successive entrambe a 1 descrivono un livello stabile. La variazione dell’ingresso da sola lascia quindi intatta la memoria del circuito.",
      "Nel frammento EDI conserva il vecchio Q, ESI il clock precedente, EDX quello attuale ed ECX il dato D. Sono registri usati come contenitori per simulare la cella. MOV copia il vecchio Q in EAX; XOR ESI,1 scambia 0 e 1 del clock precedente; AND richiede che il risultato e il clock attuale valgano entrambi 1. Il test così ottenuto vale 1 soltanto sul fronte di salita. CMOVNE copia D in EAX quando il risultato della AND è diverso da zero; negli altri casi EAX conserva il vecchio Q."
    ],
    "introduzione": [
      "L’esercitazione permette di riconoscere un fronte di salita confrontando due osservazioni successive del clock. Il fronte è la transizione 0→1 che autorizza il flip-flop ad acquisire D; negli altri casi resta il vecchio Q. Il programma riproduce questa scelta con un test logico, assumendo al massimo una transizione fra le due osservazioni considerate.",
      "Premi «Carica l’esempio guidato» e usa clock precedente 0 e attuale 1 per compilare «Fronte di salita». Con «Registra la previsione» sblocca il percorso, poi avanza e confronta il test con Q successivo=1. Segui il complemento del vecchio clock e la AND con quello attuale: il loro risultato seleziona D al posto del vecchio Q e rende riconoscibile l’occasione di acquisizione."
    ],
    "lettura": "Il diagramma affianca clock precedente, clock attuale e impulso di acquisizione. Il selettore finale usa l’impulso per scegliere tra il vecchio Q e il dato D; i valori nei registri riproducono queste decisioni.",
    "conclusione": "Il fronte di salita si riconosce come (NOT clock precedente) AND clock attuale. Soltanto la combinazione 0→1 attiva il campionamento di D; nelle altre combinazioni il flip-flop conserva Q.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 3, «Riconoscere il fronte che campiona D», traccia 1. La spiegazione numerica seguente riguarda questa combinazione.",
      "Con Q=0, clock precedente 0, clock attuale 1 e D=1, calcola prima il complemento del vecchio clock e poi la sua AND con il nuovo.",
      "Compila la previsione per «Fronte di salita» e premi «Registra la previsione». Poi avanza con «Passo successivo» per verificare il procedimento, anche se la risposta iniziale richiede una correzione.",
      "Confronta i campi del risultato con lo svolgimento. Per rispondere a tutti i quesiti, apri «Apri la prova completa»; con i selettori Esercizio e Traccia puoi poi scegliere altri dati."
    ],
    "risultato": "Per l’esercizio 3, traccia 1, i risultati sono: Fronte di salita = 1; Q successivo = 1.",
    "ragionamento": "Il complemento di 0 è 1 e 1 AND 1=1 identifica il fronte. Il selettore acquisisce D=1, perciò il nuovo Q è 1; nel frammento CMOVNE sceglie il dato quando il risultato del test del fronte è diverso da zero."
  },
  "3.2.8": {
    "scopo": "Due registri si aggiornano nello stesso istante e ricevono valori derivati l’uno dall’altro. Ricostruirai i candidati prima del fronte, verificando anche la priorità del reset.",
    "teoria": [
      "Un registro è una piccola memoria che conserva una parola di bit, le cifre 0 e 1. Due registri che seguono lo stesso clock, il segnale periodico di aggiornamento, possono cambiare entrambi al medesimo fronte di salita, quando il segnale passa da 0 a 1. Ciascuno acquisisce il valore che il proprio ingresso presentava subito prima di quell’istante. È questa simultaneità a determinare quali numeri entrano nel calcolo.",
      "Nel circuito in esame il nuovo A proviene dal vecchio B, mentre il nuovo B è il vecchio A aumentato di uno. I registri sono larghi quattro bit e conservano il resto della divisione per sedici. Il segnale di reset, quando viene selezionato, sostituisce entrambi gli ingressi con zero.",
      "Se prima del fronte A vale 3 e B vale 9, il collegamento ordinario porta 9 in A e 4 in B. Per trovare 4 si usa il vecchio valore 3, disponibile all’ingresso dell’incrementatore durante il ciclo. Quando è attivo il reset sincrono, entrambi i registri ricevono invece zero al fronte scelto.",
      "Il listato conserva in EDI ed ESI i vecchi valori di A e B e prepara i risultati in EAX ed ECX. LEA calcola l’incremento del vecchio A; AND con 15 conserva i quattro bit inferiori, applicando il resto modulo 16. EDX contiene il reset: TEST verifica se è attivo e le due CMOVNE selezionano allora lo zero preparato in R8D. Il reset ha quindi precedenza sui due calcoli ordinari e agisce al fronte, come gli altri ingressi."
    ],
    "introduzione": [
      "Questa ricostruzione serve a comprendere un aggiornamento simultaneo: i nuovi contenuti di due registri derivano entrambi dallo stato precedente. Qui A riceve il vecchio B e B riceve il vecchio A aumentato di uno, conservando quattro bit. Il reset sincrono è un comando prioritario che, quando attivo, fa acquisire zero a entrambi nello stesso fronte.",
      "Carica l’esempio guidato e annota A=3 e B=9 prima di premere «Passo successivo». Confronta i due candidati 9 e 4 con i valori acquisiti al fronte, osservando il reset a zero. Usa «Precedente» per seguire il vecchio A verso l’incrementatore: il risultato 4 deriva da 3+1. Il nuovo A=9 appartiene allo stato successivo e sarà disponibile per il calcolo del ciclo seguente."
    ],
    "lettura": "Segui separatamente il vecchio A verso l’incrementatore e il vecchio B verso l’ingresso di A. Le due uscite cambiano soltanto dopo che entrambi i candidati sono pronti; il reset può selezionare zero per entrambe.",
    "conclusione": "Un aggiornamento simultaneo si calcola interamente dal vecchio stato. Il reset sincrono modifica la scelta dei dati acquisiti al fronte, mentre il limite di quattro bit impone il resto modulo 16.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 5, «Aggiornamento simultaneo con azzeramento prioritario», traccia 1. La spiegazione numerica seguente riguarda questa combinazione.",
      "Annota il vecchio stato A=3 e B=9. Forma prima i candidati A nuovo=9 e B nuovo=3+1, poi valuta il bit reset=0.",
      "Avvia la ricostruzione con «Passo successivo» e controlla ogni trasformazione prima di passare alla successiva.",
      "Confronta i campi del risultato con lo svolgimento. Per rispondere a tutti i quesiti, apri «Apri la prova completa»; con i selettori Esercizio e Traccia puoi poi scegliere altri dati."
    ],
    "risultato": "Per l’esercizio 5, traccia 1, i risultati sono: A dopo il fronte = 9; B dopo il fronte = 4.",
    "ragionamento": "Il vecchio B fornisce 9 all’ingresso di A; il vecchio A incrementato fornisce 4 all’ingresso di B. Il reset è zero e lascia passare i candidati ordinari, quindi dopo lo stesso fronte A=9 e B=4."
  },
  "3.3.1": {
    "scopo": "Due istruzioni usano gli stessi registri, aggiornando lo stato in modi diversi. Confronterai copia e addizione per separare il valore scritto, l’avanzamento del contatore di programma e gli indicatori aritmetici.",
    "teoria": [
      "Per seguire un ordine tanto semplice quanto «aggiungi questo numero al precedente», occorre sapere dove il processore custodisce i due numeri e dove deporrà il risultato. Un registro è una piccola memoria interna identificata da un nome. Nella macchina didattica Y86-64, %rax e %rbx sono due registri da 64 bit, mentre il contatore di programma, o PC, contiene l’indirizzo dell’istruzione da prelevare.",
      "ISA, abbreviazione di Instruction Set Architecture, è l’insieme delle regole con cui una macchina interpreta le istruzioni e aggiorna lo stato visibile al programma. Il modello Y86-64 usato qui è una macchina didattica: i nomi dei registri ricordano x86-64, mentre le codifiche e le istruzioni seguono le regole specifiche Y86-64.",
      "L’istruzione rrmovq %rax,%rbx copia nel secondo registro la parola contenuta nel primo. L’istruzione addq %rax,%rbx usa invece anche il vecchio contenuto della destinazione e vi scrive la somma, calcolata dall’unità aritmetico-logica indicata con ALU. Se i valori iniziali sono 7 e −7, la copia lascia 7 in entrambi i registri, mentre l’addizione lascia 7 nella sorgente e zero nella destinazione. Il simbolo % introduce i nomi dei registri nella notazione Y86-64.",
      "La somma aggiorna tre indicatori di un bit, raccolti sotto il nome CC, codici di condizione. ZF segnala un risultato nullo, SF ne riporta il segno e OF indica che la somma matematica con segno è uscita dall’intervallo rappresentabile. I valori selezionabili qui entrano agevolmente nei 64 bit, perciò OF resta a zero. La copia conserva gli indicatori precedenti. Entrambe le istruzioni occupano due byte, gruppi di otto bit, perciò il PC avanza di due posizioni: da 64 a 66, scritti 0x40 e 0x42 nella notazione in base sedici."
    ],
    "introduzione": [
      "La simulazione permette di comprendere l’ISA come insieme di regole sugli effetti visibili delle istruzioni. Nella macchina didattica Y86-64 i registri conservano dati, il PC indica l’istruzione da prelevare e i codici di condizione descrivono proprietà del risultato aritmetico. Confrontando copia e somma potrai stabilire quali parti dello stato cambino e quali conservino il valore precedente.",
      "Carica «Addizionare valori opposti» e avanza con «Passo successivo», confrontando il vecchio %rbx con la somma −7+7. Osserva insieme %rbx=0, ZF=1 e PC=0x42. Carica poi «Copiare conservando i flag»: il nuovo %rbx vale 7, mentre i codici di condizione restano quelli iniziali. Giustifica l’avanzamento identico del PC attraverso i due byte occupati da ciascuna istruzione."
    ],
    "lettura": "I registri sorgente e destinazione compaiono a sinistra; al centro si trova il calcolo o il percorso di copia. A destra il PC mostra l’indirizzo del codice. Confronta i valori iniziali con quelli del passo «Stato successivo», includendo la riga CC.",
    "conclusione": "L’ISA definisce gli effetti osservabili dell’istruzione sui registri, sul PC e sui codici di condizione. In questa macchina didattica entrambe le codifiche occupano due byte, mentre soltanto l’addizione aggiorna i flag.",
    "controlli": {
      "op": "Operazione Y86-64: addq somma la sorgente alla destinazione, rrmovq copia la sorgente.",
      "a": "Contenuto iniziale del registro sorgente, conservato da entrambe le istruzioni.",
      "b": "Contenuto iniziale della destinazione; addq lo usa come secondo addendo.",
      "pc": "Indirizzo iniziale dell’istruzione, espresso in byte; il nuovo PC sarà due byte più avanti."
    },
    "esperienze": [
      {
        "titolo": "Addizionare valori opposti",
        "parametri": {
          "op": "addq",
          "a": 7,
          "b": -7,
          "pc": 64
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzione = addq; %rax = 7; %rbx = -7; PC iniziale = 64.",
          "Parti da «Stato architetturale» e annota PC = 0x40, %rax = 7, %rbx = -7, CC iniziali = ZF=0 · SF=0 · OF=0.",
          "In «Effetto descritto dall’ISA» calcola −7+7. Apri «Stato successivo» e confronta %rax, %rbx e ZF con lo stato iniziale.",
          "Raggiungi «Stato successivo» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Stato successivo» leggi PC = 0x42, %rax = 7, %rbx = 0, CC = ZF=1 · SF=0 · OF=0.",
        "ragionamento": "addq %rax,%rbx calcola −7+7=0 e lo scrive in %rbx. %rax resta 7, ZF si attiva per il risultato nullo e il PC passa da 64 a 66, cioè 0x42.",
        "attesi": [
          {
            "passo": 2,
            "campo": "PC",
            "valore": "0x42"
          },
          {
            "passo": 2,
            "campo": "%rax",
            "valore": "7"
          },
          {
            "passo": 2,
            "campo": "%rbx",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "CC",
            "valore": "ZF=1 · SF=0 · OF=0"
          }
        ]
      },
      {
        "titolo": "Copiare conservando i flag",
        "parametri": {
          "op": "rrmovq",
          "a": 7,
          "b": -7,
          "pc": 64
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzione = rrmovq; %rax = 7; %rbx = -7; PC iniziale = 64.",
          "Parti da «Stato architetturale» e annota PC = 0x40, %rax = 7, %rbx = -7, CC iniziali = ZF=0 · SF=0 · OF=0.",
          "In «Effetto descritto dall’ISA» segui la copia da %rax a %rbx. Controlla che la riga CC conservi il valore iniziale anche se %rbx cambia.",
          "Raggiungi «Stato successivo» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Stato successivo» leggi PC = 0x42, %rax = 7, %rbx = 7, CC = ZF=0 · SF=0 · OF=0.",
        "ragionamento": "rrmovq trasferisce il 7 di %rax in %rbx. La copia conserva i CC iniziali tutti a zero; il PC avanza comunque di due byte fino a 0x42.",
        "attesi": [
          {
            "passo": 2,
            "campo": "PC",
            "valore": "0x42"
          },
          {
            "passo": 2,
            "campo": "%rax",
            "valore": "7"
          },
          {
            "passo": 2,
            "campo": "%rbx",
            "valore": "7"
          },
          {
            "passo": 2,
            "campo": "CC",
            "valore": "ZF=0 · SF=0 · OF=0"
          }
        ]
      }
    ]
  },
  "3.3.2": {
    "scopo": "Il processore deve riconoscere il confine di un’istruzione in una sequenza di byte. Studierai come il codice iniziale stabilisce i campi presenti e quindi l’indirizzo del primo byte successivo.",
    "teoria": [
      "Per eseguire un programma il processore legge una sequenza di byte, gruppi di otto cifre binarie che occupano posizioni consecutive in memoria. Deve potervi riconoscere il confine tra due istruzioni, anche se hanno lunghezze diverse. Nella macchina didattica Y86-64 il primo byte indica come leggere i successivi. Le quattro cifre binarie di sinistra formano la classe, detta icode, e le quattro di destra la funzione, ifun.",
      "La notazione esadecimale, introdotta da 0x, usa una cifra per ogni gruppo di quattro bit, chiamato nibble. Così nel byte 0x30 si leggono direttamente classe 3 e funzione 0. Questo codice introduce irmovq, che scrive una costante in un registro. Seguono un byte con due identificatori rA:rB e otto byte per la costante, chiamata valC. Nel caso F3, F indica che la sorgente rA è assente e 3 identifica %rbx come destinazione rB; il byte degli identificatori occupa comunque una posizione.",
      "Il PC, contatore di programma, contiene l’indirizzo del primo byte da leggere. La costante 291, cioè 0x123, appare in memoria come 23 01 seguito da sei byte nulli, poiché la convenzione little-endian colloca prima il byte di peso minore. Dal primo indirizzo 0x40 l’intera irmovq occupa dieci posizioni. Il nome valP indica 0x4A, la prima posizione che resta dopo l’ultimo byte prelevato.",
      "Il selettore consente di confrontare altri tre formati. XORQ, che combina i bit di due registri ponendo 1 dove differiscono, occupa il byte dell’operazione e quello dei registri, per un totale di due. JNE, salto subordinato a una condizione, occupa un byte di operazione e otto di destinazione, per un totale di nove. RET, ritorno da procedura, occupa un byte. In questa animazione si delimitano i rispettivi codici: valP resta l’indirizzo sequenziale successivo anche quando l’esecuzione di un salto o di un ritorno sceglierà un’altra destinazione."
    ],
    "introduzione": [
      "Qui puoi comprendere come il formato di un’istruzione permetta di riconoscerne la fine nella memoria. Ogni casella contiene un byte; il primo divide il comando in classe icode e funzione ifun, che stabiliscono i campi successivi. Il valore valP indica il primo indirizzo dopo l’intera codifica, ottenuto aggiungendo la sua lunghezza al PC iniziale.",
      "Carica «Decodificare una costante in un registro» e avanza con «Passo successivo», contando codice, byte dei registri e otto byte della costante. Confronta i dieci byte con valP=0x4A. Carica poi «Delimitare un salto condizionale»: l’assenza del byte dei registri riduce il totale a nove e porta valP a 0x49. Tieni distinto questo confine sequenziale dalla destinazione 0x123 contenuta nel salto."
    ],
    "lettura": "Le caselle sono byte disposti per indirizzo crescente, con spostamenti +0, +1 e così via. Il primo byte si separa in icode e ifun; gli altri rappresentano registri e costante quando previsti. Il punto valP indica il confine dopo la codifica.",
    "conclusione": "La lunghezza dipende dal formato selezionato dal primo byte. La costante occupa otto byte little-endian quando presente; valP si ottiene sommando la lunghezza al PC e designa il successore sequenziale del codice.",
    "controlli": {
      "op": "Formato Y86-64 da decodificare; ciascuna scelta stabilisce quali campi seguono il primo byte.",
      "pc": "Indirizzo del primo byte dell’istruzione.",
      "k": "Valore della costante a 64 bit usata da irmovq o come destinazione di jne; per le altre scelte il campo è assente."
    },
    "esperienze": [
      {
        "titolo": "Decodificare una costante in un registro",
        "parametri": {
          "op": "irmovq",
          "pc": 64,
          "k": 291
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzione = irmovq; PC iniziale = 64; Costante per irmovq e jne = 291.",
          "Parti da «Primo byte» e annota Byte = 0x30, icode = 3, ifun = 0.",
          "In «Campi restanti» conta un byte di codice, uno per rA:rB e otto per 0x123. Leggi 23 01 come i primi due byte della costante.",
          "Raggiungi «Confine» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Confine» leggi PC = 0x40, Byte = 10, valP = 0x4A.",
        "ragionamento": "irmovq usa 1+1+8=10 byte. La costante 291=0x123 appare come 23 01 e sei zeri; partendo da 0x40, il confine è 64+10=74=0x4A.",
        "attesi": [
          {
            "passo": 2,
            "campo": "PC",
            "valore": "0x40"
          },
          {
            "passo": 2,
            "campo": "Byte",
            "valore": "10"
          },
          {
            "passo": 2,
            "campo": "valP",
            "valore": "0x4A"
          }
        ]
      },
      {
        "titolo": "Delimitare un salto condizionale",
        "parametri": {
          "op": "jne",
          "pc": 64,
          "k": 291
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzione = jne; PC iniziale = 64; Costante per irmovq e jne = 291.",
          "Parti da «Primo byte» e annota Byte = 0x74, icode = 7, ifun = 4.",
          "In «Campi restanti» verifica l’assenza del byte rA:rB. Conta il codice 74 e gli otto byte della destinazione prima di calcolare valP.",
          "Raggiungi «Confine» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Confine» leggi PC = 0x40, Byte = 9, valP = 0x49.",
        "ragionamento": "jne usa 1+8=9 byte perché la destinazione è una costante e manca il campo registri. Il confine sequenziale diventa 64+9=73=0x49; la decisione del salto appartiene alla successiva esecuzione.",
        "attesi": [
          {
            "passo": 2,
            "campo": "PC",
            "valore": "0x40"
          },
          {
            "passo": 2,
            "campo": "Byte",
            "valore": "9"
          },
          {
            "passo": 2,
            "campo": "valP",
            "valore": "0x49"
          }
        ]
      }
    ]
  },
  "3.3.3": {
    "scopo": "Un carico deve trovare otto byte in memoria e ricomporli in un registro. Cambierai lo spostamento per seguire separatamente il calcolo dell’indirizzo e la costruzione della parola letta.",
    "teoria": [
      "Si può pensare alla memoria come a una fila di celle numerate. Ogni cella contiene un byte, ossia otto bit, e il suo numero è un indirizzo. Il processore dispone inoltre di piccoli contenitori interni, i registri. Nel comando didattico Y86-64 mrmovq D(%rbx),%rax, il registro %rbx indica da dove partire, D di quante celle spostarsi e %rax dove conservare il dato letto. Nelle caselle valB indica il contenuto della base e valC lo spostamento scritto nel comando.",
      "Se la base vale 16 e lo spostamento vale 4, il primo byte si trova all’indirizzo 20. La somma 16 + 4, chiamata valE nella figura, serve alla memoria per scegliere la prima cella. Il dato richiesto è una parola da 64 bit, quindi la lettura comprende anche le sette celle successive, fino alla posizione 27.",
      "La memoria dell’esperimento è predisposta in modo che ogni cella contenga il triplo del proprio indirizzo, ridotto al resto della divisione per 256. La prima cella letta contiene 60 e l’ultima 81, scritti 3C e 51 in base sedici. Il prefisso 0x segnala questa base quando compare davanti a un valore. Poiché la macchina memorizza per primo il byte di peso minore, nella parola letta valM, 3C si trova all’estremità destra e 51 all’estremità sinistra. Per ricostruirla, ogni byte successivo pesa 256 volte il precedente.",
      "Anche il codice dell’istruzione occupa celle di memoria, a partire dal PC, il contatore di programma. Qui il codice comincia a 0x40 e mrmovq occupa dieci byte, perciò il PC successivo è 0x4A. Questi indirizzi riguardano il programma; i valori fra valE e valE+7 individuano invece gli otto byte del dato. La conclusione della traccia mostra insieme la parola caricata in %rax e la posizione da cui proseguirà il programma."
    ],
    "introduzione": [
      "L’esperimento permette di separare il calcolo di un indirizzo dalla costruzione del dato letto. Il carico somma base e spostamento per trovare valE, poi legge otto byte consecutivi e li riunisce nella parola valM. La disposizione little-endian assegna al primo byte letto il peso minore; il registro %rax riceve l’intera parola così ricostruita.",
      "Carica «Leggere otto byte dopo la base» e raggiungi «Accesso» con «Passo successivo». Confronta l’indirizzo 20 con il primo contenuto 3C, quindi segui quel byte fino all’estremità destra della parola in %rax. Ripeti con «Leggere otto byte prima della base»: cambiano indirizzi e contenuti del dato, mentre il PC successivo resta 0x4A perché la lunghezza dell’istruzione rimane dieci byte."
    ],
    "lettura": "La somma valB+valC produce l’indirizzo valE. Le otto caselle mostrano poi i byte in ordine di indirizzo crescente; il registro in basso li presenta secondo il peso numerico. Il byte letto per primo occupa la parte meno significativa della parola.",
    "conclusione": "Un carico usa valE per individuare le celle e trasferisce valM nel registro. In little-endian il peso del byte all’indirizzo valE+i è 256 elevato a i, cosicché indirizzo e contenuto rimangono grandezze distinte.",
    "controlli": {
      "b": "Indirizzo base contenuto in %rbx, espresso come numero di byte dall’inizio della memoria.",
      "d": "Spostamento con segno aggiunto alla base; un valore negativo sceglie una cella precedente."
    },
    "esperienze": [
      {
        "titolo": "Leggere otto byte dopo la base",
        "parametri": {
          "b": 16,
          "d": 4
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Base %rbx = 16; Spostamento con segno = 4.",
          "Parti da «Decodifica» e annota valB = 16, valC = 4.",
          "In «Accesso» calcola 16+4 e individua le celle da 20 a 27. Annota i byte da 3C a 51, poi ricomponili al passo «Scrittura».",
          "Raggiungi «Scrittura» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Scrittura» leggi %rax = valM = 0x514E4B4845423F3C, PC successivo = 0x4A.",
        "ragionamento": "L’indirizzo è 20=0x14. La regola della memoria produce i byte 3C 3F 42 45 48 4B 4E 51; assegnando al primo il peso minore si ottiene 0x514E4B4845423F3C in %rax.",
        "attesi": [
          {
            "passo": 2,
            "campo": "%rax = valM",
            "valore": "0x514E4B4845423F3C"
          },
          {
            "passo": 2,
            "campo": "PC successivo",
            "valore": "0x4A"
          }
        ]
      },
      {
        "titolo": "Leggere otto byte prima della base",
        "parametri": {
          "b": 16,
          "d": -8
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Base %rbx = 16; Spostamento con segno = -8.",
          "Parti da «Decodifica» e annota valB = 16, valC = -8.",
          "In «Accesso» calcola 16−8 e individua le celle da 8 a 15. Annota i byte da 18 a 2D e colloca il primo nella parte destra della parola finale.",
          "Raggiungi «Scrittura» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Scrittura» leggi %rax = valM = 0x2D2A2724211E1B18, PC successivo = 0x4A.",
        "ragionamento": "L’indirizzo è 8=0x08. I byte 18 1B 1E 21 24 27 2A 2D formano 0x2D2A2724211E1B18; il PC del codice resta indipendente da questo indirizzo dati e avanza a 0x4A.",
        "attesi": [
          {
            "passo": 2,
            "campo": "%rax = valM",
            "valore": "0x2D2A2724211E1B18"
          },
          {
            "passo": 2,
            "campo": "PC successivo",
            "valore": "0x4A"
          }
        ]
      }
    ]
  },
  "3.3.4": {
    "scopo": "Una lettura può iniziare dentro la memoria e oltrepassarne il limite con gli ultimi byte. Individuerai il confine valido di un carico a otto byte e il conseguente controllo della scrittura nel registro.",
    "teoria": [
      "Per leggere una parola dalla memoria il processore deve sia riconoscere l’istruzione, sia poter raggiungere tutti i byte richiesti. Sono due controlli distinti. Nella macchina didattica Y86-64 un byte contiene otto bit e ciascun byte ha un proprio indirizzo. Il modello fornisce per intero l’istruzione da decodificare, mentre la memoria destinata ai dati comprende le 64 posizioni numerate da 0 a 63.",
      "Il comando mrmovq richiede otto byte consecutivi. Un accesso che cominci da 56 tocca le celle da 56 a 63 e termina regolarmente, con lo stato AOK. Partendo da 57 si dovrebbe raggiungere anche la posizione 64, per cui compare ADR, il segnale di errore di indirizzo. La verifica riguarda dunque entrambi gli estremi della parola.",
      "Un comando halt ordina esplicitamente l’arresto, contrassegnato da HLT. Un primo byte di classe riservata produce invece INS, con cui si segnala che la codifica letta è invalida. In questi due casi il processore decide già dalla codifica del comando e il valore scelto per l’indirizzo dati perde rilievo.",
      "Nella figura Stat riassume lo stato conclusivo dell’istruzione. La voce «Scrittura di valM» è un’abilitazione: 1 autorizza a copiare nel registro la parola fornita dalla memoria, chiamata valM; 0 lascia il registro invariato. Quel numero descrive quindi il permesso di scrittura, mentre il contenuto della parola avrebbe otto byte. Le scritture 0x50, 0x00 e 0xF0 rappresentano in base sedici i byte di codice tra cui scegliere."
    ],
    "introduzione": [
      "La simulazione serve a comprendere perché la validità di un carico dipenda dall’intera parola richiesta. La memoria dati contiene 64 byte, numerati da 0 a 63; una lettura ne richiede otto consecutivi. Stat riassume l’esito dell’istruzione e l’abilitazione di scrittura stabilisce se il registro può ricevere valM, il dato restituito dalla memoria.",
      "Carica «Un carico che attraversa il limite» e avanza fino ai controlli locali: dall’indirizzo 59 la richiesta termina a 66. Confronta questo estremo con 63, poi osserva ADR e la scrittura disabilitata. Carica «L’ultimo carico interamente valido» e verifica l’intervallo 56…63: AOK e abilitazione 1 indicano che tutti gli otto byte sono disponibili e il risultato può essere acquisito."
    ],
    "lettura": "La figura confronta l’intervallo richiesto con la memoria dati 0…63. Leggi insieme l’indirizzo iniziale e l’ultimo byte; il riquadro Stat riporta l’esito e la scrittura di valM indica se il registro può ricevere un dato.",
    "conclusione": "Un accesso è valido soltanto se tutti i byte richiesti rientrano nell’area disponibile. Per una parola di otto byte in 64 celle, l’ultimo inizio valido è 56, perché 56+7=63.",
    "controlli": {
      "op": "Comando fornito al decodificatore: carico, arresto esplicito oppure classe riservata.",
      "addr": "Primo indirizzo della parola dati; il carico richiede anche le sette celle successive."
    },
    "esperienze": [
      {
        "titolo": "Un carico che attraversa il limite",
        "parametri": {
          "op": "ld",
          "addr": 59
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzione da prelevare = 50 · mrmovq; Indirizzo effettivo della lettura = 59.",
          "Parti da «Prelievo» e annota Primo byte = 0x50, Memoria dati = 0…63.",
          "In «Controlli locali» somma 7 all’indirizzo 59. Confronta l’ultimo byte 66 con il limite 63 prima di verificare Stat.",
          "Raggiungi «Stato architetturale» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Stato architetturale» leggi Stat = ADR, Scrittura di valM = 0.",
        "ragionamento": "Il carico parte da 59 e richiede fino a 59+7=66. Poiché le celle disponibili terminano a 63, compare ADR e la scrittura di valM è disabilitata.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Stat",
            "valore": "ADR"
          },
          {
            "passo": 2,
            "campo": "Scrittura di valM",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "L’ultimo carico interamente valido",
        "parametri": {
          "op": "ld",
          "addr": 56
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzione da prelevare = 50 · mrmovq; Indirizzo effettivo della lettura = 56.",
          "Parti da «Prelievo» e annota Primo byte = 0x50, Memoria dati = 0…63.",
          "In «Controlli locali» somma 7 all’indirizzo 56. Controlla che l’estremo coincida con 63, poi osserva l’abilitazione della scrittura.",
          "Raggiungi «Stato architetturale» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Stato architetturale» leggi Stat = AOK, Scrittura di valM = 1.",
        "ragionamento": "Il carico parte da 56 e termina esattamente a 63. Tutti gli otto byte appartengono alla memoria, quindi Stat=AOK e il registro può acquisire valM.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Stat",
            "valore": "AOK"
          },
          {
            "passo": 2,
            "campo": "Scrittura di valM",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "3.3.5": {
    "scopo": "Una chiamata deve raggiungere una procedura e conservarne il punto di ritorno. Confronterai due posizioni della stessa call per seguire l’indirizzo salvato sulla pila e quello ripristinato da ret.",
    "teoria": [
      "Un programma che affidi un calcolo a una procedura deve riprendere dal punto giusto quando la procedura finisce. Il processore conserva perciò due indirizzi distinti, quello della procedura da raggiungere e quello dell’istruzione che seguirà la chiamata. Il contatore di programma, o PC, dice da dove prelevare il prossimo comando. Nella macchina didattica Y86-64, call esegue la chiamata e ret realizza il ritorno.",
      "L’indirizzo da ricordare trova posto sulla pila, una porzione di memoria in cui si recupera per primo l’ultimo valore depositato. Il registro %rsp indica la cima corrente. Poiché ciascun indirizzo occupa otto byte e la pila cresce verso gli indirizzi minori, call sottrae otto a %rsp e scrive l’indirizzo di ritorno nella parola appena riservata.",
      "Se call comincia al byte 64 e occupa nove byte, la ripresa è al byte 73, ossia 0x49 in base sedici. Con %rsp inizialmente a 192, quel valore viene depositato alla posizione 184. La procedura dell’esempio contiene soltanto ret, che legge 73 dalla pila, lo consegna al PC e riporta %rsp a 192.",
      "Le etichette valP e M8[indirizzo] consentono di seguire lo stesso valore fra posizioni diverse. valP è l’indirizzo che segue i nove byte della call; M8[indirizzo] indica la parola di otto byte che comincia alla posizione fra parentesi. Un byte contiene otto bit e i valori preceduti da 0x sono in base sedici. Liberare la parola mediante ret significa riportare il puntatore oltre di essa: il suo contenuto può rimanere nelle celle finché una scrittura successiva lo sostituisce. La subroutine è la procedura chiamata, che nell’esperimento esegue immediatamente ret."
    ],
    "introduzione": [
      "Questa attività permette di seguire gli indirizzi necessari a una chiamata di procedura e al suo ritorno. Il PC sceglie il codice da eseguire; %rsp indica la cima della pila, dove call conserva l’indirizzo di ripresa. Ret recupera quella parola e la usa come prossimo PC. La destinazione della procedura e il punto di ritorno svolgono quindi ruoli distinti.",
      "Carica «Chiamare da 0x40» e avanza con «Passo successivo», seguendo valP=0x49 nella parola di pila all’indirizzo 0xB8. Confrontalo con la destinazione 0x320 raggiunta dalla call e osserva quale valore ret trasferisce al PC. Carica poi «Spostare il punto di chiamata»: la stessa cella conserva ora 0x59, mentre %rsp torna comunque a 0xC0 dopo il ritorno."
    ],
    "lettura": "Segui separatamente il PC del codice, il puntatore %rsp e la parola M8 scritta in pila. La call sposta la cima verso un indirizzo minore e vi deposita valP; ret legge quella stessa casella e ripristina entrambi i percorsi.",
    "conclusione": "La destinazione della chiamata e l’indirizzo di ritorno svolgono ruoli diversi. call salva il proprio successore sequenziale e ret lo recupera, mentre il puntatore alla pila torna al valore iniziale dopo la coppia.",
    "controlli": {
      "pc": "Indirizzo del primo byte di call; la codifica occupa nove byte, quindi determina il valore salvato per il ritorno.",
      "sp": "Indirizzo della cima prima della chiamata; si riservano otto byte sottraendo otto.",
      "t": "Indirizzo della procedura raggiunta dalla call; nell’esempio la procedura esegue subito ret."
    },
    "esperienze": [
      {
        "titolo": "Chiamare da 0x40",
        "parametri": {
          "pc": 64,
          "sp": 192,
          "t": 800
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: PC iniziale = 64; %rsp iniziale = 192; Indirizzo della subroutine = 800.",
          "Parti da «Prelievo della call» e annota PC = 0x40, valP = 0x49, Destinazione = 0x320.",
          "In «Ingresso nella subroutine» confronta la destinazione 0x320 con il valore 0x49 scritto a 0xB8. In «Ritorno» segui quale dei due entra nel PC.",
          "Raggiungi «Ritorno» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Ritorno» leggi Indirizzo letto = 0xB8, PC = 0x49, %rsp = 0xC0.",
        "ragionamento": "La call comincia a 64 e termina prima del byte 73=0x49. La pila passa da 192 a 184 e conserva 73; ret lo usa come PC e riporta %rsp a 192.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Indirizzo letto",
            "valore": "0xB8"
          },
          {
            "passo": 2,
            "campo": "PC",
            "valore": "0x49"
          },
          {
            "passo": 2,
            "campo": "%rsp",
            "valore": "0xC0"
          }
        ]
      },
      {
        "titolo": "Spostare il punto di chiamata",
        "parametri": {
          "pc": 80,
          "sp": 192,
          "t": 800
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: PC iniziale = 80; %rsp iniziale = 192; Indirizzo della subroutine = 800.",
          "Parti da «Prelievo della call» e annota PC = 0x50, valP = 0x59, Destinazione = 0x320.",
          "In «Ingresso nella subroutine» verifica che la cima sia ancora 0xB8 e che la parola salvata sia cambiata. Confronta il PC finale con il nuovo valP.",
          "Raggiungi «Ritorno» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Ritorno» leggi Indirizzo letto = 0xB8, PC = 0x59, %rsp = 0xC0.",
        "ragionamento": "Spostando call a 80, il successore diventa 80+9=89=0x59. La posizione in pila e la destinazione 800 restano uguali, mentre ret recupera il nuovo indirizzo 89.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Indirizzo letto",
            "valore": "0xB8"
          },
          {
            "passo": 2,
            "campo": "PC",
            "valore": "0x59"
          },
          {
            "passo": 2,
            "campo": "%rsp",
            "valore": "0xC0"
          }
        ]
      }
    ]
  },
  "3.3.6": {
    "scopo": "L’etichetta di un salto dipende dallo spazio occupato dal codice che la precede. Modificherai il numero di nop per ricostruire le due passate dell’assemblatore e i byte della destinazione.",
    "teoria": [
      "Nel testo di un programma si può scrivere «salta a fine» anche quando la posizione di fine dipende dalla lunghezza delle istruzioni che la precedono. Fine è un’etichetta, cioè un nome assegnato a una posizione del programma. L’assemblatore, che traduce le istruzioni scritte dal programmatore nei byte letti dal processore, deve sostituire a quel nome un indirizzo.",
      "Alla prima lettura del testo l’assemblatore conta quanti byte, gruppi di otto bit, richiede ogni istruzione e associa a ciascuna etichetta la posizione raggiunta. Una seconda lettura permette di inserire nei salti gli indirizzi ormai noti. Nel modello Y86-64 irmovq carica una costante in un registro e occupa dieci byte; jmp trasferisce l’esecuzione alla destinazione e ne occupa nove; nop lascia avanzare l’esecuzione e ne occupa uno. Halt arresta il programma ed è posto all’etichetta fine.",
      "Se il programma comincia al byte 64 e fra jmp e fine si inseriscono tre nop, fine si trova a 64 + 10 + 9 + 3, cioè 86. L’etichetta designa il primo byte di halt senza occupare spazio. Nel salto la destinazione 86 compare come 56 in base sedici, seguito da sette byte nulli, secondo l’ordine dal byte meno significativo al più significativo.",
      "Il PC iniziale scelto nei controlli indica l’origine dell’intero programma. La «caduta sequenziale del jmp» è la posizione immediatamente successiva ai suoi nove byte, mentre il salto raggiunge fine dopo l’eventuale sequenza di nop. Nella codifica 70 è il byte esadecimale dell’operazione jmp e gli otto byte seguenti contengono l’indirizzo assoluto della destinazione. Il loro ordine, dal peso minore al maggiore, si chiama little-endian; spostare l’origine o aggiungere nop cambia l’indirizzo inserito in quei byte."
    ],
    "introduzione": [
      "L’attività consente di capire come un assemblatore trasformi un’etichetta in un indirizzo codificato. L’etichetta è un nome assegnato a una posizione e occupa zero byte. Una prima passata conta le lunghezze delle istruzioni; la seconda inserisce nei riferimenti gli indirizzi ottenuti. Le figure collegano così la disposizione del programma ai byte del salto.",
      "Carica «Saltare tre nop» e avanza con «Passo successivo», sommando all’indirizzo iniziale 64 le lunghezze 10, 9 e 3. Confronta fine=0x56 con la continuazione sequenziale 0x53, poi osserva la destinazione nei byte del jmp. Ripeti con «Un bersaglio subito dopo il salto»: eliminando le nop, i due indirizzi coincidono e il campo della destinazione contiene 53 seguito da sette zeri."
    ],
    "lettura": "Il primo schema assegna indirizzi alle istruzioni. La tabella dei simboli associa fine al primo byte di halt; la riga di byte del jmp inserisce quell’indirizzo dopo il codice 70. Confronta destinazione e caduta sequenziale.",
    "conclusione": "Le etichette sono nomi di indirizzi e occupano zero byte. Il conteggio delle lunghezze stabilisce la loro posizione; la seconda passata inserisce nei riferimenti l’indirizzo già determinato.",
    "controlli": {
      "pc": "Indirizzo iniziale del programma, dal quale contare irmovq e jmp.",
      "n": "Numero di istruzioni nop da un byte fra il salto e l’etichetta fine."
    },
    "esperienze": [
      {
        "titolo": "Saltare tre nop",
        "parametri": {
          "pc": 64,
          "n": 3
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: PC iniziale = 64; nop fra jmp e destinazione = 3.",
          "Parti da «Prima passata» e annota irmovq = 0x40, jmp = 0x4A, Numero di nop = 3.",
          "In «Prima passata» conta i 10 byte di irmovq e i 9 di jmp. In «Tabella dei simboli» aggiungi le tre nop per ottenere fine.",
          "Raggiungi «Seconda passata» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Seconda passata» leggi Byte del jmp = 70 56 00 00 00 00 00 00 00, PC dopo il salto = 0x56.",
        "ragionamento": "fine si trova a 64+10+9+3=86=0x56. Il salto comincia a 0x4A e codifica la destinazione come 56 seguito da sette zeri, raggiungendo 0x56.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Byte del jmp",
            "valore": "70 56 00 00 00 00 00 00 00"
          },
          {
            "passo": 2,
            "campo": "PC dopo il salto",
            "valore": "0x56"
          }
        ]
      },
      {
        "titolo": "Un bersaglio subito dopo il salto",
        "parametri": {
          "pc": 64,
          "n": 0
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: PC iniziale = 64; nop fra jmp e destinazione = 0.",
          "Parti da «Prima passata» e annota irmovq = 0x40, jmp = 0x4A, Numero di nop = 0.",
          "In «Tabella dei simboli» confronta fine e la caduta sequenziale: con zero nop devono coincidere. Verifica poi i byte inseriti nel jmp.",
          "Raggiungi «Seconda passata» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Seconda passata» leggi Byte del jmp = 70 53 00 00 00 00 00 00 00, PC dopo il salto = 0x53.",
        "ragionamento": "Con zero nop, fine è a 64+10+9=83=0x53. È anche la prima posizione dopo il salto; i byte del jmp cambiano la costante in 53 seguito da sette zeri.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Byte del jmp",
            "valore": "70 53 00 00 00 00 00 00 00"
          },
          {
            "passo": 2,
            "campo": "PC dopo il salto",
            "valore": "0x53"
          }
        ]
      }
    ]
  },
  "3.3.7": {
    "scopo": "Decoderai un byte della macchina didattica Y86-64. Separando classe e funzione, ricaverai il nome dell’operazione e riconoscerai quali informazioni devono ancora provenire dai byte successivi.",
    "teoria": [
      "L’indirizzo di prelievo porta il processore al primo byte di un’istruzione. Per stabilire quale circuito attivare occorre interpretare i campi di quel byte secondo le regole della macchina. Nel formato didattico Y86-64 i bit sono ripartiti in due gruppi uguali. Il gruppo di sinistra identifica una famiglia di operazioni, chiamata icode, mentre il gruppo di destra sceglie un membro di quella famiglia, ifun.",
      "Un byte contiene otto cifre binarie e si può scrivere con due cifre esadecimali, perché ciascuna cifra in base sedici rappresenta esattamente quattro bit. Il prefisso 0x avverte che la scrittura è esadecimale. Nel caso 0x63 si riconoscono così la famiglia 6, riservata alle operazioni aritmetiche e logiche su registri, e la funzione 3, che in quella famiglia seleziona XOR.",
      "La cifra della funzione acquista significato entro la famiglia stabilita dalla prima cifra. La famiglia 6 è indicata anche con OPq: comprende operazioni aritmetiche e logiche su parole di 64 bit conservate nei registri, piccole memorie interne del processore. La funzione 3 sceglie xorq, che pone a 1 ciascun bit del risultato quando i due bit degli operandi differiscono. Il byte 0x63 identifica quindi l’operazione; per calcolarne un risultato numerico servirebbero anche il byte successivo, che sceglie i registri, e i loro contenuti."
    ],
    "introduzione": [
      "Il problema svolto permette di ricavare il nome di un’operazione dal suo primo byte. In Y86-64 la metà alta, icode, identifica una famiglia; la metà bassa, ifun, sceglie una funzione entro quella famiglia. Una cifra esadecimale rappresenta quattro bit: dividere 0x63 nelle due cifre rende osservabile la struttura gerarchica della decodifica.",
      "Inserisci la previsione nel campo «Quale operazione identifica 0x63?» e premi «Passo successivo». Confronta 0110 con la famiglia OPq, quindi 0011 con la funzione XOR, arrivando al nome xorq. Usa «Precedente» per rileggere le due scelte nell’ordine. Il risultato identifica l’operazione; il byte seguente dovrà ancora indicare i registri dai quali ricavare i dati del calcolo."
    ],
    "lettura": "Il byte 0x63 viene diviso nelle due cifre esadecimali e nei corrispondenti gruppi binari. La metà alta seleziona la famiglia OPq, la metà bassa l’operazione entro quella famiglia; il registro operando appartiene al byte seguente.",
    "conclusione": "Il significato di ifun dipende dalla classe icode. Una decodifica corretta interpreta prima la famiglia, poi la funzione e infine gli eventuali altri campi dell’istruzione.",
    "procedura": [
      "Leggi i «Dati iniziali»: All’indirizzo di prelievo la memoria contiene 0x63. Il primo byte di un’istruzione Y86-64 contiene i campi icode e ifun.",
      "Scrivi una previsione per «Quale operazione identifica 0x63?». Conservala mentre inizi la ricostruzione con «Passo successivo».",
      "In «Separare» scrivi 0x63 come 0110 0011. In «Codice principale» identifica OPq e in «Funzione» associa ifun=3 alla specifica operazione.",
      "Raggiungi «Funzione» e confronta la previsione con i valori finali. Usa «Ricomincia il percorso» per ripetere i passaggi con il ragionamento ormai completo."
    ],
    "risultato": "La risposta alla previsione è xorq. Con ifun = 3 l’operazione selezionata è XOR. Il byte successivo specifica i registri.",
    "ragionamento": "La cifra alta 6 identifica OPq, la famiglia aritmetica e logica su registri. La cifra bassa 3 seleziona XOR, quindi il nome è xorq; il byte successivo specificherà sorgente e destinazione."
  },
  "3.3.8": {
    "scopo": "Ricostruirai il confine di irmovq contando i campi presenti. L’esercizio collega la struttura binaria dell’istruzione al PC sequenziale calcolato dal processore.",
    "teoria": [
      "Il processore legge le istruzioni dalla memoria sotto forma di byte, gruppi di otto bit. Il registro PC, una piccola memoria chiamata contatore di programma, conserva l’indirizzo del primo byte dell’istruzione corrente. Il formato didattico Y86-64 assegna al primo byte il compito di indicare l’operazione, dalla quale si stabilisce quanti altri byte appartengano alla stessa istruzione.",
      "Nelle etichette, rA e rB sono i campi che identificano i registri. I loro numeri condividono un byte, quattro bit per ciascuno; un identificatore F può segnalare un operando assente senza eliminare il byte dal formato. Il campo valC, quando previsto, contiene una costante che occupa otto byte. L’ordine dei campi consente di delimitare l’istruzione prima di eseguirla.",
      "Con un byte di operazione, un byte per i registri e otto per una costante, l’istruzione occupa dieci indirizzi consecutivi. Se comincia a 0x40, cioè 64, l’ultimo di questi è 73 e la prima posizione seguente è 74, scritta 0x4A. Si arriva a quel numero contando tutti i campi presenti, indipendentemente dal valore che essi contengono.",
      "I due indicatori dell’esercizio valgono 1 se il rispettivo campo è presente e 0 se è assente. La lunghezza è quindi 1+r+8c, dove r indica il byte dei registri e c la costante: il byte di operazione è sempre contato. Nel listato x86-64 RDI contiene il PC, ESI contiene r ed EDX contiene c. LEA calcola l’espressione tra parentesi come somma numerica: la prima istruzione restituisce la lunghezza in EAX e la seconda il PC successivo in ECX. Le parentesi, in questo uso di LEA, descrivono il calcolo e lasciano la memoria intatta."
    ],
    "introduzione": [
      "L’esercitazione serve a ricostruire il confine di un’istruzione a partire dai campi presenti nel suo formato. Il PC indica il primo byte; valP indica il primo byte successivo alla codifica. Per irmovq si contano un byte di operazione, uno che identifica i registri e otto per la costante, qualunque sia il valore contenuto in quest’ultima.",
      "Premi «Carica l’esempio guidato» e compila «Lunghezza (byte)» sommando 1+1+8. Dopo «Registra la previsione», avanza con «Passo successivo» e confronta la lunghezza 10 con valP=74, ottenuto da 64+10. Distingui l’ultimo indirizzo occupato, 73, dal primo disponibile, 74: questa differenza spiega perché il PC sequenziale punti appena oltre la codifica, che inizia a 0x40."
    ],
    "lettura": "Le caselle del formato sono ordinate per indirizzo: codice, registri, costante. I bit che dichiarano la presenza dei campi ne controllano il contributo alla lunghezza; valP si trova appena oltre l’ultima casella.",
    "conclusione": "La lunghezza si ottiene sommando le dimensioni dei campi, mentre valP si ottiene aggiungendola al PC iniziale. Il valore numerico della costante lascia invariata la dimensione del campo che la contiene.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 2, «Ricostruire lunghezza e confine di un’istruzione», traccia 1. La spiegazione numerica seguente riguarda questa combinazione.",
      "Per irmovq al PC 0x40, conta 1 byte di codice, 1 byte rA:rB e 8 byte di costante. Riscrivi anche 0x40 come 64 per controllare la somma in decimale.",
      "Compila la previsione per «Lunghezza (byte)» e premi «Registra la previsione». Poi avanza con «Passo successivo» per verificare il procedimento, anche se la risposta iniziale richiede una correzione.",
      "Confronta i campi del risultato con lo svolgimento. Per rispondere a tutti i quesiti, apri «Apri la prova completa»; con i selettori Esercizio e Traccia puoi poi scegliere altri dati."
    ],
    "risultato": "Per l’esercizio 2, traccia 1, i risultati sono: Lunghezza (byte) = 10; Indirizzo valP = 74.",
    "ragionamento": "I campi occupano 1+1+8=10 byte. Il primo indirizzo successivo è 64+10=74, scritto 0x4A in esadecimale; il byte finale della codifica occupa invece l’indirizzo 73."
  },
  "3.3.9": {
    "scopo": "Seguirai un carico mantenendo separati indirizzo dei dati, contenuto letto e indirizzo del codice. Questa separazione permette di attribuire correttamente gli aggiornamenti di %rax e PC.",
    "teoria": [
      "Per caricare un numero dalla memoria si calcola dapprima la posizione da cui leggere, poi si preleva il contenuto conservato in quella posizione. Nel processore didattico Y86-64 mrmovq legge otto byte, ciascuno formato da otto bit, e li deposita in un registro, una piccola memoria interna. Ottiene l’indirizzo sommando a una base uno spostamento scritto nell’istruzione.",
      "Nella traccia valE è il risultato del calcolo dell’indirizzo, mentre valM è il contenuto che la memoria fornisce a quell’indirizzo. La dimensione degli otto byte letti riguarda il dato. I byte che codificano l’istruzione si trovano nella regione del programma indicata dal PC, il contatore di programma che conserva un indirizzo di memoria.",
      "Con base 0x60, cioè 96, e spostamento 16, il primo byte si trova a 112, ossia 0x70. Se agli indirizzi da 112 a 119 è memorizzata la parola 0x42, nel registro di destinazione entra il suo valore 66. Per individuare la prossima istruzione si torna invece all’indirizzo del codice, qui 0x80, e si aggiungono i dieci byte della codifica, raggiungendo 0x8A.",
      "Il frammento x86-64 rappresenta questi passaggi usando RDI per la base, RSI per lo spostamento e R8 per il PC simulato. LEA prepara l’indirizzo del dato in RDX. RCX indica l’origine della memoria del simulatore, quindi MOV RAX,qword ptr [RCX+RDX] legge da lì una parola di otto byte, detta qword, e la deposita in RAX. L’ultima ADD avanza R8 di dieci. In questa sintassi il primo operando è la destinazione; nella scrittura Y86-64 mrmovq D(%rbx),%rax la destinazione compare invece alla fine."
    ],
    "introduzione": [
      "La ricostruzione permette di attribuire a ogni numero il suo ruolo durante un carico dalla memoria. ValE è l’indirizzo ottenuto sommando base e spostamento; valM è la parola conservata nelle celle raggiunte. Il registro destinazione riceve valM, mentre il PC avanza nella regione del codice secondo la lunghezza dell’istruzione, lungo un percorso distinto.",
      "Ripristina il caso con «Carica l’esempio guidato» e avanza con «Passo successivo», annotando separatamente 0x70, 0x42 e 0x8A. Confronta il primo con 96+16, il secondo con il valore caricato in %rax e il terzo con 128+10. Usa «Precedente» per seguire ogni collegamento: il contenuto letto può differire sia dall’indirizzo che lo individua sia dall’indirizzo della prossima istruzione."
    ],
    "lettura": "La somma base più spostamento alimenta la porta indirizzi della memoria. La parola che la memoria restituisce segue un collegamento distinto verso %rax; il PC procede lungo il percorso del codice e aggiunge la lunghezza dell’istruzione.",
    "conclusione": "L’indirizzo effettivo valE e il dato valM possono avere valori completamente diversi. Il PC sequenziale dipende dalla codifica dell’istruzione, mentre il registro destinazione dipende dal contenuto della memoria dati.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 5, «Separare l’indirizzo dal valore di un carico», traccia 1. La spiegazione numerica seguente riguarda questa combinazione.",
      "Per mrmovq 16(%rbx),%rax con %rbx=0x60 calcola valE. Tieni separata la parola 0x42 conservata lì e usa il PC iniziale 0x80 per ricavare il successore.",
      "Avvia la ricostruzione con «Passo successivo» e controlla ogni trasformazione prima di passare alla successiva.",
      "Confronta i campi del risultato con lo svolgimento. Per rispondere a tutti i quesiti, apri «Apri la prova completa»; con i selettori Esercizio e Traccia puoi poi scegliere altri dati."
    ],
    "risultato": "Per l’esercizio 5, traccia 1, i risultati sono: valE = 112; Nuovo %rax = 66; Nuovo PC = 138.",
    "ragionamento": "La base 0x60 vale 96: 96+16=112=0x70 è valE. La memoria fornisce 0x42=66 e questo entra in %rax; la codifica occupa 10 byte, quindi il PC passa da 128 a 138=0x8A."
  },
  "3.4.1": {
    "scopo": "Seguirai una sottrazione dall’istruzione codificata fino alla scrittura dei risultati. Le tappe permettono di distinguere i segnali interni che si propagano durante un ciclo dai registri che cambiano al fronte finale.",
    "teoria": [
      "Un’istruzione che sottrae due numeri si conclude soltanto quando il processore ha conservato il risultato e sa da dove leggere il prossimo comando. Nel processore sequenziale SEQ tutte queste operazioni trovano posto fra due fronti del clock, il segnale che scandisce gli aggiornamenti. Il disegno separa le fasi affinché si possa seguire la propagazione dei dati all’interno di quel singolo intervallo.",
      "Il contatore di programma, indicato con PC, seleziona i due byte 61 e 03, scritti in base sedici; ogni byte contiene otto bit. Il primo byte identifica subq, la sottrazione, mentre il secondo sceglie i registri %rax e %rbx, piccole memorie interne. I loro vecchi contenuti vengono chiamati valA e valB. L’unità aritmetico-logica, abbreviata ALU, calcola valB−valA: per subq %rax,%rbx il primo operando viene sottratto dal secondo. valP indica l’indirizzo immediatamente successivo ai due byte del codice.",
      "Con %rax a 9 e %rbx a 4, il risultato interno valE è −5. Prima del fronte il valore conservato in %rbx è ancora 4. Al fronte il registro acquisisce −5, l’indicatore di segno si attiva e il PC acquisisce l’indirizzo due byte più avanti. L’operazione aritmetica lascia libera la memoria dati.",
      "Le lettere F, D, E e M della figura indicano rispettivamente prelievo, decodifica, esecuzione e accesso alla memoria. CC raccoglie tre codici di condizione: ZF vale 1 per risultato zero, SF indica un risultato negativo e OF segnala un risultato matematico con segno fuori dall’intervallo rappresentabile. Gli operandi selezionabili mantengono qui OF a zero. Durante E compaiono i nuovi indicatori preparati dalla logica; insieme a %rbx e PC essi diventano stato conservato al fronte conclusivo. Il prefisso 0x usato negli indirizzi indica la base sedici."
    ],
    "introduzione": [
      "La simulazione permette di capire come SEQ realizzi un’istruzione entro un solo ciclo di clock. Le fasi mostrate separano la propagazione interna dei segnali; il fronte finale rende permanenti i risultati nei registri. Seguendo subq vedrai valA e valB provenire dallo stato precedente, valE formarsi nell’unità aritmetico-logica, l’ALU, e infine cambiare insieme destinazione, codici di condizione e PC.",
      "Carica «Una sottrazione con risultato negativo» e avanza fino a «Esecuzione»: confronta valE=−5 con %rbx ancora uguale a 4. Prosegui al fronte e osserva l’acquisizione del risultato insieme al flag di segno e al nuovo PC. Ripeti con «Una sottrazione con risultato positivo», verificando 12−9=3: i passaggi visuali scandiscono il ragionamento, mentre l’intera istruzione occupa sempre un solo periodo."
    ],
    "lettura": "I blocchi seguono prelievo, decodifica, esecuzione, memoria e aggiornamento. I valori valA e valB provengono dai vecchi registri; valE è il risultato preparato dall’ALU. Leggi la riga del fronte per conoscere i valori finalmente conservati.",
    "conclusione": "Nel modello SEQ le fasi illustrate appartengono a un solo ciclo. Il risultato interno si prepara prima del fronte; registro destinazione, flag e PC acquisiscono allora i rispettivi nuovi valori.",
    "controlli": {
      "pc": "Indirizzo del codice subq; i due byte 61 03 determinano l’avanzamento di due posizioni.",
      "a": "Valore sorgente sottratto alla destinazione %rbx.",
      "b": "Vecchio valore della destinazione; l’ALU calcola %rbx−%rax."
    },
    "esperienze": [
      {
        "titolo": "Una sottrazione con risultato negativo",
        "parametri": {
          "pc": 64,
          "a": 9,
          "b": 4
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: PC iniziale = 64; %rax = 9; %rbx = 4.",
          "Parti da «Prelievo» e annota Byte = 61 03, valP = 0x42.",
          "In «Decodifica» annota valA=9 e valB=4. Calcola valB−valA e prevedi il nuovo valore di %rbx, richiesto dal campo di risposta. In «Esecuzione» confronta anche il segno del risultato con SF, prima di raggiungere il fronte.",
          "Raggiungi «Scrittura e PC al fronte» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Scrittura e PC al fronte» leggi %rbx = -5, CC = ZF=0 · SF=1 · OF=0, PC = 0x42.",
        "ragionamento": "L’ALU calcola 4−9=−5. Il risultato è diverso da zero e negativo, quindi ZF=0 e SF=1; al fronte %rbx riceve −5 e il PC avanza da 0x40 a 0x42.",
        "attesi": [
          {
            "passo": 4,
            "campo": "%rbx",
            "valore": "-5"
          },
          {
            "passo": 4,
            "campo": "CC",
            "valore": "ZF=0 · SF=1 · OF=0"
          },
          {
            "passo": 4,
            "campo": "PC",
            "valore": "0x42"
          }
        ]
      },
      {
        "titolo": "Una sottrazione con risultato positivo",
        "parametri": {
          "pc": 64,
          "a": 9,
          "b": 12
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: PC iniziale = 64; %rax = 9; %rbx = 12.",
          "Parti da «Prelievo» e annota Byte = 61 03, valP = 0x42.",
          "In «Decodifica» annota valA=9 e valB=12. Prevedi il nuovo valore di %rbx mediante valB−valA e segui il risultato dall’ALU al registro nel passo finale, controllando anche SF.",
          "Raggiungi «Scrittura e PC al fronte» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Scrittura e PC al fronte» leggi %rbx = 3, CC = ZF=0 · SF=0 · OF=0, PC = 0x42.",
        "ragionamento": "L’ALU calcola 12−9=3. Il risultato è positivo e rappresentabile, quindi ZF, SF e OF restano zero; al fronte %rbx acquisisce 3 e il PC diventa 0x42.",
        "attesi": [
          {
            "passo": 4,
            "campo": "%rbx",
            "valore": "3"
          },
          {
            "passo": 4,
            "campo": "CC",
            "valore": "ZF=0 · SF=0 · OF=0"
          },
          {
            "passo": 4,
            "campo": "PC",
            "valore": "0x42"
          }
        ]
      }
    ]
  },
  "3.4.2": {
    "scopo": "Una push deve usare il valore di un registro e aggiornare la cima della pila. Studierai il bivio con cui il risultato dell’ALU raggiunge sia l’indirizzo della memoria sia il nuovo puntatore.",
    "teoria": [
      "Quando un programma deve mettere da parte un valore per usarlo più tardi, può depositarlo sulla pila. La pila è una zona di memoria in cui l’ultimo valore depositato risulta anche il primo disponibile per il prelievo. Nel processore SEQ il registro %rsp conserva l’indirizzo della cima, mentre l’istruzione pushq %rax deposita una copia del valore custodito nel registro %rax.",
      "La memoria assegna un indirizzo a ogni byte, gruppo di otto bit, e la parola trasferita occupa otto byte, quindi 64 bit. Poiché la pila cresce verso gli indirizzi minori, riservare una parola richiede di sottrarre otto al vecchio %rsp. L’unità aritmetico-logica, indicata con ALU, esegue la sottrazione. Il risultato valE deve arrivare sia alla porta indirizzi della memoria, chiamata RAM nella figura, sia al registro %rsp, che conserverà la nuova cima. RAM è il nome della memoria ad accesso diretto in cui si trova la pila.",
      "Con %rsp a 112 e %rax a 43, la parola comincia all’indirizzo 104, scritto 0x68 in base sedici. Il valore depositato è 43, ovvero 0x2B. Nel disegno il filo proveniente da %rax porta il contenuto, mentre il bivio all’uscita dell’ALU distribuisce l’indirizzo."
    ],
    "introduzione": [
      "Questo esperimento serve a comprendere il percorso dei dati durante pushq, l’istruzione che deposita una parola sulla pila. La pila cresce verso indirizzi minori e ogni parola occupa otto byte. L’unità aritmetico-logica, o ALU, sottrae otto al vecchio %rsp: il risultato valE indica sia dove scrivere in memoria sia il valore che il puntatore dovrà conservare.",
      "Carica «Depositare sotto la cima 112» e avanza con «Passo successivo», mantenendo separati il dato 43 e il puntatore 112. Confronta valE=104 con l’indirizzo 0x68 e il nuovo %rsp, poi osserva la parola scritta 0x2B. Carica «Traslare la cima di otto byte»: l’indirizzo diventa 112, mentre il dato resta 43, mostrando quali collegamenti dipendano dalla posizione della pila."
    ],
    "lettura": "Il banco fornisce separatamente valA, il dato da conservare, e valB, il vecchio puntatore. L’ALU sottrae otto a valB; il suo risultato valE si dirama verso la porta indirizzi e verso %rsp. Il filo dati conserva il valore di %rax.",
    "conclusione": "pushq riserva otto byte sotto la vecchia cima e vi deposita la parola sorgente. Spostare la cima iniziale sposta il luogo della scrittura, mentre il contenuto trasferito dipende dal registro sorgente.",
    "controlli": {
      "sp": "Indirizzo della cima prima di riservare la nuova parola di otto byte.",
      "v": "Valore da conservare sulla pila; viene visualizzato come parola esadecimale a 64 bit."
    },
    "esperienze": [
      {
        "titolo": "Depositare sotto la cima 112",
        "parametri": {
          "sp": 112,
          "v": 43
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Vecchio %rsp = 112; %rax da salvare = 43.",
          "Parti da «Porte di lettura» e annota valA = %rax = 43, valB = %rsp = 112.",
          "In «Esecuzione» calcola 112−8. Nel passo finale confronta valE con l’indirizzo scritto e il nuovo %rsp, poi separali dalla parola 43.",
          "Raggiungi «Memoria e scrittura dei risultati» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Memoria e scrittura dei risultati» leggi Indirizzo = 0x68, Parola scritta = 0x000000000000002B, %rsp = 0x68.",
        "ragionamento": "La nuova parola occupa gli indirizzi da 104 a 111. L’ALU produce 104=0x68, usato dalla memoria e da %rsp; la parola salvata è 43=0x2B.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Indirizzo",
            "valore": "0x68"
          },
          {
            "passo": 2,
            "campo": "Parola scritta",
            "valore": "0x000000000000002B"
          },
          {
            "passo": 2,
            "campo": "%rsp",
            "valore": "0x68"
          }
        ]
      },
      {
        "titolo": "Traslare la cima di otto byte",
        "parametri": {
          "sp": 120,
          "v": 43
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Vecchio %rsp = 120; %rax da salvare = 43.",
          "Parti da «Porte di lettura» e annota valA = %rax = 43, valB = %rsp = 120.",
          "In «Esecuzione» calcola 120−8. Confronta il nuovo indirizzo 112 con quello del primo caso e verifica che il dato resti 43.",
          "Raggiungi «Memoria e scrittura dei risultati» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Memoria e scrittura dei risultati» leggi Indirizzo = 0x70, Parola scritta = 0x000000000000002B, %rsp = 0x70.",
        "ragionamento": "La nuova parola occupa gli indirizzi da 112 a 119. Il puntatore e l’indirizzo diventano 112=0x70, mentre la parola scritta conserva il valore 43.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Indirizzo",
            "valore": "0x70"
          },
          {
            "passo": 2,
            "campo": "Parola scritta",
            "valore": "0x000000000000002B"
          },
          {
            "passo": 2,
            "campo": "%rsp",
            "valore": "0x70"
          }
        ]
      }
    ]
  },
  "3.4.3": {
    "scopo": "Un periodo comune deve consentire la conclusione sia dei calcoli sia dei carichi. Confronterai due percorsi e varierai il selettore aritmetico per riconoscere il componente che impone il ciclo minimo.",
    "teoria": [
      "In un processore a ciclo singolo ogni istruzione dispone dello stesso intervallo per concludersi. Il periodo di clock è la durata di quell’intervallo, compreso fra due istanti di acquisizione dei registri. Se un risultato arriva troppo tardi, il registro a cui è destinato può campionare un valore ancora in transizione. Per scegliere il periodo serve quindi il tempo richiesto dall’istruzione più lenta fra quelle considerate.",
      "I due percorsi rappresentati cominciano dal prelievo dell’istruzione, proseguono con la lettura dei registri e attraversano l’unità aritmetica, l’ALU. Un’operazione aritmetica passa poi attraverso il selettore che sceglie il risultato. Un’istruzione di carico, che deve copiare un dato dalla memoria in un registro, usa invece l’indirizzo appena calcolato per leggere la memoria dati.",
      "Un picosecondo, abbreviato ps, è un millesimo di miliardesimo di secondo. Con 85 ps di prelievo, 30 di lettura e 45 per l’ALU, il tratto comune dura 160 ps. Un selettore da 25 ps porta il totale aritmetico a 185 ps, una memoria da 95 porta il carico a 255. A quest’ultimo totale il modello aggiunge 15 ps di margine riservato ai registri. Tale margine è un dato del modello e resta uguale nei due percorsi."
    ],
    "introduzione": [
      "La simulazione consente di determinare il periodo minimo di un processore a ciclo singolo confrontando le istruzioni più lente. Aritmetica e carico condividono prelievo, lettura dei registri e calcolo nell’ALU, poi attraversano componenti diversi. Le barre mostrano gli arrivi; al maggiore si aggiunge il margine previsto per i registri, così che entrambe le istruzioni possano concludersi nel periodo comune.",
      "Carica «Il carico determina il periodo» e avanza con «Passo successivo», confrontando gli arrivi a 185 e 255 ps. Aggiungi 15 ps al maggiore e controlla il periodo di 270 ps. Fissa il risultato per confronto, poi carica «L’aritmetica diventa il percorso più lento»: il selettore da 120 ps porta l’arrivo aritmetico a 280 ps e il periodo minimo a 295 ps."
    ],
    "lettura": "Le barre condividono fetch, il prelievo, reg, la lettura dei registri, e ALU, il calcolo aritmetico. ValE è il risultato disponibile al termine di questo tratto. Una barra prosegue nel multiplexer mux, il selettore del risultato aritmetico, e l’altra nella memoria dati. La linea T indica il periodo minimo, ottenuto aggiungendo 15 ps all’arrivo più tardivo. Se i due arrivi coincidono, entrambi i percorsi sono limitanti.",
    "conclusione": "Il periodo minimo è il ritardo del percorso più lento più il margine dei registri previsto dal modello. Un componente rallentato può cambiare l’istruzione limitante anche se gli altri tempi restano uguali.",
    "controlli": {
      "fetch": "Ritardo del prelievo dell’istruzione, comune ai due percorsi, in picosecondi.",
      "mem": "Ritardo aggiuntivo con cui la memoria dati fornisce il valore di un carico.",
      "mux": "Ritardo del selettore attraversato dal risultato aritmetico dopo l’ALU."
    },
    "esperienze": [
      {
        "titolo": "Il carico determina il periodo",
        "parametri": {
          "fetch": 85,
          "mem": 95,
          "mux": 25
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Prelievo (ps) = 85; Memoria dati del carico (ps) = 95; Selettore del risultato aritmetico (ps) = 25.",
          "Parti da «Tratto comune» e annota Prelievo (ps) = 85, Arrivo a valE (ps) = 160.",
          "In «Tratto comune» somma 85+30+45. In «Due percorsi» aggiungi separatamente 25 e 95, scegli l’arrivo più tardivo e aggiungi 15 ps per prevedere il periodo minimo richiesto dal campo di risposta.",
          "Raggiungi «Periodo» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Periodo» leggi Cammino limitante = Carico, Periodo minimo (ps) = 270.",
        "ragionamento": "Il tratto comune dura 160 ps. L’aritmetica termina a 185 ps e il carico a 255 ps; aggiungendo 15 ps a quest’ultimo arrivo si ottiene un periodo minimo di 270 ps.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Cammino limitante",
            "valore": "Carico"
          },
          {
            "passo": 2,
            "campo": "Periodo minimo (ps)",
            "valore": "270"
          }
        ]
      },
      {
        "titolo": "L’aritmetica diventa il percorso più lento",
        "parametri": {
          "fetch": 85,
          "mem": 95,
          "mux": 120
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Prelievo (ps) = 85; Memoria dati del carico (ps) = 95; Selettore del risultato aritmetico (ps) = 120.",
          "Parti da «Tratto comune» e annota Prelievo (ps) = 85, Arrivo a valE (ps) = 160.",
          "In «Due percorsi» confronta 160+120 con 160+95. Scegli l’arrivo maggiore e aggiungi 15 ps per prevedere il periodo minimo; controlla poi quale percorso lo ha determinato.",
          "Raggiungi «Periodo» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Periodo» leggi Cammino limitante = Aritmetica, Periodo minimo (ps) = 295.",
        "ragionamento": "Il selettore aritmetico da 120 ps porta quel percorso a 280 ps, oltre i 255 del carico. Con i 15 ps finali il limite sale a 295 ps.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Cammino limitante",
            "valore": "Aritmetica"
          },
          {
            "passo": 2,
            "campo": "Periodo minimo (ps)",
            "valore": "295"
          }
        ]
      }
    ]
  },
  "3.4.4": {
    "scopo": "Deposito e prelievo dalla pila aggiornano entrambi %rsp, usando però indirizzi diversi per l’accesso dati. Partendo dallo stesso stato, confronterai pushq e popq per ricostruire i segnali del selettore di memoria.",
    "teoria": [
      "La pila conserva le parole nell’ordine in cui vi vengono depositate e consente di riprenderle in ordine inverso. Il processore tiene in un registro, %rsp, l’indirizzo della parola in cima. La sua memoria è numerata per byte, mentre ogni parola della pila occupa otto byte consecutivi. Gli indirizzi più piccoli corrispondono allo spazio che la pila può occupare crescendo.",
      "Per aggiungere una parola con pushq, il processore riduce %rsp di otto e usa il nuovo indirizzo per scrivere il contenuto del registro %rax. Per prelevare con popq deve invece raggiungere la parola che è già in cima. Legge quindi al vecchio indirizzo, copia la parola letta in %rax e porta %rsp otto byte più avanti.",
      "Se la cima iniziale è a 96, una pushq scrive a 88 e lascia 88 nel puntatore. Una popq eseguita separatamente dallo stesso stato legge a 96 e lascia 104 nel puntatore. L’unità aritmetico-logica, ALU, prepara valE, il nuovo puntatore; mem_addr indica invece l’indirizzo effettivamente presentato alla memoria. Le abilitazioni mem_read e mem_write valgono 1 per richiedere rispettivamente lettura e scrittura: la coppia 1/0 appartiene alla popq, la coppia 0/1 alla pushq.",
      "I valori valA e valB sono le letture del banco dei registri. ValB fornisce sempre il vecchio %rsp all’ALU. ValA trasporta il contenuto di %rax nella pushq e il vecchio %rsp nella popq, che lo usa come indirizzo di lettura. Questo cambio di significato segue la funzione dei collegamenti selezionati. La memoria, indicata anche come RAM nella figura, riceve un indirizzo e una direzione di trasferimento; soltanto dopo si osserva il dato scritto o restituito."
    ],
    "introduzione": [
      "L’attività permette di comprendere perché l’indirizzo usato dalla memoria possa differire dal nuovo puntatore alla pila. Pushq riserva una parola e scrive alla nuova cima; popq recupera quella già presente alla vecchia cima. ValE indica il puntatore successivo, mem_addr l’indirizzo effettivamente raggiunto, mentre mem_read e mem_write indicano la direzione del trasferimento.",
      "Carica «Scrivere alla nuova cima» e raggiungi «Selettore indirizzo» con «Passo successivo»: confronta valE e mem_addr, entrambi uguali a 88. Carica poi «Leggere alla vecchia cima», che riparte dallo stesso %rsp=96. Osserva mem_addr=96 e valE=104, poi segui il dato 87 verso %rax. Questa differenza spiega come il controllo possa preparare il nuovo puntatore mentre legge la parola precedente."
    ],
    "lettura": "La decodifica mostra i valori destinati all’ALU e alla memoria. Confronta valE, il nuovo puntatore, con mem_addr, l’indirizzo dell’accesso effettivo. La coppia mem_read/mem_write identifica la direzione del trasferimento.",
    "conclusione": "pushq scrive alla nuova cima %rsp−8; popq legge alla vecchia cima e prepara %rsp+8. L’ALU calcola in entrambi i casi il puntatore successivo, mentre il controllo sceglie l’indirizzo opportuno per la memoria.",
    "controlli": {
      "op": "Operazione eseguita dallo stato iniziale: pushq deposita %rax, popq preleva in %rax.",
      "sp": "Indirizzo della cima prima dell’istruzione, comune ai due confronti.",
      "v": "Contenuto iniziale di %rax; fornisce il dato alla pushq.",
      "m": "Parola già presente alla vecchia cima; diventa il nuovo %rax con popq."
    },
    "esperienze": [
      {
        "titolo": "Scrivere alla nuova cima",
        "parametri": {
          "op": "pushq",
          "sp": 96,
          "v": 19,
          "m": 87
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzione = pushq; Vecchio %rsp = 96; Valore iniziale di %rax = 19; Parola alla vecchia cima = 87.",
          "Parti da «Decodifica» e annota valA = 19, valB = 96, Vecchia cima = 87.",
          "In «Selettore indirizzo» confronta valE e mem_addr: entrambi devono derivare da 96−8. Controlla che sia attiva soltanto la scrittura.",
          "Raggiungi «Stato dopo il fronte» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Stato dopo il fronte» leggi %rsp = 88, %rax = 19, Valore trasferito = 19.",
        "ragionamento": "pushq calcola 96−8=88 e usa 88 per scrivere il valore 19 di %rax. Dopo il fronte %rsp=88 e %rax resta 19.",
        "attesi": [
          {
            "passo": 2,
            "campo": "%rsp",
            "valore": "88"
          },
          {
            "passo": 2,
            "campo": "%rax",
            "valore": "19"
          },
          {
            "passo": 2,
            "campo": "Valore trasferito",
            "valore": "19"
          }
        ]
      },
      {
        "titolo": "Leggere alla vecchia cima",
        "parametri": {
          "op": "popq",
          "sp": 96,
          "v": 19,
          "m": 87
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzione = popq; Vecchio %rsp = 96; Valore iniziale di %rax = 19; Parola alla vecchia cima = 87.",
          "Parti da «Decodifica» e annota valA = 96, valB = 96, Vecchia cima = 87.",
          "In «Selettore indirizzo» confronta valE=96+8 con mem_addr=96. Segui il dato 87 dalla vecchia cima a %rax nel passo finale.",
          "Raggiungi «Stato dopo il fronte» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Stato dopo il fronte» leggi %rsp = 104, %rax = 87, Valore trasferito = 87.",
        "ragionamento": "popq legge 87 all’indirizzo iniziale 96 e lo deposita in %rax. Il nuovo puntatore vale 96+8=104, mentre mem_addr è rimasto 96 durante la lettura.",
        "attesi": [
          {
            "passo": 2,
            "campo": "%rsp",
            "valore": "104"
          },
          {
            "passo": 2,
            "campo": "%rax",
            "valore": "87"
          },
          {
            "passo": 2,
            "campo": "Valore trasferito",
            "valore": "87"
          }
        ]
      }
    ]
  },
  "3.4.5": {
    "scopo": "Due macchine eseguono lo stesso insieme di istruzioni con cicli di durata diversa. Misurerai il tempo totale per capire come un clock più breve si combini con un numero maggiore di cicli per istruzione.",
    "teoria": [
      "Per confrontare due processori che eseguono lo stesso programma occorre misurare il tempo trascorso dall’inizio alla fine. Il clock scandisce intervalli regolari, detti cicli. La durata di un ciclo è il periodo. Un periodo breve permette di avviare più cicli nello stesso tempo, mentre il numero di cicli necessari dipende da come ciascuna macchina suddivide il lavoro.",
      "La macchina sequenziale SEQ completa ogni istruzione in un ciclo da 240 picosecondi (ps). La macchina multiciclo affronta un’istruzione alla volta suddividendola in operazioni più brevi. Qui la somma o un’altra istruzione aritmetica richiede tre cicli, mentre un carico, che legge la memoria per portare il dato in un registro, richiede cinque cicli.",
      "Per quattro istruzioni aritmetiche e tre carichi, SEQ impiega sette cicli, ossia 1680 ps. La seconda macchina conta dodici cicli aritmetici e quindici per i carichi. Se il suo periodo è 55 ps, i ventisette cicli occupano 1485 ps. Cambiando la proporzione fra carichi e calcoli si può risalire, dalle due durate, al lavoro che pesa maggiormente su ciascun progetto.",
      "Il rapporto tempo SEQ/tempo multiciclo è privo di unità, perché entrambi i tempi sono espressi in picosecondi, ciascuno pari a un millesimo di miliardesimo di secondo. Un rapporto maggiore di 1 indica un vantaggio della macchina multiciclo, uno minore di 1 un vantaggio di SEQ e uno uguale a 1 la parità. Per qualsiasi scelta dei conteggi, il tempo SEQ è 240×(aritmetiche+carichi), mentre quello multiciclo è periodo×(3×aritmetiche+5×carichi). Le due macchine procedono qui un’istruzione alla volta, perciò i rispettivi cicli si sommano direttamente."
    ],
    "introduzione": [
      "La simulazione permette di confrontare due processori attraverso il tempo necessario allo stesso programma. SEQ usa un ciclo lungo per istruzione; la macchina multiciclo usa più cicli brevi, tre per un’operazione aritmetica e cinque per un carico. Il prodotto fra numero di cicli e periodo rende osservabile come la durata dipenda sia dal progetto sia dal tipo di istruzioni.",
      "Carica «Multiciclo con periodo 55 ps» e avanza con «Passo successivo», confrontando i sette cicli SEQ con i ventisette multiciclo. Verifica i tempi 1680 e 1485 ps, poi carica «Multiciclo con periodo 70 ps». Il conteggio resta uguale e il secondo tempo sale a 1890 ps: interpreta il cambio della macchina più rapida mediante il prodotto cicli×periodo."
    ],
    "lettura": "La prima riga conta un ciclo SEQ per ogni istruzione. La seconda separa i tre cicli richiesti dall’aritmetica e i cinque dei carichi sulla macchina multiciclo. Il confronto finale usa tempi in picosecondi e il rapporto tempo SEQ/tempo multiciclo.",
    "conclusione": "La durata dipende dal prodotto fra cicli e periodo. Per il programma scelto, la macchina multiciclo conviene quando il suo periodo è inferiore a 1680/27, circa 62,22 ps; il limite cambia con il tipo e il numero di istruzioni.",
    "controlli": {
      "a": "Numero di istruzioni aritmetiche del programma; ciascuna richiede un ciclo SEQ oppure tre multiciclo.",
      "l": "Numero di carichi dalla memoria; ciascuno richiede un ciclo SEQ oppure cinque multiciclo.",
      "t": "Durata di ogni ciclo della seconda macchina; il periodo SEQ rimane fissato a 240 ps."
    },
    "esperienze": [
      {
        "titolo": "Multiciclo con periodo 55 ps",
        "parametri": {
          "a": 4,
          "l": 3,
          "t": 55
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzioni aritmetiche = 4; Carichi = 3; Periodo multiciclo (ps) = 55.",
          "Parti da «Macchina SEQ» e annota Istruzioni = 7, Tempo SEQ (ps) = 1680.",
          "In «Macchina multiciclo» ricava 4×3 e 3×5. Somma i cicli e moltiplica per 55 ps prima di confrontare il tempo con SEQ.",
          "Raggiungi «Tempo trascorso» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Tempo trascorso» leggi Tempo multiciclo (ps) = 1485, SEQ − multiciclo (ps) = 195, Macchina più rapida = Multiciclo, Tempo SEQ / tempo multiciclo = 1,13131.",
        "ragionamento": "SEQ richiede (4+3)×240=1680 ps. La macchina multiciclo richiede (4×3+3×5)×55=27×55=1485 ps: risparmia 195 ps e il rapporto è circa 1,13131.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Tempo multiciclo (ps)",
            "valore": "1485"
          },
          {
            "passo": 2,
            "campo": "SEQ − multiciclo (ps)",
            "valore": "195"
          },
          {
            "passo": 2,
            "campo": "Macchina più rapida",
            "valore": "Multiciclo"
          },
          {
            "passo": 2,
            "campo": "Tempo SEQ / tempo multiciclo",
            "valore": "1,13131"
          }
        ]
      },
      {
        "titolo": "Multiciclo con periodo 70 ps",
        "parametri": {
          "a": 4,
          "l": 3,
          "t": 70
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzioni aritmetiche = 4; Carichi = 3; Periodo multiciclo (ps) = 70.",
          "Parti da «Macchina SEQ» e annota Istruzioni = 7, Tempo SEQ (ps) = 1680.",
          "Verifica che il numero totale di cicli sia ancora 27. Moltiplica ora per 70 ps e interpreta il segno di SEQ−multiciclo.",
          "Raggiungi «Tempo trascorso» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Tempo trascorso» leggi Tempo multiciclo (ps) = 1890, SEQ − multiciclo (ps) = -210, Macchina più rapida = SEQ, Tempo SEQ / tempo multiciclo = 0,88889.",
        "ragionamento": "I 27 cicli multiciclo durano 27×70=1890 ps. SEQ resta a 1680 ps, quindi è più rapida di 210 ps e il rapporto 1680/1890 è circa 0,88889.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Tempo multiciclo (ps)",
            "valore": "1890"
          },
          {
            "passo": 2,
            "campo": "SEQ − multiciclo (ps)",
            "valore": "-210"
          },
          {
            "passo": 2,
            "campo": "Macchina più rapida",
            "valore": "SEQ"
          },
          {
            "passo": 2,
            "campo": "Tempo SEQ / tempo multiciclo",
            "valore": "0,88889"
          }
        ]
      }
    ]
  },
  "3.4.6": {
    "scopo": "Ricostruirai il percorso di una pushq dal banco registri alla memoria. Il problema richiede di spiegare perché l’indirizzo calcolato diventi anche il nuovo puntatore alla pila.",
    "teoria": [
      "Una parola che debba restare disponibile mentre il processore svolge altri calcoli può essere depositata sulla pila. Gli indirizzi della memoria numerano singoli byte. Un registro speciale, %rsp, conserva l’indirizzo della parola più recente. In questa macchina la pila si estende verso le celle di indirizzo minore e ogni deposito eseguito dall’istruzione pushq riserva otto byte, quanti ne occorrono per archiviare 64 bit.",
      "Si parte da una pila con la cima all’indirizzo 0x1000. Il prefisso 0x indica la base sedici, per cui 0x1000 vale 4096. Per deporre una parola il processore riserva gli otto byte che cominciano da 4088, ossia 0x0FF8, e arrivano fino a 4095. Il nuovo puntatore identifica il primo byte del gruppo appena occupato.",
      "Nel percorso della figura viaggiano due informazioni diverse. Il valore del registro sorgente raggiunge la porta dati della memoria, mentre l’indirizzo ottenuto dalla sottrazione raggiunge la porta indirizzi e il registro della cima. Tenere annotate queste due destinazioni permette di ricostruire lo stato finale della pila.",
      "Un bit è una cifra 0 o 1 e otto bit formano un byte. La parola 0xAA occupa qui otto byte perché il trasferimento è di 64 bit; gli altri sette byte valgono zero. La figura adotta l’ordine little-endian, collocando AA al primo indirizzo 0x0FF8 e gli zeri ai sette indirizzi successivi. L’ALU è l’unità aritmetico-logica che calcola la sottrazione; valE ne identifica il risultato, ossia l’indirizzo che compare sia alla memoria sia nel nuovo %rsp."
    ],
    "introduzione": [
      "Il problema svolto permette di ricostruire un deposito sulla pila separando contenuto e posizione. Pushq trasferisce una parola di 64 bit, quindi riserva otto byte sotto la vecchia cima. Il risultato della sottrazione, valE, raggiunge due destinazioni: la porta indirizzi della memoria e il registro %rsp. Il dato sorgente segue invece il collegamento destinato al contenuto.",
      "Prevedi il nuovo %rsp e avvia la ricostruzione con «Passo successivo». Confronta il puntatore 0x1000, pari a 4096, con il risultato 4088, scritto 0x0FF8; segui poi quest’ultimo verso entrambe le destinazioni. Nella fase «Scritture» verifica che la memoria riceva 0xAA e il puntatore riceva 0x0FF8. Con «Precedente» puoi distinguere nuovamente il valore copiato dall’indirizzo che lo ospita."
    ],
    "lettura": "Il dato 0xAA viaggia dalla sorgente alla porta dati; %rsp viaggia verso l’ALU. Dopo la sottrazione, valE si divide verso la porta indirizzi della memoria e verso il registro %rsp, due destinazioni dello stesso indirizzo.",
    "conclusione": "Il deposito sulla pila separa sempre contenuto e posizione. La dimensione della parola stabilisce la variazione del puntatore; il valore della parola viene copiato nella regione appena riservata.",
    "procedura": [
      "Leggi i «Dati iniziali»: Il processore SEQ esegue pushq. Il registro %rsp contiene 0x1000, mentre il registro sorgente contiene il valore a 64 bit 0xAA.",
      "Scrivi una previsione per «Qual è il nuovo valore di %rsp?». Conservala mentre inizi la ricostruzione con «Passo successivo».",
      "In «Lettura» distingui il dato 0xAA dal puntatore 0x1000. In «ALU» sottrai otto e segui il risultato verso entrambe le destinazioni in «Scritture».",
      "Raggiungi «Scritture» e confronta la previsione con i valori finali. Usa «Ricomincia il percorso» per ripetere i passaggi con il ragionamento ormai completo."
    ],
    "risultato": "La risposta alla previsione è 0x0FF8. La memoria riceve 0xAA all’indirizzo calcolato. Al completamento %rsp assume lo stesso indirizzo.",
    "ragionamento": "0x1000 vale 4096. La sottrazione di otto produce 4088=0x0FF8: da lì iniziano gli otto byte riservati; la memoria vi riceve 0xAA e %rsp assume 0x0FF8."
  },
  "3.4.7": {
    "scopo": "Calcolerai i segnali del percorso dati per una pushq. Individuando costante dell’ALU, nuovo puntatore e indirizzo di memoria, potrai verificare che ogni segnale svolga il ruolo previsto.",
    "teoria": [
      "Una pila è una regione di memoria nella quale si aggiungono e si prelevano dati dalla stessa estremità, chiamata cima. Il puntatore alla pila contiene l’indirizzo di quell’estremità. Quando la pila cresce verso i numeri più piccoli, depositare e prelevare richiedono un ordine diverso fra uso e aggiornamento del puntatore.",
      "Nella traccia aluA è il primo ingresso dell’unità che calcola il nuovo puntatore e valE è il risultato di quel calcolo. Il segnale mem_addr dice a quale indirizzo la memoria debba effettivamente scrivere o leggere. Confrontarlo con il vecchio puntatore chiarisce quale dei due sia già stato aggiornato.",
      "Con la cima a 0x80, cioè 128, una push di otto byte scrive a 120, ossia 0x78. Per confronto, una pop che iniziasse dalla stessa cima a 128 leggerebbe a 128 e lascerebbe il puntatore a 136. Il deposito usa per la memoria la posizione appena calcolata, il prelievo quella da cui si era partiti.",
      "Nel frammento x86-64 RDI è il contenitore del vecchio puntatore simulato. LEA RAX,[RDI−8] calcola il nuovo indirizzo e lo conserva in RAX; MOV RDX,RAX ne copia il valore in RDX per rappresentare mem_addr. Per la popq il calcolo usa +8 e RDX riceve il vecchio RDI. Si stanno così calcolando gli indirizzi di controllo; il listato proposto lascia separato il trasferimento della parola. Un byte contiene otto bit e i numeri preceduti da 0x sono scritti in base sedici."
    ],
    "introduzione": [
      "L’esercitazione consente di ricavare i segnali di controllo che fanno crescere la pila verso indirizzi minori. AluA è la costante fornita all’unità aritmetica; valE è il nuovo puntatore calcolato; mem_addr indica dove la memoria agirà. Nella pushq una parola di otto byte richiede la costante −8 e la scrittura deve raggiungere lo spazio appena riservato.",
      "Premi «Carica l’esempio guidato» e compila «aluA» partendo dal vecchio %rsp=0x80, cioè 128. Dopo «Registra la previsione», avanza con «Passo successivo» e confronta 128−8 con valE=120 e mem_addr=120. Usa «Precedente» per seguire la copia dello stesso indirizzo verso le due destinazioni: la coincidenza è richiesta dal deposito alla nuova cima e spiega il collegamento scelto dal controllo."
    ],
    "lettura": "La costante aluA entra nell’ALU insieme al vecchio puntatore. Il risultato valE raggiunge il selettore mem_addr, che nel deposito sceglie la nuova cima; i valori riportati nelle caselle permettono di controllare l’intero collegamento.",
    "conclusione": "Per una pila che cresce verso gli indirizzi minori, una push di otto byte usa aluA=−8. Il nuovo puntatore e l’indirizzo di scrittura coincidono perché il deposito usa lo spazio appena riservato.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 1, «Confrontare le due direzioni dello stack», traccia 1. La spiegazione numerica seguente riguarda questa combinazione.",
      "Dal vecchio %rsp=0x80 ricava il valore decimale 128. Scegli la costante che riserva otto byte e calcola prima valE, poi l’indirizzo selezionato per la scrittura.",
      "Compila la previsione per «aluA» e premi «Registra la previsione». Poi avanza con «Passo successivo» per verificare il procedimento, anche se la risposta iniziale richiede una correzione.",
      "Confronta i campi del risultato con lo svolgimento. Per rispondere a tutti i quesiti, apri «Apri la prova completa»; con i selettori Esercizio e Traccia puoi poi scegliere altri dati."
    ],
    "risultato": "Per l’esercizio 1, traccia 1, i risultati sono: aluA = -8; valE = 120; mem_addr = 120.",
    "ragionamento": "La costante è −8 perché la pila cresce verso il basso. valE=128−8=120=0x78 e la push scrive proprio alla nuova cima, quindi mem_addr=120."
  },
  "3.4.8": {
    "scopo": "Ricostruirai la scelta del PC dopo un salto jne. Il problema collega il flag ZF lasciato dall’operazione precedente alla selezione fra destinazione e continuazione sequenziale.",
    "teoria": [
      "Un salto condizionale dà al processore due possibili indirizzi di continuazione. Uno si trova subito dopo l’istruzione di salto, l’altro è scritto nell’istruzione stessa. La scelta dipende da un’informazione di stato che una precedente operazione ha lasciato disponibile.",
      "Il nome jne significa «salta se diverso». L’istruzione usa il flag ZF, che vale uno se il precedente risultato era zero. Quando ZF vale zero il salto è preso. Quando vale uno si usa valP, il nome dato nella traccia all’indirizzo che segue il codice dell’istruzione.",
      "Nel processore didattico Y86-64, jne occupa un byte di codice e otto di destinazione, per un totale di nove; ciascun byte contiene otto bit. Se comincia all’indirizzo 0x40, cioè 64 in base sedici, la continuazione sequenziale è a 73, ossia 0x49. Con bersaglio 0xC0, cioè 192, il PC, contatore di programma che conserva l’indirizzo del prossimo comando, può ricevere 73 oppure 192. Cnd è il bit di condizione: vale 1 quando ZF=0 e seleziona valC, il bersaglio; vale 0 quando ZF=1 e seleziona valP.",
      "Il frammento x86-64 calcola la decisione usando RDI per il PC iniziale, RSI per il bersaglio ed EDX per il valore di ZF della macchina simulata. LEA prepara PC+9 in RAX. TEST EDX,EDX verifica se quel valore di ZF è zero; CMOVZ copia allora il bersaglio in RAX. I flag usati da TEST e CMOVZ appartengono al processore che esegue il frammento. Il modello conserva invece il precedente ZF della macchina Y86, perché il salto lo consulta senza modificarlo."
    ],
    "introduzione": [
      "Questa ricostruzione permette di comprendere come un salto condizionale scelga il prossimo indirizzo del programma. ValP è la continuazione dopo il codice, valC il bersaglio scritto nell’istruzione e Cnd il bit che comanda il selettore. Per jne, «salta se diverso», Cnd vale uno quando ZF, l’indicatore di risultato zero lasciato dall’operazione precedente, vale zero.",
      "Ripristina l’esempio guidato e avanza con «Passo successivo», calcolando prima 0x40+9=0x49. Confronta questa continuazione con il bersaglio 0xC0, poi usa ZF=0 per giustificare Cnd=1 e PC=192. Torna con «Precedente» alla selezione: i nove byte spiegano valP, mentre il flag spiega quale candidato viene scelto. Il salto consulta il precedente stato dei flag e lo conserva."
    ],
    "lettura": "Le due frecce candidate arrivano da valP, posto dopo il codice del salto, e da valC, la destinazione scritta nel codice. Il segnale Cnd comanda quale indirizzo entra nel PC; ZF è l’ingresso da cui si ricava la condizione.",
    "conclusione": "jne è preso quando ZF=0. La lunghezza dell’istruzione consente sempre di preparare valP, mentre Cnd decide quale candidato il processore userà per proseguire.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 5, «Scegliere il PC dopo jne», traccia 1. La spiegazione numerica seguente riguarda questa combinazione.",
      "Parti dal PC 0x40 e calcola valP aggiungendo nove byte. Con ZF=0 valuta la condizione jne e scegli tra 0x49 e la destinazione 0xC0.",
      "Avvia la ricostruzione con «Passo successivo» e controlla ogni trasformazione prima di passare alla successiva.",
      "Confronta i campi del risultato con lo svolgimento. Per rispondere a tutti i quesiti, apri «Apri la prova completa»; con i selettori Esercizio e Traccia puoi poi scegliere altri dati."
    ],
    "risultato": "Per l’esercizio 5, traccia 1, i risultati sono: valP = 73; Cnd = 1; PC scelto = 192.",
    "ragionamento": "valP=64+9=73=0x49. jne richiede ZF=0, quindi Cnd=1 e il selettore porta al PC la destinazione 0xC0=192, conservando i flag della macchina Y86."
  },
  "3.5.1": {
    "scopo": "Osserverai una pipeline ideale con istruzioni indipendenti. Confronterai un flusso di sette istruzioni con una sola per separare il tempo di attraversamento individuale dalla cadenza dei completamenti.",
    "teoria": [
      "Mentre un’istruzione sta compiendo un calcolo, il circuito che ha già letto quella istruzione dalla memoria può dedicarsi alla successiva. La pipeline sfrutta questa possibilità dividendo l’esecuzione in stadi e assegnando a ciascuno una parte del lavoro. A ogni ciclo del clock ciascuna istruzione avanza di una posizione, purché lo stadio seguente sia disponibile e l’istruzione disponga dei dati che le servono.",
      "In questo esperimento gli stadi impiegano un ciclo ciascuno e le istruzioni sono indipendenti, sicché possono procedere senza attendersi. Con cinque stadi da 40 picosecondi (ps), la prima istruzione che entra nel ciclo 1 completa alla fine del ciclo 5. Ha attraversato tutti gli stadi impiegando 200 ps. Questo tempo, misurato per una singola istruzione, si chiama latenza.",
      "La seconda istruzione è entrata un solo ciclo dopo la prima, perciò completa nel ciclo 6. Dopo il riempimento si osserva una conclusione ogni 40 ps. Per sette istruzioni, la settima termina sei cicli dopo la prima. Il diagramma consente di leggere separatamente il tempo trascorso dalla singola istruzione e la cadenza delle conclusioni.",
      "Nella griglia ogni riga segue una istruzione I e ogni colonna corrisponde a un ciclo. S1, S2 e le etichette successive indicano gli stadi attraversati; le posizioni vuote appartengono al riempimento o allo svuotamento. Indicando con k il numero degli stadi, con N il numero delle istruzioni e con T il periodo, la durata complessiva è (k+N−1)·T. Un picosecondo, ps, è un millesimo di miliardesimo di secondo. La capacità a regime corrisponde a un’uscita ogni T soltanto finché arrivano nuove istruzioni indipendenti."
    ],
    "introduzione": [
      "La simulazione permette di distinguere la latenza di un’istruzione dalla cadenza con cui una pipeline completa il lavoro. La latenza misura il suo attraversamento di tutti gli stadi, cioè le fasi di lavorazione; la cadenza misura l’intervallo fra due uscite consecutive. Con istruzioni indipendenti gli stadi lavorano contemporaneamente su comandi diversi, rendendo visibili sia il riempimento iniziale sia i completamenti successivi.",
      "Carica «Riempire e svuotare sette istruzioni» e avanza con «Passo successivo», confrontando il primo completamento al ciclo 5 con l’ultimo al ciclo 11. Verifica 200 ps di latenza e 440 ps complessivi. Carica poi «Seguire una sola istruzione»: il tempo diventa 200 ps. I 40 ps indicati come intervallo a regime descrivono una capacità potenziale, osservabile solo attraverso più completamenti."
    ],
    "lettura": "Ogni istruzione occupa uno stadio per ciclo e si sposta di una posizione al passo successivo. Cerca il primo completamento e l’ultimo; la distanza tra completamenti consecutivi si legge lungo il tempo, mentre la latenza segue una singola istruzione.",
    "conclusione": "Con k stadi e N istruzioni indipendenti, la prima termina al ciclo k e l’ultima al ciclo k+N−1. La latenza è k·T; la cadenza ideale a regime è un completamento ogni T, purché il flusso sia sufficientemente lungo.",
    "controlli": {
      "k": "Numero di stadi consecutivi, ciascuno della durata di un ciclo.",
      "n": "Numero di istruzioni indipendenti immesse una per ciclo nella pipeline inizialmente vuota.",
      "t": "Durata del ciclo in picosecondi; moltiplicala per i cicli per ottenere il tempo."
    },
    "esperienze": [
      {
        "titolo": "Riempire e svuotare sette istruzioni",
        "parametri": {
          "k": 5,
          "n": 7,
          "t": 40
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Stadi = 5; Istruzioni indipendenti = 7; Periodo di clock (ps) = 40.",
          "Parti da «Ingresso» e annota Primo ingresso = 1, Ultimo ingresso = 7.",
          "In «Primo completamento» leggi il ciclo 5 e la latenza 200 ps. Conta altre sei uscite prima di verificare «Ultimo completamento».",
          "Raggiungi «Ultimo completamento» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Ultimo completamento» leggi Cicli totali = 11, Tempo totale (ps) = 440, Intervallo a regime (ps) = 40.",
        "ragionamento": "La prima istruzione impiega 5×40=200 ps. Le altre sei completano nei sei cicli seguenti: il totale è 5+7−1=11 cicli, pari a 440 ps.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Cicli totali",
            "valore": "11"
          },
          {
            "passo": 2,
            "campo": "Tempo totale (ps)",
            "valore": "440"
          },
          {
            "passo": 2,
            "campo": "Intervallo a regime (ps)",
            "valore": "40"
          }
        ]
      },
      {
        "titolo": "Seguire una sola istruzione",
        "parametri": {
          "k": 5,
          "n": 1,
          "t": 40
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Stadi = 5; Istruzioni indipendenti = 1; Periodo di clock (ps) = 40.",
          "Parti da «Ingresso» e annota Primo ingresso = 1, Ultimo ingresso = 1.",
          "In «Primo completamento» verifica che l’unica istruzione attraversi comunque cinque stadi. Confronta la sua conclusione con l’ultimo completamento.",
          "Raggiungi «Ultimo completamento» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Ultimo completamento» leggi Cicli totali = 5, Tempo totale (ps) = 200, Intervallo a regime (ps) = 40.",
        "ragionamento": "Con N=1 il primo e l’ultimo completamento coincidono al ciclo 5. La latenza rimane 200 ps; il valore di 40 ps descrive la cadenza potenziale della macchina, che un singolo ingresso lascia inosservata.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Cicli totali",
            "valore": "5"
          },
          {
            "passo": 2,
            "campo": "Tempo totale (ps)",
            "valore": "200"
          },
          {
            "passo": 2,
            "campo": "Intervallo a regime (ps)",
            "valore": "40"
          }
        ]
      }
    ]
  },
  "3.5.2": {
    "scopo": "Leggerai tre fotografie consecutive di cinque istruzioni in pipeline. Seguendo la stessa etichetta fra gli stadi, imparerai a distinguere il numero del ciclo dalla posizione raggiunta da ciascuna istruzione.",
    "teoria": [
      "Quando un processore lavora contemporaneamente su istruzioni diverse, l’espressione «siamo al ciclo quattro» descrive un istante dell’intero processore. Per sapere a quale istruzione appartenga un valore occorre anche conoscere lo stadio in cui quel valore si trova. La figura assegna per questo un nome a ogni istruzione, I1, I2 e così via, nell’ordine con cui comincia l’esecuzione.",
      "F preleva i byte dalla memoria, D decodifica il comando e legge gli operandi, E esegue il calcolo, M effettua un eventuale accesso ai dati e W scrive il risultato. Queste cinque fasi formano una pipeline. Ogni stadio trattiene una sola istruzione per ciclo, mentre il ciclo successivo può ospitare l’istruzione che si trovava nello stadio precedente.",
      "Con cinque istruzioni indipendenti, al ciclo 4 I1 si trova in M, I2 in E, I3 in D e I4 in F. W è ancora vuoto. Un ciclo più tardi entra I5 e la prima istruzione arriva in W. Seguire I1 fra le due righe permette di ricostruire il movimento a cui corrisponde ciascun cambio di etichetta."
    ],
    "introduzione": [
      "L’attività serve a leggere una pipeline distinguendo il tempo dai posti occupati. Ogni riga è una fotografia di un ciclo; F, D, E, M e W indicano prelievo, decodifica, calcolo, memoria e scrittura. Le etichette I1, I2 e successive seguono invece singole istruzioni, che avanzano di uno stadio per ciclo durante riempimento e svuotamento.",
      "Carica «Osservare il riempimento» e usa «Passo successivo» per seguire I1 da E a M e infine a W. Confronta le tre fotografie, individuando W nell’ultima, come richiesto dalla previsione. Carica «Osservare lo svuotamento» e osserva F vuoto mentre I5 procede verso E: l’assenza di nuovi prelievi lascia ancora lavoro negli stadi successivi, che continuano a completare le istruzioni già entrate."
    ],
    "lettura": "F, D, E, M e W sono le posizioni della pipeline; le etichette I seguite da un numero identificano le istruzioni. Ogni riga è una fotografia dell’intero processore in un ciclo, mentre ogni colonna segue uno stadio. Cerca una stessa I nelle righe successive per seguirne l’avanzamento. Il trattino indica una posizione vuota; dopo l’uscita dell’ultima istruzione tutti gli stadi rimangono vuoti. Per la previsione individua W nell’ultima delle tre fotografie.",
    "conclusione": "Nella pipeline ideale ogni istruzione avanza di uno stadio per ciclo. Dopo l’ultimo prelievo F si svuota mentre le istruzioni precedenti continuano fino a W: lo svuotamento fa parte del tempo totale.",
    "controlli": {
      "n": "Numero di istruzioni indipendenti del flusso; entrano in ordine I1, I2 e così via.",
      "c": "Ciclo posto al centro delle tre fotografie; la traccia mostra anche quello precedente e quello successivo."
    },
    "esperienze": [
      {
        "titolo": "Osservare il riempimento",
        "parametri": {
          "n": 5,
          "c": 4
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzioni = 5; Ciclo osservato = 4.",
          "Parti da «Ciclo 3» e annota F = I3, D = I2, E = I1, M = —, W = —.",
          "Da «Ciclo 3» passa a «Ciclo 4» e poi a «Ciclo 5». Segui I1 da E a M a W e conta quante altre istruzioni le si affiancano.",
          "Raggiungi «Ciclo 5» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Ciclo 5» leggi F = I5, D = I4, E = I3, M = I2, W = I1.",
        "ragionamento": "Al ciclo 3 I1 è in E, al 4 è in M e al 5 raggiunge W. In quel momento I2, I3, I4 e I5 occupano rispettivamente M, E, D e F.",
        "attesi": [
          {
            "passo": 2,
            "campo": "F",
            "valore": "I5"
          },
          {
            "passo": 2,
            "campo": "D",
            "valore": "I4"
          },
          {
            "passo": 2,
            "campo": "E",
            "valore": "I3"
          },
          {
            "passo": 2,
            "campo": "M",
            "valore": "I2"
          },
          {
            "passo": 2,
            "campo": "W",
            "valore": "I1"
          }
        ]
      },
      {
        "titolo": "Osservare lo svuotamento",
        "parametri": {
          "n": 5,
          "c": 6
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzioni = 5; Ciclo osservato = 6.",
          "Parti da «Ciclo 5» e annota F = I5, D = I4, E = I3, M = I2, W = I1.",
          "Da «Ciclo 5» passa a «Ciclo 6» e poi a «Ciclo 7». Segui I5 mentre F resta vuoto e annota chi raggiunge W.",
          "Raggiungi «Ciclo 7» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Ciclo 7» leggi F = —, D = —, E = I5, M = I4, W = I3.",
        "ragionamento": "L’ultima istruzione entra in F al ciclo 5. Al 6 F è vuoto e I5 è in D; al 7 I5 è in E mentre I3 raggiunge W, mostrando che il lavoro prosegue dopo l’ultimo ingresso.",
        "attesi": [
          {
            "passo": 2,
            "campo": "F",
            "valore": "—"
          },
          {
            "passo": 2,
            "campo": "D",
            "valore": "—"
          },
          {
            "passo": 2,
            "campo": "E",
            "valore": "I5"
          },
          {
            "passo": 2,
            "campo": "M",
            "valore": "I4"
          },
          {
            "passo": 2,
            "campo": "W",
            "valore": "I3"
          }
        ]
      }
    ]
  },
  "3.5.3": {
    "scopo": "Confronterai tre cause che possono interrompere l’avanzamento regolare delle istruzioni: l’attesa di un dato caricato dalla memoria, la contesa di una porta di memoria e una previsione errata del salto. Per ciascuna seguirai la richiesta iniziale fino al fermo o all’annullamento deciso dal controllo.",
    "teoria": [
      "Una pipeline ripartisce il lavoro fra prelievo dell’istruzione F, lettura dei suoi operandi D, calcolo E, accesso alla memoria dati M e scrittura del risultato W. Un registro è una piccola memoria interna che conserva i dati del programma. Istruzioni diverse possono occupare questi stadi nello stesso ciclo, purché siano disponibili i dati, le risorse e l’indirizzo da cui proseguire.",
      "Nel primo esperimento mrmovq è un carico: legge dalla memoria un valore destinato a %rax. La successiva addq esegue una somma. Quando richiede proprio %rax, si crea una dipendenza RAW, dall’inglese Read After Write, lettura dopo scrittura. Il valore del carico arriverà durante M, mentre il consumatore è già in D: D deve conservarlo per un ciclo e nel successivo E entra una bolla, una posizione priva di istruzione utile. Un collegamento di inoltro, o forwarding, porta poi il valore dalla memoria agli operandi del consumatore. Se addq usa %rcx, la dipendenza dal carico è assente e può avanzare subito.",
      "Nel secondo esperimento le istruzioni e i dati condividono una porta di memoria, cioè un collegamento che serve al massimo un accesso per ciclo. Il modello assegna precedenza alla lettura dati dello stadio M. Se F chiede nello stesso ciclo un’istruzione, il prelievo attende un turno e il contatore «Prelievi bloccati» vale 1. Con richieste separate nel tempo il contatore vale 0. La contesa dipende dalla capacità della risorsa, anche quando le istruzioni usano dati indipendenti.",
      "Nel terzo esperimento un salto condizionale può scegliere fra una destinazione e l’indirizzo immediatamente successivo al salto, detto sequenziale. La previsione avvia il prelievo dalla destinazione prima che E risolva la condizione. Quando la previsione è errata, le due istruzioni già avviate in F e D appartengono al cammino scartato: il controllo le annulla e riprende dal PC sequenziale, ossia dall’indirizzo del prossimo comando corretto. Quando la previsione è confermata, le due istruzioni proseguono e il conteggio degli annullamenti vale 0.",
      "La seconda condizione dei controlli cambia significato insieme all’esperimento: dipendenza oppure indipendenza del consumatore, richieste simultanee oppure separate, previsione errata oppure corretta. Il risultato richiesto è rispettivamente il numero di stalli, di prelievi bloccati o di operazioni scartate. Seguendo il valore 1 si osservano quindi uno stallo, un prelievo rinviato e due annullamenti nei tre casi; con il valore 0 tutti e tre i conteggi sono zero."
    ],
    "introduzione": [
      "La simulazione permette di riconoscere tre limiti alla sovrapposizione: un dato ancora in arrivo, una risorsa contesa o un indirizzo previsto erroneamente. Nel caso iniziale un carico produce un valore richiesto dall’istruzione seguente. La dipendenza load/use obbliga il consumatore ad attendere; una bolla rappresenta lo spazio lasciato temporaneamente libero nello stadio di esecuzione.",
      "Carica «Usare subito il valore caricato» e confronta la destinazione %rax in E con la sorgente richiesta in D. Avanza al controllo e osserva uno stallo e una bolla; ripeti con «Usare un registro indipendente». Poi scegli un altro «Esperimento» e premi «Applica i parametri»: confronta le due condizioni, interpretando il conteggio come prelievi bloccati per la porta unica o annullamenti per il salto."
    ],
    "lettura": "Nel caso del carico, i riquadri E e D permettono di confrontare il registro destinazione con quello richiesto dalla somma; il riquadro finale mostra l’eventuale bolla. Nel caso della porta unica, segui le richieste di F e M fino alla memoria e leggi quanti prelievi vengono rinviati. Nel caso del salto, confronta la destinazione predetta con la direzione risolta in E e osserva il numero delle operazioni giovani scartate.",
    "conclusione": "La sovrapposizione richiede controlli diversi secondo la causa: il load/use trattiene il consumatore fino alla disponibilità del dato, la porta unica serializza gli accessi e una previsione errata elimina le operazioni avviate sul percorso sbagliato.",
    "controlli": {
      "h": "Scegli la causa da studiare: carico seguito da un uso, memoria a porta singola oppure salto condizionale. La traccia e il conteggio finale cambiano secondo questa scelta.",
      "esito": "La prima opzione attiva, nell’ordine, il consumatore dipendente, le richieste simultanee oppure la previsione errata; la seconda rende il consumatore indipendente, separa gli accessi oppure conferma la previsione. Dopo aver scelto, premi «Applica i parametri»."
    },
    "esperienze": [
      {
        "titolo": "Usare subito il valore caricato",
        "parametri": {
          "h": "raw",
          "esito": "1"
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Esperimento = Carico seguito da un uso; Seconda condizione = Consumatore dipendente / richieste simultanee / previsione errata.",
          "Parti da «Produzione» e annota E = mrmovq, Destinazione = %rax.",
          "In «Consumo» confronta la sorgente %rax della addq con la destinazione %rax del carico. Stabilisci quando arriverà il dato e prevedi il numero di stalli richiesto dal campo di risposta; verifica poi la bolla in E.",
          "Raggiungi «Controllo» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Controllo» leggi Stalli = 1, E al prossimo ciclo = Bolla.",
        "ragionamento": "Il carico prepara %rax mentre la addq in D richiede proprio %rax. Poiché il dato arriverà durante M, D attende un ciclo ed E riceve una bolla.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Stalli",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "E al prossimo ciclo",
            "valore": "Bolla"
          }
        ]
      },
      {
        "titolo": "Usare un registro indipendente",
        "parametri": {
          "h": "raw",
          "esito": "0"
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Esperimento = Carico seguito da un uso; Seconda condizione = Consumatore indipendente / richieste separate / previsione corretta.",
          "Parti da «Produzione» e annota E = mrmovq, Destinazione = %rax.",
          "In «Consumo» confronta la sorgente %rcx della addq con la destinazione %rax del carico. Prevedi il numero di stalli, poi controlla l’istruzione che entrerà in E nel ciclo seguente.",
          "Raggiungi «Controllo» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Controllo» leggi Stalli = 0, E al prossimo ciclo = addq.",
        "ragionamento": "La addq usa %rcx, indipendente dalla parola che il carico sta portando in %rax. Il controllo conta zero stalli e trasferisce addq in E al ciclo seguente.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Stalli",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "E al prossimo ciclo",
            "valore": "addq"
          }
        ]
      }
    ]
  },
  "3.5.4": {
    "scopo": "Misurerai il costo medio delle istruzioni a partire dal numero effettivo di cicli. Confronterai due programmi di lunghezza diversa mantenendo le stesse penalità per isolare il peso del riempimento.",
    "teoria": [
      "Il contatore dei cicli avanza a ogni intervallo del clock, anche durante un’attesa. Il contatore delle istruzioni completate avanza soltanto quando un’istruzione arriva alla fine. Il rapporto fra questi due conteggi si chiama CPI, cicli per istruzione. Essendo una media sul programma osservato, il CPI può avere una parte decimale anche quando ogni istruzione occupa soltanto intervalli interi.",
      "La pipeline del modello distribuisce l’esecuzione su cinque stadi e inizialmente è vuota. L’istruzione entrata al ciclo 1 termina al ciclo 5. In condizioni ideali la successiva termina al 6 e così via, per cui al numero di istruzioni bisogna aggiungere quattro cicli per ottenere la durata dell’intero tratto. Gli eventuali arresti dovuti ai dati o ai salti si aggiungono qui in intervalli distinti.",
      "Per dodici istruzioni, due cicli persi in attesa di dati e due per i salti si contano 12 + 4 + 2 + 2 = 20 cicli. Dividendo 20 per 12 si ottiene circa 1,667. La voce relativa al solo riempimento isola la frazione 4/12, utile per interpretare la misura su un tratto breve.",
      "La quota 4/N ha la stessa unità del CPI, cicli per istruzione; per esempio 0,333 indica un terzo di ciclo medio per istruzione dovuto all’avvio. I campi relativi ai dati e ai salti richiedono cicli già conteggiati, quindi due cicli persi per salti possono derivare da un solo errore che costa due cicli. L’addizione delle penalità è valida qui perché occupano intervalli distinti. A parità di periodo di clock, moltiplicare i cicli complessivi per quel periodo fornirebbe il tempo trascorso."
    ],
    "introduzione": [
      "Questo esperimento permette di interpretare il CPI, cioè il numero medio di cicli per istruzione completata. Una pipeline inizialmente vuota richiede quattro cicli aggiuntivi oltre al numero delle istruzioni, ai quali si sommano le attese considerate disgiunte. La scomposizione del totale rende osservabile quanto pesino l’avvio e le penalità quando vengono distribuiti su programmi di lunghezza diversa.",
      "Carica «Un tratto di dodici istruzioni» e avanza con «Passo successivo», ricostruendo 12+4+2+2=20 cicli prima di dividerli per 12. Confronta CPI=1,667 con la quota di solo riempimento 0,333. Carica poi «Raddoppiare le istruzioni con le stesse attese»: il CPI scende a 1,333 pur crescendo il totale a 32 cicli, perché gli stessi costi aggiuntivi sono ripartiti su più istruzioni."
    ],
    "lettura": "La prima tappa conta N più i quattro cicli di riempimento. La seconda aggiunge le penalità per dati e salti, assunte disgiunte. L’ultima divide i cicli totali per le istruzioni e mostra separatamente la quota 4/N.",
    "conclusione": "Per questa pipeline a cinque stadi, CPI=(N+4+penalità dati+penalità salti)/N. A parità di attese totali, un tratto più lungo ripartisce riempimento e attese su più istruzioni, riducendo il costo medio.",
    "controlli": {
      "n": "Numero di istruzioni che arrivano al completamento nel tratto osservato.",
      "d": "Numero complessivo di cicli aggiunti per dipendenze dei dati.",
      "b": "Numero complessivo di cicli aggiunti per salti; il modello li considera separati dalle attese per dati."
    },
    "esperienze": [
      {
        "titolo": "Un tratto di dodici istruzioni",
        "parametri": {
          "n": 12,
          "d": 2,
          "b": 2
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzioni completate = 12; Cicli persi per dati = 2; Cicli persi per salti = 2.",
          "Parti da «Cicli ideali» e annota N = 12, Cicli ideali = 16.",
          "In «Cicli ideali» conta 12+4; in «Penalità disgiunte» aggiungi 2+2. Dividi il risultato per 12 prima di aprire «Misura».",
          "Raggiungi «Misura» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Misura» leggi CPI = 1,667, Quota solo riempimento = 0,333.",
        "ragionamento": "I cicli sono 12+4+2+2=20. Il CPI è 20/12≈1,667 e il solo riempimento pesa 4/12≈0,333 cicli per istruzione.",
        "attesi": [
          {
            "passo": 2,
            "campo": "CPI",
            "valore": "1,667"
          },
          {
            "passo": 2,
            "campo": "Quota solo riempimento",
            "valore": "0,333"
          }
        ]
      },
      {
        "titolo": "Raddoppiare le istruzioni con le stesse attese",
        "parametri": {
          "n": 24,
          "d": 2,
          "b": 2
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzioni completate = 24; Cicli persi per dati = 2; Cicli persi per salti = 2.",
          "Parti da «Cicli ideali» e annota N = 24, Cicli ideali = 28.",
          "In «Cicli ideali» conta 24+4 e aggiungi ancora quattro cicli persi. Confronta il rapporto ottenuto con quello del primo caso.",
          "Raggiungi «Misura» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Misura» leggi CPI = 1,333, Quota solo riempimento = 0,167.",
        "ragionamento": "I cicli sono 24+4+2+2=32. Il CPI è 32/24≈1,333 e il solo riempimento pesa 4/24≈0,167: gli stessi otto cicli aggiuntivi si distribuiscono sul doppio delle istruzioni.",
        "attesi": [
          {
            "passo": 2,
            "campo": "CPI",
            "valore": "1,333"
          },
          {
            "passo": 2,
            "campo": "Quota solo riempimento",
            "valore": "0,167"
          }
        ]
      }
    ]
  },
  "3.5.5": {
    "scopo": "Calcolerai il momento in cui termina l’ultima di venti istruzioni indipendenti. Il problema serve a ricavare il tempo di riempimento dalla sequenza dei completamenti, evitando di moltiplicare la latenza individuale per tutte le istruzioni.",
    "teoria": [
      "Ogni comando del programma deve attraversare cinque stadi, ciascuno dei quali richiede un ciclo. Se gli stadi possono lavorare contemporaneamente su comandi diversi, si parla di pipeline. Le istruzioni sono indipendenti quando ciascuna dispone dei dati necessari senza dover attendere i risultati delle altre. La pipeline parte vuota, quindi i primi cicli servono a occuparne progressivamente le posizioni.",
      "Durante il ciclo 1 la prima istruzione è appena entrata. Nel ciclo 2 raggiunge il secondo stadio e lascia libero il primo per la seconda istruzione. Proseguendo allo stesso modo, al ciclo 5 la prima istruzione raggiunge l’ultimo stadio, mentre le quattro successive occupano gli altri posti. Il primo completamento avviene alla fine di quel ciclo.",
      "Da quel momento, a ogni ciclo si conclude una nuova istruzione. Tra la conclusione della prima e quella della ventesima intercorrono quindi diciannove cicli, ai quali si aggiungono i cinque necessari per il primo attraversamento. Il ciclo dell’ultima uscita è 5+19=24, mentre il costo individuale di attraversamento resta cinque cicli."
    ],
    "introduzione": [
      "Il problema svolto permette di ricavare la durata di un flusso ideale contando i completamenti. Ogni istruzione attraversa cinque stadi, mentre istruzioni indipendenti possono occupare stadi diversi nello stesso ciclo. La prima uscita richiede il riempimento della pipeline; ciascuna uscita successiva aggiunge un solo ciclo. La figura rende leggibile questa differenza fra attraversamento individuale e durata dell’intero programma.",
      "Prevedi il ciclo di completamento dell’istruzione numero 20 e premi «Passo successivo». Confronta I1, che termina al ciclo 5, con I2, che termina al 6; prosegui contando le diciannove uscite successive alla prima. Alla fine verifica I20 al ciclo 24. Usa «Ricomincia il percorso» per ritrovare i quattro cicli aggiuntivi della formula 20+4 direttamente nella fase iniziale ancora priva di completamenti."
    ],
    "lettura": "Ogni riga segue l’istruzione indicata, I1, I2 oppure I20. Le lettere sono gli stadi: F preleva il comando, D prepara gli operandi, E esegue il calcolo, M effettua eventuali accessi alla memoria e W conclude con la scrittura. Le colonne scorrono lungo i cicli. Dopo W di I1, i completamenti sono separati da un ciclo; individua W di I20 contando le diciannove uscite successive alla prima.",
    "conclusione": "Con cinque stadi da un ciclo e un ingresso per ciclo, la durata di N istruzioni indipendenti è N+4 cicli. I quattro cicli aggiuntivi rappresentano il costo iniziale della pipeline vuota.",
    "procedura": [
      "Leggi i «Dati iniziali»: La pipeline è inizialmente vuota. Ha cinque stadi da un ciclo, il primo prelievo avviene nel ciclo 1 e le venti istruzioni sono indipendenti.",
      "Scrivi una previsione per «In quale ciclo completa l’istruzione numero 20?». Conservala mentre inizi la ricostruzione con «Passo successivo».",
      "In «Primo completamento» annota il ciclo 5. Prima di «Ultima istruzione» conta quante uscite restano dopo I1 e aggiungi quel numero al primo completamento.",
      "Raggiungi «Ultima istruzione» e confronta la previsione con i valori finali. Usa «Ricomincia il percorso» per ripetere i passaggi con il ragionamento ormai completo."
    ],
    "risultato": "La risposta alla previsione è 24. Dal completamento della prima istruzione a quello della ventesima trascorrono altri 19 cicli. L’ultima termina quindi al ciclo 5 + 19 = 24.",
    "ragionamento": "I1 termina nel ciclo 5. Dalla prima alla ventesima restano 19 completamenti distanziati di un ciclo, quindi I20 termina al ciclo 5+19=24."
  },
  "3.5.6": {
    "scopo": "Due cause di fermo possono interessare gli stessi cicli. Calcolerai l’intersezione e l’unione delle loro maschere per misurare il tempo perso senza contare due volte gli intervalli comuni.",
    "teoria": [
      "In un processore suddiviso in stadi, più istruzioni possono essere in lavorazione nello stesso ciclo. Talvolta uno stadio deve attendere, perché un dato arriva in ritardo o perché una risorsa è già occupata. Per misurare il tempo perso bisogna riconoscere se due cause hanno fermato lo stesso ciclo.",
      "Una maschera temporale è una parola di bit, cifre binarie 0 e 1, in cui ogni posizione descrive un ciclo: 1 indica una richiesta di fermo e 0 la sua assenza. Nelle parole binarie scritte nella consegna, la posizione zero, all’estremità destra, rappresenta il primo ciclo; le successive, procedendo verso sinistra, rappresentano i cicli seguenti. Le due maschere condividono questa numerazione. AND produce 1 dove entrambe hanno 1, individuando l’intersezione; OR produce 1 dove almeno una ha 1, individuando l’unione.",
      "Nella maschera 011010 sono attivi i bit 1, 3 e 4, quindi il secondo, il quarto e il quinto ciclo. In 001110 sono attivi i bit 1, 2 e 3, cioè il secondo, il terzo e il quarto ciclo. Le cause coincidono nel secondo e nel quarto ciclo; l’insieme delle attese comprende il secondo, il terzo, il quarto e il quinto, per un totale di quattro.",
      "Nel listato MOV copia la prima maschera, presente in EDI, nel registro temporaneo EDX; AND con ESI, la seconda maschera, conserva le posizioni comuni. POPCNT conta i bit a 1 e restituisce il numero dei cicli interessati. Una seconda POPCNT conta la OR delle maschere e lascia in EAX il fermo complessivo. Si assume che ogni bit attivo corrisponda effettivamente a un ciclo fermo: unire le cause permette allora di contare ciascun intervallo una sola volta."
    ],
    "introduzione": [
      "L’esercitazione permette di misurare attese dovute a cause sovrapposte senza duplicare i cicli comuni. Ogni bit delle due maschere rappresenta lo stesso intervallo: uno richiede un fermo, zero segnala la sua assenza. AND individua i cicli con entrambe le cause; OR individua quelli interessati da almeno una. Contare i bit attivi traduce le maschere in durate effettive.",
      "Premi «Carica l’esempio guidato» e allinea le parole 011010 e 001110 sul bit zero, a destra; nella figura temporale c1 compare invece a sinistra. Compila «Cicli con entrambe le cause», poi usa «Registra la previsione» e «Passo successivo». Confronta i due uno dell’AND 001010 con i quattro dell’OR 011110: tre richieste per causa producono quattro cicli fermi, contando una sola volta i due intervalli comuni."
    ],
    "lettura": "La figura dispone i cicli da sinistra a destra: c1 corrisponde al bit zero, mentre nelle parole binarie della consegna quel bit compare all’estremità destra. Leggi le etichette c1…c6 per allineare le righe. AND evidenzia i cicli comuni e OR tutti quelli interessati; il conteggio degli uno restituisce la durata del fermo.",
    "conclusione": "Le penalità sovrapposte si sommano tramite l’unione degli intervalli. Il numero di cicli persi è conteggio(A)+conteggio(B)−conteggio(A AND B), equivalente al conteggio degli uno di A OR B.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 4, «Contare i cicli di fermo sovrapposti», traccia 1. La spiegazione numerica seguente riguarda questa combinazione.",
      "Allinea 011010 e 001110 sul bit zero. Calcola separatamente AND e OR, poi conta gli uno nelle due maschere risultanti.",
      "Compila la previsione per «Cicli con entrambe le cause» e premi «Registra la previsione». Poi avanza con «Passo successivo» per verificare il procedimento, anche se la risposta iniziale richiede una correzione.",
      "Confronta i campi del risultato con lo svolgimento. Per rispondere a tutti i quesiti, apri «Apri la prova completa»; con i selettori Esercizio e Traccia puoi poi scegliere altri dati."
    ],
    "risultato": "Per l’esercizio 4, traccia 1, i risultati sono: Cicli con entrambe le cause = 2; Cicli di fermo effettivi = 4.",
    "ragionamento": "L’AND è 001010 e contiene due uno. L’OR è 011110 e contiene quattro uno: le due cause occupano tre cicli ciascuna, con due in comune, quindi il fermo effettivo è 3+3−2=4 cicli."
  },
  "3.5.7": {
    "scopo": "Determinerai quanta attesa impone una dipendenza quando manca l’inoltro. La convenzione di scrittura e lettura nei due semicicli ti permetterà di trovare il primo momento in cui il consumatore può usare il banco.",
    "teoria": [
      "In una pipeline il lavoro su un’istruzione attraversa cinque stadi: F preleva il comando, D legge gli operandi, E esegue il calcolo, M accede eventualmente alla memoria e W scrive il risultato. Mentre un’istruzione termina, un’altra può già cercare i valori necessari. La prima è il produttore e la seconda il consumatore del dato. Il collegamento diretto che inoltrerebbe un risultato fra stadi si chiama forwarding; la macchina di questo esercizio usa invece soltanto i valori già scritti nel banco dei registri.",
      "In questo modello il banco dei registri è l’insieme delle piccole memorie interne dalle quali si leggono gli operandi. Lo stadio W vi scrive nella prima metà del ciclo, lo stadio D vi legge nella seconda. Le due operazioni possono dunque avvenire nello stesso ciclo, in un ordine preciso.",
      "Il produttore entra in F nel ciclo 1 e raggiunge W nel ciclo 5. Se il consumatore è immediatamente successivo, entra in F nel ciclo 2 e si presenta in D nel ciclo 3. Deve conservare la propria posizione durante due intervalli di attesa, così da leggere nel secondo semiciclo del 5 il valore appena scritto dal produttore. Inserire istruzioni indipendenti fra i due può occupare quegli intervalli con lavoro utile.",
      "Se fra produttore e consumatore si inseriscono k istruzioni indipendenti, il primo D previsto per il consumatore cade al ciclo 3+k. Gli stalli sono il maggiore fra zero e 5−(3+k), scritto max(0,5−(3+k)): quando il consumatore arriva al ciclo 5 o più tardi, l’attesa è già esaurita. Nel listato EDI contiene k, LEA calcola il primo D in ECX e SUB prepara in EAX la differenza rispetto a 5. CMOVS sostituisce con zero una differenza negativa. Si ottiene così il numero di attese rispettando la convenzione di scrittura e lettura nei due semicicli."
    ],
    "introduzione": [
      "La ricostruzione serve a trovare quando un consumatore può leggere il risultato di un produttore usando soltanto il banco dei registri. Il produttore scrive in W nella prima metà del ciclo; il consumatore legge in D nella seconda. Questa convenzione permette una lettura valida nello stesso ciclo della scrittura e determina quanti intervalli di attesa occorrano prima di proseguire.",
      "Carica l’esempio guidato e avanza con «Passo successivo», seguendo il produttore da F al ciclo 1 fino a W al ciclo 5. Confronta questa data con il primo D del consumatore, previsto al ciclo 3. I due cicli di stallo coprono l’attesa fino alla lettura nel secondo semiciclo del 5; usa «Precedente» per distinguere l’arrivo iniziale in D dall’occasione in cui il dato diventa leggibile."
    ],
    "lettura": "Segui il produttore da F a W e il consumatore fino al suo primo D. Il tratto ripetuto in D rappresenta l’attesa; la scrittura nella prima metà del ciclo W precede la lettura nella seconda metà dello stesso ciclo.",
    "conclusione": "Senza forwarding il consumatore deve raggiungere un D in cui la scrittura del produttore sia già disponibile. Con la convenzione adottata, gli stalli sono max(0,5−primo ciclo D), ridotti da eventuali istruzioni indipendenti interposte.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 5, «Calcolare gli stalli dalla distanza fra istruzioni», traccia 1. La spiegazione numerica seguente riguarda questa combinazione.",
      "Con zero istruzioni interposte e il produttore in F al ciclo 1, individua W al ciclo 5. Ricava poi il primo D del consumatore e conta gli intervalli che lo separano dalla lettura valida.",
      "Avvia la ricostruzione con «Passo successivo» e controlla ogni trasformazione prima di passare alla successiva.",
      "Confronta i campi del risultato con lo svolgimento. Per rispondere a tutti i quesiti, apri «Apri la prova completa»; con i selettori Esercizio e Traccia puoi poi scegliere altri dati."
    ],
    "risultato": "Per l’esercizio 5, traccia 1, i risultati sono: Primo ciclo D previsto per il consumatore = 3; Stalli in D = 2.",
    "ragionamento": "Il consumatore immediato entra in F al ciclo 2 e in D al ciclo 3. Il produttore scrive al ciclo 5: D attende nei cicli 3 e 4, leggendo nel secondo semiciclo del 5; gli stalli sono 5−3=2."
  },
  "3.6.1": {
    "scopo": "Osserverai gli occupanti della pipeline prima del fronte, gli ingressi preparati e lo stato dopo il fronte. Il confronto serve a ricostruire aggiornamenti simultanei senza attribuire a un’istruzione più di un avanzamento nello stesso ciclo.",
    "teoria": [
      "Nel processore didattico PIPE le istruzioni passano dal prelievo F alla decodifica D, al calcolo E, all’eventuale accesso alla memoria M e alla scrittura W. Tra due fasi successive c’è un registro, una piccola memoria che trattiene i dati di un’istruzione per tutto un ciclo. Grazie a questa separazione, uno stadio può elaborare un comando mentre quello seguente sta terminando il lavoro su un comando precedente. Le sigle I1, I2 e successive identificano le istruzioni nell’ordine di ingresso.",
      "Ogni registro presenta due lati. Durante il ciclo rende disponibile in uscita la parola già conservata e riceve in ingresso quella che lo stadio precedente sta preparando. Il fronte del clock è l’istante in cui tutti i registri acquisiscono il rispettivo ingresso. Le nuove uscite diventano disponibili dopo quel fronte e alimentano le elaborazioni del ciclo appena iniziato.",
      "Con sei istruzioni indipendenti, nel ciclo 4 I1 occupa M e I2 occupa E. Al fronte W acquisisce i dati di I1, mentre M acquisisce quelli di I2. Confrontare la riga degli ingressi con la successiva riga delle uscite mostra perché ogni istruzione avanzi di un solo posto, pur essendo simultanei tutti i trasferimenti."
    ],
    "introduzione": [
      "La simulazione permette di comprendere un fronte di clock come acquisizione simultanea di dati già preparati. I registri fra gli stadi conservano le istruzioni durante il ciclo e ricevono in ingresso quelle provenienti dai posti precedenti. Confrontando vecchie uscite, ingressi e nuove uscite vedrai ogni istruzione avanzare di una sola posizione, anche quando tutti i trasferimenti avvengono insieme.",
      "Carica «Aggiornare una pipeline in riempimento» e avanza con «Passo successivo» fino agli ingressi preparati. Per prevedere il nuovo W segui I1 dal vecchio M, poi confronta la previsione con lo stato dopo il fronte. Ripeti con «Aggiornare dopo l’ultimo prelievo»: I6 entra in D e F resta vuoto, mentre ciascuna istruzione precedente continua ad avanzare usando gli stessi collegamenti."
    ],
    "lettura": "Le colonne F–D–E–M–W identificano le posizioni; le etichette I seguono le istruzioni. La riga superiore conserva la fotografia del ciclo precedente. Nella tappa centrale la riga inferiore mostra gli ingressi preparati per D, E, M e W; nella tappa finale mostra il ciclo dopo il fronte, compreso il nuovo prelievo in F. Il trattino indica una posizione vuota. Per ricostruire il nuovo W, segui l’istruzione presente nel vecchio M.",
    "conclusione": "Tutti i registri acquisiscono contemporaneamente gli ingressi preparati dal vecchio stato. La simultaneità conserva l’ordine del flusso: ogni istruzione avanza di una posizione, anche durante lo svuotamento.",
    "controlli": {
      "n": "Numero di istruzioni indipendenti, prelevate nell’ordine I1, I2 e così via.",
      "c": "Ciclo osservato immediatamente prima del fronte; la traccia confronta quel ciclo con il successivo."
    },
    "esperienze": [
      {
        "titolo": "Aggiornare una pipeline in riempimento",
        "parametri": {
          "n": 6,
          "c": 4
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzioni in ordine = 6; Ciclo precedente al fronte = 4.",
          "Parti da «Durante il ciclo 4» e annota F = I4, D = I3, E = I2, M = I1, W = —.",
          "In «Ingressi dei registri» associa ciascuna vecchia uscita alla posizione successiva. Prevedi l’istruzione che W acquisirà dal vecchio M; confronta poi anche D, E e M con gli ingressi preparati.",
          "Raggiungi «Dopo il fronte» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Dopo il fronte» leggi F = I5, D = I4, E = I3, M = I2, W = I1.",
        "ragionamento": "Durante il ciclo 4, I1 è in M e I2 in E. Al fronte W acquisisce I1 e M acquisisce I2, mentre D ed E ricevono I4 e I3; il nuovo prelievo ospita I5.",
        "attesi": [
          {
            "passo": 2,
            "campo": "F",
            "valore": "I5"
          },
          {
            "passo": 2,
            "campo": "D",
            "valore": "I4"
          },
          {
            "passo": 2,
            "campo": "E",
            "valore": "I3"
          },
          {
            "passo": 2,
            "campo": "M",
            "valore": "I2"
          },
          {
            "passo": 2,
            "campo": "W",
            "valore": "I1"
          }
        ]
      },
      {
        "titolo": "Aggiornare dopo l’ultimo prelievo",
        "parametri": {
          "n": 6,
          "c": 6
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzioni in ordine = 6; Ciclo precedente al fronte = 6.",
          "Parti da «Durante il ciclo 6» e annota F = I6, D = I5, E = I4, M = I3, W = I2.",
          "In «Ingressi dei registri» prevedi l’istruzione che W acquisirà dal vecchio M. Confronta anche D, E e M con gli ingressi preparati e verifica il nuovo F, considerando che il flusso termina con I6.",
          "Raggiungi «Dopo il fronte» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Dopo il fronte» leggi F = —, D = I6, E = I5, M = I4, W = I3.",
        "ragionamento": "Nel ciclo 6 il prelievo contiene l’ultima istruzione I6. Al fronte essa entra in D; I5, I4 e I3 avanzano rispettivamente in E, M e W e F resta vuoto.",
        "attesi": [
          {
            "passo": 2,
            "campo": "F",
            "valore": "—"
          },
          {
            "passo": 2,
            "campo": "D",
            "valore": "I6"
          },
          {
            "passo": 2,
            "campo": "E",
            "valore": "I5"
          },
          {
            "passo": 2,
            "campo": "M",
            "valore": "I4"
          },
          {
            "passo": 2,
            "campo": "W",
            "valore": "I3"
          }
        ]
      }
    ]
  },
  "3.6.2": {
    "scopo": "Tre sorgenti possono proporre l’indirizzo del prossimo prelievo. Attiverai il ritorno da procedura e poi la correzione di un salto per verificare la priorità del selettore che alimenta la memoria istruzioni.",
    "teoria": [
      "Per prelevare un’istruzione occorre l’indirizzo del suo primo byte, un gruppo di otto bit conservato in memoria. PC significa contatore di programma ed è il nome del registro che conserva un indirizzo di esecuzione. Nel processore didattico PIPE le fasi di più istruzioni si sovrappongono, perciò il prelievo può cominciare prima che un salto o un ritorno abbia stabilito l’indirizzo corretto. F_predPC conserva il candidato previsto per F, lo stadio di prelievo; f_pc è l’indirizzo effettivamente consegnato alla memoria istruzioni nel ciclo osservato.",
      "Un salto condizionale sceglie fra la destinazione indicata nel comando e l’istruzione che lo segue in memoria. Se la previsione ha raggiunto la destinazione e la condizione risulta falsa, occorre riprendere dall’indirizzo sequenziale, conservato nel campo M_valA quando il salto arriva allo stadio M. Ret termina invece una procedura, cioè un tratto di programma chiamato da un altro: recupera l’indirizzo di ripresa dalla pila, dove era stato depositato al momento della chiamata. L’indirizzo letto giunge nel campo W_valM dello stadio finale W.",
      "Il selettore esamina i candidati in ordine: correzione del salto, ritorno, previsione ordinaria. Con indirizzi 64, 98 e 150, il ritorno da solo seleziona 150; attivando anche la correzione del salto viene selezionato 98. Con entrambe le richieste a zero passa invece 64. I valori appaiono come 0x40, 0x62 e 0x96, dove 0x segnala la base sedici. I due segnali sono regolabili separatamente per rendere osservabile la priorità della rete, anche attraverso combinazioni forzate appositamente."
    ],
    "introduzione": [
      "L’esperimento serve a comprendere una scelta di indirizzo governata da priorità. Il prelievo può usare il PC predetto, correggere un salto oppure riprendere dall’indirizzo recuperato dalla pila per ret. Il segnale f_pc è l’indirizzo effettivamente fornito alla memoria istruzioni. Attivare richieste diverse rende osservabile quale sorgente prevalga, anche quando più candidati sono disponibili insieme.",
      "Carica «Il ritorno seleziona la pila» e avanza con «Passo successivo», confrontando i tre indirizzi con f_pc=0x96, proveniente da W_valM. Carica poi «La correzione del salto prende precedenza»: entrambe le richieste sono attive e l’uscita diventa 0x62, da M_valA. Interpreta il cambiamento attraverso l’ordine dei controlli; i segnali sono forzabili separatamente per verificare la priorità della rete."
    ],
    "lettura": "F_predPC, M_valA e W_valM sono i tre candidati. Le condizioni indicano quale richiesta è attiva e il collegamento selezionato raggiunge f_pc. Leggi prima la sorgente scelta, poi il suo valore, così da distinguere priorità e indirizzo.",
    "conclusione": "Nel selettore mostrato, la correzione del salto in M precede il ritorno in W, che precede il PC predetto. La prova forza combinazioni dei segnali per osservare la rete di controllo, indipendentemente dalla loro frequenza in un’esecuzione reale.",
    "controlli": {
      "j": "Con 1 attiva la correzione di un salto predetto preso e poi risultato falso nello stadio M.",
      "r": "Con 1 segnala un ritorno ret nello stadio W, che fornisce l’indirizzo letto dalla pila.",
      "p": "Indirizzo proposto dal normale meccanismo di previsione, in byte.",
      "m": "Indirizzo successivo in sequenza al salto, conservato per recuperare da una previsione errata.",
      "w": "Indirizzo di ritorno recuperato dalla pila e disponibile nello stadio W."
    },
    "esperienze": [
      {
        "titolo": "Il ritorno seleziona la pila",
        "parametri": {
          "j": 0,
          "r": 1,
          "p": 64,
          "m": 98,
          "w": 150
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: M contiene un salto con condizione falsa = 0; W contiene ret = 1; PC predetto = 64; PC sequenziale salvato = 98; Indirizzo letto dalla pila = 150.",
          "Parti da «Ingressi candidati» e annota F_predPC = 0x40, M_valA = 0x62, W_valM = 0x96.",
          "In «Condizioni del selettore» verifica che sia attivo soltanto W_ret. In «Accesso alle istruzioni» segui il candidato W_valM.",
          "Raggiungi «Accesso alle istruzioni» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Accesso alle istruzioni» leggi Sorgente = W_valM, f_pc = 0x96.",
        "ragionamento": "Il segnale del salto vale zero e W_ret vale uno. Il selettore usa W_valM=150, rappresentato come 0x96, al posto del candidato previsto 64.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Sorgente",
            "valore": "W_valM"
          },
          {
            "passo": 2,
            "campo": "f_pc",
            "valore": "0x96"
          }
        ]
      },
      {
        "titolo": "La correzione del salto prende precedenza",
        "parametri": {
          "j": 1,
          "r": 1,
          "p": 64,
          "m": 98,
          "w": 150
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: M contiene un salto con condizione falsa = 1; W contiene ret = 1; PC predetto = 64; PC sequenziale salvato = 98; Indirizzo letto dalla pila = 150.",
          "Parti da «Ingressi candidati» e annota F_predPC = 0x40, M_valA = 0x62, W_valM = 0x96.",
          "In «Condizioni del selettore» verifica che entrambe le richieste valgano 1. Prima di proseguire scegli il candidato prioritario e confrontalo con f_pc.",
          "Raggiungi «Accesso alle istruzioni» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Accesso alle istruzioni» leggi Sorgente = M_valA, f_pc = 0x62.",
        "ragionamento": "Con entrambe le richieste attive, la correzione del salto ha la priorità su W_ret: il selettore porta all’uscita M_valA=98=0x62.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Sorgente",
            "valore": "M_valA"
          },
          {
            "passo": 2,
            "campo": "f_pc",
            "valore": "0x62"
          }
        ]
      }
    ]
  },
  "3.6.3": {
    "scopo": "Più istruzioni precedenti possono aver prodotto un nuovo valore per lo stesso registro. Individuerai quale risultato deve ricevere il consumatore e come una copia condizionale fallita cambia il percorso di inoltro.",
    "teoria": [
      "Un registro è una piccola memoria interna che conserva un valore del programma. Se un’istruzione deve usare un numero che un’istruzione precedente sta ancora calcolando, leggerlo subito dal registro può fornire un valore superato. In PIPE le istruzioni si sovrappongono: mentre la più giovane raccoglie gli operandi nella decodifica D, altre sono nel calcolo E, nell’accesso ai dati M o nella scrittura W. Si parla di dipendenza RAW, Read After Write, lettura dopo scrittura, perché l’ordine del programma richiede il nuovo dato.",
      "Un collegamento di inoltro, detto forwarding, porta il risultato direttamente alla lettura di D. Il circuito confronta il nome del registro richiesto, qui %rax, con la destinazione delle istruzioni precedenti. Fra quelle che scrivono realmente quel registro occorre scegliere la più vicina nell’ordine del programma, perché il suo risultato sostituisce quelli prodotti prima.",
      "Se la somma addq in E destina 52 a %rax e il carico mrmovq in M ha letto 93 per lo stesso registro, D riceve 52. Se in E c’è una copia condizionale cmov con condizione falsa, quella scrittura viene soppressa: la destinazione assume il codice RNONE, nessun registro. Il valore pertinente diviene allora 93. Anche una addq destinata a %rbx lascia passare i candidati precedenti per %rax, poiché aggiorna un registro diverso.",
      "Le etichette precisano origine e natura dei candidati. e_valE è il risultato appena calcolato dall’ALU, l’unità aritmetico-logica, in E; m_valM è il dato appena letto dalla memoria in M; M_valE è un risultato aritmetico che M sta trasportando; W_valE è quello arrivato alla scrittura W. Il campo d_valA è l’operando selezionato per D. In questo esperimento M offre 93 con un carico, 74 con un’operazione aritmetica OPq e nessun dato pertinente con nop, l’istruzione priva di effetti sui dati. W offre sempre 31 per %rax: se E e M sono esclusi, D riceve 31, superando il vecchio 12 del banco."
    ],
    "introduzione": [
      "La simulazione permette di comprendere quale valore debba ricevere un’istruzione quando più produttori aggiornano lo stesso registro. Il forwarding, o inoltro, porta direttamente i risultati dagli stadi alla preparazione degli operandi. La scelta segue la scrittura pertinente più vicina al consumatore nell’ordine del programma; una copia condizionale fallita ha destinazione RNONE, ossia nessun registro, e viene esclusa.",
      "Carica «Il produttore più vicino scrive %rax» e raggiungi «Confronti» con «Passo successivo». Confronta i candidati 52 da E, 93 da M e 31 da W, poi verifica d_valA=52. Carica «La copia condizionale lascia passare il dato di M»: osserva RNONE per E e il nuovo d_valA=93. La priorità dipende dalla scrittura effettiva, quindi la sola presenza di un risultato interno è insufficiente."
    ],
    "lettura": "Confronta la sorgente richiesta, %rax, con le destinazioni in E e M. Le caselle mostrano i dati candidati del banco, di W e degli stadi più vicini. Il campo d_valA è il valore effettivamente consegnato alla lettura in D.",
    "conclusione": "Il forwarding sceglie la scrittura pertinente più recente nell’ordine del programma. Una copia condizionale con condizione falsa ha destinazione RNONE, cioè nessun registro, e lascia rilevante il risultato di un’istruzione precedente.",
    "controlli": {
      "e": "Istruzione nello stadio E; la scelta determina se la sua destinazione effettiva coincide con %rax.",
      "m": "Istruzione nello stadio M; un carico offre 93 da memoria e un’operazione aritmetica offre il proprio risultato.",
      "v": "Risultato dell’ALU disponibile in E, usato quando E scrive effettivamente il registro richiesto."
    },
    "esperienze": [
      {
        "titolo": "Il produttore più vicino scrive %rax",
        "parametri": {
          "e": "op",
          "m": "load",
          "v": 52
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzione in E = addq che scrive %rax; Istruzione in M = mrmovq verso %rax; Risultato ALU in E = 52.",
          "Parti da «Lettura originaria» e annota Banco prima della scrittura = 12, W_valE = 31.",
          "In «Confronti» verifica che E e M dichiarino entrambe %rax. Prevedi quale dato sostituisca quello più vecchio prima di aprire «Dato inoltrato».",
          "Raggiungi «Dato inoltrato» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Dato inoltrato» leggi Sorgente = e_valE, d_valA = 52.",
        "ragionamento": "E produce 52 per %rax ed è più vicina al consumatore rispetto all’istruzione in M. Il confronto prioritario seleziona e_valE=52, superando i candidati 93, 31 e 12.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Sorgente",
            "valore": "e_valE"
          },
          {
            "passo": 2,
            "campo": "d_valA",
            "valore": "52"
          }
        ]
      },
      {
        "titolo": "La copia condizionale lascia passare il dato di M",
        "parametri": {
          "e": "cmov",
          "m": "load",
          "v": 52
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Istruzione in E = cmov con condizione falsa; Istruzione in M = mrmovq verso %rax; Risultato ALU in E = 52.",
          "Parti da «Lettura originaria» e annota Banco prima della scrittura = 12, W_valE = 31.",
          "In «Confronti» osserva RNONE per E. Escludi quel candidato e segui il valore del carico in M fino a d_valA.",
          "Raggiungi «Dato inoltrato» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Dato inoltrato» leggi Sorgente = m_valM, d_valA = 93.",
        "ragionamento": "La cmov fallita in E ha destinazione RNONE e quindi lascia %rax invariato. Il candidato pertinente successivo è il carico in M: m_valM=93 viene inoltrato a d_valA.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Sorgente",
            "valore": "m_valM"
          },
          {
            "passo": 2,
            "campo": "d_valA",
            "valore": "93"
          }
        ]
      }
    ]
  },
  "3.6.4": {
    "scopo": "La pipeline preleva dal bersaglio di un salto prima di conoscerne l’esito. Confronterai condizione falsa e vera per capire quali istruzioni vengono conservate e quale indirizzo alimenta il prelievo successivo.",
    "teoria": [
      "Un salto condizionale fa proseguire un programma da uno fra due indirizzi. Per esempio, a seconda dell’esito di un confronto si può ripetere un calcolo oppure passare all’istruzione successiva. PIPE, che sovrappone più istruzioni, deve scegliere da dove prelevare mentre il salto attende ancora di essere valutato. Nel modello si prevede sempre che il salto raggiunga la destinazione indicata.",
      "Quando il salto arriva al calcolo E, il prelievo F e la decodifica D hanno già impegnato due posizioni del cammino previsto. Se la condizione è falsa, questi comandi sono estranei all’esecuzione richiesta. Il controllo ne sopprime il trasferimento inserendo in D e in E due bolle, ossia due posizioni prive di effetti sul programma. Il salto porta intanto l’indirizzo sequenziale nello stadio M.",
      "La sigla jXX rappresenta un salto condizionale della macchina didattica; e_Cnd è la condizione appena calcolata in E, pari a 1 quando il salto deve raggiungere la destinazione. Un salto che cominci al byte 64 e ne occupi nove lascia come successore sequenziale il byte 73. Se la destinazione prevista è 384 e la condizione è vera, proseguono le due istruzioni nop prelevate a 384 e 385, indicate con P0 e P1. Una nop occupa qui un byte e lascia invariati i dati, perciò il successivo prelievo avviene a 386.",
      "Un byte è un gruppo di otto bit e il suo indirizzo individua una posizione di memoria. Gli indirizzi preceduti da 0x sono scritti in base sedici: 73 diventa 0x49, 384 diventa 0x180 e 386 diventa 0x182. Il campo f_pc è l’indirizzo effettivo del nuovo prelievo. D_bubble ed E_bubble valgono 1 quando al fronte occorre inserire bolle nei rispettivi registri, eliminando i due comandi del cammino errato; con valore 0, P1 entra in D e P0 in E."
    ],
    "introduzione": [
      "L’attività permette di capire come la pipeline corregga un salto previsto in modo errato. Il prelievo anticipa l’esito raggiungendo il bersaglio; quando E valuta la condizione, due istruzioni più giovani sono già in F e D. Se il cammino è sbagliato, il controllo inserisce bolle, posizioni prive di effetti, e riprende dall’indirizzo sequenziale conservato dal salto.",
      "Carica «Recuperare da una previsione errata» e avanza con «Passo successivo», collegando e_Cnd=0 ai segnali D_bubble ed E_bubble. Confronta il nuovo f_pc=0x49 con 64+9, la fine del salto. Carica poi «Conservare il cammino previsto»: P0 e P1 avanzano e il prelievo raggiunge 0x182. Le due nop occupano già 0x180 e 0x181, quindi il nuovo indirizzo si trova oltre entrambe."
    ],
    "lettura": "Quando jXX è in E, P0 occupa D e P1 è in F sul percorso predetto. I segnali D_bubble ed E_bubble indicano se quelle posizioni saranno sostituite da bolle. Il fotogramma successivo mostra gli occupanti effettivi e f_pc.",
    "conclusione": "Una previsione errata annulla le due istruzioni più giovani e riprende dal successore sequenziale del salto. Quando la previsione è corretta, le istruzioni già avviate continuano e il prelievo procede oltre di esse.",
    "controlli": {
      "t": "Esito della condizione del salto: 0 richiede il recupero del cammino sequenziale, 1 conferma il bersaglio predetto.",
      "b": "Indirizzo del primo byte di jXX; aggiungendo i nove byte della codifica si ricava il successore sequenziale.",
      "target": "Indirizzo da cui sono già state prelevate P0 e P1, due nop consecutive di un byte."
    },
    "esperienze": [
      {
        "titolo": "Recuperare da una previsione errata",
        "parametri": {
          "t": 0,
          "b": 64,
          "target": 384
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Condizione vera = 0; Indirizzo del salto = 64; Destinazione predetta = 384.",
          "Parti da «Salto in E» e annota PC di jXX = 0x40, D = P0 = 0x180, F = P1 = 0x181.",
          "In «Risoluzione» collega e_Cnd=0 alle due bolle. Calcola 64+9 e confronta questo indirizzo con f_pc nel ciclo seguente.",
          "Raggiungi «Ciclo seguente» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Ciclo seguente» leggi E = Bolla, D = Bolla, f_pc = 0x49.",
        "ragionamento": "Il salto a 64 occupa nove byte, quindi il successore sequenziale è 73=0x49. La condizione falsa invalida P0 e P1: D ed E ricevono bolle e f_pc viene corretto a 0x49.",
        "attesi": [
          {
            "passo": 2,
            "campo": "E",
            "valore": "Bolla"
          },
          {
            "passo": 2,
            "campo": "D",
            "valore": "Bolla"
          },
          {
            "passo": 2,
            "campo": "f_pc",
            "valore": "0x49"
          }
        ]
      },
      {
        "titolo": "Conservare il cammino previsto",
        "parametri": {
          "t": 1,
          "b": 64,
          "target": 384
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Condizione vera = 1; Indirizzo del salto = 64; Destinazione predetta = 384.",
          "Parti da «Salto in E» e annota PC di jXX = 0x40, D = P0 = 0x180, F = P1 = 0x181.",
          "In «Risoluzione» verifica che le due bolle siano disattivate. Segui P0 in E e P1 in D, poi aggiungi due byte alla destinazione per prevedere il nuovo prelievo.",
          "Raggiungi «Ciclo seguente» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Ciclo seguente» leggi E = P0, D = P1, f_pc = 0x182.",
        "ragionamento": "La condizione vera conferma il bersaglio 384=0x180. P0 e P1 avanzano in E e D; avendo già occupato i byte 384 e 385, il nuovo prelievo raggiunge 386=0x182.",
        "attesi": [
          {
            "passo": 2,
            "campo": "E",
            "valore": "P0"
          },
          {
            "passo": 2,
            "campo": "D",
            "valore": "P1"
          },
          {
            "passo": 2,
            "campo": "f_pc",
            "valore": "0x182"
          }
        ]
      }
    ]
  },
  "3.6.5": {
    "scopo": "Le richieste di attesa e gli errori devono essere risolti rispettando l’ordine delle istruzioni. Studierai prima la convivenza di load/use e ret, poi l’effetto di un errore anziano sulla scrittura dei flag da parte di una somma più giovane.",
    "teoria": [
      "Nel processore PIPE le istruzioni attraversano prelievo F, decodifica e lettura degli operandi D, esecuzione E, memoria M e scrittura W. Possono quindi trovarsi nello stesso ciclo un’istruzione anziana in memoria e una più giovane al calcolo. Anziana e giovane descrivono l’ordine nel programma. I registri, piccole memorie di passaggio, devono conservare tale ordine anche quando manca un dato o un accesso alla memoria genera un errore.",
      "Un carico porta una parola dalla memoria a un registro. Se l’istruzione seguente ne ha subito bisogno, il prelievo F e la decodifica D si fermano, mentre nell’esecuzione E entra una bolla, una posizione senza istruzione utile. Il comando ret, che torna da una procedura, richiede inoltre l’indirizzo salvato in pila. Nel caso popq %rsp si preleva una parola dalla pila per usarla come nuovo puntatore alla cima. Poiché ret userà quel puntatore per cercare l’indirizzo di ritorno, il controllo conserva ret in D finché la parola è disponibile.",
      "I codici di condizione, o CC, registrano proprietà di un risultato aritmetico, come l’essere zero. Con una somma in E e lo stato normale AOK dell’istruzione anziana in M, il calcolo può aggiornare i CC. Se dalla memoria esce ADR, segnale di errore di indirizzo, questi indicatori devono conservare il valore precedente, così che l’arresto rifletta soltanto gli effetti delle istruzioni ammesse.",
      "Lo stato preciso richiede che, quando si segnala l’errore, siano osservabili gli effetti delle istruzioni precedenti ammesse e restino esclusi quelli delle istruzioni successive. I segnali mostrati illustrano questo vincolo sui codici di condizione e sullo stato che raggiunge W; una macchina completa controlla anche le altre scritture architetturali.",
      "I quattro casi del selettore separano le cause. Con il solo load/use, cioè carico seguito dall’uso immediato, si fermano F e D e si inserisce una bolla in E. Con la sola ret si ferma F e si inserisce una bolla in D, lasciando avanzare il ritorno verso la lettura del suo indirizzo. Quando le due cause coincidono, D conserva ret e la bolla entra soltanto in E. Con addq seguita da nop entrambe le cause sono assenti. La somma può scrivere i CC soltanto con stato regolare AOK dell’istruzione anziana; lo stato precedente di W è assunto AOK in tutti questi confronti."
    ],
    "introduzione": [
      "La simulazione permette di comprendere come il controllo risolva richieste concorrenti preservando l’ordine del programma. Uno stallo conserva un’istruzione, una bolla introduce una posizione priva di effetti. Un errore dell’istruzione più anziana deve inoltre impedire che una più giovane cambi i codici di condizione: lo stato all’arresto deve riflettere soltanto gli effetti ammessi prima dell’errore.",
      "Carica «Una ret dipendente dal valore prelevato» e avanza fino ai registri giovani: confronta D_stall=1 con D_bubble=0, che conserva il ritorno in attesa. Passa poi al caso della somma giovane dopo un errore di memoria e osserva Scrittura CC=0. Seleziona AOK per la stessa somma, premi «Applica i parametri» e confronta l’abilitazione: l’errore anziano decide se quel risultato può modificare i flag."
    ],
    "lettura": "Rilevamento identifica le cause; Registri giovani mostra stalli e bolle per F, D ed E. Effetti architetturali segue lo stato terminale verso W e l’abilitazione dei CC. Un uno nella voce stall conserva il posto; un uno nella voce bubble vi inserisce un’operazione priva di effetti.",
    "conclusione": "Il controllo conserva il consumatore quando deve attendere un carico, dando a D_stall precedenza sulla bolla richiesta da ret. Un errore di un’istruzione più anziana impedisce inoltre che operazioni più giovani modifichino i codici di condizione.",
    "controlli": {
      "h": "Coppia di istruzioni presenti in E e D; determina dipendenza load/use, ritorno oppure semplice avanzamento.",
      "stat": "Esito dell’istruzione più anziana in M: AOK indica esecuzione regolare, ADR un errore di indirizzo proveniente dalla memoria."
    },
    "esperienze": [
      {
        "titolo": "Una ret dipendente dal valore prelevato",
        "parametri": {
          "h": "both",
          "stat": "ok"
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Situazione = E: popq %rsp · D: ret; Stato della più anziana istruzione in M = AOK.",
          "Parti da «Rilevamento» e annota load/use = 1, ret in D = 1, m_stat = AOK.",
          "In «Rilevamento» verifica le due cause attive. In «Registri giovani» confronta D_stall e D_bubble e spiega perché ret debba restare al proprio posto.",
          "Raggiungi «Effetti architetturali» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Effetti architetturali» leggi M_bubble = 0, W_stat al fronte = AOK, Scrittura CC = 0.",
        "ragionamento": "popq %rsp produce il puntatore che ret in D dovrà usare. F e D si fermano, E riceve una bolla e D_bubble=0 conserva ret; la popq lascia comunque disabilitata la scrittura dei flag.",
        "attesi": [
          {
            "passo": 2,
            "campo": "M_bubble",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "W_stat al fronte",
            "valore": "AOK"
          },
          {
            "passo": 2,
            "campo": "Scrittura CC",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Una somma giovane dopo un errore di memoria",
        "parametri": {
          "h": "op",
          "stat": "adr"
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Situazione = E: addq · D: nop; Stato della più anziana istruzione in M = ADR da memoria dati.",
          "Parti da «Rilevamento» e annota load/use = 0, ret in D = 0, m_stat = ADR.",
          "In «Rilevamento» osserva ADR con assenza di load/use e ret. Avanza a «Effetti architetturali» e confronta l’aggiornamento di W, la bolla in M e la scrittura dei CC.",
          "Raggiungi «Effetti architetturali» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Effetti architetturali» leggi M_bubble = 1, W_stat al fronte = ADR, Scrittura CC = 0.",
        "ragionamento": "L’istruzione anziana in M segnala ADR, perciò i flag devono conservare il valore precedente alla addq più giovane. Il controllo porta ADR in W, inserisce una bolla in M e mantiene Scrittura CC=0 per preservare lo stato all’errore.",
        "attesi": [
          {
            "passo": 2,
            "campo": "M_bubble",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "W_stat al fronte",
            "valore": "ADR"
          },
          {
            "passo": 2,
            "campo": "Scrittura CC",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "3.6.6": {
    "scopo": "Tre istruzioni comprendono un carico, il suo consumatore e un’operazione indipendente. Confronterai due ordini per osservare direttamente il ciclo d’attesa e verificare come un riordino valido lo possa occupare con lavoro utile.",
    "teoria": [
      "Tre istruzioni possono richiedere tempi diversi a seconda dell’ordine con cui il processore le incontra. Nella sequenza qui rappresentata, L legge la memoria e porta un valore nel registro %rax. U usa quel valore in un’addizione. I è indipendente da entrambi e può quindi occupare la posizione tra la lettura e l’uso del dato.",
      "La pipeline distribuisce il lavoro tra prelievo F, decodifica D, esecuzione E, memoria M e scrittura W. Per un carico E calcola l’indirizzo e M legge il contenuto. Se U segue immediatamente L, si trova in D mentre L è ancora in E. A quell’istante è pronto l’indirizzo, mentre il valore necessario all’addizione arriverà durante il passaggio di L in M.",
      "Con un solo gruppo L, U, I, la traccia mostra U per due cicli consecutivi in D. Il posto vuoto che nel frattempo avanza in E prende il nome di bolla. Nell’ordine L, I, U la memoria può servire L mentre U prepara gli operandi. Le sigle L1, U1 e I1 identificano le istruzioni del primo gruppo e consentono di seguirle anche quando si aggiunge un gruppo successivo.",
      "Il modello assume un collegamento di forwarding, o inoltro, che porta il dato letto in M agli operandi preparati in D. Per questo un ciclo interposto è sufficiente. Il riordino è valido perché I è una copia fra registri estranei a L e U e lascia invariati gli indicatori aritmetici; gli accessi alla memoria sono assunti regolari. Con più gruppi il modello ripete le stesse dipendenze, una fra ogni L e la propria U. Prima di estendere questo riordino a un altro programma occorrerebbe verificare anche gli altri valori letti e scritti, gli accessi alla memoria e le condizioni di arresto."
    ],
    "introduzione": [
      "Questa attività serve a verificare direttamente il vantaggio di interporre lavoro indipendente fra un carico e il suo uso. L legge un dato, U lo consuma e I è una copia che usa altri registri. La traccia mostra quando il dato arriva dalla memoria e quando U può avanzare, collegando la doppia permanenza in D a un ciclo aggiuntivo nel bilancio.",
      "Carica «Osservare l’attesa load/use» e raggiungi i cicli 3 e 4 con «Passo successivo»: confronta U1 ferma in D con L1 che prosegue in M e la bolla in E. Completa il bilancio di otto cicli, poi carica «Riempire l’attesa con un’istruzione utile». Segui I1 fra L1 e U1 e verifica sette cicli, spiegando il risparmio mediante la disponibilità del dato."
    ],
    "lettura": "La griglia mostra i cicli nelle colonne e gli stadi F, D, E, M e W nelle righe. L legge il dato, U lo usa e I è la copia indipendente; il numero finale distingue il gruppo. Una stessa U in D in due colonne consecutive segnala l’attesa. Il cerchio ○ evidenzia la bolla appena inserita in E, mentre il trattino — indica una posizione vuota. Ogni fotogramma mostra al massimo gli ultimi otto cicli: per più gruppi, usa «Precedente» per rivedere quelli iniziali e il «Bilancio» per il conteggio complessivo.",
    "conclusione": "L’istruzione indipendente può separare il carico dal suo uso, lasciando alla memoria il tempo di fornire il dato. Il guadagno dipende dal rispetto delle dipendenze e dal momento di disponibilità del risultato nella pipeline.",
    "controlli": {
      "ordine": "Ordine delle tre istruzioni: L·U·I presenta l’uso immediato, L·I·U inserisce il lavoro indipendente fra produzione e consumo.",
      "g": "Numero di gruppi consecutivi della stessa terna; i pedici della figura distinguono il gruppo di appartenenza."
    },
    "esperienze": [
      {
        "titolo": "Osservare l’attesa load/use",
        "parametri": {
          "ordine": "vicino",
          "g": 1
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Ordine delle tre istruzioni = L · U · I; Blocchi consecutivi = 1.",
          "Parti da «Ciclo 1» e annota F = L1, D = —, E = —, M = —, W = —.",
          "Avanza fino a «Ciclo 3» e annota U1 in D con L1 in E. In «Ciclo 4» verifica che U1 resti in D ed E sia vuoto; segui poi l’ultimo completamento.",
          "Raggiungi «Bilancio» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Bilancio» leggi Completamenti = 3, Cicli = 8, Attese load/use = 1.",
        "ragionamento": "Tre istruzioni in cinque stadi richiederebbero 3+4=7 cicli. L’uso immediato aggiunge un ciclo, visibile nella doppia permanenza di U1 in D: il bilancio è 8 cicli e una attesa.",
        "attesi": [
          {
            "passo": 8,
            "campo": "Completamenti",
            "valore": "3"
          },
          {
            "passo": 8,
            "campo": "Cicli",
            "valore": "8"
          },
          {
            "passo": 8,
            "campo": "Attese load/use",
            "valore": "1"
          }
        ]
      },
      {
        "titolo": "Riempire l’attesa con un’istruzione utile",
        "parametri": {
          "ordine": "separa",
          "g": 1
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Ordine delle tre istruzioni = L · I · U; Blocchi consecutivi = 1.",
          "Parti da «Ciclo 1» e annota F = L1, D = —, E = —, M = —, W = —.",
          "Avanza a «Ciclo 3» e «Ciclo 4»: I1 occupa la posizione fra L1 e U1. Verifica che U1 entri in D quando L1 raggiunge M e prosegua senza una seconda permanenza in D.",
          "Raggiungi «Bilancio» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Bilancio» leggi Completamenti = 3, Cicli = 7, Attese load/use = 0.",
        "ragionamento": "La sequenza L1,I1,U1 dispone di un’istruzione utile fra il carico e il consumo. Il dato arriva in tempo e il bilancio resta quello ideale di 3+4=7 cicli, con zero attese load/use.",
        "attesi": [
          {
            "passo": 7,
            "campo": "Completamenti",
            "valore": "3"
          },
          {
            "passo": 7,
            "campo": "Cicli",
            "valore": "7"
          },
          {
            "passo": 7,
            "campo": "Attese load/use",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "3.6.7": {
    "scopo": "Quantificherai il vantaggio del riordino L,U,I in L,I,U su gruppi ripetuti. Dai cicli passerai al tempo e al CPI, distinguendo il risparmio assoluto dal rapporto di accelerazione.",
    "teoria": [
      "Un programma può guadagnare tempo anche eseguendo esattamente le stesse istruzioni. I registri sono piccole memorie interne che custodiscono i valori su cui opera il processore. Qui L legge una parola dalla memoria nel registro %rax, U somma quella parola a %rbx e I copia %rsi in %rdi. Dal momento che la copia tocca registri separati e conserva gli indicatori aritmetici, anticiparla rispetto alla somma lascia invariati i valori che le altre due istruzioni leggono e scrivono.",
      "Il vantaggio dipende dalla pipeline, che fa avanzare più istruzioni attraverso cinque stadi di un ciclo: prelievo, preparazione degli operandi, calcolo, memoria e scrittura. Quando U segue subito L, il processore aspetta un ciclo affinché la memoria fornisca il dato. Un collegamento diretto di forwarding, o inoltro, lo porta poi al consumatore. Interponendo I si occupa l’attesa con un’operazione utile. Il confronto assume accessi regolari alla memoria e conserva i valori letti e scritti dal programma; i due ordini usano lo stesso periodo di clock.",
      "Con quattro gruppi di tre istruzioni e un periodo di 65 picosecondi, l’esecuzione senza attese dura sedici cicli, inclusi i quattro del riempimento. Nell’ordine originario si aggiungono quattro attese, una per gruppo. La differenza fra venti e sedici cicli equivale a 260 picosecondi. Il rapporto fra le durate, 1300/1040=1,25, misura l’accelerazione.",
      "Il CPI è il numero medio di cicli per istruzione completata: con dodici istruzioni i due rapporti sono 20/12 e 16/12, ossia circa 1,667 e 1,333. Un picosecondo, ps, è un millesimo di miliardesimo di secondo; moltiplicando i cicli per il periodo si ottengono tempi in ps. L’accelerazione 1,25 è invece un rapporto privo di unità: il tempo riordinato è il tempo originario diviso per 1,25, quindi vale l’80% di quello iniziale. Il tempo risparmiato di 260 ps rappresenta in questo caso il 20% dei 1300 ps di partenza."
    ],
    "introduzione": [
      "La simulazione permette di quantificare il vantaggio di un riordino attraverso tre misure diverse. Il risparmio è una differenza di tempi; il CPI è il numero medio di cicli per istruzione; l’accelerazione è il rapporto fra durata originale e durata riordinata. Le due versioni eseguono gli stessi gruppi di carico, uso e copia indipendente con un identico periodo di clock.",
      "Carica «Quattro gruppi consecutivi» e avanza con «Passo successivo», confrontando venti e sedici cicli. Moltiplica la differenza per 65 ps e verifica il risparmio di 260 ps, poi confronta il rapporto 1300/1040 con l’accelerazione 1,25. Carica «Otto gruppi consecutivi»: il risparmio raddoppia, mentre il rapporto diventa circa 1,286 perché i quattro cicli iniziali incidono meno sul programma più lungo."
    ],
    "lettura": "Le prime due righe confrontano lo stesso numero di istruzioni nei due ordini. Il tempo si ottiene moltiplicando cicli e periodo. Il pannello conclusivo espone differenza, CPI e rapporto fra la durata originale e quella riordinata.",
    "conclusione": "Ogni gruppo riordinato elimina una attesa load/use e risparmia un periodo di clock. Il rapporto di accelerazione considera anche i quattro cicli iniziali di riempimento, perciò cambia con la lunghezza della sequenza.",
    "controlli": {
      "g": "Numero di gruppi da tre istruzioni; ciascuno contiene un carico, il suo uso e una copia indipendente.",
      "t": "Durata del ciclo in picosecondi, uguale per entrambe le versioni confrontate."
    },
    "esperienze": [
      {
        "titolo": "Quattro gruppi consecutivi",
        "parametri": {
          "g": 4,
          "t": 65
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Ripetizioni L,U,I = 4; Periodo di clock (ps) = 65.",
          "Parti da «Versione L, U, I» e annota Istruzioni = 12, Cicli = 20, Tempo (ps) = 1300.",
          "Confronta 20 cicli in «Versione L, U, I» con 16 in «Versione L, I, U». Moltiplica la differenza per 65 e calcola il rapporto delle due durate.",
          "Raggiungi «Confronto» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Confronto» leggi Tempo risparmiato (ps) = 260, CPI prima / dopo = 1,667 / 1,333, Accelerazione = 1,25.",
        "ragionamento": "Quattro gruppi producono 12 istruzioni. La versione originale usa 12+4+4=20 cicli e quella riordinata 12+4=16: 1300−1040=260 ps risparmiati e accelerazione 1300/1040=1,25.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Tempo risparmiato (ps)",
            "valore": "260"
          },
          {
            "passo": 2,
            "campo": "CPI prima / dopo",
            "valore": "1,667 / 1,333"
          },
          {
            "passo": 2,
            "campo": "Accelerazione",
            "valore": "1,25"
          }
        ]
      },
      {
        "titolo": "Otto gruppi consecutivi",
        "parametri": {
          "g": 8,
          "t": 65
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Ripetizioni L,U,I = 8; Periodo di clock (ps) = 65.",
          "Parti da «Versione L, U, I» e annota Istruzioni = 24, Cicli = 36, Tempo (ps) = 2340.",
          "Confronta 36 cicli con 28. Calcola tempi, differenza e rapporto usando lo stesso periodo, poi confronta l’accelerazione con il caso di quattro gruppi.",
          "Raggiungi «Confronto» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Confronto» leggi Tempo risparmiato (ps) = 520, CPI prima / dopo = 1,5 / 1,167, Accelerazione = 1,286.",
        "ragionamento": "Otto gruppi producono 24 istruzioni. Le durate sono (24+4+8)×65=2340 ps e (24+4)×65=1820 ps: il risparmio è 520 ps e il rapporto è circa 1,286.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Tempo risparmiato (ps)",
            "valore": "520"
          },
          {
            "passo": 2,
            "campo": "CPI prima / dopo",
            "valore": "1,5 / 1,167"
          },
          {
            "passo": 2,
            "campo": "Accelerazione",
            "valore": "1,286"
          }
        ]
      }
    ]
  },
  "3.6.8": {
    "scopo": "Ricostruirai un solo fronte della pipeline a partire da una fotografia nota. Il problema rende visibile l’uso dei vecchi valori in trasferimenti che avvengono tutti nello stesso istante.",
    "teoria": [
      "La pipeline è un insieme di stadi nei quali istruzioni diverse possono lavorare contemporaneamente. Un piccolo registro separa ogni stadio dal successivo. Per tutta la durata del ciclo il registro offre a valle i dati che ha conservato, mentre il circuito a monte prepara al suo ingresso i dati da acquisire al prossimo fronte, l’istante di aggiornamento indicato dal clock.",
      "Per capire una fotografia della pipeline è utile distinguere i nomi dei posti da quelli degli occupanti. D designa la decodifica, E l’esecuzione e M lo stadio di memoria. Un’etichetta come I4 segue invece una specifica istruzione durante il viaggio. Una bolla indica che in quel posto manca un’istruzione capace di produrre effetti.",
      "Nella configurazione proposta D contiene I2 ed E contiene I1. Durante il ciclo il vecchio E prepara l’ingresso di M con I1, mentre il vecchio D prepara l’ingresso di E con I2. Al fronte M acquisisce I1 ed E acquisisce I2. Per ricostruire l’aggiornamento basta quindi associare ciascuna destinazione al collegamento che la alimentava immediatamente prima del fronte."
    ],
    "introduzione": [
      "Il problema permette di ricostruire un aggiornamento simultaneo senza perdere l’identità delle istruzioni. D, E e M sono posti della pipeline; I1 e I2 sono gli occupanti che viaggiano fra quei posti. Prima del fronte ogni registro riceve il contenuto preparato dal precedente. Il confronto fra ingressi e nuove uscite chiarisce perché due trasferimenti affiancati producano un solo avanzamento per istruzione.",
      "Scrivi quale istruzione prevedi nel nuovo M e premi «Passo successivo». Confronta D=I2 ed E=I1 con gli ingressi D→E ed E→M, poi verifica nuovo E=I2 e nuovo M=I1. Usa «Precedente» per ritrovare la provenienza di ciascun valore: M acquisisce l’I1 presente in E prima del fronte. Con «Ricomincia il percorso» ricostruisci entrambi i trasferimenti a partire dalla stessa fotografia iniziale."
    ],
    "lettura": "Le etichette D, E e M identificano registri di passaggio, mentre I1 e I2 identificano le istruzioni. Le frecce D→E ed E→M mostrano gli ingressi preparati prima del fronte; il riquadro finale mostra il contenuto acquisito.",
    "conclusione": "Il nuovo M proviene dal vecchio E e il nuovo E dal vecchio D. La simultaneità permette due trasferimenti affiancati senza far attraversare due registri alla stessa istruzione nello stesso fronte.",
    "procedura": [
      "Leggi i «Dati iniziali»: Subito prima del fronte, D contiene I2, E contiene I1 e in M c’è una bolla. Tutti i registri di pipeline acquisiscono il proprio ingresso.",
      "Scrivi una previsione per «Quale istruzione acquisisce il registro M al fronte successivo?». Conservala mentre inizi la ricostruzione con «Passo successivo».",
      "In «Prima del fronte» annota D=I2 ed E=I1. In «Ingressi preparati» associa ciascuna vecchia uscita alla sua destinazione, poi verifica «Dopo il fronte».",
      "Raggiungi «Dopo il fronte» e confronta la previsione con i valori finali. Usa «Ricomincia il percorso» per ripetere i passaggi con il ragionamento ormai completo."
    ],
    "risultato": "La risposta alla previsione è I1. Al fronte E acquisisce I2 da D e M acquisisce I1 da E. Entrambi leggono i valori presenti subito prima del fronte.",
    "ragionamento": "Prima del fronte E contiene I1, quindi l’ingresso di M è I1. D contiene I2, quindi l’ingresso di E è I2; al fronte si ottengono simultaneamente nuovo M=I1 e nuovo E=I2."
  },
  "3.6.9": {
    "scopo": "Calcolerai una tabella di controllo quando coesistono dipendenza load/use e ritorno ret. Il problema serve a conservare l’istruzione che attende un dato e a riconoscere la priorità fra stallo e bolla nello stesso registro.",
    "teoria": [
      "La pipeline ripartisce l’esecuzione in prelievo F, lettura degli operandi D, calcolo E, memoria M e scrittura W. I registri di passaggio, piccole memorie tra gli stadi, conservano i dati delle istruzioni in lavorazione. Una dipendenza load/use nasce quando l’istruzione in D richiede il valore che un carico, ancora in E, leggerà dalla memoria durante M. Occorre trattenere il consumatore e lasciare avanzare il produttore, affinché il dato possa diventare disponibile.",
      "Due segnali governano questa attesa. Lo stallo conserva il contenuto del registro interessato. La bolla introduce invece un’operazione neutra che attraverserà lo stadio. Le lettere D ed E indicano rispettivamente la posizione di decodifica e quella di esecuzione.",
      "Ret ritorna da una procedura e recupera dalla pila l’indirizzo da cui riprendere il prelievo. La pila è una zona di memoria il cui puntatore indica l’ultimo dato depositato. Il segnale ret_in_DEM vale 1 se un ritorno è presente in almeno uno degli stadi D, E o M, mentre load_use vale 1 quando è rilevata la dipendenza immediata dal carico. Se ret in D attende proprio il nuovo puntatore alla pila, entrambe le richieste sono attive. Le formule qui adottate assumono la previsione corretta dei salti.",
      "Per bit 0 o 1, OR vale 1 quando almeno un ingresso vale 1, AND richiede entrambi a 1 e il complemento 1−load_use scambia i due valori. F_stall=load_use OR ret_in_DEM ferma il prelievo per ciascuna causa. D_stall=load_use conserva il consumatore e D_bubble=(1−load_use) AND ret_in_DEM consente la bolla soltanto quando D può essere sostituito. E_bubble=load_use lascia un intervallo libero fra il produttore che prosegue e il consumatore in attesa. Nel listato MOV copia i bit, XOR con 1 calcola il complemento e AND/OR realizzano le formule; EAX, ECX, EDX e R8D raccolgono i quattro segnali nello stesso ordine."
    ],
    "introduzione": [
      "L’esercitazione permette di tradurre due cause simultanee di attesa in comandi coerenti per la pipeline. Load_use segnala un consumatore che attende il dato di un carico; ret_in_DEM segnala un ritorno in elaborazione. Lo stallo mantiene l’istruzione nel registro, mentre la bolla la sostituisce con una posizione neutra. Il controllo deve quindi dare precedenza alla conservazione del consumatore in D.",
      "Premi «Carica l’esempio guidato», valuta 1 OR 1 e compila «F_stall». Dopo «Registra la previsione», avanza con «Passo successivo» e confronta D_stall=1 con D_bubble=0. Segui il complemento di load_use nella formula della bolla: azzera la richiesta che altrimenti eliminerebbe il consumatore. Infine collega E_bubble=1 all’intervallo libero necessario mentre il carico prosegue e prepara il dato atteso."
    ],
    "lettura": "I segnali sono raggruppati per destinazione: F_stall arresta il prelievo, D_stall mantiene la decodifica, D_bubble la sostituisce con una posizione neutra ed E_bubble libera il tratto a valle. Leggi insieme i due segnali di D.",
    "conclusione": "La dipendenza load/use impone di conservare D. Per questa ragione la bolla richiesta dal ritorno viene subordinata all’assenza di load/use: le due azioni incompatibili sullo stesso registro ricevono una priorità esplicita.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 2, «Applicare il controllo di D ed E», traccia 1. La spiegazione numerica seguente riguarda questa combinazione.",
      "Con load_use=1 e ret_in_DEM=1, valuta F_stall con OR. Poi ricava D_stall e calcola D_bubble usando il complemento di load_use prima dell’AND con ret.",
      "Compila la previsione per «F_stall» e premi «Registra la previsione». Poi avanza con «Passo successivo» per verificare il procedimento, anche se la risposta iniziale richiede una correzione.",
      "Confronta i campi del risultato con lo svolgimento. Per rispondere a tutti i quesiti, apri «Apri la prova completa»; con i selettori Esercizio e Traccia puoi poi scegliere altri dati."
    ],
    "risultato": "Per l’esercizio 2, traccia 1, i risultati sono: F_stall = 1; D_stall = 1; D_bubble = 0; E_bubble = 1.",
    "ragionamento": "F_stall=1 OR 1=1 e D_stall=load_use=1. D_bubble=(1−1) AND 1=0 conserva il consumatore; E_bubble=load_use=1 inserisce la posizione libera necessaria al dato in arrivo."
  },
  "3.6.10": {
    "scopo": "Daterai l’ingresso in decodifica e la scrittura finale di un consumatore subito dopo un carico. La ricostruzione collega l’arrivo del dato dalla memoria al ciclo aggiunto nella permanenza in D.",
    "teoria": [
      "Quando un’istruzione usa un valore che un’altra sta per leggere dalla memoria, il momento in cui quel dato arriva limita la velocità della coppia. Il forwarding, o inoltro, porta il risultato direttamente da uno stadio all’altro appena diventa disponibile. Nel frattempo il processore può svolgere lavoro indipendente.",
      "F preleva il comando; D prepara gli operandi, cioè i valori su cui operare; E esegue il calcolo; M accede eventualmente alla memoria; W scrive il risultato in un registro, una piccola memoria interna. Le lettere indicano posizioni e le etichette L e U identificano le istruzioni che le attraversano. Se U resta due cicli in D, la sua riga temporale contiene due caselle D. Il simbolo D* segnala la prima permanenza, dalla quale è richiesta l’attesa.",
      "Nella traccia proposta il carico L entra in F al ciclo 1 e raggiunge M al ciclo 4, quando può leggere la parola richiesta. U è immediatamente successiva e arriva in D al ciclo 3. Attende lì anche nel ciclo 4, poi usa il dato inoltrato in E al ciclo 5. Attraversando M al 6 e W al 7, rende riconoscibile il ciclo aggiunto dalla dipendenza.",
      "Nel frammento EDI contiene il numero k di copie indipendenti interposte. LEA calcola 3+k e lo conserva in ECX come primo ciclo D di U. TEST verifica se k è zero e SETZ mette allora 1 nel byte DL, dopo che XOR ha azzerato EDX. L’ultima LEA calcola il ciclo W aggiungendo al primo D i tre passaggi verso E, M e W e l’eventuale attesa in EDX. Questa data riguarda la scrittura di U: per trovare la fine del programma bisogna seguire anche le istruzioni che la precedono o la seguono nel nuovo ordine."
    ],
    "introduzione": [
      "La ricostruzione permette di datare la scrittura di un consumatore seguendo il momento in cui il carico rende disponibile il dato. L attraversa la memoria in M; U prepara gli operandi in D e li usa in E. Il forwarding inoltra il valore appena letto, mentre l’uso immediato richiede una permanenza aggiuntiva in D, visibile nel percorso verso W.",
      "Ripristina l’esempio guidato e avanza con «Passo successivo», collocando il primo D di U al ciclo 3. Confrontalo con M del carico al ciclo 4, durante il quale U rimane ancora in D. Segui poi U in E, M e W ai cicli 5, 6 e 7: la scrittura finale include tre avanzamenti dopo D più il ciclo d’attesa causato dalla dipendenza."
    ],
    "lettura": "L percorre F,D,E,M,W; U ne segue il registro di destinazione. Cerca U in D in due cicli consecutivi e segui poi E, M e W. Il numero della prima apparizione in D e quello della scrittura rispondono a due quesiti distinti.",
    "conclusione": "Il forwarding dal carico diventa disponibile durante M, quindi l’uso immediato richiede un ciclo d’attesa. La permanenza aggiuntiva in D sposta di un ciclo la scrittura finale del consumatore.",
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 4, «Datare la scrittura del consumatore», traccia 1. La spiegazione numerica seguente riguarda questa combinazione.",
      "Con zero copie interposte, colloca L in F al ciclo 1 e U in F al ciclo 2. Segui U in D e verifica quando il dato di L, letto in M, può raggiungere la sua esecuzione.",
      "Avvia la ricostruzione con «Passo successivo» e controlla ogni trasformazione prima di passare alla successiva.",
      "Confronta i campi del risultato con lo svolgimento. Per rispondere a tutti i quesiti, apri «Apri la prova completa»; con i selettori Esercizio e Traccia puoi poi scegliere altri dati."
    ],
    "risultato": "Per l’esercizio 4, traccia 1, i risultati sono: Primo ciclo D di U = 3; Ciclo W di U = 7.",
    "ragionamento": "L legge la memoria nel ciclo 4. U arriva in D nel ciclo 3 e vi resta anche al 4, quindi esegue E al 5, M al 6 e W al 7; i risultati richiesti sono primo D=3 e W=7."
  },
  "modulo-3": {
    "scopo": "Un’istruzione produce una somma e la successiva deve incrementarla. Seguirai la propagazione del riporto e poi il viaggio del risultato tra gli stadi, confrontando il percorso con inoltro e quello che attende la scrittura nel banco.",
    "teoria": [
      "Un processore deve sommare due numeri e usare subito il risultato per aggiungervi uno. Il programma comprende due istruzioni: P produce la somma da conservare nel registro R, una piccola memoria interna, e U consuma quella somma. Ciascun numero è una parola di quattro bit, cifre binarie 0 e 1 le cui posizioni, da destra, pesano 1, 2, 4 e 8. Sia la somma di P sia l’incremento di U conservano il resto della divisione per 16, così che i risultati entrino nei quattro bit. Per esempio incrementare 1111, cioè 15, produce 0000.",
      "Le istruzioni attraversano cinque stadi, nei quali possono trovarsi contemporaneamente. F preleva l’istruzione, D riconosce l’operazione e raccoglie gli operandi, E esegue il calcolo, M consente un eventuale accesso alla memoria e W scrive il risultato. Nel ciclo 3 P si trova in E. Le quattro colonne della figura scompongono il lavoro del suo sommatore durante quello stesso ciclo. Per 7 + 1, il riporto corre dalle unità fino alla posizione di peso otto e la parola diventa 1000.",
      "U attende quella parola in D. Con l’inoltro, un filo conduce il valore appena prodotto da E alla lettura di D, cosicché U può iniziare il proprio calcolo nel ciclo 4. Usando il solo banco dei registri, U deve invece attendere il ciclo 5, quando P scrive R nella prima metà del ciclo e D può leggerlo nella seconda. Seguendo U fino a W si distingue il valore finale dal momento in cui viene conservato.",
      "Il sommatore appartiene all’ALU, l’unità aritmetico-logica. Ogni colonna somma i due bit e il riporto ricevuto: un totale 0 o 1 produce quella cifra senza riporto, un totale 2 produce 0 e un riporto 1, un totale 3 produce 1 e un riporto 1. Le colonne sono numerate da 0, sul peso 1, a 3, sul peso 8; Si è il bit scritto nella colonna i e C(i+1) il riporto verso la successiva. Il riporto C4 pesa 16 e resta esterno alla parola conservata. Le quattro tappe aritmetiche appartengono tutte al ciclo E di P: il numero di ciclo consente di collegare il calcolo delle colonne all’avanzamento nella pipeline."
    ],
    "introduzione": [
      "La simulazione d’insieme permette di collegare il calcolo della somma al momento in cui un’altra istruzione può usarla. P produce una parola di quattro bit e U la incrementa. I riporti spiegano la formazione del risultato nell’unità aritmetico-logica, l’ALU; il forwarding, o inoltro, lo porta al consumatore prima della scrittura nel registro. Il confronto rende visibile la distinzione fra valore disponibile internamente e valore conservato.",
      "Carica «Inoltrare la somma appena prodotta» e avanza con «Passo successivo». Le quattro colonne aritmetiche appartengono tutte al ciclo 3: segui 7+1 fino a 1000, poi l’incremento fino a 1001 scritto al ciclo 6. Fissa il risultato per confronto e carica «Attendere il banco dei registri». La stessa parola finale arriva al ciclo 8; spiega i due cicli aggiuntivi attraverso l’attesa della scrittura di P."
    ],
    "lettura": "La parte aritmetica scompone i quattro bit della somma durante lo stesso ciclo E del produttore P. La pipeline segue invece P e il consumatore U nel tempo. Tieni distinti il valore R già nel banco, il risultato disponibile internamente e il ciclo indicato nelle caselle.",
    "conclusione": "Il forwarding rende utilizzabile un risultato prima della sua scrittura nel banco, purché la rete lo porti al punto di consumo in tempo. I due percorsi conservano il risultato del programma; cambia il ciclo in cui il consumatore riesce a completare.",
    "controlli": {
      "a": "Primo addendo senza segno su quattro bit, quindi compreso fra 0 e 15.",
      "b": "Secondo addendo senza segno; la somma di P viene conservata modulo 16.",
      "bypass": "Percorso che alimenta U: il forwarding usa il risultato di E, il solo banco attende la scrittura di P in W."
    },
    "esperienze": [
      {
        "titolo": "Inoltrare la somma appena prodotta",
        "parametri": {
          "a": 7,
          "b": 1,
          "bypass": "si"
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Parola A · intero senza segno = 7; Parola B · intero senza segno = 1; Percorso degli operandi = Forwarding E → D.",
          "Parti da «Prelievo del produttore» e annota Ciclo = 1, A = 0111, B = 0001, R iniziale = 0000.",
          "Avanza attraverso «ALU · colonna 0» fino a «ALU · colonna 3»: sono dettagli del ciclo 3. In «Inoltro del risultato» confronta la somma 1000 già disponibile con R nel banco ancora 0000.",
          "Raggiungi «Completamento di U» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Completamento di U» leggi Ciclo = 6, Somma di P = 1000, Parola finale di U = 1001, Ciclo di scrittura di U = 6.",
        "ragionamento": "P calcola 7+1=8, cioè 1000. L’inoltro porta questa parola a D alla fine del ciclo 3: U entra in E al 4, aggiunge uno e scrive 1001=9 nel ciclo 6.",
        "attesi": [
          {
            "passo": 8,
            "campo": "Ciclo",
            "valore": "6"
          },
          {
            "passo": 8,
            "campo": "Somma di P",
            "valore": "1000"
          },
          {
            "passo": 8,
            "campo": "Parola finale di U",
            "valore": "1001"
          },
          {
            "passo": 8,
            "campo": "Ciclo di scrittura di U",
            "valore": "6"
          }
        ]
      },
      {
        "titolo": "Attendere il banco dei registri",
        "parametri": {
          "a": 7,
          "b": 1,
          "bypass": "no"
        },
        "passi": [
          "Premi «Carica questo caso». Verifica i dati applicati: Parola A · intero senza segno = 7; Parola B · intero senza segno = 1; Percorso degli operandi = Solo banco dei registri.",
          "Parti da «Prelievo del produttore» e annota Ciclo = 1, A = 0111, B = 0001, R iniziale = 0000.",
          "Dopo le quattro colonne fermati a «Prima attesa di U». In «Scrittura di P nel banco» osserva U ancora in D, poi segui l’incremento e il transito in M fino alla scrittura finale.",
          "Raggiungi «Completamento di U» con «Passo successivo» e confronta i valori con il risultato spiegato qui sotto. Usa «Precedente» per ripercorrere il passaggio da cui dipende la tua previsione."
        ],
        "risultato": "Nel passo «Completamento di U» leggi Ciclo = 8, Somma di P = 1000, Parola finale di U = 1001, Ciclo di scrittura di U = 8.",
        "ragionamento": "P produce ancora la somma 1000. Perché U possa leggerla dal banco, P deve prima scriverla nel primo semiciclo di W al ciclo 5. U la legge nel secondo semiciclo, esegue al 6 e completa al ciclo 8, due cicli dopo il caso con inoltro.",
        "attesi": [
          {
            "passo": 10,
            "campo": "Ciclo",
            "valore": "8"
          },
          {
            "passo": 10,
            "campo": "Somma di P",
            "valore": "1000"
          },
          {
            "passo": 10,
            "campo": "Parola finale di U",
            "valore": "1001"
          },
          {
            "passo": 10,
            "campo": "Ciclo di scrittura di U",
            "valore": "8"
          }
        ]
      }
    ]
  }
};
  Object.assign(SL.guide, percorsi);
  for (const [id, guida] of Object.entries(percorsi)) SL.lezioni[id] = guida.teoria;
})();
