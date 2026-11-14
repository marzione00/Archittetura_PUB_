'use strict';
/* Prova del capitolo 6.7: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const H2 = (v) => v.toString(16).toUpperCase().padStart(2, '0');
  const HEX = (v) => { const a = H2(v), b = v.toString(16).toUpperCase(); return ['0x' + a, a, a + 'h'].concat(a === b ? [] : ['0x' + b, b, b + 'h']); };
  const BIN = (v) => { const s = v.toString(2).padStart(8, '0'); return s.slice(0, 4) + ' ' + s.slice(4); };

  SL.registraProva('6.7', { domande: [
    // 6.7.1 · conti su richieste di ruoli diversi: applicate, negate, fermate, concesse
    (r) => {
      const a = r.int(2, 9), b = r.int(2, 8), c = r.int(2, 6), d = r.int(2, 9), s = r.int(2, 5), cosa = r.int(0, 3), v = [d, b, s, a + c + d][cosa], giuste = I(v);
      return { u: '6.7.1', d: 'Lo studente può leggere il fascicolo, il docente può leggerlo e modificarlo. Arrivano, con credenziali valide, ' + a + ' letture e ' + b + ' modifiche da studenti, ' + c + ' letture e ' + d + ' modifiche dal docente. Arrivano inoltre ' + s + ' richieste senza credenziali. ' + ['Quante modifiche vengono applicate al fascicolo?', 'Quante richieste vengono negate dall’autorizzazione?', 'Quante richieste si fermano all’autenticazione?', 'Quante richieste vengono concesse?'][cosa], segnaposto: 'Un numero', giuste,
        ok: 'Fermate all’autenticazione: ' + s + '. Negate dall’autorizzazione: le ' + b + ' modifiche degli studenti. Concesse: ' + a + ' + ' + c + ' + ' + d + ' = ' + (a + c + d) + ', di cui ' + d + ' modifiche applicate.',
        diagnosi: DIAG(giuste, cosa === 0 ? [
          { se: I(b + d), msg: 'Queste sono le modifiche chieste con credenziali valide. Quelle degli studenti vengono negate.' },
          { se: I(b), msg: 'Queste sono le modifiche degli studenti, che vengono negate.' },
          { se: I(a + c + d), msg: 'Queste sono le richieste concesse. Le letture lasciano il fascicolo com’è.' }
        ] : cosa === 1 ? [
          { se: I(b + s), msg: 'Le richieste senza credenziali si fermano prima, all’autenticazione. L’autorizzazione nega soltanto le modifiche degli studenti.' },
          { se: I(a + b), msg: 'Queste sono tutte le richieste degli studenti. Le loro letture vengono concesse.' },
          { se: I(s), msg: 'Queste sono le richieste senza credenziali, che si fermano all’autenticazione.' }
        ] : cosa === 2 ? [
          { se: I(b + s), msg: 'Le modifiche degli studenti superano l’autenticazione, e vengono negate dopo. Qui contano soltanto le richieste senza credenziali.' },
          { se: I(b), msg: 'Queste sono le richieste negate dall’autorizzazione. All’autenticazione si fermano quelle senza credenziali.' }
        ] : [
          { se: I(a + b + c + d), msg: 'Queste sono tutte le richieste con credenziali valide. Le modifiche degli studenti vengono negate.' },
          { se: I(d), msg: 'Queste sono le modifiche applicate. Anche una lettura concessa è una richiesta concessa.' },
          { se: I(a + c), msg: 'Queste sono le letture. Vanno aggiunte le modifiche del docente.' }
        ]),
        altro: 'Il numero è diverso. Per ogni gruppo di richieste chiediti a quale controllo arriva, e come viene deciso.',
        indizi: ['Senza credenziali: ' + s + ' richieste, ferme all’autenticazione.', 'Studenti: ' + a + ' letture concesse, ' + b + ' modifiche negate.', 'Docente: ' + c + ' letture e ' + d + ' modifiche, tutte concesse.'],
        svolgimento: ['Fermate all’autenticazione: ' + s + '.', 'Negate dall’autorizzazione: ' + b + '.', 'Concesse: ' + (a + c + d) + '.', 'Modifiche applicate: ' + d + '.'] };
    },
    // 6.7.2 · esito di un'apertura dai permessi, oppure numero di controlli lungo un percorso
    (r) => {
      if (r.int(0, 1) === 0) { const dir = r.scegli(['x', 'r', 'rx']), file = r.scegli(['si', 'no']), e = dir.indexOf('x') < 0 ? 'dir' : file === 'si' ? 'aperto' : 'file';
        const fb = e === 'dir' ? 'Per cercare «esiti» dentro /corso serve x, che manca. Il permesso r consente soltanto di leggere l’elenco, e il file resta da controllare.' : e === 'file' ? 'Il permesso x su /corso consente di raggiungere il file. A negare è il permesso di lettura del file.' : 'Il permesso x su /corso consente di raggiungere il file, e il permesso r del file ne consente la lettura.';
        return { u: '6.7.2', d: 'Un programma chiede di aprire in lettura /corso/esiti. Sulla radice ha r e x. Su /corso ha ' + { x: 'soltanto x', r: 'soltanto r', rx: 'r e x' }[dir] + '. Sul file esiti la lettura è ' + (file === 'si' ? 'concessa' : 'negata') + '. Che cosa accade?', guida: 'Si scelga la risposta.', o: r.mescola([
          { t: 'L’apertura riesce, e il programma riceve un descrittore', ok: e === 'aperto', fb },
          { t: 'Rifiuto alla directory /corso, senza arrivare al file', ok: e === 'dir', fb },
          { t: 'Rifiuto sul file esiti, dopo averlo raggiunto', ok: e === 'file', fb }]) }; }
      const n = r.int(2, 4), nomi = ['a', 'b', 'c', 'd'].slice(0, n), j = r.int(0, n), path = '/' + nomi.join('/') + '/dati', v = j === 0 ? n + 2 : j + 1, giuste = I(v), ferma = '/' + nomi.slice(0, j).join('/');
      return { u: '6.7.2', d: 'Un programma apre in lettura ' + path + '. ' + (j === 0 ? 'Tutti i permessi necessari sono presenti. Quanti controlli di permesso compie il kernel, contando le directory attraversate e il file?' : 'Il permesso x manca sulla directory ' + ferma + ', e gli altri permessi sono presenti. Quanti controlli di permesso compie il kernel, contando quello che fallisce?'), segnaposto: 'Un numero', giuste,
        ok: j === 0 ? 'Un controllo di x sulla radice e su ciascuna delle ' + n + ' directory, poi r sul file: ' + (n + 1) + ' + 1 = ' + v + '.' : 'Il kernel controlla x sulla radice e poi sulle directory fino a ' + ferma + ', dove si ferma: ' + v + ' controlli.',
        diagnosi: DIAG(giuste, j === 0 ? [
          { se: I(n + 1), msg: 'Queste sono le directory, radice compresa. Va aggiunto il controllo di lettura sul file.' },
          { se: I(n), msg: 'Va contata anche la radice, in cui si cerca «a», e alla fine il file.' }
        ] : [
          { se: I(n + 2), msg: 'Questi sarebbero i controlli di un’apertura riuscita. Il kernel si ferma al primo che fallisce.' },
          { se: I(j), msg: 'Va contata anche la radice, in cui si cerca «a».' },
          { se: I(1), msg: 'Prima del controllo che fallisce vengono quelli sulle directory precedenti, a partire dalla radice.' }
        ]),
        altro: 'Il numero è diverso. Si elenchi nell’ordine le directory in cui il kernel cerca un nome, a partire dalla radice.',
        indizi: ['Primo controllo: x sulla radice, per cercare «a».', j === 0 ? 'Poi x su ' + nomi.map((x, k) => '/' + nomi.slice(0, k + 1).join('/')).join(', ') + '.' : 'Poi x sulle directory seguenti, fino a ' + ferma + '.', j === 0 ? 'Infine r sul file: ' + v + ' controlli.' : 'Il controllo su ' + ferma + ' fallisce, ed è il numero ' + v + '.'],
        svolgimento: j === 0 ? ['Controlli di x: ' + (n + 1) + '.', 'Controllo di r sul file: 1.', 'Totale: ' + v + '.'] : ['Controlli riusciti: ' + j + '.', 'Controllo fallito: su ' + ferma + '.', 'Totale: ' + v + '.'] };
    },
    // 6.7.3 · un byte del cifrario a XOR, oppure ciò che ottiene un osservatore
    (r) => {
      if (r.int(0, 1) === 0) { const b = r.int(0x41, 0x5A), k = r.scegli([0x2A, 0x35, 0x1C, 0x53, 0x0F, 0x66]), c = b ^ k, verso = r.int(0, 1), dato = verso === 0 ? b : c, v = verso === 0 ? c : b, giuste = HEX(v);
        return { u: '6.7.3', d: 'Un cifrario giocattolo applica lo XOR fra ogni byte e la chiave. ' + (verso === 0 ? 'Il byte in chiaro 0x' + H2(dato) + ' viene cifrato con la chiave 0x' + H2(k) + '. Quale byte viene registrato sul disco?' : 'Sul disco si trova il byte cifrato 0x' + H2(dato) + ', e la chiave è 0x' + H2(k) + '. Qual è il byte in chiaro?') + ' Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1F', giuste,
          ok: BIN(dato) + ' XOR ' + BIN(k) + ' = ' + BIN(v) + ', cioè 0x' + H2(v) + '.',
          diagnosi: DIAG(giuste, [
            { se: HEX(dato | k), msg: 'Questo è l’OR. Lo XOR dà 0 dove i due bit sono uguali, anche quando valgono entrambi 1.' },
            { se: HEX(dato & k), msg: 'Questo è l’AND. Lo XOR dà 1 dove i due bit sono diversi.' },
            dato + k <= 0xFF ? { se: HEX(dato + k), msg: 'Questa è la somma. Lo XOR lavora un bit alla volta, senza riporti.' } : null,
            { se: HEX(dato), msg: 'Questo è il byte di partenza. Va combinato con la chiave.' }
          ]),
          altro: 'Il valore è diverso. Si scrivano i due byte in binario, uno sotto l’altro, e si confrontino i bit di ogni colonna.',
          indizi: ['0x' + H2(dato) + ' = ' + BIN(dato) + ', e 0x' + H2(k) + ' = ' + BIN(k) + '.', 'Bit uguali danno 0, bit diversi danno 1: ' + BIN(v) + '.', BIN(v) + ' = 0x' + H2(v) + '.'],
          svolgimento: ['0x' + H2(dato) + ' = ' + BIN(dato) + '.', '0x' + H2(k) + ' = ' + BIN(k) + '.', 'XOR: ' + BIN(v) + '.', 'In esadecimale: 0x' + H2(v) + '.'] }; }
      const dove = r.scegli(['disco', 'ok', 'no']), vol = r.scegli(['cifrato', 'chiaro']), e = dove === 'disco' ? (vol === 'cifrato' ? 'cifrato' : 'chiaro') : dove === 'ok' ? 'chiaro' : 'errore';
      const fb = dove === 'disco' ? (vol === 'cifrato' ? 'Chi legge il disco rimosso evita il kernel, e trova i byte come sono registrati: cifrati.' : 'Chi legge il disco rimosso evita il kernel. I permessi restano scritti nell’inode senza nessuno che li applichi, e il volume è in chiaro.') : dove === 'ok' ? 'La richiesta passa dal kernel, che concede la lettura' + (vol === 'cifrato' ? ' e decifra i blocchi con la chiave tenuta in memoria.' : '.') : 'La richiesta passa dal kernel, che nega la lettura' + (vol === 'cifrato' ? '. Il volume è sbloccato: a decidere sono i permessi.' : '.');
      return { u: '6.7.3', d: 'Un documento si trova su un volume ' + (vol === 'cifrato' ? 'cifrato, con un cifrario sicuro e una chiave rimasta segreta' : 'in chiaro') + '. ' + (dove === 'disco' ? 'Qualcuno rimuove il disco a macchina spenta e ne legge i blocchi.' : 'La macchina è accesa, il volume è aperto dal sistema, e un programma chiede il documento da una sessione che ha la lettura ' + (dove === 'ok' ? 'concessa.' : 'negata.')) + ' Che cosa ottiene?', guida: 'Si scelga la risposta.', o: r.mescola([
        { t: 'Il documento in chiaro', ok: e === 'chiaro', fb },
        { t: 'Byte cifrati, illeggibili senza la chiave', ok: e === 'cifrato', fb },
        { t: 'Un errore di apertura, e nessun byte', ok: e === 'errore', fb }]) };
    },
    // 6.7.4 · righe, concessioni o rifiuti selezionati da un registro con tre criteri
    (r) => {
      const minuti = r.mescola([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 6).sort((x, y) => x - y);
      const reg = minuti.map((m) => [m, r.scegli(['ada', 'leo']), r.scegli(['tesi', 'tesi', 'dati']), r.scegli(['lettura', 'modifica']), r.scegli(['concessa', 'concessa', 'negata'])]);
      const acc = r.scegli(['ada', 'leo']), ogg = r.scegli(['tesi', 'dati']), T = minuti[r.int(2, 5)], cosa = r.int(0, 2);
      const conta = (l) => (cosa === 0 ? l.length : l.filter((x) => x[4] === (cosa === 1 ? 'concessa' : 'negata')).length);
      const sel = reg.filter((x) => x[0] <= T && x[1] === acc && x[2] === ogg), v = conta(sel), giuste = I(v);
      const el = (l) => (l.length === 0 ? 'nessuna riga' : (l.length === 1 ? 'minuto ' : 'minuti ') + l.map((x) => x[0]).join(', '));
      return { u: '6.7.4', d: 'Un registro contiene, nell’ordine: ' + reg.map((x) => 'minuto ' + x[0] + ', ' + x[1] + ', ' + x[2] + ', ' + x[3] + ' ' + x[4]).join('; ') + '. Fra le richieste di ' + acc + ' su ' + ogg + ' fino al minuto ' + T + ' incluso, quante sono ' + ['in tutto', 'concesse', 'negate'][cosa] + '?', segnaposto: 'Un numero', giuste,
        ok: 'Righe che soddisfano i tre criteri: ' + el(sel) + '.' + (cosa === 0 ? '' : ' Fra queste, ' + (cosa === 1 ? 'concesse' : 'negate') + ': ' + el(sel.filter((x) => x[4] === (cosa === 1 ? 'concessa' : 'negata'))) + '.'),
        diagnosi: DIAG(giuste, [
          { se: I(conta(reg.filter((x) => x[0] <= T && x[1] === acc))), msg: 'Il tuo conto comprende le richieste di ' + acc + ' su ogni oggetto. Va applicato anche il criterio dell’oggetto.' },
          { se: I(conta(reg.filter((x) => x[0] <= T && x[2] === ogg))), msg: 'Il tuo conto comprende le richieste di ogni account su ' + ogg + '. Va applicato anche il criterio dell’account.' },
          { se: I(conta(reg.filter((x) => x[1] === acc && x[2] === ogg))), msg: 'Il tuo conto comprende righe successive al minuto ' + T + ', che stanno fuori dal periodo.' },
          cosa === 0 ? null : { se: I(sel.length), msg: 'Queste sono tutte le righe selezionate. La domanda riguarda soltanto quelle ' + (cosa === 1 ? 'concesse.' : 'negate.') },
          cosa === 0 ? null : { se: I(sel.length - v), msg: 'Queste sono le richieste ' + (cosa === 1 ? 'negate' : 'concesse') + '. La domanda riguarda quelle ' + (cosa === 1 ? 'concesse.' : 'negate.') }
        ]),
        altro: 'Il numero è diverso. Si scorrano le righe una alla volta, e si tengano quelle che soddisfano insieme periodo, account e oggetto.',
        indizi: ['Fino al minuto ' + T + ': ' + el(reg.filter((x) => x[0] <= T)) + '.', 'Fra queste, di ' + acc + ': ' + el(reg.filter((x) => x[0] <= T && x[1] === acc)) + '.', 'Fra queste, su ' + ogg + ': ' + el(sel) + '.'],
        svolgimento: ['Periodo: ' + el(reg.filter((x) => x[0] <= T)) + '.', 'Account ' + acc + ': ' + el(reg.filter((x) => x[0] <= T && x[1] === acc)) + '.', 'Oggetto ' + ogg + ': ' + el(sel) + '.', ['Righe', 'Concesse', 'Negate'][cosa] + ': ' + v + '.'] };
    }
  ] });
})();
