'use strict';
/* Prova del capitolo 2.1: sette domande sulle quattro unità. */
(() => {
  const I = SL.scritture.intero, X = SL.x86;
  const H2 = (v) => '0x' + X.esa2(v);
  const scritteEsa = (v, cifre) => { const lungo = X.u64(v).toString(16).padStart(cifre, '0'), corto = X.u64(v).toString(16); return Array.from(new Set([lungo, '0x' + lungo, lungo + 'h', corto, '0x' + corto])); };
  const V = (x) => String(x).replace('.', ',');

  SL.registraProva('2.1', { domande: [
    // 2.1.1 · una somma in AL e i suoi flag
    (r) => {
      const caso = r.int(0, 2);
      let a = 0, b = 0;
      if (caso === 0) { a = r.int(0x10, 0x6F); b = r.int(0x01, 0x7F - (a >> 1)); while (a + b > 255) b--; }
      else if (caso === 1) { a = r.int(0x90, 0xFE); b = 256 - a; }
      else { a = r.int(0x90, 0xFE); b = r.int(256 - a + 1, 0x7F + (256 - a)); if (b > 255) b = 255; }
      const vero = a + b, al = vero & 255, cf = vero > 255 ? 1 : 0, zf = al === 0 ? 1 : 0;
      const T = (x, c, z) => 'AL = ' + H2(x) + ', CF = ' + c + ', ZF = ' + z;
      const SPIEGA = 'La somma esatta è ' + H2(a) + ' + ' + H2(b) + ' = 0x' + vero.toString(16).toUpperCase() + (cf ? ', che supera gli otto bit: in AL restano le due cifre basse e CF vale 1.' : ', valore contenuto in otto bit: CF vale 0.') + (zf ? ' Il byte scritto è zero, e ZF vale quindi 1.' : ' Il byte scritto è diverso da zero, e ZF vale quindi 0.');
      const testi = Array.from(new Set([T(al, cf, zf), T(al, 1 - cf, zf), T(al, cf, 1 - zf), T(cf ? a : (al + 1) & 255, cf, zf)]));
      return { u: '2.1.1', d: 'AL contiene ' + H2(a) + '. Il processore esegue `add al, ' + H2(b) + '`. Che cosa contengono AL e i flag subito dopo?', o: testi.map((t, k) => ({ t, ok: k === 0, fb: SPIEGA })) };
    },
    // 2.1.1 · l'avanzamento di RIP
    (r) => {
      const rip = 0x401000 + 4 * r.int(1, 60), k = r.int(2, 7), dopo = rip + k, HX = (v) => '0x' + v.toString(16).toUpperCase();
      return { u: '2.1.1', d: 'RIP contiene ' + HX(rip) + '. L’istruzione che comincia a quell’indirizzo occupa ' + k + ' byte. Quanto vale RIP quando l’istruzione è stata eseguita? Si risponda in esadecimale.', segnaposto: 'Un indirizzo esadecimale', giuste: scritteEsa(dopo, 6),
        ok: 'RIP avanza oltre i byte dell’istruzione appena eseguita: ' + HX(rip) + ' + ' + k + ' = ' + HX(dopo) + '.',
        diagnosi: [
          { se: scritteEsa(rip + 1, 6), msg: 'RIP avanza di tutti i byte dell’istruzione, che in questo caso sono ' + k + '.' },
          { se: scritteEsa(rip, 6), msg: 'Questo è l’indirizzo dell’istruzione appena eseguita. Dopo l’esecuzione RIP indica quella successiva.' },
          { se: I(dopo), msg: 'Il valore è corretto. È richiesto in esadecimale.' }
        ],
        altro: 'L’indirizzo è diverso. Si sommi a RIP il numero di byte occupati dall’istruzione, eseguendo il calcolo in esadecimale.',
        indizi: ['Dopo ogni istruzione RIP indica l’istruzione successiva.', 'L’istruzione successiva comincia subito dopo l’ultimo byte di questa.', 'Il calcolo da eseguire è ' + HX(rip) + ' + ' + k + '.'],
        svolgimento: ['Indirizzo dell’istruzione: ' + HX(rip) + '.', 'Byte occupati: ' + k + '.', 'Nuovo RIP: ' + HX(rip) + ' + ' + k + ' = ' + HX(dopo) + '.'] };
    },
    // 2.1.2 · scrivere in una vista
    (r) => {
      const prima = BigInt('0x' + r.mescola(['11', '22', '33', '44', '55', '66', '77', '88', '9A', 'BC', 'DE', 'F1']).slice(0, 8).join(''));
      const vista = r.scegli(['al', 'ax', 'eax']), bit = X.larghezza(vista), b = r.int(0x01, 0xEF);
      const dopo = X.scrivi(prima, bit, b), E16 = (v) => X.esa(v, 16);
      const altre = ['al', 'ax', 'eax'].filter((v) => v !== vista).map((v) => [v, X.scrivi(prima, X.larghezza(v), b)]);
      const conserva = (prima & 0xFFFFFFFF00000000n) | BigInt(b);
      return { u: '2.1.2', d: 'RAX contiene ' + E16(prima) + '. Il processore esegue `mov ' + vista + ', ' + H2(b) + '`. Quanto vale RAX dopo l’istruzione? Si scrivano le sedici cifre esadecimali.', segnaposto: 'Sedici cifre esadecimali', giuste: scritteEsa(dopo, 16),
        ok: bit === 32 ? 'La vista EAX riceve ' + X.esa(b, 8) + ', e la scrittura a 32 bit azzera i quattro byte alti.' : 'La vista ' + vista.toUpperCase() + ' comprende ' + (bit === 8 ? 'un byte' : 'due byte') + ', che ' + (bit === 8 ? 'riceve ' : 'ricevono ') + X.esa(b, bit / 4) + '. Gli altri byte restano invariati.',
        diagnosi: altre.map((x) => ({ se: scritteEsa(x[1], 16), msg: 'Questo è il risultato di una scrittura in ' + x[0].toUpperCase() + '. La destinazione è in questo caso ' + vista.toUpperCase() + ', che comprende ' + bit / 8 + (bit === 8 ? ' byte.' : ' byte.') }))
          .concat(bit === 32 ? [{ se: scritteEsa(conserva, 16), msg: 'È stata conservata la metà alta. Una scrittura in una vista da 32 bit azzera i 32 bit alti del registro.' }] : [{ se: scritteEsa(BigInt(b), 16), msg: 'È stato azzerato tutto il resto del registro. Le viste da 8 e da 16 bit conservano gli altri byte.' }]),
        altro: 'Il valore è diverso. Si stabilisca quanti byte comprende la vista e che cosa accade ai byte esterni a essa.',
        indizi: [vista.toUpperCase() + ' indica i ' + bit + ' bit più bassi di RAX, cioè ' + bit / 8 + (bit === 8 ? ' byte.' : ' byte.'), 'L’immediato, allargato alla vista, è ' + X.esa(b, bit / 4) + '.', bit === 32 ? 'Una scrittura in una vista da 32 bit azzera i quattro byte alti.' : 'Le viste da 8 e da 16 bit lasciano invariati gli altri byte.'],
        svolgimento: ['Vista: ' + vista.toUpperCase() + ', ' + bit / 8 + ' byte.', 'Dato allargato: ' + X.esa(b, bit / 4) + '.', bit === 32 ? 'Metà alta: azzerata.' : 'Resto del registro: conservato.', 'RAX = ' + E16(dopo) + '.'] };
    },
    // 2.1.2 · un operando di memoria
    (r) => {
      const ind = 0x1000 * r.int(2, 9), byte = r.mescola([0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0x21, 0x43, 0x65]).slice(0, 4);
      const vista = r.scegli(['al', 'ax', 'eax']), n = X.larghezza(vista) / 8, IND = '0x' + ind.toString(16).toUpperCase();
      const le = byte.slice(0, n).reverse().reduce((a, b) => a * 256 + b, 0), be = byte.slice(0, n).reduce((a, b) => a * 256 + b, 0);
      return { u: '2.1.2', d: 'RBX contiene ' + IND + '. In memoria, a partire dall’indirizzo ' + IND + ', si trovano i byte `' + byte.map(X.esa2).join(' ') + '`. Che cosa contiene ' + vista.toUpperCase() + ' dopo `mov ' + vista + ', [rbx]`? Si risponda in esadecimale.', segnaposto: 'Un numero esadecimale', giuste: scritteEsa(le, 2 * n),
        ok: 'Le parentesi quadre fanno impiegare RBX come indirizzo. La vista ' + vista.toUpperCase() + ' chiede ' + (n === 1 ? 'un byte' : n + ' byte') + (n === 1 ? ', il primo: ' : ', letti in ordine little-endian: ') + X.esa(le, 2 * n) + '.',
        diagnosi: [
          { se: n > 1 ? scritteEsa(be, 2 * n) : [], msg: 'I byte sono stati scritti nell’ordine in cui compaiono in memoria. In ordine little-endian il primo byte è il meno significativo.' },
          { se: scritteEsa(ind & (n === 1 ? 0xFF : n === 2 ? 0xFFFF : 0xFFFFFFFF), 2 * n).concat(scritteEsa(ind, 4)), msg: 'Questo valore deriva dal contenuto di RBX. Con le parentesi quadre RBX ha la funzione di indirizzo, e il dato proviene dalla memoria.' },
          { se: n < 4 ? scritteEsa(byte.slice(0, 4).reverse().reduce((a, b) => a * 256 + b, 0), 8) : [], msg: 'Sono stati letti quattro byte. La vista ' + vista.toUpperCase() + ' ne chiede ' + n + '.' }
        ],
        altro: 'Il valore è diverso. Si stabilisca quanti byte richiede la vista, li si prelevi a partire dall’indirizzo contenuto in RBX e li si ricomponga in ordine little-endian.',
        indizi: ['Le parentesi quadre indicano la memoria all’indirizzo contenuto in RBX.', 'La vista ' + vista.toUpperCase() + ' è larga ' + 8 * n + ' bit, quindi si leggono ' + n + ' byte.', n === 1 ? 'Il byte all’indirizzo ' + IND + ' è ' + X.esa2(byte[0]) + '.' : 'In ordine little-endian il byte all’indirizzo più basso è il meno significativo.'],
        svolgimento: ['Indirizzo: ' + IND + ', dal contenuto di RBX.', 'Byte letti: ' + byte.slice(0, n).map(X.esa2).join(' ') + '.', n === 1 ? 'Un solo byte: nessun ordine da stabilire.' : 'Ordine little-endian: il primo byte letto è il meno significativo.', vista.toUpperCase() + ' = ' + X.esa(le, 2 * n) + '.'] };
    },
    // 2.1.3 · la traccia di quattro istruzioni
    (r) => {
      const x = r.int(2, 12), d = r.int(1, 6);
      const prog = r.scegli([
        [['mov', 'eax', x], ['mov', 'ecx', 'eax'], ['add', 'ecx', d], ['add', 'eax', 'ecx']],
        [['mov', 'eax', x], ['add', 'eax', d], ['mov', 'ecx', 'eax'], ['add', 'eax', 'ecx']],
        [['mov', 'ecx', x], ['mov', 'eax', 'ecx'], ['add', 'eax', 'eax'], ['add', 'ecx', 'eax']],
        [['mov', 'eax', x], ['mov', 'ecx', d], ['add', 'eax', 'ecx'], ['add', 'ecx', 'eax']]
      ]);
      const reg = { eax: null, ecx: null }, righe = [];
      prog.forEach(([op, dst, src]) => {
        const v = typeof src === 'number' ? src : reg[src];
        reg[dst] = op === 'mov' ? v : reg[dst] + v;
        righe.push('`' + op + ' ' + dst + ', ' + src + '`: EAX = ' + (reg.eax == null ? '?' : reg.eax) + ', ECX = ' + (reg.ecx == null ? '?' : reg.ecx) + '.');
      });
      const chiesto = r.scegli(['eax', 'ecx']), altro = chiesto === 'eax' ? 'ecx' : 'eax', N = (n) => n.toUpperCase();
      return { u: '2.1.3', d: 'Si compili la traccia di questo programma: ' + prog.map((i) => '`' + i[0] + ' ' + i[1] + ', ' + i[2] + '`').join(', ') + '. Quanto vale ' + N(chiesto) + ' al termine?', segnaposto: 'Un numero', giuste: I(reg[chiesto]),
        ok: 'L’ultima riga della traccia fornisce EAX = ' + reg.eax + ' ed ECX = ' + reg.ecx + '.',
        diagnosi: [
          { se: I(reg[altro]), msg: 'Questo è il valore finale di ' + N(altro) + '. È richiesto ' + N(chiesto) + '.' },
          { se: I(x), msg: 'Questo è il numero caricato dalla prima istruzione. Le istruzioni successive lo hanno modificato oppure copiato altrove.' },
          { se: I(x + d), msg: 'Questo valore compare a metà della traccia. La traccia va proseguita fino all’ultima riga, verificando quale registro è scritto da ciascuna istruzione.' }
        ],
        altro: 'Il valore è diverso. Si scriva una riga per istruzione, con una colonna per EAX e una per ECX, e si riporti ogni volta il registro che resta invariato.',
        indizi: ['In sintassi Intel il primo operando è la destinazione, cioè il registro che viene scritto.', 'Dopo le prime due istruzioni: ' + righe[1].split(': ')[1], 'Dopo la terza istruzione: ' + righe[2].split(': ')[1]],
        svolgimento: righe };
    },
    // 2.1.4 · cicli, periodo e CPI
    (r) => {
      const ist = r.scegli([8, 12, 16, 20, 40]), cpi = r.scegli([1.25, 1.5, 1.75, 2, 2.5]), cicli = ist * cpi, per = r.scegli([0.25, 0.5, 2, 4]), tempo = cicli * per;
      if (r.int(0, 1) === 0) return { u: '2.1.4', d: 'Un programma esegue ' + ist + ' istruzioni in ' + cicli + ' cicli, con un periodo di clock di ' + V(per) + ' ns. Quanto dura, in nanosecondi?', segnaposto: 'Un tempo in nanosecondi', giuste: SL.scritture.decimale(tempo, ['ns']),
        ok: 'Il tempo è il prodotto dei cicli per il periodo: ' + cicli + ' × ' + V(per) + ' = ' + V(tempo) + ' ns.',
        diagnosi: [
          { se: SL.scritture.decimale(ist * per, ['ns']), msg: 'Le istruzioni sono state moltiplicate per il periodo. Il tempo dipende dai cicli, che sono ' + cicli + '.' },
          { se: SL.scritture.decimale(cicli / per, ['ns']), msg: 'I cicli sono stati divisi per il periodo. I due numeri vanno moltiplicati.' },
          { se: SL.scritture.decimale(cpi, []), msg: 'Questo è il CPI, ' + cicli + ' diviso ' + ist + '. È richiesto il tempo.' }
        ],
        altro: 'Il valore è diverso. Si moltiplichi il numero di cicli per la durata di ciascuno.',
        indizi: ['Il tempo di un programma è cicli × periodo.', 'I cicli sono ' + cicli + ' e il periodo è ' + V(per) + ' ns.', 'Il numero di istruzioni occorre per il CPI, e in questo caso è estraneo al calcolo.'],
        svolgimento: ['Cicli: ' + cicli + '.', 'Periodo: ' + V(per) + ' ns.', 'Tempo: ' + cicli + ' × ' + V(per) + ' = ' + V(tempo) + ' ns.'] };
      return { u: '2.1.4', d: 'Un programma esegue ' + ist + ' istruzioni in ' + cicli + ' cicli, con un periodo di clock di ' + V(per) + ' ns. Quanto vale il suo CPI?', segnaposto: 'Un numero', giuste: SL.scritture.decimale(cpi, []),
        ok: 'Il CPI è il rapporto fra cicli e istruzioni: ' + cicli + ' ÷ ' + ist + ' = ' + V(cpi) + '.',
        diagnosi: [
          { se: SL.scritture.decimale(Math.round(1e4 * ist / cicli) / 1e4, []), msg: 'Le istruzioni sono state divise per i cicli. Il CPI conta i cicli per ogni istruzione.' },
          { se: SL.scritture.decimale(tempo, ['ns']), msg: 'Questo è il tempo del programma. Il CPI è un rapporto fra due conteggi, e il periodo ne è estraneo.' },
          { se: SL.scritture.decimale(cpi * per, []), msg: 'Questo è il tempo medio di un’istruzione, in nanosecondi. Il CPI è il solo rapporto fra cicli e istruzioni.' }
        ],
        altro: 'Il valore è diverso. Si divida il numero di cicli per il numero di istruzioni.',
        indizi: ['CPI significa cicli per istruzione.', 'I cicli sono ' + cicli + ' e le istruzioni ' + ist + '.', 'Il periodo di clock è estraneo a questo calcolo.'],
        svolgimento: ['Cicli: ' + cicli + '.', 'Istruzioni: ' + ist + '.', 'CPI: ' + cicli + ' ÷ ' + ist + ' = ' + V(cpi) + '.'] };
    },
    // 2.1.4 · istruzioni indipendenti
    (r) => {
      const [a, b, c] = r.mescola(['r8', 'r9', 'r10', 'r11', 'r12']);
      return { u: '2.1.4', d: 'Un processore ha due ALU, e ogni operazione ne occupa una per un ciclo. Quale di queste coppie di istruzioni consecutive può essere eseguita in un solo ciclo?', o: [
        { t: 'inc ' + a + ' · inc ' + b, ok: true, fb: 'Le due istruzioni operano su registri diversi, e nessuna impiega il risultato dell’altra.' },
        { t: 'inc ' + a + ' · add ' + c + ', ' + a, fb: 'La seconda istruzione legge ' + a.toUpperCase() + ', che la prima sta scrivendo. Deve attenderne il risultato.' },
        { t: 'inc ' + b + ' · inc ' + b, fb: 'Il secondo aumento parte dal risultato del primo, e le due istruzioni vanno quindi eseguite in successione.' }] };
    }
  ] });
})();
