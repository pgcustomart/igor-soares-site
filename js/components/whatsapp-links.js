/*
  Monta os links wa.me a partir de um único número central (data-whatsapp
  no <body>) e de uma mensagem contextual por botão (data-wa-message).
  Trocar o número real em um só lugar atualiza todos os CTAs do site.
*/
(function () {
  const phone = document.body.getAttribute('data-whatsapp');
  if (!phone) return;

  const links = document.querySelectorAll('.js-whatsapp');

  links.forEach((link) => {
    const message = link.getAttribute('data-wa-message') || '';
    const url = 'https://wa.me/' + phone + (message ? '?text=' + encodeURIComponent(message) : '');
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  });
})();
