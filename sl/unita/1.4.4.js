'use strict';
SL.registra('1.4.4', {
  titolo: 'Controllare l’aritmetica prima dell’operazione',
  obiettivo: 'Alla fine saprai stabilire, prima di eseguire una moltiplicazione, se il prodotto entrerà nella destinazione, usando soltanto numeri che non possono traboccare.',
  concetti: [['scudo', 'Controllo'], ['operation', 'Prodotto'], ['byte', 'Destinazione']],
  filigrana: ['scudo', 'operation', 'byte'],
  richiami: {
    carte: [
      { sim: 'conflitto', da: 'Dall’unità 1.4.2', t: 'Il risultato che trabocca', d: 'Quando la somma vera supera il massimo, nel byte restano soltanto gli otto bit bassi.' },
      { sim: 'scudo', da: 'Dall’unità 1.3.4', t: 'La validazione', d: 'Un lettore prudente verifica che i dati ci siano prima di usarli.' },
      { sim: 'byte', da: 'Dall’unità 1.2.1', t: 'Il massimo di un byte', d: 'Un byte senza segno contiene i numeri da 0 a 255.' }
    ],
    domanda: { d: 'Prima di proseguire: su otto bit senza segno si calcola 200 + 100. Che cosa resta nel byte?', o: [
      { t: '300', fb: 'Il numero 300 supera 255 e non entra in un byte.' },
      { t: '44', ok: true, fb: 'La somma vera è 300. Nel byte resta 300 − 256, cioè 44.' },
      { t: '255', fb: 'Arrivato al massimo il byte riparte da zero, come un contachilometri.' }
    ] }
  },
  idea: {
    titolo: 'Controllare prima, perché dopo è tardi',
    termini: ['divisione intera', 'precondizione'],
    testo: [
      'Nell’unità 1.4.2 abbiamo visto una somma traboccare. Con la moltiplicazione succede più in fretta. Venti per tredici fa 260, e in un byte restano 4. Il programma prosegue con quel 4 come se fosse il risultato, e nessuno lo avverte.',
      'Accorgersene dopo è quasi impossibile. Il 4 rimasto nel byte è identico a qualunque altro 4, e i bit persi non si possono recuperare. In una moltiplicazione, poi, la parte che esce può essere lunga molti bit, e un solo segnale di riporto non basta a descriverla.',
      'La strada sicura è controllare prima di moltiplicare. C’è però una difficoltà: il controllo non può calcolare il prodotto per vedere se è troppo grande, perché è proprio quel calcolo a traboccare. Deve arrivare alla risposta usando soltanto numeri che entrano nel byte.',
      'Il trucco è rovesciare la domanda. Chiedere se A per B supera 255 equivale a chiedere se A supera 255 diviso B. La divisione che serve è la [[divisione intera]], quella che si ferma al quoziente e scarta il resto: 255 diviso 13 fa 19, con resto 8. Il prodotto entra nel byte esattamente quando A è minore o uguale a 19.',
      { fig: 'celle', titolo: 'I multipli di 13 attorno al limite', nota: 'Il quoziente di 255 diviso 13 è 19: l’ultimo multiplo che entra nel byte è 19 × 13.', celle: [
        { so: '18 × 13', v: '234', st: 'on', gi: 'entra' }, { so: '19 × 13', v: '247', st: 'on', gi: 'entra' }, { so: 'massimo', v: '255', st: 'amb', gi: 'del byte' }, { so: '20 × 13', v: '260', gi: 'trabocca' }] },
      'Una condizione che va verificata prima di un’operazione, perché il risultato sia valido, si chiama [[precondizione]]. Quella del prodotto ha un caso particolare. Se B vale zero la divisione è impossibile, e del resto è superflua: qualunque numero per zero fa zero, che entra sempre. Il controllo esamina quindi B per primo.',
      'Questi controlli proteggono da guai seri. Un programma che riceve un file calcola spesso quanta memoria riservare moltiplicando il numero di elementi per la loro larghezza. Se il prodotto trabocca, la memoria riservata è troppo poca. Il programma poi scrive tutti gli elementi, e finisce su celle che appartengono ad altri dati.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma deve conservare in un byte il prodotto di due numeri, A e B. Prima di moltiplicare eseguirà il controllo: guarderà se B è zero, calcolerà il limite 255 diviso B e lo confronterà con A.',
      'La barra rappresenta lo spazio del byte, da 0 a 255. La useremo per provare i multipli di B attorno al limite, e poi per il prodotto vero.'
    ],
    vedrai: [
      ['operation', 'I due fattori e il limite', 'In alto. Il limite compare dopo la divisione.'],
      ['byte', 'La barra del byte', 'Al centro. Si riempie in proporzione al prodotto in prova; oltre 255 diventa rossa.'],
      ['scudo', 'L’esito', 'In alto a destra, quando il controllo avrà deciso.']
    ]
  },
  lab: {
    titolo: 'Un prodotto che deve stare in un byte',
    scena: { w: 860, h: 330 },
    atti: ['Il compito', 'Il caso dello zero', 'Il limite', 'Il confronto', 'L’esito'],
    nota: 'Con B uguale a zero il controllo finisce subito. Negli altri casi un prodotto rifiutato richiede un passo in più, per mostrare che cosa si è evitato.',
    controlli: [
      { id: 'a', tipo: 'num', eti: 'A', min: 0, max: 40, salti: [1, 5], valore: 20 },
      { id: 'b', tipo: 'num', eti: 'B', min: 0, max: 20, salti: [1, 5], valore: 13 }
    ],
    previsione: {
      domanda: (p) => 'Il programma deve conservare in un byte il prodotto ' + p.a + ' × ' + p.b + ', e prima di moltiplicare esegue il controllo. Che cosa finirà nel byte?',
      opzioni: (p) => { const t = p.a * p.b, v = [[t <= 255 ? t : t % 256, String(t <= 255 ? t : t % 256)], [255, '255'], ['rifiutato', 'Nulla, il prodotto viene rifiutato']]; if (t > 255) v.push([t, String(t)]); const visti = new Set(); return v.filter((x) => (visti.has(x[0]) ? false : visti.add(x[0]))); }
    },
    confronto: (pred, esito, p) => { const t = p.a * p.b; return (pred === 'rifiutato' ? 'Avevi previsto un rifiuto. ' : 'Avevi previsto ' + pred + ' nel byte. ') + (esito === 'rifiutato' ? 'Il controllo ha rifiutato il prodotto. ' : 'Nel byte è finito ' + esito + '. ') + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'rifiutato' ? (pred === t % 256 ? 'Quel valore è ciò che sarebbe rimasto senza il controllo. Il controllo serve proprio a evitarlo.' : 'Il prodotto vero, ' + t + ', supera 255. Il byte non può contenerlo e nemmeno fermarsi al massimo.') : 'Il prodotto vale ' + t + ', che resta entro 255, e il controllo lo lascia passare.'); },
    costruisci(p) {
      const el = SL.el, passi = [];
      const t = p.a * p.b, q = p.b ? Math.floor(255 / p.b) : null, r = p.b ? 255 % p.b : null;
      const ok = p.b === 0 || p.a <= q;
      let limite = null, prova = null, dest = null, esi = null, nota = '';
      const quadro = (o) => {
        o = o || {};
        const v = prova === null ? 0 : Math.min(1, prova / 255);
        return [
          el.box('fa', 40, 12, 150, 76, 'A', String(p.a), o.att === 'a' ? 'att' : '', { sim: 'operation' }),
          el.box('fb', 210, 12, 150, 76, 'B', String(p.b), o.att === 'b' ? 'att' : '', { sim: 'operation' }),
          el.box('li', 390, 12, 210, 76, 'limite · 255 ÷ B', limite === null ? '·' : String(limite), o.att === 'l' ? 'att' : limite === null ? '' : 'on', { sim: 'bilancio' }),
          el.box('es', 630, 12, 200, 76, 'esito', esi || '·', esi ? (ok ? 'on' : 'err') : '', { sim: 'scudo' }),
          el.nota('t1', 40, 112, 'LO SPAZIO DEL BYTE · DA 0 A 255', 'mono'),
          Object.assign(el.barra('ba', 40, 140, 780, 28, v), { st: prova !== null && prova > 255 ? 'err' : '' }),
          el.nota('z0', 40, 174, '0', 'mono'), el.nota('z1', 790, 174, '255', 'mono'),
          el.nota('pr', 300, 174, nota, 'mono', prova !== null && prova > 255 ? 'err' : 'on'),
          el.box('de', 40, 228, 380, 80, 'byte di destinazione', dest === null ? '·' : String(dest), o.att === 'd' ? (o.male ? 'err' : 'att') : dest === null ? '' : 'on', { sim: 'byte', riga: true })
        ];
      };
      const hud = () => [['A × B', p.a + ' × ' + p.b, 'a'], ['Limite per A', limite === null ? '·' : limite], ['Prodotto in prova', prova === null ? '·' : prova, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Il compito', 'Il programma deve calcolare ' + p.a + ' × ' + p.b + ' e conservare il risultato in un byte, che arriva fino a 255. Prima di moltiplicare esegue il controllo, usando soltanto numeri che entrano in un byte.');
      if (p.b === 0) {
        P({ att: 'b' }, 1, 'B è zero', 'Il controllo esamina B per primo. Vale zero, quindi la divisione 255 ÷ B è impossibile, e del resto è superflua: qualunque numero moltiplicato per zero dà zero.', { calc: 'B = 0 → prodotto = 0' });
        esi = 'eseguito'; prova = 0; nota = 'prodotto: 0';
        P({ att: 'd' }, 4, 'Il prodotto è accettato', 'Zero entra sempre nel byte. Il controllo lascia passare l’operazione senza calcolare alcun limite.', { calc: p.a + ' × 0 = 0' });
        dest = 0;
        P({ att: 'd' }, 4, 'Il byte riceve zero', 'La moltiplicazione viene eseguita e il byte di destinazione riceve 0.', { calc: 'byte = 0' });
        return { passi, esito: 0 };
      }
      P({ att: 'b' }, 1, 'B è diverso da zero', 'Il controllo esamina B per primo. Vale ' + p.b + ', quindi la divisione si può fare e il controllo prosegue.', { calc: 'B = ' + p.b + ' ≠ 0' });
      limite = q;
      P({ att: 'l' }, 2, 'La divisione intera', 'Dividiamo il massimo del byte per B e teniamo soltanto il quoziente: 255 ÷ ' + p.b + ' fa ' + q + (r ? ', con resto ' + r + '.' : ', senza resto.') + ' La divisione non può traboccare, perché il suo risultato è al più 255.',
        { calc: q + ' × ' + p.b + (r ? ' + ' + r : '') + ' = 255', chiedi: { d: 'Il quoziente è ' + q + '. Qual è il più grande valore di A che, moltiplicato per ' + p.b + ', resta entro 255?', o: [String(q - 1), String(q), String(q + 1)], g: 1, no: q + ' × ' + p.b + ' fa ' + q * p.b + ', che entra. ' + (q + 1) + ' × ' + p.b + ' fa ' + (q + 1) * p.b + ', che supera 255.' } });
      if (q >= 2) { prova = (q - 1) * p.b; nota = (q - 1) + ' × ' + p.b + ' = ' + prova; P({ att: 'l' }, 2, 'Un multiplo sotto il limite', 'Proviamo sulla barra il multiplo ' + (q - 1) + ' × ' + p.b + '. Vale ' + prova + ' e sta nel byte con un certo margine.', { calc: nota }); }
      prova = q * p.b; nota = q + ' × ' + p.b + ' = ' + prova;
      P({ att: 'l' }, 2, 'L’ultimo multiplo che entra', 'Il multiplo ' + q + ' × ' + p.b + ' vale ' + prova + '. ' + (prova === 255 ? 'Riempie il byte esattamente.' : 'Mancano ' + (255 - prova) + ' per arrivare a 255, meno di un altro ' + p.b + '.'), { calc: nota + ' ≤ 255' });
      prova = (q + 1) * p.b; nota = (q + 1) + ' × ' + p.b + ' = ' + prova + ' · oltre 255';
      P({ att: 'l' }, 2, 'Il primo multiplo che trabocca', 'Il multiplo successivo, ' + (q + 1) + ' × ' + p.b + ', vale ' + prova + ' e supera 255. Il limite per A è quindi ' + q + '.',
        { calc: (q + 1) + ' × ' + p.b + ' = ' + prova + ' > 255', chiedi: { d: 'A vale ' + p.a + ' e il limite è ' + q + '. Il prodotto si può eseguire?', o: ['Sì', 'No'], g: ok ? 0 : 1, no: 'Il prodotto entra nel byte quando A è minore o uguale al limite. Qui A vale ' + p.a + ' e il limite è ' + q + '.' } });
      prova = null; nota = '';
      esi = ok ? 'eseguito' : 'rifiutato';
      P({ att: 'a' }, 3, 'Il confronto', 'Il controllo confronta A con il limite. ' + (ok ? p.a + ' è minore o uguale a ' + q + ', quindi il prodotto entrerà nel byte.' : p.a + ' è maggiore di ' + q + ', quindi il prodotto traboccherebbe.'), { calc: p.a + ' ≤ ' + q + ' ?', esito: [ok ? 'sì' : 'no', ok ? 'si' : 'no'] });
      if (ok) {
        prova = t; nota = p.a + ' × ' + p.b + ' = ' + t;
        P({}, 4, 'La moltiplicazione', 'Soltanto ora il programma moltiplica. Il prodotto è ' + t + ', entro il massimo come il controllo aveva garantito.', { calc: nota });
        dest = t;
        P({ att: 'd' }, 4, 'Il byte riceve il prodotto', 'Il byte di destinazione riceve ' + t + '. È il prodotto vero, senza bit perduti.', { calc: 'byte = ' + t });
        return { passi, esito: t };
      }
      P({ att: 'd' }, 4, 'Il prodotto viene rifiutato', 'Il programma non esegue la moltiplicazione. Il byte di destinazione resta com’era e il programma segnala che i dati sono fuori misura.', { calc: 'nessuna moltiplicazione' });
      prova = t; nota = p.a + ' × ' + p.b + ' = ' + t + ' · oltre 255';
      P({}, 4, 'Che cosa abbiamo evitato', 'Il prodotto vero sarebbe ' + t + ', oltre il massimo del byte. In binario occupa ' + t.toString(2).length + ' bit, e un byte ne conserva otto.', { calc: t + ' = ' + t.toString(2) });
      P({ att: 'd', male: true }, 4, 'Il valore che sarebbe rimasto', 'Senza il controllo, nel byte sarebbero rimasti gli otto bit bassi, cioè ' + (t % 256) + '. Un numero plausibile, e del tutto sbagliato. Il byte, grazie al controllo, non è stato toccato.', { calc: t + ' − ' + Math.floor(t / 256) + ' × 256 = ' + (t % 256) });
      return { passi, esito: 'rifiutato' };
    }
  },
  bilancio: {
    regola: [
      'Un risultato traboccato è indistinguibile da uno corretto. Il controllo va fatto prima dell’operazione, con numeri che non possono traboccare a loro volta.',
      'Per un prodotto destinato a un byte: se B è zero il prodotto è zero. Altrimenti il prodotto entra quando A è minore o uguale al quoziente intero di 255 diviso B.'
    ],
    errori: [
      ['Moltiplicare e poi controllare.', 'Dopo la moltiplicazione il byte contiene già il valore troncato, e i bit usciti sono perduti.'],
      ['Dimenticare il caso B uguale a zero.', 'La divisione per zero è impossibile. Lo zero va riconosciuto prima di dividere.'],
      ['Arrotondare il limite per eccesso.', 'Di 255 diviso 13 conta il quoziente intero, 19. Con 20 il prodotto supera già il massimo.']
    ],
    saFare: ['Spiego perché il controllo precede l’operazione.', 'Calcolo il limite per A con una divisione intera.', 'Tratto a parte il caso in cui un fattore è zero.'],
    esercizi: [
      { d: 'Un prodotto A × 25 deve entrare in un byte senza segno. Qual è il valore più grande che A può avere?', segnaposto: 'Un numero', giuste: ['10'],
        ok: 'Il quoziente intero di 255 diviso 25 è 10: 10 × 25 = 250 entra, 11 × 25 = 275 trabocca.',
        diagnosi: [
          { se: ['11'], msg: 'Con A uguale a 11 il prodotto è 275, oltre 255. Il limite è il quoziente intero, senza arrotondare per eccesso.' },
          { se: ['10.2'], msg: 'Il valore di A è un numero intero. Del risultato della divisione si tiene soltanto il quoziente.' },
          { se: ['250'], msg: 'Quello è il prodotto più grande che entra nel byte. La domanda chiede il valore di A che lo produce.' }
        ],
        altro: 'Il valore è diverso. Dividi 255 per 25 e tieni soltanto il quoziente intero.',
        indizi: ['Il massimo di un byte senza segno è 255.', '25 sta in 255 dieci volte, con resto 5.', 'Il limite per A è il quoziente intero.'],
        svolgimento: ['255 ÷ 25 = 10 con resto 5.', '10 × 25 = 250, che entra. 11 × 25 = 275, che supera 255.', 'Il valore più grande di A è 10.'] },
      { d: 'Il controllo riceve A uguale a 200 e B uguale a 0. Che cosa deve fare?', guida: 'Scegli la risposta.', o: [
        { t: 'Calcolare 255 ÷ 0 e confrontare', fb: 'La divisione per zero è impossibile. Il controllo deve riconoscere lo zero prima di dividere.' },
        { t: 'Accettare: il prodotto è zero', ok: true, fb: 'Qualunque numero per zero fa zero, che entra sempre nel byte. La divisione non serve.' },
        { t: 'Rifiutare, perché A è grande', fb: 'Quando B è zero la grandezza di A è irrilevante, perché il prodotto vale comunque zero.' }] }
    ],
    sfida: ['lez04_05_overflow_detector', 'Rilevare il traboccamento']
  }
});
