/* Fade-in discreto ao entrar na viewport — nunca o motivo de algo acontecer, só reforço */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  items.forEach((el) => observer.observe(el));

  // Rede de segurança: se por algum motivo o observer nunca disparar
  // (aba em segundo plano, navegador atípico), o conteúdo não fica preso invisível.
  window.setTimeout(() => {
    items.forEach((el) => el.classList.add('is-visible'));
  }, 2500);
})();
