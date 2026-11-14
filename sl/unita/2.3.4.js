'use strict';
SL.registra('2.3.4', {
  titolo: 'Strutture, allineamento e riempimento',
  obiettivo: 'Obiettivo: disporre i membri di una struttura rispettando i vincoli di allineamento, calcolarne la dimensione e trovare l’indirizzo di un membro.',
  concetti: [['tabella', 'Struttura e membri'], ['memory', 'Multipli obbligati'], ['byte', 'Byte di riempimento']],
  filigrana: ['tabella', 'byte', 'memory'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 1.7.1', t: 'Record', d: 'Un gruppo di campi che descrive un solo oggetto. Ogni campo ha una posizione e una larghezza.' },
      { sim: 'puntatore', da: 'Dall’unità 1.1.2', t: 'Spostamento', d: 'La distanza di una cella dall’indirizzo di partenza. L’indirizzo della cella è base più spostamento.' },
      { sim: 'memory', da: 'Dall’unità 2.3.2', t: 'Spiazzamento', d: 'Nell’indirizzo efficace è la costante già espressa in byte, sommata una volta sola.' }
    ],
    domanda: { d: 'Prima di proseguire: quale di questi numeri è un multiplo di 4?', o: [
      { t: '12', ok: true, fb: 'Dodici è 3 × 4. I multipli di 4 sono 0, 4, 8, 12, 16 e così via.' },
      { t: '10', fb: 'Dieci diviso 4 dà resto 2. I multipli di 4 adiacenti sono 8 e 12.' },
      { t: '6', fb: 'Sei è un multiplo di 2, mentre diviso 4 dà resto 2.' }
    ] }
  },
  idea: {
    titolo: 'Ogni membro al proprio multiplo',
    termini: ['struttura', 'membro', 'vincolo di allineamento', 'riempimento'],
    testo: [
      'Un array riunisce dati del medesimo tipo. Una [[struttura]] riunisce dati di tipo diverso che descrivono il medesimo oggetto, come il record del capitolo 1.7: un carattere, un intero, un numero corto. Ogni dato della struttura prende il nome di [[membro]] e ha un nome proprio. In memoria i membri sono disposti nell’ordine in cui il programma li dichiara.',
      'Si potrebbe supporre che i membri siano contigui, come gli elementi di un array. Spesso, invece, fra l’uno e l’altro restano byte vuoti. La causa è il [[vincolo di allineamento]]: un dato di due, quattro oppure otto byte deve cominciare a un indirizzo multiplo della propria dimensione. Il processore accede più rapidamente ai dati allineati, e alcune istruzioni li richiedono.',
      'Quando il primo indirizzo libero viola il vincolo, il compilatore avanza fino al primo multiplo adatto. I byte saltati prendono il nome di [[riempimento]]: appartengono alla struttura, ne aumentano la dimensione e restano privi di significato.',
      { fig: 'celle', titolo: 'Una struttura con un char seguito da un int', nota: 'Sopra ogni byte, lo spostamento dall’inizio. L’int deve cominciare a un multiplo di 4, e tre byte restano vuoti.', celle: [
        { so: '0', v: 'c', st: 'amb' }, { so: '1', v: '·', st: '' }, { so: '2', v: '·', st: '' }, { so: '3', v: '·', st: '' }, { so: '4', v: 'n', st: 'on' }, { so: '5', v: 'n', st: 'on' }, { so: '6', v: 'n', st: 'on' }, { so: '7', v: 'n', st: 'on' }] },
      'Il riempimento può trovarsi anche in coda. La dimensione di una struttura deve essere un multiplo del suo allineamento più restrittivo, quello del membro con il vincolo maggiore. In tal modo, in un array di strutture, ogni elemento comincia a un indirizzo allineato e tutti i membri conservano la propria posizione. L’operatore `sizeof` del C restituisce tale dimensione complessiva, riempimento compreso.',
      'Lo spostamento di un membro dall’inizio della struttura è fisso, ed è noto al compilatore. Nel codice macchina compare come spiazzamento: se RDI contiene l’indirizzo di una struttura e il membro n si trova a 4 byte dall’inizio, `mov eax, [rdi + 4]` lo legge. È questo l’impiego principale dello spiazzamento di un indirizzo efficace.',
      'L’ordine delle dichiarazioni modifica la quantità di riempimento. La regola pratica consiste nel dichiarare i membri dal più largo al più stretto: in tal modo ciascuno trova già un multiplo adatto, e resta al più una piccola quantità di riempimento in coda.'
    ]
  },
  esperimento: {
    faremo: [
      'Una struttura ha tre membri: un char di 1 byte, un int di 4 e uno short di 2. I controlli fissano l’ordine delle dichiarazioni. I membri sono collocati uno alla volta, e per ciascuno si cerca il primo spostamento ammesso.',
      'Seguono l’aggiunta del riempimento in coda e la ricerca del membro n in un array di strutture che comincia a 0x4000. Dopo il caso proposto, è istruttivo l’ordine int, short, char.'
    ],
    vedrai: [
      ['tabella', 'Le dichiarazioni', 'In alto a sinistra: i tre membri nell’ordine scelto, con dimensione e multipli richiesti.'],
      ['byte', 'I byte della struttura', 'Al centro: dodici byte numerati per spostamento. I puntini sono riempimento.'],
      ['memory', 'L’array', 'In basso: gli indirizzi a cui cominciano gli elementi di un array di queste strutture.']
    ]
  },
  lab: {
    titolo: 'Tre membri, un ordine, e i byte che restano vuoti',
    scena: { w: 860, h: 366 },
    atti: ['Le dichiarazioni', 'La collocazione dei membri', 'La coda', 'Nell’array', 'Il computo dei byte'],
    controlli: [
      { id: 'o', tipo: 'scelta', eti: 'Ordine dei membri', opzioni: [['cns', 'char, int, short'], ['csn', 'char, short, int'], ['ncs', 'int, char, short'], ['nsc', 'int, short, char'], ['scn', 'short, char, int'], ['snc', 'short, int, char']], valore: 'cns' },
      { id: 'k', tipo: 'num', eti: 'Elemento dell’array', min: 0, max: 3, salti: [1], valore: 1 }
    ],
    nota: 'La striscia mostra dodici byte: la struttura ne occupa otto oppure dodici, secondo l’ordine.',
    previsione: {
      domanda: (p) => 'Una struttura dichiara, nell’ordine, ' + SL.unita234.elenco(p.o) + '. Le dimensioni di char, int e short sono 1, 4 e 2 byte. Quanti byte occupa la struttura, riempimento compreso?',
      opzioni: () => [[7, '7 byte'], [8, '8 byte'], [10, '10 byte'], [12, '12 byte']]
    },
    confronto: (pred, esito, p) => {
      const d = SL.unita234.disponi(p.o);
      return 'La previsione indicava ' + pred + ' byte. La struttura ne occupa ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'I soli tre membri occupano 7 byte. Il riempimento ne aggiunge ' + (d.size - 7) + ': ' + (d.interno ? d.interno + ' fra i membri' : 'nessuno fra i membri') + ' e ' + (d.coda ? d.coda + ' in coda.' : 'nessuno in coda.'));
    },
    costruisci(p) {
      const el = SL.el, U = SL.unita234, d = U.disponi(p.o), passi = [], HA = (a) => '0x' + a.toString(16).toUpperCase();
      const M = d.membri, N = M.find((m) => m.id === 'n'), AK = 0x4000 + p.k * d.size, AN = AK + N.da;
      // posti: numero di membri già collocati; coda: riempimento finale visibile; arr: riga dell'array visibile.
      const quadro = (o) => {
        const els = [], fin = o.posti === 3 ? d.fine : o.posti ? M[o.posti - 1].a + 1 : 0;
        M.forEach((m, t) => els.push(el.box('d' + t, 20, t * 52, 250, 46, 'dimensione ' + m.dim + ' · multipli di ' + m.dim, m.tipo + ' ' + m.id + ';', o.att === t ? 'att' : t < o.posti ? 'on' : '', { cls: 'stretta' })));
        els.push(el.box('b1', 290, 0, 176, 64, 'primo libero', o.libero == null ? '·' : String(o.libero), o.att != null && o.att < 3 ? 'on' : '', { cls: 'stretta' }),
          el.box('b2', 478, 0, 176, 64, 'multipli richiesti', o.mult == null ? '·' : 'di ' + o.mult, o.att != null ? 'on' : '', { cls: 'stretta' }),
          el.box('b3', 666, 0, 174, 64, 'inizio scelto', o.scelto == null ? '·' : String(o.scelto), o.scelto != null ? 'att' : '', { cls: 'stretta' }),
          el.box('b4', 290, 78, 176, 64, 'riempimento finora', o.riemp == null ? '·' : o.riemp + ' byte', '', { cls: 'stretta' }),
          el.box('b5', 478, 78, 176, 64, 'fine dei membri', o.posti === 3 ? String(d.fine) : '·', o.coda && !o.arr ? 'on' : '', { cls: 'stretta' }),
          el.box('b6', 666, 78, 174, 64, 'sizeof', o.coda ? d.size + ' byte' : '·', o.coda ? (o.arr ? 'on' : 'att') : '', { cls: 'stretta' }),
          el.nota('ns', 20, 164, 'I BYTE DELLA STRUTTURA: SOPRA LO SPOSTAMENTO, DENTRO IL MEMBRO', 'mono'));
        for (let b = 0; b < 12; b++) {
          const t = M.findIndex((m) => b >= m.da && b <= m.a), posto = t >= 0 && t < o.posti;
          const vuoto = t < 0 && (b < fin || (o.coda && b < d.size)), fuori = b >= (o.coda ? d.size : 12);
          els.push(el.cella('y' + b, 20 + b * 68, 210, 62, 46, posto ? M[t].id : vuoto ? '·' : '', posto ? (o.att === t ? 'att' : 'on') : vuoto ? (o.nuovoVuoto && o.nuovoVuoto.includes(b) ? 'err' : 'zero') : fuori && o.coda ? 'off' : '', { so: String(b), piccola: true }));
        }
        if (o.libero != null && !o.coda && o.libero < 12) els.push(el.cursore('cur', 20 + o.libero * 68, 262, 62));
        for (let j = 0; j < 4; j++) els.push(el.box('e' + j, 20 + j * 150, 296, 140, 60, 'elemento ' + j, o.arr ? HA(0x4000 + j * d.size) : '·', o.arr && j === p.k ? 'att' : o.arr ? 'on' : '', { cls: 'stretta' }));
        els.push(el.box('en', 624, 296, 216, 60, 'membro n dell’elemento ' + p.k, o.arr ? HA(AN) : '·', o.arr ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (o) => [['Membri collocati', o.posti + ' su 3', 'a'], ['Riempimento', (o.riemp || 0) + ' byte'], ['sizeof', o.coda ? d.size + ' byte' : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o), els: quadro(o) }, extra));
      const chiediInizio = (m, libero) => { const o = Array.from(new Set([libero, m.da, m.da + m.dim])).sort((x, y) => x - y); return { d: 'Il prossimo membro è `' + m.tipo + ' ' + m.id + '`: ' + (m.dim === 1 ? 'occupa 1 byte e può cominciare a qualunque spostamento' : 'occupa ' + m.dim + ' byte e deve cominciare a un multiplo di ' + m.dim) + '. Il primo spostamento libero è ' + libero + '. Dove comincerà il membro?', o: o.map(String), g: o.indexOf(m.da), no: m.dim === 1 ? 'Un char ammette qualunque spostamento, e comincia al primo libero: ' + libero + '.' : m.da === libero ? libero + ' è già un multiplo di ' + m.dim + ', e il membro comincia a tale spostamento.' : 'Il numero ' + libero + ' non è multiplo di ' + m.dim + '. Il primo multiplo adatto è ' + m.da + '.' }; };

      P({ posti: 0, libero: 0, riemp: 0 }, 0, 'Tre dichiarazioni', 'La struttura dichiara, nell’ordine, ' + U.elenco(p.o) + '. Ogni membro ha una dimensione e deve cominciare a uno spostamento multiplo di quella dimensione. La striscia mostra dodici byte numerati per spostamento, cioè per distanza dall’inizio della struttura.', { chiedi: chiediInizio(M[0], 0) });
      let riemp = 0;
      M.forEach((m, t) => {
        const libero = t ? M[t - 1].a + 1 : 0, vuoti = []; for (let b = libero; b < m.da; b++) vuoti.push(b);
        riemp += vuoti.length;
        const succ = t < 2 ? { chiedi: chiediInizio(M[t + 1], m.a + 1) } : { chiedi: { d: 'I membri terminano allo spostamento ' + d.fine + '. La dimensione della struttura deve essere un multiplo di 4. Quanti byte di riempimento occorrono in coda?', o: ['0', '1', '2', '3'], g: d.coda, no: d.coda ? 'Il primo multiplo di 4 da ' + d.fine + ' in su è ' + d.size + ': occorrono ' + d.coda + ' byte.' : d.fine + ' è già un multiplo di 4, e la coda resta priva di riempimento.' } };
        P({ posti: t + 1, att: t, libero, mult: m.dim, scelto: m.da, riemp, nuovoVuoto: vuoti }, 1, 'Il membro ' + m.id + ', ' + (m.tipo === 'short' ? 'uno short' : 'un ' + m.tipo), 'Il primo spostamento libero è ' + libero + '. ' + (m.dim === 1 ? 'Un char occupa un solo byte e può cominciare a qualunque spostamento: il membro è collocato a ' + m.da + '.'
          : (m.tipo === 'int' ? 'Un int' : 'Uno short') + ' occupa ' + m.dim + ' byte e deve cominciare a un multiplo di ' + m.dim + '. ' + (vuoti.length ? 'Il numero ' + libero + ' non è multiplo di ' + m.dim + ', e il compilatore avanza fino a ' + m.da + '. ' + (vuoti.length === 1 ? 'Il byte ' + libero + ' resta vuoto e costituisce riempimento.' : 'I byte da ' + libero + ' a ' + (m.da - 1) + ' restano vuoti e costituiscono ' + vuoti.length + ' byte di riempimento.') : 'Il numero ' + libero + ' è già un multiplo di ' + m.dim + ', e il membro comincia a tale spostamento senza alcun riempimento.') + ' Il membro occupa gli spostamenti da ' + m.da + ' a ' + m.a + '.'),
          Object.assign({ calc: m.tipo + ' ' + m.id + ' · da ' + m.da + ' a ' + m.a }, succ));
      });
      const coda = []; for (let b = d.fine; b < d.size; b++) coda.push(b);
      P({ posti: 3, att: 3, mult: 4, riemp: riemp + d.coda, coda: true, nuovoVuoto: coda }, 2, d.coda ? 'Il riempimento in coda' : 'Una coda già allineata', 'Il membro con il vincolo maggiore è l’int, che richiede i multipli di 4. Anche la dimensione della struttura deve essere un multiplo di 4. I membri terminano a ' + d.fine + (d.coda ? ', e il primo multiplo adatto è ' + d.size + ': in coda ' + (d.coda === 1 ? 'resta 1 byte' : 'restano ' + d.coda + ' byte') + ' di riempimento.' : ', che è già un multiplo di 4: la coda resta priva di riempimento.') + ' L’operatore `sizeof` restituisce ' + d.size + '.',
        { calc: 'sizeof = ' + d.size + ' byte', chiedi: { d: 'Un array di queste strutture comincia a 0x4000, e ogni elemento occupa ' + d.size + ' byte. A quale indirizzo comincia l’elemento ' + p.k + '?', o: Array.from(new Set([0x4000 + p.k * d.size, 0x4000 + p.k * 7, 0x4000 + (p.k + 1) * d.size])).sort((x, y) => x - y).map(HA), g: Array.from(new Set([0x4000 + p.k * d.size, 0x4000 + p.k * 7, 0x4000 + (p.k + 1) * d.size])).sort((x, y) => x - y).indexOf(AK), no: 'L’indice conta gli elementi che precedono: ' + p.k + ' × ' + d.size + ' = ' + p.k * d.size + ' byte dopo la base.' } });
      P({ posti: 3, riemp: riemp + d.coda, coda: true, arr: true }, 3, 'Il membro n nell’array', 'In un array ogni struttura occupa ' + d.size + ' byte. L’elemento ' + p.k + ' comincia a 0x4000 + ' + p.k + ' × ' + d.size + ' = ' + HA(AK) + '. All’interno di ogni elemento il membro n si trova allo spostamento ' + N.da + ', e il suo indirizzo è quindi ' + HA(AN) + ', un multiplo di 4. Poiché la dimensione è multipla di 4, l’int resta allineato in ogni elemento dell’array.',
        { calc: HA(AK) + ' + ' + N.da + ' = ' + HA(AN) });
      P({ posti: 3, riemp: riemp + d.coda, coda: true, arr: true }, 4, 'Il computo dei byte', 'I tre membri occupano 7 byte, la struttura ' + d.size + '. Il riempimento vale ' + (d.size - 7) + ' byte: ' + (d.interno ? d.interno + ' fra i membri' : 'nessuno fra i membri') + ' e ' + (d.coda ? d.coda + ' in coda. ' : 'nessuno in coda. ') + (d.size === 8 ? 'Otto byte sono il minimo per questi tre membri: nessun ordine ne richiede meno.' : 'Con l’ordine int, short, char la medesima struttura occuperebbe 8 byte.'),
        { calc: '7 byte di membri + ' + (d.size - 7) + ' di riempimento = ' + d.size, esito: ['sizeof = ' + d.size, 'si'] });
      return { passi, esito: d.size };
    }
  },
  bilancio: {
    regola: [
      'Ogni membro comincia al primo spostamento libero che sia multiplo della propria dimensione. I byte saltati sono riempimento.',
      'La dimensione della struttura è un multiplo del suo allineamento più restrittivo, con riempimento in coda quando occorre. Lo spostamento di un membro compare nel codice come spiazzamento.'
    ],
    errori: [
      ['Sommare le dimensioni dei membri.', 'Un char, un int e uno short occupano insieme 7 byte. La struttura ne occupa 8 oppure 12, secondo l’ordine.'],
      ['Omettere il riempimento in coda.', 'Senza la coda, in un array il secondo elemento comincerebbe a un indirizzo privo dell’allineamento richiesto dal proprio int.'],
      ['Ritenere indifferente l’ordine dei membri.', 'L’ordine char, int, short occupa 12 byte. L’ordine int, short, char ne occupa 8.']
    ],
    saFare: ['Collocare i membri di una struttura rispettando i multipli richiesti.', 'Calcolare la dimensione della struttura, riempimento compreso.', 'Determinare l’indirizzo di un membro in un array di strutture.'],
    esercizi: [
      { d: 'Una struttura dichiara, nell’ordine, `char a; short b; char c; int d;`. A quale spostamento comincia il membro d?', segnaposto: 'Un numero', giuste: ['8', 'otto'],
        ok: 'Il membro a si trova a 0. Lo short b avanza a 2 e termina a 3. Il char c si trova a 4. L’int d richiede il primo multiplo di 4 da 5 in su, cioè 8.',
        diagnosi: [
          { se: ['4'], msg: 'In tal modo i membri sarebbero contigui. Lo short deve cominciare a un multiplo di 2 e l’int a un multiplo di 4.' },
          { se: ['5'], msg: 'Cinque è il primo spostamento libero dopo c. Un int deve cominciare a un multiplo di 4.' },
          { se: ['12'], msg: 'Dodici è la dimensione della struttura. Il membro d comincia prima.' }
        ],
        altro: 'Lo spostamento è diverso. Si collochino i membri uno alla volta, cercando per ciascuno il primo multiplo della propria dimensione.',
        indizi: ['Il char a occupa lo spostamento 0. Lo short b deve cominciare a un multiplo di 2.', 'b occupa 2 e 3, c occupa 4. Il primo libero è 5.', 'Il primo multiplo di 4 da 5 in su.'],
        svolgimento: ['a: spostamento 0.', 'b: primo multiplo di 2 da 1 in su, cioè 2. Occupa 2 e 3.', 'c: spostamento 4.', 'd: primo multiplo di 4 da 5 in su, cioè 8.'] },
      { d: 'RDI contiene l’indirizzo di una struttura che dichiara, nell’ordine, `int n; short s; char c;`. Quale istruzione carica in EAX il membro s, esteso con il segno?', guida: 'Si scelga la risposta.', o: [
        { t: 'movsx eax, word ptr [rdi + 4]', ok: true, fb: 'L’int occupa gli spostamenti da 0 a 3, e lo short comincia a 4. L’ampiezza è di due byte.' },
        { t: 'movsx eax, word ptr [rdi + 1]', fb: 'Lo spiazzamento conta byte. Il membro s è il secondo e comincia quattro byte dopo l’inizio.' },
        { t: 'mov eax, dword ptr [rdi + 4]', fb: 'L’istruzione legge quattro byte: i due di s, quello di c e un byte di riempimento.' }] }
    ]
  }
});
/* Disposizione dei tre membri secondo l'ordine scelto: c = char, n = int, s = short. */
SL.unita234 = (() => {
  const TIPI = { c: ['char', 1], n: ['int', 4], s: ['short', 2] };
  const elenco = (o) => o.split('').map((x) => '`' + TIPI[x][0] + ' ' + x + '`').join(', ');
  const disponi = (o) => {
    let off = 0, interno = 0;
    const membri = o.split('').map((x) => { const dim = TIPI[x][1], da = Math.ceil(off / dim) * dim; interno += da - off; off = da + dim; return { id: x, tipo: TIPI[x][0], dim, da, a: da + dim - 1 }; });
    const size = Math.ceil(off / 4) * 4;
    return { membri, fine: off, size, coda: size - off, interno };
  };
  return { elenco, disponi };
})();
