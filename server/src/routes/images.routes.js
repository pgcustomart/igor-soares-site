const express = require('express');
const multer = require('multer');
const { requireAuth } = require('../middleware/auth');
const { processUpload, listImages, deleteImage } = require('../services/images.service');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      return cb(new Error('unsupported_file_type'));
    }
    cb(null, true);
  },
});

router.use(requireAuth);

router.get('/', async (req, res) => {
  const { folder, search } = req.query;
  const images = await listImages({ folder, search });
  res.json({ images });
});

router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'missing_file' });
    const folder = req.body.folder || 'general';
    const generateVariants = req.body.generateVariants === 'true';
    const images = await processUpload({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      folder,
      generateVariants,
    });
    res.status(201).json({ images });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res) => {
  const ok = await deleteImage(req.params.id);
  if (!ok) return res.status(404).json({ error: 'not_found' });
  res.json({ ok: true });
});

module.exports = router;
