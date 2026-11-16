'use strict';
SL.unita664 = (() => {
  const META = 4;
  const conto = (p) => { const tutto = p.modo === 'completo', nj = (tutto ? p.d : 0) + META, nf = p.d + META; return { tutto, nj, nf, tot: nj + nf, altro: tutto ? p.d + 2 * META : 2 * (p.d + META), unaVolta: p.d + META }; };
  // f: 0 inizio · 1 dati diretti (solo ordinato) · 2 journal · 3 commit · 4 sedi definitive · 5 conto
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], c = conto(p), n = p.d + META, wc = (o.w - (n - 1) * 4) / n, w4 = (o.w - 30) / 4;
    const nome = (k) => (k < p.d ? 'D' + (k + 1) : 'M' + (k - p.d + 1));
    els.push(el.nota(pre + 't0', o.x, o.y, 'IL JOURNAL · ' + (c.tutto ? 'dati e metadati' : 'soltanto i metadati'), 'mono', f === 2 ? 'att' : ''));
    for (let k = 0; k < n; k++) { const va = c.tutto || k >= p.d; els.push(el.cella(pre + 'j' + k, o.x + k * (wc + 4), o.y + 24, wc, 30, f >= 2 && va ? nome(k) : '', f >= 2 && va ? (f === 2 ? 'att' : 'on') : '', { piccola: true, cls: 'minuta' })); }
    els.push(el.nota(pre + 't1', o.x, o.y + 64, 'LE SEDI DEFINITIVE · ogni blocco nella propria posizione nel volume', 'mono', f === 4 || f === 1 ? 'att' : ''));
    for (let k = 0; k < n; k++) { const dato = k < p.d, fatto = dato && !c.tutto ? f >= 1 : f >= 4; els.push(el.cella(pre + 's' + k, o.x + k * (wc + 4), o.y + 88, wc, 30, fatto ? nome(k) : '', fatto ? ((f === 1 && dato) || (f === 4 && (c.tutto || !dato)) ? 'att' : 'on') : '', { piccola: true, cls: 'minuta' })); }
    els.push(el.box(pre + 'q0', o.x, o.y + 130, w4, 54, 'nel journal', f >= 2 ? String(c.nj) : '·', f === 2 ? 'att' : f >= 2 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q1', o.x + w4 + 10, o.y + 130, w4, 54, 'commit', f >= 3 ? 'durevole' : '·', f === 3 ? 'att' : f >= 3 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q2', o.x + 2 * (w4 + 10), o.y + 130, w4, 54, 'sedi definitive', f >= 4 ? String(c.nf) : f >= 1 && !c.tutto ? String(p.d) : '·', f === 4 || (f === 1 && !c.tutto) ? 'att' : f >= 1 && (f >= 4 || !c.tutto) ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q3', o.x + 3 * (w4 + 10), o.y + 130, w4, 54, 'scritture complessive', f >= 5 ? String(c.tot) : '·', f >= 5 ? 'att' : '', { cls: 'stretta' }));
    return els;
  };
  return { META, conto, quadro };
})();
SL.registra('6.6.4', {
  titolo: 'Journaling di dati e metadati: garanzie e costi',
  obiettivo: 'Obiettivo: contare le scritture richieste da due modalità di journaling, e indicare che cosa ciascuna è in grado di ripristinare dopo un crash.',
  concetti: [['journal', 'Tutto nel journal, oppure soltanto i metadati'], ['bilancio', 'Ogni garanzia richiede scritture'], ['scudo', 'Strutture protette, dati soltanto in parte']],
  filigrana: ['journal', 'bilancio', 'storage'],
  richiami: {
    carte: [
      { sim: 'journal', da: 'Dall’unità 6.6.3', t: 'Record, commit, copia', d: 'Prima i valori finali nel journal, quindi il commit, infine le copie nelle sedi definitive.' },
      { sim: 'inode', da: 'Dall’unità 6.5.1', t: 'Dati e metadati', d: 'I dati sono il contenuto del file. I metadati lo descrivono: inode, bit map, directory.' },
      { sim: 'conflitto', da: 'Dall’unità 6.6.1', t: 'L’ordine sicuro', d: 'Un riferimento va reso durevole dopo ciò a cui conduce.' }
    ],
    domanda: { d: 'Prima di proseguire: con il journal dell’unità precedente, quante volte è scritto sul disco ciascun blocco aggiornato?', o: [
      { t: 'Due, una nel journal e una nella sede definitiva', ok: true, fb: 'È il costo della sicurezza: ogni blocco è scritto due volte.' },
      { t: 'Una', fb: 'Una volta soltanto senza journal. In questo caso il blocco è scritto prima nel journal.' },
      { t: 'Tre', fb: 'Il commit è un record a parte. Le copie del blocco restano due.' }
    ] }
  },
  idea: {
    titolo: 'Il contenuto del journal',
    termini: ['checkpoint', 'journaling completo', 'journaling ordinato'],
    testo: [
      'Il journal dell’unità precedente ha un costo evidente: ogni blocco aggiornato è scritto due volte, prima nel journal e quindi nella sede definitiva. L’operazione che esegue le seconde scritture, e libera lo spazio nel journal, prende il nome di [[checkpoint]]. Per un file system che scrive di continuo, il raddoppio di ogni scrittura è un costo elevato. Resta pertanto da stabilire se ogni blocco debba transitare dal journal.',
      'Un aggiornamento di file riguarda due specie di blocchi. I blocchi di dati contengono i byte dell’utente, mentre i blocchi di metadati contengono inode, bit map e directory, cioè le strutture che organizzano il volume. Le incoerenze gravi dell’unità 6.6.1 derivavano tutte dai metadati: un riferimento senza bit, un bit senza riferimento.',
      'La modalità più sicura è il [[journaling completo]]: dati e metadati transitano entrambi dal journal. Dopo un crash con il commit presente, il recupero può riapplicare l’intera transazione, contenuto compreso. Con tre blocchi di dati e quattro di metadati le scritture sono 7 nel journal e 7 nelle sedi definitive, cioè quattordici.',
      { fig: 'scena', w: 720, h: 196, titolo: 'Journaling ordinato: tre blocchi di dati, quattro di metadati', nota: 'I dati sono scritti direttamente nelle sedi definitive, prima del commit. Soltanto i metadati transitano dal journal: 3 + 4 + 4 = 11 scritture.', els: SL.unita664.quadro('g', { d: 3, modo: 'ordinato' }, 5, { x: 10, y: 4, w: 700 }) },
      'La modalità più diffusa riduce le scritture dei dati, e prende il nome di [[journaling ordinato]]. I blocchi di dati sono scritti una volta sola, direttamente nelle sedi definitive, e soltanto i metadati transitano dal journal. Il termine «ordinato» indica la regola che rende sicuro lo schema: i dati devono essere durevoli prima del commit dei metadati che li indicano. È la medesima regola dell’unità 6.6.1: il riferimento è pubblicato dopo il contenuto a cui conduce. Con il medesimo carico le scritture scendono a 3 + 2 × 4 = 11.',
      'Le due modalità offrono garanzie diverse. In entrambe le strutture del volume restano coerenti dopo ogni crash, senza scansioni complete. Con il journaling completo anche il contenuto dei file è interamente precedente oppure interamente nuovo. Con quello ordinato un crash prima del commit può lasciare nei blocchi già assegnati al file una parte dei dati nuovi, mentre i metadati descrivono ancora lo stato precedente. Nessun file espone byte altrui, e il volume è integro. Il contenuto di un file sovrascritto in parte può tuttavia risultare misto.'
    ]
  },
  esperimento: {
    faremo: [
      'Un aggiornamento riguarda alcuni blocchi di dati e quattro blocchi di metadati. I controlli fissano la modalità di journaling, e il numero dei blocchi di dati.',
      'L’esperimento segue le scritture di ogni blocco, e le conta. È istruttivo aumentare i blocchi di dati, e osservare la crescita della differenza fra le due modalità.'
    ],
    vedrai: [
      ['journal', 'Il journal', 'In alto: i blocchi scritti nel journal. D indica un blocco di dati, M uno di metadati.'],
      ['storage', 'Le sedi definitive', 'Al centro: i blocchi scritti nella propria posizione nel volume.'],
      ['bilancio', 'Il totale', 'In basso: le scritture nel journal, il commit, le scritture nelle sedi definitive, e il totale.']
    ]
  },
  lab: {
    titolo: 'Contare le scritture di un aggiornamento',
    scena: { w: 860, h: 196 },
    atti: ['Il carico', 'Prima del commit', 'Dopo il commit', 'Il totale'],
    controlli: [
      { id: 'modo', tipo: 'scelta', eti: 'Modalità', opzioni: [['completo', 'journaling completo: dati e metadati'], ['ordinato', 'journaling ordinato: soltanto metadati']], valore: 'completo' },
      { id: 'd', tipo: 'scelta', eti: 'Blocchi di dati', opzioni: [[3, '3'], [8, '8']], valore: 3 }
    ],
    nota: 'Il numero dei passi dipende dalla modalità. I blocchi di metadati sono sempre quattro. Il conteggio esclude i record di servizio, come il commit.',
    previsione: {
      domanda: (p) => 'Un aggiornamento comprende ' + p.d + ' blocchi di dati e 4 blocchi di metadati. La modalità è ' + (p.modo === 'completo' ? 'il journaling completo: tutti i blocchi transitano dal journal.' : 'il journaling ordinato: i dati sono scritti direttamente nelle sedi definitive, e soltanto i metadati transitano dal journal.') + ' Quante scritture di blocco occorrono complessivamente, senza contare il commit?',
      opzioni: (p) => { const c = SL.unita664.conto(p); return [c.unaVolta, Math.min(c.tot, c.altro), Math.max(c.tot, c.altro)].map((v) => [v, String(v)]); }
    },
    confronto: (pred, esito, p) => { const c = SL.unita664.conto(p); return 'La previsione indicava ' + pred + ' scritture. Le scritture sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === c.unaVolta ? 'Questo sarebbe il totale senza journal. ' + (c.tutto ? 'In questo caso ogni blocco è scritto due volte.' : 'In questo caso i quattro blocchi di metadati sono scritti due volte.') : c.tutto ? 'Nel journaling completo anche i dati transitano dal journal: 2 × (' + p.d + ' + 4).' : 'Nel journaling ordinato i dati sono scritti una volta sola: ' + p.d + ' + 2 × 4.'); },
    costruisci(p) {
      const U = SL.unita664, c = U.conto(p), passi = [];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Nel journal', f >= 2 ? String(c.nj) : '·', 'a'], ['Sedi definitive', f >= 4 ? String(c.nf) : f >= 1 && !c.tutto ? String(p.d) : '·'], ['Totale', f >= 5 ? String(c.tot) : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'Il carico', 'Un programma ha esteso un file. Vanno resi durevoli ' + p.d + ' blocchi di dati, D1 e seguenti, e 4 blocchi di metadati, da M1 a M4: inode, bit map e directory.', {});
      if (!c.tutto) P(1, 1, 'I dati nelle sedi definitive', 'Nel journaling ordinato i ' + p.d + ' blocchi di dati sono scritti immediatamente nelle sedi definitive, senza transitare dal journal. Devono essere durevoli prima del commit: ' + p.d + ' scritture.', { calc: 'dati nelle sedi definitive: ' + p.d });
      P(2, 1, 'Le scritture nel journal', c.tutto ? 'Nel journaling completo tutti i blocchi sono scritti nel journal: ' + p.d + ' di dati e 4 di metadati, cioè ' + c.nj + ' scritture.' : 'Nel journal sono scritti soltanto i 4 blocchi di metadati: 4 scritture.', { calc: 'nel journal: ' + c.nj, chiedi: { d: 'Se il crash avvenisse in questo momento, prima del commit, quale azione compirebbe il recupero?', o: ['Scarterebbe la transazione', 'Riapplicherebbe i blocchi del journal'], g: 0, no: 'Senza commit la transazione non è confermata, e il journal è ignorato.' } });
      P(3, 1, 'Il commit', 'Il sistema scrive il commit. La transazione è confermata. ' + (c.tutto ? 'Da questo momento dati e metadati sono protetti da un crash, poiché si trovano entrambi nel journal.' : 'I metadati sono protetti nel journal, e i dati che essi indicano sono già nelle sedi definitive.'), { calc: 'commit durevole' });
      P(4, 2, 'Il checkpoint', c.tutto ? 'In un momento successivo il sistema copia i ' + c.nf + ' blocchi dal journal alle sedi definitive: altre ' + c.nf + ' scritture. Lo spazio nel journal è quindi liberato.' : 'Il sistema copia i 4 blocchi di metadati dal journal alle sedi definitive: altre 4 scritture. I dati erano già nelle sedi definitive.', { calc: 'nelle sedi definitive: ' + c.nf });
      P(5, 3, 'Il totale', c.tutto ? 'Complessivamente ' + c.nj + ' + ' + c.nf + ' = ' + c.tot + ' scritture: due per ogni blocco. A fronte di tale costo, dopo un crash il recupero può ripristinare anche il contenuto dei file.' : 'Complessivamente ' + p.d + ' + 4 + 4 = ' + c.tot + ' scritture: una per ogni blocco di dati, due per ogni blocco di metadati. Rispetto al journaling completo se ne risparmiano ' + p.d + ', quanti sono i blocchi di dati. A fronte di tale risparmio, il journal può ripristinare soltanto le strutture: il contenuto dei file è escluso dalla sua protezione.', { calc: c.tutto ? '2 × (' + p.d + ' + 4) = ' + c.tot : p.d + ' + 2 × 4 = ' + c.tot, esito: [c.tot + ' scritture', ''] });
      return { passi, esito: c.tot };
    }
  },
  bilancio: {
    regola: [
      'Journaling completo: scritture = 2 × (blocchi di dati + blocchi di metadati).',
      'Journaling ordinato: scritture = blocchi di dati + 2 × blocchi di metadati, con i dati resi durevoli prima del commit.'
    ],
    errori: [
      ['Ritenere che il journaling ordinato protegga il contenuto dei file.', 'Il journaling ordinato protegge le strutture. I dati sono scritti una volta sola, all’esterno del journal.'],
      ['Scrivere il commit prima dei dati, nella modalità ordinata.', 'I metadati confermati indicherebbero blocchi in cui i dati non sono ancora stati scritti.'],
      ['Contare il commit fra le scritture di blocco.', 'Il commit è un record di servizio: il conteggio riguarda i blocchi del carico.']
    ],
    saFare: ['Contare le scritture del journaling completo.', 'Contare le scritture del journaling ordinato.', 'Confrontare ciò che le due modalità ripristinano dopo un crash.'],
    esercizi: [
      { d: 'Un aggiornamento comprende 10 blocchi di dati e 2 di metadati. Quante scritture di blocco richiede il journaling completo?', segnaposto: 'Un numero', giuste: ['24', 'ventiquattro'],
        ok: '2 × (10 + 2) = 24.',
        diagnosi: [
          { se: ['12', 'dodici'], msg: 'Dodici sono i blocchi, e ciascuno è scritto due volte.' },
          { se: ['14', 'quattordici'], msg: 'Questo è il totale del journaling ordinato. In quello completo anche i dati transitano dal journal.' }
        ],
        altro: 'Il numero è diverso. Ogni blocco è scritto nel journal e quindi nella sede definitiva.',
        indizi: ['Blocchi complessivi: 10 + 2 = 12.', 'Ogni blocco: due scritture.', '2 × 12 = 24.'],
        svolgimento: ['Nel journal: 12.', 'Nelle sedi definitive: 12.', 'Totale: 24.'] },
      { d: 'Per il medesimo aggiornamento, quante scritture risparmia il journaling ordinato rispetto a quello completo?', segnaposto: 'Un numero', giuste: ['10', 'dieci'],
        ok: 'Ordinato: 10 + 2 × 2 = 14. Completo: 24. Il risparmio è 10, quanti i blocchi di dati.',
        diagnosi: [
          { se: ['14', 'quattordici'], msg: 'Quattordici sono le scritture del journaling ordinato. La domanda riguarda la differenza.' },
          { se: ['2', 'due'], msg: 'I metadati sono scritti due volte in entrambe le modalità. Varia il trattamento dei dati.' }
        ],
        altro: 'Il numero è diverso. Si calcolino i due totali e si sottragga.',
        indizi: ['Completo: 24 scritture.', 'Ordinato: 10 + 4 = 14 scritture.', '24 − 14 = 10.'],
        svolgimento: ['Completo: 24.', 'Ordinato: 14.', 'Risparmio: 10.'] },
      { d: 'Nel journaling ordinato, per quale ragione i dati devono essere durevoli prima del commit?', guida: 'Si scelga la risposta.', o: [
        { t: 'I metadati confermati non devono indicare blocchi ancora privi dei dati', ok: true, fb: 'Altrimenti, dopo un crash, un file esporrebbe byte precedenti di altri file.' },
        { t: 'Il journal è troppo piccolo per contenerli', fb: 'La dimensione del journal è irrilevante. È determinante l’ordine fra dati e riferimenti.' },
        { t: 'I dati sono meno importanti dei metadati', fb: 'L’ordine ha lo scopo di proteggere i programmi che leggeranno tali dati.' }] }
    ],
    sfida: ['cslez6_6_05_crash_recovery', 'Recupero dopo un arresto']
  }
});
