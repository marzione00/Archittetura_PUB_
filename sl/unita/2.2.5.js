'use strict';
SL.registra('2.2.5', {
  titolo: 'Leggere il contratto di un’istruzione',
  obiettivo: 'Obiettivo: elencare tutti gli effetti di un’istruzione, flag compresi, e spiegare perché due istruzioni che scrivono il medesimo numero possono condurre il programma su percorsi diversi.',
  concetti: [['lente', 'Contratto'], ['flag', 'Chi scrive i flag'], ['puntatore', 'Salto condizionale']],
  filigrana: ['lente', 'flag', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'flag', da: 'Dall’unità 2.1.1', t: 'Il flag ZF', d: 'Vale 1 quando il risultato dell’ultima operazione che lo ha scritto è zero. Le istruzioni di copia lo lasciano invariato.' },
      { sim: 'puntatore', da: 'Dall’unità 2.2.3', t: 'LEA e i flag', d: 'LEA scrive nella destinazione il valore di un’espressione e lascia invariati sia la memoria sia i flag.' },
      { sim: 'puntatore', da: 'Dall’unità 2.1.1', t: 'RIP', d: 'Contiene l’indirizzo della prossima istruzione. Dopo ogni istruzione avanza oltre i byte appena eseguiti.' }
    ],
    domanda: { d: 'Prima di proseguire: EAX contiene 5 e ZF vale 1. Il processore esegue `mov eax, 0`. Quanto vale ZF subito dopo?', o: [
      { t: '1, come in precedenza', ok: true, fb: 'MOV copia senza eseguire calcoli e lascia invariati i flag, anche quando il valore copiato è zero.' },
      { t: 'Dipende dal contenuto precedente di EAX', fb: 'MOV lascia invariati i flag, qualunque sia il valore copiato e qualunque sia il valore sostituito.' },
      { t: '0', fb: 'MOV lascia invariati i flag. ZF valeva 1 e conserva il valore 1.' }
    ] }
  },
  idea: {
    titolo: 'L’insieme degli effetti di un’istruzione',
    termini: ['contratto di un’istruzione', 'salto condizionale', 'jz'],
    testo: [
      'Due istruzioni possono lasciare il medesimo numero nel medesimo registro e risultare, per il resto del programma, differenti. La differenza emerge dall’esame di tutti gli effetti di un’istruzione: i registri letti, il registro scritto, i flag modificati, l’eventuale accesso alla memoria, il valore assegnato a RIP. L’elenco completo di tali effetti prende il nome di [[contratto di un’istruzione|contratto]] dell’istruzione.',
      'Nelle unità precedenti RIP è sempre avanzato all’istruzione successiva. Un [[salto condizionale]] introduce un’alternativa: esamina un flag e, secondo il suo valore, lascia proseguire l’esecuzione in sequenza oppure scrive in RIP un altro indirizzo. Il più semplice è [[jz|JZ]], «salta se zero». Esso salta alla destinazione indicata quando ZF vale 1, e prosegue con l’istruzione successiva quando ZF vale 0.',
      'Un salto condizionale si limita a leggere. Esso trova i flag nello stato lasciato dall’ultima istruzione che li ha scritti, e decide in base a tale stato. Il contratto delle istruzioni precedenti determina pertanto l’esito del salto.',
      'Si considerino due modi di aggiungere 1 a EAX. L’istruzione `add eax, 1` esegue la somma e scrive tutti i flag in base al risultato, e ZF vale quindi 1 soltanto se EAX è diventato zero. L’istruzione `lea eax, [rax + 1]` produce il medesimo numero e lascia invariati i flag. Se l’istruzione seguente è un JZ, nel primo caso il salto dipende dal nuovo valore di EAX. Nel secondo dipende da un’operazione anteriore, che può trovarsi a grande distanza nel programma.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Due contratti a confronto', nota: 'Le due istruzioni coincidono su EAX e sulla memoria, e differiscono sui flag.', els: [
        SL.el.nota('h1', 300, 0, 'SCRIVE EAX', 'mono'), SL.el.nota('h2', 440, 0, 'SCRIVE I FLAG', 'mono'), SL.el.nota('h3', 580, 0, 'USA LA MEMORIA', 'mono'),
        SL.el.box('i1', 10, 26, 260, 50, null, 'add eax, 1', '', { cls: 'stretta' }), SL.el.cella('a1', 300, 26, 120, 50, 'sì', 'on', { piccola: true }), SL.el.cella('b1', 440, 26, 120, 50, 'sì', 'att', { piccola: true }), SL.el.cella('c1', 580, 26, 120, 50, 'no', 'zero', { piccola: true }),
        SL.el.box('i2', 10, 88, 260, 50, null, 'lea eax, [rax + 1]', '', { cls: 'stretta' }), SL.el.cella('a2', 300, 88, 120, 50, 'sì', 'on', { piccola: true }), SL.el.cella('b2', 440, 88, 120, 50, 'no', 'att', { piccola: true }), SL.el.cella('c2', 580, 88, 120, 50, 'no', 'zero', { piccola: true })] },
      'Per questa ragione due istruzioni sono scambiabili soltanto dopo il confronto integrale dei contratti, e dopo aver accertato che nessuna istruzione successiva legga un effetto che cambia. I compilatori eseguono sistematicamente tale verifica, e la lettura del loro codice richiede di saperla ripetere.',
      'Il caso limite chiarisce la differenza. Con EAX uguale a 0xFFFFFFFF, l’aggiunta di 1 dà 0 su 32 bit. Dopo ADD il flag ZF vale 1 e il salto è eseguito. Dopo LEA il registro contiene il medesimo zero, e ZF conserva il valore precedente, qualunque esso fosse.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processore aumenta EAX di uno e subito dopo incontra un `jz`. I controlli fissano l’istruzione che esegue l’aumento, il contenuto iniziale di EAX e il valore precedente di ZF.',
      'L’esecuzione segue i due effetti dell’istruzione, sul registro e sul flag, e poi la decisione del salto. Dopo il caso proposto, è istruttivo cambiare soltanto l’istruzione e confrontare il percorso seguito da RIP.'
    ],
    vedrai: [
      ['tabella', 'Il programma', 'A sinistra: l’istruzione scelta, il salto e le due possibili prosecuzioni.'],
      ['register', 'Lo stato', 'A destra: EAX, ZF e RIP.'],
      ['lente', 'Il contratto', 'In basso: gli effetti dell’istruzione scelta, uno per uno.']
    ]
  },
  lab: {
    titolo: 'Il medesimo numero, due percorsi',
    scena: { w: 860, h: 340 },
    atti: ['Lo stato di partenza', 'L’aumento', 'Il salto', 'Il confronto'],
    controlli: [
      { id: 'op', tipo: 'scelta', eti: 'Istruzione di aumento', opzioni: [['lea', 'lea eax, [rax + 1]'], ['add', 'add eax, 1']], valore: 'lea' },
      { id: 'x', tipo: 'scelta', eti: 'EAX prima', opzioni: [[5, '5'], [4294967295, '0xFFFFFFFF'], [0, '0']], valore: 5 },
      { id: 'z', tipo: 'scelta', eti: 'ZF prima', opzioni: [[1, '1'], [0, '0']], valore: 1 }
    ],
    previsione: {
      domanda: (p) => 'EAX contiene ' + (p.x > 9 ? '0xFFFFFFFF' : p.x) + ' e ZF vale ' + p.z + '. Il processore esegue `' + (p.op === 'add' ? 'add eax, 1' : 'lea eax, [rax + 1]') + '` e poi `jz 0x401020`. Qual è l’esito del salto?',
      opzioni: () => [['salta', 'Salto eseguito: RIP riceve 0x401020'], ['prosegue', 'Nessun salto: l’esecuzione prosegue in sequenza']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava che il salto ' + (pred === 'salta' ? 'fosse eseguito' : 'non fosse eseguito') + '. ' + (esito === 'salta' ? 'È stato eseguito' : 'Non è stato eseguito') + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.op === 'lea' ? 'LEA lascia invariati i flag. JZ ha trovato ZF = ' + p.z + ', il valore precedente all’aumento.' : 'ADD scrive ZF in base al risultato, che vale ' + ((p.x + 1) % 4294967296) + '. Il valore precedente di ZF è stato sostituito.'),
    costruisci(p) {
      const el = SL.el, passi = [];
      const ADD = p.op === 'add', dopo = (p.x + 1) % 4294967296, zfDopo = ADD ? (dopo === 0 ? 1 : 0) : p.z, salta = zfDopo === 1;
      const zfAltra = ADD ? p.z : (dopo === 0 ? 1 : 0), HX = (v) => '0x' + v.toString(16).toUpperCase().padStart(8, '0');
      const TESTO = ADD ? 'add eax, 1' : 'lea eax, [rax + 1]';
      const s = { eax: p.x, zf: p.z, rip: '0x401000' };
      const RIGHE = [['0x401000', TESTO], ['0x401003', 'jz 0x401020'], ['0x401005', 'prosecuzione in sequenza'], ['0x401020', 'destinazione del salto']];
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

      P({}, 0, 'Lo stato di partenza', 'EAX contiene ' + HX(p.x) + '. ZF vale ' + p.z + ': tale valore è stato lasciato da un’operazione precedente, qui irrilevante. RIP indica l’istruzione di aumento.');
      s.eax = dopo;
      P({ riga: 0, att: 'eax', c: 1 }, 1, 'Il primo effetto: EAX', (ADD ? 'ADD somma 1 al contenuto di EAX.' : 'LEA calcola l’espressione RAX + 1 e la scrive in EAX.') + ' Il registro passa da ' + HX(p.x) + ' a ' + HX(dopo) + (dopo === 0 ? ': su 32 bit, dopo 0xFFFFFFFF il conteggio riparte da zero.' : '.') + ' Fino a questo punto le due istruzioni sono indistinguibili.',
        { calc: 'EAX = ' + HX(dopo), chiedi: { d: 'L’istruzione eseguita è `' + TESTO + '`. In precedenza ZF valeva ' + p.z + ', e il risultato scritto in EAX è ' + dopo + '. Quanto vale ZF dopo l’istruzione?', o: ['0', '1'], g: zfDopo, no: ADD ? 'ADD scrive ZF in base al risultato, che ' + (dopo === 0 ? 'è zero. ZF vale pertanto 1.' : 'è diverso da zero. ZF vale pertanto 0.') : 'LEA lascia invariati i flag, e ZF conserva quindi il valore ' + p.z + '.' } });
      s.zf = zfDopo; s.rip = '0x401003';
      P({ riga: 0, att: 'zf', c: 2 }, 1, 'Il secondo effetto: i flag', ADD ? 'ADD scrive anche i flag. Il risultato è ' + (dopo === 0 ? 'zero, e ZF assume quindi il valore 1.' : 'diverso da zero, e ZF assume quindi il valore 0.') + ' Il valore precedente di ZF è perduto.' : 'L’effetto di LEA si limita al registro. I flag sono esclusi dai suoi effetti, e ZF conserva il valore ' + p.z + ' lasciato dall’operazione precedente, anche se il nuovo contenuto di EAX ' + (dopo === 0 ? 'è zero.' : 'è diverso da zero.'),
        { calc: 'ZF = ' + zfDopo });
      P({ riga: 1, fatte: [0], att: 'zf', c: 2, dec: 'ZF = ' + zfDopo + (salta ? ' → salta' : ' → prosegue') }, 2, 'JZ legge ZF', 'Il salto condizionale esamina soltanto il flag. ZF vale ' + zfDopo + ', quindi ' + (salta ? 'la condizione «zero» è vera e il salto è eseguito.' : 'la condizione «zero» è falsa e il salto non è eseguito.'), { calc: 'jz: ZF = ' + zfDopo, esito: [salta ? 'salta' : 'prosegue', salta ? 'si' : 'no'] });
      s.rip = salta ? '0x401020' : '0x401005';
      P({ riga: salta ? 3 : 2, fatte: [0, 1], att: 'rip', c: 2, dec: salta ? 'RIP ← 0x401020' : 'RIP ← 0x401005' }, 2, salta ? 'RIP riceve la destinazione' : 'RIP avanza in sequenza', salta ? 'JZ scrive in RIP l’indirizzo indicato, 0x401020. L’istruzione situata a 0x401005 è omessa.' : 'JZ occupa due byte, e RIP avanza a 0x401005 come dopo ogni altra istruzione. La destinazione 0x401020 resta inutilizzata.', { calc: 'RIP = ' + s.rip });
      P({ riga: salta ? 3 : 2, fatte: [0, 1], c: 2, dec: (ADD ? 'con LEA' : 'con ADD') + ': ZF = ' + zfAltra + (zfAltra ? ' → salta' : ' → prosegue') }, 3, 'Con l’altra istruzione', 'Se l’aumento fosse stato eseguito con ' + (ADD ? 'LEA' : 'ADD') + ', EAX conterrebbe il medesimo valore, ' + HX(dopo) + ', e ZF varrebbe ' + zfAltra + '. ' + (zfAltra === zfDopo ? 'In questo caso i due percorsi coincidono, per i dati scelti. Con altri dati essi divergono.' : 'Il salto avrebbe seguito l’altro percorso. Le due istruzioni scrivono il medesimo numero e hanno contratti diversi.'), { calc: (ADD ? 'add' : 'lea') + ': ZF = ' + zfDopo + ' · ' + (ADD ? 'lea' : 'add') + ': ZF = ' + zfAltra });
      return { passi, esito: salta ? 'salta' : 'prosegue' };
    }
  },
  bilancio: {
    regola: [
      'Il contratto di un’istruzione è l’elenco di tutti i suoi effetti: registri, flag, memoria, RIP. Due istruzioni sono equivalenti soltanto se coincidono su ogni effetto letto dal seguito del programma.',
      'Un salto condizionale legge i flag lasciati dall’ultima istruzione che li ha scritti. JZ salta quando ZF vale 1. ADD e SUB scrivono i flag, mentre MOV e LEA li lasciano invariati.'
    ],
    errori: [
      ['Considerare soltanto il registro di destinazione.', 'Dopo `lea eax, [rax + 1]` EAX può valere zero mentre ZF vale 0. Il flag descrive un’operazione precedente.'],
      ['Ritenere che JZ esamini un registro.', 'JZ legge soltanto ZF. Il registro che ha prodotto tale valore dipende dall’ultima istruzione che ha scritto i flag.'],
      ['Sostituire ADD con LEA senza esaminare le istruzioni successive.', 'La sostituzione è lecita soltanto se nessuna istruzione successiva legge i flag che ADD avrebbe scritto.']
    ],
    saFare: ['Elencare gli effetti di ADD, LEA e MOV su registri e flag.', 'Prevedere se un JZ salta, risalendo all’istruzione che ha scritto ZF.', 'Stabilire se due istruzioni sono intercambiabili in un dato punto del programma.'],
    esercizi: [
      { d: 'EAX contiene 7 e ZF vale 1. Il processore esegue `lea eax, [rax + 1]` e poi `jz fine`. Qual è l’esito?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il salto è eseguito, perché ZF è rimasto a 1', ok: true, fb: 'LEA lascia invariati i flag. JZ trova ancora ZF = 1, anche se EAX vale 8.' },
        { t: 'Il salto non è eseguito, perché EAX vale 8', fb: 'JZ legge ZF e ignora EAX. LEA ha lasciato ZF al valore precedente, cioè 1.' },
        { t: 'L’esito è imprevedibile', fb: 'L’esito è determinato: ZF valeva 1 e nessuna delle due istruzioni lo ha modificato.' }] },
      { d: 'RIP contiene 0x401003, dove comincia un’istruzione `jz 0x401020` lunga 2 byte. ZF vale 0. Quanto vale RIP dopo l’istruzione? Si risponda in esadecimale.', segnaposto: 'Un indirizzo esadecimale', giuste: ['0x401005', '401005', '401005h'],
        ok: 'Con ZF = 0 il salto è escluso, e RIP avanza oltre i due byte di JZ: 0x401003 + 2 = 0x401005.',
        diagnosi: [
          { se: ['0x401020', '401020'], msg: 'Il valore indicato è la destinazione del salto, impiegata soltanto quando ZF vale 1. In questo caso ZF vale 0.' },
          { se: ['0x401003', '401003'], msg: 'Il valore indicato è l’indirizzo di JZ. Anche un salto non eseguito fa avanzare RIP oltre i propri byte.' },
          { se: ['0x401004', '401004'], msg: 'L’istruzione occupa due byte, e RIP avanza quindi di due.' }
        ],
        altro: 'L’indirizzo è diverso. Si stabilisca dapprima se il salto è eseguito, in base a ZF, e poi il valore di RIP.',
        indizi: ['JZ salta quando ZF vale 1.', 'In questo caso ZF vale 0, e l’esecuzione prosegue quindi in sequenza.', 'L’istruzione successiva comincia due byte dopo 0x401003.'],
        svolgimento: ['ZF = 0: la condizione «zero» è falsa.', 'Il salto non è eseguito e RIP avanza come dopo ogni istruzione.', 'RIP = 0x401003 + 2 = 0x401005.'] }
    ],
    sfida: ['cslez2_2_04_random_assembly_04', 'Complemento, scorrimenti e uguaglianza']
  }
});
