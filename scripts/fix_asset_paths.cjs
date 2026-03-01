const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'brand', 'da-marcolino-brand-final_1.html');
let content = fs.readFileSync(htmlPath, 'utf8');

// Utilities to replace sequentially
let searchPos = 0;
function replaceNext(target, replacement) {
    const nextIdx = content.indexOf(target, searchPos);
    if (nextIdx !== -1) {
        content = content.substring(0, nextIdx) + content.substring(nextIdx).replace(target, replacement);
        searchPos = nextIdx + replacement.length;
    }
}

// 1. Cover
replaceNext('src="quadrifogli.svg"', 'src="testa.svg"'); // L442
// 01 Logo Completo
replaceNext('src="quadrifogli.svg"', 'src="testa.svg"'); // 1
replaceNext('src="quadrifogli.svg"', 'src="testa.svg"'); // 2
replaceNext('src="quadrifogli.svg"', 'src="testa.svg"'); // 3
replaceNext('src="quadrifogli.svg"', 'src="testa.svg"'); // 4
replaceNext('src="quadrifogli.svg"', 'src="testa.svg"'); // 5 (Solo mascotte)
replaceNext('src="quadrifogli.svg"', 'src="scritta (1).svg"'); // 6 (Solo scritta)

// 02 Scritta
replaceNext('src="quadrifogli.svg"', 'src="scritta (1).svg"');
replaceNext('src="quadrifogli.svg"', 'src="scritta (1).svg"');
replaceNext('src="quadrifogli.svg"', 'src="scritta (1).svg"');
replaceNext('src="quadrifogli.svg"', 'src="scritta (1).svg"');

// 03 Quadrifoglio (leave as quadrifogli.svg)
replaceNext('src="quadrifogli.svg"', 'src="quadrifogli.svg"');
replaceNext('src="quadrifogli.svg"', 'src="quadrifogli.svg"');
replaceNext('src="quadrifogli.svg"', 'src="quadrifogli.svg"');
replaceNext('src="quadrifogli.svg"', 'src="quadrifogli.svg"');
replaceNext('src="quadrifogli.svg"', 'src="quadrifogli.svg"');
replaceNext('src="quadrifogli.svg"', 'src="quadrifogli.svg"');
replaceNext('src="quadrifogli.svg"', 'src="quadrifogli.svg"');

// 04 Usi Combinati
replaceNext('src="quadrifogli.svg"', 'src="testa.svg"'); // Verticale 1
replaceNext('src="quadrifogli.svg"', 'src="quadrifogli.svg"'); // bullet
replaceNext('src="quadrifogli.svg"', 'src="scritta (1).svg"'); // Verticale scritta

replaceNext('src="quadrifogli.svg"', 'src="testa.svg"'); // Orizz 1
replaceNext('src="quadrifogli.svg"', 'src="scritta (1).svg"'); // Orizz scritta

replaceNext('src="quadrifogli.svg"', 'src="quadrifogli.svg"'); // Scritta+Q 1
replaceNext('src="quadrifogli.svg"', 'src="scritta (1).svg"'); // Scritta+Q scritta
replaceNext('src="quadrifogli.svg"', 'src="quadrifogli.svg"'); // Scritta+Q 2

// 08 Menu
replaceNext('src="quadrifogli.svg"', 'src="testa.svg"');

// 09 Packaging
replaceNext('src="quadrifogli.svg"', 'src="testa.svg"'); // pizza
replaceNext('src="quadrifogli.svg"', 'src="quadrifogli.svg"'); // fritti

// 10 Biglietto
replaceNext('src="quadrifogli.svg"', 'src="testa.svg"');

fs.writeFileSync(htmlPath, content, 'utf8');
console.log("Sostituzioni asset mirate completate.");
