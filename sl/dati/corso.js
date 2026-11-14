'use strict';
/* Mappa del corso. stato 'nuovo': capitolo riscritto nel nuovo formato;
   stato 'classico': capitolo ancora servito dalla versione precedente del sito (classico.html). */
(() => {
  const classico = (id, breve, titolo, sim) => ({ id, breve, titolo, sim, stato: 'classico' });
  SL.corso = [
    { k: '0', r: '0', breve: 'Introduzione', nome: 'Introduzione', sim: 'esperimento', capitoli: [
      { id: '0.1', breve: 'Struttura di un calcolatore', titolo: 'Struttura di un calcolatore', sim: 'cpu', stato: 'nuovo', diretta: true,
        scopo: 'Le quattro parti di ogni calcolatore e il tragitto di un dato dall’ingresso all’uscita.' },
      { id: '0.2', breve: 'Programmi e dati', titolo: 'Programmi e dati', sim: 'operation', stato: 'nuovo', diretta: true,
        scopo: 'Distinzione fra una sequenza di istruzioni e i valori sui quali esse operano.' },
      { id: '0.3', breve: 'Cifre e posizioni', titolo: 'Cifre e posizioni', sim: 'puntatore', stato: 'nuovo', diretta: true,
        scopo: 'Dipendenza del valore di una cifra dalla posizione occupata.' },
      { id: '0.4', breve: 'Uso del laboratorio', titolo: 'Uso del laboratorio', sim: 'riproduci', stato: 'nuovo', diretta: true,
        scopo: 'Le cinque fasi di ogni unità e i comandi degli esperimenti, presentati su un caso elementare.' }
    ] },
    { k: '1', r: 'I', breve: 'Dati', nome: 'Rappresentazione dei dati', sim: 'bit', capitoli: [
      { id: '1.1', breve: 'Vita di un programma', titolo: 'Il calcolatore e la vita di un programma', sim: 'terminale', stato: 'nuovo', prova: true,
        guida: 'Il capitolo segue un programma di poche righe dal testo sorgente fino alla riga che compare sullo schermo, e introduce i livelli del sistema che vi prendono parte.',
        unita: [
          { id: '1.1.1', titolo: 'Un programma, diversi livelli', sim: 'terminale', scopo: 'Tragitto di una riga di testo dal programma alla destinazione.' },
          { id: '1.1.2', titolo: 'La macchina fisica sotto le astrazioni', sim: 'memory', scopo: 'Individuazione di un dato in memoria mediante un indirizzo.' },
          { id: '1.1.3', titolo: 'Dal sorgente al file eseguibile', sim: 'operation', scopo: 'Le quattro trasformazioni dal testo del programma al file eseguibile.' },
          { id: '1.1.4', titolo: 'Nomi, file e shell', sim: 'folder', scopo: 'Risoluzione di un percorso fino al file indicato.' },
          { id: '1.1.5', titolo: 'Dal file eseguibile al processo', sim: 'process', scopo: 'Dal comando digitato al programma in esecuzione.' },
          { id: '1.1.6', titolo: 'Seguire hello attraverso il sistema', sim: 'file', scopo: 'L’uscita dello stesso programma diretta allo schermo oppure a un file.' }
        ],
        sfide: [['lez01_01_layers_order', 'Livelli di astrazione e percorso dei dati'], ['lez01_02_hardware_roles', 'Componenti hardware e loro funzioni'], ['lez01_03_special_paths', 'Nomi e percorsi nel file system'], ['lez01_04_filesystem_ops', 'Operazioni elementari sui file'], ['lez01_05_build_pipeline', 'Dal sorgente C al programma eseguibile']] },
      { id: '1.2', breve: 'Binario ed esadecimale', titolo: 'Rappresentazione binaria ed esadecimale', sim: 'byte', stato: 'nuovo', prova: true,
        guida: 'Il capitolo introduce la scrittura dei numeri con le sole cifre 0 e 1, la notazione esadecimale che rappresenta otto bit con due simboli e la disposizione in memoria dei numeri di più byte.',
        unita: [
          { id: '1.2.1', titolo: 'Dagli stati fisici ai simboli binari', sim: 'bit', scopo: 'Conversione di una tensione misurata su un filo in uno 0 oppure in un 1.' },
          { id: '1.2.2', titolo: 'Notazione posizionale ed esadecimale', sim: 'hex', scopo: 'Lettura e scrittura di un byte in binario e in esadecimale.' },
          { id: '1.2.3', titolo: 'Memoria a byte e ordine dei byte', sim: 'byte', scopo: 'Distribuzione di un numero di quattro byte su quattro indirizzi consecutivi.' },
          { id: '1.2.4', titolo: 'Leggere i byte e dichiararne il significato', sim: 'char', scopo: 'Interpretazione dei medesimi byte come numero oppure come testo.' }
        ],
        sfide: [['lez02_01_voltage_to_bits', 'Bit, byte e capacità di rappresentazione'], ['lez02_02_dec_to_bin', 'Dal decimale al binario'], ['lez02_03_bin_to_hex', 'Dal binario all’esadecimale'], ['lez02_04_hex_to_dec', 'Dall’esadecimale al decimale'], ['lez02_05_utf8_bytes_and_ascii', 'Byte occupati da ASCII e UTF-8']] },
      { id: '1.3', breve: 'Testo, immagini, suoni', titolo: 'Codificare testo, immagini e suoni', sim: 'char', stato: 'nuovo', prova: true,
        guida: 'Il capitolo mostra come immagini, caratteri di ogni scrittura e suoni siano rappresentati da file di byte, e come un lettore ne verifichi il contenuto prima di interpretarlo.',
        unita: [
          { id: '1.3.1', titolo: 'La codifica come accordo tra significato e byte', sim: 'pixel', scopo: 'Rappresentazione di un’immagine come fila di byte e individuazione di un colore al suo interno.' },
          { id: '1.3.2', titolo: 'Unicode, punti di codice e UTF-8', sim: 'char', scopo: 'Lettere accentate su due byte e ricostruzione del numero del carattere.' },
          { id: '1.3.3', titolo: 'Dimensionare una registrazione PCM', sim: 'suono', scopo: 'Dimensione in byte di un suono, noti frequenza, canali, profondità e durata.' },
          { id: '1.3.4', titolo: 'Formati binari, validazione e contesto', sim: 'scudo', scopo: 'Verifica di una lunghezza dichiarata prima del suo impiego.' },
          { id: '1.3.5', titolo: 'Un metodo per decodificare i dati', sim: 'lente', scopo: 'Cinque domande, in ordine costante, per la lettura di qualunque campo.' }
        ],
        sfide: [['lez03_01_same_bits_two_meanings', 'Interpretare una sequenza di bit'], ['lez03_02_ascii_hex_string', 'Stringhe ASCII in esadecimale'], ['lez03_03_utf8_decode', 'Lunghezza e struttura delle sequenze UTF-8'], ['lez03_04_rgb_image_size', 'Immagini RGB e indirizzi dei pixel'], ['lez03_05_multi_interpretation', 'Formato e interpretazione dei dati']] },
      { id: '1.4', breve: 'Interi con segno', titolo: 'Interi con segno e complemento a due', sim: 'segno', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta la scrittura dei numeri negativi in un byte, la loro somma e il riconoscimento dei risultati esterni all’intervallo rappresentabile.',
        unita: [
          { id: '1.4.1', titolo: 'Il complemento a due a larghezza fissata', sim: 'segno', scopo: 'Rappresentazione in un byte dei numeri da −128 a 127.' },
          { id: '1.4.2', titolo: 'Somma, sottrazione e overflow', sim: 'operation', scopo: 'Somma di due byte e verifica della correttezza del risultato contenuto nel byte.' },
          { id: '1.4.3', titolo: 'Il linguaggio C: rappresentazione, operazioni e conversioni', sim: 'tabella', scopo: 'Effetto sui bit del passaggio di un numero da un tipo a un altro.' },
          { id: '1.4.4', titolo: 'Controllare l’aritmetica prima dell’operazione', sim: 'scudo', scopo: 'Verifica preventiva che un prodotto sia contenuto nella destinazione.' }
        ],
        sfide: [['lez04_01_encode_negative_twos', 'Codificare interi negativi'], ['lez04_02_decode_twos', 'Decodificare il complemento a due'], ['lez04_03_signed_range', 'Intervallo degli interi con segno'], ['lez04_04_fixed_width_add_sub', 'Somma e sottrazione a larghezza fissa'], ['lez04_05_overflow_detector', 'Rilevare il traboccamento']] },
      { id: '1.5', breve: 'Circuiti booleani', titolo: 'Circuiti booleani e calcolo a livello di bit', sim: 'porta', stato: 'nuovo', prova: true,
        guida: 'Il capitolo procede da tre porte elementari fino a un circuito che somma due numeri, e tratta maschere, ritardi e byte di stato.',
        unita: [
          { id: '1.5.1', titolo: 'Funzioni booleane e porte elementari', sim: 'porta', scopo: 'Funzioni calcolate da AND, OR, NOT e XOR, singolarmente e in cascata.' },
          { id: '1.5.2', titolo: 'Dalla tabella di verità al circuito', sim: 'tabella', scopo: 'Procedimento generale per ricavare un circuito da qualunque tabella.' },
          { id: '1.5.3', titolo: 'Vettori di bit, maschere e operatori del C', sim: 'byte', scopo: 'Lettura, accensione, spegnimento e inversione dei bit di un byte.' },
          { id: '1.5.4', titolo: 'Tempi, propagazione e impulsi transitori', sim: 'clock', scopo: 'Origine degli errori temporanei all’uscita di un circuito.' },
          { id: '1.5.5', titolo: 'Dalle porte all’aritmetica', sim: 'alu', scopo: 'Somma di una colonna con cinque porte, e di un numero con una serie di tali circuiti.' },
          { id: '1.5.6', titolo: 'Ragionamento booleano nel codice di sistema', sim: 'flag', scopo: 'Interrogazione di un byte di stato e distinzione fra «tutti» e «almeno uno».' }
        ],
        sfide: [['lez05_01_single_gate', 'Calcolare l’uscita delle porte'], ['lez05_02_bitwise_on_bytes', 'Operazioni bit a bit su un byte'], ['lez05_03_identify_gate', 'Riconoscere una porta dalla sua tabella'], ['lez05_04_c_bitwise_expression', 'Espressioni e maschere in C'], ['lez05_05_truth_table_rows', 'Costruire una tabella di verità']] },
      { id: '1.6', breve: 'Virgola mobile', titolo: 'Numeri frazionari e virgola mobile IEEE 754', sim: 'virgola', stato: 'nuovo', prova: true,
        guida: 'Il capitolo estende la rappresentazione dai numeri interi ai numeri con parte frazionaria, e motiva l’errore di piccola entità con il quale un calcolatore li conserva nella maggior parte dei casi.',
        unita: [
          { id: '1.6.1', titolo: 'Frazioni binarie, scala e precisione', sim: 'virgola', scopo: 'Scrittura binaria di un numero con parte frazionaria mediante raddoppi successivi.' },
          { id: '1.6.2', titolo: 'Il formato IEEE 754', sim: 'tabella', scopo: 'Scomposizione di una parola di 32 bit in segno, esponente e significando.' },
          { id: '1.6.3', titolo: 'Arrotondamento, distanza tra valori e programmi', sim: 'lente', scopo: 'Distanza fra numeri adiacenti ed effetto dell’arrotondamento sulle somme.' },
          { id: '1.6.4', titolo: 'Dal formato IEEE al percorso dei dati in virgola mobile', sim: 'alu', scopo: 'Le quattro fasi della somma di due numeri in virgola mobile.' }
        ],
        sfide: [['lez06_01_fractional_binary', 'Frazioni binarie e pesi posizionali'], ['lez06_02_exact_or_approx', 'Rappresentazione esatta e approssimazione'], ['lez06_03_normalize_binary', 'Normalizzazione ed esponente con bias'], ['lez06_04_ieee754_single_decode', 'Leggere un numero IEEE 754 a precisione singola'], ['lez06_05_c_float_pitfalls', 'Precisione delle operazioni in C']] },
      { id: '1.7', breve: 'Casi integrati', titolo: 'Casi integrati: dai byte al comportamento', sim: 'input', stato: 'nuovo', prova: true,
        guida: 'Il capitolo applica congiuntamente le regole dei capitoli precedenti a un solo messaggio, letto campo per campo e sottoposto ai controlli che ne stabiliscono l’accettazione.',
        unita: [
          { id: '1.7.1', titolo: 'Un metodo per interpretare dati binari reali', sim: 'tabella', scopo: 'Lettura di un record un campo alla volta, con arresto al primo campo incompleto.' },
          { id: '1.7.2', titolo: 'Un record di telemetria, cinque regole di rappresentazione', sim: 'strati', scopo: 'Cinque campi e cinque regole di lettura nel medesimo messaggio.' },
          { id: '1.7.3', titolo: 'Dai valori decodificati all’uso sicuro delle risorse', sim: 'memory', scopo: 'Verifica di un calcolo prima della riserva di memoria che ne dipende.' },
          { id: '1.7.4', titolo: 'La politica di accesso come livello di rappresentazione', sim: 'privilegi', scopo: 'Un byte di permessi: controllo della forma e successiva decisione.' },
          { id: '1.7.5', titolo: 'Risultati numerici e scelta della rappresentazione', sim: 'virgola', scopo: 'Somma ripetuta di dieci centesimi in due rappresentazioni.' },
          { id: '1.7.6', titolo: 'Dalla sintassi della shell ai byte di un comando', sim: 'terminale', scopo: 'Apertura e lettura del file in un comando con il segno <.' },
          { id: '1.7.7', titolo: 'Laboratorio conclusivo', sim: 'esperimento', scopo: 'Una misura codificata, alterata e riletta, e il controllo che la arresta.' }
        ],
        sfide: [] }
    ] },
    { k: '2', r: 'II', breve: 'x86-64', nome: 'Programmazione x86-64', sim: 'register', capitoli: [
      { id: '2.1', breve: 'Registri e memoria', titolo: 'Stato della macchina, registri e memoria', sim: 'memory', stato: 'nuovo', prova: true,
        guida: 'Il capitolo scende al livello delle istruzioni del processore: descrive il contenuto della macchina in ogni istante e la trasformazione che una riga di assembly vi produce.',
        unita: [
          { id: '2.1.1', titolo: 'Stato architetturale ed esecuzione', sim: 'register', scopo: 'Due istruzioni seguite nei tre passaggi di lettura, esecuzione e avanzamento.' },
          { id: '2.1.2', titolo: 'Registri, indirizzi e memoria', sim: 'strati', scopo: 'Un registro con quattro nomi ed effetto della scrittura in ciascuno.' },
          { id: '2.1.3', titolo: 'Lettura di brevi sequenze di istruzioni', sim: 'tabella', scopo: 'Traccia di quattro istruzioni su due registri.' },
          { id: '2.1.4', titolo: 'Stato architetturale, implementazione e prestazioni', sim: 'clock', scopo: 'Il medesimo programma su una, due o tre ALU: stesso risultato, tempi diversi.' }
        ],
        sfide: [['cslez2_1_01_random_assembly_01', 'Registri, ALU e unità di controllo'], ['cslez2_1_02_random_assembly_02', 'Periodo di clock, cicli e CPI'], ['cslez2_1_03_random_assembly_03', 'Tecnologie della gerarchia di memoria'], ['cslez2_1_04_random_assembly_04', 'Cache, indirizzi e località'], ['cslez2_1_05_random_assembly_05', 'Bus, indirizzi e trasferimenti di dati']] },
      { id: '2.2', breve: 'Aritmetica e flag', titolo: 'Aritmetica intera e flag di condizione', sim: 'flag', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta somme, prodotti, divisioni e confronti così come li esegue il processore: su una larghezza fissa, con i flag che ne riassumono l’esito.',
        unita: [
          { id: '2.2.1', titolo: 'Larghezza, segno e aritmetica a precisione fissa', sim: 'flag', scopo: 'Una somma, due letture dei bit e un flag per ciascuna lettura.' },
          { id: '2.2.2', titolo: 'Un’espressione in tre registri: a × b + c', sim: 'operation', scopo: 'Tre argomenti nei registri, tre istruzioni, un risultato in EAX.' },
          { id: '2.2.3', titolo: 'Moltiplicazione, divisione e calcolo dell’indirizzo efficace', sim: 'alu', scopo: 'Quoziente e resto in due registri, ed effetto della divisione per zero.' },
          { id: '2.2.4', titolo: 'Combinare i fattori di scala: 7a + 3b − 4', sim: 'tabella', scopo: 'Moltiplicazione per sette e per tre senza l’istruzione di moltiplicazione.' },
          { id: '2.2.5', titolo: 'Leggere il contratto di un’istruzione', sim: 'lente', scopo: 'Due istruzioni che scrivono il medesimo numero e lasciano flag diversi.' },
          { id: '2.2.6', titolo: 'Flag di condizione e larghezza', sim: 'segno', scopo: 'Una sottrazione e i suoi quattro flag, a otto e a sedici bit.' },
          { id: '2.2.7', titolo: 'Traduzione completa di un calcolo aritmetico', sim: 'bilancio', scopo: 'Una funzione intera: calcolo, confronto, salto e valore restituito.' }
        ],
        sfide: [['cslez2_2_01_random_assembly_01', 'Copia e aritmetica nei registri'], ['cslez2_2_02_random_assembly_02', 'Incrementi, somme e combinazioni lineari'], ['cslez2_2_03_random_assembly_03', 'Differenze e operazioni logiche'], ['cslez2_2_04_random_assembly_04', 'Complemento, scorrimenti e uguaglianza'], ['cslez2_2_05_random_assembly_05', 'Confronti e selezione condizionale']] },
      { id: '2.3', breve: 'Indirizzi e array', titolo: 'Indirizzi, array e disposizione dei dati', sim: 'puntatore', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta la collocazione dei dati in memoria e il modo in cui un’istruzione li raggiunge: ampiezza degli accessi, indirizzi calcolati, array, strutture e puntatori.',
        unita: [
          { id: '2.3.1', titolo: 'Indirizzi, valori e ampiezza degli accessi', sim: 'memory', scopo: 'Dal medesimo indirizzo, numeri diversi secondo il numero di byte letti.' },
          { id: '2.3.2', titolo: 'Formare un indirizzo efficace', sim: 'puntatore', scopo: 'Dall’indice di un elemento al suo indirizzo, su una linea graduata in byte.' },
          { id: '2.3.3', titolo: 'Array e matrici contigue', sim: 'tabella', scopo: 'Una tabella di righe e colonne disposta in un’unica fila di celle.' },
          { id: '2.3.4', titolo: 'Strutture, allineamento e riempimento', sim: 'byte', scopo: 'Tre membri, sei ordini possibili, e i byte vuoti che ne derivano.' },
          { id: '2.3.5', titolo: 'Validità degli oggetti e aliasing', sim: 'scudo', scopo: 'Due puntatori, una scrittura e il suo effetto su una lettura successiva.' },
          { id: '2.3.6', titolo: 'Codificare e riconoscere i calcoli di indirizzo', sim: 'lente', scopo: 'Tre byte di codice macchina scomposti nei campi di scala, indice e base.' }
        ],
        sfide: [['cslez2_3_01_random_assembly_01', 'Caricamenti di diversa larghezza'], ['cslez2_3_02_random_assembly_02', 'Scritture e calcolo di indirizzi con LEA'], ['cslez2_3_03_random_assembly_03', 'Indici, spiazzamenti e doppia indirezione'], ['cslez2_3_04_random_assembly_04', 'Scambi e aggiornamenti di elementi'], ['cslez2_3_05_random_assembly_05', 'Estremi di array, larghezze e indici']] },
      { id: '2.4', breve: 'Maschere e scorrimenti', titolo: 'Operazioni bit a bit, scorrimenti e maschere', sim: 'operation', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta le operazioni sui bit: scorrimento, isolamento, accensione e riunione in campi, fino alla composizione della parola di un’istruzione.',
        unita: [
          { id: '2.4.1', titolo: 'Maschere e scorrimenti come operazioni macchina', sim: 'operation', scopo: 'Gli otto bit di un byte in scorrimento, e i bit che entrano al posto di quelli usciti.' },
          { id: '2.4.2', titolo: 'Un solo bit a uno in posizione k', sim: 'bit', scopo: 'Una maschera con un solo 1 per accendere, spegnere, invertire o leggere un bit.' },
          { id: '2.4.3', titolo: 'Impacchettare campi e costruire valori vincolati', sim: 'byte', scopo: 'Due numeri piccoli in un byte, ed effetto di un valore troppo grande.' },
          { id: '2.4.4', titolo: 'Derivare le maschere di campo', sim: 'scudo', scopo: 'Dalla posizione e dalla larghezza di un campo alla maschera che lo isola.' },
          { id: '2.4.5', titolo: 'Comporre una parola nel formato di un’istruzione', sim: 'tabella', scopo: 'Quattro valori, quattro scorrimenti, una parola di trentadue bit.' }
        ],
        sfide: [['cslez2_4_01_random_assembly_01', 'Maschere per byte e singoli bit'], ['cslez2_4_02_random_assembly_02', 'Modificare bit e combinare semibyte'], ['cslez2_4_03_random_assembly_03', 'XOR, inversioni e scorrimenti'], ['cslez2_4_04_random_assembly_04', 'Estrarre, inserire e verificare campi'], ['cslez2_4_05_random_assembly_05', 'Allineamento, potenze di due e flag']] },
      { id: '2.5', breve: 'Chiamate di sistema', titolo: 'Chiamate di sistema Linux e confine tra utente e kernel', sim: 'privilegi', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta il modo in cui un programma richiede al sistema operativo i servizi che gli sono preclusi: scrittura, lettura, sostituzione del programma, terminazione.',
        unita: [
          { id: '2.5.1', titolo: 'Dalla richiesta dell’utente all’ingresso nel kernel', sim: 'privilegi', scopo: 'Una richiesta che attraversa il confine fra programma e kernel, e la relativa risposta.' },
          { id: '2.5.2', titolo: 'L’ABI delle syscall Linux x86-64', sim: 'tabella', scopo: 'Sei argomenti in sei registri, e la ragione per cui il quarto cambia registro.' },
          { id: '2.5.3', titolo: 'I/O tramite descrittori di file', sim: 'file', scopo: 'Una lettura e una scrittura che trasferiscono meno byte di quanti ne erano stati richiesti.' },
          { id: '2.5.4', titolo: 'Mappature e sostituzione dell’immagine di processo', sim: 'process', scopo: 'Un processo che cambia programma e conserva il proprio numero.' },
          { id: '2.5.5', titolo: 'Identità dei descrittori e stato aperto condiviso', sim: 'tabella', scopo: 'Due descrittori sul medesimo file: posizione condivisa oppure indipendente.' },
          { id: '2.5.6', titolo: 'Dall’ingresso nel programma all’uscita del processo', sim: 'output', scopo: 'Il percorso di un codice di uscita, dal processo che termina al genitore che lo legge.' }
        ],
        sfide: [['cslez2_5_01_random_assembly_01', 'Scrittura sui descrittori e terminazione'], ['cslez2_5_02_random_assembly_02', 'Lettura in un buffer e scrittura di porzioni'], ['cslez2_5_03_random_assembly_03', 'Lunghezze, stack e posizioni nel buffer'], ['cslez2_5_04_random_assembly_04', 'Valori restituiti e trasferimenti di zero byte'], ['cslez2_5_05_random_assembly_05', 'Sequenze di letture e scritture']] },
      { id: '2.6', breve: 'Procedure e controllo', titolo: 'Procedure, flusso di controllo e analisi del codice macchina', sim: 'pila', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta il modo in cui una funzione riceve i dati, cede il controllo e lo riprende, e la lettura di una funzione di cui è disponibile soltanto il codice macchina.',
        unita: [
          { id: '2.6.1', titolo: 'La convenzione delle chiamate di funzione', sim: 'input', scopo: 'Otto argomenti per sei registri: la collocazione degli altri due.' },
          { id: '2.6.2', titolo: 'Frame dello stack e trasferimenti di controllo', sim: 'pila', scopo: 'Da CALL a RET, con RSP e ogni cella impiegata dalla funzione.' },
          { id: '2.6.3', titolo: 'Il flusso di controllo dentro una funzione', sim: 'fork', scopo: 'Il medesimo confronto letto da due salti, con due esiti diversi.' },
          { id: '2.6.4', titolo: 'Leggere una funzione compilata', sim: 'riproduci', scopo: 'Un salto all’indietro, e la tabella delle iterazioni che ne rivela il calcolo.' },
          { id: '2.6.5', titolo: 'Argomenti aggregati e chiamate variadiche', sim: 'tabella', scopo: 'Una struttura come argomento: registri oppure pila, secondo la dimensione.' },
          { id: '2.6.6', titolo: 'Un metodo di analisi del codice macchina', sim: 'lente', scopo: 'Cinque istruzioni prive di nome, e quattro domande per stabilirne il calcolo.' }
        ],
        sfide: [['cslez2_6_01_random_assembly_01', 'Preprocessore, compilatore e file oggetto'], ['cslez2_6_02_random_assembly_02', 'Disassemblaggio, simboli e debugger'], ['cslez2_6_03_random_assembly_03', 'Valore restituito, confronti e salti'], ['cslez2_6_04_random_assembly_04', 'Espressioni, array e chiamate'], ['cslez2_6_05_random_assembly_05', 'Argomenti e lettura del codice ottimizzato']] },
      { id: '2.7', breve: 'Stack e sicurezza', titolo: 'Frame dello stack, sicurezza della memoria e riuso del flusso di controllo', sim: 'scudo', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta gli effetti di una scrittura esterna ai limiti di una variabile sulla pila, le difese esistenti e i limiti di ciascuna.',
        unita: [
          { id: '2.7.1', titolo: 'I frame dello stack come convenzioni', sim: 'pila', scopo: 'Un riferimento fisso, RBP, e le celle del frame individuate rispetto a esso.' },
          { id: '2.7.2', titolo: 'Dalla scrittura fuori limite ai dati di controllo', sim: 'scudo', scopo: 'Una copia troppo lunga, seguita byte per byte fino all’indirizzo di ritorno.' },
          { id: '2.7.3', titolo: 'Protezioni e loro limiti', sim: 'bilancio', scopo: 'Cinque scritture e la sentinella: le scritture rilevate e quelle che il controllo lascia passare.' },
          { id: '2.7.4', titolo: 'Riuso del flusso di controllo', sim: 'puntatore', scopo: 'Tre indirizzi sulla pila che determinano l’ordine di blocchi già esistenti.' },
          { id: '2.7.5', titolo: 'Ottimizzazioni dello stack e dettagli ABI', sim: 'memory', scopo: 'Tre funzioni con tre impieghi della pila, e la regola dei multipli di 16.' },
          { id: '2.7.6', titolo: 'Stack ombra e protezioni complementari', sim: 'scudo', scopo: 'Due copie dell’indirizzo di ritorno, e ciò che RET confronta.' },
          { id: '2.7.7', titolo: 'Verifiche per una revisione di sicurezza della memoria', sim: 'lente', scopo: 'Una stringa, il suo terminatore e il confronto che stabilisce se è contenuta nel buffer.' }
        ],
        sfide: [['cslez2_7_01_random_assembly_01', 'Operazioni sulla cima dello stack'], ['cslez2_7_02_random_assembly_02', 'Spazio locale e prologo di funzione'], ['cslez2_7_03_random_assembly_03', 'Epilogo, variabili locali e chiamate'], ['cslez2_7_04_random_assembly_04', 'Ordine e duplicazione dei valori sullo stack'], ['cslez2_7_05_random_assembly_05', 'Allineamento, registri salvati e indirizzo di ritorno']] }
    ] },
    { k: '3', r: 'III', breve: 'Processore', nome: 'Organizzazione del processore', sim: 'cpu', capitoli: [
      { id: '3.1', breve: 'Logica combinatoria', titolo: 'Logica combinatoria: dalle tabelle di verità all’ALU', sim: 'alu', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta la traduzione di una specifica espressa a parole in un circuito, e la composizione di selettori e sommatori fino all’unità che esegue i calcoli del processore.',
        unita: [
          { id: '3.1.1', titolo: 'Dalla specifica booleana ai blocchi del percorso dati', sim: 'porta', scopo: 'Tre sensori, una spia e due circuiti diversi che calcolano la medesima funzione.' },
          { id: '3.1.2', titolo: 'Selezionare un ingresso con un multiplexer', sim: 'mux', scopo: 'Quattro parole in ingresso, due bit di comando e una sola uscita.' },
          { id: '3.1.3', titolo: 'Aritmetica e costruzione dell’ALU', sim: 'alu', scopo: 'Un sommatore che, con una fila di XOR e un filo di comando, esegue anche le sottrazioni.' },
          { id: '3.1.4', titolo: 'Dai blocchi combinatori al controllo del processore', sim: 'mux', scopo: 'Quattro risultati calcolati in parallelo e un comando che ne seleziona uno.' },
          { id: '3.1.5', titolo: 'Tempi, costo e realizzazione fisica', sim: 'clock', scopo: 'Tre barre del tempo per individuare il percorso che determina la velocità di un circuito.' },
          { id: '3.1.6', titolo: 'Implementazioni alternative e flag di stato', sim: 'flag', scopo: 'Un riporto noto in anticipo e i quattro flag letti sui fili del sommatore.' }
        ],
        sfide: [['cslez3_1_01_random_assembly', 'Funzioni booleane di uno o più ingressi'], ['cslez3_1_02_random_assembly', 'Selezione dei dati con multiplexer'], ['cslez3_1_03_random_assembly', 'Somme, differenze e riporti'], ['cslez3_1_04_random_assembly', 'Operazioni e segnali di uscita dell’ALU'], ['cslez3_1_05_random_assembly', 'Transizioni e stato di un latch SR']] },
      { id: '3.2', breve: 'Logica sequenziale', titolo: 'Logica sequenziale: stato, registri e memoria', sim: 'flipflop', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta il modo in cui un circuito conserva un valore, l’istante in cui il valore è scritto e i tempi da rispettare affinché la scrittura riesca.',
        unita: [
          { id: '3.2.1', titolo: 'Dalla logica combinatoria allo stato memorizzato', sim: 'register', scopo: 'Due registri sul medesimo bus, e il comando che determina quale carica e quale conserva.' },
          { id: '3.2.2', titolo: 'Latch, flip-flop e clock', sim: 'flipflop', scopo: 'Il medesimo dato presentato a due celle: una lo segue per un livello, l’altra lo cattura in un istante.' },
          { id: '3.2.3', titolo: 'Registri, banchi di registri e memoria', sim: 'memory', scopo: 'Quattro registri, due porte che leggono e una che scrive al fronte.' },
          { id: '3.2.4', titolo: 'Il modello sincrono e i limiti temporali', sim: 'clock', scopo: 'Il dato più tardivo e quello più precoce, confrontati con le finestre di setup e di hold.' },
          { id: '3.2.5', titolo: 'Dallo stato memorizzato alle macchine a stati', sim: 'riproduci', scopo: 'Un distributore che conserva soltanto il credito, seguito moneta dopo moneta.' }
        ],
        sfide: [['cslez3_2_01_random_assembly', 'Stati e ingressi di un latch SR'], ['cslez3_2_02_random_assembly', 'Trasparenza e abilitazione del latch D'], ['cslez3_2_03_random_assembly', 'Acquisizione sul fronte di clock'], ['cslez3_2_04_random_assembly', 'Caricamento e modifica di un registro a quattro bit'], ['cslez3_2_05_random_assembly', 'Aggiornamenti paralleli e priorità dei comandi']] },
      { id: '3.3', breve: 'Repertorio Y86-64', titolo: 'Il repertorio Y86-64 e le fasi di esecuzione', sim: 'file', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta una macchina ridotta, descritta per intero: lo stato, la codifica in byte delle istruzioni e le sei fasi in cui ciascuna è eseguita.',
        unita: [
          { id: '3.3.1', titolo: 'Dalla logica al contratto dell’ISA', sim: 'cpu', scopo: 'Tre istruzioni sul medesimo stato: le parti modificate e quelle invariate.' },
          { id: '3.3.2', titolo: 'Codifica e confini delle istruzioni', sim: 'hex', scopo: 'Dieci byte in memoria, letti nell’ordine seguito dal processore per individuare la fine dell’istruzione.' },
          { id: '3.3.3', titolo: 'Semantica delle istruzioni e flusso dei dati', sim: 'strati', scopo: 'Una lettura dalla memoria seguita attraverso le sei fasi, un valore alla volta.' },
          { id: '3.3.4', titolo: 'Classi di istruzioni, stato e controllo', sim: 'scudo', scopo: 'Quattro codici di stato, e il controllo che mantiene un accesso entro la memoria.' },
          { id: '3.3.5', titolo: 'Tracce complete delle istruzioni', sim: 'tabella', scopo: 'Una call e il suo ret, dodici fasi in cui il medesimo indirizzo cambia nome tre volte.' },
          { id: '3.3.6', titolo: 'Assemblaggio manuale come verifica', sim: 'file', scopo: 'Quattro righe di testo tradotte in byte, con un salto verso un’etichetta successiva.' }
        ],
        sfide: [['cslez3_3_01_random_assembly', 'Decodificare icode e ifun'], ['cslez3_3_02_random_assembly', 'Lunghezza e campi di un’istruzione'], ['cslez3_3_03_random_assembly', 'Registri sorgente e destinazione'], ['cslez3_3_04_random_assembly', 'Operazioni Y86-64 e codici di condizione'], ['cslez3_3_05_random_assembly', 'Memoria, scrittura dei risultati e aggiornamento del PC']] },
      { id: '3.4', breve: 'Processore sequenziale', titolo: 'Il processore sequenziale', sim: 'cpu', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta il primo processore completo: un’istruzione per ciclo, con i blocchi dei capitoli precedenti collegati fra loro e comandati da poche equazioni.',
        unita: [
          { id: '3.4.1', titolo: 'Dalle fasi dell’ISA a una macchina sincrona', sim: 'cpu', scopo: 'Una sottrazione seguita entro un solo ciclo, fino al fronte che la rende definitiva.' },
          { id: '3.4.2', titolo: 'Il percorso dati a ciclo singolo di SEQ', sim: 'alu', scopo: 'Una pushq sul percorso dati: due multiplexer, un’ALU e un risultato con due destinazioni.' },
          { id: '3.4.3', titolo: 'Temporizzazione e aggiornamento dello stato', sim: 'clock', scopo: 'Due percorsi sul medesimo asse dei tempi, e il periodo che il più lento determina per tutte le istruzioni.' },
          { id: '3.4.4', titolo: 'Equazioni di controllo, traccia e verifica', sim: 'mux', scopo: 'pushq e popq dal medesimo stato: i segnali che distinguono un deposito da un prelievo.' },
          { id: '3.4.5', titolo: 'Oltre SEQ a ciclo singolo', sim: 'bilancio', scopo: 'Il medesimo programma su due macchine: pochi cicli lunghi a confronto con molti cicli brevi.' }
        ],
        sfide: [['cslez3_4_01_random_assembly', 'Ingressi dell’ALU e aggiornamento dello stack'], ['cslez3_4_02_random_assembly', 'Indirizzi di memoria e limiti degli accessi'], ['cslez3_4_03_random_assembly', 'Segnali di controllo di SEQ'], ['cslez3_4_04_random_assembly', 'Cammino critico e periodo di clock'], ['cslez3_4_05_random_assembly', 'Selezione del PC e stato successivo']] },
      { id: '3.5', breve: 'Pipeline e conflitti', titolo: 'Pipeline: sovrapposizione, capacità di completamento e conflitti', sim: 'conflitto', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta il vantaggio ottenuto facendo avanzare più istruzioni contemporaneamente, la lettura del diagramma che lo descrive e i conflitti prodotti dalla sovrapposizione.',
        unita: [
          { id: '3.5.1', titolo: 'Sovrapposizione, capacità di completamento e latenza', sim: 'pipeline', scopo: 'Un flusso di istruzioni in una pipeline vuota: il tempo di ciascuna e l’intervallo fra un’uscita e la successiva.' },
          { id: '3.5.2', titolo: 'Leggere i diagrammi temporali della pipeline', sim: 'tabella', scopo: 'Tre istantanee consecutive della pipeline, lette per righe e per colonne.' },
          { id: '3.5.3', titolo: 'Conflitti dovuti alla sovrapposizione', sim: 'conflitto', scopo: 'Un dato in ritardo, una porta contesa, un salto con previsione errata: tre cause di cicli perduti.' },
          { id: '3.5.4', titolo: 'Dalla portata ideale al CPI misurato', sim: 'bilancio', scopo: 'Il contatore dei cicli e quello delle istruzioni: riempimento, penalità e la loro incidenza sul CPI.' }
        ],
        sfide: [['cslez3_5_01_random_assembly', 'Riempimento, svuotamento e cicli di pipeline'], ['cslez3_5_02_random_assembly', 'Latenza, produttività e accelerazione'], ['cslez3_5_03_random_assembly', 'Dipendenze di lettura dopo scrittura'], ['cslez3_5_04_random_assembly', 'Conteggio e sovrapposizione degli stalli'], ['cslez3_5_05_random_assembly', 'Distanza tra istruzioni dipendenti']] },
      { id: '3.6', breve: 'Pipeline a cinque stadi', titolo: 'Il processore in pipeline a cinque stadi', sim: 'pipeline', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta la struttura del processore PIPE: i registri fra gli stadi, la scelta del prossimo prelievo, l’inoltro dei dati, le bolle e gli stalli, fino alla misura delle prestazioni.',
        unita: [
          { id: '3.6.1', titolo: 'Dalla sovrapposizione alla pipeline controllata', sim: 'register', scopo: 'Un fronte del clock in dettaglio: cinque registri che catturano contemporaneamente.' },
          { id: '3.6.2', titolo: 'Stato della pipeline e controllo del prelievo', sim: 'puntatore', scopo: 'Tre indirizzi candidati e un selettore con priorità: l’indirizzo del prossimo prelievo.' },
          { id: '3.6.3', titolo: 'Dipendenze dei dati e inoltro', sim: 'bus', scopo: 'Un registro scritto da tre istruzioni: il valore fornito allo stadio D e la sua sorgente.' },
          { id: '3.6.4', titolo: 'Conflitti di controllo, stalli e bolle', sim: 'conflitto', scopo: 'Un salto condizionato nello stadio E: due istruzioni da conservare oppure da trasformare in bolle.' },
          { id: '3.6.5', titolo: 'Priorità dei conflitti e stato preciso', sim: 'stallo', scopo: 'Carico, ret ed errori nel medesimo ciclo: i registri bloccati e quelli che ricevono una bolla.' },
          { id: '3.6.6', titolo: 'Traccia e conteggio delle prestazioni', sim: 'tabella', scopo: 'Un carico, il suo uso e un’istruzione indipendente: due ordini, due tracce a confronto.' },
          { id: '3.6.7', titolo: 'Misurare e spiegare le prestazioni', sim: 'bilancio', scopo: 'Il medesimo programma prima e dopo il riordino: cicli, tempo, CPI e accelerazione.' }
        ],
        sfide: [['cslez3_6_01_random_assembly', 'Istruzioni presenti nei cinque stadi'], ['cslez3_6_02_random_assembly', 'Abilitazione e controllo dei registri di pipeline'], ['cslez3_6_03_random_assembly', 'Priorità nella selezione del PC'], ['cslez3_6_04_random_assembly', 'Cronologia degli stadi e completamento'], ['cslez3_6_05_random_assembly', 'Trasferimenti tra stadi e bolle']] }
    ] },
    { k: '4', r: 'IV', breve: 'I/O e dischi', nome: 'I/O e archiviazione', sim: 'storage', capitoli: [
      { id: '4.1', breve: 'Eccezioni', titolo: 'Flusso di controllo eccezionale e ingresso protetto', sim: 'interrupt', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta ciò che accade quando un evento sottrae il processore a un programma: le classi di eventi, la tabella che conduce al gestore, lo stato da salvare e l’ordine dei ritorni.',
        unita: [
          { id: '4.1.1', titolo: 'Interruzione del flusso sequenziale', sim: 'interrupt', scopo: 'Un evento durante un’istruzione: il gestore, l’indirizzo salvato e la ripresa.' },
          { id: '4.1.2', titolo: 'Interrupt, fault, trap e abort', sim: 'conflitto', scopo: 'Quattro classi di eventi, distinte dal rapporto con l’istruzione in corso.' },
          { id: '4.1.3', titolo: 'Vettori, privilegi e ingresso protetto', sim: 'tabella', scopo: 'Dal vettore alla voce della IDT, e il controllo che stabilisce quali richieste possono entrare.' },
          { id: '4.1.4', titolo: 'Ingresso preciso in una macchina con pipeline', sim: 'pipeline', scopo: 'Un fault fra sei istruzioni: gli effetti che restano e quelli scartati.' },
          { id: '4.1.5', titolo: 'Codice di ingresso Linux e contesto salvato', sim: 'pila', scopo: 'La cima della pila del kernel, cella per cella, dal frame ai registri salvati.' },
          { id: '4.1.6', titolo: 'Stato da preservare all’ingresso', sim: 'register', scopo: 'Un registro impiegato dal gestore: salvato e ripristinato, oppure perduto.' },
          { id: '4.1.7', titolo: 'Ripresa, annidamento e priorità', sim: 'interrupt', scopo: 'Una seconda richiesta durante un gestore: entra immediatamente oppure attende.' }
        ],
        sfide: [['cslez4_1_01_exceptions_01', 'Vettori e voci della IDT'], ['cslez4_1_02_exceptions_02', 'Classificare fault, trap e interrupt'], ['cslez4_1_03_exceptions_03', 'Campi del frame di ingresso'], ['cslez4_1_04_exceptions_04', 'Mascheramento e privilegi'], ['cslez4_1_05_exceptions_05', 'Indirizzo del gestore, esecuzione e ritorno']] },
      { id: '4.2', breve: 'Ingresso nel kernel', titolo: 'Chiamate di sistema e ingresso controllato nel kernel', sim: 'gate', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta la chiamata di sistema dal punto di vista del kernel: la selezione del servizio, i controlli sugli argomenti, i valori restituiti, le attese e le regole che stabiliscono quali operazioni sono concesse a ciascun utente.',
        unita: [
          { id: '4.2.1', titolo: 'Dalla richiesta utente all’esecuzione nel kernel', sim: 'gate', scopo: 'Un numero in RAX seleziona il servizio, e il servizio determina il significato degli altri registri.' },
          { id: '4.2.2', titolo: 'Il percorso di write oltre il confine di privilegio', sim: 'scudo', scopo: 'Una write di otto lettere su una pipe: il kernel convalida il descrittore prima della copia.' },
          { id: '4.2.3', titolo: 'Convalida, valori di ritorno e avanzamento parziale', sim: 'puntatore', scopo: 'Dopo una write parziale: il punto di ripresa e i byte residui.' },
          { id: '4.2.4', titolo: 'Quando una chiamata di sistema si blocca', sim: 'clock', scopo: 'Una read su una pipe vuota: l’attesa all’interno della chiamata, oppure il ritorno immediato.' },
          { id: '4.2.5', titolo: 'Meccanismo, politica e struttura del sistema operativo', sim: 'privilegi', scopo: 'La medesima open, due utenti, due risposte: l’esito dipende dai permessi del file.' }
        ],
        sfide: [['cslez4_2_01_syscalls_01', 'Numeri, argomenti e registri delle syscall'], ['cslez4_2_02_syscalls_02', 'Passaggio dalla modalità utente al kernel'], ['cslez4_2_03_syscalls_03', 'Preparare read, write ed exit'], ['cslez4_2_04_syscalls_04', 'Trasferimenti parziali, EOF ed errori'], ['cslez4_2_05_syscalls_05', 'Selezione del servizio e funzione di libreria']] },
      { id: '4.3', breve: 'Polling e interrupt', titolo: 'Controller dei dispositivi, polling e interrupt', sim: 'dispositivo', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta la comunicazione fra il kernel e una periferica: i registri del controller, i due modi di rilevare un evento, il percorso di un interrupt fino al gestore e i costi del servizio.',
        unita: [
          { id: '4.3.1', titolo: 'Interfaccia del controller e notifiche', sim: 'dispositivo', scopo: 'Una misura, dal comando al dato: tre registri e un bit che indica l’istante della lettura.' },
          { id: '4.3.2', titolo: 'Polling e interrupt', sim: 'clock', scopo: 'Il medesimo evento scoperto in due modi, con il calcolo del ritardo e del lavoro.' },
          { id: '4.3.3', titolo: 'Instradamento, vettori e conferma dell’interrupt', sim: 'interrupt', scopo: 'Dalla linea al vettore, dal vettore al gestore, e le due conferme nel loro ordine.' },
          { id: '4.3.4', titolo: 'Registri del dispositivo, costo e struttura del driver', sim: 'coda', scopo: 'Una coda servita a gruppi, e un registro di stato i cui flag si cancellano con la scrittura di 1.' }
        ],
        sfide: [['cslez4_3_01_io_interrupts_01', 'Registri di comando, stato e dati'], ['cslez4_3_02_io_interrupts_02', 'Frequenza e costo del polling'], ['cslez4_3_03_io_interrupts_03', 'Consegna e riconoscimento di un interrupt'], ['cslez4_3_04_io_interrupts_04', 'Fronte, livello e priorità'], ['cslez4_3_05_io_interrupts_05', 'Percorso di un evento da tastiera']] },
      { id: '4.4', breve: 'Bus e transazioni', titolo: 'Bus, transazioni e interconnessioni', sim: 'bus', stato: 'nuovo', prova: true,
        guida: 'Processore, memoria e controller comunicano attraverso collegamenti condivisi. Il capitolo tratta una transazione sul bus, ne misura la capacità e la durata, descrive l’ordinamento delle richieste da parte di un arbitro, e giunge alle reti di collegamenti punto a punto.',
        unita: [
          { id: '4.4.1', titolo: 'Regole di comunicazione di un’interconnessione', sim: 'bus', scopo: 'L’iniziatore che ottiene il turno, e il componente che risponde a un indirizzo.' },
          { id: '4.4.2', titolo: 'Larghezza, clock e topologia', sim: 'clock', scopo: 'Tre fattori che, moltiplicati, forniscono i byte al secondo.' },
          { id: '4.4.3', titolo: 'Transazioni e semantica del protocollo', sim: 'coda', scopo: 'Le medesime parole in una raffica oppure in transazioni singole.' },
          { id: '4.4.4', titolo: 'Banda, coordinamento e arbitraggio', sim: 'semaforo', scopo: 'Priorità fissa e round-robin, e l’attesa che ne deriva.' },
          { id: '4.4.5', titolo: 'Gerarchie e reti punto a punto', sim: 'strati', scopo: 'Il percorso di un pacchetto attraverso un ponte.' }
        ],
        sfide: [['cslez4_4_01_buses_01', 'Tempo di trasferimento e banda utile'], ['cslez4_4_02_buses_02', 'Larghezza del bus e cicli di trasferimento'], ['cslez4_4_03_buses_03', 'Arbitraggio e tempi di attesa'], ['cslez4_4_04_buses_04', 'Trasferimenti sincroni, asincroni e a raffica'], ['cslez4_4_05_buses_05', 'Collegamenti bidirezionali, code e latenza']] },
      { id: '4.5', breve: 'Dischi magnetici', titolo: 'Memoria magnetica e analisi dei tempi di accesso', sim: 'disco', stato: 'nuovo', prova: true,
        guida: 'Il disco magnetico è un dispositivo con parti in movimento, i cui tempi si misurano in millisecondi. Il capitolo ne descrive la geometria, calcola il tempo di una lettura e mostra il modo in cui l’ordine di servizio e la cache riducono gli spostamenti del braccio.',
        unita: [
          { id: '4.5.1', titolo: 'Geometria e latenza meccanica', sim: 'disco', scopo: 'Seek e ritardo di rotazione, prima della lettura di un byte.' },
          { id: '4.5.2', titolo: 'Blocchi logici e prestazioni quantitative', sim: 'byte', scopo: 'Dai numeri di blocco ai byte, e il tempo di una lettura sequenziale.' },
          { id: '4.5.3', titolo: 'Code, scheduling e cache', sim: 'coda', scopo: 'FCFS e SSTF a confronto sul cammino della testina.' }
        ],
        sfide: [['cslez4_5_01_disks_01', 'Geometria e capacità di un disco'], ['cslez4_5_02_disks_02', 'Rotazione, posizionamento e tempo di accesso'], ['cslez4_5_03_disks_03', 'Indirizzamento a blocchi e frammentazione'], ['cslez4_5_04_disks_04', 'Velocità e tempo di trasferimento'], ['cslez4_5_05_disks_05', 'Ordine delle letture e località']] },
      { id: '4.6', breve: 'RAID e SSD', titolo: 'RAID e memoria a stato solido', sim: 'raid', stato: 'nuovo', prova: true,
        guida: 'Il capitolo tratta due risposte ai limiti del disco magnetico. Il RAID riunisce più dischi per tollerare i guasti, con copie oppure con la parità. L’unità a stato solido elimina la meccanica, e deve per contro gestire una memoria che esclude la correzione sul posto.',
        unita: [
          { id: '4.6.1', titolo: 'Ridondanza, modelli di guasto e RAID', sim: 'raid', scopo: 'Capacità utile e guasti tollerati dai livelli RAID.' },
          { id: '4.6.2', titolo: 'Scritture di parità, modalità degradata e ricostruzione', sim: 'gate', scopo: 'La parità calcolata, aggiornata e impiegata dopo un guasto.' },
          { id: '4.6.3', titolo: 'Memoria flash e traduzione', sim: 'ssd', scopo: 'Ogni aggiornamento in una pagina nuova, con una mappa per ritrovarlo.' },
          { id: '4.6.4', titolo: 'FTL, durata e latenza dipendente dallo stato', sim: 'clock', scopo: 'Il recupero dello spazio e il suo costo sulle scritture.' }
        ],
        sfide: [['cslez4_6_01_raid_ssd_01', 'Affidabilità e disponibilità'], ['cslez4_6_02_raid_ssd_02', 'Distribuzione dei dati in RAID 0'], ['cslez4_6_03_raid_ssd_03', 'Copie e ricostruzione in RAID 1'], ['cslez4_6_04_raid_ssd_04', 'Parità e capacità in RAID 5 e RAID 10'], ['cslez4_6_05_raid_ssd_05', 'Lettura, cancellazione e usura negli SSD']] },
      { id: '4.7', breve: 'Dispositivi e DMA', titolo: 'Classi di dispositivi e accesso diretto alla memoria', sim: 'ssd', stato: 'nuovo', prova: true,
        guida: 'Con l’accesso diretto alla memoria il dispositivo trasferisce i dati in modo autonomo. Il capitolo ne misura il vantaggio, descrive la richiesta che il driver gli affida, le regole di proprietà sui buffer condivisi, le condizioni su indirizzi e contenuto, e conclude il Modulo IV con il completamento, fino alla ripresa del processo.',
        unita: [
          { id: '4.7.1', titolo: 'I/O programmato e motivazione del DMA', sim: 'cpu', scopo: 'Un costo per parola a fronte di un costo fisso.' },
          { id: '4.7.2', titolo: 'Il DMA come transazione di memoria delegata', sim: 'bus', scopo: 'Dal descrittore alle transazioni del dispositivo.' },
          { id: '4.7.3', titolo: 'Interfacce, descrittori e proprietà dei buffer', sim: 'coda', scopo: 'Un anello di slot, e il componente che può accedervi in ogni istante.' },
          { id: '4.7.4', titolo: 'Coerenza, ordinamento e indirizzi visibili al dispositivo', sim: 'cache', scopo: 'L’indirizzo valido per il dispositivo, e la memoria aggiornata.' },
          { id: '4.7.5', titolo: 'Completamento e ritorno allo scheduling', sim: 'process', scopo: 'Dall’ultimo byte alla ripresa del processo.' }
        ],
        sfide: [['cslez4_7_01_dma_01', 'Dispositivi a caratteri e a blocchi'], ['cslez4_7_02_dma_02', 'Driver e gestione delle richieste'], ['cslez4_7_03_dma_03', 'Configurazione e completamento del DMA'], ['cslez4_7_04_dma_04', 'Costo temporale e impegno della CPU'], ['cslez4_7_05_dma_05', 'Confrontare I/O programmato e DMA']] }
    ] },
    { k: '5', r: 'V', breve: 'Processi', nome: 'Processi e concorrenza', sim: 'process', capitoli: [
      { id: '5.1', breve: 'Processi e stati', titolo: 'Processi, stati e cambi di contesto', sim: 'process', stato: 'nuovo', prova: true,
        guida: 'Il Modulo V comincia dal processo: una esecuzione di un programma, isolata dalle altre. Il capitolo mostra gli stati in cui un processo può trovarsi, come il kernel lo sospende e lo fa ripartire dal punto giusto, e quali dati conserva per riuscirci.',
        unita: [
          { id: '5.1.1', titolo: 'Il processo come astrazione di esecuzione e protezione', sim: 'process', scopo: 'Lo stesso indirizzo, in due processi, conduce a celle diverse.' },
          { id: '5.1.2', titolo: 'Dall’esecuzione agli stati di pronto e bloccato', sim: 'coda', scopo: 'Che cosa manca a un processo per eseguire.' },
          { id: '5.1.3', titolo: 'Il cambio di contesto e la continuità dell’esecuzione', sim: 'register', scopo: 'Il contatore salvato, e la ripresa dal punto giusto.' },
          { id: '5.1.4', titolo: 'Quali dati conserva il kernel', sim: 'tabella', scopo: 'La scheda di ogni processo, e le code che la contengono.' }
        ],
        sfide: [['cslez5_1_01_processes', 'Programmi, processi e parallelismo'], ['cslez5_1_02_processes', 'Transizioni fra gli stati di un processo'], ['cslez5_1_03_processes', 'Contesto salvato e PCB'], ['cslez5_1_04_processes', 'Costo dei cambi e tempi di risposta'], ['cslez5_1_05_processes', 'Ordine di esecuzione e assegnazione ai core']] },
      { id: '5.2', breve: 'Creazione e terminazione', titolo: 'Creazione dei processi, sostituzione del programma e terminazione', sim: 'fork', stato: 'nuovo', prova: true,
        guida: 'La vita di un processo Unix in quattro chiamate: fork lo crea per duplicazione, execve gli cambia programma, _exit lo termina, waitpid ne raccoglie l’esito. Il capitolo le segue una per una, mostra come la shell le combina per eseguire un comando, e chiude con un caso delicato.',
        unita: [
          { id: '5.2.1', titolo: 'Creazione per duplicazione', sim: 'fork', scopo: 'Due ritorni da una chiamata, e la copia su scrittura.' },
          { id: '5.2.2', titolo: 'Avvio di un comando e redirezione dell’uscita', sim: 'terminale', scopo: 'Che cosa fa la shell fra fork e l’avvio del programma.' },
          { id: '5.2.3', titolo: 'Sostituire il programma di un processo', sim: 'process', scopo: 'Che cosa cambia e che cosa resta dopo execve.' },
          { id: '5.2.4', titolo: 'Attesa, terminazione e registrazione finale del processo', sim: 'tabella', scopo: 'Il codice di uscita, la raccolta e i processi zombie.' },
          { id: '5.2.5', titolo: 'Fork in un processo multithread', sim: 'thread', scopo: 'Un lucchetto ereditato chiuso, senza chi lo apra.' }
        ],
        sfide: [['cslez5_2_01_process_control', 'Valori restituiti da fork'], ['cslez5_2_02_process_control', 'Risorse ereditate e copia su scrittura'], ['cslez5_2_03_process_control', 'Sostituzione del programma con exec'], ['cslez5_2_04_process_control', 'Terminazione, wait e processi zombie'], ['cslez5_2_05_process_control', 'Fork condizionali e sequenze della shell']] },
      { id: '5.3', breve: 'Scheduling', titolo: 'Scheduling della CPU e condivisione del tempo', sim: 'coda', stato: 'nuovo', prova: true,
        guida: 'Molti processi pronti, pochi processori: qualcuno deve scegliere. Il capitolo mostra quando lo scheduler decide, confronta le politiche FCFS, SJF e round-robin sulle attese che producono, esamina le priorità con i loro inconvenienti, e passa infine a più core.',
        unita: [
          { id: '5.3.1', titolo: 'Eventi che attivano lo scheduler', sim: 'interrupt', scopo: 'Quando si decide, e quanto aspetta chi si è appena risvegliato.' },
          { id: '5.3.2', titolo: 'Ordine di servizio e attesa media in FCFS e SJF', sim: 'coda', scopo: 'Lo stesso lavoro, attese diverse secondo l’ordine.' },
          { id: '5.3.3', titolo: 'Round-robin e costo della prelazione', sim: 'clock', scopo: 'La rotazione turno per turno, e il prezzo dei cambi.' },
          { id: '5.3.4', titolo: 'Priorità, retroazione e inversione', sim: 'lucchetto', scopo: 'Un mutex che fa aspettare il processo più urgente.' },
          { id: '5.3.5', titolo: 'Scheduling su più processori logici', sim: 'cpu', scopo: 'Due code, e i lavori da spostare per bilanciarle.' }
        ],
        sfide: [['cslez5_3_01_scheduling', 'Tempi di attesa, risposta e completamento'], ['cslez5_3_02_scheduling', 'Ordinamento FCFS e prestazioni'], ['cslez5_3_03_scheduling', 'SJF e SRTF su una traccia di arrivi'], ['cslez5_3_04_scheduling', 'Round-robin con quanto di tempo'], ['cslez5_3_05_scheduling', 'Priorità, attese e invecchiamento']] },
      { id: '5.4', breve: 'Thread', titolo: 'Thread, concorrenza ed esecuzione parallela', sim: 'thread', stato: 'nuovo', prova: true,
        guida: 'Un processo può contenere più flussi di istruzioni che condividono la memoria. Il capitolo mostra che cosa i thread hanno in comune e che cosa no, distingue la concorrenza dal parallelismo, spiega chi li mette in esecuzione, come si creano e si attendono, e che cosa si rischia a tenerli nello stesso processo.',
        unita: [
          { id: '5.4.1', titolo: 'Memoria condivisa e registri dei thread', sim: 'thread', scopo: 'Una cella comune, e i registri che restano privati.' },
          { id: '5.4.2', titolo: 'Concorrenza ed esecuzione simultanea', sim: 'cpu', scopo: 'Vite che si sovrappongono, e core che lavorano insieme.' },
          { id: '5.4.3', titolo: 'Chi decide quale thread eseguire?', sim: 'strati', scopo: 'Thread del programma e thread del kernel, e come si associano.' },
          { id: '5.4.4', titolo: 'Argomenti e raccolta dei thread POSIX', sim: 'puntatore', scopo: 'Che cosa legge un thread attraverso il puntatore ricevuto.' },
          { id: '5.4.5', titolo: 'Isolamento dei guasti in processi e thread', sim: 'scudo', scopo: 'Chi cade quando un lavoratore sbaglia.' }
        ],
        sfide: [['cslez5_4_01_threads', 'Risorse condivise e stato privato'], ['cslez5_4_02_threads', 'Concorrenza, parallelismo e isolamento'], ['cslez5_4_03_threads', 'Modelli di associazione tra thread'], ['cslez5_4_04_threads', 'Creazione, join e durata degli argomenti'], ['cslez5_4_05_threads', 'Stack, cambi di thread e isolamento dei guasti']] },
      { id: '5.5', breve: 'Sezioni critiche', titolo: 'Stato condiviso, sezioni critiche e semafori', sim: 'lucchetto', stato: 'nuovo', prova: true,
        guida: 'Quando più thread toccano gli stessi dati, l’esito può dipendere da chi arriva prima. Il capitolo parte dall’incremento perso, costruisce la sezione critica e il mutex, distingue atomicità e visibilità, confronta i modi di aspettare un lock, e arriva ai semafori e al confronto e scambio.',
        unita: [
          { id: '5.5.1', titolo: 'Intercalazioni e aggiornamenti persi', sim: 'conflitto', scopo: 'Due incrementi, e uno che sparisce.' },
          { id: '5.5.2', titolo: 'Scegliere i confini della sezione critica', sim: 'lucchetto', scopo: 'Proteggere la sola scrittura non basta.' },
          { id: '5.5.3', titolo: 'Un contatore completo protetto da mutex', sim: 'bilancio', scopo: 'Nessun incremento perso, e un totale letto a lavori finiti.' },
          { id: '5.5.4', titolo: 'Atomicità, visibilità e ordinamento', sim: 'lente', scopo: 'Quando una scrittura è sicuramente visibile a un altro thread.' },
          { id: '5.5.5', titolo: 'Attesa attiva, sospensione e proprietà del lock', sim: 'cpu', scopo: 'Aspettare girando, oppure dormendo.' },
          { id: '5.5.6', titolo: 'Permessi dei semafori e ordine degli eventi', sim: 'semaforo', scopo: 'Contatore e coda, dopo ogni wait e ogni signal.' },
          { id: '5.5.7', titolo: 'Aggiornamenti condizionati e granularità dei lock', sim: 'conflitto', scopo: 'L’ultima poltrona, e due clienti che la vogliono.' }
        ],
        sfide: [['cslez5_5_01_semaphores', 'Corse sui dati e aggiornamenti persi'], ['cslez5_5_02_semaphores', 'Proprietà di una sezione critica'], ['cslez5_5_03_semaphores', 'Stato del semaforo durante wait e signal'], ['cslez5_5_04_semaphores', 'Semafori per precedenze e risorse'], ['cslez5_5_05_semaphores', 'Errori di sincronizzazione']] },
      { id: '5.6', breve: 'Problemi classici', titolo: 'Semafori contatori e problemi classici di sincronizzazione', sim: 'semaforo', stato: 'nuovo', prova: true,
        guida: 'Tre schemi tornano in ogni sistema concorrente: il buffer limitato fra produttore e consumatore, l’attesa di una condizione, lettori e scrittori. Il capitolo li ricava dalle loro proprietà, e in ciascuno mostra l’errore tipico: un ordine di acquisizione sbagliato, un controllo saltato, un’attesa senza limite. Si chiude con la regola che impedisce a due lock di bloccarsi a vicenda.',
        unita: [
          { id: '5.6.1', titolo: 'Derivare il buffer limitato dai suoi invarianti', sim: 'semaforo', scopo: 'Vuoti, pieni, e un permesso in viaggio fra i due.' },
          { id: '5.6.2', titolo: 'L’ordine di acquisizione nella dimostrazione di correttezza', sim: 'stallo', scopo: 'Prima il semaforo, poi il mutex.' },
          { id: '5.6.3', titolo: 'Attendere una condizione sotto mutex', sim: 'lente', scopo: 'Dopo il risveglio si controlla di nuovo.' },
          { id: '5.6.4', titolo: 'Lettori e scrittori: sicurezza e politica di ammissione', sim: 'tabella', scopo: 'Chi entra, quando uno scrittore aspetta.' },
          { id: '5.6.5', titolo: 'Dagli invarianti locali all’ordinamento globale delle risorse', sim: 'lucchetto', scopo: 'Un rango per ogni lock.' }
        ],
        sfide: [['cslez5_6_01_classical_sync', 'Condizioni e risorse nel produttore-consumatore'], ['cslez5_6_02_classical_sync', 'Sequenza delle operazioni sul buffer'], ['cslez5_6_03_classical_sync', 'Posti occupati, prenotazioni e blocchi'], ['cslez5_6_04_classical_sync', 'Accesso di lettori e scrittori'], ['cslez5_6_05_classical_sync', 'Uscita dei lettori e accesso equo']] },
      { id: '5.7', breve: 'Deadlock', titolo: 'Deadlock, starvation e livelock', sim: 'stallo', stato: 'nuovo', prova: true,
        guida: 'Il capitolo affronta il deadlock con metodo. Lo descrive con un grafo, ne elenca le quattro condizioni necessarie, e presenta le tre strategie per trattarlo: prevenirlo con una regola, evitarlo controllando ogni concessione, oppure rilevarlo e rimediare. Si chiude distinguendolo dai suoi due parenti, la starvation e il livelock.',
        unita: [
          { id: '5.7.1', titolo: 'Il deadlock come struttura di dipendenze', sim: 'stallo', scopo: 'Un grafo, un ciclo, e chi può scioglierlo.' },
          { id: '5.7.2', titolo: 'Le condizioni di Coffman e la prevenzione', sim: 'scudo', scopo: 'Quattro condizioni: basta toglierne una.' },
          { id: '5.7.3', titolo: 'Evitamento e sequenze sicure di completamento', sim: 'bilancio', scopo: 'Concedere soltanto se resta una via d’uscita.' },
          { id: '5.7.4', titolo: 'Rilevamento e recupero', sim: 'journal', scopo: 'Trovare il ciclo, e annullare una transazione.' },
          { id: '5.7.5', titolo: 'Distinguere starvation e livelock nelle tracce', sim: 'lente', scopo: 'Due contatori per una diagnosi.' }
        ],
        sfide: [['cslez5_7_01_deadlock', 'Stallo, attesa indefinita e livelock'], ['cslez5_7_02_deadlock', 'Condizioni di Coffman'], ['cslez5_7_03_deadlock', 'Cicli nel grafo delle risorse'], ['cslez5_7_04_deadlock', 'Prevenzione e ordine di acquisizione'], ['cslez5_7_05_deadlock', 'Stati sicuri, rilevamento e recupero']] }
    ] },
    { k: '6', r: 'VI', breve: 'Memoria e file', nome: 'Memoria, file e protezione', sim: 'memory', capitoli: [
      { id: '6.1', breve: 'Gerarchie di memoria', titolo: 'Gerarchie di memoria e località', sim: 'cache', stato: 'nuovo', prova: true,
        guida: 'Il modulo comincia dalla memoria vista dal processore. Nessuna memoria è insieme grande e veloce, e i calcolatori ne usano diverse, disposte a livelli. Il capitolo spiega perché lo schema funziona, segue lo stato di una piccola cache lettura dopo lettura, e arriva a un numero solo per giudicarla: il tempo medio di accesso.',
        unita: [
          { id: '6.1.1', titolo: 'Perché le memorie formano una gerarchia', sim: 'strati', scopo: 'Due letture: una dalla cache, una dalla RAM.' },
          { id: '6.1.2', titolo: 'Località e stato di una cache', sim: 'cache', scopo: 'Blocco, indice e tag, lettura dopo lettura.' },
          { id: '6.1.3', titolo: 'Tempo medio di accesso e ipotesi del modello', sim: 'clock', scopo: 'Cento letture, e la loro media.' }
        ],
        sfide: [['cslez6_1_01_memory_technologies', 'Tecnologie di memoria'], ['cslez6_1_02_locality', 'Località'], ['cslez6_1_03_cache_behavior', 'Comportamento della cache'], ['cslez6_1_04_cache_performance', 'Prestazioni della cache'], ['cslez6_1_05_hierarchy_design', 'Progetto della gerarchia di memoria']] },
      { id: '6.2', breve: 'Memoria virtuale', titolo: 'Memoria virtuale e paginazione su richiesta', sim: 'strati', stato: 'nuovo', prova: true,
        guida: 'Ogni processo crede di avere la memoria tutta per sé. Il capitolo apre la tabella che rende possibile l’illusione: come un indirizzo virtuale diventa fisico, che cosa accade quando una pagina manca dalla RAM, chi esce quando i frame finiscono, e quanto costa, in media, ogni page fault.',
        unita: [
          { id: '6.2.1', titolo: 'Spazi di indirizzamento, pagine e frame', sim: 'tabella', scopo: 'Lo stesso indirizzo, in due processi.' },
          { id: '6.2.2', titolo: 'Residenza, eccezioni e paginazione su richiesta', sim: 'interrupt', scopo: 'La pagina manca: caricarla, oppure rifiutare.' },
          { id: '6.2.3', titolo: 'Insieme di lavoro e rimpiazzo', sim: 'memory', scopo: 'Sette richieste, pochi frame.' },
          { id: '6.2.4', titolo: 'Valutare il costo dei page fault', sim: 'clock', scopo: 'Un evento raro che pesa su tutte le richieste.' }
        ],
        sfide: [['cslez6_2_01_address_spaces', 'Spazi di indirizzi'], ['cslez6_2_02_paging', 'Paginazione'], ['cslez6_2_03_page_tables', 'Tabelle delle pagine'], ['cslez6_2_04_page_faults', 'Errori di pagina'], ['cslez6_2_05_working_set', 'Insieme di lavoro']] },
      { id: '6.3', breve: 'Traduzione in codice', titolo: 'Traduzione degli indirizzi in codice', sim: 'hex', stato: 'nuovo', prova: true,
        guida: 'La tabella delle pagine smette di essere un disegno e diventa un array in memoria, letto da un programma. Il capitolo ne segue la traduzione numero per numero, decodifica le voci secondo il loro formato, esegue riga per riga una routine in assembly, e controlla le richieste che attraversano un confine di pagina.',
        unita: [
          { id: '6.3.1', titolo: 'Rappresentare una mappatura in un programma', sim: 'tabella', scopo: 'Indice, indirizzo della voce, valore letto.' },
          { id: '6.3.2', titolo: 'Formato e validità delle voci', sim: 'bit', scopo: 'La stessa parola, letta in due modi.' },
          { id: '6.3.3', titolo: 'Implementare il calcolo dell’indirizzo', sim: 'terminale', scopo: 'Una routine in assembly, riga per riga.' },
          { id: '6.3.4', titolo: 'Valori di errore, limiti e funzioni eseguibili', sim: 'scudo', scopo: 'Otto byte a cavallo di due pagine.' }
        ],
        sfide: [['cslez6_3_01_vpn_offset', 'VPN e offset'], ['cslez6_3_02_compose_pa_assembly', 'Composizione dell’indirizzo fisico in assembly'], ['cslez6_3_03_page_table_lookup_assembly', 'Lettura di una voce della tabella in assembly'], ['cslez6_3_04_page_table_control', 'Controllo della traduzione'], ['cslez6_3_05_address_translation_assembly', 'Traduzione completa in assembly']] },
      { id: '6.4', breve: 'TLB e tabelle', titolo: 'TLB e tabelle delle pagine multilivello', sim: 'tabella', stato: 'nuovo', prova: true,
        guida: 'Tradurre ogni indirizzo leggendo una tabella sarebbe lento, e una tabella completa sarebbe enorme. Il capitolo presenta i due rimedi e il loro prezzo: la TLB, che ricorda le traduzioni recenti, e le tabelle a più livelli, che occupano poco spazio e richiedono più letture. Alla fine mette i conti insieme nel tempo medio di un accesso.',
        unita: [
          { id: '6.4.1', titolo: 'Memorizzare le traduzioni nella TLB', sim: 'cache', scopo: 'Tre richieste, due processi, pochi posti.' },
          { id: '6.4.2', titolo: 'Perché una tabella lineare diventa grande', sim: 'tabella', scopo: 'Otto milioni di byte, oppure ventiquattromila.' },
          { id: '6.4.3', titolo: 'Una traduzione simulata a due livelli', sim: 'strati', scopo: 'Due letture in catena, e poi il dato.' },
          { id: '6.4.4', titolo: 'Costo della traduzione e ipotesi sui tempi', sim: 'clock', scopo: 'Quanto pesa un miss della TLB.' }
        ],
        sfide: [['cslez6_4_01_tlb_behavior', 'Comportamento della TLB'], ['cslez6_4_02_tlb_lookup_assembly', 'Ricerca nella TLB in assembly'], ['cslez6_4_03_multilevel_indexes', 'Indici delle tabelle multilivello'], ['cslez6_4_04_two_level_walk_assembly', 'Percorso nelle tabelle a due livelli in assembly'], ['cslez6_4_05_translation_cost', 'Costo della traduzione']] },
      { id: '6.5', breve: 'File e nomi', titolo: 'File, nomi e allocazione', sim: 'folder', stato: 'nuovo', prova: true,
        guida: 'Dalla memoria si passa al disco. Un file system trasforma una fila di blocchi numerati in file con un nome. Il capitolo separa le tre cose che compongono un file, cioè nome, inode e dati, risolve i percorsi un componente alla volta, e mostra come i blocchi vengono assegnati ai file e come si tiene il conto di quelli liberi.',
        unita: [
          { id: '6.5.1', titolo: 'File, metadati e nomi nelle directory', sim: 'inode', scopo: 'Due nomi, un inode, gli stessi dati.' },
          { id: '6.5.2', titolo: 'Risolvere un percorso', sim: 'folder', scopo: 'Lo stesso percorso da due directory.' },
          { id: '6.5.3', titolo: 'Allocare i blocchi', sim: 'storage', scopo: 'Un byte in più, un blocco in più.' },
          { id: '6.5.4', titolo: 'Spazio libero e contabilità dell’allocazione', sim: 'bit', scopo: 'Una bitmap e due catene.' }
        ],
        sfide: [['cslez6_5_01_files_metadata', 'File e metadati'], ['cslez6_5_02_path_resolution', 'Risoluzione dei percorsi'], ['cslez6_5_03_links', 'Collegamenti ai file'], ['cslez6_5_04_space_allocation', 'Allocazione dello spazio'], ['cslez6_5_05_inode_fat', 'Inode e FAT']] },
      { id: '6.6', breve: 'Consistenza e recupero', titolo: 'Consistenza e recupero dopo un arresto', sim: 'journal', stato: 'nuovo', prova: true,
        guida: 'Un file system vive su un dispositivo che può perdere la corrente in qualunque istante. Il capitolo guarda che cosa resta sul disco quando un’operazione viene interrotta a metà, come un verificatore ricostruisce e ripara le strutture, e come un journal rende ogni aggiornamento tutto compiuto oppure mai cominciato. Si chiude con il conto delle scritture che questa garanzia richiede.',
        unita: [
          { id: '6.6.1', titolo: 'Perché la persistenza richiede un modello di consistenza', sim: 'storage', scopo: 'Tre scritture, e un crash a metà.' },
          { id: '6.6.2', titolo: 'Ricostruzione e riparazione', sim: 'lente', scopo: 'Un bit e un proprietario in disaccordo.' },
          { id: '6.6.3', titolo: 'Journal redo e soglia del commit durevole', sim: 'journal', scopo: 'Due blocchi, un commit, cinque punti di arresto.' },
          { id: '6.6.4', titolo: 'Journaling di dati e metadati: garanzie e costi', sim: 'bilancio', scopo: 'Due modalità, due conti.' }
        ],
        sfide: [['cslez6_6_01_consistency', 'Consistenza del file system'], ['cslez6_6_02_fsck', 'Controllo con fsck'], ['cslez6_6_03_write_order', 'Ordine delle scritture'], ['cslez6_6_04_journaling', 'Registro delle modifiche e commit'], ['cslez6_6_05_crash_recovery', 'Recupero dopo un arresto']] },
      { id: '6.7', breve: 'Protezione e audit', titolo: 'Protezione, cifratura e audit', sim: 'chiave', stato: 'nuovo', prova: true,
        guida: 'L’ultimo capitolo riguarda chi può fare che cosa sui dati, e come lo si accerta. Si separano l’identità di chi chiede e i diritti che le spettano, si seguono i controlli di permesso lungo un percorso, si guarda che cosa protegge la cifratura quando il disco esce dalla macchina, e si impara a leggere un registro delle richieste senza attribuirgli più di quanto contenga.',
        unita: [
          { id: '6.7.1', titolo: 'Autenticazione e autorizzazione sul fascicolo', sim: 'chiave', scopo: 'Riconosciuto, e respinto.' },
          { id: '6.7.2', titolo: 'Controlli sulle directory e sugli oggetti', sim: 'folder', scopo: 'Un nome noto, un elenco chiuso.' },
          { id: '6.7.3', titolo: 'Cifratura e posizione dell’avversario', sim: 'disco', scopo: 'Lo stesso documento, da tre posizioni.' },
          { id: '6.7.4', titolo: 'Evidenze di audit e loro interpretazione', sim: 'tabella', scopo: 'Cinque righe, tre criteri.' }
        ],
        sfide: [['cslez6_7_01_protection_goals', 'Obiettivi di protezione'], ['cslez6_7_02_acl', 'Liste di controllo degli accessi'], ['cslez6_7_03_directory_access', 'Accesso alle directory'], ['cslez6_7_04_cryptofs', 'Cifratura del file system'], ['cslez6_7_05_auditing', 'Verifica del registro degli accessi']] }
    ] }
  ];

  // Elenco piatto delle unità nel nuovo formato, nell'ordine consigliato.
  const piatte = [];
  SL.corso.forEach((mod) => mod.capitoli.forEach((cap) => {
    if (cap.stato !== 'nuovo') return;
    if (cap.diretta) piatte.push({ id: cap.id, titolo: cap.titolo, sim: cap.sim, scopo: cap.scopo, mod, cap });
    else cap.unita.forEach((u) => piatte.push({ id: u.id, titolo: u.titolo, sim: u.sim, scopo: u.scopo, mod, cap }));
  }));
  SL.unitaNuove = piatte;
  SL.trovaUnita = (id) => {
    const i = piatte.findIndex((u) => u.id === id);
    return i < 0 ? null : Object.assign({ prima: piatte[i - 1] || null, dopo: piatte[i + 1] || null, ordine: i }, piatte[i]);
  };
  SL.trovaCapitolo = (id) => {
    for (const mod of SL.corso) for (const cap of mod.capitoli) if (cap.id === id) return { mod, cap };
    return null;
  };
  SL.apriCapitolo = (cap) => cap.stato !== 'nuovo' ? 'classico.html#laboratorio/' + cap.id : (cap.diretta ? '#/u/' + cap.id : '#/c/' + cap.id);
})();
