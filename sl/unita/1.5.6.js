'use strict';
SL.registra('1.5.6', {
  titolo: 'Ragionamento booleano nel codice di sistema',
  obiettivo: 'Obiettivo: interrogare un byte di stato con una maschera, distinguere la condizione «tutti i bit» dalla condizione «almeno un bit», e distinguere gli operatori bit a bit da quelli logici.',
  concetti: [['flag', 'Bit di stato'], ['scudo', 'Maschera'], ['conflitto', 'Condizione']],
  filigrana: ['flag', 'scudo', 'porta'],
  richiami: {
    carte: [
      { sim: 'scudo', da: 'Dall’unità 1.5.3', t: 'La maschera', d: 'Un byte scelto per indicare le posizioni di interesse. Con la AND si conservano soltanto i bit selezionati dalla maschera.' },
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'La AND', d: 'Vale 1 soltanto quando entrambi gli ingressi valgono 1.' },
      { sim: 'scudo', da: 'Dall’unità 1.4.4', t: 'La precondizione', d: 'Condizione da verificare prima di un’operazione, affinché il risultato sia valido.' }
    ],
    domanda: { d: 'Prima di proseguire: quanto vale `0x05 & 0x07`?', o: [
      { t: '0x07', fb: 'Il valore indicato è il risultato della OR. Con la AND si conservano soltanto i bit a 1 in entrambi i byte.' },
      { t: '0x05', ok: true, fb: 'In binario 0101 & 0111 dà 0101: la maschera conserva tutti i bit di 0x05.' },
      { t: '0x02', fb: 'Il valore indicato è il bit che manca a 0x05 per raggiungere 0x07. La AND restituisce i bit comuni.' }
    ] }
  },
  idea: {
    titolo: 'Otto condizioni in un byte',
    termini: ['bit di stato', 'operatore logico', 'cortocircuito'],
    testo: [
      'Un programma di sistema deve conservare numerose condizioni a due valori, vero o falso. Poiché riservare un byte intero a ciascuna sarebbe inefficiente, le condizioni sono compattate: un bit per ciascuna, otto in un byte. Un bit impiegato in questo modo prende il nome di [[bit di stato]].',
      'Si consideri una stampante. Il bit 0 del suo byte di stato indica se è pronta, il bit 1 se la carta è presente, il bit 2 se il coperchio è chiuso, il bit 3 se l’inchiostro è presente. Il byte 0101 descrive una stampante pronta, priva di carta, con il coperchio chiuso e priva di inchiostro.',
      'Per interrogare un bit si impiega una maschera con quel solo bit a 1. La carta corrisponde alla maschera 0010, cioè 0x02. Se `stato & 0x02` è diverso da zero, la carta è presente.',
      'Con più bit le condizioni possibili sono due, e la loro confusione è l’errore più frequente. La stampa può avviarsi soltanto se la stampante è pronta, dispone di carta e ha il coperchio chiuso: tre bit, maschera 0111, cioè 0x07. Verificare che `stato & 0x07` sia diverso da zero equivale a verificare che almeno una delle tre condizioni sia vera. Per verificare che lo siano tutte e tre occorre confrontare il risultato con la maschera intera: `(stato & 0x07) == 0x07`.',
      { fig: 'celle', titolo: 'Lo stato 0101 contro la maschera 0111', nota: 'Il risultato 0101 è diverso da zero e diverso dalla maschera: almeno una condizione è vera, e manca la carta.', celle: [
        { so: 'inchiostro', v: '0', gi: 'non richiesto' }, { so: 'coperchio', v: '1', st: 'on', gi: 'presente' }, { so: 'carta', v: '0', st: 'amb', gi: 'manca' }, { so: 'pronta', v: '1', st: 'on', gi: 'presente' }] },
      'Il C dispone inoltre di tre [[operatore logico|operatori logici]], scritti `&&`, `||` e `!`. Essi somigliano a quelli bit a bit e svolgono una funzione diversa: considerano ciascun operando per intero, falso se vale zero e vero in caso contrario, e restituiscono 0 oppure 1. Pertanto `6 & 1` vale 0, poiché 110 e 001 sono privi di bit in comune, mentre `6 && 1` vale 1, poiché entrambi i numeri sono diversi da zero. La sostituzione di un simbolo con l’altro è un errore tipico.',
      'Gli operatori logici presentano una proprietà utile. Se il primo operando di `&&` è falso, il risultato è già determinato e il calcolo del secondo operando è omesso. Tale comportamento prende il nome di [[cortocircuito]], e consente di anteporre una precondizione all’operazione che essa protegge: in `b != 0 && a / b > 3` la divisione è eseguita soltanto quando b è diverso da zero.'
    ]
  },
  esperimento: {
    faremo: [
      'Una stampante dispone di un byte di stato con quattro bit. I controlli fissano lo stato, i bit richiesti per la stampa e il tipo di condizione: tutti i bit richiesti, oppure almeno uno.',
      'La AND fra stato e maschera è calcolata una colonna alla volta, ed è seguita dal confronto finale. Il medesimo risultato della AND conduce a due esiti diversi secondo la condizione scelta.'
    ],
    vedrai: [
      ['flag', 'Le quattro condizioni', 'In alto: accese quelle vere nello stato scelto.'],
      ['scudo', 'Stato, maschera e AND', 'Tre righe di bit, allineate sotto le condizioni.'],
      ['conflitto', 'Il verdetto', 'In basso: l’avvio o meno della stampa, e i bit richiesti mancanti.']
    ]
  },
  lab: {
    titolo: 'Avvio della stampa',
    scena: { w: 860, h: 352 },
    atti: ['Lo stato', 'La AND con la maschera', 'Il confronto', 'Il verdetto'],
    nota: 'I passi sono dieci in ogni caso. Variando lo stato e la condizione si individuano i casi in cui i due confronti forniscono esiti diversi.',
    controlli: [
      { id: 's', tipo: 'scelta', eti: 'Stato', opzioni: [[7, '0111'], [5, '0101'], [3, '0011'], [14, '1110'], [8, '1000']], valore: 5 },
      { id: 'm', tipo: 'scelta', eti: 'Bit richiesti', opzioni: [[7, 'pronta, carta, coperchio'], [3, 'pronta, carta']], valore: 7 },
      { id: 'q', tipo: 'scelta', eti: 'Condizione', opzioni: [['tutti', 'tutti i bit richiesti'], ['uno', 'almeno un bit richiesto']], valore: 'tutti' }
    ],
    previsione: {
      domanda: (p) => 'Lo stato della stampante è ' + p.s.toString(2).padStart(4, '0') + ' e la maschera dei bit richiesti è ' + p.m.toString(2).padStart(4, '0') + '. Il programma verifica se sono accesi ' + (p.q === 'tutti' ? 'tutti i bit richiesti' : 'uno o più bit richiesti') + '. Quale decisione prende?',
      opzioni: () => [['parte', 'La stampa si avvia'], ['attende', 'La stampante resta in attesa']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava che la stampa ' + (pred === 'parte' ? 'si avviasse' : 'restasse in attesa') + '. Il programma ha deciso: ' + (esito === 'parte' ? 'la stampa si avvia' : 'la stampante resta in attesa') + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.q === 'tutti' ? 'Con la condizione «tutti» il risultato della AND deve essere uguale alla maschera intera.' : 'Con la condizione «almeno uno» è sufficiente che il risultato della AND sia diverso da zero, anche in assenza di altri bit.'),
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
        els.push(el.box('ve', 40, 280, 400, 62, 'esito', verdetto || '·', verdetto ? (esito === 'parte' ? 'on' : 'err') : '', { sim: 'conflitto', riga: true }));
        els.push(el.box('mn', 470, 280, 370, 62, 'bit richiesti mancanti', mancanti === null ? '·' : mancanti, mancanti && mancanti !== 'nessuno' ? 'err' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Stato', H(p.s), 'a'], ['Maschera', H(p.m)], ['Stato & maschera', R.includes(null) ? '·' : H(and), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const vere = NOMI.filter((n, j) => St[j]);
      const persi = NOMI.filter((n, j) => Ma[j] && !St[j]);
      const frase = (uno1, piu) => (persi.length === 1 ? uno1 + ' la condizione «' + persi[0] + '»' : piu + ' le condizioni «' + persi.join('», «') + '»');

      P({}, 0, 'Lo stato della stampante', 'Il byte di stato vale ' + St.join('') + '. ' + (vere.length ? 'Le condizioni vere sono: ' + vere.join(', ') + '.' : 'Nessuna condizione è vera.') + ' Per la stampa il programma richiede i bit della maschera ' + Ma.join('') + ', e verifica se sono accesi ' + (p.q === 'tutti' ? 'tutti.' : 'almeno in parte.'),
        { chiedi: { d: 'Nella colonna del bit 3 lo stato vale ' + St[0] + ' e la maschera vale ' + Ma[0] + '. Quanto vale la AND?', o: ['0', '1'], g: St[0] & Ma[0], no: 'La AND vale 1 soltanto quando entrambi i bit valgono 1. Dove la maschera vale 0 il risultato è 0, qualunque sia lo stato.' } });
      for (let j = 0; j < 4; j++) {
        R[j] = St[j] & Ma[j];
        P({ col: j }, 1, 'Il bit ' + (3 - j) + ': ' + NOMI[j], Ma[j]
          ? 'La maschera vale 1: questa condizione è richiesta. Lo stato vale ' + St[j] + ', quindi la AND dà ' + R[j] + (St[j] ? '. La condizione è soddisfatta.' : '. La condizione manca.')
          : 'La maschera vale 0: questa condizione è irrilevante. La AND dà 0 qualunque sia lo stato, che in questo caso vale ' + St[j] + '.', { calc: St[j] + ' & ' + Ma[j] + ' = ' + R[j] });
      }
      P({}, 1, 'Il risultato della AND', 'La AND fornisce ' + R.join('') + ', cioè ' + H(and) + '. Esso contiene soltanto i bit richiesti effettivamente accesi. Va ora confrontato con un valore di riferimento, che dipende dalla condizione scelta.',
        { calc: H(p.s) + ' & ' + H(p.m) + ' = ' + H(and), chiedi: { d: p.q === 'tutti' ? 'Il risultato è ' + H(and) + ' e la maschera è ' + H(p.m) + '. Sono uguali?' : 'Il risultato è ' + H(and) + '. È diverso da zero?', o: ['Sì', 'No'], g: (p.q === 'tutti' ? tutti : uno) ? 0 : 1, no: p.q === 'tutti' ? 'Il risultato vale ' + R.join('') + ' e la maschera vale ' + Ma.join('') + '.' : 'Il risultato vale ' + R.join('') + '.' } });
      P({}, 2, p.q === 'tutti' ? 'Il confronto con la maschera' : 'Il confronto con lo zero', p.q === 'tutti'
        ? 'La condizione è «tutti i bit richiesti». Il risultato deve essere uguale alla maschera intera: ' + H(and) + (tutti ? ' è uguale a ' : ' è diverso da ') + H(p.m) + '.'
        : 'La condizione è «almeno un bit richiesto». È sufficiente che il risultato sia diverso da zero: ' + H(and) + (uno ? ' è diverso da zero.' : ' è zero.'),
        { calc: p.q === 'tutti' ? '(' + H(p.s) + ' & ' + H(p.m) + ') == ' + H(p.m) + ' ?' : '(' + H(p.s) + ' & ' + H(p.m) + ') != 0 ?', esito: [(p.q === 'tutti' ? tutti : uno) ? 'sì' : 'no', (p.q === 'tutti' ? tutti : uno) ? 'si' : 'no'] });
      mancanti = manca ? NOMI.filter((n, j) => Ma[j] && !St[j]).join(', ') : 'nessuno';
      P({ manca: true }, 2, 'I bit mancanti', manca
        ? 'I bit richiesti e spenti si individuano con un’ulteriore operazione: i bit a 1 nella maschera e a 0 nello stato, cioè maschera & ~stato. In questo caso il risultato è ' + H(manca) + ': ' + frase('manca', 'mancano') + '.'
        : 'Tutti i bit richiesti sono accesi. Il calcolo maschera & ~stato dà zero: nessun bit è mancante.', { calc: H(p.m) + ' & ~' + H(p.s) + ' = ' + H(manca) });
      verdetto = esito === 'parte' ? 'la stampa si avvia' : 'la stampante resta in attesa';
      P({ manca: true }, 3, esito === 'parte' ? 'La stampa si avvia' : 'La stampante resta in attesa', (p.q === 'tutti'
        ? (tutti ? 'Tutte le condizioni richieste sono vere, e il programma avvia la stampa.' : 'Almeno una condizione richiesta è falsa, e il programma mantiene la stampante in attesa.')
        : (uno ? 'Una o più condizioni richieste sono vere, e ciò è sufficiente per questa condizione: il programma avvia la stampa' + (manca ? ', benché ' + frase('manchi', 'manchino') + '.' : '.') : 'Nessuna condizione richiesta è vera, e il programma mantiene la stampante in attesa.')));
      P({ manca: true }, 3, 'La medesima AND con l’altra condizione', (tutti === uno
        ? 'Con l’altra condizione l’esito sarebbe stato il medesimo: in questo stato i bit richiesti sono ' + (tutti ? 'tutti accesi.' : 'tutti spenti.')
        : 'Con l’altra condizione l’esito sarebbe stato opposto. Il risultato ' + H(and) + ' è diverso da zero e diverso dalla maschera: «almeno uno» risulterebbe vera, «tutti» falsa. Una stampante alla quale ' + frase('manca', 'mancano') + ' si avvierebbe a causa di un confronto errato.'), { calc: 'tutti: ' + (tutti ? 'sì' : 'no') + ' · almeno uno: ' + (uno ? 'sì' : 'no') });
      return { passi, esito };
    }
  },
  bilancio: {
    regola: [
      'Un byte di stato raccoglie più condizioni, una per bit. Per interrogarlo si calcola stato & maschera e si confronta il risultato.',
      'Un risultato diverso da zero indica che almeno un bit richiesto è acceso. Un risultato uguale alla maschera indica che lo sono tutti. Gli operatori logici &&, || e ! operano sugli operandi interi e restituiscono 0 oppure 1.'
    ],
    errori: [
      ['Confrontare con zero quando occorrono tutti i bit.', 'Il confronto con zero è soddisfatto da un solo bit. Per richiederli tutti si confronta con la maschera.'],
      ['Scrivere & al posto di &&.', 'Con 6 e 1 la AND bit a bit dà 0, mentre quella logica dà 1. I due operatori calcolano funzioni diverse.'],
      ['Porre la precondizione dopo l’operazione.', 'Il cortocircuito protegge soltanto quanto segue. La condizione di sicurezza va scritta per prima.']
    ],
    saFare: ['Interrogare un bit di stato con una maschera.', 'Scegliere il confronto corretto per «tutti» e per «almeno uno».', 'Distinguere gli operatori bit a bit da quelli logici e illustrare il cortocircuito.'],
    esercizi: [
      { d: 'Lo stato vale `0x05` e la maschera dei bit richiesti vale `0x07`. Quanto vale maschera & ~stato, cioè il byte dei bit richiesti mancanti? Lo si scriva in esadecimale.', segnaposto: 'Due cifre esadecimali', giuste: ['02', '0x02', '2', '0x2'],
        ok: 'In binario 0111 & 1010 dà 0010: manca il bit 1.',
        diagnosi: [
          { se: ['05', '0x05', '5', '0x5'], msg: 'Il valore indicato è stato & maschera, cioè i bit richiesti presenti. Sono richiesti quelli mancanti.' },
          { se: ['07', '0x07', '7', '0x7'], msg: 'Il valore indicato è la maschera intera. Vanno esclusi i bit che nello stato sono già accesi.' },
          { se: ['fa', '0xfa'], msg: 'Il valore indicato è lo stato invertito. Manca la AND con la maschera, che conserva soltanto i bit richiesti.' }
        ],
        altro: 'Il valore è diverso. Si invertano i bit dello stato e si calcoli la AND con la maschera.',
        indizi: ['Lo stato 0x05 è 0101, e invertito sui quattro bit bassi diventa 1010.', 'La maschera 0x07 è 0111.', 'La AND di 0111 e 1010 conserva soltanto il bit 1.'],
        svolgimento: ['~stato, sui quattro bit bassi: 1010.', 'maschera & ~stato: 0111 & 1010 = 0010.', 'Il risultato è 0x02: manca il bit 1.'] },
      { d: 'In un programma C, quanto valgono le espressioni `6 & 1` e `6 && 1`?', guida: 'Si scelga la risposta.', o: [
        { t: '0 e 1', ok: true, fb: 'I bit 110 e 001 sono privi di posizioni in comune, e la AND bit a bit dà quindi 0. I due numeri sono entrambi diversi da zero, e la AND logica dà quindi 1.' },
        { t: '1 e 1', fb: 'La AND bit a bit confronta le colonne: 110 e 001 non hanno 1 nella stessa posizione.' },
        { t: '0 e 0', fb: 'La AND logica considera ogni operando per intero. Sia 6 sia 1 sono diversi da zero, cioè veri.' }] }
    ],
    sfida: ['lez05_04_c_bitwise_expression', 'Espressioni e maschere in C']
  }
});
