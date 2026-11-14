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
      return { u: '1.1.1', d: 'Un programma chiama puts con il testo «' + testo + '». Quanti codici vengono trasmessi al sistema operativo?', segnaposto: 'Un numero', giuste: I(n + 1),
        ok: 'Il testo ha ' + n + ' caratteri' + (spazio ? ', spazio compreso,' : '') + ' e puts aggiunge in coda il codice di fine riga: ' + n + ' + 1 = ' + (n + 1) + '.',
        diagnosi: [
          { se: I(n), msg: 'Sono stati contati i soli caratteri del testo. La funzione puts aggiunge in coda il codice di fine riga.' },
          { se: spazio ? I(n - 1) : [], msg: 'Anche lo spazio è un carattere, con il proprio codice.' },
          { se: I(n + 2), msg: 'Il fine riga è un solo codice.' }
        ],
        altro: 'Il numero è diverso. Si conti un codice per ogni carattere, e si aggiunga quello di fine riga.',
        indizi: ['Ogni carattere del testo è convertito in un codice.', 'Il testo ha ' + n + ' caratteri' + (spazio ? ', spazio compreso.' : '.'), 'In coda puts aggiunge il codice di fine riga.'],
        svolgimento: ['Caratteri del testo: ' + n + '.', 'Codice di fine riga: 1.', 'Totale: ' + n + ' + 1 = ' + (n + 1) + ' codici.'] };
    },
    // 1.1.2 · base più spostamento
    (r) => {
      const base = 100 * r.int(10, 90), k = r.int(3, 8), giusto = base + k - 1;
      return { u: '1.1.2', d: 'Una parola comincia all’indirizzo ' + base + '. A quale indirizzo si trova la sua ' + ORDINALE[k] + ' lettera?', segnaposto: 'Un indirizzo', giuste: I(giusto),
        ok: 'La prima lettera ha spostamento 0, quindi la ' + ORDINALE[k] + ' ha spostamento ' + (k - 1) + ': ' + base + ' + ' + (k - 1) + ' = ' + giusto + '.',
        diagnosi: [
          { se: I(base + k), msg: 'La prima lettera si trova all’indirizzo ' + base + ', con spostamento 0. La ' + ORDINALE[k] + ' ha quindi spostamento ' + (k - 1) + '.' },
          { se: I(k - 1), msg: 'Il valore indicato è lo spostamento. L’indirizzo si ottiene sommandolo alla base.' },
          { se: I(base), msg: 'Il valore indicato è l’indirizzo della prima lettera.' }
        ],
        altro: 'L’indirizzo è diverso. Si sommi alla base lo spostamento della lettera, numerato a partire da zero.',
        indizi: ['L’indirizzo di un dato adiacente è la somma della base e dello spostamento.', 'La prima lettera ha spostamento 0, la seconda 1.', 'La ' + ORDINALE[k] + ' lettera ha spostamento ' + (k - 1) + '.'],
        svolgimento: ['Base: ' + base + '.', 'Spostamento della ' + ORDINALE[k] + ' lettera: ' + (k - 1) + '.', 'Indirizzo: ' + base + ' + ' + (k - 1) + ' = ' + giusto + '.'] };
    },
    // 1.1.3 · le tappe dal sorgente all'eseguibile
    (r) => r.scegli([
      { u: '1.1.3', d: 'Quale file della catena contiene già codice macchina, con riferimenti ancora da collegare?', o: [
        { t: 'Il file oggetto', ok: true, fb: 'Il file oggetto è prodotto dalla terza tappa. Le chiamate alle funzioni di libreria vi compaiono come annotazioni, che il linker risolverà.' },
        { t: 'Il sorgente', fb: 'Il sorgente è un testo scritto da una persona, anteriore a ogni traduzione.' },
        { t: 'Il file eseguibile', fb: 'Nel file eseguibile i riferimenti sono già stati risolti dal linker.' },
        { t: 'Il file in linguaggio assembly', fb: 'Il linguaggio assembly è ancora testo, con le istruzioni indicate per nome.' }] },
      { u: '1.1.3', d: 'In quale tappa ogni chiamata a una funzione di libreria viene collegata alle istruzioni che la realizzano?', o: [
        { t: 'Nella quarta, affidata al linker', ok: true, fb: 'Il linker riunisce il file oggetto e la libreria, e produce il file eseguibile.' },
        { t: 'Nella seconda, affidata al compilatore', fb: 'Il compilatore traduce il sorgente in linguaggio assembly, e lascia irrisolte le chiamate.' },
        { t: 'Nella prima, che prepara il testo', fb: 'La preparazione riunisce le descrizioni delle funzioni. Le loro istruzioni restano nella libreria.' },
        { t: 'Nella terza, che produce il codice macchina', fb: 'La terza tappa produce il file oggetto, nel quale le chiamate sono ancora annotazioni.' }] },
      { u: '1.1.3', d: 'Il compilatore riceve il sorgente già preparato. Che cosa produce?', o: [
        { t: 'Un file in linguaggio assembly', ok: true, fb: 'Il compilatore traduce il testo in istruzioni per uno specifico processore, ancora espresse con nomi leggibili.' },
        { t: 'Un file oggetto', fb: 'Il file oggetto è prodotto dalla tappa successiva, nella quale ogni istruzione è convertita in un numero.' },
        { t: 'Un file eseguibile', fb: 'Il file eseguibile richiede ancora la conversione in codice macchina e il collegamento.' },
        { t: 'Un sorgente completo', fb: 'Il sorgente completo è il prodotto della prima tappa, ed è ciò che il compilatore riceve.' }] },
      { u: '1.1.3', d: 'In un sorgente manca una parentesi. Quale programma della catena rileva l’errore?', o: [
        { t: 'Il compilatore', ok: true, fb: 'Per tradurre il testo il compilatore deve analizzarne la forma, e una parentesi mancante lo impedisce.' },
        { t: 'Il linker', fb: 'Il linker opera sui file oggetto. Con una parentesi mancante la catena si arresta prima di produrne uno.' },
        { t: 'Il sistema operativo, all’avvio', fb: 'Il sistema operativo avvia soltanto file eseguibili, e la catena si arresta molto prima.' }] }
    ]),
    // 1.1.4 · percorsi relativi
    (r) => {
      const [a, b, c] = r.mescola(['ada', 'bruno', 'carla', 'dario', 'elena']);
      const dir = r.scegli(['dati', 'testi', 'prove']), file = r.scegli(['note.txt', 'voti.txt', 'hello', 'elenco.txt']);
      const forma = r.int(0, 2), qui = '/home/' + a + '/' + dir;
      const F = [
        { rel: '../' + file, giusto: '/home/' + a + '/' + file, errati: [[qui + '/' + file, 'I due punti fanno risalire di un livello prima della ricerca del file.'], ['/home/' + file, 'I due punti compaiono una sola volta, e la risalita è di un solo livello.']], passi: ['Punto di partenza: ' + qui + '.', 'I due punti fanno risalire a /home/' + a + '.', 'In tale directory si cerca ' + file + ': /home/' + a + '/' + file + '.'] },
        { rel: '../../' + b + '/' + file, giusto: '/home/' + b + '/' + file, errati: [['/home/' + a + '/' + b + '/' + file, 'I due punti compaiono due volte, e la risalita è di due livelli.'], ['/' + b + '/' + file, 'Da ' + qui + ' due livelli conducono a /home. La radice si trova un livello più in alto.'], [qui + '/' + b + '/' + file, 'Ogni coppia di punti fa risalire di un livello prima della discesa.']], passi: ['Punto di partenza: ' + qui + '.', 'La prima coppia di punti fa risalire a /home/' + a + ', la seconda a /home.', 'Da qui si scende in ' + b + ' e si raggiunge ' + file + ': /home/' + b + '/' + file + '.'] },
        { rel: '../' + c + '/' + file, giusto: '/home/' + a + '/' + c + '/' + file, errati: [['/home/' + c + '/' + file, 'I due punti compaiono una sola volta: da ' + qui + ' si risale a /home/' + a + '.'], [qui + '/' + c + '/' + file, 'I due punti fanno risalire di un livello prima della discesa in ' + c + '.']], passi: ['Punto di partenza: ' + qui + '.', 'I due punti fanno risalire a /home/' + a + '.', 'Da qui si scende in ' + c + ' e si raggiunge ' + file + ': /home/' + a + '/' + c + '/' + file + '.'] }
      ][forma];
      return { u: '1.1.4', d: 'La directory corrente è ' + qui + '. Quale percorso assoluto corrisponde a `' + F.rel + '`?', segnaposto: 'Un percorso che comincia con /', giuste: [F.giusto],
        ok: F.passi.join(' '),
        diagnosi: F.errati.map((e) => ({ se: [e[0]], msg: e[1] })).concat([{ se: [F.giusto.slice(1)], msg: 'I nomi sono corretti. Un percorso assoluto comincia con la barra della radice.' }]),
        altro: 'Il percorso è diverso. Si parta dalla directory corrente, e si risolva un nome alla volta.',
        indizi: ['Il percorso è relativo, quindi parte da ' + qui + '.', 'Ogni coppia di punti fa risalire di un livello.', 'Dopo la risalita si risolvono i nomi restanti, in discesa.'],
        svolgimento: F.passi };
    },
    // 1.1.5 · processi e PID
    (r) => {
      const shell = r.int(1000, 4000), figlio = shell + r.int(3, 40), prog = r.scegli(['hello', 'saluta', 'conta', 'elenca']), chiede = r.int(0, 1);
      if (chiede === 0) return { u: '1.1.5', d: 'Una shell con PID ' + shell + ' crea un figlio con PID ' + figlio + ', che sostituisce poi il proprio programma con ' + prog + '. Quando ' + prog + ' termina, a quale PID viene comunicato il codice di uscita?', segnaposto: 'Un PID', giuste: I(shell),
        ok: 'Il codice di uscita è comunicato al padre in attesa, cioè alla shell con PID ' + shell + '.',
        diagnosi: [{ se: I(figlio), msg: 'Il valore indicato è il PID del processo che termina. Il codice di uscita è destinato al processo che lo aveva creato e ne attende il termine.' }],
        altro: 'Il PID è diverso. Il codice di uscita è trasmesso al sistema operativo, che lo comunica al padre.',
        indizi: ['Il processo che termina è il figlio.', 'Il sistema operativo comunica il codice di uscita al padre in attesa.', 'Il padre è la shell.'],
        svolgimento: ['Il programma ' + prog + ' è eseguito nel processo figlio, con PID ' + figlio + '.', 'Al termine trasmette il codice di uscita al sistema operativo.', 'Il sistema operativo lo comunica al padre, la shell con PID ' + shell + '.'] };
      return { u: '1.1.5', d: 'Una shell con PID ' + shell + ' crea un figlio, al quale è assegnato il PID ' + figlio + ', e che sostituisce poi il proprio programma con ' + prog + '. Con quale PID viene eseguito ' + prog + '?', segnaposto: 'Un PID', giuste: I(figlio),
        ok: 'La sostituzione cambia il programma e lascia invariato il PID: ' + prog + ' è eseguito con il PID ' + figlio + '.',
        diagnosi: [{ se: I(shell), msg: 'Il valore indicato è il PID della shell, che continua a esistere e resta in attesa. Il programma nuovo è eseguito nel processo figlio.' }, { se: I(figlio + 1), msg: 'La sostituzione avviene all’interno del processo figlio, senza crearne un altro.' }],
        altro: 'Il PID è diverso. Ci si chieda in quale processo avviene la sostituzione del programma.',
        indizi: ['La shell resta in esecuzione con il proprio PID.', 'La sostituzione avviene nel processo figlio.', 'La sostituzione cambia il programma e lascia invariato il PID.'],
        svolgimento: ['Creazione: viene prodotto il figlio, con PID ' + figlio + '.', 'Sostituzione: il figlio carica ' + prog + ' al posto del proprio programma.', 'Il processo è il medesimo, e quindi ' + prog + ' è eseguito con il PID ' + figlio + '.'] };
    },
    // 1.1.6 · redirezione con > e >>
    (r) => {
      const n = r.int(1, 5), seq = r.scegli([['>>', '>', '>>'], ['>', '>>', '>>'], ['>>', '>>', '>'], ['>', '>', '>>'], ['>>', '>', '>']]);
      let righe = n; const passi = ['All’inizio il file contiene ' + n + (n === 1 ? ' riga.' : ' righe.')];
      seq.forEach((s) => { righe = s === '>' ? 1 : righe + 1; passi.push('Dopo `./hello ' + s + ' esito`: ' + (s === '>' ? 'il file viene svuotato e riceve una riga, quindi ne contiene 1.' : 'la riga è aggiunta in coda, e il file ne contiene ' + righe + '.')); });
      return { u: '1.1.6', d: 'Il file esito contiene ' + n + (n === 1 ? ' riga' : ' righe') + '. Vengono eseguiti, in quest’ordine, i comandi `./hello ' + seq[0] + ' esito`, `./hello ' + seq[1] + ' esito` e `./hello ' + seq[2] + ' esito`. Quante righe contiene il file al termine?', segnaposto: 'Un numero di righe', giuste: I(righe),
        ok: 'L’ultimo comando con il segno > svuota il file e vi scrive una riga. Ogni comando successivo con >> ne aggiunge una. Al termine le righe sono ' + righe + '.',
        diagnosi: [
          { se: I(n + 3), msg: 'È stata aggiunta una riga per ogni comando. Il segno > svuota il file prima della scrittura.' },
          { se: I(3), msg: 'Tre sono le righe scritte in tutto. Quelle scritte prima dell’ultimo > sono cancellate.' },
          { se: I(n + seq.filter((s) => s === '>>').length), msg: 'Le aggiunte sono state contate a partire dal contenuto iniziale. Dopo un > il contenuto precedente è cancellato.' }
        ],
        altro: 'Il numero è diverso. Si seguano i tre comandi uno alla volta, annotando le righe dopo ciascuno.',
        indizi: ['Con > il file viene svuotato, e riceve quindi una riga.', 'Con >> la riga è aggiunta in coda a quelle presenti.', 'Ha effetto soltanto ciò che avviene dall’ultimo > in poi.'],
        svolgimento: passi };
    }
  ] });
})();
