'use strict';
SL.unita474 = (() => {
  const H = (v) => '0x' + v.toString(16).toUpperCase();
  const esito = (p) => (p.op === 'ptr' ? 'no' : p.op === 'ok' ? 34 : 17);
  // fase: 0 tre nomi · 1 la scrittura · 2 la sincronizzazione · 3 il descrittore · 4 la traduzione · 5 la lettura
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], w3 = (o.w - 20) / 3, cpu = 0x9000 + p.off, ram = 0x3000 + p.off, dma = 0x5000 + p.off, sinc = p.op !== 'cache', ok = p.op !== 'ptr', e = esito(p), nelDesc = ok ? dma : cpu;
    const B = (id, col, riga, et, txt, st) => els.push(el.box(pre + id, o.x + col * (w3 + 10), o.y + riga * (o.h + 14), w3, o.h, et, txt, st, { cls: 'stretta' }));
    B('a', 0, 0, 'il programma usa', H(cpu), f === 0 ? 'att' : 'on');
    B('b', 1, 0, 'cache del processore', f >= 1 ? '34' : '17', f === 1 ? 'att' : 'on');
    B('c', 2, 0, 'RAM · posizione ' + H(ram), f >= 2 && sinc ? '34' : '17', f === 2 ? (sinc ? 'att' : 'err') : f >= 5 && ok ? 'att' : 'on');
    B('d', 0, 1, 'descrittore · indirizzo', f >= 3 ? H(nelDesc) : '·', f === 3 ? 'att' : f > 3 ? (ok ? 'on' : 'err') : '');
    B('e', 1, 1, 'IOMMU · traduce in', f >= 4 ? (ok ? H(ram) : 'rifiutato') : '·', f === 4 ? (ok ? 'att' : 'err') : f > 4 ? (ok ? 'on' : 'err') : '');
    B('f', 2, 1, 'il dispositivo riceve', f >= 5 ? (e === 'no' ? 'nulla' : String(e)) : '·', f >= 5 ? (e === 34 ? 'att' : 'err') : '');
    return els;
  };
  return { H, esito, quadro };
})();
SL.registra('4.7.4', {
  titolo: 'Coerenza, ordinamento e indirizzi visibili al dispositivo',
  obiettivo: 'Alla fine saprai spiegare quali due condizioni servono perché un dispositivo legga con il DMA il dato giusto: l’indirizzo adatto a lui, e la memoria aggiornata.',
  concetti: [['puntatore', 'Ogni osservatore ha i suoi indirizzi'], ['cache', 'Il dato nuovo può essere altrove'], ['scudo', 'Un filtro sugli accessi del dispositivo']],
  filigrana: ['cache', 'puntatore', 'scudo'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 4.7.2', t: 'Il descrittore di trasferimento', d: 'Contiene l’indirizzo che il dispositivo presenterà sul bus.' },
      { sim: 'cache', da: 'Dall’unità 4.5.3', t: 'La cache', d: 'Una memoria più veloce che conserva una copia dei dati usati di recente.' },
      { sim: 'tabella', da: 'Dall’unità 4.4.1', t: 'La mappa degli indirizzi', d: 'Lo stesso componente si raggiunge soltanto con gli indirizzi che gli sono assegnati.' }
    ],
    domanda: { d: 'Prima di proseguire: di un dato esistono una copia nella cache e una nella memoria. Il processore modifica la copia nella cache. Che cosa contiene la memoria subito dopo?', o: [
      { t: 'Il valore vecchio', ok: true, fb: 'La memoria si aggiorna soltanto quando la copia modificata vi viene riportata.' },
      { t: 'Il valore nuovo', fb: 'La modifica è avvenuta nella cache. La memoria la riceverà più tardi.' },
      { t: 'Nessun valore', fb: 'La memoria conserva quello che aveva: il valore precedente.' }
    ] }
  },
  idea: {
    titolo: 'L’indirizzo giusto e il dato giusto',
    termini: ['indirizzo dma', 'iommu', 'sincronizzazione del buffer'],
    testo: [
      'Delegare un trasferimento a un dispositivo nasconde due trappole. La prima riguarda gli indirizzi. Un programma indica una cella con un proprio indirizzo, che il processore traduce nella posizione reale della cella dentro la RAM: di questa traduzione si occuperà il Modulo VI. Il dispositivo sta fuori dal processore, e quella traduzione non la conosce. Per lui esiste una terza numerazione, e il numero con cui può raggiungere la cella è l’[[indirizzo dma|indirizzo DMA]].',
      'A tradurre gli indirizzi presentati dai dispositivi è un circuito apposito, la [[iommu|IOMMU]]. Fa anche da filtro: a ogni dispositivo concede soltanto le zone di memoria che il sistema gli ha assegnato, e respinge ogni altro indirizzo. Nel modello la stessa cella ha tre nomi: il programma la chiama 0x900C, nella RAM si trova alla posizione 0x300C, e il dispositivo la raggiunge con 0x500C. Nel descrittore va scritto il terzo. Se il driver vi scrivesse l’indirizzo del programma, la IOMMU non lo riconoscerebbe.',
      { fig: 'scena', w: 720, h: 138, titolo: 'Una preparazione corretta', nota: 'Il driver ha riportato 34 nella RAM e ha scritto nel descrittore l’indirizzo DMA. La IOMMU lo traduce, e il dispositivo legge 34.', els: SL.unita474.quadro('g', { off: 12, op: 'ok' }, 5, { x: 10, y: 0, w: 700, h: 54 }) },
      'La seconda trappola riguarda il contenuto. Il processore lavora attraverso la sua cache. Quando scrive nel buffer, il valore nuovo può restare per un po’ nella cache, mentre la RAM conserva quello vecchio. Il dispositivo legge direttamente la RAM, e troverebbe il valore vecchio. Prima di cedere il buffer, il driver deve quindi far riportare nella RAM le modifiche: è la [[sincronizzazione del buffer]].',
      'Le due condizioni sono indipendenti, e servono entrambe. Con l’indirizzo giusto e senza sincronizzazione, il dispositivo raggiunge la cella e legge un dato superato. Con la sincronizzazione e l’indirizzo sbagliato, il dato giusto è nella RAM e il dispositivo non arriva a leggerlo.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processore cambia un byte del buffer da 17 a 34, e poi il driver chiede a un dispositivo di leggerlo con il DMA. Sceglierai lo scostamento del byte e come il driver prepara la richiesta.',
      'Seguiremo il valore dalla cache alla RAM e l’indirizzo dal descrittore alla IOMMU. Confronta le tre preparazioni: una è corretta, e ciascuna delle altre due sbaglia una cosa sola.'
    ],
    vedrai: [
      ['cache', 'Il dato', 'In alto: l’indirizzo usato dal programma, il valore nella cache e il valore nella RAM.'],
      ['scudo', 'L’accesso del dispositivo', 'In basso: l’indirizzo nel descrittore, la risposta della IOMMU e il byte ricevuto.']
    ]
  },
  lab: {
    titolo: 'Che cosa legge il dispositivo',
    scena: { w: 860, h: 140 },
    atti: ['Gli indirizzi', 'Il dato', 'La richiesta', 'La lettura'],
    controlli: [
      { id: 'off', tipo: 'scelta', eti: 'Scostamento', opzioni: [[0, '0'], [12, '12'], [40, '40']], valore: 12 },
      { id: 'op', tipo: 'scelta', eti: 'Il driver', opzioni: [['ok', 'sincronizza e usa l’indirizzo DMA'], ['cache', 'usa l’indirizzo DMA, senza sincronizzare'], ['ptr', 'sincronizza, e usa l’indirizzo del programma']], valore: 'ok' }
    ],
    nota: 'I passi sono sempre sei. La pagina del buffer è vista dal programma a 0x9000, sta nella RAM a 0x3000 e ha indirizzo DMA 0x5000.',
    previsione: {
      domanda: (p) => 'Il processore ha cambiato un byte del buffer da 17 a 34. Il driver ' + (p.op === 'ok' ? 'sincronizza il buffer e scrive nel descrittore l’indirizzo DMA' : p.op === 'cache' ? 'scrive nel descrittore l’indirizzo DMA, senza sincronizzare il buffer' : 'sincronizza il buffer e scrive nel descrittore l’indirizzo usato dal programma') + '. Che cosa riceve il dispositivo?',
      opzioni: () => [[34, 'Il valore nuovo, 34'], [17, 'Il valore vecchio, 17'], ['no', 'Nulla: l’accesso viene respinto']]
    },
    confronto: (pred, esito) => { const N = { 34: 'il valore nuovo', 17: 'il valore vecchio', no: 'un accesso respinto' }; return 'Avevi previsto ' + N[pred] + '. L’esito è ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 17 ? 'Senza sincronizzazione il 34 resta nella cache, e la RAM contiene ancora 17.' : esito === 'no' ? 'L’indirizzo del programma non è fra quelli che la IOMMU concede al dispositivo.' : 'RAM aggiornata e indirizzo DMA: le due condizioni sono rispettate.'); },
    costruisci(p) {
      const U = SL.unita474, H = U.H, passi = [], cpu = 0x9000 + p.off, ram = 0x3000 + p.off, dma = 0x5000 + p.off, sinc = p.op !== 'cache', ok = p.op !== 'ptr', e = U.esito(p);
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, h: 56 });
      const hud = (f) => [['Nella RAM', f >= 2 && sinc ? '34' : '17', 'a'], ['Nel descrittore', f >= 3 ? H(ok ? dma : cpu) : '·'], ['Riceve', f >= 5 ? (e === 'no' ? 'nulla' : String(e)) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Tre nomi per una cella', 'Il byte ha scostamento ' + p.off + ', cioè ' + H(p.off) + ', dentro la pagina del buffer. Il programma lo indica con ' + H(cpu) + '. Nella RAM occupa la posizione ' + H(ram) + '. Al dispositivo il sistema ha assegnato, per la stessa pagina, l’indirizzo DMA ' + H(dma) + '.', { calc: H(cpu) + ' · ' + H(ram) + ' · ' + H(dma) });
      P(1, 1, 'La scrittura del processore', 'Il programma scrive 34 nel byte, che valeva 17. La scrittura arriva nella cache del processore. Nella RAM, per ora, c’è ancora 17.', { calc: 'cache 34 · RAM 17' });
      P(2, 1, sinc ? 'La sincronizzazione' : 'La sincronizzazione mancata', sinc ? 'Prima di cedere il buffer, il driver fa riportare nella RAM le modifiche rimaste nella cache. Ora anche la RAM contiene 34.' : 'Il driver passa oltre senza sincronizzare il buffer. La cache contiene 34, la RAM contiene ancora 17, e nessuno dei due lo segnala.', { calc: sinc ? 'cache 34 · RAM 34' : 'cache 34 · RAM 17', chiedi: { d: 'Da dove leggerà il dispositivo?', o: ['Dalla cache del processore', 'Dalla RAM'], g: 1, no: 'La cache è interna al processore. Il dispositivo accede alla RAM attraverso il bus.' } });
      P(3, 2, 'Il descrittore', ok ? 'Il driver scrive nel descrittore l’indirizzo DMA del byte, ' + H(dma) + ', e pubblica la richiesta.' : 'Il driver scrive nel descrittore lo stesso indirizzo che usa il programma, ' + H(cpu) + ', e pubblica la richiesta. Per il processore quell’indirizzo è valido.', { calc: 'descrittore: ' + H(ok ? dma : cpu) });
      P(4, 3, ok ? 'La traduzione' : 'Il rifiuto', ok ? 'Il dispositivo presenta ' + H(dma) + '. La IOMMU lo trova fra gli indirizzi assegnati a quel dispositivo, e lo traduce nella posizione ' + H(ram) + ' della RAM.' : 'Il dispositivo presenta ' + H(cpu) + '. La IOMMU cerca fra gli indirizzi assegnati a quel dispositivo, e trova soltanto la pagina 0x5000. L’accesso viene respinto prima di toccare la memoria.', { calc: ok ? H(dma) + ' → ' + H(ram) : H(cpu) + ' → nessuna traduzione' });
      P(5, 3, e === 34 ? 'La lettura' : e === 17 ? 'Un dato superato' : 'Nessun dato', e === 34 ? 'Il dispositivo legge la posizione ' + H(ram) + ' e riceve 34, il valore scritto dal programma.' : e === 17 ? 'Il dispositivo legge la posizione ' + H(ram) + ' e riceve 17. L’indirizzo era giusto e la RAM era rimasta indietro: il valore nuovo è ancora nella cache.' : 'Il dispositivo non riceve alcun byte. La RAM conteneva il 34 giusto, ma l’indirizzo fornito non era fra quelli che il dispositivo può usare.', { calc: e === 'no' ? 'trasferimento fallito' : 'byte ricevuto: ' + e, esito: [e === 'no' ? 'accesso respinto' : 'riceve ' + e, e === 34 ? 'si' : 'no'] });
      return { passi, esito: e };
    }
  },
  bilancio: {
    regola: [
      'Nel descrittore va l’indirizzo DMA, il solo che la IOMMU traduce per quel dispositivo.',
      'Prima di cedere un buffer modificato, il driver lo sincronizza, in modo che la RAM contenga i valori nuovi.'
    ],
    errori: [
      ['Passare al dispositivo l’indirizzo usato dal programma.', 'Quell’indirizzo vale per il processore. La IOMMU lo respinge.'],
      ['Saltare la sincronizzazione perché l’indirizzo è giusto.', 'Il dispositivo raggiunge la cella e vi trova il valore vecchio.'],
      ['Considerare le due condizioni la stessa cosa.', 'Una riguarda dove leggere, l’altra che cosa si trova in quel punto.']
    ],
    saFare: ['Distinguo i tre indirizzi di una stessa cella.', 'Spiego il ruolo della IOMMU.', 'Riconosco l’effetto di una sincronizzazione mancata.'],
    esercizi: [
      { d: 'La pagina di un buffer è vista dal programma a 0x9000, si trova nella RAM a 0x3000 e ha indirizzo DMA 0x5000. Quale indirizzo va scritto nel descrittore per il byte di scostamento 0x2C?', segnaposto: 'Un indirizzo', giuste: ['502c', '0x502c', '502ch'],
        ok: 'Al dispositivo va l’indirizzo DMA: 0x5000 + 0x2C = 0x502C.',
        diagnosi: [
          { se: ['902c', '0x902c'], msg: 'Questo è l’indirizzo usato dal programma. La IOMMU non lo concede al dispositivo.' },
          { se: ['302c', '0x302c'], msg: 'Questa è la posizione nella RAM. Il dispositivo deve presentare l’indirizzo DMA, che la IOMMU traduce.' },
          { se: ['5000', '0x5000'], msg: 'Questo è l’inizio della pagina. Va aggiunto lo scostamento 0x2C.' }
        ],
        altro: 'L’indirizzo è un altro. Parti dall’indirizzo DMA della pagina e aggiungi lo scostamento.',
        indizi: ['Il dispositivo usa l’indirizzo DMA.', 'La pagina ha indirizzo DMA 0x5000.', '0x5000 + 0x2C = 0x502C.'],
        svolgimento: ['Numerazione giusta: indirizzo DMA.', 'Base: 0x5000.', 'Indirizzo: 0x502C.'] },
      { d: 'Il driver scrive nel descrittore l’indirizzo DMA corretto, ma cede il buffer senza sincronizzarlo. Il processore vi aveva appena cambiato un byte da 17 a 34. Che cosa legge il dispositivo?', guida: 'Scegli la risposta.', o: [
        { t: '17, il valore ancora presente nella RAM', ok: true, fb: 'Il 34 è rimasto nella cache del processore, che il dispositivo non vede.' },
        { t: '34, il valore più recente', fb: 'Il valore recente si trova nella cache. Il dispositivo legge la RAM.' },
        { t: 'Nulla: la IOMMU respinge l’accesso', fb: 'L’indirizzo è corretto, e la IOMMU lo traduce. Sbagliato è il contenuto.' }] },
      { d: 'Qual è il compito della IOMMU?', guida: 'Scegli la risposta.', o: [
        { t: 'Tradurre gli indirizzi presentati dai dispositivi, concedendo a ciascuno soltanto la memoria assegnata', ok: true, fb: 'È insieme un traduttore e un filtro.' },
        { t: 'Riportare nella RAM le modifiche rimaste nella cache', fb: 'Questo è il compito della sincronizzazione, svolto dal driver.' },
        { t: 'Decidere quale dispositivo ottiene il bus', fb: 'Questo è il compito dell’arbitro.' }] }
    ]
  }
});
