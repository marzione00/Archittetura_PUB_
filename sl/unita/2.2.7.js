'use strict';
SL.registra('2.2.7', {
  titolo: 'Traduzione completa di un calcolo aritmetico',
  obiettivo: 'Obiettivo: leggere una breve funzione completa, composta dal calcolo di un valore, da un confronto, da un salto condizionale e dal valore restituito.',
  concetti: [['alu', 'Calcolo del candidato'], ['bilancio', 'CMP'], ['puntatore', 'JB e NEG']],
  filigrana: ['bilancio', 'puntatore', 'tabella'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 2.2.4', t: 'Sette volte a', d: 'Con `lea eax, [rdi*8]` e `sub eax, edi` si ottiene 8a − a, cioè 7a, senza moltiplicazione.' },
      { sim: 'flag', da: 'Dall’unità 2.2.6', t: 'CF dopo una sottrazione', d: 'Vale 1 quando il primo operando, letto senza segno, è minore del secondo.' },
      { sim: 'puntatore', da: 'Dall’unità 2.2.5', t: 'I salti condizionali', d: 'Leggono un flag e stabiliscono se RIP prosegue in sequenza oppure riceve un altro indirizzo.' }
    ],
    domanda: { d: 'Prima di proseguire: su 32 bit, quanto vale il numero −1 letto senza segno?', o: [
      { t: '4 294 967 295', ok: true, fb: 'I bit di −1 sono tutti a 1, e letti senza segno danno il massimo: 2 elevato a 32, meno 1.' },
      { t: '1', fb: 'Il complemento a due di 1 ha tutti i bit a 1. Letti senza segno, essi valgono il massimo del tipo.' },
      { t: '2 147 483 648', fb: 'Il valore indicato è quello del solo bit di segno. In −1 sono a 1 tutti e trentadue i bit.' }
    ] }
  },
  idea: {
    titolo: 'Dal testo di una funzione alle sue istruzioni',
    termini: ['cmp', 'jb', 'neg'],
    testo: [
      'Questa unità riunisce gli elementi del capitolo in una funzione completa, denominata score. La funzione riceve tre interi a, b e c, e calcola 7a + c. Se b è minore di 10 restituisce tale valore, altrimenti lo restituisce cambiato di segno. Il confronto tratta b come un numero senza segno.',
      'La traduzione procede in tre fasi. La prima è il calcolo del valore provvisorio, qui denominato candidato: `lea eax, [rdi*8]`, `sub eax, edi`, `add eax, edx`, con i metodi delle unità precedenti. Al termine EAX contiene 7a + c.',
      'La seconda fase è il confronto. L’istruzione [[cmp|CMP]] esegue la medesima sottrazione di SUB, scrive i medesimi flag e scarta la differenza, cosicché i due operandi restano invariati. L’istruzione `cmp esi, 10` calcola b − 10 al solo scopo di scrivere i flag.',
      'La terza fase è la decisione. Dopo una sottrazione CF vale 1 quando il primo operando, letto senza segno, è minore del secondo. Il salto [[jb|JB]], «salta se inferiore», legge appunto CF e salta quando esso vale 1. Dopo `cmp esi, 10`, pertanto, `jb fine` salta quando b è minore di 10.',
      { fig: 'scena', w: 720, h: 296, titolo: 'La funzione score', nota: 'Tre istruzioni di calcolo, un confronto, un salto. NEG è eseguita soltanto quando il salto non avviene.', els: [
        SL.el.box('i1', 10, 6, 300, 36, null, 'lea eax, [rdi*8]', 'on', { cls: 'stretta' }), SL.el.nota('n1', 330, 14, 'EAX = 8a', 'mono'),
        SL.el.box('i2', 10, 48, 300, 36, null, 'sub eax, edi', 'on', { cls: 'stretta' }), SL.el.nota('n2', 330, 56, 'EAX = 7a', 'mono'),
        SL.el.box('i3', 10, 90, 300, 36, null, 'add eax, edx', 'on', { cls: 'stretta' }), SL.el.nota('n3', 330, 98, 'EAX = 7a + c, il candidato', 'mono'),
        SL.el.box('i4', 10, 132, 300, 36, null, 'cmp esi, 10', 'att', { cls: 'stretta' }), SL.el.nota('n4', 330, 140, 'flag di b − 10', 'mono', 'att'),
        SL.el.box('i5', 10, 174, 300, 36, null, 'jb fine', 'att', { cls: 'stretta' }), SL.el.nota('n5', 330, 182, 'salta se b < 10, senza segno', 'mono', 'att'),
        SL.el.box('i6', 10, 216, 300, 36, null, 'neg eax', '', { cls: 'stretta' }), SL.el.nota('n6', 330, 224, 'EAX = −(7a + c)', 'mono'),
        SL.el.box('i7', 10, 258, 300, 36, null, 'fine: ret', 'on', { cls: 'stretta' }), SL.el.nota('n7', 330, 266, 'restituisce EAX', 'mono')] },
      'Se il salto non avviene, l’esecuzione prosegue con [[neg|NEG]], che cambia di segno il contenuto di un registro. I due percorsi si riuniscono poi all’etichetta fine, dove la funzione restituisce EAX. Un’etichetta è un nome attribuito a un indirizzo del programma, che evita di scriverne il valore numerico.',
      'Il caso che richiede maggiore attenzione è il valore di soglia. La condizione è «minore», senza l’uguaglianza. Con b = 9 il salto avviene e il candidato resta invariato. Con b = 10 la differenza è zero, CF vale 0 e il valore è cambiato di segno. Poiché il confronto è senza segno, un b negativo come −1, che su 32 bit è 0xFFFFFFFF, equivale a un numero superiore a quattro miliardi.'
    ]
  },
  esperimento: {
    faremo: [
      'La funzione score riceve a, b e c. I controlli fissano i tre valori: per b sono disponibili i due valori adiacenti alla soglia e alcuni casi distanti, fra cui un numero negativo.',
      'L’esecuzione compila la traccia e si sofferma sul confronto e sul salto. Meritano attenzione il flag CF e la riga di NEG, che può essere saltata. Dopo il caso proposto, è istruttivo assegnare a b il valore 10 e poi −1.'
    ],
    vedrai: [
      ['tabella', 'La funzione', 'A sinistra: le sette istruzioni, con quella in esecuzione evidenziata.'],
      ['register', 'La traccia', 'Al centro: EDI, ESI, EDX ed EAX dopo ogni istruzione. Una riga saltata resta spenta.'],
      ['flag', 'Il confronto', 'In basso: il flag CF scritto da CMP e la decisione di JB.']
    ]
  },
  lab: {
    titolo: 'La funzione score, dall’ingresso al ritorno',
    scena: { w: 860, h: 428 },
    atti: ['L’ingresso', 'Il candidato', 'Il confronto', 'La decisione', 'Il ritorno'],
    nota: 'Il numero di passi dipende dai dati: se il salto avviene, NEG è omessa.',
    controlli: [
      { id: 'a', tipo: 'num', eti: 'a, in EDI', min: 1, max: 9, salti: [1], valore: 2 },
      { id: 'b', tipo: 'scelta', eti: 'b, in ESI', opzioni: [[9, '9'], [10, '10'], [3, '3'], [200, '200'], [-1, '−1']], valore: 9 },
      { id: 'c', tipo: 'num', eti: 'c, in EDX', min: 0, max: 5, salti: [1], valore: 1 }
    ],
    previsione: {
      domanda: (p) => 'La funzione score riceve a = ' + p.a + ', b = ' + SL.x86.num(p.b) + ' e c = ' + p.c + '. Essa calcola 7a + c e lo cambia di segno se b, letto senza segno, è maggiore o uguale a 10. Quale valore restituisce?',
      opzioni: (p) => { const k = 7 * p.a + p.c; return [-k, -7 * p.a, 7 * p.a, k].filter((v, i, t) => t.indexOf(v) === i).sort((x, y) => x - y).map((v) => [v, SL.x86.num(v)]); }
    },
    confronto: (pred, esito, p) => { const k = 7 * p.a + p.c, bu = p.b < 0 ? p.b + 4294967296 : p.b; return 'La previsione indicava ' + SL.x86.num(pred) + '. La funzione restituisce ' + SL.x86.num(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il candidato vale 7 × ' + p.a + ' + ' + p.c + ' = ' + k + '. Letto senza segno, b vale ' + SL.num(bu) + (bu < 10 ? ', minore di 10: il salto avviene e il candidato è restituito invariato.' : ', maggiore o uguale a 10: il salto è escluso e NEG cambia il segno.')); },
    costruisci(p) {
      const el = SL.el, X = SL.x86, N = X.num, passi = [];
      const a = p.a, b = p.b, c = p.c, bu = b < 0 ? b + 4294967296 : b, cand = 7 * a + c, cf = bu < 10 ? 1 : 0, salta = cf === 1, ris = salta ? cand : -cand;
      const IST = ['all’ingresso', 'lea eax, [rdi*8]', 'sub eax, edi', 'add eax, edx', 'cmp esi, 10', 'jb fine', 'neg eax', 'fine: ret'];
      const T = [[a, b, c, null], [a, b, c, 8 * a], [a, b, c, 7 * a], [a, b, c, cand], [a, b, c, cand], [a, b, c, cand], salta ? null : [a, b, c, -cand], [a, b, c, ris]];
      const s = { cf: null };
      const quadro = (o) => X.traccia({ ist: IST, colonne: ['EDI · a', 'ESI · b', 'EDX · c', 'EAX'], T, riga: o.riga, leggi: o.leggi, scrive: o.scrive, evid: 3, passo: 40, wI: 240, wc: 100 }).concat([
        el.box('cf', 40, 360, 240, 58, 'CF dopo CMP', s.cf == null ? '·' : String(s.cf), o.att === 'cf' ? 'att' : s.cf ? 'on' : '', { cls: 'stretta' }),
        el.box('dec', 310, 360, 520, 58, 'lavoro della riga', o.lavoro || '·', o.lavoro ? (o.forte ? 'att' : 'on') : '', { cls: 'stretta' })]);
      const hud = (k) => [['EAX', T[Math.min(k, 7)] && T[Math.min(k, 7)][3] != null ? N(T[Math.min(k, 7)][3]) : k >= 6 ? N(cand) : '?', 'a'], ['CF', s.cf == null ? '·' : s.cf], ['b senza segno', SL.num(bu), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.riga), els: quadro(o) }, extra));

      P({ riga: 0 }, 0, 'L’ingresso nella funzione', 'I tre argomenti si trovano nei registri della convenzione: a = ' + a + ' in EDI, b = ' + N(b) + ' in ESI, c = ' + c + ' in EDX.' + (b < 0 ? ' I bit di ESI sono 0xFFFFFFFF, il complemento a due di −1.' : ''));
      P({ riga: 1, leggi: [0], scrive: 3, lavoro: a + ' × 8 = ' + 8 * a }, 1, 'Otto volte a', 'La prima LEA scrive in EAX otto volte il contenuto di RDI.', { calc: a + ' × 8 = ' + 8 * a });
      P({ riga: 2, leggi: [0, 3], scrive: 3, lavoro: 8 * a + ' − ' + a + ' = ' + 7 * a }, 1, 'Sette volte a', 'SUB sottrae una volta a. In EAX resta 7a.', { calc: 8 * a + ' − ' + a + ' = ' + 7 * a });
      P({ riga: 3, leggi: [2, 3], scrive: 3, lavoro: 7 * a + ' + ' + c + ' = ' + cand }, 1, 'Il candidato', 'ADD aggiunge c. EAX contiene ora 7a + c = ' + cand + ', il valore che la funzione restituirà invariato oppure cambiato di segno.',
        { calc: 7 * a + ' + ' + c + ' = ' + cand, chiedi: { d: 'La prossima istruzione è `cmp esi, 10`. Che cosa cambierà nei quattro registri della traccia?', o: ['Nulla: CMP scrive soltanto i flag', 'ESI diventerà b − 10', 'EAX sarà azzerato'], g: 0, no: 'CMP esegue la sottrazione e ne scarta la differenza. I registri restano invariati, e cambiano soltanto i flag.' } });
      s.cf = cf;
      P({ riga: 4, leggi: [1], att: 'cf', lavoro: SL.num(bu) + ' − 10' + (cf ? ' richiede un prestito' : ' non richiede prestiti'), forte: true }, 2, 'Il confronto', 'CMP calcola ESI − 10 e scrive i flag. ' + (b < 0 ? 'Letto senza segno, il contenuto di ESI è ' + SL.num(bu) + '. ' : '') + (cf ? 'Il minuendo, ' + SL.num(bu) + ', è minore di 10: la sottrazione richiede un prestito e CF vale 1.' : bu === 10 ? 'I due operandi sono uguali: la differenza è zero, nessun prestito è richiesto e CF vale 0.' : 'Il minuendo, ' + SL.num(bu) + ', è maggiore di 10: nessun prestito è richiesto e CF vale 0.') + ' I registri della traccia restano invariati.',
        { calc: SL.num(bu) + ' − 10 · CF = ' + cf, chiedi: { d: 'CF vale ' + cf + '. Il salto JB avviene quando CF vale 1. Quale sarà l’effetto di `jb fine`?', o: ['Salta a fine', 'Prosegue con NEG'], g: salta ? 0 : 1, no: salta ? 'CF vale 1, e la condizione «inferiore» è quindi vera.' : 'CF vale 0, e la condizione «inferiore» è quindi falsa.' } });
      P({ riga: 5, att: 'cf', lavoro: salta ? 'CF = 1 → salto a fine' : 'CF = 0 → prosecuzione in sequenza', forte: true }, 3, salta ? 'Il salto avviene' : 'Il salto non avviene', salta ? 'JB legge CF, lo trova a 1 e scrive in RIP l’indirizzo dell’etichetta fine. L’istruzione NEG è omessa.' : 'JB legge CF, lo trova a 0 e lascia avanzare RIP all’istruzione successiva, cioè NEG.', { calc: 'jb: CF = ' + cf, esito: [salta ? 'salta' : 'prosegue', salta ? 'si' : 'no'] });
      if (!salta) P({ riga: 6, leggi: [3], scrive: 3, lavoro: '−(' + cand + ') = ' + N(-cand) }, 3, 'Il cambio di segno', 'NEG cambia di segno il contenuto di EAX. Il candidato ' + cand + ' diventa ' + N(-cand) + '.', { calc: '−(' + cand + ') = ' + N(-cand) });
      P({ riga: 7, lavoro: 'valore restituito: ' + N(ris) }, 4, 'Il ritorno', 'I due percorsi si riuniscono all’etichetta fine, e la funzione restituisce il contenuto di EAX: ' + N(ris) + '. ' + (salta ? 'La riga di NEG è rimasta spenta, poiché il salto ne ha escluso l’esecuzione.' : bu === 10 ? 'Il valore 10 coincide con la soglia: la condizione è «minore», e l’uguaglianza conduce al ramo che cambia il segno.' : b < 0 ? 'Un b negativo, letto senza segno, è un numero superiore a quattro miliardi, e conduce al ramo che cambia il segno.' : 'Il valore di b supera la soglia, e il candidato è stato cambiato di segno.'), { calc: 'score(' + a + ', ' + N(b) + ', ' + c + ') = ' + N(ris) });
      return { passi, esito: ris };
    }
  },
  bilancio: {
    regola: [
      'CMP esegue la sottrazione di SUB, scrive i medesimi flag e lascia invariati gli operandi. Subito dopo, un salto condizionale legge tali flag: JB salta quando CF vale 1, cioè quando il primo operando, letto senza segno, è minore del secondo.',
      'Una funzione si legge in tre fasi: il calcolo dei valori, il confronto, i percorsi che si separano e si riuniscono. NEG cambia di segno un registro. Il valore restituito è il contenuto di EAX al momento di RET.'
    ],
    errori: [
      ['Attribuire l’uguaglianza al ramo errato.', 'JB salta soltanto con «minore». Con operandi uguali CF vale 0 e l’esecuzione prosegue.'],
      ['Leggere con segno un confronto senza segno.', 'Per JB il valore −1 è 4 294 967 295, e quindi maggiore di 10. Per i confronti con segno esistono altri salti, che leggono SF e OF.'],
      ['Ritenere che CMP modifichi un registro.', 'CMP scrive soltanto i flag. Dopo `cmp esi, 10`, ESI contiene ancora b.']
    ],
    saFare: ['Leggere una coppia CMP e salto condizionale come una condizione sui due operandi.', 'Seguire i due percorsi di una funzione fino al punto in cui si riuniscono.', 'Compilare la traccia di una funzione completa e ricavarne il valore restituito.'],
    esercizi: [
      { d: 'ESI contiene 10. Il processore esegue `cmp esi, 10` e poi `jb fine`. Qual è l’esito del salto?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il salto non avviene, e l’esecuzione prosegue in sequenza', ok: true, fb: 'La differenza è zero e nessun prestito è richiesto: CF vale 0. «Inferiore» esclude l’uguaglianza.' },
        { t: 'Il salto avviene, perché 10 è uguale a 10', fb: 'JB salta quando il primo operando è minore del secondo. Con operandi uguali CF vale 0.' },
        { t: 'Dipende dal contenuto di EAX', fb: 'CMP confronta ESI con 10, e JB legge il flag CF che ne risulta. EAX è estraneo alla decisione.' }] },
      { d: 'La funzione score di questa unità riceve a = 3, b = 12 e c = 2. Quale valore restituisce?', segnaposto: 'Un numero, con il segno', giuste: ['-23', '−23'],
        ok: 'Il candidato vale 7 × 3 + 2 = 23. Dodici supera la soglia e il salto è escluso. NEG cambia il segno, e il valore restituito è −23.',
        diagnosi: [
          { se: ['23'], msg: 'Il valore indicato è il candidato. Con b = 12 il salto non avviene, e NEG ne cambia il segno.' },
          { se: ['-21', '−21', '21'], msg: 'Il candidato comprende anche c: 7 × 3 + 2.' },
          { se: ['-26', '−26', '26'], msg: 'Il coefficiente di a è 7: otto volte a, meno una volta a.' }
        ],
        altro: 'Il valore è diverso. Si calcoli dapprima il candidato 7a + c, poi si stabilisca se b è minore di 10.',
        indizi: ['Il candidato è 7a + c.', 'Con a = 3 e c = 2 il candidato vale 23.', 'Dodici è maggiore di 10, e NEG è quindi eseguita.'],
        svolgimento: ['Candidato: 7 × 3 + 2 = 23.', 'Confronto: 12 − 10 non richiede prestiti, CF = 0.', 'JB non salta, e NEG cambia il segno.', 'Valore restituito: −23.'] }
    ],
    sfida: ['cslez2_2_05_random_assembly_05', 'Confronti e selezione condizionale']
  }
});
