'use strict';
SL.registra('3.4.3', {
  titolo: 'Temporizzazione e aggiornamento dello stato',
  obiettivo: 'Alla fine saprai calcolare il periodo minimo di SEQ a partire dai ritardi dei suoi blocchi, e dire quale istruzione lo impone.',
  concetti: [['clock', 'Un periodo per tutte le istruzioni'], ['lente', 'Il percorso più lento'], ['bilancio', 'Il tempo che va perduto']],
  filigrana: ['clock', 'lente', 'cpu'],
  richiami: {
    carte: [
      { sim: 'lente', da: 'Dall’unità 3.1.5', t: 'Il cammino critico', d: 'I ritardi dei blocchi in fila si sommano, e il percorso più lento decide quando l’uscita è affidabile.' },
      { sim: 'clock', da: 'Dall’unità 3.2.4', t: 'Il periodo minimo', d: 'Fra due fronti devono stare il ritardo della logica e il margine chiesto dai registri.' },
      { sim: 'cpu', da: 'Dall’unità 3.4.1', t: 'Un’istruzione per ciclo', d: 'In SEQ tutti i segnali di un’istruzione si propagano dentro lo stesso ciclo.' }
    ],
    domanda: { d: 'Prima di proseguire: tre blocchi in fila impiegano 85, 30 e 45 ps. Dopo quanto tempo è affidabile l’uscita dell’ultimo?', o: [
      { t: '160 ps', ok: true, fb: 'I blocchi lavorano uno dopo l’altro, e i ritardi si sommano.' },
      { t: '85 ps', fb: 'Ottantacinque picosecondi bastano al primo blocco. Gli altri due devono ancora rispondere.' },
      { t: '45 ps', fb: 'L’ultimo blocco comincia a lavorare sui dati giusti soltanto quando i primi due hanno finito.' }
    ] }
  },
  idea: {
    titolo: 'Un ciclo lungo quanto l’istruzione più lenta',
    termini: ['istruzione limitante'],
    testo: [
      'In SEQ ogni istruzione dispone di un ciclo, e il ciclo ha la stessa durata per tutte. Il periodo va quindi scelto pensando alla più lenta. Se bastasse soltanto alle istruzioni rapide, il fronte arriverebbe mentre le altre sono ancora in corso, e nei registri finirebbero valori provvisori.',
      'Ogni classe di istruzioni percorre un tratto diverso della logica. Un’operazione come `addq` attraversa la lettura dell’istruzione, la lettura dei registri e l’ALU, poi un selettore riporta il risultato al banco. Un carico come `mrmovq` segue la stessa strada fino all’ALU, e poi deve ancora interrogare la memoria dei dati, che di solito è il blocco più lento.',
      { fig: 'scena', w: 720, h: 120, titolo: 'Due istruzioni, due percorsi', nota: 'I primi tre blocchi sono comuni. L’ultimo tratto distingue l’operazione aritmetica dal carico.', els: [
        SL.el.nota('r1', 0, 16, 'addq', 'mono'), SL.el.box('a1', 90, 2, 170, 40, null, 'prelievo', 'on', { cls: 'stretta' }), SL.el.box('a2', 266, 2, 110, 40, null, 'registri', 'on', { cls: 'stretta' }), SL.el.box('a3', 382, 2, 110, 40, null, 'ALU', 'on', { cls: 'stretta' }), SL.el.box('a4', 498, 2, 100, 40, null, 'selettore', '', { cls: 'stretta' }),
        SL.el.nota('r2', 0, 76, 'mrmovq', 'mono'), SL.el.box('b1', 90, 62, 170, 40, null, 'prelievo', 'on', { cls: 'stretta' }), SL.el.box('b2', 266, 62, 110, 40, null, 'registri', 'on', { cls: 'stretta' }), SL.el.box('b3', 382, 62, 110, 40, null, 'ALU', 'on', { cls: 'stretta' }), SL.el.box('b4', 498, 62, 222, 40, null, 'memoria dei dati', 'att', { cls: 'stretta' })
      ] },
      'L’istruzione con il percorso più lento si chiama [[istruzione limitante]]. Il periodo minimo è il ritardo del suo percorso, più il margine richiesto dai registri: il loro ritardo di uscita e il tempo di setup dell’unità 3.2.4.',
      'La conseguenza è uno spreco. Un’`addq` che avrebbe finito in 185 ps deve attendere la fine di un ciclo dimensionato per `mrmovq`. Ogni istruzione paga il tempo della più lenta. È il difetto di fondo del ciclo singolo, e il punto di partenza dei capitoli sulla pipeline.'
    ]
  },
  esperimento: {
    faremo: [
      'Confronteremo i percorsi di un’operazione aritmetica e di un carico. La lettura dei registri richiede 30 ps, l’ALU 45 ps, e i registri chiedono un margine di 15 ps. Sceglierai i ritardi del prelievo, della memoria dei dati e del selettore.',
      'Vedremo i due percorsi crescere sullo stesso asse dei tempi, e il periodo fissato dal più lungo. Dopo il caso proposto, scegli una memoria da 20 ps: il limite cambierà istruzione.'
    ],
    vedrai: [
      ['clock', 'L’asse del tempo', 'In alto: i picosecondi dall’inizio del ciclo.'],
      ['lente', 'I due percorsi', 'Al centro: una fila di barre per istruzione, un blocco dopo l’altro.'],
      ['bilancio', 'Il conto', 'In basso: i due totali e il periodo minimo.']
    ]
  },
  lab: {
    titolo: 'Quanto deve durare il ciclo',
    scena: { w: 860, h: 300 },
    atti: ['Il tratto comune', 'Il percorso aritmetico', 'Il percorso del carico', 'L’istruzione limitante', 'Il periodo'],
    controlli: [
      { id: 'f', tipo: 'scelta', eti: 'Prelievo', opzioni: [[85, '85 ps'], [110, '110 ps']], valore: 85 },
      { id: 'm', tipo: 'scelta', eti: 'Memoria dei dati', opzioni: [[95, '95 ps'], [60, '60 ps'], [20, '20 ps']], valore: 95 },
      { id: 's', tipo: 'scelta', eti: 'Selettore', opzioni: [[25, '25 ps'], [80, '80 ps']], valore: 25 }
    ],
    nota: 'I passi sono sempre cinque. Registri 30 ps, ALU 45 ps, margine dei registri 15 ps.',
    previsione: {
      domanda: (p) => 'Il prelievo richiede ' + p.f + ' ps, la lettura dei registri 30 ps e l’ALU 45 ps. Poi un’operazione aritmetica attraversa un selettore da ' + p.s + ' ps, mentre un carico interroga la memoria dei dati, che richiede ' + p.m + ' ps. I registri chiedono un margine di 15 ps. Qual è il periodo minimo?',
      opzioni: (p) => { const c = p.f + 75, a = c + p.s, l = c + p.m; return Array.from(new Set([Math.max(a, l) + 15, Math.max(a, l), Math.min(a, l) + 15, c + p.s + p.m + 15])).sort((x, y) => x - y).map((v) => [v, v + ' ps']); }
    },
    confronto: (pred, esito, p) => { const c = p.f + 75, a = c + p.s, l = c + p.m; return 'Avevi previsto ' + pred + ' ps. Il periodo minimo è ' + esito + ' ps. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il percorso aritmetico dura ' + a + ' ps e quello del carico ' + l + ' ps. Conta il più lungo, a cui si aggiungono i 15 ps di margine. I due percorsi sono alternative e i loro ritardi non si sommano fra loro.'); },
    costruisci(p) {
      const el = SL.el, passi = [], X0 = 180, K = 2.2, com = p.f + 75, A = com + p.s, L = com + p.m, lim = Math.max(A, L), T = lim + 15, NL = L >= A ? 'carico' : 'aritmetica';
      const st = { com: false, a: false, l: false, t: false };
      const riga = (pre, y, ultimo, nomeU, vis, visU, err) => {
        const segs = [[0, p.f, 'prel.'], [p.f, 30, 'reg.'], [p.f + 30, 45, 'ALU'], [com, ultimo, nomeU]], els = [];
        segs.forEach((s, k) => {
          const v = k < 3 ? vis : visU;
          els.push(Object.assign(el.barra(pre + k, X0 + s[0] * K, y, s[1] * K - 3, 30, v ? 1 : 0), err && v ? { st: 'err' } : null),
            el.nota(pre + 'n' + k, X0 + s[0] * K + 2, y - 20, v ? s[2] : '', 'mono minuta'));
        });
        return els;
      };
      const quadro = (o) => {
        const els = [el.nota('t0', 20, 0, 'TEMPO, IN PS', 'mono')];
        for (let k = 0; k <= 300; k += 50) els.push(el.nota('k' + k, X0 + k * K - (k < 100 ? 6 : 12), 0, String(k), 'mono minuta'));
        els.push(el.nota('la', 20, 62, 'aritmetica', 'mono', st.t && NL === 'aritmetica' ? 'att' : ''), el.nota('ll', 20, 138, 'carico', 'mono', st.t && NL === 'carico' ? 'att' : ''));
        riga('a', 56, p.s, 'sel.', st.com, st.a, st.t && NL === 'aritmetica').forEach((e) => els.push(e));
        riga('l', 132, p.m, 'mem.', st.com, st.l, st.t && NL === 'carico').forEach((e) => els.push(e));
        if (st.t) els.push(el.linea('per', X0 + T * K, 24, X0 + T * K, 180, 'att'), el.nota('np', X0 + T * K - 70, 186, 'periodo', 'mono minuta', 'att'));
        els.push(el.box('b1', 20, 216, 196, 72, 'tratto comune', st.com ? com + ' ps' : '·', o.com ? 'att' : st.com ? 'on' : '', { cls: 'stretta' }),
          el.box('b2', 226, 216, 196, 72, 'percorso aritmetico', st.a ? A + ' ps' : '·', o.a ? 'att' : st.a ? 'on' : '', { cls: 'stretta' }),
          el.box('b3', 432, 216, 196, 72, 'percorso del carico', st.l ? L + ' ps' : '·', o.l ? 'att' : st.l ? 'on' : '', { cls: 'stretta' }),
          el.box('b4', 638, 216, 206, 72, 'periodo minimo', st.t ? T + ' ps' : '·', st.t ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Aritmetica', st.a ? A + ' ps' : '·', 'a'], ['Carico', st.l ? L + ' ps' : '·'], ['Periodo', st.t ? T + ' ps' : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      st.com = true;
      P({ com: true }, 0, 'Tre blocchi in comune', 'Le due istruzioni cominciano allo stesso modo. Il prelievo richiede ' + p.f + ' ps, la lettura dei registri 30 ps, l’ALU 45 ps. Dopo ' + p.f + ' + 30 + 45 = ' + com + ' ps l’uscita dell’ALU è pronta, per l’una e per l’altra.',
        { calc: p.f + ' + 30 + 45 = ' + com + ' ps', chiedi: { d: 'L’operazione aritmetica attraversa ancora un selettore da ' + p.s + ' ps. Quanto dura il suo percorso?', o: Array.from(new Set([com, com + p.s, com + p.s + p.m])).map((v) => v + ' ps'), g: 1, no: 'Al tratto comune si aggiunge il solo selettore: ' + com + ' + ' + p.s + ' = ' + A + '.' } });
      st.a = true;
      P({ a: true }, 1, 'L’operazione aritmetica', 'Per un’operazione come `addq` il risultato dell’ALU passa dal selettore che lo riporta al banco dei registri. Il percorso dura ' + com + ' + ' + p.s + ' = ' + A + ' ps. La memoria dei dati non viene interrogata.', { calc: com + ' + ' + p.s + ' = ' + A + ' ps' });
      st.l = true;
      P({ l: true }, 2, 'Il carico', 'Per un carico come `mrmovq` l’uscita dell’ALU è un indirizzo, e la memoria dei dati impiega ' + p.m + ' ps per consegnare la parola. Il percorso dura ' + com + ' + ' + p.m + ' = ' + L + ' ps.',
        { calc: com + ' + ' + p.m + ' = ' + L + ' ps', chiedi: { d: 'Il ciclo ha la stessa durata per tutte le istruzioni. Quale delle due la impone?', o: ['L’operazione aritmetica', 'Il carico'], g: L >= A ? 1 : 0, no: 'Impone il periodo il percorso più lungo: ' + Math.max(A, L) + ' ps contro ' + Math.min(A, L) + ' ps.' } });
      st.t = true;
      P({}, 3, NL === 'carico' ? 'Il limite è il carico' : 'Il limite è l’operazione aritmetica', 'Il percorso più lungo dura ' + lim + ' ps, ed è quello ' + (NL === 'carico' ? 'del carico' : 'dell’operazione aritmetica') + '. Questa è l’istruzione limitante. ' + (NL === 'carico' ? 'La memoria dei dati, con i suoi ' + p.m + ' ps, pesa più del selettore.' : 'Con una memoria da ' + p.m + ' ps e un selettore da ' + p.s + ' ps, il ruolo si è rovesciato rispetto al caso consueto.'),
        { calc: 'max(' + A + ', ' + L + ') = ' + lim + ' ps', chiedi: { d: 'I registri chiedono 15 ps di margine. Qual è il periodo minimo?', o: Array.from(new Set([lim, lim + 15, Math.min(A, L) + 15])).sort((x, y) => x - y).map((v) => v + ' ps'), g: Array.from(new Set([lim, lim + 15, Math.min(A, L) + 15])).sort((x, y) => x - y).indexOf(lim + 15), no: 'Al percorso più lungo va aggiunto il margine: ' + lim + ' + 15 = ' + T + '.' } });
      P({}, 4, 'Il periodo e lo spreco', 'Il periodo minimo è ' + lim + ' + 15 = ' + T + ' ps. Ogni istruzione occupa un ciclo di questa durata. ' + (A === L ? 'In questo caso i due percorsi hanno la stessa durata, e nessuna delle due istruzioni attende.' : 'L’istruzione più rapida avrebbe finito in ' + Math.min(A, L) + ' ps, e resta inattiva per ' + (lim - Math.min(A, L)) + ' ps a ogni ciclo.') + ' Per accorciare il periodo bisogna accelerare un blocco del percorso limitante. Accelerare gli altri lascerebbe tutto com’è.',
        { calc: 'T = ' + lim + ' + 15 = ' + T + ' ps', esito: [T + ' ps', 'si'] });
      return { passi, esito: T };
    }
  },
  bilancio: {
    regola: [
      'Il periodo di SEQ deve bastare all’istruzione con il percorso più lento, più il margine chiesto dai registri.',
      'Tutte le altre istruzioni occupano comunque un ciclo intero, e il tempo che avanza a ciascuna va perduto.'
    ],
    errori: [
      ['Dimensionare il periodo sull’istruzione più frequente.', 'Conta la più lenta, anche se è rara. Un solo carico eseguito con un periodo troppo breve lascerebbe nel registro un valore provvisorio.'],
      ['Sommare i percorsi di istruzioni diverse.', 'In ogni ciclo si esegue una sola istruzione. I percorsi sono alternative, e conta il più lungo.'],
      ['Dare per scontato che il limite sia il carico.', 'Dipende dai ritardi. Con una memoria rapida e un selettore lento, il limite passa all’operazione aritmetica.']
    ],
    saFare: ['Sommo i ritardi dei blocchi attraversati da un’istruzione.', 'Individuo l’istruzione limitante.', 'Calcolo il periodo minimo e il tempo perduto dalle altre istruzioni.'],
    esercizi: [
      { d: 'In un processore a ciclo singolo il prelievo richiede 100 ps, la lettura dei registri 40 ps, l’ALU 60 ps e la memoria dei dati 120 ps. Un carico attraversa i quattro blocchi, e i registri chiedono un margine di 20 ps. Qual è il periodo minimo, in picosecondi?', segnaposto: 'Un numero di picosecondi', giuste: ['340', '340ps'],
        ok: 'Il percorso del carico dura 100 + 40 + 60 + 120 = 320 ps, e con il margine si arriva a 340 ps.',
        diagnosi: [
          { se: ['320', '320ps'], msg: 'Questo è il percorso del carico. Manca il margine di 20 ps chiesto dai registri.' },
          { se: ['220', '220ps'], msg: 'Manca la memoria dei dati, che il carico deve interrogare dopo l’ALU.' },
          { se: ['200', '200ps'], msg: 'Questo è il tratto fino all’ALU. Vanno aggiunti la memoria dei dati e il margine.' }
        ],
        altro: 'Il numero è diverso. Somma i quattro ritardi del carico e aggiungi il margine.',
        indizi: ['Il carico attraversa prelievo, registri, ALU e memoria.', '100 + 40 + 60 + 120 = 320.', '320 + 20.'],
        svolgimento: ['Percorso del carico: 100 + 40 + 60 + 120 = 320 ps.', 'Margine dei registri: 20 ps.', 'Periodo minimo: 340 ps.'] },
      { d: 'Nello stesso processore il periodo è di 340 ps. Un’operazione aritmetica avrebbe bisogno di 220 ps in tutto, margine compreso. Per quanti picosecondi resta inattiva a ogni ciclo?', segnaposto: 'Un numero di picosecondi', giuste: ['120', '120ps'],
        ok: 'Il ciclo dura 340 ps e all’operazione ne bastano 220: ne avanzano 120.',
        diagnosi: [
          { se: ['340', '340ps'], msg: 'Questa è la durata del ciclo. La domanda chiede quanta parte del ciclo resta inutilizzata.' },
          { se: ['220', '220ps'], msg: 'Questo è il tempo che l’operazione usa. Il resto del ciclo è il tempo perduto.' },
          { se: ['560', '560ps'], msg: 'I due tempi vanno sottratti: periodo meno tempo usato.' }
        ],
        altro: 'Il numero è diverso. Sottrai dal periodo il tempo che l’operazione usa.',
        indizi: ['Il ciclo dura 340 ps per tutte le istruzioni.', 'All’operazione aritmetica bastano 220 ps.', '340 − 220.'],
        svolgimento: ['Periodo: 340 ps.', 'Tempo usato: 220 ps.', 'Tempo perduto: 340 − 220 = 120 ps.'] }
    ],
    sfida: ['cslez3_4_04_random_assembly', 'Cammino critico e periodo di clock']
  }
});
