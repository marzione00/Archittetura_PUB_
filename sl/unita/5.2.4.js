'use strict';
SL.unita524 = (() => {
  // fase: 0 l'inizio · 1 il primo evento · 2 il secondo evento · 3 la raccolta · 4 dopo
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], prima = p.ordine === 'figlio', w3 = (o.w - 20) / 3;
    // stato del figlio e del padre nelle varie fasi
    const figlio = f === 0 ? 'in esecuzione' : prima ? (f <= 2 ? 'zombie' : 'raccolto') : (f === 1 ? 'in esecuzione' : f === 2 ? 'zombie' : 'raccolto');
    const padre = f === 0 ? 'in esecuzione' : prima ? (f === 1 ? 'occupato in altro' : f === 2 ? 'chiama waitpid' : 'in esecuzione') : (f === 1 ? 'bloccato in waitpid' : f === 2 ? 'bloccato in waitpid' : 'in esecuzione');
    const scheda = figlio === 'raccolto' ? 'eliminata' : figlio === 'zombie' ? 'PID 52 · codice ' + p.st : 'PID 52 · attivo';
    els.push(el.box(pre + 'a', o.x, o.y, w3, o.h, 'padre · PID 50', padre, /waitpid/.test(padre) ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'b', o.x + w3 + 10, o.y, w3, o.h, 'figlio · PID 52', figlio, figlio === 'zombie' ? 'zero' : figlio === 'raccolto' ? 'off' : 'on', { cls: 'stretta' }),
      el.box(pre + 'c', o.x + 2 * (w3 + 10), o.y, w3, o.h, 'kernel · scheda del figlio', scheda, figlio === 'zombie' ? 'att' : figlio === 'raccolto' ? 'off' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'd', o.x, o.y + o.h + 14, w3, o.h, 'waitpid restituisce', f >= 3 ? '52' : '·', f === 3 ? 'att' : f > 3 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'e', o.x + w3 + 10, o.y + o.h + 14, w3, o.h, 'WIFEXITED', f >= 4 ? 'vero' : '·', f === 4 ? 'att' : '', { cls: 'stretta' }),
      el.box(pre + 'g', o.x + 2 * (w3 + 10), o.y + o.h + 14, w3, o.h, 'WEXITSTATUS', f >= 4 ? String(p.st) : '·', f === 4 ? 'att' : '', { cls: 'stretta' }));
    return els;
  };
  return { quadro };
})();
SL.registra('5.2.4', {
  titolo: 'Attesa, terminazione e registrazione finale del processo',
  obiettivo: 'Obiettivo: spiegare che cosa resta di un processo terminato, come il padre ne raccoglie l’esito, e perché esistono i processi zombie.',
  concetti: [['process', 'Il figlio lascia un numero'], ['tabella', 'Il kernel lo custodisce'], ['fork', 'Il padre lo raccoglie']],
  filigrana: ['process', 'fork', 'tabella'],
  richiami: {
    carte: [
      { sim: 'process', da: 'Dall’unità 1.1.5', t: 'Il codice di uscita', d: 'Il piccolo numero con cui un programma comunica com’è finito. Lo 0 indica successo.' },
      { sim: 'process', da: 'Dall’unità 2.5.6', t: 'waitpid', d: 'La chiamata con cui un processo attende la fine di un figlio.' },
      { sim: 'tabella', da: 'Dall’unità 5.1.4', t: 'Il PCB', d: 'La scheda del processo nel kernel.' }
    ],
    domanda: { d: 'Prima di proseguire: la shell esegue un comando in un figlio. Come viene a sapere se il comando è riuscito?', o: [
      { t: 'Raccoglie il codice di uscita del figlio', ok: true, fb: 'È il solo dato che un processo terminato lascia al padre.' },
      { t: 'Legge la memoria del figlio', fb: 'La memoria del figlio è isolata, e alla sua fine viene liberata.' },
      { t: 'Controlla che cosa è comparso sul terminale', fb: 'L’uscita sul terminale è per chi guarda. Alla shell serve un dato preciso.' }
    ] }
  },
  idea: {
    titolo: 'Che cosa resta di un processo terminato',
    termini: ['zombie', 'stato di terminazione'],
    testo: [
      'Un processo che termina in modo regolare chiama _exit con un piccolo intero, il codice di uscita. Il kernel chiude i suoi file, libera la sua memoria, lo toglie dalle code. Una cosa però deve conservarla: il codice di uscita, perché il padre potrebbe volerlo conoscere, e in quel momento potrebbe essere impegnato in altro.',
      'Il kernel conserva allora una parte minima della scheda del figlio: il PID e l’esito. Un processo in questa condizione, che non esegue più nulla e di cui resta soltanto la registrazione finale, si chiama [[zombie]]. Di memoria e di processore uno zombie fa a meno. Gli resta una riga nella tabella dei processi, e continua a occuparla finché il padre non la raccoglie.',
      { fig: 'scena', w: 720, h: 138, titolo: 'Il figlio 52 è terminato con codice 13, e il padre non lo ha ancora raccolto', nota: 'Del figlio resta la scheda, con il PID e il codice di uscita. È uno zombie.', els: SL.unita524.quadro('g', { st: 13, ordine: 'figlio' }, 1, { x: 10, y: 0, w: 700, h: 54 }) },
      'A raccogliere è waitpid. La chiamata restituisce il PID del figlio terminato, e riempie una variabile con lo [[stato di terminazione]], un intero che codifica com’è finito il figlio. Lo stato contiene il codice di uscita, insieme ad altre informazioni. Si interroga con due macro. WIFEXITED dice se la terminazione è stata regolare. Se lo è stata, WEXITSTATUS estrae il codice di uscita. Fatta la raccolta, il kernel elimina la scheda, e lo zombie scompare.',
      'I due eventi, la fine del figlio e la chiamata del padre, possono presentarsi in qualunque ordine. Se il figlio termina per primo, resta zombie fino alla waitpid. Se il padre chiama waitpid per primo, si blocca finché il figlio non termina, e la raccolta è immediata. In entrambi i casi il padre riceve gli stessi due numeri: 52 dice chi ha finito, 13 dice come.'
    ]
  },
  esperimento: {
    faremo: [
      'Un padre con PID 50 ha un figlio con PID 52. Sceglierai il codice di uscita del figlio, e quale evento avviene per primo: la fine del figlio oppure la waitpid del padre.',
      'Seguiremo lo stato dei due processi e la scheda che il kernel conserva. Poi leggeremo i due numeri che il padre ottiene.'
    ],
    vedrai: [
      ['process', 'I processi e la scheda', 'In alto: lo stato del padre, lo stato del figlio, e ciò che il kernel conserva del figlio.'],
      ['tabella', 'La raccolta', 'In basso: il valore restituito da waitpid e ciò che le due macro ricavano dallo stato.']
    ]
  },
  lab: {
    titolo: 'Terminare ed essere raccolti',
    scena: { w: 860, h: 140 },
    atti: ['L’inizio', 'I due eventi', 'La raccolta'],
    controlli: [
      { id: 'st', tipo: 'scelta', eti: 'Il figlio chiama', opzioni: [[0, '_exit(0)'], [13, '_exit(13)'], [127, '_exit(127)']], valore: 13 },
      { id: 'ordine', tipo: 'scelta', eti: 'Avviene prima', opzioni: [['figlio', 'la fine del figlio'], ['padre', 'la waitpid del padre']], valore: 'figlio' }
    ],
    nota: 'I passi sono sempre cinque.',
    previsione: {
      domanda: (p) => (p.ordine === 'figlio' ? 'Il figlio 52 chiama _exit(' + p.st + ') mentre il padre è occupato in altro, e chiamerà waitpid più tardi.' : 'Il padre chiama waitpid e resta bloccato. Più tardi il figlio 52 chiama _exit(' + p.st + ').') + ' In quale condizione si trova il figlio subito dopo la sua _exit?',
      opzioni: () => [['zombie', 'È uno zombie, in attesa di essere raccolto'], ['raccolto', 'Viene raccolto subito, e scompare'], ['pronto', 'Torna pronto, in attesa del padre']]
    },
    confronto: (pred, esito, p) => { const N = { zombie: 'uno zombie', raccolto: 'raccolto subito', pronto: 'pronto' }; return 'La previsione indicava: ' + N[pred] + '. Il figlio è ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 'pronto' ? 'Un processo terminato non esegue più, e non torna in nessuna coda.' : p.ordine === 'figlio' ? 'Nessuno sta aspettando il figlio, e il kernel deve conservarne l’esito.' : 'Il padre era già in attesa, e il kernel gli consegna l’esito senza indugio.'); },
    costruisci(p) {
      const U = SL.unita524, passi = [], prima = p.ordine === 'figlio';
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, h: 56 });
      const hud = (f) => [['Figlio', f === 0 || (!prima && f === 1) ? 'in esecuzione' : f <= 2 ? 'zombie' : 'raccolto', 'a'], ['waitpid', f >= 3 ? '52' : '·'], ['Codice di uscita', f >= 4 ? String(p.st) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Padre e figlio', 'Il processo 50 ha creato con fork il figlio 52, che sta svolgendo il proprio lavoro. Il kernel tiene una scheda per ciascuno.', {});
      if (prima) {
        P(1, 1, 'Il figlio termina', 'Il figlio chiama _exit(' + p.st + '). Il kernel libera la sua memoria e chiude i suoi file. Il padre è occupato in altro, e nessuno aspetta il figlio: il kernel conserva la scheda con il PID 52 e il codice ' + p.st + '. Il figlio è uno zombie.', { calc: '_exit(' + p.st + ')', esito: ['zombie', ''] });
        P(2, 1, 'Il padre chiama waitpid', 'Più tardi il padre chiama waitpid. Un figlio terminato c’è già, e la chiamata non ha bisogno di bloccarsi.', { calc: 'waitpid(...)', chiedi: { d: 'Fino a questo momento, lo zombie ha occupato memoria o tempo del processore?', o: ['Sì, come ogni processo', 'No: soltanto una riga nella tabella dei processi'], g: 1, no: 'La memoria è stata liberata alla _exit, e uno zombie non esegue istruzioni.' } });
      } else {
        P(1, 1, 'Il padre chiama waitpid', 'Il padre chiama waitpid. Il figlio sta ancora lavorando, e il padre viene bloccato: aspetta un evento, la fine del figlio.', { calc: 'waitpid(...) → padre bloccato', chiedi: { d: 'In quale stato si trova il padre?', o: ['Pronto', 'Bloccato', 'Zombie'], g: 1, no: 'Aspetta un evento esterno, la terminazione del figlio.' } });
        P(2, 1, 'Il figlio termina', 'Il figlio chiama _exit(' + p.st + '). Il kernel libera la sua memoria. Per un istante il figlio è uno zombie, ma il padre era già in attesa, e il kernel lo risveglia subito.', { calc: '_exit(' + p.st + ')', esito: ['raccolto subito', ''] });
      }
      P(3, 2, 'La raccolta', 'waitpid restituisce 52, il PID del figlio terminato, e scrive lo stato di terminazione nella variabile indicata dal padre. Il kernel elimina la scheda del figlio: lo zombie non esiste più.', { calc: 'waitpid → 52' });
      P(4, 2, 'Leggere lo stato', 'Il padre interroga lo stato. WIFEXITED risulta vero: il figlio è terminato regolarmente, con una _exit. Allora WEXITSTATUS è significativo, e vale ' + p.st + (p.st === 0 ? ', che per convenzione indica successo.' : ', un valore diverso da 0, che per convenzione indica un problema.'), { calc: 'WEXITSTATUS = ' + p.st, esito: [prima ? 'zombie, poi raccolto' : 'raccolto subito', ''] });
      return { passi, esito: prima ? 'zombie' : 'raccolto' };
    }
  },
  bilancio: {
    regola: [
      'Un processo terminato resta zombie finché il padre non lo raccoglie con waitpid. Di lui il kernel conserva PID ed esito.',
      'waitpid restituisce il PID del figlio. Il codice di uscita si estrae dallo stato con WEXITSTATUS, dopo avere verificato WIFEXITED.'
    ],
    errori: [
      ['Confondere il valore restituito da waitpid con il codice di uscita.', 'Il primo è un PID e dice chi è terminato. Il secondo dice come.'],
      ['Usare lo stato di terminazione come se fosse il codice di uscita.', 'Lo stato è codificato. Il codice va estratto con WEXITSTATUS.'],
      ['Non raccogliere mai i figli.', 'Ogni figlio terminato resta zombie, e le righe della tabella dei processi finiscono.']
    ],
    saFare: ['Spiegare che cos’è uno zombie.', 'Distinguere PID del figlio, stato di terminazione e codice di uscita.', 'Prevedere che cosa accade nei due ordini possibili.'],
    esercizi: [
      { d: 'Un figlio con PID 734 termina chiamando _exit(3). Il padre chiama waitpid e la chiamata riesce. Quale valore restituisce waitpid?', segnaposto: 'Un numero', giuste: ['734'],
        ok: 'waitpid restituisce il PID del figlio raccolto.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Il 3 è il codice di uscita, che si estrae dallo stato con WEXITSTATUS.' },
          { se: ['0', 'zero'], msg: 'Lo 0 è il valore di fork nel figlio. waitpid restituisce un PID.' }
        ],
        altro: 'Il numero è diverso. waitpid dice chi ha terminato.',
        indizi: ['waitpid identifica il figlio raccolto.', 'Il figlio ha PID 734.', 'Il valore restituito è 734.'],
        svolgimento: ['Valore restituito: PID del figlio, 734.', 'Codice di uscita, nello stato: 3.'] },
      { d: 'Nella stessa situazione il padre verifica che WIFEXITED sia vero. Quanto vale WEXITSTATUS?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'WEXITSTATUS estrae il codice passato a _exit.',
        diagnosi: [
          { se: ['734'], msg: 'Questo è il PID del figlio, restituito da waitpid.' },
          { se: ['0', 'zero'], msg: 'Lo 0 indicherebbe successo. Il figlio ha chiamato _exit(3).' }
        ],
        altro: 'Il numero è diverso. Guarda l’argomento della _exit del figlio.',
        indizi: ['Il figlio ha chiamato _exit(3).', 'WEXITSTATUS estrae quel numero dallo stato.', 'Vale 3.'],
        svolgimento: ['Codice di uscita: 3.', 'WEXITSTATUS: 3.'] },
      { d: 'Un programma crea mille figli, che terminano tutti, e non chiama mai waitpid. Qual è la conseguenza finché il programma resta in esecuzione?', guida: 'Si scelga la risposta.', o: [
        { t: 'Mille zombie occupano altrettante righe della tabella dei processi', ok: true, fb: 'Nessuno ha raccolto gli esiti, e il kernel deve conservarli.' },
        { t: 'La memoria dei mille figli resta occupata', fb: 'La memoria viene liberata alla terminazione. Resta soltanto la registrazione finale.' },
        { t: 'Nessuna: il kernel elimina da solo i figli terminati', fb: 'Il kernel conserva l’esito finché il padre non lo chiede.' }] }
    ],
    sfida: ['cslez5_2_04_process_control', 'Terminazione, wait e processi zombie']
  }
});
