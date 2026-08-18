const soldierId = getQueryParam('id');
let openCorrectionDialog;

async function loadSoldier() {
  if (!soldierId) {
    showStatus('No profile specified.');
    return;
  }

  try {
    const s = await apiGet(`/api/soldiers/${soldierId}`);
    render(s);
    hideStatus();
  } catch (err) {
    showStatus('Could not load this profile. Is the backend running?');
  }
}

function render(s) {
  document.getElementById('pageTitle').textContent = `${s.name} — Unsung Heroes`;
  document.getElementById('soldierName').textContent = s.name;
  document.getElementById('soldierRegiment').textContent = s.regiment;
  document.getElementById('soldierAward').textContent = s.award_name || 'Not listed';
  document.getElementById('soldierStatus').textContent = s.status === 'martyr' ? 'Martyr (Posthumous)' : 'Awardee';
  document.getElementById('soldierOperation').textContent = `${s.war_name || ''}${s.operation ? ' · ' + s.operation : ''}`;
  document.getElementById('soldierDate').textContent = s.date_of_action
    ? new Date(s.date_of_action).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Not recorded';

  const storyEl = document.getElementById('soldierStory');
  const story = s.full_story || s.citation || '';
  storyEl.innerHTML = story.split('\n\n').map(p => `<p>${p}</p>`).join('');

  const sourcesEl = document.getElementById('soldierSources');
  const sources = Array.isArray(s.sources) ? s.sources : [];
  sourcesEl.innerHTML = sources.map(url => `<li><a href="${url}" target="_blank" rel="noopener">${url}</a></li>`).join('')
    || '<li>No sources listed yet.</li>';

  document.getElementById('detail').hidden = false;
}

openCorrectionDialog = wireCorrectionDialog(() => soldierId);
document.getElementById('reportBtn').addEventListener('click', () => openCorrectionDialog(document.getElementById('soldierName').textContent));

loadSoldier();
