'use strict';
SL.registra('2.6.1', {
  titolo: 'La convenzione delle chiamate di funzione',
  obiettivo: 'Alla fine saprai dire dove una funzione trova ciascuno dei suoi argomenti: quali nei registri, quali sulla pila e a quale distanza dalla cima.',
  concetti: [['input', 'Sei registri'], ['pila', 'La pila'], ['puntatore', 'L’indirizzo di ritorno']],
  filigrana: ['pila', 'input', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'input', da: 'Dall’unità 2.2.2', t: 'Convenzione di chiamata', d: 'L’accordo che fissa dove stanno gli argomenti di una funzione e dove torna il risultato.' },
      { sim: 'tabella', da: 'Dall’unità 2.5.2', t: 'I registri degli argomenti', d: 'Una funzione riceve i primi sei argomenti interi in RDI, RSI, RDX, RCX, R8 e R9.' },
      { sim: 'memory', da: 'Dall’unità 2.5.4', t: 'L’immagine di un processo', d: 'Fra le mappature di ogni processo c’è una zona di lavoro, la pila, che il kernel prepara alla partenza.' }
    ],
    domanda: { d: 'Prima di proseguire: in quale registro una funzione trova il suo terzo argomento intero?', o: [
      { t: 'RDX', ok: true, fb: 'L’ordine è RDI, RSI, RDX, RCX, R8, R9. Il terzo posto spetta a RDX.' },
      { t: 'RCX', fb: 'RCX porta il quarto argomento. Il terzo viaggia in RDX.' },
      { t: 'R10', fb: 'R10 è usato dalle chiamate di sistema, per il quarto argomento. Nelle funzioni il terzo viaggia in RDX.' }
    ] }
  },
  idea: {
    titolo: 'Quando i registri non bastano',
    termini: ['pila', 'rsp', 'push', 'call', 'indirizzo di ritorno'],
    testo: [
      'Chi chiama una funzione deve consegnarle gli argomenti in un posto concordato. I primi sei argomenti interi viaggiano nei registri RDI, RSI, RDX, RCX, R8 e R9, e il risultato torna in RAX. Una funzione, però, può riceverne di più. Per quelli in eccesso serve la memoria.',
      'La zona di memoria usata a questo scopo è la [[pila]]. Il nome descrive il modo in cui si usa: come una pila di piatti, dove l’ultimo posato è il primo a essere ripreso. Il registro [[rsp|RSP]] contiene l’indirizzo della cima, cioè dell’ultimo dato posato. Per ragioni storiche la pila cresce verso gli indirizzi bassi: posare un dato fa diminuire RSP.',
      'L’istruzione [[push|PUSH]] posa un dato di otto byte. Prima toglie 8 a RSP, poi scrive il dato all’indirizzo che RSP contiene. Gli argomenti dal settimo in poi vengono posati così, a partire dall’ultimo: in questo modo il settimo resta il più vicino alla cima.',
      'Resta da trasferire il controllo. L’istruzione [[call|CALL]] salta alla prima istruzione della funzione, ma prima posa sulla pila l’[[indirizzo di ritorno]]: l’indirizzo dell’istruzione che la segue, da cui il chiamante riprenderà. All’ingresso nella funzione, quindi, la cima della pila contiene l’indirizzo di ritorno, e gli argomenti posati dal chiamante stanno subito sopra.',
      { fig: 'scena', w: 720, h: 150, titolo: 'La pila all’ingresso di una funzione con otto argomenti', nota: 'Gli indirizzi più alti stanno in alto. Il settimo argomento si trova otto byte sopra la cima, l’ottavo sedici.', els:
        SL.x86.pila('p', [{ a: 0x7FF8, txt: 'ottavo argomento', nota: '[rsp + 16]' }, { a: 0x7FF0, txt: 'settimo argomento', nota: '[rsp + 8]' }, { a: 0x7FE8, txt: 'indirizzo di ritorno', nota: '[rsp]', st: 'att' }], { x: 60, y: 6, w: 260, rsp: 0x7FE8 }) },
      'La funzione legge gli argomenti in memoria con un operando che parte da RSP. Al suo ingresso `[rsp]` è l’indirizzo di ritorno, `[rsp + 8]` è il settimo argomento, `[rsp + 16]` è l’ottavo. La sede di un argomento dipende soltanto dalla sua posizione nell’elenco.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma chiama una funzione con otto argomenti interi consecutivi. Sceglierai il valore del primo e quale argomento seguire.',
      'Vedremo il chiamante posare due argomenti sulla pila, mettere gli altri nei registri ed eseguire CALL. Poi cercheremo l’argomento scelto come lo cerca la funzione. Dopo il caso proposto, segui il sesto argomento e confronta.'
    ],
    vedrai: [
      ['register', 'I sei registri', 'A sinistra: i registri degli argomenti, con i valori che il chiamante vi mette.'],
      ['pila', 'La pila', 'A destra: le celle della pila, da otto byte l’una, con la cima indicata da RSP.'],
      ['lente', 'La sede dell’argomento', 'In basso: dove la funzione trova l’argomento che stai seguendo.']
    ]
  },
  lab: {
    titolo: 'Otto argomenti, sei registri',
    scena: { w: 860, h: 372 },
    atti: ['Otto argomenti', 'Due sulla pila', 'Sei nei registri', 'La chiamata', 'La sede dell’argomento'],
    controlli: [
      { id: 'i', tipo: 'num', eti: 'Argomento da seguire', min: 1, max: 8, salti: [1], valore: 7 },
      { id: 'b', tipo: 'scelta', eti: 'Valore del primo argomento', opzioni: [[10, '10'], [20, '20'], [100, '100']], valore: 10 }
    ],
    nota: 'Gli otto argomenti sono numeri consecutivi. Prima della chiamata RSP vale 0x8000.',
    previsione: {
      domanda: (p) => 'Una funzione riceve otto argomenti interi. Dove trova, al proprio ingresso, l’argomento numero ' + p.i + '?',
      opzioni: (p) => { const U = SL.unita261; return p.i <= 6 ? Array.from(new Set([U.REG[p.i - 1], U.REG[p.i % 6], 'RAX', '[rsp + 8]'])).sort() : ['R9', '[rsp]', '[rsp + 8]', '[rsp + 16]']; }
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + pred + '. La funzione lo trova in ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.i <= 6 ? 'I primi sei argomenti viaggiano nei registri, nell’ordine RDI, RSI, RDX, RCX, R8, R9.' : 'I registri bastano per sei argomenti. Dal settimo in poi stanno sulla pila, sopra l’indirizzo di ritorno che occupa la cima.'),
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita261, passi = [], V = (k) => p.b + k - 1, SEDE = U.sede(p.i);
      const st = { rsp: 0x8000, c8: null, c7: null, rit: null, reg: false };
      const quadro = (o) => {
        const els = [el.nota('n1', 20, 0, 'REGISTRI DEGLI ARGOMENTI', 'mono'), el.nota('n2', 420, 0, 'LA PILA', 'mono')];
        U.REG.forEach((r, k) => els.push(el.box('r' + k, 20 + (k % 2) * 180, 28 + Math.floor(k / 2) * 66, 170, 58, (k + 1) + '° · ' + r, st.reg ? String(V(k + 1)) : '·', o.trova && p.i === k + 1 ? 'att' : o.reg ? 'att' : st.reg ? 'on' : '', { cls: 'stretta' })));
        X.pila('s', [{ a: 0x8000, txt: 'del chiamante', st: '' }, { a: 0x7FF8, txt: st.c8, nota: st.c8 != null ? '8° argomento' : null, st: o.nuova === 0x7FF8 || (o.trova && p.i === 8) ? 'att' : null }, { a: 0x7FF0, txt: st.c7, nota: st.c7 != null ? '7° argomento' : null, st: o.nuova === 0x7FF0 || (o.trova && p.i === 7) ? 'att' : null }, { a: 0x7FE8, txt: st.rit, nota: st.rit != null ? 'ritorno' : null, st: o.nuova === 0x7FE8 ? 'att' : null }], { x: 420, y: 28, w: 160, passo: 52, rsp: st.rsp }).forEach((e) => els.push(e));
        els.push(el.box('ist', 20, 240, 350, 58, 'istruzione del chiamante', o.ist || '·', o.ist ? 'att' : '', { cls: 'stretta' }),
          el.box('rsp', 420, 240, 200, 58, 'RSP', '0x' + st.rsp.toString(16).toUpperCase(), o.nuova ? 'att' : 'on', { cls: 'stretta' }),
          el.box('sed', 20, 310, 820, 54, 'l’argomento numero ' + p.i + ', che vale ' + V(p.i) + ', si trova in', o.trova ? SEDE + (p.i > 6 ? ', cioè all’indirizzo 0x' + (0x7FE8 + (p.i - 6) * 8).toString(16).toUpperCase() : '') : '·', o.trova ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Argomento ' + p.i, String(V(p.i)), 'a'], ['RSP', '0x' + st.rsp.toString(16).toUpperCase()], ['Sede', st.rit != null ? SEDE : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Otto argomenti da consegnare', 'Il chiamante deve consegnare alla funzione otto argomenti: i numeri da ' + V(1) + ' a ' + V(8) + '. La pila è ferma a 0x8000, dove RSP indica gli ultimi dati posati dal chiamante.',
        { chiedi: { d: 'I registri degli argomenti sono sei. Dove andranno il settimo e l’ottavo argomento?', o: ['In altri due registri', 'Sulla pila', 'Vengono scartati'], g: 1, no: 'La convenzione assegna agli argomenti sei registri. Quelli in eccesso vengono posati sulla pila.' } });
      st.rsp = 0x7FF8; st.c8 = V(8);
      P({ ist: 'push ' + V(8), nuova: 0x7FF8 }, 1, 'L’ottavo argomento', 'PUSH toglie 8 a RSP, che scende a 0x7FF8, e scrive il valore ' + V(8) + ' nella cella che ora fa da cima. Il chiamante comincia dall’ultimo argomento, perché ciò che viene posato dopo finisce più vicino alla cima.', { calc: '0x8000 − 8 = 0x7FF8' });
      st.rsp = 0x7FF0; st.c7 = V(7);
      P({ ist: 'push ' + V(7), nuova: 0x7FF0 }, 1, 'Il settimo argomento', 'Un secondo PUSH porta RSP a 0x7FF0 e vi scrive ' + V(7) + ', il settimo argomento. La pila è cresciuta di sedici byte, verso gli indirizzi bassi.', { calc: '0x7FF8 − 8 = 0x7FF0' });
      st.reg = true;
      P({ ist: 'mov edi, ' + V(1) + ' … mov r9d, ' + V(6), reg: true }, 2, 'I primi sei nei registri', 'Sei istruzioni MOV mettono i primi sei argomenti nei registri previsti: ' + V(1) + ' in RDI, ' + V(2) + ' in RSI, e così via fino a ' + V(6) + ' in R9. La pila resta com’è.',
        { chiedi: { d: 'Ora il chiamante esegue CALL. Che cosa poserà CALL sulla pila, prima di saltare alla funzione?', o: ['Il primo argomento', 'L’indirizzo di ritorno', 'Nulla'], g: 1, no: 'CALL posa l’indirizzo dell’istruzione che la segue. Senza di esso la funzione non saprebbe dove tornare.' } });
      st.rsp = 0x7FE8; st.rit = '0x401234';
      P({ ist: 'call funzione', nuova: 0x7FE8 }, 3, 'La chiamata', 'CALL posa sulla pila l’indirizzo di ritorno, 0x401234, e porta RSP a 0x7FE8. Poi salta alla prima istruzione della funzione. La cima della pila contiene ora l’indirizzo di ritorno, e i due argomenti stanno subito sopra.', { calc: '0x7FF0 − 8 = 0x7FE8' });
      P({ trova: true }, 4, 'Dove cerca la funzione', (p.i <= 6 ? 'L’argomento numero ' + p.i + ' è fra i primi sei: la funzione lo trova nel registro ' + SEDE + ', che contiene ' + V(p.i) + '. Nessun accesso alla memoria è necessario.' : 'L’argomento numero ' + p.i + ' è oltre il sesto, e sta sulla pila. La cima è occupata dall’indirizzo di ritorno. Il ' + (p.i === 7 ? 'settimo argomento si trova otto byte sopra, a 0x7FF0, e la funzione lo legge con `[rsp + 8]`.' : 'ottavo argomento si trova sedici byte sopra, a 0x7FF8, e la funzione lo legge con `[rsp + 16]`.')) + ' La sede dipende dalla posizione nell’elenco, qualunque sia il valore.', { calc: SEDE + ' = ' + V(p.i), esito: [SEDE, 'si'] });
      return { passi, esito: SEDE };
    }
  },
  bilancio: {
    regola: [
      'I primi sei argomenti interi viaggiano in RDI, RSI, RDX, RCX, R8 e R9. Gli altri vengono posati sulla pila, a partire dall’ultimo.',
      'CALL posa l’indirizzo di ritorno e salta alla funzione. Al suo ingresso `[rsp]` è l’indirizzo di ritorno, `[rsp + 8]` il settimo argomento, `[rsp + 16]` l’ottavo.'
    ],
    errori: [
      ['Cercare il settimo argomento in cima alla pila.', 'La cima è occupata dall’indirizzo di ritorno, posato da CALL per ultimo. Il settimo argomento sta otto byte sopra.'],
      ['Pensare che la pila cresca verso gli indirizzi alti.', 'Ogni PUSH toglie 8 a RSP. I dati posati più di recente hanno gli indirizzi più bassi.'],
      ['Posare gli argomenti dal settimo in avanti.', 'Si comincia dall’ultimo. Così il settimo, posato per ultimo, resta il più vicino alla cima.']
    ],
    saFare: ['Elenco i sei registri degli argomenti, nell’ordine.', 'Calcolo come cambia RSP dopo PUSH e dopo CALL.', 'Trovo sulla pila gli argomenti oltre il sesto.'],
    esercizi: [
      { d: 'RSP vale 0x7000. Il programma esegue due istruzioni PUSH e poi una CALL. Quanto vale RSP all’ingresso della funzione? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x6FF0', giuste: ['0x6fe8', '6fe8', '6fe8h'],
        ok: 'Ogni PUSH toglie 8 a RSP, e anche CALL, che posa l’indirizzo di ritorno. In tutto 24 byte: 0x7000 − 0x18 = 0x6FE8.',
        diagnosi: [
          { se: ['0x6ff0', '6ff0'], msg: 'Questo è RSP dopo i due PUSH. Anche CALL posa un dato di otto byte, l’indirizzo di ritorno.' },
          { se: ['0x7018', '7018'], msg: 'La pila cresce verso gli indirizzi bassi: ogni dato posato fa diminuire RSP.' },
          { se: ['0x6976', '6976', '0x6fd6'], msg: 'I 24 byte vanno scritti in esadecimale prima di sottrarli: 24 = 0x18.' },
          { se: ['0x6ffd', '6ffd'], msg: 'Ogni dato posato occupa otto byte, e i dati sono tre.' }
        ],
        altro: 'Il valore è diverso. Conta i dati posati sulla pila e togli otto byte per ciascuno.',
        indizi: ['Due PUSH e una CALL posano tre dati.', 'Tre dati da otto byte occupano 24 byte, cioè 0x18.', '0x7000 − 0x18.'],
        svolgimento: ['Primo PUSH: RSP = 0x6FF8.', 'Secondo PUSH: RSP = 0x6FF0.', 'CALL posa l’indirizzo di ritorno: RSP = 0x6FE8.'] },
      { d: 'Una funzione ha nove argomenti interi. Con quale operando legge il nono, al proprio ingresso?', guida: 'Scegli la risposta.', o: [
        { t: '[rsp + 24]', ok: true, fb: 'Sopra l’indirizzo di ritorno stanno il settimo argomento, a 8 byte dalla cima, l’ottavo a 16 e il nono a 24.' },
        { t: '[rsp + 16]', fb: 'A sedici byte dalla cima sta l’ottavo argomento. Il nono è una cella più su.' },
        { t: '[rsp + 9]', fb: 'Le celle della pila sono larghe otto byte. Le distanze dalla cima sono multipli di 8.' }] }
    ],
    sfida: ['cslez2_6_04_random_assembly_04', 'Espressioni, array e chiamate']
  }
});
SL.unita261 = { REG: ['RDI', 'RSI', 'RDX', 'RCX', 'R8', 'R9'], sede: (i) => (i <= 6 ? ['RDI', 'RSI', 'RDX', 'RCX', 'R8', 'R9'][i - 1] : '[rsp + ' + (i - 6) * 8 + ']') };
