const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'brand', 'da-marcolino-brand-final_1.html');

try {
    let content = fs.readFileSync(htmlPath, 'utf8');

    // Count SVGs before replacement
    const svgMatches = content.match(/<svg[\s\S]*?<\/svg>/gi) || [];
    console.log(`Trovati ${svgMatches.length} blocchi <svg> inline.`);

    // We are going to implement a smarter replacement.
    // We'll replace all SVG tags with placeholder images, preserving the inline styles.
    // Some SVG are specific. But replacing them all with placeholders is step 1.

    // Actually, let's just replace all SVGs with a standard image tag containing a data attribute we can target later.
    let replacementCount = 0;
    content = content.replace(/<svg[\s\S]*?<\/svg>/gi, (match) => {
        replacementCount++;
        // Check if the SVG was filled with a specific color (often used for the white/red versions)
        let colorHint = 'default';
        if (match.includes('fill="#F9F6EF"')) colorHint = 'white';
        else if (match.includes('fill="#C8392B"')) colorHint = 'red';
        else if (match.includes('fill="#2D6A2D"')) colorHint = 'green';
        else if (match.includes('fill="#111111"')) colorHint = 'black';

        // We will place an img tag with the class 'brand-svg' so we can target it with CSS later
        return `<img class="brand-asset asset-replaced" src="quadrifogli.svg" data-original-color="${colorHint}" alt="Brand Asset" />`;
    });

    fs.writeFileSync(htmlPath, content, 'utf8');
    console.log(`Sostituiti ${replacementCount} SVG. File alleggerito con successo.`);

    const stats = fs.statSync(htmlPath);
    console.log(`Nuovo peso del file: ${(stats.size / 1024).toFixed(2)} KB.`);

} catch (e) {
    console.error("Errore durante la pulizia:", e);
}
