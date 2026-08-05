import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';

const FOLDERS = [
  { value: 'general', label: 'Geral' },
  { value: 'articles', label: 'Artigos' },
  { value: 'hero', label: 'Heros' },
];

export default function Images() {
  const [folder, setFolder] = useState('general');
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ folder, ...(search ? { search } : {}) });
    const { images: list } = await api.get(`/images?${params}`);
    setImages(list);
  }, [folder, search]);

  useEffect(() => { load(); }, [load]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', folder);
      form.append('generateVariants', folder === 'hero' ? 'true' : 'false');
      await api.post('/images', form);
      await load();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function remove(img) {
    if (!window.confirm('Excluir esta imagem? Se ela estiver em uso em algum artigo ou hero, o link ficará quebrado.')) return;
    await api.delete(`/images/${img.id}`);
    await load();
  }

  return (
    <div>
      <div className="page-header">
        <h1>Biblioteca de imagens</h1>
        <label className="btn btn--primary">
          {uploading ? 'Enviando…' : '+ Enviar imagem'}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ display: 'none' }} />
        </label>
      </div>

      <div className="toolbar">
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {FOLDERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`btn btn--sm ${folder === f.value ? 'btn--primary' : 'btn--outline'}`}
              onClick={() => setFolder(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input type="search" placeholder="Pesquisar por nome do arquivo…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="image-grid">
        {images.map((img) => (
          <div className="image-tile" key={img.id}>
            <img src={img.url} alt={img.altText} />
            <div className="image-tile__meta">
              <span>{img.variant || 'original'}</span>
              <button type="button" onClick={() => remove(img)}>Excluir</button>
            </div>
          </div>
        ))}
        {images.length === 0 && <p style={{ color: 'var(--color-ink-faint)' }}>Nenhuma imagem encontrada.</p>}
      </div>
    </div>
  );
}
