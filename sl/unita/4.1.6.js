'use strict';
SL.unita416 = (() => {
  // fase: 0 il programma · 1 l'ingresso · 2 lo stub · 3 il gestore · 4 prima del ritorno · 5 IRETQ
  const quadro = (pre, p, f, o) => {
    const el = SL.el, salva = p.salva === 'si', els = [], x2 = o.x + o.w + o.gap, x3 = x2 + o.w + o.gap, py = o.h + 14;
    const rax = f <= 2 ? p.r : f === 3 ? 255 : salva ? p.r : 255;
    els.push(el.box(pre + 'a', o.x, o.y, o.w, o.h, 'registro RAX', String(rax), f === 3 ? 'att' : f >= 4 ? (rax === p.r ? 'on' : 'err') : 'on', { cls: 'stretta' }),
      el.box(pre + 'b', o.x, o.y + py, o.w, o.h, 'registro RIP', f === 0 || f === 5 ? '0x4010' : 'nel kernel', f === 5 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'c', x2, o.y, o.w, o.h, 'pila · frame di interruzione', f >= 1 && f <= 4 ? 'RIP = 0x4010' : '·', f === 1 ? 'att' : f > 1 && f <= 4 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'd', x2, o.y + py, o.w, o.h, 'pila · copia di RAX', f >= 2 && f <= 3 ? (salva ? String(p.r) : 'assente') : '·', f === 2 ? (salva ? 'att' : 'err') : f === 3 ? (salva ? 'on' : 'err') : '', { cls: 'stretta' }),
      el.box(pre + 'e', x3, o.y, o.w, o.h, 'in esecuzione', ['programma', 'processore', 'stub di ingresso', 'gestore', 'stub di uscita', 'programma'][f], f === 0 || f === 5 ? 'on' : 'att', { cls: 'stretta' }),
      el.box(pre + 'g', x3, o.y + py, o.w, o.h, 'istruzione', ['·', 'ingresso nel kernel', salva ? 'push rax' : 'nessun salvataggio', 'mov rax, 255', salva ? 'pop rax' : 'nessun ripristino', 'iretq'][f], f === 0 ? '' : 'on', { cls: 'stretta' }));
    if (o.ripresa) els.push(el.box(pre + 'h', o.x, o.y + 2 * py + 6, 3 * o.w + 2 * o.gap, o.h, 'alla ripresa', f >= 5 ? 'RIP = 0x4010 · RAX = ' + rax + (rax === p.r ? ' · il dato del programma è invariato' : ' · il dato del programma è perduto') : '·', f >= 5 ? (rax === p.r ? 'att' : 'err') : '', { cls: 'stretta' }));
    return els;
  };
  return { quadro };
})();
SL.registra('4.1.6', {
  titolo: 'Stato da preservare all’ingresso',
  obiettivo: 'Obiettivo: distinguere ciò che il processore salva autonomamente da ciò che deve essere salvato dal codice di ingresso, e indicare che cosa il programma trova alla ripresa se un registro è omesso.',
  concetti: [['register', 'I dati del programma'], ['pila', 'Salvataggio e ripristino'], ['gate', 'Il ritorno con IRETQ']],
  filigrana: ['register', 'pila', 'gate'],
  richiami: {
    carte: [
      { sim: 'pila', da: 'Dall’unità 4.1.5', t: 'Il frame di interruzione', d: 'Cinque valori depositati dal processore: SS, RSP, RFLAGS, CS e RIP.' },
      { sim: 'gate', da: 'Dall’unità 4.1.5', t: 'Lo stub di ingresso', d: 'Le prime istruzioni del gestore, che salvano sulla pila i registri generali.' },
      { sim: 'pila', da: 'Dall’unità 2.6.2', t: 'PUSH e POP', d: 'PUSH deposita un registro sulla pila. POP lo preleva.' }
    ],
    domanda: { d: 'Prima di proseguire: il frame di interruzione depositato dal processore contiene il registro RAX?', o: [
      { t: 'No', ok: true, fb: 'Il frame contiene SS, RSP, RFLAGS, CS e RIP. I registri generali ne sono esclusi.' },
      { t: 'Sì, insieme a tutti i registri generali', fb: 'Il processore salva soltanto i cinque valori necessari per il ritorno. Il resto spetta al software.' },
      { t: 'Sì, poiché contiene il valore di ritorno', fb: 'RAX contiene il valore di ritorno di una funzione. Un interrupt si verifica in un punto qualunque, e RAX può contenere qualsiasi dato.' }
    ] }
  },
  idea: {
    titolo: 'Il ritorno all’indirizzo corretto è insufficiente',
    termini: ['contesto', 'iretq'],
    testo: [
      'Il frame di interruzione contiene ciò che occorre per tornare al punto corretto: l’indirizzo, la pila, i flag. Ne sono esclusi i registri generali, nei quali il programma conserva i risultati intermedi dei propri calcoli. Il processore li lascia invariati, poiché il loro salvataggio a ogni ingresso richiederebbe tempo anche quando il gestore ne impiega pochi.',
      'Il gestore è tuttavia un programma come gli altri, e impiega i medesimi registri. Se scrive in RAX, il valore che il programma vi aveva lasciato va perduto. Per questa ragione lo stub di ingresso copia sulla pila i registri che il gestore impiegherà, e prima di uscire li ripristina. Frame e registri salvati formano insieme il [[contesto]] del programma sospeso.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Il gestore impiega RAX, la pila ne conserva la copia', nota: 'Il programma aveva lasciato 37 in RAX. Il gestore vi scrive 255, e la copia sulla pila consente di ripristinare 37.', els: SL.unita416.quadro('g', { r: 37, salva: 'si' }, 3, { x: 10, y: 8, w: 222, gap: 17, h: 56 }) },
      'L’uscita avviene con l’istruzione [[iretq|IRETQ]], che rimuove il frame dalla pila e ripristina RIP, i flag e la pila del programma. IRETQ ripristina soltanto ciò che il processore aveva salvato, e ignora i registri generali.',
      'Ne consegue che un ritorno può essere corretto soltanto in parte. Se lo stub omette un registro, il programma riprende dall’indirizzo corretto con un dato errato. Un errore di questo tipo è difficile da individuare, poiché si manifesta in un punto qualunque del programma, lontano dalla causa.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma ha lasciato in RAX un risultato intermedio quando si verifica un interrupt. Il gestore impiega RAX per scrivervi il numero 255. I controlli fissano il valore del programma e il comportamento dello stub.',
      'Si seguono RAX, la pila e RIP dall’ingresso fino a IRETQ. Dopo il caso proposto, è istruttivo escludere il salvataggio e osservare che cosa il programma ritrova.'
    ],
    vedrai: [
      ['register', 'I registri', 'A sinistra: RAX e RIP, come risultano al processore in ogni istante.'],
      ['pila', 'La pila del kernel', 'Al centro: il frame di interruzione e, se presente, la copia di RAX.'],
      ['gate', 'Chi lavora', 'A destra: il codice in esecuzione e l’istruzione appena eseguita.']
    ]
  },
  lab: {
    titolo: 'La sorte di RAX',
    scena: { w: 860, h: 242 },
    atti: ['Il programma', 'L’ingresso', 'Il gestore', 'Il ritorno'],
    controlli: [
      { id: 'salva', tipo: 'scelta', eti: 'Lo stub', opzioni: [['si', 'salva e ripristina RAX'], ['no', 'omette RAX']], valore: 'si' },
      { id: 'r', tipo: 'scelta', eti: 'RAX del programma', opzioni: [[37, '37'], [120, '120']], valore: 37 }
    ],
    nota: 'I passi sono sempre sette. Il programma deve riprendere dall’indirizzo 0x4010.',
    previsione: {
      domanda: (p) => 'Il programma ha in RAX il valore ' + p.r + ' quando si verifica un interrupt. Il gestore scrive 255 in RAX. Lo stub ' + (p.salva === 'si' ? 'salva RAX sulla pila e lo ripristina prima di uscire' : 'omette il salvataggio di RAX') + '. Quale valore di RAX trova il programma alla ripresa?',
      opzioni: (p) => [[p.r, String(p.r)], [255, '255'], [0, '0']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Il programma trova ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.salva === 'si' ? 'La copia sulla pila è ripristinata in RAX prima di IRETQ.' : 'IRETQ ripristina RIP, i flag e la pila. RAX resta al valore lasciato dal gestore.'),
    costruisci(p) {
      const U = SL.unita416, passi = [], salva = p.salva === 'si', fine = salva ? p.r : 255;
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'REGISTRI', 'mono'), SL.el.nota('t1', 300, 0, 'PILA DEL KERNEL', 'mono'), SL.el.nota('t2', 580, 0, 'CODICE', 'mono')].concat(U.quadro('q', p, f, { x: 20, y: 24, w: 264, gap: 14, h: 58, ripresa: true }));
      const rax = [p.r, p.r, p.r, 255, fine, fine];
      const hud = (f) => [['RAX del programma', String(p.r), 'a'], ['RAX ora', String(rax[f])], ['Alla ripresa', f >= 5 ? String(fine) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Il programma', 'Il programma sta eseguendo un calcolo, e ha lasciato in RAX un risultato intermedio: ' + p.r + '. La prossima istruzione, a 0x4010, impiegherà quel valore.',
        { chiedi: { d: 'Sta per verificarsi un interrupt. Il processore salverà autonomamente RAX?', o: ['Sì, nel frame di interruzione', 'No, il frame contiene altri valori'], g: 1, no: 'Il frame contiene SS, RSP, RFLAGS, CS e RIP. I registri generali restano invariati.' } });
      P(1, 1, 'L’ingresso', 'Si verifica l’interrupt. Il processore deposita sulla pila del kernel il frame di interruzione, con l’indirizzo di ripresa 0x4010, ed entra nel gestore. RAX contiene ancora ' + p.r + ': il registro è invariato, e nessuna copia è stata salvata.', { calc: 'frame: RIP = 0x4010 · RAX = ' + p.r });
      P(2, 1, 'Lo stub di ingresso', salva ? 'Lo stub esegue `push rax`, e una copia del valore ' + p.r + ' è depositata sulla pila, sotto il frame. Esistono ora due copie del dato del programma.' : 'Lo stub passa immediatamente al gestore senza salvare RAX. L’unica copia del valore ' + p.r + ' è quella nel registro.', { calc: salva ? 'push rax → copia = ' + p.r : 'nessuna copia' });
      P(3, 2, 'Il gestore in esecuzione', 'Il gestore richiede un registro per le proprie operazioni, e impiega RAX: vi scrive 255. ' + (salva ? 'Il valore ' + p.r + ' è conservato nella copia sulla pila.' : 'Il valore ' + p.r + ' è perduto.'), { calc: 'mov rax, 255 → RAX = 255' });
      P(4, 3, 'Prima del ritorno', salva ? 'Il gestore è terminato. Lo stub esegue `pop rax`, e la copia torna nel registro: RAX vale di nuovo ' + p.r + '.' : 'Il gestore è terminato. Lo stub non ha alcun valore da ripristinare, e RAX resta a 255.', { calc: salva ? 'pop rax → RAX = ' + p.r : 'RAX = 255' });
      P(5, 3, 'IRETQ', '`iretq` rimuove il frame dalla pila e ripristina in RIP l’indirizzo 0x4010. Il programma riprende esattamente dal punto in cui era stato sospeso, e trova RAX = ' + fine + '.', { calc: 'RIP = 0x4010 · RAX = ' + fine, esito: ['RAX = ' + fine, salva ? 'si' : 'no'] });
      P(5, 3, salva ? 'Il programma non rileva la sospensione' : 'Un ritorno corretto soltanto in parte', salva ? 'L’istruzione a 0x4010 impiega RAX e vi trova ' + p.r + ', il valore che il programma aveva calcolato. Per il programma l’interrupt è privo di effetti.' : 'L’istruzione a 0x4010 impiega RAX e vi trova 255 in luogo di ' + p.r + '. L’indirizzo di ripresa è corretto, il dato è errato. Il programma proseguirà con un risultato errato, senza alcuna segnalazione.', { calc: 'RAX atteso ' + p.r + ' · RAX trovato ' + fine, esito: ['RAX = ' + fine, salva ? 'si' : 'no'] });
      return { passi, esito: fine };
    }
  },
  bilancio: {
    regola: [
      'Il processore salva soltanto il frame di interruzione. I registri generali impiegati dal gestore vanno salvati dallo stub di ingresso e ripristinati prima dell’uscita.',
      'IRETQ ripristina RIP, i flag e la pila del programma. Un registro generale omesso resta al valore lasciato dal gestore.'
    ],
    errori: [
      ['Ritenere che IRETQ ripristini tutti i registri.', 'IRETQ preleva dalla pila soltanto i cinque valori del frame.'],
      ['Valutare il ritorno sulla base del solo indirizzo.', 'Un programma può riprendere dall’istruzione corretta con dati alterati. Il contesto comprende anche i registri generali.'],
      ['Salvare un registro senza ripristinarlo.', 'La copia sulla pila è utile soltanto se è ripristinata prima di IRETQ, nell’ordine inverso ai salvataggi.']
    ],
    saFare: ['Distinguere il frame di interruzione dal resto del contesto.', 'Seguire un registro generale attraverso stub e gestore.', 'Indicare i valori ripristinati da IRETQ.'],
    esercizi: [
      { d: 'Un programma ha RBX = 90 quando si verifica un interrupt. Lo stub salva e ripristina soltanto RAX. Il gestore scrive 7 in RBX. Quanto vale RBX alla ripresa?', segnaposto: 'Un numero', giuste: ['7', 'sette'],
        ok: 'RBX non è stato salvato, e resta al valore lasciato dal gestore.',
        diagnosi: [
          { se: ['90', 'novanta'], msg: 'Lo stub ha salvato soltanto RAX. Nessuna copia di RBX può riportare il valore 90.' },
          { se: ['0', 'zero'], msg: 'Nessuna operazione azzera i registri al ritorno: RBX conserva l’ultimo valore scritto.' }
        ],
        altro: 'Il numero è diverso. Va stabilito se esiste una copia di RBX da ripristinare.',
        indizi: ['Lo stub salva soltanto RAX.', 'Il gestore scrive 7 in RBX.', 'IRETQ lascia invariati i registri generali.'],
        svolgimento: ['RBX non è salvato.', 'Il gestore scrive 7 in RBX.', 'Alla ripresa RBX = 7.'] },
      { d: 'Quali valori ripristina l’istruzione `iretq`?', guida: 'Si scelga la risposta.', o: [
        { t: 'RIP, CS, RFLAGS, RSP e SS', ok: true, fb: 'Sono i cinque valori del frame di interruzione, depositati dal processore all’ingresso.' },
        { t: 'Tutti i registri del programma', fb: 'I registri generali sono ripristinati dallo stub, con una POP per ciascuno.' },
        { t: 'Soltanto RIP', fb: 'Insieme a RIP sono ripristinati il livello di privilegio, i flag e la pila del programma.' }] },
      { d: 'Lo stub esegue `push rax` e poi `push rbx`. In quale ordine deve ripristinarli prima di `iretq`?', guida: 'Si scelga la risposta.', o: [
        { t: 'Prima `pop rbx`, poi `pop rax`', ok: true, fb: 'L’ultimo dato depositato è il primo a essere prelevato.' },
        { t: 'Prima `pop rax`, poi `pop rbx`', fb: 'In cima alla pila si trova RBX, depositato per ultimo. Con tale ordine i due valori risulterebbero scambiati.' },
        { t: 'L’ordine è indifferente', fb: 'La pila restituisce i dati in ordine inverso. Un ordine errato scambia i due registri.' }] }
    ]
  }
});
