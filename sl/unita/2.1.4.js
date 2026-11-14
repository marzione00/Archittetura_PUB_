'use strict';
SL.registra('2.1.4', {
  titolo: 'Stato architetturale, implementazione e prestazioni',
  obiettivo: 'Obiettivo: distinguere il risultato calcolato da un programma dal tempo impiegato dal processore, e contare i cicli di una breve sequenza su implementazioni diverse.',
  concetti: [['register', 'Stato finale'], ['clock', 'Cicli di clock'], ['alu', 'Implementazione']],
  filigrana: ['clock', 'alu', 'pipeline'],
  richiami: {
    carte: [
      { sim: 'register', da: 'Dall’unità 2.1.1', t: 'Lo stato architetturale', d: 'Registri, memoria, RIP e flag: tutto ciò che un programma può leggere o modificare.' },
      { sim: 'tabella', da: 'Dall’unità 2.1.3', t: 'La traccia', d: 'Il contenuto dei registri dopo ogni istruzione, con le istruzioni eseguite una alla volta nell’ordine in cui sono scritte.' },
      { sim: 'clock', da: 'Dall’unità 1.5.4', t: 'I circuiti hanno un ritardo', d: 'Un circuito risponde dopo un certo tempo. La sua uscita è affidabile soltanto quando il percorso più lento si è assestato.' }
    ],
    domanda: { d: 'Prima di proseguire: R8 contiene 4 e R9 contiene 9. Un programma aumenta di uno ciascuno dei due registri e poi somma R9 a R8. Quanto vale R8 al termine?', o: [
      { t: '15', ok: true, fb: 'Dopo i due aumenti i registri valgono 5 e 10. La somma, 15, viene scritta in R8.' },
      { t: '13', fb: 'Questa è la somma dei valori di partenza. Il programma aumenta prima entrambi i registri.' },
      { t: '14', fb: 'Gli aumenti sono due, uno per registro: 5 + 10.' }
    ] }
  },
  idea: {
    titolo: 'Il medesimo risultato in tempi diversi',
    termini: ['implementazione', 'ciclo di clock', 'cpi', 'alu', 'inc'],
    testo: [
      'Lo stato architetturale descrive ciò che un programma può osservare, e prescinde dalla struttura interna del processore. Due processori molto diversi, uno di vent’anni fa e uno recente, possono eseguire il medesimo programma e lasciare nei registri i medesimi numeri. La scelta dei circuiti che realizzano le istruzioni prende il nome di [[implementazione]].',
      'Fra un’implementazione e l’altra varia il tempo, la cui trattazione richiede un’unità di misura. I circuiti di un processore operano al ritmo di un segnale periodico, il clock. L’intervallo fra due impulsi consecutivi è un [[ciclo di clock]], e la sua durata prende il nome di periodo. Con un periodo di mezzo nanosecondo il processore compie due miliardi di cicli al secondo.',
      'Il tempo di un programma è il numero di cicli richiesti, moltiplicato per il periodo. Il rapporto fra i cicli e le istruzioni eseguite si abbrevia [[cpi|CPI]], cicli per istruzione. Un programma di tre istruzioni che richiede tre cicli ha un CPI uguale a 1.',
      'Il circuito che esegue le somme e le operazioni logiche è l’unità aritmetico-logica, in sigla [[alu|ALU]]. Un’implementazione semplice ne comprende una sola e la impiega per un’istruzione alla volta. Un’implementazione più complessa ne comprende diverse e, quando è possibile, esegue più istruzioni nel medesimo ciclo.',
      'La condizione «quando è possibile» è l’elemento determinante. Due istruzioni possono essere eseguite contemporaneamente soltanto se nessuna delle due richiede il risultato dell’altra. Si consideri l’istruzione [[inc|INC]], che aumenta di uno il registro indicato. Le istruzioni `inc r8` e `inc r9` operano su due registri diversi e sono indipendenti. L’istruzione `add r8, r9` che le segue richiede entrambi i risultati, e deve attenderli.',
      { fig: 'scena', w: 700, h: 150, titolo: 'Le dipendenze fra le istruzioni', nota: 'Le due INC sono indipendenti. La ADD legge i registri che le INC stanno scrivendo.', els: [
        SL.el.box('a', 10, 8, 200, 56, null, 'inc r8', 'on', { cls: 'stretta' }), SL.el.box('b', 10, 82, 200, 56, null, 'inc r9', 'on', { cls: 'stretta' }),
        SL.el.linea('l1', 210, 36, 430, 64, 'att'), SL.el.linea('l2', 210, 110, 430, 82, 'att'),
        SL.el.nota('n1', 250, 16, 'il nuovo R8', 'mono', 'att'), SL.el.nota('n2', 250, 112, 'il nuovo R9', 'mono', 'att'),
        SL.el.box('c', 430, 44, 250, 56, null, 'add r8, r9', 'att', { cls: 'stretta' })] },
      'Per questa ragione il raddoppio dei circuiti lascia il tempo ben al di sopra della metà. Il guadagno si ottiene soltanto dove il programma offre operazioni indipendenti, e si arresta a ogni risultato che deve essere atteso.',
      'Lo stato finale resta invece sempre il medesimo. Un’implementazione corretta, veloce o lenta, deve lasciare nei registri i valori che si otterrebbero eseguendo le istruzioni una alla volta, nell’ordine in cui sono scritte. La traccia dell’unità precedente descrive pertanto il risultato di ogni processore x86-64, e lascia aperta soltanto la questione del tempo.'
    ]
  },
  esperimento: {
    faremo: [
      'Il medesimo programma di tre istruzioni è eseguito da processori con una, due o tre ALU. I controlli fissano il numero di ALU, il valore di partenza e il periodo di clock.',
      'L’esperimento procede un ciclo alla volta: le istruzioni che si avviano, quelle in attesa, e il contenuto dei registri al termine del ciclo. Vanno osservati due elementi distinti, il valore finale di R8 e il numero di cicli. Dopo il caso proposto, sono istruttivi i casi con due e con tre ALU.'
    ],
    vedrai: [
      ['tabella', 'Il programma', 'A sinistra: le tre istruzioni e, sotto, i registri R8 e R9.'],
      ['alu', 'Le corsie', 'Al centro: una riga per ALU e una colonna per ciclo. Ogni casella indica l’istruzione eseguita.'],
      ['clock', 'Il conto', 'In basso: cicli, tempo e CPI. Il calcolo eseguito in ogni ciclo compare sotto la scena.']
    ]
  },
  lab: {
    titolo: 'Tre istruzioni su una, due o tre ALU',
    scena: { w: 860, h: 330 },
    atti: ['Il programma', 'Le dipendenze', 'I cicli', 'Il conto'],
    nota: 'Il numero di passi dipende dal numero di cicli necessari.',
    controlli: [
      { id: 'alu', tipo: 'scelta', eti: 'ALU disponibili', opzioni: [[1, 'una'], [2, 'due'], [3, 'tre']], valore: 1 },
      { id: 'x', tipo: 'num', eti: 'Valore iniziale di R8', min: 0, max: 20, salti: [1, 5], valore: 4 },
      { id: 'per', tipo: 'scelta', eti: 'Periodo di clock', opzioni: [[0.5, '0,5 ns'], [1, '1 ns']], valore: 0.5 }
    ],
    previsione: {
      domanda: (p) => 'Il programma è `inc r8`, `inc r9`, `add r8, r9`, e ogni operazione occupa una ALU per un ciclo. Con ' + ({ 1: 'una ALU', 2: 'due ALU', 3: 'tre ALU' })[p.alu] + ', quanti cicli occorrono?',
      opzioni: () => [1, 2, 3]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + (pred === 1 ? ' ciclo' : ' cicli') + '. Ne occorrono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.alu === 1 ? 'Con una sola ALU le tre operazioni sono eseguite in successione, una per ciclo.' : 'Le due INC sono indipendenti e si avviano insieme. La ADD richiede i loro risultati e deve attendere il ciclo successivo' + (p.alu === 3 ? ', e la terza ALU resta quindi inattiva.' : '.')),
    costruisci(p) {
      const el = SL.el, passi = [];
      const n = p.alu, x = p.x, y = x + 5, fin = x + 1 + y + 1, V = (v) => String(v).replace('.', ',');
      // Il piano: per ogni ciclo, le istruzioni eseguite (indice 0, 1, 2), una per ALU.
      const piano = n === 1 ? [[0], [1], [2]] : [[0, 1], [2]], cicli = piano.length, tempo = cicli * p.per, cpi = cicli / 3;
      const IST = ['inc r8', 'inc r9', 'add r8, r9'];
      const reg = { r8: x, r9: y };
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('t1', 40, 0, 'IL PROGRAMMA', 'mono')];
        IST.forEach((t, k) => els.push(el.box('i' + k, 40, 26 + k * 54, 200, 46, null, t, (o.ora || []).includes(k) ? 'att' : (o.fatte || []).includes(k) ? 'on' : '', { cls: 'stretta' })));
        els.push(el.box('r8', 40, 200, 95, 66, 'R8', String(reg.r8), o.scritti && o.scritti.includes('r8') ? 'att' : ''));
        els.push(el.box('r9', 145, 200, 95, 66, 'R9', String(reg.r9), o.scritti && o.scritti.includes('r9') ? 'att' : ''));
        els.push(el.nota('t2', 300, 0, 'LE ALU, UN CICLO PER COLONNA', 'mono'));
        for (let c = 0; c < 3; c++) els.push(el.nota('c' + c, 392 + c * 150, 26, 'ciclo ' + (c + 1), 'mono', c < cicli && o.ciclo != null && c === o.ciclo ? 'att' : c < (o.ciclo == null ? -1 : o.ciclo) ? 'on' : ''));
        for (let a = 0; a < 3; a++) {
          els.push(el.nota('a' + a, 300, 66 + a * 58, 'ALU ' + (a + 1), 'mono', a < n ? '' : 'err'));
          for (let c = 0; c < 3; c++) {
            const usata = a < n && c < cicli && piano[c][a] != null, vista = o.ciclo != null && c <= o.ciclo;
            els.push(el.cella('g' + a + c, 370 + c * 150, 54 + a * 58, 140, 48, a >= n ? 'assente' : usata && vista ? IST[piano[c][a]] : vista && c < cicli ? 'ferma' : '·', a >= n ? 'off' : usata && vista ? (c === o.ciclo ? 'att' : 'on') : 'off', { cls: 'minuta' }));
          }
        }
        els.push(el.box('k1', 300, 244, 165, 70, 'cicli', o.conto ? String(cicli) : '·', o.conto ? 'on' : '', { sim: 'clock', riga: true }));
        els.push(el.box('k2', 477, 244, 175, 70, 'tempo', o.conto ? V(tempo) + ' ns' : '·', o.conto ? 'on' : '', { sim: 'lente', riga: true }));
        els.push(el.box('k3', 664, 244, 166, 70, 'CPI', o.conto ? V(Math.round(cpi * 100) / 100) : '·', o.conto ? 'on' : '', { sim: 'bilancio', riga: true }));
        return els;
      };
      let fattiCicli = 0;
      const hud = () => [['Cicli trascorsi', fattiCicli, 'a'], ['R8', reg.r8], ['R9', reg.r9, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Il programma e i registri', 'R8 contiene ' + x + ' e R9 contiene ' + y + '. Il programma aumenta di uno entrambi i registri e poi somma R9 a R8. Il processore dispone di ' + (n === 1 ? 'una ALU' : n === 2 ? 'due ALU' : 'tre ALU') + ', e ogni operazione ne occupa una per un ciclo.');
      const opz = ['1', '2', '3'];
      P({ ora: [0, 1, 2] }, 1, 'Le dipendenze fra le istruzioni', 'La prima INC legge e scrive R8, la seconda legge e scrive R9: nessuna delle due impiega il risultato dell’altra. La ADD legge R8 e R9, cioè i due registri che le INC stanno per scrivere, e può avviarsi soltanto dopo.',
        { calc: 'add r8, r9 attende inc r8 e inc r9', chiedi: { d: 'Il processore ha ' + (n === 1 ? 'una ALU' : n === 2 ? 'due ALU' : 'tre ALU') + '. Quante istruzioni può eseguire nel primo ciclo?', o: opz, g: opz.indexOf(String(Math.min(n, 2))), no: n === 1 ? 'Con una sola ALU si esegue un’operazione per ciclo.' : 'Le istruzioni indipendenti sono due. La ADD deve attendere i loro risultati' + (n === 3 ? ', e la terza ALU resta quindi inattiva.' : '.') } });
      const fatte = [];
      piano.forEach((gruppo, c) => {
        const prima = { r8: reg.r8, r9: reg.r9 }, scritti = [], lavori = [];
        gruppo.forEach((k) => {
          if (k === 0) { reg.r8 = prima.r8 + 1; scritti.push('r8'); lavori.push(prima.r8 + ' + 1 = ' + reg.r8); }
          if (k === 1) { reg.r9 = prima.r9 + 1; scritti.push('r9'); lavori.push(prima.r9 + ' + 1 = ' + reg.r9); }
          if (k === 2) { reg.r8 = prima.r8 + prima.r9; scritti.push('r8'); lavori.push(prima.r8 + ' + ' + prima.r9 + ' = ' + reg.r8); }
        });
        fattiCicli = c + 1;
        const testo = gruppo.length === 2 ? 'Le due INC occupano una ALU ciascuna e operano nel medesimo ciclo. Al termine del ciclo R8 vale ' + reg.r8 + ' e R9 vale ' + reg.r9 + '.' + (n === 3 ? ' La terza ALU resta inattiva, poiché la ADD richiede questi due risultati.' : '')
          : gruppo[0] === 2 ? 'I due risultati sono disponibili, e la ADD può avviarsi. Legge R8 = ' + prima.r8 + ' e R9 = ' + prima.r9 + ', e al termine del ciclo scrive ' + reg.r8 + ' in R8.' + (n >= 2 ? ' Le altre ALU restano inattive: il programma è privo di altre operazioni da eseguire.' : '')
          : 'L’unica ALU esegue `' + IST[gruppo[0]] + '`, e al termine del ciclo ' + (gruppo[0] === 0 ? 'R8 vale ' + reg.r8 : 'R9 vale ' + reg.r9) + '. Le istruzioni successive attendono il proprio turno.';
        P({ ora: gruppo, fatte: fatte.slice(), ciclo: c, scritti, lavoro: lavori.join(' · ') }, 2, 'Ciclo ' + (c + 1), testo, { calc: lavori.join('   ') });
        gruppo.forEach((k) => fatte.push(k));
      });
      P({ fatte, ciclo: cicli, conto: true }, 3, 'Il calcolo del tempo', 'Il programma ha richiesto ' + cicli + ' cicli. Con un periodo di ' + V(p.per) + ' ns il tempo è ' + cicli + ' × ' + V(p.per) + ' = ' + V(tempo) + ' ns. Le istruzioni sono tre, e il CPI vale quindi ' + cicli + ' diviso 3, cioè ' + V(Math.round(cpi * 100) / 100) + '.', { calc: cicli + ' × ' + V(p.per) + ' ns = ' + V(tempo) + ' ns' });
      P({ fatte, ciclo: cicli, conto: true }, 3, 'Lo stato finale', 'R8 vale ' + fin + ' e R9 vale ' + reg.r9 + ', esattamente i valori forniti dalla traccia delle tre istruzioni eseguite una alla volta. ' + (n === 1 ? 'Con più ALU il tempo diminuirebbe, e i valori resterebbero i medesimi.' : n === 2 ? 'Rispetto a una sola ALU si risparmia un ciclo su tre, e i valori sono i medesimi.' : 'La terza ALU è rimasta inattiva in entrambi i cicli: il programma non offriva mai tre operazioni indipendenti.'), { calc: 'R8 = ' + (x + 1) + ' + ' + (y + 1) + ' = ' + fin });
      return { passi, esito: cicli };
    }
  },
  bilancio: {
    regola: [
      'Lo stato finale di un programma dipende dalle istruzioni e dai dati. Il tempo dipende dall’implementazione: tempo = cicli × periodo, e il CPI è il rapporto fra cicli e istruzioni.',
      'Più ALU consentono di eseguire nel medesimo ciclo le istruzioni indipendenti. Un’istruzione che impiega il risultato di un’altra deve attenderla, qualunque sia il numero di circuiti disponibili.'
    ],
    errori: [
      ['Ritenere che un processore più veloce fornisca risultati diversi.', 'L’implementazione modifica il tempo. Lo stato finale è fissato dall’architettura ed è il medesimo su ogni processore corretto.'],
      ['Dividere il tempo per il numero di ALU.', 'Il guadagno dipende dalle istruzioni indipendenti offerte dal programma. In questo caso due ALU riducono i cicli da tre a due, e la terza non aggiunge nulla.'],
      ['Confondere cicli e istruzioni.', 'Un ciclo può essere impiegato da una sola istruzione oppure da diverse. Il loro rapporto è il CPI.']
    ],
    saFare: ['Distinguere lo stato architetturale dall’implementazione.', 'Calcolare il tempo di un programma da cicli e periodo, e ricavarne il CPI.', 'Riconoscere le istruzioni indipendenti di una breve sequenza.'],
    esercizi: [
      { d: 'Un programma esegue 12 istruzioni in 18 cicli, con un periodo di clock di 0,5 ns. Quanto dura, in nanosecondi?', segnaposto: 'Un tempo in nanosecondi', giuste: ['9', '9ns', '9.0', '9.0ns'],
        ok: 'Il tempo è il prodotto dei cicli per il periodo: 18 × 0,5 = 9 ns.',
        diagnosi: [
          { se: ['6', '6ns'], msg: 'Le istruzioni sono state moltiplicate per il periodo. Il tempo dipende dai cicli, che sono 18.' },
          { se: ['36', '36ns'], msg: 'I cicli sono stati divisi per il periodo. I due numeri vanno moltiplicati.' },
          { se: ['1.5'], msg: 'Questo è il CPI, 18 diviso 12. È richiesto il tempo.' }
        ],
        altro: 'Il valore è diverso. Si moltiplichi il numero di cicli per la durata di ciascuno.',
        indizi: ['Il tempo di un programma è cicli × periodo.', 'I cicli sono 18 e il periodo è 0,5 ns.', 'Il numero di istruzioni occorre per il CPI, e in questo caso è estraneo al calcolo.'],
        svolgimento: ['Cicli: 18.', 'Periodo: 0,5 ns.', 'Tempo: 18 × 0,5 = 9 ns.', 'Il CPI, per completezza, vale 18 ÷ 12 = 1,5.'] },
      { d: 'Due processori x86-64 eseguono lo stesso programma sugli stessi dati. Il primo impiega 300 cicli, il secondo 200. Che cosa si può affermare sul contenuto finale dei registri?', guida: 'Si scelga la risposta.', o: [
        { t: 'È il medesimo sui due processori', ok: true, fb: 'Lo stato finale è fissato dall’architettura. L’implementazione determina soltanto il tempo.' },
        { t: 'Il secondo, più veloce, può avere arrotondato', fb: 'Un’implementazione corretta produce gli stessi valori di un’esecuzione condotta un’istruzione alla volta.' },
        { t: 'Dipende dal numero di ALU', fb: 'Il numero di ALU è una scelta di implementazione, e incide sui cicli. I valori restano quelli previsti dalla traccia.' }] }
    ],
    sfida: ['cslez2_1_02_random_assembly_02', 'Periodo di clock, cicli e CPI']
  }
});
