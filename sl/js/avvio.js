'use strict';
/* Avvio: collega i percorsi, disegna la prima vista e presenta la sequenza iniziale.
   La sequenza compare a ogni apertura della pagina, dura pochi secondi e si interrompe con un tasto o un clic.
   Non compare quando il sistema chiede di ridurre il movimento, né sotto il controllo di uno strumento automatico.
   Nulla viene memorizzato: il sito non sa se la sequenza è già stata vista. */
(() => {
  const DURATA = 4200;
  const sequenza = () => {
    if (navigator.webdriver) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let capitoli = 0, unita = 0, prove = 0;
    SL.corso.forEach((m) => m.capitoli.forEach((c) => { capitoli++; unita += c.unita && c.unita.length ? c.unita.length : 1; if (c.prova) prove++; }));
    const righe = [
      ['rete del corso', SL.corso.length + ' moduli · ' + capitoli + ' capitoli · ' + unita + ' unità'],
      ['laboratori', 'esperimenti eseguibili un passo alla volta'],
      ['prove di capitolo', prove + ' prove · 999 varianti ciascuna'],
      ['glossario', Object.keys(SL.glossario).length + ' termini'],
      ['dati conservati', 'nessuno · ogni visita riparte da zero']
    ];
    const velo = document.createElement('div');
    velo.id = 'avvio';
    velo.setAttribute('role', 'dialog');
    velo.setAttribute('aria-modal', 'true');
    velo.setAttribute('aria-label', 'Sequenza di avvio di SistemiLab');
    velo.tabIndex = -1;
    velo.style.setProperty('--durata', DURATA + 'ms');
    velo.innerHTML = '<div class="quadro">' +
      '<div class="capo">' + SL.sim('cpu', 72) + '<div><div class="occhiello">Sequenza di avvio</div><div class="nome">Sistemi<b>Lab</b></div><div class="sotto">Laboratorio interattivo di architettura dei sistemi</div></div></div>' +
      '<div class="righe" aria-hidden="true">' + righe.map((r, k) => '<span style="animation-delay:' + (350 + k * 520) + 'ms"><b>[ ok ]</b><em>' + SL.E(r[0]) + '</em><i>' + SL.E(r[1]) + '</i></span>').join('') +
      '<span class="invito" style="animation-delay:' + (350 + righe.length * 520) + 'ms"><b>&gt;</b><em>accesso alla rete del corso</em><u></u></span></div>' +
      '<p class="lettura">SistemiLab: ' + unita + ' unità con esperimento, ' + prove + ' prove di fine capitolo, glossario di ' + Object.keys(SL.glossario).length + ' termini. Il sito non conserva alcun dato.</p>' +
      '<div class="corsa"><i></i></div>' +
      '<div class="riga-bottoni"><button type="button" class="bottone primo" data-avvio="entra">Accesso al sito</button><a class="bottone" href="#/guida" data-avvio="guida">Guida all’uso</a><span class="nota">Un tasto o un clic interrompe la sequenza.</span></div></div>';
    document.body.appendChild(velo);
    let chiuso = false, attesa = null;
    const chiudi = () => {
      if (chiuso) return;
      chiuso = true;
      clearTimeout(attesa);
      document.removeEventListener('keydown', tasto, true);
      velo.classList.add('esce');
      setTimeout(() => velo.remove(), 480);
      const main = document.getElementById('contenuto');
      if (main) main.focus({ preventScroll: true });
    };
    // Il tasto di tabulazione sospende la chiusura automatica, per lasciare il tempo di scegliere fra i due comandi.
    const tasto = (ev) => {
      if (ev.key === 'Tab') { clearTimeout(attesa); return; }
      if (ev.key === 'Shift' || ev.key === 'Control' || ev.key === 'Alt' || ev.key === 'Meta') return;
      if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.closest && ev.target.closest('[data-avvio]')) return;
      ev.preventDefault();
      chiudi();
    };
    document.addEventListener('keydown', tasto, true);
    velo.addEventListener('click', chiudi);
    attesa = setTimeout(chiudi, DURATA + 500);
    velo.focus({ preventScroll: true });
  };
  window.addEventListener('hashchange', () => SL.mostra());
  SL.mostra();
  sequenza();
})();
