'use strict';
SL.registra('1.3.1', {
  titolo: 'La codifica come accordo tra significato e byte',
  obiettivo: 'Obiettivo: descrivere la rappresentazione di un’immagine come fila di byte e individuare, all’interno della fila, il byte che descrive una componente di colore di un pixel.',
  concetti: [['pixel', 'Pixel'], ['byte', 'Byte'], ['puntatore', 'Spostamento']],
  filigrana: ['pixel', 'byte', 'memory'],
  richiami: {
    carte: [
      { sim: 'char', da: 'Dall’unità 1.2.4', t: 'La codifica', d: 'Un byte riceve il proprio significato da un accordo stabilito all’esterno. Per i testi l’accordo è una tabella di caratteri.' },
      { sim: 'byte', da: 'Dall’unità 1.2.1', t: 'Il byte', d: 'Otto bit affiancati offrono 256 combinazioni, cioè i numeri da 0 a 255.' },
      { sim: 'puntatore', da: 'Dall’unità 1.1.2', t: 'Lo spostamento', d: 'Distanza di una cella dalla prima della fila. La prima cella ha spostamento zero.' }
    ],
    domanda: { d: 'Prima di proseguire: qual è il massimo numero che un byte può contenere?', o: [
      { t: '256', fb: 'Le combinazioni sono 256 e la prima è lo zero. Il massimo è quindi 255.' },
      { t: '255', ok: true, fb: 'Le 256 combinazioni rappresentano i numeri da 0 a 255.' },
      { t: '128', fb: 'Il numero 128 è il peso del bit più a sinistra. Con tutti i bit a 1 si raggiunge 255.' }
    ] }
  },
  idea: {
    titolo: 'L’immagine come fila di byte',
    termini: ['pixel', 'canale'],
    testo: [
      'L’unità 1.2.4 ha mostrato che il significato di un byte deriva da una codifica, cioè da un accordo fra chi scrive e chi legge. Per i testi l’accordo è una tabella di caratteri. Per un’immagine occorre un accordo diverso, che questa unità costruisce per gradi.',
      'Osservato a distanza ravvicinata, uno schermo risulta composto da una griglia di piccoli elementi colorati, ciascuno dei quali prende il nome di [[pixel]]. Un’immagine digitale è l’elenco dei colori dei propri pixel. La parte restante dell’accordo stabilisce due aspetti: la scrittura di un colore e l’ordine in cui i pixel sono elencati.',
      'Uno schermo ottiene ogni colore combinando tre luci, una rossa, una verde e una blu. La descrizione di un colore si riduce pertanto all’intensità di ciascuna delle tre. Ogni intensità prende il nome di [[canale]] e nel formato più diffuso occupa un byte: 0 indica luce spenta, 255 luce alla massima intensità. Un pixel occupa quindi tre byte, nell’ordine rosso, verde, blu. Il pixel di valori 255, 0, 0 è rosso pieno; con 255, 255, 0 è giallo; con 0, 0, 0 è nero.',
      { fig: 'celle', titolo: 'Due pixel, sei byte', nota: 'Il primo pixel è rosso, il secondo è giallo. Ogni pixel occupa tre byte consecutivi.', celle: [
        { so: 'rosso', v: '255', st: 'amb', gi: 'byte 0' }, { so: 'verde', v: '0', st: 'amb', gi: 'byte 1' }, { so: 'blu', v: '0', st: 'amb', gi: 'byte 2' },
        { so: 'rosso', v: '255', st: 'on', gi: 'byte 3' }, { so: 'verde', v: '255', st: 'on', gi: 'byte 4' }, { so: 'blu', v: '0', st: 'on', gi: 'byte 5' }] },
      'Resta da stabilire l’ordine dei pixel. La convenzione più comune li elenca secondo l’ordine di lettura di un testo: la prima riga da sinistra a destra, quindi la seconda, e così di seguito. Le righe si numerano dall’alto a partire da zero, le colonne da sinistra a partire da zero. In memoria la struttura a griglia viene meno, e resta un’unica fila di byte.',
      'Per individuare un canale di un dato pixel si contano i pixel che lo precedono nella fila. Vengono dapprima le righe intere soprastanti, ciascuna lunga quanto la larghezza dell’immagine; seguono i pixel alla sua sinistra, nella stessa riga. Il numero dei pixel precedenti, moltiplicato per tre, fornisce lo spostamento del primo byte del pixel. Il canale aggiunge 0 per il rosso, 1 per il verde, 2 per il blu.',
      'La lettura dei byte richiede la conoscenza della larghezza dell’immagine, dell’ordine dei canali e del punto di partenza. Se uno di questi elementi è interpretato in modo errato, i byte restano invariati e l’immagine ricostruita risulta diversa: i colori si scambiano, oppure le righe si interrompono nel punto sbagliato.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento considera un’immagine di dimensioni minime, larga quattro pixel e alta tre. In memoria essa occupa 36 byte, tre per ciascuno dei dodici pixel. Scelti un pixel e un canale, si cerca il byte che lo contiene.',
      'La fila è percorsa un pixel alla volta, nell’ordine di lettura di un testo: dapprima le righe intere soprastanti, poi i pixel a sinistra nella riga scelta. Al termine il numero dei pixel precedenti è convertito in un numero di byte.'
    ],
    vedrai: [
      ['pixel', 'La griglia', 'In alto a sinistra. Rappresenta l’immagine nella forma visibile, con righe e colonne numerate da zero.'],
      ['memory', 'La fila in memoria', 'In basso. I medesimi dodici pixel, in successione. Sopra ciascuno è indicato lo spostamento del relativo primo byte.'],
      ['lente', 'I tre byte del pixel', 'In alto a destra, una volta individuato il pixel. Riportano i valori di rosso, verde e blu.']
    ]
  },
  lab: {
    titolo: 'Individuazione di un byte in un’immagine',
    scena: { w: 860, h: 352 },
    atti: ['L’immagine e la fila', 'Le righe soprastanti', 'I pixel a sinistra', 'Dal pixel al byte'],
    nota: 'Il numero di passi dipende dal pixel scelto: la fila viene percorsa un pixel alla volta, fino a quello cercato.',
    controlli: [
      { id: 'x', tipo: 'num', eti: 'Colonna', min: 0, max: 3, salti: [1], valore: 2 },
      { id: 'y', tipo: 'num', eti: 'Riga', min: 0, max: 2, salti: [1], valore: 1 },
      { id: 'c', tipo: 'scelta', eti: 'Canale', opzioni: [[0, 'Rosso'], [1, 'Verde'], [2, 'Blu']], valore: 1 }
    ],
    previsione: {
      domanda: (p) => 'L’immagine è larga 4 pixel. A quale spostamento si trova il byte del canale ' + ['rosso', 'verde', 'blu'][p.c] + ' del pixel in colonna ' + p.x + ', riga ' + p.y + '?',
      opzioni: (p) => { const i = p.y * 4 + p.x, s = new Set([3 * i + p.c, i, 3 * i, 3 * (p.x * 4 + p.y) + p.c, i + p.c, 3 * (p.y * 3 + p.x) + p.c]); for (let k = 1; s.size < 4; k++) s.add(3 * i + p.c + 3 * k); return Array.from(s).sort((a, b) => a - b); }
    },
    confronto: (pred, esito, p) => { const i = p.y * 4 + p.x; return 'La previsione indicava lo spostamento ' + pred + '. Il byte si trova allo spostamento ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === i ? 'Il valore indicato è il numero dei pixel precedenti. Ogni pixel occupa tre byte.' : pred === 3 * i && p.c ? 'Il valore indicato corrisponde al primo byte del pixel, cioè al rosso. Il canale scelto si trova più avanti.' : 'Va riesaminato il conteggio dei pixel precedenti: ogni riga intera ne comprende 4, ai quali si aggiungono quelli a sinistra.'); },
    costruisci(p) {
      const el = SL.el, passi = [];
      const TINTE = ['rosso', 'giallo', 'verde', 'nero', 'blu', 'bianco', 'rosso', 'verde', 'giallo', 'nero', 'blu', 'bianco'];
      const RGB = { rosso: [255, 0, 0], giallo: [255, 255, 0], verde: [0, 255, 0], nero: [0, 0, 0], blu: [0, 0, 255], bianco: [255, 255, 255] };
      const CAN = ['rosso', 'verde', 'blu'];
      const idx = p.y * 4 + p.x, off = 3 * idx + p.c, val = RGB[TINTE[idx]];
      let contati = 0;
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('t1', 40, 0, 'L’IMMAGINE · 4 × 3 PIXEL', 'mono'), el.nota('t2', 40, 250, 'LA FILA IN MEMORIA · 12 PIXEL, 36 BYTE', 'mono')];
        for (let k = 0; k < 12; k++) {
          const r = Math.floor(k / 4), c = k % 4;
          const st = o.riga === r || o.pixel === k ? 'att' : k < contati ? 'on' : (o.trovato && k === idx ? 'att' : '');
          els.push(el.cella('g' + k, 96 + c * 60, 50 + r * 60, 54, 54, '', st, { cls: 'tinta-' + TINTE[k], so: r === 0 ? 'col ' + c : null }));
          els.push(el.cella('s' + k, 40 + k * 65, 300, 59, 40, 'p' + k, st, { cls: 'minuta', so: 'byte ' + 3 * k }));
        }
        for (let r = 0; r < 3; r++) els.push(el.nota('r' + r, 40, 66 + r * 60, 'riga ' + r, 'mono', o.riga === r ? 'att' : ''));
        if (o.zoom) {
          els.push(el.nota('t3', 420, 0, 'I TRE BYTE DEL PIXEL p' + idx, 'mono'));
          val.forEach((v, j) => els.push(el.cella('z' + j, 420 + j * 130, 56, 110, 70, String(v), o.scelto && j === p.c ? 'att' : 'on', { so: 'byte ' + (3 * idx + j), gi: CAN[j] })));
        }
        return els;
      };
      const hud = () => [['Pixel precedenti', contati, 'a'], ['Pixel cercato', 'col ' + p.x + ', riga ' + p.y], ['Canale', CAN[p.c], 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'La griglia e la fila', 'L’immagine ha tre righe di quattro pixel. In memoria i dodici pixel sono disposti in un’unica fila, una riga dopo l’altra: p0 è il pixel in alto a sinistra, p11 quello in basso a destra. Si cerca il pixel in colonna ' + p.x + ', riga ' + p.y + '.');
      if (p.y === 0) P({ riga: 0 }, 1, 'Nessuna riga soprastante', 'Il pixel cercato si trova nella riga 0, la prima. Poiché nessuna riga intera lo sovrasta, il conteggio dei pixel precedenti resta a zero.', { calc: 'righe sopra: 0 → pixel precedenti: 0' });
      for (let r = 0; r < p.y; r++) for (let c = 0; c < 4; c++) {
        const k = r * 4 + c; const q = quadro({ pixel: k }); contati += 1;
        passi.push({ atto: 1, titolo: 'Si oltrepassa il pixel p' + k, testo: 'Il pixel p' + k + ' si trova nella riga ' + r + ', soprastante a quella cercata, e nella fila precede il pixel cercato.' + (c === 3 ? ' Con esso la riga ' + r + ' è completa: comprende 4 pixel, quanti ne indica la larghezza dell’immagine.' : ''), calc: c === 3 ? 'riga ' + r + ' completa · pixel precedenti: ' + contati : 'pixel precedenti: ' + (contati - 1) + ' + 1 = ' + contati, hud: hud(), els: q });
      }
      if (p.x === 0) P({ riga: p.y }, 2, 'Nessun pixel a sinistra', 'Nella riga ' + p.y + ' il pixel cercato è il primo, in colonna 0. Alla sua sinistra nessun pixel è da contare.', { calc: 'pixel precedenti: ' + contati });
      for (let c = 0; c < p.x; c++) {
        const k = p.y * 4 + c; const q = quadro({ pixel: k }); contati += 1;
        passi.push({ atto: 2, titolo: 'Si oltrepassa il pixel p' + k, testo: 'Nella riga ' + p.y + ' il pixel in colonna ' + c + ' precede quello cercato. I pixel precedenti salgono a ' + contati + '.', calc: 'pixel precedenti: ' + (contati - 1) + ' + 1 = ' + contati, hud: hud(), els: q });
      }
      P({ trovato: true }, 3, 'Il pixel cercato è p' + idx, 'Sono stati oltrepassati ' + contati + ' pixel, e il pixel cercato è pertanto il numero ' + idx + ' della fila. Il medesimo numero si ottiene con un solo calcolo: riga per larghezza, più colonna.',
        Object.assign({ calc: p.y + ' × 4 + ' + p.x + ' = ' + idx }, idx > 0 ? { chiedi: { d: 'I pixel precedenti sono ' + idx + '. Quanti byte occupano complessivamente?', o: [String(idx), String(2 * idx), String(3 * idx)], g: 2, no: 'Ogni pixel occupa tre byte, uno per ciascun canale. I byte precedenti sono ' + idx + ' × 3.' } } : {}));
      P({ trovato: true, zoom: true }, 3, 'Il primo byte del pixel', 'Ogni pixel precedente occupa tre byte. Il primo byte del pixel p' + idx + ' si trova quindi allo spostamento ' + 3 * idx + ', e i suoi tre canali occupano gli spostamenti ' + 3 * idx + ', ' + (3 * idx + 1) + ' e ' + (3 * idx + 2) + '.',
        { calc: idx + ' × 3 = ' + 3 * idx, chiedi: { d: 'I canali sono scritti nell’ordine rosso, verde, blu. Quanti byte occorre aggiungere per raggiungere il ' + CAN[p.c] + '?', o: ['0', '1', '2'], g: p.c, no: 'Il rosso è il primo dei tre e aggiunge 0, il verde aggiunge 1, il blu aggiunge 2.' } });
      P({ trovato: true, zoom: true, scelto: true }, 3, 'Il byte del canale ' + CAN[p.c], 'Il canale ' + CAN[p.c] + ' è il ' + ['primo', 'secondo', 'terzo'][p.c] + ' dei tre e aggiunge ' + p.c + '. Il byte cercato si trova allo spostamento ' + off + ' e contiene ' + val[p.c] + '. Il pixel è ' + TINTE[idx] + ': rosso ' + val[0] + ', verde ' + val[1] + ', blu ' + val[2] + '.',
        { calc: '3 × (' + p.y + ' × 4 + ' + p.x + ') + ' + p.c + ' = ' + off });
      return { passi, esito: off };
    }
  },
  bilancio: {
    regola: [
      'Un’immagine è l’elenco dei colori dei propri pixel, scritti una riga dopo l’altra. Nel formato a tre canali ogni pixel occupa tre byte: rosso, verde, blu.',
      'Lo spostamento di un canale è 3 × (riga × larghezza + colonna), più 0, 1 o 2 secondo il canale. Righe e colonne si contano da zero.'
    ],
    errori: [
      ['Arrestarsi al numero del pixel.', 'Il numero del pixel indica quanti pixel lo precedono. Per ottenere i byte va moltiplicato per tre.'],
      ['Scambiare riga e colonna.', 'Per la larghezza va moltiplicata la riga, poiché ogni riga soprastante comprende una larghezza intera di pixel.'],
      ['Contare da uno.', 'La prima riga è la riga 0 e la prima colonna è la colonna 0, così come il primo byte ha spostamento 0.']
    ],
    saFare: ['Definire un pixel e un canale.', 'Calcolare lo spostamento di un canale date riga, colonna e larghezza.', 'Indicare gli elementi dell’accordo necessari alla rilettura di un’immagine.'],
    esercizi: [
      { d: 'Un’immagine a tre canali è larga 10 pixel. A quale spostamento comincia il pixel in colonna 4, riga 2?', segnaposto: 'Uno spostamento', giuste: ['72'],
        ok: 'I pixel precedenti sono 2 × 10 + 4 = 24, e 24 × 3 = 72.',
        diagnosi: [
          { se: ['24'], msg: 'Il valore indicato è il numero dei pixel precedenti. Ogni pixel occupa tre byte.' },
          { se: ['126'], msg: 'È stata moltiplicata la colonna per la larghezza. Va moltiplicata la riga: 2 × 10 + 4.' },
          { se: ['75'], msg: 'Righe e colonne sono state contate a partire da uno. La riga 2 è sovrastata da due righe intere, e la colonna 4 ha quattro pixel alla propria sinistra.' }
        ],
        altro: 'Lo spostamento è diverso. Si contino dapprima i pixel precedenti, e li si converta poi in byte.',
        indizi: ['Sopra la riga 2 si trovano due righe intere.', 'I pixel precedenti sono 2 × 10 + 4.', 'Ogni pixel precedente occupa tre byte.'],
        svolgimento: ['Righe intere sopra: 2, per 10 pixel ciascuna, cioè 20 pixel.', 'Pixel a sinistra nella riga: 4. In totale 24 pixel precedenti.', 'Spostamento: 24 × 3 = 72.'] },
      { d: 'Un programma legge un’immagine assumendo che i canali siano nell’ordine blu, verde, rosso, mentre sono scritti nell’ordine rosso, verde, blu. Come appare un pixel rosso pieno?', guida: 'Si scelga la risposta.', o: [
        { t: 'Rosso', fb: 'Il primo byte vale 255 e il programma lo interpreta come blu. Il colore cambia.' },
        { t: 'Blu', ok: true, fb: 'Il valore 255 si trova nel primo byte, che il programma interpreta come blu. I byte sono i medesimi, mentre l’interpretazione è diversa.' },
        { t: 'Nero', fb: 'Un byte vale 255, e una delle tre luci è quindi alla massima intensità.' }] }
    ],
    sfida: ['lez03_04_rgb_image_size', 'Immagini RGB e indirizzi dei pixel']
  }
});
