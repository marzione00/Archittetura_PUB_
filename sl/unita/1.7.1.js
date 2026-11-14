'use strict';
SL.registra('1.7.1', {
  titolo: 'Un metodo per interpretare dati binari reali',
  obiettivo: 'Obiettivo: percorrere un record un campo alla volta, verificando prima di ogni lettura che i byte necessari siano stati ricevuti.',
  concetti: [['tabella', 'Record'], ['puntatore', 'Cursore'], ['scudo', 'Byte rimasti']],
  filigrana: ['tabella', 'scudo', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 1.3.4', t: 'Campi e cursore', d: 'Un formato elenca i campi nell’ordine in cui compaiono. Il cursore è il numero del prossimo byte da leggere.' },
      { sim: 'scudo', da: 'Dall’unità 1.3.5', t: 'Cinque domande per ogni campo', d: 'Dove comincia, quanto è largo, se i byte sono tutti disponibili, in quale ordine vanno considerati, che cosa significano.' },
      { sim: 'char', da: 'Dall’unità 1.2.4', t: 'I codici ASCII', d: 'Ogni carattere corrisponde a un byte: la T è 0x54, la L è 0x4C, la M è 0x4D, la cifra 1 è 0x31.' }
    ],
    domanda: { d: 'Prima di proseguire: un lettore ha ricevuto 12 byte e il cursore è sul byte 9. Quanti byte restano da leggere?', o: [
      { t: '3', ok: true, fb: 'I byte rimasti sono 12 − 9 = 3: quelli di posto 9, 10 e 11.' },
      { t: '4', fb: 'I byte ricevuti occupano i posti da 0 a 11. Dal posto 9 in avanti ce ne sono tre.' },
      { t: '9', fb: 'Nove sono i byte già consumati. Quelli rimasti sono 12 − 9.' }
    ] }
  },
  idea: {
    titolo: 'Le medesime domande per ogni campo',
    termini: ['record'],
    testo: [
      'I capitoli precedenti hanno trattato una regola alla volta: i caratteri, l’ordine dei byte, gli interi con segno, la virgola mobile. I dati che un programma riceve nella pratica combinano tutte queste regole in una sola sequenza di byte. Il capitolo le applica congiuntamente, su un unico esempio sviluppato fino all’ultima unità.',
      'L’esempio è una stazione meteorologica. Un sensore misura una temperatura e la tensione della propria batteria, e trasmette le due misure insieme al proprio nome. L’insieme dei campi che descrive una misura prende il nome di [[record]]. Trasmettitore e lettore condividono un formato, qui denominato TLM1 dalle iniziali di telemetria, cioè la trasmissione a distanza di misure.',
      'Il formato TLM1 prevede cinque campi, sempre nello stesso ordine. Il primo è la [[firma]], formata dai quattro caratteri ASCII «TLM1». Il secondo è un byte che dichiara la lunghezza del nome. Il terzo è il nome del sensore, con un carattere ASCII per byte. Il quarto è la temperatura, in due byte. Il quinto è la tensione, in quattro byte.',
      { fig: 'scena', w: 790, h: 124, titolo: 'Il record del sensore «Nord»', nota: 'Quindici byte complessivi. Sopra ogni cella è indicato il numero del relativo posto, contato da zero.',
        els: SL.tlm.striscia('g', SL.tlm.codifica('Nord', -35, 1.5), { x: 20, y: 30, cur: 15 }).concat(SL.tlm.nomi('n', 4, { x: 20, y: 92, cur: 15 })) },
      'Quattro campi hanno larghezza fissa. Il nome varia da sensore a sensore, ed è pertanto preceduto dalla propria lunghezza. Ne discende una conseguenza ricorrente nel capitolo: la posizione della temperatura e della tensione dipende dal nome. Con un nome di quattro byte la temperatura comincia al byte 9, mentre con un nome di sei byte comincia al byte 11.',
      'La lettura di un record applica a ogni campo le cinque domande dell’unità 1.3.5. La prima riguarda il punto in cui il campo comincia, e la risposta è il cursore. La seconda riguarda la larghezza, che è fissata dal formato oppure da un campo letto in precedenza. La terza accerta se i byte necessari sono stati tutti ricevuti, e si risolve confrontando la larghezza con i byte rimasti. Le ultime due riguardano l’ordine in cui i byte vanno considerati e il loro significato, entrambi fissati dal formato.',
      'L’ordine delle domande è vincolante. La terza va risolta prima delle ultime due, poiché un campo ricevuto in parte è privo di valore. Una trasmissione può interrompersi in qualunque punto, anche all’interno dei quattro byte della tensione. Un lettore che interpretasse i tre byte ricevuti, completandoli con il contenuto delle celle successive, fornirebbe al resto del programma una misura priva di fondamento.',
      'Questa unità tratta le prime tre domande. Le altre due, cioè la regola di lettura di ciascun campo, sono oggetto dell’unità successiva.'
    ]
  },
  esperimento: {
    faremo: [
      'Un lettore riceve il record del sensore «Nord», lungo quindici byte. Un controllo fissa quanti di tali byte giungono a destinazione: tutti, oppure soltanto i primi.',
      'Il cursore è seguito un campo alla volta. Per ogni campo il lettore confronta la larghezza richiesta con i byte rimasti, e si arresta al primo campo incompleto. Dopo il caso proposto, è istruttivo interrompere la trasmissione all’interno del nome.'
    ],
    vedrai: [
      ['memory', 'Il record', 'In alto: i quindici posti del record. Quelli rimasti vuoti sono spenti.'],
      ['puntatore', 'Il cursore', 'La barra sotto i byte, che indica il primo byte ancora da leggere.'],
      ['scudo', 'Il controllo', 'In basso: il campo richiesto, i byte rimasti e l’esito del confronto.']
    ]
  },
  lab: {
    titolo: 'Un record soggetto a interruzione',
    scena: { w: 860, h: 270 },
    atti: ['Il record ricevuto', 'I campi iniziali', 'Il nome', 'Le misure', 'L’esito'],
    nota: 'Il numero di passi dipende dai dati: la lettura si arresta al primo campo incompleto.',
    controlli: [
      { id: 'n', tipo: 'num', eti: 'Byte ricevuti', min: 0, max: 15, salti: [1], valore: 14 }
    ],
    previsione: {
      domanda: (p) => 'Il record completo è lungo 15 byte e ' + (p.n === 1 ? 'ne è giunto 1' : 'ne sono giunti ' + p.n) + '. Su quale byte si troverà il cursore al termine della lettura?',
      opzioni: (p) => Array.from(new Set([0, 4, 5, 9, 11, 15, p.n])).sort((a, b) => a - b)
    },
    confronto: (pred, esito, p) => 'La previsione indicava il cursore sul byte ' + pred + '. Si è fermato sul byte ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 15 ? 'I cinque campi erano completi, e il cursore ha quindi raggiunto la fine del record.' : 'Il cursore avanza soltanto di campi interi. Il campo che comincia al byte ' + esito + ' è incompleto' + (p.n > esito ? ', e i byte ricevuti oltre tale punto restano inutilizzati.' : '.')),
    costruisci(p) {
      const el = SL.el, T = SL.tlm, passi = [];
      const B = T.codifica('Nord', -35, 1.5), campi = T.campi(4), n = p.n, arr = B.slice(0, n);
      const esa = (da, a) => B.slice(da, a).map(T.esa).join(' ');
      let cur = 0, letti = 0;
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('t1', 40, 0, 'IL RECORD DEL SENSORE «NORD» · ARRIVATI ' + n + ' BYTE SU 15', 'mono')];
        T.striscia('m', arr, { y: 46, tot: 15, cur, att: o.att, err: o.err }).forEach((e) => els.push(e));
        T.nomi('f', 4, { y: 116, campo: o.campo, cur }).forEach((e) => els.push(e));
        els.push(el.cursore('cu', 40 + cur * 50, 104, 44));
        els.push(el.box('b1', 40, 170, 300, 76, 'campo richiesto', o.chiede || '·', o.box === 1 ? 'att' : '', { sim: 'tabella', riga: true, cls: 'stretta' }));
        els.push(el.box('b2', 360, 170, 190, 76, 'byte rimasti', String(n - cur), o.box === 2 ? 'att' : '', { sim: 'memory', riga: true }));
        els.push(el.box('b3', 570, 170, 260, 76, 'esito', o.esito || '·', o.esito ? (o.male ? 'err' : 'on') : '', { sim: 'scudo', riga: true, cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Cursore', 'byte ' + cur, 'a'], ['Byte rimasti', n - cur], ['Campi letti', letti, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const ATTO = { firma: 1, lung: 1, nome: 2, temp: 3, tens: 3 };
      const IL = { firma: 'La firma', lung: 'La lunghezza del nome', nome: 'Il nome', temp: 'La temperatura', tens: 'La tensione' };
      const DOVE = { firma: 'Il formato stabilisce che la firma è larga quattro byte.', lung: 'Il formato stabilisce che la lunghezza del nome occupa un byte.', nome: 'La larghezza del nome è il numero appena letto nel campo precedente.', temp: 'Il formato stabilisce che la temperatura è larga due byte.', tens: 'Il formato stabilisce che la tensione è larga quattro byte.' };
      const LETTO = {
        firma: 'I quattro byte sono ' + esa(0, 4) + ', cioè i caratteri «TLM1». Il formato è quello atteso.',
        lung: 'Il byte vale 04: il nome che segue è lungo quattro byte. Da questo momento il lettore conosce la posizione dei campi successivi. Il nome occupa i byte da 5 a 8, la temperatura comincia al byte 9 e la tensione al byte 11.',
        nome: 'I quattro byte sono ' + esa(5, 9) + ', cioè i caratteri «Nord».',
        temp: 'I due byte sono ' + esa(9, 11) + '. Sono stati ricevuti entrambi, e il campo possiede quindi un valore. La regola per ricavarlo è oggetto dell’unità successiva.',
        tens: 'I quattro byte sono ' + esa(11, 15) + '. Il campo è completo e il lettore può interpretarlo.'
      };
      const resto = (r) => (r === 0 ? 'byte esauriti' : r === 1 ? 'ne resta 1' : 'ne restano ' + r);

      P({}, 0, 'Ricezione del record', (n === 0 ? 'Il lettore ha ricevuto un messaggio vuoto.' : n === 1 ? 'Il lettore ha ricevuto 1 byte.' : 'Il lettore ha ricevuto ' + n + ' byte.') + ' Del formato TLM1 conosce l’ordine dei campi e le larghezze fisse. Il cursore è sul byte 0.' + (n < 15 ? ' Le celle spente sono i posti del record rimasti vuoti.' : ''));
      let fermo = false;
      for (const c of campi) {
        const rim = n - cur, ok = c.larghezza <= rim, fine = c.da + c.larghezza;
        const chiede = (c.id === 'lung' ? 'lunghezza' : c.nome) + ' · ' + c.larghezza + ' byte';
        const prossimo = campi[campi.indexOf(c) + 1];
        P({ box: 2, campo: c.id, chiede, esito: ok ? 'campo completo' : 'campo incompleto', male: !ok }, ATTO[c.id], IL[c.id] + ' chiede ' + c.larghezza + ' byte',
          'Il cursore è sul byte ' + cur + '. ' + DOVE[c.id] + ' Dopo il cursore ' + resto(rim) + ', quindi il campo ' + (ok ? 'può essere letto per intero.' : 'è incompleto.'),
          { calc: c.larghezza + ' ≤ ' + rim + ' ?', esito: [ok ? 'sì' : 'no', ok ? 'si' : 'no'] });
        if (!ok) {
          const manca = c.larghezza - rim;
          P({ campo: c.id, chiede, esito: 'campo incompleto', male: true, att: [c.da, n], err: [Math.max(n, c.da), fine] }, 4, 'Un lettore privo di controllo',
            'Un lettore privo di controllo leggerebbe ' + c.larghezza + ' byte a partire dal cursore. ' + (manca === 1 ? 'L’ultimo cadrebbe' : c.larghezza === manca ? 'Cadrebbero tutti' : 'Gli ultimi ' + manca + ' cadrebbero') + ' oltre la fine dei dati ricevuti, su celle di memoria che contengono altri dati. Il valore ottenuto sarebbe privo di fondamento.',
            { calc: 'byte mancanti: ' + c.larghezza + ' − ' + rim + ' = ' + manca });
          P({ campo: c.id, chiede, esito: 'lettura interrotta', male: true }, 4, 'Il lettore con controllo si arresta',
            'Il campo viene rifiutato e il cursore resta sul byte ' + cur + '. ' + (rim === 0 ? 'Oltre tale punto nulla è stato ricevuto.' : rim === 1 ? 'Il byte ricevuto oltre tale punto è insufficiente a formare il campo e resta inutilizzato.' : 'I ' + rim + ' byte ricevuti oltre tale punto sono insufficienti a formare il campo e restano inutilizzati.') + ' Il lettore segnala che il record è incompleto.',
            { calc: 'cursore finale = ' + cur });
          fermo = true;
          break;
        }
        const prima = cur;
        cur = fine; letti++;
        P({ campo: c.id, chiede, esito: 'campo letto', att: [c.da, fine] }, ATTO[c.id], IL[c.id] + (c.id === 'nome' ? ' è stato letto' : ' è stata letta'),
          LETTO[c.id] + ' Il cursore avanza di ' + c.larghezza + '.',
          Object.assign({ calc: 'cursore: ' + prima + ' + ' + c.larghezza + ' = ' + cur },
            c.id === 'lung' ? { chiedi: { d: 'Il nome dichiara 4 byte. Dopo il cursore ' + resto(n - cur) + '. Il lettore può leggere il nome?', o: ['Sì, i byte sono tutti disponibili', 'No, ne mancano'], g: n - cur >= 4 ? 0 : 1, no: n - cur >= 4 ? 'Ne occorrono 4 e ' + resto(n - cur) + ': bastano.' : 'Ne occorrono 4 e ' + resto(n - cur) + ': ne mancano ' + (4 - (n - cur)) + '.' } } : null,
            prossimo && c.id === 'temp' ? { chiedi: { d: 'Resta la tensione, larga 4 byte. Dopo il cursore ' + resto(n - cur) + '. Che cosa farà il lettore?', o: ['Leggerà la tensione', 'Si arresterà sul byte 11'], g: n - cur >= 4 ? 0 : 1, no: n - cur >= 4 ? 'Ne occorrono 4 e ' + resto(n - cur) + ': il campo è completo.' : 'Ne occorrono 4 e ' + resto(n - cur) + ': il campo è incompleto e il cursore resta invariato.' } } : null));
      }
      if (!fermo) P({ esito: 'record completo' }, 4, 'Il record è completo', 'Il cursore è sul byte 15, che coincide con il numero di byte ricevuti. Il lettore ha consumato cinque campi interi e dopo l’ultimo nessun byte è residuo.', { calc: 'cursore finale = 15 = byte ricevuti' });
      return { passi, esito: cur };
    }
  },
  bilancio: {
    regola: [
      'Un record si legge un campo alla volta, nell’ordine fissato dal formato. Per ogni campo si stabilisce dove comincia, quanto è largo e se i byte necessari sono stati ricevuti. L’interpretazione è l’ultimo passaggio.',
      'Il cursore avanza di campi interi. Al primo campo incompleto la lettura si arresta, e il cursore resta all’inizio di tale campo.'
    ],
    errori: [
      ['Interpretare un campo ricevuto in parte.', 'Tre byte su quattro non formano una tensione. I byte mancanti sarebbero prelevati da celle estranee al record.'],
      ['Calcolare le posizioni prima di leggere la lunghezza del nome.', 'La temperatura e la tensione cominciano dopo il nome, e la loro posizione è quindi nota soltanto dopo la lettura del byte di lunghezza.'],
      ['Arrestare il cursore sull’ultimo byte ricevuto.', 'Il cursore segna l’inizio del primo campo incompleto. I byte ricevuti oltre tale punto appartengono a un campo che resta illeggibile.']
    ],
    saFare: ['Elencare i campi del record TLM1 e la larghezza di ciascuno.', 'Calcolare il byte da cui comincia un campo, dato il nome del sensore.', 'Stabilire su quale campo si arresta la lettura di un record interrotto.'],
    esercizi: [
      { d: 'Un sensore TLM1 ha un nome di 6 byte. Da quale byte comincia il campo della tensione?', segnaposto: 'Il numero di un byte', giuste: ['13', 'tredici', 'byte13'],
        ok: 'La firma occupa 4 byte, la lunghezza 1, il nome 6 e la temperatura 2: complessivamente 13 byte precedono la tensione.',
        diagnosi: [
          { se: ['11', 'undici'], msg: 'Undici vale per un nome di quattro byte. In questo caso il nome ne occupa sei.' },
          { se: ['12', 'dodici'], msg: 'Sono stati contati dodici byte prima della tensione. Va verificata l’inclusione del byte che dichiara la lunghezza del nome.' },
          { se: ['17', 'diciassette'], msg: 'Diciassette è la lunghezza dell’intero record. La tensione comincia quattro byte prima della fine.' },
          { se: ['14', 'quattordici'], msg: 'I posti si contano da zero: se tredici byte precedono la tensione, il suo primo byte è il numero 13.' }
        ],
        altro: 'Il numero è diverso. Si sommino le larghezze dei quattro campi che precedono la tensione.',
        indizi: ['La tensione è l’ultimo campo. La precedono firma, lunghezza, nome e temperatura.', 'Le larghezze dei quattro campi sono 4, 1, 6 e 2.', 'La somma 4 + 1 + 6 + 2 dà il numero del primo byte della tensione.'],
        svolgimento: ['Firma: byte da 0 a 3.', 'Lunghezza del nome: byte 4.', 'Nome: byte da 5 a 10.', 'Temperatura: byte 11 e 12.', 'La tensione comincia al byte 13.'] },
      { d: 'Di un record TLM1 con un nome di 4 byte sono arrivati i primi 10 byte. Qual è il primo campo incompleto?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il nome', fb: 'Il nome occupa i byte da 5 a 8, tutti ricevuti.' },
        { t: 'La temperatura', ok: true, fb: 'La temperatura occupa i byte 9 e 10. Del campo è stato ricevuto soltanto il byte 9, e il cursore si arresta quindi su di esso.' },
        { t: 'La tensione', fb: 'La tensione comincia al byte 11. Essa è preceduta da un campo interrotto.' }] }
    ]
  }
});
