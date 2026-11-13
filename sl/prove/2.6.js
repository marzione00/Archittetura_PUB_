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
        const fb = (x) => (x === '[rsp]' ? 'La cima della pila contiene l’indirizzo di ritorno, posato da CALL.' : x === 'RAX' ? 'RAX porta il risultato della funzione. Gli argomenti viaggiano negli altri registri e sulla pila.' : REG.includes(x) ? 'In ' + x + ' viaggia il ' + ORD[REG.indexOf(x)] + ' argomento.' : /\+ (8|16|24)\]/.test(x) ? 'A questa distanza dalla cima sta il ' + ORD[6 + Number(x.match(/\d+/)[0]) / 8 - 1] + ' argomento.' : 'Le celle della pila sono larghe otto byte: le distanze dalla cima sono multipli di 8.');
        return { u: '2.6.1', d: 'Una funzione riceve nove argomenti interi. Dove trova, al proprio ingresso, il ' + ORD[k - 1] + ' argomento?', guida: 'Scegli la risposta.', o: [{ t: giusta, ok: true, fb: k <= 6 ? 'I primi sei argomenti viaggiano in RDI, RSI, RDX, RCX, R8 e R9.' : 'Dal settimo in poi gli argomenti stanno sulla pila, sopra l’indirizzo di ritorno: il settimo a 8 byte dalla cima, l’ottavo a 16, il nono a 24.' }].concat(altri.map((x) => ({ t: x, fb: fb(x) }))) };
      }
      const rsp = 0x7000 + 0x100 * r.int(0, 14) + 16 * r.int(0, 15), p = r.int(1, 4), giusto = rsp - 8 * (p + 1);
      return { u: '2.6.1', d: 'RSP vale ' + HA(rsp) + '. Il programma esegue ' + p + (p === 1 ? ' istruzione PUSH' : ' istruzioni PUSH') + ' e poi una CALL. Quanto vale RSP all’ingresso della funzione? Rispondi in esadecimale.', segnaposto: 'Per esempio ' + HA(rsp - 8), giuste: ESA(giusto, 4),
        ok: 'Ogni PUSH toglie 8 a RSP, e anche CALL, che posa l’indirizzo di ritorno. In tutto ' + 8 * (p + 1) + ' byte.',
        diagnosi: [
          { se: ESA(rsp - 8 * p, 4), msg: 'Questo è RSP prima della CALL. Anche CALL posa un dato di otto byte, l’indirizzo di ritorno.' },
          { se: ESA(rsp + 8 * (p + 1), 4), msg: 'La pila cresce verso gli indirizzi bassi: ogni dato posato fa diminuire RSP.' },
          { se: ESA(rsp - (p + 1), 4), msg: 'Ogni dato posato occupa otto byte.' }
        ],
        altro: 'Il valore è diverso. Conta i dati posati sulla pila e togli otto byte per ciascuno, in esadecimale.',
        indizi: [p + (p === 1 ? ' PUSH' : ' PUSH') + ' e una CALL posano ' + (p + 1) + ' dati.', (p + 1) + ' dati da otto byte occupano ' + 8 * (p + 1) + ' byte, cioè 0x' + (8 * (p + 1)).toString(16).toUpperCase() + '.', HA(rsp) + ' − 0x' + (8 * (p + 1)).toString(16).toUpperCase() + '.'],
        svolgimento: ['Dati posati: ' + (p + 1) + '.', 'Byte occupati: ' + 8 * (p + 1) + ' = 0x' + (8 * (p + 1)).toString(16).toUpperCase() + '.', 'RSP = ' + HA(rsp) + ' − 0x' + (8 * (p + 1)).toString(16).toUpperCase() + ' = ' + HA(giusto) + '.'] };
    },
    // 2.6.2 · l'indirizzo di ritorno, oppure RSP dentro il frame
    (r) => {
      if (r.int(0, 1) === 0) {
        const a = 0x401000 + r.int(1, 0xEF0);
        return { u: '2.6.2', d: 'Una CALL di 5 byte comincia all’indirizzo ' + HA(a) + '. Quale indirizzo deve trovare RET in cima alla pila? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x401020', giuste: ESA(a + 5, 6),
          ok: 'L’indirizzo di ritorno è quello dell’istruzione che segue la CALL: ' + HA(a) + ' + 5 = ' + HA(a + 5) + '.',
          diagnosi: [
            { se: ESA(a, 6), msg: 'Questo è l’indirizzo della CALL. Tornando lì, il programma la eseguirebbe di nuovo, all’infinito.' },
            { se: ESA(a - 5, 6), msg: 'L’istruzione successiva sta più avanti: i 5 byte della CALL vanno sommati.' },
            { se: ESA(a + 8, 6), msg: 'Otto byte è la larghezza di una cella della pila. Qui conta la lunghezza della CALL, che è di 5 byte.' }
          ],
          altro: 'L’indirizzo è diverso. Somma all’indirizzo della CALL la sua lunghezza, in esadecimale.',
          indizi: ['L’indirizzo di ritorno è l’indirizzo della CALL più la sua lunghezza.', 'La lunghezza è di 5 byte.', 'Attenzione ai riporti fra le cifre esadecimali.'],
          svolgimento: ['Indirizzo della CALL: ' + HA(a) + '. Lunghezza: 5 byte.', HA(a) + ' + 5 = ' + HA(a + 5) + '.', 'RET deve trovare ' + HA(a + 5) + '.'] };
      }
      const rsp = 0x7000 + 0x100 * r.int(1, 14) + 8 + 16 * r.int(0, 15), loc = r.scegli([16, 24, 32, 40, 48]), giusto = rsp - 8 - loc;
      return { u: '2.6.2', d: 'All’ingresso di una funzione RSP vale ' + HA(rsp) + '. La funzione esegue `push rbx` e poi `sub rsp, ' + loc + '`. Quanto vale RSP a questo punto? Rispondi in esadecimale.', segnaposto: 'Per esempio ' + HA(rsp - 8), giuste: ESA(giusto, 4),
        ok: 'PUSH toglie 8 e SUB toglie ' + loc + ': in tutto ' + (8 + loc) + ' byte, cioè 0x' + (8 + loc).toString(16).toUpperCase() + '.',
        diagnosi: [
          { se: ESA(rsp - loc, 4), msg: 'Manca il PUSH, che posa un dato di otto byte e toglie 8 a RSP.' },
          { se: ESA(rsp - 8, 4), msg: 'Questo è RSP dopo il PUSH. L’istruzione SUB toglie altri ' + loc + ' byte.' },
          { se: ESA(rsp + 8 + loc, 4), msg: 'La pila cresce verso gli indirizzi bassi: sia PUSH sia SUB fanno diminuire RSP.' },
          { se: ESA(rsp - parseInt(String(8 + loc), 16), 4), msg: 'I ' + (8 + loc) + ' byte vanno scritti in esadecimale prima di sottrarli.' }
        ],
        altro: 'Il valore è diverso. Togli a RSP gli 8 byte del PUSH e i ' + loc + ' della SUB, in esadecimale.',
        indizi: ['PUSH toglie 8 a RSP.', 'SUB toglie ' + loc + '. In tutto ' + (8 + loc) + ' byte.', (8 + loc) + ' in esadecimale si scrive ' + (8 + loc).toString(16).toUpperCase() + '.'],
        svolgimento: ['Dopo `push rbx`: ' + HA(rsp - 8) + '.', 'Dopo `sub rsp, ' + loc + '`: ' + HA(rsp - 8) + ' − 0x' + loc.toString(16).toUpperCase() + '.', 'RSP = ' + HA(giusto) + '.'] };
    },
    // 2.6.3 · il minore di due byte, con segno oppure senza
    (r) => {
      const jl = r.int(0, 1) === 1; let a = r.int(0x05, 0xFA), b = r.int(0x05, 0xFA), giri = 0;
      // Si preferiscono le coppie su cui i due ordini danno risposte diverse.
      while ((a === b || ((a < 128) === (b < 128) && r.int(0, 2) > 0)) && giri++ < 40) { a = r.int(0x05, 0xFA); b = r.int(0x05, 0xFA); }
      if (a === b) b = a ^ 0x80;
      const sa = a >= 128 ? a - 256 : a, sb = b >= 128 ? b - 256 : b, salta = jl ? sa < sb : a < b, giusto = salta ? a : b, altro = salta ? b : a;
      return { u: '2.6.3', d: 'AL contiene ' + H2(a) + ' e BL contiene ' + H2(b) + '. Quale byte contiene AL dopo `cmp al, bl`, `' + (jl ? 'jl' : 'jb') + ' fine`, `mov al, bl` e, all’etichetta fine, `ret`? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x3C', giuste: ESA(giusto, 2),
        ok: (jl ? 'JL usa l’ordine con segno: AL vale ' + N(sa) + ' e BL vale ' + N(sb) + '. ' : 'JB usa l’ordine senza segno: AL vale ' + a + ' e BL vale ' + b + '. ') + (salta ? 'AL è il minore, il salto parte e AL resta com’è.' : 'AL è il maggiore, il salto resta fermo e MOV copia BL in AL.'),
        diagnosi: [
          { se: ESA(altro, 2), msg: jl ? 'Leggi i due byte con segno: AL vale ' + N(sa) + ' e BL vale ' + N(sb) + '. Il frammento lascia in AL il minore.' : 'Leggi i due byte senza segno: AL vale ' + a + ' e BL vale ' + b + '. Il frammento lascia in AL il minore.' },
          { se: ESA((a - b + 256) % 256, 2), msg: 'Questa è la differenza calcolata da CMP, che viene scartata. In AL finisce uno dei due byte di partenza.' }
        ],
        altro: 'Il byte è diverso. Stabilisci se il salto parte, poi segui il ramo.',
        indizi: [jl ? 'JL salta se AL è minore di BL, letti con segno.' : 'JB salta se AL è inferiore a BL, letti senza segno.', jl ? 'Con segno AL vale ' + N(sa) + ' e BL vale ' + N(sb) + '.' : 'Senza segno AL vale ' + a + ' e BL vale ' + b + '.', salta ? 'Il salto parte, e `mov al, bl` viene scavalcata.' : 'Il salto resta fermo, e `mov al, bl` viene eseguita.'],
        svolgimento: [jl ? 'Lettura con segno: AL = ' + N(sa) + ', BL = ' + N(sb) + '.' : 'Lettura senza segno: AL = ' + a + ', BL = ' + b + '.', salta ? 'AL è il minore: il salto parte.' : 'AL è il maggiore: il salto resta fermo, e MOV copia BL in AL.', 'AL = ' + H2(giusto) + '.'] };
    },
    // 2.6.4 · che cosa lascia un ciclo nell'accumulatore
    (r) => {
      const n = r.int(3, 12);
      if (r.int(0, 1) === 0) {
        const tot = n * (n + 1) / 2;
        return { u: '2.6.4', d: 'Una funzione esegue `xor eax, eax`, poi ripete `add eax, edi`, `dec edi` e `jnz` verso ADD. Entra con EDI = ' + n + '. Quanto vale EAX quando il ciclo termina?', segnaposto: 'Un numero', giuste: I(tot),
          ok: 'Il corpo viene eseguito ' + n + ' volte e somma i valori da ' + n + ' a 1. Il totale è ' + tot + '.',
          diagnosi: [
            { se: I(n), msg: 'Questo è il valore sommato al primo giro. Il ciclo prosegue finché EDI arriva a zero.' },
            { se: I(tot - 1), msg: 'Anche l’ultimo giro, con EDI uguale a 1, esegue la somma prima che DEC porti il contatore a zero.' },
            { se: I(tot - n), msg: 'Manca un termine: il primo giro somma ' + n + ', il valore di EDI all’ingresso.' },
            { se: I(n * n), msg: 'A ogni giro si somma il valore corrente di EDI, che diminuisce di 1 ogni volta.' }
          ],
          altro: 'Il valore è diverso. Compila la tabella dei giri: EAX dopo ADD, EDI dopo DEC.',
          indizi: ['A ogni giro EAX riceve il valore corrente di EDI, poi EDI scende di 1.', 'I valori sommati vanno da ' + n + ' a 1.', 'La somma dei numeri da 1 a ' + n + ' è ' + n + ' × ' + (n + 1) + ' ÷ 2.'],
          svolgimento: ['Giro 1: EAX = ' + n + ', EDI = ' + (n - 1) + '.', 'Giro 2: EAX = ' + (2 * n - 1) + ', EDI = ' + (n - 2) + '.', 'Si prosegue fino a EDI = 0.', 'Totale: ' + n + ' × ' + (n + 1) + ' ÷ 2 = ' + tot + '.'] };
      }
      const k = r.int(2, 9), tot = n * k;
      return { u: '2.6.4', d: 'Una funzione esegue `xor eax, eax`, poi ripete `add eax, ' + k + '`, `dec edi` e `jnz` verso ADD. Entra con EDI = ' + n + '. Quanto vale EAX quando il ciclo termina?', segnaposto: 'Un numero', giuste: I(tot),
        ok: 'Il corpo viene eseguito ' + n + ' volte, e ogni volta somma ' + k + '. Il totale è ' + n + ' × ' + k + ' = ' + tot + '.',
        diagnosi: [
          { se: I(k), msg: 'Questo è il valore dopo il primo giro. Il ciclo prosegue finché EDI arriva a zero.' },
          { se: I((n - 1) * k), msg: 'I giri sono ' + n + ': anche quello con EDI uguale a 1 esegue la somma.' },
          { se: I((n + 1) * k), msg: 'I giri sono ' + n + '. Quando DEC porta EDI a zero, il salto resta fermo.' },
          { se: I(n * (n + 1) / 2), msg: 'In questo ciclo ADD somma ogni volta la costante ' + k + '. Il contatore serve soltanto a contare i giri.' }
        ],
        altro: 'Il valore è diverso. Conta i giri del ciclo e moltiplica per ciò che ogni giro aggiunge.',
        indizi: ['Ogni giro aggiunge ' + k + ' a EAX e toglie 1 a EDI.', 'Il ciclo compie tanti giri quanti ne indica EDI all’ingresso: ' + n + '.', n + ' × ' + k + '.'],
        svolgimento: ['Giri: ' + n + ', con EDI da ' + n + ' a 1.', 'Ogni giro: EAX aumenta di ' + k + '.', 'Totale: ' + n + ' × ' + k + ' = ' + tot + '.'] };
    },
    // 2.6.5 · il valore di AL, oppure il registro di un argomento
    (r) => {
      if (r.int(0, 1) === 0) {
        const i = r.int(0, 3), d = r.int(0, 4), PAROLE = ['nessun', 'un', 'due', 'tre', 'quattro'];
        const elenco = [i === 0 ? null : i === 1 ? 'un intero' : PAROLE[i] + ' interi', d === 0 ? null : d === 1 ? 'un numero di tipo double' : PAROLE[d] + ' numeri di tipo double'].filter(Boolean);
        const diagnosi = [];
        if (i + d !== d) diagnosi.push({ se: I(i + d), msg: 'Questi sono tutti gli argomenti che seguono il formato. AL conta soltanto quelli che viaggiano in un registro XMM.' });
        if (i + d + 1 !== d) diagnosi.push({ se: I(i + d + 1), msg: 'Questi sono tutti gli argomenti. AL conta soltanto quelli che viaggiano in un registro XMM.' });
        if (i !== d) diagnosi.push({ se: I(i), msg: 'Questo è il numero degli interi, che viaggiano nei registri generali. AL conta i registri XMM.' });
        return { u: '2.6.5', d: 'Un programma chiama `printf` con una stringa di formato' + (elenco.length ? ', ' + elenco.join(' e ') : ' e nessun altro argomento') + '. Quale valore deve contenere AL al momento della chiamata?', segnaposto: 'Un numero', giuste: I(d),
          ok: d === 0 ? 'Nessun argomento viaggia in un registro XMM, e AL vale 0.' : 'I numeri di tipo double viaggiano nei registri XMM, uno per registro. I registri XMM usati sono ' + d + '.',
          diagnosi,
          altro: 'Il valore è diverso. Assegna un registro a ogni argomento e conta quelli della serie XMM.',
          indizi: ['Il formato è un indirizzo e viaggia in RDI. Gli interi viaggiano nei registri generali.', 'Ogni double viaggia in un registro XMM.', 'AL contiene il numero di registri XMM usati.'],
          svolgimento: ['Formato e interi: registri generali.', 'Double: ' + (d === 0 ? 'nessuno.' : 'da XMM0 a XMM' + (d - 1) + '.'), 'AL = ' + d + '.'] };
      }
      const tipi = Array.from({ length: 4 }, () => r.scegli(['int', 'double'])), XM = ['XMM0', 'XMM1', 'XMM2', 'XMM3', 'XMM4'];
      let gi = 0, xi = 0; const sedi = tipi.map((t) => (t === 'int' ? REG[gi++] : XM[xi++])), giusta = sedi[3];
      const altri = r.mescola([REG[3], XM[3], tipi[3] === 'int' ? XM[xi] : REG[gi], tipi[3] === 'int' ? REG[gi] : XM[xi], 'RAX'].filter((x, k, a) => x !== giusta && a.indexOf(x) === k)).slice(0, 3);
      return { u: '2.6.5', d: 'Una funzione riceve, nell’ordine, quattro argomenti di tipo ' + tipi.slice(0, 3).join(', ') + ' e ' + tipi[3] + '. In quale registro arriva il quarto?', guida: 'Scegli la risposta.', o: [{ t: giusta, ok: true, fb: 'Le due serie hanno conteggi separati. Gli argomenti arrivano in ' + sedi.join(', ') + '.' }].concat(altri.map((x) => ({ t: x, fb: x === 'RAX' ? 'RAX porta il risultato della funzione.' : x === REG[3] || x === XM[3] ? 'Così le posizioni verrebbero contate insieme. Ogni serie ha il proprio conteggio: gli argomenti arrivano in ' + sedi.join(', ') + '.' : (x.startsWith('XMM')) === (tipi[3] === 'double') ? 'La serie è giusta, ma il conteggio no: gli argomenti arrivano in ' + sedi.join(', ') + '.' : 'Un argomento di tipo ' + tipi[3] + ' viaggia nella serie dei registri ' + (tipi[3] === 'int' ? 'generali.' : 'XMM.') }))) };
    },
    // 2.6.6 · una funzione con due rami
    (r) => {
      const ge = r.int(0, 1) === 1; let x = r.int(-20, 20), y = r.int(-20, 20); if (x === y) y = x - 3;
      const salta = ge ? x >= y : x < y, giusto = salta ? x : y, altro = salta ? y : x;
      return { u: '2.6.6', d: 'Una funzione esegue `mov eax, edi`, `cmp edi, esi`, `' + (ge ? 'jge' : 'jl') + ' fine`, `mov eax, esi` e, all’etichetta fine, `ret`. Entra con EDI = ' + N(x) + ' ed ESI = ' + N(y) + '. Quale valore restituisce?', segnaposto: 'Un numero, con il segno', giuste: I(giusto),
        ok: (ge ? 'JGE salta se EDI è maggiore o uguale a ESI.' : 'JL salta se EDI è minore di ESI.') + ' Qui ' + (salta ? 'il salto parte, e resta in EAX la copia di EDI.' : 'il salto resta fermo, e EAX riceve ESI.') + ' La funzione restituisce il ' + (ge ? 'maggiore' : 'minore') + ' dei due.',
        diagnosi: [
          { se: I(altro), msg: 'Confronta i due numeri con segno: ' + N(x) + ' e ' + N(y) + '. Il salto ' + (salta ? 'parte, e scavalca la seconda MOV.' : 'resta fermo, e la seconda MOV viene eseguita.') },
          { se: I(x - y), msg: 'Questa è la differenza calcolata da CMP, che viene scartata. In EAX finisce uno dei due argomenti.' },
          { se: I(Math.abs(giusto)).filter((s) => !I(giusto).includes(s)), msg: 'La funzione restituisce uno dei due argomenti così com’è, con il suo segno.' }
        ],
        altro: 'Il valore è diverso. Stabilisci se il salto parte, poi segui il ramo.',
        indizi: ['Dopo la prima istruzione EAX contiene ' + N(x) + '.', (ge ? 'JGE salta se ' + N(x) + ' è maggiore o uguale a ' + N(y) + '.' : 'JL salta se ' + N(x) + ' è minore di ' + N(y) + '.'), salta ? 'Il salto parte e scavalca `mov eax, esi`.' : 'Il salto resta fermo, e `mov eax, esi` viene eseguita.'],
        svolgimento: ['`mov eax, edi`: EAX = ' + N(x) + '.', 'Confronto con segno fra ' + N(x) + ' e ' + N(y) + ': ' + (salta ? 'il salto parte.' : 'il salto resta fermo.'), salta ? 'EAX resta ' + N(x) + '.' : '`mov eax, esi`: EAX = ' + N(y) + '.', 'La funzione restituisce ' + N(giusto) + '.'] };
    }
  ] });
})();
