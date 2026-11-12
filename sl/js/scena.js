'use strict';
/* Palco dichiarativo. Ogni fotogramma è un elenco di elementi con un identificativo stabile:
   gli elementi che restano fra un passo e l'altro cambiano posizione e stato con una transizione. */
SL.scena = (ospite, misura) => {
  const W = misura.w, H = misura.h, E = SL.E;
  ospite.classList.add('scalato');
  ospite.innerHTML = '<div class="piano-fisso palco" style="width:' + W + 'px;height:' + H + 'px"><svg class="linee" width="' + W + '" height="' + H + '" aria-hidden="true"></svg></div>';
  const palco = ospite.firstElementChild, svg = palco.firstElementChild;
  const nodi = new Map(), linee = new Map();
  ospite.insertAdjacentHTML('afterend', '<p class="nota avviso-scorri">La scena è più larga dello schermo: scorrila con il dito, oppure ruota il telefono.</p>');
  const ferma = SL.scala(ospite, W, H, 0.62);

  const corpo = (e) => {
    switch (e.t) {
      case 'box': {
        const testi = (e.et != null ? '<span class="et">' + E(e.et) + '</span>' : '') + (e.txt != null ? '<span class="va">' + E(e.txt) + '</span>' : '');
        return (e.sim ? SL.sim(e.sim, e.simL || 34) : '') + (e.riga ? '<div>' + testi + '</div>' : testi);
      }
      case 'cella': return (e.so != null ? '<span class="so">' + E(e.so) + '</span>' : '') + E(e.txt == null ? '' : e.txt) + (e.gi != null ? '<span class="gi">' + E(e.gi) + '</span>' : '');
      case 'pacco': case 'nota': return E(e.txt == null ? '' : e.txt);
      case 'sim': return SL.sim(e.sim, 64);
      case 'zona': return e.et != null ? '<span class="et">' + E(e.et) + '</span>' : '';
      default: return '';
    }
  };
  const px = (v) => (v == null ? '' : v + 'px');

  function mostra(els) {
    const visti = new Set();
    for (const e of els) {
      if (!e) continue;
      visti.add(e.id);
      if (e.t === 'linea') {
        let l = linee.get(e.id);
        if (!l) { l = document.createElementNS('http://www.w3.org/2000/svg', 'line'); svg.appendChild(l); linee.set(e.id, l); }
        l.setAttribute('x1', e.x1); l.setAttribute('y1', e.y1); l.setAttribute('x2', e.x2); l.setAttribute('y2', e.y2);
        l.setAttribute('class', (e.st ? 'st-' + e.st : '') + (e.tratto ? ' tratto' : ''));
        continue;
      }
      let n = nodi.get(e.id), nuovo = false;
      if (!n) { n = document.createElement('div'); nuovo = true; nodi.set(e.id, n); }
      const classe = 'el el-' + e.t + (e.st ? ' st-' + e.st : '') + (e.cls ? ' ' + e.cls : '') + (e.riga ? ' riga' : '') + (e.piccola ? ' piccola' : '');
      n.className = classe + (nuovo ? ' entra' : '');
      n.style.left = px(e.x); n.style.top = px(e.y); n.style.width = px(e.w); n.style.height = px(e.h);
      n.style.zIndex = e.z == null ? '' : e.z;
      if (e.t === 'barra') {
        if (nuovo) n.innerHTML = '<i></i>';
        n.firstElementChild.style.width = Math.max(0, Math.min(100, Math.round((e.v || 0) * 100))) + '%';
      } else {
        const firma = corpo(e);
        if (n._firma !== firma) { n.innerHTML = firma; n._firma = firma; }
      }
      if (nuovo) { palco.appendChild(n); requestAnimationFrame(() => requestAnimationFrame(() => n.classList.remove('entra'))); }
    }
    for (const [id, n] of nodi) if (!visti.has(id)) { nodi.delete(id); n.classList.add('entra'); setTimeout(() => n.remove(), 360); }
    for (const [id, l] of linee) if (!visti.has(id)) { linee.delete(id); l.remove(); }
    // Sugli schermi stretti la scena scorre: a ogni passo si porta in vista l'elemento su cui cade l'attenzione.
    if (ospite.classList.contains('scorre')) {
      const a = els.find((e) => e && e.t !== 'linea' && e.t !== 'zona' && e.st === 'att' && e.x != null) || els.find((e) => e && e.t === 'pacco');
      if (a) { const k = palco.getBoundingClientRect().width / W; ospite.scrollTo({ left: Math.max(0, (a.x + (a.w || 60) / 2) * k - ospite.clientWidth / 2), behavior: 'smooth' }); }
    }
  }
  return { mostra, smonta: ferma };
};

/* Scrittura dei numeri grandi: gruppi di tre cifre separati da uno spazio che non va a capo. */
SL.num = (v) => (Math.abs(v) < 10000 ? String(v) : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'));

/* Piccoli costruttori di elementi, per scrivere i fotogrammi in modo leggibile. */
SL.el = {
  box: (id, x, y, w, h, et, txt, st, extra) => Object.assign({ id, t: 'box', x, y, w, h, et, txt, st }, extra),
  cella: (id, x, y, w, h, txt, st, extra) => Object.assign({ id, t: 'cella', x, y, w, h, txt, st }, extra),
  pacco: (id, x, y, txt, st, extra) => Object.assign({ id, t: 'pacco', x, y, h: 30, txt, st }, extra),
  nota: (id, x, y, txt, cls, st, extra) => Object.assign({ id, t: 'nota', x, y, txt, cls, st }, extra),
  sim: (id, x, y, lato, sim, st) => ({ id, t: 'sim', x, y, w: lato, h: lato, sim, st }),
  linea: (id, x1, y1, x2, y2, st, tratto) => ({ id, t: 'linea', x1, y1, x2, y2, st, tratto }),
  barra: (id, x, y, w, h, v) => ({ id, t: 'barra', x, y, w, h, v }),
  cursore: (id, x, y, w) => ({ id, t: 'cursore', x, y, w }),
  zona: (id, x, y, w, h, et, st) => ({ id, t: 'zona', x, y, w, h, et, st })
};
