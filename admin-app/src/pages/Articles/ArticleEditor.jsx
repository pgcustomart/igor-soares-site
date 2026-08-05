import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/client';
import RichTextEditor from '../../components/RichTextEditor';
import ImagePickerField from '../../components/ImagePickerField';

const EMPTY = {
  title: '', slug: '', category: '', excerpt: '', coverImage: '', coverImageAlt: '',
  readingTimeMin: 5, bodyHtml: '', ctaTitle: 'Ainda está com dúvidas?',
  ctaText: 'Cada caso tem os detalhes que fazem diferença na estratégia a seguir. Conte o que aconteceu e entenda quais são os seus direitos.',
  seoTitle: '', seoDescription: '', canonicalUrl: '', robots: 'index, follow', ogImage: '',
  faqs: [], relatedIds: [], status: 'DRAFT',
};

export default function ArticleEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [article, setArticle] = useState(EMPTY);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [slugTouched, setSlugTouched] = useState(!isNew);

  const load = useCallback(async () => {
    const { articles } = await api.get('/articles');
    setAllArticles(articles);
    if (!isNew) {
      const { article: a } = await api.get(`/articles/${id}`);
      setArticle({ ...a, relatedIds: a.relatedFrom.map((r) => r.relatedArticleId) });
    }
    setLoading(false);
  }, [id, isNew]);

  useEffect(() => { load(); }, [load]);

  function update(field, value) {
    setArticle((prev) => ({ ...prev, [field]: value }));
  }

  function handleTitleChange(title) {
    setArticle((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : title.toLowerCase().trim()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  }

  async function save(nextStatus) {
    setSaving(true);
    setMessage(null);
    try {
      const payload = { ...article, status: nextStatus || article.status };
      delete payload.relatedFrom;
      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.publishedAt;

      let saved;
      if (isNew) {
        ({ article: saved } = await api.post('/articles', payload));
        setMessage({ type: 'ok', text: 'Artigo criado.' });
        navigate(`/artigos/${saved.id}`, { replace: true });
      } else {
        ({ article: saved } = await api.put(`/articles/${id}`, payload));
        setMessage({ type: 'ok', text: 'Alterações salvas.' });
      }
      setArticle({ ...saved, relatedIds: saved.relatedFrom.map((r) => r.relatedArticleId) });
    } catch (err) {
      setMessage({ type: 'error', text: 'Não foi possível salvar. Verifique os campos obrigatórios.' });
    } finally {
      setSaving(false);
    }
  }

  function addFaq() {
    update('faqs', [...article.faqs, { question: '', answer: '' }]);
  }
  function updateFaq(i, field, value) {
    const next = [...article.faqs];
    next[i] = { ...next[i], [field]: value };
    update('faqs', next);
  }
  function removeFaq(i) {
    update('faqs', article.faqs.filter((_, idx) => idx !== i));
  }

  function toggleRelated(relatedId) {
    const set = new Set(article.relatedIds);
    if (set.has(relatedId)) set.delete(relatedId); else if (set.size < 3) set.add(relatedId);
    update('relatedIds', [...set]);
  }

  if (loading) return <p>Carregando…</p>;

  return (
    <div>
      <div className="page-header">
        <h1>{isNew ? 'Novo artigo' : 'Editar artigo'}</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn--outline" disabled={saving} onClick={() => save('DRAFT')}>Salvar rascunho</button>
          <button className="btn btn--primary" disabled={saving} onClick={() => save('PUBLISHED')}>
            {article.status === 'PUBLISHED' ? 'Salvar' : 'Publicar'}
          </button>
        </div>
      </div>

      {message && <div className={`status-msg status-msg--${message.type}`}>{message.text}</div>}

      <div className="admin-card">
        <div className="form-field">
          <label>Título</label>
          <input type="text" value={article.title} onChange={(e) => handleTitleChange(e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Slug (URL)</label>
            <input type="text" value={article.slug} onChange={(e) => { setSlugTouched(true); update('slug', e.target.value); }} />
            <small>/artigos/{article.slug || '...'}/</small>
          </div>
          <div className="form-field">
            <label>Categoria</label>
            <input type="text" value={article.category} onChange={(e) => update('category', e.target.value)} placeholder="Ex.: Jornada de Trabalho" />
          </div>
        </div>
        <div className="form-field">
          <label>Resumo (aparece nos cards e como texto de abertura)</label>
          <textarea value={article.excerpt} onChange={(e) => update('excerpt', e.target.value)} />
        </div>
        <div className="form-row">
          <ImagePickerField label="Imagem de capa" value={article.coverImage} onChange={(v) => update('coverImage', v)} folder="articles" />
          <div className="form-field">
            <label>Texto alternativo da imagem</label>
            <input type="text" value={article.coverImageAlt} onChange={(e) => update('coverImageAlt', e.target.value)} />
            <div style={{ marginTop: '0.75rem' }}>
              <label>Tempo de leitura (minutos)</label>
              <input type="number" min="1" max="60" value={article.readingTimeMin} onChange={(e) => update('readingTimeMin', parseInt(e.target.value, 10) || 1)} />
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: '1.05rem' }}>Corpo do artigo</h2>
        <RichTextEditor value={article.bodyHtml} onChange={(html) => update('bodyHtml', html)} />
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: '1.05rem' }}>Perguntas frequentes</h2>
        {article.faqs.map((faq, i) => (
          <div className="faq-row" key={i}>
            <div className="faq-row__head">
              <strong>Pergunta {i + 1}</strong>
              <button className="btn btn--danger btn--sm" type="button" onClick={() => removeFaq(i)}>Remover</button>
            </div>
            <input type="text" placeholder="Pergunta" value={faq.question} onChange={(e) => updateFaq(i, 'question', e.target.value)} />
            <textarea placeholder="Resposta" value={faq.answer} onChange={(e) => updateFaq(i, 'answer', e.target.value)} />
          </div>
        ))}
        <button className="btn btn--outline btn--sm" type="button" onClick={addFaq}>+ Adicionar pergunta</button>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: '1.05rem' }}>CTA final</h2>
        <div className="form-field">
          <label>Título do CTA</label>
          <input type="text" value={article.ctaTitle} onChange={(e) => update('ctaTitle', e.target.value)} />
        </div>
        <div className="form-field">
          <label>Texto do CTA</label>
          <textarea value={article.ctaText} onChange={(e) => update('ctaText', e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: '1.05rem' }}>Artigos relacionados (até 3)</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {allArticles.filter((a) => a.id !== article.id).map((a) => (
            <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--color-border)', borderRadius: 6, padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={article.relatedIds.includes(a.id)} onChange={() => toggleRelated(a.id)} />
              {a.title}
            </label>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: '1.05rem' }}>SEO</h2>
        <div className="form-field">
          <label>Meta título</label>
          <input type="text" value={article.seoTitle} onChange={(e) => update('seoTitle', e.target.value)} placeholder={article.title ? `${article.title} | Igor Soares Advogado` : ''} />
        </div>
        <div className="form-field">
          <label>Meta descrição</label>
          <textarea value={article.seoDescription} onChange={(e) => update('seoDescription', e.target.value)} placeholder={article.excerpt} />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>URL canônica</label>
            <input type="text" value={article.canonicalUrl} onChange={(e) => update('canonicalUrl', e.target.value)} placeholder={`https://igorsoares.adv.br/artigos/${article.slug}/`} />
          </div>
          <div className="form-field">
            <label>Robots</label>
            <select value={article.robots} onChange={(e) => update('robots', e.target.value)}>
              <option value="index, follow">index, follow</option>
              <option value="noindex, follow">noindex, follow</option>
              <option value="noindex, nofollow">noindex, nofollow</option>
            </select>
          </div>
        </div>
        <ImagePickerField label="Imagem de compartilhamento (Open Graph)" value={article.ogImage} onChange={(v) => update('ogImage', v)} folder="articles" />
      </div>
    </div>
  );
}
