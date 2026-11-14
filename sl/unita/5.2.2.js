'use strict';
SL.unita522 = (() => {
  const DOVE = { tty: 'tty', file: 'file', senza: 'tty' };
  // fase: 0 il comando · 1 fork · 2 open · 3 dup2 · 4 close · 5 exec e scrittura · 6 il prompt
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], red = p.caso !== 'tty', dup = p.caso === 'file', w2 = (o.w - o.gap) / 2, wf = (w2 - 3 * 6) / 4;
    const fd1 = dup && f >= 3 ? 'file' : 'terminale', fd3 = red && f >= 2 && !(dup && f >= 4) ? 'file' : '·';
    const tab = (id, x, tit, voci, att) => { els.push(el.nota(pre + id + 't', x, o.y, tit, 'mono')); voci.forEach((v, k) => els.push(el.cella(pre + id + k, x + k * (wf + 6), o.y + 42, wf, 34, v, v === '·' ? '' : att === k ? 'att' : v === 'file' ? 'zero' : 'on', { so: 'fd ' + k, piccola: true }))); };
    tab('s', o.x, 'SHELL · tabella dei descrittori', ['term.', 'term.', 'term.', '·'], f === 6 ? 1 : -1);
    if (f >= 1) tab('c', o.x + w2 + o.gap, f >= 5 ? 'FIGLIO · ora esegue echo' : 'FIGLIO · copia della shell', ['term.', fd1 === 'terminale' ? 'term.' : 'file', 'term.', fd3], f === 2 ? 3 : f === 3 || f === 5 ? 1 : f === 4 ? 3 : -1);
    const w3 = (o.w - 20) / 3, dest = DOVE[p.caso];
    els.push(el.box(pre + 'a', o.x, o.y + 96, w3, 54, 'terminale', f >= 6 ? (dest === 'tty' ? p.parola + ' · poi il prompt' : 'il prompt') : f >= 5 && dest === 'tty' ? p.parola : '·', f >= 5 && (dest === 'tty' || f >= 6) ? 'att' : '', { cls: 'stretta' }),
      el.box(pre + 'b', o.x + w3 + 10, o.y + 96, w3, 54, 'file esito.txt', !red ? 'non esiste' : f < 2 ? '·' : f >= 5 && dest === 'file' ? p.parola : 'vuoto', f >= 5 && dest === 'file' ? 'att' : red && f >= 2 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'c', o.x + 2 * (w3 + 10), o.y + 96, w3, 54, 'la shell', f === 0 ? 'legge il comando' : f >= 6 ? 'pronta' : 'attende il figlio', f === 6 ? 'att' : 'on', { cls: 'stretta' }));
    return els;
  };
  return { DOVE, quadro };
})();
SL.registra('5.2.2', {
  titolo: 'Avvio di un comando e redirezione dell’uscita',
  obiettivo: 'Obiettivo: ricostruire le operazioni con cui la shell esegue un comando, e il modo in cui ne devia l’uscita in un file all’insaputa del comando.',
  concetti: [['terminale', 'La shell crea un figlio'], ['tabella', 'Il figlio predispone i descrittori'], ['file', 'Il comando scrive sul medesimo descrittore']],
  filigrana: ['terminale', 'fork', 'file'],
  richiami: {
    carte: [
      { sim: 'fork', da: 'Dall’unità 5.2.1', t: 'fork', d: 'Il figlio è una copia del padre, e ne eredita anche i file aperti.' },
      { sim: 'file', da: 'Dall’unità 2.5.3', t: 'Il descrittore di file', d: 'Un piccolo intero che indica un file aperto. Il numero 1 è l’uscita standard.' },
      { sim: 'terminale', da: 'Dall’unità 1.1.6', t: 'La redirezione', d: 'Il segno > invia in un file i dati che il comando scriverebbe sul terminale.' }
    ],
    domanda: { d: 'Prima di proseguire: un programma scrive sempre sul descrittore 1. Da che cosa dipende la destinazione dei byte?', o: [
      { t: 'Dall’oggetto a cui il descrittore 1 è collegato in tale processo', ok: true, fb: 'Il numero è fisso. Il collegamento è registrato nella tabella dei descrittori del processo.' },
      { t: 'Dal programma, che seleziona la destinazione', fb: 'Il programma conosce soltanto il numero 1.' },
      { t: 'Dal terminale, che decide se accettarli', fb: 'Il terminale è una delle destinazioni possibili, senza alcun potere di scelta.' }
    ] }
  },
  idea: {
    titolo: 'La shell predispone, il comando scrive',
    termini: ['dup2'],
    testo: [
      'Quando nel terminale è scritto «echo ciao», il comando è letto dalla shell. La shell tuttavia esegue echo in un processo distinto: chiama fork e crea un figlio, che in seguito sostituisce il proprio programma con echo. La shell resta in attesa del termine del figlio, e mostra quindi di nuovo l’invito a scrivere, il prompt. Il figlio ha ereditato la tabella dei descrittori della shell, e il suo descrittore 1 conduce al terminale, dove compare la parola.',
      'Con «echo ciao > esito.txt» la parola deve essere scritta in un file. Il programma echo è il medesimo, e continua a scrivere sul descrittore 1. Varia il collegamento, che è modificato dal figlio nell’intervallo fra fork e l’avvio del programma. Il figlio apre anzitutto esito.txt, e riceve il primo descrittore libero, il 3. Chiama quindi [[dup2]] con gli argomenti 3 e 1: per effetto della chiamata anche il descrittore 1 indica l’oggetto indicato dal 3, cioè il file. Chiude infine il 3, ormai superfluo.',
      { fig: 'scena', w: 720, h: 156, titolo: 'echo ciao > esito.txt, immediatamente prima dell’avvio di echo', nota: 'Nel figlio il descrittore 1 conduce al file esito.txt. Nella shell conduce ancora al terminale, abbreviato «term.».', els: SL.unita522.quadro('g', { caso: 'file', parola: 'ciao' }, 4, { x: 10, y: 0, w: 700, gap: 20 }) },
      'A questo punto il figlio carica echo. Il nuovo programma eredita la tabella nello stato in cui si trova, scrive «ciao» sul descrittore 1, e la parola giunge nel file. La tabella della shell è rimasta invariata: il prompt successivo compare sul terminale, come di consueto.',
      'Per questa ragione fork e l’avvio del programma sono due chiamate distinte. Nell’intervallo fra le due il figlio esegue ancora codice della shell, e può predisporre l’ambiente per il programma successivo: descrittori, cartella di lavoro, permessi. Il programma può pertanto ignorare del tutto le redirezioni.'
    ]
  },
  esperimento: {
    faremo: [
      'La shell riceve un comando echo. I controlli fissano la parola e la presenza di una redirezione. È prevista anche una variante difettosa, in cui il figlio apre il file e omette dup2.',
      'L’esperimento segue le due tabelle dei descrittori, della shell e del figlio, fino alla scrittura. È istruttivo osservare la destinazione della parola e il punto in cui compare il prompt.'
    ],
    vedrai: [
      ['tabella', 'Le tabelle dei descrittori', 'In alto: a sinistra quella della shell, a destra quella del figlio. «term.» sta per terminale, «file» per esito.txt.'],
      ['terminale', 'Le destinazioni', 'In basso: il contenuto del terminale, il contenuto del file, e l’operazione in corso nella shell.']
    ]
  },
  lab: {
    titolo: 'Dal comando alla scrittura',
    scena: { w: 860, h: 156 },
    atti: ['Il comando', 'La preparazione', 'La scrittura', 'Il ritorno'],
    controlli: [
      { id: 'caso', tipo: 'scelta', eti: 'Comando', opzioni: [['tty', 'echo PAROLA'], ['file', 'echo PAROLA > esito.txt'], ['senza', 'con >, e il figlio omette dup2']], valore: 'file' },
      { id: 'parola', tipo: 'scelta', eti: 'Parola', opzioni: [['ciao', 'ciao'], ['fatto', 'fatto']], valore: 'ciao' }
    ],
    nota: 'I passi sono quattro senza redirezione, sette con la redirezione completa, cinque nella variante difettosa.',
    previsione: {
      domanda: (p) => 'La shell esegue «echo ' + p.parola + (p.caso === 'tty' ? '' : ' > esito.txt') + '»' + (p.caso === 'senza' ? ', e tuttavia il figlio apre il file e avvia echo senza chiamare dup2' : '') + '. Dove è scritta la parola «' + p.parola + '»?',
      opzioni: () => [['tty', 'Sul terminale'], ['file', 'Nel file esito.txt'], ['due', 'In entrambi']]
    },
    confronto: (pred, esito, p) => { const N = { tty: 'sul terminale', file: 'nel file', due: 'in entrambi' }; return 'La previsione indicava: ' + N[pred] + '. La parola è scritta ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.caso === 'file' ? 'Dopo dup2 il descrittore 1 del figlio conduce soltanto al file.' : p.caso === 'senza' ? 'Senza dup2 il file è aperto sul descrittore 3, e echo scrive sul descrittore 1, rimasto sul terminale.' : 'Senza redirezione il figlio eredita il descrittore 1 della shell, che conduce al terminale.'); },
    costruisci(p) {
      const U = SL.unita522, passi = [], dest = U.DOVE[p.caso];
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, gap: 28 });
      const hud = (f) => [['fd 1 del figlio', f < 1 ? '·' : p.caso === 'file' && f >= 3 ? 'esito.txt' : 'terminale', 'a'], ['fd 1 della shell', 'terminale'], ['La parola', f >= 5 ? (dest === 'file' ? 'nel file' : 'sul terminale') : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Il comando', 'La shell legge la riga «echo ' + p.parola + (p.caso === 'tty' ? '»' : ' > esito.txt»') + '. I suoi descrittori 0, 1 e 2 conducono tutti al terminale.', {});
      P(1, 1, 'fork', 'La shell chiama fork. Il figlio eredita una copia della tabella dei descrittori: anche il suo descrittore 1 conduce al terminale. La shell si pone in attesa del termine del figlio.', {});
      if (p.caso !== 'tty') {
        P(2, 1, 'Il figlio apre il file', 'Il figlio, che esegue ancora codice della shell, apre esito.txt in scrittura. Il kernel gli assegna il primo descrittore libero, il 3.', { calc: 'open → fd 3' });
        if (p.caso === 'file') {
          P(3, 1, 'dup2(3, 1)', 'Il figlio chiama dup2 con gli argomenti 3 e 1. Il descrittore 1 lascia il terminale ed è collegato all’oggetto indicato dal 3, cioè al file. Ora due descrittori conducono a esito.txt.', { calc: 'fd 1 → esito.txt', chiedi: { d: 'Il descrittore 1 della shell è cambiato?', o: ['Sì, le tabelle sono collegate', 'No, il figlio ha modificato la propria copia'], g: 1, no: 'Dopo fork le due tabelle sono indipendenti. La shell scrive ancora sul terminale.' } });
          P(4, 1, 'Il figlio chiude il 3', 'Il descrittore 3 è ormai superfluo, e il figlio lo chiude. Il file resta aperto, poiché il descrittore 1 lo indica ancora.', { calc: 'close(3)' });
        }
      }
      P(5, 2, 'Il figlio carica echo', 'Il figlio carica il programma echo, che eredita la tabella nello stato in cui si trova. echo scrive «' + p.parola + '» sul descrittore 1, ignorandone la destinazione. ' + (dest === 'file' ? 'I byte giungono nel file esito.txt.' : p.caso === 'senza' ? 'Il descrittore 1 è rimasto sul terminale, dove compare la parola. Il file, aperto sul descrittore 3, resta vuoto.' : 'I byte giungono sul terminale.'), { calc: 'write(1, "' + p.parola + '")', esito: [dest === 'file' ? 'nel file' : 'sul terminale', ''] });
      P(6, 3, 'La shell riprende', 'echo termina, e la shell cessa l’attesa. Scrive il prompt sul proprio descrittore 1, rimasto sempre collegato al terminale.' + (dest === 'file' ? ' Sullo schermo compare soltanto il prompt.' : ''), { esito: [dest === 'file' ? 'nel file' : 'sul terminale', ''] });
      return { passi, esito: dest };
    }
  },
  bilancio: {
    regola: [
      'Per eseguire un comando la shell chiama fork, e il figlio carica il programma. La shell attende la fine del figlio.',
      'La redirezione avviene nel figlio, prima del caricamento del programma: il figlio apre il file, lo collega al descrittore 1 con dup2, e chiude il descrittore superfluo.'
    ],
    errori: [
      ['Ritenere che il programma sia informato della redirezione.', 'Il programma si limita a scrivere sul descrittore 1. Il collegamento è stato predisposto in precedenza.'],
      ['Attendersi che cambi anche l’uscita della shell.', 'Il figlio modifica la propria copia della tabella. Quella della shell resta invariata.'],
      ['Aprire il file e omettere dup2.', 'Il file risulta aperto sul descrittore 3, e il programma continua a scrivere sul terminale.']
    ],
    saFare: ['Porre in ordine le chiamate che eseguono un comando.', 'Seguire il descrittore 1 nel padre e nel figlio.', 'Indicare la destinazione dell’uscita di un comando rediretto.'],
    esercizi: [
      { d: 'Un processo ha aperti i descrittori 0, 1 e 2. Apre un file, e chiama quindi dup2 con il nuovo descrittore come primo argomento e 1 come secondo. Quale numero di descrittore ha ricevuto dall’apertura?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Il kernel assegna il più piccolo descrittore libero, e a 0, 1 e 2 segue il 3.',
        diagnosi: [
          { se: ['1', 'uno'], msg: 'Il descrittore 1 è già occupato dall’uscita standard.' },
          { se: ['4', 'quattro'], msg: 'Il primo numero libero dopo 0, 1 e 2 è il 3.' }
        ],
        altro: 'Il numero è diverso. Si determini il più piccolo descrittore non ancora impiegato.',
        indizi: ['Sono occupati 0, 1 e 2.', 'Il kernel assegna il più piccolo libero.', 'È il 3.'],
        svolgimento: ['Occupati: 0, 1, 2.', 'Primo libero: 3.'] },
      { d: 'Un comando è eseguito con «> esito.txt». Dove compare il prompt successivo della shell?', guida: 'Si scelga la risposta.', o: [
        { t: 'Sul terminale', ok: true, fb: 'La redirezione ha modificato la tabella del figlio. Quella della shell indica ancora il terminale.' },
        { t: 'Nel file esito.txt', fb: 'Nel file è scritta l’uscita del comando. La shell scrive con la propria tabella.' },
        { t: 'Da nessuna parte, finché il file resta aperto', fb: 'Il file era aperto nel figlio, che ha terminato.' }] },
      { d: 'Per quale ragione la redirezione è predisposta dopo fork e prima del caricamento del programma?', guida: 'Si scelga la risposta.', o: [
        { t: 'In tale intervallo il figlio esegue ancora codice della shell, e modifica soltanto la propria tabella', ok: true, fb: 'Prima di fork sarebbe modificata la tabella della shell. Dopo il caricamento il codice della shell non sarebbe più presente.' },
        { t: 'Il kernel vieta l’apertura di file prima di fork', fb: 'La shell potrebbe aprirli, e modificherebbe tuttavia la propria uscita.' },
        { t: 'Il programma caricato richiede tempo per l’avvio', fb: 'Il tempo è irrilevante. È rilevante il processo a cui appartiene la tabella modificata.' }] }
    ],
    sfida: ['cslez5_2_05_process_control', 'Fork condizionali e sequenze della shell']
  }
});
