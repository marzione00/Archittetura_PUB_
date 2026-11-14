'use strict';
SL.registra('1.7.2', {
  titolo: 'Un record di telemetria, cinque regole di rappresentazione',
  obiettivo: 'Obiettivo: leggere i cinque campi del record applicando a ciascuno la relativa regola, e motivare lo spostamento delle misure, a valori invariati, prodotto da un nome più lungo.',
  concetti: [['char', 'Testo'], ['segno', 'Intero con scala'], ['virgola', 'Virgola mobile']],
  filigrana: ['strati', 'segno', 'virgola'],
  richiami: {
    carte: [
      { sim: 'byte', da: 'Dall’unità 1.2.3', t: 'L’ordine little-endian', d: 'Un numero di più byte scritto a partire dal byte meno significativo. Il numero 0x1234 diventa 34 12.' },
      { sim: 'segno', da: 'Dall’unità 1.4.1', t: 'Il complemento a due', d: 'Su sedici bit, una parola con il bit di segno a 1 vale il suo valore senza segno diminuito di 65 536.' },
      { sim: 'virgola', da: 'Dall’unità 1.6.2', t: 'La virgola mobile a 32 bit', d: 'Un bit di segno, otto bit di esponente aumentato di 127, ventitré bit per le cifre del significando.' }
    ],
    domanda: { d: 'Prima di proseguire: i due byte 34 12 sono un intero senza segno in ordine little-endian. Quanto vale?', o: [
      { t: '0x1234, cioè 4660', ok: true, fb: 'Il primo byte è il meno significativo. Per scrivere il numero si antepone il secondo.' },
      { t: '0x3412, cioè 13 330', fb: 'Questa è la lettura big-endian. In little-endian il primo byte ricevuto ha il peso minore.' },
      { t: '52 e 18, due numeri distinti', fb: 'Il formato stabilisce che i due byte formano un solo numero di sedici bit.' }
    ] }
  },
  idea: {
    titolo: 'Una regola per ciascun campo',
    termini: ['fattore di scala'],
    testo: [
      'Nell’unità precedente il lettore ha stabilito dove comincia ogni campo e ha verificato che i byte fossero stati ricevuti. Restano le ultime due domande, relative all’ordine dei byte e al loro significato. Il record TLM1 è breve, e tuttavia impiega cinque regole diverse, ciascuna trattata in un capitolo precedente.',
      'La firma e il nome sono testo ASCII: ogni byte è il codice di un carattere. La firma ha una larghezza fissa di quattro byte, mentre la lunghezza del nome è dichiarata dal byte che lo precede. Tale byte di lunghezza è un intero senza segno, e può quindi dichiarare da 0 a 255 caratteri.',
      'La temperatura deve poter assumere valori negativi e deve conservare i decimi di grado. Il formato soddisfa entrambe le esigenze con un intero con segno di sedici bit che conta i decimi. Una temperatura di 21,5 gradi è scritta come l’intero 215, e una di −3,5 gradi come l’intero −35. Il numero per il quale si divide l’intero per ricavare la grandezza prende il nome di [[fattore di scala]], e in questo caso vale dieci.',
      'I due byte della temperatura sono trasmessi in ordine little-endian, cioè con il byte meno significativo per primo. L’intero −35 in complemento a due su sedici bit è 0xFFDD, e nel record compare come `DD FF`. Il lettore esegue i medesimi passaggi in ordine inverso.',
      { fig: 'scena', w: 770, h: 96, titolo: 'Dai due byte alla temperatura', nota: 'Tre passaggi: si riordinano i byte, si applica il segno, si divide per il fattore di scala.', els: [
        SL.el.box('a', 10, 8, 130, 72, 'nel record', 'DD FF', 'att'), SL.el.linea('l1', 140, 44, 164, 44, 'on'),
        SL.el.box('b', 164, 8, 130, 72, 'riordinati', '0xFFDD', ''), SL.el.linea('l2', 294, 44, 318, 44, 'on'),
        SL.el.box('c', 318, 8, 130, 72, 'senza segno', '65 501', ''), SL.el.linea('l3', 448, 44, 472, 44, 'on'),
        SL.el.box('d', 472, 8, 130, 72, 'con segno', '−35', ''), SL.el.linea('l4', 602, 44, 626, 44, 'on'),
        SL.el.box('e', 626, 8, 130, 72, 'in gradi', '−3,5 °C', 'on')] },
      'La tensione è una misura fisica che può valere pochi millesimi di volt come alcune decine. Il formato la conserva in virgola mobile a 32 bit, secondo lo standard IEEE 754, con i quattro byte in ordine little-endian. La tensione di 1,5 volt è la parola 0x3FC00000, e nel record compare come `00 00 C0 3F`.',
      'I byte, considerati isolatamente, sono privi di tali indicazioni. Un byte `FF` nella temperatura e un byte `FF` nella tensione sono identici, e li distingue soltanto la posizione. La posizione dipende a sua volta dalla lunghezza del nome. Un nome più lungo di un carattere fa scorrere di un posto la temperatura e la tensione, e ne lascia invariati i byte e i valori.'
    ]
  },
  esperimento: {
    faremo: [
      'Il lettore dispone di un record TLM1 completo. I controlli fissano il nome del sensore, la temperatura e la tensione, e il record è costruito di conseguenza.',
      'L’esperimento segue la lettura dei cinque campi, ciascuno con la propria regola. La temperatura e la tensione richiedono tre passaggi ciascuna. Dopo il caso proposto, è istruttivo variare soltanto il nome e osservare l’effetto sui byte delle due misure.'
    ],
    vedrai: [
      ['memory', 'Il record', 'In alto: i byte del record, con il campo in lettura acceso.'],
      ['hex', 'Il numero letto', 'In basso al centro: i byte del campo, riordinati e letti come numero.'],
      ['output', 'Il significato', 'In basso a destra: l’informazione contenuta nel campo.']
    ]
  },
  lab: {
    titolo: 'Cinque campi, cinque regole',
    scena: { w: 860, h: 270 },
    atti: ['Il record', 'Il testo', 'La temperatura', 'La tensione', 'Il bilancio'],
    controlli: [
      { id: 'nome', tipo: 'scelta', eti: 'Nome del sensore', opzioni: ['Est', 'Nord', 'Ovest'], valore: 'Nord' },
      { id: 'temp', tipo: 'scelta', eti: 'Temperatura', opzioni: [[-35, '−3,5 °C'], [215, '21,5 °C'], [-1, '−0,1 °C'], [0, '0,0 °C'], [-400, '−40,0 °C'], [600, '60,0 °C']], valore: -35 },
      { id: 'volt', tipo: 'scelta', eti: 'Tensione', opzioni: [[1.5, '1,5 V'], [3.25, '3,25 V'], [5, '5 V'], [12, '12 V']], valore: 1.5 }
    ],
    previsione: {
      domanda: (p) => 'Il nome «' + p.nome + '» occupa ' + p.nome.length + ' byte. Da quale byte comincerà il campo della tensione?',
      opzioni: (p) => { const n = p.nome.length; return Array.from(new Set([7 + n, 5 + n, 6 + n, 11, 11 + n])).sort((a, b) => a - b); }
    },
    confronto: (pred, esito, p) => 'La previsione indicava il byte ' + pred + '. La tensione comincia al byte ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Prima della tensione vengono la firma (4 byte), la lunghezza (1), il nome (' + p.nome.length + ') e la temperatura (2). La somma dà ' + esito + '.'),
    costruisci(p) {
      const el = SL.el, T = SL.tlm, passi = [];
      const n = p.nome.length, B = T.codifica(p.nome, p.temp, p.volt), tot = B.length;
      const esa = (da, a) => B.slice(da, a).map(T.esa).join(' ');
      const H = (v, cifre) => '0x' + v.toString(16).toUpperCase().padStart(cifre, '0');
      const V = T.virgola;
      const iT = 5 + n, iV = 7 + n;
      // La temperatura, mossa per mossa.
      const parola = B[iT] + 256 * B[iT + 1], negativo = parola >= 32768, decimi = T.temperatura(B.slice(iT, iT + 2));
      // La tensione, mossa per mossa.
      const w = ((B[iV + 3] << 24) | (B[iV + 2] << 16) | (B[iV + 1] << 8) | B[iV]) >>> 0;
      const S = w >>> 31, E = (w >>> 23) & 255, F = w & 0x7FFFFF, sig = 1 + F / 8388608, esp = E - 127, volt = T.tensione(B.slice(iV, iV + 4));
      let cur = 0, campo = '·', regola = '·';
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('t1', 40, 0, 'IL RECORD DEL SENSORE «' + p.nome.toUpperCase() + '» · ' + tot + ' BYTE', 'mono')];
        T.striscia('m', B, { y: 46, passo: 48, cur, att: o.att }).forEach((e) => els.push(e));
        T.nomi('f', n, { y: 116, passo: 48, campo: o.campo, cur }).forEach((e) => els.push(e));
        els.push(el.cursore('cu', 40 + cur * 48, 104, 44));
        els.push(el.box('b1', 40, 170, 250, 76, 'byte del campo', o.b1 || '·', o.box === 1 ? 'att' : '', { sim: 'byte', riga: true }));
        els.push(el.box('b2', 310, 170, 250, 76, 'numero letto', o.b2 || '·', o.box === 2 ? 'att' : '', { sim: 'hex', riga: true }));
        els.push(el.box('b3', 580, 170, 250, 76, 'significato', o.b3 || '·', o.b3 ? 'on' : '', { sim: 'output', riga: true }));
        return els;
      };
      const hud = () => [['Cursore', 'byte ' + cur, 'a'], ['Campo', campo], ['Regola', regola, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Il record è completo', 'Il lettore ha ricevuto ' + tot + ' byte e ha già verificato, come nell’unità precedente, che ogni campo sia stato ricevuto per intero. Resta da applicare a ciascun campo la relativa regola di lettura.');

      campo = 'firma'; regola = 'testo ASCII'; cur = 4;
      P({ campo: 'firma', att: [0, 4], box: 1, b1: esa(0, 4), b3: '«TLM1»' }, 1, 'La firma è testo', 'I primi quattro byte si leggono come caratteri ASCII, uno per byte: 54 è la T, 4C la L, 4D la M, 31 la cifra 1. Ne risulta «TLM1», la firma attesa, e il lettore prosegue.', { calc: esa(0, 4) + ' → «TLM1»' });

      campo = 'lunghezza'; regola = 'senza segno'; cur = 5;
      const opz = Array.from(new Set([5 + n, 4 + n, 7 + n, 5])).sort((a, b) => a - b);
      P({ campo: 'lung', att: [4, 5], box: 2, b1: esa(4, 5), b2: String(n), b3: n + ' byte di nome' }, 1, 'La lunghezza è un intero senza segno', 'Il byte successivo si legge come intero senza segno e vale ' + n + ': il nome è lungo ' + n + ' byte. Da questo numero dipende la posizione dei campi che seguono il nome.',
        { calc: esa(4, 5) + ' = ' + n, chiedi: { d: 'Il nome comincia al byte 5 ed è lungo ' + n + ' byte. Da quale byte comincia la temperatura?', o: opz.map(String), g: opz.indexOf(5 + n), no: 'Prima della temperatura vengono la firma (4 byte), la lunghezza (1 byte) e il nome (' + n + ' byte): 4 + 1 + ' + n + ' = ' + (5 + n) + '.' } });

      campo = 'nome'; regola = 'testo ASCII'; cur = 5 + n;
      P({ campo: 'nome', att: [5, 5 + n], box: 1, b1: esa(5, 5 + n), b3: '«' + p.nome + '»' }, 1, 'Il nome è testo', 'I ' + n + ' byte del nome si leggono anch’essi come caratteri ASCII. Sono i codici di ' + p.nome.split('').join(', ') + '. Il cursore giunge al byte ' + cur + ', dove comincia la temperatura.', { calc: esa(5, 5 + n) + ' → «' + p.nome + '»' });

      campo = 'temperatura'; regola = 'con segno';
      P({ campo: 'temp', att: [iT, iT + 2], box: 2, b1: esa(iT, iT + 2), b2: H(parola, 4) }, 2, 'La temperatura: l’ordine dei byte', 'La temperatura occupa due byte in ordine little-endian. Il primo ricevuto, ' + T.esa(B[iT]) + ', è il meno significativo. Per scrivere il numero si antepone il secondo, e si ottiene ' + H(parola, 4) + '.',
        { calc: esa(iT, iT + 2) + ' → ' + H(parola, 4), chiedi: { d: 'La parola è ' + H(parola, 4) + ' e il formato la dichiara un intero con segno di sedici bit. Il suo bit più a sinistra vale ' + (negativo ? 1 : 0) + '. Il numero è negativo?', o: ['Sì', 'No'], g: negativo ? 0 : 1, no: negativo ? 'Il bit di segno vale 1, e in complemento a due questo indica un numero negativo.' : 'Il bit di segno vale 0, e il numero è quindi positivo o nullo.' } });
      P({ campo: 'temp', att: [iT, iT + 2], box: 2, b1: esa(iT, iT + 2), b2: String(decimi).replace('-', '−') }, 2, 'La temperatura: il segno', 'Come intero senza segno, ' + H(parola, 4) + ' vale ' + SL.num(parola) + '. ' + (negativo ? 'Il bit di segno vale 1, e al valore senza segno si sottrae quindi 65 536, ottenendo ' + V(decimi) + '.' : 'Il bit di segno vale 0, e il valore con segno coincide quindi con quello senza segno.'),
        { calc: negativo ? SL.num(parola) + ' − 65 536 = ' + V(decimi) : H(parola, 4) + ' = ' + decimi });
      cur = iT + 2;
      P({ campo: 'temp', att: [iT, iT + 2], box: 2, b1: esa(iT, iT + 2), b2: String(decimi).replace('-', '−'), b3: T.gradi(decimi) + ' °C' }, 2, 'La temperatura: il fattore di scala', 'L’intero conta i decimi di grado, cioè il fattore di scala vale dieci. ' + (Math.abs(decimi) === 1 ? V(decimi) + ' decimo corrisponde' : V(decimi) + ' decimi corrispondono') + ' a ' + T.gradi(decimi) + ' gradi. Il cursore avanza di due.',
        { calc: V(decimi) + ' ÷ 10 = ' + T.gradi(decimi) + ' °C' });

      campo = 'tensione'; regola = 'virgola mobile';
      P({ campo: 'tens', att: [iV, iV + 4], box: 2, b1: esa(iV, iV + 4), b2: H(w, 8) }, 3, 'La tensione: l’ordine dei byte', 'La tensione occupa quattro byte, ancora in ordine little-endian. Letti dall’ultimo al primo formano la parola ' + H(w, 8) + '.', { calc: esa(iV, iV + 4) + ' → ' + H(w, 8) });
      P({ campo: 'tens', att: [iV, iV + 4], box: 2, b1: esa(iV, iV + 4), b2: H(w, 8) }, 3, 'La tensione: segno, esponente, significando', 'La parola va letta come virgola mobile a 32 bit. Il bit di segno vale ' + S + '. Gli otto bit dell’esponente valgono ' + E + ', e sottratto 127 resta ' + esp + '. Le cifre conservate, precedute dall’uno implicito, danno il significando ' + V(sig) + '.',
        { calc: 'S = ' + S + ' · E = ' + E + ' · significando = ' + V(sig) });
      cur = iV + 4;
      P({ campo: 'tens', att: [iV, iV + 4], box: 2, b1: esa(iV, iV + 4), b2: H(w, 8), b3: V(volt) + ' V' }, 3, 'La tensione: il valore', 'Il valore è il significando moltiplicato per 2 elevato a ' + esp + ', cioè per ' + Math.pow(2, esp) + ': ' + V(sig) + ' × ' + Math.pow(2, esp) + ' = ' + V(volt) + '. Il campo indica ' + V(volt) + ' volt. Il cursore avanza di quattro.',
        { calc: V(sig) + ' × 2^' + esp + ' = ' + V(volt) + ' V' });

      campo = '·'; regola = '·';
      P({ b3: 'record letto' }, 4, 'Tre informazioni da ' + tot + ' byte', 'Il cursore è sul byte ' + cur + ', alla fine del record. Il sensore «' + p.nome + '» ha misurato ' + T.gradi(decimi) + ' gradi e ' + V(volt) + ' volt. La temperatura è stata letta dai byte ' + iT + ' e ' + (iT + 1) + ', la tensione dai byte da ' + iV + ' a ' + (iV + 3) + ': con un nome di lunghezza diversa le medesime coppie di cifre occuperebbero altri posti.',
        { calc: '«' + p.nome + '» · ' + T.gradi(decimi) + ' °C · ' + V(volt) + ' V' });
      return { passi, esito: iV };
    }
  },
  bilancio: {
    regola: [
      'Ogni campo si legge con la regola che il formato gli assegna: testo ASCII, intero senza segno, intero con segno, virgola mobile. Per i campi di più byte il formato fissa anche l’ordine dei byte.',
      'Un intero accompagnato da un fattore di scala rappresenta una grandezza con parte frazionaria: si legge l’intero e lo si divide per il fattore. La posizione di un campo può dipendere dai campi che lo precedono, mentre la sua regola di lettura resta la stessa.'
    ],
    errori: [
      ['Leggere i byte nell’ordine di ricezione.', 'In little-endian il primo byte è il meno significativo. I byte DD FF formano la parola 0xFFDD.'],
      ['Trascurare il segno.', 'La parola 0xFFDD vale 65 501 come intero senza segno e −35 come intero con segno. La lettura corretta è quella dichiarata dal formato.'],
      ['Trascurare il fattore di scala.', 'L’intero −35 conta decimi di grado. La temperatura è −3,5 gradi.']
    ],
    saFare: ['Leggere un intero con segno di due byte in ordine little-endian.', 'Applicare un fattore di scala a un intero.', 'Indicare da quale byte comincia un campo che segue un campo di lunghezza variabile.'],
    esercizi: [
      { d: 'In un record TLM1 i due byte della temperatura sono `E7 FF`. Quanti gradi indica il campo?', segnaposto: 'Una temperatura in gradi', giuste: ['-2.5', '−2.5', '-2.5°c', '−2.5°c', '-2.5°', '−2.5°', '-2.5gradi', '−2.5gradi'],
        ok: 'I byte formano 0xFFE7, cioè 65 511. Con il segno: 65 511 − 65 536 = −25 decimi, cioè −2,5 gradi.',
        diagnosi: [
          { se: ['-25', '−25'], msg: 'L’intero è corretto. Manca il fattore di scala: l’intero conta decimi di grado.' },
          { se: ['6551.1', '6551.1°c', '65511'], msg: 'La parola è stata letta come intero senza segno. Il bit di segno vale 1, e va quindi sottratto 65 536.' },
          { se: ['-614.5', '−614.5', '-6145', '−6145'], msg: 'I byte sono stati letti nell’ordine di ricezione. Il campo è little-endian, e la parola è quindi 0xFFE7.' },
          { se: ['2.5', '2.5°c', '25'], msg: 'Il valore assoluto è corretto. Va riesaminato il bit di segno della parola 0xFFE7.' }
        ],
        altro: 'Il valore è diverso. Si proceda in tre passaggi: ordine dei byte, segno, fattore di scala.',
        indizi: ['In little-endian il secondo byte è il più significativo: la parola è 0xFFE7.', 'Come intero senza segno 0xFFE7 vale 65 511, e il suo bit di segno vale 1.', '65 511 − 65 536 = −25 decimi di grado.'],
        svolgimento: ['Ordine dei byte: E7 FF diventa 0xFFE7.', 'Senza segno: 0xFFE7 = 65 511.', 'Con segno: 65 511 − 65 536 = −25.', 'Fattore di scala: −25 ÷ 10 = −2,5 gradi.'] },
      { d: 'Il nome di un sensore passa da «Est» a «Ovest», mentre le misure restano uguali. Che cosa accade ai quattro byte della tensione?', guida: 'Si scelga la risposta.', o: [
        { t: 'Cambiano valore', fb: 'La tensione e la regola sono invariate, e i quattro byte restano quindi identici.' },
        { t: 'Si spostano di due posti', ok: true, fb: 'Il nome cresce di due byte. La tensione comincia al byte 12 anziché al byte 10, con i medesimi quattro byte.' },
        { t: 'Restano nella stessa posizione', fb: 'La tensione segue il nome. Se il nome si allunga, tutti i campi successivi scorrono in avanti.' }] }
    ]
  }
});
