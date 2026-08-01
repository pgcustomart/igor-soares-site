/* FAQ — um item aberto por vez, acessível via aria-expanded */
(function () {
  const list = document.getElementById('faq-list');
  if (!list) return;

  const items = Array.from(list.querySelectorAll('.faq-item'));

  items.forEach((item) => {
    const trigger = item.querySelector('.faq-item__trigger');

    trigger.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';

      items.forEach((other) => {
        other.setAttribute('data-open', 'false');
        other.querySelector('.faq-item__trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
