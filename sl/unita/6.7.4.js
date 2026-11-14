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
    els.push(el.box(pre + 'q1', o.x + w4 + 10, y2, w4, 54, 'righe rimaste', String(righe(p, n).length), f >= 1 && f <= 3 ? 'att' : f > 3 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q2', o.x + 2 * (w4 + 10), y2, w4, 54, 'concesse', f >= 4 ? String(k.c) : '·', f >= 4 ? 'att' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q3', o.x + 3 * (w4 + 10), y2, w4, 54, 'negate', f >= 4 ? String(k.n) : '·', f >= 4 ? (k.n ? 'err' : 'att') : '', { cls: 'stretta' }));
    return els;
  };
  const H = 44 + 5 * 28 + 6 + 54 + 8;
  return { REG, COL, tiene, righe, conta, coppia, chiave, quadro, H };
})();
SL.registra('6.7.4', {
  titolo: 'Evidenze di audit e loro interpretazione',
  obiettivo: 'Obiettivo: interrogare un registro di audit con tre criteri, contare a parte le richieste concesse e quelle negate, e formulare la conclusione che i dati sostengono.',
  concetti: [['tabella', 'Ogni riga, una richiesta'], ['lente', 'Tre criteri, applicati insieme'], ['bilancio', 'Ciò che il registro può provare']],
  filigrana: ['tabella', 'lente', 'journal'],
  richiami: {
    carte: [
      { sim: 'chiave', da: 'Dall’unità 6.7.1', t: 'Account e sessione', d: 'Ogni richiesta di una sessione porta l’identità dell’account che l’ha aperta.' },
      { sim: 'privilegi', da: 'Dall’unità 6.7.1', t: 'Concessa oppure negata', d: 'L’autorizzazione confronta l’operazione chiesta con i diritti dell’identità.' },
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'L’AND', d: 'Vale 1 soltanto quando tutte le condizioni valgono 1.' }
    ],
    domanda: { d: 'Prima di proseguire: nell’unità 6.7.1 uno studente chiedeva una modifica, e il servizio la negava. Quanto valeva il contatore delle modifiche?', o: [
      { t: 'Zero, come dopo una lettura concessa', ok: true, fb: 'Per distinguere i due casi serviva conoscere l’operazione chiesta e la decisione. Un registro le conserva entrambe.' },
      { t: 'Uno', fb: 'Una modifica negata lascia il fascicolo com’è.' },
      { t: 'Meno uno', fb: 'Il contatore conta le modifiche applicate, e parte da zero.' }
    ] }
  },
  idea: {
    titolo: 'Leggere un registro senza fargli dire troppo',
    termini: ['registro di audit'],
    testo: [
      'Autenticazione, autorizzazione e cifratura agiscono prima di una richiesta, oppure mentre viene servita. Resta un bisogno che viene dopo: ricostruire che cosa è accaduto. Per questo un servizio tiene un [[registro di audit]], cioè un elenco in cui annota ogni richiesta ricevuta, nell’ordine di arrivo. Ogni riga riporta cinque informazioni: l’istante, l’account della sessione, l’oggetto, l’operazione chiesta, e la decisione presa.',
      'Interrogare un registro significa selezionare righe. Una domanda come «che cosa ha chiesto ada sulla tesi nei primi nove minuti» contiene tre criteri: un periodo, un account, un oggetto. Una riga viene tenuta se li soddisfa tutti e tre insieme. È l’AND dell’unità 1.5.1, applicato a ogni riga. Basta dimenticare un criterio perché entrino nel conto righe estranee: la richiesta di ada su un altro oggetto, oppure quella di un altro account sullo stesso oggetto.',
      { fig: 'scena', w: 720, h: SL.unita674.H, titolo: 'Le richieste di leo sulla tesi, fino al minuto 9', nota: 'Restano le righe dei minuti 4 e 9. La prima è una modifica negata, la seconda una lettura concessa.', els: SL.unita674.quadro('g', { acc: 'leo', ogg: 'tesi', t: 9 }, 4, { x: 10, y: 4, w: 700 }) },
      'Dalle righe selezionate si contano le decisioni: quante richieste concesse, e quante negate. I due numeri vanno tenuti separati, perché sostengono affermazioni diverse. Una modifica concessa dice che il contenuto è cambiato. Una modifica negata dice che qualcuno ha provato, e che il contenuto è rimasto com’era. Due account con lo stesso numero di righe possono avere storie opposte.',
      'L’ultima cautela riguarda ciò che il registro è in grado di provare. Una riga attribuisce la richiesta a un account, cioè alle credenziali usate per aprire la sessione. Chi fosse la persona alla tastiera resta fuori dal registro: una password può essere stata prestata, oppure sottratta. La frase sostenuta dai dati è «con le credenziali di ada è stata chiesta una modifica». La frase «Ada ha modificato la tesi» chiede prove ulteriori. Anche il silenzio va letto con misura. L’assenza di righe dice che il servizio è rimasto senza richieste da annotare, e tace su ciò che avviene per altre vie, come la lettura del disco rimosso dell’unità precedente.'
    ]
  },
  esperimento: {
    faremo: [
      'Un registro contiene cinque richieste, di due account su due oggetti. Sceglierai l’account, l’oggetto e il minuto finale del periodo da esaminare.',
      'Applicheremo i criteri uno alla volta, guardando le righe che cadono, e poi conteremo le decisioni. Confronta ada e leo sulla tesi fino al minuto 9: due righe ciascuno, e due storie diverse.'
    ],
    vedrai: [
      ['tabella', 'Il registro', 'In alto: le cinque righe, con minuto, account, oggetto, operazione e decisione.'],
      ['lente', 'La selezione', 'A ogni passo le righe escluse si spengono, e si illumina la colonna del criterio applicato.'],
      ['bilancio', 'Il conto', 'In basso: i criteri applicati, le righe rimaste, le richieste concesse e quelle negate.']
    ]
  },
  lab: {
    titolo: 'Tre criteri su cinque righe',
    scena: { w: 860, h: SL.unita674.H },
    atti: ['Il registro', 'La selezione', 'Il conto', 'La conclusione'],
    controlli: [
      { id: 'acc', tipo: 'scelta', eti: 'Account', opzioni: [['ada', 'ada'], ['leo', 'leo']], valore: 'leo' },
      { id: 'ogg', tipo: 'scelta', eti: 'Oggetto', opzioni: [['tesi', 'tesi'], ['dati', 'dati']], valore: 'tesi' },
      { id: 't', tipo: 'scelta', eti: 'Fino al minuto', opzioni: [[5, '5'], [9, '9']], valore: 9 }
    ],
    nota: 'I passi sono sempre sei. Il periodo comincia al minuto 0, e comprende il minuto finale.',
    previsione: {
      domanda: (p) => 'Il registro contiene, nell’ordine: ' + SL.unita674.REG.map((r) => 'minuto ' + r[0] + ', ' + r[1] + ', ' + r[2] + ', ' + r[3] + ' ' + r[4]).join('; ') + '. Fra le richieste di ' + p.acc + ' su ' + p.ogg + ' fino al minuto ' + p.t + ' incluso, quante sono concesse e quante negate?',
      opzioni: (p) => { const U = SL.unita674, giusta = U.conta(U.righe(p, 3)), cand = [giusta, U.conta(U.REG.filter((r) => r[0] <= p.t && r[1] === p.acc)), U.conta(U.REG.filter((r) => r[0] <= p.t && r[2] === p.ogg)), U.conta(U.REG.filter((r) => r[1] === p.acc && r[2] === p.ogg)), { c: giusta.n, n: giusta.c }, { c: giusta.c + 1, n: giusta.n }, { c: giusta.c, n: giusta.n + 1 }], visti = {}, out = []; cand.forEach((k) => { const id = U.chiave(k); if (!visti[id] && out.length < 3) { visti[id] = 1; out.push([id, U.coppia(k)]); } }); return out.sort((a, b) => (a[0] < b[0] ? -1 : 1)); }
    },
    confronto: (pred, esito, p) => { const U = SL.unita674, leggi = (id) => { const v = id.split('-').map(Number); return U.coppia({ c: v[0], n: v[1] }); }, senzaOgg = U.chiave(U.conta(U.REG.filter((r) => r[0] <= p.t && r[1] === p.acc))), senzaAcc = U.chiave(U.conta(U.REG.filter((r) => r[0] <= p.t && r[2] === p.ogg))), senzaT = U.chiave(U.conta(U.REG.filter((r) => r[1] === p.acc && r[2] === p.ogg))); return 'La previsione indicava ' + leggi(pred) + '. Dal registro risultano ' + leggi(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === senzaOgg ? 'Il tuo conto comprende le richieste di ' + p.acc + ' su ogni oggetto. Il criterio dell’oggetto ne esclude una parte.' : pred === senzaAcc ? 'Il tuo conto comprende le richieste di ogni account su ' + p.ogg + '. Il criterio dell’account ne esclude una parte.' : pred === senzaT ? 'Il tuo conto comprende le righe successive al minuto ' + p.t + ', che stanno fuori dal periodo.' : 'Una riga entra nel conto soltanto se soddisfa insieme periodo, account e oggetto.'); },
    costruisci(p) {
      const U = SL.unita674, sel = U.righe(p, 3), k = U.conta(sel), passi = [];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Righe rimaste', String(U.righe(p, Math.min(f, 3)).length), 'a'], ['Concesse', f >= 4 ? String(k.c) : '·'], ['Negate', f >= 4 ? String(k.n) : '·', 'c']], els: U.quadro('b', p, Math.min(f, 4), { x: 20, y: 4, w: 820 }) }, extra));
      const n1 = U.righe(p, 1).length, n2 = U.righe(p, 2).length, n3 = sel.length, quante = (n) => (n === 0 ? 'nessuna riga' : n === 1 ? 'una riga' : n + ' righe');
      P(0, 0, 'Il registro', 'Il servizio ha annotato cinque richieste. Ogni riga dice quando è arrivata, da quale account, su quale oggetto, con quale operazione, e come è stata decisa. La domanda riguarda ' + p.acc + ', l’oggetto ' + p.ogg + ', e i minuti da 0 a ' + p.t + '.', {});
      P(1, 1, 'Il periodo', 'Primo criterio: il minuto deve essere al più ' + p.t + '. ' + (n1 === 5 ? 'Tutte e cinque le righe lo soddisfano.' : 'Le righe successive cadono: ne restano ' + n1 + '.'), { calc: 'minuto ≤ ' + p.t + ' → ' + quante(n1) });
      P(2, 1, 'L’account', 'Secondo criterio: l’account deve essere ' + p.acc + '. Le righe dell’altro account cadono, e resta' + (n2 === 1 ? ' ' : 'no ') + quante(n2) + '.', { calc: 'account = ' + p.acc + ' → ' + quante(n2) });
      P(3, 1, 'L’oggetto', 'Terzo criterio: l’oggetto deve essere ' + p.ogg + '. ' + (n3 === n2 ? 'Tutte le righe rimaste lo soddisfano.' : 'Le righe su altri oggetti cadono.') + ' ' + (n3 === 0 ? 'Nessuna riga soddisfa' : n3 === 1 ? 'Una riga soddisfa' : n3 + ' righe soddisfano') + ' insieme i tre criteri.', Object.assign({ calc: 'oggetto = ' + p.ogg + ' → ' + quante(n3) }, n3 > 0 ? { chiedi: { d: n3 === 1 ? 'È rimasta una riga. È di sicuro una richiesta andata a buon fine?' : 'Sono rimaste ' + n3 + ' righe. Sono di sicuro richieste andate a buon fine?', o: ['Va guardata la colonna della decisione', 'Sì: sono nel registro'], g: 0, no: 'Il registro annota ogni richiesta ricevuta, anche quelle negate.' } } : {}));
      P(4, 2, 'Il conto delle decisioni', n3 === 0 ? 'Con nessuna riga selezionata i due conti valgono zero: 0 concesse e 0 negate.' : sel.map((r) => 'Minuto ' + r[0] + ': ' + r[3] + ' ' + r[4] + '.').join(' ') + ' In tutto ' + U.coppia(k) + '.', { calc: U.coppia(k) });
      P(5, 3, 'Che cosa si può affermare', n3 === 0 ? 'Il registro tace: nel periodo, con le credenziali di ' + p.acc + ', il servizio è rimasto senza richieste su ' + p.ogg + ' da annotare. È un’affermazione sul servizio. Su accessi avvenuti per altre vie il registro è muto.' : 'Il registro sostiene questa frase: con le credenziali di ' + p.acc + ' ' + (n3 === 1 ? 'è stata presentata una richiesta su ' + p.ogg + ', ' + (k.c ? 'concessa' : 'negata') : 'sono state presentate ' + n3 + ' richieste su ' + p.ogg + ', di cui ' + U.coppia(k)) + '. ' + (sel.some((r) => r[3] === 'modifica' && r[4] === 'negata') ? 'La modifica negata è un tentativo: il contenuto è rimasto com’era. ' : '') + 'Chi fosse la persona alla tastiera resta fuori dai dati.', { esito: [U.coppia(k), ''] });
      return { passi, esito: U.chiave(k) };
    }
  },
  bilancio: {
    regola: [
      'Una riga entra nel conto soltanto se soddisfa insieme periodo, account e oggetto. Poi si contano a parte le richieste concesse e quelle negate.',
      'Una riga attribuisce la richiesta alle credenziali usate. Una richiesta negata è un tentativo, e lascia l’oggetto com’era.'
    ],
    errori: [
      ['Dimenticare un criterio della selezione.', 'Entrano nel conto le righe di un altro oggetto, di un altro account, oppure di un altro periodo.'],
      ['Contare le righe senza guardare la decisione.', 'Una richiesta negata e una concessa occupano entrambe una riga, e dicono cose opposte.'],
      ['Scrivere «Ada ha modificato» dove i dati dicono «con le credenziali di ada».', 'Il registro conosce l’account. Sulla persona che lo usava servono altre prove.']
    ],
    saFare: ['Selezionare le righe con tre criteri.', 'Contare a parte concessioni e rifiuti.', 'Formulare la conclusione sostenuta dai dati.'],
    esercizi: [
      { d: 'Un registro contiene: minuto 1, ada, tesi, lettura concessa; minuto 3, leo, tesi, modifica negata; minuto 4, ada, dati, lettura concessa; minuto 5, ada, tesi, modifica negata; minuto 6, ada, tesi, modifica concessa; minuto 8, ada, tesi, lettura concessa. Quante righe riguardano ada e tesi fino al minuto 6 incluso?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Sono le righe dei minuti 1, 5 e 6.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'Quattro righe si ottengono dimenticando un criterio: il minuto 8 è fuori dal periodo, e il minuto 4 riguarda un altro oggetto.' },
          { se: ['5', 'cinque'], msg: 'Cinque sono tutte le righe di ada. Vanno applicati anche il periodo e l’oggetto.' },
          { se: ['6', 'sei'], msg: 'Sei sono tutte le righe del registro. Vanno applicati i tre criteri.' }
        ],
        altro: 'Il numero è diverso. Si scorrano le righe una alla volta, e si tengano quelle che soddisfano tutti e tre i criteri.',
        indizi: ['Fino al minuto 6 cade la riga del minuto 8.', 'La riga del minuto 3 è di leo, quella del minuto 4 riguarda dati.', 'Restano i minuti 1, 5 e 6.'],
        svolgimento: ['Periodo: cade il minuto 8.', 'Account: cade il minuto 3.', 'Oggetto: cade il minuto 4.', 'Restano 3 righe.'] },
      { d: 'Fra le righe selezionate nell’esercizio precedente, quante sono richieste concesse?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: 'Minuto 1, lettura concessa. Minuto 6, modifica concessa. Il minuto 5 è una modifica negata.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Tre sono le righe selezionate. Quella del minuto 5 è una richiesta negata.' },
          { se: ['1', 'uno', 'una'], msg: 'Le concesse sono due: la lettura del minuto 1 e la modifica del minuto 6.' },
          { se: ['4', 'quattro'], msg: 'Quattro sono le richieste concesse di tutto il registro. Vanno considerate soltanto le righe selezionate.' }
        ],
        altro: 'Il numero è diverso. Guarda la decisione delle righe dei minuti 1, 5 e 6.',
        indizi: ['Minuto 1: concessa.', 'Minuto 5: negata.', 'Minuto 6: concessa.'],
        svolgimento: ['Righe selezionate: minuti 1, 5, 6.', 'Concesse: minuti 1 e 6.', 'Totale: 2.'] },
      { d: 'Una riga dice: minuto 5, ada, tesi, modifica negata. Quale affermazione è sostenuta dal registro?', guida: 'Si scelga la risposta.', o: [
        { t: 'Con le credenziali di ada è stata chiesta una modifica, che il servizio ha respinto', ok: true, fb: 'La frase riporta l’account, l’operazione e la decisione, senza aggiungere altro.' },
        { t: 'Ada ha modificato la tesi al minuto 5', fb: 'La decisione è «negata»: il contenuto è rimasto com’era.' },
        { t: 'Ada era al calcolatore al minuto 5', fb: 'Il registro conosce l’account. Chi lo stesse usando resta fuori dai dati.' }] }
    ],
    sfida: ['cslez6_7_05_auditing', 'Verifica del registro degli accessi']
  }
});
