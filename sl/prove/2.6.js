'use strict';
/* Prova del capitolo 2.6: una domanda per unità. */
(() => {
  const I = SL.scritture.intero, ESA = SL.scritture.esa, X = SL.x86, N = X.num;
  const HA = (a) => '0x' + a.toString(16).toUpperCase(), H2 = (v) => '0x' + X.esa2(v);
  const REG = ['RDI', 'RSI', 'RDX', 'RCX', 'R8', 'R9'], ORD = ['primo', 'secondo', 'terzo', 'quarto', 'quinto', 'sesto', 'settimo', 'ottavo', 'nono'];

  SL.registraProva('2.6', { domande: [
    // 2.6.1 · la sede di un argomento, oppure RSP all'ingresso
    (r) => {
      if (r.int(0, 1) === 0) {
        const k = r.scegli([1, 2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9]), sede = (i) => (i <= 6 ? REG[i - 1] : '[rsp + ' + (i - 6) * 8 + ']'), giusta = sede(k);
        const altri = k <= 6 ? r.mescola(REG.filter((x) => x !== giusta).concat(['[rsp + 8]', 'RAX'])).slice(0, 3) : r.mescola(['[rsp]', '[rsp + 8]', '[rsp + 16]', '[rsp + 24]', 'R9', '[rsp + ' + (k - 6) + ']'].filter((x) => x !== giusta)).slice(0, 3);
        const fb = (x) => (x === '[rsp]' ? 'La cima della pila contiene l’indirizzo di ritorno, depositato da CALL.' : x === 'RAX' ? 'RAX contiene il risultato della funzione. Gli argomenti sono trasmessi negli altri registri e sulla pila.' : REG.includes(x) ? 'In ' + x + ' è trasmesso il ' + ORD[REG.indexOf(x)] + ' argomento.' : /\+ (8|16|24)\]/.test(x) ? 'A tale distanza dalla cima si trova il ' + ORD[6 + Number(x.match(/\d+/)[0]) / 8 - 1] + ' argomento.' : 'Le celle della pila sono larghe otto byte: le distanze dalla cima sono multipli di 8.');
        return { u: '2.6.1', d: 'Una funzione riceve nove argomenti interi. Dove trova, al proprio ingresso, il ' + ORD[k - 1] + ' argomento?', guida: 'Si scelga la risposta.', o: [{ t: giusta, ok: true, fb: k <= 6 ? 'I primi sei argomenti sono trasmessi in RDI, RSI, RDX, RCX, R8 e R9.' : 'Dal settimo in poi gli argomenti si trovano sulla pila, sopra l’indirizzo di ritorno: il settimo a 8 byte dalla cima, l’ottavo a 16, il nono a 24.' }].concat(altri.map((x) => ({ t: x, fb: fb(x) }))) };
      }
      const rsp = 0x7000 + 0x100 * r.int(0, 14) + 16 * r.int(0, 15), p = r.int(1, 4), giusto = rsp - 8 * (p + 1);
      return { u: '2.6.1', d: 'RSP vale ' + HA(rsp) + '. Il programma esegue ' + p + (p === 1 ? ' istruzione PUSH' : ' istruzioni PUSH') + ' e poi una CALL. Quanto vale RSP all’ingresso della funzione? Si risponda in esadecimale.', segnaposto: 'Per esempio ' + HA(rsp - 8), giuste: ESA(giusto, 4),
        ok: 'Ogni PUSH sottrae 8 a RSP, e così anche CALL, che deposita l’indirizzo di ritorno. Il totale è di ' + 8 * (p + 1) + ' byte.',
        diagnosi: [
          { se: ESA(rsp - 8 * p, 4), msg: 'Il valore indicato è RSP prima della CALL. Anche CALL deposita un dato di otto byte, l’indirizzo di ritorno.' },
          { se: ESA(rsp + 8 * (p + 1), 4), msg: 'La pila cresce verso gli indirizzi bassi: ogni dato depositato fa diminuire RSP.' },
          { se: ESA(rsp - (p + 1), 4), msg: 'Ogni dato depositato occupa otto byte.' }
        ],
        altro: 'Il valore è diverso. Si contino i dati depositati sulla pila e si sottraggano otto byte per ciascuno, in esadecimale.',
        indizi: [p + (p === 1 ? ' PUSH' : ' PUSH') + ' e una CALL depositano ' + (p + 1) + ' dati.', (p + 1) + ' dati da otto byte occupano ' + 8 * (p + 1) + ' byte, cioè 0x' + (8 * (p + 1)).toString(16).toUpperCase() + '.', HA(rsp) + ' − 0x' + (8 * (p + 1)).toString(16).toUpperCase() + '.'],
        svolgimento: ['Dati depositati: ' + (p + 1) + '.', 'Byte occupati: ' + 8 * (p + 1) + ' = 0x' + (8 * (p + 1)).toString(16).toUpperCase() + '.', 'RSP = ' + HA(rsp) + ' − 0x' + (8 * (p + 1)).toString(16).toUpperCase() + ' = ' + HA(giusto) + '.'] };
    },
    // 2.6.2 · l'indirizzo di ritorno, oppure RSP dentro il frame
    (r) => {
      if (r.int(0, 1) === 0) {
        const a = 0x401000 + r.int(1, 0xEF0);
        return { u: '2.6.2', d: 'Una CALL di 5 byte comincia all’indirizzo ' + HA(a) + '. Quale indirizzo deve trovare RET in cima alla pila? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x401020', giuste: ESA(a + 5, 6),
          ok: 'L’indirizzo di ritorno è quello dell’istruzione che segue la CALL: ' + HA(a) + ' + 5 = ' + HA(a + 5) + '.',
          diagnosi: [
            { se: ESA(a, 6), msg: 'Il valore indicato è l’indirizzo della CALL. Con un ritorno a tale indirizzo il programma la eseguirebbe di nuovo, senza termine.' },
            { se: ESA(a - 5, 6), msg: 'L’istruzione successiva si trova più avanti: i 5 byte della CALL vanno sommati.' },
            { se: ESA(a + 8, 6), msg: 'Otto byte è la larghezza di una cella della pila. In questo caso è rilevante la lunghezza della CALL, che è di 5 byte.' }
          ],
          altro: 'L’indirizzo è diverso. Si sommi all’indirizzo della CALL la sua lunghezza, in esadecimale.',
          indizi: ['L’indirizzo di ritorno è l’indirizzo della CALL più la sua lunghezza.', 'La lunghezza è di 5 byte.', 'Vanno considerati i riporti fra le cifre esadecimali.'],
          svolgimento: ['Indirizzo della CALL: ' + HA(a) + '. Lunghezza: 5 byte.', HA(a) + ' + 5 = ' + HA(a + 5) + '.', 'RET deve trovare ' + HA(a + 5) + '.'] };
      }
      const rsp = 0x7000 + 0x100 * r.int(1, 14) + 8 + 16 * r.int(0, 15), loc = r.scegli([16, 24, 32, 40, 48]), giusto = rsp - 8 - loc;
      return { u: '2.6.2', d: 'All’ingresso di una funzione RSP vale ' + HA(rsp) + '. La funzione esegue `push rbx` e poi `sub rsp, ' + loc + '`. Quanto vale RSP a questo punto? Si risponda in esadecimale.', segnaposto: 'Per esempio ' + HA(rsp - 8), giuste: ESA(giusto, 4),
        ok: 'PUSH sottrae 8 e SUB sottrae ' + loc + ': in totale ' + (8 + loc) + ' byte, cioè 0x' + (8 + loc).toString(16).toUpperCase() + '.',
        diagnosi: [
          { se: ESA(rsp - loc, 4), msg: 'Manca il PUSH, che deposita un dato di otto byte e sottrae 8 a RSP.' },
          { se: ESA(rsp - 8, 4), msg: 'Il valore indicato è RSP dopo il PUSH. L’istruzione SUB sottrae altri ' + loc + ' byte.' },
          { se: ESA(rsp + 8 + loc, 4), msg: 'La pila cresce verso gli indirizzi bassi: sia PUSH sia SUB fanno diminuire RSP.' },
          { se: ESA(rsp - parseInt(String(8 + loc), 16), 4), msg: 'I ' + (8 + loc) + ' byte vanno scritti in esadecimale prima della sottrazione.' }
        ],
        altro: 'Il valore è diverso. Si sottraggano a RSP gli 8 byte del PUSH e i ' + loc + ' della SUB, in esadecimale.',
        indizi: ['PUSH sottrae 8 a RSP.', 'SUB sottrae ' + loc + '. Il totale è di ' + (8 + loc) + ' byte.', (8 + loc) + ' in esadecimale si scrive ' + (8 + loc).toString(16).toUpperCase() + '.'],
        svolgimento: ['Dopo `push rbx`: ' + HA(rsp - 8) + '.', 'Dopo `sub rsp, ' + loc + '`: ' + HA(rsp - 8) + ' − 0x' + loc.toString(16).toUpperCase() + '.', 'RSP = ' + HA(giusto) + '.'] };
    },
    // 2.6.3 · il minore di due byte, con segno oppure senza
    (r) => {
      const jl = r.int(0, 1) === 1; let a = r.int(0x05, 0xFA), b = r.int(0x05, 0xFA), giri = 0;
      // Si preferiscono le coppie su cui i due ordini danno risposte diverse.
      while ((a === b || ((a < 128) === (b < 128) && r.int(0, 2) > 0)) && giri++ < 40) { a = r.int(0x05, 0xFA); b = r.int(0x05, 0xFA); }
      if (a === b) b = a ^ 0x80;
      const sa = a >= 128 ? a - 256 : a, sb = b >= 128 ? b - 256 : b, salta = jl ? sa < sb : a < b, giusto = salta ? a : b, altro = salta ? b : a;
      return { u: '2.6.3', d: 'AL contiene ' + H2(a) + ' e BL contiene ' + H2(b) + '. Quale byte contiene AL dopo `cmp al, bl`, `' + (jl ? 'jl' : 'jb') + ' fine`, `mov al, bl` e, all’etichetta fine, `ret`? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x3C', giuste: ESA(giusto, 2),
        ok: (jl ? 'JL impiega l’ordine con segno: AL vale ' + N(sa) + ' e BL vale ' + N(sb) + '. ' : 'JB impiega l’ordine senza segno: AL vale ' + a + ' e BL vale ' + b + '. ') + (salta ? 'AL è il minore, il salto avviene e AL resta invariato.' : 'AL è il maggiore, il salto è escluso e MOV copia BL in AL.'),
        diagnosi: [
          { se: ESA(altro, 2), msg: jl ? 'I due byte vanno letti con segno: AL vale ' + N(sa) + ' e BL vale ' + N(sb) + '. Il frammento lascia in AL il minore.' : 'I due byte vanno letti senza segno: AL vale ' + a + ' e BL vale ' + b + '. Il frammento lascia in AL il minore.' },
          { se: ESA((a - b + 256) % 256, 2), msg: 'Il valore indicato è la differenza calcolata da CMP, che è scartata. In AL resta uno dei due byte di partenza.' }
        ],
        altro: 'Il byte è diverso. Si stabilisca se il salto avviene, e si segua poi il ramo.',
        indizi: [jl ? 'JL salta se AL è minore di BL, letti con segno.' : 'JB salta se AL è inferiore a BL, letti senza segno.', jl ? 'Con segno AL vale ' + N(sa) + ' e BL vale ' + N(sb) + '.' : 'Senza segno AL vale ' + a + ' e BL vale ' + b + '.', salta ? 'Il salto avviene, e `mov al, bl` è omessa.' : 'Il salto è escluso, e `mov al, bl` è eseguita.'],
        svolgimento: [jl ? 'Lettura con segno: AL = ' + N(sa) + ', BL = ' + N(sb) + '.' : 'Lettura senza segno: AL = ' + a + ', BL = ' + b + '.', salta ? 'AL è il minore: il salto avviene.' : 'AL è il maggiore: il salto è escluso, e MOV copia BL in AL.', 'AL = ' + H2(giusto) + '.'] };
    },
    // 2.6.4 · che cosa lascia un ciclo nell'accumulatore
    (r) => {
      const n = r.int(3, 12);
      if (r.int(0, 1) === 0) {
        const tot = n * (n + 1) / 2;
        return { u: '2.6.4', d: 'Una funzione esegue `xor eax, eax`, poi ripete `add eax, edi`, `dec edi` e `jnz` verso ADD. Entra con EDI = ' + n + '. Quanto vale EAX quando il ciclo termina?', segnaposto: 'Un numero', giuste: I(tot),
          ok: 'Il corpo è eseguito ' + n + ' volte e somma i valori da ' + n + ' a 1. Il totale è ' + tot + '.',
          diagnosi: [
            { se: I(n), msg: 'Il valore indicato è quello sommato alla prima iterazione. Il ciclo prosegue finché EDI raggiunge zero.' },
            { se: I(tot - 1), msg: 'Anche l’ultima iterazione, con EDI uguale a 1, esegue la somma prima che DEC porti il contatore a zero.' },
            { se: I(tot - n), msg: 'Manca un termine: la prima iterazione somma ' + n + ', il valore di EDI all’ingresso.' },
            { se: I(n * n), msg: 'A ogni iterazione si somma il valore corrente di EDI, che diminuisce di 1 ogni volta.' }
          ],
          altro: 'Il valore è diverso. Si compili la tabella delle iterazioni: EAX dopo ADD, EDI dopo DEC.',
          indizi: ['A ogni iterazione EAX riceve il valore corrente di EDI, poi EDI scende di 1.', 'I valori sommati vanno da ' + n + ' a 1.', 'La somma dei numeri da 1 a ' + n + ' è ' + n + ' × ' + (n + 1) + ' ÷ 2.'],
          svolgimento: ['Iterazione 1: EAX = ' + n + ', EDI = ' + (n - 1) + '.', 'Iterazione 2: EAX = ' + (2 * n - 1) + ', EDI = ' + (n - 2) + '.', 'Si prosegue fino a EDI = 0.', 'Totale: ' + n + ' × ' + (n + 1) + ' ÷ 2 = ' + tot + '.'] };
      }
      const k = r.int(2, 9), tot = n * k;
      return { u: '2.6.4', d: 'Una funzione esegue `xor eax, eax`, poi ripete `add eax, ' + k + '`, `dec edi` e `jnz` verso ADD. Entra con EDI = ' + n + '. Quanto vale EAX quando il ciclo termina?', segnaposto: 'Un numero', giuste: I(tot),
        ok: 'Il corpo è eseguito ' + n + ' volte, e ogni volta somma ' + k + '. Il totale è ' + n + ' × ' + k + ' = ' + tot + '.',
        diagnosi: [
          { se: I(k), msg: 'Il valore indicato è quello successivo alla prima iterazione. Il ciclo prosegue finché EDI raggiunge zero.' },
          { se: I((n - 1) * k), msg: 'Le iterazioni sono ' + n + ': anche quella con EDI uguale a 1 esegue la somma.' },
          { se: I((n + 1) * k), msg: 'Le iterazioni sono ' + n + '. Quando DEC porta EDI a zero, il salto è escluso.' },
          { se: I(n * (n + 1) / 2), msg: 'In questo ciclo ADD somma ogni volta la costante ' + k + '. Il contatore ha la sola funzione di contare le iterazioni.' }
        ],
        altro: 'Il valore è diverso. Si contino le iterazioni del ciclo e si moltiplichi per il valore aggiunto da ciascuna.',
        indizi: ['Ogni iterazione aggiunge ' + k + ' a EAX e sottrae 1 a EDI.', 'Il ciclo compie tante iterazioni quante ne indica EDI all’ingresso: ' + n + '.', n + ' × ' + k + '.'],
        svolgimento: ['Iterazioni: ' + n + ', con EDI da ' + n + ' a 1.', 'Ogni iterazione: EAX aumenta di ' + k + '.', 'Totale: ' + n + ' × ' + k + ' = ' + tot + '.'] };
    },
    // 2.6.5 · il valore di AL, oppure il registro di un argomento
    (r) => {
      if (r.int(0, 1) === 0) {
        const i = r.int(0, 3), d = r.int(0, 4), PAROLE = ['nessun', 'un', 'due', 'tre', 'quattro'];
        const elenco = [i === 0 ? null : i === 1 ? 'un intero' : PAROLE[i] + ' interi', d === 0 ? null : d === 1 ? 'un numero di tipo double' : PAROLE[d] + ' numeri di tipo double'].filter(Boolean);
        const diagnosi = [];
        if (i + d !== d) diagnosi.push({ se: I(i + d), msg: 'Il valore indicato è il numero di tutti gli argomenti che seguono il formato. AL conta soltanto quelli trasmessi in un registro XMM.' });
        if (i + d + 1 !== d) diagnosi.push({ se: I(i + d + 1), msg: 'Il valore indicato è il numero di tutti gli argomenti. AL conta soltanto quelli trasmessi in un registro XMM.' });
        if (i !== d) diagnosi.push({ se: I(i), msg: 'Il valore indicato è il numero degli interi, trasmessi nei registri generali. AL conta i registri XMM.' });
        return { u: '2.6.5', d: 'Un programma chiama `printf` con una stringa di formato' + (elenco.length ? ', ' + elenco.join(' e ') : ' e nessun altro argomento') + '. Quale valore deve contenere AL al momento della chiamata?', segnaposto: 'Un numero', giuste: I(d),
          ok: d === 0 ? 'Nessun argomento è trasmesso in un registro XMM, e AL vale 0.' : 'I numeri di tipo double sono trasmessi nei registri XMM, uno per registro. I registri XMM impiegati sono ' + d + '.',
          diagnosi,
          altro: 'Il valore è diverso. Si assegni un registro a ogni argomento e si contino quelli della serie XMM.',
          indizi: ['Il formato è un indirizzo ed è trasmesso in RDI. Gli interi sono trasmessi nei registri generali.', 'Ogni double è trasmesso in un registro XMM.', 'AL contiene il numero di registri XMM impiegati.'],
          svolgimento: ['Formato e interi: registri generali.', 'Double: ' + (d === 0 ? 'nessuno.' : 'da XMM0 a XMM' + (d - 1) + '.'), 'AL = ' + d + '.'] };
      }
      const tipi = Array.from({ length: 4 }, () => r.scegli(['int', 'double'])), XM = ['XMM0', 'XMM1', 'XMM2', 'XMM3', 'XMM4'];
      let gi = 0, xi = 0; const sedi = tipi.map((t) => (t === 'int' ? REG[gi++] : XM[xi++])), giusta = sedi[3];
      const altri = r.mescola([REG[3], XM[3], tipi[3] === 'int' ? XM[xi] : REG[gi], tipi[3] === 'int' ? REG[gi] : XM[xi], 'RAX'].filter((x, k, a) => x !== giusta && a.indexOf(x) === k)).slice(0, 3);
      return { u: '2.6.5', d: 'Una funzione riceve, nell’ordine, quattro argomenti di tipo ' + tipi.slice(0, 3).join(', ') + ' e ' + tipi[3] + '. In quale registro è ricevuto il quarto?', guida: 'Si scelga la risposta.', o: [{ t: giusta, ok: true, fb: 'Le due serie hanno conteggi separati. Gli argomenti sono ricevuti in ' + sedi.join(', ') + '.' }].concat(altri.map((x) => ({ t: x, fb: x === 'RAX' ? 'RAX contiene il risultato della funzione.' : x === REG[3] || x === XM[3] ? 'In tal modo le posizioni sarebbero contate insieme. Ogni serie ha il proprio conteggio: gli argomenti sono ricevuti in ' + sedi.join(', ') + '.' : (x.startsWith('XMM')) === (tipi[3] === 'double') ? 'La serie è corretta, il conteggio è errato: gli argomenti sono ricevuti in ' + sedi.join(', ') + '.' : 'Un argomento di tipo ' + tipi[3] + ' è trasmesso nella serie dei registri ' + (tipi[3] === 'int' ? 'generali.' : 'XMM.') }))) };
    },
    // 2.6.6 · una funzione con due rami
    (r) => {
      const ge = r.int(0, 1) === 1; let x = r.int(-20, 20), y = r.int(-20, 20); if (x === y) y = x - 3;
      const salta = ge ? x >= y : x < y, giusto = salta ? x : y, altro = salta ? y : x;
      return { u: '2.6.6', d: 'Una funzione esegue `mov eax, edi`, `cmp edi, esi`, `' + (ge ? 'jge' : 'jl') + ' fine`, `mov eax, esi` e, all’etichetta fine, `ret`. Entra con EDI = ' + N(x) + ' ed ESI = ' + N(y) + '. Quale valore restituisce?', segnaposto: 'Un numero, con il segno', giuste: I(giusto),
        ok: (ge ? 'JGE salta se EDI è maggiore o uguale a ESI.' : 'JL salta se EDI è minore di ESI.') + ' In questo caso ' + (salta ? 'il salto avviene, e resta in EAX la copia di EDI.' : 'il salto è escluso, ed EAX riceve ESI.') + ' La funzione restituisce il ' + (ge ? 'maggiore' : 'minore') + ' dei due.',
        diagnosi: [
          { se: I(altro), msg: 'I due numeri vanno confrontati con segno: ' + N(x) + ' e ' + N(y) + '. Il salto ' + (salta ? 'avviene, e oltrepassa la seconda MOV.' : 'è escluso, e la seconda MOV è eseguita.') },
          { se: I(x - y), msg: 'Il valore indicato è la differenza calcolata da CMP, che è scartata. In EAX resta uno dei due argomenti.' },
          { se: I(Math.abs(giusto)).filter((s) => !I(giusto).includes(s)), msg: 'La funzione restituisce uno dei due argomenti invariato, con il proprio segno.' }
        ],
        altro: 'Il valore è diverso. Si stabilisca se il salto avviene, e si segua poi il ramo.',
        indizi: ['Dopo la prima istruzione EAX contiene ' + N(x) + '.', (ge ? 'JGE salta se ' + N(x) + ' è maggiore o uguale a ' + N(y) + '.' : 'JL salta se ' + N(x) + ' è minore di ' + N(y) + '.'), salta ? 'Il salto avviene e oltrepassa `mov eax, esi`.' : 'Il salto è escluso, e `mov eax, esi` è eseguita.'],
        svolgimento: ['`mov eax, edi`: EAX = ' + N(x) + '.', 'Confronto con segno fra ' + N(x) + ' e ' + N(y) + ': ' + (salta ? 'il salto avviene.' : 'il salto è escluso.'), salta ? 'EAX resta ' + N(x) + '.' : '`mov eax, esi`: EAX = ' + N(y) + '.', 'La funzione restituisce ' + N(giusto) + '.'] };
    }
  ] });
})();
