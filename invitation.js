const form = document.querySelector('#book-form');
const feedback = document.querySelector('#book-feedback');
const list = document.querySelector('#book-list');
const more = document.querySelector('#more-notes');
const emptyBook = document.querySelector('#book-empty');
document.querySelector('#write-first-note').addEventListener('click', () => form.elements.namedItem('name').focus());
const showed = new Set();
let nextPage = '';
let loading = false;
let submissionId;
function showNote(entry, prepend = false) {
  if (showed.has(entry.id)) return;
  showed.add(entry.id);
  const article = document.createElement('article');
  article.className = 'book-card';
  const signature = document.createElement('strong');
  signature.textContent = entry.name || 'Message non signé';
  if (entry.note) {
    const note = document.createElement('p');
    note.textContent = entry.note;
    article.append(note);
  }
  article.append(signature);
  emptyBook.hidden = true;
  if (prepend) list.prepend(article); else list.append(article);
  list.parentElement.hidden = false;
}
async function loadNotes() {
  if (loading) return;
  loading = true;
  more.disabled = true;
  try {
    const response = await fetch('https://serge-et-liliane-2027.statelycrest9.chatgpt.site/api/livre-or?cursor='+encodeURIComponent(nextPage));
    if (!response.ok) throw Error();
    const page = await response.json();
    page.entries.forEach(entry => showNote(entry));
    nextPage = page.cursor || '';
    list.parentElement.hidden = false;
    emptyBook.hidden = showed.size > 0 || Boolean(nextPage);
    more.hidden = !nextPage;
    more.textContent = 'Voir les messages suivants';
  } catch {
    list.parentElement.hidden = false;
    more.hidden = false;
    more.textContent = 'Réessayer de charger les messages';
  } finally { more.disabled = false; loading = false; }
}
more.addEventListener('click',loadNotes);
loadNearSection(document.querySelector('#livre-or'), loadNotes);
form.addEventListener('input', () => { submissionId = undefined; });
form.addEventListener('submit', async event => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get('name').trim();
  if (!name) {
    feedback.textContent = 'Indiquez votre prénom ou votre nom pour signer votre message.';
    form.elements.namedItem('name').focus();
    return;
  }
  const note=data.get('note').trim();
  if (!note) { feedback.textContent='Écrivez quelques mots avant d’envoyer votre message.'; return; }
  if (!submissionId) submissionId = (9999999999999-Date.now())+'-'+crypto.randomUUID();

  form.querySelectorAll('input,textarea,button').forEach(el => el.disabled = true);
  feedback.textContent='Enregistrement en cours…';
  try {
    const response = await fetch('https://serge-et-liliane-2027.statelycrest9.chatgpt.site/api/livre-or', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:submissionId,name,note})});
    const result = await response.json();
    if (!response.ok) throw Error(result.error || 'Enregistrement impossible.');
    showNote(result,true);
    form.reset();
    submissionId = undefined;
    feedback.textContent='Merci, votre souvenir a été ajouté au livre d’or.';
  } catch(error) {
    feedback.textContent = error instanceof SyntaxError || error instanceof TypeError ? 'Envoi interrompu. Votre message est toujours ici, vous pouvez réessayer.' : error.message;
  } finally { form.querySelectorAll('input,textarea,button').forEach(el => el.disabled = false); }
});
