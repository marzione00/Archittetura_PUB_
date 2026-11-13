'use strict';
/* Prova del capitolo 2.2: una domanda per unità. */
(() => {
  const I = SL.scritture.intero, X = SL.x86, N = X.num;
  const H2 = (v) => '0x' + X.esa2(v), PAR = (v) => (v < 0 ? '(' + N(v) + ')' : N(v));

  SL.registraProva('2.2', { domande: [
    // 2.2.1 · CF e OF dopo una somma su otto bit
    (r) => {
      const voluto = r.int(0, 3);
      let a = 0, b = 0, c = null;
      for (let giri = 0; giri < 400; giri++) { a = r.int(0x08, 0xF8); b = r.int(0x08, 0xF8); c = X.somma(a, b, 8); if (c.cf + 2 * c.of === voluto) break; }
      const SPIEGA = 'Senza segno la somma vera vale ' + c.vero + (c.cf ? ', oltre 255: CF vale 1.' : ', entro 255: CF vale 0.') + ' Con segno gli addendi valgono ' + N(c.sa) + ' e ' + N(c.sb) + ', e la somma vera, ' + N(c.sv) + (c.of ? ', esce dall’intervallo da −128 a 127: OF vale 1.' : ', sta nell’intervallo da −128 a 127: OF vale 0.');
      const opz = (cf, of, t) => ({ t, ok: cf === c.cf && of === c.of, fb: SPIEGA });
      return { u: '2.2.1', d: 'Su otto bit il processore calcola `' + H2(a) + ' + ' + H2(b) + '`. Quali flag valgono 1 fra CF e OF?', o: [opz(0, 0, 'Nessuno dei due'), opz(1, 0, 'Soltanto CF'), opz(0, 1, 'Soltanto OF'), opz(1, 1, 'CF e OF')] };
    },
    // 2.2.2 · tre argomenti, tre istruzioni
    (r) => {
      const a = r.int(2, 9), b = r.scegli([-6, -4, -3, 3, 5, 7, 8]), c = r.int(1, 12), forma = r.int(0, 1);
      const R = { edi: a, esi: b, edx: c }, ord = forma === 0 ? ['edi', 'esi', 'edx'] : ['esi', 'edx', 'edi'];
      const x = R[ord[0]], y = R[ord[1]], z = R[ord[2]], prod = x * y, fin = prod + z;
      const righe = ['`mov eax, ' + ord[0] + '`', '`imul eax, ' + ord[1] + '`', '`add eax, ' + ord[2] + '`'];
      return { u: '2.2.2', d: 'All’ingresso di una funzione EDI = ' + a + ', ESI = ' + N(b) + ' ed EDX = ' + c + '. Il corpo è ' + righe.join(', ') + '. Quanto vale EAX al ritorno?', segnaposto: 'Un numero, con il segno', giuste: I(fin),
        ok: 'Il prodotto ' + PAR(x) + ' × ' + PAR(y) + ' vale ' + N(prod) + '. Sommando ' + PAR(z) + ' si ottiene ' + N(fin) + '.',
        diagnosi: [
          { se: I(x * (y + z)), msg: 'Hai sommato prima di moltiplicare. Le istruzioni eseguono prima il prodotto, poi la somma.' },
          { se: I(prod), msg: 'Questo è il prodotto. Manca l’ultima istruzione, che aggiunge il contenuto di ' + ord[2].toUpperCase() + '.' },
          { se: I(Math.abs(prod) + z).concat(I(-fin)), msg: 'Controlla il segno del prodotto: IMUL moltiplica interi con segno.' },
          { se: I(a * b + c), msg: 'Guarda quali registri compaiono nelle tre istruzioni, e in quale ordine: il primo fattore viene da ' + ord[0].toUpperCase() + '.' }
        ],
        altro: 'Il valore è diverso. Compila la traccia di EAX, una riga per istruzione.',
        indizi: ['Dopo la prima istruzione EAX vale ' + N(x) + '.', 'Dopo la seconda EAX vale ' + PAR(x) + ' × ' + PAR(y) + ' = ' + N(prod) + '.', 'La terza aggiunge il contenuto di ' + ord[2].toUpperCase() + ', che vale ' + N(z) + '.'],
        svolgimento: [righe[0] + ': EAX = ' + N(x) + '.', righe[1] + ': EAX = ' + PAR(x) + ' × ' + PAR(y) + ' = ' + N(prod) + '.', righe[2] + ': EAX = ' + N(prod) + ' + ' + PAR(z) + ' = ' + N(fin) + '.'] };
    },
    // 2.2.3 · quoziente e resto di DIV
    (r) => {
      const b = r.int(3, 12); let a = r.int(20, 200); if (a % b === 0) a += 1;
      const q = Math.floor(a / b), resto = a % b, chiede = r.scegli(['rax', 'rdx']), giusto = chiede === 'rax' ? q : resto;
      return { u: '2.2.3', d: 'RDX contiene 0, RAX contiene ' + a + ' e RCX contiene ' + b + '. Quanto vale ' + chiede.toUpperCase() + ' dopo `div rcx`?', segnaposto: 'Un numero', giuste: I(giusto),
        ok: 'Il divisore ' + b + ' sta ' + q + ' volte in ' + a + ', con il resto di ' + resto + '. Il quoziente va in RAX e il resto in RDX.',
        diagnosi: [
          { se: I(chiede === 'rax' ? resto : q), msg: chiede === 'rax' ? 'Questo è il resto, che va in RDX. RAX riceve il quoziente.' : 'Questo è il quoziente, che va in RAX. RDX riceve il resto.' },
          { se: I(a), msg: 'Questo è il dividendo. Dopo DIV, RAX contiene il quoziente e RDX il resto.' },
          { se: chiede === 'rdx' ? ['0'] : I(q + 1), msg: chiede === 'rdx' ? 'Zero era il contenuto di RDX prima della divisione. DIV vi scrive il resto.' : 'Il quoziente è intero e si ferma prima: ' + (q + 1) + ' × ' + b + ' supera ' + a + '.' }
        ],
        altro: 'Il valore è diverso. Calcola quante volte ' + b + ' sta in ' + a + ' e che cosa avanza.',
        indizi: ['DIV scrive il quoziente in RAX e il resto in RDX.', b + ' sta ' + q + ' volte in ' + a + '.', q + ' × ' + b + ' fa ' + q * b + '.'],
        svolgimento: ['Dividendo: RDX:RAX = ' + a + '.', 'Quoziente: ' + a + ' ÷ ' + b + ' = ' + q + ', scritto in RAX.', 'Resto: ' + a + ' − ' + q * b + ' = ' + resto + ', scritto in RDX.', 'Verifica: ' + q + ' × ' + b + ' + ' + resto + ' = ' + a + '.'] };
    },
    // 2.2.4 · il valore scritto da una LEA
    (r) => {
      const x = r.int(2, 20), y = r.int(2, 9), s = r.scegli([2, 4, 8]), d = r.scegli([-6, -4, 3, 5, 8, 12]), giusto = x + y * s + d;
      const ESPR = '[rdi + rsi*' + s + (d < 0 ? ' - ' + (-d) : ' + ' + d) + ']';
      return { u: '2.2.4', d: 'RDI contiene ' + x + ' e RSI contiene ' + y + '. Quanto vale RAX dopo `lea rax, ' + ESPR + '`?', segnaposto: 'Un numero', giuste: I(giusto),
        ok: 'L’espressione vale base + indice × scala + spiazzamento: ' + x + ' + ' + y + ' × ' + s + (d < 0 ? ' − ' + (-d) : ' + ' + d) + ' = ' + N(giusto) + '.',
        diagnosi: [
          { se: I((x + y) * s + d), msg: 'La scala moltiplica soltanto l’indice, cioè RSI. La base si somma dopo.' },
          { se: I(x + y * s), msg: 'Manca lo spiazzamento, la costante scritta in fondo all’espressione.' },
          { se: I(x + y + s + d), msg: 'La scala moltiplica l’indice: ' + y + ' × ' + s + '.' },
          { se: I(x + y * s - d), msg: 'Controlla il segno dello spiazzamento.' }
        ],
        altro: 'Il valore è diverso. Calcola prima indice × scala, poi somma la base e lo spiazzamento.',
        indizi: ['La base è RDI, l’indice è RSI, la scala è ' + s + '.', 'Indice × scala: ' + y + ' × ' + s + ' = ' + y * s + '.', 'Lo spiazzamento vale ' + N(d) + '.'],
        svolgimento: ['Indice × scala: ' + y + ' × ' + s + ' = ' + y * s + '.', 'Più la base: ' + y * s + ' + ' + x + ' = ' + (y * s + x) + '.', 'Più lo spiazzamento: ' + (y * s + x) + (d < 0 ? ' − ' + (-d) : ' + ' + d) + ' = ' + N(giusto) + '.'] };
    },
    // 2.2.5 · stesso numero, flag diversi
    (r) => {
      const add = r.int(0, 1) === 1, x = r.scegli([0, 6, 41, 4294967295]), z = r.int(0, 1), dopo = (x + 1) % 4294967296, zf = add ? (dopo === 0 ? 1 : 0) : z;
      const HX = (v) => (v > 99 ? '0xFFFFFFFF' : String(v)), T = (e, f) => 'EAX = ' + e + ', ZF = ' + f;
      const SPIEGA = add ? 'ADD scrive ZF in base al risultato, che vale ' + dopo + (dopo === 0 ? ': ZF diventa 1.' : ': ZF diventa 0.') : 'LEA scrive il registro e lascia i flag com’erano: ZF conserva il valore ' + z + '.';
      return { u: '2.2.5', d: 'EAX contiene ' + HX(x) + ' e ZF vale ' + z + '. Il processore esegue `' + (add ? 'add eax, 1' : 'lea eax, [rax + 1]') + '`. Che cosa contengono EAX e ZF subito dopo?', o: [
        { t: T(dopo, zf), ok: true, fb: SPIEGA },
        { t: T(dopo, 1 - zf), fb: SPIEGA },
        { t: T(HX(x), z), fb: 'L’istruzione aumenta EAX di uno, quindi il registro cambia. ' + SPIEGA }] };
    },
    // 2.2.6 · i quattro flag di una sottrazione
    (r) => {
      const a = r.scegli([0x05, 0x10, 0x7F, 0x80, 0x90, 0xC8, 0x00, 0x64]); let b = r.scegli([0x01, 0x05, 0x0A, 0x64, 0x80, 0xC8, 0xFF]);
      const c = X.differenza(a, b, 8), T = (f) => 'CF = ' + f[0] + ', OF = ' + f[1] + ', SF = ' + f[2] + ', ZF = ' + f[3], giusta = [c.cf, c.of, c.sf, c.zf];
      const SPIEGA = 'Il risultato conservato è ' + H2(c.r) + '. Senza segno ' + a + ' − ' + b + (c.cf ? ' chiede un prestito: CF = 1.' : ' si calcola senza prestiti: CF = 0.') + ' Con segno la differenza vera è ' + N(c.sv) + (c.of ? ', fuori dall’intervallo: OF = 1.' : ', dentro l’intervallo: OF = 0.') + ' Il bit più a sinistra del risultato vale ' + c.sf + ', quindi SF = ' + c.sf + '.';
      const altre = [[1 - c.cf, c.of, c.sf, c.zf], [c.cf, 1 - c.of, c.sf, c.zf], [c.cf, c.of, 1 - c.sf, c.zf]];
      return { u: '2.2.6', d: 'AL contiene ' + H2(a) + ' e il processore esegue `sub al, ' + H2(b) + '`. Quanto valgono i quattro flag?', o: [{ t: T(giusta), ok: true, fb: SPIEGA }].concat(altre.map((f) => ({ t: T(f), fb: SPIEGA }))) };
    },
    // 2.2.7 · il valore restituito da score
    (r) => {
      const a = r.int(1, 9), c = r.int(0, 9), b = r.scegli([3, 9, 10, 11, 50, -1, -7]), bu = b < 0 ? b + 4294967296 : b, cand = 7 * a + c, salta = bu < 10, ris = salta ? cand : -cand;
      return { u: '2.2.7', d: 'Una funzione riceve a = ' + a + ' in EDI, b = ' + N(b) + ' in ESI e c = ' + c + ' in EDX. Il suo corpo è `lea eax, [rdi*8]`, `sub eax, edi`, `add eax, edx`, `cmp esi, 10`, `jb fine`, `neg eax`, e all’etichetta fine c’è `ret`. Che valore restituisce?', segnaposto: 'Un numero, con il segno', giuste: I(ris),
        ok: 'Il candidato vale 7 × ' + a + ' + ' + c + ' = ' + cand + '. Letto senza segno, b vale ' + SL.num(bu) + (salta ? ', minore di 10: il salto parte e il candidato viene restituito com’è.' : ', almeno 10: il salto resta fermo e NEG cambia il segno.'),
        diagnosi: [
          { se: I(-ris), msg: salta ? 'Il valore di b è minore di 10, quindi JB salta e NEG viene scavalcata.' : b < 0 ? 'Il confronto è senza segno: per JB il valore ' + N(b) + ' è ' + SL.num(bu) + ', ben oltre 10. Il salto resta fermo e NEG cambia il segno.' : 'Il valore di b non è minore di 10, quindi JB resta fermo e NEG cambia il segno.' },
          { se: I(7 * a).concat(I(-7 * a)), msg: 'Il candidato comprende anche c: dopo le prime due istruzioni viene `add eax, edx`.' },
          { se: I(8 * a + c).concat(I(-(8 * a + c))), msg: 'Dopo `lea eax, [rdi*8]` viene `sub eax, edi`: il coefficiente di a è 7.' }
        ],
        altro: 'Il valore è diverso. Calcola prima il candidato 7a + c, poi stabilisci se il salto parte.',
        indizi: ['Le prime tre istruzioni lasciano in EAX il valore 7a + c.', 'CMP e JB confrontano b con 10, leggendo b senza segno.', 'Se il salto resta fermo, NEG cambia il segno di EAX.'],
        svolgimento: ['Candidato: 7 × ' + a + ' + ' + c + ' = ' + cand + '.', 'Confronto senza segno: b vale ' + SL.num(bu) + (salta ? ', minore di 10. CF = 1.' : ', almeno 10. CF = 0.'), salta ? 'JB salta a fine, e NEG viene scavalcata.' : 'JB resta fermo, e NEG cambia il segno.', 'Valore restituito: ' + N(ris) + '.'] };
    }
  ] });
})();
