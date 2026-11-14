'use strict';
SL.registra('2.6.6', {
  titolo: 'Un metodo di analisi del codice macchina',
  obiettivo: 'Obiettivo: esaminare una funzione di cui sono disponibili soltanto le istruzioni: individuarne gli argomenti, seguirne i rami e stabilire che cosa calcola.',
  concetti: [['lente', 'Quattro domande'], ['fork', 'Un ramo alla volta'], ['bilancio', 'La descrizione per casi']],
  filigrana: ['lente', 'fork', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'segno', da: 'Dall’unità 2.6.3', t: 'JGE', d: 'Dopo un confronto, salta quando il primo operando è maggiore o uguale al secondo, letti con segno.' },
      { sim: 'segno', da: 'Dall’unità 2.2.7', t: 'NEG', d: 'L’istruzione cambia di segno il contenuto di un registro.' },
      { sim: 'tabella', da: 'Dall’unità 2.2.4', t: 'La traccia con le lettere', d: 'L’annotazione, accanto a ogni registro, dell’espressione che esso contiene consente di riconoscere il calcolo svolto da una sequenza di istruzioni.' }
    ],
    domanda: { d: 'Prima di proseguire: EAX contiene −7. Che cosa contiene dopo `neg eax`?', o: [
      { t: '7', ok: true, fb: 'NEG cambia di segno il contenuto del registro: da −7 a 7.' },
      { t: '−7', fb: 'NEG cambia il segno. Un numero negativo diventa positivo.' },
      { t: '0', fb: 'Zero si otterrebbe con `xor eax, eax`. NEG cambia il segno e conserva il valore assoluto.' }
    ] }
  },
  idea: {
    titolo: 'Quattro domande su una funzione sconosciuta',
    termini: ['disassemblatore'],
    testo: [
      'Si presenta talvolta la necessità di esaminare una funzione priva del sorgente: un programma da verificare, un difetto da individuare in una libreria. Lo strumento iniziale è il [[disassemblatore]], che compie l’operazione inversa dell’assemblatore. Esso legge i byte del codice macchina e scrive le istruzioni corrispondenti, come nell’unità 2.3.6. Il risultato è assembly privo di nomi e di commenti, la cui interpretazione spetta al lettore.',
      'È opportuno procedere con metodo, mediante quattro domande. La prima riguarda gli ingressi. I registri degli argomenti letti dalla funzione prima di essere scritti sono i suoi argomenti, e la vista impiegata ne rivela la larghezza. La seconda riguarda l’uscita: è il contenuto di RAX, o di una sua vista, al momento di RET.',
      { fig: 'scena', w: 720, h: 76, titolo: 'Le quattro domande, nell’ordine', nota: 'Le prime due riguardano i confini della funzione, le altre due il suo interno.', els: [
        SL.el.box('a', 0, 0, 170, 60, 'prima', 'gli ingressi', 'on', { cls: 'stretta' }), SL.el.box('b', 183, 0, 170, 60, 'seconda', 'l’uscita', 'on', { cls: 'stretta' }),
        SL.el.box('c', 366, 0, 170, 60, 'terza', 'quali rami', 'att', { cls: 'stretta' }), SL.el.box('d', 549, 0, 170, 60, 'quarta', 'punto di riunione', 'att', { cls: 'stretta' })] },
      'La terza domanda riguarda i percorsi esistenti. Ogni salto condizionale divide il percorso in due rami, che vanno seguiti uno alla volta, annotando accanto a ogni registro l’espressione che contiene, con le lettere al posto dei numeri. La quarta riguarda il punto in cui i rami si riuniscono, e il valore relativo. L’elenco delle risposte dei diversi rami costituisce una descrizione per casi, dalla quale si ricava spesso un nome.',
      'Una cautela riguarda i valori di prova. Due funzioni diverse possono coincidere su molti argomenti e differire soltanto su alcuni. È opportuno provare almeno un valore per ramo, e in seguito i valori di confine fra un ramo e l’altro, come lo zero.',
      'Nell’ottimizzazione il compilatore riscrive il codice in forme distanti dal sorgente: sostituisce le moltiplicazioni con LEA, elimina variabili, scambia l’ordine dei rami. Il metodo resta valido, poiché considera soltanto gli ingressi, l’uscita e i percorsi intermedi.'
    ]
  },
  esperimento: {
    faremo: [
      'Due funzioni di cinque istruzioni differiscono in una sola. I controlli fissano la funzione da esaminare e l’argomento.',
      'Le quattro domande trovano risposta nel corso dell’esecuzione, e la descrizione per casi è scritta al termine. Dopo il caso proposto, è istruttivo provare il medesimo argomento sull’altra funzione, poi un argomento positivo su entrambe.'
    ],
    vedrai: [
      ['operation', 'Il listato', 'A sinistra: le cinque istruzioni, come le mostrerebbe un disassemblatore.'],
      ['register', 'I registri e i flag', 'Al centro: EDI, EAX e i due flag letti dal salto.'],
      ['bilancio', 'La descrizione per casi', 'A destra: il valore restituito dalla funzione su ciascun ramo.']
    ]
  },
  lab: {
    titolo: 'Una funzione senza nome',
    scena: { w: 860, h: 348 },
    atti: ['Gli ingressi', 'La copia', 'La decisione', 'Il ramo', 'Il punto di riunione', 'Un nome per la funzione'],
    controlli: [
      { id: 'f', tipo: 'scelta', eti: 'Funzione', opzioni: [['abs', 'la prima'], ['pos', 'la seconda']], valore: 'abs' },
      { id: 'a', tipo: 'scelta', eti: 'Argomento, in EDI', opzioni: [[-7, '−7'], [7, '7'], [0, '0'], [-50, '−50'], [23, '23']], valore: -7 }
    ],
    nota: 'Le due funzioni differiscono soltanto nella quarta istruzione.',
    previsione: {
      domanda: (p) => 'Una funzione entra con EDI = ' + SL.x86.num(p.a) + ' ed esegue `mov eax, edi`, `cmp edi, 0`, `jge fine`, `' + SL.unita266.QUARTA[p.f] + '` e, all’etichetta fine, `ret`. Quale valore restituisce?',
      opzioni: (p) => Array.from(new Set([SL.unita266.calcola(p.f, p.a), p.a, -p.a, 0, Math.abs(p.a), p.a + 1])).slice(0, 4).sort((x, y) => x - y).map((v) => [v, SL.x86.num(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + SL.x86.num(pred) + '. La funzione restituisce ' + SL.x86.num(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.a >= 0 ? 'L’argomento è maggiore o uguale a zero: JGE salta, la quarta istruzione è omessa e resta la copia dell’argomento.' : 'L’argomento è negativo: JGE prosegue in sequenza e la quarta istruzione è eseguita.'),
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita266, N = X.num, passi = [], a = p.a, ABS = p.f === 'abs', neg = a < 0, ris = U.calcola(p.f, a);
      const LIS = [['0x401000', 'mov eax, edi'], ['0x401002', 'cmp edi, 0'], ['0x401005', 'jge 0x401009'], ['0x401007', U.QUARTA[p.f]], ['0x401009', 'ret']];
      const st = { eax: null, sf: null, casi: [null, null], nome: null, breve: null };
      const quadro = (o) => {
        const els = [];
        X.listato('li', LIS, o.riga, { x: 20, y: 0, w: 240, passo: 56 }).forEach((e, k) => { if (o.saltata && k === 3) e.st = 'off'; els.push(e); });
        els.push(el.box('edi', 280, 0, 170, 62, 'EDI · l’argomento a', N(a), o.reg === 'edi' ? 'att' : 'on', { cls: 'stretta' }),
          el.box('eax', 280, 74, 170, 62, 'EAX · il risultato', st.eax == null ? '?' : N(st.eax), o.reg === 'eax' ? 'att' : '', { cls: 'stretta' }),
          el.box('fl', 280, 148, 170, 62, 'SF e OF', st.sf == null ? '·' : st.sf + ' e 0', o.reg === 'fl' ? 'att' : '', { cls: 'stretta' }),
          el.box('jg', 280, 222, 170, 62, 'JGE', o.salto == null ? '·' : o.salto ? 'salta' : 'prosegue', o.salto != null && o.reg === 'jg' ? 'att' : '', { cls: 'stretta' }),
          el.nota('n1', 470, 4, 'LE QUATTRO DOMANDE', 'mono'),
          el.box('q1', 470, 28, 370, 46, 'gli ingressi', o.dom >= 1 ? 'a, un intero con segno, in EDI' : '·', o.dom === 1 ? 'att' : o.dom > 1 ? 'on' : '', { cls: 'stretta' }),
          el.box('q2', 470, 80, 370, 46, 'l’uscita', o.dom >= 1 ? 'il contenuto di EAX' : '·', o.dom === 1 ? 'att' : o.dom > 1 ? 'on' : '', { cls: 'stretta' }),
          el.box('q3', 470, 132, 370, 46, 'ramo per a maggiore o uguale a 0', st.casi[0] || '·', o.caso === 0 ? 'att' : st.casi[0] ? 'on' : '', { cls: 'stretta' }),
          el.box('q4', 470, 184, 370, 46, 'ramo per a negativo', st.casi[1] || '·', o.caso === 1 ? 'att' : st.casi[1] ? 'on' : '', { cls: 'stretta' }),
          el.box('q5', 470, 238, 370, 46, 'la funzione calcola', st.nome || '·', st.nome ? 'att' : '', { cls: 'stretta' }),
          el.box('fin', 20, 294, 820, 46, null, o.fine ? 'per a = ' + N(a) + ' restituisce ' + N(ris) : '·', o.fine ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Argomento', N(a), 'a'], ['EAX', st.eax == null ? '?' : N(st.eax)], ['Calcolo', st.breve || '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ dom: 1, reg: 'edi' }, 0, 'Gli ingressi e l’uscita', 'La prima istruzione legge EDI prima di ogni scrittura da parte della funzione. EDI contiene dunque un argomento, e la vista a 32 bit indica un intero di quattro byte. Nessun altro registro degli argomenti è letto. Il risultato è il contenuto di EAX al momento di RET.',
        { chiedi: { d: 'Quanti argomenti riceve la funzione?', o: ['Uno', 'Due', 'Nessuno'], g: 0, no: 'L’unico registro degli argomenti letto prima di essere scritto è EDI. La funzione riceve un solo argomento.' } });
      st.eax = a;
      P({ dom: 2, riga: 0, reg: 'eax' }, 1, 'Una copia dell’argomento', 'MOV copia EDI in EAX. Con le lettere: EAX contiene a. Se la funzione terminasse a questo punto, restituirebbe l’argomento invariato.', { calc: 'EAX = a = ' + N(a) });
      st.sf = neg ? 1 : 0;
      P({ dom: 2, riga: 1, reg: 'fl' }, 2, 'Il confronto con zero', 'CMP sottrae 0 da EDI e scrive i flag. La differenza è l’argomento stesso, ' + N(a) + ': SF ne copia il segno e vale ' + st.sf + ', mentre OF vale 0, poiché la sottrazione di zero lascia il valore all’interno dell’intervallo.',
        { calc: N(a) + ' − 0 · SF = ' + st.sf + ' · OF = 0', chiedi: { d: 'JGE salta quando SF e OF sono uguali, cioè quando EDI è maggiore o uguale a zero. Con EDI = ' + N(a) + ', il salto avviene?', o: ['Sì', 'No'], g: neg ? 1 : 0, no: neg ? 'L’argomento è negativo: SF vale 1, OF vale 0, e il salto è escluso.' : 'L’argomento è maggiore o uguale a zero: SF e OF valgono entrambi 0, e il salto avviene.' } });
      st.casi[neg ? 1 : 0] = neg ? null : 'restituisce a';
      P({ dom: 2, riga: 2, reg: 'jg', salto: !neg, caso: neg ? null : 0 }, 2, neg ? 'Il salto non avviene' : 'Il salto avviene', 'Il salto divide la funzione in due rami. ' + (neg ? 'L’argomento è negativo, SF e OF sono diversi, e JGE prosegue in sequenza: l’esecuzione continua con la quarta istruzione.' : 'L’argomento è maggiore o uguale a zero, SF e OF sono uguali, e JGE salta a 0x401009. Su questo ramo EAX contiene ancora a.'), { calc: neg ? 'ramo dei negativi' : 'ramo per a ≥ 0' });
      if (neg) {
        st.eax = ris; st.casi[1] = ABS ? 'restituisce −a' : 'restituisce 0';
        P({ dom: 2, riga: 3, reg: 'eax', caso: 1, salto: false }, 3, ABS ? 'Il cambio di segno' : 'L’azzeramento', (ABS ? 'NEG cambia di segno EAX, che passa da ' + N(a) + ' a ' + N(ris) + '. Con le lettere: su questo ramo EAX contiene −a.' : 'XOR di EAX con sé stesso lo azzera. Su questo ramo EAX contiene 0, qualunque fosse l’argomento.'), { calc: ABS ? '−(' + N(a) + ') = ' + N(ris) : 'EAX = 0' });
      } else {
        P({ dom: 2, riga: 4, saltata: true, caso: 0, salto: true }, 3, 'La quarta istruzione omessa', 'Su questo ramo l’istruzione `' + U.QUARTA[p.f] + '` resta ineseguita. Per stabilire il comportamento della funzione con un argomento negativo occorre seguire anche l’altro ramo, con un altro valore di prova oppure con le lettere.', { calc: 'EAX = a = ' + N(a) });
      }
      st.casi = ['restituisce a', ABS ? 'restituisce −a' : 'restituisce 0'];
      P({ dom: 3, riga: 4, reg: 'eax', saltata: !neg, fine: true }, 4, 'I rami si riuniscono', 'I due rami arrivano entrambi a RET, a 0x401009. ' + (neg ? 'Su quello appena percorso EAX contiene ' + N(ris) + '. Sull’altro, riservato agli argomenti maggiori o uguali a zero, la quarta istruzione è omessa e resta la copia dell’argomento.' : 'Su quello appena percorso EAX contiene ' + N(ris) + '. Sull’altro, riservato agli argomenti negativi, è eseguita anche `' + U.QUARTA[p.f] + '`, che ' + (ABS ? 'cambia il segno.' : 'azzera il registro.')), { calc: 'EAX = ' + N(ris) });
      st.nome = ABS ? 'il valore assoluto di a' : 'la parte positiva di a'; st.breve = ABS ? 'valore assoluto' : 'parte positiva';
      P({ dom: 3, riga: 4, saltata: !neg, fine: true }, 5, ABS ? 'Il valore assoluto' : 'La parte positiva', 'La descrizione per casi è completa: per a maggiore o uguale a zero la funzione restituisce a, per a negativo restituisce ' + (ABS ? '−a. È il valore assoluto.' : '0. È la funzione che conserva i numeri positivi e sostituisce i negativi con zero.') + ' Sugli argomenti maggiori o uguali a zero le due funzioni di questo esperimento coincidono: la distinzione richiede un argomento negativo.', { calc: ABS ? '|' + N(a) + '| = ' + N(ris) : 'max(' + N(a) + ', 0) = ' + N(ris), esito: ['restituisce ' + N(ris), 'si'] });
      return { passi, esito: ris };
    }
  },
  bilancio: {
    regola: [
      'La lettura di una funzione priva di sorgente procede per quattro domande: gli ingressi, l’uscita, i rami esistenti, il punto in cui si riuniscono e il relativo valore.',
      'Ogni ramo va seguito separatamente, con le lettere al posto dei numeri. La descrizione per casi che ne risulta indica il calcolo svolto dalla funzione.'
    ],
    errori: [
      ['Provare la funzione con un solo valore.', 'Con l’argomento 7 le due funzioni dell’esperimento restituiscono entrambe 7. Si distinguono soltanto sugli argomenti negativi.'],
      ['Trascurare i valori di confine.', 'Lo zero è il valore di confine fra i due rami. Occorre stabilire a quale ramo lo assegna il salto.'],
      ['Leggere le istruzioni come se fossero tutte eseguite.', 'Un’istruzione scritta dopo un salto condizionale è eseguita soltanto su uno dei rami.']
    ],
    saFare: ['Individuare gli argomenti e il risultato di una funzione dal suo codice.', 'Seguire separatamente i rami di un salto condizionale.', 'Scrivere la descrizione per casi e ricavarne il calcolo svolto dalla funzione.'],
    esercizi: [
      { d: 'Una funzione esegue `mov eax, edi`, `cmp edi, esi`, `jge fine`, `mov eax, esi` e, all’etichetta fine, `ret`. Entra con EDI = −3 ed ESI = −8. Quale valore restituisce?', segnaposto: 'Un numero, con il segno', giuste: ['-3', '−3'],
        ok: 'Con segno −3 è maggiore di −8. JGE salta, e resta in EAX la copia di EDI.',
        diagnosi: [
          { se: ['-8', '−8'], msg: 'Ciò avverrebbe se il salto fosse escluso. Con segno −3 è maggiore di −8, e JGE salta quindi oltre la seconda MOV.' },
          { se: ['5'], msg: 'Il valore indicato è la differenza calcolata da CMP, che è scartata. In EAX resta uno dei due argomenti.' },
          { se: ['3', '8'], msg: 'La funzione restituisce uno dei due argomenti invariato, con il proprio segno.' }
        ],
        altro: 'Il valore è diverso. Si stabilisca se JGE salta, e si segua poi il ramo.',
        indizi: ['Dopo la prima istruzione EAX contiene −3.', 'JGE salta se EDI è maggiore o uguale a ESI, con segno: −3 è maggiore di −8.', 'Il salto avviene e oltrepassa `mov eax, esi`.'],
        svolgimento: ['`mov eax, edi`: EAX = −3.', '`cmp edi, esi`: confronto fra −3 e −8, con segno.', '−3 è maggiore: JGE salta a fine.', 'La funzione restituisce −3.'] },
      { d: 'La medesima funzione, con `mov eax, edi`, `cmp edi, esi`, `jge fine`, `mov eax, esi` e `ret`, riceve due argomenti arbitrari. Che cosa calcola?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il maggiore dei due argomenti, letti con segno', ok: true, fb: 'Se il primo è maggiore o uguale, resta la sua copia. Altrimenti EAX riceve il secondo. In entrambi i casi è restituito il maggiore.' },
        { t: 'Il minore dei due argomenti, letti con segno', fb: 'JGE oltrepassa la seconda MOV quando il primo argomento è maggiore o uguale: in tal caso resta il primo, cioè il maggiore.' },
        { t: 'La differenza fra i due argomenti', fb: 'La differenza è calcolata da CMP soltanto per scrivere i flag, ed è poi scartata.' }] }
    ],
    sfida: ['cslez2_6_05_random_assembly_05', 'Argomenti e lettura del codice ottimizzato']
  }
});
SL.unita266 = { QUARTA: { abs: 'neg eax', pos: 'xor eax, eax' }, calcola: (f, a) => (a >= 0 ? a : f === 'abs' ? -a : 0) };
