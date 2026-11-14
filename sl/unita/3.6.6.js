'use strict';
SL.unita366 = (() => {
  const TESTO = { load: '`mrmovq 0(%rbx), %rax`', uso: '`addq %rax, %rcx`', ind: '`rrmovq %rsi, %rdi`' };
  const NOME = { vicino: 'L · U · I', separa: 'L · I · U' };
  // La traccia ciclo per ciclo. Un carico nello stadio E con il suo uso nello stadio D ferma F e D per un ciclo.
  const traccia = (ordine, g) => {
    const istr = [];
    for (let k = 1; k <= g; k++) {
      const x = g > 1 ? String(k) : '', L = { n: 'L' + x, tipo: 'load', s: [], err: [] }, U = { n: 'U' + x, tipo: 'uso', s: [], err: [] }, I = { n: 'I' + x, tipo: 'ind', s: [], err: [] };
      (ordine === 'vicino' ? [L, U, I] : [L, I, U]).forEach((v) => istr.push(v));
    }
    const righe = istr.slice(), bolle = [];
    let ip = 0, d = null, e = null, m = null, w = null, c = 0, attese = 0, fatte = 0, fermi = false;
    while (fatte < istr.length) {
      c++;
      const f = istr[ip] || null;
      [f, d, e, m, w].forEach((x, j) => { if (!x) return; if (x.da == null) x.da = c; x.s.push(x.bolla ? '○' : 'FDEMW'[j]); if (fermi && j < 2) x.err.push(c); });
      if (w && !w.bolla) fatte++;
      const stallo = !!(e && d && e.tipo === 'load' && d.tipo === 'uso');
      w = m; m = e;
      if (stallo) { attese++; const b = { n: 'bolla', bolla: true, s: [], err: [] }; bolle.push([d, b]); e = b; } else { e = d; d = f; if (f) ip++; }
      fermi = stallo;
    }
    bolle.forEach((x) => righe.splice(righe.indexOf(x[0]) + 1, 0, x[1]));
    return { righe, cicli: c, attese, istr };
  };
  return { TESTO, NOME, traccia };
})();
SL.registra('3.6.6', {
  titolo: 'Traccia e conteggio delle prestazioni',
  obiettivo: 'Obiettivo: seguire ciclo per ciclo una sequenza con un carico e il suo uso, contare i cicli e le attese, e indicare quando una variazione dell’ordine elimina l’attesa.',
  concetti: [['tabella', 'La traccia ciclo per ciclo'], ['stallo', 'Un ciclo di attesa'], ['bilancio', 'Il medesimo lavoro in un numero minore di cicli']],
  filigrana: ['tabella', 'stallo', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'bus', da: 'Dall’unità 3.6.3', t: 'L’inoltro', d: 'Un valore prodotto da un’istruzione ancora nella pipeline raggiunge lo stadio D senza attraversare il banco.' },
      { sim: 'stallo', da: 'Dall’unità 3.6.5', t: 'Carico seguito da un uso', d: 'I registri F e D restano bloccati per un ciclo, e nel registro E entra una bolla.' },
      { sim: 'bilancio', da: 'Dall’unità 3.5.4', t: 'Il conteggio dei cicli', d: 'Un tratto di N istruzioni occupa N + 4 cicli, più le penalità.' }
    ],
    domanda: { d: 'Prima di proseguire: una `mrmovq` entra nello stadio F al ciclo 1. Alla fine di quale ciclo il dato letto dalla memoria è disponibile per l’inoltro?', o: [
      { t: 'Alla fine del ciclo 4', ok: true, fb: 'La memoria dei dati si legge nello stadio M, il quarto.' },
      { t: 'Alla fine del ciclo 3', fb: 'Al ciclo 3 la `mrmovq` è nello stadio E, dove l’ALU calcola l’indirizzo. Il dato è letto nel ciclo seguente.' },
      { t: 'Alla fine del ciclo 5', fb: 'Al ciclo 5 il dato è scritto nel banco. Per l’inoltro era già disponibile un ciclo prima.' }
    ] }
  },
  idea: {
    titolo: 'L’attesa occupata da un’istruzione utile',
    termini: ['riordino'],
    testo: [
      'Il costo di un carico seguito da un uso dipende dalla distanza fra le due istruzioni. Se l’uso segue immediatamente, occorre un ciclo di attesa. Se fra le due si trova un’altra istruzione, il dato esce in tempo dalla memoria, e l’inoltro lo fornisce senza attese.',
      'Si considerino tre istruzioni. L è un carico, `mrmovq 0(%rbx), %rax`. U impiega il dato caricato, `addq %rax, %rcx`. I è indipendente da entrambe, `rrmovq %rsi, %rdi`: copia un registro in un altro, opera su registri diversi e lascia invariati i codici di condizione.',
      { fig: 'scena', w: 720, h: 190, titolo: 'L’ordine L, U, I: un ciclo di attesa', nota: 'U ripete lo stadio D al ciclo 4, quando L sta leggendo la memoria. La sequenza occupa 8 cicli.', els: SL.pipe.diagramma('g', SL.unita366.traccia('vicino', 1).righe, { x: 150, y: 4, passo: 66, cicli: 8, py: 36, h: 28 }) },
      'Nell’ordine L, U, I la pipeline perde un ciclo: U resta bloccata nello stadio D mentre L legge la memoria. Nell’ordine L, I, U tale ciclo è occupato da I, che andava comunque eseguita. Quando U raggiunge lo stadio D, L è già nello stadio M, e il dato è disponibile per l’inoltro.',
      'Lo scambio è un [[riordino]], ed è lecito soltanto perché I è indipendente: opera su registri diversi da quelli di L e di U, è priva di accessi alla memoria e conserva i codici di condizione. Il risultato del programma è il medesimo nei due ordini. In un programma reale tutte queste condizioni vanno verificate prima di spostare un’istruzione. I compilatori eseguono abitualmente tale verifica.'
    ]
  },
  esperimento: {
    faremo: [
      'La traccia della pipeline è seguita ciclo per ciclo, con le tre istruzioni L, U e I. I controlli fissano l’ordine e il numero di ripetizioni del gruppo.',
      'Si esaminano i cicli 3, 4 e 5, che determinano l’esito, poi l’intero diagramma e il conteggio finale. Dopo il caso proposto, è istruttivo modificare soltanto l’ordine e confrontare il numero di cicli.'
    ],
    vedrai: [
      ['tabella', 'La traccia', 'In alto: il diagramma di pipeline, con gli stadi ripetuti in rosso e le bolle.'],
      ['conflitto', 'Il ciclo in esame', 'La colonna in evidenza: il ciclo in esame.'],
      ['bilancio', 'Il conteggio', 'In basso: istruzioni completate, cicli e attese.']
    ]
  },
  lab: {
    titolo: 'Tre istruzioni, due ordini',
    scena: { w: 860, h: 334 },
    atti: ['Il programma', 'I cicli determinanti', 'La traccia intera', 'Il conteggio'],
    controlli: [
      { id: 'ordine', tipo: 'scelta', eti: 'Ordine', opzioni: [['vicino', 'L · U · I'], ['separa', 'L · I · U']], valore: 'vicino' },
      { id: 'g', tipo: 'scelta', eti: 'Ripetizioni del gruppo', opzioni: [[1, '1'], [2, '2']], valore: 1 }
    ],
    nota: 'I passi sono sempre sei. L è un carico, U ne impiega il dato, I è indipendente. L’inoltro è sempre attivo.',
    previsione: {
      domanda: (p) => 'Le tre istruzioni entrano nell’ordine ' + SL.unita366.NOME[p.ordine].replace(/ · /g, ', ') + (p.g > 1 ? ', e il gruppo si ripete ' + p.g + ' volte' : '') + '. La pipeline parte vuota. Quanti cicli trascorrono prima che l’ultima istruzione esca?',
      opzioni: (p) => [3 * p.g, 3 * p.g + 4, 4 * p.g + 4, 5 * p.g + 4].map((v) => [v, v + ' cicli'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' cicli. La sequenza ne occupa ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 3 * p.g ? 'Mancano i 4 cicli che l’ultima istruzione impiega per raggiungere lo stadio W.' : p.ordine === 'vicino' ? (pred === 3 * p.g + 4 ? 'Tale è il flusso ideale. In quest’ordine ogni U segue immediatamente il proprio carico, e attende un ciclo.' : 'Per effetto dell’inoltro ogni carico seguito da un uso costa un solo ciclo.') : 'In quest’ordine I separa ogni carico dal suo uso, e nessuna istruzione attende.'),
    costruisci(p) {
      const el = SL.el, U = SL.unita366, passi = [], T = U.traccia(p.ordine, p.g), n = 3 * p.g, vicino = p.ordine === 'vicino', larghi = 4 * p.g + 4, altro = U.traccia(vicino ? 'separa' : 'vicino', p.g), s = p.g > 1 ? '1' : '';
      const yb = 46 + T.righe.length * 27;
      const quadro = (o) => {
        const els = [el.nota('t0', 20, 0, 'CICLO', 'mono')];
        SL.pipe.diagramma('d', T.righe, { x: 110, y: 0, passo: p.g > 1 ? 58 : 84, cicli: larghi, py: 27, h: 22, fino: o.fino, evid: o.evid }).forEach((e) => els.push(e));
        els.push(el.box('b1', 20, yb, 264, 58, 'istruzioni completate', o.conti ? String(n) : '·', o.conti ? 'on' : '', { cls: 'stretta' }),
          el.box('b2', 298, yb, 264, 58, 'cicli', o.fino >= T.cicli ? String(T.cicli) : '·', o.conti ? 'att' : o.fino >= T.cicli ? 'on' : '', { cls: 'stretta' }),
          el.box('b3', 576, yb, 264, 58, 'attese per carico e uso', o.fino >= T.cicli ? String(T.attese) : '·', o.conti ? (T.attese ? 'err' : 'on') : o.fino >= T.cicli ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (o) => [['Ordine', U.NOME[p.ordine], 'a'], ['Ciclo in esame', o.evid ? String(o.evid) : '·'], ['Attese', o.fino >= T.cicli ? String(T.attese) : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o), els: quadro(o) }, extra));

      P({ fino: 2 }, 0, 'Il programma', 'L' + s + ' è il carico ' + U.TESTO.load + '. U' + s + ' è ' + U.TESTO.uso + ', che impiega il dato caricato in %rax. I' + s + ' è ' + U.TESTO.ind + ', indipendente dalle altre due. Entrano nell’ordine ' + T.istr.map((x) => x.n).join(', ') + '. I primi due cicli coincidono con quelli di un flusso ideale.',
        { chiedi: { d: 'L' + s + ' entra nello stadio F al ciclo 1. In quale ciclo legge il dato dalla memoria?', o: ['Ciclo 3', 'Ciclo 4', 'Ciclo 5'], g: 1, no: 'La memoria dei dati si legge nello stadio M, che L' + s + ' occupa al ciclo 4.' } });
      P({ fino: 3, evid: 3 }, 1, 'Il ciclo 3', vicino ? 'L' + s + ' è nello stadio E, dove l’ALU calcola l’indirizzo da leggere. U' + s + ' è nello stadio D e richiede %rax. Il dato deve ancora essere letto, e nessun inoltro può fornirlo. Il controllo rileva un carico seguito da un uso, e blocca i registri F e D.' : 'L' + s + ' è nello stadio E, dove l’ALU calcola l’indirizzo da leggere. Nello stadio D è presente I' + s + ', che legge %rsi. Fra le due istruzioni non esiste alcuna dipendenza, e I' + s + ' avanza senza attese.', { calc: vicino ? 'carico in E, uso in D: stallo' : 'carico in E, istruzione indipendente in D' });
      P({ fino: 4, evid: 4 }, 1, 'Il ciclo 4', vicino ? 'U' + s + ' è rimasta nello stadio D, e I' + s + ' nello stadio F. Nello stadio E avanza una bolla. L' + s + ' è nello stadio M e legge il dato, che a fine ciclo raggiunge lo stadio D con la sigla `m_valM`.' : 'U' + s + ' ha raggiunto lo stadio D e richiede %rax. L' + s + ' si trova già nello stadio M: il dato esce dalla memoria in questo ciclo, e l’inoltro lo fornisce a U' + s + ' con la sigla `m_valM`. Nel frattempo I' + s + ', nello stadio E, ha proseguito la propria esecuzione.', { calc: vicino ? 'U' + s + ' ripete lo stadio D · bolla in E' : 'm_valM inoltrato a U' + s + ' · nessuna attesa' });
      P({ fino: 5, evid: 5 }, 1, 'Il ciclo 5', vicino ? 'U' + s + ' entra nello stadio E con il valore corretto di %rax, un ciclo più tardi rispetto al flusso ideale. La bolla è avanzata nello stadio M. I' + s + ' entra soltanto ora nello stadio D.' : 'U' + s + ' entra nello stadio E con il valore corretto di %rax, nel medesimo ciclo previsto dal flusso ideale. L' + s + ' sta scrivendo %rax nel banco.', { calc: 'U' + s + ' nello stadio E al ciclo 5' + (vicino ? ' · un ciclo di ritardo' : ' · senza ritardo') });
      P({ fino: T.cicli }, 2, 'La traccia intera', 'La sequenza termina al ciclo ' + T.cicli + '. ' + (p.g > 1 ? (vicino ? 'Nel secondo gruppo la situazione si ripete: U2 segue immediatamente L2, e attende a sua volta un ciclo.' : 'Nel secondo gruppo vale lo stesso: I2 separa L2 da U2, e nessuna istruzione attende.') : (vicino ? 'Lo stadio ripetuto e la bolla sono gli unici scostamenti dal flusso ideale.' : 'Il diagramma coincide con quello di un flusso ideale.')), { calc: 'ultimo ciclo: ' + T.cicli });
      P({ fino: T.cicli, conti: true }, 3, 'Il conteggio', 'Le istruzioni completate sono ' + n + '. I cicli sono ' + n + ' + 4' + (T.attese ? ' + ' + T.attese : '') + ' = ' + T.cicli + ': ' + n + ' per le uscite, 4 per il riempimento' + (T.attese ? ' e ' + T.attese + (T.attese === 1 ? ' per l’attesa' : ' per le attese') : ', e nessuna attesa') + '. Nell’ordine ' + U.NOME[vicino ? 'separa' : 'vicino'].replace(/ · /g, ', ') + ' le medesime istruzioni occuperebbero ' + altro.cicli + ' cicli.', { calc: n + ' + 4' + (T.attese ? ' + ' + T.attese : '') + ' = ' + T.cicli + ' cicli', esito: [T.cicli + ' cicli · ' + (T.attese === 0 ? 'nessuna attesa' : T.attese === 1 ? '1 attesa' : T.attese + ' attese'), T.attese ? '' : 'si'] });
      return { passi, esito: T.cicli };
    }
  },
  bilancio: {
    regola: [
      'Un carico immediatamente seguito dal suo uso costa un ciclo di attesa. Se fra i due si trova almeno un’istruzione, l’inoltro fornisce il dato senza attese.',
      'Un riordino di istruzioni indipendenti può eliminare l’attesa lasciando invariato il risultato. I cicli di una sequenza sono le istruzioni, più 4, più le attese.'
    ],
    errori: [
      ['Ritenere che il riordino elimini lavoro.', 'Le istruzioni eseguite sono le medesime. L’attesa è occupata da un’istruzione che andava comunque eseguita.'],
      ['Riordinare senza verificare le dipendenze.', 'Lo scambio è lecito soltanto se l’istruzione spostata è indipendente dalle altre nei registri, nella memoria e nei codici di condizione.'],
      ['Contare due cicli di attesa per un carico.', 'Con l’inoltro è sufficiente un ciclo: il dato è fornito non appena esce dalla memoria.']
    ],
    saFare: ['Seguire una traccia con uno stallo.', 'Contare cicli e attese di una sequenza.', 'Riconoscere quando un riordino è lecito.'],
    esercizi: [
      { d: 'Il gruppo L, U, I è ripetuto tre volte, a partire dalla pipeline vuota. Quanti cicli occupa complessivamente?', segnaposto: 'Un numero', giuste: ['16', 'sedici'],
        ok: 'Nove istruzioni, 4 cicli di riempimento e 3 attese: 9 + 4 + 3 = 16.',
        diagnosi: [
          { se: ['13', 'tredici'], msg: 'Questo è il flusso ideale. In quest’ordine ogni U attende un ciclo.' },
          { se: ['19', 'diciannove'], msg: 'Ogni attesa dura un solo ciclo, per effetto dell’inoltro.' },
          { se: ['12', 'dodici'], msg: 'Mancano i 4 cicli di riempimento.' }
        ],
        altro: 'Il numero è diverso. Si sommino le istruzioni, i 4 cicli di riempimento e un ciclo per ogni attesa.',
        indizi: ['Le istruzioni sono 3 × 3 = 9.', 'Il flusso ideale occupa 9 + 4 cicli.', 'Le attese sono 3, una per gruppo.'],
        svolgimento: ['Istruzioni: 9.', 'Flusso ideale: 9 + 4 = 13 cicli.', 'Attese: 3.', 'Totale: 13 + 3 = 16 cicli.'] },
      { d: 'Il medesimo programma è riordinato in L, I, U, sempre ripetuto tre volte. Quanti cicli occupa?', segnaposto: 'Un numero', giuste: ['13', 'tredici'],
        ok: 'Nessuna attesa: 9 + 4 = 13 cicli.',
        diagnosi: [
          { se: ['16', 'sedici'], msg: 'Questo è il conteggio dell’ordine L, U, I. Con I fra il carico e l’uso le attese sono eliminate.' },
          { se: ['9', 'nove'], msg: 'Mancano i 4 cicli di riempimento.' }
        ],
        altro: 'Il numero è diverso. In quest’ordine nessuna istruzione attende.',
        indizi: ['Le istruzioni sono ancora 9.', 'Fra ogni carico e il suo uso è presente un’istruzione.', '9 + 4.'],
        svolgimento: ['Istruzioni: 9.', 'Attese: 0.', 'Totale: 9 + 4 = 13 cicli.'] },
      { d: 'Un programma contiene, nell’ordine, `mrmovq 0(%rbx), %rax`, `addq %rax, %rcx` e `subq %rcx, %rdx`. La `subq` può essere spostata fra le altre due per evitare l’attesa?', guida: 'Si scelga la risposta.', o: [
        { t: 'No, poiché la subq legge %rcx, che la addq deve ancora scrivere', ok: true, fb: 'Spostata prima della addq, la subq leggerebbe il valore precedente di %rcx, e il risultato cambierebbe.' },
        { t: 'Sì, poiché la subq è indipendente dal carico', fb: 'La subq è indipendente dal carico. Essa dipende tuttavia dalla addq, poiché legge %rcx.' },
        { t: 'Sì, poiché due operazioni aritmetiche possono sempre essere scambiate', fb: 'Lo scambio è lecito soltanto fra istruzioni indipendenti. In questo caso la seconda legge il risultato della prima.' }] }
    ],
    sfida: ['cslez3_6_04_random_assembly', 'Cronologia degli stadi e completamento']
  }
});
