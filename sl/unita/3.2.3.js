'use strict';
SL.registra('3.2.3', {
  titolo: 'Registri, banchi di registri e memoria',
  obiettivo: 'Obiettivo: descrivere un banco di registri con due porte di lettura e una di scrittura, e saprai dire che cosa mostrano le letture prima e dopo un fronte del clock.',
  concetti: [['register', 'Molti registri, un indirizzo'], ['mux', 'Leggere significa scegliere'], ['clock', 'Scrivere al fronte']],
  filigrana: ['register', 'memory', 'mux'],
  richiami: {
    carte: [
      { sim: 'register', da: 'Dall’unità 3.2.1', t: 'Il registro con Carica', d: 'Al fronte di salita un registro copia il dato esterno se Carica vale 1, e riscrive se stesso se Carica vale 0.' },
      { sim: 'mux', da: 'Dall’unità 3.1.2', t: 'Il multiplexer', d: 'Sceglie una parola fra molte, secondo il numero scritto dal comando.' },
      { sim: 'memory', da: 'Dall’unità 2.1.2', t: 'Registri e memoria', d: 'Un’istruzione nomina i registri che usa. Le celle di memoria si raggiungono attraverso un indirizzo.' }
    ],
    domanda: { d: 'Prima di proseguire: per indicare uno fra quattro registri, quanti bit di indirizzo servono?', o: [
      { t: '2', ok: true, fb: 'Due bit formano quattro combinazioni, una per registro.' },
      { t: '4', fb: 'Quattro bit basterebbero per sedici registri.' },
      { t: '1', fb: 'Un bit solo distingue due registri.' }
    ] }
  },
  idea: {
    titolo: 'Leggere due parole, scriverne una',
    termini: ['banco di registri', 'porta di lettura', 'porta di scrittura', 'decodificatore'],
    testo: [
      'Un processore possiede molti registri, e ogni istruzione ne usa alcuni: `add rax, rbx` ne legge due e ne scrive uno. I registri stanno raccolti in un blocco, il [[banco di registri]], dove ciascuno è individuato da un numero. In un banco di quattro registri i numeri 0, 1, 2 e 3 indicano R0, R1, R2 e R3. Il numero è un indirizzo, la parola contenuta è il dato.',
      'Leggere un registro significa scegliere una parola fra molte, ed è il lavoro di un multiplexer che ha l’indirizzo come comando. Un ingresso per l’indirizzo, insieme all’uscita che mostra la parola scelta, forma una [[porta di lettura]]. Il banco ne ha due, A e B, ciascuna con il proprio multiplexer. Sono indipendenti: possono leggere due registri diversi oppure lo stesso. La lettura è combinatoria, quindi poco dopo un cambio dell’indirizzo l’uscita mostra la parola nuova.',
      'Per scrivere si usa la [[porta di scrittura]], formata da un indirizzo, una parola da scrivere e un’abilitazione. Un [[decodificatore]] trasforma l’indirizzo in quattro fili, uno per registro, dei quali vale 1 soltanto quello indicato. Quel filo, in AND con l’abilitazione, diventa il comando Carica del registro scelto. Al fronte di salita il registro scelto copia la parola in arrivo, e tutti gli altri riscrivono se stessi.',
      { fig: 'scena', w: 720, h: 176, titolo: 'Un banco di quattro registri', nota: 'A sinistra la porta di scrittura, a destra le due porte di lettura.', els: [
        SL.el.box('w', 10, 56, 150, 64, 'decodificatore', 'indirizzo', 'att', { cls: 'stretta' }),
        SL.el.box('r0', 270, 2, 170, 38, null, 'R0', 'on', { cls: 'stretta' }), SL.el.box('r1', 270, 46, 170, 38, null, 'R1', 'on', { cls: 'stretta' }), SL.el.box('r2', 270, 90, 170, 38, null, 'R2', 'on', { cls: 'stretta' }), SL.el.box('r3', 270, 134, 170, 38, null, 'R3', 'on', { cls: 'stretta' }),
        SL.el.linea('d0', 160, 88, 270, 21, ''), SL.el.linea('d1', 160, 88, 270, 65, ''), SL.el.linea('d2', 160, 88, 270, 109, 'att'), SL.el.linea('d3', 160, 88, 270, 153, ''),
        SL.el.box('a', 550, 10, 160, 60, 'MUX · porta A', 'indirizzo A', 'on', { cls: 'stretta' }), SL.el.box('b', 550, 106, 160, 60, 'MUX · porta B', 'indirizzo B', 'on', { cls: 'stretta' }),
        SL.el.linea('a0', 440, 21, 550, 30, ''), SL.el.linea('a1', 440, 65, 550, 40, 'on'), SL.el.linea('a2', 440, 109, 550, 50, ''), SL.el.linea('a3', 440, 153, 550, 60, ''),
        SL.el.linea('b0', 440, 21, 550, 116, ''), SL.el.linea('b1', 440, 65, 550, 126, ''), SL.el.linea('b2', 440, 109, 550, 136, 'on'), SL.el.linea('b3', 440, 153, 550, 146, '')
      ] },
      'Lettura e scrittura seguono dunque regole diverse. Una lettura mostra ciò che il registro contiene in quel momento. Una scrittura ha effetto soltanto al fronte. Se una porta legge proprio il registro che sta per essere scritto, prima del fronte mostra la parola vecchia e dopo il fronte la nuova.',
      'La memoria principale segue lo stesso schema su una scala molto più grande: un indirizzo sceglie una cella fra miliardi, per leggerla oppure per scriverla. Scegliere fra così tante celle richiede più tempo, ed è una delle ragioni per cui la memoria risponde più lentamente dei registri.'
    ]
  },
  esperimento: {
    faremo: [
      'Un banco di quattro registri contiene 8, 5, 11 e 2. Le porte A e B leggono due registri a tua scelta. La porta di scrittura offre il valore 21 a un registro, anch’esso a tua scelta, con l’abilitazione che deciderai.',
      'Vedremo che cosa mostrano le due porte prima del fronte e dopo. Dopo il caso proposto, metti l’abilitazione a 0. Poi fai leggere a entrambe le porte il registro che viene scritto.'
    ],
    vedrai: [
      ['input', 'La porta di scrittura', 'A sinistra: il dato, l’indirizzo, l’abilitazione e il clock.'],
      ['register', 'I quattro registri', 'Al centro: il contenuto di R0, R1, R2 e R3.'],
      ['output', 'Le porte di lettura', 'A destra: la parola mostrata dalla porta A e quella mostrata dalla porta B.']
    ]
  },
  lab: {
    titolo: 'Due letture e una scrittura',
    scena: { w: 860, h: 300 },
    atti: ['Il banco', 'Le due letture', 'La scrittura in attesa', 'Il fronte', 'Dopo il fronte'],
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'La porta A legge', opzioni: [[0, 'R0'], [1, 'R1'], [2, 'R2'], [3, 'R3']], valore: 1 },
      { id: 'b', tipo: 'scelta', eti: 'La porta B legge', opzioni: [[0, 'R0'], [1, 'R1'], [2, 'R2'], [3, 'R3']], valore: 2 },
      { id: 'w', tipo: 'scelta', eti: 'La scrittura punta a', opzioni: [[0, 'R0'], [1, 'R1'], [2, 'R2'], [3, 'R3']], valore: 2 },
      { id: 'en', tipo: 'scelta', eti: 'Abilitazione di scrittura', opzioni: [[0, '0'], [1, '1']], valore: 1 }
    ],
    nota: 'I passi sono sempre sei. All’inizio il banco contiene 8, 5, 11 e 2, e il dato da scrivere vale 21.',
    previsione: {
      domanda: (p) => 'Il banco contiene R0 = 8, R1 = 5, R2 = 11 e R3 = 2. La porta A legge R' + p.a + ' e la porta B legge R' + p.b + '. La porta di scrittura offre 21 a R' + p.w + ', con l’abilitazione a ' + p.en + '. Dopo il fronte, che cosa mostrano le due porte?',
      opzioni: (p) => { const R = SL.unita323.INIZIO, f = SL.unita323.dopo(p); return Array.from(new Set([R[p.a] + ',' + R[p.b], f[p.a] + ',' + f[p.b], '21,' + R[p.b], R[p.a] + ',21', '21,21'])).map((k) => [k, 'A mostra ' + k.split(',')[0] + ', B mostra ' + k.split(',')[1]]); }
    },
    confronto: (pred, esito, p) => { const T = (k) => 'A = ' + k.split(',')[0] + ' e B = ' + k.split(',')[1]; return 'La previsione indicava ' + T(pred) + '. Dopo il fronte: ' + T(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : !p.en ? 'Con l’abilitazione a 0 nessun registro carica, e le letture restano quelle di prima.' : 'Cambia soltanto R' + p.w + ', che riceve 21. Lo vedono le porte che leggono proprio quel registro' + (p.a !== p.w && p.b !== p.w ? ', e qui nessuna delle due lo legge.' : '.')); },
    costruisci(p) {
      const el = SL.el, U = SL.unita323, passi = [], R = U.INIZIO.slice(), YR = [10, 78, 146, 214];
      const st = { la: false, lb: false, attesa: false, ck: 'basso' };
      const quadro = (o) => {
        const els = [el.box('wd', 20, 10, 170, 60, 'dato da scrivere', '21', o.scr ? 'att' : 'on', { cls: 'stretta' }),
          el.box('wa', 20, 80, 170, 60, 'registro scelto', 'R' + p.w, o.scr ? 'att' : 'on', { cls: 'stretta' }),
          el.box('we', 20, 150, 170, 60, 'abilitazione', String(p.en), o.scr ? 'att' : p.en ? 'on' : '', { cls: 'stretta' }),
          el.box('ck', 20, 226, 170, 60, 'clock', st.ck, o.fronte ? 'att' : '', { cls: 'stretta' })];
        R.forEach((v, k) => {
          els.push(el.linea('d' + k, 190, 110, 290, YR[k] + 30, st.attesa && k === p.w && p.en ? 'att' : ''),
            el.box('r' + k, 290, YR[k], 170, 60, 'R' + k, String(v), o.fronte && k === p.w && p.en ? 'att' : (o.leggi === 'a' && k === p.a) || (o.leggi === 'b' && k === p.b) ? 'att' : 'on', { cls: 'stretta' }),
            el.linea('a' + k, 460, YR[k] + 22, 600, 60 + k * 8, st.la && k === p.a ? 'on' : ''),
            el.linea('b' + k, 460, YR[k] + 38, 600, 200 + k * 8, st.lb && k === p.b ? 'on' : ''));
        });
        els.push(el.box('pa', 600, 34, 240, 80, 'porta A · legge R' + p.a, st.la ? String(R[p.a]) : '·', o.leggi === 'a' || (o.dopo && p.a === p.w && p.en) ? 'att' : st.la ? 'on' : 'off', { cls: 'stretta' }),
          el.box('pb', 600, 174, 240, 80, 'porta B · legge R' + p.b, st.lb ? String(R[p.b]) : '·', o.leggi === 'b' || (o.dopo && p.b === p.w && p.en) ? 'att' : st.lb ? 'on' : 'off', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Porta A', st.la ? 'R' + p.a + ' = ' + R[p.a] : '·', 'a'], ['Porta B', st.lb ? 'R' + p.b + ' = ' + R[p.b] : '·'], ['Scrittura', p.en ? '21 in R' + p.w : 'disabilitata', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const vecchio = R[p.w], tocca = p.en && (p.a === p.w || p.b === p.w);

      P({}, 0, 'Quattro registri', 'Il banco contiene R0 = 8, R1 = 5, R2 = 11 e R3 = 2. Il clock è al livello basso. Le porte di lettura ricevono i loro indirizzi: ' + p.a + ' per la porta A e ' + p.b + ' per la porta B.',
        { chiedi: { d: 'La porta A riceve l’indirizzo ' + p.a + '. Quale parola mostra?', o: ['8', '5', '11', '2'], g: p.a, no: 'L’indirizzo ' + p.a + ' indica R' + p.a + ', che contiene ' + R[p.a] + '.' } });
      st.la = true;
      P({ leggi: 'a' }, 1, 'La porta A', 'Il multiplexer della porta A riceve le quattro parole e l’indirizzo ' + p.a + '. Lascia passare quella di R' + p.a + ': la porta mostra ' + R[p.a] + '. Nessun clock è intervenuto, perché la lettura è combinatoria.', { calc: 'A = R' + p.a + ' = ' + R[p.a] });
      st.lb = true;
      P({ leggi: 'b' }, 1, 'La porta B', 'La porta B ha un multiplexer proprio, con l’indirizzo ' + p.b + ', e mostra ' + R[p.b] + '. ' + (p.a === p.b ? 'Le due porte leggono lo stesso registro e mostrano la stessa parola: nulla lo impedisce.' : 'Le due letture avvengono insieme e non si disturbano.'), { calc: 'B = R' + p.b + ' = ' + R[p.b] });
      st.attesa = true;
      P({ scr: true }, 2, 'La scrittura in attesa', 'La porta di scrittura offre 21 all’indirizzo ' + p.w + ', con l’abilitazione a ' + p.en + '. Il decodificatore accende il filo di R' + p.w + '. ' + (p.en ? 'In AND con l’abilitazione, quel filo diventa il comando Carica di R' + p.w + '. Il fronte però deve ancora arrivare, e il registro contiene sempre ' + vecchio + '.' : 'L’abilitazione vale 0, quindi il comando Carica resta a 0 per tutti i registri.'),
        { calc: p.en ? 'Carica di R' + p.w + ' = 1' : 'Carica = 0 per tutti', chiedi: tocca ? { d: 'Il fronte deve ancora arrivare. La porta ' + (p.a === p.w ? 'A' : 'B') + ', che legge R' + p.w + ', che cosa mostra in questo momento?', o: [String(vecchio), '21'], g: 0, no: 'La scrittura ha effetto al fronte. Fino ad allora R' + p.w + ' contiene ' + vecchio + ', e la lettura mostra quello.' } : { d: 'Al fronte, quanti registri cambieranno contenuto?', o: ['Nessuno', 'Uno', 'Tutti e quattro'], g: p.en ? 1 : 0, no: p.en ? 'Carica soltanto il registro indicato dall’indirizzo di scrittura. Gli altri tre riscrivono se stessi.' : 'Con l’abilitazione a 0 tutti i registri riscrivono il proprio contenuto.' } });
      if (p.en) R[p.w] = 21;
      st.ck = 'sale ↑'; st.attesa = false;
      P({ fronte: true }, 3, 'Il fronte di salita', 'Il clock sale. ' + (p.en ? 'R' + p.w + ' copia la parola in arrivo e passa da ' + vecchio + ' a 21. Gli altri tre registri riscrivono il proprio contenuto.' : 'Tutti e quattro i registri riscrivono il proprio contenuto. Il valore 21 offerto dalla porta di scrittura va perduto.'), { calc: p.en ? 'R' + p.w + ' = 21' : 'nessun cambiamento' });
      st.ck = 'alto';
      P({ dopo: true }, 4, 'Le letture dopo il fronte', (p.en ? (tocca ? 'Poco dopo il fronte, ' + (p.a === p.w && p.b === p.w ? 'entrambe le porte mostrano' : 'la porta ' + (p.a === p.w ? 'A' : 'B') + ' mostra') + ' la parola nuova, 21: ' + (p.a === p.w && p.b === p.w ? 'leggono' : 'legge') + ' R' + p.w + ', che è appena cambiato.' + (p.a === p.w && p.b === p.w ? '' : ' L’altra porta mostra la stessa parola di prima.') : 'R' + p.w + ' contiene ora 21, e nessuna porta lo sta leggendo: le due uscite sono quelle di prima.') : 'Le due porte mostrano le stesse parole di prima, perché nessun registro è cambiato.') + ' La porta A mostra ' + R[p.a] + ' e la porta B mostra ' + R[p.b] + '.',
        { calc: 'A = ' + R[p.a] + ' · B = ' + R[p.b], esito: ['A = ' + R[p.a] + ' · B = ' + R[p.b], 'si'] });
      return { passi, esito: R[p.a] + ',' + R[p.b] };
    }
  },
  bilancio: {
    regola: [
      'Un banco di registri legge con i multiplexer e scrive con un decodificatore. L’indirizzo di lettura sceglie la parola da mostrare, l’indirizzo di scrittura sceglie il registro che carica.',
      'La lettura è combinatoria e mostra il contenuto del momento. La scrittura avviene al fronte, soltanto con l’abilitazione a 1, e cambia un solo registro.'
    ],
    errori: [
      ['Aspettarsi la parola nuova prima del fronte.', 'Finché il fronte non arriva, il registro contiene la parola vecchia, e la lettura mostra quella.'],
      ['Pensare che la scrittura tocchi le porte di lettura.', 'La scrittura cambia un registro. Una porta se ne accorge soltanto se sta leggendo proprio quello.'],
      ['Dimenticare l’abilitazione.', 'Con l’abilitazione a 0 l’indirizzo e il dato di scrittura vengono ignorati, e nessun registro cambia.']
    ],
    saFare: ['Descrivere le porte di lettura e la porta di scrittura di un banco.', 'Indicare quale registro cambia al fronte, dati indirizzo e abilitazione.', 'Prevedere ciò che una porta di lettura mostra prima e dopo una scrittura.'],
    esercizi: [
      { d: 'Un banco contiene R0 = 4, R1 = 9, R2 = 6 e R3 = 1. La porta A legge R3. La porta di scrittura offre 7 a R3 con l’abilitazione a 1. Che cosa mostra la porta A subito prima del fronte?', segnaposto: 'Un numero', giuste: ['1', 'uno'],
        ok: 'Prima del fronte R3 contiene ancora 1, e la lettura mostra il contenuto del momento.',
        diagnosi: [
          { se: ['7', 'sette'], msg: 'Il 7 entra in R3 soltanto al fronte. Prima, la porta mostra la parola vecchia.' },
          { se: ['3', 'tre'], msg: 'Tre è l’indirizzo del registro. La porta mostra la parola che quel registro contiene.' },
          { se: ['4', 'quattro'], msg: 'Quattro è il contenuto di R0. La porta A riceve l’indirizzo 3.' }
        ],
        altro: 'Il numero è diverso. Cerca il contenuto di R3 prima che la scrittura abbia effetto.',
        indizi: ['La porta A legge R3.', 'La scrittura ha effetto al fronte.', 'Prima del fronte R3 contiene 1.'],
        svolgimento: ['Indirizzo della porta A: 3.', 'Contenuto di R3 prima del fronte: 1.', 'La porta A mostra 1. Dopo il fronte mostrerà 7.'] },
      { d: 'Al fronte di salita l’abilitazione di scrittura vale 0. Che cosa accade al registro indicato dall’indirizzo di scrittura?', guida: 'Si scelga la risposta.', o: [
        { t: 'Riscrive il proprio contenuto', ok: true, fb: 'Il suo comando Carica vale 0, come quello di tutti gli altri registri.' },
        { t: 'Carica il dato offerto', fb: 'Il filo del decodificatore passa da una AND con l’abilitazione. Con l’abilitazione a 0 il comando Carica resta a 0.' },
        { t: 'Viene azzerato', fb: 'Nessun segnale chiede di azzerarlo. Con Carica a 0 il registro conserva la parola che ha.' }] }
    ],
    sfida: ['cslez3_2_05_random_assembly', 'Aggiornamenti paralleli e priorità dei comandi']
  }
});
SL.unita323 = { INIZIO: [8, 5, 11, 2], dopo: (p) => { const r = [8, 5, 11, 2]; if (p.en) r[p.w] = 21; return r; } };
