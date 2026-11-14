'use strict';
SL.registra('2.6.5', {
  titolo: 'Argomenti aggregati e chiamate variadiche',
  obiettivo: 'Obiettivo: indicare come è trasmessa una struttura passata a una funzione e quale valore va scritto in AL prima della chiamata di una funzione con un numero variabile di argomenti.',
  concetti: [['virgola', 'I registri XMM'], ['tabella', 'Strutture come argomenti'], ['register', 'Il registro AL']],
  filigrana: ['tabella', 'virgola', 'register'],
  richiami: {
    carte: [
      { sim: 'input', da: 'Dall’unità 2.6.1', t: 'Registri e pila', d: 'I primi sei argomenti interi sono trasmessi nei registri, da RDI a R9. Gli argomenti in eccesso sono depositati sulla pila.' },
      { sim: 'tabella', da: 'Dall’unità 2.3.4', t: 'Struttura', d: 'Un gruppo di membri di tipo anche diverso. La sua dimensione comprende il riempimento.' },
      { sim: 'virgola', da: 'Dall’unità 1.6.2', t: 'Virgola mobile', d: 'Il formato dei numeri con la virgola. Un numero a precisione doppia, in C un double, occupa 8 byte.' }
    ],
    domanda: { d: 'Prima di proseguire: quanti byte occupa una struttura con due membri di tipo double?', o: [
      { t: '16', ok: true, fb: 'Ogni double occupa 8 byte e comincia a un multiplo di 8. Due membri occupano 16 byte, senza riempimento.' },
      { t: '8', fb: 'Otto byte sono sufficienti per un solo double. I membri sono due.' },
      { t: '24', fb: 'Fra due double il riempimento è superfluo, poiché il secondo comincia allo spostamento 8, che è già un multiplo di 8.' }
    ] }
  },
  idea: {
    titolo: 'Argomenti diversi dagli interi',
    termini: ['registro xmm', 'passaggio per valore', 'funzione variadica'],
    testo: [
      'Gli argomenti esaminati finora erano interi oppure indirizzi. I numeri in virgola mobile del capitolo 1.6 sono trasmessi in registri distinti, i [[registro xmm|registri XMM]], numerati da XMM0 a XMM7. Le due serie sono indipendenti: il primo argomento in virgola mobile va in XMM0 anche quando è preceduto da tre interi.',
      'Una struttura trasmessa a una funzione è copiata per intero: è il [[passaggio per valore]]. La convenzione ne stabilisce la collocazione in base alla dimensione. Fino a 16 byte la struttura è trasmessa nei registri, divisa in blocchi di otto byte. Un blocco che contiene interi impiega il primo registro generale libero, un blocco che contiene un numero in virgola mobile impiega il primo registro XMM libero. Oltre i 16 byte la struttura è copiata per intero sulla pila.',
      { fig: 'scena', w: 720, h: 130, titolo: 'Due strutture, due modalità', nota: 'La dimensione determina la scelta fra registri e pila. Nei registri, il tipo di ogni blocco determina la serie.', els: [
        SL.el.box('a', 0, 0, 330, 54, 'struttura di 16 byte', 'long a · double x', 'on', { cls: 'stretta' }), SL.el.box('a1', 390, 0, 150, 54, 'primo blocco', 'RSI', 'on', { cls: 'stretta' }), SL.el.box('a2', 560, 0, 150, 54, 'secondo blocco', 'XMM0', 'on', { cls: 'stretta' }),
        SL.el.box('b', 0, 70, 330, 54, 'struttura di 40 byte', 'double x · char s[32]', 'att', { cls: 'stretta' }), SL.el.box('b1', 390, 70, 320, 54, 'per intero', 'sulla pila', 'att', { cls: 'stretta' }),
        SL.el.linea('l1', 330, 27, 390, 27, 'on'), SL.el.linea('l2', 330, 97, 390, 97, 'att')] },
      'Alcune funzioni accettano un numero variabile di argomenti: la più nota è `printf`, che stampa tanti valori quanti ne indica il suo primo argomento. Esse prendono il nome di [[funzione variadica|funzioni variadiche]]. All’autore di una tale funzione sono ignoti il numero e il tipo degli argomenti che essa riceverà.',
      'Per questa ragione la convenzione aggiunge una regola. Prima della chiamata di una funzione variadica, il chiamante scrive in AL il numero di registri XMM impiegati per gli argomenti. La funzione stabilisce in tal modo se tali registri vadano considerati oppure ignorati.',
      'Il valore di AL si determina applicando dapprima le regole di passaggio, e contando poi i registri XMM assegnati. Il conteggio dei numeri in virgola mobile presenti negli argomenti condurrebbe a un valore errato: il double di una struttura di 40 byte è trasmesso sulla pila con il resto, senza occupare alcun registro.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma chiama una funzione variadica con una stringa di formato, il cui indirizzo è in RDI, e una struttura passata per valore. I controlli fissano il tipo della struttura, e l’eventuale aggiunta di un argomento di tipo double dopo di essa.',
      'Si stabilisce la collocazione di ogni blocco della struttura e si contano i registri XMM impiegati. Dopo il caso proposto, è istruttivo scegliere la struttura di 40 byte e prevedere il nuovo valore di AL.'
    ],
    vedrai: [
      ['tabella', 'La struttura', 'In alto: la struttura scelta, divisa in blocchi di otto byte.'],
      ['register', 'Le due serie di registri', 'Al centro: a sinistra i registri generali, a destra i registri XMM.'],
      ['pila', 'La pila e AL', 'In basso: ciò che è depositato sulla pila, e il valore da scrivere in AL.']
    ]
  },
  lab: {
    titolo: 'La collocazione di una struttura e il valore di AL',
    scena: { w: 860, h: 372 },
    atti: ['La chiamata', 'La dimensione', 'La collocazione di ogni blocco', 'L’argomento aggiuntivo', 'Il registro AL'],
    controlli: [
      { id: 't', tipo: 'scelta', eti: 'Struttura', opzioni: [['dd', 'due double'], ['ll', 'due long'], ['ld', 'un long e un double'], ['big', 'un double e 32 caratteri']], valore: 'dd' },
      { id: 'x', tipo: 'scelta', eti: 'Un double dopo la struttura', opzioni: [['si', 'presente'], ['no', 'assente']], valore: 'si' }
    ],
    nota: 'I tipi long e double occupano 8 byte ciascuno. Il primo argomento, l’indirizzo del formato, occupa sempre RDI.',
    previsione: {
      domanda: (p) => { const U = SL.unita265, T = U.TIPI[p.t]; return 'Una funzione variadica riceve l’indirizzo di una stringa di formato, una struttura `' + T.nome + '` di ' + T.dim + ' byte passata per valore' + (p.x === 'si' ? ' e un argomento di tipo double' : '') + '. Quale valore deve contenere AL al momento della chiamata?'; },
      opzioni: () => [[0, '0'], [1, '1'], [2, '2'], [3, '3']]
    },
    confronto: (pred, esito, p) => { const c = SL.unita265.conto(p); return 'La previsione indicava ' + pred + '. AL deve contenere ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : (c.T.mem ? 'La struttura supera i 16 byte ed è trasmessa sulla pila, senza occupare alcun registro XMM.' : 'La struttura occupa ' + c.xmmS.length + (c.xmmS.length === 1 ? ' registro XMM.' : ' registri XMM.')) + (p.x === 'si' ? ' Il double aggiuntivo ne occupa uno.' : '')); },
    costruisci(p) {
      const el = SL.el, U = SL.unita265, c = U.conto(p), T = c.T, passi = [], EX = p.x === 'si';
      const st = { gp: { RDI: 'formato' }, xmm: {}, pila: null, al: null };
      const quadro = (o) => {
        const els = [el.box('ch', 20, 0, 820, 50, 'la chiamata', 'funzione(formato, s' + (EX ? ', d)' : ')'), o.fase === 0 ? 'att' : '', { cls: 'stretta' }),
          el.box('str', 20, 62, 330, 62, 'la struttura s · ' + T.dim + ' byte', T.breve, o.fase === 1 ? 'att' : 'on', { cls: 'stretta' }),
          el.nota('n1', 20, 138, 'REGISTRI GENERALI', 'mono'), el.nota('n2', 450, 138, 'REGISTRI XMM', 'mono')];
        T.pezzi.forEach((t, k) => els.push(el.box('pz' + k, 362 + k * (T.pezzi.length > 2 ? 96 : 240), 62, T.pezzi.length > 2 ? 90 : 232, 62, 'blocco ' + (k + 1), t, o.fase === 2 ? 'att' : o.fase > 2 ? 'on' : '', { cls: 'stretta' })));
        ['RDI', 'RSI', 'RDX'].forEach((r, k) => els.push(el.box('g' + k, 20 + k * 140, 162, 130, 58, r, st.gp[r] || '·', (o.nuovi || []).includes(r) ? 'att' : st.gp[r] ? 'on' : '', { cls: 'stretta' })));
        ['XMM0', 'XMM1', 'XMM2'].forEach((r, k) => els.push(el.box('x' + k, 450 + k * 132, 162, 124, 58, r, st.xmm[r] || '·', (o.nuovi || []).includes(r) ? 'att' : st.xmm[r] ? 'on' : '', { cls: 'stretta' })));
        els.push(el.box('pl', 20, 234, 410, 58, 'sulla pila', st.pila || 'nulla', (o.nuovi || []).includes('pila') ? 'att' : st.pila ? 'on' : '', { cls: 'stretta' }),
          el.box('al', 450, 234, 390, 58, 'AL · registri XMM impiegati', st.al == null ? '·' : String(st.al), o.fase === 4 ? 'att' : '', { cls: 'stretta' }),
          el.box('rg', 20, 306, 820, 58, 'regola applicata', o.regola || '·', o.regola ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Struttura', T.dim + ' byte', 'a'], ['Registri XMM impiegati', String(Object.keys(st.xmm).length)], ['AL', st.al == null ? '·' : String(st.al), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ fase: 0, nuovi: ['RDI'] }, 0, 'Una chiamata con argomenti di tipo diverso', 'La funzione riceve per primo l’indirizzo della stringa di formato. È un indirizzo, cioè un intero, e occupa RDI come ogni primo argomento. Seguono la struttura s, passata per valore' + (EX ? ', e un numero d di tipo double.' : '.'),
        { chiedi: { d: 'La struttura occupa ' + T.dim + ' byte. Il limite per la trasmissione nei registri è di 16 byte. Dove sarà collocata?', o: ['Nei registri', 'Sulla pila'], g: T.mem ? 1 : 0, no: T.mem ? 'Con ' + T.dim + ' byte la struttura supera il limite, ed è copiata per intero sulla pila.' : 'Con 16 byte la struttura rientra nel limite, ed è trasmessa nei registri divisa in due blocchi.' } });
      P({ fase: 1, regola: T.mem ? 'oltre 16 byte: sulla pila, per intero' : 'fino a 16 byte: nei registri, a blocchi di otto' }, 1, T.mem ? 'Dimensione eccedente i registri' : 'Dimensione compatibile con i registri', 'La struttura `' + T.nome + '` occupa ' + T.dim + ' byte. ' + (T.mem ? 'Essa supera il limite di 16 byte, e la convenzione la colloca per intero sulla pila. Il suo contenuto, a questo punto, è irrilevante.' : 'Essa rientra nel limite di 16 byte, ed è trasmessa nei registri. Va divisa in due blocchi di otto byte, ciascuno dei quali riceve un registro secondo il proprio contenuto.'), { calc: T.dim + ' byte' + (T.mem ? ' > 16' : ' ≤ 16') });
      if (T.mem) st.pila = 'la struttura s, 40 byte';
      else { let ig = 0, ix = 0; T.classi.forEach((cl, k) => { if (cl === 'int') st.gp[c.gpS[ig++]] = T.pezzi[k]; else st.xmm[c.xmmS[ix++]] = T.pezzi[k]; }); }
      P({ fase: 2, nuovi: T.mem ? ['pila'] : c.gpS.concat(c.xmmS), regola: T.mem ? 'l’intera struttura è in memoria' : 'blocco intero: registro generale · blocco in virgola mobile: registro XMM' }, 2, T.mem ? 'Una copia sulla pila' : 'Un registro per ogni blocco', (T.mem ? 'Il chiamante copia sulla pila i 40 byte della struttura, compreso il double x. Nessun registro è impiegato per essa: né generale, né XMM.'
        : T.classi.map((cl, k) => 'Il ' + (k ? 'secondo' : 'primo') + ' blocco, `' + T.pezzi[k] + '`, ' + (cl === 'int' ? 'contiene un intero e riceve il primo registro generale libero, ' : 'contiene un numero in virgola mobile e riceve il primo registro XMM libero, ') + c.sedi[k] + '.').join(' ') + (c.gpS.length ? ' RDI era già occupato dal formato.' : ' I registri generali, dopo RDI, restano liberi.')),
        EX ? { chiedi: { d: 'Alla struttura segue il double d. In quale registro sarà trasmesso?', o: ['XMM0', 'XMM1', 'XMM2'], g: ['XMM0', 'XMM1', 'XMM2'].indexOf(c.xmmD), no: 'Il double riceve il primo registro XMM ancora libero. ' + (c.xmmS.length ? 'La struttura ne ha occupati ' + c.xmmS.length + ', e il registro è quindi ' + c.xmmD + '.' : 'La struttura ne ha occupati zero, e il registro è quindi XMM0.') } } : {});
      if (EX) {
        st.xmm[c.xmmD] = 'double d';
        P({ fase: 3, nuovi: [c.xmmD], regola: 'argomento in virgola mobile: primo registro XMM libero' }, 3, 'Il double aggiuntivo', 'L’argomento d è un numero in virgola mobile e riceve il primo registro XMM ancora libero, ' + c.xmmD + '. ' + (T.mem ? 'La struttura, che pure contiene un double, è sulla pila e ha lasciato libero XMM0.' : c.xmmS.length ? 'I precedenti sono occupati dai blocchi della struttura.' : 'La struttura ha impiegato soltanto registri generali.'), { calc: 'd → ' + c.xmmD });
      } else {
        P({ fase: 3, regola: 'nessun altro argomento' }, 3, 'Nessun altro argomento', 'Dopo la struttura l’elenco degli argomenti è terminato. I registri XMM impiegati sono quelli assegnati ai blocchi della struttura: ' + (c.xmmS.length ? c.xmmS.join(' e ') + '.' : 'nessuno.'), { calc: 'registri XMM impiegati: ' + c.al });
      }
      st.al = c.al;
      P({ fase: 4, regola: 'funzione variadica: AL = numero di registri XMM impiegati' }, 4, 'Il valore di AL', 'La funzione è variadica, e il chiamante deve dichiarare in AL il numero di registri XMM impiegati. Sono ' + c.al + (c.al ? ': ' + Object.keys(st.xmm).join(', ') + '.' : ', poiché nessun argomento è trasmesso in un registro XMM.') + ' Subito prima di CALL il chiamante esegue quindi `mov eax, ' + c.al + '`.' + (T.mem ? ' Il double contenuto nella struttura è escluso dal conteggio, poiché è trasmesso sulla pila.' : ''), { calc: 'AL = ' + c.al, esito: ['AL = ' + c.al, 'si'] });
      return { passi, esito: c.al };
    }
  },
  bilancio: {
    regola: [
      'Gli argomenti in virgola mobile sono trasmessi nei registri XMM, da XMM0 a XMM7, in una serie indipendente da quella dei registri generali.',
      'Una struttura fino a 16 byte è trasmessa nei registri, a blocchi di otto byte. Una struttura più grande è copiata sulla pila. Prima della chiamata di una funzione variadica, AL riceve il numero di registri XMM impiegati.'
    ],
    errori: [
      ['Contare insieme le due serie di registri.', 'Dopo un intero in RDI, il primo double va in XMM0, e l’intero successivo in RSI.'],
      ['Dividere fra i registri una struttura grande.', 'Oltre i 16 byte la struttura è collocata sulla pila per intero, qualunque ne sia il contenuto.'],
      ['Calcolare AL contando i double degli argomenti.', 'È determinante il numero di registri XMM assegnati. Un double all’interno di una struttura collocata sulla pila ne lascia invariato il conteggio.']
    ],
    saFare: ['Assegnare i registri ad argomenti interi e in virgola mobile alternati.', 'Stabilire se una struttura è trasmessa nei registri o sulla pila.', 'Calcolare il valore di AL per una chiamata variadica.'],
    esercizi: [
      { d: 'Un programma chiama `printf` con una stringa di formato, un intero e due numeri di tipo double. Quale valore deve contenere AL al momento della chiamata?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: 'I due double sono trasmessi in XMM0 e XMM1. I registri XMM impiegati sono 2.',
        diagnosi: [
          { se: ['3'], msg: 'Tre sono gli argomenti che seguono il formato. AL conta soltanto i registri XMM, e l’intero è trasmesso in un registro generale.' },
          { se: ['4'], msg: 'Quattro sono gli argomenti in totale. AL conta soltanto quelli trasmessi in un registro XMM.' },
          { se: ['0'], msg: 'Zero sarebbe corretto in assenza di argomenti in virgola mobile. In questo caso i double sono due.' }
        ],
        altro: 'Il valore è diverso. Si assegni un registro a ogni argomento e si contino quelli della serie XMM.',
        indizi: ['Il formato è un indirizzo, ed è trasmesso in RDI. L’intero è trasmesso in RSI.', 'I due double sono trasmessi in XMM0 e XMM1.', 'AL contiene il numero di registri XMM impiegati.'],
        svolgimento: ['Formato: RDI. Intero: RSI.', 'Primo double: XMM0. Secondo double: XMM1.', 'Registri XMM impiegati: 2. Quindi AL = 2.'] },
      { d: 'Una funzione riceve, nell’ordine, un intero, un numero di tipo double e un altro intero. In quali registri sono ricevuti?', guida: 'Si scelga la risposta.', o: [
        { t: 'RDI, XMM0, RSI', ok: true, fb: 'Le due serie sono indipendenti. Gli interi ricevono RDI e RSI, il double riceve il primo registro XMM.' },
        { t: 'RDI, XMM1, RDX', fb: 'In tal modo le posizioni sarebbero contate insieme. Ogni serie ha il proprio conteggio: il primo double va in XMM0, il secondo intero in RSI.' },
        { t: 'RDI, RSI, RDX', fb: 'I registri generali contengono interi e indirizzi. Un double è trasmesso in un registro XMM.' }] }
    ]
  }
});
/* Le quattro strutture dell'esperimento e la loro sistemazione secondo la convenzione. */
SL.unita265 = (() => {
  const TIPI = {
    dd: { nome: 'struct { double x; double y; }', breve: 'double x · double y', dim: 16, pezzi: ['double x', 'double y'], classi: ['sse', 'sse'] },
    ll: { nome: 'struct { long a; long b; }', breve: 'long a · long b', dim: 16, pezzi: ['long a', 'long b'], classi: ['int', 'int'] },
    ld: { nome: 'struct { long a; double x; }', breve: 'long a · double x', dim: 16, pezzi: ['long a', 'double x'], classi: ['int', 'sse'] },
    big: { nome: 'struct { double x; char s[32]; }', breve: 'double x · char s[32]', dim: 40, pezzi: ['x', 's', 's', 's', 's'], classi: [], mem: true }
  };
  const conto = (p) => {
    const T = TIPI[p.t], GP = ['RSI', 'RDX'], XM = ['XMM0', 'XMM1', 'XMM2'], gpS = [], xmmS = [], sedi = [];
    if (!T.mem) T.classi.forEach((cl) => { if (cl === 'int') { gpS.push(GP[gpS.length]); sedi.push(gpS[gpS.length - 1]); } else { xmmS.push(XM[xmmS.length]); sedi.push(xmmS[xmmS.length - 1]); } });
    const xmmD = p.x === 'si' ? XM[xmmS.length] : null;
    return { T, gpS, xmmS, sedi, xmmD, al: xmmS.length + (xmmD ? 1 : 0) };
  };
  return { TIPI, conto };
})();
