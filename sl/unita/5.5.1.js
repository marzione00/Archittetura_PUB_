'use strict';
SL.unita551 = (() => {
  const ORD = { serie: ['Al', 'As', 'Bl', 'Bs'], inter: ['Al', 'Bl', 'As', 'Bs'], inter2: ['Al', 'Bl', 'Bs', 'As'] };
  // esegue la sequenza e restituisce gli stati dopo ogni operazione
  const esegui = (p) => { let c = p.x, ra = null, rb = null; const S = [{ c, ra, rb, op: '' }]; ORD[p.ord].forEach((op) => { if (op === 'Al') ra = c; else if (op === 'Bl') rb = c; else if (op === 'As') c = ra + 1; else c = rb + 1; S.push({ c, ra, rb, op }); }); return S; };
  const finale = (p) => { const S = esegui(p); return S[S.length - 1].c; };
  const scena = (pre, s, o) => {
    const el = SL.el, w3 = (o.w - 2 * o.gap) / 3, T = { Al: 'A legge', As: 'A scrive', Bl: 'B legge', Bs: 'B scrive' };
    return [el.box(pre + 'a', o.x, o.y, w3, o.h, 'registro di A · privato', s.ra == null ? '·' : String(s.ra), s.op === 'Al' ? 'att' : s.ra == null ? '' : 'on', { cls: 'stretta' }),
      el.box(pre + 'c', o.x + w3 + o.gap, o.y, w3, o.h, 'contatore · condiviso', String(s.c), s.op === 'As' || s.op === 'Bs' ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'b', o.x + 2 * (w3 + o.gap), o.y, w3, o.h, 'registro di B · privato', s.rb == null ? '·' : String(s.rb), s.op === 'Bl' ? 'att' : s.rb == null ? '' : 'on', { cls: 'stretta' }),
      el.box(pre + 'o', o.x + w3 + o.gap, o.y + o.h + 12, w3, o.h, 'operazione', s.op ? T[s.op] : '·', s.op ? 'att' : '', { cls: 'stretta' })];
  };
  return { ORD, esegui, finale, scena };
})();
SL.registra('5.5.1', {
  titolo: 'Intercalazioni e aggiornamenti persi',
  obiettivo: 'Obiettivo: spiegare come due incrementi dello stesso contatore possano produrne uno solo, e riconoscere l’ordine di operazioni che causa la perdita.',
  concetti: [['thread', 'Due thread, un contatore'], ['register', 'Leggere, sommare, scrivere'], ['conflitto', 'Un incremento sparisce']],
  filigrana: ['conflitto', 'thread', 'register'],
  richiami: {
    carte: [
      { sim: 'thread', da: 'Dall’unità 5.4.1', t: 'Cella comune, registri privati', d: 'Una scrittura in memoria non aggiorna i registri degli altri thread.' },
      { sim: 'coda', da: 'Dall’unità 5.3.1', t: 'La prelazione', d: 'Lo scheduler può interrompere un thread fra due istruzioni qualsiasi.' },
      { sim: 'thread', da: 'Dall’unità 5.4.2', t: 'La concorrenza', d: 'Due thread vivi insieme si alternano, oppure eseguono in parallelo.' }
    ],
    domanda: { d: 'Prima di proseguire: un thread ha copiato una cella nel proprio registro. Un altro thread modifica la cella. Che cosa contiene il registro del primo?', o: [
      { t: 'Il valore copiato, ormai superato', ok: true, fb: 'Il registro è privato, e non segue i cambiamenti della cella.' },
      { t: 'Il valore nuovo', fb: 'Il registro si aggiorna soltanto con una nuova lettura.' },
      { t: 'Un valore indefinito', fb: 'Il registro conserva esattamente ciò che vi era stato copiato.' }
    ] }
  },
  idea: {
    titolo: 'Un incremento non è un gesto solo',
    termini: ['intercalazione', 'aggiornamento perso', 'corsa critica', 'operazione atomica'],
    testo: [
      'Due thread contano le richieste arrivate a un servizio. A ogni richiesta, chi la riceve aggiunge 1 a un contatore comune. Nel programma è una riga sola, contatore = contatore + 1. Per il processore sono tre passi: leggere la cella in un registro, sommare 1 nel registro, scrivere il registro nella cella. Fra un passo e l’altro lo scheduler può dare il turno all’altro thread, oppure l’altro thread sta già eseguendo su un secondo core.',
      'Il modo in cui i passi di due thread si mescolano nel tempo si chiama [[intercalazione]]. Alcune sono innocue. Se A legge 4, scrive 5, e soltanto dopo B legge 5 e scrive 6, il contatore registra entrambe le richieste. Ma se A legge 4, e prima che scriva anche B legge 4, ciascuno calcola 5 nel proprio registro e ciascuno scrive 5. Due richieste, e il contatore è cresciuto di uno.',
      { fig: 'scena', w: 720, h: 138, titolo: 'A e B hanno letto entrambi 4, e hanno scritto entrambi 5', nota: 'La seconda scrittura ha ripetuto la prima. Il contatore vale 5, e le richieste erano due.', els: SL.unita551.scena('g', SL.unita551.esegui({ x: 4, ord: 'inter' })[4], { x: 10, y: 0, w: 700, gap: 12, h: 54 }) },
      'È un [[aggiornamento perso]]: la scrittura di B ha coperto quella di A, perché partiva da un valore letto prima che A scrivesse. Nessuna istruzione ha funzionato male. Ogni lettura e ogni scrittura, presa da sola, è una [[operazione atomica]]: avviene per intero, e nessuno può osservarla a metà. A non essere atomico è l’incremento, che di operazioni ne richiede due, con uno spazio in mezzo.',
      'Quando l’esito di un programma dipende dall’intercalazione, cioè da chi arriva prima, si parla di [[corsa critica]]. È un difetto difficile da scovare, perché si manifesta di rado. Lo stesso programma può dare il risultato giusto mille volte, e sbagliare quando lo scheduler interrompe un thread proprio fra la lettura e la scrittura.'
    ]
  },
  esperimento: {
    faremo: [
      'A e B devono incrementare una volta ciascuno lo stesso contatore. Sceglierai il valore iniziale e l’ordine in cui si susseguono le loro quattro operazioni: due letture e due scritture.',
      'Seguiremo il contatore e i due registri un’operazione alla volta. Cerca, in ogni ordine, da quale lettura proviene il valore che ciascuno scrive.'
    ],
    vedrai: [
      ['register', 'I registri', 'Ai lati: il valore che A e B hanno letto e su cui lavorano.'],
      ['memory', 'Il contatore', 'Al centro: la cella comune, e l’operazione appena eseguita.']
    ]
  },
  lab: {
    titolo: 'Due incrementi, quattro operazioni',
    scena: { w: 860, h: 140 },
    atti: ['L’inizio', 'Le operazioni', 'L’esito'],
    controlli: [
      { id: 'x', tipo: 'scelta', eti: 'Valore iniziale', opzioni: [[4, '4'], [10, '10']], valore: 4 },
      { id: 'ord', tipo: 'scelta', eti: 'Ordine', opzioni: [['inter', 'A legge, B legge, A scrive, B scrive'], ['serie', 'A legge, A scrive, B legge, B scrive'], ['inter2', 'A legge, B legge, B scrive, A scrive']], valore: 'inter' }
    ],
    nota: 'I passi sono sempre sei. Ogni thread scrive il valore letto aumentato di 1.',
    previsione: {
      domanda: (p) => 'Il contatore vale ' + p.x + '. A e B lo incrementano una volta ciascuno, e le loro operazioni avvengono in quest’ordine: ' + { inter: 'A legge, B legge, A scrive, B scrive', serie: 'A legge, A scrive, B legge, B scrive', inter2: 'A legge, B legge, B scrive, A scrive' }[p.ord] + '. Quanto vale il contatore alla fine?',
      opzioni: (p) => [[p.x, p.x + ', come all’inizio'], [p.x + 1, String(p.x + 1)], [p.x + 2, String(p.x + 2)]]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Il contatore vale ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.ord === 'serie' ? 'B ha letto dopo la scrittura di A, e ha lavorato sul valore aggiornato.' : 'Entrambi hanno letto ' + p.x + ' prima di qualunque scrittura, ed entrambi hanno scritto ' + (p.x + 1) + '.'),
    costruisci(p) {
      const U = SL.unita551, S = U.esegui(p), passi = [], fin = S[4].c, perso = fin === p.x + 1;
      const P = (k, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Contatore', String(S[k].c), 'a'], ['Registro di A', S[k].ra == null ? '·' : String(S[k].ra)], ['Registro di B', S[k].rb == null ? '·' : String(S[k].rb), 'c']], els: U.scena('q', S[k], { x: 20, y: 0, w: 820, gap: 14, h: 56 }) }, extra));
      const T = { Al: ['A legge', (s) => 'A copia il contatore nel proprio registro: ' + s.ra + '.'], Bl: ['B legge', (s) => 'B copia il contatore nel proprio registro: ' + s.rb + '.'], As: ['A scrive', (s) => 'A somma 1 al valore letto, ' + s.ra + ', e scrive il risultato nel contatore: ' + (s.ra + 1) + '.'], Bs: ['B scrive', (s) => 'B somma 1 al valore letto, ' + s.rb + ', e scrive il risultato nel contatore: ' + (s.rb + 1) + '.'] };

      P(0, 0, 'Due richieste', 'Il contatore vale ' + p.x + '. Arrivano due richieste, una ad A e una a B. Dopo due incrementi dovrebbe valere ' + (p.x + 2) + '.', {});
      for (let k = 1; k <= 4; k++) { const op = S[k].op, prima = S[k - 1]; let extra = { calc: T[op][0] };
        if (k === 2 && op === 'Bl') extra.chiedi = { d: 'A ha già letto ' + p.x + ', ma non ha ancora scritto. Quale valore legge B?', o: [String(p.x), String(p.x + 1)], g: 0, no: 'Il contatore cambia soltanto con una scrittura, e nessuno ha ancora scritto.' };
        if (k === 3 && op === 'Bl') extra.chiedi = { d: 'A ha già scritto. Quale valore legge B?', o: [String(p.x), String(p.x + 1)], g: 1, no: 'La scrittura di A ha portato il contatore a ' + (p.x + 1) + '.' };
        P(k, 1, T[op][0], T[op][1](S[k]) + (k === 4 && perso ? ' Il contatore conteneva già ' + prima.c + ': questa scrittura non aggiunge nulla.' : ''), extra); }
      P(4, 2, perso ? 'Un aggiornamento perso' : 'Entrambi gli incrementi contati', perso ? 'Il contatore vale ' + fin + ', e le richieste erano due. I due thread hanno letto lo stesso ' + p.x + ', e la seconda scrittura ha coperto la prima. Nessuna operazione ha fallito: è l’ordine che ha fatto sparire un incremento.' : 'Il contatore vale ' + fin + '. Ogni thread ha completato lettura e scrittura prima che l’altro cominciasse, e ha lavorato su un valore aggiornato. Nulla però obbligava i thread a questo ordine.', { esito: [fin + (perso ? ' · un incremento perso' : ' · corretto'), perso ? 'no' : 'si'] });
      return { passi, esito: fin };
    }
  },
  bilancio: {
    regola: [
      'Un incremento è fatto di una lettura e di una scrittura. Se un altro thread scrive fra le due, il suo aggiornamento viene perso.',
      'Un risultato che dipende dall’intercalazione delle operazioni è una corsa critica.'
    ],
    errori: [
      ['Credere che una riga di programma sia indivisibile.', 'Per il processore sono più istruzioni, e fra una e l’altra può inserirsi un altro thread.'],
      ['Fidarsi delle prove.', 'L’intercalazione che fa perdere un aggiornamento è rara, e una prova può non incontrarla mai.'],
      ['Pensare che il problema richieda più core.', 'Basta un core e una prelazione nel punto sbagliato.']
    ],
    saFare: ['Scomporre un incremento in lettura e scrittura.', 'Seguire una intercalazione e ne ricavo il valore finale.', 'Riconoscere un aggiornamento perso.'],
    esercizi: [
      { d: 'Un contatore vale 20. Tre thread, A, B e C, lo incrementano una volta ciascuno. Tutti e tre leggono prima che qualcuno scriva, e poi scrivono uno dopo l’altro. Quanto vale il contatore alla fine?', segnaposto: 'Un numero', giuste: ['21', 'ventuno'],
        ok: 'Tutti e tre hanno letto 20, e tutti scrivono 21.',
        diagnosi: [
          { se: ['23', 'ventitre'], msg: 'Sarebbe 23 se ogni thread leggesse dopo la scrittura del precedente. Qui leggono tutti 20.' },
          { se: ['22', 'ventidue'], msg: 'Nessuno dei tre ha visto la scrittura di un altro: partono tutti da 20.' }
        ],
        altro: 'Il valore è diverso. Si scriva che cosa ha letto ciascun thread, e che cosa scrive.',
        indizi: ['Le tre letture avvengono prima di ogni scrittura.', 'Ogni thread ha nel registro 20.', 'Ognuno scrive 21.'],
        svolgimento: ['Letture: 20, 20, 20.', 'Scritture: 21, 21, 21.', 'Valore finale: 21.'] },
      { d: 'Nella stessa situazione, quanti incrementi sono andati perduti?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: 'Gli incrementi erano tre, e il contatore è cresciuto di uno: 3 − 1 = 2.',
        diagnosi: [
          { se: ['1', 'uno'], msg: 'Il contatore doveva arrivare a 23 ed è a 21: mancano due unità.' },
          { se: ['3', 'tre'], msg: 'Un incremento è stato registrato: il contatore è passato da 20 a 21.' }
        ],
        altro: 'Il numero è diverso. Si confronti il valore atteso con quello ottenuto.',
        indizi: ['Valore atteso: 20 + 3 = 23.', 'Valore ottenuto: 21.', '23 − 21 = 2.'],
        svolgimento: ['Atteso: 23.', 'Ottenuto: 21.', 'Persi: 2.'] },
      { d: 'Su un computer con un solo core, due thread incrementano lo stesso contatore senza alcuna protezione. Può verificarsi un aggiornamento perso?', guida: 'Si scelga la risposta.', o: [
        { t: 'Sì, se la prelazione cade fra la lettura e la scrittura di un thread', ok: true, fb: 'L’altro thread legge il valore vecchio, e uno dei due aggiornamenti viene coperto.' },
        { t: 'No: su un core i thread non eseguono insieme', fb: 'I thread si alternano, e l’alternanza può cadere a metà di un incremento.' },
        { t: 'No: l’incremento è una sola riga', fb: 'La riga corrisponde a più istruzioni del processore.' }] }
    ],
    sfida: ['cslez5_5_01_semaphores', 'Corse sui dati e aggiornamenti persi']
  }
});
