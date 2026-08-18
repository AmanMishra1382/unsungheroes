const warId = getQueryParam('id');

async function loadWarPage() {
  if (!warId) {
    showStatus('No war specified.');
    return;
  }

  try {
    const [wars, soldiers] = await Promise.all([
      apiGet('/api/wars'),
      apiGet(`/api/soldiers?war=${warId}`)
    ]);

    const war = wars.find(w => String(w.id) === String(warId));
    if (war) {
      document.getElementById('pageTitle').textContent = `${war.name} — Unsung Heroes`;
      document.getElementById('warYears').textContent =
        `${war.year_start}${war.year_end && war.year_end !== war.year_start ? '–' + war.year_end : ''}`;
      document.getElementById('warName').textContent = war.name;
      document.getElementById('warDescription').textContent = war.description || '';
    }

    renderSoldiers(soldiers);
  } catch (err) {
    showStatus('Could not reach the API. Is the backend running?');
  }
}

function renderSoldiers(soldiers) {
  const wall = document.getElementById('wall');
  const emptyState = document.getElementById('emptyState');

  if (soldiers.length === 0) {
    emptyState.hidden = false;
    wall.innerHTML = '';
    return;
  }
  emptyState.hidden = true;
  wall.innerHTML = soldiers.map(soldierCardHTML).join('');
}

loadWarPage();
