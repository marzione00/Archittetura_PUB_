'use strict';
SL.unita674 = (() => {
  // minuto, account, oggetto, operazione, decisione
  const REG = [[2, 'ada', 'tesi', 'lettura', 'concessa'], [4, 'leo', 'tesi', 'modifica', 'negata'], [6, 'ada', 'tesi', 'modifica', 'concessa'], [8, 'ada', 'dati', 'lettura', 'negata'], [9, 'leo', 'tesi', 'lettura', 'concessa']];
  const COL = ['minuto', 'account', 'oggetto', 'operazione', 'decisione'];
  // quanti criteri sono applicati: 0 nessuno, 1 periodo, 2 anche account, 3 anche oggetto
  const tiene = (r, p, n) => (n < 1 || r[0] <= p.t) && (n < 2 || r[1] === p.acc) && (n < 3 || r[2] === p.ogg);
  const righe = (p, n) => REG.filter((r) => tiene(r, p, n));
  const conta = (l) => ({ c: l.filter((r) => r[4] === 'concessa').length, n: l.filter((r) => r[4] === 'negata').length });
  const coppia = (k) => k.c + ' ' + (k.c === 1 ? 'concessa' : 'concesse') + ' e ' + k.n + ' ' + (k.n === 1 ? 'negata' : 'negate');
  const chiave = (k) => k.c + '-' + k.n;
  // f: 0 registro · 1 periodo · 2 account · 3 oggetto · 4 conto
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], n = Math.min(f, 3), wc = (o.w - 4 * 6) / 5, w4 = (o.w - 30) / 4, sel = righe(p, 3), k = conta(sel);
    els.push(el.nota(pre + 't', o.x, o.y, 'IL REGISTRO · una riga per ogni richiesta ricevuta', 'mono', f === 0 ? 'att' : ''));
    REG.forEach((r, i) => { const dentro = tiene(r, p, n), cade = f >= 1 && f <= 3 && tiene(r, p, n - 1) && !dentro;
      r.forEach((v, j) => els.push(el.cella(pre + 'r' + i + 'c' + j, o.x + j * (wc + 6), o.y + 44 + i * 28, wc, 24, String(v), !dentro ? (cade ? 'zero' : 'off') : f >= 4 ? (j === 4 ? (v === 'negata' ? 'err' : 'att') : 'att') : f >= 1 && j === n - 1 ? 'att' : 'on', Object.assign({ piccola: true, cls: 'minuta' }, i === 0 ? { so: COL[j] } : {})))); });
    const y2 = o.y + 44 + REG.length * 28 + 6;
    els.push(el.box(pre + 'q0', o.x, y2, w4, 54, 'criteri applicati', f >= 1 ? ['periodo', 'periodo, account', 'tutti e tre'][n - 1] : 'nessuno', f >= 1 && f <= 3 ? 'att' : f > 3 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q1', o.x + w4 + 10, y2, w4, 54, 'righe residue', String(righe(p, n).length), f >= 1 && f <= 3 ? 'att' : f > 3 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q2', o.x + 2 * (w4 + 10), y2, w4, 54, 'concesse', f >= 4 ? String(k.c) : '·', f >= 4 ? 'att' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q3', o.x + 3 * (w4 + 10), y2, w4, 54, 'negate', f >= 4 ? String(k.n) : '·', f >= 4 ? (k.n ? 'err' : 'att') : '', { cls: 'stretta' }));
    return els;
  };
  const H = 44 + 5 * 28 + 6 + 54 + 8;
  return { REG, COL, tiene, righe, conta, coppia, chiave, quadro, H };
})();
SL.registra('6.7.4', {
  titolo: 'Evidenze di audit e loro interpretazione',
  obiettivo: 'Obiettivo: interrogare un registro di audit con tre criteri, contare separatamente le richieste concesse e quelle negate, e formulare la conclusione sostenuta dai dati.',
  concetti: [['tabella', 'Ogni riga, una richiesta'], ['lente', 'Tre criteri, applicati congiuntamente'], ['bilancio', 'I fatti che il registro può provare']],
  filigrana: ['tabella', 'lente', 'journal'],
  richiami: {
    carte: [
      { sim: 'chiave', da: 'Dall’unità 6.7.1', t: 'Account e sessione', d: 'Ogni richiesta di una sessione è associata all’identità dell’account che l’ha aperta.' },
      { sim: 'privilegi', da: 'Dall’unità 6.7.1', t: 'Concessa oppure negata', d: 'L’autorizzazione confronta l’operazione richiesta con i diritti dell’identità.' },
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'L’AND', d: 'Vale 1 soltanto quando tutte le condizioni valgono 1.' }
    ],
    domanda: { d: 'Prima di proseguire: nell’unità 6.7.1 uno studente richiedeva una modifica, e il servizio la negava. Quanto valeva il contatore delle modifiche?', o: [
      { t: 'Zero, come dopo una lettura concessa', ok: true, fb: 'Per distinguere i due casi occorreva conoscere l’operazione richiesta e la decisione. Un registro le conserva entrambe.' },
      { t: 'Uno', fb: 'Una modifica negata lascia il fascicolo invariato.' },
      { t: 'Meno uno', fb: 'Il contatore registra le modifiche applicate, e ha valore iniziale zero.' }
    ] }
  },
  idea: {
    titolo: 'L’interpretazione di un registro entro i limiti dei dati',
    termini: ['registro di audit'],
    testo: [
      'Autenticazione, autorizzazione e cifratura agiscono prima di una richiesta, oppure durante il suo servizio. Resta un’esigenza successiva: la ricostruzione degli eventi. A tale scopo un servizio conserva un [[registro di audit]], cioè un elenco in cui annota ogni richiesta ricevuta, nell’ordine di arrivo. Ogni riga riporta cinque informazioni: l’istante, l’account della sessione, l’oggetto, l’operazione richiesta, e la decisione presa.',
      'L’interrogazione di un registro consiste nella selezione di righe. Una domanda come «quali richieste ha presentato ada sulla tesi nei primi nove minuti» contiene tre criteri: un periodo, un account, un oggetto. Una riga è selezionata se li soddisfa tutti e tre congiuntamente: è l’AND dell’unità 1.5.1, applicato a ogni riga. L’omissione di un solo criterio include nel conteggio righe estranee: la richiesta di ada su un altro oggetto, oppure quella di un altro account sul medesimo oggetto.',
      { fig: 'scena', w: 720, h: SL.unita674.H, titolo: 'Le richieste di leo sulla tesi, fino al minuto 9', nota: 'Restano le righe dei minuti 4 e 9. La prima è una modifica negata, la seconda una lettura concessa.', els: SL.unita674.quadro('g', { acc: 'leo', ogg: 'tesi', t: 9 }, 4, { x: 10, y: 4, w: 700 }) },
      'Sulle righe selezionate si contano le decisioni: il numero delle richieste concesse, e quello delle richieste negate. I due numeri vanno tenuti separati, poiché sostengono affermazioni diverse. Una modifica concessa indica che il contenuto è stato modificato. Una modifica negata indica un tentativo, dopo il quale il contenuto è rimasto invariato. Due account con il medesimo numero di righe possono corrispondere a situazioni opposte.',
      'L’ultima cautela riguarda i fatti che il registro è in grado di provare. Una riga attribuisce la richiesta a un account, cioè alle credenziali impiegate per aprire la sessione. L’identità della persona che ha presentato le credenziali è estranea al registro: una password può essere stata ceduta, oppure sottratta. La frase sostenuta dai dati è «con le credenziali di ada è stata richiesta una modifica», mentre la frase «Ada ha modificato la tesi» richiede prove ulteriori. Anche l’assenza di righe va interpretata con cautela: indica soltanto che il servizio non ha ricevuto richieste da annotare, mentre gli accessi avvenuti per altre vie, come la lettura del disco rimosso dell’unità precedente, restano esclusi dal registro.'
    ]
  },
  esperimento: {
    faremo: [
      'Un registro contiene cinque richieste, di due account su due oggetti. I controlli fissano l’account, l’oggetto e il minuto finale del periodo da esaminare.',
      'L’esperimento applica i criteri uno per volta, indicando le righe escluse, e quindi conta le decisioni. È istruttivo confrontare ada e leo sulla tesi fino al minuto 9: due righe ciascuno, e due situazioni diverse.'
    ],
    vedrai: [
      ['tabella', 'Il registro', 'In alto: le cinque righe, con minuto, account, oggetto, operazione e decisione.'],
      ['lente', 'La selezione', 'A ogni passo le righe escluse sono attenuate, ed è evidenziata la colonna del criterio applicato.'],
      ['bilancio', 'Il conteggio', 'In basso: i criteri applicati, le righe residue, le richieste concesse e quelle negate.']
    ]
  },
  lab: {
    titolo: 'Tre criteri su cinque righe',
    scena: { w: 860, h: SL.unita674.H },
    atti: ['Il registro', 'La selezione', 'Il conteggio', 'La conclusione'],
    controlli: [
      { id: 'acc', tipo: 'scelta', eti: 'Account', opzioni: [['ada', 'ada'], ['leo', 'leo']], valore: 'leo' },
      { id: 'ogg', tipo: 'scelta', eti: 'Oggetto', opzioni: [['tesi', 'tesi'], ['dati', 'dati']], valore: 'tesi' },
      { id: 't', tipo: 'scelta', eti: 'Fino al minuto', opzioni: [[5, '5'], [9, '9']], valore: 9 }
    ],
    nota: 'I passi sono sempre sei. Il periodo ha inizio al minuto 0, e comprende il minuto finale.',
    previsione: {
      domanda: (p) => 'Il registro contiene, nell’ordine: ' + SL.unita674.REG.map((r) => 'minuto ' + r[0] + ', ' + r[1] + ', ' + r[2] + ', ' + r[3] + ' ' + r[4]).join('; ') + '. Fra le richieste di ' + p.acc + ' su ' + p.ogg + ' fino al minuto ' + p.t + ' incluso, quante sono concesse e quante negate?',
      opzioni: (p) => { const U = SL.unita674, giusta = U.conta(U.righe(p, 3)), cand = [giusta, U.conta(U.REG.filter((r) => r[0] <= p.t && r[1] === p.acc)), U.conta(U.REG.filter((r) => r[0] <= p.t && r[2] === p.ogg)), U.conta(U.REG.filter((r) => r[1] === p.acc && r[2] === p.ogg)), { c: giusta.n, n: giusta.c }, { c: giusta.c + 1, n: giusta.n }, { c: giusta.c, n: giusta.n + 1 }], visti = {}, out = []; cand.forEach((k) => { const id = U.chiave(k); if (!visti[id] && out.length < 3) { visti[id] = 1; out.push([id, U.coppia(k)]); } }); return out.sort((a, b) => (a[0] < b[0] ? -1 : 1)); }
    },
    confronto: (pred, esito, p) => { const U = SL.unita674, leggi = (id) => { const v = id.split('-').map(Number); return U.coppia({ c: v[0], n: v[1] }); }, senzaOgg = U.chiave(U.conta(U.REG.filter((r) => r[0] <= p.t && r[1] === p.acc))), senzaAcc = U.chiave(U.conta(U.REG.filter((r) => r[0] <= p.t && r[2] === p.ogg))), senzaT = U.chiave(U.conta(U.REG.filter((r) => r[1] === p.acc && r[2] === p.ogg))); return 'La previsione indicava ' + leggi(pred) + '. Dal registro risultano ' + leggi(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === senzaOgg ? 'Il conteggio indicato comprende le richieste di ' + p.acc + ' su ogni oggetto. Il criterio dell’oggetto ne esclude una parte.' : pred === senzaAcc ? 'Il conteggio indicato comprende le richieste di ogni account su ' + p.ogg + '. Il criterio dell’account ne esclude una parte.' : pred === senzaT ? 'Il conteggio indicato comprende le righe successive al minuto ' + p.t + ', esterne al periodo.' : 'Una riga rientra nel conteggio soltanto se soddisfa congiuntamente periodo, account e oggetto.'); },
    costruisci(p) {
      const U = SL.unita674, sel = U.righe(p, 3), k = U.conta(sel), passi = [];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Righe residue', String(U.righe(p, Math.min(f, 3)).length), 'a'], ['Concesse', f >= 4 ? String(k.c) : '·'], ['Negate', f >= 4 ? String(k.n) : '·', 'c']], els: U.quadro('b', p, Math.min(f, 4), { x: 20, y: 4, w: 820 }) }, extra));
      const n1 = U.righe(p, 1).length, n2 = U.righe(p, 2).length, n3 = sel.length, quante = (n) => (n === 0 ? 'nessuna riga' : n === 1 ? 'una riga' : n + ' righe');
      P(0, 0, 'Il registro', 'Il servizio ha annotato cinque richieste. Ogni riga indica l’istante di arrivo, l’account, l’oggetto, l’operazione, e la decisione. La domanda riguarda ' + p.acc + ', l’oggetto ' + p.ogg + ', e i minuti da 0 a ' + p.t + '.', {});
      P(1, 1, 'Il periodo', 'Primo criterio: il minuto deve essere al più ' + p.t + '. ' + (n1 === 5 ? 'Tutte e cinque le righe lo soddisfano.' : 'Le righe successive sono escluse: ne restano ' + n1 + '.'), { calc: 'minuto ≤ ' + p.t + ' → ' + quante(n1) });
      P(2, 1, 'L’account', 'Secondo criterio: l’account deve essere ' + p.acc + '. Le righe dell’altro account sono escluse, e resta' + (n2 === 1 ? ' ' : 'no ') + quante(n2) + '.', { calc: 'account = ' + p.acc + ' → ' + quante(n2) });
      P(3, 1, 'L’oggetto', 'Terzo criterio: l’oggetto deve essere ' + p.ogg + ', e ' + (n3 === n2 ? 'tutte le righe residue lo soddisfano.' : 'le righe su altri oggetti sono escluse.') + ' ' + (n3 === 0 ? 'Nessuna riga soddisfa' : n3 === 1 ? 'Una riga soddisfa' : n3 + ' righe soddisfano') + ' congiuntamente i tre criteri.', Object.assign({ calc: 'oggetto = ' + p.ogg + ' → ' + quante(n3) }, n3 > 0 ? { chiedi: { d: n3 === 1 ? 'È rimasta una riga. Si tratta certamente di una richiesta concessa?' : 'Sono rimaste ' + n3 + ' righe. Si tratta certamente di richieste concesse?', o: ['Va esaminata la colonna della decisione', 'Sì, sono nel registro'], g: 0, no: 'Il registro annota ogni richiesta ricevuta, anche quelle negate.' } } : {}));
      P(4, 2, 'Il conteggio delle decisioni', n3 === 0 ? 'Con nessuna riga selezionata i due conteggi valgono zero: 0 concesse e 0 negate.' : (sel.length === 1 ? 'La riga selezionata riporta ' : 'Le righe selezionate riportano ') + sel.map((r) => 'minuto ' + r[0] + ', ' + r[3] + ' ' + r[4]).join('; ') + '. Complessivamente ' + U.coppia(k) + '.', { calc: U.coppia(k) });
      P(5, 3, 'La conclusione sostenuta dai dati', n3 === 0 ? 'Il registro è privo di righe pertinenti: nel periodo, con le credenziali di ' + p.acc + ', il servizio non ha ricevuto richieste su ' + p.ogg + ' da annotare. È un’affermazione sul servizio: gli accessi avvenuti per altre vie restano esclusi dal registro.' : 'Il registro sostiene la seguente affermazione: con le credenziali di ' + p.acc + ' ' + (n3 === 1 ? 'è stata presentata una richiesta su ' + p.ogg + ', ' + (k.c ? 'concessa' : 'negata') : 'sono state presentate ' + n3 + ' richieste su ' + p.ogg + ', di cui ' + U.coppia(k)) + '. ' + (sel.some((r) => r[3] === 'modifica' && r[4] === 'negata') ? 'La modifica negata è un tentativo: il contenuto è rimasto invariato. ' : '') + 'L’identità della persona che ha presentato le credenziali è estranea ai dati.', { esito: [U.coppia(k), ''] });
      return { passi, esito: U.chiave(k) };
    }
  },
  bilancio: {
    regola: [
      'Una riga rientra nel conteggio soltanto se soddisfa congiuntamente periodo, account e oggetto. Si contano quindi separatamente le richieste concesse e quelle negate.',
      'Una riga attribuisce la richiesta alle credenziali impiegate. Una richiesta negata è un tentativo, e lascia l’oggetto invariato.'
    ],
    errori: [
      ['Omettere un criterio della selezione.', 'Rientrano nel conteggio le righe di un altro oggetto, di un altro account, oppure di un altro periodo.'],
      ['Contare le righe senza esaminare la decisione.', 'Una richiesta negata e una concessa occupano entrambe una riga, e hanno significati opposti.'],
      ['Scrivere «Ada ha modificato» dove i dati indicano «con le credenziali di ada».', 'Il registro contiene l’account. Sulla persona che lo impiegava occorrono altre prove.']
    ],
    saFare: ['Selezionare le righe con tre criteri.', 'Contare separatamente concessioni e rifiuti.', 'Formulare la conclusione sostenuta dai dati.'],
    esercizi: [
      { d: 'Un registro contiene: minuto 1, ada, tesi, lettura concessa; minuto 3, leo, tesi, modifica negata; minuto 4, ada, dati, lettura concessa; minuto 5, ada, tesi, modifica negata; minuto 6, ada, tesi, modifica concessa; minuto 8, ada, tesi, lettura concessa. Quante righe riguardano ada e tesi fino al minuto 6 incluso?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Sono le righe dei minuti 1, 5 e 6.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'Quattro righe si ottengono omettendo un criterio: il minuto 8 è esterno al periodo, e il minuto 4 riguarda un altro oggetto.' },
          { se: ['5', 'cinque'], msg: 'Cinque sono tutte le righe di ada. Vanno applicati anche il periodo e l’oggetto.' },
          { se: ['6', 'sei'], msg: 'Sei sono tutte le righe del registro. Vanno applicati i tre criteri.' }
        ],
        altro: 'Il numero è diverso. Si scorrano le righe una per volta, e si selezionino quelle che soddisfano tutti e tre i criteri.',
        indizi: ['Fino al minuto 6 è esclusa la riga del minuto 8.', 'La riga del minuto 3 è di leo, quella del minuto 4 riguarda dati.', 'Restano i minuti 1, 5 e 6.'],
        svolgimento: ['Periodo: escluso il minuto 8.', 'Account: escluso il minuto 3.', 'Oggetto: escluso il minuto 4.', 'Restano 3 righe.'] },
      { d: 'Fra le righe selezionate nell’esercizio precedente, quante sono richieste concesse?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: 'Minuto 1, lettura concessa. Minuto 6, modifica concessa. Il minuto 5 è una modifica negata.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Tre sono le righe selezionate. Quella del minuto 5 è una richiesta negata.' },
          { se: ['1', 'uno', 'una'], msg: 'Le concesse sono due: la lettura del minuto 1 e la modifica del minuto 6.' },
          { se: ['4', 'quattro'], msg: 'Quattro sono le richieste concesse di tutto il registro. Vanno considerate soltanto le righe selezionate.' }
        ],
        altro: 'Il numero è diverso. Si esamini la decisione delle righe dei minuti 1, 5 e 6.',
        indizi: ['Minuto 1: concessa.', 'Minuto 5: negata.', 'Minuto 6: concessa.'],
        svolgimento: ['Righe selezionate: minuti 1, 5, 6.', 'Concesse: minuti 1 e 6.', 'Totale: 2.'] },
      { d: 'Una riga riporta: minuto 5, ada, tesi, modifica negata. Quale affermazione è sostenuta dal registro?', guida: 'Si scelga la risposta.', o: [
        { t: 'Con le credenziali di ada è stata richiesta una modifica, che il servizio ha respinto', ok: true, fb: 'La frase riporta l’account, l’operazione e la decisione, senza aggiungere altro.' },
        { t: 'Ada ha modificato la tesi al minuto 5', fb: 'La decisione è «negata»: il contenuto è rimasto invariato.' },
        { t: 'Ada era al calcolatore al minuto 5', fb: 'Il registro contiene l’account. L’identità della persona che lo impiegava è estranea ai dati.' }] }
    ],
    sfida: ['cslez6_7_05_auditing', 'Esame del registro degli accessi']
  }
});
