'use strict';
SL.registra('2.6.4', {
  titolo: 'Leggere una funzione compilata',
  obiettivo: 'Obiettivo: riconoscere un ciclo nel codice macchina, distinguerne le parti e ricostruirne il calcolo seguendone le iterazioni.',
  concetti: [['riproduci', 'Un salto all’indietro'], ['tabella', 'Preparazione, corpo, uscita'], ['lente', 'La traccia delle iterazioni']],
  filigrana: ['riproduci', 'tabella', 'lente'],
  richiami: {
    carte: [
      { sim: 'flag', da: 'Dall’unità 2.2.5', t: 'ZF e JZ', d: 'ZF vale 1 quando il risultato di un’istruzione è zero. JZ salta quando ZF vale 1.' },
      { sim: 'flag', da: 'Dall’unità 2.4.2', t: 'TEST', d: 'L’istruzione calcola l’AND dei due operandi e conserva soltanto i flag. Con il medesimo registro in entrambe le posizioni, ZF indica se il registro vale zero.' },
      { sim: 'tabella', da: 'Dall’unità 2.1.3', t: 'Traccia di esecuzione', d: 'La tabella che riporta il contenuto dei registri dopo ogni istruzione.' }
    ],
    domanda: { d: 'Prima di proseguire: che cosa contiene EAX dopo `xor eax, eax`?', o: [
      { t: 'Zero', ok: true, fb: 'Ogni bit confrontato con sé stesso dà 0. È il modo più frequente per azzerare un registro.' },
      { t: 'Il doppio del valore precedente', fb: 'Il raddoppio si ottiene con una somma o con uno scorrimento. XOR di un registro con sé stesso dà sempre zero.' },
      { t: 'Il valore precedente, invariato', fb: 'Il registro resterebbe invariato con OR oppure con AND. XOR di un registro con sé stesso dà sempre zero.' }
    ] }
  },
  idea: {
    titolo: 'Un salto all’indietro',
    termini: ['ciclo del programma', 'dec', 'jnz'],
    testo: [
      'Il linguaggio C offre i costrutti `for` e `while` per ripetere un gruppo di istruzioni. Il processore dispone soltanto dei salti. Un [[ciclo del programma|ciclo]] si ha quando un salto condizionale punta all’indietro, verso un’istruzione già eseguita: le istruzioni comprese fra la destinazione e il salto si ripetono finché la condizione resta vera.',
      'Un ciclo ha tre parti, e il loro riconoscimento è il primo passo nella lettura di una funzione compilata. La preparazione, eseguita una sola volta, porta i registri nello stato iniziale. Il corpo, ripetuto, compie il calcolo di un’iterazione. La condizione di uscita stabilisce se tornare indietro oppure proseguire.',
      { fig: 'scena', w: 720, h: 190, titolo: 'Le tre parti di un ciclo che somma i numeri da n a 1', nota: 'La linea a destra è il salto all’indietro: collega la condizione di uscita all’inizio del corpo.', els: [
        SL.el.box('a', 150, 0, 300, 44, 'preparazione', 'xor eax, eax', 'on', { cls: 'stretta' }),
        SL.el.box('b', 150, 52, 300, 44, 'corpo', 'add eax, edi', 'att', { cls: 'stretta' }), SL.el.box('c', 150, 100, 300, 44, 'corpo', 'dec edi', 'att', { cls: 'stretta' }),
        SL.el.box('d', 150, 148, 300, 40, 'condizione di uscita', 'jnz', '', { cls: 'stretta' }),
        SL.el.linea('l1', 450, 168, 520, 168, 'att'), SL.el.linea('l2', 520, 168, 520, 74, 'att'), SL.el.linea('l3', 520, 74, 450, 74, 'att'),
        SL.el.nota('n', 534, 112, 'finché EDI è diverso da zero', 'mono minuta')] },
      'Due istruzioni compaiono in un gran numero di cicli. [[dec|DEC]] sottrae 1 a un registro e scrive ZF, che vale 1 quando il registro ha raggiunto zero. [[jnz|JNZ]] è l’opposto di JZ e salta quando ZF vale 0. In coppia formano un contatore decrescente: si sottrae uno e, se il risultato è diverso da zero, il corpo è ripetuto.',
      'Molti cicli verificano la condizione anche prima di cominciare. Se il contatore vale già zero, il corpo va omesso per intero: un TEST seguito da JZ conduce direttamente all’uscita. Senza tale controllo DEC porterebbe il contatore da 0 a −1, e il ciclo si ripeterebbe per miliardi di iterazioni prima di tornare a zero.',
      'Per stabilire che cosa calcola un ciclo è utile compilare la traccia delle prime iterazioni e individuare ciò che cambia dall’una all’altra. Il registro che raccoglie il risultato prende il nome di accumulatore, quello che conta le iterazioni di contatore.'
    ]
  },
  esperimento: {
    faremo: [
      'Una funzione riceve un numero n in EDI ed esegue sette istruzioni, fra cui un salto all’indietro. I controlli fissano n, anche nullo.',
      'La prima iterazione del ciclo è seguita un’istruzione alla volta, le successive una per passo, con la compilazione di una tabella. Dopo il caso proposto, è istruttivo scegliere n uguale a zero e individuare il percorso seguito dalla funzione.'
    ],
    vedrai: [
      ['operation', 'Il listato', 'A sinistra: le sette istruzioni, con quella in esecuzione evidenziata.'],
      ['register', 'I registri', 'In alto a destra: l’accumulatore EAX, il contatore EDI e il flag ZF.'],
      ['tabella', 'La tabella delle iterazioni', 'A destra: una riga per ogni iterazione del ciclo.']
    ]
  },
  lab: {
    titolo: 'Un ciclo seguito iterazione per iterazione',
    scena: { w: 860, h: 372 },
    atti: ['La funzione', 'La preparazione', 'La prima iterazione', 'Le iterazioni successive', 'L’uscita'],
    controlli: [
      { id: 'n', tipo: 'num', eti: 'n, in EDI', min: 0, max: 5, salti: [1], valore: 4 }
    ],
    nota: 'Il numero di passi dipende da n: ogni iterazione oltre la prima occupa un passo.',
    previsione: {
      domanda: (p) => 'Una funzione entra con EDI = ' + p.n + ' ed esegue `xor eax, eax`, `test edi, edi`, `jz` verso l’uscita, poi ripete `add eax, edi`, `dec edi` e `jnz` verso ADD. Quanto vale EAX al ritorno?',
      opzioni: (p) => Array.from(new Set([p.n * (p.n + 1) / 2, p.n, p.n * (p.n - 1) / 2, p.n * p.n, p.n + 1])).slice(0, 4).sort((a, b) => a - b).map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. EAX contiene ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.n === 0 ? 'Con n uguale a zero il controllo iniziale omette il ciclo, ed EAX resta a zero.' : 'Il ciclo somma in EAX i valori assunti da EDI a ogni iterazione: ' + Array.from({ length: p.n }, (_, k) => p.n - k).join(' + ') + ' = ' + esito + '.'),
    costruisci(p) {
      const el = SL.el, X = SL.x86, passi = [], n = p.n, tot = n * (n + 1) / 2;
      const LIS = [['0x401000', 'xor eax, eax'], ['0x401002', 'test edi, edi'], ['0x401004', 'jz 0x40100C'], ['0x401006', 'add eax, edi'], ['0x401008', 'dec edi'], ['0x40100A', 'jnz 0x401006'], ['0x40100C', 'ret']];
      const st = { eax: null, edi: n, zf: null, giri: [], parte: '·' };
      const quadro = (o) => {
        const els = [];
        X.listato('li', LIS, o.riga, { x: 20, y: 0, w: 250, passo: 44 }).forEach((e, k) => { e.st = o.riga === k ? 'att' : ''; els.push(e); });
        els.push(el.box('eax', 290, 0, 170, 60, 'EAX, accumulatore', st.eax == null ? '?' : String(st.eax), o.reg === 'eax' ? 'att' : 'on', { cls: 'stretta' }),
          el.box('edi', 470, 0, 170, 60, 'EDI, contatore', String(st.edi), o.reg === 'edi' ? 'att' : 'on', { cls: 'stretta' }),
          el.box('zf', 650, 0, 190, 60, 'ZF', st.zf == null ? '·' : String(st.zf), o.reg === 'zf' || o.reg === 'edi' ? 'att' : '', { cls: 'stretta' }),
          el.nota('h0', 290, 76, 'ITERAZIONE', 'mono minuta'), el.nota('h1', 380, 76, 'EAX DOPO ADD', 'mono minuta'), el.nota('h2', 560, 76, 'EDI DOPO DEC', 'mono minuta'), el.nota('h3', 740, 76, 'ZF', 'mono minuta'));
        for (let k = 0; k < 5; k++) {
          const g = st.giri[k], ult = k === st.giri.length - 1 && o.giro;
          els.push(el.cella('g0' + k, 290, 100 + k * 42, 80, 36, k < n ? String(k + 1) : '', g ? (ult ? 'att' : 'on') : 'off', { piccola: true, cls: 'minuta' }),
            el.cella('g1' + k, 380, 100 + k * 42, 170, 36, g && g.eax != null ? String(g.eax) : '·', g && g.eax != null ? (ult ? 'att' : 'on') : 'off', { piccola: true, cls: 'minuta' }),
            el.cella('g2' + k, 560, 100 + k * 42, 170, 36, g && g.edi != null ? String(g.edi) : '·', g && g.edi != null ? (ult ? 'att' : 'on') : 'off', { piccola: true, cls: 'minuta' }),
            el.cella('g3' + k, 740, 100 + k * 42, 100, 36, g && g.zf != null ? String(g.zf) : '·', g && g.zf != null ? (ult ? 'att' : 'on') : 'off', { piccola: true, cls: 'minuta' }));
        }
        els.push(el.box('par', 20, 318, 820, 48, 'parte della funzione', st.parte, o.parte ? 'att' : 'on', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['EAX', st.eax == null ? '?' : String(st.eax), 'a'], ['EDI', String(st.edi)], ['Iterazioni compiute', String(st.giri.filter((g) => g.zf != null).length), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Sette istruzioni e un salto all’indietro', 'La funzione riceve n = ' + n + ' in EDI. Fra le sue sette istruzioni, la sesta salta all’indietro, verso la quarta: è l’indizio di un ciclo. Le istruzioni quattro e cinque ne costituiscono il corpo.',
        { chiedi: { d: 'La prima istruzione è `xor eax, eax`. Qual è il suo effetto?', o: ['Azzeramento di EAX', 'Raddoppio di EAX', 'EAX invariato'], g: 0, no: 'XOR di un registro con sé stesso dà zero in ogni bit. È la preparazione dell’accumulatore.' } });
      st.eax = 0; st.parte = 'preparazione';
      P({ riga: 0, reg: 'eax', parte: true }, 1, 'L’accumulatore a zero', 'XOR azzera EAX. È la preparazione: il registro raccoglierà una somma, e una somma parte da zero.', { calc: 'EAX = 0' });
      st.zf = n === 0 ? 1 : 0; st.parte = 'controllo iniziale';
      P({ riga: 1, reg: 'zf', parte: true }, 1, 'Il controllo iniziale', 'TEST confronta EDI con sé stesso e conserva soltanto i flag. ZF vale 1 se EDI è zero. In questo caso EDI contiene ' + n + ', e ZF vale ' + st.zf + '.',
        { calc: 'ZF = ' + st.zf, chiedi: { d: 'La prossima istruzione è `jz 0x40100C`, che salta quando ZF vale 1. Il salto avviene?', o: ['Sì', 'No'], g: n === 0 ? 0 : 1, no: n === 0 ? 'ZF vale 1, poiché EDI è zero: il salto avviene e oltrepassa il ciclo.' : 'ZF vale 0, poiché EDI è diverso da zero: il salto è escluso.' } });
      if (n === 0) {
        P({ riga: 2, parte: true }, 1, 'Il ciclo omesso', 'ZF vale 1, e JZ salta direttamente a 0x40100C. Il corpo del ciclo resta ineseguito. Senza tale controllo DEC porterebbe EDI da 0 a −1, e il ciclo proseguirebbe per miliardi di iterazioni.', { calc: 'salto a 0x40100C' });
      } else {
        P({ riga: 2, parte: true }, 1, 'L’ingresso nel ciclo', 'ZF vale 0, e JZ prosegue in sequenza. L’esecuzione entra nel corpo del ciclo.', { calc: 'nessun salto' });
        st.eax = n; st.giri.push({ eax: n, edi: null, zf: null }); st.parte = 'corpo, iterazione 1';
        P({ riga: 3, reg: 'eax', giro: true, parte: true }, 2, 'La prima iterazione: la somma', 'ADD somma EDI a EAX. L’accumulatore passa da 0 a ' + n + '.', { calc: '0 + ' + n + ' = ' + n });
        st.edi = n - 1; st.zf = n - 1 === 0 ? 1 : 0; st.giri[0].edi = n - 1; st.giri[0].zf = st.zf;
        P({ riga: 4, reg: 'edi', giro: true, parte: true }, 2, 'La prima iterazione: il contatore', 'DEC sottrae 1 a EDI, che scende a ' + (n - 1) + ', e scrive ZF. ' + (st.zf ? 'Il contatore ha raggiunto zero, e ZF vale 1.' : 'Il contatore è ancora diverso da zero, e ZF vale 0.'),
          { calc: n + ' − 1 = ' + (n - 1) + ' · ZF = ' + st.zf, chiedi: { d: 'La prossima istruzione è `jnz 0x401006`, che salta quando ZF vale 0. Il ciclo si ripete?', o: ['Sì', 'No'], g: st.zf ? 1 : 0, no: st.zf ? 'ZF vale 1: il salto è escluso, e il ciclo termina.' : 'ZF vale 0: il salto torna a 0x401006, e comincia un’altra iterazione.' } });
        st.parte = 'condizione di uscita';
        P({ riga: 5, giro: true, parte: true }, 2, st.zf ? 'Il salto non avviene' : 'Il salto all’indietro', 'JNZ esamina ZF, scritto da DEC. ' + (st.zf ? 'Vale 1, e il salto è escluso: il ciclo è terminato dopo una sola iterazione.' : 'Vale 0, e il salto riporta l’esecuzione a 0x401006, l’istruzione ADD. Comincia la seconda iterazione, con EDI che vale ' + (n - 1) + '.'), { calc: st.zf ? 'uscita dal ciclo' : 'salto a 0x401006' });
        for (let k = 2; k <= n; k++) {
          const t = n - k + 1, prima = st.eax;
          st.eax += t; st.edi = t - 1; st.zf = t - 1 === 0 ? 1 : 0; st.giri.push({ eax: st.eax, edi: st.edi, zf: st.zf }); st.parte = 'corpo e condizione, iterazione ' + k;
          P({ riga: 5, reg: 'eax', giro: true, parte: true }, 3, 'L’iterazione ' + k, 'ADD somma ' + t + ' a EAX, che passa da ' + prima + ' a ' + st.eax + '. DEC porta EDI a ' + st.edi + '. ' + (st.zf ? 'ZF vale 1, e JNZ prosegue in sequenza: il ciclo è terminato.' : 'ZF vale 0, e JNZ torna indietro per un’altra iterazione.'), { calc: prima + ' + ' + t + ' = ' + st.eax });
        }
      }
      st.parte = 'uscita';
      P({ riga: 6, reg: 'eax', parte: true }, 4, 'Il valore restituito', 'RET restituisce il controllo, e il chiamante trova in EAX il numero ' + tot + '. ' + (n === 0 ? 'Con n uguale a zero la somma è priva di termini, e il risultato è zero.' : n === 1 ? 'Con n uguale a 1 la somma ha un solo termine.' : 'La colonna di EDI nella tabella mostra i termini sommati: ' + Array.from({ length: n }, (_, k) => n - k).join(', ') + '. La funzione calcola la somma dei numeri interi da 1 a n.'), { calc: 'EAX = ' + tot, esito: ['EAX = ' + tot, 'si'] });
      return { passi, esito: tot };
    }
  },
  bilancio: {
    regola: [
      'Un ciclo è un salto condizionale che punta all’indietro. Si legge individuando la preparazione, il corpo e la condizione di uscita.',
      'DEC seguito da JNZ ripete il corpo finché il contatore raggiunge zero. Un controllo iniziale con TEST e JZ tratta il caso del contatore già nullo.'
    ],
    errori: [
      ['Trascurare il caso del contatore a zero.', 'Senza il controllo iniziale, DEC porterebbe il contatore da 0 a −1 e il ciclo si ripeterebbe per miliardi di iterazioni.'],
      ['Contare un’iterazione in più o in meno.', 'Con il contatore a 4 il corpo è eseguito quattro volte, con i valori 4, 3, 2 e 1.'],
      ['Ritenere che JNZ esamini il registro.', 'JNZ esamina ZF, scritto dall’ultima istruzione che modifica i flag. In questo ciclo è DEC.']
    ],
    saFare: ['Riconoscere un ciclo dal salto all’indietro.', 'Distinguere preparazione, corpo e condizione di uscita.', 'Compilare la tabella delle iterazioni e ricavarne il calcolo svolto dal ciclo.'],
    esercizi: [
      { d: 'Una funzione esegue `xor eax, eax`, poi ripete `add eax, edi`, `dec edi` e `jnz` verso ADD. Entra con EDI = 6. Quanto vale EAX quando il ciclo termina?', segnaposto: 'Un numero', giuste: ['21', 'ventuno'],
        ok: 'Il corpo è eseguito sei volte, e somma 6, 5, 4, 3, 2 e 1. Il totale è 21.',
        diagnosi: [
          { se: ['6'], msg: 'Sei è il valore sommato alla prima iterazione. Il ciclo prosegue finché EDI raggiunge zero.' },
          { se: ['15'], msg: 'Manca un termine. Le iterazioni sono sei: 6 + 5 + 4 + 3 + 2 + 1.' },
          { se: ['20'], msg: 'Anche l’ultima iterazione, con EDI uguale a 1, esegue la somma prima che DEC porti il contatore a zero.' },
          { se: ['36'], msg: 'A ogni iterazione si somma il valore corrente di EDI, che diminuisce: 6, poi 5, poi 4, e così via.' }
        ],
        altro: 'Il valore è diverso. Si compili la tabella delle iterazioni: EAX dopo ADD, EDI dopo DEC.',
        indizi: ['A ogni iterazione EAX riceve il valore corrente di EDI, poi EDI scende di 1.', 'I valori sommati sono 6, 5, 4, 3, 2 e 1.', '6 + 5 + 4 + 3 + 2 + 1.'],
        svolgimento: ['Iterazione 1: EAX = 6, EDI = 5.', 'Iterazione 2: EAX = 11, EDI = 4. Iterazione 3: EAX = 15, EDI = 3.', 'Iterazione 4: EAX = 18, EDI = 2. Iterazione 5: EAX = 20, EDI = 1.', 'Iterazione 6: EAX = 21, EDI = 0. ZF vale 1, e il ciclo termina.'] },
      { d: 'Un ciclo termina con `dec ecx` seguito da `jnz inizio`. All’ingresso ECX vale 3. Quante volte è eseguito il corpo?', guida: 'Si scelga la risposta.', o: [
        { t: '3', ok: true, fb: 'Il corpo è eseguito con ECX uguale a 3, a 2 e a 1. Dopo il terzo DEC il contatore è zero, e JNZ prosegue in sequenza.' },
        { t: '2', fb: 'Anche l’iterazione con ECX uguale a 1 è eseguita: il controllo segue il corpo.' },
        { t: '4', fb: 'Dopo il terzo DEC il contatore vale zero, ZF vale 1 e il salto è escluso. Una quarta iterazione è assente.' }] }
    ],
    sfida: ['cslez2_6_02_random_assembly_02', 'Disassemblaggio, simboli e debugger']
  }
});
