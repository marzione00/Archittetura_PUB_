'use strict';
SL.registra('2.7.6', {
  titolo: 'Stack ombra e protezioni complementari',
  obiettivo: 'Obiettivo: indicare che cosa confronta RET quando la pila ombra è attiva, le alterazioni rilevate da tale confronto e quelle che esso lascia passare.',
  concetti: [['pila', 'Due pile'], ['bilancio', 'Il confronto di RET'], ['scudo', 'Difese complementari']],
  filigrana: ['pila', 'scudo', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'pila', da: 'Dall’unità 2.6.2', t: 'CALL e RET', d: 'CALL deposita sulla pila l’indirizzo dell’istruzione successiva. RET lo preleva e salta a tale indirizzo, qualunque valore trovi.' },
      { sim: 'conflitto', da: 'Dall’unità 2.7.2', t: 'Un dato di controllo fra i dati', d: 'L’indirizzo di ritorno si trova sulla pila accanto ai dati locali. Una scrittura oltre i limiti può raggiungerlo e modificarlo.' },
      { sim: 'scudo', da: 'Dall’unità 2.7.3', t: 'I limiti della sentinella', d: 'La sentinella rivela le scritture che la attraversano. Una scrittura che la oltrepassa e raggiunge l’indirizzo di ritorno resta priva di rilevazione.' }
    ],
    domanda: { d: 'Prima di proseguire: una scrittura con un indice errato modifica l’indirizzo di ritorno e lascia invariata la sentinella. Qual è l’effetto di RET?', o: [
      { t: 'Un salto all’indirizzo alterato', ok: true, fb: 'La sentinella è invariata, il controllo è superato, e RET impiega il valore presente in cima alla pila.' },
      { t: 'Un ritorno all’indirizzo originale', fb: 'L’indirizzo originale è stato sovrascritto, e sulla pila ne esiste una sola copia.' },
      { t: 'Un arresto, perché la sentinella segnala l’errore', fb: 'La sentinella segnala soltanto le scritture che modificano i suoi byte. Questa l’ha oltrepassata.' }
    ] }
  },
  idea: {
    titolo: 'Una seconda copia, irraggiungibile',
    termini: ['pila ombra'],
    testo: [
      'L’indirizzo di ritorno si trova sulla pila ordinaria, fra i dati del programma. Le unità precedenti ne hanno mostrato le conseguenze: una scrittura errata può modificarlo, e RET salta all’indirizzo indicato da tale valore. La sentinella rileva soltanto le scritture che la attraversano.',
      'I processori recenti offrono una difesa che riguarda il dato stesso. Accanto alla pila ordinaria il sistema predispone una seconda pila, la [[pila ombra]], riservata agli indirizzi di ritorno. Alle istruzioni ordinarie del programma, come MOV, la scrittura su di essa è preclusa. Vi scrive soltanto il processore, durante l’esecuzione di CALL.',
      'Con il meccanismo attivo, CALL deposita l’indirizzo di ritorno due volte: sulla pila ordinaria, come sempre, e sulla pila ombra. RET preleva entrambe le copie e le confronta. Se coincidono, salta. Se differiscono, il processore solleva un’[[eccezione del processore|eccezione]], indicata con la sigla #CP, e il sistema operativo arresta il programma.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Due copie del medesimo indirizzo', nota: 'Il programma può scrivere soltanto nella colonna di sinistra.', els: [
        SL.el.zona('z1', 10, 6, 330, 138, 'PILA ORDINARIA'), SL.el.zona('z2', 380, 6, 330, 138, 'PILA OMBRA'),
        SL.el.cella('a1', 30, 38, 130, 40, '0x401080', 'on', { piccola: true, cls: 'minuta' }), SL.el.nota('m1', 172, 50, 'indirizzo di ritorno', 'mono minuta'),
        SL.el.cella('a2', 30, 90, 130, 40, '7', '', { piccola: true, cls: 'minuta' }), SL.el.nota('m2', 172, 102, 'dato locale', 'mono minuta'),
        SL.el.cella('b1', 400, 38, 130, 40, '0x401080', 'att', { piccola: true, cls: 'minuta' }), SL.el.nota('m3', 542, 50, 'copia protetta', 'mono minuta'),
        SL.el.nota('n1', 400, 102, 'scrittura riservata a CALL', 'mono minuta')
      ] },
      'La pila ombra contiene soltanto indirizzi di ritorno. Una variabile locale alterata, un contatore, un puntatore a dati restano esclusi dal confronto. Per questa ragione le protezioni si dicono complementari: sentinella, memoria non eseguibile, ASLR e pila ombra riguardano ciascuna un aspetto diverso, e accanto a tutte resta necessario il controllo dei limiti scritto nel codice.',
      'Sui processori Intel e AMD il meccanismo appartiene a una tecnologia denominata CET. È operante quando il processore, il sistema operativo e il programma lo prevedono tutti e tre.'
    ]
  },
  esperimento: {
    faremo: [
      'Una funzione è chiamata, e CALL salva l’indirizzo di ritorno 0x401080. Prima di RET una scrittura errata può alterare l’indirizzo di ritorno sulla pila ordinaria, oppure un dato locale. I controlli fissano il dato alterato e lo stato della pila ombra.',
      'Sono mostrati il confronto eseguito da RET e la conclusione della funzione. Dopo il caso proposto, è istruttivo disattivare la pila ombra e ripetere, e poi alterare il dato locale e rilevare ciò che il confronto lascia passare.'
    ],
    vedrai: [
      ['pila', 'La pila ordinaria', 'A sinistra: l’indirizzo di ritorno e il dato locale della funzione.'],
      ['scudo', 'La pila ombra', 'A destra: la copia dell’indirizzo di ritorno, quando il meccanismo è attivo.'],
      ['bilancio', 'Il confronto', 'In basso: i due valori prelevati da RET e l’esito.']
    ]
  },
  lab: {
    titolo: 'Due copie dell’indirizzo di ritorno',
    scena: { w: 860, h: 372 },
    atti: ['Prima della chiamata', 'CALL', 'All’interno della funzione', 'Il confronto', 'L’esito'],
    controlli: [
      { id: 'caso', tipo: 'scelta', eti: 'Scrittura errata', opzioni: [['niente', 'nessuna'], ['ret', 'sull’indirizzo di ritorno'], ['dato', 'sul dato locale']], valore: 'ret' },
      { id: 'd', tipo: 'scelta', eti: 'Scarto sull’indirizzo', opzioni: [[8, '8 byte'], [16, '16 byte']], valore: 8 },
      { id: 'ombra', tipo: 'scelta', eti: 'Pila ombra', opzioni: [['si', 'attiva'], ['no', 'disattivata']], valore: 'si' }
    ],
    nota: 'Lo scarto è rilevante soltanto quando la scrittura raggiunge l’indirizzo di ritorno.',
    previsione: {
      domanda: (p) => 'CALL salva l’indirizzo di ritorno 0x401080. ' + SL.unita276.DESCR[p.caso].replace('#a', SL.unita276.HA(0x401080 + p.d)) + ' La pila ombra è ' + (p.ombra === 'si' ? 'attiva' : 'disattivata') + '. Qual è l’effetto di RET?',
      opzioni: (p) => [['ok', 'Ritorno a 0x401080'], ['alt', 'Salta a ' + SL.unita276.HA(0x401080 + p.d)], ['cp', 'Eccezione #CP, senza salto']]
    },
    confronto: (pred, esito, p) => { const N = { ok: 'un ritorno a 0x401080', alt: 'un salto a ' + SL.unita276.HA(0x401080 + p.d), cp: 'l’eccezione #CP' }; return 'La previsione indicava ' + N[pred] + '. L’esito è ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'cp' ? 'Le due copie dell’indirizzo sono diverse, e con la pila ombra attiva RET rifiuta il salto.' : esito === 'alt' ? 'Con la pila ombra disattivata RET dispone di una sola copia, quella alterata, e la impiega.' : p.caso === 'dato' ? 'Il dato locale è cambiato, e tuttavia RET esamina soltanto l’indirizzo di ritorno, che è invariato.' : 'Nessuna scrittura ha modificato l’indirizzo di ritorno.'); },
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita276, HA = U.HA, passi = [], C = p.caso, attiva = p.ombra === 'si', ALT = 0x401080 + p.d;
      const st = { rit: null, omb: null, dato: null, rsp: 0x9FF8, letto: null, lettoO: null, esito: '' };
      const LIS = [['40107B', 'call f'], ['401080', 'mov rbx, rax'], ['4011A0', 'f: sub rsp, 8'], ['4011C2', 'add rsp, 8'], ['4011C6', 'ret']];
      const quadro = (o) => {
        const els = [el.nota('n1', 20, 0, 'IL PROGRAMMA', 'mono')];
        X.listato('l', LIS, o.riga, { x: 20, y: 24, w: 230, passo: 46 }).forEach((e) => els.push(e));
        els.push(el.zona('z1', 262, 0, 340, 238, 'PILA ORDINARIA'), el.zona('z2', 620, 0, 220, 238, attiva ? 'PILA OMBRA' : 'PILA OMBRA · SPENTA', attiva ? '' : 'off'));
        X.pila('s', [{ a: 0x9FF8, txt: 'del chiamante', st: 'off' }, { a: 0x9FF0, txt: st.rit == null ? null : HA(st.rit), nota: null, st: st.rit == null ? null : o.colpoRit ? 'err' : o.leggi ? 'att' : 'on' }, { a: 0x9FE8, txt: st.dato == null ? null : String(st.dato), st: st.dato == null ? null : o.colpoDato ? 'err' : '' }], { x: 274, y: 34, w: 170, passo: 50, rsp: st.rsp }).forEach((e) => els.push(e));
        els.push(el.nota('q1', 280, 190, st.rit == null ? '' : '0x9FF0: indirizzo di ritorno', 'mono minuta'), el.nota('q2', 280, 210, st.dato == null ? '' : '0x9FE8: dato locale', 'mono minuta'));
        els.push(el.cella('o1', 640, 84, 180, 44, attiva && st.omb != null ? HA(st.omb) : '·', !attiva || st.omb == null ? 'off' : o.leggi ? 'att' : 'on', { piccola: true, cls: 'minuta' }),
          el.nota('q3', 640, 150, attiva ? 'scrittura riservata a CALL' : 'nessuna copia', 'mono minuta'));
        els.push(el.box('b1', 20, 256, 250, 100, 'RET preleva dalla pila', st.letto == null ? '·' : HA(st.letto), o.leggi ? 'att' : st.letto != null ? 'on' : '', { cls: 'stretta' }),
          el.box('b2', 290, 256, 250, 100, 'copia sulla pila ombra', !attiva ? 'assente' : st.lettoO == null ? '·' : HA(st.lettoO), !attiva ? 'off' : o.leggi ? 'att' : st.lettoO != null ? 'on' : '', { cls: 'stretta' }),
          el.box('b3', 560, 256, 280, 100, 'esito di RET', st.esito || '·', o.fine ? (o.male ? 'err' : 'att') : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Pila ordinaria', st.rit == null ? '·' : HA(st.rit), 'a'], ['Pila ombra', !attiva ? 'disattivata' : st.omb == null ? '·' : HA(st.omb)], ['Esito', st.esito || '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ riga: 0 }, 0, 'Prima della chiamata', 'Il programma sta per eseguire `call f`. L’istruzione si trova a 0x40107B e occupa 5 byte, e la successiva comincia quindi a 0x401080: da tale indirizzo l’esecuzione dovrà riprendere dopo la funzione. ' + (attiva ? 'La pila ombra è attiva.' : 'La pila ombra è disattivata: il programma è eseguito come nelle unità precedenti.'),
        { calc: '0x40107B + 5 = 0x401080', chiedi: { d: attiva ? 'Su quante pile CALL depositerà l’indirizzo 0x401080?' : 'Con la pila ombra disattivata, in quante posizioni sarà conservato l’indirizzo 0x401080?', o: ['Uno', 'Due'], g: attiva ? 1 : 0, no: attiva ? 'Con il meccanismo attivo CALL scrive due copie: una sulla pila ordinaria e una sulla pila ombra.' : 'Senza pila ombra l’indirizzo si trova soltanto sulla pila ordinaria.' } });
      st.rit = 0x401080; st.rsp = 0x9FF0; if (attiva) st.omb = 0x401080;
      P({ riga: 2 }, 1, attiva ? 'CALL scrive due copie' : 'CALL scrive una copia', 'CALL sottrae 8 a RSP e deposita 0x401080 nella cella 0x9FF0 della pila ordinaria. ' + (attiva ? 'Nel medesimo momento il processore deposita il medesimo valore sulla pila ombra. Le due copie sono identiche.' : 'La pila ombra resta priva di scritture, poiché il meccanismo è disattivato.') + ' L’esecuzione passa poi alla funzione.', { calc: attiva ? 'due copie di 0x401080' : 'una copia di 0x401080' });
      st.dato = 7; st.rsp = 0x9FE8;
      P({ riga: 2 }, 2, 'Il dato locale', 'La funzione riserva 8 byte e vi conserva un dato locale, che vale 7. Sulla pila ordinaria l’indirizzo di ritorno e il dato locale sono celle adiacenti, raggiungibili dalle medesime istruzioni.' + (attiva ? ' La pila ombra si trova in un’altra zona della memoria, preclusa alle scritture delle istruzioni ordinarie del programma.' : ''), { calc: '[0x9FE8] = 7' });
      if (C === 'ret') {
        st.rit = ALT;
        P({ riga: 2, colpoRit: true }, 2, 'La scrittura errata', 'Un errore come quelli delle unità 2.7.2 e 2.7.3 produce una scrittura sulla cella 0x9FF0. L’indirizzo di ritorno aumenta di ' + p.d + ' e diventa ' + HA(ALT) + '. ' + (attiva ? 'La copia sulla pila ombra resta 0x401080, poiché tale scrittura è impossibilitata a raggiungerla.' : 'È l’unica copia esistente.'),
          { calc: '0x401080 + ' + p.d + ' = ' + HA(ALT), chiedi: attiva ? { d: 'RET confronterà le due copie dell’indirizzo. Sono uguali?', o: ['Sì', 'No'], g: 1, no: 'La pila ordinaria contiene ' + HA(ALT) + ', la pila ombra 0x401080.' } : null });
      } else if (C === 'dato') {
        st.dato = 99;
        P({ riga: 2, colpoDato: true }, 2, 'La scrittura errata', 'Un errore produce una scrittura sulla cella 0x9FE8. Il dato locale passa da 7 a 99. L’indirizzo di ritorno, nella cella adiacente, resta 0x401080.',
          { calc: '[0x9FE8] = 99', chiedi: attiva ? { d: 'RET confronterà le due copie dell’indirizzo di ritorno. Sono uguali?', o: ['Sì', 'No'], g: 0, no: 'La scrittura ha modificato il dato locale. Le due copie dell’indirizzo valgono entrambe 0x401080.' } : null });
      } else {
        P({ riga: 2 }, 2, 'Nessuna scrittura errata', 'La funzione esegue il proprio corpo senza errori. Ogni scrittura cade nella cella a cui era destinata, e l’indirizzo di ritorno resta 0x401080.', { calc: 'indirizzo di ritorno: 0x401080' });
      }
      passi[passi.length - 1].chiedi || delete passi[passi.length - 1].chiedi;
      st.rsp = 0x9FF0; st.letto = st.rit; if (attiva) st.lettoO = st.omb;
      const uguali = st.rit === 0x401080;
      P({ riga: 4, leggi: true }, 3, attiva ? 'RET preleva due valori' : 'RET preleva un valore', 'La funzione restituisce lo spazio locale e giunge a RET. L’istruzione preleva ' + HA(st.rit) + ' dalla pila ordinaria. ' + (attiva ? 'Essa preleva anche ' + HA(st.omb) + ' dalla pila ombra e confronta i due valori: sono ' + (uguali ? 'uguali.' : 'diversi.') : 'Con la pila ombra disattivata manca un secondo valore di confronto, ed esso è accettato invariato.'), { calc: attiva ? HA(st.rit) + (uguali ? ' = ' : ' ≠ ') + HA(st.omb) : 'nessun confronto' });
      const esito = attiva && !uguali ? 'cp' : !uguali ? 'alt' : 'ok';
      st.esito = esito === 'cp' ? 'eccezione #CP' : esito === 'alt' ? 'salta a ' + HA(ALT) : 'ritorno a 0x401080';
      if (esito === 'cp') P({ riga: 4, leggi: true, fine: true }, 4, 'Il salto non avviene', 'Le due copie sono diverse, e il processore solleva l’eccezione #CP senza eseguire il salto a ' + HA(ALT) + '. Il sistema operativo arresta il programma. La cella sulla pila ordinaria resta alterata, e tuttavia tale valore resta inutilizzato come destinazione.', { calc: '#CP: programma arrestato', esito: ['eccezione #CP', 'si'] });
      else if (esito === 'alt') P({ riga: 4, leggi: true, fine: true, male: true }, 4, 'Il salto all’indirizzo alterato', 'RET salta a ' + HA(ALT) + ', ' + p.d + ' byte oltre il punto in cui l’esecuzione doveva riprendere. Nessun controllo lo rileva, e il programma prosegue da istruzioni estranee all’ordine previsto dal programmatore. Con la pila ombra attiva il confronto avrebbe impedito il salto.', { calc: 'RIP = ' + HA(ALT), esito: ['salta a ' + HA(ALT), 'no'] });
      else P({ riga: 1, fine: true, male: C === 'dato' }, 4, C === 'dato' ? 'Un ritorno regolare con un dato errato' : 'Un ritorno regolare', 'RET salta a 0x401080, e il programma riprende dall’istruzione che segue la CALL. ' + (C === 'dato' ? 'Il dato locale valeva tuttavia 99 al posto di 7 durante l’esecuzione della funzione, e nessun confronto lo ha segnalato' + (attiva ? ': la pila ombra contiene soltanto indirizzi di ritorno.' : '.') + ' Gli errori sui dati richiedono altre difese, a cominciare dal controllo dei limiti nel codice.' : attiva ? 'In assenza di alterazioni, la pila ombra comporta soltanto una scrittura e un confronto aggiuntivi.' : 'Senza errori, la presenza o l’assenza della pila ombra produce il medesimo risultato.'), { calc: 'RIP = 0x401080', esito: ['ritorno a 0x401080', C === 'dato' ? '' : 'si'] });
      return { passi, esito };
    }
  },
  bilancio: {
    regola: [
      'Con la pila ombra attiva, CALL salva l’indirizzo di ritorno su due pile e RET confronta le due copie. Una differenza provoca l’eccezione #CP, e il salto è escluso.',
      'Il confronto riguarda soltanto gli indirizzi di ritorno. I dati locali restano affidati alle altre difese e, in primo luogo, al controllo dei limiti scritto nel codice.'
    ],
    errori: [
      ['Ritenere che la pila ombra protegga i dati.', 'Un dato locale alterato lascia identiche le due copie dell’indirizzo, e RET ritorna regolarmente.'],
      ['Ritenere che l’eccezione #CP ripari il danno.', 'L’eccezione arresta il programma. Essa impedisce il salto, mentre la cella sulla pila ordinaria resta alterata.'],
      ['Considerare una sola protezione sufficiente.', 'Ogni difesa riguarda un aspetto: la sentinella le scritture contigue, la pila ombra gli indirizzi di ritorno. L’errore nel codice resta da correggere.']
    ],
    saFare: ['Indicare dove CALL salva l’indirizzo di ritorno quando la pila ombra è attiva.', 'Prevedere l’esito di RET quando una delle due copie è stata alterata.', 'Distinguere gli errori rilevati dalla pila ombra da quelli che essa lascia passare.'],
    esercizi: [
      { d: 'Una CALL si trova all’indirizzo 0x4010F3, occupa 5 byte e salva l’indirizzo di ritorno su entrambe le pile. Prima di RET una scrittura errata somma 0x10 alla copia sulla pila ordinaria. Quale valore preleva RET dalla pila ombra? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x401000', giuste: ['0x4010f8', '4010f8', '4010f8h'],
        ok: 'L’indirizzo di ritorno è 0x4010F3 + 5 = 0x4010F8. La copia sulla pila ombra resta invariata, mentre la pila ordinaria contiene 0x401108.',
        diagnosi: [
          { se: ['0x401108', '401108'], msg: 'Il valore indicato è quello sulla pila ordinaria dopo la scrittura. La pila ombra conserva la copia originale.' },
          { se: ['0x4010f3', '4010f3'], msg: 'Il valore indicato è l’indirizzo della CALL. L’indirizzo di ritorno è quello dell’istruzione successiva, 5 byte più avanti.' },
          { se: ['0x401103', '401103'], msg: 'È stato sommato 0x10 all’indirizzo della CALL. La copia sulla pila ombra è l’indirizzo dell’istruzione successiva, e nessuna scrittura la modifica.' }
        ],
        altro: 'Il valore è diverso. Si calcoli l’indirizzo dell’istruzione che segue la CALL: è il valore salvato, che sulla pila ombra resta invariato.',
        indizi: ['CALL salva l’indirizzo dell’istruzione successiva.', '0x4010F3 + 5 = 0x4010F8.', 'La scrittura errata raggiunge soltanto la pila ordinaria.'],
        svolgimento: ['Indirizzo di ritorno: 0x4010F3 + 5 = 0x4010F8.', 'Pila ordinaria dopo la scrittura: 0x4010F8 + 0x10 = 0x401108.', 'Pila ombra: 0x4010F8, invariata. RET trova due valori diversi e solleva #CP.'] },
      { d: 'Con la pila ombra attiva, una scrittura oltre i limiti modifica un contatore locale e lascia invariato l’indirizzo di ritorno. Che cosa accade quando la funzione giunge a RET?', guida: 'Si scelga la risposta.', o: [
        { t: 'RET ritorna regolarmente, e il contatore resta errato', ok: true, fb: 'Le due copie dell’indirizzo coincidono. I dati locali sono estranei alla pila ombra.' },
        { t: 'Il processore solleva l’eccezione #CP', fb: 'L’eccezione deriva da due copie diverse dell’indirizzo di ritorno. In questo caso sono identiche.' },
        { t: 'La pila ombra ripristina il valore del contatore', fb: 'La pila ombra contiene soltanto indirizzi di ritorno. Il suo unico compito è il confronto con la copia ordinaria.' }] }
    ]
  }
});
SL.unita276 = {
  HA: (a) => '0x' + a.toString(16).toUpperCase(),
  DESCR: { niente: 'Prima di RET nessuna scrittura è errata.', ret: 'Prima di RET una scrittura errata modifica l’indirizzo sulla pila ordinaria in #a.', dato: 'Prima di RET una scrittura errata modifica un dato locale e lascia invariato l’indirizzo di ritorno.' }
};
