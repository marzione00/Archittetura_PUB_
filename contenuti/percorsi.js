'use strict';
SL.domandeCapitolo = {
  "1.1": "Il comando hello attraversa la shell, la libreria e il kernel prima di produrre un byte sul terminale. Gli esempi seguono il passaggio del controllo e dei dati tra questi componenti.",
  "1.2": "Una sequenza di bit acquista un valore quando si fissano il peso delle cifre, la larghezza della parola e l’ordine dei byte in memoria.",
  "1.3": "Gli stessi byte possono rappresentare caratteri, campioni audio o campi di un record. Il formato stabilisce quali byte leggere insieme e come interpretarli.",
  "1.4": "La larghezza di un registro limita i valori rappresentabili. La lettura con segno e quella senza segno attribuiscono significati diversi agli stessi bit e agli stessi risultati aritmetici.",
  "1.5": "Una tabella di verità descrive la funzione di una porta. Combinando le porte si costruiscono maschere, sommatori e circuiti la cui uscita diventa stabile dopo un ritardo.",
  "1.6": "Tra due numeri rappresentabili in virgola mobile c’è un intervallo. La posizione del risultato esatto in quell’intervallo determina il valore che il registro conserva.",
  "1.7": "Un record di telemetria contiene un nome, misure numeriche e flag. Prima di usare questi campi il lettore controlla la lunghezza, interpreta i byte e verifica i permessi.",
  "2.1": "Ogni istruzione legge una parte dello stato della macchina e può modificarne un’altra. Registri e flag consentono di seguire la differenza tra caricamento, copia e calcolo.",
  "2.2": "Nel calcolo su registri contano l’ordine degli operandi e la larghezza del risultato. I flag prodotti da un’istruzione possono decidere il salto successivo.",
  "2.3": "L’indirizzo di un elemento deriva dalla base, dal passo fra elementi e dalla sua posizione. La larghezza dell’accesso determina quali byte entrano nel registro.",
  "2.4": "Maschere e scorrimenti permettono di estrarre o sostituire un campo del registro conservando i bit esterni al campo.",
  "2.5": "In una chiamata di sistema Linux x86-64 i registri identificano il servizio e i suoi argomenti. Il valore restituito permette al processo di proseguire anche dopo un trasferimento parziale.",
  "2.6": "La convenzione di chiamata stabilisce dove passano gli argomenti e quali registri il chiamato deve ripristinare. Lo stack conserva l’indirizzo necessario per il ritorno.",
  "2.7": "Sul medesimo stack possono trovarsi dati locali e informazioni di controllo. La posizione del primo byte oltre un buffer determina quale regione può essere alterata.",
  "3.1": "Un sommatore completo tratta due bit e il riporto entrante. Collegare le colonne permette di osservare la somma, il riporto finale e il ritardo con cui si stabilizza il risultato.",
  "3.2": "Un circuito sequenziale conserva uno stato. Il valore acquisito dipende dai segnali d’ingresso e dall’istante in cui il dispositivo è abilitato a leggerli.",
  "3.3": "Nel formato Y86-64 il primo byte identifica la classe e la funzione. I campi successivi permettono al processore di recuperare gli operandi e calcolare il prossimo PC.",
  "3.4": "Nel processore SEQ i segnali attraversano il percorso dati prima del fronte di clock. Il percorso più lento fissa il periodo minimo del modello.",
  "3.5": "Una pipeline sovrappone gli stadi di istruzioni diverse. La durata di una singola istruzione e l’intervallo fra due completamenti sono due misure distinte.",
  "3.6": "Nella pipeline a cinque stadi un consumatore può ricevere un valore per inoltro oppure attendere. La posizione del produttore e lo stadio in cui serve il dato determinano l’esito.",
  "4.1": "Quando il processore entra in un gestore, salva lo stato necessario alla ripresa. La classe dell’evento determina a quale istruzione potrà tornare.",
  "4.2": "Il kernel interpreta i registri, controlla gli argomenti e svolge il servizio richiesto. Il risultato di una write indica quanti byte sono stati effettivamente accettati.",
  "4.3": "Un driver può interrogare il registro di stato o attendere un interrupt. La notifica e la rimozione della sua causa sono operazioni distinte.",
  "4.4": "Più richiedenti possono contendersi lo stesso bus. L’attesa del turno, l’arbitraggio e il trasferimento dei dati occupano intervalli distinti.",
  "4.5": "Nel disco magnetico la durata di un accesso comprende movimento della testina, attesa del settore e trasferimento. L’ordine delle richieste modifica il percorso della testina.",
  "4.6": "Una scrittura logica genera operazioni diverse su una stripe RAID e su una memoria flash. Parità, copie e rimappatura determinano il lavoro fisico richiesto.",
  "4.7": "Con il DMA il dispositivo trasferisce i dati in memoria dopo la preparazione del driver. L’arrivo dell’ultimo byte, l’interrupt e la ripresa del thread avvengono in momenti distinti.",
  "5.1": "Il kernel può sospendere un processo e assegnare il core a un altro. Il contesto salvato permette al primo di riprendere con i propri registri e il proprio PC.",
  "5.2": "fork crea un processo figlio, exec sostituisce il programma in esecuzione e waitpid raccoglie lo stato del figlio terminato. Ogni operazione agisce su risorse diverse.",
  "5.3": "La politica di scheduling assegna il core ai processi pronti. Il tempo della prima risposta, l’attesa totale e i cicli impiegati nei cambi misurano effetti diversi della scelta.",
  "5.4": "I thread di uno stesso processo hanno registri e stack distinti e condividono lo spazio di indirizzamento. Il numero di core determina quanti possono eseguire contemporaneamente.",
  "5.5": "Due aggiornamenti della stessa cella possono interferire fra lettura e scrittura. I confini della sezione protetta determinano quali intercalazioni restano possibili.",
  "5.6": "Uno slot del buffer può essere libero, riservato o occupato da un dato pubblicato. Le operazioni di prenotazione e pubblicazione trasferiscono il relativo permesso.",
  "5.7": "Un grafo descrive i legami fra processi e risorse. Con più istanze occorre anche conoscere le disponibilità per stabilire se un processo può completare.",
  "6.1": "Il tempo di accesso dipende dal livello della gerarchia che fornisce il dato. Ogni richiesta paga la consultazione della cache, mentre i miss aggiungono il rifornimento.",
  "6.2": "Lo spazio virtuale del processo è diviso in pagine. La residenza, i permessi e la disponibilità di frame determinano se un accesso si conclude o richiede il gestore di fault.",
  "6.3": "Il programma divide un indirizzo virtuale in pagina e offset, controlla i limiti della tabella e legge una voce. L’indice, l’indirizzo della voce e il frame contenuto nella voce sono tre grandezze distinte.",
  "6.4": "Una traduzione può richiedere più letture di tabella. La TLB conserva traduzioni già risolte e usa anche l’identità dello spazio di indirizzamento per riconoscerle.",
  "6.5": "Le directory associano nomi a inode. Per leggere un byte, il file system traduce poi l’offset nel file in un blocco fisico e in una posizione al suo interno.",
  "6.6": "Un arresto può lasciare su disco solo una parte degli aggiornamenti. La posizione del commit durevole determina quali transazioni il recupero può riprodurre.",
  "6.7": "Una richiesta di accesso identifica un soggetto, un oggetto e un’operazione. Permessi, cifratura e registri degli eventi rispondono a domande diverse sulla protezione dei dati."
};

