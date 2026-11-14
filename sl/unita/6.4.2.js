'use strict';
SL.unita642 = (() => {
  const conto = (p) => { const vpn = p.bit - 12, figlia = Math.floor(vpn / 2), radice = vpn - figlia, nr = Math.pow(2, radice), nf = Math.pow(2, figlia), pagine = Math.pow(2, vpn); return { vpn, radice, figlia, nr, nf, pagine, lineare: pagine * 8, byteRad: nr * 8, byteFig: nf * 8, due: (nr + p.reg * nf) * 8, soloFiglie: p.reg * nf * 8 }; };
  // f: 0 inizio · 1 pagine · 2 lineare · 3 radice · 4 figlie · 5 totale
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], c = conto(p), N = SL.num, w3 = (o.w - 20) / 3, wc = (o.w - 15 * 4) / 16;
    els.push(el.nota(pre + 't', o.x, o.y, 'LA RADICE · prime 16 voci di ' + N(c.nr) + ' · vale 1 chi ha una figlia', 'mono'));
    for (let k = 0; k < 16; k++) { const usata = k < p.reg; els.push(el.cella(pre + 'r' + k, o.x + k * (wc + 4), o.y + 26, wc, 30, f >= 3 ? (usata ? '1' : '0') : '', f >= 3 ? (usata ? (f === 4 ? 'att' : 'on') : 'zero') : '', { piccola: true, cls: 'minuta' })); }
    els.push(el.box(pre + 'q0', o.x, o.y + 68, w3, 54, 'pagine virtuali', f >= 1 ? '2 alla ' + c.vpn + ' = ' + N(c.pagine) : '·', f === 1 ? 'att' : f >= 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q1', o.x + w3 + 10, o.y + 68, w3, 54, 'tabella lineare', f >= 2 ? N(c.lineare) + ' byte' : '·', f === 2 ? 'att' : f >= 2 ? 'err' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q2', o.x + 2 * (w3 + 10), o.y + 68, w3, 54, 'radice', f >= 3 ? N(c.nr) + ' × 8 = ' + N(c.byteRad) + ' byte' : '·', f === 3 ? 'att' : f >= 3 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q3', o.x, o.y + 130, w3, 54, 'tabelle figlie', f >= 4 ? p.reg + ' × ' + N(c.byteFig) + ' = ' + N(c.soloFiglie) + ' byte' : '·', f === 4 ? 'att' : f >= 4 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q4', o.x + w3 + 10, o.y + 130, w3, 54, 'due livelli · totale', f >= 5 ? N(c.due) + ' byte' : '·', f >= 5 ? 'att' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q5', o.x + 2 * (w3 + 10), o.y + 130, w3, 54, 'lineare / due livelli', f >= 5 ? 'circa ' + Math.round(c.lineare / c.due) + ' volte' : '·', f >= 5 ? 'on' : '', { cls: 'stretta' }));
    return els;
  };
  return { conto, quadro };
})();
SL.registra('6.4.2', {
  titolo: 'Perché una tabella lineare diventa grande',
  obiettivo: 'Obiettivo: calcolare quanto spazio occupa una tabella delle pagine lineare, e quanto ne occupa una struttura a due livelli che tiene soltanto le parti in uso.',
  concetti: [['tabella', 'Una voce per ogni pagina possibile'], ['strati', 'Una radice e poche figlie'], ['bilancio', 'Megabyte contro kilobyte']],
  filigrana: ['tabella', 'strati', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 6.3.1', t: 'La voce', d: 'Un elemento di 8 byte della tabella delle pagine.' },
      { sim: 'bit', da: 'Dall’unità 1.2.1', t: 'Quante combinazioni', d: 'Con n bit si distinguono 2 alla n valori.' },
      { sim: 'operation', da: 'Dall’unità 6.3.3', t: 'I bit dell’offset', d: 'Con pagine da 4096 byte, i 12 bit più bassi di un indirizzo sono l’offset.' }
    ],
    domanda: { d: 'Prima di proseguire: un indirizzo virtuale ha 32 bit, e 12 sono di offset. Quanti bit restano per il numero di pagina?', o: [
      { t: '20', ok: true, fb: '32 − 12 = 20 bit, che distinguono 2 alla 20 pagine.' },
      { t: '12', fb: 'Dodici sono i bit dell’offset. Il numero di pagina occupa i restanti.' },
      { t: '32', fb: 'Dei 32 bit, 12 indicano la posizione dentro la pagina.' }
    ] }
  },
  idea: {
    titolo: 'Non tenere una voce per pagine che nessuno usa',
    termini: ['tabella lineare', 'tabella a due livelli'],
    testo: [
      'La tabella delle pagine del capitolo 6.3 aveva otto voci. Una tabella vera deve coprire tutto lo spazio di indirizzamento. Con indirizzi di 32 bit e pagine da 4096 byte, dodici bit sono di offset e ne restano venti per il numero di pagina: le pagine possibili sono 2 alla 20, cioè 1 048 576. Una tabella con una voce per ciascuna, messe in fila in un unico array, si chiama [[tabella lineare]].',
      'Con voci da 8 byte, una tabella lineare occupa 1 048 576 × 8 = 8 388 608 byte, più di 8 milioni, per ogni processo. Il difetto è che quasi tutte quelle voci sono inutili. Un programma tipico usa poche zone del proprio spazio: il codice in basso, la pila in alto, qualche zona di dati in mezzo. Fra una zona e l’altra ci sono distese di pagine mai toccate, e la tabella lineare tiene una voce, invalida, per ognuna.',
      'L’idea per risparmiare è spezzare la tabella in pezzi, e tenere in memoria soltanto i pezzi che servono. I venti bit del numero di pagina si dividono in due campi da dieci. Il primo campo sceglie una voce in una tabella piccola, la radice, che ha 1024 voci. Ogni voce della radice copre una regione di 1024 pagine consecutive, e conduce a una tabella figlia, anch’essa di 1024 voci, che contiene le traduzioni di quella regione. È una [[tabella a due livelli]].',
      { fig: 'scena', w: 720, h: 196, titolo: 'Due regioni usate su 1024', nota: 'La radice esiste sempre. Le figlie esistono soltanto per le due regioni usate: tutto il resto non occupa memoria.', els: SL.unita642.quadro('g', { bit: 32, reg: 2 }, 5, { x: 10, y: 4, w: 700 }) },
      'Il risparmio viene da una regola: se una regione non contiene alcuna pagina in uso, la sua voce nella radice è invalida, e la figlia non esiste. La radice va tenuta per intero, 1024 × 8 = 8192 byte. Ogni regione in uso costa una figlia completa, altri 8192 byte. Un programma che usa due regioni spende (1024 + 2 × 1024) × 8 = 24 576 byte, contro gli oltre 8 milioni della tabella lineare.',
      'Il risparmio ha un prezzo. Con due livelli una traduzione richiede due letture di memoria al posto di una: prima la radice, poi la figlia. I processori a 64 bit, che hanno spazi di indirizzamento sterminati, usano lo stesso schema con quattro o cinque livelli. Il costo di queste letture, e il modo in cui la TLB lo attenua, sono l’argomento delle prossime due unità.'
    ]
  },
  esperimento: {
    faremo: [
      'Calcoleremo lo spazio occupato dalle voci di una tabella lineare e di una a due livelli. Sceglierai quanti bit ha l’indirizzo virtuale, e quante regioni del suo spazio il programma usa.',
      'Guarda che cosa cambia aumentando le regioni: la tabella lineare resta com’è, mentre quella a due livelli cresce di una figlia per volta.'
    ],
    vedrai: [
      ['strati', 'La radice', 'In alto: le prime sedici voci della radice. Vale 1 la voce di una regione usata, che conduce a una tabella figlia. Vale 0 la voce di una regione vuota.'],
      ['bilancio', 'Il conto', 'In basso: le pagine possibili, la tabella lineare, la radice, le figlie, il totale e il rapporto.']
    ]
  },
  lab: {
    titolo: 'Lo spazio occupato dalle tabelle',
    scena: { w: 860, h: 196 },
    atti: ['Lo spazio virtuale', 'La tabella lineare', 'I due livelli', 'Il confronto'],
    controlli: [
      { id: 'bit', tipo: 'scelta', eti: 'Bit dell’indirizzo virtuale', opzioni: [[32, '32 bit'], [30, '30 bit']], valore: 32 },
      { id: 'reg', tipo: 'scelta', eti: 'Regioni usate dal programma', opzioni: [[1, '1'], [2, '2'], [8, '8']], valore: 2 }
    ],
    nota: 'I passi sono sempre sei. Le pagine sono da 4096 byte, le voci da 8 byte. I bit del numero di pagina si dividono a metà fra radice e figlie.',
    previsione: {
      domanda: (p) => { const c = SL.unita642.conto(p), N = SL.num; return 'Indirizzi virtuali di ' + p.bit + ' bit, pagine da 4096 byte, voci da 8 byte. Una tabella a due livelli ha una radice di ' + N(c.nr) + ' voci, e tabelle figlie di ' + N(c.nf) + ' voci. Il programma usa ' + (p.reg === 1 ? 'una sola regione' : p.reg + ' regioni') + '. Quanti byte occupano in tutto le tabelle?'; },
      opzioni: (p) => { const c = SL.unita642.conto(p), N = SL.num; return [[c.soloFiglie, N(c.soloFiglie) + ' byte'], [c.due, N(c.due) + ' byte'], [c.lineare, N(c.lineare) + ' byte']]; }
    },
    confronto: (pred, esito, p) => { const c = SL.unita642.conto(p), N = SL.num; return 'La previsione indicava ' + N(pred) + ' byte. Le tabelle occupano ' + N(esito) + ' byte. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === c.lineare ? 'Quello è lo spazio della tabella lineare, che tiene una voce per ogni pagina possibile. Con due livelli esistono soltanto la radice e le figlie delle regioni usate.' : 'Manca lo spazio della radice, ' + N(c.byteRad) + ' byte: va tenuta per intero anche quando le figlie sono poche.'); },
    costruisci(p) {
      const U = SL.unita642, c = U.conto(p), passi = [], N = SL.num;
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Lineare', f >= 2 ? N(c.lineare) : '·', 'a'], ['Due livelli', f >= 5 ? N(c.due) : '·', 'c'], ['Regioni usate', String(p.reg)]], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'Lo spazio da descrivere', 'Gli indirizzi virtuali hanno ' + p.bit + ' bit. Le pagine sono da 4096 byte, e quindi 12 bit sono di offset. Il programma usa ' + (p.reg === 1 ? 'una sola regione' : p.reg + ' regioni') + ' del proprio spazio.', {});
      P(1, 0, 'Le pagine possibili', 'Per il numero di pagina restano ' + p.bit + ' − 12 = ' + c.vpn + ' bit. Le pagine virtuali possibili sono 2 alla ' + c.vpn + ', cioè ' + N(c.pagine) + '.', { calc: '2 alla ' + c.vpn + ' = ' + N(c.pagine) + ' pagine' });
      P(2, 1, 'La tabella lineare', 'Una tabella lineare tiene una voce da 8 byte per ogni pagina possibile, usata o no: ' + N(c.pagine) + ' × 8 = ' + N(c.lineare) + ' byte. Il numero delle regioni usate non conta.', { calc: N(c.pagine) + ' × 8 = ' + N(c.lineare) + ' byte' });
      P(3, 2, 'La radice', 'Dividiamo i ' + c.vpn + ' bit del numero di pagina: ' + c.radice + ' alla radice e ' + c.figlia + ' alle figlie. La radice ha 2 alla ' + c.radice + ' = ' + N(c.nr) + ' voci, e occupa ' + N(c.nr) + ' × 8 = ' + N(c.byteRad) + ' byte. Va tenuta sempre, per intero.', { calc: N(c.nr) + ' × 8 = ' + N(c.byteRad) + ' byte', chiedi: { d: 'Una regione non contiene pagine in uso. Che cosa serve per descriverla?', o: ['Una voce invalida nella radice, e nessuna figlia', 'Una figlia con tutte le voci invalide', 'Nulla: nemmeno la voce nella radice'], g: 0, no: 'La voce della radice esiste per ogni regione. È la figlia a mancare, quando la regione è vuota.' } });
      P(4, 2, 'Le tabelle figlie', 'Ogni regione usata ha una figlia di ' + N(c.nf) + ' voci, cioè ' + N(c.byteFig) + ' byte. Le regioni usate sono ' + p.reg + ': ' + p.reg + ' × ' + N(c.byteFig) + ' = ' + N(c.soloFiglie) + ' byte. Le altre ' + N(c.nr - p.reg) + ' regioni non hanno una figlia.', { calc: p.reg + ' × ' + N(c.byteFig) + ' = ' + N(c.soloFiglie) + ' byte' });
      P(5, 3, 'Il confronto', 'In tutto la struttura a due livelli occupa ' + N(c.byteRad) + ' + ' + N(c.soloFiglie) + ' = ' + N(c.due) + ' byte. La tabella lineare ne occupava ' + N(c.lineare) + ', circa ' + Math.round(c.lineare / c.due) + ' volte tanto. Ogni regione in più costerebbe una figlia, ' + N(c.byteFig) + ' byte.', { calc: N(c.byteRad) + ' + ' + N(c.soloFiglie) + ' = ' + N(c.due) + ' byte', esito: [N(c.due) + ' byte', ''] });
      return { passi, esito: c.due };
    }
  },
  bilancio: {
    regola: [
      'Tabella lineare: 2 alla (bit dell’indirizzo − bit dell’offset) voci, tutte presenti.',
      'Due livelli: voci della radice + regioni usate × voci di una figlia, il tutto per la grandezza di una voce.'
    ],
    errori: [
      ['Dimenticare la radice nel conto.', 'La radice esiste sempre, per intero, anche con una sola regione usata.'],
      ['Far dipendere la tabella lineare dalle pagine usate.', 'La tabella lineare ha una voce per ogni pagina possibile, usata o no.'],
      ['Credere che i due livelli siano gratuiti.', 'Ogni traduzione richiede due letture di memoria al posto di una.']
    ],
    saFare: ['Calcolare le pagine di uno spazio di indirizzamento.', 'Calcolare i byte di una tabella lineare.', 'Calcolare i byte di una struttura a due livelli.'],
    esercizi: [
      { d: 'Indirizzi virtuali di 24 bit e pagine da 4096 byte. Quante voci ha una tabella lineare?', segnaposto: 'Un numero', giuste: ['4096', '4 096'],
        ok: '24 − 12 = 12 bit di numero di pagina: 2 alla 12 = 4096 voci.',
        diagnosi: [
          { se: ['12', 'dodici'], msg: 'Dodici sono i bit. Le voci sono 2 alla 12.' },
          { se: ['16777216', '16 777 216'], msg: 'Questo è il numero dei byte dello spazio. Le voci sono una per pagina.' },
          { se: ['32768', '32 768'], msg: 'Questi sono i byte occupati dalla tabella. La domanda riguarda le voci.' }
        ],
        altro: 'Il numero è diverso. Si tolgano i bit dell’offset e si calcoli 2 elevato ai bit rimasti.',
        indizi: ['Bit dell’offset: 12.', 'Bit del numero di pagina: 24 − 12 = 12.', '2 alla 12 = 4096.'],
        svolgimento: ['Bit del numero di pagina: 12.', 'Voci: 4096.'] },
      { d: 'Una struttura a due livelli ha una radice di 1024 voci e figlie di 1024 voci, con voci da 8 byte. Il programma usa 3 regioni. Quanti byte occupano le tabelle?', segnaposto: 'Un numero', giuste: ['32768', '32 768'],
        ok: '(1024 + 3 × 1024) × 8 = 4096 × 8 = 32 768 byte.',
        diagnosi: [
          { se: ['24576', '24 576'], msg: 'Mancano gli 8192 byte della radice.' },
          { se: ['4096', '4 096'], msg: 'Queste sono le voci. Ogni voce occupa 8 byte.' },
          { se: ['8388608', '8 388 608'], msg: 'Questo è lo spazio della tabella lineare.' }
        ],
        altro: 'Il numero è diverso. Somma le voci della radice e delle tre figlie, e moltiplica per 8.',
        indizi: ['Radice: 1024 voci.', 'Figlie: 3 × 1024 = 3072 voci.', '4096 × 8 = 32 768.'],
        svolgimento: ['Voci: 1024 + 3072 = 4096.', 'Byte: 32 768.'] },
      { d: 'Perché una tabella a due livelli occupa meno spazio di una lineare?', guida: 'Si scelga la risposta.', o: [
        { t: 'Perché le regioni mai usate non hanno una tabella figlia', ok: true, fb: 'Per una regione vuota basta una voce invalida nella radice.' },
        { t: 'Perché le sue voci sono più piccole', fb: 'Le voci hanno la stessa grandezza. Sono molte meno.' },
        { t: 'Perché copre uno spazio di indirizzamento più piccolo', fb: 'Lo spazio coperto è lo stesso. Cambia quanta parte della tabella esiste in memoria.' }] }
    ],
    sfida: ['cslez6_4_03_multilevel_indexes', 'Indici delle tabelle multilivello']
  }
});
