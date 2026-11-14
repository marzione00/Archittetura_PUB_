'use strict';
SL.registra('1.3.3', {
  titolo: 'Dimensionare una registrazione PCM',
  obiettivo: 'Obiettivo: descrivere la rappresentazione di un suono come fila di numeri e calcolare la dimensione in byte di una registrazione, noti quattro parametri.',
  concetti: [['suono', 'Campione'], ['clock', 'Frequenza'], ['byte', 'Byte']],
  filigrana: ['suono', 'clock', 'byte'],
  richiami: {
    carte: [
      { sim: 'pixel', da: 'Dall’unità 1.3.1', t: 'Un’immagine è una fila di numeri', d: 'Ogni pixel è descritto da tre canali, e i pixel sono scritti uno dopo l’altro in un ordine concordato.' },
      { sim: 'byte', da: 'Dall’unità 1.2.1', t: 'Bit e byte', d: 'Otto bit formano un byte. Con n bit le combinazioni sono 2 moltiplicato per se stesso n volte.' },
      { sim: 'clock', da: 'Dall’unità 1.2.1', t: 'Dalla tensione al numero', d: 'Un circuito opera su tensioni. I numeri si ricavano dalla misura di tali tensioni.' }
    ],
    domanda: { d: 'Prima di proseguire: quanti byte occorrono per scrivere un numero di 16 bit?', o: [
      { t: '1', fb: 'Un byte contiene 8 bit. Sedici bit ne occupano due.' },
      { t: '2', ok: true, fb: 'Sedici bit formano due gruppi di otto.' },
      { t: '16', fb: 'Sedici è il numero dei bit. I byte sono gruppi di otto bit.' }
    ] }
  },
  idea: {
    titolo: 'Il suono misurato a intervalli regolari',
    termini: ['campione', 'frequenza di campionamento', 'profondità', 'pcm'],
    testo: [
      'Un suono è una variazione molto rapida della pressione dell’aria. Il microfono la converte in una tensione elettrica che varia con il medesimo andamento. Una tensione che varia con continuità assume infiniti valori, mentre un calcolatore può conservarne soltanto un numero finito.',
      'La soluzione consiste nel misurare la tensione a intervalli regolari e nel conservare le misure. Ogni misura prende il nome di [[campione]]. Una successione di campioni sufficientemente fitta consente di ricostruire l’andamento originale.',
      'Il numero di misure eseguite in un secondo prende il nome di [[frequenza di campionamento]] e si esprime in hertz. Un CD musicale impiega 44 100 campioni al secondo, una telefonata tradizionale 8000. Al crescere della frequenza di campionamento la registrazione conserva suoni più acuti.',
      'Ogni campione è un numero scritto con una quantità fissa di bit, detta [[profondità]]. Con 8 bit i livelli distinguibili sono 256, con 16 bit sono 65 536, e la riproduzione risulta più fedele. Anche il suono è organizzato in canali: una registrazione stereo ne comprende due, uno per l’altoparlante sinistro e uno per il destro, e a ogni istante conserva un campione per ciascuno.',
      { fig: 'celle', titolo: 'Un istante di una registrazione stereo a 16 bit', nota: 'Due canali, due byte per campione: ogni istante occupa quattro byte.', celle: [
        { so: 'sinistro', v: '··', st: 'amb', gi: 'byte 0' }, { so: 'sinistro', v: '··', st: 'amb', gi: 'byte 1' }, { so: 'destro', v: '··', st: 'on', gi: 'byte 2' }, { so: 'destro', v: '··', st: 'on', gi: 'byte 3' }] },
      'Il formato più semplice scrive i campioni in successione, nell’ordine in cui sono stati misurati, e prende il nome di [[pcm|PCM]]. Lo spazio occupato si calcola con un prodotto: i byte di un campione, per il numero dei canali, per i campioni al secondo, per i secondi. Un secondo di musica con la qualità di un CD occupa 2 × 2 × 44 100 byte, cioè 176 400.',
      'Come per le immagini, i soli byte sono insufficienti. La riproduzione del suono richiede la conoscenza di frequenza, profondità e numero di canali. Con una frequenza errata la musica risulta accelerata o rallentata; con una profondità errata si ottiene soltanto rumore.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento fissa i quattro parametri di una registrazione: frequenza, canali, profondità e durata. La dimensione è costruita un livello alla volta: un campione, un istante, un secondo, l’intera durata.',
      'Ogni parametro interviene nel calcolo una sola volta, sempre come fattore di un prodotto.'
    ],
    vedrai: [
      ['suono', 'I tre livelli', 'In alto: i byte occupati da un campione, da un istante e da un secondo.'],
      ['clock', 'I secondi', 'Al centro: una casella per ogni secondo registrato.'],
      ['byte', 'La dimensione', 'In basso: i byte accumulati fino al passo corrente.']
    ]
  },
  lab: {
    titolo: 'Lo spazio occupato da un suono',
    scena: { w: 860, h: 330 },
    atti: ['I parametri', 'Un campione', 'Un istante', 'Un secondo', 'L’intera durata'],
    nota: 'Il numero di passi dipende dalla durata: ogni secondo registrato aggiunge un passo.',
    controlli: [
      { id: 'f', tipo: 'scelta', eti: 'Campioni al secondo', opzioni: [[8000, '8000'], [22050, '22 050'], [44100, '44 100'], [48000, '48 000']], valore: 44100 },
      { id: 'c', tipo: 'scelta', eti: 'Canali', opzioni: [[1, 'Uno'], [2, 'Due']], valore: 2 },
      { id: 'b', tipo: 'scelta', eti: 'Bit per campione', opzioni: [[8, '8'], [16, '16'], [24, '24']], valore: 16 },
      { id: 's', tipo: 'num', eti: 'Durata', min: 1, max: 8, salti: [1], valore: 5, unita: 's' }
    ],
    previsione: {
      domanda: (p) => 'La registrazione dura ' + p.s + (p.s === 1 ? ' secondo' : ' secondi') + ', con ' + SL.num(p.f) + ' campioni al secondo, ' + (p.c === 1 ? 'un canale' : 'due canali') + ' e ' + p.b + ' bit per campione. Quanti byte occupa?',
      opzioni: (p) => { const N = SL.num; const T = p.f * p.c * (p.b / 8) * p.s; const s = new Set([T, p.f * p.c * p.b * p.s, p.f * (p.b / 8) * p.s, p.f * p.c * (p.b / 8)]); if (s.size < 3) s.add(T * 2); if (s.size < 3) s.add(T * 4); return Array.from(s).sort((a, b) => a - b).map((v) => [v, N(v)]); }
    },
    confronto: (pred, esito, p) => { const N = SL.num; return 'La previsione indicava ' + N(pred) + ' byte. La registrazione ne occupa ' + N(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.f * p.c * p.b * p.s ? 'Il valore indicato conta i bit. Per ottenere i byte va diviso per otto.' : pred === p.f * (p.b / 8) * p.s && p.c > 1 ? 'Nel calcolo manca il secondo canale: a ogni istante i campioni sono due.' : pred === p.f * p.c * (p.b / 8) && p.s > 1 ? 'Il valore indicato è la dimensione di un solo secondo. Va moltiplicata per la durata.' : 'Vanno ripercorsi i quattro livelli: campione, istante, secondo, durata.'); },
    costruisci(p) {
      const el = SL.el, passi = [];
      const N = SL.num;
      const bc = p.b / 8, bi = bc * p.c, bs = bi * p.f;
      let liv = 0, sec = 0;
      const quadro = (o) => {
        o = o || {};
        const els = [
          el.box('cm', 40, 16, 200, 84, 'un campione', liv >= 1 ? bc + ' byte' : '·', o.att === 1 ? 'att' : liv >= 1 ? 'on' : '', { sim: 'suono' }),
          el.box('is', 300, 16, 200, 84, 'un istante', liv >= 2 ? bi + ' byte' : '·', o.att === 2 ? 'att' : liv >= 2 ? 'on' : '', { sim: 'bit' }),
          el.box('se', 560, 16, 260, 84, 'un secondo', liv >= 3 ? N(bs) + ' byte' : '·', o.att === 3 ? 'att' : liv >= 3 ? 'on' : '', { sim: 'clock' }),
          el.linea('l1', 240, 58, 300, 58, liv >= 2 ? 'on' : ''), el.linea('l2', 500, 58, 560, 58, liv >= 3 ? 'on' : ''),
          el.nota('n1', 246, 30, '× ' + p.c, 'mono', liv >= 2 ? 'on' : ''), el.nota('n2', 506, 30, '× f', 'mono', liv >= 3 ? 'on' : ''),
          el.nota('t2', 40, 126, 'I SECONDI REGISTRATI', 'mono')
        ];
        for (let k = 0; k < p.s; k++) els.push(el.cella('s' + k, 40 + k * 98, 156, 88, 50, (k + 1) + ' s', o.sec === k ? 'att' : k < sec ? 'on' : '', { piccola: true }));
        els.push(el.box('to', 40, 240, 480, 76, 'dimensione raggiunta', N(sec * bs) + ' byte', o.fine ? 'att' : sec ? 'on' : '', { sim: 'byte', riga: true }));
        return els;
      };
      const hud = () => [['Byte per campione', liv >= 1 ? bc : '·', 'a'], ['Byte per istante', liv >= 2 ? bi : '·'], ['Byte al secondo', liv >= 3 ? N(bs) : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'I quattro parametri', 'La registrazione acquisisce ' + N(p.f) + ' campioni al secondo su ' + (p.c === 1 ? 'un canale' : 'due canali') + ', ogni campione è scritto con ' + p.b + ' bit e la durata è di ' + p.s + (p.s === 1 ? ' secondo' : ' secondi') + '. Si parte dall’elemento più piccolo.',
        { chiedi: { d: 'Un campione è scritto con ' + p.b + ' bit. Quanti byte occupa?', o: p.b === 24 ? ['2', '3', '24'] : ['1', '2', String(p.b)], g: p.b === 8 ? 0 : 1, no: 'Un byte contiene otto bit, quindi ' + p.b + ' bit occupano ' + p.b + ' ÷ 8 byte.' } });
      liv = 1;
      P({ att: 1 }, 1, 'Un campione occupa ' + bc + ' byte', 'Ogni campione è un numero di ' + p.b + ' bit. Otto bit formano un byte, quindi il campione occupa ' + bc + (bc === 1 ? ' byte.' : ' byte.'),
        Object.assign({ calc: p.b + ' ÷ 8 = ' + bc + ' byte' }, p.c === 2 ? { chiedi: { d: 'La registrazione è stereo. Quanti campioni vengono scritti a ogni istante?', o: ['1', '2', '4'], g: 1, no: 'A ogni istante si esegue una misura per ciascun canale. I canali sono due.' } } : {}));
      liv = 2;
      P({ att: 2 }, 2, 'Un istante occupa ' + bi + ' byte', p.c === 1
        ? 'Il canale è uno solo, quindi a ogni istante viene scritto un campione. Un istante occupa gli stessi ' + bc + ' byte di un campione.'
        : 'A ogni istante vengono scritti due campioni, uno per il canale sinistro e uno per il destro. Un istante occupa ' + bc + ' × 2 byte.', { calc: bc + ' × ' + p.c + ' = ' + bi + ' byte' });
      liv = 3;
      P({ att: 3 }, 3, 'Un secondo occupa ' + N(bs) + ' byte', 'In un secondo gli istanti misurati sono ' + N(p.f) + ', quanti ne indica la frequenza di campionamento. Ciascuno occupa ' + bi + ' byte.', { calc: bi + ' × ' + N(p.f) + ' = ' + N(bs) + ' byte' });
      for (let k = 0; k < p.s; k++) {
        sec = k + 1;
        P({ sec: k }, 4, 'Secondo ' + sec + ' di ' + p.s, 'Il ' + ['primo', 'secondo', 'terzo', 'quarto', 'quinto', 'sesto', 'settimo', 'ottavo'][k] + ' secondo aggiunge altri ' + N(bs) + ' byte. La dimensione raggiunge ' + N(sec * bs) + ' byte.', { calc: N(k * bs) + ' + ' + N(bs) + ' = ' + N(sec * bs) });
      }
      const T = bs * p.s;
      P({ fine: true }, 4, 'La dimensione completa', 'La registrazione occupa ' + N(T) + ' byte' + (T >= 1000000 ? ', cioè circa ' + (T / 1000000).toFixed(1).replace('.', ',') + ' milioni' : '') + '. Ogni parametro è intervenuto nel calcolo una sola volta, come fattore di un prodotto.', { calc: bc + ' × ' + p.c + ' × ' + N(p.f) + ' × ' + p.s + ' = ' + N(T) + ' byte' });
      return { passi, esito: T };
    }
  },
  bilancio: {
    regola: [
      'Un suono si conserva misurandolo a intervalli regolari. Ogni misura è un campione, scritto con un numero fisso di bit.',
      'I byte di una registrazione PCM sono il prodotto di quattro numeri: byte per campione, canali, campioni al secondo, secondi.'
    ],
    errori: [
      ['Lasciare la profondità in bit.', 'Il calcolo si esegue in byte: 16 bit sono 2 byte, 24 bit sono 3.'],
      ['Trascurare i canali.', 'Una registrazione stereo scrive due campioni a ogni istante e occupa il doppio di una mono.'],
      ['Confondere frequenza e durata.', 'La frequenza indica quante misure sono comprese in un secondo. La durata indica quanti secondi sono stati registrati.']
    ],
    saFare: ['Definire il campione e la frequenza di campionamento.', 'Calcolare i byte di un secondo di registrazione.', 'Calcolare la dimensione di una registrazione di durata data.'],
    esercizi: [
      { d: 'Una telefonata viene registrata con 8000 campioni al secondo, un canale e 8 bit per campione. Quanti byte occupa un minuto?', segnaposto: 'Un numero di byte', giuste: ['480000', '480 000', '480.000'],
        ok: 'Un secondo occupa 8000 byte, e un minuto ne contiene sessanta.',
        diagnosi: [
          { se: ['8000', '8 000', '8.000'], msg: 'Il valore indicato è la dimensione di un secondo. Un minuto dura sessanta secondi.' },
          { se: ['3840000', '3 840 000', '3.840.000'], msg: 'Sono stati contati i bit. Con 8 bit per campione ogni campione occupa un byte.' },
          { se: ['64000', '64 000', '64.000'], msg: 'La frequenza è stata moltiplicata per 8. La profondità va dapprima convertita in byte, e manca inoltre la durata.' }
        ],
        altro: 'Il numero è diverso. Si calcolino dapprima i byte di un secondo, e si moltiplichi poi per i secondi di un minuto.',
        indizi: ['Un campione di 8 bit occupa un byte.', 'In un secondo i campioni sono 8000, su un solo canale.', 'Un minuto contiene 60 secondi.'],
        svolgimento: ['Un campione: 8 ÷ 8 = 1 byte. Un istante, con un canale: 1 byte.', 'Un secondo: 1 × 8000 = 8000 byte.', 'Un minuto: 8000 × 60 = 480 000 byte.'] },
      { d: 'Una registrazione stereo a 22 050 campioni al secondo viene ripetuta in mono a 44 100 campioni al secondo, con la stessa profondità e la stessa durata. Come cambia la dimensione?', guida: 'Si scelga la risposta.', o: [
        { t: 'Raddoppia', fb: 'La frequenza raddoppia, mentre i canali si dimezzano.' },
        { t: 'Resta uguale', ok: true, fb: 'Il doppio dei campioni al secondo su metà dei canali dà lo stesso prodotto.' },
        { t: 'Si dimezza', fb: 'I canali si dimezzano, mentre la frequenza raddoppia.' }] }
    ]
  }
});
