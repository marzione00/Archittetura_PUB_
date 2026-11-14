'use strict';
/* Prova del capitolo 5.6: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const LET = (da, n) => { const l = []; for (let j = 0; j < n; j++) l.push('L' + (da + j)); return l; };

  SL.registraProva('5.6', { domande: [
    // 5.6.1 · vuoti, pieni oppure permessi in transito
    (r) => {
      if (r.int(0, 2) === 0) { const cap = r.int(4, 12), tr = r.int(0, 2), V = r.int(0, cap - tr), Pn = cap - tr - V, giuste = I(tr);
        return { u: '5.6.1', d: 'Un buffer limitato ha ' + cap + ' posti. In un certo istante il semaforo vuoti vale ' + V + ' e il semaforo pieni vale ' + Pn + '. Quanti permessi sono in transito?', segnaposto: 'Un numero', giuste,
          ok: cap + ' − ' + V + ' − ' + Pn + ' = ' + tr + '.',
          diagnosi: DIAG(giuste, [
            { se: I(V + Pn), msg: 'Questa è la somma dei due semafori. I permessi in transito sono ciò che manca per arrivare a ' + cap + '.' },
            { se: I(cap), msg: 'Questa è la capacità. Togli i permessi contati dai due semafori.' }
          ]),
          altro: 'Il numero è diverso. Usa l’invariante: vuoti, pieni e permessi in transito, sommati, danno la capacità.',
          indizi: ['La capacità è ' + cap + '.', 'vuoti + pieni = ' + (V + Pn) + '.', cap + ' − ' + (V + Pn) + ' = ' + tr + '.'],
          svolgimento: ['Capacità: ' + cap + '.', 'Vuoti più pieni: ' + (V + Pn) + '.', 'In transito: ' + tr + '.'] }; }
      const cap = r.int(4, 12), a = r.int(1, cap - 1), b = r.int(0, a), t = r.int(0, 1), cosa = r.scegli(['vuoti', 'pieni']);
      const vuoti = cap - a + b - t, pieni = a - b, v = cosa === 'vuoti' ? vuoti : pieni, giuste = I(v);
      return { u: '5.6.1', d: 'Un buffer limitato ha ' + cap + ' posti, all’inizio tutti vuoti. Sono stati completati ' + a + (a === 1 ? ' inserimento' : ' inserimenti') + ' e ' + b + (b === 1 ? ' prelievo.' : ' prelievi.') + (t ? ' Un produttore ha inoltre prenotato un posto con wait(vuoti), e deve ancora eseguire la sua signal(pieni).' : ' Nessuna operazione è in corso.') + ' Quanto vale il semaforo ' + cosa + '?', segnaposto: 'Un numero', giuste,
        ok: cosa === 'vuoti' ? cap + ' − ' + a + ' + ' + b + (t ? ' − 1' : '') + ' = ' + vuoti + '.' : a + ' − ' + b + ' = ' + pieni + (t ? '. Il dato in lavorazione deve ancora essere pubblicato.' : '.'),
        diagnosi: DIAG(giuste, cosa === 'vuoti' ? [
          t ? { se: I(cap - a + b), msg: 'Manca il posto prenotato: la wait(vuoti) del produttore ha già tolto un permesso.' } : null,
          b > 0 ? { se: I(cap - a - t), msg: 'Ogni prelievo completato restituisce un permesso a vuoti.' } : null,
          { se: I(pieni), msg: 'Questo è il valore di pieni. La domanda riguarda i posti liberi.' }
        ] : [
          t ? { se: I(pieni + 1), msg: 'Il dato in lavorazione entrerà nel conto soltanto con la signal(pieni).' } : null,
          b > 0 ? { se: I(a), msg: 'Ogni prelievo completato ha tolto un permesso a pieni.' } : null,
          { se: I(vuoti), msg: 'Questo è il valore di vuoti. La domanda riguarda i dati pubblicati.' }
        ]),
        altro: 'Il valore è diverso. Si seguano i permessi: ogni inserimento ne sposta uno da vuoti a pieni, ogni prelievo fa il contrario.',
        indizi: ['All’inizio vuoti vale ' + cap + ' e pieni vale 0.', 'Dopo ' + a + (a === 1 ? ' inserimento' : ' inserimenti') + ' e ' + b + (b === 1 ? ' prelievo' : ' prelievi') + ': vuoti ' + (cap - a + b) + ', pieni ' + pieni + '.', t ? 'La prenotazione in corso toglie un permesso a vuoti: ' + vuoti + '. Il semaforo pieni resta ' + pieni + '.' : 'Nessun permesso è in transito.'],
        svolgimento: ['Vuoti: ' + vuoti + '.', 'Pieni: ' + pieni + '.', 'In transito: ' + t + '.'] };
    },
    // 5.6.2 · esito secondo l'ordine di acquisizione, oppure produttori ancora bloccati
    (r) => {
      if (r.int(0, 2) === 0) { const c = r.int(1, 4), m = r.int(2, 5), j = r.int(1, m - 1), v = m - j, giuste = I(v);
        return { u: '5.6.2', d: 'Un buffer limitato ha ' + c + (c === 1 ? ' posto, pieno. ' : ' posti, tutti pieni. ') + m + ' produttori, che chiedono prima il permesso e poi il mutex, eseguono wait(vuoti) e si bloccano. Poi un consumatore completa ' + j + (j === 1 ? ' prelievo, compresa la signal(vuoti).' : ' prelievi, comprese le signal(vuoti).') + ' Quanti produttori restano bloccati?', segnaposto: 'Un numero', giuste,
          ok: 'Ogni signal(vuoti) consegna un permesso al primo produttore in coda: ' + m + ' − ' + j + ' = ' + v + '.',
          diagnosi: DIAG(giuste, [
            { se: I(j), msg: 'Questi sono i produttori sbloccati. La domanda riguarda quelli rimasti in coda.' },
            { se: I(m), msg: 'Ogni prelievo completato sblocca un produttore.' },
            { se: I(0), msg: 'I permessi restituiti sono ' + j + ', e i produttori in coda erano ' + m + '.' }
          ]),
          altro: 'Il numero è diverso. Conta un produttore sbloccato per ogni signal(vuoti).',
          indizi: ['In coda su vuoti ci sono ' + m + ' produttori.', 'I prelievi completati sono ' + j + '.', m + ' − ' + j + ' = ' + v + '.'],
          svolgimento: ['Produttori in coda: ' + m + '.', 'Permessi consegnati: ' + j + '.', 'Ancora bloccati: ' + v + '.'] }; }
      const c = r.int(1, 4), pieno = r.int(0, 2) > 0, vm = r.int(0, 1) === 0, e = !pieno ? 0 : vm ? 1 : 2;
      const fb = e === 0 ? 'C’è un posto libero: la wait(vuoti) trova un permesso, e nessuno resta in attesa.' : e === 1 ? 'P si blocca su vuoti senza possedere il mutex. C preleva, e la sua signal(vuoti) sblocca P.' : 'P si blocca su vuoti tenendo il mutex. C, per prelevare, ha bisogno di quel mutex.';
      return { u: '5.6.2', d: 'Un buffer limitato ha ' + c + (c === 1 ? ' posto' : ' posti') + (pieno ? ' ed è pieno.' : ' e ha un posto libero.') + ' Il produttore P esegue ' + (vm ? 'wait(vuoti) e poi lock(mutex).' : 'lock(mutex) e poi wait(vuoti).') + ' Un consumatore C preleverà appena troverà un dato pubblicato. Che cosa accade?', guida: 'Si scelga la risposta.', o: r.mescola([
        { t: 'P inserisce subito il suo dato', ok: e === 0, fb },
        { t: 'P inserisce il suo dato dopo un prelievo di C', ok: e === 1, fb },
        { t: 'P e C restano bloccati per sempre', ok: e === 2, fb }]) };
    },
    // 5.6.3 · consumatori che tornano ad attendere, oppure elementi rimasti
    (r) => {
      const c = r.int(2, 6), d = r.int(1, 6), cosa = r.int(0, 1), att = Math.max(0, c - d), resto = Math.max(0, d - c), v = cosa === 0 ? att : resto, giuste = I(v);
      return { u: '5.6.3', d: 'Una coda è vuota, e ' + c + ' consumatori dormono sulla stessa condizione. Un produttore deposita ' + d + (d === 1 ? ' elemento' : ' elementi') + ' e li risveglia tutti. Ogni consumatore, ottenuto il mutex, ricontrolla il predicato in un ciclo e, se lo trova vero, rimuove un elemento. ' + (cosa === 0 ? 'Quanti consumatori tornano ad attendere?' : 'Quanti elementi restano in coda?'), segnaposto: 'Un numero', giuste,
        ok: 'Trovano il predicato vero ' + Math.min(c, d) + (Math.min(c, d) === 1 ? ' consumatore' : ' consumatori') + '. Tornano ad attendere in ' + att + ', e in coda ' + (resto === 1 ? 'resta 1 elemento.' : 'restano ' + resto + ' elementi.'),
        diagnosi: DIAG(giuste, cosa === 0 ? [
          { se: I(Math.min(c, d)), msg: 'Questi sono i consumatori che trovano un elemento. La domanda riguarda gli altri.' },
          { se: I(c), msg: 'Chi ottiene il mutex mentre la coda contiene elementi trova il predicato vero.' },
          { se: I(resto), msg: 'Questo è il numero degli elementi rimasti in coda.' }
        ] : [
          { se: I(Math.min(c, d)), msg: 'Questi sono gli elementi rimossi. La domanda riguarda quelli rimasti.' },
          { se: I(d), msg: 'Ogni consumatore che trova il predicato vero rimuove un elemento.' },
          { se: I(att), msg: 'Questo è il numero dei consumatori tornati ad attendere.' }
        ]),
        altro: 'Il numero è diverso. Fai passare i consumatori uno per volta: ciascuno rimuove un elemento, se ne trova.',
        indizi: ['Gli elementi sono ' + d + ', i consumatori ' + c + '.', 'Trovano un elemento in ' + Math.min(c, d) + '.', cosa === 0 ? c + ' − ' + Math.min(c, d) + ' = ' + att + '.' : d + ' − ' + Math.min(c, d) + ' = ' + resto + '.'],
        svolgimento: ['Rimozioni: ' + Math.min(c, d) + '.', 'Consumatori che tornano ad attendere: ' + att + '.', 'Elementi rimasti: ' + resto + '.'] };
    },
    // 5.6.4 · lettori davanti allo scrittore, oppure chi entra dopo uno scrittore
    (r) => {
      if (r.int(0, 1) === 0) { const lett = r.int(0, 1) === 0, k = r.int(1, 6), v = lett ? k + 1 : 1, giuste = I(v);
        return { u: '5.6.4', d: 'L1 sta leggendo, e uno scrittore S chiede di entrare. Poi ' + (k === 1 ? 'arriva un altro lettore' : 'arrivano altri ' + k + ' lettori, ciascuno prima che il precedente sia uscito') + '. La politica di ammissione è: ' + (lett ? 'precedenza ai lettori' : 'ordine di arrivo') + '. Quanti lettori in tutto, contando L1, accedono ai dati prima di S?', segnaposto: 'Un numero', giuste,
          ok: lett ? 'Ogni nuovo lettore trova una lettura in corso ed entra: 1 + ' + k + ' = ' + v + '.' : 'I nuovi lettori si accodano dietro S. Prima di lui legge soltanto L1.',
          diagnosi: DIAG(giuste, [
            { se: I(lett ? 1 : k + 1), msg: lett ? 'Questo accadrebbe con l’ordine di arrivo. Con la precedenza ai lettori i nuovi arrivati entrano subito.' : 'Questo accadrebbe con la precedenza ai lettori. Qui i nuovi arrivati si accodano dietro S.' },
            { se: I(lett ? k : 0), msg: lett ? 'Conta anche L1, che stava già leggendo.' : 'L1 stava già leggendo quando S è arrivato.' }
          ]),
          altro: 'Il numero è diverso. Si stabilisca per ogni nuovo lettore se entra subito oppure si accoda dietro S.',
          indizi: ['L1 è già dentro.', lett ? 'Ogni nuovo lettore entra subito, davanti a S.' : 'Ogni nuovo lettore si accoda dietro S.', 'Lettori prima di S: ' + v + '.'],
          svolgimento: ['Lettore iniziale: 1.', 'Nuovi lettori entrati prima di S: ' + (lett ? k : 0) + '.', 'Totale: ' + v + '.'] }; }
      const g = r.int(0, 3), h = r.int(1, 2), fila = ['S1'].concat(LET(2, g), ['S2'], LET(2 + g, h)), v = g > 0 ? g : 1, giuste = I(v);
      return { u: '5.6.4', d: 'La politica di ammissione rispetta l’ordine di arrivo. L1 sta leggendo. Arrivano, in quest’ordine: ' + fila.join(', ') + '. Escono prima L1 e poi S1. Quanti thread accedono ai dati subito dopo l’uscita di S1?', segnaposto: 'Un numero', giuste,
        ok: g > 0 ? 'Dopo S1 la fila comincia con ' + (g === 1 ? 'un lettore, che entra.' : g + ' lettori consecutivi, che entrano insieme.') + ' S2 aspetta.' : 'Dopo S1 il primo della fila è S2, che entra da solo.',
        diagnosi: DIAG(giuste, g > 0 ? [
          { se: I(g + 1), msg: 'S2 è uno scrittore, e uno scrittore entra soltanto da solo.' },
          { se: I(g + h), msg: 'I lettori arrivati dopo S2 restano in fila dietro di lui.' },
          g > 1 ? { se: I(1), msg: 'I lettori consecutivi in testa alla fila entrano insieme.' } : null
        ] : [
          { se: I(h), msg: 'Quei lettori sono arrivati dopo S2, e aspettano dietro di lui.' },
          { se: I(h + 1), msg: 'Uno scrittore entra soltanto da solo.' },
          { se: I(0), msg: 'I dati sono liberi, e in testa alla fila c’è S2.' }
        ]),
        altro: 'Il numero è diverso. Si scriva la fila dopo l’uscita di S1, e si faccia entrare chi sta in testa: tutti i lettori consecutivi, oppure un solo scrittore.',
        indizi: ['Dopo l’uscita di S1 la fila è: ' + fila.slice(1).join(', ') + '.', g > 0 ? 'In testa ci sono ' + g + (g === 1 ? ' lettore.' : ' lettori consecutivi.') : 'In testa c’è uno scrittore.', 'Entrano in ' + v + '.'],
        svolgimento: ['Fila: ' + fila.slice(1).join(', ') + '.', 'Entrano: ' + (g > 0 ? LET(2, g).join(', ') : 'S2') + '.', 'Numero: ' + v + '.'] };
    },
    // 5.6.5 · ranghi ancora ammessi, oppure esito di due ordini di acquisizione
    (r) => {
      if (r.int(0, 1) === 0) { const N = r.int(4, 9), rr = r.int(1, N - 1), v = N - rr, giuste = I(v);
        return { u: '5.6.5', d: 'In un programma i lock hanno rango da 1 a ' + N + ', e vanno acquisiti per rango crescente. Un thread possiede soltanto il lock di rango ' + rr + '. Quanti lock può ancora chiedere senza rilasciare nulla?', segnaposto: 'Un numero', giuste,
          ok: 'Sono ammessi i ranghi maggiori di ' + rr + ': ' + N + ' − ' + rr + ' = ' + v + '.',
          diagnosi: DIAG(giuste, [
            rr > 1 ? { se: I(rr - 1), msg: 'Questi sono i lock di rango più basso, ormai esclusi.' } : null,
            { se: I(N - 1), msg: 'Sono ammessi soltanto i ranghi maggiori di ' + rr + '.' },
            { se: I(N), msg: 'Il lock di rango ' + rr + ' è già suo, e quelli di rango più basso sono esclusi.' }
          ]),
          altro: 'Il numero è diverso. Conta i ranghi maggiori di quello posseduto.',
          indizi: ['Il thread possiede il rango ' + rr + '.', 'Può chiedere i ranghi da ' + (rr + 1) + ' a ' + N + '.', N + ' − ' + rr + ' = ' + v + '.'],
          svolgimento: ['Rango posseduto: ' + rr + '.', 'Ranghi ammessi: da ' + (rr + 1) + ' a ' + N + '.', 'Lock che può chiedere: ' + v + '.'] }; }
      const n = r.scegli([['X', 'Y'], ['M', 'N'], ['R', 'S'], ['P', 'Q']]), opp = r.int(0, 1) === 0, alt = r.int(0, 2) > 0, blocco = opp && alt;
      const fb = blocco ? 'Dopo la prima acquisizione ciascuno possiede il lock che l’altro chiede per secondo.' : !opp ? 'Con lo stesso ordine, chi arriva secondo si ferma sul primo lock senza possedere nulla.' : 'A rilascia tutto prima che B cominci, e B trova entrambi i lock liberi.';
      return { u: '5.6.5', d: 'Il thread A acquisisce ' + n[0] + ' e poi ' + n[1] + '. Il thread B acquisisce ' + (opp ? n[1] + ' e poi ' + n[0] : n[0] + ' e poi ' + n[1]) + '. ' + (alt ? 'Le acquisizioni si alternano: la prima di A, la prima di B, la seconda di A, la seconda di B.' : 'A completa il lavoro e rilascia tutto prima che B cominci.') + ' Ciascuno rilascia i lock soltanto dopo averli ottenuti entrambi. Che cosa accade?', guida: 'Si scelga la risposta.', o: r.mescola([
        { t: 'A e B completano entrambi', ok: !blocco, fb },
        { t: 'A e B restano bloccati per sempre', ok: blocco, fb },
        { t: 'Completa soltanto A, e B resta bloccato per sempre', ok: false, fb }]) };
    }
  ] });
})();
