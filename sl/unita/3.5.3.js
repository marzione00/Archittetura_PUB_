'use strict';
SL.registra('3.5.3', {
  titolo: 'Dipendenze fra le istruzioni',
  obiettivo: 'Obiettivo: riconoscere le dipendenze dei dati e le dipendenze del controllo fra istruzioni consecutive, e indicare perché ciascuna impedisce di sovrapporre liberamente le due istruzioni.',
  concetti: [['conflitto', 'Due legami fra istruzioni'], ['pipeline', 'Lettura prima della scrittura'], ['bilancio', 'Un’istruzione da ritardare']],
  filigrana: ['conflitto', 'pipeline', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 3.5.2', t: 'Il diagramma ideale', d: 'Ogni istruzione avanza di uno stadio per ciclo: F, D, E, M, W.' },
      { sim: 'cpu', da: 'Dall’unità 3.4.1', t: 'La regola della CPU a ciclo singolo', d: 'Ogni istruzione legge lo stato lasciato dalle precedenti, poiché ha inizio quando quelle sono completate.' },
      { sim: 'flag', da: 'Dall’unità 3.3.5', t: 'ZF fra sub e je', d: '`sub` scrive ZF nella propria fase di esecuzione, e `je` lo legge per calcolare Cnd.' }
    ],
    domanda: { d: 'Prima di proseguire: in un flusso ideale, quando I1 si trova nello stadio W, in quale stadio si trova I2?', o: [
      { t: 'Nello stadio M', ok: true, fb: 'I2 è entrata un ciclo dopo I1, e la segue a una posizione di distanza.' },
      { t: 'Nello stadio E', fb: 'In E si trova I3, entrata due cicli dopo I1.' },
      { t: 'Nello stadio W', fb: 'Uno stadio ospita una sola istruzione per ciclo.' }
    ] }
  },
  idea: {
    titolo: 'Le istruzioni legate fra loro',
    termini: ['dipendenza dei dati', 'dipendenza del controllo'],
    testo: [
      'Una pipeline funziona bene quando ogni istruzione può procedere indipendentemente da quelle che la precedono. Nei programmi reali le istruzioni sono però legate fra loro. Nella CPU a ciclo singolo tali legami erano privi di effetti, poiché ogni istruzione era completata prima dell’inizio della successiva. Nella pipeline le istruzioni si sovrappongono, e i legami sono di due tipi.',
      'Una [[dipendenza dei dati]] si presenta quando il risultato di un’istruzione è impiegato come operando da un’istruzione successiva. Prende anche il nome di dipendenza RAW, dall’inglese read after write, ed è molto frequente. Nella sequenza `mov rax, 50`, `add rbx, rax`, `mov 100(rbx), rdx` la seconda istruzione legge RAX, scritto dalla prima, e la terza impiega RBX, calcolato dalla seconda.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Una dipendenza dei dati', nota: 'La seconda istruzione legge RAX in D al ciclo 3. La prima lo scrive in W soltanto al ciclo 5.', els:
        SL.pipe.diagramma('g', [{ n: 'mov rax, 50', da: 1, s: ['F', 'D', 'E', 'M', 'W'], err: [5] }, { n: 'add rbx, rax', da: 2, s: ['F', 'D', 'E', 'M', 'W'], err: [3] }], { x: 170, y: 4, passo: 72, cicli: 7, py: 40, h: 30 }) },
      'Se la seconda istruzione entra nella pipeline subito dopo la prima, legge RAX nello stadio D prima che il valore nuovo sia stato scritto, e la sua esecuzione deve quindi essere ritardata finché il valore è disponibile. La pipeline deve garantire risultati corretti con il minimo effetto sulle prestazioni. Il modo più semplice di ritardare un’istruzione consiste nel farla precedere da una o più istruzioni `nop`, che non compiono alcuna operazione; il capitolo 3.6 stabilisce quante ne occorrono nella CPU con pipeline a cinque stadi.',
      'Una [[dipendenza del controllo]] si presenta quando un’istruzione stabilisce quale istruzione è eseguita dopo di essa. Nel ciclo `sub rdx, rbx`, `je stop`, l’istruzione `je` sceglie fra quella che la segue in memoria e quella all’etichetta `stop`, e la scelta dipende dal risultato di `sub`. L’istruzione da eseguire dopo `je` è nota soltanto quando ZF è stato prodotto e Cnd calcolato: in linea di principio le due istruzioni non possono sovrapporsi.',
      'In entrambi i casi trascorrono cicli in cui nessuna istruzione utile è completata, e il throughput scende al di sotto del valore ideale di un’istruzione per ciclo.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento esamina tre coppie di istruzioni consecutive. I controlli fissano la seconda istruzione: una che impiega il risultato della prima, una indipendente, oppure un salto che dipende dalla prima.',
      'Il diagramma mostra in quale ciclo la seconda istruzione legge ciò che le occorre, e in quale ciclo la prima lo rende disponibile. Dopo il caso proposto, è istruttivo esaminare la coppia indipendente e confrontare i due diagrammi.'
    ],
    vedrai: [
      ['tabella', 'Il diagramma', 'In alto: le due istruzioni, con i cicli critici in evidenza.'],
      ['conflitto', 'Il legame', 'In basso a sinistra: che cosa legge la seconda istruzione, e chi lo produce.'],
      ['bilancio', 'La conseguenza', 'In basso a destra: se la seconda istruzione deve essere ritardata.']
    ]
  },
  lab: {
    titolo: 'Tre coppie a confronto',
    scena: { w: 860, h: 312 },
    atti: ['Il programma', 'Che cosa legge', 'Quando è disponibile', 'La conseguenza'],
    controlli: [
      { id: 'h', tipo: 'scelta', eti: 'Seconda istruzione', opzioni: [['dati', 'add rbx, rax'], ['no', 'add rbx, rcx'], ['salto', 'je stop']], valore: 'dati' }
    ],
    nota: 'I passi sono sempre quattro. La prima istruzione è `mov rax, 50` nelle prime due coppie, e `sub rdx, rbx` nella terza.',
    previsione: {
      domanda: (p) => SL.unita353.DOM[p.h] + ' Quale legame unisce la seconda istruzione alla prima?',
      opzioni: () => [['dati', 'Una dipendenza dei dati'], ['controllo', 'Una dipendenza del controllo'], ['nessuna', 'Nessuna dipendenza']]
    },
    confronto: (pred, esito, p) => { const N = { dati: 'una dipendenza dei dati', controllo: 'una dipendenza del controllo', nessuna: 'nessuna dipendenza' }; return 'La previsione indicava ' + N[pred] + '. L’esito è ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : SL.unita353.PERCHE[p.h]); },
    costruisci(p) {
      const el = SL.el, U = SL.unita353, passi = [], S = U.SCENE[p.h];
      const quadro = (o) => {
        const els = [el.nota('t0', 20, 0, 'CICLO', 'mono')];
        SL.pipe.diagramma('d', S.righe(o.fase), { x: 190, y: 0, passo: 72, cicli: 7, py: 40, h: 30, fino: o.c, evid: o.evid }).forEach((e) => els.push(e));
        els.push(el.box('b1', 20, 140, 400, 92, 'che cosa legge la seconda istruzione', o.fase >= 1 ? S.legge : '·', o.fase === 1 ? 'att' : o.fase > 1 ? 'on' : '', { cls: 'stretta' }),
          el.box('b2', 440, 140, 404, 92, 'quando è disponibile', o.fase >= 2 ? S.quando : '·', o.fase === 2 ? (S.esito === 'nessuna' ? 'on' : 'err') : o.fase > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('b3', 20, 244, 824, 56, 'conseguenza', o.fase >= 3 ? S.conseguenza : '·', o.fase >= 3 ? (S.esito === 'nessuna' ? 'att' : 'err') : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (o) => [['Coppia', U.BREVE[p.h], 'a'], ['Ciclo', o.evid ? String(o.evid) : '·'], ['Legame', o.fase >= 3 ? U.NOME[S.esito] : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o), els: quadro(o) }, extra));

      P({ c: 2, fase: 0 }, 0, 'Il programma', S.t[0], { chiedi: S.chiedi });
      P({ c: 3, evid: 3, fase: 1 }, 1, S.titoli[0], S.t[1], { calc: S.calc[0] });
      P({ c: 7, evid: S.evid, fase: 2 }, 2, S.titoli[1], S.t[2], { calc: S.calc[1] });
      P({ c: 7, fase: 3 }, 3, S.esito === 'nessuna' ? 'Nessun ritardo' : 'Un’istruzione da ritardare', S.t[3], { calc: S.calc[2], esito: [U.NOME[S.esito], S.esito === 'nessuna' ? 'si' : ''] });
      return { passi, esito: S.esito };
    }
  },
  bilancio: {
    regola: [
      'Una dipendenza dei dati, o RAW, lega un’istruzione che impiega un registro a un’istruzione precedente che lo scrive. Nella pipeline la seconda leggerebbe il registro in D prima che la prima lo scriva in W, e va quindi ritardata.',
      'Una dipendenza del controllo lega un salto alle istruzioni che lo seguono: quale istruzione eseguire è noto soltanto dopo che il salto ha esaminato ZF. In entrambi i casi il throughput scende sotto un’istruzione per ciclo.'
    ],
    errori: [
      ['Ritenere dipendente ogni coppia di istruzioni consecutive.', 'La dipendenza dei dati richiede un registro scritto dalla prima e letto dalla seconda. `add rbx, rcx` dopo `mov rax, 50` è indipendente.'],
      ['Confondere la destinazione con un operando letto.', 'In `add rbx, rax` sono letti sia RBX sia RAX: la dipendenza si presenta se la prima istruzione scrive uno dei due.'],
      ['Ritenere che `je` dipenda soltanto dai registri.', '`je` non legge registri. Dipende da ZF, prodotto dall’ultima istruzione aritmetica o logica.']
    ],
    saFare: ['Riconoscere una dipendenza dei dati fra due istruzioni.', 'Riconoscere una dipendenza del controllo.', 'Indicare sul diagramma il ciclo in cui un registro è letto e quello in cui è scritto.'],
    esercizi: [
      { d: 'Nella sequenza `mov rax, 50`, `add rbx, rax`, `mov 100(rbx), rdx`, da quale istruzione dipende la terza?', guida: 'Si scelga la risposta.', o: [
        { t: 'Dalla seconda, che scrive RBX', ok: true, fb: 'La terza impiega RBX come base dell’indirizzo, e RBX è calcolato dalla seconda.' },
        { t: 'Dalla prima, che scrive RAX', fb: 'La terza legge RBX e RDX. RAX non compare fra i suoi operandi.' },
        { t: 'Da nessuna delle due', fb: 'La terza legge RBX, che la seconda ha appena scritto.' }] },
      { d: 'La prima istruzione di una coppia scrive un registro nello stadio W al ciclo 5. La seconda lo legge nello stadio D al ciclo 3. Di quanti cicli la lettura precede la scrittura?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: 'La lettura avviene al ciclo 3, la scrittura al ciclo 5: 5 − 3 = 2 cicli prima.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Il ciclo 3 è quello della lettura. La domanda riguarda la distanza fra i due cicli.' },
          { se: ['5', 'cinque'], msg: 'Il ciclo 5 è quello della scrittura. Va sottratto il ciclo della lettura.' },
          { se: ['8', 'otto'], msg: 'I due cicli vanno sottratti, non sommati.' }
        ],
        altro: 'Il numero è diverso. Si sottragga il ciclo della lettura da quello della scrittura.',
        indizi: ['La scrittura avviene al ciclo 5.', 'La lettura avviene al ciclo 3.', '5 − 3.'],
        svolgimento: ['Scrittura in W: ciclo 5.', 'Lettura in D: ciclo 3.', 'Distanza: 5 − 3 = 2 cicli.'] }
    ],
    sfida: ['cslez3_5_03_random_assembly', 'Dipendenze di lettura dopo scrittura']
  }
});
SL.unita353 = (() => {
  const F5 = ['F', 'D', 'E', 'M', 'W'];
  const BREVE = { dati: 'mov e add rbx, rax', no: 'mov e add rbx, rcx', salto: 'sub e je' };
  const NOME = { dati: 'dipendenza dei dati', controllo: 'dipendenza del controllo', nessuna: 'nessuna dipendenza' };
  const DOM = {
    dati: 'La prima istruzione è `mov rax, 50`, e la seconda, entrata nel ciclo successivo, è `add rbx, rax`.',
    no: 'La prima istruzione è `mov rax, 50`, e la seconda, entrata nel ciclo successivo, è `add rbx, rcx`.',
    salto: 'La prima istruzione è `sub rdx, rbx`, e la seconda, entrata nel ciclo successivo, è `je stop`.'
  };
  const PERCHE = {
    dati: '`add rbx, rax` legge RAX, che `mov rax, 50` scrive: è una dipendenza dei dati.',
    no: '`add rbx, rcx` legge RBX e RCX, e `mov rax, 50` scrive soltanto RAX: le due istruzioni sono indipendenti.',
    salto: '`je` sceglie l’istruzione successiva in base a ZF, che `sub` produce: è una dipendenza del controllo.'
  };
  const SCENE = {
    dati: { esito: 'dati', evid: 5,
      righe: (f) => [{ n: 'mov rax, 50', da: 1, s: F5, err: f >= 2 ? [5] : [] }, { n: 'add rbx, rax', da: 2, s: F5, err: f >= 1 ? [3] : [] }],
      legge: 'RBX e RAX, nello stadio D, al ciclo 3', quando: 'RAX = 50 è scritto in W al ciclo 5', conseguenza: 'la lettura precede la scrittura: la seconda istruzione va ritardata',
      titoli: ['La lettura di RAX', 'La scrittura di RAX'], calc: ['add legge RAX al ciclo 3', 'mov scrive RAX al ciclo 5', 'dipendenza dei dati'],
      chiedi: { d: '`add rbx, rax` scrive RBX. Quali registri legge?', o: ['RBX e RAX', 'Soltanto RAX', 'Soltanto RBX'], g: 0, no: '`add rbx, rax` calcola RBX + RAX, e legge quindi entrambi i registri.' },
      t: ['La prima istruzione, `mov rax, 50`, scrive 50 in RAX. La seconda, `add rbx, rax`, calcola RBX + RAX. Le due istruzioni entrano nella pipeline in cicli consecutivi.',
        'La seconda istruzione legge i propri operandi nello stadio D, che occupa al ciclo 3. Fra essi compare RAX, il registro che la prima istruzione sta scrivendo.',
        'La prima istruzione deposita il valore 50 in RAX nello stadio W, al ciclo 5. Al ciclo 3 il registro contiene ancora il valore precedente.',
        'La seconda istruzione leggerebbe un valore non aggiornato, e calcolerebbe un risultato errato pur essendo eseguita secondo le proprie regole. Va quindi ritardata finché il valore è disponibile, per esempio con istruzioni `nop`.'] },
    no: { esito: 'nessuna', evid: 5,
      righe: () => [{ n: 'mov rax, 50', da: 1, s: F5 }, { n: 'add rbx, rcx', da: 2, s: F5 }],
      legge: 'RBX e RCX, nello stadio D, al ciclo 3', quando: 'mov scrive soltanto RAX, al ciclo 5', conseguenza: 'nessun registro in comune: le due istruzioni si sovrappongono liberamente',
      titoli: ['La lettura di RBX e RCX', 'La scrittura di RAX'], calc: ['add legge RBX e RCX al ciclo 3', 'mov scrive RAX al ciclo 5', 'nessuna dipendenza'],
      chiedi: { d: '`add rbx, rcx` legge un registro scritto da `mov rax, 50`?', o: ['Sì', 'No'], g: 1, no: 'La prima istruzione scrive soltanto RAX, che la seconda non legge.' },
      t: ['La prima istruzione, `mov rax, 50`, scrive 50 in RAX. La seconda, `add rbx, rcx`, calcola RBX + RCX. Le due istruzioni entrano nella pipeline in cicli consecutivi.',
        'La seconda istruzione legge RBX e RCX nello stadio D, al ciclo 3. Nessuno dei due è scritto dalla prima istruzione.',
        'La prima istruzione scrive RAX nello stadio W, al ciclo 5. Il fatto che la lettura della seconda avvenga prima è irrilevante, poiché riguarda altri registri.',
        'Le due istruzioni sono indipendenti, e la seconda può avanzare senza ritardi. Il flusso coincide con quello ideale.'] },
    salto: { esito: 'controllo', evid: 4,
      righe: (f) => [{ n: 'sub rdx, rbx', da: 1, s: F5, err: f >= 2 ? [3] : [] }, { n: 'je stop', da: 2, s: F5, err: f >= 2 ? [4] : [] }],
      legge: 'nessun registro: esamina ZF, prodotto da sub', quando: 'Cnd è calcolato in E al ciclo 4', conseguenza: 'la successiva a je è nota soltanto dopo il ciclo 4, e deve attendere',
      titoli: ['Che cosa esamina je', 'Quando la scelta è nota'], calc: ['je esamina ZF', 'Cnd calcolato al ciclo 4', 'dipendenza del controllo'],
      chiedi: { d: '`je stop` legge registri nello stadio D?', o: ['Sì, RDX e RBX', 'No, nessuno'], g: 1, no: '`je` non nomina registri. Esamina ZF nella fase di esecuzione.' },
      t: ['La prima istruzione, `sub rdx, rbx`, aggiorna RDX e ZF. La seconda, `je stop`, sceglie fra l’istruzione che la segue in memoria e quella all’etichetta `stop`. Le due istruzioni entrano nella pipeline in cicli consecutivi.',
        '`je` non legge registri. Essa esamina ZF, il flag che `sub` aggiorna, e da esso ricava Cnd nello stadio E.',
        '`sub` produce ZF nello stadio E al ciclo 3, e `je` calcola Cnd nello stadio E al ciclo 4. Soltanto allora è noto quale istruzione segue il salto, mentre lo stadio F dovrebbe prelevarla già al ciclo 3.',
        'Le istruzioni che seguono il salto dipendono dal suo esito: è una dipendenza del controllo. In linea di principio esse non possono sovrapporsi al salto, e i cicli in cui la scelta resta ignota non completano istruzioni utili.'] }
  };
  return { BREVE, NOME, DOM, PERCHE, SCENE };
})();
