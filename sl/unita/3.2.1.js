'use strict';
SL.registra('3.2.1', {
  titolo: 'Dalla logica combinatoria allo stato memorizzato',
  obiettivo: 'Obiettivo: dire che cosa distingue un circuito con memoria da un circuito combinatorio, e saprai prevedere il contenuto di un registro dopo un fronte del clock, con il comando di caricamento a 0 e a 1.',
  concetti: [['register', 'Un circuito che ricorda'], ['clock', 'L’istante che decide'], ['riproduci', 'Conservare riscrivendo']],
  filigrana: ['register', 'clock', 'mux'],
  richiami: {
    carte: [
      { sim: 'gate', da: 'Dall’unità 3.1.1', t: 'Circuiti senza memoria', d: 'In un circuito combinatorio le uscite seguono gli ingressi. Cambiati gli ingressi, del valore precedente non resta nulla.' },
      { sim: 'mux', da: 'Dall’unità 3.1.2', t: 'Il multiplexer', d: 'Copia sull’uscita l’ingresso indicato dal comando. Con due ingressi basta un bit di comando.' },
      { sim: 'clock', da: 'Dall’unità 2.1.4', t: 'Il ciclo di clock', d: 'Un segnale periodico scandisce il lavoro del processore. Fra un battito e il successivo passa un periodo.' }
    ],
    domanda: { d: 'Prima di proseguire: un multiplexer a due ingressi riceve I0 = 3 e I1 = 7, con il comando S = 0. Quale valore esce?', o: [
      { t: '3', ok: true, fb: 'Con S = 0 il multiplexer copia l’ingresso I0.' },
      { t: '7', fb: 'L’ingresso I1 passa quando S vale 1. Qui S vale 0.' },
      { t: '10', fb: 'Il multiplexer copia uno dei due ingressi, senza sommarli.' }
    ] }
  },
  idea: {
    titolo: 'Ricordare significa riscrivere',
    termini: ['circuito sequenziale', 'fronte di salita', 'retroazione'],
    testo: [
      'Un circuito combinatorio dimentica: appena gli ingressi cambiano, l’uscita li segue. Un processore ha bisogno anche del contrario. Il valore di un registro deve restare lo stesso per milioni di cicli, finché un’istruzione decide di cambiarlo. Serve un circuito la cui uscita dipenda anche da ciò che è accaduto prima. Un circuito di questo tipo si chiama [[circuito sequenziale]], e l’informazione che conserva è il suo stato.',
      'Il mattone di partenza è il registro: una fila di celle, una per bit, con un ingresso D e un’uscita Q. Il registro obbedisce al clock, il segnale periodico dell’unità 2.1.4, che alterna un livello basso e un livello alto. Per quasi tutto il ciclo il registro ignora il proprio ingresso e tiene ferma l’uscita. Soltanto nell’istante in cui il clock sale dal livello basso a quello alto copia in Q il valore presente su D. Quell’istante è il [[fronte di salita]]. L’unità 3.2.2 mostrerà che cosa c’è dentro una cella.',
      'Un registro fatto così scriverebbe un valore nuovo a ogni fronte. Per fargli conservare una parola gli si mette davanti un multiplexer, comandato da un segnale di controllo che chiameremo Carica. Con Carica = 1 il multiplexer presenta al registro il dato esterno. Con Carica = 0 gli presenta la sua stessa uscita Q, e al fronte il registro riscrive ciò che già contiene. Un collegamento che riporta un’uscita verso un ingresso si chiama [[retroazione]].',
      { fig: 'scena', w: 720, h: 170, titolo: 'Un registro con il comando Carica', nota: 'Con Carica = 0 il multiplexer sceglie la retroazione, e il registro riscrive se stesso.', els: [
        SL.el.box('d', 10, 14, 110, 56, 'dato D', '0111', 'on', { cls: 'stretta' }), SL.el.linea('l1', 120, 42, 230, 60, 'on'),
        SL.el.box('m', 230, 40, 150, 76, 'MUX', 'Carica', 'att', { cls: 'stretta' }), SL.el.linea('l2', 380, 78, 470, 78, 'on'),
        SL.el.box('r', 470, 40, 150, 76, 'registro', 'Q = 0011', 'on', { cls: 'stretta' }),
        SL.el.linea('f1', 620, 78, 680, 78, 'att'), SL.el.linea('f2', 680, 78, 680, 150, 'att'), SL.el.linea('f3', 680, 150, 180, 150, 'att'), SL.el.linea('f4', 180, 150, 180, 100, 'att'), SL.el.linea('f5', 180, 100, 230, 100, 'att'),
        SL.el.nota('n1', 400, 128, 'retroazione', 'mono minuta', 'att'), SL.el.nota('n2', 520, 12, 'clock', 'mono minuta'), SL.el.linea('c', 545, 30, 545, 40, '')
      ] },
      'Due registri collegati allo stesso filo dei dati possono quindi contenere parole diverse: ciascuno conserva l’ultima che ha caricato. Quando caricano entrambi nello stesso fronte, ricevono la stessa parola e la differenza va perduta.',
      'Tutto ciò che un processore ricorda sta in elementi di questo genere: i registri, i flag, l’indirizzo della prossima istruzione, la memoria. La logica combinatoria calcola i valori nuovi, e gli elementi di stato li catturano al fronte.'
    ]
  },
  esperimento: {
    faremo: [
      'Due registri di quattro bit, R1 e R2, sono collegati allo stesso bus D. All’inizio R1 contiene 3 e R2 contiene 12. Sceglierai il dato sul bus e il comando Carica di ciascun registro.',
      'Vedremo che cosa ogni multiplexer presenta al proprio registro, e che cosa accade al fronte di salita. Dopo il caso proposto, metti a 0 entrambi i comandi: poi mettili entrambi a 1.'
    ],
    vedrai: [
      ['bus', 'Il bus D', 'In alto: il dato esterno, offerto a entrambi i registri.'],
      ['mux', 'I multiplexer', 'Al centro: per ogni registro, la scelta fra il dato esterno e la retroazione.'],
      ['register', 'I registri', 'In basso: le parole conservate, con la linea di retroazione sulla destra.']
    ]
  },
  lab: {
    titolo: 'Due registri, un solo bus',
    scena: { w: 860, h: 310 },
    atti: ['Prima del fronte', 'I due multiplexer', 'Il fronte di salita', 'Dopo il fronte'],
    controlli: [
      { id: 'd', tipo: 'scelta', eti: 'Dato sul bus D', opzioni: [[7, '7'], [12, '12'], [0, '0']], valore: 7 },
      { id: 'e1', tipo: 'scelta', eti: 'Carica di R1', opzioni: [[0, '0'], [1, '1']], valore: 1 },
      { id: 'e2', tipo: 'scelta', eti: 'Carica di R2', opzioni: [[0, '0'], [1, '1']], valore: 0 }
    ],
    nota: 'I passi sono sempre cinque. All’inizio R1 contiene 3 e R2 contiene 12.',
    previsione: {
      domanda: (p) => 'R1 contiene 3 e R2 contiene 12. Sul bus D c’è ' + p.d + '. Il comando Carica vale ' + p.e1 + ' per R1 e ' + p.e2 + ' per R2. Che cosa contengono i registri dopo il fronte di salita?',
      opzioni: (p) => Array.from(new Set(['3,12', p.d + ',12', '3,' + p.d, p.d + ',' + p.d])).map((k) => [k, 'R1 = ' + k.split(',')[0] + ' e R2 = ' + k.split(',')[1]])
    },
    confronto: (pred, esito, p) => { const T = (k) => 'R1 = ' + k.split(',')[0] + ' e R2 = ' + k.split(',')[1]; return 'La previsione indicava ' + T(pred) + '. Dopo il fronte: ' + T(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Un registro con Carica = 1 copia il bus, uno con Carica = 0 riscrive il proprio contenuto. Qui Carica vale ' + p.e1 + ' per R1 e ' + p.e2 + ' per R2.'); },
    costruisci(p) {
      const el = SL.el, passi = [], B4 = (v) => v.toString(2).padStart(4, '0'), E = [p.e1, p.e2], X = [250, 560];
      const st = { q: [3, 12], in: [null, null], ck: 'basso' };
      const V = (v) => v + ' · ' + B4(v);
      const quadro = (o) => {
        const els = [el.box('d', 20, 14, 150, 64, 'bus D', V(p.d), 'on', { cls: 'stretta' }), el.linea('bus', 170, 46, 800, 46, 'on'),
          el.box('ck', 20, 216, 150, 74, 'clock', st.ck, o.fronte ? 'att' : '', { cls: 'stretta' })];
        [0, 1].forEach((k) => {
          const x = X[k], sel = st.in[k] != null, daBus = E[k] === 1;
          els.push(el.linea('b' + k, x + 50, 46, x + 50, 110, sel && daBus ? 'on' : ''),
            el.box('m' + k, x, 110, 190, 66, 'MUX · Carica = ' + E[k], sel ? String(st.in[k]) : '·', o.mux === k ? 'att' : sel ? 'on' : 'off', { cls: 'stretta' }),
            el.linea('i' + k, x + 95, 176, x + 95, 216, sel ? 'on' : ''),
            el.box('r' + k, x, 216, 190, 74, 'R' + (k + 1), V(st.q[k]), o.fronte || o.fine ? 'att' : 'on', { cls: 'stretta' }),
            el.linea('f1' + k, x + 190, 253, x + 222, 253, sel && !daBus ? 'att' : ''), el.linea('f2' + k, x + 222, 253, x + 222, 143, sel && !daBus ? 'att' : ''), el.linea('f3' + k, x + 222, 143, x + 190, 143, sel && !daBus ? 'att' : ''));
        });
        return els;
      };
      const hud = () => [['Bus D', String(p.d), 'a'], ['R1', String(st.q[0])], ['R2', String(st.q[1]), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const scelta = (k) => (E[k] ? p.d : st.q[k]);

      P({}, 0, 'Lo stato prima del fronte', 'R1 contiene 3 e R2 contiene 12. Sul bus D il resto del circuito offre il valore ' + p.d + ', che arriva a entrambi i registri. Il clock è al livello basso, e i registri tengono ferme le loro uscite.',
        { chiedi: { d: 'Il comando Carica di R1 vale ' + p.e1 + '. Quale valore presenta il multiplexer all’ingresso di R1?', o: ['3', String(p.d)], g: p.e1, no: 'Con Carica = 0 passa la retroazione, cioè il contenuto del registro. Con Carica = 1 passa il bus.' } });
      st.in[0] = scelta(0);
      P({ mux: 0 }, 1, 'Il multiplexer di R1', p.e1 ? 'Carica vale 1, e il multiplexer lascia passare il bus D. All’ingresso di R1 si presenta ' + p.d + '. Il registro, per ora, contiene ancora 3.' : 'Carica vale 0, e il multiplexer lascia passare la retroazione. All’ingresso di R1 si presenta 3, cioè la parola che il registro già contiene.', { calc: 'ingresso di R1 = ' + st.in[0] });
      st.in[1] = scelta(1);
      P({ mux: 1 }, 1, 'Il multiplexer di R2', p.e2 ? 'Per R2 Carica vale 1, e il multiplexer lascia passare il bus D. All’ingresso di R2 si presenta ' + p.d + '. Il registro contiene ancora 12.' : 'Per R2 Carica vale 0, e il multiplexer lascia passare la retroazione. All’ingresso di R2 si presenta 12, la parola che il registro già contiene.',
        { calc: 'ingresso di R2 = ' + st.in[1], chiedi: { d: 'Sta per arrivare il fronte di salita. Quali registri eseguiranno una scrittura?', o: ['Soltanto quelli con Carica = 1', 'Tutti e due'], g: 1, no: 'Ogni registro copia il proprio ingresso a ogni fronte. Con Carica = 0 ciò che copia è il suo stesso contenuto.' } });
      st.q = [st.in[0], st.in[1]]; st.ck = 'sale ↑';
      P({ fronte: true }, 2, 'Il fronte di salita', 'Il clock sale. In questo istante ciascun registro copia in Q il valore presente al proprio ingresso. R1 ' + (p.e1 ? 'passa da 3 a ' + p.d : 'riscrive 3') + ', R2 ' + (p.e2 ? (p.d === 12 ? 'riceve 12 dal bus, lo stesso valore che conteneva' : 'passa da 12 a ' + p.d) : 'riscrive 12') + '.', { calc: 'R1 = ' + st.q[0] + ' · R2 = ' + st.q[1] });
      st.ck = 'alto';
      P({ fine: true }, 3, 'Fino al prossimo fronte', 'Ora R1 contiene ' + st.q[0] + ' e R2 contiene ' + st.q[1] + '. Le due uscite resteranno ferme per tutto il ciclo, qualunque cosa accada sul bus. ' + (p.e1 && p.e2 ? 'I due registri hanno caricato la stessa parola, e la differenza iniziale è andata perduta.' : !p.e1 && !p.e2 ? 'Nessuno dei due ha caricato: entrambi hanno riscritto il proprio contenuto, e il dato sul bus è stato ignorato.' : 'Un registro ha caricato il bus e l’altro ha riscritto se stesso: lo stesso filo dei dati, due destini diversi.'),
        { calc: 'R1 = ' + st.q[0] + ' · R2 = ' + st.q[1], esito: ['R1 = ' + st.q[0] + ' · R2 = ' + st.q[1], 'si'] });
      return { passi, esito: st.q[0] + ',' + st.q[1] };
    }
  },
  bilancio: {
    regola: [
      'Un circuito sequenziale conserva uno stato. Un registro copia l’ingresso D nell’uscita Q al fronte di salita del clock, e per il resto del ciclo tiene ferma l’uscita.',
      'Con un multiplexer e una retroazione il registro diventa comandabile: Carica = 1 scrive il dato esterno, Carica = 0 riscrive il contenuto e così lo conserva.'
    ],
    errori: [
      ['Pensare che un registro cambi appena cambia il suo ingresso.', 'Fra un fronte e il successivo il registro ignora D. Conta soltanto il valore presente al fronte.'],
      ['Credere che conservare significhi restare inattivi.', 'A ogni fronte il registro scrive comunque. Con Carica = 0 ciò che scrive è il proprio contenuto.'],
      ['Aspettarsi lo stesso valore in due registri sullo stesso bus.', 'Ciascuno ha il proprio comando Carica, e conserva l’ultima parola che ha caricato.']
    ],
    saFare: ['Distinguere un circuito combinatorio da uno sequenziale.', 'Prevedere il contenuto di un registro dopo un fronte, dato il comando Carica.', 'Spiegare come la retroazione permette a un registro di conservare una parola.'],
    esercizi: [
      { d: 'Un registro contiene 9. Per tre fronti consecutivi il bus D porta 4, 6 e 2, e il comando Carica vale 0, 1 e 0. Che cosa contiene il registro dopo il terzo fronte?', segnaposto: 'Un numero', giuste: ['6', 'sei'],
        ok: 'Al primo fronte il registro riscrive 9, al secondo carica 6, al terzo riscrive 6.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Al terzo fronte Carica vale 0: il registro riscrive il proprio contenuto e ignora il bus.' },
          { se: ['9', 'nove'], msg: 'Al secondo fronte Carica vale 1, e il registro copia il bus, che porta 6.' },
          { se: ['4', 'quattro'], msg: 'Al primo fronte Carica vale 0, quindi il 4 sul bus viene ignorato.' }
        ],
        altro: 'Il numero è diverso. Si segua un fronte alla volta: con Carica = 1 il registro copia il bus, con Carica = 0 riscrive se stesso.',
        indizi: ['Primo fronte, Carica = 0: il registro resta a 9.', 'Secondo fronte, Carica = 1: il registro copia il bus.', 'Terzo fronte, Carica = 0: il registro conserva.'],
        svolgimento: ['Dopo il primo fronte: 9.', 'Dopo il secondo fronte: 6.', 'Dopo il terzo fronte: 6.'] },
      { d: 'In un registro con il comando Carica, che cosa presenta il multiplexer all’ingresso del registro quando Carica vale 0?', guida: 'Si scelga la risposta.', o: [
        { t: 'L’uscita Q del registro stesso', ok: true, fb: 'È la retroazione: riscrivendo ciò che contiene, il registro lo conserva.' },
        { t: 'Il dato sul bus D', fb: 'Il bus passa quando Carica vale 1.' },
        { t: 'Una parola di tutti zeri', fb: 'Con una parola di zeri il registro si azzererebbe a ogni fronte, e perderebbe il contenuto.' }] }
    ],
    sfida: ['cslez3_2_04_random_assembly', 'Caricamento e modifica di un registro a quattro bit']
  }
});
