'use strict';
SL.unita362 = (() => {
  const H = SL.y86.esa;
  const GRUPPI = [{ p: 0x40, m: 0x62, w: 0x96 }, { p: 0x120, m: 0x9B, w: 0x2F4 }];
  const NOMI = { m: 'M_valA', w: 'W_valM', p: 'F_predPC' };
  const scelta = (j, r) => (j ? 'm' : r ? 'w' : 'p');
  // fase: 0 candidati · 1 prima verifica · 2 seconda verifica · 3 scelta · 4 prelievo
  const quadro = (pre, j, r, g, f, o) => {
    const el = SL.el, s = scelta(j, r), els = [], xk = o.x + o.wc + o.gap, xf = xk + o.wk + o.gap, yf = o.y + o.py;
    const righe = [['m', 'salvato dal salto', '1 · salto previsto male in M', j ? 'sì' : 'no'], ['w', 'letto dalla pila', '2 · ret nello stadio W', r ? 'sì' : 'no'], ['p', 'PC previsto', '3 · in tutti gli altri casi', 'passa']];
    righe.forEach((R, k) => {
      const yy = o.y + k * o.py, visto = f >= k + 1, deciso = (k === 1 && j) || (k === 2 && (j || r)), preso = f >= 3 && R[0] === s;
      els.push(el.box(pre + 'c' + k, o.x, yy, o.wc, o.h, R[1], NOMI[R[0]] + ' = ' + H(g[R[0]]), f >= 3 ? (preso ? 'att' : 'off') : 'on', { cls: 'stretta' }));
      els.push(el.box(pre + 'k' + k, xk, yy, o.wk, o.h, R[2], !visto ? '·' : deciso ? 'già deciso' : R[3], !visto ? '' : deciso ? 'off' : preso || f === k + 1 ? 'att' : 'on', { cls: 'stretta' }));
      els.push(el.linea(pre + 'l' + k, o.x + o.wc, yy + o.h / 2, xk, yy + o.h / 2, preso ? 'att' : ''));
      els.push(el.linea(pre + 'm' + k, xk + o.wk, yy + o.h / 2, xf, yf + o.h / 2, preso ? 'att' : ''));
    });
    els.push(el.box(pre + 'f', xf, yf, o.wf, o.h, 'indirizzo del prelievo', f >= 3 ? 'f_pc = ' + H(g[s]) : 'f_pc = ·', f === 3 ? 'att' : f > 3 ? 'on' : '', { cls: 'stretta' }));
    if (o.memoria) els.push(el.box(pre + 'z', xf, yf + o.py, o.wf, o.h, 'memoria delle istruzioni', f >= 4 ? 'legge da ' + H(g[s]) : '·', f >= 4 ? 'att' : '', { cls: 'stretta' }));
    return els;
  };
  return { H, GRUPPI, NOMI, scelta, quadro };
})();
SL.registra('3.6.2', {
  titolo: 'Stato della pipeline e controllo del prelievo',
  obiettivo: 'Obiettivo: dire da quale indirizzo PIPE preleva la prossima istruzione, scegliendo fra il PC previsto, la correzione di un salto e l’indirizzo di ritorno di una `ret`.',
  concetti: [['puntatore', 'Tre candidati per il prelievo'], ['mux', 'Un selettore con priorità'], ['pipeline', 'Chi decide, e in quale stadio']],
  filigrana: ['puntatore', 'mux', 'pipeline'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 3.3.3', t: 'Il nuovo PC in SEQ', d: 'Viene scelto alla fine dell’istruzione, quando valP, valC e valM sono tutti noti.' },
      { sim: 'conflitto', da: 'Dall’unità 3.5.3', t: 'La previsione dei salti', d: 'PIPE preleva dalla destinazione di un salto condizionato senza attendere la condizione.' },
      { sim: 'pila', da: 'Dall’unità 3.3.5', t: 'La ret', d: 'Legge l’indirizzo di ritorno dalla cima della pila, nella fase di memoria.' }
    ],
    domanda: { d: 'Prima di proseguire: in quale stadio una `ret` viene a conoscere l’indirizzo a cui tornare?', o: [
      { t: 'Nello stadio M, quando legge la pila', ok: true, fb: 'L’indirizzo di ritorno è un dato in memoria, e la memoria dei dati si legge nello stadio M.' },
      { t: 'Nello stadio F, dai byte dell’istruzione', fb: 'La `ret` occupa un solo byte, che contiene soltanto il suo codice.' },
      { t: 'Nello stadio E, dall’ALU', fb: 'Nello stadio E l’ALU calcola la nuova cima della pila. La lettura avviene nello stadio seguente.' }
    ] }
  },
  idea: {
    titolo: 'Da dove si preleva',
    termini: ['pc previsto', 'f_pc'],
    testo: [
      'In SEQ il nuovo PC veniva scelto alla fine dell’istruzione, quando tutto era noto. PIPE preleva una istruzione a ogni ciclo, e deve scegliere l’indirizzo molto prima: subito dopo il prelievo, quando dell’istruzione conosce soltanto i byte.',
      'Per quasi tutte le istruzioni i byte bastano. L’istruzione successiva comincia a valP, l’indirizzo che segue. Per `jmp` e `call` la destinazione è la costante valC, scritta nell’istruzione. Per un salto condizionato PIPE scommette sulla destinazione, e usa ancora valC. L’indirizzo scelto in questo modo è il [[pc previsto|PC previsto]], e viene conservato nel registro F con la sigla `F_predPC`.',
      'La scommessa fallisce in due casi. Il primo è un salto condizionato che doveva proseguire in sequenza. Lo si scopre nello stadio E, e nel ciclo seguente il salto, arrivato in M, porta con sé l’indirizzo giusto nel campo `M_valA`. Il secondo è la `ret`, i cui byte non dicono nulla sulla destinazione. La `ret` legge l’indirizzo di ritorno dalla pila nello stadio M, e nel ciclo seguente lo offre dal registro W nel campo `W_valM`.',
      { fig: 'scena', w: 720, h: 212, titolo: 'Il selettore del prelievo con una ret nello stadio W', nota: 'La prima verifica dà esito negativo, la seconda positiva: passa l’indirizzo letto dalla pila.', els: SL.unita362.quadro('g', 0, 1, SL.unita362.GRUPPI[0], 3, { x: 10, y: 8, wc: 200, wk: 236, wf: 200, gap: 24, h: 56, py: 66 }) },
      'Un selettore sceglie fra i tre candidati l’indirizzo effettivo del prelievo, chiamato [[f_pc]]. Le verifiche hanno un ordine. Se nello stadio M c’è un salto previsto male, passa `M_valA`. Altrimenti, se nello stadio W c’è una `ret`, passa `W_valM`. In tutti gli altri casi passa il PC previsto.',
      'Mentre una `ret` avanza verso lo stadio W, PIPE è priva di un indirizzo valido da cui prelevare. Per tre cicli il prelievo resta fermo e nella pipeline entrano tre bolle. L’unità 3.6.5 ne mostra il meccanismo.'
    ]
  },
  esperimento: {
    faremo: [
      'Guarderemo dentro lo stadio F nel momento della scelta. I tre candidati hanno indirizzi diversi, e sarà evidente quale passa.',
      'Sceglierai se nello stadio M c’è un salto da correggere e se nello stadio W c’è una ret. Il selettore esaminerà le due condizioni nel suo ordine. Dopo il caso proposto, attiva entrambe le condizioni: è una combinazione forzata, utile per vedere quale prevale.'
    ],
    vedrai: [
      ['puntatore', 'I tre candidati', 'A sinistra: l’indirizzo salvato dal salto, quello letto dalla pila e il PC previsto.'],
      ['mux', 'Le verifiche', 'Al centro: le condizioni del selettore, nell’ordine in cui contano.'],
      ['memory', 'Il prelievo', 'A destra: f_pc, l’indirizzo consegnato alla memoria delle istruzioni.']
    ]
  },
  lab: {
    titolo: 'Il selettore del prelievo',
    scena: { w: 860, h: 272 },
    atti: ['I candidati', 'Le verifiche', 'La scelta', 'Il prelievo'],
    controlli: [
      { id: 'j', tipo: 'scelta', eti: 'Salto previsto male in M', opzioni: [[0, 'no'], [1, 'sì']], valore: 0 },
      { id: 'r', tipo: 'scelta', eti: 'ret nello stadio W', opzioni: [[0, 'no'], [1, 'sì']], valore: 1 },
      { id: 'a', tipo: 'scelta', eti: 'Indirizzi', opzioni: [[0, 'primo gruppo'], [1, 'secondo gruppo']], valore: 0 }
    ],
    nota: 'I passi sono sempre cinque. Salto e ret attivi insieme sono una combinazione forzata: in una esecuzione vera, dietro una ret la pipeline contiene soltanto bolle.',
    previsione: {
      domanda: (p) => 'Nello stadio M ' + (p.j ? 'c’è un salto condizionato previsto male' : 'manca un salto da correggere') + ', e nello stadio W ' + (p.r ? 'c’è una ret' : 'manca una ret') + '. Da quale indirizzo preleva lo stadio F?',
      opzioni: (p) => { const g = SL.unita362.GRUPPI[p.a], H = SL.unita362.H; return [[g.m, H(g.m) + ', salvato dal salto'], [g.w, H(g.w) + ', letto dalla pila'], [g.p, H(g.p) + ', il PC previsto']]; }
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + SL.unita362.H(pred) + '. Il prelievo usa ' + SL.unita362.H(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.j ? 'Un salto previsto male nello stadio M ha la precedenza sugli altri candidati.' : p.r ? 'Una ret nello stadio W offre l’indirizzo letto dalla pila, che prevale sul PC previsto.' : 'Senza richieste di correzione passa il PC previsto.'),
    costruisci(p) {
      const el = SL.el, U = SL.unita362, H = U.H, passi = [], g = U.GRUPPI[p.a], s = U.scelta(p.j, p.r), v = g[s];
      const quadro = (f) => [el.nota('t0', 20, 0, 'CANDIDATI', 'mono'), el.nota('t1', 300, 0, 'VERIFICHE, IN ORDINE', 'mono'), el.nota('t2', 590, 0, 'PRELIEVO', 'mono')].concat(U.quadro('q', p.j, p.r, g, f, { x: 20, y: 24, wc: 250, wk: 260, wf: 250, gap: 30, h: 64, py: 80, memoria: true }));
      const hud = (f) => [['Salto da correggere', p.j ? 'sì' : 'no', 'a'], ['ret in W', p.r ? 'sì' : 'no'], ['f_pc', f >= 3 ? H(v) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'I tre candidati', 'Nello stesso ciclo lo stadio F ha davanti tre indirizzi. `F_predPC` vale ' + H(g.p) + ', ed è il PC previsto dopo l’ultimo prelievo. `M_valA` vale ' + H(g.m) + ', e conta soltanto se nello stadio M c’è un salto previsto male. `W_valM` vale ' + H(g.w) + ', e conta soltanto se nello stadio W c’è una `ret`.',
        { chiedi: { d: 'Quale dei tre candidati è quello valido nella grande maggioranza dei cicli?', o: ['F_predPC', 'M_valA', 'W_valM'], g: 0, no: 'Gli altri due servono soltanto dopo un salto previsto male oppure dopo una ret.' } });
      P(1, 1, 'Prima verifica: il salto', p.j ? 'Nello stadio M c’è un salto condizionato la cui condizione è risultata falsa. PIPE aveva prelevato dalla destinazione, e quella strada va abbandonata. Il campo `M_valA` contiene l’indirizzo dell’istruzione che segue il salto in memoria, cioè la strada giusta.' : 'Il selettore guarda per primo lo stadio M. Nessun salto previsto male vi si trova, e si passa alla verifica successiva.', { calc: 'salto previsto male in M: ' + (p.j ? 'sì' : 'no') });
      P(2, 1, 'Seconda verifica: la ret', p.j ? 'La prima verifica ha già deciso, e l’esito della seconda diventa irrilevante. Nel circuito le condizioni vengono valutate tutte insieme: la priorità stabilisce quale conta.' : p.r ? 'Nello stadio W c’è una `ret`. Un ciclo fa, nello stadio M, ha letto dalla pila l’indirizzo di ritorno, che ora si trova nel campo `W_valM`.' : 'Anche nello stadio W manca una richiesta: nessuna `ret` vi si trova. Nessuna delle due correzioni è necessaria.', { calc: p.j ? 'già deciso dalla prima verifica' : 'ret nello stadio W: ' + (p.r ? 'sì' : 'no') });
      P(3, 2, 'La scelta', 'Il selettore lascia passare `' + U.NOMI[s] + '`, e f_pc vale ' + H(v) + '. ' + (s === 'm' ? 'La correzione del salto prevale: la pipeline stava seguendo la strada sbagliata, e ogni altro prelievo sarebbe inutile.' : s === 'w' ? 'L’indirizzo di ritorno prevale sul PC previsto, che dopo una `ret` è privo di significato.' : 'Nessuna correzione è richiesta, e il prelievo prosegue lungo la strada prevista.'), { calc: 'f_pc = ' + U.NOMI[s] + ' = ' + H(v), esito: ['f_pc = ' + H(v), 'si'] });
      P(4, 3, 'Il prelievo', 'La memoria delle istruzioni riceve f_pc e restituisce i byte che cominciano all’indirizzo ' + H(v) + '. Dagli stessi byte lo stadio F ricava il nuovo PC previsto, che al fronte entra nel registro F.' + (p.j && p.r ? ' In una esecuzione vera le due richieste sono incompatibili, perché quando una `ret` raggiunge lo stadio W gli stadi dietro di lei contengono bolle. L’ordine delle verifiche resta comunque definito.' : ''), { calc: 'prelievo da ' + H(v), esito: ['f_pc = ' + H(v), 'si'] });
      return { passi, esito: v };
    }
  },
  bilancio: {
    regola: [
      'Lo stadio F sceglie l’indirizzo del prelievo fra tre candidati: `M_valA` quando nello stadio M c’è un salto previsto male, `W_valM` quando nello stadio W c’è una `ret`, il PC previsto in tutti gli altri casi.',
      'Il PC previsto si ricava dai soli byte dell’istruzione appena prelevata: valC per `jmp`, `call` e salti condizionati, valP per tutte le altre.'
    ],
    errori: [
      ['Pensare che la ret conosca la destinazione al prelievo.', 'L’indirizzo di ritorno sta sulla pila, e viene letto soltanto nello stadio M.'],
      ['Correggere il salto con la destinazione.', 'La destinazione era la previsione. La correzione è l’altra strada: l’istruzione che segue il salto, conservata in M_valA.'],
      ['Leggere le tre sigle come valori dello stesso stadio.', 'F_predPC sta nel registro F, M_valA nel registro M, W_valM nel registro W. Appartengono a tre istruzioni diverse.']
    ],
    saFare: ['Elencare i tre candidati per il prelievo.', 'Applicare la priorità del selettore.', 'Ricavare il PC previsto dal tipo di istruzione.'],
    esercizi: [
      { d: 'Il registro F contiene F_predPC = 0x200. Nello stadio M c’è una `addq`, e nello stadio W c’è una `ret` con W_valM = 0x58. Quanto vale f_pc? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['58', '0x58', '58h', '058', '0x058'],
        ok: 'Nello stadio M manca un salto da correggere, e nello stadio W c’è una ret: passa W_valM.',
        diagnosi: [
          { se: ['200', '0x200', '200h'], msg: 'Il PC previsto passa soltanto quando mancano entrambe le richieste. Qui nello stadio W c’è una ret.' }
        ],
        altro: 'Il valore è diverso. Esamina le verifiche nell’ordine: prima il salto in M, poi la ret in W.',
        indizi: ['Nello stadio M c’è una addq, che non richiede correzioni.', 'Nello stadio W c’è una ret.', 'Con una ret in W passa W_valM.'],
        svolgimento: ['Salto previsto male in M: no.', 'ret in W: sì.', 'f_pc = W_valM = 0x58.'] },
      { d: 'Uno `jne` comincia all’indirizzo 0x30, occupa 9 byte e ha destinazione 0x100. PIPE lo prevede eseguito, e nello stadio E la condizione risulta falsa. Quale indirizzo porta il salto nel campo M_valA? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['39', '0x39', '39h', '039', '0x039'],
        ok: 'M_valA contiene l’indirizzo dell’istruzione che segue il salto: 0x30 + 9 = 0x39.',
        diagnosi: [
          { se: ['100', '0x100', '100h'], msg: 'Questa è la destinazione, cioè la strada già prelevata e ora da abbandonare.' },
          { se: ['30', '0x30', '30h'], msg: 'Questo è l’indirizzo del salto stesso. Serve quello dell’istruzione che lo segue.' },
          { se: ['3f', '0x3f', '3fh'], msg: 'La somma va fatta in esadecimale: 0x30 + 9 = 0x39.' }
        ],
        altro: 'Il valore è diverso. Serve l’indirizzo dell’istruzione che segue il salto in memoria.',
        indizi: ['La previsione era la destinazione, e si è rivelata sbagliata.', 'La strada giusta è l’istruzione che segue il salto.', '0x30 + 9.'],
        svolgimento: ['Indirizzo del salto: 0x30.', 'Lunghezza: 9 byte.', 'M_valA = valP = 0x30 + 9 = 0x39.'] },
      { d: 'Lo stadio F ha appena prelevato una `call 0x400` che comincia all’indirizzo 0x20. Quanto vale il PC previsto?', guida: 'Si scelga la risposta.', o: [
        { t: '0x400', ok: true, fb: 'La destinazione di una call è la costante valC, scritta nell’istruzione e nota fin dal prelievo.' },
        { t: '0x29', fb: 'Questo è valP, l’indirizzo di ritorno che la call salva sulla pila.' },
        { t: 'Resta ignoto fino allo stadio M', fb: 'Questo vale per la ret. La destinazione di una call si legge nei byte dell’istruzione.' }] }
    ],
    sfida: ['cslez3_6_03_random_assembly', 'Priorità nella selezione del PC']
  }
});
