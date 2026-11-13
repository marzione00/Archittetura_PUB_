'use strict';
SL.registra('2.2.5', {
  titolo: 'Leggere il contratto di un’istruzione',
  obiettivo: 'Alla fine saprai elencare tutti gli effetti di un’istruzione, flag compresi, e spiegare perché due istruzioni che scrivono lo stesso numero possono portare il programma su strade diverse.',
  concetti: [['lente', 'Contratto'], ['flag', 'Chi scrive i flag'], ['puntatore', 'Salto condizionale']],
  filigrana: ['lente', 'flag', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'flag', da: 'Dall’unità 2.1.1', t: 'Il flag ZF', d: 'Vale 1 quando il risultato dell’ultima operazione che lo ha scritto è zero. Le istruzioni che copiano lo lasciano com’era.' },
      { sim: 'puntatore', da: 'Dall’unità 2.2.3', t: 'LEA calcola in silenzio', d: 'LEA scrive nella destinazione il valore di un’espressione e lascia intatti sia la memoria sia i flag.' },
      { sim: 'puntatore', da: 'Dall’unità 2.1.1', t: 'RIP', d: 'Contiene l’indirizzo della prossima istruzione. Dopo ogni istruzione avanza oltre i byte appena eseguiti.' }
    ],
    domanda: { d: 'Prima di proseguire: EAX contiene 5 e ZF vale 1. Il processore esegue `mov eax, 0`. Quanto vale ZF subito dopo?', o: [
      { t: '1, come prima', ok: true, fb: 'MOV copia senza calcolare e lascia i flag come li trova, anche se il valore copiato è zero.' },
      { t: 'Dipende dal contenuto precedente di EAX', fb: 'MOV lascia i flag come li trova, qualunque valore copi e qualunque valore sostituisca.' },
      { t: '0', fb: 'MOV lascia i flag come li trova. ZF valeva 1 e continua a valere 1.' }
    ] }
  },
  idea: {
    titolo: 'Tutto quello che un’istruzione promette',
    termini: ['contratto di un’istruzione', 'salto condizionale', 'jz'],
    testo: [
      'Due istruzioni possono lasciare lo stesso numero nello stesso registro ed essere, per il resto del programma, due cose diverse. Per accorgersene bisogna guardare tutto quello che un’istruzione fa: quali registri legge, quale scrive, quali flag modifica, se tocca la memoria, dove manda RIP. L’elenco completo di questi effetti è il [[contratto di un’istruzione|contratto]] dell’istruzione.',
      'Fin qui RIP è sempre avanzato all’istruzione successiva. Un [[salto condizionale]] gli offre un’alternativa: guarda un flag e, secondo il suo valore, lascia proseguire l’esecuzione in ordine oppure scrive in RIP un altro indirizzo. Il più semplice è [[jz|JZ]], «salta se zero». Salta alla destinazione indicata quando ZF vale 1, e prosegue con l’istruzione successiva quando ZF vale 0.',
      'Un salto condizionale si limita a leggere. Trova i flag come li ha lasciati l’ultima istruzione che li ha scritti, e su quelli decide. Qui il contratto delle istruzioni precedenti diventa decisivo.',
      'Prendiamo due modi di aggiungere 1 a EAX. L’istruzione `add eax, 1` somma e scrive tutti i flag in base al risultato, quindi ZF vale 1 soltanto se EAX è diventato zero. L’istruzione `lea eax, [rax + 1]` produce lo stesso numero e lascia i flag com’erano. Se subito dopo viene un JZ, nel primo caso il salto dipende dal nuovo valore di EAX. Nel secondo dipende da un’operazione più vecchia, che può trovarsi lontano.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Due contratti a confronto', nota: 'Le due istruzioni coincidono su EAX e sulla memoria, e si separano sui flag.', els: [
        SL.el.nota('h1', 300, 0, 'SCRIVE EAX', 'mono'), SL.el.nota('h2', 440, 0, 'SCRIVE I FLAG', 'mono'), SL.el.nota('h3', 580, 0, 'USA LA MEMORIA', 'mono'),
        SL.el.box('i1', 10, 26, 260, 50, null, 'add eax, 1', '', { cls: 'stretta' }), SL.el.cella('a1', 300, 26, 120, 50, 'sì', 'on', { piccola: true }), SL.el.cella('b1', 440, 26, 120, 50, 'sì', 'att', { piccola: true }), SL.el.cella('c1', 580, 26, 120, 50, 'no', 'zero', { piccola: true }),
        SL.el.box('i2', 10, 88, 260, 50, null, 'lea eax, [rax + 1]', '', { cls: 'stretta' }), SL.el.cella('a2', 300, 88, 120, 50, 'sì', 'on', { piccola: true }), SL.el.cella('b2', 440, 88, 120, 50, 'no', 'att', { piccola: true }), SL.el.cella('c2', 580, 88, 120, 50, 'no', 'zero', { piccola: true })] },
      'Per questo due istruzioni si possono scambiare soltanto dopo aver confrontato i contratti per intero, e dopo aver controllato che nessuna istruzione successiva legga un effetto che cambia. I compilatori fanno questa verifica di continuo, e chi legge il loro codice deve saperla ripetere.',
      'Il caso limite aiuta a fissare l’idea. Con EAX uguale a 0xFFFFFFFF, aggiungere 1 dà 0 su 32 bit. Dopo ADD il flag ZF vale 1 e il salto parte. Dopo LEA il registro contiene lo stesso zero, e ZF conserva il valore di prima, qualunque fosse.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processore aumenta EAX di uno e subito dopo incontra un `jz`. Sceglierai con quale istruzione fare l’aumento, il contenuto iniziale di EAX e il valore che ZF aveva prima.',
      'Seguiremo i due effetti dell’istruzione, sul registro e sul flag, e poi la decisione del salto. Dopo il caso proposto, cambia soltanto l’istruzione e confronta la strada presa da RIP.'
    ],
    vedrai: [
      ['tabella', 'Il programma', 'A sinistra: l’istruzione scelta, il salto e le due possibili prosecuzioni.'],
      ['register', 'Lo stato', 'A destra: EAX, ZF e RIP.'],
      ['lente', 'Il contratto', 'In basso: gli effetti dell’istruzione scelta, uno per uno.']
    ]
  },
  lab: {
    titolo: 'Lo stesso numero, due percorsi',
    scena: { w: 860, h: 340 },
    atti: ['Lo stato di partenza', 'L’aumento', 'Il salto', 'Il confronto'],
    controlli: [
      { id: 'op', tipo: 'scelta', eti: 'Istruzione di aumento', opzioni: [['lea', 'lea eax, [rax + 1]'], ['add', 'add eax, 1']], valore: 'lea' },
      { id: 'x', tipo: 'scelta', eti: 'EAX prima', opzioni: [[5, '5'], [4294967295, '0xFFFFFFFF'], [0, '0']], valore: 5 },
      { id: 'z', tipo: 'scelta', eti: 'ZF prima', opzioni: [[1, '1'], [0, '0']], valore: 1 }
    ],
    previsione: {
      domanda: (p) => 'EAX contiene ' + (p.x > 9 ? '0xFFFFFFFF' : p.x) + ' e ZF vale ' + p.z + '. Il processore esegue `' + (p.op === 'add' ? 'add eax, 1' : 'lea eax, [rax + 1]') + '` e poi `jz 0x401020`. Che cosa fa il salto?',
      opzioni: () => [['salta', 'Parte: RIP va a 0x401020'], ['prosegue', 'Resta fermo: si prosegue in ordine']]
    },
    confronto: (pred, esito, p) => 'Avevi previsto che il salto ' + (pred === 'salta' ? 'partisse' : 'restasse fermo') + '. ' + (esito === 'salta' ? 'È partito' : 'È rimasto fermo') + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.op === 'lea' ? 'LEA lascia i flag com’erano. JZ ha trovato ZF = ' + p.z + ', il valore che c’era prima dell’aumento.' : 'ADD scrive ZF in base al risultato, che vale ' + ((p.x + 1) % 4294967296) + '. Il valore che ZF aveva prima è stato sostituito.'),
    costruisci(p) {
      const el = SL.el, passi = [];
      const ADD = p.op === 'add', dopo = (p.x + 1) % 4294967296, zfDopo = ADD ? (dopo === 0 ? 1 : 0) : p.z, salta = zfDopo === 1;
      const zfAltra = ADD ? p.z : (dopo === 0 ? 1 : 0), HX = (v) => '0x' + v.toString(16).toUpperCase().padStart(8, '0');
      const TESTO = ADD ? 'add eax, 1' : 'lea eax, [rax + 1]';
      const s = { eax: p.x, zf: p.z, rip: '0x401000' };
      const RIGHE = [['0x401000', TESTO], ['0x401003', 'jz 0x401020'], ['0x401005', 'si prosegue in ordine'], ['0x401020', 'destinazione del salto']];
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('t1', 40, 0, 'IL PROGRAMMA', 'mono')];
        RIGHE.forEach((r, k) => els.push(el.box('i' + k, 40, 28 + k * 62 + (k === 3 ? 14 : 0), 270, 54, r[0], r[1], o.riga === k ? 'att' : (o.fatte || []).includes(k) ? 'on' : '', { cls: 'stretta' })));
        els.push(el.box('eax', 350, 28, 230, 70, 'EAX', HX(s.eax) + ' · ' + s.eax, o.att === 'eax' ? 'att' : '', { cls: 'stretta' }));
        els.push(el.box('zf', 600, 28, 100, 70, 'ZF', String(s.zf), o.att === 'zf' ? 'att' : s.zf ? 'on' : ''));
        els.push(el.box('rip', 720, 28, 110, 70, 'RIP', s.rip, o.att === 'rip' ? 'att' : '', { cls: 'stretta' }));
        els.push(el.nota('t2', 350, 120, 'IL CONTRATTO DI ' + (ADD ? 'ADD' : 'LEA'), 'mono'));
        els.push(el.box('c1', 350, 146, 150, 70, 'scrive EAX', o.c >= 1 ? 'sì' : '·', o.c >= 1 ? 'on' : ''));
        els.push(el.box('c2', 515, 146, 150, 70, 'scrive i flag', o.c >= 2 ? (ADD ? 'sì' : 'no') : '·', o.c >= 2 ? 'att' : ''));
        els.push(el.box('c3', 680, 146, 150, 70, 'usa la memoria', o.c >= 2 ? 'no' : '·', ''));
        els.push(el.box('dec', 350, 240, 480, 74, 'decisione di JZ', o.dec || '·', o.dec ? (salta ? 'att' : 'on') : '', { sim: 'puntatore', riga: true, cls: 'stretta' }));
        return els;
      };
      const hud = () => [['EAX', s.eax, 'a'], ['ZF', s.zf], ['RIP', s.rip, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Lo stato di partenza', 'EAX contiene ' + HX(p.x) + '. ZF vale ' + p.z + ': lo ha lasciato così un’operazione precedente, che qui non interessa. RIP indica l’istruzione di aumento.');
      s.eax = dopo;
      P({ riga: 0, att: 'eax', c: 1 }, 1, 'Il primo effetto: EAX', (ADD ? 'ADD somma 1 al contenuto di EAX.' : 'LEA calcola l’espressione RAX + 1 e la scrive in EAX.') + ' Il registro passa da ' + HX(p.x) + ' a ' + HX(dopo) + (dopo === 0 ? ': su 32 bit, dopo 0xFFFFFFFF si ricomincia da zero.' : '.') + ' Fin qui le due istruzioni sono indistinguibili.',
        { calc: 'EAX = ' + HX(dopo), chiedi: { d: 'L’istruzione eseguita è `' + TESTO + '`. Prima ZF valeva ' + p.z + ', e il risultato scritto in EAX è ' + dopo + '. Quanto vale ZF adesso?', o: ['0', '1'], g: zfDopo, no: ADD ? 'ADD scrive ZF in base al risultato: ' + (dopo === 0 ? 'è zero, quindi ZF vale 1.' : 'è diverso da zero, quindi ZF vale 0.') : 'LEA lascia i flag com’erano, quindi ZF conserva il valore ' + p.z + '.' } });
      s.zf = zfDopo; s.rip = '0x401003';
      P({ riga: 0, att: 'zf', c: 2 }, 1, 'Il secondo effetto: i flag', ADD ? 'ADD scrive anche i flag. Il risultato è ' + (dopo === 0 ? 'zero, quindi ZF diventa 1.' : 'diverso da zero, quindi ZF diventa 0.') + ' Il valore che ZF aveva prima è perduto.' : 'LEA si ferma al registro. Fra i suoi effetti i flag mancano, e ZF conserva il valore ' + p.z + ' lasciato dall’operazione precedente, anche se il nuovo contenuto di EAX ' + (dopo === 0 ? 'è zero.' : 'è diverso da zero.'),
        { calc: 'ZF = ' + zfDopo });
      P({ riga: 1, fatte: [0], att: 'zf', c: 2, dec: 'ZF = ' + zfDopo + (salta ? ' → salta' : ' → prosegue') }, 2, 'JZ legge ZF', 'Il salto condizionale guarda soltanto il flag. ZF vale ' + zfDopo + ', quindi ' + (salta ? 'la condizione «zero» è vera e il salto parte.' : 'la condizione «zero» è falsa e il salto resta fermo.'), { calc: 'jz: ZF = ' + zfDopo, esito: [salta ? 'salta' : 'prosegue', salta ? 'si' : 'no'] });
      s.rip = salta ? '0x401020' : '0x401005';
      P({ riga: salta ? 3 : 2, fatte: [0, 1], att: 'rip', c: 2, dec: salta ? 'RIP ← 0x401020' : 'RIP ← 0x401005' }, 2, salta ? 'RIP riceve la destinazione' : 'RIP avanza in ordine', salta ? 'JZ scrive in RIP l’indirizzo indicato, 0x401020. L’istruzione che si trova a 0x401005 viene scavalcata.' : 'JZ occupa due byte, e RIP avanza a 0x401005 come dopo qualunque altra istruzione. La destinazione 0x401020 resta inutilizzata.', { calc: 'RIP = ' + s.rip });
      P({ riga: salta ? 3 : 2, fatte: [0, 1], c: 2, dec: (ADD ? 'con LEA' : 'con ADD') + ': ZF = ' + zfAltra + (zfAltra ? ' → salta' : ' → prosegue') }, 3, 'Con l’altra istruzione', 'Se l’aumento fosse stato fatto con ' + (ADD ? 'LEA' : 'ADD') + ', EAX conterrebbe lo stesso valore, ' + HX(dopo) + ', e ZF varrebbe ' + zfAltra + '. ' + (zfAltra === zfDopo ? 'In questo caso i due percorsi coincidono, per i dati scelti. Con altri dati si separano.' : 'Il salto avrebbe preso l’altra strada. Le due istruzioni scrivono lo stesso numero e hanno contratti diversi.'), { calc: (ADD ? 'add' : 'lea') + ': ZF = ' + zfDopo + ' · ' + (ADD ? 'lea' : 'add') + ': ZF = ' + zfAltra });
      return { passi, esito: salta ? 'salta' : 'prosegue' };
    }
  },
  bilancio: {
    regola: [
      'Il contratto di un’istruzione è l’elenco di tutti i suoi effetti: registri, flag, memoria, RIP. Due istruzioni si equivalgono soltanto se coincidono su ogni effetto che il seguito del programma legge.',
      'Un salto condizionale legge i flag lasciati dall’ultima istruzione che li ha scritti. JZ salta quando ZF vale 1. ADD e SUB scrivono i flag, mentre MOV e LEA li lasciano com’erano.'
    ],
    errori: [
      ['Guardare soltanto il registro di destinazione.', 'Dopo `lea eax, [rax + 1]` EAX può valere zero mentre ZF vale 0. Il flag descrive un’operazione precedente.'],
      ['Pensare che JZ controlli un registro.', 'JZ legge soltanto ZF. Quale registro abbia prodotto quel valore dipende dall’ultima istruzione che ha scritto i flag.'],
      ['Sostituire ADD con LEA senza guardare oltre.', 'La sostituzione è lecita soltanto se nessuna istruzione successiva legge i flag che ADD avrebbe scritto.']
    ],
    saFare: ['Elenco gli effetti di ADD, LEA e MOV su registri e flag.', 'Prevedo se un JZ salta, risalendo all’istruzione che ha scritto ZF.', 'Stabilisco se due istruzioni sono intercambiabili in un dato punto del programma.'],
    esercizi: [
      { d: 'EAX contiene 7 e ZF vale 1. Il processore esegue `lea eax, [rax + 1]` e poi `jz fine`. Che cosa succede?', guida: 'Scegli la risposta.', o: [
        { t: 'Il salto parte, perché ZF è rimasto a 1', ok: true, fb: 'LEA lascia i flag com’erano. JZ trova ancora ZF = 1, anche se EAX vale 8.' },
        { t: 'Il salto resta fermo, perché EAX vale 8', fb: 'JZ legge ZF e ignora EAX. LEA ha lasciato ZF al valore di prima, cioè 1.' },
        { t: 'L’esito è imprevedibile', fb: 'L’esito è determinato: ZF valeva 1 e nessuna delle due istruzioni lo ha modificato.' }] },
      { d: 'RIP contiene 0x401003, dove comincia un’istruzione `jz 0x401020` lunga 2 byte. ZF vale 0. Quanto vale RIP dopo l’istruzione? Rispondi in esadecimale.', segnaposto: 'Un indirizzo esadecimale', giuste: ['0x401005', '401005', '401005h'],
        ok: 'Con ZF = 0 il salto resta fermo, e RIP avanza oltre i due byte di JZ: 0x401003 + 2 = 0x401005.',
        diagnosi: [
          { se: ['0x401020', '401020'], msg: 'Questa è la destinazione del salto, che viene usata soltanto quando ZF vale 1. Qui ZF vale 0.' },
          { se: ['0x401003', '401003'], msg: 'Questo è l’indirizzo di JZ. Anche un salto che resta fermo fa avanzare RIP oltre i propri byte.' },
          { se: ['0x401004', '401004'], msg: 'L’istruzione occupa due byte, quindi RIP avanza di due.' }
        ],
        altro: 'L’indirizzo è diverso. Stabilisci prima se il salto parte, guardando ZF, e poi dove va RIP.',
        indizi: ['JZ salta quando ZF vale 1.', 'Qui ZF vale 0, quindi l’esecuzione prosegue in ordine.', 'L’istruzione successiva comincia due byte dopo 0x401003.'],
        svolgimento: ['ZF = 0: la condizione «zero» è falsa.', 'Il salto resta fermo e RIP avanza come dopo ogni istruzione.', 'RIP = 0x401003 + 2 = 0x401005.'] }
    ],
    sfida: ['cslez2_2_04_random_assembly_04', 'Complemento, scorrimenti e uguaglianza']
  }
});
