#!/usr/bin/env node
'use strict';
/* Controlli sui contenuti del sito. Si avvia dalla radice del repository:

     node sl/strumenti/controlli.js            riepilogo, errori e avvisi
     node sl/strumenti/controlli.js --tutto    anche gli usi anticipati già accettati

   Che cosa verifica:
   1. struttura delle unità, simboli e glossario;
   2. esperimenti: per ogni combinazione dei comandi genera i passi e controlla esito, previsioni e domande;
   3. ordine dei termini: nessun termine del glossario prima dell'unità che lo introduce;
   4. costrutti da evitare nella prosa.
   5. sicurezza del codice: risorse esterne, codice costruito da stringhe, archivi e rete, gestori in linea, politica dei contenuti.
   Non ha dipendenze oltre a Node. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const radice = path.resolve(__dirname, '..', '..');
const leggi = (f) => fs.readFileSync(path.join(radice, f), 'utf8');
const TUTTO = process.argv.includes('--tutto');

const SL = { viste: {}, unita: {}, registra: (id, def) => { SL.unita[id] = def; } };
const ambiente = vm.createContext({ SL, console });
const carica = (f) => vm.runInContext(leggi(f), ambiente, { filename: f });
['sl/js/scena.js', 'sl/dati/corso.js', 'sl/dati/glossario.js', 'sl/dati/telemetria.js', 'sl/dati/macchina.js'].forEach(carica);
const SIMBOLI = new Set((leggi('sl/js/simboli.js').match(/id=\\?"sl-[a-z0-9-]+/g) || []).map((s) => s.replace(/^.*sl-/, '')));
const ORDINE = SL.unitaNuove.map((u) => u.id);
fs.readdirSync(path.join(radice, 'sl/unita')).filter((f) => f.endsWith('.js')).sort().forEach((f) => carica('sl/unita/' + f));
carica('sl/js/prova.js');
if (fs.existsSync(path.join(radice, 'sl/prove'))) fs.readdirSync(path.join(radice, 'sl/prove')).filter((f) => f.endsWith('.js')).sort().forEach((f) => carica('sl/prove/' + f));

const errori = [], avvisi = [], note = [];
// Lo stesso difetto ripetuto su molti casi dello stesso esperimento viene riportato una volta sola, con il conteggio.
const contati = new Map();
const err = (dove, msg) => {
  const chiave = dove + ' · ' + msg.replace(/^(esperimento|previsione|confronto) \{[^}]*\}(, passo \d+)?/, '$1');
  if (contati.has(chiave)) { contati.get(chiave).n++; return; }
  const voce = { n: 1, testo: dove + ' · ' + msg }; contati.set(chiave, voce); errori.push(voce);
};
const avv = (dove, msg) => avvisi.push(dove + ' · ' + msg);

/* ---------- raccolta dei testi ---------- */
// Ogni testo raccolto ha una provenienza e un genere: 'prosa' (testo continuo), 'domanda', 'breve' (etichette).
const testi = {};
const metti = (id, genere, dove, s) => { if (typeof s === 'string' && s.trim()) (testi[id] = testi[id] || []).push({ genere, dove, s }); };
const simboliUsati = (id, dove, s) => { if (s && !SIMBOLI.has(s)) err(id, dove + ': simbolo sconosciuto «' + s + '»'); };

const daElementi = (id, dove, els) => (els || []).filter(Boolean).forEach((e) => {
  ['et', 'txt', 'so', 'gi'].forEach((k) => metti(id, 'breve', dove, e[k] == null ? '' : String(e[k])));
  if (e.sim) simboliUsati(id, dove, e.sim);
});
const daEsercizio = (id, dove, x) => {
  metti(id, 'domanda', dove, x.d); metti(id, 'breve', dove, x.guida); metti(id, 'prosa', dove, x.ok); metti(id, 'prosa', dove, x.altro);
  (x.diagnosi || []).forEach((g) => metti(id, 'prosa', dove + ' diagnosi', g.msg));
  (x.indizi || []).forEach((s) => metti(id, 'prosa', dove + ' indizio', s));
  (x.svolgimento || []).forEach((s) => metti(id, 'prosa', dove + ' svolgimento', s));
  (x.o || []).forEach((o) => { metti(id, 'breve', dove + ' opzione', o.t); metti(id, 'prosa', dove + ' riscontro', o.fb); });
  if (x.o) { if (x.o.filter((o) => o.ok).length !== 1) err(id, dove + ': serve una e una sola opzione corretta'); }
  else {
    if (!x.giuste || !x.giuste.length) err(id, dove + ': mancano le risposte corrette');
    if (!x.indizi || x.indizi.length !== 3) err(id, dove + ': gli indizi devono essere tre');
    if (!x.svolgimento || !x.svolgimento.length) err(id, dove + ': manca lo svolgimento');
    (x.diagnosi || []).forEach((g) => g.se.forEach((v) => { if (x.giuste.includes(v)) err(id, dove + ': la diagnosi copre una risposta corretta (' + v + ')'); }));
  }
};

const combinazioni = (controlli) => {
  let tutte = [{}];
  (controlli || []).forEach((c) => {
    let valori;
    if (c.tipo === 'num') { valori = []; for (let v = c.min; v <= c.max; v += Math.min.apply(null, c.salti || [1])) valori.push(v); (c.pronti || []).forEach((v) => valori.includes(v) || valori.push(v)); }
    else if (c.tipo === 'scelta') valori = c.opzioni.map((o) => (Array.isArray(o) ? o[0] : o));
    else valori = [c.valore].concat(c.pronti || []);
    if (valori.length > 40) { const passo = Math.ceil(valori.length / 40); valori = valori.filter((v, i) => i % passo === 0 || v === c.max || v === c.valore); }
    tutte = tutte.flatMap((p) => valori.map((v) => Object.assign({}, p, { [c.id]: v })));
  });
  return tutte;
};

