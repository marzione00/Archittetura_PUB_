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
  obiettivo: 'Obiettivo: ricostruire che cosa fa la shell per eseguire un comando, e come riesce a deviare la sua uscita in un file senza che il comando lo sappia.',
  concetti: [['terminale', 'La shell crea un figlio'], ['tabella', 'Il figlio sistema i descrittori'], ['file', 'Il comando scrive dove ha sempre scritto']],
  filigrana: ['terminale', 'fork', 'file'],
  richiami: {
    carte: [
      { sim: 'fork', da: 'Dall’unità 5.2.1', t: 'fork', d: 'Il figlio è una copia del padre, e ne eredita anche i file aperti.' },
      { sim: 'file', da: 'Dall’unità 2.5.3', t: 'Il descrittore di file', d: 'Un piccolo intero che indica un file aperto. Il numero 1 è l’uscita standard.' },
      { sim: 'terminale', da: 'Dall’unità 1.1.6', t: 'La redirezione', d: 'Il segno > manda in un file ciò che il comando scriverebbe sul terminale.' }
    ],
    domanda: { d: 'Prima di proseguire: un programma scrive sempre sul descrittore 1. Da che cosa dipende il luogo in cui finiscono i byte?', o: [
      { t: 'Da ciò a cui il descrittore 1 è collegato in quel processo', ok: true, fb: 'Il numero è fisso. Il collegamento sta nella tabella dei descrittori del processo.' },
      { t: 'Dal programma, che sceglie la destinazione', fb: 'Il programma conosce soltanto il numero 1.' },
      { t: 'Dal terminale, che decide se accettarli', fb: 'Il terminale è una delle destinazioni possibili, e non sceglie nulla.' }
    ] }
  },
  idea: {
    titolo: 'La shell prepara, il comando scrive',
    termini: ['dup2'],
    testo: [
      'Quando scrivi «echo ciao» nel terminale, a leggere il comando è la shell. La shell però non esegue echo al proprio interno. Chiama fork e crea un figlio, e sarà il figlio a trasformarsi nel programma echo. La shell resta in attesa che il figlio finisca, e poi mostra di nuovo l’invito a scrivere, il prompt. Il figlio ha ereditato la tabella dei descrittori della shell, e il suo descrittore 1 conduce al terminale: la parola compare lì.',
      'Con «echo ciao > esito.txt» la parola deve finire in un file. Il programma echo è lo stesso di prima, e continua a scrivere sul descrittore 1. A cambiare è il collegamento, e lo cambia il figlio, nell’intervallo fra fork e l’avvio del programma. Prima apre esito.txt, e riceve il primo descrittore libero, il 3. Poi chiama [[dup2]] con gli argomenti 3 e 1: la chiamata fa sì che anche il descrittore 1 indichi ciò che indica il 3, cioè il file. Infine chiude il 3, che non serve più.',
      { fig: 'scena', w: 720, h: 156, titolo: 'echo ciao > esito.txt, un attimo prima di avviare echo', nota: 'Nel figlio il descrittore 1 conduce al file esito.txt. Nella shell conduce ancora al terminale, abbreviato «term.».', els: SL.unita522.quadro('g', { caso: 'file', parola: 'ciao' }, 4, { x: 10, y: 0, w: 700, gap: 20 }) },
      'A questo punto il figlio carica echo. Il nuovo programma eredita la tabella così come l’ha trovata, scrive «ciao» sul descrittore 1, e la parola arriva nel file. La tabella della shell è rimasta intatta: il prompt successivo compare sul terminale, come sempre.',
      'È il motivo per cui fork e l’avvio del programma sono due chiamate distinte. Nell’intervallo fra le due il figlio è ancora codice della shell, e può sistemare l’ambiente per il programma che verrà: descrittori, cartella di lavoro, permessi. Il programma non deve sapere nulla di redirezioni.'
    ]
  },
  esperimento: {
    faremo: [
      'La shell riceve un comando echo. Sceglierai la parola, e se il comando ha una redirezione. C’è anche una variante difettosa, in cui il figlio apre il file e dimentica dup2.',
      'Seguiremo le due tabelle dei descrittori, della shell e del figlio, fino alla scrittura. Guarda dove finisce la parola e dove compare il prompt.'
    ],
    vedrai: [
      ['tabella', 'Le tabelle dei descrittori', 'In alto: a sinistra quella della shell, a destra quella del figlio. «term.» sta per terminale, «file» per esito.txt.'],
      ['terminale', 'Le destinazioni', 'In basso: ciò che compare sul terminale, il contenuto del file, e che cosa sta facendo la shell.']
    ]
  },
  lab: {
    titolo: 'Dal comando alla scrittura',
    scena: { w: 860, h: 156 },
    atti: ['Il comando', 'La preparazione', 'La scrittura', 'Il ritorno'],
    controlli: [
      { id: 'caso', tipo: 'scelta', eti: 'Comando', opzioni: [['tty', 'echo PAROLA'], ['file', 'echo PAROLA > esito.txt'], ['senza', 'con >, ma il figlio dimentica dup2']], valore: 'file' },
      { id: 'parola', tipo: 'scelta', eti: 'Parola', opzioni: [['ciao', 'ciao'], ['fatto', 'fatto']], valore: 'ciao' }
    ],
    nota: 'I passi sono quattro senza redirezione, sette con la redirezione completa, cinque nella variante difettosa.',
    previsione: {
      domanda: (p) => 'La shell esegue «echo ' + p.parola + (p.caso === 'tty' ? '' : ' > esito.txt') + '»' + (p.caso === 'senza' ? ', ma il figlio apre il file e avvia echo senza chiamare dup2' : '') + '. Dove finisce la parola «' + p.parola + '»?',
      opzioni: () => [['tty', 'Sul terminale'], ['file', 'Nel file esito.txt'], ['due', 'In entrambi']]
    },
    confronto: (pred, esito, p) => { const N = { tty: 'sul terminale', file: 'nel file', due: 'in entrambi' }; return 'La previsione indicava: ' + N[pred] + '. La parola finisce ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.caso === 'file' ? 'Dopo dup2 il descrittore 1 del figlio conduce soltanto al file.' : p.caso === 'senza' ? 'Senza dup2 il file è aperto sul descrittore 3, e echo scrive sul descrittore 1, rimasto sul terminale.' : 'Senza redirezione il figlio eredita il descrittore 1 della shell, che conduce al terminale.'); },
    costruisci(p) {
      const U = SL.unita522, passi = [], dest = U.DOVE[p.caso];
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, gap: 28 });
      const hud = (f) => [['fd 1 del figlio', f < 1 ? '·' : p.caso === 'file' && f >= 3 ? 'esito.txt' : 'terminale', 'a'], ['fd 1 della shell', 'terminale'], ['La parola', f >= 5 ? (dest === 'file' ? 'nel file' : 'sul terminale') : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Il comando', 'La shell legge la riga «echo ' + p.parola + (p.caso === 'tty' ? '»' : ' > esito.txt»') + '. I suoi descrittori 0, 1 e 2 conducono tutti al terminale.', {});
      P(1, 1, 'fork', 'La shell chiama fork. Il figlio eredita una copia della tabella dei descrittori: anche il suo descrittore 1 conduce al terminale. La shell si mette in attesa che il figlio finisca.', {});
      if (p.caso !== 'tty') {
        P(2, 1, 'Il figlio apre il file', 'Il figlio, che è ancora codice della shell, apre esito.txt in scrittura. Il kernel gli assegna il primo descrittore libero, il 3.', { calc: 'open → fd 3' });
        if (p.caso === 'file') {
          P(3, 1, 'dup2(3, 1)', 'Il figlio chiama dup2 con gli argomenti 3 e 1. Il descrittore 1 lascia il terminale e viene collegato a ciò che indica il 3: il file. Ora due descrittori conducono a esito.txt.', { calc: 'fd 1 → esito.txt', chiedi: { d: 'Il descrittore 1 della shell è cambiato?', o: ['Sì: le tabelle sono collegate', 'No: il figlio ha modificato la propria copia'], g: 1, no: 'Dopo fork le due tabelle sono indipendenti. La shell scrive ancora sul terminale.' } });
          P(4, 1, 'Il figlio chiude il 3', 'Il descrittore 3 non serve più, e il figlio lo chiude. Il file resta aperto, perché il descrittore 1 lo indica ancora.', { calc: 'close(3)' });
        }
      }
      P(5, 2, 'Il figlio diventa echo', 'Il figlio carica il programma echo, che eredita la tabella così com’è. echo scrive «' + p.parola + '» sul descrittore 1, senza sapere dove conduca. ' + (dest === 'file' ? 'I byte arrivano nel file esito.txt.' : p.caso === 'senza' ? 'Il descrittore 1 è rimasto sul terminale, e la parola compare lì. Il file, aperto sul descrittore 3, resta vuoto.' : 'I byte arrivano sul terminale.'), { calc: 'write(1, "' + p.parola + '")', esito: [dest === 'file' ? 'nel file' : 'sul terminale', ''] });
      P(6, 3, 'La shell riprende', 'echo termina, e la shell smette di attendere. Scrive il prompt sul proprio descrittore 1, che non ha mai lasciato il terminale.' + (dest === 'file' ? ' Sullo schermo compare soltanto il prompt.' : ''), { esito: [dest === 'file' ? 'nel file' : 'sul terminale', ''] });
      return { passi, esito: dest };
    }
  },
  bilancio: {
    regola: [
      'Per eseguire un comando la shell chiama fork, e il figlio carica il programma. La shell attende la fine del figlio.',
      'La redirezione avviene nel figlio, prima di caricare il programma: apre il file, lo collega al descrittore 1 con dup2, chiude il descrittore di troppo.'
    ],
    errori: [
      ['Pensare che il programma sappia della redirezione.', 'Il programma scrive sul descrittore 1 e basta. Il collegamento è stato preparato prima.'],
      ['Aspettarsi che cambi anche l’uscita della shell.', 'Il figlio modifica la propria copia della tabella. Quella della shell resta intatta.'],
      ['Aprire il file e dimenticare dup2.', 'Il file risulta aperto sul descrittore 3, e il programma continua a scrivere sul terminale.']
    ],
    saFare: ['Porre in ordine le chiamate che eseguono un comando.', 'Seguire il descrittore 1 nel padre e nel figlio.', 'Spiegare dove finisce l’uscita di un comando rediretto.'],
    esercizi: [
      { d: 'Un processo ha aperti i descrittori 0, 1 e 2. Apre un file, e poi chiama dup2 con il nuovo descrittore come primo argomento e 1 come secondo. Quale numero di descrittore ha ricevuto dalla apertura?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Il kernel assegna il più piccolo descrittore libero, e dopo 0, 1 e 2 viene il 3.',
        diagnosi: [
          { se: ['1', 'uno'], msg: 'Il descrittore 1 è già occupato dall’uscita standard.' },
          { se: ['4', 'quattro'], msg: 'Il primo numero libero dopo 0, 1 e 2 è il 3.' }
        ],
        altro: 'Il numero è diverso. Cerca il più piccolo descrittore non ancora in uso.',
        indizi: ['Sono occupati 0, 1 e 2.', 'Il kernel sceglie il più piccolo libero.', 'È il 3.'],
        svolgimento: ['Occupati: 0, 1, 2.', 'Primo libero: 3.'] },
      { d: 'Un comando viene eseguito con «> esito.txt». Dove compare il prompt successivo della shell?', guida: 'Si scelga la risposta.', o: [
        { t: 'Sul terminale', ok: true, fb: 'La redirezione ha cambiato la tabella del figlio. Quella della shell indica ancora il terminale.' },
        { t: 'Nel file esito.txt', fb: 'Nel file finisce l’uscita del comando. La shell scrive con la propria tabella.' },
        { t: 'Da nessuna parte, finché il file resta aperto', fb: 'Il file era aperto nel figlio, che ha terminato.' }] },
      { d: 'Perché la redirezione viene preparata dopo fork e prima di caricare il programma?', guida: 'Si scelga la risposta.', o: [
        { t: 'Perché in quel momento il figlio è ancora codice della shell, e modifica soltanto la propria tabella', ok: true, fb: 'Prima di fork cambierebbe la tabella della shell. Dopo il caricamento non ci sarebbe più codice della shell a farlo.' },
        { t: 'Perché il kernel vieta di aprire file prima di fork', fb: 'La shell potrebbe aprirli, ma cambierebbe la propria uscita.' },
        { t: 'Perché il programma caricato ha bisogno di tempo per partire', fb: 'Il tempo non c’entra. Conta di chi è la tabella modificata.' }] }
    ],
    sfida: ['cslez5_2_05_process_control', 'Fork condizionali e sequenze della shell']
  }
});
