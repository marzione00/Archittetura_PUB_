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
      { id: '1.1', breve: 'Vita di un programma', titolo: 'Il calcolatore e la vita di un programma', sim: 'terminale', stato: 'nuovo',
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
      { id: '1.2', breve: 'Binario ed esadecimale', titolo: 'Rappresentazione binaria ed esadecimale', sim: 'byte', stato: 'nuovo',
        guida: 'Si impara a leggere e a scrivere un numero con le sole cifre 0 e 1, e a riassumere otto bit con due simboli esadecimali.',
        unita: [
          { id: '1.2.1', titolo: 'Dagli stati fisici ai simboli binari', sim: 'bit', scopo: 'Come una tensione misurata su un filo diventa uno 0 oppure un 1.' },
          { id: '1.2.2', titolo: 'Notazione posizionale ed esadecimale', sim: 'hex', scopo: 'Leggere e scrivere un byte in binario e in esadecimale.' },
          { id: '1.2.3', titolo: 'Memoria a byte e ordine dei byte', sim: 'byte', scopo: 'Come un numero di quattro byte viene distribuito su quattro indirizzi.' },
          { id: '1.2.4', titolo: 'Leggere i byte e dichiararne il significato', sim: 'char', scopo: 'Perché gli stessi byte possono essere un numero oppure un testo.' }
        ],
        sfide: [['lez02_01_voltage_to_bits', 'Bit, byte e capacità di rappresentazione'], ['lez02_02_dec_to_bin', 'Dal decimale al binario'], ['lez02_03_bin_to_hex', 'Dal binario all’esadecimale'], ['lez02_04_hex_to_dec', 'Dall’esadecimale al decimale'], ['lez02_05_utf8_bytes_and_ascii', 'Byte occupati da ASCII e UTF-8']] },
      { id: '1.3', breve: 'Testo, immagini, suoni', titolo: 'Codificare testo, immagini e suoni', sim: 'char', stato: 'nuovo',
        guida: 'Si scopre come immagini, caratteri di ogni lingua e suoni diventano file di byte, e come un lettore prudente li rilegge.',
        unita: [
          { id: '1.3.1', titolo: 'La codifica come accordo tra significato e byte', sim: 'pixel', scopo: 'Come un’immagine diventa una fila di byte, e come ritrovarvi un colore.' },
          { id: '1.3.2', titolo: 'Unicode, punti di codice e UTF-8', sim: 'char', scopo: 'Perché una lettera accentata occupa due byte, e come si ricostruisce il suo numero.' },
          { id: '1.3.3', titolo: 'Dimensionare una registrazione PCM', sim: 'suono', scopo: 'Quanti byte occupa un suono, noti frequenza, canali, profondità e durata.' },
          { id: '1.3.4', titolo: 'Formati binari, validazione e contesto', sim: 'scudo', scopo: 'Perché una lunghezza dichiarata va verificata prima di essere usata.' },
          { id: '1.3.5', titolo: 'Un metodo per decodificare i dati', sim: 'lente', scopo: 'Cinque domande, sempre nello stesso ordine, per leggere qualunque campo.' }
        ],
        sfide: [['lez03_01_same_bits_two_meanings', 'Interpretare una sequenza di bit'], ['lez03_02_ascii_hex_string', 'Stringhe ASCII in esadecimale'], ['lez03_03_utf8_decode', 'Lunghezza e struttura delle sequenze UTF-8'], ['lez03_04_rgb_image_size', 'Immagini RGB e indirizzi dei pixel'], ['lez03_05_multi_interpretation', 'Formato e interpretazione dei dati']] },
      { id: '1.4', breve: 'Interi con segno', titolo: 'Interi con segno e complemento a due', sim: 'segno', stato: 'nuovo',
        guida: 'Si impara a scrivere i numeri negativi in un byte, a sommarli e a riconoscere quando il risultato non entra più.',
        unita: [
          { id: '1.4.1', titolo: 'Il complemento a due a larghezza fissata', sim: 'segno', scopo: 'Come un byte rappresenta i numeri da −128 a 127.' },
          { id: '1.4.2', titolo: 'Somma, sottrazione e overflow', sim: 'operation', scopo: 'Sommare due byte e capire se il risultato rimasto è quello giusto.' },
          { id: '1.4.3', titolo: 'Il linguaggio C: rappresentazione, operazioni e conversioni', sim: 'tabella', scopo: 'Che cosa accade ai bit quando un numero cambia tipo.' },
          { id: '1.4.4', titolo: 'Controllare l’aritmetica prima dell’operazione', sim: 'scudo', scopo: 'Stabilire in anticipo se un prodotto entrerà nella destinazione.' }
        ],
        sfide: [['lez04_01_encode_negative_twos', 'Codificare interi negativi'], ['lez04_02_decode_twos', 'Decodificare il complemento a due'], ['lez04_03_signed_range', 'Intervallo degli interi con segno'], ['lez04_04_fixed_width_add_sub', 'Somma e sottrazione a larghezza fissa'], ['lez04_05_overflow_detector', 'Rilevare il traboccamento']] },
      { id: '1.5', breve: 'Circuiti booleani', titolo: 'Circuiti booleani e calcolo a livello di bit', sim: 'porta', stato: 'nuovo',
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
      { id: '1.6', breve: 'Virgola mobile', titolo: 'Numeri frazionari e virgola mobile IEEE 754', sim: 'virgola', stato: 'nuovo',
        guida: 'Si passa dai numeri interi a quelli con la virgola, e si scopre perché un calcolatore li conserva quasi sempre con un piccolo errore.',
        unita: [
          { id: '1.6.1', titolo: 'Frazioni binarie, scala e precisione', sim: 'virgola', scopo: 'Scrivere in binario un numero con la virgola, un raddoppio alla volta.' },
          { id: '1.6.2', titolo: 'Il formato IEEE 754', sim: 'tabella', scopo: 'Smontare una parola di 32 bit in segno, esponente e significando.' },
          { id: '1.6.3', titolo: 'Arrotondamento, distanza tra valori e programmi', sim: 'lente', scopo: 'Perché a un numero grande non si riesce ad aggiungere uno.' },
          { id: '1.6.4', titolo: 'Dal formato IEEE al percorso dei dati in virgola mobile', sim: 'alu', scopo: 'Le quattro mosse con cui il processore somma due numeri con la virgola.' }
        ],
        sfide: [['lez06_01_fractional_binary', 'Frazioni binarie e pesi posizionali'], ['lez06_02_exact_or_approx', 'Rappresentazione esatta e approssimazione'], ['lez06_03_normalize_binary', 'Normalizzazione ed esponente con bias'], ['lez06_04_ieee754_single_decode', 'Leggere un numero IEEE 754 a precisione singola'], ['lez06_05_c_float_pitfalls', 'Precisione delle operazioni in C']] },
      classico('1.7', 'Casi integrati', 'Casi integrati: dai byte al comportamento', 'input')
    ] },
    { k: '2', r: 'II', breve: 'x86-64', nome: 'Programmazione x86-64', sim: 'register', capitoli: [
      classico('2.1', 'Registri e memoria', 'Stato della macchina, registri e memoria', 'memory'),
      classico('2.2', 'Aritmetica e flag', 'Aritmetica intera e flag di condizione', 'flag'),
      classico('2.3', 'Indirizzi e array', 'Indirizzi, array e disposizione dei dati', 'puntatore'),
      classico('2.4', 'Maschere e scorrimenti', 'Operazioni bit a bit, scorrimenti e maschere', 'operation'),
      classico('2.5', 'Chiamate di sistema', 'Chiamate di sistema Linux e confine tra utente e kernel', 'privilegi'),
      classico('2.6', 'Procedure e controllo', 'Procedure, flusso di controllo e analisi del codice macchina', 'pila'),
      classico('2.7', 'Stack e sicurezza', 'Frame dello stack, sicurezza della memoria e riuso del flusso di controllo', 'scudo')
    ] },
    { k: '3', r: 'III', breve: 'Processore', nome: 'Organizzazione del processore', sim: 'cpu', capitoli: [
      classico('3.1', 'Logica combinatoria', 'Logica combinatoria: dalle tabelle di verità all’ALU', 'alu'),
      classico('3.2', 'Logica sequenziale', 'Logica sequenziale: stato, registri e memoria', 'flipflop'),
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
