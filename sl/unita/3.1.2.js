'use strict';
SL.registra('3.1.2', {
  titolo: 'Selezionare un ingresso con un multiplexer',
  obiettivo: 'Obiettivo: indicare quale ingresso un multiplexer trasferisce in uscita per ogni valore del comando, e descrivere la costruzione di un multiplexer a quattro ingressi mediante tre selettori a due ingressi.',
  concetti: [['mux', 'La scelta fra dati già disponibili'], ['bit', 'Due bit di comando'], ['bus', 'Parole trasferite per intero']],
  filigrana: ['mux', 'bus', 'bit'],
  richiami: {
    carte: [
      { sim: 'bit', da: 'Dall’unità 1.2.2', t: 'Pesi e combinazioni', d: 'Con n bit si formano 2ⁿ combinazioni. In un numero di due bit la cifra di sinistra pesa 2 e quella di destra pesa 1.' },
      { sim: 'byte', da: 'Dall’unità 1.5.3', t: 'La AND con una maschera', d: 'Dove la maschera vale 1 la AND conserva l’altro ingresso; dove vale 0 dà sempre 0.' },
      { sim: 'gate', da: 'Dall’unità 3.1.1', t: 'Circuiti combinatori', d: 'Le uscite dipendono soltanto dagli ingressi presenti in quel momento.' }
    ],
    domanda: { d: 'Prima di proseguire: quanti bit occorrono per distinguere quattro ingressi?', o: [
      { t: '2', ok: true, fb: 'Due bit formano quattro combinazioni: 00, 01, 10 e 11.' },
      { t: '4', fb: 'Quattro bit distinguerebbero sedici ingressi. Per quattro ne sono sufficienti due.' },
      { t: '1', fb: 'Un solo bit distingue due ingressi.' }
    ] }
  },
  idea: {
    titolo: 'Una selezione comandata',
    termini: ['multiplexer', 'segnale di selezione', 'bus'],
    testo: [
      'Un processore compie selezioni a ogni istruzione. Il secondo operando di una somma può provenire da un registro oppure dall’istruzione stessa; l’indirizzo della prossima istruzione può essere quello successivo oppure la destinazione di un salto. In entrambi i casi i dati candidati sono già disponibili sui fili, e occorre un circuito che ne trasferisca uno solo in uscita.',
      'Tale circuito è il [[multiplexer]], abbreviato MUX. Esso possiede alcuni ingressi per i dati, una sola uscita e un ingresso di comando, il [[segnale di selezione]]. Il multiplexer si limita a copiare sull’uscita l’ingresso indicato dal comando, senza eseguire alcun calcolo.',
      'La versione minima ha due ingressi, I0 e I1, e un comando S di un bit. Con S = 0 l’uscita riproduce I0, con S = 1 riproduce I1. Sono sufficienti quattro porte: una AND trasferisce I0 quando S vale 0, un’altra trasferisce I1 quando S vale 1, e una OR riunisce le due. In formula: (NOT S AND I0) OR (S AND I1).',
      { fig: 'scena', w: 720, h: 150, titolo: 'Un multiplexer a due ingressi, con S = 0', nota: 'La AND superiore trasferisce I0. Quella inferiore dà 0, e I1 è ignorato.', els: [
        SL.el.cella('i0', 20, 22, 70, 46, '1', 'on', { piccola: true, so: 'I0' }), SL.el.cella('i1', 20, 98, 70, 46, '1', 'zero', { piccola: true, so: 'I1' }),
        SL.el.linea('a', 90, 45, 220, 45, 'on'), SL.el.linea('b', 90, 121, 220, 121, ''),
        SL.el.box('g0', 220, 12, 190, 60, 'NOT S AND I0', '1', 'on', { cls: 'stretta' }), SL.el.box('g1', 220, 88, 190, 60, 'S AND I1', '0', '', { cls: 'stretta' }),
        SL.el.linea('c', 410, 42, 490, 70, 'on'), SL.el.linea('d', 410, 118, 490, 90, ''),
        SL.el.box('or', 490, 46, 100, 66, 'OR', '1', 'on', { cls: 'stretta' }), SL.el.linea('e', 590, 79, 630, 79, 'on'),
        SL.el.cella('u', 630, 56, 70, 46, '1', 'att', { piccola: true, so: 'uscita' })
      ] },
      'La scelta fra quattro ingressi richiede due bit di comando, S1 e S0, poiché due bit formano quattro combinazioni. Il numero espresso dai due bit, 2 × S1 + S0, è la posizione dell’ingresso scelto. Il circuito si ottiene con tre multiplexer a due ingressi disposti su due livelli: S0 sceglie un elemento in ciascuna coppia, S1 sceglie la coppia.',
      'I dati di un processore sono parole di molti bit. Un fascio di fili che trasporta insieme i bit di una stessa parola prende il nome di [[bus]]. Per una parola di quattro bit si affiancano quattro multiplexer identici, uno per filo, tutti guidati dal medesimo comando. La parola scelta giunge così in uscita per intero.'
    ]
  },
  esperimento: {
    faremo: [
      'Quattro parole di quattro bit giungono agli ingressi I0, I1, I2 e I3 di un multiplexer costruito su due livelli. I controlli fissano il comando e i dati.',
      'Si osserva quali parole superano il primo livello e quale raggiunge l’uscita. Dopo il caso proposto, è istruttivo modificare soltanto il bit S0 e osservare l’effetto sul primo livello.'
    ],
    vedrai: [
      ['input', 'Gli ingressi', 'A sinistra: le quattro parole, da I0 a I3.'],
      ['mux', 'I due livelli', 'Al centro: due multiplexer comandati da S0, poi uno comandato da S1.'],
      ['output', 'L’uscita', 'A destra: la parola scelta, in decimale e in binario.']
    ]
  },
  lab: {
    titolo: 'Quattro parole, una sola uscita',
    scena: { w: 860, h: 352 },
    atti: ['Il comando', 'Il primo livello', 'Il secondo livello', 'La parola in uscita'],
    controlli: [
      { id: 's', tipo: 'scelta', eti: 'Comando, S1 S0', opzioni: [[0, '00'], [1, '01'], [2, '10'], [3, '11']], valore: 2 },
      { id: 'dati', tipo: 'scelta', eti: 'Parole in ingresso', opzioni: [['a', '3, 8, 5, 13'], ['b', '9, 9, 4, 0']], valore: 'a' }
    ],
    nota: 'I passi sono sempre cinque. Il comando determina quali fili sono attivi.',
    previsione: {
      domanda: (p) => 'Gli ingressi I0, I1, I2 e I3 portano ' + SL.unita312.DATI[p.dati].join(', ') + '. Il comando vale S1 S0 = ' + SL.unita312.B2(p.s) + '. Quale valore giunge in uscita?',
      opzioni: (p) => Array.from(new Set(SL.unita312.DATI[p.dati])).sort((a, b) => a - b)
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. In uscita giunge ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il comando ' + SL.unita312.B2(p.s) + ' esprime il numero ' + p.s + ', quindi il multiplexer copia l’ingresso I' + p.s + '.'),
    costruisci(p) {
      const el = SL.el, U = SL.unita312, I = U.DATI[p.dati], s = p.s, s1 = s >> 1, s0 = s & 1, passi = [];
      const B4 = (v) => v.toString(2).padStart(4, '0'), YI = [34, 104, 174, 244];
      const st = { m: [null, null], u: null };
      const quadro = (o) => {
        const els = [el.nota('t1', 30, 0, 'INGRESSI', 'mono'), el.nota('t2', 300, 0, 'PRIMO LIVELLO · S0 = ' + s0, 'mono'), el.nota('t3', 548, 0, 'SECONDO LIVELLO · S1 = ' + s1, 'mono')];
        I.forEach((v, k) => {
          const scelto = st.m[k >> 1] != null && (k & 1) === s0;
          els.push(el.cella('i' + k, 40, YI[k] + 12, 70, 46, String(v), o.liv === 1 && o.coppia === (k >> 1) && scelto ? 'att' : scelto ? 'on' : '', { piccola: true, so: 'I' + k }),
            el.nota('b' + k, 122, YI[k] + 26, B4(v), 'mono minuta'),
            el.linea('w' + k, 170, YI[k] + 35, 300, YI[k >> 1 << 1] + 52 + (k & 1) * 36, scelto ? 'on' : ''));
        });
        [0, 1].forEach((j) => {
          els.push(el.box('m' + j, 300, YI[j * 2] + 36, 170, 70, 'MUX · I' + (j * 2) + ' oppure I' + (j * 2 + 1), st.m[j] == null ? '·' : String(st.m[j]), o.liv === 1 && o.coppia === j ? 'att' : st.m[j] == null ? 'off' : 'on', { cls: 'stretta' }),
            el.linea('v' + j, 470, YI[j * 2] + 71, 560, 150 + j * 44, st.u != null && j === s1 ? 'on' : ''));
        });
        els.push(el.box('m2', 560, 128, 150, 90, 'MUX finale', st.u == null ? '·' : String(st.u), o.liv === 2 ? 'att' : st.u == null ? 'off' : 'on', { cls: 'stretta' }),
          el.linea('wu', 710, 173, 750, 173, st.u != null ? 'on' : ''),
          el.box('u', 750, 128, 96, 90, 'uscita', st.u == null ? '·' : String(st.u), o.fine ? 'att' : st.u == null ? 'off' : 'on', { cls: 'stretta' }),
          el.nota('ub', 760, 228, st.u == null ? '' : B4(st.u), 'mono minuta', o.fine ? 'att' : ''));
        return els;
      };
      const hud = () => [['Comando', 'S1 S0 = ' + U.B2(s), 'a'], ['Primo livello', (st.m[0] == null ? '·' : st.m[0]) + ' e ' + (st.m[1] == null ? '·' : st.m[1])], ['Uscita', st.u == null ? '·' : String(st.u), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Due bit di comando', 'Agli ingressi giungono le parole ' + I.join(', ') + ', ciascuna su quattro fili. Il comando vale ' + U.B2(s) + ': il bit di sinistra è S1 = ' + s1 + ', quello di destra è S0 = ' + s0 + '. I due bit esprimono il numero 2 × ' + s1 + ' + ' + s0 + ' = ' + s + '.',
        { calc: '2 × ' + s1 + ' + ' + s0 + ' = ' + s, chiedi: { d: 'Il primo livello è comandato da S0, che vale ' + s0 + '. Nella coppia I0, I1 quale ingresso passa?', o: ['I0', 'I1'], g: s0, no: 'Con S0 = 0 passa il primo membro della coppia, con S0 = 1 il secondo.' } });
      st.m[0] = I[s0];
      P({ liv: 1, coppia: 0 }, 1, 'La prima coppia', 'Il primo multiplexer riceve I0 = ' + I[0] + ' e I1 = ' + I[1] + '. Con S0 = ' + s0 + ' lascia passare I' + s0 + ', cioè ' + I[s0] + '.' + (I[0] === I[1] ? ' I due ingressi portano il medesimo valore, e l’uscita sarebbe identica con l’altro comando.' : ''), { calc: 'S0 = ' + s0 + ' → I' + s0 + ' = ' + I[s0] });
      st.m[1] = I[2 + s0];
      P({ liv: 1, coppia: 1 }, 1, 'La seconda coppia', 'Il secondo multiplexer riceve I2 = ' + I[2] + ' e I3 = ' + I[3] + '. Esso è comandato dal medesimo bit S0, quindi compie la medesima scelta: passa I' + (2 + s0) + ', cioè ' + I[2 + s0] + '. Delle quattro parole ne restano due.',
        { calc: 'S0 = ' + s0 + ' → I' + (2 + s0) + ' = ' + I[2 + s0], chiedi: { d: 'Al secondo livello giungono ' + st.m[0] + ' e ' + st.m[1] + ', e il comando è S1, che vale ' + s1 + '. Quale delle due parole passa?', o: [String(st.m[0]), String(st.m[1])], g: s1, no: 'Con S1 = 0 passa la parola della prima coppia, con S1 = 1 quella della seconda.' } });
      st.u = st.m[s1];
      P({ liv: 2 }, 2, 'La scelta fra le due coppie', 'Il multiplexer finale riceve ' + st.m[0] + ' dalla prima coppia e ' + st.m[1] + ' dalla seconda. Con S1 = ' + s1 + ' lascia passare ' + (s1 ? 'la seconda' : 'la prima') + ': in uscita giunge ' + st.u + '.', { calc: 'S1 = ' + s1 + ' → ' + st.u });
      P({ fine: true }, 3, 'Una parola intera', 'L’uscita vale ' + st.u + ', in binario ' + B4(st.u) + ': è la parola dell’ingresso I' + s + ', come indicava il numero espresso dal comando. Ogni linea del disegno rappresenta un bus di quattro fili, e ogni multiplexer è in realtà una fila di quattro selettori da un bit, tutti con il medesimo comando. Le altre tre parole restano presenti sui rispettivi fili e sono ignorate.',
        { calc: 'I' + s + ' = ' + st.u + ' = ' + B4(st.u), esito: ['uscita = ' + st.u, 'si'] });
      return { passi, esito: st.u };
    }
  },
  bilancio: {
    regola: [
      'Un multiplexer copia in uscita l’ingresso indicato dal segnale di selezione. Con n bit di comando sceglie fra 2ⁿ ingressi, e il numero espresso dal comando è la posizione dell’ingresso scelto.',
      'Un multiplexer di grandi dimensioni si costruisce a livelli, con multiplexer a due ingressi. Per le parole di più bit si affianca un multiplexer per filo, tutti con il medesimo comando.'
    ],
    errori: [
      ['Leggere il comando in ordine inverso.', 'In S1 S0 = 10 il bit di sinistra pesa 2, quindi l’ingresso scelto è I2. A I1 corrisponde il comando 01.'],
      ['Ritenere che gli ingressi scartati siano disattivati.', 'Tutti gli ingressi restano presenti sui rispettivi fili. Il multiplexer ne copia uno e ignora gli altri.'],
      ['Assegnare un comando diverso a ogni bit della parola.', 'I bit di una parola devono seguire il medesimo percorso. Con comandi diversi in uscita giungerebbe una combinazione di bit appartenenti a parole diverse.']
    ],
    saFare: ['Indicare quale ingresso esce da un multiplexer, dato il comando.', 'Calcolare quanti bit di comando occorrono per un dato numero di ingressi.', 'Descrivere un multiplexer a quattro ingressi come tre selettori su due livelli.'],
    esercizi: [
      { d: 'Un multiplexer a quattro ingressi riceve I0 = 6, I1 = 1, I2 = 12 e I3 = 7. Il comando vale S1 S0 = 01. Quale valore si presenta in uscita?', segnaposto: 'Un numero', giuste: ['1', 'uno'],
        ok: 'Il comando 01 scrive il numero 1, e il multiplexer copia I1.',
        diagnosi: [
          { se: ['12', 'dodici'], msg: 'Il comando è stato letto in ordine inverso. In S1 S0 = 01 il bit di sinistra, che pesa 2, vale 0.' },
          { se: ['6', 'sei'], msg: 'I0 corrisponde al comando 00. In questo caso il bit S0 vale 1.' },
          { se: ['7', 'sette'], msg: 'I3 corrisponde al comando 11. In questo caso il bit S1 vale 0.' }
        ],
        altro: 'Il valore è diverso. Si calcoli 2 × S1 + S0 e si prenda l’ingresso con quel numero.',
        indizi: ['S1 = 0 e S0 = 1.', '2 × 0 + 1 = 1.', 'L’uscita riproduce l’ingresso I1.'],
        svolgimento: ['Comando: S1 = 0, S0 = 1.', 'Posizione: 2 × 0 + 1 = 1.', 'Uscita: I1 = 1.'] },
      { d: 'Un multiplexer deve scegliere fra 16 ingressi. Quanti bit di comando occorrono?', segnaposto: 'Un numero', giuste: ['4', 'quattro'],
        ok: 'Quattro bit formano 2⁴ = 16 combinazioni, una per ingresso.',
        diagnosi: [
          { se: ['16', 'sedici'], msg: 'Sedici è il numero degli ingressi. Ogni bit di comando in più raddoppia gli ingressi distinguibili.' },
          { se: ['8', 'otto'], msg: 'Con otto bit di comando gli ingressi distinguibili sarebbero 256.' },
          { se: ['3', 'tre'], msg: 'Tre bit formano otto combinazioni, e sono sufficienti per otto ingressi.' }
        ],
        altro: 'Il numero è diverso. Si cerchi l’esponente n per cui 2ⁿ vale 16.',
        indizi: ['Con n bit le combinazioni sono 2ⁿ.', '2, 4, 8, 16.', 'Sedici è la quarta potenza di 2.'],
        svolgimento: ['Combinazioni necessarie: 16.', '2⁴ = 16.', 'Bit di comando: 4.'] }
    ],
    sfida: ['cslez3_1_02_random_assembly', 'Selezione dei dati con multiplexer']
  }
});
SL.unita312 = { DATI: { a: [3, 8, 5, 13], b: [9, 9, 4, 0] }, B2: (s) => s.toString(2).padStart(2, '0') };
