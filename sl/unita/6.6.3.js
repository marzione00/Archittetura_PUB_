'use strict';
SL.unita663 = (() => {
  const A0 = 2, B0 = 4, A1 = 7, B1 = 9;
  const PASSI = ['record di A e di B nel journal', 'commit nel journal', 'copia di A nella sede definitiva', 'copia di B nella sede definitiva'];
  // stato dopo che i primi «st» passi sono durevoli: 1 record, 2 commit, 3 copia di A, 4 copia di B
  const disco = (st) => ({ rec: st >= 1, commit: st >= 2, A: st >= 3 ? A1 : A0, B: st >= 4 ? B1 : B0 });
  const recupero = (st) => { const d = disco(st); if (!d.commit) return { A: d.A, B: d.B, applicate: 0, cambiati: 0 }; return { A: A1, B: B1, applicate: 2, cambiati: (d.A !== A1 ? 1 : 0) + (d.B !== B1 ? 1 : 0) }; };
  const esito = (p) => (p.st >= 2 ? 'nuovi' : 'vecchi');
  // st: passi durevoli mostrati · fase: '' lavoro, 'crash', 'legge', 'fine'
  const quadro = (pre, st, fase, o) => {
    const el = SL.el, els = [], d = disco(st), r = recupero(st), w3 = (o.w - 20) / 3, w2 = (o.w - 10) / 2, fine = fase === 'fine';
    els.push(el.nota(pre + 't', o.x, o.y, 'IL JOURNAL · un’area del disco riservata alle registrazioni', 'mono'));
    els.push(el.cella(pre + 'j0', o.x, o.y + 24, w3, 32, d.rec ? 'A diventa 7' : '', d.rec ? (fase === 'legge' ? 'att' : fine && !d.commit ? 'off' : 'on') : '', { gi: 'record di A', piccola: true }));
    els.push(el.cella(pre + 'j1', o.x + w3 + 10, o.y + 24, w3, 32, d.rec ? 'B diventa 9' : '', d.rec ? (fase === 'legge' ? 'att' : fine && !d.commit ? 'off' : 'on') : '', { gi: 'record di B', piccola: true }));
    els.push(el.cella(pre + 'j2', o.x + 2 * (w3 + 10), o.y + 24, w3, 32, d.commit ? 'commit' : fase === 'legge' || fine ? 'assente' : '', d.commit ? (fase === 'legge' ? 'att' : 'on') : fase === 'legge' || fine ? 'err' : '', { gi: 'conferma', piccola: true }));
    els.push(el.box(pre + 'a', o.x, o.y + 84, w2, 54, 'blocco A · sede definitiva', String(fine ? r.A : d.A), fine && r.A !== d.A ? 'att' : (fine ? r.A : d.A) === A1 ? 'on' : 'zero', { cls: 'stretta' }));
    els.push(el.box(pre + 'b', o.x + w2 + 10, o.y + 84, w2, 54, 'blocco B · sede definitiva', String(fine ? r.B : d.B), fine && r.B !== d.B ? 'att' : (fine ? r.B : d.B) === B1 ? 'on' : 'zero', { cls: 'stretta' }));
    return els;
  };
  return { A0, B0, A1, B1, PASSI, disco, recupero, esito, quadro };
})();
SL.registra('6.6.3', {
  titolo: 'Journal redo e soglia del commit durevole',
  obiettivo: 'Obiettivo: dire, per ogni punto in cui può cadere un crash, che cosa farà il recupero di un journal: riapplicare la transazione, oppure scartarla.',
  concetti: [['journal', 'Prima si annota, poi si fa'], ['scudo', 'Il commit è la soglia'], ['riproduci', 'Riapplicare non fa danni']],
  filigrana: ['journal', 'scudo', 'riproduci'],
  richiami: {
    carte: [
      { sim: 'conflitto', da: 'Dall’unità 6.6.1', t: 'Il prefisso durevole', d: 'Dopo un crash sopravvivono le prime scritture, fino al punto dell’arresto.' },
      { sim: 'journal', da: 'Dall’unità 5.7.4', t: 'La transazione sui dati', d: 'Un gruppo di modifiche che vale come una sola: o avvengono tutte, o nessuna.' },
      { sim: 'lente', da: 'Dall’unità 6.6.2', t: 'La scansione completa', d: 'Rimette d’accordo le strutture, in un tempo che cresce con il volume, e senza sapere che cosa l’operazione volesse ottenere.' }
    ],
    domanda: { d: 'Prima di proseguire: un aggiornamento deve cambiare due blocchi, A e B, con due scritture separate. Il crash cade fra le due. Che cosa trova il riavvio?', o: [
      { t: 'A con il valore nuovo e B con quello vecchio', ok: true, fb: 'È uno stato a metà, che l’aggiornamento non voleva produrre.' },
      { t: 'Entrambi con il valore nuovo', fb: 'La scrittura di B non è mai avvenuta.' },
      { t: 'Entrambi con il valore vecchio', fb: 'La scrittura di A era già durevole.' }
    ] }
  },
  idea: {
    titolo: 'Scrivere due volte, per non restare a metà',
    termini: ['journal', 'commit', 'redo', 'idempotenza'],
    testo: [
      'L’unità 6.6.1 ha mostrato il problema: un’operazione fatta di più scritture può essere interrotta a metà. L’unità 6.6.2 ha mostrato un rimedio costoso, la scansione dell’intero volume. Esiste un rimedio migliore, che si basa su un’idea antica: prima di fare un lavoro delicato, si scrive da qualche parte che cosa si sta per fare.',
      'Quel «da qualche parte» è il [[journal]], un’area del disco riservata. Supponiamo di dover portare il blocco A da 2 a 7 e il blocco B da 4 a 9, come una sola transazione. Il sistema comincia scrivendo nel journal due record, con i valori finali: «A diventa 7», «B diventa 9». I blocchi veri restano per ora intatti. Poi scrive nel journal un terzo record, brevissimo, che dice «la transazione è completa». È il [[commit]].',
      'Soltanto dopo il commit il sistema copia i valori nelle sedi definitive, prima A e poi B. L’ordine complessivo è dunque: record, commit, copia di A, copia di B. Il commit è una scrittura singola, e quindi atomica: o c’è, o manca. Fa da soglia: prima di essa la transazione è come mai chiesta, e dopo di essa è avvenuta per intero, anche se le copie devono ancora essere fatte.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Crash dopo la copia di A: il commit c’è, e B è ancora vecchio', nota: 'Il journal contiene i due record e il commit. La sede definitiva di A vale già 7, quella di B vale ancora 4: il recupero completerà il lavoro.', els: SL.unita663.quadro('g', 3, 'crash', { x: 10, y: 4, w: 700 }) },
      'Vediamo che cosa accade a ogni possibile crash. Al riavvio il sistema legge il journal. Se il commit manca, la transazione viene scartata: i record sono soltanto un’intenzione, e le sedi definitive hanno ancora i valori vecchi, perché nessuna copia era cominciata. Se trova il commit, il sistema rifà le copie leggendo i record: scrive 7 in A e 9 in B. Questo modo di recuperare, che riapplica il lavoro annotato, si chiama [[redo]].',
      'Al recupero è inutile sapere quali copie fossero già avvenute: le rifà tutte. Se A conteneva già 7, scrivervi di nuovo 7 non cambia nulla. Un’operazione che si può ripetere quante volte si vuole con lo stesso risultato gode di [[idempotenza]], ed è per questo che i record contengono valori finali, al posto di istruzioni come «aggiungi 5». Il risultato è che il riavvio trova sempre uno di due stati: tutto vecchio, oppure tutto nuovo. Lo stato a metà non è più possibile.'
    ]
  },
  esperimento: {
    faremo: [
      'Una transazione porta A da 2 a 7 e B da 4 a 9, in quattro passi: record nel journal, commit, copia di A, copia di B. Sceglierai dopo quale passo cade il crash.',
      'Seguiremo i passi fino al crash, e poi il recupero: la lettura del journal, la decisione, e i valori finali. Confronta un crash subito prima del commit con uno subito dopo.'
    ],
    vedrai: [
      ['journal', 'Il journal', 'In alto: i due record con i valori finali, e la casella del commit.'],
      ['storage', 'Le sedi definitive', 'In basso: i valori dei blocchi A e B, come si trovano sul disco.']
    ]
  },
  lab: {
    titolo: 'Un crash, e il recupero dal journal',
    scena: { w: 860, h: 150 },
    atti: ['La transazione', 'Il crash', 'Il recupero'],
    controlli: [
      { id: 'st', tipo: 'scelta', eti: 'Ultimo passo durevole prima del crash', opzioni: [[0, 'nessuno'], [1, 'i record nel journal'], [2, 'il commit'], [3, 'la copia di A'], [4, 'la copia di B']], valore: 3 }
    ],
    nota: 'Il numero dei passi dipende dal punto del crash. A vale 2 e deve diventare 7. B vale 4 e deve diventare 9.',
    previsione: {
      domanda: (p) => 'Una transazione deve portare A da 2 a 7 e B da 4 a 9. I passi sono, nell’ordine: record nel journal, commit, copia di A, copia di B. Il crash cade ' + (p.st === 0 ? 'prima del primo passo' : 'subito dopo ' + ['', 'la scrittura dei record', 'il commit', 'la copia di A', 'la copia di B'][p.st]) + '. Dopo il recupero, quanto valgono A e B?',
      opzioni: () => [['vecchi', 'A = 2 e B = 4'], ['misti', 'A = 7 e B = 4'], ['nuovi', 'A = 7 e B = 9']]
    },
    confronto: (pred, esito, p) => { const N = { vecchi: 'A = 2 e B = 4', misti: 'A = 7 e B = 4', nuovi: 'A = 7 e B = 9' }; return 'La previsione indicava ' + N[pred] + '. Dopo il recupero ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 'misti' ? 'Lo stato a metà è proprio ciò che il journal impedisce: ' + (p.st >= 2 ? 'il commit c’è, e il recupero completa entrambe le copie.' : 'senza commit nessuna copia era cominciata.') : esito === 'nuovi' ? 'Il commit era durevole: la transazione è avvenuta, e il recupero rifà le copie mancanti dai record.' : 'Il commit mancava: la transazione viene scartata, anche se i record erano già nel journal.'); },
    costruisci(p) {
      const U = SL.unita663, passi = [], r = U.recupero(p.st), fin = U.disco(p.st);
      const P = (st, fase, atto, titolo, testo, extra) => { const d = U.disco(st), rr = U.recupero(st), a = fase === 'fine' ? rr.A : d.A, b = fase === 'fine' ? rr.B : d.B; passi.push(Object.assign({ atto, titolo, testo, hud: [['A', String(a), 'a'], ['B', String(b), 'c'], ['Commit', d.commit ? 'presente' : 'assente']], els: U.quadro('b', st, fase, { x: 20, y: 4, w: 820 }) }, extra)); };
      const D = ['Il sistema scrive nel journal due record, con i valori finali: «A diventa 7» e «B diventa 9». Le sedi definitive non sono state toccate.', 'Il sistema scrive nel journal il commit. Da questo momento la transazione è confermata, anche se A e B hanno ancora i valori vecchi.', 'Il sistema copia il primo valore nella sede definitiva: A passa da 2 a 7.', 'Il sistema copia il secondo valore nella sede definitiva: B passa da 4 a 9.'];
      P(0, '', 0, 'Prima della transazione', 'A vale 2 e B vale 4. La transazione deve portarli a 7 e a 9, insieme. Il journal è vuoto.', {});
      for (let k = 1; k <= p.st; k++) P(k, '', 0, 'Passo ' + k + ' · ' + U.PASSI[k - 1], D[k - 1], { calc: 'durevole: ' + U.PASSI[k - 1] });
      P(p.st, 'crash', 1, 'Il crash', 'La macchina si arresta' + (p.st === 0 ? ' prima che qualunque scrittura sia avvenuta.' : p.st === 4 ? ' quando tutti i passi erano già durevoli.' : '. I passi successivi non avverranno.') + ' Sul disco, in questo momento, A vale ' + fin.A + ' e B vale ' + fin.B + '.', { calc: 'A = ' + fin.A + ' · B = ' + fin.B, chiedi: { d: 'Al riavvio il sistema leggerà il journal. Quale informazione decide che cosa fare?', o: ['La presenza del commit', 'Il numero dei record', 'Il valore attuale di A'], g: 0, no: 'I record dicono che cosa si voleva fare. Soltanto il commit dice che la transazione era confermata.' } });
      P(p.st, 'legge', 2, 'Il recupero legge il journal', fin.commit ? 'Il sistema riparte e legge il journal. Trova i due record e il commit: la transazione era confermata, e va portata a termine.' : fin.rec ? 'Il sistema riparte e legge il journal. Trova i due record, senza il commit: la transazione era rimasta priva di conferma.' : 'Il sistema riparte e legge il journal. È vuoto: nessuna transazione era in corso.', { calc: fin.commit ? 'commit presente → riapplicare' : 'commit assente → scartare' });
      P(p.st, 'fine', 2, fin.commit ? 'Il recupero riapplica i record' : 'Il recupero scarta la transazione', fin.commit ? 'Il sistema scrive 7 in A e 9 in B, senza chiedersi quali copie fossero già avvenute. ' + (r.cambiati === 0 ? 'Entrambi i blocchi contenevano già i valori finali: le due scritture non cambiano nulla.' : r.cambiati === 1 ? 'A conteneva già 7, e riscriverlo non cambia nulla. B passa da 4 a 9.' : 'A passa da 2 a 7, e B da 4 a 9.') + ' La transazione è completa.' : (fin.rec ? 'I record vengono ignorati. ' : '') + 'Nessuna copia era cominciata, perché le copie vengono dopo il commit: A vale ancora 2 e B vale ancora 4. È come se la transazione non fosse mai stata chiesta.', { calc: fin.commit ? 'immagini riapplicate: 2 · valori cambiati: ' + r.cambiati : 'immagini riapplicate: 0', esito: ['A = ' + r.A + ' · B = ' + r.B, 'si'] });
      return { passi, esito: U.esito(p) };
    }
  },
  bilancio: {
    regola: [
      'Ordine delle scritture: record nel journal, commit, copie nelle sedi definitive.',
      'Al recupero: se il commit è presente si riapplicano tutti i record. Se manca, la transazione si scarta.'
    ],
    errori: [
      ['Decidere guardando i record.', 'I record possono esserci tutti senza che la transazione sia confermata. Decide il commit.'],
      ['Temere di riapplicare una copia già fatta.', 'I record contengono valori finali: riscriverli lascia il blocco nello stesso stato.'],
      ['Copiare nelle sedi definitive prima del commit.', 'Un crash lascerebbe una copia a metà di una transazione che il recupero scarterebbe.']
    ],
    saFare: ['Ricostruire journal e blocchi a un dato punto di crash.', 'Stabilire se il recupero riapplica oppure scarta.', 'Contare quanti valori cambiano durante il recupero.'],
    esercizi: [
      { d: 'Una transazione scrive nel journal i record «P diventa 30» e «Q diventa 12», poi il commit, poi copia P. Il crash cade prima della copia di Q. Prima della transazione P valeva 10 e Q valeva 5. Quanto vale Q dopo il recupero?', segnaposto: 'Un numero', giuste: ['12', 'dodici'],
        ok: 'Il commit è presente: il recupero riapplica i record, e Q diventa 12.',
        diagnosi: [
          { se: ['5', 'cinque'], msg: 'Cinque è il valore sul disco al momento del crash. Il commit c’è, e il recupero completa la copia.' },
          { se: ['30', 'trenta'], msg: 'Trenta è il valore finale di P.' }
        ],
        altro: 'Il valore è diverso. Si controlli se il commit era durevole, e in tal caso applica il record di Q.',
        indizi: ['Il commit è stato scritto prima delle copie.', 'Con il commit presente, il recupero riapplica tutti i record.', 'Il record di Q dice: 12.'],
        svolgimento: ['Commit: presente.', 'Recupero: P = 30, Q = 12.'] },
      { d: 'Nella stessa transazione il crash cade dopo la scrittura dei due record e prima del commit. Quanto vale P dopo il recupero?', segnaposto: 'Un numero', giuste: ['10', 'dieci'],
        ok: 'Senza commit la transazione viene scartata, e P resta 10.',
        diagnosi: [
          { se: ['30', 'trenta'], msg: 'Il record esiste, e il commit manca: la transazione non era confermata.' },
          { se: ['0', 'zero'], msg: 'Scartare una transazione lascia i blocchi come erano.' }
        ],
        altro: 'Il valore è diverso. Senza commit le sedi definitive non sono mai state toccate.',
        indizi: ['Il commit non è durevole.', 'Le copie vengono dopo il commit: nessuna era cominciata.', 'P ha ancora il valore iniziale.'],
        svolgimento: ['Commit: assente.', 'Transazione scartata.', 'P = 10.'] },
      { d: 'Perché i record di un journal redo contengono i valori finali, al posto di istruzioni come «aggiungi 5»?', guida: 'Si scelga la risposta.', o: [
        { t: 'Perché un valore finale si può riscrivere più volte senza cambiare il risultato', ok: true, fb: '«Aggiungi 5», ripetuto dopo una copia già avvenuta, darebbe un valore sbagliato.' },
        { t: 'Perché occupano meno spazio', fb: 'Lo spazio è simile. Conta che cosa accade ripetendo l’operazione.' },
        { t: 'Perché il disco non sa fare somme', fb: 'Le somme le farebbe il sistema. Il problema è la ripetizione dopo un crash.' }] }
    ],
    sfida: ['cslez6_6_04_journaling', 'Registro delle modifiche e commit']
  }
});
