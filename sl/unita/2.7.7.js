'use strict';
SL.registra('2.7.7', {
  titolo: 'Verifiche per una revisione di sicurezza della memoria',
  obiettivo: 'Obiettivo: stabilire se una stringa è contenuta in un buffer tenendo conto del terminatore, e indicare la posizione del controllo e la sua forma corretta.',
  concetti: [['char', 'La stringa e il terminatore'], ['bilancio', 'Lunghezza minore della capacità'], ['lente', 'Le domande di una revisione']],
  filigrana: ['char', 'lente', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'char', da: 'Dall’unità 1.2.4', t: 'I caratteri sono byte', d: 'La tabella ASCII assegna un numero a ogni carattere. In memoria una parola è una fila di byte, uno per carattere.' },
      { sim: 'conflitto', da: 'Dall’unità 2.7.2', t: 'La copia senza controllo', d: 'Una copia che ignora la capacità della destinazione prosegue oltre il buffer e sovrascrive i dati adiacenti.' },
      { sim: 'puntatore', da: 'Dall’unità 2.3.5', t: 'Il confronto prima dell’accesso', d: 'Un controllo confronta la posizione richiesta con la fine dell’area ed esegue un salto quando l’accesso cadrebbe all’esterno.' }
    ],
    domanda: { d: 'Prima di proseguire: un buffer di 8 byte ha le celle numerate a partire da 0. Qual è il primo indice esterno al buffer?', o: [
      { t: '8', ok: true, fb: 'Le otto celle hanno gli indici da 0 a 7. L’indice 8 è il primo esterno.' },
      { t: '7', fb: 'La cella 7 è l’ultima del buffer: contando da 0, otto celle raggiungono l’indice 7.' },
      { t: '9', fb: 'Anche la cella 9 è esterna, e tuttavia la prima cella esterna al buffer è quella di indice 8.' }
    ] }
  },
  idea: {
    titolo: 'Il byte trascurato',
    termini: ['terminatore', 'errore di uno'],
    testo: [
      'Le unità di questo capitolo hanno mostrato gli effetti di una scrittura oltre i limiti, e le difese che ne contengono le conseguenze. Tutte quelle difese intervengono a danno avvenuto. Il rimedio precede il danno, nel codice, ed è un confronto che impedisce la scrittura. La rilettura di un programma alla ricerca dei suoi punti deboli prende il nome di revisione, e la revisione comincia da tali confronti.',
      'Il caso più frequente riguarda le stringhe, cioè i testi. Nel linguaggio C una stringa è una fila di byte, uno per carattere, seguita da un byte di valore zero che ne indica la fine: il [[terminatore]]. Il terminatore occupa una cella come ogni altro byte. La parola `ciao` ha quattro caratteri e occupa cinque byte.',
      { fig: 'celle', titolo: 'La parola ciao in un buffer di 8 byte', nota: 'Quattro caratteri, cinque byte occupati. Il terminatore si trova nella cella di indice 4.', celle: [
        { so: '0', v: 'c', st: 'on' }, { so: '1', v: 'i', st: 'on' }, { so: '2', v: 'a', st: 'on' }, { so: '3', v: 'o', st: 'on' }, { so: '4', v: '00', st: 'amb', gi: 'fine' }, { so: '5', v: '·' }, { so: '6', v: '·' }, { so: '7', v: '·' }] },
      'Un buffer di capacità C ha le celle con indice da 0 a C − 1. Una stringa di n caratteri colloca il terminatore nella cella di indice n. Affinché l’intera stringa resti all’interno, n deve essere minore di C. Quando n è uguale a C i caratteri sono tutti contenuti, e il terminatore cade nella prima cella esterna.',
      'L’errore di una sola unità è tanto frequente da avere un nome: [[errore di uno]]. Esso deriva quasi sempre da un confronto scritto con il segno errato, `n <= C` al posto di `n < C`, oppure da un calcolo che trascura il terminatore.',
      'Il controllo va eseguito prima della copia e riguarda l’intera richiesta. Se la stringa è troppo lunga, la routine rifiuta senza scrivere alcun byte. Una copia interrotta lascerebbe nel buffer un testo privo di terminatore, e una lettura successiva proseguirebbe oltre la fine.',
      'In una revisione le domande da porre per ogni copia sono quattro: la capacità della destinazione, il numero massimo di byte in ingresso compreso il terminatore, la posizione del confronto fra i due numeri, l’effetto di un confronto fallito.'
    ]
  },
  esperimento: {
    faremo: [
      'Una routine riceve una stringa di n caratteri e deve copiarla, con il terminatore, in un buffer di capacità C. Prima della copia esegue un controllo. I comandi dell’esperimento fissano la capacità, la lunghezza e la condizione verificata dalla routine.',
      'Sono mostrati la cella in cui cadrebbe il terminatore, la decisione del controllo e il numero di byte scritti. Dopo il caso proposto è istruttivo il caso di 7 caratteri, e in seguito la condizione `n <= C` con 8 caratteri.'
    ],
    vedrai: [
      ['byte', 'La memoria', 'In alto: le celle del buffer con i rispettivi indici, seguite da celle che appartengono ad altri dati.'],
      ['char', 'La stringa', 'Al centro: i caratteri da copiare e il terminatore.'],
      ['bilancio', 'Il controllo', 'In basso: i numeri confrontati, l’esito e i byte scritti.']
    ]
  },
  lab: {
    titolo: 'Il terminatore è contenuto nel buffer?',
    scena: { w: 860, h: 330 },
    atti: ['La richiesta', 'Lo spazio necessario', 'Il controllo', 'La copia', 'Il bilancio'],
    controlli: [
      { id: 'cap', tipo: 'scelta', eti: 'Capacità del buffer, C', opzioni: [[8, '8 byte'], [4, '4 byte'], [0, '0 byte']], valore: 8 },
      { id: 'n', tipo: 'scelta', eti: 'Caratteri della stringa, n', opzioni: [[0, '0'], [3, '3'], [4, '4'], [7, '7'], [8, '8'], [9, '9']], valore: 8 },
      { id: 'ctrl', tipo: 'scelta', eti: 'Condizione verificata', opzioni: [['giusto', 'n < C'], ['sbagliato', 'n <= C']], valore: 'giusto' }
    ],
    nota: 'Il numero di passi dipende dall’esito del controllo e dalla lunghezza della stringa.',
    previsione: {
      domanda: (p) => 'Una routine deve copiare ' + (p.n ? 'una stringa di ' + p.n + ' caratteri' : 'una stringa vuota') + ', con il terminatore, in un buffer di capacità ' + p.cap + ' byte. Prima di copiare verifica la condizione `' + (p.ctrl === 'giusto' ? 'n < C' : 'n <= C') + '`. ' + (p.ctrl === 'giusto' ? 'Quanti byte scrive?' : 'Quanti byte sono scritti all’esterno del buffer?'),
      opzioni: (p) => (p.ctrl === 'giusto' ? Array.from(new Set([0, p.n, p.n + 1])).sort((a, b) => a - b) : [0, 1, 2]).map((v) => [v, v + ' byte'])
    },
    confronto: (pred, esito, p) => p.ctrl === 'giusto'
      ? 'La previsione indicava ' + pred + ' byte scritti. La routine ne scrive ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 0 ? 'Il terminatore richiederebbe la cella di indice ' + p.n + ', esterna al buffer. La routine rifiuta l’intera richiesta.' : 'Oltre ai caratteri la routine scrive il terminatore: ' + p.n + ' + 1 = ' + esito + '.')
      : 'La previsione indicava ' + pred + ' byte esterni al buffer. Il numero corretto è ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 1 ? 'Con n uguale a C la condizione `n <= C` è vera, i caratteri riempiono il buffer e il terminatore cade nella prima cella esterna.' : p.n > p.cap ? 'Con n maggiore di C anche la condizione errata risulta falsa, e la routine rifiuta.' : 'Con n minore di C il terminatore è contenuto nel buffer, con l’una e con l’altra condizione.'),
    costruisci(p) {
      const el = SL.el, passi = [], C = p.cap, n = p.n, giusto = p.ctrl === 'giusto', W = 'SISTEMILAB', testo = W.slice(0, n), X0 = 34, PS = 66;
      const cond = giusto ? n < C : n <= C, COND = giusto ? 'n < C' : 'n <= C', SEGNO = giusto ? ' < ' : ' <= ';
      const st = { scritti: 0, ctrl: null }, GLI = n === 8 ? 'gli ' : 'i ', AGLI = n === 8 ? 'Agli ' : 'Ai ';
      const quadro = (o) => {
        const els = [el.nota('t1', 20, 0, 'LA MEMORIA', 'mono')], YA = 46, YB = 168;
        for (let k = 0; k < 12; k++) {
          const dentro = k < C, scritta = k < st.scritti;
          els.push(el.cella('m' + k, X0 + k * PS, YA, PS - 4, 44, scritta ? (k < n ? W[k] : '00') : '·', scritta ? (!dentro ? 'err' : o.nuovi && k >= o.da ? 'att' : 'on') : dentro ? '' : 'off', { piccola: true, cls: 'minuta', so: String(k) }));
        }
        if (o.bersaglio) els.push(el.cursore('cur', X0 + n * PS, YA + 48, PS - 4));
        if (C > 0) els.push(el.linea('lb', X0, YA + 60, X0 + C * PS - 4, YA + 60, 'on'), el.nota('nb', X0, YA + 66, 'buffer, indici da 0 a ' + (C - 1), 'mono minuta', 'on'));
        els.push(el.nota('nf', X0 + C * PS, YA + 66, C > 0 ? 'altri dati' : 'capacità 0: tutte le celle appartengono ad altri dati', 'mono minuta'));
        els.push(el.nota('t2', 20, YB - 26, 'LA STRINGA DA COPIARE', 'mono'));
        for (let k = 0; k <= n; k++) els.push(el.cella('s' + k, X0 + k * PS, YB, PS - 4, 44, k < n ? W[k] : '00', k === n ? (o.term ? 'att' : 'on') : (o.rifiuto ? 'off' : 'on'), { piccola: true, cls: 'minuta' }));
        els.push(el.nota('nt', X0 + (n + 1) * PS + 6, YB + 14, '← terminatore', 'mono minuta', o.term ? 'att' : ''));
        els.push(el.box('b1', 20, 234, 148, 84, 'caratteri, n', String(n), 'on', { cls: 'stretta' }),
          el.box('b2', 178, 234, 148, 84, 'byte necessari', o.fase >= 1 ? String(n + 1) : '·', o.fase === 1 ? 'att' : o.fase > 1 ? 'on' : '', { cls: 'stretta' }),
          el.box('b3', 336, 234, 148, 84, 'capacità, C', String(C), 'on', { cls: 'stretta' }),
          el.box('b4', 494, 234, 176, 84, COND, st.ctrl == null ? '·' : st.ctrl ? 'vero' : 'falso', o.fase === 2 ? 'att' : st.ctrl == null ? '' : 'on', { cls: 'stretta' }),
          el.box('b5', 680, 234, 166, 84, 'byte scritti', String(st.scritti), o.fine ? (o.male ? 'err' : 'att') : st.scritti ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Caratteri', String(n), 'a'], ['Capacità', C + ' byte'], ['Byte scritti', String(st.scritti), 'c']];
      const P = (o, atto, titolo, testoP, extra) => passi.push(Object.assign({ atto, titolo, testo: testoP, hud: hud(), els: quadro(o) }, extra));
      const FINO = C > 0 ? 'Il buffer ha gli indici da 0 a ' + (C - 1) + '.' : 'Il buffer ha capacità 0 ed è privo di celle.';

      P({ fase: 0 }, 0, 'La richiesta', (n ? 'La routine deve copiare la stringa `' + testo + '`, lunga ' + n + ' caratteri, in un buffer di capacità ' + C + '. ' : 'La routine deve copiare una stringa vuota, cioè priva di caratteri, in un buffer di capacità ' + C + '. ') + (C > 0 ? 'Il buffer possiede le celle con indice da 0 a ' + (C - 1) + '. Le celle dall’indice ' + C + ' in poi appartengono ad altri dati del programma.' : 'Un buffer di capacità 0 è privo di celle: ogni scrittura cadrebbe su altri dati del programma.'),
        { chiedi: { d: (n ? 'La stringa ha ' + n + ' caratteri.' : 'La stringa è vuota.') + ' Quanti byte occupa in totale, nel linguaggio C?', o: [n, n + 1, n + 2].map(String), g: 1, no: 'Ai caratteri va aggiunto il terminatore, un byte di valore zero: ' + n + ' + 1 = ' + (n + 1) + '.' } });
      P({ fase: 1, term: true, bersaglio: true }, 1, 'Lo spazio necessario', (n === 0 ? 'La stringa vuota è composta dal solo terminatore. Occorre 1 byte, nella cella di indice 0.' : n === 1 ? 'Al carattere si aggiunge il terminatore, e occorrono 2 byte. Il carattere sarebbe collocato nella cella 0, il terminatore nella cella di indice 1.' : AGLI + n + ' caratteri si aggiunge il terminatore, e occorrono ' + (n + 1) + ' byte. I caratteri sarebbero collocati nelle celle da 0 a ' + (n - 1) + ', il terminatore nella cella di indice ' + n + '.') + ' La barra color ambra indica la cella destinata al terminatore.',
        { calc: n + ' + 1 = ' + (n + 1) + ' byte', chiedi: { d: 'La cella di indice ' + n + ' appartiene al buffer?', o: ['Sì', 'No'], g: n < C ? 0 : 1, no: FINO + (n < C ? ' L’indice ' + n + ' è fra questi.' : C > 0 ? ' L’indice ' + n + ' sta oltre.' : '') } });
      st.ctrl = cond;
      P({ fase: 2, bersaglio: true, term: true }, 2, 'Il controllo, prima della scrittura', giusto
        ? 'Prima di ogni scrittura nel buffer la routine confronta la lunghezza con la capacità. La condizione `n < C`, cioè ' + n + ' < ' + C + ', è ' + (cond ? 'vera. L’indice del terminatore rientra fra quelli del buffer, e la copia può partire.' : 'falsa. Il terminatore cadrebbe all’esterno del buffer, e la copia è rifiutata prima dell’inizio.')
        : 'Prima di ogni scrittura nel buffer la routine confronta la lunghezza con la capacità, e la condizione è scritta `n <= C`. Con ' + n + ' <= ' + C + ' risulta ' + (cond ? 'vera, e la copia parte.' : 'falsa, e la copia è rifiutata.') + (n === C ? ' La condizione corretta, `n < C`, sarebbe risultata falsa.' : ' In questo caso la condizione corretta, `n < C`, avrebbe dato il medesimo esito.'),
        { calc: n + SEGNO + C + ': ' + (cond ? 'vero' : 'falso') });
      if (!cond) {
        P({ fase: 3, rifiuto: true }, 3, 'La richiesta respinta', 'La routine restituisce un errore al chiamante e lascia invariata la memoria. Nessun byte è scritto' + (n > 0 && C > 0 ? ', neppure i primi caratteri che sarebbero stati contenuti: un testo troncato e privo di terminatore costituirebbe a sua volta un pericolo per una lettura successiva.' : '.'), { calc: 'byte scritti: 0' });
        P({ fase: 4, rifiuto: true, fine: true }, 4, 'Il bilancio', 'Zero byte scritti, e il buffer è invariato.' + (C === 0 && n === 0 ? ' Con capacità zero è respinta anche la stringa vuota, che richiederebbe un byte per il terminatore.' : n === C ? ' ' + (n === 8 ? 'Gli ' : 'I ') + n + ' caratteri, da soli, sarebbero stati contenuti. Mancava la cella per il terminatore, ed è questo il caso che il controllo deve trattare correttamente.' : ' Per l’intera stringa occorrevano ' + (n + 1) + ' byte, e il buffer ne offre ' + C + '.'), { calc: n + ' + 1 > ' + C, esito: ['0 byte scritti', 'si'] });
        return { passi, esito: 0 };
      }
      const fuori = n >= C ? 1 : 0;
      if (n > 0) {
        st.scritti = n;
        P({ fase: 3, nuovi: true, da: 0 }, 3, 'I caratteri', 'La routine copia ' + (n === 1 ? 'il carattere nella cella 0.' : GLI + n + ' caratteri nelle celle da 0 a ' + (n - 1) + '.') + (n === C ? ' Il buffer è pieno fino all’ultima cella, e il terminatore deve ancora essere scritto.' : ''), { calc: 'byte scritti: ' + n });
      }
      st.scritti = n + 1;
      P({ fase: 3, nuovi: true, da: n, term: true, male: !!fuori }, 3, fuori ? 'Il terminatore cade all’esterno' : 'Il terminatore', fuori
        ? 'Il byte di valore zero va nella cella di indice ' + n + ', esterna al buffer. La routine ha appena sovrascritto un byte di un altro dato. È un traboccamento di un solo byte: il medesimo fenomeno dell’unità 2.7.2, in scala ridotta.'
        : 'Il byte di valore zero va nella cella di indice ' + n + (n === C - 1 ? ', l’ultima del buffer. La stringa lo riempie esattamente.' : '. Le celle successive del buffer restano libere.'), { calc: '[' + n + '] = 00' });
      if (fuori) P({ fase: 4, fine: true, male: true }, 4, 'Il bilancio', 'La routine ha scritto ' + (n + 1) + ' byte in un buffer che ne contiene ' + C + '. L’errore si manifesta soltanto quando n è uguale a C. Con ogni altra lunghezza le due condizioni danno il medesimo esito, e per questa ragione l’errore sfugge alle prove eseguite con lunghezze arbitrarie.', { calc: n + ' + 1 > ' + C, esito: ['1 byte esterno al buffer', 'no'] });
      else P({ fase: 4, fine: true }, 4, 'Il bilancio', 'La routine ha scritto ' + (n + 1) + ' byte, tutti all’interno del buffer. Una lettura successiva della stringa incontrerà il terminatore e si arresterà a tale cella.' + (giusto ? '' : ' La condizione `n <= C` ha dato l’esito corretto perché n è minore di C: l’errore resta nascosto finché le due quantità sono diverse.'), { calc: n + ' + 1 <= ' + C, esito: [(n + 1) + ' byte scritti', 'si'] });
      return { passi, esito: giusto ? n + 1 : fuori };
    }
  },
  bilancio: {
    regola: [
      'Una stringa di n caratteri occupa n + 1 byte, poiché il terminatore occupa la cella di indice n. È contenuta in un buffer di capacità C soltanto se n è minore di C.',
      'Il controllo precede la copia e riguarda la richiesta intera. Quando fallisce, la routine rifiuta senza scrivere alcun byte.'
    ],
    errori: [
      ['Scrivere il confronto come `n <= C`.', 'Con n uguale a C i caratteri riempiono il buffer e il terminatore cade nella prima cella esterna.'],
      ['Eseguire il controllo dopo la copia.', 'A quel punto la scrittura oltre i limiti è già avvenuta, e il controllo può soltanto constatarla.'],
      ['Trascurare la capacità zero.', 'Anche la stringa vuota richiede un byte per il terminatore. In un buffer privo di celle nessuna stringa è contenuta.'],
      ['Provare la routine soltanto con testi brevi.', 'L’errore di uno si manifesta in un solo caso, quello in cui la lunghezza è uguale alla capacità. Tale caso va provato espressamente.']
    ],
    saFare: ['Calcolare il numero di byte occupati da una stringa, terminatore compreso.', 'Stabilire se una stringa è contenuta in un buffer mediante il confronto fra lunghezza e capacità.', 'Riconoscere un confronto scritto con il segno errato e il caso in cui fallisce.'],
    esercizi: [
      { d: 'Un buffer ha capacità 16 byte. Qual è il numero massimo di caratteri di una stringa C che vi è contenuta per intero, terminatore compreso?', segnaposto: 'Un numero', giuste: ['15', 'quindici'],
        ok: 'Con 15 caratteri il terminatore occupa la cella di indice 15, l’ultima del buffer.',
        diagnosi: [
          { se: ['16'], msg: 'Con 16 caratteri le celle da 0 a 15 sono tutte occupate, e il terminatore richiederebbe la cella 16, la prima esterna.' },
          { se: ['17'], msg: 'Il buffer ha 16 celle. Una stringa richiede i caratteri più un byte per il terminatore.' },
          { se: ['14'], msg: 'Con 14 caratteri il terminatore occupa la cella 14 e la cella 15 resta libera: è disponibile un carattere in più.' }
        ],
        altro: 'Il numero è diverso. La stringa occupa n + 1 byte, che devono essere contenuti nelle 16 celle del buffer.',
        indizi: ['Una stringa di n caratteri occupa n + 1 byte.', 'Deve valere n + 1 ≤ 16, cioè n < 16.', 'Il massimo intero minore di 16.'],
        svolgimento: ['Byte occupati: n + 1.', 'Condizione: n < 16.', 'Massimo: n = 15, con il terminatore nella cella 15.'] },
      { d: 'Una routine copia una stringa di n caratteri in un buffer di capacità C dopo avere verificato `n <= C`. Con quale lunghezza il controllo è superato e la copia scrive all’esterno del buffer?', guida: 'Si scelga la risposta.', o: [
        { t: 'n uguale a C', ok: true, fb: 'I caratteri occupano le celle da 0 a C − 1 e il terminatore cade nella cella C, la prima esterna.' },
        { t: 'n uguale a C − 1', fb: 'Il terminatore occupa la cella C − 1, l’ultima del buffer. L’intera stringa resta all’interno.' },
        { t: 'n uguale a C + 1', fb: 'La condizione `n <= C` risulta falsa, e la routine rifiuta la copia.' }] }
    ]
  }
});
