'use strict';
SL.unita552 = (() => {
  // sequenze: ogni voce è [chi, operazione]
  const SEQ = {
    nessuna: [['A', 'legge'], ['B', 'legge'], ['A', 'scrive'], ['B', 'scrive']],
    scrittura: [['A', 'legge'], ['B', 'legge'], ['A', 'lock'], ['A', 'scrive'], ['A', 'unlock'], ['B', 'lock'], ['B', 'scrive'], ['B', 'unlock']],
    tutto: [['A', 'lock'], ['A', 'legge'], ['B', 'attende'], ['A', 'scrive'], ['A', 'unlock'], ['B', 'lock'], ['B', 'legge'], ['B', 'scrive'], ['B', 'unlock']]
  };
  const esegui = (p) => { let c = p.x, r = { A: null, B: null }, m = '', att = ''; const S = [{ c, ra: null, rb: null, m, att, op: null }]; SEQ[p.zona].forEach((e) => { const chi = e[0], op = e[1]; if (op === 'legge') r[chi] = c; else if (op === 'scrive') c = r[chi] + 1; else if (op === 'lock') { m = chi; att = ''; } else if (op === 'unlock') m = ''; else att = chi; S.push({ c, ra: r.A, rb: r.B, m, att, op: e }); }); return S; };
  const finale = (p) => { const S = esegui(p); return S[S.length - 1].c; };
  const scena = (pre, s, zona, o) => {
    const el = SL.el, w3 = (o.w - 2 * o.gap) / 3, chi = s.op ? s.op[0] : '', op = s.op ? s.op[1] : '';
    return [el.box(pre + 'a', o.x, o.y, w3, o.h, 'registro di A', s.ra == null ? '·' : String(s.ra), chi === 'A' && op === 'legge' ? 'att' : s.ra == null ? '' : 'on', { cls: 'stretta' }),
      el.box(pre + 'c', o.x + w3 + o.gap, o.y, w3, o.h, 'contatore · condiviso', String(s.c), op === 'scrive' ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'b', o.x + 2 * (w3 + o.gap), o.y, w3, o.h, 'registro di B', s.rb == null ? '·' : String(s.rb), chi === 'B' && op === 'legge' ? 'att' : s.rb == null ? '' : 'on', { cls: 'stretta' }),
      el.box(pre + 'o', o.x, o.y + o.h + 12, w3, o.h, 'operazione', s.op ? chi + ' · ' + op : '·', s.op ? (op === 'attende' ? 'err' : 'att') : '', { cls: 'stretta' }),
      el.box(pre + 'm', o.x + w3 + o.gap, o.y + o.h + 12, w3, o.h, 'mutex', zona === 'nessuna' ? 'non usato' : s.m ? 'di ' + s.m : 'libero', zona === 'nessuna' ? 'off' : s.m ? 'zero' : 'on', { cls: 'stretta' }),
      el.box(pre + 'w', o.x + 2 * (w3 + o.gap), o.y + o.h + 12, w3, o.h, 'in attesa del mutex', s.att || 'nessuno', s.att ? 'err' : '', { cls: 'stretta' })];
  };
  return { SEQ, esegui, finale, scena };
})();
SL.registra('5.5.2', {
  titolo: 'Scegliere i confini della sezione critica',
  obiettivo: 'Obiettivo: stabilire quali istruzioni devono stare sotto la protezione di un mutex, e spiegare perché proteggere la sola scrittura non basta.',
  concetti: [['lucchetto', 'Uno per volta nella zona protetta'], ['register', 'La lettura fa parte della decisione'], ['conflitto', 'Un confine sbagliato non protegge']],
  filigrana: ['lucchetto', 'conflitto', 'register'],
  richiami: {
    carte: [
      { sim: 'conflitto', da: 'Dall’unità 5.5.1', t: 'L’aggiornamento perso', d: 'Due thread leggono lo stesso valore, e la seconda scrittura copre la prima.' },
      { sim: 'lucchetto', da: 'Dall’unità 5.2.5', t: 'Il mutex', d: 'Chi lo acquisisce ha accesso esclusivo. Gli altri aspettano il rilascio.' },
      { sim: 'thread', da: 'Dall’unità 5.4.1', t: 'La sincronizzazione', d: 'Un accordo sull’ordine degli accessi ai dati comuni.' }
    ],
    domanda: { d: 'Prima di proseguire: nell’aggiornamento perso, in quale momento nasce l’errore?', o: [
      { t: 'Quando il secondo thread legge prima che il primo abbia scritto', ok: true, fb: 'Da quel momento lavora su un valore destinato a essere superato.' },
      { t: 'Quando il secondo thread scrive', fb: 'La scrittura è la conseguenza. L’errore è già nel valore letto.' },
      { t: 'Quando il primo thread scrive', fb: 'Il primo thread ha fatto tutto correttamente.' }
    ] }
  },
  idea: {
    titolo: 'Dove comincia e dove finisce la protezione',
    termini: ['sezione critica', 'mutua esclusione'],
    testo: [
      'Il rimedio alla corsa critica è impedire che i passi di due thread si mescolino. Si individua il tratto di programma che lavora sui dati comuni, la [[sezione critica]], e si fa in modo che vi entri un thread per volta. Questa garanzia si chiama [[mutua esclusione]], e lo strumento più semplice per ottenerla è il mutex: lo si acquisisce all’ingresso, con una operazione che qui chiamiamo lock, e lo si rilascia all’uscita, con unlock. Chi trova il mutex occupato aspetta.',
      'La difficoltà è scegliere i confini. Verrebbe naturale proteggere la scrittura, che è l’operazione che modifica il dato. Proviamo. A e B devono incrementare un contatore che vale 10. Entrambi leggono 10, fuori dalla protezione. Poi A prende il mutex, scrive 11, lo rilascia. B prende il mutex, scrive 11, lo rilascia. Le scritture sono avvenute in buon ordine, una per volta, e il contatore vale 11. L’aggiornamento perso c’è ancora.',
      { fig: 'scena', w: 720, h: 138, titolo: 'Il mutex protegge soltanto la scrittura', nota: 'B sta per scrivere 11, ordinatamente, sotto mutex. Il valore su cui ha calcolato, 10, lo aveva però letto prima.', els: SL.unita552.scena('g', SL.unita552.esegui({ x: 10, zona: 'scrittura' })[6], 'scrittura', { x: 10, y: 0, w: 700, gap: 12, h: 54 }) },
      'Il mutex ha messo in fila le scritture, e il danno era già stato fatto dalle letture. Ciò che va protetto è l’intera decisione: dal momento in cui si legge il dato al momento in cui si scrive il risultato che da quella lettura dipende. Se A prende il mutex prima di leggere, B deve aspettare fuori. Quando entra, legge 11, il valore lasciato da A, e scrive 12.',
      'La regola generale è questa. Una sezione critica deve racchiudere tutte le operazioni che, per essere corrette, hanno bisogno che il dato non cambi nel frattempo. Per un incremento sono la lettura, il calcolo e la scrittura. Farla più larga del necessario è corretto ma costoso, perché gli altri thread aspettano più a lungo. Farla più stretta è un errore.'
    ]
  },
  esperimento: {
    faremo: [
      'A e B incrementano una volta ciascuno un contatore comune. Sceglierai il valore iniziale, e quale parte dell’incremento è protetta dal mutex: nessuna, la sola scrittura, oppure lettura e scrittura insieme.',
      'Seguiremo l’intercalazione più sfavorevole che la protezione scelta consente. Cerca il primo passo in cui le tre sequenze si distinguono.'
    ],
    vedrai: [
      ['register', 'Registri e contatore', 'In alto: i registri di A e di B, e il contatore comune.'],
      ['lucchetto', 'Il mutex', 'In basso: l’operazione in corso, chi possiede il mutex, e chi lo sta aspettando.']
    ]
  },
  lab: {
    titolo: 'Tre modi di mettere il confine',
    scena: { w: 860, h: 140 },
    atti: ['L’inizio', 'Le operazioni', 'L’esito'],
    controlli: [
      { id: 'zona', tipo: 'scelta', eti: 'Il mutex protegge', opzioni: [['nessuna', 'nulla'], ['scrittura', 'la sola scrittura'], ['tutto', 'lettura e scrittura']], valore: 'scrittura' },
      { id: 'x', tipo: 'scelta', eti: 'Valore iniziale', opzioni: [[10, '10'], [25, '25']], valore: 10 }
    ],
    nota: 'Il numero dei passi dipende dalla protezione. Ogni sequenza è la più sfavorevole fra quelle possibili.',
    previsione: {
      domanda: (p) => 'Il contatore vale ' + p.x + ', e due thread lo incrementano una volta ciascuno. ' + (p.zona === 'nessuna' ? 'Nessun mutex protegge l’incremento.' : p.zona === 'scrittura' ? 'Ogni thread legge il contatore, poi acquisisce il mutex, scrive, e lo rilascia.' : 'Ogni thread acquisisce il mutex, legge, scrive, e lo rilascia.') + ' Nel caso peggiore, quanto vale il contatore alla fine?',
      opzioni: (p) => [[p.x, String(p.x)], [p.x + 1, String(p.x + 1)], [p.x + 2, String(p.x + 2)]]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Nel caso peggiore il contatore vale ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.zona === 'tutto' ? 'Con la lettura sotto mutex, il secondo thread legge soltanto dopo la scrittura del primo.' : p.zona === 'scrittura' ? 'Le scritture sono in fila, ma entrambe partono dal valore letto prima, fuori dal mutex.' : 'Senza protezione, i due thread possono leggere lo stesso valore.'),
    costruisci(p) {
      const U = SL.unita552, S = U.esegui(p), passi = [], fin = S[S.length - 1].c, perso = fin === p.x + 1;
      const P = (k, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Contatore', String(S[k].c), 'a'], ['Mutex', p.zona === 'nessuna' ? 'non usato' : S[k].m ? 'di ' + S[k].m : 'libero'], ['Letti', (S[k].ra == null ? '·' : S[k].ra) + ' e ' + (S[k].rb == null ? '·' : S[k].rb), 'c']], els: U.scena('q', S[k], p.zona, { x: 20, y: 0, w: 820, gap: 14, h: 56 }) }, extra));
      const D = (s, prec) => { const chi = s.op[0], op = s.op[1], altro = chi === 'A' ? 'B' : 'A', reg = chi === 'A' ? s.ra : s.rb; return op === 'legge' ? chi + ' copia il contatore nel proprio registro: ' + reg + '.' + (prec.m === chi ? ' Il mutex è suo, e nessun altro può modificare il contatore finché non lo rilascia.' : p.zona === 'scrittura' ? ' La lettura avviene fuori dal mutex.' : '') : op === 'scrive' ? chi + ' scrive nel contatore il valore letto più 1: ' + s.c + '.' : op === 'lock' ? chi + ' acquisisce il mutex, che era libero.' : op === 'unlock' ? chi + ' rilascia il mutex.' : chi + ' chiede il mutex, lo trova occupato da ' + altro + ', e si mette in attesa. Non ha ancora letto nulla.'; };

      P(0, 0, 'Due incrementi da fare', 'Il contatore vale ' + p.x + '. A e B devono incrementarlo una volta ciascuno: il risultato corretto è ' + (p.x + 2) + '. ' + (p.zona === 'nessuna' ? 'Il programma non usa alcun mutex.' : p.zona === 'scrittura' ? 'Il programma acquisisce il mutex soltanto intorno alla scrittura.' : 'Il programma acquisisce il mutex prima della lettura, e lo rilascia dopo la scrittura.'), {});
      for (let k = 1; k < S.length; k++) { const s = S[k], extra = { calc: s.op[0] + ': ' + s.op[1] };
        if (s.op[0] === 'B' && s.op[1] === 'legge') extra.chiedi = { d: 'Quale valore trova B nel contatore?', o: [String(p.x), String(p.x + 1)], g: s.rb === p.x ? 0 : 1, no: s.rb === p.x ? 'A non ha ancora scritto.' : 'A ha già scritto ' + (p.x + 1) + ' e rilasciato il mutex.' };
        P(k, 1, s.op[0] + ' · ' + s.op[1], D(s, S[k - 1]), extra); }
      P(S.length - 1, 2, perso ? 'Un incremento perso' : 'Il risultato corretto', perso ? 'Il contatore vale ' + fin + ' al posto di ' + (p.x + 2) + '. ' + (p.zona === 'scrittura' ? 'Il mutex ha ordinato le scritture, ed è rimasto impotente davanti alle letture, avvenute prima. La sezione critica era troppo stretta.' : 'Senza mutua esclusione, i due incrementi si sono intercalati.') : 'Il contatore vale ' + fin + '. La sezione critica comprendeva la lettura: B ha potuto leggere soltanto dopo l’uscita di A, e ha lavorato sul valore aggiornato. Con questa protezione nessuna intercalazione può far perdere un incremento.', { esito: [String(fin), perso ? 'no' : 'si'] });
      return { passi, esito: fin };
    }
  },
  bilancio: {
    regola: [
      'La sezione critica deve comprendere tutte le operazioni che dipendono dallo stesso valore letto: lettura, calcolo e scrittura.',
      'Il mutex garantisce la mutua esclusione soltanto per le operazioni che stanno fra la sua acquisizione e il suo rilascio.'
    ],
    errori: [
      ['Proteggere soltanto la scrittura.', 'Le letture restano libere di intercalarsi, e l’aggiornamento perso rimane possibile.'],
      ['Rilasciare il mutex fra la lettura e la scrittura.', 'Un altro thread può entrare nel mezzo, e il valore letto non è più valido.'],
      ['Allargare la sezione critica senza motivo.', 'È corretto, ma fa aspettare inutilmente gli altri thread.']
    ],
    saFare: ['Individuare le operazioni che formano una sezione critica.', 'Prevedere l’esito di un incremento con confini diversi.', 'Spiegare perché la lettura va protetta.'],
    esercizi: [
      { d: 'Un contatore vale 50. Quattro thread lo incrementano una volta ciascuno, e ogni thread esegue lock, lettura, scrittura, unlock. Quanto vale il contatore alla fine?', segnaposto: 'Un numero', giuste: ['54', 'cinquantaquattro'],
        ok: 'Con l’intero incremento protetto, ogni thread parte dal valore lasciato dal precedente: 50 + 4.',
        diagnosi: [
          { se: ['51', 'cinquantuno'], msg: 'Questo accadrebbe se tutti leggessero 50. Qui la lettura è sotto mutex.' },
          { se: ['50', 'cinquanta'], msg: 'Ogni thread aggiunge 1 al contatore.' }
        ],
        altro: 'Il valore è diverso. La protezione è corretta, quindi nessun incremento va perso.',
        indizi: ['Ogni incremento è una sezione critica completa.', 'Nessun aggiornamento viene perso.', '50 + 4 = 54.'],
        svolgimento: ['Incrementi: 4.', 'Persi: 0.', 'Valore finale: 54.'] },
      { d: 'Stessi quattro thread, stesso contatore a 50, ma ogni thread esegue lettura, lock, scrittura, unlock. Nel caso peggiore, quanto vale il contatore alla fine?', segnaposto: 'Un numero', giuste: ['51', 'cinquantuno'],
        ok: 'Nel caso peggiore tutti leggono 50 prima di qualunque scrittura, e tutti scrivono 51.',
        diagnosi: [
          { se: ['54', 'cinquantaquattro'], msg: 'Questo è il caso migliore. La lettura fuori dal mutex permette a tutti di leggere 50.' },
          { se: ['50', 'cinquanta'], msg: 'Almeno una scrittura di 51 avviene.' }
        ],
        altro: 'Il valore è diverso. Si consideri l’intercalazione in cui le quattro letture precedono ogni scrittura.',
        indizi: ['Le letture non sono protette.', 'Possono avvenire tutte prima delle scritture: tutti leggono 50.', 'Tutti scrivono 51.'],
        svolgimento: ['Letture: 50, 50, 50, 50.', 'Scritture, in fila: 51, 51, 51, 51.', 'Valore finale: 51.'] },
      { d: 'Un thread deve controllare se un saldo è sufficiente e, in caso positivo, sottrarre una somma. Quali operazioni vanno nella sezione critica?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il controllo e la sottrazione, insieme', ok: true, fb: 'La sottrazione è corretta soltanto se il saldo non cambia dopo il controllo.' },
        { t: 'Soltanto la sottrazione', fb: 'Un altro thread potrebbe ridurre il saldo fra il controllo e la sottrazione.' },
        { t: 'Soltanto il controllo', fb: 'La modifica resterebbe senza protezione.' }] }
    ],
    sfida: ['cslez5_5_02_semaphores', 'Proprietà di una sezione critica']
  }
});
