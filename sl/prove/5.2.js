'use strict';
/* Prova del capitolo 5.2: una domanda per unità. */
(() => {
  const I = SL.scritture.intero;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };

  SL.registraProva('5.2', { domande: [
    // 5.2.1 · una variabile dopo fork, oppure chi riceve quale valore
    (r) => {
      if (r.int(0, 3) === 0) { const pid = r.int(1200, 9800), zero = r.int(0, 1) === 0; return { u: '5.2.1', d: 'Immediatamente dopo una chiamata a fork, un processo esamina il valore restituito e trova ' + (zero ? 0 : pid) + '. Quale conclusione può trarre?', guida: 'Si scelga la risposta.', o: r.mescola([
        { t: 'È il padre, e il numero è il PID del figlio', ok: !zero, fb: zero ? 'Al padre fork restituisce un numero positivo. Lo 0 va al figlio.' : 'Soltanto il padre riceve un numero positivo.' },
        { t: 'È il figlio', ok: zero, fb: zero ? 'Al figlio fork restituisce 0.' : 'Al figlio fork restituisce 0, e in questo caso il valore è positivo.' },
        { t: 'La chiamata è fallita', ok: false, fb: 'Una fork fallita restituisce un numero negativo.' }]) }; }
      const n = r.int(5, 60), a = r.int(2, 9), b = r.int(2, 9), opF = r.scegli(['−', '+']), chi = r.scegli(['padre', 'figlio']), vp = n + a, vf = opF === '−' ? n - b : n + b, v = chi === 'padre' ? vp : vf, giuste = I(v);
      return { u: '5.2.1', d: 'Un processo ha una variabile n uguale a ' + n + ' e chiama fork. In seguito il padre esegue n = n + ' + a + ', e il figlio esegue n = n ' + opF + ' ' + b + '. Quanto vale n nel ' + chi + '?', segnaposto: 'Un numero', giuste,
        ok: 'Il ' + chi + ' parte da ' + n + ' e applica soltanto la propria operazione: ' + v + '.',
        diagnosi: DIAG(giuste, [
          { se: I(chi === 'padre' ? vf : vp), msg: 'Questo è il valore nel ' + (chi === 'padre' ? 'figlio' : 'padre') + '.' },
          { se: I(opF === '−' ? n + a - b : n + a + b), msg: 'Entrambe le operazioni sono state applicate alla medesima variabile. Dopo fork le variabili sono due.' },
          { se: I(n), msg: 'Il ' + chi + ' ha eseguito la propria operazione.' }
        ]),
        altro: 'Il valore è diverso. Si applichi al valore di partenza soltanto l’operazione del ' + chi + '.',
        indizi: ['Al momento di fork, n vale ' + n + ' in entrambi.', 'Il ' + chi + ' esegue n = n ' + (chi === 'padre' ? '+ ' + a : opF + ' ' + b) + '.', 'Il risultato è ' + v + '.'],
        svolgimento: ['Dopo fork: padre ' + n + ', figlio ' + n + '.', 'Padre: ' + n + ' + ' + a + ' = ' + vp + '.', 'Figlio: ' + n + ' ' + opF + ' ' + b + ' = ' + vf + '.'] };
    },
    // 5.2.2 · il primo descrittore libero, oppure la destinazione dell'uscita
    (r) => {
      if (r.int(0, 1) === 0) { const tutti = [0, 1, 2, 3, 4, 5, 6], buco = r.int(3, 6), aperti = tutti.filter((x) => x < buco || (x > buco && r.int(0, 1) === 1)), giuste = I(buco); return { u: '5.2.2', d: 'Un processo ha aperti i descrittori ' + aperti.slice(0, -1).join(', ') + ' e ' + aperti[aperti.length - 1] + '. Apre un altro file. Quale descrittore gli assegna il kernel?', segnaposto: 'Un numero', giuste,
        ok: 'Il kernel assegna il più piccolo descrittore libero: ' + buco + '.',
        diagnosi: DIAG(giuste, [
          { se: I(aperti[aperti.length - 1] + 1), msg: 'Il kernel assegna il più piccolo numero libero, anche quando sono impiegati numeri maggiori.' },
          { se: I(aperti.length), msg: 'È rilevante il primo numero mancante, a partire da 0.' },
          { se: I(1), msg: 'Il descrittore 1 è già occupato.' }
        ]),
        altro: 'Il numero è diverso. Si scorrano i numeri da 0 fino al primo non impiegato.',
        indizi: ['Sono occupati ' + aperti.join(', ') + '.', 'Il kernel assegna il più piccolo libero.', 'È il ' + buco + '.'],
        svolgimento: ['Occupati: ' + aperti.join(', ') + '.', 'Primo libero: ' + buco + '.'] }; }
      const parola = r.scegli(['ciao', 'fatto', 'pronto', 'ok']), nome = r.scegli(['esito.txt', 'note.txt', 'log.txt']), caso = r.scegli(['tty', 'file', 'senza']);
      const fb = caso === 'tty' ? 'Senza redirezione il figlio eredita il descrittore 1 della shell, che conduce al terminale.' : caso === 'file' ? 'Dopo dup2 il descrittore 1 del figlio conduce al file.' : 'Senza dup2 il file è aperto su un altro descrittore, e il programma scrive sul descrittore 1, rimasto sul terminale.';
      return { u: '5.2.2', d: 'La shell esegue «echo ' + parola + (caso === 'tty' ? '»' : ' > ' + nome + '»') + '. Il figlio creato con fork ' + (caso === 'tty' ? 'carica immediatamente echo' : caso === 'file' ? 'apre ' + nome + ', chiama dup2 per collegarlo al descrittore 1, e carica quindi echo' : 'apre ' + nome + ' e carica echo senza chiamare dup2') + '. Dove è scritta la parola?', guida: 'Si scelga la risposta.', o: r.mescola([
        { t: 'Sul terminale', ok: caso !== 'file', fb },
        { t: 'Nel file ' + nome, ok: caso === 'file', fb },
        { t: 'Sia sul terminale sia nel file', ok: false, fb }]) };
    },
    // 5.2.3 · descrittori aperti dopo execve, oppure il PID
    (r) => {
      const pid = r.int(100, 900), extra = r.mescola([3, 4, 5, 6, 7]).slice(0, r.int(2, 4)).sort((a, b) => a - b), marcati = extra.filter(() => r.int(0, 1) === 1), aperti = [0, 1, 2].concat(extra), ok = r.int(0, 2) > 0;
      const M = marcati.length === 0 ? 'Nessuno è marcato close-on-exec.' : marcati.length === 1 ? 'Il ' + marcati[0] + ' è marcato close-on-exec.' : 'I descrittori ' + marcati.slice(0, -1).join(', ') + ' e ' + marcati[marcati.length - 1] + ' sono marcati close-on-exec.';
      const testa = 'Un processo con PID ' + pid + ' ha aperti i descrittori ' + aperti.slice(0, -1).join(', ') + ' e ' + aperti[aperti.length - 1] + '. ' + M + ' Chiama execve, ' + (ok ? 'e il caricamento riesce. ' : 'e tuttavia il percorso indicato è assente. ');
      if (r.int(0, 3) === 0) { const giuste = I(pid); return { u: '5.2.3', d: testa + 'Qual è il PID del processo che esegue l’istruzione successiva?', segnaposto: 'Un numero', giuste,
        ok: 'execve agisce sul processo che la chiama: riuscita o fallita, il PID resta ' + pid + '.',
        diagnosi: DIAG(giuste, [
          { se: I(pid + 1), msg: 'Un PID nuovo è assegnato da fork. execve agisce sul processo che la chiama.' },
          { se: I(0), msg: 'Lo 0 è il valore che fork restituisce al figlio. Il PID è un dato diverso.' }
        ]),
        altro: 'Il numero è diverso. execve agisce sul processo che la chiama, senza crearne altri.',
        indizi: ['execve sostituisce, al più, l’immagine.', 'L’identità del processo resta.', 'Il PID è ancora ' + pid + '.'],
        svolgimento: ['PID prima della chiamata: ' + pid + '.', 'PID dopo: ' + pid + '.'] }; }
      const v = ok ? aperti.length - marcati.length : aperti.length, giuste = I(v);
      return { u: '5.2.3', d: testa + 'Quanti descrittori sono aperti nel programma in esecuzione immediatamente dopo?', segnaposto: 'Un numero', giuste,
        ok: ok ? 'Il caricamento riesce: restano ' + aperti.length + ' − ' + marcati.length + ' = ' + v + ' descrittori.' : 'La execve fallisce e nessun descrittore è chiuso: i descrittori restano ' + v + '.',
        diagnosi: DIAG(giuste, [
          ok ? { se: I(aperti.length), msg: 'Una execve riuscita chiude i descrittori marcati close-on-exec, che sono ' + marcati.length + '.' } : { se: I(aperti.length - marcati.length), msg: 'La marcatura agisce soltanto a caricamento riuscito. In questo caso execve è fallita.' },
          { se: I(0), msg: 'I descrittori restano aperti dopo execve, a meno che siano marcati.' },
          { se: I(marcati.length), msg: 'Questi sono i descrittori marcati. La domanda riguarda quelli che restano aperti.' }
        ]),
        altro: 'Il numero è diverso. Si stabilisca prima se execve è riuscita, poi si sottraggano gli eventuali descrittori marcati.',
        indizi: ['I descrittori aperti sono ' + aperti.length + '.', ok ? 'execve è riuscita, e chiude i ' + marcati.length + ' marcati.' : 'execve è fallita, e tutti i descrittori restano aperti.', 'Restano ' + v + '.'],
        svolgimento: ['Aperti prima: ' + aperti.join(', ') + '.', ok ? 'Chiusi da execve: ' + (marcati.length ? marcati.join(', ') : 'nessuno') + '.' : 'execve fallita: nessuno chiuso.', 'Aperti dopo: ' + v + '.'] };
    },
    // 5.2.4 · il valore di waitpid, WEXITSTATUS, oppure la condizione del figlio
    (r) => {
      const pid = r.int(300, 4000), cod = r.scegli([0, 1, 2, 3, 7, 13, 42, 127]), cosa = r.int(0, 2);
      if (cosa === 2) { const prima = r.int(0, 1) === 0; return { u: '5.2.4', d: (prima ? 'Un figlio termina con _exit mentre il padre è occupato, e il padre chiamerà waitpid soltanto in seguito.' : 'Un padre chiama waitpid e resta bloccato. In seguito il figlio termina con _exit.') + ' In quale condizione si trova il figlio immediatamente dopo la sua _exit?', guida: 'Si scelga la risposta.', o: r.mescola([
        { t: 'È uno zombie, finché il padre non lo raccoglie', ok: prima, fb: prima ? 'Nessun processo lo attende, e il kernel conserva PID ed esito.' : 'Il padre era già in attesa: la raccolta è immediata.' },
        { t: 'È raccolto immediatamente, e la sua scheda è eliminata', ok: !prima, fb: prima ? 'Nessuno ha ancora chiamato waitpid.' : 'Il padre era già bloccato in waitpid, e riceve immediatamente l’esito.' },
        { t: 'È di nuovo fra i processi pronti', ok: false, fb: 'Un processo terminato non esegue più istruzioni.' }]) }; }
      const v = cosa === 0 ? pid : cod, giuste = I(v), testa = 'Un figlio con PID ' + pid + ' termina chiamando _exit(' + cod + '). Il padre chiama waitpid, che riesce. ';
      return { u: '5.2.4', d: testa + (cosa === 0 ? 'Quale valore restituisce waitpid?' : 'WIFEXITED risulta vero. Quanto vale WEXITSTATUS?'), segnaposto: 'Un numero', giuste,
        ok: cosa === 0 ? 'waitpid restituisce il PID del figlio raccolto, ' + pid + '.' : 'WEXITSTATUS estrae il codice passato a _exit, ' + cod + '.',
        diagnosi: DIAG(giuste, [
          { se: I(cosa === 0 ? cod : pid), msg: cosa === 0 ? 'Questo è il codice di uscita, che si estrae dallo stato con WEXITSTATUS.' : 'Questo è il PID del figlio, restituito da waitpid.' },
          cosa === 0 ? { se: I(0), msg: 'Lo 0 è il valore di fork nel figlio. waitpid restituisce un PID.' } : null
        ]),
        altro: cosa === 0 ? 'Il numero è diverso. waitpid identifica il processo terminato.' : 'Il numero è diverso. Si consideri l’argomento della _exit del figlio.',
        indizi: cosa === 0 ? ['waitpid identifica il figlio raccolto.', 'Il figlio ha PID ' + pid + '.', 'Il valore restituito è ' + pid + '.'] : ['Il figlio ha chiamato _exit(' + cod + ').', 'WEXITSTATUS estrae tale numero dallo stato.', 'Vale ' + cod + '.'],
        svolgimento: ['Valore restituito da waitpid: ' + pid + '.', 'Codice di uscita: ' + cod + '.'] };
    },
    // 5.2.5 · quanti thread, oppure la sorte del figlio
    (r) => {
      if (r.int(0, 1) === 0) { const n = r.int(2, 9), cosa = r.int(0, 2), v = cosa === 0 ? 1 : cosa === 1 ? n : n + 1, giuste = I(v); return { u: '5.2.5', d: 'Un processo ha ' + n + ' thread. Uno di essi chiama fork, e la chiamata riesce. ' + ['Quanti thread ha il figlio appena creato?', 'Quanti thread ha il padre immediatamente dopo?', 'Quanti thread sono presenti complessivamente, fra padre e figlio?'][cosa], segnaposto: 'Un numero', giuste,
        ok: 'fork duplica soltanto il thread che l’ha chiamata: 1 nel figlio, ' + n + ' nel padre, ' + (n + 1) + ' complessivamente.',
        diagnosi: DIAG(giuste, [
          { se: I(cosa === 0 ? n : cosa === 1 ? n - 1 : 2 * n), msg: cosa === 0 ? 'La memoria è copiata per intero. Dei flussi di esecuzione è duplicato uno solo.' : cosa === 1 ? 'Il thread che chiama fork resta anche nel padre.' : 'Nel figlio è presente un solo thread, la copia del chiamante.' },
          cosa === 2 ? { se: I(n), msg: 'Ai ' + n + ' thread del padre va aggiunto quello del figlio.' } : null
        ]),
        altro: 'Il numero è diverso. fork lascia invariati i thread del padre e ne crea uno solo nel figlio.',
        indizi: ['Il padre conserva tutti i suoi thread.', 'Il figlio riceve la copia del solo chiamante.', 'Figlio 1, padre ' + n + ', totale ' + (n + 1) + '.'],
        svolgimento: ['Thread del padre: ' + n + '.', 'Thread del figlio: 1.', 'Complessivamente: ' + (n + 1) + '.'] }; }
      const occ = r.int(0, 2) > 0, fa = r.scegli(['exec', 'exit', 'lock']), e = fa === 'exec' ? 0 : fa === 'exit' ? 1 : occ ? 2 : 3;
      const fb = e === 0 ? 'execve elimina l’immagine precedente, e con essa la copia del mutex.' : e === 1 ? '_exit termina il processo senza richiedere alcun mutex.' : e === 2 ? 'La copia del mutex è occupata, e nel figlio non esiste il thread che dovrebbe rilasciarla.' : 'Il mutex era libero al momento di fork, e lo è anche la copia.';
      return { u: '5.2.5', d: 'In un processo con due thread, T2 chiama fork ' + (occ ? 'mentre T1 possiede il mutex M' : 'mentre il mutex M è libero') + '. Nel figlio, la copia di T2 ' + (fa === 'exec' ? 'chiama immediatamente execve, e il caricamento riesce' : fa === 'exit' ? 'chiama execve, che fallisce, e nel ramo di errore chiama _exit(127)' : 'chiama una funzione di libreria che deve acquisire M') + '. Che cosa accade al figlio?', guida: 'Si scelga la risposta.', o: r.mescola(['Esegue il nuovo programma', 'Termina con codice 127', 'Resta bloccato indefinitamente', 'La funzione riesce, e il figlio prosegue'].map((t, k) => ({ t, ok: k === e, fb }))) };
    }
  ] });
})();
