'use strict';
SL.unita557 = (() => {
  const conferme = (p) => (p.posti === 2 ? 2 : p.conf === 'fuori' ? 2 : 1);
  // sequenze di passi: [chi, descrizione breve, effetto]
  const esegui = (p) => {
    let posti = p.posti, conf = 0; const visto = { A: null, B: null }, S = [{ posti, conf, va: null, vb: null, op: '', chi: '' }];
    const reg = (chi, op) => S.push({ posti, conf, va: visto.A, vb: visto.B, op, chi });
    if (p.conf === 'fuori') {
      visto.A = posti; reg('A', 'controlla');
      visto.B = posti; reg('B', 'controlla');
      if (visto.A > 0) { posti = Math.max(0, posti - 1); conf++; } reg('A', 'lock · prenota · unlock');
      if (visto.B > 0) { posti = Math.max(0, posti - 1); conf++; } reg('B', 'lock · prenota · unlock');
    } else if (p.conf === 'dentro') {
      visto.A = posti; reg('A', 'lock · controlla');
      if (visto.A > 0) { posti--; conf++; } reg('A', 'prenota · unlock');
      visto.B = posti; reg('B', 'lock · controlla');
      if (visto.B > 0) { posti--; conf++; reg('B', 'prenota · unlock'); } else reg('B', 'rinuncia · unlock');
    } else {
      visto.A = posti; if (posti > 0) { posti--; conf++; reg('A', 'confronta e scambia · riesce'); } else reg('A', 'confronta e scambia · fallisce');
      visto.B = posti; if (posti > 0) { posti--; conf++; reg('B', 'confronta e scambia · riesce'); } else reg('B', 'confronta e scambia · fallisce');
    }
    return S;
  };
  const scena = (pre, s, p, o) => {
    const el = SL.el, w3 = (o.w - 20) / 3;
    return [el.box(pre + 'a', o.x, o.y, w3, o.h, 'cliente A · ha visto', s.va == null ? '·' : s.va + (s.va === 1 ? ' posto libero' : ' posti liberi'), s.chi === 'A' ? 'att' : s.va == null ? '' : 'on', { cls: 'stretta' }),
      el.box(pre + 'c', o.x + w3 + 10, o.y, w3, o.h, 'posti liberi · cella comune', String(s.posti), /prenota|riesce/.test(s.op) ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'b', o.x + 2 * (w3 + 10), o.y, w3, o.h, 'cliente B · ha visto', s.vb == null ? '·' : s.vb + (s.vb === 1 ? ' posto libero' : ' posti liberi'), s.chi === 'B' ? 'att' : s.vb == null ? '' : 'on', { cls: 'stretta' }),
      el.box(pre + 'o', o.x, o.y + o.h + 12, 2 * w3 + 10, o.h, 'operazione', s.op ? s.chi + ' · ' + s.op : '·', s.op ? (/fallisce|rinuncia/.test(s.op) ? 'zero' : 'att') : '', { cls: 'stretta' }),
      el.box(pre + 'k', o.x + 2 * (w3 + 10), o.y + o.h + 12, w3, o.h, 'conferme inviate', String(s.conf), s.conf > p.posti ? 'err' : 'on', { cls: 'stretta' })];
  };
  return { conferme, esegui, scena };
})();
SL.registra('5.5.7', {
  titolo: 'Aggiornamenti condizionati e granularità dei lock',
  obiettivo: 'Obiettivo: riconoscere una decisione presa su un dato che può cambiare nel frattempo, e conoscerai i due modi di renderla sicura: il controllo sotto lock, e il confronto e scambio.',
  concetti: [['lente', 'Prima si controlla'], ['conflitto', 'Poi il dato cambia'], ['lucchetto', 'Controllo e modifica in un gesto']],
  filigrana: ['conflitto', 'lucchetto', 'lente'],
  richiami: {
    carte: [
      { sim: 'lucchetto', da: 'Dall’unità 5.5.2', t: 'I confini della sezione critica', d: 'Vanno protette insieme tutte le operazioni che dipendono dallo stesso valore letto.' },
      { sim: 'conflitto', da: 'Dall’unità 5.5.1', t: 'L’operazione atomica', d: 'Una operazione indivisibile, che nessuno può osservare a metà.' },
      { sim: 'conflitto', da: 'Dall’unità 5.5.1', t: 'La corsa critica', d: 'Un risultato che dipende da chi arriva prima.' }
    ],
    domanda: { d: 'Prima di proseguire: un thread legge un dato fuori dal lock, e poi decide in base a quel valore, dentro il lock. Su che cosa si basa la decisione?', o: [
      { t: 'Su un valore che nel frattempo può essere cambiato', ok: true, fb: 'Fra la lettura e l’ingresso nel lock un altro thread può avere modificato il dato.' },
      { t: 'Sul valore corrente, garantito dal lock', fb: 'Il lock protegge ciò che avviene al suo interno. La lettura è avvenuta fuori.' },
      { t: 'Su un valore indefinito', fb: 'Il valore letto era corretto in quel momento. Può essere diventato vecchio.' }
    ] }
  },
  idea: {
    titolo: 'L’ultima poltrona',
    termini: ['controlla e poi agisci', 'confronto e scambio'],
    testo: [
      'Due clienti provano a prenotare l’ultima poltrona di un volo. Una cella contiene il numero di posti liberi, e vale 1. Il programma di ciascun cliente fa due cose: controlla che la cella sia maggiore di zero, e in caso positivo la decrementa e invia una conferma. È lo schema [[controlla e poi agisci]], e ha lo stesso punto debole dell’incremento: fra il controllo e l’azione può infilarsi l’altro.',
      'Supponiamo che il programma usi un lock, ma soltanto per la modifica. A controlla, e vede 1. B controlla, e vede 1. A prende il lock, porta la cella a 0, conferma. B prende il lock, e si ritiene ancora autorizzato dal proprio controllo: conferma anche lui. La cella è a 0, in buon ordine, e le conferme sono due per una poltrona. Qui il dato finale è corretto, e l’errore si legge nel numero di conferme.',
      { fig: 'scena', w: 720, h: 138, titolo: 'Due controlli fuori dal lock', nota: 'A e B hanno visto entrambi un posto libero. Le conferme sono due, e la poltrona era una.', els: SL.unita557.scena('g', SL.unita557.esegui({ conf: 'fuori', posti: 1 })[4], { posti: 1 }, { x: 10, y: 0, w: 700, h: 54 }) },
      'Il primo rimedio è quello dell’unità 5.5.2: il controllo deve stare dentro la sezione critica. Chi controlla tiene il lock fino alla registrazione. B entra dopo l’uscita di A, vede 0, e rinuncia. Quanto debba essere esteso un lock, cioè la sua granularità, è una scelta di progetto: un lock per tutto il sistema di prenotazione è semplice e fa aspettare tutti, un lock per ogni volo lascia lavorare insieme chi prenota voli diversi.',
      'Il secondo rimedio fa a meno del lock. I processori offrono una istruzione atomica chiamata [[confronto e scambio]], in inglese «compare-exchange». Le si indicano una cella, il valore che ci si aspetta di trovarvi, e il valore nuovo. In un solo gesto indivisibile confronta la cella con il valore atteso e, soltanto se coincidono, scrive il nuovo. Altrimenti lascia tutto com’è, e riferisce il valore trovato. A chiede: «se vale 1, metti 0». Riesce. B chiede la stessa cosa, trova 0, e fallisce: sa che il posto è stato preso.'
    ]
  },
  esperimento: {
    faremo: [
      'A e B vogliono prenotare un posto. Sceglierai quanti posti sono liberi, e come il programma lega il controllo alla modifica: controllo fuori dal lock, controllo dentro il lock, oppure confronto e scambio.',
      'Seguiremo ciò che ciascun cliente ha visto, la cella dei posti e il numero di conferme. Con un solo posto, conta le conferme nei tre casi.'
    ],
    vedrai: [
      ['lente', 'Ciò che i clienti hanno visto', 'Ai lati: il numero di posti che A e B hanno trovato al momento del controllo.'],
      ['memory', 'La cella e le conferme', 'Al centro i posti liberi. In basso l’operazione in corso e le conferme inviate.']
    ]
  },
  lab: {
    titolo: 'Una poltrona, due clienti',
    scena: { w: 860, h: 140 },
    atti: ['L’inizio', 'Le operazioni', 'Il conto'],
    controlli: [
      { id: 'conf', tipo: 'scelta', eti: 'Il programma', opzioni: [['fuori', 'controlla fuori dal lock, modifica dentro'], ['dentro', 'controlla e modifica dentro il lock'], ['cas', 'usa il confronto e scambio']], valore: 'fuori' },
      { id: 'posti', tipo: 'scelta', eti: 'Posti liberi', opzioni: [[1, '1'], [2, '2']], valore: 1 }
    ],
    nota: 'Il numero dei passi dipende dal programma. Ogni sequenza è la più sfavorevole fra quelle possibili.',
    previsione: {
      domanda: (p) => (p.posti === 1 ? 'Resta 1 posto libero' : 'Restano 2 posti liberi') + ', e due clienti provano a prenotare nello stesso momento. Il programma ' + (p.conf === 'fuori' ? 'controlla la disponibilità fuori dal lock, e poi modifica dentro il lock' : p.conf === 'dentro' ? 'controlla e modifica tenendo il lock per tutto il tempo' : 'usa una operazione di confronto e scambio') + '. Nel caso peggiore, quante conferme vengono inviate?',
      opzioni: () => [0, 1, 2].map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Le conferme inviate sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.posti === 2 ? 'I posti erano due, e ciascun cliente ne ha ottenuto uno legittimamente.' : p.conf === 'fuori' ? 'Entrambi hanno controllato prima che l’altro modificasse, ed entrambi si sono ritenuti autorizzati.' : 'Controllo e modifica sono legati: il secondo cliente trova il posto già preso.'),
    costruisci(p) {
      const U = SL.unita557, S = U.esegui(p), passi = [], n = U.conferme(p), troppe = n > p.posti;
      const P = (k, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Posti liberi', String(S[k].posti), 'a'], ['Visti', (S[k].va == null ? '·' : S[k].va) + ' e ' + (S[k].vb == null ? '·' : S[k].vb)], ['Conferme', String(S[k].conf), 'c']], els: U.scena('q', S[k], p, { x: 20, y: 0, w: 820, h: 56 }) }, extra));
      const D = (s, prec) => { const v = s.chi === 'A' ? s.va : s.vb; return /confronta/.test(s.op) ? s.chi + ' chiede: se la cella vale ' + (p.posti === 2 && s.chi === 'B' ? prec.posti : v > 0 ? v : 1) + ', scrivi ' + (v > 0 ? v - 1 : 0) + '. La cella vale ' + v + '. ' + (/riesce/.test(s.op) ? 'Il confronto riesce, la cella viene aggiornata nello stesso gesto, e ' + s.chi + ' riceve la conferma.' : 'Il confronto fallisce, la cella resta com’è, e ' + s.chi + ' viene a sapere che il posto è già stato preso.') : /rinuncia/.test(s.op) ? 'B, dentro il lock, ha visto 0 posti: rinuncia, e rilascia il lock senza alcuna conferma.' : /controlla/.test(s.op) ? s.chi + (/lock/.test(s.op) ? ' acquisisce il lock e controlla la cella: ' : ' controlla la cella, senza lock: ') + (v === 1 ? '1 posto libero.' : v + ' posti liberi.') : s.chi + (/lock ·/.test(s.op) ? ' acquisisce il lock e, fidandosi del controllo fatto prima, prenota: ' : ', ancora dentro il lock, prenota: ') + 'la cella passa a ' + s.posti + ', e parte una conferma.' + (/unlock/.test(s.op) ? ' Poi rilascia il lock.' : ''); };

      P(0, 0, 'Due clienti insieme', (p.posti === 1 ? 'Resta 1 posto libero.' : 'Restano 2 posti liberi.') + ' A e B provano a prenotare nello stesso momento. Le conferme non devono superare i posti.', {});
      for (let k = 1; k < S.length; k++) { const s = S[k], extra = { calc: s.chi + ': ' + s.op };
        if (k === 2 && p.conf === 'fuori') extra.chiedi = { d: 'A ha controllato, ma non ha ancora modificato la cella. Che cosa vede B?', o: [p.posti + (p.posti === 1 ? ' posto libero' : ' posti liberi'), (p.posti - 1) + (p.posti - 1 === 1 ? ' posto libero' : ' posti liberi')], g: 0, no: 'La cella cambia soltanto con una modifica, e nessuno ha ancora modificato.' };
        P(k, 1, s.chi + ' · ' + s.op.split(' · ')[0], D(s, S[k - 1]), extra); }
      P(S.length - 1, 2, troppe ? 'Una conferma di troppo' : 'Le conferme tornano', troppe ? 'Le conferme inviate sono ' + n + ', e il posto era uno solo. La cella vale 0, e a guardare soltanto il dato sembra tutto in ordine. L’errore sta nella decisione di B, presa su un controllo ormai superato.' : 'Le conferme inviate sono ' + n + ', per ' + p.posti + (p.posti === 1 ? ' posto.' : ' posti.') + (p.posti === 2 ? ' C’era posto per entrambi, e nessuna intercalazione poteva creare un problema.' : p.conf === 'dentro' ? ' Il controllo è avvenuto dentro il lock, e B ha visto la cella già aggiornata da A.' : ' Il confronto e scambio ha legato controllo e modifica in una sola operazione atomica, senza alcun lock.'), { esito: [n + (n === 1 ? ' conferma' : ' conferme'), troppe ? 'no' : 'si'] });
      return { passi, esito: n };
    }
  },
  bilancio: {
    regola: [
      'Una decisione basata su un dato condiviso è sicura soltanto se il dato non può cambiare fra il controllo e l’azione.',
      'Si ottiene tenendo il lock dal controllo alla modifica, oppure con il confronto e scambio, che scrive il valore nuovo soltanto se la cella contiene ancora quello atteso.'
    ],
    errori: [
      ['Controllare fuori dal lock e modificare dentro.', 'Quando si entra nel lock, il risultato del controllo può essere superato.'],
      ['Verificare la correttezza guardando soltanto il dato finale.', 'Il dato può risultare giusto mentre le azioni compiute sono troppe.'],
      ['Ignorare il fallimento di un confronto e scambio.', 'Il fallimento dice che il dato è cambiato: bisogna rileggere e decidere di nuovo.']
    ],
    saFare: ['Riconoscere lo schema controlla e poi agisci.', 'Prevedere quante azioni vengono compiute nei diversi casi.', 'Descrivere che cosa fa il confronto e scambio.'],
    esercizi: [
      { d: 'Restano 3 posti. Cinque clienti controllano la disponibilità fuori dal lock, tutti prima di qualunque modifica, e poi ciascuno prenota dentro il lock senza ricontrollare. Quante conferme vengono inviate?', segnaposto: 'Un numero', giuste: ['5', 'cinque'],
        ok: 'Tutti e cinque hanno visto posti liberi, e tutti e cinque confermano.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Tre sarebbero le conferme corrette. Qui nessuno ricontrolla, e tutti si ritengono autorizzati.' },
          { se: ['2', 'due'], msg: 'Due sono le conferme di troppo. Quelle inviate sono cinque.' }
        ],
        altro: 'Il numero è diverso. Conta quanti clienti hanno visto un numero di posti maggiore di zero.',
        indizi: ['Tutti controllano prima di ogni modifica.', 'Tutti vedono 3 posti liberi.', 'Tutti confermano: 5.'],
        svolgimento: ['Controlli: 3, 3, 3, 3, 3.', 'Autorizzati: 5.', 'Conferme: 5, per 3 posti.'] },
      { d: 'Una cella vale 1. Il thread A esegue un confronto e scambio con valore atteso 1 e valore nuovo 0. Subito dopo, il thread B esegue la stessa operazione. Quanto vale la cella alla fine?', segnaposto: 'Un numero', giuste: ['0', 'zero'],
        ok: 'L’operazione di A riesce e scrive 0. Quella di B trova 0 al posto di 1, fallisce, e lascia la cella a 0.',
        diagnosi: [
          { se: ['1', 'uno'], msg: 'L’operazione di A trova 1, come atteso, e scrive 0.' },
          { se: ['-1', '−1'], msg: 'L’operazione di B fallisce, perché la cella contiene ormai 0, e lascia tutto com’è.' }
        ],
        altro: 'Il valore è diverso. Si applichino le due operazioni in ordine, confrontando ogni volta la cella con il valore atteso.',
        indizi: ['A: la cella vale 1, come atteso. Scrive 0.', 'B: la cella vale 0, diverso da 1. Fallisce.', 'La cella resta a 0.'],
        svolgimento: ['A: confronto riuscito, cella = 0.', 'B: confronto fallito, cella invariata.', 'Valore finale: 0.'] },
      { d: 'Un sistema di prenotazione usa un solo lock per tutti i voli. Lo si sostituisce con un lock per ciascun volo. Che cosa cambia?', guida: 'Si scelga la risposta.', o: [
        { t: 'Chi prenota voli diversi non deve più aspettarsi a vicenda', ok: true, fb: 'Una granularità più fine riduce le attese, al prezzo di più lock da gestire.' },
        { t: 'Le prenotazioni sullo stesso volo possono sovrapporsi', fb: 'Sullo stesso volo il lock è lo stesso, e la mutua esclusione resta.' },
        { t: 'Nulla: il numero dei lock è indifferente', fb: 'Con un solo lock tutti i clienti aspettano in un’unica fila.' }] }
    ],
    sfida: ['cslez5_5_05_semaphores', 'Errori di sincronizzazione']
  }
});
