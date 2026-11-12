'use strict';
SL.registra('1.6.3', {
  titolo: 'Arrotondamento, distanza tra valori e programmi',
  obiettivo: 'Alla fine saprai dire quanto distano due numeri in virgola mobile vicini, e prevedere che cosa accade quando a un numero grande se ne aggiunge uno troppo piccolo.',
  concetti: [['lente', 'Precisione'], ['virgola', 'Distanza'], ['conflitto', 'Arrotondamento']],
  filigrana: ['lente', 'virgola', 'conflitto'],
  richiami: {
    carte: [
      { sim: 'virgola', da: 'Dall’unità 1.6.2', t: 'Significando ed esponente', d: 'Un numero in virgola mobile è un significando moltiplicato per una potenza di due. A 32 bit il significando ha 24 cifre binarie, contando l’uno sottinteso.' },
      { sim: 'lente', da: 'Dall’unità 1.6.1', t: 'La precisione', d: 'Il numero di cifre conservate è fissato. Ciò che non entra viene tagliato.' },
      { sim: 'bilancio', da: 'Dall’unità 1.2.2', t: 'I pesi raddoppiano', d: 'Ogni posizione binaria pesa il doppio di quella alla sua destra.' }
    ],
    domanda: { d: 'Prima di proseguire: un significando ha 24 cifre binarie e la prima pesa 16. Quanto pesa la seconda?', o: [
      { t: '32', fb: 'I pesi raddoppiano andando verso sinistra. La seconda cifra sta a destra della prima e pesa la metà.' },
      { t: '8', ok: true, fb: 'Ogni cifra pesa la metà di quella alla sua sinistra.' },
      { t: '15', fb: 'I pesi binari si dimezzano a ogni posizione: 16, 8, 4, 2.' }
    ] }
  },
  idea: {
    titolo: 'Un righello con le tacche che si allargano',
    termini: ['arrotondamento', 'pareggio al pari'],
    testo: [
      'Un numero in virgola mobile a 32 bit ha 24 cifre binarie di significando. Sono sempre 24, per un numero minuscolo come per uno enorme. Quello che cambia è il peso dell’ultima cifra, che dipende dall’esponente.',
      'Immagina un righello. Vicino a 1 le tacche distano circa un decimilionesimo. Vicino a mille distano circa un decimillesimo. Vicino a sedici milioni distano esattamente 1. Più avanti distano 2, poi 4, poi 8. I numeri che cadono fra due tacche non esistono in questo formato.',
      { fig: 'scena', w: 700, h: 214, titolo: 'La distanza fra due numeri vicini, a 32 bit', nota: 'A ogni raddoppio della grandezza raddoppia anche la distanza fra le tacche.', els: [
        SL.el.box('a1', 10, 6, 330, 44, null, 'vicino a 1', '', { cls: 'stretta' }), SL.el.box('b1', 360, 6, 330, 44, null, '0,0000001', 'on', { cls: 'stretta' }),
        SL.el.box('a2', 10, 58, 330, 44, null, 'vicino a 1000', '', { cls: 'stretta' }), SL.el.box('b2', 360, 58, 330, 44, null, '0,0001', 'on', { cls: 'stretta' }),
        SL.el.box('a3', 10, 110, 330, 44, null, 'fra 8 e 16 milioni', '', { cls: 'stretta' }), SL.el.box('b3', 360, 110, 330, 44, null, '1', 'att', { cls: 'stretta' }),
        SL.el.box('a4', 10, 162, 330, 44, null, 'fra 16 e 32 milioni', '', { cls: 'stretta' }), SL.el.box('b4', 360, 162, 330, 44, null, '2', 'on', { cls: 'stretta' })] },
      'Quando il risultato esatto di un’operazione cade fra due tacche, il processore lo sposta sulla più vicina. Questo spostamento si chiama [[arrotondamento]], e avviene dopo ogni singola operazione.',
      'Resta il caso in cui il risultato è esattamente a metà. Scegliere sempre la tacca più alta farebbe crescere tutti i conti di un soffio, e gli errori si sommerebbero. Lo standard sceglie la tacca il cui ultimo bit vale 0, cioè quella pari. La regola si chiama [[pareggio al pari]]: metà delle volte arrotonda in su e metà in giù, e in media gli errori si compensano.',
      'Il numero 16 777 216 è una soglia da ricordare: è 2 moltiplicato per se stesso 24 volte. Da lì in avanti le tacche distano 2, e aggiungere 1 non sposta più nulla. Il risultato esatto cade a metà fra due tacche, e il pareggio al pari riporta al punto di partenza.',
      'Le conseguenze nei programmi sono concrete. Un contatore in virgola mobile smette di crescere arrivato a quella soglia, senza alcun messaggio. L’ordine dei calcoli cambia il risultato: aggiungere due volte 1 a un numero grande può lasciarlo fermo, mentre aggiungere 2 in una volta sola lo sposta. Per contare servono gli interi.'
    ]
  },
  esperimento: {
    faremo: [
      'Sceglierai un numero di partenza, una potenza di due, e gli aggiungeremo 1 più volte, in virgola mobile a 32 bit.',
      'A ogni aggiunta guarderemo due cose distinte: il risultato esatto, e la tacca su cui il processore lo riporta.'
    ],
    vedrai: [
      ['virgola', 'Il righello', 'Al centro: il numero di partenza e i quattro interi successivi. Quelli che il formato sa rappresentare sono accesi.'],
      ['lente', 'La distanza', 'In alto: quanto distano due tacche vicine a questa grandezza.'],
      ['conflitto', 'Esatto e conservato', 'In basso: il risultato matematico di ogni somma e il valore che resta in memoria.']
    ]
  },
  lab: {
    titolo: 'Aggiungere uno a un numero grande',
    scena: { w: 860, h: 320 },
    atti: ['Il numero di partenza', 'Le tacche', 'Le aggiunte', 'Il confronto'],
    nota: 'Il numero di passi dipende da quante aggiunte scegli: due passi per ciascuna.',
    controlli: [
      { id: 'e', tipo: 'scelta', eti: 'Numero di partenza', opzioni: [[4, '16'], [10, '1024'], [23, '8 388 608'], [24, '16 777 216'], [25, '33 554 432']], valore: 24 },
      { id: 'k', tipo: 'num', eti: 'Aggiunte di 1', min: 1, max: 4, salti: [1], valore: 3 }
    ],
    previsione: {
      domanda: (p) => 'Partiamo da ' + SL.num(Math.pow(2, p.e)) + ' e aggiungiamo 1 per ' + (p.k === 1 ? 'una volta' : p.k + ' volte') + ', in virgola mobile a 32 bit. Quale valore resta in memoria alla fine?',
      opzioni: (p) => { const x = Math.pow(2, p.e); return Array.from(new Set([x, x + 1, x + 2, x + p.k, x + 4])).sort((a, b) => a - b).map((v) => [v, SL.num(v)]); }
    },
    confronto: (pred, esito, p) => { const x = Math.pow(2, p.e); return 'Avevi previsto ' + SL.num(pred) + '. In memoria è rimasto ' + SL.num(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === x ? 'A questa grandezza le tacche distano più di 1. Ogni aggiunta viene annullata dall’arrotondamento, una alla volta.' : 'A questa grandezza le tacche distano 1 o meno, quindi ogni aggiunta arriva su un numero rappresentabile.'); },
    costruisci(p) {
      const el = SL.el, passi = [];
      const x = Math.pow(2, p.e), passoT = Math.pow(2, p.e - 23);
      const rapp = (v) => (passoT <= 1 ? true : (v - x) % passoT === 0);
      const T = (v) => (v >= 1 ? String(v) : 'circa ' + String(Number(v.toPrecision(2))).replace('.', ','));
      let cur = x, mostraTacche = false, esatto = null, fatte = 0;
      const quadro = (o) => {
        o = o || {};
        const els = [el.box('di', 40, 10, 420, 70, 'distanza fra due tacche a questa grandezza', mostraTacche ? T(passoT) : '·', o.att === 'di' ? 'att' : '', { sim: 'lente', riga: true }),
          el.nota('t1', 40, 104, 'IL RIGHELLO, DA ' + SL.num(x) + ' IN AVANTI', 'mono')];
        for (let j = 0; j < 5; j++) {
          const v = x + j, c = !mostraTacche ? '' : rapp(v) ? (v === cur ? 'on' : '') : 'off';
          els.push(el.cella('r' + j, 40 + j * 160, 150, 146, 54, SL.num(v), o.dove === j ? 'att' : c, { cls: 'minuta', so: j === 0 ? 'partenza' : '+ ' + j, gi: mostraTacche ? (rapp(v) ? 'esiste' : 'tra due tacche') : null }));
        }
        els.push(el.box('ex', 40, 244, 380, 66, 'risultato esatto della somma', esatto === null ? '·' : SL.num(esatto), o.att === 'ex' ? 'att' : '', { cls: 'stretta' }));
        els.push(el.box('me', 450, 244, 380, 66, 'valore conservato in memoria', SL.num(cur), o.att === 'me' ? 'att' : 'on', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Aggiunte fatte', fatte + ' di ' + p.k, 'a'], ['Distanza fra tacche', mostraTacche ? T(passoT) : '·'], ['In memoria', SL.num(cur), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Il numero di partenza', 'Partiamo da ' + SL.num(x) + ', che è 2 moltiplicato per se stesso ' + p.e + ' volte. È una potenza di due, quindi il formato lo rappresenta esattamente: significando 1, esponente ' + p.e + '.');
      mostraTacche = true;
      P({ att: 'di' }, 1, 'Il peso dell’ultima cifra', 'Il significando ha 24 cifre. La prima pesa ' + SL.num(x) + ' e ogni cifra successiva pesa la metà. Dimezzando 23 volte si arriva al peso dell’ultima, ' + T(passoT) + ': è la distanza fra due tacche vicine.', { calc: SL.num(x) + ' ÷ 8 388 608 = ' + T(passoT) });
      P({}, 1, 'Quali interi esistono', passoT <= 1
        ? 'Le tacche distano ' + T(passoT) + ', quindi tutti gli interi qui sopra cadono su una tacca.' + (passoT < 1 ? ' Fra un intero e il successivo ce ne sono molte altre.' : '')
        : 'Le tacche distano ' + T(passoT) + '. Dei cinque interi mostrati esistono soltanto quelli che distano da ' + SL.num(x) + ' un multiplo di ' + T(passoT) + '. Gli altri cadono fra due tacche.',
        { chiedi: { d: 'Aggiungendo 1 a ' + SL.num(x) + ' il risultato esatto è ' + SL.num(x + 1) + '. Il formato lo può conservare?', o: ['Sì, cade su una tacca', 'No, cade fra due tacche'], g: rapp(x + 1) ? 0 : 1, no: 'Le tacche distano ' + T(passoT) + ' a questa grandezza.' } });
      for (let i = 0; i < p.k; i++) {
        esatto = cur + 1;
        P({ att: 'ex', dove: esatto - x <= 4 ? esatto - x : null }, 2, 'Aggiunta ' + (i + 1) + ': il risultato esatto', 'In memoria c’è ' + SL.num(cur) + '. Aggiungendo 1, il risultato matematico è ' + SL.num(esatto) + '.', { calc: SL.num(cur) + ' + 1 = ' + SL.num(esatto) });
        const prima = cur; fatte++;
        let come;
        if (rapp(esatto)) { cur = esatto; come = 'Il numero ' + SL.num(esatto) + ' cade su una tacca e viene conservato così com’è.'; }
        else if (passoT === 2) come = 'Il numero ' + SL.num(esatto) + ' cade esattamente a metà fra ' + SL.num(prima) + ' e ' + SL.num(prima + 2) + '. Il pareggio al pari sceglie la tacca con l’ultimo bit a 0, che è ' + SL.num(prima) + '. L’aggiunta è svanita.';
        else come = 'Il numero ' + SL.num(esatto) + ' cade fra ' + SL.num(prima) + ' e ' + SL.num(prima + passoT) + ', più vicino al primo. L’arrotondamento lo riporta a ' + SL.num(prima) + '. L’aggiunta è svanita.';
        P({ att: 'me', dove: cur - x <= 4 ? cur - x : null }, 2, 'Aggiunta ' + (i + 1) + ': il valore conservato', come, { calc: SL.num(esatto) + ' → ' + SL.num(cur) });
      }
      P({ att: 'me' }, 3, cur === x + p.k ? 'Tutte le aggiunte sono arrivate' : 'Le aggiunte sono andate perdute', cur === x + p.k
        ? 'Dopo ' + (p.k === 1 ? 'una aggiunta' : p.k + ' aggiunte') + ' il valore in memoria è ' + SL.num(cur) + ', proprio ' + SL.num(x) + ' + ' + p.k + '. A questa grandezza il formato distingue ancora gli interi.'
        : 'Dopo ' + (p.k === 1 ? 'una aggiunta' : p.k + ' aggiunte') + ' il valore in memoria è ancora ' + SL.num(cur) + '. Il risultato matematico sarebbe ' + SL.num(x + p.k) + '. Ogni somma è stata arrotondata per conto suo, e nessuna è riuscita a superare mezza distanza fra le tacche.', { calc: 'atteso: ' + SL.num(x + p.k) + ' · conservato: ' + SL.num(cur) });
      return { passi, esito: cur };
    }
  },
  bilancio: {
    regola: [
      'A 32 bit il significando ha 24 cifre. La distanza fra due numeri vicini cresce con la grandezza: vale 1 fra 8 e 16 milioni, 2 subito dopo.',
      'Ogni operazione arrotonda il risultato alla tacca più vicina. A metà esatta sceglie quella con l’ultimo bit a 0. Un’aggiunta più piccola di mezza distanza svanisce.'
    ],
    errori: [
      ['Contare con la virgola mobile.', 'Oltre 16 777 216 un contatore a 32 bit non avanza più. I conteggi vanno fatti con gli interi.'],
      ['Pensare che l’errore sia sempre minuscolo.', 'L’errore è piccolo rispetto alla grandezza del numero. Per numeri grandi può valere unità intere.'],
      ['Considerare indifferente l’ordine delle somme.', 'Ogni operazione viene arrotondata. Sommare prima i numeri piccoli fra loro può salvare ciò che, aggiunto un pezzo alla volta, andrebbe perduto.']
    ],
    saFare: ['Spiego perché la distanza fra due numeri vicini dipende dalla grandezza.', 'Applico l’arrotondamento alla tacca più vicina e il pareggio al pari.', 'Prevedo quando un’aggiunta va perduta.'],
    esercizi: [
      { d: 'In virgola mobile a 32 bit si calcola 16 777 216 + 1. Quale valore viene conservato?', segnaposto: 'Un numero', giuste: ['16777216'],
        ok: 'Il risultato esatto cade a metà fra due tacche, e il pareggio al pari sceglie 16 777 216.',
        diagnosi: [
          { se: ['16777217'], msg: 'Quello è il risultato matematico. A questa grandezza le tacche distano 2, e 16 777 217 cade fra due tacche.' },
          { se: ['16777218'], msg: 'È l’altra tacca vicina. A metà esatta lo standard sceglie quella con l’ultimo bit a 0, che è 16 777 216.' }
        ],
        altro: 'Il valore è diverso. Trova le due tacche fra cui cade il risultato esatto e applica il pareggio al pari.',
        indizi: ['Da 16 777 216 in avanti le tacche distano 2.', 'Il risultato esatto, 16 777 217, è a metà fra 16 777 216 e 16 777 218.', 'A metà esatta vince la tacca con l’ultimo bit a 0.'],
        svolgimento: ['Risultato esatto: 16 777 217.', 'Tacche vicine: 16 777 216 e 16 777 218, alla stessa distanza.', 'Il pareggio al pari sceglie 16 777 216.'] },
      { d: 'Un programma deve contare gli eventi di un sensore, e ne prevede oltre cento milioni. Quale tipo di numero conviene usare per il contatore?', guida: 'Scegli la risposta.', o: [
        { t: 'Virgola mobile a 32 bit', fb: 'Oltre 16 777 216 aggiungere 1 non cambia più il valore. Il contatore si fermerebbe senza avvisare.' },
        { t: 'Un intero', ok: true, fb: 'Un intero a 32 bit conta esattamente fino a oltre quattro miliardi, senza arrotondamenti.' },
        { t: 'È indifferente', fb: 'I due tipi occupano gli stessi 32 bit e si comportano in modo molto diverso quando si conta.' }] }
    ],
    sfida: ['lez06_05_c_float_pitfalls', 'Precisione delle operazioni in C']
  }
});
