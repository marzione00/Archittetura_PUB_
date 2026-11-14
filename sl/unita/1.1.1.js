'use strict';
SL.registra('1.1.1', {
  titolo: 'Un programma, diversi livelli',
  obiettivo: 'Obiettivo: descrivere il tragitto di una riga di testo dal programma che la produce fino alla destinazione, e determinare il numero di codici trasmessi.',
  concetti: [['terminale', 'Programma'], ['pila', 'Libreria'], ['gate', 'Sistema operativo'], ['char', 'Codice']],
  filigrana: ['terminale', 'char', 'gate'],
  richiami: {
    carte: [
      { sim: 'operation', da: 'Dall’unità 0.2', t: 'Programma e istruzioni', d: 'Un programma è una sequenza ordinata di istruzioni, che il processore esegue una alla volta.' },
      { sim: 'dispositivo', da: 'Dall’unità 0.1', t: 'I dispositivi di uscita', d: 'Un risultato è reso disponibile all’esterno attraverso un dispositivo di uscita, per esempio lo schermo.' },
      { sim: 'memory', da: 'Dall’unità 0.1', t: 'La memoria', d: 'I dati sono conservati in memoria prima e dopo ogni operazione.' }
    ],
    domanda: { d: 'Prima di proseguire: attraverso quale parte del calcolatore un risultato è reso disponibile all’esterno?', o: [
      { t: 'Dal processore', fb: 'Il processore produce il risultato e lo deposita in memoria. La presentazione all’esterno spetta a un dispositivo di uscita.' },
      { t: 'Da un dispositivo di uscita', ok: true, fb: 'Lo schermo, un altoparlante o una stampante sono dispositivi di uscita.' },
      { t: 'Dalla tastiera', fb: 'La tastiera è un dispositivo di ingresso. I risultati sono presentati da un dispositivo di uscita.' }
    ] }
  },
  idea: {
    titolo: 'I livelli attraversati da una riga di testo',
    termini: ['funzione', 'libreria', 'sistema operativo', 'codice', 'uscita standard', 'file'],
    testo: [
      'Il programma hello scrive sullo schermo la parola hello e termina. È per tradizione il primo esercizio nello studio della programmazione, ed è adottato come esempio conduttore dell’intero capitolo: la sua esecuzione, per quanto elementare, coinvolge tutti i livelli del sistema.',
      'L’autore di hello può ignorare il modo in cui si accendono i punti dello schermo, poiché si avvale di una [[funzione]]: un’operazione già realizzata, dotata di un nome, che qualunque programma può richiamare. La funzione che stampa una riga di testo si chiama `puts`. Le funzioni di uso comune sono raccolte in una [[libreria]], utilizzabile senza conoscerne la realizzazione.',
      'Neppure la libreria accede direttamente allo schermo. Schermo, tastiera e disco sono risorse condivise fra tutti i programmi, e un accesso privo di coordinamento produrrebbe conflitti. La loro gestione è affidata al [[sistema operativo]], un programma che resta in funzione per l’intera attività del calcolatore. Un programma che intende scrivere dei dati deve presentare al sistema operativo una richiesta, nella quale sono specificati i dati e la loro quantità.',
      'Nel frattempo il testo ha cambiato rappresentazione. Il calcolatore conserva esclusivamente numeri: a ogni carattere corrisponde pertanto un numero, il suo [[codice]], stabilito da una tabella convenzionale. La lettera h ha codice 104, la lettera e ha codice 101. Dopo l’ultima lettera `puts` aggiunge un carattere di controllo, il fine riga, che ha codice 10 e determina il ritorno a capo. La parola hello diviene così una sequenza di sei codici.',
      { fig: 'celle', titolo: 'La riga hello come sequenza di codici', nota: 'Cinque lettere e un fine riga: sei codici in tutto.', celle: [
        { so: 'h', v: '104' }, { so: 'e', v: '101' }, { so: 'l', v: '108' }, { so: 'l', v: '108' }, { so: 'o', v: '111' }, { so: 'fine riga', v: '10', st: 'amb' }] },
      'La destinazione, infine, è stabilita all’esterno del programma. Il programma trasmette il testo alla propria [[uscita standard]], un canale che ogni programma trova già aperto all’avvio. Di norma tale canale è collegato allo schermo. Chi avvia il programma può collegarlo altrove, per esempio a un [[file]], cioè a una sequenza di dati conservata su disco e identificata da un nome. Per il programma nulla cambia: la scrittura avviene in ogni caso sullo stesso canale.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento segue una riga di testo dalla chiamata di `puts` fino alla destinazione. Ogni carattere è convertito nel proprio codice e aggiunto alla sequenza.',
      'Sono selezionabili il testo da stampare e la destinazione collegata all’uscita standard. Una delle parole contiene una lettera accentata, la cui rappresentazione differisce da quella delle altre lettere.'
    ],
    vedrai: [
      ['terminale', 'Il programma e la libreria', 'In alto. Il programma chiama `puts`, e la libreria prepara i codici.'],
      ['char', 'La sequenza dei codici', 'Al centro. Ogni casella riceve il codice di un carattere.'],
      ['gate', 'Il sistema operativo', 'In basso a sinistra. Riceve la richiesta e trasmette i codici alla destinazione.']
    ]
  },
  lab: {
    titolo: 'Tragitto di una riga di testo',
    scena: { w: 860, h: 330 },
    atti: ['Preparazione', 'Conversione dei caratteri in codici', 'La richiesta al sistema operativo', 'La consegna'],
    nota: 'Il numero dei passi dipende dal testo: un passo per ogni carattere, oltre al fine riga.',
    controlli: [
      { id: 'parola', tipo: 'scelta', eti: 'Testo', opzioni: [['hello', 'hello'], ['Ciao', 'Ciao'], ['Aè', 'Aè']], valore: 'hello' },
      { id: 'dest', tipo: 'scelta', eti: 'Uscita standard collegata a', opzioni: [['schermo', 'Schermo'], ['file', 'File']], valore: 'schermo' }
    ],
    previsione: {
      domanda: (p) => 'Il programma chiama puts con il testo «' + p.parola + '». Quanti codici compaiono nella richiesta di scrittura rivolta al sistema operativo?',
      opzioni: () => [2, 3, 4, 5, 6, 7]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' codici. La richiesta ne contiene ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : (p.parola === 'Aè' ? 'La lettera è occupa due codici, e ai codici dei caratteri va aggiunto il fine riga.' : 'Ai codici delle lettere va aggiunto il codice del fine riga, che puts pone in coda.')),
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
      const hud = (c) => [['Carattere', c == null ? '·' : c, 'a'], ['Codici accodati', fila.length, 'c'], ['Destinazione', p.dest]];
      passi.push({ atto: 0, titolo: 'Stato iniziale', hud: hud(), els: quadro(),
        testo: 'Il programma contiene l’istruzione che chiama `puts` con il testo «' + p.parola + '». La sequenza dei codici è vuota, e l’uscita standard è collegata ' + (p.dest === 'schermo' ? 'allo schermo.' : 'a un file.') });
      passi.push({ atto: 0, titolo: 'La chiamata a puts', hud: hud(), els: quadro({ att: 'l', via: 'pl', lib: 'puts: testo' }),
        testo: 'Il programma trasmette il testo alla funzione `puts`, che appartiene alla libreria. Da questo passo l’elaborazione prosegue all’esterno del programma.' });
      car.forEach((c) => {
        const v = codici(c), inizio = fila.length;
        v.forEach((x, j) => fila.push({ c: j === 0 ? c : '', v: x }));
        passi.push({ atto: 1, titolo: 'Il carattere «' + c + '»', calc: '«' + c + '» → ' + v.join(', '), hud: hud(c), els: quadro({ att: 'l', via: 'lf', lib: 'converto «' + c + '»', nuovi: v.map((x, j) => inizio + j) }),
          testo: v.length === 1 ? 'Nella tabella dei codici il carattere «' + c + '» ha codice ' + v[0] + '. Il codice viene aggiunto alla sequenza.' : 'La lettera «' + c + '» è estranea alla parte originaria della tabella, ed è rappresentata da due codici, ' + v[0] + ' e ' + v[1] + '. Occupa pertanto due posti nella sequenza.' });
      });
      passi[passi.length - 1].chiedi = { d: 'Tutti i caratteri del testo sono stati convertiti. La sequenza è pronta per la trasmissione?', o: ['Sì, è completa', 'Manca ancora un codice'], g: 1, no: 'La funzione puts stampa una riga intera: dopo l’ultimo carattere aggiunge il codice del fine riga.' };
      fila.push({ c: 'fine riga', v: 10 });
      passi.push({ atto: 1, titolo: 'Il fine riga', calc: 'fine riga → 10', hud: hud('fine riga'), els: quadro({ att: 'l', via: 'lf', lib: 'puts: fine riga', nuovi: [fila.length - 1] }),
        testo: 'Dopo l’ultimo carattere `puts` aggiunge il fine riga, di codice 10. La sequenza contiene ora ' + fila.length + ' codici.' });
      const n = fila.length;
      passi.push({ atto: 2, titolo: 'La richiesta di scrittura', calc: 'scrivi ' + n + ' codici sul canale 1', hud: hud(), els: quadro({ att: 's', via: 'fs', so: 'richiesta: ' + n + ' codici' }),
        testo: 'La libreria chiede al sistema operativo di scrivere ' + n + ' codici sull’uscita standard, cioè sul canale numero 1. La richiesta è priva di qualunque indicazione della destinazione.',
        chiedi: { d: 'Chi stabilisce la destinazione dei codici?', o: ['Il programma, nella richiesta', 'Il sistema operativo, in base al collegamento del canale 1'], g: 1, no: 'La richiesta indica soltanto il canale. Il collegamento del canale è stabilito prima dell’avvio del programma, ed è noto al sistema operativo.' } });
      passi.push({ atto: 2, titolo: 'Collegamento del canale 1', calc: 'canale 1 → ' + p.dest, hud: hud(), els: quadro({ att: 's', so: 'canale 1 → ' + p.dest }),
        testo: 'Il sistema operativo verifica a che cosa è collegato il canale 1 di questo programma: in questo caso ' + (p.dest === 'schermo' ? 'allo schermo.' : 'a un file.') });
      passi.push({ atto: 3, titolo: 'Trasmissione dei codici', hud: hud(), els: quadro({ att: 's', via: 'sd', so: 'consegno ' + n + ' codici', partiti: true }),
        testo: 'Il sistema operativo trasmette i ' + n + ' codici alla destinazione, nell’ordine in cui compaiono nella sequenza.' });
      passi.push({ atto: 3, titolo: p.dest === 'schermo' ? 'La riga compare sullo schermo' : 'La riga è registrata nel file', calc: n + ' codici trasmessi', hud: hud(), els: quadro({ att: 'd', arrivo: p.parola + ' ⏎', partiti: true }),
        testo: (p.dest === 'schermo' ? 'Lo schermo converte ogni codice nel disegno del carattere corrispondente e, giunto al codice 10, va a capo.' : 'Il file conserva i ' + n + ' codici nella forma in cui sono stati trasmessi. Sullo schermo è rimasto tutto invariato.') + ' Con l’altra destinazione il programma avrebbe compiuto le medesime operazioni.' });
      return { passi, esito: n };
    }
  },
  bilancio: {
    regola: [
      'Un programma si avvale di una libreria, e la libreria del sistema operativo. Nessuno dei due livelli superiori accede direttamente allo schermo.',
      'Il testo è trasmesso come sequenza di codici, uno per carattere, con il fine riga in coda. La destinazione dipende dal collegamento dell’uscita standard, stabilito da chi avvia il programma.'
    ],
    errori: [
      ['Omettere il fine riga.', 'La riga hello è composta da sei codici: cinque lettere e il fine riga.'],
      ['Ritenere che il programma scriva sullo schermo.', 'Il programma scrive sulla propria uscita standard. Il collegamento di quel canale è noto al sistema operativo.'],
      ['Attribuire un solo codice a una lettera accentata.', 'Le lettere accentate, come è, occupano due codici.']
    ],
    saFare: ['Elencare i tre livelli attraversati da una riga di testo.', 'Determinare il numero di codici trasmessi per stampare una parola.', 'Spiegare perché lo stesso programma può scrivere sullo schermo o in un file.'],
    esercizi: [
      { d: 'Un programma chiama puts con il testo «Buongiorno». Quanti codici vengono trasmessi al sistema operativo?', segnaposto: 'Un numero', giuste: ['11'],
        ok: 'Dieci lettere senza accento, un codice ciascuna, più il fine riga.',
        diagnosi: [
          { se: ['10'], msg: 'Sono state contate le sole lettere. La funzione puts aggiunge in coda il codice del fine riga.' },
          { se: ['12'], msg: 'Il fine riga è un solo codice, e nessuna lettera di questa parola è accentata. Le lettere vanno contate di nuovo.' },
          { se: ['1'], msg: 'La richiesta è una sola, correttamente. La domanda riguarda il numero di codici che essa contiene.' }
        ],
        altro: 'Il conto è diverso. Si contino le lettere della parola, una alla volta, e si aggiunga il fine riga.',
        indizi: ['Ogni lettera senza accento occupa un codice.', 'La parola Buongiorno ha dieci lettere.', 'Dopo l’ultima lettera puts aggiunge un codice.'],
        svolgimento: ['Le lettere di Buongiorno sono dieci, e nessuna è accentata: dieci codici.', 'Il fine riga aggiunge un codice.', 'I codici trasmessi sono 11.'] },
      { d: 'L’uscita standard di hello viene collegata a un file, in luogo dello schermo. Che cosa cambia all’interno del programma?', guida: 'Si indichi che cosa cambia.', o: [
        { t: 'La funzione chiamata', fb: 'Il programma chiama in ogni caso puts. Il collegamento del canale è stabilito all’esterno.' },
        { t: 'Nulla', ok: true, fb: 'Il programma scrive in ogni caso sulla propria uscita standard. Il collegamento di quel canale è stabilito da chi avvia il programma.' },
        { t: 'I codici del testo', fb: 'I codici sono i medesimi sei; il sistema operativo li trasmette a una destinazione diversa.' }] }
    ],
    sfida: ['lez01_01_layers_order', 'Livelli di astrazione e percorso dei dati']
  }
});
