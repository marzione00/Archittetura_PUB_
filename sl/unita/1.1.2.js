'use strict';
SL.registra('1.1.2', {
  titolo: 'La macchina fisica sotto le astrazioni',
  obiettivo: 'Alla fine saprai spiegare come il processore trova un dato in memoria e quale differenza passa fra l’indirizzo di una cella e il suo contenuto.',
  concetti: [['memory', 'Cella'], ['puntatore', 'Indirizzo'], ['register', 'Registro']],
  filigrana: ['memory', 'puntatore', 'register'],
  richiami: {
    carte: [
      { sim: 'memory', da: 'Dall’unità 0.1', t: 'Memoria e processore', d: 'La memoria conserva i dati. Il processore li legge, li trasforma e vi deposita i risultati.' },
      { sim: 'char', da: 'Dall’unità 1.1.1', t: 'I codici', d: 'Ogni carattere è conservato come numero: la h ha codice 104, la e ha codice 101.' }
    ],
    domanda: { d: 'Prima di proseguire: sotto quale forma il calcolatore conserva la lettera e?', o: [
      { t: 'Come disegno della lettera', fb: 'Il disegno viene prodotto dallo schermo al momento di mostrarla. In memoria c’è un numero.' },
      { t: 'Come numero: il suo codice 101', ok: true, fb: 'In memoria ogni carattere è un numero, stabilito dalla tabella dei codici.' },
      { t: 'Come parola «e»', fb: 'La memoria conserva soltanto numeri. Alla lettera e corrisponde il codice 101.' }
    ] }
  },
  idea: {
    titolo: 'Ogni cella ha un numero civico',
    termini: ['cella', 'indirizzo', 'registro', 'spostamento'],
    testo: [
      'Nell’unità 0.1 abbiamo descritto la memoria come un casellario. Ora guardiamola da vicino. Le caselle si chiamano [[cella|celle]], sono tutte uguali e sono disposte in una fila lunghissima. Ogni cella contiene un numero piccolo, quanto basta per un codice come quelli di hello.',
      'Per ritrovare un dato in mezzo a miliardi di celle identiche serve un modo per indicarne una. La soluzione è la più semplice possibile: le celle sono numerate in ordine, a partire da zero. Il numero che identifica una cella si chiama [[indirizzo]]. Funziona come il numero civico di una via: la casa al numero 12 resta al numero 12 anche quando cambiano gli inquilini.',
      'Qui nasce la confusione più comune di chi comincia. Ogni cella ha due numeri che vanno tenuti distinti: l’indirizzo, che dice dove si trova, e il contenuto, che dice che cosa conserva. La cella di indirizzo 1001 può contenere 101, e un attimo dopo contenere 7. L’indirizzo resta fermo, il contenuto cambia.',
      { fig: 'celle', titolo: 'La parola hello in memoria, a partire dall’indirizzo 1000', nota: 'Sopra ogni cella è scritto il suo indirizzo, dentro la cella il suo contenuto.', celle: [
        { so: '1000', v: '104' }, { so: '1001', v: '101', st: 'on' }, { so: '1002', v: '108' }, { so: '1003', v: '108' }, { so: '1004', v: '111' }] },
      'I dati stanno in memoria, fuori dal processore. Quando gliene serve uno, il processore manda alla memoria l’indirizzo della cella, e la memoria gli restituisce una copia del contenuto. Il dato ricevuto viene appoggiato in un [[registro]], una piccola sede interna al processore dove i dati sostano per il tempo di un’operazione. I registri sono pochissimi e velocissimi; le celle di memoria sono moltissime e un po’ più lente da raggiungere.',
      'Quando i dati stanno in celle vicine, al processore basta conoscere l’indirizzo della prima, detto base, e la distanza dalla base, detta [[spostamento]]. La parola hello comincia all’indirizzo 1000, quindi la sua seconda lettera si trova a spostamento 1, cioè all’indirizzo 1000 + 1. La prima lettera ha spostamento zero, perché si trova proprio alla base.'
    ]
  },
  esperimento: {
    faremo: [
      'La parola hello è in memoria a partire dall’indirizzo 1000. Faremo leggere al processore una o più lettere consecutive, scegliendo da quale spostamento cominciare.',
      'Per ogni cella vedremo cinque momenti: il calcolo dell’indirizzo, il viaggio dell’indirizzo verso la memoria, la scelta della cella, il ritorno del contenuto e l’arrivo nel registro.'
    ],
    vedrai: [
      ['memory', 'Le cinque celle', 'In alto, con l’indirizzo scritto sopra e il contenuto dentro.'],
      ['cpu', 'Il processore', 'In basso a sinistra. Calcola l’indirizzo e lo invia.'],
      ['register', 'Il registro', 'In basso al centro. Riceve la copia del contenuto letto.']
    ]
  },
  lab: {
    titolo: 'Leggere una parola, cella per cella',
    scena: { w: 860, h: 320 },
    atti: ['Preparazione', 'Le letture', 'Bilancio'],
    nota: 'Il numero di passi dipende da quante celle si leggono: cinque passi per ciascuna.',
    controlli: [
      { id: 's', tipo: 'num', eti: 'Spostamento iniziale', min: 0, max: 4, salti: [1], valore: 1 },
      { id: 'q', tipo: 'num', eti: 'Celle da leggere', min: 1, max: 3, salti: [1], valore: 2 }
    ],
    previsione: {
      domanda: (p) => { const q = Math.min(p.q, 5 - p.s); return 'Il processore leggerà ' + q + (q === 1 ? ' cella' : ' celle consecutive') + ' a partire dallo spostamento ' + p.s + '. Quale numero si troverà nel registro alla fine?'; },
      opzioni: (p) => { const q = Math.min(p.q, 5 - p.s), ult = p.s + q - 1; return Array.from(new Set([101, 104, 108, 111, 1000 + ult, ult])).sort((a, b) => a - b); }
    },
    confronto: (pred, esito) => 'Avevi previsto ' + pred + ' nel registro. Il registro contiene ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : (pred >= 1000 ? 'Il valore che avevi scelto è l’indirizzo dell’ultima cella. Nel registro arriva il contenuto.' : pred < 10 ? 'Il valore che avevi scelto è lo spostamento. Nel registro arriva il contenuto della cella.' : 'Ricalcola l’indirizzo dell’ultima cella letta e guarda che cosa contiene.')),
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
          testo: 'Il processore conosce la base, 1000, e lo spostamento, ' + sp + '. Sommandoli ottiene l’indirizzo della cella da leggere.',
          chiedi: { d: 'Qual è l’indirizzo della cella a spostamento ' + sp + '?', o: opz.map(String), g: opz.indexOf(ind), no: 'L’indirizzo è la base più lo spostamento, e la prima cella ha spostamento zero: 1000 + ' + sp + '.' } });
        passi.push({ atto: 1, titolo: 'L’indirizzo viaggia verso la memoria', hud: hud(sp, ind), els: quadro({ att: 'cpu', cpu: 'invio ' + ind, via: 'ind', pacco: [246, 150, String(ind), 'att'] }),
          testo: 'Il processore invia alla memoria il numero ' + ind + '. In questo momento viaggia un indirizzo, cioè l’indicazione di un luogo.' });
        passi.push({ atto: 1, titolo: 'La memoria sceglie la cella', hud: hud(sp, ind), els: quadro({ cella: sp, via: 'ind', pacco: [X(sp) + 18, 14, String(ind), 'att'] }),
          testo: 'La memoria individua la cella che porta il numero ' + ind + '. Dentro c’è il valore ' + v + ', il codice della lettera «' + LET[sp] + '».' });
        passi.push({ atto: 1, titolo: 'Il contenuto torna indietro', hud: hud(sp, ind), els: quadro({ cella: sp, via: 'dato', pacco: [520, 160, String(v)] }),
          testo: 'La memoria spedisce al processore una copia del contenuto. La cella ' + ind + ' continua a contenere ' + v + '.' });
        reg = v;
        passi.push({ atto: 1, titolo: 'Il registro riceve ' + v, calc: 'registro = ' + v, hud: hud(sp, ind), els: quadro({ att: 'reg', cella: sp }),
          testo: 'Il valore ' + v + ' è ora nel registro, a disposizione del processore.' + (j > 0 ? ' Il valore letto prima è stato sostituito.' : '') });
      }
      passi.push({ atto: 2, titolo: 'Fine delle letture', calc: 'cella ' + (1000 + p.s + q - 1) + ' → ' + reg, hud: hud(), els: quadro(),
        testo: 'L’ultima cella letta ha indirizzo ' + (1000 + p.s + q - 1) + ' e contenuto ' + reg + '. Verso la memoria è partito ogni volta un indirizzo, e verso il registro è tornato ogni volta un contenuto.' });
      return { passi, esito: reg };
    }
  },
  bilancio: {
    regola: [
      'La memoria è una fila di celle numerate. L’indirizzo dice dove si trova una cella, il contenuto dice che cosa conserva.',
      'Per leggere un dato il processore invia l’indirizzo e riceve una copia del contenuto, che appoggia in un registro. L’indirizzo di un dato vicino si ottiene sommando alla base il suo spostamento.'
    ],
    errori: [
      ['Scambiare indirizzo e contenuto.', 'La cella 1001 contiene 101: il primo numero è il luogo, il secondo è il dato.'],
      ['Contare gli spostamenti da uno.', 'La prima cella ha spostamento zero, perché si trova alla base.'],
      ['Pensare che la lettura svuoti la cella.', 'Al processore arriva una copia. La cella conserva il suo contenuto.']
    ],
    saFare: ['Distinguo l’indirizzo di una cella dal suo contenuto.', 'Calcolo un indirizzo a partire da base e spostamento.', 'Descrivo i passaggi di una lettura dalla memoria.'],
    esercizi: [
      { d: 'Una parola comincia all’indirizzo 2000. A quale indirizzo si trova la sua quarta lettera?', segnaposto: 'Un indirizzo', giuste: ['2003'],
        ok: 'La quarta lettera ha spostamento 3, perché la prima ha spostamento zero: 2000 + 3 = 2003.',
        diagnosi: [
          { se: ['2004'], msg: 'Hai contato gli spostamenti partendo da uno. La prima lettera si trova alla base, a spostamento zero.' },
          { se: ['3'], msg: 'Tre è lo spostamento della quarta lettera. L’indirizzo si ottiene sommandolo alla base.' },
          { se: ['4'], msg: 'Quattro è il numero d’ordine della lettera. Il suo spostamento è 3, e l’indirizzo è la base più lo spostamento.' }
        ],
        altro: 'L’indirizzo è diverso. Assegna spostamento zero alla prima lettera e conta fino alla quarta.',
        indizi: ['La prima lettera si trova all’indirizzo 2000, a spostamento zero.', 'La seconda è a spostamento 1, la terza a spostamento 2.', 'La quarta è a spostamento 3.'],
        svolgimento: ['Gli spostamenti delle prime quattro lettere sono 0, 1, 2 e 3.', 'L’indirizzo è la base più lo spostamento: 2000 + 3 = 2003.'] },
      { d: 'La cella 1001 contiene 101. Il processore la legge. Che cosa contiene la cella subito dopo la lettura?', guida: 'Scegli il contenuto.', o: [
        { t: '0', fb: 'La lettura consegna una copia. Il contenuto della cella resta 101.' },
        { t: '101', ok: true, fb: 'Al processore arriva una copia del contenuto, e la cella resta com’era.' },
        { t: '1001', fb: 'Quello è l’indirizzo della cella, che non cambia mai. Il contenuto resta 101.' }] }
    ],
    sfida: ['lez01_02_hardware_roles', 'Componenti hardware e loro funzioni']
  }
});
