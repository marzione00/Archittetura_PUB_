'use strict';
SL.unita623 = (() => {
  const SEQ = ['A', 'B', 'A', 'C', 'D', 'A', 'C'], FIN = 4;
  // Simulazione: per ogni richiesta lo stato dei frame, con l'istante di carico e di ultimo uso
  const simula = (p) => { const fr = [], S = []; let fault = 0; SEQ.forEach((pg, t) => { let i = fr.findIndex((x) => x.pg === pg), ok = i >= 0, esce = ''; if (ok) fr[i].uso = t; else { fault++; if (fr.length < p.f) fr.push({ pg, carico: t, uso: t }); else { const chiave = p.pol === 'lru' ? 'uso' : 'carico'; let v = 0; fr.forEach((x, k) => { if (x[chiave] < fr[v][chiave]) v = k; }); esce = fr[v].pg; fr[v] = { pg, carico: t, uso: t }; } } const fin = SEQ.slice(Math.max(0, t - FIN + 1), t + 1), ws = fin.filter((x, k) => fin.indexOf(x) === k); S.push({ pg, ok, esce, fault, fr: fr.map((x) => Object.assign({}, x)), ws }); }); return S; };
  const fault = (p) => { const S = simula(p); return S[S.length - 1].fault; };
  const quadro = (pre, p, fatti, o) => {
    const el = SL.el, els = [], S = simula(p), ora = fatti ? S[fatti - 1] : null, wc = (o.w - 6 * 6) / 7, wf = (o.w * 0.62 - (p.f - 1) * 10) / p.f, xw = o.x + o.w * 0.62 + 10, ww = o.w * 0.38 - 10;
    els.push(el.nota(pre + 't0', o.x, o.y, 'LE RICHIESTE · una pagina per volta', 'mono'));
    SEQ.forEach((pg, k) => els.push(el.cella(pre + 's' + k, o.x + k * (wc + 6), o.y + 44, wc, 34, pg, k < fatti ? (k === fatti - 1 ? 'att' : S[k].ok ? 'on' : 'err') : '', { so: 'richiesta ' + (k + 1), gi: k < fatti ? (S[k].ok ? 'presente' : 'page fault') : '', piccola: true })));
    els.push(el.nota(pre + 't1', o.x, o.y + 104, p.pol === 'lru' ? 'I FRAME · pagina, e richiesta del suo ultimo uso' : 'I FRAME · pagina, e richiesta in cui è stata caricata', 'mono'));
    for (let i = 0; i < p.f; i++) { const x = ora && ora.fr[i]; els.push(el.box(pre + 'f' + i, o.x + i * (wf + 10), o.y + 128, wf, 54, 'frame ' + i, x ? x.pg + ' · ' + ((p.pol === 'lru' ? x.uso : x.carico) + 1) : 'libero', x ? (x.pg === ora.pg ? (ora.ok ? 'on' : 'att') : 'on') : '', { cls: 'stretta' })); }
    els.push(el.box(pre + 'w', xw, o.y + 128, ww, 54, 'insieme di lavoro · ultime 4', ora ? ora.ws.join(', ') + ' · ' + ora.ws.length + (ora.ws.length === 1 ? ' pagina' : ' pagine') : '·', ora && ora.ws.length > p.f ? 'err' : ora ? 'zero' : '', { cls: 'stretta' }));
    return els;
  };
  return { SEQ, simula, fault, quadro };
})();
SL.registra('6.2.3', {
  titolo: 'Insieme di lavoro e rimpiazzo',
  obiettivo: 'Obiettivo: seguire una sequenza di richieste di pagine con un numero limitato di frame, scegliere la pagina da sostituire secondo una politica, e misurare l’insieme di lavoro.',
  concetti: [['memory', 'Più pagine che frame'], ['clock', 'Esce chi non serve da più tempo'], ['riproduci', 'Le pagine usate di recente']],
  filigrana: ['memory', 'clock', 'riproduci'],
  richiami: {
    carte: [
      { sim: 'interrupt', da: 'Dall’unità 6.2.2', t: 'Il page fault', d: 'L’accesso a una pagina assente interrompe l’istruzione, e il kernel carica la pagina.' },
      { sim: 'clock', da: 'Dall’unità 6.1.2', t: 'La località temporale', d: 'Un dato appena usato verrà probabilmente usato di nuovo fra poco.' },
      { sim: 'conflitto', da: 'Dall’unità 6.1.2', t: 'Scacciare un blocco', d: 'Quando il posto è occupato, chi entra fa uscire qualcun altro.' }
    ],
    domanda: { d: 'Prima di proseguire: la RAM ha 3 frame liberi, e un programma tocca per la prima volta le pagine A, B e C. Quanti page fault avvengono?', o: [
      { t: 'Tre: uno per ogni pagina toccata per la prima volta', ok: true, fb: 'Ogni pagina assente va caricata, e per ciascuna c’è un frame libero.' },
      { t: 'Nessuno: i frame sono liberi', fb: 'Un frame libero rende possibile il caricamento. La pagina va comunque caricata.' },
      { t: 'Uno soltanto', fb: 'Le pagine sono tre, e nessuna era in RAM.' }
    ] }
  },
  idea: {
    titolo: 'Quando i frame finiscono, qualcuno deve uscire',
    termini: ['rimpiazzo di pagina', 'lru', 'insieme di lavoro'],
    testo: [
      'Finora il kernel ha sempre trovato un frame libero per la pagina da caricare. I frame però sono in numero finito, e i processi nel loro insieme usano molte più pagine di quante la RAM ne possa ospitare. Quando arriva un page fault e i frame sono tutti occupati, il kernel deve fare posto: sceglie una pagina residente, la toglie dalla RAM, e mette al suo posto quella richiesta. È il [[rimpiazzo di pagina]].',
      'La scelta conta molto. Se la pagina tolta viene richiesta subito dopo, si paga un altro page fault, e un page fault costa quanto milioni di istruzioni. L’ideale sarebbe togliere la pagina che servirà più tardi di tutte. Il kernel però ignora il futuro. Può guardare il passato, e scommettere sulla località temporale: una pagina che non viene usata da molto tempo probabilmente non servirà presto.',
      'Da questa scommessa nasce la politica [[lru|LRU]], dall’inglese least recently used: esce la pagina il cui ultimo uso è il più lontano nel tempo. Una politica più sbrigativa, FIFO, fa uscire la pagina caricata per prima, senza guardare se nel frattempo è stata usata. Le due politiche scelgono la stessa vittima in molti casi, e si separano proprio quando una pagina vecchia è ancora in uso.',
      { fig: 'scena', w: 720, h: 190, titolo: 'LRU con tre frame: all’arrivo di D esce B', nota: 'A è stata caricata per prima, ed è stata riusata alla terza richiesta. La pagina ferma da più tempo è B.', els: SL.unita623.quadro('g', { f: 3, pol: 'lru' }, 5, { x: 10, y: 4, w: 700 }) },
      'Seguiamo la sequenza A, B, A, C, D, A, C con tre frame. Le prime richieste caricano A, B e C: tre page fault, con la seconda richiesta di A che trova la pagina già presente. Arriva D, e i frame sono pieni. Con LRU si guarda l’ultimo uso: B alla richiesta 2, A alla 3, C alla 4. Esce B. Le richieste successive, A e C, trovano le loro pagine: in tutto quattro page fault. Con FIFO sarebbe uscita A, la più vecchia per caricamento, e la richiesta successiva di A avrebbe causato un quinto page fault.',
      'Resta una domanda: quanti frame servono a un programma per lavorare bene. La risposta viene dall’[[insieme di lavoro]], cioè l’insieme delle pagine distinte toccate nelle ultime richieste. Se guardiamo le ultime quattro richieste della sequenza, C, D, A, C, le pagine distinte sono tre. Con tre frame il programma tiene in RAM tutto ciò che gli sta servendo. Con due frame non può, e continua a scacciare pagine che gli serviranno un attimo dopo.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma chiede, nell’ordine, le pagine A, B, A, C, D, A, C. Sceglierai quanti frame ha a disposizione, e quale politica decide chi esce quando i frame sono pieni.',
      'A ogni richiesta guarderemo se la pagina è presente, e in caso contrario chi le cede il posto. A destra terremo aggiornato l’insieme di lavoro delle ultime quattro richieste.'
    ],
    vedrai: [
      ['riproduci', 'Le richieste', 'In alto: le sette richieste. Sotto ciascuna, già eseguita, l’esito: pagina presente oppure page fault.'],
      ['memory', 'I frame', 'In basso a sinistra: la pagina in ogni frame, seguita dal numero della richiesta in cui è stata usata per l’ultima volta, oppure caricata, secondo la politica.'],
      ['clock', 'L’insieme di lavoro', 'In basso a destra: le pagine distinte nelle ultime quattro richieste.']
    ]
  },
  lab: {
    titolo: 'Sette richieste, pochi frame',
    scena: { w: 860, h: 190 },
    atti: ['I frame vuoti', 'Le richieste', 'Il conto'],
    controlli: [
      { id: 'f', tipo: 'scelta', eti: 'Frame disponibili', opzioni: [[2, '2'], [3, '3'], [4, '4']], valore: 3 },
      { id: 'pol', tipo: 'scelta', eti: 'Politica di rimpiazzo', opzioni: [['lru', 'LRU · esce la meno usata di recente'], ['fifo', 'FIFO · esce la prima caricata']], valore: 'lru' }
    ],
    nota: 'I passi sono sempre nove. Le richieste sono sempre A, B, A, C, D, A, C.',
    previsione: {
      domanda: (p) => 'Un programma chiede le pagine A, B, A, C, D, A, C. I frame sono ' + p.f + ', all’inizio liberi. Quando sono tutti occupati, la politica ' + (p.pol === 'lru' ? 'LRU fa uscire la pagina usata meno di recente' : 'FIFO fa uscire la pagina caricata per prima') + '. Quanti page fault avvengono in tutto?',
      opzioni: () => [4, 5, 6].map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' page fault. I page fault sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.f === 4 ? 'Le pagine distinte sono quattro, e i frame bastano per tutte: un page fault per pagina, e nessun rimpiazzo.' : p.f === 2 ? 'Con due frame ogni nuova pagina scaccia una pagina che servirà poco dopo: dopo le prime due, ogni richiesta tranne una è un page fault.' : p.pol === 'lru' ? 'All’arrivo di D esce B, che non serve più. A e C restano, e le ultime due richieste le trovano.' : 'All’arrivo di D esce A, la prima caricata, benché fosse stata appena riusata. La richiesta successiva di A è un page fault in più.'),
    costruisci(p) {
      const U = SL.unita623, S = U.simula(p), passi = [];
      const P = (fatti, atto, titolo, testo, extra) => { const s = fatti ? S[fatti - 1] : null; passi.push(Object.assign({ atto, titolo, testo, hud: [['Page fault', String(s ? s.fault : 0), 'a'], ['Residenti', s ? s.fr.map((x) => x.pg).join(', ') : 'nessuna', 'c'], ['Insieme di lavoro', s ? String(s.ws.length) : '·']], els: U.quadro('b', p, fatti, { x: 20, y: 4, w: 820 }) }, extra)); };
      P(0, 0, 'I frame sono liberi', 'Il programma ha ' + p.f + ' frame, tutti liberi. Chiederà sette pagine, alcune più di una volta.', {});
      let chiesto = false;
      S.forEach((s, k) => {
        const testo = s.ok ? 'La pagina ' + s.pg + ' è già in RAM: nessun page fault.' + (p.pol === 'lru' ? ' Il suo ultimo uso diventa la richiesta ' + (k + 1) + '.' : ' Per FIFO tutto resta com’era: conta soltanto l’ordine di caricamento.') : s.esce ? 'La pagina ' + s.pg + ' manca, e i frame sono tutti occupati. ' + (p.pol === 'lru' ? 'La pagina usata meno di recente è ' + s.esce : 'La pagina caricata per prima è ' + s.esce) + ': esce, e ' + s.pg + ' prende il suo frame.' : 'La pagina ' + s.pg + ' manca: page fault. C’è un frame libero, e il kernel la carica lì.';
        const extra = { calc: 'richiesta ' + (k + 1) + ' · ' + s.pg + ' · ' + (s.ok ? 'presente' : 'page fault' + (s.esce ? ', esce ' + s.esce : '')) };
        if (!chiesto && s.esce) { chiesto = true; const prec = S[k - 1].fr; extra.chiedi = { d: 'I frame sono pieni, e arriva ' + s.pg + '. Chi esce, secondo ' + (p.pol === 'lru' ? 'LRU' : 'FIFO') + '?', o: prec.map((x) => 'La pagina ' + x.pg), g: prec.findIndex((x) => x.pg === s.esce), no: p.pol === 'lru' ? 'Esce la pagina con l’ultimo uso più lontano: ' + s.esce + '.' : 'Esce la pagina caricata da più tempo: ' + s.esce + '.' }; }
        P(k + 1, 1, 'Richiesta ' + (k + 1) + ' · pagina ' + s.pg, testo, extra);
      });
      const u = S[S.length - 1];
      P(7, 2, 'Il conto', 'Sette richieste, ' + u.fault + ' page fault. Nelle ultime quattro richieste compaiono ' + u.ws.join(', ') + ': l’insieme di lavoro è di ' + u.ws.length + ' pagine. ' + (p.f >= u.ws.length ? 'I frame sono ' + p.f + ', e bastano a contenerlo.' : 'I frame sono ' + p.f + ', uno in meno del necessario: il programma continua a scacciare pagine che gli servono.'), { esito: [u.fault + ' page fault', ''] });
      return { passi, esito: u.fault };
    }
  },
  bilancio: {
    regola: [
      'Page fault con frame pieni: LRU fa uscire la pagina con l’ultimo uso più lontano, FIFO quella caricata per prima.',
      'Insieme di lavoro = pagine distinte nelle ultime richieste. Se supera i frame disponibili, i page fault si moltiplicano.'
    ],
    errori: [
      ['Confondere ultimo uso e caricamento.', 'Una pagina caricata per prima può essere stata usata un attimo fa: per LRU è recente, per FIFO è vecchia.'],
      ['Contare due volte una pagina nell’insieme di lavoro.', 'Contano le pagine distinte: A, B, A, C sono tre pagine.'],
      ['Aspettarsi meno page fault da ogni frame aggiunto.', 'Oltre il numero delle pagine distinte, altri frame restano inutilizzati.']
    ],
    saFare: ['Aggiornare i frame dopo ogni richiesta.', 'Scegliere la pagina che esce con LRU e con FIFO.', 'Calcolare l’insieme di lavoro di una finestra di richieste.'],
    esercizi: [
      { d: 'Con 2 frame e la politica LRU, un programma chiede le pagine A, B, C, A. Quanti page fault avvengono?', segnaposto: 'Un numero', giuste: ['4', 'quattro'],
        ok: 'A e B si caricano. C fa uscire A, la meno usata di recente. La richiesta di A è di nuovo un page fault.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'All’arrivo di C esce A, usata prima di B. L’ultima richiesta di A non la trova.' },
          { se: ['2', 'due'], msg: 'Anche C manca, e va caricata facendo uscire una pagina.' }
        ],
        altro: 'Il numero è diverso. Si seguano i due frame richiesta per richiesta.',
        indizi: ['A e B: due page fault, frame pieni.', 'C: page fault, esce A.', 'A: non è più in RAM, page fault.'],
        svolgimento: ['A: fault.', 'B: fault.', 'C: fault, esce A.', 'A: fault, esce B.', 'Totale: 4.'] },
      { d: 'Le ultime sei richieste di un programma sono state P, Q, P, R, Q, P. Quante pagine contiene l’insieme di lavoro di questa finestra?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Le pagine distinte sono P, Q e R.',
        diagnosi: [
          { se: ['6', 'sei'], msg: 'Sei sono le richieste. L’insieme di lavoro conta le pagine distinte.' },
          { se: ['2', 'due'], msg: 'Compare anche R, alla quarta richiesta.' }
        ],
        altro: 'Il numero è diverso. Si elenchino le pagine senza ripetizioni.',
        indizi: ['Si tolgano le ripetizioni.', 'Restano P, Q, R.', 'Tre pagine.'],
        svolgimento: ['Richieste: P, Q, P, R, Q, P.', 'Pagine distinte: P, Q, R.', 'Insieme di lavoro: 3.'] },
      { d: 'I frame sono pieni. La pagina X è stata caricata per prima ed è stata usata un istante fa. La pagina Y è stata caricata dopo, e non viene usata da molto. Quale esce con LRU?', guida: 'Si scelga la risposta.', o: [
        { t: 'Y', ok: true, fb: 'LRU guarda l’ultimo uso, e quello di Y è il più lontano.' },
        { t: 'X', fb: 'X uscirebbe con FIFO, che guarda l’ordine di caricamento.' },
        { t: 'Entrambe', fb: 'Per fare posto a una pagina ne esce una sola.' }] }
    ],
    sfida: ['cslez6_2_05_working_set', 'Insieme di lavoro']
  }
});
