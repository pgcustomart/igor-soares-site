import { useEffect, useState } from 'react';
import { api } from '../api/client';
import ImagePickerField from '../components/ImagePickerField';

export default function HeroArtigos() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { api.get('/hero/articles').then((r) => setData(r.data)); }, []);

  function update(field, value) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const { id, updatedAt, ...payload } = data;
      const { data: saved } = await api.put('/hero/articles', payload);
      setData(saved);
      setMessage({ type: 'ok', text: 'Hero de Artigos atualizada.' });
    } catch {
      setMessage({ type: 'error', text: 'Não foi possível salvar.' });
    } finally {
      setSaving(false);
    }
  }

  if (!data) return <p>Carregando…</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Hero da página de Artigos</h1>
        <button className="btn btn--primary" disabled={saving} onClick={save}>{saving ? 'Salvando…' : 'Salvar alterações'}</button>
      </div>
      {message && <div className={`status-msg status-msg--${message.type}`}>{message.text}</div>}

      <div className="admin-card">
        <div className="form-row">
          <ImagePickerField label="Imagem desktop" value={data.desktopImage} onChange={(v) => update('desktopImage', v)} folder="hero" />
          <ImagePickerField label="Imagem mobile" value={data.mobileImage} onChange={(v) => update('mobileImage', v)} folder="hero" />
        </div>
        <div className="form-field">
          <label>Título</label>
          <input type="text" value={data.title} onChange={(e) => update('title', e.target.value)} />
        </div>
        <div className="form-field">
          <label>Descrição</label>
          <textarea value={data.description} onChange={(e) => update('description', e.target.value)} />
        </div>
      </div>
    </div>
  );
}
