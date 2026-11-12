'use strict';
SL.registra('1.2.2', {
  titolo: 'Notazione posizionale ed esadecimale',
  obiettivo: 'Alla fine saprai leggere un numero scritto con otto cifre binarie e riscriverlo con due simboli esadecimali.',
  concetti: [['bit', 'Bit'], ['byte', 'Byte'], ['puntatore', 'Posizione'], ['hex', 'Cifra esadecimale']],
  filigrana: ['hex', 'bit', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'bit', da: 'Dall’unità 1.2.1', t: 'Il bit', d: 'Un bit è la più piccola informazione che un circuito conserva. Può trovarsi in due soli stati, che indichiamo con 0 e 1.' },
      { sim: 'byte', da: 'Dall’unità 1.2.1', t: 'Il byte', d: 'Otto bit affiancati formano un byte. Ogni bit aggiunto raddoppia le combinazioni: con otto bit sono 256.' },
      { sim: 'puntatore', da: 'Dall’unità 0.3', t: 'Posizione e peso', d: 'La posizione di una cifra si conta da destra partendo da zero. Il peso è il valore che quella posizione dà alla cifra: 1, 10, 100 e così via.' }
    ],
    domanda: { d: 'Prima di proseguire: quante combinazioni si formano con tre bit?', o: [
      { t: '6', fb: 'Hai sommato i due valori di ciascun bit. Le combinazioni si moltiplicano: 2 × 2 × 2 = 8.' },
      { t: '8', ok: true, fb: 'Ogni bit raddoppia le combinazioni: 2 × 2 × 2 = 8.' },
      { t: '9', fb: 'Hai calcolato 3 × 3. Ogni bit ha due valori, quindi il conto è 2 × 2 × 2 = 8.' }
    ] }
  },
  idea: {
    titolo: 'Due sole cifre, pesi che raddoppiano',
    termini: ['base', 'binario', 'esadecimale'],
    testo: [
      'Nell’unità 0.3 abbiamo guardato dentro un contachilometri: rotelle affiancate, dieci cifre su ciascuna, e una rotella che trascina la vicina quando torna a 0. Da lì viene la regola dei pesi: a ogni passo verso sinistra il peso si moltiplica per dieci, perché dieci sono le cifre stampate su ogni rotella.',
      'Il numero di cifre disponibili in ogni posizione si chiama [[base]]. La scrittura dei numeri che usiamo tutti i giorni è una scrittura in base dieci. La regola dei pesi, però, funziona con qualunque base: cambia soltanto il fattore per cui il peso cresce a ogni passo.',
      'Immagina un contachilometri costruito con rotelle più povere, che portano due sole cifre, 0 e 1. La prima rotella esaurisce le sue cifre già al secondo scatto, quindi deve trascinare la vicina molto più spesso. I pesi crescono di conseguenza a passi più corti: 1, 2, 4, 8, 16, e ciascuno è il doppio del precedente. Questa è la scrittura in base due, detta [[binario|binaria]]. È quella che il calcolatore usa al suo interno, perché ogni rotella a due cifre corrisponde a un bit.',
      'Per leggere un numero binario basta sommare i pesi delle posizioni in cui compare la cifra 1. Nella figura qui sotto le caselle accese hanno peso 16, 4 e 2, e il numero scritto vale 16 + 4 + 2, cioè 22. Le caselle spente valgono zero e vanno scritte comunque: se le togliessimo, le altre cifre scivolerebbero su pesi diversi e il numero cambierebbe.',
      { fig: 'celle', titolo: 'Base due · un byte che vale 22', nota: 'Sopra ogni casella è scritto il suo peso. La somma dei pesi accesi è 16 + 4 + 2 = 22.', celle: [
        { so: '128', v: '0' }, { so: '64', v: '0' }, { so: '32', v: '0' }, { so: '16', v: '1', st: 'on' }, { so: '8', v: '0' }, { so: '4', v: '1', st: 'on' }, { so: '2', v: '1', st: 'on' }, { so: '1', v: '0' }] },
      'Scrivere otto cifre per ogni byte è faticoso e gli errori di copiatura sono frequenti. Per questo si usa una scrittura abbreviata, che raggruppa i bit a quattro a quattro. Quattro bit formano sedici combinazioni, e a ciascuna si assegna un solo simbolo: le cifre da 0 a 9 per i primi dieci valori e le lettere da A a F per i valori da dieci a quindici. È la scrittura in base sedici, detta [[esadecimale]].',
      { fig: 'celle', titolo: 'Base sedici · lo stesso byte in due simboli', nota: 'Ogni gruppo di quattro bit diventa un simbolo. Il prefisso 0x avverte che ciò che segue è scritto in base sedici.', celle: [
        { so: '0001', v: '1', st: 'amb', gi: 'vale 1' }, { so: '0110', v: '6', st: 'amb', gi: 'vale 6' }] },
      'Il byte della figura si divide in 0001 e 0110, che valgono 1 e 6. In esadecimale si scrive quindi 16. Per distinguerlo dal sedici della base dieci lo si fa precedere dal prefisso `0x`, e si ottiene `0x16`.',
      'Nell’esperimento che segue farai il percorso inverso: partirai da un numero in base dieci e sceglierai, una casella alla volta, quali pesi servono per comporlo.'
    ]
  },
  esperimento: {
    faremo: [
      'Prenderemo un numero scritto in base dieci e lo riscriveremo con otto bit. Procederemo come chi deve comporre una somma usando poche monete: si parte da quella di taglio maggiore e la si usa soltanto se non supera la somma ancora da coprire.',
      'Le nostre monete sono i pesi 128, 64, 32, 16, 8, 4, 2 e 1, e di ciascuna ne esiste una sola. Per ogni peso faremo sempre le stesse mosse: confrontarlo con ciò che resta, decidere la cifra della casella, aggiornare ciò che resta.'
    ],
    vedrai: [
      ['byte', 'Le otto caselle', 'Una per ogni peso, dal più grande a sinistra al più piccolo a destra. All’inizio sono vuote.'],
      ['puntatore', 'Il cursore ambra', 'Indica il peso che stiamo esaminando in quel passo.'],
      ['bilancio', 'Il residuo', 'La parte del numero ancora da rappresentare. Parte dal numero intero e deve arrivare a zero.']
    ]
  },
  lab: {
    titolo: 'Il banco dei pesi',
    scena: { w: 860, h: 262 },
    atti: ['Preparazione', 'I pesi da 128 a 16', 'I pesi da 8 a 1', 'Controllo e scrittura esadecimale'],
    nota: 'Il numero di passi dipende dal numero scelto: ogni peso che entra nel numero richiede una mossa in più, perché va tolto dal residuo.',
    controlli: [{ id: 'n', tipo: 'num', eti: 'Numero sul banco', min: 1, max: 255, salti: [1, 10], pronti: [181, 77, 200, 255], valore: 181 }],
    previsione: {
      domanda: (p) => 'Il numero sul banco è ' + p.n + '. Quando il residuo sarà arrivato a zero, quante caselle conterranno la cifra 1?',
      opzioni: () => [0, 1, 2, 3, 4, 5, 6, 7, 8]
    },
    confronto: (pred, esito) => 'Avevi previsto ' + pred + (pred === 1 ? ' casella' : ' caselle') + ' con la cifra 1. Le caselle che la contengono sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Riguarda i passi in cui un peso è entrato nel numero: sono tanti quante le cifre 1.'),
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
        testo: 'Sul banco c’è il numero ' + n + '. Le otto caselle sono vuote e il residuo coincide con il numero intero, perché nulla è stato ancora rappresentato.' });
      W.forEach((w, k) => {
        const atto = k < 4 ? 1 : 2, ciSta = w <= r;
        passi.push({ atto, titolo: 'Confronto con il peso ' + w, calc: w + ' ≤ ' + r + ' ?', hud: hud(w), els: quadro(k),
          testo: 'Il cursore si ferma sul peso ' + w + '. Il residuo vale ' + r + '. Chiediamoci se il peso ci sta, cioè se ' + w + ' è minore o uguale a ' + r + '.',
          chiedi: { d: 'Il peso ' + w + ' ci sta nel residuo ' + r + '?', o: ['Il peso ci sta', 'Il peso supera il residuo'], g: ciSta ? 0 : 1,
            no: ciSta ? 'Controlla il confronto: ' + w + ' è minore o uguale a ' + r + ', quindi il peso ci sta.' : 'Controlla il confronto: ' + w + ' è maggiore di ' + r + ', quindi il peso supera il residuo.' } });
        if (ciSta) {
          bits[k] = 1;
          passi.push({ atto, titolo: 'Il peso ' + w + ' entra nel numero', calc: w + ' ≤ ' + r, esito: ['CI STA', 'si'], hud: hud(w), els: quadro(k),
            testo: 'Il peso ' + w + ' ci sta nel residuo ' + r + '. La casella riceve la cifra 1: questo peso fa parte del numero.' });
          const prima = r; r -= w;
          passi.push({ atto, titolo: 'Aggiorniamo il residuo', calc: prima + ' − ' + w + ' = ' + r, hud: hud(w), els: quadro(k),
            testo: 'Togliamo dal residuo il peso appena usato. Restano da rappresentare ' + r + ' unità.' });
        } else {
          bits[k] = 0;
          passi.push({ atto, titolo: 'Il peso ' + w + ' resta fuori', calc: w + ' > ' + r, esito: ['SUPERA IL RESIDUO', ''], hud: hud(w), els: quadro(k),
            testo: 'Il peso ' + w + ' è maggiore del residuo ' + r + ' e quindi resta inutilizzato. La casella riceve la cifra 0 e il residuo rimane ' + r + '.' });
        }
      });
      const usati = W.filter((w, k) => bits[k] === 1), bin = bits.join(''), hi4 = bin.slice(0, 4), lo4 = bin.slice(4);
      const hiV = n >> 4, loV = n & 15, H = HEX[hiV], L = HEX[loV];
      passi.push({ atto: 3, titolo: 'Controllo', calc: usati.join(' + ') + ' = ' + n, hud: hud(null), els: quadro(-1),
        testo: 'Il residuo è arrivato a zero: il numero è stato rappresentato per intero. Per controllo sommiamo i pesi delle caselle che contengono 1 e ritroviamo ' + n + '.' });
      passi.push({ atto: 3, titolo: 'Due gruppi da quattro', calc: hi4 + '  ' + lo4, hud: hud(null), els: quadro(-1, true),
        testo: 'Passiamo alla scrittura abbreviata. Dividiamo le otto caselle in due gruppi da quattro bit, uno a sinistra e uno a destra.' });
      passi.push({ atto: 3, titolo: 'Il gruppo di sinistra', calc: hi4 + ' → ' + hiV + ' → ' + H, hud: hud(null), els: quadro(-1, true, H),
        testo: 'Il gruppo di sinistra, ' + hi4 + ', letto da solo vale ' + hiV + '. In esadecimale questo valore si scrive ' + H + '.' });
      passi.push({ atto: 3, titolo: 'Il gruppo di destra', calc: lo4 + ' → ' + loV + ' → ' + L, hud: hud(null), els: quadro(-1, true, H, L),
        testo: 'Il gruppo di destra, ' + lo4 + ', letto da solo vale ' + loV + '. In esadecimale questo valore si scrive ' + L + '.' });
      passi.push({ atto: 3, titolo: 'Risultato', calc: n + ' = ' + bin + ' = 0x' + H + L, hud: hud(null), els: quadro(-1, true, H, L),
        testo: 'Il numero ' + n + ' si scrive ' + bin + ' in binario e 0x' + H + L + ' in esadecimale.' });
      return { passi, esito: usati.length };
    }
  },
  bilancio: {
    regola: [
      'Per scrivere un numero in binario si esaminano i pesi dal più grande al più piccolo. Un peso che non supera il residuo viene usato, e allora la sua casella riceve 1 e il peso viene tolto dal residuo. Un peso più grande del residuo resta fuori e la sua casella riceve 0.',
      'Quando il residuo arriva a zero, il numero è la somma dei pesi usati. Per la scrittura esadecimale si dividono gli otto bit in due gruppi da quattro e si sostituisce ogni gruppo con il simbolo del suo valore.'
    ],
    errori: [
      ['Leggere i pesi da sinistra.', 'La posizione zero, che pesa 1, è l’ultima a destra.'],
      ['Contare le cifre 1.', 'Ogni cifra 1 vale quanto il peso della sua posizione.'],
      ['Tralasciare gli zeri.', 'Senza gli zeri le altre cifre finiscono su pesi diversi.']
    ],
    saFare: ['Leggo un byte e ne calcolo il valore in base dieci.', 'Scrivo con otto bit un numero compreso fra 0 e 255.', 'Passo da otto bit a due cifre esadecimali e ritorno.'],
    esercizi: [
      { d: 'Quanto vale, in base dieci, questo byte?', segnaposto: 'Valore in base dieci',
        figura: { fig: 'celle', celle: [{ v: '0' }, { v: '0' }, { v: '0' }, { v: '1' }, { v: '0' }, { v: '1' }, { v: '1' }, { v: '0' }] },
        giuste: ['22'], ok: 'Le cifre 1 occupano le posizioni di peso 16, 4 e 2, e la somma 16 + 4 + 2 dà 22.',
        diagnosi: [
          { se: ['104'], msg: 'Hai letto i pesi da sinistra, come se la prima cifra pesasse 1. La posizione di peso 1 è l’ultima a destra: riparti da lì e raddoppia a ogni passo verso sinistra.' },
          { se: ['3'], msg: 'Hai contato le cifre 1. Ciascuna va sostituita con il peso della sua posizione, e i pesi vanno sommati.' },
          { se: ['44'], msg: 'Hai assegnato il peso 2 all’ultima cifra a destra. Quella posizione pesa 1, e i pesi raddoppiano a partire da lì.' },
          { se: ['16', '0x16'], msg: 'Hai scritto il byte in esadecimale. In base dieci 0x16 vale 1 × 16 + 6.' },
          { se: ['10110', '00010110'], msg: 'Hai ricopiato le cifre. La domanda chiede il valore in base dieci: somma i pesi delle posizioni che contengono 1.' }
        ],
        altro: 'Il valore è diverso. Scrivi sotto ogni cifra il suo peso, partendo da 1 a destra e raddoppiando verso sinistra, poi somma i pesi delle cifre 1.',
        indizi: ['I pesi delle otto posizioni, da sinistra a destra, sono 128, 64, 32, 16, 8, 4, 2 e 1.', 'Le cifre 1 si trovano nella quarta, nella sesta e nella settima casella da sinistra.', 'I pesi da sommare sono 16, 4 e 2.'],
        svolgimento: ['Si scrivono i pesi sotto le cifre: 128, 64, 32, 16, 8, 4, 2, 1.', 'Le cifre 1 cadono sui pesi 16, 4 e 2.', 'La somma è 16 + 4 + 2 = 22.'] },
      { d: 'Scrivi in esadecimale il byte 1011 0101.', segnaposto: 'Due simboli', eti: 'La tua risposta, con o senza 0x',
        giuste: ['b5', '0xb5'], ok: 'Il gruppo 1011 vale 11, che si scrive B. Il gruppo 0101 vale 5. Il byte è 0xB5.',
        diagnosi: [
          { se: ['181'], msg: 'Hai calcolato il valore in base dieci, che è corretto. La domanda chiede la scrittura esadecimale: un simbolo per ciascun gruppo di quattro bit.' },
          { se: ['115', '0x115'], msg: 'Hai scritto 11 per il primo gruppo. In esadecimale i valori da dieci a quindici hanno un simbolo solo, una lettera da A a F: undici si scrive B.' },
          { se: ['5b', '0x5b'], msg: 'Hai scambiato i due gruppi. Il gruppo di sinistra del byte resta a sinistra anche nella scrittura esadecimale.' },
          { se: ['a5', '0xa5', 'c5', '0xc5'], msg: 'Il secondo simbolo è giusto. Ricalcola il primo gruppo, 1011: i suoi pesi sono 8, 4, 2 e 1.' }
        ],
        altro: 'La risposta è diversa. Dividi il byte in 1011 e 0101, calcola il valore di ciascun gruppo e sostituiscilo con il suo simbolo.',
        indizi: ['Dividi il byte in due gruppi da quattro bit: 1011 e 0101.', 'Il gruppo 1011 vale 8 + 2 + 1. Il gruppo 0101 vale 4 + 1.', 'Undici si scrive B, cinque si scrive 5.'],
        svolgimento: ['Si divide il byte in 1011 e 0101.', '1011 vale 8 + 2 + 1 = 11, che in esadecimale è B. 0101 vale 4 + 1 = 5.', 'Il byte si scrive 0xB5.'] }
    ],
    sfida: ['lez02_02_dec_to_bin', 'Dal decimale al binario']
  }
});
