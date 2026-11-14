'use strict';
/* Prova del capitolo 3.6: una domanda per unità. */
(() => {
  const I = SL.scritture.intero, ESA = SL.scritture.esa, H = SL.y86.esa;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const PS = (v) => I(v).concat(I(v).map((x) => x + 'ps'));
  // le scritture accettate di un valore arrotondato al millesimo: 1.273, 1.27, 1.272 · 1.250, 1.25 · 2.000, 2.00, 2.0, 2
  const DEC3 = (x) => { const out = [x.toFixed(3)]; let s = out[0]; while (s.endsWith('0')) { s = s.slice(0, -1); if (s.endsWith('.')) { s = s.slice(0, -1); out.push(s); break; } out.push(s); } [x.toFixed(2), (Math.floor(x * 1000 + 1e-9) / 1000).toFixed(3)].forEach((v) => { if (!out.includes(v)) out.push(v); }); return out; };
  const V3 = (x) => x.toFixed(3).replace('.', ',');
  const STADI = ['F', 'D', 'E', 'M', 'W'], REG = ['rax', 'rcx', 'rdx', 'rbx', 'rsi', 'rdi'];

  SL.registraProva('3.6', { domande: [
    // 3.6.1 · il contenuto di un registro dopo il fronte
    (r) => {
      const n = r.int(5, 9), j = r.int(1, 4), c = r.int(Math.max(3, j), n), a = c + 1 - j, giuste = [String(a), 'i' + a];
      return { u: '3.6.1', d: 'Un flusso di ' + n + ' istruzioni indipendenti entra in PIPE, una per ciclo dal ciclo 1. Quale istruzione contiene il registro ' + STADI[j] + ' immediatamente dopo il fronte che chiude il ciclo ' + c + '? Si risponda con il suo numero.', segnaposto: 'Un numero', giuste,
        ok: 'Durante il ciclo ' + c + ' l’istruzione I' + a + ' occupa lo stadio ' + STADI[j - 1] + '. Al fronte avanza di una posizione, nel registro ' + STADI[j] + '.',
        diagnosi: DIAG(giuste, [
          a - 1 >= 1 ? { se: [String(a - 1), 'i' + (a - 1)], msg: 'I' + (a - 1) + ' occupa lo stadio ' + STADI[j] + ' prima del fronte. Al fronte avanza di una posizione, e lascia il registro alla successiva.' } : null,
          { se: [String(a + 1), 'i' + (a + 1)], msg: 'Ogni istruzione avanza di una sola posizione per fronte.' },
          { se: [String(c), 'i' + c], msg: 'I' + c + ' durante il ciclo ' + c + ' è nello stadio F, e al fronte passa in D.' }
        ]),
        altro: 'Il numero è diverso. Si determini l’istruzione che durante il ciclo ' + c + ' occupa lo stadio ' + STADI[j - 1] + ': al fronte passa nel registro ' + STADI[j] + '.',
        indizi: ['Durante il ciclo ' + c + ' lo stadio F ospita I' + c + '.', 'Lo stadio ' + STADI[j - 1] + ' si trova ' + (j - 1 === 0 ? 'all’inizio' : j - 1 === 1 ? 'una posizione dopo F' : (j - 1) + ' posizioni dopo F') + ', e ospita I' + a + '.', 'Al fronte I' + a + ' passa nel registro ' + STADI[j] + '.'],
        svolgimento: ['Ciclo ' + c + ': lo stadio ' + STADI[j - 1] + ' ospita I' + a + '.', 'Al fronte ogni istruzione avanza di una posizione.', 'Dopo il fronte il registro ' + STADI[j] + ' contiene I' + a + '.'] };
    },
    // 3.6.2 · il selettore del prelievo, oppure il PC previsto
    (r) => {
      if (r.int(0, 1) === 0) {
        // caso 0: nessuna correzione · 1: salto previsto male in M · 2: salto previsto bene in M · 3: ret in W, con una bolla in M
        const caso = r.int(0, 3), ind = r.mescola([0x40, 0x68, 0x9C, 0x110, 0x1B4, 0x230, 0x2F8, 0x354]), p = ind[0], m = ind[1], w = ind[2], salto = r.scegli(['jne', 'je', 'jg']);
        const v = caso === 1 ? m : caso === 3 ? w : p, giuste = ESA(v, 3), fonte = caso === 1 ? 'M_valA' : caso === 3 ? 'W_valM' : 'F_predPC';
        const tM = caso === 0 ? 'una `' + r.scegli(['addq', 'rrmovq', 'subq']) + '`, con M_valA = ' + H(m) : caso === 3 ? 'una bolla' : 'uno `' + salto + '` per il quale era previsto il salto, con la condizione risultata ' + (caso === 1 ? 'falsa' : 'vera') + ' e M_valA = ' + H(m);
        const tW = (caso === 3 ? 'una `ret`' : 'una `' + r.scegli(['mrmovq', 'popq']) + '`') + ', con W_valM = ' + H(w);
        return { u: '3.6.2', d: 'Il registro F contiene F_predPC = ' + H(p) + '. Nello stadio M è presente ' + tM + '. Nello stadio W è presente ' + tW + '. Quanto vale f_pc? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste,
          ok: caso === 1 ? 'Un salto con previsione errata nello stadio M ha la precedenza: è selezionato M_valA.' : caso === 3 ? 'Nello stadio M manca un salto da correggere, e nello stadio W è presente una ret: è selezionato W_valM.' : caso === 2 ? 'La previsione del salto era corretta, e nello stadio W manca una ret: è selezionato il PC previsto.' : 'Mancano entrambe le richieste di correzione, ed è selezionato il PC previsto.',
          diagnosi: DIAG(giuste, [
            { se: ESA(p, 3), msg: 'Il PC previsto è selezionato soltanto quando mancano sia il salto da correggere sia la ret.' },
            caso === 3 ? null : { se: ESA(m, 3), msg: caso === 2 ? 'La previsione del salto nello stadio M era corretta, quindi nessuna correzione è necessaria.' : 'M_valA è rilevante soltanto quando nello stadio M è presente un salto con previsione errata.' },
            { se: ESA(w, 3), msg: caso === 1 ? 'Nello stadio W manca una ret, e in ogni caso la correzione del salto ha la precedenza.' : 'W_valM è rilevante soltanto quando nello stadio W è presente una ret.' }
          ]),
          altro: 'Il valore è diverso. Si esaminino le verifiche nell’ordine: prima il salto nello stadio M, poi la ret nello stadio W.',
          indizi: ['Previsione errata nello stadio M: ' + (caso === 1 ? 'sì' : 'no') + '.', 'ret nello stadio W: ' + (caso === 3 ? 'sì' : 'no') + '.', 'Passa ' + fonte + '.'],
          svolgimento: ['Prima verifica, previsione errata in M: ' + (caso === 1 ? 'sì' : 'no') + '.', caso === 1 ? 'La seconda verifica è superflua.' : 'Seconda verifica, ret in W: ' + (caso === 3 ? 'sì' : 'no') + '.', 'f_pc = ' + fonte + ' = ' + H(v) + '.'] };
      }
      const b = 0x20 + 8 * r.int(0, 60), t = 0x200 + 16 * r.int(1, 40), ra = r.scegli(REG), rb = r.scegli(REG.filter((x) => x !== ra));
      const c = r.scegli([['call ' + H(t), 9, 1], ['jmp ' + H(t), 9, 1], ['jne ' + H(t), 9, 1], ['jle ' + H(t), 9, 1], ['addq %' + ra + ', %' + rb, 2, 0], ['irmovq $' + r.int(1, 90) + ', %' + ra, 10, 0], ['rrmovq %' + ra + ', %' + rb, 2, 0], ['nop', 1, 0], ['pushq %' + ra, 2, 0]]);
      const v = c[2] ? t : b + c[1], giuste = ESA(v, 3), salto = c[0][0] === 'j' && c[0][1] !== 'm';
      return { u: '3.6.2', d: 'Lo stadio F ha appena prelevato `' + c[0] + '`, che ha inizio all’indirizzo ' + H(b) + '. Quanto vale il PC previsto? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste,
        ok: c[2] ? 'La destinazione è la costante valC, scritta nell’istruzione: ' + H(t) + (salto ? '. PIPE prevede che ogni salto condizionato avvenga.' : '.') : 'L’istruzione occupa ' + c[1] + ' byte, e il PC previsto è valP: ' + H(b) + ' + ' + c[1] + ' = ' + H(v) + '.',
        diagnosi: DIAG(giuste, [
          c[2] ? { se: ESA(b + 9, 3), msg: salto ? 'Questo è valP, il percorso sequenziale. PIPE assume che il salto avvenga, e preleva dalla destinazione.' : 'Questo è valP. La destinazione di `' + c[0].split(' ')[0] + '` è la costante scritta nell’istruzione.' } : null,
          { se: ESA(b, 3), msg: 'Questo è l’indirizzo dell’istruzione appena prelevata. Occorre quello della successiva.' },
          c[2] ? null : { se: ESA(b + 1, 3), msg: 'L’istruzione occupa ' + c[1] + ' byte. La successiva ha inizio dopo l’ultimo.' }
        ]),
        altro: c[2] ? 'Il valore è diverso. La destinazione si legge nell’istruzione.' : 'Il valore è diverso. Si aggiunga all’indirizzo la lunghezza dell’istruzione, in esadecimale.',
        indizi: c[2] ? ['L’istruzione contiene una costante, valC.', salto ? 'PIPE prevede che il salto avvenga.' : 'La destinazione è nota fin dal prelievo.', 'Il PC previsto è valC.'] : ['L’istruzione successiva ha inizio a valP.', 'Questa istruzione occupa ' + c[1] + ' byte.', H(b) + ' + ' + c[1] + '.'],
        svolgimento: c[2] ? ['valC = ' + H(t) + '.', 'Per `' + c[0].split(' ')[0] + '` il PC previsto è valC.', 'PC previsto = ' + H(t) + '.'] : ['Lunghezza: ' + c[1] + ' byte.', 'valP = ' + H(b) + ' + ' + c[1] + ' = ' + H(v) + '.', 'PC previsto = ' + H(v) + '.'] };
    },
    // 3.6.3 · il valore inoltrato
    (r) => {
      const reg = r.mescola(REG), x = reg[0], y = reg[1], val = r.mescola([12, 17, 23, 31, 38, 44, 52, 59, 67, 74, 86, 93]), vE = val[0], vM = val[1], vW = val[2], vB = val[3];
      const e = r.int(0, 2), m = r.int(0, 2), wOk = r.int(0, 3) > 0;
      const v = e === 0 ? vE : m < 2 ? vM : wOk ? vW : vB, giuste = I(v);
      const tE = e === 0 ? 'una `addq` sta calcolando ' + vE + ' per %' + x : e === 1 ? 'una `addq` sta calcolando ' + vE + ' per %' + y : 'una `cmovne` diretta a %' + x + ', con la condizione falsa, avrebbe copiato ' + vE;
      const tM = m === 0 ? 'una `mrmovq` sta leggendo ' + vM + ' per %' + x : m === 1 ? 'una `addq` contiene ' + vM + ' per %' + x : 'è presente una `nop`';
      const daDove = e === 0 ? 'dallo stadio E' : m < 2 ? 'dallo stadio M' : wOk ? 'dallo stadio W' : 'dal banco, poiché nessuna istruzione nella pipeline scrive %' + x;
      return { u: '3.6.3', d: 'Lo stadio D legge %' + x + '. Nello stadio E ' + tE + '. Nello stadio M ' + tM + '. Nello stadio W un’istruzione sta per scrivere ' + vW + ' in %' + (wOk ? x : y) + '. Il banco contiene ' + vB + ' in %' + x + '. Quale valore riceve lo stadio D?', segnaposto: 'Un numero', giuste,
        ok: 'La ricerca parte dallo stadio E e si arresta alla prima istruzione che scrive effettivamente %' + x + ': il valore proviene ' + daDove + '.',
        diagnosi: DIAG(giuste, [
          e === 1 ? { se: I(vE), msg: 'Il risultato dello stadio E è destinato a %' + y + ', un altro registro.' } : e === 2 ? { se: I(vE), msg: 'La copia condizionata ha la condizione falsa, e la sua destinazione effettiva è RNONE.' } : null,
          m < 2 ? { se: I(vM), msg: 'Lo stadio M ospita un’istruzione meno recente di quella nello stadio E. Vale la più vicina.' } : null,
          wOk ? { se: I(vW), msg: 'Lo stadio W ospita l’istruzione meno recente. Una più vicina scrive il medesimo registro.' } : { se: I(vW), msg: 'L’istruzione nello stadio W scrive %' + y + ', un altro registro.' },
          { se: I(vB), msg: 'Il banco contiene un valore superato: un’istruzione nella pipeline sta per scrivere %' + x + '.' }
        ]),
        altro: 'Il numero è diverso. Si confronti %' + x + ' con la destinazione degli stadi E, M e W, in quest’ordine.',
        indizi: ['Stadio E: ' + (e === 0 ? 'scrive %' + x + ', e il confronto riesce.' : e === 1 ? 'scrive %' + y + ', e il confronto fallisce.' : 'destinazione RNONE, e il confronto fallisce.'), e === 0 ? 'La ricerca si arresta allo stadio E.' : 'Stadio M: ' + (m < 2 ? 'scrive %' + x + ', e il confronto riesce.' : 'la `nop` è priva di destinazione.'), 'Il primo confronto riuscito dà ' + v + '.'],
        svolgimento: ['Stadio E: ' + (e === 0 ? 'destinazione %' + x + ', uguale.' : e === 1 ? 'destinazione %' + y + ', diversa.' : 'destinazione RNONE.'), e === 0 ? 'La ricerca si arresta.' : 'Stadio M: ' + (m < 2 ? 'destinazione %' + x + ', uguale.' : 'nessuna destinazione.') + (m === 2 ? ' Stadio W: destinazione %' + (wOk ? x + ', uguale.' : y + ', diversa.') : ''), 'd_valA = ' + v + '.'] };
    },
    // 3.6.4 · dopo un salto: indirizzo del prelievo, oppure numero di bolle
    (r) => {
      const b = 0x20 + 8 * r.int(0, 50), t = 0x200 + 16 * r.int(1, 40), cnd = r.int(0, 1), ist = r.scegli([['nop', 1], ['addq', 2], ['rrmovq', 2]]), salto = r.scegli(['jne', 'je', 'jle', 'jg']);
      const testa = 'Uno `' + salto + '` ha inizio all’indirizzo ' + H(b) + ', occupa 9 byte e ha destinazione ' + H(t) + '. Dalla destinazione PIPE ha già prelevato due `' + ist[0] + '` da ' + (ist[1] === 1 ? 'un' : ist[1]) + ' byte. Nello stadio E risulta e_Cnd = ' + cnd + '. ';
      if (r.int(0, 2) === 0) { const giuste = I(cnd ? 0 : 2).concat(cnd ? ['nessuna', 'zero'] : ['due']); return { u: '3.6.4', d: testa + 'Quante bolle entrano nella pipeline al fronte?', segnaposto: 'Un numero', giuste,
        ok: cnd ? 'La previsione era corretta, e le due istruzioni prelevate proseguono.' : 'La previsione era errata: i registri D ed E ricevono una bolla ciascuno.',
        diagnosi: DIAG(giuste, [
          { se: I(cnd ? 2 : 0), msg: cnd ? 'Con e_Cnd = 1 la previsione è confermata, e nessuna istruzione è scartata.' : 'Con e_Cnd = 0 le due istruzioni prelevate dalla destinazione vanno scartate.' },
          { se: I(1), msg: 'Le istruzioni prelevate dopo il salto sono due, negli stadi D e F.' },
          { se: I(3), msg: 'Tre bolle sono il costo di una ret. Dopo un salto le istruzioni da scartare sono due.' }
        ]),
        altro: 'Il numero è diverso. Si consideri il valore di e_Cnd, e si contino le istruzioni prelevate dopo il salto.',
        indizi: ['PIPE aveva previsto che il salto avvenisse.', 'e_Cnd = ' + cnd + ': la previsione era ' + (cnd ? 'corretta' : 'errata') + '.', cnd ? 'Nessuna istruzione va scartata.' : 'Le istruzioni da scartare sono due.'],
        svolgimento: ['Previsione: il salto avviene.', 'e_Cnd = ' + cnd + ': previsione ' + (cnd ? 'corretta' : 'errata') + '.', 'Bolle: ' + (cnd ? 0 : 2) + '.'] }; }
      const v = cnd ? t + 2 * ist[1] : b + 9, giuste = ESA(v, 3);
      return { u: '3.6.4', d: testa + 'Da quale indirizzo avviene il prelievo successivo? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste,
        ok: cnd ? 'La previsione era corretta, e il prelievo prosegue dopo le due istruzioni già prelevate: ' + H(t) + ' + ' + (2 * ist[1]) + ' = ' + H(v) + '.' : 'La previsione era errata, e il prelievo riparte dall’istruzione che segue il salto: ' + H(b) + ' + 9 = ' + H(v) + '.',
        diagnosi: DIAG(giuste, [
          { se: ESA(cnd ? b + 9 : t + 2 * ist[1], 3), msg: cnd ? 'Questo è il percorso sequenziale, che con e_Cnd = 1 resta inutilizzato.' : 'Tale sarebbe il prelievo con la previsione corretta. In questo caso e_Cnd vale 0.' },
          { se: ESA(t, 3), msg: cnd ? 'L’istruzione a ' + H(t) + ' è già nella pipeline. Il prelievo prosegue dopo le due già prelevate.' : 'La destinazione è il percorso già prelevato, che ora va abbandonato.' },
          cnd ? { se: ESA(t + ist[1], 3), msg: 'Le istruzioni già prelevate dalla destinazione sono due.' } : { se: ESA(b, 3), msg: 'Questo è l’indirizzo del salto stesso. Occorre quello dell’istruzione che lo segue.' }
        ]),
        altro: 'Il valore è diverso. ' + (cnd ? 'Con e_Cnd = 1 il prelievo prosegue dopo le istruzioni già prelevate dalla destinazione.' : 'Con e_Cnd = 0 il prelievo riparte dall’istruzione che segue il salto in memoria.'),
        indizi: ['e_Cnd = ' + cnd + ': la previsione era ' + (cnd ? 'corretta' : 'errata') + '.', cnd ? 'Dalla destinazione sono già state prelevate due istruzioni da ' + ist[1] + ' byte.' : 'Il prelievo riparte da M_valA, l’indirizzo che segue il salto.', cnd ? H(t) + ' + ' + (2 * ist[1]) + '.' : H(b) + ' + 9.'],
        svolgimento: cnd ? ['e_Cnd = 1: la previsione era corretta.', 'Byte già prelevati dalla destinazione: 2 × ' + ist[1] + ' = ' + (2 * ist[1]) + '.', 'f_pc = ' + H(t) + ' + ' + (2 * ist[1]) + ' = ' + H(v) + '.'] : ['e_Cnd = 0: la previsione era errata.', 'M_valA = ' + H(b) + ' + 9 = ' + H(v) + '.', 'f_pc = ' + H(v) + '.'] };
    },
    // 3.6.5 · i segnali di stallo e di bolla
    (r) => {
      const OPZ = ['F_stall, D_stall ed E_bubble', 'F_stall e D_bubble', 'D_bubble ed E_bubble', 'Nessuno dei quattro'];
      const PERCHE = ['Sono i segnali di un carico seguito da un uso: i registri F e D restano bloccati, e nel registro E entra una bolla.', 'Sono i segnali di una ret: il registro F resta bloccato, e nel registro D entra una bolla.', 'Sono i segnali di una previsione errata: le due istruzioni che seguono il salto divengono bolle.', 'I quattro segnali restano a 0 quando nessuna istruzione deve attendere e nessuna va scartata.'];
      const reg = r.mescola(REG), x = reg[0], y = reg[1], z = reg[2], op = r.scegli(['addq', 'subq', 'xorq']), sp = 8 * r.int(0, 4), caso = r.int(0, 5);
      const C = [
        ['mrmovq ' + sp + '(%' + z + '), %' + x, '', r.int(0, 1) ? op + ' %' + x + ', %' + y : op + ' %' + y + ', %' + x, 0, 'La `' + op + '` legge %' + x + ', che la `mrmovq` sta ancora caricando.'],
        ['mrmovq ' + sp + '(%' + z + '), %' + x, '', op + ' %' + y + ', %' + z, 3, 'La `' + op + '` legge %' + y + ' e %' + z + ', che la `mrmovq` lascia invariati.'],
        [op + ' %' + x + ', %' + y, '', 'ret', 1, 'Nello stadio D è presente una `ret`, e nessun carico è in corso su %rsp.'],
        ['mrmovq ' + sp + '(%' + z + '), %rsp', '', 'ret', 0, 'La `ret` legge %rsp, che la `mrmovq` sta caricando. Sul registro D lo stallo ha la precedenza sulla bolla.'],
        [op + ' %' + x + ', %' + y, '', op + ' %' + y + ', %' + z, 3, 'La seconda istruzione impiega il risultato della prima, e l’inoltro lo fornisce dall’ALU senza attese.'],
        ['jne 0x' + (0x200 + 16 * r.int(1, 20)).toString(16).toUpperCase(), ', con e_Cnd = 0', 'nop', 2, 'Per lo `jne` era previsto il salto, e la condizione è falsa.']
      ][caso];
      return { u: '3.6.5', d: 'Nello stadio E è presente `' + C[0] + '`' + C[1] + ', e nello stadio D è presente `' + C[2] + '`. Quali fra F_stall, D_stall, D_bubble ed E_bubble valgono 1?', guida: 'Si scelga la risposta.', o: [{ t: OPZ[C[3]], ok: true, fb: C[4] }].concat([0, 1, 2, 3].filter((k) => k !== C[3]).map((k) => ({ t: OPZ[k], fb: PERCHE[k] + ' ' + C[4] }))) };
    },
    // 3.6.6 · cicli e attese di una sequenza
    (r) => {
      const g = r.int(2, 9), vicino = r.int(0, 1) === 1, cosa = r.int(0, 2), n = 3 * g, att = vicino ? g : 0, cicli = n + 4 + att, ordine = vicino ? 'L, U, I' : 'L, I, U';
      const testa = 'Il gruppo ' + ordine + ' è ripetuto ' + g + ' volte a partire dalla pipeline vuota. L è un carico, U ne impiega il dato, I è indipendente dalle altre due. ';
      if (cosa === 0) { const giuste = I(att).concat(att === 0 ? ['nessuna', 'zero'] : []); return { u: '3.6.6', d: testa + 'Quante attese per carico e uso contiene la sequenza?', segnaposto: 'Un numero', giuste,
        ok: vicino ? 'In ogni gruppo U segue immediatamente il proprio carico: un’attesa per gruppo, ' + g + ' complessive.' : 'In ogni gruppo I separa il carico dal suo uso, e l’inoltro fornisce il dato senza attese.',
        diagnosi: DIAG(giuste, [
          { se: I(vicino ? 0 : g), msg: vicino ? 'In quest’ordine U segue immediatamente L, quando il dato deve ancora uscire dalla memoria.' : 'In quest’ordine fra L e U è presente I, e il dato esce in tempo dalla memoria.' },
          { se: I(2 * g), msg: 'Con l’inoltro ogni carico seguito da un uso costa un solo ciclo.' },
          { se: I(1), msg: 'La situazione si ripete in ognuno dei ' + g + ' gruppi.' }
        ]),
        altro: 'Il numero è diverso. Si consideri che cosa separa ogni L dalla propria U.',
        indizi: ['Un carico immediatamente seguito dal suo uso costa un ciclo.', 'In quest’ordine fra L e U ' + (vicino ? 'non è presente alcuna istruzione.' : 'è presente I.'), 'I gruppi sono ' + g + '.'],
        svolgimento: ['Ordine: ' + ordine + '.', vicino ? 'Ogni gruppo contiene un’attesa.' : 'Nessun gruppo contiene attese.', 'Attese: ' + att + '.'] }; }
      const giuste = I(cicli);
      return { u: '3.6.6', d: testa + 'Quanti cicli occupa la sequenza?', segnaposto: 'Un numero', giuste,
        ok: 'Le istruzioni sono ' + n + ', il riempimento vale 4 cicli e le attese sono ' + att + ': ' + n + ' + 4' + (att ? ' + ' + att : '') + ' = ' + cicli + '.',
        diagnosi: DIAG(giuste, [
          { se: I(vicino ? n + 4 : n + 4 + g), msg: vicino ? 'Questo è il flusso ideale. In quest’ordine ogni U attende un ciclo.' : 'Questo è il conteggio dell’ordine L, U, I. In questo caso le attese sono eliminate.' },
          { se: I(cicli - 4), msg: 'Mancano i 4 cicli di riempimento.' },
          vicino ? { se: I(n + 4 + 2 * g), msg: 'Con l’inoltro ogni attesa dura un solo ciclo.' } : null,
          { se: I(5 * n), msg: 'Le istruzioni si sovrappongono, e a regime ne esce una per ciclo.' }
        ]),
        altro: 'Il numero è diverso. Si sommino le istruzioni, i 4 cicli di riempimento e un ciclo per ogni attesa.',
        indizi: ['Le istruzioni sono 3 × ' + g + ' = ' + n + '.', 'Il flusso ideale occupa ' + n + ' + 4 cicli.', 'Le attese sono ' + att + '.'],
        svolgimento: ['Istruzioni: ' + n + '.', 'Flusso ideale: ' + n + ' + 4 = ' + (n + 4) + ' cicli.', 'Attese: ' + att + '.', 'Totale: ' + cicli + ' cicli.'] };
    },
    // 3.6.7 · tempo, risparmio, CPI e accelerazione
    (r) => {
      const g = r.scegli([2, 3, 4, 5, 6, 8, 10]), t = r.scegli([40, 50, 60, 65, 80, 100]), n = 3 * g, A = n + 4 + g, B = n + 4, cosa = r.int(0, 3);
      const testa = 'Un programma ripete ' + g + ' volte il gruppo L, U, I a partire dalla pipeline vuota, con un periodo di ' + t + ' ps. ';
      if (cosa === 0) { const giuste = PS(g * t); return { u: '3.6.7', d: testa + 'Riordinato in L, I, U, quanto tempo risparmia, in picosecondi?', segnaposto: 'Un tempo in ps', giuste,
        ok: 'Il riordino elimina un’attesa per gruppo: ' + g + ' cicli da ' + t + ' ps, cioè ' + (g * t) + ' ps.',
        diagnosi: DIAG(giuste, [
          { se: PS(t), msg: 'Il riordino elimina un’attesa per ogni gruppo, e i gruppi sono ' + g + '.' },
          { se: I(g), msg: 'Questi sono i cicli risparmiati. Il tempo si ottiene moltiplicandoli per il periodo.' },
          { se: PS(B * t), msg: 'Questo è il tempo della versione riordinata. Il risparmio è la differenza fra i due tempi.' },
          { se: PS(4 * t), msg: 'I 4 cicli di riempimento restano in entrambe le versioni. Sono eliminate le attese.' }
        ]),
        altro: 'Il valore è diverso. Si contino le attese eliminate, una per gruppo, e si moltiplichi per il periodo.',
        indizi: ['La versione originale ha un’attesa per gruppo.', 'Le attese eliminate sono ' + g + '.', g + ' × ' + t + '.'],
        svolgimento: ['Cicli originali: ' + n + ' + 4 + ' + g + ' = ' + A + '.', 'Cicli riordinati: ' + n + ' + 4 = ' + B + '.', 'Risparmio: ' + (A - B) + ' × ' + t + ' = ' + (g * t) + ' ps.'] }; }
      if (cosa === 1) { const giuste = PS(A * t); return { u: '3.6.7', d: testa + 'Quanto dura la versione originale, in picosecondi?', segnaposto: 'Un tempo in ps', giuste,
        ok: 'I cicli sono ' + n + ' + 4 + ' + g + ' = ' + A + ', e il tempo ' + A + ' × ' + t + ' = ' + (A * t) + ' ps.',
        diagnosi: DIAG(giuste, [
          { se: PS(B * t), msg: 'Mancano le ' + g + ' attese, una per gruppo.' },
          { se: I(A), msg: 'Questi sono i cicli. Il tempo si ottiene moltiplicandoli per il periodo.' },
          { se: PS((A - 4) * t), msg: 'Mancano i 4 cicli di riempimento.' },
          { se: PS(n * t), msg: 'Mancano i 4 cicli di riempimento e le ' + g + ' attese.' }
        ]),
        altro: 'Il valore è diverso. Si contino i cicli, comprese le attese e il riempimento, poi si moltiplichi per il periodo.',
        indizi: ['Le istruzioni sono 3 × ' + g + ' = ' + n + '.', 'I cicli sono ' + n + ' + 4 + ' + g + ' = ' + A + '.', A + ' × ' + t + '.'],
        svolgimento: ['Istruzioni: ' + n + '.', 'Cicli: ' + n + ' + 4 + ' + g + ' = ' + A + '.', 'Tempo: ' + A + ' × ' + t + ' = ' + (A * t) + ' ps.'] }; }
      if (cosa === 2) { const giuste = DEC3(A / B); return { u: '3.6.7', d: testa + 'Riordinato in L, I, U, quanto vale l’accelerazione? Si arrotondi al millesimo.', segnaposto: 'Un numero con la virgola', giuste,
        ok: 'I cicli passano da ' + A + ' a ' + B + ', e il periodo è il medesimo: ' + A + ' / ' + B + ' = ' + V3(A / B) + '.',
        diagnosi: DIAG(giuste, [
          { se: DEC3(B / A), msg: 'Il rapporto è invertito. Il tempo originale è il dividendo, quello migliorato il divisore.' },
          { se: PS(g * t), msg: 'Questo è il risparmio in picosecondi. L’accelerazione è un rapporto fra i due tempi.' },
          { se: DEC3(4 / 3), msg: 'Questo è il valore al quale l’accelerazione si avvicina nei programmi molto lunghi. In questo caso sono rilevanti anche i 4 cicli di riempimento.' },
          { se: I(g), msg: 'Questa è la differenza in cicli. L’accelerazione è un rapporto.' }
        ]),
        altro: 'Il valore è diverso. Si dividano i cicli della versione originale per quelli della versione riordinata.',
        indizi: ['Cicli originali: ' + n + ' + 4 + ' + g + ' = ' + A + '.', 'Cicli riordinati: ' + n + ' + 4 = ' + B + '.', A + ' / ' + B + '.'],
        svolgimento: ['Tempo originale: ' + A + ' × ' + t + ' = ' + (A * t) + ' ps.', 'Tempo riordinato: ' + B + ' × ' + t + ' = ' + (B * t) + ' ps.', 'Accelerazione: ' + (A * t) + ' / ' + (B * t) + ' = ' + V3(A / B) + '.'] }; }
      const orig = r.int(0, 1) === 1, C = orig ? A : B, giuste = DEC3(C / n);
      return { u: '3.6.7', d: testa + 'Quanto vale il CPI della versione ' + (orig ? 'originale' : 'riordinata in L, I, U') + '? Si arrotondi al millesimo.', segnaposto: 'Un numero con la virgola', giuste,
        ok: 'I cicli sono ' + C + ' e le istruzioni ' + n + ': ' + C + ' / ' + n + ' = ' + V3(C / n) + '.',
        diagnosi: DIAG(giuste, [
          { se: DEC3((orig ? B : A) / n), msg: 'Questo è il CPI dell’altra versione. Va verificato se le attese sono da contare.' },
          { se: DEC3(n / C), msg: 'La divisione è invertita. I cicli vanno divisi per le istruzioni.' },
          { se: DEC3((C - 4) / n), msg: 'Mancano i 4 cicli di riempimento.' },
          { se: I(C), msg: 'Questi sono i cicli. Il CPI si ottiene dividendoli per le ' + n + ' istruzioni.' }
        ]),
        altro: 'Il valore è diverso. Si contino i cicli di questa versione, poi si dividano per le istruzioni.',
        indizi: ['Le istruzioni sono ' + n + '.', 'I cicli sono ' + n + ' + 4' + (orig ? ' + ' + g : '') + ' = ' + C + '.', C + ' / ' + n + '.'],
        svolgimento: ['Istruzioni: ' + n + '.', 'Cicli: ' + C + '.', 'CPI = ' + C + ' / ' + n + ' = ' + V3(C / n) + '.'] };
    }
  ] });
})();
