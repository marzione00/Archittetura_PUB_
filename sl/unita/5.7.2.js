'use strict';
SL.unita572 = (() => {
  const ESCLUSA = { nessuna: 'nessuna', ranghi: 'circolare', insieme: 'possesso', cede: 'prelazione' };
  const NOME = { nessuna: 'nessuna', circolare: 'attesa circolare', possesso: 'possesso e attesa', prelazione: 'assenza di prelazione' };
  const traccia = (p) => {
    const T = [], r = p.regola;
    const S = (atto, titolo, testo, s, extra) => T.push(Object.assign({ atto, titolo, testo, X: '', Y: '', A: 'pronto', B: 'pronto', acc: '', stallo: false }, s, extra ? { extra } : {}));
    if (r === 'nessuna') {
      S(0, 'Nessuna regola', 'A e B richiedono i lock X e Y. Nessun protocollo li vincola: A acquisisce X e quindi Y, B acquisisce Y e quindi X.', {});
      S(1, 'A · lock(X)', 'A acquisisce X.', { X: 'A', A: 'ha X', acc: 'XA' }, { calc: 'X di A' });
      S(1, 'B · lock(Y)', 'B acquisisce Y.', { X: 'A', Y: 'B', A: 'ha X', B: 'ha Y', acc: 'YB' }, { calc: 'Y di B' });
      S(1, 'A · lock(Y)', 'A richiede Y, che appartiene a B. È bloccato, e continua a possedere X: attende mentre possiede.', { X: 'A', Y: 'B', A: 'ha X · attende Y', B: 'ha Y', acc: 'A' }, { calc: 'A possiede e attende', chiedi: { d: 'A è bloccato e possiede X. Il sistema può sottrargli X per assegnarlo a B?', o: ['No, un lock è rilasciato soltanto dal proprietario', 'Sì, quando occorre a un altro thread'], g: 0, no: 'I lock sono senza prelazione: restano al proprietario fino al suo rilascio.' } });
      S(1, 'B · lock(X)', 'B richiede X, che appartiene ad A: è bloccato, e continua a possedere Y, mentre le attese formano un ciclo.', { X: 'A', Y: 'B', A: 'ha X · attende Y', B: 'ha Y · attende X', acc: 'B', stallo: true }, { calc: 'A attende B · B attende A' });
      S(2, 'L’esito', 'Si tratta di un deadlock. Le quattro condizioni sono tutte presenti: i lock sono esclusivi, ciascun thread possiede un lock mentre ne attende un altro, nessun thread può essere costretto a rilasciare, e le attese formano un ciclo.', { X: 'A', Y: 'B', A: 'ha X · attende Y', B: 'ha Y · attende X', stallo: true }, { esito: ['deadlock · nessuna condizione esclusa', 'no'] });
    } else if (r === 'ranghi') {
      S(0, 'La regola dei ranghi', 'Il protocollo assegna a X il rango 1 e a Y il rango 2, e impone acquisizioni per rango crescente. A e B devono entrambi avere inizio da X.', {});
      S(1, 'A · lock(X)', 'A acquisisce X, il lock di rango inferiore.', { X: 'A', A: 'ha X', acc: 'XA' }, { calc: 'X di A' });
      S(1, 'B · lock(X)', 'Anche B deve avere inizio da X. Il lock appartiene ad A, e B è bloccato senza possedere alcun lock.', { X: 'A', A: 'ha X', B: 'attende X', acc: 'B' }, { calc: 'B attende A', chiedi: { d: 'B attende A. Può formarsi anche l’attesa opposta, di A verso B?', o: ['No, B non possiede alcun lock, e ad A occorre soltanto Y, che è libero', 'Sì, appena A richiede Y'], g: 0, no: 'Per imporre un’attesa ad A, B dovrebbe possedere Y. Con i ranghi B lo richiederà soltanto dopo avere ottenuto X.' } });
      S(1, 'A · lock(Y)', 'A richiede Y, di rango superiore. Nessun thread lo possiede: A lo acquisisce.', { X: 'A', Y: 'A', A: 'ha X e Y', B: 'attende X', acc: 'YA' }, { calc: 'Y di A' });
      S(1, 'A completa e rilascia', 'A termina il lavoro e rilascia i due lock. X passa a B.', { X: 'B', A: 'ha finito', B: 'ha X', acc: 'XB' }, { calc: 'X di B' });
      S(1, 'B · lock(Y), lavoro, rilascio', 'B acquisisce Y, completa il lavoro e rilascia entrambi i lock.', { A: 'ha finito', B: 'ha finito', acc: 'B' }, { calc: 'X e Y liberi' });
      S(2, 'L’esito', 'A e B hanno completato. La condizione esclusa è l’attesa circolare: lungo una catena di attese i ranghi crescono sempre, mentre un ciclo richiederebbe un rango decrescente. Le altre tre condizioni restano possibili.', { A: 'ha finito', B: 'ha finito' }, { esito: ['esclusa: attesa circolare', 'si'] });
    } else if (r === 'insieme') {
      S(0, 'La regola dell’insieme completo', 'Il protocollo concede i lock soltanto tutti insieme, con una richiesta indivisibile: l’intero insieme, oppure nessun lock.', {});
      S(1, 'A richiede X e Y insieme', 'A presenta una sola richiesta per i due lock. Sono entrambi liberi, e A li riceve insieme.', { X: 'A', Y: 'A', A: 'ha X e Y', acc: 'XYA' }, { calc: 'X e Y di A' });
      S(1, 'B richiede X e Y insieme', 'B presenta la propria richiesta. I lock sono occupati, e B è posto in attesa. Il protocollo esclude l’assegnazione di un solo lock: B attende senza possedere alcun lock.', { X: 'A', Y: 'A', A: 'ha X e Y', B: 'attende · possiede 0 lock', acc: 'B' }, { calc: 'B possiede 0 lock', chiedi: { d: 'B è in attesa. Quanti lock possiede?', o: ['Nessuno', 'Uno, quello libero per primo'], g: 0, no: 'La richiesta è indivisibile: finché manca anche un solo lock, B non possiede alcun lock.' } });
      S(1, 'A completa e rilascia', 'A termina il lavoro e rilascia i due lock.', { A: 'ha finito', B: 'attende · possiede 0 lock', acc: 'A' }, { calc: 'X e Y liberi' });
      S(1, 'B riceve X e Y, e completa', 'Ora l’intero insieme è libero. B lo riceve, completa il lavoro e rilascia i lock.', { A: 'ha finito', B: 'ha finito', acc: 'B' }, { calc: 'X e Y liberi' });
      S(2, 'L’esito', 'A e B hanno completato. La condizione esclusa è il possesso e attesa: un thread in attesa possiede zero lock, e nessun altro thread può quindi attenderlo. Il costo è l’occupazione dei lock per un tempo superiore al necessario.', { A: 'ha finito', B: 'ha finito' }, { esito: ['esclusa: possesso e attesa', 'si'] });
    } else {
      S(0, 'La regola del rilascio', 'Il protocollo lascia libero l’ordine. Impone tuttavia che un thread al quale è negato un lock rilasci immediatamente quelli posseduti, e ripeta in seguito il tentativo dall’inizio.', {});
      S(1, 'A · lock(X)', 'A acquisisce X.', { X: 'A', A: 'ha X', acc: 'XA' }, { calc: 'X di A' });
      S(1, 'B · lock(Y)', 'B acquisisce Y.', { X: 'A', Y: 'B', A: 'ha X', B: 'ha Y', acc: 'YB' }, { calc: 'Y di B' });
      S(1, 'A richiede Y, e cede X', 'A richiede Y, che appartiene a B. La richiesta è negata, e la regola obbliga A a rilasciare X. A si ritira e ripeterà il tentativo.', { Y: 'B', A: 'si ritira · riproverà', B: 'ha Y', acc: 'A' }, { calc: 'X libero', chiedi: { d: 'A ha rilasciato X. Quale stato trova B quando richiede X?', o: ['X libero, e B lo acquisisce', 'X ancora in possesso di A'], g: 0, no: 'La regola ha sottratto X ad A nel momento in cui la sua richiesta è stata negata.' } });
      S(1, 'B · lock(X), lavoro, rilascio', 'B richiede X, che ora è libero: lo acquisisce, completa il lavoro e rilascia entrambi i lock.', { A: 'si ritira · riproverà', B: 'ha finito', acc: 'B' }, { calc: 'X e Y liberi' });
      S(1, 'A ripete il tentativo e completa', 'A riprende dall’inizio: acquisisce X, quindi Y, completa il lavoro e rilascia i lock.', { A: 'ha finito', B: 'ha finito', acc: 'A' }, { calc: 'X e Y liberi' });
      S(2, 'L’esito', 'A e B hanno completato. La condizione esclusa è l’assenza di prelazione: un lock può essere sottratto a un thread bloccato. Il costo è il lavoro da ripetere, e un rischio ulteriore: se anche B avesse ceduto nel medesimo istante, i due thread avrebbero potuto ritirarsi e ripetere il tentativo insieme indefinitamente.', { A: 'ha finito', B: 'ha finito' }, { esito: ['esclusa: assenza di prelazione', 'si'] });
    }
    return T;
  };
  const quadro = (pre, regola, s, fine, o) => {
    const el = SL.el, w2 = (o.w - 10) / 2, w4 = (o.w - 30) / 4, a = (c) => s.acc.indexOf(c) >= 0, chi = (v) => (v ? 'di ' + v : 'libero'), esc = ESCLUSA[regola];
    const C = [['mutua esclusione', ''], ['possesso e attesa', 'possesso'], ['senza prelazione', 'prelazione'], ['attesa circolare', 'circolare']];
    return [
      el.box(pre + 'X', o.x, o.y, w2, 54, 'lock X', chi(s.X), a('X') ? 'att' : s.X ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'Y', o.x + w2 + 10, o.y, w2, 54, 'lock Y', chi(s.Y), a('Y') ? 'att' : s.Y ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'A', o.x, o.y + 64, w2, 54, 'thread A', s.A, s.stallo ? 'err' : a('A') ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'B', o.x + w2 + 10, o.y + 64, w2, 54, 'thread B', s.B, s.stallo ? 'err' : a('B') ? 'att' : 'on', { cls: 'stretta' })
    ].concat(C.map((c, k) => el.box(pre + 'c' + k, o.x + k * (w4 + 10), o.y + 128, w4, 54, c[0], c[1] && c[1] === esc ? 'esclusa' : s.stallo ? 'presente' : 'possibile', c[1] && c[1] === esc ? (fine ? 'att' : 'on') : s.stallo ? 'err' : '', { cls: 'stretta' })));
  };
  return { ESCLUSA, NOME, traccia, quadro };
})();
SL.registra('5.7.2', {
  titolo: 'Le condizioni di Coffman e la prevenzione',
  obiettivo: 'Obiettivo: elencare le quattro condizioni necessarie a un deadlock, e indicare quale di esse è esclusa da un protocollo di prevenzione.',
  concetti: [['scudo', 'Quattro condizioni, tutte necessarie'], ['lucchetto', 'L’esclusione di una è sufficiente'], ['bilancio', 'Ogni regola ha un costo']],
  filigrana: ['scudo', 'lucchetto', 'stallo'],
  richiami: {
    carte: [
      { sim: 'lucchetto', da: 'Dall’unità 5.6.5', t: 'I ranghi dei lock', d: 'Ogni lock ha un numero, e i lock si acquisiscono per rango crescente.' },
      { sim: 'stallo', da: 'Dall’unità 5.7.1', t: 'Il ciclo nel grafo', d: 'Con una sola istanza per risorsa, un ciclo di richieste e assegnazioni è un deadlock.' },
      { sim: 'clock', da: 'Dall’unità 5.3.1', t: 'La prelazione', d: 'Lo scheduler sottrae il processore a un processo che non lo ha ceduto.' }
    ],
    domanda: { d: 'Prima di proseguire: due thread acquisiscono sempre X prima di Y. Possono bloccarsi a vicenda su questi due lock?', o: [
      { t: 'No, il thread che giunge per secondo si blocca su X senza possedere alcun lock', ok: true, fb: 'Nessuno dei due può possedere Y in attesa di X.' },
      { t: 'Sì, se le acquisizioni si alternano', fb: 'Con l’ordine comune l’alternanza blocca il secondo thread già su X.' },
      { t: 'Sì, se i core sono due', fb: 'Il numero dei core è indifferente: è rilevante l’ordine delle acquisizioni.' }
    ] }
  },
  idea: {
    titolo: 'Quattro condizioni necessarie',
    termini: ['condizioni di coffman', 'possesso e attesa', 'attesa circolare', 'prevenzione del deadlock'],
    testo: [
      'Nelle unità precedenti il deadlock è comparso in situazioni particolari, e occorre individuarne gli elementi comuni. Tali elementi sono quattro condizioni, note come [[condizioni di coffman|condizioni di Coffman]] dal nome dell’autore che le formulò. Un deadlock fra risorse riutilizzabili può esistere soltanto se valgono tutte e quattro nel medesimo momento.',
      'La prima è la mutua esclusione: la risorsa serve un solo utilizzatore per volta. La seconda è il [[possesso e attesa]]: un thread conserva le risorse già ottenute mentre ne attende altre. La terza è l’assenza di prelazione: una risorsa è rilasciata soltanto dal suo possessore, e al sistema è vietato sottrarla. La quarta è l’[[attesa circolare]]: le attese formano un ciclo, in cui ciascun thread attende una risorsa posseduta dal successivo.',
      { fig: 'scena', w: 720, h: 190, titolo: 'Senza regole: le quattro condizioni insieme', nota: 'Lock esclusivi, ciascun thread possiede e attende, nessun thread può essere costretto a rilasciare, e le attese formano un ciclo.', els: SL.unita572.quadro('g', 'nessuna', SL.unita572.traccia({ regola: 'nessuna' })[4], true, { x: 10, y: 4, w: 700 }) },
      'Poiché le condizioni sono tutte necessarie, è sufficiente renderne impossibile una, e il deadlock non può più formarsi. Tale strategia prende il nome di [[prevenzione del deadlock]]: si fissa una regola prima dell’inizio delle richieste, e la regola vale in ogni caso. La mutua esclusione è di norma irrinunciabile, poiché è la ragione per cui il lock esiste. Restano le altre tre.',
      'L’attesa circolare è esclusa dall’ordine globale dell’unità 5.6.5: con i ranghi crescenti un ciclo è impossibile. Il possesso e attesa è escluso se un thread deve richiedere tutti i lock in una sola richiesta indivisibile: li riceve tutti, oppure attende senza possederne alcuno. L’assenza di prelazione è esclusa se un thread al quale è negato un lock deve rilasciare quelli posseduti e riprendere dall’inizio.',
      'Ogni regola ha un costo. I ranghi impongono la conoscenza anticipata dell’ordine. La richiesta d’insieme occupa i lock anche quando sono necessari soltanto al termine. Il rilascio forzato annulla lavoro già svolto, e rende possibili tentativi ripetuti senza esito, esaminati nell’unità 5.7.5. La scelta di una regola equivale alla scelta del costo da sostenere.'
    ]
  },
  esperimento: {
    faremo: [
      'A e B richiedono i lock X e Y. I controlli fissano la regola di prevenzione: nessuna, ranghi crescenti, insieme completo, oppure rilascio alla prima richiesta negata.',
      'In basso sono riportate le quattro condizioni di Coffman. Per ciascuna regola va osservata la condizione che diviene «esclusa», e il costo per i due thread.'
    ],
    vedrai: [
      ['lucchetto', 'Lock e thread', 'In alto: i proprietari di X e Y. Al centro: i lock posseduti e i lock attesi da ciascun thread.'],
      ['scudo', 'Le quattro condizioni', 'In basso: «possibile» se il protocollo la ammette, «esclusa» se la rende impossibile, «presente» quando si è verificata.']
    ]
  },
  lab: {
    titolo: 'Quattro regole, quattro condizioni',
    scena: { w: 860, h: 194 },
    atti: ['La regola', 'Le acquisizioni', 'L’esito'],
    controlli: [
      { id: 'regola', tipo: 'scelta', eti: 'Regola di prevenzione', opzioni: [['nessuna', 'nessuna'], ['ranghi', 'ranghi crescenti: X prima di Y'], ['insieme', 'tutti i lock in una sola richiesta'], ['cede', 'richiesta negata: rilascio e nuovo tentativo']], valore: 'ranghi' }
    ],
    nota: 'Il numero dei passi dipende dalla regola. Senza regole A acquisisce X e quindi Y, e B acquisisce Y e quindi X.',
    previsione: {
      domanda: (p) => 'A e B richiedono i lock X e Y. ' + (p.regola === 'nessuna' ? 'Nessun protocollo li vincola: A acquisisce X e quindi Y, B acquisisce Y e quindi X, alternandosi.' : p.regola === 'ranghi' ? 'Il protocollo impone acquisizioni per rango crescente: X prima di Y.' : p.regola === 'insieme' ? 'Il protocollo concede i lock soltanto tutti insieme, con una richiesta indivisibile.' : 'Il protocollo impone, al thread al quale è negato un lock, di rilasciare quelli posseduti e ripetere il tentativo.') + ' Quale condizione di Coffman è esclusa?',
      opzioni: () => [['nessuna', 'Nessuna'], ['possesso', 'Possesso e attesa'], ['prelazione', 'Assenza di prelazione'], ['circolare', 'Attesa circolare']]
    },
    confronto: (pred, esito, p) => { const N = SL.unita572.NOME; return 'La previsione indicava «' + N[pred] + '». La condizione esclusa è «' + N[esito] + '». ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'nessuna' ? 'Senza regole le quattro condizioni possono presentarsi insieme, e in questo caso si sono presentate.' : esito === 'circolare' ? 'Con i ranghi un thread può ancora possedere un lock e attenderne uno di rango superiore. È il ciclo a divenire impossibile.' : esito === 'possesso' ? 'Un thread in attesa è privo di lock, e nessun lock è conservato durante un’attesa.' : 'Un thread bloccato perde i lock posseduti: nessun thread resta bloccato in possesso di una risorsa.'); },
    costruisci(p) {
      const U = SL.unita572, T = U.traccia(p);
      const passi = T.map((s, k) => Object.assign({ atto: s.atto, titolo: s.titolo, testo: s.testo, hud: [['Lock X', s.X ? 'di ' + s.X : 'libero', 'a'], ['Lock Y', s.Y ? 'di ' + s.Y : 'libero', 'c'], ['Regola', { nessuna: 'nessuna', ranghi: 'ranghi', insieme: 'insieme', cede: 'rilascio' }[p.regola]]], els: U.quadro('b', p.regola, s, k === T.length - 1, { x: 20, y: 4, w: 820 }) }, s.extra || {}));
      return { passi, esito: U.ESCLUSA[p.regola] };
    }
  },
  bilancio: {
    regola: [
      'Condizioni di Coffman: mutua esclusione, possesso e attesa, assenza di prelazione, attesa circolare. Un deadlock richiede che valgano tutte.',
      'Prevenire significa adottare una regola che ne rende impossibile una: ranghi crescenti, richiesta d’insieme, oppure rilascio forzato.'
    ],
    errori: [
      ['Ritenere che ogni condizione, singolarmente, produca un deadlock.', 'Sono condizioni necessarie: occorre la loro presenza contemporanea.'],
      ['Ritenere che i ranghi eliminino il possesso e attesa.', 'Un thread può possedere un lock e attenderne uno di rango superiore. È escluso il ciclo.'],
      ['Considerare la prevenzione priva di costo.', 'Ogni regola limita la libertà dei thread, occupa i lock più a lungo, oppure impone la ripetizione di lavoro.']
    ],
    saFare: ['Elencare le quattro condizioni.', 'Associare a un protocollo la condizione che esclude.', 'Confrontare i costi di due protocolli.'],
    esercizi: [
      { d: 'Un protocollo obbliga ogni thread a richiedere tutti i lock necessari con una sola richiesta indivisibile. Quale condizione esclude?', guida: 'Si scelga la risposta.', o: [
        { t: 'Possesso e attesa', ok: true, fb: 'Un thread in attesa non possiede alcun lock, e un thread che ne possiede non è in attesa.' },
        { t: 'Attesa circolare', fb: 'Il ciclo diviene impossibile come conseguenza. La condizione esclusa direttamente è un’altra: nessun thread attende in possesso di un lock.' },
        { t: 'Mutua esclusione', fb: 'I lock restano esclusivi.' }] },
      { d: 'In un programma valgono mutua esclusione, possesso e attesa e assenza di prelazione, e i lock sono sempre acquisiti per rango crescente. Quante delle quattro condizioni possono verificarsi?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'L’attesa circolare è esclusa dai ranghi. Ne restano tre, insufficienti per un deadlock.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'I ranghi crescenti rendono impossibile l’attesa circolare.' },
          { se: ['1', 'uno'], msg: 'Una è la condizione esclusa. La domanda riguarda quelle che restano possibili.' },
          { se: ['0', 'zero'], msg: 'I ranghi escludono una sola condizione, e le altre tre restano.' }
        ],
        altro: 'Il numero è diverso. Si individui la condizione esclusa dai ranghi crescenti.',
        indizi: ['Le condizioni sono quattro.', 'I ranghi escludono l’attesa circolare.', '4 − 1 = 3.'],
        svolgimento: ['Condizioni: 4.', 'Escluse dai ranghi: 1.', 'Possibili: 3.'] },
      { d: 'Per quale ragione è sufficiente escludere una sola delle quattro condizioni?', guida: 'Si scelga la risposta.', o: [
        { t: 'Sono tutte necessarie, e in assenza di una il deadlock è impossibile', ok: true, fb: 'Un deadlock richiede la presenza contemporanea di tutte e quattro.' },
        { t: 'Le altre tre scompaiono di conseguenza', fb: 'Le altre tre possono restare, e da sole sono innocue.' },
        { t: 'Una sola è la causa effettiva', fb: 'Nessuna delle quattro è sufficiente da sola.' }] }
    ],
    sfida: ['cslez5_7_02_deadlock', 'Condizioni di Coffman']
  }
});
