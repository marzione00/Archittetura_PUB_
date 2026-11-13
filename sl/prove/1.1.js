'use strict';
/* Prova del capitolo 1.1: una domanda per unità. Ogni generatore riceve una sorgente di numeri
   ripetibili e restituisce una domanda nello stesso formato degli esercizi delle unità. */
(() => {
  const I = SL.scritture.intero;
  const ORDINALE = { 3: 'terza', 4: 'quarta', 5: 'quinta', 6: 'sesta', 7: 'settima', 8: 'ottava' };

  SL.registraProva('1.1', { domande: [
    // 1.1.1 · i codici consegnati da puts
    (r) => {
      const testo = r.scegli(['Ciao', 'Salve', 'Grazie', 'Benvenuti', 'Arrivederci', 'A presto', 'Buona sera', 'Tutto bene']);
      const n = testo.length, spazio = testo.includes(' ');
      return { u: '1.1.1', d: 'Un programma chiama puts con il testo «' + testo + '». Quanti codici vengono consegnati al sistema operativo?', segnaposto: 'Un numero', giuste: I(n + 1),
        ok: 'Il testo ha ' + n + ' caratteri' + (spazio ? ', spazio compreso,' : '') + ' e puts aggiunge in coda il codice di fine riga: ' + n + ' + 1 = ' + (n + 1) + '.',
        diagnosi: [
          { se: I(n), msg: 'Hai contato i caratteri del testo. La funzione puts aggiunge in coda il codice di fine riga.' },
          { se: spazio ? I(n - 1) : [], msg: 'Anche lo spazio è un carattere, con il proprio codice.' },
          { se: I(n + 2), msg: 'Il fine riga è un solo codice.' }
        ],
        altro: 'Il numero è diverso. Conta un codice per ogni carattere e aggiungi quello di fine riga.',
        indizi: ['Ogni carattere del testo diventa un codice.', 'Il testo ha ' + n + ' caratteri' + (spazio ? ', spazio compreso.' : '.'), 'In coda puts aggiunge il codice di fine riga.'],
        svolgimento: ['Caratteri del testo: ' + n + '.', 'Codice di fine riga: 1.', 'Totale: ' + n + ' + 1 = ' + (n + 1) + ' codici.'] };
    },
    // 1.1.2 · base più spostamento
    (r) => {
      const base = 100 * r.int(10, 90), k = r.int(3, 8), giusto = base + k - 1;
      return { u: '1.1.2', d: 'Una parola comincia all’indirizzo ' + base + '. A quale indirizzo si trova la sua ' + ORDINALE[k] + ' lettera?', segnaposto: 'Un indirizzo', giuste: I(giusto),
        ok: 'La prima lettera ha spostamento 0, quindi la ' + ORDINALE[k] + ' ha spostamento ' + (k - 1) + ': ' + base + ' + ' + (k - 1) + ' = ' + giusto + '.',
        diagnosi: [
          { se: I(base + k), msg: 'La prima lettera si trova all’indirizzo ' + base + ', con spostamento 0. La ' + ORDINALE[k] + ' ha quindi spostamento ' + (k - 1) + '.' },
          { se: I(k - 1), msg: 'Questo è lo spostamento. L’indirizzo si ottiene sommandolo alla base.' },
          { se: I(base), msg: 'Questo è l’indirizzo della prima lettera.' }
        ],
        altro: 'L’indirizzo è diverso. Somma alla base lo spostamento della lettera, contando da zero.',
        indizi: ['L’indirizzo di un dato vicino è la base più il suo spostamento.', 'La prima lettera ha spostamento 0, la seconda 1.', 'La ' + ORDINALE[k] + ' lettera ha spostamento ' + (k - 1) + '.'],
        svolgimento: ['Base: ' + base + '.', 'Spostamento della ' + ORDINALE[k] + ' lettera: ' + (k - 1) + '.', 'Indirizzo: ' + base + ' + ' + (k - 1) + ' = ' + giusto + '.'] };
    },
    // 1.1.3 · le tappe dal sorgente all'eseguibile
    (r) => r.scegli([
      { u: '1.1.3', d: 'Quale file della catena contiene già codice macchina e ha ancora dei punti in sospeso da collegare?', o: [
        { t: 'Il file oggetto', ok: true, fb: 'Il file oggetto nasce nella terza tappa. Le chiamate alle funzioni di libreria vi compaiono come promemoria, che il linker scioglierà.' },
        { t: 'Il sorgente', fb: 'Il sorgente è testo scritto da una persona, prima di qualunque traduzione.' },
        { t: 'Il file eseguibile', fb: 'Nel file eseguibile i punti in sospeso sono già stati chiusi dal linker.' },
        { t: 'Il file in linguaggio assembly', fb: 'Il linguaggio assembly è ancora testo, con le istruzioni scritte per nome.' }] },
      { u: '1.1.3', d: 'In quale tappa ogni chiamata a una funzione di libreria viene collegata alle istruzioni che la realizzano?', o: [
        { t: 'Nella quarta, svolta dal linker', ok: true, fb: 'Il linker mette insieme il file oggetto e la libreria, e produce il file eseguibile.' },
        { t: 'Nella seconda, svolta dal compilatore', fb: 'Il compilatore traduce il sorgente in linguaggio assembly e lascia le chiamate in sospeso.' },
        { t: 'Nella prima, che prepara il testo', fb: 'La preparazione raccoglie le descrizioni delle funzioni. Le loro istruzioni restano nella libreria.' },
        { t: 'Nella terza, che produce il codice macchina', fb: 'La terza tappa produce il file oggetto, dove le chiamate sono ancora promemoria.' }] },
      { u: '1.1.3', d: 'Il compilatore riceve il sorgente già preparato. Che cosa produce?', o: [
        { t: 'Un file in linguaggio assembly', ok: true, fb: 'Il compilatore trasforma il testo in istruzioni per quel processore, ancora scritte con nomi leggibili.' },
        { t: 'Un file oggetto', fb: 'Il file oggetto nasce nella tappa successiva, quando ogni istruzione diventa un numero.' },
        { t: 'Un file eseguibile', fb: 'Per arrivare al file eseguibile servono ancora la conversione in codice macchina e il collegamento.' },
        { t: 'Un sorgente completo', fb: 'Il sorgente completo esce dalla prima tappa, ed è quello che il compilatore riceve.' }] },
      { u: '1.1.3', d: 'In un sorgente manca una parentesi. Quale programma della catena scopre l’errore?', o: [
        { t: 'Il compilatore', ok: true, fb: 'Il compilatore deve capire il testo per tradurlo, e una parentesi mancante glielo impedisce.' },
        { t: 'Il linker', fb: 'Il linker lavora sui file oggetto. Con una parentesi mancante la catena si ferma prima di produrne uno.' },
        { t: 'Il sistema operativo, all’avvio', fb: 'Il sistema operativo avvia soltanto file eseguibili, e qui la catena si ferma molto prima.' }] }
    ]),
    // 1.1.4 · percorsi relativi
    (r) => {
      const [a, b, c] = r.mescola(['ada', 'bruno', 'carla', 'dario', 'elena']);
      const dir = r.scegli(['dati', 'testi', 'prove']), file = r.scegli(['note.txt', 'voti.txt', 'hello', 'elenco.txt']);
      const forma = r.int(0, 2), qui = '/home/' + a + '/' + dir;
      const F = [
        { rel: '../' + file, giusto: '/home/' + a + '/' + file, errati: [[qui + '/' + file, 'I due punti fanno salire di un gradino prima di cercare il file.'], ['/home/' + file, 'I due punti compaiono una volta sola, quindi si sale di un solo gradino.']], passi: ['Punto di partenza: ' + qui + '.', 'I due punti fanno salire in /home/' + a + '.', 'Lì si cerca ' + file + ': /home/' + a + '/' + file + '.'] },
        { rel: '../../' + b + '/' + file, giusto: '/home/' + b + '/' + file, errati: [['/home/' + a + '/' + b + '/' + file, 'I due punti compaiono due volte, quindi si sale di due gradini.'], ['/' + b + '/' + file, 'Da ' + qui + ' due gradini portano in /home. La radice è un gradino più su.'], [qui + '/' + b + '/' + file, 'Ogni coppia di punti fa salire di un gradino prima di scendere.']], passi: ['Punto di partenza: ' + qui + '.', 'I primi due punti fanno salire in /home/' + a + ', i secondi in /home.', 'Da lì si scende in ' + b + ' e si trova ' + file + ': /home/' + b + '/' + file + '.'] },
        { rel: '../' + c + '/' + file, giusto: '/home/' + a + '/' + c + '/' + file, errati: [['/home/' + c + '/' + file, 'I due punti compaiono una volta sola: da ' + qui + ' si sale in /home/' + a + '.'], [qui + '/' + c + '/' + file, 'I due punti fanno salire di un gradino prima di scendere in ' + c + '.']], passi: ['Punto di partenza: ' + qui + '.', 'I due punti fanno salire in /home/' + a + '.', 'Da lì si scende in ' + c + ' e si trova ' + file + ': /home/' + a + '/' + c + '/' + file + '.'] }
      ][forma];
      return { u: '1.1.4', d: 'Ti trovi in ' + qui + '. Quale percorso assoluto indica `' + F.rel + '`?', segnaposto: 'Un percorso che comincia con /', giuste: [F.giusto],
        ok: F.passi.join(' '),
        diagnosi: F.errati.map((e) => ({ se: [e[0]], msg: e[1] })).concat([{ se: [F.giusto.slice(1)], msg: 'I nomi sono giusti. Un percorso assoluto comincia con la barra della radice.' }]),
        altro: 'Il percorso è diverso. Parti dalla directory corrente e segui un nome alla volta.',
        indizi: ['Il percorso è relativo, quindi parte da ' + qui + '.', 'Ogni coppia di punti fa salire di un gradino.', 'Dopo essere salito, segui i nomi che restano scendendo.'],
        svolgimento: F.passi };
    },
    // 1.1.5 · processi e PID
    (r) => {
      const shell = r.int(1000, 4000), figlio = shell + r.int(3, 40), prog = r.scegli(['hello', 'saluta', 'conta', 'elenca']), chiede = r.int(0, 1);
      if (chiede === 0) return { u: '1.1.5', d: 'Una shell con PID ' + shell + ' crea un figlio con PID ' + figlio + ', che poi sostituisce il proprio programma con ' + prog + '. Quando ' + prog + ' termina, a quale PID viene recapitato il codice di uscita?', segnaposto: 'Un PID', giuste: I(shell),
        ok: 'Il codice di uscita viene recapitato al padre in attesa, cioè alla shell con PID ' + shell + '.',
        diagnosi: [{ se: I(figlio), msg: 'Questo è il PID del processo che termina. Il codice di uscita va a chi lo aveva creato e lo sta aspettando.' }],
        altro: 'Il PID è diverso. Il codice di uscita viene consegnato al sistema operativo, che lo recapita al padre.',
        indizi: ['Il processo che termina è il figlio.', 'Il sistema operativo recapita il codice di uscita al padre in attesa.', 'Il padre è la shell.'],
        svolgimento: ['Il programma ' + prog + ' gira nel processo figlio, con PID ' + figlio + '.', 'Alla fine consegna il codice di uscita al sistema operativo.', 'Il sistema operativo lo recapita al padre, la shell con PID ' + shell + '.'] };
      return { u: '1.1.5', d: 'Una shell con PID ' + shell + ' crea un figlio, che riceve il PID ' + figlio + ' e poi sostituisce il proprio programma con ' + prog + '. Con quale PID gira ' + prog + '?', segnaposto: 'Un PID', giuste: I(figlio),
        ok: 'La sostituzione cambia il programma e lascia invariato il PID: ' + prog + ' gira con il PID ' + figlio + '.',
        diagnosi: [{ se: I(shell), msg: 'Questo è il PID della shell, che continua a esistere e aspetta. Il programma nuovo gira nel processo figlio.' }, { se: I(figlio + 1), msg: 'La sostituzione avviene dentro il processo figlio, senza crearne un altro.' }],
        altro: 'Il PID è diverso. Chiediti in quale processo avviene la sostituzione del programma.',
        indizi: ['La shell resta in esecuzione con il proprio PID.', 'La sostituzione avviene nel processo figlio.', 'La sostituzione cambia il programma e lascia invariato il PID.'],
        svolgimento: ['Creazione: nasce il figlio, con PID ' + figlio + '.', 'Sostituzione: il figlio carica ' + prog + ' al posto del proprio programma.', 'Il processo è lo stesso, quindi ' + prog + ' gira con il PID ' + figlio + '.'] };
    },
    // 1.1.6 · redirezione con > e >>
    (r) => {
      const n = r.int(1, 5), seq = r.scegli([['>>', '>', '>>'], ['>', '>>', '>>'], ['>>', '>>', '>'], ['>', '>', '>>'], ['>>', '>', '>']]);
      let righe = n; const passi = ['All’inizio il file contiene ' + n + (n === 1 ? ' riga.' : ' righe.')];
      seq.forEach((s) => { righe = s === '>' ? 1 : righe + 1; passi.push('Dopo `./hello ' + s + ' esito`: ' + (s === '>' ? 'il file viene svuotato e riceve una riga, quindi ne contiene 1.' : 'la riga si aggiunge in fondo, e il file ne contiene ' + righe + '.')); });
      return { u: '1.1.6', d: 'Il file esito contiene ' + n + (n === 1 ? ' riga' : ' righe') + '. Esegui, in quest’ordine, i comandi `./hello ' + seq[0] + ' esito`, `./hello ' + seq[1] + ' esito` e `./hello ' + seq[2] + ' esito`. Quante righe contiene il file alla fine?', segnaposto: 'Un numero di righe', giuste: I(righe),
        ok: 'L’ultimo comando con il segno > svuota il file e vi scrive una riga. Ogni comando successivo con >> ne aggiunge una. Alla fine le righe sono ' + righe + '.',
        diagnosi: [
          { se: I(n + 3), msg: 'Hai aggiunto una riga per ogni comando. Il segno > svuota il file prima di scrivere.' },
          { se: I(3), msg: 'Tre sono le righe scritte in tutto. Quelle scritte prima dell’ultimo > vengono cancellate.' },
          { se: I(n + seq.filter((s) => s === '>>').length), msg: 'Hai contato le aggiunte a partire dal contenuto iniziale. Dopo un > il contenuto precedente sparisce.' }
        ],
        altro: 'Il numero è diverso. Segui i tre comandi uno alla volta, annotando le righe dopo ciascuno.',
        indizi: ['Con > il file viene svuotato e poi riceve una riga.', 'Con >> la riga si aggiunge in fondo a quelle presenti.', 'Conta soltanto quello che accade dall’ultimo > in avanti.'],
        svolgimento: passi };
    }
  ] });
})();
