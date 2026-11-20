const photoGrid = document.querySelector('#album-photos');
const viewer = document.createElement('dialog');
viewer.className = 'album-viewer';
viewer.setAttribute('aria-label','Portrait agrandi');
viewer.innerHTML = '<button type="button" class="close" aria-label="Fermer">×</button><img alt=""><div class="album-tools"><button type="button" class="prev">Précédent</button><button type="button" class="next">Suivant</button></div>';
document.body.append(viewer);
let active = 0;
function enlarge(index) {
  const buttons = Array.from(photoGrid.querySelectorAll('.album-photo'));
  active = (index + buttons.length) % buttons.length;
  const thumb = buttons[active].querySelector('img'), full = viewer.querySelector('img');
  full.src = thumb.src;
  full.alt = thumb.alt;
  for (const button of viewer.querySelectorAll('.album-tools button')) button.hidden = buttons.length < 2;
}
photoGrid.addEventListener('click', e => {
  const button=e.target.closest('.album-photo');
  if (!button) return;
  enlarge(Array.from(photoGrid.children).indexOf(button));
  viewer.showModal();
});
viewer.querySelector('.close').addEventListener('click',()=>viewer.close());
viewer.querySelector('.prev').addEventListener('click',()=>enlarge(active-1));
viewer.querySelector('.next').addEventListener('click',()=>enlarge(active+1));
viewer.addEventListener('keydown',e=>{
  if(e.key==='ArrowLeft') enlarge(active-1);
  if(e.key==='ArrowRight') enlarge(active+1);
});
