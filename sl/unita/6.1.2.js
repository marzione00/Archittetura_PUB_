'use strict';
SL.unita612 = (() => {
  // Otto letture: quattro interi presi ogni «passo» interi, due passate. Blocchi di 64 byte, interi di 4 byte.
  const indirizzi = (p) => { const una = [0, 1, 2, 3].map((k) => k * p.passo * 4); return una.concat(una); };
  const simula = (p) => { const pos = []; for (let k = 0; k < p.pos; k++) pos.push(null); const S = []; let hit = 0; indirizzi(p).forEach((a) => { const b = Math.floor(a / 64), i = b % p.pos, tag = Math.floor(b / p.pos), ok = pos[i] === b, fuori = ok ? null : pos[i]; if (ok) hit++; pos[i] = b; S.push({ a, b, i, tag, ok, fuori, pos: pos.slice(), hit }); }); return S; };
  const hit = (p) => { const S = simula(p); return S[S.length - 1].hit; };
  // fatti: letture già eseguite
  const quadro = (pre, p, fatti, o) => {
    const el = SL.el, els = [], S = simula(p), wc = (o.w - 7 * 6) / 8, wp = (o.w - (p.pos - 1) * 10) / p.pos, ora = fatti ? S[fatti - 1] : null;
    els.push(el.nota(pre + 't0', o.x, o.y, 'LE OTTO LETTURE · due passate sui medesimi quattro interi', 'mono'));
    S.forEach((s, k) => els.push(el.cella(pre + 'l' + k, o.x + k * (wc + 6), o.y + 44, wc, 34, k < fatti ? (s.ok ? 'hit' : 'miss') : '', k < fatti ? (k === fatti - 1 ? 'att' : s.ok ? 'on' : 'err') : '', { so: 'ind. ' + s.a, gi: 'blocco ' + s.b, piccola: true })));
    for (let i = 0; i < p.pos; i++) { const b = ora ? ora.pos[i] : null; els.push(el.box(pre + 'p' + i, o.x + i * (wp + 10), o.y + 108, wp, 54, 'posizione ' + i, b === null ? 'vuota' : 'blocco ' + b + ' · tag ' + Math.floor(b / p.pos), ora && ora.i === i ? (ora.ok ? 'on' : 'att') : b === null ? '' : 'on', { cls: 'stretta' })); }
    return els;
  };
  return { indirizzi, simula, hit, quadro };
})();
SL.registra('6.1.2', {
  titolo: 'Località e stato di una cache',
  obiettivo: 'Obiettivo: seguire lo stato di una piccola cache durante una scansione, con il calcolo, per ogni lettura, del blocco, della posizione e del tag, e spiegare gli hit con la località.',
  concetti: [['riproduci', 'Dati vicini, dati riutilizzati'], ['tabella', 'Una posizione fissa per ogni blocco'], ['conflitto', 'Due blocchi, la medesima posizione']],
  filigrana: ['cache', 'tabella', 'conflitto'],
  richiami: {
    carte: [
      { sim: 'cache', da: 'Dall’unità 6.1.1', t: 'Hit e miss', d: 'Un hit trova il blocco in cache. Un miss ne richiede il trasferimento dalla RAM.' },
      { sim: 'byte', da: 'Dall’unità 6.1.1', t: 'Il blocco', d: 'Un gruppo di 64 byte consecutivi, trasferito in cache per intero.' },
      { sim: 'operation', da: 'Dall’unità 1.4.4', t: 'La divisione intera', d: 'Una divisione fra interi produce un quoziente e un resto: 255 diviso 13 dà 19, con resto 8.' }
    ],
    domanda: { d: 'Prima di proseguire: un array di interi da 4 byte ha inizio all’indirizzo 0. A quale indirizzo ha inizio l’elemento di indice 16?', o: [
      { t: 'All’indirizzo 64', ok: true, fb: '16 × 4 = 64: si tratta del primo byte del blocco successivo.' },
      { t: 'All’indirizzo 16', fb: 'Sedici è l’indice. Ogni elemento occupa 4 byte.' },
      { t: 'All’indirizzo 60', fb: 'All’indirizzo 60 ha inizio l’elemento di indice 15.' }
    ] }
  },
  idea: {
    titolo: 'La sufficienza di una memoria piccola',
    termini: ['località spaziale', 'località temporale', 'indice e tag'],
    testo: [
      'Una cache contiene una frazione ridotta dei dati di un programma, e tuttavia serve la maggior parte delle letture. La ragione è una regolarità nel comportamento dei programmi, che ha due aspetti. Il primo è la [[località spaziale]]: dopo avere impiegato un dato, un programma impiega spesso quelli adiacenti. La scansione di un array ne è l’esempio più comune. Con interi da 4 byte, un blocco di 64 byte ne contiene sedici, e un solo rifornimento serve sedici letture.',
      'Il secondo è la [[località temporale]]: un dato appena impiegato sarà probabilmente impiegato di nuovo a breve. Il contatore di un ciclo, o un array percorso due volte, sono casi tipici. Finché il blocco resta in cache, ogni nuovo accesso è un hit, anche a distanza di tempo.',
      'Resta da stabilire la collocazione di ogni blocco nella cache. I blocchi della RAM sono numerati come nell’unità precedente, e nel seguito si denomina posizione ciascuna delle sedi della cache. Lo schema più diretto assegna a ogni blocco una sola posizione ammessa. Se le posizioni sono due, il blocco è collocato nella posizione data dal resto della divisione del suo numero per 2: i blocchi pari nella posizione 0, i dispari nella posizione 1. Tale resto prende il nome di indice.',
      { fig: 'scena', w: 720, h: 172, titolo: 'Passo di sedici interi: il blocco 2 ha sostituito il blocco 0', nota: 'Alla terza lettura il blocco 2 è entrato nella posizione 0, da cui ha rimosso il blocco 0.', els: SL.unita612.quadro('g', { passo: 16, pos: 2 }, 3, { x: 10, y: 4, w: 700 }) },
      'Molti blocchi condividono la medesima posizione, e la cache deve identificare quello che la occupa in un dato momento. A tale scopo, accanto ai dati, conserva un’etichetta: il quoziente della medesima divisione, denominato tag. La coppia [[indice e tag]] identifica il blocco: l’indice indica la posizione da esaminare, il tag indica se il blocco residente è quello richiesto. Con due posizioni, il blocco 3 ha indice 1 e tag 1, mentre il blocco 1 ha il medesimo indice e tag 0.',
      'Ne deriva un inconveniente. Due blocchi con il medesimo indice si sostituiscono a vicenda, anche se il resto della cache è vuoto. Un programma che avanza di un blocco a ogni lettura può pertanto richiedere un rifornimento a ogni passo, mentre un programma che legge dati vicini opera quasi sempre in cache. Per completezza: se il programma scrive, la copia in cache diviene diversa dall’originale, e prima di essere sostituita va ricopiata in RAM. In questa unità le richieste sono tutte letture.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma legge quattro interi di un array, e quindi li rilegge una seconda volta. I controlli fissano il passo, cioè la distanza in interi fra due letture successive, e il numero di posizioni della cache.',
      'Per ogni lettura l’esperimento calcola il blocco e la posizione, e mostra il blocco che occupa tale posizione. Vanno contati gli hit, e osservati i casi in cui un blocco è sostituito poco prima di essere nuovamente richiesto.'
    ],
    vedrai: [
      ['riproduci', 'Le otto letture', 'In alto: sopra ogni cella l’indirizzo letto, sotto il blocco a cui appartiene, e all’interno l’esito.'],
      ['cache', 'Le posizioni della cache', 'In basso: per ogni posizione il blocco residente, con il suo tag.']
    ]
  },
  lab: {
    titolo: 'Due passate sui medesimi quattro interi',
    scena: { w: 860, h: 170 },
    atti: ['La cache vuota', 'La prima passata', 'La seconda passata', 'Il totale'],
    controlli: [
      { id: 'passo', tipo: 'scelta', eti: 'Passo fra gli interi letti', opzioni: [[1, '1 intero · 4 byte'], [8, '8 interi · 32 byte'], [16, '16 interi · 64 byte'], [32, '32 interi · 128 byte']], valore: 16 },
      { id: 'pos', tipo: 'scelta', eti: 'Posizioni della cache', opzioni: [[2, '2'], [4, '4']], valore: 2 }
    ],
    nota: 'I passi sono sempre dieci. Ogni blocco è di 64 byte, e ha una sola posizione ammessa: il resto della divisione del suo numero per il numero di posizioni.',
    previsione: {
      domanda: (p) => 'Un array di interi da 4 byte ha inizio all’indirizzo 0. Il programma legge quattro interi, uno ogni ' + (p.passo === 1 ? 'intero' : p.passo + ' interi') + ', e quindi li rilegge tutti una seconda volta. La cache ha ' + p.pos + ' posizioni, ciascuna per un blocco di 64 byte, e inizialmente è vuota. Quanti hit si contano nelle otto letture?',
      opzioni: () => [0, 4, 6, 7].map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' hit. Gli hit sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.passo === 1 ? 'I quattro interi si trovano tutti nel blocco 0. Dopo il primo miss, ogni altra lettura lo trova in cache.' : p.passo === 8 ? 'Gli interi si trovano a due a due nei blocchi 0 e 1, che hanno posizioni diverse e restano entrambi in cache.' : esito === 4 ? 'I blocchi 0, 1, 2 e 3 hanno quattro posizioni distinte. La prima passata li carica, la seconda li trova tutti in cache.' : 'Più blocchi condividono la medesima posizione e si sostituiscono a vicenda: ogni lettura trova nella propria posizione un blocco diverso da quello richiesto.'),
    costruisci(p) {
      const U = SL.unita612, S = U.simula(p), passi = [];
      const P = (fatti, atto, titolo, testo, extra) => { const s = fatti ? S[fatti - 1] : null; passi.push(Object.assign({ atto, titolo, testo, hud: [['Hit', String(s ? s.hit : 0), 'c'], ['Miss', String(s ? fatti - s.hit : 0), 'a'], ['Blocco richiesto', s ? String(s.b) : '·']], els: U.quadro('b', p, fatti, { x: 20, y: 4, w: 820 }) }, extra)); };
      P(0, 0, 'La cache è vuota', 'La cache ha ' + p.pos + ' posizioni, tutte vuote. Il programma leggerà gli indirizzi ' + S.slice(0, 4).map((s) => s.a).join(', ') + ', e quindi nuovamente i medesimi.', {});
      S.forEach((s, k) => {
        const conto = s.a + ' / 64 = ' + s.b + ' · ' + s.b + ' mod ' + p.pos + ' = ' + s.i;
        const testo = 'L’indirizzo ' + s.a + ' si trova nel blocco ' + s.b + '. La sua posizione è il resto di ' + s.b + ' diviso ' + p.pos + ', cioè ' + s.i + ', e il suo tag è ' + s.tag + '. ' + (s.ok ? 'Nella posizione ' + s.i + ' risiede il blocco ' + s.b + ': si tratta di un hit.' : s.fuori === null ? 'La posizione ' + s.i + ' è vuota: si tratta di un miss, e il blocco ' + s.b + ' vi entra.' : 'Nella posizione ' + s.i + ' risiede il blocco ' + s.fuori + ', che ha un altro tag: si tratta di un miss. Il blocco ' + s.b + ' lo sostituisce.');
        P(k + 1, k < 4 ? 1 : 2, 'Lettura ' + (k + 1) + ' · indirizzo ' + s.a, testo, Object.assign({ calc: conto + ' · ' + (s.ok ? 'hit' : 'miss') }, k === 4 ? { chiedi: { d: 'Ha inizio la seconda passata, che torna all’indirizzo 0. Il blocco 0 è ancora in cache?', o: ['Sì', 'No, un altro blocco ha occupato la sua posizione'], g: s.ok ? 0 : 1, no: s.ok ? 'Nessun blocco con il medesimo indice è stato letto nel frattempo.' : 'Il blocco ' + s.fuori + ' ha il medesimo indice del blocco 0, e lo ha sostituito.' } } : {}));
      });
      const h = U.hit(p);
      P(8, 3, 'Il totale', 'Otto letture: ' + h + ' hit e ' + (8 - h) + ' miss. ' + (p.passo === 1 ? 'Gli interi letti sono vicini, e si trovano tutti nel medesimo blocco, per località spaziale. La seconda passata li trova in cache, per località temporale.' : h === 0 ? 'Gli interi letti distano un blocco o più, e i loro blocchi si contendono le medesime posizioni. La seconda passata non trova in cache alcun blocco.' : 'I blocchi impiegati hanno occupato ciascuno una posizione propria, e la seconda passata li ha trovati tutti in cache.'), { calc: h + ' hit · ' + (8 - h) + ' miss', esito: [h + ' hit su 8', ''] });
      return { passi, esito: h };
    }
  },
  bilancio: {
    regola: [
      'Blocco = quoziente intero fra indirizzo e 64. Indice = resto fra blocco e numero di posizioni. Tag = quoziente della medesima divisione.',
      'Una lettura è un hit se nella posizione data dall’indice risiede il blocco con il medesimo tag.'
    ],
    errori: [
      ['Ritenere che una cache con posizioni libere non produca miss.', 'Due blocchi con il medesimo indice si sostituiscono anche se altre posizioni sono vuote.'],
      ['Confondere indice e tag.', 'L’indice seleziona la posizione. Il tag distingue i blocchi che condividono quella posizione.'],
      ['Considerare soltanto la quantità di dati letti.', 'Quattro interi vicini richiedono un rifornimento. Quattro interi distanti possono richiederne otto.']
    ],
    saFare: ['Calcolare blocco, indice e tag di un indirizzo.', 'Aggiornare lo stato della cache dopo una lettura.', 'Spiegare un hit con la località spaziale o temporale.'],
    esercizi: [
      { d: 'Una cache ha 4 posizioni, con blocchi di 64 byte. Qual è l’indice per l’indirizzo 448?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: '448 / 64 = 7, e 7 diviso 4 dà resto 3.',
        diagnosi: [
          { se: ['7', 'sette'], msg: 'Sette è il numero del blocco. L’indice è il resto della divisione per 4.' },
          { se: ['1', 'uno'], msg: 'Uno è il tag, cioè il quoziente. L’indice è il resto.' },
          { se: ['0', 'zero'], msg: 'Va calcolato anzitutto il blocco: 448 diviso 64.' }
        ],
        altro: 'Il numero è diverso. Si calcoli il blocco, e quindi il resto della divisione per le posizioni.',
        indizi: ['Blocco: 448 / 64 = 7.', 'Indice: resto di 7 diviso 4.', '7 = 4 × 1 + 3: indice 3.'],
        svolgimento: ['Blocco: 7.', 'Indice: 3.', 'Tag: 1.'] },
      { d: 'Nella medesima cache, qual è il tag per l’indirizzo 448?', segnaposto: 'Un numero', giuste: ['1', 'uno'],
        ok: 'Il blocco è 7, e 7 diviso 4 dà quoziente 1.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Tre è l’indice, cioè il resto. Il tag è il quoziente.' },
          { se: ['7', 'sette'], msg: 'Sette è il numero del blocco. Il tag è il quoziente della divisione per 4.' }
        ],
        altro: 'Il numero è diverso. Si divida il numero del blocco per le posizioni e si consideri il quoziente.',
        indizi: ['Blocco: 7.', 'Posizioni: 4.', '7 / 4 = 1, con resto 3.'],
        svolgimento: ['Blocco: 7.', 'Tag: 7 / 4 = 1.'] },
      { d: 'Un programma legge A[0], A[1], A[2] e così via, ogni elemento una volta sola. Quale proprietà produce gli hit?', guida: 'Si scelga la risposta.', o: [
        { t: 'La località spaziale', ok: true, fb: 'Ogni rifornimento trasferisce in cache anche gli elementi successivi.' },
        { t: 'La località temporale', fb: 'Nessun elemento è riletto. È determinante la vicinanza fra gli indirizzi.' },
        { t: 'Nessuna, poiché ogni lettura è un miss', fb: 'Sedici interi da 4 byte condividono un blocco: un miss, seguito da quindici hit.' }] }
    ],
    sfida: ['cslez6_1_02_locality', 'Località']
  }
});
