'use strict';
SL.registra('3.5.3', {
  titolo: 'Conflitti dovuti alla sovrapposizione',
  obiettivo: 'Alla fine saprai riconoscere i tre tipi di conflitto che nascono dalla sovrapposizione delle istruzioni, e dire per ciascuno come reagisce la pipeline e quanti cicli vanno perduti.',
  concetti: [['conflitto', 'Tre ostacoli alla sovrapposizione'], ['pipeline', 'Trattenere oppure annullare'], ['bilancio', 'Il prezzo in cicli']],
  filigrana: ['conflitto', 'pipeline', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 3.5.2', t: 'Il diagramma ideale', d: 'Ogni istruzione avanza di uno stadio per ciclo: F, D, E, M, W.' },
      { sim: 'cpu', da: 'Dall’unità 3.4.1', t: 'La regola di SEQ', d: 'Ogni istruzione legge lo stato lasciato dalle precedenti, perché comincia quando quelle hanno finito.' },
      { sim: 'memory', da: 'Dall’unità 3.3.3', t: 'Quando arriva un dato caricato', d: 'In `mrmovq` la parola letta dalla memoria, valM, è disponibile soltanto alla fine della fase di memoria.' }
    ],
    domanda: { d: 'Prima di proseguire: in un flusso ideale, quando I1 si trova nello stadio M, in quale stadio si trova I2?', o: [
      { t: 'Nello stadio E', ok: true, fb: 'I2 è entrata un ciclo dopo I1, e la segue a un posto di distanza.' },
      { t: 'Nello stadio D', fb: 'In D si trova I3, entrata due cicli dopo I1.' },
      { t: 'Nello stadio W', fb: 'W viene dopo M, e I2 non può superare I1.' }
    ] }
  },
  idea: {
    titolo: 'Quando le istruzioni si disturbano',
    termini: ['conflitto sui dati', 'conflitto strutturale', 'conflitto di controllo', 'previsione dei salti', 'stallo', 'bolla'],
    testo: [
      'Il diagramma ideale presuppone istruzioni indipendenti. Nei programmi veri le istruzioni sono legate fra loro: una usa il risultato della precedente, due stadi vogliono lo stesso componente, un salto decide quale istruzione viene dopo. In SEQ questi legami erano innocui, perché ogni istruzione finiva prima che cominciasse la successiva. Nella pipeline le istruzioni si sovrappongono, e i legami diventano conflitti. Sono di tre tipi.',
      'Il [[conflitto sui dati]] nasce quando un’istruzione ha bisogno di un valore che un’istruzione precedente deve ancora produrre. L’esempio tipico è un carico seguito da un uso: `mrmovq` ottiene il dato soltanto alla fine dello stadio M, e l’istruzione che la segue lo vorrebbe un ciclo prima.',
      { fig: 'scena', w: 720, h: 190, titolo: 'Un carico seguito da un uso', nota: 'La addq resta in D per un ciclo in più, e in E avanza un posto vuoto.', els:
        SL.pipe.diagramma('g', [{ n: 'mrmovq', da: 1, s: ['F', 'D', 'E', 'M', 'W'] }, { n: 'addq', da: 2, s: ['F', 'D', 'D', 'E', 'M', 'W'], err: [4] }, { n: 'bolla', da: 4, s: ['○', '○', '○'] }, { n: 'successiva', da: 3, s: ['F', 'F', 'D', 'E', 'M', 'W'], err: [4] }], { x: 150, y: 4, passo: 68, cicli: 8, py: 38, h: 30 }) },
      'Il [[conflitto strutturale]] nasce quando due stadi chiedono nello stesso ciclo la stessa risorsa. Se istruzioni e dati stanno in una memoria con una sola porta, il prelievo dello stadio F e una lettura di dati dello stadio M non possono avvenire insieme.',
      'Il [[conflitto di controllo]] nasce dai salti condizionati. La condizione si conosce soltanto nello stadio E, mentre il prelievo delle istruzioni successive deve cominciare subito. Il processore sceglie una strada senza attendere, con una [[previsione dei salti]]. Nella nostra pipeline la previsione è sempre la stessa: il salto verrà eseguito, quindi si preleva dalla destinazione.',
      'I rimedi sono due. Lo [[stallo]] trattiene un’istruzione nel suo stadio per un ciclo in più, insieme a quelle che la seguono. Nello stadio rimasto scoperto avanza una [[bolla]], un posto vuoto che percorre gli stadi come un’istruzione senza modificare nulla. L’annullamento serve quando una previsione si rivela sbagliata, e trasforma in bolle le istruzioni entrate per errore. In tutti i casi il prezzo si misura in cicli perduti.'
    ]
  },
  esperimento: {
    faremo: [
      'Metteremo alla prova i tre conflitti, uno alla volta. Per ciascuno sceglierai fra due varianti dello stesso programma: quella in cui il conflitto si presenta e quella in cui manca.',
      'Sul diagramma vedremo in quale ciclo nasce il problema, come reagisce la pipeline e quanti cicli costa. Dopo il caso proposto, prova la variante senza conflitto. Poi passa al salto condizionato, che costa di più.'
    ],
    vedrai: [
      ['tabella', 'Il diagramma', 'In alto: le istruzioni coinvolte, con le attese e le bolle in evidenza.'],
      ['conflitto', 'La causa', 'In basso a sinistra: che cosa manca, e a chi.'],
      ['bilancio', 'Il costo', 'In basso a destra: la reazione della pipeline e i cicli perduti.']
    ]
  },
  lab: {
    titolo: 'Tre conflitti alla prova',
    scena: { w: 860, h: 312 },
    atti: ['Il programma', 'Il ciclo critico', 'La reazione', 'Il costo'],
    controlli: [
      { id: 'h', tipo: 'scelta', eti: 'Situazione', opzioni: [['dati', 'carico seguito da un uso'], ['porta', 'memoria con una sola porta'], ['salto', 'salto condizionato']], valore: 'dati' },
      { id: 'v', tipo: 'scelta', eti: 'Variante', opzioni: [['si', 'con il conflitto'], ['no', 'senza il conflitto']], valore: 'si' }
    ],
    nota: 'I passi sono sempre quattro. La previsione dei salti è fissa: il salto viene eseguito.',
    previsione: {
      domanda: (p) => SL.unita353.DOM[p.h][p.v] + ' Quanti cicli vanno perduti rispetto al flusso ideale?',
      opzioni: () => [[0, 'Nessuno'], [1, '1 ciclo'], [2, '2 cicli'], [3, '3 cicli']]
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + (pred === 0 ? 'nessun ciclo perduto' : pred + (pred === 1 ? ' ciclo perduto' : ' cicli perduti')) + '. I cicli perduti sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : SL.unita353.PERCHE[p.h][p.v]),
    costruisci(p) {
      const el = SL.el, U = SL.unita353, passi = [], S = U.SCENE[p.h][p.v], F5 = ['F', 'D', 'E', 'M', 'W'];
      const quadro = (o) => {
        const els = [el.nota('t0', 20, 0, 'CICLO', 'mono')];
        SL.pipe.diagramma('d', S.righe, { x: 190, y: 0, passo: 60, cicli: 9, py: 32, h: 26, fino: o.c, evid: o.evid }).forEach((e) => els.push(e));
        els.push(el.box('b1', 20, 208, 330, 92, 'che cosa succede', o.causa || '·', o.causa ? (S.perduti && o.fase >= 1 ? 'err' : 'on') : '', { cls: 'stretta' }),
          el.box('b2', 362, 208, 280, 92, 'reazione della pipeline', o.fase >= 2 ? S.reazione : '·', o.fase === 2 ? 'att' : o.fase > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('b3', 654, 208, 190, 92, 'cicli perduti', o.fase >= 3 ? String(S.perduti) : '·', o.fase >= 3 ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (o) => [['Situazione', U.BREVE[p.h], 'a'], ['Ciclo', String(o.evid || o.c)], ['Cicli perduti', o.fase >= 3 ? String(S.perduti) : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o), els: quadro(o) }, extra));

      P({ c: S.critico - 1, fase: 0 }, 0, 'Il programma', S.t[0], { chiedi: S.chiedi });
      P({ c: S.critico, evid: S.critico, fase: 1, causa: S.causa }, 1, S.titoli[0], S.t[1], { calc: S.calc[0] });
      P({ c: S.critico + 1, evid: S.critico + 1, fase: 2, causa: S.causa }, 2, S.titoli[1], S.t[2], { calc: S.calc[1] });
      P({ c: 9, fase: 3, causa: S.causa }, 3, S.perduti ? 'Il costo' : 'Nessun costo', S.t[3], { calc: 'cicli perduti: ' + S.perduti, esito: [S.perduti === 0 ? 'nessun ciclo perduto' : S.perduti + (S.perduti === 1 ? ' ciclo perduto' : ' cicli perduti'), S.perduti ? '' : 'si'] });
      return { passi, esito: S.perduti };
    }
  },
  bilancio: {
    regola: [
      'La sovrapposizione crea tre tipi di conflitto: sui dati, quando serve un valore non ancora prodotto; strutturale, quando due stadi chiedono la stessa risorsa; di controllo, quando un salto deve ancora decidere la strada.',
      'La pipeline reagisce trattenendo le istruzioni con uno stallo, oppure annullando quelle entrate per una previsione sbagliata. In entrambi i casi avanzano bolle, e si perdono cicli: uno per un carico seguito da un uso, due per una previsione sbagliata.'
    ],
    errori: [
      ['Pensare che una bolla sia un’istruzione che fa qualcosa.', 'Una bolla occupa uno stadio per ciclo e lascia intatti registri, memoria e codici di condizione.'],
      ['Fermare soltanto l’istruzione che attende.', 'Uno stallo trattiene anche le istruzioni che la seguono, altrimenti le finirebbero addosso.'],
      ['Credere che ogni salto costi due cicli.', 'I cicli si perdono soltanto quando la previsione è sbagliata. Con la previsione giusta il salto costa quanto ogni altra istruzione.']
    ],
    saFare: ['Riconosco un conflitto sui dati, strutturale e di controllo.', 'Disegno sul diagramma uno stallo con la sua bolla.', 'Dico quanti cicli costa ciascun conflitto.'],
    esercizi: [
      { d: 'Una `mrmovq` scrive in %rax, e l’istruzione che la segue immediatamente è `addq %rax, %rbx`. Di che tipo è il conflitto, e come reagisce la pipeline?', guida: 'Scegli la risposta.', o: [
        { t: 'Sui dati: la addq viene trattenuta per un ciclo', ok: true, fb: 'Il dato caricato arriva alla fine dello stadio M, un ciclo più tardi di quanto servirebbe alla addq.' },
        { t: 'Di controllo: la addq viene annullata', fb: 'Il conflitto di controllo riguarda i salti. Qui la addq va eseguita, e deve soltanto attendere il proprio operando.' },
        { t: 'Strutturale: la addq viene prelevata più tardi', fb: 'Il conflitto strutturale nasce da una risorsa contesa. Qui la addq attende un valore.' }] },
      { d: 'In un programma tre salti condizionati su dieci risultano previsti male. Ogni previsione sbagliata fa perdere due cicli. Quanti cicli perde il programma per i salti?', segnaposto: 'Un numero', giuste: ['6', 'sei'],
        ok: 'Tre previsioni sbagliate da due cicli ciascuna: 3 × 2 = 6.',
        diagnosi: [
          { se: ['20', 'venti'], msg: 'I cicli si perdono soltanto per le previsioni sbagliate, che sono tre. Gli altri sette salti non costano nulla in più.' },
          { se: ['3', 'tre'], msg: 'Ogni previsione sbagliata annulla due istruzioni, quindi costa due cicli.' },
          { se: ['14', 'quattordici'], msg: 'I sette salti previsti bene non fanno perdere cicli. Contano i tre previsti male.' }
        ],
        altro: 'Il numero è diverso. Moltiplica le previsioni sbagliate per i cicli che ciascuna fa perdere.',
        indizi: ['Le previsioni sbagliate sono 3.', 'Ciascuna costa 2 cicli.', '3 × 2.'],
        svolgimento: ['Previsioni sbagliate: 3.', 'Cicli per ciascuna: 2.', 'Cicli perduti: 3 × 2 = 6.'] }
    ],
    sfida: ['cslez3_5_03_random_assembly', 'Dipendenze di lettura dopo scrittura']
  }
});
SL.unita353 = (() => {
  const F5 = ['F', 'D', 'E', 'M', 'W'];
  const BREVE = { dati: 'carico e uso', porta: 'una sola porta', salto: 'salto' };
  const DOM = {
    dati: { si: 'Una `mrmovq` carica un valore in %rax. L’istruzione che la segue è `addq %rax, %rdx`, che usa proprio %rax.', no: 'Una `mrmovq` carica un valore in %rax. L’istruzione che la segue è `addq %rcx, %rdx`, che non usa %rax.' },
    porta: { si: 'Istruzioni e dati stanno in una memoria con una sola porta. La prima istruzione è una `mrmovq`, e nel ciclo in cui legge il proprio dato andrebbe prelevata la quarta istruzione.', no: 'Istruzioni e dati stanno in una memoria con una sola porta. Le prime istruzioni sono tutte `addq`, che non accedono ai dati.' },
    salto: { si: 'La pipeline prevede che un salto condizionato venga eseguito, e preleva due istruzioni dalla destinazione. Nello stadio E la condizione risulta falsa.', no: 'La pipeline prevede che un salto condizionato venga eseguito, e preleva due istruzioni dalla destinazione. Nello stadio E la condizione risulta vera.' }
  };
  const PERCHE = {
    dati: { si: 'Il dato caricato è pronto alla fine dello stadio M, un ciclo dopo il momento in cui la `addq` lo vorrebbe. La `addq` attende un ciclo in D.', no: 'La `addq` usa registri che la `mrmovq` non tocca, e può avanzare senza attendere.' },
    porta: { si: 'Nel ciclo 4 la porta serve la lettura dei dati, e il prelievo della quarta istruzione slitta di un ciclo.', no: 'Nessuna istruzione usa la porta per i dati, e il prelievo la trova sempre libera.' },
    salto: { si: 'Le due istruzioni prelevate dalla destinazione appartengono alla strada sbagliata. Vengono annullate, e i loro due cicli vanno perduti.', no: 'La previsione era giusta, e le due istruzioni prelevate dalla destinazione sono quelle che andavano eseguite.' }
  };
  const SCENE = {
    dati: {
      si: { critico: 4, perduti: 1, causa: 'la addq attende %rax', reazione: 'stallo e bolla',
        righe: [{ n: 'I1 mrmovq → %rax', da: 1, s: F5 }, { n: 'I2 addq %rax', da: 2, s: ['F', 'D', 'D', 'E', 'M', 'W'], err: [4] }, { n: 'bolla', da: 4, s: ['○', '○', '○'] }, { n: 'I3', da: 3, s: ['F', 'F', 'D', 'E', 'M', 'W'], err: [4] }],
        titoli: ['Il dato non è ancora arrivato', 'Uno stallo e una bolla'], calc: ['%rax pronto alla fine del ciclo 4', 'I2 resta in D · bolla in E'],
        chiedi: { d: 'I1 legge il dato dalla memoria nello stadio M, al ciclo 4. In un flusso ideale, in quale ciclo I2 userebbe quel dato nello stadio E?', o: ['Ciclo 3', 'Ciclo 4', 'Ciclo 5'], g: 1, no: 'I2 è entrata al ciclo 2: nel flusso ideale occupa E al ciclo 4, lo stesso ciclo in cui I1 sta ancora leggendo.' },
        t: ['I1 è una `mrmovq` che carica un valore in %rax. I2 è `addq %rax, %rdx`, che usa quel valore. Fino al ciclo 3 tutto procede come nel flusso ideale: I1 è in E, I2 in D, I3 in F.',
          'Al ciclo 4 I1 è nello stadio M e sta leggendo il dato, che sarà disponibile soltanto alla fine del ciclo. I2 dovrebbe entrare in E adesso, con un operando che ancora non esiste. La pipeline la trattiene in D, e trattiene I3 in F.',
          'Al ciclo 5 il dato è arrivato, e un collegamento diretto lo porta all’ingresso dell’ALU: l’unità 3.6.3 mostrerà come. I2 entra finalmente in E. Nel ciclo precedente lo stadio E era rimasto scoperto, e vi è entrata una bolla, che ora avanza in M.',
          'Lo stallo è durato un ciclo. I2 e I3 terminano un ciclo più tardi del previsto, e il flusso di tre istruzioni occupa 8 cicli al posto di 7. Un ciclo perduto per ogni carico seguito subito da un uso.'] },
      no: { critico: 4, perduti: 0, causa: 'la addq non usa %rax', reazione: 'nessuna',
        righe: [{ n: 'I1 mrmovq → %rax', da: 1, s: F5 }, { n: 'I2 addq %rcx', da: 2, s: F5 }, { n: 'I3', da: 3, s: F5 }],
        titoli: ['Nessuna dipendenza', 'Il flusso prosegue'], calc: ['I2 non dipende da I1', 'nessuno stallo'],
        chiedi: { d: 'I2 legge %rcx e %rdx. I1 scrive %rax. I2 deve attendere I1?', o: ['Sì', 'No'], g: 1, no: 'I2 non usa alcun valore prodotto da I1, quindi le due istruzioni sono indipendenti.' },
        t: ['I1 è una `mrmovq` che carica un valore in %rax. I2 è `addq %rcx, %rdx`, che legge altri due registri. Fino al ciclo 3 tutto procede come nel flusso ideale.',
          'Al ciclo 4 I1 è in M e I2 entra in E. I suoi operandi, %rcx e %rdx, erano pronti da prima, e nessuno li sta modificando. Non c’è alcun valore da attendere.',
          'Al ciclo 5 I1 scrive %rax nello stadio W, mentre I2 è già in M. Le due istruzioni non si sono mai incontrate sullo stesso registro.',
          'Nessun ciclo è andato perduto: tre istruzioni, 7 cicli, come nel flusso ideale. Lo stesso carico, seguito da un’istruzione diversa, non costa nulla.'] }
    },
    porta: {
      si: { critico: 4, perduti: 1, causa: 'M e F chiedono la porta', reazione: 'il prelievo attende',
        righe: [{ n: 'I1 mrmovq', da: 1, s: F5, err: [4] }, { n: 'I2', da: 2, s: F5 }, { n: 'I3', da: 3, s: F5 }, { n: 'I4', da: 4, s: ['…', 'F', 'D', 'E', 'M', 'W'], err: [4] }],
        titoli: ['Due richieste per una porta', 'Il prelievo slitta'], calc: ['ciclo 4: M e F sulla stessa porta', 'I4 prelevata al ciclo 5'],
        chiedi: { d: 'I1 è una `mrmovq` entrata al ciclo 1. In quale ciclo usa la memoria per leggere il proprio dato?', o: ['Ciclo 1', 'Ciclo 3', 'Ciclo 4'], g: 2, no: 'La lettura dei dati avviene nello stadio M, che I1 occupa al ciclo 4.' },
          t: ['In questa macchina istruzioni e dati stanno nella stessa memoria, che ha una sola porta: può servire un solo accesso per ciclo. Ogni prelievo la usa. Nei cicli 1, 2 e 3 la usano soltanto i prelievi, e non c’è contesa.',
          'Al ciclo 4 I1 è nello stadio M e chiede la porta per leggere il proprio dato. Nello stesso ciclo lo stadio F la chiede per prelevare I4. Le richieste sono due, e la porta è una.',
          'La pipeline dà la precedenza all’istruzione più avanti, I1, e il prelievo attende. I4 entra in F al ciclo 5, con un ciclo di ritardo. Le istruzioni I2 e I3, già entrate, proseguono senza fermarsi.',
          'Un ciclo perduto, e la causa sta nella macchina, che ha una risorsa in meno del necessario. I valori elaborati dalle istruzioni sono estranei al problema. Per questo i processori tengono separate la memoria delle istruzioni e quella dei dati, o almeno le loro porte.'] },
      no: { critico: 4, perduti: 0, causa: 'soltanto F usa la porta', reazione: 'nessuna',
        righe: [{ n: 'I1 addq', da: 1, s: F5 }, { n: 'I2', da: 2, s: F5 }, { n: 'I3', da: 3, s: F5 }, { n: 'I4', da: 4, s: F5 }],
        titoli: ['Una sola richiesta', 'Il flusso prosegue'], calc: ['ciclo 4: soltanto F chiede la porta', 'nessuna attesa'],
        chiedi: { d: 'I1 è una `addq`. Nello stadio M ha bisogno della memoria dei dati?', o: ['Sì', 'No'], g: 1, no: 'Una `addq` lavora soltanto sui registri, e attraversa lo stadio M senza usarlo.' },
        t: ['Istruzioni e dati stanno nella stessa memoria, che ha una sola porta. Le istruzioni di questo tratto sono tutte `addq`, che non accedono ai dati.',
          'Al ciclo 4 I1 è nello stadio M, ma non ha nulla da chiedere alla memoria. L’unica richiesta è quella dello stadio F, che preleva I4.',
          'I4 entra in F al ciclo 4, in orario. Lo stesso accade nei cicli seguenti, finché nessuna istruzione accede ai dati.',
          'Nessun ciclo perduto. Il conflitto strutturale compare soltanto quando due stadi vogliono la stessa risorsa nello stesso ciclo.'] }
    },
    salto: {
      si: { critico: 3, perduti: 2, causa: 'previsione sbagliata', reazione: 'due annullamenti',
        righe: [{ n: 'I1 jne dest', da: 1, s: F5, err: [3] }, { n: 'dest', da: 2, s: ['F', 'D', '○', '○', '○'], err: [3] }, { n: 'dest + 1', da: 3, s: ['F', '○', '○', '○', '○'], err: [3] }, { n: 'I2', da: 4, s: F5 }],
        titoli: ['La condizione è falsa', 'Due istruzioni annullate'], calc: ['ciclo 3: la previsione era sbagliata', 'due bolle · prelievo da I2'],
        chiedi: { d: 'Il salto I1 entra al ciclo 1. In quale ciclo lo stadio E ne valuta la condizione?', o: ['Ciclo 2', 'Ciclo 3', 'Ciclo 4'], g: 1, no: 'I1 occupa F al ciclo 1, D al ciclo 2 ed E al ciclo 3.' },
        t: ['I1 è un salto condizionato. La pipeline non conosce ancora la condizione, e prevede che il salto venga eseguito. Al ciclo 2 preleva l’istruzione che sta alla destinazione.',
          'Al ciclo 3 I1 è nello stadio E, dove la condizione viene finalmente valutata: è falsa, il salto non va eseguito. Intanto la pipeline ha prelevato due istruzioni dalla destinazione, una ora in D e una in F. Appartengono alla strada sbagliata.',
          'Al ciclo 4 le due istruzioni vengono annullate: diventano bolle, e non scriveranno nulla. Il prelievo riparte dall’istruzione giusta, I2, quella che segue il salto in memoria. Nessuna delle due istruzioni annullate aveva ancora modificato lo stato, e per questo l’annullamento è possibile.',
          'Due cicli perduti: quelli spesi a prelevare le due istruzioni sbagliate. I2 entra al ciclo 4, mentre con una previsione giusta sarebbe entrata al ciclo 2.'] },
      no: { critico: 3, perduti: 0, causa: 'previsione giusta', reazione: 'nessuna',
        righe: [{ n: 'I1 jne dest', da: 1, s: F5 }, { n: 'dest', da: 2, s: F5 }, { n: 'dest + 1', da: 3, s: F5 }, { n: 'dest + 2', da: 4, s: F5 }],
        titoli: ['La condizione è vera', 'Il flusso prosegue'], calc: ['ciclo 3: la previsione era giusta', 'nessun annullamento'],
        chiedi: { d: 'Il salto I1 entra al ciclo 1. In quale ciclo lo stadio E ne valuta la condizione?', o: ['Ciclo 2', 'Ciclo 3', 'Ciclo 4'], g: 1, no: 'I1 occupa F al ciclo 1, D al ciclo 2 ed E al ciclo 3.' },
        t: ['I1 è un salto condizionato. La pipeline prevede che venga eseguito, e al ciclo 2 preleva l’istruzione che sta alla destinazione.',
          'Al ciclo 3 I1 è nello stadio E, e la condizione risulta vera: il salto va eseguito. Le due istruzioni prelevate dalla destinazione sono proprio quelle che servivano.',
          'Al ciclo 4 il prelievo continua lungo la stessa strada, e nulla viene annullato. Il salto ha attraversato la pipeline come qualunque altra istruzione.',
          'Nessun ciclo perduto. Un salto costa soltanto quando la previsione sbaglia, e per questo conviene prevedere bene.'] }
    }
  };
  return { BREVE, DOM, PERCHE, SCENE };
})();
