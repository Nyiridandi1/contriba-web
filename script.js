const menuBtn = document.querySelector('.menu-btn');
const links = document.querySelector('.nav-links');
menuBtn?.addEventListener('click', () => {
  links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
  links.style.position = 'absolute';
  links.style.top = '76px';
  links.style.left = '0';
  links.style.right = '0';
  links.style.padding = '20px';
  links.style.borderRadius = '16px';
  links.style.background = 'rgba(120,0,0,.96)';
  links.style.flexDirection = 'column';
});
