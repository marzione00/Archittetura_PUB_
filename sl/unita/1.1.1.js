'use strict';
SL.registra('1.1.1', {
  titolo: 'Un programma, diversi livelli',
  obiettivo: 'Alla fine saprai descrivere il cammino di una riga di testo dal programma che la stampa fino alla sua destinazione, e contare quanti codici vengono consegnati.',
  concetti: [['terminale', 'Programma'], ['pila', 'Libreria'], ['gate', 'Sistema operativo'], ['char', 'Codice']],
  filigrana: ['terminale', 'char', 'gate'],
  richiami: {
    carte: [
      { sim: 'operation', da: 'Dall’unità 0.2', t: 'Programma e istruzioni', d: 'Un programma è un elenco ordinato di istruzioni, che il processore esegue una alla volta.' },
      { sim: 'dispositivo', da: 'Dall’unità 0.1', t: 'I dispositivi di uscita', d: 'Un risultato raggiunge chi usa il calcolatore attraverso un dispositivo di uscita, per esempio lo schermo.' },
      { sim: 'memory', da: 'Dall’unità 0.1', t: 'La memoria', d: 'I dati sostano in memoria prima e dopo ogni operazione.' }
    ],
    domanda: { d: 'Prima di proseguire: da quale parte del calcolatore un risultato raggiunge chi lo usa?', o: [
      { t: 'Dal processore', fb: 'Il processore produce il risultato e lo deposita in memoria. A portarlo all’esterno è un dispositivo di uscita.' },
      { t: 'Da un dispositivo di uscita', ok: true, fb: 'Lo schermo, un altoparlante o una stampante sono dispositivi di uscita.' },
      { t: 'Dalla tastiera', fb: 'La tastiera è un dispositivo di ingresso. I risultati escono da un dispositivo di uscita.' }
    ] }
  },
  idea: {
    titolo: 'Nessun programma lavora da solo',
    termini: ['funzione', 'libreria', 'sistema operativo', 'codice', 'uscita standard', 'file'],
    testo: [
      'Il programma più famoso del mondo fa una cosa sola: scrive sullo schermo la parola hello. Da decenni è il primo esercizio di chi impara a programmare. Lo useremo come filo conduttore di tutto il capitolo, perché dietro la sua semplicità lavora l’intero sistema.',
      'Chi ha scritto hello ha potuto ignorare il modo in cui si accendono i punti dello schermo, perché ha usato una [[funzione]], cioè un’operazione già pronta, dotata di un nome, che qualcun altro ha scritto una volta per tutte. La funzione che stampa una riga di testo si chiama `puts`. Le funzioni di uso comune sono raccolte in una [[libreria]], che ogni programma può usare senza conoscerne i dettagli.',
      'Nemmeno la libreria tocca lo schermo. Lo schermo, la tastiera e il disco sono risorse condivise fra tutti i programmi, e lasciarle in mano a ciascuno porterebbe al caos. A governarle c’è il [[sistema operativo]], un programma che resta sempre in funzione e fa da custode. Un programma che vuole scrivere qualcosa deve chiederlo al sistema operativo con una richiesta precisa, che dice quali dati scrivere e quanti sono.',
      'Il testo, intanto, ha cambiato natura. Il calcolatore conserva soltanto numeri, quindi a ogni carattere corrisponde un numero, il suo [[codice]], stabilito da una tabella su cui tutti sono d’accordo. La lettera h ha codice 104 e la e ha codice 101. Dopo l’ultima lettera `puts` aggiunge un carattere speciale, il fine riga, che ha codice 10 e ordina di andare a capo. La parola hello diventa così una fila di sei codici.',
      { fig: 'celle', titolo: 'La riga hello come fila di codici', nota: 'Cinque lettere e un fine riga: sei codici in tutto.', celle: [
        { so: 'h', v: '104' }, { so: 'e', v: '101' }, { so: 'l', v: '108' }, { so: 'l', v: '108' }, { so: 'o', v: '111' }, { so: 'fine riga', v: '10', st: 'amb' }] },
      'La destinazione, infine, è decisa fuori dal programma. Il programma consegna il testo alla sua [[uscita standard]], un canale che ogni programma trova già aperto alla partenza. Di solito quel canale porta allo schermo. Chi avvia il programma può collegarlo altrove, per esempio a un [[file]], cioè a una sequenza di dati conservata su disco sotto un nome. Per il programma nulla cambia, e la scrittura avviene sempre nello stesso canale.'
    ]
  },
  esperimento: {
    faremo: [
      'Seguiremo una riga di testo dal momento in cui il programma chiama `puts` fino al momento in cui raggiunge la destinazione. Vedremo ogni carattere trasformarsi nel suo codice e mettersi in fila.',
      'Potrai scegliere il testo da stampare e la destinazione a cui è collegata l’uscita standard. Una delle parole contiene una lettera accentata, che riserva una sorpresa.'
    ],
    vedrai: [
      ['terminale', 'Il programma e la libreria', 'In alto. Il programma chiama `puts`, la libreria prepara i codici.'],
      ['char', 'La fila dei codici', 'Al centro. Ogni casella riceve il codice di un carattere.'],
      ['gate', 'Il sistema operativo', 'In basso a sinistra. Riceve la richiesta e consegna i codici alla destinazione.']
    ]
  },
  lab: {
    titolo: 'Il viaggio di una riga',
    scena: { w: 860, h: 330 },
    atti: ['Preparazione', 'I caratteri diventano codici', 'La richiesta al sistema operativo', 'La consegna'],
    nota: 'Il numero di passi dipende dal testo: ogni carattere richiede un passo, più il fine riga.',
    controlli: [
      { id: 'parola', tipo: 'scelta', eti: 'Testo', opzioni: [['hello', 'hello'], ['Ciao', 'Ciao'], ['Aè', 'Aè']], valore: 'hello' },
      { id: 'dest', tipo: 'scelta', eti: 'Uscita standard collegata a', opzioni: [['schermo', 'Schermo'], ['file', 'File']], valore: 'schermo' }
    ],
    previsione: {
      domanda: (p) => 'Il programma chiama puts con il testo «' + p.parola + '». Quanti codici chiederà di scrivere al sistema operativo?',
      opzioni: () => [2, 3, 4, 5, 6, 7]
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + pred + ' codici. La richiesta ne contiene ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : (p.parola === 'Aè' ? 'La lettera è occupa due codici, e a tutti i caratteri va aggiunto il fine riga.' : 'Ai codici delle lettere va aggiunto quello del fine riga, che puts mette in coda.')),
    costruisci(p) {
      const el = SL.el, passi = [], car = Array.from(p.parola);
      const codici = (c) => (c === 'è' ? [195, 168] : [c.charCodeAt(0)]);
      const fila = [];                                   // {c, v}
      const quadro = (o) => {
        o = o || {};
        const els = [
          el.linea('a', 230, 42, 290, 42, o.via === 'pl' ? 'on' : ''), el.linea('b', 390, 74, 390, 110, o.via === 'lf' ? 'on' : ''), el.linea('c', 150, 196, 150, 236, o.via === 'fs' ? 'on' : ''), el.linea('d', 300, 276, 540, 276, o.via === 'sd' ? 'on' : ''),
          el.box('p', 20, 10, 210, 64, 'programma', 'puts("' + p.parola + '")', o.att === 'p' ? 'att' : '', { sim: 'terminale', riga: true }),
          el.box('l', 290, 10, 220, 64, 'libreria', o.lib || 'puts', o.att === 'l' ? 'att' : '', { sim: 'pila', riga: true }),
          el.nota('tf', 20, 104, 'FILA DEI CODICI', 'mono'),
          el.box('s', 20, 240, 280, 74, 'sistema operativo', o.so || 'in attesa', o.att === 's' ? 'att' : '', { sim: 'gate', riga: true }),
          el.box('d', 540, 240, 300, 74, p.dest === 'schermo' ? 'schermo' : 'file', o.arrivo || (p.dest === 'schermo' ? 'vuoto' : 'vuoto'), o.att === 'd' ? 'on' : '', { sim: p.dest === 'schermo' ? 'terminale' : 'file', riga: true })
        ];
        for (let k = 0; k < 7; k++) els.push(el.cella('f' + k, 20 + k * 92, 148, 80, 50, fila[k] ? String(fila[k].v) : '', fila[k] ? (o.nuovi && o.nuovi.includes(k) ? 'att' : o.partiti ? 'on' : 'zero') : 'off', { piccola: true, so: fila[k] ? fila[k].c : '' }));
        return els;
      };
      const hud = (c) => [['Carattere', c == null ? '·' : c, 'a'], ['Codici in fila', fila.length, 'c'], ['Destinazione', p.dest]];
      passi.push({ atto: 0, titolo: 'Il programma sta per stampare', hud: hud(), els: quadro(),
        testo: 'Il programma contiene l’istruzione che chiama `puts` con il testo «' + p.parola + '». La fila dei codici è vuota e l’uscita standard è collegata ' + (p.dest === 'schermo' ? 'allo schermo.' : 'a un file.') });
      passi.push({ atto: 0, titolo: 'La chiamata a puts', hud: hud(), els: quadro({ att: 'l', via: 'pl', lib: 'puts: testo' }),
        testo: 'Il programma passa il testo alla funzione `puts`, che appartiene alla libreria. Da questo momento il lavoro prosegue fuori dal programma.' });
      car.forEach((c) => {
        const v = codici(c), inizio = fila.length;
        v.forEach((x, j) => fila.push({ c: j === 0 ? c : '', v: x }));
        passi.push({ atto: 1, titolo: 'Il carattere «' + c + '»', calc: '«' + c + '» → ' + v.join(', '), hud: hud(c), els: quadro({ att: 'l', via: 'lf', lib: 'converto «' + c + '»', nuovi: v.map((x, j) => inizio + j) }),
          testo: v.length === 1 ? 'Nella tabella dei codici il carattere «' + c + '» ha codice ' + v[0] + '. Il codice prende posto nella fila.' : 'La lettera «' + c + '» non appartiene alla parte più antica della tabella e viene rappresentata con due codici, ' + v[0] + ' e ' + v[1] + '. Occupa quindi due posti nella fila.' });
      });
      passi[passi.length - 1].chiedi = { d: 'Tutti i caratteri del testo sono stati convertiti. La fila è pronta per essere consegnata?', o: ['Sì, è completa', 'Manca ancora un codice'], g: 1, no: 'La funzione puts stampa una riga intera: dopo l’ultimo carattere aggiunge il codice del fine riga.' };
      fila.push({ c: 'fine riga', v: 10 });
      passi.push({ atto: 1, titolo: 'Il fine riga', calc: 'fine riga → 10', hud: hud('fine riga'), els: quadro({ att: 'l', via: 'lf', lib: 'puts: fine riga', nuovi: [fila.length - 1] }),
        testo: 'Dopo l’ultimo carattere `puts` aggiunge il fine riga, che ha codice 10. La fila ora contiene ' + fila.length + ' codici.' });
      const n = fila.length;
      passi.push({ atto: 2, titolo: 'La richiesta di scrittura', calc: 'scrivi ' + n + ' codici sul canale 1', hud: hud(), els: quadro({ att: 's', via: 'fs', so: 'richiesta: ' + n + ' codici' }),
        testo: 'La libreria chiede al sistema operativo di scrivere ' + n + ' codici sull’uscita standard, che è il canale numero 1. Nella richiesta non compare alcuna destinazione.',
        chiedi: { d: 'Chi decide dove finiscono i codici?', o: ['Il programma, dentro la richiesta', 'Il sistema operativo, seguendo il collegamento del canale 1'], g: 1, no: 'La richiesta nomina soltanto il canale. Dove porti quel canale è stabilito prima che il programma parta, e lo sa il sistema operativo.' } });
      passi.push({ atto: 2, titolo: 'Dove porta il canale 1', calc: 'canale 1 → ' + p.dest, hud: hud(), els: quadro({ att: 's', so: 'canale 1 → ' + p.dest }),
        testo: 'Il sistema operativo controlla a che cosa è collegato il canale 1 di questo programma: in questo caso ' + (p.dest === 'schermo' ? 'allo schermo.' : 'a un file.') });
      passi.push({ atto: 3, titolo: 'I codici partono', hud: hud(), els: quadro({ att: 's', via: 'sd', so: 'consegno ' + n + ' codici', partiti: true }),
        testo: 'Il sistema operativo consegna i ' + n + ' codici alla destinazione, nell’ordine in cui si trovano nella fila.' });
      passi.push({ atto: 3, titolo: p.dest === 'schermo' ? 'La riga compare sullo schermo' : 'La riga è nel file', calc: n + ' codici consegnati', hud: hud(), els: quadro({ att: 'd', arrivo: p.parola + ' ⏎', partiti: true }),
        testo: (p.dest === 'schermo' ? 'Lo schermo trasforma ogni codice nel disegno del carattere corrispondente e, arrivato al codice 10, va a capo.' : 'Il file conserva i ' + n + ' codici così come sono arrivati. Sullo schermo non è comparso nulla.') + ' Il programma avrebbe fatto esattamente le stesse mosse con l’altra destinazione.' });
      return { passi, esito: n };
    }
  },
  bilancio: {
    regola: [
      'Un programma si appoggia a una libreria, e la libreria al sistema operativo. Nessuno dei due livelli superiori tocca direttamente lo schermo.',
      'Il testo viaggia come una fila di codici, uno per carattere, con il fine riga in coda. La destinazione dipende dal collegamento dell’uscita standard, che viene deciso da chi avvia il programma.'
    ],
    errori: [
      ['Dimenticare il fine riga.', 'La riga hello è fatta di sei codici: cinque lettere e il fine riga.'],
      ['Pensare che il programma scriva sullo schermo.', 'Il programma scrive nella sua uscita standard. È il sistema operativo a sapere dove porta.'],
      ['Contare un codice per ogni lettera accentata.', 'Lettere come è occupano due codici.']
    ],
    saFare: ['Elenco i tre livelli attraversati da una riga di testo.', 'Conto i codici consegnati per stampare una parola.', 'Spiego perché lo stesso programma può scrivere sullo schermo o in un file.'],
    esercizi: [
      { d: 'Un programma chiama puts con il testo «Buongiorno». Quanti codici vengono consegnati al sistema operativo?', segnaposto: 'Un numero', giuste: ['11'],
        ok: 'Dieci lettere senza accento, un codice ciascuna, più il fine riga.',
        diagnosi: [
          { se: ['10'], msg: 'Hai contato le lettere. La funzione puts aggiunge in coda il codice del fine riga.' },
          { se: ['12'], msg: 'Il fine riga è un codice solo, e nessuna lettera di questa parola è accentata. Riconta le lettere.' },
          { se: ['1'], msg: 'La richiesta è una sola, ed è giusto. La domanda riguarda quanti codici contiene.' }
        ],
        altro: 'Il conto è diverso. Conta le lettere della parola, una per una, e aggiungi il fine riga.',
        indizi: ['Ogni lettera senza accento occupa un codice.', 'La parola Buongiorno ha dieci lettere.', 'Dopo l’ultima lettera puts aggiunge un codice.'],
        svolgimento: ['Le lettere di Buongiorno sono dieci, e nessuna è accentata: dieci codici.', 'Il fine riga aggiunge un codice.', 'I codici consegnati sono 11.'] },
      { d: 'L’uscita standard di hello viene collegata a un file al posto dello schermo. Che cosa cambia dentro il programma?', guida: 'Scegli che cosa cambia.', o: [
        { t: 'La funzione chiamata', fb: 'Il programma chiama sempre puts. Il collegamento del canale viene deciso all’esterno.' },
        { t: 'Nulla', ok: true, fb: 'Il programma scrive sempre nella sua uscita standard. Il collegamento di quel canale viene deciso da chi avvia il programma.' },
        { t: 'I codici del testo', fb: 'I codici sono gli stessi sei, e il sistema operativo li consegna in un luogo diverso.' }] }
    ],
    sfida: ['lez01_01_layers_order', 'Livelli di astrazione e percorso dei dati']
  }
});
