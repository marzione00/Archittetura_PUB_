'use strict';
SL.catalogo.push({
  "id": "2.4",
  "title": "Operazioni bit a bit, scorrimenti e maschere",
  "units": [
    {
      "id": "2.4.1",
      "title": "Maschere e scorrimenti come operazioni macchina",
      "experiment": "Usa il byte 128 e uno spostamento di una posizione. Confronta i risultati di SHR e SAR. Ripeti con 127 mantenendo lo stesso spostamento.",
      "skill": "Distinguere SHR e SAR",
      "check": "Entrambe le istruzioni espellono lo stesso bit basso. SHR riempie da sinistra con zero e SAR replica il bit di segno originale, perciò i risultati possono divergere."
    },
    {
      "id": "2.4.2",
      "title": "Un solo bit a uno in posizione k",
      "experiment": "Sposta il bit attivo dalla posizione 7 alla posizione 8 e osserva il byte da destra e la posizione interna. Prova anche la posizione 63.",
      "skill": "Generare una maschera a un bit",
      "check": "Ogni gruppo di otto posizioni appartiene a un byte. Attraversando un confine aumenta il numero del byte e la posizione interna riparte da zero."
    },
    {
      "id": "2.4.3",
      "title": "Impacchettare campi e costruire valori vincolati",
      "experiment": "Mantieni la sorgente bassa a 37. Confronta la sorgente alta 186 con 170, poi con 187. Segui i due campi dal primo AND all’OR finale.",
      "skill": "Comporre campi indipendenti",
      "check": "Il risultato dipende soltanto dai quattro bit bassi di ogni sorgente. Cambiare gli altri bit lascia identico il byte composto."
    },
    {
      "id": "2.4.4",
      "title": "Derivare le maschere di campo",
      "experiment": "Lascia la parola a 4660 e la larghezza a tre bit. Cambia il primo bit da 4 a 5 e confronta maschera allineata e valore estratto.",
      "skill": "Derivare maschera e posizione",
      "check": "Lo spostamento seleziona una diversa finestra nella parola. Dopo AND, lo scorrimento a destra consegna il campo con il suo primo bit in posizione zero."
    },
    {
      "id": "2.4.5",
      "title": "Comporre una parola nel formato di un’istruzione",
      "experiment": "Componi la parola con i dati iniziali. Cambia solo il registro B e confronta la parola composta con i quattro campi riletti nella decodifica.",
      "skill": "Impacchettare quattro campi",
      "check": "La variazione rimane nei cinque bit destinati a B. Il controllo inverso recupera anche gli altri tre campi con i rispettivi valori d’ingresso."
    },
    {
      "id": "2.4.6",
      "title": "Problemi svolti",
      "experiment": "Parti da 0xAB e segui l’estrazione dei bit da 4 a 7. Distingui il valore lasciato dalla maschera dal valore ottenuto dopo lo scorrimento.",
      "skill": "Distinguere campo mascherato e campo normalizzato",
      "check": "La maschera conserva il campo alle posizioni originali. Lo scorrimento di quattro posti lo porta nel semibyte basso.",
      "kind": "esercizi"
    },
    {
      "id": "2.4.7",
      "title": "Esercizi",
      "experiment": "In «Sostituire un campo e verificarlo» disegna la maschera del campo, prevedi il byte dopo l’inserimento e controlla il valore riletto in DL.",
      "skill": "Controllare un campo aggiornato e i bit circostanti",
      "check": "L’estrazione finale controlla i bit appena inseriti. Il confronto con il byte di partenza permette di verificare anche i bit esterni al campo.",
      "kind": "esercizi"
    },
    {
      "id": "2.4.8",
      "title": "Soluzioni",
      "experiment": "Seleziona «Allineare un puntatore alla potenza di due». Per ciascuna traccia segui RAX dopo l’addizione, dopo AND e durante il test finale.",
      "skill": "Verificare l’allineamento attraverso i bit bassi",
      "check": "L’aggiunta di A − 1 prepara l’arrotondamento verso l’alto a un multiplo di A. La maschera azzera i bit bassi e il controllo finale rileva che valgono tutti zero.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez2_4_01_random_assembly_01",
      "title": "Maschere per byte e singoli bit",
      "format": "assembly",
      "variants": [
        "m2.4.keep-low-byte",
        "m2.4.keep-high-nibble",
        "m2.4.extract-bit5",
        "m2.4.set-bit7"
      ]
    },
    {
      "id": "cslez2_4_02_random_assembly_02",
      "title": "Modificare bit e combinare semibyte",
      "format": "assembly",
      "variants": [
        "m2.4.clear-bit3",
        "m2.4.toggle-bit2",
        "m2.4.merge-nibbles",
        "m2.4.swap-nibbles"
      ]
    },
    {
      "id": "cslez2_4_03_random_assembly_03",
      "title": "XOR, inversioni e scorrimenti",
      "format": "assembly",
      "variants": [
        "m2.4.xor-mask",
        "m2.4.invert-byte",
        "m2.4.logical-shift",
        "m2.4.left-shift-mask"
      ]
    },
    {
      "id": "cslez2_4_04_random_assembly_04",
      "title": "Estrarre, inserire e verificare campi",
      "format": "assembly",
      "variants": [
        "m2.4.field-extract",
        "m2.4.field-insert",
        "m2.4.test-any",
        "m2.4.test-all"
      ]
    },
    {
      "id": "cslez2_4_05_random_assembly_05",
      "title": "Allineamento, potenze di due e flag",
      "format": "assembly",
      "variants": [
        "m2.4.power-two",
        "m2.4.align-down",
        "m2.4.round-up16",
        "m2.4.compose-flags"
      ]
    }
  ]
});
