const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  nav.classList.toggle('open', open);
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenu(false);
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) setMenu(false);
});
const navLinks = [...nav.querySelectorAll('a')];
function markSection() {
  const offset = window.innerHeight * .4;
  let active = navLinks[0];
  for (const link of navLinks) {
    if (document.querySelector(link.hash).getBoundingClientRect().top <= offset) active = link;
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) active = navLinks.at(-1);
  for (const link of navLinks) {
    if (link === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
window.addEventListener('scroll', markSection, {passive:true});
markSection();
const dialog = document.querySelector('#fabric-dialog');
for (const swatch of document.querySelectorAll('.swatch')) {
  swatch.addEventListener('click', () => {
    const family = swatch.querySelector('small').textContent;
    const name = swatch.querySelector('strong').textContent;
    const photo = dialog.querySelector('img');
    photo.src = 'assets/' + swatch.dataset.fabric + '.webp';
    photo.alt = 'Détail du motif de pagne, ' + name.toLowerCase();
    dialog.querySelector('#fabric-name').textContent = name;
    dialog.querySelector('#fabric-family').textContent = family;
    dialog.showModal();
  });
}
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog && !event.target.closest('button')) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }
});

function loadNearSection(section, load) {
  if (!('IntersectionObserver' in window)) {
    load();
    return;
  }
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      observer.disconnect();
      load();
    }
  }, {rootMargin: '400px'});
  observer.observe(section);
}
