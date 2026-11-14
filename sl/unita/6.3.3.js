'use strict';
SL.unita633 = (() => {
  const BASE = 0x100000, PAG = 1024, IND = '        ';
  const H = (v) => '0x' + v.toString(16).toUpperCase(), ERR = '0xFFFFFFFFFFFFFFFF';
  const RIGHE = ['mov rax, rdi', 'shr rax, 10', 'mov rax, [rsi + rax*8]', 'test rax, 1', 'jz errore', 'shr rax, 1', 'shl rax, 10', 'mov rcx, rdi', 'and rcx, 1023', 'or rax, rcx', 'ret', 'mov rax, -1', 'ret'];
  const esito = (p) => (p.pte % 2 === 1 ? 'pa' : 'err');
  const conti = (p) => { const vpn = Math.floor(p.va / PAG), off = p.va % PAG, pfn = Math.floor(p.pte / 2); return { vpn, off, pfn, base: pfn * PAG, pa: pfn * PAG + off, ind: BASE + 8 * vpn }; };
  const traccia = (p) => {
    const c = conti(p), T = [], valida = p.pte % 2 === 1;
    const S = (atto, riga, titolo, testo, s, extra) => T.push(Object.assign({ atto, riga, titolo, testo, rax: '·', che: '·', rcx: '·', cheC: '', zf: '·', mem: '·', acc: '' }, s, extra ? { extra } : {}));
    S(0, -1, 'La chiamata', 'Il chiamante ha posto l’indirizzo virtuale ' + H(p.va) + ' in RDI e la base della tabella in RSI, secondo la convenzione di chiamata, e attende l’indirizzo fisico in RAX. Ha già verificato che la pagina rientri fra le voci della tabella.', {});
    S(1, 0, 'mov rax, rdi', 'La routine copia l’indirizzo virtuale in RAX, per elaborarlo senza perdere l’originale in RDI.', { rax: H(p.va), che: 'virtuale', acc: 'a' }, { calc: 'RAX = ' + H(p.va) });
    S(1, 1, 'shr rax, 10', 'L’istruzione scorre RAX a destra di 10 bit. I dieci bit dell’offset escono, e resta il quoziente della divisione per 1024: la pagina ' + c.vpn + '.', { rax: H(c.vpn), che: 'VPN', acc: 'a' }, { calc: H(p.va) + ' >> 10 = ' + c.vpn });
    S(1, 2, 'mov rax, [rsi + rax*8]', 'L’istruzione legge la memoria all’indirizzo RSI + RAX × 8, cioè ' + H(BASE) + ' + ' + c.vpn + ' × 8 = ' + H(c.ind) + '. A tale indirizzo si trova la voce della pagina ' + c.vpn + ', che vale ' + p.pte + '. La voce sostituisce in RAX l’indice.', { rax: H(p.pte), che: 'voce', mem: '[' + H(c.ind) + '] = ' + p.pte, acc: 'am' }, { calc: '[' + H(c.ind) + '] = ' + p.pte });
    S(2, 3, 'test rax, 1', 'TEST calcola l’AND bit a bit fra RAX e 1, aggiorna i flag e scarta il risultato: RAX resta ' + p.pte + '. Il valore 1 ha a 1 soltanto il bit 0, e l’AND isola pertanto il bit di validità. ' + (valida ? 'Il bit vale 1, il risultato è diverso da zero, e ZF assume il valore 0.' : 'Il bit vale 0, il risultato è zero, e ZF assume il valore 1.'), { rax: H(p.pte), che: 'voce', zf: valida ? '0' : '1', mem: '[' + H(c.ind) + '] = ' + p.pte, acc: 'z' }, { calc: p.pte + ' AND 1 = ' + (p.pte % 2) + ' · ZF = ' + (valida ? 0 : 1), chiedi: { d: 'ZF vale ' + (valida ? 0 : 1) + '. Quale effetto avrà l’istruzione successiva, jz errore?', o: ['L’esecuzione prosegue con la riga successiva', 'L’esecuzione salta alla riga errore'], g: valida ? 0 : 1, no: 'JZ salta quando ZF vale 1, cioè quando il risultato di TEST è stato zero.' } });
    if (valida) {
      S(2, 4, 'jz errore', 'ZF vale 0: il salto non avviene, e l’esecuzione prosegue con la riga successiva.', { rax: H(p.pte), che: 'voce', zf: '0', acc: '' }, { calc: 'ZF = 0 · nessun salto' });
      S(3, 5, 'shr rax, 1', 'L’istruzione scorre RAX a destra di 1 bit. Il bit di validità esce, e resta il numero del frame: ' + c.pfn + '.', { rax: H(c.pfn), che: 'PFN', zf: '0', acc: 'a' }, { calc: p.pte + ' >> 1 = ' + c.pfn });
      S(3, 6, 'shl rax, 10', 'L’istruzione scorre RAX a sinistra di 10 bit, cioè moltiplica per 1024. Il risultato è l’indirizzo a cui ha inizio il frame ' + c.pfn + ': ' + H(c.base) + '. I dieci bit meno significativi sono a 0, disponibili per l’offset.', { rax: H(c.base), che: 'base', zf: '0', acc: 'a' }, { calc: c.pfn + ' << 10 = ' + H(c.base) });
      S(3, 7, 'mov rcx, rdi', 'L’istruzione copia di nuovo l’indirizzo virtuale, in RCX, per ricavarne l’offset.', { rax: H(c.base), che: 'base', rcx: H(p.va), cheC: 'virtuale', zf: '0', acc: 'c' }, { calc: 'RCX = ' + H(p.va) });
      S(3, 8, 'and rcx, 1023', 'AND con 1023, la maschera che ha a 1 i dieci bit meno significativi. Dell’indirizzo virtuale resta soltanto l’offset: ' + H(c.off) + '.', { rax: H(c.base), che: 'base', rcx: H(c.off), cheC: 'offset', zf: '0', acc: 'c' }, { calc: H(p.va) + ' AND 0x3FF = ' + H(c.off) });
      S(3, 9, 'or rax, rcx', 'OR fra la base del frame e l’offset. I due valori occupano bit diversi, e l’OR equivale a una somma: ' + H(c.base) + ' + ' + H(c.off) + ' = ' + H(c.pa) + '.', { rax: H(c.pa), che: 'fisico', rcx: H(c.off), cheC: 'offset', zf: '0', acc: 'a' }, { calc: H(c.base) + ' OR ' + H(c.off) + ' = ' + H(c.pa) });
      S(4, 10, 'ret', 'La routine ritorna: RAX contiene l’indirizzo fisico ' + H(c.pa) + ', mentre RDI e RSI conservano i valori ricevuti.', { rax: H(c.pa), che: 'fisico', rcx: H(c.off), cheC: 'offset', zf: '0' }, { esito: ['RAX = ' + H(c.pa), 'si'] });
    } else {
      S(2, 4, 'jz errore', 'ZF vale 1: il salto avviene. Le righe che calcolano l’indirizzo sono omesse, e l’esecuzione riprende dalla riga errore.', { rax: H(p.pte), che: 'voce', zf: '1', acc: '' }, { calc: 'ZF = 1 · salto a errore' });
      S(3, 11, 'errore: mov rax, -1', 'La routine scrive −1 in RAX. In complemento a due, −1 su 64 bit è una parola di tutti 1: è il valore di errore.', { rax: ERR, che: 'errore', zf: '1', acc: 'a' }, { calc: 'RAX = ' + ERR });
      S(4, 12, 'ret', 'La routine ritorna con il valore di errore. Nessun indirizzo fisico è stato composto: il controllo di validità ha preceduto l’impiego del contenuto della voce.', { rax: ERR, che: 'errore', zf: '1' }, { esito: ['RAX = valore di errore', 'no'] });
    }
    return T;
  };
  const quadro = (pre, p, s, o) => {
    const el = SL.el, els = [], xr = o.x + o.w * 0.4, wr = o.w * 0.6, w2 = (wr - 10) / 2, a = (c) => s.acc.indexOf(c) >= 0;
    RIGHE.forEach((r, k) => els.push(el.nota(pre + 'l' + k, o.x, o.y + k * 19, (k === 11 ? 'errore:' : IND.slice(1)) + (k === s.riga ? '▸' : ' ') + ' ' + r, 'mono', k === s.riga ? 'att' : '')));
    els.push(el.box(pre + 'di', xr, o.y, w2, 50, 'RDI · indirizzo virtuale', H(p.va), 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'si', xr + w2 + 10, o.y, w2, 50, 'RSI · base della tabella', H(BASE), 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'ax', xr, o.y + 58, wr, 50, 'RAX · ' + (s.che === '·' ? 'risultato' : s.che), s.rax, s.rax === ERR ? 'err' : a('a') ? 'att' : s.rax === '·' ? '' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'cx', xr, o.y + 116, w2, 50, 'RCX' + (s.cheC ? ' · ' + s.cheC : ''), s.rcx, a('c') ? 'att' : s.rcx === '·' ? '' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'zf', xr + w2 + 10, o.y + 116, w2, 50, 'flag ZF', s.zf, a('z') ? 'att' : s.zf === '·' ? '' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'me', xr, o.y + 174, wr, 50, 'memoria letta', s.mem, a('m') ? 'att' : s.mem === '·' ? '' : 'on', { cls: 'stretta' }));
    return els;
  };
  return { BASE, H, ERR, RIGHE, esito, conti, traccia, quadro };
})();
SL.registra('6.3.3', {
  titolo: 'Implementare il calcolo dell’indirizzo',
  obiettivo: 'Obiettivo: leggere una routine in assembly che traduce un indirizzo, indicando a ogni istruzione il contenuto di RAX: indice, voce, frame, base oppure indirizzo fisico.',
  concetti: [['operation', 'Scorrere per dividere e moltiplicare'], ['scudo', 'Una maschera per l’offset'], ['flag', 'Controllare prima di comporre']],
  filigrana: ['terminale', 'operation', 'flag'],
  richiami: {
    carte: [
      { sim: 'operation', da: 'Dall’unità 2.4.1', t: 'SHR e SHL', d: 'Lo scorrimento a destra di n bit divide per 2 alla n, quello a sinistra moltiplica.' },
      { sim: 'puntatore', da: 'Dall’unità 2.2.5', t: 'JZ', d: 'Il salto condizionale che avviene quando ZF vale 1.' },
      { sim: 'bit', da: 'Dall’unità 6.3.2', t: 'Il formato della voce', d: 'Voce = 2 × PFN + valid: il bit 0 è la validità, gli altri il frame.' }
    ],
    domanda: { d: 'Prima di proseguire: RAX contiene 0xC33, cioè 3123. Quale valore contiene dopo shr rax, 10?', o: [
      { t: '3', ok: true, fb: 'Lo scorrimento a destra di 10 bit divide per 1024 e scarta il resto: 3123 / 1024 = 3.' },
      { t: '51', fb: 'Cinquantuno è il resto, cioè la parte che lo scorrimento scarta.' },
      { t: '312', fb: 'Lo scorrimento opera sui bit: dieci posizioni dividono per 1024.' }
    ] }
  },
  idea: {
    titolo: 'Divisioni e moltiplicazioni eseguite sui bit',
    termini: ['maschera di offset'],
    testo: [
      'Nelle unità precedenti gli indirizzi sono stati tradotti con divisioni, resti e moltiplicazioni. Un processore esegue i medesimi calcoli con operazioni sui bit, più rapide, e possibili poiché la dimensione della pagina è una potenza di due. Con pagine da 1024 byte, cioè 2 alla decima, i dieci bit meno significativi di un indirizzo costituiscono l’offset, e i bit rimanenti il numero della pagina. L’unità esamina la routine che sfrutta tale proprietà, scritta nell’assembly del Modulo II.',
      'La routine riceve l’indirizzo virtuale in RDI e la base della tabella in RSI, e restituisce il risultato in RAX. Il primo compito è ricavare il numero della pagina: è sufficiente scorrere l’indirizzo a destra di dieci bit, con SHR. L’offset esce dalla parola, e resta il quoziente. Una sola istruzione legge quindi la voce: mov rax, [rsi + rax*8]. L’operando di memoria calcola base + indice × 8, cioè l’indirizzo della voce dell’unità 6.3.1.',
      { fig: 'scena', w: 720, h: 256, titolo: 'La routine all’istruzione che legge la voce', nota: 'RAX conteneva l’indice 3. Dopo questa istruzione contiene la voce letta a 0x100018, cioè 35, che in esadecimale è 0x23.', els: SL.unita633.quadro('g', { va: 0xC33, pte: 35 }, SL.unita633.traccia({ va: 0xC33, pte: 35 })[3], { x: 10, y: 4, w: 700 }) },
      'RAX contiene ora la voce, che va controllata prima dell’impiego. L’istruzione test rax, 1 calcola l’AND fra la voce e 1, senza modificare RAX: il suo unico effetto è l’aggiornamento dei flag. Poiché 1 ha a 1 il solo bit 0, il risultato è zero quando il bit di validità è a 0, e in tal caso ZF vale 1. La riga successiva, jz errore, salta allora alla parte finale della routine, che carica in RAX il valore di errore.',
      'Se la voce è valida l’esecuzione prosegue. Uno SHR di un bit rimuove il bit di validità e lascia il frame. Uno SHL di dieci bit lo moltiplica per 1024, e produce l’indirizzo a cui il frame ha inizio, con i dieci bit meno significativi a zero. Resta da aggiungere l’offset: la routine copia l’indirizzo virtuale in RCX e ne conserva i dieci bit meno significativi con and rcx, 1023. Il numero 1023, in binario dieci cifre 1, è la [[maschera di offset]].',
      'L’ultima istruzione è or rax, rcx. La base ha zeri nei dieci bit meno significativi, e l’offset ha zeri in tutti gli altri: i due valori sono privi di bit in comune, e l’OR li unisce con il medesimo risultato di una somma. Nel seguire la routine è opportuno stabilire a ogni riga che cosa rappresenta RAX. Il medesimo registro contiene, in successione, l’indirizzo virtuale, l’indice, la voce, il frame, la base e l’indirizzo fisico: il nome del registro è invariato, mentre il contenuto assume sei significati.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento esegue la routine di traduzione un’istruzione per volta. I controlli fissano l’indirizzo virtuale, e il valore della voce che la routine troverà in tabella: 35, valida, oppure 34, invalida.',
      'A ogni istruzione è indicato il significato del contenuto di RAX: indice, voce, frame, base, indirizzo fisico. Con la voce invalida è istruttivo individuare il punto in cui la routine devia dal percorso ordinario.'
    ],
    vedrai: [
      ['terminale', 'Il listato', 'A sinistra: le istruzioni della routine. Il segno ▸ indica quella appena eseguita.'],
      ['register', 'I registri', 'A destra: RDI e RSI con gli ingressi, RAX con il significato del suo contenuto, RCX e il flag ZF.'],
      ['memory', 'La memoria', 'In basso a destra: l’indirizzo letto in tabella e il valore trovato.']
    ]
  },
  lab: {
    titolo: 'La routine di traduzione, riga per riga',
    scena: { w: 860, h: 262 },
    atti: ['La chiamata', 'Dall’indirizzo alla voce', 'Il controllo', 'Il risultato', 'Il ritorno'],
    controlli: [
      { id: 'va', tipo: 'scelta', eti: 'Indirizzo virtuale in RDI', opzioni: [[0xC33, '0xC33'], [0xFFF, '0xFFF']], valore: 0xC33 },
      { id: 'pte', tipo: 'scelta', eti: 'Voce della pagina 3', opzioni: [[35, '35 · valida'], [34, '34 · invalida']], valore: 35 }
    ],
    nota: 'Il numero dei passi dipende dalla voce. La tabella ha inizio a 0x100000, le pagine sono da 1024 byte, le voci da 8 byte.',
    previsione: {
      domanda: (p) => { const U = SL.unita633; return 'La routine riceve in RDI l’indirizzo virtuale ' + U.H(p.va) + '. La voce della pagina 3 contiene ' + p.pte + ', nel formato 2 × PFN + valid. Le pagine sono da 1024 byte. Quale valore contiene RAX al ritorno?'; },
      opzioni: (p) => { const U = SL.unita633, c = U.conti(p); return [['pa', U.H(c.pa)], ['base', U.H(c.base)], ['err', U.ERR]]; }
    },
    confronto: (pred, esito, p) => { const U = SL.unita633, c = U.conti(p), N = { pa: U.H(c.pa), base: U.H(c.base), err: 'il valore di errore' }; return 'La previsione indicava ' + N[pred] + '. RAX contiene ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'err' ? 'La voce 34 è pari: TEST trova il bit di validità a 0, e JZ salta alla riga errore prima della composizione dell’indirizzo.' : pred === 'base' ? 'Il valore indicato è l’inizio del frame. Le ultime tre istruzioni vi aggiungono l’offset, ' + U.H(c.off) + '.' : 'La voce 35 è dispari, e pertanto valida: la routine compone l’indirizzo fisico.'); },
    costruisci(p) {
      const U = SL.unita633, T = U.traccia(p);
      const passi = T.map((s) => Object.assign({ atto: s.atto, titolo: s.titolo, testo: s.testo, hud: [['RAX', s.rax === U.ERR ? '−1' : s.rax, 'a'], ['Contenuto', s.che, 'c'], ['ZF', s.zf]], els: U.quadro('b', p, s, { x: 20, y: 4, w: 820 }) }, s.extra || {}));
      return { passi, esito: U.esito(p) };
    }
  },
  bilancio: {
    regola: [
      'VPN = indirizzo virtuale scorso a destra di n bit. Offset = indirizzo virtuale AND (2 alla n, meno 1). Con pagine da 1024 byte, n vale 10.',
      'Indirizzo fisico = (PFN scorso a sinistra di n bit) OR offset, dopo avere controllato con TEST il bit di validità.'
    ],
    errori: [
      ['Comporre l’indirizzo prima di controllare la voce.', 'Una voce invalida contiene bit privi di significato: il controllo precede la composizione.'],
      ['Ritenere che TEST modifichi RAX.', 'TEST aggiorna soltanto i flag. La voce resta in RAX per le istruzioni successive.'],
      ['Trascurare il significato del contenuto di RAX.', 'Il medesimo registro contiene in successione l’indice, la voce, il frame, la base e infine l’indirizzo fisico.']
    ],
    saFare: ['Ricavare VPN e offset con scorrimenti e maschere.', 'Seguire il controllo di validità con TEST e JZ.', 'Indicare che cosa rappresenta RAX dopo ogni istruzione.'],
    esercizi: [
      { d: 'Con pagine da 4096 byte, di quanti bit va scorso a destra un indirizzo virtuale per ottenere il numero di pagina?', segnaposto: 'Un numero', giuste: ['12', 'dodici'],
        ok: '4096 è 2 alla dodicesima: l’offset occupa 12 bit.',
        diagnosi: [
          { se: ['10', 'dieci'], msg: 'Dieci bit sono sufficienti per pagine da 1024 byte. In questo caso le pagine sono da 4096.' },
          { se: ['4096'], msg: 'Il valore indicato è il divisore. Lo scorrimento si misura in bit: l’esponente di 2.' }
        ],
        altro: 'Il numero è diverso. Si determini l’esponente a cui elevare 2 per ottenere 4096.',
        indizi: ['1024 = 2 alla decima.', '4096 = 4 × 1024.', '4 = 2 alla seconda: complessivamente 2 alla dodicesima.'],
        svolgimento: ['4096 = 2 alla dodicesima.', 'Scorrimento: 12 bit.'] },
      { d: 'RCX contiene 0xFFF. Dopo and rcx, 1023, quale valore contiene, in decimale?', segnaposto: 'Un numero', giuste: ['1023', '1 023', '0x3ff', '0x3FF'],
        ok: '0xFFF ha dodici bit a 1. La maschera ne conserva i dieci meno significativi: 1023.',
        diagnosi: [
          { se: ['4095', '4 095'], msg: 'La maschera 1023 ha soltanto dieci bit a 1: i due bit più significativi di 0xFFF sono azzerati.' },
          { se: ['3', 'tre'], msg: 'Tre è il numero di pagina, che si ottiene con lo scorrimento. La maschera conserva l’offset.' }
        ],
        altro: 'Il numero è diverso. Si scriva 0xFFF in binario e si conservino i dieci bit meno significativi.',
        indizi: ['0xFFF in binario: dodici cifre 1.', '1023 in binario: dieci cifre 1.', 'Restano dieci cifre 1: 1023.'],
        svolgimento: ['0xFFF = 1111 1111 1111.', 'AND con 11 1111 1111.', 'Risultato: 1023.'] },
      { d: 'Per quale ragione nell’ultima istruzione è possibile impiegare OR in luogo di una somma?', guida: 'Si scelga la risposta.', o: [
        { t: 'Base e offset non hanno bit a 1 nelle medesime posizioni', ok: true, fb: 'In assenza di sovrapposizioni non si generano riporti, e OR e somma forniscono il medesimo risultato.' },
        { t: 'OR è sempre uguale alla somma', fb: '1 OR 1 vale 1, mentre 1 + 1 vale 2. I due risultati coincidono soltanto in assenza di bit in comune.' },
        { t: 'L’offset è sempre zero', fb: 'L’offset può valere fino a 1023, e tuttavia occupa soltanto i dieci bit che nella base sono a zero.' }] }
    ],
    sfida: ['cslez6_3_05_address_translation_assembly', 'Traduzione completa in assembly']
  }
});
