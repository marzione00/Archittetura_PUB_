'use strict';
SL.registra('1.7.3', {
  titolo: 'Dai valori decodificati all’uso sicuro delle risorse',
  obiettivo: 'Alla fine saprai controllare, prima di riservare memoria, che il conto della dimensione entri nel tipo e che la richiesta rispetti un limite.',
  concetti: [['pixel', 'Dimensioni dichiarate'], ['scudo', 'Precondizione'], ['memory', 'Limite di memoria']],
  filigrana: ['memory', 'scudo', 'pixel'],
  richiami: {
    carte: [
      { sim: 'pixel', da: 'Dall’unità 1.3.1', t: 'I byte di un’immagine', d: 'Un’immagine a colori occupa tre byte per pixel: in tutto larghezza × altezza × 3 byte.' },
      { sim: 'pila', da: 'Dall’unità 1.4.2', t: 'Le cifre che escono', d: 'Quando un risultato senza segno supera la larghezza della parola, le cifre alte vanno perdute. In otto bit, 200 + 100 dà 44.' },
      { sim: 'scudo', da: 'Dall’unità 1.4.4', t: 'Controllare prima', d: 'Il prodotto a × b entra nel tipo se a è al più il massimo diviso per b, con la divisione intera.' }
    ],
    domanda: { d: 'Prima di proseguire: in un byte senza segno il massimo è 255. Il prodotto 16 × 16 entra in un byte?', o: [
      { t: 'Sì', fb: '16 × 16 fa 256, uno più del massimo. In un byte resterebbe 0.' },
      { t: 'No', ok: true, fb: '255 diviso 16 dà 15 con la divisione intera, e 16 è maggiore di 15. Il prodotto vero è 256, che in un byte diventerebbe 0.' },
      { t: 'Dipende dal segno', fb: 'I due numeri sono senza segno. Conta soltanto se 256 supera il massimo, che è 255.' }
    ] }
  },
  idea: {
    titolo: 'Un numero letto bene può chiedere troppo',
    termini: ['allocazione'],
    testo: [
      'Leggere un campo con la regola giusta ne restituisce il valore, e si ferma lì. Un valore scritto in un file resta una dichiarazione di chi il file lo ha preparato. Può essere sbagliata per un guasto, oppure costruita apposta.',
      'Il caso più comune riguarda la memoria. L’intestazione di un’immagine dichiara larghezza e altezza, e il programma che la apre deve procurarsi lo spazio per i pixel prima di leggerli. La richiesta con cui un programma si fa riservare una zona di memoria si chiama [[allocazione]]. Con tre byte per pixel, come nell’unità 1.3.1, i byte da chiedere sono larghezza × altezza × 3.',
      'In questo conto si nascondono due pericoli distinti. Il primo riguarda il conto stesso. Se il risultato viene tenuto in un intero senza segno di 32 bit, il massimo è 4 294 967 295. Un prodotto più grande perde le cifre alte e diventa un numero piccolo, come hai visto nel capitolo 1.4. Un’immagine dichiarata di 65 536 × 65 537 pixel ne ha 4 295 032 832, che in 32 bit diventano 65 536. Il programma riserverebbe lo spazio per un’immagine minuscola e poi vi scriverebbe dentro miliardi di byte.',
      { fig: 'scena', w: 760, h: 96, titolo: 'Un prodotto che esce dai 32 bit', nota: 'Il numero che resta è il resto della divisione per 4 294 967 296.', els: [
        SL.el.box('a', 10, 8, 200, 72, 'larghezza × altezza', '65 536 × 65 537', ''), SL.el.linea('l1', 210, 44, 250, 44, 'on'),
        SL.el.box('b', 250, 8, 220, 72, 'prodotto vero', '4 295 032 832', 'att'), SL.el.linea('l2', 470, 44, 510, 44, 'err'),
        SL.el.box('c', 510, 8, 240, 72, 'quello che resta in 32 bit', '65 536', 'err')] },
      'La difesa è la [[precondizione]] dell’unità 1.4.4: prima di moltiplicare si controlla che il prodotto entri nel tipo. Per due numeri senza segno basta una [[divisione intera]]. Il prodotto a × b entra nel tipo se a è al più il massimo diviso per b.',
      'Il secondo pericolo resta anche quando il conto è esatto. Un’immagine di 40 000 × 4096 pixel chiede 491 520 000 byte. Il numero è giusto, e un programma che lo accontentasse senza riflettere potrebbe esaurire la memoria della macchina per colpa di un’intestazione di pochi byte. Per questo un lettore prudente fissa un limite, scelto in base a quello che è ragionevole per il suo compito, e rifiuta le richieste che lo superano.',
      'I controlli vanno fatti in quest’ordine: prima il conto, poi il limite. Confrontare con il limite un numero che ha già perso le cifre alte sarebbe inutile, perché un numero troncato può sembrare piccolissimo.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma ha letto l’intestazione di un’immagine e deve decidere se riservare la memoria per i pixel. Sceglierai la larghezza e l’altezza dichiarate e il limite che il programma si è dato.',
      'Seguiremo tre controlli in fila: uno prima di ogni moltiplicazione e uno sul limite. Dopo il caso proposto, prova l’immagine di 65 536 × 65 537 pixel e leggi con attenzione che cosa farebbe un programma privo di controlli.'
    ],
    vedrai: [
      ['pixel', 'I valori dichiarati', 'In alto: larghezza, altezza, byte per pixel e il massimo di un intero a 32 bit.'],
      ['memory', 'Il conto', 'Al centro: i pixel, i byte richiesti e il limite.'],
      ['scudo', 'La decisione', 'In basso: la barra della memoria richiesta rispetto al limite, e la scelta del programma.']
    ]
  },
  lab: {
    titolo: 'Riservare memoria per un’immagine dichiarata',
    scena: { w: 860, h: 350 },
    atti: ['I valori dichiarati', 'Il conto dei pixel', 'Il conto dei byte', 'Il limite', 'La decisione'],
    nota: 'Il numero di passi dipende dai dati: al primo controllo fallito il programma rifiuta.',
    controlli: [
      { id: 'L', tipo: 'scelta', eti: 'Larghezza dichiarata', opzioni: [[640, '640'], [4096, '4096'], [40000, '40 000'], [65536, '65 536']], valore: 4096 },
      { id: 'A', tipo: 'scelta', eti: 'Altezza dichiarata', opzioni: [[480, '480'], [4096, '4096'], [40000, '40 000'], [65537, '65 537']], valore: 4096 },
      { id: 'lim', tipo: 'scelta', eti: 'Limite di memoria', opzioni: [[16000000, '16 milioni di byte'], [64000000, '64 milioni di byte'], [256000000, '256 milioni di byte']], valore: 64000000 }
    ],
    previsione: {
      domanda: (p) => 'L’intestazione dichiara ' + SL.num(p.L) + ' × ' + SL.num(p.A) + ' pixel, con tre byte per pixel. Il conto si fa in 32 bit senza segno e il limite è di ' + SL.num(p.lim) + ' byte. Il programma riserverà la memoria?',
      opzioni: () => [['ok', 'Sì, la riserva'], ['conto', 'No: il conto esce dai 32 bit'], ['limite', 'No: la richiesta supera il limite']]
    },
    confronto: (pred, esito) => {
      const N = { ok: 'la memoria viene riservata', conto: 'il conto esce dai 32 bit', limite: 'la richiesta supera il limite' };
      return 'Avevi previsto: ' + N[pred] + '. Esito: ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'conto' ? 'Uno dei due prodotti supera 4 294 967 295, quindi il programma si ferma prima ancora di guardare il limite.' : esito === 'limite' ? 'Il conto è esatto, e il numero di byte che ne risulta è più grande del limite.' : 'I due prodotti entrano in 32 bit e i byte richiesti stanno sotto il limite.');
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

      P({}, 0, 'L’intestazione è stata letta', 'L’intestazione dichiara una larghezza di ' + N(L) + ' pixel e un’altezza di ' + N(A) + '. I due campi erano completi e sono stati letti con la regola giusta. Resta da decidere se accontentare la richiesta che contengono.');
      P({ att: '3' }, 0, 'La memoria da riservare', 'Ogni pixel occupa tre byte, quindi i byte da riservare sono larghezza × altezza × 3. Il risultato verrà tenuto in un intero senza segno di 32 bit, che arriva al massimo a ' + N(MAX) + '.',
        { calc: N(L) + ' × ' + N(A) + ' × 3', chiedi: { d: 'Il prodotto ' + N(L) + ' × ' + N(A) + ' entra in un intero senza segno di 32 bit?', o: ['Sì', 'No'], g: ok1 ? 0 : 1, no: ok1 ? 'Il prodotto vale ' + N(pix) + ', che sta sotto il massimo.' : 'Il prodotto vale ' + N(pix) + ', che supera il massimo di ' + N(pix - MAX) + '.' } });
      P({ att: 'M', err: ok1 ? null : 'L' }, 1, 'Il controllo prima del primo prodotto', 'Il prodotto larghezza × altezza entra in 32 bit soltanto se la larghezza è al più il massimo diviso per l’altezza. La divisione intera ' + N(MAX) + ' ÷ ' + N(A) + ' dà ' + N(q1) + ', e la larghezza vale ' + N(L) + '.',
        { calc: N(L) + ' ≤ ' + N(q1) + ' ?', esito: [ok1 ? 'sì' : 'no', ok1 ? 'si' : 'no'] });
      if (!ok1) {
        const r = pix % DUE32, r3 = (r * 3) % DUE32;
        P({ err: 'p', pix: N(r), byte: N(r3) }, 1, 'Che cosa farebbe un programma credulo', 'Il prodotto vero è ' + N(pix) + ', più grande del massimo. In 32 bit ne resterebbe soltanto il resto della divisione per ' + N(DUE32) + ', cioè ' + N(r) + ' pixel, e quindi ' + N(r3) + ' byte. ' + (r3 <= LIM ? 'Quel numero rientra nel limite. Il programma riserverebbe ' + N(r3) + ' byte per un’immagine che ne richiede ' + N(byte) + ', e scriverebbe i pixel oltre la fine della zona riservata.' : 'Per caso anche quel numero supera il limite, ma il confronto avverrebbe su un valore sbagliato.'),
          { calc: N(pix) + ' − ' + N(DUE32) + ' = ' + N(r) });
        P({ err: 'L', dec: 'richiesta rifiutata: il conto esce dai 32 bit', male: true }, 4, 'Il programma prudente rifiuta', 'La precondizione è falsa, quindi la moltiplicazione viene saltata e la memoria resta com’era. Il programma segnala che l’immagine dichiara dimensioni inaccettabili.', { calc: 'memoria riservata: 0 byte' });
        return { passi, esito: 'conto' };
      }
      fatti = 1;
      P({ att: 'p', pix: N(pix) }, 1, 'I pixel', 'Il controllo è superato e il prodotto si può calcolare senza perdere cifre.', { calc: N(L) + ' × ' + N(A) + ' = ' + N(pix) });
      P({ att: 'M', err: ok2 ? null : 'p', pix: N(pix) }, 2, 'Il controllo prima del secondo prodotto', 'Il conto contiene una seconda moltiplicazione, e il controllo va ripetuto. Il massimo diviso per tre dà ' + N(q2) + ', e i pixel sono ' + N(pix) + '.',
        { calc: N(pix) + ' ≤ ' + N(q2) + ' ?', esito: [ok2 ? 'sì' : 'no', ok2 ? 'si' : 'no'] });
      if (!ok2) {
        const r = byte % DUE32;
        P({ err: 'b', pix: N(pix), byte: N(r) }, 2, 'Che cosa farebbe un programma credulo', 'Il prodotto vero è ' + N(byte) + ', più grande del massimo. In 32 bit ne resterebbe soltanto il resto della divisione per ' + N(DUE32) + ', cioè ' + N(r) + ' byte. ' + (r <= LIM ? 'Quel numero rientra nel limite. Il programma riserverebbe meno memoria di quella che poi riempie.' : 'Per caso anche quel numero supera il limite, ma il confronto avverrebbe su un valore sbagliato.'),
          { calc: N(byte) + ' − ' + N(DUE32) + ' = ' + N(r) });
        P({ err: 'p', pix: N(pix), dec: 'richiesta rifiutata: il conto esce dai 32 bit', male: true }, 4, 'Il programma prudente rifiuta', 'La precondizione è falsa, quindi la seconda moltiplicazione viene saltata e la memoria resta com’era. Il programma segnala che l’immagine dichiara dimensioni inaccettabili.', { calc: 'memoria riservata: 0 byte' });
        return { passi, esito: 'conto' };
      }
      fatti = 2;
      P({ att: 'b', pix: N(pix), byte: N(byte) }, 2, 'I byte richiesti', 'Anche il secondo controllo è superato. I byte necessari per i pixel sono ' + N(byte) + ', e questo numero è esatto.', { calc: N(pix) + ' × 3 = ' + N(byte) });
      P({ att: 'l', err: ok3 ? null : 'b', pix: N(pix), byte: N(byte), barra: Math.min(1, byte / LIM), barraErr: !ok3 }, 3, 'Il confronto con il limite', 'Un numero esatto può essere comunque troppo grande. Il programma ha deciso di dedicare a un’immagine al massimo ' + N(LIM) + ' byte. La richiesta è di ' + N(byte) + ' byte' + (ok3 ? ', che sta sotto il limite.' : ', circa ' + SL.tlm.virgola(Math.round(10 * byte / LIM) / 10) + ' volte il limite.'),
        { calc: N(byte) + ' ≤ ' + N(LIM) + ' ?', esito: [ok3 ? 'sì' : 'no', ok3 ? 'si' : 'no'] });
      if (ok3) {
        fatti = 3;
        P({ pix: N(pix), byte: N(byte), barra: byte / LIM, dec: 'memoria riservata: ' + N(byte) + ' byte' }, 4, 'La memoria viene riservata', 'La richiesta ha superato i due controlli sul conto e quello sul limite. Il programma riserva ' + N(byte) + ' byte e può cominciare a ricevere i pixel.', { calc: 'memoria riservata: ' + N(byte) + ' byte' });
        return { passi, esito: 'ok' };
      }
      P({ err: 'b', pix: N(pix), byte: N(byte), barra: 1, barraErr: true, dec: 'richiesta rifiutata: supera il limite', male: true }, 4, 'Il programma rifiuta', 'Il conto è esatto e la richiesta supera il limite. Il programma rifiuta l’immagine e lascia la memoria com’era: un’intestazione di pochi byte resta senza effetto sulle risorse della macchina.', { calc: 'memoria riservata: 0 byte' });
      return { passi, esito: 'limite' };
    }
  },
  bilancio: {
    regola: [
      'Un valore letto correttamente resta una dichiarazione di chi ha scritto i dati. Prima di usarlo per riservare memoria si controlla che il conto entri nel tipo, con una precondizione davanti a ogni moltiplicazione.',
      'Un conto esatto può chiedere troppo. Il lettore fissa un limite e rifiuta le richieste che lo superano. I controlli sul conto vengono prima di quello sul limite.'
    ],
    errori: [
      ['Confrontare con il limite un numero già traboccato.', 'Un prodotto troncato può sembrare piccolo e superare il confronto. Il limite protegge soltanto se il numero è esatto.'],
      ['Controllare una sola moltiplicazione.', 'Il conto ne contiene due, e ciascuna può traboccare per conto suo.'],
      ['Fidarsi perché i campi sono ben formati.', 'Larghezza e altezza possono essere due interi letti senza errori e descrivere un’immagine che nessuna macchina può contenere.']
    ],
    saFare: ['Scrivo la precondizione che protegge un prodotto in 32 bit.', 'Distinguo un conto traboccato da una richiesta troppo grande.', 'Metto in ordine i controlli che precedono un’allocazione.'],
    esercizi: [
      { d: 'Un intero senza segno di 32 bit arriva a 4 294 967 295. Se l’altezza dichiarata è 65 536, qual è la larghezza più grande per cui il prodotto larghezza × altezza entra nel tipo?', segnaposto: 'Un numero di pixel', giuste: ['65535', '65.535'],
        ok: 'La divisione intera 4 294 967 295 ÷ 65 536 dà 65 535. Con quella larghezza il prodotto vale 4 294 901 760.',
        diagnosi: [
          { se: ['65536', '65.536'], msg: '65 536 × 65 536 fa 4 294 967 296, uno più del massimo. In 32 bit resterebbe 0.' },
          { se: ['4294967295', '4.294.967.295'], msg: 'Questo è il massimo del tipo. La larghezza cercata è il massimo diviso per l’altezza.' },
          { se: ['65537', '65.537'], msg: 'Con 65 537 il prodotto supera il massimo di oltre sessantamila. La larghezza cercata è più piccola.' }
        ],
        altro: 'Il numero è diverso. Applica la precondizione: la larghezza deve essere al più il massimo diviso per l’altezza.',
        indizi: ['La precondizione è: larghezza ≤ massimo ÷ altezza, con la divisione intera.', '65 536 è 2 elevato a 16, e il massimo è 2 elevato a 32 meno 1.', '4 294 967 295 ÷ 65 536 dà 65 535, con il resto di 65 535.'],
        svolgimento: ['Precondizione: larghezza ≤ 4 294 967 295 ÷ 65 536.', 'Divisione intera: il quoziente è 65 535.', 'Verifica: 65 535 × 65 536 = 4 294 901 760, che sta sotto il massimo.', 'Con una larghezza di 65 536 il prodotto sarebbe 4 294 967 296, uno in più.'] },
      { d: 'Un programma fa il conto in 32 bit e controlla soltanto il limite di memoria. Riceve un’immagine di 65 536 × 65 537 pixel a un byte per pixel. Che cosa succede?', guida: 'Scegli la risposta.', o: [
        { t: 'Rifiuta, perché la richiesta supera il limite', fb: 'In 32 bit il prodotto diventa 65 536, un numero che rientra in qualunque limite ragionevole.' },
        { t: 'Riserva 65 536 byte e poi scrive oltre', ok: true, fb: 'Il prodotto vero, 4 295 032 832, perde le cifre alte. Il programma riserva poco e riceve molto.' },
        { t: 'Riserva 4 295 032 832 byte', fb: 'Quel numero supera il massimo del tipo, quindi il programma lo vede già troncato.' }] }
    ]
  }
});
