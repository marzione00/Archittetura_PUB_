'use strict';
SL.catalogo.push({
  "id": "1.7",
  "title": "Casi integrati: dai byte al comportamento",
  "units": [
    {
      "id": "1.7.1",
      "title": "Un metodo per interpretare dati binari reali",
      "experiment": "Accorcia il record a 14 byte e poi riportalo a 15. Segui il cursore fino all’ultimo campo che il lettore riesce a consumare per intero.",
      "skill": "Separare controlli strutturali e semantici",
      "check": "A ogni lettura completa il cursore avanza dell’ampiezza del campo. Se i byte residui sono insufficienti, si ferma all’inizio del campo incompleto."
    },
    {
      "id": "1.7.2",
      "title": "Un record di telemetria, cinque regole di rappresentazione",
      "experiment": "Mantieni fisse temperatura e tensione e passa dal nome Z al nome Aè. Confronta lunghezza del nome, posizione dei campi numerici e valori decodificati.",
      "skill": "Combinare più codifiche in un record",
      "check": "Il nome sposta i campi successivi di tanti byte quanti ne occupa in UTF-8. I valori delle misure si conservano perché il lettore usa i nuovi offset."
    },
    {
      "id": "1.7.3",
      "title": "Dai valori decodificati all’uso sicuro delle risorse",
      "experiment": "Scegli un’immagine quadrata di lato 2048 pixel. Passa da un budget di 64 MiB a 8 MiB; poi prova a portare entrambi i lati a 65536.",
      "skill": "Controllare dimensioni e moltiplicazioni",
      "check": "Il prodotto esatto va confrontato sia con il massimo di uint32 sia con il budget in byte. Il residuo su 32 bit può essere piccolo perfino per un’immagine enorme."
    },
    {
      "id": "1.7.4",
      "title": "La politica di accesso come livello di rappresentazione",
      "experiment": "Con W e A a uno e O a zero, attiva il bit riservato 7. Confronta il controllo con maschera 0xE0, l’esito di ruolo e la decisione finale.",
      "skill": "Estrarre e combinare permessi",
      "check": "Un ruolo ammesso e il permesso di scrittura bastano soltanto per una parola valida. L’attivazione del bit riservato provoca un rifiuto già al controllo del formato."
    },
    {
      "id": "1.7.5",
      "title": "Risultati numerici e scelta della rappresentazione",
      "experiment": "Somma dieci quote da 10 centesimi. Ripeti con quote da 25 centesimi e confronta, dopo ogni addizione, le cifre mostrate dai due accumulatori.",
      "skill": "Riconoscere l’errore di rappresentazione",
      "check": "Un quarto di euro ha rappresentazione binaria finita. Un decimo può introdurre scarti visibili a 17 cifre, anche se la stampa arrotondata ai centesimi resta uguale."
    },
    {
      "id": "1.7.6",
      "title": "Dalla sintassi della shell ai byte di un comando",
      "experiment": "Confronta «File vuoto» con «File inesistente» per il comando che legge da fd 0. Segui prima l’apertura e poi l’eventuale avvio del programma.",
      "skill": "Mettere in ordine shell, kernel e decodifica",
      "check": "Il file vuoto si apre e la lettura restituisce zero byte. Il file inesistente arresta invece la redirezione prima che il lettore venga avviato."
    },
    {
      "id": "1.7.7",
      "title": "Laboratorio conclusivo",
      "experiment": "Scegli un nome e decodifica la copia integra. Mantieni lo stesso nome, introduci un solo guasto e confronta originale, copia e risultato della decodifica.",
      "skill": "Costruire prove di andata e ritorno",
      "check": "Nella copia integra riemergono i campi iniziali. Con un’alterazione il lettore indica la prima regola violata, per esempio la lunghezza o il dominio della tensione."
    },
    {
      "id": "1.7.8",
      "title": "Esercizi conclusivi",
      "experiment": "Scegli «Decodificare un record di telemetria». Individua la fine del nome a partire dalla lunghezza in byte. Leggi poi i due campi numerici secondo il rispettivo formato.",
      "skill": "Integrare ordine dei byte, scala e codifica",
      "check": "La temperatura si ottiene da un intero con segno in centesimi di grado. La tensione proviene da una parola binary32. Gli offset dei due campi devono concordare con la lunghezza del nome.",
      "kind": "esercizi"
    },
    {
      "id": "1.7.9",
      "title": "Soluzioni",
      "experiment": "Nello svolgimento «Diagnosticare una copia alterata» confronta la lunghezza attesa con i byte ricevuti. Segui poi il controllo dei flag nella variante di lunghezza corretta.",
      "skill": "Verificare la lunghezza dell’intero record",
      "check": "Le due tracce individuano difetti diversi. La diagnosi va motivata con il primo controllo fallito e con i byte che quel controllo esamina.",
      "kind": "soluzioni"
    }
  ],
  "pwn": []
});
