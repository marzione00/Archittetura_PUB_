'use strict';
SL.unita572 = (() => {
  const ESCLUSA = { nessuna: 'nessuna', ranghi: 'circolare', insieme: 'possesso', cede: 'prelazione' };
  const NOME = { nessuna: 'nessuna', circolare: 'attesa circolare', possesso: 'possesso e attesa', prelazione: 'assenza di prelazione' };
  const traccia = (p) => {
    const T = [], r = p.regola;
    const S = (atto, titolo, testo, s, extra) => T.push(Object.assign({ atto, titolo, testo, X: '', Y: '', A: 'pronto', B: 'pronto', acc: '', stallo: false }, s, extra ? { extra } : {}));
    if (r === 'nessuna') {
      S(0, 'Nessuna regola', 'A e B hanno bisogno dei lock X e Y. Nessun protocollo li vincola: A prende X e poi Y, B prende Y e poi X.', {});
      S(1, 'A · lock(X)', 'A acquisisce X.', { X: 'A', A: 'ha X', acc: 'XA' }, { calc: 'X di A' });
      S(1, 'B · lock(Y)', 'B acquisisce Y.', { X: 'A', Y: 'B', A: 'ha X', B: 'ha Y', acc: 'YB' }, { calc: 'Y di B' });
      S(1, 'A · lock(Y)', 'A chiede Y, che è di B. Viene bloccato, e continua a possedere X: sta aspettando mentre possiede.', { X: 'A', Y: 'B', A: 'ha X · aspetta Y', B: 'ha Y', acc: 'A' }, { calc: 'A possiede e aspetta', chiedi: { d: 'A è bloccato e possiede X. Il sistema può togliergli X per darlo a B?', o: ['No: un lock lo rilascia soltanto il proprietario', 'Sì, quando serve a un altro'], g: 0, no: 'I lock sono senza prelazione: restano al proprietario fino al suo rilascio.' } });
      S(1, 'B · lock(X)', 'B chiede X, che è di A. Viene bloccato, e continua a possedere Y. Le attese si chiudono a cerchio.', { X: 'A', Y: 'B', A: 'ha X · aspetta Y', B: 'ha Y · aspetta X', acc: 'B', stallo: true }, { calc: 'A aspetta B · B aspetta A' });
      S(2, 'L’esito', 'È un deadlock. Le quattro condizioni sono tutte presenti: i lock sono esclusivi, ciascuno possiede un lock mentre ne aspetta un altro, nessuno può essere costretto a rilasciare, e le attese formano un cerchio.', { X: 'A', Y: 'B', A: 'ha X · aspetta Y', B: 'ha Y · aspetta X', stallo: true }, { esito: ['deadlock · nessuna condizione esclusa', 'no'] });
    } else if (r === 'ranghi') {
      S(0, 'La regola dei ranghi', 'Il protocollo assegna a X il rango 1 e a Y il rango 2, e impone acquisizioni per rango crescente. A e B devono entrambi cominciare da X.', {});
      S(1, 'A · lock(X)', 'A acquisisce X, il lock di rango più basso.', { X: 'A', A: 'ha X', acc: 'XA' }, { calc: 'X di A' });
      S(1, 'B · lock(X)', 'Anche B deve cominciare da X. Il lock è di A, e B viene bloccato senza possedere nulla.', { X: 'A', A: 'ha X', B: 'aspetta X', acc: 'B' }, { calc: 'B aspetta A', chiedi: { d: 'B aspetta A. Può formarsi anche l’attesa opposta, di A verso B?', o: ['No: B è a mani vuote, e ad A serve soltanto Y, che è libero', 'Sì, appena A chiede Y'], g: 0, no: 'Per far aspettare A, B dovrebbe possedere Y. Con i ranghi B lo chiederà soltanto dopo avere ottenuto X.' } });
      S(1, 'A · lock(Y)', 'A chiede Y, di rango più alto. Nessuno lo possiede: A lo acquisisce.', { X: 'A', Y: 'A', A: 'ha X e Y', B: 'aspetta X', acc: 'YA' }, { calc: 'Y di A' });
      S(1, 'A completa e rilascia', 'A termina il lavoro e rilascia i due lock. X passa a B.', { X: 'B', A: 'ha finito', B: 'ha X', acc: 'XB' }, { calc: 'X di B' });
      S(1, 'B · lock(Y), lavoro, rilascio', 'B acquisisce Y, completa e rilascia tutto.', { A: 'ha finito', B: 'ha finito', acc: 'B' }, { calc: 'X e Y liberi' });
      S(2, 'L’esito', 'A e B hanno completato. La condizione esclusa è l’attesa circolare: lungo una catena di attese i ranghi salgono sempre, e un cerchio dovrebbe prima o poi scendere. Le altre tre condizioni restano possibili.', { A: 'ha finito', B: 'ha finito' }, { esito: ['esclusa: attesa circolare', 'si'] });
    } else if (r === 'insieme') {
      S(0, 'La regola dell’insieme completo', 'Il protocollo concede i lock soltanto tutti insieme, con una richiesta indivisibile: o l’intero insieme, o nulla.', {});
      S(1, 'A chiede X e Y insieme', 'A presenta una sola richiesta per i due lock. Sono entrambi liberi, e A li riceve insieme.', { X: 'A', Y: 'A', A: 'ha X e Y', acc: 'XYA' }, { calc: 'X e Y di A' });
      S(1, 'B chiede X e Y insieme', 'B presenta la sua richiesta. I lock sono occupati, e B viene messo in attesa. Il protocollo si guarda bene dal dargli un lock solo: B aspetta senza possedere nulla.', { X: 'A', Y: 'A', A: 'ha X e Y', B: 'aspetta · possiede 0 lock', acc: 'B' }, { calc: 'B possiede 0 lock', chiedi: { d: 'B è in attesa. Quanti lock possiede?', o: ['Nessuno', 'Uno, quello libero per primo'], g: 0, no: 'La richiesta è indivisibile: finché manca anche un solo lock, B resta a mani vuote.' } });
      S(1, 'A completa e rilascia', 'A termina il lavoro e rilascia i due lock.', { A: 'ha finito', B: 'aspetta · possiede 0 lock', acc: 'A' }, { calc: 'X e Y liberi' });
      S(1, 'B riceve X e Y, e completa', 'Ora l’intero insieme è libero. B lo riceve, completa e rilascia.', { A: 'ha finito', B: 'ha finito', acc: 'B' }, { calc: 'X e Y liberi' });
      S(2, 'L’esito', 'A e B hanno completato. La condizione esclusa è il possesso e attesa: chi aspetta possiede zero lock, e nessuno può quindi aspettare lui. Il prezzo è tenere occupati i lock più a lungo del necessario.', { A: 'ha finito', B: 'ha finito' }, { esito: ['esclusa: possesso e attesa', 'si'] });
    } else {
      S(0, 'La regola del rilascio', 'Il protocollo lascia libero l’ordine. Impone però che un thread a cui viene negato un lock rilasci subito quelli che possiede, e riprovi più tardi da capo.', {});
      S(1, 'A · lock(X)', 'A acquisisce X.', { X: 'A', A: 'ha X', acc: 'XA' }, { calc: 'X di A' });
      S(1, 'B · lock(Y)', 'B acquisisce Y.', { X: 'A', Y: 'B', A: 'ha X', B: 'ha Y', acc: 'YB' }, { calc: 'Y di B' });
      S(1, 'A chiede Y, e cede X', 'A chiede Y, che è di B. La richiesta è negata, e la regola obbliga A a rilasciare X. A si ritira e riproverà.', { Y: 'B', A: 'si ritira · riproverà', B: 'ha Y', acc: 'A' }, { calc: 'X libero', chiedi: { d: 'A ha rilasciato X. Che cosa trova B quando chiede X?', o: ['X libero: B lo acquisisce', 'X ancora di A'], g: 0, no: 'La regola ha tolto X ad A nel momento in cui la sua richiesta è stata negata.' } });
      S(1, 'B · lock(X), lavoro, rilascio', 'B chiede X, che ora è libero. Lo acquisisce, completa e rilascia tutto.', { A: 'si ritira · riproverà', B: 'ha finito', acc: 'B' }, { calc: 'X e Y liberi' });
      S(1, 'A riprova e completa', 'A ricomincia da capo: acquisisce X, poi Y, completa e rilascia.', { A: 'ha finito', B: 'ha finito', acc: 'A' }, { calc: 'X e Y liberi' });
      S(2, 'L’esito', 'A e B hanno completato. La condizione esclusa è l’assenza di prelazione: un lock può essere tolto a chi resta fermo. Il prezzo è il lavoro da rifare, e un rischio nuovo: se anche B avesse ceduto nello stesso istante, i due avrebbero potuto ritirarsi e riprovare insieme all’infinito.', { A: 'ha finito', B: 'ha finito' }, { esito: ['esclusa: assenza di prelazione', 'si'] });
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
  obiettivo: 'Obiettivo: elencare le quattro condizioni necessarie a un deadlock, e dire quale di esse viene esclusa da un protocollo di prevenzione.',
  concetti: [['scudo', 'Quattro condizioni, tutte necessarie'], ['lucchetto', 'Toglierne una basta'], ['bilancio', 'Ogni regola ha un prezzo']],
  filigrana: ['scudo', 'lucchetto', 'stallo'],
  richiami: {
    carte: [
      { sim: 'lucchetto', da: 'Dall’unità 5.6.5', t: 'I ranghi dei lock', d: 'Ogni lock ha un numero, e i lock si acquisiscono per rango crescente.' },
      { sim: 'stallo', da: 'Dall’unità 5.7.1', t: 'Il ciclo nel grafo', d: 'Con una sola istanza per risorsa, un ciclo di richieste e assegnazioni è un deadlock.' },
      { sim: 'clock', da: 'Dall’unità 5.3.1', t: 'La prelazione', d: 'Lo scheduler toglie il processore a un processo che non lo ha ceduto.' }
    ],
    domanda: { d: 'Prima di proseguire: due thread acquisiscono sempre X prima di Y. Possono bloccarsi a vicenda su questi due lock?', o: [
      { t: 'No: chi arriva secondo si ferma su X senza possedere nulla', ok: true, fb: 'Nessuno dei due può trovarsi con Y in mano ad aspettare X.' },
      { t: 'Sì, se le acquisizioni si alternano', fb: 'Con l’ordine comune l’alternanza ferma il secondo thread già su X.' },
      { t: 'Sì, se i core sono due', fb: 'Il numero dei core è indifferente: conta l’ordine delle acquisizioni.' }
    ] }
  },
  idea: {
    titolo: 'Quattro ingredienti, e basta toglierne uno',
    termini: ['condizioni di coffman', 'possesso e attesa', 'attesa circolare', 'prevenzione del deadlock'],
    testo: [
      'Finora abbiamo visto il deadlock nascere in situazioni particolari. Viene naturale chiedersi che cosa abbiano in comune. La risposta è un elenco di quattro condizioni, note come [[condizioni di coffman|condizioni di Coffman]] dal nome di chi le formulò. Un deadlock fra risorse riutilizzabili può esistere soltanto se valgono tutte e quattro nello stesso momento.',
      'La prima è la mutua esclusione: la risorsa serve un solo utilizzatore per volta. La seconda è il [[possesso e attesa]]: un thread tiene ciò che ha già ottenuto mentre aspetta altro. La terza è l’assenza di prelazione: una risorsa viene rilasciata soltanto dal suo possessore, e al sistema è vietato toglierla. La quarta è l’[[attesa circolare]]: le attese formano un cerchio, in cui ciascuno aspetta qualcosa che è in mano al successivo.',
      { fig: 'scena', w: 720, h: 190, titolo: 'Senza regole: le quattro condizioni insieme', nota: 'Lock esclusivi, ciascuno possiede e aspetta, nessuno può essere costretto a rilasciare, e le attese formano un cerchio.', els: SL.unita572.quadro('g', 'nessuna', SL.unita572.traccia({ regola: 'nessuna' })[4], true, { x: 10, y: 4, w: 700 }) },
      'Poiché le condizioni sono tutte necessarie, basta renderne impossibile una, e il deadlock non può più formarsi. Questa strategia si chiama [[prevenzione del deadlock]]: si fissa una regola prima che le richieste comincino, e la regola vale sempre. La mutua esclusione di solito è intoccabile, perché è la ragione stessa per cui il lock esiste. Restano le altre tre.',
      'Contro l’attesa circolare c’è l’ordine globale dell’unità 5.6.5: con i ranghi crescenti un cerchio non si chiude. Contro il possesso e attesa si può imporre che un thread chieda tutti i lock in una sola richiesta indivisibile: li riceve tutti, oppure aspetta a mani vuote. Contro l’assenza di prelazione si può imporre che un thread a cui viene negato un lock rilasci quelli che possiede e ricominci.',
      'Nessuna regola è gratuita. I ranghi obbligano a conoscere in anticipo l’ordine. La richiesta d’insieme tiene occupati i lock anche quando servono soltanto alla fine. Il rilascio forzato butta via lavoro già fatto, e apre la porta a tentativi ripetuti senza esito, che ritroveremo nell’unità 5.7.5. Scegliere una regola significa scegliere quale prezzo pagare.'
    ]
  },
  esperimento: {
    faremo: [
      'A e B hanno bisogno dei lock X e Y. Sceglierai la regola di prevenzione: nessuna, ranghi crescenti, insieme completo, oppure rilascio alla prima richiesta negata.',
      'In basso ci sono le quattro condizioni di Coffman. Guarda quale diventa «esclusa» con ciascuna regola, e quanto costa ai due thread.'
    ],
    vedrai: [
      ['lucchetto', 'Lock e thread', 'In alto: i proprietari di X e Y. Al centro: che cosa possiede e che cosa aspetta ciascun thread.'],
      ['scudo', 'Le quattro condizioni', 'In basso: «possibile» se il protocollo la ammette, «esclusa» se la rende impossibile, «presente» quando si è verificata.']
    ]
  },
  lab: {
    titolo: 'Quattro regole, quattro condizioni',
    scena: { w: 860, h: 194 },
    atti: ['La regola', 'Le acquisizioni', 'L’esito'],
    controlli: [
      { id: 'regola', tipo: 'scelta', eti: 'Regola di prevenzione', opzioni: [['nessuna', 'nessuna'], ['ranghi', 'ranghi crescenti: X prima di Y'], ['insieme', 'tutti i lock in una sola richiesta'], ['cede', 'richiesta negata: si rilascia e si riprova']], valore: 'ranghi' }
    ],
    nota: 'Il numero dei passi dipende dalla regola. Senza regole A prende X e poi Y, e B prende Y e poi X.',
    previsione: {
      domanda: (p) => 'A e B hanno bisogno dei lock X e Y. ' + (p.regola === 'nessuna' ? 'Nessun protocollo li vincola: A prende X e poi Y, B prende Y e poi X, alternandosi.' : p.regola === 'ranghi' ? 'Il protocollo impone acquisizioni per rango crescente: X prima di Y.' : p.regola === 'insieme' ? 'Il protocollo concede i lock soltanto tutti insieme, con una richiesta indivisibile.' : 'Il protocollo impone, a chi si vede negare un lock, di rilasciare quelli che possiede e riprovare.') + ' Quale condizione di Coffman viene esclusa?',
      opzioni: () => [['nessuna', 'Nessuna'], ['possesso', 'Possesso e attesa'], ['prelazione', 'Assenza di prelazione'], ['circolare', 'Attesa circolare']]
    },
    confronto: (pred, esito, p) => { const N = SL.unita572.NOME; return 'La previsione indicava «' + N[pred] + '». La condizione esclusa è «' + N[esito] + '». ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'nessuna' ? 'Senza regole le quattro condizioni possono presentarsi insieme, e qui lo hanno fatto.' : esito === 'circolare' ? 'Con i ranghi un thread può ancora possedere un lock e aspettarne uno di rango più alto. È il cerchio a diventare impossibile.' : esito === 'possesso' ? 'Chi aspetta è a mani vuote: nessun lock viene tenuto durante un’attesa.' : 'Un thread fermo perde i lock che possiede: nessuno resta bloccato tenendo una risorsa.'); },
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
      ['Credere che ogni condizione, da sola, produca un deadlock.', 'Sono condizioni necessarie: serve la loro presenza contemporanea.'],
      ['Pensare che i ranghi eliminino il possesso e attesa.', 'Un thread può possedere un lock e aspettarne uno di rango più alto. Viene escluso il cerchio.'],
      ['Considerare gratuita la prevenzione.', 'Ogni regola limita la libertà dei thread, tiene lock più a lungo, oppure fa rifare del lavoro.']
    ],
    saFare: ['Elencare le quattro condizioni.', 'Associare a un protocollo la condizione che esclude.', 'Confrontare i costi di due protocolli.'],
    esercizi: [
      { d: 'Un protocollo obbliga ogni thread a chiedere tutti i lock che gli servono con una sola richiesta indivisibile. Quale condizione esclude?', guida: 'Si scelga la risposta.', o: [
        { t: 'Possesso e attesa', ok: true, fb: 'Chi aspetta non possiede nulla, e chi possiede non aspetta.' },
        { t: 'Attesa circolare', fb: 'Il cerchio diventa impossibile come conseguenza. La condizione tolta direttamente è un’altra: nessuno aspetta possedendo.' },
        { t: 'Mutua esclusione', fb: 'I lock restano esclusivi.' }] },
      { d: 'In un programma valgono mutua esclusione, possesso e attesa e assenza di prelazione, e i lock sono sempre acquisiti per rango crescente. Quante delle quattro condizioni possono verificarsi?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'L’attesa circolare è esclusa dai ranghi. Ne restano tre, e tre non bastano per un deadlock.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'I ranghi crescenti rendono impossibile l’attesa circolare.' },
          { se: ['1', 'uno'], msg: 'Una è la condizione esclusa. La domanda riguarda quelle che restano possibili.' },
          { se: ['0', 'zero'], msg: 'I ranghi escludono una sola condizione, e le altre tre restano.' }
        ],
        altro: 'Il numero è diverso. Ci si chieda quale condizione viene esclusa dai ranghi crescenti.',
        indizi: ['Le condizioni sono quattro.', 'I ranghi escludono l’attesa circolare.', '4 − 1 = 3.'],
        svolgimento: ['Condizioni: 4.', 'Escluse dai ranghi: 1.', 'Possibili: 3.'] },
      { d: 'Perché basta escludere una sola delle quattro condizioni?', guida: 'Si scelga la risposta.', o: [
        { t: 'Perché sono tutte necessarie: se una manca, il deadlock è impossibile', ok: true, fb: 'Un deadlock richiede la presenza contemporanea di tutte e quattro.' },
        { t: 'Perché le altre tre scompaiono di conseguenza', fb: 'Le altre tre possono restare, e da sole sono innocue.' },
        { t: 'Perché una sola è la vera causa', fb: 'Nessuna delle quattro è sufficiente da sola.' }] }
    ],
    sfida: ['cslez5_7_02_deadlock', 'Condizioni di Coffman']
  }
});
