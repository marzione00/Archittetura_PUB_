'use strict';
SL.registra('1.6.3', {
  titolo: 'Arrotondamento, distanza tra valori e programmi',
  obiettivo: 'Obiettivo: determinare la distanza fra due numeri in virgola mobile adiacenti, e prevedere l’effetto della somma fra un numero grande e uno troppo piccolo.',
  concetti: [['lente', 'Precisione'], ['virgola', 'Distanza'], ['conflitto', 'Arrotondamento']],
  filigrana: ['lente', 'virgola', 'conflitto'],
  richiami: {
    carte: [
      { sim: 'virgola', da: 'Dall’unità 1.6.2', t: 'Significando ed esponente', d: 'Un numero in virgola mobile è un significando moltiplicato per una potenza di due. A 32 bit il significando ha 24 cifre binarie, compreso l’uno implicito.' },
      { sim: 'lente', da: 'Dall’unità 1.6.1', t: 'La precisione', d: 'Il numero di cifre conservate è fissato. Quanto eccede viene troncato.' },
      { sim: 'bilancio', da: 'Dall’unità 1.2.2', t: 'I pesi raddoppiano', d: 'Ogni posizione binaria ha peso doppio rispetto a quella alla sua destra.' }
    ],
    domanda: { d: 'Prima di proseguire: un significando ha 24 cifre binarie e la prima ha peso 16. Quale peso ha la seconda?', o: [
      { t: '32', fb: 'I pesi raddoppiano procedendo verso sinistra. La seconda cifra si trova a destra della prima e ha peso dimezzato.' },
      { t: '8', ok: true, fb: 'Ogni cifra ha peso pari alla metà di quella alla sua sinistra.' },
      { t: '15', fb: 'I pesi binari si dimezzano a ogni posizione: 16, 8, 4, 2.' }
    ] }
  },
  idea: {
    titolo: 'Una retta con tacche a distanza crescente',
    termini: ['arrotondamento', 'pareggio al pari'],
    testo: [
      'Un numero in virgola mobile a 32 bit ha 24 cifre binarie di significando. Il loro numero è costante, per un numero molto piccolo come per uno molto grande. Varia invece il peso dell’ultima cifra, che dipende dall’esponente.',
      'I numeri rappresentabili possono essere disposti su una retta, ciascuno contrassegnato da una tacca. In prossimità di 1 le tacche distano circa un decimilionesimo; in prossimità di mille, circa un decimillesimo; in prossimità di sedici milioni, esattamente 1. Oltre tale valore distano 2, poi 4, poi 8. I numeri che cadono fra due tacche sono privi di rappresentazione in questo formato.',
      { fig: 'scena', w: 700, h: 214, titolo: 'La distanza fra due numeri vicini, a 32 bit', nota: 'A ogni raddoppio della grandezza raddoppia anche la distanza fra le tacche.', els: [
        SL.el.box('a1', 10, 6, 330, 44, null, 'vicino a 1', '', { cls: 'stretta' }), SL.el.box('b1', 360, 6, 330, 44, null, '0,0000001', 'on', { cls: 'stretta' }),
        SL.el.box('a2', 10, 58, 330, 44, null, 'vicino a 1000', '', { cls: 'stretta' }), SL.el.box('b2', 360, 58, 330, 44, null, '0,0001', 'on', { cls: 'stretta' }),
        SL.el.box('a3', 10, 110, 330, 44, null, 'fra 8 e 16 milioni', '', { cls: 'stretta' }), SL.el.box('b3', 360, 110, 330, 44, null, '1', 'att', { cls: 'stretta' }),
        SL.el.box('a4', 10, 162, 330, 44, null, 'fra 16 e 32 milioni', '', { cls: 'stretta' }), SL.el.box('b4', 360, 162, 330, 44, null, '2', 'on', { cls: 'stretta' })] },
      'Quando il risultato esatto di un’operazione cade fra due tacche, il processore lo riporta sulla più vicina. Tale correzione prende il nome di [[arrotondamento]], ed è eseguita dopo ogni singola operazione.',
      'Resta il caso in cui il risultato cade esattamente a metà. La scelta sistematica della tacca superiore introdurrebbe in tutti i calcoli un lieve eccesso, e gli errori si accumulerebbero. Lo standard sceglie la tacca il cui ultimo bit vale 0, cioè quella pari. La regola prende il nome di [[pareggio al pari]]: in metà dei casi arrotonda per eccesso e nell’altra metà per difetto, sicché in media gli errori si compensano.',
      'Il numero 16 777 216 costituisce una soglia notevole: è 2 moltiplicato per se stesso 24 volte. Oltre tale valore le tacche distano 2, e l’aggiunta di 1 resta priva di effetto. Il risultato esatto cade a metà fra due tacche, e il pareggio al pari lo riporta al valore di partenza.',
      'Le conseguenze sui programmi sono rilevanti. Un contatore in virgola mobile cessa di crescere una volta raggiunta tale soglia, senza alcuna segnalazione. L’ordine dei calcoli influisce sul risultato: l’aggiunta ripetuta di 1 a un numero grande può lasciarlo invariato, mentre l’aggiunta di 2 in una sola operazione lo modifica. I conteggi richiedono pertanto gli interi.'
    ]
  },
  esperimento: {
    faremo: [
      'A un numero di partenza, potenza di due, si aggiunge 1 più volte, in virgola mobile a 32 bit.',
      'A ogni aggiunta si considerano due valori distinti: il risultato esatto, e la tacca sulla quale il processore lo riporta.'
    ],
    vedrai: [
      ['virgola', 'Il righello', 'Al centro: il numero di partenza e i quattro interi successivi. Quelli rappresentabili nel formato sono accesi.'],
      ['lente', 'La distanza', 'In alto: la distanza fra due tacche adiacenti a questa grandezza.'],
      ['conflitto', 'Esatto e conservato', 'In basso: il risultato esatto di ogni somma e il valore conservato in memoria.']
    ]
  },
  lab: {
    titolo: 'Aggiunta di uno a un numero grande',
    scena: { w: 860, h: 320 },
    atti: ['Il numero di partenza', 'Le tacche', 'Le aggiunte', 'Il confronto'],
    nota: 'Il numero dei passi dipende dal numero delle aggiunte: due passi per ciascuna.',
    controlli: [
      { id: 'e', tipo: 'scelta', eti: 'Numero di partenza', opzioni: [[4, '16'], [10, '1024'], [23, '8 388 608'], [24, '16 777 216'], [25, '33 554 432']], valore: 24 },
      { id: 'k', tipo: 'num', eti: 'Aggiunte di 1', min: 1, max: 4, salti: [1], valore: 3 }
    ],
    previsione: {
      domanda: (p) => 'Si parte da ' + SL.num(Math.pow(2, p.e)) + ' e si aggiunge 1 per ' + (p.k === 1 ? 'una volta' : p.k + ' volte') + ', in virgola mobile a 32 bit. Quale valore resta in memoria al termine?',
      opzioni: (p) => { const x = Math.pow(2, p.e); return Array.from(new Set([x, x + 1, x + 2, x + p.k, x + 4])).sort((a, b) => a - b).map((v) => [v, SL.num(v)]); }
    },
    confronto: (pred, esito, p) => { const x = Math.pow(2, p.e); return 'La previsione indicava ' + SL.num(pred) + '. In memoria è rimasto ' + SL.num(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === x ? 'A questa grandezza le tacche distano più di 1. Ciascuna aggiunta è annullata dall’arrotondamento.' : 'A questa grandezza le tacche distano 1 o meno, e ogni aggiunta cade quindi su un numero rappresentabile.'); },
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
      const hud = () => [['Aggiunte eseguite', fatte + ' di ' + p.k, 'a'], ['Distanza fra tacche', mostraTacche ? T(passoT) : '·'], ['In memoria', SL.num(cur), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Il numero di partenza', 'Si parte da ' + SL.num(x) + ', che è 2 moltiplicato per se stesso ' + p.e + ' volte. È una potenza di due, e il formato lo rappresenta quindi esattamente: significando 1, esponente ' + p.e + '.');
      mostraTacche = true;
      P({ att: 'di' }, 1, 'Il peso dell’ultima cifra', 'Il significando ha 24 cifre. La prima ha peso ' + SL.num(x) + ' e ogni cifra successiva ha peso dimezzato. Dimezzando 23 volte si ottiene il peso dell’ultima, ' + T(passoT) + ': è la distanza fra due tacche adiacenti.', { calc: SL.num(x) + ' ÷ 8 388 608 = ' + T(passoT) });
      P({}, 1, 'Gli interi rappresentabili', passoT <= 1
        ? 'Le tacche distano ' + T(passoT) + ', e tutti gli interi mostrati cadono quindi su una tacca.' + (passoT < 1 ? ' Fra un intero e il successivo se ne trovano molte altre.' : '')
        : 'Le tacche distano ' + T(passoT) + '. Dei cinque interi mostrati sono rappresentabili soltanto quelli che distano da ' + SL.num(x) + ' un multiplo di ' + T(passoT) + '. Gli altri cadono fra due tacche.',
        { chiedi: { d: 'Aggiungendo 1 a ' + SL.num(x) + ' il risultato esatto è ' + SL.num(x + 1) + '. Il formato lo può conservare?', o: ['Sì, cade su una tacca', 'No, cade fra due tacche'], g: rapp(x + 1) ? 0 : 1, no: 'Le tacche distano ' + T(passoT) + ' a questa grandezza.' } });
      for (let i = 0; i < p.k; i++) {
        esatto = cur + 1;
        P({ att: 'ex', dove: esatto - x <= 4 ? esatto - x : null }, 2, 'Aggiunta ' + (i + 1) + ': il risultato esatto', 'In memoria si trova ' + SL.num(cur) + '. Aggiungendo 1, il risultato esatto è ' + SL.num(esatto) + '.', { calc: SL.num(cur) + ' + 1 = ' + SL.num(esatto) });
        const prima = cur; fatte++;
        let come;
        if (rapp(esatto)) { cur = esatto; come = 'Il numero ' + SL.num(esatto) + ' cade su una tacca ed è conservato senza modifiche.'; }
        else if (passoT === 2) come = 'Il numero ' + SL.num(esatto) + ' cade esattamente a metà fra ' + SL.num(prima) + ' e ' + SL.num(prima + 2) + '. Il pareggio al pari sceglie la tacca con l’ultimo bit a 0, che è ' + SL.num(prima) + '. L’aggiunta è andata perduta.';
        else come = 'Il numero ' + SL.num(esatto) + ' cade fra ' + SL.num(prima) + ' e ' + SL.num(prima + passoT) + ', più vicino al primo. L’arrotondamento lo riporta a ' + SL.num(prima) + '. L’aggiunta è andata perduta.';
        P({ att: 'me', dove: cur - x <= 4 ? cur - x : null }, 2, 'Aggiunta ' + (i + 1) + ': il valore conservato', come, { calc: SL.num(esatto) + ' → ' + SL.num(cur) });
      }
      P({ att: 'me' }, 3, cur === x + p.k ? 'Tutte le aggiunte sono state conservate' : 'Le aggiunte sono andate perdute', cur === x + p.k
        ? 'Dopo ' + (p.k === 1 ? 'una aggiunta' : p.k + ' aggiunte') + ' il valore in memoria è ' + SL.num(cur) + ', proprio ' + SL.num(x) + ' + ' + p.k + '. A questa grandezza il formato distingue ancora gli interi.'
        : 'Dopo ' + (p.k === 1 ? 'una aggiunta' : p.k + ' aggiunte') + ' il valore in memoria è ancora ' + SL.num(cur) + '. Il risultato esatto sarebbe ' + SL.num(x + p.k) + '. Ogni somma è stata arrotondata separatamente, e nessuna ha superato la metà della distanza fra le tacche.', { calc: 'atteso: ' + SL.num(x + p.k) + ' · conservato: ' + SL.num(cur) });
      return { passi, esito: cur };
    }
  },
  bilancio: {
    regola: [
      'A 32 bit il significando ha 24 cifre. La distanza fra due numeri adiacenti cresce con la grandezza: vale 1 fra 8 e 16 milioni, 2 nell’intervallo successivo.',
      'Ogni operazione arrotonda il risultato alla tacca più vicina. A metà esatta sceglie quella con l’ultimo bit a 0. Un’aggiunta inferiore alla metà della distanza va perduta.'
    ],
    errori: [
      ['Contare con la virgola mobile.', 'Oltre 16 777 216 un contatore a 32 bit non avanza più. I conteggi vanno eseguiti con gli interi.'],
      ['Ritenere che l’errore sia sempre trascurabile.', 'L’errore è piccolo rispetto alla grandezza del numero. Per numeri grandi può valere unità intere.'],
      ['Considerare indifferente l’ordine delle somme.', 'Ogni operazione è arrotondata. La somma preliminare dei numeri piccoli fra loro può conservare quanto, aggiunto un termine alla volta, andrebbe perduto.']
    ],
    saFare: ['Motivare la dipendenza della distanza fra due numeri adiacenti dalla grandezza.', 'Applicare l’arrotondamento alla tacca più vicina e il pareggio al pari.', 'Prevedere quando un’aggiunta va perduta.'],
    esercizi: [
      { d: 'In virgola mobile a 32 bit si calcola 16 777 216 + 1. Quale valore viene conservato?', segnaposto: 'Un numero', giuste: ['16777216'],
        ok: 'Il risultato esatto cade a metà fra due tacche, e il pareggio al pari sceglie 16 777 216.',
        diagnosi: [
          { se: ['16777217'], msg: 'Il valore indicato è il risultato esatto. A questa grandezza le tacche distano 2, e 16 777 217 cade fra due tacche.' },
          { se: ['16777218'], msg: 'È l’altra tacca adiacente. A metà esatta lo standard sceglie quella con l’ultimo bit a 0, che è 16 777 216.' }
        ],
        altro: 'Il valore è diverso. Si determinino le due tacche fra cui cade il risultato esatto e si applichi il pareggio al pari.',
        indizi: ['Da 16 777 216 in avanti le tacche distano 2.', 'Il risultato esatto, 16 777 217, è a metà fra 16 777 216 e 16 777 218.', 'A metà esatta prevale la tacca con l’ultimo bit a 0.'],
        svolgimento: ['Risultato esatto: 16 777 217.', 'Tacche adiacenti: 16 777 216 e 16 777 218, alla stessa distanza.', 'Il pareggio al pari sceglie 16 777 216.'] },
      { d: 'Un programma deve contare gli eventi di un sensore, e ne prevede oltre cento milioni. Quale tipo di numero è opportuno impiegare per il contatore?', guida: 'Si scelga la risposta.', o: [
        { t: 'Virgola mobile a 32 bit', fb: 'Oltre 16 777 216 l’aggiunta di 1 lascia invariato il valore. Il contatore si arresterebbe senza alcuna segnalazione.' },
        { t: 'Un intero', ok: true, fb: 'Un intero a 32 bit conta esattamente fino a oltre quattro miliardi, senza arrotondamenti.' },
        { t: 'È indifferente', fb: 'I due tipi occupano gli stessi 32 bit e hanno un comportamento molto diverso nei conteggi.' }] }
    ],
    sfida: ['lez06_05_c_float_pitfalls', 'Precisione delle operazioni in C']
  }
});
