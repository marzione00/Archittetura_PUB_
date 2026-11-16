'use strict';
SL.unita365 = (() => {
  const D3 = (x) => x.toFixed(3).replace('.', ',');
  const P1 = (x) => (100 * x).toFixed(1).replace('.', ',') + '%';
  // Ogni gruppo ha tre istruzioni utili: nell'ordine L, U, I richiede tre nop, nell'ordine L, I, U due.
  const conti = (g, t) => { const n = 3 * g, A = n + 3 * g + 4, B = n + 2 * g + 4; return { n, A, B, TA: A * t, TB: B * t, risparmio: g * t, acc: A / B, cpiA: A / n, cpiB: B / n }; };
  // Due strisce con una casella per ciclo e la stessa scala: 4 di riempimento, 3g con un'uscita utile, e le nop.
  const strisce = (pre, g, o) => {
    const el = SL.el, c = conti(g, 1), passo = o.w / c.A, els = [];
    [[c.A, o.accesa1, 'L · U · I'], [c.B, o.accesa2, 'L · I · U']].forEach((R, r) => {
      const y = o.y + r * o.py;
      els.push(el.nota(pre + 'n' + r, o.xn, y + o.h / 2 - 8, R[2], 'mono minuta', R[1] ? 'att' : ''));
      for (let i = 0; i < R[0]; i++) els.push(el.cella(pre + r + '_' + i, o.x + i * passo, y, Math.max(4, passo - 3), o.h, '', !R[1] ? 'off' : i < 4 ? 'att' : i < 4 + c.n ? 'on' : 'err'));
      if (R[1]) els.push(el.nota(pre + 'c' + r, o.x + R[0] * passo + 8, y + o.h / 2 - 8, R[0] + ' cicli', 'mono minuta'));
    });
    return els;
  };
  return { D3, P1, conti, strisce };
})();
SL.registra('3.6.5', {
  titolo: 'Misurare e spiegare le prestazioni',
  obiettivo: 'Obiettivo: misurare il vantaggio di un riordino su un intero programma in cicli, in tempo, in CPI e come accelerazione, distinguendo il risparmio assoluto dal rapporto.',
  concetti: [['clock', 'Dai cicli al tempo'], ['bilancio', 'Il CPI prima e dopo'], ['lente', 'Risparmio e accelerazione']],
  filigrana: ['bilancio', 'clock', 'lente'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 3.6.4', t: 'Due ordini', d: 'L’ordine L, U, I richiede tre nop per gruppo. L’ordine L, I, U ne richiede due.' },
      { sim: 'bilancio', da: 'Dall’unità 3.5.4', t: 'Il CPI misurato', d: 'I cicli sono le istruzioni, più 4, più le penalità. Il CPI li divide per le istruzioni del programma.' },
      { sim: 'clock', da: 'Dall’unità 2.1.4', t: 'Il tempo di un programma', d: 'Il numero di cicli moltiplicato per il periodo di clock.' }
    ],
    domanda: { d: 'Prima di proseguire: un programma occupa 20 cicli con un periodo di 50 ps. Quanto dura?', o: [
      { t: '1000 ps', ok: true, fb: 'Venti cicli da 50 ps ciascuno: 20 × 50 = 1000 ps.' },
      { t: '70 ps', fb: 'I cicli vanno moltiplicati per il periodo: la loro somma unirebbe grandezze diverse.' },
      { t: '2,5 ps', fb: 'Dividendo il periodo per i cicli si ottiene un numero privo di significato. Ogni ciclo dura un periodo intero.' }
    ] }
  },
  idea: {
    titolo: 'Quattro misure del vantaggio',
    termini: ['accelerazione'],
    testo: [
      'Il riordino dell’unità precedente sostituisce una nop per ogni gruppo di tre istruzioni. La valutazione di tale vantaggio su un intero programma richiede quattro misure, ciascuna delle quali risponde a una domanda diversa.',
      'La prima è il numero di cicli. Con g gruppi il programma contiene 3g istruzioni utili. Nell’ordine L, U, I richiede 3g nop e occupa 3g + 3g + 4 = 6g + 4 cicli; nell’ordine L, I, U richiede 2g nop e occupa 5g + 4 cicli. La differenza è g, un ciclo per gruppo. La seconda misura è il tempo: i cicli moltiplicati per il periodo di clock, che resta invariato poiché il circuito è il medesimo.',
      'La terza è il CPI, cioè i cicli divisi per le istruzioni del programma. Le nop sono escluse dal conteggio, poiché prive di lavoro utile. Il CPI indica così il costo medio di un’istruzione utile, e consente di confrontare programmi di lunghezza diversa.',
      { fig: 'scena', w: 720, h: 110, titolo: 'Quattro gruppi, prima e dopo il riordino', nota: 'Le caselle rosse sono le nop: dodici prima del riordino, otto dopo.', els: SL.unita365.strisce('g', 4, { x: 110, xn: 10, y: 8, w: 520, h: 30, py: 44, accesa1: true, accesa2: true }) },
      'La quarta è l’[[accelerazione]]: il tempo della versione originale diviso per il tempo della versione migliorata. È un numero privo di unità di misura. Con quattro gruppi e un periodo di 65 ps i cicli sono 28 e 24, i tempi 1820 ps e 1560 ps, e l’accelerazione vale 1820 / 1560, circa 1,167.',
      'Risparmio e accelerazione esprimono informazioni diverse. Il risparmio, in questo esempio 260 ps, cresce in proporzione al numero di gruppi. L’accelerazione cresce molto meno, poiché aumenta anche il tempo di partenza. Con un numero molto elevato di gruppi i 4 cicli di riempimento divengono trascurabili, e l’accelerazione si avvicina a 6 / 5 = 1,2: sei cicli per gruppo a fronte di cinque.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento confronta le due versioni del medesimo programma, L, U, I e L, I, U, su più gruppi. I controlli fissano il numero di gruppi e il periodo di clock.',
      'Si contano i cicli delle due versioni, si convertono in tempi e se ne ricavano risparmio, CPI e accelerazione. Dopo il caso proposto, è istruttivo raddoppiare i gruppi e osservare quale misura raddoppia e quale varia in misura minore.'
    ],
    vedrai: [
      ['clock', 'Le due strisce', 'In alto: una casella per ciclo, con la medesima scala per le due versioni e le nop in rosso.'],
      ['bilancio', 'Tempi e risparmio', 'Al centro: i due tempi e la loro differenza.'],
      ['lente', 'CPI e accelerazione', 'In basso: il costo medio di un’istruzione e il rapporto fra i tempi.']
    ]
  },
  lab: {
    titolo: 'Prima e dopo il riordino',
    scena: { w: 860, h: 268 },
    atti: ['Il programma', 'I cicli', 'I tempi', 'I rapporti'],
    controlli: [
      { id: 'g', tipo: 'scelta', eti: 'Gruppi', opzioni: [[2, '2'], [4, '4'], [8, '8']], valore: 4 },
      { id: 't', tipo: 'scelta', eti: 'Periodo di clock', opzioni: [[50, '50 ps'], [65, '65 ps'], [80, '80 ps']], valore: 65 }
    ],
    nota: 'I passi sono sempre otto. Le due versioni impiegano il medesimo periodo. I valori con la virgola sono arrotondati al millesimo.',
    previsione: {
      domanda: (p) => 'Un programma ripete ' + p.g + ' volte il gruppo L, U, I, con un periodo di ' + p.t + ' ps. Riordinato in L, I, U, quanto tempo risparmia?',
      opzioni: (p) => Array.from(new Set([p.t, p.g * p.t, 4 * p.t, 2 * p.g * p.t])).sort((a, b) => a - b).map((v) => [v, v + ' ps'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' ps. Il riordino risparmia ' + esito + ' ps. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.t ? 'Il riordino sostituisce una nop per ogni gruppo, e i gruppi sono ' + p.g + '.' : 'Il risparmio è di un ciclo per gruppo: ' + p.g + ' cicli da ' + p.t + ' ps.'),
    costruisci(p) {
      const el = SL.el, U = SL.unita365, D3 = U.D3, passi = [], g = p.g, t = p.t, c = U.conti(g, t);
      const quadro = (f) => {
        const els = [el.nota('t0', 20, 0, 'CICLI DI CLOCK', 'mono')];
        U.strisce('s', g, { x: 130, xn: 20, y: 24, w: 610, h: 26, py: 36, accesa1: f >= 1, accesa2: f >= 2 }).forEach((e) => els.push(e));
        const B = (id, k, r, eti, txt, da, forte) => el.box(id, 20 + k * 278, 108 + r * 76, 264, 64, eti, f >= da ? txt : '·', f === da ? (forte || 'att') : f > da ? 'on' : '', { cls: 'stretta' });
        els.push(B('b1', 0, 0, 'tempo di L, U, I', c.A + ' × ' + t + ' = ' + c.TA + ' ps', 3), B('b2', 1, 0, 'tempo di L, I, U', c.B + ' × ' + t + ' = ' + c.TB + ' ps', 3), B('b3', 2, 0, 'risparmio', g + ' × ' + t + ' = ' + c.risparmio + ' ps', 4),
          B('b4', 0, 1, 'CPI di L, U, I', c.A + ' / ' + c.n + ' = ' + D3(c.cpiA), 5), B('b5', 1, 1, 'CPI di L, I, U', c.B + ' / ' + c.n + ' = ' + D3(c.cpiB), 5), B('b6', 2, 1, 'accelerazione', c.TA + ' / ' + c.TB + ' = ' + D3(c.acc), 6));
        return els;
      };
      const hud = (f) => [['Gruppi', String(g), 'a'], ['Risparmio', f >= 4 ? c.risparmio + ' ps' : '·'], ['Accelerazione', f >= 6 ? D3(c.acc) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Il programma', 'Il programma ripete ' + g + ' volte un gruppo di tre istruzioni: una lettura dalla memoria L, il suo uso U e un’istruzione indipendente I. Complessivamente ' + c.n + ' istruzioni utili. La versione originale le dispone nell’ordine L, U, I, quella riordinata nell’ordine L, I, U. Il periodo di clock è ' + t + ' ps per entrambe.',
        { chiedi: { d: 'Quante nop contiene la versione L, U, I con ' + g + ' gruppi?', o: Array.from(new Set(['3', String(2 * g), String(3 * g)])), g: Array.from(new Set(['3', String(2 * g), String(3 * g)])).indexOf(String(3 * g)), no: 'Ogni gruppo contiene una lettura immediatamente seguita dal suo uso: tre nop per gruppo, ' + (3 * g) + ' in tutto.' } });
      P(1, 1, 'I cicli di L, U, I', 'La versione originale occupa 4 cicli di riempimento, ' + c.n + ' cicli con un’uscita utile e ' + (3 * g) + ' cicli per le nop, tre per gruppo. Complessivamente ' + c.A + ' cicli.', { calc: '4 + ' + c.n + ' + ' + (3 * g) + ' = ' + c.A + ' cicli' });
      P(2, 1, 'I cicli di L, I, U', 'Nella versione riordinata I separa ogni lettura dal suo uso, e per ogni gruppo bastano due nop. Restano i 4 cicli di riempimento, i ' + c.n + ' con un’uscita utile e ' + (2 * g) + ' per le nop: ' + c.B + ' cicli. Le due strisce hanno la medesima scala, e la seconda è più corta di ' + g + ' caselle.', { calc: '4 + ' + c.n + ' + ' + (2 * g) + ' = ' + c.B + ' cicli' });
      P(3, 2, 'I tempi', 'Ogni ciclo dura ' + t + ' ps. La versione originale impiega ' + c.A + ' × ' + t + ' = ' + c.TA + ' ps. Quella riordinata ' + c.B + ' × ' + t + ' = ' + c.TB + ' ps.', { calc: c.TA + ' ps e ' + c.TB + ' ps' });
      P(4, 2, 'Il risparmio', 'La differenza fra i due tempi è ' + c.TA + ' − ' + c.TB + ' = ' + c.risparmio + ' ps: ' + g + ' cicli da ' + t + ' ps, uno per ogni gruppo. Rispetto al tempo di partenza è il ' + U.P1(c.risparmio / c.TA) + '.', { calc: 'risparmio = ' + g + ' × ' + t + ' = ' + c.risparmio + ' ps', esito: ['risparmio ' + c.risparmio + ' ps', 'si'],
        chiedi: { d: 'L’accelerazione è un rapporto fra i due tempi. Quale tempo è il dividendo?', o: ['Quello della versione originale', 'Quello della versione riordinata'], g: 0, no: 'L’accelerazione divide il tempo originale per il tempo migliorato. Un miglioramento dà un valore maggiore di 1.' } });
      P(5, 3, 'Il CPI', 'Le istruzioni utili completate sono ' + c.n + ' in entrambe le versioni, e le nop non vi sono contate. Il CPI della versione originale vale ' + c.A + ' / ' + c.n + ' = ' + D3(c.cpiA) + '. Quello della versione riordinata ' + c.B + ' / ' + c.n + ' = ' + D3(c.cpiB) + '. Il secondo resta superiore a 1 per il riempimento e per le nop rimaste.', { calc: 'CPI: ' + D3(c.cpiA) + ' e ' + D3(c.cpiB) });
      P(6, 3, 'L’accelerazione', 'L’accelerazione è il tempo originale diviso per quello riordinato: ' + c.TA + ' / ' + c.TB + ' = ' + D3(c.acc) + '. Il periodo compare nel dividendo e nel divisore, e si semplifica: è rilevante soltanto il rapporto fra i cicli, ' + c.A + ' / ' + c.B + '.', { calc: 'accelerazione = ' + c.A + ' / ' + c.B + ' = ' + D3(c.acc), esito: ['accelerazione ' + D3(c.acc), 'si'] });
      P(7, 3, 'L’effetto della lunghezza', 'Con ' + g + ' gruppi il risparmio è di ' + c.risparmio + ' ps e l’accelerazione vale ' + D3(c.acc) + '. Con il doppio dei gruppi il risparmio raddoppierebbe, ' + (2 * c.risparmio) + ' ps, mentre l’accelerazione salirebbe soltanto a ' + D3(U.conti(2 * g, t).acc) + '. Al crescere del programma l’accelerazione si avvicina a 6 / 5, cioè 1,2, senza raggiungerlo.', { calc: 'limite: 6 / 5 = 1,2', esito: ['risparmio ' + c.risparmio + ' ps · accelerazione ' + D3(c.acc), 'si'] });
      return { passi, esito: c.risparmio };
    }
  },
  bilancio: {
    regola: [
      'Il tempo di un programma è il numero di cicli per il periodo. Il CPI è il numero di cicli diviso per le istruzioni del programma, nop escluse. L’accelerazione è il tempo originale diviso per il tempo migliorato.',
      'Il riordino di L, U, I in L, I, U risparmia una nop, cioè un periodo, per gruppo. L’accelerazione dipende anche dai 4 cicli di riempimento, e nei programmi lunghi si avvicina a 6 / 5.'
    ],
    errori: [
      ['Confondere il risparmio con l’accelerazione.', 'Il risparmio è una differenza di tempi, in picosecondi. L’accelerazione è un rapporto, privo di unità.'],
      ['Calcolare l’accelerazione con il rapporto invertito.', 'Il tempo originale è il dividendo, quello migliorato il divisore. Un miglioramento dà un valore maggiore di 1.'],
      ['Attendersi che l’accelerazione raddoppi con il programma.', 'Raddoppiando i gruppi raddoppia il risparmio. L’accelerazione varia di poco, poiché cresce anche il tempo di partenza.']
    ],
    saFare: ['Convertire i cicli in tempo.', 'Calcolare il CPI delle due versioni.', 'Calcolare risparmio e accelerazione, e distinguerli.'],
    esercizi: [
      { d: 'Un programma ripete 6 volte il gruppo L, U, I, con tre nop per gruppo, a partire dalla pipeline vuota e con un periodo di 50 ps. Quanto dura, in picosecondi?', segnaposto: 'Un tempo in ps', giuste: ['2000', '2.000', '2000ps', '2.000ps'],
        ok: 'I cicli sono 18 + 18 + 4 = 40, e il tempo 40 × 50 = 2000 ps.',
        diagnosi: [
          { se: ['1700', '1.700', '1700ps'], msg: 'Questo è il tempo della versione riordinata, con due nop per gruppo.' },
          { se: ['40'], msg: 'Questi sono i cicli. Il tempo si ottiene moltiplicandoli per il periodo.' },
          { se: ['1100', '1.100', '1100ps'], msg: 'Mancano le 18 nop.' },
          { se: ['1800', '1.800', '1800ps'], msg: 'Mancano i 4 cicli di riempimento.' }
        ],
        altro: 'Il valore è diverso. Si contino i cicli, comprese le nop e il riempimento, poi si moltiplichi per il periodo.',
        indizi: ['Le istruzioni utili sono 6 × 3 = 18, e le nop 6 × 3 = 18.', 'I cicli sono 18 + 18 + 4 = 40.', '40 × 50.'],
        svolgimento: ['Istruzioni utili: 18. nop: 18.', 'Cicli: 18 + 18 + 4 = 40.', 'Tempo: 40 × 50 = 2000 ps.'] },
      { d: 'Riordinato in L, I, U, il medesimo programma occupa 34 cicli a fronte dei 40 precedenti. Quanto vale l’accelerazione? Si arrotondi al millesimo.', segnaposto: 'Un numero con la virgola', giuste: ['1.176', '1.18', '1.1765', '1.177'],
        ok: 'Il periodo è il medesimo, quindi è sufficiente il rapporto fra i cicli: 40 / 34 = 1,176.',
        diagnosi: [
          { se: ['0.85', '0.850'], msg: 'Il rapporto è invertito. Il tempo originale è il dividendo, quello migliorato il divisore.' },
          { se: ['300', '300ps'], msg: 'Questo è il risparmio in picosecondi. L’accelerazione è un rapporto fra i due tempi.' },
          { se: ['6', 'sei'], msg: 'Questa è la differenza in cicli. L’accelerazione è un rapporto.' }
        ],
        altro: 'Il valore è diverso. Si dividano i cicli della versione originale per quelli della versione riordinata.',
        indizi: ['L’accelerazione è il tempo originale diviso per il tempo migliorato.', 'Con il medesimo periodo è sufficiente il rapporto fra i cicli.', '40 / 34.'],
        svolgimento: ['Tempo originale: 40 × 50 = 2000 ps.', 'Tempo riordinato: 34 × 50 = 1700 ps.', 'Accelerazione: 2000 / 1700 = 1,176.'] },
      { d: 'Raddoppiando il numero di gruppi, come variano il risparmio di tempo e l’accelerazione?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il risparmio raddoppia, l’accelerazione aumenta di poco', ok: true, fb: 'Il risparmio è di un periodo per gruppo. L’accelerazione è un rapporto, e si avvicina lentamente a 6 / 5.' },
        { t: 'Raddoppiano entrambi', fb: 'L’accelerazione è un rapporto fra due tempi che crescono insieme, e resta sotto 6 / 5.' },
        { t: 'Restano uguali entrambi', fb: 'Ogni gruppo aggiuntivo contiene un’ulteriore nop da sostituire, e il risparmio cresce.' }] }
    ],
    sfida: ['cslez3_6_05_random_assembly', 'Trasferimenti tra stadi e bolle']
  }
});
