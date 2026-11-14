'use strict';
SL.unita611 = (() => {
  const CERCA = 2, RIFORN = 50;
  const linea = (a, L) => Math.floor(a / L);
  const conto = (p) => { const hit = linea(p.a, p.L) === 0; return { hit, seconda: hit ? CERCA : CERCA + RIFORN, totale: hit ? 2 * CERCA + RIFORN : 2 * (CERCA + RIFORN) }; };
  // s: { chiede, dentro: linee in cache, acc: linea accesa nella RAM, sorgente, questa, totale, st }
  const quadro = (pre, p, s, o) => {
    const el = SL.el, els = [], n = 256 / p.L, wc = (o.w - (n - 1) * 6) / n;
    els.push(el.box(pre + 'c', o.x, o.y, o.w * 0.2, 54, 'CPU · legge', s.chiede || '·', s.chiede ? 'att' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'k', o.x + o.w * 0.2 + 10, o.y, o.w * 0.34 - 10, 54, 'cache · linee presenti', s.dentro.length ? s.dentro.map((k) => 'byte ' + k * p.L + '-' + (k * p.L + p.L - 1)).join(' · ') : 'vuota', s.st === 'hit' ? 'on' : s.st === 'miss' ? 'err' : s.dentro.length ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 's', o.x + o.w * 0.54 + 10, o.y, o.w * 0.2 - 10, 54, 'dato da', s.sorgente || '·', s.sorgente === 'cache' ? 'on' : s.sorgente ? 'att' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 't', o.x + o.w * 0.74 + 10, o.y, o.w * 0.26 - 10, 54, 'lettura · totale', s.questa + ' ns · ' + s.totale + ' ns', 'on', { cls: 'stretta' }));
    els.push(el.nota(pre + 'n', o.x, o.y + 70, 'RAM · 256 byte, divisi in linee di ' + p.L + ' byte', 'mono'));
    for (let k = 0; k < n; k++) els.push(el.cella(pre + 'r' + k, o.x + k * (wc + 6), o.y + 94, wc, 34, s.dentro.indexOf(k) >= 0 ? 'in cache' : '', s.acc === k ? 'att' : s.dentro.indexOf(k) >= 0 ? 'on' : '', { gi: k * p.L + '-' + (k * p.L + p.L - 1), piccola: true }));
    return els;
  };
  return { CERCA, RIFORN, linea, conto, quadro };
})();
SL.registra('6.1.1', {
  titolo: 'Perché le memorie formano una gerarchia',
  obiettivo: 'Obiettivo: spiegare perché un calcolatore usa memorie di velocità diversa, e calcolare il tempo di due letture distinguendo quella servita dalla cache da quella che richiede la RAM.',
  concetti: [['strati', 'Piccola e veloce, grande e lenta'], ['cache', 'Tenere vicino ciò che serve'], ['byte', 'Una linea porta con sé i vicini']],
  filigrana: ['strati', 'cache', 'memory'],
  richiami: {
    carte: [
      { sim: 'cache', da: 'Dall’unità 4.5.3', t: 'La cache', d: 'Una memoria più veloce che conserva una copia dei dati usati di recente.' },
      { sim: 'puntatore', da: 'Dall’unità 1.1.2', t: 'L’indirizzo', d: 'Il numero che identifica una cella di memoria.' },
      { sim: 'register', da: 'Dall’unità 1.1.2', t: 'Il registro', d: 'Una piccola sede interna al processore, in cui un dato sosta per il tempo di un’operazione.' }
    ],
    domanda: { d: 'Prima di proseguire: una memoria è divisa in gruppi di 64 byte, numerati da 0. In quale gruppo cade il byte di indirizzo 130?', o: [
      { t: 'Nel gruppo 2', ok: true, fb: '130 diviso 64 dà 2, con resto 2: è il terzo gruppo, che ha numero 2.' },
      { t: 'Nel gruppo 1', fb: 'Il gruppo 1 contiene i byte da 64 a 127.' },
      { t: 'Nel gruppo 3', fb: 'Il gruppo 3 comincia dal byte 192.' }
    ] }
  },
  idea: {
    titolo: 'Una memoria sola non può essere grande e veloce',
    termini: ['gerarchia di memoria', 'linea di cache', 'hit e miss'],
    testo: [
      'Chi progetta una memoria deve scegliere. Le memorie più veloci costano molto per ogni byte e occupano spazio prezioso accanto al processore, e quindi sono piccole. Quelle capienti costano poco per byte e sono lente. Un processore esegue un’istruzione in una frazione di nanosecondo, cioè di miliardesimo di secondo. Se a ogni lettura dovesse aspettare la memoria più capiente, passerebbe quasi tutto il tempo fermo.',
      'La soluzione è usarle tutte, disposte a livelli: una [[gerarchia di memoria]]. In cima stanno i registri, pochissimi e immediati. Sotto c’è la cache, poi la memoria principale, la RAM, e in fondo i dischi del Modulo IV. A ogni gradino la capienza cresce e la velocità cala. Ogni livello tiene una copia di ciò che, del livello sottostante, è stato usato da poco. Finché il dato cercato si trova in alto, il processore vede una memoria veloce. Quando manca, lo si va a prendere più in basso.',
      { fig: 'scena', w: 720, h: 70, titolo: 'Cinque livelli, con tempi di accesso di modello', nota: 'A ogni passo verso destra la capienza cresce, e il tempo di accesso cresce di molte volte.', els: [['registri', 'meno di 1 ns', 'att'], ['cache', '2 ns', 'on'], ['RAM', '50 ns', 'on'], ['SSD', '50 000 ns', 'zero'], ['disco', '5 000 000 ns', 'zero']].map((r, k) => SL.el.box('g' + k, 10 + k * 141, 6, 133, 54, r[0], r[1], r[2], { cls: 'stretta' })) },
      'Guardiamo da vicino il gradino fra cache e RAM. Quando il processore chiede un byte, per prima cosa consulta la cache. Se il byte c’è, la lettura finisce lì: è un hit. Se manca è un miss, e occorre un rifornimento dalla RAM. La coppia [[hit e miss]] dà il nome ai due esiti di ogni consultazione. In questo capitolo i tempi sono numeri di modello: 2 ns per consultare la cache, pagati sempre, e 50 ns in più per ogni rifornimento.',
      'Il rifornimento ha una particolarità che conta più di ogni altra. Dalla RAM viene portato in cache un intero gruppo di byte consecutivi, la [[linea di cache]], qui di 64 byte. Il costo del viaggio è quasi lo stesso per un byte e per sessantaquattro, e i programmi tendono a usare dati vicini fra loro. Leggere il byte 0 porta dunque in cache anche i byte da 1 a 63, senza altri costi.',
      'Per sapere se una lettura sarà un hit basta una divisione. Il numero della linea è il quoziente intero fra l’indirizzo e la lunghezza della linea. Il byte 8 sta nella linea 0, perché 8 diviso 64 dà 0. Il byte 64 sta nella linea 1. Se il byte 0 è appena stato letto, una lettura del byte 8 costa 2 ns, e una lettura del byte 64 ne costa 52.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processore legge il byte 0, con la cache vuota, e poi un secondo byte. Sceglierai l’indirizzo del secondo byte e la lunghezza delle linee.',
      'Seguiremo ogni lettura dalla consultazione della cache all’arrivo del dato, sommando i tempi. Confronta una seconda lettura dentro la stessa linea con una appena oltre il confine.'
    ],
    vedrai: [
      ['cpu', 'La lettura', 'In alto a sinistra: il byte chiesto dal processore, scritto come M[indirizzo].'],
      ['cache', 'La cache', 'Al centro: le linee presenti in cache, e da dove arriva il dato.'],
      ['memory', 'La RAM', 'In basso: la RAM divisa in linee. Quelle copiate in cache sono segnate.']
    ]
  },
  lab: {
    titolo: 'Due letture, una linea',
    scena: { w: 860, h: 156 },
    atti: ['La cache vuota', 'La prima lettura', 'La seconda lettura', 'Il conto'],
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'Indirizzo della seconda lettura', opzioni: [[8, '8'], [40, '40'], [64, '64'], [100, '100']], valore: 8 },
      { id: 'L', tipo: 'scelta', eti: 'Lunghezza della linea', opzioni: [[32, '32 byte'], [64, '64 byte']], valore: 64 }
    ],
    nota: 'I passi sono sempre sei. I tempi sono di modello: 2 ns per ogni consultazione, 50 ns per ogni rifornimento.',
    previsione: {
      domanda: (p) => 'La cache è vuota, e le linee sono di ' + p.L + ' byte. Il processore legge il byte 0 e poi il byte ' + p.a + '. Ogni consultazione costa 2 ns, ogni rifornimento dalla RAM 50 ns in più. Quanto tempo richiedono in tutto le due letture?',
      opzioni: () => [[54, '54 ns'], [104, '104 ns'], [4, '4 ns']]
    },
    confronto: (pred, esito, p) => { const U = SL.unita611, k = U.linea(p.a, p.L); return 'La previsione indicava ' + pred + ' ns. Le due letture richiedono ' + esito + ' ns. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 4 ? 'La prima lettura trova la cache vuota, e paga comunque un rifornimento.' : esito === 54 ? 'Il byte ' + p.a + ' sta nella linea 0, la stessa del byte 0: era già arrivato in cache con il primo rifornimento.' : 'Il byte ' + p.a + ' sta nella linea ' + k + ', assente dalla cache, e serve un secondo rifornimento.'); },
    costruisci(p) {
      const U = SL.unita611, c = U.conto(p), k = U.linea(p.a, p.L), passi = [], fine = (x) => x * p.L + p.L - 1;
      const P = (atto, titolo, testo, s, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Questa lettura', s.questa + ' ns', 'a'], ['Totale', s.totale + ' ns', 'c'], ['Dato da', s.sorgente || '·']], els: U.quadro('b', p, s, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 'La cache è vuota', 'Il programma è appena partito, e la cache è vuota. La RAM è divisa in linee di ' + p.L + ' byte: la linea 0 va dal byte 0 al byte ' + fine(0) + ', la linea 1 dal ' + p.L + ' al ' + fine(1) + ', e così via.', { dentro: [], questa: 0, totale: 0 }, {});
      P(1, 'Prima lettura · consultazione', 'Il processore chiede il byte 0, scritto M[0]. Consulta la cache, e impiega 2 ns. La linea 0 manca: è un miss.', { chiede: 'M[0]', dentro: [], st: 'miss', questa: 2, totale: 2 }, { calc: '2 ns · miss' });
      P(1, 'Prima lettura · rifornimento', 'La RAM consegna alla cache l’intera linea 0, cioè i byte da 0 a ' + fine(0) + '. Il viaggio costa 50 ns. Il byte 0 raggiunge il processore, e con lui sono arrivati in cache altri ' + (p.L - 1) + ' byte.', { chiede: 'M[0]', dentro: [0], acc: 0, sorgente: 'RAM', questa: 52, totale: 52 }, { calc: '2 + 50 = 52 ns' });
      P(2, 'Seconda lettura · consultazione', 'Il processore chiede il byte ' + p.a + '. La sua linea è ' + p.a + ' diviso ' + p.L + ', cioè ' + k + '. Il processore consulta la cache, e impiega altri 2 ns.', { chiede: 'M[' + p.a + ']', dentro: [0], questa: 2, totale: 54 }, { calc: p.a + ' / ' + p.L + ' = ' + k + ' · linea ' + k, chiedi: { d: 'Il byte ' + p.a + ' sta nella linea ' + k + '. Questa linea è in cache?', o: ['Sì: è la linea portata dal primo rifornimento', 'No: in cache c’è soltanto la linea 0'], g: c.hit ? 0 : 1, no: c.hit ? 'La linea 0 contiene i byte da 0 a ' + fine(0) + ', e ' + p.a + ' è fra questi.' : 'La linea 0 arriva fino al byte ' + fine(0) + '. Il byte ' + p.a + ' sta più avanti.' } });
      if (c.hit) P(2, 'Seconda lettura · hit', 'La linea 0 è presente: è un hit. Il byte ' + p.a + ' arriva al processore dalla cache, senza toccare la RAM.', { chiede: 'M[' + p.a + ']', dentro: [0], st: 'hit', sorgente: 'cache', questa: 2, totale: 54 }, { calc: '52 + 2 = 54 ns' });
      else P(2, 'Seconda lettura · rifornimento', 'La linea ' + k + ' manca: è un miss. La RAM consegna i byte da ' + k * p.L + ' a ' + fine(k) + ', con altri 50 ns.', { chiede: 'M[' + p.a + ']', dentro: [0, k], acc: k, sorgente: 'RAM', questa: 52, totale: 104 }, { calc: '52 + 52 = 104 ns' });
      P(3, 'Il conto', c.hit ? 'Due letture, un solo rifornimento: 52 + 2 = 54 ns. La seconda è costata 26 volte meno della prima, perché il suo byte era arrivato in cache insieme al byte 0.' : 'Due letture, due rifornimenti: 52 + 52 = 104 ns. Il byte ' + p.a + ' stava oltre il confine della linea 0, e il primo rifornimento non lo aveva portato.', { dentro: c.hit ? [0] : [0, k], sorgente: c.hit ? 'cache' : 'RAM', questa: c.seconda, totale: c.totale }, { calc: 'totale ' + c.totale + ' ns', esito: [c.totale + ' ns', ''] });
      return { passi, esito: c.totale };
    }
  },
  bilancio: {
    regola: [
      'Linea di un byte = quoziente intero fra indirizzo e lunghezza della linea.',
      'Hit: si paga la sola consultazione. Miss: consultazione più rifornimento, che porta in cache tutta la linea.'
    ],
    errori: [
      ['Pensare che il rifornimento porti un solo byte.', 'Arriva l’intera linea, e i byte vicini diventano disponibili senza altri viaggi.'],
      ['Dimenticare la consultazione nei miss.', 'Anche una lettura che fallisce ha prima consultato la cache: 2 ns più 50 ns.'],
      ['Giudicare dalla distanza fra gli indirizzi.', 'Conta il confine di linea: 63 e 64 sono vicini, e stanno in due linee diverse.']
    ],
    saFare: ['Calcolare la linea di un indirizzo.', 'Stabilire se una lettura è un hit o un miss.', 'Sommare i tempi di una breve sequenza di letture.'],
    esercizi: [
      { d: 'Le linee sono di 64 byte. In quale linea si trova il byte di indirizzo 200?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: '200 diviso 64 dà 3, con resto 8.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'Le linee sono numerate da 0: la quarta linea ha numero 3.' },
          { se: ['8', 'otto'], msg: 'Otto è il resto, cioè la posizione del byte dentro la linea.' },
          { se: ['2', 'due'], msg: 'La linea 2 arriva fino al byte 191.' }
        ],
        altro: 'Il numero è diverso. Si divida l’indirizzo per 64 e si prenda il quoziente intero.',
        indizi: ['La linea 0 va da 0 a 63, la linea 1 da 64 a 127.', 'La linea 3 comincia da 192.', '200 / 64 = 3, con resto 8.'],
        svolgimento: ['200 / 64 = 3 con resto 8.', 'Linea: 3.'] },
      { d: 'La cache è vuota, le linee sono di 64 byte, la consultazione costa 2 ns e il rifornimento 50 ns. Il processore legge, nell’ordine, i byte 0, 10 e 70. Quanti nanosecondi servono in tutto?', segnaposto: 'Un numero', giuste: ['106', '106 ns', '106ns'],
        ok: '52 + 2 + 52 = 106 ns: due miss e un hit.',
        diagnosi: [
          { se: ['156'], msg: 'Il byte 10 sta nella linea 0, già in cache dopo la prima lettura: costa 2 ns.' },
          { se: ['56'], msg: 'Il byte 70 sta nella linea 1, che manca: serve un secondo rifornimento.' },
          { se: ['100'], msg: 'Ogni lettura paga anche i 2 ns della consultazione.' }
        ],
        altro: 'Il totale è diverso. Si stabilisca per ogni lettura la linea, e se quella linea è già in cache.',
        indizi: ['Byte 0: linea 0, miss, 52 ns.', 'Byte 10: linea 0, hit, 2 ns.', 'Byte 70: linea 1, miss, 52 ns.'],
        svolgimento: ['M[0]: 52 ns.', 'M[10]: 2 ns.', 'M[70]: 52 ns.', 'Totale: 106 ns.'] },
      { d: 'Perché un rifornimento porta in cache una linea intera, invece del solo byte richiesto?', guida: 'Si scelga la risposta.', o: [
        { t: 'Perché i byte vicini saranno probabilmente chiesti subito dopo, e il viaggio costa quasi lo stesso', ok: true, fb: 'Con un solo rifornimento si servono molte letture successive.' },
        { t: 'Perché la RAM è incapace di consegnare un byte singolo', fb: 'La RAM può farlo. La scelta dipende dal modo in cui i programmi usano i dati.' },
        { t: 'Perché la cache deve essere sempre piena', fb: 'Una cache può restare in parte vuota. Lo scopo è avere già pronti i dati che serviranno.' }] }
    ],
    sfida: ['cslez6_1_01_memory_technologies', 'Tecnologie di memoria']
  }
});
