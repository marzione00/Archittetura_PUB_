'use strict';
SL.registra('3.2.5', {
  titolo: 'Dallo stato memorizzato alle macchine a stati',
  obiettivo: 'Obiettivo: descrivere un circuito come macchina a stati, con stato, ingresso, stato successivo e uscite, e saprai seguirne il comportamento un ingresso dopo l’altro.',
  concetti: [['register', 'Ricordare soltanto ciò che serve'], ['tabella', 'Una regola per ogni caso'], ['riproduci', 'Un passo a ogni fronte']],
  filigrana: ['riproduci', 'register', 'tabella'],
  richiami: {
    carte: [
      { sim: 'register', da: 'Dall’unità 3.2.1', t: 'Stato e retroazione', d: 'Un registro conserva una parola, e l’uscita riportata all’ingresso permette di riscriverla o di cambiarla.' },
      { sim: 'tabella', da: 'Dall’unità 3.1.1', t: 'Dalla specifica alla tabella', d: 'Una richiesta a parole si traduce elencando tutti i casi, con l’uscita voluta per ciascuno.' },
      { sim: 'clock', da: 'Dall’unità 3.2.4', t: 'Il modello sincrono', d: 'Lo stato cambia soltanto ai fronti. Fra un fronte e l’altro la logica combinatoria prepara i valori nuovi.' }
    ],
    domanda: { d: 'Prima di proseguire: un distributore vende un prodotto che costa 3 unità. Ha già ricevuto 2 unità, ed entra una moneta da 1. Che cosa deve fare?', o: [
      { t: 'Consegnare il prodotto', ok: true, fb: 'Due più uno fa tre, il prezzo esatto.' },
      { t: 'Attendere altre monete', fb: 'Il versato arriva a 3 unità, e il prezzo è raggiunto.' },
      { t: 'Restituire la moneta', fb: 'La moneta va restituita quando il totale supera il prezzo. Qui lo raggiunge esattamente.' }
    ] }
  },
  idea: {
    titolo: 'Ricordare soltanto ciò che serve',
    termini: ['macchina a stati', 'transizione'],
    testo: [
      'Un distributore vende un prodotto che costa 3 unità e accetta monete da 1 e da 2. Quando entra una moneta, la risposta giusta dipende da quanto è già stato versato, quindi il circuito deve ricordare qualcosa. Gli basta poco. L’elenco delle monete entrate è superfluo, e serve soltanto il credito accumulato. Due storie diverse che lasciano lo stesso credito avranno lo stesso seguito.',
      'I crediti possibili sono tre: 0, 1 e 2. Un circuito con un numero finito di situazioni interne si chiama [[macchina a stati]], e ogni situazione è uno stato. A ogni fronte del clock la macchina considera lo stato in cui si trova e l’ingresso che riceve, e decide due cose: lo stato in cui passare e le uscite da produrre. Il passaggio da uno stato al successivo è una [[transizione]].',
      'Le regole del distributore sono tre. Se credito più moneta resta sotto 3, il nuovo credito è la somma. Se arriva a 3 esatti, il distributore consegna il prodotto e il credito torna a 0. Se supera 3, il distributore restituisce l’ultima moneta e il credito resta com’era.',
      { fig: 'scena', w: 720, h: 190, titolo: 'Le transizioni del distributore', nota: 'In ogni casella: che cosa accade e in quale credito si passa.', els: [
        SL.el.nota('h1', 250, 0, 'MONETA DA 1', 'mono'), SL.el.nota('h2', 490, 0, 'MONETA DA 2', 'mono'),
        SL.el.nota('s0', 10, 40, 'credito 0', 'mono'), SL.el.nota('s1', 10, 96, 'credito 1', 'mono'), SL.el.nota('s2', 10, 152, 'credito 2', 'mono'),
        SL.el.box('a0', 180, 24, 220, 48, null, 'passa a credito 1', '', { cls: 'stretta' }), SL.el.box('b0', 420, 24, 280, 48, null, 'passa a credito 2', '', { cls: 'stretta' }),
        SL.el.box('a1', 180, 80, 220, 48, null, 'passa a credito 2', '', { cls: 'stretta' }), SL.el.box('b1', 420, 80, 280, 48, null, 'consegna, credito 0', 'on', { cls: 'stretta' }),
        SL.el.box('a2', 180, 136, 220, 48, null, 'consegna, credito 0', 'on', { cls: 'stretta' }), SL.el.box('b2', 420, 136, 280, 48, null, 'restituisce, credito 2', 'att', { cls: 'stretta' })
      ] },
      'In hardware la macchina è fatta di due parti già note. Un registro conserva lo stato, e per tre stati bastano due bit. Una rete combinatoria riceve lo stato e l’ingresso, e calcola lo stato successivo e le uscite. Al fronte il registro cattura lo stato successivo, e il ciclo ricomincia. È il modello sincrono dell’unità 3.2.4, chiuso dalla retroazione dell’unità 3.2.1.',
      'Un processore intero è una macchina a stati molto grande. Il suo stato sono i registri, la memoria e l’indirizzo della prossima istruzione, e a ogni ciclo una rete combinatoria calcola lo stato successivo. I prossimi capitoli la costruiscono un pezzo alla volta.'
    ]
  },
  esperimento: {
    faremo: [
      'Il distributore riceve tre ingressi, uno per fronte: una moneta da 1, una moneta da 2, oppure nessuna moneta. Sceglierai il credito di partenza e i tre ingressi.',
      'Per ogni ingresso vedremo prima il calcolo della rete combinatoria e poi la cattura del nuovo stato al fronte. Dopo il caso proposto, scambia la seconda e la terza moneta e confronta i due percorsi.'
    ],
    vedrai: [
      ['register', 'Gli stati', 'In alto a sinistra: i tre crediti possibili, con lo stato attuale in evidenza.'],
      ['input', 'Gli ingressi', 'In alto a destra: le tre monete in arrivo.'],
      ['tabella', 'La rete e le uscite', 'Sotto: la somma, lo stato successivo e i segnali Consegna e Restituisce.']
    ]
  },
  lab: {
    titolo: 'Tre monete nel distributore',
    scena: { w: 860, h: 300 },
    atti: ['Lo stato iniziale', 'Il primo ingresso', 'Il secondo ingresso', 'Il terzo ingresso', 'Il bilancio'],
    controlli: [
      { id: 'q', tipo: 'scelta', eti: 'Credito di partenza', opzioni: [[0, '0'], [1, '1'], [2, '2']], valore: 0 },
      { id: 'm0', tipo: 'scelta', eti: 'Primo ingresso', opzioni: [[0, 'nessuna moneta'], [1, 'moneta da 1'], [2, 'moneta da 2']], valore: 2 },
      { id: 'm1', tipo: 'scelta', eti: 'Secondo ingresso', opzioni: [[0, 'nessuna moneta'], [1, 'moneta da 1'], [2, 'moneta da 2']], valore: 2 },
      { id: 'm2', tipo: 'scelta', eti: 'Terzo ingresso', opzioni: [[0, 'nessuna moneta'], [1, 'moneta da 1'], [2, 'moneta da 2']], valore: 1 }
    ],
    nota: 'I passi sono sempre otto: due per ogni ingresso, il calcolo e il fronte.',
    previsione: {
      domanda: (p) => 'Il prodotto costa 3 unità. Il distributore parte con credito ' + p.q + ' e riceve nell’ordine: ' + [p.m0, p.m1, p.m2].map(SL.unita325.NOME).join(', ') + '. Con quale credito finisce?',
      opzioni: () => [[0, 'Credito 0'], [1, 'Credito 1'], [2, 'Credito 2']]
    },
    confronto: (pred, esito, p) => { const U = SL.unita325, t = U.traccia(p); return 'La previsione indicava credito ' + pred + '. Il distributore finisce con credito ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'I crediti dopo i tre ingressi sono ' + t.map((x) => x.dopo).join(', ') + '. ' + (t.some((x) => x.rest) ? 'Una moneta che farebbe superare 3 viene restituita, e il credito resta com’era.' : t.some((x) => x.eroga) ? 'Quando il totale arriva a 3 il prodotto esce e il credito torna a 0.' : 'Il totale non ha mai raggiunto 3.')); },
    costruisci(p) {
      const el = SL.el, U = SL.unita325, passi = [], M = [p.m0, p.m1, p.m2], T = U.traccia(p), ORD = ['primo', 'secondo', 'terzo'];
      const st = { q: p.q, k: -1, calc: null, erog: 0, rest: 0, ck: 'basso' };
      const quadro = (o) => {
        const c = st.calc, els = [el.nota('t1', 40, 0, 'STATO ATTUALE', 'mono'), el.nota('t2', 560, 0, 'INGRESSI', 'mono')];
        [0, 1, 2].forEach((k) => els.push(el.box('s' + k, 40 + k * 160, 26, 146, 60, 'stato', 'credito ' + k, st.q === k ? 'att' : c && c.dopo === k ? 'on' : '', { cls: 'stretta' })));
        M.forEach((m, k) => els.push(el.cella('m' + k, 560 + k * 96, 40, 84, 46, String(m), k === st.k ? 'att' : k < st.k ? 'off' : m ? 'on' : 'zero', { piccola: true, so: ORD[k] })));
        els.push(el.box('b1', 40, 112, 206, 72, 'credito + moneta', c ? c.prima + ' + ' + c.m + ' = ' + (c.prima + c.m) : '·', o.logica ? 'att' : c ? 'on' : '', { cls: 'stretta' }),
          el.box('b2', 258, 112, 206, 72, 'stato successivo', c ? 'credito ' + c.dopo : '·', o.logica ? 'att' : c ? 'on' : '', { cls: 'stretta' }),
          el.box('b3', 476, 112, 180, 72, 'Consegna', c ? String(c.eroga) : '·', c && c.eroga ? 'att' : c ? '' : 'off', { cls: 'stretta' }),
          el.box('b4', 668, 112, 176, 72, 'Restituisce', c ? String(c.rest) : '·', c && c.rest ? 'err' : c ? '' : 'off', { cls: 'stretta' }),
          el.box('r', 40, 210, 206, 72, 'registro di stato', 'credito ' + st.q, o.fronte ? 'att' : 'on', { cls: 'stretta' }),
          el.box('ck', 258, 210, 206, 72, 'clock', st.ck, o.fronte ? 'att' : '', { cls: 'stretta' }),
          el.box('n1', 476, 210, 180, 72, 'prodotti consegnati', String(st.erog), o.fronte && c && c.eroga ? 'att' : st.erog ? 'on' : '', { cls: 'stretta' }),
          el.box('n2', 668, 210, 176, 72, 'monete restituite', String(st.rest), o.fronte && c && c.rest ? 'att' : st.rest ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Credito', String(st.q), 'a'], ['Ingresso', st.k < 0 ? '·' : M[st.k] ? 'moneta da ' + M[st.k] : 'nessuna'], ['Consegnati', String(st.erog), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const OPZ = ['Conserva il credito', 'Aumenta il credito', 'Consegna il prodotto', 'Restituisce la moneta'];
      const domanda = (k, q) => ({ d: 'Il credito è ' + q + ' e arriva: ' + U.NOME(M[k]) + '. Che cosa farà il distributore?', o: OPZ, g: M[k] === 0 ? 0 : q + M[k] < 3 ? 1 : q + M[k] === 3 ? 2 : 3, no: M[k] === 0 ? 'Senza moneta nulla cambia: il credito viene riscritto com’è.' : 'Il totale sarebbe ' + q + ' + ' + M[k] + ' = ' + (q + M[k]) + '. Sotto 3 il credito aumenta, a 3 esatti il prodotto esce, oltre 3 la moneta torna indietro.' });

      P({}, 0, 'Lo stato di partenza', 'Il registro di stato contiene credito ' + p.q + '. Il prodotto costa 3 unità. Gli ingressi arriveranno uno per ciclo: ' + M.map(U.NOME).join(', ') + '.', { chiedi: domanda(0, p.q) });
      T.forEach((c, k) => {
        st.k = k; st.calc = c; st.ck = 'basso';
        P({ logica: true }, k + 1, 'La rete combinatoria calcola', 'Arriva il ' + ORD[k] + ' ingresso: ' + U.NOME(c.m) + '. La rete riceve lo stato attuale, credito ' + c.prima + ', e ' + (c.m ? 'calcola ' + c.prima + ' + ' + c.m + ' = ' + (c.prima + c.m) + '. ' : 'somma zero. ') + (c.m === 0 ? 'Senza moneta lo stato successivo coincide con quello attuale.' : c.eroga ? 'Il totale vale 3 esatti: l’uscita Consegna va a 1 e lo stato successivo è credito 0.' : c.rest ? 'Il totale supera 3: l’uscita Restituisce va a 1 e lo stato successivo resta credito ' + c.dopo + '.' : 'Il totale resta sotto 3, e lo stato successivo è credito ' + c.dopo + '.') + ' Il registro, intanto, contiene ancora credito ' + c.prima + '.',
          { calc: c.prima + ' + ' + c.m + ' = ' + (c.prima + c.m) + ' → credito ' + c.dopo });
        st.q = c.dopo; st.erog += c.eroga; st.rest += c.rest; st.ck = 'sale ↑';
        P({ fronte: true }, k + 1, c.prima === c.dopo ? 'Al fronte lo stato resta' : 'Al fronte lo stato cambia', 'Il clock sale, e il registro cattura lo stato successivo: credito ' + c.dopo + '. ' + (c.eroga ? 'Il prodotto esce. ' : c.rest ? 'La moneta torna indietro. ' : '') + (c.prima === c.dopo ? 'La transizione riporta la macchina nello stato in cui era.' : 'La transizione porta la macchina da credito ' + c.prima + ' a credito ' + c.dopo + '.'),
          { calc: 'credito ' + c.prima + ' → credito ' + c.dopo, chiedi: k < 2 ? domanda(k + 1, c.dopo) : null });
        if (!passi[passi.length - 1].chiedi) delete passi[passi.length - 1].chiedi;
      });
      st.ck = 'alto'; st.calc = null; st.k = 3;
      P({}, 4, 'Tre ingressi, tre transizioni', 'Il distributore ha consegnato ' + st.erog + (st.erog === 1 ? ' prodotto' : ' prodotti') + ', ha restituito ' + st.rest + (st.rest === 1 ? ' moneta' : ' monete') + ' e conserva credito ' + st.q + '. Per decidere il seguito gli basta questo numero. Qualunque altra sequenza che lo avesse lasciato a credito ' + st.q + ' sarebbe, da qui in avanti, indistinguibile.',
        { calc: 'stato finale: credito ' + st.q, esito: ['credito ' + st.q, 'si'] });
      return { passi, esito: st.q };
    }
  },
  bilancio: {
    regola: [
      'Una macchina a stati ha un numero finito di stati. Dallo stato attuale e dall’ingresso una rete combinatoria ricava lo stato successivo e le uscite, e al fronte un registro cattura lo stato successivo.',
      'Lo stato contiene soltanto ciò che serve per decidere il futuro. Nel distributore è il credito, che vale 0, 1 oppure 2.'
    ],
    errori: [
      ['Ricordare più del necessario.', 'L’ordine delle monete già entrate è irrilevante. Due storie con lo stesso credito hanno lo stesso seguito.'],
      ['Decidere l’uscita guardando soltanto l’ingresso.', 'Una moneta da 2 fa aumentare il credito, consegnare il prodotto oppure tornare indietro, secondo lo stato in cui la macchina si trova.'],
      ['Cambiare lo stato a metà ciclo.', 'Lo stato cambia soltanto al fronte. Nel resto del ciclo la rete combinatoria prepara lo stato successivo.']
    ],
    saFare: ['Individuare che cosa una macchina deve ricordare, e quanti stati le servono.', 'Seguire una sequenza di ingressi, una transizione per fronte.', 'Riconoscere in una macchina a stati il registro e la rete combinatoria.'],
    esercizi: [
      { d: 'Il distributore parte con credito 0 e riceve nell’ordine le monete da 2, 2, 1 e 1. Con quale credito finisce?', segnaposto: 'Un numero', giuste: ['1', 'uno'],
        ok: 'I crediti successivi sono 2, ancora 2 perché la seconda moneta viene restituita, 0 dopo la consegna, e infine 1.',
        diagnosi: [
          { se: ['0', 'zero'], msg: 'Sei unità basterebbero per due prodotti, ma la seconda moneta da 2 porterebbe il totale a 4 e viene restituita.' },
          { se: ['2', 'due'], msg: 'Dopo la terza moneta il totale vale 3: il prodotto esce e il credito torna a 0. Resta da contare la quarta moneta.' },
          { se: ['3', 'tre'], msg: 'Il credito conservato vale al massimo 2. Quando il totale arriva a 3 il prodotto esce e il credito torna a 0.' }
        ],
        altro: 'Il numero è diverso. Si segua una moneta alla volta, applicando la regola al credito del momento.',
        indizi: ['Dopo la prima moneta il credito è 2.', 'La seconda moneta porterebbe a 4: viene restituita, e il credito resta 2.', 'La terza porta a 3: consegna, credito 0. Poi entra l’ultima.'],
        svolgimento: ['0 + 2 = 2: credito 2.', '2 + 2 = 4: moneta restituita, credito 2.', '2 + 1 = 3: consegna, credito 0. Poi 0 + 1 = 1: credito 1.'] },
      { d: 'Una macchina a stati ha tre stati. Quanti flip-flop servono, al minimo, per il suo registro di stato?', guida: 'Si scelga la risposta.', o: [
        { t: '2', ok: true, fb: 'Due bit formano quattro combinazioni, sufficienti per tre stati.' },
        { t: '3', fb: 'Un flip-flop per stato funzionerebbe, ma ne bastano meno: due bit distinguono fino a quattro stati.' },
        { t: '1', fb: 'Un bit solo distingue due stati, e qui sono tre.' }] }
    ]
  }
});
SL.unita325 = {
  NOME: (m) => (m ? 'moneta da ' + m : 'nessuna moneta'),
  // Le tre transizioni: credito prima, moneta, credito dopo, uscite.
  traccia: (p) => { let q = p.q; return [p.m0, p.m1, p.m2].map((m) => { const tot = q + m, prima = q, eroga = m > 0 && tot === 3 ? 1 : 0, rest = tot > 3 ? 1 : 0; q = eroga ? 0 : rest ? q : tot; return { prima, m, dopo: q, eroga, rest }; }); }
};
