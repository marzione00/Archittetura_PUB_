'use strict';
SL.unita612 = (() => {
  // Otto letture: quattro interi presi ogni «passo» interi, due passate. Linee di 64 byte, interi di 4 byte.
  const indirizzi = (p) => { const una = [0, 1, 2, 3].map((k) => k * p.passo * 4); return una.concat(una); };
  const simula = (p) => { const pos = []; for (let k = 0; k < p.pos; k++) pos.push(null); const S = []; let hit = 0; indirizzi(p).forEach((a) => { const b = Math.floor(a / 64), i = b % p.pos, tag = Math.floor(b / p.pos), ok = pos[i] === b, fuori = ok ? null : pos[i]; if (ok) hit++; pos[i] = b; S.push({ a, b, i, tag, ok, fuori, pos: pos.slice(), hit }); }); return S; };
  const hit = (p) => { const S = simula(p); return S[S.length - 1].hit; };
  // fatti: letture già eseguite
  const quadro = (pre, p, fatti, o) => {
    const el = SL.el, els = [], S = simula(p), wc = (o.w - 7 * 6) / 8, wp = (o.w - (p.pos - 1) * 10) / p.pos, ora = fatti ? S[fatti - 1] : null;
    els.push(el.nota(pre + 't0', o.x, o.y, 'LE OTTO LETTURE · due passate sugli stessi quattro interi', 'mono'));
    S.forEach((s, k) => els.push(el.cella(pre + 'l' + k, o.x + k * (wc + 6), o.y + 44, wc, 34, k < fatti ? (s.ok ? 'hit' : 'miss') : '', k < fatti ? (k === fatti - 1 ? 'att' : s.ok ? 'on' : 'err') : '', { so: 'ind. ' + s.a, gi: 'blocco ' + s.b, piccola: true })));
    for (let i = 0; i < p.pos; i++) { const b = ora ? ora.pos[i] : null; els.push(el.box(pre + 'p' + i, o.x + i * (wp + 10), o.y + 108, wp, 54, 'posizione ' + i, b === null ? 'vuota' : 'blocco ' + b + ' · tag ' + Math.floor(b / p.pos), ora && ora.i === i ? (ora.ok ? 'on' : 'att') : b === null ? '' : 'on', { cls: 'stretta' })); }
    return els;
  };
  return { indirizzi, simula, hit, quadro };
})();
SL.registra('6.1.2', {
  titolo: 'Località e stato di una cache',
  obiettivo: 'Obiettivo: seguire lo stato di una piccola cache durante una scansione, calcolando per ogni lettura il blocco, la posizione e il tag, e spiegare gli hit con la località.',
  concetti: [['riproduci', 'Dati vicini, dati riusati'], ['tabella', 'Un posto fisso per ogni blocco'], ['conflitto', 'Due blocchi, la stessa posizione']],
  filigrana: ['cache', 'tabella', 'conflitto'],
  richiami: {
    carte: [
      { sim: 'cache', da: 'Dall’unità 6.1.1', t: 'Hit e miss', d: 'Un hit trova la linea in cache. Un miss la fa arrivare dalla RAM.' },
      { sim: 'byte', da: 'Dall’unità 6.1.1', t: 'La linea', d: 'Un gruppo di 64 byte consecutivi, portato in cache tutto insieme.' },
      { sim: 'operation', da: 'Dall’unità 1.4.4', t: 'La divisione intera', d: 'Una divisione fra interi produce un quoziente e un resto: 255 diviso 13 fa 19, con resto 8.' }
    ],
    domanda: { d: 'Prima di proseguire: un array di interi da 4 byte comincia all’indirizzo 0. A quale indirizzo comincia l’elemento di indice 16?', o: [
      { t: 'All’indirizzo 64', ok: true, fb: '16 × 4 = 64: è il primo byte della linea successiva.' },
      { t: 'All’indirizzo 16', fb: 'Sedici è l’indice. Ogni elemento occupa 4 byte.' },
      { t: 'All’indirizzo 60', fb: 'All’indirizzo 60 comincia l’elemento di indice 15.' }
    ] }
  },
  idea: {
    titolo: 'Perché una memoria piccola basta quasi sempre',
    termini: ['località spaziale', 'località temporale', 'indice e tag'],
    testo: [
      'Una cache contiene una frazione minuscola dei dati di un programma, eppure serve la grande maggioranza delle letture. Il merito è di un’abitudine dei programmi, che ha due facce. La prima è la [[località spaziale]]: dopo avere usato un dato, un programma usa spesso quelli che gli stanno accanto. Scorrere un array ne è l’esempio più comune. Con interi da 4 byte, una linea di 64 byte ne contiene sedici, e un solo rifornimento serve sedici letture.',
      'La seconda è la [[località temporale]]: un dato appena usato verrà probabilmente usato di nuovo fra poco. Il contatore di un ciclo, o un array percorso due volte, sono casi tipici. Finché la linea resta in cache, ogni ritorno è un hit, anche a distanza di tempo.',
      'Resta da decidere dove la cache mette ogni linea. D’ora in poi chiamiamo blocco il gruppo di 64 byte della RAM, numerato come nell’unità precedente, e posizione ciascuno dei posti della cache. Lo schema più diretto assegna a ogni blocco una sola posizione ammessa. Se le posizioni sono due, il blocco va nella posizione data dal resto della divisione del suo numero per 2: i blocchi pari nella posizione 0, i dispari nella posizione 1. Quel resto si chiama indice.',
      { fig: 'scena', w: 720, h: 172, titolo: 'Passo di sedici interi: il blocco 2 ha preso il posto del blocco 0', nota: 'Alla terza lettura il blocco 2 è entrato nella posizione 0, da cui ha tolto il blocco 0.', els: SL.unita612.quadro('g', { passo: 16, pos: 2 }, 3, { x: 10, y: 4, w: 700 }) },
      'Molti blocchi condividono la stessa posizione, e la cache deve sapere quale di loro la occupa in questo momento. Per questo, accanto ai dati, conserva un’etichetta: il quoziente della stessa divisione, chiamato tag. La coppia [[indice e tag]] identifica il blocco: l’indice dice dove guardare, il tag dice se ciò che si trova lì è il blocco cercato. Con due posizioni, il blocco 3 ha indice 1 e tag 1. Il blocco 1 ha lo stesso indice e tag 0.',
      'Da qui nasce l’altro lato della medaglia. Due blocchi con lo stesso indice si scacciano a vicenda, anche se il resto della cache è vuoto. Un programma che salta di una linea a ogni lettura può così trovarsi a rifornire a ogni passo, mentre uno che legge dati vicini lavora quasi sempre in cache. Per completezza: se il programma scrive, la copia in cache diventa diversa dall’originale, e prima di essere sostituita va riportata in RAM. In questa unità le richieste sono tutte letture.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma legge quattro interi di un array, e poi li rilegge una seconda volta. Sceglierai il passo, cioè ogni quanti interi ne prende uno, e il numero di posizioni della cache.',
      'Per ogni lettura calcoleremo il blocco e la posizione, e guarderemo chi occupa quella posizione. Conta gli hit, e nota quando un blocco viene scacciato poco prima di servire di nuovo.'
    ],
    vedrai: [
      ['riproduci', 'Le otto letture', 'In alto: sopra ogni casella l’indirizzo letto, sotto il blocco a cui appartiene. Dentro, l’esito.'],
      ['cache', 'Le posizioni della cache', 'In basso: per ogni posizione il blocco residente, con il suo tag.']
    ]
  },
  lab: {
    titolo: 'Due passate sugli stessi quattro interi',
    scena: { w: 860, h: 170 },
    atti: ['La cache vuota', 'La prima passata', 'La seconda passata', 'Il conto'],
    controlli: [
      { id: 'passo', tipo: 'scelta', eti: 'Passo fra gli interi letti', opzioni: [[1, '1 intero · 4 byte'], [8, '8 interi · 32 byte'], [16, '16 interi · 64 byte'], [32, '32 interi · 128 byte']], valore: 16 },
      { id: 'pos', tipo: 'scelta', eti: 'Posizioni della cache', opzioni: [[2, '2'], [4, '4']], valore: 2 }
    ],
    nota: 'I passi sono sempre dieci. Ogni blocco è di 64 byte, e ha una sola posizione ammessa: il resto della divisione del suo numero per il numero di posizioni.',
    previsione: {
      domanda: (p) => 'Un array di interi da 4 byte comincia all’indirizzo 0. Il programma legge quattro interi, prendendone uno ogni ' + (p.passo === 1 ? 'intero' : p.passo + ' interi') + ', e poi li rilegge tutti una seconda volta. La cache ha ' + p.pos + ' posizioni, ciascuna per un blocco di 64 byte, e all’inizio è vuota. Quanti hit si contano nelle otto letture?',
      opzioni: () => [0, 4, 6, 7].map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' hit. Gli hit sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.passo === 1 ? 'I quattro interi stanno tutti nel blocco 0. Dopo il primo miss, ogni altra lettura lo ritrova in cache.' : p.passo === 8 ? 'Gli interi cadono a due a due nei blocchi 0 e 1, che hanno posizioni diverse e restano entrambi in cache.' : esito === 4 ? 'I blocchi 0, 1, 2 e 3 hanno quattro posizioni distinte. La prima passata li carica, la seconda li ritrova tutti.' : 'Più blocchi condividono la stessa posizione e si scacciano a vicenda: ogni lettura trova al proprio posto un blocco diverso da quello cercato.'),
    costruisci(p) {
      const U = SL.unita612, S = U.simula(p), passi = [];
      const P = (fatti, atto, titolo, testo, extra) => { const s = fatti ? S[fatti - 1] : null; passi.push(Object.assign({ atto, titolo, testo, hud: [['Hit', String(s ? s.hit : 0), 'c'], ['Miss', String(s ? fatti - s.hit : 0), 'a'], ['Blocco chiesto', s ? String(s.b) : '·']], els: U.quadro('b', p, fatti, { x: 20, y: 4, w: 820 }) }, extra)); };
      P(0, 0, 'La cache è vuota', 'La cache ha ' + p.pos + ' posizioni, tutte vuote. Il programma leggerà gli indirizzi ' + S.slice(0, 4).map((s) => s.a).join(', ') + ', e poi di nuovo gli stessi.', {});
      S.forEach((s, k) => {
        const conto = s.a + ' / 64 = ' + s.b + ' · ' + s.b + ' mod ' + p.pos + ' = ' + s.i;
        const testo = 'L’indirizzo ' + s.a + ' sta nel blocco ' + s.b + '. La sua posizione è il resto di ' + s.b + ' diviso ' + p.pos + ', cioè ' + s.i + ', e il suo tag è ' + s.tag + '. ' + (s.ok ? 'Nella posizione ' + s.i + ' c’è proprio il blocco ' + s.b + ': è un hit.' : s.fuori === null ? 'La posizione ' + s.i + ' è vuota: è un miss, e il blocco ' + s.b + ' vi entra.' : 'Nella posizione ' + s.i + ' c’è il blocco ' + s.fuori + ', che ha un altro tag: è un miss. Il blocco ' + s.b + ' prende il suo posto.');
        P(k + 1, k < 4 ? 1 : 2, 'Lettura ' + (k + 1) + ' · indirizzo ' + s.a, testo, Object.assign({ calc: conto + ' · ' + (s.ok ? 'hit' : 'miss') }, k === 4 ? { chiedi: { d: 'Comincia la seconda passata, che torna all’indirizzo 0. Il blocco 0 è ancora in cache?', o: ['Sì', 'No: un altro blocco ha preso la sua posizione'], g: s.ok ? 0 : 1, no: s.ok ? 'Nessun blocco con lo stesso indice è stato letto nel frattempo.' : 'Il blocco ' + s.fuori + ' ha lo stesso indice del blocco 0, e lo ha sostituito.' } } : {}));
      });
      const h = U.hit(p);
      P(8, 3, 'Il conto', 'Otto letture: ' + h + ' hit e ' + (8 - h) + ' miss. ' + (p.passo === 1 ? 'Gli interi letti sono vicini, e stanno tutti nella stessa linea: è la località spaziale. La seconda passata li ritrova: è la località temporale.' : h === 0 ? 'Gli interi letti sono lontani una linea o più, e i loro blocchi si contendono le stesse posizioni. La seconda passata non ritrova nulla.' : 'I blocchi usati hanno trovato ciascuno una posizione propria, e la seconda passata li ha ritrovati tutti.'), { calc: h + ' hit · ' + (8 - h) + ' miss', esito: [h + ' hit su 8', ''] });
      return { passi, esito: h };
    }
  },
  bilancio: {
    regola: [
      'Blocco = quoziente intero fra indirizzo e 64. Indice = resto fra blocco e numero di posizioni. Tag = quoziente della stessa divisione.',
      'Una lettura è un hit se nella posizione data dall’indice risiede il blocco con lo stesso tag.'
    ],
    errori: [
      ['Pensare che una cache con posti liberi non produca miss.', 'Due blocchi con lo stesso indice si scacciano anche se altre posizioni sono vuote.'],
      ['Confondere indice e tag.', 'L’indice sceglie la posizione. Il tag distingue i blocchi che condividono quella posizione.'],
      ['Guardare soltanto la quantità di dati letti.', 'Quattro interi vicini costano un rifornimento. Quattro interi lontani ne possono costare otto.']
    ],
    saFare: ['Calcolare blocco, indice e tag di un indirizzo.', 'Aggiornare lo stato della cache dopo una lettura.', 'Spiegare un hit con la località spaziale o temporale.'],
    esercizi: [
      { d: 'Una cache ha 4 posizioni, con blocchi di 64 byte. Qual è l’indice per l’indirizzo 448?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: '448 / 64 = 7, e 7 diviso 4 dà resto 3.',
        diagnosi: [
          { se: ['7', 'sette'], msg: 'Sette è il numero del blocco. L’indice è il resto della divisione per 4.' },
          { se: ['1', 'uno'], msg: 'Uno è il tag, cioè il quoziente. L’indice è il resto.' },
          { se: ['0', 'zero'], msg: 'Calcola prima il blocco: 448 diviso 64.' }
        ],
        altro: 'Il numero è diverso. Si calcoli il blocco, e poi il resto della divisione per le posizioni.',
        indizi: ['Blocco: 448 / 64 = 7.', 'Indice: resto di 7 diviso 4.', '7 = 4 × 1 + 3: indice 3.'],
        svolgimento: ['Blocco: 7.', 'Indice: 3.', 'Tag: 1.'] },
      { d: 'Nella stessa cache, qual è il tag per l’indirizzo 448?', segnaposto: 'Un numero', giuste: ['1', 'uno'],
        ok: 'Il blocco è 7, e 7 diviso 4 dà quoziente 1.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Tre è l’indice, cioè il resto. Il tag è il quoziente.' },
          { se: ['7', 'sette'], msg: 'Sette è il numero del blocco. Il tag è il quoziente della divisione per 4.' }
        ],
        altro: 'Il numero è diverso. Si divida il numero del blocco per le posizioni e si prenda il quoziente.',
        indizi: ['Blocco: 7.', 'Posizioni: 4.', '7 / 4 = 1, con resto 3.'],
        svolgimento: ['Blocco: 7.', 'Tag: 7 / 4 = 1.'] },
      { d: 'Un programma legge A[0], A[1], A[2] e così via, ogni elemento una volta sola. Quale proprietà gli procura gli hit?', guida: 'Si scelga la risposta.', o: [
        { t: 'La località spaziale', ok: true, fb: 'Ogni rifornimento porta in cache anche gli elementi successivi.' },
        { t: 'La località temporale', fb: 'Nessun elemento viene riletto. A servire è la vicinanza fra gli indirizzi.' },
        { t: 'Nessuna: ogni lettura è un miss', fb: 'Sedici interi da 4 byte condividono una linea: un miss, e poi quindici hit.' }] }
    ],
    sfida: ['cslez6_1_02_locality', 'Località']
  }
});
