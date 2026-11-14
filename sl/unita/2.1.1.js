'use strict';
SL.registra('2.1.1', {
  titolo: 'Stato architetturale ed esecuzione',
  obiettivo: 'Obiettivo: elencare le parti dello stato di un processore x86-64 e seguire un’istruzione dalla lettura dei suoi byte fino all’avanzamento di RIP.',
  concetti: [['register', 'Stato architetturale'], ['puntatore', 'RIP'], ['flag', 'Flag']],
  filigrana: ['register', 'flag', 'cpu'],
  richiami: {
    carte: [
      { sim: 'register', da: 'Dall’unità 1.1.2', t: 'Registri e memoria', d: 'Il processore conserva nei registri i dati sui quali opera. La memoria è una successione di celle, ciascuna con il proprio indirizzo.' },
      { sim: 'file', da: 'Dall’unità 1.1.3', t: 'Il linguaggio assembly', d: 'Le istruzioni del processore scritte con nomi leggibili. Ogni riga corrisponde a un’istruzione in codice macchina.' },
      { sim: 'pila', da: 'Dall’unità 1.4.2', t: 'Il riporto uscente', d: 'Se una somma supera la larghezza della parola, il riporto dell’ultima colonna esce e nella parola restano i bit bassi.' }
    ],
    domanda: { d: 'Prima di proseguire: su otto bit si calcola 255 + 1. Quale byte resta nella parola?', o: [
      { t: '0x00', ok: true, fb: 'Il risultato esatto, 256, in binario è un 1 seguito da otto zeri. L’1 esce come riporto e restano gli otto zeri.' },
      { t: '0xFF', fb: 'Sommando 1 a 1111 1111 ogni colonna produce un riporto e scrive 0. Il byte cambia per intero.' },
      { t: '0x100', fb: 'Tre cifre esadecimali sono dodici bit. La parola ne ha otto.' }
    ] }
  },
  idea: {
    titolo: 'Lo stato della macchina, un’istruzione alla volta',
    termini: ['stato architetturale', 'puntatore di istruzione', 'flag', 'mov', 'add', 'immediato'],
    testo: [
      'Il Modulo I ha mostrato come i dati siano rappresentati da byte. Questo modulo mostra come un programma li trasformi, al livello delle istruzioni eseguite dal processore. Il processore di riferimento è quello dei comuni calcolatori da tavolo e portatili, la famiglia x86-64. Le sue istruzioni si scrivono in [[linguaggio assembly]], la forma leggibile del codice macchina introdotta nell’unità 1.1.3.',
      'Lo studio di un programma a questo livello richiede di seguire pochi elementi. I registri sono piccole memorie interne al processore, ciascuna dotata di un nome. La memoria è la successione di celle numerate dell’unità 1.1.2. Un registro particolare, denominato RIP, contiene l’indirizzo della prossima istruzione da eseguire e prende il nome di [[puntatore di istruzione]]. Alcuni bit, i [[flag]], conservano infine l’esito dell’ultima operazione. L’insieme di tali contenuti costituisce lo [[stato architetturale]], cioè tutto ciò che un programma può leggere o modificare.',
      { fig: 'scena', w: 760, h: 100, titolo: 'Le quattro parti dello stato', nota: 'Ogni istruzione ne modifica una piccola porzione e lascia invariato il resto.', els: [
        SL.el.box('a', 10, 8, 178, 80, 'registri', 'RAX, RBX …', '', { sim: 'register', riga: true, cls: 'stretta' }),
        SL.el.box('b', 198, 8, 178, 80, 'memoria', 'le celle', '', { sim: 'memory', riga: true, cls: 'stretta' }),
        SL.el.box('c', 386, 8, 178, 80, 'RIP', 'dove siamo', 'att', { sim: 'puntatore', riga: true, cls: 'stretta' }),
        SL.el.box('d', 574, 8, 176, 80, 'flag', 'CF, ZF …', 'on', { sim: 'flag', riga: true, cls: 'stretta' })] },
      'L’esecuzione di un programma consiste nella ripetizione di tre passaggi. Il processore legge dalla memoria i byte che si trovano all’indirizzo contenuto in RIP. Li riconosce come un’istruzione e la esegue, modificando una piccola parte dello stato. Fa quindi avanzare RIP oltre i byte appena letti, in modo che indichi l’istruzione successiva. In questa prospettiva un’istruzione è una regola che trasforma lo stato precedente nello stato successivo.',
      'Le prime due istruzioni considerate sono fra le più comuni. [[mov|MOV]] copia un valore nella destinazione. [[add|ADD]] somma un valore alla destinazione e vi scrive il risultato. Nella notazione adottata la destinazione precede la sorgente: `mov al, 254` copia il numero 254 in AL, e `add al, 1` aggiunge 1 al contenuto di AL. Un numero scritto direttamente nell’istruzione, come 254, prende il nome di [[immediato]]. Nei listati le istruzioni compaiono in minuscolo, come le presentano gli strumenti di sviluppo, mentre nel testo i loro nomi sono scritti in maiuscolo.',
      'AL è il nome degli otto bit più bassi di un registro più grande, RAX. Otto bit sono sufficienti per i numeri da 0 a 255. Se AL contiene 255 e l’istruzione aggiunge 1, il risultato esatto, 256, richiederebbe un nono bit. In AL restano gli otto bit bassi, tutti a zero, come nel riporto uscente dell’unità 1.4.2.',
      'A questo punto intervengono i flag. Dopo una somma il processore registra due fatti in due bit separati. Il flag CF, dall’inglese carry flag, vale 1 se la somma ha prodotto un riporto oltre l’ultimo bit della destinazione. Il flag ZF, zero flag, vale 1 se il risultato scritto nella destinazione è zero. Il solo contenuto di AL è ambiguo, poiché uno zero può derivare da 255 + 1 come da 0 + 0. Il flag CF risolve l’ambiguità.',
      'Le istruzioni che si limitano a copiare lasciano invariati i flag. MOV è una di esse. Dopo una MOV i flag conservano il valore lasciato dall’ultima operazione aritmetica, anche quando tale operazione precede di molte righe.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processore esegue due istruzioni. La prima copia un numero in AL, la seconda gli aggiunge 1. Il numero è fissato da un controllo.',
      'Per ciascuna istruzione si seguono i tre passaggi: lettura dei byte indicati da RIP, esecuzione, avanzamento di RIP. Vanno osservate le parti dello stato che cambiano e quelle che restano invariate. Dopo il caso proposto, è istruttivo il valore 254.'
    ],
    vedrai: [
      ['tabella', 'Il programma', 'A sinistra: le istruzioni, ciascuna con l’indirizzo a cui comincia.'],
      ['register', 'Lo stato', 'A destra: RIP, i flag CF e ZF, e sotto gli otto bit di AL.'],
      ['alu', 'L’operazione in corso', 'In basso: i byte letti all’indirizzo scritto in RIP e il calcolo svolto.']
    ]
  },
  lab: {
    titolo: 'Due istruzioni un passo alla volta',
    scena: { w: 860, h: 330 },
    atti: ['Lo stato di partenza', 'La prima istruzione', 'La seconda istruzione', 'Lo stato di arrivo'],
    controlli: [
      { id: 'a', tipo: 'num', eti: 'Numero da copiare in AL', min: 0, max: 255, salti: [1, 16], valore: 255 }
    ],
    previsione: {
      domanda: (p) => 'Il processore esegue `mov al, ' + p.a + '` e poi `add al, 1`. Al termine quanto varranno AL e i flag CF e ZF?',
      opzioni: (p) => {
        const r = (p.a + 1) & 255, cf = p.a === 255 ? 1 : 0, zf = r === 0 ? 1 : 0, T = (al, c, z) => 'AL = ' + al + ', CF = ' + c + ', ZF = ' + z;
        const giusta = T(r, cf, zf);
        return Array.from(new Set([giusta, T(p.a + 1, 0, 0), T(0, 1, 1), T(p.a, 0, 0), T(r, 1 - cf, zf)])).slice(0, 4).sort().map((t) => [t, t]);
      }
    },
    confronto: (pred, esito, p) => 'La previsione indicava: ' + pred + '. Esito: ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.a === 255 ? 'Il risultato esatto, 256, richiede nove bit. In AL restano gli otto bit bassi, tutti a zero, il riporto è registrato in CF e il byte nullo porta ZF a 1.' : 'La somma ' + p.a + ' + 1 è contenuto in otto bit, e nessun riporto esce: CF vale 0. Il risultato è diverso da zero, e anche ZF vale quindi 0.'),
    costruisci(p) {
      const el = SL.el, X = SL.x86, passi = [];
      const a = p.a, vero = a + 1, r = vero & 255, cf = vero > 255 ? 1 : 0, zf = r === 0 ? 1 : 0;
      const s = { rip: 0x401000, al: 0x3C, cf: 0, zf: 0 };
      const RIP = () => '0x' + s.rip.toString(16).toUpperCase();
      const RIGHE = [['0x401000', 'mov al, ' + a], ['0x401002', 'add al, 1'], ['0x401004', 'istruzione successiva']];
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('t1', 40, 0, 'IL PROGRAMMA IN MEMORIA', 'mono')];
        X.listato('i', RIGHE, o.riga, { x: 40, y: 28, w: 250, passo: 68 }).forEach((e) => els.push(e));
        els.push(el.box('rip', 330, 28, 240, 60, 'RIP · prossima istruzione', RIP(), o.att === 'rip' ? 'att' : '', { cls: 'stretta' }));
        X.flag('f', { CF: s.cf, ZF: s.zf }, { x: 590, y: 28, passo: 122, h: 60, att: o.att === 'flag' ? ['CF', 'ZF'] : [] }).forEach((e) => els.push(e));
        els.push(el.nota('t2', 330, 106, 'AL · GLI OTTO BIT PIÙ BASSI DI RAX · ' + X.esa(s.al, 2) + ' = ' + s.al, 'mono'));
        X.bit('b', s.al, { x: 330, y: 158, st: o.att === 'al' ? 'att' : null }).forEach((e) => els.push(e));
        els.push(el.box('letti', 40, 246, 250, 70, 'byte letti', o.letti || '·', o.letti ? 'on' : '', { sim: 'byte', riga: true }));
        els.push(el.box('calc', 330, 246, 500, 70, 'operazione in corso', o.lavoro || '·', o.lavoro ? (o.forte ? 'att' : 'on') : '', { sim: 'alu', riga: true, cls: 'stretta' }));
        return els;
      };
      const hud = () => [['RIP', RIP(), 'a'], ['AL', X.esa(s.al, 2) + ' · ' + s.al], ['CF · ZF', s.cf + ' · ' + s.zf, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Lo stato di partenza', 'RIP contiene 0x401000, l’indirizzo della prossima istruzione. AL contiene ancora il valore lasciato dalle istruzioni precedenti, 0x3C. I flag CF e ZF valgono 0.');
      P({ riga: 0, att: 'rip', letti: 'B0 ' + X.esa2(a) }, 1, 'Lettura della prima istruzione', 'Il processore legge i byte che si trovano all’indirizzo scritto in RIP. Sono due: B0 e ' + X.esa2(a) + '. Il primo significa «copia in AL il byte che segue», il secondo è l’immediato ' + a + '.', { calc: 'B0 ' + X.esa2(a) + ' → mov al, ' + a });
      s.al = a;
      P({ riga: 0, att: 'al', letti: 'B0 ' + X.esa2(a), lavoro: 'AL ← ' + a }, 1, 'Esecuzione: AL riceve ' + a, 'L’istruzione viene eseguita e gli otto bit di AL diventano ' + X.bin8(a) + '. I flag restano invariati, poiché MOV copia senza calcolare.',
        { calc: 'AL = ' + a + ' = ' + X.esa(a, 2), chiedi: { d: 'L’istruzione appena eseguita occupa due byte, a partire da 0x401000. Quanto varrà RIP dopo l’avanzamento?', o: ['0x401001', '0x401002', '0x401004'], g: 1, no: 'RIP avanza oltre i byte dell’istruzione appena eseguita, che sono due: 0x401000 + 2.' } });
      s.rip = 0x401002;
      P({ riga: 1, att: 'rip' }, 1, 'RIP avanza', 'L’istruzione occupava due byte, e RIP avanza quindi di due e indica l’istruzione successiva. La prima istruzione è conclusa.', { calc: '0x401000 + 2 = 0x401002' });
      const opz = Array.from(new Set([r, vero, a])).sort((x, y) => x - y).map(String);
      P({ riga: 1, att: 'rip', letti: '04 01' }, 2, 'Lettura della seconda istruzione', 'Il processore ripete il primo passaggio con il nuovo valore di RIP. I due byte letti sono 04 e 01. Il primo significa «somma ad AL il byte che segue», il secondo è l’immediato 1.',
        { calc: '04 01 → add al, 1', chiedi: { d: 'AL contiene ' + a + ' e dispone di otto bit. Quanto conterrà dopo `add al, 1`?', o: opz, g: opz.indexOf(String(r)), no: cf ? 'Il risultato esatto è 256, che richiede nove bit. In AL restano gli otto bit bassi, tutti a zero.' : 'La somma ' + a + ' + 1 dà ' + r + ', valore contenuto in otto bit.' } });
      s.al = r;
      P({ riga: 1, att: 'al', letti: '04 01', lavoro: a + ' + 1 = ' + vero + (cf ? ' → 1 0000 0000' : ' → ' + X.bin8(r)), forte: !!cf }, 2, 'Esecuzione: la somma', cf ? 'Il circuito di calcolo somma 255 e 1. Il risultato esatto è 256, che in binario è un 1 seguito da otto zeri. In AL sono scritti gli otto bit bassi, e il nono esce dal registro.' : 'Il circuito di calcolo somma ' + a + ' e 1. Il risultato, ' + r + ', è contenuto in otto bit e viene scritto in AL.',
        { calc: a + ' + 1 = ' + vero + (cf ? ' · in AL: 0' : '') });
      s.cf = cf; s.zf = zf;
      P({ riga: 1, att: 'flag', letti: '04 01', lavoro: 'riporto oltre il bit 7: ' + (cf ? 'sì' : 'no') + ' · risultato nullo: ' + (zf ? 'sì' : 'no') }, 2, 'I flag', 'Insieme al risultato, ADD scrive i flag. ' + (cf ? 'Un riporto è uscito oltre il bit 7, e CF vale quindi 1.' : 'Nessun riporto è uscito oltre il bit 7, e CF vale quindi 0.') + (zf ? ' Il byte scritto in AL è zero, e ZF vale quindi 1.' : ' Il byte scritto in AL è diverso da zero, e ZF vale quindi 0.'),
        { calc: 'CF = ' + cf + ' · ZF = ' + zf });
      s.rip = 0x401004;
      P({ riga: 2, att: 'rip' }, 2, 'RIP avanza', 'Anche questa istruzione occupava due byte. RIP avanza di due e indica l’istruzione che segue nel programma.', { calc: '0x401002 + 2 = 0x401004' });
      P({ riga: 2 }, 3, 'Lo stato di arrivo', 'Due istruzioni hanno modificato tre parti dello stato: AL, i flag e RIP. Gli altri registri e la memoria sono rimasti invariati. ' + (cf ? 'AL vale 0, e soltanto CF segnala che la somma ha superato 255.' : 'AL vale ' + r + ', e i flag confermano che la somma è rimasta entro gli otto bit.'),
        { calc: 'AL = ' + r + ' · CF = ' + cf + ' · ZF = ' + zf });
      return { passi, esito: 'AL = ' + r + ', CF = ' + cf + ', ZF = ' + zf };
    }
  },
  bilancio: {
    regola: [
      'Lo stato architetturale è tutto ciò che un programma può leggere o modificare: registri, memoria, RIP e flag. Un’istruzione trasforma lo stato precedente nello stato successivo.',
      'Il processore ripete tre passaggi: legge i byte indicati da RIP, esegue l’istruzione, fa avanzare RIP. ADD scrive anche i flag: CF segnala un riporto oltre la destinazione, ZF un risultato uguale a zero. MOV li lascia invariati.'
    ],
    errori: [
      ['Ritenere che MOV sposti il dato.', 'MOV copia. Dopo l’istruzione il valore si trova nella destinazione, e la sorgente conserva il proprio.'],
      ['Leggere il risultato senza i flag.', 'AL uguale a 0 dopo una somma può derivare da 0 + 0 oppure da 255 + 1. La distinzione è data da CF.'],
      ['Ritenere che ogni istruzione scriva i flag.', 'MOV li lascia invariati. I flag descrivono l’ultima istruzione che li ha scritti, che può precedere di molte righe.']
    ],
    saFare: ['Elencare le parti dello stato architetturale.', 'Descrivere i tre passaggi con cui il processore esegue un’istruzione.', 'Prevedere AL, CF e ZF dopo una somma su otto bit.'],
    esercizi: [
      { d: 'AL contiene 0xF0. Il processore esegue `add al, 0x20`. Quanto vale AL dopo l’istruzione? Si risponda in esadecimale.', segnaposto: 'Due cifre esadecimali', giuste: ['0x10', '10', '10h'],
        ok: 'La somma esatta è 0x110, che richiede nove bit. In AL restano le due cifre basse, 0x10, e CF vale 1.',
        diagnosi: [
          { se: ['0x110', '110', '110h'], msg: 'Tre cifre esadecimali superano gli otto bit di AL. Nel registro restano le due cifre basse, e il riporto è registrato in CF.' },
          { se: ['0xf0', 'f0'], msg: 'Questo è il contenuto di partenza. ADD scrive il risultato nella destinazione.' },
          { se: ['16'], msg: 'Il valore è corretto. È richiesto in esadecimale.' },
          { se: ['272'], msg: 'Questa è la somma esatta in base dieci. In AL sono scritti soltanto gli otto bit bassi.' }
        ],
        altro: 'Il valore è diverso. Si sommino le due quantità in esadecimale e si conservino le due cifre basse.',
        indizi: ['0xF0 + 0x20 fa 0x110.', 'AL dispone di due cifre esadecimali.', 'La cifra eccedente è il riporto, registrato in CF.'],
        svolgimento: ['Valore esatto della somma: 0xF0 + 0x20 = 0x110, cioè 240 + 32 = 272.', 'In otto bit restano le due cifre basse: 0x10.', 'Il riporto è uscito, e quindi CF = 1. Il byte è diverso da zero, e quindi ZF = 0.'] },
      { d: 'Dopo una ADD i flag valgono CF = 1 e ZF = 1. Subito dopo il processore esegue `mov al, 7`. Quanto valgono i flag?', guida: 'Si scelga la risposta.', o: [
        { t: 'CF = 1, ZF = 1', ok: true, fb: 'MOV copia senza calcolare, e i flag restano quindi quelli lasciati dalla somma.' },
        { t: 'CF = 0, ZF = 0', fb: 'Sarebbe così se MOV scrivesse i flag in base al valore copiato. MOV li lascia invariati.' },
        { t: 'CF = 0, ZF = 1', fb: 'MOV lascia invariati entrambi i flag, CF compreso.' }] }
    ],
    sfida: ['cslez2_1_01_random_assembly_01', 'Registri, ALU e unità di controllo']
  }
});
