'use strict';
SL.unita451 = (() => {
  const ms = (x) => { const r = Math.round(x * 100) / 100; return Number.isInteger(r) ? String(r) : r.toFixed(2).replace('.', ','); };
  const conto = (p) => { const giro = 60000 / p.rpm, rot = giro * p.f / 8; return { giro, rot, tot: p.s + rot }; };
  const R2 = (x) => Math.round(x * 100) / 100;
  const FRAZ = { 0: 'nessuna attesa', 2: 'un quarto di giro', 4: 'mezzo giro', 6: 'tre quarti di giro' };
  // fase: 0 la richiesta · 1 il seek · 2 il giro · 3 la rotazione residua · 4 il primo byte
  const quadro = (pre, p, f, o) => {
    const el = SL.el, c = conto(p), els = [], sotto = f >= 4 ? 5 : (5 - p.f + 8) % 8, cil = f >= 1 ? 7 : 2;
    els.push(el.nota(pre + 'ta', o.x, o.y, 'CILINDRI · dal bordo verso il centro', 'mono'));
    for (let k = 0; k < 10; k++) els.push(el.cella(pre + 'c' + k, o.x + k * (o.wc + 4), o.y + 42, o.wc, 32, String(k), k === cil ? 'att' : k === 7 ? 'on' : '', k === cil ? { so: 'testina', piccola: true } : { piccola: true }));
    els.push(el.nota(pre + 'tb', o.x, o.y + 92, 'PISTA DEL CILINDRO 7 · srotolata', 'mono'));
    for (let k = 0; k < 8; k++) { const qui = f >= 1 && k === sotto, mezzo = f === 3 && ((k - sotto + 8) % 8) < p.f && k !== sotto; els.push(el.cella(pre + 's' + k, o.x + k * (o.ws + 4), o.y + 134, o.ws, 32, 'S' + k, qui ? 'att' : k === 5 ? 'on' : mezzo ? 'zero' : '', qui ? { so: 'testina', piccola: true } : { piccola: true })); }
    const wq = (o.w - 3 * 10) / 4, yq = o.y + 186;
    [['un giro', f >= 2 ? ms(c.giro) + ' ms' : '·', 2], ['seek', f >= 1 ? ms(p.s) + ' ms' : '·', 1], ['rotazione residua', f >= 3 ? ms(c.rot) + ' ms' : '·', 3], ['primo byte', f >= 4 ? ms(c.tot) + ' ms' : '·', 4]].forEach((r, k) => els.push(el.box(pre + 'q' + k, o.x + k * (wq + 10), yq, wq, 54, r[0], r[1], f === r[2] ? 'att' : f > r[2] ? 'on' : '', { cls: 'stretta' })));
    return els;
  };
  return { ms, conto, R2, FRAZ, quadro };
})();
SL.registra('4.5.1', {
  titolo: 'Geometria e latenza meccanica',
  obiettivo: 'Obiettivo: descrivere com’è fatto un disco magnetico e calcolare dopo quanto tempo la testina raggiunge il primo byte richiesto.',
  concetti: [['disco', 'Piste, cilindri, settori'], ['puntatore', 'La testina si sposta'], ['clock', 'Il disco gira']],
  filigrana: ['disco', 'clock', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'dispositivo', da: 'Dall’unità 4.3.1', t: 'Il controller', d: 'Il circuito che governa un dispositivo e dialoga con il processore.' },
      { sim: 'pipeline', da: 'Dall’unità 3.5.1', t: 'La latenza', d: 'Il tempo fra l’inizio e la fine di un singolo lavoro.' },
      { sim: 'storage', da: 'Dall’unità 0.1', t: 'La memoria di massa', d: 'Conserva i dati anche a macchina spenta.' }
    ],
    domanda: { d: 'Prima di proseguire: un minuto contiene 60 secondi. Quanti millisecondi sono?', o: [
      { t: '60 000', ok: true, fb: 'Ogni secondo vale 1000 millisecondi, e 60 × 1000 = 60 000.' },
      { t: '6000', fb: 'Un secondo vale 1000 millisecondi: 60 × 1000 = 60 000.' },
      { t: '3600', fb: 'Tremilaseicento sono i secondi di un’ora.' }
    ] }
  },
  idea: {
    titolo: 'Un dispositivo con parti in movimento',
    termini: ['disco magnetico', 'pista', 'cilindro', 'settore', 'seek', 'ritardo di rotazione'],
    testo: [
      'Un [[disco magnetico]] conserva i dati su piatti rivestiti di materiale magnetizzabile, che ruotano a velocità costante. Su ogni superficie i dati sono disposti lungo cerchi concentrici, ciascuno dei quali è una [[pista]]. A leggere e scrivere è una testina, sospesa a brevissima distanza dalla superficie e montata su un braccio che la sposta dal bordo verso il centro e viceversa.',
      'Un disco ha di solito più superfici, ognuna con la propria testina, e i bracci si muovono tutti insieme. Le piste che stanno alla stessa distanza dal centro, sulle varie superfici, formano un [[cilindro]]: il numero di cilindro dice dove si trova il braccio. Ogni pista è poi divisa in tratti di lunghezza fissa, e ogni tratto è un [[settore]]. Per leggere un settore servono due movimenti, entrambi meccanici e quindi lenti rispetto ai tempi del processore.',
      'Il primo è lo spostamento del braccio fino al cilindro richiesto, chiamato [[seek]]. Il secondo è l’attesa che il settore, trascinato dalla rotazione, arrivi sotto la testina: è il [[ritardo di rotazione]]. La velocità di rotazione si misura in giri al minuto. Un minuto vale 60 000 millisecondi, e dividendo 60 000 per i giri al minuto si ottiene la durata di un giro. A 7200 giri al minuto un giro dura circa 8,33 ms.',
      { fig: 'scena', w: 720, h: 252, titolo: 'Seek di 6 ms, poi mezzo giro a 7200 giri al minuto', nota: 'La pista è disegnata srotolata e ferma, ed è la testina a scorrere: il movimento relativo è lo stesso.', els: SL.unita451.quadro('g', { rpm: 7200, f: 4, s: 6 }, 4, { x: 10, y: 0, wc: 62, ws: 76, w: 700 }) },
      'Il ritardo di rotazione si valuta alla fine del seek, perché durante lo spostamento il disco ha continuato a girare. Se in quel momento manca mezzo giro, a 7200 giri al minuto si attendono altri 4,17 ms, e il primo byte è leggibile dopo 6 + 4,17 = 10,17 ms. Mezzo giro è anche l’attesa media, quando ogni posizione è ugualmente probabile. In una singola lettura può andare meglio, fino a nessuna attesa, oppure peggio, fino a quasi un giro intero.'
    ]
  },
  esperimento: {
    faremo: [
      'La testina è ferma sul cilindro 2 e deve leggere il settore S5 del cilindro 7. Sceglierai la velocità di rotazione, la durata del seek e quanta parte di giro manca quando la testina arriva.',
      'Sommeremo il seek e il ritardo di rotazione. Tieni fermi seek e frazione di giro e cambia la velocità: osserva quale dei due addendi si muove.'
    ],
    vedrai: [
      ['puntatore', 'I cilindri', 'In alto: le posizioni del braccio, dal bordo verso il centro.'],
      ['disco', 'La pista', 'Al centro: gli otto settori della pista, srotolati in fila.'],
      ['clock', 'I tempi', 'In basso: la durata di un giro, il seek, la rotazione residua e il totale.']
    ]
  },
  lab: {
    titolo: 'Quanto manca al primo byte',
    scena: { w: 860, h: 262 },
    atti: ['La richiesta', 'Il seek', 'La rotazione', 'Il primo byte'],
    controlli: [
      { id: 'rpm', tipo: 'scelta', eti: 'Velocità', opzioni: [[5400, '5400 giri/min'], [7200, '7200 giri/min'], [15000, '15 000 giri/min']], valore: 7200 },
      { id: 'f', tipo: 'scelta', eti: 'All’arrivo manca', opzioni: [[0, 'nulla'], [2, 'un quarto di giro'], [4, 'mezzo giro'], [6, 'tre quarti di giro']], valore: 4 },
      { id: 's', tipo: 'scelta', eti: 'Seek', opzioni: [[3, '3 ms'], [6, '6 ms'], [9, '9 ms']], valore: 6 }
    ],
    nota: 'I passi sono sempre cinque. I tempi sono arrotondati a due cifre decimali.',
    previsione: {
      domanda: (p) => { const U = SL.unita451, c = U.conto(p); return 'Il seek dura ' + p.s + ' ms. A ' + p.rpm + ' giri al minuto un giro dura ' + U.ms(c.giro) + ' ms, e all’arrivo della testina ' + (p.f === 0 ? 'il settore sta giusto arrivando' : 'manca ' + U.FRAZ[p.f]) + '. Dopo quanto tempo è leggibile il primo byte?'; },
      opzioni: (p) => { const U = SL.unita451, c = U.conto(p); return [c.rot, c.tot, p.s + c.giro].map((v) => [U.R2(v), U.ms(v) + ' ms']); }
    },
    confronto: (pred, esito, p) => { const U = SL.unita451, c = U.conto(p); return 'La previsione indicava ' + U.ms(pred) + ' ms. Il primo byte è leggibile dopo ' + U.ms(esito) + ' ms. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === U.R2(c.rot) ? 'Alla rotazione residua va sommato il seek, che viene prima.' : 'Dopo il seek si attende soltanto la parte di giro che manca, e un giro intero sarebbe troppo.'); },
    costruisci(p) {
      const U = SL.unita451, c = U.conto(p), ms = U.ms, passi = [];
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, wc: 60, ws: 76, w: 820 });
      const hud = (f) => [['Seek', f >= 1 ? ms(p.s) + ' ms' : '·', 'a'], ['Rotazione', f >= 3 ? ms(c.rot) + ' ms' : '·'], ['Primo byte', f >= 4 ? ms(c.tot) + ' ms' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La richiesta', 'La testina si trova sul cilindro 2. Il dato richiesto occupa il settore S5 di una pista del cilindro 7. Il disco gira senza sosta a ' + p.rpm + ' giri al minuto.', {});
      P(1, 1, 'Il seek', 'Il braccio porta la testina dal cilindro 2 al cilindro 7. Lo spostamento dura ' + p.s + ' ms. Nel frattempo il disco ha continuato a girare, e sotto la testina si trova ora il settore S' + ((5 - p.f + 8) % 8) + '.', { calc: 'seek: ' + p.s + ' ms' });
      P(2, 2, 'Quanto dura un giro', 'Il disco compie ' + p.rpm + ' giri in un minuto, cioè in 60 000 ms. Un giro dura 60 000 ÷ ' + p.rpm + ' = ' + ms(c.giro) + ' ms.', { calc: '60 000 ÷ ' + p.rpm + ' = ' + ms(c.giro) + ' ms', chiedi: { d: 'Se il disco girasse più in fretta, la durata di un giro…', o: ['aumenterebbe', 'diminuirebbe', 'resterebbe uguale'], g: 1, no: 'Più giri nello stesso minuto significano meno tempo per ciascuno.' } });
      P(3, 2, 'La rotazione residua', p.f === 0 ? 'Il settore S5 sta arrivando sotto la testina proprio ora. Questa volta la rotazione residua è nulla: un caso fortunato.' : 'Prima che arrivi S5 devono passare sotto la testina ' + p.f + ' settori su 8, cioè ' + U.FRAZ[p.f] + '. L’attesa vale ' + ms(c.giro) + ' × ' + p.f + ' ÷ 8 = ' + ms(c.rot) + ' ms.', { calc: ms(c.giro) + ' × ' + p.f + '/8 = ' + ms(c.rot) + ' ms' });
      P(4, 3, 'Il primo byte', 'L’inizio del settore S5 è sotto la testina dopo ' + ms(p.s) + ' + ' + ms(c.rot) + ' = ' + ms(c.tot) + ' ms. La lettura vera e propria comincia adesso. In media, su molte letture, la rotazione residua vale mezzo giro: ' + ms(c.giro / 2) + ' ms.', { calc: ms(p.s) + ' + ' + ms(c.rot) + ' = ' + ms(c.tot) + ' ms', esito: [ms(c.tot) + ' ms', ''] });
      return { passi, esito: U.R2(c.tot) };
    }
  },
  bilancio: {
    regola: [
      'Durata di un giro in millisecondi = 60 000 ÷ giri al minuto.',
      'Tempo fino al primo byte = seek + ritardo di rotazione. Il ritardo vale in media mezzo giro.'
    ],
    errori: [
      ['Dividere i giri al minuto per 60 e fermarsi lì.', 'Si ottengono i giri al secondo. La durata di un giro è l’inverso.'],
      ['Valutare la posizione del settore all’inizio del seek.', 'Durante il seek il disco gira: conta la posizione all’arrivo della testina.'],
      ['Attendersi un seek più breve da un disco più veloce.', 'La velocità di rotazione accorcia il ritardo di rotazione. Il seek dipende dal braccio.']
    ],
    saFare: ['Distinguere pista, cilindro e settore.', 'Calcolare la durata di un giro.', 'Sommare seek e ritardo di rotazione.'],
    esercizi: [
      { d: 'Un disco ruota a 6000 giri al minuto. Quanti millisecondi dura un giro?', segnaposto: 'Un numero', giuste: ['10', '10ms', '10millisecondi', 'dieci'],
        ok: '60 000 ÷ 6000 = 10 ms.',
        diagnosi: [
          { se: ['100', '100ms'], msg: 'Cento sono i giri al secondo. La durata di un giro è 60 000 ms diviso i giri al minuto.' },
          { se: ['0.01', '0.01ms'], msg: 'Un centesimo di secondo è la durata giusta, espressa però in secondi. In millisecondi vale 10.' },
          { se: ['5', '5ms'], msg: 'Cinque millisecondi sono mezzo giro, l’attesa media. Un giro intero dura il doppio.' }
        ],
        altro: 'Il valore è diverso. Si dividano i millisecondi di un minuto per i giri al minuto.',
        indizi: ['Un minuto vale 60 000 ms.', 'In quel tempo il disco compie 6000 giri.', '60 000 ÷ 6000 = 10.'],
        svolgimento: ['Millisecondi in un minuto: 60 000.', 'Giri in un minuto: 6000.', 'Un giro: 10 ms.'] },
      { d: 'Un disco a 15 000 giri al minuto compie un giro in 4 ms. Il seek dura 5 ms, e quando la testina arriva mancano tre quarti di giro al settore richiesto. Dopo quanti millisecondi è leggibile il primo byte?', segnaposto: 'Un numero', giuste: ['8', '8ms', '8millisecondi', 'otto'],
        ok: 'Tre quarti di 4 ms sono 3 ms, e 5 + 3 = 8 ms.',
        diagnosi: [
          { se: ['9', '9ms'], msg: 'Hai sommato un giro intero. Ne mancano tre quarti: 3 ms.' },
          { se: ['7', '7ms'], msg: 'Mezzo giro è l’attesa media. In questo caso ne mancano tre quarti.' },
          { se: ['3', '3ms'], msg: 'Questa è la sola rotazione residua. Prima c’è il seek.' }
        ],
        altro: 'Il valore è diverso. Si calcolino i tre quarti di un giro e li si sommi al seek.',
        indizi: ['Un giro dura 4 ms.', 'Tre quarti di giro: 3 ms.', '5 + 3 = 8.'],
        svolgimento: ['Seek: 5 ms.', 'Rotazione residua: 4 × 3 ÷ 4 = 3 ms.', 'Primo byte: 8 ms.'] },
      { d: 'Un disco a 5400 giri al minuto viene sostituito con uno a 7200, che ha lo stesso seek. Quale parte dell’attesa diminuisce?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il ritardo di rotazione', ok: true, fb: 'Un giro dura meno, e con esso ogni frazione di giro.' },
        { t: 'Il seek', fb: 'Il seek dipende dal movimento del braccio, che è rimasto lo stesso.' },
        { t: 'Entrambe, nella stessa misura', fb: 'Soltanto la rotazione è diventata più veloce.' }] }
    ],
    sfida: ['cslez4_5_02_disks_02', 'Rotazione, posizionamento e tempo di accesso']
  }
});
