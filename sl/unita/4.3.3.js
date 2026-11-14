'use strict';
SL.unita433 = (() => {
  /* fase: 0 la richiesta · 1 il vettore · 2 la voce della IDT · 3 la prima azione del gestore · 4 la seconda azione · 5 l'esito
     ordine 'prima': toglie la causa, poi EOI · ordine 'dopo': EOI con la linea ancora attiva */
  const quadro = (pre, p, f, o) => {
    const el = SL.el, v = 32 + p.q, bene = p.ack === 'prima', els = [], x2 = o.x + o.w + o.gap, x3 = x2 + o.w + o.gap, py = o.h + 14;
    const linea = bene ? f <= 2 : f <= 4, causa = bene ? f <= 2 : f <= 4;
    const ctl = f === 0 ? 'in attesa' : bene ? (f <= 3 ? 'in servizio' : 'libero') : (f <= 2 ? 'in servizio' : f === 3 ? 'libero, linea attiva' : f === 4 ? 'nuova consegna' : 'in servizio');
    const gest = f <= 1 ? '·' : f === 2 ? 'parte' : bene ? (f === 3 ? 'toglie la causa' : f === 4 ? 'manda EOI' : 'ha finito') : (f === 3 ? 'manda EOI' : f === 4 ? 'richiamato' : 'toglie la causa');
    els.push(el.box(pre + 'a', o.x, o.y, o.w, o.h, 'linea ' + p.q + ' della periferica', linea ? 'attiva' : 'a riposo', linea ? (f === 0 ? 'att' : 'err') : 'on', { cls: 'stretta' }),
      el.box(pre + 'b', o.x, o.y + py, o.w, o.h, 'motivo della richiesta', causa ? 'un dato da prelevare' : 'rimosso', causa ? 'on' : 'zero', { cls: 'stretta' }),
      el.box(pre + 'c', x2, o.y, o.w, o.h, 'controller · vettore', f >= 1 ? '32 + ' + p.q + ' = ' + v : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'd', x2, o.y + py, o.w, o.h, 'controller · stato', ctl, (!bene && (f === 3 || f === 4)) ? 'err' : f >= 1 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'e', x3, o.y, o.w, o.h, 'processore · voce della IDT', f >= 2 ? v + ' × 16 = ' + (16 * v) + ' byte' : '·', f === 2 ? 'att' : f > 2 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'g', x3, o.y + py, o.w, o.h, 'processore · gestore', gest, f >= 3 && f <= 4 ? 'att' : f >= 2 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.linea(pre + 'l1', o.x + o.w, o.y + o.h / 2, x2, o.y + o.h / 2, f === 1 || (!bene && f === 4) ? 'att' : ''), el.linea(pre + 'l2', x2 + o.w, o.y + o.h / 2, x3, o.y + o.h / 2, f === 2 || (!bene && f === 4) ? 'att' : ''));
    if (o.esito) els.push(el.box(pre + 'h', o.x, o.y + 2 * py + 6, 3 * o.w + 2 * o.gap, o.h, 'consegne dello stesso evento', f >= 5 ? (bene ? 'una sola' : 'due: la seconda era evitabile') : f >= 2 ? (!bene && f >= 4 ? '2' : '1') : '·', f >= 5 ? (bene ? 'att' : 'err') : f >= 2 ? 'on' : '', { cls: 'stretta' }));
    return els;
  };
  return { quadro };
})();
SL.registra('4.3.3', {
  titolo: 'Instradamento, vettori e conferma dell’interrupt',
  obiettivo: 'Obiettivo: seguire una richiesta di interruzione dalla linea della periferica fino al gestore, e dire in quale ordine il gestore deve togliere la causa e confermare il servizio.',
  concetti: [['interrupt', 'Dalla linea al vettore'], ['tabella', 'Dal vettore al gestore'], ['scudo', 'Due conferme, in ordine']],
  filigrana: ['interrupt', 'tabella', 'scudo'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 4.1.3', t: 'La IDT', d: 'La voce del vettore v si trova 16 × v byte dopo l’inizio. I vettori da 0 a 31 sono riservati alle eccezioni.' },
      { sim: 'interrupt', da: 'Dall’unità 4.1.7', t: 'Il controller degli interrupt', d: 'Raccoglie le richieste delle periferiche e le presenta al processore, una alla volta.' },
      { sim: 'dispositivo', da: 'Dall’unità 4.3.2', t: 'La richiesta di interruzione', d: 'Il segnale con cui un controller chiede attenzione quando un evento è avvenuto.' }
    ],
    domanda: { d: 'Prima di proseguire: quanti byte separano dall’inizio della IDT la voce del vettore 33?', o: [
      { t: '528', ok: true, fb: 'Ogni voce occupa 16 byte: 33 × 16 = 528.' },
      { t: '33', fb: 'Il vettore è un indice. La distanza in byte si ottiene moltiplicandolo per 16.' },
      { t: '264', fb: 'Le voci occupano 16 byte, il doppio di 8.' }
    ] }
  },
  idea: {
    titolo: 'Tre tappe e due conferme',
    termini: ['linea di interruzione', 'interrupt a livello', 'eoi'],
    testo: [
      'Fra la periferica e il gestore, una richiesta di interruzione percorre tre tappe. La periferica attiva un filo, la propria [[linea di interruzione]]. Il controller degli interrupt, a cui arrivano tutte le linee, traduce il numero della linea in un vettore. Il processore usa il vettore per trovare il gestore nella IDT. In questo modello il vettore è 32 più il numero della linea, perché i primi 32 sono riservati alle eccezioni.',
      'Molte periferiche tengono la linea attiva finché esiste il motivo della richiesta: un dato da prelevare, un errore da riconoscere. Si parla di [[interrupt a livello]], perché conta il livello del filo in ogni istante. Il momento in cui è salito è irrilevante.',
      'Il gestore ha quindi due interlocutori, e deve rivolgersi a entrambi. Alla periferica deve togliere il motivo della richiesta, per esempio leggendo il dato, e soltanto allora la linea torna a riposo. Al controller deve dire che il servizio è finito, con un comando chiamato [[eoi|EOI]], fine dell’interrupt. Fino a quel comando il controller considera la richiesta in servizio, e trattiene le altre di priorità pari o inferiore.',
      { fig: 'scena', w: 720, h: 150, titolo: 'La linea 1 chiede attenzione', nota: 'Linea 1, vettore 33, voce della IDT a 528 byte dall’inizio. La linea resta attiva finché il gestore toglie la causa.', els: SL.unita433.quadro('g', { q: 1, ack: 'prima' }, 2, { x: 10, y: 8, w: 222, gap: 17, h: 56 }) },
      'L’ordine delle due azioni conta. Se il gestore manda EOI mentre la linea è ancora attiva, il controller, tornato libero, vede un filo alto e lo prende per una richiesta nuova. Il gestore viene chiamato una seconda volta per lo stesso evento. Togliendo prima la causa, la linea è già a riposo quando arriva EOI, e la faccenda si chiude.'
    ]
  },
  esperimento: {
    faremo: [
      'Una periferica attiva la propria linea, e la tiene attiva finché il dato resta da prelevare. Sceglierai il numero della linea e l’ordine in cui il gestore compie le sue due azioni.',
      'Seguiremo la richiesta dal filo al vettore, dal vettore alla voce della IDT, e poi le due conferme. Dopo il caso proposto, inverti l’ordine e conta quante volte parte il gestore.'
    ],
    vedrai: [
      ['dispositivo', 'La periferica', 'A sinistra: il livello della linea e il motivo della richiesta.'],
      ['interrupt', 'Il controller', 'Al centro: il vettore assegnato e lo stato del servizio.'],
      ['cpu', 'Il processore', 'A destra: la voce della IDT e che cosa sta facendo il gestore.']
    ]
  },
  lab: {
    titolo: 'Dalla linea al gestore, e ritorno',
    scena: { w: 860, h: 246 },
    atti: ['La richiesta', 'L’instradamento', 'Le due conferme', 'L’esito'],
    controlli: [
      { id: 'ack', tipo: 'scelta', eti: 'Ordine delle conferme', opzioni: [['prima', 'toglie la causa, poi manda EOI'], ['dopo', 'manda EOI, poi toglie la causa']], valore: 'prima' },
      { id: 'q', tipo: 'scelta', eti: 'Linea della periferica', opzioni: [[1, '1'], [4, '4'], [11, '11']], valore: 1 }
    ],
    nota: 'I passi sono sempre sei. Il controller assegna alla linea n il vettore 32 + n, e la linea è sensibile al livello.',
    previsione: {
      domanda: (p) => 'La linea ' + p.q + ' è attiva, e resta attiva finché il dato non viene prelevato. Il gestore ' + (p.ack === 'prima' ? 'preleva il dato e poi manda EOI' : 'manda EOI e poi preleva il dato') + '. Quante volte viene chiamato per questo evento?',
      opzioni: () => [['no', 'Una volta'], ['si', 'Due volte']]
    },
    confronto: (pred, esito) => 'La previsione indicava ' + (pred === 'si' ? 'due chiamate' : 'una chiamata') + '. Il gestore viene chiamato ' + (esito === 'si' ? 'due volte' : 'una volta') + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'si' ? 'All’arrivo di EOI la linea è ancora attiva, e il controller la prende per una richiesta nuova.' : 'Quando arriva EOI la linea è già a riposo, e il controller non ha nulla da consegnare.'),
    costruisci(p) {
      const U = SL.unita433, passi = [], v = 32 + p.q, off = 16 * v, bene = p.ack === 'prima';
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'PERIFERICA', 'mono'), SL.el.nota('t1', 300, 0, 'CONTROLLER DEGLI INTERRUPT', 'mono'), SL.el.nota('t2', 580, 0, 'PROCESSORE', 'mono')].concat(U.quadro('q', p, f, { x: 20, y: 24, w: 264, gap: 14, h: 58, esito: true }));
      const hud = (f) => [['Linea', String(p.q), 'a'], ['Vettore', f >= 1 ? String(v) : '·'], ['Chiamate del gestore', f >= 2 ? String(!bene && f >= 4 ? 2 : 1) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La richiesta', 'La periferica ha un dato pronto e porta al livello attivo la propria linea, la numero ' + p.q + '. La linea resterà attiva finché il dato rimane da prelevare.',
        { chiedi: { d: 'Il controller assegna alla linea n il vettore 32 + n. Quale vettore corrisponde alla linea ' + p.q + '?', o: [String(p.q), String(v), String(16 * p.q)], g: 1, no: '32 + ' + p.q + ' = ' + v + '. I primi 32 vettori sono riservati alle eccezioni.' } });
      P(1, 1, 'Dalla linea al vettore', 'Il controller degli interrupt vede la linea ' + p.q + ' attiva. Le assegna il vettore 32 + ' + p.q + ' = ' + v + ', segna la richiesta come in servizio e la presenta al processore.', { calc: '32 + ' + p.q + ' = ' + v });
      P(2, 1, 'Dal vettore al gestore', 'Il processore cerca la voce ' + v + ' della IDT, che si trova ' + v + ' × 16 = ' + off + ' byte dopo l’inizio della tabella. Vi legge l’indirizzo del gestore, e lo fa partire. La linea è ancora attiva.', { calc: v + ' × 16 = ' + off + ' byte' });
      P(3, 2, bene ? 'Prima la causa' : 'Prima EOI', bene ? 'Il gestore legge il dato dal registro della periferica. Il motivo della richiesta scompare, e la periferica riporta la linea a riposo. Il controller considera ancora la richiesta in servizio.' : 'Il gestore manda subito EOI al controller, che chiude il servizio e torna libero. Il dato però è ancora nella periferica, e la linea è ancora attiva. Il controller vede un filo alto.', { calc: bene ? 'linea a riposo · controller in servizio' : 'controller libero · linea ancora attiva' });
      P(4, 2, bene ? 'Poi EOI' : 'Una seconda consegna', bene ? 'Il gestore manda EOI. Il controller chiude il servizio e guarda le linee: la ' + p.q + ' è a riposo, e non c’è nulla da consegnare.' : 'Per il controller una linea attiva senza un servizio in corso è una richiesta. La consegna di nuovo con il vettore ' + v + ', e il processore entra nel gestore una seconda volta, per lo stesso evento.', { calc: bene ? 'nessuna nuova richiesta' : 'seconda consegna, vettore ' + v });
      P(5, 3, 'L’esito', bene ? 'Il gestore è stato chiamato una volta, e l’evento è chiuso su entrambi i fronti: la periferica ha consegnato il dato, il controller è libero.' : 'Alla seconda chiamata il gestore preleva finalmente il dato, e la linea torna a riposo. Il risultato è corretto, ed è costato un ingresso in più. Con una periferica veloce le chiamate superflue si ripeterebbero a ogni evento.', { calc: 'chiamate del gestore: ' + (bene ? 1 : 2), esito: [bene ? 'una chiamata' : 'due chiamate', bene ? 'si' : 'no'] });
      return { passi, esito: bene ? 'no' : 'si' };
    }
  },
  bilancio: {
    regola: [
      'Una richiesta percorre tre tappe: la linea della periferica, il vettore assegnato dal controller, la voce della IDT che porta al gestore.',
      'Con una linea sensibile al livello il gestore deve prima togliere la causa nella periferica, e poi mandare EOI al controller. Nell’ordine inverso la stessa richiesta viene consegnata due volte.'
    ],
    errori: [
      ['Pensare che EOI spenga la linea.', 'EOI parla al controller. La linea la spegne la periferica, quando il motivo della richiesta è rimosso.'],
      ['Usare il numero della linea come vettore.', 'Il controller aggiunge 32, perché i primi vettori sono riservati alle eccezioni.'],
      ['Dimenticare EOI.', 'Il controller continuerebbe a considerare la richiesta in servizio, trattenendo le altre di priorità pari o inferiore.']
    ],
    saFare: ['Ricavare il vettore dal numero della linea.', 'Determinare la voce della IDT per quel vettore.', 'Porre in ordine le due conferme del gestore.'],
    esercizi: [
      { d: 'Un controller assegna alla linea n il vettore 32 + n. Quanti byte separano dall’inizio della IDT la voce usata dalla linea 6?', segnaposto: 'Un numero', giuste: ['608', 'seicentootto'],
        ok: 'Il vettore è 32 + 6 = 38, e la voce dista 38 × 16 = 608 byte.',
        diagnosi: [
          { se: ['96', 'novantasei'], msg: 'Alla linea va prima aggiunto 32: il vettore è 38.' },
          { se: ['38', 'trentotto'], msg: 'Trentotto è il vettore. La distanza in byte si ottiene moltiplicandolo per 16.' },
          { se: ['304'], msg: 'Le voci occupano 16 byte, il doppio di 8.' }
        ],
        altro: 'Il numero è diverso. Si ricavi prima il vettore, poi si moltiplichi per 16.',
        indizi: ['Vettore: 32 + 6.', 'Ogni voce occupa 16 byte.', '38 × 16.'],
        svolgimento: ['Vettore: 32 + 6 = 38.', 'Voce: 38 × 16.', 'Distanza: 608 byte.'] },
      { d: 'Una linea sensibile al livello è ancora attiva quando il gestore manda EOI. Che cosa fa il controller?', guida: 'Si scelga la risposta.', o: [
        { t: 'Consegna di nuovo la stessa richiesta', ok: true, fb: 'Tornato libero, il controller vede la linea attiva e la tratta come una richiesta da servire.' },
        { t: 'Spegne la linea', fb: 'La linea è comandata dalla periferica. Il controller può soltanto osservarla.' },
        { t: 'Attende che il gestore finisca', fb: 'Con EOI il gestore ha dichiarato finito il servizio. Per il controller la richiesta successiva può partire.' }] },
      { d: 'Un gestore toglie la causa nella periferica e dimentica di mandare EOI. Qual è la conseguenza?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il controller trattiene le richieste di priorità pari o inferiore', ok: true, fb: 'Per il controller il servizio è ancora in corso, e le richieste meno urgenti restano pendenti.' },
        { t: 'La stessa richiesta viene consegnata due volte', fb: 'La doppia consegna avviene quando EOI arriva con la linea ancora attiva. Qui EOI non arriva affatto.' },
        { t: 'Nessuna, perché la linea è già a riposo', fb: 'La periferica è a posto. Il controller, invece, attende ancora la conferma.' }] }
    ],
    sfida: ['cslez4_3_03_io_interrupts_03', 'Consegna e riconoscimento di un interrupt']
  }
});
