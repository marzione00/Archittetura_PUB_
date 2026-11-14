'use strict';
SL.registra('3.5.1', {
  titolo: 'Sovrapposizione, capacità di completamento e latenza',
  obiettivo: 'Obiettivo: distinguere la latenza di un’istruzione dalla cadenza con cui una pipeline completa le istruzioni, e calcolare in quale ciclo esce l’ultima istruzione di un flusso.',
  concetti: [['pipeline', 'Più istruzioni in viaggio insieme'], ['clock', 'Latenza e cadenza'], ['bilancio', 'Quanti cicli in tutto']],
  filigrana: ['pipeline', 'clock', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'clock', da: 'Dall’unità 3.4.5', t: 'Un’istruzione alla volta', d: 'Nella macchina multiciclo, mentre un’istruzione è al terzo passo i circuiti dei primi due restano inoperosi.' },
      { sim: 'register', da: 'Dall’unità 3.2.4', t: 'Registri e logica', d: 'A ogni fronte un registro consegna una parola alla logica che lo segue, e cattura quella preparata dalla logica che lo precede.' },
      { sim: 'bilancio', da: 'Dall’unità 2.1.4', t: 'Cicli e tempo', d: 'Il tempo di esecuzione è il numero di cicli moltiplicato per il periodo.' }
    ],
    domanda: { d: 'Prima di proseguire: una macchina multiciclo esegue ogni istruzione in 5 cicli, una alla volta. Quanti cicli le servono per 7 istruzioni?', o: [
      { t: '35', ok: true, fb: 'Ogni istruzione attende che la precedente abbia finito: 7 × 5.' },
      { t: '11', fb: 'Undici cicli basterebbero se le istruzioni potessero sovrapporsi. Qui ne viaggia una alla volta.' },
      { t: '7', fb: 'Sette cicli basterebbero con un ciclo per istruzione. Qui ogni istruzione ne usa 5.' }
    ] }
  },
  idea: {
    titolo: 'Una catena di montaggio',
    termini: ['pipeline', 'stadio', 'latenza', 'cadenza di completamento'],
    testo: [
      'La macchina multiciclo divide il lavoro in passi e li percorre con un’istruzione alla volta. Mentre l’istruzione si trova al terzo passo, i circuiti dei primi due aspettano. La [[pipeline]] toglie di mezzo questa attesa: appena un’istruzione lascia il primo passo, vi entra la successiva. È il principio della catena di montaggio.',
      'Ogni passo della catena è uno [[stadio]]. Fra uno stadio e il successivo stanno dei registri, che a ogni fronte del clock consegnano in avanti il lavoro compiuto. In ogni ciclo, ogni stadio ospita un’istruzione diversa.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Tre istruzioni in una pipeline di cinque stadi', nota: 'Le colonne sono i cicli. In ogni casella, lo stadio in cui l’istruzione si trova.', els:
        SL.pipe.diagramma('g', [{ n: 'I1', da: 1, s: ['1', '2', '3', '4', '5'] }, { n: 'I2', da: 2, s: ['1', '2', '3', '4', '5'] }, { n: 'I3', da: 3, s: ['1', '2', '3', '4', '5'] }], { x: 110, y: 6, passo: 84, cicli: 7, py: 38, h: 30 }) },
      'Due misure descrivono una pipeline, e si scambiano facilmente. La [[latenza]] è il tempo che una singola istruzione impiega per attraversare tutti gli stadi: con k stadi e un periodo T vale k × T. La [[cadenza di completamento]] è il ritmo con cui le istruzioni escono dall’ultimo stadio, e a regime vale un’istruzione per ciclo.',
      'La singola istruzione impiega sempre k cicli, e la pipeline lascia questa latenza com’è. Il guadagno sta nelle uscite, che diventano più fitte: una ogni T, contro una ogni k × T della macchina che procede con un’istruzione alla volta.',
      'Quando N istruzioni entrano una per ciclo in una pipeline vuota, la prima esce alla fine del ciclo k, e l’ultima N − 1 cicli più tardi. In tutto servono k + N − 1 cicli. I primi k − 1, durante i quali nessuna istruzione esce, sono il riempimento.'
    ]
  },
  esperimento: {
    faremo: [
      'In una pipeline vuota entrano alcune istruzioni indipendenti, una per ciclo. Sceglierai il numero di stadi, il numero di istruzioni e il periodo.',
      'Seguiremo il diagramma ciclo per ciclo, fermandoci alla prima uscita, alla seconda e all’ultima. Dopo il caso proposto, prova con una sola istruzione: la latenza resterà la stessa.'
    ],
    vedrai: [
      ['pipeline', 'Il diagramma', 'Al centro: una riga per istruzione e una colonna per ciclo. In ogni casella, il numero dello stadio occupato.'],
      ['clock', 'Il ciclo in corso', 'La colonna in evidenza.'],
      ['bilancio', 'Le misure', 'In basso: la latenza, la prima uscita, l’ultima uscita e il tempo totale.']
    ]
  },
  lab: {
    titolo: 'Un flusso di istruzioni indipendenti',
    scena: { w: 860, h: 330 },
    atti: ['Il primo ciclo', 'La prima uscita', 'A regime', 'L’ultima uscita', 'Latenza e cadenza'],
    controlli: [
      { id: 'k', tipo: 'scelta', eti: 'Stadi', opzioni: [[5, '5'], [3, '3']], valore: 5 },
      { id: 'n', tipo: 'scelta', eti: 'Istruzioni', opzioni: [[1, '1'], [4, '4'], [7, '7']], valore: 7 },
      { id: 't', tipo: 'scelta', eti: 'Periodo', opzioni: [[40, '40 ps'], [60, '60 ps']], valore: 40 }
    ],
    nota: 'I passi sono sempre cinque. Le istruzioni sono indipendenti, e nessuna deve attendere le altre.',
    previsione: {
      domanda: (p) => 'In una pipeline vuota di ' + p.k + ' stadi entrano ' + (p.n === 1 ? 'una sola istruzione' : p.n + ' istruzioni indipendenti, una per ciclo') + '. Alla fine di quale ciclo esce ' + (p.n === 1 ? 'dall’ultimo stadio?' : 'l’ultima?'),
      opzioni: (p) => Array.from(new Set([p.k + p.n - 1, p.k * p.n, p.k + p.n, p.n, p.k - 1])).filter((v) => v > 0).sort((a, b) => a - b).map((v) => [v, 'Ciclo ' + v])
    },
    confronto: (pred, esito, p) => 'La previsione indicava il ciclo ' + pred + '. L’ultima istruzione esce alla fine del ciclo ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.k * p.n ? 'Il prodotto stadi per istruzioni vale per una macchina che ne esegue una alla volta. Qui le istruzioni si sovrappongono.' : 'La prima istruzione esce al ciclo ' + p.k + ', e ogni ciclo successivo ne esce un’altra: ' + p.k + ' + ' + p.n + ' − 1 = ' + esito + '.'),
    costruisci(p) {
      const el = SL.el, passi = [], k = p.k, n = p.n, T = p.t, tot = k + n - 1;
      const righe = Array.from({ length: n }, (_, i) => ({ n: 'I' + (i + 1), da: i + 1, s: Array.from({ length: k }, (_, j) => String(j + 1)) }));
      const usciteA = (c) => Math.max(0, Math.min(n, c - k + 1));
      const quadro = (o) => {
        const c = o.c, els = [el.nota('t0', 20, 0, 'CICLO', 'mono')];
        SL.pipe.diagramma('d', righe, { x: 150, y: 0, passo: 60, cicli: 11, py: 30, h: 24, fino: c, evid: c }).forEach((e) => els.push(e));
        els.push(el.box('b1', 20, 252, 196, 66, 'latenza', o.lat ? k + ' cicli · ' + k * T + ' ps' : '·', o.lat === 2 ? 'att' : o.lat ? 'on' : '', { cls: 'stretta' }),
          el.box('b2', 226, 252, 196, 66, 'prima uscita', c >= k ? 'ciclo ' + k : '·', o.prima ? 'att' : c >= k ? 'on' : '', { cls: 'stretta' }),
          el.box('b3', 432, 252, 196, 66, 'ultima uscita', c >= tot ? 'ciclo ' + tot : '·', o.ultima ? 'att' : c >= tot ? 'on' : '', { cls: 'stretta' }),
          el.box('b4', 638, 252, 206, 66, 'tempo totale', o.fine ? tot + ' × ' + T + ' = ' + tot * T + ' ps' : '·', o.fine ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (c) => [['Ciclo', String(c), 'a'], ['Istruzioni uscite', String(usciteA(c))], ['Tempo trascorso', c * T + ' ps', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.c), els: quadro(o) }, extra));

      P({ c: 1 }, 0, 'Il primo ciclo', 'La pipeline è vuota. Nel ciclo 1 la prima istruzione, I1, entra nello stadio 1.' + (n > 1 ? ' Le altre attendono il proprio turno: ne entrerà una per ciclo.' : ' È l’unica istruzione di questo flusso.') + ' Gli stadi sono ' + k + ', e ciascuno dura un ciclo di ' + T + ' ps.',
        { chiedi: { d: 'I1 avanza di uno stadio per ciclo. In quale ciclo si troverà nell’ultimo stadio, il numero ' + k + '?', o: [k - 1, k, k + 1].map((v) => 'Ciclo ' + v), g: 1, no: 'Nel ciclo 1 occupa lo stadio 1, nel ciclo 2 lo stadio 2, e così via: nel ciclo ' + k + ' occupa lo stadio ' + k + '.' } });
      P({ c: k, lat: 2, prima: true }, 1, 'La prima uscita', 'Nel ciclo ' + k + ' I1 occupa l’ultimo stadio, e alla fine del ciclo è completa. Ha impiegato ' + k + ' cicli, cioè ' + k + ' × ' + T + ' = ' + k * T + ' ps: è la latenza. Durante i primi ' + (k - 1) + ' cicli nessuna istruzione è uscita.' + (n > 1 ? ' Intanto dietro di lei sono entrate altre ' + (Math.min(n, k) - 1) + ' istruzioni.' : ''),
        { calc: 'latenza = ' + k + ' × ' + T + ' = ' + k * T + ' ps', chiedi: n > 1 ? { d: 'I2 è entrata un ciclo dopo I1. Quanti cicli dopo I1 uscirà?', o: ['1', String(k)], g: 0, no: 'I2 percorre gli stessi stadi con un ciclo di ritardo, quindi esce un ciclo dopo.' } : null });
      if (!passi[passi.length - 1].chiedi) delete passi[passi.length - 1].chiedi;
      const c3 = Math.min(k + 1, tot);
      P({ c: c3, lat: 1 }, 2, n > 1 ? 'Un’uscita per ciclo' : 'Una sola istruzione', n > 1 ? 'Nel ciclo ' + c3 + ' esce I2, un solo ciclo dopo I1. Da qui in avanti, finché arrivano istruzioni, ne esce una per ciclo: una ogni ' + T + ' ps. La latenza di ciascuna resta di ' + k * T + ' ps, e le uscite distano fra loro soltanto ' + T + ' ps.' : 'Con una sola istruzione il vantaggio della pipeline scompare: I1 ha impiegato ' + k + ' cicli, come in una macchina multiciclo. Il guadagno nasce soltanto quando le istruzioni si sovrappongono.',
        { calc: n > 1 ? 'cadenza: 1 istruzione ogni ' + T + ' ps' : 'nessuna sovrapposizione', chiedi: n > 1 ? { d: 'Le istruzioni sono ' + n + '. Dopo I1 ne restano ' + (n - 1) + ', una per ciclo. In quale ciclo esce l’ultima?', o: Array.from(new Set([tot - 1, tot, tot + 1])).map((v) => 'Ciclo ' + v), g: 1, no: 'La prima esce al ciclo ' + k + ', e le altre ' + (n - 1) + ' nei cicli successivi: ' + k + ' + ' + (n - 1) + ' = ' + tot + '.' } : null });
      if (!passi[passi.length - 1].chiedi) delete passi[passi.length - 1].chiedi;
      P({ c: tot, lat: 1, ultima: true }, 3, 'L’ultima uscita', n > 1 ? 'Nel ciclo ' + tot + ' esce I' + n + ', l’ultima. Era entrata nel ciclo ' + n + ' e ha attraversato i ' + k + ' stadi come le altre. In tutto sono serviti ' + k + ' + ' + n + ' − 1 = ' + tot + ' cicli.' : 'L’unica istruzione è uscita al ciclo ' + k + ', e il flusso è finito. La formula dà lo stesso numero: ' + k + ' + 1 − 1 = ' + tot + ' cicli.', { calc: k + ' + ' + n + ' − 1 = ' + tot + ' cicli' });
      P({ c: tot, lat: 1, fine: true }, 4, 'Il conto finale', 'Il flusso è durato ' + tot + ' cicli, cioè ' + tot * T + ' ps. Una macchina che eseguisse le stesse istruzioni una alla volta, con gli stessi ' + k + ' passi da ' + T + ' ps, avrebbe impiegato ' + n + ' × ' + k + ' = ' + n * k + ' cicli, cioè ' + n * k * T + ' ps.' + (n > 1 ? ' Più il flusso è lungo, più il rapporto fra i due tempi si avvicina a ' + k + ', il numero degli stadi.' : ''),
        { calc: tot + ' × ' + T + ' = ' + tot * T + ' ps', esito: ['ultima uscita al ciclo ' + tot, 'si'] });
      return { passi, esito: tot };
    }
  },
  bilancio: {
    regola: [
      'La latenza è il tempo di attraversamento di una singola istruzione, k × T. La cadenza a regime è di un’istruzione per ciclo, cioè una ogni T.',
      'N istruzioni indipendenti che entrano in una pipeline vuota di k stadi terminano in k + N − 1 cicli.'
    ],
    errori: [
      ['Credere che la pipeline acceleri la singola istruzione.', 'La latenza resta di k cicli. Diminuisce il tempo fra un’uscita e la successiva.'],
      ['Moltiplicare stadi per istruzioni.', 'Il prodotto k × N è il conto della macchina che esegue un’istruzione alla volta.'],
      ['Dimenticare il riempimento.', 'Nei primi k − 1 cicli nessuna istruzione esce. Su un flusso breve questo tempo pesa molto.']
    ],
    saFare: ['Distinguere latenza e cadenza di completamento.', 'Calcolare il ciclo in cui esce l’ultima istruzione di un flusso.', 'Confrontare il tempo di una pipeline con quello di una macchina che procede con un’istruzione alla volta.'],
    esercizi: [
      { d: 'Una pipeline ha 5 stadi e un periodo di 50 ps. Qual è la latenza di un’istruzione, in picosecondi?', segnaposto: 'Un numero di picosecondi', giuste: ['250', '250ps'],
        ok: 'L’istruzione attraversa 5 stadi, uno per ciclo: 5 × 50 = 250 ps.',
        diagnosi: [
          { se: ['50', '50ps'], msg: 'Cinquanta picosecondi separano due uscite consecutive: è la cadenza. La latenza è il tempo di attraversamento di tutti gli stadi.' },
          { se: ['10', '10ps'], msg: 'Il periodo va moltiplicato per il numero degli stadi.' },
          { se: ['5'], msg: 'Cinque è il numero dei cicli. La domanda chiede il tempo, in picosecondi.' }
        ],
        altro: 'Il numero è diverso. Si moltiplichi il numero degli stadi per il periodo.',
        indizi: ['L’istruzione occupa uno stadio per ciclo.', 'Gli stadi sono 5.', '5 × 50.'],
        svolgimento: ['Stadi: 5.', 'Periodo: 50 ps.', 'Latenza: 5 × 50 = 250 ps.'] },
      { d: 'In una pipeline vuota di 5 stadi entrano 20 istruzioni indipendenti, una per ciclo. Alla fine di quale ciclo esce l’ultima?', segnaposto: 'Un numero', giuste: ['24', 'ventiquattro'],
        ok: 'La prima esce al ciclo 5, e le altre 19 nei cicli successivi: 5 + 20 − 1 = 24.',
        diagnosi: [
          { se: ['100', 'cento'], msg: 'Cento cicli servirebbero a una macchina che esegue un’istruzione alla volta. Nella pipeline le istruzioni si sovrappongono.' },
          { se: ['25', 'venticinque'], msg: 'Sommando 5 e 20 la prima istruzione, che esce al ciclo 5, viene contata due volte. Va tolto 1.' },
          { se: ['20', 'venti'], msg: 'Al ciclo 20 l’ultima istruzione entra nel primo stadio. Deve ancora attraversare gli altri quattro.' }
        ],
        altro: 'Il numero è diverso. La prima istruzione esce al ciclo 5, e ogni ciclo successivo ne esce un’altra.',
        indizi: ['La prima esce al ciclo 5.', 'Dopo la prima restano 19 istruzioni, una per ciclo.', '5 + 19.'],
        svolgimento: ['Prima uscita: ciclo 5.', 'Uscite restanti: 19, una per ciclo.', 'Ultima uscita: 5 + 20 − 1 = 24.'] }
    ],
    sfida: ['cslez3_5_02_random_assembly', 'Latenza, produttività e accelerazione']
  }
});
