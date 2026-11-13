'use strict';
/* Prova del capitolo 4.2: una domanda per unità. */
(() => {
  const I = SL.scritture.intero, ESA = SL.scritture.esa, H = SL.kern.H;
  const DIAG = (giuste, lista) => { const visti = new Set(giuste); return lista.filter((x) => { if (!x || visti.has(x.se[0])) return false; visti.add(x.se[0]); return true; }); };
  const MS = (v) => I(v).concat([v + 'ms']);

  SL.registraProva('4.2', { domande: [
    // 4.2.1 · il servizio richiesto, oppure il valore di RCX
    (r) => {
      if (r.int(0, 2) > 0) {
        const s = r.scegli([[0, 0], [1, 1], [60, 2]]), a = r.int(0, 9), OPZ = ['Di leggere dal descrittore ' + a, 'Di scrivere sul descrittore ' + a, 'Di terminare con il codice di uscita ' + a], NOMI = ['read', 'write', 'exit'];
        return { u: '4.2.1', d: 'Un programma esegue SYSCALL con RAX = ' + s[0] + ' e RDI = ' + a + '. Che cosa chiede al kernel?', guida: 'Scegli la risposta.', o: [{ t: OPZ[s[1]], ok: true, fb: 'Il numero ' + s[0] + ' sceglie ' + NOMI[s[1]] + ', e per ' + NOMI[s[1]] + ' RDI è ' + (s[1] === 2 ? 'il codice di uscita.' : 'il descrittore di file.') }]
          .concat([0, 1, 2].filter((k) => k !== s[1]).map((k) => ({ t: OPZ[k], fb: 'Per questo servizio RAX dovrebbe valere ' + [0, 1, 60][k] + '. Con RAX = ' + s[0] + ' il kernel sceglie ' + NOMI[s[1]] + '.' }))) };
      }
      const a = 0x4000 + r.int(1, 3000), v = a + 2, giuste = ESA(v, 4);
      return { u: '4.2.1', d: 'Una SYSCALL comincia all’indirizzo ' + H(a) + '. Quale valore riceve RCX? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste,
        ok: 'RCX riceve l’indirizzo dell’istruzione che segue SYSCALL, lunga 2 byte: ' + H(a) + ' + 2 = ' + H(v) + '.',
        diagnosi: DIAG(giuste, [
          { se: ESA(a, 4), msg: 'Questo è l’indirizzo della SYSCALL stessa. RCX riceve quello dell’istruzione seguente.' },
          { se: ESA(a + 4, 4), msg: 'SYSCALL occupa 2 byte.' },
          { se: ESA(a + 1, 4), msg: 'SYSCALL occupa 2 byte.' }
        ]),
        altro: 'Il valore è diverso. Aggiungi 2 all’indirizzo della SYSCALL, in esadecimale.',
        indizi: ['RCX riceve l’indirizzo di ripresa.', 'SYSCALL occupa 2 byte.', H(a) + ' + 2.'],
        svolgimento: ['Indirizzo di SYSCALL: ' + H(a) + '.', 'Lunghezza: 2 byte.', 'RCX = ' + H(v) + '.'] };
    },
    // 4.2.2 · una write verso una pipe
    (r) => {
      const parola = r.scegli(['COMPUTER', 'PROCESSO', 'REGISTRO', 'TASTIERA', 'SEGMENTO', 'ACCUMULO']), n = r.int(2, 7), ok = r.int(0, 2) > 0, cosa = r.int(0, 1);
      const testa = 'Il buffer contiene la parola ' + parola + ', una lettera per byte. Il programma chiama write con RDX = ' + n + ' su un descrittore ' + (ok ? 'che indica una pipe aperta in scrittura' : 'già chiuso') + '. ';
      if (cosa === 0) { const giuste = I(ok ? n : -9); return { u: '4.2.2', d: testa + 'Quale valore trova in RAX al ritorno?', segnaposto: 'Un numero', giuste,
        ok: ok ? 'La voce esiste e permette la scrittura: il kernel copia ' + n + ' byte e ne restituisce il conteggio.' : 'La voce è vuota. Il kernel restituisce −9, l’errore EBADF, senza copiare nulla.',
        diagnosi: DIAG(giuste, [
          { se: I(ok ? -9 : n), msg: ok ? 'Il descrittore è valido, e la scrittura riesce.' : 'Il descrittore è chiuso. La convalida fallisce prima della copia.' },
          { se: I(8), msg: 'RDX limita la scrittura a ' + n + ' byte.' },
          { se: I(0), msg: ok ? 'I byte sono stati copiati, e RAX ne riporta il numero.' : 'Un errore si segnala con un valore negativo.' },
          { se: I(9), msg: 'Un errore si segnala con il segno meno davanti al codice.' }
        ]),
        altro: 'Il numero è diverso. Guarda prima se il descrittore è valido.',
        indizi: [ok ? 'Il descrittore indica una pipe aperta in scrittura.' : 'Il descrittore è già stato chiuso.', ok ? 'Il kernel copia i byte richiesti.' : 'Il kernel risponde con EBADF, codice 9.', ok ? 'RAX = ' + n + '.' : 'RAX = −9.'],
        svolgimento: ['Convalida del descrittore: ' + (ok ? 'riuscita.' : 'fallita.'), ok ? 'Byte copiati: ' + n + '.' : 'Byte copiati: nessuno.', 'RAX = ' + (ok ? n : '−9') + '.'] }; }
      const giuste = ok ? [parola.slice(0, n).toLowerCase()] : ['nessuna', 'nessuno', 'niente', '0'];
      return { u: '4.2.2', d: testa + 'Quali lettere entrano nella pipe? Scrivile in ordine, oppure scrivi «nessuna».', segnaposto: 'Le lettere, in ordine', giuste,
        ok: ok ? 'RDX = ' + n + ' sceglie i primi ' + n + ' byte del buffer: ' + parola.slice(0, n) + '.' : 'La convalida fallisce prima della copia, e la pipe resta com’era.',
        diagnosi: DIAG(giuste, [
          { se: [parola.toLowerCase()], msg: ok ? 'RDX limita la scrittura a ' + n + ' byte.' : 'Il descrittore è chiuso, e nessun byte viene copiato.' },
          ok ? { se: ['nessuna'], msg: 'Il descrittore è valido, e la copia avviene.' } : { se: [parola.slice(0, n).toLowerCase()], msg: 'Queste lettere entrerebbero con un descrittore valido. Qui la convalida fallisce.' },
          ok ? { se: [parola.slice(-n).toLowerCase()], msg: 'La write parte dall’inizio del buffer.' } : null
        ]),
        altro: 'La risposta è diversa. Controlla il descrittore, poi conta i byte a partire dal primo.',
        indizi: [ok ? 'Il descrittore è valido.' : 'Il descrittore è chiuso.', ok ? 'La write parte dal primo byte del buffer.' : 'La convalida precede la copia.', ok ? 'I primi ' + n + ' byte di ' + parola + '.' : 'Nessun byte viene copiato.'],
        svolgimento: ['Convalida: ' + (ok ? 'riuscita.' : 'fallita.'), ok ? 'Byte richiesti: ' + n + '.' : 'Nessuna copia.', ok ? 'Nella pipe: ' + parola.slice(0, n) + '.' : 'Nella pipe: nessuna lettera.'] };
    },
    // 4.2.3 · preparare la chiamata successiva
    (r) => {
      const base = 0x5000 + 0x100 * r.int(0, 40), n = r.int(12, 60), ok = r.int(0, 3) > 0, k = ok ? r.int(3, n - 2) : 0, ret = ok ? k : -9, cosa = r.int(0, 1);
      const testa = 'Un programma chiama write con RSI = ' + H(base) + ' e RDX = ' + n + '. Il kernel restituisce ' + (ok ? k : '−9') + '. ';
      if (cosa === 0) { const v = base + k, giuste = ESA(v, 4); return { u: '4.2.3', d: testa + 'Quale valore va in RSI per la chiamata successiva? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste,
        ok: ok ? 'Il puntatore avanza dei byte confermati: ' + H(base) + ' + ' + k + ' = ' + H(v) + '.' : 'Dopo un errore nessun byte è partito, e il puntatore resta ' + H(base) + '.',
        diagnosi: DIAG(giuste, [
          ok ? { se: ESA(base, 4), msg: 'I primi ' + k + ' byte sono già partiti. Ripartire da qui li rimanderebbe.' } : { se: ESA(base + 9, 4), msg: 'Il 9 è il codice dell’errore. Nessun byte è partito.' },
          ok ? { se: [base.toString(16).slice(0, -2) + String(k).padStart(2, '0')], msg: 'I byte confermati vanno scritti in esadecimale prima della somma: ' + k + ' è ' + H(k) + '.' } : { se: ESA(base - 9, 4), msg: 'Un valore negativo resta fuori dai conti.' },
          ok ? { se: ESA(base + n, 4), msg: 'Questo è l’indirizzo che segue la fine del buffer. Sono partiti soltanto ' + k + ' byte.' } : null
        ]),
        altro: ok ? 'Il valore è diverso. Somma al puntatore i byte confermati, in esadecimale.' : 'Il valore è diverso. Dopo un errore il puntatore resta invariato.',
        indizi: ok ? ['I byte confermati sono ' + k + '.', k + ' in esadecimale è ' + H(k) + '.', H(base) + ' + ' + H(k) + '.'] : ['Un valore negativo è un errore.', 'Nessun byte è partito.', 'Il puntatore resta ' + H(base) + '.'],
        svolgimento: ok ? ['Byte confermati: ' + k + ' = ' + H(k) + '.', 'Nuovo puntatore: ' + H(base) + ' + ' + H(k) + '.', 'RSI = ' + H(v) + '.'] : ['RAX negativo: errore.', 'Byte confermati: 0.', 'RSI = ' + H(base) + '.'] }; }
      const v = n - k, giuste = I(v);
      return { u: '4.2.3', d: testa + 'Quale valore va in RDX per la chiamata successiva?', segnaposto: 'Un numero', giuste,
        ok: ok ? 'La lunghezza diminuisce dei byte confermati: ' + n + ' − ' + k + ' = ' + v + '.' : 'Dopo un errore nessun byte è partito, e la lunghezza resta ' + n + '.',
        diagnosi: DIAG(giuste, [
          ok ? { se: I(n), msg: 'Con la lunghezza invariata la chiamata chiederebbe ' + k + ' byte oltre la fine del buffer.' } : { se: I(n - 9), msg: 'Il 9 è il codice dell’errore. Nessun byte è partito.' },
          ok ? { se: I(k), msg: 'Questi sono i byte già partiti. Servono quelli che restano.' } : { se: I(n + 9), msg: 'Un valore negativo resta fuori dai conti.' }
        ]),
        altro: ok ? 'Il numero è diverso. Togli dai byte richiesti quelli confermati.' : 'Il numero è diverso. Dopo un errore la lunghezza resta invariata.',
        indizi: ok ? ['Erano richiesti ' + n + ' byte.', 'Ne sono partiti ' + k + '.', n + ' − ' + k + '.'] : ['Un valore negativo è un errore.', 'Nessun byte è partito.', 'La lunghezza resta ' + n + '.'],
        svolgimento: ok ? ['Richiesti: ' + n + '.', 'Confermati: ' + k + '.', 'RDX = ' + v + '.'] : ['RAX negativo: errore.', 'Confermati: 0.', 'RDX = ' + n + '.'] };
    },
    // 4.2.4 · quando termina una read su una pipe vuota
    (r) => {
      const bl = r.int(0, 2) > 0, t = r.int(3, 40), d = r.int(1, 5), cosa = r.int(0, 2) > 0 ? 0 : 1;
      const testa = 'All’istante 0 un processo chiama read su una pipe vuota, nel modo ' + (bl ? 'bloccante' : 'non bloccante') + '. Un byte arriva nella pipe dopo ' + t + ' ms, e lo scheduler assegna il processore a un processo ' + d + ' ms dopo che è tornato pronto. ';
      if (cosa === 0) { const v = bl ? t + d : 0, giuste = MS(v); return { u: '4.2.4', d: testa + 'Dopo quanti millisecondi termina la read?', segnaposto: 'Un numero', giuste,
        ok: bl ? 'Il lettore torna pronto a ' + t + ' ms e riceve il processore a ' + t + ' + ' + d + ' = ' + v + ' ms.' : 'Nel modo non bloccante la read torna subito, a 0 ms, con l’errore EAGAIN.',
        diagnosi: DIAG(giuste, [
          bl ? { se: MS(t), msg: 'A ' + t + ' ms il lettore torna pronto. Per terminare la read deve ricevere il processore.' } : { se: MS(t + d), msg: 'Così si comporta il modo bloccante. Con O_NONBLOCK la read torna senza attendere.' },
          bl ? { se: MS(0), msg: 'Nel modo bloccante la read attende il byte.' } : { se: MS(t), msg: 'Nel modo non bloccante la read torna senza attendere il byte.' },
          bl ? { se: MS(d), msg: 'I ' + d + ' ms si contano dal risveglio, che avviene a ' + t + ' ms.' } : null
        ]),
        altro: 'Il numero è diverso. Guarda il modo della lettura, poi somma gli intervalli che contano.',
        indizi: bl ? ['Il lettore resta sospeso fino a ' + t + ' ms.', 'Poi attende il processore per ' + d + ' ms.', t + ' + ' + d + '.'] : ['La pipe è vuota.', 'Nel modo non bloccante la read non attende.', 'Termina a 0 ms.'],
        svolgimento: bl ? ['Risveglio: ' + t + ' ms.', 'Attesa del processore: ' + d + ' ms.', 'Fine della read: ' + v + ' ms.'] : ['Pipe vuota, modo non bloccante.', 'RAX = −11, EAGAIN.', 'Fine della read: 0 ms.'] }; }
      const v = bl ? 0 : 1, giuste = I(v).concat(v === 0 ? ['nessuno', 'zero'] : ['uno']);
      return { u: '4.2.4', d: testa + 'Quanti byte contiene la pipe all’istante ' + (t + d + 5) + ' ms, se il processo non fa altre chiamate?', segnaposto: 'Un numero', giuste,
        ok: bl ? 'La read bloccante ha prelevato il byte quando è ripresa, e la pipe è di nuovo vuota.' : 'La read era già finita con EAGAIN. Il byte arrivato dopo resta nella pipe.',
        diagnosi: DIAG(giuste, [
          { se: I(bl ? 1 : 0), msg: bl ? 'La read bloccante, quando riprende, toglie il byte dalla pipe.' : 'Nessuna read è in corso quando il byte arriva. Il byte resta nella pipe.' }
        ]),
        altro: 'Il numero è diverso. Chiediti se una read ha prelevato il byte.',
        indizi: [bl ? 'Il lettore attende il byte dentro la read.' : 'La read è finita a 0 ms, senza dati.', 'Il byte arriva a ' + t + ' ms.', bl ? 'La read lo preleva a ' + (t + d) + ' ms.' : 'Nessuno lo preleva.'],
        svolgimento: ['Byte nella pipe a ' + t + ' ms: 1.', bl ? 'La read riprende e lo preleva.' : 'Nessuna read lo preleva.', 'Byte nella pipe: ' + v + '.'] };
    },
    // 4.2.5 · i permessi decidono l'esito di open
    (r) => {
      const c = [r.scegli([6, 7, 4]), r.scegli([0, 4, 6, 2]), r.scegli([0, 4, 6, 2])], chi = r.int(0, 2), cosa = r.int(0, 2) > 0 ? 'lettura' : 'scrittura', peso = cosa === 'lettura' ? 4 : 2, ok = (c[chi] & peso) !== 0;
      const CHI = ['Il proprietario', 'Un utente del gruppo del file', 'Un utente estraneo al gruppo'], NOMI = ['il proprietario', 'il gruppo', 'gli altri'];
      return { u: '4.2.5', d: 'Un file ha i permessi 0' + c.join('') + '. ' + CHI[chi] + ' chiede di aprirlo in ' + cosa + '. Che cosa restituisce open?', guida: 'Scegli la risposta.', o: [
        { t: '3, un nuovo descrittore', ok, fb: ok ? 'Per ' + NOMI[chi] + ' vale la cifra ' + c[chi] + ', che contiene il peso ' + peso + ' della ' + cosa + '.' : 'Per ' + NOMI[chi] + ' vale la cifra ' + c[chi] + ', priva del peso ' + peso + ' della ' + cosa + '.' },
        { t: '−13, accesso negato', ok: !ok, fb: !ok ? 'Per ' + NOMI[chi] + ' vale la cifra ' + c[chi] + ', priva del peso ' + peso + ' della ' + cosa + '. La politica nega, con EACCES.' : 'Per ' + NOMI[chi] + ' vale la cifra ' + c[chi] + ', che contiene il peso ' + peso + ' della ' + cosa + '.' },
        { t: '−9, descrittore non valido', fb: 'EBADF riguarda un descrittore sbagliato. Qui la domanda è se i permessi concedono l’apertura.' }] };
    }
  ] });
})();
