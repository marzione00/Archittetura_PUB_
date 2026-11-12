'use strict';
SL.registra('1.4.3', {
  titolo: 'Il linguaggio C: rappresentazione, operazioni e conversioni',
  obiettivo: 'Alla fine saprai dire che cosa accade ai bit quando un numero passa da un tipo a un altro, e prevedere il risultato di un confronto fra un numero con segno e uno senza.',
  concetti: [['tabella', 'Tipo'], ['segno', 'Estensione'], ['conflitto', 'Conversione']],
  filigrana: ['tabella', 'segno', 'operation'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 1.2.4', t: 'Il tipo', d: 'Un programma dichiara il tipo dei suoi dati, cioè come vanno letti i loro byte.' },
      { sim: 'segno', da: 'Dall’unità 1.4.1', t: 'Con segno e senza segno', d: 'Gli stessi bit valgono 248 senza segno e −8 con segno, quando la parola è larga otto bit.' },
      { sim: 'operation', da: 'Dall’unità 1.1.3', t: 'Il compilatore', d: 'Traduce il sorgente in istruzioni per il processore. È lui a scegliere quali istruzioni usare.' }
    ],
    domanda: { d: 'Prima di proseguire: il byte `0xF8` vale −8 con segno. Che cosa cambia nei suoi bit se decidiamo di leggerlo senza segno?', o: [
      { t: 'Si invertono', fb: 'L’inversione serve a cambiare segno a un numero. Cambiare lettura lascia i bit come sono.' },
      { t: 'Nulla', ok: true, fb: 'I bit restano 11111000. Cambia soltanto la regola con cui li leggiamo, e il valore diventa 248.' },
      { t: 'Si azzera il primo', fb: 'Nessun bit viene toccato. Con la lettura senza segno il primo bit pesa +128.' }
    ] }
  },
  idea: {
    titolo: 'Il tipo decide la lettura',
    termini: ['tipo intero', 'estensione del segno', 'conversione di tipo'],
    testo: [
      'Nell’unità 1.2.4 abbiamo detto che un programma dichiara il tipo dei suoi dati. Nel linguaggio C, quello di hello, ogni numero intero ha un [[tipo intero]] che fissa due cose: quanti bit occupa e se va letto con segno. I più comuni sono quattro. Un `signed char` occupa 8 bit con segno e un `unsigned char` 8 bit senza segno. Un `int` occupa di solito 32 bit con segno, e arriva a circa due miliardi in positivo e in negativo. Un `unsigned int` occupa gli stessi 32 bit senza segno, da zero a circa quattro miliardi.',
      'In memoria ci sono soltanto i bit. Il tipo lo ricorda il compilatore, che per ogni operazione sceglie le istruzioni adatte: per esempio un confronto che tiene conto del segno oppure uno che lo ignora.',
      'Il primo caso delicato è l’allargamento. Quando un numero passa da 8 a 32 bit il suo valore deve restare quello. Per un numero senza segno basta riempire di zeri le posizioni nuove. Per un numero negativo gli zeri sarebbero un errore: il byte 11111000 vale −8, mentre 00000000 11111000 vale 248. La regola giusta copia il bit di segno in tutte le posizioni nuove, e si chiama [[estensione del segno]].',
      { fig: 'scena', w: 700, h: 124, titolo: 'Allargare −8 da otto a sedici bit', nota: 'Copiando il bit di segno il valore resta −8. Riempiendo di zeri diventerebbe 248.', els: [
        SL.el.box('a', 10, 34, 170, 56, '8 bit · vale −8', '0xF8', 'att', { cls: 'stretta' }),
        SL.el.linea('l1', 180, 62, 300, 30, 'on'), SL.el.linea('l2', 180, 62, 300, 94, 'err'),
        SL.el.box('b', 300, 4, 390, 52, 'copiando il bit di segno', '0xFFF8 = −8', 'on', { cls: 'stretta' }),
        SL.el.box('c', 300, 68, 390, 52, 'riempiendo di zeri', '0x00F8 = 248', 'err', { cls: 'stretta' })] },
      'Il secondo caso è il cambio di lettura a parità di larghezza, cioè la [[conversione di tipo|conversione]] fra un tipo con segno e uno senza. Qui i bit restano identici e cambia il valore. Un `int` che vale −1 ha tutti e 32 i bit a 1. Letti come `unsigned int` valgono 4 294 967 295, il numero più grande possibile.',
      'Le due regole insieme producono una trappola famosa. Quando un’operazione mescola un intero con segno e un `unsigned int`, il C converte prima il numero con segno in uno senza segno, e poi opera. Il confronto «−1 è minore di 1» diventa «4 294 967 295 è minore di 1», che è falso. Il programma non segnala nulla e prosegue con la decisione sbagliata.',
      'Capita più spesso di quanto sembri. Le lunghezze, per esempio quella di un file, sono quasi sempre senza segno. Basta confrontarne una con un numero che può scendere sotto zero, e il confronto dà il contrario di quello che il programmatore aveva in mente.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma confronta due numeri: `a`, un `signed char`, e `b`, un `unsigned int`. Seguiremo che cosa fa il C prima di confrontarli.',
      'Le mosse sono tre: l’allargamento di `a` a 32 bit, la sua conversione in numero senza segno, il confronto. A ogni mossa guarda che cosa cambia, se i bit oppure la lettura.'
    ],
    vedrai: [
      ['byte', 'I byte dei due numeri', 'A sinistra, in esadecimale. Il byte più significativo è il primo.'],
      ['tabella', 'Tipo e valore', 'A destra di ciascun numero: il tipo con cui viene letto in quel momento e il valore che ne risulta.'],
      ['conflitto', 'Il confronto', 'In basso: il risultato del programma accanto a quello della matematica.']
    ]
  },
  lab: {
    titolo: 'Un confronto che inganna',
    scena: { w: 860, h: 336 },
    atti: ['Il programma', 'I due operandi', 'Da 8 a 32 bit', 'Da con segno a senza segno', 'Il confronto'],
    nota: 'I passi sono dodici per ogni coppia di valori. Cambia il segno di a per vedere quando il confronto tradisce.',
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'Valore di a', opzioni: [[-1, '−1'], [-8, '−8'], [0, '0'], [5, '5']], valore: -1 },
      { id: 'b', tipo: 'scelta', eti: 'Valore di b', opzioni: [[1, '1'], [10, '10'], [200, '200']], valore: 1 }
    ],
    previsione: {
      domanda: (p) => 'Nel programma a è un signed char che vale ' + String(p.a).replace('-', '−') + ' e b è un unsigned int che vale ' + p.b + '. Che cosa risponde il programma alla domanda «a è minore di b»?',
      opzioni: () => [['vero', 'Vero'], ['falso', 'Falso']]
    },
    confronto: (pred, esito, p) => 'Avevi previsto «' + pred + '». Il programma risponde «' + esito + '». ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.a < 0 ? 'Prima del confronto a viene convertito in un numero senza segno, e un negativo diventa un numero enorme.' : 'Un numero non negativo conserva il suo valore in tutte le conversioni, quindi il confronto dà il risultato atteso.'),
    costruisci(p) {
      const el = SL.el, passi = [];
      const M = (v) => String(v).replace('-', '−');
      const H = (v) => v.toString(16).toUpperCase().padStart(2, '0');
      const neg = p.a < 0, basso = (p.a + 256) % 256, pieno = neg ? 0xFF : 0x00;
      const ua = neg ? 4294967296 + p.a : p.a;
      const esito = ua < p.b ? 'vero' : 'falso', mate = p.a < p.b ? 'vero' : 'falso';
      const bytesA = [null, null, null, basso], bytesB = [0, 0, 0, p.b];
      let tipoA = 'signed char · 8 bit', valA = M(p.a), mostraB = false, ris = null, mat = null;
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('na', 40, 56, 'a', 'forte'), el.nota('nb', 40, 152, 'b', 'forte')];
        bytesA.forEach((v, k) => { if (v !== null) els.push(el.cella('a' + k, 100 + k * 84, 40, 74, 54, H(v), o.att === 'a' + k ? 'att' : o.riga === 'a' ? 'on' : k < 3 ? 'on' : '', { piccola: true, so: k === 3 ? 'basso' : null })); });
        els.push(el.box('ta', 470, 32, 370, 70, tipoA, valA, o.box === 'a' ? 'att' : '', { sim: 'tabella', riga: true }));
        if (mostraB) {
          bytesB.forEach((v, k) => els.push(el.cella('b' + k, 100 + k * 84, 136, 74, 54, H(v), o.riga === 'b' ? 'on' : '', { piccola: true })));
          els.push(el.box('tb', 470, 128, 370, 70, 'unsigned int · 32 bit', String(p.b), o.box === 'b' ? 'att' : '', { sim: 'tabella', riga: true }));
        }
        els.push(el.box('r1', 40, 240, 400, 76, 'nel programma · a < b', ris === null ? '·' : ris, ris === null ? '' : (ris === mate ? 'on' : 'err'), { sim: 'conflitto', riga: true }));
        els.push(el.box('r2', 470, 240, 370, 76, 'in matematica · ' + M(p.a) + ' < ' + p.b, mat === null ? '·' : mat, mat === null ? '' : 'on', { sim: 'bilancio', riga: true }));
        return els;
      };
      const hud = () => [['a letto come', valA, 'a'], ['b', p.b], ['Risultato', ris === null ? '·' : ris, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'La domanda del programma', 'Il programma dichiara a come signed char con valore ' + M(p.a) + ', e b come unsigned int con valore ' + p.b + '. Poi chiede se a è minore di b. Prima di rispondere, il C deve portare i due numeri allo stesso tipo.');
      P({ box: 'a', att: 'a3' }, 1, 'L’operando a', 'Il signed char occupa un byte, ' + H(basso) + '. Letto con segno su otto bit vale ' + M(p.a) + '.', { calc: '0x' + H(basso) + ' = ' + M(p.a) });
      mostraB = true;
      P({ box: 'b', riga: 'b' }, 1, 'L’operando b', 'L’unsigned int occupa quattro byte, qui scritti dal più significativo al meno significativo: 00 00 00 ' + H(p.b) + '. Vale ' + p.b + '.', { calc: '0x000000' + H(p.b) + ' = ' + p.b });
      P({ box: 'a' }, 2, 'Servono altri tre byte', 'Per operare insieme a un numero di 32 bit, a deve diventare largo 32 bit. Il tipo intermedio è int, con segno, e il valore deve restare ' + M(p.a) + '.',
        { chiedi: { d: 'Il bit di segno di a vale ' + (neg ? 1 : 0) + '. Con quali bit vanno riempite le 24 posizioni nuove perché il valore resti ' + M(p.a) + '?', o: ['Con tutti 0', 'Con tutti 1'], g: neg ? 1 : 0, no: 'L’estensione del segno copia il bit di segno. ' + (neg ? 'Riempiendo di zeri un negativo diventerebbe positivo.' : 'Riempiendo di uni un positivo diventerebbe negativo.') } });
      tipoA = 'int · 32 bit';
      [2, 1, 0].forEach((k, i) => {
        bytesA[k] = pieno;
        P({ att: 'a' + k }, 2, 'Il bit di segno riempie il byte ' + ['accanto', 'successivo', 'più significativo'][i], 'Il bit di segno vale ' + (neg ? 1 : 0) + ', quindi gli otto bit nuovi valgono tutti ' + (neg ? 1 : 0) + ': il byte è ' + H(pieno) + '.', { calc: bytesA.map((v) => (v === null ? '··' : H(v))).join(' ') });
      });
      P({ box: 'a', riga: 'a' }, 2, 'Il valore non è cambiato', 'Ora a occupa 32 bit: ' + bytesA.map(H).join(' ') + '. Letto con segno su 32 bit vale ancora ' + M(p.a) + '. L’allargamento ha aggiunto bit e ha conservato il valore.',
        { calc: '0x' + bytesA.map(H).join('') + ' = ' + M(p.a), chiedi: { d: 'Ora un int incontra un unsigned int, e il C converte l’int in unsigned int. Che cosa accade ai 32 bit di a?', o: ['Restano gli stessi', 'Vengono invertiti', 'Vengono azzerati'], g: 0, no: 'La conversione fra tipi della stessa larghezza lascia i bit come sono. Cambia la regola con cui vengono letti.' } });
      tipoA = 'unsigned int · 32 bit';
      P({ box: 'a', riga: 'a' }, 3, 'Cambia il tipo, restano i bit', 'I due operandi hanno la stessa larghezza e segni diversi. La regola del C sceglie il tipo senza segno per entrambi: a viene convertito in unsigned int. I suoi byte restano ' + bytesA.map(H).join(' ') + '.');
      valA = SL.num(ua);
      P({ box: 'a', riga: 'a' }, 3, 'La nuova lettura di a', neg
        ? 'Letti senza segno, quei 32 bit valgono ' + SL.num(ua) + '. È il valore di prima più 4 294 967 296, perché il bit più a sinistra è passato da un peso negativo a uno positivo.'
        : 'Il bit di segno vale 0, quindi le due letture coincidono: a vale ' + ua + ' anche senza segno.',
        { calc: neg ? M(p.a) + ' + 4 294 967 296 = ' + SL.num(ua) : M(p.a) + ' = ' + ua, chiedi: { d: 'Il programma confronta ' + SL.num(ua) + ' e ' + p.b + ' come numeri senza segno. È vero che il primo è minore del secondo?', o: ['Vero', 'Falso'], g: esito === 'vero' ? 0 : 1, no: 'Fra numeri senza segno conta soltanto la grandezza: ' + SL.num(ua) + (ua < p.b ? ' è più piccolo di ' : ' è più grande di ') + p.b + '.' } });
      ris = esito;
      P({ box: 'b', riga: 'b' }, 4, 'Il confronto', 'Il processore confronta ' + SL.num(ua) + ' e ' + p.b + ' senza tenere conto del segno. La risposta del programma è «' + esito + '».', { calc: SL.num(ua) + ' < ' + p.b + ' ?', esito: [esito, esito === 'vero' ? 'si' : 'no'] });
      mat = mate;
      P({}, 4, esito === mate ? 'Programma e matematica concordano' : 'Programma e matematica si contraddicono', esito === mate
        ? 'In matematica ' + M(p.a) + ' < ' + p.b + ' è «' + mate + '», come nel programma. ' + (neg ? 'Qui è andata bene per caso.' : 'Un numero non negativo attraversa le conversioni senza cambiare valore.')
        : 'In matematica ' + M(p.a) + ' è minore di ' + p.b + '. Nel programma la conversione ha trasformato ' + M(p.a) + ' in ' + SL.num(ua) + ', e il confronto è diventato falso. Nessun messaggio avverte dell’accaduto.');
      return { passi, esito };
    }
  },
  bilancio: {
    regola: [
      'Il tipo di un intero fissa la larghezza e la lettura, con segno o senza. Allargando un numero con segno si copia il bit di segno nelle posizioni nuove, così il valore resta lo stesso.',
      'Una conversione fra tipi della stessa larghezza lascia i bit identici e cambia la lettura. Quando un’operazione mescola int e unsigned int, il C converte tutto in unsigned int.'
    ],
    errori: [
      ['Riempire di zeri un numero negativo.', 'Il byte 0xF8 allargato con gli zeri diventa 248. Con l’estensione del segno resta −8.'],
      ['Confrontare un numero con segno e una lunghezza.', 'Le lunghezze sono senza segno. Un numero negativo, convertito, diventa enorme e il confronto si rovescia.'],
      ['Pensare che la conversione corregga i bit.', 'Fra tipi della stessa larghezza i bit restano identici. Il programma attribuisce loro un significato diverso.']
    ],
    saFare: ['Dico larghezza e lettura dei tipi interi più comuni.', 'Allargo un numero con segno copiando il bit di segno.', 'Prevedo il risultato di un confronto fra int e unsigned int.'],
    esercizi: [
      { d: 'Il byte `0xF8`, intero con segno, viene allargato a 16 bit. Come si scrive il risultato in esadecimale?', segnaposto: 'Quattro cifre esadecimali', giuste: ['fff8', '0xfff8'],
        ok: 'Il bit di segno vale 1 e riempie gli otto bit nuovi: 0xFFF8, che vale ancora −8.',
        diagnosi: [
          { se: ['00f8', '0x00f8', 'f8', '0xf8'], msg: 'Con gli zeri davanti il numero diventerebbe 248. Un numero con segno si allarga copiando il bit di segno.' },
          { se: ['f8ff', '0xf8ff'], msg: 'I bit nuovi vanno aggiunti a sinistra, dalla parte più significativa.' },
          { se: ['ff08', '0xff08'], msg: 'Il byte originale resta com’è, F8. Cambiano soltanto gli otto bit aggiunti a sinistra.' }
        ],
        altro: 'La scrittura è diversa. Guarda il bit di segno di 0xF8 e copialo in tutte le posizioni nuove.',
        indizi: ['0xF8 in binario è 11111000.', 'Il bit di segno vale 1.', 'Otto bit a 1 si scrivono FF, e vanno a sinistra di F8.'],
        svolgimento: ['0xF8 = 11111000, bit di segno 1.', 'Gli otto bit nuovi valgono tutti 1: 11111111.', 'Il risultato è 11111111 11111000, cioè 0xFFF8.'] },
      { d: 'In un programma C, n è un int che vale −1 e lunghezza è un unsigned int che vale 5. Che cosa risponde il confronto n < lunghezza?', guida: 'Scegli la risposta.', o: [
        { t: 'Vero, perché −1 è minore di 5', fb: 'In matematica sì. Nel programma n viene prima convertito in unsigned int e vale 4 294 967 295.' },
        { t: 'Falso', ok: true, fb: 'Dopo la conversione il confronto è fra 4 294 967 295 e 5.' },
        { t: 'Il programma si ferma con un errore', fb: 'La conversione avviene in silenzio. Il programma prosegue con il risultato sbagliato.' }] }
    ],
    sfida: ['lez04_03_signed_range', 'Intervallo degli interi con segno']
  }
});
