'use strict';
SL.registra('2.6.5', {
  titolo: 'Argomenti aggregati e chiamate variadiche',
  obiettivo: 'Alla fine saprai dire dove viaggia una struttura passata a una funzione e quale valore va scritto in AL prima di chiamare una funzione con un numero variabile di argomenti.',
  concetti: [['virgola', 'I registri XMM'], ['tabella', 'Strutture come argomenti'], ['register', 'Il registro AL']],
  filigrana: ['tabella', 'virgola', 'register'],
  richiami: {
    carte: [
      { sim: 'input', da: 'Dall’unità 2.6.1', t: 'Registri e pila', d: 'I primi sei argomenti interi viaggiano nei registri, da RDI a R9. Ciò che non trova posto va sulla pila.' },
      { sim: 'tabella', da: 'Dall’unità 2.3.4', t: 'Struttura', d: 'Un gruppo di membri di tipo anche diverso. La sua dimensione comprende il riempimento.' },
      { sim: 'virgola', da: 'Dall’unità 1.6.2', t: 'Virgola mobile', d: 'Il formato dei numeri con la virgola. Un numero a precisione doppia, in C un double, occupa 8 byte.' }
    ],
    domanda: { d: 'Prima di proseguire: quanti byte occupa una struttura con due membri di tipo double?', o: [
      { t: '16', ok: true, fb: 'Ogni double occupa 8 byte e comincia a un multiplo di 8. Due membri occupano 16 byte, senza riempimento.' },
      { t: '8', fb: 'Otto byte bastano per un solo double. I membri sono due.' },
      { t: '24', fb: 'Fra due double il riempimento è superfluo, perché il secondo comincia allo spostamento 8, che è già un multiplo di 8.' }
    ] }
  },
  idea: {
    titolo: 'Argomenti che non sono interi',
    termini: ['registro xmm', 'passaggio per valore', 'funzione variadica'],
    testo: [
      'Gli argomenti visti finora erano interi oppure indirizzi. I numeri in virgola mobile del capitolo 1.6 viaggiano in registri a parte, i [[registro xmm|registri XMM]], numerati da XMM0 a XMM7. Le due serie sono indipendenti: il primo argomento in virgola mobile va in XMM0 anche quando è preceduto da tre interi.',
      'Una struttura consegnata a una funzione viene copiata per intero: è il [[passaggio per valore]]. La convenzione decide dove metterla guardandone la dimensione. Fino a 16 byte la struttura viaggia nei registri, divisa in pezzi da otto byte. Un pezzo che contiene interi usa il prossimo registro generale libero, un pezzo che contiene un numero in virgola mobile usa il prossimo registro XMM libero. Oltre i 16 byte la struttura viene copiata sulla pila, tutta quanta.',
      { fig: 'scena', w: 720, h: 130, titolo: 'Due strutture, due strade', nota: 'La dimensione decide fra registri e pila. Dentro i registri, il tipo di ogni pezzo decide la serie.', els: [
        SL.el.box('a', 0, 0, 330, 54, 'struttura di 16 byte', 'long a · double x', 'on', { cls: 'stretta' }), SL.el.box('a1', 390, 0, 150, 54, 'primo pezzo', 'RSI', 'on', { cls: 'stretta' }), SL.el.box('a2', 560, 0, 150, 54, 'secondo pezzo', 'XMM0', 'on', { cls: 'stretta' }),
        SL.el.box('b', 0, 70, 330, 54, 'struttura di 40 byte', 'double x · char s[32]', 'att', { cls: 'stretta' }), SL.el.box('b1', 390, 70, 320, 54, 'tutta quanta', 'sulla pila', 'att', { cls: 'stretta' }),
        SL.el.linea('l1', 330, 27, 390, 27, 'on'), SL.el.linea('l2', 330, 97, 390, 97, 'att')] },
      'Alcune funzioni accettano un numero variabile di argomenti: la più nota è `printf`, che stampa tanti valori quanti ne indica il suo primo argomento. Si chiamano [[funzione variadica|funzioni variadiche]]. Chi le scrive ignora quanti argomenti arriveranno, e di quale tipo.',
      'Per questo la convenzione aggiunge una regola. Prima di chiamare una funzione variadica, il chiamante scrive in AL il numero di registri XMM che ha usato per gli argomenti. La funzione saprà così se deve occuparsi di quei registri oppure può ignorarli.',
      'Per trovare il valore di AL si applicano prima le regole di passaggio, e poi si contano i registri XMM assegnati. Contare i numeri in virgola mobile presenti negli argomenti porterebbe fuori strada: il double di una struttura di 40 byte viaggia sulla pila con il resto, e non occupa alcun registro.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma chiama una funzione variadica con una stringa di formato, il cui indirizzo va in RDI, e una struttura passata per valore. Sceglierai il tipo della struttura, e se aggiungere dopo di essa un argomento di tipo double.',
      'Stabiliremo dove viaggia ogni pezzo della struttura e conteremo i registri XMM usati. Dopo il caso proposto, scegli la struttura di 40 byte e prevedi il nuovo valore di AL.'
    ],
    vedrai: [
      ['tabella', 'La struttura', 'In alto: la struttura scelta, divisa in pezzi da otto byte.'],
      ['register', 'Le due serie di registri', 'Al centro: a sinistra i registri generali, a destra i registri XMM.'],
      ['pila', 'La pila e AL', 'In basso: ciò che finisce sulla pila, e il valore da scrivere in AL.']
    ]
  },
  lab: {
    titolo: 'Dove viaggia una struttura, e che cosa va in AL',
    scena: { w: 860, h: 372 },
    atti: ['La chiamata', 'La dimensione', 'La sede di ogni pezzo', 'L’argomento in più', 'Il registro AL'],
    controlli: [
      { id: 't', tipo: 'scelta', eti: 'Struttura', opzioni: [['dd', 'due double'], ['ll', 'due long'], ['ld', 'un long e un double'], ['big', 'un double e 32 caratteri']], valore: 'dd' },
      { id: 'x', tipo: 'scelta', eti: 'Un double dopo la struttura', opzioni: [['si', 'presente'], ['no', 'assente']], valore: 'si' }
    ],
    nota: 'I tipi long e double occupano 8 byte ciascuno. Il primo argomento, l’indirizzo del formato, occupa sempre RDI.',
    previsione: {
      domanda: (p) => { const U = SL.unita265, T = U.TIPI[p.t]; return 'Una funzione variadica riceve l’indirizzo di una stringa di formato, una struttura `' + T.nome + '` di ' + T.dim + ' byte passata per valore' + (p.x === 'si' ? ' e un argomento di tipo double' : '') + '. Quale valore deve contenere AL al momento della chiamata?'; },
      opzioni: () => [[0, '0'], [1, '1'], [2, '2'], [3, '3']]
    },
    confronto: (pred, esito, p) => { const c = SL.unita265.conto(p); return 'Avevi previsto ' + pred + '. AL deve contenere ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : (c.T.mem ? 'La struttura supera i 16 byte e viaggia sulla pila: non occupa alcun registro XMM.' : 'La struttura occupa ' + c.xmmS.length + (c.xmmS.length === 1 ? ' registro XMM.' : ' registri XMM.')) + (p.x === 'si' ? ' Il double in più ne occupa uno.' : '')); },
    costruisci(p) {
      const el = SL.el, U = SL.unita265, c = U.conto(p), T = c.T, passi = [], EX = p.x === 'si';
      const st = { gp: { RDI: 'formato' }, xmm: {}, pila: null, al: null };
      const quadro = (o) => {
        const els = [el.box('ch', 20, 0, 820, 50, 'la chiamata', 'funzione(formato, s' + (EX ? ', d)' : ')'), o.fase === 0 ? 'att' : '', { cls: 'stretta' }),
          el.box('str', 20, 62, 330, 62, 'la struttura s · ' + T.dim + ' byte', T.breve, o.fase === 1 ? 'att' : 'on', { cls: 'stretta' }),
          el.nota('n1', 20, 138, 'REGISTRI GENERALI', 'mono'), el.nota('n2', 450, 138, 'REGISTRI XMM', 'mono')];
        T.pezzi.forEach((t, k) => els.push(el.box('pz' + k, 362 + k * (T.pezzi.length > 2 ? 96 : 240), 62, T.pezzi.length > 2 ? 90 : 232, 62, 'pezzo ' + (k + 1), t, o.fase === 2 ? 'att' : o.fase > 2 ? 'on' : '', { cls: 'stretta' })));
        ['RDI', 'RSI', 'RDX'].forEach((r, k) => els.push(el.box('g' + k, 20 + k * 140, 162, 130, 58, r, st.gp[r] || '·', (o.nuovi || []).includes(r) ? 'att' : st.gp[r] ? 'on' : '', { cls: 'stretta' })));
        ['XMM0', 'XMM1', 'XMM2'].forEach((r, k) => els.push(el.box('x' + k, 450 + k * 132, 162, 124, 58, r, st.xmm[r] || '·', (o.nuovi || []).includes(r) ? 'att' : st.xmm[r] ? 'on' : '', { cls: 'stretta' })));
        els.push(el.box('pl', 20, 234, 410, 58, 'sulla pila', st.pila || 'nulla', (o.nuovi || []).includes('pila') ? 'att' : st.pila ? 'on' : '', { cls: 'stretta' }),
          el.box('al', 450, 234, 390, 58, 'AL · registri XMM usati', st.al == null ? '·' : String(st.al), o.fase === 4 ? 'att' : '', { cls: 'stretta' }),
          el.box('rg', 20, 306, 820, 58, 'regola applicata', o.regola || '·', o.regola ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Struttura', T.dim + ' byte', 'a'], ['Registri XMM usati', String(Object.keys(st.xmm).length)], ['AL', st.al == null ? '·' : String(st.al), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ fase: 0, nuovi: ['RDI'] }, 0, 'Una chiamata con argomenti di tipo diverso', 'La funzione riceve per primo l’indirizzo della stringa di formato. È un indirizzo, cioè un intero, e occupa RDI come ogni primo argomento. Seguono la struttura s, passata per valore' + (EX ? ', e un numero d di tipo double.' : '.'),
        { chiedi: { d: 'La struttura occupa ' + T.dim + ' byte. Il limite per viaggiare nei registri è di 16 byte. Dove viaggerà?', o: ['Nei registri', 'Sulla pila'], g: T.mem ? 1 : 0, no: T.mem ? 'Con ' + T.dim + ' byte la struttura supera il limite, e viene copiata per intero sulla pila.' : 'Con 16 byte la struttura rientra nel limite, e viaggia nei registri divisa in due pezzi.' } });
      P({ fase: 1, regola: T.mem ? 'oltre 16 byte: sulla pila, per intero' : 'fino a 16 byte: nei registri, a pezzi da otto' }, 1, T.mem ? 'Troppo grande per i registri' : 'Abbastanza piccola per i registri', 'La struttura `' + T.nome + '` occupa ' + T.dim + ' byte. ' + (T.mem ? 'Supera il limite di 16 byte, e la convenzione la manda sulla pila, tutta quanta. Che cosa contenga, a questo punto, è indifferente.' : 'Rientra nel limite di 16 byte, e viaggia nei registri. Va divisa in due pezzi da otto byte, ciascuno dei quali riceve un registro secondo ciò che contiene.'), { calc: T.dim + ' byte' + (T.mem ? ' > 16' : ' ≤ 16') });
      if (T.mem) st.pila = 'la struttura s, 40 byte';
      else { let ig = 0, ix = 0; T.classi.forEach((cl, k) => { if (cl === 'int') st.gp[c.gpS[ig++]] = T.pezzi[k]; else st.xmm[c.xmmS[ix++]] = T.pezzi[k]; }); }
      P({ fase: 2, nuovi: T.mem ? ['pila'] : c.gpS.concat(c.xmmS), regola: T.mem ? 'la struttura intera va in memoria' : 'pezzo intero: registro generale · pezzo in virgola mobile: registro XMM' }, 2, T.mem ? 'Una copia sulla pila' : 'Un registro per ogni pezzo', (T.mem ? 'Il chiamante copia sulla pila i 40 byte della struttura, compreso il double x. Nessun registro viene usato per essa: né generale, né XMM.'
        : T.classi.map((cl, k) => 'Il ' + (k ? 'secondo' : 'primo') + ' pezzo, `' + T.pezzi[k] + '`, ' + (cl === 'int' ? 'contiene un intero e prende il prossimo registro generale libero, ' : 'contiene un numero in virgola mobile e prende il prossimo registro XMM libero, ') + c.sedi[k] + '.').join(' ') + (c.gpS.length ? ' RDI era già occupato dal formato.' : ' I registri generali, dopo RDI, restano liberi.')),
        EX ? { chiedi: { d: 'Dopo la struttura viene il double d. In quale registro viaggerà?', o: ['XMM0', 'XMM1', 'XMM2'], g: ['XMM0', 'XMM1', 'XMM2'].indexOf(c.xmmD), no: 'Il double prende il primo registro XMM ancora libero. ' + (c.xmmS.length ? 'La struttura ne ha occupati ' + c.xmmS.length + ', quindi tocca a ' + c.xmmD + '.' : 'La struttura non ne ha occupato alcuno, quindi tocca a XMM0.') } } : {});
      if (EX) {
        st.xmm[c.xmmD] = 'double d';
        P({ fase: 3, nuovi: [c.xmmD], regola: 'argomento in virgola mobile: primo registro XMM libero' }, 3, 'Il double in più', 'L’argomento d è un numero in virgola mobile e prende il primo registro XMM ancora libero, ' + c.xmmD + '. ' + (T.mem ? 'La struttura, che pure contiene un double, è sulla pila e non ha occupato XMM0.' : c.xmmS.length ? 'I precedenti sono occupati dai pezzi della struttura.' : 'La struttura ha usato soltanto registri generali.'), { calc: 'd → ' + c.xmmD });
      } else {
        P({ fase: 3, regola: 'nessun altro argomento' }, 3, 'Nessun altro argomento', 'Dopo la struttura l’elenco degli argomenti è finito. I registri XMM usati sono quelli assegnati ai pezzi della struttura: ' + (c.xmmS.length ? c.xmmS.join(' e ') + '.' : 'nessuno.'), { calc: 'registri XMM usati: ' + c.al });
      }
      st.al = c.al;
      P({ fase: 4, regola: 'funzione variadica: AL = numero di registri XMM usati' }, 4, 'Il valore di AL', 'La funzione è variadica, e il chiamante deve dichiarare in AL quanti registri XMM ha usato. Sono ' + c.al + (c.al ? ': ' + Object.keys(st.xmm).join(', ') + '.' : ', perché nessun argomento viaggia in un registro XMM.') + ' Subito prima di CALL il chiamante esegue quindi `mov eax, ' + c.al + '`.' + (T.mem ? ' Il double contenuto nella struttura resta fuori dal conto, perché viaggia sulla pila.' : ''), { calc: 'AL = ' + c.al, esito: ['AL = ' + c.al, 'si'] });
      return { passi, esito: c.al };
    }
  },
  bilancio: {
    regola: [
      'Gli argomenti in virgola mobile viaggiano nei registri XMM, da XMM0 a XMM7, in una serie indipendente da quella dei registri generali.',
      'Una struttura fino a 16 byte viaggia nei registri, a pezzi da otto byte. Una più grande viene copiata sulla pila. Prima di chiamare una funzione variadica, AL riceve il numero di registri XMM usati.'
    ],
    errori: [
      ['Contare insieme le due serie di registri.', 'Dopo un intero in RDI, il primo double va in XMM0, e l’intero successivo in RSI.'],
      ['Dividere fra i registri una struttura grande.', 'Oltre i 16 byte la struttura va sulla pila per intero, qualunque cosa contenga.'],
      ['Calcolare AL contando i double degli argomenti.', 'Conta il numero di registri XMM assegnati. Un double dentro una struttura finita sulla pila non ne occupa alcuno.']
    ],
    saFare: ['Assegno i registri ad argomenti interi e in virgola mobile mescolati.', 'Stabilisco se una struttura viaggia nei registri o sulla pila.', 'Calcolo il valore di AL per una chiamata variadica.'],
    esercizi: [
      { d: 'Un programma chiama `printf` con una stringa di formato, un intero e due numeri di tipo double. Quale valore deve contenere AL al momento della chiamata?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: 'I due double viaggiano in XMM0 e XMM1. I registri XMM usati sono 2.',
        diagnosi: [
          { se: ['3'], msg: 'Tre sono gli argomenti che seguono il formato. AL conta soltanto i registri XMM, e l’intero viaggia in un registro generale.' },
          { se: ['4'], msg: 'Quattro sono gli argomenti in tutto. AL conta soltanto quelli che viaggiano in un registro XMM.' },
          { se: ['0'], msg: 'Zero andrebbe bene senza argomenti in virgola mobile. Qui i double sono due.' }
        ],
        altro: 'Il valore è diverso. Assegna un registro a ogni argomento e conta quelli della serie XMM.',
        indizi: ['Il formato è un indirizzo, e viaggia in RDI. L’intero viaggia in RSI.', 'I due double viaggiano in XMM0 e XMM1.', 'AL contiene il numero di registri XMM usati.'],
        svolgimento: ['Formato: RDI. Intero: RSI.', 'Primo double: XMM0. Secondo double: XMM1.', 'Registri XMM usati: 2. Quindi AL = 2.'] },
      { d: 'Una funzione riceve, nell’ordine, un intero, un numero di tipo double e un altro intero. In quali registri arrivano?', guida: 'Scegli la risposta.', o: [
        { t: 'RDI, XMM0, RSI', ok: true, fb: 'Le due serie sono indipendenti. Gli interi prendono RDI e RSI, il double prende il primo registro XMM.' },
        { t: 'RDI, XMM1, RDX', fb: 'Così le posizioni verrebbero contate insieme. Ogni serie ha il proprio conteggio: il primo double va in XMM0, il secondo intero in RSI.' },
        { t: 'RDI, RSI, RDX', fb: 'I registri generali portano interi e indirizzi. Un double viaggia in un registro XMM.' }] }
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
