/* SistemiLab · sfondo «alveare»
   Reticolo esagonale percorso da onde di attivazione, disegnato su una tela fissa dietro i contenuti.
   È attivo soltanto alle larghezze da scrivania. Non conserva dati e non effettua richieste di rete.
   Con la preferenza di sistema per il movimento ridotto, e durante le verifiche automatiche, mostra un fotogramma fermo. */
(() => {
  'use strict';
  const LARGHEZZA_MINIMA = 900;  // pixel: al di sotto lo sfondo è assente (la stessa soglia compare in sito.css)
  const FORZA = 1;               // intensità del disegno: 0.6 tenue, 1 media, 1.6 marcata
  const PERIODO = 3.4;           // secondi fra due onde successive
  const PASSO_MS = 40;           // intervallo minimo fra due fotogrammi
  const AMB = '242,182,72', CIA = '90,209,230';

  if (!window.matchMedia || !window.requestAnimationFrame) return;
  const tela = document.createElement('canvas');
  const c = tela.getContext && tela.getContext('2d');
  if (!c) return;
  tela.id = 'sfondo'; tela.setAttribute('aria-hidden', 'true');
  const velo = document.createElement('div');
  velo.id = 'sfondo-velo'; velo.setAttribute('aria-hidden', 'true');

  const largo = window.matchMedia('(min-width: ' + LARGHEZZA_MINIMA + 'px)');
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fermo = () => navigator.webdriver === true || quieto.matches;
  const ascolta = (m, f) => { if (m.addEventListener) m.addEventListener('change', f); else if (m.addListener) m.addListener(f); };

  let W = 0, H = 0, raggio = 30, celle = [], montato = false, giro = 0, ultimo = 0, attesa = 0;
  let tempo = fermo() ? 7.3 : 7.3 + (Date.now() % 100000) / 1000;

  const col = (rgb, a) => 'rgba(' + rgb + ',' + Math.max(0, Math.min(1, a * FORZA)).toFixed(3) + ')';
  const caso = (seme) => { let s = (seme * 2654435761) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
  const h2 = (a, b) => { let x = (a * 73856093) ^ (b * 19349663); x = (x ^ (x >>> 13)) * 1274126177; return ((x ^ (x >>> 16)) >>> 0); };
  const esagono = (x, y, k) => { for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i; c[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * k, y + Math.sin(a) * k); } c.closePath(); };

  // Le celle sono fissate dalla misura della finestra; una su tredici, scelta in modo deterministico, è un nodo.
  const prepara = () => {
    celle = []; const hh = raggio * Math.sqrt(3);
    for (let q = -1; q * raggio * 1.5 < W + raggio; q++) for (let s = -1; s * hh < H + hh; s++) celle.push({ x: q * raggio * 1.5, y: s * hh + (q & 1 ? hh / 2 : 0), nodo: h2(q + 50, s + 50) % 13 === 0, b: 0, rgb: AMB });
  };

  const disegna = () => {
    // Tre onde al più: ciascuna nasce in un punto, si allarga a 150 px al secondo e si attenua.
    const onde = [], n0 = Math.floor(tempo / PERIODO);
    for (let m = n0 - 2; m <= n0; m++) { const R = caso(m + 500); onde.push({ x: R() * W, y: R() * H, eta: tempo - m * PERIODO, rgb: (m % 3 + 3) % 3 === 0 ? CIA : AMB }); }
    const vive = [];
    celle.forEach((e) => {
      let b = 0, rgb = AMB;
      onde.forEach((o) => { if (o.eta < 0) return; const d = Math.hypot(e.x - o.x, e.y - o.y), v = Math.exp(-Math.pow((d - o.eta * 150) / 34, 2)) * Math.exp(-o.eta / 3.2); if (v > b) { b = v; rgb = o.rgb; } });
      e.b = b; e.rgb = rgb; if (b > .004) vive.push(e);
    });
    c.lineWidth = 1;
    // Celle a riposo: un solo tracciato per i contorni e uno per i nodi.
    c.beginPath(); celle.forEach((e) => { if (e.b <= .004) esagono(e.x, e.y, raggio - 2); }); c.strokeStyle = col(AMB, .06); c.stroke();
    c.beginPath(); celle.forEach((e) => { if (e.nodo && e.b <= .004) esagono(e.x, e.y, raggio * .42); }); c.strokeStyle = col(AMB, .2); c.stroke();
    c.fillStyle = col(AMB, .1); celle.forEach((e) => { if (e.nodo && e.b <= .004) c.fillRect(e.x - 2, e.y - 2, 4, 4); });
    // Celle raggiunte da un'onda.
    vive.forEach((e) => {
      const acceso = e.b > .03, tinta = acceso ? e.rgb : AMB;
      c.beginPath(); esagono(e.x, e.y, raggio - 2);
      if (acceso) { c.fillStyle = col(e.rgb, e.b * .2); c.fill(); }
      c.strokeStyle = col(tinta, .06 + e.b * .55); c.stroke();
      if (e.nodo) { c.beginPath(); esagono(e.x, e.y, raggio * .42); c.strokeStyle = col(tinta, .2 + e.b * .7); c.stroke(); c.fillStyle = col(tinta, .1 + e.b * .5); c.fillRect(e.x - 2, e.y - 2, 4, 4); }
    });
  };

  const quadro = () => { const d = Math.min(1.5, window.devicePixelRatio || 1); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, tela.width, tela.height); c.setTransform(d, 0, 0, d, 0, 0); disegna(); };
  const misura = () => { const d = Math.min(1.5, window.devicePixelRatio || 1); W = window.innerWidth; H = window.innerHeight; tela.width = Math.round(W * d); tela.height = Math.round(H * d); prepara(); quadro(); };
  const passo = (ora) => { giro = requestAnimationFrame(passo); if (ora - ultimo < PASSO_MS) return; tempo += Math.min(.1, (ora - ultimo) / 1000); ultimo = ora; quadro(); };
  const arresta = () => { if (giro) cancelAnimationFrame(giro); giro = 0; };
  const avvia = () => { if (giro || !montato || !largo.matches || document.hidden || fermo()) return; ultimo = performance.now(); giro = requestAnimationFrame(passo); };
  const aggiorna = () => {
    if (!largo.matches) { arresta(); return; }
    if (!montato) { document.body.insertBefore(velo, document.body.firstChild); document.body.insertBefore(tela, velo); montato = true; }
    misura(); avvia();
  };

  ascolta(largo, aggiorna);
  ascolta(quieto, () => { arresta(); if (montato && largo.matches) quadro(); avvia(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) arresta(); else avvia(); });
  window.addEventListener('resize', () => { clearTimeout(attesa); attesa = setTimeout(() => { if (montato && largo.matches) misura(); }, 120); });
  if (document.body) aggiorna(); else document.addEventListener('DOMContentLoaded', aggiorna);
})();
