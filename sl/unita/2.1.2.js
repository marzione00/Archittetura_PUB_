'use strict';
SL.registra('2.1.2', {
  titolo: 'Registri, indirizzi e memoria',
  obiettivo: 'Alla fine saprai dire quali bit di un registro corrispondono a ciascuno dei suoi nomi, prevedere l’effetto di una scrittura parziale e riconoscere un operando di memoria.',
  concetti: [['register', 'Registri generali'], ['strati', 'Viste'], ['memory', 'Operando di memoria']],
  filigrana: ['register', 'strati', 'memory'],
  richiami: {
    carte: [
      { sim: 'register', da: 'Dall’unità 2.1.1', t: 'AL dentro RAX', d: 'AL è il nome degli otto bit più bassi del registro RAX. Una MOV copia un valore nella destinazione.' },
      { sim: 'puntatore', da: 'Dall’unità 1.1.2', t: 'Indirizzo e contenuto', d: 'L’indirizzo dice dove si trova una cella di memoria. Il contenuto è il dato che la cella conserva.' },
      { sim: 'byte', da: 'Dall’unità 1.2.3', t: 'L’ordine little-endian', d: 'Un numero di più byte occupa celle consecutive, con il byte meno significativo all’indirizzo più basso.' }
    ],
    domanda: { d: 'Prima di proseguire: un registro di 64 bit quanti byte contiene, e quante cifre esadecimali servono per scriverlo?', o: [
      { t: '8 byte, 16 cifre', ok: true, fb: 'Sessantaquattro bit sono otto byte, e ogni byte si scrive con due cifre esadecimali.' },
      { t: '8 byte, 8 cifre', fb: 'Ogni byte chiede due cifre esadecimali, una per ciascun gruppo di quattro bit.' },
      { t: '64 byte, 128 cifre', fb: 'Sessantaquattro è il numero dei bit. I byte sono 64 diviso 8.' }
    ] }
  },
  idea: {
    titolo: 'Un registro con più nomi, la memoria fra parentesi',
    termini: ['registro generale', 'vista di un registro', 'operando', 'operando di memoria'],
    testo: [
      'Il processore x86-64 ha sedici registri di uso generale, ciascuno di 64 bit. Otto hanno nomi storici: RAX, RBX, RCX, RDX, RSI, RDI, RBP e RSP. Gli altri otto sono numerati, da R8 a R15. Un [[registro generale]] può contenere qualunque dato di otto byte: un numero, un indirizzo, otto caratteri.',
      'Molti dati sono più piccoli di 64 bit, e il processore permette di lavorare su una parte sola del registro. Ogni parte ha un nome. Per RAX, il nome EAX indica i 32 bit più bassi, AX i 16 più bassi e AL gli 8 più bassi. Una parte di registro con un nome proprio si chiama [[vista di un registro|vista]]. Le viste sono porzioni sovrapposte dello stesso contenitore, quindi scrivere in AL cambia anche quello che si legge in AX, in EAX e in RAX.',
      { fig: 'scena', w: 760, h: 172, titolo: 'I quattro nomi di RAX', nota: 'Il byte 0 è il meno significativo. Ogni vista comincia da lì e si estende verso sinistra.',
        els: SL.x86.registro('g', 0x1122334455667788n, { x: 60, y: 30, on: [0, 8] }).concat([
          SL.el.linea('lal', 494, 94, 550, 94, 'att'), SL.el.nota('nal', 566, 84, 'AL · 8 bit', 'mono', 'att'),
          SL.el.linea('lax', 432, 112, 550, 112, 'att'), SL.el.nota('nax', 566, 102, 'AX · 16 bit', 'mono', 'att'),
          SL.el.linea('lea', 308, 130, 550, 130, 'on'), SL.el.nota('nea', 566, 120, 'EAX · 32 bit', 'mono', 'on'),
          SL.el.linea('lra', 60, 148, 550, 148, 'on'), SL.el.nota('nra', 566, 138, 'RAX · 64 bit', 'mono', 'on')]) },
      'Leggere una vista è semplice: si prendono i bit bassi e si ignorano gli altri. Scrivere richiede più attenzione, perché bisogna sapere che cosa succede ai bit che la vista lascia fuori. Le viste da 8 e da 16 bit conservano tutto il resto del registro. La vista da 32 bit fa eccezione: ogni scrittura in EAX azzera anche i 32 bit alti di RAX.',
      'L’eccezione ha una ragione pratica. I programmi usano di continuo numeri di 32 bit, e con questa regola il risultato di un’operazione a 32 bit è già un numero di 64 bit corretto, libero dagli avanzi di calcoli precedenti nella metà alta. Chi legge un programma deve però ricordarla, perché `mov eax, 1` e `mov ax, 1` lasciano RAX in due stati diversi.',
      'I valori su cui un’istruzione lavora si chiamano [[operando|operandi]]. Finora sono stati registri e immediati. I registri però sono pochi, e la maggior parte dei dati sta in memoria. Un’istruzione indica una cella di memoria scrivendone l’indirizzo fra parentesi quadre. L’istruzione `mov al, [0x1000]` copia in AL il byte che si trova all’indirizzo 0x1000. Più spesso l’indirizzo è contenuto in un registro: `mov al, [rbx]` copia in AL il byte che si trova all’indirizzo scritto in RBX. Un operando scritto in questo modo si chiama [[operando di memoria]].',
      'Le parentesi quadre cambiano il significato del nome che racchiudono. L’istruzione `mov rax, rbx` copia il contenuto di RBX. L’istruzione `mov rax, [rbx]` usa il contenuto di RBX come indirizzo, va in memoria a quell’indirizzo e copia gli otto byte che vi trova. Il numero di byte letti dipende dalla vista usata come destinazione: uno con AL, quattro con EAX, otto con RAX, sempre in ordine little-endian.'
    ]
  },
  esperimento: {
    faremo: [
      'Il registro RAX parte con tutti i byte a FF, così da riconoscere a colpo d’occhio quelli che cambiano. Una MOV vi copia un dato di un byte, attraverso la vista che sceglierai tu.',
      'Seguiremo che cosa succede ai byte della vista e, soprattutto, a quelli che ne restano fuori. Dopo il caso proposto, scegli EAX e confronta il registro finale con quello ottenuto prima.'
    ],
    vedrai: [
      ['register', 'RAX prima', 'In alto: gli otto byte del registro prima dell’istruzione, con la vista scelta accesa.'],
      ['strati', 'RAX dopo', 'Al centro: gli otto byte dopo l’istruzione.'],
      ['tabella', 'Il conto', 'In basso: quanti byte sono stati scritti, quanti azzerati e quanti conservati.']
    ]
  },
  lab: {
    titolo: 'Scrivere in una vista di RAX',
    scena: { w: 860, h: 352 },
    atti: ['Il registro e l’istruzione', 'La vista riceve il dato', 'I byte fuori dalla vista'],
    controlli: [
      { id: 'dest', tipo: 'scelta', eti: 'Destinazione', opzioni: [['al', 'AL · 8 bit'], ['ax', 'AX · 16 bit'], ['eax', 'EAX · 32 bit'], ['rax', 'RAX · 64 bit']], valore: 'ax' },
      { id: 'b', tipo: 'num', eti: 'Dato da copiare', min: 0, max: 255, salti: [1, 16], valore: 171 }
    ],
    previsione: {
      domanda: (p) => 'RAX contiene 0xFFFFFFFFFFFFFFFF. Il processore esegue `mov ' + p.dest + ', ' + SL.x86.esa(p.b, 2) + '`. Quanti degli otto byte di RAX conserveranno il vecchio contenuto?',
      opzioni: () => [0, 4, 6, 7]
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + pred + ' byte conservati. Sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.dest === 'eax' ? 'La vista EAX comprende quattro byte. Gli altri quattro vengono azzerati, perché una scrittura a 32 bit azzera la metà alta del registro.' : p.dest === 'rax' ? 'La vista RAX coincide con il registro intero, quindi tutti gli otto byte vengono riscritti.' : 'La vista ' + p.dest.toUpperCase() + ' comprende ' + (p.dest === 'al' ? 'un byte' : 'due byte') + ', e le viste da 8 e da 16 bit conservano tutto il resto.'),
    costruisci(p) {
      const el = SL.el, X = SL.x86, passi = [];
      const bit = X.larghezza(p.dest), nb = bit / 8, NOME = p.dest.toUpperCase(), prima = 0xFFFFFFFFFFFFFFFFn;
      const dopo = X.scrivi(prima, bit, p.b), azzerati = bit === 32 ? 4 : 0, conservati = 8 - nb - azzerati;
      const vista = [8 - nb, 8], dato = X.esa(p.b, 2), largo = X.esa(p.b, 2 * nb);
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('t1', 40, 0, 'RAX PRIMA DELL’ISTRUZIONE', 'mono')];
        X.registro('a', prima, { x: 40, y: 44, att: o.vista ? vista : null }).forEach((e) => els.push(e));
        els.push(el.box('ist', 580, 36, 250, 66, 'istruzione', 'mov ' + p.dest + ', ' + dato, o.ist ? 'att' : '', { cls: 'stretta' }));
        els.push(el.nota('t2', 40, 116, 'RAX DOPO L’ISTRUZIONE', 'mono'));
        if (o.fase) {
          // Fase 1: è stata riscritta soltanto la vista. Fase 2: anche il resto del registro ha la sua sorte.
          const mostra = o.fase === 1 ? (prima & ~((1n << BigInt(bit)) - 1n) & 0xFFFFFFFFFFFFFFFFn) | BigInt(p.b) : dopo;
          X.registro('d', mostra, { x: 40, y: 160, att: o.fase === 1 ? vista : null, on: o.fase === 2 ? vista : null, err: o.fase === 2 && azzerati && o.fuori ? [0, 4] : null }).forEach((e) => els.push(e));
        } else X.registro('d', prima, { x: 40, y: 160, st: 'off' }).forEach((e) => els.push(e));
        els.push(el.box('dato', 580, 152, 250, 66, 'dato allargato alla vista', o.largo || '·', o.largo ? 'on' : '', { cls: 'stretta' }));
        els.push(el.box('c1', 40, 262, 250, 76, 'byte scritti dalla vista', o.conta ? String(nb) : '·', o.conta ? 'on' : '', { sim: 'strati', riga: true }));
        els.push(el.box('c2', 310, 262, 250, 76, 'byte azzerati', o.conta > 1 ? String(azzerati) : '·', o.conta > 1 ? (azzerati ? 'err' : 'on') : '', { sim: 'conflitto', riga: true }));
        els.push(el.box('c3', 580, 262, 250, 76, 'byte conservati', o.conta > 1 ? String(conservati) : '·', o.conta > 1 ? 'on' : '', { sim: 'lucchetto', riga: true }));
        return els;
      };
      const hud = (k) => [['Destinazione', NOME + ' · ' + bit + ' bit', 'a'], ['Byte della vista', nb], ['Byte conservati', k == null ? '·' : k, 'c']];
      const P = (o, atto, titolo, testo, extra, k) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(k), els: quadro(o) }, extra));

      P({}, 0, 'Il registro prima', 'RAX contiene 0xFFFFFFFFFFFFFFFF: otto byte, tutti a FF. Il byte 0, a destra, è il meno significativo.');
      const opz = ['1', '2', '4', '8'];
      P({ ist: true, vista: true }, 0, 'L’istruzione e la sua destinazione', 'L’istruzione copia l’immediato ' + dato + ' nella destinazione ' + NOME + '. ' + NOME + ' è il nome ' + (bit === 64 ? 'dell’intero registro.' : 'dei ' + bit + ' bit più bassi di RAX, accesi nella striscia.'),
        { calc: 'mov ' + p.dest + ', ' + dato, chiedi: { d: 'Quanti byte del registro appartengono alla vista ' + NOME + '?', o: opz, g: opz.indexOf(String(nb)), no: NOME + ' indica ' + bit + ' bit, cioè ' + bit + ' diviso 8.' } });
      P({ ist: true, vista: true, largo }, 1, 'Il dato si allarga alla vista', nb === 1 ? 'L’immediato occupa un byte, esattamente quanto la vista AL. Viene copiato così com’è.' : 'L’immediato vale ' + dato + ', un solo byte, mentre la vista ne comprende ' + nb + '. Il dato viene completato con zeri a sinistra fino alla larghezza della vista.', { calc: dato + ' → ' + largo });
      P({ vista: true, largo, fase: 1, conta: 1 }, 1, 'La vista viene riscritta', (nb === 1 ? 'Il byte 0 riceve ' + X.esa2(p.b) + '.' : 'I ' + nb + ' byte della vista ricevono ' + X.byteDi(p.b).slice(8 - nb).map(X.esa2).join(' ') + '.') + (bit === 64 ? ' La vista coincide con il registro, quindi non resta altro da decidere.' : ' Resta da stabilire la sorte dei ' + (8 - nb) + ' byte che la vista lascia fuori.'), { calc: NOME + ' ← ' + largo });
      P({ largo, fase: 2, fuori: true, conta: 2 }, 2, bit === 32 ? 'La metà alta viene azzerata' : bit === 64 ? 'Nessun byte resta fuori' : 'Il resto del registro è conservato',
        bit === 32 ? 'La destinazione è una vista da 32 bit, e in questo caso l’architettura prescrive un effetto in più: i quattro byte alti di RAX diventano zero. Dei vecchi FF non resta nulla.'
          : bit === 64 ? 'La vista RAX comprende tutti gli otto byte. Gli zeri aggiunti per allargare il dato hanno preso il posto dei vecchi FF.'
          : 'La destinazione è una vista da ' + bit + ' bit. Le viste da 8 e da 16 bit lasciano intatti tutti gli altri byte, che conservano i vecchi FF.',
        { calc: 'byte conservati: 8 − ' + nb + (azzerati ? ' − ' + azzerati : '') + ' = ' + conservati }, conservati);
      P({ largo, fase: 2, conta: 2 }, 2, 'Il registro dopo', 'RAX vale ' + X.esa(dopo, 16) + '. ' + (bit === 32 ? 'Il risultato è il numero ' + p.b + ' scritto su 64 bit, come se il registro fosse stato azzerato prima della copia.' : bit === 64 ? 'Il risultato è il numero ' + p.b + ' scritto su 64 bit.' : 'Chi leggesse RAX per intero troverebbe un numero enorme, in cui soltanto ' + (nb === 1 ? 'l’ultimo byte viene' : 'gli ultimi due byte vengono') + ' dall’istruzione.'),
        { calc: 'RAX = ' + X.esa(dopo, 16) }, conservati);
      return { passi, esito: conservati };
    }
  },
  bilancio: {
    regola: [
      'Un registro generale ha 64 bit e più nomi. Per RAX: EAX indica i 32 bit più bassi, AX i 16 più bassi, AL gli 8 più bassi. Le viste sono porzioni sovrapposte dello stesso registro.',
      'Scrivere in una vista da 8 o da 16 bit conserva gli altri bit. Scrivere in una vista da 32 bit azzera i 32 bit alti. Un nome fra parentesi quadre indica la memoria che si trova all’indirizzo contenuto in quel registro.'
    ],
    errori: [
      ['Pensare che EAX e RAX siano registri diversi.', 'Sono due nomi per lo stesso contenitore: EAX è la metà bassa di RAX.'],
      ['Dimenticare l’azzeramento della metà alta.', 'Dopo `mov eax, 1` RAX vale 1, qualunque cosa contenesse prima. Dopo `mov ax, 1` i sei byte alti restano quelli di prima.'],
      ['Confondere `rbx` e `[rbx]`.', 'Senza parentesi si usa il contenuto del registro. Con le parentesi quel contenuto diventa un indirizzo, e il dato viene dalla memoria.']
    ],
    saFare: ['Indico quali bit di RAX corrispondono a EAX, AX e AL.', 'Prevedo il contenuto di RAX dopo una scrittura in una sua vista.', 'Distinguo un operando registro da un operando di memoria.'],
    esercizi: [
      { d: 'RAX contiene 0x1122334455667788. Il processore esegue `mov eax, 0x99`. Quanto vale RAX dopo l’istruzione? Rispondi in esadecimale.', segnaposto: 'Un numero esadecimale', giuste: ['0x99', '99', '99h', '0x0000000000000099', '0000000000000099', '0x00000099', '00000099'],
        ok: 'La vista EAX riceve 0x00000099, e la scrittura a 32 bit azzera la metà alta: RAX vale 0x0000000000000099.',
        diagnosi: [
          { se: ['0x1122334400000099', '1122334400000099'], msg: 'Hai conservato la metà alta. Una scrittura in EAX azzera i 32 bit alti di RAX.' },
          { se: ['0x1122334455667799', '1122334455667799'], msg: 'Hai sostituito un solo byte, come farebbe una scrittura in AL. La vista EAX comprende quattro byte, e la sua scrittura azzera anche gli altri quattro.' },
          { se: ['0x1122334455660099', '1122334455660099'], msg: 'Hai sostituito due byte, come farebbe una scrittura in AX. La destinazione qui è EAX.' }
        ],
        altro: 'Il valore è diverso. Stabilisci quanti byte comprende EAX e che cosa accade ai byte che restano fuori.',
        indizi: ['EAX indica i quattro byte più bassi di RAX.', 'L’immediato 0x99 viene allargato a 0x00000099.', 'Una scrittura in una vista da 32 bit azzera i quattro byte alti.'],
        svolgimento: ['Vista: EAX, quattro byte.', 'Dato allargato: 0x00000099.', 'Metà alta: azzerata dalla scrittura a 32 bit.', 'RAX = 0x0000000000000099.'] },
      { d: 'RBX contiene 0x2000. In memoria, all’indirizzo 0x2000, si trova il byte 0x41. Che cosa contiene AL dopo `mov al, [rbx]`?', guida: 'Scegli la risposta.', o: [
        { t: '0x41', ok: true, fb: 'Le parentesi quadre fanno usare il contenuto di RBX come indirizzo. Il byte copiato è quello che si trova in memoria a 0x2000.' },
        { t: '0x00', fb: 'Questo è il byte più basso di RBX. Con le parentesi quadre il dato viene dalla memoria.' },
        { t: '0x20', fb: 'RBX fa da indirizzo e resta fuori dalla copia. Il dato viene dalla cella che esso indica.' }] }
    ],
    sfida: ['cslez2_1_05_random_assembly_05', 'Bus, indirizzi e trasferimenti di dati']
  }
});
