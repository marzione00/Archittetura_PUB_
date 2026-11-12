'use strict';
SL.registra('1.2.4', {
  titolo: 'Leggere i byte e dichiararne il significato',
  obiettivo: 'Alla fine saprai leggere la stessa fila di byte come numeri e come testo, e spiegare perché occorre sapere in anticipo quale lettura è quella giusta.',
  concetti: [['byte', 'Byte'], ['char', 'Carattere'], ['hex', 'Esadecimale']],
  filigrana: ['char', 'byte', 'file'],
  richiami: {
    carte: [
      { sim: 'byte', da: 'Dall’unità 1.2.1', t: 'Il byte', d: 'Otto bit affiancati, con 256 combinazioni. Il loro significato dipende da un accordo.' },
      { sim: 'hex', da: 'Dall’unità 1.2.2', t: 'Leggere un byte', d: 'Il valore di un byte è la somma dei pesi delle posizioni che contengono 1. In esadecimale si scrive con due cifre.' },
      { sim: 'terminale', da: 'Dall’unità 1.1.1', t: 'I caratteri hanno un codice', d: 'Quando un programma stampa un testo, ogni carattere viaggia sotto forma di numero: il suo codice.' }
    ],
    domanda: { d: 'Prima di proseguire: quanto vale in base dieci il byte 0x41?', o: [
      { t: '41', fb: 'Hai letto le due cifre come se fossero in base dieci. In esadecimale la prima cifra pesa 16: 4 × 16 + 1.' },
      { t: '65', ok: true, fb: 'La prima cifra pesa 16 e la seconda 1: 4 × 16 + 1 = 65.' },
      { t: '5', fb: 'Hai sommato le due cifre. La prima pesa 16, quindi il conto è 4 × 16 + 1.' }
    ] }
  },
  idea: {
    titolo: 'I byte non portano etichette',
    termini: ['codifica', 'ascii', 'tipo'],
    testo: [
      'Apri una cella di memoria e ci trovi un byte, per esempio quello che in esadecimale si scrive `0x41`. Lo stesso byte può essere il numero 65, la lettera A maiuscola, una sfumatura di grigio in un’immagine o un pezzo di un numero più grande. Dentro il byte non c’è scritto quale lettura sia quella giusta.',
      'A decidere è una convenzione stabilita fuori dal byte, che si chiama [[codifica]]: un accordo che fa corrispondere un significato a ogni combinazione di bit. Per i testi la codifica più antica ancora in uso è la tabella [[ascii|ASCII]], che assegna un numero da 0 a 127 a lettere, cifre, segni di punteggiatura e ad alcuni comandi. In ASCII la A maiuscola ha codice 65, la a minuscola ha codice 97, il carattere «0» ha codice 48 e lo spazio ha codice 32.',
      { fig: 'celle', titolo: 'Quattro righe della tabella ASCII', nota: 'Le maiuscole occupano i codici da 65 a 90, le minuscole da 97 a 122, le cifre da 48 a 57.', celle: [
        { so: 'codice 32', v: '␣', gi: 'spazio' }, { so: 'codice 48', v: '0', st: 'amb', gi: 'cifra' }, { so: 'codice 65', v: 'A', st: 'on', gi: 'maiuscola' }, { so: 'codice 97', v: 'a', st: 'on', gi: 'minuscola' }] },
      'Il carattere «0» merita attenzione. Quando compare in un testo ha codice 48, mentre il numero zero è un byte con tutti i bit spenti. Se digiti 7 sulla tastiera, il programma riceve il codice 55 e deve sottrarre 48 per ottenere il numero sette con cui fare i conti.',
      'Anche lo spazio è un carattere come gli altri. Sullo schermo non lascia segni, eppure in memoria occupa un byte come ogni lettera, con il suo codice 32. Lo stesso vale per il carattere di fine riga, che ha codice 10 e ordina di andare a capo.',
      'Per questo ogni dato viaggia sempre insieme a una dichiarazione, esplicita o sottintesa, di come va letto. Un programma dichiara il [[tipo]] dei suoi dati; un file dichiara il proprio formato, spesso con l’estensione del nome o con i primi byte del contenuto. Quando la dichiarazione è sbagliata i byte restano gli stessi, e il significato che ne esce è un altro.'
    ]
  },
  esperimento: {
    faremo: [
      'Apriremo una fila di celle, una alla volta. Di ogni byte faremo due letture: prima come numero, poi come carattere secondo la tabella ASCII.',
      'Nella fila c’è anche una cifra scritta come carattere. Quando la incontreremo, calcoleremo quale numero bisogna sottrarre al suo codice per ottenere il valore della cifra.'
    ],
    vedrai: [
      ['memory', 'La fila di celle', 'In alto, con il contenuto scritto in esadecimale.'],
      ['hex', 'La lettura come numero', 'Sotto ogni cella, il valore del byte in base dieci.'],
      ['char', 'La lettura come carattere', 'In basso, il carattere che la tabella ASCII assegna a quel valore.']
    ]
  },
  lab: {
    titolo: 'La stessa fila, due letture',
    scena: { w: 860, h: 330 },
    atti: ['Preparazione', 'Le due letture', 'La cifra scritta come carattere', 'Bilancio'],
    nota: 'I passi sono tre per ogni byte della fila: apertura della cella, lettura come numero, lettura come carattere.',
    controlli: [{ id: 'testo', tipo: 'scelta', eti: 'Fila di byte', opzioni: [['Ciao 7', '43 69 61 6F 20 37'], ['A0 b', '41 30 20 62'], ['Tre 3', '54 72 65 20 33']], valore: 'Ciao 7' }],
    previsione: {
      domanda: (p) => { const c = p.testo.match(/\d/)[0]; return 'Nella fila c’è il carattere «' + c + '». Letto come numero, quanto vale il byte che lo contiene?'; },
      opzioni: (p) => { const d = Number(p.testo.match(/\d/)[0]); return Array.from(new Set([d, 30 + d, 48, 48 + d])).sort((a, b) => a - b); }
    },
    confronto: (pred, esito, p) => { const c = p.testo.match(/\d/)[0]; return 'Avevi previsto ' + pred + '. Il byte che contiene il carattere «' + c + '» vale ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il carattere di una cifra e il valore della cifra sono cose diverse: fra i due c’è una differenza fissa di 48.'); },
    costruisci(p) {
      const testo = p.testo, n = testo.length, el = SL.el, passi = [];
      const cod = Array.from(testo).map((c) => c.charCodeAt(0));
      const H = (v) => (v < 16 ? '0' : '') + v.toString(16).toUpperCase();
      const mostra = (c) => (c === ' ' ? '␣' : c);
      const classe = (v) => (v === 32 ? 3 : v >= 48 && v <= 57 ? 2 : v >= 65 && v <= 90 ? 0 : 1);
      const nomeClasse = ['una lettera maiuscola', 'una lettera minuscola', 'una cifra', 'lo spazio'];
      const aperte = cod.map(() => false), numeri = cod.map(() => false), lettere = cod.map(() => false);
      const passoX = Math.min(140, Math.floor(800 / n)), X = (k) => 30 + Math.floor((800 - passoX * n) / 2) + k * passoX;
      const quadro = (att, extra) => {
        const els = [el.nota('r1', 30, 0, 'CELLE · contenuto in esadecimale', 'mono'), el.nota('r2', 30, 132, 'COME NUMERO', 'mono'), el.nota('r3', 30, 222, 'COME CARATTERE', 'mono')];
        cod.forEach((v, k) => {
          els.push(el.cella('h' + k, X(k), 46, 96, 64, aperte[k] ? H(v) : '· ·', k === att ? 'att' : aperte[k] ? 'zero' : '', { so: 'cella ' + k }));
          els.push(el.cella('d' + k, X(k), 156, 96, 50, numeri[k] ? String(v) : '', numeri[k] ? (k === att ? 'att' : 'zero') : 'off', { piccola: true }));
          els.push(el.cella('c' + k, X(k), 246, 96, 64, lettere[k] ? mostra(testo[k]) : '', lettere[k] ? 'on' : 'off'));
        });
        if (extra) els.push(el.nota('ex', 30, 312, extra, 'mono', 'att'));
        return els;
      };
      const hud = (k) => [['Byte in esame', k == null ? '·' : '0x' + H(cod[k]), 'a'], ['Come numero', k == null || !numeri[k] ? '·' : cod[k]], ['Come carattere', k == null || !lettere[k] ? '·' : (testo[k] === ' ' ? 'spazio' : testo[k]), 'c']];
      passi.push({ atto: 0, titolo: 'Una fila di celle chiuse', hud: hud(null), els: quadro(-1),
        testo: 'La fila ha ' + n + ' celle, ognuna con un byte. Non sappiamo ancora che cosa contengano né come vadano lette.' });
      cod.forEach((v, k) => {
        aperte[k] = true;
        passi.push({ atto: 1, titolo: 'Apriamo la cella ' + k, calc: '0x' + H(v), hud: hud(k), els: quadro(k),
          testo: 'Nella cella ' + k + ' c’è il byte 0x' + H(v) + '. Per ora è soltanto una combinazione di otto bit.' });
        numeri[k] = true;
        const a = parseInt(H(v)[0], 16), b = parseInt(H(v)[1], 16);
        passi.push({ atto: 1, titolo: 'Lettura come numero', calc: a + ' × 16 + ' + b + ' = ' + v, hud: hud(k), els: quadro(k),
          testo: 'Letto come numero, il byte vale ' + v + ': la prima cifra esadecimale pesa 16 e la seconda pesa 1.',
          chiedi: { d: 'Nella tabella ASCII, il codice ' + v + ' corrisponde a…', o: ['una lettera maiuscola (da 65 a 90)', 'una lettera minuscola (da 97 a 122)', 'una cifra (da 48 a 57)', 'lo spazio (32)'], g: classe(v),
            no: 'Confronta ' + v + ' con gli intervalli: 32 è lo spazio, da 48 a 57 stanno le cifre, da 65 a 90 le maiuscole, da 97 a 122 le minuscole.' } });
        lettere[k] = true;
        passi.push({ atto: 1, titolo: 'Lettura come carattere', calc: v + ' → ' + (testo[k] === ' ' ? 'spazio' : '«' + testo[k] + '»'), hud: hud(k), els: quadro(k),
          testo: 'Nella tabella ASCII il codice ' + v + ' è ' + nomeClasse[classe(v)] + (testo[k] === ' ' ? '. Sullo schermo non lascia alcun segno, eppure occupa una cella come gli altri caratteri.' : ': «' + testo[k] + '».') });
      });
      const kd = testo.search(/\d/), d = Number(testo[kd]);
      passi.push({ atto: 2, titolo: 'Il carattere «' + d + '» e il numero ' + d, calc: cod[kd] + ' − 48 = ' + d, hud: hud(kd), els: quadro(kd, 'Codice del carattere «' + d + '»: ' + cod[kd] + ' · valore della cifra: ' + d),
        testo: 'La cella ' + kd + ' contiene il carattere «' + d + '», il cui codice è ' + cod[kd] + '. Per fare conti con la cifra occorre sottrarre 48, il codice del carattere «0»: si ottiene il numero ' + d + '.' });
      passi.push({ atto: 3, titolo: 'Due letture della stessa fila', calc: '«' + testo + '»', hud: hud(null), els: quadro(-1, 'Come numeri: ' + cod.join(', ')),
        testo: 'Gli stessi ' + n + ' byte danno la fila di numeri ' + cod.join(', ') + ' oppure il testo «' + testo + '». Quale delle due letture valga lo decide chi usa i byte, con la codifica che dichiara.' });
      return { passi, esito: cod[kd] };
    }
  },
  bilancio: {
    regola: [
      'Un byte è una combinazione di otto bit senza etichetta. Il suo significato viene da una codifica decisa all’esterno: come numero, come carattere, come parte di un dato più grande.',
      'Nella tabella ASCII ogni carattere ha un codice. Il carattere di una cifra e il valore della cifra differiscono di 48, e anche lo spazio occupa un byte.'
    ],
    errori: [
      ['Trattare «7» come 7.', 'Il carattere «7» ha codice 55. Per ottenere il numero sette occorre sottrarre 48.'],
      ['Dimenticare gli spazi.', 'Lo spazio ha codice 32 e occupa una cella, anche se sullo schermo non si vede.'],
      ['Cercare il significato dentro il byte.', 'Il byte 0x41 è 65 oppure «A» secondo la codifica dichiarata da chi lo usa.']
    ],
    saFare: ['Leggo un byte come numero e come carattere ASCII.', 'Passo dal carattere di una cifra al suo valore.', 'Spiego perché un dato ha bisogno di una dichiarazione di tipo.'],
    esercizi: [
      { d: 'Tre celle contengono, in esadecimale, i byte 48 69 21. Letti come testo ASCII, quali caratteri formano?', segnaposto: 'Tre caratteri', giuste: ['hi!'],
        ok: 'I valori sono 72, 105 e 33: una H maiuscola, una i minuscola e il punto esclamativo.',
        diagnosi: [
          { se: ['7210533', '72,105,33', '72.105.33', '7210533'], msg: 'Hai calcolato correttamente i tre valori in base dieci. Manca l’ultimo passaggio: cercare ciascun valore nella tabella ASCII.' },
          { se: ['hi'], msg: 'Le prime due lettere sono giuste. Il terzo byte, 0x21, vale 33: è un segno di punteggiatura.' },
          { se: ['48i!', '0i!'], msg: 'Il byte 0x48 non è il carattere «0», che ha codice 48 in base dieci. In esadecimale 48 vale 4 × 16 + 8 = 72.' }
        ],
        altro: 'I caratteri sono diversi. Converti ogni byte in base dieci, poi usa gli intervalli della tabella: maiuscole da 65, minuscole da 97.',
        indizi: ['Il primo byte vale 4 × 16 + 8 = 72. La A maiuscola ha codice 65.', 'Il secondo byte vale 6 × 16 + 9 = 105. La a minuscola ha codice 97.', 'Il terzo byte vale 33, il codice del punto esclamativo.'],
        svolgimento: ['0x48 = 72: è la maiuscola che dista 7 posti da A, cioè H.', '0x69 = 105: è la minuscola che dista 8 posti da a, cioè i.', '0x21 = 33: è il punto esclamativo. Il testo è Hi!'] },
      { d: 'Un programma riceve dalla tastiera il carattere «9» e, senza convertirlo, gli somma il numero 1. Quale valore ottiene?', guida: 'Scegli il valore.',
        o: [
          { t: '10', fb: 'Sarebbe il risultato dopo la conversione. Senza sottrarre 48, il programma lavora sul codice del carattere.' },
          { t: '58', ok: true, fb: 'Il carattere «9» ha codice 57. Sommando 1 al codice si ottiene 58.' },
          { t: '91', fb: 'Hai accostato le due cifre. La somma lavora sui valori: il codice 57 più 1.' }
        ] }
    ],
    sfida: ['lez02_05_utf8_bytes_and_ascii', 'Byte occupati da ASCII e UTF-8']
  }
});
