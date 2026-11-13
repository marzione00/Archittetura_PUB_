'use strict';
/* Mappa del corso. stato 'nuovo': capitolo riscritto nel nuovo formato;
   stato 'classico': capitolo ancora servito dalla versione precedente del sito (classico.html). */
(() => {
  const classico = (id, breve, titolo, sim) => ({ id, breve, titolo, sim, stato: 'classico' });
  SL.corso = [
    { k: '0', r: '0', breve: 'Orientarsi', nome: 'Orientarsi', sim: 'esperimento', capitoli: [
      { id: '0.1', breve: 'Che cos’è un calcolatore', titolo: 'Che cos’è un calcolatore', sim: 'cpu', stato: 'nuovo', diretta: true,
        scopo: 'Le quattro parti di ogni calcolatore e il viaggio di un dato dall’ingresso all’uscita.' },
      { id: '0.2', breve: 'Programmi e dati', titolo: 'Programmi e dati', sim: 'operation', stato: 'nuovo', diretta: true,
        scopo: 'Che cosa distingue un elenco di istruzioni dai valori su cui le istruzioni lavorano.' },
      { id: '0.3', breve: 'Cifre e posti', titolo: 'Cifre e posti', sim: 'puntatore', stato: 'nuovo', diretta: true,
        scopo: 'Perché la stessa cifra vale di più quando si sposta verso sinistra.' },
      { id: '0.4', breve: 'Usare il laboratorio', titolo: 'Come si usa il laboratorio', sim: 'riproduci', stato: 'nuovo', diretta: true,
        scopo: 'Le cinque fasi di ogni unità e i comandi degli esperimenti, provati su un caso semplice.' }
    ] },
    { k: '1', r: 'I', breve: 'Dati', nome: 'Rappresentazione dei dati', sim: 'bit', capitoli: [
      { id: '1.1', breve: 'Vita di un programma', titolo: 'Il calcolatore e la vita di un programma', sim: 'terminale', stato: 'nuovo', prova: true,
        guida: 'Si segue un programma piccolissimo dal testo scritto dal programmatore fino alla riga che compare sullo schermo.',
        unita: [
          { id: '1.1.1', titolo: 'Un programma, diversi livelli', sim: 'terminale', scopo: 'Il cammino di una riga di testo dal programma alla sua destinazione.' },
          { id: '1.1.2', titolo: 'La macchina fisica sotto le astrazioni', sim: 'memory', scopo: 'Come il processore trova un dato in memoria usando un indirizzo.' },
          { id: '1.1.3', titolo: 'Dal sorgente al file eseguibile', sim: 'operation', scopo: 'Le quattro trasformazioni che portano dal testo del programma a un file avviabile.' },
          { id: '1.1.4', titolo: 'Nomi, file e shell', sim: 'folder', scopo: 'Come un percorso scritto a parole conduce a un file preciso.' },
          { id: '1.1.5', titolo: 'Dal file eseguibile al processo', sim: 'process', scopo: 'Che cosa accade fra il comando digitato e il programma in esecuzione.' },
          { id: '1.1.6', titolo: 'Seguire hello attraverso il sistema', sim: 'file', scopo: 'L’uscita dello stesso programma mandata allo schermo oppure in un file.' }
        ],
        sfide: [['lez01_01_layers_order', 'Livelli di astrazione e percorso dei dati'], ['lez01_02_hardware_roles', 'Componenti hardware e loro funzioni'], ['lez01_03_special_paths', 'Nomi e percorsi nel file system'], ['lez01_04_filesystem_ops', 'Operazioni elementari sui file'], ['lez01_05_build_pipeline', 'Dal sorgente C al programma eseguibile']] },
      { id: '1.2', breve: 'Binario ed esadecimale', titolo: 'Rappresentazione binaria ed esadecimale', sim: 'byte', stato: 'nuovo', prova: true,
        guida: 'Si impara a leggere e a scrivere un numero con le sole cifre 0 e 1, e a riassumere otto bit con due simboli esadecimali.',
        unita: [
          { id: '1.2.1', titolo: 'Dagli stati fisici ai simboli binari', sim: 'bit', scopo: 'Come una tensione misurata su un filo diventa uno 0 oppure un 1.' },
          { id: '1.2.2', titolo: 'Notazione posizionale ed esadecimale', sim: 'hex', scopo: 'Leggere e scrivere un byte in binario e in esadecimale.' },
          { id: '1.2.3', titolo: 'Memoria a byte e ordine dei byte', sim: 'byte', scopo: 'Come un numero di quattro byte viene distribuito su quattro indirizzi.' },
          { id: '1.2.4', titolo: 'Leggere i byte e dichiararne il significato', sim: 'char', scopo: 'Perché gli stessi byte possono essere un numero oppure un testo.' }
        ],
        sfide: [['lez02_01_voltage_to_bits', 'Bit, byte e capacità di rappresentazione'], ['lez02_02_dec_to_bin', 'Dal decimale al binario'], ['lez02_03_bin_to_hex', 'Dal binario all’esadecimale'], ['lez02_04_hex_to_dec', 'Dall’esadecimale al decimale'], ['lez02_05_utf8_bytes_and_ascii', 'Byte occupati da ASCII e UTF-8']] },
      { id: '1.3', breve: 'Testo, immagini, suoni', titolo: 'Codificare testo, immagini e suoni', sim: 'char', stato: 'nuovo', prova: true,
        guida: 'Si scopre come immagini, caratteri di ogni lingua e suoni diventano file di byte, e come un lettore prudente li rilegge.',
        unita: [
          { id: '1.3.1', titolo: 'La codifica come accordo tra significato e byte', sim: 'pixel', scopo: 'Come un’immagine diventa una fila di byte, e come ritrovarvi un colore.' },
          { id: '1.3.2', titolo: 'Unicode, punti di codice e UTF-8', sim: 'char', scopo: 'Perché una lettera accentata occupa due byte, e come si ricostruisce il suo numero.' },
          { id: '1.3.3', titolo: 'Dimensionare una registrazione PCM', sim: 'suono', scopo: 'Quanti byte occupa un suono, noti frequenza, canali, profondità e durata.' },
          { id: '1.3.4', titolo: 'Formati binari, validazione e contesto', sim: 'scudo', scopo: 'Perché una lunghezza dichiarata va verificata prima di essere usata.' },
          { id: '1.3.5', titolo: 'Un metodo per decodificare i dati', sim: 'lente', scopo: 'Cinque domande, sempre nello stesso ordine, per leggere qualunque campo.' }
        ],
        sfide: [['lez03_01_same_bits_two_meanings', 'Interpretare una sequenza di bit'], ['lez03_02_ascii_hex_string', 'Stringhe ASCII in esadecimale'], ['lez03_03_utf8_decode', 'Lunghezza e struttura delle sequenze UTF-8'], ['lez03_04_rgb_image_size', 'Immagini RGB e indirizzi dei pixel'], ['lez03_05_multi_interpretation', 'Formato e interpretazione dei dati']] },
      { id: '1.4', breve: 'Interi con segno', titolo: 'Interi con segno e complemento a due', sim: 'segno', stato: 'nuovo', prova: true,
        guida: 'Si impara a scrivere i numeri negativi in un byte, a sommarli e a riconoscere quando il risultato non entra più.',
        unita: [
          { id: '1.4.1', titolo: 'Il complemento a due a larghezza fissata', sim: 'segno', scopo: 'Come un byte rappresenta i numeri da −128 a 127.' },
          { id: '1.4.2', titolo: 'Somma, sottrazione e overflow', sim: 'operation', scopo: 'Sommare due byte e capire se il risultato rimasto è quello giusto.' },
          { id: '1.4.3', titolo: 'Il linguaggio C: rappresentazione, operazioni e conversioni', sim: 'tabella', scopo: 'Che cosa accade ai bit quando un numero cambia tipo.' },
          { id: '1.4.4', titolo: 'Controllare l’aritmetica prima dell’operazione', sim: 'scudo', scopo: 'Stabilire in anticipo se un prodotto entrerà nella destinazione.' }
        ],
        sfide: [['lez04_01_encode_negative_twos', 'Codificare interi negativi'], ['lez04_02_decode_twos', 'Decodificare il complemento a due'], ['lez04_03_signed_range', 'Intervallo degli interi con segno'], ['lez04_04_fixed_width_add_sub', 'Somma e sottrazione a larghezza fissa'], ['lez04_05_overflow_detector', 'Rilevare il traboccamento']] },
      { id: '1.5', breve: 'Circuiti booleani', titolo: 'Circuiti booleani e calcolo a livello di bit', sim: 'porta', stato: 'nuovo', prova: true,
        guida: 'Si parte da tre porte elementari e si arriva a un circuito che somma due numeri, passando per maschere, ritardi e byte di stato.',
        unita: [
          { id: '1.5.1', titolo: 'Funzioni booleane e porte elementari', sim: 'porta', scopo: 'Che cosa calcolano AND, OR, NOT e XOR, da sole e in cascata.' },
          { id: '1.5.2', titolo: 'Dalla tabella di verità al circuito', sim: 'tabella', scopo: 'Una ricetta che trasforma qualunque tabella in un circuito.' },
          { id: '1.5.3', titolo: 'Vettori di bit, maschere e operatori del C', sim: 'byte', scopo: 'Leggere, accendere, spegnere e rovesciare i bit di un byte.' },
          { id: '1.5.4', titolo: 'Tempi, propagazione e impulsi transitori', sim: 'clock', scopo: 'Perché un circuito può sbagliare per qualche istante.' },
          { id: '1.5.5', titolo: 'Dalle porte all’aritmetica', sim: 'alu', scopo: 'Come cinque porte sommano una colonna, e una fila di esse un numero.' },
          { id: '1.5.6', titolo: 'Ragionamento booleano nel codice di sistema', sim: 'flag', scopo: 'Interrogare un byte di stato senza confondere «tutti» con «almeno uno».' }
        ],
        sfide: [['lez05_01_single_gate', 'Calcolare l’uscita delle porte'], ['lez05_02_bitwise_on_bytes', 'Operazioni bit a bit su un byte'], ['lez05_03_identify_gate', 'Riconoscere una porta dalla sua tabella'], ['lez05_04_c_bitwise_expression', 'Espressioni e maschere in C'], ['lez05_05_truth_table_rows', 'Costruire una tabella di verità']] },
      { id: '1.6', breve: 'Virgola mobile', titolo: 'Numeri frazionari e virgola mobile IEEE 754', sim: 'virgola', stato: 'nuovo', prova: true,
        guida: 'Si passa dai numeri interi a quelli con la virgola, e si scopre perché un calcolatore li conserva quasi sempre con un piccolo errore.',
        unita: [
          { id: '1.6.1', titolo: 'Frazioni binarie, scala e precisione', sim: 'virgola', scopo: 'Scrivere in binario un numero con la virgola, un raddoppio alla volta.' },
          { id: '1.6.2', titolo: 'Il formato IEEE 754', sim: 'tabella', scopo: 'Smontare una parola di 32 bit in segno, esponente e significando.' },
          { id: '1.6.3', titolo: 'Arrotondamento, distanza tra valori e programmi', sim: 'lente', scopo: 'Perché a un numero grande non si riesce ad aggiungere uno.' },
          { id: '1.6.4', titolo: 'Dal formato IEEE al percorso dei dati in virgola mobile', sim: 'alu', scopo: 'Le quattro mosse con cui il processore somma due numeri con la virgola.' }
        ],
        sfide: [['lez06_01_fractional_binary', 'Frazioni binarie e pesi posizionali'], ['lez06_02_exact_or_approx', 'Rappresentazione esatta e approssimazione'], ['lez06_03_normalize_binary', 'Normalizzazione ed esponente con bias'], ['lez06_04_ieee754_single_decode', 'Leggere un numero IEEE 754 a precisione singola'], ['lez06_05_c_float_pitfalls', 'Precisione delle operazioni in C']] },
      { id: '1.7', breve: 'Casi integrati', titolo: 'Casi integrati: dai byte al comportamento', sim: 'input', stato: 'nuovo', prova: true,
        guida: 'Le regole dei capitoli precedenti si incontrano in un solo messaggio. Lo si legge campo per campo, e si decide che cosa farne.',
        unita: [
          { id: '1.7.1', titolo: 'Un metodo per interpretare dati binari reali', sim: 'tabella', scopo: 'Leggere un record un campo alla volta, fermandosi dove i byte finiscono.' },
          { id: '1.7.2', titolo: 'Un record di telemetria, cinque regole di rappresentazione', sim: 'strati', scopo: 'Cinque campi, cinque regole di lettura nello stesso messaggio.' },
          { id: '1.7.3', titolo: 'Dai valori decodificati all’uso sicuro delle risorse', sim: 'memory', scopo: 'Controllare un conto prima di riservare la memoria che chiede.' },
          { id: '1.7.4', titolo: 'La politica di accesso come livello di rappresentazione', sim: 'privilegi', scopo: 'Un byte di permessi: prima la forma, poi la decisione.' },
          { id: '1.7.5', titolo: 'Risultati numerici e scelta della rappresentazione', sim: 'virgola', scopo: 'Sommare dieci centesimi dieci volte, in due modi diversi.' },
          { id: '1.7.6', titolo: 'Dalla sintassi della shell ai byte di un comando', sim: 'terminale', scopo: 'Chi apre il file e chi lo legge, in un comando con il segno <.' },
          { id: '1.7.7', titolo: 'Laboratorio conclusivo', sim: 'esperimento', scopo: 'Una misura codificata, alterata e riletta: quale controllo la ferma.' }
        ],
        sfide: [] }
    ] },
    { k: '2', r: 'II', breve: 'x86-64', nome: 'Programmazione x86-64', sim: 'register', capitoli: [
      { id: '2.1', breve: 'Registri e memoria', titolo: 'Stato della macchina, registri e memoria', sim: 'memory', stato: 'nuovo', prova: true,
        guida: 'Si scende al livello delle istruzioni del processore: che cosa contiene la macchina in ogni istante, e come una riga di assembly lo trasforma.',
        unita: [
          { id: '2.1.1', titolo: 'Stato architetturale ed esecuzione', sim: 'register', scopo: 'Due istruzioni seguite mossa per mossa: lettura, esecuzione, avanzamento.' },
          { id: '2.1.2', titolo: 'Registri, indirizzi e memoria', sim: 'strati', scopo: 'Un registro, quattro nomi: che cosa cambia scrivendo in ciascuno.' },
          { id: '2.1.3', titolo: 'Lettura di brevi sequenze di istruzioni', sim: 'tabella', scopo: 'Compilare la traccia di quattro istruzioni su due registri.' },
          { id: '2.1.4', titolo: 'Stato architetturale, implementazione e prestazioni', sim: 'clock', scopo: 'Lo stesso programma su una, due o tre ALU: stesso risultato, tempi diversi.' }
        ],
        sfide: [['cslez2_1_01_random_assembly_01', 'Registri, ALU e unità di controllo'], ['cslez2_1_02_random_assembly_02', 'Periodo di clock, cicli e CPI'], ['cslez2_1_03_random_assembly_03', 'Tecnologie della gerarchia di memoria'], ['cslez2_1_04_random_assembly_04', 'Cache, indirizzi e località'], ['cslez2_1_05_random_assembly_05', 'Bus, indirizzi e trasferimenti di dati']] },
      { id: '2.2', breve: 'Aritmetica e flag', titolo: 'Aritmetica intera e flag di condizione', sim: 'flag', stato: 'nuovo', prova: true,
        guida: 'Somme, prodotti, divisioni e confronti come li esegue il processore: su una larghezza fissa, con i flag che ne riassumono l’esito.',
        unita: [
          { id: '2.2.1', titolo: 'Larghezza, segno e aritmetica a precisione fissa', sim: 'flag', scopo: 'Una somma, due letture dei bit, due flag che le giudicano.' },
          { id: '2.2.2', titolo: 'Un’espressione in tre registri: a × b + c', sim: 'operation', scopo: 'Tre argomenti nei registri, tre istruzioni, un risultato in EAX.' },
          { id: '2.2.3', titolo: 'Moltiplicazione, divisione e calcolo dell’indirizzo efficace', sim: 'alu', scopo: 'Quoziente e resto in due registri, e che cosa accade dividendo per zero.' },
          { id: '2.2.4', titolo: 'Combinare i fattori di scala: 7a + 3b − 4', sim: 'tabella', scopo: 'Moltiplicare per sette e per tre senza usare la moltiplicazione.' },
          { id: '2.2.5', titolo: 'Leggere il contratto di un’istruzione', sim: 'lente', scopo: 'Due istruzioni che scrivono lo stesso numero e lasciano flag diversi.' },
          { id: '2.2.6', titolo: 'Flag di condizione e larghezza', sim: 'segno', scopo: 'Una sottrazione e i suoi quattro flag, a otto e a sedici bit.' },
          { id: '2.2.7', titolo: 'Traduzione completa di un calcolo aritmetico', sim: 'bilancio', scopo: 'Una funzione intera: calcolo, confronto, salto e valore restituito.' }
        ],
        sfide: [['cslez2_2_01_random_assembly_01', 'Copia e aritmetica nei registri'], ['cslez2_2_02_random_assembly_02', 'Incrementi, somme e combinazioni lineari'], ['cslez2_2_03_random_assembly_03', 'Differenze e operazioni logiche'], ['cslez2_2_04_random_assembly_04', 'Complemento, scorrimenti e uguaglianza'], ['cslez2_2_05_random_assembly_05', 'Confronti e selezione condizionale']] },
      { id: '2.3', breve: 'Indirizzi e array', titolo: 'Indirizzi, array e disposizione dei dati', sim: 'puntatore', stato: 'nuovo', prova: true,
        guida: 'Dove stanno i dati in memoria e come un’istruzione li raggiunge: ampiezza degli accessi, indirizzi calcolati, array, strutture e puntatori.',
        unita: [
          { id: '2.3.1', titolo: 'Indirizzi, valori e ampiezza degli accessi', sim: 'memory', scopo: 'Dallo stesso indirizzo, numeri diversi secondo quanti byte si leggono.' },
          { id: '2.3.2', titolo: 'Formare un indirizzo efficace', sim: 'puntatore', scopo: 'Dall’indice di un elemento al suo indirizzo, su una linea graduata in byte.' },
          { id: '2.3.3', titolo: 'Array e matrici contigue', sim: 'tabella', scopo: 'Una tabella di righe e colonne distesa in una fila sola di celle.' },
          { id: '2.3.4', titolo: 'Strutture, allineamento e riempimento', sim: 'byte', scopo: 'Tre membri, sei ordini possibili, e i byte vuoti che ne derivano.' },
          { id: '2.3.5', titolo: 'Validità degli oggetti e aliasing', sim: 'scudo', scopo: 'Due puntatori, una scrittura, e una lettura che può vederla oppure no.' },
          { id: '2.3.6', titolo: 'Codificare e riconoscere i calcoli di indirizzo', sim: 'lente', scopo: 'Tre byte di codice macchina aperti fino ai campi di scala, indice e base.' }
        ],
        sfide: [['cslez2_3_01_random_assembly_01', 'Caricamenti di diversa larghezza'], ['cslez2_3_02_random_assembly_02', 'Scritture e calcolo di indirizzi con LEA'], ['cslez2_3_03_random_assembly_03', 'Indici, spiazzamenti e doppia indirezione'], ['cslez2_3_04_random_assembly_04', 'Scambi e aggiornamenti di elementi'], ['cslez2_3_05_random_assembly_05', 'Estremi di array, larghezze e indici']] },
      { id: '2.4', breve: 'Maschere e scorrimenti', titolo: 'Operazioni bit a bit, scorrimenti e maschere', sim: 'operation', stato: 'nuovo', prova: true,
        guida: 'I bit come materiale da lavoro: spostarli, isolarli, accenderli e riunirli in campi, fino a comporre la parola di un’istruzione.',
        unita: [
          { id: '2.4.1', titolo: 'Maschere e scorrimenti come operazioni macchina', sim: 'operation', scopo: 'Gli otto bit di un byte che scorrono, e che cosa entra al posto di quelli usciti.' },
          { id: '2.4.2', titolo: 'Un solo bit a uno in posizione k', sim: 'bit', scopo: 'Una maschera con un solo 1 per accendere, spegnere, invertire o leggere un bit.' },
          { id: '2.4.3', titolo: 'Impacchettare campi e costruire valori vincolati', sim: 'byte', scopo: 'Due numeri piccoli in un byte, e che cosa accade se uno dei due è troppo grande.' },
          { id: '2.4.4', titolo: 'Derivare le maschere di campo', sim: 'scudo', scopo: 'Dalla posizione e dalla larghezza di un campo alla maschera che lo isola.' },
          { id: '2.4.5', titolo: 'Comporre una parola nel formato di un’istruzione', sim: 'tabella', scopo: 'Quattro valori, quattro scorrimenti, una parola di trentadue bit.' }
        ],
        sfide: [['cslez2_4_01_random_assembly_01', 'Maschere per byte e singoli bit'], ['cslez2_4_02_random_assembly_02', 'Modificare bit e combinare semibyte'], ['cslez2_4_03_random_assembly_03', 'XOR, inversioni e scorrimenti'], ['cslez2_4_04_random_assembly_04', 'Estrarre, inserire e verificare campi'], ['cslez2_4_05_random_assembly_05', 'Allineamento, potenze di due e flag']] },
      { id: '2.5', breve: 'Chiamate di sistema', titolo: 'Chiamate di sistema Linux e confine tra utente e kernel', sim: 'privilegi', stato: 'nuovo', prova: true,
        guida: 'Come un programma chiede al sistema operativo i servizi che gli sono preclusi: scrivere, leggere, cambiare programma, terminare.',
        unita: [
          { id: '2.5.1', titolo: 'Dalla richiesta dell’utente all’ingresso nel kernel', sim: 'privilegi', scopo: 'Una richiesta che attraversa il confine fra programma e kernel, e torna con una risposta.' },
          { id: '2.5.2', titolo: 'L’ABI delle syscall Linux x86-64', sim: 'tabella', scopo: 'Sei argomenti in sei registri, e il motivo per cui il quarto cambia sede.' },
          { id: '2.5.3', titolo: 'I/O tramite descrittori di file', sim: 'file', scopo: 'Una lettura e una scrittura che trasferiscono meno byte di quanti ne erano stati chiesti.' },
          { id: '2.5.4', titolo: 'Mappature e sostituzione dell’immagine di processo', sim: 'process', scopo: 'Un processo che cambia programma e conserva il proprio numero.' },
          { id: '2.5.5', titolo: 'Identità dei descrittori e stato aperto condiviso', sim: 'tabella', scopo: 'Due descrittori sullo stesso file: quando si passano il segno e quando no.' },
          { id: '2.5.6', titolo: 'Dall’ingresso nel programma all’uscita del processo', sim: 'output', scopo: 'Il viaggio di un codice di uscita, dal processo che termina al genitore che lo legge.' }
        ],
        sfide: [['cslez2_5_01_random_assembly_01', 'Scrittura sui descrittori e terminazione'], ['cslez2_5_02_random_assembly_02', 'Lettura in un buffer e scrittura di porzioni'], ['cslez2_5_03_random_assembly_03', 'Lunghezze, stack e posizioni nel buffer'], ['cslez2_5_04_random_assembly_04', 'Valori restituiti e trasferimenti di zero byte'], ['cslez2_5_05_random_assembly_05', 'Sequenze di letture e scritture']] },
      { id: '2.6', breve: 'Procedure e controllo', titolo: 'Procedure, flusso di controllo e analisi del codice macchina', sim: 'pila', stato: 'nuovo', prova: true,
        guida: 'Come una funzione riceve i dati, cede il controllo e lo riprende, e come si legge una funzione di cui si possiede soltanto il codice macchina.',
        unita: [
          { id: '2.6.1', titolo: 'La convenzione delle chiamate di funzione', sim: 'input', scopo: 'Otto argomenti per sei registri: dove finiscono gli altri due.' },
          { id: '2.6.2', titolo: 'Frame dello stack e trasferimenti di controllo', sim: 'pila', scopo: 'Da CALL a RET, seguendo RSP e ogni cella che la funzione usa.' },
          { id: '2.6.3', titolo: 'Il flusso di controllo dentro una funzione', sim: 'fork', scopo: 'Lo stesso confronto letto da due salti, con due risposte diverse.' },
          { id: '2.6.4', titolo: 'Leggere una funzione compilata', sim: 'riproduci', scopo: 'Un salto all’indietro, e la tabella dei giri che rivela che cosa calcola.' },
          { id: '2.6.5', titolo: 'Argomenti aggregati e chiamate variadiche', sim: 'tabella', scopo: 'Una struttura come argomento: registri oppure pila, secondo la dimensione.' },
          { id: '2.6.6', titolo: 'Un metodo di analisi del codice macchina', sim: 'lente', scopo: 'Cinque istruzioni senza nome, e quattro domande per capire che cosa fanno.' }
        ],
        sfide: [['cslez2_6_01_random_assembly_01', 'Preprocessore, compilatore e file oggetto'], ['cslez2_6_02_random_assembly_02', 'Disassemblaggio, simboli e debugger'], ['cslez2_6_03_random_assembly_03', 'Valore restituito, confronti e salti'], ['cslez2_6_04_random_assembly_04', 'Espressioni, array e chiamate'], ['cslez2_6_05_random_assembly_05', 'Argomenti e lettura del codice ottimizzato']] },
      { id: '2.7', breve: 'Stack e sicurezza', titolo: 'Frame dello stack, sicurezza della memoria e riuso del flusso di controllo', sim: 'scudo', stato: 'nuovo', prova: true,
        guida: 'Che cosa accade quando una scrittura esce dai limiti di una variabile sulla pila, quali difese esistono e che cosa ciascuna lascia scoperto.',
        unita: [
          { id: '2.7.1', titolo: 'I frame dello stack come convenzioni', sim: 'pila', scopo: 'Un riferimento fermo, RBP, e le celle del frame misurate da lì.' },
          { id: '2.7.2', titolo: 'Dalla scrittura fuori limite ai dati di controllo', sim: 'scudo', scopo: 'Una copia troppo lunga, seguita byte per byte fino all’indirizzo di ritorno.' },
          { id: '2.7.3', titolo: 'Protezioni e loro limiti', sim: 'bilancio', scopo: 'Cinque scritture davanti alla sentinella: quali rileva e quali le sfuggono.' },
          { id: '2.7.4', titolo: 'Riuso del flusso di controllo', sim: 'puntatore', scopo: 'Tre indirizzi sulla pila che decidono l’ordine di blocchi già esistenti.' },
          { id: '2.7.5', titolo: 'Ottimizzazioni dello stack e dettagli ABI', sim: 'memory', scopo: 'Tre funzioni che usano la pila in tre modi, e la regola dei multipli di 16.' },
          { id: '2.7.6', titolo: 'Stack ombra e protezioni complementari', sim: 'scudo', scopo: 'Due copie dell’indirizzo di ritorno, e ciò che RET confronta.' },
          { id: '2.7.7', titolo: 'Verifiche per una revisione di sicurezza della memoria', sim: 'lente', scopo: 'Una stringa, il suo terminatore e il confronto che decide se entra nel buffer.' }
        ],
        sfide: [['cslez2_7_01_random_assembly_01', 'Operazioni sulla cima dello stack'], ['cslez2_7_02_random_assembly_02', 'Spazio locale e prologo di funzione'], ['cslez2_7_03_random_assembly_03', 'Epilogo, variabili locali e chiamate'], ['cslez2_7_04_random_assembly_04', 'Ordine e duplicazione dei valori sullo stack'], ['cslez2_7_05_random_assembly_05', 'Allineamento, registri salvati e indirizzo di ritorno']] }
    ] },
    { k: '3', r: 'III', breve: 'Processore', nome: 'Organizzazione del processore', sim: 'cpu', capitoli: [
      { id: '3.1', breve: 'Logica combinatoria', titolo: 'Logica combinatoria: dalle tabelle di verità all’ALU', sim: 'alu', stato: 'nuovo', prova: true,
        guida: 'Come una richiesta scritta a parole diventa un circuito, e come selettori e sommatori si compongono fino all’unità che esegue i calcoli del processore.',
        unita: [
          { id: '3.1.1', titolo: 'Dalla specifica booleana ai blocchi del percorso dati', sim: 'porta', scopo: 'Tre sensori, una spia e due circuiti diversi che calcolano la stessa funzione.' },
          { id: '3.1.2', titolo: 'Selezionare un ingresso con un multiplexer', sim: 'mux', scopo: 'Quattro parole in ingresso, due bit di comando e una sola uscita.' },
          { id: '3.1.3', titolo: 'Aritmetica e costruzione dell’ALU', sim: 'alu', scopo: 'Un sommatore che, con una fila di XOR e un filo di comando, esegue anche le sottrazioni.' },
          { id: '3.1.4', titolo: 'Dai blocchi combinatori al controllo del processore', sim: 'mux', scopo: 'Quattro risultati calcolati insieme, e un comando che ne sceglie uno.' },
          { id: '3.1.5', titolo: 'Tempi, costo e realizzazione fisica', sim: 'clock', scopo: 'Tre barre del tempo per trovare il percorso che decide la velocità di un circuito.' },
          { id: '3.1.6', titolo: 'Implementazioni alternative e flag di stato', sim: 'flag', scopo: 'Un riporto conosciuto in anticipo, e i quattro flag letti sui fili del sommatore.' }
        ],
        sfide: [['cslez3_1_01_random_assembly', 'Funzioni booleane di uno o più ingressi'], ['cslez3_1_02_random_assembly', 'Selezione dei dati con multiplexer'], ['cslez3_1_03_random_assembly', 'Somme, differenze e riporti'], ['cslez3_1_04_random_assembly', 'Operazioni e segnali di uscita dell’ALU'], ['cslez3_1_05_random_assembly', 'Transizioni e stato di un latch SR']] },
      { id: '3.2', breve: 'Logica sequenziale', titolo: 'Logica sequenziale: stato, registri e memoria', sim: 'flipflop', stato: 'nuovo', prova: true,
        guida: 'Come un circuito riesce a ricordare, quando il ricordo viene scritto e quali tempi vanno rispettati perché la scrittura riesca.',
        unita: [
          { id: '3.2.1', titolo: 'Dalla logica combinatoria allo stato memorizzato', sim: 'register', scopo: 'Due registri sullo stesso bus, e il comando che decide chi carica e chi conserva.' },
          { id: '3.2.2', titolo: 'Latch, flip-flop e clock', sim: 'flipflop', scopo: 'Lo stesso dato davanti a due celle: una lo segue per un livello, l’altra lo cattura in un istante.' },
          { id: '3.2.3', titolo: 'Registri, banchi di registri e memoria', sim: 'memory', scopo: 'Quattro registri, due porte che leggono e una che scrive al fronte.' },
          { id: '3.2.4', titolo: 'Il modello sincrono e i limiti temporali', sim: 'clock', scopo: 'Il dato più tardivo e quello più precoce, misurati contro le finestre di setup e di hold.' },
          { id: '3.2.5', titolo: 'Dallo stato memorizzato alle macchine a stati', sim: 'riproduci', scopo: 'Un distributore che ricorda soltanto il credito, seguito moneta dopo moneta.' }
        ],
        sfide: [['cslez3_2_01_random_assembly', 'Stati e ingressi di un latch SR'], ['cslez3_2_02_random_assembly', 'Trasparenza e abilitazione del latch D'], ['cslez3_2_03_random_assembly', 'Acquisizione sul fronte di clock'], ['cslez3_2_04_random_assembly', 'Caricamento e modifica di un registro a quattro bit'], ['cslez3_2_05_random_assembly', 'Aggiornamenti paralleli e priorità dei comandi']] },
      classico('3.3', 'Repertorio Y86-64', 'Il repertorio Y86-64 e le fasi di esecuzione', 'file'),
      classico('3.4', 'Processore sequenziale', 'Il processore sequenziale', 'cpu'),
      classico('3.5', 'Pipeline e conflitti', 'Pipeline: sovrapposizione, capacità di completamento e conflitti', 'conflitto'),
      classico('3.6', 'Pipeline a cinque stadi', 'Il processore in pipeline a cinque stadi', 'pipeline')
    ] },
    { k: '4', r: 'IV', breve: 'I/O e dischi', nome: 'I/O e archiviazione', sim: 'storage', capitoli: [
      classico('4.1', 'Eccezioni', 'Flusso di controllo eccezionale e ingresso protetto', 'interrupt'),
      classico('4.2', 'Ingresso nel kernel', 'Chiamate di sistema e ingresso controllato nel kernel', 'gate'),
      classico('4.3', 'Polling e interrupt', 'Controller dei dispositivi, polling e interrupt', 'dispositivo'),
      classico('4.4', 'Bus e transazioni', 'Bus, transazioni e interconnessioni', 'bus'),
      classico('4.5', 'Dischi magnetici', 'Memoria magnetica e analisi dei tempi di accesso', 'disco'),
      classico('4.6', 'RAID e SSD', 'RAID e memoria a stato solido', 'raid'),
      classico('4.7', 'Dispositivi e DMA', 'Classi di dispositivi e accesso diretto alla memoria', 'ssd')
    ] },
    { k: '5', r: 'V', breve: 'Processi', nome: 'Processi e concorrenza', sim: 'process', capitoli: [
      classico('5.1', 'Processi e stati', 'Processi, stati e cambi di contesto', 'process'),
      classico('5.2', 'Creazione e terminazione', 'Creazione dei processi, sostituzione del programma e terminazione', 'fork'),
      classico('5.3', 'Scheduling', 'Scheduling della CPU e condivisione del tempo', 'coda'),
      classico('5.4', 'Thread', 'Thread, concorrenza ed esecuzione parallela', 'thread'),
      classico('5.5', 'Sezioni critiche', 'Stato condiviso, sezioni critiche e semafori', 'lucchetto'),
      classico('5.6', 'Problemi classici', 'Semafori contatori e problemi classici di sincronizzazione', 'semaforo'),
      classico('5.7', 'Deadlock', 'Deadlock, starvation e livelock', 'stallo')
    ] },
    { k: '6', r: 'VI', breve: 'Memoria e file', nome: 'Memoria, file e protezione', sim: 'memory', capitoli: [
      classico('6.1', 'Gerarchie di memoria', 'Gerarchie di memoria e località', 'cache'),
      classico('6.2', 'Memoria virtuale', 'Memoria virtuale e paginazione su richiesta', 'strati'),
      classico('6.3', 'Traduzione in codice', 'Traduzione degli indirizzi in codice', 'hex'),
      classico('6.4', 'TLB e tabelle', 'TLB e tabelle delle pagine multilivello', 'tabella'),
      classico('6.5', 'File e nomi', 'File, nomi e allocazione', 'folder'),
      classico('6.6', 'Consistenza e recupero', 'Consistenza e recupero dopo un arresto', 'journal'),
      classico('6.7', 'Protezione e audit', 'Protezione, cifratura e audit', 'chiave')
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
