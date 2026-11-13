'use strict';
SL.registra('2.7.5', {
  titolo: 'Ottimizzazioni dello stack e dettagli ABI',
  obiettivo: 'Alla fine saprai prevedere di quanto una funzione abbassa RSP, distinguendo le funzioni che non chiamano altre funzioni da quelle che lo fanno, e tenendo conto dell’allineamento.',
  concetti: [['pila', 'Funzioni senza frame'], ['memory', 'La zona rossa'], ['bilancio', 'RSP multiplo di 16']],
  filigrana: ['pila', 'memory', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'pila', da: 'Dall’unità 2.6.2', t: 'CALL e lo spazio locale', d: 'CALL toglie 8 a RSP per posare l’indirizzo di ritorno. Una funzione riserva spazio togliendo altri byte a RSP.' },
      { sim: 'memory', da: 'Dall’unità 2.3.4', t: 'Multipli richiesti', d: 'Certi dati devono cominciare a un indirizzo multiplo di un numero fissato. In esadecimale, i multipli di 16 terminano con la cifra 0.' },
      { sim: 'alu', da: 'Dall’unità 2.2.4', t: 'LEA per i calcoli', d: 'LEA calcola una somma e la scrive in un registro, senza toccare la memoria e senza modificare i flag.' }
    ],
    domanda: { d: 'Prima di proseguire: quale di questi indirizzi è un multiplo di 16?', o: [
      { t: '0x9FE0', ok: true, fb: 'In esadecimale i multipli di 16 terminano con la cifra 0.' },
      { t: '0x9FF8', fb: 'L’ultima cifra è 8: l’indirizzo è un multiplo di 8, e diviso 16 dà resto 8.' },
      { t: '0x9FE4', fb: 'L’ultima cifra è 4: l’indirizzo è un multiplo di 4, e diviso 16 dà resto 4.' }
    ] }
  },
  idea: {
    titolo: 'Quanto spazio serve davvero',
    termini: ['funzione foglia', 'zona rossa', 'allineamento della pila'],
    testo: [
      'Il frame con RBP dell’unità 2.7.1 è lo schema più leggibile, e i compilatori lo adottano quando le ottimizzazioni sono spente. Quando sono accese ne fanno spesso a meno: individuano le variabili a partire da RSP, e RBP torna un registro come gli altri. Una funzione che può tenere tutto nei registri non tocca la pila affatto.',
      'Molto dipende da una distinzione. Una [[funzione foglia]] è una funzione che non ne chiama altre. Sotto la sua cima di pila nessuna CALL scriverà nulla, e la convenzione le concede un privilegio: può usare i 128 byte che stanno sotto RSP senza spostarlo. Questa fascia si chiama [[zona rossa]]. La convenzione garantisce che neppure il sistema operativo, quando interrompe il programma per un imprevisto, scriva in quei 128 byte.',
      { fig: 'scena', w: 720, h: 150, titolo: 'La zona rossa di una funzione foglia', nota: 'RSP resta fermo sull’indirizzo di ritorno. I temporanei stanno sotto, entro 128 byte.', els:
        SL.x86.pila('p', [{ a: 0x9FF8, txt: 'indirizzo di ritorno', nota: '[rsp]', st: 'on' }, { a: 0x9FF0, txt: 'temporaneo', nota: '[rsp - 8]', st: 'att' }, { a: 0x9FE8, txt: 'temporaneo', nota: '[rsp - 16]', st: 'att' }], { x: 60, y: 6, w: 260, rsp: 0x9FF8 }) },
      'Una funzione che ne chiama altre non può contare sulla zona rossa. La sua CALL poserebbe l’indirizzo di ritorno proprio lì, e la funzione chiamata userebbe a sua volta quelle celle. I dati che devono sopravvivere alla chiamata vanno messi al sicuro abbassando RSP.',
      'Sulla quantità pesa un’ultima regola, l’[[allineamento della pila]]: al momento di ogni CALL, RSP deve essere un multiplo di 16. Poiché CALL toglie 8, all’ingresso di ogni funzione RSP è un multiplo di 16 più 8. Per rimetterlo a posto prima di una propria CALL, la funzione deve togliere un numero di byte che, sommato a quegli 8, dia un multiplo di 16: quindi 8, 24, 40 e così via.',
      'Questi dettagli spiegano molto di ciò che si incontra in un programma disassemblato: funzioni prive di prologo, accessi a `[rsp - 8]`, un `sub rsp, 24` dove bastavano 16 byte.'
    ]
  },
  esperimento: {
    faremo: [
      'Tre funzioni entrano con RSP uguale a 0x9FF8. La prima somma 1 al proprio argomento. La seconda è una foglia che ha bisogno di un temporaneo in memoria. La terza deve conservare un temporaneo attraverso una chiamata. Sceglierai la funzione e la dimensione del temporaneo.',
      'Vedremo dove finisce il temporaneo e di quanto si muove RSP. Dopo il caso proposto, scegli un temporaneo di 16 byte per la terza funzione e osserva quanti byte vengono riservati.'
    ],
    vedrai: [
      ['operation', 'Il listato', 'A sinistra: le istruzioni della funzione scelta.'],
      ['pila', 'La pila', 'Al centro: l’indirizzo di ritorno e le celle sottostanti.'],
      ['bilancio', 'RSP e il resto', 'In basso: il valore di RSP e il suo resto nella divisione per 16.']
    ]
  },
  lab: {
    titolo: 'Tre funzioni, tre modi di usare la pila',
    scena: { w: 860, h: 384 },
    atti: ['All’ingresso', 'Il bisogno di memoria', 'Dove va il temporaneo', 'Che cosa lo protegge', 'Il conto'],
    controlli: [
      { id: 't', tipo: 'scelta', eti: 'Funzione', opzioni: [['uno', 'somma 1 all’argomento'], ['foglia', 'foglia con un temporaneo'], ['chiama', 'conserva un temporaneo e chiama']], valore: 'chiama' },
      { id: 'n', tipo: 'scelta', eti: 'Temporaneo', opzioni: [[8, '8 byte'], [16, '16 byte'], [24, '24 byte'], [40, '40 byte']], valore: 24 }
    ],
    nota: 'Il numero di passi dipende dalla funzione. La dimensione del temporaneo non riguarda la prima.',
    previsione: {
      domanda: (p) => 'All’ingresso di una funzione RSP vale 0x9FF8. ' + SL.unita275.DESCR[p.t].replace('#n', p.n) + ' Di quanti byte la funzione abbassa RSP?',
      opzioni: (p) => { const N = SL.unita275.riserva(p.n); return Array.from(new Set([0, p.n, N, p.n + 16])).sort((a, b) => a - b).map((v) => [v, v + ' byte']); }
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + pred + ' byte. La funzione abbassa RSP di ' + esito + ' byte. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.t === 'uno' ? 'La funzione calcola tutto nei registri, e la pila non le serve.' : p.t === 'foglia' ? 'Una funzione foglia può tenere il temporaneo nella zona rossa, sotto RSP, senza spostarlo.' : 'Servono almeno ' + p.n + ' byte, e dopo la sottrazione RSP deve essere un multiplo di 16: il più piccolo numero adatto è ' + esito + '.'),
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita275, passi = [], T = p.t, n = p.n, N = U.riserva(n), HA = (a) => '0x' + a.toString(16).toUpperCase(), mosso = T === 'chiama' ? N : 0;
      const LIS = T === 'uno' ? ['lea eax, [rdi + 1]', 'ret'] : T === 'foglia' ? ['mov [rsp - ' + n + '], rdi', 'calcoli nei registri', 'mov rax, [rsp - ' + n + ']', 'ret'] : ['sub rsp, ' + N, 'mov [rsp], rdi', 'call altra', 'mov rax, [rsp]', 'add rsp, ' + N, 'ret'];
      const st = { rsp: 0x9FF8, temp: false, ris: false, chiamata: false };
      const quadro = (o) => {
        const els = [el.nota('n1', 20, 0, 'LA FUNZIONE', 'mono'), el.nota('n2', 300, 0, 'LA PILA', 'mono')];
        LIS.forEach((t, k) => els.push(el.box('i' + k, 20, 24 + k * 44, 250, 38, null, t, o.riga === k ? 'att' : o.riga > k ? 'on' : '', { cls: 'stretta' })));
        const righe = [{ a: 0x9FF8, txt: '0x401234', nota: 'indirizzo di ritorno' }];
        for (let j = 1; j <= 6; j++) {
          const a = 0x9FF8 - 8 * j, inTemp = st.temp && (T === 'foglia' ? j <= n / 8 : j > (N - n) / 8 && j <= N / 8), inRis = st.ris && j <= N / 8, rit2 = st.chiamata && a === st.rsp - 8;
          righe.push({ a, txt: rit2 ? 'ritorno di altra' : inTemp ? 'temporaneo' : inRis ? 'riservata' : null, nota: rit2 ? 'posato dalla CALL interna' : inTemp && T === 'foglia' && j === 1 ? 'zona rossa' : inRis && T === 'chiama' && j <= (N - n) / 8 ? 'per l’allineamento' : null, st: rit2 ? 'err' : inTemp && o.cella ? 'att' : null });
        }
        X.pila('s', righe, { x: 300, y: 24, w: 170, passo: 38, rsp: st.rsp }).forEach((e) => els.push(e));
        els.push(el.box('b1', 20, 304, 250, 66, 'RSP', HA(st.rsp), o.rsp ? 'att' : 'on', { cls: 'stretta' }),
          el.box('b2', 290, 304, 270, 66, 'resto di RSP diviso 16', String(st.rsp % 16), o.resto ? 'att' : '', { cls: 'stretta' }),
          el.box('b3', 580, 304, 260, 66, 'RSP si è abbassato di', (0x9FF8 - st.rsp) + ' byte', o.fine ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['RSP', HA(st.rsp), 'a'], ['Resto diviso 16', String(st.rsp % 16)], ['Abbassamento', (0x9FF8 - st.rsp) + ' byte', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ resto: true }, 0, 'All’ingresso', 'La funzione è appena stata chiamata, e RSP vale 0x9FF8. Il chiamante aveva la pila su un multiplo di 16, come vuole la convenzione, e la CALL ha tolto 8. Per questo il resto di RSP nella divisione per 16 è 8, come all’ingresso di ogni funzione.',
        { chiedi: { d: T === 'uno' ? 'La funzione deve restituire il proprio argomento aumentato di 1. Ha bisogno di memoria sulla pila?' : 'La funzione ha bisogno di ' + n + ' byte di memoria per un temporaneo. ' + (T === 'foglia' ? 'È una foglia: deve spostare RSP per ottenerli?' : 'Poi chiamerà un’altra funzione: può lasciarlo sotto RSP senza spostarlo?'), o: ['Sì', 'No'], g: 1, no: T === 'uno' ? 'L’argomento è in RDI e il risultato va in RAX: basta un’istruzione che lavora sui registri.' : T === 'foglia' ? 'Una foglia può usare i 128 byte sotto RSP, la zona rossa, lasciando RSP dov’è.' : 'La CALL interna poserebbe il proprio indirizzo di ritorno sotto RSP, proprio sul temporaneo.' } });
      if (T === 'uno') {
        P({ riga: 0 }, 1, 'Tutto nei registri', 'La funzione calcola con una sola istruzione: LEA somma 1 a RDI e scrive il risultato in EAX. Nessuna variabile ha bisogno di memoria, nessun registro va salvato. Il compilatore non genera né prologo né epilogo.', { calc: 'EAX = RDI + 1' });
        P({ riga: 1, fine: true }, 4, 'Nessun frame', 'RET trova in cima l’indirizzo di ritorno, che nessuno ha spostato. RSP non si è mosso di un byte per tutta la funzione. Il frame, per questa funzione, si riduce al solo indirizzo di ritorno posato da CALL.', { calc: 'abbassamento: 0 byte', esito: ['0 byte', 'si'] });
        return { passi, esito: 0 };
      }
      P({ riga: -1 }, 1, 'Un temporaneo da conservare', 'La funzione ha bisogno di ' + n + ' byte in memoria per un valore provvisorio. ' + (T === 'foglia' ? 'Nel suo corpo manca ogni CALL, quindi è una foglia. Finché lavora, nessuno scriverà sotto la sua cima di pila.' : 'A metà del lavoro chiama un’altra funzione, e il valore deve essere ancora lì al ritorno.'), { calc: 'temporaneo: ' + n + ' byte' });
      if (T === 'foglia') {
        st.temp = true;
        P({ riga: 0, cella: true }, 2, 'Sotto RSP, senza spostarlo', 'La funzione scrive il temporaneo nelle celle che stanno sotto RSP, a partire da `[rsp - ' + n + ']`. RSP resta a 0x9FF8. Sono ' + n + ' dei 128 byte della zona rossa.', { calc: '[rsp − ' + n + '] = ' + HA(0x9FF8 - n) });
        P({ riga: 2, cella: true }, 3, 'Perché nessuno lo sovrascrive', 'La funzione non esegue CALL, quindi nessun indirizzo di ritorno verrà posato su quelle celle. E la convenzione garantisce che neppure il sistema operativo, se interrompe il programma, scriva nei 128 byte sotto RSP. Il temporaneo si rilegge intatto.', { calc: 'zona rossa: 128 byte' });
        P({ riga: 3, fine: true }, 4, 'Due istruzioni risparmiate', 'RET trova in cima l’indirizzo di ritorno, perché RSP non si è mai mosso. La funzione ha usato ' + n + ' byte di pila senza eseguire né una sottrazione né una somma su RSP.', { calc: 'abbassamento: 0 byte', esito: ['0 byte', 'si'] });
        return { passi, esito: 0 };
      }
      const o2 = Array.from(new Set([n, N, n + 16])).sort((a, b) => a - b);
      st.rsp = 0x9FF8 - N; st.ris = true;
      P({ riga: 0, rsp: true, resto: true }, 2, N === n ? 'La riserva' : 'Una riserva più grande del necessario', 'La funzione toglie ' + N + ' a RSP, che scende a ' + HA(st.rsp) + '. ' + (N === n ? 'Sono esattamente i ' + n + ' byte che servono, e bastano anche per l’allineamento: 8 + ' + n + ' = ' + (8 + n) + ' è un multiplo di 16.' : 'Ne servivano ' + n + ', ma con ' + n + ' RSP sarebbe sceso a ' + HA(0x9FF8 - n) + ', che diviso 16 dà resto 8. Con ' + N + ' arriva a un multiplo di 16, come la convenzione chiede prima di una CALL. Gli 8 byte in più restano inutilizzati.'),
        { calc: '0x9FF8 − ' + N + ' = ' + HA(st.rsp), chiedi: { d: 'Ora la funzione eseguirà `call altra`. Dove verrà posato l’indirizzo di ritorno di quella chiamata?', o: [HA(st.rsp - 8), HA(st.rsp), HA(st.rsp + 8)].sort(), g: [HA(st.rsp - 8), HA(st.rsp), HA(st.rsp + 8)].sort().indexOf(HA(st.rsp - 8)), no: 'CALL toglie 8 a RSP e scrive nella nuova cima: ' + HA(st.rsp) + ' − 8 = ' + HA(st.rsp - 8) + '.' } });
      st.temp = true;
      P({ riga: 1, cella: true }, 2, 'Il temporaneo al sicuro', 'Il valore viene scritto a partire da `[rsp]`, cioè da ' + HA(st.rsp) + ' in su. Occupa lo spazio che la funzione ha riservato, dalla cima della pila verso gli indirizzi più alti.', { calc: '[rsp] = ' + HA(st.rsp) });
      st.chiamata = true;
      P({ riga: 2 }, 3, 'La chiamata interna', 'La CALL trova RSP su un multiplo di 16 e posa il proprio indirizzo di ritorno a ' + HA(st.rsp - 8) + ', sotto il temporaneo. La funzione chiamata lavorerà ancora più in basso. Se il temporaneo fosse rimasto sotto RSP, l’indirizzo di ritorno lo avrebbe sovrascritto. Quando la funzione chiamata ritorna, RSP vale di nuovo ' + HA(st.rsp) + '.', { calc: 'indirizzo di ritorno a ' + HA(st.rsp - 8) });
      st.chiamata = false;
      P({ riga: 3, fine: true, cella: true }, 4, 'Il conto', 'Dopo la chiamata la funzione rilegge il temporaneo, intatto. Le restano due istruzioni: sommare ' + N + ' a RSP, che torna a 0x9FF8, e ritornare. Per conservare ' + n + ' byte ha abbassato RSP di ' + N + ': ' + (N === n ? 'il numero coincide, perché ' + n + ' più 8 è già un multiplo di 16.' : 'la differenza, 8 byte, è il prezzo dell’allineamento.'), { calc: 'abbassamento: ' + N + ' byte', esito: [N + ' byte', 'si'] });
      return { passi, esito: mosso };
    }
  },
  bilancio: {
    regola: [
      'Una funzione che tiene tutto nei registri non costruisce alcun frame. Una funzione foglia può usare la zona rossa, i 128 byte sotto RSP, senza spostarlo.',
      'Una funzione che ne chiama altre deve riservare lo spazio abbassando RSP. Prima di ogni CALL, RSP deve essere un multiplo di 16: all’ingresso vale un multiplo di 16 più 8, quindi la riserva vale 8, 24, 40 e così via.'
    ],
    errori: [
      ['Usare la zona rossa in una funzione che chiama.', 'La CALL posa l’indirizzo di ritorno otto byte sotto RSP, proprio dove comincia la zona rossa.'],
      ['Riservare esattamente i byte che servono.', 'Con RSP uguale a 0x9FF8 e 16 byte da conservare, togliere 16 porta a 0x9FE8, che non è un multiplo di 16. Ne vanno tolti 24.'],
      ['Aspettarsi un prologo in ogni funzione.', 'Con le ottimizzazioni attive molte funzioni cominciano direttamente dal calcolo, e alcune finiscono senza avere toccato la pila.']
    ],
    saFare: ['Riconosco una funzione foglia e so dove può tenere i temporanei.', 'Calcolo la riserva che rispetta l’allineamento prima di una CALL.', 'Spiego perché una funzione compilata può non avere alcun frame.'],
    esercizi: [
      { d: 'All’ingresso di una funzione RSP vale 0x7FF8. La funzione deve conservare 32 byte attraverso una chiamata. Qual è il più piccolo numero di byte da togliere a RSP perché lo spazio basti e RSP, prima della CALL, sia un multiplo di 16?', segnaposto: 'Un numero', giuste: ['40', 'quaranta'],
        ok: 'Con 32 byte RSP scenderebbe a 0x7FD8, che diviso 16 dà resto 8. Con 40 scende a 0x7FD0, un multiplo di 16.',
        diagnosi: [
          { se: ['32'], msg: 'Lo spazio basta, ma 0x7FF8 − 32 = 0x7FD8, che diviso 16 dà resto 8. La riserva, sommata agli 8 byte della CALL, deve dare un multiplo di 16.' },
          { se: ['48'], msg: 'Con 48 byte RSP scenderebbe a 0x7FC8, che diviso 16 dà resto 8. Il numero cercato è più piccolo.' },
          { se: ['24'], msg: 'L’allineamento sarebbe rispettato, ma 24 byte non bastano per conservarne 32.' }
        ],
        altro: 'Il numero è diverso. Cerca il più piccolo numero, almeno pari a 32, che sommato a 8 dia un multiplo di 16.',
        indizi: ['All’ingresso RSP è un multiplo di 16 più 8.', 'La riserva più 8 deve essere un multiplo di 16: quindi 8, 24, 40, 56.', 'Il più piccolo di questi numeri che sia almeno 32.'],
        svolgimento: ['Riserve che rispettano l’allineamento: 8, 24, 40, 56.', 'Servono almeno 32 byte.', 'La più piccola adatta è 40: 0x7FF8 − 0x28 = 0x7FD0.'] },
      { d: 'Una funzione scrive in `[rsp - 16]` senza avere mai spostato RSP. In quale caso è lecito?', guida: 'Scegli la risposta.', o: [
        { t: 'Quando la funzione è una foglia', ok: true, fb: 'Una foglia può usare i 128 byte sotto RSP, la zona rossa. Nessuna CALL li sovrascriverà.' },
        { t: 'Sempre, perché sotto RSP la memoria è libera', fb: 'Se la funzione chiama un’altra funzione, la CALL e la funzione chiamata scrivono proprio sotto RSP.' },
        { t: 'Mai, perché sotto RSP ogni scrittura è un errore', fb: 'La convenzione riserva alle funzioni foglia i 128 byte sotto RSP, proprio per evitare loro di spostarlo.' }] }
    ],
    sfida: ['cslez2_7_05_random_assembly_05', 'Allineamento, registri salvati e indirizzo di ritorno']
  }
});
SL.unita275 = {
  // La più piccola riserva, almeno pari a n, che sommata agli 8 byte della CALL dia un multiplo di 16.
  riserva: (n) => { let v = n; while ((v + 8) % 16) v += 8; return v; },
  DESCR: { uno: 'La funzione restituisce il proprio argomento aumentato di 1, con la sola istruzione `lea eax, [rdi + 1]`.', foglia: 'La funzione non chiama altre funzioni e ha bisogno di #n byte per un temporaneo.', chiama: 'La funzione deve conservare un temporaneo di #n byte attraverso una chiamata a un’altra funzione.' }
};
