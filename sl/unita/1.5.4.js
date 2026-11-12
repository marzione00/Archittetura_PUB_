'use strict';
SL.registra('1.5.4', {
  titolo: 'Tempi, propagazione e impulsi transitori',
  obiettivo: 'Alla fine saprai spiegare perché l’uscita di un circuito può essere sbagliata per qualche istante dopo un cambio degli ingressi, e calcolare quanto dura l’errore.',
  concetti: [['clock', 'Ritardo'], ['porta', 'Porta'], ['conflitto', 'Impulso']],
  filigrana: ['clock', 'porta', 'conflitto'],
  richiami: {
    carte: [
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'OR e NOT', d: 'La OR vale 1 quando almeno un ingresso vale 1. La NOT rovescia il suo ingresso.' },
      { sim: 'clock', da: 'Dall’unità 1.2.1', t: 'I bit sono tensioni', d: 'Su un filo un bit è una tensione, bassa per lo 0 e alta per l’1.' },
      { sim: 'tabella', da: 'Dall’unità 1.5.1', t: 'La tabella di verità', d: 'Dice quanto vale l’uscita per ogni combinazione degli ingressi, una volta che i segnali sono fermi.' }
    ],
    domanda: { d: 'Prima di proseguire: una porta OR riceve A e l’uscita di una NOT applicata allo stesso A. Quanto vale l’uscita, secondo la tabella di verità?', o: [
      { t: 'Dipende da A', fb: 'Se A vale 1 la OR riceve 1 e 0. Se A vale 0 riceve 0 e 1. In entrambi i casi almeno un ingresso vale 1.' },
      { t: 'Sempre 1', ok: true, fb: 'Uno dei due ingressi della OR vale sempre 1, qualunque sia A.' },
      { t: 'Sempre 0', fb: 'La OR dà 0 soltanto con entrambi gli ingressi a 0, e qui i due ingressi sono sempre opposti.' }
    ] }
  },
  idea: {
    titolo: 'Anche i segnali arrivano in ritardo',
    termini: ['ritardo di propagazione', 'impulso transitorio'],
    testo: [
      'Nelle unità precedenti una porta rispondeva all’istante. Una porta vera ha bisogno di un po’ di tempo: quando un ingresso cambia, la tensione in uscita impiega qualche frazione di miliardesimo di secondo per assestarsi sul nuovo valore. Questo tempo si chiama [[ritardo di propagazione]].',
      'Sembra un tempo trascurabile, e per noi lo è. Un processore però esegue miliardi di operazioni al secondo, e a quella velocità pochi miliardesimi di secondo sono tutto il tempo disponibile. La risposta di un circuito è valida soltanto dopo che il segnale ha attraversato il percorso più lento.',
      'I percorsi dentro un circuito hanno lunghezze diverse. Quando un ingresso cambia, la notizia raggiunge una porta prima lungo un filo e più tardi lungo un altro. Per un momento la porta vede un valore nuovo su un ingresso e un valore vecchio sull’altro, e produce un’uscita che la tabella di verità non prevede. Questa uscita sbagliata e passeggera si chiama [[impulso transitorio]].',
      'L’esempio più semplice è il circuito del richiamo: una OR che riceve A e il suo contrario. Sulla carta l’uscita vale sempre 1. Facciamo scendere A da 1 a 0. Il ramo diretto porta lo 0 alla OR dopo un certo ritardo. Il ramo che passa dalla NOT deve salire a 1, e impiega un ritardo diverso. Se il ramo diretto arriva per primo, per qualche istante la OR vede due zeri e la sua uscita scende a 0.',
      { fig: 'scena', w: 700, h: 150, titolo: 'Due strade di lunghezza diversa', nota: 'La notizia del cambio di A arriva alla OR lungo due rami. Se i ritardi sono diversi, per un momento i due ingressi si contraddicono.', els: [
        SL.el.box('a', 10, 50, 90, 50, 'ingresso', 'A', 'att', { cls: 'stretta' }),
        SL.el.linea('l1', 100, 66, 470, 40, 'on'), SL.el.linea('l2', 100, 84, 210, 108, ''), SL.el.linea('l3', 370, 108, 470, 96, ''),
        SL.el.nota('n1', 240, 22, 'ramo diretto', 'mono', 'on'),
        SL.el.box('n', 210, 84, 160, 50, 'ramo invertito', 'NOT', '', { cls: 'stretta' }),
        SL.el.box('o', 470, 34, 110, 70, 'porta', 'OR', '', { cls: 'stretta' }), SL.el.linea('l4', 580, 69, 620, 69, 'on'),
        SL.el.box('y', 620, 44, 70, 50, 'uscita', 'Y', 'on', { cls: 'stretta' })] },
      'La durata dell’impulso è la differenza fra i due ritardi. Se il ramo invertito è più lento di tre miliardesimi di secondo, l’uscita resta sbagliata per tre miliardesimi di secondo. Se è il ramo invertito ad arrivare per primo, i due ingressi valgono 1 insieme per un momento e l’uscita non si muove.',
      'Il rimedio è aspettare. Chi usa il risultato di un circuito lo legge soltanto dopo un tempo sufficiente perché tutti i percorsi si siano assestati. Nei processori questo tempo è scandito da un segnale regolare, il clock, di cui parleremo nel Modulo III.'
    ]
  },
  esperimento: {
    faremo: [
      'Useremo il circuito del richiamo: una OR che riceve A lungo un ramo diretto e lungo un ramo che passa da una NOT. Sceglierai i ritardi dei due rami, in nanosecondi, cioè in miliardesimi di secondo.',
      'A scenderà da 1 a 0 al nanosecondo 1. Avanzeremo un nanosecondo alla volta, annotando il valore dei quattro segnali.'
    ],
    vedrai: [
      ['clock', 'Il tempo', 'Scorre da sinistra a destra, una colonna per nanosecondo.'],
      ['porta', 'I quattro segnali', 'Una riga ciascuno: l’ingresso A, i due ingressi della OR e l’uscita Y.'],
      ['conflitto', 'L’impulso', 'Le caselle rosse, quando l’uscita vale 0 mentre la tabella di verità dice 1.']
    ]
  },
  lab: {
    titolo: 'Un impulso che sulla carta non esiste',
    scena: { w: 860, h: 300 },
    atti: ['I segnali fermi', 'Un nanosecondo alla volta', 'La durata'],
    nota: 'Il numero di passi dipende dal ritardo più lungo: la scena prosegue finché tutti i segnali si sono assestati.',
    controlli: [
      { id: 'd1', tipo: 'num', eti: 'Ritardo del ramo diretto', min: 1, max: 4, salti: [1], valore: 1, unita: 'ns' },
      { id: 'd2', tipo: 'num', eti: 'Ritardo del ramo invertito', min: 1, max: 6, salti: [1], valore: 4, unita: 'ns' }
    ],
    previsione: {
      domanda: (p) => 'Il ramo diretto ha un ritardo di ' + p.d1 + ' ns e il ramo invertito di ' + p.d2 + ' ns. Quando A scende da 1 a 0, per quanti nanosecondi l’uscita Y varrà 0?',
      opzioni: (p) => Array.from(new Set([0, Math.abs(p.d2 - p.d1), p.d1, p.d2, p.d1 + p.d2])).sort((a, b) => a - b)
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + pred + ' ns. L’uscita è rimasta a 0 per ' + esito + ' ns. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.d2 <= p.d1 ? 'Il ramo invertito arriva ' + (p.d2 === p.d1 ? 'insieme al' : 'prima del') + ' ramo diretto, quindi la OR non vede mai due zeri.' : 'L’impulso comincia quando arriva il ramo diretto e finisce quando arriva quello invertito: dura la differenza fra i due ritardi.'),
    costruisci(p) {
      const el = SL.el, passi = [];
      const T = 1 + Math.max(p.d1, p.d2) + 2;
      const A = (t) => (t < 1 ? 1 : 0), Xd = (t) => A(t - p.d1), Zi = (t) => 1 - A(t - p.d2), Yu = (t) => Xd(t) | Zi(t);
      const dur = Math.max(0, p.d2 - p.d1);
      let visti = 0;
      const col = (t) => 250 + t * 64;
      const RIGHE = [['A', A, 'ingresso A'], ['X', Xd, 'ramo diretto'], ['Z', Zi, 'ramo invertito'], ['Y', Yu, 'uscita Y']];
      const quadro = (o) => {
        o = o || {};
        const els = [];
        RIGHE.forEach((R, k) => {
          const y = 34 + k * 62 + (k === 3 ? 10 : 0);
          els.push(el.nota('n' + k, 40, y + 12, R[2], 'mono', k === 3 ? 'att' : ''));
          for (let t = 0; t < visti; t++) {
            const v = R[1](t), male = k === 3 && v === 0;
            els.push(el.cella(R[0] + t, col(t), y, 56, 46, String(v), male ? 'err' : o.t === t ? 'att' : v ? 'on' : 'zero', { piccola: true, so: k === 0 ? t + ' ns' : null }));
          }
        });
        if (!visti) els.push(el.nota('vuoto', 250, 46, 'il tempo non è ancora partito', 'mono'));
        return els;
      };
      const hud = (t) => [['Tempo', t == null ? '·' : t + ' ns', 'a'], ['Ingressi della OR', t == null ? '1 e 0' : Xd(t) + ' e ' + Zi(t)], ['Uscita Y', t == null ? 1 : Yu(t), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.t != null ? o.t : o.h), els: quadro(o) }, extra));

      P({}, 0, 'Tutto è fermo', 'L’ingresso A vale 1 da molto tempo. Il ramo diretto porta 1 alla OR, il ramo invertito porta 0, e l’uscita Y vale 1. Fra poco A scenderà a 0: secondo la tabella di verità Y dovrebbe restare a 1.');
      for (let t = 0; t < T; t++) {
        visti = t + 1;
        const ev = [];
        if (t === 0) ev.push('I segnali sono ancora quelli di partenza.');
        if (t === 1) ev.push('L’ingresso A scende da 1 a 0. La notizia parte lungo i due rami.');
        if (t === 1 + p.d1) ev.push('Sono passati ' + p.d1 + ' ns dal cambio: il ramo diretto consegna lo 0 alla OR.');
        if (t === 1 + p.d2) ev.push('Sono passati ' + p.d2 + ' ns dal cambio: la NOT ha finito, e il ramo invertito sale a 1.');
        if (t > 0 && Yu(t) !== Yu(t - 1)) ev.push(Yu(t) === 0 ? 'La OR vede due zeri e l’uscita scende a 0. Comincia l’impulso.' : 'La OR vede di nuovo un 1 e l’uscita torna a 1. L’impulso è finito.');
        if (!ev.length) ev.push(Yu(t) === 0 ? 'Nessun segnale cambia. La OR continua a vedere due zeri e l’uscita resta sbagliata.' : t > 1 + Math.max(p.d1, p.d2) ? 'Nessun segnale cambia più: il circuito si è assestato.' : 'La notizia è ancora in viaggio. Alla OR non è cambiato nulla.');
        const extra = { calc: Xd(t) + ' OR ' + Zi(t) + ' = ' + Yu(t) };
        if (t === p.d1 && p.d1 >= 1) extra.chiedi = { d: 'Fra un nanosecondo il ramo diretto consegnerà lo 0 alla OR. In quel momento il ramo invertito quanto varrà?', o: ['0', '1'], g: Zi(1 + p.d1), no: 'Il ramo invertito sale a 1 soltanto ' + p.d2 + ' ns dopo il cambio di A. Il ramo diretto arriva dopo ' + p.d1 + ' ns.' };
        P({ t }, 1, 'Al nanosecondo ' + t, ev.join(' '), extra);
      }
      P({ h: T - 1 }, 2, dur ? 'L’impulso è durato ' + dur + ' ns' : 'Nessun impulso', dur
        ? 'L’uscita è rimasta a 0 dal nanosecondo ' + (1 + p.d1) + ' al nanosecondo ' + (1 + p.d2) + ', cioè per ' + dur + ' ns: la differenza fra il ritardo del ramo invertito e quello del ramo diretto. Chi avesse letto Y in quell’intervallo avrebbe trovato un valore sbagliato.'
        : 'Il ramo invertito è salito a 1 ' + (p.d2 === p.d1 ? 'nello stesso istante in cui' : 'prima che') + ' il ramo diretto scendesse a 0. La OR ha sempre avuto almeno un ingresso a 1 e l’uscita non si è mossa.', { calc: dur ? p.d2 + ' − ' + p.d1 + ' = ' + dur + ' ns' : 'durata = 0 ns' });
      return { passi, esito: dur };
    }
  },
  bilancio: {
    regola: [
      'Ogni porta risponde con un ritardo. Dopo un cambio degli ingressi l’uscita di un circuito è affidabile soltanto quando il percorso più lento si è assestato.',
      'Se due rami portano la stessa notizia con ritardi diversi, l’uscita può sbagliare per un tempo pari alla differenza dei ritardi.'
    ],
    errori: [
      ['Fidarsi della tabella di verità a ogni istante.', 'La tabella descrive il circuito a segnali fermi. Durante un cambio l’uscita può valere altro.'],
      ['Sommare i ritardi dei due rami.', 'I due rami lavorano insieme. L’impulso dura quanto la differenza fra i ritardi.'],
      ['Aspettarsi sempre un impulso.', 'Se il ramo che sale arriva prima di quello che scende, la OR non vede mai due zeri.']
    ],
    saFare: ['Spiego che cos’è il ritardo di propagazione.', 'Seguo i segnali di un piccolo circuito nel tempo.', 'Calcolo la durata di un impulso transitorio dai ritardi dei due rami.'],
    esercizi: [
      { d: 'Nel circuito A OR NOT A il ramo diretto ha un ritardo di 2 ns e il ramo invertito di 5 ns. Quando A scende a 0, per quanti nanosecondi l’uscita resta a 0?', segnaposto: 'Un numero di nanosecondi', giuste: ['3', 'tre'],
        ok: 'L’impulso comincia dopo 2 ns e finisce dopo 5 ns: dura 5 − 2 = 3 ns.',
        diagnosi: [
          { se: ['7', 'sette'], msg: 'Hai sommato i ritardi. I due rami lavorano nello stesso tempo, e conta la differenza.' },
          { se: ['5', 'cinque'], msg: 'Dopo 5 ns l’impulso finisce. Era cominciato dopo 2 ns, quando è arrivato il ramo diretto.' },
          { se: ['2', 'due'], msg: 'Dopo 2 ns l’impulso comincia. Finisce quando arriva il ramo invertito, dopo 5 ns.' }
        ],
        altro: 'La durata è diversa. Trova l’istante in cui la OR comincia a vedere due zeri e l’istante in cui smette.',
        indizi: ['Il ramo diretto porta lo 0 dopo 2 ns.', 'Il ramo invertito porta l’1 dopo 5 ns.', 'Fra i due istanti la OR vede due zeri.'],
        svolgimento: ['Inizio dell’impulso: 2 ns dopo il cambio di A.', 'Fine dell’impulso: 5 ns dopo il cambio di A.', 'Durata: 5 − 2 = 3 ns.'] },
      { d: 'Nello stesso circuito il ramo invertito diventa più veloce del ramo diretto. Che cosa accade all’uscita quando A scende a 0?', guida: 'Scegli la risposta.', o: [
        { t: 'Scende a 0 per un momento', fb: 'Il ramo invertito sale a 1 prima che quello diretto scenda. La OR ha sempre almeno un ingresso a 1.' },
        { t: 'Resta a 1', ok: true, fb: 'Per un momento i due ingressi valgono 1 insieme, e l’uscita della OR non cambia.' },
        { t: 'Resta a 0', fb: 'A segnali fermi l’uscita vale 1, e in questo caso non la abbandona mai.' }] }
    ]
  }
});
