import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';

export default function ImagePickerModal({ folder, generateVariants, onSelect, onClose }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    const { images: list } = await api.get(`/images?folder=${folder}`);
    setImages(list);
  }, [folder]);

  useEffect(() => { load(); }, [load]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', folder);
      form.append('generateVariants', generateVariants ? 'true' : 'false');
      const { images: created } = await api.post('/images', form);
      await load();
      if (created?.[0]) onSelect(created[0]);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Biblioteca de imagens</h2>
          <button className="btn btn--outline btn--sm" onClick={onClose}>Fechar</button>
        </div>

        <label className="btn btn--primary btn--sm" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
          {uploading ? 'Enviando…' : '+ Enviar nova imagem'}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ display: 'none' }} />
        </label>

        <div className="image-grid">
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              className="image-tile"
              style={{ border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              onClick={() => onSelect(img)}
            >
              <img src={img.url} alt={img.altText} />
              <div className="image-tile__meta"><span>{img.variant || 'original'}</span></div>
            </button>
          ))}
          {images.length === 0 && <p style={{ color: 'var(--color-ink-faint)' }}>Nenhuma imagem nesta pasta ainda.</p>}
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(20,18,15,0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '2rem',
};
const modalStyle = {
  background: '#fff', borderRadius: '12px', padding: '1.5rem', width: '100%', maxWidth: '760px',
  maxHeight: '80vh', overflowY: 'auto',
};
