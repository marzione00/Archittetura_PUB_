'use strict';
SL.registra('1.2.2', {
  titolo: 'Notazione posizionale ed esadecimale',
  obiettivo: 'Obiettivo: leggere un numero scritto con otto cifre binarie e riscriverlo con due simboli esadecimali.',
  concetti: [['bit', 'Bit'], ['byte', 'Byte'], ['puntatore', 'Posizione'], ['hex', 'Cifra esadecimale']],
  filigrana: ['hex', 'bit', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'bit', da: 'Dall’unità 1.2.1', t: 'Il bit', d: 'Un bit è un’informazione che può assumere due soli valori, indicati con 0 e 1.' },
      { sim: 'byte', da: 'Dall’unità 1.2.1', t: 'Il byte', d: 'Otto bit affiancati formano un byte. Ogni bit aggiunto raddoppia il numero delle combinazioni, che con otto bit sono 256.' },
      { sim: 'puntatore', da: 'Dall’unità 0.3', t: 'Posizione e peso', d: 'La posizione di una cifra si numera da destra a partire da zero. Il peso è il valore che la posizione attribuisce alla cifra: 1, 10, 100 e così di seguito.' }
    ],
    domanda: { d: 'Prima di proseguire: quante combinazioni si formano con tre bit?', o: [
      { t: '6', fb: 'Sono stati sommati i due valori di ciascun bit. Le combinazioni si moltiplicano: 2 × 2 × 2 = 8.' },
      { t: '8', ok: true, fb: 'Ogni bit raddoppia le combinazioni: 2 × 2 × 2 = 8.' },
      { t: '9', fb: 'È stato calcolato 3 × 3. Ogni bit assume due valori, e il prodotto corretto è 2 × 2 × 2 = 8.' }
    ] }
  },
  idea: {
    titolo: 'Due cifre e pesi che raddoppiano',
    termini: ['base', 'binario', 'esadecimale'],
    testo: [
      'L’unità 0.3 ha descritto un contatore decimale a ruote: ruote affiancate, dieci cifre su ciascuna, e una ruota che fa avanzare la successiva quando ritorna a 0. Ne discende la regola dei pesi: a ogni passo verso sinistra il peso si moltiplica per dieci, poiché dieci sono le cifre riportate su ciascuna ruota.',
      'Il numero di cifre disponibili in ciascuna posizione prende il nome di [[base]]. La notazione ordinaria è una notazione in base dieci. La regola dei pesi vale tuttavia per qualunque base: varia soltanto il fattore per il quale il peso cresce a ogni passo.',
      'Si consideri un contatore le cui ruote riportino due sole cifre, 0 e 1. La prima ruota esaurisce le proprie cifre al secondo scatto, e fa quindi avanzare la successiva con frequenza molto maggiore. I pesi crescono di conseguenza a passi più brevi: 1, 2, 4, 8, 16, ciascuno doppio del precedente. Questa notazione, in base due, è detta [[binario|binaria]]. Il calcolatore la adotta al proprio interno, poiché ogni ruota a due cifre corrisponde a un bit.',
      'Il valore di un numero binario si ottiene sommando i pesi delle posizioni in cui compare la cifra 1. Nella figura seguente le caselle accese hanno peso 16, 4 e 2, e il numero rappresentato vale 16 + 4 + 2, cioè 22. Le caselle spente valgono zero e devono essere comunque scritte: la loro omissione farebbe slittare le altre cifre su pesi diversi, alterando il numero.',
      { fig: 'celle', titolo: 'Base due · un byte che vale 22', nota: 'Sopra ogni casella è indicato il relativo peso. La somma dei pesi accesi è 16 + 4 + 2 = 22.', celle: [
        { so: '128', v: '0' }, { so: '64', v: '0' }, { so: '32', v: '0' }, { so: '16', v: '1', st: 'on' }, { so: '8', v: '0' }, { so: '4', v: '1', st: 'on' }, { so: '2', v: '1', st: 'on' }, { so: '1', v: '0' }] },
      'La scrittura di otto cifre per ogni byte è onerosa ed espone a frequenti errori di trascrizione. Si ricorre pertanto a una notazione abbreviata, che raggruppa i bit a quattro a quattro. Quattro bit formano sedici combinazioni, a ciascuna delle quali è assegnato un solo simbolo: le cifre da 0 a 9 per i primi dieci valori, le lettere da A a F per i valori da dieci a quindici. Questa notazione, in base sedici, è detta [[esadecimale]].',
      { fig: 'celle', titolo: 'Base sedici · lo stesso byte in due simboli', nota: 'Ogni gruppo di quattro bit è sostituito da un simbolo. Il prefisso 0x segnala che quanto segue è scritto in base sedici.', celle: [
        { so: '0001', v: '1', st: 'amb', gi: 'vale 1' }, { so: '0110', v: '6', st: 'amb', gi: 'vale 6' }] },
      'Il byte della figura si divide in 0001 e 0110, che valgono 1 e 6. In esadecimale si scrive dunque 16. Per distinguerlo dal sedici della base dieci lo si fa precedere dal prefisso `0x`, ottenendo `0x16`.',
      'L’esperimento che segue procede in senso inverso: a partire da un numero in base dieci si stabilisce, una casella alla volta, quali pesi concorrano a comporlo.'
    ]
  },
  esperimento: {
    faremo: [
      'Un numero scritto in base dieci viene riscritto con otto bit. Il procedimento esamina i pesi in ordine decrescente: ciascun peso è impiegato soltanto se è minore o uguale alla parte del numero ancora da rappresentare, detta residuo.',
      'I pesi disponibili sono 128, 64, 32, 16, 8, 4, 2 e 1, e ciascuno può essere impiegato una sola volta. Per ogni peso si ripetono le medesime operazioni: il confronto con il residuo, la scelta della cifra della casella, l’aggiornamento del residuo.'
    ],
    vedrai: [
      ['byte', 'Le otto caselle', 'Una per ogni peso, dal maggiore a sinistra al minore a destra. All’inizio sono vuote.'],
      ['puntatore', 'Il cursore ambra', 'Segnala il peso in esame nel passo corrente.'],
      ['bilancio', 'Il residuo', 'La parte del numero ancora da rappresentare. Coincide inizialmente con il numero intero e deve ridursi a zero.']
    ]
  },
  lab: {
    titolo: 'Il banco dei pesi',
    scena: { w: 860, h: 262 },
    atti: ['Preparazione', 'I pesi da 128 a 16', 'I pesi da 8 a 1', 'Controllo e scrittura esadecimale'],
    nota: 'Il numero dei passi dipende dal numero scelto: ogni peso che entra nel numero richiede un passo ulteriore, per la sottrazione dal residuo.',
    controlli: [{ id: 'n', tipo: 'num', eti: 'Numero sul banco', min: 1, max: 255, salti: [1, 10], pronti: [181, 77, 200, 255], valore: 181 }],
    previsione: {
      domanda: (p) => 'Il numero sul banco è ' + p.n + '. Quando il residuo si sarà ridotto a zero, quante caselle conterranno la cifra 1?',
      opzioni: () => [0, 1, 2, 3, 4, 5, 6, 7, 8]
    },
    confronto: (pred, esito) => 'La previsione indicava ' + pred + (pred === 1 ? ' casella' : ' caselle') + ' con la cifra 1. Le caselle che la contengono sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Vanno riesaminati i passi in cui un peso è entrato nel numero: sono tanti quante le cifre 1.'),
    costruisci(p) {
      const n = p.n, W = [128, 64, 32, 16, 8, 4, 2, 1], HEX = '0123456789ABCDEF', el = SL.el;
      const bits = [null, null, null, null, null, null, null, null], passi = [];
      let r = n;
      const quadro = (att, gruppi, hi, lo) => {
        const els = [el.nota('etr', 30, 0, 'RESIDUO DA RAPPRESENTARE · ' + r + ' su ' + n, 'mono'), el.barra('res', 30, 22, 800, 12, r / n)];
        W.forEach((w, k) => els.push(el.cella('c' + k, 30 + k * 100, 84, 88, 92, bits[k] === null ? '·' : String(bits[k]), k === att ? 'att' : bits[k] === 1 ? 'on' : bits[k] === 0 ? 'zero' : '', { so: String(w) })));
        if (att >= 0) els.push(el.cursore('cur', 30 + att * 100, 46, 88));
        if (gruppi) {
          els.push(el.zona('g1', 30, 190, 388, 60, 'gruppo di sinistra', hi ? 'att' : ''), el.zona('g2', 430, 190, 388, 60, 'gruppo di destra', lo ? 'att' : ''));
          if (hi) els.push(el.nota('h1', 30, 212, hi, 'forte centro', 'att', { w: 388 }));
          if (lo) els.push(el.nota('h2', 430, 212, lo, 'forte centro', 'att', { w: 388 }));
        }
        return els;
      };
      const hud = (w) => [['Numero', n], ['Residuo', r, 'c'], ['Peso in esame', w == null ? '·' : w, 'a']];
      passi.push({ atto: 0, titolo: 'Il banco di lavoro', calc: 'residuo = ' + n, hud: hud(null), els: quadro(-1),
        testo: 'Sul banco è posto il numero ' + n + '. Le otto caselle sono vuote e il residuo coincide con il numero intero, poiché nulla è stato ancora rappresentato.' });
      W.forEach((w, k) => {
        const atto = k < 4 ? 1 : 2, ciSta = w <= r;
        passi.push({ atto, titolo: 'Confronto con il peso ' + w, calc: w + ' ≤ ' + r + ' ?', hud: hud(w), els: quadro(k),
          testo: 'Il cursore si ferma sul peso ' + w + '. Il residuo vale ' + r + '. Occorre stabilire se il peso è contenuto nel residuo, cioè se ' + w + ' è minore o uguale a ' + r + '.',
          chiedi: { d: 'Il peso ' + w + ' è contenuto nel residuo ' + r + '?', o: ['Il peso è contenuto nel residuo', 'Il peso supera il residuo'], g: ciSta ? 0 : 1,
            no: ciSta ? 'Il confronto va riesaminato: ' + w + ' è minore o uguale a ' + r + ', e il peso è pertanto contenuto nel residuo.' : 'Il confronto va riesaminato: ' + w + ' è maggiore di ' + r + ', e il peso supera pertanto il residuo.' } });
        if (ciSta) {
          bits[k] = 1;
          passi.push({ atto, titolo: 'Il peso ' + w + ' entra nel numero', calc: w + ' ≤ ' + r, esito: ['CI STA', 'si'], hud: hud(w), els: quadro(k),
            testo: 'Il peso ' + w + ' è contenuto nel residuo ' + r + '. La casella riceve la cifra 1, poiché il peso concorre a formare il numero.' });
          const prima = r; r -= w;
          passi.push({ atto, titolo: 'Aggiornamento del residuo', calc: prima + ' − ' + w + ' = ' + r, hud: hud(w), els: quadro(k),
            testo: 'Dal residuo si sottrae il peso appena impiegato. Restano da rappresentare ' + r + ' unità.' });
        } else {
          bits[k] = 0;
          passi.push({ atto, titolo: 'Il peso ' + w + ' resta escluso', calc: w + ' > ' + r, esito: ['SUPERA IL RESIDUO', ''], hud: hud(w), els: quadro(k),
            testo: 'Il peso ' + w + ' è maggiore del residuo ' + r + ' e resta quindi inutilizzato. La casella riceve la cifra 0 e il residuo rimane ' + r + '.' });
        }
      });
      const usati = W.filter((w, k) => bits[k] === 1), bin = bits.join(''), hi4 = bin.slice(0, 4), lo4 = bin.slice(4);
      const hiV = n >> 4, loV = n & 15, H = HEX[hiV], L = HEX[loV];
      passi.push({ atto: 3, titolo: 'Controllo', calc: usati.join(' + ') + ' = ' + n, hud: hud(null), els: quadro(-1),
        testo: 'Il residuo si è ridotto a zero: il numero è stato rappresentato per intero. A titolo di controllo, la somma dei pesi delle caselle che contengono 1 restituisce ' + n + '.' });
      passi.push({ atto: 3, titolo: 'Due gruppi di quattro bit', calc: hi4 + '  ' + lo4, hud: hud(null), els: quadro(-1, true),
        testo: 'Si passa alla notazione abbreviata. Le otto caselle sono divise in due gruppi di quattro bit, uno a sinistra e uno a destra.' });
      passi.push({ atto: 3, titolo: 'Il gruppo di sinistra', calc: hi4 + ' → ' + hiV + ' → ' + H, hud: hud(null), els: quadro(-1, true, H),
        testo: 'Il gruppo di sinistra, ' + hi4 + ', letto isolatamente, vale ' + hiV + '. In esadecimale questo valore si scrive ' + H + '.' });
      passi.push({ atto: 3, titolo: 'Il gruppo di destra', calc: lo4 + ' → ' + loV + ' → ' + L, hud: hud(null), els: quadro(-1, true, H, L),
        testo: 'Il gruppo di destra, ' + lo4 + ', letto isolatamente, vale ' + loV + '. In esadecimale questo valore si scrive ' + L + '.' });
      passi.push({ atto: 3, titolo: 'Risultato', calc: n + ' = ' + bin + ' = 0x' + H + L, hud: hud(null), els: quadro(-1, true, H, L),
        testo: 'Il numero ' + n + ' si scrive ' + bin + ' in binario e 0x' + H + L + ' in esadecimale.' });
      return { passi, esito: usati.length };
    }
  },
  bilancio: {
    regola: [
      'La scrittura binaria di un numero si ottiene esaminando i pesi dal maggiore al minore. Un peso minore o uguale al residuo viene impiegato, sicché la relativa casella riceve 1 e il peso è sottratto dal residuo. Un peso maggiore del residuo resta escluso e la relativa casella riceve 0.',
      'Quando il residuo si riduce a zero, il numero coincide con la somma dei pesi impiegati. Per la scrittura esadecimale si dividono gli otto bit in due gruppi di quattro e si sostituisce ciascun gruppo con il simbolo del relativo valore.'
    ],
    errori: [
      ['Leggere i pesi da sinistra.', 'La posizione zero, di peso 1, è l’ultima a destra.'],
      ['Contare le cifre 1.', 'Ogni cifra 1 vale quanto il peso della propria posizione.'],
      ['Tralasciare gli zeri.', 'In assenza degli zeri le altre cifre slittano su pesi diversi.']
    ],
    saFare: ['Leggere un byte e calcolarne il valore in base dieci.', 'Scrivere con otto bit un numero compreso fra 0 e 255.', 'Passare da otto bit a due cifre esadecimali e viceversa.'],
    esercizi: [
      { d: 'Si calcoli il valore, in base dieci, del byte rappresentato.', segnaposto: 'Valore in base dieci',
        figura: { fig: 'celle', celle: [{ v: '0' }, { v: '0' }, { v: '0' }, { v: '1' }, { v: '0' }, { v: '1' }, { v: '1' }, { v: '0' }] },
        giuste: ['22'], ok: 'Le cifre 1 occupano le posizioni di peso 16, 4 e 2, e la somma 16 + 4 + 2 dà 22.',
        diagnosi: [
          { se: ['104'], msg: 'I pesi sono stati letti da sinistra, come se la prima cifra avesse peso 1. La posizione di peso 1 è l’ultima a destra, e da essa il peso raddoppia a ogni passo verso sinistra.' },
          { se: ['3'], msg: 'Sono state contate le cifre 1. Ciascuna va sostituita con il peso della propria posizione, e i pesi vanno sommati.' },
          { se: ['44'], msg: 'All’ultima cifra a destra è stato assegnato il peso 2. Tale posizione ha peso 1, e i pesi raddoppiano a partire da essa.' },
          { se: ['16', '0x16'], msg: 'Il byte è stato scritto in esadecimale. In base dieci 0x16 vale 1 × 16 + 6.' },
          { se: ['10110', '00010110'], msg: 'Le cifre sono state ricopiate. È richiesto il valore in base dieci, cioè la somma dei pesi delle posizioni che contengono 1.' }
        ],
        altro: 'Il valore è diverso. Si scriva sotto ogni cifra il relativo peso, a partire da 1 a destra e raddoppiando verso sinistra, e si sommino poi i pesi delle cifre 1.',
        indizi: ['I pesi delle otto posizioni, da sinistra a destra, sono 128, 64, 32, 16, 8, 4, 2 e 1.', 'Le cifre 1 si trovano nella quarta, nella sesta e nella settima casella da sinistra.', 'I pesi da sommare sono 16, 4 e 2.'],
        svolgimento: ['Si scrivono i pesi sotto le cifre: 128, 64, 32, 16, 8, 4, 2, 1.', 'Le cifre 1 cadono sui pesi 16, 4 e 2.', 'La somma è 16 + 4 + 2 = 22.'] },
      { d: 'Si scriva in esadecimale il byte 1011 0101.', segnaposto: 'Due simboli', eti: 'Risposta, con o senza 0x',
        giuste: ['b5', '0xb5'], ok: 'Il gruppo 1011 vale 11, che si scrive B. Il gruppo 0101 vale 5. Il byte è 0xB5.',
        diagnosi: [
          { se: ['181'], msg: 'È stato calcolato il valore in base dieci, che è corretto. È richiesta tuttavia la scrittura esadecimale, con un simbolo per ciascun gruppo di quattro bit.' },
          { se: ['115', '0x115'], msg: 'Per il primo gruppo è stato scritto 11. In esadecimale i valori da dieci a quindici hanno un solo simbolo, una lettera da A a F: undici si scrive B.' },
          { se: ['5b', '0x5b'], msg: 'I due gruppi sono stati scambiati. Il gruppo di sinistra del byte resta a sinistra anche nella scrittura esadecimale.' },
          { se: ['a5', '0xa5', 'c5', '0xc5'], msg: 'Il secondo simbolo è corretto. Va ricalcolato il primo gruppo, 1011, i cui pesi sono 8, 4, 2 e 1.' }
        ],
        altro: 'La risposta è diversa. Si divida il byte in 1011 e 0101, si calcoli il valore di ciascun gruppo e lo si sostituisca con il relativo simbolo.',
        indizi: ['Si divida il byte in due gruppi da quattro bit: 1011 e 0101.', 'Il gruppo 1011 vale 8 + 2 + 1. Il gruppo 0101 vale 4 + 1.', 'Undici si scrive B, cinque si scrive 5.'],
        svolgimento: ['Si divide il byte in 1011 e 0101.', '1011 vale 8 + 2 + 1 = 11, che in esadecimale è B. 0101 vale 4 + 1 = 5.', 'Il byte si scrive 0xB5.'] }
    ],
    sfida: ['lez02_02_dec_to_bin', 'Dal decimale al binario']
  }
});
