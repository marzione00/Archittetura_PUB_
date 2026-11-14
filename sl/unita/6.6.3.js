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
    els.push(el.cella(pre + 'j0', o.x, o.y + 24, w3, 32, d.rec ? 'A diviene 7' : '', d.rec ? (fase === 'legge' ? 'att' : fine && !d.commit ? 'off' : 'on') : '', { gi: 'record di A', piccola: true }));
    els.push(el.cella(pre + 'j1', o.x + w3 + 10, o.y + 24, w3, 32, d.rec ? 'B diviene 9' : '', d.rec ? (fase === 'legge' ? 'att' : fine && !d.commit ? 'off' : 'on') : '', { gi: 'record di B', piccola: true }));
    els.push(el.cella(pre + 'j2', o.x + 2 * (w3 + 10), o.y + 24, w3, 32, d.commit ? 'commit' : fase === 'legge' || fine ? 'assente' : '', d.commit ? (fase === 'legge' ? 'att' : 'on') : fase === 'legge' || fine ? 'err' : '', { gi: 'conferma', piccola: true }));
    els.push(el.box(pre + 'a', o.x, o.y + 84, w2, 54, 'blocco A · sede definitiva', String(fine ? r.A : d.A), fine && r.A !== d.A ? 'att' : (fine ? r.A : d.A) === A1 ? 'on' : 'zero', { cls: 'stretta' }));
    els.push(el.box(pre + 'b', o.x + w2 + 10, o.y + 84, w2, 54, 'blocco B · sede definitiva', String(fine ? r.B : d.B), fine && r.B !== d.B ? 'att' : (fine ? r.B : d.B) === B1 ? 'on' : 'zero', { cls: 'stretta' }));
    return els;
  };
  return { A0, B0, A1, B1, PASSI, disco, recupero, esito, quadro };
})();
SL.registra('6.6.3', {
  titolo: 'Journal redo e soglia del commit durevole',
  obiettivo: 'Obiettivo: stabilire, per ogni punto in cui può avvenire un crash, l’azione del recupero di un journal: riapplicare la transazione, oppure scartarla.',
  concetti: [['journal', 'Prima la registrazione, quindi l’esecuzione'], ['scudo', 'Il commit è la soglia'], ['riproduci', 'Riapplicare è innocuo']],
  filigrana: ['journal', 'scudo', 'riproduci'],
  richiami: {
    carte: [
      { sim: 'conflitto', da: 'Dall’unità 6.6.1', t: 'Il prefisso durevole', d: 'Dopo un crash sopravvivono le prime scritture, fino al punto dell’arresto.' },
      { sim: 'journal', da: 'Dall’unità 5.7.4', t: 'La transazione sui dati', d: 'Un gruppo di modifiche che vale come una sola: o avvengono tutte, o nessuna.' },
      { sim: 'lente', da: 'Dall’unità 6.6.2', t: 'La scansione completa', d: 'Il ripristino della coerenza fra le strutture, in un tempo che cresce con il volume, e senza conoscenza dello scopo dell’operazione interrotta.' }
    ],
    domanda: { d: 'Prima di proseguire: un aggiornamento deve modificare due blocchi, A e B, con due scritture separate, e il crash avviene fra le due. Che cosa trova il riavvio?', o: [
      { t: 'A con il valore nuovo e B con quello precedente', ok: true, fb: 'È uno stato intermedio, che l’aggiornamento non intendeva produrre.' },
      { t: 'Entrambi con il valore nuovo', fb: 'La scrittura di B non è mai avvenuta.' },
      { t: 'Entrambi con il valore precedente', fb: 'La scrittura di A era già durevole.' }
    ] }
  },
  idea: {
    titolo: 'Due scritture, per escludere gli stati intermedi',
    termini: ['journal', 'commit', 'redo', 'idempotenza'],
    testo: [
      'L’unità 6.6.1 ha presentato il problema: un’operazione composta da più scritture può essere interrotta in uno stato intermedio. L’unità 6.6.2 ha presentato un rimedio costoso, la scansione dell’intero volume. Esiste un rimedio più efficiente, fondato su un principio generale: prima di eseguire un’operazione critica, se ne registra la descrizione in un’area apposita.',
      'Tale area è il [[journal]], una zona riservata del disco. Si supponga di dover modificare il blocco A da 2 a 7 e il blocco B da 4 a 9, come una sola transazione. Il sistema scrive anzitutto nel journal due record, con i valori finali: «A diviene 7», «B diviene 9». Le sedi definitive dei blocchi restano per ora invariate. Il sistema scrive quindi nel journal un terzo record, di dimensioni minime, che dichiara completa la transazione: è il [[commit]].',
      'Soltanto dopo il commit il sistema copia i valori nelle sedi definitive, prima A e quindi B. L’ordine complessivo è pertanto: record, commit, copia di A, copia di B. Il commit è una scrittura singola, e pertanto atomica: è presente oppure assente. Il commit costituisce la soglia: prima di esso la transazione risulta mai richiesta, e dopo di esso risulta avvenuta per intero, anche se le copie devono ancora essere eseguite.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Crash dopo la copia di A: il commit è presente, e B ha ancora il valore precedente', nota: 'Il journal contiene i due record e il commit. La sede definitiva di A vale già 7, quella di B vale ancora 4: il recupero completerà il lavoro.', els: SL.unita663.quadro('g', 3, 'crash', { x: 10, y: 4, w: 700 }) },
      'Si consideri ogni possibile punto di crash. Al riavvio il sistema legge il journal. Se il commit è assente, la transazione è scartata: i record descrivono soltanto un’intenzione, e le sedi definitive hanno ancora i valori precedenti, poiché nessuna copia era iniziata. Se il commit è presente, il sistema esegue di nuovo le copie leggendo i record: scrive 7 in A e 9 in B. Tale modalità di recupero, che riapplica le modifiche registrate, prende il nome di [[redo]].',
      'Al recupero è superfluo determinare quali copie fossero già avvenute: sono eseguite di nuovo tutte. Se A conteneva già 7, una nuova scrittura di 7 lascia il blocco invariato. Un’operazione ripetibile un numero arbitrario di volte con il medesimo risultato gode di [[idempotenza]], e per questa ragione i record contengono valori finali, in luogo di istruzioni come «aggiungi 5». Ne segue che il riavvio trova sempre uno di due stati: tutti i valori precedenti, oppure tutti i valori nuovi. Lo stato intermedio non è più possibile.'
    ]
  },
  esperimento: {
    faremo: [
      'Una transazione porta A da 2 a 7 e B da 4 a 9, in quattro passi: record nel journal, commit, copia di A, copia di B. I controlli fissano il passo dopo il quale avviene il crash.',
      'L’esperimento segue i passi fino al crash, e quindi il recupero: la lettura del journal, la decisione, e i valori finali. È istruttivo confrontare un crash immediatamente precedente al commit con uno immediatamente successivo.'
    ],
    vedrai: [
      ['journal', 'Il journal', 'In alto: i due record con i valori finali, e la cella del commit.'],
      ['storage', 'Le sedi definitive', 'In basso: i valori dei blocchi A e B presenti sul disco.']
    ]
  },
  lab: {
    titolo: 'Un crash, e il recupero dal journal',
    scena: { w: 860, h: 150 },
    atti: ['La transazione', 'Il crash', 'Il recupero'],
    controlli: [
      { id: 'st', tipo: 'scelta', eti: 'Ultimo passo durevole prima del crash', opzioni: [[0, 'nessuno'], [1, 'i record nel journal'], [2, 'il commit'], [3, 'la copia di A'], [4, 'la copia di B']], valore: 3 }
    ],
    nota: 'Il numero dei passi dipende dal punto del crash. A vale 2 e deve assumere il valore 7, B vale 4 e deve assumere il valore 9.',
    previsione: {
      domanda: (p) => 'Una transazione deve portare A da 2 a 7 e B da 4 a 9. I passi sono, nell’ordine: record nel journal, commit, copia di A, copia di B. Il crash avviene ' + (p.st === 0 ? 'prima del primo passo' : 'immediatamente dopo ' + ['', 'la scrittura dei record', 'il commit', 'la copia di A', 'la copia di B'][p.st]) + '. Dopo il recupero, quanto valgono A e B?',
      opzioni: () => [['vecchi', 'A = 2 e B = 4'], ['misti', 'A = 7 e B = 4'], ['nuovi', 'A = 7 e B = 9']]
    },
    confronto: (pred, esito, p) => { const N = { vecchi: 'A = 2 e B = 4', misti: 'A = 7 e B = 4', nuovi: 'A = 7 e B = 9' }; return 'La previsione indicava ' + N[pred] + '. Dopo il recupero ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 'misti' ? 'Lo stato intermedio è quello che il journal esclude: ' + (p.st >= 2 ? 'il commit è presente, e il recupero completa entrambe le copie.' : 'senza commit nessuna copia era iniziata.') : esito === 'nuovi' ? 'Il commit era durevole: la transazione è avvenuta, e il recupero esegue di nuovo le copie a partire dai record.' : 'Il commit era assente: la transazione è scartata, anche se i record erano già nel journal.'); },
    costruisci(p) {
      const U = SL.unita663, passi = [], r = U.recupero(p.st), fin = U.disco(p.st);
      const P = (st, fase, atto, titolo, testo, extra) => { const d = U.disco(st), rr = U.recupero(st), a = fase === 'fine' ? rr.A : d.A, b = fase === 'fine' ? rr.B : d.B; passi.push(Object.assign({ atto, titolo, testo, hud: [['A', String(a), 'a'], ['B', String(b), 'c'], ['Commit', d.commit ? 'presente' : 'assente']], els: U.quadro('b', st, fase, { x: 20, y: 4, w: 820 }) }, extra)); };
      const D = ['Il sistema scrive nel journal due record, con i valori finali: «A diviene 7» e «B diviene 9». Le sedi definitive sono invariate.', 'Il sistema scrive nel journal il commit. Da questo momento la transazione è confermata, anche se A e B hanno ancora i valori precedenti.', 'Il sistema copia il primo valore nella sede definitiva: A passa da 2 a 7.', 'Il sistema copia il secondo valore nella sede definitiva: B passa da 4 a 9.'];
      P(0, '', 0, 'Prima della transazione', 'A vale 2 e B vale 4. La transazione deve modificarli congiuntamente in 7 e in 9. Il journal è vuoto.', {});
      for (let k = 1; k <= p.st; k++) P(k, '', 0, 'Passo ' + k + ' · ' + U.PASSI[k - 1], D[k - 1], { calc: 'durevole: ' + U.PASSI[k - 1] });
      P(p.st, 'crash', 1, 'Il crash', 'La macchina si arresta' + (p.st === 0 ? ' prima che qualunque scrittura sia avvenuta.' : p.st === 4 ? ' quando tutti i passi erano già durevoli.' : '. I passi successivi non avverranno.') + ' Sul disco, in questo momento, A vale ' + fin.A + ' e B vale ' + fin.B + '.', { calc: 'A = ' + fin.A + ' · B = ' + fin.B, chiedi: { d: 'Al riavvio il sistema leggerà il journal. Quale informazione determina l’azione del recupero?', o: ['La presenza del commit', 'Il numero dei record', 'Il valore attuale di A'], g: 0, no: 'I record descrivono le modifiche previste. Soltanto il commit indica che la transazione era confermata.' } });
      P(p.st, 'legge', 2, 'Il recupero legge il journal', fin.commit ? 'Il sistema è riavviato e legge il journal, in cui trova i due record e il commit: la transazione era confermata, e va completata.' : fin.rec ? 'Il sistema è riavviato e legge il journal, in cui trova i due record, senza il commit: la transazione era priva di conferma.' : 'Il sistema è riavviato e legge il journal, che è vuoto: nessuna transazione era in corso.', { calc: fin.commit ? 'commit presente → riapplicare' : 'commit assente → scartare' });
      P(p.st, 'fine', 2, fin.commit ? 'Il recupero riapplica i record' : 'Il recupero scarta la transazione', fin.commit ? 'Il sistema scrive 7 in A e 9 in B, senza determinare quali copie fossero già avvenute. ' + (r.cambiati === 0 ? 'Entrambi i blocchi contenevano già i valori finali: le due scritture lasciano i blocchi invariati.' : r.cambiati === 1 ? 'A conteneva già 7, e la nuova scrittura lo lascia invariato. B passa da 4 a 9.' : 'A passa da 2 a 7, e B da 4 a 9.') + ' La transazione è completa.' : (fin.rec ? 'I record sono ignorati. ' : '') + 'Nessuna copia era iniziata, poiché le copie seguono il commit: A vale ancora 2 e B vale ancora 4. La transazione risulta mai richiesta.', { calc: fin.commit ? 'immagini riapplicate: 2 · valori modificati: ' + r.cambiati : 'immagini riapplicate: 0', esito: ['A = ' + r.A + ' · B = ' + r.B, 'si'] });
      return { passi, esito: U.esito(p) };
    }
  },
  bilancio: {
    regola: [
      'Ordine delle scritture: record nel journal, commit, copie nelle sedi definitive.',
      'Al recupero: se il commit è presente si riapplicano tutti i record. Se è assente, la transazione è scartata.'
    ],
    errori: [
      ['Decidere in base ai record.', 'I record possono essere tutti presenti senza che la transazione sia confermata: è determinante il commit.'],
      ['Ritenere dannosa la riapplicazione di una copia già eseguita.', 'I record contengono valori finali: la loro riscrittura lascia il blocco nel medesimo stato.'],
      ['Copiare nelle sedi definitive prima del commit.', 'Un crash lascerebbe una copia parziale di una transazione che il recupero scarterebbe.']
    ],
    saFare: ['Ricostruire journal e blocchi a un dato punto di crash.', 'Stabilire se il recupero riapplica oppure scarta.', 'Contare i valori modificati durante il recupero.'],
    esercizi: [
      { d: 'Una transazione scrive nel journal i record «P diviene 30» e «Q diviene 12», quindi il commit, e quindi copia P. Il crash avviene prima della copia di Q. Prima della transazione P valeva 10 e Q valeva 5. Quanto vale Q dopo il recupero?', segnaposto: 'Un numero', giuste: ['12', 'dodici'],
        ok: 'Il commit è presente: il recupero riapplica i record, e Q assume il valore 12.',
        diagnosi: [
          { se: ['5', 'cinque'], msg: 'Cinque è il valore sul disco al momento del crash. Il commit è presente, e il recupero completa la copia.' },
          { se: ['30', 'trenta'], msg: 'Trenta è il valore finale di P.' }
        ],
        altro: 'Il valore è diverso. Si controlli se il commit era durevole, e in tal caso si applichi il record di Q.',
        indizi: ['Il commit è stato scritto prima delle copie.', 'Con il commit presente, il recupero riapplica tutti i record.', 'Il record di Q indica 12.'],
        svolgimento: ['Commit: presente.', 'Recupero: P = 30, Q = 12.'] },
      { d: 'Nella medesima transazione il crash avviene dopo la scrittura dei due record e prima del commit. Quanto vale P dopo il recupero?', segnaposto: 'Un numero', giuste: ['10', 'dieci'],
        ok: 'Senza commit la transazione è scartata, e P resta 10.',
        diagnosi: [
          { se: ['30', 'trenta'], msg: 'Il record esiste, e il commit è assente: la transazione era priva di conferma.' },
          { se: ['0', 'zero'], msg: 'Lo scarto di una transazione lascia i blocchi invariati.' }
        ],
        altro: 'Il valore è diverso. Senza commit le sedi definitive non sono mai state modificate.',
        indizi: ['Il commit non è durevole.', 'Le copie seguono il commit: nessuna era iniziata.', 'P ha ancora il valore iniziale.'],
        svolgimento: ['Commit: assente.', 'Transazione scartata.', 'P = 10.'] },
      { d: 'Per quale ragione i record di un journal redo contengono i valori finali, in luogo di istruzioni come «aggiungi 5»?', guida: 'Si scelga la risposta.', o: [
        { t: 'Un valore finale può essere riscritto più volte senza modificare il risultato', ok: true, fb: '«Aggiungi 5», ripetuto dopo una copia già avvenuta, produrrebbe un valore errato.' },
        { t: 'I valori finali occupano meno spazio', fb: 'Lo spazio è simile. È rilevante l’effetto della ripetizione dell’operazione.' },
        { t: 'Il disco non è in grado di eseguire somme', fb: 'Le somme sarebbero eseguite dal sistema. La difficoltà riguarda la ripetizione dopo un crash.' }] }
    ],
    sfida: ['cslez6_6_04_journaling', 'Registro delle modifiche e commit']
  }
});
