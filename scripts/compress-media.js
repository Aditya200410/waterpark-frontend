import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');
const outputDir = path.join(publicDir, 'optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Image compression settings
const imageSettings = {
  jpeg: { quality: 80, progressive: true },
  png: { quality: 80, compressionLevel: 9 },
  webp: { quality: 80 }
};

// Video compression settings (we'll use FFmpeg for this)
const videoSettings = {
  mp4: { crf: 28, preset: 'medium' },
  webm: { crf: 30, preset: 'medium' }
};

async function compressImage(inputPath, outputPath, format) {
  try {
    const settings = imageSettings[format] || imageSettings.webp;
    
    if (format === 'webp') {
      await sharp(inputPath)
        .webp(settings)
        .toFile(outputPath);
    } else if (format === 'jpeg' || format === 'jpg') {
      await sharp(inputPath)
        .jpeg(settings)
        .toFile(outputPath);
    } else if (format === 'png') {
      await sharp(inputPath)
        .png(settings)
        .toFile(outputPath);
    }
    
    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
    
  } catch (error) {
    console.error(`❌ Error compressing ${inputPath}:`, error.message);
  }
}

async function compressImages() {
  const imageExtensions = ['.png', '.jpg', '.jpeg'];
  const files = fs.readdirSync(publicDir);
  
  
  for (const file of files) {
    const filePath = path.join(publicDir, file);
    const ext = path.extname(file).toLowerCase();
    
    if (imageExtensions.includes(ext) && fs.statSync(filePath).isFile()) {
      const fileName = path.basename(file, ext);
      const outputPath = path.join(outputDir, `${fileName}.webp`);
      
      // Skip if already compressed
      if (fs.existsSync(outputPath)) {
        continue;
      }
      
      await compressImage(filePath, outputPath, 'webp');
    }
  }
}

async function createOptimizedVideos() {
  
  const videoExtensions = ['.mp4', '.webm'];
  const files = fs.readdirSync(publicDir);
  
  for (const file of files) {
    const filePath = path.join(publicDir, file);
    const ext = path.extname(file).toLowerCase();
    
    if (videoExtensions.includes(ext) && fs.statSync(filePath).isFile()) {
      const outputPath = path.join(outputDir, file);
      
      if (!fs.existsSync(outputPath)) {
        fs.copyFileSync(filePath, outputPath);
      }
    }
  }
}

async function generateOptimizedAssets() {
  
  await compressImages();
  await createOptimizedVideos();
  
}

// Run the optimization
generateOptimizedAssets().catch(console.error);
