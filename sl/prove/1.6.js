'use strict';
/* Prova del capitolo 1.6: sei domande sulle quattro unità. */
(() => {
  const I = SL.scritture.intero, N = SL.num;
  const V = (x) => String(x).replace('-', '−').replace('.', ',');

  SL.registraProva('1.6', { domande: [
    // 1.6.1 · le cifre binarie di una frazione
    (r) => {
      const [num, cifre] = r.scegli([[125, '001'], [375, '011'], [625, '101'], [875, '111'], [3125, '0101'], [4375, '0111'], [5625, '1001'], [6875, '1011'], [8125, '1101'], [1875, '0011']]);
      const dec = '0,' + num, rovescio = cifre.split('').reverse().join('');
      let x = Number('0.' + num); const passi = [];
      cifre.split('').forEach((c) => { const doppio = x * 2; passi.push('Il doppio di ' + V(x) + ' è ' + V(doppio) + ': cifra ' + c + (c === '1' ? ', e si sottrae l’unità.' : '.')); x = doppio >= 1 ? doppio - 1 : doppio; });
      return { u: '1.6.1', d: 'Come si scrive in binario il numero decimale ' + dec + '? Si indichino soltanto le cifre dopo la virgola.', segnaposto: 'Cifre binarie', giuste: [cifre, '0.' + cifre, '.' + cifre, cifre + '0', '0.' + cifre + '0'],
        ok: 'Raddoppiando ' + cifre.length + ' volte si trovano le cifre ' + cifre.split('').join(', ') + ', e il resto si annulla: ' + dec + ' in binario è 0,' + cifre + '.',
        diagnosi: [
          { se: [rovescio, '0.' + rovescio], msg: 'Le cifre sono corrette e disposte in ordine inverso. La prima cifra trovata è quella di peso un mezzo, e va scritta subito dopo la virgola.' },
          { se: cifre[0] === '0' ? [cifre.replace(/^0+/, '')] : [], msg: 'Gli zeri subito dopo la virgola sono significativi: spostano le cifre successive su pesi minori.' },
          { se: [String(num)], msg: 'Queste sono le cifre decimali. In binario dopo la virgola compaiono soltanto 0 e 1.' }
        ],
        altro: 'Le cifre sono diverse. Si raddoppi il numero: se il doppio raggiunge 1 la cifra è 1 e si sottrae l’unità, altrimenti la cifra è 0.',
        indizi: ['Dopo la virgola i pesi sono un mezzo, un quarto, un ottavo, un sedicesimo.', 'Il doppio di ' + dec + ' è ' + V(Number('0.' + num) * 2) + ', quindi la prima cifra è ' + cifre[0] + '.', 'Le cifre da trovare sono ' + cifre.length + '.'],
        svolgimento: passi.concat(['Il resto è zero. In binario: 0,' + cifre + '.']) };
    },
    // 1.6.1 · quali frazioni terminano
    (r) => {
      const giusta = r.scegli([['3/8', ''], ['5/16', ''], ['7/32', ''], ['9/64', ''], ['3/12', 'Ridotta ai minimi termini diventa 1/4.'], ['6/24', 'Ridotta ai minimi termini diventa 1/4.'], ['5/40', 'Ridotta ai minimi termini diventa 1/8.'], ['9/24', 'Ridotta ai minimi termini diventa 3/8.']]);
      const [e1, e2] = r.mescola([['1/3', 3], ['2/5', 5], ['1/6', 6], ['3/10', 10], ['7/20', 20], ['5/12', 12], ['4/9', 9], ['3/14', 14], ['1/24', 24]]).slice(0, 2);
      const perche = (d) => 'Il denominatore ' + d + ' contiene il fattore ' + (d % 3 === 0 ? 3 : d % 5 === 0 ? 5 : 7) + ', quindi la scrittura binaria è periodica.';
      return { u: '1.6.1', d: 'Quale di queste frazioni ha una scrittura binaria finita?', o: [
        { t: giusta[0], ok: true, fb: (giusta[1] ? giusta[1] + ' ' : '') + 'Il denominatore è una potenza di due, e le cifre binarie sono quindi in numero finito.' },
        { t: e1[0], fb: perche(e1[1]) },
        { t: e2[0], fb: perche(e2[1]) }] };
    },
    // 1.6.2 · dal campo esponente all'esponente vero
    (r) => {
      let E = 127; while (E === 127 || E === 130) E = r.int(118, 140);
      const giusto = E - 127;
      return { u: '1.6.2', d: 'In una parola in virgola mobile a 32 bit il campo esponente contiene ' + E + '. Quanto vale l’esponente effettivo?', segnaposto: 'Un numero, con il segno', giuste: I(giusto).concat(giusto > 0 ? ['+' + giusto] : []),
        ok: 'Il campo contiene l’esponente aumentato di 127: ' + E + ' − 127 = ' + V(giusto) + '.',
        diagnosi: [
          { se: I(E + 127), msg: 'Il campo contiene già l’esponente aumentato di 127. Per ricavarlo si sottrae.' },
          { se: I(-giusto), msg: 'La sottrazione va eseguita nell’altro verso: il campo meno 127.' },
          { se: I(E - 128), msg: 'Il numero da sottrarre è 127.' }
        ],
        altro: 'Il numero è diverso. Si sottragga 127 dal contenuto del campo.',
        indizi: ['Il campo esponente è un numero senza segno di otto bit.', 'L’esponente effettivo è il campo meno 127.', 'Il calcolo da eseguire è ' + E + ' − 127.'],
        svolgimento: ['Campo esponente: ' + E + '.', 'Esponente effettivo: ' + E + ' − 127 = ' + V(giusto) + '.', 'La potenza di due è 2 elevato a ' + V(giusto) + '.'] };
    },
    // 1.6.2 · leggere una parola intera
    (r) => {
      const [w, val] = r.scegli([[0x40000000, 2], [0x40400000, 3], [0x40800000, 4], [0x3F000000, 0.5], [0xBF800000, -1], [0xC0000000, -2], [0x40A00000, 5], [0x40200000, 2.5], [0xC0400000, -3], [0x41000000, 8], [0x3E800000, 0.25], [0x40C00000, 6], [0xC0800000, -4], [0x40E00000, 7]]);
      const S = w >>> 31, E = (w >>> 23) & 255, F = w & 0x7FFFFF, sig = 1 + F / 8388608, esp = E - 127;
      const esa = '0x' + w.toString(16).toUpperCase().padStart(8, '0'), b = w.toString(2).padStart(32, '0');
      return { u: '1.6.2', d: 'Quanto vale la parola `' + esa + '`, letta come numero in virgola mobile a 32 bit?', segnaposto: 'Un numero in base dieci', giuste: SL.scritture.decimale(val, []),
        ok: 'Il bit di segno vale ' + S + ', il campo esponente ' + E + ' e il significando ' + V(sig) + '. Il valore è ' + (S ? '−' : '') + V(sig) + ' × 2 elevato a ' + V(esp) + ', cioè ' + V(val) + '.',
        diagnosi: [
          { se: SL.scritture.decimale(-val, []), msg: 'Il valore assoluto è corretto. Va riesaminato il primo bit della parola, che è il bit di segno.' },
          { se: SL.scritture.decimale(val * 2, []).concat(SL.scritture.decimale(val / 2, [])), msg: 'Va riesaminato l’esponente. Il campo vale ' + E + ', e l’esponente effettivo è ' + E + ' − 127 = ' + V(esp) + '.' },
          { se: SL.scritture.decimale(sig * (S ? -1 : 1), []), msg: 'Questo è il significando. Va ancora moltiplicato per 2 elevato a ' + V(esp) + '.' }
        ],
        altro: 'Il valore è diverso. Si scriva la parola in binario e si separi il bit di segno, gli otto bit dell’esponente e le cifre del significando.',
        indizi: ['I primi nove bit della parola sono ' + b[0] + ' ' + b.slice(1, 9) + '.', 'Il campo esponente vale ' + E + ', e l’esponente effettivo è quindi ' + V(esp) + '.', 'Le cifre conservate cominciano con ' + b.slice(9, 12) + ': con l’uno implicito, il significando è ' + V(sig) + '.'],
        svolgimento: ['In binario: ' + b[0] + ' ' + b.slice(1, 9) + ' ' + b.slice(9, 13) + ' e poi soli zeri.', 'Segno: ' + S + (S ? ', numero negativo.' : ', numero positivo.'), 'Esponente: ' + E + ' − 127 = ' + V(esp) + '.', 'Significando: ' + V(sig) + '.', 'Valore: ' + (S ? '−' : '') + V(sig) + ' × ' + V(Math.pow(2, esp)) + ' = ' + V(val) + '.'] };
    },
    // 1.6.3 · la tacca più vicina
    (r) => {
      const grande = r.int(0, 1) === 1, base = grande ? 33554432 : 16777216, passo = grande ? 4 : 2, fine = base * 2;
      const a = r.scegli(grande ? [1, 2, 3, 5, 6, 7] : [1, 3, 5, 7]), esatta = base + a, giusto = Math.fround(esatta);
      const sotto = base + Math.floor(a / passo) * passo, sopra = sotto + passo, meta = (esatta - sotto) * 2 === passo;
      return { u: '1.6.3', d: 'In virgola mobile a 32 bit, fra ' + N(base) + ' e ' + N(fine) + ' due numeri adiacenti distano ' + passo + '. Si calcola ' + N(base) + ' + ' + a + '. Quale valore viene conservato?', segnaposto: 'Un numero intero', giuste: I(giusto),
        ok: 'La somma esatta, ' + N(esatta) + ', cade fra le tacche ' + N(sotto) + ' e ' + N(sopra) + '. ' + (meta ? 'Si trova a metà esatta, e prevale la tacca con l’ultimo bit a 0: ' + N(giusto) + '.' : 'La più vicina è ' + N(giusto) + '.'),
        diagnosi: [
          { se: I(esatta), msg: 'Questa è la somma esatta, che in tale intervallo cade fra due tacche. Il risultato viene arrotondato alla tacca più vicina.' },
          { se: I(giusto === sotto ? sopra : sotto), msg: meta ? 'La somma esatta si trova a metà fra le due tacche. In tal caso prevale quella con l’ultimo bit a 0, che è l’altra.' : 'Questa è la tacca più lontana. La somma esatta dista ' + Math.abs(esatta - giusto) + ' dall’altra.' }
        ],
        altro: 'Il valore è diverso. Si determinino le due tacche fra cui cade la somma esatta e si scelga la più vicina.',
        indizi: ['Le tacche sono ' + N(base) + ', ' + N(base + passo) + ', ' + N(base + 2 * passo) + ' e così di seguito, di ' + passo + ' in ' + passo + '.', 'La somma esatta è ' + N(esatta) + ', fra ' + N(sotto) + ' e ' + N(sopra) + '.', meta ? 'A metà esatta prevale la tacca con l’ultimo bit a 0.' : 'Prevale la tacca più vicina.'],
        svolgimento: ['Valore esatto della somma: ' + N(esatta) + '.', 'Tacche adiacenti: ' + N(sotto) + ' e ' + N(sopra) + '.', meta ? 'La somma esatta è a metà. Delle due tacche, ' + N(giusto) + ' ha l’ultimo bit del significando a 0.' : 'Distanze: ' + (esatta - sotto) + ' dalla prima e ' + (sopra - esatta) + ' dalla seconda.', 'Valore conservato: ' + N(giusto) + '.'] };
    },
    // 1.6.4 · di quanto scorre il numero più piccolo
    (r) => {
      const a = r.int(6, 9), diff = r.int(1, 5), b = a - diff, primoGrande = r.int(0, 1) === 1;
      const s1 = r.scegli(['1,000', '1,010', '1,100', '1,001']), s2 = r.scegli(['1,100', '1,110', '1,011', '1,101']);
      const e1 = primoGrande ? a : b, e2 = primoGrande ? b : a;
      return { u: '1.6.4', d: 'Per sommare ' + s1 + ' × 2 elevato a ' + e1 + ' e ' + s2 + ' × 2 elevato a ' + e2 + ', di quante posizioni deve scorrere a destra il significando del numero minore?', segnaposto: 'Un numero di posizioni', giuste: I(diff),
        ok: 'Gli esponenti sono ' + e1 + ' e ' + e2 + '. Il numero minore è il ' + (primoGrande ? 'secondo' : 'primo') + ', e il suo significando scorre di ' + a + ' − ' + b + ' = ' + diff + ' posizioni.',
        diagnosi: [
          { se: I(a + b), msg: 'Gli esponenti vanno resi uguali. È rilevante la loro differenza.' },
          { se: I(b), msg: 'Lo scorrimento porta l’esponente minore al valore del maggiore, ed è quindi pari alla differenza fra i due.' },
          { se: I(-diff), msg: 'Lo scorrimento è un numero di posizioni, senza segno.' }
        ],
        altro: 'Il numero è diverso. Si individui l’esponente minore e si calcoli quanto gli manca per raggiungere l’altro.',
        indizi: ['Prima di sommare i significandi, gli esponenti devono essere uguali.', 'Si fa scorrere a destra il numero con l’esponente minore.', 'Ogni posizione di scorrimento aumenta l’esponente di uno.'],
        svolgimento: ['Esponente maggiore: ' + a + '.', 'Esponente minore: ' + b + '.', 'Scorrimento: ' + a + ' − ' + b + ' = ' + diff + ' posizioni a destra.'] };
    }
  ] });
})();
