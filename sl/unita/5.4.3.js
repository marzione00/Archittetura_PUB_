'use strict';
SL.unita543 = (() => {
  const insieme = (p) => Math.min(3, p.w - 1, p.c);
  // fase: 0 la dotazione · 1 U1 si blocca · 2 i worker rimasti · 3 l'esecuzione
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], m = insieme(p), wu = (o.w - 3 * 10) / 4;
    els.push(el.nota(pre + 't0', o.x, o.y, 'THREAD UTENTE · visti dal programma', 'mono'));
    for (let k = 0; k < 4; k++) els.push(el.cella(pre + 'u' + k, o.x + k * (wu + 10), o.y + 24, wu, 34, 'U' + (k + 1), k === 0 && f >= 1 ? 'err' : f >= 3 && k >= 1 && k <= m ? 'att' : 'on', { gi: k === 0 && f >= 1 ? 'in lettura' : f >= 3 && k >= 1 ? (k <= m ? 'esegue' : 'pronto, fermo') : 'pronto', piccola: true }));
    els.push(el.nota(pre + 't1', o.x, o.y + 84, 'THREAD DEL KERNEL · visti dallo scheduler', 'mono'));
    for (let k = 0; k < 4; k++) { const c_e = k < p.w; els.push(el.cella(pre + 'w' + k, o.x + k * (wu + 10), o.y + 108, wu, 34, c_e ? 'W' + (k + 1) : '', !c_e ? '' : k === 0 && f >= 1 ? 'err' : f >= 3 && k <= m ? 'att' : f >= 2 ? 'on' : 'on', { gi: !c_e ? '' : k === 0 && f >= 1 ? 'bloccato' : f >= 3 && k <= m ? 'su un core' : 'disponibile', piccola: true })); }
    return els;
  };
  return { insieme, quadro };
})();
SL.registra('5.4.3', {
  titolo: 'Chi decide quale thread eseguire?',
  obiettivo: 'Obiettivo: distinguere i thread che vede il programma da quelli che vede il kernel, e prevedere che cosa accade agli altri quando uno si blocca.',
  concetti: [['thread', 'Thread del programma'], ['privilegi', 'Thread del kernel'], ['strati', 'L’associazione fra i due livelli']],
  filigrana: ['thread', 'strati', 'privilegi'],
  richiami: {
    carte: [
      { sim: 'thread', da: 'Dall’unità 5.4.2', t: 'Concorrenza e parallelismo', d: 'Per eseguire nello stesso istante, ogni thread ha bisogno di un core.' },
      { sim: 'process', da: 'Dall’unità 4.2.4', t: 'La chiamata bloccante', d: 'Chi chiede dati non ancora disponibili viene sospeso dal kernel.' },
      { sim: 'coda', da: 'Dall’unità 5.3.1', t: 'Lo scheduler', d: 'Assegna i core alle entità che conosce.' }
    ],
    domanda: { d: 'Prima di proseguire: lo scheduler del kernel può assegnare un core a qualcosa di cui ignora l’esistenza?', o: [
      { t: 'No: assegna i core soltanto alle entità che conosce', ok: true, fb: 'Ciò che il kernel non vede, per lo scheduler non esiste.' },
      { t: 'Sì, se il core è libero', fb: 'Un core libero viene dato a una delle entità note al kernel.' },
      { t: 'Sì, attraverso la libreria', fb: 'La libreria può scegliere che cosa far eseguire a un’entità del kernel, ma i core li assegna il kernel.' }
    ] }
  },
  idea: {
    titolo: 'Due livelli di thread',
    termini: ['thread utente', 'thread del kernel', 'modello uno a uno'],
    testo: [
      'Quando un programma crea un thread, conta chi ne è a conoscenza: da questo dipende chi può metterlo in esecuzione. Un [[thread utente]] è un thread gestito da una libreria, dentro il processo: la libreria ne tiene la pila e i registri salvati, e sceglie quale far avanzare. Un [[thread del kernel]] è una entità che il kernel conosce e a cui il suo scheduler può assegnare un core. Perché un thread utente esegua servono entrambe le cose: un thread del kernel che lo trasporti, e un core.',
      'I due livelli si possono associare in modi diversi. Nel modello molti a uno, tutti i thread utente del programma poggiano su un solo thread del kernel. I cambi fra un thread utente e l’altro sono rapidi, perché avvengono senza passare dal kernel. Ma il kernel vede una sola entità: le assegna al più un core, e se quella entità si blocca, si ferma tutto il programma.',
      { fig: 'scena', w: 720, h: 170, titolo: 'Quattro thread utente su due thread del kernel, e U1 in lettura', nota: 'W1 è bloccato insieme a U1. Resta W2, che può portare su un core uno solo dei tre thread pronti.', els: SL.unita543.quadro('g', { w: 2, c: 4 }, 3, { x: 10, y: 0, w: 700 }) },
      'Vediamolo con quattro thread utente, da U1 a U4, e quattro core. U1 chiede una lettura bloccante. Con un solo thread del kernel, W1, la lettura sospende W1, e con lui tutti: U2, U3 e U4 sono pronti, i core sono liberi, e nessuno può portarli in esecuzione. Con due thread del kernel, W1 resta bloccato e W2 può far avanzare uno degli altri tre.',
      'Nel [[modello uno a uno]], ogni thread utente ha il proprio thread del kernel. La lettura di U1 blocca soltanto W1, e gli altri tre eseguono insieme su tre core. È il modello usato oggi dai principali sistemi: costa una chiamata al kernel per ogni creazione e per ogni cambio, e in compenso sfrutta tutti i core e isola i blocchi. Il numero di thread che eseguono insieme è il più piccolo fra tre quantità: i thread pronti, i thread del kernel disponibili, i core.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma ha quattro thread utente. U1 chiederà una lettura bloccante. Sceglierai quanti thread del kernel ha a disposizione il programma, e quanti core ha la macchina.',
      'Vedremo quale thread del kernel si blocca con U1, quanti ne restano, e quanti degli altri tre thread utente riescono a eseguire insieme.'
    ],
    vedrai: [
      ['thread', 'I thread utente', 'In alto: i quattro thread del programma, con il loro stato.'],
      ['privilegi', 'I thread del kernel', 'In basso: le entità che lo scheduler conosce. Una casella vuota indica un thread del kernel che non esiste.']
    ]
  },
  lab: {
    titolo: 'Un blocco, e chi lo subisce',
    scena: { w: 860, h: 172 },
    atti: ['La dotazione', 'Il blocco', 'Chi esegue'],
    controlli: [
      { id: 'w', tipo: 'scelta', eti: 'Thread del kernel', opzioni: [[1, '1 · molti a uno'], [2, '2'], [4, '4 · uno a uno']], valore: 2 },
      { id: 'c', tipo: 'scelta', eti: 'Core', opzioni: [[2, '2'], [4, '4']], valore: 4 }
    ],
    nota: 'I passi sono sempre quattro. I thread utente sono quattro in tutti i casi.',
    previsione: {
      domanda: (p) => 'Un programma ha quattro thread utente e ' + (p.w === 1 ? 'un solo thread del kernel' : p.w + ' thread del kernel') + ', su una macchina con ' + p.c + ' core. U1 chiede una lettura bloccante. Quanti degli altri tre thread utente possono eseguire nello stesso istante?',
      opzioni: () => [0, 1, 2, 3].map((v) => [v, v === 0 ? 'Nessuno' : String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Possono eseguire insieme ' + esito + ' thread. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'I thread pronti sono 3, i thread del kernel disponibili ' + (p.w - 1) + ', i core ' + p.c + ': conta il più piccolo dei tre numeri.'),
    costruisci(p) {
      const U = SL.unita543, m = U.insieme(p), passi = [], disp = p.w - 1;
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Thread pronti', f >= 1 ? '3' : '4', 'a'], ['Kernel disponibili', String(f >= 1 ? disp : p.w)], ['Eseguono insieme', f >= 3 ? String(m) : '·', 'c']], els: U.quadro('q', p, f, { x: 20, y: 0, w: 820 }) }, extra));

      P(0, 0, 'La dotazione', 'Il programma ha quattro thread utente, tutti pronti. La libreria li appoggia su ' + (p.w === 1 ? 'un solo thread del kernel, W1.' : p.w + ' thread del kernel, da W1 a W' + p.w + '.') + ' La macchina ha ' + p.c + ' core.', {});
      P(1, 1, 'U1 si blocca', 'U1 chiede una lettura bloccante, e i dati non sono pronti. La chiamata è stata fatta attraverso W1, ed è W1 che il kernel sospende. Per il kernel U1 è invisibile: esiste W1, che aspetta un dispositivo.', { chiedi: { d: 'Che cosa ha sospeso il kernel?', o: ['Il thread utente U1', 'Il thread del kernel W1', 'L’intero processo'], g: 1, no: 'Il kernel conosce soltanto i propri thread. U1 esiste per la libreria.' } });
      P(2, 1, disp === 0 ? 'Nessun thread del kernel' : 'I thread del kernel rimasti', disp === 0 ? 'W1 era il solo thread del kernel, ed è bloccato. La libreria non ha nulla su cui far eseguire U2, U3 e U4.' : 'Restano disponibili ' + (disp === 1 ? 'un thread del kernel, W2.' : disp + ' thread del kernel.') + ' Su ciascuno la libreria può far avanzare un thread utente pronto.', { calc: 'disponibili: ' + p.w + ' − 1 = ' + disp });
      P(3, 2, m === 0 ? 'Tutto fermo' : 'Chi esegue', m === 0 ? 'U2, U3 e U4 sono pronti, e i ' + p.c + ' core sono liberi. Nessuno dei tre esegue, finché la lettura di U1 non termina. Un solo blocco ha fermato l’intero programma.' : 'I thread utente pronti sono 3, i thread del kernel disponibili ' + disp + ', i core ' + p.c + '. Eseguono insieme ' + m + (m === 1 ? ' thread' : ' thread') + ', il più piccolo dei tre numeri.' + (m < 3 ? ' Gli altri restano pronti e fermi.' : ' Il blocco di U1 non ha rallentato nessuno.'), { calc: 'il minore fra 3, ' + disp + ' e ' + p.c + ' = ' + m, esito: [m === 0 ? 'nessuno esegue' : m + ' in esecuzione', m === 3 ? 'si' : m === 0 ? 'no' : ''] });
      return { passi, esito: m };
    }
  },
  bilancio: {
    regola: [
      'Un thread utente esegue soltanto se ha un thread del kernel disponibile e un core.',
      'Thread in esecuzione nello stesso istante = il più piccolo fra thread pronti, thread del kernel disponibili e core. Nel modello uno a uno un blocco ferma un solo thread.'
    ],
    errori: [
      ['Contare soltanto i core.', 'Core liberi non bastano, se manca un thread del kernel che porti il thread utente.'],
      ['Pensare che il kernel sospenda il thread utente.', 'Il kernel sospende il proprio thread, e con lui tutti i thread utente che vi poggiano.'],
      ['Ritenere il modello molti a uno adatto a più core.', 'Il kernel vede una sola entità, e le assegna al più un core.']
    ],
    saFare: ['Distinguere thread utente e thread del kernel.', 'Prevedere l’effetto di una chiamata bloccante nei diversi modelli.', 'Calcolare quanti thread eseguono insieme.'],
    esercizi: [
      { d: 'Un programma ha 6 thread utente pronti, appoggiati su 3 thread del kernel, e gira su 8 core. Nessuno è bloccato. Quanti thread utente eseguono nello stesso istante?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Il più piccolo fra 6, 3 e 8 è 3.',
        diagnosi: [
          { se: ['6', 'sei'], msg: 'I thread del kernel sono 3, e ciascuno porta un solo thread utente per volta.' },
          { se: ['8', 'otto'], msg: 'Otto sono i core. Mancano i thread del kernel per usarli tutti.' }
        ],
        altro: 'Il numero è diverso. Si prenda il più piccolo fra thread pronti, thread del kernel e core.',
        indizi: ['Thread pronti: 6.', 'Thread del kernel: 3. Core: 8.', 'Il minore è 3.'],
        svolgimento: ['Pronti: 6.', 'Thread del kernel: 3.', 'Core: 8.', 'In esecuzione: 3.'] },
      { d: 'Nel modello molti a uno, un thread utente chiede una lettura bloccante. Che cosa accade agli altri thread utente del programma?', guida: 'Si scelga la risposta.', o: [
        { t: 'Restano fermi, perché l’unico thread del kernel è bloccato', ok: true, fb: 'Il kernel vede una sola entità, e l’ha sospesa.' },
        { t: 'Proseguono sui core liberi', fb: 'Senza un thread del kernel disponibile, i core liberi non servono.' },
        { t: 'Vengono terminati', fb: 'Nessuno li termina. Restano pronti, in attesa che la lettura finisca.' }] },
      { d: 'Qual è il prezzo del modello uno a uno, rispetto a molti a uno?', guida: 'Si scelga la risposta.', o: [
        { t: 'Creazioni e cambi di thread passano dal kernel, e costano di più', ok: true, fb: 'In cambio si usano tutti i core e i blocchi restano isolati.' },
        { t: 'Un blocco ferma l’intero programma', fb: 'Questo è il difetto di molti a uno.' },
        { t: 'Il programma può usare un solo core', fb: 'Anche questo è un limite di molti a uno.' }] }
    ],
    sfida: ['cslez5_4_03_threads', 'Modelli di associazione tra thread']
  }
});
