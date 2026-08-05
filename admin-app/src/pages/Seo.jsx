import { useEffect, useState } from 'react';
import { api } from '../api/client';
import ImagePickerField from '../components/ImagePickerField';

export default function Seo() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { api.get('/seo').then((r) => setData(r.data)); }, []);

  function update(field, value) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const { id, updatedAt, ...payload } = data;
      const { data: saved } = await api.put('/seo', payload);
      setData(saved);
      setMessage({ type: 'ok', text: 'SEO atualizado.' });
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
        <h1>SEO</h1>
        <button className="btn btn--primary" disabled={saving} onClick={save}>{saving ? 'Salvando…' : 'Salvar alterações'}</button>
      </div>
      {message && <div className={`status-msg status-msg--${message.type}`}>{message.text}</div>}

      <div className="admin-card">
        <h2 style={{ fontSize: '1.05rem' }}>Home</h2>
        <div className="form-field">
          <label>Title</label>
          <input type="text" value={data.homeTitle} onChange={(e) => update('homeTitle', e.target.value)} />
        </div>
        <div className="form-field">
          <label>Description</label>
          <textarea value={data.homeDescription} onChange={(e) => update('homeDescription', e.target.value)} />
        </div>
        <ImagePickerField label="Imagem social (Open Graph)" value={data.homeOgImage} onChange={(v) => update('homeOgImage', v)} folder="general" />
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: '1.05rem' }}>Artigos (biblioteca)</h2>
        <div className="form-field">
          <label>Meta title</label>
          <input type="text" value={data.articlesMetaTitle} onChange={(e) => update('articlesMetaTitle', e.target.value)} />
        </div>
        <div className="form-field">
          <label>Meta description</label>
          <textarea value={data.articlesMetaDescription} onChange={(e) => update('articlesMetaDescription', e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Canonical</label>
            <input type="text" value={data.articlesCanonical} onChange={(e) => update('articlesCanonical', e.target.value)} />
          </div>
          <div className="form-field">
            <label>Robots</label>
            <select value={data.articlesRobots} onChange={(e) => update('articlesRobots', e.target.value)}>
              <option value="index, follow">index, follow</option>
              <option value="noindex, follow">noindex, follow</option>
              <option value="noindex, nofollow">noindex, nofollow</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
