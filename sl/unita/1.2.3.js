'use strict';
SL.registra('1.2.3', {
  titolo: 'Memoria a byte e ordine dei byte',
  obiettivo: 'Alla fine saprai disporre un numero di quattro byte su quattro indirizzi consecutivi, nelle due convenzioni in uso, e rileggerlo senza scambiarne i pezzi.',
  concetti: [['byte', 'Byte'], ['memory', 'Celle e indirizzi'], ['hex', 'Esadecimale']],
  filigrana: ['byte', 'memory', 'hex'],
  richiami: {
    carte: [
      { sim: 'byte', da: 'Dall’unità 1.2.1', t: 'Il byte', d: 'Otto bit affiancati formano un byte, che offre 256 combinazioni: i numeri da 0 a 255.' },
      { sim: 'hex', da: 'Dall’unità 1.2.2', t: 'Due cifre esadecimali', d: 'Un byte si scrive con due cifre esadecimali, una per ogni gruppo di quattro bit. Il prefisso 0x avverte che la scrittura è in base sedici.' },
      { sim: 'memory', da: 'Dall’unità 1.1.2', t: 'Celle e indirizzi', d: 'La memoria è una fila di celle numerate. Il numero di una cella è il suo indirizzo, e ogni cella contiene un byte.' }
    ],
    domanda: { d: 'Prima di proseguire: quante cifre esadecimali servono per scrivere un byte?', o: [
      { t: '1', fb: 'Una cifra esadecimale riassume quattro bit. Un byte ne ha otto, quindi servono due cifre.' },
      { t: '2', ok: true, fb: 'Ogni cifra esadecimale riassume quattro bit, e un byte ne ha otto.' },
      { t: '8', fb: 'Otto sono le cifre binarie di un byte. In esadecimale ogni cifra ne riassume quattro, quindi ne bastano due.' }
    ] }
  },
  idea: {
    titolo: 'Un numero grande, quattro celle piccole',
    termini: ['byte più significativo', 'byte meno significativo', 'little-endian', 'big-endian'],
    testo: [
      'Una cella di memoria contiene un byte, quindi un numero compreso fra 0 e 255. I programmi lavorano di continuo con numeri più grandi: il prezzo di una casa, gli abitanti di una città, la posizione di un dato dentro un file enorme. Per rappresentarli si usano più byte insieme. Quattro byte affiancati offrono oltre quattro miliardi di combinazioni.',
      'Prendiamo il numero che in esadecimale si scrive `0x12345678`. Ogni coppia di cifre esadecimali è un byte, quindi il numero è fatto di quattro byte: 12, 34, 56 e 78. Come accade per le cifre di un numero qualsiasi, il byte più a sinistra pesa di più e quello più a destra pesa di meno. Il primo si chiama [[byte più significativo]], l’ultimo [[byte meno significativo]].',
      'I quattro byte devono occupare quattro celle consecutive, e resta una scelta da fare: quale byte va nella cella con l’indirizzo più basso. Sulla carta scriviamo da sinistra a destra senza pensarci. In memoria le direzioni spariscono e restano soltanto indirizzi che crescono.',
      'Le convenzioni in uso sono due. Nella prima, detta [[little-endian]], la cella con l’indirizzo più basso riceve il byte meno significativo: il numero entra in memoria partendo dalla coda. Nella seconda, detta [[big-endian]], la cella con l’indirizzo più basso riceve il byte più significativo, e la memoria ricalca l’ordine della scrittura su carta. I processori dei comuni computer portatili e da tavolo usano la prima convenzione; molti protocolli di rete usano la seconda.',
      { fig: 'celle', titolo: 'Little-endian · 0x12345678 a partire dall’indirizzo 0x100', nota: 'Il byte meno significativo, 78, occupa l’indirizzo più basso.', celle: [
        { so: '0x100', v: '78', st: 'on' }, { so: '0x101', v: '56' }, { so: '0x102', v: '34' }, { so: '0x103', v: '12' }] },
      { fig: 'celle', titolo: 'Big-endian · lo stesso numero, gli stessi indirizzi', nota: 'Il byte più significativo, 12, occupa l’indirizzo più basso.', celle: [
        { so: '0x100', v: '12', st: 'amb' }, { so: '0x101', v: '34' }, { so: '0x102', v: '56' }, { so: '0x103', v: '78' }] },
      'Le due convenzioni si equivalgono. Conta soltanto che chi scrive e chi legge usino la stessa. Se un programma salva un numero con una convenzione e un altro lo rilegge con quella opposta, i byte vengono ricomposti al contrario e il numero letto è un altro.'
    ]
  },
  esperimento: {
    faremo: [
      'Prenderemo un numero di quattro byte e lo scriveremo in memoria, un byte alla volta, a partire dall’indirizzo 0x100. Sceglierai tu la convenzione.',
      'Poi faremo il percorso inverso: leggeremo le quattro celle in ordine di indirizzo e ricomporremo il numero. Per ultimo vedremo che cosa leggerebbe un programma che usasse la convenzione opposta.'
    ],
    vedrai: [
      ['hex', 'Il numero', 'In alto, diviso nei suoi quattro byte, dal più significativo al meno significativo.'],
      ['memory', 'Le quattro celle', 'In basso, con l’indirizzo scritto sopra ciascuna. Gli indirizzi crescono verso destra.'],
      ['input', 'Il byte in viaggio', 'Un riquadro azzurro porta ogni byte dal numero alla sua cella.']
    ]
  },
  lab: {
    titolo: 'Quattro byte, quattro indirizzi',
    scena: { w: 860, h: 330 },
    atti: ['Preparazione', 'Il numero diviso in byte', 'La scrittura in memoria', 'La rilettura'],
    nota: 'I passi sono gli stessi per ogni numero: quattro byte da separare, quattro da scrivere e quattro da rileggere.',
    controlli: [
      { id: 'num', tipo: 'scelta', eti: 'Numero', opzioni: [['12345678', '0x12345678'], ['0000012C', '0x0000012C'], ['CAFE0A0D', '0xCAFE0A0D']], valore: '12345678' },
      { id: 'conv', tipo: 'scelta', eti: 'Convenzione', opzioni: [['little', 'Little-endian'], ['big', 'Big-endian']], valore: 'little' }
    ],
    previsione: {
      domanda: (p) => 'Il numero 0x' + p.num + ' verrà scritto in ' + (p.conv === 'little' ? 'little-endian' : 'big-endian') + ' a partire dall’indirizzo 0x100. Quale byte finirà nella cella 0x100?',
      opzioni: (p) => Array.from(new Set(p.num.match(/../g)))
    },
    confronto: (pred, esito, p) => 'Avevi previsto il byte ' + pred + ' nella cella 0x100. Il byte scritto lì è ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'In ' + (p.conv === 'little' ? 'little-endian l’indirizzo più basso riceve il byte meno significativo, cioè l’ultimo della scrittura su carta.' : 'big-endian l’indirizzo più basso riceve il byte più significativo, cioè il primo della scrittura su carta.')),
    costruisci(p) {
      const B = p.num.match(/../g), little = p.conv === 'little', el = SL.el, passi = [];
      const ordine = little ? [3, 2, 1, 0] : [0, 1, 2, 3];          // quale byte del numero va nella cella k
      const nomi = ['più significativo', '', '', 'meno significativo'];
      const visti = [false, false, false, false], celle = [null, null, null, null], letti = [false, false, false, false];
      const X = (k) => 150 + k * 150, ind = (k) => '0x10' + k;
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('t1', 150, 0, 'IL NUMERO 0x' + p.num, 'mono'), el.nota('t2', 150, 196, 'LA MEMORIA · indirizzi crescenti verso destra', 'mono')];
        B.forEach((b, j) => els.push(el.cella('n' + j, X(j), 46, 110, 70, visti[j] ? b : '· ·', o.byte === j ? 'att' : visti[j] ? '' : 'zero', { so: nomi[j] })));
        for (let k = 0; k < 4; k++) els.push(el.cella('m' + k, X(k), 242, 110, 70, celle[k] === null ? '· ·' : celle[k], o.cella === k ? 'att' : letti[k] ? 'on' : celle[k] === null ? '' : 'zero', { so: ind(k) }));
        if (o.pacco) els.push(el.pacco('pk', o.pacco[0], o.pacco[1], o.pacco[2]));
        return els;
      };
      const hud = (a, b) => [['Convenzione', little ? 'little-endian' : 'big-endian'], ['Indirizzo', a == null ? '·' : a, 'a'], ['Byte', b == null ? '·' : b, 'c']];
      passi.push({ atto: 0, titolo: 'Un numero e quattro celle vuote', calc: '0x' + p.num, hud: hud(), els: quadro(),
        testo: 'In alto c’è il numero da conservare, in basso quattro celle consecutive a partire dall’indirizzo 0x100. La convenzione scelta è ' + (little ? 'little-endian' : 'big-endian') + '.' });
      B.forEach((b, j) => {
        visti[j] = true;
        passi.push({ atto: 1, titolo: 'Il byte ' + b, calc: p.num.slice(0, j * 2) + '[' + b + ']' + p.num.slice(j * 2 + 2), hud: hud(null, b), els: quadro({ byte: j }),
          testo: 'Separiamo la ' + ['prima', 'seconda', 'terza', 'quarta'][j] + ' coppia di cifre esadecimali: è il byte ' + b + '.' + (j === 0 ? ' Trovandosi più a sinistra, è il byte più significativo.' : j === 3 ? ' Trovandosi più a destra, è il byte meno significativo.' : '') });
      });
      const unici = Array.from(new Set(B));
      for (let k = 0; k < 4; k++) {
        const j = ordine[k], b = B[j];
        passi.push({ atto: 2, titolo: 'La cella ' + ind(k) + ' attende un byte', calc: ind(k) + ' ← ?', hud: hud(ind(k), null), els: quadro({ cella: k }),
          testo: 'Tocca alla cella ' + ind(k) + (k === 0 ? ', quella con l’indirizzo più basso.' : '.') + ' In ' + (little ? 'little-endian si procede dal byte meno significativo verso il più significativo.' : 'big-endian si procede dal byte più significativo verso il meno significativo.'),
          chiedi: { d: 'Quale byte va nella cella ' + ind(k) + '?', o: unici, g: unici.indexOf(b),
            no: 'Conta le celle già scritte e ricorda il verso: in ' + (little ? 'little-endian si parte dall’ultima coppia di cifre e si risale.' : 'big-endian si parte dalla prima coppia di cifre e si prosegue.') } });
        passi.push({ atto: 2, titolo: 'Il byte ' + b + ' parte', calc: ind(k) + ' ← ' + b, hud: hud(ind(k), b), els: quadro({ cella: k, byte: j, pacco: [X(j) + 30, 126, b] }),
          testo: 'Il byte ' + b + ' lascia il numero e si dirige verso la cella ' + ind(k) + '.' });
        celle[k] = b;
        passi.push({ atto: 2, titolo: 'Scritto in ' + ind(k), calc: ind(k) + ' = ' + b, hud: hud(ind(k), b), els: quadro({ cella: k, pacco: [X(k) + 30, 206, b] }),
          testo: 'La cella ' + ind(k) + ' ora contiene ' + b + '.' });
      }
      const inMem = celle.slice();
      for (let k = 0; k < 4; k++) {
        letti[k] = true;
        passi.push({ atto: 3, titolo: 'Rilettura di ' + ind(k), calc: inMem.slice(0, k + 1).join(' '), hud: hud(ind(k), inMem[k]), els: quadro({ cella: k }),
          testo: 'Leggiamo le celle in ordine di indirizzo. In ' + ind(k) + ' troviamo ' + inMem[k] + '.' });
      }
      passi.push({ atto: 3, titolo: 'Il numero ricomposto', calc: inMem.join(' ') + ' → 0x' + p.num, esito: ['STESSA CONVENZIONE', 'si'], hud: hud(), els: quadro(),
        testo: 'Chi rilegge con la stessa convenzione ' + (little ? 'rimette i byte in ordine partendo dall’ultimo letto' : 'accosta i byte nell’ordine in cui li ha letti') + ' e ritrova il numero di partenza, 0x' + p.num + '.' });
      const altro = little ? inMem.join('') : inMem.slice().reverse().join('');
      passi.push({ atto: 3, titolo: 'Con la convenzione opposta', calc: inMem.join(' ') + ' → 0x' + altro, esito: altro === p.num ? ['UGUALE PER CASO', ''] : ['NUMERO DIVERSO', 'no'], hud: hud(), els: quadro(),
        testo: 'Un programma che leggesse le stesse quattro celle in ' + (little ? 'big-endian' : 'little-endian') + ' ricomporrebbe 0x' + altro + '. I byte in memoria sono identici: cambia soltanto l’ordine in cui vengono rimessi insieme.' });
      return { passi, esito: inMem[0] };
    }
  },
  bilancio: {
    regola: [
      'Un numero di più byte occupa celle consecutive. In little-endian l’indirizzo più basso contiene il byte meno significativo; in big-endian contiene il byte più significativo.',
      'Per rileggere il numero bisogna conoscere la convenzione con cui è stato scritto. I byte in memoria restano gli stessi in entrambi i casi, e l’ordine in cui vengono ricomposti dipende dalla convenzione scelta.'
    ],
    errori: [
      ['Rovesciare anche le cifre.', 'L’ordine riguarda i byte interi. Dentro ogni byte le due cifre esadecimali restano come sono: 78 non diventa 87.'],
      ['Pensare che cambino i bit.', 'Il contenuto di ciascun byte è identico nelle due convenzioni.'],
      ['Dimenticare la convenzione.', 'Quattro byte letti senza sapere come sono stati scritti possono indicare due numeri diversi.']
    ],
    saFare: ['Divido un numero esadecimale nei suoi byte.', 'Dispongo i byte in memoria in little-endian e in big-endian.', 'Ricompongo un numero leggendo le celle in ordine di indirizzo.'],
    esercizi: [
      { d: 'Il numero 0x0A0B0C0D viene scritto in little-endian a partire dall’indirizzo 0x200. Quale byte si trova all’indirizzo 0x201?', segnaposto: 'Due cifre', eti: 'Il byte, in esadecimale', giuste: ['0c', '0x0c', 'c'],
        ok: 'In little-endian le celle da 0x200 a 0x203 contengono 0D, 0C, 0B e 0A. In 0x201 c’è 0C.',
        diagnosi: [
          { se: ['0b', '0x0b', 'b'], msg: 'Hai disposto i byte in big-endian, nell’ordine della scrittura su carta. In little-endian si parte dal byte meno significativo.' },
          { se: ['0d', '0x0d', 'd'], msg: '0D è il byte meno significativo e occupa l’indirizzo 0x200. La domanda riguarda la cella successiva.' },
          { se: ['0a', '0x0a', 'a'], msg: '0A è il byte più significativo: in little-endian finisce nell’ultima cella, 0x203.' },
          { se: ['c0', '0xc0'], msg: 'Hai rovesciato le cifre dentro il byte. L’ordine riguarda i byte interi: 0C resta 0C.' }
        ],
        altro: 'Il byte è diverso. Dividi il numero in 0A, 0B, 0C e 0D, poi riempi le celle da 0x200 partendo dall’ultimo.',
        indizi: ['I quattro byte del numero sono 0A, 0B, 0C e 0D.', 'In little-endian la cella 0x200 riceve il byte meno significativo, 0D.', 'La cella 0x201 riceve il byte che su carta precede 0D.'],
        svolgimento: ['Il numero si divide in 0A, 0B, 0C, 0D.', 'In little-endian: 0x200 contiene 0D, 0x201 contiene 0C, 0x202 contiene 0B, 0x203 contiene 0A.', 'All’indirizzo 0x201 si trova 0C.'] },
      { d: 'A partire dall’indirizzo più basso, quattro celle contengono i byte 2C 01 00 00. La convenzione è little-endian. Quanto vale il numero in base dieci?', segnaposto: 'Un numero', giuste: ['300'],
        ok: 'In little-endian il numero è 0x0000012C. In base dieci vale 1 × 256 + 44 = 300.',
        diagnosi: [
          { se: ['738263040'], msg: 'Hai letto i byte nell’ordine big-endian, come 0x2C010000. In little-endian il primo byte incontrato è il meno significativo.' },
          { se: ['12c', '0x12c', '0000012c', '0x0000012c'], msg: 'La ricomposizione in esadecimale è corretta. La domanda chiede il valore in base dieci: 1 × 256 più il valore di 2C.' },
          { se: ['45'], msg: 'Hai sommato i due byte come se pesassero allo stesso modo. Il secondo byte pesa 256 volte il primo.' },
          { se: ['44'], msg: 'Quarantaquattro è il valore del solo byte 2C. Il byte 01, nella cella successiva, pesa 256.' }
        ],
        altro: 'Il valore è diverso. Rimetti i byte nell’ordine della scrittura su carta, partendo dall’ultimo letto, e poi converti.',
        indizi: ['In little-endian l’ultimo byte letto è il più significativo: il numero è 0x0000012C.', 'Il byte 2C vale 2 × 16 + 12 = 44.', 'Il byte 01 occupa la posizione che pesa 256.'],
        svolgimento: ['Si rovescia l’ordine dei byte: 00 00 01 2C, cioè 0x0000012C.', '2C vale 44 e pesa 1; 01 vale 1 e pesa 256.', 'Il numero è 256 + 44 = 300.'] }
    ],
    sfida: ['lez02_04_hex_to_dec', 'Dall’esadecimale al decimale']
  }
});
