'use strict';
/* Prova del capitolo 2.7: una domanda per unità. */
(() => {
  const I = SL.scritture.intero, ESA = SL.scritture.esa;
  const HA = (a) => '0x' + a.toString(16).toUpperCase();
  // Toglie dalle diagnosi quelle che coincidono con la risposta giusta o con una diagnosi precedente.
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const DOVE = ['nel buffer', 'nella sentinella', 'nel RBP salvato', 'nell’indirizzo di ritorno'];

  SL.registraProva('2.7', { domande: [
    // 2.7.1 · l'indirizzo di una variabile locale, oppure le celle intorno a RBP
    (r) => {
      if (r.int(0, 2) > 0) {
        const rsp = 0x7000 + 0x100 * r.int(0, 14) + 16 * r.int(1, 15) + 8, s = r.scegli([16, 32, 48, 64]), k = r.scegli([4, 8, 12, 16].filter((x) => x <= s)), rbp = rsp - 8, giusto = rbp - k, giuste = ESA(giusto, 4);
        return { u: '2.7.1', d: 'All’ingresso di una funzione RSP vale ' + HA(rsp) + '. La funzione esegue `push rbp`, `mov rbp, rsp` e `sub rsp, ' + s + '`. A quale indirizzo si trova la variabile locale `[rbp - ' + k + ']`? Si risponda in esadecimale.', segnaposto: 'Per esempio ' + HA(rbp), giuste,
          ok: '`push rbp` porta la cima a ' + HA(rbp) + ', e `mov rbp, rsp` fissa RBP a tale indirizzo. La variabile si trova ' + k + ' byte sotto.',
          diagnosi: DIAG(giuste, [
            { se: ESA(rsp - k, 4), msg: 'È stato sottratto ' + k + ' dal valore di RSP all’ingresso. In precedenza `push rbp` sottrae 8 a RSP, ed è il nuovo valore a essere copiato in RBP.' },
            { se: ESA(rbp - s - k, 4), msg: 'Il conteggio è partito da RSP dopo `sub rsp, ' + s + '`. La variabile è individuata da RBP, che la sottrazione lascia invariato.' },
            { se: ESA(rbp + k, 4), msg: 'Le variabili locali si trovano sotto RBP, a indirizzi più bassi: ' + k + ' va sottratto.' },
            { se: ESA(rbp, 4), msg: 'Il valore indicato è quello di RBP. La variabile si trova ' + k + ' byte più in basso.' }
          ]),
          altro: 'L’indirizzo è diverso. Si determini dapprima il valore di RBP dopo il prologo, e si sottragga poi ' + k + ' in esadecimale.',
          indizi: ['`push rbp` sottrae 8 a RSP.', '`mov rbp, rsp` copia in RBP la cima appena raggiunta: ' + HA(rbp) + '.', '`sub rsp, ' + s + '` sposta soltanto RSP. La variabile si trova a RBP − ' + k + '.'],
          svolgimento: ['Dopo `push rbp`: RSP = ' + HA(rsp) + ' − 8 = ' + HA(rbp) + '.', 'Dopo `mov rbp, rsp`: RBP = ' + HA(rbp) + '.', 'Variabile: ' + HA(rbp) + ' − ' + k + ' = ' + HA(giusto) + '.'] };
      }
      const quale = r.int(0, 1), giusta = quale ? '[rbp + 8]' : '[rbp]';
      const FB = { '[rbp]': 'In `[rbp]` si trova il RBP del chiamante, salvato da `push rbp`.', '[rbp + 8]': 'In `[rbp + 8]` si trova l’indirizzo di ritorno, depositato da CALL prima del prologo.', '[rbp - 8]': 'Sotto RBP si trovano le variabili locali della funzione.', '[rbp + 16]': 'Sopra l’indirizzo di ritorno comincia la parte di pila che appartiene al chiamante.' };
      return { u: '2.7.1', d: 'Una funzione comincia con `push rbp` e `mov rbp, rsp`. Quale espressione individua ' + (quale ? 'l’indirizzo di ritorno' : 'il valore di RBP che apparteneva al chiamante') + '?', guida: 'Si scelga la risposta.', o: Object.keys(FB).map((t) => (t === giusta ? { t, ok: true, fb: FB[t] } : { t, fb: FB[t] })) };
    },
    // 2.7.2 · la zona raggiunta da una copia, oppure i byte fuori dal buffer
    (r) => {
      if (r.int(0, 1) === 0) {
        const n = r.int(2, 32), ZONE = [['Buffer', 0, 7], ['Riempimento', 8, 11], ['Contatore', 12, 15], ['RBP salvato', 16, 23], ['Indirizzo di ritorno', 24, 31]], z = ZONE.find((x) => n - 1 >= x[1] && n - 1 <= x[2]);
        return { u: '2.7.2', d: 'In un frame il buffer occupa gli spostamenti da 0 a 7. Seguono il riempimento, da 8 a 11, il contatore, da 12 a 15, il RBP salvato, da 16 a 23, e l’indirizzo di ritorno, da 24 a 31. Una copia senza controlli scrive ' + n + ' byte a partire dallo spostamento 0. In quale zona cade l’ultimo byte scritto?', guida: 'Si scelga la risposta.',
          o: ZONE.map((x) => (x === z ? { t: x[0], ok: true, fb: 'La copia scrive gli spostamenti da 0 a ' + (n - 1) + ', e lo spostamento ' + (n - 1) + ' appartiene a questa zona.' } : { t: x[0], fb: 'Questa zona occupa gli spostamenti da ' + x[1] + ' a ' + x[2] + '. L’ultimo byte scritto ha spostamento ' + (n - 1) + '.' })) };
      }
      const B = r.scegli([8, 16, 24, 32]), n = B + r.int(1, 24), giusto = n - B, giuste = I(giusto);
      return { u: '2.7.2', d: 'Un buffer di ' + B + ' byte riceve una copia di ' + n + ' byte, eseguita senza confrontare la lunghezza con la capacità. Quanti byte sono scritti all’esterno del buffer?', segnaposto: 'Un numero', giuste,
        ok: 'I primi ' + B + ' byte riempiono il buffer. I restanti ' + giusto + ' proseguono nelle celle successive del frame.',
        diagnosi: DIAG(giuste, [
          { se: I(n), msg: 'Il valore indicato è il numero di tutti i byte copiati. I primi ' + B + ' cadono all’interno del buffer.' },
          { se: I(B), msg: 'Il valore indicato è il numero di byte che restano all’interno del buffer. Sono richiesti quelli esterni.' },
          { se: I(giusto + 1), msg: 'Il buffer contiene ' + B + ' byte, con gli spostamenti da 0 a ' + (B - 1) + '. Il primo byte esterno è il numero ' + (B + 1) + ' della copia.' },
          { se: I(giusto - 1), msg: 'Anche l’ultimo byte della copia va contato: gli spostamenti scritti all’esterno vanno da ' + B + ' a ' + (n - 1) + ', estremi compresi.' }
        ]),
        altro: 'Il numero è diverso. Si sottraggano dai byte copiati quelli contenuti nel buffer.',
        indizi: ['Il buffer contiene i primi ' + B + ' byte.', 'Gli altri sono scritti nelle celle successive.', n + ' − ' + B + '.'],
        svolgimento: ['Byte copiati: ' + n + '.', 'Byte contenuti nel buffer: ' + B + '.', 'Byte esterni al buffer: ' + n + ' − ' + B + ' = ' + giusto + '.'] };
    },
    // 2.7.3 · quanti byte della sentinella cambiano, oppure l'esito di una scrittura isolata
    (r) => {
      if (r.int(0, 1) === 0) {
        const n = r.int(4, 30), giusto = Math.max(0, Math.min(8, n - 8)), giuste = I(giusto);
        return { u: '2.7.3', d: 'In un frame il buffer occupa gli spostamenti da 0 a 7 e la sentinella quelli da 8 a 15. Una copia scrive ' + n + ' byte a partire dallo spostamento 0, e ogni byte scritto è diverso da quello che sostituisce. Quanti byte della sentinella risultano cambiati al controllo che precede RET?', segnaposto: 'Un numero', giuste,
          ok: giusto === 0 ? 'La copia scrive gli spostamenti da 0 a ' + (n - 1) + ', tutti nel buffer. La sentinella è invariata e il controllo è superato.' : giusto === 8 ? 'La copia attraversa l’intera sentinella. Il controllo fallisce e il programma è arrestato prima di RET.' : 'La copia scrive gli spostamenti da 0 a ' + (n - 1) + '. Quelli da 8 a ' + (n - 1) + ' appartengono alla sentinella, e il controllo fallisce.',
          diagnosi: DIAG(giuste, [
            { se: I(n), msg: 'Il valore indicato è il numero di tutti i byte copiati. I primi 8 cadono nel buffer.' },
            n > 16 ? { se: I(n - 8), msg: 'Il valore indicato è il numero di byte esterni al buffer. La sentinella occupa soltanto 8 spostamenti, da 8 a 15.' } : null,
            { se: I(8), msg: n <= 8 ? 'La copia si arresta allo spostamento ' + (n - 1) + ', all’interno del buffer. La sentinella comincia allo spostamento 8.' : 'La sentinella ha 8 byte. La copia si arresta tuttavia allo spostamento ' + (n - 1) + '.' },
            n > 8 && n < 16 ? { se: I(giusto + 1), msg: 'Lo spostamento 7 appartiene ancora al buffer. Il primo byte della sentinella ha spostamento 8.' } : null,
            { se: I(0), msg: 'La copia raggiunge lo spostamento ' + (n - 1) + ', oltre la fine del buffer. Almeno un byte della sentinella è sostituito.' }
          ]),
          altro: 'Il numero è diverso. Si elenchino gli spostamenti scritti dalla copia e si contino quelli compresi fra 8 e 15.',
          indizi: ['La copia scrive gli spostamenti da 0 a ' + (n - 1) + '.', 'La sentinella occupa gli spostamenti da 8 a 15.', 'Vanno contati gli spostamenti che appartengono a entrambi gli intervalli.'],
          svolgimento: ['Spostamenti scritti: da 0 a ' + (n - 1) + '.', 'Spostamenti della sentinella: da 8 a 15.', giusto === 0 ? 'Nessuno spostamento in comune: 0 byte.' : 'In comune: da 8 a ' + Math.min(15, n - 1) + ', cioè ' + giusto + ' byte.'] };
      }
      const s = r.int(2, 31), zona = s < 8 ? 0 : s < 16 ? 1 : s < 24 ? 2 : 3, g = zona === 1 ? 0 : zona === 3 ? 2 : 1;
      const fb = [
        g === 0 ? 'Lo spostamento ' + s + ' appartiene alla sentinella. Il confronto trova un byte diverso e arresta il programma.' : 'Il controllo fallisce soltanto se cambia un byte della sentinella, cioè uno spostamento da 8 a 15. Lo spostamento ' + s + ' si trova ' + DOVE[zona] + '.',
        g === 1 ? (zona === 0 ? 'Lo spostamento ' + s + ' appartiene al buffer. Sentinella e indirizzo di ritorno sono invariati.' : 'Lo spostamento ' + s + ' appartiene al RBP salvato. La sentinella e l’indirizzo di ritorno sono invariati, e il chiamante ritroverà un RBP errato.') : zona === 1 ? 'Lo spostamento ' + s + ' appartiene alla sentinella, e il controllo lo rileva.' : 'Lo spostamento ' + s + ' appartiene all’indirizzo di ritorno, che risulta quindi alterato.',
        g === 2 ? 'La scrittura ha oltrepassato la sentinella e ha raggiunto l’indirizzo di ritorno. Il controllo riguarda soltanto i byte della sentinella.' : zona === 1 ? 'Lo spostamento ' + s + ' appartiene alla sentinella: il controllo fallisce prima di RET.' : 'L’indirizzo di ritorno occupa gli spostamenti da 24 a 31. Lo spostamento ' + s + ' si trova ' + DOVE[zona] + '.'
      ];
      return { u: '2.7.3', d: 'In un frame il buffer occupa gli spostamenti da 0 a 7, la sentinella da 8 a 15, il RBP salvato da 16 a 23 e l’indirizzo di ritorno da 24 a 31. Per un indice errato il programma scrive un solo byte allo spostamento ' + s + ', cambiandone il valore. Che cosa accade al termine della funzione?', guida: 'Si scelga la risposta.',
        o: ['Il controllo fallisce, e il programma è arrestato prima di RET', 'Il controllo è superato, e RET impiega l’indirizzo di ritorno originale', 'Il controllo è superato, e RET impiega un indirizzo di ritorno alterato'].map((t, k) => (k === g ? { t, ok: true, fb: fb[k] } : { t, fb: fb[k] })) };
    },
    // 2.7.4 · il valore di RAX dopo una fila di blocchi
    (r) => {
      const a = r.int(2, 6), x = r.int(1, 9), ord = r.scegli(['AB', 'BA', 'AAB', 'ABA', 'BAA', 'ABB', 'BAB', 'BBA']);
      const FA = { A: (v) => v + a, B: (v) => 2 * v }, calc = (o) => Array.from(o).reduce((v, c) => FA[c](v), x), giusto = calc(ord), giuste = I(giusto);
      const righe = []; Array.from(ord).reduce((v, c, k) => { const w = FA[c](v); righe.push('RET numero ' + (k + 1) + ': blocco ' + c + ', ' + (c === 'A' ? v + ' + ' + a : '2 × ' + v) + ' = ' + w + '.'); return w; }, x);
      return { u: '2.7.4', d: 'In un programma il blocco A esegue `add rax, ' + a + '` e `ret`, e il blocco B esegue `add rax, rax` e `ret`. RAX vale ' + x + '. Un RET trova sulla pila, a partire dalla cima, gli indirizzi ' + Array.from(ord).map((c) => 'del blocco ' + c).join(', ') + ' e infine l’indirizzo di un blocco che arresta il calcolo. Quanto vale RAX al termine?', segnaposto: 'Un numero', giuste,
        ok: 'I blocchi sono eseguiti nell’ordine in cui i loro indirizzi sono disposti sulla pila, a partire dalla cima.',
        diagnosi: DIAG(giuste, [
          { se: I(calc(Array.from(ord).reverse().join(''))), msg: 'I blocchi sono stati eseguiti nell’ordine inverso. RET preleva per primo l’indirizzo in cima alla pila.' },
          { se: I(calc(ord[0])), msg: 'È stato eseguito soltanto il primo blocco. Ogni blocco termina con RET, che preleva l’indirizzo successivo.' },
          ord.length === 3 ? { se: I(calc(ord.slice(0, 2))), msg: 'Manca l’ultimo blocco. Sulla pila gli indirizzi da seguire sono tre, prima di quello che arresta il calcolo.' } : null,
          { se: I(x), msg: 'Il valore indicato è quello iniziale. Ogni RET porta a un blocco che modifica RAX.' }
        ]),
        altro: 'Il valore è diverso. Si segua un RET alla volta: ciascuno preleva l’indirizzo in cima e conduce a un blocco.',
        indizi: ['Il primo RET preleva l’indirizzo in cima: quello del blocco ' + ord[0] + '.', 'Il blocco A somma ' + a + ', il blocco B raddoppia.', 'Si applichino i blocchi nell’ordine ' + Array.from(ord).join(', ') + ', partendo da ' + x + '.'],
        svolgimento: righe.concat(['RAX = ' + giusto + '.']) };
    },
    // 2.7.5 · la riserva che rispetta l'allineamento, oppure la funzione foglia
    (r) => {
      const n = 8 * r.int(1, 9), N = (n + 8) % 16 ? n + 8 : n;
      if (r.int(0, 2) > 0) {
        const rsp = 0x7000 + 0x100 * r.int(0, 14) + 16 * r.int(1, 15) + 8, giuste = I(N);
        return { u: '2.7.5', d: 'All’ingresso di una funzione RSP vale ' + HA(rsp) + '. La funzione deve conservare ' + n + ' byte attraverso una chiamata a un’altra funzione. Qual è il minimo numero di byte da sottrarre a RSP affinché lo spazio sia sufficiente e RSP, prima della CALL, sia un multiplo di 16?', segnaposto: 'Un numero', giuste,
          ok: HA(rsp) + ' − ' + N + ' = ' + HA(rsp - N) + ', un multiplo di 16.' + (N === n ? '' : ' Con ' + n + ' byte RSP sarebbe sceso a ' + HA(rsp - n) + ', che diviso 16 dà resto 8.'),
          diagnosi: DIAG(giuste, [
            { se: I(n), msg: 'Lo spazio è sufficiente. Tuttavia ' + HA(rsp) + ' − ' + n + ' = ' + HA(rsp - n) + ', che diviso 16 dà resto 8.' },
            { se: I(N + 16), msg: 'RSP sarebbe un multiplo di 16 e lo spazio sarebbe sufficiente. Esiste tuttavia un numero minore con le medesime proprietà.' },
            { se: I(n + 8), msg: 'Con ' + (n + 8) + ' byte RSP scenderebbe a ' + HA(rsp - n - 8) + ', che diviso 16 dà resto 8.' },
            N > 8 ? { se: I(N - 16), msg: 'RSP sarebbe un multiplo di 16. Lo spazio sarebbe tuttavia inferiore ai ' + n + ' byte richiesti.' } : null
          ]),
          altro: 'Il numero è diverso. Si cerchi il minimo numero, maggiore o uguale a ' + n + ', che sommato a 8 dia un multiplo di 16.',
          indizi: ['All’ingresso RSP è un multiplo di 16 più 8.', 'La riserva più 8 deve essere un multiplo di 16: quindi 8, 24, 40, 56, 72.', 'Il minimo di tali numeri che sia almeno ' + n + '.'],
          svolgimento: ['Riserve che rispettano l’allineamento: 8, 24, 40, 56, 72.', 'Occorrono almeno ' + n + ' byte.', 'La minima adatta è ' + N + ': ' + HA(rsp) + ' − ' + N + ' = ' + HA(rsp - N) + '.'] };
      }
      const terza = N === n ? n + 16 : N;
      return { u: '2.7.5', d: 'Una funzione foglia, cioè priva di chiamate ad altre funzioni, richiede ' + n + ' byte per un temporaneo. Di quanti byte deve abbassare RSP?', guida: 'Si scelga la risposta.', o: [
        { t: '0 byte', ok: true, fb: 'Una funzione foglia può conservare il temporaneo nella zona rossa, i 128 byte sotto RSP, senza spostarlo.' },
        { t: n + ' byte', fb: 'Ciò sarebbe necessario se la funzione chiamasse altre funzioni. A una foglia la convenzione concede i 128 byte sotto RSP.' },
        { t: terza + ' byte', fb: 'L’allineamento a 16 riguarda il momento di una CALL, e una funzione foglia ne è priva.' }] };
    },
    // 2.7.6 · l'esito di RET con e senza pila ombra
    (r) => {
      const a = 0x401000 + r.int(1, 0xEF0), rit = a + 5, d = r.scegli([8, 16, 32]), caso = r.scegli(['ret', 'ret', 'dato', 'niente']), attiva = r.int(0, 2) > 0;
      const esito = caso !== 'ret' ? 'ok' : attiva ? 'cp' : 'alt';
      const T = { ok: 'RET ritorna a ' + HA(rit), alt: 'RET salta a ' + HA(rit + d), cp: 'Il processore solleva l’eccezione #CP' };
      const FB = {
        ok: esito === 'ok' ? (caso === 'dato' ? 'L’indirizzo di ritorno è invariato e RET ritorna regolarmente. Il dato locale resta errato' + (attiva ? ', poiché la pila ombra contiene soltanto indirizzi di ritorno.' : '.') : 'Nulla è stato alterato, e RET ritorna all’istruzione che segue la CALL.') : 'Sulla pila ordinaria l’indirizzo originale è stato sovrascritto. ' + (attiva ? 'Il confronto con la pila ombra rivela la differenza e impedisce il salto.' : 'Senza pila ombra, RET impiega il valore alterato.'),
        alt: esito === 'alt' ? 'Senza pila ombra RET dispone soltanto della copia sulla pila ordinaria, che è stata alterata.' : esito === 'cp' ? 'Con la pila ombra attiva RET confronta le due copie prima del salto. In questo caso sono diverse, e il salto è impedito.' : 'L’indirizzo di ritorno sulla pila ordinaria è invariato, e RET torna quindi al punto stabilito dalla CALL.',
        cp: esito === 'cp' ? 'Le due copie sono diverse: ' + HA(rit + d) + ' sulla pila ordinaria, ' + HA(rit) + ' sulla pila ombra.' : !attiva ? 'L’eccezione #CP deriva dal confronto con la pila ombra, che in questo caso è disattivata.' : 'L’eccezione #CP deriva da due copie diverse dell’indirizzo di ritorno. In questo caso esse coincidono' + (caso === 'dato' ? ', poiché la scrittura ha modificato un dato locale.' : '.')
      };
      return { u: '2.7.6', d: 'Una CALL di 5 byte comincia all’indirizzo ' + HA(a) + '. La pila ombra è ' + (attiva ? 'attiva' : 'disattivata') + '. Prima di RET ' + (caso === 'ret' ? 'una scrittura errata somma ' + d + ' all’indirizzo di ritorno sulla pila ordinaria' : caso === 'dato' ? 'una scrittura errata modifica un dato locale e lascia invariato l’indirizzo di ritorno' : 'nessuna scrittura è errata') + '. Che cosa accade a RET?', guida: 'Si scelga la risposta.',
        o: ['ok', 'alt', 'cp'].map((k) => (k === esito ? { t: T[k], ok: true, fb: FB[k] } : { t: T[k], fb: FB[k] })) };
    },
    // 2.7.7 · il terminatore e la capacità
    (r) => {
      const C = r.scegli([4, 8, 12, 16, 24, 32, 64]);
      if (r.int(0, 2) === 0) {
        const giuste = I(C - 1);
        return { u: '2.7.7', d: 'Un buffer ha capacità ' + C + ' byte. Qual è il numero massimo di caratteri di una stringa C che vi è contenuta per intero, terminatore compreso?', segnaposto: 'Un numero', giuste,
          ok: 'Con ' + (C - 1) + ' caratteri il terminatore occupa la cella di indice ' + (C - 1) + ', l’ultima del buffer.',
          diagnosi: DIAG(giuste, [
            { se: I(C), msg: 'Con ' + C + ' caratteri le celle da 0 a ' + (C - 1) + ' sono tutte occupate, e il terminatore richiederebbe la cella ' + C + ', la prima esterna.' },
            { se: I(C + 1), msg: 'Il buffer ha ' + C + ' celle. Una stringa richiede i caratteri più un byte per il terminatore.' },
            { se: I(C - 2), msg: 'Con ' + (C - 2) + ' caratteri il terminatore occupa la cella ' + (C - 2) + ' e la cella ' + (C - 1) + ' resta libera: è disponibile un carattere in più.' }
          ]),
          altro: 'Il numero è diverso. La stringa occupa n + 1 byte, che devono essere contenuti nelle ' + C + ' celle del buffer.',
          indizi: ['Una stringa di n caratteri occupa n + 1 byte.', 'Deve valere n < ' + C + '.', 'Il massimo intero minore di ' + C + '.'],
          svolgimento: ['Byte occupati: n + 1.', 'Condizione: n < ' + C + '.', 'Massimo: n = ' + (C - 1) + ', con il terminatore nella cella ' + (C - 1) + '.'] };
      }
      const n = C + r.scegli([-2, -1, 0, 0, 1]), giusto = n < C ? n + 1 : 0, giuste = I(giusto);
      return { u: '2.7.7', d: 'Una routine deve copiare una stringa di ' + n + ' caratteri, con il terminatore, in un buffer di capacità ' + C + ' byte. Prima della copia verifica che n sia minore di C, e in caso contrario rifiuta senza scrivere. Quanti byte scrive?', segnaposto: 'Un numero', giuste,
        ok: giusto ? 'La condizione ' + n + ' < ' + C + ' è vera. La routine scrive i ' + n + ' caratteri e il terminatore.' : 'La condizione ' + n + ' < ' + C + ' è falsa: il terminatore cadrebbe nella cella ' + n + ', esterna al buffer. La routine rifiuta l’intera richiesta.',
        diagnosi: DIAG(giuste, giusto ? [
          { se: I(n), msg: 'Il valore indicato è il numero dei soli caratteri. La routine scrive anche il terminatore.' },
          { se: I(0), msg: 'La condizione ' + n + ' < ' + C + ' è vera, e la copia avviene.' },
          { se: I(C), msg: 'La routine scrive soltanto i byte della stringa. Le celle rimanenti del buffer restano invariate.' }
        ] : [
          { se: I(n), msg: 'Il terminatore richiederebbe la cella di indice ' + n + ', esterna al buffer. La routine rifiuta l’intera richiesta, caratteri compresi.' },
          { se: I(n + 1), msg: 'Occorrerebbero ' + (n + 1) + ' byte, e il buffer ne offre ' + C + '. Il controllo fallisce e nessun byte è scritto.' },
          { se: I(C), msg: 'Una copia parziale lascerebbe nel buffer un testo privo di terminatore. La routine rifiuta l’intera richiesta.' }
        ]),
        altro: 'Il numero è diverso. Si stabilisca dapprima se la condizione n < C è vera, e si contino poi i byte della stringa con il terminatore.',
        indizi: ['Il terminatore occupa la cella di indice ' + n + '.', 'Il buffer ha gli indici da 0 a ' + (C - 1) + '.', giusto ? 'La condizione è vera: caratteri più terminatore.' : 'La condizione è falsa: la routine rifiuta.'],
        svolgimento: ['Condizione: ' + n + ' < ' + C + ', ' + (giusto ? 'vera' : 'falsa') + '.', giusto ? 'Byte scritti: ' + n + ' + 1 = ' + giusto + '.' : 'La routine rifiuta prima di scrivere.', 'Byte scritti: ' + giusto + '.'] };
    }
  ] });
})();
