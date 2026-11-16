'use strict';
SL.unita354 = (() => {
  const D3 = (x) => x.toFixed(3).replace('.', ',');
  const frase = (p) => (p.l === 0 ? 'Nessuna istruzione impiega il risultato della precedente' : p.l === 1 ? 'Un’istruzione impiega il risultato della precedente' : p.l + ' istruzioni impiegano il risultato della precedente') + ', e ' + (p.s === 0 ? 'nessuna impiega quello dell’istruzione che la precede di due posizioni.' : p.s === 1 ? 'una impiega quello dell’istruzione che la precede di due posizioni.' : p.s + ' impiegano quello dell’istruzione che le precede di due posizioni.');
  // una casella per ciclo: 4 di riempimento, N con un'uscita, d di ritardo per le dipendenze adiacenti, b per quelle a distanza due
  const striscia = (pre, N, d, b, fase, o) => {
    const C = N + 4 + d + b, passo = o.w / C, els = [];
    for (let i = 0; i < C; i++) {
      const tipo = i < 4 ? 1 : i < 4 + N ? 2 : i < 4 + N + d ? 3 : 4;
      const st = fase >= tipo ? (tipo === 1 ? 'att' : tipo === 2 ? 'on' : 'err') : 'off';
      els.push(SL.el.cella(pre + i, o.x + i * passo, o.y, Math.max(4, passo - 3), o.h, '', st));
    }
    return els;
  };
  return { D3, frase, striscia };
})();
SL.registra('3.5.4', {
  titolo: 'Dal throughput ideale al CPI misurato',
  obiettivo: 'Obiettivo: contare i cicli effettivamente occupati da un tratto di programma in una pipeline di cinque stadi, compresi il riempimento e i ritardi dovuti alle dipendenze, e ricavarne il CPI.',
  concetti: [['clock', 'Il conteggio dei cicli effettivi'], ['stallo', 'Le penalità'], ['bilancio', 'Il CPI come media']],
  filigrana: ['bilancio', 'clock', 'stallo'],
  richiami: {
    carte: [
      { sim: 'bilancio', da: 'Dall’unità 2.1.4', t: 'Il CPI', d: 'Cicli per istruzione: i cicli di clock impiegati, divisi per le istruzioni eseguite.' },
      { sim: 'pipeline', da: 'Dall’unità 3.5.1', t: 'Il flusso ideale', d: 'In una pipeline di cinque stadi, N istruzioni indipendenti occupano N + 4 cicli.' },
      { sim: 'conflitto', da: 'Dall’unità 3.5.3', t: 'Le dipendenze', d: 'Un’istruzione che impiega il risultato di una precedente va ritardata finché il valore è disponibile.' }
    ],
    domanda: { d: 'Prima di proseguire: quanti cicli occupano 10 istruzioni indipendenti in una pipeline vuota di cinque stadi?', o: [
      { t: '14 cicli', ok: true, fb: 'L’ultima istruzione entra al ciclo 10 e raggiunge l’ultimo stadio quattro cicli dopo.' },
      { t: '10 cicli', fb: 'Al ciclo 10 l’ultima istruzione è appena entrata. Occorrono altri 4 cicli per l’uscita.' },
      { t: '50 cicli', fb: 'Le istruzioni si sovrappongono, e dopo la prima ne esce una per ciclo.' }
    ] }
  },
  idea: {
    titolo: 'Il conteggio dei cicli effettivi',
    termini: ['penalità', 'quota di riempimento'],
    testo: [
      'Una pipeline ideale completa un’istruzione per ciclo, e il suo [[cpi|CPI]] vale 1. Una pipeline reale si misura con due contatori. Il contatore dei cicli avanza a ogni periodo del clock, anche durante un’attesa. Il contatore delle istruzioni avanza soltanto quando un’istruzione lascia l’ultimo stadio. Il CPI è il rapporto fra il primo e il secondo.',
      'I cicli di un tratto di N istruzioni si compongono di tre parti. La prima vale N: un ciclo per ogni istruzione che esce. La seconda è il riempimento: la pipeline parte vuota, e nei primi 4 cicli nessuna istruzione raggiunge l’ultimo stadio. La terza raccoglie le [[penalità]], cioè i cicli perduti per ritardare le istruzioni che dipendono da altre. Nella CPU con pipeline del capitolo 3.6 un’istruzione che impiega il risultato di quella che la precede deve attendere tre cicli, e una che impiega il risultato di quella che la precede di due posizioni ne attende due.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Dodici istruzioni e due dipendenze', nota: 'Ogni casella è un ciclo: 4 di riempimento, 12 con un’uscita, 5 di penalità, per un totale di 21.', els: SL.unita354.striscia('g', 12, 3, 2, 5, { x: 20, y: 8, w: 680, h: 34 }).concat([
        SL.el.box('ga', 20, 62, 160, 60, 'riempimento', '4', 'att', { cls: 'stretta' }), SL.el.box('gb', 194, 62, 160, 60, 'uscite', '12', 'on', { cls: 'stretta' }),
        SL.el.box('gc', 368, 62, 160, 60, 'penalità', '3 + 2', 'err', { cls: 'stretta' }), SL.el.box('gd', 542, 62, 158, 60, 'CPI', '21 / 12', '', { cls: 'stretta' })]) },
      'Nell’esempio della figura i cicli sono 4 + 12 + 3 + 2 = 21, e il CPI vale 21 / 12 = 1,75. Il valore è una media sull’intero tratto, e per questa ragione può avere una parte decimale benché ogni istruzione occupi un numero intero di cicli.',
      'Il riempimento aggiunge al CPI 4 / N cicli per istruzione, la [[quota di riempimento]]. Su dodici istruzioni vale 0,333, un terzo di ciclo. Su mille istruzioni vale 0,004, ed è trascurabile. Le penalità hanno un comportamento diverso: le dipendenze ricorrono lungo tutto il programma, e il loro numero cresce insieme alle istruzioni. Il CPI di un programma lungo dipende quindi quasi esclusivamente dalle penalità. Un programma di 100 istruzioni con 15 cicli di ritardo ha CPI (100 + 15) / 100 = 1,15 se si trascura il riempimento, e (100 + 4 + 15) / 100 = 1,19 se lo si include: sono due convenzioni per la medesima pipeline, e un confronto deve impiegare la stessa da entrambe le parti.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento misura un tratto di programma come un contatore di cicli. I controlli fissano il numero di istruzioni e il numero di dipendenze, fra istruzioni adiacenti e a distanza due.',
      'Una striscia di caselle, una per ciclo, si riempie una parte alla volta: dapprima il riempimento, poi le uscite, poi le penalità. Al termine i cicli sono divisi per le istruzioni. Dopo il caso proposto, è istruttivo raddoppiare le istruzioni lasciando invariate le penalità e osservare la variazione del CPI.'
    ],
    vedrai: [
      ['clock', 'La striscia dei cicli', 'In alto: una casella per ogni ciclo di clock, raggruppate per tipo.'],
      ['stallo', 'Le quattro parti', 'Al centro: riempimento, uscite e i ritardi dovuti ai due tipi di dipendenza.'],
      ['bilancio', 'La misura', 'In basso: i cicli totali, il CPI e la quota di riempimento.']
    ]
  },
  lab: {
    titolo: 'Il contatore dei cicli',
    scena: { w: 860, h: 292 },
    atti: ['Il tratto', 'Il flusso ideale', 'Le penalità', 'La misura'],
    controlli: [
      { id: 'n', tipo: 'scelta', eti: 'Istruzioni', opzioni: [[6, '6'], [12, '12'], [24, '24'], [48, '48']], valore: 12 },
      { id: 'l', tipo: 'scelta', eti: 'Dipendenze fra istruzioni adiacenti', opzioni: [[0, 'nessuna'], [1, '1'], [2, '2']], valore: 1 },
      { id: 's', tipo: 'scelta', eti: 'Dipendenze a distanza due', opzioni: [[0, 'nessuna'], [1, '1'], [2, '2']], valore: 1 }
    ],
    nota: 'I passi sono sempre otto. La pipeline ha cinque stadi e parte vuota. Una dipendenza fra istruzioni adiacenti costa tre cicli, una a distanza due ne costa due. I valori con la virgola sono arrotondati al millesimo.',
    previsione: {
      domanda: (p) => 'Un tratto di ' + p.n + ' istruzioni entra in una pipeline vuota di cinque stadi. ' + SL.unita354.frase(p) + ' Quanti cicli di clock trascorrono prima che l’ultima istruzione esca?',
      opzioni: (p) => Array.from(new Set([p.n + 4 + 3 * p.l + 2 * p.s, p.n + 3 * p.l + 2 * p.s, p.n + 4 + p.l + p.s, 5 * p.n])).sort((a, b) => a - b).map((v) => [v, v + ' cicli'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' cicli. Il tratto ne occupa ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.n + 3 * p.l + 2 * p.s ? 'Mancano i 4 cicli di riempimento, durante i quali nessuna istruzione raggiunge l’ultimo stadio.' : pred === 5 * p.n ? 'Il prodotto vale per una CPU che esegue un’istruzione alla volta. Nella pipeline le istruzioni si sovrappongono.' : 'Una dipendenza fra istruzioni adiacenti costa tre cicli, e una a distanza due ne costa due.'),
    costruisci(p) {
      const el = SL.el, U = SL.unita354, passi = [], N = p.n, d = 3 * p.l, b = 2 * p.s, C = N + 4 + d + b, D3 = U.D3;
      const parziale = [null, 4, N + 4, N + 4 + d, C, C, C, C];
      const quadro = (f) => {
        const els = [el.nota('t0', 20, 0, 'CICLI DI CLOCK', 'mono'), el.nota('t1', 20, 62, 'ciclo 1', 'mono')];
        if (f >= 4) els.push(el.nota('t2', 840 - ('ciclo ' + C).length * 8.4, 62, 'ciclo ' + C, 'mono'));
        U.striscia('s', N, d, b, f, { x: 20, y: 22, w: 820, h: 32 }).forEach((e) => els.push(e));
        els.push(el.box('p1', 20, 92, 196, 76, 'riempimento', f >= 1 ? '4' : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }),
          el.box('p2', 228, 92, 196, 76, 'uscite', f >= 2 ? String(N) : '·', f === 2 ? 'att' : f > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('p3', 436, 92, 196, 76, 'dipendenze adiacenti', f >= 3 ? (p.l ? p.l + ' × 3 = ' + d : '0') : '·', f === 3 ? (d ? 'err' : 'att') : f > 3 ? 'on' : '', { cls: 'stretta' }),
          el.box('p4', 644, 92, 196, 76, 'dipendenze a distanza due', f >= 4 ? (p.s ? p.s + ' × 2 = ' + b : '0') : '·', f === 4 ? (b ? 'err' : 'att') : f > 4 ? 'on' : '', { cls: 'stretta' }),
          el.box('r1', 20, 190, 264, 90, 'cicli totali', f >= 5 ? String(C) : '·', f === 5 ? 'att' : f > 5 ? 'on' : '', { cls: 'stretta' }),
          el.box('r2', 298, 190, 264, 90, 'CPI', f >= 6 ? C + ' / ' + N + ' = ' + D3(C / N) : '·', f === 6 ? 'att' : f > 6 ? 'on' : '', { cls: 'stretta' }),
          el.box('r3', 576, 190, 264, 90, 'quota di riempimento', f >= 7 ? '4 / ' + N + ' = ' + D3(4 / N) : '·', f === 7 ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (f) => [['Istruzioni', String(N), 'a'], ['Cicli contati', parziale[f] == null ? '·' : String(parziale[f])], ['CPI', f >= 6 ? D3(C / N) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Il tratto', N + ' istruzioni entrano, una per ciclo, in una pipeline di cinque stadi inizialmente vuota. ' + U.frase(p) + ' Ogni casella della striscia è un ciclo di clock. Le caselle sono raggruppate per tipo, per agevolarne il conteggio: nel programma reale i ritardi sono distribuiti lungo il percorso.',
        { chiedi: { d: 'La prima istruzione entra nello stadio F al ciclo 1. In quale ciclo attraversa l’ultimo stadio, W?', o: ['Ciclo 1', 'Ciclo 4', 'Ciclo 5'], g: 2, no: 'Gli stadi sono cinque, e l’istruzione ne percorre uno per ciclo: F al ciclo 1, W al ciclo 5.' } });
      P(1, 1, 'Il riempimento', 'Nei primi 4 cicli la prima istruzione percorre gli stadi F, D, E e M, e le altre la seguono. Nessuna ha ancora raggiunto l’ultimo stadio: il contatore dei cicli vale 4, quello delle istruzioni completate vale 0.', { calc: 'cicli: 4 · istruzioni completate: 0' });
      P(2, 1, 'Un’uscita per ciclo', 'Dal ciclo 5 in poi il flusso ideale completa un’istruzione per ciclo. Per ' + N + ' istruzioni occorrono ' + N + ' cicli, che si sommano ai 4 del riempimento. Senza dipendenze il tratto terminerebbe al ciclo ' + (N + 4) + '.', { calc: '4 + ' + N + ' = ' + (N + 4) });
      P(3, 2, 'Le dipendenze fra istruzioni adiacenti', p.l ? 'Nel tratto ' + (p.l === 1 ? 'un’istruzione impiega' : p.l + ' istruzioni impiegano') + ' il risultato dell’istruzione immediatamente precedente. Ognuna va ritardata di tre cicli, nei quali l’ultimo stadio resta privo di istruzioni utili: ' + d + ' cicli senza uscite utili.' : 'In questo tratto nessuna istruzione impiega il risultato della precedente. Questi ritardi costano 0 cicli, e il conteggio resta a ' + (N + 4) + '.', { calc: p.l ? p.l + ' × 3 = ' + d + ' cicli' : 'nessun ritardo' });
      P(4, 2, 'Le dipendenze a distanza due', p.s ? (p.s === 1 ? 'Un’istruzione impiega' : p.s + ' istruzioni impiegano') + ' il risultato di quella che le precede di due posizioni. L’istruzione intermedia copre uno dei cicli necessari, e ne restano due di ritardo per ciascuna. Sono ' + b + ' cicli senza uscite utili.' : 'In questo tratto nessuna istruzione impiega il risultato di quella che la precede di due posizioni. Questi ritardi costano 0 cicli.', { calc: p.s ? p.s + ' × 2 = ' + b + ' cicli' : 'nessun ritardo', chiedi: { d: 'Quale divisione fornisce il CPI del tratto?', o: ['Istruzioni diviso cicli', 'Cicli diviso istruzioni'], g: 1, no: 'CPI significa cicli per istruzione: i cicli sono il dividendo, le istruzioni il divisore.' } });
      P(5, 3, 'I cicli totali', 'La somma delle quattro parti dà la durata del tratto: 4 cicli di riempimento, ' + N + ' con un’uscita, ' + d + ' per le dipendenze adiacenti e ' + b + ' per quelle a distanza due. L’ultima istruzione esce al ciclo ' + C + '.', { calc: '4 + ' + N + ' + ' + d + ' + ' + b + ' = ' + C, esito: [C + ' cicli', ''] });
      P(6, 3, 'Il CPI', 'Il CPI è il rapporto fra i cicli trascorsi e le istruzioni completate: ' + C + ' / ' + N + ' = ' + D3(C / N) + '. In media ogni istruzione di questo tratto ha richiesto ' + D3(C / N) + ' cicli, a fronte del valore 1 del flusso ideale a regime.', { calc: 'CPI = ' + C + ' / ' + N + ' = ' + D3(C / N), esito: ['CPI ' + D3(C / N), ''] });
      P(7, 3, 'L’incidenza del riempimento', 'Il riempimento contribuisce al CPI con 4 / ' + N + ' = ' + D3(4 / N) + ' cicli per istruzione. ' + (d + b === 0 ? 'In questo tratto le penalità sono assenti, e il CPI supera 1 soltanto per il riempimento.' : 'Le penalità contribuiscono con ' + (d + b) + ' / ' + N + ' = ' + D3((d + b) / N) + '. In questo tratto il riempimento incide ' + (4 > d + b ? 'più delle' : 4 === d + b ? 'quanto le' : 'meno delle') + ' penalità.') + ' In un programma reale le dipendenze aumentano insieme alle istruzioni: la quota delle penalità permane, mentre quella del riempimento si riduce fino a divenire trascurabile.', { calc: 'riempimento: 4 / ' + N + ' = ' + D3(4 / N), esito: [C + ' cicli · CPI ' + D3(C / N), ''] });
      return { passi, esito: C };
    }
  },
  bilancio: {
    regola: [
      'In una pipeline di cinque stadi che parte vuota, un tratto di N istruzioni occupa N + 4 cicli più le penalità, cioè i cicli di ritardo imposti dalle dipendenze: nella CPU con pipeline del capitolo 3.6, tre per una dipendenza fra istruzioni adiacenti e due per una a distanza due.',
      'Il CPI è il rapporto fra i cicli e le istruzioni completate. La quota di riempimento, 4 / N, è rilevante nei tratti brevi e trascurabile in quelli lunghi. Le penalità crescono con il programma e permangono.'
    ],
    errori: [
      ['Trascurare il riempimento.', 'I primi 4 cicli non completano alcuna istruzione, e fanno parte della durata del tratto.'],
      ['Contare le dipendenze in luogo dei cicli.', 'Una dipendenza fra istruzioni adiacenti costa tre cicli. Nel conteggio entrano i cicli perduti.'],
      ['Attendersi un CPI intero.', 'Il CPI è una media sul tratto misurato, e di norma ha una parte decimale.']
    ],
    saFare: ['Contare i cicli di un tratto con riempimento e penalità.', 'Calcolare il CPI dai due conteggi.', 'Distinguere la quota di riempimento dall’incidenza delle penalità.'],
    esercizi: [
      { d: 'Un tratto di 20 istruzioni entra in una pipeline vuota di cinque stadi. Un’istruzione impiega il risultato della precedente, con tre cicli di ritardo, e un’altra il risultato di quella che la precede di due posizioni, con due cicli di ritardo. Quanti cicli occupa il tratto?', segnaposto: 'Un numero', giuste: ['29', 'ventinove'],
        ok: 'Riempimento 4, uscite 20, ritardi 3 + 2: complessivamente 29 cicli.',
        diagnosi: [
          { se: ['25', 'venticinque'], msg: 'Mancano i 4 cicli di riempimento, durante i quali nessuna istruzione esce.' },
          { se: ['27', 'ventisette'], msg: 'La dipendenza fra istruzioni adiacenti costa tre cicli, quella a distanza due ne costa due.' },
          { se: ['24', 'ventiquattro'], msg: 'Questo è il flusso ideale. Vanno aggiunti i cinque cicli di ritardo.' },
          { se: ['30', 'trenta'], msg: 'Il riempimento dura 4 cicli: al quinto la prima istruzione attraversa già l’ultimo stadio.' }
        ],
        altro: 'Il numero è diverso. Si sommino quattro parti: riempimento, uscite e i due ritardi.',
        indizi: ['Il flusso ideale occupa 20 + 4 cicli.', 'La dipendenza fra istruzioni adiacenti costa 3 cicli.', 'Quella a distanza due ne costa 2: 24 + 3 + 2.'],
        svolgimento: ['Flusso ideale: 20 + 4 = 24 cicli.', 'Dipendenza adiacente: 3 cicli.', 'Dipendenza a distanza due: 2 cicli.', 'Totale: 24 + 3 + 2 = 29 cicli.'] },
      { d: 'Il medesimo tratto ha impiegato 29 cicli per completare 20 istruzioni. Quanto vale il suo CPI?', segnaposto: 'Un numero con la virgola', giuste: ['1.45', '1.450'],
        ok: '29 / 20 = 1,45 cicli per istruzione.',
        diagnosi: [
          { se: ['0.69', '0.690', '0.6897', '0.7'], msg: 'La divisione è invertita. I cicli vanno divisi per le istruzioni.' },
          { se: ['1.2', '1.20', '1.200'], msg: 'Questo valore tiene conto del solo riempimento. I cicli misurati sono 29.' },
          { se: ['1', '1.0'], msg: 'Il valore 1 è quello del flusso ideale a regime. In questo caso i cicli sono 29 per 20 istruzioni.' }
        ],
        altro: 'Il valore è diverso. Si dividano i cicli per le istruzioni completate.',
        indizi: ['CPI significa cicli per istruzione.', 'I cicli sono 29, le istruzioni 20.', '29 / 20.'],
        svolgimento: ['Cicli: 29.', 'Istruzioni completate: 20.', 'CPI = 29 / 20 = 1,45.'] },
      { d: 'Due tratti di programma perdono entrambi 2 cicli per le penalità. Il primo contiene 10 istruzioni, il secondo 100. Quale ha il CPI minore?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il secondo, poiché riempimento e penalità si distribuiscono su più istruzioni', ok: true, fb: 'Il primo impiega 16 cicli per 10 istruzioni, CPI 1,6. Il secondo ne impiega 106 per 100, CPI 1,06.' },
        { t: 'Il primo, poiché ha meno istruzioni da eseguire', fb: 'Il primo ha durata minore, e tuttavia il CPI è una media: i suoi 6 cicli aggiuntivi si distribuiscono su sole 10 istruzioni.' },
        { t: 'Sono uguali, poiché le penalità sono le medesime', fb: 'I cicli aggiuntivi sono i medesimi, 6. Divisi per 10 incidono per 0,6, divisi per 100 per 0,06.' }] }
    ],
    sfida: ['cslez3_5_04_random_assembly', 'Conteggio e sovrapposizione degli stalli']
  }
});
