'use strict';
SL.registra('3.6.4', {
  titolo: 'Conflitti di controllo, stalli e bolle',
  obiettivo: 'Alla fine saprai seguire un salto condizionato dentro PIPE: quali istruzioni vengono prelevate prima di conoscerne l’esito, quali diventano bolle se la previsione è sbagliata, e da quale indirizzo riparte il prelievo.',
  concetti: [['conflitto', 'La scommessa sul salto'], ['stallo', 'Due bolle al posto di due istruzioni'], ['puntatore', 'Da dove si riparte']],
  filigrana: ['conflitto', 'stallo', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'conflitto', da: 'Dall’unità 3.5.3', t: 'Il costo di una previsione sbagliata', d: 'Le due istruzioni prelevate dalla destinazione vengono annullate, e si perdono due cicli.' },
      { sim: 'mux', da: 'Dall’unità 3.6.2', t: 'Il selettore del prelievo', d: 'Con un salto previsto male nello stadio M, f_pc prende il valore di M_valA.' },
      { sim: 'register', da: 'Dall’unità 3.6.1', t: 'I registri di pipeline', d: 'Al fronte ogni registro cattura l’ingresso preparato dallo stadio precedente.' }
    ],
    domanda: { d: 'Prima di proseguire: un salto condizionato entra nello stadio F al ciclo 1. Quante istruzioni sono state prelevate dopo di lui nel ciclo in cui lo stadio E ne valuta la condizione?', o: [
      { t: 'Due', ok: true, fb: 'Il salto è nello stadio E al ciclo 3. Nei cicli 2 e 3 lo stadio F ha prelevato due istruzioni.' },
      { t: 'Una', fb: 'Fra F ed E c’è lo stadio D: dopo il salto sono passati due cicli, e due prelievi.' },
      { t: 'Nessuna', fb: 'PIPE preleva a ogni ciclo, senza attendere la condizione.' }
    ] }
  },
  idea: {
    titolo: 'Annullare senza disfare',
    termini: ['e_cnd', 'segnale di bolla'],
    testo: [
      'Un salto condizionato attraversa gli stadi F e D prima che qualcuno ne conosca l’esito. PIPE scommette sulla destinazione, e intanto preleva. Quando il salto arriva nello stadio E, dietro di lui ci sono già due istruzioni della strada prevista: la prima nello stadio D, la seconda nello stadio F.',
      'Nello stadio E i codici di condizione dicono se il salto va eseguito. L’esito viaggia su un segnale chiamato [[e_cnd|e_Cnd]], che vale 1 quando la condizione è vera. Con e_Cnd = 1 la scommessa è vinta, e nulla cambia.',
      'Con e_Cnd = 0 le due istruzioni dietro il salto appartengono alla strada sbagliata. Nessuna delle due ha ancora modificato lo stato del programma, perché i registri si scrivono nello stadio W, la memoria nello stadio M e i codici di condizione nello stadio E, mentre loro sono ferme più indietro. Basta impedire che avanzino. Al fronte i registri D ed E ricevono una bolla al posto del loro ingresso normale. Lo comandano due [[segnale di bolla|segnali di bolla]], `D_bubble` ed `E_bubble`.',
      { fig: 'scena', w: 720, h: 196, titolo: 'Una previsione sbagliata, prima e dopo il fronte', nota: 'P0 e P1, prelevate dalla destinazione, lasciano il posto a due bolle. Il salto prosegue.', els:
        [SL.el.nota('ga', 10, 0, 'ciclo 3 · e_Cnd = 0', 'mono', 'att'), SL.el.nota('gb', 10, 92, 'ciclo 4', 'mono')]
          .concat(SL.pipe.stadi('gp', ['P1', 'P0', 'jne', 'I2', 'I1'], { x: 10, y: 22, w: 124, gap: 12, h: 58, st: ['err', 'err', 'att', 'on', 'on'] }))
          .concat(SL.pipe.stadi('gd', ['da 0x49', 'bolla', 'bolla', 'jne', 'I2'], { x: 10, y: 114, w: 124, gap: 12, h: 58, st: ['on', 'zero', 'zero', 'att', 'on'] })) },
      'Il salto intanto prosegue verso lo stadio M, portando nel campo `M_valA` l’indirizzo dell’istruzione che lo segue in memoria. Nel ciclo successivo il selettore del prelievo trova nello stadio M un salto previsto male, e fa ripartire il prelievo da quell’indirizzo. Il costo è di due cicli, quelli spesi per le due istruzioni scartate.',
      'Una bolla si comporta come una `nop` creata dal controllo, e attraversa gli stadi restanti senza scrivere nulla. Le istruzioni scartate scompaiono prima di avere avuto effetti, e nessuna scrittura va disfatta.'
    ]
  },
  esperimento: {
    faremo: [
      'Seguiremo uno `jne` nel ciclo in cui raggiunge lo stadio E, e nel ciclo seguente. Dietro di lui ci sono due `nop` prelevate dalla destinazione, che chiameremo P0 e P1.',
      'Sceglierai l’esito della condizione e gli indirizzi. Guarderemo i segnali di bolla, il contenuto dei registri dopo il fronte e l’indirizzo del nuovo prelievo. Dopo il caso proposto, prova la condizione vera e confronta i due cicli.'
    ],
    vedrai: [
      ['pipeline', 'Gli stadi', 'In alto e in basso: gli occupanti dei cinque stadi, prima e dopo il fronte.'],
      ['flag', 'I segnali', 'Al centro: e_Cnd e i due segnali di bolla.'],
      ['puntatore', 'Il prelievo', 'Al centro, a destra: f_pc, l’indirizzo da cui si riparte.']
    ]
  },
  lab: {
    titolo: 'Un salto nello stadio E',
    scena: { w: 860, h: 292 },
    atti: ['Il salto in E', 'L’esito', 'Il fronte', 'Il nuovo prelievo'],
    controlli: [
      { id: 't', tipo: 'scelta', eti: 'Condizione del salto', opzioni: [[0, 'falsa'], [1, 'vera']], valore: 0 },
      { id: 'a', tipo: 'scelta', eti: 'Indirizzi', opzioni: [[0, 'salto a 0x40, destinazione 0x180'], [1, 'salto a 0x100, destinazione 0x2C0']], valore: 0 }
    ],
    nota: 'I passi sono sempre cinque. P0 e P1 sono due nop da un byte, prelevate dalla destinazione del salto.',
    previsione: {
      domanda: (p) => { const g = SL.unita364.G[p.a], H = SL.y86.esa; return 'Uno `jne` comincia all’indirizzo ' + H(g.b) + ', occupa 9 byte e ha destinazione ' + H(g.d) + '. PIPE ha già prelevato dalla destinazione due `nop` da un byte. Nello stadio E la condizione risulta ' + (p.t ? 'vera' : 'falsa') + '. Da quale indirizzo avviene il prelievo successivo?'; },
      opzioni: (p) => { const g = SL.unita364.G[p.a], H = SL.y86.esa; return [g.b + 9, g.d, g.d + 1, g.d + 2].map((v) => [v, H(v)]); }
    },
    confronto: (pred, esito, p) => { const g = SL.unita364.G[p.a], H = SL.y86.esa; return 'Avevi previsto ' + H(pred) + '. Il prelievo avviene da ' + H(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.t ? (pred === g.b + 9 ? 'La condizione è vera, come PIPE aveva previsto, e la strada sequenziale resta inutilizzata.' : 'Le istruzioni a ' + H(g.d) + ' e ' + H(g.d + 1) + ' sono già state prelevate. Il prelievo prosegue dopo di loro.') : (pred === g.d + 2 ? 'Quello sarebbe il prelievo con la previsione giusta. Qui la condizione è falsa.' : 'Gli indirizzi della destinazione appartengono alla strada da abbandonare.')); },
    costruisci(p) {
      const el = SL.el, H = SL.y86.esa, passi = [], g = SL.unita364.G[p.a], t = p.t, seq = g.b + 9, v = t ? g.d + 2 : seq;
      const quadro = (f) => {
        const els = [el.nota('t0', 20, 0, 'CICLO 3 · IL SALTO È NELLO STADIO E', 'mono', f < 3 ? 'att' : '')];
        SL.pipe.stadi('a', ['P1', 'P0', 'jne', 'I2', 'I1'], { x: 20, y: 22, h: 62, st: [f >= 2 && !t ? 'err' : 'on', f >= 2 && !t ? 'err' : 'on', f <= 1 ? 'att' : 'on', 'on', 'on'] }).forEach((e) => els.push(e));
        els.push(el.box('s1', 20, 104, 196, 66, 'esito della condizione', f >= 1 ? 'e_Cnd = ' + t : 'e_Cnd = ·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }),
          el.box('s2', 228, 104, 196, 66, 'bolla nel registro D', f >= 2 ? 'D_bubble = ' + (1 - t) : 'D_bubble = ·', f === 2 ? (t ? 'att' : 'err') : f > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('s3', 436, 104, 196, 66, 'bolla nel registro E', f >= 2 ? 'E_bubble = ' + (1 - t) : 'E_bubble = ·', f === 2 ? (t ? 'att' : 'err') : f > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('s4', 644, 104, 196, 66, 'prossimo prelievo', f >= 4 ? 'f_pc = ' + H(v) : 'f_pc = ·', f >= 4 ? 'att' : '', { cls: 'stretta' }),
          el.nota('t1', 20, 190, 'CICLO 4 · DOPO IL FRONTE', 'mono', f >= 3 ? 'att' : ''));
        SL.pipe.stadi('b', f >= 3 ? [f >= 4 ? 'da ' + H(v) : '…', t ? 'P1' : 'bolla', t ? 'P0' : 'bolla', 'jne', 'I2'] : ['·', '·', '·', '·', '·'], { x: 20, y: 212, h: 62, st: f < 3 ? ['off', 'off', 'off', 'off', 'off'] : [f >= 4 ? 'att' : 'off', t ? 'on' : 'zero', t ? 'on' : 'zero', f === 3 ? 'att' : 'on', 'on'] }).forEach((e) => els.push(e));
        return els;
      };
      const hud = (f) => [['e_Cnd', f >= 1 ? String(t) : '·', 'a'], ['Bolle inserite', f >= 3 ? String(t ? 0 : 2) : '·'], ['f_pc', f >= 4 ? H(v) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Il salto nello stadio E', 'Siamo al ciclo 3. Lo `jne` prelevato all’indirizzo ' + H(g.b) + ' è nello stadio E. Dietro di lui ci sono P0, prelevata dalla destinazione ' + H(g.d) + ' e ora nello stadio D, e P1, che lo stadio F sta prelevando da ' + H(g.d + 1) + '. Le istruzioni più vecchie, I2 e I1, occupano gli stadi M e W.',
        { chiedi: { d: 'Lo `jne` comincia a ' + H(g.b) + ' e occupa 9 byte. A quale indirizzo si trova l’istruzione che lo segue in memoria?', o: [H(g.b + 1), H(seq), H(g.d)], g: 1, no: 'L’istruzione seguente comincia dove il salto finisce: ' + H(g.b) + ' + 9 = ' + H(seq) + '.' } });
      P(1, 1, 'L’esito della condizione', 'Lo stadio E esamina i codici di condizione. ' + (t ? 'La condizione del salto è vera, e e_Cnd vale 1. La scommessa di PIPE è vinta: P0 e P1 sono proprio le istruzioni da eseguire.' : 'La condizione del salto è falsa, e e_Cnd vale 0. La strada giusta era quella sequenziale, che comincia a ' + H(seq) + '. P0 e P1 appartengono alla strada sbagliata.'), { calc: 'e_Cnd = ' + t + (t ? ' · previsione giusta' : ' · previsione sbagliata') });
      P(2, 1, 'I segnali di bolla', t ? 'Con la previsione confermata i segnali di bolla restano a 0. Al fronte i registri D ed E cattureranno il loro ingresso normale, cioè P1 e P0.' : 'Il controllo porta a 1 i segnali `D_bubble` ed `E_bubble`. Al fronte il registro D riceverà una bolla al posto di P1, e il registro E una bolla al posto di P0. Le due istruzioni sono ancora nei primi due stadi, dove nulla viene scritto, e possono scomparire senza conseguenze.', { calc: 'D_bubble = ' + (1 - t) + ' · E_bubble = ' + (1 - t) });
      P(3, 2, 'Dopo il fronte', 'Ciclo 4. ' + (t ? 'Ogni istruzione è avanzata di un posto: lo `jne` è nello stadio M, P0 nello stadio E, P1 nello stadio D.' : 'Lo `jne` è avanzato nello stadio M, e porta nel campo `M_valA` l’indirizzo ' + H(seq) + '. Negli stadi E e D ci sono due bolle. P0 e P1 sono uscite dalla pipeline senza lasciare traccia.'), { calc: 'ciclo 4:  D ' + (t ? 'P1' : 'bolla') + '  E ' + (t ? 'P0' : 'bolla') + '  M jne  W I2' });
      P(4, 3, 'Il nuovo prelievo', t ? 'Il selettore del prelievo trova lo stadio M senza correzioni da fare, e usa il PC previsto. P1 occupava il byte ' + H(g.d + 1) + ', quindi il prelievo prosegue da ' + H(v) + '. Il salto è costato quanto ogni altra istruzione.' : 'Il selettore del prelievo trova nello stadio M un salto previsto male, e lascia passare `M_valA`. Il prelievo riparte da ' + H(v) + ', l’istruzione che segue il salto. Le due bolle sono il prezzo della previsione sbagliata: due cicli.', { calc: 'f_pc = ' + (t ? 'F_predPC' : 'M_valA') + ' = ' + H(v), esito: ['f_pc = ' + H(v) + (t ? ' · 0 bolle' : ' · 2 bolle'), t ? 'si' : ''] });
      return { passi, esito: v };
    }
  },
  bilancio: {
    regola: [
      'PIPE prevede eseguito ogni salto condizionato. Quando il salto arriva nello stadio E, due istruzioni della destinazione occupano già gli stadi D e F.',
      'Se e_Cnd vale 0, i segnali D_bubble ed E_bubble le sostituiscono con due bolle, e nel ciclo seguente il prelievo riparte da M_valA, l’indirizzo che segue il salto. Se e_Cnd vale 1 nulla cambia.'
    ],
    errori: [
      ['Annullare anche il salto.', 'Il salto prosegue fino allo stadio W come ogni istruzione. Vengono annullate le due istruzioni che lo seguono.'],
      ['Ripartire dalla destinazione dopo una previsione sbagliata.', 'La destinazione era la strada prevista. Si riparte dall’altra, cioè dall’istruzione che segue il salto in memoria.'],
      ['Pensare che le istruzioni annullate vadano disfatte.', 'Si trovano negli stadi F e D, dove nessuna istruzione scrive registri, memoria o codici di condizione.']
    ],
    saFare: ['Dico quali istruzioni seguono un salto nella pipeline.', 'Ricavo i segnali di bolla da e_Cnd.', 'Calcolo l’indirizzo del prelievo successivo.'],
    esercizi: [
      { d: 'Uno `je` comincia all’indirizzo 0x70, occupa 9 byte e ha destinazione 0x200. Nello stadio E risulta e_Cnd = 0. Da quale indirizzo avviene il prelievo successivo? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['79', '0x79', '79h', '079', '0x079'],
        ok: 'La previsione era sbagliata, e si riparte dall’istruzione che segue il salto: 0x70 + 9 = 0x79.',
        diagnosi: [
          { se: ['200', '0x200', '200h'], msg: 'La destinazione è la strada già prelevata, che ora va abbandonata.' },
          { se: ['202', '0x202', '202h'], msg: 'Quello sarebbe il prelievo con la previsione giusta. Qui e_Cnd vale 0.' },
          { se: ['70', '0x70', '70h'], msg: 'Questo è l’indirizzo del salto stesso. Serve quello dell’istruzione che lo segue.' }
        ],
        altro: 'Il valore è diverso. Con e_Cnd = 0 si riparte dall’istruzione che segue il salto in memoria.',
        indizi: ['e_Cnd = 0: la previsione era sbagliata.', 'Si riparte da M_valA, l’indirizzo che segue il salto.', '0x70 + 9.'],
        svolgimento: ['e_Cnd = 0: la destinazione va abbandonata.', 'M_valA = 0x70 + 9 = 0x79.', 'f_pc = 0x79.'] },
      { d: 'Lo stesso `je` ha ora e_Cnd = 1. Le due istruzioni già prelevate dalla destinazione 0x200 occupano 2 byte ciascuna. Da quale indirizzo avviene il prelievo successivo? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['204', '0x204', '204h'],
        ok: 'La previsione era giusta. Dopo due istruzioni da 2 byte il prelievo prosegue da 0x200 + 4 = 0x204.',
        diagnosi: [
          { se: ['202', '0x202', '202h'], msg: 'Le istruzioni già prelevate sono due, da 2 byte ciascuna.' },
          { se: ['79', '0x79', '79h'], msg: 'La condizione è vera, e la strada sequenziale resta inutilizzata.' },
          { se: ['200', '0x200', '200h'], msg: 'L’istruzione a 0x200 è già nella pipeline. Il prelievo prosegue dopo le due già prelevate.' }
        ],
        altro: 'Il valore è diverso. Con e_Cnd = 1 il prelievo prosegue dopo le istruzioni già prelevate dalla destinazione.',
        indizi: ['e_Cnd = 1: la previsione era giusta.', 'Dalla destinazione sono state prelevate due istruzioni.', '0x200 + 2 + 2.'],
        svolgimento: ['Prima istruzione: da 0x200 a 0x201.', 'Seconda istruzione: da 0x202 a 0x203.', 'Prelievo successivo: 0x204.'] },
      { d: 'Dopo una previsione sbagliata, quali registri di pipeline ricevono una bolla al fronte?', guida: 'Scegli la risposta.', o: [
        { t: 'I registri D ed E', ok: true, fb: 'Le due istruzioni da scartare si trovano negli stadi F e D, e al fronte sarebbero entrate nei registri D ed E.' },
        { t: 'I registri F e D', fb: 'Il registro F riceve il nuovo PC previsto. Le istruzioni da scartare sarebbero entrate nei registri D ed E.' },
        { t: 'I registri E ed M', fb: 'Nel registro M entra il salto stesso, che deve proseguire.' }] }
    ],
    sfida: ['cslez3_6_05_random_assembly', 'Trasferimenti tra stadi e bolle']
  }
});
SL.unita364 = { G: [{ b: 0x40, d: 0x180 }, { b: 0x100, d: 0x2C0 }] };
