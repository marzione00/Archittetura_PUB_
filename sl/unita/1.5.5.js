'use strict';
SL.registra('1.5.5', {
  titolo: 'Dalle porte all’aritmetica',
  obiettivo: 'Alla fine saprai spiegare come cinque porte sommano una colonna di bit, e come una fila di questi circuiti somma due numeri interi.',
  concetti: [['alu', 'Sommatore'], ['porta', 'Porte'], ['pila', 'Riporto']],
  filigrana: ['alu', 'porta', 'pila'],
  richiami: {
    carte: [
      { sim: 'pila', da: 'Dall’unità 1.4.2', t: 'La somma di una colonna', d: 'Si sommano due bit e il riporto in arrivo. Il totale dà un bit che resta nella colonna e un riporto che passa a sinistra.' },
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'XOR, AND, OR', d: 'La XOR vale 1 quando gli ingressi sono diversi, la AND quando valgono entrambi 1, la OR quando almeno uno vale 1.' },
      { sim: 'clock', da: 'Dall’unità 1.5.4', t: 'Il ritardo', d: 'Ogni porta risponde dopo un certo tempo. Il risultato è valido quando il percorso più lento si è assestato.' }
    ],
    domanda: { d: 'Prima di proseguire: in una colonna si sommano 1, 1 e un riporto in arrivo che vale 1. Che cosa si scrive?', o: [
      { t: '1, con riporto 1', ok: true, fb: 'Il totale è tre, che in binario si scrive 11.' },
      { t: '0, con riporto 1', fb: 'Quello è il caso in cui il totale è due. Qui gli 1 sono tre.' },
      { t: '3', fb: 'Una colonna binaria contiene soltanto 0 oppure 1. Il tre si scrive 11: un bit resta e uno viene riportato.' }
    ] }
  },
  idea: {
    titolo: 'Una colonna, cinque porte',
    termini: ['sommatore completo', 'sommatore a propagazione di riporto'],
    testo: [
      'Nell’unità 1.4.2 abbiamo sommato due byte colonna per colonna. La regola di una colonna riceve tre bit, cioè i due addendi e il riporto in arrivo, e ne produce due: il bit della somma e il riporto in uscita. È una funzione booleana con tre ingressi e due uscite, quindi si può costruire con le porte.',
      'Conviene guardare le due uscite insieme. Lette come un numero binario di due cifre, riporto e somma dicono quanti dei tre ingressi valgono 1: nessuno, uno, due oppure tre.',
      { fig: 'celle', titolo: 'Le due uscite contano gli ingressi a 1', nota: 'La cifra di sinistra è il riporto in uscita, quella di destra è il bit della somma.', celle: [
        { so: 'nessun 1', v: '00', gi: 'zero' }, { so: 'un 1', v: '01', st: 'on', gi: 'uno' }, { so: 'due 1', v: '10', st: 'amb', gi: 'due' }, { so: 'tre 1', v: '11', st: 'amb', gi: 'tre' }] },
      'Il bit della somma vale 1 quando gli ingressi a 1 sono in numero dispari, uno oppure tre. È il comportamento della XOR. Bastano due porte: la prima fa la XOR dei due addendi, la seconda fa la XOR di quel risultato con il riporto in arrivo.',
      'Il riporto in uscita vale 1 quando gli ingressi a 1 sono almeno due. Succede in due casi: i due addendi valgono entrambi 1, oppure sono diversi fra loro e il riporto in arrivo vale 1. Servono due porte AND, una per ciascun caso, e una OR che le unisce. Il circuito completo ha cinque porte e si chiama [[sommatore completo]].',
      'Per sommare numeri di più bit si mettono in fila tanti sommatori completi quante sono le colonne. Il riporto in uscita di ciascuno entra nel sommatore alla sua sinistra, e il primo a destra riceve 0. Questa disposizione si chiama [[sommatore a propagazione di riporto]].',
      'Il nome descrive anche il suo limite. L’ultima colonna deve aspettare il riporto della penultima, che aspetta quello della terzultima, e così via. Più il numero è largo, più a lungo il riporto viaggia, e più tempo serve perché il risultato si assesti. I processori veri usano circuiti più raffinati per accorciare quell’attesa.'
    ]
  },
  esperimento: {
    faremo: [
      'Sommeremo due numeri di quattro bit con quattro sommatori completi in fila. Partiremo dalla colonna di destra e seguiremo il riporto verso sinistra.',
      'In ogni colonna le mosse sono tre: la XOR dei due addendi, il bit della somma, il riporto che esce verso la colonna successiva.'
    ],
    vedrai: [
      ['bit', 'Gli addendi', 'In alto: i bit di A e di B, colonna per colonna. La colonna 0 è a destra.'],
      ['porta', 'La prima XOR', 'Al centro di ogni colonna: il risultato intermedio che serve a entrambe le uscite.'],
      ['pila', 'I riporti', 'Sotto: a destra di ogni colonna il riporto che entra, a sinistra quello che esce.']
    ]
  },
  lab: {
    titolo: 'Quattro sommatori in fila',
    scena: { w: 860, h: 330 },
    atti: ['I due numeri', 'Colonna 0', 'Colonna 1', 'Colonna 2', 'Colonna 3', 'Il risultato'],
    nota: 'Ogni colonna richiede tre passi. Cambiando i numeri cambia la strada che il riporto percorre.',
    controlli: [
      { id: 'a', tipo: 'num', eti: 'A', min: 0, max: 15, salti: [1], valore: 11, pronti: [7, 11, 15] },
      { id: 'b', tipo: 'num', eti: 'B', min: 0, max: 15, salti: [1], valore: 6, pronti: [1, 6, 9] }
    ],
    previsione: {
      domanda: (p) => 'Sommiamo ' + p.a + ' e ' + p.b + ', cioè ' + p.a.toString(2).padStart(4, '0') + ' e ' + p.b.toString(2).padStart(4, '0') + ', con quattro sommatori completi. Quanti di loro produrranno un riporto in uscita?',
      opzioni: () => [0, 1, 2, 3, 4]
    },
    confronto: (pred, esito) => 'Avevi previsto ' + pred + (pred === 1 ? ' riporto' : ' riporti') + '. I sommatori che hanno prodotto un riporto sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Un riporto esce quando almeno due dei tre ingressi valgono 1, e fra gli ingressi va contato anche il riporto arrivato dalla colonna precedente.'),
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

      P({}, 0, 'Due numeri di quattro bit', 'A vale ' + p.a + ', in binario ' + p.a.toString(2).padStart(4, '0') + '. B vale ' + p.b + ', in binario ' + p.b.toString(2).padStart(4, '0') + '. Ogni colonna ha il suo sommatore completo. Il primo a destra riceve un riporto in arrivo che vale 0.',
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
          ? (a & b ? 'I due addendi valgono entrambi 1, e questo basta a produrre un riporto.' : 'Gli addendi sono diversi e il riporto in arrivo vale 1: insieme fanno due, quindi esce un riporto.')
          : 'Gli ingressi a 1 sono meno di due, quindi non esce alcun riporto.') + (i < 3 ? ' Il valore ' + co + ' passa al sommatore della colonna ' + (i + 1) + '.' : ' È il riporto che esce dall’ultimo sommatore.'),
          { calc: '(' + a + ' AND ' + b + ') OR (' + c + ' AND ' + x + ') = ' + co });
      }
      const tot = p.a + p.b;
      P({}, 5, 'Il risultato', 'Letti da sinistra, il riporto finale e i quattro bit della somma formano ' + C[4] + S[3] + S[2] + S[1] + S[0] + ', cioè ' + tot + '. In base dieci, ' + p.a + ' + ' + p.b + ' fa proprio ' + tot + '.' + (C[4] ? ' Il risultato supera 15, e per questo occupa un quinto bit.' : ''), { calc: p.a + ' + ' + p.b + ' = ' + C[4] + S[3] + S[2] + S[1] + S[0] + ' = ' + tot });
      return { passi, esito: prodotti };
    }
  },
  bilancio: {
    regola: [
      'Un sommatore completo riceve due bit e un riporto. Il bit della somma è la XOR dei tre ingressi; il riporto esce quando almeno due ingressi valgono 1.',
      'Mettendo in fila un sommatore per colonna, con il riporto di ciascuno collegato al successivo, si sommano numeri di qualunque larghezza.'
    ],
    errori: [
      ['Dimenticare il riporto in arrivo.', 'Ogni colonna ha tre ingressi. Il riporto della colonna precedente conta quanto i due addendi.'],
      ['Calcolare le colonne in un ordine qualsiasi.', 'Il riporto viaggia da destra a sinistra. Una colonna si può chiudere soltanto dopo quella alla sua destra.'],
      ['Scambiare le due uscite.', 'Il bit della somma resta nella colonna e pesa quanto la colonna. Il riporto pesa il doppio e appartiene alla colonna successiva.']
    ],
    saFare: ['Calcolo le due uscite di un sommatore completo.', 'Dico quali porte producono il bit della somma e quali il riporto.', 'Seguo il riporto lungo una fila di sommatori.'],
    esercizi: [
      { d: 'Un sommatore completo riceve A = 1, B = 0 e un riporto in arrivo che vale 1. Quali sono le sue uscite?', guida: 'Scegli la risposta.', o: [
        { t: 'Somma 1, riporto 0', fb: 'Gli ingressi a 1 sono due. Il totale è due, che in binario si scrive 10.' },
        { t: 'Somma 0, riporto 1', ok: true, fb: 'Due ingressi a 1: il totale è due, cioè 10. Il bit della somma è 0 e il riporto è 1.' },
        { t: 'Somma 1, riporto 1', fb: 'Quelle sono le uscite con tre ingressi a 1. Qui B vale 0.' }] },
      { d: 'Quattro sommatori in fila calcolano 1111 + 0001. Quanti di loro producono un riporto in uscita?', segnaposto: 'Un numero da 0 a 4', giuste: ['4', 'quattro'],
        ok: 'Il riporto nasce nella colonna 0 e attraversa tutte le altre, perché in ciascuna trova un 1.',
        diagnosi: [
          { se: ['1', 'uno'], msg: 'Il riporto della colonna 0 entra nella colonna 1, dove trova un altro 1. Seguilo fino in fondo.' },
          { se: ['0', 'zero'], msg: 'Nella colonna 0 si sommano 1 e 1: il totale è due, e un riporto esce.' },
          { se: ['3', 'tre'], msg: 'Anche l’ultima colonna riceve un riporto e contiene un 1. Il riporto esce dalla fila.' }
        ],
        altro: 'Il numero è diverso. Parti dalla colonna di destra e porta il riporto alla colonna successiva, una alla volta.',
        indizi: ['Colonna 0: 1 + 1 fa due, esce un riporto.', 'Colonna 1: 1 + 0 più il riporto fa due, esce un riporto.', 'Le colonne 2 e 3 si comportano come la colonna 1.'],
        svolgimento: ['Colonna 0: 1 + 1 = 10, riporto 1.', 'Colonne 1, 2 e 3: 1 + 0 + 1 = 10, riporto 1 in ciascuna.', 'I riporti prodotti sono 4, e il risultato è 10000, cioè sedici.'] }
    ]
  }
});
