'use strict';
/* Il record di telemetria «TLM1», usato dalle unità del capitolo 1.7.
   Campi, nell'ordine: firma (4 byte ASCII), lunghezza del nome (1 byte), nome (ASCII),
   temperatura (2 byte, intero con segno, little-endian, in decimi di grado),
   tensione (4 byte, virgola mobile a 32 bit, little-endian, in volt). */
SL.tlm = {
  esa: (v) => v.toString(16).toUpperCase().padStart(2, '0'),
  // Codifica una misura nei byte del record.
  codifica(nome, decimi, volt) {
    const b = [0x54, 0x4C, 0x4D, 0x31, nome.length];
    for (let i = 0; i < nome.length; i++) b.push(nome.charCodeAt(i));
    const t = (decimi + 65536) % 65536;
    b.push(t & 255, t >> 8);
    const d = new DataView(new ArrayBuffer(4));
    d.setFloat32(0, volt, true);
    for (let i = 0; i < 4; i++) b.push(d.getUint8(i));
    return b;
  },
  // I cinque campi di un record il cui nome è lungo n byte.
  campi(n) {
    return [
      { id: 'firma', nome: 'firma', da: 0, larghezza: 4, regola: 'quattro caratteri ASCII' },
      { id: 'lung', nome: 'lunghezza del nome', da: 4, larghezza: 1, regola: 'intero senza segno' },
      { id: 'nome', nome: 'nome', da: 5, larghezza: n, regola: 'caratteri ASCII' },
      { id: 'temp', nome: 'temperatura', da: 5 + n, larghezza: 2, regola: 'intero con segno, little-endian, decimi di grado' },
      { id: 'tens', nome: 'tensione', da: 7 + n, larghezza: 4, regola: 'virgola mobile a 32 bit, little-endian, volt' }
    ];
  },
  // Rilegge una tensione dai suoi quattro byte.
  tensione(b4) {
    const d = new DataView(new ArrayBuffer(4));
    b4.forEach((v, i) => d.setUint8(i, v));
    return d.getFloat32(0, true);
  },
  // Rilegge una temperatura, in decimi di grado, dai suoi due byte.
  temperatura(b2) {
    const v = b2[0] + 256 * b2[1];
    return v >= 32768 ? v - 65536 : v;
  },
  // Scrive un numero di decimi come gradi, con la virgola e il segno meno tipografico.
  gradi: (decimi) => (decimi < 0 ? '−' : '') + Math.floor(Math.abs(decimi) / 10) + ',' + (Math.abs(decimi) % 10),
  // Scrive un numero con la virgola al posto del punto.
  virgola: (v) => String(v).replace('-', '−').replace('.', ','),
  /* Una striscia di byte sul palco: una cella per byte, con il numero del posto scritto sopra.
     o.tot: posti da disegnare (quelli oltre i byte presenti restano spenti); o.cur: cursore;
     o.att e o.err: intervalli [da, a) da mettere in evidenza. */
  striscia(pre, b, o) {
    const x = o.x == null ? 40 : o.x, passo = o.passo || 50, tot = o.tot || b.length, els = [];
    const dentro = (r, k) => !!r && k >= r[0] && k < r[1];
    for (let k = 0; k < tot; k++) {
      const presente = k < b.length;
      const st = dentro(o.err, k) ? 'err' : dentro(o.att, k) ? 'att' : !presente ? 'off' : k < (o.cur || 0) ? 'on' : '';
      els.push(SL.el.cella(pre + k, x + k * passo, o.y, 44, 50, presente ? SL.tlm.esa(b[k]) : '·', st, { cls: 'minuta', so: String(k) }));
    }
    return els;
  },
  // I nomi dei campi sotto la striscia: quello in esame è acceso, quelli già letti restano in ciano.
  nomi(pre, n, o) {
    const x = o.x == null ? 40 : o.x, passo = o.passo || 50;
    return SL.tlm.campi(n).map((c) => SL.el.nota(pre + c.id, x + c.da * passo, o.y, c.id === 'lung' ? 'lung.' : c.id === 'temp' ? 'temp.' : c.nome, 'mono', o.campo === c.id ? 'att' : c.da < (o.cur || 0) ? 'on' : ''));
  }
};
