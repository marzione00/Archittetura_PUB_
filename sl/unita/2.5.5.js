'use strict';
SL.registra('2.5.5', {
  titolo: 'Identità dei descrittori e stato aperto condiviso',
  obiettivo: 'Obiettivo: prevedere il byte da cui parte una lettura quando due descrittori riguardano il medesimo file, distinguendo il caso di dup da quello di una seconda apertura.',
  concetti: [['tabella', 'Tre livelli'], ['puntatore', 'La posizione corrente'], ['fork', 'Condivisione o indipendenza']],
  filigrana: ['tabella', 'puntatore', 'file'],
  richiami: {
    carte: [
      { sim: 'file', da: 'Dall’unità 2.5.3', t: 'Descrittore di file', d: 'Il numero piccolo con cui un processo indica al kernel uno dei propri canali aperti.' },
      { sim: 'puntatore', da: 'Dall’unità 1.3.4', t: 'Cursore di lettura', d: 'Il numero del prossimo byte da leggere. Avanza a ogni lettura.' },
      { sim: 'memory', da: 'Dall’unità 2.3.5', t: 'Aliasing', d: 'Due puntatori con il medesimo indirizzo indicano la medesima cella: ciò che l’uno scrive, l’altro lo legge.' }
    ],
    domanda: { d: 'Prima di proseguire: un file contiene i byte ABCDEF. Un programma ne legge 2, poi altri 2 dal medesimo descrittore. Quali byte ottiene la seconda lettura?', o: [
      { t: 'CD', ok: true, fb: 'La prima lettura ha fatto avanzare il cursore di due posizioni. La seconda riprende da tale punto.' },
      { t: 'AB', fb: 'In tal modo il cursore sarebbe tornato all’inizio. Ogni lettura lo fa avanzare dei byte letti.' },
      { t: 'EF', fb: 'Dopo la prima lettura il cursore si trova sulla posizione 2, che contiene C.' }
    ] }
  },
  idea: {
    titolo: 'Dove risiede la posizione nel file',
    termini: ['descrizione di file aperto', 'posizione corrente', 'dup'],
    testo: [
      'Un descrittore è un numero, al quale il kernel associa tre livelli distinti. Il primo è la tabella dei descrittori, posseduta da ogni processo: una fila di caselle numerate a partire da zero. Il descrittore è l’indice di una casella.',
      'Ogni casella occupata rinvia a una [[descrizione di file aperto]], il secondo livello. La descrizione registra il modo in cui il file è stato aperto e conserva la [[posizione corrente]]: il numero del prossimo byte da leggere o da scrivere. È il cursore di lettura dell’unità 1.3.4, mantenuto dal kernel in luogo del programma. Il terzo livello è il file stesso, con i suoi byte.',
      { fig: 'scena', w: 720, h: 110, titolo: 'Dal descrittore ai byte', nota: 'La posizione corrente risiede nel livello intermedio. Il descrittore e il file ne sono privi.', els: [
        SL.el.box('a', 0, 20, 190, 60, 'tabella del processo', 'descrittore 3', 'on', { cls: 'stretta' }), SL.el.box('b', 250, 20, 220, 60, 'descrizione di file aperto', 'posizione corrente: 3', 'att', { cls: 'stretta' }), SL.el.box('c', 530, 20, 190, 60, 'file', 'A B C D E F', '', { cls: 'stretta' }),
        SL.el.linea('l1', 190, 50, 250, 50, 'on'), SL.el.linea('l2', 470, 50, 530, 50, 'att')] },
      'Due descrittori possono rinviare alla medesima descrizione. Ciò avviene con il servizio [[dup]], che copia una casella della tabella in un’altra. Il nuovo descrittore condivide con il precedente la descrizione, e quindi la posizione: una lettura eseguita attraverso l’uno sposta il punto da cui leggerà l’altro.',
      'Due aperture del medesimo file producono invece due descrizioni, ciascuna con la propria posizione. I due descrittori leggono il medesimo file in modo indipendente, ed entrambi partono dal primo byte.',
      'La situazione è analoga all’aliasing dell’unità 2.3.5. Due descrittori diversi possono essere due nomi della medesima descrizione, e per stabilirlo occorre conoscere il modo in cui sono stati ottenuti: il numero del descrittore è privo di tale informazione.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma apre un file di dieci byte, che contiene le lettere da A a J, e ottiene il descrittore 3. Ottiene poi il descrittore 4. I controlli fissano l’origine del descrittore 4, dup oppure una seconda apertura del medesimo file, e il numero di byte letti da ciascuno.',
      'Sono seguite due letture, la prima dal descrittore 3 e la seconda dal 4, con la posizione corrente a ogni passo. Dopo il caso proposto, è istruttivo cambiare soltanto l’origine del descrittore 4.'
    ],
    vedrai: [
      ['tabella', 'La tabella dei descrittori', 'A sinistra: le caselle da 0 a 4 del processo.'],
      ['puntatore', 'Le descrizioni', 'Al centro: le descrizioni di file aperto, ciascuna con la propria posizione corrente.'],
      ['file', 'Il file', 'In basso: i dieci byte del file, con le linee che indicano la posizione di ogni descrizione.']
    ]
  },
  lab: {
    titolo: 'Due descrittori, una o due posizioni',
    scena: { w: 860, h: 356 },
    atti: ['Tre livelli', 'Il secondo descrittore', 'La prima lettura', 'La seconda lettura', 'L’appartenenza della posizione'],
    controlli: [
      { id: 'm', tipo: 'scelta', eti: 'Origine del descrittore 4', opzioni: [['dup', 'dup del descrittore 3'], ['open', 'una seconda apertura']], valore: 'dup' },
      { id: 'n', tipo: 'num', eti: 'Byte letti dal descrittore 3', min: 2, max: 4, salti: [1], valore: 3 },
      { id: 'k', tipo: 'num', eti: 'Byte letti dal descrittore 4', min: 2, max: 3, salti: [1], valore: 3 }
    ],
    nota: 'Il file contiene dieci byte: le lettere da A a J, nelle posizioni da 0 a 9.',
    previsione: {
      domanda: (p) => 'Un file contiene le lettere da A a J. Il descrittore 3 lo ha aperto, e il descrittore 4 è stato ottenuto ' + (p.m === 'dup' ? 'con dup dal descrittore 3' : 'con una seconda apertura del medesimo file') + '. Il programma legge ' + p.n + ' byte dal descrittore 3 e poi ' + p.k + ' byte dal descrittore 4. Quali byte ottiene la seconda lettura?',
      opzioni: (p) => { const F = 'ABCDEFGHIJ'; return Array.from(new Set([F.slice(p.n, p.n + p.k), F.slice(0, p.k), F.slice(p.k, 2 * p.k), F.slice(p.n + p.k, p.n + 2 * p.k)])).slice(0, 3).sort(); }
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. La seconda lettura ottiene ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.m === 'dup' ? 'Con dup i due descrittori condividono una sola descrizione. La prima lettura ha portato la posizione a ' + p.n + ', e la seconda è ripresa da tale posizione.' : 'Con due aperture le descrizioni sono due. La prima lettura ha spostato soltanto la posizione della prima, e la seconda è partita da 0.'),
    costruisci(p) {
      const el = SL.el, passi = [], F = 'ABCDEFGHIJ', DUP = p.m === 'dup', l1 = F.slice(0, p.n), da2 = DUP ? p.n : 0, l2 = F.slice(da2, da2 + p.k);
      const st = { fd4: false, d1: 0, d2: null, r1: null, r2: null };
      const FX = (i) => 300 + i * 54;
      const quadro = (o) => {
        const els = [el.nota('n1', 20, 0, 'TABELLA DEI DESCRITTORI', 'mono'), el.nota('n2', 300, 100, 'DESCRIZIONI DI FILE APERTO', 'mono'), el.nota('n3', 228, 280, 'IL FILE', 'mono')];
        for (let j = 0; j < 5; j++) els.push(el.box('fd' + j, 20, 26 + j * 50, 200, 44, 'descrittore ' + j, j < 3 ? 'terminale' : j === 3 ? 'rinvia a D1' : st.fd4 ? (DUP ? 'rinvia a D1' : 'rinvia a D2') : 'libero', j === o.fd ? 'att' : j < 3 ? '' : j === 4 && !st.fd4 ? '' : 'on', { cls: 'stretta' }));
        els.push(el.box('r1', 300, 26, 250, 56, 'lettura dal descrittore 3', st.r1 || '·', o.fd === 3 && st.r1 ? 'att' : st.r1 ? 'on' : '', { cls: 'stretta' }),
          el.box('r2', 570, 26, 250, 56, 'lettura dal descrittore 4', st.r2 || '·', o.fd === 4 && st.r2 ? 'att' : st.r2 ? 'on' : '', { cls: 'stretta' }),
          el.box('d1', 300, 126, 250, 56, 'D1 · posizione corrente', String(st.d1), o.mossa === 1 ? 'att' : 'on', { cls: 'stretta' }),
          el.linea('a3', 220, 198, 300, 160, o.fd === 3 ? 'att' : 'on'), el.linea('p1', 425, 182, FX(Math.min(st.d1, 9)) + 25, 268, o.mossa === 1 ? 'att' : 'on'));
        if (st.d2 != null) els.push(el.box('d2', 570, 126, 250, 56, 'D2 · posizione corrente', String(st.d2), o.mossa === 2 ? 'att' : 'on', { cls: 'stretta' }), el.linea('p2', 695, 182, FX(st.d2) + 25, 268, o.mossa === 2 ? 'att' : 'on'));
        if (st.fd4) els.push(DUP ? el.linea('a4', 220, 248, 300, 172, o.fd === 4 ? 'att' : 'on') : el.linea('a4', 220, 248, 570, 178, o.fd === 4 ? 'att' : 'on'));
        for (let i = 0; i < 10; i++) els.push(el.cella('f' + i, FX(i), 268, 50, 44, F[i], (o.letti || []).includes(i) ? 'att' : '', { piccola: true, gi: String(i) }));
        return els;
      };
      const hud = () => [['Posizione di D1', String(st.d1), 'a'], ['Posizione di D2', st.d2 == null ? (st.fd4 ? 'D2 assente' : '·') : String(st.d2)], ['Seconda lettura', st.r2 || '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const intervallo = (da, quanti) => Array.from({ length: quanti }, (_, i) => da + i);

      P({ fd: 3 }, 0, 'Dal descrittore al file', 'Il programma ha aperto il file, e il kernel gli ha assegnato il descrittore 3, la prima casella libera della tabella. La casella rinvia alla descrizione D1, che conserva la posizione corrente: 0, poiché nessun byte è stato ancora letto. La descrizione, a sua volta, rinvia al file.',
        { chiedi: { d: 'Il programma ottiene ora il descrittore 4 ' + (DUP ? 'con dup, che copia la casella 3 nella casella 4.' : 'con una seconda apertura del medesimo file.') + ' Quante descrizioni di file aperto esisteranno?', o: ['Una', 'Due'], g: DUP ? 0 : 1, no: DUP ? 'Il servizio dup copia la casella della tabella, e la copia rinvia alla medesima descrizione.' : 'Ogni apertura crea una nuova descrizione, anche quando il file è il medesimo.' } });
      st.fd4 = true; if (!DUP) st.d2 = 0;
      P({ fd: 4, mossa: DUP ? 0 : 2 }, 1, DUP ? 'Una copia della casella' : 'Una seconda descrizione', (DUP ? 'Il servizio dup copia la casella 3 nella casella 4. I due descrittori rinviano ora alla medesima descrizione, D1, e condividono un’unica posizione corrente.' : 'La seconda apertura crea una nuova descrizione, D2, con una posizione corrente propria, che parte da 0. I due descrittori riguardano il medesimo file attraverso due descrizioni diverse.'), { calc: DUP ? '3 → D1 · 4 → D1' : '3 → D1 · 4 → D2' });
      st.d1 = p.n; st.r1 = l1;
      const o2 = Array.from(new Set([0, p.n])).map(String);
      P({ fd: 3, mossa: 1, letti: intervallo(0, p.n) }, 2, 'La prima lettura', 'Il programma legge ' + p.n + ' byte dal descrittore 3. Il kernel segue il rinvio fino a D1, trova la posizione 0 e consegna i byte ' + l1 + '. Fa poi avanzare la posizione di D1 fino a ' + p.n + '.',
        { calc: 'read(3, …, ' + p.n + ') → ' + l1, chiedi: { d: 'Ora il programma leggerà ' + p.k + ' byte dal descrittore 4. Da quale posizione del file partirà la lettura?', o: o2, g: o2.indexOf(String(da2)), no: DUP ? 'Il descrittore 4 rinvia a D1, la cui posizione è ora ' + p.n + '.' : 'Il descrittore 4 rinvia a D2, la cui posizione è rimasta a 0.' } });
      if (DUP) st.d1 = p.n + p.k; else st.d2 = p.k; st.r2 = l2;
      P({ fd: 4, mossa: DUP ? 1 : 2, letti: intervallo(da2, p.k) }, 3, 'La seconda lettura', 'Il programma legge ' + p.k + ' byte dal descrittore 4. ' + (DUP ? 'Il rinvio conduce di nuovo a D1, dove la posizione è ' + p.n + ': la lettura prosegue dal punto in cui si era arrestata la prima e consegna ' + l2 + '. La posizione di D1 sale a ' + (p.n + p.k) + '.' : 'Il rinvio conduce a D2, dove la posizione è ancora 0: la lettura riparte dall’inizio del file e consegna ' + l2 + '. La posizione di D2 sale a ' + p.k + ', quella di D1 resta a ' + p.n + '.'), { calc: 'read(4, …, ' + p.k + ') → ' + l2 });
      P({ mossa: 0 }, 4, 'L’appartenenza della posizione', 'La posizione corrente appartiene alla descrizione. ' + (DUP ? 'Due descrittori che rinviano alla medesima descrizione condividono la posizione: le due letture, insieme, hanno percorso il file senza ripetizioni.' : 'Due descrizioni del medesimo file mantengono due posizioni separate: le due letture hanno consegnato due volte l’inizio del file.') + ' Dal solo numero del descrittore i due casi sono indistinguibili.', { calc: DUP ? 'D1 a ' + (p.n + p.k) : 'D1 a ' + p.n + ' · D2 a ' + p.k, esito: ['seconda lettura: ' + l2, 'si'] });
      return { passi, esito: l2 };
    }
  },
  bilancio: {
    regola: [
      'Un descrittore rinvia a una descrizione di file aperto, e la descrizione rinvia al file. La posizione corrente appartiene alla descrizione.',
      'Con dup due descrittori condividono una descrizione, e quindi la posizione. Due aperture del medesimo file creano due descrizioni con posizioni indipendenti.'
    ],
    errori: [
      ['Attribuire la posizione al descrittore.', 'Dopo dup i descrittori 3 e 4 sono due numeri diversi, e tuttavia le loro letture proseguono l’una dopo l’altra.'],
      ['Attribuire la posizione al file.', 'Due aperture del medesimo file hanno due posizioni. Una lettura dalla prima lascia invariata la seconda.'],
      ['Considerare dup equivalente a una seconda apertura.', 'In entrambi i casi è creato un nuovo descrittore. Soltanto con la seconda apertura è creata anche una nuova posizione.']
    ],
    saFare: ['Distinguere descrittore, descrizione di file aperto e file.', 'Prevedere il byte da cui parte una lettura dopo dup.', 'Prevedere il byte da cui parte una lettura dopo una seconda apertura.'],
    esercizi: [
      { d: 'Un file contiene i byte ABCDEFGH. Il descrittore 3 lo ha aperto, e il descrittore 4 è stato ottenuto con dup dal 3. Il programma legge 3 byte dal descrittore 4, poi 2 byte dal descrittore 3. Quali byte ottiene la seconda lettura?', segnaposto: 'Due lettere', giuste: ['de', 'd e', 'd,e'],
        ok: 'I due descrittori condividono la descrizione. La prima lettura porta la posizione a 3, e la seconda consegna i byte nelle posizioni 3 e 4: D ed E.',
        diagnosi: [
          { se: ['ab'], msg: 'In tal modo i due descrittori avrebbero posizioni indipendenti, come dopo due aperture. Con dup la posizione è una sola.' },
          { se: ['abc', 'def'], msg: 'La seconda lettura richiede 2 byte.' },
          { se: ['cd'], msg: 'La prima lettura ha consegnato 3 byte, A, B e C. La posizione è 3, dove si trova D.' }
        ],
        altro: 'I byte sono diversi. Si stabilisca il numero di descrizioni esistenti e la posizione dopo la prima lettura.',
        indizi: ['Dopo dup esiste una sola descrizione, con una sola posizione.', 'La prima lettura, di 3 byte, porta la posizione a 3.', 'Le posizioni 3 e 4 contengono D ed E.'],
        svolgimento: ['dup: i descrittori 3 e 4 rinviano alla medesima descrizione.', 'Lettura di 3 byte dal 4: ABC. Posizione: 3.', 'Lettura di 2 byte dal 3: parte dalla posizione 3 e consegna DE.'] },
      { d: 'Un programma apre due volte il medesimo file e ottiene i descrittori 3 e 4. Legge 5 byte dal descrittore 3. Da quale posizione partirà la prima lettura dal descrittore 4?', guida: 'Si scelga la risposta.', o: [
        { t: 'Dalla posizione 0', ok: true, fb: 'Le due aperture hanno creato due descrizioni. La lettura dal descrittore 3 ha spostato soltanto la posizione della prima.' },
        { t: 'Dalla posizione 5', fb: 'Ciò avverrebbe dopo dup. Due aperture creano due descrizioni, ciascuna con la propria posizione.' },
        { t: 'Dalla fine del file', fb: 'La posizione di una descrizione appena creata è 0, l’inizio del file.' }] }
    ],
    sfida: ['cslez2_5_05_random_assembly_05', 'Sequenze di letture e scritture']
  }
});
