'use strict';
SL.unita365 = (() => {
  // h: la coppia di istruzioni negli stadi E e D. [in E, in D, carico seguito da uso, ret in D, registro caricato]
  const CASI = {
    load: { e: 'mrmovq → %rax', d: 'addq %rax, %rcx', te: '`mrmovq 0(%rbx), %rax`', td: '`addq %rax, %rcx`', load: 1, ret: 0, reg: '%rax' },
    ret: { e: 'addq', d: 'ret', te: '`addq %rcx, %rdx`', td: '`ret`', load: 0, ret: 1 },
    both: { e: 'mrmovq → %rsp', d: 'ret', te: '`mrmovq 8(%rbx), %rsp`', td: '`ret`', load: 1, ret: 1, reg: '%rsp' },
    op: { e: 'addq', d: 'nop', te: '`addq %rcx, %rdx`', td: '`nop`', load: 0, ret: 0 }
  };
  const segnali = (c) => ({ fs: c.load || c.ret ? 1 : 0, ds: c.load ? 1 : 0, db: !c.load && c.ret ? 1 : 0, eb: c.load ? 1 : 0 });
  const sorteD = (c) => { const s = segnali(c); return s.ds ? 's' : s.db ? 'b' : 'n'; };
  const SORTE = { s: 'resta bloccato', b: 'riceve una bolla', n: 'avanza' };
  return { CASI, segnali, sorteD, SORTE };
})();
SL.registra('3.6.5', {
  titolo: 'Priorità dei conflitti e stato preciso',
  obiettivo: 'Obiettivo: indicare quali registri di pipeline restano bloccati e quali ricevono una bolla quando un carico seguito da un uso e una `ret` si presentano, separatamente o insieme, e spiegare perché un errore in un’istruzione meno recente annulla gli effetti di quelle più recenti.',
  concetti: [['stallo', 'Blocco oppure bolla'], ['conflitto', 'Due richieste sul medesimo registro'], ['scudo', 'L’arresto in uno stato preciso']],
  filigrana: ['stallo', 'scudo', 'conflitto'],
  richiami: {
    carte: [
      { sim: 'stallo', da: 'Dall’unità 3.5.3', t: 'Stallo e bolla', d: 'Lo stallo trattiene un’istruzione nel suo stadio. La bolla è una posizione vuota che avanza senza alcuna scrittura.' },
      { sim: 'mux', da: 'Dall’unità 3.6.2', t: 'La ret e il prelievo', d: 'L’indirizzo di ritorno è disponibile soltanto quando la ret raggiunge lo stadio W.' },
      { sim: 'scudo', da: 'Dall’unità 3.3.4', t: 'I codici di stato', d: 'ADR segnala un indirizzo inesistente. L’istruzione che provoca l’errore deve restare priva di effetti.' }
    ],
    domanda: { d: 'Prima di proseguire: una `mrmovq` è immediatamente seguita da una `addq` che ne impiega il dato. Per quanti cicli la `addq` resta nello stadio D?', o: [
      { t: 'Due: quello normale e uno di attesa', ok: true, fb: 'Dopo un ciclo di attesa il dato esce dalla memoria ed è inoltrato allo stadio D.' },
      { t: 'Uno, come di norma', fb: 'Nel primo ciclo il dato manca ancora: la `mrmovq` è nello stadio E, e la memoria si legge nello stadio M.' },
      { t: 'Tre, fino all’aggiornamento del banco', fb: 'L’inoltro evita l’attesa del banco. È sufficiente un ciclo, dopo il quale il dato è fornito dallo stadio M.' }
    ] }
  },
  idea: {
    titolo: 'L’ordine di precedenza',
    termini: ['segnale di stallo', 'stato preciso'],
    testo: [
      'Il controllo di PIPE dispone di due comandi per ogni registro di pipeline. Il [[segnale di stallo]] lo blocca: al fronte il registro conserva il proprio contenuto, e l’istruzione ripete lo stadio. Il segnale di bolla lo svuota: al fronte il registro riceve una bolla. Con entrambi i segnali a 0 il registro cattura l’ingresso normale.',
      'Un carico seguito da un uso richiede tre comandi. I registri F e D restano bloccati, per trattenere l’istruzione che attende e quella che la segue. Nel registro E entra una bolla, che occupa la posizione rimasta libera.',
      'Una `ret` ne richiede due, per tre cicli, mentre attraversa gli stadi D, E e M. Il registro F resta bloccato. Nel registro D entra una bolla, in luogo dell’istruzione che lo stadio F ha prelevato nel frattempo: è quella che segue la `ret` in memoria, e solo di rado quella corretta.',
      { fig: 'scena', w: 720, h: 176, titolo: 'I segnali richiesti dalle due cause', nota: 'Nell’ultima riga la ret richiederebbe una bolla nel registro D. Lo stallo ha la precedenza.', els: (() => {
        const el = SL.el, els = [], col = ['F_stall', 'D_stall', 'D_bubble', 'E_bubble'], righe = [['carico seguito da un uso', [1, 1, 0, 1]], ['ret', [1, 0, 1, 0]], ['le due cause insieme', [1, 1, 0, 1]]];
        col.forEach((c, k) => els.push(el.nota('gh' + k, 268 + k * 112, 0, c, 'mono minuta')));
        righe.forEach((r, j) => { els.push(el.nota('gn' + j, 10, 34 + j * 44, r[0], 'mono minuta')); r[1].forEach((v, k) => els.push(el.cella('gc' + j + '_' + k, 262 + k * 112, 26 + j * 44, 84, 32, String(v), v ? (j === 2 && k === 1 ? 'err' : 'att') : 'zero', { piccola: true }))); });
        return els; })() },
      'Le due situazioni possono presentarsi insieme. Una `mrmovq` nello stadio E sta caricando un nuovo valore in %rsp, e nello stadio D è presente una `ret`, che legge %rsp per individuare l’indirizzo di ritorno. Al registro D giungono due richieste incompatibili: restare bloccato, per il carico, e ricevere una bolla, per la `ret`. Prevale lo stallo, poiché una bolla eliminerebbe la `ret`, che deve soltanto attendere il nuovo valore di %rsp.',
      'L’ordine è rilevante anche in un secondo caso. Quando un’istruzione provoca un errore, per esempio un indirizzo inesistente nello stadio M, il programma deve arrestarsi in uno [[stato preciso]]: con tutti gli effetti delle istruzioni precedenti, e senza alcun effetto delle successive. Le istruzioni più recenti si trovano già nella pipeline, e il controllo ne annulla gli effetti: impedisce a quella nello stadio E di aggiornare i codici di condizione, con il segnale `set_cc`, e fa entrare una bolla nel registro M.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento colloca negli stadi E e D quattro coppie di istruzioni: un carico seguito da un uso, una ret, le due cause insieme, e una coppia priva di conflitti. Il controllo determina il comportamento di ogni registro al fronte.',
      'I controlli fissano anche l’esito dell’istruzione meno recente, nello stadio M: regolare, oppure con un errore di indirizzo. Dopo il caso proposto, è istruttivo esaminare la ret da sola, poi la coppia priva di conflitti con l’errore nello stadio M.'
    ],
    vedrai: [
      ['pipeline', 'Gli stadi', 'In alto: le istruzioni presenti, dalla più recente in F alla meno recente in W.'],
      ['stallo', 'I comandi ai registri', 'Al centro: i due segnali di stallo e i due segnali di bolla.'],
      ['scudo', 'Lo stato', 'In basso: l’esito dello stadio M e l’abilitazione all’aggiornamento dei codici di condizione.']
    ]
  },
  lab: {
    titolo: 'Blocco, bolla, ingresso normale',
    scena: { w: 860, h: 262 },
    atti: ['La situazione', 'Le cause', 'I comandi', 'Lo stato preciso'],
    controlli: [
      { id: 'h', tipo: 'scelta', eti: 'Negli stadi E e D', opzioni: [['both', 'mrmovq verso %rsp, poi ret'], ['load', 'mrmovq verso %rax, poi addq che impiega %rax'], ['ret', 'addq, poi ret'], ['op', 'addq, poi nop']], valore: 'both' },
      { id: 'stat', tipo: 'scelta', eti: 'Istruzione nello stadio M', opzioni: [['ok', 'regolare (AOK)'], ['adr', 'errore di indirizzo (ADR)']], valore: 'ok' }
    ],
    nota: 'I passi sono sempre sette. L’istruzione nello stadio M è meno recente di quelle negli stadi E e D.',
    previsione: {
      domanda: (p) => { const c = SL.unita365.CASI[p.h]; return 'Nello stadio E è presente ' + c.te + ', e nello stadio D è presente ' + c.td + '. Al prossimo fronte, come si comporta il registro D?'; },
      opzioni: () => [['s', 'Resta bloccato'], ['b', 'Riceve una bolla'], ['n', 'Cattura l’ingresso normale']]
    },
    confronto: (pred, esito, p) => { const U = SL.unita365, N = { s: 'che resti bloccato', b: 'che riceva una bolla', n: 'che catturi l’ingresso normale' }; return 'La previsione indicava ' + N[pred] + '. Il registro D ' + (esito === 'n' ? 'cattura l’ingresso normale' : U.SORTE[esito]) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.h === 'both' ? 'Con le due cause insieme prevale lo stallo: una bolla eliminerebbe la `ret`.' : p.h === 'load' ? 'L’istruzione che attende il dato va trattenuta nello stadio D.' : p.h === 'ret' ? 'L’istruzione prelevata dopo la `ret` va scartata, e nel registro D entra una bolla.' : 'Nessuna causa di attesa è presente.'); },
    costruisci(p) {
      const el = SL.el, U = SL.unita365, passi = [], c = U.CASI[p.h], s = U.segnali(c), guasto = p.stat === 'adr', opE = !c.load, cc = opE && !guasto ? 1 : 0, sorte = U.sorteD(c);
      const quadro = (f) => {
        const els = [el.nota('t0', 20, 0, 'DURANTE IL CICLO', 'mono')];
        SL.pipe.stadi('a', ['I5', c.d, c.e, 'I2 · ' + (guasto ? 'ADR' : 'AOK'), 'I1'], { x: 20, y: 22, h: 62, st: ['on', (f === 1 && c.load) || (f === 2 && c.ret) || f === 4 ? 'att' : 'on', f === 1 && c.load ? 'att' : f >= 5 && guasto && opE ? 'err' : 'on', f >= 5 ? (guasto ? 'err' : 'att') : 'on', 'on'] }).forEach((e) => els.push(e));
        const S = (id, k, eti, nome, v, forte) => el.box(id, 20 + k * 208, 104, 196, 62, eti, f >= 3 ? nome + ' = ' + v : nome + ' = ·', f < 3 ? '' : f === 3 || (f === 4 && forte) ? (v ? 'att' : 'zero') : v ? 'on' : 'off', { cls: 'stretta' });
        els.push(S('s1', 0, 'registro F bloccato', 'F_stall', s.fs), S('s2', 1, 'registro D bloccato', 'D_stall', s.ds, true), S('s3', 2, 'bolla nel registro D', 'D_bubble', s.db, true), S('s4', 3, 'bolla nel registro E', 'E_bubble', s.eb));
        els.push(el.box('r1', 20, 186, 196, 62, 'registro D al fronte', f >= 4 ? U.SORTE[sorte] : '·', f === 4 ? 'att' : f > 4 ? 'on' : '', { cls: 'stretta' }),
          el.box('r2', 228, 186, 196, 62, 'esito dello stadio M', f >= 5 ? 'm_stat = ' + (guasto ? 'ADR' : 'AOK') : 'm_stat = ·', f >= 5 ? (guasto ? 'err' : 'on') : '', { cls: 'stretta' }),
          el.box('r3', 436, 186, 196, 62, 'bolla nel registro M', f >= 5 ? 'M_bubble = ' + (guasto ? 1 : 0) : 'M_bubble = ·', f >= 5 ? (guasto ? 'att' : 'off') : '', { cls: 'stretta' }),
          el.box('r4', 644, 186, 196, 62, 'codici di condizione', f >= 5 ? 'set_cc = ' + cc : 'set_cc = ·', f >= 5 ? (cc ? 'att' : guasto && opE ? 'err' : 'off') : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (f) => [['Registro D al fronte', f >= 4 ? U.SORTE[sorte] : '·', 'a'], ['Bolla nel registro E', f >= 3 ? (s.eb ? 'sì' : 'no') : '·'], ['set_cc', f >= 5 ? String(cc) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La situazione', 'Nello stadio E è presente ' + c.te + ', e nello stadio D è presente ' + c.td + '. Più avanti, nello stadio M, l’istruzione I2 sta accedendo alla memoria dei dati. Il controllo osserva tutti gli stadi contemporaneamente e determina il comportamento di ogni registro al prossimo fronte.',
        { chiedi: { d: 'Come si comporta al fronte un registro di pipeline bloccato da un segnale di stallo?', o: ['Conserva il proprio contenuto', 'Riceve una bolla', 'Cattura l’ingresso normale'], g: 0, no: 'Lo stallo trattiene l’istruzione nel suo stadio: il registro ignora l’ingresso e conserva il contenuto.' } });
      P(1, 1, 'Prima causa: un carico seguito da un uso', c.load ? 'La `mrmovq` nello stadio E sta per caricare un valore in ' + c.reg + '. ' + (c.ret ? 'La `ret` nello stadio D legge %rsp, per individuare sulla pila l’indirizzo di ritorno.' : 'La `addq` nello stadio D legge %rax.') + ' Il dato uscirà dalla memoria soltanto nel prossimo ciclo, e l’istruzione nello stadio D deve attendere.' : 'L’istruzione nello stadio E è una `addq`, che opera soltanto sui registri. Nessun dato è atteso dalla memoria, e questa causa di attesa è assente.', { calc: 'carico seguito da un uso: ' + (c.load ? 'sì' : 'no') });
      P(2, 1, 'Seconda causa: una ret', c.ret ? 'Nello stadio D è presente una `ret`. L’indirizzo del prossimo prelievo resta ignoto finché la `ret` non avrà letto la pila, tre stadi più avanti. L’istruzione che lo stadio F sta prelevando è quella che segue la `ret` in memoria, e va scartata.' : 'Nello stadio D è presente ' + c.td + ', e nessuna `ret` è presente. Questa causa è assente.', { calc: 'ret nello stadio D: ' + (c.ret ? 'sì' : 'no') });
      P(3, 2, 'I comandi ai registri', p.h === 'load' ? 'Per il carico seguito da un uso il controllo blocca i registri F e D, con `F_stall` e `D_stall`, e fa entrare una bolla nel registro E con `E_bubble`. La `addq` e l’istruzione che la segue restano nei rispettivi stadi, mentre la `mrmovq` avanza da sola.' : p.h === 'ret' ? 'Per la `ret` il controllo blocca il registro F con `F_stall`, e il PC previsto resta invariato. Con `D_bubble` fa entrare una bolla nel registro D, in luogo dell’istruzione prelevata per errore. La `ret` avanza nello stadio E.' : p.h === 'both' ? 'Le due cause rivolgono al registro D richieste diverse. Il carico seguito da un uso richiede di bloccarlo, per trattenere la `ret`. La `ret` richiede di farvi entrare una bolla. Il controllo seleziona lo stallo: `D_stall` vale 1 e `D_bubble` resta a 0.' : 'Nessuna causa è presente, e i quattro segnali restano a 0. Al fronte ogni registro cattura il proprio ingresso normale.', { calc: 'F_stall ' + s.fs + ' · D_stall ' + s.ds + ' · D_bubble ' + s.db + ' · E_bubble ' + s.eb });
      P(4, 2, 'Il registro D', p.h === 'load' ? 'Il registro D resta bloccato. La `addq` ripeterà lo stadio D nel prossimo ciclo, e disporrà allora del valore di %rax, inoltrato dallo stadio M.' : p.h === 'ret' ? 'Il registro D riceve una bolla, e l’istruzione prelevata dopo la `ret` è eliminata. Lo stesso accadrà nei due cicli seguenti, mentre la `ret` attraversa gli stadi E e M: complessivamente tre bolle.' : p.h === 'both' ? 'Il registro D resta bloccato. Una bolla avrebbe eliminato la `ret`. Trattenuta, la `ret` ripeterà lo stadio D nel prossimo ciclo con il valore corretto di %rsp, e da quell’istante richiederà le proprie bolle.' : 'Il registro D cattura l’ingresso normale, cioè l’istruzione I5 che ora è nello stadio F.', { calc: 'registro D: ' + U.SORTE[sorte], esito: ['registro D: ' + U.SORTE[sorte], sorte === 'n' ? 'si' : ''],
        chiedi: { d: 'L’istruzione I2 nello stadio M è meno recente di quella nello stadio E. Se I2 provocasse un errore, quella nello stadio E dovrebbe produrre effetti?', o: ['Sì, poiché è già nella pipeline', 'No, poiché nel programma segue l’errore'], g: 1, no: 'Il programma si arresta all’istruzione che provoca l’errore. Quelle che la seguono devono restare prive di effetti.' } });
      P(5, 3, 'L’esito dello stadio M', guasto ? 'L’istruzione I2 ha richiesto alla memoria un indirizzo inesistente, e m_stat vale ADR. Nel programma I2 precede tutte le istruzioni che la seguono nella pipeline. ' + (opE ? 'La `addq` nello stadio E sta per aggiornare i codici di condizione, e il controllo lo impedisce portando set_cc a 0.' : 'Nello stadio E è presente una `mrmovq`, che lascia comunque invariati i codici di condizione.') + ' Al fronte nel registro M entra una bolla, e nessuna istruzione più recente potrà scrivere in memoria.' : 'L’istruzione I2 ha completato l’accesso alla memoria senza errori, e m_stat vale AOK. ' + (opE ? 'La `addq` nello stadio E può aggiornare i codici di condizione, e set_cc vale 1.' : 'Nello stadio E è presente una `mrmovq`, che lascia invariati i codici di condizione: set_cc vale 0.'), { calc: 'm_stat = ' + (guasto ? 'ADR' : 'AOK') + ' · M_bubble = ' + (guasto ? 1 : 0) + ' · set_cc = ' + cc });
      P(6, 3, guasto ? 'Lo stato preciso' : 'Nessun errore', guasto ? 'Quando I2 raggiungerà lo stadio W, il processore si arresterà con lo stato ADR. Lo stato del programma conterrà gli effetti di I1 e delle istruzioni precedenti, e nessun effetto delle successive. I segnali di stallo e di bolla per i registri F, D ed E restano quelli già determinati: le due questioni si risolvono in modo indipendente.' : 'Senza errori lo stato resta AOK e la pipeline prosegue. Al fronte il registro D ' + (sorte === 'n' ? 'cattura l’ingresso normale' : U.SORTE[sorte]) + ', come determinato dalle due cause esaminate.', { calc: 'registro D: ' + U.SORTE[sorte] + ' · set_cc = ' + cc, esito: ['registro D: ' + U.SORTE[sorte], sorte === 'n' ? 'si' : ''] });
      return { passi, esito: sorte };
    }
  },
  bilancio: {
    regola: [
      'Un carico seguito da un uso blocca i registri F e D e fa entrare una bolla nel registro E. Una ret blocca il registro F e fa entrare una bolla nel registro D. Quando le due cause coincidono, sul registro D prevale lo stallo.',
      'Un errore in un’istruzione meno recente annulla gli effetti delle più recenti: set_cc va a 0 e nel registro M entra una bolla. Il programma si arresta in uno stato preciso.'
    ],
    errori: [
      ['Assegnare alla bolla la precedenza sullo stallo.', 'Una bolla nel registro D eliminerebbe la ret, che deve soltanto attendere il nuovo valore di %rsp.'],
      ['Bloccare soltanto il registro D.', 'Se il registro F proseguisse, l’istruzione nello stadio F andrebbe perduta. I due registri restano bloccati insieme.'],
      ['Consentire a un’istruzione più recente di aggiornare i codici di condizione dopo un errore.', 'Nel programma tale istruzione segue l’errore, e deve restare priva di effetti.']
    ],
    saFare: ['Ricavare i quattro segnali per un carico seguito da un uso.', 'Ricavare i segnali per una ret.', 'Indicare quale richiesta prevale quando le due cause coincidono.'],
    esercizi: [
      { d: 'Nello stadio E è presente `mrmovq 0(%rdi), %rdx`, e nello stadio D `addq %rdx, %rax`. Quali segnali valgono 1?', guida: 'Si scelga la risposta.', o: [
        { t: 'F_stall, D_stall ed E_bubble', ok: true, fb: 'I registri F e D restano bloccati, e nel registro E entra una bolla.' },
        { t: 'F_stall e D_bubble', fb: 'Questi sono i segnali di una ret. In questo caso l’istruzione nello stadio D va trattenuta.' },
        { t: 'D_bubble ed E_bubble', fb: 'Questi sono i segnali di una previsione errata, che scarta due istruzioni.' }] },
      { d: 'Nello stadio E è presente `mrmovq 8(%rbx), %rsp`, e nello stadio D `ret`. Che cosa accade al registro D al fronte?', guida: 'Si scelga la risposta.', o: [
        { t: 'Resta bloccato, e la ret ripete lo stadio D', ok: true, fb: 'La ret legge %rsp, il cui valore è atteso dalla memoria. Lo stallo ha la precedenza sulla bolla.' },
        { t: 'Riceve una bolla, come sempre con una ret', fb: 'La bolla eliminerebbe la ret. Con un carico in corso su %rsp prevale lo stallo.' },
        { t: 'Cattura l’istruzione che segue la ret', fb: 'L’istruzione che segue la ret in memoria è solo di rado quella corretta, e in ogni caso la ret deve attendere %rsp.' }] },
      { d: 'Una `ret` entra nello stadio D senza altre cause di attesa. Quante bolle entrano complessivamente nel registro D prima che il prelievo riparta dall’indirizzo di ritorno?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Una bolla per ciascun ciclo in cui la ret occupa gli stadi D, E e M.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Due è il costo di un salto con previsione errata. La ret richiede una bolla in ciascuno dei tre stadi D, E e M.' },
          { se: ['1', 'uno', 'una'], msg: 'La richiesta si ripete finché la ret raggiunge lo stadio W: tre cicli.' },
          { se: ['4', 'quattro'], msg: 'Quando la ret è nello stadio W l’indirizzo è disponibile, e il prelievo riparte.' }
        ],
        altro: 'Il numero è diverso. Si contino gli stadi che la ret attraversa prima di presentare l’indirizzo dal registro W.',
        indizi: ['La ret presenta l’indirizzo quando raggiunge lo stadio W.', 'Prima attraversa D, E e M.', 'Una bolla per ciascuno dei tre cicli.'],
        svolgimento: ['ret nello stadio D: una bolla.', 'ret nello stadio E: una bolla.', 'ret nello stadio M: una bolla.', 'Complessivamente 3 bolle.'] }
    ],
    sfida: ['cslez3_6_02_random_assembly', 'Abilitazione e controllo dei registri di pipeline']
  }
});
