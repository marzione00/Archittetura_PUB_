'use strict';
SL.registra('2.7.5', {
  titolo: 'Ottimizzazioni dello stack e dettagli ABI',
  obiettivo: 'Obiettivo: prevedere di quanto una funzione abbassa RSP, distinguendo le funzioni prive di chiamate ad altre funzioni da quelle che ne eseguono, e tenendo conto dell’allineamento.',
  concetti: [['pila', 'Funzioni senza frame'], ['memory', 'La zona rossa'], ['bilancio', 'RSP multiplo di 16']],
  filigrana: ['pila', 'memory', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'pila', da: 'Dall’unità 2.6.2', t: 'CALL e lo spazio locale', d: 'CALL sottrae 8 a RSP per depositare l’indirizzo di ritorno. Una funzione riserva spazio sottraendo altri byte a RSP.' },
      { sim: 'memory', da: 'Dall’unità 2.3.4', t: 'Multipli richiesti', d: 'Alcuni dati devono cominciare a un indirizzo multiplo di un numero fissato. In esadecimale, i multipli di 16 terminano con la cifra 0.' },
      { sim: 'alu', da: 'Dall’unità 2.2.4', t: 'LEA per i calcoli', d: 'LEA calcola una somma e la scrive in un registro, senza accedere alla memoria e senza modificare i flag.' }
    ],
    domanda: { d: 'Prima di proseguire: quale di questi indirizzi è un multiplo di 16?', o: [
      { t: '0x9FE0', ok: true, fb: 'In esadecimale i multipli di 16 terminano con la cifra 0.' },
      { t: '0x9FF8', fb: 'L’ultima cifra è 8: l’indirizzo è un multiplo di 8, e diviso 16 dà resto 8.' },
      { t: '0x9FE4', fb: 'L’ultima cifra è 4: l’indirizzo è un multiplo di 4, e diviso 16 dà resto 4.' }
    ] }
  },
  idea: {
    titolo: 'Lo spazio effettivamente necessario',
    termini: ['funzione foglia', 'zona rossa', 'allineamento della pila'],
    testo: [
      'Il frame con RBP dell’unità 2.7.1 è lo schema più leggibile, e i compilatori lo adottano quando le ottimizzazioni sono disattivate. Quando sono attive lo omettono spesso: individuano le variabili a partire da RSP, e RBP torna un registro come gli altri. Una funzione che può conservare tutti i valori nei registri è priva di accessi alla pila.',
      'Molto dipende da una distinzione. Una [[funzione foglia]] è una funzione priva di chiamate ad altre funzioni. Sotto la sua cima di pila nessuna CALL scrive alcun dato, e la convenzione le concede una facoltà: può impiegare i 128 byte situati sotto RSP senza spostarlo. Tale fascia prende il nome di [[zona rossa]]. La convenzione garantisce che neppure il sistema operativo, quando interrompe il programma per un evento imprevisto, scriva in tali 128 byte.',
      { fig: 'scena', w: 720, h: 150, titolo: 'La zona rossa di una funzione foglia', nota: 'RSP resta fisso sull’indirizzo di ritorno. I temporanei si trovano sotto, entro 128 byte.', els:
        SL.x86.pila('p', [{ a: 0x9FF8, txt: 'indirizzo di ritorno', nota: '[rsp]', st: 'on' }, { a: 0x9FF0, txt: 'temporaneo', nota: '[rsp - 8]', st: 'att' }, { a: 0x9FE8, txt: 'temporaneo', nota: '[rsp - 16]', st: 'att' }], { x: 60, y: 6, w: 260, rsp: 0x9FF8 }) },
      'Una funzione che ne chiama altre è esclusa dall’impiego della zona rossa. La sua CALL depositerebbe l’indirizzo di ritorno in tale fascia, e la funzione chiamata impiegherebbe a sua volta quelle celle. I dati che devono essere conservati attraverso la chiamata vanno protetti abbassando RSP.',
      'Sulla quantità incide un’ultima regola, l’[[allineamento della pila]]: al momento di ogni CALL, RSP deve essere un multiplo di 16. Poiché CALL sottrae 8, all’ingresso di ogni funzione RSP è un multiplo di 16 più 8. Per ripristinare l’allineamento prima di una propria CALL, la funzione deve sottrarre un numero di byte che, sommato a tali 8, dia un multiplo di 16: quindi 8, 24, 40 e così via.',
      'Tali dettagli spiegano molti aspetti di un programma disassemblato: funzioni prive di prologo, accessi a `[rsp - 8]`, un `sub rsp, 24` dove sarebbero stati sufficienti 16 byte.'
    ]
  },
  esperimento: {
    faremo: [
      'Tre funzioni entrano con RSP uguale a 0x9FF8. La prima somma 1 al proprio argomento. La seconda è una foglia che richiede un temporaneo in memoria. La terza deve conservare un temporaneo attraverso una chiamata. I controlli fissano la funzione e la dimensione del temporaneo.',
      'Sono mostrate la collocazione del temporaneo e la variazione di RSP. Dopo il caso proposto, è istruttivo scegliere un temporaneo di 16 byte per la terza funzione e rilevare il numero di byte riservati.'
    ],
    vedrai: [
      ['operation', 'Il listato', 'A sinistra: le istruzioni della funzione scelta.'],
      ['pila', 'La pila', 'Al centro: l’indirizzo di ritorno e le celle sottostanti.'],
      ['bilancio', 'RSP e il resto', 'In basso: il valore di RSP e il suo resto nella divisione per 16.']
    ]
  },
  lab: {
    titolo: 'Tre funzioni, tre impieghi della pila',
    scena: { w: 860, h: 384 },
    atti: ['All’ingresso', 'La memoria necessaria', 'La collocazione del temporaneo', 'La protezione del temporaneo', 'Il conto'],
    controlli: [
      { id: 't', tipo: 'scelta', eti: 'Funzione', opzioni: [['uno', 'aggiunta di 1 all’argomento'], ['foglia', 'foglia con un temporaneo'], ['chiama', 'temporaneo conservato attraverso una chiamata']], valore: 'chiama' },
      { id: 'n', tipo: 'scelta', eti: 'Temporaneo', opzioni: [[8, '8 byte'], [16, '16 byte'], [24, '24 byte'], [40, '40 byte']], valore: 24 }
    ],
    nota: 'Il numero di passi dipende dalla funzione. La dimensione del temporaneo non riguarda la prima.',
    previsione: {
      domanda: (p) => 'All’ingresso di una funzione RSP vale 0x9FF8. ' + SL.unita275.DESCR[p.t].replace('#n', p.n) + ' Di quanti byte la funzione abbassa RSP?',
      opzioni: (p) => { const N = SL.unita275.riserva(p.n); return Array.from(new Set([0, p.n, N, p.n + 16])).sort((a, b) => a - b).map((v) => [v, v + ' byte']); }
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' byte. La funzione abbassa RSP di ' + esito + ' byte. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.t === 'uno' ? 'La funzione calcola tutto nei registri, senza impiegare la pila.' : p.t === 'foglia' ? 'Una funzione foglia può conservare il temporaneo nella zona rossa, sotto RSP, senza spostarlo.' : 'Occorrono almeno ' + p.n + ' byte, e dopo la sottrazione RSP deve essere un multiplo di 16: il minimo numero adatto è ' + esito + '.'),
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
          righe.push({ a, txt: rit2 ? 'ritorno di altra' : inTemp ? 'temporaneo' : inRis ? 'riservata' : null, nota: rit2 ? 'depositato dalla CALL interna' : inTemp && T === 'foglia' && j === 1 ? 'zona rossa' : inRis && T === 'chiama' && j <= (N - n) / 8 ? 'per l’allineamento' : null, st: rit2 ? 'err' : inTemp && o.cella ? 'att' : null });
        }
        X.pila('s', righe, { x: 300, y: 24, w: 170, passo: 38, rsp: st.rsp }).forEach((e) => els.push(e));
        els.push(el.box('b1', 20, 304, 250, 66, 'RSP', HA(st.rsp), o.rsp ? 'att' : 'on', { cls: 'stretta' }),
          el.box('b2', 290, 304, 270, 66, 'resto di RSP diviso 16', String(st.rsp % 16), o.resto ? 'att' : '', { cls: 'stretta' }),
          el.box('b3', 580, 304, 260, 66, 'RSP si è abbassato di', (0x9FF8 - st.rsp) + ' byte', o.fine ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['RSP', HA(st.rsp), 'a'], ['Resto diviso 16', String(st.rsp % 16)], ['Abbassamento', (0x9FF8 - st.rsp) + ' byte', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ resto: true }, 0, 'All’ingresso', 'La funzione è appena stata chiamata, e RSP vale 0x9FF8. Il chiamante aveva la pila su un multiplo di 16, come prescrive la convenzione, e la CALL ha sottratto 8. Per questa ragione il resto di RSP nella divisione per 16 è 8, come all’ingresso di ogni funzione.',
        { chiedi: { d: T === 'uno' ? 'La funzione deve restituire il proprio argomento aumentato di 1. Richiede memoria sulla pila?' : 'La funzione richiede ' + n + ' byte di memoria per un temporaneo. ' + (T === 'foglia' ? 'È una foglia: deve spostare RSP per ottenerli?' : 'In seguito chiamerà un’altra funzione: può lasciarlo sotto RSP senza spostarlo?'), o: ['Sì', 'No'], g: 1, no: T === 'uno' ? 'L’argomento è in RDI e il risultato va in RAX: è sufficiente un’istruzione che opera sui registri.' : T === 'foglia' ? 'Una foglia può impiegare i 128 byte sotto RSP, la zona rossa, lasciando RSP invariato.' : 'La CALL interna depositerebbe il proprio indirizzo di ritorno sotto RSP, sul temporaneo.' } });
      if (T === 'uno') {
        P({ riga: 0 }, 1, 'Tutto nei registri', 'La funzione calcola con una sola istruzione: LEA somma 1 a RDI e scrive il risultato in EAX. Nessuna variabile richiede memoria, nessun registro va salvato. Il compilatore omette sia il prologo sia l’epilogo.', { calc: 'EAX = RDI + 1' });
        P({ riga: 1, fine: true }, 4, 'Nessun frame', 'RET trova in cima l’indirizzo di ritorno, rimasto nella posizione iniziale. RSP è rimasto invariato per l’intera funzione. Il frame, per questa funzione, si riduce al solo indirizzo di ritorno depositato da CALL.', { calc: 'abbassamento: 0 byte', esito: ['0 byte', 'si'] });
        return { passi, esito: 0 };
      }
      P({ riga: -1 }, 1, 'Un temporaneo da conservare', 'La funzione richiede ' + n + ' byte in memoria per un valore provvisorio. ' + (T === 'foglia' ? 'Nel suo corpo è assente ogni CALL, ed è quindi una foglia. Durante la sua esecuzione nessuna scrittura avviene sotto la sua cima di pila.' : 'Nel corso dell’esecuzione chiama un’altra funzione, e il valore deve essere ancora presente al ritorno.'), { calc: 'temporaneo: ' + n + ' byte' });
      if (T === 'foglia') {
        st.temp = true;
        P({ riga: 0, cella: true }, 2, 'Sotto RSP, senza spostarlo', 'La funzione scrive il temporaneo nelle celle situate sotto RSP, a partire da `[rsp - ' + n + ']`. RSP resta a 0x9FF8. Sono ' + n + ' dei 128 byte della zona rossa.', { calc: '[rsp − ' + n + '] = ' + HA(0x9FF8 - n) });
        P({ riga: 2, cella: true }, 3, 'L’assenza di sovrascritture', 'La funzione è priva di CALL, e nessun indirizzo di ritorno sarà quindi depositato su tali celle. La convenzione garantisce inoltre che neppure il sistema operativo, se interrompe il programma, scriva nei 128 byte sotto RSP. Il temporaneo è riletto invariato.', { calc: 'zona rossa: 128 byte' });
        P({ riga: 3, fine: true }, 4, 'Due istruzioni risparmiate', 'RET trova in cima l’indirizzo di ritorno, poiché RSP è rimasto invariato. La funzione ha impiegato ' + n + ' byte di pila senza eseguire né una sottrazione né una somma su RSP.', { calc: 'abbassamento: 0 byte', esito: ['0 byte', 'si'] });
        return { passi, esito: 0 };
      }
      const o2 = Array.from(new Set([n, N, n + 16])).sort((a, b) => a - b);
      st.rsp = 0x9FF8 - N; st.ris = true;
      P({ riga: 0, rsp: true, resto: true }, 2, N === n ? 'La riserva' : 'Una riserva superiore al necessario', 'La funzione sottrae ' + N + ' a RSP, che scende a ' + HA(st.rsp) + '. ' + (N === n ? 'Sono esattamente i ' + n + ' byte necessari, sufficienti anche per l’allineamento: 8 + ' + n + ' = ' + (8 + n) + ' è un multiplo di 16.' : 'Ne occorrevano ' + n + ', e tuttavia con ' + n + ' RSP sarebbe sceso a ' + HA(0x9FF8 - n) + ', che diviso 16 dà resto 8. Con ' + N + ' si ottiene un multiplo di 16, come la convenzione richiede prima di una CALL. Gli 8 byte aggiuntivi restano inutilizzati.'),
        { calc: '0x9FF8 − ' + N + ' = ' + HA(st.rsp), chiedi: { d: 'La funzione eseguirà ora `call altra`. Dove sarà depositato l’indirizzo di ritorno di tale chiamata?', o: [HA(st.rsp - 8), HA(st.rsp), HA(st.rsp + 8)].sort(), g: [HA(st.rsp - 8), HA(st.rsp), HA(st.rsp + 8)].sort().indexOf(HA(st.rsp - 8)), no: 'CALL sottrae 8 a RSP e scrive nella nuova cima: ' + HA(st.rsp) + ' − 8 = ' + HA(st.rsp - 8) + '.' } });
      st.temp = true;
      P({ riga: 1, cella: true }, 2, 'Il temporaneo protetto', 'Il valore è scritto a partire da `[rsp]`, cioè da ' + HA(st.rsp) + ' in su. Occupa lo spazio riservato dalla funzione, dalla cima della pila verso gli indirizzi più alti.', { calc: '[rsp] = ' + HA(st.rsp) });
      st.chiamata = true;
      P({ riga: 2 }, 3, 'La chiamata interna', 'La CALL trova RSP su un multiplo di 16 e deposita il proprio indirizzo di ritorno a ' + HA(st.rsp - 8) + ', sotto il temporaneo. La funzione chiamata opererà a indirizzi ancora più bassi. Se il temporaneo fosse rimasto sotto RSP, l’indirizzo di ritorno lo avrebbe sovrascritto. Quando la funzione chiamata ritorna, RSP vale di nuovo ' + HA(st.rsp) + '.', { calc: 'indirizzo di ritorno a ' + HA(st.rsp - 8) });
      st.chiamata = false;
      P({ riga: 3, fine: true, cella: true }, 4, 'Il conto', 'Dopo la chiamata la funzione rilegge il temporaneo, invariato. Restano due istruzioni: la somma di ' + N + ' a RSP, che torna a 0x9FF8, e il ritorno. Per conservare ' + n + ' byte ha abbassato RSP di ' + N + ': ' + (N === n ? 'il numero coincide, poiché ' + n + ' più 8 è già un multiplo di 16.' : 'la differenza, 8 byte, è il costo dell’allineamento.'), { calc: 'abbassamento: ' + N + ' byte', esito: [N + ' byte', 'si'] });
      return { passi, esito: mosso };
    }
  },
  bilancio: {
    regola: [
      'Una funzione che conserva tutti i valori nei registri è priva di frame. Una funzione foglia può impiegare la zona rossa, i 128 byte sotto RSP, senza spostarlo.',
      'Una funzione che ne chiama altre deve riservare lo spazio abbassando RSP. Prima di ogni CALL, RSP deve essere un multiplo di 16: all’ingresso vale un multiplo di 16 più 8, e la riserva vale quindi 8, 24, 40 e così via.'
    ],
    errori: [
      ['Impiegare la zona rossa in una funzione che esegue chiamate.', 'La CALL deposita l’indirizzo di ritorno otto byte sotto RSP, dove comincia la zona rossa.'],
      ['Riservare esattamente i byte necessari.', 'Con RSP uguale a 0x9FF8 e 16 byte da conservare, la sottrazione di 16 porta a 0x9FE8, che diviso 16 dà resto 8. Ne vanno sottratti 24.'],
      ['Attendersi un prologo in ogni funzione.', 'Con le ottimizzazioni attive molte funzioni cominciano direttamente dal calcolo, e alcune terminano senza alcun accesso alla pila.']
    ],
    saFare: ['Riconoscere una funzione foglia e indicare dove può conservare i temporanei.', 'Calcolare la riserva che rispetta l’allineamento prima di una CALL.', 'Spiegare perché una funzione compilata può essere priva di frame.'],
    esercizi: [
      { d: 'All’ingresso di una funzione RSP vale 0x7FF8. La funzione deve conservare 32 byte attraverso una chiamata. Qual è il minimo numero di byte da sottrarre a RSP affinché lo spazio sia sufficiente e RSP, prima della CALL, sia un multiplo di 16?', segnaposto: 'Un numero', giuste: ['40', 'quaranta'],
        ok: 'Con 32 byte RSP scenderebbe a 0x7FD8, che diviso 16 dà resto 8. Con 40 scende a 0x7FD0, un multiplo di 16.',
        diagnosi: [
          { se: ['32'], msg: 'Lo spazio è sufficiente, e tuttavia 0x7FF8 − 32 = 0x7FD8, che diviso 16 dà resto 8. La riserva, sommata agli 8 byte della CALL, deve dare un multiplo di 16.' },
          { se: ['48'], msg: 'Con 48 byte RSP scenderebbe a 0x7FC8, che diviso 16 dà resto 8. Il numero cercato è minore.' },
          { se: ['24'], msg: 'L’allineamento sarebbe rispettato, e tuttavia 24 byte sono insufficienti per conservarne 32.' }
        ],
        altro: 'Il numero è diverso. Si cerchi il minimo numero, maggiore o uguale a 32, che sommato a 8 dia un multiplo di 16.',
        indizi: ['All’ingresso RSP è un multiplo di 16 più 8.', 'La riserva più 8 deve essere un multiplo di 16: quindi 8, 24, 40, 56.', 'Il minimo di tali numeri che sia almeno 32.'],
        svolgimento: ['Riserve che rispettano l’allineamento: 8, 24, 40, 56.', 'Occorrono almeno 32 byte.', 'La minima adatta è 40: 0x7FF8 − 0x28 = 0x7FD0.'] },
      { d: 'Una funzione scrive in `[rsp - 16]` senza avere mai spostato RSP. In quale caso ciò è lecito?', guida: 'Si scelga la risposta.', o: [
        { t: 'Quando la funzione è una foglia', ok: true, fb: 'Una foglia può impiegare i 128 byte sotto RSP, la zona rossa. Nessuna CALL li sovrascriverà.' },
        { t: 'Sempre, perché sotto RSP la memoria è libera', fb: 'Se la funzione chiama un’altra funzione, la CALL e la funzione chiamata scrivono sotto RSP.' },
        { t: 'Mai, perché sotto RSP ogni scrittura è un errore', fb: 'La convenzione riserva alle funzioni foglia i 128 byte sotto RSP, e le esonera così dallo spostamento di RSP.' }] }
    ],
    sfida: ['cslez2_7_05_random_assembly_05', 'Allineamento, registri salvati e indirizzo di ritorno']
  }
});
SL.unita275 = {
  // La più piccola riserva, almeno pari a n, che sommata agli 8 byte della CALL dia un multiplo di 16.
  riserva: (n) => { let v = n; while ((v + 8) % 16) v += 8; return v; },
  DESCR: { uno: 'La funzione restituisce il proprio argomento aumentato di 1, con la sola istruzione `lea eax, [rdi + 1]`.', foglia: 'La funzione è priva di chiamate ad altre funzioni e richiede #n byte per un temporaneo.', chiama: 'La funzione deve conservare un temporaneo di #n byte attraverso una chiamata a un’altra funzione.' }
};
