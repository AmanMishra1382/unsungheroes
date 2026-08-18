async function loadWars() {
  try {
    const wars = await apiGet('/api/wars');
    render(wars);
  } catch (err) {
    showStatus('Could not reach the API. Is the backend running?');
  }
}

function render(wars) {
  const grid = document.getElementById('warGrid');
  grid.innerHTML = wars.map(w => `
    <a class="war-card" href="war.html?id=${w.id}">
      <p class="years">${w.year_start}${w.year_end && w.year_end !== w.year_start ? '–' + w.year_end : ''}</p>
      <h2>${w.name}</h2>
      <p>${w.description || ''}</p>
    </a>
  `).join('');
}

loadWars();
