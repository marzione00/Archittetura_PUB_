'use strict';
SL.registra('1.5.5', {
  titolo: 'Dalle porte all’aritmetica',
  obiettivo: 'Obiettivo: descrivere la somma di una colonna di bit mediante cinque porte, e la somma di due numeri interi mediante una serie di tali circuiti.',
  concetti: [['alu', 'Sommatore'], ['porta', 'Porte'], ['pila', 'Riporto']],
  filigrana: ['alu', 'porta', 'pila'],
  richiami: {
    carte: [
      { sim: 'pila', da: 'Dall’unità 1.4.2', t: 'La somma di una colonna', d: 'Si sommano due bit e il riporto in arrivo. Il totale fornisce un bit che resta nella colonna e un riporto che passa a sinistra.' },
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'XOR, AND, OR', d: 'La XOR vale 1 quando gli ingressi sono diversi, la AND quando valgono entrambi 1, la OR quando almeno uno vale 1.' },
      { sim: 'clock', da: 'Dall’unità 1.5.4', t: 'Il ritardo', d: 'Ogni porta risponde dopo un certo tempo. Il risultato è valido quando il percorso più lento si è assestato.' }
    ],
    domanda: { d: 'Prima di proseguire: in una colonna si sommano 1, 1 e un riporto in arrivo che vale 1. Che cosa si scrive?', o: [
      { t: '1, con riporto 1', ok: true, fb: 'Il totale è tre, che in binario si scrive 11.' },
      { t: '0, con riporto 1', fb: 'La risposta corrisponde al caso in cui il totale è due. In questo caso gli 1 sono tre.' },
      { t: '3', fb: 'Una colonna binaria contiene soltanto 0 oppure 1. Il tre si scrive 11: un bit resta e uno viene riportato.' }
    ] }
  },
  idea: {
    titolo: 'Una colonna, cinque porte',
    termini: ['sommatore completo', 'sommatore a propagazione di riporto'],
    testo: [
      'L’unità 1.4.2 ha sommato due byte colonna per colonna. La regola di una colonna riceve tre bit, cioè i due addendi e il riporto in arrivo, e ne produce due: il bit della somma e il riporto in uscita. Si tratta di una funzione booleana con tre ingressi e due uscite, realizzabile pertanto con le porte.',
      'È utile considerare congiuntamente le due uscite. Lette come un numero binario di due cifre, riporto e somma indicano quanti dei tre ingressi valgono 1: nessuno, uno, due oppure tre.',
      { fig: 'celle', titolo: 'Le due uscite contano gli ingressi a 1', nota: 'La cifra di sinistra è il riporto in uscita, quella di destra è il bit della somma.', celle: [
        { so: 'nessun 1', v: '00', gi: 'zero' }, { so: 'un 1', v: '01', st: 'on', gi: 'uno' }, { so: 'due 1', v: '10', st: 'amb', gi: 'due' }, { so: 'tre 1', v: '11', st: 'amb', gi: 'tre' }] },
      'Il bit della somma vale 1 quando gli ingressi a 1 sono in numero dispari, uno oppure tre. Tale comportamento è quello della XOR. Sono sufficienti due porte: la prima calcola la XOR dei due addendi, la seconda la XOR di tale risultato con il riporto in arrivo.',
      'Il riporto in uscita vale 1 quando gli ingressi a 1 sono almeno due. Ciò avviene in due casi: i due addendi valgono entrambi 1, oppure sono diversi fra loro e il riporto in arrivo vale 1. Occorrono due porte AND, una per ciascun caso, e una OR che le unisce. Il circuito complessivo comprende cinque porte e prende il nome di [[sommatore completo]].',
      'Per sommare numeri di più bit si dispongono in serie tanti sommatori completi quante sono le colonne. Il riporto in uscita di ciascuno entra nel sommatore alla sua sinistra, e il primo a destra riceve 0. Tale disposizione prende il nome di [[sommatore a propagazione di riporto]].',
      'Il nome ne indica anche il limite. L’ultima colonna deve attendere il riporto della penultima, che attende quello della terzultima, e così di seguito. Al crescere della larghezza del numero cresce il tragitto del riporto, e con esso il tempo necessario all’assestamento del risultato. I processori reali impiegano circuiti più elaborati per ridurre tale attesa.'
    ]
  },
  esperimento: {
    faremo: [
      'Due numeri di quattro bit sono sommati da quattro sommatori completi in serie. Si parte dalla colonna di destra e si segue il riporto verso sinistra.',
      'In ogni colonna i passaggi sono tre: la XOR dei due addendi, il bit della somma, il riporto che esce verso la colonna successiva.'
    ],
    vedrai: [
      ['bit', 'Gli addendi', 'In alto: i bit di A e di B, colonna per colonna. La colonna 0 è a destra.'],
      ['porta', 'La prima XOR', 'Al centro di ogni colonna: il risultato intermedio impiegato da entrambe le uscite.'],
      ['pila', 'I riporti', 'Sotto: a destra di ogni colonna il riporto che entra, a sinistra quello che esce.']
    ]
  },
  lab: {
    titolo: 'Quattro sommatori in serie',
    scena: { w: 860, h: 330 },
    atti: ['I due numeri', 'Colonna 0', 'Colonna 1', 'Colonna 2', 'Colonna 3', 'Il risultato'],
    nota: 'Ogni colonna richiede tre passi. Al variare dei numeri varia il tragitto del riporto.',
    controlli: [
      { id: 'a', tipo: 'num', eti: 'A', min: 0, max: 15, salti: [1], valore: 11, pronti: [7, 11, 15] },
      { id: 'b', tipo: 'num', eti: 'B', min: 0, max: 15, salti: [1], valore: 6, pronti: [1, 6, 9] }
    ],
    previsione: {
      domanda: (p) => 'Si sommano ' + p.a + ' e ' + p.b + ', cioè ' + p.a.toString(2).padStart(4, '0') + ' e ' + p.b.toString(2).padStart(4, '0') + ', con quattro sommatori completi. Quanti di essi produrranno un riporto in uscita?',
      opzioni: () => [0, 1, 2, 3, 4]
    },
    confronto: (pred, esito) => 'La previsione indicava ' + pred + (pred === 1 ? ' riporto' : ' riporti') + '. I sommatori che hanno prodotto un riporto sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Un riporto esce quando almeno due dei tre ingressi valgono 1, e fra gli ingressi va contato anche il riporto giunto dalla colonna precedente.'),
    costruisci(p) {
      const el = SL.el, passi = [];
      const bit = (v, i) => (v >> i) & 1;
      const xc = (i) => 60 + (3 - i) * 196;
      const P1 = [null, null, null, null], S = [null, null, null, null], C = [0, null, null, null, null];   // C[i]: riporto che entra nella colonna i
      let prodotti = 0;
      const quadro = (o) => {
        o = o || {};
        const els = [];
        for (let i = 0; i < 4; i++) {
          const x = xc(i), qui = o.col === i;
          els.push(el.cella('a' + i, x + 22, 28, 58, 44, String(bit(p.a, i)), qui && o.f === 1 ? 'att' : bit(p.a, i) ? 'on' : 'zero', { piccola: true, so: 'A' + i }));
          els.push(el.cella('b' + i, x + 96, 28, 58, 44, String(bit(p.b, i)), qui && o.f === 1 ? 'att' : bit(p.b, i) ? 'on' : 'zero', { piccola: true, so: 'B' + i }));
          els.push(el.box('x' + i, x, 98, 176, 54, 'A XOR B', P1[i] === null ? '·' : String(P1[i]), qui && o.f === 1 ? 'att' : P1[i] === null ? 'off' : P1[i] ? 'on' : '', { cls: 'stretta' }));
          els.push(el.cella('e' + i, x + 112, 196, 54, 38, C[i] === null ? '·' : String(C[i]), qui && o.f === 2 ? 'att' : C[i] ? 'on' : C[i] === null ? 'off' : 'zero', { cls: 'minuta', so: 'entra' }));
          els.push(el.cella('u' + i, x + 10, 196, 54, 38, C[i + 1] === null ? '·' : String(C[i + 1]), qui && o.f === 3 ? 'att' : C[i + 1] ? 'on' : C[i + 1] === null ? 'off' : 'zero', { cls: 'minuta', so: 'esce' }));
          if (i < 3) els.push(el.linea('r' + i, x + 10, 215, x - 30, 215, C[i + 1] ? 'on' : ''));
          els.push(el.cella('s' + i, x + 59, 264, 58, 46, S[i] === null ? '·' : String(S[i]), qui && o.f === 2 ? 'att' : S[i] === null ? 'off' : S[i] ? 'on' : 'zero', { piccola: true, gi: null, so: 'S' + i }));
        }
        return els;
      };
      const hud = (i) => [['A + B', p.a + ' + ' + p.b, 'a'], ['Colonna', i == null ? '·' : i], ['Riporti prodotti', prodotti, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.col), els: quadro(o) }, extra));

      P({}, 0, 'Due numeri di quattro bit', 'A vale ' + p.a + ', in binario ' + p.a.toString(2).padStart(4, '0') + '. B vale ' + p.b + ', in binario ' + p.b.toString(2).padStart(4, '0') + '. A ogni colonna corrisponde un sommatore completo, e il primo a destra riceve un riporto in arrivo che vale 0.',
        { chiedi: { d: 'Nella colonna 0, A vale ' + bit(p.a, 0) + ' e B vale ' + bit(p.b, 0) + '. Quanto vale A XOR B?', o: ['0', '1'], g: bit(p.a, 0) ^ bit(p.b, 0), no: 'La XOR vale 1 quando i due ingressi sono diversi.' } });
      for (let i = 0; i < 4; i++) {
        const a = bit(p.a, i), b = bit(p.b, i), c = C[i], x = a ^ b, s = x ^ c, co = (a & b) | (c & x), uni = a + b + c;
        P1[i] = x;
        P({ col: i, f: 1 }, i + 1, 'Colonna ' + i + ': la XOR degli addendi', 'I due addendi valgono ' + a + ' e ' + b + '. Sono ' + (x ? 'diversi' : 'uguali') + ', quindi la prima XOR dà ' + x + '.',
          { calc: a + ' XOR ' + b + ' = ' + x, chiedi: { d: 'La prima XOR ha dato ' + x + ' e il riporto in arrivo vale ' + c + '. Quanto vale il bit della somma?', o: ['0', '1'], g: s, no: 'Il bit della somma è la XOR fra il risultato della prima porta e il riporto in arrivo: vale 1 quando i due sono diversi.' } });
        S[i] = s;
        P({ col: i, f: 2 }, i + 1, 'Colonna ' + i + ': il bit della somma', 'La seconda XOR confronta ' + x + ' con il riporto in arrivo, ' + c + '. Il bit della somma è ' + s + '. ' + (uni === 1 || uni === 3 ? 'Gli ingressi a 1 sono ' + uni + ', un numero dispari.' : 'Gli ingressi a 1 sono ' + uni + ', un numero pari.'),
          { calc: x + ' XOR ' + c + ' = ' + s, chiedi: { d: 'Fra A, B e il riporto in arrivo, gli ingressi che valgono 1 sono ' + uni + '. Da questa colonna esce un riporto?', o: ['Sì', 'No'], g: co ? 0 : 1, no: 'Il riporto esce quando almeno due dei tre ingressi valgono 1.' } });
        C[i + 1] = co; if (co) prodotti++;
        P({ col: i, f: 3 }, i + 1, 'Colonna ' + i + ': il riporto in uscita', (co
          ? (a & b ? 'I due addendi valgono entrambi 1, e ciò è sufficiente a produrre un riporto.' : 'Gli addendi sono diversi e il riporto in arrivo vale 1: gli ingressi a 1 sono due, ed esce quindi un riporto.')
          : 'Gli ingressi a 1 sono meno di due, e nessun riporto esce.') + (i < 3 ? ' Il valore ' + co + ' passa al sommatore della colonna ' + (i + 1) + '.' : ' È il riporto che esce dall’ultimo sommatore.'),
          { calc: '(' + a + ' AND ' + b + ') OR (' + c + ' AND ' + x + ') = ' + co });
      }
      const tot = p.a + p.b;
      P({}, 5, 'Il risultato', 'Letti da sinistra, il riporto finale e i quattro bit della somma formano ' + C[4] + S[3] + S[2] + S[1] + S[0] + ', cioè ' + tot + '. In base dieci, ' + p.a + ' + ' + p.b + ' dà esattamente ' + tot + '.' + (C[4] ? ' Il risultato supera 15, e occupa pertanto un quinto bit.' : ''), { calc: p.a + ' + ' + p.b + ' = ' + C[4] + S[3] + S[2] + S[1] + S[0] + ' = ' + tot });
      return { passi, esito: prodotti };
    }
  },
  bilancio: {
    regola: [
      'Un sommatore completo riceve due bit e un riporto. Il bit della somma è la XOR dei tre ingressi; il riporto esce quando almeno due ingressi valgono 1.',
      'Disponendo in serie un sommatore per colonna, con il riporto di ciascuno collegato al successivo, si sommano numeri di qualunque larghezza.'
    ],
    errori: [
      ['Trascurare il riporto in arrivo.', 'Ogni colonna ha tre ingressi. Il riporto della colonna precedente ha lo stesso rilievo dei due addendi.'],
      ['Calcolare le colonne in un ordine qualsiasi.', 'Il riporto procede da destra a sinistra. Una colonna può essere completata soltanto dopo quella alla sua destra.'],
      ['Scambiare le due uscite.', 'Il bit della somma resta nella colonna e ne ha il peso. Il riporto ha peso doppio e appartiene alla colonna successiva.']
    ],
    saFare: ['Calcolare le due uscite di un sommatore completo.', 'Indicare quali porte producono il bit della somma e quali il riporto.', 'Seguire il riporto lungo una serie di sommatori.'],
    esercizi: [
      { d: 'Un sommatore completo riceve A = 1, B = 0 e un riporto in arrivo che vale 1. Quali sono le sue uscite?', guida: 'Si scelga la risposta.', o: [
        { t: 'Bit di somma 1, riporto 0', fb: 'Gli ingressi a 1 sono due. Il totale è due, che in binario si scrive 10.' },
        { t: 'Bit di somma 0, riporto 1', ok: true, fb: 'Due ingressi a 1: il totale è due, cioè 10. Il bit della somma è 0 e il riporto è 1.' },
        { t: 'Bit di somma 1, riporto 1', fb: 'Le uscite indicate corrispondono a tre ingressi a 1. In questo caso B vale 0.' }] },
      { d: 'Quattro sommatori in serie calcolano 1111 + 0001. Quanti di essi producono un riporto in uscita?', segnaposto: 'Un numero da 0 a 4', giuste: ['4', 'quattro'],
        ok: 'Il riporto si origina nella colonna 0 e attraversa tutte le altre, poiché in ciascuna incontra un 1.',
        diagnosi: [
          { se: ['1', 'uno'], msg: 'Il riporto della colonna 0 entra nella colonna 1, dove incontra un altro 1. Il riporto va seguito fino all’ultima colonna.' },
          { se: ['0', 'zero'], msg: 'Nella colonna 0 si sommano 1 e 1: il totale è due, e un riporto esce.' },
          { se: ['3', 'tre'], msg: 'Anche l’ultima colonna riceve un riporto e contiene un 1. Il riporto esce dalla serie.' }
        ],
        altro: 'Il numero è diverso. Si parta dalla colonna di destra e si porti il riporto alla colonna successiva, una alla volta.',
        indizi: ['Colonna 0: 1 + 1 dà due, esce un riporto.', 'Colonna 1: 1 + 0 più il riporto dà due, esce un riporto.', 'Le colonne 2 e 3 si comportano come la colonna 1.'],
        svolgimento: ['Colonna 0: 1 + 1 = 10, riporto 1.', 'Colonne 1, 2 e 3: 1 + 0 + 1 = 10, riporto 1 in ciascuna.', 'I riporti prodotti sono 4, e il risultato è 10000, cioè sedici.'] }
    ]
  }
});
