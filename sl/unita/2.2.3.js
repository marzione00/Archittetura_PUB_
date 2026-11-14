'use strict';
SL.registra('2.2.3', {
  titolo: 'Moltiplicazione, divisione e calcolo dell’indirizzo efficace',
  obiettivo: 'Obiettivo: preparare i registri per una divisione, leggere quoziente e resto, prevedere l’effetto di un divisore nullo e impiegare LEA come istruzione di calcolo.',
  concetti: [['alu', 'DIV: quoziente e resto'], ['conflitto', 'Eccezione #DE'], ['puntatore', 'LEA']],
  filigrana: ['alu', 'conflitto', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'operation', da: 'Dall’unità 1.4.4', t: 'La divisione intera', d: 'La divisione che si arresta al quoziente e conserva a parte il resto: 255 diviso 13 dà 19, con il resto di 8.' },
      { sim: 'operation', da: 'Dall’unità 2.2.2', t: 'IMUL', d: 'Nella forma a due operandi moltiplica la destinazione per la sorgente e scrive il prodotto nella destinazione.' },
      { sim: 'memory', da: 'Dall’unità 2.1.2', t: 'Le parentesi quadre', d: 'Un nome fra parentesi quadre indica la memoria situata all’indirizzo contenuto nel registro.' }
    ],
    domanda: { d: 'Prima di proseguire: nella divisione intera di 17 per 5, quanto valgono quoziente e resto?', o: [
      { t: '3 e 2', ok: true, fb: 'Tre gruppi da cinque danno quindici, con un resto di due: 3 × 5 + 2 = 17.' },
      { t: '3 e 4', fb: 'Il resto è la differenza fra 17 e 3 × 5, cioè 2.' },
      { t: '2 e 7', fb: 'Un resto di 7 supera il divisore: da sette unità residue si ricava ancora un gruppo da cinque.' }
    ] }
  },
  idea: {
    titolo: 'Quoziente, resto e un calcolo derivato dagli indirizzi',
    termini: ['div', 'eccezione del processore', 'indirizzo efficace', 'spiazzamento', 'lea'],
    testo: [
      'La moltiplicazione dell’unità precedente presenta una particolarità: il prodotto di due numeri di 64 bit può richiederne 128. La forma di IMUL a due operandi conserva i 64 bit più bassi, come ADD, e ciò è sufficiente per la maggior parte dei programmi.',
      'La divisione pone un vincolo ulteriore, poiché produce due risultati, il quoziente e il resto. L’istruzione [[div|DIV]] li calcola insieme, per numeri senza segno, e impiega registri prestabiliti. Il dividendo è un numero di 128 bit formato da due registri: RDX ne costituisce la metà alta e RAX la metà bassa. Quando il numero da dividere è contenuto in 64 bit, come avviene nella maggior parte dei casi, RDX va azzerato prima di DIV.',
      'L’unico operando scritto nell’istruzione è il divisore: `div rcx` divide per il contenuto di RCX. Al termine RAX contiene il quoziente e RDX il resto. Il risultato è verificabile mediante la relazione che lega le quattro quantità: quoziente × divisore + resto = dividendo, con il resto sempre minore del divisore.',
      { fig: 'scena', w: 720, h: 100, titolo: 'I registri di DIV, prima e dopo', nota: 'L’esempio è 17 diviso 5. Riscontro: 3 × 5 + 2 = 17.', els: [
        SL.el.box('a', 10, 8, 120, 80, 'RDX', '0', ''), SL.el.box('b', 140, 8, 120, 80, 'RAX', '17', 'on'), SL.el.box('c', 270, 8, 120, 80, 'RCX', '5', 'on'),
        SL.el.linea('l', 390, 48, 440, 48, 'att'), SL.el.box('d', 440, 8, 130, 80, 'RAX · quoziente', '3', 'att'), SL.el.box('e', 580, 8, 130, 80, 'RDX · resto', '2', 'att')] },
      'La divisione per zero è un’operazione priva di risultato. Se il divisore vale zero, DIV omette il calcolo e solleva un’[[eccezione del processore|eccezione]], cioè un evento che interrompe l’istruzione e trasferisce il controllo al sistema operativo. Tale eccezione è indicata con la sigla #DE, dall’inglese divide error. RAX e RDX restano invariati, e di norma il sistema operativo termina il programma.',
      'L’ultimo strumento di questa unità deriva dal calcolo degli indirizzi. Per raggiungere un dato in memoria il processore calcola, nel corso della medesima istruzione, un’espressione della forma base + indice × scala + spiazzamento. Base e indice sono registri, la scala vale 1, 2, 4 oppure 8, e lo [[spiazzamento]] è una costante scritta nell’istruzione. Il risultato prende il nome di [[indirizzo efficace]].',
      'L’istruzione [[lea|LEA]] calcola tale espressione senza accedere alla memoria: il numero ottenuto è scritto nel registro di destinazione. `lea rax, [rdi + rsi*4]` scrive in RAX il valore RDI + 4 × RSI, cioè una somma e una moltiplicazione in una sola istruzione. LEA lascia invariati anche i flag. Nella prossima unità è impiegata per moltiplicare per piccole costanti.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processore divide un numero senza segno per un altro, con l’istruzione DIV. I controlli fissano dividendo e divisore, e fra i divisori è compreso lo zero.',
      'L’esecuzione segue la preparazione dei registri, l’esame del divisore e la scrittura dei due risultati. Dopo il caso proposto, è istruttivo scegliere il divisore zero e individuare il punto in cui l’istruzione si arresta.'
    ],
    vedrai: [
      ['register', 'I tre registri', 'In alto: RDX, RAX e RCX, con il ruolo che DIV assegna a ciascuno.'],
      ['alu', 'La divisione', 'Al centro: il calcolo del quoziente e del resto.'],
      ['scudo', 'La verifica', 'In basso: la relazione che ricostruisce il dividendo, oppure l’eccezione.']
    ]
  },
  lab: {
    titolo: 'Una divisione con DIV',
    scena: { w: 860, h: 320 },
    atti: ['La preparazione', 'Il divisore', 'I due risultati', 'La verifica'],
    nota: 'Il numero di passi dipende dai dati: con un divisore nullo l’istruzione si interrompe.',
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'Dividendo, in RAX', opzioni: [17, 100, 255, 7, 64], valore: 17 },
      { id: 'b', tipo: 'scelta', eti: 'Divisore, in RCX', opzioni: [5, 0, 3, 8, 16], valore: 5 }
    ],
    previsione: {
      domanda: (p) => 'RAX contiene ' + p.a + ' e RCX contiene ' + p.b + '. Il programma esegue `mov edx, 0` e poi `div rcx`. Che cosa si troverà nei registri?',
      opzioni: (p) => {
        const q = p.b ? Math.floor(p.a / p.b) : 0, r = p.b ? p.a % p.b : 0, T = (x, y) => 'RAX = ' + x + ', RDX = ' + y;
        const tutte = p.b ? [T(q, r), T(r, q), T(q, 0), 'Nessun risultato: eccezione #DE'] : ['Nessun risultato: eccezione #DE', T(0, 0), T(p.a, 0), T(0, p.a)];
        return Array.from(new Set(tutte)).sort().map((t) => [t, t]);
      }
    },
    confronto: (pred, esito, p) => 'La previsione indicava: ' + pred + '. Esito: ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.b === 0 ? 'Con un divisore nullo DIV omette il calcolo e solleva l’eccezione #DE. I registri restano invariati.' : 'Il quoziente è scritto in RAX e il resto in RDX: ' + Math.floor(p.a / p.b) + ' × ' + p.b + ' + ' + (p.a % p.b) + ' = ' + p.a + '.'),
    costruisci(p) {
      const el = SL.el, passi = [], a = p.a, b = p.b, q = b ? Math.floor(a / b) : null, r = b ? a % b : null;
      const s = { rdx: '?', rax: String(a), rcx: String(b) };
      const quadro = (o) => {
        o = o || {};
        const st = (k) => (o.err === k ? 'err' : o.att === k ? 'att' : '');
        return [
          el.nota('t1', 40, 0, 'I REGISTRI DI DIV', 'mono'),
          el.box('rdx', 40, 28, 250, 84, o.dopo ? 'RDX · resto' : 'RDX · metà alta', s.rdx, st('rdx') || (o.dopo ? 'on' : ''), { sim: 'register', riga: true }),
          el.box('rax', 305, 28, 250, 84, o.dopo ? 'RAX · quoziente' : 'RAX · metà bassa', s.rax, st('rax') || (o.dopo ? 'on' : ''), { sim: 'register', riga: true }),
          el.box('rcx', 570, 28, 260, 84, 'RCX · divisore', s.rcx, st('rcx'), { sim: 'register', riga: true }),
          el.box('ist', 40, 132, 250, 70, 'istruzione', o.ist || '·', o.ist ? 'att' : '', { cls: 'stretta' }),
          el.box('cal', 305, 132, 525, 70, 'calcolo', o.calcolo || '·', o.calcolo ? (o.male ? 'err' : 'on') : '', { sim: 'alu', riga: true, cls: 'stretta' }),
          el.box('ver', 40, 222, 790, 78, o.male ? 'esito' : 'verifica', o.verifica || '·', o.verifica ? (o.male ? 'err' : 'on') : '', { sim: o.male ? 'conflitto' : 'scudo', riga: true, cls: 'stretta' })
        ];
      };
      const hud = () => [['RAX', s.rax, 'a'], ['RDX', s.rdx], ['RCX', s.rcx, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'I registri prima', 'Il numero da dividere, ' + a + ', è in RAX. Il divisore, ' + b + ', è in RCX. RDX contiene ancora un valore lasciato dalle istruzioni precedenti, indicato con un punto interrogativo.');
      s.rdx = '0';
      P({ att: 'rdx', ist: 'mov edx, 0' }, 0, 'La metà alta va azzerata', 'DIV considera come dividendo la coppia RDX:RAX, con RDX nella parte alta. Un valore residuo in RDX altererebbe il dividendo di molti ordini di grandezza. La scrittura in EDX azzera l’intero registro, e il dividendo diventa esattamente ' + a + '.',
        { calc: 'RDX:RAX = 0:' + a + ' = ' + a, chiedi: { d: 'Il divisore, in RCX, vale ' + b + '. DIV potrà produrre un quoziente?', o: ['Sì', 'No'], g: b ? 0 : 1, no: b ? 'Il divisore è diverso da zero, e la divisione ha quindi un risultato.' : 'La divisione per zero è priva di risultato, e DIV solleva un’eccezione.' } });
      if (!b) {
        P({ err: 'rcx', ist: 'div rcx', calcolo: a + ' ÷ 0', male: true }, 1, 'Il divisore è zero', 'Prima del calcolo DIV esamina il divisore. Esso vale zero, e nessun numero moltiplicato per zero può ricostruire ' + a + '. La divisione è priva di risultato.', { calc: a + ' ÷ 0', esito: ['impossibile', 'no'] });
        P({ err: 'rcx', ist: 'div rcx', calcolo: a + ' ÷ 0', male: true, verifica: 'eccezione #DE · RAX e RDX invariati' }, 3, 'L’eccezione #DE', 'DIV solleva l’eccezione di errore di divisione, in sigla #DE. L’istruzione si interrompe senza alcuna scrittura: RAX vale ancora ' + a + ' e RDX vale ancora 0. Il controllo passa al sistema operativo, che di norma termina il programma.', { calc: 'eccezione #DE' });
        return { passi, esito: 'Nessun risultato: eccezione #DE' };
      }
      P({ att: 'rcx', ist: 'div rcx' }, 1, 'Il divisore è valido', 'Il divisore vale ' + b + ', diverso da zero. DIV può calcolare quante volte ' + b + ' è contenuto in ' + a + ' e quale resto si ottiene.', { calc: a + ' ÷ ' + b });
      s.rax = String(q);
      P({ att: 'rax', ist: 'div rcx', calcolo: a + ' ÷ ' + b + ' = ' + q + ' gruppi interi', dopo: false }, 2, 'Il quoziente è scritto in RAX', 'Il divisore ' + b + ' è contenuto ' + q + (q === 1 ? ' volta' : ' volte') + ' in ' + a + '. Il quoziente sostituisce il dividendo in RAX.', { calc: 'quoziente = ' + q });
      s.rdx = String(r);
      P({ att: 'rdx', ist: 'div rcx', calcolo: a + ' − ' + q + ' × ' + b + ' = ' + r, dopo: true }, 2, 'Il resto è scritto in RDX', 'Tolti i ' + q + ' gruppi da ' + b + ', cioè ' + q * b + ', da ' + a + ' avanza ' + r + '. Il resto è scritto in RDX, al posto dello zero predisposto in precedenza.', { calc: 'resto = ' + a + ' − ' + q * b + ' = ' + r });
      P({ dopo: true, calcolo: a + ' ÷ ' + b + ' = ' + q + ' con resto ' + r, verifica: q + ' × ' + b + ' + ' + r + ' = ' + a + ' · resto ' + r + ' < ' + b }, 3, 'La verifica', 'Le quattro quantità sono legate da una relazione che consente di verificare il risultato: quoziente per divisore, più resto, deve restituire il dividendo. Il resto, inoltre, è minore del divisore. RCX è rimasto invariato.', { calc: q + ' × ' + b + ' + ' + r + ' = ' + a });
      return { passi, esito: 'RAX = ' + q + ', RDX = ' + r };
    }
  },
  bilancio: {
    regola: [
      'DIV divide il numero senza segno formato da RDX e RAX per il proprio operando. Scrive il quoziente in RAX e il resto in RDX. Prima dell’impiego con un dividendo di 64 bit, RDX va azzerato.',
      'Un divisore nullo solleva l’eccezione #DE, e i registri restano invariati. LEA calcola un’espressione della forma base + indice × scala + spiazzamento e ne scrive il valore nella destinazione, senza modificare la memoria e i flag.'
    ],
    errori: [
      ['Omettere l’azzeramento di RDX.', 'DIV impiega RDX come metà alta del dividendo. Un valore residuo in tale registro modifica il numero diviso.'],
      ['Cercare il resto in RAX.', 'RAX riceve il quoziente. Il resto è scritto in RDX.'],
      ['Ritenere che LEA legga la memoria.', 'Le parentesi quadre, in LEA, racchiudono soltanto l’espressione da calcolare. Il risultato è il numero, e la cella di tale indirizzo resta estranea all’istruzione.']
    ],
    saFare: ['Preparare RDX e RAX per una divisione con DIV.', 'Leggere quoziente e resto e verificarli con la relazione che ricostruisce il dividendo.', 'Calcolare il valore scritto da una LEA.'],
    esercizi: [
      { d: 'RDX contiene 0, RAX contiene 47 e RCX contiene 6. Quanto vale RDX dopo `div rcx`?', segnaposto: 'Un numero', giuste: ['5', 'cinque'],
        ok: 'Il 6 è contenuto sette volte in 47, e 7 × 6 = 42. Il resto, 47 − 42 = 5, è scritto in RDX.',
        diagnosi: [
          { se: ['7', 'sette'], msg: 'Il valore indicato è il quoziente, scritto in RAX. RDX riceve il resto.' },
          { se: ['0', 'zero'], msg: 'Zero era il contenuto di RDX prima della divisione. DIV vi scrive il resto.' },
          { se: ['47'], msg: 'Il valore indicato è il dividendo. Dopo DIV, RAX contiene il quoziente e RDX il resto.' }
        ],
        altro: 'Il valore è diverso. Si calcoli quante volte 6 è contenuto in 47 e quale resto si ottiene.',
        indizi: ['DIV scrive il quoziente in RAX e il resto in RDX.', 'Il 6 è contenuto sette volte in 47.', '7 × 6 fa 42.'],
        svolgimento: ['Dividendo: RDX:RAX = 47.', 'Quoziente: 47 ÷ 6 = 7, scritto in RAX.', 'Resto: 47 − 42 = 5, scritto in RDX.', 'Riscontro: 7 × 6 + 5 = 47.'] },
      { d: 'RDI contiene 10 e RSI contiene 3. Che cosa contiene RAX dopo `lea rax, [rdi + rsi*4]`?', guida: 'Si scelga la risposta.', o: [
        { t: '22', ok: true, fb: 'LEA calcola l’espressione fra parentesi: 10 + 3 × 4 = 22.' },
        { t: '52', fb: 'La scala moltiplica soltanto l’indice: 10 + 3 × 4. Il valore 52 deriverebbe da (10 + 3) × 4.' },
        { t: 'Il contenuto della cella di indirizzo 22', fb: 'LEA si limita al calcolo e scrive il numero 22. La lettura della cella richiederebbe una MOV.' }] }
    ]
  }
});
