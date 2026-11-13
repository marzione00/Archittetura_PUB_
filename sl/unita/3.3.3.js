'use strict';
SL.registra('3.3.3', {
  titolo: 'Semantica delle istruzioni e flusso dei dati',
  obiettivo: 'Alla fine saprai nominare le sei fasi in cui Y86-64 esegue un’istruzione, e seguire i valori che passano da una fase all’altra durante una lettura dalla memoria.',
  concetti: [['strati', 'Sei fasi, sempre nello stesso ordine'], ['memory', 'Indirizzo e contenuto'], ['byte', 'Otto celle, una parola']],
  filigrana: ['strati', 'memory', 'alu'],
  richiami: {
    carte: [
      { sim: 'hex', da: 'Dall’unità 3.3.2', t: 'valC e valP', d: 'La costante contenuta nell’istruzione si chiama valC. L’indirizzo dell’istruzione che segue in memoria si chiama valP.' },
      { sim: 'memory', da: 'Dall’unità 2.1.2', t: 'Base più spostamento', d: 'L’indirizzo di una cella si ottiene sommando al contenuto di un registro di base uno spostamento scritto nell’istruzione.' },
      { sim: 'byte', da: 'Dall’unità 1.2.3', t: 'Una parola, otto celle', d: 'Una parola di 64 bit occupa otto celle consecutive. In little-endian la prima contiene il byte meno significativo.' }
    ],
    domanda: { d: 'Prima di proseguire: il registro di base vale 16 e lo spostamento vale 4. A quale indirizzo si trova la cella?', o: [
      { t: '20', ok: true, fb: 'L’indirizzo è la somma di base e spostamento: 16 + 4.' },
      { t: '64', fb: 'Base e spostamento si sommano, senza moltiplicarsi.' },
      { t: '12', fb: 'Lo spostamento, qui positivo, va sommato alla base.' }
    ] }
  },
  idea: {
    titolo: 'Sei fasi, e i valori che le attraversano',
    termini: ['fase di prelievo', 'fase di decodifica', 'fase di esecuzione', 'fase di memoria', 'fase di scrittura', 'aggiornamento del pc'],
    testo: [
      'Ogni istruzione Y86-64 viene eseguita in sei fasi, sempre nello stesso ordine. Alcune istruzioni attraversano certe fasi senza compiervi nulla, e l’ordine resta fisso. Questa regolarità permetterà di costruire un solo circuito per tutte le istruzioni.',
      'La [[fase di prelievo]] legge dalla memoria i byte dell’istruzione, a partire dal PC, e ne ricava icode, ifun, i registri, la costante valC e il successore valP. La [[fase di decodifica]] legge dal banco fino a due registri, e i valori letti si chiamano valA e valB. La [[fase di esecuzione]] fa lavorare l’ALU, e il risultato si chiama valE: per un’operazione aritmetica è il risultato, per un accesso alla memoria è l’indirizzo.',
      'La [[fase di memoria]] legge una parola dalla memoria dei dati, oppure ne scrive una, e la parola letta si chiama valM. La [[fase di scrittura]] deposita i risultati nel banco dei registri. L’[[aggiornamento del pc|aggiornamento del PC]] sceglie l’indirizzo della prossima istruzione, che di solito è valP.',
      { fig: 'scena', w: 720, h: 96, titolo: 'Le sei fasi e i valori che producono', nota: 'Ogni fase usa i valori preparati da quelle che la precedono.', els: [
        SL.el.box('f1', 0, 6, 112, 64, 'prelievo', 'valC valP', 'att', { cls: 'stretta' }), SL.el.box('f2', 122, 6, 112, 64, 'decodifica', 'valA valB', 'on', { cls: 'stretta' }),
        SL.el.box('f3', 244, 6, 112, 64, 'esecuzione', 'valE', 'on', { cls: 'stretta' }), SL.el.box('f4', 366, 6, 112, 64, 'memoria', 'valM', 'on', { cls: 'stretta' }),
        SL.el.box('f5', 488, 6, 112, 64, 'scrittura', 'registri', 'on', { cls: 'stretta' }), SL.el.box('f6', 610, 6, 110, 64, 'PC', 'nuovo PC', '', { cls: 'stretta' })
      ] },
      'Seguiamo `mrmovq 4(%rbx), %rax`, che legge una parola dalla memoria e la mette in %rax. Il prelievo ricava valC = 4 e valP. La decodifica legge la base: valB è il contenuto di %rbx. Nell’esecuzione l’ALU somma i due e ottiene l’indirizzo, valE = valB + valC. La fase di memoria legge le otto celle che cominciano a valE e le ricompone in little-endian nella parola valM. La scrittura deposita valM in %rax. Infine il PC riceve valP.',
      'Conviene tenere distinte due grandezze che si scambiano facilmente. valE è un indirizzo, cioè una posizione. valM è il contenuto trovato in quella posizione.'
    ]
  },
  esperimento: {
    faremo: [
      'Eseguiremo una `mrmovq` che comincia all’indirizzo 0x40, una fase alla volta. La memoria dei dati è preparata in modo che ogni cella contenga il triplo del proprio indirizzo, ridotto a un byte. Sceglierai il valore della base %rbx e lo spostamento.',
      'Vedremo nascere valC e valP, poi valB, valE e valM, fino alla scrittura in %rax e al nuovo PC. Dopo il caso proposto, scegli uno spostamento negativo.'
    ],
    vedrai: [
      ['strati', 'Le sei fasi', 'In alto: la fase in corso, in evidenza.'],
      ['alu', 'I valori', 'Sotto: valC, valP, valB, valE e valM, man mano che vengono prodotti.'],
      ['memory', 'Memoria e registri', 'In basso: le otto celle lette, poi %rbx, %rax e il PC.']
    ]
  },
  lab: {
    titolo: 'Una lettura dalla memoria, fase per fase',
    scena: { w: 860, h: 316 },
    atti: ['Prelievo', 'Decodifica', 'Esecuzione', 'Memoria', 'Scrittura', 'Aggiornamento del PC'],
    controlli: [
      { id: 'b', tipo: 'scelta', eti: 'Base, %rbx', opzioni: [[16, '16'], [32, '32']], valore: 16 },
      { id: 'd', tipo: 'scelta', eti: 'Spostamento', opzioni: [[4, '4'], [0, '0'], [-8, '−8']], valore: 4 }
    ],
    nota: 'I passi sono sempre sei, uno per fase. Ogni cella di memoria contiene il triplo del proprio indirizzo, modulo 256.',
    previsione: {
      domanda: (p) => 'Ogni cella di memoria contiene il triplo del proprio indirizzo, modulo 256. Il registro %rbx vale ' + p.b + '. Si esegue `mrmovq ' + p.d + '(%rbx), %rax`. Quale byte finisce nella posizione meno significativa di %rax?',
      opzioni: (p) => { const U = SL.unita333, a = p.b + p.d; return Array.from(new Set([U.cella(a), U.cella(a + 7), U.cella(p.b), a & 255])).sort((x, y) => x - y).map((v) => [v, '0x' + SL.y86.esa2(v)]); }
    },
    confronto: (pred, esito, p) => { const H = (v) => '0x' + SL.y86.esa2(v), a = p.b + p.d; return 'Avevi previsto ' + H(pred) + '. Il byte meno significativo di %rax è ' + H(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'L’indirizzo è ' + p.b + ' + ' + (p.d < 0 ? '(' + SL.x86.num(p.d) + ')' : p.d) + ' = ' + a + '. In little-endian la prima cella, quella all’indirizzo ' + a + ', dà il byte meno significativo: 3 × ' + a + ' = ' + 3 * a + ', cioè ' + H(esito) + '.'); },
    costruisci(p) {
      const el = SL.el, Y = SL.y86, U = SL.unita333, N = SL.x86.num, passi = [], ist = { n: 'mrmovq', a: 'rax', b: 'rbx', c: p.d }, byte = Y.byteIst(ist).map(Y.esa2);
      const valE = p.b + p.d, celle = Array.from({ length: 8 }, (_, k) => U.cella(valE + k)), valM = '0x' + celle.slice().reverse().map(Y.esa2).join(''), FASI = ['prelievo', 'decodifica', 'esecuzione', 'memoria', 'scrittura', 'PC'];
      const st = { f: 0, valC: false, valB: false, valE: false, valM: false, rax: false, pc: 0x40 };
      const quadro = (o) => {
        const els = [];
        FASI.forEach((n, k) => els.push(el.box('f' + k, 20 + k * 138, 0, 130, 40, null, n, k === st.f ? 'att' : k < st.f ? 'on' : '', { cls: 'stretta' })));
        els.push(el.box('v1', 20, 54, 150, 62, 'valC', st.valC ? N(p.d) : '·', o.nuovo === 'valC' ? 'att' : st.valC ? 'on' : '', { cls: 'stretta' }),
          el.box('v2', 180, 54, 150, 62, 'valP', st.valC ? '0x4A' : '·', o.nuovo === 'valC' || o.nuovo === 'pc' ? 'att' : st.valC ? 'on' : '', { cls: 'stretta' }),
          el.box('v3', 340, 54, 150, 62, 'valB', st.valB ? String(p.b) : '·', o.nuovo === 'valB' ? 'att' : st.valB ? 'on' : '', { cls: 'stretta' }),
          el.box('v4', 500, 54, 150, 62, 'valE', st.valE ? String(valE) : '·', o.nuovo === 'valE' ? 'att' : st.valE ? 'on' : '', { cls: 'stretta' }),
          el.nota('ni', 664, 64, Y.testo(ist), 'mono minuta'), el.nota('nb', 664, 88, byte.slice(0, 3).join(' ') + ' …', 'mono minuta', st.f === 0 ? 'att' : ''));
        els.push(el.nota('tm', 20, 122, 'MEMORIA DEI DATI, DA valE', 'mono', st.f === 3 ? 'att' : ''));
        celle.forEach((b, k) => els.push(el.cella('m' + k, 20 + k * 66, 176, 60, 42, st.valE ? Y.esa2(b) : '·', !st.valE ? 'off' : o.nuovo === 'valM' ? 'att' : st.valM ? 'on' : '', { piccola: true, cls: 'minuta', so: st.valE ? String(valE + k) : '' })));
        els.push(el.box('v5', 560, 156, 286, 62, 'valM', st.valM ? valM : '·', o.nuovo === 'valM' ? 'att' : st.valM ? 'on' : '', { cls: 'stretta' }),
          el.box('r1', 20, 236, 170, 66, '%rbx', String(p.b), o.nuovo === 'valB' ? 'att' : 'on', { cls: 'stretta' }),
          el.box('r2', 200, 236, 350, 66, '%rax', st.rax ? valM : 'valore precedente', o.nuovo === 'rax' ? 'att' : st.rax ? 'on' : '', { cls: 'stretta' }),
          el.box('r3', 560, 236, 286, 66, 'PC', Y.esa(st.pc), o.nuovo === 'pc' ? 'att' : 'on', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Fase', FASI[st.f], 'a'], ['valE', st.valE ? String(valE) : '·'], ['PC', Y.esa(st.pc), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const PD = p.d < 0 ? '(' + N(p.d) + ')' : String(p.d), opzE = Array.from(new Set([p.b + p.d, p.b - p.d, p.b * 2, p.d])).sort((x, y) => x - y);

      st.valC = true;
      P({ nuovo: 'valC' }, 0, 'Prelievo', 'Il PC vale 0x40. Il processore legge il primo byte, 50: icode 5, la classe di `mrmovq`. Il byte dei registri, 03, indica rA = %rax e rB = %rbx. Seguono gli otto byte della costante: valC = ' + N(p.d) + '. L’istruzione occupa dieci byte, quindi valP = 0x4A.',
        { calc: 'valC = ' + N(p.d) + ' · valP = 0x4A', chiedi: { d: 'Nella decodifica servirà il contenuto di un registro. Quale?', o: ['%rax', '%rbx'], g: 1, no: '%rbx è la base dell’indirizzo, e va letto. %rax è la destinazione: verrà scritto, e il suo vecchio contenuto non serve.' } });
      st.f = 1; st.valB = true;
      P({ nuovo: 'valB' }, 1, 'Decodifica', 'Il banco dei registri riceve l’indirizzo di %rbx e ne mostra il contenuto: valB = ' + p.b + '. È la base da cui partire per trovare il dato.',
        { calc: 'valB = ' + p.b, chiedi: { d: 'Con valB = ' + p.b + ' e valC = ' + N(p.d) + ', quale indirizzo calcolerà l’ALU?', o: opzE.map(N), g: opzE.indexOf(valE), no: 'L’ALU somma base e spostamento: ' + p.b + ' + ' + PD + ' = ' + valE + '.' } });
      st.f = 2; st.valE = true;
      P({ nuovo: 'valE' }, 2, 'Esecuzione', 'L’ALU somma la base e lo spostamento: valE = valB + valC = ' + p.b + ' + ' + PD + ' = ' + valE + '. Questo numero è un indirizzo: dice dove comincia il dato, e nulla sul suo contenuto.',
        { calc: 'valE = ' + p.b + ' + ' + PD + ' = ' + valE, chiedi: { d: 'La parola da leggere occupa otto celle a partire dall’indirizzo ' + valE + '. Qual è l’indirizzo dell’ultima?', o: [valE + 1, valE + 7, valE + 8].map(String), g: 1, no: 'Otto celle a partire da ' + valE + ': la prima è ' + valE + ', l’ultima è ' + valE + ' + 7 = ' + (valE + 7) + '.' } });
      st.f = 3; st.valM = true;
      P({ nuovo: 'valM' }, 3, 'Memoria', 'La memoria riceve l’indirizzo valE e consegna le otto celle da ' + valE + ' a ' + (valE + 7) + '. Ciascuna contiene il triplo del proprio indirizzo: la prima ' + Y.esa2(celle[0]) + ', l’ultima ' + Y.esa2(celle[7]) + '. In little-endian la prima cella è il byte meno significativo, quindi nella parola valM compare all’estrema destra.',
        { calc: 'valM = ' + valM });
      st.f = 4; st.rax = true;
      P({ nuovo: 'rax' }, 4, 'Scrittura', 'Il banco dei registri riceve valM sulla porta di scrittura, con l’indirizzo di %rax. Al fronte del clock %rax assume il valore ' + valM + '. Il registro %rbx è stato soltanto letto, e resta ' + p.b + '.',
        { calc: '%rax = valM' });
      st.f = 5; st.pc = 0x4A;
      P({ nuovo: 'pc' }, 5, 'Aggiornamento del PC', '`mrmovq` non è un salto, quindi la prossima istruzione è quella che segue in memoria. Il PC riceve valP e passa da 0x40 a 0x4A. Due numeri hanno fatto da indirizzo in questa istruzione, e riguardano zone diverse: ' + valE + ' per il dato, 0x4A per il programma.',
        { calc: 'PC = valP = 0x4A', esito: ['byte basso di %rax: ' + Y.esa2(celle[0]), 'si'] });
      return { passi, esito: celle[0] };
    }
  },
  bilancio: {
    regola: [
      'Ogni istruzione attraversa sei fasi nello stesso ordine: prelievo, decodifica, esecuzione, memoria, scrittura, aggiornamento del PC. I valori che passano da una fase all’altra hanno nomi fissi: valC e valP, valA e valB, valE, valM.',
      'In `mrmovq D(rB), rA` l’ALU calcola l’indirizzo valE = valB + valC, la memoria fornisce la parola valM che comincia a quell’indirizzo, e la scrittura la deposita in rA.'
    ],
    errori: [
      ['Scambiare valE con valM.', 'valE è l’indirizzo calcolato dall’ALU. valM è la parola che la memoria contiene a quell’indirizzo.'],
      ['Leggere una sola cella.', 'Una parola di 64 bit occupa otto celle, da valE a valE + 7.'],
      ['Ricomporre la parola partendo dal byte sbagliato.', 'In little-endian la cella all’indirizzo valE contiene il byte meno significativo.']
    ],
    saFare: ['Elenco le sei fasi nell’ordine giusto.', 'Dico quale valore produce ciascuna fase.', 'Seguo una `mrmovq` dal prelievo all’aggiornamento del PC.'],
    esercizi: [
      { d: 'Si esegue `mrmovq 24(%rbx), %rax` con %rbx = 100. Quanto vale valE?', segnaposto: 'Un numero', giuste: ['124', 'centoventiquattro'],
        ok: 'valE = valB + valC = 100 + 24 = 124.',
        diagnosi: [
          { se: ['100', 'cento'], msg: 'Questo è valB, la base. Va sommato lo spostamento valC.' },
          { se: ['24', 'ventiquattro'], msg: 'Questo è valC, lo spostamento. Va sommato alla base valB.' },
          { se: ['131'], msg: 'Questo è l’indirizzo dell’ultima cella letta. valE è l’indirizzo della prima.' }
        ],
        altro: 'Il numero è diverso. Somma il contenuto del registro di base e lo spostamento.',
        indizi: ['valB è il contenuto di %rbx.', 'valC è lo spostamento scritto nell’istruzione.', '100 + 24.'],
        svolgimento: ['valB = 100.', 'valC = 24.', 'valE = 100 + 24 = 124.'] },
      { d: 'In quale fase `mrmovq` deposita la parola letta nel registro di destinazione?', guida: 'Scegli la risposta.', o: [
        { t: 'Nella fase di scrittura', ok: true, fb: 'La fase di memoria produce valM, e la fase di scrittura lo deposita nel banco dei registri.' },
        { t: 'Nella fase di memoria', fb: 'La fase di memoria legge la parola e la rende disponibile come valM. Il registro la riceve nella fase successiva.' },
        { t: 'Nella fase di esecuzione', fb: 'Nell’esecuzione l’ALU calcola l’indirizzo valE. Il dato non è ancora stato letto.' }] }
    ],
    sfida: ['cslez3_3_05_random_assembly', 'Memoria, scrittura dei risultati e aggiornamento del PC']
  }
});
SL.unita333 = { cella: (a) => (((3 * a) % 256) + 256) % 256 };
