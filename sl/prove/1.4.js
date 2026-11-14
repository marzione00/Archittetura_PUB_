'use strict';
/* Prova del capitolo 1.4: sei domande sulle quattro unità. */
(() => {
  const I = SL.scritture.intero, X = SL.scritture.esa, N = SL.num;
  const H = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0');
  const B8 = (v) => v.toString(2).padStart(8, '0');
  const BIN = (v) => B8(v).replace(/(....)(....)/, '$1 $2');
  const S8 = (v) => (v >= 128 ? v - 256 : v);
  const M = (v) => String(v).replace('-', '−');

  SL.registraProva('1.4', { domande: [
    // 1.4.1 · leggere un byte con segno
    (r) => {
      const v = r.int(0x81, 0xFE), giusto = v - 256, modulo = -(v & 127);
      return { u: '1.4.1', d: 'Il byte `' + BIN(v) + '` è un intero con segno in complemento a due. Quanto vale?', segnaposto: 'Un numero, con il segno', giuste: I(giusto),
        ok: 'Letto senza segno il byte vale ' + v + '. Il bit di segno vale 1, e si sottrae quindi 256: ' + v + ' − 256 = ' + M(giusto) + '.',
        diagnosi: [
          { se: I(v), msg: 'Questa è la lettura senza segno. Il bit di segno vale 1, e va quindi sottratto 256.' },
          { se: I(modulo), msg: 'Il primo bit è stato letto come un segno anteposto agli altri sette. In complemento a due tale bit ha peso −128.' },
          { se: I(-giusto), msg: 'Il valore assoluto è corretto. Il bit più a sinistra vale 1, e il numero è quindi negativo.' }
        ],
        altro: 'Il valore è diverso. Si sommino i pesi dei bit a 1, attribuendo al bit più a sinistra il peso −128.',
        indizi: ['Il bit più a sinistra ha peso −128, gli altri conservano i propri pesi.', 'Letto senza segno, il byte vale ' + v + '.', 'Con il bit di segno a 1, la lettura con segno è pari a quella senza segno diminuita di 256.'],
        svolgimento: ['Lettura senza segno: ' + v + '.', 'Il bit di segno vale 1.', 'Lettura con segno: ' + v + ' − 256 = ' + M(giusto) + '.'] };
    },
    // 1.4.1 · scrivere un numero negativo
    (r) => {
      const n = r.int(3, 100), v = 256 - n, inv = 255 - n;
      return { u: '1.4.1', d: 'Si scriva in complemento a due, su otto bit, il numero −' + n + '.', segnaposto: 'Otto cifre binarie', giuste: [B8(v), '0b' + B8(v)].concat(X(v, 2).filter((x) => x.length > 2)),
        ok: 'Il valore assoluto è ' + BIN(n) + '. Invertendo i bit si ottiene ' + BIN(inv) + ', e aggiungendo uno ' + BIN(v) + '.',
        diagnosi: [
          { se: [B8(n)], msg: 'Questo è il valore assoluto. Per il numero negativo vanno invertiti tutti i bit e poi va aggiunto uno.' },
          { se: [B8(inv)], msg: 'I bit sono stati invertiti. Manca l’aggiunta di uno.' },
          { se: [B8(128 | n)], msg: 'È stato posto a 1 soltanto il bit di segno. In complemento a due si invertono tutti i bit e si aggiunge uno.' }
        ],
        altro: 'La scrittura è diversa. Si parta dal valore assoluto, si invertano tutti i bit e si aggiunga uno.',
        indizi: ['Il valore assoluto, ' + n + ', in binario è ' + BIN(n) + '.', 'Invertendo tutti i bit si ottiene ' + BIN(inv) + '.', 'Resta da aggiungere uno.'],
        svolgimento: ['Valore assoluto: ' + n + ' = ' + BIN(n) + '.', 'Bit invertiti: ' + BIN(inv) + '.', 'Più uno: ' + BIN(v) + '.', 'Verifica: ' + v + ' − 256 = −' + n + '.'] };
    },
    // 1.4.2 · riporto uscente e overflow
    (r) => {
      const voluto = r.int(0, 3);
      let a = 0, b = 0, rip = false, ov = false;
      for (let giri = 0; giri < 500; giri++) {
        a = r.int(0x08, 0xF8); b = r.int(0x08, 0xF8);
        rip = a + b > 255; const s = S8(a) + S8(b); ov = s > 127 || s < -128;
        if ((rip ? 1 : 0) + (ov ? 2 : 0) === voluto) break;
      }
      const somma = a + b, veri = S8(a) + S8(b), byte = somma & 255;
      const SPIEGA = 'Senza segno la somma vale ' + somma + (rip ? ', oltre 255, e il riporto esce dalla parola.' : ', entro 255, e nessun riporto esce.') + ' Con segno gli addendi valgono ' + M(S8(a)) + ' e ' + M(S8(b)) + ', e la somma esatta, ' + M(veri) + (ov ? ', è esterna all’intervallo da −128 a 127.' : ', rientra nell’intervallo da −128 a 127.');
      const opz = (R, O) => ({ t: 'Riporto uscente ' + (R ? 'sì' : 'no') + ', overflow ' + (O ? 'sì' : 'no'), ok: R === rip && O === ov, fb: SPIEGA });
      return { u: '1.4.2', d: 'Su otto bit si calcola `' + H(a) + ' + ' + H(b) + '`. Senza segno gli addendi sono ' + a + ' e ' + b + ', con segno ' + M(S8(a)) + ' e ' + M(S8(b)) + '. Il byte ottenuto è ' + H(byte) + '. Quali segnali si accendono?',
        o: [opz(false, false), opz(true, false), opz(false, true), opz(true, true)] };
    },
    // 1.4.3 · l'estensione del segno
    (r) => {
      const v = r.int(0, 1) ? r.int(0x81, 0xFE) : r.int(0x11, 0x7E), neg = v >= 128, giusto = (neg ? 0xFF00 : 0) | v, errato = (neg ? 0 : 0xFF00) | v;
      const h4 = (x) => x.toString(16).padStart(4, '0');
      return { u: '1.4.3', d: 'Il byte `' + H(v) + '`, intero con segno, viene allargato a 16 bit. Come si scrive il risultato in esadecimale?', segnaposto: 'Quattro cifre esadecimali', giuste: [h4(giusto), '0x' + h4(giusto), h4(giusto) + 'h'],
        ok: 'Il bit di segno di ' + H(v) + ' vale ' + (neg ? 1 : 0) + ' e viene copiato nelle otto posizioni nuove. Il valore resta ' + M(S8(v)) + '.',
        diagnosi: [
          { se: [h4(errato), '0x' + h4(errato)], msg: neg ? 'Le nuove posizioni sono state riempite con zeri. Il numero è negativo, e il bit di segno, che vale 1, va copiato in tutte.' : 'Le nuove posizioni sono state riempite con 1. Il numero è positivo, e il bit di segno, che vale 0, va copiato in tutte.' },
          { se: SL.scritture.esa(v, 2), msg: 'Questo è ancora il byte di partenza. Il risultato occupa 16 bit, cioè quattro cifre esadecimali.' },
          { se: [h4(v << 8), '0x' + h4(v << 8)], msg: 'Le posizioni nuove si aggiungono a sinistra, dalla parte dei bit più significativi.' }
        ],
        altro: 'La scrittura è diversa. Si individui il bit di segno del byte e lo si copi nelle otto posizioni aggiunte a sinistra.',
        indizi: ['In binario ' + H(v) + ' è ' + BIN(v) + '.', 'Il bit di segno vale ' + (neg ? 1 : 0) + '.', 'Otto bit tutti a ' + (neg ? '1 si scrivono FF.' : '0 si scrivono 00.')],
        svolgimento: [H(v) + ' in binario: ' + BIN(v) + '.', 'Bit di segno: ' + (neg ? 1 : 0) + '.', 'Le otto posizioni nuove ricevono ' + (neg ? 1 : 0) + ': ' + (neg ? 'FF' : '00') + '.', 'Risultato: 0x' + h4(giusto).toUpperCase() + ', che vale ancora ' + M(S8(v)) + '.'] };
    },
    // 1.4.3 · int e unsigned int nello stesso confronto
    (r) => {
      const k = r.int(1, 9), m = r.int(2, 50), grande = 4294967296 - k;
      return { u: '1.4.3', d: 'In un programma C, n è un int che vale −' + k + ' e limite è un unsigned int che vale ' + m + '. Entrambi occupano 32 bit. Che cosa risponde il confronto `n < limite`?', o: [
        { t: 'Falso', ok: true, fb: 'Il C converte n in unsigned int. I bit restano gli stessi e vengono letti come ' + N(grande) + ', valore maggiore di ' + m + '.' },
        { t: 'Vero', fb: 'In aritmetica −' + k + ' è minore di ' + m + '. Il C converte tuttavia n in unsigned int, e tali bit letti senza segno valgono ' + N(grande) + '.' },
        { t: 'Dipende dal valore di limite', fb: 'Convertito in unsigned int, n vale ' + N(grande) + ', un numero prossimo al massimo del tipo. Un limite di ' + m + ' resta sempre minore.' }] };
    },
    // 1.4.4 · la precondizione di un prodotto
    (r) => {
      const corto = r.int(0, 2) > 0, max = corto ? 255 : 65535, b = corto ? r.scegli([6, 7, 9, 11, 12, 14, 18, 20, 30, 40, 60]) : r.scegli([100, 200, 256, 300, 500, 1000]);
      const q = Math.floor(max / b), resto = max - q * b;
      return { u: '1.4.4', d: 'Un prodotto A × ' + b + ' deve essere contenuto in ' + (corto ? 'un byte senza segno, il cui massimo è 255' : 'un intero senza segno di 16 bit, il cui massimo è 65 535') + '. Qual è il massimo valore che A può assumere?', segnaposto: 'Un numero', giuste: I(q),
        ok: 'La divisione intera ' + N(max) + ' ÷ ' + b + ' dà ' + q + '. Con tale valore il prodotto è ' + N(q * b) + ', mentre con ' + (q + 1) + ' sarebbe ' + N((q + 1) * b) + '.',
        diagnosi: [
          { se: I(q + 1), msg: 'Con ' + (q + 1) + ' il prodotto vale ' + N((q + 1) * b) + ', oltre il massimo. Del quoziente si conserva la parte intera, scartando il resto.' },
          { se: I(q - 1), msg: 'Anche ' + q + ' va bene: ' + q + ' × ' + b + ' = ' + N(q * b) + ', valore entro il massimo.' },
          { se: I(max), msg: 'Questo è il massimo del tipo. Il valore cercato è il massimo diviso per ' + b + '.' }
        ],
        altro: 'Il numero è diverso. Il prodotto è contenuto nella destinazione quando A è minore o uguale al quoziente intero del massimo diviso per ' + b + '.',
        indizi: ['La precondizione è: A ≤ ' + N(max) + ' ÷ ' + b + ', con la divisione intera.', 'La divisione intera scarta il resto.', N(max) + ' ÷ ' + b + ' dà ' + q + ' con il resto di ' + resto + '.'],
        svolgimento: ['Precondizione: A ≤ ' + N(max) + ' ÷ ' + b + '.', 'Divisione intera: quoziente ' + q + ', resto ' + resto + '.', 'Verifica: ' + q + ' × ' + b + ' = ' + N(q * b) + ', entro il massimo.', 'Con ' + (q + 1) + ' il prodotto sarebbe ' + N((q + 1) * b) + ', oltre il massimo.'] };
    }
  ] });
})();
