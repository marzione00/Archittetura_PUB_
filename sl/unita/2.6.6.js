'use strict';
SL.registra('2.6.6', {
  titolo: 'Un metodo di analisi del codice macchina',
  obiettivo: 'Alla fine saprai esaminare una funzione di cui hai soltanto le istruzioni: individuare che cosa riceve, seguirne i rami e dire che cosa calcola.',
  concetti: [['lente', 'Quattro domande'], ['fork', 'Un ramo alla volta'], ['bilancio', 'La descrizione per casi']],
  filigrana: ['lente', 'fork', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'segno', da: 'Dall’unità 2.6.3', t: 'JGE', d: 'Dopo un confronto, salta quando il primo operando è maggiore o uguale al secondo, letti con segno.' },
      { sim: 'segno', da: 'Dall’unità 2.2.7', t: 'NEG', d: 'Cambia di segno il contenuto di un registro.' },
      { sim: 'tabella', da: 'Dall’unità 2.2.4', t: 'La traccia con le lettere', d: 'Annotando accanto a ogni registro l’espressione che contiene, si riconosce che cosa calcola una sequenza di istruzioni.' }
    ],
    domanda: { d: 'Prima di proseguire: EAX contiene −7. Che cosa contiene dopo `neg eax`?', o: [
      { t: '7', ok: true, fb: 'NEG cambia di segno il contenuto del registro: da −7 a 7.' },
      { t: '−7', fb: 'NEG cambia il segno. Un numero negativo diventa positivo.' },
      { t: '0', fb: 'Zero si otterrebbe con `xor eax, eax`. NEG cambia il segno e conserva il valore assoluto.' }
    ] }
  },
  idea: {
    titolo: 'Quattro domande a una funzione sconosciuta',
    termini: ['disassemblatore'],
    testo: [
      'Capita di avere fra le mani una funzione di cui manca il sorgente: un programma da verificare, un difetto da cercare in una libreria. Lo strumento di partenza è il [[disassemblatore]], che compie il lavoro inverso dell’assemblatore. Legge i byte del codice macchina e scrive le istruzioni corrispondenti, come nell’unità 2.3.6. Ciò che restituisce è assembly privo di nomi e di commenti. Capire che cosa fa spetta a chi legge.',
      'Conviene procedere con metodo, ponendo quattro domande. La prima: che cosa entra. I registri degli argomenti che la funzione legge prima di averli scritti sono i suoi argomenti, e la vista usata ne rivela la larghezza. La seconda: che cosa esce. È ciò che si trova in RAX, o in una sua vista, quando si arriva a RET.',
      { fig: 'scena', w: 720, h: 76, titolo: 'Le quattro domande, nell’ordine', nota: 'Le prime due riguardano i confini della funzione, le altre due il suo interno.', els: [
        SL.el.box('a', 0, 0, 170, 60, 'prima', 'che cosa entra', 'on', { cls: 'stretta' }), SL.el.box('b', 183, 0, 170, 60, 'seconda', 'che cosa esce', 'on', { cls: 'stretta' }),
        SL.el.box('c', 366, 0, 170, 60, 'terza', 'quali rami', 'att', { cls: 'stretta' }), SL.el.box('d', 549, 0, 170, 60, 'quarta', 'dove si riuniscono', 'att', { cls: 'stretta' })] },
      'La terza domanda: quali strade esistono. Ogni salto condizionale divide il percorso in due rami, e conviene seguirli uno alla volta, annotando accanto a ogni registro l’espressione che contiene, con le lettere al posto dei numeri. La quarta: dove si riuniscono i rami, e con quale valore. Mettendo in fila le risposte dei diversi rami si ottiene una descrizione per casi, e dalla descrizione, spesso, un nome.',
      'Una cautela riguarda i valori di prova. Due funzioni diverse possono coincidere su molti argomenti e separarsi soltanto su alcuni. Conviene provare almeno un valore per ramo, e poi i valori di confine fra un ramo e l’altro, come lo zero.',
      'Quando ottimizza, il compilatore riscrive il codice in forme lontane dal sorgente: sostituisce le moltiplicazioni con LEA, elimina variabili, scambia l’ordine dei rami. Il metodo resta valido, perché guarda soltanto a ciò che entra, a ciò che esce e alle strade nel mezzo.'
    ]
  },
  esperimento: {
    faremo: [
      'Due funzioni di cinque istruzioni differiscono in una sola. Sceglierai quale esaminare e con quale argomento.',
      'Risponderemo alle quattro domande seguendo l’esecuzione, poi scriveremo la descrizione per casi. Dopo il caso proposto, prova lo stesso argomento sull’altra funzione, poi un argomento positivo su entrambe.'
    ],
    vedrai: [
      ['operation', 'Il listato', 'A sinistra: le cinque istruzioni, come le mostrerebbe un disassemblatore.'],
      ['register', 'I registri e i flag', 'Al centro: EDI, EAX e i due flag letti dal salto.'],
      ['bilancio', 'La descrizione per casi', 'A destra: che cosa restituisce la funzione su ciascun ramo.']
    ]
  },
  lab: {
    titolo: 'Una funzione senza nome',
    scena: { w: 860, h: 348 },
    atti: ['Che cosa entra', 'La copia', 'La decisione', 'Il ramo', 'Il punto di riunione', 'Un nome per la funzione'],
    controlli: [
      { id: 'f', tipo: 'scelta', eti: 'Funzione', opzioni: [['abs', 'la prima'], ['pos', 'la seconda']], valore: 'abs' },
      { id: 'a', tipo: 'scelta', eti: 'Argomento, in EDI', opzioni: [[-7, '−7'], [7, '7'], [0, '0'], [-50, '−50'], [23, '23']], valore: -7 }
    ],
    nota: 'Le due funzioni differiscono soltanto nella quarta istruzione.',
    previsione: {
      domanda: (p) => 'Una funzione entra con EDI = ' + SL.x86.num(p.a) + ' ed esegue `mov eax, edi`, `cmp edi, 0`, `jge fine`, `' + SL.unita266.QUARTA[p.f] + '` e, all’etichetta fine, `ret`. Quale valore restituisce?',
      opzioni: (p) => Array.from(new Set([SL.unita266.calcola(p.f, p.a), p.a, -p.a, 0, Math.abs(p.a), p.a + 1])).slice(0, 4).sort((x, y) => x - y).map((v) => [v, SL.x86.num(v)])
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + SL.x86.num(pred) + '. La funzione restituisce ' + SL.x86.num(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.a >= 0 ? 'L’argomento è maggiore o uguale a zero: JGE salta, la quarta istruzione viene scavalcata e resta la copia dell’argomento.' : 'L’argomento è negativo: JGE resta fermo e la quarta istruzione viene eseguita.'),
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
          el.box('jg', 280, 222, 170, 62, 'JGE', o.salto == null ? '·' : o.salto ? 'salta' : 'resta fermo', o.salto != null && o.reg === 'jg' ? 'att' : '', { cls: 'stretta' }),
          el.nota('n1', 470, 4, 'LE QUATTRO DOMANDE', 'mono'),
          el.box('q1', 470, 28, 370, 46, 'che cosa entra', o.dom >= 1 ? 'a, un intero con segno, in EDI' : '·', o.dom === 1 ? 'att' : o.dom > 1 ? 'on' : '', { cls: 'stretta' }),
          el.box('q2', 470, 80, 370, 46, 'che cosa esce', o.dom >= 1 ? 'il contenuto di EAX' : '·', o.dom === 1 ? 'att' : o.dom > 1 ? 'on' : '', { cls: 'stretta' }),
          el.box('q3', 470, 132, 370, 46, 'ramo per a maggiore o uguale a 0', st.casi[0] || '·', o.caso === 0 ? 'att' : st.casi[0] ? 'on' : '', { cls: 'stretta' }),
          el.box('q4', 470, 184, 370, 46, 'ramo per a negativo', st.casi[1] || '·', o.caso === 1 ? 'att' : st.casi[1] ? 'on' : '', { cls: 'stretta' }),
          el.box('q5', 470, 238, 370, 46, 'la funzione calcola', st.nome || '·', st.nome ? 'att' : '', { cls: 'stretta' }),
          el.box('fin', 20, 294, 820, 46, null, o.fine ? 'per a = ' + N(a) + ' restituisce ' + N(ris) : '·', o.fine ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Argomento', N(a), 'a'], ['EAX', st.eax == null ? '?' : N(st.eax)], ['Calcola', st.breve || '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ dom: 1, reg: 'edi' }, 0, 'Che cosa entra, che cosa esce', 'La prima istruzione legge EDI prima che la funzione vi abbia scritto qualcosa. EDI contiene dunque un argomento, e la vista a 32 bit dice che è un intero di quattro byte. Nessun altro registro degli argomenti viene letto. Il risultato sarà ciò che si trova in EAX all’arrivo a RET.',
        { chiedi: { d: 'Quanti argomenti riceve la funzione?', o: ['Uno', 'Due', 'Nessuno'], g: 0, no: 'L’unico registro degli argomenti letto prima di essere scritto è EDI. La funzione riceve un solo argomento.' } });
      st.eax = a;
      P({ dom: 2, riga: 0, reg: 'eax' }, 1, 'Una copia dell’argomento', 'MOV copia EDI in EAX. Con le lettere: EAX contiene a. Se la funzione finisse qui, restituirebbe l’argomento così com’è.', { calc: 'EAX = a = ' + N(a) });
      st.sf = neg ? 1 : 0;
      P({ dom: 2, riga: 1, reg: 'fl' }, 2, 'Il confronto con zero', 'CMP sottrae 0 da EDI e scrive i flag. La differenza è l’argomento stesso, ' + N(a) + ': SF ne copia il segno e vale ' + st.sf + ', mentre OF vale 0, perché togliere zero non può far uscire dall’intervallo.',
        { calc: N(a) + ' − 0 · SF = ' + st.sf + ' · OF = 0', chiedi: { d: 'JGE salta quando SF e OF sono uguali, cioè quando EDI è maggiore o uguale a zero. Con EDI = ' + N(a) + ', il salto parte?', o: ['Sì', 'No'], g: neg ? 1 : 0, no: neg ? 'L’argomento è negativo: SF vale 1, OF vale 0, e il salto resta fermo.' : 'L’argomento è maggiore o uguale a zero: SF e OF valgono entrambi 0, e il salto parte.' } });
      st.casi[neg ? 1 : 0] = neg ? null : 'restituisce a';
      P({ dom: 2, riga: 2, reg: 'jg', salto: !neg, caso: neg ? null : 0 }, 2, neg ? 'Il salto resta fermo' : 'Il salto parte', 'Il salto divide la funzione in due rami. ' + (neg ? 'L’argomento è negativo, SF e OF sono diversi, e JGE resta fermo: l’esecuzione prosegue con la quarta istruzione.' : 'L’argomento è maggiore o uguale a zero, SF e OF sono uguali, e JGE salta a 0x401009. Su questo ramo EAX contiene ancora a.'), { calc: neg ? 'ramo dei negativi' : 'ramo per a ≥ 0' });
      if (neg) {
        st.eax = ris; st.casi[1] = ABS ? 'restituisce −a' : 'restituisce 0';
        P({ dom: 2, riga: 3, reg: 'eax', caso: 1, salto: false }, 3, ABS ? 'Il cambio di segno' : 'L’azzeramento', (ABS ? 'NEG cambia di segno EAX, che passa da ' + N(a) + ' a ' + N(ris) + '. Con le lettere: su questo ramo EAX contiene −a.' : 'XOR di EAX con sé stesso lo azzera. Su questo ramo EAX contiene 0, qualunque fosse l’argomento.'), { calc: ABS ? '−(' + N(a) + ') = ' + N(ris) : 'EAX = 0' });
      } else {
        P({ dom: 2, riga: 4, saltata: true, caso: 0, salto: true }, 3, 'La quarta istruzione scavalcata', 'Su questo ramo l’istruzione `' + U.QUARTA[p.f] + '` non viene eseguita. Per sapere che cosa fa la funzione con un argomento negativo occorre seguire anche l’altro ramo, con un altro valore di prova oppure a mente.', { calc: 'EAX = a = ' + N(a) });
      }
      st.casi = ['restituisce a', ABS ? 'restituisce −a' : 'restituisce 0'];
      P({ dom: 3, riga: 4, reg: 'eax', saltata: !neg, fine: true }, 4, 'I rami si riuniscono', 'I due rami arrivano entrambi a RET, a 0x401009. ' + (neg ? 'Su quello appena percorso EAX contiene ' + N(ris) + '. Sull’altro, riservato agli argomenti maggiori o uguali a zero, la quarta istruzione viene scavalcata e resta la copia dell’argomento.' : 'Su quello appena percorso EAX contiene ' + N(ris) + '. Sull’altro, riservato agli argomenti negativi, viene eseguita anche `' + U.QUARTA[p.f] + '`, che ' + (ABS ? 'cambia il segno.' : 'azzera il registro.')), { calc: 'EAX = ' + N(ris) });
      st.nome = ABS ? 'il valore assoluto di a' : 'la parte positiva di a'; st.breve = ABS ? 'valore assoluto' : 'parte positiva';
      P({ dom: 3, riga: 4, saltata: !neg, fine: true }, 5, ABS ? 'Il valore assoluto' : 'La parte positiva', 'La descrizione per casi è completa: per a maggiore o uguale a zero la funzione restituisce a, per a negativo restituisce ' + (ABS ? '−a. È il valore assoluto.' : '0. È la funzione che conserva i numeri positivi e sostituisce i negativi con zero.') + ' Sugli argomenti maggiori o uguali a zero le due funzioni di questo esperimento coincidono: per distinguerle serve un argomento negativo.', { calc: ABS ? '|' + N(a) + '| = ' + N(ris) : 'max(' + N(a) + ', 0) = ' + N(ris), esito: ['restituisce ' + N(ris), 'si'] });
      return { passi, esito: ris };
    }
  },
  bilancio: {
    regola: [
      'Per leggere una funzione senza sorgente si pongono quattro domande: che cosa entra, che cosa esce, quali rami esistono, dove si riuniscono e con quale valore.',
      'Ogni ramo va seguito per conto proprio, con le lettere al posto dei numeri. La descrizione per casi che ne risulta dice che cosa calcola la funzione.'
    ],
    errori: [
      ['Provare la funzione con un solo valore.', 'Con l’argomento 7 le due funzioni dell’esperimento restituiscono entrambe 7. Si distinguono soltanto sugli argomenti negativi.'],
      ['Trascurare i valori di confine.', 'Lo zero sta sul confine fra i due rami. Occorre controllare da quale parte lo manda il salto.'],
      ['Leggere le istruzioni come se venissero eseguite tutte.', 'Un’istruzione scritta dopo un salto condizionale viene eseguita soltanto su uno dei rami.']
    ],
    saFare: ['Individuo gli argomenti e il risultato di una funzione dal suo codice.', 'Seguo separatamente i rami di un salto condizionale.', 'Scrivo la descrizione per casi e ne ricavo che cosa calcola la funzione.'],
    esercizi: [
      { d: 'Una funzione esegue `mov eax, edi`, `cmp edi, esi`, `jge fine`, `mov eax, esi` e, all’etichetta fine, `ret`. Entra con EDI = −3 ed ESI = −8. Quale valore restituisce?', segnaposto: 'Un numero, con il segno', giuste: ['-3', '−3'],
        ok: 'Con segno −3 è maggiore di −8. JGE salta, e resta in EAX la copia di EDI.',
        diagnosi: [
          { se: ['-8', '−8'], msg: 'Sarebbe così se il salto restasse fermo. Con segno −3 è maggiore di −8, quindi JGE parte e scavalca la seconda MOV.' },
          { se: ['5'], msg: 'Questa è la differenza calcolata da CMP, che viene scartata. In EAX finisce uno dei due argomenti.' },
          { se: ['3', '8'], msg: 'La funzione restituisce uno dei due argomenti così com’è, con il suo segno.' }
        ],
        altro: 'Il valore è diverso. Stabilisci se JGE parte, poi segui il ramo.',
        indizi: ['Dopo la prima istruzione EAX contiene −3.', 'JGE salta se EDI è maggiore o uguale a ESI, con segno: −3 è maggiore di −8.', 'Il salto parte e scavalca `mov eax, esi`.'],
        svolgimento: ['`mov eax, edi`: EAX = −3.', '`cmp edi, esi`: confronto fra −3 e −8, con segno.', '−3 è maggiore: JGE salta a fine.', 'La funzione restituisce −3.'] },
      { d: 'La stessa funzione, con `mov eax, edi`, `cmp edi, esi`, `jge fine`, `mov eax, esi` e `ret`, riceve due argomenti qualunque. Che cosa calcola?', guida: 'Scegli la risposta.', o: [
        { t: 'Il maggiore dei due argomenti, letti con segno', ok: true, fb: 'Se il primo è maggiore o uguale, resta la sua copia. Altrimenti EAX riceve il secondo. In entrambi i casi esce il maggiore.' },
        { t: 'Il minore dei due argomenti, letti con segno', fb: 'JGE scavalca la seconda MOV quando il primo argomento è maggiore o uguale: in quel caso resta il primo, cioè il maggiore.' },
        { t: 'La differenza fra i due argomenti', fb: 'La differenza è calcolata da CMP soltanto per scrivere i flag, e poi viene scartata.' }] }
    ],
    sfida: ['cslez2_6_05_random_assembly_05', 'Argomenti e lettura del codice ottimizzato']
  }
});
SL.unita266 = { QUARTA: { abs: 'neg eax', pos: 'xor eax, eax' }, calcola: (f, a) => (a >= 0 ? a : f === 'abs' ? -a : 0) };
