'use strict';
SL.unita354 = (() => {
  const D3 = (x) => x.toFixed(3).replace('.', ',');
  const frase = (p) => (p.l ? p.l + ' carichi sono seguiti subito da un uso' : 'Nessun carico è seguito subito da un uso') + ', e ' + (p.s === 0 ? 'nessun salto viene previsto male.' : p.s === 1 ? 'un salto viene previsto male.' : p.s + ' salti vengono previsti male.');
  // una casella per ciclo: 4 di riempimento, N con un'uscita, d di attesa sui dati, b per i salti
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
  titolo: 'Dalla portata ideale al CPI misurato',
  obiettivo: 'Obiettivo: contare i cicli che un tratto di programma occupa davvero in una pipeline di cinque stadi, compresi il riempimento e i conflitti, e ricavarne il CPI.',
  concetti: [['clock', 'Contare i cicli veri'], ['stallo', 'Le penalità'], ['bilancio', 'Il CPI come media']],
  filigrana: ['bilancio', 'clock', 'stallo'],
  richiami: {
    carte: [
      { sim: 'bilancio', da: 'Dall’unità 2.1.4', t: 'Il CPI', d: 'Cicli per istruzione: i cicli di clock spesi, divisi per le istruzioni eseguite.' },
      { sim: 'pipeline', da: 'Dall’unità 3.5.1', t: 'Il flusso ideale', d: 'In una pipeline di cinque stadi, N istruzioni indipendenti occupano N + 4 cicli.' },
      { sim: 'conflitto', da: 'Dall’unità 3.5.3', t: 'Il prezzo dei conflitti', d: 'Un carico seguito subito da un uso costa un ciclo. Un salto previsto male ne costa due.' }
    ],
    domanda: { d: 'Prima di proseguire: quanti cicli occupano 10 istruzioni indipendenti in una pipeline vuota di cinque stadi?', o: [
      { t: '14 cicli', ok: true, fb: 'L’ultima istruzione entra al ciclo 10 e raggiunge l’ultimo stadio quattro cicli dopo.' },
      { t: '10 cicli', fb: 'Al ciclo 10 l’ultima istruzione è appena entrata. Le servono altri 4 cicli per uscire.' },
      { t: '50 cicli', fb: 'Le istruzioni si sovrappongono, e dopo la prima ne esce una per ciclo.' }
    ] }
  },
  idea: {
    titolo: 'Contare i cicli veri',
    termini: ['penalità', 'quota di riempimento'],
    testo: [
      'Una pipeline ideale completa un’istruzione per ciclo, e il suo [[cpi|CPI]] vale 1. Una pipeline vera si misura con due contatori. Il contatore dei cicli avanza a ogni battito del clock, anche durante un’attesa. Il contatore delle istruzioni avanza soltanto quando un’istruzione lascia l’ultimo stadio. Il CPI è il rapporto fra il primo e il secondo.',
      'I cicli di un tratto di N istruzioni si compongono di tre parti. La prima vale N: un ciclo per ogni istruzione che esce. La seconda è il riempimento: la pipeline parte vuota, e nei primi 4 cicli nessuna istruzione arriva in fondo. La terza raccoglie le [[penalità]], cioè i cicli perduti per i conflitti: uno per ogni carico seguito subito da un uso, due per ogni salto previsto male.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Dodici istruzioni, due attese e un salto previsto male', nota: 'Ogni casella è un ciclo: 4 di riempimento, 12 con un’uscita, 4 di penalità. In tutto 20.', els: SL.unita354.striscia('g', 12, 2, 2, 5, { x: 20, y: 8, w: 680, h: 34 }).concat([
        SL.el.box('ga', 20, 62, 160, 60, 'riempimento', '4', 'att', { cls: 'stretta' }), SL.el.box('gb', 194, 62, 160, 60, 'uscite', '12', 'on', { cls: 'stretta' }),
        SL.el.box('gc', 368, 62, 160, 60, 'penalità', '2 + 2', 'err', { cls: 'stretta' }), SL.el.box('gd', 542, 62, 158, 60, 'CPI', '20 / 12', '', { cls: 'stretta' })]) },
      'Nell’esempio della figura i cicli sono 4 + 12 + 2 + 2 = 20, e il CPI vale 20 / 12, circa 1,667. Il valore è una media sull’intero tratto, e per questo può avere una parte decimale anche se ogni istruzione occupa un numero intero di cicli.',
      'Il riempimento aggiunge al CPI 4 / N cicli per istruzione, la [[quota di riempimento]]. Su dodici istruzioni vale 0,333, un terzo di ciclo. Su mille istruzioni vale 0,004, e si può trascurare. Le penalità si comportano in un altro modo: carichi e salti ricorrono lungo tutto il programma, e il loro numero cresce insieme alle istruzioni. Il CPI di un programma lungo dipende quindi quasi soltanto dalle penalità.'
    ]
  },
  esperimento: {
    faremo: [
      'Misureremo un tratto di programma come farebbe un contatore di cicli. Sceglierai quante istruzioni contiene, quanti carichi sono seguiti subito da un uso e quanti salti vengono previsti male.',
      'Una striscia di caselle, una per ciclo, si riempirà una parte alla volta: prima il riempimento, poi le uscite, poi le penalità. Alla fine divideremo i cicli per le istruzioni. Dopo il caso proposto, raddoppia le istruzioni lasciando ferme le penalità e osserva come cambia il CPI.'
    ],
    vedrai: [
      ['clock', 'La striscia dei cicli', 'In alto: una casella per ogni ciclo di clock, raggruppate per tipo.'],
      ['stallo', 'Le quattro parti', 'Al centro: riempimento, uscite, attese sui dati e salti previsti male.'],
      ['bilancio', 'La misura', 'In basso: i cicli totali, il CPI e la quota di riempimento.']
    ]
  },
  lab: {
    titolo: 'Il contatore dei cicli',
    scena: { w: 860, h: 292 },
    atti: ['Il tratto', 'Il flusso ideale', 'Le penalità', 'La misura'],
    controlli: [
      { id: 'n', tipo: 'scelta', eti: 'Istruzioni', opzioni: [[6, '6'], [12, '12'], [24, '24'], [48, '48']], valore: 12 },
      { id: 'l', tipo: 'scelta', eti: 'Carichi seguiti da un uso', opzioni: [[0, 'nessuno'], [2, '2'], [4, '4']], valore: 2 },
      { id: 's', tipo: 'scelta', eti: 'Salti previsti male', opzioni: [[0, 'nessuno'], [1, '1'], [2, '2']], valore: 1 }
    ],
    nota: 'I passi sono sempre otto. La pipeline ha cinque stadi e parte vuota. I valori con la virgola sono arrotondati al millesimo.',
    previsione: {
      domanda: (p) => 'Un tratto di ' + p.n + ' istruzioni entra in una pipeline vuota di cinque stadi. ' + SL.unita354.frase(p) + ' Quanti cicli di clock passano prima che l’ultima istruzione esca?',
      opzioni: (p) => Array.from(new Set([p.n + 4 + p.l + 2 * p.s, p.n + p.l + 2 * p.s, p.n + 4 + p.l + p.s, 5 * p.n])).sort((a, b) => a - b).map((v) => [v, v + ' cicli'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' cicli. Il tratto ne occupa ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.n + p.l + 2 * p.s ? 'Mancano i 4 cicli di riempimento, durante i quali nessuna istruzione arriva in fondo.' : pred === 5 * p.n ? 'Il prodotto vale per una macchina che esegue un’istruzione alla volta. Nella pipeline le istruzioni si sovrappongono.' : 'Ogni salto previsto male costa due cicli, uno per ciascuna delle due istruzioni annullate.'),
    costruisci(p) {
      const el = SL.el, U = SL.unita354, passi = [], N = p.n, d = p.l, b = 2 * p.s, C = N + 4 + d + b, D3 = U.D3;
      const parziale = [null, 4, N + 4, N + 4 + d, C, C, C, C];
      const quadro = (f) => {
        const els = [el.nota('t0', 20, 0, 'CICLI DI CLOCK', 'mono'), el.nota('t1', 20, 62, 'ciclo 1', 'mono')];
        if (f >= 4) els.push(el.nota('t2', 840 - ('ciclo ' + C).length * 8.4, 62, 'ciclo ' + C, 'mono'));
        U.striscia('s', N, d, b, f, { x: 20, y: 22, w: 820, h: 32 }).forEach((e) => els.push(e));
        els.push(el.box('p1', 20, 92, 196, 76, 'riempimento', f >= 1 ? '4' : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }),
          el.box('p2', 228, 92, 196, 76, 'uscite', f >= 2 ? String(N) : '·', f === 2 ? 'att' : f > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('p3', 436, 92, 196, 76, 'attese sui dati', f >= 3 ? (p.l ? p.l + ' × 1 = ' + d : '0') : '·', f === 3 ? (d ? 'err' : 'att') : f > 3 ? 'on' : '', { cls: 'stretta' }),
          el.box('p4', 644, 92, 196, 76, 'salti previsti male', f >= 4 ? (p.s ? p.s + ' × 2 = ' + b : '0') : '·', f === 4 ? (b ? 'err' : 'att') : f > 4 ? 'on' : '', { cls: 'stretta' }),
          el.box('r1', 20, 190, 264, 90, 'cicli totali', f >= 5 ? String(C) : '·', f === 5 ? 'att' : f > 5 ? 'on' : '', { cls: 'stretta' }),
          el.box('r2', 298, 190, 264, 90, 'CPI', f >= 6 ? C + ' / ' + N + ' = ' + D3(C / N) : '·', f === 6 ? 'att' : f > 6 ? 'on' : '', { cls: 'stretta' }),
          el.box('r3', 576, 190, 264, 90, 'quota di riempimento', f >= 7 ? '4 / ' + N + ' = ' + D3(4 / N) : '·', f === 7 ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (f) => [['Istruzioni', String(N), 'a'], ['Cicli contati', parziale[f] == null ? '·' : String(parziale[f])], ['CPI', f >= 6 ? D3(C / N) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Il tratto', N + ' istruzioni entrano, una per ciclo, in una pipeline di cinque stadi inizialmente vuota. ' + U.frase(p) + ' Ogni casella della striscia è un ciclo di clock. Le caselle sono raggruppate per tipo, così da poterle contare: nel programma vero le attese sono sparse lungo il percorso.',
        { chiedi: { d: 'La prima istruzione entra nello stadio F al ciclo 1. In quale ciclo attraversa l’ultimo stadio, W?', o: ['Ciclo 1', 'Ciclo 4', 'Ciclo 5'], g: 2, no: 'Gli stadi sono cinque, e l’istruzione ne percorre uno per ciclo: F al ciclo 1, W al ciclo 5.' } });
      P(1, 1, 'Il riempimento', 'Nei primi 4 cicli la prima istruzione percorre gli stadi F, D, E e M, e le altre la seguono. Nessuna è ancora arrivata in fondo: il contatore dei cicli segna 4, quello delle istruzioni completate segna 0.', { calc: 'cicli: 4 · istruzioni completate: 0' });
      P(2, 1, 'Un’uscita per ciclo', 'Dal ciclo 5 in poi il flusso ideale completa un’istruzione per ciclo. Per ' + N + ' istruzioni servono ' + N + ' cicli, che si sommano ai 4 del riempimento. Senza conflitti il tratto finirebbe al ciclo ' + (N + 4) + '.', { calc: '4 + ' + N + ' = ' + (N + 4) });
      P(3, 2, 'Le attese sui dati', p.l ? 'Nel tratto ' + p.l + ' carichi sono seguiti subito da un’istruzione che ne usa il dato. Ogni volta la pipeline trattiene quell’istruzione per un ciclo, e in fondo esce una bolla. Sono ' + d + ' cicli senza alcuna uscita.' : 'In questo tratto nessun carico è seguito subito da un uso. Le attese sui dati costano 0 cicli, e il conteggio resta fermo a ' + (N + 4) + '.', { calc: p.l ? p.l + ' × 1 = ' + d + ' cicli' : 'nessuna attesa' });
      P(4, 2, 'I salti previsti male', p.s ? (p.s === 1 ? 'Un salto è stato previsto male.' : p.s + ' salti sono stati previsti male.') + ' Ogni errore annulla due istruzioni già prelevate, e i due cicli spesi per loro vanno perduti. Sono ' + b + ' cicli senza alcuna uscita.' : 'In questo tratto tutti i salti sono stati previsti bene. Le previsioni sbagliate costano 0 cicli.', { calc: p.s ? p.s + ' × 2 = ' + b + ' cicli' : 'nessun annullamento', chiedi: { d: 'Per ottenere il CPI del tratto, quale divisione va fatta?', o: ['Istruzioni diviso cicli', 'Cicli diviso istruzioni'], g: 1, no: 'CPI significa cicli per istruzione: i cicli stanno sopra, le istruzioni sotto.' } });
      P(5, 3, 'I cicli totali', 'Sommando le quattro parti si ottiene la durata del tratto: 4 cicli di riempimento, ' + N + ' con un’uscita, ' + d + ' di attesa sui dati e ' + b + ' per i salti. L’ultima istruzione esce al ciclo ' + C + '.', { calc: '4 + ' + N + ' + ' + d + ' + ' + b + ' = ' + C, esito: [C + ' cicli', ''] });
      P(6, 3, 'Il CPI', 'Il CPI è il rapporto fra i cicli passati e le istruzioni completate: ' + C + ' / ' + N + ' = ' + D3(C / N) + '. In media ogni istruzione di questo tratto è costata ' + D3(C / N) + ' cicli, contro il valore 1 del flusso ideale a regime.', { calc: 'CPI = ' + C + ' / ' + N + ' = ' + D3(C / N), esito: ['CPI ' + D3(C / N), ''] });
      P(7, 3, 'Il peso del riempimento', 'Il riempimento contribuisce al CPI con 4 / ' + N + ' = ' + D3(4 / N) + ' cicli per istruzione. ' + (d + b === 0 ? 'In questo tratto mancano le penalità, e il CPI supera 1 soltanto per il riempimento.' : 'Le penalità contribuiscono con ' + (d + b) + ' / ' + N + ' = ' + D3((d + b) / N) + '. In questo tratto il riempimento pesa ' + (4 > d + b ? 'più delle' : 4 === d + b ? 'quanto le' : 'meno delle') + ' penalità.') + ' In un programma vero carichi e salti aumentano insieme alle istruzioni: la quota delle penalità resta, mentre quella del riempimento si riduce fino a scomparire.', { calc: 'riempimento: 4 / ' + N + ' = ' + D3(4 / N), esito: [C + ' cicli · CPI ' + D3(C / N), ''] });
      return { passi, esito: C };
    }
  },
  bilancio: {
    regola: [
      'In una pipeline di cinque stadi che parte vuota, un tratto di N istruzioni occupa N + 4 cicli più le penalità: un ciclo per ogni carico seguito subito da un uso, due cicli per ogni salto previsto male.',
      'Il CPI è il rapporto fra i cicli e le istruzioni completate. La quota di riempimento, 4 / N, conta nei tratti brevi e scompare in quelli lunghi. Le penalità crescono con il programma e restano.'
    ],
    errori: [
      ['Dimenticare il riempimento.', 'I primi 4 cicli non completano alcuna istruzione, e fanno parte della durata del tratto.'],
      ['Contare gli errori di previsione al posto dei cicli.', 'Un salto previsto male costa due cicli. Nel conteggio entrano i cicli perduti.'],
      ['Aspettarsi un CPI intero.', 'Il CPI è una media sul tratto misurato, e di solito ha una parte decimale.']
    ],
    saFare: ['Contare i cicli di un tratto con riempimento e penalità.', 'Calcolare il CPI dai due conteggi.', 'Distinguere la quota di riempimento dal peso delle penalità.'],
    esercizi: [
      { d: 'Un tratto di 20 istruzioni entra in una pipeline vuota di cinque stadi. Tre carichi sono seguiti subito da un uso, e un salto viene previsto male. Quanti cicli occupa il tratto?', segnaposto: 'Un numero', giuste: ['29', 'ventinove'],
        ok: 'Riempimento 4, uscite 20, attese 3, salto 2: in tutto 29 cicli.',
        diagnosi: [
          { se: ['25', 'venticinque'], msg: 'Mancano i 4 cicli di riempimento, durante i quali nessuna istruzione esce.' },
          { se: ['28', 'ventotto'], msg: 'Un salto previsto male costa due cicli, uno per ciascuna istruzione annullata.' },
          { se: ['24', 'ventiquattro'], msg: 'Questo è il flusso ideale. Vanno aggiunte le penalità: tre attese e un salto previsto male.' },
          { se: ['30', 'trenta'], msg: 'Il riempimento dura 4 cicli: al quinto la prima istruzione attraversa già l’ultimo stadio.' }
        ],
        altro: 'Il numero è diverso. Somma quattro parti: riempimento, uscite, attese sui dati e salti previsti male.',
        indizi: ['Il flusso ideale occupa 20 + 4 cicli.', 'Le tre attese costano un ciclo ciascuna.', 'Il salto previsto male costa due cicli: 24 + 3 + 2.'],
        svolgimento: ['Flusso ideale: 20 + 4 = 24 cicli.', 'Attese sui dati: 3 × 1 = 3 cicli.', 'Salti previsti male: 1 × 2 = 2 cicli.', 'Totale: 24 + 3 + 2 = 29 cicli.'] },
      { d: 'Lo stesso tratto ha speso 29 cicli per completare 20 istruzioni. Quanto vale il suo CPI?', segnaposto: 'Un numero con la virgola', giuste: ['1.45', '1.450'],
        ok: '29 / 20 = 1,45 cicli per istruzione.',
        diagnosi: [
          { se: ['0.69', '0.690', '0.6897', '0.7'], msg: 'La divisione è rovesciata. I cicli vanno divisi per le istruzioni.' },
          { se: ['1.2', '1.20', '1.200'], msg: 'Questo valore tiene conto del solo riempimento. I cicli misurati sono 29.' },
          { se: ['1', '1.0'], msg: 'Il valore 1 è quello del flusso ideale a regime. Qui i cicli sono 29 per 20 istruzioni.' }
        ],
        altro: 'Il valore è diverso. Si dividano i cicli per le istruzioni completate.',
        indizi: ['CPI significa cicli per istruzione.', 'I cicli sono 29, le istruzioni 20.', '29 / 20.'],
        svolgimento: ['Cicli: 29.', 'Istruzioni completate: 20.', 'CPI = 29 / 20 = 1,45.'] },
      { d: 'Due tratti di programma perdono entrambi 2 cicli per le penalità. Il primo contiene 10 istruzioni, il secondo 100. Quale ha il CPI più basso?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il secondo: riempimento e penalità si distribuiscono su più istruzioni', ok: true, fb: 'Il primo spende 16 cicli per 10 istruzioni, CPI 1,6. Il secondo ne spende 106 per 100, CPI 1,06.' },
        { t: 'Il primo: ha meno istruzioni da eseguire', fb: 'Il primo dura meno, ma il CPI è una media: i suoi 6 cicli in più pesano su 10 istruzioni soltanto.' },
        { t: 'Sono uguali: le penalità sono le stesse', fb: 'I cicli in più sono gli stessi, 6. Divisi per 10 pesano 0,6, divisi per 100 pesano 0,06.' }] }
    ],
    sfida: ['cslez3_5_04_random_assembly', 'Conteggio e sovrapposizione degli stalli']
  }
});
