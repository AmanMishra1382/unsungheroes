let allSoldiers = [];

async function loadSoldiers() {
  try {
    allSoldiers = await apiGet('/api/soldiers');
    populateAwardFilter(allSoldiers);
    render(allSoldiers);
  } catch (err) {
    showStatus(`Could not reach the API. Is the backend running?`);
  }
}

function populateAwardFilter(soldiers) {
  const select = document.getElementById('awardFilter');
  const awards = [...new Set(soldiers.map(s => s.award_name).filter(Boolean))].sort();
  awards.forEach(award => {
    const opt = document.createElement('option');
    opt.value = award;
    opt.textContent = award;
    select.appendChild(opt);
  });
}

function render(soldiers) {
  const wall = document.getElementById('wall');
  const emptyState = document.getElementById('emptyState');
  wall.innerHTML = '';

  if (soldiers.length === 0) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;
  wall.innerHTML = soldiers.map(soldierCardHTML).join('');
}

function applyFilters() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const award = document.getElementById('awardFilter').value;

  const filtered = allSoldiers.filter(s => {
    const matchesQuery = !query ||
      s.name.toLowerCase().includes(query) ||
      s.regiment.toLowerCase().includes(query) ||
      (s.operation || '').toLowerCase().includes(query);
    const matchesAward = !award || s.award_name === award;
    return matchesQuery && matchesAward;
  });

  render(filtered);
}

document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('awardFilter').addEventListener('change', applyFilters);

loadSoldiers();
