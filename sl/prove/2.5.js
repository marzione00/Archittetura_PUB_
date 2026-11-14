'use strict';
/* Prova del capitolo 2.5: una domanda per unità. */
(() => {
  const I = SL.scritture.intero, ESA = SL.scritture.esa, X = SL.x86, N = X.num;
  const HA = (a) => '0x' + a.toString(16).toUpperCase();

  SL.registraProva('2.5', { domande: [
    // 2.5.1 · che cosa contengono i registri dopo SYSCALL
    (r) => {
      const forma = r.int(0, 2);
      if (forma === 0) {
        const n = r.int(3, 40), ind = r.scegli([0x5000, 0x6000, 0x7000]) + 16 * r.int(0, 15);
        return { u: '2.5.1', d: 'Un programma esegue `mov eax, 1`, `mov edi, 1`, `mov rsi, ' + HA(ind) + '`, `mov edx, ' + n + '` e `syscall`. Il kernel scrive tutti i byte richiesti. Quanto vale RAX dopo il ritorno?', segnaposto: 'Un numero', giuste: I(n),
          ok: 'Il servizio numero 1 è write, che restituisce il numero di byte scritti: ' + n + '.',
          diagnosi: [
            { se: ['1'], msg: 'Uno è il numero del servizio, che RAX conteneva all’andata. Al ritorno il kernel vi ha scritto il risultato.' },
            { se: ESA(ind, 4).concat(I(ind)), msg: 'Il valore indicato è l’indirizzo del messaggio, contenuto in RSI. Il risultato di write è un numero di byte.' },
            { se: ['0'], msg: 'Zero indicherebbe nessun byte scritto. Il kernel ne ha scritti quanti indicava RDX.' }
          ],
          altro: 'Il valore è diverso. Si individui il servizio dal numero in RAX, e si stabilisca poi che cosa restituisce.',
          indizi: ['Il numero 1 in RAX indica il servizio write.', 'Il servizio write restituisce il numero di byte scritti.', 'I byte da scrivere sono indicati da RDX.'],
          svolgimento: ['RAX = 1: il servizio è write.', 'RDI = 1: uscita standard. RSI = ' + HA(ind) + ': indirizzo del messaggio. RDX = ' + n + ': lunghezza.', 'Il kernel scrive ' + n + ' byte e restituisce ' + n + ' in RAX.'] };
      }
      if (forma === 1) {
        const pid = r.int(300, 9000);
        return { u: '2.5.1', d: 'Un processo con PID ' + pid + ' esegue `mov eax, 39` e `syscall`. Il numero 39 indica il servizio getpid. Quanto vale RAX dopo il ritorno?', segnaposto: 'Un numero', giuste: I(pid),
          ok: 'Il servizio getpid restituisce il PID del processo che lo richiede: ' + pid + '.',
          diagnosi: [
            { se: ['39'], msg: 'Trentanove è il numero del servizio, che RAX conteneva all’andata. Al ritorno il kernel vi ha scritto il risultato.' },
            { se: ['0'], msg: 'Il servizio getpid restituisce il PID del processo, che in questo caso vale ' + pid + '.' }
          ],
          altro: 'Il valore è diverso. Al ritorno RAX contiene il risultato del servizio richiesto.',
          indizi: ['All’andata RAX contiene il numero del servizio.', 'Al ritorno RAX contiene il risultato.', 'Il risultato di getpid è il PID del processo.'],
          svolgimento: ['RAX = 39: il servizio è getpid.', 'Il kernel legge il PID del processo: ' + pid + '.', 'Al ritorno RAX = ' + pid + '.'] };
      }
      const a = 0x401000 + 2 * r.int(4, 120);
      return { u: '2.5.1', d: 'L’istruzione `syscall` si trova all’indirizzo ' + HA(a) + ' e occupa 2 byte. Quale valore contiene RCX quando il kernel assume il controllo? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x401020', giuste: ESA(a + 2, 6),
        ok: 'SYSCALL salva in RCX l’indirizzo dell’istruzione successiva: ' + HA(a) + ' + 2 = ' + HA(a + 2) + '.',
        diagnosi: [
          { se: ESA(a, 6), msg: 'Il valore indicato è l’indirizzo di SYSCALL. Il programma deve riprendere dall’istruzione successiva, due byte più avanti.' },
          { se: ESA(a + 1, 6), msg: 'L’istruzione occupa 2 byte: la successiva comincia due byte più avanti.' }
        ],
        altro: 'Il valore è diverso. RCX riceve l’indirizzo da cui il programma riprenderà.',
        indizi: ['SYSCALL salva in RCX l’indirizzo di ripresa.', 'L’indirizzo di ripresa è quello dell’istruzione che segue SYSCALL.', HA(a) + ' + 2.'],
        svolgimento: ['SYSCALL si trova a ' + HA(a) + ' e occupa 2 byte.', 'L’istruzione successiva comincia a ' + HA(a + 2) + '.', 'RCX = ' + HA(a + 2) + '.'] };
    },
    // 2.5.2 · i registri degli argomenti e la traduzione degli errori
    (r) => {
      const forma = r.int(0, 2), FUN = ['RDI', 'RSI', 'RDX', 'RCX', 'R8', 'R9'], SIS = ['RDI', 'RSI', 'RDX', 'R10', 'R8', 'R9'], ORD = ['primo', 'secondo', 'terzo', 'quarto', 'quinto', 'sesto'];
      if (forma === 0) {
        const k = r.scegli([0, 1, 2, 3, 3, 3, 4, 5]), altri = r.mescola(['RAX', 'RCX', 'R10', 'R11', 'RDI', 'RSI', 'RDX', 'R8', 'R9'].filter((x) => x !== SIS[k])).slice(0, 3);
        const fb = (x) => (x === 'RCX' ? 'RCX è il registro che SYSCALL sovrascrive con l’indirizzo di ripresa. Un argomento lasciato in tale registro andrebbe perduto.' : x === 'RAX' ? 'RAX contiene il numero del servizio, che è un’informazione distinta.' : x === 'R11' ? 'R11 riceve da SYSCALL la copia dei flag. Gli argomenti sono trasmessi in RDI, RSI, RDX, R10, R8 e R9.' : 'In ' + x + ' il kernel cerca il ' + ORD[SIS.indexOf(x)] + ' argomento.');
        return { u: '2.5.2', d: 'In quale registro il kernel di Linux cerca il ' + ORD[k] + ' argomento di una chiamata di sistema?', guida: 'Si scelga la risposta.', o: [{ t: SIS[k], ok: true, fb: 'L’ordine è RDI, RSI, RDX, R10, R8, R9.' + (k === 3 ? ' Il quarto registro è l’unico che differisce rispetto alle funzioni.' : '') }].concat(altri.map((x) => ({ t: x, fb: fb(x) }))) };
      }
      if (forma === 1) {
        const e = r.int(2, 38);
        return { u: '2.5.2', d: 'Dopo una chiamata di sistema RAX contiene −' + e + '. Quale codice conserva in errno la funzione di raccordo?', segnaposto: 'Un numero', giuste: I(e),
          ok: 'Il valore è compreso fra −4095 e −1, e indica quindi un errore. Il codice è il valore cambiato di segno: ' + e + '.',
          diagnosi: [
            { se: I(-e), msg: 'Il valore indicato è quello restituito dal kernel. In errno è scritto il codice positivo, ottenuto con il cambio di segno.' },
            { se: I(-1), msg: 'Meno uno è il valore che la funzione di raccordo restituisce al programma. In errno è conservato il codice dell’errore.' },
            { se: ['0'], msg: 'Zero indicherebbe l’assenza di errori. Un valore fra −4095 e −1 è un errore, e il codice è il suo valore assoluto.' }
          ],
          altro: 'Il codice è diverso. Il kernel restituisce il codice dell’errore cambiato di segno.',
          indizi: ['Un valore fra −4095 e −1 indica un errore.', 'Il codice dell’errore è il valore assoluto del numero restituito.', 'Il valore assoluto di −' + e + '.'],
          svolgimento: ['RAX = −' + e + ': è compreso fra −4095 e −1, e indica quindi un errore.', 'La funzione di raccordo cambia segno: ' + e + '.', 'errno = ' + e + ', e il programma riceve −1.'] };
      }
      const errore = r.int(0, 1) === 1, v = errore ? -r.int(2, 38) : r.int(2, 4000);
      return { u: '2.5.2', d: 'Dopo una chiamata di sistema RAX contiene ' + N(v) + '. Quale valore restituisce al programma la funzione di raccordo?', guida: 'Si scelga la risposta.', o: [
        { t: N(v), ok: !errore, fb: errore ? 'Il valore è compreso fra −4095 e −1, e indica quindi un errore. La funzione di raccordo lo sostituisce con −1 e conserva il codice in errno.' : 'Il valore è esterno all’intervallo degli errori, da −4095 a −1, ed è trasmesso invariato al programma.' },
        { t: '−1', ok: errore, fb: errore ? 'Il valore è compreso fra −4095 e −1, e indica quindi un errore: il programma riceve −1, e il codice ' + (-v) + ' è scritto in errno.' : 'Meno uno segnala un errore. In questo caso il valore è positivo, esterno all’intervallo da −4095 a −1.' },
        { t: N(-v), fb: errore ? 'Il valore indicato è il codice dell’errore, che la funzione di raccordo conserva in errno. Al programma è restituito −1.' : 'Il segno resta invariato: il valore è positivo ed è estraneo agli errori.' },
        { t: '0', fb: errore ? 'Zero indicherebbe un esito positivo. Un valore fra −4095 e −1 è un errore.' : 'Il kernel ha restituito un numero significativo, che la funzione di raccordo trasmette invariato.' }] };
    },
    // 2.5.3 · trasferimenti parziali
    (r) => {
      if (r.int(0, 1) === 0) {
        const chiesti = r.scegli([8, 16, 32, 64]); let disp = r.int(3, chiesti + 12); if (disp === chiesti) disp -= 1;
        const letti = Math.min(chiesti, disp), acc = r.int(1, letti - 1), resto = letti - acc;
        const diagnosi = [{ se: I(letti), msg: 'Il valore indicato è il numero di byte letti. Alcuni sono già stati scritti.' }, { se: I(acc), msg: 'Il valore indicato è il numero di byte scritti. Sono richiesti quelli rimasti.' }];
        if (chiesti - acc !== resto) diagnosi.unshift({ se: I(chiesti - acc), msg: 'In tal modo il calcolo parte dai byte richiesti alla lettura. La lettura ne ha restituiti ' + letti + ', ed è questo il numero offerto alla scrittura.' });
        return { u: '2.5.3', d: 'Un programma richiede a read ' + chiesti + ' byte, e nel file ne restano ' + disp + '. La scrittura che segue riceve tutti i byte letti, e l’uscita ne accetta ' + acc + '. Quanti byte restano da scrivere?', segnaposto: 'Un numero', giuste: I(resto),
          ok: 'La lettura restituisce ' + letti + ' byte. La scrittura ne offre ' + letti + ' e ne consegna ' + acc + ': ne restano ' + resto + '.',
          diagnosi,
          altro: 'Il numero è diverso. Si calcoli dapprima il numero di byte restituiti dalla lettura, e si sottraggano poi quelli scritti.',
          indizi: ['La lettura restituisce il minore fra i byte richiesti e quelli disponibili.', 'I byte letti sono ' + letti + '.', letti + ' − ' + acc + '.'],
          svolgimento: ['Lettura: richiesti ' + chiesti + ', disponibili ' + disp + '. Restituiti ' + letti + '.', 'Scrittura: offerti ' + letti + ', accettati ' + acc + '.', 'Restano ' + letti + ' − ' + acc + ' = ' + resto + ' byte.'] };
      }
      const base = r.scegli([0x7000, 0x5000, 0x9000]), n = r.int(12, 60), w = r.int(3, n - 3);
      return { u: '2.5.3', d: 'Una scrittura di ' + n + ' byte a partire dall’indirizzo ' + HA(base) + ' restituisce ' + w + '. Da quale indirizzo deve riprendere la scrittura successiva? Si risponda in esadecimale.', segnaposto: 'Per esempio ' + HA(base + 8), giuste: ESA(base + w, 4),
        ok: 'I primi ' + w + ' byte sono già stati scritti. Il primo ancora da scrivere si trova a ' + HA(base) + ' + ' + w + ' = ' + HA(base + w) + '.',
        diagnosi: [
          { se: ESA(base, 4), msg: 'Con una ripresa dall’inizio del buffer, i primi ' + w + ' byte sarebbero scritti una seconda volta.' },
          { se: ESA(base + parseInt(String(w), 16), 4), msg: 'Lo spostamento, ' + w + ' byte, è corretto. Prima della somma con la base va scritto in esadecimale.' },
          { se: ESA(base + n - w, 4), msg: 'Il calcolo impiega i byte rimasti. L’indirizzo avanza dei byte già scritti, che sono ' + w + '.' },
          { se: ESA(base + n, 4), msg: 'Il valore indicato è l’indirizzo che segue la fine dei dati. La scrittura deve riprendere dal primo byte ancora da scrivere.' }
        ],
        altro: 'L’indirizzo è diverso. Si faccia avanzare l’inizio del buffer di tanti byte quanti ne sono stati scritti.',
        indizi: ['Il valore restituito indica il numero di byte scritti.', 'L’indirizzo avanza di ' + w + ' byte.', w + ' in esadecimale si scrive ' + w.toString(16).toUpperCase() + '.'],
        svolgimento: ['Byte scritti: ' + w + '.', w + ' = 0x' + w.toString(16).toUpperCase() + '.', 'Nuovo indirizzo: ' + HA(base) + ' + 0x' + w.toString(16).toUpperCase() + ' = ' + HA(base + w) + '.'] };
    },
    // 2.5.4 · pagine, e che cosa resta dopo execve
    (r) => {
      if (r.int(0, 1) === 0) {
        const base = r.scegli([0x700000, 0x7F0000, 0x600000, 0x7A0000]), pag = r.int(2, 9);
        return { u: '2.5.4', d: 'Una mappatura comincia all’indirizzo ' + HA(base) + ' e occupa ' + pag + ' pagine da 4096 byte. Qual è il primo indirizzo dopo la sua fine? Si risponda in esadecimale.', segnaposto: 'Per esempio ' + HA(base + 0x1000), giuste: ESA(base + pag * 4096, 6),
          ok: 'Una pagina di 4096 byte è 0x1000 in esadecimale. ' + pag + ' pagine occupano 0x' + (pag * 4096).toString(16).toUpperCase() + ' byte.',
          diagnosi: [
            { se: ESA(base + pag, 6), msg: 'In tal modo le pagine sono contate come byte. Ogni pagina ne occupa 4096.' },
            { se: ESA(base + (pag - 1) * 4096, 6), msg: 'Il valore indicato è l’indirizzo a cui comincia l’ultima pagina. La mappatura termina una pagina più avanti.' },
            { se: ESA(base + pag * 4096 - 1, 6), msg: 'Il valore indicato è l’ultimo byte della mappatura. È richiesto il primo indirizzo successivo.' },
            { se: ESA(base + parseInt(String(pag * 4096), 16), 6), msg: 'La dimensione in decimale è corretta. Prima della somma con la base va scritta in esadecimale: 4096 è 0x1000.' }
          ],
          altro: 'L’indirizzo è diverso. Si scriva la dimensione di una pagina in esadecimale e la si moltiplichi per ' + pag + '.',
          indizi: ['4096 è 16 × 16 × 16, cioè 0x1000.', pag + ' pagine occupano ' + pag + ' × 0x1000 = 0x' + (pag * 4096).toString(16).toUpperCase() + ' byte.', HA(base) + ' + 0x' + (pag * 4096).toString(16).toUpperCase() + '.'],
          svolgimento: ['Una pagina: 4096 byte = 0x1000.', pag + ' pagine: 0x' + (pag * 4096).toString(16).toUpperCase() + ' byte.', 'Fine della mappatura: ' + HA(base + pag * 4096) + '.'] };
      }
      const pid = r.int(300, 9000), riesce = r.int(0, 1) === 1, cod = r.scegli([2, 13]);
      const V = 'Il programma precedente, con il PID ' + pid, NUOVO = 'Il nuovo programma, con il PID ' + pid, V2 = 'Il programma precedente, con il PID ' + (pid + 1), N2 = 'Il nuovo programma, con il PID ' + (pid + 1);
      return { u: '2.5.4', d: 'Un processo con PID ' + pid + ' chiama execve. ' + (riesce ? 'La chiamata riesce.' : 'Il kernel restituisce −' + cod + '.') + ' Quale programma esegue il processo subito dopo, e con quale PID?', guida: 'Si scelga la risposta.', o: [
        { t: riesce ? NUOVO : V, ok: true, fb: riesce ? 'Il servizio execve sostituisce il programma e lascia il processo: il PID resta ' + pid + '.' : 'Un valore negativo segnala che la chiamata è fallita. L’immagine è rimasta invariata, e il programma precedente prosegue.' },
        { t: riesce ? V : NUOVO, fb: riesce ? 'Dopo una execve riuscita l’immagine del programma precedente è stata eliminata.' : 'Il valore −' + cod + ' è un errore, e la sostituzione è mancata.' },
        { t: N2, fb: 'Il servizio execve lascia invariato il numero dei processi. Il PID resta ' + pid + '.' },
        { t: V2, fb: 'Il PID di un processo resta il medesimo per tutta la sua esistenza.' }] };
    },
    // 2.5.5 · dup oppure una seconda apertura
    (r) => {
      const F = 'ABCDEFGHIJKL', dup = r.int(0, 1) === 1, n = r.int(2, 5), k = r.int(2, 4), da = dup ? n : 0, giusto = F.slice(da, da + k), altro = F.slice(dup ? 0 : n, (dup ? 0 : n) + k);
      const scritture = (s) => [s.toLowerCase(), s.toLowerCase().split('').join(','), s.toLowerCase().split('').join(' ')];
      return { u: '2.5.5', d: 'Un file contiene le lettere da A a L. Il descrittore 3 lo ha aperto, e il descrittore 4 è stato ottenuto ' + (dup ? 'con dup dal descrittore 3' : 'con una seconda apertura del medesimo file') + '. Il programma legge ' + n + ' byte dal descrittore 3 e poi ' + k + ' byte dal descrittore 4. Quali lettere ottiene la seconda lettura?', segnaposto: k + ' lettere', giuste: scritture(giusto),
        ok: dup ? 'I due descrittori condividono una sola descrizione. La prima lettura porta la posizione a ' + n + ', e la seconda riprende da tale posizione.' : 'Le due aperture hanno creato due descrizioni. La seconda lettura parte dalla posizione 0 della propria.',
        diagnosi: [
          { se: scritture(altro), msg: dup ? 'In tal modo i due descrittori avrebbero posizioni indipendenti, come dopo due aperture. Con dup la posizione è una sola.' : 'In tal modo i due descrittori condividerebbero la posizione, come dopo dup. Due aperture creano due descrizioni.' },
          { se: scritture(F.slice(0, n)), msg: 'Le lettere indicate sono quelle della prima lettura. Sono richieste quelle della seconda.' }
        ],
        altro: 'Le lettere sono diverse. Si stabilisca il numero di descrizioni esistenti e la posizione da cui parte la seconda lettura.',
        indizi: [dup ? 'Dopo dup esiste una sola descrizione, con una sola posizione.' : 'Due aperture creano due descrizioni, ciascuna con la propria posizione.', 'La seconda lettura parte dalla posizione ' + da + '.', 'Alla posizione ' + da + ' si trova la lettera ' + F[da] + '.'],
        svolgimento: [dup ? 'dup: i descrittori 3 e 4 rinviano alla medesima descrizione.' : 'Due aperture: il descrittore 3 rinvia a una descrizione, il 4 a un’altra.', 'Lettura di ' + n + ' byte dal 3: ' + F.slice(0, n) + '.', 'Lettura di ' + k + ' byte dal 4: parte dalla posizione ' + da + ' e consegna ' + giusto + '.'] };
    },
    // 2.5.6 · il codice di uscita, all'andata e al ritorno
    (r) => {
      if (r.int(0, 1) === 0) {
        const c = r.scegli([r.int(257, 700), r.int(257, 700), r.int(3, 250), -r.int(1, 6)]), c8 = ((c % 256) + 256) % 256;
        const diagnosi = [];
        if (c !== c8) diagnosi.push({ se: I(c), msg: 'Il kernel conserva soltanto gli otto bit più bassi del codice. Il valore indicato li eccede.' });
        diagnosi.push({ se: ['60'], msg: 'Sessanta è il numero del servizio exit, contenuto in RAX. Il codice di uscita è in RDI.' });
        if (c8 !== 0) diagnosi.push({ se: ['0'], msg: 'Zero si otterrebbe con un codice multiplo di 256.' });
        return { u: '2.5.6', d: 'Un programma termina con `mov edi, ' + c + '`, `mov eax, 60` e `syscall`. Quale codice di uscita legge il processo genitore?', segnaposto: 'Un numero', giuste: I(c8),
          ok: c >= 0 && c <= 255 ? 'Il codice ' + c + ' è contenuto in otto bit ed è ricevuto invariato dal genitore.' : c < 0 ? 'In complemento a due ' + N(c) + ' si scrive con gli otto bit bassi pari a ' + c8 + ': 256 − ' + (-c) + '.' : 'Il kernel conserva gli otto bit bassi: ' + c + ' − ' + (Math.floor(c / 256) * 256) + ' = ' + c8 + '.',
          diagnosi,
          altro: 'Il codice è diverso. Si riduca il numero ai suoi otto bit più bassi.',
          indizi: ['Il kernel conserva soltanto gli otto bit più bassi del codice.', 'Otto bit rappresentano i numeri da 0 a 255.', c >= 0 ? 'Si sottragga da ' + c + ' il massimo multiplo di 256 che vi è contenuto: ' + (Math.floor(c / 256) * 256) + '.' : 'Per un numero negativo piccolo si somma 256: 256 − ' + (-c) + '.'],
          svolgimento: ['Codice richiesto: ' + N(c) + '.', c >= 0 ? 'Multiplo di 256 da sottrarre: ' + (Math.floor(c / 256) * 256) + '.' : 'Otto bit bassi in complemento a due: 256 − ' + (-c) + '.', 'Codice letto dal genitore: ' + c8 + '.'] };
      }
      const c8 = r.int(1, 254), stato = c8 * 256, H4 = '0x' + stato.toString(16).toUpperCase().padStart(4, '0');
      return { u: '2.5.6', d: 'Il genitore riceve da waitpid la parola di stato ' + H4 + ', per un figlio terminato di propria volontà. Il codice di uscita occupa i bit da 15 a 8. Qual era il codice di uscita?', segnaposto: 'Un numero', giuste: I(c8),
        ok: 'Con uno scorrimento della parola a destra di otto posizioni si ottiene 0x' + X.esa2(c8) + ', cioè ' + c8 + '.',
        diagnosi: [
          { se: I(stato), msg: 'Il valore indicato è quello dell’intera parola. Il codice di uscita ne occupa soltanto i bit da 15 a 8.' },
          { se: ['0'], msg: 'Zero è il contenuto dei bit da 7 a 0, che descrivono il modo di terminazione. Il codice occupa il campo più alto.' },
        ].concat(/[a-f]/.test(c8.toString(16)) ? [{ se: ESA(c8, 2), msg: 'Le cifre sono corrette, e tuttavia in esadecimale. Il valore va scritto in decimale.' }] : []),
        altro: 'Il codice è diverso. Si prendano le due cifre esadecimali più alte della parola e le si converta in decimale.',
        indizi: ['I bit da 15 a 8 corrispondono alle due cifre esadecimali di sinistra.', 'Tali due cifre sono ' + X.esa2(c8) + '.', '0x' + X.esa2(c8) + ' = ' + Math.floor(c8 / 16) + ' × 16 + ' + (c8 % 16) + '.'],
        svolgimento: ['Parola di stato: ' + H4 + '.', 'Scorrimento a destra di 8: 0x' + X.esa2(c8) + '.', 'In decimale: ' + c8 + '.'] };
    }
  ] });
})();
