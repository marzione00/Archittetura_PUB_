'use strict';

// Guida completa di ogni unità: scopo, teoria, casi, lettura e risultati.
(() => {
  const percorsi = {
  "4.1.1": {
    "scopo": "Un programma viene sospeso mentre il processore sta eseguendo un’istruzione. Studierai come la causa dell’ingresso nel gestore determina l’indirizzo dal quale il programma riprende, confrontando un timer con un caricamento interrotto da una pagina assente.",
    "lettura": "I due riquadri superiori rappresentano l’istruzione corrente e quella seguente; il gestore occupa il riquadro inferiore. Segui la freccia di ritorno e confronta la sua destinazione con «RIP alla ripresa», perché il ramo individua l’istruzione che sarà eseguita per prima.",
    "conclusione": "L’indirizzo salvato conserva il punto coerente con il lavoro già completato. Un interrupt accettato dopo l’istruzione permette di proseguire; un fault risolvibile permette di ritentare l’istruzione rimasta incompleta.",
    "controlli": {
      "pc": "Indirizzo del primo byte dell’istruzione corrente, espresso in decimale nel controllo e in esadecimale nella traccia. Le istruzioni ordinarie di questo modello occupano quattro byte.",
      "evento": "Scegli l’evento che trasferisce il controllo al gestore: il timer arriva dall’esterno, mentre la pagina assente impedisce di completare il caricamento."
    },
    "teoria": [
      "Quando il processore esegue un programma, deve sapere a quale indirizzo di memoria comincia l’istruzione da eseguire. Nella macchina x86 a 64 bit questo indirizzo si conserva in un registro, una piccola memoria interna al processore, chiamato RIP. Ogni indirizzo individua un byte. Il prefisso 0x indica un numero scritto in base sedici, nella quale alle cifre da 0 a 9 seguono le lettere da A a F.",
      "Supponiamo che un’istruzione occupi quattro byte a partire da 0x1010. Se il timer segnala che è scaduto un intervallo, il processore completa l’istruzione, conserva l’indirizzo 0x1014 e passa a una routine del sistema operativo, detta gestore. Quando la routine termina, il programma può proseguire dal byte che segue i quattro già utilizzati.",
      "Se invece l’istruzione cerca un dato in una pagina assente, cioè in una regione che il sistema deve ancora rendere disponibile in memoria, la lettura resta incompiuta. Dopo aver sistemato la pagina, il gestore fa ripartire il processore da 0x1010. Nella figura il ramo di ritorno raggiunge così, secondo la causa, l’istruzione seguente oppure quella da ripetere."
    ],
    "introduzione": [
      "Questa simulazione serve a capire perché un programma interrotto possa riprendere da indirizzi diversi secondo la causa dell’interruzione. RIP è il registro che indica l’istruzione da eseguire; il gestore è la routine incaricata di trattare l’evento. Confronterai un timer, accettato dopo il completamento dell’istruzione, con un fault di pagina, che richiede di ritentare un caricamento ancora incompleto.",
      "Carica il caso del timer con «Carica questo caso» e avanza con «Passo successivo», seguendo la freccia che dal gestore torna al programma. Fissa il risultato con «Fissa per confronto», quindi carica il caso della pagina assente. Con RIP iniziale uguale a 0x1010, confronta 0x1014 e 0x1010 e collega ciascun indirizzo al lavoro già completato."
    ],
    "esperienze": [
      {
        "titolo": "Timer dopo un’istruzione completata",
        "parametri": {
          "pc": 4112,
          "evento": "irq"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: RIP iniziale (byte) = 4112; Causa = interrupt del timer.",
          "Leggi il passo «Istruzione in corso». Annota RIP = 0x1010; Istruzione seguente = 0x1014. Prima di avanzare, prevedi il valore finale del campo «RIP alla ripresa» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «interrupt del timer». Annota Classe = interrupt esterno; Punto di ripresa = 0x1014.",
          "Premi «Passo successivo» e fermati su «Uscita dal gestore». Annota RIP alla ripresa = 0x1014."
        ],
        "risultato": "Nel passo «Uscita dal gestore» il risultato è: RIP alla ripresa = 0x1014.",
        "ragionamento": "L’istruzione occupa i quattro byte da 0x1010 a 0x1013, perciò il confine seguente è 0x1014. Il timer viene accettato a quel confine e il ritorno conserva gli effetti dell’istruzione già terminata.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Classe",
            "valore": "interrupt esterno"
          },
          {
            "passo": 1,
            "campo": "Punto di ripresa",
            "valore": "0x1014"
          },
          {
            "passo": 2,
            "campo": "RIP alla ripresa",
            "valore": "0x1014"
          }
        ]
      },
      {
        "titolo": "Pagina assente durante il caricamento",
        "parametri": {
          "pc": 4112,
          "evento": "pf"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: RIP iniziale (byte) = 4112; Causa = pagina assente.",
          "Leggi il passo «Istruzione in corso». Annota RIP = 0x1010; Istruzione seguente = 0x1014. Prima di avanzare, prevedi il valore finale del campo «RIP alla ripresa» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «pagina assente». Annota Classe = fault; Punto di ripresa = 0x1010.",
          "Premi «Passo successivo» e fermati su «Uscita dal gestore». Annota RIP alla ripresa = 0x1010."
        ],
        "risultato": "Nel passo «Uscita dal gestore» il risultato è: RIP alla ripresa = 0x1010.",
        "ragionamento": "Il caricamento a 0x1010 richiede una traduzione che deve ancora essere resa disponibile. Dopo l’intervento del kernel la CPU riprende da 0x1010, così da eseguire il caricamento con la traduzione riparata.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Classe",
            "valore": "fault"
          },
          {
            "passo": 1,
            "campo": "Punto di ripresa",
            "valore": "0x1010"
          },
          {
            "passo": 2,
            "campo": "RIP alla ripresa",
            "valore": "0x1010"
          }
        ]
      }
    ]
  },
  "4.1.2": {
    "scopo": "Gli eventi che consegnano il controllo al sistema hanno relazioni diverse con l’istruzione in corso. Confronterai una trap deliberata con un guasto grave, per riconoscere quando lo stato registrato consente una ripresa precisa.",
    "lettura": "Osserva il collegamento fra istruzione, gestore e successore. La trap torna al riquadro dell’istruzione seguente; nel caso dell’abort la croce indica che il modello arresta il percorso di ripresa. Leggi insieme «Classe» e «Punto di ripresa».",
    "conclusione": "Fault, trap e interrupt definiscono diversi confini rispetto al progresso del programma. La categoria abort segnala che la disponibilità di un indirizzo numerico successivo, da sola, è insufficiente a garantire il recupero dello stato.",
    "controlli": {
      "evento": "Seleziona la causa: INT3 genera una trap dopo il proprio byte; la pagina assente genera un fault; il timer genera un interrupt; il guasto grave è modellato come abort.",
      "pc": "Indirizzo iniziale dell’istruzione, in byte. La lunghezza dipende dall’istruzione scelta: INT3 occupa un byte e le istruzioni ordinarie rappresentate ne occupano quattro."
    },
    "teoria": [
      "Il processore conserva l’indirizzo dell’istruzione nel registro RIP, una piccola memoria interna; la scrittura 0x indica un numero in base sedici, in cui A, B, C, D, E e F valgono da dieci a quindici. Durante l’esecuzione, il processore può affidare il controllo a una routine del sistema, chiamata gestore. Per stabilire dove riprendere conta la relazione fra l’evento e l’istruzione in corso. Un segnale proveniente dal timer, detto interrupt esterno, può arrivare mentre il programma svolge qualunque calcolo. Il processore lo accetta a un confine fra istruzioni, dal quale sarà possibile proseguire.",
      "Un fault nasce invece durante un’istruzione. Se un caricamento trova assente la pagina di memoria che contiene il dato, il sistema può intervenire e ritentare il caricamento dal principio. Una trap viene segnalata dopo l’istruzione che l’ha provocata. È il caso di INT3, un comando lungo un byte che un programma di diagnosi, il debugger, usa per osservare il programma a un indirizzo scelto.",
      "Un INT3 posto a 0x1010 lascia come indirizzo salvato 0x1011. Un abort, associato a un guasto grave, può compromettere lo stato necessario alla ripresa. Per questo, nella figura, i percorsi del fault e della trap hanno un indirizzo di ritorno preciso, mentre il percorso del guasto si arresta."
    ],
    "introduzione": [
      "Distinguere fault, trap, interrupt e abort è lo scopo di questo esperimento, nel quale la classificazione diventa visibile attraverso il punto di ripresa. Una trap viene segnalata dopo l’istruzione che la provoca, mentre un fault permette di ritentarla. Il confronto con un guasto grave mostra perché conoscere l’indirizzo successivo possa risultare insufficiente a ricostruire uno stato affidabile.",
      "Inizia dal caso INT3, caricandolo con «Carica questo caso»: questo breakpoint, usato per fermare un programma durante l’analisi, occupa un byte. Avanza fino a «RIP alla ripresa» e confronta il risultato con il caso del guasto grave. Cambiando «Causa» e premendo «Applica i parametri», esplora anche timer e pagina assente, associando sempre la classe dell’evento alla destinazione del ritorno."
    ],
    "esperienze": [
      {
        "titolo": "INT3 e indirizzo seguente",
        "parametri": {
          "evento": "bp",
          "pc": 4112
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Causa = breakpoint INT3; RIP iniziale (byte) = 4112.",
          "Leggi il passo «Istruzione in corso». Annota RIP = 0x1010; Istruzione seguente = 0x1011. Prima di avanzare, prevedi il valore finale del campo «RIP alla ripresa» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «breakpoint INT3». Annota Classe = trap; Punto di ripresa = 0x1011.",
          "Premi «Passo successivo» e fermati su «Uscita dal gestore». Annota RIP alla ripresa = 0x1011."
        ],
        "risultato": "Nel passo «Uscita dal gestore» il risultato è: RIP alla ripresa = 0x1011.",
        "ragionamento": "INT3 è lungo un byte: 0x1010 + 1 = 0x1011. La trap è segnalata dopo quel byte e il punto di ripresa è il suo successore; la gestione concreta di un debugger può poi scegliere ulteriori interventi.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Classe",
            "valore": "trap"
          },
          {
            "passo": 1,
            "campo": "Punto di ripresa",
            "valore": "0x1011"
          },
          {
            "passo": 2,
            "campo": "RIP alla ripresa",
            "valore": "0x1011"
          }
        ]
      },
      {
        "titolo": "Guasto grave e recupero incerto",
        "parametri": {
          "evento": "abort",
          "pc": 4112
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Causa = guasto grave; RIP iniziale (byte) = 4112.",
          "Leggi il passo «Istruzione in corso». Annota RIP = 0x1010; Istruzione seguente = 0x1014. Prima di avanzare, prevedi il valore finale del campo «RIP alla ripresa» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «guasto grave». Annota Classe = abort; Punto di ripresa = ripresa non garantita.",
          "Premi «Passo successivo» e fermati su «Uscita dal gestore». Annota RIP alla ripresa = ripresa non garantita."
        ],
        "risultato": "Nel passo «Uscita dal gestore» il risultato è: RIP alla ripresa = ripresa non garantita.",
        "ragionamento": "Il guasto grave può compromettere lo stato necessario per continuare il programma. Il modello mostra quindi «ripresa non garantita», distinguendo questa informazione dall’indirizzo 0x1014 che sarebbe il normale successore dell’istruzione.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Classe",
            "valore": "abort"
          },
          {
            "passo": 1,
            "campo": "Punto di ripresa",
            "valore": "ripresa non garantita"
          },
          {
            "passo": 2,
            "campo": "RIP alla ripresa",
            "valore": "ripresa non garantita"
          }
        ]
      }
    ]
  },
  "4.1.3": {
    "scopo": "Lo stesso vettore può essere richiesto da un programma o consegnato da un dispositivo. Calcolerai prima l’indirizzo della porta nella IDT, poi verificherai se l’origine della richiesta permette di attraversare quella porta.",
    "lettura": "Il riquadro a sinistra indica il richiedente; le righe centrali sono descrittori della IDT. La riga evidenziata contiene l’indirizzo al quale si legge la porta. Il riquadro finale mostra il gestore raggiunto oppure l’eccezione #GP, che segnala il rifiuto dell’ingresso software.",
    "conclusione": "L’indicizzazione individua la porta, mentre il controllo dei privilegi stabilisce se un’invocazione software può usarla. Per una richiesta hardware già ammessa dal controller, il DPL della porta mantiene un ruolo diverso da quello svolto nell’istruzione INT.",
    "controlli": {
      "v": "Numero della voce della tabella IDT. Ogni voce occupa 16 byte; nel controller simulato i vettori da 0 a 31 sono riservati alle eccezioni.",
      "via": "Origine della richiesta. INT n parte da un programma di livello CPL 3; la richiesta hardware arriva dal controller del dispositivo.",
      "dpl": "Livello richiesto dalla porta per l’invocazione software. DPL 0 riserva INT al codice privilegiato; DPL 3 consente l’invocazione dal livello utente rappresentato."
    },
    "teoria": [
      "Una periferica che richiede attenzione segnala un evento, mentre il processore deve raggiungere il programma adatto a servirlo. Un numero chiamato vettore permette di scegliere una voce nella tabella delle interruzioni, indicata con IDT. Ogni voce, detta porta, contiene fra le altre informazioni l’indirizzo del gestore. L’indirizzo della porta serve quindi a leggere quello del codice da eseguire. I livelli di privilegio seguono una numerazione inversa: il livello 0 concede i poteri del kernel, la parte del sistema operativo che governa le risorse, mentre il livello 3 è quello delle applicazioni. CPL indica il livello corrente del chiamante; DPL indica il limite imposto dalla porta alle invocazioni software.",
      "Nel modello la tabella comincia a 0x4000, dove il prefisso 0x indica la base sedici. Una porta occupa 16 byte. Il vettore 48 corrisponde perciò alla voce che inizia 48 × 16 = 768 byte più avanti, a 0x4300. Nella figura la freccia attraversa la riga indicizzata prima di raggiungere la destinazione conservata nella porta.",
      "Un programma può chiedere l’ingresso con l’istruzione INT n, dove n è il vettore. Il controllo software richiede CPL ≤ DPL: un chiamante di livello 3 trova falso il confronto 3 ≤ 0 verso una porta con DPL 0 e riceve #GP, l’eccezione di protezione generale. Per la richiesta hardware conta invece l’assegnazione del vettore al dispositivo; il controller simulato riserva i numeri inferiori a 32 alle eccezioni e ammette il vettore 48. Gli altri controlli sulla validità della porta sono assunti soddisfatti nel caso ammesso."
    ],
    "introduzione": [
      "L’attività permette di separare due decisioni dell’ingresso protetto: trovare una porta nella IDT e stabilire se il richiedente possa attraversarla. La IDT è la tabella dei gestori, indicizzata dal numero di vettore; ogni porta occupa sedici byte. CPL identifica il privilegio del chiamante e DPL quello richiesto dalla porta per l’invocazione software, che deve soddisfare CPL ≤ DPL.",
      "Carica il caso «INT utente verso una porta riservata» e segui l’indicizzazione fino al descrittore a 0x4300. Con «Passo successivo» osserva poi l’esito del controllo. Confrontalo con la richiesta hardware sullo stesso vettore, mantenendo DPL uguale a zero: la diversa origine spiega il diverso esito, mentre indirizzo del descrittore e destinazione contenuta nella porta restano distinti."
    ],
    "esperienze": [
      {
        "titolo": "INT utente verso una porta riservata",
        "parametri": {
          "v": 48,
          "via": "int",
          "dpl": "0"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Vettore = 48; Origine = INT n da CPL 3; DPL della porta = 0.",
          "Leggi il passo «Indicizzazione». Annota Vettore = 48; Offset = 768. Prima di avanzare, formula la previsione richiesta nel campo «Esito del controllo di ingresso» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Lettura della porta». Annota Indirizzo del descrittore = 0x4300; Destinazione nella porta = 0x8600.",
          "Premi «Passo successivo» e fermati su «Controllo di ingresso». Annota Esito = eccezione #GP; DPL = 0."
        ],
        "risultato": "Nel passo «Controllo di ingresso» il risultato è: Esito = eccezione #GP; DPL = 0.",
        "ragionamento": "La porta del vettore 48 si trova a 48 × 16 = 768 byte, ossia 0x300, dalla base della IDT: il suo indirizzo è quindi 0x4300. L’invocazione INT proviene da CPL 3 e la porta ha DPL 0, quindi viene generata #GP prima dell’ingresso al gestore.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Indirizzo del descrittore",
            "valore": "0x4300"
          },
          {
            "passo": 1,
            "campo": "Destinazione nella porta",
            "valore": "0x8600"
          },
          {
            "passo": 2,
            "campo": "Esito",
            "valore": "eccezione #GP"
          },
          {
            "passo": 2,
            "campo": "DPL",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Richiesta hardware sullo stesso vettore",
        "parametri": {
          "v": 48,
          "via": "hw",
          "dpl": "0"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Vettore = 48; Origine = Richiesta del dispositivo; DPL della porta = 0.",
          "Leggi il passo «Indicizzazione». Annota Vettore = 48; Offset = 768. Prima di avanzare, formula la previsione richiesta nel campo «Esito del controllo di ingresso» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Lettura della porta». Annota Indirizzo del descrittore = 0x4300; Destinazione nella porta = 0x8600.",
          "Premi «Passo successivo» e fermati su «Controllo di ingresso». Annota Esito = ingresso al gestore; DPL = 0."
        ],
        "risultato": "Nel passo «Controllo di ingresso» il risultato è: Esito = ingresso al gestore; DPL = 0.",
        "ragionamento": "La porta resta a 0x4300 e conserva la destinazione 0x8600. La richiesta hardware sul vettore 48 supera il controllo di assegnazione del controller; il DPL 0 riguarda l’invocazione software e il gestore viene raggiunto.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Indirizzo del descrittore",
            "valore": "0x4300"
          },
          {
            "passo": 1,
            "campo": "Destinazione nella porta",
            "valore": "0x8600"
          },
          {
            "passo": 2,
            "campo": "Esito",
            "valore": "ingresso al gestore"
          },
          {
            "passo": 2,
            "campo": "DPL",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "4.1.4": {
    "scopo": "Una pipeline può avere più istruzioni in corso quando una lettura fallisce. Ricostruirai lo stato che il gestore deve osservare, separando gli incrementi già resi definitivi dai risultati ancora provvisori.",
    "lettura": "Le sei caselle sono gli ADD nell’ordine del programma. Le caselle «ritirata» contribuiscono al registro visibile; la casella in fault stabilisce il nuovo tentativo; le caselle successive barrate mostrano il lavoro scartato. Il riquadro RIP identifica l’ADD da ripetere.",
    "conclusione": "La precisione dell’eccezione dipende dal confine di ritiro: restano visibili soltanto le istruzioni precedenti quella in fault. Spostare quel confine cambia insieme il registro definitivo e l’indirizzo del nuovo tentativo.",
    "controlli": {
      "k": "Posizione dell’ADD che incontra il fault, contando da 1 nella sequenza di sei istruzioni. Solo i k − 1 ADD precedenti producono incrementi definitivi.",
      "r": "Valore del registro prima del gruppo di istruzioni. Ogni ADD ritirato vi aggiunge uno."
    },
    "teoria": [
      "Per eseguire un’istruzione occorre leggerla, interpretarla e produrne gli effetti. Un processore organizzato in pipeline sovrappone queste fasi per più istruzioni, cosicché può avere già avviato un’operazione successiva mentre quella precedente sta ancora leggendo la memoria. Si chiama ritiro il momento in cui gli effetti diventano definitivi e appartengono allo stato che il programma può osservare.",
      "Se la lettura di un dato incontra una pagina di memoria assente, l’istruzione segnala un fault e il sistema prende il controllo. Perché l’eccezione sia precisa, chi interviene deve trovare gli effetti delle istruzioni precedenti già ritirate, mentre il lavoro delle successive viene scartato. Le istruzioni dette più giovani seguono quella del fault nell’ordine del programma; quelle più vecchie la precedono.",
      "Nel gruppo disegnato, ciascun ADD legge dalla memoria il valore uno e lo aggiunge a un registro, una piccola memoria del processore. Se il registro parte da 12 e il quarto ADD incontra il fault, i primi tre incrementi portano il valore visibile a 15. Le due istruzioni successive possono aver già compiuto lavoro interno, che il processore scarta prima di ripartire dal quarto ADD.",
      "Le sei istruzioni cominciano a 0x1000, scritto in base sedici, e occupano quattro byte ciascuna. Il registro RIP conserva l’indirizzo da cui ripartire: per l’istruzione di posizione k, contando la prima come 1, è 0x1000 + 4 × (k − 1). Il quarto ADD si trova dunque a 0x100C, mentre il secondo si trova a 0x1004; cambiando la posizione del fault cambiano sia gli incrementi già confermati sia il punto di ripresa."
    ],
    "introduzione": [
      "Quando più istruzioni avanzano insieme nella pipeline, che sovrappone le loro fasi di esecuzione, un fault deve comunque lasciare uno stato interpretabile. La simulazione serve a ricostruire questo confine preciso: il ritiro rende definitivi gli effetti delle istruzioni precedenti, mentre quelle successive perdono il lavoro provvisorio. La posizione dell’ADD in fault determina sia il registro visibile sia l’indirizzo da ritentare.",
      "Carica il fault al quarto ADD e prevedi quanti incrementi abbiano raggiunto il registro inizialmente pari a dodici. Avanza con «Passo successivo», confrontando le caselle ritirate, quella in fault e quelle scartate. Dopo «Fissa per confronto», carica il fault al secondo ADD: collega la variazione del registro da quindici a tredici al cambiamento del RIP salvato."
    ],
    "esperienze": [
      {
        "titolo": "Fault al quarto ADD",
        "parametri": {
          "k": 4,
          "r": 12
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Posizione dell’ADD in fault (da 1) = 4; Registro prima del gruppo = 12.",
          "Leggi il passo «Ingresso del gruppo». Annota Registro iniziale = 12; Istruzioni = 6. Prima di avanzare, prevedi il valore finale del campo «Registro nel gestore» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Ritiro in ordine». Annota ADD ritirati = 3; Registro visibile = 15.",
          "Premi «Passo successivo» e fermati su «Svuotamento». Annota Più giovani scartate = 2; RIP salvato = 0x100C; Registro nel gestore = 15."
        ],
        "risultato": "Nel passo «Svuotamento» il risultato è: Più giovani scartate = 2; RIP salvato = 0x100C; Registro nel gestore = 15.",
        "ragionamento": "Prima del quarto ADD sono stati ritirati tre incrementi: 12 + 3 = 15. Il nuovo tentativo parte da 0x1000 + 3 × 4 = 0x100C; i due ADD successivi perdono gli effetti provvisori.",
        "attesi": [
          {
            "passo": 1,
            "campo": "ADD ritirati",
            "valore": "3"
          },
          {
            "passo": 1,
            "campo": "Registro visibile",
            "valore": "15"
          },
          {
            "passo": 2,
            "campo": "Più giovani scartate",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "RIP salvato",
            "valore": "0x100C"
          },
          {
            "passo": 2,
            "campo": "Registro nel gestore",
            "valore": "15"
          }
        ]
      },
      {
        "titolo": "Fault anticipato al secondo ADD",
        "parametri": {
          "k": 2,
          "r": 12
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Posizione dell’ADD in fault (da 1) = 2; Registro prima del gruppo = 12.",
          "Leggi il passo «Ingresso del gruppo». Annota Registro iniziale = 12; Istruzioni = 6. Prima di avanzare, prevedi il valore finale del campo «Registro nel gestore» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Ritiro in ordine». Annota ADD ritirati = 1; Registro visibile = 13.",
          "Premi «Passo successivo» e fermati su «Svuotamento». Annota Più giovani scartate = 4; RIP salvato = 0x1004; Registro nel gestore = 13."
        ],
        "risultato": "Nel passo «Svuotamento» il risultato è: Più giovani scartate = 4; RIP salvato = 0x1004; Registro nel gestore = 13.",
        "ragionamento": "Prima del secondo ADD c’è un solo incremento definitivo, quindi il gestore vede 12 + 1 = 13. Il RIP salvato è 0x1000 + 4 = 0x1004 e le quattro istruzioni più giovani vengono scartate.",
        "attesi": [
          {
            "passo": 1,
            "campo": "ADD ritirati",
            "valore": "1"
          },
          {
            "passo": 1,
            "campo": "Registro visibile",
            "valore": "13"
          },
          {
            "passo": 2,
            "campo": "Più giovani scartate",
            "valore": "4"
          },
          {
            "passo": 2,
            "campo": "RIP salvato",
            "valore": "0x1004"
          },
          {
            "passo": 2,
            "campo": "Registro nel gestore",
            "valore": "13"
          }
        ]
      }
    ]
  },
  "4.1.5": {
    "scopo": "All’ingresso nel sistema una parte dello stato viene salvata dalla CPU e un’altra dal codice software. Misurerai separatamente le due porzioni della pila e vedrai come uno slot sintetico uniforma la disposizione degli eventi con e senza codice di errore.",
    "lettura": "Gli indirizzi diminuiscono scendendo lungo la pila. Le righe hardware elencano i campi del frame; le righe software distinguono lo slot sintetico dai registri generali, raggruppati in una sola riga. Confronta i byte delle due porzioni prima di leggere RSP finale.",
    "conclusione": "Una disposizione uniforme della pila può richiedere contributi diversi da hardware e software. Per ricostruire RSP bisogna contabilizzare allineamento, frame dell’evento e salvataggi dello stub nell’ordine in cui avvengono.",
    "controlli": {
      "r": "Puntatore della pila selezionato prima dell’ingresso. La simulazione lo allinea verso il basso a 16 byte; 0x2008 perde così otto byte prima del frame.",
      "e": "Tipo di eccezione. Il page fault aggiunge un codice hardware; l’errore di divisione usa qui uno slot sintetico inserito dallo stub.",
      "n": "Numero di registri generali custoditi dal software, ognuno in uno slot da otto byte. Questo costo si aggiunge al frame della CPU."
    },
    "teoria": [
      "Quando il processore passa al codice che gestisce un’eccezione, deve conservare abbastanza informazioni per tornare al programma. Le deposita sulla pila, una zona di memoria nella quale l’ultimo elemento inserito è il primo che si recupera. Su x86 a 64 bit il registro RSP indica la cima e l’inserimento occupa indirizzi decrescenti. Prima del salvataggio il processore allinea il puntatore al multiplo di sedici byte immediatamente inferiore o uguale.",
      "Il gruppo dei campi salvati, detto frame, comprende i riferimenti al codice e alla pila (CS e SS), i puntatori all’istruzione e alla pila (RIP e RSP) e lo stato dei flag (RFLAGS), bit che descrivono condizioni e opzioni del processore. Ciascun campo occupa un posto, o slot, da otto byte: cinque slot occupano quaranta byte. Una pagina di memoria assente genera un’eccezione con un ulteriore codice di errore, anch’esso da otto byte.",
      "Nel primo caso la pila parte da 0x2000, già allineato. Il frame del page fault con codice lascia la cima a 0x1FD0. Subentra allora la breve routine software di ingresso, detta stub. Nel caso dell’errore di divisione aggiunge uno slot sintetico, cioè un posto sostitutivo per il codice di errore assente, così da presentare ai passi successivi campi disposti nello stesso ordine. Scegliendo invece il puntatore 0x2008, l’allineamento iniziale consumerebbe altri otto byte prima di costruire il medesimo frame.",
      "Nel caso iniziale si custodiscono inoltre otto registri generali, ciascuno largo otto byte. Il software aggiunge quindi 64 byte dopo un page fault, oppure 72 byte dopo un errore di divisione includendo lo slot sintetico. Il totale occupato dopo l’allineamento è identico, 112 byte, proprio perché lo stub presenta una disposizione uniforme ai passaggi successivi. Il prologo rappresentato è configurabile per studiare il costo dei salvataggi: il numero scelto di registri descrive questo programma d’ingresso e va distinto dal formato completo adottato da una specifica versione di Linux."
    ],
    "introduzione": [
      "Ricostruire l’occupazione della pila all’ingresso di un’eccezione è lo scopo della simulazione. RSP indica la cima della pila, che cresce verso indirizzi inferiori; il frame raccoglie i campi salvati dalla CPU. Lo stub, il breve codice software d’ingresso rappresentato, aggiunge registri e, quando occorre, uno slot sintetico, così da ottenere una disposizione uniforme pur con contributi hardware diversi.",
      "Carica il page fault e segui «Selezione della pila», «Frame della CPU» e «Stub di ingresso». Confronta poi l’errore di divisione, distinguendo byte hardware e byte software prima di leggere RSP finale. Scegliendo «RSP selezionato» pari a 0x2008 e premendo «Applica i parametri», verifica anche gli otto byte dovuti all’allineamento, che si aggiungono ai salvataggi del modello."
    ],
    "esperienze": [
      {
        "titolo": "Page fault con codice hardware",
        "parametri": {
          "r": "8192",
          "e": "pf",
          "n": 8
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: RSP selezionato = 0x2000; Evento = Page fault con codice; Registri da salvare nello stub = 8.",
          "Leggi il passo «Selezione della pila». Annota RSP iniziale = 0x2000; RSP allineato = 0x2000. Prima di avanzare, prevedi il valore finale del campo «Movimento complessivo (B)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Frame della CPU». Annota Byte del frame = 48; RSP dopo ingresso = 0x1FD0.",
          "Premi «Passo successivo» e fermati su «Stub di ingresso». Annota Byte aggiunti dal software = 64; RSP finale = 0x1F90; Movimento complessivo (B) = 112."
        ],
        "risultato": "Nel passo «Stub di ingresso» il risultato è: Byte aggiunti dal software = 64; RSP finale = 0x1F90; Movimento complessivo (B) = 112.",
        "ragionamento": "La pila parte già allineata a 0x2000. Cinque campi e il codice occupano 6 × 8 = 48 byte; otto registri richiedono altri 64 byte, per un totale di 112 = 0x70 e RSP finale 0x1F90.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Byte del frame",
            "valore": "48"
          },
          {
            "passo": 1,
            "campo": "RSP dopo ingresso",
            "valore": "0x1FD0"
          },
          {
            "passo": 2,
            "campo": "Byte aggiunti dal software",
            "valore": "64"
          },
          {
            "passo": 2,
            "campo": "RSP finale",
            "valore": "0x1F90"
          },
          {
            "passo": 2,
            "campo": "Movimento complessivo (B)",
            "valore": "112"
          }
        ]
      },
      {
        "titolo": "Divisione e slot software sintetico",
        "parametri": {
          "r": "8192",
          "e": "de",
          "n": 8
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: RSP selezionato = 0x2000; Evento = Errore di divisione; Registri da salvare nello stub = 8.",
          "Leggi il passo «Selezione della pila». Annota RSP iniziale = 0x2000; RSP allineato = 0x2000. Prima di avanzare, prevedi il valore finale del campo «Movimento complessivo (B)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Frame della CPU». Annota Byte del frame = 40; RSP dopo ingresso = 0x1FD8.",
          "Premi «Passo successivo» e fermati su «Stub di ingresso». Annota Byte aggiunti dal software = 72; RSP finale = 0x1F90; Movimento complessivo (B) = 112."
        ],
        "risultato": "Nel passo «Stub di ingresso» il risultato è: Byte aggiunti dal software = 72; RSP finale = 0x1F90; Movimento complessivo (B) = 112.",
        "ragionamento": "L’errore di divisione produce un frame hardware di 5 × 8 = 40 byte. Lo stub aggiunge otto byte sintetici e 64 byte di registri: 40 + 72 = 112, perciò la cima finale resta 0x1F90 pur cambiando la ripartizione dei salvataggi.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Byte del frame",
            "valore": "40"
          },
          {
            "passo": 1,
            "campo": "RSP dopo ingresso",
            "valore": "0x1FD8"
          },
          {
            "passo": 2,
            "campo": "Byte aggiunti dal software",
            "valore": "72"
          },
          {
            "passo": 2,
            "campo": "RSP finale",
            "valore": "0x1F90"
          },
          {
            "passo": 2,
            "campo": "Movimento complessivo (B)",
            "valore": "112"
          }
        ]
      }
    ]
  },
  "4.1.6": {
    "scopo": "Il ritorno all’istruzione corretta deve accompagnarsi al recupero dei dati intermedi del programma. Seguirai RAX durante il servizio di un interrupt, confrontando uno stub che lo conserva con uno che lo lascia sovrascrivere.",
    "lettura": "I riquadri superiori mostrano RAX nel programma, durante il gestore e alla ripresa. La casella inferiore è la copia custodita sulla pila. La freccia che la attraversa spiega da dove proviene il valore ripristinato; RIP rimane indicato separatamente nel testo della figura.",
    "conclusione": "Il frame hardware conserva il controllo necessario al ritorno; i registri generali utilizzati dal gestore richiedono un salvataggio coerente con il codice di ingresso. Un RIP corretto può accompagnarsi a dati di programma alterati.",
    "controlli": {
      "r": "Valore del registro RAX appartenente al programma interrotto. Il gestore userà temporaneamente lo stesso registro per il valore 255.",
      "salva": "Decidi se lo stub copia RAX sulla pila e lo ripristina prima del ritorno. L’indirizzo di ritorno rimane salvato in entrambi i casi."
    },
    "teoria": [
      "Un programma che lascia un calcolo a metà si aspetta di ritrovare i risultati intermedi quando riprende. Molti di questi valori stanno nei registri, piccole memorie interne al processore. RAX è un registro di uso generale. RIP, invece, indica la posizione del codice da cui proseguire. Per ritrovare sia le istruzioni sia i dati occorre tenere distinti questi due compiti.",
      "All’arrivo di un interrupt, ossia la richiesta di attenzione di un dispositivo, la tabella IDT associa l’evento al gestore da avviare. La macchina x86 salva l’indirizzo per il ritorno e altre informazioni di controllo sulla pila, una zona di memoria dalla quale si recupera per primo l’ultimo valore deposto. Questo gruppo di valori è il frame. Il breve codice d’ingresso, detto stub, può usare la pila anche per mettere da parte RAX prima che il gestore adoperi quel registro per il proprio lavoro.",
      "Se il programma aveva lasciato 37 in RAX e il gestore vi scrive 255, la copia sulla pila consente di rimettere 37 nel registro alla fine del servizio. L’istruzione di ritorno IRETQ riporta poi l’esecuzione all’indirizzo salvato. Omettendo la copia, il programma ritrova quell’indirizzo corretto insieme al valore 255 lasciato dal gestore."
    ],
    "introduzione": [
      "Ritrovare l’istruzione corretta e ritrovare i propri dati sono due requisiti della ripresa che qui osserverai separatamente. La simulazione serve a verificare come il salvataggio di RAX, registro contenente un dato intermedio del programma, protegga quel dato dall’uso temporaneo del gestore. La copia sulla pila conserva il valore originario, mentre il frame hardware custodisce le informazioni di ritorno.",
      "Carica «RAX custodito e ripristinato», quindi avanza con «Passo successivo» osservando il valore trentasette nel programma, la copia sulla pila e il valore 255 scritto dal gestore. Fissa il caso per confronto e carica quello che omette il salvataggio. Leggi insieme RIP e «RAX osservato»: il confronto mostra quale parte del contesto dipenda dal lavoro dello stub."
    ],
    "esperienze": [
      {
        "titolo": "RAX custodito e ripristinato",
        "parametri": {
          "r": 37,
          "salva": "si"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: RAX del programma = 37; Operazioni dello stub = Salva e ripristina RAX.",
          "Leggi il passo «Ingresso su IDT». Annota RAX = 37; RIP di ritorno = 0x4010. Prima di avanzare, prevedi il valore finale del campo «RAX osservato» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Uso temporaneo». Annota Copia sulla pila = 37; RAX = 255.",
          "Premi «Passo successivo» e fermati su «Ripresa». Annota RIP = 0x4010; RAX osservato = 37."
        ],
        "risultato": "Nel passo «Ripresa» il risultato è: RIP = 0x4010; RAX osservato = 37.",
        "ragionamento": "Il gestore scrive 255 in RAX, mentre la pila conserva 37. Prima di IRETQ lo stub ricarica 37, così il programma ritrova il proprio dato insieme al RIP 0x4010.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Copia sulla pila",
            "valore": "37"
          },
          {
            "passo": 1,
            "campo": "RAX",
            "valore": "255"
          },
          {
            "passo": 2,
            "campo": "RIP",
            "valore": "0x4010"
          },
          {
            "passo": 2,
            "campo": "RAX osservato",
            "valore": "37"
          }
        ]
      },
      {
        "titolo": "RAX sovrascritto dal gestore",
        "parametri": {
          "r": 37,
          "salva": "no"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: RAX del programma = 37; Operazioni dello stub = Omette il salvataggio.",
          "Leggi il passo «Ingresso su IDT». Annota RAX = 37; RIP di ritorno = 0x4010. Prima di avanzare, prevedi il valore finale del campo «RAX osservato» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Uso temporaneo». Annota Copia sulla pila = assente; RAX = 255.",
          "Premi «Passo successivo» e fermati su «Ripresa». Annota RIP = 0x4010; RAX osservato = 255."
        ],
        "risultato": "Nel passo «Ripresa» il risultato è: RIP = 0x4010; RAX osservato = 255.",
        "ragionamento": "La scrittura di 255 sostituisce l’unica copia di RAX disponibile in questo percorso. IRETQ recupera RIP 0x4010 dal frame; quando il programma riprende da quell’indirizzo, RAX contiene 255 al posto del proprio 37.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Copia sulla pila",
            "valore": "assente"
          },
          {
            "passo": 1,
            "campo": "RAX",
            "valore": "255"
          },
          {
            "passo": 2,
            "campo": "RIP",
            "valore": "0x4010"
          },
          {
            "passo": 2,
            "campo": "RAX osservato",
            "valore": "255"
          }
        ]
      }
    ]
  },
  "4.1.7": {
    "scopo": "Una seconda periferica può richiedere servizio durante un gestore già attivo. Verificherai insieme l’abilitazione IF e la priorità, ricostruendo la profondità della pila e l’ordine dei ritorni.",
    "lettura": "Le schede superiori separano priorità corrente, nuova richiesta e IF. I livelli sovrapposti sotto di esse rappresentano programma, gestore esterno ed eventuale gestore interno. Segui il primo ritorno: la sua destinazione identifica il contesto più recente ancora sospeso.",
    "conclusione": "Nel modello l’annidamento richiede entrambe le condizioni, IF uguale a uno e nuova priorità maggiore di quattro. I ritorni recuperano i contesti in ordine inverso agli ingressi, preservando la continuazione di ciascun livello.",
    "controlli": {
      "q": "Priorità numerica della seconda richiesta; un numero maggiore indica maggiore urgenza. Il primo gestore ha priorità fissa 4.",
      "iflag": "Scegli se il primo gestore mantiene IF a zero oppure lo riabilita dopo il prologo. La nuova richiesta resta registrata dal controller anche quando la consegna è rinviata."
    },
    "teoria": [
      "Mentre il processore serve un dispositivo, un altro può richiederne l’attenzione. Se la seconda richiesta viene accettata subito, il primo gestore si interrompe a sua volta. Si parla di annidamento perché il secondo servizio si svolge interamente all’interno del primo. Il controller, cioè il circuito che raccoglie le richieste, tiene conto della loro priorità. Anche il processore deve essere disposto ad accettarle. In questo controller un numero maggiore indica una priorità maggiore; una richiesta pendente è stata registrata e attende di essere servita.",
      "La possibilità di ricevere gli interrupt esterni mascherabili, quelli che il processore può rinviare, dipende da un bit chiamato IF. Il valore uno abilita la consegna. All’ingresso attraverso la porta usata qui, IF viene azzerato. Dopo il prologo, il tratto iniziale che custodisce lo stato necessario al ritorno, il primo gestore può riattivarlo. Il controller ammette allora soltanto richieste di priorità superiore a quella già in servizio.",
      "Per un primo gestore di priorità 4 e una richiesta di priorità 5, la riattivazione di IF permette il secondo ingresso. Ogni ingresso deposita un gruppo di informazioni di ritorno, detto frame, sulla pila, un’area di memoria che restituisce per primo l’ultimo gruppo inserito. Recuperando prima il gruppo più recente, l’istruzione IRETQ riprende il gestore esterno. Un secondo ritorno riprende il programma. Se IF resta a zero, la richiesta attende e basta un solo gruppo sulla pila."
    ],
    "introduzione": [
      "Questo esperimento serve a stabilire quando una nuova richiesta possa interrompere un gestore già attivo e quale contesto venga ripreso per primo. IF è il bit che abilita gli interrupt mascherabili; la priorità misura l’urgenza secondo il controller rappresentato. L’annidamento richiede IF attivo e priorità superiore a quattro, mentre i frame sulla pila conservano i ritorni in ordine inverso agli ingressi.",
      "Carica la richiesta urgente tenuta pendente e segui i valori di IF e della priorità fino al primo ritorno. Confrontala con il caso che riabilita IF dopo il prologo, usando «Fissa per confronto» prima di cambiare caso. Osserva la profondità massima della pila e il primo contesto ripristinato: un eventuale frame residuo appartiene al programma ancora sospeso."
    ],
    "esperienze": [
      {
        "titolo": "Richiesta urgente tenuta pendente",
        "parametri": {
          "q": 5,
          "iflag": "zero"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Priorità in arrivo (maggiore = più urgente) = 5; Dopo l’ingresso = Mantieni IF = 0.",
          "Leggi il passo «Primo ingresso». Annota Priorità attiva = 4; IF = 0. Prima di avanzare, prevedi il valore finale del campo «Frame ancora sulla pila dopo il primo IRETQ» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Seconda richiesta». Annota Richiesta = 5; Supera la soglia = sì; IF corrente = 0.",
          "Premi «Passo successivo» e fermati su «Servizio». Annota Profondità massima = 1; Prima del primo ritorno = pendente.",
          "Premi «Passo successivo» e fermati su «Ritorno dai gestori». Annota Primo contesto ripristinato = programma interrotto; Frame ancora sulla pila dopo il primo IRETQ = 0."
        ],
        "risultato": "Nel passo «Ritorno dai gestori» il risultato è: Primo contesto ripristinato = programma interrotto; Frame ancora sulla pila dopo il primo IRETQ = 0.",
        "ragionamento": "La richiesta di priorità 5 supera la soglia 4 e rimane pendente finché IF vale zero. La consegna attende il ritorno dal primo gestore. La profondità massima è uno e il primo IRETQ ripristina direttamente il programma, lasciando zero frame sulla pila.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Profondità massima",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Prima del primo ritorno",
            "valore": "pendente"
          },
          {
            "passo": 3,
            "campo": "Primo contesto ripristinato",
            "valore": "programma interrotto"
          },
          {
            "passo": 3,
            "campo": "Frame ancora sulla pila dopo il primo IRETQ",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Servizio annidato dopo la riabilitazione",
        "parametri": {
          "q": 5,
          "iflag": "uno"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Priorità in arrivo (maggiore = più urgente) = 5; Dopo l’ingresso = Riabilita IF dopo il prologo.",
          "Leggi il passo «Primo ingresso». Annota Priorità attiva = 4; IF = 0. Prima di avanzare, prevedi il valore finale del campo «Frame ancora sulla pila dopo il primo IRETQ» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Seconda richiesta». Annota Richiesta = 5; Supera la soglia = sì; IF corrente = 1.",
          "Premi «Passo successivo» e fermati su «Servizio». Annota Profondità massima = 2; Prima del primo ritorno = gestita.",
          "Premi «Passo successivo» e fermati su «Ritorno dai gestori». Annota Primo contesto ripristinato = gestore esterno; Frame ancora sulla pila dopo il primo IRETQ = 1."
        ],
        "risultato": "Nel passo «Ritorno dai gestori» il risultato è: Primo contesto ripristinato = gestore esterno; Frame ancora sulla pila dopo il primo IRETQ = 1.",
        "ragionamento": "Con IF riabilitato, 5 > 4 consente il secondo ingresso. La profondità raggiunge due; il primo IRETQ riprende il gestore esterno e lascia ancora un frame, quello che permetterà di tornare al programma.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Profondità massima",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "Prima del primo ritorno",
            "valore": "gestita"
          },
          {
            "passo": 3,
            "campo": "Primo contesto ripristinato",
            "valore": "gestore esterno"
          },
          {
            "passo": 3,
            "campo": "Frame ancora sulla pila dopo il primo IRETQ",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "4.1.8": {
    "scopo": "Lo stato salvato prima di un ingresso può differire dal flag che governa il gestore. Confronterai interrupt gate e trap gate partendo da IF uguale a uno, seguendo separatamente copia salvata e valore attivo.",
    "lettura": "Leggi «IF salvato» come copia dello stato precedente e «IF attivo» come valore in uso nel gestore. I due percorsi ripartono entrambi dallo stesso IF iniziale: il passaggio da interrupt gate a trap gate è un confronto fra ingressi alternativi.",
    "conclusione": "La scelta della porta determina l’abilitazione attiva durante il servizio. Lo stato salvato resta disponibile per ricostruire il contesto precedente al ritorno, anche quando IF viene azzerato nel nuovo contesto.",
    "teoria": [
      "Quando una periferica segnala un evento, il processore può interrompere il programma per eseguire una routine di servizio, chiamata gestore. Alcune richieste esterne possono essere temporaneamente rinviate. Il processore x86 usa a questo scopo un bit, IF, che abilita la loro consegna quando vale uno. Il suo valore appartiene allo stato del programma allo stesso modo in cui vi appartiene l’indirizzo dell’istruzione da riprendere.",
      "Entrando nel gestore, il processore salva sulla pila una copia dello stato precedente. La pila è una regione di memoria dalla quale quel gruppo di valori potrà essere recuperato al ritorno. Il valore conservato in questa copia resta disponibile anche se il bit che governa l’esecuzione del gestore cambia nel frattempo. La porta è la voce della tabella IDT che identifica il gestore e stabilisce anche il trattamento di IF durante l’ingresso.",
      "Nel problema IF parte da uno. Un ingresso attraverso una porta di tipo interrupt conserva quel valore nella copia salvata e azzera IF nel contesto attivo, rinviando così ulteriori richieste mascherabili. Ripartendo dallo stesso stato iniziale, una porta di tipo trap conserva invece IF attivo a uno. Il confronto riguarda due ingressi alternativi, ciascuno applicato al medesimo stato del programma."
    ],
    "introduzione": [
      "La ricostruzione serve a distinguere il valore di IF salvato per il ritorno dal valore che governa il gestore durante il servizio. IF abilita gli interrupt esterni mascherabili quando vale uno. Partendo dallo stesso stato, una porta interrupt lo azzera nel contesto attivo, mentre una porta trap lo conserva: sono due ingressi alternativi da confrontare sul medesimo stato iniziale.",
      "Leggi i dati iniziali e scrivi nel campo di previsione il valore di IF che attendi dopo l’interrupt gate. Avanza con «Passo successivo», osservando separatamente «IF salvato» e «IF attivo». Nel fotogramma dedicato al trap gate riparti mentalmente da IF uguale a uno; usa «Precedente» per verificare che il confronto riguardi due alternative e distingua copia e stato corrente."
    ],
    "procedura": [
      "Leggi i dati iniziali: Prima dell’ingresso nel gestore, il flag IF del processore x86 vale 1. Si esamina lo stesso ingresso prima attraverso un interrupt gate e poi attraverso un trap gate.",
      "Prima di avviare la ricostruzione, scrivi una previsione per questa domanda: Con IF iniziale uguale a 1, quanto vale IF nel gestore raggiunto con un interrupt gate?",
      "Premi «Passo successivo» per attraversare «Stato iniziale», «Interrupt gate», «Trap gate». A ogni passaggio confronta le quantità indicate con il ragionamento teorico.",
      "Confronta la previsione con «IF attivo» nel fotogramma «Interrupt gate». Nell’ultimo fotogramma osserva il trap gate, che riparte dallo stesso IF iniziale uguale a uno; usa «Precedente» per confrontare i due ingressi."
    ],
    "risultato": "Per la domanda «Con IF iniziale uguale a 1, quanto vale IF nel gestore raggiunto con un interrupt gate?» il valore atteso è 0.",
    "ragionamento": "Il valore iniziale IF = 1 abilita gli interrupt esterni mascherabili. Si applicano i due tipi di gate separatamente allo stesso stato. L’ingresso salva lo stato previsto dal modello e azzera IF nel nuovo contesto. Ripartendo dallo stesso stato, il trap gate conserva IF attivo. Il confronto riguarda il valore visibile al gestore."
  },
  "4.1.9": {
    "scopo": "Il vettore di un evento è l’indice di una tabella e va convertito in uno spostamento di byte. Calcolerai offset e indirizzo della porta 14 in una IDT a 64 bit, distinguendo la posizione del descrittore dalla destinazione del gestore.",
    "lettura": "Segui nella ricostruzione il numero di voci attraversate, la loro larghezza e la base della tabella. L’indirizzo ottenuto identifica il primo byte del descrittore; il contenuto di quella voce verrà interpretato soltanto in un passaggio successivo.",
    "conclusione": "Per una tabella a elementi di dimensione fissa, l’indirizzo della voce è base + indice × dimensione. Conservare l’unità byte evita di confondere il numero di una porta con il suo indirizzo.",
    "teoria": [
      "Quando un evento richiede l’attenzione del processore, un numero chiamato vettore identifica il tipo di evento. Sui processori x86 la tabella IDT raccoglie le descrizioni delle porte attraverso le quali si raggiungono le routine di servizio. L’indirizzo di una porta indica dove leggerne la descrizione. Gli indici partono da zero: la voce 0 comincia esattamente alla base, perciò la voce 14 è preceduta da quattordici voci. La lettera B indica byte; il prefisso 0x introduce la base sedici, nella quale E vale quattordici.",
      "Le voci della tabella si chiamano descrittori e hanno una larghezza fissata dalla modalità del processore. Per raggiungere una voce si contano tutte quelle che la precedono a partire dalla base della IDT. Il prodotto fra numero del vettore e byte per voce è quindi uno spostamento, espresso in byte.",
      "Nel caso guidato la tabella comincia a 0x4000 e ogni voce occupa sedici byte. Per la voce 14 si attraversano 14 × 16 = 224 byte, ossia 0xE0. Il primo byte del descrittore si trova quindi a 0x40E0, equivalente a 16 608 in decimale. Il contenuto del descrittore servirà poi a individuare il codice del gestore: la posizione appena calcolata appartiene alla tabella. Per risalire da un byte osservato alla porta che lo contiene, si sottrae la base della tabella e si divide per la dimensione della voce: il quoziente intero fornisce il vettore e il resto la posizione del byte dentro quella voce."
    ],
    "introduzione": [
      "L’esercitazione serve a trasformare un numero di vettore nell’indirizzo della corrispondente porta della IDT, la tabella che descrive gli ingressi ai gestori. Poiché le voci hanno dimensione fissa e sono numerate da zero, l’offset, ossia lo spostamento dalla base, vale indice per byte di una voce. Sommandolo alla base si trova dove leggere il descrittore del gestore.",
      "Premi «Carica l’esempio guidato» e calcola «Offset (B)» per il vettore quattordici prima di usare «Registra la previsione». Segui con «Passo successivo» la conversione da numero di voci a byte, poi l’aggiunta alla base. Confronta i 224 byte di offset con l’indirizzo finale 0x40E0: il secondo individua il descrittore, dal quale si ricaverà poi la destinazione del gestore."
    ],
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 1 «Indirizzare una porta della IDT», traccia 1. La spiegazione seguente si riferisce a questi dati.",
      "Leggi la consegna: La IDT inizia a 0x4000. Ogni descrittore occupa 16 byte (modalità a 64 bit). Trova l’offset e l’indirizzo del descrittore di indice 14.",
      "Calcola il primo campo «Offset (B)» e premi «Registra la previsione» per avviare la ricostruzione. Il riscontro permette di confrontare il tuo risultato con i passaggi successivi.",
      "Segui la ricostruzione fino alla verifica dei campi; con «Apri la prova completa» puoi inserire tutte le risposte. Cambiando esercizio o traccia, rileggi la nuova consegna e usa i relativi dati."
    ],
    "risultato": "Nell’esercizio 1, traccia 1, si ottiene: Offset (B) = 224; Indirizzo del descrittore = 16608.",
    "ragionamento": "A ogni incremento del vettore, l’indirizzo della voce cresce di 16 byte. L’offset del vettore 14 è 14 × 16 = 224 B, ossia 0xE0. Il descrittore si legge a 0x4000 + 0xE0 = 0x40E0. Il suo contenuto determina l’indirizzo del gestore."
  },
  "4.1.10": {
    "scopo": "Il puntatore della pila può scendere sia per allinearsi sia per ospitare il frame dell’eccezione. Nel page fault iniziale misurerai le due componenti separatamente e ricaverai la cima finale.",
    "lettura": "La prima trasformazione riguarda il puntatore selezionato, la seconda aggiunge i campi del frame. Confronta i byte effettivamente salvati con lo spostamento complessivo di RSP: il salto di allineamento precede l’occupazione dei sei slot.",
    "conclusione": "Dimensione del frame e movimento del puntatore sono grandezze diverse quando serve allineamento. La ricostruzione della pila deve seguire prima l’arrotondamento dell’indirizzo e poi i salvataggi dell’evento.",
    "teoria": [
      "Se un evento interrompe un programma, il processore conserva le informazioni che permetteranno di riprenderlo sulla pila, un’area di memoria che restituisce per primi i valori inseriti per ultimi. RSP è il registro che ne indica la cima. Il gruppo di dati salvati in occasione dell’evento si chiama frame di ingresso.",
      "Nel caso a 64 bit i cinque campi di base conservano SS, che identifica il segmento della pila, RSP, il puntatore precedente, RFLAGS, l’insieme dei bit di stato, CS, il segmento del codice, e RIP, l’indirizzo di ripresa. Ciascun campo occupa un posto, detto slot, da otto byte. Il page fault #PF, un’eccezione che richiede l’intervento del sistema sull’accesso a una pagina di memoria, aggiunge un codice di errore in un ulteriore slot.",
      "Quando si aggiungono dati alla pila x86, la cima si muove verso indirizzi inferiori. Prima del frame l’ingresso a 64 bit allinea RSP al multiplo di sedici inferiore o uguale. Il prefisso 0x introduce la base sedici: nel caso guidato 0x2008 viene allineato a 0x2000, consumando otto byte.",
      "I cinque campi di base e il codice di errore occupano 6 × 8 = 48 byte, ossia 0x30: il puntatore finale è 0x2000 − 0x30 = 0x1FD0, pari a 8144 in decimale. Il movimento totale da 0x2008 comprende anche l’allineamento e vale 8 + 48 = 56 byte. Partendo da una cima già allineata, lo stesso frame richiederebbe invece uno spostamento di 48 byte. Nelle due tracce dell’esercizio la larghezza degli slot dipende dalla modalità indicata."
    ],
    "introduzione": [
      "Seguire questi passaggi serve a distinguere i byte del frame di ingresso dallo spostamento complessivo del puntatore della pila. RSP indica la cima, che viene prima allineata a sedici byte e poi abbassata per ospitare i valori salvati. Nel page fault a sessantaquattro bit, cinque campi di base e un codice di errore occupano sei slot da otto byte.",
      "Richiama con «Carica l’esempio guidato» l’esercizio sul frame, traccia due, e prevedi separatamente allineamento e salvataggi. Avanza con «Passo successivo» da 0x2008 a 0x2000 e poi a 0x1FD0. Confronta i quarantotto byte del frame con i cinquantasei byte di movimento totale; usa «Precedente» per individuare gli otto byte che spiegano la differenza fra le due quantità."
    ],
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 3 «Misurare il frame di ingresso», traccia 2. La spiegazione seguente si riferisce a questi dati.",
      "Leggi la consegna: Ingresso IDT ordinario per #PF a 64 bit. Il puntatore di pila selezionato vale 0x2008, l’allineamento hardware avviene a 16 byte e il page fault aggiunge un codice di errore. Calcola dimensione del frame e RSP finale.",
      "Ricostruisci il primo campo «Byte nei campi del frame» prima di leggere lo svolgimento. Avanza con «Passo successivo» e controlla i dati impiegati in ciascuna operazione.",
      "Segui la ricostruzione fino alla verifica dei campi; con «Apri la prova completa» puoi inserire tutte le risposte. Cambiando esercizio o traccia, rileggi la nuova consegna e usa i relativi dati."
    ],
    "risultato": "Nell’esercizio 3, traccia 2, si ottiene: Byte nei campi del frame = 48; RSP finale = 8144.",
    "ragionamento": "L’allineamento porta 0x2008 a 0x2000 e consuma 8 B. SS, RSP, RFLAGS, CS e RIP occupano 5 × 8 = 40 B. Il codice di #PF aggiunge 8 B. Il frame occupa 48 B = 0x30. RSP finale vale 0x2000 − 0x30 = 0x1FD0. Il movimento totale è di 56 B."
  },
  "4.2.1": {
    "scopo": "Il numero di una chiamata di sistema determina come il kernel interpreta gli argomenti. Preparerai una richiesta di lettura e una terminazione, seguendo il passaggio dai registri del chiamante al servizio selezionato.",
    "lettura": "Il confine verticale separa utente e kernel. I riquadri RAX e RDI contengono numero di servizio e primo argomento; la freccia attraversa il confine e raggiunge il servizio. RCX mostra l’indirizzo successivo a SYSCALL, mentre l’ultima riga descrive l’effetto richiesto.",
    "conclusione": "Il registro RDI conserva una posizione nella convenzione di chiamata, il cui significato dipende dal servizio indicato in RAX. Preparare gli argomenti richiede quindi sia i valori sia la conoscenza dell’operazione selezionata.",
    "controlli": {
      "s": "Servizio Linux x86-64: read ha numero 0, write numero 1, exit numero 60. La simulazione segue la preparazione e la selezione del servizio.",
      "a": "Primo argomento in RDI: descrittore per read e write, stato di uscita per exit. Le richieste di dati usano inoltre RSI = 0x4000 e RDX = 8."
    },
    "teoria": [
      "Per leggere da un file, un programma chiede al sistema operativo di svolgere un’operazione per suo conto. La parte del sistema che controlla risorse e permessi si chiama kernel. Una chiamata di sistema, o syscall, trasferisce il controllo dal programma a un punto d’ingresso stabilito dal kernel. Affinché la richiesta sia comprensibile, il chiamante dispone i valori secondo una convenzione condivisa. Gli argomenti sono i dati che descrivono l’operazione; il buffer è la regione di memoria che contiene i byte da scrivere o che riceverà quelli letti.",
      "Su Linux per processori x86-64 alcuni registri, piccole memorie interne alla CPU, svolgono ruoli precisi. RAX contiene il numero del servizio e RDI il primo argomento. Con RAX uguale a zero si richiede read, cioè una lettura, e con RAX uguale a uno si richiede write, cioè una scrittura; in entrambi i casi RDI è il descrittore, cioè il numero con cui il processo identifica un oggetto aperto, RSI indica il buffer e RDX la lunghezza. Con RAX pari a 60 si richiede exit e RDI indica lo stato di uscita del thread, la sequenza di esecuzione chiamante.",
      "Il passaggio avviene mediante l’istruzione SYSCALL. Nella traccia occupa due byte a partire da 0x4010, in notazione esadecimale. RCX riceve perciò 0x4012 come possibile indirizzo di ritorno. Il kernel dispone ora sia degli argomenti sia del numero che gli permette di interpretarli."
    ],
    "introduzione": [
      "La simulazione serve a comprendere come una richiesta del programma diventi un servizio del kernel attraverso una convenzione sui registri, le piccole memorie interne alla CPU. RAX seleziona l’operazione e RDI trasporta il primo argomento, il cui significato dipende dal servizio. L’istruzione SYSCALL attraversa il confine di privilegio e conserva in RCX il possibile indirizzo di ritorno.",
      "Carica la lettura dal descrittore tre e avanza con «Passo successivo», seguendo RAX, RDI e il servizio selezionato. Confronta poi la terminazione con stato sette: RDI passa dal ruolo di descrittore, numero di un oggetto aperto, a quello di stato d’uscita. Osserva che RCX conserva 0x4012 anche quando il servizio richiesto conclude l’esecuzione del thread."
    ],
    "esperienze": [
      {
        "titolo": "Lettura dal descrittore 3",
        "parametri": {
          "s": "read",
          "a": 3
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Servizio = read; Primo argomento = 3.",
          "Leggi il passo «Chiamante». Annota RAX = 0; RDI = 3. Prima di avanzare, formula la previsione richiesta nel campo «Numero del servizio in RAX» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Ingresso SYSCALL». Annota RCX = 0x4012; Servizio = lettura.",
          "Premi «Passo successivo» e fermati su «Selezione del servizio». Annota Descrittore = 3; Effetto = richiesta fino a 8 B."
        ],
        "risultato": "Nel passo «Selezione del servizio» il risultato è: Descrittore = 3; Effetto = richiesta fino a 8 B.",
        "ragionamento": "RAX = 0 seleziona read e RDI = 3 identifica il descrittore da leggere. Gli altri argomenti chiedono fino a otto byte nel buffer 0x4000; i due byte di SYSCALL portano il possibile indirizzo di ritorno da 0x4010 a 0x4012.",
        "attesi": [
          {
            "passo": 1,
            "campo": "RCX",
            "valore": "0x4012"
          },
          {
            "passo": 1,
            "campo": "Servizio",
            "valore": "lettura"
          },
          {
            "passo": 2,
            "campo": "Descrittore",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "Effetto",
            "valore": "richiesta fino a 8 B"
          }
        ]
      },
      {
        "titolo": "Terminazione del thread con stato 7",
        "parametri": {
          "s": "exit",
          "a": 7
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Servizio = exit; Primo argomento = 7.",
          "Leggi il passo «Chiamante». Annota RAX = 60; RDI = 7. Prima di avanzare, formula la previsione richiesta nel campo «Numero del servizio in RAX» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Ingresso SYSCALL». Annota RCX = 0x4012; Servizio = uscita.",
          "Premi «Passo successivo» e fermati su «Selezione del servizio». Annota Stato di uscita = 7; Effetto = termine del thread."
        ],
        "risultato": "Nel passo «Selezione del servizio» il risultato è: Stato di uscita = 7; Effetto = termine del thread.",
        "ragionamento": "RAX = 60 seleziona exit, quindi RDI = 7 viene interpretato come stato di uscita. L’hardware salva comunque 0x4012 in RCX durante l’ingresso, mentre il servizio termina il thread chiamante senza riprenderne la sequenza ordinaria.",
        "attesi": [
          {
            "passo": 1,
            "campo": "RCX",
            "valore": "0x4012"
          },
          {
            "passo": 1,
            "campo": "Servizio",
            "valore": "uscita"
          },
          {
            "passo": 2,
            "campo": "Stato di uscita",
            "valore": "7"
          },
          {
            "passo": 2,
            "campo": "Effetto",
            "valore": "termine del thread"
          }
        ]
      }
    ]
  },
  "4.2.2": {
    "scopo": "Una scrittura attraversa il confine di privilegio soltanto dopo che il kernel ha interpretato gli argomenti. Seguirai i primi quattro byte di un buffer fino a una pipe e confronterai l’esito con una richiesta diretta a un descrittore già chiuso.",
    "lettura": "La riga superiore contiene i byte ASCII di COMPUTER e evidenzia il prefisso richiesto da RDX. La linea orizzontale indica il confine di privilegio. Nel caso riuscito, il prefisso compare nella destinazione inferiore; nel ramo EBADF la figura mostra l’assenza del trasferimento.",
    "conclusione": "La lunghezza richiesta delimita il prefisso del buffer, mentre la validità del descrittore decide se quel trasferimento può cominciare. Il valore di RAX va interpretato come conteggio quando positivo e come codice di errore quando negativo.",
    "controlli": {
      "fd": "Stato del descrittore del processo. La pipe scrivibile dispone di spazio sufficiente per questo esperimento; il descrittore chiuso ha una voce assente.",
      "n": "Numero di byte richiesti dal buffer COMPUTER, una lettera ASCII per byte. La richiesta interessa il prefisso di questa lunghezza."
    },
    "teoria": [
      "Due programmi possono comunicare attraverso una pipe, un canale nel quale i byte depositati da uno scrittore diventano disponibili a un lettore nello stesso ordine. Il sistema operativo tiene traccia di chi ha aperto le due estremità. Ciascun processo si riferisce alla propria estremità con un piccolo numero, il descrittore, che identifica una voce della sua tabella degli oggetti aperti.",
      "La chiamata write presenta al kernel, la parte del sistema che gestisce il canale, il descrittore di destinazione, l’indirizzo del buffer, cioè la memoria contenente i dati, e la lunghezza richiesta. Il kernel verifica che il descrittore corrisponda a un oggetto aperto per la scrittura prima di trasferire i byte. RAX e RDX sono registri, piccole memorie interne al processore: prima dell’ingresso RAX = 1 seleziona write e RDX indica la quantità richiesta.",
      "Nella traccia il buffer contiene COMPUTER in codice ASCII, nel quale ciascuna lettera della parola occupa un byte. Con quattro byte richiesti e spazio sufficiente nella pipe, vi entrano C, O, M e P, in quest’ordine. Il passaggio al kernel consente al sistema operativo di effettuare il controllo del descrittore e gestire la scrittura nel canale.",
      "Al termine la macchina lascia nel registro RAX il risultato della chiamata diretta. Se il descrittore permette la scrittura, RAX conta i byte consegnati. Se il processo ha già chiuso quel descrittore e la voce è assente, il kernel restituisce −9. Il nome EBADF identifica questo errore e il contenuto del canale resta quello precedente."
    ],
    "introduzione": [
      "Seguire una write dal buffer alla pipe permette di capire come quantità richiesta e validità della destinazione concorrano all’esito. Il buffer è la memoria dei dati; la pipe è un canale che conserva i byte nello stesso ordine. Questa simulazione mostra come il kernel controlli il descrittore, numero dell’oggetto aperto, prima di trasferire il prefisso della lunghezza indicata.",
      "Carica il caso dei quattro byte e segui con «Passo successivo» le lettere evidenziate di COMPUTER fino alla pipe. Confronta il contenuto consegnato con RAX, che al ritorno conta i byte trasferiti. Fissa il caso per confronto e carica la richiesta sul descrittore chiuso: interpreta il valore negativo −9 come EBADF e verifica che il trasferimento resti assente."
    ],
    "esperienze": [
      {
        "titolo": "Quattro byte consegnati alla pipe",
        "parametri": {
          "fd": "ok",
          "n": 4
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Destinazione = Pipe scrivibile; Lunghezza richiesta (B) = 4.",
          "Leggi il passo «Argomenti». Annota RAX = 1; RDX = 4; Buffer = COMPUTER. Prima di avanzare, prevedi il valore finale del campo «RAX» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Risoluzione del descrittore». Annota Stato = scrittura consentita.",
          "Premi «Passo successivo» e fermati su «Esito di write». Annota Byte consegnati = COMP; RAX = 4."
        ],
        "risultato": "Nel passo «Esito di write» il risultato è: Byte consegnati = COMP; RAX = 4.",
        "ragionamento": "RDX = 4 seleziona C, O, M e P, ciascuno lungo un byte in ASCII. La pipe accetta il prefisso COMP e la syscall diretta restituisce in RAX il conteggio 4.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Stato",
            "valore": "scrittura consentita"
          },
          {
            "passo": 2,
            "campo": "Byte consegnati",
            "valore": "COMP"
          },
          {
            "passo": 2,
            "campo": "RAX",
            "valore": "4"
          }
        ]
      },
      {
        "titolo": "Stessa richiesta su descrittore chiuso",
        "parametri": {
          "fd": "bad",
          "n": 4
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Destinazione = Descrittore chiuso; Lunghezza richiesta (B) = 4.",
          "Leggi il passo «Argomenti». Annota RAX = 1; RDX = 4; Buffer = COMPUTER. Prima di avanzare, prevedi il valore finale del campo «RAX» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Risoluzione del descrittore». Annota Stato = voce assente.",
          "Premi «Passo successivo» e fermati su «Esito di write». Annota Byte consegnati = nessuno; RAX = -9."
        ],
        "risultato": "Nel passo «Esito di write» il risultato è: Byte consegnati = nessuno; RAX = -9.",
        "ragionamento": "Il kernel trova assente la voce del descrittore prima del trasferimento. Restituisce −9, codice grezzo EBADF, e i quattro byte richiesti rimangono soltanto nel buffer del chiamante.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Stato",
            "valore": "voce assente"
          },
          {
            "passo": 2,
            "campo": "Byte consegnati",
            "valore": "nessuno"
          },
          {
            "passo": 2,
            "campo": "RAX",
            "valore": "-9"
          }
        ]
      }
    ]
  },
  "4.2.3": {
    "scopo": "Un trasferimento può completare soltanto una parte dei byte richiesti. Calcolerai il nuovo puntatore e il residuo a partire dal conteggio restituito, verificando anche come si conserva lo stato quando la chiamata segnala un errore.",
    "lettura": "Ogni cella della striscia rappresenta un byte del buffer. Il prefisso evidenziato è la parte confermata dal kernel; il puntatore finale indica la prima cella ancora pendente. Leggi RAX insieme ai byte confermati per distinguere il conteggio dall’errore.",
    "conclusione": "L’avanzamento del puntatore e la riduzione della lunghezza descrivono lo stesso progresso. Si aggiornano usando i byte effettivamente confermati; un errore che precede il trasferimento lascia l’intera richiesta da gestire.",
    "controlli": {
      "n": "Lunghezza del buffer da trasferire, in byte, a partire da 0x5000.",
      "cap": "Numero massimo di byte che la destinazione scrivibile può accettare in questo tentativo. Il conteggio positivo è il minore fra capacità e richiesta.",
      "esito": "Scegli una destinazione scrivibile oppure l’errore EBADF. Nel ramo errore la capacità è irrilevante perché il descrittore viene respinto prima del trasferimento."
    },
    "teoria": [
      "Un programma che deve consegnare una sequenza di byte può tenerla in un buffer, una porzione di memoria riservata ai dati in transito. Per chiedere una scrittura comunica al kernel, la parte del sistema operativo che serve la richiesta, l’indirizzo del primo byte e il numero di byte disponibili. L’indirizzo, detto anche puntatore, procede di un’unità ogni volta che si passa al byte successivo.",
      "Una scrittura riuscita può aver trasferito soltanto la parte iniziale del buffer. È il conteggio restituito dalla chiamata a stabilire il punto da cui continuare. Se da 0x5000 si richiedono dodici byte e la destinazione ne accetta cinque, sono partiti i byte agli indirizzi da 0x5000 a 0x5004 compresi. Il successivo si trova a 0x5005 e il residuo è di sette byte. Il prefisso 0x introduce la scrittura in base sedici.",
      "Il registro RAX, una piccola memoria interna al processore, contiene il ritorno della chiamata Linux diretta. Un valore negativo quale −9 designa EBADF, l’errore dovuto a un descrittore invalido. Il descrittore è il numero che identifica l’oggetto aperto dal programma. In quel ramo nessun byte è stato accreditato. Il puntatore e la lunghezza conservano i valori originari finché il programma si occupa della causa dell’errore."
    ],
    "introduzione": [
      "L’obiettivo della simulazione è ricostruire correttamente una richiesta dopo una scrittura parziale. Il puntatore indica il primo byte del buffer, la regione di memoria da trasferire; il residuo conta quelli ancora pendenti. Quando il kernel conferma un prefisso, lo stesso conteggio si aggiunge al puntatore e si sottrae alla lunghezza, mantenendo coerenti posizione e quantità della richiesta successiva.",
      "Carica il caso con dodici byte richiesti e cinque accettati, prevedendo il residuo prima di avanzare con «Passo successivo». Segui le celle confermate fino al nuovo puntatore 0x5005 e confronta il risultato con il ramo EBADF. Cambiando «Capacità disponibile (B)» e applicando i parametri, verifica che l’avanzamento dipenda dai byte confermati, mentre l’errore lasci intatta la richiesta."
    ],
    "esperienze": [
      {
        "titolo": "Dodici byte richiesti, cinque accettati",
        "parametri": {
          "n": 12,
          "cap": 5,
          "esito": "ok"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Byte richiesti = 12; Capacità disponibile (B) = 5; Destinazione = Scrivibile.",
          "Leggi il passo «Richiesta». Annota Puntatore = 0x5000; Lunghezza = 12. Prima di avanzare, prevedi il valore finale del campo «Residuo» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Risposta del kernel». Annota RAX = 5; Byte confermati = 5.",
          "Premi «Passo successivo» e fermati su «Aggiornamento». Annota Primo byte residuo = 0x5005; Residuo = 7."
        ],
        "risultato": "Nel passo «Aggiornamento» il risultato è: Primo byte residuo = 0x5005; Residuo = 7.",
        "ragionamento": "Il conteggio 5 conferma i byte da 0x5000 a 0x5004 inclusi. Per il nuovo tentativo il puntatore diventa 0x5000 + 5 = 0x5005 e la lunghezza scende da 12 a 7 byte.",
        "attesi": [
          {
            "passo": 1,
            "campo": "RAX",
            "valore": "5"
          },
          {
            "passo": 1,
            "campo": "Byte confermati",
            "valore": "5"
          },
          {
            "passo": 2,
            "campo": "Primo byte residuo",
            "valore": "0x5005"
          },
          {
            "passo": 2,
            "campo": "Residuo",
            "valore": "7"
          }
        ]
      },
      {
        "titolo": "Errore prima del trasferimento",
        "parametri": {
          "n": 12,
          "cap": 5,
          "esito": "errore"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Byte richiesti = 12; Capacità disponibile (B) = 5; Destinazione = Errore EBADF.",
          "Leggi il passo «Richiesta». Annota Puntatore = 0x5000; Lunghezza = 12. Prima di avanzare, prevedi il valore finale del campo «Residuo» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Risposta del kernel». Annota RAX = -9; Byte confermati = 0.",
          "Premi «Passo successivo» e fermati su «Aggiornamento». Annota Primo byte residuo = 0x5000; Residuo = 12."
        ],
        "risultato": "Nel passo «Aggiornamento» il risultato è: Primo byte residuo = 0x5000; Residuo = 12.",
        "ragionamento": "RAX = −9 identifica EBADF e conferma zero byte trasferiti. Il puntatore resta 0x5000 e il residuo resta 12: prima di riprovare bisogna risolvere la causa del descrittore invalido.",
        "attesi": [
          {
            "passo": 1,
            "campo": "RAX",
            "valore": "-9"
          },
          {
            "passo": 1,
            "campo": "Byte confermati",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Primo byte residuo",
            "valore": "0x5000"
          },
          {
            "passo": 2,
            "campo": "Residuo",
            "valore": "12"
          }
        ]
      }
    ]
  },
  "4.2.4": {
    "scopo": "Un lettore incontra una pipe vuota mentre uno scrittore potrebbe ancora produrre dati. Confronterai la durata della chiamata bloccante con il ritorno immediato di O_NONBLOCK, seguendo anche il byte che arriva più tardi.",
    "lettura": "Le due linee del tempo distinguono il thread dalla pipe. Il punto sulla linea della pipe segna l’arrivo del byte; la linea del thread mostra la sospensione oppure il ritorno immediato. L’istante di fine chiamata va confrontato con il numero di byte rimasti nel canale.",
    "conclusione": "L’arrivo del dato, il risveglio e l’assegnazione del processore sono eventi distinti. La scelta di attesa riguarda il comportamento della chiamata corrente; un byte arrivato dopo un ritorno immediato resta disponibile per una futura lettura.",
    "controlli": {
      "modo": "La modalità bloccante sospende il lettore fino al dato; O_NONBLOCK restituisce EAGAIN quando la pipe è vuota e conserva il thread eseguibile.",
      "t": "Istante di arrivo del primo byte, in millisecondi dall’inizio della richiesta. Nel percorso bloccante lo scheduler assegna il core un millisecondo dopo tale arrivo."
    },
    "teoria": [
      "Una pipe è un canale che conserva i byte scritti da un processo finché un altro li legge. Se il canale è vuoto e c’è ancora uno scrittore, un nuovo byte può arrivare in futuro. Il lettore deve decidere se aspettarlo nella chiamata read oppure se riprendere subito la propria attività per tentare la lettura in un altro momento.",
      "Nella modalità bloccante il kernel, che gestisce il canale, sospende il thread lettore. Un thread è la sequenza di istruzioni alla quale il processore assegna un turno. Quando arriva un byte, il lettore diventa pronto. Per completare la chiamata occorre poi che lo scheduler, la parte del sistema che assegna i turni, gli conceda il core, cioè un’unità di esecuzione del processore.",
      "Se il byte arriva a 5 millisecondi e l’assegnazione avviene un millisecondo più tardi, read termina a 6 millisecondi. Con l’opzione O_NONBLOCK la chiamata sulla pipe vuota restituisce già all’istante zero l’errore temporaneo EAGAIN, indicato con −11 nell’interfaccia diretta. Il byte che giunge a 5 millisecondi resta nel canale e sarà disponibile per una lettura successiva."
    ],
    "introduzione": [
      "Questa simulazione permette di distinguere l’attesa di un dato dal tempo necessario perché il lettore torni a eseguire. Una pipe vuota conserva i byte che arriveranno; il thread è la sequenza di istruzioni del lettore. Nella modalità bloccante il thread attende il dato e poi il turno assegnato dallo scheduler, mentre O_NONBLOCK conclude immediatamente la richiesta con l’errore temporaneo EAGAIN.",
      "Carica il caso bloccante e segui con «Passo successivo» le due linee del tempo, confrontando arrivo del byte e fine della chiamata. Fissa il risultato, quindi carica il ritorno immediato con EAGAIN. Con arrivo a cinque millisecondi, confronta le conclusioni a sei e a zero millisecondi, osservando anche se il byte venga consumato oppure rimanga disponibile nella pipe."
    ],
    "esperienze": [
      {
        "titolo": "Lettore sospeso fino al primo byte",
        "parametri": {
          "modo": "blocco",
          "t": 5
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Modalità = Bloccante; Arrivo di un byte (ms) = 5.",
          "Leggi il passo «t = 0 ms». Annota Byte presenti = 0; Richiesta = 1. Prima di avanzare, formula la previsione richiesta nel campo «Fine della chiamata (ms)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Esame della coda». Annota Stato = sospeso; Ritorno immediato = in attesa.",
          "Premi «Passo successivo» e fermati su «Arrivo del dato». Annota Arrivo (ms) = 5; Fine della chiamata (ms) = 6; Byte nella pipe alla fine della traccia = 0."
        ],
        "risultato": "Nel passo «Arrivo del dato» il risultato è: Arrivo (ms) = 5; Fine della chiamata (ms) = 6; Byte nella pipe alla fine della traccia = 0.",
        "ragionamento": "Il byte arriva a 5 ms e il thread riceve il processore a 5 + 1 = 6 ms. read consuma quel byte, perciò alla fine della traccia la pipe contiene zero byte.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Stato",
            "valore": "sospeso"
          },
          {
            "passo": 1,
            "campo": "Ritorno immediato",
            "valore": "in attesa"
          },
          {
            "passo": 2,
            "campo": "Arrivo (ms)",
            "valore": "5"
          },
          {
            "passo": 2,
            "campo": "Fine della chiamata (ms)",
            "valore": "6"
          },
          {
            "passo": 2,
            "campo": "Byte nella pipe alla fine della traccia",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Lettura immediata con EAGAIN",
        "parametri": {
          "modo": "subito",
          "t": 5
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Modalità = O_NONBLOCK; Arrivo di un byte (ms) = 5.",
          "Leggi il passo «t = 0 ms». Annota Byte presenti = 0; Richiesta = 1. Prima di avanzare, formula la previsione richiesta nel campo «Fine della chiamata (ms)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Esame della coda». Annota Stato = eseguibile; Ritorno immediato = -11.",
          "Premi «Passo successivo» e fermati su «Arrivo del dato». Annota Arrivo (ms) = 5; Fine della chiamata (ms) = 0; Byte nella pipe alla fine della traccia = 1."
        ],
        "risultato": "Nel passo «Arrivo del dato» il risultato è: Arrivo (ms) = 5; Fine della chiamata (ms) = 0; Byte nella pipe alla fine della traccia = 1.",
        "ragionamento": "Con O_NONBLOCK la chiamata termina a 0 ms con il valore grezzo −11, EAGAIN. Quando il byte arriva a 5 ms la chiamata è già finita: il canale lo conserva e il conteggio finale vale uno.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Stato",
            "valore": "eseguibile"
          },
          {
            "passo": 1,
            "campo": "Ritorno immediato",
            "valore": "-11"
          },
          {
            "passo": 2,
            "campo": "Arrivo (ms)",
            "valore": "5"
          },
          {
            "passo": 2,
            "campo": "Fine della chiamata (ms)",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Byte nella pipe alla fine della traccia",
            "valore": "1"
          }
        ]
      }
    ]
  },
  "4.2.5": {
    "scopo": "Due processi possono presentare la stessa richiesta di apertura e ricevere risposte diverse. Studierai il ruolo dell’identità e dei bit di permesso, tenendo costante il meccanismo di ingresso nel kernel.",
    "lettura": "I tre riquadri indicano proprietario, gruppo e altri utenti. L’evidenziazione seleziona la classe applicabile al richiedente; il bit r di quella classe decide la lettura. La riga finale mostra il descrittore ottenuto oppure EACCES.",
    "conclusione": "Il meccanismo d’ingresso rende disponibile il servizio; la politica di accesso usa identità e permessi per autorizzarlo. Il risultato qui vale per il modello che esclude ACL, appartenenza al gruppo e privilegi speciali.",
    "controlli": {
      "chi": "Identità rispetto al file: proprietario oppure altro utente esterno al gruppo. È questa scelta a selezionare la cifra dei permessi applicabile.",
      "perm": "Modo Unix del file: 0600 concede lettura e scrittura al proprietario; 0644 aggiunge lettura per gruppo e altri. La richiesta simulata è sempre di sola lettura."
    },
    "teoria": [
      "Quando un programma apre un file in lettura, entra nel sistema operativo in un punto prestabilito, che nei processori x86-64 si può raggiungere con l’istruzione SYSCALL. Il kernel, a cui spetta autorizzare l’accesso, conosce sia l’identità del richiedente sia i permessi associati al file. Può così dare esiti diversi a due programmi che presentano la stessa richiesta attraverso la stessa istruzione. Le modalità 0600 e 0644 sono scritte in base otto, indicata dallo zero iniziale: ogni cifra descrive un gruppo di permessi. Nella legenda r significa lettura, w scrittura, x esecuzione e il trattino indica un permesso assente.",
      "Nella scrittura dei permessi Unix, le ultime tre cifre si riferiscono rispettivamente a proprietario, gruppo e altri utenti. Ogni cifra somma i pesi di tre diritti, quattro per leggere, due per scrivere e uno per eseguire. Di conseguenza 0600 concede lettura e scrittura al solo proprietario. Con 0644, anche il gruppo e gli altri utenti dispongono del diritto di lettura.",
      "Nella simulazione l’altro utente è esterno al gruppo e privo di privilegi speciali. Di fronte a 0644 riceve il descrittore fd = 3, cioè il numero della prima voce libera che il modello assume nella tabella degli oggetti aperti dal processo. Di fronte a 0600 l’apertura fallisce con −13; il nome EACCES identifica il rifiuto dovuto ai permessi. Le ACL, liste aggiuntive di controllo degli accessi, sono escluse dai controlli rappresentati."
    ],
    "introduzione": [
      "Verificare perché richieste identiche possano ricevere autorizzazioni diverse è lo scopo dell’attività. Il meccanismo SYSCALL porta nel kernel, mentre la politica di accesso considera identità e permessi del file. Le cifre Unix selezionano i diritti di proprietario, gruppo e altri utenti; il bit di lettura della classe applicabile decide l’apertura nel modello, che esclude privilegi speciali e controlli aggiuntivi.",
      "Carica il proprietario del file 0600 e avanza con «Passo successivo», osservando la classe evidenziata e il bit r. Confronta l’altro utente sullo stesso file, quindi scegli «Permessi» uguale a 0644 e premi «Applica i parametri». Collega il ritorno positivo del descrittore oppure l’errore EACCES alla cifra applicabile, mantenendo distinta l’autorizzazione dall’istruzione usata per entrare nel kernel."
    ],
    "esperienze": [
      {
        "titolo": "Proprietario di un file 0600",
        "parametri": {
          "chi": "owner",
          "perm": "600"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Identità = Proprietario; Permessi = 0600.",
          "Leggi il passo «Richiesta». Annota Meccanismo = SYSCALL; Modalità del file = 600. Prima di avanzare, formula la previsione richiesta nel campo «Ritorno della syscall open» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Politica». Annota Classe = proprietario; Bit lettura = 1.",
          "Premi «Passo successivo» e fermati su «Decisione». Annota Ritorno grezzo = 3; Voce fd creata = sì."
        ],
        "risultato": "Nel passo «Decisione» il risultato è: Ritorno grezzo = 3; Voce fd creata = sì.",
        "ragionamento": "Nel modo 0600 la cifra del proprietario è 6 = 4 + 2, quindi comprende il diritto di lettura di peso 4. Il kernel apre il file e assegna il primo descrittore libero, 3.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Classe",
            "valore": "proprietario"
          },
          {
            "passo": 1,
            "campo": "Bit lettura",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Ritorno grezzo",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "Voce fd creata",
            "valore": "sì"
          }
        ]
      },
      {
        "titolo": "Altro utente sullo stesso file",
        "parametri": {
          "chi": "other",
          "perm": "600"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Identità = Altro utente; Permessi = 0600.",
          "Leggi il passo «Richiesta». Annota Meccanismo = SYSCALL; Modalità del file = 600. Prima di avanzare, formula la previsione richiesta nel campo «Ritorno della syscall open» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Politica». Annota Classe = altri; Bit lettura = 0.",
          "Premi «Passo successivo» e fermati su «Decisione». Annota Ritorno grezzo = -13; Voce fd creata = no."
        ],
        "risultato": "Nel passo «Decisione» il risultato è: Ritorno grezzo = -13; Voce fd creata = no.",
        "ragionamento": "La cifra per gli altri utenti è zero e il bit di lettura risulta assente. Il kernel restituisce −13, EACCES, lasciando invariata la tabella dei descrittori.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Classe",
            "valore": "altri"
          },
          {
            "passo": 1,
            "campo": "Bit lettura",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Ritorno grezzo",
            "valore": "-13"
          },
          {
            "passo": 2,
            "campo": "Voce fd creata",
            "valore": "no"
          }
        ]
      }
    ]
  },
  "4.2.6": {
    "scopo": "Un errore Linux attraversa un’interfaccia di macchina e una di libreria C. Seguirai EBADF dal descrittore chiuso al ritorno grezzo e poi alla coppia formata da valore restituito ed errno.",
    "lettura": "I passaggi «Ritorno grezzo» e «Interfaccia C» appartengono a due livelli diversi. Nel primo il numero 9 è incorporato nel valore −9; nel secondo il ritorno comune −1 è accompagnato da errno che conserva la causa EBADF.",
    "conclusione": "Per interpretare un errore bisogna conoscere l’interfaccia osservata. Il ritorno grezzo codifica direttamente la causa negativa; il wrapper convenzionale comunica il fallimento attraverso −1 e rende la causa disponibile in errno.",
    "teoria": [
      "Un programma scritto nel linguaggio C può chiedere una lettura tramite una funzione della libreria di sistema. Fra quella funzione e il kernel, la parte del sistema operativo che serve la richiesta, interviene una breve routine di raccordo, chiamata wrapper. Essa prepara la chiamata diretta secondo l’ABI, la convenzione che assegna argomenti e risultati ai registri della macchina, e traduce poi il risultato secondo le regole che il programma C si aspetta.",
      "Quando una lettura riesce e consegna tre byte, il conteggio tre può attraversare entrambe le interfacce e arrivare al chiamante. Un errore richiede una traduzione diversa. Su Linux x86-64 il kernel comunica la causa restituendo nel registro della macchina il negativo del suo codice numerico. La libreria C dispone di un valore chiamato errno attraverso il quale riferisce al thread, la sequenza di istruzioni chiamante, la causa del fallimento.",
      "Nel problema una lettura usa un descrittore già chiuso, cioè un numero che ha cessato di identificare un oggetto aperto del programma. Il kernel restituisce −9, valore negativo del codice EBADF. Il wrapper colloca 9, cioè EBADF, in errno e restituisce −1 al chiamante C. Il programma controlla prima il segnale di fallimento e consulta poi errno per conoscere la causa; un valore precedente di errno va interpretato solo quando la funzione segnala effettivamente un errore."
    ],
    "introduzione": [
      "Lo scopo della ricostruzione è seguire lo stesso errore attraverso due interfacce, affinché il valore osservato acquisti il significato corretto. Il kernel Linux codifica EBADF, errore di descrittore invalido, come ritorno grezzo negativo. Il wrapper, la routine di raccordo della libreria C, traduce quel risultato in un segnale di fallimento e conserva la causa nel valore chiamato errno.",
      "Parti dai dati del descrittore chiuso e scrivi la previsione sul ritorno del wrapper. Avanza con «Passo successivo» da «Richiesta» a «Ritorno grezzo» e poi a «Interfaccia C». Confronta −9 con la coppia ritorno −1 ed errno uguale a nove, usando «Precedente» per riconoscere quale componente compia la traduzione e quale informazione rimanga disponibile al chiamante."
    ],
    "procedura": [
      "Leggi i dati iniziali: Una richiesta Linux usa un descrittore chiuso. In questo caso EBADF ha codice 9. Si osservano separatamente il ritorno della syscall e quello del wrapper della libreria C.",
      "Prima di avviare la ricostruzione, scrivi una previsione per questa domanda: Per EBADF quale valore restituisce il wrapper convenzionale?",
      "Premi «Passo successivo» per attraversare «Richiesta», «Ritorno grezzo», «Interfaccia C». A ogni passaggio confronta le quantità indicate con il ragionamento teorico.",
      "Raggiungi l’ultimo fotogramma e confronta la previsione con il risultato. Usa «Precedente» per rileggere il passaggio che determina il valore finale."
    ],
    "risultato": "Per la domanda «Per EBADF quale valore restituisce il wrapper convenzionale?» il valore atteso è −1.",
    "ragionamento": "Il processo usa un descrittore chiuso. Il kernel individua la condizione EBADF. Nell’ABI delle syscall Linux il registro di ritorno contiene il valore negativo del codice di errore. Il wrapper riconosce il codice negativo, imposta errno a EBADF e restituisce −1."
  },
  "4.2.7": {
    "scopo": "Una richiesta espressa come funzione deve essere tradotta nei registri previsti dall’interfaccia Linux x86-64. Preparerai write(7, 0x4080, 96) associando servizio, descrittore, buffer e conteggio ai rispettivi ruoli.",
    "lettura": "Le caselle dei registri si leggono come posizioni della convenzione di chiamata. RAX identifica il servizio, mentre RDI, RSI e RDX rappresentano i primi tre argomenti: confronta ogni valore con la sua posizione nella richiesta write.",
    "conclusione": "La correttezza della chiamata dipende dall’associazione fra valore e registro. Un numero valido collocato nel registro sbagliato cambia la richiesta che il kernel riceve.",
    "teoria": [
      "Un programma che vuole trasferire dati fra memoria e file chiede al sistema operativo di farlo per suo conto. La chiamata di sistema deve indicare il servizio e i suoi argomenti. Un descrittore è il numero con cui il processo identifica un file già aperto. Il buffer è la regione di memoria destinata ai byte letti o scritti.",
      "L’ABI nativa Linux x86-64 è la convenzione che assegna a ciascun registro, una piccola memoria interna al processore, il ruolo di selettore o argomento. RAX contiene inizialmente il numero del servizio. Per read e write, RDI contiene il descrittore, RSI l’indirizzo del buffer e RDX il conteggio. SYSCALL è l’istruzione che trasferisce il controllo al kernel, la parte del sistema operativo che interpreta i registri ed esegue la richiesta.",
      "La richiesta iniziale è write(7, 0x4080, 96). Il numero del servizio, uno, va in RAX; il descrittore 7 va in RDI, il puntatore 0x4080 in RSI e il conteggio 96 in RDX. Se si scambiassero puntatore e conteggio, il kernel riceverebbe un buffer all’indirizzo 96 e una lunghezza uguale al valore numerico 0x4080. Confrontare ruolo e contenuto di ciascun registro permette di riconoscere questo errore prima dell’ingresso. Il prefisso 0x introduce gli indirizzi in base sedici; B indica byte."
    ],
    "introduzione": [
      "Preparare una chiamata nei registri serve a verificare che il kernel riceva ogni valore nel ruolo previsto. L’ABI, la convenzione dell’interfaccia Linux x86-64, assegna a RAX il numero del servizio e a RDI, RSI e RDX descrittore, indirizzo del buffer e conteggio. Nell’esercitazione confronterai la forma della richiesta write con il banco registri immediatamente prima di SYSCALL.",
      "Premi «Carica l’esempio guidato» per partire da write(7, 0x4080, 96), inserisci la previsione di RAX e premi «Registra la previsione». Avanza con «Passo successivo», associando ogni registro al rispettivo argomento. Confronta il selettore uno con il descrittore sette e il conteggio novantasei: la verifica distingue il servizio richiesto dai suoi dati e mostra il ruolo del puntatore conservato in RSI."
    ],
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 1 «Preparare i registri della chiamata», traccia 1. La spiegazione seguente si riferisce a questi dati.",
      "Leggi la consegna: Linux x86-64, ABI nativa. Prepara write(7, 0x4080, 96). Indica RAX, RDI e RDX immediatamente prima di SYSCALL.",
      "Calcola il primo campo «RAX» e premi «Registra la previsione» per avviare la ricostruzione. Il riscontro permette di confrontare il tuo risultato con i passaggi successivi.",
      "Segui la ricostruzione fino alla verifica dei campi; con «Apri la prova completa» puoi inserire tutte le risposte. Cambiando esercizio o traccia, rileggi la nuova consegna e usa i relativi dati."
    ],
    "risultato": "Nell’esercizio 1, traccia 1, si ottiene: RAX = 1; RDI = 7; RDX = 96.",
    "ragionamento": "Il servizio write ha numero 1, che va in RAX. Il primo argomento è il descrittore 7 in RDI. RSI riceve il puntatore 0x4080. RDX contiene il terzo argomento, 96 B. Al ritorno RAX conterrà il conteggio dei byte trasferiti oppure un codice di errore."
  },
  "4.2.8": {
    "scopo": "Una scrittura di trenta byte si conclude dopo averne consegnati dodici. Ricostruirai la richiesta residua usando lo stesso progresso per aggiornare sia il puntatore sia la lunghezza.",
    "lettura": "Nella sequenza del buffer il prefisso trasferito precede il primo byte pendente. Confronta il conteggio restituito con la distanza fra puntatore iniziale e successivo; la somma di confermati e residui ricostruisce la richiesta originaria.",
    "conclusione": "Riprendere un trasferimento parziale significa avanzare esattamente dei byte confermati. Usare la dimensione richiesta al posto del risultato salterebbe una parte del buffer.",
    "teoria": [
      "Il buffer è la regione di memoria che contiene i byte della richiesta; il puntatore ne indica l’indirizzo iniziale. Ogni byte confermato fa avanzare di una posizione il primo indirizzo ancora da inviare. Quando un programma trasferisce dati fra memoria e file, la dimensione richiesta indica quanti byte vorrebbe trasferire in quel tentativo. Il sistema può completarne soltanto una parte. Il programma ha quindi bisogno sia dell’indirizzo del primo byte ancora da trattare sia della quantità che resta.",
      "Un ritorno positivo conta i byte già trasferiti. Per una scrittura parziale tale numero serve a individuare la prima posizione del buffer che deve ancora essere inviata. Su un file regolare, un ritorno zero dopo una richiesta di lettura di lunghezza positiva indica il raggiungimento della fine del file, spesso indicata con la sigla EOF. Il conteggio complessivo conserva perciò i byte ricevuti dalle letture precedenti.",
      "Nel caso guidato il programma chiede trenta byte a partire da 0x5000 e la scrittura ne conferma dodici. I byte già trasferiti occupavano le posizioni da 0x5000 a 0x500B incluse. La richiesta successiva parte quindi da 0x500C e riguarda 30 − 12 = 18 byte. Sommare dodici al puntatore e sottrarre dodici al conteggio descrive lo stesso avanzamento da due punti di vista. Gli indirizzi con prefisso 0x sono in base sedici: dodici si scrive C, perciò aggiungere dodici byte a 0x5000 produce 0x500C, pari a 20492 in decimale."
    ],
    "introduzione": [
      "La ricostruzione serve a controllare entrambi i dati necessari per proseguire una write parziale: l’indirizzo del primo byte pendente e la lunghezza residua. Il buffer contiene la sequenza da inviare e il ritorno positivo conta il prefisso già consegnato. Sommare questo conteggio all’indirizzo iniziale e sottrarlo alla richiesta descrive il medesimo progresso, evitando ripetizioni o salti di dati.",
      "Carica l’esempio guidato sui trenta byte richiesti e i dodici confermati, quindi calcola il residuo prima di avanzare. Con «Passo successivo» segui l’aggiornamento fino a diciotto byte e al puntatore 0x500C. Confronta il risultato con la posizione dell’ultimo byte già trasferito; tornando con «Precedente», verifica che il nuovo indirizzo segua esattamente quel prefisso e che confermati e residui ricostruiscano trenta."
    ],
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 4 «Contabilizzare progresso ed EOF», traccia 1. La spiegazione seguente si riferisce a questi dati.",
      "Leggi la consegna: Un programma scrive 30 B a partire da 0x5000. La syscall restituisce 12. Calcola la lunghezza e il puntatore per riprendere dal primo byte ancora pendente.",
      "Ricostruisci il primo campo «Byte residui» prima di leggere lo svolgimento. Avanza con «Passo successivo» e controlla i dati impiegati in ciascuna operazione.",
      "Segui la ricostruzione fino alla verifica dei campi; con «Apri la prova completa» puoi inserire tutte le risposte. Cambiando esercizio o traccia, rileggi la nuova consegna e usa i relativi dati."
    ],
    "risultato": "Nell’esercizio 4, traccia 1, si ottiene: Byte residui = 18; Puntatore seguente = 20492.",
    "ragionamento": "Il kernel ha accettato i primi dodici byte. Restano 30 − 12 = 18 B. Il prossimo byte si trova a 0x5000 + 12 = 0x500C. La nuova chiamata usa quel puntatore e lunghezza 18."
  },
  "4.3.1": {
    "scopo": "Un campione diventa leggibile soltanto quando il controller conclude la conversione. Seguirai comando, controllo di disponibilità e prelievo del dato, confrontando una visita anticipata con una visita tardiva del driver.",
    "lettura": "I tre riquadri mostrano COMMAND, il bit READY del registro di stato e DATA; il punto sulla linea temporale indica il ciclo in cui interviene il driver. DATA compare al prelievo, mentre READY descrive la disponibilità prima o dopo il consumo. Il valore zero finale di READY indica che il campione è stato consumato.",
    "conclusione": "La lettura dello stato stabilisce quando il dato può essere prelevato. Un’interrogazione anticipata richiede attesa, mentre una tardiva aggiunge ritardo alla disponibilità già raggiunta dal dispositivo.",
    "controlli": {
      "t": "Ciclo della prima interrogazione dopo START al ciclo zero. Il campione diventa pronto al ciclo 4; una visita precedente conduce all’attesa fino a quel ciclo.",
      "d": "Valore acquisito dal sensore, fra 0 e 255. Il registro DATA lo mostra in esadecimale dopo la lettura riuscita."
    },
    "teoria": [
      "Un sensore impiega un certo tempo per convertire una grandezza fisica in un numero. Fra il sensore e il processore si trova il controller, il circuito che avvia la conversione e conserva il risultato. Il programma del sistema operativo incaricato di comandarlo, detto driver, comunica con il circuito attraverso piccole posizioni di lettura e scrittura chiamate registri del dispositivo. Il ciclo conta qui un intervallo dell’orologio del dispositivo; una durata in secondi richiederebbe anche di conoscerne il periodo. Il valore DATA = 0x41 è scritto in base sedici e vale 4 × 16 + 1 = 65 in decimale.",
      "I registri del dispositivo hanno compiti distinti. Scrivendo START nel registro COMMAND il driver avvia una conversione. Nel registro di stato, il bit READY vale zero durante l’acquisizione e passa a uno quando il numero è disponibile in DATA. Un bit è una cifra che assume soltanto due valori. Qui indica se il campione si può già leggere.",
      "La conversione avviata al ciclo zero termina al ciclo quattro del dispositivo. Se il driver interroga lo stato al ciclo due, deve attendere il quarto per ottenere il dato. Se si presenta al ciclo sei, il campione è già disponibile e viene letto in quel momento. Qui la lettura consuma il campione, perciò READY torna a zero anche quando il numero letto da DATA è diverso da zero."
    ],
    "introduzione": [
      "Lo scopo dell’esperimento è riconoscere quando un dato del dispositivo possa essere letto e perché una lettura dello stato preceda il prelievo. Il controller avvia la conversione con COMMAND, ne segnala il completamento con READY e conserva il campione in DATA. Il driver, il programma che governa la periferica, deve coordinare i propri accessi con questa sequenza temporale.",
      "Carica l’interrogazione al ciclo due e avanza con «Passo successivo», osservando l’attesa fino al ciclo quattro. Confronta poi l’interrogazione al ciclo sei, quando il campione è già pronto. Leggi insieme «Ciclo della lettura», DATA e «READY finale»: il campione sessantacinque appare come 0x41, mentre READY torna a zero perché la lettura consuma il dato disponibile."
    ],
    "esperienze": [
      {
        "titolo": "Interrogazione prima del completamento",
        "parametri": {
          "t": 2,
          "d": 65
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Prima interrogazione (ciclo) = 2; Campione acquisito = 65.",
          "Leggi il passo «Scrittura di comando». Annota COMMAND = START; READY = 0. Prima di avanzare, formula la previsione richiesta nel campo «Ciclo della lettura» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Prima lettura di stato». Annota Ciclo = 2; READY = 0; Azione = attendi il ciclo 4.",
          "Premi «Passo successivo» e fermati su «Consumo del risultato». Annota Ciclo della lettura = 4; DATA = 0x41; READY finale = 0."
        ],
        "risultato": "Nel passo «Consumo del risultato» il risultato è: Ciclo della lettura = 4; DATA = 0x41; READY finale = 0.",
        "ragionamento": "Al ciclo 2 la conversione è ancora in corso, quindi READY vale zero. La lettura avviene al ciclo 4 e restituisce 65 decimale, ossia 0x41; il consumo riporta READY a zero.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Ciclo",
            "valore": "2"
          },
          {
            "passo": 1,
            "campo": "READY",
            "valore": "0"
          },
          {
            "passo": 1,
            "campo": "Azione",
            "valore": "attendi il ciclo 4"
          },
          {
            "passo": 2,
            "campo": "Ciclo della lettura",
            "valore": "4"
          },
          {
            "passo": 2,
            "campo": "DATA",
            "valore": "0x41"
          },
          {
            "passo": 2,
            "campo": "READY finale",
            "valore": "0"
          }
        ]
      },
      {
        "titolo": "Interrogazione dopo il completamento",
        "parametri": {
          "t": 6,
          "d": 65
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Prima interrogazione (ciclo) = 6; Campione acquisito = 65.",
          "Leggi il passo «Scrittura di comando». Annota COMMAND = START; READY = 0. Prima di avanzare, formula la previsione richiesta nel campo «Ciclo della lettura» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Prima lettura di stato». Annota Ciclo = 6; READY = 1; Azione = leggi DATA.",
          "Premi «Passo successivo» e fermati su «Consumo del risultato». Annota Ciclo della lettura = 6; DATA = 0x41; READY finale = 0."
        ],
        "risultato": "Nel passo «Consumo del risultato» il risultato è: Ciclo della lettura = 6; DATA = 0x41; READY finale = 0.",
        "ragionamento": "Al ciclo 6 la conversione conclusa al ciclo 4 ha già lasciato READY a uno. Il driver legge subito 0x41 al ciclo 6, avendo aggiunto due cicli di ritardo rispetto alla prima disponibilità.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Ciclo",
            "valore": "6"
          },
          {
            "passo": 1,
            "campo": "READY",
            "valore": "1"
          },
          {
            "passo": 1,
            "campo": "Azione",
            "valore": "leggi DATA"
          },
          {
            "passo": 2,
            "campo": "Ciclo della lettura",
            "valore": "6"
          },
          {
            "passo": 2,
            "campo": "DATA",
            "valore": "0x41"
          },
          {
            "passo": 2,
            "campo": "READY finale",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "4.3.2": {
    "scopo": "Un evento può essere scoperto mediante controlli periodici oppure mediante una notifica del dispositivo. Misurerai separatamente il ritardo di riconoscimento e il lavoro della CPU, riducendo il periodo del polling sullo stesso evento.",
    "lettura": "Le tre linee condividono la scala temporale: evento, polling e IRQ. Ogni punto sulla linea del polling è una lettura dello stato; il punto finale individua la prima lettura utile. I conteggi dei cicli CPU affiancano la cronologia e misurano un costo diverso dalla durata in microsecondi.",
    "conclusione": "Un polling più frequente può ridurre il ritardo di scoperta aumentando il numero di letture. Il confronto con gli interrupt va condotto sia sui tempi sia sui costi di servizio previsti per il dispositivo.",
    "controlli": {
      "t": "Istante dell’evento, in microsecondi. Il dispositivo mantiene lo stato pronto fino alla prima osservazione.",
      "p": "Intervallo fra due letture di stato, in microsecondi. La prima lettura avviene dopo un periodo; ciascuna costa quattro cicli CPU."
    },
    "teoria": [
      "La CPU è il processore che esegue il driver. Un ciclo CPU è un intervallo del suo orologio, mentre un microsecondo, indicato con µs, è un milionesimo di secondo. IRQ significa richiesta di interruzione: è la segnalazione con cui il dispositivo chiede attenzione. Per accorgersi che un dispositivo ha terminato il lavoro, il processore può interrogare periodicamente un registro di stato. Questa tecnica prende il nome di polling. Fra due interrogazioni il dispositivo può completare l’operazione e conservare l’indicazione di disponibilità. Il tempo che separa il completamento dalla scoperta dipende perciò dalla posizione dell’evento rispetto ai controlli.",
      "Se il periodo è di 8 microsecondi (µs), il driver, cioè il programma che gestisce il dispositivo, interroga il registro agli istanti 8, 16 e 24. Un evento sopraggiunto a 19 µs viene scoperto al terzo controllo, con un ritardo di 5 µs. Poiché ogni controllo occupa il processore per quattro cicli, la ricerca ha richiesto dodici cicli di lavoro.",
      "Un interrupt segue la direzione opposta. Il dispositivo avvisa il processore quando l’evento si è verificato. Nella configurazione proposta la consegna richiede 2 µs e il servizio costa 24 cicli di processore. Le due colonne della simulazione permettono così di distinguere la rapidità con cui si riconosce l’evento dal lavoro che quel riconoscimento impone alla CPU. I costi in cicli e i ritardi in microsecondi sono parametri distinti del modello: convertirli l’uno nell’altro richiederebbe la frequenza della CPU. Il confronto separa quindi il lavoro richiesto al processore dalla rapidità con cui l’evento viene osservato."
    ],
    "introduzione": [
      "La simulazione serve a confrontare due modi di scoprire il completamento di un dispositivo: polling, cioè letture periodiche dello stato, e interrupt, cioè una notifica inviata dalla periferica. Osserverai separatamente ritardo di riconoscimento e lavoro della CPU. Un periodo di polling più breve può anticipare la scoperta aumentando le letture, mentre i costi in cicli e i tempi in microsecondi restano grandezze distinte.",
      "Carica il polling ogni otto microsecondi e individua il primo controllo successivo all’evento a diciannove. Avanza fino al confronto con l’interrupt, annotando ritardo e cicli CPU. Dopo «Fissa per confronto», carica il periodo di quattro microsecondi: confronta i cinque controlli con i tre precedenti e spiega come il ritardo diminuisca mentre il lavoro richiesto al processore aumenta."
    ],
    "esperienze": [
      {
        "titolo": "Polling ogni otto microsecondi",
        "parametri": {
          "t": 19,
          "p": 8
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Arrivo (µs) = 19; Periodo di polling (µs) = 8.",
          "Leggi il passo «Evento memorizzato». Annota Evento (µs) = 19; Periodo (µs) = 8. Prima di avanzare, formula la previsione richiesta nel campo «Ritardo del polling (µs)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Polling». Annota Controlli = 3; Ritardo (µs) = 5; Cicli CPU = 12.",
          "Premi «Passo successivo» e fermati su «Interrupt». Annota Riconoscimento (µs) = 21; Cicli CPU = 24."
        ],
        "risultato": "Nel passo «Interrupt» il risultato è: Riconoscimento (µs) = 21; Cicli CPU = 24.",
        "ragionamento": "I controlli a 8 e 16 µs precedono l’evento a 19 µs; quello a 24 µs lo scopre. Si spendono 3 × 4 = 12 cicli CPU con ritardo 5 µs; l’interrupt giunge a 21 µs con costo 24 cicli.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Controlli",
            "valore": "3"
          },
          {
            "passo": 1,
            "campo": "Ritardo (µs)",
            "valore": "5"
          },
          {
            "passo": 1,
            "campo": "Cicli CPU",
            "valore": "12"
          },
          {
            "passo": 2,
            "campo": "Riconoscimento (µs)",
            "valore": "21"
          },
          {
            "passo": 2,
            "campo": "Cicli CPU",
            "valore": "24"
          }
        ]
      },
      {
        "titolo": "Polling più fitto sullo stesso evento",
        "parametri": {
          "t": 19,
          "p": 4
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Arrivo (µs) = 19; Periodo di polling (µs) = 4.",
          "Leggi il passo «Evento memorizzato». Annota Evento (µs) = 19; Periodo (µs) = 4. Prima di avanzare, formula la previsione richiesta nel campo «Ritardo del polling (µs)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Polling». Annota Controlli = 5; Ritardo (µs) = 1; Cicli CPU = 20.",
          "Premi «Passo successivo» e fermati su «Interrupt». Annota Riconoscimento (µs) = 21; Cicli CPU = 24."
        ],
        "risultato": "Nel passo «Interrupt» il risultato è: Riconoscimento (µs) = 21; Cicli CPU = 24.",
        "ragionamento": "Con periodo 4 µs, il primo controllo utile cade a 20 µs ed è il quinto: il ritardo scende a 1 µs e il costo sale a 5 × 4 = 20 cicli. Il percorso interrupt resta a 21 µs e 24 cicli perché i suoi parametri sono invariati.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Controlli",
            "valore": "5"
          },
          {
            "passo": 1,
            "campo": "Ritardo (µs)",
            "valore": "1"
          },
          {
            "passo": 1,
            "campo": "Cicli CPU",
            "valore": "20"
          },
          {
            "passo": 2,
            "campo": "Riconoscimento (µs)",
            "valore": "21"
          },
          {
            "passo": 2,
            "campo": "Cicli CPU",
            "valore": "24"
          }
        ]
      }
    ]
  },
  "4.3.3": {
    "scopo": "Un interrupt sensibile al livello rimane richiesto finché la periferica mantiene attiva la causa. Seguirai la richiesta fino al core e confronterai due ordini di conferma, per capire perché EOI può essere seguito da una nuova consegna.",
    "lettura": "I tre riquadri separano dispositivo, controller e core. Le frecce superiori seguono la richiesta, quella inferiore riporta EOI al controller. Lo stato IRQ alta o bassa nel dispositivo va letto prima della conferma, perché stabilisce se la causa continua a essere segnalata.",
    "conclusione": "Terminare il servizio nel controller e rimuovere la causa nella periferica sono azioni distinte. Il protocollo del dispositivo determina l’intervento necessario a far cessare la richiesta prima della successiva consegna.",
    "controlli": {
      "q": "Numero della linea IRQ. Il controller simulato la associa al vettore 32 + linea; la CPU usa poi descrittori IDT da 16 byte.",
      "ack": "Ordine delle azioni del driver. Si può liberare prima la causa oppure inviare EOI lasciando ancora attiva la linea del dispositivo."
    },
    "teoria": [
      "Un core è un’unità del processore capace di eseguire istruzioni. Il gestore dell’interrupt è il programma avviato per servire l’evento; il driver è il codice del sistema operativo che conosce il protocollo della periferica. Una periferica che ha bisogno di servizio può mantenere attiva una linea elettrica. La sigla IRQ indica la richiesta di interruzione. Il controller degli interrupt riceve il segnale e lo associa a un numero, il vettore, che la CPU usa per raggiungere il codice del gestore. In questa configurazione alla linea 1 corrisponde il vettore 33, perché ai dispositivi sono stati assegnati i vettori a partire da 32.",
      "Il processore trova il gestore attraverso una tabella, la IDT, le cui voci occupano sedici byte. La voce del vettore 33 comincia dunque 528 byte dopo la base della tabella. Quel passaggio conduce all’istruzione da eseguire per assistere il dispositivo. La periferica, nel frattempo, mantiene attiva la linea finché persiste la condizione che ha generato la richiesta.",
      "Il gestore ha due interlocutori. Deve rimuovere la causa nel dispositivo e deve comunicare al controller che il servizio è terminato, inviando EOI, abbreviazione di End of Interrupt. Se riceve EOI mentre la linea è ancora attiva, il controller può presentare la medesima richiesta una seconda volta. L’ordine dei due interventi spiega la possibile riconsegna visibile nella figura."
    ],
    "introduzione": [
      "Seguire una richiesta dal dispositivo al core serve a distinguere instradamento e conclusione del servizio. La linea IRQ identifica la sorgente e il vettore seleziona la porta nella IDT, tabella dei gestori. EOI è la conferma inviata al controller al termine dell’intervento; per una richiesta sensibile al livello, la causa nella periferica può continuare a mantenere attiva la linea.",
      "Carica «Causa liberata prima di EOI» e segui con «Passo successivo» la linea uno, il vettore trentatré e l’offset della IDT. Confronta poi il caso con EOI anticipato, osservando lo stato del dispositivo quando la conferma raggiunge il controller. La diversa possibilità di riconsegna va spiegata attraverso la causa ancora attiva, pur con lo stesso instradamento iniziale."
    ],
    "esperienze": [
      {
        "titolo": "Causa liberata prima di EOI",
        "parametri": {
          "q": 1,
          "ack": "prima"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Linea IRQ = 1; Ordine delle operazioni = Libera la causa, poi EOI.",
          "Leggi il passo «Instradamento». Annota Linea = 1; Vettore = 33. Prima di avanzare, prevedi il valore finale del campo «Possibile riconsegna» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Ingresso nel core». Annota Offset nella IDT (B) = 528; Linea = attiva.",
          "Premi «Passo successivo» e fermati su «Conferma». Annota Causa attiva a EOI = no; Possibile riconsegna = no."
        ],
        "risultato": "Nel passo «Conferma» il risultato è: Causa attiva a EOI = no; Possibile riconsegna = no.",
        "ragionamento": "La linea 1 produce il vettore 33 e l’offset IDT 33 × 16 = 528 byte. Liberando prima la causa, la linea è bassa quando arriva EOI e questo livello attivo cessa di richiedere un nuovo servizio.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Offset nella IDT (B)",
            "valore": "528"
          },
          {
            "passo": 1,
            "campo": "Linea",
            "valore": "attiva"
          },
          {
            "passo": 2,
            "campo": "Causa attiva a EOI",
            "valore": "no"
          },
          {
            "passo": 2,
            "campo": "Possibile riconsegna",
            "valore": "no"
          }
        ]
      },
      {
        "titolo": "EOI con linea ancora attiva",
        "parametri": {
          "q": 1,
          "ack": "dopo"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Linea IRQ = 1; Ordine delle operazioni = EOI con causa ancora attiva.",
          "Leggi il passo «Instradamento». Annota Linea = 1; Vettore = 33. Prima di avanzare, prevedi il valore finale del campo «Possibile riconsegna» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Ingresso nel core». Annota Offset nella IDT (B) = 528; Linea = attiva.",
          "Premi «Passo successivo» e fermati su «Conferma». Annota Causa attiva a EOI = sì; Possibile riconsegna = sì."
        ],
        "risultato": "Nel passo «Conferma» il risultato è: Causa attiva a EOI = sì; Possibile riconsegna = sì.",
        "ragionamento": "Vettore e offset restano 33 e 528, perché l’instradamento è identico. EOI libera lo stato in servizio nel controller mentre la linea resta alta: il controller può quindi consegnare nuovamente la richiesta.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Offset nella IDT (B)",
            "valore": "528"
          },
          {
            "passo": 1,
            "campo": "Linea",
            "valore": "attiva"
          },
          {
            "passo": 2,
            "campo": "Causa attiva a EOI",
            "valore": "sì"
          },
          {
            "passo": 2,
            "campo": "Possibile riconsegna",
            "valore": "sì"
          }
        ]
      }
    ]
  },
  "4.3.4": {
    "scopo": "Un driver deve sia smaltire una coda sia riconoscere correttamente i flag del dispositivo. Calcolerai il costo dei gruppi di campioni e confronterai due scritture sul registro W1C, nel quale ogni uno scritto cancella il flag corrispondente.",
    "lettura": "La striscia superiore divide i campioni in gruppi, alternando i colori per distinguerli. I conteggi riportano ingressi e cicli CPU. Nell’ultimo passo, le due caselle ERROR e READY mostrano il risultato della maschera scritta su STATUS: un flag rimasto a uno resta visibile al driver. La fila raffigura al massimo i primi ventiquattro campioni: con venticinque campioni il venticinquesimo appartiene a un settimo gruppo, contato nei risultati anche quando resta oltre la porzione disegnata.",
    "conclusione": "Il raggruppamento distribuisce il costo fisso degli ingressi su più campioni. La gestione dello stato richiede inoltre la semantica del registro: in un registro W1C riscrivere un uno significa riconoscere e cancellare proprio quel flag.",
    "controlli": {
      "n": "Campioni complessivi accodati, ciascuno da leggere con costo di tre cicli CPU.",
      "b": "Numero massimo di campioni per notifica. Anche il gruppo residuo genera un interrupt; ciascun ingresso costa quaranta cicli.",
      "ack": "Maschera scritta sul registro W1C STATUS, inizialmente 0x05. 0x01 cancella READY, 0x04 cancella ERROR, 0x05 cancella entrambi; gli zeri lasciano invariati i rispettivi flag."
    },
    "teoria": [
      "Quando un dispositivo raccoglie in coda molti campioni, può avvisare la CPU, il processore, una volta per gruppo. Il driver è il programma del sistema operativo che serve la periferica: ogni ingresso nella routine di servizio ha un costo fisso, mentre la lettura dei dati richiede lavoro per ciascun campione. Con venticinque campioni riuniti a quattro a quattro si formano sei gruppi completi e uno residuo. Qui anche il residuo provoca un interrupt, cioè una richiesta di servizio; i cicli CPU misurano il lavoro necessario a servirli.",
      "Nel modello sette ingressi costano 7 × 40 cicli di processore. Le venticinque letture richiedono altri 25 × 3 cicli, per un totale di 355. Aumentando la dimensione dei gruppi, il lavoro necessario a leggere ogni campione resta uguale e il costo degli ingressi si distribuisce su più dati.",
      "Il registro STATUS riunisce flag, cioè bit di stato ciascuno uguale a zero oppure uno. READY occupa il bit di peso uno ed ERROR quello di peso quattro. Quando entrambi sono attivi si legge 0x05, scritto in base sedici e pari a cinque. Il protocollo cancella ciascun flag al quale si scrive uno. Scrivendo 0x01 si riconosce quindi READY e resta 0x04, che permetterà al driver di occuparsi dell’errore.",
      "La sigla W1C significa write one to clear, ossia scrivere uno per cancellare. Il dato scritto è una maschera di riconoscimento: lo zero in una posizione lascia il flag com’era. Se si legge 0x05 e si azzera il bit READY nel valore da scrivere, si prepara 0x04: la successiva scrittura cancella ERROR e mantiene READY attivo. È infatti il bit a uno della maschera a ricevere il riconoscimento."
    ],
    "introduzione": [
      "L’attività serve a collegare il costo del servizio di una coda alle regole del registro di stato. Raggruppare campioni distribuisce il costo fisso di ogni interrupt su più dati, includendo il gruppo residuo. Nel registro W1C, abbreviazione di «scrivere uno per cancellare», la maschera scritta riconosce invece soltanto i flag nelle posizioni a uno, lasciando gli altri disponibili.",
      "Carica i venticinque campioni in gruppi da quattro e avanza con «Passo successivo», contando anche il settimo gruppo oltre i primi ventiquattro campioni disegnati. Confronta poi le scritture 0x01 e 0x04 su STATUS: i cicli restano uguali, mentre cambiano READY ed ERROR. Variando «Campioni per interrupt» e applicando i parametri, attribuisci la variazione del costo ai soli ingressi."
    ],
    "esperienze": [
      {
        "titolo": "Riconoscere soltanto READY",
        "parametri": {
          "n": 25,
          "b": 4,
          "ack": "1"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Campioni = 25; Campioni per interrupt = 4; Scrittura su STATUS dopo la lettura del gruppo = 0x01 · riconosci READY.",
          "Leggi il passo «Accodamento». Annota Campioni = 25; Soglia = 4. Prima di avanzare, formula la previsione richiesta nel campo «STATUS dopo la scrittura» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Notifica al driver». Annota Interrupt = 7; Cicli fissi = 280.",
          "Premi «Passo successivo» e fermati su «Lettura delle voci». Annota Cicli per i dati = 75; Cicli complessivi = 355; Cicli per campione = 14.2.",
          "Premi «Passo successivo» e fermati su «Riconoscimento dei flag». Annota Maschera scritta = 0x1; STATUS dopo la scrittura = 0x4; READY = 0; ERROR = 1."
        ],
        "risultato": "Nel passo «Riconoscimento dei flag» il risultato è: Maschera scritta = 0x1; STATUS dopo la scrittura = 0x4; READY = 0; ERROR = 1.",
        "ragionamento": "Venticinque campioni formano sette gruppi da al massimo quattro: 7 × 40 + 25 × 3 = 355 cicli. STATUS iniziale 0x05 ha i bit READY ed ERROR attivi; scrivere 0x01 cancella solo READY e lascia 0x04.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Cicli per i dati",
            "valore": "75"
          },
          {
            "passo": 2,
            "campo": "Cicli complessivi",
            "valore": "355"
          },
          {
            "passo": 2,
            "campo": "Cicli per campione",
            "valore": "14.2"
          },
          {
            "passo": 3,
            "campo": "Maschera scritta",
            "valore": "0x1"
          },
          {
            "passo": 3,
            "campo": "STATUS dopo la scrittura",
            "valore": "0x4"
          },
          {
            "passo": 3,
            "campo": "READY",
            "valore": "0"
          },
          {
            "passo": 3,
            "campo": "ERROR",
            "valore": "1"
          }
        ]
      },
      {
        "titolo": "Riscrivere il bit ERROR",
        "parametri": {
          "n": 25,
          "b": 4,
          "ack": "4"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Campioni = 25; Campioni per interrupt = 4; Scrittura su STATUS dopo la lettura del gruppo = 0x04 · riscrivi il valore letto dopo aver tolto READY.",
          "Leggi il passo «Accodamento». Annota Campioni = 25; Soglia = 4. Prima di avanzare, formula la previsione richiesta nel campo «STATUS dopo la scrittura» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Notifica al driver». Annota Interrupt = 7; Cicli fissi = 280.",
          "Premi «Passo successivo» e fermati su «Lettura delle voci». Annota Cicli per i dati = 75; Cicli complessivi = 355; Cicli per campione = 14.2.",
          "Premi «Passo successivo» e fermati su «Riconoscimento dei flag». Annota Maschera scritta = 0x4; STATUS dopo la scrittura = 0x1; READY = 1; ERROR = 0."
        ],
        "risultato": "Nel passo «Riconoscimento dei flag» il risultato è: Maschera scritta = 0x4; STATUS dopo la scrittura = 0x1; READY = 1; ERROR = 0.",
        "ragionamento": "La coda è identica e richiede ancora 355 cicli. La maschera 0x04 contiene uno nella posizione ERROR: la scrittura cancella quell’errore e conserva READY, perciò STATUS diventa 0x01; trattare W1C come una variabile ordinaria produce questo riconoscimento indesiderato.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Cicli per i dati",
            "valore": "75"
          },
          {
            "passo": 2,
            "campo": "Cicli complessivi",
            "valore": "355"
          },
          {
            "passo": 2,
            "campo": "Cicli per campione",
            "valore": "14.2"
          },
          {
            "passo": 3,
            "campo": "Maschera scritta",
            "valore": "0x4"
          },
          {
            "passo": 3,
            "campo": "STATUS dopo la scrittura",
            "valore": "0x1"
          },
          {
            "passo": 3,
            "campo": "READY",
            "valore": "1"
          },
          {
            "passo": 3,
            "campo": "ERROR",
            "valore": "0"
          }
        ]
      }
    ]
  },
  "4.3.5": {
    "scopo": "Un evento a due millisecondi viene osservato da un controllo eseguito ogni dieci microsecondi. Calcolerai il numero della prima interrogazione utile, prestando attenzione all’unità di tempo e alla posizione del primo controllo.",
    "lettura": "La cronologia associa a ogni numero d’interrogazione il suo istante. Il controllo 199 è ancora precedente a READY; il successivo coincide con l’attivazione. La convenzione del problema rende il flag già visibile quando i due istanti coincidono.",
    "conclusione": "Per contare le interrogazioni servono periodo, istante iniziale e regola sul confine di coincidenza. Convertire prima tutti i tempi nella stessa unità rende il rapporto direttamente interpretabile come numero di controlli.",
    "teoria": [
      "Quando una periferica termina un’operazione, può segnalarlo ponendo a uno un bit di stato chiamato READY. Un programma che legge quel bit a intervalli regolari usa il polling. Per ricostruire il momento della scoperta servono tre elementi distinti, l’istante di completamento, la distanza temporale fra due letture e il momento in cui si compie la prima.",
      "Il dispositivo del problema termina a due millisecondi, cioè duemila microsecondi. Il driver controlla ogni dieci microsecondi, cominciando all’istante dieci. La lettura numero 199 cade a 1990 microsecondi e trova il lavoro ancora in corso; la numero 200 cade a 2000 microsecondi e osserva READY attivo. Duecento è il numero d’ordine della lettura, mentre duemila è il suo istante misurato in microsecondi.",
      "Quando il completamento coincide con un controllo, la traccia considera il bit già aggiornato in quell’istante. Su una linea del tempo conviene perciò segnare dapprima i controlli, poi collocare l’evento e individuare il primo segno che lo raggiunge o lo segue. Si può così contare l’interrogazione corretta anche lungo una sequenza molto fitta."
    ],
    "introduzione": [
      "Contare correttamente le interrogazioni del polling è lo scopo di questa ricostruzione, nella quale il periodo dei controlli e il completamento usano unità diverse. Il polling legge periodicamente READY, il bit che segnala la disponibilità del dispositivo. Convertendo millisecondi in microsecondi e considerando il primo controllo dopo un periodo, potrai associare a ogni interrogazione il proprio istante.",
      "Leggi i dati iniziali e prevedi il numero del primo controllo utile, ricordando che due millisecondi equivalgono a duemila microsecondi. Avanza con «Passo successivo» e confronta il controllo 199 con il 200. Osserva che READY è già visibile quando completamento e interrogazione coincidono; con «Precedente» verifica la distanza fra i due istanti e distingui il numero del controllo dal tempo."
    ],
    "procedura": [
      "Leggi i dati iniziali: Il dispositivo alza READY al tempo 2 ms. Il driver controlla lo stato ogni 10 µs. La prima lettura avviene a 10 µs e quella a 2 ms osserva READY già attivo.",
      "Prima di avviare la ricostruzione, scrivi una previsione per questa domanda: Quale interrogazione osserva READY per la prima volta?",
      "Premi «Passo successivo» per attraversare «Inizio», «Prima di READY», «Osservazione». A ogni passaggio confronta le quantità indicate con il ragionamento teorico.",
      "Raggiungi l’ultimo fotogramma e confronta la previsione con il risultato. Usa «Precedente» per rileggere il passaggio che determina il valore finale."
    ],
    "risultato": "Per la domanda «Quale interrogazione osserva READY per la prima volta?» il valore atteso è 200.",
    "ragionamento": "Il primo controllo cade a 10 µs. Servono 2000 µs per raggiungere il tempo di completamento, pari a 2 ms. Il controllo numero 199 cade a 1990 μs. Il controller risulta ancora occupato. Al controllo numero 200 il tempo raggiunge 2000 μs e READY è attivo."
  },
  "4.3.6": {
    "scopo": "Il driver deve raggiungere registri con compiti diversi in un ordine preciso. Ricostruirai gli accessi necessari per avviare una conversione, attendere la disponibilità e leggere il campione.",
    "lettura": "COMMAND, STATUS e DATA indicano rispettivamente comando, stato e carico utile. Segui il cambio dell’indirizzo quando il driver passa da una fase alla successiva; l’eventuale ripetizione riguarda le letture di STATUS durante l’attesa.",
    "conclusione": "La mappa del dispositivo associa un significato a ciascun indirizzo. Rispettare il protocollo richiede sia il registro corretto sia il momento in cui quel registro può essere usato.",
    "teoria": [
      "Un dispositivo espone alcune posizioni alle quali il processore può scrivere o dalle quali può leggere. Queste posizioni, chiamate registri della periferica, hanno compiti diversi. Il driver è il programma che conosce il loro significato e rispetta l’ordine previsto per impartire un comando e riceverne il risultato. Il prefisso 0x introduce la base sedici: 0x80 vale 8 × 16 = 128 e 0x88 vale 8 × 16 + 8 = 136. READY è un bit che vale zero durante l’attesa e uno quando il campione è disponibile.",
      "Nel dispositivo simulato COMMAND riceve l’ordine, STATUS espone i segnali di stato e DATA contiene il dato prodotto. Ogni bit di STATUS può descrivere una condizione diversa. Il driver conosce la posizione del bit che autorizza il prelievo da DATA.",
      "Nel caso guidato COMMAND si trova all’indirizzo 0x80, STATUS a 0x84 e DATA a 0x88. Il driver scrive START a 0x80, ripete le letture di 0x84 finché READY indica disponibilità e infine preleva il byte a 0x88. Le ripetizioni intermedie riguardano lo stato; il primo e l’ultimo accesso hanno ruoli diversi. Quando READY occupa un bit specifico di STATUS, si numerano i bit da zero a partire da destra. Il bit di indice k ha peso 2 elevato a k; la maschera contiene uno soltanto in quella posizione. L’operazione AND produce uno in una posizione soltanto quando entrambi gli operandi hanno uno: applicare la maschera isola quindi il flag scelto."
    ],
    "introduzione": [
      "Ricostruire gli accessi del driver serve a comprendere come indirizzo e momento dell’operazione dipendano dal protocollo del dispositivo. Il driver è il programma che governa la periferica; COMMAND riceve l’ordine, STATUS ne espone lo stato e DATA contiene il campione. La disponibilità indicata da READY autorizza il passaggio dalle letture ripetute dello stato al prelievo conclusivo del dato.",
      "Premi «Carica l’esempio guidato», individua il registro che deve ricevere START e inserisci il «Primo indirizzo» con «Registra la previsione». Segui poi «Passo successivo», confrontando la scrittura a 0x80, le letture di 0x84 e il prelievo a 0x88. Verifica primo e ultimo indirizzo anche in decimale, collegando ogni accesso alla funzione del registro interessato."
    ],
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 1 «Leggere il registro giusto al momento giusto», traccia 1. La spiegazione seguente si riferisce a questi dati.",
      "Leggi la consegna: Una periferica espone COMMAND a 0x80, STATUS a 0x84 e DATA a 0x88. Per acquisire un campione il driver scrive START, attende READY e preleva il byte. Indica gli indirizzi del primo e dell’ultimo accesso.",
      "Calcola il primo campo «Primo indirizzo» e premi «Registra la previsione» per avviare la ricostruzione. Il riscontro permette di confrontare il tuo risultato con i passaggi successivi.",
      "Segui la ricostruzione fino alla verifica dei campi; con «Apri la prova completa» puoi inserire tutte le risposte. Cambiando esercizio o traccia, rileggi la nuova consegna e usa i relativi dati."
    ],
    "risultato": "Nell’esercizio 1, traccia 1, si ottiene: Primo indirizzo = 128; Ultimo indirizzo = 136.",
    "ragionamento": "START va scritto nel registro COMMAND, a 0x80. Il driver interroga STATUS a 0x84. Quando READY passa da zero a uno, procede alla lettura del dato. La lettura conclusiva avviene su DATA a 0x88 e consegna il campione."
  },
  "4.3.7": {
    "scopo": "Una richiesta a livello rimane attiva mentre il controller riceve EOI. Individuerai il rischio immediato e l’intervento sul dispositivo che consente di eliminare la causa.",
    "lettura": "Tieni distinti lo stato in servizio del controller e il livello della linea della periferica. EOI agisce sul primo; la lettura o scrittura prescritta dal protocollo del dispositivo agisce sulla causa che mantiene il secondo.",
    "conclusione": "Una conferma al controller termina il servizio registrato senza necessariamente spegnere la sorgente. Il driver deve completare anche le operazioni previste dalla periferica per rimuovere la richiesta.",
    "teoria": [
      "IRQ indica una richiesta di interruzione. Una linea asserita è una linea che il dispositivo mantiene nel livello elettrico riconosciuto come richiesta attiva. Il driver è il programma del sistema operativo che serve la periferica e ne modifica lo stato secondo il suo protocollo. Un interrupt permette a una periferica di richiamare l’attenzione del processore. Se la richiesta è sensibile al livello, la periferica mantiene il segnale attivo per tutto il tempo in cui sussiste la causa. Un controller raccoglie le richieste e coordina la loro consegna al processore.",
      "Il segnale EOI, dall’inglese end of interrupt, comunica al controller che il processore ha concluso il servizio dell’interrupt in corso. Perché il livello torni inattivo può essere necessaria un’operazione sulla periferica stessa. Il suo protocollo precisa quale lettura o scrittura rimuove la causa.",
      "Una periferica può mantenere attiva la linea finché contiene un dato da prelevare. Il driver legge quel dato secondo il protocollo del dispositivo e segnala al controller la conclusione dell’intervento. Seguire separatamente lo stato della linea e quello del controller spiega perché, se la causa permane, la richiesta possa presentarsi di nuovo."
    ],
    "introduzione": [
      "La ricostruzione permette di spiegare perché un interrupt possa presentarsi nuovamente dopo la conferma di fine servizio. In una richiesta a livello, la periferica mantiene attiva la linea finché persiste la causa. EOI, la conferma al controller, libera lo stato del servizio in corso; il driver deve inoltre intervenire sul dispositivo secondo il suo protocollo per far cessare la richiesta.",
      "Richiama «Carica l’esempio guidato» e prevedi il rischio quando EOI arriva mentre la linea resta attiva. Avanza con «Passo successivo», confrontando lo stato del controller con quello della periferica. Prima della verifica finale, formula l’azione necessaria sul dispositivo; usa «Precedente» per seguire il passaggio che rende possibile una nuova consegna e collegarlo alla causa rimasta da servire."
    ],
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 3 «Instradare e chiudere una richiesta», traccia 2. La spiegazione seguente si riferisce a questi dati.",
      "Leggi la consegna: Un controller accetta EOI per IRQ a livello. Il driver invia EOI mentre la periferica tiene tuttora asserita la linea. Individua il rischio immediato e l’azione che elimina la causa.",
      "Ricostruisci il primo campo «Rischio» prima di leggere lo svolgimento. Avanza con «Passo successivo» e controlla i dati impiegati in ciascuna operazione.",
      "Segui la ricostruzione fino alla verifica dei campi; con «Apri la prova completa» puoi inserire tutte le risposte. Cambiando esercizio o traccia, rileggi la nuova consegna e usa i relativi dati."
    ],
    "risultato": "Nell’esercizio 3, traccia 2, si ottiene: Rischio = Nuova consegna della richiesta; Azione sul dispositivo = Servire e liberare la causa.",
    "ragionamento": "Una segnalazione a livello mantiene attiva la linea finché persiste la causa. EOI libera lo stato in servizio e il livello ancora asserito può provocare una nuova consegna. Il driver deve servire la periferica e liberarne la causa secondo il protocollo del dispositivo."
  },
  "4.4.1": {
    "scopo": "Una richiesta sul bus deve ottenere un turno e raggiungere un destinatario che riconosca l’indirizzo. Seguirai una lettura dal controller, poi proverai il primo indirizzo esterno alla sua regione per verificare il ruolo della decodifica.",
    "lettura": "Il percorso va dall’iniziatore al decoder e quindi alla RAM o al controller. I limiti scritti sui riquadri sono intervalli di indirizzi inclusivi. La freccia inferiore segue il dato nella direzione dell’operazione; il ramo fuori mappa termina senza destinatario.",
    "conclusione": "La concessione del bus autorizza l’iniziatore a presentare una richiesta, mentre la mappa degli indirizzi determina chi può rispondere. Un turno ottenuto correttamente può dunque concludersi con un errore di indirizzo.",
    "controlli": {
      "a": "Indirizzo del byte richiesto. Da 0 a 127 seleziona RAM; da 128 a 143 seleziona il controller; i valori successivi sono fuori mappa.",
      "cmd": "La lettura porta il contenuto dal destinatario all’iniziatore; la scrittura porta il valore fisso 0xA5 dall’iniziatore al destinatario.",
      "master": "Componente al quale l’arbitro ha assegnato il bus. L’altro richiedente resta in attesa durante questa transazione."
    },
    "teoria": [
      "Il processore, la memoria principale e i dispositivi hanno bisogno di un collegamento su cui scambiarsi dati. Quando più componenti condividono un bus, soltanto uno alla volta può avviare una transazione, cioè una richiesta completa di lettura o scrittura. L’arbitro assegna il turno. Il vincitore può essere la CPU oppure un’unità DMA, il circuito che effettua trasferimenti di memoria per conto di un dispositivo.",
      "Una volta ottenuto il turno, l’iniziatore presenta il comando e l’indirizzo. Un circuito decodificatore stabilisce a quale componente appartiene quell’indirizzo. Qui i numeri da 0 a 127 selezionano la memoria principale, detta RAM, e i numeri da 128 a 143 i registri del controller. L’indirizzo 132 individua perciò il byte che si trova quattro posizioni dopo l’inizio della regione del controller.",
      "In lettura il componente selezionato restituisce il byte all’iniziatore. In scrittura l’iniziatore fornisce il byte e il destinatario ne conferma la ricezione. La sigla ACK indica la conferma. Anche quando CPU e DMA possono entrambi ottenere il turno, l’indirizzo 144 cade fuori dalle due regioni e la richiesta termina prima dello scambio dei dati. Gli indirizzi preceduti da 0x sono scritti in base sedici: 132 corrisponde a 0x84 e 144 a 0x90. Il modello inizializza il contenuto leggibile con il valore dell’indirizzo ridotto a un byte; per questo la lettura a 0x84 restituisce proprio 0x84. In un dispositivo reale il contenuto dipende dal registro e dal suo stato, separatamente dal numero usato per raggiungerlo."
    ],
    "introduzione": [
      "Questa simulazione serve a distinguere il diritto di usare un bus dalla presenza di un destinatario capace di rispondere. L’arbitro assegna il turno all’iniziatore, mentre il decoder interpreta l’indirizzo per selezionare RAM o controller. In lettura il destinatario fornisce il byte; in scrittura lo riceve dall’iniziatore. La conferma ACK conclude lo scambio quando l’indirizzo appartiene alla mappa prevista.",
      "Carica la lettura all’indirizzo 132 e segui con «Passo successivo» la concessione, la decodifica e il ritorno del byte. Confronta l’indirizzo 144, appena oltre la regione del controller. Cambiando «Operazione» e premendo «Applica i parametri», osserva anche la direzione della scrittura: attribuisci la sorgente del dato al comando, mentre la selezione del destinatario dipende dall’indirizzo."
    ],
    "esperienze": [
      {
        "titolo": "Lettura del registro all’offset quattro",
        "parametri": {
          "a": 132,
          "cmd": "r",
          "master": "CPU"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Indirizzo di byte = 132; Operazione = Leggi; Concessione dell’arbitro = CPU.",
          "Leggi il passo «Richiesta». Annota Indirizzo = 0x84; Comando = lettura; Iniziatore concesso = CPU; In attesa = DMA. Prima di avanzare, prevedi il valore finale del campo «Sorgente del byte trasferito» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Decodifica». Annota Destinatario = controller; Offset = 0x4.",
          "Premi «Passo successivo» e fermati su «Completamento». Annota Risposta = ACK; Byte trasferito = 0x84; Sorgente del byte trasferito = controller."
        ],
        "risultato": "Nel passo «Completamento» il risultato è: Risposta = ACK; Byte trasferito = 0x84; Sorgente del byte trasferito = controller.",
        "ragionamento": "L’indirizzo 132 = 0x84 appartiene alla regione del controller che comincia a 128 = 0x80. L’offset locale è 4 e il contenuto iniziale del byte coincide qui con 132 modulo 256, quindi si riceve 0x84 e la conferma ACK.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Destinatario",
            "valore": "controller"
          },
          {
            "passo": 1,
            "campo": "Offset",
            "valore": "0x4"
          },
          {
            "passo": 2,
            "campo": "Risposta",
            "valore": "ACK"
          },
          {
            "passo": 2,
            "campo": "Byte trasferito",
            "valore": "0x84"
          },
          {
            "passo": 2,
            "campo": "Sorgente del byte trasferito",
            "valore": "controller"
          }
        ]
      },
      {
        "titolo": "Indirizzo appena oltre il controller",
        "parametri": {
          "a": 144,
          "cmd": "r",
          "master": "CPU"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Indirizzo di byte = 144; Operazione = Leggi; Concessione dell’arbitro = CPU.",
          "Leggi il passo «Richiesta». Annota Indirizzo = 0x90; Comando = lettura; Iniziatore concesso = CPU; In attesa = DMA. Prima di avanzare, prevedi il valore finale del campo «Sorgente del byte trasferito» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Decodifica». Annota Destinatario = nessun destinatario; Offset = inapplicabile.",
          "Premi «Passo successivo» e fermati su «Completamento». Annota Risposta = errore di indirizzo; Byte trasferito = assente; Sorgente del byte trasferito = nessun trasferimento."
        ],
        "risultato": "Nel passo «Completamento» il risultato è: Risposta = errore di indirizzo; Byte trasferito = assente; Sorgente del byte trasferito = nessun trasferimento.",
        "ragionamento": "L’indirizzo 144 = 0x90 segue l’ultimo byte del controller, 143 = 0x8F. Nessuna regione lo riconosce: la risposta è un errore di indirizzo e manca un byte da trasferire.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Destinatario",
            "valore": "nessun destinatario"
          },
          {
            "passo": 1,
            "campo": "Offset",
            "valore": "inapplicabile"
          },
          {
            "passo": 2,
            "campo": "Risposta",
            "valore": "errore di indirizzo"
          },
          {
            "passo": 2,
            "campo": "Byte trasferito",
            "valore": "assente"
          },
          {
            "passo": 2,
            "campo": "Sorgente del byte trasferito",
            "valore": "nessun trasferimento"
          }
        ]
      }
    ]
  },
  "4.4.2": {
    "scopo": "La banda dipende dalla larghezza del collegamento, dal ritmo dei trasferimenti e dalle risorse che lavorano contemporaneamente. Confronterai un bus condiviso con due link DDR per attribuire separatamente i fattori che aumentano il totale.",
    "lettura": "I punti a sinistra sono due flussi e quelli a destra i destinatari. Un tratto comune rappresenta il bus conteso; due linee separate rappresentano risorse che lavorano insieme. Leggi prima i MB/s di una risorsa, poi il numero di risorse simultanee e la banda aggregata.",
    "conclusione": "La banda aggregata è byte per trasferimento × trasferimenti per ciclo × cicli al secondo × risorse utilizzate simultaneamente. Questa stima rappresenta una capacità ideale senza attese o costi di protocollo.",
    "controlli": {
      "w": "Bit trasportati insieme da una risorsa. Dividi per otto per ottenere i byte di ogni trasferimento.",
      "f": "Frequenza del clock in MHz, ossia milioni di cicli al secondo.",
      "t": "Topologia e ritmo: bus condiviso SDR ha una risorsa e un trasferimento per ciclo; due link SDR hanno due risorse; due link DDR hanno anche due trasferimenti per ciclo."
    },
    "teoria": [
      "Un collegamento digitale trasmette cifre binarie, o bit. La sua larghezza esprime quanti bit possono viaggiare insieme. Poiché un byte comprende otto bit, una larghezza di 32 bit permette di trasferire quattro byte per volta. Il clock fornisce il ritmo del collegamento e la sua frequenza conta i cicli in un secondo. Un megahertz (MHz) equivale a un milione di cicli al secondo.",
      "In modalità SDR avviene un trasferimento per ciclo. A 100 MHz un collegamento da 32 bit che trasmetta senza pause può quindi portare 400 milioni di byte al secondo, ossia 400 MB/s decimali. Nella modalità DDR avvengono due trasferimenti per ciclo. A parità di frequenza e di larghezza, ciascun collegamento raddoppia la propria capacità di trasporto.",
      "Anche la disposizione dei collegamenti incide sul totale. Due flussi che usano lo stesso bus si dividono i turni disponibili. Se ognuno raggiunge il proprio destinatario su una linea indipendente, le due linee possono lavorare insieme. La banda aggregata esprime la somma dei byte trasferiti nell’unità di tempo da tutte le linee effettivamente occupate."
    ],
    "introduzione": [
      "Misurare la banda ideale richiede di distinguere quanti byte viaggiano insieme, quante volte si trasferiscono per ciclo e quante risorse lavorano contemporaneamente. Questo è lo scopo della simulazione: SDR compie un trasferimento per ciclo, DDR ne compie due, mentre collegamenti indipendenti possono sommare le proprie capacità. La banda aggregata conta tutti i byte trasferiti al secondo dalle risorse effettivamente utilizzate.",
      "Carica il bus condiviso da trentadue bit a cento megahertz e segui con «Passo successivo» la conversione in byte e la banda della risorsa. Fissa il caso e confrontalo con due link DDR. Per attribuire separatamente i due raddoppi, seleziona anche «Due link SDR» e applica i parametri, leggendo banda per risorsa, risorse simultanee e totale aggregato."
    ],
    "esperienze": [
      {
        "titolo": "Due flussi su un solo bus SDR",
        "parametri": {
          "w": "32",
          "f": 100,
          "t": "bus"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Larghezza in bit = 32; Clock (MHz) = 100; Topologia = Bus condiviso SDR.",
          "Leggi il passo «Un trasferimento». Annota Byte per trasferimento = 4; Trasferimenti per ciclo = 1. Prima di avanzare, prevedi il valore finale del campo «Banda aggregata (MB/s)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Una risorsa». Annota MHz = 100; MB/s per risorsa = 400.",
          "Premi «Passo successivo» e fermati su «Due flussi indipendenti». Annota Risorse simultanee = 1; Banda aggregata (MB/s) = 400."
        ],
        "risultato": "Nel passo «Due flussi indipendenti» il risultato è: Risorse simultanee = 1; Banda aggregata (MB/s) = 400.",
        "ragionamento": "Trentadue bit equivalgono a quattro byte; 4 × 100 milioni di cicli produce 400 MB/s. I due flussi condividono l’unica risorsa, quindi il totale resta 400 MB/s.",
        "attesi": [
          {
            "passo": 1,
            "campo": "MHz",
            "valore": "100"
          },
          {
            "passo": 1,
            "campo": "MB/s per risorsa",
            "valore": "400"
          },
          {
            "passo": 2,
            "campo": "Risorse simultanee",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Banda aggregata (MB/s)",
            "valore": "400"
          }
        ]
      },
      {
        "titolo": "Due flussi su due link DDR",
        "parametri": {
          "w": "32",
          "f": 100,
          "t": "ddr"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Larghezza in bit = 32; Clock (MHz) = 100; Topologia = Due link DDR.",
          "Leggi il passo «Un trasferimento». Annota Byte per trasferimento = 4; Trasferimenti per ciclo = 2. Prima di avanzare, prevedi il valore finale del campo «Banda aggregata (MB/s)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Una risorsa». Annota MHz = 100; MB/s per risorsa = 800.",
          "Premi «Passo successivo» e fermati su «Due flussi indipendenti». Annota Risorse simultanee = 2; Banda aggregata (MB/s) = 1600."
        ],
        "risultato": "Nel passo «Due flussi indipendenti» il risultato è: Risorse simultanee = 2; Banda aggregata (MB/s) = 1600.",
        "ragionamento": "Ogni link DDR porta 4 × 2 × 100 = 800 MB/s. Due collegamenti indipendenti occupati insieme sommano 1600 MB/s: il fattore quattro rispetto al caso iniziale deriva dal raddoppio del ritmo e da quello delle risorse.",
        "attesi": [
          {
            "passo": 1,
            "campo": "MHz",
            "valore": "100"
          },
          {
            "passo": 1,
            "campo": "MB/s per risorsa",
            "valore": "800"
          },
          {
            "passo": 2,
            "campo": "Risorse simultanee",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "Banda aggregata (MB/s)",
            "valore": "1600"
          }
        ]
      }
    ]
  },
  "4.4.3": {
    "scopo": "Per trasferire parole consecutive si può ripetere ogni richiesta oppure usare una sola raffica. Confronterai le due cronologie contando indirizzamento, attese e cicli che portano dati utili.",
    "lettura": "Ogni casella della striscia vale un ciclo. I indica l’indirizzo, A un’attesa e D una parola di dati. Le sequenze ripetute permettono di riconoscere il costo che la raffica paga una volta sola; la striscia mostra al massimo i primi ventiquattro cicli.",
    "conclusione": "Una raffica ammortizza indirizzamento e attesa iniziale sui dati consecutivi. La quantità trasferita può restare identica mentre il tempo varia, perché il protocollo occupa parte dei cicli disponibili.",
    "controlli": {
      "n": "Parole contigue da trasferire, ciascuna di quattro byte.",
      "w": "Cicli di attesa inseriti dopo ogni presentazione dell’indirizzo. Nel modo a transazioni singole il costo si ripete per ogni parola.",
      "modo": "La raffica presenta una sola base per tutte le parole; le transazioni singole presentano un indirizzo per ciascuna parola."
    },
    "teoria": [
      "Quando si trasferisce un dato sul bus che collega due componenti, entrambi devono sapere quale posizione di memoria interessa e quando il destinatario è pronto. Queste regole compongono il protocollo. Nella macchina simulata l’indirizzo richiede un ciclo, cioè un intervallo del clock. Dopo l’eventuale attesa del destinatario si trasmette una parola per ciclo. Una parola comprende qui quattro byte.",
      "Per inviare quattro parole adiacenti, una raffica presenta l’indirizzo della prima e lascia che il protocollo proceda alle posizioni successive. Con due cicli di attesa si spendono un ciclo per l’indirizzo, due per l’attesa e quattro per i dati. Il destinatario riceve sedici byte al termine del settimo ciclo.",
      "Le stesse parole possono viaggiare in quattro transazioni singole. Ogni transazione deve in tal caso ripetere la presentazione dell’indirizzo e la relativa attesa. La durata sale a quattro volte la somma di un ciclo di indirizzo, due di attesa e uno di dati. Sulla cronologia, i cicli che contengono parole restano quattro. Sono gli intervalli che li separano a spiegare la diversa durata."
    ],
    "introduzione": [
      "L’esperimento serve a capire come il protocollo possa cambiare la durata di un trasferimento pur lasciando uguali i byte consegnati. Una raffica raggruppa parole consecutive sotto un solo indirizzo iniziale; le transazioni singole ripetono indirizzamento e attesa per ciascuna parola. Separando i cicli di controllo dai cicli dati, potrai riconoscere il costo che viene distribuito sull’intero gruppo.",
      "Carica le quattro parole in raffica e avanza con «Passo successivo», contando sulla striscia I per indirizzo, A per attesa e D per dato. Confronta poi le quattro transazioni separate dopo aver fissato il primo caso. I sedici byte restano gli stessi: spiega i sette oppure sedici cicli attraverso il numero di presentazioni dell’indirizzo e delle attese che ne seguono."
    ],
    "esperienze": [
      {
        "titolo": "Quattro parole in una raffica",
        "parametri": {
          "n": 4,
          "w": 2,
          "modo": "burst"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Parole contigue = 4; Cicli di attesa per indirizzo = 2; Emissione = Raffica.",
          "Leggi il passo «Indirizzamento». Annota Presentazioni = 1; Cicli di indirizzo = 1. Prima di avanzare, formula la previsione richiesta nel campo «Cicli totali» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Attesa del destinatario». Annota Cicli di attesa = 2; Cicli dati = 4.",
          "Premi «Passo successivo» e fermati su «Ultima conferma». Annota Cicli totali = 7; Byte consegnati = 16."
        ],
        "risultato": "Nel passo «Ultima conferma» il risultato è: Cicli totali = 7; Byte consegnati = 16.",
        "ragionamento": "La raffica richiede un ciclo di indirizzo, due di attesa e quattro di dati: 1 + 2 + 4 = 7 cicli. Le quattro parole portano 4 × 4 = 16 byte.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Cicli di attesa",
            "valore": "2"
          },
          {
            "passo": 1,
            "campo": "Cicli dati",
            "valore": "4"
          },
          {
            "passo": 2,
            "campo": "Cicli totali",
            "valore": "7"
          },
          {
            "passo": 2,
            "campo": "Byte consegnati",
            "valore": "16"
          }
        ]
      },
      {
        "titolo": "Quattro transazioni separate",
        "parametri": {
          "n": 4,
          "w": 2,
          "modo": "singole"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Parole contigue = 4; Cicli di attesa per indirizzo = 2; Emissione = Transazioni singole.",
          "Leggi il passo «Indirizzamento». Annota Presentazioni = 4; Cicli di indirizzo = 4. Prima di avanzare, formula la previsione richiesta nel campo «Cicli totali» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Attesa del destinatario». Annota Cicli di attesa = 8; Cicli dati = 4.",
          "Premi «Passo successivo» e fermati su «Ultima conferma». Annota Cicli totali = 16; Byte consegnati = 16."
        ],
        "risultato": "Nel passo «Ultima conferma» il risultato è: Cicli totali = 16; Byte consegnati = 16.",
        "ragionamento": "Ogni parola richiede 1 + 2 + 1 = 4 cicli, quindi quattro transazioni occupano 16 cicli. I byte consegnati restano 16: i nove cicli aggiuntivi appartengono alla ripetizione di indirizzi e attese.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Cicli di attesa",
            "valore": "8"
          },
          {
            "passo": 1,
            "campo": "Cicli dati",
            "valore": "4"
          },
          {
            "passo": 2,
            "campo": "Cicli totali",
            "valore": "16"
          },
          {
            "passo": 2,
            "campo": "Byte consegnati",
            "valore": "16"
          }
        ]
      }
    ]
  },
  "4.4.4": {
    "scopo": "Tre componenti richiedono contemporaneamente un collegamento condiviso. Ricostruirai l’ordine round-robin a partire dall’ultimo servito e distinguerai l’inizio dell’arbitraggio di B dal suo primo ciclo dati e dal completamento.",
    "lettura": "La griglia numera i cicli da zero. AR occupa la prima casella di ogni turno e le quattro caselle successive portano i dati del richiedente indicato. La casella evidenziata di B è il primo dato; il completamento cade sul confine dopo la quarta casella dati.",
    "conclusione": "Il tempo di attesa dipende dai turni che precedono una richiesta. Il suo completamento include anche arbitraggio e trasmissione del proprio turno, quindi va letto come un istante distinto dal primo dato.",
    "controlli": {
      "p": "Politica dell’arbitro: round-robin riparte dal successore dell’ultimo servito; la priorità fissa sceglie A, poi B, poi C tra le domande ancora pendenti.",
      "last": "Ultimo componente servito prima delle tre richieste simultanee. Influenza la rotazione round-robin; la priorità fissa conserva il proprio ordine."
    },
    "teoria": [
      "Se tre componenti chiedono nello stesso istante di usare un bus condiviso, un circuito chiamato arbitro decide in quale ordine servirli. Una politica a priorità fissa sceglie sempre il richiedente di rango più alto fra quelli ancora in attesa. Il criterio a rotazione, detto round-robin, conserva invece il nome dell’ultimo servito e riprende la ricerca dal successivo in un ordine circolare.",
      "Nella coda A, B, C ciascuno presenta una richiesta al ciclo zero e ciascun turno dura cinque cicli. Il primo serve ad assegnare la risorsa, gli altri quattro trasportano i dati. Nel primo caso l’ultimo servito era C e la rotazione segue A, B, C. Nel secondo caso l’ultimo servito era B: la ricerca riparte da C, prosegue con A e giunge infine a B.",
      "Nel secondo caso i due turni che precedono B occupano i cicli da zero a nove. Al ciclo dieci inizia l’arbitraggio di B, all’undici compare il suo primo dato e all’istante quindici termina il trasferimento. Nel primo caso basta un solo turno precedente e questi tre istanti sono cinque, sei e dieci. La figura distingue l’attesa del turno dal tempo fino alla disponibilità di tutti i dati."
    ],
    "introduzione": [
      "Lo scopo dell’attività è ricostruire quando un richiedente ottenga il bus, inizi a trasmettere e completi il proprio turno. Il round-robin è una scelta a rotazione che riparte dal successore dell’ultimo servito. Poiché ogni turno comprende un ciclo di arbitraggio e quattro di dati, l’ordine delle concessioni determina tre istanti distinti sulla cronologia contata da zero.",
      "Carica «Rotazione dopo C» e prevedi il primo ciclo dati di B prima di avanzare con «Passo successivo». Confronta l’inizio dell’arbitraggio, la prima casella dati e il confine finale del turno. Fissa il caso e carica «Rotazione dopo B»: i due turni precedenti spostano tutti e tre gli istanti, mentre la durata del servizio di B resta invariata."
    ],
    "esperienze": [
      {
        "titolo": "Rotazione dopo C",
        "parametri": {
          "p": "rr",
          "last": "C"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Politica = Round-robin; Ultimo servito = C.",
          "Leggi il passo «Domande pendenti». Annota Richiedenti = A, B, C; Ultimo servito = C. Prima di avanzare, formula la previsione richiesta nel campo «Primo ciclo dati di B, contando da zero» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Concessioni». Annota Ordine = A → B → C; Arbitraggio per turno = 1; Cicli dati per turno = 4; Durata per turno = 5.",
          "Premi «Passo successivo» e fermati su «Attesa di B». Annota Inizio arbitraggio di B = 5; Primo ciclo dati di B = 6; Completamento di B = 10."
        ],
        "risultato": "Nel passo «Attesa di B» il risultato è: Inizio arbitraggio di B = 5; Primo ciclo dati di B = 6; Completamento di B = 10.",
        "ragionamento": "Dopo C si parte da A, quindi l’ordine è A, B, C. A occupa cinque cicli: B inizia l’arbitraggio al ciclo 5, trasmette il primo dato al 6 e completa al confine 10.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Ordine",
            "valore": "A → B → C"
          },
          {
            "passo": 1,
            "campo": "Arbitraggio per turno",
            "valore": "1"
          },
          {
            "passo": 1,
            "campo": "Cicli dati per turno",
            "valore": "4"
          },
          {
            "passo": 1,
            "campo": "Durata per turno",
            "valore": "5"
          },
          {
            "passo": 2,
            "campo": "Inizio arbitraggio di B",
            "valore": "5"
          },
          {
            "passo": 2,
            "campo": "Primo ciclo dati di B",
            "valore": "6"
          },
          {
            "passo": 2,
            "campo": "Completamento di B",
            "valore": "10"
          }
        ]
      },
      {
        "titolo": "Rotazione dopo B",
        "parametri": {
          "p": "rr",
          "last": "B"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Politica = Round-robin; Ultimo servito = B.",
          "Leggi il passo «Domande pendenti». Annota Richiedenti = A, B, C; Ultimo servito = B. Prima di avanzare, formula la previsione richiesta nel campo «Primo ciclo dati di B, contando da zero» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Concessioni». Annota Ordine = C → A → B; Arbitraggio per turno = 1; Cicli dati per turno = 4; Durata per turno = 5.",
          "Premi «Passo successivo» e fermati su «Attesa di B». Annota Inizio arbitraggio di B = 10; Primo ciclo dati di B = 11; Completamento di B = 15."
        ],
        "risultato": "Nel passo «Attesa di B» il risultato è: Inizio arbitraggio di B = 10; Primo ciclo dati di B = 11; Completamento di B = 15.",
        "ragionamento": "Dopo B si parte da C, seguito da A e infine B. Due turni da cinque cicli portano l’arbitraggio di B a 10, il primo dato a 11 e il completamento a 15.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Ordine",
            "valore": "C → A → B"
          },
          {
            "passo": 1,
            "campo": "Arbitraggio per turno",
            "valore": "1"
          },
          {
            "passo": 1,
            "campo": "Cicli dati per turno",
            "valore": "4"
          },
          {
            "passo": 1,
            "campo": "Durata per turno",
            "valore": "5"
          },
          {
            "passo": 2,
            "campo": "Inizio arbitraggio di B",
            "valore": "10"
          },
          {
            "passo": 2,
            "campo": "Primo ciclo dati di B",
            "valore": "11"
          },
          {
            "passo": 2,
            "campo": "Completamento di B",
            "valore": "15"
          }
        ]
      }
    ]
  },
  "4.4.5": {
    "scopo": "Un pacchetto attraversa due collegamenti separati da un ponte che riceve interamente prima di ritrasmettere. Misurerai ricezione, elaborazione, coda e invio, confrontando l’uscita libera da nuovi concorrenti con un secondo flusso che la occupa prima del pacchetto osservato.",
    "lettura": "Il pacchetto entra nel ponte da sinistra; le due diramazioni indicano uscite distinte. La coda appartiene all’uscita scelta e viene espressa sia in pacchetti sia in microsecondi. Il percorso fino alla RAM comprende entrambi i collegamenti e l’attesa nel ponte.",
    "conclusione": "La contesa dipende dalla risorsa di uscita effettivamente condivisa. Un flusso su una porta indipendente può procedere in parallelo; uno sulla stessa porta aggiunge la propria serializzazione alla coda.",
    "controlli": {
      "b": "Dimensione del pacchetto in byte. Anche i pacchetti già in coda hanno questa taglia; ingresso e uscita hanno velocità rispettivamente 16 e 8 byte per microsecondo.",
      "q": "Pacchetti ancora da trasmettere sull’uscita quando il ponte conclude l’elaborazione del pacchetto osservato.",
      "uscite": "Secondo flusso concorrente: può essere assente, avere precedenza sulla stessa uscita oppure usare un’uscita indipendente che lo switch serve in parallelo."
    },
    "teoria": [
      "Un pacchetto è una sequenza di byte che viaggia come un’unica unità. Per raggiungere la memoria principale, indicata con RAM, attraversa qui due collegamenti separati da un ponte, o switch, che lo riceve e sceglie l’uscita. Con il metodo store-and-forward il ponte attende di avere ricevuto tutti i byte prima di iniziare a trasmetterli sul secondo tratto. Una velocità di un B/µs corrisponde a un byte per microsecondo, cioè per milionesimo di secondo.",
      "Se il pacchetto contiene 64 byte e in ingresso passano 16 byte per microsecondo, la ricezione richiede quattro microsecondi. L’elaborazione del ponte ne occupa uno. L’uscita, che porta otto byte per microsecondo, ne richiede otto per ciascun pacchetto della stessa dimensione. Se davanti al nostro ne attendono due, l’uscita resta occupata per altri sedici microsecondi, prima degli otto necessari al nostro invio.",
      "La durata dall’inizio alla consegna dell’ultimo byte è quindi di 4 + 1 + 16 + 8 = 29 microsecondi, trascurando la propagazione del segnale. Un altro pacchetto che abbia precedenza sulla stessa uscita aggiunge otto microsecondi di attesa. Se impiega un’uscita indipendente, i due invii possono sovrapporsi. La latenza totale qui termina quando è arrivato l’ultimo byte del pacchetto. Ciascun tratto aggiunge il proprio tempo al percorso della stessa richiesta; i pacchetti su un’uscita diversa possono procedere in parallelo."
    ],
    "introduzione": [
      "Seguire un pacchetto attraverso un ponte serve a separare trasmissione, elaborazione e attesa in coda. Il metodo store-and-forward riceve l’intero pacchetto prima di ritrasmetterlo, quindi i tempi dei due collegamenti si sommano per la stessa richiesta. La simulazione mostra inoltre che la contesa dipende dall’uscita condivisa: un concorrente sulla stessa porta aggiunge attesa, mentre una porta indipendente permette simultaneità.",
      "Carica il pacchetto con due elementi già in coda e avanza con «Passo successivo», associando ciascun tempo al tratto corrispondente. Fissa il risultato e carica il concorrente sulla stessa uscita, confrontando ventinove e trentasette microsecondi. Seleziona poi «Uscita indipendente» e applica i parametri: verifica quale componente della latenza cambi quando i flussi usano risorse diverse."
    ],
    "esperienze": [
      {
        "titolo": "Due pacchetti davanti all’uscita",
        "parametri": {
          "b": 64,
          "q": 2,
          "uscite": "solo"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Pacchetto (B) = 64; Pacchetti già in coda all’uscita scelta = 2; Secondo flusso parallelo = Assente.",
          "Leggi il passo «Collegamento in ingresso». Annota Byte = 64; Tempo (µs) = 4. Prima di avanzare, prevedi il valore finale del campo «Latenza totale (µs)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Ponte». Annota Elaborazione (µs) = 1; Coda (µs) = 16; Pacchetti davanti = 2.",
          "Premi «Passo successivo» e fermati su «Collegamento in uscita». Annota Invio (µs) = 8; Latenza totale (µs) = 29."
        ],
        "risultato": "Nel passo «Collegamento in uscita» il risultato è: Invio (µs) = 8; Latenza totale (µs) = 29.",
        "ragionamento": "La ricezione dura 64 / 16 = 4 µs e il ponte aggiunge 1 µs. Due pacchetti davanti occupano 2 × 64 / 8 = 16 µs, poi il nostro invio dura 8 µs: il totale è 29 µs.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Elaborazione (µs)",
            "valore": "1"
          },
          {
            "passo": 1,
            "campo": "Coda (µs)",
            "valore": "16"
          },
          {
            "passo": 1,
            "campo": "Pacchetti davanti",
            "valore": "2"
          },
          {
            "passo": 2,
            "campo": "Invio (µs)",
            "valore": "8"
          },
          {
            "passo": 2,
            "campo": "Latenza totale (µs)",
            "valore": "29"
          }
        ]
      },
      {
        "titolo": "Un concorrente aggiuntivo sulla stessa uscita",
        "parametri": {
          "b": 64,
          "q": 2,
          "uscite": "stessa"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Pacchetto (B) = 64; Pacchetti già in coda all’uscita scelta = 2; Secondo flusso parallelo = Stessa uscita, prima del pacchetto osservato.",
          "Leggi il passo «Collegamento in ingresso». Annota Byte = 64; Tempo (µs) = 4. Prima di avanzare, prevedi il valore finale del campo «Latenza totale (µs)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Ponte». Annota Elaborazione (µs) = 1; Coda (µs) = 24; Pacchetti davanti = 3.",
          "Premi «Passo successivo» e fermati su «Collegamento in uscita». Annota Invio (µs) = 8; Latenza totale (µs) = 37."
        ],
        "risultato": "Nel passo «Collegamento in uscita» il risultato è: Invio (µs) = 8; Latenza totale (µs) = 37.",
        "ragionamento": "Il secondo flusso sulla stessa uscita ha precedenza, quindi i pacchetti davanti diventano tre. La coda sale a 24 µs e il totale a 4 + 1 + 24 + 8 = 37 µs, con un incremento di 8 µs dovuto a un solo invio aggiuntivo.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Elaborazione (µs)",
            "valore": "1"
          },
          {
            "passo": 1,
            "campo": "Coda (µs)",
            "valore": "24"
          },
          {
            "passo": 1,
            "campo": "Pacchetti davanti",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "Invio (µs)",
            "valore": "8"
          },
          {
            "passo": 2,
            "campo": "Latenza totale (µs)",
            "valore": "37"
          }
        ]
      }
    ]
  },
  "4.4.6": {
    "scopo": "Una parte dei byte trasportati dal bus è destinata al controllo del protocollo. Calcolerai prima la banda lorda del collegamento, poi quella utile all’applicazione applicando la quota di payload.",
    "lettura": "La ricostruzione separa larghezza per trasferimento, trasferimenti al secondo e frazione utile. La conversione da bit a byte precede il prodotto; la percentuale di payload agisce sul risultato lordo mantenendo l’unità MB/s decimali.",
    "conclusione": "La banda utile dipende sia dalla capacità fisica sia dalla quota impiegata per il contenuto dell’applicazione. Le percentuali vanno trasformate in fattori prima di applicarle al flusso lordo.",
    "teoria": [
      "La banda di un collegamento esprime la quantità di dati che può trasportare nell’unità di tempo. Per ottenerla a partire dal funzionamento del bus si contano i byte trasferiti in una singola operazione e le operazioni disponibili in un secondo. Quando la larghezza è data in bit, la divisione per otto la converte in byte.",
      "Una parte della capacità può essere impiegata per informazioni di controllo, indirizzi o altri dati di servizio. Si chiama payload la parte destinata al contenuto richiesto dall’applicazione. La sua quota è un rapporto fra due quantità misurate nello stesso intervallo. Se è espressa come percentuale, dividendola per cento si ottiene il fattore per passare dalla banda lorda alla banda utile.",
      "Il bus del problema è largo 32 bit, ossia quattro byte, e compie 250 milioni di trasferimenti al secondo. La banda lorda è dunque 4 × 250 = 1000 milioni di byte al secondo. Con payload all’80 per cento si applica il fattore 0,8, ottenendo 800 MB/s utili. La sigla MB/s esprime qui milioni di byte al secondo, perciò il valore resta confrontabile con la banda lorda."
    ],
    "introduzione": [
      "La ricostruzione serve a distinguere la capacità complessiva del collegamento dalla parte utile all’applicazione. La banda lorda moltiplica byte per trasferimento e trasferimenti al secondo; il payload è il contenuto utile entro tutti i byte trasportati. Applicando la sua quota alla banda lorda si ottiene la banda utile, mantenendo coerenti bit, byte e milioni di byte al secondo.",
      "Leggi i dati del bus da trentadue bit e scrivi la previsione della banda utile. Avanza con «Passo successivo», confrontando quattro byte per trasferimento, mille MB/s lordi e la quota utile dell’ottanta per cento. Usa «Precedente» per verificare che il fattore 0,8 agisca sulla capacità già espressa in byte e spieghi gli ottocento MB/s del risultato."
    ],
    "procedura": [
      "Leggi i dati iniziali: Il bus è largo 32 bit. Esegue 250 milioni di trasferimenti al secondo e l’80% dei byte trasportati è payload. Un MB equivale a un milione di byte.",
      "Prima di avviare la ricostruzione, scrivi una previsione per questa domanda: Con payload all’80%, quanti MB/s decimali sono utili?",
      "Premi «Passo successivo» per attraversare «Ampiezza», «Banda lorda», «Banda utile». A ogni passaggio confronta le quantità indicate con il ragionamento teorico.",
      "Raggiungi l’ultimo fotogramma e confronta la previsione con il risultato. Usa «Precedente» per rileggere il passaggio che determina il valore finale."
    ],
    "risultato": "Per la domanda «Con payload all’80%, quanti MB/s decimali sono utili?» il valore atteso è 800.",
    "ragionamento": "Il bus trasporta 32 bit, cioè quattro byte, per trasferimento. Quattro byte per 250 milioni di trasferimenti al secondo danno un miliardo di byte al secondo. La quota di payload è 0,8. La banda utile vale 1000 MB/s × 0,8 = 800 MB/s."
  },
  "4.4.7": {
    "scopo": "Un pacchetto occupa il collegamento durante i dati e durante il controllo della transazione. Calcolerai il tempo per 800 byte e la banda utile misurata sull’intero intervallo di occupazione.",
    "lettura": "La cronologia distingue il tratto di serializzazione dal tratto di controllo. Nel rapporto finale il numeratore conserva i soli 800 byte utili, mentre il denominatore comprende entrambe le fasi della transazione.",
    "conclusione": "La velocità durante il passaggio dei dati può superare la banda utile dell’intera richiesta. La differenza nasce dal tempo che il protocollo occupa senza aggiungere nuovi byte al contenuto richiesto.",
    "teoria": [
      "Un collegamento trasmette un numero limitato di byte per unità di tempo. Anche un messaggio che sia già pronto deve perciò essere immesso sul collegamento un poco alla volta. Si chiama serializzazione il tempo necessario a far passare tutti i suoi bit. Un MB decimale contiene un milione di byte e un secondo contiene un milione di microsecondi: dividendo entrambi per un milione, 1 MB/s equivale a 1 B/µs. Il simbolo µs indica il microsecondo.",
      "La banda indica quanti dati possono attraversare il collegamento per unità di tempo. Dividendo la dimensione del pacchetto per la banda si ottiene la durata della trasmissione, alla quale si aggiungono le fasi di controllo che occupano anch’esse il canale.",
      "Il collegamento del problema trasporta cento byte per microsecondo, equivalenti a 100 MB/s decimali. Gli 800 byte utili richiedono quindi otto microsecondi di serializzazione. I due microsecondi di controllo portano la durata completa a dieci; dividendo gli 800 byte utili per l’intero intervallo si ottengono 80 byte per microsecondo, cioè 80 MB/s di banda utile."
    ],
    "introduzione": [
      "L’esercitazione serve a misurare la banda utile sull’intera durata della transazione. La serializzazione è il tempo necessario perché tutti i byte attraversino il collegamento; il controllo del protocollo occupa altro tempo. Dividendo il solo contenuto utile per la somma delle due durate, potrai spiegare perché la velocità durante il passaggio dei dati superi la banda ottenuta per la richiesta completa.",
      "Premi «Carica l’esempio guidato» e calcola «Durata (µs)» per gli ottocento byte prima di usare «Registra la previsione». Avanza con «Passo successivo», confrontando gli otto microsecondi dei dati con i dieci complessivi. Nella verifica della banda, mantieni ottocento byte al numeratore e usa tutta la durata al denominatore, ricordando l’equivalenza fra B/µs e MB/s decimali."
    ],
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 1 «Misurare tempo e banda utile», traccia 1. La spiegazione seguente si riferisce a questi dati.",
      "Leggi la consegna: Un collegamento serializza 800 B di carico utile a 100 MB/s decimali. La transazione aggiunge 2 µs di controllo. Calcola la durata totale in µs e la banda utile in MB/s.",
      "Calcola il primo campo «Durata (µs)» e premi «Registra la previsione» per avviare la ricostruzione. Il riscontro permette di confrontare il tuo risultato con i passaggi successivi.",
      "Segui la ricostruzione fino alla verifica dei campi; con «Apri la prova completa» puoi inserire tutte le risposte. Cambiando esercizio o traccia, rileggi la nuova consegna e usa i relativi dati."
    ],
    "risultato": "Nell’esercizio 1, traccia 1, si ottiene: Durata (µs) = 10; Banda utile (MB/s) = 80.",
    "ragionamento": "La serializzazione dura 800 / 100 = 8 µs. Il controllo aggiunge 2 µs, per un totale di 10 µs. La banda utile vale 800 / 10 = 80 B/µs. Un byte per microsecondo equivale a un megabyte decimale al secondo."
  },
  "4.4.8": {
    "scopo": "La posizione dell’ultimo servito determina l’inizio della rotazione round-robin. Ricostruirai l’ordine C, A, B e calcolerai l’attesa di B prima della propria concessione.",
    "lettura": "I turni si leggono come intervalli con inizio incluso e fine esclusa. Alla fine di un turno comincia il successivo, perciò il confine 6 rappresenta insieme la fine del servizio di A e l’istante in cui B ottiene il bus.",
    "conclusione": "L’attesa termina alla concessione e comprende soltanto i turni precedenti. Aggiungere il turno del richiedente misura invece il tempo fino al completamento.",
    "teoria": [
      "Se più dispositivi vogliono utilizzare lo stesso bus, cioè un collegamento condiviso, un arbitro decide a chi concederlo. Un turno occupa un intervallo che ha un inizio e una fine. Il dispositivo che attende la concessione e quello che ha già iniziato a trasmettere si trovano in condizioni diverse.",
      "Con la politica a priorità fissa si sceglie, a ogni concessione, la domanda pendente di rango più alto. Il round-robin percorre invece una lista circolare a partire dal successore dell’ultimo servito, saltando chi è privo di richieste. Per riconoscere la politica da una traccia conviene cercare un istante in cui i due criteri sceglierebbero dispositivi diversi.",
      "Nella traccia iniziale A, B e C chiedono il bus al ciclo zero e l’ultimo servito era B. Il round-robin riparte da C, seguito da A e da B. Con turni da tre cicli, C occupa l’intervallo da zero a tre, A quello da tre a sei e B inizia al confine sei. L’attesa di B dura sei cicli; il suo turno comincia proprio dove termina l’attesa."
    ],
    "introduzione": [
      "Ricostruire la rotazione delle concessioni permette di calcolare l’attesa senza confonderla con il tempo necessario a completare il trasferimento. Il round-robin visita una lista circolare ripartendo dal successore dell’ultimo servito. In questa attività A, B e C chiedono insieme il bus: la durata dei turni che precedono B determina il confine temporale in cui può iniziare il suo servizio.",
      "Carica l’esempio guidato con B ultimo servito e turni di tre cicli, quindi prevedi chi debba partire. Avanza con «Passo successivo», seguendo C e A prima di B. Confronta i confini zero, tre e sei e verifica che l’attesa termini all’inizio del turno di B; «Precedente» permette di rileggere i soli intervalli che contribuiscono ai sei cicli attesi."
    ],
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 3 «Misurare l’attesa per una concessione», traccia 1. La spiegazione seguente si riferisce a questi dati.",
      "Leggi la consegna: A, B, C chiedono il bus al ciclo zero. Con round-robin in ordine circolare A, B, C l’ultimo servito era B. Ogni turno dura 3 cicli. Chi parte per primo e quanti cicli attende B?",
      "Ricostruisci il primo campo «Primo» prima di leggere lo svolgimento. Avanza con «Passo successivo» e controlla i dati impiegati in ciascuna operazione.",
      "Segui la ricostruzione fino alla verifica dei campi; con «Apri la prova completa» puoi inserire tutte le risposte. Cambiando esercizio o traccia, rileggi la nuova consegna e usa i relativi dati."
    ],
    "risultato": "Nell’esercizio 3, traccia 1, si ottiene: Primo = C; Attesa di B (cicli) = 6.",
    "ragionamento": "Il successore di B è C. La sequenza delle concessioni è C, A, B. C occupa i cicli da 0 a 3 e A quelli da 3 a 6, con estremo finale escluso. B parte all’istante 6 dopo due turni di attesa."
  },
  "4.5.1": {
    "scopo": "Prima di leggere un settore magnetico la testina deve raggiungerne il cilindro e attenderne il passaggio. Confronterai due velocità di rotazione tenendo fissi il seek e la fase residua misurata all’arrivo della testina.",
    "lettura": "Le circonferenze rappresentano le piste; il punto evidenzia l’inizio del settore e il braccio la testina. L’arco seguito nella rotazione residua misura la frazione di giro necessaria. I tempi numerici distinguono il movimento radiale dalla rotazione e si fermano al primo byte.",
    "conclusione": "Seek e rotazione residua contribuiscono entrambi alla latenza iniziale. Aumentare i giri al minuto riduce la seconda componente; per conoscere il tempo dell’intero settore occorrerebbe aggiungere il successivo trasferimento.",
    "controlli": {
      "rpm": "Giri compiuti in un minuto. Il periodo di un giro in millisecondi è 60 000 diviso questo valore.",
      "f": "Ottavi di giro fra la posizione del settore e la testina al termine del seek. È una fase del singolo accesso; quattro ottavi corrispondono anche alla media di una fase uniforme.",
      "s": "Durata del movimento radiale verso il cilindro richiesto, in millisecondi. Il modello aggiunge poi l’attesa angolare residua."
    },
    "teoria": [
      "Un disco magnetico conserva i dati su piste circolari di superfici che ruotano. La testina di lettura può spostarsi radialmente per raggiungere la pista desiderata. Le piste che si trovano alla stessa distanza dal centro, sulle diverse superfici, formano un cilindro. Il tempo necessario allo spostamento verso il cilindro richiesto prende il nome di seek. La sigla rpm indica giri per minuto. Un minuto contiene sessanta secondi e quindi 60000 millisecondi, poiché un millisecondo, ms, vale un millesimo di secondo; dividere 60000 per i giri al minuto restituisce i millisecondi necessari a un giro.",
      "Anche con la testina sul cilindro giusto, occorre che la parte della pista contenente i dati, detta settore, passi sotto la testina. Nel primo caso il disco ruota a 5400 giri al minuto e un giro dura 60 000 / 5400, circa 11,11 millisecondi. Se all’arrivo della testina manca mezzo giro, si attendono ancora circa 5,56 millisecondi. A 7200 giri al minuto le due durate scendono a circa 8,33 e 4,17 millisecondi.",
      "Con un seek di sei millisecondi, il primo byte diventa accessibile dopo circa 11,56 millisecondi a 5400 giri/min, oppure 10,17 a 7200. La posizione del settore si valuta al termine del seek, perché il disco ha continuato a ruotare durante lo spostamento. Mezzo giro è l’attesa media se tutte le posizioni angolari sono equiprobabili; per una singola lettura la rotazione residua può anche essere nulla."
    ],
    "introduzione": [
      "La simulazione serve a spiegare da dove provenga l’attesa prima che un disco magnetico possa leggere il primo byte. Il seek sposta la testina verso il cilindro richiesto; la rotazione residua porta poi l’inizio del settore sotto la testina. Tenendo fissi seek e posizione angolare misurata al suo termine, potrai isolare l’effetto della velocità espressa in giri al minuto.",
      "Carica il caso a 5400 giri al minuto e avanza con «Passo successivo», distinguendo il movimento radiale dall’arco residuo di mezzo giro. Fissa il risultato e confronta il caso a 7200 giri. Leggi periodo, attesa angolare e latenza al primo byte: il seek rimane sei millisecondi, mentre cambia la componente rotazionale; il trasferimento del settore deve ancora iniziare."
    ],
    "esperienze": [
      {
        "titolo": "Mezzo giro a 5400 giri al minuto",
        "parametri": {
          "rpm": "5400",
          "f": 4,
          "s": 6
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Velocità (giri/min) = 5400; Ottavi di giro ancora da attendere = 4; Tempo di seek (ms) = 6.",
          "Leggi il passo «Posizionamento». Annota Seek (ms) = 6; Periodo di un giro (ms) = 11.1111. Prima di avanzare, formula la previsione richiesta nel campo «Latenza al primo byte (ms, fino a quattro decimali)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Rotazione residua». Annota Frazione del giro = 4/8; Attesa di questo settore (ms) = 5.5556; Attesa media su una fase uniforme (ms) = 5.5556.",
          "Premi «Passo successivo» e fermati su «Primo byte». Annota Latenza al primo byte (ms) = 11.5556; Lettura del settore = da iniziare."
        ],
        "risultato": "Nel passo «Primo byte» il risultato è: Latenza al primo byte (ms) = 11.5556; Lettura del settore = da iniziare.",
        "ragionamento": "Un giro dura 60 000 / 5400 ≈ 11,1111 ms. Quattro ottavi richiedono circa 5,5556 ms; aggiungendo 6 ms di seek si raggiunge il primo byte dopo circa 11,5556 ms.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Frazione del giro",
            "valore": "4/8"
          },
          {
            "passo": 1,
            "campo": "Attesa di questo settore (ms)",
            "valore": "5.5556"
          },
          {
            "passo": 1,
            "campo": "Attesa media su una fase uniforme (ms)",
            "valore": "5.5556"
          },
          {
            "passo": 2,
            "campo": "Latenza al primo byte (ms)",
            "valore": "11.5556"
          },
          {
            "passo": 2,
            "campo": "Lettura del settore",
            "valore": "da iniziare"
          }
        ]
      },
      {
        "titolo": "Mezzo giro a 7200 giri al minuto",
        "parametri": {
          "rpm": "7200",
          "f": 4,
          "s": 6
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Velocità (giri/min) = 7200; Ottavi di giro ancora da attendere = 4; Tempo di seek (ms) = 6.",
          "Leggi il passo «Posizionamento». Annota Seek (ms) = 6; Periodo di un giro (ms) = 8.3333. Prima di avanzare, formula la previsione richiesta nel campo «Latenza al primo byte (ms, fino a quattro decimali)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Rotazione residua». Annota Frazione del giro = 4/8; Attesa di questo settore (ms) = 4.1667; Attesa media su una fase uniforme (ms) = 4.1667.",
          "Premi «Passo successivo» e fermati su «Primo byte». Annota Latenza al primo byte (ms) = 10.1667; Lettura del settore = da iniziare."
        ],
        "risultato": "Nel passo «Primo byte» il risultato è: Latenza al primo byte (ms) = 10.1667; Lettura del settore = da iniziare.",
        "ragionamento": "A 7200 giri/min il periodo scende a circa 8,3333 ms e mezzo giro a 4,1667 ms. Il seek resta 6 ms, quindi la latenza iniziale è circa 10,1667 ms; i valori visualizzati sono arrotondati a quattro decimali.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Frazione del giro",
            "valore": "4/8"
          },
          {
            "passo": 1,
            "campo": "Attesa di questo settore (ms)",
            "valore": "4.1667"
          },
          {
            "passo": 1,
            "campo": "Attesa media su una fase uniforme (ms)",
            "valore": "4.1667"
          },
          {
            "passo": 2,
            "campo": "Latenza al primo byte (ms)",
            "valore": "10.1667"
          },
          {
            "passo": 2,
            "campo": "Lettura del settore",
            "valore": "da iniziare"
          }
        ]
      }
    ]
  },
  "4.5.2": {
    "scopo": "Una richiesta al disco usa numeri di blocco, mentre la durata del trasferimento dipende dai byte. Ricostruirai l’intervallo LBA e il costo di servizio, aumentando la lunghezza di una lettura sequenziale a posizionamento invariato.",
    "lettura": "Le celle superiori sono i blocchi consecutivi; la finestra ne mostra al massimo dieci, mentre «Ultimo LBA» indica il termine dell’intera richiesta. La barra temporale somma accesso iniziale e passaggio dei dati, con larghezze proporzionali alle durate.",
    "conclusione": "La quantità di dati cresce con il numero di blocchi, mentre in questo accesso sequenziale seek e rotazione si pagano una volta sola. Per richieste brevi il posizionamento può dominare il servizio anche quando il trasferimento è veloce.",
    "controlli": {
      "l": "Numero del primo blocco logico, contando da zero. Moltiplicalo per i byte di un blocco per ricavare l’offset iniziale.",
      "n": "Numero di blocchi consecutivi letti. L’ultimo LBA incluso è il primo più questo conteggio meno uno.",
      "b": "Dimensione di ciascun blocco in byte. Determina sia l’offset del primo blocco sia la quantità totale da trasferire.",
      "seek": "Tempo di posizionamento della testina, in millisecondi, pagato una volta all’inizio.",
      "rot": "Attesa del primo settore, in millisecondi. Segue il seek e precede il trasferimento a 128 byte per microsecondo."
    },
    "teoria": [
      "Per chiedere dati a un disco si possono numerare blocchi di uguale dimensione a partire da zero, lasciando al dispositivo il compito di trovarli sulla superficie. LBA indica proprio il numero di un blocco in questo spazio logico. Se ciascun blocco contiene 512 byte, il primo comincia al byte zero e il blocco 20 comincia al byte 20 × 512 = 10 240. Il seek è il movimento della testina fino alla traccia da leggere. I tempi di accesso e di copia devono essere espressi nella stessa unità: un millisecondo contiene mille microsecondi, quindi sei millisecondi equivalgono a 6000 µs.",
      "Una lettura di otto blocchi consecutivi a partire dal numero 20 comprende i blocchi dal 20 al 27 e chiede 4096 byte. Il tempo per trasferirli dipende dalla velocità del flusso. A 128 milioni di byte al secondo passano 128 byte in un microsecondo, perciò quei 4096 byte richiedono 32 microsecondi.",
      "Prima del trasferimento il disco deve portare la testina sul cilindro giusto e attendere la rotazione del primo settore. Nell’esperimento i blocchi si leggono in sequenza, pagando questi due intervalli una volta sola. Con quattro millisecondi di posizionamento e due di rotazione si parte da 6000 microsecondi, ai quali si somma la durata del passaggio dei dati."
    ],
    "introduzione": [
      "Passare dai blocchi logici ai byte permette di calcolare sia la posizione sia il tempo di una lettura sequenziale. LBA è l’indice del blocco, contato da zero; l’offset iniziale vale indice per dimensione del blocco. La simulazione serve a confrontare richieste di lunghezza diversa, nelle quali seek e attesa del primo settore vengono pagati una volta mentre il tempo dei dati cresce.",
      "Carica gli otto blocchi da LBA venti e segui con «Passo successivo» ultimo blocco incluso, byte richiesti e durata. Confronta poi i sessantaquattro blocchi dallo stesso punto dopo «Fissa per confronto». La figura mostra al massimo dieci blocchi: usa «Ultimo LBA» per l’intervallo completo e la barra temporale per distinguere i seimila microsecondi iniziali dal trasferimento aggiunto."
    ],
    "esperienze": [
      {
        "titolo": "Otto blocchi consecutivi",
        "parametri": {
          "l": 20,
          "n": 8,
          "b": "512",
          "seek": 4,
          "rot": 2
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: LBA iniziale = 20; Blocchi consecutivi = 8; Dimensione del blocco (B) = 512; Seek (ms) = 4; Attesa di rotazione (ms) = 2.",
          "Leggi il passo «Spazio logico». Annota Primo LBA = 20; Ultimo LBA = 27; Offset iniziale (B) = 10240. Prima di avanzare, prevedi il valore finale del campo «Tempo totale (µs)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Trasferimento». Annota Byte richiesti = 4096; Trasferimento (µs) = 32.",
          "Premi «Passo successivo» e fermati su «Servizio». Annota Accesso (µs) = 6000; Tempo totale (µs) = 6032."
        ],
        "risultato": "Nel passo «Servizio» il risultato è: Accesso (µs) = 6000; Tempo totale (µs) = 6032.",
        "ragionamento": "Otto blocchi da 512 B occupano 4096 B, da LBA 20 a 27. Il trasferimento dura 4096 / 128 = 32 µs; seek e rotazione aggiungono (4 + 2) × 1000 = 6000 µs, per un totale di 6032 µs.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Byte richiesti",
            "valore": "4096"
          },
          {
            "passo": 1,
            "campo": "Trasferimento (µs)",
            "valore": "32"
          },
          {
            "passo": 2,
            "campo": "Accesso (µs)",
            "valore": "6000"
          },
          {
            "passo": 2,
            "campo": "Tempo totale (µs)",
            "valore": "6032"
          }
        ]
      },
      {
        "titolo": "Sessantaquattro blocchi dallo stesso LBA",
        "parametri": {
          "l": 20,
          "n": 64,
          "b": "512",
          "seek": 4,
          "rot": 2
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: LBA iniziale = 20; Blocchi consecutivi = 64; Dimensione del blocco (B) = 512; Seek (ms) = 4; Attesa di rotazione (ms) = 2.",
          "Leggi il passo «Spazio logico». Annota Primo LBA = 20; Ultimo LBA = 83; Offset iniziale (B) = 10240. Prima di avanzare, prevedi il valore finale del campo «Tempo totale (µs)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Trasferimento». Annota Byte richiesti = 32768; Trasferimento (µs) = 256.",
          "Premi «Passo successivo» e fermati su «Servizio». Annota Accesso (µs) = 6000; Tempo totale (µs) = 6256."
        ],
        "risultato": "Nel passo «Servizio» il risultato è: Accesso (µs) = 6000; Tempo totale (µs) = 6256.",
        "ragionamento": "Sessantaquattro blocchi da 512 B occupano 32768 B, da LBA 20 a 83. Il trasferimento richiede 256 µs; l’accesso iniziale resta 6000 µs e il totale diventa 6256 µs, perché la sequenza paga il posizionamento una sola volta.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Byte richiesti",
            "valore": "32768"
          },
          {
            "passo": 1,
            "campo": "Trasferimento (µs)",
            "valore": "256"
          },
          {
            "passo": 2,
            "campo": "Accesso (µs)",
            "valore": "6000"
          },
          {
            "passo": 2,
            "campo": "Tempo totale (µs)",
            "valore": "6256"
          }
        ]
      }
    ]
  },
  "4.5.3": {
    "scopo": "Tre letture attendono una testina situata al cilindro 40. Confronterai l’ordine di arrivo con la scelta della richiesta più vicina, calcolando a ogni spostamento il cammino cumulativo.",
    "lettura": "L’asse orizzontale riporta i cilindri. Ogni segmento collega due posizioni successive della testina, mentre il percorso scende per distinguere i diversi interventi. Conta la distanza orizzontale di ciascun tratto in valore assoluto; il dato cumulativo somma il lavoro già svolto.",
    "conclusione": "L’ordine di servizio cambia il cammino anche per lo stesso insieme di richieste. La riduzione della distanza in questo esempio riguarda un modello privo di rotazione; da sola è insufficiente a determinare equità o latenza in una coda reale variabile.",
    "controlli": {
      "pos": "Cilindro della testina prima di servire la coda di arrivo 80, 15, 55.",
      "p": "FCFS conserva l’ordine di arrivo; SSTF sceglie a ogni passo il cilindro richiesto più vicino alla posizione corrente.",
      "cache": "La cache può soddisfare subito il blocco sul cilindro 80. In quel caso quella richiesta viene rimossa dal lavoro meccanico della testina."
    },
    "teoria": [
      "La testina di un disco magnetico deve portarsi alla distanza dal centro alla quale si trova il dato. Il numero di cilindro identifica questa posizione radiale. Se arrivano più letture, l’ordine in cui il disco le serve può cambiare il cammino della testina anche quando l’insieme dei dati richiesti rimane lo stesso.",
      "La disciplina FCFS, dall’inglese First Come, First Served, rispetta l’ordine di arrivo. Partendo dal cilindro 40 e seguendo la coda 80, 15, 55, la testina percorre prima 40 cilindri, poi 65 e infine 40, per un totale di 145. La politica SSTF, Shortest Seek Time First, sceglie nel modello il cilindro con la minore distanza dalla posizione attuale. Il primo diventa 55. Da quella nuova posizione 80 è più vicino di 15, perciò l’ordine viene ricalcolato a ogni lettura.",
      "Un blocco può essere già disponibile nella cache, una memoria più veloce che ne conserva una copia. Quando la richiesta per il cilindro 80 viene soddisfatta dalla cache, quel cilindro scompare dall’itinerario fisico. Il conteggio misura gli spostamenti radiali, lasciando fuori l’attesa dovuta alla rotazione."
    ],
    "introduzione": [
      "L’attività serve a osservare come l’ordine delle letture cambi il movimento della testina per la stessa coda. FCFS conserva l’ordine di arrivo; SSTF sceglie ogni volta il cilindro più vicino alla posizione corrente. Il cammino somma le distanze assolute dei singoli tratti. La cache, una memoria che conserva copie dei dati, può inoltre eliminare una richiesta dal lavoro meccanico.",
      "Carica FCFS dalla posizione quaranta e avanza con «Passo successivo», sommando ciascuno spostamento lungo il percorso. Fissa il risultato e confronta SSTF, ricalcolando la vicinanza dopo ogni arrivo. Seleziona poi nella cache il blocco sul cilindro ottanta e applica i parametri: osserva quale tappa scompaia e interpreta il totale come distanza radiale, con la rotazione esclusa dal modello."
    ],
    "esperienze": [
      {
        "titolo": "Ordine di arrivo FCFS",
        "parametri": {
          "pos": 40,
          "p": "fcfs",
          "cache": "vuota"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Cilindro iniziale = 40; Disciplina = FCFS; Contenuto della cache = Vuota.",
          "Leggi il passo «Coda di arrivo». Annota Testina = 40; Servite dalla cache = 0; Coda disco = 80, 15, 55. Prima di avanzare, prevedi il valore finale del campo «Cammino cumulativo» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Lettura sul cilindro 80». Annota Spostamento = 40; Cammino cumulativo = 40.",
          "Premi «Passo successivo» e fermati su «Lettura sul cilindro 15». Annota Spostamento = 65; Cammino cumulativo = 105.",
          "Premi «Passo successivo» e fermati su «Lettura sul cilindro 55». Annota Spostamento = 40; Cammino cumulativo = 145."
        ],
        "risultato": "Nel passo «Lettura sul cilindro 55» il risultato è: Spostamento = 40; Cammino cumulativo = 145.",
        "ragionamento": "Il percorso FCFS è 40 → 80 → 15 → 55. Le distanze sono 40, 65 e 40 cilindri, quindi il totale è 145.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Spostamento",
            "valore": "65"
          },
          {
            "passo": 2,
            "campo": "Cammino cumulativo",
            "valore": "105"
          },
          {
            "passo": 3,
            "campo": "Spostamento",
            "valore": "40"
          },
          {
            "passo": 3,
            "campo": "Cammino cumulativo",
            "valore": "145"
          }
        ]
      },
      {
        "titolo": "Richiesta più vicina con SSTF",
        "parametri": {
          "pos": 40,
          "p": "sstf",
          "cache": "vuota"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Cilindro iniziale = 40; Disciplina = SSTF; Contenuto della cache = Vuota.",
          "Leggi il passo «Coda di arrivo». Annota Testina = 40; Servite dalla cache = 0; Coda disco = 80, 15, 55. Prima di avanzare, prevedi il valore finale del campo «Cammino cumulativo» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Lettura sul cilindro 55». Annota Spostamento = 15; Cammino cumulativo = 15.",
          "Premi «Passo successivo» e fermati su «Lettura sul cilindro 80». Annota Spostamento = 25; Cammino cumulativo = 40.",
          "Premi «Passo successivo» e fermati su «Lettura sul cilindro 15». Annota Spostamento = 65; Cammino cumulativo = 105."
        ],
        "risultato": "Nel passo «Lettura sul cilindro 15» il risultato è: Spostamento = 65; Cammino cumulativo = 105.",
        "ragionamento": "Da 40 la richiesta più vicina è 55, poi da 55 si raggiunge 80 e infine 15. Il cammino misura 15 + 25 + 65 = 105 cilindri, quaranta in meno rispetto alla stessa coda servita in ordine di arrivo.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Spostamento",
            "valore": "25"
          },
          {
            "passo": 2,
            "campo": "Cammino cumulativo",
            "valore": "40"
          },
          {
            "passo": 3,
            "campo": "Spostamento",
            "valore": "65"
          },
          {
            "passo": 3,
            "campo": "Cammino cumulativo",
            "valore": "105"
          }
        ]
      }
    ]
  },
  "4.5.4": {
    "scopo": "Un file può richiedere un ultimo blocco solo in parte occupato. Calcolerai quanti blocchi interi servono per 10 000 byte e misurerai lo spazio assegnato che rimane inutilizzato.",
    "lettura": "I blocchi pieni e l’ultimo parziale sono unità di allocazione della stessa dimensione. Confronta il limite di due blocchi, 8192 byte, con la dimensione del file; il terzo blocco ospita il residuo e lascia una parte vuota.",
    "conclusione": "L’allocazione a blocchi interi arrotonda la dimensione richiesta al multiplo superiore. Lo spazio inutilizzato è la differenza fra capacità riservata e byte effettivi del file, riferita qui ai soli dati.",
    "teoria": [
      "Il volume è lo spazio di archiviazione che il file system, il programma incaricato di organizzare file e directory, divide in blocchi da assegnare ai file. Ogni assegnazione riserva un blocco intero di dimensione fissa. Il numero di byte scritti dal programma misura la lunghezza del file. Il numero di byte riservati sul disco dipende anche dall’unità minima di assegnazione. Se dopo avere riempito alcuni blocchi rimane anche un solo byte, quel byte richiede un altro blocco intero.",
      "Il file del problema contiene 10 000 byte e il volume assegna blocchi da 4096 byte. Due blocchi accolgono 8192 byte, lasciandone ancora 1808 da conservare. Il terzo blocco porta la capacità assegnata a 12 288 byte e lascia liberi 4096 − 1808 = 2288 byte al proprio interno. La differenza fra capacità assegnata e lunghezza del file dà lo stesso risultato.",
      "Questo spazio riservato e rimasto inutilizzato si chiama frammentazione interna, perché si trova entro i confini di un blocco già assegnato. Nella figura conviene distinguere il bordo dell’ultimo blocco dal punto in cui terminano i dati. Se il file riempie esattamente un numero intero di blocchi, i due punti coincidono."
    ],
    "introduzione": [
      "Calcolare lo spazio riservato a un file richiede di considerare che l’allocazione assegna blocchi interi. Questa ricostruzione serve a confrontare lunghezza effettiva e capacità assegnata: un residuo oltre i blocchi pieni richiede un ulteriore blocco. La sua parte inutilizzata è detta frammentazione interna, perché rimane entro un’unità già riservata al file e dipende dall’arrotondamento verso l’alto.",
      "Leggi il file da diecimila byte e i blocchi da 4096, quindi scrivi la previsione dei byte inutilizzati. Avanza con «Passo successivo», confrontando la capacità di due blocchi con i dati ancora da collocare. Nel risultato finale verifica i 2288 byte sia sottraendo la lunghezza dalla capacità assegnata sia confrontando il residuo del file con l’ultimo blocco intero."
    ],
    "procedura": [
      "Leggi i dati iniziali: Il file occupa 10 000 byte. Il volume assegna blocchi interi da 4096 byte. Si considera soltanto lo spazio riservato ai dati del file.",
      "Prima di avviare la ricostruzione, scrivi una previsione per questa domanda: Quanti byte assegnati restano inutilizzati?",
      "Premi «Passo successivo» per attraversare «Dati iniziali», «Blocchi necessari», «Spazio residuo». A ogni passaggio confronta le quantità indicate con il ragionamento teorico.",
      "Raggiungi l’ultimo fotogramma e confronta la previsione con il risultato. Usa «Precedente» per rileggere il passaggio che determina il valore finale."
    ],
    "risultato": "Per la domanda «Quanti byte assegnati restano inutilizzati?» il valore atteso è 2288.",
    "ragionamento": "Il file contiene 10.000 byte e l’unità minima di allocazione è un blocco da 4096 byte. Due blocchi contengono 8192 byte. I rimanenti 1808 byte richiedono un terzo blocco. Tre blocchi riservano 3 × 4096 = 12 288 byte. Nel blocco finale restano inutilizzati 12 288 − 10 000 = 2288 byte."
  },
  "4.5.5": {
    "scopo": "Una richiesta al disco trascorre tempo in coda prima di essere posizionata e trasferita. Ricostruirai il tempo di risposta di una lettura da 1,2 MB, mantenendo separate le componenti che precedono il flusso dei dati.",
    "lettura": "La ricostruzione accosta coda, posizionamento e trasferimento in ordine temporale. Il rapporto fra dimensione e banda produce inizialmente secondi; la conversione in millisecondi consente di sommarlo agli altri intervalli.",
    "conclusione": "Il tempo di risposta si misura dall’arrivo della richiesta al completamento. Include la coda oltre al servizio del dispositivo, quindi la sola banda di trasferimento descrive soltanto una delle sue componenti.",
    "teoria": [
      "Su un disco magnetico la testina deve raggiungere la pista corretta e attendere che la rotazione porti il settore sotto di essa. Solo allora possono passare i dati. Una richiesta arrivata mentre il disco sta servendo qualcun altro trascorre inoltre del tempo in coda.",
      "L’intervallo trascorso dal disco per servire una richiesta comprende il posizionamento e il trasferimento. La risposta vista dal richiedente comprende anche la coda. Con una banda in megabyte al secondo, dividere i megabyte richiesti per quella banda dà un risultato in secondi.",
      "Nella richiesta iniziale 1,2 MB a 150 MB/s richiedono 1,2 / 150 = 0,008 secondi, cioè otto millisecondi. Il posizionamento aggiunge cinque millisecondi e la coda altri tre, portando la risposta a sedici millisecondi. Aumentare la banda riduce la sola fase dei dati; le altre due componenti conservano la propria durata finché le relative condizioni restano uguali."
    ],
    "introduzione": [
      "Ricostruire il tempo visto dal richiedente è lo scopo dell’esercitazione, che separa coda, posizionamento e trasferimento dei dati. La coda precede il servizio del disco; il posizionamento prepara l’accesso al settore e la banda determina la sola durata della copia. Per ottenere la risposta completa occorre convertire il rapporto fra quantità e velocità nella stessa unità degli altri intervalli.",
      "Premi «Carica l’esempio guidato» per la richiesta da 1,2 MB e calcola «Trasferimento (ms)» prima di registrare la previsione. Con «Passo successivo» segui la conversione di 0,008 secondi in otto millisecondi, poi aggiungi posizionamento e coda. Confronta gli otto millisecondi della copia con i sedici della risposta, attribuendo ogni intervallo alla fase che lo produce."
    ],
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 4 «Calcolare tempo di trasferimento e risposta», traccia 1. La spiegazione seguente si riferisce a questi dati.",
      "Leggi la consegna: Una richiesta di 1,2 MB decimali viene servita a 150 MB/s. Attende 3 ms in coda e paga 5 ms di posizionamento complessivo. Calcola trasferimento e tempo di risposta in millisecondi.",
      "Calcola il primo campo «Trasferimento (ms)» e premi «Registra la previsione» per avviare la ricostruzione. Il riscontro permette di confrontare il tuo risultato con i passaggi successivi.",
      "Segui la ricostruzione fino alla verifica dei campi; con «Apri la prova completa» puoi inserire tutte le risposte. Cambiando esercizio o traccia, rileggi la nuova consegna e usa i relativi dati."
    ],
    "risultato": "Nell’esercizio 4, traccia 1, si ottiene: Trasferimento (ms) = 8; Risposta (ms) = 16.",
    "ragionamento": "La durata del trasferimento vale 1,2 / 150 = 0,008 s. Moltiplicando per 1000 si ottengono 8 ms di trasferimento. La risposta dura 3 + 5 + 8 = 16 ms, includendo la coda."
  },
  "4.5.6": {
    "scopo": "Una testina visita tre cilindri in ordine FCFS. Calcolerai ciascuno spostamento e la somma delle distanze, distinguendo la posizione finale dal cammino realmente percorso.",
    "lettura": "Ogni segmento collega la posizione precedente alla destinazione successiva. I tratti verso cilindri minori contribuiscono con distanza positiva esattamente come quelli verso cilindri maggiori. La posizione finale è l’ultima richiesta servita.",
    "conclusione": "Il cammino totale è una somma di distanze assolute, mentre lo spostamento netto confronta soltanto inizio e fine. Per stimare il movimento meccanico serve ricostruire tutti i tratti della politica di servizio.",
    "teoria": [
      "Le piste di un disco magnetico si distinguono anche per la distanza dal centro. I numeri di cilindro permettono di rappresentare le successive posizioni radiali della testina. In un modello che trascura la rotazione, il movimento fra due cilindri si misura con la differenza, in valore assoluto, dei loro numeri. Le barre verticali di |b − a| indicano il valore assoluto: si sottraggono le posizioni dei cilindri e si prende la grandezza positiva della differenza. Ogni tragitto aggiunge così la propria distanza anche quando la testina cambia direzione.",
      "Per contare i cilindri attraversati si misura lo spostamento di ciascun tratto e poi si sommano tutte le distanze. Un tratto verso numeri decrescenti richiede movimento quanto un tratto uguale verso numeri crescenti, anche se i due avrebbero segni opposti in una somma di posizioni.",
      "Nella traccia iniziale la testina parte da 45 e visita 75, 15 e 60. Il cammino vale |75 − 45| + |15 − 75| + |60 − 15| = 30 + 60 + 45 = 135 cilindri. La politica FCFS, first come, first served, mantiene questo ordine di arrivo. SSTF, shortest seek time first, sceglierebbe di volta in volta la richiesta più vicina alla posizione appena raggiunta, producendo un itinerario da ricostruire separatamente."
    ],
    "introduzione": [
      "Questa ricostruzione serve a distinguere il cammino effettivo della testina dalla differenza fra posizione iniziale e finale. Un cilindro identifica la posizione radiale delle piste; ogni spostamento contribuisce con la propria distanza, anche quando cambia direzione. La disciplina FCFS mantiene l’ordine di arrivo, perciò il totale si ottiene sommando i tre tratti della sequenza prevista, trascurando la rotazione.",
      "Carica l’esempio guidato con partenza da quarantacinque e richieste settantacinque, quindici e sessanta. Prima di avanzare, prevedi il cammino usando distanze positive. Con «Passo successivo» confronta i tratti di trenta, sessanta e quarantacinque cilindri; alla verifica finale separa il totale 135 dalla posizione sessanta. Usa «Precedente» per controllare che ogni inversione aggiunga movimento al conteggio."
    ],
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 5 «Calcolare gli spostamenti della testina», traccia 1. La spiegazione seguente si riferisce a questi dati.",
      "Leggi la consegna: La testina è al cilindro 45. Sono già in coda 75, 15, 60 in questo ordine. Con FCFS e rotazione trascurata calcola cammino totale in cilindri e cilindro finale.",
      "Ricostruisci il primo campo «Cammino totale» prima di leggere lo svolgimento. Avanza con «Passo successivo» e controlla i dati impiegati in ciascuna operazione.",
      "Segui la ricostruzione fino alla verifica dei campi; con «Apri la prova completa» puoi inserire tutte le risposte. Cambiando esercizio o traccia, rileggi la nuova consegna e usa i relativi dati."
    ],
    "risultato": "Nell’esercizio 5, traccia 1, si ottiene: Cammino totale = 135; Cilindro finale = 60.",
    "ragionamento": "Il primo tratto 45 → 75 percorre 30 cilindri. Il secondo tratto 75 → 15 percorre 60 cilindri e il terzo 15 → 60 ne percorre 45. Il totale vale 30 + 60 + 45 = 135 cilindri e la testina termina a 60."
  },
  "4.6.1": {
    "scopo": "Un insieme di dischi conserva dati e ridondanza secondo un’organizzazione RAID. Studierai quanta capacità utile rimane e quali informazioni permettono di ricostruire una striscia quando scompaiono uno o due membri.",
    "lettura": "I quattro riquadri rappresentano membri fisici, ciascuno da 2 TB. Le lettere indicano blocchi di dati o parità nella striscia rappresentata; le croci segnano i membri guasti. Nel passo di ricostruzione RAID 5, la relazione XOR collega la parità ai dati superstiti. Il disegno riguarda una sola striscia: la posizione della parità può cambiare nelle strisce successive.",
    "conclusione": "La tolleranza ai guasti deriva dalle copie o dalle relazioni indipendenti ancora disponibili per ogni striscia. Il confronto assume blocchi integri sui superstiti e riguarda la leggibilità dell’intero volume, escludendo ulteriori errori durante il recupero.",
    "controlli": {
      "r": "Organizzazione dei quattro dischi: RAID 0 distribuisce; RAID 1 mantiene quattro copie; RAID 5 usa una parità; RAID 6 due; RAID 10 usa le coppie speculari 0–1 e 2–3.",
      "g": "Identità dei membri guasti. Le scelte 0 e 1 oppure 0 e 2 permettono anche di verificare il ruolo delle coppie in RAID 10."
    },
    "teoria": [
      "Quattro dischi possono presentarsi al sistema operativo come un unico volume, cioè un insieme di blocchi che si leggono e si scrivono attraverso una sola interfaccia. La sigla RAID identifica diverse organizzazioni di questi dischi. Il modo in cui si distribuiscono i dati determina sia quanta capacità resta utilizzabile sia quali letture si possono ancora compiere dopo un guasto.",
      "Con quattro dischi da due terabyte, ossia duemila miliardi di byte ciascuno, RAID 0 ripartisce blocchi distinti fra i membri e rende disponibili tutti gli otto terabyte. Basta perdere un disco per avere blocchi mancanti. Nello specchio RAID 1 a quattro copie ciascun disco contiene invece l’intero volume di due terabyte. RAID 10 combina distribuzione e copia. I membri 0 e 1 formano una coppia e i membri 2 e 3 un’altra. Se si guastano 0 e 2, sopravvive una copia per coppia. Se si guastano 0 e 1, si perde il contenuto della prima coppia.",
      "RAID 5 suddivide i blocchi in gruppi, o strisce, e per ciascuna striscia conserva una relazione di parità che consente di ricavare un blocco mancante dagli altri. I blocchi di parità si distribuiscono tra i membri nelle diverse strisce: nel complesso occupano la capacità equivalente a un disco, lasciando (4 − 1) × 2 = 6 TB utili. RAID 6 conserva due relazioni indipendenti per striscia e offre (4 − 2) × 2 = 4 TB utili, potendo ricostruire due blocchi mancanti. Le due coppie del RAID 10 forniscono invece 2 × 2 = 4 TB, purché sopravviva almeno un membro per coppia.",
      "Un byte contiene otto bit, ciascuno uguale a zero o uno. La parità semplice usa XOR, operazione che produce uno quando i due bit confrontati sono diversi e zero quando coincidono. Poiché applicare due volte XOR con lo stesso valore annulla quel contributo, da P = A XOR B XOR C si ricava A = P XOR B XOR C. Il prefisso 0x indica la base sedici: nel caso rappresentato P = 0x66, B = 0x31 e C = 0x42 corrispondono alle righe binarie 01100110, 00110001 e 01000010. Applicando XOR colonna per colonna si ottiene 00010101, cioè 0x15, il byte A recuperato. Due dati mancanti introducono invece due incognite nella sola relazione disponibile in RAID 5."
    ],
    "introduzione": [
      "Lo scopo dell’esperimento è collegare la capacità utile di un insieme RAID alle informazioni che consentono di leggere dopo un guasto. La ridondanza conserva copie oppure relazioni aggiuntive fra blocchi. In RAID 5 una parità per striscia, gruppo distribuito fra i dischi, permette di ricostruire un blocco mancante tramite XOR, operazione che confronta i bit nelle stesse posizioni.",
      "Carica RAID 5 con il solo membro zero assente e avanza con «Passo successivo», distinguendo capacità grezza, capacità utile e leggibilità. Segui poi la ricostruzione del byte A e confrontala con il caso di due dati mancanti. Cambiando organizzazione e applicando i parametri, osserva come copie o parità disponibili spieghino l’esito, assumendo integri i blocchi sui membri superstiti."
    ],
    "esperienze": [
      {
        "titolo": "RAID 5 con un membro assente",
        "parametri": {
          "r": "5",
          "g": "0"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Quattro dischi da 2 TB = RAID 5; Dischi guasti = Solo 0.",
          "Leggi il passo «Organizzazione». Annota Capacità grezza (TB) = 8; Capacità utile (TB) = 6. Prima di avanzare, formula la previsione richiesta nel campo «Intero volume leggibile (sì/no)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Guasti». Annota Dischi assenti = 0; Membri superstiti = 3.",
          "Premi «Passo successivo» e fermati su «Leggibilità». Annota Intero volume leggibile = sì; Esito = servizio degradato.",
          "Premi «Passo successivo» e fermati su «Ricostruzione di una stripe». Annota Membri di dati mancanti = 1; Byte A ricostruito = 0x15."
        ],
        "risultato": "Nel passo «Ricostruzione di una stripe» il risultato è: Membri di dati mancanti = 1; Byte A ricostruito = 0x15.",
        "ragionamento": "RAID 5 usa l’equivalente di un disco per la parità, lasciando (4 − 1) × 2 = 6 TB utili. Nella striscia mostrata A = P XOR B XOR C = 0x66 XOR 0x31 XOR 0x42 = 0x15, perciò un solo dato mancante è ricostruibile.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Intero volume leggibile",
            "valore": "sì"
          },
          {
            "passo": 2,
            "campo": "Esito",
            "valore": "servizio degradato"
          },
          {
            "passo": 3,
            "campo": "Membri di dati mancanti",
            "valore": "1"
          },
          {
            "passo": 3,
            "campo": "Byte A ricostruito",
            "valore": "0x15"
          }
        ]
      },
      {
        "titolo": "RAID 5 con due dati mancanti",
        "parametri": {
          "r": "5",
          "g": "01"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Quattro dischi da 2 TB = RAID 5; Dischi guasti = 0 e 1.",
          "Leggi il passo «Organizzazione». Annota Capacità grezza (TB) = 8; Capacità utile (TB) = 6. Prima di avanzare, formula la previsione richiesta nel campo «Intero volume leggibile (sì/no)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Guasti». Annota Dischi assenti = 0, 1; Membri superstiti = 2.",
          "Premi «Passo successivo» e fermati su «Leggibilità». Annota Intero volume leggibile = no; Esito = dati del volume incompleti.",
          "Premi «Passo successivo» e fermati su «Ricostruzione di una stripe». Annota Membri di dati mancanti = 2; Byte A ricostruito = indeterminato."
        ],
        "risultato": "Nel passo «Ricostruzione di una stripe» il risultato è: Membri di dati mancanti = 2; Byte A ricostruito = indeterminato.",
        "ragionamento": "Con i dischi 0 e 1 assenti mancano due dati della striscia, mentre rimane una sola relazione di parità. Esistono più coppie di valori compatibili con quella relazione: A resta indeterminato e la lettura dell’intero volume è compromessa.",
        "attesi": [
          {
            "passo": 2,
            "campo": "Intero volume leggibile",
            "valore": "no"
          },
          {
            "passo": 2,
            "campo": "Esito",
            "valore": "dati del volume incompleti"
          },
          {
            "passo": 3,
            "campo": "Membri di dati mancanti",
            "valore": "2"
          },
          {
            "passo": 3,
            "campo": "Byte A ricostruito",
            "valore": "indeterminato"
          }
        ]
      }
    ]
  },
  "4.6.2": {
    "scopo": "Una piccola modifica di un dato RAID richiede una parità coerente con il nuovo contenuto. Calcolerai l’aggiornamento bit per bit e userai poi la parità aggiornata per ricostruire proprio il membro modificato.",
    "lettura": "Le tre righe A, B e P allineano le stesse posizioni binarie: ogni colonna consente di applicare XOR. Quando A si guasta, le croci sostituiscono i suoi bit e la ricostruzione si ricava dalle righe B e P. Confronta il valore recuperato con A nuovo.",
    "conclusione": "La parità deve seguire ogni modifica dei dati. La relazione XOR consente sia di sostituire il contributo precedente durante una piccola scrittura sia di recuperare un dato mancante usando la parità aggiornata.",
    "controlli": {
      "a": "Byte A prima della modifica, in decimale. Con B determina la parità iniziale P = A XOR B.",
      "b": "Byte B che rimane invariato durante la scrittura di A e che sarà disponibile nella ricostruzione.",
      "n": "Nuovo byte da conservare in A. La simulazione aggiorna anche la parità e poi perde il membro A per verificare il recupero."
    },
    "teoria": [
      "Un byte è formato da otto bit, ciascuno uguale a zero oppure uno. Il prefisso 0x indica la base sedici, nella quale la cifra A vale dieci: per esempio 0xAA vale 10 × 16 + 10 = 170. Si può proteggere un gruppo di dati conservando, accanto ai byte originali, un byte di parità dal quale ricavare un elemento perduto. Il gruppo distribuito su più dischi si chiama striscia. Nel piccolo esempio RAID 5 i dati sono A e B. Il byte P si calcola applicando XOR, un’operazione che confronta le cifre binarie nella stessa posizione e scrive uno dove sono diverse, zero dove coincidono.",
      "Nel primo caso A = 85, scritto in esadecimale 0x55, e B = 51, scritto 0x33. Le sequenze binarie 01010101 e 00110011 producono la parità 01100110, cioè 0x66. Sostituendo A con 170, ossia 0xAA, la nuova parità è 10011001, cioè 0x99. La stessa correzione si ottiene da P vecchia XOR A vecchio XOR A nuovo: i due contributi del vecchio A si annullano.",
      "Per questa piccola scrittura il dispositivo legge il vecchio A e la vecchia P, poi scrive entrambi i nuovi valori. Se in seguito si perde il disco che contiene A, si recupera 0x33 XOR 0x99 = 0xAA. Nel secondo caso A viene portato a zero: la parità coincide allora con B, 0x33, e la ricostruzione di A produce zero applicando XOR a due valori uguali. Le righe mostrano un byte rappresentativo di ciascun blocco: le due letture e le due scritture conteggiate sono operazioni sui blocchi che contengono dati e parità. Il percorso assume che entrambi gli aggiornamenti si completino prima del guasto simulato."
    ],
    "introduzione": [
      "Aggiornare la parità insieme ai dati è necessario perché una successiva ricostruzione recuperi la versione corrente. La simulazione serve a seguire questa dipendenza su una striscia RAID, gruppo di blocchi distribuito fra membri diversi. XOR confronta i bit nella stessa posizione; applicandolo alla vecchia parità, al vecchio dato e al nuovo si sostituisce esattamente il contributo modificato.",
      "Carica la sostituzione di 0x55 con 0xAA e osserva le colonne binarie prima di avanzare con «Passo successivo». Confronta la parità iniziale 0x66 con quella aggiornata 0x99, poi verifica il recupero di A dopo il guasto. Fissa il caso e carica la scrittura di zero: spiega perché la nuova parità coincida con B e il recupero restituisca zero."
    ],
    "esperienze": [
      {
        "titolo": "Sostituzione di 0x55 con 0xAA",
        "parametri": {
          "a": 85,
          "b": 51,
          "n": 170
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Vecchio byte A = 85; Byte B = 51; Nuovo byte A = 170.",
          "Leggi il passo «Stripe iniziale». Annota A = 0x55; B = 0x33; P = 0x66. Prima di avanzare, formula la previsione richiesta nel campo «Parità dopo la scrittura» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Aggiornamento». Annota A nuovo = 0xAA; P nuova = 0x99; I/O di blocco = 2 letture + 2 scritture.",
          "Premi «Passo successivo» e fermati su «Perdita del membro A». Annota B XOR P nuova = 0xAA; Coincide con A nuovo = sì."
        ],
        "risultato": "Nel passo «Perdita del membro A» il risultato è: B XOR P nuova = 0xAA; Coincide con A nuovo = sì.",
        "ragionamento": "La parità iniziale è 0x55 XOR 0x33 = 0x66. Eliminando il vecchio contributo e aggiungendo il nuovo si ottiene 0x66 XOR 0x55 XOR 0xAA = 0x99; dopo il guasto 0x33 XOR 0x99 restituisce 0xAA.",
        "attesi": [
          {
            "passo": 1,
            "campo": "A nuovo",
            "valore": "0xAA"
          },
          {
            "passo": 1,
            "campo": "P nuova",
            "valore": "0x99"
          },
          {
            "passo": 1,
            "campo": "I/O di blocco",
            "valore": "2 letture + 2 scritture"
          },
          {
            "passo": 2,
            "campo": "B XOR P nuova",
            "valore": "0xAA"
          },
          {
            "passo": 2,
            "campo": "Coincide con A nuovo",
            "valore": "sì"
          }
        ]
      },
      {
        "titolo": "Scrittura del byte zero",
        "parametri": {
          "a": 85,
          "b": 51,
          "n": 0
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Vecchio byte A = 85; Byte B = 51; Nuovo byte A = 0.",
          "Leggi il passo «Stripe iniziale». Annota A = 0x55; B = 0x33; P = 0x66. Prima di avanzare, formula la previsione richiesta nel campo «Parità dopo la scrittura» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Aggiornamento». Annota A nuovo = 0x0; P nuova = 0x33; I/O di blocco = 2 letture + 2 scritture.",
          "Premi «Passo successivo» e fermati su «Perdita del membro A». Annota B XOR P nuova = 0x0; Coincide con A nuovo = sì."
        ],
        "risultato": "Nel passo «Perdita del membro A» il risultato è: B XOR P nuova = 0x0; Coincide con A nuovo = sì.",
        "ragionamento": "Con A nuovo uguale a zero, la parità coincide con B: 0x00 XOR 0x33 = 0x33. La ricostruzione calcola 0x33 XOR 0x33 = 0x00; il costo della piccola scrittura resta due letture e due scritture di blocco.",
        "attesi": [
          {
            "passo": 1,
            "campo": "A nuovo",
            "valore": "0x0"
          },
          {
            "passo": 1,
            "campo": "P nuova",
            "valore": "0x33"
          },
          {
            "passo": 1,
            "campo": "I/O di blocco",
            "valore": "2 letture + 2 scritture"
          },
          {
            "passo": 2,
            "campo": "B XOR P nuova",
            "valore": "0x0"
          },
          {
            "passo": 2,
            "campo": "Coincide con A nuovo",
            "valore": "sì"
          }
        ]
      }
    ]
  },
  "4.6.3": {
    "scopo": "Il sistema richiede una modifica a una pagina logica, mentre la flash deve programmare una pagina fisica già cancellata. Seguirai l’aggiornamento della mappa e individuerai quale copia fisica diventa obsoleta.",
    "lettura": "I riquadri superiori sono i nomi logici L0 e L1; quelli inferiori sono P0, P1 e P2 nella flash. Le frecce rappresentano la mappa FTL. Segui la freccia della pagina scelta prima e dopo la programmazione: la lettura usa il collegamento nuovo e la copia precedente diventa invalida.",
    "conclusione": "L’aggiornamento fuori posto separa l’identità logica del dato dalla pagina fisica che lo conserva. La mappa passa alla nuova copia dopo la programmazione, mentre lo spazio della copia invalida sarà recuperato con la cancellazione del blocco.",
    "controlli": {
      "l": "Pagina logica da aggiornare: L0 parte da P0 con valore 17, L1 parte da P1 con valore 34.",
      "v": "Nuovo valore del byte della pagina logica. Il controller lo programma nella pagina fisica libera P2 prima di aggiornare la mappa."
    },
    "teoria": [
      "Un’unità a stato solido conserva i dati in memoria flash. Il computer richiede letture e scritture mediante indirizzi logici, mentre le celle che conservano i bit sono organizzate in pagine fisiche. Per seguire la corrispondenza, il modello raggruppa i dati in due pagine logiche, L0 e L1, e rappresenta un byte di ciascuna pagina. Il controller, il circuito che governa l’unità, mantiene la mappa attraverso il Flash Translation Layer, abbreviato FTL.",
      "Programmare una pagina flash significa impostarne i bit; la cancellazione prepara invece un intero blocco, comprendente più pagine, a nuove programmazioni. Per aggiornare un dato, il controller programma una pagina fisica libera, già cancellata, e modifica il collegamento nella mappa al termine della scrittura. La pagina precedente diventa invalida, perché conserva una versione ormai sostituita. Il nuovo collegamento permette così di rinviare la cancellazione del blocco che contiene la copia vecchia, preservando intanto le altre pagine ancora valide.",
      "All’inizio L0 conduce a P0, dove si legge 17, e L1 a P1, dove si legge 34. Se il nuovo valore di L0 è 99, il controller lo scrive in P2 e dirige verso P2 le successive letture di L0. I bit della vecchia copia possono essere ancora presenti in P0. Poiché la mappa rimanda ormai a P2, il controller potrà recuperare lo spazio di P0 alla cancellazione del blocco."
    ],
    "introduzione": [
      "La simulazione serve a distinguere l’identità logica di un dato dal luogo fisico in cui la flash ne conserva la versione corrente. Il FTL, livello di traduzione del controller, mantiene la mappa fra pagine logiche e fisiche. Un aggiornamento programma una pagina libera già cancellata e poi modifica la mappa, rendendo obsoleta la copia precedente fino al recupero del blocco.",
      "Carica l’aggiornamento di L0 e avanza con «Passo successivo», seguendo la freccia che passa da P0 a P2 dopo la programmazione. Confronta il byte restituito dalla lettura logica con la pagina dichiarata invalida. Fissa il caso e carica l’aggiornamento di L1: lo stesso nuovo valore raggiunge P2, mentre cambia la copia precedente esclusa dalle successive letture."
    ],
    "esperienze": [
      {
        "titolo": "Aggiornare la pagina logica L0",
        "parametri": {
          "l": "0",
          "v": 99
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Pagina logica = L0; Nuovo valore del byte = 99.",
          "Leggi il passo «Mappa iniziale». Annota Pagina scelta = L0; Pagina fisica = P0; Valore = 17. Prima di avanzare, prevedi il valore finale del campo «Pagina invalida» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Programmazione». Annota Nuovo collegamento = L0 → P2; Dato su P2 = 99.",
          "Premi «Passo successivo» e fermati su «Lettura logica». Annota Pagina letta = P2; Byte restituito = 99; Pagina invalida = P0."
        ],
        "risultato": "Nel passo «Lettura logica» il risultato è: Pagina letta = P2; Byte restituito = 99; Pagina invalida = P0.",
        "ragionamento": "La mappa iniziale collega L0 a P0. Il valore 99 viene scritto in P2 e il collegamento diventa L0 → P2: la successiva lettura restituisce 99, mentre P0 è indicata come invalida.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Nuovo collegamento",
            "valore": "L0 → P2"
          },
          {
            "passo": 1,
            "campo": "Dato su P2",
            "valore": "99"
          },
          {
            "passo": 2,
            "campo": "Pagina letta",
            "valore": "P2"
          },
          {
            "passo": 2,
            "campo": "Byte restituito",
            "valore": "99"
          },
          {
            "passo": 2,
            "campo": "Pagina invalida",
            "valore": "P0"
          }
        ]
      },
      {
        "titolo": "Aggiornare invece L1",
        "parametri": {
          "l": "1",
          "v": 99
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Pagina logica = L1; Nuovo valore del byte = 99.",
          "Leggi il passo «Mappa iniziale». Annota Pagina scelta = L1; Pagina fisica = P1; Valore = 34. Prima di avanzare, prevedi il valore finale del campo «Pagina invalida» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Programmazione». Annota Nuovo collegamento = L1 → P2; Dato su P2 = 99.",
          "Premi «Passo successivo» e fermati su «Lettura logica». Annota Pagina letta = P2; Byte restituito = 99; Pagina invalida = P1."
        ],
        "risultato": "Nel passo «Lettura logica» il risultato è: Pagina letta = P2; Byte restituito = 99; Pagina invalida = P1.",
        "ragionamento": "L1 parte da P1 e contiene 34. Scrivendo lo stesso 99 in P2, la mappa diventa L1 → P2 e rende invalida P1; la pagina logica scelta determina quale collegamento viene sostituito.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Nuovo collegamento",
            "valore": "L1 → P2"
          },
          {
            "passo": 1,
            "campo": "Dato su P2",
            "valore": "99"
          },
          {
            "passo": 2,
            "campo": "Pagina letta",
            "valore": "P2"
          },
          {
            "passo": 2,
            "campo": "Byte restituito",
            "valore": "99"
          },
          {
            "passo": 2,
            "campo": "Pagina invalida",
            "valore": "P1"
          }
        ]
      }
    ]
  },
  "4.6.4": {
    "scopo": "Una scrittura flash può trovare spazio libero oppure doverlo recuperare trasferendo pagine ancora valide. Confronterai i due percorsi per spiegare perché la stessa richiesta dell’host produce latenza e quantità di lavoro fisico differenti.",
    "lettura": "La fila superiore mostra le otto pagine del blocco vittima, distinguendo quelle vive dagli scarti. La fila inferiore mostra le copie migrate nello spazio di riserva e la nuova pagina dell’host. Conta le programmazioni fisiche, poi confronta i tempi di migrazione, cancellazione e scrittura.",
    "conclusione": "La latenza dipende dallo stato interno della flash oltre che dalla richiesta. L’amplificazione misura il rapporto fra lavoro di programmazione fisica e pagine richieste dall’host, includendo le copie necessarie a conservare i dati validi.",
    "controlli": {
      "v": "Pagine ancora valide fra le otto del blocco vittima. Nel percorso di recupero vanno tutte lette e programmate altrove prima della cancellazione.",
      "st": "Scegli se occorre recuperare un blocco oppure se una pagina libera è già disponibile. La seconda condizione evita migrazione e cancellazione per questa richiesta."
    },
    "teoria": [
      "L’host è il computer che invia la richiesta al dispositivo. Una pagina viva, o valida, contiene la versione corrente di un dato; il blocco vittima è il gruppo di pagine scelto per recuperare spazio mediante cancellazione. La memoria flash di un disco a stato solido accetta nuove programmazioni in pagine già cancellate. Poiché la cancellazione coinvolge un blocco intero, per recuperare spazio il controller sceglie un blocco e individua le pagine che contengono ancora dati utili. Prima di cancellarlo deve copiare altrove quelle pagine, usando lo spazio tenuto di riserva. Questo lavoro di recupero prende il nome di garbage collection.",
      "La durata di una scrittura dipende così dalle condizioni in cui la richiesta trova il dispositivo. Nel modello la lettura di una pagina richiede 50 microsecondi, la programmazione ne richiede 200 e la cancellazione di un blocco 2000. Se il blocco da recuperare contiene tre pagine valide, le tre migrazioni occupano 750 microsecondi. Seguono la cancellazione e la scrittura della pagina richiesta, per un totale di 2950 microsecondi. Indicando con v il numero di pagine valide, il percorso seriale richiede v × (50 + 200) + 2000 + 200 microsecondi: ogni copia comprende una lettura e una programmazione, poi seguono la cancellazione e la nuova pagina. Un microsecondo, µs, vale un milionesimo di secondo.",
      "L’amplificazione di scrittura è il rapporto fra pagine programmate fisicamente e pagine che il computer ha chiesto di scrivere. Nell’esempio si eseguono quattro programmazioni per una richiesta. Se è già disponibile una pagina libera, basta la sola programmazione finale. La diversa durata nasce dunque dal lavoro interno che la medesima richiesta trova necessario.",
      "Il Flash Translation Layer, o FTL, è il codice del controller che tiene la mappa fra pagine logiche richieste dal computer e pagine fisiche della flash. La raccolta dello spazio opera su queste pagine fisiche e aggiorna la mappa per preservare l’identità dei dati. Le durate mostrate sono parametri del modello e illustrano l’effetto del lavoro interno, senza rappresentare misure di una specifica unità commerciale."
    ],
    "introduzione": [
      "Questa attività permette di spiegare perché la stessa scrittura flash abbia durate diverse secondo lo spazio disponibile. Se occorre recuperare un blocco, il controller migra prima le pagine vive, cioè quelle che contengono ancora dati correnti, poi cancella il blocco. L’amplificazione di scrittura confronta tutte le programmazioni fisiche, comprese queste copie, con le pagine richieste dall’host, il computer utilizzatore.",
      "Carica il recupero con tre pagine vive e avanza con «Passo successivo», contando migrazioni, cancellazione e nuova programmazione. Fissa il risultato e confronta la pagina già libera: osserva come cambino latenza e amplificazione per la stessa richiesta. Variando le pagine valide e applicando i parametri, verifica che ogni migrazione aggiunga una lettura, una programmazione e una copia fisica al lavoro interno."
    ],
    "esperienze": [
      {
        "titolo": "Recuperare un blocco con tre pagine vive",
        "parametri": {
          "v": 3,
          "st": "gc"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Pagine valide nel blocco vittima su 8 = 3; Spazio libero = Occorre recuperare un blocco.",
          "Leggi il passo «Stato iniziale». Annota Pagine da migrare = 3; Scritture host = 1. Prima di avanzare, prevedi il valore finale del campo «Latenza totale (µs)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Preparazione dello spazio». Annota Migrazioni (µs) = 750; Cancellazione (µs) = 2000.",
          "Premi «Passo successivo» e fermati su «Scrittura dell’host». Annota Programmazioni fisiche = 4; Amplificazione = 4; Latenza totale (µs) = 2950."
        ],
        "risultato": "Nel passo «Scrittura dell’host» il risultato è: Programmazioni fisiche = 4; Amplificazione = 4; Latenza totale (µs) = 2950.",
        "ragionamento": "Tre migrazioni richiedono 3 × (50 + 200) = 750 µs. Sommando 2000 µs di cancellazione e 200 µs per la richiesta si ottengono 2950 µs; le tre copie più la nuova pagina danno amplificazione 4.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Migrazioni (µs)",
            "valore": "750"
          },
          {
            "passo": 1,
            "campo": "Cancellazione (µs)",
            "valore": "2000"
          },
          {
            "passo": 2,
            "campo": "Programmazioni fisiche",
            "valore": "4"
          },
          {
            "passo": 2,
            "campo": "Amplificazione",
            "valore": "4"
          },
          {
            "passo": 2,
            "campo": "Latenza totale (µs)",
            "valore": "2950"
          }
        ]
      },
      {
        "titolo": "Programmare una pagina già libera",
        "parametri": {
          "v": 3,
          "st": "free"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Pagine valide nel blocco vittima su 8 = 3; Spazio libero = Pagina libera già disponibile.",
          "Leggi il passo «Stato iniziale». Annota Pagine da migrare = 0; Scritture host = 1. Prima di avanzare, prevedi il valore finale del campo «Latenza totale (µs)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Preparazione dello spazio». Annota Migrazioni (µs) = 0; Cancellazione (µs) = 0.",
          "Premi «Passo successivo» e fermati su «Scrittura dell’host». Annota Programmazioni fisiche = 1; Amplificazione = 1; Latenza totale (µs) = 200."
        ],
        "risultato": "Nel passo «Scrittura dell’host» il risultato è: Programmazioni fisiche = 1; Amplificazione = 1; Latenza totale (µs) = 200.",
        "ragionamento": "Con una pagina già libera basta la programmazione richiesta dall’host, che dura 200 µs. Una programmazione fisica per una pagina richiesta dà amplificazione 1, mentre il numero di pagine valide del blocco vittima resta estraneo a questo percorso.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Migrazioni (µs)",
            "valore": "0"
          },
          {
            "passo": 1,
            "campo": "Cancellazione (µs)",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Programmazioni fisiche",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Amplificazione",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Latenza totale (µs)",
            "valore": "200"
          }
        ]
      }
    ]
  },
  "4.6.5": {
    "scopo": "Un dispositivo alterna servizio e riparazione. Calcolerai la frazione di tempo disponibile nel lungo periodo usando le durate medie del ciclo e convertirai il rapporto in percentuale.",
    "lettura": "Il tratto operativo appartiene al numeratore; il ciclo completo comprende anche la riparazione e forma il denominatore. Leggi le durate nella stessa unità, poi applica l’arrotondamento soltanto alla percentuale finale.",
    "conclusione": "Nel modello di rinnovo con ripristino completo, la disponibilità di lungo periodo è tempo medio operativo diviso durata media dell’intero ciclo. La percentuale così ottenuta riguarda il tempo in servizio e va distinta dalla continuità di una singola missione.",
    "teoria": [
      "Un dispositivo riparabile alterna periodi in cui offre il proprio servizio a periodi nei quali un guasto lo tiene fermo. Per una persona che chiede di usarlo in un istante scelto a caso lungo una storia di funzionamento, conta la frazione di tempo durante la quale il servizio è disponibile. Questa frazione prende il nome di disponibilità.",
      "Il problema considera un intervallo medio di servizio di mille ore seguito da una riparazione media di due ore. Un ciclo completo dura dunque 1002 ore e ne offre mille di servizio. La disponibilità vale 1000 / 1002, circa 0,998004; moltiplicando per cento e arrotondando a due decimali si ottiene 99,80 per cento. La quota complementare appartiene al tempo di riparazione.",
      "Un singolo ciclo può durare più o meno della media. Il rapporto riguarda tempi accumulati su molti cicli e richiede che le durate vengano espresse nella stessa unità. Nel disegno, il numeratore corrisponde al tratto operativo e il denominatore all’intera estensione dei due tratti accostati. Una volta formato il rapporto si può convertirlo in percentuale e applicare l’arrotondamento richiesto."
    ],
    "introduzione": [
      "La ricostruzione serve a stimare la disponibilità di un dispositivo che alterna funzionamento e riparazione. La disponibilità misura la quota di tempo in cui offre servizio nel lungo periodo. Nel modello con ripristino completo, il rapporto usa il tempo medio operativo al numeratore e l’intero ciclo medio al denominatore, includendo quindi anche la durata del fermo necessario alla riparazione.",
      "Leggi le mille ore operative e le due ore di riparazione, quindi scrivi la previsione percentuale arrotondata a due decimali. Avanza con «Passo successivo» e confronta il tratto di servizio con il ciclo di 1002 ore. Verifica il rapporto prima dell’arrotondamento finale a 99,80 per cento e interpreta il risultato come quota di tempo, distinguendolo dalla continuità di una singola missione."
    ],
    "procedura": [
      "Leggi i dati iniziali: Il dispositivo funziona in media per 1000 ore tra un ripristino e il guasto successivo. Una riparazione completa richiede in media 2 ore. Conta come disponibile il tempo trascorso in servizio.",
      "Prima di avviare la ricostruzione, scrivi una previsione per questa domanda: Qual è la disponibilità percentuale del dispositivo? Arrotonda a due cifre decimali.",
      "Premi «Passo successivo» per attraversare «Intervallo operativo», «Intervallo di riparazione», «Disponibilità». A ogni passaggio confronta le quantità indicate con il ragionamento teorico.",
      "Raggiungi l’ultimo fotogramma e confronta la previsione con il risultato. Usa «Precedente» per rileggere il passaggio che determina il valore finale."
    ],
    "risultato": "Per la domanda «Qual è la disponibilità percentuale del dispositivo? Arrotonda a due cifre decimali.» il valore atteso è 99,80.",
    "ragionamento": "Si assume un modello di rinnovo con 1000 ore medie di funzionamento e ripristino completo dopo il guasto. La riparazione richiede in media due ore. Il ciclo medio comprende entrambi gli intervalli. La disponibilità di lungo periodo è il rapporto fra tempo medio di servizio e durata media del ciclo. In percentuale vale (1000 / 1002) × 100 ≈ 99,80%."
  },
  "4.6.6": {
    "scopo": "Un servizio passa mediamente 990 ore operativo e dieci ore in ripristino. Ricostruirai la durata del ciclo e le due quote complementari di disponibilità e indisponibilità.",
    "lettura": "Le parti operative e di ripristino dividono lo stesso ciclo medio di mille ore. Nei due rapporti cambia il numeratore; il denominatore resta l’intero ciclo. La somma delle percentuali costituisce un controllo immediato del risultato.",
    "conclusione": "Disponibilità e indisponibilità ripartiscono lo stesso tempo osservato e sommano al cento per cento. La continuità di una missione richiede invece di considerare se un guasto cade durante tutto l’intervallo richiesto.",
    "teoria": [
      "Un disco può interrompere il servizio e tornare operativo dopo una riparazione. Per chi deve completare una registrazione senza interruzioni conta l’intero intervallo di lavoro. Chi interroga il disco in un istante preciso vuole invece sapere se in quel momento può rispondere. I due criteri danno pesi diversi ai guasti già risolti.",
      "L’affidabilità di missione esprime la probabilità di un servizio continuo per tutta la missione. La disponibilità esprime la probabilità di trovare il dispositivo in servizio nell’istante scelto. Una riparazione avvenuta in tempo per quell’istante contribuisce alla disponibilità.",
      "Se il disco si guasta alle dieci, torna in servizio alle undici e viene interrogato a mezzogiorno, a mezzogiorno è disponibile. Una registrazione avviata alle nove che richiedesse continuità fino a mezzogiorno avrebbe tuttavia subito un’interruzione. Le probabilità calcolate sulle due domande si riferiscono quindi a eventi distinti.",
      "Nell’esercizio guidato i periodi medi sono 990 ore operative e dieci di ripristino. Il ciclo medio di mille ore è disponibile per 990 / 1000 = 99 per cento del tempo e indisponibile per il restante uno per cento. Questo calcolo riguarda la disponibilità nel lungo periodo; la domanda sulla continuità di una singola missione richiederebbe anche la durata della missione e il modello temporale dei guasti."
    ],
    "introduzione": [
      "Calcolare disponibilità e indisponibilità sullo stesso ciclo serve a riconoscere due quote complementari del tempo osservato. Il servizio alterna periodi operativi a ripristini; ciascuna percentuale usa come numeratore la durata della propria condizione e come denominatore il ciclo intero. L’esercitazione riguarda queste frazioni nel lungo periodo, mentre l’affidabilità di missione richiede un funzionamento continuo durante tutto l’intervallo considerato.",
      "Premi «Carica l’esempio guidato» e ricostruisci il ciclo dalle 990 ore operative e dalle dieci di ripristino. Inserisci «Disponibilità (%)» e usa «Registra la previsione», quindi avanza con «Passo successivo». Confronta i due rapporti verificando che condividano mille ore al denominatore e sommino al cento per cento: il risultato ripartisce il tempo fra servizio e fermo."
    ],
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 1 «Separare continuità di servizio e disponibilità», traccia 1. La spiegazione seguente si riferisce a questi dati.",
      "Leggi la consegna: Un servizio ha cicli ripetuti con tempo medio operativo di 990 h e tempo medio di ripristino di 10 h. Quale percentuale di tempo risulta disponibile, e quale indisponibile, nel lungo periodo?",
      "Calcola il primo campo «Disponibilità (%)» e premi «Registra la previsione» per avviare la ricostruzione. Il riscontro permette di confrontare il tuo risultato con i passaggi successivi.",
      "Segui la ricostruzione fino alla verifica dei campi; con «Apri la prova completa» puoi inserire tutte le risposte. Cambiando esercizio o traccia, rileggi la nuova consegna e usa i relativi dati."
    ],
    "risultato": "Nell’esercizio 1, traccia 1, si ottiene: Disponibilità (%) = 99; Indisponibilità (%) = 1.",
    "ragionamento": "Il ciclo medio dura 990 + 10 = 1000 h. La frazione disponibile è 990 / 1000 = 0,99, pari al 99%. La quota restante è 10 / 1000 = 0,01, pari all’1%."
  },
  "4.6.7": {
    "scopo": "Due dischi conservano una copia completa degli stessi blocchi. Determinerai la capacità logica del volume e il numero di copie ancora leggibili dopo la perdita di un membro.",
    "lettura": "Le due copie rappresentano gli stessi indirizzi logici del volume, perciò la loro capienza fisica si somma solo come spazio grezzo. La croce sul membro guasto riduce il numero di copie disponibili; il membro superstite continua a contenere ogni blocco.",
    "conclusione": "Il mirroring spende capacità fisica per mantenere copie dello stesso contenuto. Dopo il primo guasto il servizio può proseguire in forma degradata, finché la ricostruzione ristabilisce la ridondanza.",
    "teoria": [
      "Il volume logico è l’insieme dei blocchi che il computer può indirizzare; la capacità grezza somma lo spazio fisico di tutti i membri. La ridondanza è l’informazione aggiuntiva conservata per recuperare i dati dopo una perdita: in uno specchio consiste nelle copie degli stessi blocchi. Per mantenere accessibili i dati anche dopo il guasto di un disco si possono registrare due copie di ogni blocco su dischi distinti. Questo schema si chiama mirroring e costituisce la base del RAID 1. Il sistema può soddisfare una lettura usando una delle copie integre.",
      "Durante la sostituzione il disco integro fornisce i dati e alimenta la copia che si sta ricostruendo. Nel modello a due dischi una seconda perdita prima della fine può quindi lasciare irrecuperabili alcuni blocchi. La traccia distingue la continuità del servizio dal completamento della copia.",
      "Nella coppia guidata entrambi i dischi da quattro terabyte contengono gli stessi blocchi. Lo spazio grezzo totale è otto terabyte, mentre il volume logico offre quattro terabyte con due copie per blocco. La perdita di un membro lascia una copia integra di ciascun blocco sul superstite. Durante la ricostruzione il sistema deve leggere questa copia e trasferirla al nuovo membro prima di recuperare la ridondanza completa."
    ],
    "introduzione": [
      "Seguire un guasto in una coppia RAID 1 serve a distinguere capacità fisica, capacità logica e numero di copie disponibili. Il mirroring conserva lo stesso contenuto completo su entrambi i dischi: il volume logico espone una sola serie di blocchi, mentre lo spazio aggiuntivo mantiene la seconda copia. La perdita di un membro lascia il servizio in modalità degradata finché viene ricostruita la ridondanza.",
      "Carica l’esempio guidato dei due dischi da quattro terabyte e prevedi la capacità logica prima di leggere i passaggi. Avanza con «Passo successivo», confrontando gli stessi blocchi sui due membri e poi sul superstite. Verifica separatamente i quattro terabyte utili e l’unica copia rimasta leggibile, collegando la futura ricostruzione al recupero della seconda copia completa."
    ],
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 3 «Leggere e ricostruire una coppia speculare», traccia 1. La spiegazione seguente si riferisce a questi dati.",
      "Leggi la consegna: Due dischi da 4 TB formano un RAID 1 a specchio completo. Un disco si guasta. Calcola la capacità logica iniziale e il numero di copie leggibili di ciascun blocco subito dopo il guasto.",
      "Ricostruisci il primo campo «Capacità logica (TB)» prima di leggere lo svolgimento. Avanza con «Passo successivo» e controlla i dati impiegati in ciascuna operazione.",
      "Segui la ricostruzione fino alla verifica dei campi; con «Apri la prova completa» puoi inserire tutte le risposte. Cambiando esercizio o traccia, rileggi la nuova consegna e usa i relativi dati."
    ],
    "risultato": "Nell’esercizio 3, traccia 1, si ottiene: Capacità logica (TB) = 4; Copie ancora leggibili = 1.",
    "ragionamento": "Ogni blocco logico ha due copie su due membri distinti. La capacità utile corrisponde a quella di un membro, 4 TB. Il primo guasto lascia una copia leggibile per blocco. La coppia resta degradata fino alla ricostruzione."
  },
  "4.7.1": {
    "scopo": "Il DMA affida al dispositivo il trasferimento dei dati e richiede al processore una preparazione iniziale e un servizio finale. Confronterai il lavoro CPU per una richiesta lunga e una breve, individuando la prima lunghezza alla quale il costo fisso viene compensato con un risparmio.",
    "lettura": "Le due barre misurano cicli CPU della stessa richiesta. La barra PIO cresce con le parole; quella DMA distingue preparazione e completamento. Leggi il risparmio come cicli PIO meno cicli DMA: un valore negativo indica maggiore lavoro CPU per il DMA in quel caso.",
    "conclusione": "Il vantaggio sul lavoro CPU dipende dal rapporto fra costo fisso e dimensione del trasferimento. La soglia calcolata riguarda i costi scelti nel modello e va tenuta distinta dalla durata dei dati sul bus.",
    "controlli": {
      "n": "Numero di parole da quattro byte. L’I/O programmato richiede sei cicli CPU per ogni parola.",
      "s": "Cicli CPU necessari a predisporre la richiesta DMA. Alla fine si aggiungono sempre otto cicli per il servizio di completamento."
    },
    "teoria": [
      "Quando una periferica scambia dati con la memoria, il processore può occuparsi personalmente di ciascuna parola. La parola è qui un gruppo di quattro byte. In questa forma di ingresso e uscita, detta I/O programmato, il programma che controlla la periferica, o driver, esegue le operazioni necessarie per ciascun gruppo. Il lavoro della CPU, cioè del processore, cresce quindi con la lunghezza del trasferimento. Nella figura PIO abbrevia Programmed I/O, cioè I/O programmato; i cicli CPU sono intervalli dell’orologio del processore.",
      "Con l’accesso diretto alla memoria, indicato dalla sigla DMA, il driver prepara una richiesta che comunica al dispositivo dove si trovano i dati e quanti sono. Il dispositivo esegue poi il trasferimento. Il processore interviene di nuovo alla fine per verificarne l’esito. Il confronto misura i cicli che questi compiti sottraggono alla CPU durante una richiesta. L’etichetta setup indica la preparazione della richiesta.",
      "Se la preparazione richiede 32 cicli e il completamento altri otto, il lavoro della CPU per il DMA ammonta a quaranta cicli. Con sei cicli per parola nell’I/O programmato, sei parole ne richiedono 36 e sette ne richiedono 42. Fra queste due lunghezze cambia il segno del risparmio. La durata durante la quale il bus trasporta i dati è una grandezza distinta dal lavoro della CPU. Per n parole e s cicli di preparazione i due costi sono 6n e s + 8. Il DMA risparmia quando 6n > s + 8; si cerca quindi il primo numero intero di parole strettamente maggiore di (s + 8) / 6. Se i due costi sono uguali, si è al pareggio."
    ],
    "introduzione": [
      "Confrontare lavoro proporzionale ai dati e costo fisso è lo scopo della simulazione. Nell’I/O programmato la CPU interviene per ogni parola di quattro byte; con il DMA, accesso diretto del dispositivo alla memoria, prepara la richiesta e ne serve il completamento. La lunghezza alla quale il DMA comincia a risparmiare cicli dipende quindi dal confronto fra questi due costi.",
      "Carica le sedici parole e avanza con «Passo successivo», confrontando i novantasei cicli del trasferimento programmato con i quaranta del DMA. Fissa il risultato e carica le quattro parole, osservando il cambio di segno del risparmio. Modifica poi la lunghezza e applica i parametri per verificare la prima taglia vantaggiosa: le barre misurano occupazione CPU, distinta dalla durata dei dati sul bus."
    ],
    "esperienze": [
      {
        "titolo": "Sedici parole ammortizzano il costo fisso",
        "parametri": {
          "n": 16,
          "s": 32
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Parole da 4 byte = 16; Preparazione DMA (cicli CPU) = 32.",
          "Leggi il passo «Richiesta». Annota Parole = 16; Byte = 64. Prima di avanzare, formula la previsione richiesta nel campo «Prima lunghezza con risparmio (parole)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «I/O programmato». Annota Cicli CPU = 96; Accessi dati CPU = 16.",
          "Premi «Passo successivo» e fermati su «DMA». Annota Cicli CPU = 40; Prima lunghezza con risparmio (parole) = 7; Risparmio nel caso scelto (cicli) = 56."
        ],
        "risultato": "Nel passo «DMA» il risultato è: Cicli CPU = 40; Prima lunghezza con risparmio (parole) = 7; Risparmio nel caso scelto (cicli) = 56.",
        "ragionamento": "Per sedici parole PIO usa 16 × 6 = 96 cicli, mentre DMA usa 32 + 8 = 40: il risparmio è 56 cicli. La prima lunghezza che supera 40 / 6 parole è 7.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Cicli CPU",
            "valore": "96"
          },
          {
            "passo": 1,
            "campo": "Accessi dati CPU",
            "valore": "16"
          },
          {
            "passo": 2,
            "campo": "Cicli CPU",
            "valore": "40"
          },
          {
            "passo": 2,
            "campo": "Prima lunghezza con risparmio (parole)",
            "valore": "7"
          },
          {
            "passo": 2,
            "campo": "Risparmio nel caso scelto (cicli)",
            "valore": "56"
          }
        ]
      },
      {
        "titolo": "Quattro parole sotto la soglia",
        "parametri": {
          "n": 4,
          "s": 32
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Parole da 4 byte = 4; Preparazione DMA (cicli CPU) = 32.",
          "Leggi il passo «Richiesta». Annota Parole = 4; Byte = 16. Prima di avanzare, formula la previsione richiesta nel campo «Prima lunghezza con risparmio (parole)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «I/O programmato». Annota Cicli CPU = 24; Accessi dati CPU = 4.",
          "Premi «Passo successivo» e fermati su «DMA». Annota Cicli CPU = 40; Prima lunghezza con risparmio (parole) = 7; Risparmio nel caso scelto (cicli) = -16."
        ],
        "risultato": "Nel passo «DMA» il risultato è: Cicli CPU = 40; Prima lunghezza con risparmio (parole) = 7; Risparmio nel caso scelto (cicli) = -16.",
        "ragionamento": "Per quattro parole PIO usa 4 × 6 = 24 cicli. DMA richiede ancora 40 cicli, quindi il risparmio PIO − DMA vale −16: il costo di preparazione supera il lavoro risparmiato sui dati.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Cicli CPU",
            "valore": "24"
          },
          {
            "passo": 1,
            "campo": "Accessi dati CPU",
            "valore": "4"
          },
          {
            "passo": 2,
            "campo": "Cicli CPU",
            "valore": "40"
          },
          {
            "passo": 2,
            "campo": "Prima lunghezza con risparmio (parole)",
            "valore": "7"
          },
          {
            "passo": 2,
            "campo": "Risparmio nel caso scelto (cicli)",
            "valore": "-16"
          }
        ]
      }
    ]
  },
  "4.7.2": {
    "scopo": "Un descrittore DMA delimita un buffer, mentre il bus trasferisce solo un massimo di byte per transazione. Dividerai una richiesta di 37 byte in operazioni successive e individuerai gli estremi inclusivi dell’ultima.",
    "lettura": "Il segmento rappresenta tutti i byte contigui del buffer; ciascun rettangolo è una transazione. L’ultimo rettangolo evidenziato può essere più corto perché trasporta il residuo. Gli indirizzi finali sono inclusivi e la parola «scrittura» o «lettura» si riferisce alla memoria. Confrontando i due casi, conta anche i rettangoli: il residuo finale resta di cinque byte, mentre il loro numero scende da cinque a tre.",
    "conclusione": "Il massimo per transazione cambia il numero delle operazioni, mentre la base e la lunghezza fissano l’intervallo complessivo. L’ultimo byte è sempre base + lunghezza − 1, indipendentemente dalla suddivisione.",
    "controlli": {
      "n": "Numero totale di byte nel buffer che comincia a 0x6000.",
      "w": "Numero massimo di byte ammessi in una singola transazione. L’ultima porta soltanto i byte residui della richiesta.",
      "d": "Direzione rispetto al dispositivo: dal dispositivo alla memoria significa scritture in RAM; dalla memoria al dispositivo significa letture della RAM."
    },
    "teoria": [
      "Il driver è il programma del sistema operativo che controlla la periferica. Gli indirizzi con prefisso 0x sono scritti in base sedici: uno scostamento di trentadue byte si scrive 0x20, mentre trentasei si scrive 0x24. Una periferica che usa l’accesso diretto alla memoria, o DMA, può leggere o scrivere la memoria principale senza che il processore debba spostare personalmente ogni singolo byte. Per affidarle il lavoro, il driver prepara un descrittore, una struttura che contiene l’indirizzo iniziale del buffer, il numero di byte e la direzione del trasferimento. Il buffer è la regione di memoria destinata a contenere quei dati.",
      "Il collegamento ammette un numero massimo di byte per transazione, ossia per singola operazione di lettura o scrittura. Con un buffer da 37 byte e un massimo di otto, le prime quattro transazioni coprono 32 byte. La quinta parte 32 posizioni dopo la base e trasporta i cinque byte residui. Dalla base 0x6000, in notazione esadecimale, l’ultima transazione parte quindi da 0x6020 e termina a 0x6024 compreso.",
      "Il verso dell’operazione si legge dal punto di vista della memoria. Quando la periferica riceve dati da depositare nel buffer, emette scritture in memoria. Quando deve trasmettere all’esterno dati già pronti, legge il buffer. La direzione cambia chi produce il dato, mentre gli estremi del buffer dipendono dall’indirizzo iniziale e dalla lunghezza."
    ],
    "introduzione": [
      "La simulazione serve a suddividere una richiesta DMA in transazioni compatibili con il limite del collegamento. Il descrittore indica base, lunghezza e direzione del buffer, regione destinata ai dati; ogni transazione ne copre una porzione contigua. Il massimo ammesso cambia il numero delle operazioni, mentre l’ultimo indirizzo incluso resta base più lunghezza meno uno, perché il primo byte occupa già la posizione iniziale.",
      "Carica i trentasette byte con massimo otto per transazione e avanza con «Passo successivo», contando quattro gruppi completi e il residuo. Confronta il massimo sedici dopo aver fissato il caso: diminuiscono le transazioni, mentre l’ultima conserva cinque byte e gli stessi estremi. Cambiando «Direzione» e applicando i parametri, interpreta lettura e scrittura dal punto di vista della RAM."
    ],
    "esperienze": [
      {
        "titolo": "Transazioni da al massimo otto byte",
        "parametri": {
          "n": 37,
          "w": "8",
          "d": "rx"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Lunghezza (B) = 37; Massimo per transazione (B) = 8; Direzione = Dal dispositivo alla memoria.",
          "Leggi il passo «Descrittore». Annota Primo indirizzo = 0x6000; Lunghezza (B) = 37. Prima di avanzare, prevedi il valore finale del campo «Byte nell’ultima transazione» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Emissione delle transazioni». Annota Operazione in memoria = scrittura; Transazioni = 5.",
          "Premi «Passo successivo» e fermati su «Ultima transazione». Annota Primo byte finale = 0x6020; Ultimo byte = 0x6024; Byte nell’ultima transazione = 5."
        ],
        "risultato": "Nel passo «Ultima transazione» il risultato è: Primo byte finale = 0x6020; Ultimo byte = 0x6024; Byte nell’ultima transazione = 5.",
        "ragionamento": "Trentasette byte si dividono in quattro gruppi da otto e un residuo da cinque: servono cinque transazioni. L’ultima parte da 0x6000 + 32 = 0x6020 e termina a 0x6000 + 36 = 0x6024.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Operazione in memoria",
            "valore": "scrittura"
          },
          {
            "passo": 1,
            "campo": "Transazioni",
            "valore": "5"
          },
          {
            "passo": 2,
            "campo": "Primo byte finale",
            "valore": "0x6020"
          },
          {
            "passo": 2,
            "campo": "Ultimo byte",
            "valore": "0x6024"
          },
          {
            "passo": 2,
            "campo": "Byte nell’ultima transazione",
            "valore": "5"
          }
        ]
      },
      {
        "titolo": "Transazioni da al massimo sedici byte",
        "parametri": {
          "n": 37,
          "w": "16",
          "d": "rx"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Lunghezza (B) = 37; Massimo per transazione (B) = 16; Direzione = Dal dispositivo alla memoria.",
          "Leggi il passo «Descrittore». Annota Primo indirizzo = 0x6000; Lunghezza (B) = 37. Prima di avanzare, prevedi il valore finale del campo «Byte nell’ultima transazione» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Emissione delle transazioni». Annota Operazione in memoria = scrittura; Transazioni = 3.",
          "Premi «Passo successivo» e fermati su «Ultima transazione». Annota Primo byte finale = 0x6020; Ultimo byte = 0x6024; Byte nell’ultima transazione = 5."
        ],
        "risultato": "Nel passo «Ultima transazione» il risultato è: Primo byte finale = 0x6020; Ultimo byte = 0x6024; Byte nell’ultima transazione = 5.",
        "ragionamento": "Con massimo sedici byte si inviano due gruppi completi e gli stessi cinque residui: le transazioni scendono a tre. L’ultima parte ancora dopo 32 byte e conserva gli estremi 0x6020 e 0x6024, perché la richiesta complessiva resta identica.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Operazione in memoria",
            "valore": "scrittura"
          },
          {
            "passo": 1,
            "campo": "Transazioni",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "Primo byte finale",
            "valore": "0x6020"
          },
          {
            "passo": 2,
            "campo": "Ultimo byte",
            "valore": "0x6024"
          },
          {
            "passo": 2,
            "campo": "Byte nell’ultima transazione",
            "valore": "5"
          }
        ]
      }
    ]
  },
  "4.7.3": {
    "scopo": "Un anello DMA dispone di un numero finito di descrittori riutilizzabili. Conterai richieste preparate, slot affidati al dispositivo e slot restituiti, verificando anche il caso in cui le domande superano la capacità.",
    "lettura": "Ogni punto numerato dell’anello è uno slot. Il ciano indica proprietà del driver, ambra proprietà del dispositivo. La pubblicazione cede i posti preparati; il recupero riporta al driver soltanto i completamenti osservati. I conteggi distinguono slot liberi e richieste ancora in attesa di pubblicazione.",
    "conclusione": "La proprietà stabilisce quando uno slot può essere modificato in sicurezza. Una richiesta in attesa di spazio è distinta da una richiesta già pubblicata e ancora attiva; il recupero dei completamenti libera capacità per un turno successivo.",
    "controlli": {
      "cap": "Numero di slot totali nell’anello, inizialmente disponibili al driver.",
      "rich": "Richieste da pubblicare in questo giro. Si preparano al massimo tanti descrittori quanti sono gli slot; l’eccedenza resta in attesa.",
      "fin": "Numero massimo di completamenti osservati dal driver. Gli slot restituiti sono limitati anche dal numero realmente pubblicato."
    },
    "teoria": [
      "Il driver è il programma del sistema operativo che governa una periferica; il buffer è la regione di memoria destinata ai dati della richiesta. Un dispositivo può ricevere più richieste di accesso diretto alla memoria (DMA) attraverso una serie di posti riutilizzabili. Ciascun posto, detto slot, contiene un descrittore che specifica al dispositivo dove si trova il buffer e quale trasferimento occorre eseguire. Si parla di anello perché, una volta raggiunto l’ultimo posto, il driver torna al primo che si sia liberato.",
      "Finché prepara la richiesta, il driver dispone dello slot. Quando ha reso leggibili tutti i campi e annuncia al dispositivo che il descrittore è pronto, gli cede la proprietà dello slot. Da quel momento deve attendere la conferma di completamento prima di usare il posto per altri dati. Questa regola impedisce che il dispositivo incontri un indirizzo nuovo insieme alla lunghezza della richiesta precedente.",
      "Nel primo caso otto posti possono accogliere sette richieste e lasciarne uno libero. Se il driver osserva tre completamenti, quattro slot rimangono al dispositivo e quattro tornano disponibili al software. Nel secondo caso arrivano dodici richieste: otto occupano l’anello e quattro restano in attesa. Dopo gli stessi tre completamenti risultano cinque slot attivi e tre liberi, prima di un’ulteriore pubblicazione."
    ],
    "introduzione": [
      "L’esperimento permette di comprendere quando uno slot di un anello DMA possa essere riutilizzato. Ogni slot contiene un descrittore, la struttura che comunica al dispositivo il trasferimento richiesto; pubblicarlo trasferisce la proprietà dal driver alla periferica. Il recupero dei completamenti restituisce gli slot al software, mentre le richieste oltre la capacità iniziale restano in attesa di una successiva pubblicazione.",
      "Carica sette richieste in otto slot e avanza con «Passo successivo», confrontando posti pubblicati, liberi e restituiti dopo tre completamenti. Fissa il caso e carica dodici richieste: distingui le quattro rinviate dai cinque slot ancora attivi alla fine. Usa i conteggi accanto all’anello per verificare la capacità totale, ricordando che la traccia termina prima di pubblicare nuovamente le richieste in attesa."
    ],
    "esperienze": [
      {
        "titolo": "Sette richieste in otto slot",
        "parametri": {
          "cap": 8,
          "rich": 7,
          "fin": 3
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Slot nell’anello = 8; Richieste da pubblicare = 7; Completamenti osservabili al massimo = 3.",
          "Leggi il passo «Preparazione». Annota Descrittori preparati = 7; Richieste in attesa = 0. Prima di avanzare, prevedi il valore finale del campo «Liberi» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Pubblicazione». Annota Slot del dispositivo = 7; Slot ancora liberi = 1.",
          "Premi «Passo successivo» e fermati su «Recupero». Annota Restituiti = 3; Ancora attivi = 4; Liberi = 4."
        ],
        "risultato": "Nel passo «Recupero» il risultato è: Restituiti = 3; Ancora attivi = 4; Liberi = 4.",
        "ragionamento": "Si pubblicano sette descrittori e resta uno slot libero. Dopo tre completamenti risultano 7 − 3 = 4 slot attivi e 1 + 3 = 4 liberi.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Slot del dispositivo",
            "valore": "7"
          },
          {
            "passo": 1,
            "campo": "Slot ancora liberi",
            "valore": "1"
          },
          {
            "passo": 2,
            "campo": "Restituiti",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "Ancora attivi",
            "valore": "4"
          },
          {
            "passo": 2,
            "campo": "Liberi",
            "valore": "4"
          }
        ]
      },
      {
        "titolo": "Dodici richieste saturano l’anello",
        "parametri": {
          "cap": 8,
          "rich": 12,
          "fin": 3
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Slot nell’anello = 8; Richieste da pubblicare = 12; Completamenti osservabili al massimo = 3.",
          "Leggi il passo «Preparazione». Annota Descrittori preparati = 8; Richieste in attesa = 4. Prima di avanzare, prevedi il valore finale del campo «Liberi» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Pubblicazione». Annota Slot del dispositivo = 8; Slot ancora liberi = 0.",
          "Premi «Passo successivo» e fermati su «Recupero». Annota Restituiti = 3; Ancora attivi = 5; Liberi = 3."
        ],
        "risultato": "Nel passo «Recupero» il risultato è: Restituiti = 3; Ancora attivi = 5; Liberi = 3.",
        "ragionamento": "Otto slot permettono di pubblicare otto delle dodici richieste, lasciandone quattro in attesa. Recuperandone tre si ottengono cinque slot ancora attivi e tre liberi; il modello termina prima di ripubblicare le richieste in coda.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Slot del dispositivo",
            "valore": "8"
          },
          {
            "passo": 1,
            "campo": "Slot ancora liberi",
            "valore": "0"
          },
          {
            "passo": 2,
            "campo": "Restituiti",
            "valore": "3"
          },
          {
            "passo": 2,
            "campo": "Ancora attivi",
            "valore": "5"
          },
          {
            "passo": 2,
            "campo": "Liberi",
            "valore": "3"
          }
        ]
      }
    ]
  },
  "4.7.4": {
    "scopo": "Una periferica può raggiungere la cella giusta e leggere comunque dati precedenti se la cache della CPU deve ancora essere sincronizzata. Seguirai le tre numerazioni dell’indirizzo e confronterai una preparazione completa con l’omissione del trasferimento dalla cache alla RAM.",
    "lettura": "La riga superiore parte dall’indirizzo virtuale della CPU e dalla sua cache, che contiene 34. Quella inferiore parte dal dispositivo e attraversa la IOMMU. Entrambi i percorsi raggiungono la stessa RAM fisica; il valore nel suo riquadro spiega il byte effettivamente ricevuto.",
    "conclusione": "La traduzione degli indirizzi e la visibilità dei dati sono requisiti distinti. In questo modello di DMA privo di coerenza automatica, l’indirizzo corretto richiede anche la sincronizzazione della cache prima della lettura del dispositivo.",
    "controlli": {
      "off": "Offset in byte dentro la pagina, aggiunto alle basi virtuale 0x9000, fisica 0x3000 e DMA 0x5000.",
      "op": "Preparazione del driver: usare l’indirizzo DMA e sincronizzare rende visibile 34; omettere la sincronizzazione lascia 17 in RAM; usare il puntatore virtuale CPU causa un errore di traduzione del dispositivo."
    },
    "teoria": [
      "Un programma indica una cella di memoria mediante un indirizzo virtuale. Il processore traduce questo indirizzo nella posizione fisica che ospita il dato. Quando un dispositivo accede direttamente alla memoria (DMA), può usare una terza numerazione. La IOMMU, il circuito che traduce gli indirizzi dei dispositivi di ingresso e uscita, associa l’indirizzo DMA autorizzato alla posizione fisica. Il driver comunica al dispositivo l’indirizzo ottenuto per quella mappatura. VA abbrevia indirizzo virtuale. Una pagina è qui un gruppo contiguo di indirizzi con una base comune; l’offset è lo scostamento in byte dalla base. Il driver, il programma che controlla la periferica, scrive l’indirizzo DMA nel descrittore, la struttura che comunica alla periferica posizione e dimensione del trasferimento.",
      "Raggiungere la cella giusta risolve soltanto il problema della posizione. Il processore conserva copie dei dati in una memoria veloce, la cache. Qui una modifica resta nella cache finché viene riportata in memoria principale, detta RAM, e il dispositivo legge direttamente dalla RAM. Il driver deve quindi sincronizzare la copia modificata prima di affidare il buffer al dispositivo.",
      "Con uno scostamento di dodici byte, la cella appare alla CPU come 0x900C e al dispositivo come 0x500C. In queste scritture 0x introduce la base sedici e C indica dodici. Entrambi gli indirizzi conducono alla posizione fisica 0x300C attraverso le rispettive traduzioni. Con l’indirizzo DMA corretto si legge 34 dopo la sincronizzazione, oppure il vecchio 17 se la RAM deve ancora essere aggiornata. Fornendo l’indirizzo virtuale della CPU, invece, la traduzione del dispositivo fallisce.",
      "La sincronizzazione studiata riguarda la visibilità dei dati fra cache e RAM. L’ordinamento con cui il descrittore viene pubblicato è già rispettato in tutti i casi della simulazione. Per isolare il difetto si cambia quindi la preparazione del dato oppure l’indirizzo, mantenendo regolare la sequenza di pubblicazione."
    ],
    "introduzione": [
      "Raggiungere la cella corretta e trovarvi il dato aggiornato sono due requisiti che questa simulazione permette di verificare separatamente. La IOMMU traduce l’indirizzo usato dal dispositivo verso la RAM fisica; la CPU usa una propria numerazione virtuale. Nel modello, privo di coerenza automatica, una modifica nella cache, memoria veloce del processore, deve essere sincronizzata in RAM prima della lettura DMA.",
      "Carica mappatura e sincronizzazione complete e segui con «Passo successivo» gli indirizzi virtuale, fisico e DMA con offset dodici. Confronta poi il caso che omette la sincronizzazione, osservando il vecchio diciassette letto al posto di trentaquattro. Seleziona infine il puntatore virtuale CPU e applica i parametri: individua il fallimento della traduzione, distinto dal dato obsoleto raggiunto all’indirizzo valido."
    ],
    "esperienze": [
      {
        "titolo": "Mappatura e sincronizzazione complete",
        "parametri": {
          "off": 12,
          "op": "ok"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Offset nella pagina (B) = 12; Preparazione del driver = Indirizzo DMA e sincronizzazione.",
          "Leggi il passo «Scrittura della CPU». Annota VA CPU = 0x900C; Indirizzo fisico = 0x300C; Indirizzo DMA assegnato = 0x500C. Prima di avanzare, prevedi il valore finale del campo «Byte ricevuto» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Descrittore e ordinamento». Annota Indirizzo programmato = 0x500C; Contenuto in memoria = 34.",
          "Premi «Passo successivo» e fermati su «Lettura del dispositivo». Annota Traduzione = 0x300C; Byte ricevuto = 34."
        ],
        "risultato": "Nel passo «Lettura del dispositivo» il risultato è: Traduzione = 0x300C; Byte ricevuto = 34.",
        "ragionamento": "L’offset 12 = 0xC produce VA 0x900C, posizione fisica 0x300C e indirizzo DMA 0x500C. La sincronizzazione riporta 34 dalla cache alla RAM; la IOMMU traduce 0x500C in 0x300C e il dispositivo riceve 34.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Indirizzo programmato",
            "valore": "0x500C"
          },
          {
            "passo": 1,
            "campo": "Contenuto in memoria",
            "valore": "34"
          },
          {
            "passo": 2,
            "campo": "Traduzione",
            "valore": "0x300C"
          },
          {
            "passo": 2,
            "campo": "Byte ricevuto",
            "valore": "34"
          }
        ]
      },
      {
        "titolo": "Indirizzo valido con RAM da aggiornare",
        "parametri": {
          "off": 12,
          "op": "cache"
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Offset nella pagina (B) = 12; Preparazione del driver = Indirizzo DMA, omette sincronizzazione.",
          "Leggi il passo «Scrittura della CPU». Annota VA CPU = 0x900C; Indirizzo fisico = 0x300C; Indirizzo DMA assegnato = 0x500C. Prima di avanzare, prevedi il valore finale del campo «Byte ricevuto» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Descrittore e ordinamento». Annota Indirizzo programmato = 0x500C; Contenuto in memoria = 17.",
          "Premi «Passo successivo» e fermati su «Lettura del dispositivo». Annota Traduzione = 0x300C; Byte ricevuto = 17."
        ],
        "risultato": "Nel passo «Lettura del dispositivo» il risultato è: Traduzione = 0x300C; Byte ricevuto = 17.",
        "ragionamento": "La traduzione resta corretta e conduce ancora a 0x300C. La RAM conserva però 17 perché manca la sincronizzazione della copia modificata: il dispositivo legge quel 17 mentre la cache CPU contiene già 34.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Indirizzo programmato",
            "valore": "0x500C"
          },
          {
            "passo": 1,
            "campo": "Contenuto in memoria",
            "valore": "17"
          },
          {
            "passo": 2,
            "campo": "Traduzione",
            "valore": "0x300C"
          },
          {
            "passo": 2,
            "campo": "Byte ricevuto",
            "valore": "17"
          }
        ]
      }
    ]
  },
  "4.7.5": {
    "scopo": "Il completamento del DMA precede spesso la ripresa del programma che attende i dati. Ricostruirai gli istanti di ultimo byte, interrupt, risveglio e assegnazione del core, separando la latenza di notifica da quella dello scheduler.",
    "lettura": "La barra temporale accosta DMA, notifica, lavoro del driver e attesa del thread pronto. Le larghezze sono proporzionali alle durate impostate; le etichette sotto riportano gli istanti assoluti. Il tratto fra ultimo byte e ripresa comprende tutte le fasi successive al DMA.",
    "conclusione": "Rendere disponibili i dati e assegnare il processore al richiedente sono eventi distinti. Anche annullando l’attesa dello scheduler rimangono la consegna della notifica e il servizio necessario a restituire il buffer al software.",
    "controlli": {
      "t": "Durata del trasferimento DMA dall’avvio, in microsecondi. Lo stato di completamento diventa disponibile all’istante dell’ultimo byte.",
      "batch": "Ritardo fra completamento del trasferimento e arrivo dell’interrupt, in microsecondi. Il servizio del driver richiede poi tre microsecondi fissi.",
      "sched": "Attesa del thread dopo che il driver lo ha reso pronto, in microsecondi. Al suo termine il thread riottiene il core."
    },
    "teoria": [
      "Un programma che richiede una lettura può sospendere il proprio thread, la sequenza di istruzioni che il processore stava eseguendo, mentre il dispositivo porta i dati in memoria. Quando il trasferimento avviene mediante DMA, ossia accesso diretto alla memoria, il dispositivo può scrivere l’ultimo byte anche se in quel momento il processore sta svolgendo tutt’altro lavoro. Il core è l’unità del processore che esegue il thread; la scala usa microsecondi, indicati con µs, ciascuno pari a un milionesimo di secondo.",
      "Perché il thread riprenda, il sistema deve prima apprendere che i dati sono arrivati. Il dispositivo segnala il completamento con una richiesta di interruzione. Il driver, il codice che serve la periferica, verifica l’esito, riacquisisce il buffer che ospita i dati e rende il thread pronto. Il momento in cui torna a eseguire dipende poi dallo scheduler, a cui spetta assegnare i turni sul processore.",
      "Se l’ultimo byte arriva a 40 microsecondi, la notifica impiega quattro microsecondi e il driver altri tre, il thread è pronto all’istante 47. Con otto microsecondi di attesa fra i pronti, riprende a 55. L’intervallo fra il completamento dei dati e la prima istruzione vale dunque quindici microsecondi, dei quali soltanto otto dipendono dall’attesa del turno."
    ],
    "introduzione": [
      "Questa simulazione serve a ricostruire il tempo fra completamento fisico dei dati e ripresa del programma. Il dispositivo DMA consegna l’ultimo byte, poi notifica il driver, che controlla l’esito e restituisce il buffer al software. Il thread risvegliato è pronto a proseguire, mentre lo scheduler deve ancora assegnargli un core, l’unità del processore che ne eseguirà le istruzioni.",
      "Carica il caso con otto microsecondi di attesa da pronto e avanza con «Passo successivo», annotando ultimo byte, interrupt, disponibilità del thread e ripresa. Confronta poi l’assegnazione immediata dopo il risveglio, usando «Fissa per confronto». Osserva che il ritardo finale scende da quindici a sette microsecondi: notifica e servizio del driver restano presenti anche quando l’attesa dello scheduler è zero."
    ],
    "esperienze": [
      {
        "titolo": "Ripresa dopo otto microsecondi da pronto",
        "parametri": {
          "t": 40,
          "batch": 4,
          "sched": 8
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Trasferimento DMA (µs) = 40; Ritardo di notifica (µs) = 4; Attesa dello scheduler (µs) = 8.",
          "Leggi il passo «Fine del trasferimento». Annota Stato disponibile a (µs) = 40; Thread = sospeso. Prima di avanzare, prevedi il valore finale del campo «Dall’ultimo byte alla ripresa (µs)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Notifica e servizio». Annota Interrupt a (µs) = 44; Thread eseguibile a (µs) = 47.",
          "Premi «Passo successivo» e fermati su «Ripresa in CPU». Annota Ripresa a (µs) = 55; Dall’ultimo byte alla ripresa (µs) = 15."
        ],
        "risultato": "Nel passo «Ripresa in CPU» il risultato è: Ripresa a (µs) = 55; Dall’ultimo byte alla ripresa (µs) = 15.",
        "ragionamento": "L’ultimo byte arriva a 40 µs, l’interrupt a 40 + 4 = 44 e il thread è pronto a 44 + 3 = 47. Dopo otto microsecondi di attesa riprende a 55, quindi trascorrono 15 µs dall’ultimo byte.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Interrupt a (µs)",
            "valore": "44"
          },
          {
            "passo": 1,
            "campo": "Thread eseguibile a (µs)",
            "valore": "47"
          },
          {
            "passo": 2,
            "campo": "Ripresa a (µs)",
            "valore": "55"
          },
          {
            "passo": 2,
            "campo": "Dall’ultimo byte alla ripresa (µs)",
            "valore": "15"
          }
        ]
      },
      {
        "titolo": "Assegnazione immediata dopo il risveglio",
        "parametri": {
          "t": 40,
          "batch": 4,
          "sched": 0
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Trasferimento DMA (µs) = 40; Ritardo di notifica (µs) = 4; Attesa dello scheduler (µs) = 0.",
          "Leggi il passo «Fine del trasferimento». Annota Stato disponibile a (µs) = 40; Thread = sospeso. Prima di avanzare, prevedi il valore finale del campo «Dall’ultimo byte alla ripresa (µs)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Notifica e servizio». Annota Interrupt a (µs) = 44; Thread eseguibile a (µs) = 47.",
          "Premi «Passo successivo» e fermati su «Ripresa in CPU». Annota Ripresa a (µs) = 47; Dall’ultimo byte alla ripresa (µs) = 7."
        ],
        "risultato": "Nel passo «Ripresa in CPU» il risultato è: Ripresa a (µs) = 47; Dall’ultimo byte alla ripresa (µs) = 7.",
        "ragionamento": "Con attesa dello scheduler uguale a zero, il thread riprende appena il driver conclude a 47 µs. Dall’ultimo byte restano comunque 47 − 40 = 7 µs, formati da quattro di notifica e tre di servizio.",
        "attesi": [
          {
            "passo": 1,
            "campo": "Interrupt a (µs)",
            "valore": "44"
          },
          {
            "passo": 1,
            "campo": "Thread eseguibile a (µs)",
            "valore": "47"
          },
          {
            "passo": 2,
            "campo": "Ripresa a (µs)",
            "valore": "47"
          },
          {
            "passo": 2,
            "campo": "Dall’ultimo byte alla ripresa (µs)",
            "valore": "7"
          }
        ]
      }
    ]
  },
  "4.7.6": {
    "scopo": "Il dispositivo trasferisce un blocco mentre la CPU interviene soprattutto prima e dopo il flusso dei dati. Calcolerai il tempo dati di otto MiB, tenendolo distinto dal lavoro del driver.",
    "lettura": "I tre passi separano preparazione, trasferimento e completamento. Il rapporto 8 MiB diviso 400 MiB/s riguarda la sola fase centrale; le attività del processore ai lati richiedono misure proprie per essere contabilizzate.",
    "conclusione": "Le grandezze devono riferirsi alla fase studiata: byte e banda determinano la durata del trasferimento, mentre i cicli di preparazione e di servizio determinano il lavoro del processore.",
    "teoria": [
      "Quando un dispositivo trasferisce direttamente un blocco in memoria, il processore può occuparsi di altro durante il passaggio dei dati. La tecnica prende il nome di DMA, accesso diretto alla memoria. Al processore spettano la preparazione della richiesta e il servizio della notifica di completamento. Questi due interventi si trovano ai lati dell’intervallo in cui i byte attraversano il collegamento. Il driver è il codice del sistema operativo che serve il dispositivo; per preparare il trasferimento compila un descrittore, una struttura che contiene almeno l’indirizzo dei dati, la loro lunghezza e la direzione dell’operazione.",
      "Per misurare il solo trasferimento servono la quantità di dati e la velocità effettiva. Un mebibyte, indicato con MiB, contiene 1 048 576 byte. Se nella velocità compare la stessa unità, il rapporto fra MiB e MiB al secondo fornisce direttamente una durata in secondi. Un secondo comprende mille millisecondi.",
      "Gli otto MiB della richiesta guidata viaggiano a 400 MiB al secondo. Il rapporto 8 / 400 dà 0,02 secondi, equivalenti a venti millisecondi. Per conoscere quanti cicli di CPU occupi l’intera richiesta servirebbero anche i costi di preparazione e di servizio. Il disegno attribuisce il passaggio dei dati al dispositivo e le due attività di controllo al processore."
    ],
    "introduzione": [
      "Misurare la durata del trasferimento separatamente dal lavoro del processore è lo scopo di questa ricostruzione. Con il DMA il dispositivo sposta i dati, mentre il driver prepara la richiesta e serve il completamento. Il rapporto fra quantità e velocità determina la fase dati; usando MiB sia per la quantità sia per la banda, si ottiene direttamente un tempo in secondi.",
      "Leggi gli otto MiB trasferiti a quattrocento MiB al secondo e scrivi la previsione in millisecondi. Avanza con «Passo successivo» attraverso preparazione, trasferimento e completamento, confrontando 0,02 secondi con venti millisecondi. Attribuisci questo intervallo alla fase centrale; le attività CPU mostrate ai lati richiedono costi propri per calcolarne l’occupazione, che resta distinta dalla durata appena ricavata."
    ],
    "procedura": [
      "Leggi i dati iniziali: Il controller deve trasferire 8 MiB. La fase dati procede a 400 MiB/s. I tempi di preparazione e di servizio dell’interrupt si contabilizzano separatamente.",
      "Prima di avviare la ricostruzione, scrivi una previsione per questa domanda: Quanti millisecondi dura il solo trasferimento?",
      "Premi «Passo successivo» per attraversare «Preparazione», «Trasferimento», «Completamento». A ogni passaggio confronta le quantità indicate con il ragionamento teorico.",
      "Raggiungi l’ultimo fotogramma e confronta la previsione con il risultato. Usa «Precedente» per rileggere il passaggio che determina il valore finale."
    ],
    "risultato": "Per la domanda «Quanti millisecondi dura il solo trasferimento?» il valore atteso è 20.",
    "ragionamento": "Il driver prepara il descrittore. Il suo costo in cicli CPU è separato dal tempo impiegato dal dispositivo. La durata è il rapporto tra quantità e velocità: 8 / 400 = 0,02 secondi. Il dispositivo trasferisce dati per 20 ms. Per calcolare separatamente il lavoro della CPU occorrono i cicli di preparazione e quelli del gestore di completamento."
  },
  "4.7.7": {
    "scopo": "Una scheda di rete deve scrivere un pacchetto nel buffer predisposto dal driver. Selezionerai l’indirizzo restituito dalla mappatura DMA e stabilirai il verso dell’operazione osservandolo dalla RAM.",
    "lettura": "Il percorso del pacchetto parte dal dispositivo e termina nel buffer. L’indirizzo della CPU e quello DMA sono due nomi della regione nelle rispettive traduzioni: il descrittore della scheda deve contenere il secondo.",
    "conclusione": "Configurare un trasferimento richiede l’indirizzo valido per quel dispositivo e la direzione corretta rispetto alla memoria. In ricezione la scheda produce i dati e li scrive nel buffer.",
    "teoria": [
      "Il buffer è l’area della memoria principale, detta RAM, destinata ai dati del trasferimento. Il driver è il programma che controlla la periferica; l’API DMA è l’insieme di funzioni con cui chiede al sistema di predisporre un accesso diretto alla memoria. Una scheda di rete deve poter trasferire i pacchetti fra il proprio circuito e la memoria del calcolatore. Con il DMA, cioè l’accesso diretto alla memoria, il processore prepara l’operazione e il dispositivo trasferisce i byte. Il driver deve comunicargli un indirizzo utilizzabile dal dispositivo.",
      "Il driver chiede al sistema una mappatura del buffer, cioè una corrispondenza che consenta alla scheda di accedere a quella stessa regione. Nel descrittore, la struttura che la scheda consulta per lavorare, vengono scritti l’indirizzo restituito dalla mappatura e il numero dei byte.",
      "Nel caso guidato la scheda riceve dalla rete un pacchetto di 96 byte, quindi deve scrivere il buffer in RAM. La CPU vede il buffer a 0x9800, mentre la funzione di mappatura DMA restituisce 0x2800. Il descrittore deve contenere 0x2800 e la lunghezza 96. La mappatura permette al dispositivo di raggiungere quella regione attraverso la numerazione prevista per i suoi accessi. Il prefisso 0x introduce la base sedici. Nel campo numerico 0x2800 corrisponde a 2 × 16³ + 8 × 16² = 8192 + 2048 = 10240; si tratta dello stesso indirizzo scritto in decimale."
    ],
    "introduzione": [
      "L’esercitazione serve a preparare una ricezione DMA scegliendo l’indirizzo valido per la scheda e il verso dell’operazione rispetto alla memoria. Il buffer è la regione destinata al pacchetto; la mappatura DMA fornisce al driver, il programma che controlla la periferica, l’indirizzo da inserire nel descrittore. In ricezione la scheda produce i dati e li scrive nella RAM.",
      "Premi «Carica l’esempio guidato» e confronta il puntatore CPU 0x9800 con l’indirizzo DMA 0x2800 restituito dalla mappatura. Inserisci «Indirizzo per il dispositivo» e premi «Registra la previsione», poi segui «Passo successivo». Verifica il valore decimale 10240 e osserva il percorso dei novantasei byte dalla scheda al buffer, così da motivare la scelta «Scrittura» nella verifica finale."
    ],
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 3 «Configurare indirizzo e direzione DMA», traccia 1. La spiegazione seguente si riferisce a questi dati.",
      "Leggi la consegna: Una scheda di rete riceve un pacchetto di 96 B. La CPU vede il buffer a 0x9800 e l’API DMA restituisce 0x2800. Indica l’indirizzo da mettere nel descrittore e il tipo di operazione che la scheda emette sulla memoria.",
      "Calcola il primo campo «Indirizzo per il dispositivo» e premi «Registra la previsione» per avviare la ricostruzione. Il riscontro permette di confrontare il tuo risultato con i passaggi successivi.",
      "Segui la ricostruzione fino alla verifica dei campi; con «Apri la prova completa» puoi inserire tutte le risposte. Cambiando esercizio o traccia, rileggi la nuova consegna e usa i relativi dati."
    ],
    "risultato": "Nell’esercizio 3, traccia 1, si ottiene: Indirizzo per il dispositivo = 10240; Operazione in RAM = Scrittura.",
    "ragionamento": "Il buffer è destinazione di un trasferimento dal dispositivo verso la memoria. Il driver inserisce indirizzo DMA 0x2800 e lunghezza 96 nel descrittore. La scheda agisce da iniziatore e scrive i byte nel buffer. Il completamento permette al driver di riacquisirlo."
  },
  "4.7.8": {
    "scopo": "Le registrazioni di dispositivo, driver e scheduler descrivono fasi diverse della stessa lettura. Le ordinerai per ricostruire il risveglio del thread e il tempo che separa l’ultimo byte dalla ripresa sul core.",
    "lettura": "Leggi gli eventi secondo le dipendenze: dato completo, notifica ricevuta, servizio del driver concluso e turno del thread. Le durate del driver e dello scheduler si aggiungono ai rispettivi istanti d’inizio; il confronto finale sottrae due istanti assoluti.",
    "conclusione": "Il risveglio rende il thread pronto, mentre la ripresa richiede l’assegnazione del core. Combinare le tracce dei diversi componenti permette di localizzare la latenza successiva al completamento fisico dei dati.",
    "teoria": [
      "DMA significa accesso diretto alla memoria: il dispositivo trasferisce i dati mentre il processore può eseguire altro codice. Il driver è il programma che governa la periferica; il core è l’unità del processore alla quale viene assegnato il thread. Le registrazioni della consegna sono annotazioni temporali degli eventi osservati dai tre componenti. Un programma può sospendere il proprio thread, cioè il flusso di istruzioni in esecuzione, mentre attende dati da una periferica. Al termine di un trasferimento DMA i byte possono già trovarsi in memoria prima che il programma abbia avuto l’occasione di usarli. Occorre che il sistema operativo apprenda l’esito e assegni nuovamente il processore al thread.",
      "Dopo aver verificato il completamento, il driver può risvegliare il thread. Il thread diventa allora pronto, ossia in grado di proseguire appena riceverà un core. Spetta allo scheduler, la parte del sistema che sceglie il prossimo flusso da eseguire, stabilire quando avverrà l’assegnazione.",
      "Nella traccia guidata l’ultimo byte arriva a 18 microsecondi e la notifica al driver a 21. Il servizio del driver richiede quattro microsecondi, quindi il thread diventa pronto a 25; dopo altri sei microsecondi di attesa riprende sul core a 31. Fra ultimo byte e ripresa trascorrono tredici microsecondi: tre di notifica, quattro di servizio e sei di attesa da pronto."
    ],
    "introduzione": [
      "Riunire le registrazioni di dispositivo, driver e scheduler serve a ricostruire la cronologia completa di una lettura DMA. Il completamento rende presenti i byte; il driver riceve la notifica e risveglia il thread, ossia il flusso di istruzioni in attesa. Essere pronto precede ancora l’assegnazione del core: distinguendo questi passaggi potrai misurare la latenza successiva all’ultimo byte.",
      "Carica l’esempio guidato e ordina mentalmente ultimo byte, notifica, risveglio e ripresa prima di avanzare. Con «Passo successivo» confronta gli istanti diciotto, ventuno, venticinque e trentuno microsecondi. Verifica il risveglio aggiungendo il servizio del driver e calcola tredici microsecondi fra dato completo e ripresa; «Precedente» aiuta a separare i tre intervalli che compongono questa attesa finale."
    ],
    "procedura": [
      "Premi «Carica l’esempio guidato» per selezionare l’esercizio 5 «Confrontare costo fisso e completamento effettivo», traccia 2. La spiegazione seguente si riferisce a questi dati.",
      "Leggi la consegna: I registri di una lettura DMA provengono da tre componenti. Lo scheduler assegna il core 6 µs dopo il risveglio del thread. Il dispositivo consegna l’ultimo byte a t = 18 µs. Il driver riceve la notifica a t = 21 µs e impiega 4 µs prima di risvegliare il thread. Ordina gli eventi, poi determina l’istante di risveglio e il tempo trascorso dall’ultimo byte alla ripresa.",
      "Ricostruisci il primo campo «Cronologia» prima di leggere lo svolgimento. Avanza con «Passo successivo» e controlla i dati impiegati in ciascuna operazione.",
      "Segui la ricostruzione fino alla verifica dei campi; con «Apri la prova completa» puoi inserire tutte le risposte. Cambiando esercizio o traccia, rileggi la nuova consegna e usa i relativi dati."
    ],
    "risultato": "Nell’esercizio 5, traccia 2, si ottiene: Cronologia = Ultimo byte → Notifica → Risveglio → Ripresa sul core; Istante del risveglio (µs) = 25; Dall’ultimo byte alla ripresa (µs) = 13.",
    "ragionamento": "Il dispositivo termina a 18 µs e il driver riceve la notifica a 21 µs. I due segnali distano 21 − 18 = 3 µs. Solo dopo il servizio del driver il thread dispone dei dati. Il risveglio avviene a 21 + 4 = 25 µs. Il thread pronto riottiene il core a 25 + 6 = 31 µs. La sequenza va quindi dall’ultimo byte alla notifica, al risveglio e alla ripresa. Fra il primo e l’ultimo evento trascorrono 31 − 18 = 13 µs."
  },
  "modulo-4": {
    "scopo": "Una richiesta di lettura deve attendere il bus, trasferire i dati e riottenere il processore dopo il servizio del driver. Ricostruirai l’intera cronologia della richiesta B, per attribuire il ritardo a ciascuna risorsa coinvolta.",
    "lettura": "La barra orizzontale segue una scala temporale comune per tutta la simulazione. AR indica arbitraggio, DMA i dati di B, IRQ la notifica e «pronto» l’attesa dello scheduler. Le tre schede del thread evidenziano il passaggio da sospeso a pronto e infine sul core.",
    "conclusione": "Una richiesta aggiunta davanti a B sposta sia il completamento dei dati sia la ripresa del thread. Il loro intervallo resta determinato dalle fasi successive all’ultimo byte, finché notifica, driver e attesa dello scheduler conservano le stesse durate.",
    "controlli": {
      "coda": "Richieste che precedono B sul bus. Ciascuna trasferisce quattro parole e occupa cinque microsecondi: uno di arbitraggio e quattro di dati.",
      "parole": "Parole da quattro byte della richiesta B. Il bus trasferisce una parola per microsecondo, dopo il ciclo di arbitraggio di B.",
      "attesa": "Microsecondi trascorsi nello stato pronto prima di riottenere il core. Fra ultimo byte e stato pronto si aggiungono due microsecondi di notifica e tre di servizio del driver."
    },
    "teoria": [
      "Un programma ha chiesto a una periferica una sequenza di dati che dovrà trovare nella memoria principale del computer, la RAM. Il driver, cioè il codice del sistema operativo che governa la periferica, le affida la richiesta B. Nel descrittore, una struttura che descrive il lavoro affidato al dispositivo, indica la regione di memoria destinata ai dati, detta buffer, e il numero di parole da trasferire. Con l’accesso diretto alla memoria (DMA) sarà la periferica a scrivere nel buffer, mentre il thread, il flusso di istruzioni che ha richiesto la lettura, resta sospeso e attende la disponibilità dei dati.",
      "Il collegamento condiviso fra dispositivo e memoria si chiama bus. Le richieste ricevono un turno nell’ordine di arrivo. Ogni turno comincia con un ciclo di arbitraggio, nel quale si assegna il collegamento. Seguono i cicli dati, ciascuno dei quali porta una parola da quattro byte. Nel modello un ciclo dura un microsecondo. Una richiesta precedente da quattro parole occupa quindi il bus per cinque microsecondi. Con una sola richiesta davanti e quattro parole da trasferire, i sedici byte di B sono tutti in RAM all’istante dieci.",
      "Il dispositivo invia una notifica che giunge due microsecondi più tardi. Il driver impiega altri tre microsecondi per controllare il completamento, riacquisire il buffer e risvegliare il thread. Il thread è ora pronto: dispone dei dati necessari e attende un core, cioè un’unità del processore che ne esegua le istruzioni. Se lo scheduler, che stabilisce i turni del processore, lo fa attendere altri quattro microsecondi, la prima istruzione riprende all’istante diciannove. La distanza fra i segni dell’ultimo byte e della ripresa raccoglie proprio questi tre intervalli."
    ],
    "introduzione": [
      "La simulazione integrata serve a seguire una lettura dalla coda sul bus fino alla prima istruzione del thread risvegliato. Il DMA affida al dispositivo la scrittura dei dati in memoria; il driver ne verifica il completamento e rende pronto il thread, il flusso di istruzioni richiedente. L’assegnazione del core conclude una cronologia nella quale ogni risorsa aggiunge una componente distinta di attesa.",
      "Carica il caso con una richiesta davanti a B e avanza con «Passo successivo», confrontando arbitraggio, ultimo byte, notifica e stati del thread. Fissa il risultato e carica le due richieste precedenti. Osserva lo spostamento dell’ultimo byte da dieci a quindici microsecondi e della ripresa da diciannove a ventiquattro: spiega perché l’intervallo fra i due eventi rimanga di nove microsecondi."
    ],
    "esperienze": [
      {
        "titolo": "Una richiesta davanti a B",
        "parametri": {
          "coda": 1,
          "parole": 4,
          "attesa": 4
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Richieste davanti a B (4 parole ciascuna) = 1; Parole DMA della richiesta B = 4; Attesa da pronto a in esecuzione (µs) = 4.",
          "Leggi il passo «Richiesta e sospensione». Annota Davanti in coda = 1; Lunghezza (B) = 16; Thread = sospeso. Prima di avanzare, formula la previsione richiesta nel campo «Intervallo dall’ultimo byte alla ripresa del thread (µs)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Concessione del bus». Annota Inizio arbitraggio B (µs) = 5; Inizio dati B (µs) = 6.",
          "Premi «Passo successivo» e fermati su «Scrittura DMA in RAM». Annota Byte in RAM = 16; Ultimo byte disponibile a (µs) = 10; Thread = sospeso.",
          "Premi «Passo successivo» e fermati su «Notifica e servizio». Annota Interrupt (µs) = 12; Thread pronto a (µs) = 15; Proprietario buffer = software.",
          "Premi «Passo successivo» e fermati su «Ritorno sul core». Annota Ripresa (µs) = 19; Ultimo byte → ripresa (µs) = 9; Thread = in esecuzione."
        ],
        "risultato": "Nel passo «Ritorno sul core» il risultato è: Ripresa (µs) = 19; Ultimo byte → ripresa (µs) = 9; Thread = in esecuzione.",
        "ragionamento": "La richiesta precedente occupa 5 µs; B usa un altro microsecondo per l’arbitraggio e quattro per i dati, disponibili a 10 µs. Seguono due microsecondi di notifica, tre di servizio e quattro di attesa: ripresa a 19 µs, nove dopo l’ultimo byte.",
        "attesi": [
          {
            "passo": 3,
            "campo": "Interrupt (µs)",
            "valore": "12"
          },
          {
            "passo": 3,
            "campo": "Thread pronto a (µs)",
            "valore": "15"
          },
          {
            "passo": 3,
            "campo": "Proprietario buffer",
            "valore": "software"
          },
          {
            "passo": 4,
            "campo": "Ripresa (µs)",
            "valore": "19"
          },
          {
            "passo": 4,
            "campo": "Ultimo byte → ripresa (µs)",
            "valore": "9"
          },
          {
            "passo": 4,
            "campo": "Thread",
            "valore": "in esecuzione"
          }
        ]
      },
      {
        "titolo": "Due richieste prima del trasferimento",
        "parametri": {
          "coda": 2,
          "parole": 4,
          "attesa": 4
        },
        "passi": [
          "Premi «Carica questo caso». Controlla i dati impostati: Richieste davanti a B (4 parole ciascuna) = 2; Parole DMA della richiesta B = 4; Attesa da pronto a in esecuzione (µs) = 4.",
          "Leggi il passo «Richiesta e sospensione». Annota Davanti in coda = 2; Lunghezza (B) = 16; Thread = sospeso. Prima di avanzare, formula la previsione richiesta nel campo «Intervallo dall’ultimo byte alla ripresa del thread (µs)» usando la relazione spiegata nella teoria.",
          "Premi «Passo successivo» e fermati su «Concessione del bus». Annota Inizio arbitraggio B (µs) = 10; Inizio dati B (µs) = 11.",
          "Premi «Passo successivo» e fermati su «Scrittura DMA in RAM». Annota Byte in RAM = 16; Ultimo byte disponibile a (µs) = 15; Thread = sospeso.",
          "Premi «Passo successivo» e fermati su «Notifica e servizio». Annota Interrupt (µs) = 17; Thread pronto a (µs) = 20; Proprietario buffer = software.",
          "Premi «Passo successivo» e fermati su «Ritorno sul core». Annota Ripresa (µs) = 24; Ultimo byte → ripresa (µs) = 9; Thread = in esecuzione."
        ],
        "risultato": "Nel passo «Ritorno sul core» il risultato è: Ripresa (µs) = 24; Ultimo byte → ripresa (µs) = 9; Thread = in esecuzione.",
        "ragionamento": "Due richieste precedenti occupano 10 µs, quindi B consegna l’ultimo byte a 10 + 1 + 4 = 15 µs. La ripresa avviene a 15 + 2 + 3 + 4 = 24 µs; l’intervallo finale resta nove microsecondi perché la nuova coda ha agito prima del completamento dei dati.",
        "attesi": [
          {
            "passo": 3,
            "campo": "Interrupt (µs)",
            "valore": "17"
          },
          {
            "passo": 3,
            "campo": "Thread pronto a (µs)",
            "valore": "20"
          },
          {
            "passo": 3,
            "campo": "Proprietario buffer",
            "valore": "software"
          },
          {
            "passo": 4,
            "campo": "Ripresa (µs)",
            "valore": "24"
          },
          {
            "passo": 4,
            "campo": "Ultimo byte → ripresa (µs)",
            "valore": "9"
          },
          {
            "passo": 4,
            "campo": "Thread",
            "valore": "in esecuzione"
          }
        ]
      }
    ]
  }
};
  Object.assign(SL.guide, percorsi);
  for (const [id, guida] of Object.entries(percorsi)) SL.lezioni[id] = guida.teoria;
})();
