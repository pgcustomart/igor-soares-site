/*
  Header inteligente: ganha fundo sólido após sair do topo,
  esconde ao rolar para baixo e reaparece ao rolar para cima.
*/
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;

  const SCROLL_THRESHOLD = 24;
  let lastY = window.scrollY;
  let ticking = false;

  function update() {
    const y = window.scrollY;

    header.classList.toggle('is-scrolled', y > SCROLL_THRESHOLD);

    const scrollingDown = y > lastY && y > header.offsetHeight;
    header.classList.toggle('is-hidden', scrollingDown);

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();
