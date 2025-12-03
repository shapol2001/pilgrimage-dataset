fetch('pilgrims.csv')
  .then(response => response.text())
  .then(text => {
    const rows = text.split('\n').map(r => r.split(','));
    const header = rows[0];
    const yearIndex = header.indexOf("Дата посещения Святой земли");
    const years = rows.slice(1).map(r => r[yearIndex]).filter(y => y);

    const counts = {};
    years.forEach(y => counts[y] = (counts[y] || 0) + 1);

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    const ctx = document.getElementById('chartYears').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Количество паломнических записок по годам',
          data: data
        }]
      }
    });
  });
