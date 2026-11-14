'use strict';
/* Prova del capitolo 4.1: una domanda per unità. */
(() => {
  const I = SL.scritture.intero, ESA = SL.scritture.esa, H = SL.kern.H;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const ORD = ['', 'prima', 'seconda', 'terza', 'quarta', 'quinta', 'sesta', 'settima', 'ottava', 'nona', 'decima'];

  SL.registraProva('4.1', { domande: [
    // 4.1.1 · l'indirizzo di ripresa dopo il timer o dopo una pagina assente
    (r) => {
      const pc = 0x1000 + 4 * r.int(1, 900), irq = r.int(0, 1) === 1, v = irq ? pc + 4 : pc, giuste = ESA(v, 4);
      return { u: '4.1.1', d: 'Un’istruzione di 4 byte ha inizio all’indirizzo ' + H(pc) + '. ' + (irq ? 'Durante la sua esecuzione si verifica un interrupt del timer' : 'L’istruzione incontra una pagina assente') + '. Da quale indirizzo riprende il programma dopo il gestore? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste,
        ok: irq ? 'L’istruzione è completata, e il programma riprende dalla seguente: ' + H(pc) + ' + 4 = ' + H(v) + '.' : 'L’istruzione è rimasta incompiuta, e va ripetuta dall’inizio.',
        diagnosi: DIAG(giuste, [
          { se: ESA(irq ? pc : pc + 4, 4), msg: irq ? 'Dopo un interrupt l’istruzione in corso è già stata completata. Il programma riprende dalla seguente.' : 'Dopo una pagina assente l’istruzione interrotta va ripetuta.' },
          { se: ESA(pc + 1, 4), msg: 'L’istruzione occupa 4 byte.' }
        ]),
        altro: 'Il valore è diverso. Si stabilisca se l’istruzione è stata completata, poi si esegua la somma in esadecimale.',
        indizi: [irq ? 'Il processore completa l’istruzione prima di servire il timer.' : 'La lettura è fallita, e l’istruzione è incompiuta.', irq ? 'Il programma riprende dall’istruzione seguente.' : 'Il programma riprende dalla medesima istruzione.', irq ? H(pc) + ' + 4.' : 'L’indirizzo è ' + H(pc) + '.'],
        svolgimento: [irq ? 'Evento: interrupt, accettato dopo l’istruzione.' : 'Evento: pagina assente, durante l’istruzione.', irq ? 'Ripresa dalla seguente.' : 'Ripresa dalla medesima istruzione.', 'RIP = ' + H(v) + '.'] };
    },
    // 4.1.2 · classificare un evento, oppure trovare l'indirizzo salvato
    (r) => {
      if (r.int(0, 2) > 0) {
        const CASI = [['un’istruzione `div` divide per zero', 0], ['un’istruzione legge un dato da una pagina assente', 0], ['il programma esegue una `int3` inserita da un programma di diagnosi', 1], ['la tastiera segnala la pressione di un tasto', 2], ['il timer segnala la scadenza di un intervallo', 2], ['la scheda di rete segnala l’arrivo di nuovi dati', 2], ['un circuito di controllo segnala un guasto dell’hardware che ha compromesso lo stato del processore', 3]];
        const NOMI = ['Fault', 'Trap', 'Interrupt', 'Abort'], PERCHE = ['Un fault è rilevato durante un’istruzione, che resta incompiuta.', 'Una trap è segnalata dopo l’istruzione che la provoca.', 'Un interrupt proviene dall’esterno, da un timer o da una periferica.', 'Un abort segnala un guasto grave, dopo il quale la ripresa è priva di garanzie.'];
        const c = r.scegli(CASI);
        return { u: '4.1.2', d: 'A quale classe appartiene questo evento: ' + c[0] + '?', guida: 'Si scelga la risposta.', o: [{ t: NOMI[c[1]], ok: true, fb: PERCHE[c[1]] }].concat([0, 1, 2, 3].filter((k) => k !== c[1]).map((k) => ({ t: NOMI[k], fb: PERCHE[k] }))) };
      }
      const pc = 0x2000 + r.int(1, 2000), caso = r.int(0, 2), L = caso === 1 ? 1 : r.int(2, 7), v = caso === 0 ? pc : pc + L, giuste = ESA(v, 4);
      const frase = caso === 0 ? 'Essa provoca un fault' : caso === 1 ? 'È una `int3`, che provoca una trap' : 'Durante la sua esecuzione si verifica un interrupt';
      return { u: '4.1.2', d: 'Un’istruzione di ' + (L === 1 ? 'un' : L) + ' byte ha inizio all’indirizzo ' + H(pc) + '. ' + frase + '. Quale indirizzo è salvato per la ripresa? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste,
        ok: caso === 0 ? 'Dopo un fault l’istruzione è incompiuta, e l’indirizzo salvato è il suo.' : 'L’istruzione è completata, e l’indirizzo salvato è quello della seguente: ' + H(pc) + ' + ' + L + ' = ' + H(v) + '.',
        diagnosi: DIAG(giuste, [
          { se: ESA(caso === 0 ? pc + L : pc, 4), msg: caso === 0 ? 'Questo è l’indirizzo della seguente. Un fault lascia l’istruzione incompiuta.' : 'Questo è l’indirizzo dell’istruzione stessa, che in questo caso è stata completata.' },
          { se: ESA(pc + 4, 4), msg: 'L’istruzione occupa ' + (L === 1 ? 'un byte' : L + ' byte') + '.' }
        ]),
        altro: 'Il valore è diverso. Si stabilisca se l’istruzione è stata completata, e in tal caso si aggiunga la sua lunghezza.',
        indizi: [caso === 0 ? 'Un fault è rilevato durante l’istruzione.' : caso === 1 ? 'Una trap è segnalata dopo l’istruzione.' : 'Un interrupt è accettato dopo l’istruzione in corso.', caso === 0 ? 'L’istruzione andrà ripetuta.' : 'Il programma riprende dalla seguente.', caso === 0 ? 'L’indirizzo è ' + H(pc) + '.' : H(pc) + ' + ' + L + '.'],
        svolgimento: ['Classe: ' + ['fault', 'trap', 'interrupt'][caso] + '.', caso === 0 ? 'Istruzione incompiuta.' : 'Istruzione completata, lunga ' + L + (L === 1 ? ' byte.' : ' byte.'), 'Indirizzo salvato: ' + H(v) + '.'] };
    },
    // 4.1.3 · l'indirizzo di una voce della IDT, oppure il controllo dei privilegi
    (r) => {
      if (r.int(0, 1) === 0) {
        const base = r.scegli([0x1000, 0x4000, 0x8000, 0xA000]), v = r.int(2, 120), a = base + 16 * v, giuste = ESA(a, 4);
        return { u: '4.1.3', d: 'Una IDT ha inizio all’indirizzo ' + H(base) + ', con voci da 16 byte. A quale indirizzo si trova la voce del vettore ' + v + '? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste,
          ok: 'La voce dista ' + v + ' × 16 = ' + (16 * v) + ' byte, cioè ' + H(16 * v) + ': l’indirizzo è ' + H(a) + '.',
          diagnosi: DIAG(giuste, [
            { se: ESA(base + v, 4), msg: 'Il vettore va moltiplicato per 16, la lunghezza di una voce.' },
            { se: ESA(base + 8 * v, 4), msg: 'Le voci occupano 16 byte, il doppio di 8.' },
            { se: ESA(base + 16 * (v + 1), 4), msg: 'I vettori si contano da zero: la voce ' + v + ' è preceduta da ' + v + ' voci.' },
            { se: [String(base.toString(16)) + String(16 * v)], msg: 'Il prodotto va scritto in esadecimale prima di sommarlo.' }
          ]),
          altro: 'Il valore è diverso. Si moltiplichi il vettore per 16, si scriva il prodotto in esadecimale e lo si sommi all’inizio della tabella.',
          indizi: ['La voce ' + v + ' è preceduta da ' + v + ' voci da 16 byte.', v + ' × 16 = ' + (16 * v) + ', cioè ' + H(16 * v) + '.', H(base) + ' + ' + H(16 * v) + '.'],
          svolgimento: ['Distanza: ' + v + ' × 16 = ' + (16 * v) + ' byte.', (16 * v) + ' = ' + H(16 * v) + '.', 'Indirizzo: ' + H(base) + ' + ' + H(16 * v) + ' = ' + H(a) + '.'] };
      }
      const sw = r.int(0, 2) > 0, v = r.int(32, 200), dpl = r.scegli([0, 3]), ok = !sw || dpl === 3;
      return { u: '4.1.3', d: 'È in esecuzione un programma di livello 3. ' + (sw ? 'Il programma esegue `int ' + v + '`' : 'Una periferica richiede l’intervento sul vettore ' + v) + '. La voce ' + v + ' della IDT ha DPL ' + dpl + '. Come si comporta il processore?', guida: 'Si scelga la risposta.', o: [
        { t: 'Entra nel gestore indicato dalla voce', ok, fb: ok ? (sw ? 'La condizione CPL ≤ DPL diviene 3 ≤ 3, che è vera.' : 'Il DPL limita soltanto l’istruzione `int`. La richiesta di una periferica entra in ogni caso.') : 'Occorre CPL ≤ DPL, e 3 ≤ 0 è falso.' },
        { t: 'Rifiuta, e solleva #GP', ok: !ok, fb: !ok ? 'La condizione CPL ≤ DPL diviene 3 ≤ 0, che è falsa.' : sw ? 'Con DPL 3 la voce è disponibile anche ai programmi di livello 3.' : 'Il confronto fra CPL e DPL si applica soltanto alle richieste eseguite con `int`.' },
        { t: 'La richiesta è ignorata e l’esecuzione prosegue', fb: sw ? 'Un’istruzione `int` produce sempre un ingresso oppure un’eccezione.' : 'La richiesta di una periferica è accettata al confine fra due istruzioni.' }] };
    },
    // 4.1.4 · lo stato visto dal gestore dopo un fault nella pipeline
    (r) => {
      const n = r.int(6, 10), k = r.int(2, n), c = r.int(1, 3), reg = r.int(5, 60), base = r.scegli([0x1000, 0x2000, 0x3000]), cosa = r.int(0, 2), val = reg + c * (k - 1), ind = base + 4 * (k - 1);
      const testa = ORD[n] ? n + ' istruzioni consecutive di 4 byte hanno inizio a ' + H(base) + '. Ciascuna somma ' + c + ' a un registro che vale ' + reg + '. Sono tutte nella pipeline quando la ' + ORD[k] + ' incontra un fault. ' : '';
      if (cosa === 0) { const giuste = I(val); return { u: '4.1.4', d: testa + 'Quale valore del registro trova il gestore?', segnaposto: 'Un numero', giuste,
        ok: 'Le ' + (k - 1) + ' istruzioni che precedono il fault sono ritirate: ' + reg + ' + ' + (k - 1) + ' × ' + c + ' = ' + val + '.',
        diagnosi: DIAG(giuste, [
          { se: I(reg + c * k), msg: 'L’istruzione con il fault è incompiuta, e il suo contributo manca.' },
          { se: I(reg + c * n), msg: 'Le istruzioni successive sono scartate insieme ai loro risultati provvisori.' },
          { se: I(reg), msg: 'Le istruzioni che precedono il fault sono state ritirate, e i loro effetti restano.' },
          { se: I(reg + (k - 1)), msg: 'Ogni istruzione somma ' + c + '.' }
        ]),
        altro: 'Il numero è diverso. Si contino soltanto le istruzioni che precedono quella con il fault.',
        indizi: ['Le istruzioni ritirate sono ' + (k - 1) + '.', 'Ciascuna somma ' + c + '.', reg + ' + ' + (k - 1) + ' × ' + c + '.'],
        svolgimento: ['Istruzioni ritirate: ' + (k - 1) + '.', 'Incremento: ' + (k - 1) + ' × ' + c + ' = ' + (c * (k - 1)) + '.', 'Registro: ' + reg + ' + ' + (c * (k - 1)) + ' = ' + val + '.'] }; }
      if (cosa === 1) { const giuste = ESA(ind, 4); return { u: '4.1.4', d: testa + 'Quale indirizzo è salvato? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste,
        ok: 'La ' + ORD[k] + ' è preceduta da ' + (k - 1) + ' istruzioni: ' + (k - 1) + ' × 4 = ' + (4 * (k - 1)) + ' byte, e l’indirizzo è ' + H(ind) + '.',
        diagnosi: DIAG(giuste, [
          { se: ESA(ind + 4, 4), msg: 'Questo è l’indirizzo dell’istruzione seguente. Dopo un fault il programma riparte da quella che ha fallito.' },
          { se: ESA(base, 4), msg: 'Le istruzioni ritirate hanno effetti definitivi, e la loro ripetizione li raddoppierebbe.' },
          { se: ESA(base + k - 1, 4), msg: 'Ogni istruzione occupa 4 byte.' }
        ]),
        altro: 'Il valore è diverso. Occorre l’indirizzo della ' + ORD[k] + ' istruzione.',
        indizi: ['La ' + ORD[k] + ' è preceduta da ' + (k - 1) + ' istruzioni.', (k - 1) + ' × 4 = ' + (4 * (k - 1)) + ', cioè ' + H(4 * (k - 1)) + '.', H(base) + ' + ' + H(4 * (k - 1)) + '.'],
        svolgimento: ['Istruzioni che precedono il fault: ' + (k - 1) + '.', 'Distanza: ' + (4 * (k - 1)) + ' byte = ' + H(4 * (k - 1)) + '.', 'Indirizzo salvato: ' + H(ind) + '.'] }; }
      const giuste = I(n - k).concat(n === k ? ['nessuna', 'zero'] : []);
      return { u: '4.1.4', d: testa + 'Quante istruzioni successive a quella con il fault sono scartate?', segnaposto: 'Un numero', giuste,
        ok: 'Dopo la ' + ORD[k] + ' ne restano ' + n + ' − ' + k + ' = ' + (n - k) + ', tutte scartate.',
        diagnosi: DIAG(giuste, [
          { se: I(k - 1), msg: 'Queste sono le istruzioni precedenti, che sono ritirate.' },
          { se: I(n - k + 1), msg: 'La domanda riguarda soltanto le successive, esclusa quella con il fault.' },
          { se: I(n), msg: 'Le istruzioni che precedono il fault restano valide.' }
        ]),
        altro: 'Il numero è diverso. Si contino le istruzioni che nel programma seguono quella con il fault.',
        indizi: ['Le istruzioni sono ' + n + '.', 'Il fault riguarda la ' + ORD[k] + '.', n + ' − ' + k + '.'],
        svolgimento: ['Istruzioni complessive: ' + n + '.', 'Fino a quella con il fault: ' + k + '.', 'Successive, scartate: ' + (n - k) + '.'] };
    },
    // 4.1.5 · la cima della pila alla fine dell'ingresso
    (r) => {
      const top = 0x2000 + 8 * r.int(0, 200), ev = r.int(0, 2), cod = ev === 0, n = r.int(3, 15), base = top - top % 16, hw = 40 + (cod ? 8 : 0), sw = 8 * (n + (cod ? 0 : 1)), fine = base - hw - sw, cosa = r.int(0, 2);
      const testa = 'La cima della pila del kernel è a ' + H(top) + '. Si verifica ' + ['una pagina assente, che ha il codice di errore', 'una divisione per zero, priva di codice di errore', 'un interrupt del timer, privo di codice di errore'][ev] + '. Lo stub uniforma la pila e salva ' + n + ' registri generali. ';
      if (cosa === 0) { const giuste = ESA(fine, 4); return { u: '4.1.5', d: testa + 'Quanto vale RSP al termine dello stub? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste,
        ok: 'Cima allineata ' + H(base) + ', meno ' + hw + ' byte del processore e ' + sw + ' dello stub: ' + H(fine) + '.',
        diagnosi: DIAG(giuste, [
          { se: ESA(base - hw, 4), msg: 'Dopo il processore interviene lo stub, che deposita altri ' + sw + ' byte.' },
          top !== base ? { se: ESA(top - hw - sw, 4), msg: 'Prima di depositare il frame il processore allinea la cima a un multiplo di 16.' } : null,
          { se: ESA(base - 40 - 8 * n, 4), msg: 'Fra i cinque campi e i registri è presente un’ulteriore cella: il codice di errore, oppure lo zero che ne occupa il posto.' },
          { se: ESA(base + hw + sw, 4), msg: 'La pila cresce verso gli indirizzi bassi: RSP diminuisce.' }
        ]),
        altro: 'Il valore è diverso. Si allinei la cima, poi si sottraggano i byte del processore e quelli dello stub, in esadecimale.',
        indizi: ['Cima allineata: ' + H(base) + '.', 'Il processore deposita ' + hw + ' byte, lo stub ' + sw + '.', H(base) + ' − ' + (hw + sw) + ', cioè − ' + H(hw + sw) + '.'],
        svolgimento: ['Allineamento: ' + H(top) + ' → ' + H(base) + '.', 'Processore: ' + hw + ' byte. Stub: ' + sw + ' byte.', 'RSP = ' + H(base) + ' − ' + H(hw + sw) + ' = ' + H(fine) + '.'] }; }
      if (cosa === 1) { const giuste = I(sw); return { u: '4.1.5', d: testa + 'Quanti byte ha depositato lo stub?', segnaposto: 'Un numero', giuste,
        ok: cod ? 'Soltanto i registri: ' + n + ' × 8 = ' + sw + ' byte.' : 'Lo zero di riempimento e i registri: ' + (n + 1) + ' × 8 = ' + sw + ' byte.',
        diagnosi: DIAG(giuste, [
          { se: I(cod ? sw + 8 : sw - 8), msg: cod ? 'Il codice di errore è già stato depositato dal processore, e lo stub omette lo zero.' : 'Manca lo zero che occupa il posto del codice di errore.' },
          { se: I(sw / 8), msg: 'Queste sono le celle. Ciascuna occupa 8 byte.' },
          { se: I(hw + sw), msg: 'Una parte di questi byte è stata depositata dal processore.' }
        ]),
        altro: 'Il numero è diverso. Si contino le celle depositate dallo stub e si moltiplichi per 8.',
        indizi: [cod ? 'Il codice di errore è già sulla pila.' : 'Lo stub deposita uno zero in luogo del codice.', 'Poi salva ' + n + ' registri.', (cod ? n : n + 1) + ' × 8.'],
        svolgimento: ['Celle dello stub: ' + (cod ? n : n + 1) + '.', 'Ogni cella: 8 byte.', 'Byte: ' + sw + '.'] }; }
      const giuste = I(hw);
      return { u: '4.1.5', d: testa + 'Quanti byte ha depositato il processore, senza contare l’allineamento?', segnaposto: 'Un numero', giuste,
        ok: cod ? 'Cinque valori del frame e il codice di errore: 6 × 8 = 48 byte.' : 'I cinque valori del frame: 5 × 8 = 40 byte.',
        diagnosi: DIAG(giuste, [
          { se: I(cod ? 40 : 48), msg: cod ? 'La pagina assente ha un codice di errore, che il processore deposita dopo il frame.' : 'Questo evento è privo di codice di errore. Lo zero è depositato dallo stub.' },
          { se: I(hw + sw), msg: 'Una parte di questi byte è stata depositata dallo stub.' },
          { se: I(hw / 8), msg: 'Queste sono le celle. Ciascuna occupa 8 byte.' }
        ]),
        altro: 'Il numero è diverso. Si contino i valori del frame, e si aggiunga il codice di errore se l’evento ne ha uno.',
        indizi: ['Il frame ha cinque valori.', cod ? 'La pagina assente aggiunge un codice di errore.' : 'Questo evento è privo di valori aggiuntivi.', (cod ? 6 : 5) + ' × 8.'],
        svolgimento: ['Frame: 5 valori.', cod ? 'Codice di errore: 1 valore.' : 'Nessun codice di errore.', 'Byte: ' + hw + '.'] };
    },
    // 4.1.6 · un registro attraverso stub e gestore
    (r) => {
      const a = r.int(10, 99), b = r.int(100, 199), x = r.int(200, 255), y = r.int(1, 9), salvati = r.scegli(['soltanto RAX', 'soltanto RBX', 'RAX e RBX', 'nessun registro']), chi = r.scegli(['RAX', 'RBX']);
      const salvo = /RAX e RBX/.test(salvati) || salvati === 'soltanto ' + chi, mio = chi === 'RAX' ? a : b, suo = chi === 'RAX' ? x : y, v = salvo ? mio : suo, giuste = I(v);
      return { u: '4.1.6', d: 'Un programma ha RAX = ' + a + ' e RBX = ' + b + ' quando si verifica un interrupt. Lo stub salva e ripristina ' + salvati + '. Il gestore scrive ' + x + ' in RAX e ' + y + ' in RBX. Quanto vale ' + chi + ' alla ripresa?', segnaposto: 'Un numero', giuste,
        ok: salvo ? chi + ' è stato salvato sulla pila e ripristinato prima di IRETQ: vale ' + mio + '.' : chi + ' è rimasto privo di copia, e conserva il valore scritto dal gestore, ' + suo + '.',
        diagnosi: DIAG(giuste, [
          { se: I(salvo ? suo : mio), msg: salvo ? 'La copia sulla pila è ripristinata prima di IRETQ, e sostituisce il valore scritto dal gestore.' : 'Nessuna copia di ' + chi + ' può riportare il valore del programma. IRETQ ripristina soltanto il frame.' },
          { se: I(chi === 'RAX' ? b : a), msg: 'Questo è il valore dell’altro registro.' },
          { se: I(0), msg: 'Nessuna operazione azzera i registri al ritorno.' }
        ]),
        altro: 'Il numero è diverso. Va stabilito se esiste una copia di ' + chi + ' da ripristinare.',
        indizi: ['Lo stub salva ' + salvati + '.', 'Il gestore scrive ' + suo + ' in ' + chi + '.', salvo ? 'La copia è ripristinata.' : 'IRETQ lascia invariati i registri generali.'],
        svolgimento: [chi + (salvo ? ' è salvato sulla pila.' : ' non è salvato.'), 'Il gestore scrive ' + suo + ' in ' + chi + '.', 'Alla ripresa ' + chi + ' = ' + v + '.'] };
    },
    // 4.1.7 · una seconda richiesta, oppure il numero di frame
    (r) => {
      if (r.int(0, 1) === 0) {
        const pa = r.int(2, 6), q = r.scegli([pa - 1, pa + 1, pa + 2, pa]), ifa = r.int(0, 1) === 1, n = ifa && q > pa;
        return { u: '4.1.7', d: 'Un gestore di priorità ' + pa + ' ha ' + (ifa ? 'riportato IF a 1' : 'lasciato IF a 0') + '. Si presenta una richiesta di priorità ' + q + '. Un numero più alto indica un’urgenza maggiore. Che cosa accade?', guida: 'Si scelga la risposta.', o: [
          { t: 'È servita immediatamente, e il gestore resta sospeso', ok: n, fb: n ? 'La priorità ' + q + ' supera ' + pa + ', e IF vale 1: le due condizioni sono soddisfatte.' : q > pa ? 'La priorità sarebbe sufficiente. Con IF a 0, tuttavia, il processore rinvia.' : 'Il controller trattiene le richieste di priorità pari o inferiore a quella in servizio.' },
          { t: 'Resta pendente fino al termine del gestore', ok: !n, fb: !n ? (q > pa ? 'Con IF a 0 il processore rinvia gli interrupt mascherabili.' : 'La priorità ' + q + ' non supera ' + pa + ', e il controller trattiene la richiesta.') : 'La priorità è maggiore e IF vale 1: nessuna condizione trattiene la richiesta.' },
          { t: 'Va perduta', fb: 'Il controller registra ogni richiesta, e la presenta non appena possibile.' }] };
      }
      const p0 = r.int(1, 3), seq = [p0 + r.int(1, 3)]; seq.push(seq[0] + r.scegli([-1, 1, 2])); seq.push(seq[1] + r.scegli([-2, 1, 3]));
      let cima = p0, frame = 1; seq.forEach((q) => { if (q > cima) { cima = q; frame++; } });
      const giuste = I(frame);
      return { u: '4.1.7', d: 'Un gestore di priorità ' + p0 + ' è in corso, e ogni gestore riporta IF a 1 dopo il prologo. Si presentano nell’ordine richieste di priorità ' + seq.join(', ') + ', ciascuna mentre è in corso il servizio accettato per ultimo. Un numero più alto indica un’urgenza maggiore. Quanti frame sono presenti sulla pila del kernel immediatamente dopo l’ultima richiesta?', segnaposto: 'Un numero', giuste,
        ok: 'Un frame per il programma sospeso, più uno per ogni richiesta accettata: ' + frame + '.',
        diagnosi: DIAG(giuste, [
          { se: I(frame - 1), msg: 'Va contato anche il primo frame, quello che riporta al programma.' },
          { se: I(4), msg: 'Una richiesta è accettata soltanto se la sua priorità supera quella del servizio in corso. Le altre restano pendenti.' },
          { se: I(1), msg: 'Con IF a 1 una richiesta più urgente sospende il gestore in corso, e deposita un nuovo frame.' }
        ]),
        altro: 'Il numero è diverso. Si parta da un frame, e se ne aggiunga uno per ogni richiesta più urgente del servizio in corso in quell’istante.',
        indizi: ['Il primo frame riporta al programma.', 'Una richiesta entra soltanto se supera la priorità in servizio.', 'Le richieste rinviate restano pendenti, senza frame.'],
        svolgimento: (() => { let c = p0, f = 1; const out = ['All’inizio: 1 frame, priorità in servizio ' + p0 + '.']; seq.forEach((q) => { if (q > c) { f++; out.push('Richiesta ' + q + ' > ' + c + ': accettata, ' + f + ' frame.'); c = q; } else out.push('Richiesta ' + q + ' ≤ ' + c + ': pendente.'); }); return out; })() };
    }
  ] });
})();
