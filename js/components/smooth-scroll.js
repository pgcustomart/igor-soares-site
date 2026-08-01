/* Fecha o menu mobile ao clicar em um link de âncora (a rolagem suave vem do CSS) */
(function () {
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const header = document.getElementById('site-header');
  if (!toggle || !mobileNav) return;

  function closeMenu() {
    mobileNav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (header) header.classList.remove('menu-open');
  }

  toggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (header) header.classList.toggle('menu-open', isOpen);
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
})();
