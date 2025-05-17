/**
 * This script creates test placeholder images for header and footer
 * Run with: node scripts/create-test-images.js
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Make sure directories exist
const templateDir = path.resolve(process.cwd(), 'templates/images');
const distTemplateDir = path.resolve(process.cwd(), 'dist/templates/images');

[templateDir, distTemplateDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Create header image
function createHeaderImage() {
  const canvas = createCanvas(500, 100);
  const ctx = canvas.getContext('2d');
  
  // Blue background
  ctx.fillStyle = '#2E5984';
  ctx.fillRect(0, 0, 500, 100);
  
  // Text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 20px Arial';
  ctx.fillText('GOBERNACIÓN', 20, 30);
  ctx.fillText('Departamento del Valle del Cauca', 20, 60);
  ctx.fillText('Secretaría de Salud', 20, 90);
  
  // Save to file
  const headerPath = path.join(templateDir, 'gobernacionlogo.png');
  const out = fs.createWriteStream(headerPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log(`Created header image: ${headerPath}`));
  
  // Also save to dist directory
  const distHeaderPath = path.join(distTemplateDir, 'gobernacionlogo.png');
  const distOut = fs.createWriteStream(distHeaderPath);
  const distStream = canvas.createPNGStream();
  distStream.pipe(distOut);
  distOut.on('finish', () => console.log(`Created dist header image: ${distHeaderPath}`));
}

// Create footer image
function createFooterImage() {
  const canvas = createCanvas(500, 40);
  const ctx = canvas.getContext('2d');
  
  // White background with border
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 500, 40);
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, 500, 40);
  
  // Draw horizontal line
  ctx.beginPath();
  ctx.moveTo(0, 1);
  ctx.lineTo(500, 1);
  ctx.stroke();
  
  // Text
  ctx.fillStyle = '#2E5984';
  ctx.font = 'bold 10px Arial';
  ctx.fillText('Departamento del Valle del Cauca', 10, 15);
  ctx.fillText('Gobernación', 10, 30);
  
  ctx.fillText('Carrera 6 entre calles 9 y 10', 180, 15);
  ctx.fillText('Edificio Palacio de San Francisco', 180, 30);
  
  ctx.fillText('contactenos@valledelcauca.gov.co', 350, 15);
  ctx.fillText('www.valledelcauca.gov.co', 350, 30);
  
  // Save to file
  const footerPath = path.join(templateDir, 'footer.png');
  const out = fs.createWriteStream(footerPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log(`Created footer image: ${footerPath}`));
  
  // Also save to dist directory
  const distFooterPath = path.join(distTemplateDir, 'footer.png');
  const distOut = fs.createWriteStream(distFooterPath);
  const distStream = canvas.createPNGStream();
  distStream.pipe(distOut);
  distOut.on('finish', () => console.log(`Created dist footer image: ${distFooterPath}`));
}

createHeaderImage();
createFooterImage(); 