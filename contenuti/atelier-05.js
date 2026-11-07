(function () {
  'use strict';

  const dati = (passi, indice = passi.length - 1) => Object.fromEntries(passi[indice].valori);
  function campo(label, chiave, indice) {
    return { label, valore: (_p, passi) => dati(passi, indice)[chiave] };
  }
  const previsioni = {
    '1.1': campo('Valore letto da B', 'valore letto'),
    '1.2': { label: 'Stato di A subito dopo l’evento (pronto o bloccato)', valore: (_p, passi) => dati(passi, 1).A },
    '1.3': campo('Indirizzo del prossimo prelievo (0x…)', 'PC del core'),
    '1.4': { label: 'Processo interessato (A o B)', valore: (p, passi) => p.caso === 'sleep' ? dati(passi, 1)['coda D'] : dati(passi, 1)['tabella attiva'].slice(1) },
    '2.1': campo('Valore di x nel padre', 'x padre'),
    '2.2': campo('Destinazione di ciao (terminale o esito.txt)', 'destinazione di ciao'),
    '2.3': campo('Descrittore 4 (aperto o chiuso)', 'fd 4'),
    '2.4': campo('Codice di uscita', 'WEXITSTATUS'),
    '2.5': { label: 'Thread che riprende nel figlio (T1 o T2)', valore: (_p, passi) => dati(passi, 1)['thread figlio'] },
    '3.1': campo('Attesa di B dal risveglio (ms)', 'attesa dopo il risveglio (ms)'),
    '3.2': campo('Attesa media (ms)', 'media (ms)'),
    '3.3': campo('Prima assegnazione del core a B (ms)', 'prima risposta B (ms)'),
    '3.4': { label: 'Processo selezionato (A, B, L o M)', valore: (p, passi) => {
        if (p.caso === 'feedback') return dati(passi)['core dopo il risveglio'];
        return p.caso === 'aging' ? dati(passi).core : dati(passi, 1).core;
      } },
    '3.5': campo('Tempo di completamento (ms)', 'tempo totale (ms)'),
    '4.1': campo('Contenuto di h letto da T2', 'h visto da T2'),
    '4.2': campo('Durata totale (ms)', 'durata totale (ms)'),
    '4.3': campo('Thread utente in esecuzione simultanea', 'massimo simultaneo'),
    '4.4': campo('Valori distinti letti dai thread', 'indici distinti'),
    '4.5': campo('Lavoratori ancora attivi', 'lavoratori superstiti'),
    '5.1': campo('Valore finale della cella', 'cella'),
    '5.2': campo('Valore finale del contatore', 'cella'),
    '5.3': campo('Totale osservato dal creatore', 'totale letto'),
    '5.4': { label: 'Minimo valore ammesso per dato', valore: (_p, passi) => parseInt(dati(passi)['valori ammessi'], 10) },
    '5.5': campo('Tempo di CPU consumato da B durante l’attesa (ms)', 'CPU di B durante l’attesa (ms)', 1),
    '5.6': campo('Permessi liberi finali', 'permessi liberi'),
    '5.7': campo('Conferme ricevute', 'conferme'),
    '6.1': campo('Posti liberi dopo la pubblicazione', 'vuoti'),
    '6.2': { label: 'C può rimuovere il dato? (sì o no)', valore: (_p, passi) => dati(passi).P === 'pronto' ? 'sì' : 'no' },
    '6.3': campo('Predicato al controllo (vero o falso)', 'predicato al controllo'),
    '6.4': campo('Lettori ancora attivi', 'lettori attivi'),
    '6.5': campo('Esito (entrambi completano o deadlock)', 'esito'),
    '7.1': campo('Esito (deadlock o completamento possibile)', 'esito'),
    '7.2': campo('Condizione esclusa (attesa circolare o possesso durante l’attesa)', 'condizione eliminata'),
    '7.3': campo('Esito del test (sicuro o insicuro)', 'stato'),
    '7.4': campo('Prima transazione completata (A o B)', 'primo completamento'),
    '7.5': campo('Diagnosi (starvation o livelock)', 'diagnosi'),
  };

  function unit(id, domanda, controlli, calcola) {
    SL.unita['5.' + id] = { teoria: SL.lezioni['5.' + id].join(' '), domanda, controlli, calcola, previsione: previsioni[id] };
  }
  function range(id, label, min, max, iniziale) {
    return { id, label, min, max, step: 1, iniziale };
  }
  function menu(id, label, opzioni) {
    return { id, label, opzioni, iniziale: opzioni[0][0] };
  }
  function frame(titolo, testo, valori) { return { titolo, testo, valori }; }
  function cases(id, question, label, scenarios) {
    unit(id, question, [menu('caso', label, Object.entries(scenarios).map(([key, row]) => [key, row[0]]))],
      p => scenarios[p.caso][1].map(s => frame(s[0], s[1], s.slice(2))));
  }

  // Processo, dispatcher e strutture del kernel.
  unit('1.1',    'Quale valore legge B all’indirizzo 0x1000 dopo la scrittura di A?', [range('dato', 'Valore scritto da A', 1, 99, 7)], p => [
      frame('Avvio di due istanze', 'Il kernel carica il programma in A e B. La variabile x occupa 0x1000 in entrambi.', [['PID A', 41], ['PID B', 42], ['x iniziale', 0]]),
      frame('Scrittura in A', 'La traduzione di A indirizza la pagina privata di A.', [['A[0x1000]', p.dato], ['B[0x1000]', 0]]),
      frame('Lettura in B', 'Il dispatcher seleziona B. Il medesimo indirizzo virtuale raggiunge la pagina privata di B.', [['PID corrente', 42], ['valore letto', 0], ['valore conservato da A', p.dato]])
    ]);
  cases('1.2',    'In quale stato entra A subito dopo la richiesta di lettura o la scadenza del quanto?', 'Evento durante il turno di A', {
      io: ['Lettura su disco', [
        ['Turno corrente', 'A esegue una richiesta di lettura. B attende il core.', ['A', 'in esecuzione'], ['B', 'pronto']],
        ['Attesa del dispositivo', 'I dati devono ancora arrivare. Il kernel sospende A e assegna il core a B.', ['A', 'bloccato'], ['B', 'in esecuzione']],
        ['Completamento', 'Il dispositivo segnala la fine della lettura. La politica qui lascia terminare il turno di B.', ['A', 'pronto'], ['B', 'in esecuzione']]]],
      timer: ['Fine del quanto', [
        ['Turno corrente', 'A calcola e B aspetta nella coda dei pronti.', ['A', 'in esecuzione'], ['B', 'pronto']],
        ['Scadenza', 'Il timer interrompe A. Round-robin accoda A dietro B.', ['coda', 'B, A'], ['A', 'pronto']],
        ['Assegnazione', 'B esce dalla testa della coda e usa il core.', ['B', 'in esecuzione'], ['coda', 'A']]]]
    });
  unit('1.3',    'A quale indirizzo riparte A dopo il turno di B?', [range('n', 'Istruzioni completate da A', 1, 8, 3)], p => {
      const pc = '0x' + (0x1000 + 4 * p.n).toString(16);
      return [frame('Esecuzione di A', 'A parte da 0x1000. Prima del timer completa ' + p.n + (p.n === 1 ? ' istruzione.' : ' istruzioni consecutive.'), [['PC iniziale', '0x1000'], ['byte per istruzione', 4]]),
        frame('Timer e cambio', 'Il kernel salva il prossimo PC di A e carica quello di B.', [['PC salvato A', pc], ['PC caricato B', '0x2400']]),
        frame('Ritorno ad A', 'Il dispatcher ricarica il contesto di A. Il primo prelievo raggiunge l’istruzione successiva all’ultima completata.', [['PC del core', pc], ['byte già percorsi da A', p.n * 4]])];
    });
  cases('1.4',    'Quale processo viene risvegliato dalla notifica o selezionato per il ripristino della tabella?', 'Operazione del kernel', {
      sleep: ['Completare una lettura', [
        ['Richiesta', 'A avvia una lettura ancora pendente sul disco D.', ['PID', 34], ['stato', 'in esecuzione']],
        ['Registrazione', 'Il kernel conserva il contesto e collega A alla coda del dispositivo.', ['coda D', 'A'], ['stato', 'bloccato']],
        ['Notifica', 'Il completamento identifica la richiesta. Il kernel rimuove A dalla coda D e lo accoda fra i pronti.', ['coda D', 'vuota'], ['stato', 'pronto']]]],
      memory: ['Ripristinare lo spazio di indirizzi', [
        ['Due spazi', 'A e B hanno tabelle distinte. Il kernel conserva riferimenti a entrambe.', ['tabella A', 'TA'], ['tabella B', 'TB']],
        ['Selezione', 'Il dispatcher sceglie B e installa il riferimento alla sua tabella.', ['PID entrante', 35], ['tabella attiva', 'TB']],
        ['Traduzione', 'Nella tabella TB la pagina virtuale 2 indica il frame 9. Il contenuto del frame rimane in memoria.', ['pagina', 2], ['frame', 9]]]]
    });

  unit('2.1',    'Quale valore conserva il padre dopo l’incremento di x nel figlio?', [range('x', 'Valore di partenza di x', 0, 20, 6)], p => [
      frame('Prima della duplicazione', 'Il padre inizializza x su una pagina privata.', [['PID', 80], ['x', p.x]]),
      frame('Ritorno da fork', 'Il kernel crea il figlio 81. Le due mappature leggono lo stesso contenuto.', [['ritorno nel padre', 81], ['ritorno nel figlio', 0], ['x in entrambi', p.x]]),
      frame('Copia alla scrittura', 'Il figlio incrementa x. Il sistema rende privata la pagina scritta e conserva la pagina del padre.', [['x padre', p.x], ['x figlio', p.x + 1]])]);
  cases('2.2',    'Dove arriva la parola ciao prodotta da echo?', 'Comando in primo piano', {
      file: ['echo ciao > esito.txt', [
        ['Duplicazione', 'La shell crea il figlio. Entrambi hanno inizialmente stdout sul terminale.', ['padre fd 1', 'terminale'], ['figlio fd 1', 'terminale']],
        ['Redirezione nel figlio', 'Il figlio apre esito.txt sul descrittore 3, esegue dup2(3,1) e chiude 3.', ['figlio fd 1', 'esito.txt'], ['padre fd 1', 'terminale']],
        ['Esecuzione esterna', 'Nel modello echo è un eseguibile. Scrive sul descrittore 1 e termina. La shell raccoglie lo stato.', ['destinazione di ciao', 'esito.txt'], ['prompt', 'terminale']]]],
      tty: ['echo ciao', [
        ['Duplicazione', 'La shell crea un figlio che eredita stdout.', ['padre fd 1', 'terminale'], ['figlio fd 1', 'terminale']],
        ['Caricamento', 'Il figlio carica l’eseguibile echo conservando stdout.', ['immagine del figlio', 'echo'], ['figlio fd 1', 'terminale']],
        ['Completamento', 'echo scrive ciao e termina. Il padre raccoglie lo stato prima del prompt.', ['destinazione di ciao', 'terminale'], ['shell', 'pronta per un comando']]]]
    });
  cases('2.3',    'Il descrittore 4 è aperto o chiuso dopo il tentativo di avvio?', 'Percorso richiesto', {
      ok: ['Eseguibile accessibile', [
        ['Prima di exec', 'Il wrapper 71 conserva il file di lavoro su fd 3 e un descrittore temporaneo su fd 4.', ['PID', 71], ['close-on-exec', 'fd 4']],
        ['Caricamento', 'Il kernel installa il nuovo spazio di indirizzi e prepara gli argomenti.', ['immagine', 'analisi'], ['PID', 71]],
        ['Ingresso', 'Il programma analisi inizia dal proprio punto di ingresso e trova ancora il descrittore di lavoro.', ['fd 3', 'aperto'], ['fd 4', 'chiuso']]]],
      ko: ['File assente', [
        ['Prima di exec', 'Il wrapper 71 chiama execve su un percorso assente.', ['PID', 71], ['close-on-exec', 'fd 4']],
        ['Ricerca', 'La ricerca del file fallisce prima della sostituzione.', ['risultato', '−1'], ['errno', 'ENOENT']],
        ['Gestione dell’errore', 'Il wrapper riprende dopo la chiamata. Il descrittore temporaneo è ancora disponibile.', ['immagine', 'wrapper'], ['fd 4', 'aperto']]]]
    });
  unit('2.4',    'Quale codice estrae il padre dallo stato del figlio?', [range('status', 'Codice di uscita del figlio', 0, 125, 13)], p => [
      frame('Padre impegnato', 'Il padre lavora mentre il figlio elabora il risultato.', [['figlio', 52], ['codice che passerà a _exit', p.status]]),
      frame('Terminazione normale', 'Il figlio esegue _exit(' + p.status + '). Il padre deve ancora raccogliere il risultato.', [['PID registrato', 52], ['figlio', 'zombie']]),
      frame('Raccolta', 'waitpid restituisce il PID. Il padre controlla WIFEXITED e legge il codice decodificato.', [['ritorno di waitpid', 52], ['WEXITSTATUS', p.status], ['record', 'raccolto']])]);
  cases('2.5',    'Quale thread del padre riprende l’esecuzione nel figlio subito dopo fork?', 'Passo successivo del figlio', {
      exec: ['Caricare il nuovo programma', [
        ['Preparazione', 'Il thread T1 possiede M. T2 chiama fork.', ['thread padre', 'T1, T2'], ['M', 'occupato']],
        ['Separazione', 'Nel figlio resta la copia di T2. Lo stato di M proviene dalla vecchia immagine.', ['thread figlio', 'T2'], ['M copiato', 'occupato']],
        ['execve', 'Il figlio carica direttamente un nuovo eseguibile. La vecchia mappatura che conteneva M viene sostituita.', ['immagine', 'nuovo programma'], ['vecchio mutex', 'mappatura sostituita']]]],
      exit: ['Terminare dopo execve fallita', [
        ['Preparazione', 'T1 sta usando M mentre T2 duplica il processo.', ['thread padre', 'T1, T2'], ['M', 'occupato']],
        ['Errore di avvio', 'Il figlio tenta execve. Il percorso richiesto è assente.', ['thread figlio', 'T2'], ['errno', 'ENOENT']],
        ['Uscita diretta', 'Nel percorso di errore il figlio usa _exit(127). Il padre potrà raccoglierlo senza dipendere dai lock di libreria ereditati.', ['codice di uscita', 127], ['padre', 'continua con T1 e T2']]]]
    });

  // Scheduling: estremi degli intervalli in millisecondi, intervalli [inizio,fine).
  unit('3.1',    'Quanti millisecondi attende B fra il risveglio e l’assegnazione del core?', [range('t', 'Istante di risveglio di B (ms)', 1, 4, 2), menu('pol', 'Politica', [['rr', 'Quanto di A fino a 5 ms'], ['prio', 'Prelazione per priorità di B']])], p => {
      const first = p.pol === 'rr' ? 5 : p.t;
      return [frame('Turno di A', 'A è in esecuzione dal tempo 0. B aspetta il dispositivo.', [['core', 'A'], ['B', 'bloccato']]),
        frame('Interrupt di completamento', 'Al tempo ' + p.t + ' il dato diventa disponibile. B passa fra i pronti.', [['tempo (ms)', p.t], ['priorità maggiore', 'B']]),
        frame('Scelta del dispatcher', p.pol === 'rr' ? 'A esaurisce il proprio quanto. B è in testa alla coda al tempo 5.' : 'La priorità di B provoca il cambio al risveglio. Il costo del cambio è assunto nullo.', [['inizio B (ms)', first], ['attesa dopo il risveglio (ms)', first - p.t]])];
    });
  function scheduleJobs(jobs) {
    let time = 0;
    return jobs.map(([name, burst]) => {
      const start = time;
      time += burst;
      return {name, start, end: time, burst};
    });
  }
  unit('3.2',    'Qual è l’attesa media dei tre lavori, arrotondata a due decimali?', [range('burst', 'Durata A (ms)', 2, 10, 8), menu('pol', 'Politica', [['fcfs', 'FCFS'], ['sjf', 'SJF']])], p => {
      const jobs = [['A', p.burst], ['B', 3], ['C', 1]];
      if (p.pol === 'sjf') jobs.sort((a,b) => a[1] - b[1]);
      const slots = scheduleJobs(jobs);
      return slots.map(s => frame('Turno di ' + s.name, 'Il lavoro è arrivato al tempo 0. Occupa il core da ' + s.start + ' a ' + s.end + ' ms.', [['attesa (ms)', s.start], ['burst (ms)', s.burst]])).concat(
        frame('Attesa media', 'Tutti i lavori arrivano al tempo zero e ricevono un solo turno. La media è la somma degli istanti di inizio divisa per tre, arrotondata a due decimali.', [['ordine', slots.map(s=>s.name).join(' → ')], ['media (ms)', (slots.reduce((n,s)=>n+s.start,0)/3).toFixed(2).replace('.',',') ]]));
    });
  function rr(jobs, quantum, cost) {
    const pending = jobs.map(([name, burst]) => ({name, left: burst}));
    const trace = [];
    let time = 0, previous = '';
    while (pending.length) {
      const j = pending.shift();
      const cambio = previous && previous !== j.name ? cost : 0;
      time += cambio;
      const start = time, run = Math.min(quantum, j.left);
      time += run;
      j.left -= run;
      trace.push({name:j.name, start, end:time, left:j.left, cambio});
      if (j.left) pending.push(j);
      previous = j.name;
    }
    return trace;
  }
  unit('3.3',    'Quando B ottiene il core per la prima volta?', [range('q','Quanto (ms)',1,5,2),range('s','Costo di un cambio (ms)',0,2,1)], p => {
      const slots=rr([['A',5],['B',3],['C',2]],p.q,p.s);
      return [frame('Coda iniziale', 'I tre processi arrivano insieme in ordine A, B, C. Il burst totale vale 10 ms.', [['A (ms)',5],['B (ms)',3],['C (ms)',2]])].concat(slots.map(s=>frame('Turno di '+s.name, 'Si spendono '+s.cambio+' ms per il cambio. Il core lavora da '+s.start+' a '+s.end+' ms.', [['residuo (ms)',s.left],['stato a fine turno',s.left?'pronto':'terminato']]))).concat(frame('Bilancio', 'Il tempo totale comprende i 10 ms di lavoro e i cambi effettivi.', [['prima risposta B (ms)',slots.find(s=>s.name==='B').start],['totale (ms)',slots[slots.length-1].end]]));
    });
  cases('3.4',    'Quale processo ottiene il core alla decisione evidenziata dalla politica scelta?', 'Politica di priorità', {
      base: ['Priorità fisse', [
        ['Acquisizione', 'L possiede Mx. H arriva, tenta il lock e si blocca.', ['Mx', 'L'], ['H', 'bloccato']],
        ['Arrivo di M', 'M ha priorità intermedia e richiede 4 ms di CPU. Sul solo core disponibile il dispatcher esegue M prima di L.', ['core', 'M'], ['residuo di L sotto lock', '2 ms']],
        ['Rilascio', 'Terminato M, L usa 2 ms e sblocca H. Il tempo è contato dall’arrivo di M e i cambi sono gratuiti.', ['attesa di H', '6 ms'], ['H', 'pronto']]]],
      inherit: ['Ereditarietà', [
        ['Acquisizione', 'L possiede Mx. H tenta il lock e si blocca.', ['Mx', 'L'], ['H', 'bloccato']],
        ['Donazione', 'L eredita la priorità di H. Anche con M pronto il dispatcher sceglie L.', ['core', 'L'], ['priorità effettiva di L', 'alta']],
        ['Rilascio', 'Dopo 2 ms L restituisce Mx e recupera la sua priorità. H può partire prima di M.', ['attesa di H', '2 ms'], ['primo candidato', 'H']]]],
      feedback: ['Retroazione su due code', [
        ['Coda alta', 'A e B arrivano al livello alto, in questo ordine. Al livello alto il quanto è 2 ms e consumarlo per intero comporta la discesa al livello basso.', ['alta', 'A, B'], ['bassa', 'vuota']],
        ['Consumo del quanto', 'A usa 2 ms di calcolo e resta pronto. Lo scheduler sposta A in coda bassa e seleziona B.', ['core', 'B'], ['bassa', 'A']],
        ['Attesa di I/O', 'B si sospende dopo 1 ms conservando il livello alto. A usa il core. Quando B si risveglia, la sua priorità è più alta e il core passa da A a B.', ['core dopo il risveglio', 'B'], ['A', 'pronto, livello basso']]]],
      aging: ['Invecchiamento dei pronti', [
        ['Ingresso', 'A entra in coda con priorità 1. Ogni 2 ms interi di attesa guadagna un punto. Un flusso di lavori a priorità 3 offre sempre un candidato.', ['priorità A', 1], ['tempo', '0 ms']],
        ['Dopo 4 ms', 'La priorità di A è 1 + 2 = 3. In questo modello, a parità il dispatcher favorisce il flusso già in servizio.', ['priorità A', 3], ['A', 'pronto']],
        ['Dopo 6 ms', 'A guadagna il terzo punto e supera la priorità 3. Alla rivalutazione il dispatcher sceglie A.', ['priorità A', 4], ['core', 'A']]]]
    });
  unit('3.5',    'Quanti millisecondi servono per completare entrambe le code?', [range('n','Lavori iniziali sul core 0',3,9,6),menu('balance','Assegnazione',[['keep','Conserva le code'],['move','Bilancia prima di partire']])], p=>{
      const moved=p.balance==='move'?Math.floor((p.n-1)/2):0, a=p.n-moved, b=1+moved;
      return [frame('Code iniziali','Tutti i lavori possono usare entrambi i core.',[['core 0',p.n],['core 1',1]]),
        frame('Distribuzione','Il numero di lavori trasferiti dal core 0 al core 1 è '+moved+'.',[['core 0',a],['core 1',b]]),
        frame('Completamento','I due core lavorano in parallelo. Prevale la durata della coda più lunga.',[['tempo totale (ms)',Math.max(a,b)],['inattività complessiva (core·ms)',Math.abs(a-b)]])];
    });

  unit('4.1',    'Quale valore legge T2 dalla cella condivisa h?', [range('x','Valore scritto da T1',1,31,9)], p=>[
      frame('Creazione','Entrambi ricevono un puntatore alla cella h nell’heap. Il registro r di T2 vale 3.',[['h',0],['r di T2',3]]),
      frame('Scrittura','T1 carica il dato nel proprio registro e lo copia in h. I registri di T2 conservano il loro contenuto.',[['r di T1',p.x],['h',p.x],['r di T2',3]]),
      frame('Lettura dopo la sincronizzazione','T2 dereferenzia il suo puntatore e assegna il valore a r.',[['h visto da T2',p.x],['r di T2',p.x]])]);
  unit('4.2',    'Dopo quanti millisecondi termina l’ultimo gruppo di thread?', [range('n','Thread da 1 ms',2,8,5), range('k','Core disponibili',1,4,2)], p=>{
      const turns=Math.ceil(p.n/p.k);
      return [frame('Ingresso','Tutti i thread arrivano al tempo 0.',[['pronti',p.n],['core',p.k]]),
        frame('Primo turno','Il dispatcher assegna al massimo un thread a ciascun core. Gli altri attendono.',[['in parallelo',Math.min(p.n,p.k)],['in coda',Math.max(0,p.n-p.k)]]),
        frame('Ultimo turno','Dopo '+(turns-1)+' turni completi si eseguono gli ultimi lavori.',[['thread nell’ultimo turno',p.n-(turns-1)*p.k],['durata totale (ms)',turns]])];
    });
  unit('4.3',    'Quanti altri thread utente possono eseguire simultaneamente mentre U1 attende i dati?', [menu('k','Associazione di 4 thread utente',[['1','Molti a uno'],['2','Molti a molti su 2 worker'],['4','Uno a uno']])], p=>{
      const k=Number(p.k);
      return [frame('Prima dell’I/O','Quattro core sono disponibili. Il kernel può eseguire al più un thread per worker.',[['thread utente',4],['worker eseguibili',k]]),
        frame('U1 chiede I/O','Il worker che esegue U1 si blocca nel kernel, in attesa del dispositivo.',[['worker bloccati',1],['worker utilizzabili',k-1]]),
        frame('Durante l’attesa','Gli altri tre thread utente sono pronti. La disponibilità dei worker limita il parallelismo.',[['thread pronti oltre U1',3],['massimo simultaneo',Math.min(3,k-1)]])];
    });
  cases('4.4',    'Quanti valori distinti leggono i thread avviati con successo?', 'Passaggio degli argomenti e avvio', {
      el: ['Una cella per worker', [
        ['Creazione', 'Il thread che li crea alloca tre celle nel proprio blocco, le inizializza a 0, 1 e 2 e passa a ogni worker il puntatore a una cella distinta.', ['argomenti', '&a[0], &a[1], &a[2]'], ['array', 'in vita']],
        ['Barriera', 'Il padre completa il lancio e apre la barriera. I worker leggono ciascuno la propria cella.', ['letture', '0, 1, 2'], ['celle', 3]],
        ['Raccolta', 'Il thread creatore esegue tre join mentre l’array è ancora in vita.', ['join completati', 3], ['indici distinti', 3]]]],
      loop: ['Una cella condivisa per il ciclo', [
        ['Creazione', 'La variabile i è dichiarata fuori dal ciclo e rimane in vita fino a dopo i join. Ogni worker riceve &i. Un cancello di avvio impedisce le letture durante gli incrementi.', ['argomenti', '&i, &i, &i'], ['celle', 1]],
        ['Barriera', 'Dopo il ciclo i vale 3. Il padre apre la barriera, rendendo visibile l’ultimo valore.', ['letture', '3, 3, 3'], ['i', 3]],
        ['Raccolta', 'Il thread creatore esegue i join prima di uscire dal blocco che contiene i. I tre worker hanno letto lo stesso valore.', ['join completati', 3], ['indici distinti', 1]]]],
      error: ['Il terzo pthread_create fallisce', [
        ['Lancio', 'Il creatore inizializza tre celle distinte. Registra gli identificativi dei primi due worker solo dopo il successo di pthread_create. I due worker attendono il segnale di avvio.', ['thread creati', 2], ['celle valide', 3]],
        ['Errore al terzo tentativo', 'La terza chiamata restituisce EAGAIN. Il creatore interrompe il lancio. Sotto mutex imposta il predicato di avvio e risveglia tutti i worker creati, che lo ricontrollano.', ['terzo thread', 'assente'], ['worker da risvegliare', 2]],
        ['Raccolta dei successi', 'I due worker leggono le celle 0 e 1. Il creatore chiama pthread_join solo sui due identificativi validi e poi esce dal blocco che contiene l’array.', ['join completati', 2], ['indici distinti', 2]]]]
    });
  cases('4.5',    'Quanti lavoratori di servizio sopravvivono al guasto di B?', 'Organizzazione dei lavoratori', {
      threads: ['Tre thread in un processo', [
        ['Avvio', 'Il supervisore avvia un processo di servizio con i lavoratori A, B e C.', ['processi di servizio', 1], ['thread lavoratori', 3]],
        ['Guasto', 'B accede a una pagina inaccessibile e il processo riceve SIGSEGV con azione predefinita.', ['spazio interessato', 'A, B, C'], ['responsabile dell’accesso', 'B']],
        ['Esito', 'La terminazione del servizio termina tutti i suoi thread. Il supervisore esterno può riavviarlo.', ['lavoratori superstiti', 0], ['supervisore', 'attivo']]]],
      procs: ['Tre processi separati', [
        ['Avvio', 'Il supervisore distribuisce le richieste a tre processi monothread tramite pipe.', ['processi di servizio', 3], ['thread lavoratori', 3]],
        ['Guasto', 'L’accesso fuori mappatura causa la terminazione del solo processo B.', ['processo terminato', 'B'], ['spazi distinti', 3]],
        ['Esito', 'A e C continuano. Il supervisore raccoglie B e può avviare un sostituto.', ['lavoratori superstiti', 2], ['supervisore', 'attivo']]]]
    });

  // Tracce dei singoli accessi: il modello sequenzialmente consistente è esplicito.
  function incrementTrace(start, order) {
    let shared=start;
    const registers={A:'—',B:'—'};
    return order.map(([who, op])=>{
      let narrative;
      if (op==='R') {
        registers[who]=shared;
        narrative=who+' legge '+shared+' dalla cella condivisa.';
      } else {
        shared=registers[who]+1;
        narrative=who+' scrive il valore letto ('+registers[who]+') più uno.';
      }
      return frame(who+' · '+(op==='R'?'lettura':'scrittura'),narrative,[['cella',shared],['lettura A',registers.A],['lettura B',registers.B]]);
    });
  }
  const interleaved=[['A','R'],['B','R'],['A','W'],['B','W']];
  const serial=[['A','R'],['A','W'],['B','R'],['B','W']];
  unit('5.1',    'Quale valore contiene la cella dopo la scrittura di B?', [range('x','Contatore iniziale',0,20,4),menu('ordine','Ordine degli accessi',[['inter','Letture consecutive'],['ser','Un incremento completo per volta']])],p=>incrementTrace(p.x,p.ordine==='inter'?interleaved:serial));
  unit('5.2',    'Quale valore rimane nel contatore con la zona protetta scelta?', [menu('zona','Zona protetta',[['write','Sola scrittura'],['all','Lettura e scrittura']])], p=>{
      const all=p.zona==='all';
      return [frame('Confine del mutex',all?'Ogni worker acquisisce M prima di leggere e lo rilascia dopo aver scritto.':'Ogni worker legge prima di acquisire M. Le due scritture sono poi serializzate.',[['cella iniziale',10],['protocollo',all?'lock → read → write → unlock':'read → lock → write → unlock']])].concat(incrementTrace(10,all?serial:interleaved));
    });
  unit('5.3',    'Quale totale legge il creatore dopo entrambi i join?', [range('n','Incrementi per ciascuno dei due lavoratori',1,6,3)], p=>{
      const out=[frame('Inizializzazione','Il padre imposta il contatore a zero e crea A e B.',[['contatore',0],['mutex','libero']])];
      for(let i=0;i<2*p.n;i++){
        const name=i%2?'B':'A';
        out.push(frame('Ingresso di '+name, name+' acquisisce M, legge '+i+', scrive '+(i+1)+' e rilascia M.',[['totale dopo il rilascio',i+1],['mutex','libero']]));
      }
      out.push(frame('Dopo i due join','Tutti gli aggiornamenti sono terminati. La somma si verifica moltiplicando il numero di lavoratori per gli incrementi di ciascuno.',[['incrementi attesi',2*p.n],['totale letto',2*p.n]]));
      return out;
    });
  cases('5.4',    'Qual è il minimo valore che il consumatore può leggere per dato dopo aver osservato pronto = 1?', 'Ordine di memoria', {
      ra:['Flag release/acquire',[
        ['Produttore','Il produttore scrive 42 in dato con ordine relaxed, poi pubblica pronto con release.', ['dato scritto',42],['flag scritto',1]],
        ['Consumatore','La lettura acquire del flag restituisce 1 dalla pubblicazione del produttore.', ['flag letto',1],['relazione','synchronizes-with']],
        ['Lettura del dato','La scrittura dei dati precede la lettura del consumatore nella relazione happens-before. Nessun altro thread scrive dato.', ['valori ammessi',42],['dato pubblicato','visibile']]]],
      relaxed:['Flag relaxed',[
        ['Produttore','Il produttore scrive 42 in dato e poi 1 nel flag. Entrambe le scritture sono relaxed.', ['dato scritto',42],['flag scritto',1]],
        ['Consumatore','Il consumatore legge 1 dal flag con ordine relaxed.', ['flag letto',1],['sincronizzazione tra thread','assente']],
        ['Lettura del dato','Il modello di memoria consente alla successiva lettura relaxed di dato di osservare il valore iniziale o quello pubblicato.', ['valori ammessi','0 oppure 42'],['oggetti atomici',2]]]]
    });
  unit('5.5',    'Quanti millisecondi di CPU usa B durante l’attesa del lock?', [range('d','Durata residua del proprietario (ms)',1,10,4),menu('mode','Attesa',[['spin','Spin continuo'],['block','Sospensione immediata']])],p=>{
      const spin=p.mode==='spin';
      return [frame('Contesa','A detiene M e B tenta di entrare sulla seconda CPU.',[['M','A'],['residuo A (ms)',p.d]]),
        frame('Durante la sezione critica',spin?'B resta in esecuzione e ripete il tentativo sul secondo core.':'Il kernel sospende B. Il secondo core può eseguire altro lavoro.',[['stato B',spin?'in esecuzione':'bloccato'],['CPU di B durante l’attesa (ms)',spin?p.d:0]]),
        frame('Rilascio','A rilascia M. Con B unico contendente, B ottiene il mutex al proprio prossimo tentativo o dopo il risveglio.',[['attesa trascorsa (ms)',p.d],['nuovo proprietario','B']])];
    });
  function semaphoreTrace(initial, ops) {
    let permits=initial;
    const waiters=[];
    return ops.map(([op,thread])=>{
      let msg;
      if(op==='wait' && permits>0){permits--;msg=thread+' riceve un permesso e prosegue.';}
      else if(op==='wait'){waiters.push(thread);msg=thread+' entra nella coda dei bloccati.';}
      else if(waiters.length){const w=waiters.shift();msg=thread+' trasferisce il permesso a '+w+', che diventa pronto.';}
      else {permits++;msg=thread+' deposita un permesso disponibile.';}
      return frame(thread+' · '+op,msg,[['permessi liberi',permits],['bloccati',waiters.join(', ')||'nessuno']]);
    });
  }
  unit('5.6',    'Quanti permessi liberi restano dopo le due wait e le due signal?', [range('s','Permessi iniziali',0,3,1)],p=>semaphoreTrace(p.s,[['wait','A'],['wait','B'],['signal','P'],['signal','Q']]));
  unit('5.7',    'Quante conferme ricevono in tutto i due richiedenti?', [menu('conf','Protezione del posto',[['split','Controllo prima del lock'],['together','Controllo e prenotazione sotto lock'],['cas','Prenotazione con compare-exchange']])],p=>{
      if(p.conf==='cas')return [
        frame('Disponibilità iniziale','Il posto è una cella atomica che vale uno. A e B preparano ciascuno una variabile locale atteso = 1.',[['posti liberi',1],['conferme',0]]),
        frame('Primo confronto e scambio','A esegue compare_exchange_strong con valore atteso 1 e valore desiderato 0. Il confronto riesce: A occupa il posto e invia una conferma.',[['posti liberi',0],['conferme',1]]),
        frame('Secondo confronto e scambio','B presenta ancora atteso = 1. Il confronto fallisce e riscrive nella variabile locale di B il valore osservato, zero. B sa ora che il posto è occupato e chiude la richiesta.',[['posti liberi',0],['atteso di B',0],['conferme',1]])];

      const split=p.conf==='split';
      return [frame('Ultimo posto','A e B chiedono di occupare la stessa poltrona.',[['posti liberi',1],['conferme',0]]),
        frame('Controllo',split?'A e B leggono libero prima di prendere il lock. Entrambi memorizzano un esito positivo.':'A prende il lock e verifica che la poltrona è libera. B resta in attesa del lock.',[['A','ammesso'],['B',split?'ammesso':'in attesa']]),
        frame('Registrazione',split?'A e B scrivono occupato in successione. Le due conferme fanno riferimento alla stessa poltrona.':'A registra la prenotazione e rilascia il lock. B entra, trova la poltrona occupata e rinuncia.',[['posti liberi',0],['conferme',split?2:1]])];
    });

  unit('6.1',    'Quanti posti restano liberi dopo la pubblicazione del primo elemento?', [range('cap','Capacità del buffer',2,8,4)],p=>[
      frame('Buffer vuoto','Il mutex è libero e tutti gli spazi possono essere prenotati.',[['vuoti',p.cap],['pieni',0],['in transito',0]]),
      frame('wait(vuoti)','Il produttore acquisisce il diritto di occupare uno spazio.',[['vuoti',p.cap-1],['pieni',0],['in transito',1]]),
      frame('Inserimento sotto mutex','Il produttore scrive l’elemento e avanza l’indice. Il consumatore deve ancora ricevere il permesso di leggerlo.',[['elementi fisici',1],['pieni',0],['in transito',1]]),
      frame('signal(pieni)','Il produttore pubblica l’elemento. La somma dei due contatori torna alla capacità.',[['vuoti',p.cap-1],['pieni',1],['in transito',0]])]);
  cases('6.2',    'Con l’ordine scelto il consumatore riesce a liberare il primo slot?', 'Ordine del produttore', {
      good:['wait(vuoti) prima del mutex',[
        ['Buffer pieno','Il produttore P invoca wait(vuoti) e si blocca. Il mutex è disponibile.', ['vuoti',0],['mutex','libero']],
        ['Rimozione','C acquisisce un permesso pieni, prende il mutex, rimuove l’elemento e rilascia il mutex.', ['occupazione',0],['mutex','libero']],
        ['Segnalazione','C segnala vuoti. Il permesso riservato a P lo rende pronto e P potrà acquisire il mutex.', ['P','pronto'],['permesso per P',1]]]],
      bad:['Mutex prima di wait(vuoti)',[
        ['Acquisizione','P prende il mutex mentre il buffer è pieno.', ['vuoti',0],['mutex','P']],
        ['Attesa di spazio','P si blocca su vuoti conservando il mutex. C acquisisce il permesso pieni e tenta di prendere il mutex.', ['P','attende vuoti'],['C','attende mutex']],
        ['Ciclo','La rimozione di C è l’unico evento che potrebbe restituire spazio a P. Entrambi i thread restano bloccati.', ['occupazione',1],['dipendenze','P → C → P']]]]
    });
  cases('6.3',    'Quando C1 riacquisisce il mutex, il predicato è vero o falso?', 'Chi acquisisce il mutex dopo la produzione?', {
      first:['C1 riprende per primo',[
        ['Attesa','C1 trova la coda vuota e chiama cond_wait.', ['elementi',0],['mutex','libero durante l’attesa']],
        ['Pubblicazione','P inserisce un elemento sotto mutex, segnala la condizione e rilascia il mutex.', ['elementi',1],['C1','in attesa di riacquisire']],
        ['Ricontrollo','C1 acquisisce il mutex, verifica elementi > 0 e rimuove l’elemento.', ['predicato al controllo','vero'],['elementi finali',0]]]],
      second:['C2 arriva prima di C1',[
        ['Attesa','C1 trova la coda vuota e chiama cond_wait, liberando il mutex.', ['elementi',0],['C1','in attesa']],
        ['Intercalazione','P pubblica un elemento e segnala. C2 prende il mutex per primo e consuma l’elemento.', ['elementi',0],['ultimo consumatore','C2']],
        ['Ricontrollo','C1 riacquisisce il mutex, trova falso il predicato e torna ad attendere.', ['predicato al controllo','falso'],['rimozioni di C1',0]]]]
    });
  cases('6.4',    'Dopo l’uscita di L1, quanti lettori stanno ancora leggendo?', 'Politica di ammissione', {
      readers:['Precedenza ai lettori',[
        ['Primo lettore','L1 legge. S arriva e deve aspettare l’uscita del gruppo.', ['lettori attivi',1],['in attesa','S']],
        ['Secondo lettore','L2 arriva e può aggiungersi a L1 prima dello scrittore.', ['lettori attivi',2],['in attesa','S']],
        ['Uscita di L1','L2 legge ancora. Se nuovi lettori continuano ad arrivare, S può attendere indefinitamente.', ['lettori attivi',1],['S','in attesa']]]],
      fair:['Ordine di arrivo',[
        ['Primo lettore','L1 legge. S entra nella coda di accesso.', ['lettori attivi',1],['in attesa','S']],
        ['Secondo lettore','L2 si presenta dopo S e si accoda.', ['lettori attivi',1],['in attesa','S, L2']],
        ['Uscita di L1','Lo scrittore in testa entra in esclusiva. L2 attende il rilascio.', ['scrittore attivo','S'],['lettori attivi',0]]]]
    });
  function twoLocks(ordered) {
    const second=ordered?'X':'Y';
    return [frame('Prima acquisizione','A acquisisce X. B tenta '+second+'.', [['X','A'],['Y',ordered?'libero':'B'],['B',ordered?'bloccato su X':'possiede Y']]),
      frame('Seconda acquisizione',ordered?'A richiede Y, che è libero. Ora possiede entrambe le risorse.':'A richiede Y e si blocca. B richiede X e si blocca.', [['X','A'],['Y',ordered?'A':'B'],['A',ordered?'in sezione critica':'bloccato su Y']]),
      frame('Progresso',ordered?'A rilascia Y e X. B può acquisire X e poi Y nello stesso ordine.':'Ciascun partecipante attende un rilascio dell’altro. Ogni risorsa ha una sola istanza e viene trattenuta fino alla seconda acquisizione.', [['dipendenze',ordered?'B → A, poi nessuna':'A → B → A'],['esito',ordered?'entrambi completano':'deadlock']])];
  }
  unit('6.5',    'Con l’ordine scelto, entrambi i thread completano oppure restano in deadlock?', [menu('ordine','Acquisizioni di B',[['rev','Y poi X'],['ord','X poi Y']])],p=>twoLocks(p.ordine==='ord'));
  cases('7.1',    'Il ciclo osservato conduce al deadlock o permette il completamento?', 'Istanze assegnate', {
      one:['X e Y con una sola istanza',[
        ['Assegnazione','A possiede X e B possiede Y. Le risorse hanno una sola istanza.', ['archi','X → A, Y → B'],['istanze di Y',1]],
        ['Richiesta','A chiede Y e B chiede X mantenendo le assegnazioni.', ['archi richieste','A → Y, B → X'],['libere',0]],
        ['Chiusura','Il ciclo A → Y → B → X → A comprende entrambi i possessori. Nessun altro processo può rilasciare X o Y.', ['processi bloccati',2],['esito','deadlock']]]],
      multi:['Seconda istanza di Y in mano a C',[
        ['Assegnazione','A possiede X, B e C possiedono ciascuno una delle due istanze di Y. C può completare da solo.', ['istanze di X',1],['istanze di Y',2]],
        ['Richiesta','A chiede una Y, B chiede X. Nel grafo compare ancora il ciclo A → Y → B → X → A.', ['richiedenti bloccati','A, B'],['C','eseguibile']],
        ['Rilascio esterno','C termina e libera una Y per A. A completa e restituisce X a B.', ['ordine possibile','C → A → B'],['esito','completamento possibile']]]]
    });
  cases('7.2',    'Quale condizione di Coffman viene esclusa dalla regola scelta?', 'Regola imposta', {
      rank:['Rango crescente X < Y',[
        ['Prima richiesta','A e B devono entrambi iniziare da X. A arriva per primo.', ['X','A'],['Y','libero']],
        ['Durante l’attesa','B aspetta X senza detenere Y. A può prendere Y senza tornare verso ranghi minori.', ['B','attende X'],['A','possiede X, Y']],
        ['Proprietà','Lungo una catena di successive acquisizioni i ranghi aumentano. L’ultimo arco necessario a tornare al rango iniziale violerebbe la regola.', ['condizione eliminata','attesa circolare'],['A','può rilasciare']]]],
      set:['Prenotazione atomica dell’intero insieme',[
        ['Richiesta completa','A ottiene X e Y insieme. La richiesta di B arriva subito dopo.', ['X','A'],['Y','A']],
        ['Durante l’attesa','La prenotazione di B resta sospesa fino alla disponibilità di tutto l’insieme.', ['risorse detenute da B',0],['B','attende X e Y']],
        ['Proprietà','Chi deve attendere entra in coda a mani vuote. Dopo il rilascio B ottiene entrambe le risorse.', ['condizione eliminata','possesso durante l’attesa'],['nuovo possessore','B']]]]
    });
  function coordinates(amounts) { return '(' + amounts.join(', ') + ')'; }
  function safeSequence(available, jobs) {
    let work = available.slice();
    const left = jobs.slice(), steps = [];
    while (left.length) {
      const index = left.findIndex(j => j.need.every((n, i) => n <= work[i]));
      if (index < 0) break;
      const j = left.splice(index, 1)[0], before = work;
      work = work.map((n, i) => n + j.held[i]);
      steps.push({j, before, after: work});
    }
    return {steps, left};
  }
  unit('7.3',    'Quale stato assegna il test del banchiere alle disponibilità iniziali scelte?', [range('a','Istanze inizialmente libere di X',0,3,1),range('b','Istanze inizialmente libere di Y',1,3,1)],p=>{
      const jobs = [
        {name:'A', held:[1,0], max:[2,2]},
        {name:'B', held:[1,1], max:[2,1]},
        {name:'C', held:[1,0], max:[1,2]}
      ].map(j => ({...j, need:j.max.map((n,i)=>n-j.held[i])}));
      const result = safeSequence([p.a,p.b],jobs);
      const out = [
        frame('Assegnazioni e massimi','Le coordinate contano le risorse nell’ordine (X, Y). Sono libere '+coordinates([p.a,p.b])+'. Per ciascun processo si riportano assegnazione e massimo.',jobs.map(j=>[j.name, coordinates(j.held)+' / '+coordinates(j.max)])),
        frame('Bisogni residui','Si sottraggono le assegnazioni dai massimi dichiarati, componente per componente.',jobs.map(j=>[j.name,coordinates(j.need)]))
      ];
      result.steps.forEach(s=>out.push(frame('Completamento ipotetico di '+s.j.name,'Il bisogno '+coordinates(s.j.need)+' rientra nel disponibile '+coordinates(s.before)+'. Al completamento si recupera la dotazione iniziale '+coordinates(s.j.held)+'.',[['disponibili prima',coordinates(s.before)],['disponibili dopo',coordinates(s.after)]])));
      out.push(frame('Esame conclusivo',result.left.length?'Nessun bisogno residuo rientra nel disponibile. Lo stato è insicuro. Per accertare uno stallo attuale servono le richieste realmente pendenti.':'Ogni processo può soddisfare il proprio massimo seguendo la sequenza trovata.',[['sequenza',result.steps.map(s=>s.j.name).join(' → ')||'nessun passo'],['stato',result.left.length?'insicuro':'sicuro']]));
      return out;
    });
  cases('7.4',    'Quale transazione completa per prima dopo il rollback della vittima?', 'Transazione scelta per il rollback', {
      a:['Annulla A',[
        ['Rilevamento','Le transazioni A e B usano lock gestiti dal sistema transazionale. A possiede X e chiede Y. B possiede Y e chiede X.', ['X','A'],['Y','B']],
        ['Rollback di A','Il gestore annulla gli aggiornamenti di A tramite log, cancella la richiesta di Y e rilascia X.', ['richiesta rimossa','A → Y'],['lock rilasciato','X']],
        ['Ripartenza','B ottiene X, completa e rilascia entrambe le risorse. A può riprovare.', ['primo completamento','B'],['ciclo','sciolto']]]],
      b:['Annulla B',[
        ['Rilevamento','A possiede X e aspetta Y. B possiede Y e aspetta X. Le risorse sono gestite da transazioni reversibili.', ['X','A'],['Y','B']],
        ['Rollback di B','Il gestore ripristina i dati di B, cancella la richiesta di X e libera Y.', ['richiesta rimossa','B → X'],['lock rilasciato','Y']],
        ['Ripartenza','A ottiene Y e completa. Il gestore potrà ritentare B.', ['primo completamento','A'],['ciclo','sciolto']]]]
    });
  unit('7.5',    'Quale diagnosi è coerente con la ripetizione indefinita della sequenza scelta?', [menu('caso','Sequenza ripetuta',[['starve','Un nuovo lettore supera lo scrittore'],['live','Due worker cedono insieme']]),range('n','Giri osservati',2,6,3)],p=>{
      const starvation=p.caso==='starve';
      const out=[frame('Punto iniziale',starvation?'L0 legge e S aspetta l’accesso esclusivo. La politica ammette altri lettori.':'A e B partono insieme, ciascuno con un lock diverso. Al conflitto entrambi rilasciano il proprio lock.',[['completamenti',0],['in esame',starvation?'scrittore S':'worker A e B']])];
      for(let i=1;i<=p.n;i++) out.push(frame('Giro '+i, starvation?'Entra L'+i+' e poi esce L'+(i-1)+'. Rimane sempre un lettore attivo.':'A e B tentano il secondo lock, si ritirano e ripartono allo stesso istante.',[['operazioni completate',starvation?i:0],['stato osservato',starvation?'S ancora in coda':'entrambi pronti al nuovo tentativo']]));
      out.push(frame('Diagnosi con ripetizione indefinita',starvation?'I lettori completano richieste a ogni giro. La richiesta di S resta pendente.':'I tentativi impegnano entrambi i worker. Il contatore del lavoro terminato resta fermo.',[['diagnosi',starvation?'starvation':'livelock'],['giri osservati',p.n]]));
      return out;
    });

  // Prove preparatorie: ciascun riferimento identifica una specifica attività.
  const suffix={1:'processes',2:'process_control',3:'scheduling',4:'threads',5:'semaphores',6:'classical_sync',7:'deadlock'};
  function prova(ch,n,u,titolo,principio,varianti){
    const k='5.'+ch;
    (SL.prove[k]||(SL.prove[k]=[])).push({titolo,principio,unita:k+'.'+u,attivita:'cslez5_'+ch+'_0'+n+'_'+suffix[ch],varianti});
  }
  function num(label,answer,hint){return {label,answer:String(answer),numeric:true,hint};}
  function scelta(label,answer,choices,hint){return {label,answer,choices,hint};}
  function v(consegna,campi,svolgimento,codice){
    const item={consegna,campi,svolgimento};
    if(codice) item.codice=codice;
    return item;
  }
  const stato=['pronto','bloccato','in esecuzione','terminato'];

  prova(1,1,1,'Quante istanze possono eseguire insieme?',
    'Un processo monothread ha un solo flusso di esecuzione. Il parallelismo istantaneo è limitato sia dai processi pronti sia dai core disponibili.',
    [[5,1],[7,3]].map(([n,k])=>v(
    'Si avviano '+n+' istanze dello stesso eseguibile, tutte monothread e pronte. I core disponibili sono '+k+'. Considera il primo istante dopo l’assegnazione.',
    [num('Processi creati',n,'Conta le istanze avviate.'),num('Processi simultaneamente in esecuzione',k,'Ogni processo richiede un core.')],
    ['Ogni avvio crea un’identità di processo: i PID distinti sono '+n+'.','Ogni core ospita un solo flusso nel modello. Il massimo simultaneo vale min('+n+', '+k+') = '+k+'.','Gli altri '+(n-k)+' processi attendono pronti. La multiprogrammazione permette di alternarli nei turni successivi.'])));
  prova(1,2,2,'Seguire le transizioni di A',
    'Dopo il completamento di una lettura, il processo torna pronto e attende l’assegnazione del core prima di eseguire. Anche un processo che esaurisce il quanto torna pronto se ha ancora lavoro da svolgere.',
    [
    v('Su un core A richiede una lettura bloccante su disco. Il dato è ancora in transito e arriverà mentre B usa il core. B conserva il proprio quanto.',[scelta('A dopo la richiesta','bloccato',stato,'Verifica se servirebbe il core o il dispositivo.'),scelta('A subito dopo il completamento','pronto',stato,'B continua a eseguire.')],
      ['La lettura richiede un evento esterno. A passa da in esecuzione a bloccato.','Durante l’I/O il dispatcher assegna il core a B.','Il completamento rimuove il motivo di blocco e inserisce A fra i pronti.']),
    v('Su un core A esaurisce il proprio quanto. B è già pronto. Round-robin serve B, poi B termina e il dispatcher assegna il core ad A.',[scelta('A durante il turno di B','pronto',stato,'A può usare la CPU appena viene scelto.'),scelta('A dopo la seconda assegnazione','in esecuzione',stato,'Osserva chi ha ricevuto il core.')],
      ['La scadenza rimette A in fondo alla coda dei pronti.','B viene estratto dalla testa e usa il core. A attende soltanto il suo turno.','Terminato B, il dispatcher carica il contesto di A e A passa in esecuzione.'])]);
  prova(1,3,3,'Individuare il contesto da ripristinare',
    'Un interrupt fra due istruzioni permette di salvare l’indirizzo del prossimo prelievo nel PC del processo. L’heap resta nelle pagine associate al suo spazio di indirizzi.',
    [[0x100,3],[0x240,5]].map(([base,n])=>v(
    'A esegue '+n+' istruzioni consecutive da 4 byte a partire da 0x'+base.toString(16)+'. Un interrupt arriva fra istruzioni e il kernel sceglie B.',
    [num('PC da salvare per A',base+4*n,'Avanza di quattro byte per ogni istruzione completata.'),scelta('Dove rimangono i byte dell’heap di A?','nelle pagine del processo',['nel registro PC','nelle pagine del processo','nella coda dei pronti'],'Distingui il contenuto della memoria dai riferimenti del kernel.')],
    ['Il PC iniziale vale '+base+' in decimale. A percorre '+n+' × 4 = '+(4*n)+' byte.','Il prossimo prelievo è a '+(base+4*n)+' (0x'+(base+4*n).toString(16)+'). Il kernel conserva questo PC con i registri e il puntatore allo stack.','L’heap rimane nelle pagine dello spazio di A. Al ritorno il kernel ripristina i registri e la traduzione degli indirizzi.'])));
  prova(1,4,3,'Separare risposta e costo dei cambi',
    'Il tempo di risposta va dall’arrivo alla prima esecuzione. Sul core condiviso occorre contare separatamente i turni degli altri processi e i cambi di contesto che precedono l’assegnazione.',
    [[2,1],[4,2]].map(([q,s])=>v(
    'A, B, C e D arrivano al tempo 0 in questo ordine. Round-robin su un core, burst tutti più lunghi del quanto di '+q+' ms. Ogni passaggio fra processi costa '+s+' ms. La prima assegnazione è gratuita.',
    [num('Tempo di risposta di D (ms)',3*(q+s),'Conta i turni e i cambi prima del primo avvio di D.'),num('Tempo speso in cambi prima di D (ms)',3*s,'Enumera A→B, B→C e C→D.')],
    ['Prima di D eseguono A, B e C: i loro quanti occupano 3 × '+q+' = '+(3*q)+' ms.','Fra l’inizio di A e l’inizio di D avvengono tre cambi, per 3 × '+s+' = '+(3*s)+' ms.','D inizia al tempo '+(3*q+3*s)+' ms. Sottraendo il suo arrivo al tempo 0 si ottiene la stessa durata per la risposta.'])));
  prova(1,5,2,'Assegnare i pronti ai core',
    'Lo scheduler sceglie fra i processi pronti e il dispatcher assegna loro un core. Quelli sospesi per un evento di rete restano nel gruppo dei bloccati finché il dispositivo segnala il completamento.',
    [[2,5,1],[3,7,2]].map(([k,n,b])=>v(
    'Il sistema ha '+k+' core liberi e '+n+' processi monothread. I processi in attesa di una risposta di rete sono '+b+'. Gli altri possono eseguire. Il dispatcher riempie tutti i core disponibili.',
    [num('Pronti rimasti in coda',n-b-k,'Togli prima i bloccati, poi i processi assegnati.'),num('Bloccati dopo l’assegnazione',b,'Quale evento completerebbe una richiesta di rete?')],
    ['I processi candidati sono '+n+' − '+b+' = '+(n-b)+'.','Il dispatcher ne assegna '+k+' ad altrettanti core. In coda ne restano '+(n-b-k)+'.','Le richieste di rete pendenti restano '+b+'. Sommando i processi in esecuzione, pronti e bloccati si ritrova il totale di '+n+'.'])));

  prova(2,1,1,'Decodificare il ritorno di fork',
    'Alla riuscita di fork il padre ottiene il PID del figlio e il figlio ottiene zero. Un errore restituisce −1 al chiamante e lascia invariato il numero dei processi.',
    [[232,0],[517,1]].map(([pid,fail])=>{
    const ret=fail?-1:pid;
    return v('Il processo 200 chiama fork. '+(fail?'Il limite dei processi è raggiunto e la chiamata fallisce.':'La chiamata ha successo e il kernel assegna al figlio il PID '+pid+'.'),
      [num('Valore restituito al chiamante originario',ret,'Nel padre un successo identifica il figlio. Un errore ha un valore convenzionale negativo.'),num('Figli creati da questa chiamata',fail?0:1,'In caso di successo compare una sola nuova identità.')],
      [fail?'Il kernel rileva il limite e interrompe la creazione.':'Il kernel crea il processo '+pid+' con una copia del contesto.','Nel chiamante originario il ritorno vale '+ret+'.',fail?'Esiste solo il ramo di errore: figli creati = 0.':'Il nuovo processo riceve 0 e percorre il ramo figlio: figli creati = 1.']);
  }));
  prova(2,2,1,'Memoria privata e offset condiviso',
    'Dopo fork una scrittura su una mappatura privata interessa la copia del processo che scrive. I descrittori ereditati continuano invece a riferirsi alla stessa descrizione aperta e al suo offset.',
    [[7,4],[12,6]].map(([x,n])=>v(
    'Prima di fork il padre apre un file regolare all’offset 0 e imposta la variabile privata x = '+x+'. Il figlio incrementa x, legge '+n+' byte dal descrittore ereditato e termina. Il padre lo attende, poi esamina x e l’offset.',
    [num('x nel padre',x,'La variabile si trova in una mappatura privata.'),num('Offset del file nel padre',n,'I due descrittori rimandano alla stessa descrizione di file aperto.')],
    ['Subito dopo fork entrambi leggono x = '+x+'. Il descrittore punta in entrambi alla stessa descrizione aperta.','La scrittura del figlio aggiorna la propria copia a '+(x+1)+'. Nel padre x resta '+x+'.','La lettura completata avanza l’unico offset di '+n+' byte. Dopo l’attesa il padre trova offset '+n+'.'])));
  prova(2,3,3,'Verificare ciò che sopravvive a exec',
    'Una execve riuscita sostituisce il programma del chiamante. Il kernel conserva l’identità del processo e valuta separatamente il flag FD_CLOEXEC di ciascun descrittore.',
    [[78,3,4],[95,7,8]].map(([pid,a,b])=>v(
    'Il processo '+pid+' ha due descrittori aperti: '+a+' senza flag e '+b+' marcato FD_CLOEXEC. execve ha successo.',
    [num('PID della nuova immagine',pid,'execve opera sul processo chiamante.'),num('Quale dei due descrittori resta aperto?',a,'Il flag è valutato al caricamento riuscito.')],
    ['Il kernel sostituisce codice, dati e stack con la nuova immagine.','L’identità del processo resta '+pid+' e il programma inizia dal nuovo punto di ingresso.','Il kernel chiude fd '+b+' per FD_CLOEXEC. Il descrittore '+a+' rimanda ancora alla stessa descrizione aperta.'])));
  prova(2,4,4,'Raccogliere una terminazione normale',
    'Un figlio terminato può lasciare nel kernel un record di uscita in attesa del padre. waitpid raccoglie quel record e rende disponibile lo stato da interpretare con WIFEXITED e WEXITSTATUS.',
    [[813,4],[942,21]].map(([pid,s])=>v(
    'Il figlio '+pid+' effettua _exit('+s+'). Il padre, unico raccoglitore, invoca waitpid soltanto un secondo più tardi. Si applica la gestione ordinaria di SIGCHLD.',
    [scelta('Stato del figlio nell’intervallo','zombie',['orfano','zombie','pronto'],'La CPU ha terminato il calcolo. Il padre è ancora vivo.'),num('WEXITSTATUS dopo la raccolta',s,'Lo stato va interpretato dopo il controllo WIFEXITED.')],
    ['Il figlio ha terminato. Il kernel conserva PID e risultato in attesa della raccolta: il record è uno zombie.','waitpid('+pid+', …) restituisce '+pid+' e consegna lo stato al padre.','La terminazione è normale, dunque WIFEXITED è vero e WEXITSTATUS restituisce '+s+'. Il record è ora raccolto.'])));
  prova(2,5,2,'Contare i discendenti nei rami condizionali',
    'Ciascun fork riuscito aggiunge un processo. I rami successivi dipendono dal valore restituito a ogni chiamante, quindi una chiamata scritta una sola volta può essere eseguita da più processi.',
    [true,false].map(parent=>v(
    'Un solo processo esegue il frammento. Ogni fork riesce e ciascun ramo raggiunge fine(). Segui il confronto '+(parent?'r > 0':'r >= 0')+' separatamente nel padre e nel figlio.',
    [num('Processi che raggiungono fine()',parent?3:4,'Disegna il primo bivio e applica la condizione in ciascun ramo.'),num('Chiamate a fork eseguite in totale',parent?2:3,'Conta le invocazioni effettive, una per processo chiamante.')],
    ['Il primo fork produce il padre con r > 0 e il figlio con r = 0.',parent?'Soltanto r > 0 supera il controllo: il padre crea un altro figlio.':'Entrambi soddisfano r >= 0: ognuno crea un ulteriore figlio.','Le chiamate sono '+(parent?2:3)+'. Ogni successo aggiunge un processo, quindi a fine() arrivano 1 + '+(parent?2:3)+' = '+(parent?3:4)+' processi.'],
    'pid_t r = fork();\nif (r '+(parent?'>':'>=')+' 0) {\n    fork();\n}\nfine();')));

  prova(3,1,1,'Misurare le attese su una traccia',
    'Il tempo di risposta va dall’arrivo al primo utilizzo della CPU e il turnaround dall’arrivo al completamento. L’attesa complessiva è la somma degli intervalli trascorsi nella coda dei pronti.',
    [[2,5,7,10,12],[1,3,6,8,11]].map(([a,b,c,d,e])=>v(
    'P arriva a '+a+' ms, gira da '+b+' a '+c+', torna pronto e gira di nuovo da '+d+' a '+e+', quando termina. Tutti i tempi sono in ms e P trascorre gli intervalli fuori CPU nella coda dei pronti.',
    [num('Tempo di risposta (ms)',b-a,'Usa solo il primo avvio.'),num('Attesa totale (ms)',b-a+d-c,'Somma entrambi gli intervalli nella coda.'),num('Turnaround (ms)',e-a,'Misura dall’arrivo al completamento.')],
    ['Il primo avvio dà risposta = '+b+' − '+a+' = '+(b-a)+' ms.','L’attesa aggiuntiva dopo la prima esecuzione è '+d+' − '+c+' = '+(d-c)+' ms. L’attesa totale è '+(b-a+d-c)+' ms.','Il turnaround è '+e+' − '+a+' = '+(e-a)+' ms. Verifica: attesa '+(b-a+d-c)+' + CPU '+(c-b+e-d)+' = '+(e-a)+'.'])));
  prova(3,2,2,'Costruire il diagramma FCFS',
    'In FCFS la CPU serve le richieste nell’ordine di arrivo. Con arrivi simultanei e spareggio assegnato, ogni attesa è la somma dei burst che precedono il processo.',
    [[9,3,2],[6,6,3]].map(([a,b,c])=>v(
    'A, B, C sono pronti al tempo 0 e serviti in questo ordine da FCFS senza costi di cambio. I burst sono '+a+', '+b+' e '+c+' ms.',
    [num('Attesa media (ms)',(2*a+b)/3,'Ricava separatamente l’inizio di A, B e C.'),num('Completamento di C (ms)',a+b+c,'Il core lavora senza intervalli inattivi.')],
    ['A parte a 0 e termina a '+a+'. B parte a '+a+' e termina a '+(a+b)+'.','C parte a '+(a+b)+' e termina a '+(a+b+c)+'. Le attese sono 0, '+a+' e '+(a+b)+' ms.','Dividendo la loro somma per tre si ottiene '+((2*a+b)/3)+' ms. Il completamento finale uguaglia la somma dei burst.'])));
  prova(3,3,2,'Confrontare SJF e SRTF all’arrivo di B',
    'SJF senza prelazione mantiene il processo corrente fino al termine del burst. SRTF (shortest remaining time first) può assegnare la CPU al nuovo arrivato se ha un tempo residuo inferiore a quello del processo in esecuzione.',
    [[9,2,3],[8,3,2]].map(([a,t,b])=>v(
    'A arriva al tempo 0 con burst '+a+' ms. B arriva al tempo '+t+' con burst '+b+' ms. I lavori sono soltanto A e B e il costo di cambio è nullo. SJF è qui senza prelazione.',
    [num('Completamento di B con SJF (ms)',a+b,'A mantiene il core fino al termine del burst.'),num('Completamento di B con SRTF (ms)',t+b,'Confronta il burst di B col residuo di A al suo arrivo.')],
    ['All’arrivo di B il residuo di A vale '+a+' − '+t+' = '+(a-t)+' ms.','SJF lascia terminare A. B occupa il core da '+a+' a '+(a+b)+' ms.','SRTF sceglie B perché '+b+' < '+(a-t)+'. B va da '+t+' a '+(t+b)+' ms, poi A riprende fino a '+(a+b)+'.'])));
  prova(3,4,3,'Contare turni e prima risposta in round-robin',
    'Un turno round-robin dura al massimo un quanto. Un processo che termina prima lascia subito il core al successivo, mentre un processo con lavoro residuo si accoda di nuovo.',
    [[2,5,3,1],[3,7,2,4]].map(([q,a,b,c])=>{
    const timeline=rr([['A',a],['B',b],['C',c]],q,0), first=timeline.find(s=>s.name==='C').start;
    return v('A, B, C arrivano insieme in quest’ordine con burst '+a+', '+b+', '+c+' ms. Il quanto è '+q+' ms. I cambi sono istantanei. Un turno è una porzione di al più un quanto anche quando resta un solo processo.',
      [num('Prima risposta di C (ms)',first,'Misura i primi turni di A e B.'),num('Turni complessivi',timeline.length,'Dividi ogni burst per il quanto arrotondando per eccesso.')],
      ['Il primo giro usa '+Math.min(q,a)+' ms per A e '+Math.min(q,b)+' per B. C inizia a '+first+' ms.','La traccia è '+timeline.map(s=>s.name+' ['+s.start+', '+s.end+')').join(', ')+'.','I turni per A, B, C sono '+[a,b,c].map(x=>Math.ceil(x/q)).join(', ')+'. La somma è '+timeline.length+' e il tempo utile totale è '+(a+b+c)+' ms.']);
  }));
  prova(3,5,4,'Calcolare il ritardo dell’inversione di priorità',
    'Su un core, un thread ad alta priorità può dipendere dal rilascio di un mutex detenuto a bassa priorità. Con l’ereditarietà il proprietario usa temporaneamente la priorità del thread bloccato.',
    [[5,2],[3,4]].map(([m,l])=>v(
    'Su un solo core lo scheduler applica priorità con prelazione. L possiede il mutex e deve ancora eseguire '+l+' ms sotto lock. Al tempo 0 H chiede il mutex e si blocca. Nello stesso istante M diventa pronto per '+m+' ms. Priorità H > M > L, costi di cambio nulli.',
    [num('Attesa di H con priorità fisse (ms)',m+l,'M è pronto e ha priorità superiore a L.'),num('Attesa di H con ereditarietà (ms)',l,'Individua chi eredita la priorità di H.')],
    ['Senza ereditarietà il dispatcher esegue M per '+m+' ms, poi L per '+l+' ms.','L rilascia il mutex a '+(m+l)+' ms e H può ripartire.','Con ereditarietà L riceve la priorità di H, prevale su M e rilascia il mutex dopo '+l+' ms.'])));

  prova(4,1,1,'Distinguere registri e heap',
    'I thread condividono le celle dell’heap e ciascuno conserva i propri registri. Dopo la barriera B può osservare un valore scritto da A nell’heap.',
    [['heap',42],['registro',17]].map(([which,x])=>{
    const heap=which==='heap';
    return v('A e B sono thread dello stesso processo. La cella h nell’heap vale 2. Il registro r di B vale 6. A scrive '+x+(heap?' in h.':' nel proprio registro r.')+' Una barriera sincronizza i thread, poi B esamina h e il proprio r.',
      [num('Valore di h letto da B',heap?x:2,'I thread vedono la stessa cella dell’heap.'),num('Valore del registro r di B',6,'Ogni thread possiede un proprio contesto.')],
      ['Prima dell’operazione B trova h = 2 e r = 6.',heap?'A modifica una cella comune. La barriera rende visibile h = '+x+' a B.':'A modifica il proprio contesto. L’heap resta a 2.', 'La scrittura di A lascia il registro di B a 6. I valori osservati da B sono quindi '+(heap?x:2)+' e 6.']);
  }));
  prova(4,2,2,'Misurare il parallelismo disponibile',
    'Per eseguire simultaneamente, ciascun thread pronto richiede un contesto hardware. A parità di durata, il tempo totale dipende dal numero di gruppi che i core possono portare a termine.',
    [[7,2,3],[5,1,2]].map(([n,k,t])=>v(
    n+' thread indipendenti sono pronti al tempo 0. Ciascuno richiede '+t+' ms di CPU senza sospensioni. Sono disponibili '+k+' core, ciascuno con un solo contesto di esecuzione. Ogni core libero prende subito un thread pronto e lo esegue fino al termine. I cambi sono istantanei.',
    [num('Thread simultanei massimi',Math.min(n,k),'Conta le risorse hardware disponibili.'),num('Tempo per completare tutti i thread (ms)',Math.ceil(n/k)*t,'Dividi i thread in gruppi grandi al più quanto il numero dei core.')],
    ['I thread concorrenti all’inizio sono '+n+' e l’hardware può eseguirne '+Math.min(k,n)+' insieme.','Occorrono ⌈'+n+'/'+k+'⌉ = '+Math.ceil(n/k)+' gruppi. Ogni gruppo dura '+t+' ms.','L’ultimo termina a '+(Math.ceil(n/k)*t)+' ms. L’eventuale gruppo incompleto ha uguale durata.'])));
  prova(4,3,3,'Contare i worker dopo un blocco',
    'Ogni thread utente avanza attraverso un worker eseguibile dal kernel. Una chiamata bloccante sottrae il worker che la esegue alla capacità disponibile per gli altri thread utente.',
    [[4,1],[6,3]].map(([u,k])=>v(
    u+' thread utente si appoggiano a '+k+' worker del kernel su una macchina con '+k+' core. Una lettura blocca un worker e il suo thread utente. Gli altri thread sono pronti e il runtime mantiene il numero di worker fissato.',
    [num('Worker ancora eseguibili',k-1,'Dalla dotazione iniziale sottrai il worker bloccato.'),num('Numero massimo di altri thread utente in esecuzione',Math.min(u-1,k-1),'Un thread utente in esecuzione richiede un worker disponibile.')],
    ['La lettura sospende un’entità di kernel. Restano '+k+' − 1 = '+(k-1)+' worker eseguibili.','I thread utente rimanenti sono '+(u-1)+' e possono avanzare soltanto attraverso questi worker.','Il numero simultaneo è min('+(u-1)+', '+(k-1)+') = '+Math.min(u-1,k-1)+'.'])));
  prova(4,4,4,'Ricostruire gli argomenti dopo la barriera',
    'Il valore letto dopo una barriera dipende dalla cella identificata dal puntatore trasmesso alla creazione del thread. Indirizzi uguali identificano lo stesso oggetto per tutta la sua vita.',
    [true,false].map(separate=>v(
    'Il thread creatore avvia quattro thread mentre i assume i valori 0, 1, 2, 3. '+(separate?'Copia i in a[i] e passa &a[i].':'Passa &i a ogni thread.')+' Dopo l’ultimo incremento i vale 4. Una barriera sincronizza tutte le letture successive. Sia i sia a sopravvivono fino a tutti i join.',
    [num('Valori distinti letti dai quattro thread',separate?4:1,'Confronta gli indirizzi passati.'),num('Somma dei quattro valori letti',separate?6:16,'Scrivi prima il valore raggiunto da ciascun puntatore.')],
    [separate?'I puntatori identificano quattro elementi distinti, ognuno inizializzato prima della barriera.':'I quattro puntatori identificano la stessa variabile del thread creatore.',separate?'I worker leggono rispettivamente 0, 1, 2, 3. I distinti sono quattro.':'Quando i worker lasciano la barriera, i contiene 4. Leggono tutti 4, un solo valore distinto.',separate?'La somma è 0 + 1 + 2 + 3 = 6. Il creatore completa i join prima dell’uscita dal blocco che contiene l’array.':'La somma è 4 × 4 = 16. La barriera stabilisce l’ordine fra gli incrementi e le letture.'])));
  prova(4,5,5,'Dimensionare stack e spazi di indirizzi',
    'Lo spazio di indirizzi raggruppa i thread dello stesso processo. Ogni thread conserva il proprio stack utente, anche quando condivide codice, heap e descrittori con altri thread.',
    [[2,3],[3,2]].map(([proc,threads])=>v(
    'Un servizio usa '+proc+' processi distinti con '+threads+' thread per processo, incluso il thread iniziale. Ogni thread ha uno stack utente proprio. Considera solo questi processi.',
    [num('Spazi di indirizzi',proc,'Raggruppa i thread per processo.'),num('Stack utente',proc*threads,'Conta tutti i flussi di esecuzione.')],
    ['Ogni processo ha uno spazio di indirizzi, dunque gli spazi sono '+proc+'.','Ogni gruppo di thread condivide lo spazio del proprio processo e conserva '+threads+' stack distinti.','Gli stack totali sono '+proc+' × '+threads+' = '+(proc*threads)+'. Un cambio fra thread dello stesso gruppo ripristina anche il puntatore allo stack del nuovo thread.'])));

  prova(5,1,1,'Ricostruire un incremento perso',
    'Una lettura atomica seguita da una scrittura atomica lascia un intervallo fra i due accessi. Il valore scritto dipende dalla copia letta dal singolo thread.',
    [[7,false],[11,true]].map(([x,seq])=>v(
    'La cella atomica x vale '+x+'. Ogni worker legge x e in una seconda operazione scrive il valore letto più uno. Gli accessi sono sequenzialmente consistenti. Ordine: '+(seq?'A legge, A scrive, B legge, B scrive.':'A legge, B legge, A scrive, B scrive.'),
    [num('Valore letto da B',seq?x+1:x,'Osserva se A ha già scritto.'),num('Valore finale',seq?x+2:x+1,'B usa la propria lettura salvata.')],
    ['A legge '+x+' e prepara '+(x+1)+'.',seq?'A scrive '+(x+1)+', quindi B legge '+(x+1)+'.':'B legge ancora '+x+'. I due worker preparano lo stesso risultato.',seq?'B scrive '+(x+2)+'. Si conservano entrambi gli incrementi.':'Le due scritture depositano entrambe '+(x+1)+'. Il confronto con '+(x+2)+' mostra un incremento perso.'])));
  const properties=['esclusione mutua','progresso','attesa limitata'];
  prova(5,2,2,'Individuare la proprietà violata',
    'L’esclusione mutua permette un solo ingresso alla volta, mentre il progresso riguarda l’ammissione quando la sezione è libera. L’attesa limitata pone un limite ai sorpassi dopo una richiesta.',
    [
    v('Il protocollo usa un token che alterna rigidamente A e B. Il token è in mano a B, che rimane per sempre in un calcolo esterno alla sezione critica. A vuole entrare e la sezione è libera.',[scelta('Proprietà che richiede una decisione fra gli interessati','progresso',properties,'Osserva chi può rinviare l’ingresso in una sezione libera.')],
      ['Il token unico mantiene l’esclusione mutua.','La sezione è libera e A è l’unico interessato, mentre la decisione dipende da B che resta all’esterno.','L’ingresso può essere rimandato indefinitamente: il protocollo viola il requisito di progresso.']),
    v('La sezione critica ammette un solo thread. A tenta continuamente di entrare mentre altri thread completano un numero arbitrariamente grande di ingressi prima di A.',[scelta('Quale proprietà imporrebbe un limite ai sorpassi?','attesa limitata',properties,'Conta gli ingressi degli altri dopo la richiesta di A.')],
      ['A ha già manifestato la richiesta di ingresso.','Altri thread entrano ed escono uno per volta, quindi il lavoro del sistema avanza e la mutua esclusione regge.','Poiché il numero di sorpassi può superare qualsiasi limite, manca l’attesa limitata.'])]);
  prova(5,3,6,'Seguire i permessi consegnati al risveglio',
    'Con consegna diretta e coda FIFO, una signal trasferisce il permesso al primo sospeso. Il numero di sospesi e il numero di permessi liberi misurano grandezze diverse.',
    [1,2].map(s=>v(
    'Il semaforo parte con '+s+(s===1?' permesso libero.':' permessi liberi.')+' Arrivano in ordine A, B e C, ciascuno con una wait. Un quarto thread esegue poi una signal. Si usa una coda FIFO con consegna diretta al primo sospeso.',
    [num('Sospesi dopo le tre wait',3-s,'Ogni permesso iniziale soddisfa una sola richiesta.'),scelta('Chi diventa pronto dopo signal?',s===1?'B':'C',['A','B','C'],'Ricostruisci la coda rispettando l’ordine di arrivo.'),num('Permessi liberi subito dopo signal',0,'Distingui un permesso consegnato da un permesso disponibile.')],
    [s===1?'A consuma l’unico permesso.':'A e B consumano i due permessi disponibili.','La coda dei sospesi contiene '+(3-s)+' thread. In ordine di arrivo: '+(s===1?'B, C.':'C.'),'signal consegna il permesso a '+(s===1?'B':'C')+', che passa a pronto. Il contatore libero resta zero e i sospesi rimasti sono '+(2-s)+'.'])));
  prova(5,4,6,'Conservare un evento anticipato',
    'Una signal può precedere la wait corrispondente. Il semaforo conserva un permesso libero se nessuno lo sta aspettando, oppure lo consegna a una richiesta sospesa.',
    [true,false].map(early=>v(
    'Il semaforo E parte da zero. P deve terminare la preparazione prima che C usi i dati. '+(early?'P completa il lavoro e chiama signal(E) prima che C arrivi.':'C arriva per primo e chiama wait(E) mentre P sta preparando i dati.'),
    [num('Permessi liberi dopo la prima operazione sul semaforo',early?1:0,'Osserva se la prima operazione deposita o richiede.'),scelta('C deve attendere un risveglio?',early?'no':'sì',['sì','no'],'Controlla i permessi all’istante della wait.')],
    [early?'P rende disponibile un permesso: E passa da 0 a 1.':'C trova zero permessi e si blocca. Il contatore libero resta zero.',early?'C trova il permesso già depositato e lo consuma con wait.':'P completa la preparazione e signal consegna il permesso a C, che diventa pronto.','Dopo il completamento delle due operazioni i permessi liberi sono zero. C può usare i dati dopo la preparazione di P.'])));
  prova(5,5,7,'Trovare il difetto del controllo separato',
    'Nella prenotazione di una risorsa, l’aggiornamento dipende dal valore osservato durante il controllo. Serializzare le scritture lascia possibili decisioni simultanee basate sulla stessa lettura.',
    [[1,2],[1,3]].map(([places,n])=>v(
    'Resta '+places+' posto per un seminario. '+n+' worker leggono tutti disponibile = 1 prima di entrare, uno per volta, sotto mutex. Ognuno scrive disponibile = 0 e invia una conferma usando il precedente esito del controllo. I singoli accessi al dato sono atomici.',
    [num('Conferme inviate',n,'La decisione positiva viene memorizzata da ogni worker.'),num('Conferme in eccesso',n-1,'Confronta il numero di conferme con il posto disponibile.')],
    ['Tutti i '+n+' worker osservano la disponibilità prima della prima scrittura.','All’ingresso nel mutex ogni worker ha già deciso di confermare. Tutte le scritture portano in sequenza il valore a zero. Partono '+n+' conferme.','Le conferme in eccesso sono '+n+' − 1 = '+(n-1)+'. Spostando controllo e aggiornamento nella stessa sezione, il primo prenota e i successivi trovano zero.'])));

  prova(6,1,1,'Calcolare le disponibilità del buffer',
    'Dopo operazioni complete, il numero di elementi nel buffer cresce con ogni inserimento e cala con ogni rimozione. Gli altri slot sono a disposizione dei produttori.',
    [[6,4,2],[8,5,1]].map(([cap,prod,cons])=>v(
    'Un buffer di capacità '+cap+' parte vuoto. Il produttore completa '+prod+' inserimenti, le rimozioni successive effettuate dal consumatore sono '+cons+'. Ogni operazione ha già restituito o pubblicato il permesso.',
    [num('Semaforo pieni al termine',prod-cons,'Ogni inserimento completato pubblica un elemento.'),num('Semaforo vuoti al termine',cap-prod+cons,'Ogni rimozione restituisce spazio.')],
    ['All’inizio pieni = 0 e vuoti = '+cap+'.','Dopo gli inserimenti pieni = '+prod+', vuoti = '+(cap-prod)+'.','Dopo le rimozioni pieni diminuisce di '+cons+' e vuoti aumenta della stessa quantità. Si ottiene pieni = '+(prod-cons)+', vuoti = '+(cap-prod+cons)+'. La somma è '+cap+'.'])));
  prova(6,2,2,'Ordinare le operazioni sul buffer',
    'La wait sul semaforo riserva la risorsa richiesta e il mutex protegge la modifica degli indici e della cella. La signal finale pubblica un elemento o restituisce spazio.',
    [true,false].map(prod=>v(
    'Il buffer usa i semafori vuoti e pieni e un mutex M. '+(prod?'Un produttore deve inserire un elemento.':'Un consumatore deve estrarre un elemento.')+' Si richiede che nessun thread attenda la disponibilità del dato o dello spazio mentre possiede M.',
    [scelta('Su quale semaforo viene eseguita la prima wait?',prod?'vuoti':'pieni',['vuoti','pieni'],'Prima di entrare nella sezione protetta occorre riservare spazio oppure un elemento?'),scelta('Quale permesso segnala il completamento?',prod?'pieni':'vuoti',['vuoti','pieni'],'Quale risorsa diventa disponibile all’altro ruolo?')],
    [prod?'Il produttore esegue wait(vuoti) per riservare una cella.':'Il consumatore esegue wait(pieni) per riservare un elemento pubblicato.',prod?'Sotto M scrive il dato e avanza l’indice di ingresso. Poi rilascia M.':'Sotto M legge il dato e avanza l’indice di uscita. Poi rilascia M.',prod?'signal(pieni) permette a un consumatore di leggere la nuova cella.':'signal(vuoti) rende lo spazio riutilizzabile da un produttore.'])));
  prova(6,3,1,'Contabilizzare una prenotazione in corso',
    'Una prenotazione acquisisce un permesso di spazio prima della pubblicazione del dato. In quell’intervallo il posto riservato appartiene al produttore e va contato a parte.',
    [[5,2,1],[8,3,2]].map(([cap,pub,res])=>v(
    'Un buffer di capacità '+cap+' contiene '+pub+' elementi pubblicati. I produttori in attesa di scrivere sono '+res+'. Ciascuno ha completato wait(vuoti) e deve ancora eseguire signal(pieni). Ogni altra operazione è completa.',
    [num('Permessi vuoti liberi',cap-pub-res,'Separa celle pubblicate e prenotazioni.'),num('Valore di vuoti + pieni',cap-res,'I produttori possiedono permessi in transito.')],
    ['Prima delle prenotazioni vuoti = '+cap+' − '+pub+' = '+(cap-pub)+' e pieni = '+pub+'.','Le prenotazioni riducono vuoti di '+res+' e lo portano a '+(cap-pub-res)+'. Il numero di elementi pubblicati resta '+pub+'.','La somma dei semafori è '+(cap-pub-res)+' + '+pub+' = '+(cap-res)+'. Aggiungendo la quantità riservata ('+res+') si ritrova la capacità '+cap+'.'])));
  prova(6,4,4,'Ammettere un lettore dietro uno scrittore',
    'L’accesso in lettura ammette più lettori contemporanei e la scrittura richiede l’uso esclusivo. In presenza di uno scrittore in attesa, la politica decide la posizione del lettore successivo.',
    [true,false].map(fair=>v(
    'L1 è in lettura. Lo scrittore S si mette in coda, poi arriva L2. '+(fair?'L’ammissione usa una coda FIFO senza sorpassi.':'La politica consente ai nuovi lettori di unirsi a un gruppo già attivo anche con uno scrittore in attesa.')+' L1 esce per primo. Se L2 è stato ammesso, la sua lettura è ancora in corso in quell’istante.',
    [num('Lettori ammessi dopo l’arrivo di L2',fair?1:2,'Individua chi può unirsi a L1.'),scelta('A chi spetta l’accesso subito dopo l’uscita di L1?',fair?'S':'L2 continua',['S','L2 continua'],'Controlla il numero dei lettori rimasti attivi.')],
    ['S richiede accesso esclusivo e deve attendere almeno l’uscita di L1.',fair?'L2 si accoda dietro S, dunque soltanto L1 legge.':'L2 si unisce a L1 portando i lettori attivi a due.',fair?'Quando L1 esce, la risorsa è libera e il primo in coda è S. L2 attende.':'Dopo l’uscita di L1 resta L2 in lettura. S attende l’uscita dell’ultimo lettore.'])));
  prova(6,5,4,'Riconoscere l’ultimo lettore',
    'Nel protocollo del primo e dell’ultimo lettore un gruppo di lettori condivide il permesso sulla risorsa. Il mutex protegge il contatore con cui si riconosce l’uscita dell’ultimo componente.',
    [2,4].map(n=>v(
    'Ci sono '+n+' lettori attivi e uno scrittore sospeso sul semaforo della risorsa. Nel protocollo primo/ultimo lettore, ogni uscita decrementa il contatore sotto mutex e l’ultimo lettore segnala la risorsa. Il gruppo iniziale resta chiuso a nuovi arrivi.',
    [num('Uscite dopo le quali lo scrittore può diventare pronto',n,'Serve il passaggio da uno a zero.'),num('Segnalazioni della risorsa prodotte dalle uscite',1,'Il gruppo possiede un unico permesso collettivo.')],
    ['All’inizio il gruppo di '+n+' lettori controlla la risorsa. Il mutex del contatore protegge ciascun decremento.','Quando le uscite raggiungono quota '+(n-1)+', resta un lettore e lo scrittore continua ad attendere.','L’uscita numero '+n+' porta il contatore a zero. Scatta una sola signal della risorsa, che rende pronto lo scrittore.'])));

  const diagnoses=['starvation','livelock','deadlock','attesa temporanea'];
  prova(7,1,5,'Riconoscere il progresso nelle tracce',
    'Il progresso si valuta contando operazioni completate e osservando chi riesce a completarle. Una sequenza ripetuta indefinitamente distingue l’esclusione di un singolo dal fallimento simultaneo dei tentativi.',
    [
    v('Una traccia periodica si ripete indefinitamente. A e B prendono ciascuno un lock, osservano la contesa, rilasciano il lock per cortesia e riprovano insieme. Il conteggio delle transazioni completate resta a zero.',[scelta('Diagnosi','livelock',diagnoses,'Osserva se i partecipanti eseguono ancora azioni.')],
      ['A e B cambiano stato a ogni tentativo, quindi il sistema continua a eseguire passi.','Alla fine del periodo nessun lavoro è concluso e ricompare lo stesso punto di partenza.','La ripetizione indefinita di azioni senza risultato identifica il livelock.']),
    v('Uno scrittore resta in coda. Ogni volta che un lettore sta per uscire ne entra un altro. La sequenza si ripete indefinitamente e ogni lettore termina.',[scelta('Diagnosi','starvation',diagnoses,'Distingui il progresso globale dal progresso dello scrittore.')],
      ['I lettori completano richieste, quindi il sistema produce risultati.','Lo scrittore attende che il gruppo attivo si svuoti. La successione degli arrivi mantiene sempre almeno un lettore.','È la singola richiesta dello scrittore a subire esclusione indefinita: starvation.'])]);
  const conditions=['esclusione mutua','possesso durante l’attesa','assenza di prelazione','attesa circolare'];
  prova(7,2,2,'Collegare una politica a Coffman',
    'Un deadlock richiede congiuntamente esclusione mutua, possesso durante l’attesa, assenza di prelazione e attesa circolare. Una politica che esclude una delle quattro condizioni previene lo stallo.',
    [
    v('Ogni processo dichiara prima di partire tutte le risorse di cui avrà bisogno e le chiede in blocco, una sola volta. Se manca una risorsa, il gestore mantiene il processo in attesa senza assegnargli alcuna istanza.',[scelta('Quale condizione viene esclusa direttamente?','possesso durante l’attesa',conditions,'Controlla quali risorse possiede il richiedente sospeso.')],
      ['Una richiesta riuscita ottiene l’intero insieme e può iniziare il lavoro.','Una richiesta sospesa possiede zero risorse.','Fra le condizioni di Coffman viene così meno il possesso durante l’attesa.']),
    v('Le risorse hanno ranghi distinti. Ogni processo può chiedere una nuova risorsa solo se il rango supera quello di ogni risorsa già detenuta.',[scelta('Quale condizione viene esclusa direttamente?','attesa circolare',conditions,'Prova a chiudere una catena di disuguaglianze strette.')],
      ['Seguendo acquisizioni successive si incontra una successione di ranghi strettamente crescente.','Per chiudere un ciclo servirebbe tornare al primo rango attraverso una richiesta ancora maggiore del precedente.','Ne seguirebbe r < r, impossibile. Il protocollo esclude l’attesa circolare.'])]);
  prova(7,3,1,'Leggere un ciclo nel grafo di assegnazione',
    'Nel grafo di assegnazione una richiesta va dal processo alla risorsa e un’assegnazione va dalla risorsa al possessore. L’interpretazione di un ciclo dipende dal numero di istanze e da quali processi possono rilasciarle.',
    [true,false].map(multiple=>v(
    'A possiede X e attende Y. B possiede Y e attende X. Ciascuno trattiene la risorsa fino a quando può completare il proprio lavoro con entrambe. '+(multiple?'Esiste una seconda istanza di Y in mano a C, che può terminare subito e rilasciarla.':'Ogni risorsa ha una sola istanza. Solo i possessori possono liberarla.'),
    [num('Numero di archi nel ciclo A → Y → B → X → A',4,'Conta richieste e assegnazioni lungo il ciclo indicato.'),scelta('Il sistema è già in deadlock?',multiple?'no':'sì',['sì','no'],'Verifica se può arrivare dall’esterno una delle istanze richieste.')],
    ['Gli archi A → Y e B → X sono richieste. Y → B e X → A sono assegnazioni.','L’alternanza delle due richieste e delle due assegnazioni chiude un ciclo con quattro archi.',multiple?'C può restituire una Y. A può quindi completare, liberare X e far ripartire B: in questo stato il ciclo è risolvibile.':'Entrambi i possessori aspettano una risorsa che soltanto l’altro può rilasciare. Con una sola istanza per tipo il ciclo è uno stallo.'])));
  prova(7,4,2,'Controllare un’acquisizione per rango',
    'Assegnare ranghi distinti alle risorse permette di ordinare le acquisizioni. Ammissibilità della richiesta secondo il rango e disponibilità immediata della risorsa sono due verifiche separate.',
    [[2,5,3],[1,4,7]].map(([first,second,ask])=>{
    const ok=ask>second;
    return v('Un thread detiene due risorse di rango '+first+' e '+second+'. Il protocollo impone acquisizioni strettamente crescenti. Il thread chiede una risorsa di rango '+ask+'.',
      [num('Rango massimo già detenuto',second,'Confronta tutti i lock posseduti.'),scelta('Richiesta ammessa dal protocollo?',ok?'sì':'no',['sì','no'],'Il nuovo rango deve superare il massimo detenuto.')],
      ['Il massimo fra i ranghi detenuti è '+second+'.','Il confronto richiesto è '+ask+' > '+second+': la proposizione è '+(ok?'vera.':'falsa.'),ok?'La richiesta è ammessa. La disponibilità effettiva della risorsa determina se il thread può acquisirla subito.':'Il protocollo rifiuta l’ordine richiesto. Per includere questa risorsa il thread deve riorganizzare le acquisizioni secondo il rango.']);
  }));
  prova(7,5,3,'Verificare una sequenza sicura',
    'Nel test del banchiere il bisogno residuo di un processo è la differenza fra massimo dichiarato e assegnazione corrente. Un completamento ipotetico restituisce le sue istanze e può rendere possibile il turno successivo.',
    [1,0].map(a=>v(
    'Un solo tipo di risorsa. A possiede 2 istanze e dichiara massimo 5. B ne possiede 2 e dichiara massimo 3. C ne possiede 1 e dichiara massimo 4. '+(a?'Inizialmente è libera 1 istanza.':'Inizialmente sono libere 0 istanze.')+' Si esamina la sicurezza rispetto ai massimi dichiarati.',
    [num('Bisogno residuo di B',1,'Sottrai l’assegnato dal massimo di B.'),scelta('Esito del test',a?'sicuro':'insicuro',['sicuro','insicuro'],'Cerca un processo che possa ultimare con il disponibile e restituire quanto possiede.')],
    ['I bisogni residui sono A: 5 − 2 = 3, B: 3 − 2 = 1, C: 4 − 1 = 3.',a?'Con 1 istanza libera B può completare. Restituendo le sue 2 iniziali porta il disponibile a 3.':'Con 0 istanze libere nessuno dei bisogni residui può essere soddisfatto: il test si arresta subito.',a?'A può ora completare e portare il disponibile a 5. Segue C, che lo porta a 6. B → A → C è una sequenza sicura.':'Manca una sequenza che garantisca a tutti il massimo: lo stato è insicuro. Per rilevare uno stallo attuale occorre conoscere le richieste effettivamente pendenti.'])));

  // Questi listati sono dati della consegna, consultabili prima della verifica.
  for (const v of SL.prove['5.2'][4].varianti) v.listato = v.codice;
}());
