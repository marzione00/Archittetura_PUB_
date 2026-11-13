'use strict';
/* Prova del capitolo 3.2: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const PS = (v) => I(v).concat([v + 'ps']);

  SL.registraProva('3.2', { domande: [
    // 3.2.1 · un registro con il comando Carica, per tre fronti
    (r) => {
      const v = r.mescola([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]).slice(0, 4), q0 = v[0], d = v.slice(1), e = r.scegli([[0, 1, 0], [1, 0, 0], [1, 1, 0], [0, 1, 1], [1, 0, 1], [0, 0, 1], [0, 0, 0], [1, 1, 1]]);
      let q = q0; const storia = []; d.forEach((x, k) => { if (e[k]) q = x; storia.push(q); });
      const giuste = I(q), primo = e.indexOf(1);
      return { u: '3.2.1', d: 'Un registro contiene ' + q0 + '. Per tre fronti consecutivi il bus D porta ' + d[0] + ', ' + d[1] + ' e ' + d[2] + ', e il comando Carica vale ' + e[0] + ', ' + e[1] + ' e ' + e[2] + '. Che cosa contiene il registro dopo il terzo fronte?', segnaposto: 'Un numero', giuste,
        ok: 'Dopo i tre fronti il registro contiene, nell’ordine, ' + storia.join(', ') + '. A ogni fronte con Carica = 0 riscrive se stesso.',
        diagnosi: DIAG(giuste, [
          { se: I(d[2]), msg: 'Al terzo fronte Carica vale 0: il registro riscrive il proprio contenuto e ignora il bus.' },
          { se: I(q0), msg: 'Il registro ha caricato almeno una volta: quando Carica vale 1 copia il bus.' },
          primo >= 0 ? { se: I(d[primo]), msg: 'Questo è il primo valore caricato. Un fronte successivo con Carica = 1 lo ha sostituito.' } : null,
          { se: I(d[0]), msg: 'Al primo fronte Carica vale ' + e[0] + (e[0] ? ', ma un fronte successivo ha caricato di nuovo.' : ', quindi il valore sul bus viene ignorato.') }
        ]),
        altro: 'Il numero è diverso. Segui un fronte alla volta: con Carica = 1 il registro copia il bus, con Carica = 0 riscrive se stesso.',
        indizi: d.map((x, k) => (k === 0 ? 'Primo' : k === 1 ? 'Secondo' : 'Terzo') + ' fronte, Carica = ' + e[k] + ': il registro ' + (e[k] ? 'copia il bus, che porta ' + x + '.' : 'conserva.')),
        svolgimento: storia.map((x, k) => 'Dopo il ' + (k === 0 ? 'primo' : k === 1 ? 'secondo' : 'terzo') + ' fronte: ' + x + '.') };
    },
    // 3.2.2 · latch e flip-flop davanti allo stesso dato, oppure una sequenza su un latch SR
    (r) => {
      if (r.int(0, 1) === 0) {
        const q = r.int(0, 1), d = r.int(0, 1), e = r.int(0, 2) > 0 ? 1 - d : d, giusta = e + ',' + d;
        const T = (k) => 'Latch ' + k[0] + ', flip-flop ' + k[2];
        const fb = (k) => (k === giusta ? 'Il flip-flop ha catturato ' + d + ' al fronte. Il latch, aperto per tutto il livello alto, mostra l’ultimo valore di D, che è ' + e + '.' : Number(k[2]) !== d ? 'Il flip-flop cattura D al fronte, quando vale ' + d + ', e poi lo ignora fino al fronte successivo.' : 'Il latch resta aperto per tutto il livello alto, quindi mostra l’ultimo valore di D, che è ' + e + '.');
        return { u: '3.2.2', d: 'Un latch D e un flip-flop D ricevono lo stesso dato e lo stesso clock, e conservano entrambi ' + q + '. Al fronte di salita D vale ' + d + '. Mentre il clock è ancora alto, D ' + (e === d ? 'resta a ' + d : 'passa a ' + e) + '. Subito prima che il clock scenda, quanto valgono le due uscite?', guida: 'Scegli la risposta.',
          o: ['0,0', '0,1', '1,0', '1,1'].map((k) => (k === giusta ? { t: T(k), ok: true, fb: fb(k) } : { t: T(k), fb: fb(k) })) };
      }
      const q0 = r.int(0, 1), seq = [r.scegli(['S', 'R']), r.scegli(['S', 'R']), r.scegli(['S', 'R'])].slice(0, r.int(2, 3)), q = seq[seq.length - 1] === 'S' ? 1 : 0, giuste = [String(q)];
      return { u: '3.2.2', d: 'Un latch SR fatto con due NOR conserva Q = ' + q0 + '. Arrivano nell’ordine ' + seq.map((x) => 'un 1 su ' + x).join(', ') + ', e dopo ciascuno gli ingressi tornano a 0. Quanto vale Q alla fine?', segnaposto: '0 oppure 1', giuste,
        ok: 'Conta l’ultimo impulso: un 1 su ' + seq[seq.length - 1] + ' porta Q a ' + q + ', e con gli ingressi di nuovo a 0 il latch conserva quel valore.',
        diagnosi: [{ se: [String(1 - q)], msg: 'Un 1 su S porta Q a 1, un 1 su R lo porta a 0. Dopo l’ultimo impulso, che è su ' + seq[seq.length - 1] + ', il latch conserva.' }],
        altro: 'La risposta è un solo bit. Segui gli impulsi nell’ordine: S porta Q a 1, R lo porta a 0.',
        indizi: ['Un 1 su S porta Q a 1.', 'Un 1 su R porta Q a 0.', 'L’ultimo impulso è su ' + seq[seq.length - 1] + '.'],
        svolgimento: seq.map((x, k) => 'Impulso ' + (k + 1) + ' su ' + x + ': Q = ' + (x === 'S' ? 1 : 0) + '.').concat(['Con S e R a 0 il valore resta: Q = ' + q + '.']) };
    },
    // 3.2.3 · una lettura dal banco, prima o dopo una scrittura
    (r) => {
      const R = r.mescola([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]).slice(0, 5), v = R[4], a = r.int(0, 3), w = r.int(0, 2) > 0 ? a : r.int(0, 3), en = r.int(0, 3) > 0 ? 1 : 0, quando = r.scegli(['prima', 'dopo']);
      const giusto = quando === 'dopo' && en && w === a ? v : R[a], giuste = I(giusto);
      return { u: '3.2.3', d: 'Un banco contiene R0 = ' + R[0] + ', R1 = ' + R[1] + ', R2 = ' + R[2] + ' e R3 = ' + R[3] + '. La porta A legge R' + a + '. La porta di scrittura offre ' + v + ' a R' + w + ' con l’abilitazione a ' + en + '. Che cosa mostra la porta A subito ' + quando + ' il fronte?', segnaposto: 'Un numero', giuste,
        ok: quando === 'prima' ? 'Prima del fronte nessun registro è cambiato, e la porta mostra il contenuto di R' + a + '.' : !en ? 'Con l’abilitazione a 0 nessun registro carica, e R' + a + ' contiene la parola di prima.' : w === a ? 'Al fronte R' + a + ' ha caricato ' + v + ', e la porta che lo legge mostra la parola nuova.' : 'La scrittura ha cambiato R' + w + '. La porta A legge R' + a + ', che è rimasto com’era.',
        diagnosi: DIAG(giuste, [
          { se: I(v), msg: quando === 'prima' ? 'Il valore ' + v + ' entra nel registro soltanto al fronte. Prima, la lettura mostra la parola vecchia.' : !en ? 'Con l’abilitazione a 0 la scrittura non avviene, e il registro conserva la propria parola.' : 'La scrittura riguarda R' + w + '. La porta A sta leggendo R' + a + '.' },
          { se: I(R[a]), msg: 'Questa è la parola che R' + a + ' conteneva prima del fronte. La scrittura, abilitata, lo ha appena cambiato.' },
          { se: I(R[w]), msg: 'Questo è il contenuto di R' + w + ', il registro indicato dalla scrittura. La porta A legge R' + a + '.' },
          { se: I(a), msg: 'Questo è l’indirizzo. La porta mostra la parola contenuta nel registro con quel numero.' }
        ]),
        altro: 'Il numero è diverso. Stabilisci che cosa contiene R' + a + ' ' + quando + ' il fronte: la scrittura cambia un solo registro, soltanto al fronte e soltanto se è abilitata.',
        indizi: ['La porta A mostra il contenuto di R' + a + '.', 'La scrittura ha effetto al fronte, con l’abilitazione a 1, sul solo R' + w + '.', quando === 'prima' ? 'Prima del fronte nulla è ancora cambiato.' : en && w === a ? 'Il registro letto è proprio quello scritto.' : 'Il registro letto resta com’era.'],
        svolgimento: ['Registro letto: R' + a + ', che contiene ' + R[a] + '.', 'Scrittura: ' + v + ' in R' + w + ', abilitazione ' + en + '.', 'La porta A, ' + quando + ' il fronte, mostra ' + giusto + '.'] };
    },
    // 3.2.4 · il periodo minimo, oppure il margine di hold
    (r) => {
      if (r.int(0, 1) === 0) {
        const tq = 5 * r.int(3, 8), cr = 5 * r.int(12, 40), su = 5 * r.int(2, 5), giusto = tq + cr + su, giuste = PS(giusto);
        return { u: '3.2.4', d: 'Un registro mostra la parola nuova entro ' + tq + ' ps dal fronte. La logica ha un cammino critico di ' + cr + ' ps, e il registro di arrivo chiede un setup di ' + su + ' ps. Qual è il periodo minimo del clock, in picosecondi?', segnaposto: 'Un numero di picosecondi', giuste,
          ok: 'Il periodo deve coprire i tre tempi in fila: ' + tq + ' + ' + cr + ' + ' + su + ' = ' + giusto + ' ps.',
          diagnosi: DIAG(giuste, [
            { se: I(tq + cr), msg: 'Manca il tempo di setup: il dato deve essere fermo ' + su + ' ps prima del fronte.' },
            { se: I(cr + su), msg: 'Manca il ritardo di uscita del registro di partenza, ' + tq + ' ps.' },
            { se: I(cr), msg: 'Questo è il solo cammino critico della logica. Vanno aggiunti l’uscita del registro e il setup.' }
          ]),
          altro: 'Il numero è diverso. Somma l’uscita del registro, il cammino critico e il setup.',
          indizi: ['Il dato parte dal registro dopo ' + tq + ' ps.', 'Attraversa la logica in ' + cr + ' ps.', 'Deve arrivare ' + su + ' ps prima del fronte successivo.'],
          svolgimento: ['Uscita del registro: ' + tq + ' ps.', 'Cammino critico: ' + cr + ' ps. Setup: ' + su + ' ps.', 'Periodo minimo: ' + giusto + ' ps.'] };
      }
      const tq = r.int(6, 15), lm = r.int(2, 14), h = r.int(12, 22), arrivo = tq + lm, giusto = arrivo - h, giuste = I(giusto).concat(I(giusto).map((x) => x + 'ps'));
      return { u: '3.2.4', d: 'Dopo il fronte un registro può mostrare la parola nuova già dopo ' + tq + ' ps, e il percorso più breve della logica dura ' + lm + ' ps. Il registro di arrivo chiede un hold di ' + h + ' ps. Quanto vale il margine di hold, cioè l’arrivo più precoce meno il tempo di hold? Rispondi in picosecondi, con il segno meno se è negativo.', segnaposto: 'Un numero di picosecondi', giuste,
        ok: 'Il dato più precoce arriva dopo ' + tq + ' + ' + lm + ' = ' + arrivo + ' ps. Il margine è ' + arrivo + ' − ' + h + ' = ' + SL.x86.num(giusto) + ' ps' + (giusto < 0 ? ': la condizione è violata, e allungare il periodo sarebbe inutile.' : ': la condizione è rispettata.'),
        diagnosi: DIAG(giuste, [
          { se: I(arrivo), msg: 'Questo è l’istante in cui arriva il dato più precoce. Va tolto il tempo di hold.' },
          giusto !== 0 ? { se: I(-giusto), msg: 'Il segno è rovesciato: il margine è l’arrivo più precoce meno il tempo di hold.' } : null,
          { se: I(lm - h), msg: 'All’arrivo contribuisce anche l’uscita del registro, ' + tq + ' ps.' },
          { se: I(tq - h), msg: 'All’arrivo contribuisce anche il percorso della logica, ' + lm + ' ps.' }
        ]),
        altro: 'Il numero è diverso. Calcola l’arrivo più precoce e togli il tempo di hold.',
        indizi: ['Arrivo più precoce: uscita rapida del registro più percorso breve della logica.', tq + ' + ' + lm + ' = ' + arrivo + ' ps.', arrivo + ' − ' + h + '.'],
        svolgimento: ['Arrivo più precoce: ' + tq + ' + ' + lm + ' = ' + arrivo + ' ps.', 'Hold richiesto: ' + h + ' ps.', 'Margine: ' + arrivo + ' − ' + h + ' = ' + SL.x86.num(giusto) + ' ps.'] };
    },
    // 3.2.5 · il distributore dopo quattro monete: credito finale, oppure prodotti consegnati
    (r) => {
      const q0 = r.int(0, 2), m = [r.int(1, 2), r.int(1, 2), r.int(1, 2), r.int(1, 2)], cosa = r.int(0, 1);
      let q = q0, erog = 0, rest = 0; const righe = [], crediti = [];
      m.forEach((x) => { const t = q + x; if (t === 3) { erog++; righe.push(q + ' + ' + x + ' = 3: consegna, credito 0.'); q = 0; } else if (t > 3) { rest++; righe.push(q + ' + ' + x + ' = ' + t + ': moneta restituita, credito ' + q + '.'); } else { righe.push(q + ' + ' + x + ' = ' + t + ': credito ' + t + '.'); q = t; } crediti.push(q); });
      const giusto = cosa ? erog : q, giuste = I(giusto), tot = q0 + m[0] + m[1] + m[2] + m[3];
      return { u: '3.2.5', d: 'Un distributore vende un prodotto da 3 unità, e restituisce la moneta che farebbe superare il prezzo. Il distributore parte con credito ' + q0 + ' e riceve nell’ordine le monete da ' + m.join(', ') + '. ' + (cosa ? 'Quanti prodotti consegna?' : 'Con quale credito finisce?'), segnaposto: 'Un numero', giuste,
        ok: 'Dopo le quattro monete il credito vale, nell’ordine, ' + crediti.join(', ') + '. ' + (rest ? 'Le monete restituite sono ' + rest + '.' : 'Nessuna moneta è stata restituita.'),
        diagnosi: DIAG(giuste, cosa ? [
          { se: I(Math.floor(tot / 3)), msg: 'Hai diviso il totale versato per il prezzo. Una moneta che farebbe superare 3 viene restituita e resta fuori dal conto.' },
          { se: I(q), msg: 'Questo è il credito finale. La domanda chiede i prodotti consegnati.' },
          { se: I(erog + 1), msg: 'Il prodotto esce soltanto quando il totale vale 3 esatti.' }
        ] : [
          { se: I(tot % 3), msg: 'Hai preso il resto del totale versato diviso 3. Una moneta che farebbe superare 3 viene restituita, e il credito resta com’era.' },
          { se: I(erog), msg: 'Questo è il numero dei prodotti consegnati. La domanda chiede il credito finale.' },
          { se: I(3), msg: 'Il credito conservato vale al massimo 2. A 3 esatti il prodotto esce e il credito torna a 0.' }
        ]),
        altro: 'Il numero è diverso. Segui una moneta alla volta, applicando la regola al credito del momento.',
        indizi: ['Sotto 3 il credito aumenta.', 'A 3 esatti il prodotto esce e il credito torna a 0.', 'Oltre 3 la moneta torna indietro e il credito resta com’era.'],
        svolgimento: righe.concat([cosa ? 'Prodotti consegnati: ' + erog + '.' : 'Credito finale: ' + q + '.']) };
    }
  ] });
})();
