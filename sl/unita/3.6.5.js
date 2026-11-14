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
  const SORTE = { s: 'resta fermo', b: 'riceve una bolla', n: 'avanza' };
  return { CASI, segnali, sorteD, SORTE };
})();
SL.registra('3.6.5', {
  titolo: 'Priorità dei conflitti e stato preciso',
  obiettivo: 'Obiettivo: dire quali registri di pipeline restano fermi e quali ricevono una bolla quando un carico seguito da un uso e una `ret` si presentano, da soli o insieme, e perché un errore in una istruzione più vecchia toglie gli effetti a quelle più giovani.',
  concetti: [['stallo', 'Fermare oppure svuotare'], ['conflitto', 'Due richieste sullo stesso registro'], ['scudo', 'Fermarsi in uno stato preciso']],
  filigrana: ['stallo', 'scudo', 'conflitto'],
  richiami: {
    carte: [
      { sim: 'stallo', da: 'Dall’unità 3.5.3', t: 'Stallo e bolla', d: 'Lo stallo trattiene una istruzione nel suo stadio. La bolla è un posto vuoto che avanza senza scrivere nulla.' },
      { sim: 'mux', da: 'Dall’unità 3.6.2', t: 'La ret e il prelievo', d: 'L’indirizzo di ritorno arriva soltanto quando la ret raggiunge lo stadio W.' },
      { sim: 'scudo', da: 'Dall’unità 3.3.4', t: 'I codici di stato', d: 'ADR segnala un indirizzo inesistente. L’istruzione che sbaglia deve restare senza effetti.' }
    ],
    domanda: { d: 'Prima di proseguire: una `mrmovq` è seguita subito da una `addq` che ne usa il dato. Per quanti cicli la `addq` resta nello stadio D?', o: [
      { t: 'Due: quello normale e uno di attesa', ok: true, fb: 'Dopo un ciclo di attesa il dato esce dalla memoria e viene inoltrato allo stadio D.' },
      { t: 'Uno, come sempre', fb: 'Nel primo ciclo il dato manca ancora: la `mrmovq` è nello stadio E, e la memoria si legge nello stadio M.' },
      { t: 'Tre, finché il banco è aggiornato', fb: 'L’inoltro evita di attendere il banco. Basta un ciclo, poi il dato arriva dallo stadio M.' }
    ] }
  },
  idea: {
    titolo: 'Chi ha la precedenza',
    termini: ['segnale di stallo', 'stato preciso'],
    testo: [
      'Il controllo di PIPE dispone di due comandi per ogni registro di pipeline. Il [[segnale di stallo]] lo tiene fermo: al fronte il registro conserva il proprio contenuto, e l’istruzione ripete lo stadio. Il segnale di bolla lo svuota: al fronte il registro riceve una bolla. Con entrambi i segnali a 0 il registro cattura l’ingresso normale.',
      'Un carico seguito da un uso richiede tre comandi. I registri F e D restano fermi, per trattenere l’istruzione che attende e quella dietro di lei. Nel registro E entra una bolla, che occupa il posto lasciato scoperto.',
      'Una `ret` ne richiede due, e li richiede per tre cicli, mentre attraversa gli stadi D, E e M. Il registro F resta fermo. Nel registro D entra una bolla, al posto dell’istruzione che lo stadio F ha prelevato nel frattempo: è quella che segue la `ret` in memoria, e quasi mai quella giusta.',
      { fig: 'scena', w: 720, h: 176, titolo: 'I segnali richiesti dalle due cause', nota: 'Nell’ultima riga la ret chiederebbe una bolla nel registro D. Lo stallo ha la precedenza.', els: (() => {
        const el = SL.el, els = [], col = ['F_stall', 'D_stall', 'D_bubble', 'E_bubble'], righe = [['carico seguito da un uso', [1, 1, 0, 1]], ['ret', [1, 0, 1, 0]], ['le due cause insieme', [1, 1, 0, 1]]];
        col.forEach((c, k) => els.push(el.nota('gh' + k, 268 + k * 112, 0, c, 'mono minuta')));
        righe.forEach((r, j) => { els.push(el.nota('gn' + j, 10, 34 + j * 44, r[0], 'mono minuta')); r[1].forEach((v, k) => els.push(el.cella('gc' + j + '_' + k, 262 + k * 112, 26 + j * 44, 84, 32, String(v), v ? (j === 2 && k === 1 ? 'err' : 'att') : 'zero', { piccola: true }))); });
        return els; })() },
      'Le due situazioni possono presentarsi insieme. Una `mrmovq` nello stadio E sta caricando un nuovo valore in %rsp, e nello stadio D c’è una `ret`, che legge proprio %rsp per trovare l’indirizzo di ritorno. Al registro D arrivano due richieste incompatibili: restare fermo, per il carico, e ricevere una bolla, per la `ret`. Vince lo stallo, perché una bolla cancellerebbe la `ret`, che deve soltanto attendere il nuovo valore di %rsp.',
      'L’ordine conta anche in un secondo caso. Quando una istruzione provoca un errore, per esempio un indirizzo inesistente nello stadio M, il programma deve fermarsi in uno [[stato preciso]]: con tutti gli effetti delle istruzioni precedenti, e senza alcun effetto delle successive. Le istruzioni più giovani si trovano già nella pipeline, e il controllo le rende innocue. Impedisce a quella nello stadio E di aggiornare i codici di condizione, con il segnale `set_cc`, e fa entrare una bolla nel registro M.'
    ]
  },
  esperimento: {
    faremo: [
      'Metteremo negli stadi E e D quattro coppie di istruzioni: un carico seguito da un uso, una ret, le due cause insieme, e una coppia senza problemi. Il controllo deciderà che cosa fa ogni registro al fronte.',
      'Sceglierai anche l’esito dell’istruzione più vecchia, nello stadio M: regolare, oppure con un errore di indirizzo. Dopo il caso proposto, prova la ret da sola, poi la coppia senza problemi con l’errore nello stadio M.'
    ],
    vedrai: [
      ['pipeline', 'Gli stadi', 'In alto: le istruzioni presenti, dalla più giovane in F alla più vecchia in W.'],
      ['stallo', 'I comandi ai registri', 'Al centro: i due segnali di stallo e i due segnali di bolla.'],
      ['scudo', 'Lo stato', 'In basso: l’esito dello stadio M e il permesso di aggiornare i codici di condizione.']
    ]
  },
  lab: {
    titolo: 'Fermare, svuotare, lasciar passare',
    scena: { w: 860, h: 262 },
    atti: ['La situazione', 'Le cause', 'I comandi', 'Lo stato preciso'],
    controlli: [
      { id: 'h', tipo: 'scelta', eti: 'Negli stadi E e D', opzioni: [['both', 'mrmovq verso %rsp, poi ret'], ['load', 'mrmovq verso %rax, poi addq che usa %rax'], ['ret', 'addq, poi ret'], ['op', 'addq, poi nop']], valore: 'both' },
      { id: 'stat', tipo: 'scelta', eti: 'Istruzione nello stadio M', opzioni: [['ok', 'regolare (AOK)'], ['adr', 'errore di indirizzo (ADR)']], valore: 'ok' }
    ],
    nota: 'I passi sono sempre sette. L’istruzione nello stadio M è più vecchia di quelle negli stadi E e D.',
    previsione: {
      domanda: (p) => { const c = SL.unita365.CASI[p.h]; return 'Nello stadio E c’è ' + c.te + ', e nello stadio D c’è ' + c.td + '. Al prossimo fronte, che cosa fa il registro D?'; },
      opzioni: () => [['s', 'Resta fermo'], ['b', 'Riceve una bolla'], ['n', 'Cattura l’ingresso normale']]
    },
    confronto: (pred, esito, p) => { const U = SL.unita365, N = { s: 'che resti fermo', b: 'che riceva una bolla', n: 'che catturi l’ingresso normale' }; return 'La previsione indicava ' + N[pred] + '. Il registro D ' + (esito === 'n' ? 'cattura l’ingresso normale' : U.SORTE[esito]) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.h === 'both' ? 'Con le due cause insieme vince lo stallo: una bolla cancellerebbe la `ret`.' : p.h === 'load' ? 'L’istruzione che attende il dato va trattenuta nello stadio D.' : p.h === 'ret' ? 'L’istruzione prelevata dopo la `ret` va scartata, e nel registro D entra una bolla.' : 'Nessuna causa di attesa è presente.'); },
    costruisci(p) {
      const el = SL.el, U = SL.unita365, passi = [], c = U.CASI[p.h], s = U.segnali(c), guasto = p.stat === 'adr', opE = !c.load, cc = opE && !guasto ? 1 : 0, sorte = U.sorteD(c);
      const quadro = (f) => {
        const els = [el.nota('t0', 20, 0, 'DURANTE IL CICLO', 'mono')];
        SL.pipe.stadi('a', ['I5', c.d, c.e, 'I2 · ' + (guasto ? 'ADR' : 'AOK'), 'I1'], { x: 20, y: 22, h: 62, st: ['on', (f === 1 && c.load) || (f === 2 && c.ret) || f === 4 ? 'att' : 'on', f === 1 && c.load ? 'att' : f >= 5 && guasto && opE ? 'err' : 'on', f >= 5 ? (guasto ? 'err' : 'att') : 'on', 'on'] }).forEach((e) => els.push(e));
        const S = (id, k, eti, nome, v, forte) => el.box(id, 20 + k * 208, 104, 196, 62, eti, f >= 3 ? nome + ' = ' + v : nome + ' = ·', f < 3 ? '' : f === 3 || (f === 4 && forte) ? (v ? 'att' : 'zero') : v ? 'on' : 'off', { cls: 'stretta' });
        els.push(S('s1', 0, 'fermo il registro F', 'F_stall', s.fs), S('s2', 1, 'fermo il registro D', 'D_stall', s.ds, true), S('s3', 2, 'bolla nel registro D', 'D_bubble', s.db, true), S('s4', 3, 'bolla nel registro E', 'E_bubble', s.eb));
        els.push(el.box('r1', 20, 186, 196, 62, 'registro D al fronte', f >= 4 ? U.SORTE[sorte] : '·', f === 4 ? 'att' : f > 4 ? 'on' : '', { cls: 'stretta' }),
          el.box('r2', 228, 186, 196, 62, 'esito dello stadio M', f >= 5 ? 'm_stat = ' + (guasto ? 'ADR' : 'AOK') : 'm_stat = ·', f >= 5 ? (guasto ? 'err' : 'on') : '', { cls: 'stretta' }),
          el.box('r3', 436, 186, 196, 62, 'bolla nel registro M', f >= 5 ? 'M_bubble = ' + (guasto ? 1 : 0) : 'M_bubble = ·', f >= 5 ? (guasto ? 'att' : 'off') : '', { cls: 'stretta' }),
          el.box('r4', 644, 186, 196, 62, 'codici di condizione', f >= 5 ? 'set_cc = ' + cc : 'set_cc = ·', f >= 5 ? (cc ? 'att' : guasto && opE ? 'err' : 'off') : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (f) => [['Registro D al fronte', f >= 4 ? U.SORTE[sorte] : '·', 'a'], ['Bolla nel registro E', f >= 3 ? (s.eb ? 'sì' : 'no') : '·'], ['set_cc', f >= 5 ? String(cc) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La situazione', 'Nello stadio E c’è ' + c.te + ', e nello stadio D c’è ' + c.td + '. Più avanti, nello stadio M, l’istruzione I2 sta accedendo alla memoria dei dati. Il controllo osserva tutti gli stadi insieme e decide che cosa farà ogni registro al prossimo fronte.',
        { chiedi: { d: 'Che cosa fa al fronte un registro di pipeline tenuto fermo da un segnale di stallo?', o: ['Conserva il contenuto che ha', 'Riceve una bolla', 'Cattura l’ingresso normale'], g: 0, no: 'Lo stallo trattiene l’istruzione dove si trova: il registro ignora l’ingresso e conserva il contenuto.' } });
      P(1, 1, 'Prima causa: un carico seguito da un uso', c.load ? 'La `mrmovq` nello stadio E sta per caricare un valore in ' + c.reg + '. ' + (c.ret ? 'La `ret` nello stadio D legge proprio %rsp, per trovare sulla pila l’indirizzo di ritorno.' : 'La `addq` nello stadio D legge proprio %rax.') + ' Il dato uscirà dalla memoria soltanto nel prossimo ciclo, e l’istruzione nello stadio D deve attendere.' : 'L’istruzione nello stadio E è una `addq`, che lavora soltanto sui registri. Nessun dato è in arrivo dalla memoria, e questa causa di attesa è assente.', { calc: 'carico seguito da un uso: ' + (c.load ? 'sì' : 'no') });
      P(2, 1, 'Seconda causa: una ret', c.ret ? 'Nello stadio D c’è una `ret`. L’indirizzo del prossimo prelievo resta ignoto fino a quando la `ret` avrà letto la pila, tre stadi più avanti. L’istruzione che lo stadio F sta prelevando è quella che segue la `ret` in memoria, e va scartata.' : 'Nello stadio D c’è ' + c.td + ', e nessuna `ret` è in arrivo. Questa causa è assente.', { calc: 'ret nello stadio D: ' + (c.ret ? 'sì' : 'no') });
      P(3, 2, 'I comandi ai registri', p.h === 'load' ? 'Per il carico seguito da un uso il controllo ferma i registri F e D, con `F_stall` e `D_stall`, e fa entrare una bolla nel registro E con `E_bubble`. La `addq` e l’istruzione dietro di lei restano dove sono, mentre la `mrmovq` avanza da sola.' : p.h === 'ret' ? 'Per la `ret` il controllo ferma il registro F con `F_stall`, e il PC previsto resta quello che è. Con `D_bubble` fa entrare una bolla nel registro D, al posto dell’istruzione prelevata per errore. La `ret` avanza nello stadio E.' : p.h === 'both' ? 'Le due cause chiedono al registro D due cose diverse. Il carico seguito da un uso chiede di tenerlo fermo, per trattenere la `ret`. La `ret` chiede di farvi entrare una bolla. Il controllo sceglie lo stallo: `D_stall` vale 1 e `D_bubble` resta a 0.' : 'Nessuna causa è presente, e i quattro segnali restano a 0. Al fronte ogni registro cattura il proprio ingresso normale.', { calc: 'F_stall ' + s.fs + ' · D_stall ' + s.ds + ' · D_bubble ' + s.db + ' · E_bubble ' + s.eb });
      P(4, 2, 'Il registro D', p.h === 'load' ? 'Il registro D resta fermo. La `addq` ripeterà lo stadio D nel prossimo ciclo, e questa volta troverà il valore di %rax, inoltrato dallo stadio M.' : p.h === 'ret' ? 'Il registro D riceve una bolla, e l’istruzione prelevata dopo la `ret` scompare. Lo stesso accadrà nei due cicli seguenti, mentre la `ret` attraversa gli stadi E e M: in tutto tre bolle.' : p.h === 'both' ? 'Il registro D resta fermo. Una bolla avrebbe cancellato la `ret`. Trattenuta, la `ret` ripeterà lo stadio D nel prossimo ciclo con il valore giusto di %rsp, e da quel momento chiederà le proprie bolle.' : 'Il registro D cattura l’ingresso normale, cioè l’istruzione I5 che ora è nello stadio F.', { calc: 'registro D: ' + U.SORTE[sorte], esito: ['registro D: ' + U.SORTE[sorte], sorte === 'n' ? 'si' : ''],
        chiedi: { d: 'L’istruzione I2 nello stadio M è più vecchia di quella nello stadio E. Se I2 provocasse un errore, quella nello stadio E dovrebbe lasciare effetti?', o: ['Sì, perché è già nella pipeline', 'No, perché nel programma viene dopo l’errore'], g: 1, no: 'Il programma si ferma all’istruzione che sbaglia. Quelle che la seguono devono restare senza effetti.' } });
      P(5, 3, 'L’esito dello stadio M', guasto ? 'L’istruzione I2 ha chiesto alla memoria un indirizzo inesistente, e m_stat vale ADR. Nel programma I2 precede tutte le istruzioni che la seguono nella pipeline. ' + (opE ? 'La `addq` nello stadio E sta per aggiornare i codici di condizione, e il controllo glielo impedisce portando set_cc a 0.' : 'Nello stadio E c’è una `mrmovq`, che lascia comunque invariati i codici di condizione.') + ' Al fronte nel registro M entra una bolla, e nessuna istruzione più giovane potrà scrivere in memoria.' : 'L’istruzione I2 ha completato l’accesso alla memoria senza errori, e m_stat vale AOK. ' + (opE ? 'La `addq` nello stadio E può aggiornare i codici di condizione, e set_cc vale 1.' : 'Nello stadio E c’è una `mrmovq`, che lascia invariati i codici di condizione: set_cc vale 0.'), { calc: 'm_stat = ' + (guasto ? 'ADR' : 'AOK') + ' · M_bubble = ' + (guasto ? 1 : 0) + ' · set_cc = ' + cc });
      P(6, 3, guasto ? 'Lo stato preciso' : 'Nessun errore', guasto ? 'Quando I2 raggiungerà lo stadio W, il processore si fermerà con lo stato ADR. Lo stato del programma conterrà gli effetti di I1 e delle istruzioni precedenti, e nessun effetto delle successive. I segnali di stallo e di bolla per i registri F, D ed E sono rimasti quelli decisi prima: le due questioni si risolvono in modo indipendente.' : 'Senza errori lo stato resta AOK e la pipeline prosegue. Al fronte il registro D ' + (sorte === 'n' ? 'cattura l’ingresso normale' : U.SORTE[sorte]) + ', come deciso dalle due cause esaminate.', { calc: 'registro D: ' + U.SORTE[sorte] + ' · set_cc = ' + cc, esito: ['registro D: ' + U.SORTE[sorte], sorte === 'n' ? 'si' : ''] });
      return { passi, esito: sorte };
    }
  },
  bilancio: {
    regola: [
      'Un carico seguito da un uso ferma i registri F e D e fa entrare una bolla nel registro E. Una ret ferma il registro F e fa entrare una bolla nel registro D. Quando le due cause coincidono, sul registro D vince lo stallo.',
      'Un errore in una istruzione più vecchia toglie gli effetti alle più giovani: set_cc va a 0 e nel registro M entra una bolla. Il programma si ferma in uno stato preciso.'
    ],
    errori: [
      ['Dare alla bolla la precedenza sullo stallo.', 'Una bolla nel registro D cancellerebbe la ret, che deve soltanto attendere il nuovo valore di %rsp.'],
      ['Fermare soltanto il registro D.', 'Se il registro F proseguisse, l’istruzione nello stadio F andrebbe perduta. I due registri restano fermi insieme.'],
      ['Lasciare che una istruzione più giovane aggiorni i codici di condizione dopo un errore.', 'Nel programma quella istruzione viene dopo l’errore, e deve restare senza effetti.']
    ],
    saFare: ['Ricavare i quattro segnali per un carico seguito da un uso.', 'Ricavare i segnali per una ret.', 'Indicare chi vince quando le due cause coincidono.'],
    esercizi: [
      { d: 'Nello stadio E c’è `mrmovq 0(%rdi), %rdx`, e nello stadio D c’è `addq %rdx, %rax`. Quali segnali valgono 1?', guida: 'Si scelga la risposta.', o: [
        { t: 'F_stall, D_stall ed E_bubble', ok: true, fb: 'I registri F e D restano fermi, e nel registro E entra una bolla.' },
        { t: 'F_stall e D_bubble', fb: 'Questi sono i segnali di una ret. Qui l’istruzione nello stadio D va trattenuta.' },
        { t: 'D_bubble ed E_bubble', fb: 'Questi sono i segnali di una previsione sbagliata, che scarta due istruzioni.' }] },
      { d: 'Nello stadio E c’è `mrmovq 8(%rbx), %rsp`, e nello stadio D c’è `ret`. Che cosa accade al registro D al fronte?', guida: 'Si scelga la risposta.', o: [
        { t: 'Resta fermo, e la ret ripete lo stadio D', ok: true, fb: 'La ret legge %rsp, che sta arrivando dalla memoria. Lo stallo ha la precedenza sulla bolla.' },
        { t: 'Riceve una bolla, come sempre con una ret', fb: 'La bolla cancellerebbe la ret. Con un carico in corso su %rsp vince lo stallo.' },
        { t: 'Cattura l’istruzione che segue la ret', fb: 'L’istruzione che segue la ret in memoria è quasi mai quella giusta, e in ogni caso la ret deve attendere %rsp.' }] },
      { d: 'Una `ret` entra nello stadio D senza altre cause di attesa. Quante bolle entrano in tutto nel registro D prima che il prelievo riparta dall’indirizzo di ritorno?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Una bolla per ciascun ciclo in cui la ret occupa gli stadi D, E e M.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Due è il costo di un salto previsto male. La ret chiede una bolla in ciascuno dei tre stadi D, E e M.' },
          { se: ['1', 'uno', 'una'], msg: 'La richiesta si ripete finché la ret raggiunge lo stadio W: tre cicli.' },
          { se: ['4', 'quattro'], msg: 'Quando la ret è nello stadio W l’indirizzo è disponibile, e il prelievo riparte.' }
        ],
        altro: 'Il numero è diverso. Conta gli stadi che la ret attraversa prima di offrire l’indirizzo dal registro W.',
        indizi: ['La ret offre l’indirizzo quando arriva nello stadio W.', 'Prima attraversa D, E e M.', 'Una bolla per ciascuno dei tre cicli.'],
        svolgimento: ['ret nello stadio D: una bolla.', 'ret nello stadio E: una bolla.', 'ret nello stadio M: una bolla.', 'In tutto 3 bolle.'] }
    ],
    sfida: ['cslez3_6_02_random_assembly', 'Abilitazione e controllo dei registri di pipeline']
  }
});
