'use strict';
SL.registra('3.4.1', {
  titolo: 'Dalle fasi dell’ISA a una macchina sincrona',
  obiettivo: 'Obiettivo: descrivere la CPU a ciclo singolo, che esegue un’intera istruzione in un ciclo di clock, e distinguere i valori che si propagano durante il ciclo dalle parti dello stato che cambiano al fronte.',
  concetti: [['cpu', 'Sei fasi, un solo ciclo'], ['bus', 'Segnali che si propagano'], ['clock', 'Lo stato cambia al fronte']],
  filigrana: ['cpu', 'clock', 'strati'],
  richiami: {
    carte: [
      { sim: 'strati', da: 'Dall’unità 3.3.3', t: 'Le sei fasi', d: 'Prelievo, decodifica, esecuzione, memoria, scrittura, aggiornamento del PC, con i valori trasmessi dall’una all’altra.' },
      { sim: 'clock', da: 'Dall’unità 3.2.2', t: 'Il fronte del clock', d: 'Un flip-flop cattura il dato presente all’ingresso soltanto al fronte di salita, e lo conserva fino al fronte successivo.' },
      { sim: 'register', da: 'Dall’unità 3.2.3', t: 'Il banco di registri', d: 'Le porte di lettura forniscono i contenuti senza attendere il clock. La porta di scrittura aggiorna un registro al fronte.' }
    ],
    domanda: { d: 'Prima di proseguire: in `sub rbx, rax`, con RAX = 9 e RBX = 4, che cosa calcola l’ALU?', o: [
      { t: '4 − 9 = −5', ok: true, fb: '`sub` sottrae il secondo operando dal primo: RBX − RAX.' },
      { t: '9 − 4 = 5', fb: 'Il secondo operando, RAX, è sottratto dal primo, RBX.' },
      { t: '4 + 9 = 13', fb: '`sub` calcola una differenza.' }
    ] }
  },
  idea: {
    titolo: 'L’intera istruzione fra due fronti',
    termini: ['cpu a ciclo singolo'],
    testo: [
      'La tabella delle fasi stabilisce che cosa compie un’istruzione; resta da stabilire in quali tempi. La soluzione più semplice consiste nell’eseguire tutte le fasi, dal prelievo all’aggiornamento del PC, entro un solo ciclo di clock. La CPU che ne risulta prende il nome di [[cpu a ciclo singolo|CPU a ciclo singolo]]: le istruzioni sono eseguite rigorosamente l’una dopo l’altra, una per ciclo.',
      'La CPU impiega due tipi di componenti. La logica combinatoria, cioè la lettura dei registri, l’ALU e i multiplexer, opera senza sincronizzazione, e a ogni variazione degli ingressi calcola nuove uscite. Per semplicità anche la memoria delle istruzioni è trattata come un circuito combinatorio, che dato un indirizzo fornisce i byte dell’istruzione. I dispositivi sequenziali richiedono invece il clock: il PC, ZF, il banco dei registri e la memoria dei dati.',
      { fig: 'scena', w: 720, h: 150, titolo: 'La struttura della CPU a ciclo singolo', nota: 'I blocchi in evidenza ricevono il clock. Gli altri sono combinatori.', els: [
        SL.el.box('pc', 0, 40, 80, 60, 'PC', 'stato', 'att', { cls: 'stretta' }), SL.el.linea('l1', 80, 70, 110, 70, 'on'),
        SL.el.box('mi', 110, 40, 130, 60, 'istruzioni', 'lettura', '', { cls: 'stretta' }), SL.el.linea('l2', 240, 70, 270, 70, 'on'),
        SL.el.box('rg', 270, 40, 120, 60, 'registri', 'stato', 'att', { cls: 'stretta' }), SL.el.linea('l3', 390, 70, 420, 70, 'on'),
        SL.el.box('al', 420, 40, 110, 60, 'ALU', 'e ZF', '', { cls: 'stretta' }), SL.el.linea('l4', 530, 70, 560, 70, 'on'),
        SL.el.box('md', 560, 40, 150, 60, 'memoria dati', 'stato', 'att', { cls: 'stretta' }),
        SL.el.linea('r1', 635, 100, 635, 132, ''), SL.el.linea('r2', 635, 132, 40, 132, ''), SL.el.linea('r3', 40, 132, 40, 100, ''), SL.el.linea('r4', 330, 132, 330, 100, ''),
        SL.el.nota('nr', 360, 112, 'nuovi valori per registri e PC', 'mono minuta'), SL.el.nota('nc', 0, 6, 'clock', 'mono minuta', 'att'), SL.el.linea('c1', 40, 24, 40, 40, 'att')
      ] },
      'All’inizio del ciclo il PC contiene un indirizzo. A partire da esso i segnali si propagano attraverso i blocchi nell’ordine delle fasi: dapprima i byte dell’istruzione, poi valA e valB, poi valE, poi l’eventuale valM. Si tratta di valori presenti sui fili e non ancora memorizzati. Quando tutti si sono assestati, i valori nuovi sono presenti agli ingressi degli elementi di stato, e il fronte di salita li cattura contemporaneamente.',
      'Le sei fasi sono quindi sei tratti del medesimo percorso combinatorio, che i segnali attraversano in successione entro un unico ciclo. Il PC riceve un valore nuovo a ogni ciclo, ZF soltanto dopo un’istruzione aritmetica o logica, la memoria soltanto dopo un `mov` che la scrive. Anche il banco dei registri è aggiornato a ogni ciclo: quando l’istruzione non richiede scritture, la porta di scrittura riceve il numero di registro F, che non individua alcun registro.',
      'Una regola rende possibile tale organizzazione: per calcolare, un’istruzione legge soltanto lo stato lasciato dalle istruzioni precedenti. `sub rbx, rax` legge il contenuto precedente di RBX, e il valore nuovo compare nel registro soltanto dopo il fronte.'
    ]
  },
  esperimento: {
    faremo: [
      'La CPU esegue `sub rbx, rax`, che si trova all’indirizzo 0x40. I controlli fissano i contenuti di RAX e di RBX.',
      'I segnali sono seguiti durante la propagazione, insieme al contenuto di RBX nel frattempo; segue il fronte. Dopo il caso proposto, è istruttivo selezionare due valori uguali e osservare ZF.'
    ],
    vedrai: [
      ['strati', 'Le fasi attraversate', 'In alto: il tratto di percorso raggiunto dai segnali.'],
      ['bus', 'I segnali', 'Al centro: i valori presenti sui fili e non ancora memorizzati.'],
      ['register', 'Lo stato', 'In basso: PC, registri e ZF, con i valori in attesa del fronte.']
    ]
  },
  lab: {
    titolo: 'Una sottrazione in un solo ciclo',
    scena: { w: 860, h: 300 },
    atti: ['L’inizio del ciclo', 'I segnali si propagano', 'I valori sono disponibili', 'Il fronte', 'Il ciclo successivo'],
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'RAX', opzioni: [[9, '9'], [4, '4'], [-2, '−2']], valore: 9 },
      { id: 'b', tipo: 'scelta', eti: 'RBX', opzioni: [[4, '4'], [9, '9']], valore: 4 }
    ],
    nota: 'I passi sono sempre sette. All’inizio ZF vale 1 e il PC vale 0x40.',
    previsione: {
      domanda: (p) => 'La CPU a ciclo singolo sta eseguendo `sub rbx, rax` con RAX = ' + SL.isa.num(p.a) + ' e RBX = ' + p.b + '. L’ALU ha appena prodotto valE, e il fronte del clock deve ancora giungere. Che cosa contiene RBX in questo istante?',
      opzioni: (p) => Array.from(new Set([p.b, p.b - p.a, p.a])).sort((x, y) => x - y).map((v) => [v, SL.isa.num(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + SL.isa.num(pred) + '. Prima del fronte RBX contiene ' + SL.isa.num(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il risultato ' + SL.isa.num(p.b - p.a) + ' è valE, un valore sui fili. Il registro lo cattura soltanto al fronte, e fino ad allora conserva il contenuto precedente.'),
    costruisci(p) {
      const el = SL.el, N = SL.isa.num, passi = [], FASI = ['prelievo', 'decodifica', 'esecuzione', 'memoria', 'scrittura', 'PC'], r = p.b - p.a, zf = r === 0 ? 1 : 0;
      const st = { f: -1, s: {}, rbx: p.b, zf: 1, pc: 0x40, att: false, ck: 'basso' };
      const quadro = (o) => {
        const els = [];
        FASI.forEach((n, k) => els.push(el.box('f' + k, 20 + k * 138, 0, 130, 40, null, n, k === st.f ? 'att' : k < st.f ? 'on' : '', { cls: 'stretta' })));
        [['byte', 'byte letti'], ['valA', 'valA'], ['valB', 'valB'], ['valE', 'valE'], ['cc', 'ZF calcolato'], ['valP', 'valP']].forEach((x, k) => els.push(el.box('s' + x[0], 20 + k * 138, 54, 130, 62, x[1], st.s[x[0]] == null ? '·' : st.s[x[0]], (o.nuovi || []).includes(x[0]) ? 'att' : st.s[x[0]] == null ? '' : 'on', { cls: 'stretta' })));
        els.push(el.nota('ts', 20, 132, 'STATO · CAMBIA SOLTANTO AL FRONTE', 'mono', o.fronte ? 'att' : ''),
          el.box('pc', 20, 160, 150, 66, 'PC', '0x' + st.pc.toString(16).toUpperCase(), o.fronte ? 'att' : 'on', { cls: 'stretta' }),
          el.box('rb', 180, 160, 150, 66, 'RBX', N(st.rbx), o.fronte ? 'att' : 'on', { cls: 'stretta' }),
          el.box('ra', 340, 160, 150, 66, 'RAX', N(p.a), 'on', { cls: 'stretta' }),
          el.box('cc', 500, 160, 190, 66, 'ZF', String(st.zf), o.fronte ? 'att' : 'on', { cls: 'stretta' }),
          el.box('ck', 700, 160, 146, 66, 'clock', st.ck, o.fronte ? 'att' : '', { cls: 'stretta' }),
          el.nota('p1', 28, 238, st.att ? 'in arrivo: 0x42' : '', 'mono minuta', 'att'), el.nota('p2', 188, 238, st.att ? 'in arrivo: ' + N(r) : '', 'mono minuta', 'att'), el.nota('p3', 508, 238, st.att ? 'in arrivo: ' + zf : '', 'mono minuta', 'att'));
        return els;
      };
      const hud = () => [['Fase', st.f < 0 ? 'inizio' : FASI[st.f], 'a'], ['valE', st.s.valE == null ? '·' : st.s.valE], ['RBX', N(st.rbx), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const PA = p.a < 0 ? '(' + N(p.a) + ')' : String(p.a);

      P({}, 0, 'Un fronte è appena trascorso', 'Il ciclo ha inizio. Lo stato è quello lasciato dall’istruzione precedente: PC = 0x40, RAX = ' + N(p.a) + ', RBX = ' + p.b + ', ZF = 1. Da questo istante e fino al prossimo fronte lo stato resterà invariato, mentre i segnali attraversano la logica.',
        { chiedi: { d: 'Durante il ciclo, quale elemento fornisce l’indirizzo dal quale leggere l’istruzione?', o: ['Il PC', 'Il registro RAX', 'L’ALU'], g: 0, no: 'Il PC contiene l’indirizzo dell’istruzione da prelevare, e resta invariato per tutto il ciclo.' } });
      st.f = 0; st.s.byte = '61 30'; st.s.valP = '0x42';
      P({ nuovi: ['byte', 'valP'] }, 1, 'Prelievo', 'All’indirizzo 0x40 si leggono i byte 61 e 30. Il primo ha icode 6 e ifun 1: `sub`. Il secondo indica rA = RBX, il registro numero 3, e rB = RAX, il registro numero 0. Un sommatore dedicato calcola valP = 0x40 + 2 = 0x42.', { calc: 'icode 6 · ifun 1 · valP = 0x42' });
      st.f = 1; st.s.valA = String(p.b); st.s.valB = N(p.a);
      P({ nuovi: ['valA', 'valB'] }, 1, 'Decodifica', 'I numeri dei due registri giungono alle porte di lettura A e B del banco, che fornisce i contenuti: valA = R[rbx] = ' + p.b + ' e valB = R[rax] = ' + N(p.a) + '. La lettura è combinatoria e avviene senza attendere alcun fronte.', { calc: 'valA = ' + p.b + ' · valB = ' + N(p.a) });
      st.f = 2; st.s.valE = N(r); st.s.cc = String(zf);
      P({ nuovi: ['valE', 'cc'] }, 1, 'Esecuzione', 'L’ALU riceve i due valori e il comando «differenza»: valE = valA − valB = ' + p.b + ' − ' + PA + ' = ' + N(r) + '. Accanto al risultato essa prepara il nuovo valore di ZF, che è ' + zf + '. Sono tutti valori sui fili.',
        { calc: 'valE = ' + p.b + ' − ' + PA + ' = ' + N(r), chiedi: { d: 'L’ALU ha prodotto valE = ' + N(r) + '. In questo istante il registro RBX contiene già il valore nuovo?', o: ['Sì', 'No'], g: 1, no: 'Il registro cambia soltanto al fronte. Per il momento contiene ancora ' + p.b + '.' } });
      st.f = 4; st.att = true;
      P({ nuovi: ['valE', 'cc', 'valP'] }, 2, 'Memoria e scrittura: i valori sono disponibili', '`sub` non impiega la memoria dei dati, e i segnali la oltrepassano. valE giunge alla porta di scrittura E del banco, con dstE uguale al numero di RBX. Il nuovo ZF è presente all’ingresso del suo elemento di stato, e valP all’ingresso del PC. Tre valori attendono il medesimo fronte, e lo stato è ancora quello di inizio ciclo.', { calc: 'in attesa: RBX, ZF, PC' });
      st.f = 5; st.rbx = r; st.zf = zf; st.pc = 0x42; st.att = false; st.ck = 'sale ↑';
      P({ fronte: true }, 3, 'Il fronte di salita', 'Il clock sale, e i tre elementi catturano contemporaneamente i valori presenti ai rispettivi ingressi. RBX passa da ' + p.b + ' a ' + N(r) + ', ZF diviene ' + zf + ', il PC passa da 0x40 a 0x42. L’istruzione è completata in un solo ciclo.', { calc: 'RBX = ' + N(r) + ' · ZF = ' + zf + ' · PC = 0x42' });
      st.f = -1; st.s = {}; st.ck = 'alto';
      P({}, 4, 'Il ciclo riprende', 'Il PC contiene ora 0x42, e i segnali ripartono da tale indirizzo: si leggono i byte dell’istruzione successiva, e la sequenza si ripete. Se quell’istruzione leggerà RBX, troverà ' + N(r) + '. Ogni istruzione opera sullo stato lasciato da quelle che l’hanno preceduta.',
        { calc: 'PC = 0x42', esito: ['RBX = ' + N(r) + ' dopo il fronte', 'si'] });
      return { passi, esito: p.b };
    }
  },
  bilancio: {
    regola: [
      'La CPU a ciclo singolo esegue ogni istruzione in un ciclo di clock. Durante il ciclo i segnali si propagano nella logica combinatoria, fase dopo fase. Al fronte gli elementi di stato catturano contemporaneamente i valori nuovi.',
      'Gli elementi di stato sono il PC, ZF, il banco dei registri e la memoria dei dati. Per calcolare, un’istruzione legge soltanto lo stato lasciato dalle precedenti.'
    ],
    errori: [
      ['Ritenere che le sei fasi occupino sei cicli.', 'Nella CPU a ciclo singolo sono tratti del medesimo percorso combinatorio, attraversati entro un unico ciclo.'],
      ['Ritenere che valE entri immediatamente nel registro.', 'Fino al fronte valE è un valore sui fili, e il registro conserva il contenuto precedente.'],
      ['Attendersi aggiornamenti in istanti diversi.', 'Registro di destinazione, ZF e PC cambiano tutti al medesimo fronte.']
    ],
    saFare: ['Elencare gli elementi di stato della CPU a ciclo singolo.', 'Distinguere un valore sui fili da un valore memorizzato.', 'Indicare che cosa cambia al fronte per un’operazione aritmetica.'],
    esercizi: [
      { d: 'Nella CPU a ciclo singolo, quale di questi valori cambia soltanto al fronte del clock?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il contenuto del registro di destinazione', ok: true, fb: 'Il banco dei registri è un elemento di stato: scrive al fronte.' },
        { t: 'L’uscita dell’ALU, valE', fb: 'L’ALU è combinatoria: la sua uscita segue gli ingressi durante il ciclo.' },
        { t: 'I valori letti dal banco, valA e valB', fb: 'La lettura del banco è combinatoria, e segue gli indirizzi presentati alle porte.' }] },
      { d: 'La CPU a ciclo singolo esegue `sub rbx, rax` con RAX = 3 e RBX = 10. Quanto vale RBX dopo il fronte che chiude il ciclo?', segnaposto: 'Un numero', giuste: ['7', 'sette'],
        ok: 'valE = valA − valB = 10 − 3 = 7, e al fronte RBX lo cattura.',
        diagnosi: [
          { se: ['-7', '−7'], msg: 'È stato calcolato RAX − RBX. `sub` sottrae il secondo operando dal primo.' },
          { se: ['10', 'dieci'], msg: 'Questo è il contenuto prima del fronte. Dopo il fronte il registro contiene valE.' },
          { se: ['13', 'tredici'], msg: 'Questa è la somma. `sub` calcola una differenza.' }
        ],
        altro: 'Il numero è diverso. Si calcoli valE = valA − valB: è il valore che RBX cattura al fronte.',
        indizi: ['valA è il contenuto di RBX, valB quello di RAX.', 'valE = valA − valB.', '10 − 3.'],
        svolgimento: ['valA = 10, valB = 3.', 'valE = 10 − 3 = 7.', 'Al fronte: RBX = 7.'] }
    ],
    sfida: ['cslez3_4_05_random_assembly', 'Selezione del PC e stato successivo']
  }
});
