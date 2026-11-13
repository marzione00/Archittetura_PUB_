'use strict';
SL.registra('3.1.1', {
  titolo: 'Dalla specifica booleana ai blocchi del percorso dati',
  obiettivo: 'Alla fine saprai tradurre una richiesta espressa a parole in un circuito di porte, e verificare che due circuiti diversi calcolano la stessa funzione.',
  concetti: [['tabella', 'Dalla richiesta alla tabella'], ['porta', 'Tre coppie e una OR'], ['bilancio', 'Due circuiti, una funzione']],
  filigrana: ['porta', 'tabella', 'gate'],
  richiami: {
    carte: [
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'AND e OR', d: 'La AND dà 1 soltanto quando entrambi gli ingressi valgono 1. La OR dà 1 quando almeno un ingresso vale 1.' },
      { sim: 'tabella', da: 'Dall’unità 1.5.2', t: 'La ricetta dei mintermini', d: 'Per ogni riga della tabella di verità con uscita 1 si costruisce una AND, e una OR le riunisce tutte.' },
      { sim: 'alu', da: 'Dall’unità 1.5.5', t: 'Il riporto del sommatore', d: 'Dal sommatore completo esce un riporto quando almeno due dei suoi tre ingressi valgono 1.' }
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
      'Un progetto di hardware comincia da una richiesta scritta a parole. Tre sensori sorvegliano la stessa porta di un magazzino, e ciascuno manda un bit: 1 se la vede aperta, 0 se la vede chiusa. Un sensore da solo può sbagliare. Per questo la spia di allarme deve accendersi quando almeno due sensori su tre segnalano l’apertura. Una richiesta precisa al punto da stabilire l’uscita in ogni caso possibile è una specifica.',
      'Il primo passo consiste nell’elencare tutti i casi. Con tre ingressi le combinazioni sono otto, e per ciascuna la specifica dice se la spia è accesa. La funzione che ne risulta si chiama [[funzione di maggioranza]], perché l’uscita copia il valore che compare più volte fra gli ingressi.',
      { fig: 'celle', titolo: 'La maggioranza di tre bit', nota: 'Sopra ogni cella i valori di A, B e C. Dentro, lo stato della spia.', celle: [
        { so: '000', v: '0' }, { so: '001', v: '0' }, { so: '010', v: '0' }, { so: '011', v: '1', st: 'on' }, { so: '100', v: '0' }, { so: '101', v: '1', st: 'on' }, { so: '110', v: '1', st: 'on' }, { so: '111', v: '1', st: 'on' }] },
      'La ricetta dell’unità 1.5.2 trasformerebbe le quattro righe a 1 in quattro mintermini, ciascuno con una AND a tre ingressi. Il circuito sarebbe corretto, e tuttavia ne esiste uno più piccolo. Dove almeno due sensori valgono 1, esiste almeno una coppia di sensori entrambi a 1. Le coppie possibili sono tre: A con B, A con C, B con C. Tre AND a due ingressi sorvegliano le tre coppie, e una OR accende la spia appena una di loro dà 1. In formula: AB OR AC OR BC.',
      'I due circuiti hanno forme diverse e calcolano la stessa funzione. Si dicono [[circuiti equivalenti]], e per verificarlo basta confrontare le loro tabelle di verità riga per riga. Il progettista sceglie fra circuiti equivalenti guardando al numero di porte e al tempo di risposta.',
      'Un circuito di questo genere, in cui le uscite dipendono soltanto dai valori presenti in quel momento sugli ingressi, si chiama [[circuito combinatorio]]. È privo di memoria: cambiati gli ingressi, del caso precedente non resta traccia. La maggioranza, del resto, è una vecchia conoscenza: è il riporto in uscita del sommatore completo.',
      'I blocchi di questo capitolo, fino all’ALU, sono tutti combinatori. Collegati fra loro formano il [[percorso dati]] del processore, cioè l’insieme dei circuiti attraverso cui i dati passano e vengono trasformati.'
    ]
  },
  esperimento: {
    faremo: [
      'Collegheremo i tre sensori A, B e C a tre porte AND, una per coppia, e le tre AND a una OR che comanda la spia. Sceglierai i valori dei tre sensori.',
      'Vedremo quali coppie danno 1 e se la spia rispetta la specifica. Dopo il caso proposto, porta a 1 tutti e tre i sensori e conta le AND accese.'
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
    nota: 'I passi sono sempre sei. Cambiando i sensori cambiano le porte che si accendono.',
    previsione: {
      domanda: (p) => 'I sensori valgono A = ' + p.a + ', B = ' + p.b + ' e C = ' + p.c + '. Quante delle tre porte AND, una per coppia di sensori, daranno 1?',
      opzioni: () => [0, 1, 2, 3]
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + pred + '. Le AND che danno 1 sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 3 ? 'Con tre sensori a 1 ogni coppia è completa, quindi le AND accese sono tre.' : esito === 1 ? 'Con due sensori a 1 esiste una sola coppia completa: quella formata proprio da quei due.' : 'Con meno di due sensori a 1 nessuna coppia è completa.') + (pred === 2 ? ' Due AND accese sono un caso impossibile, perché due coppie complete richiedono tre sensori a 1, e allora è completa anche la terza.' : ''),
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

      P({}, 0, 'Tre bit in ingresso', 'I sensori mandano A = ' + p.a + ', B = ' + p.b + ' e C = ' + p.c + '. ' + (n === 0 ? 'Nessuno segnala l’apertura.' : n === 1 ? 'Uno solo segnala l’apertura.' : n === 2 ? 'Due segnalano l’apertura.' : 'Tutti e tre segnalano l’apertura.') + ' La specifica chiede la spia accesa con almeno due segnalazioni.',
        { chiedi: { d: 'Secondo la specifica, con ' + n + (n === 1 ? ' sensore' : ' sensori') + ' a 1 la spia deve accendersi?', o: ['Sì', 'No'], g: n >= 2 ? 0 : 1, no: 'La spia si accende con almeno due sensori a 1. Qui sono ' + n + '.' } });
      COPPIE.forEach((c, k) => {
        and[k] = V[c[0]] & V[c[1]]; if (and[k]) accese++;
        const succ = COPPIE[k + 1];
        P({ coppia: k }, 1, 'La coppia ' + c[0] + ', ' + c[1], 'La ' + (k === 0 ? 'prima' : k === 1 ? 'seconda' : 'terza') + ' AND riceve ' + c[0] + ' = ' + V[c[0]] + ' e ' + c[1] + ' = ' + V[c[1]] + '. ' + (and[k] ? 'Entrambi valgono 1, quindi la porta dà 1: questa coppia basta da sola a raggiungere la soglia.' : 'Almeno uno dei due vale 0, quindi la porta dà 0.'),
          { calc: V[c[0]] + ' AND ' + V[c[1]] + ' = ' + and[k], chiedi: succ ? { d: 'La prossima AND riceve ' + succ[0] + ' = ' + V[succ[0]] + ' e ' + succ[1] + ' = ' + V[succ[1]] + '. Quanto dà?', o: ['0', '1'], g: V[succ[0]] & V[succ[1]], no: 'La AND dà 1 soltanto quando entrambi gli ingressi valgono 1.' } : { d: 'Le tre AND hanno dato ' + and.join(', ') + '. La OR che le riunisce quanto darà?', o: ['0', '1'], g: accese ? 1 : 0, no: 'La OR dà 1 quando almeno uno dei suoi ingressi vale 1.' } });
      });
      or = accese ? 1 : 0;
      P({ or: true }, 2, 'La OR riunisce le coppie', 'La OR riceve ' + and.join(', ') + '. ' + (or ? 'Almeno un ingresso vale 1, quindi l’uscita vale 1 e la spia si accende.' : 'Tutti gli ingressi valgono 0, quindi l’uscita vale 0 e la spia resta spenta.'), { calc: and.join(' OR ') + ' = ' + or });
      P({ fine: true }, 3, 'Il circuito rispetta la specifica', 'Con ' + n + (n === 1 ? ' sensore' : ' sensori') + ' a 1 la specifica chiede la spia ' + (n >= 2 ? 'accesa' : 'spenta') + ', e il circuito la ' + (or ? 'accende' : 'lascia spenta') + '. Ripetendo la prova sulle otto combinazioni si ritrova la tabella della maggioranza, riga per riga. Il circuito dei mintermini avrebbe richiesto quattro AND a tre ingressi, tre NOT e una OR: otto porte, contro le quattro usate qui.',
        { calc: 'AB OR AC OR BC = ' + or, esito: [or ? 'spia accesa' : 'spia spenta', 'si'] });
      return { passi, esito: accese };
    }
  },
  bilancio: {
    regola: [
      'Una specifica si traduce elencando tutti i casi in una tabella di verità. La tabella fissa la funzione, e i circuiti capaci di realizzarla sono molti.',
      'La maggioranza di tre bit vale AB OR AC OR BC. Due circuiti sono equivalenti quando hanno la stessa tabella di verità.'
    ],
    errori: [
      ['Fermarsi al primo circuito corretto.', 'La ricetta dei mintermini dà sempre un circuito giusto, e spesso ne esiste uno equivalente con meno porte.'],
      ['Giudicare equivalenti due circuiti provando pochi casi.', 'Servono tutte le righe. Con tre ingressi sono otto, e una sola riga diversa basta a distinguere due funzioni.'],
      ['Confondere «almeno due» con «esattamente due».', 'Con tre sensori a 1 la spia deve restare accesa, perché la specifica chiede almeno due segnalazioni.']
    ],
    saFare: ['Traduco una richiesta a parole in una tabella di verità.', 'Costruisco la maggioranza di tre bit con tre AND e una OR.', 'Verifico l’equivalenza di due circuiti confrontando le tabelle.'],
    esercizi: [
      { d: 'Una seconda spia deve accendersi quando esattamente due sensori su tre valgono 1. In quante righe della tabella di verità la sua uscita vale 1?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Le righe sono 011, 101 e 110. La riga 111 ha tre sensori a 1 e resta esclusa.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'Quattro sono le righe con almeno due sensori a 1. Qui la riga 111 va esclusa, perché i sensori a 1 sono tre.' },
          { se: ['2', 'due'], msg: 'Due è il numero di sensori richiesto. La domanda riguarda le righe della tabella che soddisfano la richiesta.' },
          { se: ['8', 'otto'], msg: 'Otto sono tutte le righe della tabella. Vanno contate soltanto quelle con due sensori a 1.' }
        ],
        altro: 'Il numero è diverso. Scrivi le otto combinazioni e conta quelle che contengono due 1 e uno 0.',
        indizi: ['Le combinazioni di tre bit sono otto.', 'Cerca quelle con due 1 e uno 0.', 'Lo 0 può stare in tre posizioni diverse.'],
        svolgimento: ['Combinazioni con due 1: 011, 101, 110.', 'La riga 111 ne ha tre e va esclusa.', 'Righe con uscita 1: 3.'] },
      { d: 'Quale formula calcola la maggioranza dei tre bit A, B e C?', guida: 'Scegli la risposta.', o: [
        { t: 'AB OR AC OR BC', ok: true, fb: 'Almeno due bit a 1 significa almeno una coppia completa, e le coppie sono tre.' },
        { t: 'A AND B AND C', fb: 'Questa formula vale 1 soltanto quando tutti e tre i bit valgono 1. Alla maggioranza ne bastano due.' },
        { t: 'A OR B OR C', fb: 'Questa formula vale 1 già con un solo bit a 1.' },
        { t: 'A XOR B XOR C', fb: 'Questa formula vale 1 quando i bit a 1 sono in numero dispari, quindi anche con uno solo.' }] }
    ],
    sfida: ['cslez3_1_01_random_assembly', 'Funzioni booleane di uno o più ingressi']
  }
});
