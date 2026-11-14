'use strict';
SL.registra('1.3.2', {
  titolo: 'Unicode, punti di codice e UTF-8',
  obiettivo: 'Obiettivo: determinare dal primo byte la lunghezza in byte di un carattere UTF-8, e ricostruire il numero del carattere a partire dai bit trasportati dai byte.',
  concetti: [['char', 'Carattere'], ['tabella', 'Punto di codice'], ['byte', 'Byte']],
  filigrana: ['char', 'tabella', 'bit'],
  richiami: {
    carte: [
      { sim: 'char', da: 'Dall’unità 1.2.4', t: 'La tabella ASCII', d: 'Assegna un numero da 0 a 127 a lettere, cifre e segni. Ogni carattere occupa un byte.' },
      { sim: 'bit', da: 'Dall’unità 1.2.2', t: 'Leggere un numero binario', d: 'Il valore è la somma dei pesi delle posizioni che contengono 1. Due cifre esadecimali rappresentano otto bit.' },
      { sim: 'terminale', da: 'Dall’unità 1.1.1', t: 'Una questione rimasta aperta', d: 'Nella riga stampata da hello, una lettera accentata come è occupava due codici. Questa unità ne fornisce la ragione.' }
    ],
    domanda: { d: 'Prima di proseguire: quanti caratteri diversi può distinguere la tabella ASCII?', o: [
      { t: '128', ok: true, fb: 'I codici ASCII vanno da 0 a 127, e sono quindi 128.' },
      { t: '256', fb: 'Un byte offre 256 combinazioni, e la tabella ASCII ne impiega soltanto la prima metà.' },
      { t: '26', fb: 'Le lettere dell’alfabeto inglese sono 26, e la tabella contiene anche maiuscole, cifre, segni e comandi.' }
    ] }
  },
  idea: {
    titolo: 'Un’unica tabella per tutte le scritture',
    termini: ['unicode', 'punto di codice', 'utf-8', 'byte di continuazione'],
    testo: [
      'La tabella ASCII dispone di 128 codici. Essi sono sufficienti per l’inglese, ed escludono la è dell’italiano, la ñ dello spagnolo, l’alfabeto greco, gli ideogrammi cinesi e il simbolo dell’euro. Per decenni ogni paese ha adottato una propria tabella estesa, con la conseguenza che il medesimo byte indicava lettere diverse da un calcolatore all’altro. Un testo trasmesso all’estero risultava spesso illeggibile.',
      'La soluzione è consistita in una tabella unica, denominata [[unicode|Unicode]], che assegna un numero a ogni carattere di ogni scrittura. Tale numero prende il nome di [[punto di codice]] e si scrive con il prefisso U+ seguito da cifre esadecimali. La A maiuscola è U+0041, la è è U+00E8, il simbolo € è U+20AC. I primi 128 punti di codice coincidono con la tabella ASCII, sicché i testi preesistenti restano validi.',
      'Un punto di codice è un numero, e resta da stabilire come scriverlo in byte. Poiché i punti di codice superano il milione, un solo byte è insufficiente. L’impiego costante di quattro byte quadruplicherebbe lo spazio occupato dai testi in inglese. La codifica [[utf-8|UTF-8]] adotta una soluzione intermedia: impiega da uno a quattro byte, secondo la grandezza del numero.',
      'Il meccanismo risiede nei primi bit di ogni byte, che svolgono la funzione di etichetta. Un byte che comincia con 0 è un carattere completo, con sette bit a disposizione: si tratta dei codici ASCII. Un byte che comincia con 110 apre un carattere di due byte, con 1110 uno di tre, con 11110 uno di quattro. I byte successivi al primo cominciano tutti con 10 e prendono il nome di [[byte di continuazione]]. Ciascuno trasporta sei bit del punto di codice.',
      { fig: 'scena', w: 700, h: 214, titolo: 'Le quattro forme di un carattere UTF-8', nota: 'Le x sono i bit che trasportano il punto di codice. I bit scritti per esteso sono le etichette.', els: [
        SL.el.box('a1', 10, 6, 210, 44, null, 'fino a U+007F', '', { cls: 'stretta' }), SL.el.box('b1', 250, 6, 440, 44, null, '0xxxxxxx', 'on', { cls: 'stretta' }),
        SL.el.box('a2', 10, 58, 210, 44, null, 'fino a U+07FF', '', { cls: 'stretta' }), SL.el.box('b2', 250, 58, 440, 44, null, '110xxxxx 10xxxxxx', 'on', { cls: 'stretta' }),
        SL.el.box('a3', 10, 110, 210, 44, null, 'fino a U+FFFF', '', { cls: 'stretta' }), SL.el.box('b3', 250, 110, 440, 44, null, '1110xxxx 10xxxxxx 10xxxxxx', 'on', { cls: 'stretta' }),
        SL.el.box('a4', 10, 162, 210, 44, null, 'fino a U+10FFFF', '', { cls: 'stretta' }), SL.el.box('b4', 250, 162, 440, 44, null, '11110xxx 10xxxxxx 10xxxxxx 10xxxxxx', 'on', { cls: 'stretta' })] },
      'La rilettura di un carattere procede in tre fasi. Dall’etichetta del primo byte si ricava il numero dei byte necessari. Si rimuovono poi le etichette da tutti i byte e si accostano i bit restanti. La fila così ottenuta, letta come numero binario, è il punto di codice.',
      'La lettera è, per esempio, occupa i byte `0xC3` e `0xA8`. In binario sono 11000011 e 10101000. Rimosse le etichette 110 e 10 restano 00011 e 101000, che accostati danno 00011101000, cioè 232, in esadecimale E8. Il punto di codice è U+00E8.',
      'Ne discende una conseguenza pratica. In un testo UTF-8 il numero dei caratteri e il numero dei byte possono differire, e un programma che conti i byte per determinare il numero delle lettere commette un errore alla prima lettera accentata.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento propone quattro caratteri di lunghezza diversa. A partire dai byte del carattere scelto, nella forma in cui si trovano in memoria, si ricostruisce il punto di codice.',
      'In ogni byte l’etichetta è separata dai bit utili. I bit utili confluiscono in una fila comune, che al termine è letta come un numero.'
    ],
    vedrai: [
      ['byte', 'I byte in memoria', 'In alto, in esadecimale. Sotto ciascuno compaiono i relativi otto bit.'],
      ['bit', 'La fila dei bit utili', 'Al centro. Riceve i bit di ogni byte, privati dell’etichetta.'],
      ['char', 'Il risultato', 'In basso: il punto di codice e il carattere a cui corrisponde.']
    ]
  },
  lab: {
    titolo: 'Ricostruzione di un carattere dai suoi byte',
    scena: { w: 860, h: 356 },
    atti: ['I byte in memoria', 'L’etichetta del primo byte', 'I bit utili', 'Il punto di codice'],
    nota: 'Il numero di passi dipende dal carattere: ogni byte di continuazione ne aggiunge due.',
    controlli: [{ id: 'ch', tipo: 'scelta', eti: 'Carattere', opzioni: [['A', 'A'], ['è', 'è'], ['€', '€'], ['f', 'volto']], valore: 'è' }],
    previsione: {
      domanda: (p) => { const c = { A: [0x41], 'è': [0xC3, 0xA8], '€': [0xE2, 0x82, 0xAC], f: [0xF0, 0x9F, 0x98, 0x80] }[p.ch]; return 'In memoria il carattere occupa ' + (c.length === 1 ? 'il byte ' : 'i byte ') + c.map((b) => '0x' + b.toString(16).toUpperCase()).join(' ') + '. Quanti bit del punto di codice trasportano, una volta rimosse le etichette?'; },
      opzioni: (p) => { const n = { A: 1, 'è': 2, '€': 3, f: 4 }[p.ch]; return Array.from(new Set([7, 11, 16, 21, 8 * n])).sort((a, b) => a - b); }
    },
    confronto: (pred, esito, p) => { const n = { A: 1, 'è': 2, '€': 3, f: 4 }[p.ch]; return 'La previsione indicava ' + pred + ' bit utili. Sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 8 * n ? 'Il valore indicato è il numero totale dei bit. Una parte è occupata dalle etichette, estranee al punto di codice.' : 'Il primo byte di un carattere di ' + n + ' byte trasporta ' + [7, 5, 4, 3][n - 1] + ' bit utili' + (n > 1 ? ', e ogni byte di continuazione ne trasporta 6.' : '.')); },
    costruisci(p) {
      const el = SL.el, passi = [];
      const DATI = { A: [0x41, 'A'], 'è': [0xE8, 'è'], '€': [0x20AC, '€'], f: [0x1F600, '😀'] }[p.ch];
      const cp = DATI[0], car = DATI[1];
      const n = cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;
      const utili = [7, 11, 16, 21][n - 1];
      const fila = cp.toString(2).padStart(utili, '0');
      // I byte si ricavano dal punto di codice, così la scena non può contraddire la regola.
      const primi = [7, 5, 4, 3][n - 1], bytes = [];
      bytes.push(parseInt(['0', '110', '1110', '11110'][n - 1] + fila.slice(0, primi), 2));
      for (let k = 1; k < n; k++) bytes.push(parseInt('10' + fila.slice(primi + 6 * (k - 1), primi + 6 * k), 2));
      const H = (b) => '0x' + b.toString(16).toUpperCase().padStart(2, '0');
      const B = (b) => b.toString(2).padStart(8, '0');
      const pref = (k) => (k === 0 ? [1, 3, 4, 5][n - 1] : 2);
      const mostrati = bytes.map(() => false), separati = bytes.map(() => false);
      let raccolti = 0, letto = false;
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('t1', 40, 0, 'I BYTE IN MEMORIA', 'mono'), el.nota('t2', 40, 176, 'I BIT UTILI, IN FILA', 'mono')];
        bytes.forEach((b, k) => {
          els.push(el.cella('h' + k, 40 + k * 200, 44, 168, 46, H(b), o.byte === k ? 'att' : separati[k] ? 'on' : '', { piccola: true, so: 'byte ' + k }));
          if (mostrati[k]) B(b).split('').forEach((c, j) => els.push(el.cella('b' + k + '-' + j, 40 + k * 200 + j * 21, 106, 19, 30, c, j < pref(k) ? (separati[k] || (o.etichetta === k) ? (o.etichetta === k ? 'att' : 'off') : '') : separati[k] ? 'on' : '', { cls: 'minuta' })));
        });
        for (let j = 0; j < raccolti; j++) els.push(el.cella('u' + j, 40 + j * 25, 206, 23, 34, fila[j], o.nuovi && j >= o.nuovi ? 'att' : 'on', { cls: 'minuta' }));
        if (!raccolti) els.push(el.nota('vu', 40, 214, 'ancora vuota', 'mono'));
        if (o.numero) els.push(el.box('pc', 40, 272, 400, 72, 'punto di codice', 'U+' + cp.toString(16).toUpperCase().padStart(4, '0') + ' = ' + cp, 'att', { sim: 'tabella', riga: true }));
        if (o.car) els.push(el.box('ca', 480, 272, 220, 72, 'carattere', car, 'on', { sim: 'char', riga: true }));
        return els;
      };
      const hud = (k) => [['Byte del carattere', letto ? n : '·', 'a'], ['Bit utili raccolti', raccolti, 'c'], ['Byte in esame', k == null ? '·' : k]];
      const P = (o, atto, titolo, testo, extra, k) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(k), els: quadro(o) }, extra));

      P({}, 0, 'I byte nella forma originale', 'In memoria si trovano ' + (n === 1 ? 'un byte' : n + ' byte consecutivi') + ': ' + bytes.map(H).join(', ') + '. Il termine del carattere è indicato dal primo byte.');
      mostrati[0] = true;
      P({ byte: 0 }, 1, 'Il primo byte in binario', 'Si scrive ' + H(bytes[0]) + ' con otto cifre binarie: ' + B(bytes[0]) + '. I primi bit sono l’etichetta, che va letta da sinistra fino al primo 0 compreso.',
        { calc: H(bytes[0]) + ' = ' + B(bytes[0]), chiedi: { d: 'Il primo byte comincia con ' + B(bytes[0]).slice(0, pref(0)) + '. Quanti byte occupa il carattere?', o: ['1', '2', '3', '4'], g: n - 1, no: 'Un byte che comincia con 0 è un carattere completo. In caso contrario il numero degli 1 iniziali indica quanti byte occorrono: 110 ne annuncia due, 1110 tre, 11110 quattro.' } }, 0);
      letto = true;
      P({ byte: 0, etichetta: 0 }, 1, 'L’etichetta annuncia ' + (n === 1 ? 'un byte solo' : n + ' byte'), n === 1
        ? 'Il byte comincia con 0, e il carattere è quindi completo. Si tratta di uno dei 128 caratteri ASCII, e i sette bit successivi allo 0 ne costituiscono il codice.'
        : 'L’etichetta è ' + B(bytes[0]).slice(0, pref(0)) + ': ' + n + ' bit a 1 seguiti da uno 0. Il carattere occupa ' + n + ' byte, questo e ' + (n === 2 ? 'il successivo' : 'i ' + (n - 1) + ' successivi') + '.', { calc: 'byte del carattere = ' + n }, 0);
      bytes.forEach((b, k) => {
        if (k > 0) {
          mostrati[k] = true;
          P({ byte: k, etichetta: k }, 2, 'Il byte ' + k + ' in binario', H(b) + ' in binario è ' + B(b) + '. Comincia con 10, l’etichetta di ogni byte di continuazione, a conferma che il carattere prosegue in questo byte.', { calc: H(b) + ' = ' + B(b) }, k);
        }
        separati[k] = true;
        const quanti = 8 - pref(k), da = raccolti; raccolti += quanti;
        P({ byte: k, nuovi: da || -1 }, 2, k === 0 ? 'I bit utili del primo byte' : 'I bit utili del byte ' + k, (k === 0
          ? 'Rimossa l’etichetta, il primo byte fornisce ' + quanti + ' bit utili: ' + B(b).slice(pref(k)) + '. Essi confluiscono nella fila.'
          : 'Rimossa l’etichetta restano 6 bit utili, ' + B(b).slice(2) + ', che si accodano ai precedenti.'),
          Object.assign({ calc: 'bit utili: ' + da + ' + ' + quanti + ' = ' + raccolti }, k === 0 && n > 1 ? { chiedi: { d: 'I byte successivi al primo hanno tutti la medesima etichetta. Quale?', o: ['10', '11', '01'], g: 0, no: 'I byte di continuazione cominciano con 10. In tal modo nessuno di essi può essere scambiato per l’inizio di un carattere.' } } : {}), k);
      });
      const esa = cp.toString(16).toUpperCase();
      P({}, 3, 'La fila letta come numero', (utili === 11 ? 'Gli 11' : 'I ' + utili) + ' bit in fila vanno letti come un solo numero binario, con i pesi dell’unità 1.2.2. Il loro valore è ' + cp + '.', { calc: fila + ' = ' + cp });
      P({ numero: true }, 3, 'Il punto di codice', 'Il medesimo numero, in esadecimale, si scrive ' + esa + '. Con il prefisso U+ e almeno quattro cifre assume la forma U+' + esa.padStart(4, '0') + ', con la quale si indicano i punti di codice.', { calc: cp + ' = 0x' + esa });
      P({ numero: true, car: true }, 3, 'Il carattere', 'Nella tabella Unicode il punto di codice U+' + esa.padStart(4, '0') + ' corrisponde ' + (p.ch === 'f' ? 'al simbolo di un volto sorridente' : 'al carattere «' + car + '»') + '. ' + (n === 1 ? 'Un byte, sette bit utili.' : n + ' byte, ' + utili + ' bit utili: ' + primi + ' dal primo e 6 da ciascun byte di continuazione.'), { calc: primi + (n > 1 ? ' + 6 × ' + (n - 1) : '') + ' = ' + utili + ' bit utili' });
      return { passi, esito: utili };
    }
  },
  bilancio: {
    regola: [
      'Unicode assegna a ogni carattere un numero, il punto di codice. UTF-8 scrive tale numero impiegando da uno a quattro byte.',
      'Il primo byte annuncia la lunghezza: 0 per un byte, 110 per due, 1110 per tre, 11110 per quattro. I byte di continuazione cominciano con 10 e trasportano sei bit ciascuno.'
    ],
    errori: [
      ['Contare un carattere per byte.', 'Le lettere accentate occupano due byte, il simbolo € ne occupa tre. Caratteri e byte vanno contati separatamente.'],
      ['Leggere anche le etichette.', 'I bit iniziali di ogni byte servono a riconoscerne il ruolo e sono esclusi dal punto di codice.'],
      ['Confondere Unicode e UTF-8.', 'Unicode è la tabella che numera i caratteri. UTF-8 è uno dei modi di scrivere tali numeri in byte.']
    ],
    saFare: ['Distinguere il punto di codice dai byte che lo trasportano.', 'Ricavare dal primo byte la lunghezza di un carattere UTF-8.', 'Ricostruire un punto di codice rimuovendo le etichette e accostando i bit.'],
    esercizi: [
      { d: 'Una sequenza UTF-8 comincia con il byte `0xE2`. Quanti byte occupa complessivamente il carattere?', segnaposto: 'Un numero di byte', giuste: ['3', 'tre'],
        ok: 'In binario 0xE2 è 11100010. L’etichetta 1110 annuncia tre byte.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Due byte sono annunciati dall’etichetta 110. Si scriva 0xE2 in binario e si contino gli 1 iniziali.' },
          { se: ['4', 'quattro'], msg: 'Quattro byte richiedono l’etichetta 11110. In 0xE2 gli 1 iniziali sono tre.' },
          { se: ['1', 'uno'], msg: 'Un carattere di un byte comincia con 0. La cifra esadecimale E comincia con 1.' }
        ],
        altro: 'Il numero è diverso. Si scriva la cifra esadecimale E con quattro bit e si osservi quanti 1 precedono il primo 0.',
        indizi: ['La cifra esadecimale E vale 14, cioè 1110.', 'Il byte comincia quindi con tre 1 seguiti da uno 0.', 'Il numero di 1 iniziali è il numero di byte del carattere.'],
        svolgimento: ['0xE2 in binario è 11100010.', 'L’etichetta è 1110: tre 1 seguiti da uno 0.', 'Il carattere occupa 3 byte.'] },
      { d: 'La parola «perché» ha sei lettere. Quanti byte occupa in UTF-8?', guida: 'Si scelga la risposta.', o: [
        { t: '6', fb: 'Sei byte basterebbero se tutte le lettere fossero ASCII. La é accentata ne occupa due.' },
        { t: '7', ok: true, fb: 'Cinque lettere ASCII occupano un byte ciascuna, la é ne occupa due.' },
        { t: '12', fb: 'Due byte occorrono soltanto alla lettera accentata. Le altre cinque occupano un byte ciascuna.' }] }
    ],
    sfida: ['lez03_03_utf8_decode', 'Lunghezza e struttura delle sequenze UTF-8']
  }
});
