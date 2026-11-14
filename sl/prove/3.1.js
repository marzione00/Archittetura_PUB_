'use strict';
/* Prova del capitolo 3.1: una domanda per unità. */
(() => {
  const I = SL.scritture.intero, ESA = SL.scritture.esa;
  const H2 = (v) => '0x' + SL.x86.esa2(v), B4 = (v) => (v & 15).toString(2).padStart(4, '0');
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };

  SL.registraProva('3.1', { domande: [
    // 3.1.1 · le AND accese nel circuito della maggioranza, oppure le righe a 1 di una specifica
    (r) => {
      if (r.int(0, 1) === 0) {
        const a = r.int(0, 1), b = r.int(0, 1), c = r.int(0, 1), n = a + b + c, giusto = a * b + a * c + b * c, giuste = I(giusto);
        return { u: '3.1.1', d: 'Il circuito della maggioranza, AB OR AC OR BC, riceve A = ' + a + ', B = ' + b + ' e C = ' + c + '. Quante delle sue tre porte AND danno 1?', segnaposto: 'Un numero', giuste,
          ok: n === 3 ? 'Con tre ingressi a 1 ogni coppia è completa.' : n === 2 ? 'Con due ingressi a 1 è completa una sola coppia, quella formata da quei due.' : 'Con meno di due ingressi a 1 nessuna coppia è completa.',
          diagnosi: DIAG(giuste, [
            { se: I(n), msg: 'Questo è il numero degli ingressi a 1. La domanda riguarda le coppie in cui entrambi gli ingressi valgono 1.' },
            { se: I(2), msg: 'Due AND accese sono un caso impossibile: richiederebbero tre ingressi a 1, e allora sarebbe accesa anche la terza.' },
            { se: I(n >= 2 ? 1 : 0), msg: 'Questo è il valore della spia. Le AND accese vanno contate una per una.' }
          ]),
          altro: 'Il numero è diverso. Si calcoli A AND B, A AND C e B AND C, poi si contino gli 1.',
          indizi: ['Le coppie sono A con B, A con C, B con C.', 'Una AND dà 1 soltanto con entrambi gli ingressi a 1.', 'A AND B = ' + (a & b) + ', A AND C = ' + (a & c) + ', B AND C = ' + (b & c) + '.'],
          svolgimento: ['A AND B = ' + (a & b) + '.', 'A AND C = ' + (a & c) + '.', 'B AND C = ' + (b & c) + '. In tutto: ' + giusto + '.'] };
      }
      const CASI = [['almeno due ingressi valgono 1', 4, '011, 101, 110, 111'], ['esattamente due ingressi valgono 1', 3, '011, 101, 110'], ['esattamente un ingresso vale 1', 3, '001, 010, 100'], ['almeno un ingresso vale 1', 7, 'tutte tranne 000'], ['tutti e tre gli ingressi valgono 1', 1, '111'], ['nessun ingresso vale 1', 1, '000'], ['al massimo un ingresso vale 1', 4, '000, 001, 010, 100']];
      const k = r.scegli(CASI), giuste = I(k[1]);
      return { u: '3.1.1', d: 'Una specifica chiede che l’uscita di un circuito a tre ingressi valga 1 quando ' + k[0] + '. In quante righe della tabella di verità l’uscita vale 1?', segnaposto: 'Un numero', giuste,
        ok: 'Le righe con uscita 1 sono: ' + k[2] + '.',
        diagnosi: DIAG(giuste, [
          { se: I(8), msg: 'Otto sono tutte le righe della tabella. Vanno contate soltanto quelle che soddisfano la richiesta.' },
          { se: I(3), msg: 'Rileggi la richiesta facendo attenzione a «almeno», «esattamente» e «al massimo»: cambiano le righe da contare.' },
          { se: I(4), msg: 'Rileggi la richiesta facendo attenzione a «almeno», «esattamente» e «al massimo»: cambiano le righe da contare.' },
          { se: I(2), msg: 'Le righe vanno cercate fra tutte le otto combinazioni di tre bit.' }
        ]),
        altro: 'Il numero è diverso. Si scrivano le otto combinazioni e si segnino quelle che soddisfano la richiesta.',
        indizi: ['Le combinazioni di tre bit sono otto, da 000 a 111.', 'Per ciascuna conta gli ingressi a 1.', 'Si tengano quelle in cui ' + k[0] + '.'],
        svolgimento: ['Combinazioni: 000, 001, 010, 011, 100, 101, 110, 111.', 'Soddisfano la richiesta: ' + k[2] + '.', 'Righe con uscita 1: ' + k[1] + '.'] };
    },
    // 3.1.2 · l'uscita di un multiplexer a quattro ingressi, oppure i bit di comando
    (r) => {
      if (r.int(0, 2) > 0) {
        const v = r.mescola([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]).slice(0, 4), s = r.int(0, 3), s1 = s >> 1, s0 = s & 1, rov = 2 * s0 + s1, giuste = I(v[s]);
        return { u: '3.1.2', d: 'Un multiplexer a quattro ingressi riceve I0 = ' + v[0] + ', I1 = ' + v[1] + ', I2 = ' + v[2] + ' e I3 = ' + v[3] + '. Il comando vale S1 S0 = ' + s1 + s0 + '. Quale valore esce?', segnaposto: 'Un numero', giuste,
          ok: 'Il comando scrive il numero 2 × ' + s1 + ' + ' + s0 + ' = ' + s + ', e il multiplexer copia I' + s + '.',
          diagnosi: DIAG(giuste, [
            rov !== s ? { se: I(v[rov]), msg: 'Hai letto il comando al contrario. Il bit di sinistra, S1, pesa 2, e quello di destra, S0, pesa 1.' } : null,
            { se: I(v[s ^ 1]), msg: 'Questo è l’altro membro della stessa coppia. Al primo livello sceglie S0, che vale ' + s0 + '.' },
            { se: I(v[s ^ 2]), msg: 'Questa parola viene dall’altra coppia. Al secondo livello sceglie S1, che vale ' + s1 + '.' },
            { se: I(s), msg: 'Questo è il numero dell’ingresso scelto. La domanda chiede il valore che quell’ingresso porta.' }
          ]),
          altro: 'Il valore è diverso. Si calcoli 2 × S1 + S0 e si prenda l’ingresso con quel numero.',
          indizi: ['S1 = ' + s1 + ' e S0 = ' + s0 + '.', '2 × ' + s1 + ' + ' + s0 + ' = ' + s + '.', 'Esce l’ingresso I' + s + '.'],
          svolgimento: ['Comando: S1 = ' + s1 + ', S0 = ' + s0 + '.', 'Posizione: 2 × ' + s1 + ' + ' + s0 + ' = ' + s + '.', 'Uscita: I' + s + ' = ' + v[s] + '.'] };
      }
      const n = r.int(1, 6), N = 1 << n, giuste = I(n);
      return { u: '3.1.2', d: 'Un multiplexer deve scegliere fra ' + N + ' ingressi. Quanti bit di comando servono?', segnaposto: 'Un numero', giuste,
        ok: 'Con ' + n + ' bit si formano ' + N + ' combinazioni, una per ingresso.',
        diagnosi: DIAG(giuste, [
          { se: I(N), msg: 'Questo è il numero degli ingressi. Ogni bit di comando in più raddoppia gli ingressi distinguibili.' },
          { se: I(N / 2), msg: 'Gli ingressi distinguibili raddoppiano a ogni bit aggiunto: con ' + (N / 2) + ' bit sarebbero molti più di ' + N + '.' },
          { se: I(n + 1), msg: 'Con ' + (n + 1) + ' bit le combinazioni sarebbero ' + 2 * N + ', il doppio del necessario.' },
          n > 1 ? { se: I(n - 1), msg: 'Con ' + (n - 1) + ' bit le combinazioni sarebbero ' + N / 2 + ', la metà del necessario.' } : null
        ]),
        altro: 'Il numero è diverso. Cerca l’esponente n per cui 2ⁿ vale ' + N + '.',
        indizi: ['Con n bit le combinazioni sono 2ⁿ.', 'Raddoppia a partire da 2 finché arrivi a ' + N + '.', 'Conta i raddoppi, compreso il primo 2.'],
        svolgimento: ['Combinazioni necessarie: ' + N + '.', '2 elevato a ' + n + ' vale ' + N + '.', 'Bit di comando: ' + n + '.'] };
    },
    // 3.1.3 · la parola del sommatore-sottrattore, oppure il totale ricostruito
    (r) => {
      if (r.int(0, 2) > 0) {
        const a = r.int(1, 15), b = r.int(1, 15), sub = r.int(0, 2) > 0, giusto = (sub ? a - b : a + b) & 15, giuste = [B4(giusto)];
        return { u: '3.1.3', d: 'Un sommatore-sottrattore a quattro bit calcola ' + a + (sub ? ' − ' : ' + ') + b + '. Quale parola conserva? Scrivila in binario.', segnaposto: 'Quattro cifre binarie', giuste,
          ok: sub ? 'Il circuito somma ' + B4(a) + ', i bit invertiti di ' + B4(b) + ', cioè ' + B4(b ^ 15) + ', e il riporto entrante 1.' + (a < b ? ' La parola, in complemento a due, vale ' + (a - b) + '.' : '') : 'La somma vera vale ' + (a + b) + (a + b > 15 ? ', e nei quattro bit resta ' + giusto + '.' : ', che sta in quattro bit.'),
          diagnosi: DIAG(giuste, [
            sub ? { se: [B4(a + (b ^ 15))], msg: 'Manca il riporto entrante. Dopo avere invertito i bit di B va aggiunto 1.' } : null,
            { se: [B4(sub ? a + b : a - b)], msg: sub ? 'Questa è la parola della somma. Nella sottrazione i bit di B escono dalle XOR invertiti.' : 'Questa è la parola della differenza. Nella somma i bit di B passano dalle XOR intatti.' },
            sub ? { se: [B4(b - a)], msg: 'Hai scambiato i due operandi: questa è la parola di ' + b + ' − ' + a + '.' } : null,
            sub && a < b ? { se: [B4(b - a)], msg: 'Questo è il valore senza il segno. La parola conservata è la differenza in complemento a due.' } : null
          ]),
          altro: 'La parola è diversa. Si scrivano gli operandi in binario' + (sub ? ', inverti i bit di B, somma e si aggiunga 1' : ' e sommali colonna per colonna') + ', tenendo soltanto quattro bit.',
          indizi: [a + ' vale ' + B4(a) + ' e ' + b + ' vale ' + B4(b) + '.', sub ? 'I bit di B invertiti sono ' + B4(b ^ 15) + ', e il riporto entrante vale 1.' : 'Il riporto entrante vale 0.', 'Si tengano i quattro bit più a destra del totale.'],
          svolgimento: sub ? ['Bit di B invertiti: ' + B4(b ^ 15) + '.', B4(a) + ' + ' + B4(b ^ 15) + ' + 1 = ' + (a + (b ^ 15) + 1).toString(2) + '.', 'Parola di quattro bit: ' + B4(giusto) + '.'] : [B4(a) + ' + ' + B4(b) + ' = ' + (a + b).toString(2) + '.', 'Si conservano i quattro bit più a destra.', 'Parola: ' + B4(giusto) + '.'] };
      }
      const w = r.int(0, 15), c = r.int(0, 1), giuste = I(w + 16 * c);
      return { u: '3.1.3', d: 'Su quattro bit una somma lascia la parola ' + B4(w) + ' e il riporto finale C4 = ' + c + '. Quanto vale il totale matematico?', segnaposto: 'Un numero', giuste,
        ok: 'La parola vale ' + w + ' e il riporto finale pesa 16: ' + w + ' + 16 × ' + c + ' = ' + (w + 16 * c) + '.',
        diagnosi: DIAG(giuste, [
          c ? { se: I(w), msg: 'Questo è il valore della sola parola. Il riporto finale vale 1 e pesa 16.' } : { se: I(w + 16), msg: 'Il riporto finale vale 0, quindi alla parola non va aggiunto nulla.' },
          c ? { se: I(w + 1), msg: 'Il riporto finale esce oltre la colonna di peso 8, e pesa 16.' } : null,
          c ? { se: I(w + 8), msg: 'Otto è il peso della colonna 3. Il riporto C4 esce oltre e pesa 16.' } : null
        ]),
        altro: 'Il numero è diverso. Si calcoli il valore della parola e si aggiunga 16 se il riporto finale vale 1.',
        indizi: ['La parola ' + B4(w) + ' vale ' + w + '.', 'C4 pesa 16.', w + ' + 16 × ' + c + '.'],
        svolgimento: ['Parola: ' + B4(w) + ' = ' + w + '.', 'Riporto finale: 16 × ' + c + ' = ' + 16 * c + '.', 'Totale: ' + (w + 16 * c) + '.'] };
    },
    // 3.1.4 · il byte in uscita dall'ALU
    (r) => {
      const f = r.scegli(['add', 'sub', 'and', 'xor']), a = r.int(1, 255), b = r.int(0, 3) === 0 ? a : r.int(1, 255);
      const C = { add: (a + b) & 255, sub: (a - b) & 255, and: a & b, xor: a ^ b, or: a | b }, NOMI = { add: 'somma', sub: 'differenza A − B', and: 'AND', xor: 'XOR', or: 'OR' }, giusto = C[f], giuste = ESA(giusto, 2);
      const sbagli = ['add', 'sub', 'and', 'xor', 'or'].filter((k) => k !== f).map((k) => ({ se: ESA(C[k], 2), msg: 'Questo è il risultato dell’operazione «' + NOMI[k] + '». Il comando chiede «' + NOMI[f] + '».' }));
      return { u: '3.1.4', d: 'Un’ALU a otto bit riceve A = ' + H2(a) + ' e B = ' + H2(b) + ' con il comando «' + NOMI[f] + '». Quale byte esce? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1F', giuste,
        ok: (f === 'add' ? a + ' + ' + b + ' = ' + (a + b) + (a + b > 255 ? ', e negli otto bit resta ' + giusto + '.' : '.') : f === 'sub' ? a + ' − ' + b + ' = ' + (a - b) + (a < b ? ', e negli otto bit resta ' + giusto + '.' : '.') : SL.x86.bin8(a) + ' ' + NOMI[f] + ' ' + SL.x86.bin8(b) + ' = ' + SL.x86.bin8(giusto) + '.') + ' ZF vale ' + (giusto === 0 ? 1 : 0) + '.',
        diagnosi: DIAG(giuste, sbagli),
        altro: 'Il byte è diverso. ' + (f === 'add' || f === 'sub' ? 'Si esegua l’operazione sui valori e si conservi il resto modulo 256.' : 'Si scrivano i due byte in binario e si applichi l’operazione posizione per posizione.'),
        indizi: [H2(a) + ' vale ' + a + ', in binario ' + SL.x86.bin8(a) + '.', H2(b) + ' vale ' + b + ', in binario ' + SL.x86.bin8(b) + '.', f === 'add' ? 'Somma i due valori e, se superi 255, si tolga 256.' : f === 'sub' ? 'Si sottragga e, se il risultato è negativo, si aggiunga 256.' : f === 'and' ? 'Resta a 1 ogni posizione in cui entrambi i byte valgono 1.' : 'Resta a 1 ogni posizione in cui i due byte sono diversi.'],
        svolgimento: [H2(a) + ' = ' + SL.x86.bin8(a) + ', ' + H2(b) + ' = ' + SL.x86.bin8(b) + '.', f === 'add' ? a + ' + ' + b + ' = ' + (a + b) + '.' : f === 'sub' ? a + ' − ' + b + ' = ' + (a - b) + '.' : 'Posizione per posizione: ' + SL.x86.bin8(giusto) + '.', 'Byte in uscita: ' + H2(giusto) + '.'] };
    },
    // 3.1.5 · il tempo di assestamento, oppure il cammino critico del sommatore
    (r) => {
      if (r.int(0, 2) > 0) {
        const a = 5 * r.int(4, 18), x0 = 5 * r.int(4, 18), x = x0 === a ? x0 + 5 : x0, o = 5 * r.int(3, 8), lento = Math.max(a, x), giuste = I(lento + o).concat([lento + o + 'ps']);
        return { u: '3.1.5', d: 'Una AND da ' + a + ' ps e una XOR da ' + x + ' ps lavorano in parallelo e consegnano a una OR da ' + o + ' ps. Dopo quanti picosecondi dal cambio degli ingressi l’uscita è affidabile?', segnaposto: 'Un numero di picosecondi', giuste,
          ok: 'Il ramo più lento arriva dopo ' + lento + ' ps, e la OR aggiunge ' + o + ' ps.',
          diagnosi: DIAG(giuste, [
            { se: I(a + x + o), msg: 'Hai sommato tutti e tre i ritardi. I due rami lavorano nello stesso tempo, e fra loro conta soltanto il più lento.' },
            { se: I(Math.min(a, x) + o), msg: 'Hai aggiunto la OR al ramo più rapido. La OR deve attendere anche l’altro ramo.' },
            { se: I(lento), msg: 'Questo è l’arrivo del ramo più lento. Manca il ritardo della OR.' }
          ]),
          altro: 'Il numero è diverso. Si prenda il maggiore fra i ritardi dei due rami e si aggiunga quello della OR.',
          indizi: ['I due rami lavorano in parallelo.', 'Il più lento arriva dopo ' + lento + ' ps.', lento + ' + ' + o + '.'],
          svolgimento: ['Arrivi dei due rami: ' + a + ' ps e ' + x + ' ps.', 'Il più lento: ' + lento + ' ps.', 'Uscita affidabile: ' + lento + ' + ' + o + ' = ' + (lento + o) + ' ps.'] };
      }
      const n = r.scegli([4, 8, 16, 32, 64]), d = 5 * r.int(3, 9), giuste = I(n * d).concat([n * d + 'ps']);
      return { u: '3.1.5', d: 'In un sommatore a propagazione di riporto ogni cella impiega ' + d + ' ps per produrre il proprio riporto. Nel caso peggiore, dopo quanti picosecondi è pronto il riporto finale di un sommatore a ' + n + ' bit?', segnaposto: 'Un numero di picosecondi', giuste,
        ok: 'Nel caso peggiore il riporto attraversa tutte le ' + n + ' celle, una dopo l’altra: ' + n + ' × ' + d + ' = ' + n * d + ' ps.',
        diagnosi: DIAG(giuste, [
          { se: I(d), msg: 'Questo tempo basta a una cella sola. Nel caso peggiore ciascuna deve attendere il riporto della precedente.' },
          { se: I((n - 1) * d), msg: 'Le celle da attraversare sono ' + n + ', dalla colonna 0 alla colonna ' + (n - 1) + '.' },
          { se: I(n + d), msg: 'Le celle lavorano in fila, e i loro ritardi si sommano: ' + n + ' volte ' + d + ' ps.' }
        ]),
        altro: 'Il numero è diverso. Le celle sono in fila, quindi i loro ritardi si sommano.',
        indizi: ['Il riporto finale esce dall’ultima cella.', 'Nel caso peggiore ogni cella attende la precedente.', n + ' × ' + d + '.'],
        svolgimento: ['Celle in fila: ' + n + '.', 'Ritardo di ciascuna: ' + d + ' ps.', 'Cammino critico: ' + n + ' × ' + d + ' = ' + n * d + ' ps.'] };
    },
    // 3.1.6 · G, P e riporto di un gruppo, oppure CF e OF di una somma
    (r) => {
      if (r.int(0, 1) === 0) {
        const tipo = r.int(0, 2), ha = r.int(1, 14), hb = tipo === 1 ? 15 - ha : tipo === 2 ? r.int(16 - ha, 15) : r.int(0, 14 - ha), c = r.int(0, 1), tot = ha + hb;
        const O = [['G = 0 e P = 0, e il riporto in uscita vale 0', 'Sarebbe così con una somma dei due pezzi minore di 15. Qui la somma vale ' + tot + '.', 'La somma dei due pezzi vale ' + tot + ', meno di 15: un riporto in arrivo verrebbe assorbito.'],
          ['G = 0 e P = 1, e il riporto in uscita vale ' + c, 'Il gruppo propaga soltanto quando la somma dei due pezzi vale 15 esatti. Qui vale ' + tot + '.', 'La somma dei due pezzi vale 15 esatti: il gruppo lascia uscire il riporto in arrivo, che vale ' + c + '.'],
          ['G = 1 e P = 0, e il riporto in uscita vale 1', 'Il gruppo genera quando la somma dei due pezzi supera 15. Qui vale ' + tot + '.', 'La somma dei due pezzi vale ' + tot + ', oltre 15: il riporto esce qualunque cosa arrivi da destra.']];
        return { u: '3.1.6', d: 'Il gruppo alto di un sommatore riceve i pezzi ' + B4(ha) + ' e ' + B4(hb) + ', e dal gruppo basso arriva il riporto C4 = ' + c + '. Quanto valgono G e P, e quale riporto esce?', guida: 'Si scelga la risposta.', o: O.map((x, k) => (k === tipo ? { t: x[0], ok: true, fb: x[2] } : { t: x[0], fb: x[1] })) };
      }
      const a = r.int(1, 255), b = r.int(1, 255), cf = a + b > 255 ? 1 : 0, sa = a > 127 ? a - 256 : a, sb = b > 127 ? b - 256 : b, of = sa + sb > 127 || sa + sb < -128 ? 1 : 0, giusta = '' + cf + of;
      const T = { '00': 'Nessuno dei due', '10': 'Soltanto CF', '01': 'Soltanto OF', '11': 'CF e OF' };
      const perche = 'Senza segno il totale vale ' + (a + b) + (cf ? ', oltre 255.' : ', entro 255.') + ' Con segno vale ' + SL.x86.num(sa + sb) + (of ? ', fuori dall’intervallo da −128 a 127.' : ', dentro l’intervallo da −128 a 127.');
      return { u: '3.1.6', d: 'Su otto bit si calcola ' + H2(a) + ' + ' + H2(b) + '. Quali flag valgono 1 fra CF e OF?', guida: 'Si scelga la risposta.', o: ['00', '10', '01', '11'].map((k) => (k === giusta ? { t: T[k], ok: true, fb: perche } : { t: T[k], fb: perche })) };
    }
  ] });
})();
