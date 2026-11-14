'use strict';
SL.registra('3.1.1', {
  titolo: 'Dalla specifica booleana ai blocchi del percorso dati',
  obiettivo: 'Obiettivo: tradurre una specifica espressa a parole in un circuito di porte e verificare che due circuiti diversi calcolino la medesima funzione.',
  concetti: [['tabella', 'Dalla richiesta alla tabella'], ['porta', 'Tre coppie e una OR'], ['bilancio', 'Due circuiti, una funzione']],
  filigrana: ['porta', 'tabella', 'gate'],
  richiami: {
    carte: [
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'AND e OR', d: 'La AND dà 1 soltanto quando entrambi gli ingressi valgono 1. La OR dà 1 quando almeno un ingresso vale 1.' },
      { sim: 'tabella', da: 'Dall’unità 1.5.2', t: 'La somma di mintermini', d: 'Per ogni riga della tabella di verità con uscita 1 si costruisce una AND, e una OR le riunisce tutte.' },
      { sim: 'alu', da: 'Dall’unità 1.5.5', t: 'Il riporto del sommatore', d: 'Il sommatore completo produce un riporto in uscita quando almeno due dei suoi tre ingressi valgono 1.' }
    ],
    domanda: { d: 'Prima di proseguire: quante righe ha la tabella di verità di una funzione con tre ingressi?', o: [
      { t: '8', ok: true, fb: 'Ogni ingresso raddoppia le combinazioni: 2 × 2 × 2 = 8.' },
      { t: '6', fb: 'Le combinazioni si moltiplicano, una per ingresso: 2 × 2 × 2, e il prodotto è 8.' },
      { t: '3', fb: 'Tre è il numero degli ingressi. Le righe sono le loro combinazioni, che sono 8.' }
    ] }
  },
  idea: {
    titolo: 'Dalle parole al circuito',
    termini: ['funzione di maggioranza', 'circuiti equivalenti', 'circuito combinatorio', 'percorso dati'],
    testo: [
      'Un progetto di hardware ha origine da una richiesta espressa a parole. Si considerino tre sensori che sorvegliano il medesimo varco, ciascuno dei quali trasmette un bit: 1 se rileva l’apertura, 0 in caso contrario. Poiché un sensore isolato può fornire una lettura errata, la spia di allarme deve accendersi quando almeno due sensori su tre segnalano l’apertura. Una richiesta tanto precisa da stabilire l’uscita in ogni caso possibile prende il nome di specifica.',
      'Il primo passo consiste nell’elencare tutti i casi. Con tre ingressi le combinazioni sono otto, e per ciascuna la specifica stabilisce se la spia sia accesa. La funzione risultante prende il nome di [[funzione di maggioranza]], poiché l’uscita riproduce il valore che compare più volte fra gli ingressi.',
      { fig: 'celle', titolo: 'La maggioranza di tre bit', nota: 'Sopra ogni cella sono riportati i valori di A, B e C; all’interno, lo stato della spia.', celle: [
        { so: '000', v: '0' }, { so: '001', v: '0' }, { so: '010', v: '0' }, { so: '011', v: '1', st: 'on' }, { so: '100', v: '0' }, { so: '101', v: '1', st: 'on' }, { so: '110', v: '1', st: 'on' }, { so: '111', v: '1', st: 'on' }] },
      'La somma di mintermini dell’unità 1.5.2 trasformerebbe le quattro righe a 1 in quattro mintermini, ciascuno con una AND a tre ingressi. Il circuito sarebbe corretto, e tuttavia ne esiste uno di dimensioni minori. Nelle righe in cui almeno due sensori valgono 1 esiste almeno una coppia di sensori entrambi a 1. Le coppie possibili sono tre: A con B, A con C, B con C. Tre AND a due ingressi esaminano le tre coppie, e una OR accende la spia quando almeno una di esse dà 1. In formula: AB OR AC OR BC.',
      'I due circuiti hanno struttura diversa e calcolano la medesima funzione. Essi si dicono [[circuiti equivalenti]], e l’equivalenza si verifica confrontando le rispettive tabelle di verità riga per riga. La scelta fra circuiti equivalenti dipende dal numero di porte e dal tempo di risposta.',
      'Un circuito di questo genere, in cui le uscite dipendono soltanto dai valori presenti in quell’istante sugli ingressi, prende il nome di [[circuito combinatorio]]. Esso è privo di memoria: una volta mutati gli ingressi, del caso precedente non resta traccia. La funzione di maggioranza è peraltro già nota dal Modulo I, poiché coincide con il riporto in uscita del sommatore completo.',
      'I blocchi trattati in questo capitolo, fino all’ALU, sono tutti combinatori. Collegati fra loro, essi formano il [[percorso dati]] del processore, cioè l’insieme dei circuiti attraverso i quali i dati transitano e sono trasformati.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento collega i tre sensori A, B e C a tre porte AND, una per coppia, e le tre AND a una OR che comanda la spia. I controlli fissano i valori dei tre sensori.',
      'Si osserva quali coppie danno 1 e se la spia rispetta la specifica. Dopo il caso proposto, è istruttivo portare a 1 tutti e tre i sensori e contare le AND con uscita 1.'
    ],
    vedrai: [
      ['input', 'I sensori', 'A sinistra: i tre bit A, B e C.'],
      ['porta', 'Le coppie', 'Al centro: tre porte AND, una per coppia di sensori.'],
      ['output', 'La spia', 'A destra: la OR che riunisce le tre coppie e la spia.']
    ]
  },
  lab: {
    titolo: 'Tre sensori, una spia',
    scena: { w: 860, h: 300 },
    atti: ['I sensori', 'Le tre coppie', 'La OR', 'Il confronto'],
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'Sensore A', opzioni: [[0, '0'], [1, '1']], valore: 1 },
      { id: 'b', tipo: 'scelta', eti: 'Sensore B', opzioni: [[0, '0'], [1, '1']], valore: 0 },
      { id: 'c', tipo: 'scelta', eti: 'Sensore C', opzioni: [[0, '0'], [1, '1']], valore: 1 }
    ],
    nota: 'I passi sono sempre sei. Al variare dei sensori variano le porte con uscita 1.',
    previsione: {
      domanda: (p) => 'I sensori valgono A = ' + p.a + ', B = ' + p.b + ' e C = ' + p.c + '. Quante delle tre porte AND, una per coppia di sensori, daranno 1?',
      opzioni: () => [0, 1, 2, 3]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Le AND che danno 1 sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 3 ? 'Con tre sensori a 1 ogni coppia è completa, quindi le AND con uscita 1 sono tre.' : esito === 1 ? 'Con due sensori a 1 esiste una sola coppia completa: quella formata dai due sensori a 1.' : 'Con meno di due sensori a 1 nessuna coppia è completa.') + (pred === 2 ? ' Due AND con uscita 1 costituiscono un caso impossibile, poiché due coppie complete richiedono tre sensori a 1, e in tal caso è completa anche la terza.' : ''),
    costruisci(p) {
      const el = SL.el, passi = [], V = { A: p.a, B: p.b, C: p.c }, n = p.a + p.b + p.c;
      const COPPIE = [['A', 'B'], ['A', 'C'], ['B', 'C']], YS = { A: 50, B: 136, C: 222 }, YA = [42, 128, 214];
      const and = [null, null, null]; let or = null, accese = 0;
      const quadro = (o) => {
        const els = [el.nota('t1', 30, 0, 'SENSORI', 'mono'), el.nota('t2', 300, 0, 'UNA AND PER COPPIA', 'mono'), el.nota('t3', 600, 0, 'OR E SPIA', 'mono')];
        ['A', 'B', 'C'].forEach((k) => els.push(el.cella('s' + k, 40, YS[k], 70, 52, String(V[k]), o.coppia != null && COPPIE[o.coppia].includes(k) ? 'att' : V[k] ? 'on' : 'zero', { so: k })));
        COPPIE.forEach((c, k) => {
          c.forEach((s, j) => els.push(el.linea('w' + k + j, 110, YS[s] + 26, 300, YA[k] + 22 + j * 24, V[s] ? 'on' : '')));
          els.push(el.box('g' + k, 300, YA[k], 190, 68, c[0] + ' AND ' + c[1], and[k] == null ? '·' : String(and[k]), o.coppia === k ? 'att' : and[k] == null ? 'off' : and[k] ? 'on' : '', { cls: 'stretta' }));
          els.push(el.linea('v' + k, 490, YA[k] + 34, 600, 142 + k * 20, and[k] ? 'on' : ''));
        });
        els.push(el.box('or', 600, 120, 110, 84, 'OR', or == null ? '·' : String(or), o.or ? 'att' : or == null ? 'off' : or ? 'on' : '', { cls: 'stretta' }),
          el.linea('wo', 710, 162, 750, 162, or ? 'on' : ''),
          el.box('sp', 750, 120, 96, 84, 'spia', or == null ? '·' : or ? 'accesa' : 'spenta', o.fine ? 'att' : or == null ? 'off' : or ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Sensori a 1', String(n), 'a'], ['AND accese', and[2] == null && !accese ? (and[0] == null ? '·' : String(accese)) : String(accese)], ['Spia', or == null ? '·' : or ? 'accesa' : 'spenta', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Tre bit in ingresso', 'I sensori trasmettono A = ' + p.a + ', B = ' + p.b + ' e C = ' + p.c + '. ' + (n === 0 ? 'Nessuno segnala l’apertura.' : n === 1 ? 'Uno solo segnala l’apertura.' : n === 2 ? 'Due segnalano l’apertura.' : 'Tutti e tre segnalano l’apertura.') + ' La specifica richiede la spia accesa con almeno due segnalazioni.',
        { chiedi: { d: 'Secondo la specifica, con ' + n + (n === 1 ? ' sensore' : ' sensori') + ' a 1 la spia deve accendersi?', o: ['Sì', 'No'], g: n >= 2 ? 0 : 1, no: 'La spia si accende con almeno due sensori a 1. In questo caso sono ' + n + '.' } });
      COPPIE.forEach((c, k) => {
        and[k] = V[c[0]] & V[c[1]]; if (and[k]) accese++;
        const succ = COPPIE[k + 1];
        P({ coppia: k }, 1, 'La coppia ' + c[0] + ', ' + c[1], 'La ' + (k === 0 ? 'prima' : k === 1 ? 'seconda' : 'terza') + ' AND riceve ' + c[0] + ' = ' + V[c[0]] + ' e ' + c[1] + ' = ' + V[c[1]] + '. ' + (and[k] ? 'Entrambi valgono 1, quindi la porta dà 1: questa coppia è sufficiente a raggiungere la soglia.' : 'Almeno uno dei due vale 0, quindi la porta dà 0.'),
          { calc: V[c[0]] + ' AND ' + V[c[1]] + ' = ' + and[k], chiedi: succ ? { d: 'La prossima AND riceve ' + succ[0] + ' = ' + V[succ[0]] + ' e ' + succ[1] + ' = ' + V[succ[1]] + '. Quale valore dà?', o: ['0', '1'], g: V[succ[0]] & V[succ[1]], no: 'La AND dà 1 soltanto quando entrambi gli ingressi valgono 1.' } : { d: 'Le tre AND hanno dato ' + and.join(', ') + '. Quale valore darà la OR che le riunisce?', o: ['0', '1'], g: accese ? 1 : 0, no: 'La OR dà 1 quando almeno uno dei suoi ingressi vale 1.' } });
      });
      or = accese ? 1 : 0;
      P({ or: true }, 2, 'La OR riunisce le coppie', 'La OR riceve ' + and.join(', ') + '. ' + (or ? 'Almeno un ingresso vale 1, quindi l’uscita vale 1 e la spia si accende.' : 'Tutti gli ingressi valgono 0, quindi l’uscita vale 0 e la spia resta spenta.'), { calc: and.join(' OR ') + ' = ' + or });
      P({ fine: true }, 3, 'Il circuito rispetta la specifica', 'Con ' + n + (n === 1 ? ' sensore' : ' sensori') + ' a 1 la specifica richiede la spia ' + (n >= 2 ? 'accesa' : 'spenta') + ', e il circuito la ' + (or ? 'accende' : 'lascia spenta') + '. Ripetendo la prova sulle otto combinazioni si ritrova la tabella della maggioranza, riga per riga. La somma di mintermini avrebbe richiesto quattro AND a tre ingressi, tre NOT e una OR, per un totale di otto porte contro le quattro impiegate in questo circuito.',
        { calc: 'AB OR AC OR BC = ' + or, esito: [or ? 'spia accesa' : 'spia spenta', 'si'] });
      return { passi, esito: accese };
    }
  },
  bilancio: {
    regola: [
      'Una specifica si traduce elencando tutti i casi in una tabella di verità. La tabella fissa la funzione, e i circuiti capaci di realizzarla sono molti.',
      'La maggioranza di tre bit vale AB OR AC OR BC. Due circuiti sono equivalenti quando hanno la medesima tabella di verità.'
    ],
    errori: [
      ['Fermarsi al primo circuito corretto.', 'La somma di mintermini dà sempre un circuito corretto, e spesso ne esiste uno equivalente con un numero minore di porte.'],
      ['Giudicare equivalenti due circuiti sulla base di pochi casi.', 'Occorre esaminare tutte le righe. Con tre ingressi sono otto, e una sola riga diversa è sufficiente a distinguere due funzioni.'],
      ['Confondere «almeno due» con «esattamente due».', 'Con tre sensori a 1 la spia deve restare accesa, poiché la specifica richiede almeno due segnalazioni.']
    ],
    saFare: ['Tradurre una richiesta a parole in una tabella di verità.', 'Costruire la maggioranza di tre bit con tre AND e una OR.', 'Verificare l’equivalenza di due circuiti confrontando le tabelle.'],
    esercizi: [
      { d: 'Una seconda spia deve accendersi quando esattamente due sensori su tre valgono 1. In quante righe della tabella di verità la sua uscita vale 1?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Le righe sono 011, 101 e 110. La riga 111 ha tre sensori a 1 e resta esclusa.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'Quattro sono le righe con almeno due sensori a 1. In questo caso la riga 111 va esclusa, poiché i sensori a 1 sono tre.' },
          { se: ['2', 'due'], msg: 'Due è il numero di sensori richiesto. La domanda riguarda le righe della tabella che soddisfano la richiesta.' },
          { se: ['8', 'otto'], msg: 'Otto sono tutte le righe della tabella. Vanno contate soltanto quelle con due sensori a 1.' }
        ],
        altro: 'Il numero è diverso. Si scrivano le otto combinazioni e si contino quelle che contengono due 1 e uno 0.',
        indizi: ['Le combinazioni di tre bit sono otto.', 'Si cercano quelle con due 1 e uno 0.', 'Lo 0 può occupare tre posizioni diverse.'],
        svolgimento: ['Combinazioni con due 1: 011, 101, 110.', 'La riga 111 ne contiene tre e va esclusa.', 'Righe con uscita 1: 3.'] },
      { d: 'Quale formula calcola la maggioranza dei tre bit A, B e C?', guida: 'Si scelga la risposta.', o: [
        { t: 'AB OR AC OR BC', ok: true, fb: 'Almeno due bit a 1 significa almeno una coppia completa, e le coppie sono tre.' },
        { t: 'A AND B AND C', fb: 'Questa formula vale 1 soltanto quando tutti e tre i bit valgono 1. Alla maggioranza ne sono sufficienti due.' },
        { t: 'A OR B OR C', fb: 'Questa formula vale 1 già con un solo bit a 1.' },
        { t: 'A XOR B XOR C', fb: 'Questa formula vale 1 quando i bit a 1 sono in numero dispari, quindi anche con uno solo.' }] }
    ],
    sfida: ['cslez3_1_01_random_assembly', 'Funzioni booleane di uno o più ingressi']
  }
});
