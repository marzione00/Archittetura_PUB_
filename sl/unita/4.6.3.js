'use strict';
SL.unita463 = (() => {
  // stato della flash dopo «scritte» scritture sulla pagina logica idx: mappa, pagine fisiche
  const stato = (p, scritte) => {
    const idx = p.l, pag = [{ v: 17, s: 'valida' }, { v: 34, s: 'valida' }, { v: null, s: 'libera' }, { v: null, s: 'libera' }], mappa = [0, 1];
    for (let k = 0; k < scritte; k++) { pag[mappa[idx]].s = 'invalida'; pag[2 + k] = { v: p.v + k, s: 'valida' }; mappa[idx] = 2 + k; }
    return { pag, mappa };
  };
  // o: { x, y, wm, wp, h, attM, attP: indice da evidenziare, prog: pagina programmata ma non ancora in mappa }
  const quadro = (pre, p, scritte, o) => {
    const el = SL.el, S = stato(p, scritte), els = [], xp = o.x + o.wm + (o.gapM || 40);
    els.push(el.nota(pre + 't0', o.x, o.y, o.gapM ? 'MAPPA' : 'MAPPA DEL CONTROLLER', 'mono'), el.nota(pre + 't1', xp, o.y, 'BLOCCO FLASH · quattro pagine', 'mono'));
    [0, 1].forEach((k) => els.push(el.box(pre + 'm' + k, o.x, o.y + 24 + k * (o.h + 12), o.wm, o.h, 'pagina logica L' + k, '→ P' + S.mappa[k], o.attM === k ? 'att' : 'on', { cls: 'stretta' })));
    S.pag.forEach((g, k) => { const prog = o.prog === k; els.push(el.box(pre + 'p' + k, xp + k * (o.wp + 10), o.y + 24, o.wp, 2 * o.h + 12, 'P' + k + ' ' + (prog ? 'scritta' : g.s), prog ? String(o.progV) : g.v == null ? '·' : String(g.v), prog || o.attP === k ? 'att' : g.s === 'valida' ? 'on' : g.s === 'invalida' ? 'err' : '', { cls: 'stretta' })); });
    return els;
  };
  return { stato, quadro };
})();
SL.registra('4.6.3', {
  titolo: 'Memoria flash e traduzione',
  obiettivo: 'Obiettivo: spiegare per quale ragione un’unità a stato solido scrive ogni aggiornamento in una pagina nuova, e in quale modo una mappa registra la posizione di ogni dato.',
  concetti: [['ssd', 'Nessuna parte in movimento'], ['tabella', 'Una mappa da logico a fisico'], ['memory', 'La scrittura in un’altra pagina']],
  filigrana: ['ssd', 'tabella', 'memory'],
  richiami: {
    carte: [
      { sim: 'disco', da: 'Dall’unità 4.5.2', t: 'Il blocco logico', d: 'Il software che impiega un disco indica un numero, e ignora la posizione fisica del dato.' },
      { sim: 'dispositivo', da: 'Dall’unità 4.3.1', t: 'Il controller', d: 'Il circuito che comanda il dispositivo.' },
      { sim: 'disco', da: 'Dall’unità 4.5.1', t: 'Seek e rotazione', d: 'I ritardi meccanici del disco magnetico.' }
    ],
    domanda: { d: 'Prima di proseguire: da che cosa dipendono i ritardi maggiori di un disco magnetico?', o: [
      { t: 'Dal movimento del braccio e dalla rotazione', ok: true, fb: 'Si tratta di movimenti meccanici, che si misurano in millisecondi.' },
      { t: 'Dalla velocità del bus', fb: 'Il bus è molto più rapido della meccanica del disco.' },
      { t: 'Dal calcolo della parità', fb: 'La parità riguarda il RAID. Un disco singolo attende braccio e rotazione.' }
    ] }
  },
  idea: {
    titolo: 'Una memoria priva di correzione sul posto',
    termini: ['unità a stato solido', 'memoria flash', 'pagina flash', 'blocco flash', 'ftl', 'aggiornamento fuori posto'],
    testo: [
      'Una [[unità a stato solido]], abbreviata SSD, svolge la funzione di un disco senza parti in movimento. I dati risiedono in una [[memoria flash]]: celle elettroniche che trattengono una carica, e con essa un bit, anche a macchina spenta. Seek e rotazione sono assenti, e una lettura richiede decine di microsecondi. La flash è tuttavia soggetta a un vincolo, dal quale discende l’intera organizzazione dell’unità.',
      'Le celle sono riunite in pagine, e le pagine in blocchi. Una [[pagina flash]] può essere programmata, cioè scritta, soltanto se è stata cancellata. La cancellazione agisce tuttavia su un intero [[blocco flash]], cioè su decine di pagine insieme, ed è lenta. La correzione di un dato sul posto comporterebbe la cancellazione del blocco, e con esso di tutte le pagine adiacenti, che andrebbero prima copiate altrove.',
      'Il controller dell’unità supera il vincolo con un [[aggiornamento fuori posto]]. Esso scrive il nuovo valore in una pagina libera, già cancellata, e lascia invariata la pagina precedente. Per ritrovare i dati mantiene una mappa: per ogni pagina logica, quella richiesta dal computer, la pagina fisica che ne contiene la versione corrente. La parte del controller che gestisce la mappa prende il nome di [[ftl|FTL]], dall’inglese «flash translation layer».',
      { fig: 'scena', w: 720, h: 176, titolo: 'Dopo la scrittura di 99 nella pagina logica L0', nota: 'P0 contiene ancora il valore precedente, 17. Nessuna voce della mappa la indica, ed è pertanto una pagina invalida.', els: SL.unita463.quadro('g', { l: 0, v: 99 }, 1, { x: 10, y: 0, wm: 160, wp: 120, gapM: 20, h: 54, attM: 0, attP: 2 }) },
      'Dopo l’aggiornamento la mappa indica la pagina nuova, e la precedente diviene invalida: contiene una versione superata, che non sarà più letta. Il suo spazio tornerà disponibile soltanto con la cancellazione dell’intero blocco. Dall’esterno il cambiamento è invisibile: il computer continua a richiedere la pagina logica L0, e riceve il valore più recente.'
    ]
  },
  esperimento: {
    faremo: [
      'Un blocco flash ha quattro pagine: due contengono dati, due sono libere. I controlli fissano la pagina logica da aggiornare, il nuovo valore e il numero di aggiornamenti, uno oppure due.',
      'L’esperimento segue la scrittura passo per passo: la programmazione della pagina libera, la modifica della mappa, l’invalidazione della pagina precedente. Con due aggiornamenti, è istruttivo contare le pagine libere che restano al termine.'
    ],
    vedrai: [
      ['tabella', 'La mappa', 'A sinistra: per ogni pagina logica, la pagina fisica che ne contiene il valore corrente.'],
      ['ssd', 'Il blocco flash', 'A destra: le quattro pagine fisiche, con il loro stato e il loro contenuto.']
    ]
  },
  lab: {
    titolo: 'Un aggiornamento fuori posto',
    scena: { w: 860, h: 176 },
    atti: ['La mappa', 'La scrittura', 'La lettura', 'Il blocco si riempie'],
    controlli: [
      { id: 'l', tipo: 'scelta', eti: 'Pagina logica', opzioni: [[0, 'L0'], [1, 'L1']], valore: 0 },
      { id: 'v', tipo: 'scelta', eti: 'Nuovo valore', opzioni: [[99, '99'], [7, '7'], [200, '200']], valore: 99 },
      { id: 'n', tipo: 'scelta', eti: 'Aggiornamenti', opzioni: [[1, 'uno'], [2, 'due consecutivi']], valore: 1 }
    ],
    nota: 'I passi sono sei, otto con due aggiornamenti. Il secondo aggiornamento scrive il valore successivo.',
    previsione: {
      domanda: (p) => 'La pagina logica L' + p.l + ' si trova nella pagina fisica P' + p.l + '. Il computer la aggiorna ' + (p.n === 1 ? 'una volta' : 'due volte consecutive') + '. Le pagine P2 e P3 sono libere. Da quale pagina fisica verrà letta L' + p.l + ' alla fine?',
      opzioni: (p) => [['P' + p.l, 'P' + p.l + ', la medesima di prima'], ['P2', 'P2'], ['P3', 'P3']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. La mappa indica ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 'P' + p.l ? 'Una pagina flash già scritta può essere riprogrammata soltanto dopo la cancellazione dell’intero blocco.' : p.n === 2 ? 'Ogni aggiornamento occupa una pagina libera: il primo impiega P2, il secondo P3.' : 'L’aggiornamento è uno solo, e impiega la prima pagina libera, P2.'),
    costruisci(p) {
      const U = SL.unita463, passi = [], idx = p.l, vecchio = [17, 34][idx], O = { x: 20, y: 0, wm: 200, wp: 140, h: 54 };
      const hud = (scritte, letta) => { const S = U.stato(p, scritte); return [['L' + idx, '→ P' + S.mappa[idx], 'a'], ['Invalide', String(S.pag.filter((g) => g.s === 'invalida').length)], ['Libere', String(S.pag.filter((g) => g.s === 'libera').length - (letta === 'prog' ? 1 : 0)), 'c']]; };
      const P = (scritte, o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(scritte, o.prog != null ? 'prog' : ''), els: U.quadro('q', p, scritte, Object.assign({}, O, o)) }, extra));

      P(0, { attM: idx, attP: idx }, 0, 'La mappa iniziale', 'La mappa collega L0 a P0, che contiene 17, e L1 a P1, che contiene 34. Le pagine P2 e P3 sono libere: sono state cancellate e non ancora programmate.', {});
      P(0, { attM: idx }, 1, 'La richiesta', 'Il computer richiede la scrittura di ' + p.v + ' nella pagina logica L' + idx + ', che ora vale ' + vecchio + '. Il computer ignora l’esistenza di P' + idx + ', e conosce soltanto il numero logico.', { chiedi: { d: 'Il controller può scrivere ' + p.v + ' direttamente in P' + idx + ', in sostituzione del valore precedente?', o: ['Sì, immediatamente', 'No, dovrebbe prima cancellare l’intero blocco'], g: 1, no: 'Una pagina flash si programma soltanto dopo la cancellazione, che riguarda l’intero blocco e distruggerebbe anche le altre pagine.' } });
      P(0, { prog: 2, progV: p.v, attM: idx }, 1, 'La programmazione', 'Il controller seleziona la prima pagina libera, P2, e vi programma il valore ' + p.v + '. La mappa indica ancora P' + idx + ': fino a questo istante una lettura di L' + idx + ' restituirebbe ' + vecchio + '.', { calc: 'P2 ← ' + p.v });
      P(1, { attM: idx, attP: 2 }, 1, 'La mappa cambia', 'A programmazione completata il controller aggiorna la mappa: L' + idx + ' indica ora P2. Nessuna voce indica più P' + idx + ', che diviene invalida. I suoi bit sono ancora presenti, e appartengono a una versione superata.', { calc: 'L' + idx + ' → P2 · P' + idx + ' invalida' });
      P(1, { attM: idx, attP: 2 }, 2, 'La lettura', 'Il computer legge L' + idx + '. Il controller consulta la mappa, trova P2 e restituisce ' + p.v + '. Lo spostamento è invisibile all’esterno.', Object.assign({ calc: 'L' + idx + ' → P2 → ' + p.v }, p.n === 1 ? { esito: ['L' + idx + ' in P2', ''] } : {}));
      if (p.n === 2) {
        P(1, { prog: 3, progV: p.v + 1, attM: idx }, 3, 'Il secondo aggiornamento', 'Il computer scrive in L' + idx + ' il valore ' + (p.v + 1) + '. La regola è la medesima: P2 è già stata programmata, e il controller impiega l’ultima pagina libera, P3.', { calc: 'P3 ← ' + (p.v + 1) });
        P(2, { attM: idx, attP: 3 }, 3, 'La mappa cambia ancora', 'La mappa collega L' + idx + ' a P3, e anche P2 diviene invalida. Per un solo dato logico il blocco contiene ora tre versioni, di cui due superate.', { calc: 'L' + idx + ' → P3 · P2 invalida', esito: ['L' + idx + ' in P3', ''] });
      }
      const fin = p.n, S = U.stato(p, fin);
      P(fin, { attP: S.mappa[idx] }, 3, 'Lo stato del blocco', (fin === 1 ? 'Nel blocco restano una pagina libera, P3, e una pagina invalida, P' + idx + '.' : 'Nel blocco restano due pagine invalide e nessuna pagina libera.') + ' Lo spazio delle pagine invalide tornerà utilizzabile soltanto con la cancellazione dell’intero blocco, preceduta dalla copia delle pagine ancora valide. Tale recupero è oggetto dell’unità successiva.', { esito: ['L' + idx + ' in P' + S.mappa[idx], ''] });
      return { passi, esito: 'P' + S.mappa[idx] };
    }
  },
  bilancio: {
    regola: [
      'Una pagina flash si programma soltanto dopo la cancellazione, e la cancellazione riguarda un blocco intero.',
      'Ogni aggiornamento è scritto in una pagina libera. La mappa passa alla pagina nuova, e la precedente diviene invalida.'
    ],
    errori: [
      ['Ritenere che la pagina logica e la pagina fisica coincidano.', 'La mappa le distingue: il medesimo dato logico cambia pagina fisica a ogni aggiornamento.'],
      ['Considerare libera una pagina invalida.', 'Essa contiene dati superati, e resta inutilizzabile fino alla cancellazione del blocco.'],
      ['Aggiornare la mappa prima di programmare la pagina.', 'Se la scrittura si interrompesse, la mappa indicherebbe una pagina priva del dato.']
    ],
    saFare: ['Spiegare per quale ragione la flash esclude la correzione sul posto.', 'Seguire la mappa dopo un aggiornamento.', 'Contare pagine valide, invalide e libere.'],
    esercizi: [
      { d: 'Una pagina logica si trova nella pagina fisica P0. È aggiornata tre volte, e il controller impiega le pagine libere P4, P5 e P6, in quest’ordine. In quale pagina fisica si trova alla fine il valore corrente?', segnaposto: 'Una pagina', giuste: ['p6', '6'],
        ok: 'Ogni aggiornamento impiega una pagina nuova: P4, poi P5, poi P6.',
        diagnosi: [
          { se: ['p0', '0'], msg: 'La flash esclude le correzioni sul posto, e ogni aggiornamento è scritto in una pagina libera.' },
          { se: ['p4', '4'], msg: 'P4 riceve il primo aggiornamento. Ne seguono altri due.' },
          { se: ['p5', '5'], msg: 'P5 riceve il secondo aggiornamento, seguito da un terzo.' }
        ],
        altro: 'La pagina è diversa. Si assegni una pagina libera a ciascun aggiornamento, nell’ordine indicato.',
        indizi: ['Il primo aggiornamento va in P4.', 'Il secondo in P5.', 'Il terzo in P6.'],
        svolgimento: ['Primo aggiornamento: P4.', 'Secondo: P5.', 'Terzo: P6, che contiene il valore corrente.'] },
      { d: 'Nella medesima situazione, dopo i tre aggiornamenti, quante pagine fisiche contengono versioni superate di quel dato?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Sono invalide P0, P4 e P5. Soltanto P6 è valida.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Anche la pagina di partenza, P0, contiene una versione superata.' },
          { se: ['4', 'quattro'], msg: 'L’ultima pagina scritta, P6, contiene la versione corrente.' },
          { se: ['1', 'uno'], msg: 'Ogni aggiornamento rende invalida la pagina precedente, e gli aggiornamenti sono tre.' }
        ],
        altro: 'Il numero è diverso. Si elenchino le pagine che hanno contenuto il dato e si escluda l’ultima.',
        indizi: ['Il dato ha occupato P0, P4, P5 e P6.', 'Soltanto l’ultima è valida.', 'Le altre sono tre.'],
        svolgimento: ['Pagine usate: P0, P4, P5, P6.', 'Valida: P6.', 'Invalide: 3.'] },
      { d: 'Per quale ragione il controller di un’unità a stato solido evita di riscrivere un dato nella pagina fisica in cui si trova?', guida: 'Si scelga la risposta.', o: [
        { t: 'Una pagina si programma soltanto dopo la cancellazione, che riguarda un blocco intero', ok: true, fb: 'La cancellazione del blocco distruggerebbe anche le pagine adiacenti.' },
        { t: 'La mappa deve cambiare a ogni scrittura', fb: 'La mappa è una conseguenza. La causa è il modo in cui la flash si cancella.' },
        { t: 'Le pagine libere si leggono più rapidamente', fb: 'La velocità di lettura è la medesima per tutte le pagine.' }] }
    ]
  }
});
