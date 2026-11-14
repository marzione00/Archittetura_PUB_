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
    if (o.ripresa) els.push(el.box(pre + 'h', o.x, o.y + 2 * py + 6, 3 * o.w + 2 * o.gap, o.h, 'alla ripresa', f >= 5 ? 'RIP = 0x4010 · RAX = ' + rax + (rax === p.r ? ' · il dato del programma è intatto' : ' · il dato del programma è perduto') : '·', f >= 5 ? (rax === p.r ? 'att' : 'err') : '', { cls: 'stretta' }));
    return els;
  };
  return { quadro };
})();
SL.registra('4.1.6', {
  titolo: 'Stato da preservare all’ingresso',
  obiettivo: 'Obiettivo: distinguere ciò che il processore salva da solo da ciò che deve salvare il codice di ingresso, e dire che cosa trova il programma alla ripresa se un registro viene dimenticato.',
  concetti: [['register', 'I dati del programma'], ['pila', 'Salvare e ripristinare'], ['gate', 'Il ritorno con IRETQ']],
  filigrana: ['register', 'pila', 'gate'],
  richiami: {
    carte: [
      { sim: 'pila', da: 'Dall’unità 4.1.5', t: 'Il frame di interruzione', d: 'Cinque valori posati dal processore: SS, RSP, RFLAGS, CS e RIP.' },
      { sim: 'gate', da: 'Dall’unità 4.1.5', t: 'Lo stub di ingresso', d: 'Le prime istruzioni del gestore, che salvano sulla pila i registri generali.' },
      { sim: 'pila', da: 'Dall’unità 2.6.2', t: 'PUSH e POP', d: 'PUSH posa un registro sulla pila. POP lo riprende.' }
    ],
    domanda: { d: 'Prima di proseguire: il frame di interruzione posato dal processore contiene il registro RAX?', o: [
      { t: 'No', ok: true, fb: 'Il frame contiene SS, RSP, RFLAGS, CS e RIP. I registri generali restano fuori.' },
      { t: 'Sì, insieme a tutti i registri generali', fb: 'Il processore salva soltanto i cinque valori che servono per tornare. Il resto tocca al software.' },
      { t: 'Sì, perché contiene il valore di ritorno', fb: 'RAX contiene il valore di ritorno di una funzione. Un interrupt arriva in un punto qualunque, e RAX può contenere qualsiasi dato.' }
    ] }
  },
  idea: {
    titolo: 'Tornare nel punto giusto non basta',
    termini: ['contesto', 'iretq'],
    testo: [
      'Il frame di interruzione contiene ciò che serve per tornare al punto giusto: l’indirizzo, la pila, i flag. Manca tutto il resto, cioè i registri generali, dove il programma tiene i risultati intermedi dei propri calcoli. Il processore li lascia come sono, perché salvarli tutti a ogni ingresso costerebbe tempo anche quando il gestore ne usa pochi.',
      'Il gestore però è un programma come gli altri, e usa gli stessi registri. Se scrive in RAX, il valore che il programma vi aveva lasciato va perduto. Per questo lo stub di ingresso copia sulla pila i registri che il gestore userà, e prima di uscire li ricarica. Frame e registri salvati formano insieme il [[contesto]] del programma sospeso.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Il gestore usa RAX, la pila ne conserva la copia', nota: 'Il programma aveva lasciato 37 in RAX. Il gestore vi scrive 255, e la copia sulla pila permetterà di rimettere 37.', els: SL.unita416.quadro('g', { r: 37, salva: 'si' }, 3, { x: 10, y: 8, w: 222, gap: 17, h: 56 }) },
      'L’uscita si fa con l’istruzione [[iretq|IRETQ]], che toglie il frame dalla pila e rimette al loro posto RIP, i flag e la pila del programma. IRETQ ripristina soltanto ciò che il processore aveva salvato, e ignora i registri generali.',
      'Ne segue che un ritorno può essere corretto a metà. Se lo stub dimentica un registro, il programma riprende dall’indirizzo giusto con un dato sbagliato. Un errore di questo tipo è difficile da trovare, perché si manifesta in un punto qualunque del programma, lontano dalla causa.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma ha lasciato in RAX un risultato intermedio quando arriva un interrupt. Il gestore userà RAX per scrivervi il numero 255. Sceglierai il valore del programma e il comportamento dello stub.',
      'Seguiremo RAX, la pila e RIP dall’ingresso fino a IRETQ. Dopo il caso proposto, togli il salvataggio e guarda che cosa ritrova il programma.'
    ],
    vedrai: [
      ['register', 'I registri', 'A sinistra: RAX e RIP, come li vede il processore in ogni momento.'],
      ['pila', 'La pila del kernel', 'Al centro: il frame di interruzione e, se c’è, la copia di RAX.'],
      ['gate', 'Chi lavora', 'A destra: il codice in esecuzione e l’istruzione appena eseguita.']
    ]
  },
  lab: {
    titolo: 'Che fine fa RAX',
    scena: { w: 860, h: 242 },
    atti: ['Il programma', 'L’ingresso', 'Il gestore', 'Il ritorno'],
    controlli: [
      { id: 'salva', tipo: 'scelta', eti: 'Lo stub', opzioni: [['si', 'salva e ripristina RAX'], ['no', 'dimentica RAX']], valore: 'si' },
      { id: 'r', tipo: 'scelta', eti: 'RAX del programma', opzioni: [[37, '37'], [120, '120']], valore: 37 }
    ],
    nota: 'I passi sono sempre sette. Il programma deve riprendere dall’indirizzo 0x4010.',
    previsione: {
      domanda: (p) => 'Il programma ha in RAX il valore ' + p.r + ' quando arriva un interrupt. Il gestore scrive 255 in RAX. Lo stub ' + (p.salva === 'si' ? 'salva RAX sulla pila e lo ripristina prima di uscire' : 'dimentica di salvare RAX') + '. Quale valore di RAX trova il programma alla ripresa?',
      opzioni: (p) => [[p.r, String(p.r)], [255, '255'], [0, '0']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Il programma trova ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.salva === 'si' ? 'La copia sulla pila viene ricaricata in RAX prima di IRETQ.' : 'IRETQ ripristina RIP, i flag e la pila. RAX resta come il gestore lo ha lasciato.'),
    costruisci(p) {
      const U = SL.unita416, passi = [], salva = p.salva === 'si', fine = salva ? p.r : 255;
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'REGISTRI', 'mono'), SL.el.nota('t1', 300, 0, 'PILA DEL KERNEL', 'mono'), SL.el.nota('t2', 580, 0, 'CODICE', 'mono')].concat(U.quadro('q', p, f, { x: 20, y: 24, w: 264, gap: 14, h: 58, ripresa: true }));
      const rax = [p.r, p.r, p.r, 255, fine, fine];
      const hud = (f) => [['RAX del programma', String(p.r), 'a'], ['RAX ora', String(rax[f])], ['Alla ripresa', f >= 5 ? String(fine) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Il programma', 'Il programma sta facendo un calcolo, e ha lasciato in RAX un risultato intermedio: ' + p.r + '. La prossima istruzione, a 0x4010, userà quel valore.',
        { chiedi: { d: 'Fra poco arriverà un interrupt. Il processore, da solo, salverà RAX?', o: ['Sì, nel frame di interruzione', 'No, il frame contiene altri valori'], g: 1, no: 'Il frame contiene SS, RSP, RFLAGS, CS e RIP. I registri generali restano dove sono.' } });
      P(1, 1, 'L’ingresso', 'Arriva l’interrupt. Il processore posa sulla pila del kernel il frame di interruzione, con l’indirizzo di ripresa 0x4010, ed entra nel gestore. RAX contiene ancora ' + p.r + ': nessuno lo ha toccato, e nessuno lo ha salvato.', { calc: 'frame: RIP = 0x4010 · RAX = ' + p.r });
      P(2, 1, 'Lo stub di ingresso', salva ? 'Lo stub esegue `push rax`, e una copia del valore ' + p.r + ' finisce sulla pila, sotto il frame. Ora esistono due copie del dato del programma.' : 'Lo stub passa subito al gestore senza salvare RAX. L’unica copia del valore ' + p.r + ' è quella nel registro.', { calc: salva ? 'push rax → copia = ' + p.r : 'nessuna copia' });
      P(3, 2, 'Il gestore al lavoro', 'Il gestore ha bisogno di un registro per il proprio lavoro, e usa RAX: vi scrive 255. ' + (salva ? 'Il valore ' + p.r + ' sopravvive nella copia sulla pila.' : 'Il valore ' + p.r + ' non esiste più da nessuna parte.'), { calc: 'mov rax, 255 → RAX = 255' });
      P(4, 3, 'Prima del ritorno', salva ? 'Il gestore ha finito. Lo stub esegue `pop rax`, e la copia torna nel registro: RAX vale di nuovo ' + p.r + '.' : 'Il gestore ha finito. Lo stub non ha nulla da ricaricare, e RAX resta a 255.', { calc: salva ? 'pop rax → RAX = ' + p.r : 'RAX = 255' });
      P(5, 3, 'IRETQ', '`iretq` toglie il frame dalla pila e rimette in RIP l’indirizzo 0x4010. Il programma riprende esattamente da dove era stato sospeso, e trova RAX = ' + fine + '.', { calc: 'RIP = 0x4010 · RAX = ' + fine, esito: ['RAX = ' + fine, salva ? 'si' : 'no'] });
      P(5, 3, salva ? 'Il programma non si è accorto di nulla' : 'Un ritorno corretto a metà', salva ? 'L’istruzione a 0x4010 usa RAX e vi trova ' + p.r + ', il valore che il programma aveva calcolato. Per il programma l’interrupt non è mai avvenuto.' : 'L’istruzione a 0x4010 usa RAX e vi trova 255 al posto di ' + p.r + '. L’indirizzo di ripresa è giusto, il dato è sbagliato. Il programma proseguirà con un risultato errato, senza alcun segnale.', { calc: 'RAX atteso ' + p.r + ' · RAX trovato ' + fine, esito: ['RAX = ' + fine, salva ? 'si' : 'no'] });
      return { passi, esito: fine };
    }
  },
  bilancio: {
    regola: [
      'Il processore salva soltanto il frame di interruzione. I registri generali che il gestore usa vanno salvati dallo stub di ingresso e ripristinati prima di uscire.',
      'IRETQ ripristina RIP, i flag e la pila del programma. Un registro generale dimenticato resta come il gestore lo ha lasciato.'
    ],
    errori: [
      ['Credere che IRETQ ripristini tutti i registri.', 'IRETQ riprende dalla pila soltanto i cinque valori del frame.'],
      ['Giudicare il ritorno dal solo indirizzo.', 'Un programma può riprendere dall’istruzione giusta con dati alterati. Il contesto comprende anche i registri generali.'],
      ['Salvare un registro senza ripristinarlo.', 'La copia sulla pila serve soltanto se viene ricaricata prima di IRETQ, nell’ordine inverso ai salvataggi.']
    ],
    saFare: ['Distinguere il frame di interruzione dal resto del contesto.', 'Seguire un registro generale attraverso stub e gestore.', 'Indicare che cosa ripristina IRETQ.'],
    esercizi: [
      { d: 'Un programma ha RBX = 90 quando arriva un interrupt. Lo stub salva e ripristina soltanto RAX. Il gestore scrive 7 in RBX. Quanto vale RBX alla ripresa?', segnaposto: 'Un numero', giuste: ['7', 'sette'],
        ok: 'RBX non è stato salvato, e resta come il gestore lo ha lasciato.',
        diagnosi: [
          { se: ['90', 'novanta'], msg: 'Lo stub ha salvato soltanto RAX. Nessuna copia di RBX può riportare il valore 90.' },
          { se: ['0', 'zero'], msg: 'Nessuno azzera i registri al ritorno: RBX conserva l’ultimo valore scritto.' }
        ],
        altro: 'Il numero è diverso. Ci si chieda se esiste una copia di RBX da ricaricare.',
        indizi: ['Lo stub salva soltanto RAX.', 'Il gestore scrive 7 in RBX.', 'IRETQ non tocca i registri generali.'],
        svolgimento: ['RBX non viene salvato.', 'Il gestore scrive 7 in RBX.', 'Alla ripresa RBX = 7.'] },
      { d: 'Quali valori ripristina l’istruzione `iretq`?', guida: 'Si scelga la risposta.', o: [
        { t: 'RIP, CS, RFLAGS, RSP e SS', ok: true, fb: 'Sono i cinque valori del frame di interruzione, quelli che il processore aveva posato all’ingresso.' },
        { t: 'Tutti i registri del programma', fb: 'I registri generali li ripristina lo stub, con una POP per ciascuno.' },
        { t: 'Soltanto RIP', fb: 'Insieme a RIP tornano il livello di privilegio, i flag e la pila del programma.' }] },
      { d: 'Lo stub esegue `push rax` e poi `push rbx`. In quale ordine deve ripristinarli prima di `iretq`?', guida: 'Si scelga la risposta.', o: [
        { t: 'Prima `pop rbx`, poi `pop rax`', ok: true, fb: 'L’ultimo dato posato è il primo a essere ripreso.' },
        { t: 'Prima `pop rax`, poi `pop rbx`', fb: 'In cima alla pila c’è RBX, posato per ultimo. Così i due valori finirebbero scambiati.' },
        { t: 'L’ordine è indifferente', fb: 'La pila restituisce i dati in ordine inverso. Un ordine sbagliato scambia i due registri.' }] }
    ]
  }
});
