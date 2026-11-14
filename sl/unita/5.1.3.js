'use strict';
SL.unita513 = (() => {
  const H = (v) => '0x' + v.toString(16).toUpperCase();
  const A0 = 0x1000, B0 = 0x2400;
  // fase: 0 l'inizio · 1 A esegue · 2 il salvataggio · 3 il ripristino di B · 4 B esegue · 5 il ritorno · 6 A riprende
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], pcA = A0 + 4 * p.n, pcB = B0 + 4 * p.m, w3 = (o.w - 20) / 3;
    const pc = f === 0 ? A0 : f <= 2 ? pcA : f === 3 ? B0 : f === 4 ? pcB : pcA, chi = f <= 2 || f >= 5 ? 'A' : 'B';
    els.push(el.nota(pre + 't0', o.x, o.y, 'ISTRUZIONI DI A · quattro byte ciascuna', 'mono'));
    for (let k = 0; k < 9; k++) els.push(el.cella(pre + 'i' + k, o.x + k * (o.wc + 4), o.y + 42, o.wc, 32, 'i' + k, k < p.n && f >= 1 ? 'on' : '', { so: (k === p.n && (f === 1 || f === 2 || f >= 5)) || (k === 0 && f === 0) ? 'PC' : k % 2 === 0 ? H(A0 + 4 * k) : '', piccola: true }));
    els.push(el.box(pre + 'c', o.x, o.y + 96, w3, 54, 'processore · PC', H(pc) + ' · di ' + chi, f === 1 || f === 3 || f === 4 || f === 6 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'a', o.x + w3 + 10, o.y + 96, w3, 54, 'scheda di A · PC salvato', f >= 2 ? H(pcA) : '·', f === 2 || f === 5 ? 'att' : f > 2 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'b', o.x + 2 * (w3 + 10), o.y + 96, w3, 54, 'scheda di B · PC salvato', f >= 5 ? H(pcB) : H(B0), f === 3 ? 'att' : 'on', { cls: 'stretta' }));
    return els;
  };
  return { H, A0, B0, quadro };
})();
SL.registra('5.1.3', {
  titolo: 'Il cambio di contesto e la continuità dell’esecuzione',
  obiettivo: 'Obiettivo: spiegare come un processo interrotto riprende esattamente da dove era arrivato, e calcolare l’indirizzo che il kernel conserva per lui.',
  concetti: [['register', 'I registri sono uno solo per tutti'], ['process', 'Ogni processo ha la sua copia'], ['puntatore', 'Si riparte dal punto giusto']],
  filigrana: ['register', 'process', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'register', da: 'Dall’unità 4.1.6', t: 'Il contesto', d: 'I valori dei registri che descrivono a che punto è un programma.' },
      { sim: 'puntatore', da: 'Dall’unità 3.3.1', t: 'Il contatore di programma', d: 'Il registro, abbreviato PC, con l’indirizzo della prossima istruzione.' },
      { sim: 'coda', da: 'Dall’unità 5.1.2', t: 'Il quanto di tempo', d: 'La durata massima di un turno sul processore.' }
    ],
    domanda: { d: 'Prima di proseguire: ogni istruzione occupa 4 byte. Dopo tre istruzioni, di quanti byte è avanzato il contatore di programma?', o: [
      { t: '12', ok: true, fb: '3 × 4 = 12, che in esadecimale si scrive 0xC.' },
      { t: '3', fb: 'Tre sono le istruzioni. Ognuna occupa 4 byte.' },
      { t: '7', fb: 'I byte si ottengono moltiplicando: 3 × 4.' }
    ] }
  },
  idea: {
    titolo: 'Il segnalibro di un processo',
    termini: ['cambio di contesto'],
    testo: [
      'Chi interrompe la lettura di un libro mette un segnalibro. Un processo che lascia il processore ha lo stesso bisogno: al ritorno deve ritrovare il punto esatto in cui era arrivato, e tutti i valori su cui stava lavorando. Il processore ha però un solo contatore di programma e un solo insieme di registri, e il processo che subentra li userà per sé.',
      'Il kernel risolve il problema con il [[cambio di contesto]]. Prima di consegnare il processore a un altro processo, copia i registri di quello uscente in una scheda che gli appartiene, conservata nella memoria del kernel. Poi carica nei registri i valori che aveva salvato, tempo prima, nella scheda del processo che entra. Fra i registri salvati il più importante è il contatore di programma, il segnalibro vero e proprio.',
      { fig: 'scena', w: 720, h: 156, titolo: 'A è stato interrotto dopo tre istruzioni, e ora esegue B', nota: 'Il processore contiene un indirizzo di B. Il punto di ripresa di A, 0x100C, è al sicuro nella sua scheda.', els: SL.unita513.quadro('g', { n: 3, m: 2 }, 4, { x: 10, y: 0, w: 700, wc: 72 }) },
      'Nella macchina di questa unità ogni istruzione occupa quattro byte. Il processo A parte dall’indirizzo 0x1000, e quando il timer lo interrompe ha completato tre istruzioni. Il suo contatore è avanzato di 12 byte e vale 0x100C: il kernel salva questo numero. Durante il turno di B il contatore del processore contiene indirizzi di B, che parte da 0x2400. Quando tocca di nuovo ad A, il kernel ricarica 0x100C, e A prosegue dalla quarta istruzione.',
      'Per il processo, l’interruzione è invisibile. Non ha modo di accorgersi che fra un’istruzione e la successiva è passato il turno di qualcun altro. È la stessa garanzia vista per gli interrupt nell’unità 4.1.6, estesa da un gestore di pochi microsecondi a un altro processo intero.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processo A parte dall’indirizzo 0x1000. Sceglierai quante istruzioni completa prima che scada il quanto, e quante ne esegue B nel proprio turno.',
      'Seguiremo il contatore di programma del processore e le due copie salvate nelle schede. Cambia il numero di istruzioni di B e controlla se il punto di ripresa di A si sposta.'
    ],
    vedrai: [
      ['puntatore', 'Le istruzioni di A', 'In alto: le istruzioni, con l’indirizzo. La scritta PC segna la prossima da eseguire.'],
      ['register', 'Il processore', 'In basso a sinistra: il contatore di programma in uso, e a chi appartiene.'],
      ['process', 'Le schede', 'In basso a destra: il contatore salvato per A e per B.']
    ]
  },
  lab: {
    titolo: 'Salvare e ripristinare',
    scena: { w: 860, h: 156 },
    atti: ['Il turno di A', 'Il cambio', 'Il turno di B', 'Il ritorno'],
    controlli: [
      { id: 'n', tipo: 'scelta', eti: 'Istruzioni completate da A', opzioni: [[3, '3'], [5, '5'], [8, '8']], valore: 3 },
      { id: 'm', tipo: 'scelta', eti: 'Istruzioni eseguite da B', opzioni: [[2, '2'], [6, '6']], valore: 2 }
    ],
    nota: 'I passi sono sempre sette. Ogni istruzione occupa quattro byte. B parte dall’indirizzo 0x2400.',
    previsione: {
      domanda: (p) => 'Il processo A parte da 0x1000 e completa ' + p.n + ' istruzioni da quattro byte prima di essere interrotto. Poi B esegue ' + p.m + ' istruzioni. Da quale indirizzo riprende A quando torna il suo turno?',
      opzioni: (p) => { const H = SL.unita513.H; return [[0x1000, '0x1000, dall’inizio'], [0x1000 + p.n, H(0x1000 + p.n)], [0x1000 + 4 * p.n, H(0x1000 + 4 * p.n)]]; }
    },
    confronto: (pred, esito, p) => { const H = SL.unita513.H; return 'La previsione indicava ' + H(pred) + '. A riprende da ' + H(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 0x1000 ? 'Il kernel aveva salvato il contatore di A, che riparte dal punto raggiunto.' : 'Ogni istruzione occupa quattro byte: ' + p.n + ' × 4 = ' + 4 * p.n + ', cioè ' + H(4 * p.n) + '.'); },
    costruisci(p) {
      const U = SL.unita513, H = U.H, passi = [], pcA = U.A0 + 4 * p.n, pcB = U.B0 + 4 * p.m;
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, wc: 84 });
      const hud = (f) => [['PC', H(f === 0 ? U.A0 : f <= 2 ? pcA : f === 3 ? U.B0 : f === 4 ? pcB : pcA), 'a'], ['In esecuzione', f <= 2 || f >= 5 ? 'A' : 'B'], ['Salvato per A', f >= 2 ? H(pcA) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'A comincia', 'Il processore esegue A. Il contatore di programma vale 0x1000, l’indirizzo della sua prima istruzione, i0.', {});
      P(1, 0, 'A esegue ' + p.n + ' istruzioni', 'A completa le istruzioni da i0 a i' + (p.n - 1) + '. A ogni istruzione il contatore avanza di 4 byte: dopo ' + p.n + ' istruzioni vale 0x1000 + ' + H(4 * p.n) + ' = ' + H(pcA) + ', l’indirizzo di i' + p.n + '.', { calc: '0x1000 + ' + p.n + ' × 4 = ' + H(pcA), chiedi: { d: 'Quale istruzione di A verrebbe eseguita adesso?', o: ['i' + (p.n - 1), 'i' + p.n, 'i0'], g: 1, no: 'Il contatore contiene l’indirizzo della prossima istruzione, la numero ' + p.n + '.' } });
      P(2, 1, 'Il salvataggio', 'Il timer segnala la fine del quanto. Il kernel copia nella scheda di A i registri, e fra questi il contatore di programma: ' + H(pcA) + '.', { calc: 'scheda di A ← ' + H(pcA) });
      P(3, 1, 'Il ripristino di B', 'Il kernel carica nei registri i valori conservati nella scheda di B. Il contatore del processore diventa 0x2400. Dell’indirizzo di A, nel processore, non resta traccia.', { calc: 'PC ← 0x2400' });
      P(4, 2, 'B esegue ' + p.m + ' istruzioni', 'B esegue per il proprio turno, e il contatore avanza fino a ' + H(pcB) + '. La scheda di A non viene toccata.', { calc: '0x2400 + ' + p.m + ' × 4 = ' + H(pcB) });
      P(5, 3, 'Il ritorno', 'Scade il quanto di B. Il kernel salva ' + H(pcB) + ' nella scheda di B, e ricarica dalla scheda di A il valore ' + H(pcA) + '.', { calc: 'PC ← ' + H(pcA) });
      P(6, 3, 'A riprende', 'A prosegue dall’istruzione i' + p.n + ', come se non si fosse mai fermato. Il numero di istruzioni eseguite da B non ha avuto alcun effetto sul punto di ripresa.', { calc: 'A riprende da ' + H(pcA), esito: ['riprende da ' + H(pcA), ''] });
      return { passi, esito: pcA };
    }
  },
  bilancio: {
    regola: [
      'Al cambio di contesto il kernel salva i registri del processo uscente nella sua scheda, e carica quelli del processo entrante dalla sua.',
      'Con istruzioni di quattro byte, dopo n istruzioni il contatore salvato vale indirizzo iniziale + 4 × n.'
    ],
    errori: [
      ['Far ripartire il processo dall’inizio.', 'Il contatore salvato indica la prima istruzione non ancora eseguita.'],
      ['Sommare il numero di istruzioni all’indirizzo.', 'Gli indirizzi contano i byte: ogni istruzione ne occupa quattro.'],
      ['Cercare il punto di ripresa di A nel processore durante il turno di B.', 'In quel momento i registri contengono i valori di B. Quelli di A stanno nella sua scheda.']
    ],
    saFare: ['Descrivere le due metà di un cambio di contesto.', 'Calcolare il contatore salvato.', 'Spiegare perché il processo non si accorge dell’interruzione.'],
    esercizi: [
      { d: 'Un processo parte dall’indirizzo 0x3000. Ogni istruzione occupa 4 byte. Viene interrotto dopo avere completato 6 istruzioni. Quale valore salva il kernel come contatore di programma? Rispondi in esadecimale.', segnaposto: 'Un indirizzo', giuste: ['3018', '0x3018', '3018h'],
        ok: '6 × 4 = 24, che si scrive 0x18. 0x3000 + 0x18 = 0x3018.',
        diagnosi: [
          { se: ['3006', '0x3006'], msg: 'Hai sommato il numero di istruzioni. Ognuna occupa 4 byte: lo spostamento è 24.' },
          { se: ['3024', '0x3024'], msg: 'Lo spostamento 24 è in base dieci. In esadecimale si scrive 0x18.' },
          { se: ['3014', '0x3014'], msg: '0x3014 è l’indirizzo della sesta istruzione, già completata. La prossima sta 4 byte più avanti.' }
        ],
        altro: 'L’indirizzo è un altro. Si moltiplichino le istruzioni per 4 e si sommi il risultato, in esadecimale, a 0x3000.',
        indizi: ['6 istruzioni occupano 24 byte.', '24 = 16 + 8, cioè 0x18.', '0x3000 + 0x18 = 0x3018.'],
        svolgimento: ['Byte percorsi: 6 × 4 = 24.', '24 = 0x18.', 'Contatore salvato: 0x3018.'] },
      { d: 'Durante il turno di un altro processo, dove si trova il contatore di programma del processo sospeso?', guida: 'Si scelga la risposta.', o: [
        { t: 'Nella sua scheda, nella memoria del kernel', ok: true, fb: 'Il registro del processore è occupato dai valori del processo in esecuzione.' },
        { t: 'Nel registro del processore', fb: 'Il registro contiene l’indirizzo del processo che sta eseguendo.' },
        { t: 'In cima alla pila del processo in esecuzione', fb: 'Un processo non conserva nulla per conto di un altro. Ci pensa il kernel.' }] },
      { d: 'Il processo A viene interrotto, B esegue 200 istruzioni, poi A riprende. Il punto di ripresa di A dipende da quante istruzioni ha eseguito B?', guida: 'Si scelga la risposta.', o: [
        { t: 'No: dipende soltanto dal contatore salvato per A', ok: true, fb: 'Le istruzioni di B fanno avanzare il contatore di B.' },
        { t: 'Sì: avanza di 200 istruzioni', fb: 'Le 200 istruzioni appartengono a B, e non spostano il segnalibro di A.' },
        { t: 'Sì: A riparte dall’inizio', fb: 'Il kernel aveva salvato il punto raggiunto da A.' }] }
    ],
    sfida: ['cslez5_1_04_processes', 'Costo dei cambi e tempi di risposta']
  }
});
