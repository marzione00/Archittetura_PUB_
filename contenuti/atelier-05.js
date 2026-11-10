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
  function ordine(label, elementi, hint){
    return {label, ordine:elementi, answer:elementi.join(' → '), numeric:false, hint};
  }
  function v(consegna,campi,svolgimento,codice){
    const item={consegna,campi,svolgimento};
    if(codice) item.codice=codice;
    return item;
  }
  const stato=['pronto','bloccato','in esecuzione','terminato'];

  prova(1, 1, 1, "Quante istanze possono eseguire insieme?",
    "Un processo è un’esecuzione del programma identificata dal sistema mediante un numero, il PID. È monothread quando contiene un solo flusso di istruzioni. Ogni core, l’unità hardware che esegue istruzioni, ospita qui un solo flusso alla volta. Il numero di processi simultaneamente in esecuzione è quindi limitato sia dai processi pronti sia dai core disponibili; osservare più PID durante un intervallo può invece documentare turni successivi.",
    [
      v(
        "Si avviano 5 istanze dello stesso eseguibile, tutte monothread e pronte. I core disponibili sono 1. Considera il primo istante dopo l’assegnazione.",
        [
          num("Processi creati", "5", "Conta le istanze avviate."),
          num("Processi simultaneamente in esecuzione", "1", "Ogni processo richiede un core.")
        ],
        [
          "Ogni avvio crea un’identità di processo: i PID distinti sono 5.",
          "Ogni core ospita un solo flusso nel modello. Il massimo simultaneo vale min(5, 1) = 1.",
          "Gli altri 4 processi attendono pronti. La multiprogrammazione permette di alternarli nei turni successivi."
        ]
      ),
      {
        consegna: "In una finestra di 10 ms il monitor dell’esecuzione sui core registra turni associati a cinque PID distinti. I programmi sono monothread e il computer dispone di due core. Il tecnico conclude che cinque processi abbiano lavorato nello stesso istante. Verifica la conclusione e scegli la misura con cui controllarla.",
        campi: [
          num("Massimo numero di questi processi attivi nello stesso istante", "2", "Distingui il numero di PID osservati nell’intervallo dal numero di posti hardware."),
          scelta("Misura adatta a verificare la contemporaneità", "Stato di entrambi i core allo stesso istante", ["Numero di file eseguibili", "Stato di entrambi i core allo stesso istante", "Somma dei PID"], "La contemporaneità riguarda la stessa data su due corsie.")
        ],
        svolgimento: [
          "Cinque PID attestano che cinque processi hanno ricevuto un turno durante i 10 ms. Dal solo elenco manca la collocazione dei singoli turni nel tempo.",
          "Poiché ogni processo ha un solo thread e ogni core ne esegue uno per volta, due core possono eseguire al massimo due di questi processi simultaneamente.",
          "Cinque turni possono succedersi sui due core. Per verificare una sovrapposizione occorre accostare i nomi registrati sulle due corsie al medesimo istante."
        ],
        quadro: [
          {titolo: "Campione del monitor", tipo: "confronto", celle: [["Intervallo", "10 ms"], ["PID distinti", "5"], ["Core", "2"]], nota: "Il campione riunisce eventi avvenuti in istanti diversi."},
          {titolo: "Finestra di osservazione", tipo: "confronto", celle: [["Presenze", "5"], ["Istanti", "da verificare"]], nota: "Una presenza nell’intervallo documenta almeno un turno."},
          {titolo: "Capacità istantanea", tipo: "confronto", celle: [["Core 0", "un thread"], ["Core 1", "un thread"], ["Massimo", "2"]], nota: "Ogni core offre un solo posto alla volta."},
          {titolo: "Misura decisiva", tipo: "confronto", celle: [["Core 0 al tempo t", "PID osservato"], ["Core 1 al tempo t", "PID osservato"]], nota: "Le due osservazioni devono riferirsi allo stesso istante."}
        ]
      }
    ]
  );

  prova(1,2,2,'Seguire le transizioni di A',
    'Un processo è bloccato quando aspetta un evento esterno, pronto quando attende soltanto un turno sul core e in esecuzione quando ha ricevuto quel turno. Il completamento di una lettura, un’operazione di ingresso dei dati indicata con I/O, riporta il processo fra i pronti. Nella politica round-robin i pronti ricevono turni a rotazione, ciascuno di durata massima detta quanto. Esaurito il quanto, chi ha ancora lavoro torna in fondo alla coda; il dispatcher assegna il core al prossimo processo scelto.',
    [
    v('Su un core A richiede una lettura bloccante su disco. Il dato è ancora in transito e arriverà mentre B usa il core. B conserva il proprio quanto.',[scelta('A dopo la richiesta','bloccato',stato,'Verifica se servirebbe il core o il dispositivo.'),scelta('A subito dopo il completamento','pronto',stato,'B continua a eseguire.')],
      ['La lettura richiede un evento esterno. A passa da in esecuzione a bloccato.','Durante l’I/O il dispatcher assegna il core a B.','Il completamento rimuove il motivo di blocco e inserisce A fra i pronti.']),
    v('Su un core A esaurisce il proprio quanto. B è già pronto. Round-robin serve B, poi B termina e il dispatcher assegna il core ad A.',[scelta('A durante il turno di B','pronto',stato,'A può usare la CPU appena viene scelto.'),scelta('A dopo la seconda assegnazione','in esecuzione',stato,'Osserva chi ha ricevuto il core.')],
      ['La scadenza rimette A in fondo alla coda dei pronti.','B viene estratto dalla testa e usa il core. A attende soltanto il suo turno.','Terminato B, il dispatcher carica il contesto di A e A passa in esecuzione.'])]);
  prova(1, 3, 3, "Individuare il contesto da ripristinare",
    "Il PC, o contatore di programma, conserva l’indirizzo della prossima istruzione nella macchina considerata. Un interrupt è un avviso hardware che permette al sistema operativo di interrompere l’esecuzione; il kernel, la parte del sistema che governa le risorse, salva il PC con i registri e il puntatore allo stack. I registri sono piccole memorie del processore, mentre lo stack conserva chiamate di funzione e dati locali. L’heap è l’area del processo usata per allocare dati durante l’esecuzione: i suoi byte restano nelle pagine di memoria, blocchi associati agli indirizzi del processo. Con istruzioni consecutive tutte lunghe quattro byte, la distanza fra PC iniziale e finale è quattro volte il numero di istruzioni completate. Il prefisso 0x indica un numero scritto in base sedici.",
    [
      v(
        "A esegue 3 istruzioni consecutive da 4 byte a partire da 0x100. Un interrupt arriva fra istruzioni e il kernel sceglie B.",
        [
          num("PC da salvare per A", "268", "Avanza di quattro byte per ogni istruzione completata."),
          scelta("Dove rimangono i byte dell’heap di A?", "nelle pagine del processo", ["nel registro PC", "nelle pagine del processo", "nella coda dei pronti"], "Distingui il contenuto della memoria dai riferimenti del kernel.")
        ],
        [
          "Il PC iniziale vale 256 in decimale. A percorre 3 × 4 = 12 byte.",
          "Il prossimo prelievo è a 268 (0x10c). Il kernel conserva questo PC con i registri e il puntatore allo stack.",
          "L’heap rimane nelle pagine dello spazio di A. Al ritorno il kernel ripristina i registri e la traduzione degli indirizzi."
        ]
      ),
      {
        consegna: "A ha iniziato dall’indirizzo 0x240. Dopo qualche istruzione in sequenza, tutte da quattro byte, il kernel salva per A il PC 0x254. La scheda di B contiene 0x900. Il registro del core mostra 0x900 subito dopo la pretesa ripresa di A. Ricostruisci il tratto percorso e individua il salvataggio da ricaricare.",
        campi: [
          num("Istruzioni completate da A", "5", "Sottrai l’indirizzo di partenza da quello salvato e dividi per la lunghezza di un’istruzione."),
          num("PC corretto alla ripresa di A", "596", "Usa il PC conservato nella scheda di A. Puoi scriverlo anche in esadecimale.")
        ],
        svolgimento: [
          "Il PC salvato indica il prossimo prelievo. La distanza percorsa è 0x254 − 0x240 = 0x14, ossia 20 byte.",
          "Con istruzioni tutte da quattro byte, quei 20 byte comprendono 20 ÷ 4 = 5 istruzioni complete.",
          "0x900 appartiene al contesto di B. La ripresa corretta ricarica il PC di A dalla sua scheda, quindi 0x254, che vale 596 in decimale."
        ],
        quadro: [
          {titolo: "Registrazione del cambio", tipo: "stato", celle: [["A all’avvio", "0x240"], ["Scheda di A", "0x254"], ["Core osservato", "0x900"]], nota: "Le istruzioni percorse da A sono consecutive."},
          {titolo: "Distanza percorsa", tipo: "stato", celle: [["Inizio", "0x240"], ["Prossimo", "0x254"], ["Distanza", "20 byte"]], nota: "Il PC punta subito dopo l’ultima istruzione completata."},
          {titolo: "Numero di istruzioni", tipo: "stato", celle: [["Byte percorsi", "20"], ["Byte per istruzione", "4"], ["Istruzioni", "5"]], nota: "Si divide la distanza per il passo del PC."},
          {titolo: "Identità del contesto", tipo: "stato", celle: [["Scheda di B", "0x900"], ["Ripresa di A", "0x254"]], nota: "Il valore del core deve provenire dalla scheda del processo ripreso."}
        ]
      }
    ]
  );

  prova(1, 4, 3, "Separare risposta e costo dei cambi",
    "La politica round-robin assegna ai processi pronti un turno a rotazione, lungo al massimo un quanto. Il burst è il tratto di calcolo richiesto al processore: se supera il quanto, il processo termina il turno con lavoro residuo. Il tempo di risposta va dall’arrivo alla prima esecuzione. Per ricavarlo occorre sommare i turni degli altri processi e i cambi di contesto precedenti all’assegnazione, durante i quali il sistema conserva lo stato del processo uscente e ripristina quello entrante.",
    [
      v(
        "A, B, C e D arrivano al tempo 0 in questo ordine. Round-robin su un core, burst tutti più lunghi del quanto di 2 ms. Ogni passaggio fra processi costa 1 ms. La prima assegnazione è gratuita.",
        [
          num("Tempo di risposta di D (ms)", "9", "Conta i turni e i cambi prima del primo avvio di D."),
          num("Tempo speso in cambi prima di D (ms)", "3", "Enumera A→B, B→C e C→D.")
        ],
        [
          "Prima di D eseguono A, B e C: i loro quanti occupano 3 × 2 = 6 ms.",
          "Fra l’inizio di A e l’inizio di D avvengono tre cambi, per 3 × 1 = 3 ms.",
          "D inizia al tempo 9 ms. Sottraendo il suo arrivo al tempo 0 si ottiene la stessa durata per la risposta."
        ]
      ),
      {
        consegna: "Quattro processi arrivano insieme, nell’ordine A, B, C, D. Il quanto è di 4 ms e ognuno dei primi tre lo usa per intero. La prima assegnazione è gratuita, ogni cambio successivo costa lo stesso tempo e il core è sempre impegnato. D inizia al tempo 18 ms. Ricava il costo unitario del cambio e verifica come muterebbe la prima risposta di D dimezzando quel costo.",
        campi: [
          num("Costo di un cambio (ms)", "2", "Separa i tre quanti utili dall’intervallo totale e distribuisci il resto fra i passaggi."),
          num("Prima risposta di D con il costo dimezzato (ms)", "15", "I turni utili conservano la loro durata e ciascuno dei tre cambi costa la metà.")
        ],
        svolgimento: [
          "Prima di D si completano i tre turni di A, B e C. Essi occupano 3 × 4 = 12 ms e richiedono tre passaggi di contesto per arrivare a D.",
          "Restano 18 − 12 = 6 ms per i tre passaggi di uguale durata. Il costo di un cambio è quindi 6 ÷ 3 = 2 ms.",
          "Dimezzando il costo si spende 1 ms a passaggio. D parte dopo 12 + 3 × 1 = 15 ms e, poiché è arrivato a zero, ha una risposta di 15 ms."
        ],
        quadro: [
          {titolo: "Misura del primo giro", tipo: "sequenza", celle: [["Quanto", "4 ms"], ["Avvio di D", "18 ms"]], nota: "L’avvio di A è gratuito."},
          {titolo: "Servizio dei predecessori", tipo: "sequenza", celle: [["A", "4 ms"], ["B", "4 ms"], ["C", "4 ms"]], nota: "I primi tre turni occupano dodici millisecondi."},
          {titolo: "Costo ricostruito", tipo: "sequenza", celle: [["Tempo residuo", "6 ms"], ["Passaggi", "3"], ["Costo unitario", "2 ms"]], nota: "Ogni cambio ha la stessa durata."},
          {titolo: "Costo dimezzato", tipo: "sequenza", celle: [["Servizio", "12 ms"], ["Tre cambi", "3 ms"], ["D inizia", "15 ms"]], nota: "La durata dei burst è indipendente dal costo dei cambi."}
        ]
      }
    ]
  );

  prova(1, 5, 2, "Assegnare i pronti ai core",
    "Lo scheduler sceglie fra i processi pronti e il dispatcher assegna loro un core. Quelli sospesi per un evento di rete restano nel gruppo dei bloccati finché il dispositivo segnala il completamento.",
    [
      v(
        "Il sistema ha 2 core liberi e 5 processi monothread. I processi in attesa di una risposta di rete sono 1. Gli altri possono eseguire. Il dispatcher riempie tutti i core disponibili.",
        [
          num("Pronti rimasti in coda", "2", "Togli prima i bloccati, poi i processi assegnati."),
          num("Bloccati dopo l’assegnazione", "1", "Quale evento completerebbe una richiesta di rete?")
        ],
        [
          "I processi candidati sono 5 − 1 = 4.",
          "Il dispatcher ne assegna 2 ad altrettanti core. In coda ne restano 2.",
          "Le richieste di rete pendenti restano 1. Sommando i processi in esecuzione, pronti e bloccati si ritrova il totale di 5."
        ]
      ),
      {
        consegna: "Quattro processi monothread condividono tre core. Un’istantanea mostra due core occupati, il terzo libero e la coda dei pronti vuota. Tutti i processi sono vivi e gli unici sospesi attendono la rete. Un completamento rende pronto un solo processo e il dispatcher gli assegna subito il core libero. Ricostruisci gli stati prima e dopo la notifica.",
        campi: [
          num("Processi bloccati prima della notifica", "2", "Dal totale dei processi vivi sottrai quelli sui core e quelli nella coda."),
          num("Core occupati dopo la nuova assegnazione", "3", "Segui il processo risvegliato fino al core ancora libero.")
        ],
        svolgimento: [
          "Due dei quattro processi sono in esecuzione. Poiché la coda dei pronti è vuota, gli altri 4 − 2 = 2 sono in attesa della rete.",
          "La notifica riguarda uno solo dei bloccati, che passa fra i pronti. Resta quindi un processo sospeso.",
          "Il dispatcher occupa il terzo core con il processo risvegliato. Dopo l’assegnazione si contano tre processi in esecuzione, zero pronti in coda e uno bloccato, per un totale di quattro."
        ],
        quadro: [
          {titolo: "Istantanea ricevuta", tipo: "stato", celle: [["Vivi", "4"], ["Core occupati", "2"], ["Pronti in coda", "0"]], nota: "Il terzo core è libero."},
          {titolo: "Ricostruzione", tipo: "stato", celle: [["In esecuzione", "2"], ["In coda", "0"], ["Bloccati", "2"]], nota: "Ogni processo vivo appartiene a una delle tre categorie."},
          {titolo: "Notifica di rete", tipo: "stato", celle: [["In esecuzione", "2"], ["In coda", "1"], ["Bloccati", "1"]], nota: "Un solo processo viene risvegliato."},
          {titolo: "Assegnazione", tipo: "stato", celle: [["In esecuzione", "3"], ["In coda", "0"], ["Bloccati", "1"]], nota: "Il dispatcher assegna al risvegliato il core libero."}
        ]
      }
    ]
  );

  prova(2,1,1,'Decodificare il ritorno di fork',
    'Alla riuscita di fork il padre ottiene il PID del figlio e il figlio ottiene zero. Un errore restituisce −1 al chiamante e lascia invariato il numero dei processi.',
    [[232,0],[517,1]].map(([pid,fail])=>{
    const ret=fail?-1:pid;
    return v('Il processo 200 chiama fork. '+(fail?'Il limite dei processi è raggiunto e la chiamata fallisce.':'La chiamata ha successo e il kernel assegna al figlio il PID '+pid+'.'),
      [num('Valore restituito al chiamante originario',ret,'Nel padre un successo identifica il figlio. Un errore ha un valore convenzionale negativo.'),num('Figli creati da questa chiamata',fail?0:1,'In caso di successo compare una sola nuova identità.')],
      [fail?'Il kernel rileva il limite e interrompe la creazione.':'Il kernel crea il processo '+pid+' con una copia del contesto.','Nel chiamante originario il ritorno vale '+ret+'.',fail?'Esiste solo il ramo di errore: figli creati = 0.':'Il nuovo processo riceve 0 e percorre il ramo figlio: figli creati = 1.']);
  }));
  prova(2, 2, 1, "Memoria privata e offset condiviso",
    "Una variabile collocata in una mappatura privata segue lo spazio di indirizzi del singolo processo. Per l’offset del file conta invece la descrizione aperta a cui conduce il descrittore. La fork eredita quel riferimento, mentre una nuova open crea una descrizione indipendente.",
    [
      v(
        "Prima di fork il padre apre un file regolare all’offset 0 e imposta la variabile privata x = 7. Il figlio incrementa x, legge 4 byte dal descrittore ereditato e termina. Il padre lo attende, poi esamina x e l’offset.",
        [
          num("x nel padre", "7", "La variabile si trova in una mappatura privata."),
          num("Offset del file nel padre", "4", "I due descrittori rimandano alla stessa descrizione di file aperto.")
        ],
        [
          "Subito dopo fork entrambi leggono x = 7. Il descrittore punta in entrambi alla stessa descrizione aperta.",
          "La scrittura del figlio aggiorna la propria copia a 8. Nel padre x resta 7.",
          "La lettura completata avanza l’unico offset di 4 byte. Dopo l’attesa il padre trova offset 4."
        ]
      ),
      {
        consegna: "Dopo fork il figlio chiude il descrittore ereditato e riapre lo stesso file regolare con una nuova open. L’offset di entrambe le aperture parte da zero. Il figlio legge sei byte con successo e termina. Il padre, che ha atteso il figlio, trova ancora zero come proprio offset. Individua la causa e scegli la modifica che gli avrebbe fatto trovare sei.",
        campi: [
          num("Descrizioni aperte distinte usate dai due lettori", "2", "Il percorso del file può essere lo stesso anche quando è diversa l’apertura."),
          scelta("Modifica perché il padre osservi sei", "Leggere dal descrittore ereditato", ["Leggere dal descrittore ereditato", "Attendere il figlio due volte", "Riaprire di nuovo il file nel padre"], "L’offset appartiene alla descrizione aperta a cui il descrittore conduce.")
        ],
        svolgimento: [
          "Il descrittore eredita dalla fork un riferimento alla descrizione del padre. La chiusura nel figlio elimina solo il riferimento del figlio.",
          "La nuova open crea una seconda descrizione dello stesso file, con un proprio offset. La lettura del figlio porta quel secondo offset a sei e lascia quello del padre a zero.",
          "Per far avanzare l’offset osservato anche dal padre, il figlio può leggere direttamente dal descrittore ereditato. In quel caso i due riferimenti portano alla medesima descrizione aperta."
        ],
        quadro: [
          {titolo: "Stesso file sul disco", tipo: "confronto", celle: [["Padre", "apertura originaria"], ["Figlio", "nuova open"], ["Lettura", "6 byte"]], nota: "Il padre osserva l’offset dopo la terminazione del figlio."},
          {titolo: "Descrittore ereditato", tipo: "confronto", celle: [["Padre", "riferimento vivo"], ["Figlio", "chiude la copia"]], nota: "La chiusura riguarda la tabella del figlio."},
          {titolo: "Due aperture", tipo: "confronto", celle: [["Offset del padre", "0"], ["Offset del figlio", "6"]], nota: "Ogni descrizione aperta dispone del proprio cursore."},
          {titolo: "Modifica al programma", tipo: "confronto", celle: [["Padre", "offset 6"], ["Figlio", "fd ereditato"]], nota: "Con l’apertura condivisa la lettura sposta il cursore comune."}
        ]
      }
    ]
  );

  prova(2, 3, 3, "Verificare ciò che sopravvive a exec",
    "Execve carica un nuovo programma nello stesso processo. Al successo sostituisce l’immagine, cioè istruzioni e dati del programma in memoria, conservando il PID, il suo numero identificativo. Un descrittore è il numero con cui il processo accede a un file aperto; il flag FD_CLOEXEC è una marcatura che ne richiede la chiusura al caricamento riuscito. Se il percorso è assente, execve restituisce −1 al chiamante e la variabile errno contiene ENOENT, il codice che indica quell’assenza. In questo ramo continua il programma originario e la marcatura lascia ancora aperto il descrittore.",
    [
      v(
        "Il processo 78 ha due descrittori aperti: 3 senza flag e 4 marcato FD_CLOEXEC. execve ha successo.",
        [
          num("PID della nuova immagine", "78", "execve opera sul processo chiamante."),
          num("Quale dei due descrittori resta aperto?", "3", "Il flag è valutato al caricamento riuscito.")
        ],
        [
          "Il kernel sostituisce codice, dati e stack con la nuova immagine.",
          "L’identità del processo resta 78 e il programma inizia dal nuovo punto di ingresso.",
          "Il kernel chiude fd 4 per FD_CLOEXEC. Il descrittore 3 rimanda ancora alla stessa descrizione aperta."
        ]
      ),
      {
        consegna: "Un processo marca il descrittore 8 con FD_CLOEXEC, poi chiama execve per caricare un file assente. La chiamata restituisce −1 con errno uguale a ENOENT. Il vecchio programma, prima di chiudere altri descrittori, vuole registrare il motivo del mancato avvio attraverso il descrittore 8, aperto in scrittura. Stabilisci quale programma raggiunge la riga di registrazione e se il descrittore è ancora utilizzabile.",
        campi: [
          scelta("Programma che raggiunge la riga successiva", "Il chiamante originario", ["Il chiamante originario", "Il nuovo programma", "Un nuovo figlio"], "Osserva se la sostituzione dell’immagine ha avuto successo."),
          scelta("Stato del descrittore 8 dopo il ritorno", "Aperto", ["Aperto", "Chiuso"], "Il flag provoca la chiusura al caricamento riuscito.")
        ],
        svolgimento: [
          "ENOENT indica che manca il file richiesto. Nel caso descritto execve restituisce un errore al programma che l’ha invocata.",
          "La riga di registrazione appartiene dunque ancora al chiamante, che può consultare errno. Nessun figlio è stato creato dalla chiamata.",
          "La chiusura associata a FD_CLOEXEC avviene con la sostituzione riuscita dell’immagine. Il descrittore 8 è ancora aperto in scrittura e può essere usato per il messaggio."
        ],
        quadro: [
          {titolo: "Tentativo di caricamento", tipo: "sequenza", celle: [["File", "assente"], ["Flag di fd 8", "FD_CLOEXEC"], ["Ritorno", "−1"]], nota: "L’errore osservato è ENOENT."},
          {titolo: "Esito", tipo: "sequenza", celle: [["Immagine richiesta", "assente"], ["execve", "fallita"]], nota: "Il flusso torna all’istruzione successiva del chiamante."},
          {titolo: "Identità del programma", tipo: "sequenza", celle: [["Codice attivo", "originario"], ["Nuovi figli", "0"]], nota: "La registrazione appartiene al percorso di errore."},
          {titolo: "Descrittore e messaggio", tipo: "sequenza", celle: [["fd 8", "aperto"], ["Uso previsto", "scrittura"]], nota: "Il flag si applica al caricamento riuscito."}
        ]
      }
    ]
  );

  prova(2, 4, 4, "Interpretare la terminazione raccolta da waitpid",
    "Waitpid restituisce il PID, il numero identificativo del figlio raccolto, e scrive separatamente uno stato che descrive la terminazione. Un figlio già terminato il cui risultato attende la raccolta è chiamato zombie. La chiamata _exit comunica un codice di uscita; WIFEXITED verifica tale tipo di conclusione e WEXITSTATUS ne estrae il codice. Un segnale è un avviso del sistema: SIGCHLD notifica al padre eventi del figlio, mentre SIGTERM richiede la terminazione. Se il figlio è terminato per un segnale, WIFSIGNALED risulta vero e WTERMSIG ricava il numero del segnale. Queste macro interpretano lo stato; getpid restituisce invece l’identificativo del processo che la esegue.",
    [
      v(
        "Il figlio 813 effettua _exit(4). Il padre, unico raccoglitore, invoca waitpid soltanto un secondo più tardi. Si applica la gestione ordinaria di SIGCHLD.",
        [
          scelta("Stato del figlio nell’intervallo", "zombie", ["orfano", "zombie", "pronto"], "La CPU ha terminato il calcolo. Il padre è ancora vivo."),
          num("WEXITSTATUS dopo la raccolta", "4", "Lo stato va interpretato dopo il controllo WIFEXITED.")
        ],
        [
          "Il figlio ha terminato. Il kernel conserva PID e risultato in attesa della raccolta: il record è uno zombie.",
          "waitpid(813, …) restituisce 813 e consegna lo stato al padre.",
          "La terminazione è normale, dunque WIFEXITED è vero e WEXITSTATUS restituisce 4. Il record è ora raccolto."
        ]
      ),
      {
        consegna: "Il padre raccoglie con waitpid il figlio 942, che è stato terminato da SIGTERM. Sul valore di stato restituito WIFSIGNALED è vero e WIFEXITED è falso. Un registro degli esiti richiede sia il PID sia la causa della terminazione. Scegli l’operazione adatta e individua il numero che identifica il processo raccolto.",
        campi: [
          scelta("Operazione per ricavare la causa", "WTERMSIG(stato)", ["WEXITSTATUS(stato)", "WTERMSIG(stato)", "getpid()"], "Scegli la macro prevista per una terminazione da segnale."),
          num("PID restituito da waitpid al successo", "942", "Il valore di ritorno identifica il figlio raccolto, mentre il parametro di uscita contiene lo stato.")
        ],
        svolgimento: [
          "Il ritorno positivo di waitpid identifica il figlio raccolto. Qui quel numero è 942. La causa è codificata separatamente nel valore di stato.",
          "WIFSIGNALED vero indica una terminazione dovuta a un segnale. Per quel ramo WTERMSIG restituisce il numero del segnale, in questo caso quello di SIGTERM.",
          "WEXITSTATUS riguarda il ramo che soddisfa WIFEXITED. Il registro conserva quindi il PID 942 e, come causa, SIGTERM."
        ],
        quadro: [
          {titolo: "Esito della raccolta", tipo: "stato", celle: [["Figlio", "942"], ["WIFSIGNALED", "vero"], ["WIFEXITED", "falso"]], nota: "PID e stato sono due uscite diverse di waitpid."},
          {titolo: "Identità", tipo: "stato", celle: [["Ritorno di waitpid", "942"], ["Dato separato", "stato"]], nota: "Il valore positivo identifica il figlio raccolto."},
          {titolo: "Interpretazione", tipo: "stato", celle: [["Tipo", "segnale"], ["Operazione", "WTERMSIG"]], nota: "Si sceglie la macro ammessa dal tipo di terminazione."},
          {titolo: "Registrazione finale", tipo: "stato", celle: [["PID", "942"], ["Causa", "SIGTERM"]], nota: "Il registro distingue l’identità dalla causa."}
        ]
      }
    ]
  );

  prova(2,5,2,'Contare i discendenti nei rami condizionali',
    'Ciascun fork riuscito aggiunge un processo. I rami successivi dipendono dal valore restituito a ogni chiamante, quindi una chiamata scritta una sola volta può essere eseguita da più processi.',
    [true,false].map(parent=>v(
    'Un solo processo esegue il frammento. Ogni fork riesce e ciascun ramo raggiunge fine(). Segui il confronto '+(parent?'r > 0':'r >= 0')+' separatamente nel padre e nel figlio.',
    [num('Processi che raggiungono fine()',parent?3:4,'Disegna il primo bivio e applica la condizione in ciascun ramo.'),num('Chiamate a fork eseguite in totale',parent?2:3,'Conta le invocazioni effettive, una per processo chiamante.')],
    ['Il primo fork produce il padre con r > 0 e il figlio con r = 0.',parent?'Soltanto r > 0 supera il controllo: il padre crea un altro figlio.':'Entrambi soddisfano r >= 0: ognuno crea un ulteriore figlio.','Le chiamate sono '+(parent?2:3)+'. Ogni successo aggiunge un processo, quindi a fine() arrivano 1 + '+(parent?2:3)+' = '+(parent?3:4)+' processi.'],
    'pid_t r = fork();\nif (r '+(parent?'>':'>=')+' 0) {\n    fork();\n}\nfine();')));

  prova(3, 1, 1, "Misurare le attese su una traccia",
    "Il tempo di risposta va dall’arrivo al primo turno sul core. Il turnaround copre l’intervallo fino al completamento. Per ripartirlo occorre tenere distinti il servizio CPU, i periodi nella coda dei pronti e gli eventuali periodi in attesa di un dispositivo.",
    [
      v(
        "P arriva a 2 ms, gira da 5 a 7, torna pronto e gira di nuovo da 10 a 12, quando termina. Tutti i tempi sono in ms e P trascorre gli intervalli fuori CPU nella coda dei pronti.",
        [
          num("Tempo di risposta (ms)", "3", "Usa solo il primo avvio."),
          num("Attesa totale (ms)", "6", "Somma entrambi gli intervalli nella coda."),
          num("Turnaround (ms)", "10", "Misura dall’arrivo al completamento.")
        ],
        [
          "Il primo avvio dà risposta = 5 − 2 = 3 ms.",
          "L’attesa aggiuntiva dopo la prima esecuzione è 10 − 7 = 3 ms. L’attesa totale è 6 ms.",
          "Il turnaround è 12 − 2 = 10 ms. Verifica: attesa 6 + CPU 4 = 10."
        ]
      ),
      {
        consegna: "Una misura riporta per P l’ingresso nella coda dei pronti al tempo 2 ms, un completamento al tempo 14 ms e 5 ms complessivi di CPU. Fra arrivo e completamento P attende un dispositivo per 3 ms. Il primo turno comincia a 4 ms. Determina quanta attesa in coda nasconde la misura e verifica la risposta iniziale.",
        campi: [
          num("Tempo complessivo in coda dei pronti (ms)", "4", "Dal tempo di attraversamento sottrai tanto il lavoro utile quanto il blocco sul dispositivo."),
          num("Tempo di risposta (ms)", "2", "Confronta il primo avvio con l’istante di arrivo.")
        ],
        svolgimento: [
          "P rimane nel sistema per 14 − 2 = 12 ms. In questi dodici millisecondi si alternano CPU, attesa nella coda dei pronti e blocco sul dispositivo.",
          "Si conoscono 5 ms di CPU e 3 ms di blocco. Alla coda dei pronti restano 12 − 5 − 3 = 4 ms. Attribuire al pronto tutti i millisecondi fuori CPU includerebbe anche l’attesa del dispositivo.",
          "Il primo turno segue l’arrivo di 4 − 2 = 2 ms. Questo è il tempo di risposta, che costituisce soltanto una parte dell’attesa complessiva in coda."
        ],
        quadro: [
          {titolo: "Misure del processo", tipo: "stato", celle: [["Arrivo", "2 ms"], ["Primo turno", "4 ms"], ["Fine", "14 ms"]], nota: "Sono noti anche 5 ms di CPU e 3 ms di blocco."},
          {titolo: "Tempo di attraversamento", tipo: "stato", celle: [["Fine − arrivo", "12 ms"], ["CPU", "5 ms"], ["Dispositivo", "3 ms"]], nota: "Le tre categorie di tempo sono disgiunte."},
          {titolo: "Tempo pronto", tipo: "stato", celle: [["Attraversamento", "12 ms"], ["CPU e blocco", "8 ms"], ["In coda", "4 ms"]], nota: "La differenza ricostruisce il dato mancante."},
          {titolo: "Prima risposta", tipo: "stato", celle: [["Arrivo", "2 ms"], ["Primo uso", "4 ms"], ["Risposta", "2 ms"]], nota: "L’attesa iniziale si misura fino al primo turno."}
        ]
      }
    ]
  );

  prova(3, 2, 2, "Costruire il diagramma FCFS",
    "FCFS significa first come, first served: il core, l’unità del processore che esegue le istruzioni, serve i lavori nell’ordine di arrivo. Il burst è la durata di calcolo richiesta da ciascun lavoro. Quando gli arrivi sono simultanei, la regola di spareggio stabilisce chi precede gli altri; l’attesa di ogni processo è la somma dei burst che lo precedono. Dividendo la somma delle attese individuali per il numero dei processi si ottiene l’attesa media. Con gli stessi lavori, cambi istantanei e core sempre impegnato, il completamento finale coincide con la somma dei burst.",
    [
      v(
        "A, B, C sono pronti al tempo 0 e serviti in questo ordine da FCFS senza costi di cambio. I burst sono 9, 3 e 2 ms.",
        [
          num("Attesa media (ms)", "7", "Ricava separatamente l’inizio di A, B e C."),
          num("Completamento di C (ms)", "14", "Il core lavora senza intervalli inattivi.")
        ],
        [
          "A parte a 0 e termina a 9. B parte a 9 e termina a 12.",
          "C parte a 12 e termina a 14. Le attese sono 0, 9 e 12 ms.",
          "Dividendo la loro somma per tre si ottiene 7 ms. Il completamento finale uguaglia la somma dei burst."
        ]
      ),
      {
        consegna: "Tre processi arrivano insieme. FCFS usa uno spareggio esplicito che può essere A, B, C oppure B, A, C. A richiede 8 ms, B ne richiede 2 e C ne richiede 5. Un analista sostiene che lo spareggio cambi il completamento finale. Verifica l’affermazione e individua l’ordine con minore attesa media.",
        campi: [
          scelta("Ordine con minore attesa media", "B, A, C", ["A, B, C", "B, A, C", "Stessa media"], "Metti a confronto le tre attese individuali nei due ordini."),
          num("Completamento dell’ultimo processo in entrambi gli ordini (ms)", "15", "La CPU esegue gli stessi lavori senza pause né costi di cambio.")
        ],
        svolgimento: [
          "Nell’ordine A, B, C i processi iniziano a 0, 8 e 10 ms. La somma delle attese è 18 ms, dunque la media è 6 ms.",
          "Con B, A, C gli inizi diventano 0, 2 e 10 ms. Le attese sommano 12 ms e la media scende a 4 ms, quindi conviene far passare B davanti ad A.",
          "Il servizio totale è 8 + 2 + 5 = 15 ms in entrambi i casi. Senza intervalli inattivi e costi di cambio il completamento del gruppo cade sempre a 15 ms."
        ],
        tempi: {limite: 15, fotogrammi: [
          {titolo: "Durate richieste da A, B e C", righe: [], nota: "A richiede 8 ms, B 2 ms e C 5 ms."},
          {titolo: "A prima di B", righe: [["ABC", [["A", 8], ["B", 2], ["C", 5]]]], nota: "La somma delle attese vale diciotto millisecondi."},
          {titolo: "B prima di A", righe: [["ABC", [["A", 8], ["B", 2], ["C", 5]]], ["BAC", [["B", 2], ["A", 8], ["C", 5]]]], nota: "La somma delle attese scende a dodici millisecondi."},
          {titolo: "Confronto", righe: [["ABC", [["A", 8], ["B", 2], ["C", 5]]], ["BAC", [["B", 2], ["A", 8], ["C", 5]]]], nota: "Cambia l’attesa, mentre il lavoro utile complessivo vale quindici."}
        ]}
      }
    ]
  );

  prova(3, 3, 2, "Confrontare SJF e SRTF all’arrivo di B",
    "SJF significa shortest job first e sceglie il lavoro pronto più breve. Nella versione senza prelazione il turno già iniziato prosegue fino al termine del burst, il tratto di calcolo richiesto al processore. SRTF significa shortest remaining time first e confronta invece il lavoro ancora da eseguire: può interrompere il processo corrente se il nuovo arrivato ha un residuo inferiore. Il residuo del processo corrente si ricava sottraendo dal burst iniziale il servizio già ricevuto. In caso di parità si applica lo spareggio dichiarato dalla traccia.",
    [
      v(
        "A arriva al tempo 0 con burst 9 ms. B arriva al tempo 2 con burst 3 ms. I lavori sono soltanto A e B e il costo di cambio è nullo. SJF è qui senza prelazione.",
        [
          num("Completamento di B con SJF (ms)", "12", "A mantiene il core fino al termine del burst."),
          num("Completamento di B con SRTF (ms)", "5", "Confronta il burst di B col residuo di A al suo arrivo.")
        ],
        [
          "All’arrivo di B il residuo di A vale 9 − 2 = 7 ms.",
          "SJF lascia terminare A. B occupa il core da 9 a 12 ms.",
          "SRTF sceglie B perché 3 < 7. B va da 2 a 5 ms, poi A riprende fino a 12."
        ]
      ),
      {
        consegna: "A riceve subito la CPU e richiede in tutto 8 ms. B arriva al tempo 3 con un burst di 6 ms. Il diagramma mostra A in esecuzione anche subito dopo l’arrivo di B. Un osservatore vuole identificare lo scheduler scegliendo fra SJF senza prelazione e SRTF. Determina se quel tratto basti a identificarlo, poi trova la maggiore durata intera positiva di B che renderebbe i due diagrammi diversi. In caso di parità si conserva il processo corrente.",
        campi: [
          scelta("Politiche compatibili con il tratto osservato", "Entrambe", ["Solo SJF", "Solo SRTF", "Entrambe"], "Confronta i sei millisecondi di B con il residuo di A all’arrivo."),
          num("Maggiore burst intero di B che innesca la prelazione (ms)", "4", "Per la prelazione il burst di B deve essere strettamente inferiore al residuo di A.")
        ],
        svolgimento: [
          "All’arrivo di B sono già trascorsi 3 degli 8 ms richiesti da A. Il residuo di A vale quindi 5 ms, inferiore ai 6 ms di B.",
          "SJF conserva il turno iniziato e SRTF sceglie il residuo minore, che in questo caso appartiene ancora ad A. Il tratto osservato è compatibile con entrambe le politiche.",
          "Con 5 ms per B ci sarebbe parità e la regola manterrebbe A. Il maggiore intero che cambia la scelta di SRTF è 4 ms. In quel caso SRTF sceglie B al tempo 3 e SJF prosegue con A."
        ],
        quadro: [
          {titolo: "Il turno prosegue", tipo: "confronto", celle: [["A all’arrivo", "8 ms"], ["Arrivo di B", "3 ms"], ["Servizio di B", "6 ms"]], nota: "Si conosce soltanto il processo in esecuzione dopo il nuovo arrivo."},
          {titolo: "Dati comparabili", tipo: "confronto", celle: [["Lavoro di A", "8 − 3"], ["Residuo di A", "5 ms"], ["B", "6 ms"]], nota: "SRTF confronta il lavoro ancora da eseguire."},
          {titolo: "Stesso tratto osservato", tipo: "confronto", celle: [["SJF", "conserva A"], ["SRTF", "sceglie A"]], nota: "Entrambe le politiche spiegano il turno osservato."},
          {titolo: "Esperimento discriminante", tipo: "confronto", celle: [["Parità a 5 ms", "resta A"], ["B da 4 ms", "SRTF sceglie B"]], nota: "Il nuovo burst deve essere strettamente inferiore a cinque."}
        ]
      }
    ]
  );

  prova(3, 4, 3, "Verificare i turni del round-robin",
    "Un turno round-robin dura al massimo un quanto. Un processo che termina prima lascia subito il core al successivo, mentre un processo con lavoro residuo si accoda di nuovo.",
    [
      v(
        "A, B, C arrivano insieme in quest’ordine con burst 5, 3, 1 ms. Il quanto è 2 ms. I cambi sono istantanei. Un turno è una porzione di al più un quanto anche quando resta un solo processo.",
        [
          num("Prima risposta di C (ms)", "4", "Misura i primi turni di A e B."),
          num("Turni complessivi", "6", "Dividi ogni burst per il quanto arrotondando per eccesso.")
        ],
        [
          "Il primo giro usa 2 ms per A e 2 per B. C inizia a 4 ms.",
          "La traccia è A [0, 2), B [2, 4), C [4, 5), A [5, 7), B [7, 8), A [8, 9).",
          "I turni per A, B, C sono 3, 2, 1. La somma è 6 e il tempo utile totale è 9 ms."
        ]
      ),
      {
        consegna: "Un solo core serve in round-robin, senza costi di cambio. A, B e C arrivano a zero in questo ordine, con burst di 5, 1 e 3 ms e quanto di 2 ms. Una traccia proposta assegna A da 0 a 2, B da 2 a 4 e C da 4 a 6. Trova il primo turno incompatibile con i dati e ricostruisci l’inizio effettivo di C.",
        campi: [
          scelta("Primo turno da correggere", "Turno di B", ["Turno di A", "Turno di B", "Turno di C"], "Confronta il lavoro rimasto al processo con la lunghezza dell’intervallo assegnato."),
          num("Inizio corretto del primo turno di C (ms)", "3", "Un processo che termina rende subito disponibile il core.")
        ],
        svolgimento: [
          "Il primo turno di A occupa tutti i 2 ms del quanto perché A ha inizialmente 5 ms da svolgere. Alla fine del turno conserva un residuo di 3 ms.",
          "B entra al tempo 2 e ha un solo millisecondo di lavoro. Il suo intervallo finisce al tempo 3, quando B termina. Il tratto da 3 a 4 assegnato a B è quindi il primo errore.",
          "C, già in testa alla coda dei pronti, riceve il core al tempo 3 e lo conserva fino a 5. La durata di un turno è il minimo fra quanto e lavoro residuo."
        ],
        tempi: {limite: 6, fotogrammi: [
          {titolo: "Verifica dei turni", righe: [["Proposta", [["A", 2], ["B", 2], ["C", 2]]]], nota: "La traccia proposta fa iniziare C al tempo quattro."},
          {titolo: "Servizio di A", righe: [["Proposta", [["A", 2], ["B", 2], ["C", 2]]], ["Verificata", [["A", 2]]]], nota: "A consuma il primo quanto per intero."},
          {titolo: "Conclusione di B", righe: [["Proposta", [["A", 2], ["B", 2], ["C", 2]]], ["Verificata", [["A", 2], ["B", 1]]]], nota: "Un turno si chiude quando il processo termina."},
          {titolo: "Assegnazione di C", righe: [["Proposta", [["A", 2], ["B", 2], ["C", 2]]], ["Verificata", [["A", 2], ["B", 1], ["C", 2]]]], nota: "C trova subito disponibile il core."}
        ]}
      }
    ]
  );

  prova(3, 5, 4, "Calcolare il ritardo dell’inversione di priorità",
    "La priorità stabilisce la precedenza fra i thread pronti, ciascuno un flusso di istruzioni. Su un core, H può avere precedenza su M e L eppure aspettare un mutex posseduto da L. Il mutex, detto anche lock, riserva una risorsa al proprio possessore: H può proseguire soltanto dopo il rilascio. Con priorità fisse M può precedere L e ritardare quel rilascio. Con ereditarietà L riceve temporaneamente la priorità di H, completa il proprio lavoro protetto e poi restituisce il mutex e recupera la priorità originaria.",
    [
      v(
        "Su un solo core lo scheduler applica priorità con prelazione. L possiede il mutex e deve ancora eseguire 2 ms sotto lock. Al tempo 0 H chiede il mutex e si blocca. Nello stesso istante M diventa pronto per 5 ms. Priorità H > M > L, costi di cambio nulli.",
        [
          num("Attesa di H con priorità fisse (ms)", "7", "M è pronto e ha priorità superiore a L."),
          num("Attesa di H con ereditarietà (ms)", "2", "Individua chi eredita la priorità di H.")
        ],
        [
          "Senza ereditarietà il dispatcher esegue M per 5 ms, poi L per 2 ms.",
          "L rilascia il mutex a 7 ms e H può ripartire.",
          "Con ereditarietà L riceve la priorità di H, prevale su M e rilascia il mutex dopo 2 ms."
        ]
      ),
      {
        consegna: "Su un core con priorità H > M > L, L deve ancora lavorare 2 ms prima di liberare il lock richiesto da H. H si blocca al tempo zero, quando M diventa pronto per 5 ms. Nei primi due millisecondi la traccia mostra soltanto L in esecuzione e subito dopo il rilascio di L mostra H. I cambi sono istantanei. Identifica quale delle due politiche, fissa o con ereditarietà, spiega la traccia e ricostruisci l’attesa che H avrebbe subito con l’altra.",
        campi: [
          scelta("Politica compatibile", "Con ereditarietà", ["Priorità fisse", "Con ereditarietà"], "Uno dei due protocolli permette al proprietario di precedere M anche mentre H è bloccato."),
          num("Attesa di H con l’altra politica (ms)", "7", "Prima che il proprietario possa terminare conta il lavoro di ogni pronto che lo precede.")
        ],
        svolgimento: [
          "Al tempo zero H è bloccato e M è pronto. Con priorità fisse M precederebbe L e occuperebbe il core nei primi 5 ms.",
          "Il turno immediato di L richiede l’ereditarietà. L usa temporaneamente la priorità di H, completa i due millisecondi della sezione critica e rilascia il lock.",
          "Con l’altra politica, dopo i 5 ms di M, a L servirebbero ancora 2 ms. L’attesa di H sarebbe quindi 5 + 2 = 7 ms."
        ],
        tempi: {limite: 7, fotogrammi: [
          {titolo: "Ordine registrato", righe: [["Registro", [["L", 2]]]], nota: "Il turno di L dura due millisecondi."},
          {titolo: "Controfattuale a priorità fisse", righe: [["Registro", [["L", 2]]], ["Fisse", [["M", 5]]]], nota: "La priorità di base di M supera quella di L."},
          {titolo: "Politica osservata", righe: [["Eredita", [["L", 2]]], ["Fisse", [["M", 5]]]], nota: "L può precedere M solo con l’ereditarietà."},
          {titolo: "Attesa alternativa", righe: [["Eredita", [["L", 2]]], ["Fisse", [["M", 5], ["L", 2]]]], nota: "Con priorità fisse il rilascio segue entrambi i turni."}
        ]}
      }
    ]
  );

  prova(4,1,1,'Distinguere registri e heap',
    'I thread condividono le celle dell’heap e ciascuno conserva i propri registri. Dopo la barriera B può osservare un valore scritto da A nell’heap.',
    [['heap',42],['registro',17]].map(([which,x])=>{
    const heap=which==='heap';
    return v('A e B sono thread dello stesso processo. La cella h nell’heap vale 2. Il registro r di B vale 6. A scrive '+x+(heap?' in h.':' nel proprio registro r.')+' Una barriera sincronizza i thread, poi B esamina h e il proprio r.',
      [num('Valore di h letto da B',heap?x:2,'I thread vedono la stessa cella dell’heap.'),num('Valore del registro r di B',6,'Ogni thread possiede un proprio contesto.')],
      ['Prima dell’operazione B trova h = 2 e r = 6.',heap?'A modifica una cella comune. La barriera rende visibile h = '+x+' a B.':'A modifica il proprio contesto. L’heap resta a 2.', 'La scrittura di A lascia il registro di B a 6. I valori osservati da B sono quindi '+(heap?x:2)+' e 6.']);
  }));
  prova(4, 2, 2, "Misurare il parallelismo disponibile",
    "Per eseguire simultaneamente, ciascun thread pronto richiede un contesto hardware. A parità di durata, il tempo totale dipende dal numero di gruppi che i core possono portare a termine.",
    [
      v(
        "7 thread indipendenti sono pronti al tempo 0. Ciascuno richiede 3 ms di CPU senza sospensioni. Sono disponibili 2 core, ciascuno con un solo contesto di esecuzione. Ogni core libero prende subito un thread pronto e lo esegue fino al termine. I cambi sono istantanei.",
        [
          num("Thread simultanei massimi", "2", "Conta le risorse hardware disponibili."),
          num("Tempo per completare tutti i thread (ms)", "12", "Dividi i thread in gruppi grandi al più quanto il numero dei core.")
        ],
        [
          "I thread concorrenti all’inizio sono 7 e l’hardware può eseguirne 2 insieme.",
          "Occorrono ⌈7/2⌉ = 4 gruppi. Ogni gruppo dura 3 ms.",
          "L’ultimo termina a 12 ms. L’eventuale gruppo incompleto ha uguale durata."
        ]
      ),
      {
        consegna: "Sei thread indipendenti richiedono 3 ms di CPU ciascuno. Ogni core serve un thread per volta fino al termine. I lavori sono già pronti e i cambi sono istantanei. Il servizio deve finire entro 7 ms: scegli il numero minimo di core e calcola il margine che rimane prima della scadenza.",
        campi: [
          num("Numero minimo di core", "3", "Conta quanti lavori interi da tre millisecondi può concludere un solo core entro il tempo dato."),
          num("Margine con la configurazione minima (ms)", "1", "Sottrai dalla scadenza la durata dei gruppi di lavoro necessari.")
        ],
        svolgimento: [
          "In 7 ms un core può completare due turni da 3 ms. Con due core si completerebbero al massimo quattro lavori, insufficienti per la scadenza.",
          "Con tre core partono tre thread a zero e gli altri tre al tempo 3. L’ultimo gruppo termina a 6 ms, perciò tre core sono sufficienti e costituiscono il minimo.",
          "Dal termine a 6 ms fino alla scadenza a 7 ms rimane 1 ms. Il margine si determina sul completamento dell’ultimo gruppo."
        ],
        quadro: [
          {titolo: "Vincolo di progetto", tipo: "sequenza", celle: [["Lavori", "6"], ["Durata", "3 ms"], ["Scadenza", "7 ms"]], nota: "Un turno su un core deve contenere tutto il burst."},
          {titolo: "Limite per core", tipo: "sequenza", celle: [["Due turni", "6 ms"], ["Tre turni", "9 ms"]], nota: "Entro la scadenza entrano due lavori completi per core."},
          {titolo: "Configurazione minima", tipo: "sequenza", celle: [["Primo gruppo", "3 thread"], ["Secondo gruppo", "3 thread"], ["Core", "3"]], nota: "Due core completerebbero al massimo quattro lavori."},
          {titolo: "Durata e margine", tipo: "sequenza", celle: [["Ultimo termine", "6 ms"], ["Scadenza", "7 ms"], ["Margine", "1 ms"]], nota: "Le due ondate esauriscono tutti e sei i lavori."}
        ]
      }
    ]
  );

  prova(4, 3, 3, "Contare i worker dopo un blocco",
    "Un thread utente è un’attività gestita da una libreria, il runtime del programma. Per eseguirne le istruzioni occorre un worker, un’entità alla quale il kernel, la parte del sistema operativo che governa le risorse, possa assegnare un core di calcolo. Una chiamata bloccante sospende il worker che la esegue fino all’arrivo dei dati. Il massimo numero di thread simultanei è il minore fra thread pronti, worker eseguibili e core disponibili. Creare un worker può quindi aumentare tale massimo quando i core liberi sono già sufficienti.",
    [
      v(
        "4 thread utente si appoggiano a 1 worker del kernel su una macchina con 1 core. Una lettura blocca un worker e il suo thread utente. Gli altri thread sono pronti e il runtime mantiene il numero di worker fissato.",
        [
          num("Worker ancora eseguibili", "0", "Dalla dotazione iniziale sottrai il worker bloccato."),
          num("Numero massimo di altri thread utente in esecuzione", "0", "Un thread utente in esecuzione richiede un worker disponibile.")
        ],
        [
          "La lettura sospende un’entità di kernel. Restano 1 − 1 = 0 worker eseguibili.",
          "I thread utente rimanenti sono 3 e possono avanzare soltanto attraverso questi worker.",
          "Il numero simultaneo è min(3, 0) = 0."
        ]
      ),
      {
        consegna: "Quattro thread utente usano due worker del kernel, su quattro core. Il primo worker entra in una lettura bloccante e viene sospeso. Rimangono tre thread utente pronti. Per eseguirne due contemporaneamente, il runtime può creare un worker aggiuntivo oppure chiedere un quinto core. Scegli l’intervento sufficiente e ricava il massimo simultaneo dopo averlo applicato.",
        campi: [
          scelta("Intervento sufficiente", "Creare un worker aggiuntivo", ["Creare un worker aggiuntivo", "Aggiungere soltanto un core", "Aumentare la dimensione degli stack"], "Confronta i core già liberi con i worker che possono ancora eseguire i thread utente."),
          num("Thread simultanei dopo l’intervento", "2", "Limita la risposta con i pronti, i worker eseguibili e i core.")
        ],
        svolgimento: [
          "Il blocco lascia un solo worker eseguibile. Con tre thread pronti e quattro core, è la disponibilità di worker a limitare il parallelismo a uno.",
          "Un quinto core troverebbe ancora un solo worker eseguibile. Un worker aggiuntivo porta invece a due il numero di entità alle quali il kernel può assegnare un core.",
          "Dopo la creazione il massimo simultaneo è il minimo fra tre pronti, due worker eseguibili e quattro core, cioè due thread utente."
        ],
        quadro: [
          {titolo: "Risorse iniziali", tipo: "confronto", celle: [["Thread utente", "4"], ["Worker", "2"], ["Core", "4"]], nota: "Una lettura sospende uno dei due worker."},
          {titolo: "Limite operante", tipo: "confronto", celle: [["Pronti", "3"], ["Worker eseguibili", "1"], ["Core", "4"]], nota: "Il minimo delle tre capacità vale uno."},
          {titolo: "Interventi", tipo: "confronto", celle: [["Quinto core", "1 worker utile"], ["Worker in più", "2 worker utili"]], nota: "Solo il nuovo worker modifica il vincolo attivo."},
          {titolo: "Capacità raggiunta", tipo: "confronto", celle: [["Pronti", "3"], ["Worker", "2"], ["Simultanei", "2"]], nota: "Il kernel può mobilitare due core anche se altri restano liberi."}
        ]
      }
    ]
  );

  prova(4, 4, 4, "Ricostruire gli argomenti dopo la barriera",
    "Un thread riceve alla creazione un puntatore, cioè l’indirizzo dell’oggetto che dovrà leggere. La scrittura &i indica l’indirizzo della variabile i; &a[i] quello della cella di indice i nell’array a, una sequenza di celle numerate da zero. Una barriera trattiene le letture fino al completamento della preparazione. Dopo quel punto, puntatori uguali raggiungono lo stesso oggetto e puntatori a celle diverse raggiungono i valori conservati in quelle celle. Il creatore deve mantenerle in vita fino alle letture; può farlo completando i join, le attese di fine dei thread, prima di uscire dal blocco che contiene gli oggetti.",
    [
      v(
        "Il thread creatore avvia quattro thread mentre i assume i valori 0, 1, 2, 3. Copia i in a[i] e passa &a[i]. Dopo l’ultimo incremento i vale 4. Una barriera sincronizza tutte le letture successive. Sia i sia a sopravvivono fino a tutti i join.",
        [
          num("Valori distinti letti dai quattro thread", "4", "Confronta gli indirizzi passati."),
          num("Somma dei quattro valori letti", "6", "Scrivi prima il valore raggiunto da ciascun puntatore.")
        ],
        [
          "I puntatori identificano quattro elementi distinti, ognuno inizializzato prima della barriera.",
          "I worker leggono rispettivamente 0, 1, 2, 3. I distinti sono quattro.",
          "La somma è 0 + 1 + 2 + 3 = 6. Il creatore completa i join prima dell’uscita dal blocco che contiene l’array."
        ]
      ),
      {
        consegna: "Quattro worker ricevono un puntatore e attendono la stessa barriera. Il creatore attraversa i valori 0, 1, 2 e 3, poi lascia i uguale a 4 prima di aprire la barriera. Il registro mostra quattro letture uguali a 4. Sono possibili due sole costruzioni: passare a tutti &i, oppure scrivere a[i] = i e passare ogni volta &a[i]. Le celle vivono fino alla fine di tutti i join. Deduci quale costruzione ha prodotto il registro e stabilisci quale dato conservare per ottenere quattro valori distinti.",
        campi: [
          scelta("Costruzione compatibile con il registro", "Quattro copie di &i", ["Quattro copie di &i", "Quattro indirizzi distinti &a[i]"], "Confronta gli oggetti dai quali, dopo la barriera, provengono le quattro letture."),
          scelta("Dato da conservare per ciascun worker", "Un indice in una propria cella ancora valida", ["Una copia del puntatore &i", "Un indice in una propria cella ancora valida", "Il valore del numero di core"], "Copiare il solo indirizzo di i lascia condiviso l’oggetto puntato.")
        ],
        svolgimento: [
          "La barriera colloca tutte le letture dopo l’ultimo incremento del creatore. In quel momento la cella i contiene 4.",
          "Se tutti ricevono &i, i puntatori conducono alla stessa cella e le quattro letture restituiscono 4. Con gli indirizzi distinti &a[i] le celle contengono invece 0, 1, 2 e 3.",
          "Per preservare l’indice di ogni worker serve dunque una cella distinta che conservi quel valore e rimanga valida fino alla lettura. Quattro copie dello stesso indirizzo lascerebbero un unico oggetto condiviso."
        ],
        quadro: [
          {titolo: "Registro dei quattro worker", tipo: "confronto", celle: [["Letture", "4, 4, 4, 4"], ["Ultimo i", "4"]], nota: "Tutti leggono soltanto dopo la barriera."},
          {titolo: "Oggetto condiviso", tipo: "confronto", celle: [["W0 e W1", "&i"], ["W2 e W3", "&i"], ["Cella i", "4"]], nota: "I quattro puntatori conducono alla stessa posizione."},
          {titolo: "Confronto con l’array", tipo: "confronto", celle: [["Celle distinte", "4"], ["Contenuti", "0, 1, 2, 3"]], nota: "Questa disposizione produrrebbe quattro letture distinte."},
          {titolo: "Correzione", tipo: "confronto", celle: [["Per worker", "una cella"], ["Durata", "fino alla lettura"]], nota: "Il valore viene copiato in un oggetto con vita sufficiente."}
        ]
      }
    ]
  );

  prova(4, 5, 5, "Raggruppare i lavoratori per processo",
    "Un processo dispone di uno spazio di indirizzi, l’insieme delle posizioni di memoria attraverso cui raggiunge istruzioni e dati. I suoi thread, flussi di istruzioni distinti, condividono questo spazio e ciascuno dispone di uno stack, un’area che conserva chiamate di funzione e dati locali. Nel guasto fatale descritto la terminazione di un processo termina tutti i suoi thread. Raggruppare i lavoratori determina quindi sia il numero degli spazi e degli stack sia il confine entro cui si propagano gli effetti della terminazione.",
    [
      v(
        "Un servizio usa 2 processi distinti con 3 thread per processo, incluso il thread iniziale. Ogni thread ha uno stack utente proprio. Considera solo questi processi.",
        [
          num("Spazi di indirizzi", "2", "Raggruppa i thread per processo."),
          num("Stack utente", "6", "Conta tutti i flussi di esecuzione.")
        ],
        [
          "Ogni processo ha uno spazio di indirizzi, dunque gli spazi sono 2.",
          "Ogni gruppo di thread condivide lo spazio del proprio processo e conserva 3 stack distinti.",
          "Gli stack totali sono 2 × 3 = 6. Un cambio fra thread dello stesso gruppo ripristina anche il puntatore allo stack del nuovo thread."
        ]
      ),
      {
        consegna: "Un servizio deve isolare un guasto fatale di un lavoratore dagli altri due. I tre lavoratori sono divisi fra due processi, con due thread nel primo e uno nel secondo. Il guasto colpisce un lavoratore del primo processo e provoca la terminazione di quel processo. Scegli una disposizione che garantisca la sopravvivenza di entrambi gli altri lavoratori per qualsiasi singolo guasto di questo tipo. Ogni lavoratore usa uno stack utente e il supervisore è separato dal servizio.",
        campi: [
          num("Superstiti nel caso descritto", "1", "Individua il confine del processo che termina."),
          scelta("Organizzazione che garantisce due superstiti", "Un processo distinto per lavoratore", ["Tre thread nello stesso processo", "Un processo distinto per lavoratore", "Due thread insieme e uno separato"], "Quale gruppo condivide l’effetto della terminazione del processo?"),
          num("Stack dei tre lavoratori prima del guasto nella soluzione scelta", "3", "Ogni lavoratore mantiene il proprio stack a prescindere dal raggruppamento.")
        ],
        svolgimento: [
          "Terminando il primo processo scompaiono entrambi i suoi thread. Nel secondo processo resta il terzo lavoratore, quindi i superstiti sono uno.",
          "Affinché qualunque singolo guasto porti via un solo lavoratore, ognuno dei tre deve occupare un processo distinto. In questo modello il confine del guasto coincide con lo spazio del processo.",
          "I tre processi hanno tre spazi di indirizzi distinti e ciascun lavoratore possiede uno stack. Prima del guasto gli stack del servizio sono quindi tre."
        ],
        quadro: [
          {titolo: "Disposizione di partenza", tipo: "stato", celle: [["Primo processo", "A, B"], ["Secondo processo", "C"]], nota: "Il guasto colpisce A e termina il suo processo."},
          {titolo: "Conseguenze", tipo: "stato", celle: [["Primo processo", "terminato"], ["Superstite", "C"]], nota: "Il guasto raggiunge anche B, che condivide il processo."},
          {titolo: "Progetto alternativo", tipo: "stato", celle: [["Processo A", "A"], ["Processo B", "B"], ["Processo C", "C"]], nota: "Nessun guasto singolo coinvolge due lavoratori."},
          {titolo: "Stato prima del guasto", tipo: "stato", celle: [["Spazi distinti", "3"], ["Stack del servizio", "3"]], nota: "Il supervisore è escluso dal conteggio."}
        ]
      }
    ]
  );

  prova(5, 1, 1, "Ricostruire un incremento perso",
    "Un incremento può essere scomposto in una lettura e nella successiva scrittura del valore letto più uno. Atomicità significa che ogni singolo accesso appare indivisibile; fra i due accessi di un incremento può comunque inserirsi un accesso di un altro thread, un diverso flusso di istruzioni. Nella prova gli accessi sono sequenzialmente consistenti: si leggono in un unico ordine comune che conserva l’ordine delle operazioni di ciascun thread. Per ricostruire la scrittura finale occorre conservare separatamente l’ultimo valore letto da ciascun partecipante.",
    [
      v(
        "La cella atomica x vale 7. Ogni worker legge x e in una seconda operazione scrive il valore letto più uno. Gli accessi sono sequenzialmente consistenti. Ordine: A legge, B legge, A scrive, B scrive.",
        [
          num("Valore letto da B", "7", "Osserva se A ha già scritto."),
          num("Valore finale", "8", "B usa la propria lettura salvata.")
        ],
        [
          "A legge 7 e prepara 8.",
          "B legge ancora 7. I due worker preparano lo stesso risultato.",
          "Le due scritture depositano entrambe 8. Il confronto con 9 mostra un incremento perso."
        ]
      ),
      {
        consegna: "A e B incrementano una volta ciascuno il contatore x, che inizialmente vale 11. Ogni incremento contiene una lettura atomica seguita da una scrittura atomica del valore letto più uno. Dopo entrambi i completamenti x vale 12. Fra gli ordini proposti, scegli l’unico compatibile con questa osservazione e ricostruisci il valore letto da B.",
        campi: [
          scelta("Ordine compatibile", "A legge, B legge, A scrive, B scrive", ["A legge, A scrive, B legge, B scrive", "A legge, B legge, A scrive, B scrive", "B legge, B scrive, A legge, A scrive"], "Per perdere un incremento i due worker devono preparare lo stesso valore finale."),
          num("Valore letto da B", "11", "Riprendi la cella prima della prima scrittura del solo ordine compatibile.")
        ],
        svolgimento: [
          "Se un incremento fosse interamente concluso prima della lettura successiva, la seconda lettura troverebbe 12 e l’ultima scrittura porterebbe x a 13.",
          "Per terminare a 12 i due incrementi devono usare entrambi la vecchia cella. Fra le tre sequenze proposte questa situazione si verifica quando A e B leggono prima che A scriva.",
          "B legge dunque 11. A e B preparano entrambi 12 e la seconda scrittura ripete il valore della prima. Altre intercalazioni simmetriche sarebbero possibili fuori dall’elenco proposto."
        ],
        quadro: [
          {titolo: "Osservazione finale", tipo: "sequenza", celle: [["Valore iniziale", "11"], ["Incrementi", "2"], ["Valore finale", "12"]], nota: "Si cerca un ordine degli accessi compatibile con la misura."},
          {titolo: "Accessi seriali", tipo: "sequenza", celle: [["Dopo il primo", "12"], ["Dopo il secondo", "13"]], nota: "La serializzazione contraddice il valore osservato."},
          {titolo: "Letture accostate", tipo: "sequenza", celle: [["Lettura di A", "11"], ["Lettura di B", "11"]], nota: "Entrambe le letture precedono la prima scrittura."},
          {titolo: "Scritture accostate", tipo: "sequenza", celle: [["Scrittura di A", "12"], ["Scrittura di B", "12"], ["Cella finale", "12"]], nota: "La seconda scrittura ripete il risultato della prima."}
        ]
      }
    ]
  );

  const properties=['esclusione mutua','progresso','attesa limitata'];
  prova(5,2,2,'Individuare la proprietà violata',
    'La sezione critica è il tratto di programma che accede a una risorsa condivisa sotto un vincolo di esclusione. L’esclusione mutua ammette un solo partecipante per volta. Il progresso richiede che, quando la sezione è libera e vi sono richieste, la scelta dell’ingresso dipenda dai partecipanti interessati e possa essere conclusa. L’attesa limitata impone un limite al numero di sorpassi che una richiesta può subire. Un token è un permesso unico: nel protocollo della prima traccia viene ceduto alternativamente fra A e B, anche se il destinatario decide di svolgere altro lavoro.',
    [
    v('Il protocollo usa un token che alterna rigidamente A e B. Il token è in mano a B, che rimane per sempre in un calcolo esterno alla sezione critica. A vuole entrare e la sezione è libera.',[scelta('Proprietà che richiede una decisione fra gli interessati','progresso',properties,'Osserva chi può rinviare l’ingresso in una sezione libera.')],
      ['Il token unico mantiene l’esclusione mutua.','La sezione è libera e A è l’unico interessato, mentre la decisione dipende da B che resta all’esterno.','L’ingresso può essere rimandato indefinitamente: il protocollo viola il requisito di progresso.']),
    v('La sezione critica ammette un solo thread. A tenta continuamente di entrare mentre altri thread completano un numero arbitrariamente grande di ingressi prima di A.',[scelta('Quale proprietà imporrebbe un limite ai sorpassi?','attesa limitata',properties,'Conta gli ingressi degli altri dopo la richiesta di A.')],
      ['A ha già manifestato la richiesta di ingresso.','Altri thread entrano ed escono uno per volta, quindi il lavoro del sistema avanza e la mutua esclusione regge.','Poiché il numero di sorpassi può superare qualsiasi limite, manca l’attesa limitata.'])]);
  prova(5, 3, 6, "Seguire i permessi consegnati al risveglio",
    "Un semaforo conserva un contatore di permessi liberi e una coda di richieste sospese. Wait acquisisce un permesso oppure sospende il richiedente; signal rende disponibile un permesso. Con consegna diretta, quando la coda contiene sospesi, signal assegna subito il permesso al primo di essi e lo rende pronto per un turno sul processore. FIFO significa first in, first out: viene servito chi è entrato per primo nella coda. Il numero di sospesi e quello dei permessi ancora liberi misurano quindi due quantità distinte.",
    [
      v(
        "Il semaforo parte con 1 permesso libero. Arrivano in ordine A, B e C, ciascuno con una wait. Un quarto thread esegue poi una signal. Si usa una coda FIFO con consegna diretta al primo sospeso.",
        [
          num("Sospesi dopo le tre wait", "2", "Ogni permesso iniziale soddisfa una sola richiesta."),
          scelta("Chi diventa pronto dopo signal?", "B", ["A", "B", "C"], "Ricostruisci la coda rispettando l’ordine di arrivo."),
          num("Permessi liberi subito dopo signal", "0", "Distingui un permesso consegnato da un permesso disponibile.")
        ],
        [
          "A consuma l’unico permesso.",
          "La coda dei sospesi contiene 2 thread. In ordine di arrivo: B, C.",
          "signal consegna il permesso a B, che passa a pronto. Il contatore libero resta zero e i sospesi rimasti sono 1."
        ]
      ),
      {
        consegna: "Un semaforo con consegna diretta serve i sospesi in ordine FIFO. A, B e C eseguono una wait in quest’ordine. Un quarto thread esegue poi una signal. Si osservano B appena risvegliato e C ancora sospeso. Ricava la dotazione iniziale e stabilisci quale stato troverebbe una nuova wait di D, se nessuno intervenisse prima.",
        campi: [
          num("Permessi iniziali", "1", "Se la signal risveglia B, identifica chi aveva consumato un permesso prima che B si sospendesse."),
          scelta("Posizione di D dopo la sua nuova wait", "In coda dietro C", ["Esegue subito", "In coda davanti a C", "In coda dietro C"], "Un risveglio con consegna diretta assegna già il permesso a B.")
        ],
        svolgimento: [
          "Poiché B è il primo risvegliato, era in testa alla coda prima della signal. A, arrivato prima di B, aveva quindi consumato un permesso iniziale.",
          "La wait di B aveva trovato il contatore a zero. Con le sole operazioni descritte, il permesso consumato da A era dunque l’unico iniziale.",
          "La signal consegna il permesso a B, lasciando zero permessi liberi e C ancora sospeso. D si accoda in fondo, dietro C."
        ],
        quadro: [
          {titolo: "Indizi sul registro", tipo: "sequenza", celle: [["Ordine delle wait", "A, B, C"], ["Risvegliato", "B"], ["Ancora sospeso", "C"]], nota: "La signal consegna il permesso al primo della coda."},
          {titolo: "Coda precedente", tipo: "sequenza", celle: [["Testa", "B"], ["Secondo", "C"], ["A", "già ammesso"]], nota: "L’ordine FIFO permette di risalire alla coda originaria."},
          {titolo: "Dotazione ricostruita", tipo: "sequenza", celle: [["Permesso usato", "A"], ["Liberi per B", "0"], ["Permessi iniziali", "1"]], nota: "La prima wait aveva esaurito la dotazione."},
          {titolo: "Nuova attesa", tipo: "sequenza", celle: [["Permesso consegnato", "B"], ["Coda", "C, D"], ["Liberi", "0"]], nota: "D si accoda dopo chi è ancora sospeso."}
        ]
      }
    ]
  );

  prova(5,4,6,'Conservare un evento anticipato',
    'Una signal può precedere la wait corrispondente. Il semaforo conserva un permesso libero se nessuno lo sta aspettando, oppure lo consegna a una richiesta sospesa.',
    [true,false].map(early=>v(
    'Il semaforo E parte da zero. P deve terminare la preparazione prima che C usi i dati. '+(early?'P completa il lavoro e chiama signal(E) prima che C arrivi.':'C arriva per primo e chiama wait(E) mentre P sta preparando i dati.'),
    [num('Permessi liberi dopo la prima operazione sul semaforo',early?1:0,'Osserva se la prima operazione deposita o richiede.'),scelta('C deve attendere un risveglio?',early?'no':'sì',['sì','no'],'Controlla i permessi all’istante della wait.')],
    [early?'P rende disponibile un permesso: E passa da 0 a 1.':'C trova zero permessi e si blocca. Il contatore libero resta zero.',early?'C trova il permesso già depositato e lo consuma con wait.':'P completa la preparazione e signal consegna il permesso a C, che diventa pronto.','Dopo il completamento delle due operazioni i permessi liberi sono zero. C può usare i dati dopo la preparazione di P.'])));
  prova(5, 5, 7, "Trovare il difetto del controllo separato",
    "Una prenotazione dipende dal valore osservato durante il controllo di disponibilità. Un mutex permette a un solo thread per volta di eseguire il tratto protetto, chiamato sezione critica. Serializzare significa fare avvenire le operazioni una dopo l’altra: serializzare soltanto le scritture lascia valide nei thread decisioni precedenti, che possono riferirsi allo stesso posto. Per inviare una sola conferma il controllo decisivo e la modifica della disponibilità devono avvenire durante lo stesso possesso del mutex.",
    [
      v(
        "Resta 1 posto per un seminario. 2 worker leggono tutti disponibile = 1 prima di entrare, uno per volta, sotto mutex. Ognuno scrive disponibile = 0 e invia una conferma usando il precedente esito del controllo. I singoli accessi al dato sono atomici.",
        [
          num("Conferme inviate", "2", "La decisione positiva viene memorizzata da ogni worker."),
          num("Conferme in eccesso", "1", "Confronta il numero di conferme con il posto disponibile.")
        ],
        [
          "Tutti i 2 worker osservano la disponibilità prima della prima scrittura.",
          "All’ingresso nel mutex ogni worker ha già deciso di confermare. Tutte le scritture portano in sequenza il valore a zero. Partono 2 conferme.",
          "Le conferme in eccesso sono 2 − 1 = 1. Spostando controllo e aggiornamento nella stessa sezione, il primo prenota e i successivi trovano zero."
        ]
      ),
      {
        consegna: "A e B hanno già letto lo stesso posto libero prima di prendere il mutex. Le scritture e le conferme avvengono poi sotto il mutex. Puoi modificare una sola parte del protocollo perché si possa emettere al massimo una conferma per il posto. Scegli dove ripetere la verifica di disponibilità e calcola quante richieste dovranno ricevere un rifiuto, supponendo che entrambe arrivino fino alla decisione.",
        campi: [
          scelta("Verifica decisiva", "Dentro il mutex, prima della prenotazione", ["Prima di attendere il mutex", "Dentro il mutex, prima della prenotazione", "Dopo aver inviato la conferma"], "Al momento della decisione il valore deve rimanere valido fino alla scrittura."),
          num("Richieste rifiutate", "1", "Confronta il numero dei richiedenti con i posti confermabili.")
        ],
        svolgimento: [
          "Le due letture iniziali vedono entrambe il posto libero. Anche scritture seriali potrebbero quindi inviare due conferme se riutilizzassero quell’osservazione ormai superata.",
          "Chi acquisisce il mutex deve rileggere la disponibilità mentre lo possiede e portarla a zero prima di rilasciarlo. Il primo arrivato può così prenotare e confermare.",
          "Quando il secondo entra nella stessa sezione, la nuova lettura trova zero e la sua richiesta viene rifiutata. Su due richieste si ottengono una conferma e un rifiuto."
        ],
        quadro: [
          {titolo: "Decisioni preliminari", tipo: "sequenza", celle: [["Posti", "1"], ["A legge", "libero"], ["B legge", "libero"]], nota: "Le due osservazioni precedono il mutex."},
          {titolo: "Pericolo", tipo: "sequenza", celle: [["Ordine di scrittura", "seriale"], ["Letture iniziali", "uguali"]], nota: "Una decisione vecchia può sopravvivere al cambio di stato."},
          {titolo: "Correzione", tipo: "sequenza", celle: [["Sotto mutex", "rileggi"], ["Se libero", "prenota"]], nota: "Fra la verifica e la scrittura nessun altro può prenotare."},
          {titolo: "Esito", tipo: "sequenza", celle: [["Primo", "confermato"], ["Secondo", "rifiutato"], ["Posti liberi", "0"]], nota: "Il secondo osserva lo stato prodotto dal primo."}
        ]
      }
    ]
  );

  prova(6, 1, 1, "Calcolare le disponibilità del buffer",
    "Dopo operazioni complete, il numero di elementi nel buffer cresce con ogni inserimento e cala con ogni rimozione. Gli altri slot sono a disposizione dei produttori.",
    [
      v(
        "Un buffer di capacità 6 parte vuoto. Il produttore completa 4 inserimenti, le rimozioni successive effettuate dal consumatore sono 2. Ogni operazione ha già restituito o pubblicato il permesso.",
        [
          num("Semaforo pieni al termine", "2", "Ogni inserimento completato pubblica un elemento."),
          num("Semaforo vuoti al termine", "4", "Ogni rimozione restituisce spazio.")
        ],
        [
          "All’inizio pieni = 0 e vuoti = 6.",
          "Dopo gli inserimenti pieni = 4, vuoti = 2.",
          "Dopo le rimozioni pieni diminuisce di 2 e vuoti aumenta della stessa quantità. Si ottiene pieni = 2, vuoti = 4. La somma è 6."
        ]
      ),
      {
        consegna: "Un buffer con capacità 6 contiene 4 elementi pubblicati e 2 posti liberi. Da allora sono avvenute soltanto rimozioni complete, senza prenotazioni pendenti. Il registro finale riporta 3 permessi su pieni e 4 su vuoti. Individua l’incoerenza e, sapendo che il conteggio di pieni è affidabile, correggi il registro e ricostruisci le rimozioni.",
        campi: [
          num("Valore corretto di vuoti", "3", "A operazioni concluse, ogni posto compare in uno solo dei due conteggi."),
          num("Rimozioni completate", "1", "Ricava la variazione del numero di elementi pubblicati, dato che nessun produttore è intervenuto.")
        ],
        svolgimento: [
          "La coppia registrata darebbe 3 + 4 = 7, impossibile per sei posti quando tutte le operazioni sono concluse.",
          "Se pieni vale 3, i posti disponibili sono 6 − 3 = 3. La cifra da correggere è dunque il 4 scritto per vuoti.",
          "Gli elementi pubblicati sono scesi da 4 a 3 e l’unica operazione ammessa era una rimozione. Ne è avvenuta una, che ha portato vuoti da 2 a 3."
        ],
        quadro: [
          {titolo: "Registro da verificare", tipo: "stato", celle: [["Capacità", "6"], ["Pieni finali", "3"], ["Vuoti registrati", "4"]], nota: "La misura dei pieni è affidabile."},
          {titolo: "Controllo di capacità", tipo: "stato", celle: [["Somma registrata", "7"], ["Capacità reale", "6"]], nota: "Tutte le operazioni sono concluse."},
          {titolo: "Valore compatibile", tipo: "stato", celle: [["Pieni", "3"], ["Vuoti", "3"]], nota: "La somma torna alla capacità."},
          {titolo: "Operazione ricostruita", tipo: "stato", celle: [["Prima", "4 pieni"], ["Dopo", "3 pieni"], ["Rimozioni", "1"]], nota: "Il consumatore ha liberato un solo posto."}
        ]
      }
    ]
  );

  prova(6, 2, 2, "Ordinare le operazioni sul buffer",
    "Il buffer è una zona con posti limitati per i dati scambiati fra produttore e consumatore. I semafori vuoti e pieni contano rispettivamente permessi di spazio e di lettura. Wait acquisisce il permesso richiesto o sospende il richiedente; signal mette a disposizione il permesso dell’operazione conclusa. Lock(M) acquisisce il mutex M, che riserva a un solo thread la modifica della cella e degli indici; unlock(M) lo rilascia. Il produttore percorre vuoti → inserimento → pieni, mentre il consumatore percorre pieni → prelievo → vuoti, nell’ordine precisato dal contratto della traccia.",
    [
      v(
        "Il buffer usa i semafori vuoti e pieni e un mutex M. Un produttore deve inserire un elemento. Si richiede che nessun thread attenda la disponibilità del dato o dello spazio mentre possiede M.",
        [
          scelta("Su quale semaforo viene eseguita la prima wait?", "vuoti", ["vuoti", "pieni"], "Prima di entrare nella sezione protetta occorre riservare spazio oppure un elemento?"),
          scelta("Quale permesso segnala il completamento?", "pieni", ["vuoti", "pieni"], "Quale risorsa diventa disponibile all’altro ruolo?")
        ],
        [
          "Il produttore esegue wait(vuoti) per riservare una cella.",
          "Sotto M scrive il dato e avanza l’indice di ingresso. Poi rilascia M.",
          "signal(pieni) permette a un consumatore di leggere la nuova cella."
        ]
      ),
      {
        consegna: "Il buffer contiene un elemento pubblicato e usa un mutex M per la cella e l’indice di uscita. Ricostruisci il prelievo di un consumatore. Deve poter aspettare un elemento lasciando M disponibile al produttore. Il contratto impone inoltre di liberare M appena conclusa la modifica dell’indice e di pubblicare il posto libero solo dopo il rilascio di M. Stabilisci anche quale thread potrà approfittare della pubblicazione.",
        campi: [
          ordine("Ordine delle operazioni", ["wait(pieni)", "lock(M)", "preleva e aggiorna l’indice", "unlock(M)", "signal(vuoti)"], "Segui il permesso dall’elemento pubblicato al posto libero. Il dato e l’indice si toccano sotto M."),
          scelta("Beneficiario di un nuovo posto libero", "Un produttore", ["Un produttore", "Un altro consumatore", "Il dispatcher"], "Segui la risorsa rappresentata dal semaforo vuoti.")
        ],
        svolgimento: [
          "Il consumatore comincia con wait(pieni), che gli riserva un elemento già pubblicato. In questo modo un’eventuale attesa avviene prima dell’acquisizione del mutex.",
          "Con lock(M) acquisisce l’esclusiva, preleva dalla cella e aggiorna l’indice di uscita. unlock(M) chiude la sezione, rendendo il mutex disponibile agli altri partecipanti.",
          "Il contratto colloca signal(vuoti) dopo il rilascio del mutex. Questa signal annuncia un posto libero, che può essere riservato da un produttore."
        ],
        quadro: [
          {titolo: "Un elemento disponibile", tipo: "sequenza", celle: [["Pieni", "1"], ["Mutex", "libero"]], nota: "Il contratto richiede di pubblicare lo spazio dopo il rilascio."},
          {titolo: "Prenotazione", tipo: "sequenza", celle: [["Primo passo", "wait(pieni)"], ["Permesso", "elemento"]], nota: "L’eventuale attesa avviene all’esterno della sezione protetta."},
          {titolo: "Sezione protetta", tipo: "sequenza", celle: [["Ingresso", "lock(M)"], ["Lavoro", "prelievo e indice"], ["Uscita", "unlock(M)"]], nota: "Solo chi possiede il mutex accede a cella e indice."},
          {titolo: "Restituzione", tipo: "sequenza", celle: [["Ultimo passo", "signal(vuoti)"], ["Beneficiario", "produttore"]], nota: "Il posto torna al gruppo degli spazi prenotabili."}
        ]
      }
    ]
  );

  prova(6, 3, 1, "Contabilizzare una prenotazione in corso",
    "Una prenotazione acquisisce un permesso di spazio prima della pubblicazione del dato. In quell’intervallo il posto riservato appartiene al produttore e va contato a parte.",
    [
      v(
        "Un buffer di capacità 5 contiene 2 elementi pubblicati. I produttori in attesa di scrivere sono 1. Ciascuno ha completato wait(vuoti) e deve ancora eseguire signal(pieni). Ogni altra operazione è completa.",
        [
          num("Permessi vuoti liberi", "2", "Separa celle pubblicate e prenotazioni."),
          num("Valore di vuoti + pieni", "4", "I produttori possiedono permessi in transito.")
        ],
        [
          "Prima delle prenotazioni vuoti = 5 − 2 = 3 e pieni = 2.",
          "Le prenotazioni riducono vuoti di 1 e lo portano a 2. Il numero di elementi pubblicati resta 2.",
          "La somma dei semafori è 2 + 2 = 4. Aggiungendo la quantità riservata (1) si ritrova la capacità 5."
        ]
      ),
      {
        consegna: "Un buffer ha capacità 8. Nell’istantanea si leggono vuoti = 3 e pieni = 3. Solo i produttori possono avere una prenotazione in corso; ciascuno di quelli coinvolti possiede un unico permesso di spazio e deve ancora eseguire signal(pieni). Quanti produttori hanno una prenotazione? Quando uno di essi pubblica il dato, stabilisci quale contatore cambia.",
        campi: [
          num("Produttori con una prenotazione", "2", "Sottrai dalla capacità i permessi ancora visibili nei due semafori."),
          scelta("Stato dopo una pubblicazione", "vuoti 3, pieni 4", ["vuoti 2, pieni 4", "vuoti 3, pieni 4", "vuoti 4, pieni 3"], "Il produttore ha già compiuto la wait. Individua quale signal resta da eseguire.")
        ],
        svolgimento: [
          "I semafori contabilizzano 3 + 3 = 6 posti. Per ricostruire la capacità 8 mancano 2 posti, già assegnati a produttori.",
          "Ciascun produttore possiede un permesso, perciò i due posti mancanti appartengono a due produttori. L’istantanea da sola lascia aperto se essi abbiano già scritto fisicamente i dati.",
          "Una signal(pieni) pubblica un posto già prenotato. Pieni sale a 4, vuoti resta a 3 e rimane una prenotazione. La verifica è 4 + 3 + 1 = 8."
        ],
        quadro: [
          {titolo: "Istantanea", tipo: "stato", celle: [["Capacità", "8"], ["Vuoti", "3"], ["Pieni", "3"]], nota: "Le prenotazioni riguardano soltanto produttori."},
          {titolo: "Posti da attribuire", tipo: "stato", celle: [["Visibili", "6"], ["Capacità", "8"], ["Differenza", "2"]], nota: "Lo scarto indica quanti permessi sono in transito."},
          {titolo: "Durante la scrittura", tipo: "stato", celle: [["Prenotazioni", "2"], ["Permesso per produttore", "1"], ["Produttori", "2"]], nota: "Ogni produttore ha già sottratto il proprio posto ai vuoti."},
          {titolo: "Una pubblicazione", tipo: "stato", celle: [["Vuoti", "3"], ["Pieni", "4"], ["In transito", "1"]], nota: "La somma dei tre conteggi vale ancora otto."}
        ]
      }
    ]
  );

  prova(6,4,4,'Ammettere un lettore dietro uno scrittore',
    'Un lettore è un thread che consulta dati condivisi; uno scrittore li modifica. Più lettori possono usare contemporaneamente la risorsa, mentre la scrittura richiede un intervallo esclusivo. In presenza di uno scrittore in attesa, la politica determina se il lettore successivo possa unirsi al gruppo attivo oppure debba accodarsi. FIFO significa first in, first out e mantiene l’ordine di arrivo: il nuovo lettore si pone dietro lo scrittore già in coda.',
    [true,false].map(fair=>v(
    'L1 è in lettura. Lo scrittore S si mette in coda, poi arriva L2. '+(fair?'L’ammissione usa una coda FIFO senza sorpassi.':'La politica consente ai nuovi lettori di unirsi a un gruppo già attivo anche con uno scrittore in attesa.')+' L1 esce per primo. Se L2 è stato ammesso, la sua lettura è ancora in corso in quell’istante.',
    [num('Lettori ammessi dopo l’arrivo di L2',fair?1:2,'Individua chi può unirsi a L1.'),scelta('A chi spetta l’accesso subito dopo l’uscita di L1?',fair?'S':'L2 continua',['S','L2 continua'],'Controlla il numero dei lettori rimasti attivi.')],
    ['S richiede accesso esclusivo e deve attendere almeno l’uscita di L1.',fair?'L2 si accoda dietro S, dunque soltanto L1 legge.':'L2 si unisce a L1 portando i lettori attivi a due.',fair?'Quando L1 esce, la risorsa è libera e il primo in coda è S. L2 attende.':'Dopo l’uscita di L1 resta L2 in lettura. S attende l’uscita dell’ultimo lettore.'])));
  prova(6, 5, 4, "Riconoscere l’ultimo lettore",
    "Nel protocollo del primo e dell’ultimo lettore un gruppo di lettori condivide il permesso sulla risorsa. Il mutex protegge il contatore con cui si riconosce l’uscita dell’ultimo componente.",
    [
      v(
        "Ci sono 2 lettori attivi e uno scrittore sospeso sul semaforo della risorsa. Nel protocollo primo/ultimo lettore, ogni uscita decrementa il contatore sotto mutex e l’ultimo lettore segnala la risorsa. Il gruppo iniziale resta chiuso a nuovi arrivi.",
        [
          num("Uscite dopo le quali lo scrittore può diventare pronto", "2", "Serve il passaggio da uno a zero."),
          num("Segnalazioni della risorsa prodotte dalle uscite", "1", "Il gruppo possiede un unico permesso collettivo.")
        ],
        [
          "All’inizio il gruppo di 2 lettori controlla la risorsa. Il mutex del contatore protegge ciascun decremento.",
          "Quando le uscite raggiungono quota 1, resta un lettore e lo scrittore continua ad attendere.",
          "L’uscita numero 2 porta il contatore a zero. Scatta una sola signal della risorsa, che rende pronto lo scrittore."
        ]
      ),
      {
        consegna: "Tre lettori condividono un unico permesso sulla risorsa. Uno scrittore è sospeso. Per un errore, la procedura di uscita esegue signal(risorsa) dopo ogni decremento, anche quando restano altri lettori. Alla prima uscita il permesso viene consegnato allo scrittore, che viene subito eseguito. Individua la violazione e la condizione che deve precedere la signal corretta.",
        campi: [
          num("Lettori ancora attivi quando entra lo scrittore", "2", "Dal gruppo iniziale sottrai la sola uscita già completata."),
          scelta("Condizione per la signal corretta", "Contatore uguale a zero dopo il decremento", ["Contatore uguale a zero dopo il decremento", "Contatore maggiore di zero dopo il decremento", "Presenza di almeno uno scrittore sospeso"], "La risorsa deve restare riservata al gruppo finché un lettore la usa.")
        ],
        svolgimento: [
          "Dopo l’uscita di un lettore il contatore passa da 3 a 2. I due lettori rimasti occupano ancora la risorsa.",
          "La signal prematura libera il permesso collettivo e consente allo scrittore di entrare durante due letture ancora in corso. Viene così violata l’esclusività della scrittura.",
          "Il decremento e la verifica vanno eseguiti sotto il mutex del contatore. Soltanto il lettore che osserva zero dopo il proprio decremento esegue la signal sulla risorsa."
        ],
        quadro: [
          {titolo: "Gruppo attivo", tipo: "stato", celle: [["Lettori", "3"], ["Scrittore", "sospeso"]], nota: "La risorsa ha un solo permesso collettivo."},
          {titolo: "Prima uscita", tipo: "stato", celle: [["Lettori prima", "3"], ["Lettori dopo", "2"]], nota: "Il gruppo usa ancora la risorsa."},
          {titolo: "Effetto del difetto", tipo: "stato", celle: [["Lettori", "2"], ["Scrittore", "in esecuzione"]], nota: "La lettura si sovrappone a una scrittura."},
          {titolo: "Predicato corretto", tipo: "stato", celle: [["Protezione", "mutex contatore"], ["Rilascio", "al valore zero"]], nota: "Solo l’ultima uscita restituisce il permesso collettivo."}
        ]
      }
    ]
  );

  const diagnoses=['starvation','livelock','deadlock','attesa temporanea'];
  prova(7,1,5,'Riconoscere il progresso nelle tracce',
    'Il progresso si valuta contando le operazioni concluse e identificando chi le conclude. Un lock riserva una risorsa al proprio possessore; una transazione riunisce modifiche da completare come un unico lavoro. Nel deadlock i partecipanti restano bloccati su risorse trattenute l’uno dall’altro. Nel livelock continuano a compiere azioni che ricreano la stessa situazione senza completare il lavoro. Nella starvation il sistema conclude altre richieste mentre una particolare richiesta resta esclusa indefinitamente. L’ipotesi di ripetizione senza termine permette di distinguere queste condizioni da un’attesa temporanea.',
    [
    v('Una traccia periodica si ripete indefinitamente. A e B prendono ciascuno un lock, osservano la contesa, rilasciano il lock per cortesia e riprovano insieme. Il conteggio delle transazioni completate resta a zero.',[scelta('Diagnosi','livelock',diagnoses,'Osserva se i partecipanti eseguono ancora azioni.')],
      ['A e B cambiano stato a ogni tentativo, quindi il sistema continua a eseguire passi.','Alla fine del periodo nessun lavoro è concluso e ricompare lo stesso punto di partenza.','La ripetizione indefinita di azioni senza risultato identifica il livelock.']),
    v('Uno scrittore resta in coda. Ogni volta che un lettore sta per uscire ne entra un altro. La sequenza si ripete indefinitamente e ogni lettore termina.',[scelta('Diagnosi','starvation',diagnoses,'Distingui il progresso globale dal progresso dello scrittore.')],
      ['I lettori completano richieste, quindi il sistema produce risultati.','Lo scrittore attende che il gruppo attivo si svuoti. La successione degli arrivi mantiene sempre almeno un lettore.','È la singola richiesta dello scrittore a subire esclusione indefinita: starvation.'])]);
  const conditions=['esclusione mutua','possesso durante l’attesa','assenza di prelazione','attesa circolare'];
  prova(7,2,2,'Collegare una politica a Coffman',
    'Le condizioni di Coffman descrivono caratteristiche congiuntamente necessarie al deadlock fra risorse riutilizzabili. L’esclusione mutua riserva ciascuna risorsa a un solo possessore; il possesso durante l’attesa permette di trattenere risorse mentre se ne chiedono altre. L’assenza di prelazione lascia al possessore il compito di rilasciarle. L’attesa circolare chiude una catena in cui ciascuno aspetta una risorsa del successivo. Una regola che esclude una di queste condizioni previene lo stallo: per identificarla si seguono i beni detenuti durante l’attesa o l’ordine delle richieste.',
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
  prova(7, 4, 2, "Controllare un’acquisizione per rango",
    "Il rango è un numero assegnato a una risorsa per fissare un ordine comune di acquisizione. Il protocollo crescente ammette una nuova richiesta soltanto quando il rango richiesto supera tutti quelli già detenuti. Se una routine, una porzione del programma, conserva P mentre chiede Q, deve quindi valere rango(P) < rango(Q). Le acquisizioni annidate si traducono in disuguaglianze che devono restare coerenti nell’intero programma. Il controllo dell’ordine precede quello della disponibilità immediata del lock, il vincolo che riserva la risorsa.",
    [
      v(
        "Un thread detiene due risorse di rango 2 e 5. Il protocollo impone acquisizioni strettamente crescenti. Il thread chiede una risorsa di rango 3.",
        [
          num("Rango massimo già detenuto", "5", "Confronta tutti i lock posseduti."),
          scelta("Richiesta ammessa dal protocollo?", "no", ["sì", "no"], "Il nuovo rango deve superare il massimo detenuto.")
        ],
        [
          "Il massimo fra i ranghi detenuti è 5.",
          "Il confronto richiesto è 3 > 5: la proposizione è falsa.",
          "Il protocollo rifiuta l’ordine richiesto. Per includere questa risorsa il thread deve riorganizzare le acquisizioni secondo il rango."
        ]
      ),
      {
        consegna: "I percorsi del programma contengono queste acquisizioni annidate: la prima routine acquisisce P e poi Q, la seconda acquisisce Q e poi R. I lock conservano il possesso del primo fino all’acquisizione del secondo. Si vogliono assegnare ranghi distinti da 1 a 3, con richieste a rango crescente. Ricostruisci l’ordine crescente dei lock e valuta la richiesta aggiuntiva di P mentre si detiene R.",
        campi: [
          ordine("Ordine crescente dei lock", ["P", "Q", "R"], "Traduci le due acquisizioni in due disuguaglianze fra tre ranghi distinti, poi uniscile."),
          scelta("Richiesta di P possedendo R", "Da riordinare", ["Ammessa sempre", "Ammessa se P è libero", "Da riordinare"], "Chiudere il percorso da R a P sarebbe coerente con le due disuguaglianze?")
        ],
        svolgimento: [
          "La prima routine richiede rango(P) < rango(Q). La seconda impone rango(Q) < rango(R).",
          "I tre ranghi disponibili sono 1, 2 e 3. L’unico ordinamento compatibile assegna 1 a P, 2 a Q e 3 a R.",
          "Una richiesta di P mentre si possiede R imporrebbe 3 < 1. La routine va riordinata, per esempio acquisendo P prima di R. Il vincolo sull’ordine si applica anche quando P è libero."
        ],
        quadro: [
          {titolo: "Due routine", tipo: "sequenza", celle: [["Prima", "P poi Q"], ["Seconda", "Q poi R"], ["Ranghi", "1, 2, 3"]], nota: "Il primo lock resta posseduto durante la richiesta del secondo."},
          {titolo: "Vincoli", tipo: "sequenza", celle: [["Prima", "P < Q"], ["Seconda", "Q < R"]], nota: "Ogni acquisizione deve salire di rango."},
          {titolo: "Ordine ammissibile", tipo: "sequenza", celle: [["P", "1"], ["Q", "2"], ["R", "3"]], nota: "Il rango intermedio spetta a Q."},
          {titolo: "Richiesta aggiuntiva", tipo: "sequenza", celle: [["Posseduto", "R, rango 3"], ["Richiesto", "P, rango 1"], ["Esito", "da riordinare"]], nota: "La richiesta retrocederebbe lungo l’ordine."}
        ]
      }
    ]
  );

  prova(7, 5, 3, "Verificare una sequenza sicura",
    "Nel test del banchiere il bisogno residuo di un processo è la differenza fra massimo dichiarato e assegnazione corrente. Un completamento ipotetico restituisce le sue istanze e può rendere possibile il turno successivo.",
    [
      v(
        "Un solo tipo di risorsa. A possiede 2 istanze e dichiara massimo 5. B ne possiede 2 e dichiara massimo 3. C ne possiede 1 e dichiara massimo 4. Inizialmente è libera 1 istanza. Si esamina la sicurezza rispetto ai massimi dichiarati.",
        [
          num("Bisogno residuo di B", "1", "Sottrai l’assegnato dal massimo di B."),
          scelta("Esito del test", "sicuro", ["sicuro", "insicuro"], "Cerca un processo che possa ultimare con il disponibile e restituire quanto possiede.")
        ],
        [
          "I bisogni residui sono A: 5 − 2 = 3, B: 3 − 2 = 1, C: 4 − 1 = 3.",
          "Con 1 istanza libera B può completare. Restituendo le sue 2 iniziali porta il disponibile a 3.",
          "A può ora completare e portare il disponibile a 5. Segue C, che lo porta a 6. B → A → C è una sequenza sicura."
        ]
      ),
      {
        consegna: "A possiede 2 istanze e ne ha dichiarate al massimo 5, B ne possiede 2 su 3 e C ne possiede 1 su 4. Al momento sono libere 2 istanze e tutte le quantità si riferiscono a un solo tipo di risorsa. A chiede subito entrambe le istanze libere. Applica prima un’assegnazione di prova, poi decidi se il banchiere può concedere la richiesta mantenendo la sicurezza.",
        campi: [
          num("Bisogno residuo di A dopo l’assegnazione ipotetica", "1", "Aggiungi le due istanze al possesso attuale di A prima di sottrarre dal massimo."),
          scelta("Decisione del banchiere", "Rinviare la richiesta", ["Concedere la richiesta", "Rinviare la richiesta"], "Con il disponibile residuo cerca almeno un processo che possa completare fino al massimo.")
        ],
        svolgimento: [
          "La richiesta di due istanze rientra sia nel bisogno attuale di A, che è 5 − 2 = 3, sia nelle due disponibilità. Si può quindi esaminare l’assegnazione ipotetica.",
          "Dopo l’assegnazione A avrebbe 4 istanze su 5 e ne richiederebbe ancora 1. Resterebbero zero istanze libere. Anche B avrebbe bisogno di 1 istanza e C di 3.",
          "Con disponibilità zero nessuno dei tre potrebbe garantire il completamento fino al massimo dichiarato. Lo stato ipotetico è insicuro e il banchiere rinvia la richiesta. Prima dell’assegnazione B poteva completare con una delle due istanze libere, lasciando poi agli altri una via di completamento."
        ],
        quadro: [
          {titolo: "Richiesta di A", tipo: "stato", celle: [["A possiede", "2"], ["A massimo", "5"], ["Chiede", "2"], ["Liberi", "2"]], nota: "Il banchiere considera anche le dichiarazioni di B e C."},
          {titolo: "Ammissibilità", tipo: "stato", celle: [["Bisogno iniziale A", "3"], ["Richiesta", "2"], ["Disponibili", "2"]], nota: "I due vincoli locali consentono il tentativo di assegnazione."},
          {titolo: "Stato ipotetico", tipo: "stato", celle: [["Liberi", "0"], ["Bisogno A", "1"], ["Bisogno B", "1"], ["Bisogno C", "3"]], nota: "Tutti i bisogni sono positivi."},
          {titolo: "Decisione", tipo: "stato", celle: [["Primo completamento", "nessuno"], ["Richiesta", "rinviata"]], nota: "Il test cerca una sequenza capace di soddisfare tutti i massimi."}
        ]
      }
    ]
  );

  // Questi listati sono dati della consegna, consultabili prima della verifica.
  for (const v of SL.prove['5.2'][4].varianti) v.listato = v.codice;
}());
