'use strict';
SL.unita434 = (() => {
  const H2 = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0'), D2 = (x) => x.toFixed(2).replace('.', ',');
  const conti = (p) => { const irq = Math.ceil(p.n / p.b), fisso = 40 * irq, dati = 3 * p.n, dopo = 5 & ~p.ack; return { irq, fisso, dati, tot: fisso + dati, medio: (fisso + dati) / p.n, dopo, ready: dopo & 1, error: (dopo >> 2) & 1 }; };
  // fase: 0 la coda · 1 gli interrupt · 2 il costo fisso · 3 il costo dei dati · 4 il costo per campione · 5 la maschera · 6 STATUS dopo la scrittura
  const quadro = (pre, p, f, o) => {
    const el = SL.el, c = conti(p), els = [], passo = (o.w - (c.irq - 1) * 6) / p.n;
    for (let i = 0; i < p.n; i++) { const g = Math.floor(i / p.b); els.push(el.cella(pre + 'c' + i, o.x + i * passo + g * 6, o.y, Math.max(4, passo - 2), o.hc, '', f >= 3 ? 'on' : f >= 1 && (i + 1) % p.b === 0 || (f >= 1 && i === p.n - 1) ? 'att' : 'zero')); }
    if (o.conti) {
      const y2 = o.y + o.hc + 18, w = (o.w - 3 * o.gap) / 4, y3 = y2 + o.h + 14, w3 = (o.w - 2 * o.gap) / 3;
      const B = (id, k, eti, txt, da) => el.box(pre + id, o.x + k * (w + o.gap), y2, w, o.h, eti, f >= da ? txt : '·', f === da ? 'att' : f > da ? 'on' : '', { cls: 'stretta' });
      els.push(B('q1', 0, 'interrupt', String(c.irq), 1), B('q2', 1, 'costo degli ingressi', c.irq + ' × 40 = ' + c.fisso, 2), B('q3', 2, 'costo delle letture', p.n + ' × 3 = ' + c.dati, 3), B('q4', 3, 'cicli per campione', D2(c.medio), 4));
      els.push(el.box(pre + 's1', o.x, y3, w3, o.h, 'STATUS prima', '0x05 · ERROR 1 · READY 1', f === 5 ? 'att' : f > 5 ? 'on' : '', { cls: 'stretta' }),
        el.box(pre + 's2', o.x + w3 + o.gap, y3, w3, o.h, 'valore scritto', f >= 5 ? H2(p.ack) : '·', f === 5 ? 'att' : f > 5 ? 'on' : '', { cls: 'stretta' }),
        el.box(pre + 's3', o.x + 2 * (w3 + o.gap), y3, w3, o.h, 'STATUS dopo', f >= 6 ? H2(c.dopo) + ' · ERROR ' + c.error + ' · READY ' + c.ready : '·', f >= 6 ? (p.ack === 4 ? 'err' : 'att') : '', { cls: 'stretta' }));
    }
    return els;
  };
  return { H2, D2, conti, quadro };
})();
SL.registra('4.3.4', {
  titolo: 'Registri del dispositivo, costo e struttura del driver',
  obiettivo: 'Alla fine saprai calcolare quanto costa servire una coda di dati con un interrupt ogni tanti campioni, e scrivere il valore giusto in un registro di stato che si cancella scrivendo 1.',
  concetti: [['coda', 'Un interrupt per gruppo'], ['bilancio', 'Costo fisso e costo per dato'], ['flag', 'Scrivere 1 per cancellare']],
  filigrana: ['coda', 'flag', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'interrupt', da: 'Dall’unità 4.3.2', t: 'Il costo di un interrupt', d: 'Ogni ingresso nel gestore costa lavoro al processore, anche se porta un solo dato.' },
      { sim: 'register', da: 'Dall’unità 4.3.1', t: 'Il registro STATUS', d: 'Contiene i flag del controller, uno per bit.' },
      { sim: 'gate', da: 'Dall’unità 1.5.1', t: 'AND e NOT', d: 'Un AND con 0 spegne un bit, un AND con 1 lo lascia com’è.' }
    ],
    domanda: { d: 'Prima di proseguire: venticinque campioni vengono divisi in gruppi di quattro. Quanti gruppi si formano, contando anche quello incompleto?', o: [
      { t: '7', ok: true, fb: 'Sei gruppi pieni contengono 24 campioni, e il venticinquesimo ne forma un settimo.' },
      { t: '6', fb: 'Sei gruppi contengono 24 campioni. Ne resta uno, che va servito anche lui.' },
      { t: '25', fb: 'Venticinque sarebbero i gruppi con un campione ciascuno.' }
    ] }
  },
  idea: {
    titolo: 'Servire molti dati, e dirlo al controller',
    termini: ['raggruppamento degli interrupt', 'w1c'],
    testo: [
      'Ogni interrupt ha un costo fisso, uguale qualunque sia il lavoro che porta: l’ingresso, il salvataggio del contesto, l’uscita. Se una periferica produce molti dati, un interrupt per ogni dato spreca quasi tutto il tempo in ingressi e uscite. Molti controller hanno allora una coda interna, e avvisano il processore una volta ogni tanti dati. È il [[raggruppamento degli interrupt]].',
      'Il conto è semplice. Con venticinque campioni e un interrupt ogni quattro, gli interrupt sono sette: sei gruppi pieni e uno con il campione rimasto. Se un ingresso costa 40 cicli e la lettura di un campione ne costa 3, il totale è 7 × 40 + 25 × 3 = 355 cicli, cioè 14,2 per campione. Con un interrupt per campione sarebbero 25 × 43 = 1075 cicli. Il prezzo del raggruppamento è il ritardo, perché i primi campioni di ogni gruppo aspettano gli ultimi.',
      { fig: 'scena', w: 720, h: 62, titolo: 'Venticinque campioni, un interrupt ogni quattro', nota: 'Sette gruppi, sette interrupt. L’ultimo gruppo contiene un solo campione.', els: SL.unita434.quadro('g', { n: 25, b: 4, ack: 1 }, 1, { x: 10, y: 8, w: 700, hc: 34 }) },
      'Il secondo argomento riguarda il modo in cui il driver dichiara di avere servito un evento. Il registro STATUS contiene più flag, uno per bit. In questo controller READY è il bit di peso 1 ed ERROR quello di peso 4. Quando sono entrambi a 1, STATUS vale 0x05.',
      'Per cancellare un flag molti controller usano una regola che sorprende: si scrive 1 nel bit da cancellare. La regola si abbrevia [[w1c|W1C]], dall’inglese «write one to clear». Uno zero lascia il flag com’è. Scrivendo 0x01 si cancella READY, e STATUS diventa 0x04. Il vantaggio è la precisione: il driver cancella soltanto i flag che nomina, e un flag acceso dal controller nel frattempo resta al sicuro.',
      'L’errore tipico è trattare STATUS come una variabile qualunque: leggere 0x05, togliere il bit READY, riscrivere 0x04. Con la regola W1C quel 4 cancella ERROR e lascia READY acceso, l’opposto di ciò che si voleva.'
    ]
  },
  esperimento: {
    faremo: [
      'Un controller accumula campioni in una coda e avvisa il processore una volta ogni tanti. Un ingresso costa 40 cicli, la lettura di un campione 3. Sceglierai quanti campioni arrivano e ogni quanti parte un interrupt.',
      'Poi il driver dovrà riconoscere l’evento scrivendo nel registro STATUS, che vale 0x05 e segue la regola W1C. Sceglierai il valore da scrivere. Dopo il caso proposto, prova a scrivere 0x04.'
    ],
    vedrai: [
      ['coda', 'La coda dei campioni', 'In alto: una casella per campione, a gruppi. L’ultima di ogni gruppo fa partire l’interrupt.'],
      ['bilancio', 'Il costo', 'Al centro: gli interrupt, il costo degli ingressi, quello delle letture e la media per campione.'],
      ['flag', 'Il registro STATUS', 'In basso: il valore prima, il valore scritto e il valore dopo.']
    ]
  },
  lab: {
    titolo: 'Una coda da servire, un flag da cancellare',
    scena: { w: 860, h: 230 },
    atti: ['La coda', 'Il costo', 'Il riconoscimento'],
    controlli: [
      { id: 'ack', tipo: 'scelta', eti: 'Valore scritto in STATUS', opzioni: [[1, '0x01'], [4, '0x04'], [5, '0x05']], valore: 1 },
      { id: 'b', tipo: 'scelta', eti: 'Campioni per interrupt', opzioni: [[1, '1'], [4, '4'], [8, '8']], valore: 4 },
      { id: 'n', tipo: 'scelta', eti: 'Campioni', opzioni: [[25, '25'], [40, '40']], valore: 25 }
    ],
    nota: 'I passi sono sempre sette. In STATUS il bit di peso 1 è READY, quello di peso 4 è ERROR, e scrivere 1 in un bit lo cancella.',
    previsione: {
      domanda: (p) => 'Il registro STATUS vale 0x05: READY ed ERROR sono entrambi a 1. Il registro segue la regola W1C. Il driver vi scrive ' + SL.unita434.H2(p.ack) + '. Quanto vale STATUS subito dopo?',
      opzioni: () => [[0, '0x00'], [1, '0x01'], [4, '0x04'], [5, '0x05']]
    },
    confronto: (pred, esito, p) => { const H2 = SL.unita434.H2; return 'Avevi previsto ' + H2(pred) + '. STATUS vale ' + H2(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.ack ? 'In un registro W1C il valore scritto fa da maschera, e ogni suo 1 cancella il flag corrispondente.' : 'Ogni bit a 1 del valore scritto cancella il proprio flag, e ogni bit a 0 lo lascia com’è.'); },
    costruisci(p) {
      const U = SL.unita434, H2 = U.H2, D2 = U.D2, passi = [], c = U.conti(p), resto = p.n % p.b;
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'CODA DEI CAMPIONI', 'mono')].concat(U.quadro('q', p, f, { x: 20, y: 24, w: 820, hc: 30, conti: true, h: 58, gap: 12 }));
      const hud = (f) => [['Interrupt', f >= 1 ? String(c.irq) : '·', 'a'], ['Cicli in tutto', f >= 4 ? String(c.tot) : f === 3 ? String(c.tot) : f === 2 ? String(c.fisso) : '·'], ['STATUS', f >= 6 ? H2(c.dopo) : '0x05', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La coda', 'Il controller riceve ' + p.n + ' campioni e li accumula nella propria coda. Avvisa il processore ' + (p.b === 1 ? 'a ogni campione.' : 'una volta ogni ' + p.b + ' campioni, e una volta in più per quelli rimasti alla fine.'),
        { chiedi: { d: 'Quanti interrupt partono per ' + p.n + ' campioni, con un interrupt ogni ' + p.b + '?', o: Array.from(new Set([Math.floor(p.n / p.b), c.irq, p.n])).map(String), g: Array.from(new Set([Math.floor(p.n / p.b), c.irq, p.n])).indexOf(c.irq), no: resto ? Math.floor(p.n / p.b) + ' gruppi pieni, più uno per ' + (resto === 1 ? 'il campione rimasto' : 'i ' + resto + ' campioni rimasti') + ': ' + c.irq + '.' : p.n + ' diviso ' + p.b + ' fa ' + c.irq + ', senza resto.' } });
      P(1, 0, 'Gli interrupt', resto ? 'I gruppi pieni sono ' + Math.floor(p.n / p.b) + ', e resta ' + (resto === 1 ? 'un campione' : resto + ' campioni') + ' che ' + (resto === 1 ? 'forma' : 'formano') + ' un ultimo gruppo. Gli interrupt sono ' + c.irq + '.' : 'I campioni si dividono in ' + c.irq + ' gruppi pieni, senza resto. Gli interrupt sono ' + c.irq + '.', { calc: 'interrupt: ' + c.irq });
      P(2, 1, 'Il costo degli ingressi', 'Ogni ingresso nel gestore costa 40 cicli, qualunque sia il numero di campioni che porta. Per ' + c.irq + ' interrupt: ' + c.irq + ' × 40 = ' + c.fisso + ' cicli.', { calc: c.irq + ' × 40 = ' + c.fisso });
      P(3, 1, 'Il costo delle letture', 'Il driver legge i campioni uno per uno, al costo di 3 cicli ciascuno: ' + p.n + ' × 3 = ' + c.dati + ' cicli. Questa parte resta uguale con qualunque raggruppamento.', { calc: p.n + ' × 3 = ' + c.dati });
      P(4, 1, 'Il costo per campione', 'In tutto ' + c.fisso + ' + ' + c.dati + ' = ' + c.tot + ' cicli, cioè ' + D2(c.medio) + ' per campione. ' + (p.b === 1 ? 'Con un interrupt per campione quasi tutto il lavoro va negli ingressi.' : 'Con un interrupt per campione sarebbero stati 43 per campione. Il costo fisso si è distribuito su più dati.'), { calc: c.tot + ' / ' + p.n + ' = ' + D2(c.medio) });
      P(5, 2, 'Il valore scritto', 'Resta da riconoscere l’evento. STATUS vale 0x05: sono a 1 il bit di peso 1, READY, e il bit di peso 4, ERROR. Il driver scrive ' + H2(p.ack) + ', che ha a 1 ' + (p.ack === 1 ? 'il solo bit di READY.' : p.ack === 4 ? 'il solo bit di ERROR.' : 'entrambi i bit.'), { calc: 'STATUS = 0x05 · scritto ' + H2(p.ack) });
      P(6, 2, 'STATUS dopo la scrittura', (p.ack === 1 ? 'L’1 nel bit di READY cancella READY. Lo 0 nel bit di ERROR lo lascia acceso. STATUS vale 0x04: il driver ha riconosciuto i dati, e l’errore è ancora segnalato, pronto per essere trattato.' : p.ack === 4 ? 'L’1 nel bit di ERROR cancella ERROR. Lo 0 nel bit di READY lo lascia acceso. STATUS vale 0x01. Se il driver voleva «togliere READY» scrivendo ciò che restava, ha ottenuto il contrario: l’errore è sparito senza essere stato trattato.' : 'I due bit a 1 cancellano entrambi i flag, e STATUS vale 0x00. È la scelta giusta soltanto se il driver ha già trattato anche l’errore.'), { calc: '0x05, scritto ' + H2(p.ack) + ' → ' + H2(c.dopo), esito: ['STATUS = ' + H2(c.dopo), p.ack === 4 ? 'no' : 'si'] });
      return { passi, esito: c.dopo };
    }
  },
  bilancio: {
    regola: [
      'Con il raggruppamento il costo fisso di un ingresso si divide fra i campioni del gruppo. Gli interrupt sono il numero di campioni diviso per la dimensione del gruppo, arrotondato per eccesso.',
      'In un registro W1C ogni 1 scritto cancella il flag corrispondente, e ogni 0 lo lascia com’è. Per cancellare un flag si scrive il suo peso.'
    ],
    errori: [
      ['Dimenticare il gruppo incompleto.', 'Anche i campioni rimasti alla fine vanno serviti, con un interrupt in più.'],
      ['Riscrivere in STATUS ciò che si vuole lasciare.', 'In un registro W1C si scrive ciò che si vuole cancellare. I bit a 0 restano intatti.'],
      ['Cancellare tutti i flag in blocco.', 'Un flag di errore cancellato senza essere stato trattato è un errore perduto.']
    ],
    saFare: ['Conto gli interrupt di una coda raggruppata.', 'Calcolo il costo totale e quello per campione.', 'Scelgo il valore da scrivere in un registro W1C.'],
    esercizi: [
      { d: 'Un controller riceve 30 campioni e manda un interrupt ogni 8. Un ingresso costa 40 cicli, la lettura di un campione 3. Quanti cicli servono in tutto?', segnaposto: 'Un numero', giuste: ['250', 'duecentocinquanta'],
        ok: 'Gli interrupt sono 4: 4 × 40 + 30 × 3 = 160 + 90 = 250.',
        diagnosi: [
          { se: ['210'], msg: 'Trenta diviso otto fa 3 con resto 6. I sei campioni rimasti chiedono un quarto interrupt.' },
          { se: ['160'], msg: 'Mancano le letture dei campioni, 3 cicli ciascuna.' },
          { se: ['1290'], msg: 'Questo sarebbe il costo con un interrupt per campione.' }
        ],
        altro: 'Il numero è diverso. Conta gli interrupt arrotondando per eccesso, poi somma ingressi e letture.',
        indizi: ['30 / 8 = 3 con resto 6: gli interrupt sono 4.', 'Ingressi: 4 × 40.', 'Letture: 30 × 3.'],
        svolgimento: ['Interrupt: 4.', 'Ingressi: 4 × 40 = 160.', 'Letture: 30 × 3 = 90.', 'Totale: 250 cicli.'] },
      { d: 'Un registro W1C vale 0x05, con READY nel bit di peso 1 ed ERROR nel bit di peso 4. Quale valore va scritto per cancellare soltanto ERROR? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x02', giuste: ['4', '04', '0x4', '0x04', '4h', '04h'],
        ok: 'Si scrive il peso del flag da cancellare: 0x04.',
        diagnosi: [
          { se: ['1', '01', '0x1', '0x01'], msg: 'Questo valore cancellerebbe READY. In un registro W1C si scrive il bit da cancellare.' },
          { se: ['5', '05', '0x5', '0x05'], msg: 'Così si cancellerebbero entrambi i flag.' },
          { se: ['0', '00', '0x0', '0x00'], msg: 'Uno zero non cancella nulla.' }
        ],
        altro: 'Il valore è diverso. Scrivi 1 soltanto nel bit del flag da cancellare.',
        indizi: ['Ogni 1 scritto cancella il proprio flag.', 'ERROR è il bit di peso 4.', 'Il valore è 0x04.'],
        svolgimento: ['Flag da cancellare: ERROR.', 'Peso di ERROR: 4.', 'Valore da scrivere: 0x04.'] },
      { d: 'Con un interrupt ogni 16 campioni al posto di uno ogni 4, che cosa cambia?', guida: 'Scegli la risposta.', o: [
        { t: 'Il costo per campione scende, e l’attesa dei primi campioni di ogni gruppo cresce', ok: true, fb: 'Il costo fisso si divide fra più campioni. In cambio i primi restano in coda più a lungo.' },
        { t: 'Il costo per campione scende, senza alcuno svantaggio', fb: 'Lo svantaggio è il ritardo: un campione deve attendere che il gruppo si riempia.' },
        { t: 'Il costo delle letture diminuisce', fb: 'Le letture costano 3 cicli per campione in ogni caso. Diminuisce il costo degli ingressi.' }] }
    ]
  }
});
