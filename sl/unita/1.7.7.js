'use strict';
SL.registra('1.7.7', {
  titolo: 'Laboratorio conclusivo',
  obiettivo: 'Alla fine saprai seguire una misura dalla codifica alla rilettura, e dire quale controllo ferma per primo un record alterato.',
  concetti: [['riproduci', 'Andata e ritorno'], ['tabella', 'Struttura'], ['scudo', 'Dominio']],
  filigrana: ['esperimento', 'scudo', 'bus'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 1.7.1', t: 'I byte disponibili', d: 'Davanti a ogni campo si confronta la sua larghezza con i byte rimasti dopo il cursore.' },
      { sim: 'strati', da: 'Dall’unità 1.7.2', t: 'Una regola per campo', d: 'La temperatura è un intero con segno in decimi di grado. La tensione è in virgola mobile a 32 bit. Entrambe viaggiano in ordine little-endian.' },
      { sim: 'conflitto', da: 'Dall’unità 1.6.2', t: 'Le parole speciali', d: 'Con l’esponente tutto a 1, una parola in virgola mobile indica un infinito oppure un NaN, cioè un risultato privo di senso.' }
    ],
    domanda: { d: 'Prima di proseguire: i quattro byte 00 00 C0 BF, in ordine little-endian, formano la parola 0xBFC00000. Rispetto a 0x3FC00000, che vale 1,5, che cosa cambia?', o: [
      { t: 'Il segno: vale −1,5', ok: true, fb: 'Fra 3 e B cambia soltanto il bit più a sinistra, che è il bit di segno. Esponente e significando restano uguali.' },
      { t: 'L’esponente: vale 3', fb: 'Il bit che cambia è il primo della parola, cioè il bit di segno. L’esponente occupa gli otto bit successivi.' },
      { t: 'Nulla: vale ancora 1,5', fb: 'La prima cifra esadecimale passa da 3 a B, cioè da 0011 a 1011. Si accende il bit di segno.' }
    ] }
  },
  idea: {
    titolo: 'Andata, ritorno e valori ammessi',
    termini: ['andata e ritorno', 'dominio'],
    testo: [
      'Quest’ultima unità mette insieme l’intero percorso. Finora hai seguito il lettore, e qui compare anche chi scrive. Un sensore trasforma una misura in byte, i byte viaggiano, e un lettore li ritrasforma in una misura. Se tutto funziona, la misura letta è identica a quella di partenza.',
      'La prova che codifica un dato, lo rilegge e confronta il risultato con l’originale si chiama prova di [[andata e ritorno]]. Serve a verificare che chi scrive e chi legge applichino le stesse regole. Basta un disaccordo sull’ordine dei byte o sul fattore di scala perché la misura torni diversa.',
      'Durante il viaggio i byte possono cambiare. Una trasmissione si interrompe, un disturbo altera un bit, qualcuno modifica il file apposta. Il lettore riceve soltanto la copia, e l’originale gli resta ignoto. Per giudicarla dispone di due strumenti.',
      'Il primo strumento sono le regole del formato, che hai usato nelle unità precedenti: la firma, i byte disponibili davanti a ogni campo, i codici ammessi per i caratteri del nome. Questi controlli riguardano la struttura del record.',
      'Il secondo strumento è la conoscenza della grandezza misurata. Due byte qualunque formano sempre un intero con segno fra −32 768 e 32 767, cioè una temperatura fra −3276,8 e 3276,7 gradi. I sensori della stazione, però, lavorano fra −40 e 85 gradi. L’insieme dei valori che una grandezza può davvero assumere si chiama [[dominio]], ed è quasi sempre più stretto dell’insieme dei valori che il tipo sa scrivere. Per la tensione della batteria il dominio va da 0 a 5 volt, e ne restano fuori i numeri negativi, gli infiniti e i [[nan|NaN]].',
      { fig: 'scena', w: 760, h: 100, titolo: 'Quello che il tipo sa scrivere e quello che il sensore può misurare', nota: 'La fascia accesa è il dominio della temperatura. Tutto il resto si scrive senza difficoltà in due byte, e va rifiutato.', els: [
        SL.el.nota('a', 10, 6, '−3276,8 °C', 'mono'), SL.el.nota('b', 656, 6, '3276,7 °C', 'mono'),
        SL.el.barra('r', 10, 36, 740, 22, 0),
        SL.el.cella('d', 373, 32, 14, 30, '', 'on'),
        SL.el.nota('c', 300, 72, 'da −40,0 a 85,0 °C', 'mono', 'on')] },
      'Un record può superare tutti i controlli di struttura e portare un valore fuori dal dominio. Basta un bit: se il bit di segno della tensione si inverte, 1,5 volt diventano −1,5 volt, e ogni altro byte resta al suo posto. Per questo un lettore completo controlla, dopo la forma, anche il senso di quello che ha letto.',
      'I controlli si fanno nell’ordine in cui si incontrano i campi, e il lettore si ferma al primo che fallisce. Sapere quale controllo ha fermato la lettura aiuta a capire che cosa è successo al record.'
    ]
  },
  esperimento: {
    faremo: [
      'Un sensore codifica una misura in un record TLM1, il record viaggia e un lettore lo rilegge. Sceglierai il nome del sensore e il guasto che la copia subisce durante il viaggio.',
      'Seguiremo prima la codifica, poi la rilettura con i suoi controlli in fila. Il lettore si ferma al primo controllo che fallisce. Dopo il caso proposto, prova ogni guasto e cerca di prevedere quale controllo lo intercetta.'
    ],
    vedrai: [
      ['memory', 'Il record codificato', 'In alto: i byte prodotti dal sensore.'],
      ['bus', 'La copia ricevuta', 'Al centro: i byte arrivati al lettore, con il cursore. In rosso quelli cambiati.'],
      ['scudo', 'I controlli', 'In basso: il campo in lettura, il controllo applicato e il suo esito.']
    ]
  },
  lab: {
    titolo: 'Dalla misura ai byte, e ritorno',
    scena: { w: 860, h: 350 },
    atti: ['La codifica', 'Il viaggio', 'La rilettura', 'L’esito'],
    nota: 'Il numero di passi dipende dai dati: la rilettura si ferma al primo controllo fallito.',
    controlli: [
      { id: 'nome', tipo: 'scelta', eti: 'Nome del sensore', opzioni: ['Est', 'Nord', 'Ovest'], valore: 'Nord' },
      { id: 'guasto', tipo: 'scelta', eti: 'Guasto durante il viaggio', opzioni: [['tens', 'un bit della tensione si inverte'], ['nessuno', 'nessuno'], ['tronco', 'gli ultimi due byte si perdono'], ['firma', 'il primo byte diventa 58'], ['lung', 'la lunghezza del nome cresce di due'], ['temp', 'la temperatura diventa 10 27'], ['nan', 'l’ultimo byte diventa 7F']], valore: 'tens' }
    ],
    previsione: {
      domanda: (p) => 'Il sensore «' + p.nome + '» spedisce −3,5 gradi e 1,5 volt. Durante il viaggio ' + { tens: 'si inverte il bit più a sinistra dell’ultimo byte', nessuno: 'la copia resta identica all’originale', tronco: 'gli ultimi due byte si perdono', firma: 'il primo byte passa da 54 a 58', lung: 'il byte della lunghezza cresce di due', temp: 'i due byte della temperatura diventano 10 27', nan: 'l’ultimo byte passa da 3F a 7F' }[p.guasto] + '. Quale controllo fermerà la rilettura?',
      opzioni: () => [['nessuno', 'Nessuno: il record viene accettato'], ['firma', 'Il controllo della firma'], ['struttura', 'Il controllo sui byte disponibili'], ['nome', 'Il controllo sui caratteri del nome'], ['dominio', 'Un controllo sui valori ammessi']]
    },
    confronto: (pred, esito, p) => {
      const N = { nessuno: 'nessun controllo ferma il record', firma: 'il controllo della firma', struttura: 'il controllo sui byte disponibili', nome: 'il controllo sui caratteri del nome', dominio: 'un controllo sui valori ammessi' };
      const PERCHE = { tens: 'La struttura del record è intatta. Il bit invertito è il bit di segno della tensione, che diventa negativa ed esce dal dominio.', nessuno: 'La copia è identica all’originale e supera i sei controlli.', tronco: 'I due byte perduti appartengono alla tensione, che chiede quattro byte e ne trova due.', firma: 'La firma è il primo campo, e con un byte diverso il confronto fallisce subito.', lung: 'Con la lunghezza aumentata i byte ci sono ancora tutti. Il nome però ingloba i due byte della temperatura, che superano 7F.', temp: 'I due byte formano 10 000 decimi, cioè 1000,0 gradi: un valore ben scritto e fuori dal dominio.', nan: 'La struttura del record è intatta. Con l’ultimo byte a 7F la tensione diventa un NaN, che resta fuori da qualunque dominio.' }[p.guasto];
      return 'Avevi previsto: ' + N[pred] + '. Esito: ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : PERCHE);
    },
    costruisci(p) {
      const el = SL.el, T = SL.tlm, passi = [];
      const n = p.nome.length, B = T.codifica(p.nome, -35, 1.5), N = B.length, iT = 5 + n, iV = 7 + n;
      const H = (v, cifre) => '0x' + v.toString(16).toUpperCase().padStart(cifre, '0');
      const esa = (b, da, a) => b.slice(da, a).map(T.esa).join(' ');
      // La copia, con il guasto scelto. «diff» è l’intervallo dei posti cambiati.
      let C = B.slice(), diff = null;
      if (p.guasto === 'tronco') { C = B.slice(0, N - 2); diff = [N - 2, N]; }
      if (p.guasto === 'firma') { C[0] = 0x58; diff = [0, 1]; }
      if (p.guasto === 'lung') { C[4] = n + 2; diff = [4, 5]; }
      if (p.guasto === 'temp') { C[iT] = 0x10; C[iT + 1] = 0x27; diff = [iT, iT + 2]; }
      if (p.guasto === 'tens') { C[N - 1] = 0xBF; diff = [N - 1, N]; }
      if (p.guasto === 'nan') { C[N - 1] = 0x7F; diff = [N - 1, N]; }
      const s = { fase: 'codifica', scritti: 0, copia: false, cur: 0, n2: n, superati: 0 };
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('cA', 40, 0, 'IL RECORD CODIFICATO DAL SENSORE «' + p.nome.toUpperCase() + '»', 'mono')];
        T.striscia('a', B.slice(0, s.scritti), { y: 40, passo: 48, tot: N, att: o.scrive }).forEach((e) => els.push(e));
        if (s.copia) {
          els.push(el.nota('cB', 40, 100, 'LA COPIA RICEVUTA DAL LETTORE · ' + C.length + ' BYTE', 'mono'));
          T.striscia('c', C, { y: 150, passo: 48, tot: N, cur: s.cur, att: o.att, err: o.err }).forEach((e) => els.push(e));
          const campi = T.campi(s.n2);
          T.nomi('f', s.n2, { y: 220, passo: 48, campo: o.campo, cur: s.cur }).forEach((e, i) => { if (campi[i].da <= s.cur && s.fase !== 'viaggio') els.push(e); });
          if (s.fase !== 'viaggio') els.push(el.cursore('cu', 40 + s.cur * 48, 208, 44));
        }
        const E = s.fase === 'codifica' ? ['campo', 'valore da scrivere', 'byte prodotti'] : ['campo', 'controllo', 'esito'];
        els.push(el.box('b1', 40, 262, 190, 76, E[0], o.b1 || '·', o.box === 1 ? 'att' : '', { sim: 'tabella', riga: true, cls: 'stretta' }));
        els.push(el.box('b2', 245, 262, 300, 76, E[1], o.b2 || '·', o.box === 2 ? 'att' : '', { sim: s.fase === 'codifica' ? 'input' : 'scudo', riga: true, cls: 'stretta' }));
        els.push(el.box('b3', 560, 262, 270, 76, E[2], o.b3 || '·', o.b3 ? (o.male ? 'err' : 'on') : '', { sim: s.fase === 'codifica' ? 'byte' : 'lucchetto', riga: true, cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Fase', s.fase, 'a'], ['Cursore', s.fase === 'rilettura' || s.fase === 'esito' ? 'byte ' + s.cur : '·'], ['Controlli superati', s.superati + ' su 6', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      // Atto primo: la codifica.
      P({}, 0, 'La misura da spedire', 'Il sensore «' + p.nome + '» ha misurato −3,5 gradi e 1,5 volt. Per spedire la misura deve trasformarla in un record TLM1, percorrendo al contrario la strada dell’unità 1.7.2.');
      s.scritti = 5 + n;
      P({ scrive: [0, 5 + n], box: 1, b1: 'firma e nome', b2: '«TLM1» · ' + n + ' · «' + p.nome + '»', b3: esa(B, 4, 5 + n) }, 0, 'Firma, lunghezza e nome', 'La firma è sempre la stessa: i codici ASCII di T, L, M e 1. Seguono la lunghezza del nome, che vale ' + n + ', e i codici dei suoi caratteri.', { calc: '«' + p.nome + '» → ' + esa(B, 4, 5 + n) });
      s.scritti = 7 + n;
      P({ scrive: [iT, iT + 2], box: 1, b1: 'temperatura', b2: '−3,5 °C', b3: esa(B, iT, iT + 2) }, 0, 'La temperatura', 'Con il fattore di scala dieci, −3,5 gradi sono −35 decimi. In complemento a due su sedici bit −35 è 0xFFDD, e in ordine little-endian il byte meno significativo va per primo.', { calc: '−3,5 °C → −35 → 0xFFDD → DD FF' });
      s.scritti = N;
      P({ scrive: [iV, iV + 4], box: 1, b1: 'tensione', b2: '1,5 V', b3: esa(B, iV, iV + 4) }, 0, 'La tensione', 'In virgola mobile a 32 bit, 1,5 volt sono la parola 0x3FC00000: segno 0, esponente 127, significando 1,5. In ordine little-endian diventa 00 00 C0 3F. Il record è completo e conta ' + N + ' byte.', { calc: '1,5 V → 0x3FC00000 → 00 00 C0 3F' });

      // Atto secondo: il viaggio.
      s.fase = 'viaggio'; s.copia = true;
      const VIAGGIO = {
        nessuno: 'La copia arriva identica all’originale, byte per byte.',
        tronco: 'Gli ultimi due byte si perdono lungo il percorso, e la copia conta ' + (N - 2) + ' byte.',
        firma: 'Il primo byte arriva cambiato: 58 al posto di 54.',
        lung: 'Il byte della lunghezza arriva cambiato: ' + T.esa(n + 2) + ' al posto di ' + T.esa(n) + '.',
        temp: 'I due byte della temperatura arrivano cambiati: 10 27 al posto di DD FF.',
        tens: 'L’ultimo byte arriva cambiato: BF al posto di 3F. In binario 0011 1111 è diventato 1011 1111, quindi è cambiato un solo bit.',
        nan: 'L’ultimo byte arriva cambiato: 7F al posto di 3F. In binario 0011 1111 è diventato 0111 1111, quindi è cambiato un solo bit.'
      }[p.guasto];
      P({ err: diff }, 1, 'La copia ricevuta', 'Il record viaggia verso il lettore. ' + VIAGGIO + ' Il lettore possiede soltanto la copia.',
        { calc: p.guasto === 'nessuno' ? 'byte cambiati: 0' : p.guasto === 'tronco' ? 'byte perduti: 2' : 'byte cambiati: ' + (diff[1] - diff[0]), chiedi: { d: 'Il lettore può confrontare la copia con l’originale per scoprire se è cambiata?', o: ['Sì', 'No'], g: 1, no: 'L’originale è rimasto al sensore. Per giudicare la copia il lettore dispone delle regole del formato e del dominio delle grandezze.' } });

      // Atto terzo: la rilettura, un controllo dopo l’altro.
      s.fase = 'rilettura';
      const rifiuta = (categoria) => ({ passi, esito: categoria });
      const chiudi = (testo, calc) => { s.fase = 'esito'; P({ b1: 'record', b2: 'rilettura interrotta', b3: 'record rifiutato', male: true }, 3, 'Il record è rifiutato', testo, { calc }); };

      // 1. La firma.
      if (C[0] !== 0x54) {
        P({ campo: 'firma', err: [0, 4], box: 2, b1: 'firma', b2: 'firma = «TLM1» ?', b3: 'fallito', male: true }, 2, 'La firma è sbagliata', 'Il lettore chiede quattro byte e li trova. Sono ' + esa(C, 0, 4) + ', cioè «XLM1», mentre la firma attesa è «TLM1». Il formato è irriconoscibile e la lettura si ferma al primo campo.', { calc: '«XLM1» = «TLM1» ?', esito: ['no', 'no'] });
        chiudi('Il record è stato rifiutato al primo controllo. Un solo byte diverso nella firma rende inutilizzabile tutto il resto, ed è il comportamento voluto: senza la certezza del formato, gli altri campi restano privi di significato.', 'fermato da: la firma');
        return rifiuta('firma');
      }
      s.superati = 1;
      P({ campo: 'firma', att: [0, 4], box: 2, b1: 'firma', b2: 'firma = «TLM1» ?', b3: 'superato' }, 2, 'La firma', 'Il lettore chiede quattro byte e li trova. Sono ' + esa(C, 0, 4) + ', cioè «TLM1»: la firma è quella attesa.', { calc: '«TLM1» = «TLM1» ?', esito: ['sì', 'si'] });
      s.cur = 4;

      // 2. La lunghezza del nome.
      s.n2 = C[4]; s.superati = 2;
      P({ campo: 'lung', att: [4, 5], box: 2, b1: 'lunghezza', b2: 'byte disponibili: 1 ≤ ' + (C.length - 4) + ' ?', b3: 'superato' }, 2, 'La lunghezza del nome', 'Il byte successivo, letto come intero senza segno, vale ' + s.n2 + '. Il lettore lo accetta, perché un numero fra 0 e 255 è sempre una lunghezza possibile. Se è quella giusta lo diranno i campi successivi.', { calc: T.esa(C[4]) + ' = ' + s.n2 });
      s.cur = 5;

      // 3. Il nome.
      const fineNome = 5 + s.n2, rimNome = C.length - 5, lettere = C.slice(5, fineNome), ascii = lettere.every((b) => b <= 0x7F);
      if (!ascii) {
        P({ campo: 'nome', att: [5, 5 + n], err: [5 + n, fineNome], box: 2, b1: 'nome', b2: 'ogni byte ≤ 7F ?', b3: 'fallito', male: true }, 2, 'Il nome contiene byte estranei', 'Il campo dichiara ' + s.n2 + ' byte e dopo il cursore ne restano ' + rimNome + ', quindi il controllo sui byte disponibili è superato. I byte sono ' + esa(C, 5, fineNome) + '. Gli ultimi due superano 7F, il codice ASCII più alto, e nessun carattere vi corrisponde. Il lettore rifiuta il nome.', { calc: 'DD ≤ 7F ?', esito: ['no', 'no'] });
        chiudi('Il record è stato rifiutato al controllo sui caratteri del nome. Il guasto stava nel byte della lunghezza, che il lettore aveva accettato. L’errore è emerso nel campo successivo, che con quella lunghezza comprendeva anche i due byte della temperatura.', 'fermato da: i caratteri del nome');
        return rifiuta('nome');
      }
      s.superati = 3;
      const dT = T.temperatura(C.slice(fineNome, fineNome + 2)), okT = dT >= -400 && dT <= 850;
      P({ campo: 'nome', att: [5, fineNome], box: 2, b1: 'nome', b2: 'ogni byte ≤ 7F ?', b3: 'superato' }, 2, 'Il nome', 'Il campo dichiara ' + s.n2 + ' byte e dopo il cursore ne restano ' + rimNome + ', quindi i byte ci sono. Valgono ' + esa(C, 5, fineNome) + ', tutti codici ASCII: il nome è «' + String.fromCharCode.apply(null, lettere) + '».',
        { calc: esa(C, 5, fineNome) + ' → «' + String.fromCharCode.apply(null, lettere) + '»', chiedi: { d: 'I due byte successivi sono ' + esa(C, fineNome, fineNome + 2) + ', che letti come temperatura danno ' + T.gradi(dT) + ' gradi. Il dominio va da −40,0 a 85,0 gradi. Il valore è ammesso?', o: ['Sì', 'No'], g: okT ? 0 : 1, no: okT ? 'Il valore sta fra −40,0 e 85,0.' : 'Il valore supera 85,0 gradi, il massimo che un sensore della stazione può misurare.' } });
      s.cur = fineNome;

      // 4. La temperatura.
      const wT = C[s.cur] + 256 * C[s.cur + 1];
      if (!okT) {
        P({ campo: 'temp', err: [s.cur, s.cur + 2], box: 2, b1: 'temperatura', b2: '−40,0 ≤ ' + T.gradi(dT) + ' ≤ 85,0 ?', b3: 'fallito', male: true }, 2, 'La temperatura è fuori dal dominio', 'I due byte ' + esa(C, s.cur, s.cur + 2) + ', in ordine little-endian, formano ' + H(wT, 4) + '. Come intero con segno valgono ' + SL.num(dT) + ' decimi, cioè ' + T.gradi(dT) + ' gradi. Il campo è completo e la lettura è corretta. Il valore, però, esce dal dominio della temperatura, che va da −40,0 a 85,0 gradi.', { calc: '−40,0 ≤ ' + T.gradi(dT) + ' ≤ 85,0 ?', esito: ['no', 'no'] });
        chiudi('Il record è stato rifiutato al controllo sul dominio della temperatura. Firma, lunghezze e campi erano in ordine, e il valore di ' + T.gradi(dT) + ' gradi era scritto in modo corretto. Lo rende inaccettabile la conoscenza del sensore, che il formato da solo non contiene.', 'fermato da: il dominio della temperatura');
        return rifiuta('dominio');
      }
      s.superati = 4;
      P({ campo: 'temp', att: [s.cur, s.cur + 2], box: 2, b1: 'temperatura', b2: '−40,0 ≤ ' + T.gradi(dT) + ' ≤ 85,0 ?', b3: 'superato' }, 2, 'La temperatura', 'I due byte ' + esa(C, s.cur, s.cur + 2) + ', in ordine little-endian, formano ' + H(wT, 4) + '. Come intero con segno valgono ' + T.virgola(dT) + ' decimi, cioè ' + T.gradi(dT) + ' gradi. Il dominio della temperatura va da −40,0 a 85,0 gradi, e il valore vi rientra.', { calc: '−40,0 ≤ ' + T.gradi(dT) + ' ≤ 85,0 ?', esito: ['sì', 'si'] });
      s.cur += 2;

      // 5. La tensione.
      const rimV = C.length - s.cur;
      if (rimV < 4) {
        P({ campo: 'tens', att: [s.cur, C.length], err: [C.length, s.cur + 4], box: 2, b1: 'tensione', b2: 'byte disponibili: 4 ≤ ' + rimV + ' ?', b3: 'fallito', male: true }, 2, 'La tensione è incompleta', 'La tensione chiede quattro byte e dopo il cursore ne restano ' + rimV + '. Il campo è incompleto, e il lettore si ferma senza interpretare i byte arrivati.', { calc: '4 ≤ ' + rimV + ' ?', esito: ['no', 'no'] });
        chiudi('Il record è stato rifiutato al controllo sui byte disponibili della tensione. Nome e temperatura erano leggibili. Il lettore scarta comunque l’intero record, perché il formato TLM1 prevede soltanto record completi.', 'fermato da: i byte disponibili');
        return rifiuta('struttura');
      }
      const b4 = C.slice(s.cur, s.cur + 4), wV = ((b4[3] << 24) | (b4[2] << 16) | (b4[1] << 8) | b4[0]) >>> 0, v = T.tensione(b4);
      if (v !== v) {
        P({ campo: 'tens', err: [s.cur, s.cur + 4], box: 2, b1: 'tensione', b2: 'è un numero ?', b3: 'fallito', male: true }, 2, 'La tensione non è un numero', 'I quattro byte ' + esa(C, s.cur, s.cur + 4) + ' formano la parola ' + H(wV, 8) + '. Gli otto bit dell’esponente valgono tutti 1 e le cifre del significando sono diverse da zero: la parola è un NaN, privo di valore numerico. Una tensione deve essere un numero, e il lettore rifiuta.', { calc: H(wV, 8) + ' = NaN', esito: ['no', 'no'] });
        chiudi('Il record è stato rifiutato perché la tensione era un NaN. La copia differiva dall’originale per un solo bit, e la struttura era in ordine. Un lettore che controllasse soltanto i byte disponibili avrebbe consegnato al programma una tensione priva di valore.', 'fermato da: il dominio della tensione');
        return rifiuta('dominio');
      }
      if (v < 0 || v > 5) {
        P({ campo: 'tens', err: [s.cur, s.cur + 4], box: 2, b1: 'tensione', b2: '0 ≤ ' + T.virgola(v) + ' ≤ 5 ?', b3: 'fallito', male: true }, 2, 'La tensione è fuori dal dominio', 'I quattro byte ' + esa(C, s.cur, s.cur + 4) + ' formano la parola ' + H(wV, 8) + '. Il bit di segno vale 1, mentre esponente e significando sono quelli di 1,5: il valore è ' + T.virgola(v) + ' volt. La batteria di un sensore fornisce una tensione fra 0 e 5 volt, e un valore negativo esce dal dominio.', { calc: '0 ≤ ' + T.virgola(v) + ' ≤ 5 ?', esito: ['no', 'no'] });
        chiudi('Il record è stato rifiutato al controllo sul dominio della tensione. La copia differiva dall’originale per un solo bit, e la sua struttura era in ordine: firma giusta, lunghezze giuste, ogni campo completo. Soltanto il confronto con i valori possibili ha rivelato il guasto.', 'fermato da: il dominio della tensione');
        return rifiuta('dominio');
      }
      s.superati = 5;
      P({ campo: 'tens', att: [s.cur, s.cur + 4], box: 2, b1: 'tensione', b2: '0 ≤ ' + T.virgola(v) + ' ≤ 5 ?', b3: 'superato' }, 2, 'La tensione', 'I quattro byte ' + esa(C, s.cur, s.cur + 4) + ' formano la parola ' + H(wV, 8) + ', che in virgola mobile vale ' + T.virgola(v) + ' volt. Il valore è un numero e rientra nel dominio della tensione, da 0 a 5 volt.', { calc: '0 ≤ ' + T.virgola(v) + ' ≤ 5 ?', esito: ['sì', 'si'] });
      s.cur += 4;

      // 6. La fine del record.
      s.superati = 6;
      P({ box: 2, b1: 'fine del record', b2: 'cursore = byte ricevuti ?', b3: 'superato' }, 2, 'La fine del record', 'Il cursore è sul byte ' + s.cur + ', che coincide con il numero di byte ricevuti. Dopo l’ultimo campo la copia è finita, senza byte in più.', { calc: s.cur + ' = ' + C.length + ' ?', esito: ['sì', 'si'] });
      s.fase = 'esito';
      P({ b1: 'record', b2: 'sei controlli su sei', b3: 'record accettato' }, 3, 'Andata e ritorno riuscita', 'Il lettore ha ricostruito «' + p.nome + '», −3,5 gradi e 1,5 volt, gli stessi valori da cui il sensore era partito. La prova di andata e ritorno è riuscita: chi scrive e chi legge applicano le stesse regole.', { calc: '«' + p.nome + '» · −3,5 °C · 1,5 V' });
      return { passi, esito: 'nessuno' };
    }
  },
  bilancio: {
    regola: [
      'Una prova di andata e ritorno codifica un dato, lo rilegge e confronta. Se chi scrive e chi legge seguono le stesse regole, il dato torna identico.',
      'Un lettore completo applica due famiglie di controlli. Quelli di struttura vengono dal formato: firma, byte disponibili, codici ammessi. Quelli di dominio vengono dalla grandezza, perché un valore ben scritto può restare fuori dai valori possibili. Il lettore si ferma al primo controllo fallito.'
    ],
    errori: [
      ['Considerare valido un record soltanto perché è ben formato.', 'Un bit invertito può lasciare intatta la struttura e cambiare 1,5 volt in −1,5 volt. Il dominio va controllato a parte.'],
      ['Dimenticare le parole speciali della virgola mobile.', 'Ogni confronto con un NaN risulta falso. Un controllo scritto come «rifiuta se è minore di 0 o maggiore di 5» lo lascerebbe passare, quindi il NaN va escluso in modo esplicito.'],
      ['Proseguire dopo un controllo fallito.', 'Dopo un campo rifiutato le posizioni dei campi successivi sono incerte. Il lettore si ferma e segnala quale controllo ha fallito.']
    ],
    saFare: ['Codifico una misura in un record TLM1 e la rileggo.', 'Distinguo un controllo di struttura da un controllo di dominio.', 'Dato un record alterato, dico quale controllo lo ferma per primo.'],
    esercizi: [
      { d: 'Codifica la temperatura di −1,0 gradi per un record TLM1. Scrivi i due byte nell’ordine in cui compaiono nel record.', segnaposto: 'Due byte, per esempio 1A 2B', giuste: ['f6ff', '0xf60xff', 'f6.ff', 'f6-ff'],
        ok: '−1,0 gradi sono −10 decimi. Su sedici bit: 65 536 − 10 = 65 526, cioè 0xFFF6. In ordine little-endian: F6 FF.',
        diagnosi: [
          { se: ['fff6', '0xfff6', '0xff0xf6', 'ff.f6'], msg: 'La parola è giusta. Nel record i byte vanno in ordine little-endian, a partire dal meno significativo.' },
          { se: ['0a00', '000a', '0x000a'], msg: 'Hai codificato +10 decimi. La temperatura è sotto zero, quindi serve il complemento a due.' },
          { se: ['ffff', '0xffff'], msg: '0xFFFF è −1. L’intero da codificare conta i decimi: −1,0 gradi sono −10 decimi.' },
          { se: ['f600', '00f6', 'f6'], msg: 'Il byte basso è giusto. Su sedici bit un numero negativo ha anche il byte alto pieno di 1.' }
        ],
        altro: 'I byte sono diversi. Procedi in tre mosse: fattore di scala, complemento a due su sedici bit, ordine dei byte.',
        indizi: ['−1,0 gradi sono −10 decimi.', '−10 su sedici bit è 65 536 − 10 = 65 526, cioè 0xFFF6.', 'In ordine little-endian si scrive prima il byte meno significativo.'],
        svolgimento: ['Fattore di scala: −1,0 × 10 = −10.', 'Complemento a due: 65 536 − 10 = 65 526 = 0xFFF6.', 'Ordine little-endian: prima F6, poi FF.', 'Nel record: F6 FF.'] },
      { d: 'Una copia ha la firma giusta, la lunghezza giusta e tutti i byte. Gli ultimi quattro sono `00 00 C0 BF`. Che cosa fa un lettore completo?', guida: 'Scegli la risposta.', o: [
        { t: 'La accetta, perché la struttura è in ordine', fb: 'La struttura è in ordine, e la tensione letta vale −1,5 volt: un valore fuori dal dominio, che va da 0 a 5.' },
        { t: 'La rifiuta al controllo sui byte disponibili', fb: 'I quattro byte della tensione ci sono tutti. Il difetto sta nel valore che formano.' },
        { t: 'La rifiuta al controllo sul dominio', ok: true, fb: 'La parola 0xBFC00000 vale −1,5. La batteria di un sensore fornisce una tensione fra 0 e 5 volt.' }] }
    ]
  }
});
