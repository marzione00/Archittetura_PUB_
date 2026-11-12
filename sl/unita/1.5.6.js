'use strict';
SL.registra('1.5.6', {
  titolo: 'Ragionamento booleano nel codice di sistema',
  obiettivo: 'Alla fine saprai interrogare un byte di stato con una maschera, distinguere la domanda «tutti questi bit» dalla domanda «almeno uno», e non confondere gli operatori bit a bit con quelli logici.',
  concetti: [['flag', 'Bit di stato'], ['scudo', 'Maschera'], ['conflitto', 'Condizione']],
  filigrana: ['flag', 'scudo', 'porta'],
  richiami: {
    carte: [
      { sim: 'scudo', da: 'Dall’unità 1.5.3', t: 'La maschera', d: 'Un byte scelto per indicare le posizioni che interessano. Con la AND passano soltanto i bit che la maschera lascia passare.' },
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'La AND', d: 'Vale 1 soltanto quando entrambi gli ingressi valgono 1.' },
      { sim: 'scudo', da: 'Dall’unità 1.4.4', t: 'La precondizione', d: 'Una condizione da verificare prima di un’operazione, perché il risultato sia valido.' }
    ],
    domanda: { d: 'Prima di proseguire: quanto vale `0x05 & 0x07`?', o: [
      { t: '0x07', fb: 'Quello è il risultato della OR. Con la AND passano soltanto i bit a 1 in entrambi i byte.' },
      { t: '0x05', ok: true, fb: 'In binario 0101 & 0111 dà 0101: la maschera lascia passare tutti i bit di 0x05.' },
      { t: '0x02', fb: 'Quello è il bit che manca a 0x05 per arrivare a 0x07. La AND restituisce i bit in comune.' }
    ] }
  },
  idea: {
    titolo: 'Un byte pieno di interruttori',
    termini: ['bit di stato', 'operatore logico', 'cortocircuito'],
    testo: [
      'Un programma di sistema deve ricordare molte condizioni del tipo sì o no. Riservare un byte intero a ciascuna sarebbe uno spreco, quindi le condizioni vengono impacchettate: un bit per ciascuna, otto in un byte. Ogni bit usato così si chiama [[bit di stato]].',
      'Prendiamo una stampante. Il bit 0 del suo byte di stato dice se è pronta, il bit 1 se c’è carta, il bit 2 se il coperchio è chiuso, il bit 3 se c’è inchiostro. Il byte 0101 descrive una stampante pronta, senza carta, con il coperchio chiuso e senza inchiostro.',
      'Per interrogare un bit si usa una maschera con quel solo bit a 1. La carta corrisponde alla maschera 0010, cioè 0x02. Se `stato & 0x02` è diverso da zero, la carta c’è.',
      'Con più bit la domanda si sdoppia, ed è qui che si sbaglia più spesso. La stampa può partire soltanto se la stampante è pronta, ha carta e ha il coperchio chiuso: tre bit, maschera 0111, cioè 0x07. Chiedere se `stato & 0x07` è diverso da zero significa chiedere se almeno una delle tre condizioni è vera. Per chiedere se sono vere tutte e tre bisogna confrontare il risultato con la maschera intera: `(stato & 0x07) == 0x07`.',
      { fig: 'celle', titolo: 'Lo stato 0101 contro la maschera 0111', nota: 'Il risultato 0101 è diverso da zero e diverso dalla maschera: almeno una condizione è vera, e manca la carta.', celle: [
        { so: 'inchiostro', v: '0', gi: 'non richiesto' }, { so: 'coperchio', v: '1', st: 'on', gi: 'presente' }, { so: 'carta', v: '0', st: 'amb', gi: 'manca' }, { so: 'pronta', v: '1', st: 'on', gi: 'presente' }] },
      'Il C ha anche tre [[operatore logico|operatori logici]], scritti `&&`, `||` e `!`. Somigliano a quelli bit a bit e fanno un lavoro diverso: considerano ogni operando per intero, come falso se vale zero e come vero altrimenti, e restituiscono 0 oppure 1. Così `6 & 1` vale 0, perché 110 e 001 non hanno bit in comune, mentre `6 && 1` vale 1, perché entrambi i numeri sono diversi da zero. Scrivere un simbolo al posto dell’altro è un errore classico.',
      'Gli operatori logici hanno una proprietà utile. Se il primo operando di `&&` è falso, il risultato è già deciso e il secondo non viene nemmeno calcolato. Questo comportamento si chiama [[cortocircuito]]. Permette di mettere una precondizione davanti all’operazione che protegge: in `b != 0 && a / b > 3` la divisione viene eseguita soltanto quando b è diverso da zero.'
    ]
  },
  esperimento: {
    faremo: [
      'Una stampante ha un byte di stato con quattro bit. Sceglierai lo stato, i bit richiesti per stampare e il tipo di domanda: tutti i bit richiesti, oppure almeno uno.',
      'Calcoleremo la AND fra stato e maschera una colonna alla volta, poi faremo il confronto finale. Guarda come lo stesso risultato della AND porta a due verdetti diversi secondo la domanda.'
    ],
    vedrai: [
      ['flag', 'Le quattro condizioni', 'In alto: accese quelle vere nello stato scelto.'],
      ['scudo', 'Stato, maschera e AND', 'Tre righe di bit, allineate sotto le condizioni.'],
      ['conflitto', 'Il verdetto', 'In basso: se la stampa parte, e quali bit richiesti mancano.']
    ]
  },
  lab: {
    titolo: 'La stampante può partire?',
    scena: { w: 860, h: 352 },
    atti: ['Lo stato', 'La AND con la maschera', 'Il confronto', 'Il verdetto'],
    nota: 'I passi sono dieci in ogni caso. Cambia lo stato e la domanda per vedere quando i due confronti danno verdetti diversi.',
    controlli: [
      { id: 's', tipo: 'scelta', eti: 'Stato', opzioni: [[7, '0111'], [5, '0101'], [3, '0011'], [14, '1110'], [8, '1000']], valore: 5 },
      { id: 'm', tipo: 'scelta', eti: 'Bit richiesti', opzioni: [[7, 'pronta, carta, coperchio'], [3, 'pronta, carta']], valore: 7 },
      { id: 'q', tipo: 'scelta', eti: 'Domanda', opzioni: [['tutti', 'tutti i bit richiesti'], ['uno', 'almeno un bit richiesto']], valore: 'tutti' }
    ],
    previsione: {
      domanda: (p) => 'Lo stato della stampante è ' + p.s.toString(2).padStart(4, '0') + ' e la maschera dei bit richiesti è ' + p.m.toString(2).padStart(4, '0') + '. Il programma chiede se sono accesi ' + (p.q === 'tutti' ? 'tutti i bit richiesti' : 'uno o più bit richiesti') + '. Che cosa decide?',
      opzioni: () => [['parte', 'La stampa parte'], ['attende', 'La stampante attende']]
    },
    confronto: (pred, esito, p) => 'Avevi previsto che la stampa ' + (pred === 'parte' ? 'partisse' : 'restasse in attesa') + '. Il programma ha deciso: ' + (esito === 'parte' ? 'la stampa parte' : 'la stampante attende') + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.q === 'tutti' ? 'Con la domanda «tutti» il risultato della AND deve essere uguale alla maschera intera.' : 'Con la domanda «almeno uno» basta che il risultato della AND sia diverso da zero, anche se mancano altri bit.'),
    costruisci(p) {
      const el = SL.el, passi = [];
      const NOMI = ['inchiostro', 'coperchio', 'carta', 'pronta'];           // dal bit 3 al bit 0
      const B4 = (v) => v.toString(2).padStart(4, '0').split('').map(Number);
      const H = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0');
      const St = B4(p.s), Ma = B4(p.m), and = p.s & p.m, manca = p.m & ~p.s & 15;
      const tutti = and === p.m, uno = and !== 0;
      const esito = (p.q === 'tutti' ? tutti : uno) ? 'parte' : 'attende';
      const R = [null, null, null, null];
      let verdetto = null, mancanti = null;
      const X = (j) => 196 + j * 166;
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('n1', 40, 112, 'stato', 'mono'), el.nota('n2', 40, 164, 'maschera', 'mono'), el.nota('n3', 40, 230, 'stato & maschera', 'mono', 'att'), el.linea('li', 196, 206, 846, 206, 'att')];
        for (let j = 0; j < 4; j++) {
          els.push(el.box('f' + j, X(j), 8, 152, 62, 'bit ' + (3 - j), NOMI[j], St[j] ? 'on' : 'off', { cls: 'stretta' }));
          els.push(el.cella('s' + j, X(j) + 48, 96, 56, 44, String(St[j]), o.col === j ? 'att' : St[j] ? 'on' : 'zero', { piccola: true }));
          els.push(el.cella('m' + j, X(j) + 48, 148, 56, 44, String(Ma[j]), o.col === j ? 'att' : Ma[j] ? 'on' : 'zero', { piccola: true }));
          els.push(el.cella('r' + j, X(j) + 48, 216, 56, 46, R[j] === null ? '·' : String(R[j]), o.col === j ? 'att' : R[j] === null ? 'off' : (o.manca && Ma[j] && !St[j] ? 'err' : R[j] ? 'on' : 'zero'), { piccola: true }));
        }
        els.push(el.box('ve', 40, 280, 400, 62, 'verdetto', verdetto || '·', verdetto ? (esito === 'parte' ? 'on' : 'err') : '', { sim: 'conflitto', riga: true }));
        els.push(el.box('mn', 470, 280, 370, 62, 'bit richiesti che mancano', mancanti === null ? '·' : mancanti, mancanti && mancanti !== 'nessuno' ? 'err' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Stato', H(p.s), 'a'], ['Maschera', H(p.m)], ['Stato & maschera', R.includes(null) ? '·' : H(and), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const vere = NOMI.filter((n, j) => St[j]);
      const persi = NOMI.filter((n, j) => Ma[j] && !St[j]);
      const frase = (uno1, piu) => (persi.length === 1 ? uno1 + ' la condizione «' + persi[0] + '»' : piu + ' le condizioni «' + persi.join('», «') + '»');

      P({}, 0, 'Lo stato della stampante', 'Il byte di stato vale ' + St.join('') + '. ' + (vere.length ? 'Le condizioni vere sono: ' + vere.join(', ') + '.' : 'Nessuna condizione è vera.') + ' Per stampare il programma richiede i bit della maschera ' + Ma.join('') + ', e chiede se sono accesi ' + (p.q === 'tutti' ? 'tutti.' : 'almeno in parte.'),
        { chiedi: { d: 'Nella colonna del bit 3 lo stato vale ' + St[0] + ' e la maschera vale ' + Ma[0] + '. Quanto vale la AND?', o: ['0', '1'], g: St[0] & Ma[0], no: 'La AND vale 1 soltanto quando entrambi i bit valgono 1. Dove la maschera vale 0 il risultato è 0, qualunque sia lo stato.' } });
      for (let j = 0; j < 4; j++) {
        R[j] = St[j] & Ma[j];
        P({ col: j }, 1, 'Il bit ' + (3 - j) + ': ' + NOMI[j], Ma[j]
          ? 'La maschera vale 1: questa condizione è richiesta. Lo stato vale ' + St[j] + ', quindi la AND dà ' + R[j] + (St[j] ? '. La condizione è soddisfatta.' : '. La condizione manca.')
          : 'La maschera vale 0: questa condizione non interessa. La AND dà 0 qualunque sia lo stato, che qui vale ' + St[j] + '.', { calc: St[j] + ' & ' + Ma[j] + ' = ' + R[j] });
      }
      P({}, 1, 'Il risultato della AND', 'Dalla AND esce ' + R.join('') + ', cioè ' + H(and) + '. Contiene soltanto i bit richiesti che sono davvero accesi. Ora va confrontato con qualcosa, e il termine di confronto dipende dalla domanda.',
        { calc: H(p.s) + ' & ' + H(p.m) + ' = ' + H(and), chiedi: { d: p.q === 'tutti' ? 'Il risultato è ' + H(and) + ' e la maschera è ' + H(p.m) + '. Sono uguali?' : 'Il risultato è ' + H(and) + '. È diverso da zero?', o: ['Sì', 'No'], g: (p.q === 'tutti' ? tutti : uno) ? 0 : 1, no: p.q === 'tutti' ? 'Il risultato vale ' + R.join('') + ' e la maschera vale ' + Ma.join('') + '.' : 'Il risultato vale ' + R.join('') + '.' } });
      P({}, 2, p.q === 'tutti' ? 'Il confronto con la maschera' : 'Il confronto con lo zero', p.q === 'tutti'
        ? 'La domanda è «tutti i bit richiesti». Il risultato deve essere uguale alla maschera intera: ' + H(and) + (tutti ? ' è uguale a ' : ' è diverso da ') + H(p.m) + '.'
        : 'La domanda è «almeno un bit richiesto». Basta che il risultato sia diverso da zero: ' + H(and) + (uno ? ' è diverso da zero.' : ' è zero.'),
        { calc: p.q === 'tutti' ? '(' + H(p.s) + ' & ' + H(p.m) + ') == ' + H(p.m) + ' ?' : '(' + H(p.s) + ' & ' + H(p.m) + ') != 0 ?', esito: [(p.q === 'tutti' ? tutti : uno) ? 'sì' : 'no', (p.q === 'tutti' ? tutti : uno) ? 'si' : 'no'] });
      mancanti = manca ? NOMI.filter((n, j) => Ma[j] && !St[j]).join(', ') : 'nessuno';
      P({ manca: true }, 2, 'I bit che mancano', manca
        ? 'I bit richiesti e spenti si trovano con un’altra maschera: i bit a 1 nella maschera e a 0 nello stato, cioè maschera & ~stato. Qui il risultato è ' + H(manca) + ': ' + frase('manca', 'mancano') + '.'
        : 'Tutti i bit richiesti sono accesi. Il calcolo maschera & ~stato dà zero: non manca nulla.', { calc: H(p.m) + ' & ~' + H(p.s) + ' = ' + H(manca) });
      verdetto = esito === 'parte' ? 'la stampa parte' : 'la stampante attende';
      P({ manca: true }, 3, esito === 'parte' ? 'La stampa parte' : 'La stampante attende', (p.q === 'tutti'
        ? (tutti ? 'Tutte le condizioni richieste sono vere, e il programma avvia la stampa.' : 'Almeno una condizione richiesta è falsa, e il programma tiene ferma la stampante.')
        : (uno ? 'Una o più condizioni richieste sono vere, e tanto basta a questa domanda: il programma avvia la stampa' + (manca ? ', benché ' + frase('manchi', 'manchino') + '.' : '.') : 'Nessuna condizione richiesta è vera, e il programma tiene ferma la stampante.')));
      P({ manca: true }, 3, 'La stessa AND, l’altra domanda', (tutti === uno
        ? 'Con l’altra domanda il verdetto sarebbe stato lo stesso: in questo stato i bit richiesti sono ' + (tutti ? 'tutti accesi.' : 'tutti spenti.')
        : 'Con l’altra domanda il verdetto sarebbe stato l’opposto. Il risultato ' + H(and) + ' è diverso da zero e diverso dalla maschera: «almeno uno» direbbe sì, «tutti» direbbe no. Una stampante a cui ' + frase('manca', 'mancano') + ' partirebbe per un confronto scritto male.'), { calc: 'tutti: ' + (tutti ? 'sì' : 'no') + ' · almeno uno: ' + (uno ? 'sì' : 'no') });
      return { passi, esito };
    }
  },
  bilancio: {
    regola: [
      'Un byte di stato impacchetta più condizioni, una per bit. Per interrogarlo si calcola stato & maschera e si confronta il risultato.',
      'Diverso da zero significa che almeno un bit richiesto è acceso. Uguale alla maschera significa che lo sono tutti. Gli operatori logici &&, || e ! lavorano sugli operandi interi e restituiscono 0 oppure 1.'
    ],
    errori: [
      ['Confrontare con zero quando servono tutti i bit.', 'Il confronto con zero si accontenta di un bit solo. Per richiederli tutti si confronta con la maschera.'],
      ['Scrivere & al posto di &&.', 'Con 6 e 1 la AND bit a bit dà 0, mentre quella logica dà 1. I due operatori rispondono a domande diverse.'],
      ['Mettere la precondizione dopo l’operazione.', 'Il cortocircuito protegge soltanto ciò che viene dopo. La condizione di sicurezza va scritta per prima.']
    ],
    saFare: ['Interrogo un bit di stato con una maschera.', 'Scelgo il confronto giusto per «tutti» e per «almeno uno».', 'Distinguo gli operatori bit a bit da quelli logici e spiego il cortocircuito.'],
    esercizi: [
      { d: 'Lo stato vale `0x05` e la maschera dei bit richiesti vale `0x07`. Quanto vale maschera & ~stato, cioè il byte dei bit richiesti che mancano? Scrivilo in esadecimale.', segnaposto: 'Due cifre esadecimali', giuste: ['02', '0x02', '2', '0x2'],
        ok: 'In binario 0111 & 1010 dà 0010: manca il bit 1.',
        diagnosi: [
          { se: ['05', '0x05', '5', '0x5'], msg: 'Quello è stato & maschera, cioè i bit richiesti che ci sono. La domanda chiede quelli che mancano.' },
          { se: ['07', '0x07', '7', '0x7'], msg: 'Quella è la maschera intera. Vanno tolti i bit che nello stato sono già accesi.' },
          { se: ['fa', '0xfa'], msg: 'Quello è lo stato rovesciato. Manca la AND con la maschera, che tiene soltanto i bit richiesti.' }
        ],
        altro: 'Il valore è diverso. Rovescia i bit dello stato e fai la AND con la maschera.',
        indizi: ['Lo stato 0x05 è 0101, e rovesciato sui quattro bit bassi diventa 1010.', 'La maschera 0x07 è 0111.', 'La AND di 0111 e 1010 tiene soltanto il bit 1.'],
        svolgimento: ['~stato, sui quattro bit bassi: 1010.', 'maschera & ~stato: 0111 & 1010 = 0010.', 'Il risultato è 0x02: manca il bit 1.'] },
      { d: 'In un programma C, quanto valgono le espressioni `6 & 1` e `6 && 1`?', guida: 'Scegli la risposta.', o: [
        { t: '0 e 1', ok: true, fb: 'I bit 110 e 001 non hanno posizioni in comune, quindi la AND bit a bit dà 0. I due numeri sono entrambi diversi da zero, quindi la AND logica dà 1.' },
        { t: '1 e 1', fb: 'La AND bit a bit confronta le colonne: 110 e 001 non hanno 1 nella stessa posizione.' },
        { t: '0 e 0', fb: 'La AND logica guarda ogni operando per intero. Sia 6 sia 1 sono diversi da zero, cioè veri.' }] }
    ],
    sfida: ['lez05_04_c_bitwise_expression', 'Espressioni e maschere in C']
  }
});
