'use strict';
SL.registra('2.3.1', {
  titolo: 'Indirizzi, valori e ampiezza degli accessi',
  obiettivo: 'Obiettivo: indicare i byte letti da un’istruzione che accede alla memoria e il valore ricevuto dal registro, per ciascuna ampiezza.',
  concetti: [['memory', 'Indirizzo e ampiezza'], ['byte', 'Ordine dei byte'], ['register', 'Estensione nel registro']],
  filigrana: ['memory', 'byte', 'register'],
  richiami: {
    carte: [
      { sim: 'memory', da: 'Dall’unità 2.1.2', t: 'Le parentesi quadre', d: 'Un nome fra parentesi quadre indica la memoria situata all’indirizzo contenuto nel registro.' },
      { sim: 'byte', da: 'Dall’unità 1.2.3', t: 'Little-endian', d: 'La cella con l’indirizzo più basso riceve il byte meno significativo del numero.' },
      { sim: 'segno', da: 'Dall’unità 1.4.3', t: 'Estensione del segno', d: 'Un intero con segno è esteso copiando il bit di segno in tutte le nuove posizioni. Il valore resta invariato.' }
    ],
    domanda: { d: 'Prima di proseguire: le celle 0x1000 e 0x1001 contengono, nell’ordine, i byte 34 e 12. Quale numero di sedici bit formano in little-endian?', o: [
      { t: '0x1234', ok: true, fb: 'La cella con l’indirizzo più basso contiene il byte meno significativo, 34. Il byte 12 occupa la parte alta.' },
      { t: '0x3412', fb: 'L’ordine indicato è quello in cui i byte compaiono in memoria. In little-endian il primo byte è il meno significativo, e va quindi scritto a destra.' },
      { t: '0x0034', fb: 'In tal modo il numero comprenderebbe soltanto la prima cella. Sedici bit occupano due celle.' }
    ] }
  },
  idea: {
    titolo: 'L’indirizzo fissa la posizione, l’ampiezza l’estensione',
    termini: ['ampiezza dell’accesso', 'movzx', 'movsx'],
    testo: [
      'La memoria è una fila di celle numerate, ciascuna delle quali contiene un byte. Un indirizzo indica una sola cella. La maggior parte dei dati è tuttavia più larga di un byte: un intero a 32 bit occupa quattro celle consecutive. Per leggerlo il processore richiede due informazioni: l’indirizzo del primo byte e il numero di byte che compongono il dato. Tale numero prende il nome di [[ampiezza dell’accesso]].',
      'Nell’unità 2.1.2 l’ampiezza era fissata dal registro di destinazione: un byte con AL, quattro con EAX, otto con RAX. Quando il registro è più largo del dato, oppure è assente, l’istruzione dichiara l’ampiezza con una parola chiave anteposta alle parentesi quadre. Le parole chiave sono quattro: `byte ptr` per un byte, `word ptr` per due, `dword ptr` per quattro, `qword ptr` per otto.',
      { fig: 'scena', w: 720, h: 196, titolo: 'Il medesimo indirizzo, due ampiezze', nota: 'L’indirizzo di partenza è 0x1004 in entrambi i casi. Il numero di celle lette è diverso, e con esso il valore.', els: [
        SL.el.cella('m0', 20, 30, 76, 50, '78', 'att', { gi: '0x1004' }), SL.el.cella('m1', 104, 30, 76, 50, '56', 'att', { gi: '0x1005' }),
        SL.el.cella('m2', 188, 30, 76, 50, '34', 'on', { gi: '0x1006' }), SL.el.cella('m3', 272, 30, 76, 50, '12', 'on', { gi: '0x1007' }),
        SL.el.nota('n1', 20, 0, 'MEMORIA, INDIRIZZI CRESCENTI', 'mono'),
        SL.el.box('v2', 20, 126, 300, 58, 'due byte, word ptr', '0x5678', 'att'),
        SL.el.box('v4', 410, 26, 290, 58, 'quattro byte, dword ptr', '0x12345678', 'on'),
        SL.el.linea('l1', 100, 108, 100, 126, 'att'), SL.el.linea('l2', 348, 55, 410, 55, 'on')] },
      'I byte letti sono composti in ordine little-endian. Il primo, situato all’indirizzo più basso, ha peso 1. Il secondo ha peso 256, il terzo 256 × 256, e così via. Le celle 78, 56, 34 e 12 formano dunque il numero 0x12345678: nella scrittura ordinaria, il byte letto per ultimo occupa la posizione più a sinistra.',
      'Resta da stabilire che cosa accade quando il dato letto è più stretto del registro che lo riceve. I bit rimasti liberi vanno riempiti, e i modi sono due. L’istruzione [[movzx|MOVZX]] li riempie con zeri, come per un numero senza segno. L’istruzione [[movsx|MOVSX]] li riempie con copie del bit di segno, come prescrive l’estensione del segno. Il byte 0xF0 diventa 0x000000F0, cioè 240, con la prima, e 0xFFFFFFF0, cioè −16, con la seconda.',
      'La memoria conserva soltanto byte. Il termine di un dato e la sua lettura con o senza segno sono informazioni assenti dalla memoria: le stabilisce di volta in volta l’istruzione che accede. Dal medesimo indirizzo si possono quindi ottenere numeri diversi, tutti corretti rispetto all’istruzione che li ha richiesti.'
    ]
  },
  esperimento: {
    faremo: [
      'Otto celle di memoria, a partire dall’indirizzo 0x1000, contengono byte fissati. Il registro RDI contiene 0x1000. I controlli fissano lo spiazzamento, l’ampiezza e il modo di riempire i bit liberi, e un’istruzione carica il dato in EAX.',
      'L’accesso è seguito in quattro fasi: l’indirizzo, le celle lette, la ricostruzione del numero, l’estensione. Dopo il caso proposto, è istruttivo mantenere l’indirizzo e cambiare soltanto l’ampiezza.'
    ],
    vedrai: [
      ['memory', 'La memoria', 'Al centro: le otto celle, ciascuna con il proprio indirizzo. Le celle lette sono evidenziate.'],
      ['register', 'Il registro EAX', 'In basso: i quattro byte di EAX, dal più significativo.'],
      ['byte', 'I pesi', 'Sopra le celle lette: il peso di ciascun byte nel numero.']
    ]
  },
  lab: {
    titolo: 'Un caricamento dalla memoria, byte per byte',
    scena: { w: 860, h: 322 },
    atti: ['L’indirizzo', 'Le celle lette', 'La ricostruzione', 'L’estensione', 'Il valore'],
    controlli: [
      { id: 'd', tipo: 'scelta', eti: 'Spiazzamento', opzioni: [[0, '0'], [1, '1'], [2, '2'], [4, '4']], valore: 4 },
      { id: 'w', tipo: 'scelta', eti: 'Ampiezza', opzioni: [[1, '1 byte'], [2, '2 byte'], [4, '4 byte']], valore: 4 },
      { id: 'e', tipo: 'scelta', eti: 'Bit liberi', opzioni: [['z', 'zeri (MOVZX)'], ['s', 'segno (MOVSX)']], valore: 'z' }
    ],
    nota: 'Con l’ampiezza di quattro byte il dato riempie EAX, e la scelta sui bit liberi è priva di effetto.',
    previsione: {
      domanda: (p) => 'RDI contiene 0x1000. Le celle da 0x1000 a 0x1007 contengono, nell’ordine, i byte 10 F0 80 7F 78 56 34 12. Quale valore conterrà EAX dopo `' + SL.unita231.ist(p) + '`?',
      opzioni: (p) => SL.unita231.opzioni(p)
    },
    confronto: (pred, esito, p) => {
      const c = SL.unita231.conto(p);
      return 'La previsione indicava EAX uguale a ' + pred + '. Vale ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.'
        : 'L’accesso parte da ' + c.A + ' e comprende ' + (p.w === 1 ? 'il solo byte ' : 'i byte ') + c.letti.join(' ') + '. ' + (p.w === 1 ? '' : 'Il primo letto è il meno significativo. ') + (p.w === 4 ? 'Quattro byte riempiono EAX per intero.' : 'I bit liberi di EAX ricevono ' + (c.riemp ? 'copie del bit di segno, che vale 1.' : p.e === 's' ? 'copie del bit di segno, che vale 0.' : 'zeri.')));
    },
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita231, c = U.conto(p), passi = [], w = p.w;
      const PESI = ['× 1', '× 256', '× 256²', '× 256³'], MX = 40, MP = 80, RX = 40, RP = 112;
      const st = { eax: null };
      const quadro = (o) => {
        const els = [el.box('ist', 40, 0, 390, 56, 'istruzione', U.ist(p), o.fase === 0 ? 'att' : '', { cls: 'stretta' }),
          el.box('rdi', 450, 0, 170, 56, 'RDI', '0x1000', '', { cls: 'stretta' }),
          el.box('ind', 640, 0, 180, 56, 'primo byte letto', c.A, o.fase <= 1 ? 'att' : 'on', { cls: 'stretta' }),
          el.nota('nm', 700, 122, 'memoria', 'mono')];
        U.MEM.forEach((b, k) => {
          const j = k - p.d, dentro = j >= 0 && j < w;
          els.push(el.cella('m' + k, MX + k * MP, 110, MP - 6, 50, X.esa2(b), o.fase === 0 ? (j === 0 ? 'att' : '') : dentro ? (o.fase === 1 || o.fase === 2 ? 'att' : 'on') : '', { gi: '0x' + (0x1000 + k).toString(16).toUpperCase(), so: dentro && o.fase >= 2 ? PESI[j] : null }));
        });
        for (let k = 0; k < 4; k++) {
          const j = 3 - k, letto = j < w;        // k: posizione nel disegno, dal byte più significativo; j: peso del byte
          const vis = letto ? o.fase >= 2 : o.fase >= 3;
          els.push(el.cella('r' + k, RX + k * RP, 250, RP - 8, 50, vis ? X.esa2(letto ? c.byte[j] : c.riemp ? 255 : 0) : '·', !vis ? 'off' : letto ? (o.fase === 2 ? 'att' : 'on') : o.fase === 3 ? 'att' : c.riemp ? 'on' : 'zero', { so: 'byte ' + j }));
          if (letto && o.fase >= 2) els.push(el.linea('l' + j, MX + (p.d + j) * MP + (MP - 6) / 2, 188, RX + k * RP + (RP - 8) / 2, 224, o.fase === 2 ? 'att' : 'on'));
        }
        els.push(el.box('eax', 500, 222, 140, 78, 'EAX', st.eax || '·', o.fase === 4 ? 'att' : '', { cls: 'stretta' }));
        els.push(el.box('dec', 650, 222, 180, 78, c.conSegno ? 'letto con segno' : 'letto senza segno', o.fase === 4 ? X.num(c.dec) : '·', o.fase === 4 ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Primo byte', c.A, 'a'], ['Ampiezza', w + ' byte'], ['EAX', st.eax || '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ fase: 0 }, 0, 'L’indirizzo del primo byte', 'RDI contiene 0x1000, l’indirizzo della prima delle otto celle. L’operando di memoria indica la cella situata ' + (p.d === 0 ? 'esattamente a tale indirizzo, senza alcuno spiazzamento.' : p.d + ' byte più avanti: 0x1000 + ' + p.d + ' = ' + c.A + '.') + ' Da tale cella comincia l’accesso.',
        { calc: '0x1000 + ' + p.d + ' = ' + c.A, chiedi: { d: 'Davanti alle parentesi quadre è scritto `' + U.PTR[w] + '`. Quanti byte leggerà l’istruzione?', o: ['1', '2', '4', '8'], g: [1, 2, 4].indexOf(w), no: 'La parola chiave `' + U.PTR[w] + '` fissa l’ampiezza a ' + (w === 1 ? 'un byte' : w === 2 ? 'due byte' : 'quattro byte') + '.' } });
      P({ fase: 1 }, 1, w === 1 ? 'Una cella sola' : 'Le celle dell’accesso', 'La parola chiave `' + U.PTR[w] + '` fissa l’ampiezza a ' + (w === 1 ? 'un byte. L’accesso comprende la sola cella ' + c.A + ', che contiene ' + c.letti[0] + '.' : (w === 2 ? 'due' : 'quattro') + ' byte. L’accesso comprende le celle da ' + c.A + ' a ' + c.Z + ', che contengono ' + c.letti.join(', ') + '.') + ' Le altre celle restano estranee all’istruzione.',
        w > 1 ? { chiedi: { d: 'Quale delle celle lette fornirà il byte più significativo del numero?', o: ['La prima, ' + c.A, 'L’ultima, ' + c.Z], g: 1, no: 'In little-endian l’indirizzo più basso contiene il byte meno significativo. Il più significativo si trova quindi nell’ultima cella letta.' } } : {});
      P({ fase: 2 }, 2, w === 1 ? 'Il byte nel registro' : 'La collocazione dei byte', (w === 1 ? 'Un solo byte forma il numero senza alcun ordinamento, e occupa il byte 0 di EAX. Il suo valore è ' + c.u + '.'
        : 'Ogni byte è collocato nel registro con il proprio peso. La cella ' + c.A + ' fornisce il byte 0, il meno significativo, e le successive i byte di peso crescente. Le linee si incrociano perché nel registro, come nella scrittura ordinaria, il byte più significativo è disegnato a sinistra.'),
        Object.assign({ calc: c.pesi }, w < 4 ? { chiedi: { d: 'Il dato letto occupa ' + (8 * w) + ' bit ed EAX ne ha 32. Il suo bit più a sinistra vale ' + c.segno + ' e l’istruzione è ' + (p.e === 'z' ? 'MOVZX' : 'MOVSX') + '. Con quali bit sarà riempito il resto di EAX?', o: ['Con bit a 0', 'Con bit a 1'], g: c.riemp ? 1 : 0, no: p.e === 'z' ? 'MOVZX riempie sempre con zeri, qualunque sia il bit più a sinistra del dato.' : 'MOVSX copia il bit di segno del dato, che in questo caso vale ' + c.segno + '.' } } : {}));
      st.eax = w === 4 ? c.HX : null;
      if (w < 4) {
        P({ fase: 3 }, 3, p.e === 'z' ? 'L’estensione con zeri' : 'L’estensione del segno', (p.e === 'z' ? 'MOVZX riempie con zeri i ' + (32 - 8 * w) + ' bit rimasti liberi. Il numero letto senza segno resta invariato, ' + X.num(c.u) + ', su una larghezza maggiore.'
          : 'MOVSX esamina il bit più a sinistra del dato, che vale ' + c.segno + ', e lo copia nei ' + (32 - 8 * w) + ' bit rimasti liberi. ' + (c.riemp ? 'I byte aggiunti valgono FF. Il dato letto con segno valeva ' + X.num(c.dec) + ', e conserva il valore ' + X.num(c.dec) + ' su 32 bit.' : 'I byte aggiunti valgono 00, poiché il dato è positivo: il risultato coincide con quello di MOVZX.')),
          { calc: (p.e === 'z' ? 'MOVZX' : 'MOVSX') + ' · ' + (32 - 8 * w) + ' bit a ' + (c.riemp ? 1 : 0) });
      } else {
        P({ fase: 3 }, 3, 'Nessun bit libero', 'Quattro byte riempiono EAX per intero, e nessun bit resta da riempire. Per questa ragione l’istruzione è una semplice MOV: MOVZX e MOVSX occorrono soltanto quando il dato è più stretto della destinazione.', { calc: '4 byte = 32 bit' });
      }
      st.eax = c.HX;
      P({ fase: 4 }, 4, 'Il valore caricato', 'EAX contiene ' + c.HX + ', cioè ' + X.num(c.dec) + (c.conSegno ? ' letto con segno' : '') + '. Come ogni scrittura in una vista da 32 bit, il caricamento ha anche azzerato la metà alta di RAX. ' + c.altra, { calc: 'EAX = ' + c.HX, esito: ['EAX = ' + c.HX, 'si'] });
      return { passi, esito: c.HX };
    }
  },
  bilancio: {
    regola: [
      'Un accesso alla memoria è descritto da due dati: l’indirizzo del primo byte e l’ampiezza. I byte letti sono composti in little-endian: il primo ha peso 1, il secondo 256, e così via.',
      'Quando il dato è più stretto del registro, MOVZX riempie i bit liberi con zeri e MOVSX con copie del bit di segno. La memoria conserva byte: ampiezza e segno sono stabiliti dall’istruzione.'
    ],
    errori: [
      ['Scrivere i byte nell’ordine in cui compaiono in memoria.', 'Le celle 78 56 34 12 formano 0x12345678. Il byte all’indirizzo più basso è il meno significativo e va scritto a destra.'],
      ['Trascurare l’ampiezza.', 'Il solo indirizzo 0x1004 lascia indeterminato il valore: con due byte si legge 0x5678, con quattro 0x12345678.'],
      ['Impiegare MOVZX per un dato con segno.', 'Il byte 0xF0, letto con segno, vale −16. MOVZX lo trasforma in 240. La conservazione del valore richiede MOVSX.']
    ],
    saFare: ['Individuare le celle lette da un accesso, dati indirizzo e ampiezza.', 'Ricostruire il numero letto componendo i byte in little-endian.', 'Scegliere fra MOVZX e MOVSX secondo il tipo del dato.'],
    esercizi: [
      { d: 'RDI contiene 0x2000. Le celle da 0x2000 a 0x2003 contengono, nell’ordine, i byte EF BE AD DE. Quanto vale EAX dopo `mov eax, dword ptr [rdi]`? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x1A2B3C4D', giuste: ['0xdeadbeef', 'deadbeef', 'deadbeefh'],
        ok: 'Il byte all’indirizzo più basso, EF, è il meno significativo. Agli indirizzi successivi si trovano BE, AD e DE, che occupa la posizione più alta.',
        diagnosi: [
          { se: ['0xefbeadde', 'efbeadde', 'efbeaddeh'], msg: 'L’ordine indicato è quello in cui i byte compaiono in memoria. In little-endian il primo byte letto è il meno significativo e va scritto a destra.' },
          { se: ['0xbeef', 'beef', '0x0000beef', '0000beef'], msg: 'In tal modo il numero comprende soltanto due celle. La parola chiave `dword ptr` richiede quattro byte.' },
          { se: ['0xef', 'ef', '0x000000ef'], msg: 'In tal modo il numero comprende soltanto la prima cella. La parola chiave `dword ptr` richiede quattro byte.' }
        ],
        altro: 'Il valore è diverso. Si scrivano i quattro byte da destra verso sinistra, a partire da quello all’indirizzo più basso.',
        indizi: ['L’accesso comprende quattro celle, da 0x2000 a 0x2003.', 'Il byte in 0x2000 è il meno significativo, quello in 0x2003 il più significativo.', 'Da sinistra a destra: DE, AD, BE, EF.'],
        svolgimento: ['Byte 0, da 0x2000: EF.', 'Byte 1, da 0x2001: BE. Byte 2, da 0x2002: AD.', 'Byte 3, da 0x2003: DE.', 'EAX = 0xDEADBEEF.'] },
      { d: 'RSI contiene l’indirizzo di una cella che vale 0x9C. Quale istruzione lascia in EAX il valore −100?', guida: 'Si scelga la risposta.', o: [
        { t: 'movsx eax, byte ptr [rsi]', ok: true, fb: 'Il byte 0x9C vale 156 senza segno e 156 − 256 = −100 con segno. MOVSX copia il bit di segno e conserva tale valore su 32 bit.' },
        { t: 'movzx eax, byte ptr [rsi]', fb: 'MOVZX riempie con zeri: EAX conterrebbe 0x0000009C, cioè 156.' },
        { t: 'mov eax, dword ptr [rsi]', fb: 'L’istruzione legge quattro celle. Le tre successive entrerebbero nel numero con il proprio contenuto, qualunque esso sia.' }] }
    ],
    sfida: ['cslez2_3_01_random_assembly_01', 'Caricamenti di diversa larghezza']
  }
});
/* Dati e conti dell'esperimento, condivisi dalla previsione, dal confronto e dalla costruzione dei passi. */
SL.unita231 = (() => {
  const MEM = [0x10, 0xF0, 0x80, 0x7F, 0x78, 0x56, 0x34, 0x12], PTR = { 1: 'byte ptr', 2: 'word ptr', 4: 'dword ptr' };
  const H2 = (b) => b.toString(16).toUpperCase().padStart(2, '0'), H8 = (v) => '0x' + v.toString(16).toUpperCase().padStart(8, '0'), HA = (a) => '0x' + a.toString(16).toUpperCase();
  const ist = (p) => (p.w === 4 ? 'mov' : p.e === 'z' ? 'movzx' : 'movsx') + ' eax, ' + PTR[p.w] + ' [rdi' + (p.d ? ' + ' + p.d : '') + ']';
  // Valore di EAX per un accesso di w byte a partire dalla cella d, con il riempimento indicato; inverso: byte letti al contrario.
  const valore = (d, w, e, inverso) => {
    let b = MEM.slice(d, d + w); if (inverso) b = b.slice().reverse();
    const u = b.reduce((s, x, j) => s + x * Math.pow(256, j), 0), segno = b[w - 1] >= 128 ? 1 : 0;
    return w < 4 && e === 's' && segno ? u + Math.pow(2, 32) - Math.pow(256, w) : u;
  };
  const conto = (p) => {
    const w = p.w, byte = MEM.slice(p.d, p.d + w), u = byte.reduce((s, x, j) => s + x * Math.pow(256, j), 0), segno = byte[w - 1] >= 128 ? 1 : 0;
    const riemp = w < 4 && p.e === 's' && segno === 1, eax = valore(p.d, w, p.e), conSegno = w < 4 && p.e === 's';
    const w2 = w === 4 ? 2 : w * 2, e2 = valore(p.d, w2, 'z');
    return { byte, u, segno, riemp, eax, HX: H8(eax), conSegno, dec: conSegno ? SL.x86.conSegno(u, 8 * w) : u,
      A: HA(0x1000 + p.d), Z: HA(0x1000 + p.d + w - 1), letti: byte.map(H2),
      pesi: w === 1 ? H2(byte[0]) + ' = ' + u : byte.map((x, j) => x + (j ? ' × 256' + (j > 1 ? ['', '', '²', '³'][j] : '') : '')).join(' + ') + ' = ' + SL.x86.num(u),
      altra: 'Dal medesimo indirizzo, con un’ampiezza di ' + (w2 === 2 ? 'due' : w2 === 4 ? 'quattro' : 'otto') + ' byte, il registro avrebbe ricevuto ' + H8(e2) + '.' };
  };
  const opzioni = (p) => {
    const giusta = valore(p.d, p.w, p.e), cand = [giusta, valore(p.d, p.w, p.e, true), valore(p.d, p.w, p.e === 'z' ? 's' : 'z'), valore(p.d, p.w === 4 ? 2 : p.w * 2, 'z'), valore(p.d + 1, 1, 'z')];
    return Array.from(new Set(cand)).slice(0, 4).sort((a, b) => a - b).map(H8);
  };
  return { MEM, PTR, ist, valore, conto, opzioni };
})();
