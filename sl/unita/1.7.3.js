'use strict';
SL.registra('1.7.3', {
  titolo: 'Dai valori decodificati all’uso sicuro delle risorse',
  obiettivo: 'Obiettivo: verificare, prima di riservare memoria, che il calcolo della dimensione sia contenuto nel tipo e che la richiesta rispetti un limite.',
  concetti: [['pixel', 'Dimensioni dichiarate'], ['scudo', 'Precondizione'], ['memory', 'Limite di memoria']],
  filigrana: ['memory', 'scudo', 'pixel'],
  richiami: {
    carte: [
      { sim: 'pixel', da: 'Dall’unità 1.3.1', t: 'I byte di un’immagine', d: 'Un’immagine a colori occupa tre byte per pixel: complessivamente larghezza × altezza × 3 byte.' },
      { sim: 'pila', da: 'Dall’unità 1.4.2', t: 'Le cifre perdute', d: 'Quando un risultato senza segno supera la larghezza della parola, le cifre alte vanno perdute. In otto bit, 200 + 100 dà 44.' },
      { sim: 'scudo', da: 'Dall’unità 1.4.4', t: 'Il controllo preventivo', d: 'Il prodotto a × b è contenuto nel tipo se a è al più il massimo diviso per b, con la divisione intera.' }
    ],
    domanda: { d: 'Prima di proseguire: in un byte senza segno il massimo è 255. Il prodotto 16 × 16 è contenuto in un byte?', o: [
      { t: 'Sì', fb: '16 × 16 dà 256, un’unità oltre il massimo. In un byte resterebbe 0.' },
      { t: 'No', ok: true, fb: '255 diviso 16 dà 15 con la divisione intera, e 16 è maggiore di 15. Il prodotto esatto è 256, che in un byte diventerebbe 0.' },
      { t: 'Dipende dal segno', fb: 'I due numeri sono senza segno. È rilevante soltanto se 256 superi il massimo, che è 255.' }
    ] }
  },
  idea: {
    titolo: 'Un valore letto correttamente può essere inaccettabile',
    termini: ['allocazione'],
    testo: [
      'La lettura di un campo con la regola corretta ne restituisce il valore, e nulla più. Un valore scritto in un file resta una dichiarazione di chi ha prodotto il file. Essa può essere errata per un guasto, oppure costruita deliberatamente.',
      'Il caso più comune riguarda la memoria. L’intestazione di un’immagine dichiara larghezza e altezza, e il programma che la apre deve ottenere lo spazio per i pixel prima di leggerli. La richiesta con la quale un programma ottiene la riserva di una zona di memoria prende il nome di [[allocazione]]. Con tre byte per pixel, come nell’unità 1.3.1, i byte da richiedere sono larghezza × altezza × 3.',
      'Tale calcolo comporta due rischi distinti. Il primo riguarda il calcolo stesso. Se il risultato è conservato in un intero senza segno di 32 bit, il massimo è 4 294 967 295. Un prodotto maggiore perde le cifre alte e diventa un numero piccolo, come mostrato nel capitolo 1.4. Un’immagine dichiarata di 65 536 × 65 537 pixel ne comprende 4 295 032 832, che in 32 bit diventano 65 536. Il programma riserverebbe lo spazio per un’immagine di piccole dimensioni e vi scriverebbe poi miliardi di byte.',
      { fig: 'scena', w: 760, h: 96, titolo: 'Un prodotto che eccede i 32 bit', nota: 'Il numero che resta è il resto della divisione per 4 294 967 296.', els: [
        SL.el.box('a', 10, 8, 200, 72, 'larghezza × altezza', '65 536 × 65 537', ''), SL.el.linea('l1', 210, 44, 250, 44, 'on'),
        SL.el.box('b', 250, 8, 220, 72, 'prodotto esatto', '4 295 032 832', 'att'), SL.el.linea('l2', 470, 44, 510, 44, 'err'),
        SL.el.box('c', 510, 8, 240, 72, 'valore residuo in 32 bit', '65 536', 'err')] },
      'La protezione è la [[precondizione]] dell’unità 1.4.4: prima della moltiplicazione si verifica che il prodotto sia contenuto nel tipo. Per due numeri senza segno è sufficiente una [[divisione intera]]. Il prodotto a × b è contenuto nel tipo se a è al più il massimo diviso per b.',
      'Il secondo rischio sussiste anche quando il calcolo è esatto. Un’immagine di 40 000 × 4096 pixel richiede 491 520 000 byte. Il numero è corretto, e un programma che soddisfacesse la richiesta senza ulteriori verifiche potrebbe esaurire la memoria della macchina a causa di un’intestazione di pochi byte. Per questa ragione un lettore corretto fissa un limite, commisurato al proprio compito, e rifiuta le richieste che lo superano.',
      'I controlli vanno eseguiti in quest’ordine: prima il calcolo, poi il limite. Il confronto con il limite di un numero che ha già perduto le cifre alte sarebbe inutile, poiché un numero troncato può risultare molto piccolo.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma ha letto l’intestazione di un’immagine e deve decidere se riservare la memoria per i pixel. I controlli fissano la larghezza e l’altezza dichiarate e il limite adottato dal programma.',
      'L’esperimento segue tre controlli in successione: uno prima di ogni moltiplicazione e uno sul limite. Dopo il caso proposto, è istruttiva l’immagine di 65 536 × 65 537 pixel, per la quale è descritto il comportamento di un programma privo di controlli.'
    ],
    vedrai: [
      ['pixel', 'I valori dichiarati', 'In alto: larghezza, altezza, byte per pixel e il massimo di un intero a 32 bit.'],
      ['memory', 'Il calcolo', 'Al centro: i pixel, i byte richiesti e il limite.'],
      ['scudo', 'La decisione', 'In basso: la barra della memoria richiesta rispetto al limite, e la scelta del programma.']
    ]
  },
  lab: {
    titolo: 'Riserva di memoria per un’immagine dichiarata',
    scena: { w: 860, h: 350 },
    atti: ['I valori dichiarati', 'Il calcolo dei pixel', 'Il calcolo dei byte', 'Il limite', 'La decisione'],
    nota: 'Il numero di passi dipende dai dati: al primo controllo fallito il programma rifiuta.',
    controlli: [
      { id: 'L', tipo: 'scelta', eti: 'Larghezza dichiarata', opzioni: [[640, '640'], [4096, '4096'], [40000, '40 000'], [65536, '65 536']], valore: 4096 },
      { id: 'A', tipo: 'scelta', eti: 'Altezza dichiarata', opzioni: [[480, '480'], [4096, '4096'], [40000, '40 000'], [65537, '65 537']], valore: 4096 },
      { id: 'lim', tipo: 'scelta', eti: 'Limite di memoria', opzioni: [[16000000, '16 milioni di byte'], [64000000, '64 milioni di byte'], [256000000, '256 milioni di byte']], valore: 64000000 }
    ],
    previsione: {
      domanda: (p) => 'L’intestazione dichiara ' + SL.num(p.L) + ' × ' + SL.num(p.A) + ' pixel, con tre byte per pixel. Il calcolo è eseguito in 32 bit senza segno e il limite è di ' + SL.num(p.lim) + ' byte. Il programma riserverà la memoria?',
      opzioni: () => [['ok', 'Sì, la riserva'], ['conto', 'No: il calcolo eccede i 32 bit'], ['limite', 'No: la richiesta supera il limite']]
    },
    confronto: (pred, esito) => {
      const N = { ok: 'la memoria viene riservata', conto: 'il calcolo eccede i 32 bit', limite: 'la richiesta supera il limite' };
      return 'La previsione indicava: ' + N[pred] + '. Esito: ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'conto' ? 'Uno dei due prodotti supera 4 294 967 295, e il programma si arresta quindi prima di esaminare il limite.' : esito === 'limite' ? 'Il calcolo è esatto, e il numero di byte che ne risulta è maggiore del limite.' : 'I due prodotti sono contenuti in 32 bit e i byte richiesti sono inferiori al limite.');
    },
    costruisci(p) {
      const el = SL.el, N = SL.num, passi = [];
      const MAX = 4294967295, DUE32 = 4294967296, L = p.L, A = p.A, LIM = p.lim;
      const q1 = Math.floor(MAX / A), ok1 = L <= q1, pix = L * A;
      const q2 = Math.floor(MAX / 3), ok2 = pix <= q2, byte = pix * 3, ok3 = byte <= LIM;
      const quadro = (o) => {
        o = o || {};
        const st = (k) => (o.err === k ? 'err' : o.att === k ? 'att' : '');
        return [
          el.nota('t1', 40, 0, 'L’INTESTAZIONE DICHIARA', 'mono'),
          el.box('bL', 40, 28, 180, 68, 'larghezza', N(L), st('L')),
          el.box('bA', 235, 28, 180, 68, 'altezza', N(A), st('A')),
          el.box('b3', 430, 28, 170, 68, 'byte per pixel', '3', st('3')),
          el.box('bM', 615, 28, 215, 68, 'massimo a 32 bit', N(MAX), st('M')),
          el.box('bp', 40, 116, 250, 76, 'pixel', o.pix == null ? '·' : o.pix, st('p') || (o.pix != null && o.err !== 'p' ? 'on' : ''), { sim: 'pixel', riga: true }),
          el.box('bb', 305, 116, 265, 76, 'byte richiesti', o.byte == null ? '·' : o.byte, st('b') || (o.byte != null && o.err !== 'b' ? 'on' : ''), { sim: 'memory', riga: true }),
          el.box('bl', 585, 116, 245, 76, 'limite', N(LIM), st('l'), { sim: 'scudo', riga: true }),
          el.nota('t2', 40, 212, 'MEMORIA RICHIESTA RISPETTO AL LIMITE', 'mono'),
          Object.assign(el.barra('ba', 40, 238, 790, 16, o.barra || 0), o.barraErr ? { st: 'err' } : null),
          el.box('bd', 40, 272, 790, 66, 'decisione', o.dec || '·', o.dec ? (o.male ? 'err' : 'on') : '', { sim: 'lucchetto', riga: true })
        ];
      };
      let fatti = 0;
      const hud = (o) => [['Controlli superati', fatti + ' su 3', 'a'], ['Pixel', o.pix == null ? '·' : o.pix], ['Byte richiesti', o.byte == null ? '·' : o.byte, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o), els: quadro(o) }, extra));

      P({}, 0, 'L’intestazione è stata letta', 'L’intestazione dichiara una larghezza di ' + N(L) + ' pixel e un’altezza di ' + N(A) + '. I due campi erano completi e sono stati letti con la regola corretta. Resta da stabilire se soddisfare la richiesta che contengono.');
      P({ att: '3' }, 0, 'La memoria da riservare', 'Ogni pixel occupa tre byte, e i byte da riservare sono quindi larghezza × altezza × 3. Il risultato è conservato in un intero senza segno di 32 bit, il cui massimo è ' + N(MAX) + '.',
        { calc: N(L) + ' × ' + N(A) + ' × 3', chiedi: { d: 'Il prodotto ' + N(L) + ' × ' + N(A) + ' è contenuto in un intero senza segno di 32 bit?', o: ['Sì', 'No'], g: ok1 ? 0 : 1, no: ok1 ? 'Il prodotto vale ' + N(pix) + ', valore inferiore al massimo.' : 'Il prodotto vale ' + N(pix) + ', che supera il massimo di ' + N(pix - MAX) + '.' } });
      P({ att: 'M', err: ok1 ? null : 'L' }, 1, 'Il controllo prima del primo prodotto', 'Il prodotto larghezza × altezza è contenuto in 32 bit soltanto se la larghezza è al più il massimo diviso per l’altezza. La divisione intera ' + N(MAX) + ' ÷ ' + N(A) + ' dà ' + N(q1) + ', e la larghezza vale ' + N(L) + '.',
        { calc: N(L) + ' ≤ ' + N(q1) + ' ?', esito: [ok1 ? 'sì' : 'no', ok1 ? 'si' : 'no'] });
      if (!ok1) {
        const r = pix % DUE32, r3 = (r * 3) % DUE32;
        P({ err: 'p', pix: N(r), byte: N(r3) }, 1, 'Un programma privo di controlli', 'Il prodotto esatto è ' + N(pix) + ', maggiore del massimo. In 32 bit ne resterebbe soltanto il resto della divisione per ' + N(DUE32) + ', cioè ' + N(r) + ' pixel, e quindi ' + N(r3) + ' byte. ' + (r3 <= LIM ? 'Tale numero rientra nel limite. Il programma riserverebbe ' + N(r3) + ' byte per un’immagine che ne richiede ' + N(byte) + ', e scriverebbe i pixel oltre la fine della zona riservata.' : 'Accidentalmente anche tale numero supera il limite, e tuttavia il confronto avverrebbe su un valore errato.'),
          { calc: N(pix) + ' − ' + N(DUE32) + ' = ' + N(r) });
        P({ err: 'L', dec: 'richiesta rifiutata: il calcolo eccede i 32 bit', male: true }, 4, 'Il programma con controlli rifiuta', 'La precondizione è falsa, e la moltiplicazione è quindi omessa: la memoria resta invariata. Il programma segnala che l’immagine dichiara dimensioni inaccettabili.', { calc: 'memoria riservata: 0 byte' });
        return { passi, esito: 'conto' };
      }
      fatti = 1;
      P({ att: 'p', pix: N(pix) }, 1, 'I pixel', 'Il controllo è superato e il prodotto può essere calcolato senza perdita di cifre.', { calc: N(L) + ' × ' + N(A) + ' = ' + N(pix) });
      P({ att: 'M', err: ok2 ? null : 'p', pix: N(pix) }, 2, 'Il controllo prima del secondo prodotto', 'Il calcolo comprende una seconda moltiplicazione, e il controllo va ripetuto. Il massimo diviso per tre dà ' + N(q2) + ', e i pixel sono ' + N(pix) + '.',
        { calc: N(pix) + ' ≤ ' + N(q2) + ' ?', esito: [ok2 ? 'sì' : 'no', ok2 ? 'si' : 'no'] });
      if (!ok2) {
        const r = byte % DUE32;
        P({ err: 'b', pix: N(pix), byte: N(r) }, 2, 'Un programma privo di controlli', 'Il prodotto esatto è ' + N(byte) + ', maggiore del massimo. In 32 bit ne resterebbe soltanto il resto della divisione per ' + N(DUE32) + ', cioè ' + N(r) + ' byte. ' + (r <= LIM ? 'Tale numero rientra nel limite. Il programma riserverebbe meno memoria di quella che poi occuperebbe.' : 'Accidentalmente anche tale numero supera il limite, e tuttavia il confronto avverrebbe su un valore errato.'),
          { calc: N(byte) + ' − ' + N(DUE32) + ' = ' + N(r) });
        P({ err: 'p', pix: N(pix), dec: 'richiesta rifiutata: il calcolo eccede i 32 bit', male: true }, 4, 'Il programma con controlli rifiuta', 'La precondizione è falsa, e la seconda moltiplicazione è quindi omessa: la memoria resta invariata. Il programma segnala che l’immagine dichiara dimensioni inaccettabili.', { calc: 'memoria riservata: 0 byte' });
        return { passi, esito: 'conto' };
      }
      fatti = 2;
      P({ att: 'b', pix: N(pix), byte: N(byte) }, 2, 'I byte richiesti', 'Anche il secondo controllo è superato. I byte necessari per i pixel sono ' + N(byte) + ', e questo numero è esatto.', { calc: N(pix) + ' × 3 = ' + N(byte) });
      P({ att: 'l', err: ok3 ? null : 'b', pix: N(pix), byte: N(byte), barra: Math.min(1, byte / LIM), barraErr: !ok3 }, 3, 'Il confronto con il limite', 'Un numero esatto può risultare comunque eccessivo. Il programma destina a un’immagine al massimo ' + N(LIM) + ' byte. La richiesta è di ' + N(byte) + ' byte' + (ok3 ? ', valore inferiore al limite.' : ', circa ' + SL.tlm.virgola(Math.round(10 * byte / LIM) / 10) + ' volte il limite.'),
        { calc: N(byte) + ' ≤ ' + N(LIM) + ' ?', esito: [ok3 ? 'sì' : 'no', ok3 ? 'si' : 'no'] });
      if (ok3) {
        fatti = 3;
        P({ pix: N(pix), byte: N(byte), barra: byte / LIM, dec: 'memoria riservata: ' + N(byte) + ' byte' }, 4, 'La memoria viene riservata', 'La richiesta ha superato i due controlli sul calcolo e quello sul limite. Il programma riserva ' + N(byte) + ' byte e può cominciare a ricevere i pixel.', { calc: 'memoria riservata: ' + N(byte) + ' byte' });
        return { passi, esito: 'ok' };
      }
      P({ err: 'b', pix: N(pix), byte: N(byte), barra: 1, barraErr: true, dec: 'richiesta rifiutata: supera il limite', male: true }, 4, 'Il programma rifiuta', 'Il calcolo è esatto e la richiesta supera il limite. Il programma rifiuta l’immagine e lascia invariata la memoria: un’intestazione di pochi byte resta senza effetto sulle risorse della macchina.', { calc: 'memoria riservata: 0 byte' });
      return { passi, esito: 'limite' };
    }
  },
  bilancio: {
    regola: [
      'Un valore letto correttamente resta una dichiarazione di chi ha scritto i dati. Prima di impiegarlo per riservare memoria si verifica che il calcolo sia contenuto nel tipo, con una precondizione anteposta a ogni moltiplicazione.',
      'Un calcolo esatto può fornire una richiesta eccessiva. Il lettore fissa un limite e rifiuta le richieste che lo superano. I controlli sul calcolo precedono quello sul limite.'
    ],
    errori: [
      ['Confrontare con il limite un numero già traboccato.', 'Un prodotto troncato può risultare piccolo e superare il confronto. Il limite protegge soltanto se il numero è esatto.'],
      ['Controllare una sola moltiplicazione.', 'Il calcolo ne comprende due, e ciascuna può traboccare indipendentemente.'],
      ['Ritenere affidabili i valori di campi ben formati.', 'Larghezza e altezza possono essere due interi letti senza errori e descrivere un’immagine che nessuna macchina può contenere.']
    ],
    saFare: ['Scrivere la precondizione che protegge un prodotto in 32 bit.', 'Distinguere un calcolo traboccato da una richiesta eccessiva.', 'Porre in ordine i controlli che precedono un’allocazione.'],
    esercizi: [
      { d: 'Il massimo di un intero senza segno di 32 bit è 4 294 967 295. Se l’altezza dichiarata è 65 536, qual è la massima larghezza per la quale il prodotto larghezza × altezza è contenuto nel tipo?', segnaposto: 'Un numero di pixel', giuste: ['65535', '65.535'],
        ok: 'La divisione intera 4 294 967 295 ÷ 65 536 dà 65 535. Con tale larghezza il prodotto vale 4 294 901 760.',
        diagnosi: [
          { se: ['65536', '65.536'], msg: '65 536 × 65 536 dà 4 294 967 296, un’unità oltre il massimo. In 32 bit resterebbe 0.' },
          { se: ['4294967295', '4.294.967.295'], msg: 'Questo è il massimo del tipo. La larghezza cercata è il massimo diviso per l’altezza.' },
          { se: ['65537', '65.537'], msg: 'Con 65 537 il prodotto supera il massimo di oltre sessantamila. La larghezza cercata è minore.' }
        ],
        altro: 'Il numero è diverso. Si applichi la precondizione: la larghezza deve essere al più il massimo diviso per l’altezza.',
        indizi: ['La precondizione è: larghezza ≤ massimo ÷ altezza, con la divisione intera.', '65 536 è 2 elevato a 16, e il massimo è 2 elevato a 32 meno 1.', '4 294 967 295 ÷ 65 536 dà 65 535, con il resto di 65 535.'],
        svolgimento: ['Precondizione: larghezza ≤ 4 294 967 295 ÷ 65 536.', 'Divisione intera: il quoziente è 65 535.', 'Riscontro: 65 535 × 65 536 = 4 294 901 760, valore inferiore al massimo.', 'Con una larghezza di 65 536 il prodotto sarebbe 4 294 967 296, un’unità oltre il massimo.'] },
      { d: 'Un programma esegue il calcolo in 32 bit e verifica soltanto il limite di memoria. Riceve un’immagine di 65 536 × 65 537 pixel a un byte per pixel. Che cosa accade?', guida: 'Si scelga la risposta.', o: [
        { t: 'Rifiuta, poiché la richiesta supera il limite', fb: 'In 32 bit il prodotto diventa 65 536, un numero che rientra in qualunque limite ragionevole.' },
        { t: 'Riserva 65 536 byte e poi scrive oltre', ok: true, fb: 'Il prodotto esatto, 4 295 032 832, perde le cifre alte. Il programma riserva una zona piccola e riceve una quantità di dati molto maggiore.' },
        { t: 'Riserva 4 295 032 832 byte', fb: 'Tale numero supera il massimo del tipo, e il programma lo riceve quindi già troncato.' }] }
    ]
  }
});
