// Controllo del registro sulle stringhe visibili degli script dell'interfaccia (testo fra i tag HTML compreso).
// Uso: node sl/strumenti/controlli_interfaccia.js   (dalla radice del sito)
// Le regole sono quelle del registro accademico definite in controlli.js; «Prova» come sostantivo è ammesso.
const fs = require('fs'), vm = require('vm'), path = require('path');
const R = path.join(__dirname, '..', '..') + path.sep;
const lint = fs.readFileSync(R + 'sl/strumenti/controlli.js', 'utf8');
const REG = vm.runInContext(lint.slice(lint.indexOf('const IMPERATIVI'), lint.indexOf('const registro = []')) + '; REGISTRO', vm.createContext({}));
let n = 0;
for (const f of ['unita', 'laboratorio', 'prova', 'rete', 'scena', 'avvio', 'nucleo']) {
  const src = fs.readFileSync(R + 'sl/js/' + f + '.js', 'utf8');
  const lett = src.match(/'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/g) || [];
  const visti = new Set();
  lett.forEach((l) => l.slice(1, -1).split(/<[^>]*>|\$\{[^}]*\}/).map((x) => x.trim())
    .filter((x) => /\p{L}{3}/u.test(x) && / /.test(x) && !/^[a-z-]+="|[{};=]|^\w+\(|class=|style=|aria-/.test(x))
    .forEach((t) => REG.forEach((r) => {
      const m = t.match(r[1]); if (!m || visti.has(r[0] + t)) return;
      if (r[0] === 'imperativo' && /^Prova (del|di|non|·)/.test(t)) return;
      visti.add(r[0] + t); n++; console.log(f + '.js · ' + r[0] + ' · ' + t.slice(0, 200));
    })));
}
console.log('REGISTRO DELL’INTERFACCIA · segnalazioni ' + n);
process.exit(n ? 1 : 0);
