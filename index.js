const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function convertImages(inputDir, outputDir) {
  // Skapa output-katalogen om den inte finns
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Radera innehållet i output-katalogen
  let files = fs.readdirSync(outputDir);
  for (const file of files) {
    fs.unlinkSync(path.join(outputDir, file));
  }

  // Läs alla filer i input-katalogen
  files = fs.readdirSync(inputDir);

  const conversionTimes = {
    webp: 0,
    avif: 0,
  };

  for (const file of files) {
    if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const inputPath = path.join(inputDir, file);
      const baseName = path.parse(file).name;

      // Konvertera till WebP
      const webpStart = Date.now();
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(path.join(outputDir, `${baseName}.webp`));
      conversionTimes.webp += Date.now() - webpStart;

      // Konvertera till AVIF
      const avifStart = Date.now();
      await sharp(inputPath)
        .avif({ quality: 40 })
        .toFile(path.join(outputDir, `${baseName}.avif`));
      conversionTimes.avif += Date.now() - avifStart;
    }
  }

  console.log("Bildkonvertering slutförd!");
  console.log(`WebP konverteringstid: ${conversionTimes.webp / 1000} s`);
  console.log(`AVIF konverteringstid: ${conversionTimes.avif / 1000} s`);
}

// Använd funktionen
convertImages("./input", "./output");
