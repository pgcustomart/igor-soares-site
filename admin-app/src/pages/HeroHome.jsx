import { useEffect, useState } from 'react';
import { api } from '../api/client';
import ImagePickerField from '../components/ImagePickerField';

export default function HeroHome() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { api.get('/hero/home').then((r) => setData(r.data)); }, []);

  function update(field, value) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const { id, updatedAt, ...payload } = data;
      const { data: saved } = await api.put('/hero/home', payload);
      setData(saved);
      setMessage({ type: 'ok', text: 'Hero da Home atualizada.' });
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
        <h1>Hero da Home</h1>
        <button className="btn btn--primary" disabled={saving} onClick={save}>{saving ? 'Salvando…' : 'Salvar alterações'}</button>
      </div>
      {message && <div className={`status-msg status-msg--${message.type}`}>{message.text}</div>}

      <div className="admin-card">
        <div className="form-row">
          <ImagePickerField label="Imagem desktop" value={data.desktopImage} onChange={(v) => update('desktopImage', v)} folder="hero" />
          <ImagePickerField label="Imagem mobile" value={data.mobileImage} onChange={(v) => update('mobileImage', v)} folder="hero" />
        </div>
        <div className="form-field">
          <label>Título (aceita <code>&lt;em&gt;</code> para destacar uma palavra)</label>
          <textarea value={data.title} onChange={(e) => update('title', e.target.value)} />
        </div>
        <div className="form-field">
          <label>Subtítulo</label>
          <textarea value={data.subtitle} onChange={(e) => update('subtitle', e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Texto do botão WhatsApp</label>
            <input type="text" value={data.whatsappLabel} onChange={(e) => update('whatsappLabel', e.target.value)} />
          </div>
          <div className="form-field">
            <label>Mensagem pré-preenchida do WhatsApp</label>
            <input type="text" value={data.whatsappMessage} onChange={(e) => update('whatsappMessage', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Texto do botão Agendar</label>
            <input type="text" value={data.scheduleLabel} onChange={(e) => update('scheduleLabel', e.target.value)} />
          </div>
          <div className="form-field">
            <label>Mensagem pré-preenchida do botão Agendar</label>
            <input type="text" value={data.scheduleMessage} onChange={(e) => update('scheduleMessage', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
