'use strict';
SL.registra('1.2.1', {
  titolo: 'Dagli stati fisici ai simboli binari',
  obiettivo: 'Obiettivo: stabilire quando una tensione misurata vale 0, quando vale 1 e quando è priva di garanzia, e determinare il numero di combinazioni offerte da più bit affiancati.',
  concetti: [['bit', 'Bit'], ['byte', 'Byte'], ['clock', 'Soglia']],
  filigrana: ['bit', 'byte', 'clock'],
  richiami: {
    carte: [
      { sim: 'memory', da: 'Dall’unità 0.1', t: 'La memoria', d: 'La memoria del calcolatore conserva i dati in caselle, a disposizione del processore.' },
      { sim: 'puntatore', da: 'Dall’unità 0.3', t: 'Le cifre', d: 'La notazione ordinaria impiega dieci cifre, da 0 a 9, e attribuisce a ciascuna un peso in base alla posizione.' }
    ],
    domanda: { d: 'Prima di proseguire: quante cifre diverse impiega la notazione ordinaria?', o: [
      { t: '9', fb: 'È stato escluso lo zero. Le cifre vanno da 0 a 9, e sono dieci.' },
      { t: '10', ok: true, fb: 'Le cifre vanno da 0 a 9 e sono dieci.' },
      { t: '11', fb: 'Il dieci si scrive con due cifre, 1 e 0. Le cifre sono dieci, da 0 a 9.' }
    ] }
  },
  idea: {
    titolo: 'Due stati fisici, due simboli',
    termini: ['bit', 'soglia', 'byte'],
    testo: [
      'Un circuito elettronico opera su grandezze fisiche, dalle quali i numeri devono essere ricavati. Su un filo, in un dato momento, è presente una certa tensione, misurata in volt. Se alle dieci cifre corrispondessero dieci tensioni diverse, un disturbo di lieve entità basterebbe a trasformare un 6 in un 7. I fili si riscaldano, le tensioni si attenuano lungo la linea, i componenti si degradano nel tempo: la distinzione fra dieci livelli ravvicinati risulterebbe inaffidabile.',
      'La soluzione adottata, più robusta, distingue due soli stati, ben separati. Una tensione bassa rappresenta la cifra 0, una tensione alta la cifra 1. Fra le due fasce è lasciata di proposito una zona intermedia inutilizzata, che assorbe i disturbi. Un’informazione che può assumere soltanto i valori 0 e 1 prende il nome di [[bit]].',
      'Al ricevitore è sufficiente stabilire in quale fascia cade la misura, senza conoscerne il valore esatto. Nell’esempio adottato ogni tensione fino a 0,8 volt è letta come 0, e ogni tensione a partire da 2,0 volt è letta come 1. Questi due limiti si chiamano [[soglia|soglie]], e sono fissati dal costruttore del circuito. Una misura compresa fra 0,8 e 2,0 volt è priva di garanzia: il ricevitore può interpretarla in un modo o nell’altro, e il suo valore si dice pertanto indeterminato.',
      { fig: 'scena', w: 620, h: 190, titolo: 'Le tre fasce del ricevitore', nota: 'Nella zona intermedia la lettura è priva di garanzia: la stessa tensione può essere letta una volta come 0 e una volta come 1.', els: [
        SL.el.box('a', 20, 10, 580, 50, 'a partire da 2,0 volt', 'si legge 1', 'on'),
        SL.el.box('m', 20, 70, 580, 50, 'fra 0,8 e 2,0 volt', 'indeterminato', 'err'),
        SL.el.box('b', 20, 130, 580, 50, 'fino a 0,8 volt', 'si legge 0', '')] },
      'Un solo bit distingue due casi. Per rappresentare un numero maggiore di casi si affiancano più bit. Con due bit le combinazioni sono quattro: 00, 01, 10 e 11. Ogni bit aggiunto raddoppia il numero delle combinazioni, poiché ciascuna combinazione precedente può proseguire con uno 0 oppure con un 1. Con tre bit le combinazioni sono otto, con quattro sono sedici.',
      'Otto bit affiancati formano un [[byte]], l’unità con la quale i calcolatori organizzano la memoria. Un byte offre 256 combinazioni, cioè 2 moltiplicato per se stesso otto volte. Il significato di ciascuna combinazione è stabilito per convenzione: le unità successive mostrano come le medesime combinazioni possano rappresentare numeri, lettere o colori.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento misura la tensione su quattro fili, uno alla volta. Ogni misura è confrontata con le due soglie del ricevitore, per stabilire se il filo trasporta uno 0, un 1 oppure un valore indeterminato.',
      'Al termine si contano le combinazioni che possono presentarsi su quattro fili, aggiungendo un filo alla volta: a ogni aggiunta il numero raddoppia.'
    ],
    vedrai: [
      ['clock', 'I quattro fili', 'Ogni colonna corrisponde a un filo. In alto compare la tensione misurata.'],
      ['strati', 'Le tre fasce', 'Sotto ogni misura è evidenziata la fascia in cui essa cade: alta, intermedia o bassa.'],
      ['bit', 'La casella del bit', 'In fondo a ogni colonna compare la cifra letta, oppure un punto interrogativo.']
    ]
  },
  lab: {
    titolo: 'Misura di quattro fili',
    scena: { w: 860, h: 330 },
    atti: ['Preparazione', 'Le misure', 'Conteggio delle combinazioni', 'Bilancio'],
    nota: 'Il numero dei passi dipende dalle misure: una tensione superiore alla soglia bassa richiede un secondo confronto, con la soglia alta.',
    controlli: [{ id: 'caso', tipo: 'scelta', eti: 'Misure', opzioni: [['puliti', 'Segnali regolari'], ['disturbo', 'Un filo disturbato'], ['soglie', 'Misure sulle soglie']], valore: 'disturbo' }],
    previsione: {
      domanda: (p) => { const m = { puliti: [0.4, 2.3, 0.7, 3.1], disturbo: [0.3, 1.4, 2.6, 0.5], soglie: [2.0, 0.8, 0.9, 1.9] }[p.caso]; return 'Sui quattro fili si misurano ' + m.map((v) => v.toFixed(1).replace('.', ',') + ' V').join(', ') + '. Le soglie sono 0,8 V e 2,0 V. Quanti fili trasportano un bit garantito?'; },
      opzioni: () => [0, 1, 2, 3, 4]
    },
    confronto: (pred, esito) => 'La previsione indicava ' + pred + (pred === 1 ? ' filo' : ' fili') + ' con un bit garantito. Sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Vanno riesaminate le misure prossime alle soglie: una tensione uguale alla soglia è ancora garantita, una tensione appena interna alla zona intermedia è priva di garanzia.'),
    costruisci(p) {
      const M = { puliti: [0.4, 2.3, 0.7, 3.1], disturbo: [0.3, 1.4, 2.6, 0.5], soglie: [2.0, 0.8, 0.9, 1.9] }[p.caso];
      const el = SL.el, V = (v) => v.toFixed(1).replace('.', ',') + ' V', passi = [];
      const letti = [null, null, null, null];      // '0' | '1' | '?'
      const fascia = [null, null, null, null];     // 'b' | 'm' | 'a'
      const quadro = (att, prova, conto) => {
        const els = [];
        M.forEach((v, k) => {
          const x = 30 + k * 205, visto = k <= att || letti[k] !== null;
          els.push(el.box('m' + k, x, 6, 180, 58, 'filo ' + (k + 1), visto ? V(v) : '· · ·', k === att ? 'att' : ''));
          const st = (f) => (fascia[k] === f ? (f === 'm' ? 'err' : 'on') : (k === att && prova === f ? 'att' : 'off'));
          els.push(el.box('a' + k, x, 76, 180, 36, null, 'da 2,0 V in su', st('a')), el.box('z' + k, x, 116, 180, 36, null, 'zona intermedia', st('m')), el.box('b' + k, x, 156, 180, 36, null, 'fino a 0,8 V', st('b')));
          els.push(el.cella('r' + k, x + 60, 214, 60, 60, letti[k] === null ? '·' : letti[k], letti[k] === null ? '' : letti[k] === '?' ? 'err' : letti[k] === '1' ? 'on' : 'zero'));
        });
        if (conto) els.push(el.nota('cc', 30, 292, conto, 'forte', 'on'));
        return els;
      };
      const garantiti = () => letti.filter((x) => x === '0' || x === '1').length;
      const hud = (k) => [['Filo in esame', k == null ? '·' : k + 1, 'a'], ['Misura', k == null ? '·' : V(M[k])], ['Bit garantiti', garantiti(), 'c']];
      passi.push({ atto: 0, titolo: 'Il ricevitore è pronto', hud: hud(null), els: quadro(-1),
        testo: 'Quattro fili giungono al ricevitore. Le soglie sono 0,8 volt per la fascia bassa e 2,0 volt per la fascia alta. Le misure devono ancora essere eseguite.' });
      M.forEach((v, k) => {
        const giusta = v <= 0.8 ? 0 : v >= 2.0 ? 2 : 1;
        passi.push({ atto: 1, titolo: 'Misura sul filo ' + (k + 1), calc: 'tensione = ' + V(v), hud: hud(k), els: quadro(k),
          testo: 'Lo strumento legge ' + V(v) + ' sul filo ' + (k + 1) + '. Occorre stabilire in quale fascia cade la misura.',
          chiedi: { d: 'In quale fascia cade ' + V(v) + '?', o: ['Fascia bassa: si legge 0', 'Zona intermedia: indeterminato', 'Fascia alta: si legge 1'], g: giusta,
            no: ['La fascia bassa si estende fino a 0,8 V compresi. ' + V(v) + ' è più alta.', v <= 0.8 ? V(v) + ' non supera 0,8 V, e appartiene quindi alla fascia bassa.' : V(v) + ' raggiunge 2,0 V, e appartiene quindi alla fascia alta.', 'La fascia alta comincia a 2,0 V compresi. ' + V(v) + ' è più bassa.'] } });
        passi.push({ atto: 1, titolo: 'Confronto con la soglia bassa', calc: V(v) + ' ≤ 0,8 V ?', esito: v <= 0.8 ? ['SÌ', 'si'] : ['NO', ''], hud: hud(k), els: quadro(k, 'b'),
          testo: v <= 0.8 ? 'La misura non supera 0,8 volt, e cade quindi nella fascia bassa.' : 'La misura supera 0,8 volt, ed è quindi esterna alla fascia bassa. È necessario un secondo confronto.' });
        if (v > 0.8) passi.push({ atto: 1, titolo: 'Confronto con la soglia alta', calc: V(v) + ' ≥ 2,0 V ?', esito: v >= 2.0 ? ['SÌ', 'si'] : ['NO', 'no'], hud: hud(k), els: quadro(k, v >= 2.0 ? 'a' : 'm'),
          testo: v >= 2.0 ? 'La misura raggiunge 2,0 volt: cade nella fascia alta.' : 'La misura resta inferiore a 2,0 volt. Poiché ha superato la soglia bassa, cade nella zona intermedia.' });
        fascia[k] = v <= 0.8 ? 'b' : v >= 2.0 ? 'a' : 'm';
        letti[k] = v <= 0.8 ? '0' : v >= 2.0 ? '1' : '?';
        passi.push({ atto: 1, titolo: letti[k] === '?' ? 'Nessun bit garantito' : 'Il filo ' + (k + 1) + ' porta ' + letti[k], calc: 'filo ' + (k + 1) + ' → ' + letti[k], hud: hud(k), els: quadro(k),
          testo: letti[k] === '?' ? 'Nella zona intermedia la lettura è priva di garanzia: il ricevitore può leggere 0 oppure 1. La casella riceve un punto interrogativo.' : 'La fascia ' + (letti[k] === '1' ? 'alta' : 'bassa') + ' garantisce la lettura: la casella del filo ' + (k + 1) + ' riceve la cifra ' + letti[k] + '.' });
      });
      let combinazioni = 1;
      for (let k = 1; k <= 4; k++) {
        combinazioni *= 2;
        passi.push({ atto: 2, titolo: k === 1 ? 'Un filo, due combinazioni' : 'Aggiunta del filo ' + k, calc: k === 1 ? '2' : (combinazioni / 2) + ' × 2 = ' + combinazioni, hud: hud(null), els: quadro(-1, null, (k === 1 ? 'Con 1 filo' : 'Con ' + k + ' fili') + ': ' + combinazioni + ' combinazioni'),
          testo: k === 1 ? 'Terminate le misure, si contano le combinazioni possibili. Un solo filo può trasportare 0 oppure 1: due combinazioni.' : 'Ogni combinazione precedente può proseguire con uno 0 oppure con un 1 sul nuovo filo. Il numero raddoppia, e diviene ' + combinazioni + '.' });
      }
      const g = garantiti();
      passi.push({ atto: 3, titolo: 'La parola letta', calc: letti.join(' '), hud: hud(null), els: quadro(-1, null, 'Bit garantiti: ' + g + ' su 4'),
        testo: 'Sui quattro fili il ricevitore legge ' + letti.join(' ') + '. ' + (g === 4 ? 'Tutti e quattro i bit sono garantiti.' : 'I bit garantiti sono ' + g + ': dove compare il punto interrogativo la lettura è inaffidabile, e una parola con un bit incerto è inutilizzabile.') });
      return { passi, esito: g };
    }
  },
  bilancio: {
    regola: [
      'Una misura si legge 0 se resta entro la soglia bassa, e si legge 1 se raggiunge la soglia alta. Nella zona intermedia il valore è indeterminato, e va scartato.',
      'Un bit distingue due casi. Ogni bit aggiunto raddoppia le combinazioni: con n bit sono 2 moltiplicato per se stesso n volte. Otto bit formano un byte, con 256 combinazioni.'
    ],
    errori: [
      ['Arrotondare una misura della zona intermedia.', 'Una tensione di 1,9 volt è prossima alla soglia alta, e tuttavia è priva di garanzia.'],
      ['Sommare in luogo di moltiplicare.', 'Con 5 bit le combinazioni sono 32: ogni bit raddoppia il conto precedente.'],
      ['Confondere bit e byte.', 'Il byte è un gruppo di otto bit.']
    ],
    saFare: ['Stabilire se una misura vale 0, vale 1 oppure è indeterminata.', 'Calcolare il numero di combinazioni offerte da n bit.', 'Spiegare perché i circuiti distinguono due soli stati.'],
    esercizi: [
      { d: 'Un ricevitore ha le soglie a 0,8 V e a 2,0 V. Su tre fili, da sinistra a destra, si misurano 0,4 V, 2,3 V e 0,7 V. Quali sono le tre cifre lette?', segnaposto: 'Tre cifre', giuste: ['010'],
        ok: 'La prima e la terza misura non superano 0,8 V e valgono 0. La seconda raggiunge 2,0 V e vale 1.',
        diagnosi: [
          { se: ['101'], msg: 'Le due fasce sono state scambiate. Una tensione bassa si legge 0, una tensione alta si legge 1.' },
          { se: ['2'], msg: 'È stato calcolato il valore del numero. La domanda richiede le tre cifre lette sui fili, nell’ordine.' },
          { se: ['0?0', '0x0', '00'], msg: 'La misura di 2,3 V supera la soglia alta di 2,0 V, ed è quindi una lettura garantita.' },
          { se: ['011', '110'], msg: 'Va riesaminata la misura di 0,7 V: resta entro 0,8 V, e cade quindi nella fascia bassa.' }
        ],
        altro: 'Le cifre sono diverse. Si confronti ogni misura prima con 0,8 V e poi, se necessario, con 2,0 V.',
        indizi: ['Per il primo filo occorre stabilire se 0,4 V supera 0,8 V.', 'La seconda misura, 2,3 V, va confrontata con la soglia alta.', 'Le tre misure cadono, nell’ordine, nella fascia bassa, in quella alta e in quella bassa.'],
        svolgimento: ['0,4 V non supera 0,8 V, quindi si legge 0.', '2,3 V raggiunge 2,0 V, quindi si legge 1.', '0,7 V non supera 0,8 V, quindi si legge 0. Le cifre sono 0, 1, 0.'] },
      { d: 'Quante combinazioni diverse si possono formare con 5 bit?', segnaposto: 'Un numero', giuste: ['32'],
        ok: 'Il conto raddoppia cinque volte: 2, 4, 8, 16, 32.',
        diagnosi: [
          { se: ['10'], msg: 'È stato calcolato 5 × 2. Ogni bit raddoppia tutte le combinazioni precedenti: i fattori 2 vanno moltiplicati fra loro, 2 × 2 × 2 × 2 × 2.' },
          { se: ['25'], msg: 'È stato calcolato 5 × 5. La base è 2, poiché ogni bit ha due valori, e va moltiplicata per se stessa cinque volte.' },
          { se: ['16'], msg: 'Sedici sono le combinazioni di 4 bit. Manca un raddoppio.' },
          { se: ['64'], msg: 'Sessantaquattro sono le combinazioni di 6 bit. È stato eseguito un raddoppio in più.' }
        ],
        altro: 'Il numero è diverso. Si parta da 2 per un solo bit e si raddoppi a ogni bit aggiunto.',
        indizi: ['Con 1 bit le combinazioni sono 2, con 2 bit sono 4.', 'Proseguendo, 3 bit ne offrono 8 e 4 bit ne offrono 16.', 'Manca un ultimo raddoppio.'],
        svolgimento: ['Con 1 bit: 2. Con 2 bit: 4. Con 3 bit: 8. Con 4 bit: 16.', 'Con 5 bit: 16 × 2 = 32.'] }
    ],
    sfida: ['lez02_01_voltage_to_bits', 'Bit, byte e capacità di rappresentazione']
  }
});
