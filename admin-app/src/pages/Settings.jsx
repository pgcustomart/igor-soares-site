import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function Settings() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { api.get('/settings').then((r) => setData(r.data)); }, []);

  function update(field, value) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const { id, updatedAt, ...payload } = data;
      const { data: saved } = await api.put('/settings', payload);
      setData(saved);
      setMessage({ type: 'ok', text: 'Configurações atualizadas.' });
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
        <h1>Configurações do site</h1>
        <button className="btn btn--primary" disabled={saving} onClick={save}>{saving ? 'Salvando…' : 'Salvar alterações'}</button>
      </div>
      {message && <div className={`status-msg status-msg--${message.type}`}>{message.text}</div>}

      <div className="admin-card">
        <div className="form-row">
          <div className="form-field">
            <label>Telefone (exibido no site)</label>
            <input type="text" value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(21) 99404-5454" />
          </div>
          <div className="form-field">
            <label>WhatsApp (somente números, com DDI+DDD)</label>
            <input type="text" value={data.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} placeholder="5521994045454" />
            <small>Usado em todos os botões "Falar no WhatsApp" do site.</small>
          </div>
        </div>
        <div className="form-field">
          <label>E-mail</label>
          <input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Endereço</label>
            <input type="text" value={data.address} onChange={(e) => update('address', e.target.value)} />
          </div>
          <div className="form-field">
            <label>Complemento (sala, andar)</label>
            <input type="text" value={data.addressComplement} onChange={(e) => update('addressComplement', e.target.value)} />
          </div>
        </div>
        <div className="form-field">
          <label>Horário de atendimento</label>
          <input type="text" value={data.hours} onChange={(e) => update('hours', e.target.value)} placeholder="Segunda a sexta, 09h às 18h" />
        </div>
        <div className="form-field">
          <label>URL de incorporação do Google Maps</label>
          <input type="text" value={data.googleMapsUrl} onChange={(e) => update('googleMapsUrl', e.target.value)} />
          <small>Link no formato https://maps.google.com/maps?...&output=embed</small>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Instagram (URL)</label>
            <input type="url" value={data.instagram} onChange={(e) => update('instagram', e.target.value)} placeholder="https://instagram.com/..." />
          </div>
          <div className="form-field">
            <label>LinkedIn (URL)</label>
            <input type="url" value={data.linkedin} onChange={(e) => update('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
          </div>
        </div>
        <div className="form-field">
          <label>OAB</label>
          <input type="text" value={data.oab} onChange={(e) => update('oab', e.target.value)} placeholder="OAB/RJ nº 000.000" />
        </div>
      </div>
    </div>
  );
}
