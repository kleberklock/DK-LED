const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const indexPath = path.join(rootDir, 'index.html');
const cssPath = path.join(rootDir, 'css', 'style.css');
const jsPath = path.join(rootDir, 'js', 'main.js');
const outputPath = path.join(rootDir, 'dkled-apresentacao.html');

console.log('Lendo arquivos...');
let html = fs.readFileSync(indexPath, 'utf-8');
const css = fs.readFileSync(cssPath, 'utf-8');
const js = fs.readFileSync(jsPath, 'utf-8');

// Incorporar CSS
html = html.replace(
  /<link rel="stylesheet" href="css\/style\.css">/,
  `<style>\n${css}\n</style>`
);

// Incorporar JavaScript
html = html.replace(
  /<script src="js\/main\.js"><\/script>/,
  `<script>\n${js}\n</script>`
);

// Converter imagens para Base64
const imgDir = path.join(rootDir, 'assets', 'img');
const images = [
  { name: 'depois-modulo-reparado.jpg', mime: 'image/jpeg' },
  { name: 'time-tecnicos-dkled.jpg', mime: 'image/jpeg' },
  { name: 'victor-dias-tecnico.jpg', mime: 'image/jpeg' },
  { name: 'antes-modulo-queimado.jpg', mime: 'image/jpeg' },
  { name: 'hero-painel-led.jpg', mime: 'image/jpeg' }
];

images.forEach(img => {
  const filePath = path.join(imgDir, img.name);
  if (fs.existsSync(filePath)) {
    const b64 = fs.readFileSync(filePath).toString('base64');
    const dataUri = `data:${img.mime};base64,${b64}`;
    // Substituir caminhos relativos
    const regex = new RegExp(`assets/img/${img.name}`, 'g');
    html = html.replace(regex, dataUri);
    console.log(`Imagem convertida e embutida: ${img.name}`);
  }
});

fs.writeFileSync(outputPath, html, 'utf-8');
const stats = fs.statSync(outputPath);
console.log(`Arquivo único gerado com sucesso: dkled-apresentacao.html (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
