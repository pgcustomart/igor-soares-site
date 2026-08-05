import { useState } from 'react';
import ImagePickerModal from './ImagePickerModal';

export default function ImagePickerField({ label, value, onChange, folder = 'general', generateVariants = false }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="form-field">
      <label>{label}</label>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden', background: 'var(--color-gray-light)', flexShrink: 0, border: '1px solid var(--color-border)' }}>
          {value && <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
        <div>
          <button type="button" className="btn btn--outline btn--sm" onClick={() => setOpen(true)}>Selecionar imagem</button>
          {value && <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-faint)', margin: '0.4rem 0 0', wordBreak: 'break-all' }}>{value}</p>}
        </div>
      </div>
      {open && (
        <ImagePickerModal
          folder={folder}
          generateVariants={generateVariants}
          onClose={() => setOpen(false)}
          onSelect={(img) => { onChange(img.url); setOpen(false); }}
        />
      )}
    </div>
  );
}
