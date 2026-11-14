'use strict';
SL.registra('2.6.3', {
  titolo: 'Il flusso di controllo dentro una funzione',
  obiettivo: 'Obiettivo: prevedere il ramo eseguito da una funzione dopo un confronto, distinguendo i salti per i numeri con segno da quelli per i numeri senza segno.',
  concetti: [['bilancio', 'Confronto e salto'], ['segno', 'Due ordini'], ['fork', 'Rami che si riuniscono']],
  filigrana: ['fork', 'segno', 'flag'],
  richiami: {
    carte: [
      { sim: 'bilancio', da: 'Dall’unità 2.2.7', t: 'CMP e JB', d: 'CMP esegue una sottrazione, scrive i flag e scarta la differenza. JB salta quando CF vale 1.' },
      { sim: 'flag', da: 'Dall’unità 2.2.6', t: 'I flag di una sottrazione', d: 'CF segnala il prestito, cioè un minuendo senza segno minore del sottraendo. OF segnala che il risultato con segno è esterno all’intervallo. SF copia il bit di segno.' },
      { sim: 'segno', da: 'Dall’unità 1.4.1', t: 'Due letture', d: 'I medesimi bit valgono numeri diversi secondo la lettura, senza segno oppure in complemento a due.' }
    ],
    domanda: { d: 'Prima di proseguire: quanto vale il byte 0xFF letto in complemento a due?', o: [
      { t: '−1', ok: true, fb: 'Senza segno vale 255. Il bit di segno è 1, e si sottrae quindi 256: 255 − 256 = −1.' },
      { t: '255', fb: 'Il valore indicato è la lettura senza segno. In complemento a due, con il bit di segno a 1, il valore è negativo.' },
      { t: '−127', fb: 'In tal modo il primo bit sarebbe letto come un segno meno anteposto agli altri sette. In complemento a due si sottrae 256 al valore senza segno.' }
    ] }
  },
  idea: {
    titolo: 'Il medesimo confronto, due esiti',
    termini: ['jl', 'jge', 'jmp'],
    testo: [
      'Una funzione che sceglie fra due percorsi impiega la coppia già introdotta nell’unità 2.2.7: CMP scrive i flag, un salto condizionale li legge. Il costrutto `if` del C diventa un confronto seguito da un salto che oltrepassa le istruzioni da escludere.',
      'Per stabilire quale di due numeri sia minore occorrono due classi di salti, poiché i medesimi bit ammettono due letture. Il byte 0xFF vale 255 senza segno e −1 con segno. Confrontato con 1, è il maggiore nella prima lettura e il minore nella seconda. CMP prescinde dalla lettura che interessa al programma, e scrive tutti i flag. La scelta spetta al salto.',
      { fig: 'scena', w: 720, h: 130, titolo: 'Il byte 0xFF confrontato con il byte 0x01', nota: 'Il confronto è uno solo. I due salti ne forniscono due letture.', els: [
        SL.el.box('a', 0, 10, 200, 100, 'cmp al, bl', '0xFF e 0x01', 'att'),
        SL.el.box('b', 260, 0, 460, 54, 'senza segno · JB', '255 è maggiore di 1: nessun salto', 'on', { cls: 'stretta' }),
        SL.el.box('c', 260, 66, 460, 54, 'con segno · JL', '−1 è minore di 1: salto', 'on', { cls: 'stretta' }),
        SL.el.linea('l1', 200, 44, 260, 27, 'on'), SL.el.linea('l2', 200, 76, 260, 93, 'on')] },
      'Per i numeri senza segno si impiegano JB, che salta se il primo operando è inferiore, e JAE, che salta se è superiore o uguale. Entrambi esaminano CF, il prestito della sottrazione. Per i numeri con segno si impiegano [[jl|JL]], che salta se il primo è minore, e [[jge|JGE]], che salta se è maggiore o uguale.',
      'JL esamina due flag insieme e salta quando SF e OF sono diversi. Se la sottrazione resta nell’intervallo dei numeri con segno, OF vale 0 e il segno della differenza è attendibile: una differenza negativa significa che il primo operando è minore. Se la sottrazione è esterna all’intervallo, OF vale 1 e il segno risulta invertito. JL tiene conto di entrambi i casi.',
      'Esiste anche un salto privo di condizione, [[jmp|JMP]], che salta sempre. Esso riunisce i percorsi: al termine di un ramo oltrepassa l’altro, e l’esecuzione prosegue dal punto comune.',
      'Nel codice compilato la scelta del salto rivela il tipo delle variabili. Un JB o un JAE dopo un confronto indicano che il programma trattava numeri senza segno, per esempio indirizzi o lunghezze. Un JL o un JGE indicano numeri con segno.'
    ]
  },
  esperimento: {
    faremo: [
      'Un frammento di quattro istruzioni lascia in AL il minore fra due byte, AL e BL. I controlli fissano i due byte e il salto impiegato: JL, per l’ordine con segno, oppure JB, per l’ordine senza segno.',
      'Sono seguiti i flag scritti da CMP, la condizione del salto e il ramo eseguito. Dopo il caso proposto, è istruttivo cambiare soltanto il salto e rilevare se il byte restituito cambia.'
    ],
    vedrai: [
      ['segno', 'I due byte', 'In alto a sinistra: AL e BL, ciascuno con le proprie due letture.'],
      ['flag', 'I flag', 'Al centro: CF, OF, SF e ZF dopo il confronto.'],
      ['operation', 'Il listato', 'A destra: le quattro istruzioni, con quella saltata che resta spenta.']
    ]
  },
  lab: {
    titolo: 'Il minore di due byte, secondo due ordini',
    scena: { w: 860, h: 358 },
    atti: ['Due byte, due letture', 'Il confronto', 'La condizione del salto', 'Il ramo eseguito', 'Il byte restituito'],
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'Byte in AL', opzioni: [[0xFF, '0xFF'], [0x80, '0x80'], [0x7F, '0x7F'], [0x05, '0x05']], valore: 0xFF },
      { id: 'b', tipo: 'scelta', eti: 'Byte in BL', opzioni: [[0x01, '0x01'], [0x90, '0x90'], [0x10, '0x10']], valore: 0x01 },
      { id: 't', tipo: 'scelta', eti: 'Salto', opzioni: [['jl', 'JL, con segno'], ['jb', 'JB, senza segno']], valore: 'jl' }
    ],
    nota: 'I passi sono sempre cinque. L’istruzione oltrepassata dal salto resta spenta nel listato.',
    previsione: {
      domanda: (p) => 'AL contiene ' + SL.unita263.H(p.a) + ' e BL contiene ' + SL.unita263.H(p.b) + '. Il frammento esegue `cmp al, bl`, `' + p.t + ' fine`, `mov al, bl` e, all’etichetta fine, `ret`. Quale byte contiene AL al ritorno?',
      opzioni: (p) => [p.a, p.b].sort((x, y) => x - y).map(SL.unita263.H)
    },
    confronto: (pred, esito, p) => { const U = SL.unita263, c = SL.x86.differenza(p.a, p.b, 8); return 'La previsione indicava ' + pred + '. AL contiene ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.t === 'jl' ? 'JL impiega l’ordine con segno: AL vale ' + SL.x86.num(c.sa) + ' e BL vale ' + SL.x86.num(c.sb) + '.' : 'JB impiega l’ordine senza segno: AL vale ' + p.a + ' e BL vale ' + p.b + '.'); },
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita263, N = X.num, passi = [], c = X.differenza(p.a, p.b, 8), JL = p.t === 'jl';
      const salta = JL ? c.sf !== c.of : c.cf === 1, ris = salta ? p.a : p.b, altro = (JL ? c.cf === 1 : c.sf !== c.of) ? p.a : p.b;
      const LIS = [['0x401000', 'cmp al, bl'], ['0x401002', p.t + ' 0x401006'], ['0x401004', 'mov al, bl'], ['0x401006', 'ret']];
      const st = { fl: { CF: null, OF: null, SF: null, ZF: null }, al: p.a };
      const quadro = (o) => {
        const els = [el.box('va', 20, 0, 270, 62, 'AL = ' + U.H(p.a) + ' · senza e con segno', p.a + ' e ' + N(c.sa), o.vals ? 'att' : 'on', { cls: 'stretta' }),
          el.box('vb', 20, 72, 270, 62, 'BL = ' + U.H(p.b) + ' · senza e con segno', p.b + ' e ' + N(c.sb), o.vals ? 'att' : 'on', { cls: 'stretta' }),
          el.box('dif', 20, 144, 270, 62, 'differenza conservata dai flag', st.fl.CF == null ? '·' : U.H(c.r), o.cmp ? 'att' : '', { cls: 'stretta' })];
        X.flag('f', st.fl, { x: 310, y: 0, passo: 70, h: 62, att: o.flag || [] }).forEach((e) => els.push(e));
        els.push(el.box('cond', 310, 72, 270, 62, JL ? 'JL salta se SF e OF sono diversi' : 'JB salta se CF vale 1', o.fase >= 2 ? (salta ? 'condizione vera' : 'condizione falsa') : '·', o.fase === 2 ? 'att' : o.fase > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('ramo', 310, 144, 270, 62, 'esito del salto', o.fase >= 2 ? (salta ? 'salta a 0x401006' : 'prosegue con MOV') : '·', o.fase === 2 || o.fase === 3 ? 'att' : o.fase > 3 ? 'on' : '', { cls: 'stretta' }));
        X.listato('li', LIS, o.riga, { x: 600, y: 0, w: 240, passo: 52 }).forEach((e, k) => { if (o.fase >= 3 && salta && k === 2) e.st = 'off'; els.push(e); });
        els.push(el.box('al', 20, 228, 270, 66, 'AL', U.H(st.al), o.al ? 'att' : '', { cls: 'stretta' }),
          el.box('sen', 310, 228, 530, 66, 'il frammento ha scelto', o.fase >= 4 ? 'il minore ' + (JL ? 'con segno' : 'senza segno') + ': ' + (JL ? N(X.conSegno(ris, 8)) : ris) : '·', o.fase >= 4 ? 'on' : '', { cls: 'stretta' }),
          el.box('alt', 20, 304, 820, 46, null, o.fase >= 4 ? 'con ' + (JL ? 'JB' : 'JL') + ' al posto di ' + (JL ? 'JL' : 'JB') + ', AL conterrebbe ' + U.H(altro) : '·', o.fase >= 4 && altro !== ris ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Salto', p.t.toUpperCase(), 'a'], ['CF · OF · SF', st.fl.CF == null ? '·' : c.cf + ' · ' + c.of + ' · ' + c.sf], ['AL', U.H(st.al), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      const minU = p.a < p.b, minS = c.sa < c.sb;
      P({ fase: 0, vals: true }, 0, 'Due byte, due letture', 'AL contiene ' + U.H(p.a) + ' e BL contiene ' + U.H(p.b) + '. Senza segno valgono ' + p.a + ' e ' + p.b + '. In complemento a due valgono ' + N(c.sa) + ' e ' + N(c.sb) + '. ' + (minU === minS ? 'Nelle due letture il minore è il medesimo.' : 'Nelle due letture il minore cambia: è ' + (minU ? 'AL' : 'BL') + ' senza segno ed è ' + (minS ? 'AL' : 'BL') + ' con segno.'),
        { chiedi: { d: 'Il frammento impiega ' + (JL ? 'JL, e quindi l’ordine con segno.' : 'JB, e quindi l’ordine senza segno.') + ' In tale ordine, quale registro contiene il minore?', o: ['AL', 'BL'], g: (JL ? minS : minU) ? 0 : 1, no: JL ? 'Con segno AL vale ' + N(c.sa) + ' e BL vale ' + N(c.sb) + '.' : 'Senza segno AL vale ' + p.a + ' e BL vale ' + p.b + '.' } });
      st.fl = { CF: c.cf, OF: c.of, SF: c.sf, ZF: c.zf };
      P({ fase: 1, riga: 0, cmp: true, flag: ['CF', 'OF', 'SF', 'ZF'] }, 1, 'CMP scrive i flag', 'CMP sottrae BL da AL e conserva soltanto i flag. La differenza su otto bit è ' + U.H(c.r) + '. CF vale ' + c.cf + (c.cf ? ', poiché senza segno ' + p.a + ' è minore di ' + p.b + ' e occorre un prestito.' : ', poiché senza segno ' + p.a + ' è sufficiente per sottrarre ' + p.b + '.') + ' Con segno la differenza esatta è ' + N(c.sv) + (c.of ? ', esterna all’intervallo da −128 a 127: OF vale 1.' : ', interna all’intervallo da −128 a 127: OF vale 0.') + ' SF copia il bit più a sinistra di ' + U.H(c.r) + ' e vale ' + c.sf + '.',
        { calc: U.H(p.a) + ' − ' + U.H(p.b) + ' → ' + U.H(c.r), chiedi: { d: JL ? 'JL salta quando SF e OF sono diversi. In questo caso SF vale ' + c.sf + ' e OF vale ' + c.of + '. Il salto avviene?' : 'JB salta quando CF vale 1. In questo caso CF vale ' + c.cf + '. Il salto avviene?', o: ['Sì', 'No'], g: salta ? 0 : 1, no: JL ? 'SF e OF sono ' + (c.sf !== c.of ? 'diversi: la condizione è vera.' : 'uguali: la condizione è falsa.') : 'CF vale ' + c.cf + ': la condizione è ' + (c.cf ? 'vera.' : 'falsa.') } });
      P({ fase: 2, riga: 1, flag: JL ? ['SF', 'OF'] : ['CF'] }, 2, salta ? 'Il salto avviene' : 'Il salto non avviene', (JL ? 'JL confronta SF con OF. ' + (c.of ? 'La sottrazione è esterna all’intervallo, e il segno della differenza è quindi invertito: SF vale ' + c.sf + ', e il segno effettivo è l’opposto.' : 'La sottrazione è rimasta nell’intervallo, e il segno della differenza è quindi attendibile: SF vale ' + c.sf + '.') + ' I due flag sono ' + (c.sf !== c.of ? 'diversi, e ne segue che AL è minore di BL: il salto avviene.' : 'uguali, e ne segue che AL è maggiore o uguale a BL: il salto è escluso.')
        : 'JB esamina soltanto CF, che vale ' + c.cf + '. ' + (c.cf ? 'La sottrazione ha richiesto un prestito, e ne segue che AL è inferiore a BL: il salto avviene.' : 'La sottrazione si è svolta senza prestiti, e ne segue che AL è superiore o uguale a BL: il salto è escluso.')), { calc: JL ? 'SF = ' + c.sf + ' · OF = ' + c.of : 'CF = ' + c.cf });
      if (!salta) st.al = p.b;
      P({ fase: 3, riga: salta ? 3 : 2, al: !salta }, 3, salta ? 'MOV omessa' : 'MOV eseguita', (salta ? 'Il salto conduce direttamente a 0x401006. L’istruzione `mov al, bl` è omessa, e AL conserva il proprio valore, ' + U.H(p.a) + ', che era già il minore.' : 'L’esecuzione prosegue con `mov al, bl`, che copia BL in AL. Il registro contiene ora ' + U.H(p.b) + ', il minore dei due.'), { calc: 'AL = ' + U.H(st.al) });
      P({ fase: 4, riga: 3, al: true }, 4, 'Il byte restituito', 'I due percorsi si riuniscono a RET, e il frammento restituisce ' + U.H(ris) + '. ' + (altro !== ris ? 'Con l’altro salto avrebbe restituito ' + U.H(altro) + ': per questi due byte l’ordine con segno e quello senza segno danno esiti opposti, e il salto errato produce un errore privo di segnalazione.' : 'Per questi due byte i due ordini coincidono, e l’altro salto avrebbe dato il medesimo risultato.'), { calc: 'AL = ' + U.H(ris), esito: ['AL = ' + U.H(ris), 'si'] });
      return { passi, esito: U.H(ris) };
    }
  },
  bilancio: {
    regola: [
      'CMP scrive i flag di una sottrazione, e il salto ne stabilisce la lettura. Per i numeri senza segno JB e JAE esaminano CF. Per i numeri con segno JL e JGE confrontano SF con OF.',
      'JL salta quando SF e OF sono diversi, JGE quando sono uguali. JMP salta sempre, e riunisce i rami.'
    ],
    errori: [
      ['Impiegare JB per numeri con segno.', 'Il byte 0xFF vale −1. Confrontato con 1, JB prosegue in sequenza, e −1 è trattato come il maggiore.'],
      ['Esaminare soltanto SF per l’ordine con segno.', 'Per 0x80 e 0x01 la differenza è 0x7F, con SF a 0. Tuttavia −128 è minore di 1: lo rivela OF, che vale 1.'],
      ['Interpretare il confronto in senso inverso.', 'Dopo `cmp al, bl`, il salto JL avviene quando AL è minore di BL. La condizione riguarda il primo operando.']
    ],
    saFare: ['Scegliere il salto adatto al tipo dei dati confrontati.', 'Stabilire se JL e JB saltano, a partire dai flag.', 'Ricostruire il ramo eseguito dopo un confronto.'],
    esercizi: [
      { d: 'AL contiene 0x7F e BL contiene 0xFF. Quale byte contiene AL dopo `cmp al, bl`, `jl fine`, `mov al, bl` e, all’etichetta fine, `ret`? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x3C', giuste: ['0xff', 'ff', 'ffh'],
        ok: 'Con segno AL vale 127 e BL vale −1. AL è maggiore, JL prosegue in sequenza, e MOV copia BL in AL.',
        diagnosi: [
          { se: ['0x7f', '7f'], msg: 'Ciò varrebbe nell’ordine senza segno, dove 127 è minore di 255. JL impiega l’ordine con segno, e 0xFF vale −1.' },
          { se: ['0x80', '80'], msg: 'Il valore indicato è la differenza calcolata da CMP, che è scartata. In AL resta uno dei due byte di partenza.' }
        ],
        altro: 'Il byte è diverso. Si leggano i due byte con segno, si stabilisca se JL salta e si segua il ramo.',
        indizi: ['Con segno 0x7F vale 127 e 0xFF vale −1.', 'JL salta se AL è minore di BL. In questo caso 127 è maggiore di −1.', 'Il salto è escluso, e `mov al, bl` è eseguita.'],
        svolgimento: ['AL = 127, BL = −1, letti con segno.', 'JL salta se AL è minore: 127 è maggiore, e il salto è escluso.', '`mov al, bl` copia 0xFF in AL.', 'Il frammento restituisce 0xFF, cioè −1, il minore con segno.'] },
      { d: 'AL contiene 0x80 e BL contiene 0x01. Dopo `cmp al, bl` i flag valgono CF = 0, OF = 1, SF = 0. Quali salti sarebbero eseguiti?', guida: 'Si scelga la risposta.', o: [
        { t: 'JL salta, JB prosegue', ok: true, fb: 'SF e OF sono diversi: con segno −128 è minore di 1. CF vale 0: senza segno 128 è superiore a 1.' },
        { t: 'JB salta, JL prosegue', fb: 'JB richiede CF a 1, e in questo caso CF vale 0. JL richiede SF diverso da OF, condizione qui soddisfatta.' },
        { t: 'Saltano entrambi', fb: 'JB richiede CF a 1, e in questo caso CF vale 0: senza segno 128 è superiore a 1.' },
        { t: 'Proseguono entrambi', fb: 'SF vale 0 e OF vale 1: sono diversi, e JL salta. Con segno 0x80 vale −128.' }] }
    ],
    sfida: ['cslez2_6_03_random_assembly_03', 'Valore restituito, confronti e salti']
  }
});
SL.unita263 = { H: (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0') };
