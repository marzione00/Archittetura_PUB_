'use strict';
/* Avvio: collega i percorsi, disegna la prima vista e apre l'introduzione (sl/js/intro.js).
   L'introduzione compare a ogni apertura della pagina principale; chi apre direttamente un modulo, un capitolo
   o un'unità giunge al contenuto senza introduzione. Sotto il controllo di uno strumento automatico non compare,
   così che le verifiche trovino la pagina libera. Nulla è memorizzato: il sito non sa se l'introduzione è già stata letta. */
(() => {
  window.addEventListener('hashchange', () => SL.mostra());
  SL.mostra();
  if (!navigator.webdriver && SL.percorso().vista === 'rete') SL.intro.apri();
})();
