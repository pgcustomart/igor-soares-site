const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');
const sharp = require('sharp');
const prisma = require('../db/prisma');

const UPLOADS_ROOT = path.join(__dirname, '..', '..', 'uploads');
const ALLOWED_FOLDERS = new Set(['articles', 'hero', 'general']);

function safeFolder(folder) {
  return ALLOWED_FOLDERS.has(folder) ? folder : 'general';
}

function slugName(originalName) {
  const base = path.parse(originalName).name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const unique = crypto.randomBytes(4).toString('hex');
  return `${base || 'imagem'}-${unique}`;
}

/**
 * Converts an uploaded buffer to optimized WEBP, optionally producing
 * desktop/mobile variants (used for hero images which have distinct crops).
 */
async function processUpload({ buffer, originalName, folder, generateVariants }) {
  const targetFolder = safeFolder(folder);
  const dir = path.join(UPLOADS_ROOT, targetFolder);
  await fs.mkdir(dir, { recursive: true });

  const name = slugName(originalName);
  const results = [];

  const base = sharp(buffer).rotate();
  const meta = await base.metadata();

  async function writeVariant(variantLabel, resizeWidth) {
    const filename = variantLabel ? `${name}-${variantLabel}.webp` : `${name}.webp`;
    const filePath = path.join(dir, filename);
    let pipeline = sharp(buffer).rotate().webp({ quality: 82 });
    if (resizeWidth && meta.width && meta.width > resizeWidth) {
      pipeline = pipeline.resize({ width: resizeWidth });
    }
    const info = await pipeline.toFile(filePath);
    const stat = await fs.stat(filePath);
    const url = `/uploads/${targetFolder}/${filename}`;

    const image = await prisma.image.create({
      data: {
        filename,
        url,
        variant: variantLabel || '',
        altText: '',
        width: info.width,
        height: info.height,
        sizeBytes: stat.size,
        folder: targetFolder,
      },
    });
    results.push(image);
  }

  if (generateVariants) {
    await writeVariant('desktop', 1920);
    await writeVariant('mobile', 900);
  } else {
    await writeVariant(null, 2400);
  }

  return results;
}

async function listImages({ folder, search }) {
  return prisma.image.findMany({
    where: {
      ...(folder ? { folder: safeFolder(folder) } : {}),
      ...(search ? { filename: { contains: search, mode: 'insensitive' } } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function deleteImage(id) {
  const image = await prisma.image.findUnique({ where: { id } });
  if (!image) return false;
  const filePath = path.join(UPLOADS_ROOT, image.folder, image.filename);
  await fs.rm(filePath, { force: true });
  await prisma.image.delete({ where: { id } });
  return true;
}

module.exports = { processUpload, listImages, deleteImage, UPLOADS_ROOT };