SL.casiSvolti = {
  "1.1.7": {
    "titolo": "Il viaggio di un byte in una pipeline",
    "domanda": "Quante pipe collegano tre processi?",
    "risposta": "2",
    "passi": [
      {
        "titolo": "Preparare i collegamenti",
        "testo": "La shell collega l’uscita del primo processo all’ingresso del secondo e l’uscita del secondo all’ingresso del terzo. Ogni collegamento richiede una pipe.",
        "valori": [
          [
            "Processo 1",
            "A"
          ],
          [
            "Pipe 1",
            "vuota"
          ],
          [
            "Processo 2",
            "in attesa"
          ],
          [
            "Pipe 2",
            "vuota"
          ]
        ]
      },
      {
        "titolo": "Prima lettura",
        "testo": "La scrittura del primo comando porta A nella prima pipe. Il secondo comando legge quel byte.",
        "valori": [
          [
            "Processo 1",
            "scritto"
          ],
          [
            "Pipe 1",
            "letta"
          ],
          [
            "Processo 2",
            "A"
          ],
          [
            "Pipe 2",
            "vuota"
          ]
        ]
      },
      {
        "titolo": "Seconda lettura",
        "testo": "Il secondo comando copia A nella seconda pipe. Il terzo processo lo riceve sullo standard input.",
        "valori": [
          [
            "Processo 2",
            "scritto"
          ],
          [
            "Pipe 2",
            "letta"
          ],
          [
            "Processo 3",
            "A"
          ],
          [
            "Pipe usate",
            "2"
          ]
        ]
      }
    ],
    "dati": "Una shell avvia tre processi collegati da una pipeline. Il primo emette il byte ASCII A, il secondo copia i byte che riceve e il terzo li legge sullo standard input."
  },
  "1.2.5": {
    "titolo": "Da 0xAD a otto bit",
    "domanda": "Quali otto bit contiene il byte, partendo da quello più significativo?",
    "risposta": "10101101",
    "passi": [
      {
        "titolo": "Separare le cifre",
        "testo": "Un byte contiene due cifre esadecimali. Ciascuna occupa quattro bit.",
        "valori": [
          [
            "Byte",
            "0xAD"
          ],
          [
            "Alto",
            "A"
          ],
          [
            "Basso",
            "D"
          ]
        ]
      },
      {
        "titolo": "Assegnare i pesi",
        "testo": "In ciascun gruppo i pesi sono 8, 4, 2 e 1. La cifra A vale 10 e attiva i pesi 8 e 2. La cifra D vale 13 e attiva i pesi 8, 4 e 1.",
        "valori": [
          [
            "A",
            "1010"
          ],
          [
            "D",
            "1101"
          ]
        ]
      },
      {
        "titolo": "Ricomporre",
        "testo": "Il gruppo più significativo precede quello meno significativo. Rileggi i due gruppi per verificare A e D.",
        "valori": [
          [
            "Alto",
            "1010"
          ],
          [
            "Basso",
            "1101"
          ],
          [
            "Parola",
            "10101101"
          ]
        ]
      }
    ],
    "dati": "Il byte da convertire è 0xAD. La risposta deve contenere otto cifre binarie, ordinate dal bit di indice 7 (peso 128) al bit di indice 0 (peso 1).",
    "formato": "bits"
  },
  "1.3.6": {
    "titolo": "UTF-8 e terminatore",
    "domanda": "Quanti byte occorrono per conservare «è» come stringa C in UTF-8?",
    "risposta": "3",
    "passi": [
      {
        "titolo": "Il carattere",
        "testo": "La lettera è ha punto di codice U+00E8. In UTF-8 richiede due byte.",
        "valori": [
          [
            "Carattere",
            "è"
          ],
          [
            "Codice",
            "U+00E8"
          ]
        ]
      },
      {
        "titolo": "I byte del testo",
        "testo": "Il primo byte è C3, il secondo A8. Entrambi fanno parte del testo.",
        "valori": [
          [
            "Offset 0",
            "C3"
          ],
          [
            "Offset 1",
            "A8"
          ]
        ]
      },
      {
        "titolo": "Terminare la stringa",
        "testo": "Il terzo byte vale zero. strlen misura i due byte che lo precedono, mentre il buffer contiene tre byte.",
        "valori": [
          [
            "[0]",
            "C3"
          ],
          [
            "[1]",
            "A8"
          ],
          [
            "[2]",
            "00"
          ],
          [
            "Capacità",
            "3 byte"
          ]
        ]
      }
    ],
    "dati": "Un array di char deve contenere la sola lettera «è», codificata in UTF-8, e il terminatore della stringa C."
  },
  "1.4.5": {
    "titolo": "Estendere un intero negativo",
    "domanda": "Quale parola a 16 bit rappresenta lo stesso valore?",
    "risposta": "0xFFF8",
    "passi": [
      {
        "titolo": "Leggere il segno",
        "testo": "Il byte 0xF8 contiene un uno nel bit di segno. La lettura senza segno dà 248. In complemento a due su otto bit il valore è 248 − 256 = −8.",
        "valori": [
          [
            "Byte",
            "0xF8"
          ],
          [
            "Bit 7",
            "1"
          ]
        ]
      },
      {
        "titolo": "Estendere",
        "testo": "Copiando il segno nelle otto posizioni aggiunte si ottiene FF nel byte alto.",
        "valori": [
          [
            "Byte alto",
            "FF"
          ],
          [
            "Byte basso",
            "F8"
          ]
        ]
      },
      {
        "titolo": "Verificare il valore",
        "testo": "La nuova parola senza segno vale 65528. Sottrarre 65536 restituisce ancora −8.",
        "valori": [
          [
            "Parola",
            "0xFFF8"
          ],
          [
            "Con segno",
            "−8"
          ]
        ]
      }
    ],
    "dati": "La parola iniziale è 0xF8 su otto bit. Il registro di destinazione è largo sedici bit e usa il complemento a due."
  },
  "1.5.7": {
    "titolo": "Sostituire i quattro bit bassi",
    "domanda": "Qual è il byte finale?",
    "risposta": "0xA3",
    "passi": [
      {
        "titolo": "Separare",
        "testo": "Il byte iniziale A5 contiene A nel semibyte alto e 5 in quello basso.",
        "valori": [
          [
            "Ingresso",
            "0xA5"
          ],
          [
            "Nuovo campo",
            "3"
          ]
        ]
      },
      {
        "titolo": "Azzerare il campo",
        "testo": "AND con F0 conserva A e porta a zero le quattro posizioni da sostituire.",
        "valori": [
          [
            "Maschera",
            "0xF0"
          ],
          [
            "Intermedio",
            "0xA0"
          ]
        ]
      },
      {
        "titolo": "Inserire",
        "testo": "OR con 03 pone la nuova cifra nelle quattro posizioni libere.",
        "valori": [
          [
            "Intermedio",
            "0xA0"
          ],
          [
            "Campo",
            "0x03"
          ],
          [
            "Risultato",
            "0xA3"
          ]
        ]
      }
    ],
    "dati": "Il byte iniziale è 0xA5. Il nuovo valore da scrivere nelle posizioni 3…0 è 3. Le posizioni 7…4 devono conservare il valore iniziale."
  },
  "1.6.5": {
    "titolo": "La classe speciale di binary32",
    "domanda": "Con E = 255 e frazione diversa da zero, quale classe si ottiene?",
    "risposta": "NaN",
    "passi": [
      {
        "titolo": "Separare i campi",
        "testo": "Entrambe le parole hanno segno zero ed esponente codificato 255. Occorre leggere la frazione.",
        "valori": [
          [
            "Segno",
            "0"
          ],
          [
            "Esponente",
            "255"
          ]
        ]
      },
      {
        "titolo": "Frazione nulla",
        "testo": "Per la prima parola la frazione è zero. La convenzione IEEE 754 assegna l’infinito positivo.",
        "valori": [
          [
            "Frazione",
            "0"
          ],
          [
            "Classe",
            "+∞"
          ]
        ]
      },
      {
        "titolo": "Frazione diversa da zero",
        "testo": "Nella seconda parola un bit della frazione è attivo. La classe è NaN.",
        "valori": [
          [
            "Esponente",
            "255"
          ],
          [
            "Frazione",
            "1"
          ],
          [
            "Classe",
            "NaN"
          ]
        ]
      }
    ],
    "dati": "Due parole binary32 hanno segno 0 ed esponente codificato 255. Nella prima il campo frazione vale 0, nella seconda vale 1."
  },
  "2.1.5": {
    "titolo": "Scrivere in AX",
    "domanda": "Quale valore resta in RAX?",
    "risposta": "0x112233445566ABCD",
    "passi": [
      {
        "titolo": "Registro iniziale",
        "testo": "Scomponi RAX in una parte alta di 48 bit e una parte bassa di 16 bit.",
        "valori": [
          [
            "Alto",
            "112233445566"
          ],
          [
            "AX",
            "7788"
          ]
        ]
      },
      {
        "titolo": "Scrittura a 16 bit",
        "testo": "L’istruzione scrive ABCD in AX. I sei byte superiori conservano il proprio valore.",
        "valori": [
          [
            "Alto",
            "112233445566"
          ],
          [
            "AX",
            "ABCD"
          ]
        ]
      },
      {
        "titolo": "Rileggere RAX",
        "testo": "I sei byte superiori conservano 0x112233445566. I due inferiori contengono ora 0xABCD. Letti insieme danno 0x112233445566ABCD.",
        "valori": [
          [
            "RAX",
            "0x112233445566ABCD"
          ]
        ]
      }
    ],
    "dati": "RAX contiene 0x1122334455667788. Un’istruzione MOV scrive 0xABCD nel suo sottoregistro AX."
  },
  "2.2.8": {
    "titolo": "Due LEA per ottenere 7a",
    "domanda": "Con a = 5, quanto vale il secondo risultato?",
    "risposta": "35",
    "passi": [
      {
        "titolo": "Preparare la base",
        "testo": "Il registro della base contiene a = 5. LEA forma combinazioni di registri senza leggere la memoria.",
        "valori": [
          [
            "a",
            "5"
          ],
          [
            "Scala",
            "2"
          ]
        ]
      },
      {
        "titolo": "Prima LEA",
        "testo": "La base più due volte la base dà 3a = 5 + 10.",
        "valori": [
          [
            "Base",
            "5"
          ],
          [
            "Indice × 2",
            "10"
          ],
          [
            "Intermedio",
            "15"
          ]
        ]
      },
      {
        "titolo": "Seconda LEA",
        "testo": "Si usa a come base e 3a come indice con scala due. Il risultato è 5 + 30.",
        "valori": [
          [
            "Base",
            "5"
          ],
          [
            "Indice × 2",
            "30"
          ],
          [
            "Risultato",
            "35"
          ]
        ]
      }
    ],
    "dati": "Un registro contiene a = 5. La prima LEA calcola a + 2a. La seconda usa ancora a come base e il risultato della prima come indice con scala 2."
  },
  "2.3.7": {
    "titolo": "L’indirizzo dell’elemento 7",
    "domanda": "Qual è l’indirizzo del primo byte dell’elemento?",
    "risposta": "0x201C",
    "passi": [
      {
        "titolo": "Base dell’array",
        "testo": "Gli elementi sono numerati da zero e ciascuno occupa quattro byte.",
        "valori": [
          [
            "Base",
            "0x2000"
          ],
          [
            "Indice",
            "7"
          ],
          [
            "Passo",
            "4 B"
          ]
        ]
      },
      {
        "titolo": "Offset",
        "testo": "Per raggiungere l’elemento di indice 7 si oltrepassano sette interi. Lo spostamento misura 7 × 4 = 28 byte, cioè 0x1C.",
        "valori": [
          [
            "Indice",
            "7"
          ],
          [
            "Offset",
            "28 B"
          ]
        ]
      },
      {
        "titolo": "Indirizzo",
        "testo": "Si somma lo spostamento alla base. I quattro byte dell’elemento vanno da 0x201C a 0x201F.",
        "valori": [
          [
            "Primo byte",
            "0x201C"
          ],
          [
            "Ultimo byte",
            "0x201F"
          ]
        ]
      }
    ],
    "dati": "Un array di interi di quattro byte inizia a 0x2000. Gli indici partono da zero e l’elemento richiesto è quello di indice 7."
  },
  "2.4.6": {
    "titolo": "Estrarre il semibyte alto",
    "domanda": "Quale valore si ottiene dopo lo scorrimento?",
    "risposta": "0x0A",
    "passi": [
      {
        "titolo": "Delimitare il campo",
        "testo": "Nel byte 0xAB, cioè 10101011 in binario, i quattro bit di peso maggiore formano il campo richiesto.",
        "valori": [
          [
            "Parola",
            "10101011"
          ],
          [
            "Campo",
            "bit 7–4"
          ]
        ]
      },
      {
        "titolo": "Mascherare",
        "testo": "La maschera F0 lascia attivi solo i bit del campo.",
        "valori": [
          [
            "Maschera",
            "11110000"
          ],
          [
            "AND",
            "10100000"
          ]
        ]
      },
      {
        "titolo": "Scorrere",
        "testo": "Uno scorrimento logico di quattro posizioni a destra riporta il campo al bit zero.",
        "valori": [
          [
            "Prima",
            "0xA0"
          ],
          [
            "Shift",
            "4"
          ],
          [
            "Dopo",
            "0x0A"
          ]
        ]
      }
    ],
    "dati": "Il byte iniziale è 0xAB. Il campo occupa le posizioni da 7 a 4 e va riportato nelle quattro posizioni di peso minore."
  },
  "2.5.7": {
    "titolo": "Riprendere una write breve",
    "domanda": "Quanti byte deve richiedere la seconda write?",
    "risposta": "3",
    "passi": [
      {
        "titolo": "Prima richiesta",
        "testo": "Il buffer contiene ABCDE all’indirizzo p. La prima write richiede cinque byte.",
        "valori": [
          [
            "Buffer",
            "ABCDE"
          ],
          [
            "Base",
            "p"
          ],
          [
            "Conteggio",
            "5"
          ]
        ]
      },
      {
        "titolo": "Risultato parziale",
        "testo": "Il kernel accetta due byte. Il prefisso già consegnato è AB.",
        "valori": [
          [
            "Consegnati",
            "AB"
          ],
          [
            "Rimanenti",
            "CDE"
          ]
        ]
      },
      {
        "titolo": "Preparare il seguito",
        "testo": "La richiesta successiva parte da p + 2 e comprende cinque meno due byte.",
        "valori": [
          [
            "Base",
            "p + 2"
          ],
          [
            "Conteggio",
            "3"
          ]
        ]
      }
    ],
    "dati": "Una write richiede cinque byte a partire da p, dove il buffer contiene ABCDE. Il kernel ne accetta due."
  },
  "2.6.7": {
    "titolo": "R12 attraverso una chiamata",
    "domanda": "Quale valore deve poter leggere il chiamante in R12 dopo il ritorno?",
    "risposta": "42",
    "passi": [
      {
        "titolo": "Ingresso",
        "testo": "Il chiamante mette 42 in R12. La funzione decide di usare lo stesso registro come temporaneo.",
        "valori": [
          [
            "R12",
            "42"
          ],
          [
            "Copia",
            "—"
          ]
        ]
      },
      {
        "titolo": "Salvare e lavorare",
        "testo": "Prima dell’uso il chiamato salva 42. Durante il calcolo può scrivere 7 in R12.",
        "valori": [
          [
            "Copia salvata",
            "42"
          ],
          [
            "R12",
            "7"
          ]
        ]
      },
      {
        "titolo": "Ripristinare",
        "testo": "La convenzione System V AMD64 richiede che R12 torni al valore d’ingresso prima di RET.",
        "valori": [
          [
            "R12",
            "42"
          ],
          [
            "Al chiamante",
            "42"
          ]
        ]
      }
    ],
    "dati": "Il chiamante conserva il valore 42 in R12. Il chiamato, secondo la convenzione System V AMD64, usa temporaneamente R12 per il valore 7."
  },
  "2.7.8": {
    "titolo": "Una push di otto byte",
    "domanda": "A quale indirizzo si trova il byte 0x55 dopo la push?",
    "risposta": "0x0FF8",
    "passi": [
      {
        "titolo": "Prima della push",
        "testo": "RSP vale 0x1000 e RAX contiene il valore a 64 bit 0x55.",
        "valori": [
          [
            "RSP",
            "0x1000"
          ],
          [
            "RAX",
            "0x55"
          ]
        ]
      },
      {
        "titolo": "Riservare lo spazio",
        "testo": "La pila cresce verso indirizzi inferiori. La push riserva otto byte, quindi RSP passa da 0x1000 a 0x0FF8.",
        "valori": [
          [
            "Vecchio RSP",
            "0x1000"
          ],
          [
            "Nuovo RSP",
            "0x0FF8"
          ]
        ]
      },
      {
        "titolo": "Scrivere la parola",
        "testo": "Il formato little-endian colloca 55 al primo indirizzo. I sette byte successivi valgono zero.",
        "valori": [
          [
            "[0x0FF8]",
            "55"
          ],
          [
            "[0x0FF9…FFF]",
            "00 × 7"
          ]
        ]
      }
    ],
    "dati": "Prima di PUSH RAX, RSP vale 0x1000 e RAX vale 0x55. La pila x86-64 ospita parole da otto byte."
  },
  "3.1.7": {
    "titolo": "Quattro colonne di somma",
    "domanda": "Quali quattro bit rimangono nel registro?",
    "risposta": "0100",
    "passi": [
      {
        "titolo": "Ingressi",
        "testo": "A = 1001, B = 1011 e il riporto iniziale vale zero.",
        "valori": [
          [
            "A",
            "1001"
          ],
          [
            "B",
            "1011"
          ],
          [
            "C0",
            "0"
          ]
        ]
      },
      {
        "titolo": "Colonne 0 e 1",
        "testo": "La colonna 0 calcola 1+1+0 e la colonna 1 calcola 0+1+1. Entrambe scrivono zero e propagano uno.",
        "valori": [
          [
            "S0",
            "0"
          ],
          [
            "C1",
            "1"
          ],
          [
            "S1",
            "0"
          ],
          [
            "C2",
            "1"
          ]
        ]
      },
      {
        "titolo": "Colonne 2 e 3",
        "testo": "La colonna 2 calcola 0 + 0 + 1 e produce somma 1 e riporto 0. La colonna 3 calcola 1 + 1 + 0 e produce somma 0 e riporto 1.",
        "valori": [
          [
            "S2",
            "1"
          ],
          [
            "C3",
            "0"
          ],
          [
            "S3",
            "0"
          ],
          [
            "C4",
            "1"
          ]
        ]
      },
      {
        "titolo": "Rilettura",
        "testo": "Il totale completo è 10100, pari a 20. Nel registro a quattro bit rimangono 0100.",
        "valori": [
          [
            "Riporto",
            "1"
          ],
          [
            "Registro",
            "0100"
          ]
        ]
      }
    ],
    "dati": "Somma 1001 e 1011 come interi senza segno. Il registro ha quattro bit e il riporto in ingresso alla colonna 0 vale zero.",
    "formato": "bits"
  },
  "3.2.6": {
    "titolo": "La memoria del latch D",
    "domanda": "Qual è Q alla fine del quarto intervallo?",
    "risposta": "0",
    "passi": [
      {
        "titolo": "Intervallo 1",
        "testo": "Q parte da zero. EN = 0 mantiene Q anche con D = 1.",
        "valori": [
          [
            "EN",
            "0"
          ],
          [
            "D",
            "1"
          ],
          [
            "Q",
            "0"
          ]
        ]
      },
      {
        "titolo": "Intervallo 2",
        "testo": "Con EN alto il latch è trasparente e Q segue D.",
        "valori": [
          [
            "EN",
            "1"
          ],
          [
            "D",
            "1"
          ],
          [
            "Q",
            "1"
          ]
        ]
      },
      {
        "titolo": "Intervallo 3",
        "testo": "EN torna basso. D scende a zero e Q conserva il valore precedente.",
        "valori": [
          [
            "EN",
            "0"
          ],
          [
            "D",
            "0"
          ],
          [
            "Q",
            "1"
          ]
        ]
      },
      {
        "titolo": "Intervallo 4",
        "testo": "Con EN alto e D basso l’uscita diventa zero dopo la propagazione.",
        "valori": [
          [
            "EN",
            "1"
          ],
          [
            "D",
            "0"
          ],
          [
            "Q",
            "0"
          ]
        ]
      }
    ],
    "dati": "Il latch D parte da Q = 0. Le coppie (EN,D) si stabilizzano nell’ordine (0,1), (1,1), (0,0), (1,0)."
  },
  "3.3.7": {
    "titolo": "Decodificare il byte Y86-64",
    "domanda": "Quale operazione identifica 0x63?",
    "risposta": "xorq",
    "passi": [
      {
        "titolo": "Separare",
        "testo": "Nel byte 0x63 i quattro bit alti, 0110, formano icode. I quattro bit bassi, 0011, formano ifun.",
        "valori": [
          [
            "Byte",
            "0x63"
          ],
          [
            "Bit",
            "01100011"
          ]
        ]
      },
      {
        "titolo": "Codice principale",
        "testo": "Il valore 6 identifica la famiglia delle operazioni aritmetiche e logiche su registri.",
        "valori": [
          [
            "icode",
            "6"
          ],
          [
            "Famiglia",
            "OPq"
          ]
        ]
      },
      {
        "titolo": "Funzione",
        "testo": "Con ifun = 3 l’operazione selezionata è XOR. Il byte successivo specifica i registri.",
        "valori": [
          [
            "ifun",
            "3"
          ],
          [
            "Istruzione",
            "xorq"
          ]
        ]
      }
    ],
    "dati": "All’indirizzo di prelievo la memoria contiene 0x63. Il primo byte di un’istruzione Y86-64 contiene i campi icode e ifun."
  },
  "3.4.6": {
    "titolo": "Il percorso di pushq in SEQ",
    "domanda": "Qual è il nuovo valore di %rsp?",
    "risposta": "0x0FF8",
    "passi": [
      {
        "titolo": "Lettura",
        "testo": "Il banco registri fornisce separatamente il puntatore allo stack e il dato da conservare.",
        "valori": [
          [
            "%rsp",
            "0x1000"
          ],
          [
            "Dato",
            "0xAA"
          ]
        ]
      },
      {
        "titolo": "ALU",
        "testo": "L’ALU sottrae la dimensione della parola al vecchio puntatore. Il risultato 0x1000 − 8 = 0x0FF8 è sia l’indirizzo di scrittura sia il nuovo puntatore alla pila.",
        "valori": [
          [
            "Operando",
            "0x1000"
          ],
          [
            "Delta",
            "−8"
          ],
          [
            "valE",
            "0x0FF8"
          ]
        ]
      },
      {
        "titolo": "Scritture",
        "testo": "La memoria riceve 0xAA all’indirizzo calcolato. Al completamento %rsp assume lo stesso indirizzo.",
        "valori": [
          [
            "Indirizzo",
            "0x0FF8"
          ],
          [
            "Dato",
            "0xAA"
          ],
          [
            "%rsp",
            "0x0FF8"
          ]
        ]
      }
    ],
    "dati": "Il processore SEQ esegue pushq. Il registro %rsp contiene 0x1000, mentre il registro sorgente contiene il valore a 64 bit 0xAA."
  },
  "3.5.5": {
    "titolo": "Riempire una pipeline ideale",
    "domanda": "In quale ciclo completa l’istruzione numero 20?",
    "risposta": "24",
    "passi": [
      {
        "titolo": "Prima istruzione",
        "testo": "Una pipeline vuota ha cinque stadi e il primo prelievo avviene al ciclo 1.",
        "valori": [
          [
            "Stadi",
            "5"
          ],
          [
            "Prima entrata",
            "1"
          ]
        ]
      },
      {
        "titolo": "Primo completamento",
        "testo": "La prima istruzione completa nel ciclo 5. Le seguenti sono già distribuite nei vari stadi.",
        "valori": [
          [
            "I1 termina",
            "5"
          ],
          [
            "I2 termina",
            "6"
          ]
        ]
      },
      {
        "titolo": "Ultima istruzione",
        "testo": "Dal completamento della prima istruzione a quello della ventesima trascorrono altri 19 cicli. L’ultima termina quindi al ciclo 5 + 19 = 24.",
        "valori": [
          [
            "Cicli",
            "5 + 19"
          ],
          [
            "I20 termina",
            "24"
          ]
        ]
      }
    ],
    "dati": "La pipeline è inizialmente vuota. Ha cinque stadi da un ciclo, il primo prelievo avviene nel ciclo 1 e le venti istruzioni sono indipendenti."
  },
  "3.6.8": {
    "titolo": "Aggiornamenti simultanei",
    "domanda": "Quale istruzione acquisisce il registro M al fronte successivo?",
    "risposta": "I1",
    "passi": [
      {
        "titolo": "Prima del fronte",
        "testo": "Le istruzioni I1 e I2 sono in volo. Tutti i trasferimenti sono abilitati.",
        "valori": [
          [
            "D",
            "I2"
          ],
          [
            "E",
            "I1"
          ],
          [
            "M",
            "bolla"
          ]
        ]
      },
      {
        "titolo": "Ingressi preparati",
        "testo": "Il valore per il prossimo M proviene dal vecchio E. Il valore per il prossimo E proviene dal vecchio D.",
        "valori": [
          [
            "D → E",
            "I2"
          ],
          [
            "E → M",
            "I1"
          ]
        ]
      },
      {
        "titolo": "Dopo il fronte",
        "testo": "Al fronte E acquisisce I2 da D e M acquisisce I1 da E. Entrambi leggono i valori presenti subito prima del fronte.",
        "valori": [
          [
            "Nuovo E",
            "I2"
          ],
          [
            "Nuovo M",
            "I1"
          ]
        ]
      }
    ],
    "dati": "Subito prima del fronte, D contiene I2, E contiene I1 e in M c’è una bolla. Tutti i registri di pipeline acquisiscono il proprio ingresso."
  },
  "4.1.8": {
    "titolo": "Due gate e il flag IF",
    "domanda": "Con IF iniziale uguale a 1, quanto vale IF nel gestore raggiunto con un interrupt gate?",
    "risposta": "0",
    "passi": [
      {
        "titolo": "Stato iniziale",
        "testo": "Il valore iniziale IF = 1 abilita gli interrupt esterni mascherabili. Si applicano i due tipi di gate separatamente allo stesso stato.",
        "valori": [
          [
            "IF iniziale",
            "1"
          ],
          [
            "Evento",
            "ingresso"
          ]
        ]
      },
      {
        "titolo": "Interrupt gate",
        "testo": "L’ingresso salva lo stato previsto dal modello e azzera IF nel nuovo contesto.",
        "valori": [
          [
            "IF salvato",
            "1"
          ],
          [
            "IF attivo",
            "0"
          ]
        ]
      },
      {
        "titolo": "Trap gate",
        "testo": "Ripartendo dallo stesso stato, il trap gate conserva IF attivo. Il confronto riguarda il valore visibile al gestore.",
        "valori": [
          [
            "Interrupt gate",
            "0"
          ],
          [
            "Trap gate",
            "1"
          ]
        ]
      }
    ],
    "dati": "Prima dell’ingresso nel gestore, il flag IF del processore x86 vale 1. Si esamina lo stesso ingresso prima attraverso un interrupt gate e poi attraverso un trap gate."
  },
  "4.2.6": {
    "titolo": "Errore grezzo e wrapper libc",
    "domanda": "Per EBADF quale valore restituisce il wrapper convenzionale?",
    "risposta": "−1",
    "passi": [
      {
        "titolo": "Richiesta",
        "testo": "Il processo usa un descrittore chiuso. Il kernel individua la condizione EBADF.",
        "valori": [
          [
            "Descrittore",
            "chiuso"
          ],
          [
            "Errore",
            "EBADF"
          ]
        ]
      },
      {
        "titolo": "Ritorno grezzo",
        "testo": "Nell’ABI delle syscall Linux il registro di ritorno contiene il valore negativo del codice di errore.",
        "valori": [
          [
            "Codice",
            "9"
          ],
          [
            "Ritorno",
            "−9"
          ]
        ]
      },
      {
        "titolo": "Interfaccia C",
        "testo": "Il wrapper riconosce il codice negativo, imposta errno a EBADF e restituisce −1.",
        "valori": [
          [
            "errno",
            "EBADF"
          ],
          [
            "Ritorno C",
            "−1"
          ]
        ]
      }
    ],
    "dati": "Una richiesta Linux usa un descrittore chiuso. In questo caso EBADF ha codice 9. Si osservano separatamente il ritorno della syscall e quello del wrapper della libreria C."
  },
  "4.3.5": {
    "titolo": "Contare le interrogazioni",
    "domanda": "Quale interrogazione osserva READY per la prima volta?",
    "risposta": "200",
    "passi": [
      {
        "titolo": "Inizio",
        "testo": "Il primo controllo cade a 10 µs. Servono 2000 µs per raggiungere il tempo di completamento, pari a 2 ms.",
        "valori": [
          [
            "Passo",
            "10 μs"
          ],
          [
            "READY a",
            "2000 μs"
          ]
        ]
      },
      {
        "titolo": "Prima di READY",
        "testo": "Il controllo numero 199 cade a 1990 μs. Il controller risulta ancora occupato.",
        "valori": [
          [
            "Controllo",
            "199"
          ],
          [
            "Tempo",
            "1990 μs"
          ],
          [
            "READY",
            "0"
          ]
        ]
      },
      {
        "titolo": "Osservazione",
        "testo": "Al controllo numero 200 il tempo raggiunge 2000 μs e READY è attivo.",
        "valori": [
          [
            "Controllo",
            "200"
          ],
          [
            "Tempo",
            "2 ms"
          ],
          [
            "READY",
            "1"
          ]
        ]
      }
    ],
    "dati": "Il dispositivo alza READY al tempo 2 ms. Il driver controlla lo stato ogni 10 µs. La prima lettura avviene a 10 µs e quella a 2 ms osserva READY già attivo."
  },
  "4.4.6": {
    "titolo": "Banda lorda e payload",
    "domanda": "Con payload all’80%, quanti MB/s decimali sono utili?",
    "risposta": "800",
    "passi": [
      {
        "titolo": "Ampiezza",
        "testo": "Il bus trasporta 32 bit, cioè quattro byte, per trasferimento.",
        "valori": [
          [
            "Larghezza",
            "32 bit"
          ],
          [
            "Byte",
            "4"
          ]
        ]
      },
      {
        "titolo": "Banda lorda",
        "testo": "Quattro byte per 250 milioni di trasferimenti al secondo danno un miliardo di byte al secondo.",
        "valori": [
          [
            "Tasso",
            "250 MT/s"
          ],
          [
            "Lordo",
            "1000 MB/s"
          ]
        ]
      },
      {
        "titolo": "Banda utile",
        "testo": "La quota di payload è 0,8. La banda utile vale 1000 MB/s × 0,8 = 800 MB/s.",
        "valori": [
          [
            "Payload",
            "80%"
          ],
          [
            "Utile",
            "800 MB/s"
          ]
        ]
      }
    ],
    "dati": "Il bus è largo 32 bit. Esegue 250 milioni di trasferimenti al secondo e l’80% dei byte trasportati è payload. Un MB equivale a un milione di byte."
  },
  "4.5.4": {
    "titolo": "Blocchi interi per un file",
    "domanda": "Quanti byte assegnati restano inutilizzati?",
    "risposta": "2288",
    "passi": [
      {
        "titolo": "Dati iniziali",
        "testo": "Il file contiene 10.000 byte e l’unità minima di allocazione è un blocco da 4096 byte.",
        "valori": [
          [
            "File",
            "10000 B"
          ],
          [
            "Blocco",
            "4096 B"
          ]
        ]
      },
      {
        "titolo": "Blocchi necessari",
        "testo": "Due blocchi contengono 8192 byte. I rimanenti 1808 byte richiedono un terzo blocco.",
        "valori": [
          [
            "Blocchi pieni",
            "2"
          ],
          [
            "Ultimo usato",
            "1808 B"
          ]
        ]
      },
      {
        "titolo": "Spazio residuo",
        "testo": "Tre blocchi riservano 3 × 4096 = 12 288 byte. Nel blocco finale restano inutilizzati 12 288 − 10 000 = 2288 byte.",
        "valori": [
          [
            "Assegnati",
            "12288 B"
          ],
          [
            "Residuo",
            "2288 B"
          ]
        ]
      }
    ],
    "dati": "Il file occupa 10 000 byte. Il volume assegna blocchi interi da 4096 byte. Si considera soltanto lo spazio riservato ai dati del file."
  },
  "4.6.5": {
    "titolo": "Funzionamento e riparazione",
    "domanda": "Qual è la disponibilità percentuale del dispositivo? Arrotonda a due cifre decimali.",
    "risposta": "99,80",
    "passi": [
      {
        "titolo": "Intervallo operativo",
        "testo": "Si assume un modello di rinnovo con 1000 ore medie di funzionamento e ripristino completo dopo il guasto.",
        "valori": [
          [
            "Servizio",
            "1000 h"
          ]
        ]
      },
      {
        "titolo": "Intervallo di riparazione",
        "testo": "La riparazione richiede in media due ore. Il ciclo medio comprende entrambi gli intervalli.",
        "valori": [
          [
            "Servizio",
            "1000 h"
          ],
          [
            "Riparazione",
            "2 h"
          ],
          [
            "Ciclo",
            "1002 h"
          ]
        ]
      },
      {
        "titolo": "Disponibilità",
        "testo": "La disponibilità di lungo periodo è il rapporto fra tempo medio di servizio e durata media del ciclo. In percentuale vale (1000 / 1002) × 100 ≈ 99,80%.",
        "valori": [
          [
            "Numeratore",
            "1000 h"
          ],
          [
            "Denominatore",
            "1002 h"
          ],
          [
            "Disponibilità",
            "99,80%"
          ]
        ]
      }
    ],
    "dati": "Il dispositivo funziona in media per 1000 ore tra un ripristino e il guasto successivo. Una riparazione completa richiede in media 2 ore. Conta come disponibile il tempo trascorso in servizio."
  },
  "4.7.6": {
    "titolo": "Tempo dati e lavoro della CPU",
    "domanda": "Quanti millisecondi dura il solo trasferimento?",
    "risposta": "20",
    "passi": [
      {
        "titolo": "Preparazione",
        "testo": "Il driver prepara il descrittore. Il suo costo in cicli CPU è separato dal tempo impiegato dal dispositivo.",
        "valori": [
          [
            "Quantità",
            "8 MiB"
          ],
          [
            "Velocità",
            "400 MiB/s"
          ]
        ]
      },
      {
        "titolo": "Trasferimento",
        "testo": "La durata è il rapporto tra quantità e velocità: 8 / 400 = 0,02 secondi.",
        "valori": [
          [
            "Durata",
            "0,02 s"
          ],
          [
            "Durata in ms",
            "20"
          ]
        ]
      },
      {
        "titolo": "Completamento",
        "testo": "Il dispositivo trasferisce dati per 20 ms. Per calcolare separatamente il lavoro della CPU occorrono i cicli di preparazione e quelli del gestore di completamento.",
        "valori": [
          [
            "Dati",
            "20 ms"
          ],
          [
            "CPU",
            "prepara + serve"
          ]
        ]
      }
    ],
    "dati": "Il controller deve trasferire 8 MiB. La fase dati procede a 400 MiB/s. I tempi di preparazione e di servizio dell’interrupt si contabilizzano separatamente."
  },
  "5.1.5": {
    "titolo": "Salvare prima di ripristinare",
    "domanda": "Da quale indirizzo riprende A quando il kernel ne ripristina il contesto?",
    "risposta": "0x40",
    "passi": [
      {
        "titolo": "Core assegnato ad A",
        "testo": "Al momento della sospensione il contatore di programma di A vale 0x40. Il contesto di B contiene già il proprio indirizzo di ripresa, 0x90.",
        "valori": [
          [
            "Core",
            "A"
          ],
          [
            "PC",
            "0x40"
          ]
        ]
      },
      {
        "titolo": "Cambio A → B",
        "testo": "Il kernel salva prima i registri di A nella sua scheda. Solo dopo carica il contesto di B.",
        "valori": [
          [
            "Scheda A",
            "0x40"
          ],
          [
            "Core",
            "B"
          ],
          [
            "PC",
            "0x90"
          ]
        ]
      },
      {
        "titolo": "Riprendere A",
        "testo": "Al cambio successivo si carica la copia di A. Il PC del core corrisponde all’indirizzo salvato.",
        "valori": [
          [
            "Core",
            "A"
          ],
          [
            "PC",
            "0x40"
          ]
        ]
      }
    ],
    "dati": "A occupa il core e il suo contatore di programma (PC) vale 0x40. Il contesto salvato di B contiene 0x90. Il kernel passa da A a B e poi riprende A."
  },
  "5.2.6": {
    "titolo": "Un offset dopo fork",
    "domanda": "Dopo letture riuscite di 2 e 3 byte da offset zero, quale offset è memorizzato?",
    "risposta": "5",
    "passi": [
      {
        "titolo": "Dopo fork",
        "testo": "Padre e figlio hanno due tabelle dei descrittori. Dopo fork, i descrittori del file in esame rimandano a una sola descrizione aperta e quindi allo stesso offset.",
        "valori": [
          [
            "Padre",
            "fd 3"
          ],
          [
            "Figlio",
            "fd 3"
          ],
          [
            "Offset",
            "0"
          ]
        ]
      },
      {
        "titolo": "Lettura del padre",
        "testo": "Il padre riceve due byte. Il cursore della descrizione condivisa avanza da zero a due.",
        "valori": [
          [
            "Letti",
            "2"
          ],
          [
            "Offset",
            "2"
          ]
        ]
      },
      {
        "titolo": "Lettura del figlio",
        "testo": "Il figlio parte dall’offset 2. La lettura di tre byte porta l’offset condiviso a 5.",
        "valori": [
          [
            "Partenza",
            "2"
          ],
          [
            "Letti",
            "3"
          ],
          [
            "Offset",
            "5"
          ]
        ]
      }
    ],
    "dati": "Dopo fork, padre e figlio leggono attraverso due descrittori che condividono lo stesso offset, inizialmente zero. La prima lettura restituisce 2 byte e la seconda 3."
  },
  "5.3.6": {
    "titolo": "Arrivi e servizio su un core",
    "domanda": "A quale istante, in ms, termina B con la politica FCFS?",
    "risposta": "6",
    "passi": [
      {
        "titolo": "Arrivi",
        "testo": "A arriva a 0 con burst di 4 ms. B arriva a 1 con burst di 2 ms. Si assume costo di cambio nullo.",
        "valori": [
          [
            "A",
            "0 ms"
          ],
          [
            "B",
            "1 ms"
          ]
        ]
      },
      {
        "titolo": "Servizio di A",
        "testo": "FCFS lascia il core ad A fino a 4 ms. B attende da 1 a 4 ms.",
        "valori": [
          [
            "A",
            "0–4 ms"
          ],
          [
            "Attesa B",
            "3 ms"
          ]
        ]
      },
      {
        "titolo": "Servizio di B",
        "testo": "B riceve il core a 4 e lavora per due millisecondi. I servizi totali coincidono con i burst assegnati.",
        "valori": [
          [
            "B",
            "4–6 ms"
          ],
          [
            "Fine B",
            "6 ms"
          ]
        ]
      }
    ],
    "dati": "Sul singolo core A arriva a 0 ms con 4 ms di lavoro. B arriva a 1 ms con 2 ms di lavoro. La politica FCFS serve in ordine di arrivo e il cambio di contesto ha costo nullo."
  },
  "5.4.6": {
    "titolo": "Un indirizzo per worker",
    "domanda": "Se ids vale [10,20,30], quale valore legge il worker che riceve &ids[1]?",
    "risposta": "20",
    "passi": [
      {
        "titolo": "Preparare gli oggetti",
        "testo": "Il chiamante alloca tre celle distinte e le inizializza prima della creazione dei rispettivi worker.",
        "valori": [
          [
            "ids[0]",
            "10"
          ],
          [
            "ids[1]",
            "20"
          ],
          [
            "ids[2]",
            "30"
          ]
        ]
      },
      {
        "titolo": "Passare il puntatore",
        "testo": "A W1 arriva l’indirizzo della seconda cella. Ogni worker riceve un indirizzo distinto e l’array rimane vivo.",
        "valori": [
          [
            "W0",
            "&ids[0]"
          ],
          [
            "W1",
            "&ids[1]"
          ],
          [
            "W2",
            "&ids[2]"
          ]
        ]
      },
      {
        "titolo": "Attendere",
        "testo": "W1 dereferenzia &ids[1] e legge 20. I join completano prima che il chiamante esca dal blocco in cui è allocato l’array.",
        "valori": [
          [
            "W1 legge",
            "20"
          ],
          [
            "Durata",
            "fino ai join"
          ]
        ]
      }
    ],
    "dati": "L’array ids contiene 10, 20 e 30. I tre worker ricevono rispettivamente &ids[0], &ids[1] e &ids[2]. L’array vive fino al termine dei tre join."
  },
  "5.5.8": {
    "titolo": "Due aggiornamenti sotto mutex",
    "domanda": "Partendo da x = 1, quale valore rimane dopo entrambi i worker?",
    "risposta": "7",
    "passi": [
      {
        "titolo": "Acquisizione",
        "testo": "Il primo worker acquisisce il mutex prima della lettura. Il secondo attende.",
        "valori": [
          [
            "Proprietario",
            "W1"
          ],
          [
            "x",
            "1"
          ]
        ]
      },
      {
        "titolo": "Prima scrittura",
        "testo": "W1 calcola 2 × 1 + 1 = 3 e rilascia il mutex dopo la scrittura.",
        "valori": [
          [
            "Letto",
            "1"
          ],
          [
            "Scritto",
            "3"
          ]
        ]
      },
      {
        "titolo": "Seconda scrittura",
        "testo": "W2 acquisisce il mutex, legge 3 e calcola 2 × 3 + 1. La sezione protetta include lettura e scrittura.",
        "valori": [
          [
            "Letto",
            "3"
          ],
          [
            "Scritto",
            "7"
          ]
        ]
      }
    ],
    "dati": "La variabile condivisa x parte da 1. Due worker eseguono una volta ciascuno l’assegnamento x = 2x + 1 proteggendo l’intera operazione con lo stesso mutex."
  },
  "5.6.6": {
    "titolo": "Lo slot in transito",
    "domanda": "In un buffer di tre slot vuoti, quanti sono liberi dopo una prenotazione?",
    "risposta": "2",
    "passi": [
      {
        "titolo": "Buffer iniziale",
        "testo": "Tre slot sono liberi e nessun elemento è pubblicato. Un produttore chiede un posto.",
        "valori": [
          [
            "Liberi",
            "3"
          ],
          [
            "Riservati",
            "0"
          ],
          [
            "Pubblicati",
            "0"
          ]
        ]
      },
      {
        "titolo": "Dopo la prenotazione",
        "testo": "Il produttore acquisisce un permesso. Uno slot è riservato mentre gli altri due sono ancora liberi.",
        "valori": [
          [
            "Liberi",
            "2"
          ],
          [
            "Riservati",
            "1"
          ],
          [
            "Pubblicati",
            "0"
          ]
        ]
      },
      {
        "titolo": "Dopo la pubblicazione",
        "testo": "Il produttore deposita il dato e lo pubblica. La somma di liberi, riservati e pubblicati resta tre.",
        "valori": [
          [
            "Liberi",
            "2"
          ],
          [
            "Riservati",
            "0"
          ],
          [
            "Pubblicati",
            "1"
          ]
        ]
      }
    ],
    "dati": "Un buffer vuoto contiene tre slot. Un produttore prenota un posto e viene sospeso prima di depositare e pubblicare l’elemento."
  },
  "5.7.6": {
    "titolo": "Provare una sequenza sicura",
    "domanda": "Con una sola unità libera, chi può completare per primo fra A e B?",
    "risposta": "A",
    "passi": [
      {
        "titolo": "Risorse e bisogni",
        "testo": "Una risorsa ha tre istanze: A ne possiede una, B una, la terza è libera. A ha bisogno ancora di una istanza, B di due.",
        "valori": [
          [
            "Libere",
            "1"
          ],
          [
            "Bisogno A",
            "1"
          ],
          [
            "Bisogno B",
            "2"
          ]
        ]
      },
      {
        "titolo": "Completare A",
        "testo": "L’unica istanza libera copre il bisogno residuo di A. Nella verifica di sicurezza A può quindi completare. Dopo il rilascio risultano disponibili due istanze.",
        "valori": [
          [
            "Primo",
            "A"
          ],
          [
            "Libere",
            "2"
          ]
        ]
      },
      {
        "titolo": "Completare B",
        "testo": "Le due istanze libere coprono il bisogno residuo di B. Il completamento restituisce tutte e tre le istanze.",
        "valori": [
          [
            "Ordine",
            "A → B"
          ],
          [
            "Libere",
            "3"
          ]
        ]
      }
    ],
    "dati": "Una risorsa ha tre istanze. A e B ne possiedono una ciascuno. A ne richiede ancora una per completare, B ne richiede altre due. La terza è libera."
  }
};
