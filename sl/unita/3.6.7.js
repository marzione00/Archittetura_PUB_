'use strict';
SL.unita367 = (() => {
  const D3 = (x) => x.toFixed(3).replace('.', ',');
  const P1 = (x) => (100 * x).toFixed(1).replace('.', ',') + '%';
  const conti = (g, t) => { const n = 3 * g, A = n + 4 + g, B = n + 4; return { n, A, B, TA: A * t, TB: B * t, risparmio: g * t, acc: A / B, cpiA: A / n, cpiB: B / n }; };
  // Due strisce con una casella per ciclo e la stessa scala: 4 di riempimento, 3g con un'uscita, e nella prima g di attesa.
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
SL.registra('3.6.7', {
  titolo: 'Misurare e spiegare le prestazioni',
  obiettivo: 'Obiettivo: misurare il guadagno di un riordino su un programma intero in cicli, in tempo, in CPI e come accelerazione, distinguendo il risparmio assoluto dal rapporto.',
  concetti: [['clock', 'Dai cicli al tempo'], ['bilancio', 'Il CPI prima e dopo'], ['lente', 'Risparmio e accelerazione']],
  filigrana: ['bilancio', 'clock', 'lente'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 3.6.6', t: 'Due ordini', d: 'L’ordine L, U, I costa un ciclo di attesa per gruppo. L’ordine L, I, U nessuno.' },
      { sim: 'bilancio', da: 'Dall’unità 3.5.4', t: 'Il CPI misurato', d: 'I cicli sono le istruzioni, più 4, più le penalità. Il CPI li divide per le istruzioni.' },
      { sim: 'clock', da: 'Dall’unità 2.1.4', t: 'Il tempo di un programma', d: 'Il numero di cicli moltiplicato per il periodo di clock.' }
    ],
    domanda: { d: 'Prima di proseguire: un programma occupa 20 cicli con un periodo di 50 ps. Quanto dura?', o: [
      { t: '1000 ps', ok: true, fb: 'Venti cicli da 50 ps ciascuno: 20 × 50 = 1000 ps.' },
      { t: '70 ps', fb: 'I cicli vanno moltiplicati per il periodo: sommarli mescola grandezze diverse.' },
      { t: '2,5 ps', fb: 'Dividendo il periodo per i cicli si ottiene un numero privo di significato. Ogni ciclo dura un periodo intero.' }
    ] }
  },
  idea: {
    titolo: 'Quattro modi di dire quanto si guadagna',
    termini: ['accelerazione'],
    testo: [
      'Il riordino dell’unità precedente toglie un ciclo di attesa a ogni gruppo di tre istruzioni. Per dire quanto vale questo guadagno su un programma intero servono quattro misure, e ciascuna risponde a una domanda diversa.',
      'La prima sono i cicli. Con g gruppi il programma contiene 3g istruzioni. Nell’ordine L, U, I occupa 3g + 4 + g cicli, e nell’ordine L, I, U ne occupa 3g + 4. La differenza è g, un ciclo per gruppo. La seconda misura è il tempo: i cicli moltiplicati per il periodo di clock, che resta lo stesso perché il circuito è lo stesso.',
      'La terza è il CPI, cioè i cicli divisi per le istruzioni. Dice quanto costa in media una istruzione, e permette di confrontare programmi di lunghezza diversa.',
      { fig: 'scena', w: 720, h: 110, titolo: 'Quattro gruppi, prima e dopo il riordino', nota: 'Le caselle rosse sono i quattro cicli di attesa, uno per gruppo. Dopo il riordino scompaiono.', els: SL.unita367.strisce('g', 4, { x: 110, xn: 10, y: 8, w: 520, h: 30, py: 44, accesa1: true, accesa2: true }) },
      'La quarta è l’[[accelerazione]]: il tempo della versione originale diviso per il tempo della versione migliorata. È un numero senza unità di misura. Con quattro gruppi e un periodo di 65 ps i cicli sono 20 e 16, i tempi 1300 ps e 1040 ps, e l’accelerazione vale 1300 / 1040 = 1,25.',
      'Risparmio e accelerazione dicono cose diverse. Il risparmio, qui 260 ps, cresce in proporzione al numero di gruppi. L’accelerazione cresce molto meno, perché aumenta anche il tempo di partenza. Con moltissimi gruppi i 4 cicli di riempimento diventano trascurabili, e l’accelerazione si avvicina a 4 / 3, circa 1,333: quattro cicli per gruppo contro tre.'
    ]
  },
  esperimento: {
    faremo: [
      'Confronteremo le due versioni dello stesso programma, L, U, I e L, I, U, su più gruppi. Sceglierai il numero di gruppi e il periodo di clock.',
      'Conteremo i cicli delle due versioni, li trasformeremo in tempi e ne ricaveremo risparmio, CPI e accelerazione. Dopo il caso proposto, raddoppia i gruppi e osserva quale misura raddoppia e quale no.'
    ],
    vedrai: [
      ['clock', 'Le due strisce', 'In alto: una casella per ciclo, con la stessa scala per le due versioni.'],
      ['bilancio', 'Tempi e risparmio', 'Al centro: i due tempi e la loro differenza.'],
      ['lente', 'CPI e accelerazione', 'In basso: il costo medio di una istruzione e il rapporto fra i tempi.']
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
    nota: 'I passi sono sempre otto. Le due versioni usano lo stesso periodo. I valori con la virgola sono arrotondati al millesimo.',
    previsione: {
      domanda: (p) => 'Un programma ripete ' + p.g + ' volte il gruppo L, U, I, con un periodo di ' + p.t + ' ps. Riordinato in L, I, U, quanto tempo risparmia?',
      opzioni: (p) => Array.from(new Set([p.t, p.g * p.t, 4 * p.t, 2 * p.g * p.t])).sort((a, b) => a - b).map((v) => [v, v + ' ps'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' ps. Il riordino risparmia ' + esito + ' ps. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.t ? 'Il riordino toglie un’attesa a ogni gruppo, e i gruppi sono ' + p.g + '.' : 'Il risparmio è di un ciclo per gruppo: ' + p.g + ' cicli da ' + p.t + ' ps.'),
    costruisci(p) {
      const el = SL.el, U = SL.unita367, D3 = U.D3, passi = [], g = p.g, t = p.t, c = U.conti(g, t);
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

      P(0, 0, 'Il programma', 'Il programma ripete ' + g + ' volte un gruppo di tre istruzioni: un carico L, il suo uso U e una istruzione indipendente I. In tutto ' + c.n + ' istruzioni. La versione originale le dispone nell’ordine L, U, I. Quella riordinata nell’ordine L, I, U. Il periodo di clock è ' + t + ' ps per entrambe.',
        { chiedi: { d: 'Quante attese per carico e uso contiene la versione L, U, I con ' + g + ' gruppi?', o: ['1', String(g), String(c.n)], g: 1, no: 'Ogni gruppo contiene un carico seguito subito dal suo uso: una attesa per gruppo.' } });
      P(1, 1, 'I cicli di L, U, I', 'La versione originale occupa 4 cicli di riempimento, ' + c.n + ' cicli con un’uscita e ' + g + ' cicli di attesa, uno per gruppo. In tutto ' + c.A + ' cicli.', { calc: '4 + ' + c.n + ' + ' + g + ' = ' + c.A + ' cicli' });
      P(2, 1, 'I cicli di L, I, U', 'Nella versione riordinata I separa ogni carico dal suo uso, e le attese scompaiono. Restano i 4 cicli di riempimento e i ' + c.n + ' con un’uscita: ' + c.B + ' cicli. Le due strisce hanno la stessa scala, e la seconda è più corta di ' + g + ' caselle.', { calc: '4 + ' + c.n + ' = ' + c.B + ' cicli' });
      P(3, 2, 'I tempi', 'Ogni ciclo dura ' + t + ' ps. La versione originale impiega ' + c.A + ' × ' + t + ' = ' + c.TA + ' ps. Quella riordinata ' + c.B + ' × ' + t + ' = ' + c.TB + ' ps.', { calc: c.TA + ' ps e ' + c.TB + ' ps' });
      P(4, 2, 'Il risparmio', 'La differenza fra i due tempi è ' + c.TA + ' − ' + c.TB + ' = ' + c.risparmio + ' ps: ' + g + ' cicli da ' + t + ' ps, uno per ogni gruppo. Rispetto al tempo di partenza è il ' + U.P1(c.risparmio / c.TA) + '.', { calc: 'risparmio = ' + g + ' × ' + t + ' = ' + c.risparmio + ' ps', esito: ['risparmio ' + c.risparmio + ' ps', 'si'],
        chiedi: { d: 'L’accelerazione è un rapporto fra i due tempi. Quale tempo va sopra?', o: ['Quello della versione originale', 'Quello della versione riordinata'], g: 0, no: 'L’accelerazione divide il tempo vecchio per il tempo nuovo. Un miglioramento dà un valore maggiore di 1.' } });
      P(5, 3, 'Il CPI', 'Le istruzioni completate sono ' + c.n + ' in entrambe le versioni. Il CPI della versione originale vale ' + c.A + ' / ' + c.n + ' = ' + D3(c.cpiA) + '. Quello della versione riordinata ' + c.B + ' / ' + c.n + ' = ' + D3(c.cpiB) + '. Il secondo resta sopra 1 per i soli cicli di riempimento.', { calc: 'CPI: ' + D3(c.cpiA) + ' e ' + D3(c.cpiB) });
      P(6, 3, 'L’accelerazione', 'L’accelerazione è il tempo originale diviso per quello riordinato: ' + c.TA + ' / ' + c.TB + ' = ' + D3(c.acc) + '. Il periodo compare sopra e sotto, e si semplifica: conta soltanto il rapporto fra i cicli, ' + c.A + ' / ' + c.B + '.', { calc: 'accelerazione = ' + c.A + ' / ' + c.B + ' = ' + D3(c.acc), esito: ['accelerazione ' + D3(c.acc), 'si'] });
      P(7, 3, 'Che cosa cambia con la lunghezza', 'Con ' + g + ' gruppi il risparmio è di ' + c.risparmio + ' ps e l’accelerazione vale ' + D3(c.acc) + '. Con il doppio dei gruppi il risparmio raddoppierebbe, ' + (2 * c.risparmio) + ' ps, mentre l’accelerazione salirebbe soltanto a ' + D3(U.conti(2 * g, t).acc) + '. Al crescere del programma l’accelerazione si avvicina a 4 / 3, cioè 1,333, senza superarlo.', { calc: 'limite: 4 / 3 = 1,333', esito: ['risparmio ' + c.risparmio + ' ps · accelerazione ' + D3(c.acc), 'si'] });
      return { passi, esito: c.risparmio };
    }
  },
  bilancio: {
    regola: [
      'Il tempo di un programma è il numero di cicli per il periodo. Il CPI è il numero di cicli diviso per le istruzioni. L’accelerazione è il tempo vecchio diviso per il tempo nuovo.',
      'Il riordino di L, U, I in L, I, U risparmia un periodo per gruppo. L’accelerazione dipende anche dai 4 cicli di riempimento, e nei programmi lunghi si avvicina a 4 / 3.'
    ],
    errori: [
      ['Confondere il risparmio con l’accelerazione.', 'Il risparmio è una differenza di tempi, in picosecondi. L’accelerazione è un rapporto, senza unità.'],
      ['Calcolare l’accelerazione al contrario.', 'Il tempo vecchio sta sopra, quello nuovo sotto. Un miglioramento dà un valore maggiore di 1.'],
      ['Aspettarsi che l’accelerazione raddoppi con il programma.', 'Raddoppiando i gruppi raddoppia il risparmio. L’accelerazione cambia poco, perché cresce anche il tempo di partenza.']
    ],
    saFare: ['Passare dai cicli al tempo.', 'Calcolare il CPI delle due versioni.', 'Calcolare risparmio e accelerazione, e li distinguo.'],
    esercizi: [
      { d: 'Un programma ripete 6 volte il gruppo L, U, I a partire dalla pipeline vuota, con un periodo di 50 ps. Quanto dura, in picosecondi?', segnaposto: 'Un tempo in ps', giuste: ['1400', '1.400', '1400ps', '1.400ps'],
        ok: 'I cicli sono 18 + 4 + 6 = 28, e il tempo 28 × 50 = 1400 ps.',
        diagnosi: [
          { se: ['1100', '1.100', '1100ps'], msg: 'Questo è il tempo della versione riordinata, senza le 6 attese.' },
          { se: ['28'], msg: 'Questi sono i cicli. Per ottenere il tempo moltiplica per il periodo.' },
          { se: ['900', '900ps'], msg: 'Mancano i 4 cicli di riempimento e le 6 attese.' },
          { se: ['1200', '1.200', '1200ps'], msg: 'Mancano i 4 cicli di riempimento.' }
        ],
        altro: 'Il valore è diverso. Conta i cicli, comprese le attese e il riempimento, poi moltiplica per il periodo.',
        indizi: ['Le istruzioni sono 6 × 3 = 18.', 'I cicli sono 18 + 4 + 6 = 28.', '28 × 50.'],
        svolgimento: ['Istruzioni: 18.', 'Cicli: 18 + 4 + 6 = 28.', 'Tempo: 28 × 50 = 1400 ps.'] },
      { d: 'Riordinato in L, I, U, lo stesso programma occupa 22 cicli contro i 28 di prima. Quanto vale l’accelerazione? Arrotonda al millesimo.', segnaposto: 'Un numero con la virgola', giuste: ['1.273', '1.27', '1.2727', '1.272'],
        ok: 'Il periodo è lo stesso, quindi basta il rapporto fra i cicli: 28 / 22 = 1,273.',
        diagnosi: [
          { se: ['0.786', '0.79', '0.7857', '0.785'], msg: 'Il rapporto è rovesciato. Il tempo vecchio sta sopra, quello nuovo sotto.' },
          { se: ['300', '300ps'], msg: 'Questo è il risparmio in picosecondi. L’accelerazione è un rapporto fra i due tempi.' },
          { se: ['6', 'sei'], msg: 'Questa è la differenza in cicli. L’accelerazione è un rapporto.' }
        ],
        altro: 'Il valore è diverso. Si dividano i cicli della versione originale per quelli della versione riordinata.',
        indizi: ['L’accelerazione è il tempo vecchio diviso per il tempo nuovo.', 'Con lo stesso periodo basta il rapporto fra i cicli.', '28 / 22.'],
        svolgimento: ['Tempo originale: 28 × 50 = 1400 ps.', 'Tempo riordinato: 22 × 50 = 1100 ps.', 'Accelerazione: 1400 / 1100 = 1,273.'] },
      { d: 'Raddoppiando il numero di gruppi, che cosa accade al risparmio di tempo e all’accelerazione?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il risparmio raddoppia, l’accelerazione aumenta di poco', ok: true, fb: 'Il risparmio è di un periodo per gruppo. L’accelerazione è un rapporto, e si avvicina lentamente a 4 / 3.' },
        { t: 'Raddoppiano entrambi', fb: 'L’accelerazione è un rapporto fra due tempi che crescono insieme, e resta sotto 4 / 3.' },
        { t: 'Restano uguali entrambi', fb: 'Ogni gruppo in più contiene un’attesa in più da eliminare, e il risparmio cresce.' }] }
    ]
  }
});
