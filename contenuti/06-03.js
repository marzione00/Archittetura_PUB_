'use strict';
SL.catalogo.push({
  "id": "6.3",
  "title": "Traduzione degli indirizzi in codice",
  "units": [
    {
      "id": "6.3.1",
      "title": "Rappresentare una mappatura in un programma",
      "experiment": "Con pagine da 1 KiB, segui la traduzione di 0xC33. Nella vista dei campi individua la VPN, poi confronta l’indirizzo della voce letta con l’indirizzo finale del dato.",
      "skill": "Individuare indice e posizione nella pagina",
      "check": "La VPN sceglie la riga, il suo contenuto fornisce il frame e l’offset individua il byte al suo interno. L’indirizzo della voce e quello del dato si calcolano su basi diverse."
    },
    {
      "id": "6.3.2",
      "title": "Formato e validità delle voci",
      "experiment": "Scegli la voce grezza 1 con il caso «Frame zero». Confronta i formati «PFN e bit valido» e «PFN diretto» a parità di indirizzo virtuale.",
      "skill": "Separare validità e numero di frame",
      "check": "Nel formato codificato il bit zero segnala validità e gli altri bit indicano il frame. Nel formato diretto il numero di frame occupa l’intera voce."
    },
    {
      "id": "6.3.3",
      "title": "Implementare il calcolo dell’indirizzo",
      "experiment": "Parti dal caso iniziale. Avanza di un’istruzione alla volta e individua il caricamento da memoria, il test di validità e la composizione del risultato. Ripeti con «Voce invalida».",
      "skill": "Ricomporre base fisica e offset",
      "check": "Il test del bit zero sceglie il ramo. Nella traduzione riuscita RAX contiene base del frame più offset. Nel ramo di errore contiene la sentinella a 64 bit."
    },
    {
      "id": "6.3.4",
      "title": "Valori di errore, limiti e funzioni eseguibili",
      "experiment": "Seleziona «Lettura su due pagine» e segui i due tratti di memoria. Poi prova «Indice fuori tabella» e individua dove si arresta la routine.",
      "skill": "Controllare l’indice prima del caricamento",
      "check": "Una lettura a cavallo del confine richiede una traduzione per ciascuna pagina. Se la VPN è fuori intervallo, il controllo ferma la routine prima di leggere la voce."
    },
    {
      "id": "6.3.5",
      "title": "Esercizi",
      "experiment": "Scegli «Una mappatura valida nel frame zero». Calcola i campi della traccia, inserisci il frammento e usa «Esegui la traccia» per verificare i registri. Confronta i risultati dei diversi rami.",
      "skill": "Risolvere una traduzione completa",
      "check": "La verifica distingue un frame valido di numero zero da una voce invalida. Il codice deve inoltre conservare i due registri d’ingresso.",
      "kind": "esercizi"
    },
    {
      "id": "6.3.6",
      "title": "Soluzioni",
      "experiment": "Apri «La larghezza della sentinella». Segui il ramo di errore fino alla scrittura in RAX, poi confronta il risultato con quello della scrittura ipotetica in EAX.",
      "skill": "Verificare i passaggi di un walker",
      "check": "La scelta tra EAX e RAX cambia i 32 bit superiori del risultato. Il confronto a 64 bit rende visibile la differenza.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez6_3_01_vpn_offset",
      "title": "VPN e offset",
      "format": "sequenza",
      "variants": [
        "m6v-75de14c9cb",
        "m6v-8bf57c86c0",
        "m6v-3af8fe3987",
        "m6v-00c241c818"
      ]
    },
    {
      "id": "cslez6_3_02_compose_pa_assembly",
      "title": "Composizione dell’indirizzo fisico in assembly",
      "format": "assembly",
      "variants": [
        "m6v-2b6e09b986",
        "m6v-46042720ee",
        "m6v-fca045b5cb",
        "m6v-2d9461349d"
      ]
    },
    {
      "id": "cslez6_3_03_page_table_lookup_assembly",
      "title": "Lettura di una voce della tabella in assembly",
      "format": "assembly",
      "variants": [
        "m6v-84e4b1f79e",
        "m6v-1e9a17a993",
        "m6v-dece1c3899",
        "m6v-3f1c5344ce"
      ]
    },
    {
      "id": "cslez6_3_04_page_table_control",
      "title": "Controllo della traduzione",
      "format": "intero / scelta multipla",
      "variants": [
        "m6v-832c951b47",
        "m6v-9c6356190e",
        "m6v-41aadb8b79",
        "m6v-e971a8594f"
      ]
    },
    {
      "id": "cslez6_3_05_address_translation_assembly",
      "title": "Traduzione completa in assembly",
      "format": "assembly",
      "variants": [
        "m6v-e1045dbdc3",
        "m6v-33d814fa5c",
        "m6v-3f19732ed0",
        "m6v-4a02f8c4a3"
      ]
    }
  ]
});
