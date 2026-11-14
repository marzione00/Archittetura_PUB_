'use strict';
SL.unita363 = (() => {
  const E = { op: ['addq', '%rax', 'una `addq` che scrive %rax'], cmov: ['cmovne', 'RNONE', 'una `cmovne` diretta a %rax con la condizione falsa'], altra: ['addq', '%rbx', 'una `addq` che scrive %rbx'] };
  const M = { load: ['mrmovq', 'm_valM', 93, 'una `mrmovq` che scrive %rax'], op: ['addq', 'M_valE', 74, 'una `addq` che scrive %rax'], altra: ['nop', '', null, 'una `nop`'] };
  // i candidati, dal più vicino al più lontano: [valido, sigla, valore]
  const candidati = (p) => [[p.e === 'op', 'e_valE', 52], [p.m !== 'altra', M[p.m][1], M[p.m][2]], [true, 'W_valE', 31], [true, 'banco', 12]];
  const trovato = (p) => candidati(p).findIndex((x) => x[0]);
  // fase: 0 richiesta · 1, 2, 3 confronti con E, M, W · 4 valore inoltrato · 5 riepilogo
  const quadro = (pre, p, f, o) => {
    const el = SL.el, t = trovato(p), c = candidati(p), els = [], xc = o.x + o.wd + o.gap, xr = xc + o.wc + o.gap, yd = o.y + 1.5 * o.py - o.hd / 2 + (o.h - o.py) / 2 + (o.py - o.h) / 2;
    const testi = ['e_valE = 52 → ' + E[p.e][1], p.m === 'altra' ? 'nessuna scrittura' : M[p.m][1] + ' = ' + M[p.m][2] + ' → %rax', 'W_valE = 31 → %rax', '%rax = 12'];
    const eti = ['stadio E · ' + E[p.e][0], 'stadio M · ' + M[p.m][0], 'stadio W · addq', 'banco dei registri'];
    const stato = (k) => {
      if (f === 0) return 'on';
      if (f >= 4) return k === t ? 'att' : 'off';
      const esame = f - 1;
      if (esame <= t) return k < esame ? 'off' : k === esame ? 'att' : 'on';
      return k < t ? 'off' : k === t ? 'att' : k === esame ? 'zero' : 'on';
    };
    els.push(el.box(pre + 'd', o.x, yd, o.wd, o.hd, 'stadio D · legge', '%rax', f === 0 ? 'att' : 'on', { cls: 'stretta' }));
    testi.forEach((tx, k) => {
      const yy = o.y + k * o.py;
      els.push(el.box(pre + 'c' + k, xc, yy, o.wc, o.h, eti[k], tx, stato(k), { cls: 'stretta' }));
      els.push(el.linea(pre + 'l' + k, o.x + o.wd, yd + o.hd / 2, xc, yy + o.h / 2, (f >= 1 && f <= 3 && k === f - 1) ? 'att' : ''));
      els.push(el.linea(pre + 'r' + k, xc + o.wc, yy + o.h / 2, xr, yd + o.hd / 2, f >= 4 && k === t ? 'att' : ''));
    });
    els.push(el.box(pre + 'v', xr, yd, o.wr, o.hd, 'valore inoltrato', f >= 4 ? 'd_valA = ' + c[t][2] : 'd_valA = ·', f === 4 ? 'att' : f > 4 ? 'on' : '', { cls: 'stretta' }));
    return els;
  };
  return { E, M, candidati, trovato, quadro };
})();
SL.registra('3.6.3', {
  titolo: 'Dipendenze dei dati e inoltro',
  obiettivo: 'Obiettivo: indicare il valore ricevuto da un’istruzione nello stadio D quando il registro richiesto sta per essere scritto da istruzioni ancora presenti nella pipeline.',
  concetti: [['register', 'Il ritardo del banco'], ['bus', 'L’inoltro'], ['lente', 'Il produttore più vicino']],
  filigrana: ['bus', 'register', 'lente'],
  richiami: {
    carte: [
      { sim: 'conflitto', da: 'Dall’unità 3.5.3', t: 'Il conflitto sui dati', d: 'Un’istruzione richiede un valore che un’istruzione precedente deve ancora produrre.' },
      { sim: 'output', da: 'Dall’unità 3.3.3', t: 'La fase di scrittura', d: 'Il banco dei registri riceve i risultati soltanto nell’ultima fase.' },
      { sim: 'register', da: 'Dall’unità 3.6.1', t: 'Le sigle di PIPE', d: 'Iniziale maiuscola: un campo conservato in un registro di pipeline. Iniziale minuscola: un valore calcolato nel ciclo corrente.' }
    ],
    domanda: { d: 'Prima di proseguire: una `addq` calcola il proprio risultato nello stadio E. In quale stadio lo deposita nel banco dei registri?', o: [
      { t: 'Nello stadio W', ok: true, fb: 'Fra il calcolo e la scrittura intercorrono due stadi, e in quei cicli il banco contiene ancora il valore precedente.' },
      { t: 'Nello stadio E', fb: 'Nello stadio E il risultato è calcolato, e prosegue nei registri di pipeline fino all’ultimo stadio.' },
      { t: 'Nello stadio M', fb: 'Lo stadio M riguarda la memoria dei dati. Il banco è scritto nello stadio successivo.' }
    ] }
  },
  idea: {
    titolo: 'Il prelievo del valore alla sorgente',
    termini: ['inoltro', 'copia condizionata', 'rnone'],
    testo: [
      'Un’istruzione legge i propri operandi nello stadio D, dal banco dei registri. Il banco è scritto soltanto nello stadio W. Se una `addq` scrive %rax, per i due cicli in cui essa attraversa M e W il banco contiene ancora il valore precedente. Un’istruzione che la segue a breve distanza e legge %rax otterrebbe un dato superato.',
      'Arrestare la pipeline fino all’aggiornamento del banco costerebbe fino a tre cicli per ogni dipendenza. PIPE adotta una soluzione più efficiente. Il valore nuovo esiste già: è contenuto in un registro di pipeline, oppure è in uscita dall’ALU nel ciclo corrente. È sufficiente un collegamento che lo porti direttamente allo stadio D. Tale tecnica prende il nome di [[inoltro]], in inglese forwarding.',
      'Lo stadio D confronta il registro richiesto con la destinazione delle istruzioni che lo precedono. I candidati sono tre. Il più vicino è il risultato che l’ALU sta calcolando nello stadio E, `e_valE`. Segue lo stadio M, con il dato che sta leggendo dalla memoria, `m_valM`, oppure con il risultato in esso conservato, `M_valE`. Il più lontano è il valore che lo stadio W sta per scrivere, `W_valE`. Se nessuno dei tre scrive quel registro, vale il contenuto del banco.',
      { fig: 'scena', w: 720, h: 252, titolo: 'Tre istruzioni scrivono %rax: vale la più vicina', nota: 'Il risultato dell’ALU, 52, raggiunge lo stadio D senza attraversare il banco.', els: SL.unita363.quadro('g', { e: 'op', m: 'load' }, 4, { x: 10, y: 8, wd: 150, wc: 330, wr: 170, gap: 30, h: 50, py: 58, hd: 60 }) },
      'Quando più istruzioni scrivono il medesimo registro, è determinante la più vicina. Essa è l’ultima ad averlo scritto nell’ordine del programma, e il suo valore sostituisce i precedenti. Per questa ragione la ricerca parte dallo stadio E e si arresta al primo confronto riuscito.',
      'È determinante la scrittura effettiva. Y86-64 possiede istruzioni di [[copia condizionata]], come `cmovne`: copiano un registro in un altro soltanto se la condizione è vera. Con la condizione falsa la copia resta priva di effetto, e nello stadio E la sua destinazione è sostituita con [[rnone|RNONE]], il codice F che indica l’assenza di un registro. Il confronto fallisce, e la ricerca prosegue verso gli stadi più lontani.',
      'L’inoltro ha un limite, già incontrato nell’unità 3.5.3. Un dato caricato dalla memoria è disponibile soltanto alla fine dello stadio M. Se l’istruzione che lo impiega segue immediatamente il carico, in quell’istante il dato manca ancora, e occorre un ciclo di stallo.'
    ]
  },
  esperimento: {
    faremo: [
      'Un’istruzione nello stadio D deve leggere %rax. Il banco contiene 12, un valore superato. Nello stadio W un’istruzione sta per scrivervi 31. I controlli fissano le istruzioni che occupano gli stadi E e M.',
      'Lo stadio D confronta %rax con la destinazione di ciascuna, a partire dalla più vicina, e acquisisce il primo valore valido. Dopo il caso proposto, è istruttivo collocare nello stadio E la copia condizionata con la condizione falsa.'
    ],
    vedrai: [
      ['register', 'La richiesta', 'A sinistra: lo stadio D e il registro richiesto.'],
      ['bus', 'I candidati', 'Al centro: gli stadi E, M e W e il banco, dal più vicino al più lontano.'],
      ['lente', 'Il valore inoltrato', 'A destra: il valore fornito allo stadio D.']
    ]
  },
  lab: {
    titolo: 'Quale valore per %rax',
    scena: { w: 860, h: 268 },
    atti: ['La richiesta', 'I confronti', 'Il valore inoltrato', 'Il perché'],
    controlli: [
      { id: 'e', tipo: 'scelta', eti: 'Nello stadio E', opzioni: [['op', 'addq che scrive %rax'], ['cmov', 'cmovne con condizione falsa'], ['altra', 'addq che scrive %rbx']], valore: 'op' },
      { id: 'm', tipo: 'scelta', eti: 'Nello stadio M', opzioni: [['load', 'mrmovq che scrive %rax'], ['op', 'addq che scrive %rax'], ['altra', 'nop']], valore: 'load' }
    ],
    nota: 'I passi sono sempre sei. I valori sono fissi: 52 dall’ALU, 93 dalla memoria, 74 dal registro M, 31 dal registro W, 12 nel banco.',
    previsione: {
      domanda: (p) => 'Lo stadio D deve leggere %rax. Nello stadio E è presente ' + SL.unita363.E[p.e][2] + ', nello stadio M ' + SL.unita363.M[p.m][3] + ', e nello stadio W un’istruzione che sta per scrivere 31 in %rax. Il banco contiene 12. Quale valore riceve lo stadio D?',
      opzioni: (p) => [[52, '52, dall’ALU nello stadio E']].concat(p.m === 'load' ? [[93, '93, dalla memoria nello stadio M']] : p.m === 'op' ? [[74, '74, dal registro M']] : [], [[31, '31, dal registro W'], [12, '12, dal banco']])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Lo stadio D riceve ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 12 ? 'Il banco contiene un valore superato, poiché almeno un’istruzione nella pipeline sta per scrivere %rax.' : pred === 52 ? (p.e === 'cmov' ? 'La copia condizionata ha la condizione falsa, e la sua destinazione effettiva è RNONE.' : 'La `addq` nello stadio E scrive %rbx, un registro diverso da quello richiesto.') : 'Fra più istruzioni che scrivono %rax è determinante la più vicina allo stadio D, poiché è l’ultima nell’ordine del programma.'),
    costruisci(p) {
      const U = SL.unita363, passi = [], c = U.candidati(p), t = U.trovato(p), v = c[t][2], sigla = c[t][1];
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 8, wd: 180, wc: 400, wr: 180, gap: 30, h: 56, py: 64, hd: 72 });
      const hud = (f) => [['Registro richiesto', '%rax', 'a'], ['Sorgente', f >= 4 ? sigla : '·'], ['Valore', f >= 4 ? String(v) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La richiesta', 'Nello stadio D è presente un’istruzione che legge %rax. Il banco dei registri contiene 12. Tre istruzioni più avanzate nella pipeline potrebbero disporre per %rax di un valore più recente, e lo stadio D le esamina a partire dalla più vicina.',
        { chiedi: { d: 'Nello stadio W un’istruzione sta per scrivere 31 in %rax. Durante questo ciclo, che cosa contiene il banco per %rax?', o: ['Già 31', 'Ancora 12'], g: 1, no: 'Il banco è scritto al fronte che chiude il ciclo. Durante il ciclo contiene ancora 12.' } });
      P(1, 1, 'Confronto con lo stadio E', p.e === 'op' ? 'La `addq` nello stadio E ha come destinazione %rax, il registro richiesto. Il suo risultato, 52, è in uscita dall’ALU in questo ciclo con la sigla `e_valE`. Il confronto riesce, e la ricerca può arrestarsi.' : p.e === 'cmov' ? 'Nello stadio E è presente una `cmovne` diretta a %rax, con la condizione falsa. La copia resta priva di effetto, e la sua destinazione effettiva diviene RNONE. Il confronto con %rax fallisce.' : 'La `addq` nello stadio E ha come destinazione %rbx. Il registro richiesto è %rax, e il confronto fallisce. Il risultato 52 riguarda un altro registro.', { calc: 'destinazione di E: ' + U.E[p.e][1] + (p.e === 'op' ? ' · uguale a %rax' : ' · diversa da %rax') });
      P(2, 1, 'Confronto con lo stadio M', t === 0 ? (p.m === 'altra' ? 'Nello stadio M è presente una `nop`, priva di destinazione. In ogni caso il confronto con E ha già determinato l’esito.' : 'Anche la `' + U.M[p.m][0] + '` nello stadio M scrive %rax, con il valore ' + U.M[p.m][2] + '. È un’istruzione meno recente della `addq` nello stadio E: nel programma la `addq` è successiva, e il suo valore sostituisce questo.') : p.m === 'load' ? 'La `mrmovq` nello stadio M ha come destinazione %rax. Il dato 93 è fornito dalla memoria in questo ciclo, con la sigla `m_valM`. Il confronto riesce.' : p.m === 'op' ? 'La `addq` nello stadio M ha come destinazione %rax. Il suo risultato 74, calcolato nel ciclo precedente, è conservato nel registro M con la sigla `M_valE`. Il confronto riesce.' : 'Nello stadio M è presente una `nop`, priva di destinazione. Il confronto fallisce, e la ricerca prosegue.', { calc: 'destinazione di M: ' + (p.m === 'altra' ? 'RNONE' : '%rax') + (t === 0 ? ' · confronto superfluo' : p.m === 'altra' ? ' · diversa da %rax' : ' · uguale a %rax') });
      P(3, 1, 'Confronto con lo stadio W', t < 2 ? 'L’istruzione nello stadio W scrive %rax con il valore 31. È la meno recente delle tre, e un’istruzione più vicina ha già fornito il valore.' : 'L’istruzione nello stadio W ha come destinazione %rax, e il valore 31 si trova nel registro W con la sigla `W_valE`. Il confronto riesce. Il banco, che contiene ancora 12, resta escluso.', { calc: 'destinazione di W: %rax' + (t < 2 ? ' · confronto superfluo' : ' · uguale a %rax') });
      P(4, 2, 'Il valore inoltrato', 'Lo stadio D riceve ' + v + ', dalla sorgente `' + sigla + '`. Al fronte questo valore entra nel registro E come valA, e nel ciclo seguente è disponibile per l’ALU. Il banco riceverà il medesimo valore in seguito, quando l’istruzione che lo produce raggiungerà lo stadio W.', { calc: 'd_valA = ' + sigla + ' = ' + v, esito: ['d_valA = ' + v, 'si'] });
      P(5, 3, 'La ragione della priorità', 'Le istruzioni negli stadi E, M e W sono entrate nella pipeline in successione: quella in W è la meno recente, quella in E la più recente. All’istruzione nello stadio D occorre il valore lasciato dall’ultima scrittura che la precede nel programma. La ricerca dal più vicino al più lontano individua tale scrittura.', { calc: 'ordine del programma: W, M, E, poi D', esito: ['d_valA = ' + v, 'si'] });
      return { passi, esito: v };
    }
  },
  bilancio: {
    regola: [
      'L’inoltro porta allo stadio D un valore che il banco dei registri riceverà soltanto in seguito, prelevandolo dallo stadio E, M oppure W.',
      'Fra più istruzioni che scrivono il medesimo registro vale la più vicina allo stadio D, cioè l’ultima nell’ordine del programma. Un’istruzione priva di scrittura effettiva, come una copia condizionata con la condizione falsa, è ignorata.'
    ],
    errori: [
      ['Leggere sempre dal banco.', 'Il banco riceve un risultato soltanto nello stadio W. Fino a quell’istante il valore valido è contenuto nella pipeline.'],
      ['Acquisire il valore dallo stadio più avanzato.', 'Lo stadio W ospita l’istruzione meno recente. Il valore più recente è quello dello stadio più vicino a D.'],
      ['Considerare soltanto la destinazione scritta nel testo.', 'È determinante la scrittura effettiva. Una copia condizionata con la condizione falsa ha destinazione RNONE.']
    ],
    saFare: ['Elencare i candidati per l’inoltro.', 'Scegliere il produttore più vicino.', 'Riconoscere un’istruzione priva di scrittura effettiva.'],
    esercizi: [
      { d: 'Lo stadio D legge %rcx. Nello stadio E una `addq` sta calcolando 40 per %rdx. Nello stadio M una `addq` contiene 25 per %rcx. Nello stadio W un’istruzione sta per scrivere 9 in %rcx. Il banco contiene 3. Quale valore riceve lo stadio D?', segnaposto: 'Un numero', giuste: ['25', 'venticinque'],
        ok: 'Lo stadio E scrive un altro registro. Il primo confronto riuscito è quello con lo stadio M, che contiene 25.',
        diagnosi: [
          { se: ['40', 'quaranta'], msg: 'Il risultato dello stadio E è destinato a %rdx, un altro registro.' },
          { se: ['9', 'nove'], msg: 'Lo stadio W ospita un’istruzione meno recente di quella nello stadio M. Vale la più vicina.' },
          { se: ['3', 'tre'], msg: 'Il banco contiene un valore superato: due istruzioni nella pipeline stanno per scrivere %rcx.' }
        ],
        altro: 'Il numero è diverso. Si confronti %rcx con le destinazioni degli stadi E, M e W, in quest’ordine.',
        indizi: ['Lo stadio E scrive %rdx: il confronto fallisce.', 'Lo stadio M scrive %rcx: il confronto riesce.', 'Il valore contenuto nello stadio M è 25.'],
        svolgimento: ['Stadio E: destinazione %rdx, diversa.', 'Stadio M: destinazione %rcx, uguale. Valore 25.', 'La ricerca si arresta: d_valA = 25.'] },
      { d: 'Nello stadio E è presente una `cmove %rsi, %rax` con la condizione falsa. Nello stadio M è presente una `nop`. Nello stadio W un’istruzione sta per scrivere 31 in %rax. Lo stadio D legge %rax. Da quale sorgente proviene il valore?', guida: 'Si scelga la risposta.', o: [
        { t: 'Dal registro W, con W_valE', ok: true, fb: 'La copia ha destinazione RNONE e la `nop` è priva di destinazione. Il primo confronto riuscito è quello con lo stadio W.' },
        { t: 'Dallo stadio E, con e_valE', fb: 'La copia ha la condizione falsa, e la sua destinazione effettiva è RNONE.' },
        { t: 'Dal banco dei registri', fb: 'Il banco contiene ancora il valore precedente. La scrittura dello stadio W avviene al fronte.' }] },
      { d: 'Una `mrmovq` è immediatamente seguita da un’istruzione che ne impiega il dato. Perché il solo inoltro è insufficiente?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il dato esce dalla memoria alla fine dello stadio M, un ciclo dopo l’istante in cui sarebbe richiesto', ok: true, fb: 'Quando l’istruzione che impiega il dato è nello stadio D, il carico è ancora nello stadio E. Occorre un ciclo di stallo, seguito dall’inoltro di m_valM.' },
        { t: 'Fra lo stadio M e lo stadio D manca un collegamento', fb: 'Il collegamento esiste, con la sigla m_valM. Il problema è l’istante in cui il dato diviene disponibile.' },
        { t: 'La mrmovq scrive il banco più tardi delle altre istruzioni', fb: 'Tutte le istruzioni scrivono il banco nello stadio W. L’inoltro ha lo scopo di evitare tale attesa.' }] }
    ]
  }
});
