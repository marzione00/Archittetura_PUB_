'use strict';
SL.registra('3.5.3', {
  titolo: 'Conflitti dovuti alla sovrapposizione',
  obiettivo: 'Obiettivo: riconoscere i tre tipi di conflitto che derivano dalla sovrapposizione delle istruzioni, e indicare per ciascuno la reazione della pipeline e il numero di cicli perduti.',
  concetti: [['conflitto', 'Tre ostacoli alla sovrapposizione'], ['pipeline', 'Trattenere oppure annullare'], ['bilancio', 'Il costo in cicli']],
  filigrana: ['conflitto', 'pipeline', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 3.5.2', t: 'Il diagramma ideale', d: 'Ogni istruzione avanza di uno stadio per ciclo: F, D, E, M, W.' },
      { sim: 'cpu', da: 'Dall’unità 3.4.1', t: 'La regola di SEQ', d: 'Ogni istruzione legge lo stato lasciato dalle precedenti, poiché ha inizio quando quelle sono completate.' },
      { sim: 'memory', da: 'Dall’unità 3.3.3', t: 'La disponibilità di un dato caricato', d: 'In `mrmovq` la parola letta dalla memoria, valM, è disponibile soltanto alla fine della fase di memoria.' }
    ],
    domanda: { d: 'Prima di proseguire: in un flusso ideale, quando I1 si trova nello stadio M, in quale stadio si trova I2?', o: [
      { t: 'Nello stadio E', ok: true, fb: 'I2 è entrata un ciclo dopo I1, e la segue a una posizione di distanza.' },
      { t: 'Nello stadio D', fb: 'In D si trova I3, entrata due cicli dopo I1.' },
      { t: 'Nello stadio W', fb: 'W segue M, e I2 non può superare I1.' }
    ] }
  },
  idea: {
    titolo: 'Le interferenze fra istruzioni',
    termini: ['conflitto sui dati', 'conflitto strutturale', 'conflitto di controllo', 'previsione dei salti', 'stallo', 'bolla'],
    testo: [
      'Il diagramma ideale presuppone istruzioni indipendenti. Nei programmi reali le istruzioni sono legate fra loro: una impiega il risultato della precedente, due stadi richiedono il medesimo componente, un salto determina l’istruzione successiva. In SEQ tali legami erano privi di effetti, poiché ogni istruzione era completata prima dell’inizio della successiva. Nella pipeline le istruzioni si sovrappongono, e i legami divengono conflitti, di tre tipi.',
      'Il [[conflitto sui dati]] si presenta quando un’istruzione richiede un valore che un’istruzione precedente deve ancora produrre. L’esempio tipico è un carico seguito da un uso: `mrmovq` ottiene il dato soltanto alla fine dello stadio M, e l’istruzione successiva lo richiederebbe un ciclo prima.',
      { fig: 'scena', w: 720, h: 190, titolo: 'Un carico seguito da un uso', nota: 'La addq resta in D per un ciclo in più, e in E avanza una posizione vuota.', els:
        SL.pipe.diagramma('g', [{ n: 'mrmovq', da: 1, s: ['F', 'D', 'E', 'M', 'W'] }, { n: 'addq', da: 2, s: ['F', 'D', 'D', 'E', 'M', 'W'], err: [4] }, { n: 'bolla', da: 4, s: ['○', '○', '○'] }, { n: 'successiva', da: 3, s: ['F', 'F', 'D', 'E', 'M', 'W'], err: [4] }], { x: 150, y: 4, passo: 68, cicli: 8, py: 38, h: 30 }) },
      'Il [[conflitto strutturale]] si presenta quando due stadi richiedono nel medesimo ciclo la medesima risorsa. Se istruzioni e dati risiedono in una memoria con una sola porta, il prelievo dello stadio F e una lettura di dati dello stadio M non possono avvenire contemporaneamente.',
      'Il [[conflitto di controllo]] deriva dai salti condizionati. La condizione è nota soltanto nello stadio E, mentre il prelievo delle istruzioni successive deve iniziare immediatamente. Il processore seleziona un percorso senza attendere, mediante una [[previsione dei salti]]. Nella pipeline qui considerata la previsione è sempre la medesima: si assume che il salto avvenga, e il prelievo prosegue dalla destinazione.',
      'I rimedi sono due. Lo [[stallo]] trattiene un’istruzione nel suo stadio per un ciclo in più, insieme a quelle che la seguono. Nello stadio rimasto libero avanza una [[bolla]], una posizione vuota che percorre gli stadi come un’istruzione senza modificare lo stato. L’annullamento interviene quando una previsione si rivela errata, e trasforma in bolle le istruzioni entrate per errore. In tutti i casi il costo si misura in cicli perduti.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento esamina i tre conflitti, uno alla volta. Per ciascuno i controlli propongono due varianti del medesimo programma: quella in cui il conflitto si presenta e quella in cui è assente.',
      'Il diagramma mostra in quale ciclo si presenta il problema, la reazione della pipeline e il costo in cicli. Dopo il caso proposto, è istruttivo esaminare la variante senza conflitto e poi il salto condizionato, che ha il costo maggiore.'
    ],
    vedrai: [
      ['tabella', 'Il diagramma', 'In alto: le istruzioni coinvolte, con le attese e le bolle in evidenza.'],
      ['conflitto', 'La causa', 'In basso a sinistra: che cosa manca, e a quale istruzione.'],
      ['bilancio', 'Il costo', 'In basso a destra: la reazione della pipeline e i cicli perduti.']
    ]
  },
  lab: {
    titolo: 'Tre conflitti a confronto',
    scena: { w: 860, h: 312 },
    atti: ['Il programma', 'Il ciclo critico', 'La reazione', 'Il costo'],
    controlli: [
      { id: 'h', tipo: 'scelta', eti: 'Situazione', opzioni: [['dati', 'carico seguito da un uso'], ['porta', 'memoria con una sola porta'], ['salto', 'salto condizionato']], valore: 'dati' },
      { id: 'v', tipo: 'scelta', eti: 'Variante', opzioni: [['si', 'con il conflitto'], ['no', 'senza il conflitto']], valore: 'si' }
    ],
    nota: 'I passi sono sempre quattro. La previsione dei salti è fissa: si assume che il salto avvenga.',
    previsione: {
      domanda: (p) => SL.unita353.DOM[p.h][p.v] + ' Quanti cicli vanno perduti rispetto al flusso ideale?',
      opzioni: () => [[0, 'Nessuno'], [1, '1 ciclo'], [2, '2 cicli'], [3, '3 cicli']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + (pred === 0 ? 'nessun ciclo perduto' : pred + (pred === 1 ? ' ciclo perduto' : ' cicli perduti')) + '. I cicli perduti sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : SL.unita353.PERCHE[p.h][p.v]),
    costruisci(p) {
      const el = SL.el, U = SL.unita353, passi = [], S = U.SCENE[p.h][p.v], F5 = ['F', 'D', 'E', 'M', 'W'];
      const quadro = (o) => {
        const els = [el.nota('t0', 20, 0, 'CICLO', 'mono')];
        SL.pipe.diagramma('d', S.righe, { x: 190, y: 0, passo: 60, cicli: 9, py: 32, h: 26, fino: o.c, evid: o.evid }).forEach((e) => els.push(e));
        els.push(el.box('b1', 20, 208, 330, 92, 'che cosa accade', o.causa || '·', o.causa ? (S.perduti && o.fase >= 1 ? 'err' : 'on') : '', { cls: 'stretta' }),
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
      'La sovrapposizione produce tre tipi di conflitto: sui dati, quando occorre un valore non ancora prodotto; strutturale, quando due stadi richiedono la medesima risorsa; di controllo, quando l’esito di un salto è ancora ignoto.',
      'La pipeline reagisce trattenendo le istruzioni con uno stallo, oppure annullando quelle entrate per una previsione errata. In entrambi i casi avanzano bolle, e si perdono cicli: uno per un carico seguito da un uso, due per una previsione errata.'
    ],
    errori: [
      ['Ritenere che una bolla sia un’istruzione dotata di effetti.', 'Una bolla occupa uno stadio per ciclo e lascia invariati registri, memoria e codici di condizione.'],
      ['Trattenere soltanto l’istruzione che attende.', 'Uno stallo trattiene anche le istruzioni che la seguono; in caso contrario esse occuperebbero il suo stadio.'],
      ['Ritenere che ogni salto costi due cicli.', 'I cicli si perdono soltanto quando la previsione è errata. Con una previsione corretta il salto ha il costo di ogni altra istruzione.']
    ],
    saFare: ['Riconoscere un conflitto sui dati, strutturale e di controllo.', 'Disegnare sul diagramma uno stallo con la sua bolla.', 'Indicare quanti cicli costa ciascun conflitto.'],
    esercizi: [
      { d: 'Una `mrmovq` scrive in %rax, e l’istruzione immediatamente successiva è `addq %rax, %rbx`. Di quale tipo è il conflitto, e come reagisce la pipeline?', guida: 'Si scelga la risposta.', o: [
        { t: 'Sui dati: la addq è trattenuta per un ciclo', ok: true, fb: 'Il dato caricato è disponibile alla fine dello stadio M, un ciclo più tardi di quanto richiesto dalla addq.' },
        { t: 'Di controllo: la addq è annullata', fb: 'Il conflitto di controllo riguarda i salti. In questo caso la addq va eseguita, e deve soltanto attendere il proprio operando.' },
        { t: 'Strutturale: la addq è prelevata più tardi', fb: 'Il conflitto strutturale deriva da una risorsa contesa. In questo caso la addq attende un valore.' }] },
      { d: 'In un programma tre salti condizionati su dieci hanno una previsione errata. Ogni previsione errata comporta la perdita di due cicli. Quanti cicli perde il programma a causa dei salti?', segnaposto: 'Un numero', giuste: ['6', 'sei'],
        ok: 'Tre previsioni errate da due cicli ciascuna: 3 × 2 = 6.',
        diagnosi: [
          { se: ['20', 'venti'], msg: 'I cicli si perdono soltanto per le previsioni errate, che sono tre. Gli altri sette salti sono privi di costo aggiuntivo.' },
          { se: ['3', 'tre'], msg: 'Ogni previsione errata annulla due istruzioni, quindi costa due cicli.' },
          { se: ['14', 'quattordici'], msg: 'I sette salti con previsione corretta sono privi di cicli perduti; sono rilevanti i tre con previsione errata.' }
        ],
        altro: 'Il numero è diverso. Si moltiplichino le previsioni errate per i cicli perduti con ciascuna.',
        indizi: ['Le previsioni errate sono 3.', 'Ciascuna costa 2 cicli.', '3 × 2.'],
        svolgimento: ['Previsioni errate: 3.', 'Cicli per ciascuna: 2.', 'Cicli perduti: 3 × 2 = 6.'] }
    ],
    sfida: ['cslez3_5_03_random_assembly', 'Dipendenze di lettura dopo scrittura']
  }
});
SL.unita353 = (() => {
  const F5 = ['F', 'D', 'E', 'M', 'W'];
  const BREVE = { dati: 'carico e uso', porta: 'una sola porta', salto: 'salto' };
  const DOM = {
    dati: { si: 'Una `mrmovq` carica un valore in %rax. L’istruzione successiva è `addq %rax, %rdx`, che impiega %rax.', no: 'Una `mrmovq` carica un valore in %rax. L’istruzione successiva è `addq %rcx, %rdx`, che non impiega %rax.' },
    porta: { si: 'Istruzioni e dati risiedono in una memoria con una sola porta. La prima istruzione è una `mrmovq`, e nel ciclo in cui essa legge il proprio dato andrebbe prelevata la quarta istruzione.', no: 'Istruzioni e dati risiedono in una memoria con una sola porta. Le prime istruzioni sono tutte `addq`, prive di accessi ai dati.' },
    salto: { si: 'La pipeline prevede che un salto condizionato avvenga, e preleva due istruzioni dalla destinazione. Nello stadio E la condizione risulta falsa.', no: 'La pipeline prevede che un salto condizionato avvenga, e preleva due istruzioni dalla destinazione. Nello stadio E la condizione risulta vera.' }
  };
  const PERCHE = {
    dati: { si: 'Il dato caricato è disponibile alla fine dello stadio M, un ciclo dopo l’istante in cui la `addq` lo richiederebbe. La `addq` attende un ciclo in D.', no: 'La `addq` impiega registri che la `mrmovq` lascia invariati, e può avanzare senza attendere.' },
    porta: { si: 'Nel ciclo 4 la porta serve la lettura dei dati, e il prelievo della quarta istruzione è rinviato di un ciclo.', no: 'Nessuna istruzione impiega la porta per i dati, e il prelievo la trova sempre libera.' },
    salto: { si: 'Le due istruzioni prelevate dalla destinazione appartengono al percorso errato. Esse sono annullate, e i loro due cicli vanno perduti.', no: 'La previsione era corretta, e le due istruzioni prelevate dalla destinazione sono quelle da eseguire.' }
  };
  const SCENE = {
    dati: {
      si: { critico: 4, perduti: 1, causa: 'la addq attende %rax', reazione: 'stallo e bolla',
        righe: [{ n: 'I1 mrmovq → %rax', da: 1, s: F5 }, { n: 'I2 addq %rax', da: 2, s: ['F', 'D', 'D', 'E', 'M', 'W'], err: [4] }, { n: 'bolla', da: 4, s: ['○', '○', '○'] }, { n: 'I3', da: 3, s: ['F', 'F', 'D', 'E', 'M', 'W'], err: [4] }],
        titoli: ['Il dato non è ancora disponibile', 'Uno stallo e una bolla'], calc: ['%rax disponibile alla fine del ciclo 4', 'I2 resta in D · bolla in E'],
        chiedi: { d: 'I1 legge il dato dalla memoria nello stadio M, al ciclo 4. In un flusso ideale, in quale ciclo I2 userebbe quel dato nello stadio E?', o: ['Ciclo 3', 'Ciclo 4', 'Ciclo 5'], g: 1, no: 'I2 è entrata al ciclo 2: nel flusso ideale occupa E al ciclo 4, il medesimo ciclo in cui I1 sta ancora leggendo.' },
        t: ['I1 è una `mrmovq` che carica un valore in %rax. I2 è `addq %rax, %rdx`, che impiega quel valore. Fino al ciclo 3 il flusso coincide con quello ideale: I1 è in E, I2 in D, I3 in F.',
          'Al ciclo 4 I1 è nello stadio M e sta leggendo il dato, che sarà disponibile soltanto alla fine del ciclo. I2 dovrebbe entrare in E in questo ciclo, con un operando non ancora disponibile. La pipeline la trattiene in D, e trattiene I3 in F.',
          'Al ciclo 5 il dato è disponibile, e un collegamento diretto lo porta all’ingresso dell’ALU, come descritto nell’unità 3.6.3. I2 entra quindi in E. Nel ciclo precedente lo stadio E era rimasto libero, e vi è entrata una bolla, che ora avanza in M.',
          'Lo stallo è durato un ciclo. I2 e I3 terminano un ciclo più tardi rispetto al flusso ideale, e il flusso di tre istruzioni occupa 8 cicli in luogo di 7. Si perde un ciclo per ogni carico immediatamente seguito da un uso.'] },
      no: { critico: 4, perduti: 0, causa: 'la addq non impiega %rax', reazione: 'nessuna',
        righe: [{ n: 'I1 mrmovq → %rax', da: 1, s: F5 }, { n: 'I2 addq %rcx', da: 2, s: F5 }, { n: 'I3', da: 3, s: F5 }],
        titoli: ['Nessuna dipendenza', 'Il flusso prosegue'], calc: ['I2 non dipende da I1', 'nessuno stallo'],
        chiedi: { d: 'I2 legge %rcx e %rdx. I1 scrive %rax. I2 deve attendere I1?', o: ['Sì', 'No'], g: 1, no: 'I2 non impiega alcun valore prodotto da I1, quindi le due istruzioni sono indipendenti.' },
        t: ['I1 è una `mrmovq` che carica un valore in %rax. I2 è `addq %rcx, %rdx`, che legge altri due registri. Fino al ciclo 3 il flusso coincide con quello ideale.',
          'Al ciclo 4 I1 è in M e I2 entra in E. I suoi operandi, %rcx e %rdx, erano già disponibili, e nessuna istruzione li sta modificando. Nessun valore è da attendere.',
          'Al ciclo 5 I1 scrive %rax nello stadio W, mentre I2 è già in M. Le due istruzioni non hanno alcun registro in comune.',
          'Nessun ciclo è andato perduto: tre istruzioni, 7 cicli, come nel flusso ideale. Il medesimo carico, seguito da un’istruzione diversa, è privo di costo.'] }
    },
    porta: {
      si: { critico: 4, perduti: 1, causa: 'M e F richiedono la porta', reazione: 'il prelievo attende',
        righe: [{ n: 'I1 mrmovq', da: 1, s: F5, err: [4] }, { n: 'I2', da: 2, s: F5 }, { n: 'I3', da: 3, s: F5 }, { n: 'I4', da: 4, s: ['…', 'F', 'D', 'E', 'M', 'W'], err: [4] }],
        titoli: ['Due richieste per una porta', 'Il prelievo è rinviato'], calc: ['ciclo 4: M e F sulla stessa porta', 'I4 prelevata al ciclo 5'],
        chiedi: { d: 'I1 è una `mrmovq` entrata al ciclo 1. In quale ciclo impiega la memoria per leggere il proprio dato?', o: ['Ciclo 1', 'Ciclo 3', 'Ciclo 4'], g: 2, no: 'La lettura dei dati avviene nello stadio M, che I1 occupa al ciclo 4.' },
          t: ['In questa macchina istruzioni e dati risiedono nella medesima memoria, che ha una sola porta e può servire un solo accesso per ciclo. Ogni prelievo la impiega. Nei cicli 1, 2 e 3 la impiegano soltanto i prelievi, senza alcuna contesa.',
          'Al ciclo 4 I1 è nello stadio M e richiede la porta per leggere il proprio dato. Nel medesimo ciclo lo stadio F la richiede per prelevare I4. Le richieste sono due, e la porta è una.',
          'La pipeline assegna la precedenza all’istruzione più avanzata, I1, e il prelievo attende. I4 entra in F al ciclo 5, con un ciclo di ritardo. Le istruzioni I2 e I3, già entrate, proseguono senza arrestarsi.',
          'Si perde un ciclo, e la causa risiede nella macchina, che dispone di una risorsa in meno del necessario. I valori elaborati dalle istruzioni sono estranei al problema. Per questa ragione i processori mantengono separate la memoria delle istruzioni e quella dei dati, o almeno le rispettive porte.'] },
      no: { critico: 4, perduti: 0, causa: 'soltanto F impiega la porta', reazione: 'nessuna',
        righe: [{ n: 'I1 addq', da: 1, s: F5 }, { n: 'I2', da: 2, s: F5 }, { n: 'I3', da: 3, s: F5 }, { n: 'I4', da: 4, s: F5 }],
        titoli: ['Una sola richiesta', 'Il flusso prosegue'], calc: ['ciclo 4: soltanto F richiede la porta', 'nessuna attesa'],
        chiedi: { d: 'I1 è una `addq`. Nello stadio M richiede la memoria dei dati?', o: ['Sì', 'No'], g: 1, no: 'Una `addq` opera soltanto sui registri, e attraversa lo stadio M senza impiegarlo.' },
        t: ['Istruzioni e dati risiedono nella medesima memoria, che ha una sola porta. Le istruzioni di questo tratto sono tutte `addq`, prive di accessi ai dati.',
          'Al ciclo 4 I1 è nello stadio M senza rivolgere alcuna richiesta alla memoria. L’unica richiesta è quella dello stadio F, che preleva I4.',
          'I4 entra in F al ciclo 4, senza ritardo. Lo stesso accade nei cicli seguenti, finché nessuna istruzione accede ai dati.',
          'Nessun ciclo perduto. Il conflitto strutturale si presenta soltanto quando due stadi richiedono la medesima risorsa nel medesimo ciclo.'] }
    },
    salto: {
      si: { critico: 3, perduti: 2, causa: 'previsione errata', reazione: 'due annullamenti',
        righe: [{ n: 'I1 jne dest', da: 1, s: F5, err: [3] }, { n: 'dest', da: 2, s: ['F', 'D', '○', '○', '○'], err: [3] }, { n: 'dest + 1', da: 3, s: ['F', '○', '○', '○', '○'], err: [3] }, { n: 'I2', da: 4, s: F5 }],
        titoli: ['La condizione è falsa', 'Due istruzioni annullate'], calc: ['ciclo 3: la previsione era errata', 'due bolle · prelievo da I2'],
        chiedi: { d: 'Il salto I1 entra al ciclo 1. In quale ciclo lo stadio E ne valuta la condizione?', o: ['Ciclo 2', 'Ciclo 3', 'Ciclo 4'], g: 1, no: 'I1 occupa F al ciclo 1, D al ciclo 2 ed E al ciclo 3.' },
        t: ['I1 è un salto condizionato. La pipeline ignora ancora la condizione, e prevede che il salto avvenga. Al ciclo 2 preleva l’istruzione posta alla destinazione.',
          'Al ciclo 3 I1 è nello stadio E, dove la condizione è valutata: è falsa, e il salto non avviene. Nel frattempo la pipeline ha prelevato due istruzioni dalla destinazione, una ora in D e una in F, che appartengono al percorso errato.',
          'Al ciclo 4 le due istruzioni sono annullate: divengono bolle, prive di scritture. Il prelievo riparte dall’istruzione corretta, I2, quella che segue il salto in memoria. Nessuna delle due istruzioni annullate aveva ancora modificato lo stato, e per questa ragione l’annullamento è possibile.',
          'Due cicli perduti: quelli impiegati per prelevare le due istruzioni errate. I2 entra al ciclo 4, mentre con una previsione corretta sarebbe entrata al ciclo 2.'] },
      no: { critico: 3, perduti: 0, causa: 'previsione corretta', reazione: 'nessuna',
        righe: [{ n: 'I1 jne dest', da: 1, s: F5 }, { n: 'dest', da: 2, s: F5 }, { n: 'dest + 1', da: 3, s: F5 }, { n: 'dest + 2', da: 4, s: F5 }],
        titoli: ['La condizione è vera', 'Il flusso prosegue'], calc: ['ciclo 3: la previsione era corretta', 'nessun annullamento'],
        chiedi: { d: 'Il salto I1 entra al ciclo 1. In quale ciclo lo stadio E ne valuta la condizione?', o: ['Ciclo 2', 'Ciclo 3', 'Ciclo 4'], g: 1, no: 'I1 occupa F al ciclo 1, D al ciclo 2 ed E al ciclo 3.' },
        t: ['I1 è un salto condizionato. La pipeline prevede che il salto avvenga, e al ciclo 2 preleva l’istruzione posta alla destinazione.',
          'Al ciclo 3 I1 è nello stadio E, e la condizione risulta vera: il salto avviene. Le due istruzioni prelevate dalla destinazione sono quelle da eseguire.',
          'Al ciclo 4 il prelievo prosegue lungo il medesimo percorso, e nessuna istruzione è annullata. Il salto ha attraversato la pipeline come qualunque altra istruzione.',
          'Nessun ciclo perduto. Un salto ha un costo soltanto quando la previsione è errata, e da ciò deriva l’importanza di una previsione accurata.'] }
    }
  };
  return { BREVE, DOM, PERCHE, SCENE };
})();
