'use strict';
SL.catalogo.push({
  "id": "4.2",
  "title": "Chiamate di sistema e ingresso controllato nel kernel",
  "units": [
    {
      "id": "4.2.1",
      "title": "Dalla richiesta utente all’esecuzione nel kernel",
      "experiment": "Imposta il primo argomento a 3 e seleziona in successione read, write ed exit. Segui RAX e RDI fino alla selezione del servizio.",
      "skill": "Applicare l’ABI delle syscall",
      "check": "RDI conserva lo stesso numero nei tre casi. RAX decide se il kernel lo interpreta come descrittore di file o come stato di uscita."
    },
    {
      "id": "4.2.2",
      "title": "Il percorso di write oltre il confine di privilegio",
      "experiment": "Richiedi quattro byte dalla stringa COMPUTER e confronta la pipe scrivibile con il descrittore chiuso. Osserva il prefisso inviato e il ritorno in RAX.",
      "skill": "Tracciare gli argomenti di write",
      "check": "Per la pipe, la lunghezza del prefisso coincide con il ritorno della chiamata. Il descrittore chiuso produce un errore prima della consegna dei dati."
    },
    {
      "id": "4.2.3",
      "title": "Convalida, valori di ritorno e avanzamento parziale",
      "experiment": "Imposta 12 byte richiesti e 5 byte disponibili. Segui il puntatore dopo la scrittura, poi ripeti scegliendo l’errore EBADF.",
      "skill": "Gestire una scrittura breve",
      "check": "Il puntatore avanza di tanti byte quanti ne conferma un ritorno positivo. Con EBADF restano invariati sia l’indirizzo del primo byte pendente sia la lunghezza residua."
    },
    {
      "id": "4.2.4",
      "title": "Quando una chiamata di sistema si blocca",
      "experiment": "Fissa l’arrivo del byte a 5 ms. Confronta la lettura bloccante con O_NONBLOCK e annota l’istante di fine chiamata e i byte rimasti nella pipe.",
      "skill": "Distinguere risveglio ed esecuzione",
      "check": "La lettura bloccante consuma il byte quando il thread ritorna sul core. Con O_NONBLOCK la chiamata termina all’istante iniziale e il byte arrivato dopo resta nella pipe."
    },
    {
      "id": "4.2.5",
      "title": "Meccanismo, politica e struttura del sistema operativo",
      "experiment": "Scegli «Altro utente» e cambia i permessi da 0600 a 0644. Ripeti le due aperture come proprietario.",
      "skill": "Distinguere invocazione e autorizzazione",
      "check": "Le due modalità concedono la lettura al proprietario. Per gli altri utenti la decisione cambia con il bit di lettura della loro classe."
    },
    {
      "id": "4.2.6",
      "title": "Problemi svolti",
      "experiment": "Segui lo stesso errore di lettura prima al ritorno dal kernel, poi al ritorno dalla funzione libc. Annota il valore restituito e la sede del codice di errore.",
      "skill": "Interpretare errno",
      "check": "La causa del fallimento è la stessa nei due passaggi. Cambia la convenzione con cui l’applicazione la riconosce.",
      "kind": "esercizi"
    },
    {
      "id": "4.2.7",
      "title": "Esercizi",
      "experiment": "Apri «Preparare i registri della chiamata». Per write e per read assegna numero di servizio, descrittore e conteggio ai registri richiesti.",
      "skill": "Assegnare i registri di read e write",
      "check": "Il passaggio da read a write cambia il servizio selezionato. La posizione di ciascun argomento segue la stessa convenzione per entrambe le chiamate.",
      "kind": "esercizi"
    },
    {
      "id": "4.2.8",
      "title": "Soluzioni",
      "experiment": "Apri «Contabilizzare progresso ed EOF». Nella prima traccia segui l’indirizzo dopo la scrittura parziale. Nella seconda somma i byte effettivamente letti.",
      "skill": "Contabilizzare byte trasferiti, residuo e fine del flusso",
      "check": "Un conteggio positivo sposta il confine tra dati trasferiti e residui. Il ritorno zero della seconda read sul file indica la fine dei dati disponibili, anche se la richiesta aveva lunghezza positiva.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez4_2_01_syscalls_01",
      "title": "Numeri, argomenti e registri delle syscall",
      "format": "scelta multipla",
      "variants": [
        "m4.2.g1.number",
        "m4.2.g1.args",
        "m4.2.g1.return",
        "m4.2.g1.instruction"
      ]
    },
    {
      "id": "cslez4_2_02_syscalls_02",
      "title": "Passaggio dalla modalità utente al kernel",
      "format": "scelta multipla",
      "variants": [
        "m4.2.g2.flow",
        "m4.2.g2.mode",
        "m4.2.g2.hw-save",
        "m4.2.g2.stack-switch"
      ]
    },
    {
      "id": "cslez4_2_03_syscalls_03",
      "title": "Preparare read, write ed exit",
      "format": "scelta multipla",
      "variants": [
        "m4.2.g3.read",
        "m4.2.g3.write",
        "m4.2.g3.exit",
        "m4.2.g3.write-registers"
      ]
    },
    {
      "id": "cslez4_2_04_syscalls_04",
      "title": "Trasferimenti parziali, EOF ed errori",
      "format": "intero",
      "variants": [
        "m4.2.g4.read-result",
        "m4.2.g4.eof",
        "m4.2.g4.errno",
        "m4.2.g4.partial"
      ]
    },
    {
      "id": "cslez4_2_05_syscalls_05",
      "title": "Selezione del servizio e funzione di libreria",
      "format": "scelta multipla",
      "variants": [
        "m4.2.g5.number-stability",
        "m4.2.g5.dispatch",
        "m4.2.g5.wrapper",
        "m4.2.g5.dispatch-order"
      ]
    }
  ]
});
