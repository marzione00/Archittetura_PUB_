'use strict';
SL.registra('3.2.4', {
  titolo: 'Il modello sincrono e i limiti temporali',
  obiettivo: 'Obiettivo: calcolare il periodo minimo di clock per un percorso fra due registri, verificare la condizione di mantenimento e indicare quale dei due problemi si risolve con un periodo più lungo.',
  concetti: [['clock', 'Da un fronte al successivo'], ['lente', 'Il dato più tardivo'], ['conflitto', 'Il dato più precoce']],
  filigrana: ['clock', 'register', 'conflitto'],
  richiami: {
    carte: [
      { sim: 'lente', da: 'Dall’unità 3.1.5', t: 'Il cammino critico', d: 'Il percorso più lento di un circuito combinatorio stabilisce dopo quanto tempo l’uscita è affidabile.' },
      { sim: 'flipflop', da: 'Dall’unità 3.2.2', t: 'La cattura al fronte', d: 'Un flip-flop copia il proprio ingresso al fronte di salita e lo conserva fino al fronte successivo.' },
      { sim: 'clock', da: 'Dall’unità 2.1.4', t: 'Il periodo', d: 'Il periodo è il tempo fra due impulsi consecutivi del clock. Quanto più è breve, tanti più cicli sono contenuti in un secondo.' }
    ],
    domanda: { d: 'Prima di proseguire: un circuito combinatorio ha un cammino critico di 85 ps. L’uscita può essere letta in modo affidabile 60 ps dopo la variazione degli ingressi?', o: [
      { t: 'No, l’uscita può essere ancora provvisoria', ok: true, fb: 'Finché il percorso più lento non ha risposto, l’uscita può cambiare ancora.' },
      { t: 'Sì, quasi tutti i percorsi hanno già risposto', fb: 'È sufficiente un solo percorso ancora in corso per rendere provvisoria l’uscita.' },
      { t: 'Sì, il ritardo riguarda soltanto i registri', fb: 'Il ritardo riguarda le porte della logica. I registri devono attendere che sia trascorso.' }
    ] }
  },
  idea: {
    titolo: 'I due vincoli temporali',
    termini: ['modello sincrono', 'tempo di setup', 'tempo di hold'],
    testo: [
      'In un processore i registri si scambiano i dati attraverso la logica combinatoria. A ogni fronte un registro di partenza mostra una parola nuova, la logica la elabora, e al fronte seguente un registro di arrivo cattura il risultato. Tutti i registri ricevono il medesimo clock. Tale organizzazione prende il nome di [[modello sincrono]]: lo stato cambia soltanto ai fronti, e fra un fronte e il successivo la logica dispone del tempo necessario per assestarsi.',
      { fig: 'scena', w: 720, h: 130, titolo: 'Un percorso fra due registri', nota: 'Il medesimo fronte avvia una parola nuova a sinistra e cattura quella precedente a destra.', els: [
        SL.el.box('r1', 20, 10, 150, 70, 'registro', 'di partenza', 'on', { cls: 'stretta' }), SL.el.linea('l1', 170, 45, 270, 45, 'on'),
        SL.el.box('lg', 270, 10, 180, 70, 'logica', 'combinatoria', 'att', { cls: 'stretta' }), SL.el.linea('l2', 450, 45, 550, 45, 'on'),
        SL.el.box('r2', 550, 10, 150, 70, 'registro', 'di arrivo', 'on', { cls: 'stretta' }),
        SL.el.linea('c1', 95, 80, 95, 112, ''), SL.el.linea('c2', 95, 112, 625, 112, ''), SL.el.linea('c3', 625, 112, 625, 80, ''), SL.el.nota('nc', 330, 92, 'clock', 'mono minuta')
      ] },
      'Affinché la cattura riesca, il dato deve giungere in tempo. Un flip-flop richiede che il proprio ingresso sia stabile già un certo tempo prima del fronte, e tale anticipo prende il nome di [[tempo di setup]]. Il calcolo ha inizio dal fronte precedente. Il registro di partenza impiega un certo tempo per mostrare la parola nuova, la logica aggiunge il ritardo del suo cammino critico, e infine occorre il setup. La somma dei tre tempi è il periodo minimo ammissibile per il clock.',
      'Esiste anche il rischio opposto. Immediatamente dopo il fronte il registro di arrivo richiede che il proprio ingresso resti stabile ancora per un certo tempo, mentre completa la cattura: è il [[tempo di hold]]. Il medesimo fronte, tuttavia, ha avviato una parola nuova dal registro di partenza. Se il percorso più breve della logica è molto rapido, la parola nuova giunge prima che l’hold sia trascorso e altera la cattura in corso.',
      'I due controlli impiegano tempi diversi. Per il setup sono rilevanti i ritardi massimi, cioè il percorso più lento; per l’hold i ritardi minimi, cioè il percorso più rapido.',
      'Anche i rimedi sono diversi. Una violazione di setup si corregge allungando il periodo, a scapito della velocità del processore. Una violazione di hold persiste con qualunque periodo, poiché riguarda un solo fronte, e si corregge nel circuito rallentando il percorso troppo rapido.'
    ]
  },
  esperimento: {
    faremo: [
      'Due registri ricevono il medesimo clock e sono separati da una rete logica. Il registro di partenza mostra la parola nuova fra 12 e 30 ps dopo il fronte. Il registro di arrivo richiede 15 ps di setup e 18 ps di hold. I controlli fissano il periodo e i ritardi della logica, massimo e minimo.',
      'Il dato più tardivo e quello più precoce sono seguiti su un asse dei tempi, sul quale si misurano i due margini. Dopo il caso proposto, è istruttivo portare il ritardo minimo a 3 ps e tentare poi di rimediare allungando il periodo.'
    ],
    vedrai: [
      ['clock', 'I due fronti', 'Le linee verticali: il fronte che avvia il dato e quello che lo cattura.'],
      ['lente', 'Il percorso lento', 'In alto: il dato più tardivo e la finestra di setup che esso deve precedere.'],
      ['conflitto', 'Il percorso rapido', 'In basso: il dato più precoce e la finestra di hold che esso deve superare.']
    ]
  },
  lab: {
    titolo: 'Due registri e una rete logica',
    scena: { w: 860, h: 320 },
    atti: ['Il fronte di partenza', 'Il dato più tardivo', 'Il controllo di setup', 'Il dato più precoce', 'Il controllo di hold', 'Il verdetto'],
    controlli: [
      { id: 't', tipo: 'scelta', eti: 'Periodo del clock', opzioni: [[100, '100 ps'], [120, '120 ps'], [140, '140 ps']], valore: 120 },
      { id: 'max', tipo: 'scelta', eti: 'Ritardo massimo della logica', opzioni: [[65, '65 ps'], [80, '80 ps']], valore: 65 },
      { id: 'min', tipo: 'scelta', eti: 'Ritardo minimo della logica', opzioni: [[3, '3 ps'], [8, '8 ps'], [20, '20 ps']], valore: 8 }
    ],
    nota: 'I passi sono sempre sei. Uscita del registro fra 12 e 30 ps, setup di 15 ps, hold di 18 ps.',
    previsione: {
      domanda: (p) => 'Il registro di partenza mostra il dato fra 12 e 30 ps dopo il fronte. La logica impiega da ' + p.min + ' a ' + p.max + ' ps. Il registro di arrivo richiede 15 ps di setup e 18 ps di hold, e il periodo è di ' + p.t + ' ps. Quali condizioni sono rispettate?',
      opzioni: () => [['ss', 'Setup e hold'], ['sn', 'Soltanto il setup'], ['ns', 'Soltanto l’hold'], ['nn', 'Nessuna delle due']]
    },
    confronto: (pred, esito, p) => { const N = { ss: 'setup e hold', sn: 'soltanto il setup', ns: 'soltanto l’hold', nn: 'nessuna delle due' }; return 'La previsione indicava: ' + N[pred] + '. Esito: ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Per il setup occorrono 30 + ' + p.max + ' + 15 = ' + (45 + p.max) + ' ps, da confrontare con il periodo di ' + p.t + ' ps. Per l’hold il dato più precoce arriva dopo 12 + ' + p.min + ' = ' + (12 + p.min) + ' ps, da confrontare con 18 ps.'); },
    costruisci(p) {
      const el = SL.el, passi = [], T = p.t, X0 = 190, K = 4.5, tardi = 30 + p.max, presto = 12 + p.min, ms = T - tardi - 15, mh = presto - 18;
      const S = (v) => (v >= 0 ? '+' : '−') + Math.abs(v) + ' ps';
      const st = { tardi: false, setup: false, presto: false, hold: false };
      const quadro = (o) => {
        const els = [el.nota('t0', X0 - 6, 0, '0', 'mono minuta'), el.nota('tT', X0 + T * K - 34, 0, 'T = ' + T, 'mono minuta', o.setup ? 'att' : ''),
          el.linea('f0', X0, 20, X0, 214, o.lancio ? 'att' : 'on'), el.linea('fT', X0 + T * K, 20, X0 + T * K, 214, o.setup ? 'att' : 'on'),
          el.nota('l1', 16, 36, 'dato più tardivo', 'mono', o.tardi ? 'att' : ''), el.nota('l2', 16, 82, 'finestra di setup', 'mono', o.setup ? 'att' : ''),
          el.nota('l3', 16, 136, 'dato più precoce', 'mono', o.presto ? 'att' : ''), el.nota('l4', 16, 182, 'finestra di hold', 'mono', o.hold ? 'att' : '')];
        els.push(el.barra('s1', X0, 30, 30 * K, 26, st.tardi ? 1 : 0), el.barra('s2', X0 + 30 * K, 30, p.max * K, 26, st.tardi ? 1 : 0),
          Object.assign(el.barra('sw', X0 + (T - 15) * K, 76, 15 * K, 26, st.setup ? 1 : 0), st.setup && ms < 0 ? { st: 'err' } : null),
          el.barra('h1', X0, 130, 12 * K, 26, st.presto ? 1 : 0), el.barra('h2', X0 + 12 * K, 130, p.min * K, 26, st.presto ? 1 : 0),
          Object.assign(el.barra('hw', X0, 176, 18 * K, 26, st.hold ? 1 : 0), st.hold && mh < 0 ? { st: 'err' } : null));
        els.push(el.box('b1', 16, 232, 198, 76, 'arrivo più tardivo', st.tardi ? tardi + ' ps' : '·', o.tardi ? 'att' : st.tardi ? 'on' : '', { cls: 'stretta' }),
          el.box('b2', 224, 232, 198, 76, 'margine di setup', st.setup ? S(ms) : '·', !st.setup ? '' : ms < 0 ? 'err' : o.setup || o.fine ? 'att' : 'on', { cls: 'stretta' }),
          el.box('b3', 432, 232, 198, 76, 'arrivo più precoce', st.presto ? presto + ' ps' : '·', o.presto ? 'att' : st.presto ? 'on' : '', { cls: 'stretta' }),
          el.box('b4', 640, 232, 204, 76, 'margine di hold', st.hold ? S(mh) : '·', !st.hold ? '' : mh < 0 ? 'err' : o.hold || o.fine ? 'att' : 'on', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Periodo', T + ' ps', 'a'], ['Margine di setup', st.setup ? S(ms) : '·'], ['Margine di hold', st.hold ? S(mh) : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ lancio: true }, 0, 'Un fronte, due effetti', 'Al tempo zero si presenta un fronte di salita. Il registro di partenza inizia a mostrare una parola nuova, e nel medesimo istante il registro di arrivo cattura quella preparata nel ciclo precedente. Il fronte successivo si presenterà dopo ' + T + ' ps.',
        { chiedi: { d: 'La parola nuova dovrà essere catturata al fronte successivo. Per stabilire se arriva in tempo, quale percorso della logica va considerato?', o: ['Il più lento', 'Il più rapido'], g: 0, no: 'Se arriva in tempo il dato che segue il percorso più lento, arrivano in tempo tutti gli altri.' } });
      st.tardi = true;
      P({ tardi: true }, 1, 'Il dato più tardivo', 'Il registro di partenza impiega al massimo 30 ps per mostrare la parola nuova. La logica, lungo il suo cammino critico, ne aggiunge ' + p.max + '. Nel caso peggiore il dato raggiunge il registro di arrivo ' + tardi + ' ps dopo il fronte.', { calc: '30 + ' + p.max + ' = ' + tardi + ' ps' });
      st.setup = true;
      P({ setup: true }, 2, ms >= 0 ? 'Il setup è rispettato' : 'Il setup è violato', 'Il registro di arrivo richiede il dato stabile 15 ps prima del fronte, cioè entro ' + (T - 15) + ' ps. Il dato arriva a ' + tardi + ' ps. ' + (ms >= 0 ? 'Restano ' + ms + ' ps di margine.' : 'Mancano ' + (-ms) + ' ps: al fronte il dato potrebbe essere ancora instabile, e il valore catturato dal registro è incerto.') + ' Il periodo minimo per questo percorso è 30 + ' + p.max + ' + 15 = ' + (tardi + 15) + ' ps.',
        { calc: T + ' − ' + tardi + ' − 15 = ' + S(ms).replace(' ps', '') + ' ps', chiedi: { d: 'Si consideri ora l’hold. Con un periodo più lungo, l’arrivo del dato più precoce dopo il fronte cambia?', o: ['Sì, arriva più tardi', 'No, resta invariato'], g: 1, no: 'Il dato più precoce parte dal fronte corrente e segue il percorso più breve. La distanza del fronte successivo è ininfluente sul suo arrivo.' } });
      st.presto = true;
      P({ presto: true }, 3, 'Il dato più precoce', 'Si torna al fronte iniziale per esaminare il caso opposto. Il registro di partenza può mostrare la parola nuova già dopo 12 ps, e il percorso più breve della logica dura ' + p.min + ' ps. La parola nuova può presentarsi al registro di arrivo dopo soli ' + presto + ' ps.', { calc: '12 + ' + p.min + ' = ' + presto + ' ps' });
      st.hold = true;
      P({ hold: true }, 4, mh >= 0 ? 'L’hold è rispettato' : 'L’hold è violato', 'Il registro di arrivo sta ancora catturando la parola precedente, e richiede che il proprio ingresso resti stabile per 18 ps dopo il fronte. La parola nuova arriva dopo ' + presto + ' ps. ' + (mh >= 0 ? 'La finestra è già chiusa, con ' + mh + ' ps di margine.' : 'Arriva ' + (-mh) + ' ps troppo presto, mentre la cattura è in corso, e può alterarla.'), { calc: presto + ' − 18 = ' + S(mh).replace(' ps', '') + ' ps' });
      const esito = (ms >= 0 ? 's' : 'n') + (mh >= 0 ? 's' : 'n');
      P({ fine: true }, 5, 'Il verdetto', (ms >= 0 && mh >= 0 ? 'Entrambe le condizioni sono rispettate: il circuito funziona con questo clock.' : ms < 0 && mh >= 0 ? 'Il setup è violato. Il rimedio consiste nell’allungare il periodo fino ad almeno ' + (tardi + 15) + ' ps, oppure nel ridurre il cammino critico della logica.' : ms >= 0 ? 'L’hold è violato. Un periodo più lungo è inefficace, poiché il confronto riguarda un solo fronte. Occorre rallentare il percorso più rapido di almeno ' + (-mh) + ' ps.' : 'Sono violate entrambe. Per il setup occorre un periodo di almeno ' + (tardi + 15) + ' ps. Per l’hold il periodo è ininfluente, e va rallentato il percorso più rapido di almeno ' + (-mh) + ' ps.') + ' I due margini derivano da percorsi diversi della medesima logica: il più lento per il setup, il più rapido per l’hold.',
        { calc: 'setup ' + S(ms) + ' · hold ' + S(mh), esito: [ms >= 0 && mh >= 0 ? 'condizioni rispettate' : ms < 0 && mh < 0 ? 'setup e hold violati' : ms < 0 ? 'setup violato' : 'hold violato', ms >= 0 && mh >= 0 ? 'si' : 'no'] });
      return { passi, esito };
    }
  },
  bilancio: {
    regola: [
      'Setup: il periodo deve coprire l’uscita più lenta del registro di partenza, il cammino critico della logica e il tempo di setup. La somma dei tre è il periodo minimo.',
      'Hold: l’uscita più rapida del registro, sommata al percorso più breve della logica, deve superare il tempo di hold. Il periodo è assente da questa condizione.'
    ],
    errori: [
      ['Allungare il periodo per correggere una violazione di hold.', 'L’hold riguarda ciò che accade immediatamente dopo un fronte. Lo spostamento del fronte successivo lascia invariata la condizione.'],
      ['Impiegare i ritardi massimi anche per l’hold.', 'Per l’hold è rilevante il dato che arriva per primo, quindi i ritardi minimi.'],
      ['Trascurare il ritardo di uscita del registro.', 'Dopo il fronte il registro di partenza impiega un certo tempo per mostrare la parola nuova, e tale tempo entra in entrambi i calcoli.']
    ],
    saFare: ['Calcolare il periodo minimo di un percorso fra due registri.', 'Verificare la condizione di hold con i ritardi minimi.', 'Indicare il rimedio adatto a una violazione di setup e a una di hold.'],
    esercizi: [
      { d: 'Un registro mostra la parola nuova entro 25 ps dal fronte. La logica ha un cammino critico di 140 ps, e il registro di arrivo richiede un setup di 20 ps. Qual è il periodo minimo del clock, in picosecondi?', segnaposto: 'Un numero di picosecondi', giuste: ['185', '185ps'],
        ok: 'Il periodo deve coprire i tre tempi in successione: 25 + 140 + 20 = 185 ps.',
        diagnosi: [
          { se: ['165', '165ps'], msg: 'Manca il tempo di setup: il dato deve essere stabile 20 ps prima del fronte.' },
          { se: ['160', '160ps'], msg: 'Manca il ritardo di uscita del registro di partenza, 25 ps.' },
          { se: ['140', '140ps'], msg: 'Questo è il solo cammino critico della logica. Vanno aggiunti l’uscita del registro e il setup.' }
        ],
        altro: 'Il numero è diverso. Si sommino l’uscita del registro, il cammino critico e il setup.',
        indizi: ['Il dato parte dal registro dopo 25 ps.', 'Il dato attraversa la logica in 140 ps.', 'Il dato deve arrivare 20 ps prima del fronte successivo.'],
        svolgimento: ['Uscita del registro: 25 ps.', 'Cammino critico: 140 ps. Setup: 20 ps.', 'Periodo minimo: 25 + 140 + 20 = 185 ps.'] },
      { d: 'Dopo il fronte un registro può mostrare la parola nuova già dopo 10 ps, e il percorso più breve della logica dura 5 ps. Il registro di arrivo richiede un hold di 18 ps. Di quanti picosecondi il dato arriva in anticipo?', segnaposto: 'Un numero di picosecondi', giuste: ['3', '3ps', 'tre'],
        ok: 'Il dato più precoce arriva dopo 10 + 5 = 15 ps, e l’hold ne richiede 18: mancano 3 ps.',
        diagnosi: [
          { se: ['15', '15ps'], msg: 'Questo è l’istante in cui arriva il dato più precoce. Va confrontato con i 18 ps dell’hold.' },
          { se: ['13', '13ps'], msg: 'All’arrivo contribuisce anche l’uscita del registro, 10 ps, oltre ai 5 ps della logica.' },
          { se: ['8', '8ps'], msg: 'All’arrivo contribuisce anche il percorso della logica, 5 ps, oltre ai 10 ps del registro.' }
        ],
        altro: 'Il numero è diverso. Si calcoli l’arrivo più precoce e lo si sottragga dal tempo di hold.',
        indizi: ['Arrivo più precoce: uscita rapida del registro più percorso breve della logica.', '10 + 5 = 15 ps.', '18 − 15.'],
        svolgimento: ['Arrivo più precoce: 10 + 5 = 15 ps.', 'Hold richiesto: 18 ps.', 'Anticipo: 18 − 15 = 3 ps.'] }
    ]
  }
});
