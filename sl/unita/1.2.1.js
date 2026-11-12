'use strict';
SL.registra('1.2.1', {
  titolo: 'Dagli stati fisici ai simboli binari',
  obiettivo: 'Alla fine saprai dire quando una tensione misurata vale 0, quando vale 1 e quando non garantisce nulla, e quante combinazioni offrono più bit affiancati.',
  concetti: [['bit', 'Bit'], ['byte', 'Byte'], ['clock', 'Soglia']],
  filigrana: ['bit', 'byte', 'clock'],
  richiami: {
    carte: [
      { sim: 'memory', da: 'Dall’unità 0.1', t: 'La memoria', d: 'La memoria del calcolatore conserva i dati in caselle, in attesa che il processore li usi.' },
      { sim: 'puntatore', da: 'Dall’unità 0.3', t: 'Le cifre', d: 'Per scrivere i numeri di tutti i giorni usiamo dieci cifre, da 0 a 9, e diamo a ciascuna un peso secondo la posizione.' }
    ],
    domanda: { d: 'Prima di proseguire: quante cifre diverse usiamo nella scrittura di tutti i giorni?', o: [
      { t: '9', fb: 'Hai lasciato fuori lo zero. Le cifre vanno da 0 a 9 e sono dieci.' },
      { t: '10', ok: true, fb: 'Le cifre vanno da 0 a 9 e sono dieci.' },
      { t: '11', fb: 'Il dieci si scrive con due cifre, 1 e 0. Le cifre sono dieci, da 0 a 9.' }
    ] }
  },
  idea: {
    titolo: 'Due stati bastano',
    termini: ['bit', 'soglia', 'byte'],
    testo: [
      'Un circuito elettronico lavora con grandezze fisiche, e i numeri vanno ricavati da quelle. Su un filo, in un certo istante, c’è una certa tensione, che si misura in volt. Se volessimo far corrispondere dieci tensioni diverse alle dieci cifre, basterebbe un piccolo disturbo per scambiare un 6 con un 7. I fili si scaldano, i segnali si indeboliscono lungo il percorso, i componenti invecchiano: distinguere dieci livelli vicini fra loro sarebbe un’impresa fragile.',
      'I progettisti hanno scelto la strada più robusta, che consiste nel distinguere due soli stati, lontani fra loro. Una tensione bassa rappresenta la cifra 0 e una tensione alta rappresenta la cifra 1. Fra le due fasce resta una zona di mezzo, lasciata vuota di proposito, che fa da cuscinetto contro i disturbi. Un’informazione che può valere soltanto 0 oppure 1 si chiama [[bit]].',
      'A chi riceve il segnale basta sapere in quale fascia cade la misura, senza bisogno di un valore esatto. Nell’esempio che useremo, ogni tensione fino a 0,8 volt viene letta come 0 e ogni tensione da 2,0 volt in su viene letta come 1. Questi due confini si chiamano [[soglia|soglie]] e sono fissati dal costruttore del circuito. Una misura che cade fra 0,8 e 2,0 volt resta senza garanzie: il ricevitore potrebbe leggerla in un modo o nell’altro, e per questo il suo valore si dice indeterminato.',
      { fig: 'scena', w: 620, h: 190, titolo: 'Le tre fasce del ricevitore', nota: 'Nella zona di mezzo la lettura è senza garanzie: la stessa tensione può essere letta una volta come 0 e una volta come 1.', els: [
        SL.el.box('a', 20, 10, 580, 50, 'da 2,0 volt in su', 'si legge 1', 'on'),
        SL.el.box('m', 20, 70, 580, 50, 'fra 0,8 e 2,0 volt', 'indeterminato', 'err'),
        SL.el.box('b', 20, 130, 580, 50, 'fino a 0,8 volt', 'si legge 0', '')] },
      'Un bit da solo distingue due casi: acceso o spento, sì o no. Per rappresentare qualcosa di più ricco si affiancano più bit. Con due bit le combinazioni sono quattro: 00, 01, 10 e 11. Ogni bit aggiunto raddoppia il conto, perché ciascuna combinazione precedente può proseguire con uno 0 oppure con un 1. Con tre bit le combinazioni sono otto, con quattro sono sedici.',
      'Otto bit affiancati formano un [[byte]], l’unità con cui i calcolatori organizzano la memoria. Un byte offre 256 combinazioni, cioè 2 moltiplicato per se stesso otto volte. Il significato di ciascuna combinazione dipende da un accordo: nelle prossime unità vedremo come le stesse combinazioni possano indicare numeri, lettere o colori.'
    ]
  },
  esperimento: {
    faremo: [
      'Misureremo la tensione su quattro fili, uno alla volta. Per ciascuno confronteremo la misura con le due soglie del ricevitore e decideremo se il filo porta uno 0, un 1 oppure un valore indeterminato.',
      'Alla fine conteremo quante combinazioni diverse potrebbero comparire su quattro fili, aggiungendone uno per volta e osservando il conto che raddoppia.'
    ],
    vedrai: [
      ['clock', 'I quattro fili', 'Ogni colonna è un filo. In alto compare la tensione misurata.'],
      ['strati', 'Le tre fasce', 'Sotto ogni misura si accende la fascia in cui cade: alta, di mezzo o bassa.'],
      ['bit', 'La casella del bit', 'In fondo a ogni colonna compare la cifra letta, oppure un punto interrogativo.']
    ]
  },
  lab: {
    titolo: 'Quattro fili sotto misura',
    scena: { w: 860, h: 330 },
    atti: ['Preparazione', 'Le misure', 'Il conto delle combinazioni', 'Bilancio'],
    nota: 'Il numero di passi dipende dalle misure: una tensione che supera la soglia bassa richiede un secondo confronto, con la soglia alta.',
    controlli: [{ id: 'caso', tipo: 'scelta', eti: 'Misure', opzioni: [['puliti', 'Segnali puliti'], ['disturbo', 'Un filo disturbato'], ['soglie', 'Misure sulle soglie']], valore: 'disturbo' }],
    previsione: {
      domanda: (p) => { const m = { puliti: [0.4, 2.3, 0.7, 3.1], disturbo: [0.3, 1.4, 2.6, 0.5], soglie: [2.0, 0.8, 0.9, 1.9] }[p.caso]; return 'Sui quattro fili misureremo ' + m.map((v) => v.toFixed(1).replace('.', ',') + ' V').join(', ') + '. Le soglie sono 0,8 V e 2,0 V. Quanti fili porteranno un bit garantito?'; },
      opzioni: () => [0, 1, 2, 3, 4]
    },
    confronto: (pred, esito) => 'Avevi previsto ' + pred + (pred === 1 ? ' filo' : ' fili') + ' con un bit garantito. Sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Ricontrolla le misure vicine alle soglie: una tensione uguale alla soglia è ancora garantita, una appena dentro la zona di mezzo non lo è.'),
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
          els.push(el.box('a' + k, x, 76, 180, 36, null, 'da 2,0 V in su', st('a')), el.box('z' + k, x, 116, 180, 36, null, 'zona di mezzo', st('m')), el.box('b' + k, x, 156, 180, 36, null, 'fino a 0,8 V', st('b')));
          els.push(el.cella('r' + k, x + 60, 214, 60, 60, letti[k] === null ? '·' : letti[k], letti[k] === null ? '' : letti[k] === '?' ? 'err' : letti[k] === '1' ? 'on' : 'zero'));
        });
        if (conto) els.push(el.nota('cc', 30, 292, conto, 'forte', 'on'));
        return els;
      };
      const garantiti = () => letti.filter((x) => x === '0' || x === '1').length;
      const hud = (k) => [['Filo in esame', k == null ? '·' : k + 1, 'a'], ['Misura', k == null ? '·' : V(M[k])], ['Bit garantiti', garantiti(), 'c']];
      passi.push({ atto: 0, titolo: 'Il ricevitore è pronto', hud: hud(null), els: quadro(-1),
        testo: 'Quattro fili arrivano al ricevitore. Le sue soglie sono 0,8 volt in basso e 2,0 volt in alto. Le misure non sono ancora state fatte.' });
      M.forEach((v, k) => {
        const giusta = v <= 0.8 ? 0 : v >= 2.0 ? 2 : 1;
        passi.push({ atto: 1, titolo: 'Misura sul filo ' + (k + 1), calc: 'tensione = ' + V(v), hud: hud(k), els: quadro(k),
          testo: 'Lo strumento legge ' + V(v) + ' sul filo ' + (k + 1) + '. Ora bisogna stabilire in quale fascia cade questa misura.',
          chiedi: { d: 'In quale fascia cade ' + V(v) + '?', o: ['Fascia bassa: si legge 0', 'Zona di mezzo: indeterminato', 'Fascia alta: si legge 1'], g: giusta,
            no: ['La fascia bassa arriva fino a 0,8 V compresi. ' + V(v) + ' è più alta.', v <= 0.8 ? V(v) + ' non supera 0,8 V, quindi è ancora nella fascia bassa.' : V(v) + ' raggiunge 2,0 V, quindi è già nella fascia alta.', 'La fascia alta comincia a 2,0 V compresi. ' + V(v) + ' è più bassa.'] } });
        passi.push({ atto: 1, titolo: 'Confronto con la soglia bassa', calc: V(v) + ' ≤ 0,8 V ?', esito: v <= 0.8 ? ['SÌ', 'si'] : ['NO', ''], hud: hud(k), els: quadro(k, 'b'),
          testo: v <= 0.8 ? 'La misura non supera 0,8 volt, quindi cade nella fascia bassa.' : 'La misura supera 0,8 volt, quindi non appartiene alla fascia bassa. Serve un secondo confronto.' });
        if (v > 0.8) passi.push({ atto: 1, titolo: 'Confronto con la soglia alta', calc: V(v) + ' ≥ 2,0 V ?', esito: v >= 2.0 ? ['SÌ', 'si'] : ['NO', 'no'], hud: hud(k), els: quadro(k, v >= 2.0 ? 'a' : 'm'),
          testo: v >= 2.0 ? 'La misura raggiunge 2,0 volt: cade nella fascia alta.' : 'La misura resta sotto 2,0 volt. Avendo già superato la soglia bassa, cade nella zona di mezzo.' });
        fascia[k] = v <= 0.8 ? 'b' : v >= 2.0 ? 'a' : 'm';
        letti[k] = v <= 0.8 ? '0' : v >= 2.0 ? '1' : '?';
        passi.push({ atto: 1, titolo: letti[k] === '?' ? 'Nessun bit garantito' : 'Il filo ' + (k + 1) + ' porta ' + letti[k], calc: 'filo ' + (k + 1) + ' → ' + letti[k], hud: hud(k), els: quadro(k),
          testo: letti[k] === '?' ? 'Nella zona di mezzo la lettura è senza garanzie: il ricevitore potrebbe leggere 0 oppure 1. La casella riceve un punto interrogativo.' : 'La fascia ' + (letti[k] === '1' ? 'alta' : 'bassa') + ' garantisce la lettura: la casella del filo ' + (k + 1) + ' riceve la cifra ' + letti[k] + '.' });
      });
      let combinazioni = 1;
      for (let k = 1; k <= 4; k++) {
        combinazioni *= 2;
        passi.push({ atto: 2, titolo: k === 1 ? 'Un filo, due combinazioni' : 'Aggiungiamo il filo ' + k, calc: k === 1 ? '2' : (combinazioni / 2) + ' × 2 = ' + combinazioni, hud: hud(null), els: quadro(-1, null, (k === 1 ? 'Con 1 filo' : 'Con ' + k + ' fili') + ': ' + combinazioni + ' combinazioni'),
          testo: k === 1 ? 'Lasciamo le misure e contiamo le possibilità. Un filo solo può portare 0 oppure 1: due combinazioni.' : 'Ogni combinazione di prima può proseguire con uno 0 oppure con un 1 sul nuovo filo. Il conto raddoppia e arriva a ' + combinazioni + '.' });
      }
      const g = garantiti();
      passi.push({ atto: 3, titolo: 'La parola letta', calc: letti.join(' '), hud: hud(null), els: quadro(-1, null, 'Bit garantiti: ' + g + ' su 4'),
        testo: 'Sui quattro fili il ricevitore legge ' + letti.join(' ') + '. ' + (g === 4 ? 'Tutti e quattro i bit sono garantiti.' : 'I bit garantiti sono ' + g + ': dove compare il punto interrogativo la lettura non è affidabile, e una parola con un bit incerto non può essere usata.') });
      return { passi, esito: g };
    }
  },
  bilancio: {
    regola: [
      'Una misura si legge 0 se non supera la soglia bassa e si legge 1 se raggiunge la soglia alta. Nella zona di mezzo il valore è indeterminato e non va usato.',
      'Un bit distingue due casi. Ogni bit aggiunto raddoppia le combinazioni: con n bit sono 2 moltiplicato per se stesso n volte. Otto bit formano un byte, con 256 combinazioni.'
    ],
    errori: [
      ['Arrotondare la zona di mezzo.', 'Una tensione di 1,9 volt è vicina alla soglia alta e tuttavia non garantisce alcuna lettura.'],
      ['Sommare al posto di moltiplicare.', 'Con 5 bit le combinazioni sono 32: ogni bit raddoppia il conto precedente.'],
      ['Confondere bit e byte.', 'Il byte è un gruppo di otto bit.']
    ],
    saFare: ['Decido se una misura vale 0, vale 1 oppure è indeterminata.', 'Calcolo quante combinazioni offrono n bit.', 'Spiego perché i circuiti distinguono due soli stati.'],
    esercizi: [
      { d: 'Un ricevitore ha le soglie a 0,8 V e a 2,0 V. Su tre fili, da sinistra a destra, misuri 0,4 V, 2,3 V e 0,7 V. Quali tre cifre leggi?', segnaposto: 'Tre cifre', giuste: ['010'],
        ok: 'La prima e la terza misura non superano 0,8 V e valgono 0. La seconda raggiunge 2,0 V e vale 1.',
        diagnosi: [
          { se: ['101'], msg: 'Hai scambiato le due fasce. Una tensione bassa si legge 0 e una tensione alta si legge 1.' },
          { se: ['2'], msg: 'Hai calcolato il valore del numero. La domanda chiede le tre cifre lette sui fili, nell’ordine.' },
          { se: ['0?0', '0x0', '00'], msg: 'La misura di 2,3 V supera la soglia alta di 2,0 V, quindi è una lettura garantita.' },
          { se: ['011', '110'], msg: 'Ricontrolla la misura di 0,7 V: non supera 0,8 V, quindi cade nella fascia bassa.' }
        ],
        altro: 'Le cifre sono diverse. Confronta ogni misura prima con 0,8 V e poi, se serve, con 2,0 V.',
        indizi: ['Parti dal primo filo: 0,4 V supera 0,8 V?', 'La seconda misura, 2,3 V, va confrontata con la soglia alta.', 'Le tre misure cadono, nell’ordine, nella fascia bassa, in quella alta e in quella bassa.'],
        svolgimento: ['0,4 V non supera 0,8 V, quindi si legge 0.', '2,3 V raggiunge 2,0 V, quindi si legge 1.', '0,7 V non supera 0,8 V, quindi si legge 0. Le cifre sono 0, 1, 0.'] },
      { d: 'Quante combinazioni diverse si possono formare con 5 bit?', segnaposto: 'Un numero', giuste: ['32'],
        ok: 'Il conto raddoppia cinque volte: 2, 4, 8, 16, 32.',
        diagnosi: [
          { se: ['10'], msg: 'Hai moltiplicato 5 per 2. Ogni bit raddoppia tutte le combinazioni precedenti, quindi i due si moltiplicano fra loro: 2 × 2 × 2 × 2 × 2.' },
          { se: ['25'], msg: 'Hai calcolato 5 × 5. La base del conto è 2, perché ogni bit ha due valori, e va moltiplicata per se stessa cinque volte.' },
          { se: ['16'], msg: 'Sedici sono le combinazioni di 4 bit. Manca un raddoppio.' },
          { se: ['64'], msg: 'Sessantaquattro sono le combinazioni di 6 bit. Hai raddoppiato una volta di troppo.' }
        ],
        altro: 'Il numero è diverso. Parti da 2 per un solo bit e raddoppia a ogni bit aggiunto.',
        indizi: ['Con 1 bit le combinazioni sono 2, con 2 bit sono 4.', 'Prosegui: 3 bit ne danno 8, 4 bit ne danno 16.', 'Raddoppia ancora una volta.'],
        svolgimento: ['Con 1 bit: 2. Con 2 bit: 4. Con 3 bit: 8. Con 4 bit: 16.', 'Con 5 bit: 16 × 2 = 32.'] }
    ],
    sfida: ['lez02_01_voltage_to_bits', 'Bit, byte e capacità di rappresentazione']
  }
});
