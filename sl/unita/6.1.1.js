'use strict';
SL.unita611 = (() => {
  const CERCA = 2, RIFORN = 50;
  const linea = (a, L) => Math.floor(a / L);
  const conto = (p) => { const hit = linea(p.a, p.L) === 0; return { hit, seconda: hit ? CERCA : CERCA + RIFORN, totale: hit ? 2 * CERCA + RIFORN : 2 * (CERCA + RIFORN) }; };
  // s: { chiede, dentro: blocchi in cache, acc: blocco acceso nella RAM, sorgente, questa, totale, st }
  const quadro = (pre, p, s, o) => {
    const el = SL.el, els = [], n = 256 / p.L, wc = (o.w - (n - 1) * 6) / n;
    els.push(el.box(pre + 'c', o.x, o.y, o.w * 0.2, 54, 'CPU · legge', s.chiede || '·', s.chiede ? 'att' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'k', o.x + o.w * 0.2 + 10, o.y, o.w * 0.34 - 10, 54, 'cache · blocchi presenti', s.dentro.length ? s.dentro.map((k) => 'byte ' + k * p.L + '-' + (k * p.L + p.L - 1)).join(' · ') : 'vuota', s.st === 'hit' ? 'on' : s.st === 'miss' ? 'err' : s.dentro.length ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 's', o.x + o.w * 0.54 + 10, o.y, o.w * 0.2 - 10, 54, 'dato da', s.sorgente || '·', s.sorgente === 'cache' ? 'on' : s.sorgente ? 'att' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 't', o.x + o.w * 0.74 + 10, o.y, o.w * 0.26 - 10, 54, 'lettura · totale', s.questa + ' ns · ' + s.totale + ' ns', 'on', { cls: 'stretta' }));
    els.push(el.nota(pre + 'n', o.x, o.y + 70, 'RAM · 256 byte, divisi in blocchi di ' + p.L + ' byte', 'mono'));
    for (let k = 0; k < n; k++) els.push(el.cella(pre + 'r' + k, o.x + k * (wc + 6), o.y + 94, wc, 34, s.dentro.indexOf(k) >= 0 ? 'in cache' : '', s.acc === k ? 'att' : s.dentro.indexOf(k) >= 0 ? 'on' : '', { gi: k * p.L + '-' + (k * p.L + p.L - 1), piccola: true }));
    return els;
  };
  return { CERCA, RIFORN, linea, conto, quadro };
})();
SL.registra('6.1.1', {
  titolo: 'Perché le memorie formano una gerarchia',
  obiettivo: 'Obiettivo: spiegare per quale ragione un calcolatore impiega memorie di velocità diversa, e calcolare il tempo di due letture, distinguendo quella servita dalla cache da quella che richiede la RAM.',
  concetti: [['strati', 'Piccola e veloce, grande e lenta'], ['cache', 'I dati necessari nel livello più vicino'], ['byte', 'Un blocco comprende i byte adiacenti']],
  filigrana: ['strati', 'cache', 'memory'],
  richiami: {
    carte: [
      { sim: 'cache', da: 'Dall’unità 4.5.3', t: 'La cache', d: 'Una memoria più veloce che conserva una copia dei dati impiegati di recente.' },
      { sim: 'puntatore', da: 'Dall’unità 1.1.2', t: 'L’indirizzo', d: 'Il numero che identifica una cella di memoria.' },
      { sim: 'register', da: 'Dall’unità 1.1.2', t: 'Il registro', d: 'Una sede interna al processore, in cui un dato risiede per la durata di un’operazione.' }
    ],
    domanda: { d: 'Prima di proseguire: una memoria è divisa in gruppi di 64 byte, numerati da 0. In quale gruppo si trova il byte di indirizzo 130?', o: [
      { t: 'Nel gruppo 2', ok: true, fb: '130 diviso 64 dà 2, con resto 2: si tratta del terzo gruppo, che ha numero 2.' },
      { t: 'Nel gruppo 1', fb: 'Il gruppo 1 contiene i byte da 64 a 127.' },
      { t: 'Nel gruppo 3', fb: 'Il gruppo 3 ha inizio dal byte 192.' }
    ] }
  },
  idea: {
    titolo: 'Una memoria sola non può essere grande e veloce',
    termini: ['gerarchia di memoria', 'blocco di cache', 'hit e miss'],
    testo: [
      'Il progetto di una memoria impone una scelta. Le memorie più veloci hanno un costo elevato per byte e occupano lo spazio limitato accanto al processore, e sono pertanto piccole. Le memorie capienti hanno un costo ridotto per byte e sono lente. Un processore esegue un’istruzione in una frazione di nanosecondo, cioè di miliardesimo di secondo. Se a ogni lettura dovesse attendere la memoria più capiente, resterebbe inattivo per quasi tutto il tempo.',
      'La soluzione consiste nell’impiegarle tutte, disposte a livelli: una [[gerarchia di memoria]]. Al livello più alto si trovano i registri, in numero ridotto e di accesso immediato. Seguono la cache, la memoria principale, cioè la RAM, e infine i dischi del Modulo IV. A ogni livello la capienza cresce e la velocità diminuisce. Ogni livello conserva una copia dei dati del livello sottostante impiegati di recente. Finché il dato richiesto si trova in un livello alto, il processore opera con una memoria veloce. Quando manca, il dato è prelevato da un livello inferiore.',
      { fig: 'scena', w: 720, h: 70, titolo: 'Cinque livelli, con tempi di accesso di modello', nota: 'A ogni passo verso destra la capienza cresce, e il tempo di accesso cresce di molte volte.', els: [['registri', 'meno di 1 ns', 'att'], ['cache', '2 ns', 'on'], ['RAM', '50 ns', 'on'], ['SSD', '50 000 ns', 'zero'], ['disco', '5 000 000 ns', 'zero']].map((r, k) => SL.el.box('g' + k, 10 + k * 141, 6, 133, 54, r[0], r[1], r[2], { cls: 'stretta' })) },
      'Si consideri il passaggio fra cache e RAM. Quando il processore richiede un byte, consulta anzitutto la cache. Se il byte è presente, la lettura termina in quel punto: si tratta di un hit. Se manca si tratta di un miss, e occorre un rifornimento dalla RAM. La coppia [[hit e miss]] denomina i due esiti di ogni consultazione. In questo capitolo i tempi sono valori di modello: 2 ns per la consultazione della cache, dovuti in ogni caso, e 50 ns aggiuntivi per ogni rifornimento.',
      'Il rifornimento ha una proprietà determinante. Dalla RAM è trasferito in cache un intero gruppo di byte consecutivi, il [[blocco di cache]], in questo caso di 64 byte. Il costo del trasferimento è quasi il medesimo per un byte e per sessantaquattro, e i programmi tendono a impiegare dati vicini fra loro. La lettura del byte 0 trasferisce pertanto in cache anche i byte da 1 a 63, senza costi ulteriori.',
      'Per stabilire se una lettura sarà un hit è sufficiente una divisione. Il numero del blocco è il quoziente intero fra l’indirizzo e la dimensione del blocco, e il resto indica la posizione del byte al suo interno. Il byte 8 si trova nel blocco 0, poiché 8 diviso 64 dà 0, mentre il byte 64 si trova nel blocco 1. Se il byte 0 è appena stato letto, una lettura del byte 8 costa 2 ns, e una lettura del byte 64 ne costa 52.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processore legge il byte 0, con la cache vuota, e quindi un secondo byte. I controlli fissano l’indirizzo del secondo byte e la dimensione dei blocchi.',
      'L’esperimento segue ogni lettura dalla consultazione della cache all’arrivo del dato, e somma i tempi. È istruttivo confrontare una seconda lettura nel medesimo blocco con una immediatamente oltre il confine.'
    ],
    vedrai: [
      ['cpu', 'La lettura', 'In alto a sinistra: il byte richiesto dal processore, scritto come M[indirizzo].'],
      ['cache', 'La cache', 'Al centro: i blocchi presenti in cache, e la provenienza del dato.'],
      ['memory', 'La RAM', 'In basso: la RAM divisa in blocchi. Quelli copiati in cache sono contrassegnati.']
    ]
  },
  lab: {
    titolo: 'Due letture, un blocco',
    scena: { w: 860, h: 156 },
    atti: ['La cache vuota', 'La prima lettura', 'La seconda lettura', 'Il totale'],
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'Indirizzo della seconda lettura', opzioni: [[8, '8'], [40, '40'], [64, '64'], [100, '100']], valore: 8 },
      { id: 'L', tipo: 'scelta', eti: 'Dimensione del blocco', opzioni: [[32, '32 byte'], [64, '64 byte']], valore: 64 }
    ],
    nota: 'I passi sono sempre sei. I tempi sono di modello: 2 ns per ogni consultazione, 50 ns per ogni rifornimento.',
    previsione: {
      domanda: (p) => 'La cache è vuota, e i blocchi sono di ' + p.L + ' byte. Il processore legge il byte 0 e quindi il byte ' + p.a + '. Ogni consultazione costa 2 ns, ogni rifornimento dalla RAM 50 ns aggiuntivi. Quanto tempo richiedono complessivamente le due letture?',
      opzioni: () => [[54, '54 ns'], [104, '104 ns'], [4, '4 ns']]
    },
    confronto: (pred, esito, p) => { const U = SL.unita611, k = U.linea(p.a, p.L); return 'La previsione indicava ' + pred + ' ns. Le due letture richiedono ' + esito + ' ns. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 4 ? 'La prima lettura trova la cache vuota, e richiede comunque un rifornimento.' : esito === 54 ? 'Il byte ' + p.a + ' si trova nel blocco 0, il medesimo del byte 0: era già giunto in cache con il primo rifornimento.' : 'Il byte ' + p.a + ' si trova nel blocco ' + k + ', assente dalla cache, e occorre un secondo rifornimento.'); },
    costruisci(p) {
      const U = SL.unita611, c = U.conto(p), k = U.linea(p.a, p.L), passi = [], fine = (x) => x * p.L + p.L - 1;
      const P = (atto, titolo, testo, s, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Questa lettura', s.questa + ' ns', 'a'], ['Totale', s.totale + ' ns', 'c'], ['Dato da', s.sorgente || '·']], els: U.quadro('b', p, s, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 'La cache è vuota', 'Il programma è appena stato avviato, e la cache è vuota. La RAM è divisa in blocchi di ' + p.L + ' byte: il blocco 0 va dal byte 0 al byte ' + fine(0) + ', il blocco 1 dal ' + p.L + ' al ' + fine(1) + ', e così via.', { dentro: [], questa: 0, totale: 0 }, {});
      P(1, 'Prima lettura · consultazione', 'Il processore richiede il byte 0, scritto M[0], e consulta la cache in 2 ns. Il blocco 0 manca: si tratta di un miss.', { chiede: 'M[0]', dentro: [], st: 'miss', questa: 2, totale: 2 }, { calc: '2 ns · miss' });
      P(1, 'Prima lettura · rifornimento', 'La RAM consegna alla cache l’intero blocco 0, cioè i byte da 0 a ' + fine(0) + '. Il trasferimento costa 50 ns. Il byte 0 raggiunge il processore, e con esso sono giunti in cache altri ' + (p.L - 1) + ' byte.', { chiede: 'M[0]', dentro: [0], acc: 0, sorgente: 'RAM', questa: 52, totale: 52 }, { calc: '2 + 50 = 52 ns' });
      P(2, 'Seconda lettura · consultazione', 'Il processore richiede il byte ' + p.a + '. Il suo blocco è ' + p.a + ' diviso ' + p.L + ', cioè ' + k + '. Il processore consulta la cache, e impiega altri 2 ns.', { chiede: 'M[' + p.a + ']', dentro: [0], questa: 2, totale: 54 }, { calc: p.a + ' / ' + p.L + ' = ' + k + ' · blocco ' + k, chiedi: { d: 'Il byte ' + p.a + ' si trova nel blocco ' + k + '. Questo blocco è in cache?', o: ['Sì, è il blocco trasferito dal primo rifornimento', 'No, in cache è presente soltanto il blocco 0'], g: c.hit ? 0 : 1, no: c.hit ? 'Il blocco 0 contiene i byte da 0 a ' + fine(0) + ', e ' + p.a + ' è fra questi.' : 'Il blocco 0 termina al byte ' + fine(0) + '. Il byte ' + p.a + ' si trova oltre.' } });
      if (c.hit) P(2, 'Seconda lettura · hit', 'Il blocco 0 è presente: si tratta di un hit. Il byte ' + p.a + ' giunge al processore dalla cache, senza alcun accesso alla RAM.', { chiede: 'M[' + p.a + ']', dentro: [0], st: 'hit', sorgente: 'cache', questa: 2, totale: 54 }, { calc: '52 + 2 = 54 ns' });
      else P(2, 'Seconda lettura · rifornimento', 'Il blocco ' + k + ' manca: si tratta di un miss. La RAM consegna i byte da ' + k * p.L + ' a ' + fine(k) + ', con altri 50 ns.', { chiede: 'M[' + p.a + ']', dentro: [0, k], acc: k, sorgente: 'RAM', questa: 52, totale: 104 }, { calc: '52 + 52 = 104 ns' });
      P(3, 'Il totale', c.hit ? 'Due letture, un solo rifornimento: 52 + 2 = 54 ns. La seconda è costata 26 volte meno della prima, poiché il suo byte era giunto in cache insieme al byte 0.' : 'Due letture, due rifornimenti: 52 + 52 = 104 ns. Il byte ' + p.a + ' si trovava oltre il confine del blocco 0, escluso dal primo rifornimento.', { dentro: c.hit ? [0] : [0, k], sorgente: c.hit ? 'cache' : 'RAM', questa: c.seconda, totale: c.totale }, { calc: 'totale ' + c.totale + ' ns', esito: [c.totale + ' ns', ''] });
      return { passi, esito: c.totale };
    }
  },
  bilancio: {
    regola: [
      'Blocco di un byte = quoziente intero fra indirizzo e dimensione del blocco.',
      'Hit: è dovuta la sola consultazione. Miss: consultazione più rifornimento, che trasferisce in cache l’intero blocco.'
    ],
    errori: [
      ['Ritenere che il rifornimento trasferisca un solo byte.', 'È trasferito l’intero blocco, e i byte vicini divengono disponibili senza altri trasferimenti.'],
      ['Omettere la consultazione nei miss.', 'Anche una lettura che fallisce ha prima consultato la cache: 2 ns più 50 ns.'],
      ['Giudicare dalla distanza fra gli indirizzi.', 'È determinante il confine di blocco: 63 e 64 sono vicini, e si trovano in due blocchi diversi.']
    ],
    saFare: ['Calcolare il blocco di un indirizzo.', 'Stabilire se una lettura è un hit o un miss.', 'Sommare i tempi di una breve sequenza di letture.'],
    esercizi: [
      { d: 'I blocchi sono di 64 byte. In quale blocco si trova il byte di indirizzo 200?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: '200 diviso 64 dà 3, con resto 8.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'I blocchi sono numerati da 0: il quarto blocco ha numero 3.' },
          { se: ['8', 'otto'], msg: 'Otto è il resto, cioè la posizione del byte nel blocco.' },
          { se: ['2', 'due'], msg: 'Il blocco 2 termina al byte 191.' }
        ],
        altro: 'Il numero è diverso. Si divida l’indirizzo per 64 e si consideri il quoziente intero.',
        indizi: ['Il blocco 0 va da 0 a 63, il blocco 1 da 64 a 127.', 'Il blocco 3 ha inizio da 192.', '200 / 64 = 3, con resto 8.'],
        svolgimento: ['200 / 64 = 3 con resto 8.', 'Blocco: 3.'] },
      { d: 'La cache è vuota, i blocchi sono di 64 byte, la consultazione costa 2 ns e il rifornimento 50 ns. Il processore legge, nell’ordine, i byte 0, 10 e 70. Quanti nanosecondi occorrono complessivamente?', segnaposto: 'Un numero', giuste: ['106', '106 ns', '106ns'],
        ok: '52 + 2 + 52 = 106 ns: due miss e un hit.',
        diagnosi: [
          { se: ['156'], msg: 'Il byte 10 si trova nel blocco 0, già in cache dopo la prima lettura: costa 2 ns.' },
          { se: ['56'], msg: 'Il byte 70 si trova nel blocco 1, che manca: occorre un secondo rifornimento.' },
          { se: ['100'], msg: 'Ogni lettura comprende anche i 2 ns della consultazione.' }
        ],
        altro: 'Il totale è diverso. Si stabilisca per ogni lettura il blocco, e se quel blocco è già in cache.',
        indizi: ['Byte 0: blocco 0, miss, 52 ns.', 'Byte 10: blocco 0, hit, 2 ns.', 'Byte 70: blocco 1, miss, 52 ns.'],
        svolgimento: ['M[0]: 52 ns.', 'M[10]: 2 ns.', 'M[70]: 52 ns.', 'Totale: 106 ns.'] },
      { d: 'Per quale ragione un rifornimento trasferisce in cache un blocco intero, anziché il solo byte richiesto?', guida: 'Si scelga la risposta.', o: [
        { t: 'I byte vicini saranno probabilmente richiesti immediatamente dopo, e il trasferimento ha quasi il medesimo costo', ok: true, fb: 'Con un solo rifornimento si servono molte letture successive.' },
        { t: 'La RAM è incapace di consegnare un byte singolo', fb: 'La RAM può consegnarlo. La scelta dipende dal modo in cui i programmi impiegano i dati.' },
        { t: 'La cache deve essere sempre piena', fb: 'Una cache può restare in parte vuota. Lo scopo è disporre in anticipo dei dati che saranno richiesti.' }] }
    ],
    sfida: ['cslez6_1_01_memory_technologies', 'Tecnologie di memoria']
  }
});
