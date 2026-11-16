'use strict';
/* Prova del capitolo 5.6: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const LET = (da, n) => { const l = []; for (let j = 0; j < n; j++) l.push('L' + (da + j)); return l; };

  SL.registraProva('5.6', { domande: [
    // 5.6.1 · vuoti, pieni oppure posti in transito
    (r) => {
      if (r.int(0, 2) === 0) { const cap = r.int(4, 12), tr = r.int(0, 2), V = r.int(0, cap - tr), Pn = cap - tr - V, giuste = I(tr);
        return { u: '5.6.1', d: 'Un buffer limitato ha ' + cap + ' posti. In un certo istante il semaforo vuoti vale ' + V + ' e il semaforo pieni vale ' + Pn + '. Quanti posti sono in transito?', segnaposto: 'Un numero', giuste,
          ok: cap + ' − ' + V + ' − ' + Pn + ' = ' + tr + '.',
          diagnosi: DIAG(giuste, [
            { se: I(V + Pn), msg: 'Questa è la somma dei due semafori. I posti in transito sono la differenza rispetto a ' + cap + '.' },
            { se: I(cap), msg: 'Questa è la capacità. Si sottraggano i posti contati dai due semafori.' }
          ]),
          altro: 'Il numero è diverso. Si applichi l’invariante: vuoti, pieni e posti in transito, sommati, sono pari alla capacità.',
          indizi: ['La capacità è ' + cap + '.', 'vuoti + pieni = ' + (V + Pn) + '.', cap + ' − ' + (V + Pn) + ' = ' + tr + '.'],
          svolgimento: ['Capacità: ' + cap + '.', 'Vuoti più pieni: ' + (V + Pn) + '.', 'In transito: ' + tr + '.'] }; }
      const cap = r.int(4, 12), a = r.int(1, cap - 1), b = r.int(0, a), t = r.int(0, 1), cosa = r.scegli(['vuoti', 'pieni']);
      const vuoti = cap - a + b - t, pieni = a - b, v = cosa === 'vuoti' ? vuoti : pieni, giuste = I(v);
      return { u: '5.6.1', d: 'Un buffer limitato ha ' + cap + ' posti, inizialmente tutti vuoti. Sono stati completati ' + a + (a === 1 ? ' inserimento' : ' inserimenti') + ' e ' + b + (b === 1 ? ' prelievo.' : ' prelievi.') + (t ? ' Un produttore ha inoltre prenotato un posto con down(vuoti), e deve ancora eseguire la sua up(pieni).' : ' Nessuna operazione è in corso.') + ' Quanto vale il semaforo ' + cosa + '?', segnaposto: 'Un numero', giuste,
        ok: cosa === 'vuoti' ? cap + ' − ' + a + ' + ' + b + (t ? ' − 1' : '') + ' = ' + vuoti + '.' : a + ' − ' + b + ' = ' + pieni + (t ? '. Il dato in lavorazione deve ancora essere pubblicato.' : '.'),
        diagnosi: DIAG(giuste, cosa === 'vuoti' ? [
          t ? { se: I(cap - a + b), msg: 'Manca il posto prenotato: la down(vuoti) del produttore ha già sottratto un posto.' } : null,
          b > 0 ? { se: I(cap - a - t), msg: 'Ogni prelievo completato restituisce un posto a vuoti.' } : null,
          { se: I(pieni), msg: 'Questo è il valore di pieni. La domanda riguarda i posti liberi.' }
        ] : [
          t ? { se: I(pieni + 1), msg: 'Il dato in lavorazione entrerà nel conteggio soltanto con la up(pieni).' } : null,
          b > 0 ? { se: I(a), msg: 'Ogni prelievo completato ha sottratto un dato a pieni.' } : null,
          { se: I(vuoti), msg: 'Questo è il valore di vuoti. La domanda riguarda i dati pubblicati.' }
        ]),
        altro: 'Il valore è diverso. Si seguano i posti: ogni inserimento ne sposta uno da vuoti a pieni, ogni prelievo compie lo spostamento opposto.',
        indizi: ['Inizialmente vuoti vale ' + cap + ' e pieni vale 0.', 'Dopo ' + a + (a === 1 ? ' inserimento' : ' inserimenti') + ' e ' + b + (b === 1 ? ' prelievo' : ' prelievi') + ': vuoti ' + (cap - a + b) + ', pieni ' + pieni + '.', t ? 'La prenotazione in corso sottrae un posto a vuoti: ' + vuoti + '. Il semaforo pieni resta ' + pieni + '.' : 'Nessun posto è in transito.'],
        svolgimento: ['Vuoti: ' + vuoti + '.', 'Pieni: ' + pieni + '.', 'In transito: ' + t + '.'] };
    },
    // 5.6.2 · esito secondo l'ordine di acquisizione, oppure produttori ancora bloccati
    (r) => {
      if (r.int(0, 2) === 0) { const c = r.int(1, 4), m = r.int(2, 5), j = r.int(1, m - 1), v = m - j, giuste = I(v);
        return { u: '5.6.2', d: 'Un buffer limitato ha ' + c + (c === 1 ? ' posto, pieno. ' : ' posti, tutti pieni. ') + m + ' produttori, che eseguono la down sul semaforo prima di richiedere il mutex, eseguono down(vuoti) e si bloccano. In seguito un consumatore completa ' + j + (j === 1 ? ' prelievo, compresa la up(vuoti).' : ' prelievi, comprese le up(vuoti).') + ' Quanti produttori restano bloccati?', segnaposto: 'Un numero', giuste,
          ok: 'Ogni up(vuoti) risveglia il primo produttore in coda: ' + m + ' − ' + j + ' = ' + v + '.',
          diagnosi: DIAG(giuste, [
            { se: I(j), msg: 'Questi sono i produttori sbloccati. La domanda riguarda quelli residui in coda.' },
            { se: I(m), msg: 'Ogni prelievo completato sblocca un produttore.' },
            { se: I(0), msg: 'Le up eseguite sono ' + j + ', e i produttori in coda erano ' + m + '.' }
          ]),
          altro: 'Il numero è diverso. Si conti un produttore sbloccato per ogni up(vuoti).',
          indizi: ['In coda su vuoti sono presenti ' + m + ' produttori.', 'I prelievi completati sono ' + j + '.', m + ' − ' + j + ' = ' + v + '.'],
          svolgimento: ['Produttori in coda: ' + m + '.', 'Produttori risvegliati: ' + j + '.', 'Ancora bloccati: ' + v + '.'] }; }
      const c = r.int(1, 4), pieno = r.int(0, 2) > 0, vm = r.int(0, 1) === 0, e = !pieno ? 0 : vm ? 1 : 2;
      const fb = e === 0 ? 'Un posto è libero: la down(vuoti) trova il semaforo maggiore di zero, e nessun thread resta in attesa.' : e === 1 ? 'P si blocca su vuoti senza possedere il mutex. C preleva, e la sua up(vuoti) sblocca P.' : 'P si blocca su vuoti in possesso del mutex. C, per prelevare, richiede quel mutex.';
      return { u: '5.6.2', d: 'Un buffer limitato ha ' + c + (c === 1 ? ' posto' : ' posti') + (pieno ? ' ed è pieno.' : ' e ha un posto libero.') + ' Il produttore P esegue ' + (vm ? 'down(vuoti) e quindi lock(mutex).' : 'lock(mutex) e quindi down(vuoti).') + ' Un consumatore C preleverà appena troverà un dato pubblicato. Che cosa accade?', guida: 'Si scelga la risposta.', o: r.mescola([
        { t: 'P inserisce immediatamente il proprio dato', ok: e === 0, fb },
        { t: 'P inserisce il proprio dato dopo un prelievo di C', ok: e === 1, fb },
        { t: 'P e C restano bloccati indefinitamente', ok: e === 2, fb }]) };
    },
    // 5.6.3 · consumatori che tornano ad attendere, oppure elementi rimasti
    (r) => {
      const c = r.int(2, 6), d = r.int(1, 6), cosa = r.int(0, 1), att = Math.max(0, c - d), resto = Math.max(0, d - c), v = cosa === 0 ? att : resto, giuste = I(v);
      return { u: '5.6.3', d: 'Una coda è vuota, e ' + c + ' consumatori sono in attesa sulla medesima condizione. Un produttore deposita ' + d + (d === 1 ? ' elemento' : ' elementi') + ' e li risveglia tutti. Ogni consumatore, ottenuto il mutex, ripete il controllo del predicato in un ciclo e, se lo trova vero, rimuove un elemento. ' + (cosa === 0 ? 'Quanti consumatori tornano ad attendere?' : 'Quanti elementi restano in coda?'), segnaposto: 'Un numero', giuste,
        ok: 'Trovano il predicato vero ' + Math.min(c, d) + (Math.min(c, d) === 1 ? ' consumatore' : ' consumatori') + '. Tornano ad attendere in ' + att + ', e in coda ' + (resto === 1 ? 'resta 1 elemento.' : 'restano ' + resto + ' elementi.'),
        diagnosi: DIAG(giuste, cosa === 0 ? [
          { se: I(Math.min(c, d)), msg: 'Questi sono i consumatori che trovano un elemento. La domanda riguarda gli altri.' },
          { se: I(c), msg: 'Un consumatore che ottiene il mutex mentre la coda contiene elementi trova il predicato vero.' },
          { se: I(resto), msg: 'Questo è il numero degli elementi residui in coda.' }
        ] : [
          { se: I(Math.min(c, d)), msg: 'Questi sono gli elementi rimossi. La domanda riguarda quelli residui.' },
          { se: I(d), msg: 'Ogni consumatore che trova il predicato vero rimuove un elemento.' },
          { se: I(att), msg: 'Questo è il numero dei consumatori tornati ad attendere.' }
        ]),
        altro: 'Il numero è diverso. Si considerino i consumatori uno per volta: ciascuno rimuove un elemento, se ne trova.',
        indizi: ['Gli elementi sono ' + d + ', i consumatori ' + c + '.', 'Trovano un elemento in ' + Math.min(c, d) + '.', cosa === 0 ? c + ' − ' + Math.min(c, d) + ' = ' + att + '.' : d + ' − ' + Math.min(c, d) + ' = ' + resto + '.'],
        svolgimento: ['Rimozioni: ' + Math.min(c, d) + '.', 'Consumatori che tornano ad attendere: ' + att + '.', 'Elementi residui: ' + resto + '.'] };
    },
    // 5.6.4 · lettori davanti allo scrittore, oppure chi entra dopo uno scrittore
    (r) => {
      if (r.int(0, 1) === 0) { const lett = r.int(0, 1) === 0, k = r.int(1, 6), v = lett ? k + 1 : 1, giuste = I(v);
        return { u: '5.6.4', d: 'L1 sta leggendo, e uno scrittore S richiede l’ingresso. In seguito ' + (k === 1 ? 'giunge un altro lettore' : 'giungono altri ' + k + ' lettori, ciascuno prima dell’uscita del precedente') + '. La politica di ammissione è: ' + (lett ? 'precedenza ai lettori' : 'ordine di arrivo') + '. Quanti lettori complessivamente, compreso L1, accedono ai dati prima di S?', segnaposto: 'Un numero', giuste,
          ok: lett ? 'Ogni nuovo lettore trova una lettura in corso ed entra: 1 + ' + k + ' = ' + v + '.' : 'I nuovi lettori si accodano dopo S. Prima di S legge soltanto L1.',
          diagnosi: DIAG(giuste, [
            { se: I(lett ? 1 : k + 1), msg: lett ? 'Questo sarebbe l’esito con l’ordine di arrivo. Con la precedenza ai lettori i nuovi lettori entrano immediatamente.' : 'Questo sarebbe l’esito con la precedenza ai lettori. In questo caso i nuovi lettori si accodano dopo S.' },
            { se: I(lett ? k : 0), msg: lett ? 'Va contato anche L1, che stava già leggendo.' : 'L1 stava già leggendo all’arrivo di S.' }
          ]),
          altro: 'Il numero è diverso. Si stabilisca per ogni nuovo lettore se entra immediatamente oppure si accoda dopo S.',
          indizi: ['L1 è già all’interno.', lett ? 'Ogni nuovo lettore entra immediatamente, prima di S.' : 'Ogni nuovo lettore si accoda dopo S.', 'Lettori prima di S: ' + v + '.'],
          svolgimento: ['Lettore iniziale: 1.', 'Nuovi lettori entrati prima di S: ' + (lett ? k : 0) + '.', 'Totale: ' + v + '.'] }; }
      const g = r.int(0, 3), h = r.int(1, 2), fila = ['S1'].concat(LET(2, g), ['S2'], LET(2 + g, h)), v = g > 0 ? g : 1, giuste = I(v);
      return { u: '5.6.4', d: 'La politica di ammissione rispetta l’ordine di arrivo. L1 sta leggendo. Giungono, in quest’ordine: ' + fila.join(', ') + '. Escono prima L1 e quindi S1. Quanti thread accedono ai dati immediatamente dopo l’uscita di S1?', segnaposto: 'Un numero', giuste,
        ok: g > 0 ? 'Dopo S1 la coda ha inizio con ' + (g === 1 ? 'un lettore, che entra.' : g + ' lettori consecutivi, che entrano insieme.') + ' S2 attende.' : 'Dopo S1 il primo della coda è S2, che entra in modo esclusivo.',
        diagnosi: DIAG(giuste, g > 0 ? [
          { se: I(g + 1), msg: 'S2 è uno scrittore, e uno scrittore entra soltanto in modo esclusivo.' },
          { se: I(g + h), msg: 'I lettori giunti dopo S2 restano in coda dopo S2.' },
          g > 1 ? { se: I(1), msg: 'I lettori consecutivi in testa alla coda entrano insieme.' } : null
        ] : [
          { se: I(h), msg: 'Quei lettori sono giunti dopo S2, e attendono dopo S2.' },
          { se: I(h + 1), msg: 'Uno scrittore entra soltanto in modo esclusivo.' },
          { se: I(0), msg: 'I dati sono liberi, e in testa alla coda è presente S2.' }
        ]),
        altro: 'Il numero è diverso. Si scriva la coda dopo l’uscita di S1, e si ammettano i thread in testa: tutti i lettori consecutivi, oppure un solo scrittore.',
        indizi: ['Dopo l’uscita di S1 la coda è: ' + fila.slice(1).join(', ') + '.', g > 0 ? 'In testa sono presenti ' + g + (g === 1 ? ' lettore.' : ' lettori consecutivi.') : 'In testa è presente uno scrittore.', 'Entrano in ' + v + '.'],
        svolgimento: ['Fila: ' + fila.slice(1).join(', ') + '.', 'Entrano: ' + (g > 0 ? LET(2, g).join(', ') : 'S2') + '.', 'Numero: ' + v + '.'] };
    },
    // 5.6.5 · ranghi ancora ammessi, oppure esito di due ordini di acquisizione
    (r) => {
      if (r.int(0, 1) === 0) { const N = r.int(4, 9), rr = r.int(1, N - 1), v = N - rr, giuste = I(v);
        return { u: '5.6.5', d: 'In un programma i lock hanno rango da 1 a ' + N + ', e vanno acquisiti per rango crescente. Un thread possiede soltanto il lock di rango ' + rr + '. Quanti lock può ancora richiedere senza alcun rilascio?', segnaposto: 'Un numero', giuste,
          ok: 'Sono ammessi i ranghi maggiori di ' + rr + ': ' + N + ' − ' + rr + ' = ' + v + '.',
          diagnosi: DIAG(giuste, [
            rr > 1 ? { se: I(rr - 1), msg: 'Questi sono i lock di rango inferiore, ormai esclusi.' } : null,
            { se: I(N - 1), msg: 'Sono ammessi soltanto i ranghi maggiori di ' + rr + '.' },
            { se: I(N), msg: 'Il lock di rango ' + rr + ' è già in suo possesso, e quelli di rango inferiore sono esclusi.' }
          ]),
          altro: 'Il numero è diverso. Si contino i ranghi maggiori di quello posseduto.',
          indizi: ['Il thread possiede il rango ' + rr + '.', 'Può richiedere i ranghi da ' + (rr + 1) + ' a ' + N + '.', N + ' − ' + rr + ' = ' + v + '.'],
          svolgimento: ['Rango posseduto: ' + rr + '.', 'Ranghi ammessi: da ' + (rr + 1) + ' a ' + N + '.', 'Lock che può richiedere: ' + v + '.'] }; }
      const n = r.scegli([['X', 'Y'], ['M', 'N'], ['R', 'S'], ['P', 'Q']]), opp = r.int(0, 1) === 0, alt = r.int(0, 2) > 0, blocco = opp && alt;
      const fb = blocco ? 'Dopo la prima acquisizione ciascuno possiede il lock che l’altro richiede per secondo.' : !opp ? 'Con il medesimo ordine, il thread che giunge per secondo si blocca sul primo lock senza possedere alcun lock.' : 'A rilascia entrambi i lock prima dell’inizio di B, e B li trova liberi.';
      return { u: '5.6.5', d: 'Il thread A acquisisce ' + n[0] + ' e poi ' + n[1] + '. Il thread B acquisisce ' + (opp ? n[1] + ' e poi ' + n[0] : n[0] + ' e poi ' + n[1]) + '. ' + (alt ? 'Le acquisizioni si alternano: la prima di A, la prima di B, la seconda di A, la seconda di B.' : 'A completa il lavoro e rilascia entrambi i lock prima dell’inizio di B.') + ' Ciascuno rilascia i lock soltanto dopo averli ottenuti entrambi. Che cosa accade?', guida: 'Si scelga la risposta.', o: r.mescola([
        { t: 'A e B completano entrambi', ok: !blocco, fb },
        { t: 'A e B restano bloccati indefinitamente', ok: blocco, fb },
        { t: 'Soltanto A completa, e B resta bloccato indefinitamente', ok: false, fb }]) };
    }
  ] });
})();
