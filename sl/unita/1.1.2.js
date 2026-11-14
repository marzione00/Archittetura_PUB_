'use strict';
SL.registra('1.1.2', {
  titolo: 'La macchina fisica sotto le astrazioni',
  obiettivo: 'Obiettivo: spiegare come il processore individua un dato in memoria, e distinguere l’indirizzo di una cella dal suo contenuto.',
  concetti: [['memory', 'Cella'], ['puntatore', 'Indirizzo'], ['register', 'Registro']],
  filigrana: ['memory', 'puntatore', 'register'],
  richiami: {
    carte: [
      { sim: 'memory', da: 'Dall’unità 0.1', t: 'Memoria e processore', d: 'La memoria conserva i dati. Il processore li legge, li elabora e vi deposita i risultati.' },
      { sim: 'char', da: 'Dall’unità 1.1.1', t: 'I codici', d: 'Ogni carattere è conservato come numero: la lettera h ha codice 104, la lettera e ha codice 101.' }
    ],
    domanda: { d: 'Prima di proseguire: in quale forma il calcolatore conserva la lettera e?', o: [
      { t: 'Come disegno della lettera', fb: 'Il disegno è prodotto dallo schermo al momento della presentazione. In memoria è conservato un numero.' },
      { t: 'Come numero: il suo codice 101', ok: true, fb: 'In memoria ogni carattere è un numero, stabilito dalla tabella dei codici.' },
      { t: 'Come parola «e»', fb: 'La memoria conserva soltanto numeri. Alla lettera e corrisponde il codice 101.' }
    ] }
  },
  idea: {
    titolo: 'Celle, indirizzi e registri',
    termini: ['cella', 'indirizzo', 'registro', 'spostamento'],
    testo: [
      'L’unità 0.1 ha descritto la memoria come un insieme ordinato di caselle. Tali caselle prendono il nome di [[cella|celle]]: hanno tutte la stessa capacità e sono disposte in successione. Ogni cella contiene un numero di grandezza limitata, sufficiente per un codice come quelli della parola hello.',
      'Poiché le celle sono indistinguibili l’una dall’altra, l’accesso a un dato richiede un criterio univoco di identificazione. A ciascuna cella è associato un numero progressivo, a partire da zero, denominato [[indirizzo]]. L’indirizzo è una proprietà della cella e resta invariato nel tempo, qualunque sia il dato che essa contiene.',
      'A ogni cella sono dunque associati due numeri, che vanno tenuti distinti: l’indirizzo, che ne indica la collocazione, e il contenuto, che è il dato conservato. La cella di indirizzo 1001 può contenere 101 e, dopo una scrittura, contenere 7. L’indirizzo resta invariato, mentre il contenuto cambia.',
      { fig: 'celle', titolo: 'La parola hello in memoria, a partire dall’indirizzo 1000', nota: 'Sopra ogni cella è riportato l’indirizzo, all’interno il contenuto.', celle: [
        { so: '1000', v: '104' }, { so: '1001', v: '101', st: 'on' }, { so: '1002', v: '108' }, { so: '1003', v: '108' }, { so: '1004', v: '111' }] },
      'I dati risiedono in memoria, all’esterno del processore. Per ottenerne uno, il processore invia alla memoria l’indirizzo della cella, e la memoria restituisce una copia del contenuto. Il dato ricevuto è depositato in un [[registro]], una sede interna al processore nella quale un dato è trattenuto per la durata di un’operazione. I registri sono in numero ridotto e di accesso rapido; le celle di memoria sono molto più numerose, e il loro accesso richiede un tempo maggiore.',
      'Quando i dati occupano celle consecutive, al processore è sufficiente conoscere l’indirizzo della prima, detto base, e la distanza dalla base, detta [[spostamento]]. La parola hello comincia all’indirizzo 1000: la seconda lettera si trova pertanto a spostamento 1, cioè all’indirizzo 1000 + 1. La prima lettera ha spostamento zero, poiché coincide con la base.'
    ]
  },
  esperimento: {
    faremo: [
      'La parola hello è in memoria a partire dall’indirizzo 1000. L’esperimento fa leggere al processore una o più lettere consecutive, a partire da uno spostamento selezionabile.',
      'La lettura di ogni cella comprende cinque passi: il calcolo dell’indirizzo, l’invio dell’indirizzo alla memoria, la selezione della cella, la restituzione del contenuto e il deposito nel registro.'
    ],
    vedrai: [
      ['memory', 'Le cinque celle', 'In alto, con l’indirizzo riportato sopra e il contenuto all’interno.'],
      ['cpu', 'Il processore', 'In basso a sinistra: calcola l’indirizzo e lo invia.'],
      ['register', 'Il registro', 'In basso al centro. Riceve la copia del contenuto letto.']
    ]
  },
  lab: {
    titolo: 'Lettura di una parola, una cella alla volta',
    scena: { w: 860, h: 320 },
    atti: ['Preparazione', 'Le letture', 'Bilancio'],
    nota: 'Il numero dei passi dipende dal numero di celle lette: cinque passi per ciascuna.',
    controlli: [
      { id: 's', tipo: 'num', eti: 'Spostamento iniziale', min: 0, max: 4, salti: [1], valore: 1 },
      { id: 'q', tipo: 'num', eti: 'Celle da leggere', min: 1, max: 3, salti: [1], valore: 2 }
    ],
    previsione: {
      domanda: (p) => { const q = Math.min(p.q, 5 - p.s); return 'Il processore legge ' + q + (q === 1 ? ' cella' : ' celle consecutive') + ' a partire dallo spostamento ' + p.s + '. Quale numero contiene il registro al termine?'; },
      opzioni: (p) => { const q = Math.min(p.q, 5 - p.s), ult = p.s + q - 1; return Array.from(new Set([101, 104, 108, 111, 1000 + ult, ult])).sort((a, b) => a - b); }
    },
    confronto: (pred, esito) => 'La previsione indicava ' + pred + ' nel registro. Il registro contiene ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : (pred >= 1000 ? 'Il valore scelto è l’indirizzo dell’ultima cella. Nel registro giunge il contenuto.' : pred < 10 ? 'Il valore scelto è lo spostamento. Nel registro giunge il contenuto della cella.' : 'Occorre ricalcolare l’indirizzo dell’ultima cella letta, e considerarne il contenuto.')),
    costruisci(p) {
      const el = SL.el, passi = [], COD = [104, 101, 108, 108, 111], LET = ['h', 'e', 'l', 'l', 'o'];
      const q = Math.min(p.q, 5 - p.s);
      let reg = null;
      const X = (k) => 300 + k * 108;
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('tm', 300, 0, 'MEMORIA · la parola hello dalla base 1000', 'mono'),
          el.linea('li', 250, 210, 300, 130, o.via === 'ind' ? 'att' : ''), el.linea('ld', 560, 130, 520, 210, o.via === 'dato' ? 'on' : ''),
          el.box('cpu', 30, 190, 220, 110, 'processore', o.cpu || 'in attesa', o.att === 'cpu' ? 'att' : '', { sim: 'cpu' }),
          el.cella('reg', 440, 220, 160, 70, reg === null ? '·' : String(reg), o.att === 'reg' ? 'on' : reg === null ? '' : 'zero', { so: 'registro' })];
        COD.forEach((v, k) => els.push(el.cella('m' + k, X(k), 46, 96, 70, String(v), o.cella === k ? 'att' : 'zero', { so: String(1000 + k), gi: '«' + LET[k] + '»' })));
        if (o.pacco) els.push(el.pacco('pk', o.pacco[0], o.pacco[1], o.pacco[2], o.pacco[3]));
        return els;
      };
      const hud = (sp, ind) => [['Base', 1000], ['Spostamento', sp == null ? '·' : sp, 'a'], ['Indirizzo', ind == null ? '·' : ind, 'a'], ['Registro', reg === null ? '·' : reg, 'c']];
      passi.push({ atto: 0, titolo: 'La parola è in memoria', hud: hud(), els: quadro(),
        testo: 'Le cinque lettere di hello occupano cinque celle consecutive, dalla 1000 alla 1004. Il registro del processore è vuoto.' });
      for (let j = 0; j < q; j++) {
        const sp = p.s + j, ind = 1000 + sp, v = COD[sp];
        const opz = Array.from(new Set([ind, ind + 1, sp])).sort((a, b) => a - b);
        passi.push({ atto: 1, titolo: 'Calcolo dell’indirizzo', calc: '1000 + ' + sp + ' = ' + ind, hud: hud(sp, ind), els: quadro({ att: 'cpu', cpu: '1000 + ' + sp }),
          testo: 'Il processore conosce la base, 1000, e lo spostamento, ' + sp + '. La loro somma è l’indirizzo della cella da leggere.',
          chiedi: { d: 'Qual è l’indirizzo della cella a spostamento ' + sp + '?', o: opz.map(String), g: opz.indexOf(ind), no: 'L’indirizzo è la base più lo spostamento, e la prima cella ha spostamento zero: 1000 + ' + sp + '.' } });
        passi.push({ atto: 1, titolo: 'Invio dell’indirizzo alla memoria', hud: hud(sp, ind), els: quadro({ att: 'cpu', cpu: 'invio ' + ind, via: 'ind', pacco: [246, 150, String(ind), 'att'] }),
          testo: 'Il processore invia alla memoria il numero ' + ind + '. In questo passo transita un indirizzo, cioè l’indicazione di una collocazione.' });
        passi.push({ atto: 1, titolo: 'Selezione della cella', hud: hud(sp, ind), els: quadro({ cella: sp, via: 'ind', pacco: [X(sp) + 18, 14, String(ind), 'att'] }),
          testo: 'La memoria individua la cella di indirizzo ' + ind + '. La cella contiene il valore ' + v + ', il codice della lettera «' + LET[sp] + '».' });
        passi.push({ atto: 1, titolo: 'Restituzione del contenuto', hud: hud(sp, ind), els: quadro({ cella: sp, via: 'dato', pacco: [520, 160, String(v)] }),
          testo: 'La memoria invia al processore una copia del contenuto. La cella ' + ind + ' continua a contenere ' + v + '.' });
        reg = v;
        passi.push({ atto: 1, titolo: 'Il registro riceve ' + v, calc: 'registro = ' + v, hud: hud(sp, ind), els: quadro({ att: 'reg', cella: sp }),
          testo: 'Il valore ' + v + ' è ora nel registro, a disposizione del processore.' + (j > 0 ? ' Il valore letto in precedenza è stato sostituito.' : '') });
      }
      passi.push({ atto: 2, titolo: 'Termine delle letture', calc: 'cella ' + (1000 + p.s + q - 1) + ' → ' + reg, hud: hud(), els: quadro(),
        testo: 'L’ultima cella letta ha indirizzo ' + (1000 + p.s + q - 1) + ' e contenuto ' + reg + '. A ogni lettura un indirizzo è stato inviato alla memoria, e un contenuto è stato restituito al registro.' });
      return { passi, esito: reg };
    }
  },
  bilancio: {
    regola: [
      'La memoria è una successione di celle numerate. L’indirizzo indica la collocazione di una cella, il contenuto è il dato che essa conserva.',
      'Per leggere un dato il processore invia l’indirizzo e riceve una copia del contenuto, che deposita in un registro. L’indirizzo di un dato adiacente si ottiene sommando alla base lo spostamento.'
    ],
    errori: [
      ['Scambiare indirizzo e contenuto.', 'La cella 1001 contiene 101: il primo numero è la collocazione, il secondo è il dato.'],
      ['Numerare gli spostamenti a partire da uno.', 'La prima cella ha spostamento zero, poiché coincide con la base.'],
      ['Ritenere che la lettura svuoti la cella.', 'Al processore giunge una copia. La cella conserva il proprio contenuto.']
    ],
    saFare: ['Distinguere l’indirizzo di una cella dal suo contenuto.', 'Calcolare un indirizzo a partire da base e spostamento.', 'Descrivere i passi di una lettura dalla memoria.'],
    esercizi: [
      { d: 'Una parola comincia all’indirizzo 2000. A quale indirizzo si trova la sua quarta lettera?', segnaposto: 'Un indirizzo', giuste: ['2003'],
        ok: 'La quarta lettera ha spostamento 3, poiché la prima ha spostamento zero: 2000 + 3 = 2003.',
        diagnosi: [
          { se: ['2004'], msg: 'Gli spostamenti sono stati numerati a partire da uno. La prima lettera coincide con la base, a spostamento zero.' },
          { se: ['3'], msg: 'Tre è lo spostamento della quarta lettera. L’indirizzo si ottiene sommandolo alla base.' },
          { se: ['4'], msg: 'Quattro è il numero d’ordine della lettera. Il suo spostamento è 3, e l’indirizzo è la base più lo spostamento.' }
        ],
        altro: 'L’indirizzo è diverso. Si assegni spostamento zero alla prima lettera, e si proceda fino alla quarta.',
        indizi: ['La prima lettera si trova all’indirizzo 2000, a spostamento zero.', 'La seconda è a spostamento 1, la terza a spostamento 2.', 'La quarta è a spostamento 3.'],
        svolgimento: ['Gli spostamenti delle prime quattro lettere sono 0, 1, 2 e 3.', 'L’indirizzo è la base più lo spostamento: 2000 + 3 = 2003.'] },
      { d: 'La cella 1001 contiene 101, e il processore la legge. Che cosa contiene la cella immediatamente dopo la lettura?', guida: 'Si scelga il contenuto.', o: [
        { t: '0', fb: 'La lettura trasmette una copia. Il contenuto della cella resta 101.' },
        { t: '101', ok: true, fb: 'Al processore giunge una copia del contenuto, e la cella resta invariata.' },
        { t: '1001', fb: 'Il valore indicato è l’indirizzo della cella, che resta sempre lo stesso. Il contenuto è 101.' }] }
    ],
    sfida: ['lez01_02_hardware_roles', 'Componenti hardware e loro funzioni']
  }
});
