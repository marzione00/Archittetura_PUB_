'use strict';
SL.registra('3.3.5', {
  titolo: 'Tracce complete delle istruzioni',
  obiettivo: 'Obiettivo: compilare la traccia completa di `sub` e di `je` attraverso le sei fasi, e indicare quale valore riceve il PC dopo il salto.',
  concetti: [['tabella', 'Una riga per fase'], ['flag', 'ZF, scritto da sub e letto da je'], ['puntatore', 'Due candidati per il PC']],
  filigrana: ['tabella', 'flag', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'strati', da: 'Dall’unità 3.3.3', t: 'Le sei fasi', d: 'Prelievo, decodifica, esecuzione, memoria, scrittura e aggiornamento del PC, sempre nel medesimo ordine.' },
      { sim: 'flag', da: 'Dall’unità 3.3.1', t: 'ZF', d: 'Le istruzioni aritmetiche e logiche pongono ZF a 1 quando il risultato è zero, e a 0 negli altri casi.' },
      { sim: 'puntatore', da: 'Dall’unità 3.3.2', t: 'Il successore valP', d: 'valP = PC + lunghezza è l’indirizzo dell’istruzione che segue in memoria.' }
    ],
    domanda: { d: 'Prima di proseguire: un `je` occupa 9 byte e ha inizio all’indirizzo 0x16. Quanto vale il suo valP?', o: [
      { t: '0x1F', ok: true, fb: '0x16 + 9 = 0x1F: il codice e gli otto byte della destinazione.' },
      { t: '0x18', fb: 'Un `je` contiene anche la destinazione, una costante di otto byte.' },
      { t: '0x20', fb: '`je` è privo del byte dei registri, e occupa 9 byte, non 10.' }
    ] }
  },
  idea: {
    titolo: 'Una riga per fase',
    termini: ['tabella delle fasi', 'cnd'],
    testo: [
      'La descrizione completa di un’istruzione si ottiene compilandone la [[tabella delle fasi]]: una riga per fase, e in ogni riga i valori letti, calcolati e scritti. La tabella è la specifica dalla quale deriva il circuito del capitolo 3.4, poiché indica a ciascun blocco l’operazione da compiere per quella categoria di istruzioni. Nel seguito R[r] indica il contenuto del registro r e M1[a] il byte all’indirizzo a.',
      'Per `sub rA, rB` il prelievo legge icode:ifun = 6:1 e rA:rB, e calcola valP = PC + 2. La decodifica legge valA = R[rA] e valB = R[rB]. L’esecuzione calcola valE = valA − valB e aggiorna ZF. La fase di memoria resta inattiva. La scrittura deposita valE in rA, e il PC riceve valP.',
      { fig: 'scena', w: 720, h: 232, titolo: 'La tabella delle fasi di je Dest', nota: 'La decodifica, la memoria e la scrittura restano inattive. Il PC sceglie fra due candidati.', els: [
        SL.el.nota('a1', 0, 12, 'prelievo', 'mono'), SL.el.box('b1', 180, 0, 540, 34, null, 'icode:ifun = 7:3 · valC = Dest · valP = PC + 9', 'on', { cls: 'stretta' }),
        SL.el.nota('a2', 0, 50, 'decodifica', 'mono'), SL.el.box('b2', 180, 38, 540, 34, null, 'nessun registro', 'off', { cls: 'stretta' }),
        SL.el.nota('a3', 0, 88, 'esecuzione', 'mono'), SL.el.box('b3', 180, 76, 540, 34, null, 'Cnd = Cond(ZF, ifun)', 'att', { cls: 'stretta' }),
        SL.el.nota('a4', 0, 126, 'memoria', 'mono'), SL.el.box('b4', 180, 114, 540, 34, null, 'nessun accesso', 'off', { cls: 'stretta' }),
        SL.el.nota('a5', 0, 164, 'scrittura', 'mono'), SL.el.box('b5', 180, 152, 540, 34, null, 'nessun registro', 'off', { cls: 'stretta' }),
        SL.el.nota('a6', 0, 202, 'PC', 'mono'), SL.el.box('b6', 180, 190, 540, 34, null, 'PC = Cnd ? valC : valP', 'att', { cls: 'stretta' })
      ] },
      'L’esecuzione di `je` coinvolge due indirizzi: valP, quello dell’istruzione che segue il salto, e valC, la destinazione contenuta nell’istruzione. Nella fase di esecuzione l’unità Cond calcola il segnale [[cnd|Cnd]] a partire da ZF e da ifun: per `je`, Cnd vale 1 quando ZF vale 1. L’aggiornamento del PC assegna valC se Cnd vale 1, valP in caso contrario.',
      'Le due istruzioni sono quindi collegate da ZF. `sub` lo scrive nella propria fase di esecuzione, e `je` lo legge nella propria. Fra le due nessun’altra istruzione deve modificarlo, poiché `je` esamina sempre il valore lasciato dall’ultima istruzione aritmetica o logica.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento segue `sub rax, rbx`, all’indirizzo 0x14, e il `je` che la segue all’indirizzo 0x16, come nell’esempio della dispensa. I controlli fissano i valori di RAX e di RBX e la destinazione del salto.',
      'ZF nasce nella fase di esecuzione di `sub` e decide l’aggiornamento del PC di `je`. Dopo il caso proposto, è istruttivo rendere uguali RAX e RBX e osservare quale candidato riceve il PC.'
    ],
    vedrai: [
      ['strati', 'Le fasi', 'In alto: l’istruzione in corso e la fase raggiunta.'],
      ['tabella', 'I valori', 'Al centro: valC, valP, valA, valB, valE e Cnd.'],
      ['flag', 'Stato e PC', 'In basso: RAX, ZF e il contatore di programma.']
    ]
  },
  lab: {
    titolo: 'Una sottrazione e il suo salto',
    scena: { w: 860, h: 300 },
    atti: ['sub: prelievo e decodifica', 'sub: esecuzione', 'sub: scrittura e PC', 'je: prelievo', 'je: esecuzione', 'je: aggiornamento del PC'],
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'RAX', opzioni: [[5, '5'], [3, '3'], [8, '8']], valore: 5 },
      { id: 'b', tipo: 'scelta', eti: 'RBX', opzioni: [[3, '3'], [8, '8']], valore: 3 },
      { id: 't', tipo: 'scelta', eti: 'Destinazione', opzioni: [[0x64, '0x64'], [0x200, '0x200']], valore: 0x64 }
    ],
    nota: 'I passi sono sempre otto: cinque per sub e tre per je. All’inizio ZF vale 1.',
    previsione: {
      domanda: (p) => { const H = SL.isa.esa; return 'All’indirizzo 0x14 si trova `sub rax, rbx`, e all’indirizzo 0x16 `je ' + H(p.t) + '`. RAX vale ' + p.a + ' e RBX vale ' + p.b + '. Quale valore riceve il PC dopo il salto?'; },
      opzioni: (p) => { const H = SL.isa.esa; return [0x16, 0x1F, p.t].map((v) => [H(v), H(v)]); }
    },
    confronto: (pred, esito, p) => { const H = SL.isa.esa, z = p.a === p.b; return 'La previsione indicava ' + pred + '. Dopo il salto il PC vale ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === '0x16' ? '0x16 è l’indirizzo del `je` stesso. Il PC riceve valC oppure valP del salto.' : z ? 'La differenza ' + p.a + ' − ' + p.b + ' è zero, quindi ZF = 1, Cnd = 1, e il PC riceve la destinazione ' + H(p.t) + '.' : 'La differenza ' + p.a + ' − ' + p.b + ' è diversa da zero, quindi ZF = 0, Cnd = 0, e il PC riceve valP = 0x16 + 9 = 0x1F.'); },
    costruisci(p) {
      const el = SL.el, I = SL.isa, H = I.esa, N = I.num, passi = [], FASI = ['prelievo', 'decodifica', 'esecuzione', 'memoria', 'scrittura', 'PC'];
      const sub = { n: 'sub', a: 'rax', b: 'rbx' }, je = { n: 'je', c: p.t }, s0 = { R: { rax: p.a, rbx: p.b }, M: {}, zf: 1, pc: 0x14 };
      const f1 = I.fasi(sub, s0), s1 = I.esegui(sub, s0), f2 = I.fasi(je, s1), fine = f2.pcNuovo;
      const st = { ist: 'sub', f: 0, v: {}, rax: p.a, zf: 1, pc: 0x14 };
      const quadro = (o) => {
        const els = [el.box('is', 20, 0, 150, 40, null, st.ist === 'sub' ? 'sub rax, rbx' : 'je ' + H(p.t), 'on', { cls: 'stretta' })];
        FASI.forEach((n, k) => els.push(el.box('f' + k, 180 + k * 112, 0, 106, 40, null, n, k === st.f ? 'att' : k < st.f ? 'on' : '', { cls: 'stretta' })));
        ['valC', 'valP', 'valA', 'valB', 'valE', 'Cnd'].forEach((n, k) => {
          const v = st.v[n], txt = v === undefined ? '·' : v === null ? '·' : n === 'valP' || n === 'valC' ? H(v) : N(v);
          els.push(el.box('v' + n, 20 + k * 138, 56, 130, 62, n, txt, (o.nuovi || []).includes(n) ? 'att' : v === undefined ? '' : v === null ? 'off' : 'on', { cls: 'stretta' }));
        });
        els.push(el.nota('tc', 20, 136, 'CANDIDATI DEL PC', 'mono', st.ist === 'je' && st.f === 5 ? 'att' : ''),
          el.box('k1', 20, 160, 200, 60, 'valP', st.ist === 'je' ? H(0x1F) : H(0x16), o.pc && fine === 0x1F ? 'att' : '', { cls: 'stretta' }),
          el.box('k2', 230, 160, 200, 60, 'valC', st.ist === 'je' ? H(p.t) : 'assente', st.ist !== 'je' ? 'off' : o.pc && fine === p.t ? 'att' : '', { cls: 'stretta' }),
          el.box('ra', 20, 232, 200, 60, 'RAX', N(st.rax), o.rax ? 'att' : 'on', { cls: 'stretta' }),
          el.box('zf', 230, 232, 200, 60, 'ZF', String(st.zf), o.zf ? 'att' : st.zf ? 'on' : '', { cls: 'stretta' }),
          el.box('pc', 470, 160, 374, 132, 'PC', H(st.pc), o.pc ? 'att' : 'on', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Istruzione', st.ist, 'a'], ['ZF', String(st.zf)], ['PC', H(st.pc), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      st.v = { valC: null, valP: f1.valP };
      P({ nuovi: ['valP'] }, 0, 'sub: prelievo', 'Il PC vale 0x14. Il primo byte, 61, indica icode:ifun = 6:1, cioè `sub`. Il byte dei registri, 03, indica rA = RAX e rB = RBX. Manca la costante. L’istruzione occupa 2 byte, quindi valP = 0x14 + 2 = 0x16.',
        { calc: 'valP = 0x14 + 2 = 0x16' });
      st.f = 1; st.v.valA = f1.valA; st.v.valB = f1.valB;
      P({ nuovi: ['valA', 'valB'] }, 0, 'sub: decodifica', 'Il banco dei registri riceve i numeri di RAX e di RBX sulle porte di lettura A e B, e fornisce valA = R[rax] = ' + p.a + ' e valB = R[rbx] = ' + p.b + '.',
        { calc: 'valA = ' + p.a + ' · valB = ' + p.b, chiedi: { d: 'Quale differenza calcolerà l’ALU?', o: [N(p.a - p.b), N(p.b - p.a), N(p.a + p.b)].filter((x, k, a) => a.indexOf(x) === k), g: 0, no: 'L’ALU calcola valA − valB, cioè RAX − RBX = ' + p.a + ' − ' + p.b + ' = ' + N(p.a - p.b) + '.' } });
      st.f = 2; st.v.valE = f1.valE; st.zf = f1.zf;
      P({ nuovi: ['valE'], zf: true }, 1, 'sub: esecuzione', 'L’ALU calcola valE = valA − valB = ' + p.a + ' − ' + p.b + ' = ' + N(f1.valE) + '. ' + (f1.zf ? 'Il risultato è zero, e ZF passa a 1.' : 'Il risultato è diverso da zero, e ZF passa a 0.') + ' È il valore che il `je` successivo esaminerà.',
        { calc: 'valE = ' + N(f1.valE) + ' · ZF = ' + f1.zf, chiedi: { d: 'Il risultato vale ' + N(f1.valE) + '. Quanto vale ZF?', o: ['0', '1'], g: f1.zf, no: 'ZF vale 1 soltanto quando il risultato è zero.' } });
      st.f = 4; st.rax = f1.valE;
      P({ rax: true }, 2, 'sub: memoria e scrittura', 'La fase di memoria resta inattiva: `sub` non accede alla memoria dei dati. Nella scrittura il banco dei registri riceve valE sulla porta E, con dstE uguale al numero di RAX: al fronte RAX assume il valore ' + N(f1.valE) + '.', { calc: 'R[rax] = valE = ' + N(f1.valE) });
      st.f = 5; st.pc = 0x16;
      P({ pc: true }, 2, 'sub: aggiornamento del PC', '`sub` lascia invariato il flusso, e il PC riceve valP e passa a 0x16, dove ha inizio il salto.', { calc: 'PC = valP = 0x16' });
      st.ist = 'je'; st.f = 0; st.v = { valC: p.t, valP: f2.valP, valA: null, valB: null, valE: null };
      P({ nuovi: ['valC', 'valP'] }, 3, 'je: prelievo', 'Il primo byte, 73, indica icode:ifun = 7:3, cioè `je`. Il salto è privo del byte dei registri, e gli otto byte da 1 a 8 sono la destinazione: valC = ' + H(p.t) + '. L’istruzione occupa 9 byte, quindi valP = 0x16 + 9 = 0x1F. La decodifica non legge alcun registro.',
        { calc: 'valC = ' + H(p.t) + ' · valP = 0x1F', chiedi: { d: 'Il salto deve esaminare un dato dello stato. Quale?', o: ['ZF', 'RAX', 'RBX'], g: 0, no: '`je` è privo di operandi registro, ed esamina soltanto ZF, lasciato da `sub`.' } });
      st.f = 2; st.v.Cnd = f2.cnd;
      P({ nuovi: ['Cnd'], zf: true }, 4, 'je: esecuzione', 'L’ALU resta inattiva. L’unità Cond legge ZF = ' + s1.zf + ' e ifun = 3, la condizione «uguale», e produce Cnd = ' + f2.cnd + '. Le fasi di memoria e di scrittura restano inattive: il salto non modifica né la memoria né i registri, e lascia invariato ZF.',
        { calc: 'Cnd = Cond(ZF = ' + s1.zf + ', 3) = ' + f2.cnd, chiedi: { d: 'Cnd vale ' + f2.cnd + '. Quale candidato riceverà il PC?', o: ['valC = ' + H(p.t), 'valP = 0x1F'], g: f2.cnd ? 0 : 1, no: 'Il PC riceve valC se Cnd vale 1, valP se vale 0.' } });
      st.f = 5; st.pc = fine;
      P({ pc: true }, 5, 'je: aggiornamento del PC', f2.cnd ? 'Cnd vale 1: il salto è eseguito, e il PC riceve valC = ' + H(p.t) + '. L’istruzione all’indirizzo 0x1F non sarà eseguita in questo passaggio.' : 'Cnd vale 0: il salto non è eseguito, e il PC riceve valP = 0x1F, l’istruzione che segue in memoria. La destinazione ' + H(p.t) + ' è rimasta inutilizzata.',
        { calc: 'PC = ' + (f2.cnd ? 'valC' : 'valP') + ' = ' + H(fine), esito: ['PC = ' + H(fine), 'si'] });
      return { passi, esito: H(fine) };
    }
  },
  bilancio: {
    regola: [
      '`sub rA, rB` calcola valE = valA − valB, aggiorna ZF, deposita valE in rA attraverso la porta E e assegna al PC valP = PC + 2.',
      '`je Dest` ricava valC = Dest e valP = PC + 9, non legge registri, calcola Cnd da ZF e assegna al PC valC se Cnd vale 1, valP in caso contrario.'
    ],
    errori: [
      ['Attribuire a `je` la scrittura di ZF.', 'Il salto si limita a leggere ZF. Lo scrive l’ultima istruzione aritmetica o logica che lo precede.'],
      ['Assegnare al PC la destinazione in ogni caso.', 'Con Cnd = 0 il PC riceve valP, l’istruzione che segue il salto.'],
      ['Contare 10 byte per `je`.', '`je` è privo del byte dei registri: 1 byte di codice e 8 di destinazione.']
    ],
    saFare: ['Compilare la tabella delle fasi di `sub` e di `je`.', 'Calcolare Cnd a partire da ZF.', 'Indicare quale valore riceve il PC dopo un salto.'],
    esercizi: [
      { d: 'Un `je 0x200` ha inizio all’indirizzo 0x124, e ZF vale 0. Quale valore riceve il PC? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x130', giuste: ['0x12d', '12d', '12dh'],
        ok: 'Con ZF = 0 si ha Cnd = 0, e il PC riceve valP = 0x124 + 9 = 0x12D.',
        diagnosi: [
          { se: ['0x200', '200', '200h'], msg: 'La destinazione è scelta soltanto con ZF = 1. Qui ZF vale 0.' },
          { se: ['0x12e', '12e', '12eh'], msg: '`je` occupa 9 byte, perché non ha il byte dei registri.' },
          { se: ['0x124', '124', '124h'], msg: 'Questo è l’indirizzo del salto stesso. Il PC riceve valC oppure valP.' }
        ],
        altro: 'Il valore è diverso. Si calcoli Cnd da ZF, e quindi si scelga fra valC e valP.',
        indizi: ['Per `je`, Cnd vale 1 soltanto quando ZF vale 1.', 'Con Cnd = 0 il PC riceve valP.', 'valP = 0x124 + 9.'],
        svolgimento: ['ZF = 0, quindi Cnd = 0.', 'valP = 0x124 + 9 = 0x12D.', 'PC = 0x12D.'] },
      { d: 'In quale fase `je` stabilisce se il salto è eseguito?', guida: 'Si scelga la risposta.', o: [
        { t: 'Nella fase di esecuzione', ok: true, fb: 'L’unità Cond calcola Cnd da ZF e da ifun nella fase di esecuzione. L’aggiornamento del PC impiega poi Cnd.' },
        { t: 'Nella fase di decodifica', fb: 'La decodifica legge i registri, e `je` non ne nomina alcuno.' },
        { t: 'Nella fase di prelievo', fb: 'Il prelievo ricava valC e valP, entrambi necessari. La scelta richiede ZF, esaminato nella fase successiva.' }] }
    ],
    sfida: ['cslez3_3_03_random_assembly', 'Registri sorgente e destinazione']
  }
});