const statistiche = [];
for (const id of ORDINE) {
  const u = SL.unita[id];
  if (!u) { err(id, 'manca il file sl/unita/' + id + '.js'); continue; }
  ['titolo', 'obiettivo', 'concetti', 'richiami', 'idea', 'esperimento', 'lab', 'bilancio'].forEach((k) => { if (!u[k]) err(id, 'manca la sezione «' + k + '»'); });
  metti(id, 'breve', 'titolo', u.titolo); metti(id, 'prosa', 'obiettivo', u.obiettivo);
  (u.concetti || []).forEach((c) => { simboliUsati(id, 'concetti', c[0]); metti(id, 'breve', 'concetti', c[1]); });
  (u.filigrana || []).forEach((s) => simboliUsati(id, 'filigrana', s));
  const r = u.richiami || {};
  metti(id, 'prosa', 'richiami', r.guida);
  (r.carte || []).forEach((c) => { simboliUsati(id, 'richiami', c.sim); metti(id, 'breve', 'richiami', c.t); metti(id, 'prosa', 'richiami', c.d); });
  if (r.domanda) daEsercizio(id, 'richiami, domanda', r.domanda);
  const idea = u.idea || {};
  metti(id, 'breve', 'idea', idea.titolo);
  (idea.testo || []).forEach((t) => {
    if (typeof t === 'string') metti(id, 'prosa', 'idea', t);
    else { metti(id, 'breve', 'idea, figura', t.titolo); metti(id, 'prosa', 'idea, figura', t.nota); daElementi(id, 'idea, figura', t.els); (t.celle || []).forEach((c) => ['so', 'v', 'gi'].forEach((k) => metti(id, 'breve', 'idea, figura', c[k] == null ? '' : String(c[k])))); }
  });
  const e = u.esperimento || {};
  (e.faremo || []).forEach((t) => metti(id, 'prosa', 'esperimento', t));
  (e.vedrai || []).forEach((v) => { simboliUsati(id, 'esperimento', v[0]); metti(id, 'breve', 'esperimento', v[1]); metti(id, 'prosa', 'esperimento', v[2]); });
  const b = u.bilancio || {};
  (b.regola || []).forEach((t) => metti(id, 'prosa', 'bilancio, regola', t));
  (b.errori || []).forEach((x) => { metti(id, 'prosa', 'bilancio, errori', x[0]); metti(id, 'prosa', 'bilancio, errori', x[1]); });
  (b.saFare || []).forEach((t) => metti(id, 'prosa', 'bilancio, so fare', t));
  (b.esercizi || []).forEach((x, k) => daEsercizio(id, 'esercizio ' + (k + 1), x));
  if (!b.esercizi || b.esercizi.length < 2) err(id, 'servono almeno due esercizi');
  if (b.sfida) metti(id, 'breve', 'sfida', b.sfida[1]);

  // Esperimento: tutte le combinazioni dei comandi.
  const lab = u.lab;
  if (!lab) continue;
  metti(id, 'breve', 'esperimento', lab.titolo); metti(id, 'prosa', 'esperimento', lab.nota);
  (lab.atti || []).forEach((a) => metti(id, 'breve', 'esperimento, atti', a));
  (lab.controlli || []).forEach((c) => { metti(id, 'breve', 'comandi', c.eti); if (c.tipo === 'scelta') c.opzioni.forEach((o) => metti(id, 'breve', 'comandi', String(Array.isArray(o) ? o[1] : o))); });
  const casi = combinazioni(lab.controlli);
  let min = Infinity, max = 0, domande = 0;
  const visti = new Set();
  const unaVolta = (genere, dove, s) => { if (typeof s === 'string' && !visti.has(s)) { visti.add(s); metti(id, genere, dove, s); } };
  for (const p of casi) {
    const caso = JSON.stringify(p);
    let c;
    try { c = lab.costruisci(Object.assign({}, p)); } catch (x) { err(id, 'esperimento ' + caso + ': ' + x.message); continue; }
    const n = c.passi.length; min = Math.min(min, n); max = Math.max(max, n);
    const atti = c.atti || lab.atti || [];
    (c.atti || []).forEach((a) => unaVolta('breve', 'esperimento, atti', a));
    c.passi.forEach((s, k) => {
      const dove = 'esperimento ' + caso + ', passo ' + (k + 1);
      if (!s.titolo || !s.testo) err(id, dove + ': mancano titolo o testo');
      if (atti[s.atto || 0] == null) err(id, dove + ': atto ' + s.atto + ' senza nome');
      if (k && (s.atto || 0) < (c.passi[k - 1].atto || 0)) err(id, dove + ': gli atti tornano indietro');
      // Linee ed elementi vivono in due registri distinti: la ripetizione conta soltanto all'interno di ciascuno.
      [(x) => x.t === 'linea', (x) => x.t !== 'linea'].forEach((quale) => {
        const ids = (s.els || []).filter(Boolean).filter(quale).map((x) => x.id);
        if (new Set(ids).size !== ids.length) err(id, dove + ': identificativi ripetuti sulla scena (' + ids.filter((x, i) => ids.indexOf(x) !== i).join(', ') + ')');
      });
      (s.els || []).filter(Boolean).forEach((x) => { if (x.sim) simboliUsati(id, dove, x.sim); ['et', 'txt'].forEach((q) => unaVolta('breve', 'esperimento, scena', x[q] == null ? null : String(x[q]))); });
      unaVolta('breve', 'esperimento, titoli', s.titolo); unaVolta('prosa', 'esperimento, racconto', s.testo); unaVolta('breve', 'esperimento, calcolo', s.calc);
      if (s.esito) unaVolta('prosa', 'esperimento, esito', s.esito[0]);
      (s.hud || []).forEach((h) => unaVolta('breve', 'esperimento, cruscotto', String(h[0])));
      if (s.chiedi) {
        domande++;
        const q = s.chiedi;
        if (!(q.g >= 0 && q.g < q.o.length)) err(id, dove + ': risposta guidata fuori elenco');
        if (!q.no) err(id, dove + ': manca la spiegazione per la risposta sbagliata');
        if (new Set(q.o.map(String)).size !== q.o.length) err(id, dove + ': opzioni ripetute nella domanda guidata');
        unaVolta('domanda', 'esperimento, domanda guidata', q.d); q.o.forEach((o) => unaVolta('breve', 'esperimento, domanda guidata', String(o))); unaVolta('prosa', 'esperimento, domanda guidata', q.no);
      }
    });
    if (lab.previsione) {
      const opz = lab.previsione.opzioni(p).map((o) => (Array.isArray(o) ? o : [o, String(o)]));
      unaVolta('domanda', 'previsione', lab.previsione.domanda(p));
      opz.forEach((o) => unaVolta('breve', 'previsione', String(o[1])));
      if (opz.length < 2) err(id, 'previsione ' + caso + ': meno di due opzioni');
      if (new Set(opz.map((o) => String(o[0]))).size !== opz.length) err(id, 'previsione ' + caso + ': opzioni ripetute');
      if (!opz.some((o) => o[0] === c.esito)) err(id, 'previsione ' + caso + ': l’esito ' + JSON.stringify(c.esito) + ' non è fra le opzioni');
      if (lab.confronto) opz.forEach((o) => { const t = lab.confronto(o[0], c.esito, p); if (typeof t !== 'string' || /undefined|\[object /.test(t) || (/NaN/.test(t) && !(u.idea.termini || []).includes('nan') && !JSON.stringify(u.idea.testo).includes('[[nan'))) err(id, 'confronto ' + caso + ': testo non valido'); unaVolta('prosa', 'confronto', t); });
    }
  }
  statistiche.push([id, casi.length, min, max, domande ? 'sì' : 'no']);
}
Object.keys(SL.unita).forEach((id) => { if (!ORDINE.includes(id)) err(id, 'unità presente fra i file ma assente da sl/dati/corso.js'); });

/* ---------- prove di fine capitolo ---------- */
// Ogni prova viene composta in tutte le 999 varianti: struttura delle domande, risposte, testi.
const VARIANTI = 999, statProve = [];
const capitoli = SL.corso.flatMap((m) => m.capitoli);
Object.keys(SL.prove).forEach((cap) => { const c = capitoli.find((x) => x.id === cap); if (!c || !c.prova) err('prova ' + cap, 'la prova esiste ma il capitolo non la dichiara in sl/dati/corso.js'); });
for (const c of capitoli.filter((x) => x.prova)) {
  const id = 'prova ' + c.id, def = SL.prove[c.id];
  if (!def) { err(id, 'manca il file sl/prove/' + c.id + '.js'); continue; }
  const visti = new Set(), unaVolta = (genere, dove, s) => { if (typeof s === 'string' && !visti.has(s)) { visti.add(s); metti(id, genere, dove, s); } };
  const unitaCap = (c.unita || []).map((u) => u.id), coperte = new Set(), distinte = def.domande.map(() => new Set());
  const normaR = (x) => String(x == null ? '' : x).trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
  for (let v = 1; v <= VARIANTI; v++) {
    let domande;
    try { domande = SL.componiProva(c.id, v); } catch (e) { err(id, 'variante ' + v + ': ' + e.message); continue; }
    domande.forEach((q, k) => {
      const dove = 'domanda ' + (k + 1);
      distinte[k].add(q.d + '|' + (q.o ? q.o.map((o) => o.t).sort().join('/') : ''));
      if (!unitaCap.includes(q.u)) err(id, dove + ': l’unità indicata (' + q.u + ') non appartiene al capitolo'); else coperte.add(q.u);
      const tutti = [q.d, q.ok, q.altro, q.guida].concat(q.indizi || [], q.svolgimento || [], (q.diagnosi || []).map((g) => g.msg), (q.o || []).flatMap((o) => [o.t, o.fb]), q.giuste || []);
      tutti.forEach((t) => { if (t != null && (typeof t !== 'string' || /undefined|\[object |\bnull\b|Infinity/.test(t) || (/NaN/.test(t) && !/^1\.(6\.2|7\.7)$/.test(q.u)))) err(id, dove + ', variante ' + v + ': testo non valido «' + String(t).slice(0, 60) + '»'); });
      unaVolta('domanda', dove, q.d);
      if (q.o) {
        if (q.o.filter((o) => o.ok).length !== 1) err(id, dove + ', variante ' + v + ': serve una e una sola opzione corretta');
        if (q.o.length < 3) err(id, dove + ': servono almeno tre opzioni');
        if (new Set(q.o.map((o) => o.t)).size !== q.o.length) err(id, dove + ', variante ' + v + ': opzioni ripetute');
        q.o.forEach((o) => { unaVolta('breve', dove + ' opzione', o.t); unaVolta('prosa', dove + ' riscontro', o.fb); if (typeof o.fb !== 'string' || !o.fb) err(id, dove + ': opzione senza commento'); });
      } else {
        if (!q.giuste || !q.giuste.length) err(id, dove + ', variante ' + v + ': mancano le risposte corrette');
        if (!q.indizi || q.indizi.length !== 3) err(id, dove + ': gli indizi devono essere tre');
        if (!q.svolgimento || !q.svolgimento.length) err(id, dove + ': manca lo svolgimento');
        if (typeof q.ok !== 'string' || typeof q.altro !== 'string' || !q.segnaposto) err(id, dove + ': mancano commento, risposta generica o segnaposto');
        const giuste = new Set(q.giuste.map(normaR));
        (q.diagnosi || []).forEach((g) => g.se.forEach((x) => { if (giuste.has(normaR(x))) err(id, dove + ', variante ' + v + ': la diagnosi copre una risposta corretta (' + x + ')'); }));
        unaVolta('prosa', dove, q.ok); unaVolta('prosa', dove, q.altro); unaVolta('breve', dove, q.segnaposto);
        (q.diagnosi || []).forEach((g) => unaVolta('prosa', dove + ' diagnosi', g.msg));
        q.indizi.forEach((t) => unaVolta('prosa', dove + ' indizio', t));
        q.svolgimento.forEach((t) => unaVolta('prosa', dove + ' svolgimento', t));
      }
    });
  }
  unitaCap.forEach((u) => { if (!coperte.has(u)) err(id, 'nessuna domanda riguarda l’unità ' + u); });
  statProve.push([c.id, def.domande.length, Math.min.apply(null, distinte.map((x) => x.size)), distinte.reduce((a, x) => a + x.size, 0)]);
}

// Testi della mappa del corso.
SL.corso.forEach((m) => { metti('corso', 'breve', 'modulo ' + m.r, m.nome); simboliUsati('corso', 'modulo ' + m.r, m.sim); m.capitoli.forEach((c) => {
  simboliUsati('corso', c.id, c.sim); metti('corso', 'breve', c.id, c.titolo); metti('corso', 'prosa', c.id, c.scopo); metti('corso', 'prosa', c.id, c.guida);
  (c.unita || []).forEach((x) => { simboliUsati('corso', x.id, x.sim); metti('corso', 'prosa', x.id, x.scopo); if (SL.unita[x.id] && SL.unita[x.id].titolo !== x.titolo) err('corso', x.id + ': titolo diverso da quello dell’unità'); });
  if (c.diretta && SL.unita[c.id] && SL.unita[c.id].titolo !== c.titolo) err('corso', c.id + ': titolo diverso da quello dell’unità');
}); });

/* ---------- glossario ---------- */
const G = SL.glossario;
const RIMANDO = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
for (const id of Object.keys(testi)) for (const t of testi[id]) { let m; RIMANDO.lastIndex = 0; while ((m = RIMANDO.exec(t.s))) if (!G[m[1]]) err(id, t.dove + ': rimando a un termine assente dal glossario «' + m[1] + '»'); }
for (const k of Object.keys(G)) {
  const v = G[k];
  metti('glossario', 'breve', k, v.t); metti('glossario', 'prosa', k, v.d); simboliUsati('glossario', k, v.s);
  const u = SL.unita[v.u];
  if (!u) { err('glossario', k + ': l’unità ' + v.u + ' non esiste'); continue; }
  if (!(u.idea.termini || []).includes(k)) err('glossario', k + ': l’unità ' + v.u + ' non lo dichiara fra i termini introdotti');
}
for (const id of ORDINE) {
  const u = SL.unita[id]; if (!u) continue;
  const prosaIdea = (u.idea.testo || []).filter((t) => typeof t === 'string').join(' ');
  (u.idea.termini || []).forEach((k) => {
    if (!G[k]) err(id, 'termine dichiarato ma assente dal glossario: «' + k + '»');
    else if (G[k].u !== id) err(id, 'il glossario assegna «' + k + '» all’unità ' + G[k].u);
    if (!new RegExp('\\[\\[' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\||\\]\\])').test(prosaIdea)) err(id, 'il termine «' + k + '» non è evidenziato nel testo dell’idea');
  });
}

/* ---------- ordine dei termini ---------- */
// Usi anticipati accettati: la parola compare prima dell'unità che la introduce, ma con il significato comune
// oppure con un altro significato spiegato sul posto. Chiave: termine; valore: motivo.
const ACCETTATI = {
  'cifra': 'parola comune («numeri di una cifra») prima che l’unità 0.3 ne parli in modo esplicito',
  'passo': 'parola comune («un passo alla volta») prima che l’unità 0.4 ne fissi l’uso per gli esperimenti',
  'esperimento': 'nome della terza fase, presente nell’interfaccia di ogni unità',
  'previsione': 'nome del riquadro della terza fase, presente nell’interfaccia di ogni unità',
  'esecuzione': 'nome della quarta fase, presente nell’interfaccia di ogni unità',
  'tipo': 'parola comune («il tipo di errore») prima dell’unità 1.2.4',
  'base': 'nell’unità 1.1.2 indica l’indirizzo di partenza, definito sul posto; la base di numerazione arriva nell’unità 1.2.2',
  'codice': 'nelle unità successive alla 1.1.1 compare anche in «codice macchina» e «codice di uscita», definiti sul posto',
  'terminale': 'prima dell’unità 1.1.6 è soltanto il nome di un simbolo',
  'canale': 'nel capitolo 1.1 indica il canale di uscita di un programma, spiegato sul posto; il canale di un dato arriva nell’unità 1.3.1',
  'larghezza': 'nell’unità 1.3.1 è la larghezza di un’immagine in pixel, nel senso comune; la larghezza di un campo arriva nell’unità 1.3.4',
  'cursore': 'nell’unità 1.2.2 è il segnaposto che scorre sui pesi, descritto sul posto; il cursore di lettura arriva nell’unità 1.3.4',
  'immediato': 'nell’unità 0.1 è l’aggettivo comune («così breve da sembrare immediato»); l’immediato di un’istruzione arriva nell’unità 2.1.1',
  'operando': 'nelle unità 1.4.3 e 1.5.6 indica i valori su cui lavora un operatore del C, nel senso comune dell’aritmetica; l’operando di un’istruzione arriva nell’unità 2.1.2',
  'indice': 'nel capitolo 2.2 è uno dei termini dell’espressione base + indice × scala + spiazzamento, presentata sul posto; l’indice di un elemento di un array arriva nell’unità 2.3.2',
  'struttura': 'nelle unità 1.1.4 e 1.7.7 è la parola comune («struttura ad albero», «controlli di struttura»); la struttura del C arriva nell’unità 2.3.4',
  'pila': 'nell’unità 2.5.4 è nominata fra le zone dell’immagine di un processo, come zona di lavoro; il suo funzionamento arriva nell’unità 2.6.1',
  'rsp': 'nell’unità 2.1.2 compare soltanto nell’elenco dei nomi dei registri generali; il suo ruolo arriva nell’unità 2.6.1',
  'ret': 'prima dell’unità 2.6.2 compare in fondo ai listati come l’istruzione con cui la funzione torna al chiamante; il suo meccanismo sulla pila arriva nell’unità 2.6.2',
  'rbp': 'prima dell’unità 2.7.1 compare soltanto negli elenchi dei registri, nelle unità 2.1.2 e 2.6.2; il suo ruolo arriva nell’unità 2.7.1',
  'pila ombra': 'l’unità 2.7.4 la annuncia fra le difese con un rinvio esplicito all’unità 2.7.6, che la spiega',
  'percorso dati': 'nell’unità 1.1.4 le due parole sono accostate per caso: «il percorso dati/voti.txt» indica un file nella directory dati',
  'pipeline': 'le unità 3.4.3 e 3.4.5 la annunciano come tema dei capitoli successivi, senza farne uso',
  'codice di errore': 'nell’unità 2.5.2 l’espressione indica il numero conservato in errno, un oggetto diverso dal valore che il processore aggiunge al frame di interruzione',
  'autorizzazione': 'nelle unità 1.7.4 e 2.4.3 compare soltanto nel nome «byte di autorizzazione», un campo del formato descritto sul posto; la decisione di autorizzazione arriva nell’unità 6.7.1'
};
const piano = (s) => s.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2').replace(/\[\[([^\]]+)\]\]/g, '$1').replace(/`/g, '');
const parola = (f) => new RegExp('(?<![\\p{L}\\p{N}])' + f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\p{L}\\p{N}])', 'iu');
const anticipi = [];
for (const k of Object.keys(G)) {
  const forme = [k].concat(G[k].f || []).sort((a, b) => b.length - a.length);
  const limite = ORDINE.indexOf(G[k].u);
  // Un termine composto non va scambiato con uno più corto che contiene (file oggetto / file).
  const piuLunghi = Object.keys(G).filter((x) => x !== k && x.includes(k)).flatMap((x) => [x].concat(G[x].f || []));
  ORDINE.slice(0, limite).forEach((id) => (testi[id] || []).forEach((t) => {
    if (t.dove === 'titolo' || t.dove === 'sfida') return;       // il titolo annuncia l'argomento; il nome della sfida è fissato altrove
    let s = piano(t.s);
    piuLunghi.forEach((x) => { s = s.replace(new RegExp(x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'giu'), '·'); });
    const forma = forme.find((f) => parola(f).test(s));
    if (forma) anticipi.push({ k, id, dove: t.dove, s: s.length > 150 ? s.slice(Math.max(0, s.search(parola(forma)) - 60), s.search(parola(forma)) + 80) : s });
  }));
}

