'use strict';
/* Prova del capitolo 1.7: una domanda per unità, tutte sul record TLM1 e sui suoi dintorni. */
(() => {
  const I = SL.scritture.intero, N = SL.num, T = SL.tlm;
  const H = (v) => v.toString(16).toUpperCase().padStart(2, '0');
  const BIN = (v) => v.toString(2).padStart(8, '0').replace(/(....)(....)/, '$1 $2');
  const gradi = (d) => [T.gradi(d).replace('−', '-').replace(',', '.')].concat(d % 10 === 0 ? [String(d / 10)] : []);
  const risposteGradi = (d) => gradi(d).flatMap((x) => (x[0] === '-' ? [x, '−' + x.slice(1)] : [x])).flatMap((x) => [x, x + '°c', x + '°', x + 'gradi']);

  SL.registraProva('1.7', { domande: [
    // 1.7.1 · dove si ferma il cursore
    (r) => {
      const n = r.int(3, 8), tot = 11 + n, confini = [0, 4, 5, 5 + n, 7 + n, tot], nomi = ['la firma', 'la lunghezza del nome', 'il nome', 'la temperatura', 'la tensione'];
      const k = r.int(2, tot - 1);
      let j = 0; while (j < 5 && confini[j + 1] <= k) j++;
      const giusto = confini[j];
      return { u: '1.7.1', d: 'Di un record TLM1 con un nome di ' + n + ' byte sono arrivati i primi ' + k + ' byte. Su quale byte si ferma il cursore del lettore?', segnaposto: 'Il numero di un byte', giuste: I(giusto),
        ok: 'Il primo campo incompleto è ' + nomi[j] + ', che comincia al byte ' + giusto + ' e finirebbe al byte ' + (confini[j + 1] - 1) + '. Il cursore resta al suo inizio.',
        diagnosi: [
          { se: I(k), msg: 'Il cursore avanza soltanto di campi interi. I byte arrivati dopo l’inizio di un campo incompleto restano da parte.' },
          { se: I(k - 1), msg: 'Il cursore indica il primo byte ancora da leggere, e si ferma all’inizio del campo incompleto.' },
          { se: I(confini[j + 1]), msg: 'Quel campo è incompleto: finirebbe al byte ' + (confini[j + 1] - 1) + ', e l’ultimo byte arrivato è il numero ' + (k - 1) + '.' },
          { se: j > 0 ? I(confini[j - 1]) : [], msg: 'Il campo che comincia lì è arrivato per intero, quindi il cursore lo supera.' }
        ],
        altro: 'La posizione è diversa. Elenca i campi con il byte in cui cominciano e trova il primo che i byte arrivati lasciano incompleto.',
        indizi: ['Con un nome di ' + n + ' byte i campi cominciano ai byte 0, 4, 5, ' + (5 + n) + ' e ' + (7 + n) + '.', 'Sono arrivati i byte da 0 a ' + (k - 1) + '.', 'Il primo campo incompleto è ' + nomi[j] + '.'],
        svolgimento: ['Firma: byte da 0 a 3. Lunghezza: byte 4. Nome: byte da 5 a ' + (4 + n) + '.', 'Temperatura: byte ' + (5 + n) + ' e ' + (6 + n) + '. Tensione: byte da ' + (7 + n) + ' a ' + (tot - 1) + '.', 'Byte arrivati: da 0 a ' + (k - 1) + '.', 'Il primo campo incompleto è ' + nomi[j] + ': il cursore si ferma sul byte ' + giusto + '.'] };
    },
    // 1.7.2 · i due byte della temperatura
    (r) => {
      let d = 0; while (d === 0 || d === -25 || d === -35) d = r.int(0, 2) === 0 ? r.int(5, 450) : -r.int(5, 300);
      const w = (d + 65536) % 65536, b0 = w & 255, b1 = w >> 8, be = T.temperatura([b1, b0]);
      const HW = '0x' + H(b1) + H(b0);
      return { u: '1.7.2', d: 'In un record TLM1 i due byte della temperatura sono `' + H(b0) + ' ' + H(b1) + '`. Quanti gradi indica il campo?', segnaposto: 'Una temperatura in gradi', giuste: risposteGradi(d),
        ok: 'I byte formano ' + HW + ', cioè ' + N(w) + (d < 0 ? '. Con il segno: ' + N(w) + ' − 65 536 = ' + T.virgola(d) + ' decimi' : ' decimi') + ', quindi ' + T.gradi(d) + ' gradi.',
        diagnosi: [
          { se: I(d), msg: 'Hai trovato l’intero giusto. Manca il fattore di scala: l’intero conta decimi di grado.' },
          { se: d < 0 ? risposteGradi(w).concat(I(w)) : [], msg: 'Hai letto la parola come intero senza segno. Il bit di segno vale 1, quindi va tolto 65 536.' },
          { se: risposteGradi(be).concat(I(be)), msg: 'Hai letto i byte nell’ordine in cui arrivano. Il campo è little-endian, quindi la parola è ' + HW + '.' },
          { se: d < 0 ? risposteGradi(-d) : [], msg: 'Il valore assoluto è giusto. Controlla il bit di segno della parola ' + HW + '.' }
        ],
        altro: 'Il valore è diverso. Procedi in tre mosse: ordine dei byte, segno, fattore di scala.',
        indizi: ['In little-endian il secondo byte è il più significativo: la parola è ' + HW + '.', 'Come intero senza segno ' + HW + ' vale ' + N(w) + ', e il suo bit di segno vale ' + (d < 0 ? 1 : 0) + '.', d < 0 ? N(w) + ' − 65 536 = ' + T.virgola(d) + ' decimi di grado.' : 'L’intero conta decimi di grado: va diviso per dieci.'],
        svolgimento: ['Ordine dei byte: ' + H(b0) + ' ' + H(b1) + ' diventa ' + HW + '.', 'Senza segno: ' + HW + ' = ' + N(w) + '.', d < 0 ? 'Con segno: ' + N(w) + ' − 65 536 = ' + T.virgola(d) + '.' : 'Il bit di segno vale 0, quindi il valore con segno è lo stesso.', 'Fattore di scala: ' + T.virgola(d) + ' ÷ 10 = ' + T.gradi(d) + ' gradi.'] };
    },
    // 1.7.3 · la precondizione prima di riservare memoria
    (r) => {
      const MAX = 4294967295, A = r.scegli([1000, 4096, 10000, 32768, 50000, 65537, 100000]), q = Math.floor(MAX / A), resto = MAX - q * A;
      return { u: '1.7.3', d: 'Un intero senza segno di 32 bit arriva a 4 294 967 295. Se l’altezza dichiarata di un’immagine è ' + N(A) + ', qual è la larghezza più grande per cui il prodotto larghezza × altezza entra nel tipo?', segnaposto: 'Un numero di pixel', giuste: I(q),
        ok: 'La divisione intera 4 294 967 295 ÷ ' + N(A) + ' dà ' + N(q) + '. Con quella larghezza il prodotto vale ' + N(q * A) + '.',
        diagnosi: [
          { se: I(q + 1), msg: 'Con ' + N(q + 1) + ' il prodotto vale ' + N((q + 1) * A) + ', oltre il massimo. Il quoziente va preso intero, scartando il resto.' },
          { se: I(MAX), msg: 'Questo è il massimo del tipo. La larghezza cercata è il massimo diviso per l’altezza.' },
          { se: I(q - 1), msg: 'Anche ' + N(q) + ' va bene: il prodotto vale ' + N(q * A) + ', entro il massimo.' }
        ],
        altro: 'Il numero è diverso. Applica la precondizione: la larghezza deve essere al più il massimo diviso per l’altezza.',
        indizi: ['La precondizione è: larghezza ≤ massimo ÷ altezza, con la divisione intera.', 'La divisione intera scarta il resto.', '4 294 967 295 ÷ ' + N(A) + ' dà ' + N(q) + ' con il resto di ' + N(resto) + '.'],
        svolgimento: ['Precondizione: larghezza ≤ 4 294 967 295 ÷ ' + N(A) + '.', 'Divisione intera: quoziente ' + N(q) + ', resto ' + N(resto) + '.', 'Verifica: ' + N(q) + ' × ' + N(A) + ' = ' + N(q * A) + ', entro il massimo.', 'Con ' + N(q + 1) + ' il prodotto sarebbe ' + N((q + 1) * A) + ', oltre il massimo.'] };
    },
    // 1.7.4 · forma e politica di un byte di autorizzazione
    (r) => {
      const caso = r.int(0, 2);
      let v = 0;
      if (caso === 0) v = 1 | r.scegli([2, 4, 6]);                                  // ben formato, consentito
      else if (caso === 1) v = r.scegli([0, 1, 2, 4, 6]);                           // ben formato, negato
      else v = r.scegli([0x08, 0x10, 0x20, 0x40, 0x80]) | r.int(0, 7);              // un bit riservato acceso
      const W = v & 1, O = (v >> 1) & 1, A = (v >> 2) & 1, ris = v & 0xF8, pol = W & (O | A);
      const esito = ris ? 'forma' : pol ? 'ok' : 'politica';
      const FORMA = 'Il byte AND 0xF8 dà 0x' + H(ris) + (ris ? ', diverso da zero: un bit riservato è acceso.' : ', cioè zero: i bit riservati sono spenti.');
      const POL = 'I tre bit di destra valgono W = ' + W + ', O = ' + O + ', A = ' + A + ', e la regola W AND (O OR A) dà ' + pol + '.';
      return { u: '1.7.4', d: 'Nel formato dell’unità 1.7.4 il bit 0 è W, il bit 1 è O, il bit 2 è A, e gli altri cinque bit sono riservati. Arriva il byte `0x' + H(v) + '`, in binario ' + BIN(v) + '. Che cosa fa il programma?', o: [
        { t: 'Consente la modifica', ok: esito === 'ok', fb: esito === 'ok' ? FORMA + ' ' + POL : esito === 'forma' ? FORMA + ' La forma va controllata per prima, e ferma la richiesta.' : FORMA + ' ' + POL },
        { t: 'Rifiuta: byte malformato', ok: esito === 'forma', fb: esito === 'forma' ? FORMA + ' La politica viene lasciata da parte.' : FORMA + ' Il byte rispetta il formato, quindi la decisione spetta alla politica.' },
        { t: 'Rifiuta: accesso negato', ok: esito === 'politica', fb: esito === 'politica' ? FORMA + ' ' + POL : esito === 'forma' ? FORMA + ' Il rifiuto arriva prima della politica, per la forma del byte.' : FORMA + ' ' + POL }] };
    },
    // 1.7.5 · quali importi entrano esatti
    (r) => {
      const mcd = (a, b) => (b ? mcd(b, a % b) : a);
      const fraz = (mill) => { const g = mcd(mill, 1000); return [mill / g, 1000 / g]; };
      const E = (mill) => (mill / 1000).toFixed(mill % 10 ? 3 : 2).replace('.', ',') + ' €';
      const giusta = r.scegli([250, 500, 750, 125, 375, 1500, 2250, 625]);
      const [e1, e2] = r.mescola([100, 200, 300, 400, 600, 700, 800, 900, 50, 150, 350, 10, 1100, 2200]).slice(0, 2);
      const fb = (mill) => { const f = fraz(mill); return E(mill).replace(' €', ' euro') + ' sono la frazione ' + f[0] + '/' + f[1] + '. Il denominatore ' + (f[1] & (f[1] - 1) ? 'contiene il fattore 5, quindi la scrittura binaria è periodica.' : 'è una potenza di due, quindi la scrittura binaria termina.'); };
      return { u: '1.7.5', d: 'Quale di questi importi entra esatto in un numero in virgola mobile?', o: [
        { t: E(giusta), ok: true, fb: fb(giusta) }, { t: E(e1), fb: fb(e1) }, { t: E(e2), fb: fb(e2) }] };
    },
    // 1.7.6 · il lavoro della shell e quello del programma
    (r) => {
      const f = r.scegli(['misura.bin', 'dati.bin', 'record.bin', 'nord.bin']);
      return r.scegli([
        { u: '1.7.6', d: 'Dopo il comando `./lettore < ' + f + '` sul terminale compare «bash: ' + f + ': File o directory non esistente». Quale affermazione è vera?', o: [
          { t: 'Il programma lettore è rimasto sul disco', ok: true, fb: 'Il messaggio comincia con il nome della shell. L’apertura del file è fallita prima dell’avvio, e nessuna istruzione di lettore è stata eseguita.' },
          { t: 'Il programma ha letto una firma sbagliata', fb: 'Una firma sbagliata verrebbe segnalata dal programma, con un messaggio suo.' },
          { t: 'Il programma ha trovato il file vuoto', fb: 'Un file vuoto esiste, e la shell lo collega senza errori. Qui il file manca.' }] },
        { u: '1.7.6', d: 'Il file ' + f + ' esiste ed è vuoto. Che cosa succede con il comando `./lettore < ' + f + '`?', o: [
          { t: 'Il programma parte, riceve zero byte e segnala un record incompleto', ok: true, fb: 'L’apertura riesce. Alla prima lettura il programma chiede i quattro byte della firma e ne riceve zero.' },
          { t: 'La shell segnala un errore e il programma resta sul disco', fb: 'Per la shell un file vuoto si apre come qualunque altro. Il contenuto resta fuori dal suo controllo.' },
          { t: 'Il programma parte e stampa una misura con i valori a zero', fb: 'Senza byte da leggere il primo campo è incompleto, e il programma si ferma lì.' }] },
        { u: '1.7.6', d: 'Nel comando `./lettore < ' + f + '`, in quale momento viene aperto il file ' + f + '?', o: [
          { t: 'Prima che lettore venga caricato, nel processo figlio della shell', ok: true, fb: 'La redirezione è una richiesta rivolta alla shell, che la prepara prima di sostituire il programma del figlio con lettore.' },
          { t: 'Quando lettore chiede i primi byte', fb: 'Alla prima lettura il collegamento esiste già, preparato dalla shell.' },
          { t: 'Quando lettore termina', fb: 'A quel punto il file è già stato letto. L’apertura precede l’avvio del programma.' }] },
        { u: '1.7.6', d: 'Dopo il comando `./lettore < ' + f + '` sul terminale compare «lettore: firma non riconosciuta». Che cosa si può affermare con certezza?', o: [
          { t: 'Il file esiste, e il programma ne ha letto l’inizio', ok: true, fb: 'Il messaggio viene dal programma, che quindi è partito. Per confrontare la firma ha dovuto ricevere i primi byte.' },
          { t: 'Il file ' + f + ' manca', fb: 'Se il file mancasse, il messaggio verrebbe dalla shell e il programma resterebbe sul disco.' },
          { t: 'Il file ' + f + ' è vuoto', fb: 'Da un file vuoto il programma riceverebbe zero byte, e segnalerebbe un record incompleto.' }] }
      ]);
    },
    // 1.7.7 · codificare una temperatura, oppure giudicare una tensione
    (r) => {
      if (r.int(0, 1) === 0) {
        let d = 0; while (d === 0 || d === -10 || d === -35) d = r.int(0, 3) === 0 ? r.int(5, 400) : -r.int(5, 300);
        const w = (d + 65536) % 65536, b0 = w & 255, b1 = w >> 8, piu = Math.abs(d), g = (H(b0) + H(b1)).toLowerCase(), inv = (H(b1) + H(b0)).toLowerCase();
        const pos = (H(piu & 255) + H(piu >> 8)).toLowerCase(), scritte = (x) => [x, '0x' + x.slice(0, 2) + '0x' + x.slice(2), x.slice(0, 2) + '.' + x.slice(2), x.slice(0, 2) + '-' + x.slice(2)];
        return { u: '1.7.7', d: 'Codifica la temperatura di ' + T.gradi(d) + ' gradi per un record TLM1. Scrivi i due byte nell’ordine in cui compaiono nel record.', segnaposto: 'Due byte, per esempio 1A 2B', giuste: scritte(g),
          ok: T.gradi(d) + ' gradi sono ' + T.virgola(d) + ' decimi. Su sedici bit' + (d < 0 ? ': 65 536 − ' + piu + ' = ' + N(w) + ', cioè' : ' l’intero è') + ' 0x' + H(b1) + H(b0) + '. In ordine little-endian: ' + H(b0) + ' ' + H(b1) + '.',
          diagnosi: [
            { se: scritte(inv).concat(['0x' + inv]), msg: 'La parola è giusta. Nel record i byte vanno in ordine little-endian, a partire dal meno significativo.' },
            { se: d < 0 ? scritte(pos) : [], msg: 'Hai codificato +' + piu + ' decimi. La temperatura è sotto zero, quindi serve il complemento a due.' }
          ],
          altro: 'I byte sono diversi. Procedi in tre mosse: fattore di scala, ' + (d < 0 ? 'complemento a due su sedici bit, ' : 'scrittura su sedici bit, ') + 'ordine dei byte.',
          indizi: [T.gradi(d) + ' gradi sono ' + T.virgola(d) + ' decimi.', d < 0 ? T.virgola(d) + ' su sedici bit è 65 536 − ' + piu + ' = ' + N(w) + ', cioè 0x' + H(b1) + H(b0) + '.' : piu + ' su sedici bit è 0x' + H(b1) + H(b0) + '.', 'In ordine little-endian si scrive prima il byte meno significativo.'],
          svolgimento: ['Fattore di scala: ' + T.gradi(d) + ' × 10 = ' + T.virgola(d) + '.', d < 0 ? 'Complemento a due: 65 536 − ' + piu + ' = ' + N(w) + ' = 0x' + H(b1) + H(b0) + '.' : 'Su sedici bit: ' + piu + ' = 0x' + H(b1) + H(b0) + '.', 'Ordine little-endian: prima ' + H(b0) + ', poi ' + H(b1) + '.', 'Nel record: ' + H(b0) + ' ' + H(b1) + '.'] };
      }
      const [byte, parola, valore, esito, perche] = r.scegli([
        ['00 00 00 C0', '0xC0000000', '−2 volt', 'dominio', 'un valore negativo, fuori dal dominio che va da 0 a 5 volt'],
        ['00 00 40 41', '0x41400000', '12 volt', 'dominio', 'un valore oltre il massimo del dominio, che va da 0 a 5 volt'],
        ['00 00 C0 7F', '0x7FC00000', 'un NaN', 'dominio', 'una parola che non corrisponde ad alcun numero, e che resta fuori da qualunque dominio'],
        ['00 00 50 40', '0x40500000', '3,25 volt', 'ok', 'un valore che rientra nel dominio, da 0 a 5 volt'],
        ['00 00 00 3F', '0x3F000000', '0,5 volt', 'ok', 'un valore che rientra nel dominio, da 0 a 5 volt']]);
      const CODA = 'la parola ' + parola + ', che in virgola mobile è ' + valore + ': ' + perche + '.', SPIEGA = 'I quattro byte formano ' + CODA;
      return { u: '1.7.7', d: 'Una copia di un record TLM1 ha la firma giusta, un nome fatto di caratteri ASCII e tutti i byte previsti. La temperatura è nel dominio. Gli ultimi quattro byte sono `' + byte + '`. Che cosa fa un lettore completo?', o: [
        { t: 'Accetta il record', ok: esito === 'ok', fb: SPIEGA },
        { t: 'Lo rifiuta al controllo sui byte disponibili', fb: 'I quattro byte della tensione sono arrivati tutti, quindi quel controllo è superato. Formano ' + CODA },
        { t: 'Lo rifiuta al controllo sul dominio della tensione', ok: esito === 'dominio', fb: SPIEGA }] };
    }
  ] });
})();