// Le prove: una prova può usare i termini introdotti fino all'ultima unità del suo capitolo.
for (const c of capitoli.filter((x) => x.prova && testi['prova ' + x.id])) {
  const ultima = Math.max.apply(null, (c.unita || []).map((u) => ORDINE.indexOf(u.id)));
  for (const k of Object.keys(G)) {
    if (ORDINE.indexOf(G[k].u) <= ultima) continue;
    const forme = [k].concat(G[k].f || []).sort((a, b) => b.length - a.length);
    const piuLunghi = Object.keys(G).filter((x) => x !== k && x.includes(k)).flatMap((x) => [x].concat(G[x].f || []));
    testi['prova ' + c.id].forEach((t) => {
      let s = piano(t.s);
      piuLunghi.forEach((x) => { s = s.replace(new RegExp(x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'giu'), '·'); });
      const forma = forme.find((f) => parola(f).test(s));
      if (forma) anticipi.push({ k, id: 'prova ' + c.id, dove: t.dove, s: s.length > 150 ? s.slice(Math.max(0, s.search(parola(forma)) - 60), s.search(parola(forma)) + 80) : s });
    });
  }
}

/* ---------- costrutti da evitare ---------- */
const VIETATI = [
  [/[—–]/u, 'lineetta lunga'],
  [/\bnon\b[^.;:!?]{0,140}?,\s+ma\b/iu, 'costrutto «non …, ma …»'],
  [/\bnon\b[^.;:!?]{0,60}\s+ma\s+(?!anche\b)/iu, 'costrutto «non … ma …»'],
  [/\bnon\b[^.;!?:]{0,110}:\s/iu, 'costrutto «non …: …»'],
  [/\bnon\b[^.;!?:]{0,90}[.;]\s+(è|sono|si tratta|ha|hanno)\b/iu, 'costrutto «non …. È …»'],
  [/,\s+(e\s+)?non\s+(un|uno|una|il|lo|la|i|gli|le|l’|di|da|a|in|per|con)\b/iu, 'costrutto «X, non Y»'],
  [/\bnon\s+(\p{L}{4,})\b[^.;!?]{0,90}[.;:]\s+\1\b/iu, 'costrutto «non fa X. Fa Y»'],
  [/\bnon (solo|soltanto|solamente)\b/iu, '«non solo»'],
  [/\b(bensì|ovvero sia)\b/iu, '«bensì»'],
  [/\b(il punto è|la questione è|il punto della questione|il nocciolo|la vera domanda|la domanda è)\b/iu, 'formula «il punto è»'],
  [/\b(in altre parole|in sintesi|in definitiva|in poche parole|in conclusione|in breve|detto altrimenti|detto questo|a ben vedere|non a caso|va detto che|vale la pena|è importante (notare|sottolineare|ricordare)|è bene ricordare|è interessante notare|ricorda che|tieni presente che)\b/iu, 'formula di raccordo'],
  [/\b(fondamentale|cruciale|essenziale|potente|affascinante|straordinari[oa]|incredibil[ei]|magia|magico|semplicemente|letteralmente|sostanzialmente|fondamentalmente)\b/iu, 'aggettivo o avverbio enfatico'],
  [/\b(ecco (perché|che|come|il|la)|immagina di|tuffiamoci|scopriamo|esploriamo|facciamo un passo indietro|un vero e proprio|una vera e propria|gioca un ruolo|a tutti gli effetti)\b/iu, 'formula di repertorio'],
  [/\b(cosa|che cosa|perché|come mai|e allora|ma allora)\b[^.!?]{0,90}\?\s+\p{Lu}/u, 'domanda retorica seguita dalla risposta']
];
const stile = [];
for (const id of Object.keys(testi)) for (const t of testi[id]) {
  const s = piano(t.s);
  VIETATI.forEach(([re, nome], k) => {
    if (k === VIETATI.length - 1 && t.genere !== 'prosa') return;      // le domande vere restano domande
    for (const m of s.matchAll(new RegExp(re.source, re.flags + 'g'))) stile.push({ id, dove: t.dove, nome, s: s.slice(Math.max(0, m.index - 50), m.index + m[0].length + 50) });
  });
  if (t.genere === 'prosa' && /\p{L}\?/u.test(s) && !/indizio/.test(t.dove) && !/[«"“]/.test(s)) stile.push({ id, dove: t.dove, nome: 'punto interrogativo nella prosa', s: s.slice(0, 140) });
}

// La frase scissa («A cambiare è…», «È il linker a…») è ammessa, ma ripetuta diventa un tic: al più due per unità.
for (const id of Object.keys(testi)) {
  const visteScisse = new Set();
  testi[id].forEach((t) => { for (const m of piano(t.s).matchAll(/(?<![\p{L}’])(A \p{L}+(?:re|rli|rle|rla|rlo|rne) (?:è|sono|c’è|sarà)|È (?:il|la|lo|l’)\s?\p{L}+ (?:a|ad) \p{L}+re)\b[^.]{0,40}/giu)) visteScisse.add(m[0].replace(/\d+/g, '#')); });
  if (visteScisse.size > 2) stile.push({ id, dove: 'tutta l’unità', nome: 'frase scissa ripetuta ' + visteScisse.size + ' volte', s: Array.from(visteScisse).join(' / ').slice(0, 200) });
}

/* ---------- registro accademico impersonale ---------- */
// Il sito adotta la forma impersonale in ogni testo: teoria, laboratori ed esercizi. Lo strumento segnala la seconda persona,
// la prima plurale, il lessico colloquiale, i superlativi, le formule a effetto e le serie di frasi brevissime.
// Le unità già riscritte sono elencate in REGISTRO_FATTO: per loro ogni segnalazione è riportata; per le altre si dà il conto.
const REGISTRO_FATTO = ['0.', '1.', '2.', '3.', '4.'];
const IMPERATIVI = 'Prova|Guarda|Osserva|Scegli|Pensa|Immagina|Nota|Ricorda|Calcola|Scrivi|Leggi|Confronta|Aumenta|Riduci|Cambia|Ripeti|Conta|Cerca|Usa|Parti|Segui|Considera|Controlla|Verifica|Rispondi|Indica|Completa|Sposta|Premi|Apri|Torna|Dividi|Moltiplica|Somma|Sottrai|Aggiungi|Togli|Converti|Applica|Trova|Elenca|Tieni|Ragiona|Annota|Chiediti|Fermati|Lascia|Metti|Prendi|Porta|Ripassa|Rileggi|Riparti|Separa|Traduci|Individua|Stabilisci|Descrivi|Spiega|Fai|Vai|Scorri|Ricava|Ordina|Estrai|Isola|Esegui|Sostituisci|Riscrivi';
const REGISTRO = [
  ['seconda persona', /(?<![\p{L}’])(saprai|vedrai|sceglierai|potrai|dovrai|troverai|userai|avrai|farai|seguirai|leggerai|scriverai|otterrai|noterai|imparerai|capirai|sarai|vorrai|dirai|conterai|calcolerai|confronterai|proverai|guarderai|osserverai|incontrerai|riconoscerai|hai|avevi|puoi|devi|vuoi|sai|stai|eri|tu|ti|te|tuo|tua|tuoi|tue|fall[oiae]|scrivil[oiae]|contal[oiae]|leggil[oiae]|sommal[oiae]|dividil[oiae]|spostal[oiae]|mettil[oiae]|prendil[oiae]|chiediti|fermati|ricordati|confrontal[oiae]|calcolal[oiae]|trovali|trovalo|cercal[oiae]|usal[oiae]|tienil[oiae]|lascial[oiae]|guardal[oiae]|osserval[oiae]|scorril[oiae])(?![\p{L}’])/iu],
  ['prima persona singolare', /(?<![\p{L}’])(dico|distinguo|spiego|riconosco|seguo|prevedo|leggo|stabilisco|ricavo|descrivo|trovo|scelgo|scrivo|ricostruisco|individuo|applico|sommo|compilo|aggiorno|verifico|separo|costruisco|metto|scompongo|interpreto|divido|decido|compongo|associo|assegno|traduco|tengo|posso|devo|faccio|voglio|mio|mia|miei|mie|mi|io)(?![\p{L}’])/iu],
  ['imperativo', new RegExp('(?:^|[.:;!?»)]\\s+)(?:' + IMPERATIVI + ')(?![\\p{L}’:])', 'u')],
  ['imperativo coordinato', /(?:^|[.!?»]\s+)Si \p{L}+[^.!?]*?(?:, | e | poi )(calcola|somma|conta|moltiplica|confronta|controlla|considera|applica|usa|porta|trova|elenca|annota|indica|sposta|aumenta|cambia|lascia|ricava|verifica|completa|separa|ordina|isola|individua|arrotonda|raddoppia|riporta|conserva|segna|raggruppa|lavora|aggiungi|togli|scrivi|dividi|leggi|segui|sottrai|converti|ripeti|scegli|tieni|metti|prendi|riduci|scorri|traduci|stabilisci|descrivi|esegui)(?![\p{L}’])/u],
  ['prima persona plurale', /(?<![\p{L}’])((?!richiamo)\p{L}{3,}(?:iamo|eremo|iremo)|vedremo|faremo|diremo|avremo|saremo|potremo|dovremo|daremo|andremo|verremo|terremo|vorremo|noi|nostr[oaie])(?![\p{L}’])/iu],
  ['lessico colloquiale', /(?<![\p{L}’])(un po’|un attimo|per fortuna|purtroppo|ecco|insomma|davvero|semplicemente|giocattolo|trucco|trucchi|numero civico|casellario|inquilin[oi]|da vicino|togli\p{L}* di mezzo|viene da chiedersi|con calma|a occhio|di fantasia|mai e poi mai|per finta|in fin dei conti|a ben vedere|non a caso|vale la pena|gioca un ruolo|è importante notare|il bello è|la buona notizia|la cattiva notizia|niente paura|pian piano|per filo e per segno|tutto qui|magi[ac]\p{L}*|comod[oaie]|svita\p{L}*|raccont\p{L}+|tace|tacciono|storia|storie|guai[o]?|pasticci\p{L}*|un sacco|parecchi\p{L}*|roba|sbirci\p{L}*|buttar\p{L}*|butta|salta fuori|saltano fuori|tira\p{L}* fuori|va a finire|fa finta|sul serio)(?![\p{L}’])/iu],
  ['superlativo', /(?<![\p{L}’])\p{L}{3,}issim[oaie](?![\p{L}’])/iu],
  ['rivelazione dopo i due punti', /(?:^|[.!?]\s+)(La prima|La seconda|La terza|Il primo|Il secondo|La risposta|La soluzione|Il risultato|Il motivo|La ragione|Il punto|L’idea|Il trucco|La regola): /u],
  ['apertura a effetto', /(?:^|[.!?]\s+)(C’è poi|C’è però|Qui nasce|Ed è qui|Ecco|Viene allora|Il guaio|E qui|Ma c’è|Sembra poco|Non basta|Attenzione)(?![\p{L}’])/u]
];
const registro = [], vistoReg = new Set();
for (const id of Object.keys(testi)) testi[id].forEach((t) => {
  const s = piano(t.s);
  REGISTRO.forEach((r) => { if (r[0] === 'imperativo' && /^(titolo|concetti|sfida)$/.test(t.dove)) return; /* titoli, etichette dei concetti e titoli delle sfide sono sintagmi nominali */ const m = s.match(r[1]); if (!m) return; const chiave = id + '|' + r[0] + '|' + s.slice(Math.max(0, m.index - 20), m.index + 40); if (vistoReg.has(chiave)) return; vistoReg.add(chiave); registro.push({ id, nome: r[0], dove: t.dove, s: s.slice(Math.max(0, m.index - 50), m.index + 70) }); });
  if (t.genere === 'prosa' && /idea|racconto/.test(t.dove)) { const frasi = s.split(/(?<=[.!?])\s+/).map((f) => (f.match(/[\p{L}\p{N}]+/gu) || []).length); let serie = 0, peggio = 0; frasi.forEach((n) => { serie = n > 0 && n <= 7 ? serie + 1 : 0; peggio = Math.max(peggio, serie); }); if (peggio >= 3) { const chiave = id + '|brevi|' + s.slice(0, 60); if (!vistoReg.has(chiave)) { vistoReg.add(chiave); registro.push({ id, nome: 'frasi brevi in serie', dove: t.dove, s: s.slice(0, 120) }); } } }
});

/* ---------- leggibilità (indice Gulpease) ---------- */
const gulpease = (s) => { const parole = (s.match(/[\p{L}\p{N}]+/gu) || []); const lettere = parole.join('').length; const frasi = (s.match(/[.!?]+(\s|$)/g) || []).length || 1; return Math.round(89 + (300 * frasi - 10 * lettere) / parole.length); };

/* ---------- resoconto ---------- */
const riga = (a) => a.map((x, i) => String(x).padEnd([8, 8, 8, 8, 10][i] || 8)).join('');
console.log('UNITÀ ' + ORDINE.length + ' · TERMINI ' + Object.keys(G).length + ' · SIMBOLI ' + SIMBOLI.size + '\n');
console.log(riga(['unità', 'casi', 'passi-', 'passi+', 'guidato']) + 'parole  Gulpease (idea)');
statistiche.forEach((r) => {
  const u = SL.unita[r[0]], idea = piano((u.idea.testo || []).filter((t) => typeof t === 'string').join(' '));
  console.log(riga(r) + String((idea.match(/[\p{L}\p{N}]+/gu) || []).length).padEnd(8) + gulpease(idea));
});
if (statProve.length) {
  console.log('\n' + riga(['prova', 'domande', 'var-min', 'var-tot']) + '(varianti distinte su ' + VARIANTI + ': la domanda meno varia, e la somma)');
  statProve.forEach((r) => console.log(riga(r)));
}
const fuori = anticipi.filter((a) => !ACCETTATI[a.k]);
/* ---------- sicurezza del codice ---------- */
// Regole statiche che tengono fermo ciò su cui si fonda la sicurezza del sito: nessuna risorsa esterna, nessun codice
// costruito da stringhe, nessun dato conservato o trasmesso, nessun gestore di evento in linea, politica dei contenuti presente.
{
  const elenco = (dir, est) => (fs.existsSync(path.join(radice, dir)) ? fs.readdirSync(path.join(radice, dir)).filter((f) => f.endsWith(est)).sort().map((f) => dir + '/' + f) : []);
  const codice = elenco('sl/js', '.js'), contenuti = elenco('sl/dati', '.js').concat(elenco('sl/unita', '.js'), elenco('sl/prove', '.js')), stili = elenco('sl/css', '.css');
  const VIETATE = [[/\beval\s*\(/, 'eval'], [/\bnew\s+Function\b/, 'new Function'], [/\bdocument\.write/, 'document.write'], [/\b(localStorage|sessionStorage|indexedDB)\b/, 'archivi del browser'], [/\bdocument\.cookie\b/, 'cookie'], [/\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\bsendBeacon\b|\bEventSource\b/, 'richieste di rete'], [/\bimport\s*\(/, 'import dinamico'], [/\bpostMessage\b/, 'postMessage'], [/\bset(Timeout|Interval)\s*\(\s*['"`]/, 'temporizzatore con codice in una stringa'], [/\bjavascript:/i, 'indirizzo javascript:']];
  const SOLO_DATI = [[/\binnerHTML\b|\bouterHTML\b|\binsertAdjacentHTML\b/, 'scrittura diretta di HTML'], [/\bdocument\s*\./, 'accesso al documento'], [/\bwindow\s*\./, 'accesso alla finestra'], [/\blocation\s*\./, 'accesso all’indirizzo']];
  const ESTERNO = /(?:https?:)?\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+/gi, AMMESSI = new Set(['http://www.w3.org', 'https://creativecommons.org']);
  const GESTORE = /\son(?:click|dblclick|change|input|load|error|submit|focus|blur|key\w+|mouse\w+|pointer\w+|touch\w+)\s*=\s*\\?["']/i;
  let esaminati = 0;
  const esamina = (f, soloDati) => {
    const testo = leggi(f); esaminati++;
    VIETATE.forEach((v) => { if (v[0].test(testo)) err('sicurezza', f + ' · uso non ammesso: ' + v[1]); });
    if (soloDati) SOLO_DATI.forEach((v) => { if (v[0].test(testo)) err('sicurezza', f + ' · un file di contenuti deve restare privo di ' + v[1]); });
    (testo.match(ESTERNO) || []).forEach((u) => { if (!AMMESSI.has(u)) err('sicurezza', f + ' · indirizzo esterno: ' + u); });
    if (GESTORE.test(testo)) err('sicurezza', f + ' · gestore di evento in linea');
  };
  codice.forEach((f) => esamina(f, false)); contenuti.forEach((f) => esamina(f, true)); stili.forEach((f) => esamina(f, false));
  const pagina = leggi('index.html'); esaminati++;
  const politica = (pagina.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"/) || [])[1] || '';
  if (!politica) err('sicurezza', 'index.html · manca la politica di sicurezza dei contenuti');
  else {
    const direttive = {}; politica.split(';').forEach((d) => { const p = d.trim().split(/\s+/); if (p[0]) direttive[p[0]] = p.slice(1); });
    if ((direttive['default-src'] || []).join(' ') !== "'none'") err('sicurezza', 'index.html · default-src deve valere soltanto \'none\'');
    if ((direttive['script-src'] || []).join(' ') !== "'self'") err('sicurezza', 'index.html · script-src deve valere soltanto \'self\'');
    ['object-src', 'base-uri', 'frame-src', 'form-action', 'connect-src'].forEach((d) => { if ((direttive[d] || []).join(' ') !== "'none'") err('sicurezza', 'index.html · ' + d + ' deve valere \'none\''); });
  }
  if (/<script(?![^>]*\bsrc=)[^>]*>/.test(pagina)) err('sicurezza', 'index.html · script in linea');
  (pagina.match(/<script[^>]*\bsrc="([^"]+)"/g) || []).forEach((t) => { const u = t.replace(/^.*src="/, '').replace(/"$/, ''); if (!/^sl\/(js|dati)\/[a-z0-9-]+\.js$/.test(u)) err('sicurezza', 'index.html · script fuori dalle cartelle previste: ' + u); });
  if (GESTORE.test(pagina)) err('sicurezza', 'index.html · gestore di evento in linea');
  (pagina.match(ESTERNO) || []).forEach((u) => { if (!AMMESSI.has(u)) err('sicurezza', 'index.html · indirizzo esterno: ' + u); });
  (pagina.match(/<a\b[^>]*target="_blank"[^>]*>/g) || []).forEach((a) => { if (!/rel="[^"]*noopener[^"]*"/.test(a)) err('sicurezza', 'index.html · collegamento in nuova scheda senza rel="noopener"'); });
  console.log('\nSICUREZZA · file esaminati ' + esaminati + ' · regole: risorse esterne, codice da stringhe, archivi e rete, gestori in linea, politica dei contenuti');
}

console.log('\nERRORI ' + errori.length); errori.forEach((x) => console.log('  ' + x.testo + (x.n > 1 ? '  [e altri ' + (x.n - 1) + ' casi uguali]' : '')));
console.log('\nTERMINI USATI PRIMA DELLA LORO UNITÀ ' + fuori.length + (TUTTO ? '' : ' (più ' + (anticipi.length - fuori.length) + ' accettati, visibili con --tutto)'));
const gruppi = new Map();
(TUTTO ? anticipi : fuori).forEach((a) => { const c = a.id + '|' + a.k; if (!gruppi.has(c)) gruppi.set(c, []); gruppi.get(c).push(a); });
for (const lista of gruppi.values()) {
  const a = lista[0];
  console.log('  ' + a.id + ' · «' + a.k + '» (unità ' + G[a.k].u + ')' + (ACCETTATI[a.k] ? ' [accettato]' : '') + ' · ' + lista.length + (lista.length === 1 ? ' occorrenza' : ' occorrenze'));
  lista.slice(0, TUTTO ? 2 : 4).forEach((x) => console.log('      ' + x.dove + ' · …' + x.s.replace(/\s+/g, ' ') + '…'));
}
const unici = []; { const gia = new Set(); stile.forEach((x) => { const c = x.id + x.nome + x.s.replace(/\d+/g, '#'); if (!gia.has(c)) { gia.add(c); unici.push(x); } }); }
console.log('\nCOSTRUTTI DA EVITARE ' + unici.length);
unici.forEach((x) => console.log('  ' + x.id + ' · ' + x.nome + ' · ' + x.dove + ' · …' + x.s.replace(/\s+/g, ' ') + '…'));
{
  const fatto = (id) => REGISTRO_FATTO.some((p) => id === p || id.startsWith(p) || id === 'prova ' + p.replace(/\.$/, '') || id.startsWith('prova ' + p));
  const perUnita = {}; registro.forEach((x) => { perUnita[x.id] = (perUnita[x.id] || 0) + 1; });
  const tutte = Object.keys(testi), conformi = tutte.filter((id) => !perUnita[id]), perTipo = {}; registro.forEach((x) => { perTipo[x.nome] = (perTipo[x.nome] || 0) + 1; });
  console.log('\nREGISTRO ACCADEMICO · testi conformi ' + conformi.length + ' su ' + tutte.length + ' · segnalazioni ' + registro.length + ' · ' + Object.keys(perTipo).map((k) => k + ' ' + perTipo[k]).join(', '));
  const perModulo = {}; registro.forEach((x) => { const m = x.id.replace(/^prova /, '').split('.')[0]; perModulo[m] = (perModulo[m] || 0) + 1; });
  console.log('  per modulo: ' + Object.keys(perModulo).sort().map((m) => m + ': ' + perModulo[m]).join(' · '));
  const daCorreggere = registro.filter((x) => fatto(x.id) || process.argv.includes('--registro'));
  console.log('REGISTRO DA CORREGGERE nelle parti già riscritte ' + registro.filter((x) => fatto(x.id)).length);
  daCorreggere.slice(0, process.argv.includes('--registro') ? 400 : 200).forEach((x) => console.log('  ' + x.id + ' · ' + x.nome + ' · ' + x.dove + ' · …' + x.s.replace(/\s+/g, ' ') + '…'));
}
console.log('\nAVVISI ' + avvisi.length); avvisi.forEach((x) => console.log('  ' + x));
process.exit(errori.length ? 1 : 0);
