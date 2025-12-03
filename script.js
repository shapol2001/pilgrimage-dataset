// Функция для корректного парсинга CSV с кавычками и запятыми
function parseCSV(text) {
  const rows = [];
  const lines = text.trim().split('\n');
  for (let line of lines) {
    const row = [];
    let cell = '';
    let insideQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes; // переключаем флаг внутри кавычек
      } else if (char === ',' && !insideQuotes) {
        row.push(cell.trim());
        cell = '';
      } else {
        cell += char;
      }
    }
    row.push(cell.trim());
    rows.push(row);
  }
  return rows;
}

// Загружаем CSV
fetch('pilgrims.csv')
  .then(response => response.text())
  .then(text => {
    const rows = parseCSV(text); // Используем новую функцию
    const header = rows[0];

    // Индексы колонок
    const yearIndex = header.indexOf("Дата посещения Святой земли");
    const roleIndex = header.indexOf("Род деятельности на момент публикации текста");
    const journalIndex = header.indexOf("Журнал");

    // Создаём HTML-таблицу
    const tableContainer = document.getElementById('table-container');
    let html = '<table><tr>';
    header.forEach(h => html += `<th>${h}</th>`);
    html += '</tr>';
    rows.slice(1).forEach(r => {
      html += '<tr>';
      r.forEach(c => html += `<td>${c}</td>`);
      html += '</tr>';
    });
    html += '</table>';
    tableContainer.innerHTML = html;

    // Собираем данные для графиков
    const years = [], roles = [], journals = [];
    rows.slice(1).forEach(r => {
      if (r[yearIndex]) years.push(r[yearIndex]);
      if (r[roleIndex]) roles.push(r[roleIndex]);
      if (r[journalIndex]) journals.push(r[journalIndex]);
    });

    function countItems(array) {
      return array.reduce((acc, val) => { acc[val] = (acc[val] || 0) + 1; return acc; }, {});
    }

    const countsYears = countItems(years);
    const countsRoles = countItems(roles);
    const countsJournals = countItems(journals);

    function drawChart(canvasId, labels, data, label, type='bar') {
      const ctx = document.getElementById(canvasId).getContext('2d');
      new Chart(ctx, {
        type: type,
        data: { labels: labels, datasets: [{ label: label, data: data, backgroundColor: 'rgba(54, 162, 235, 0.6)' }] },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    // Рисуем графики
    drawChart('chartYears', Object.keys(countsYears), Object.values(countsYears), 'Количество записок');
    drawChart('chartRoles', Object.keys(countsRoles), Object.values(countsRoles), 'Количество авторов');
    drawChart('chartJournals', Object.keys(countsJournals), Object.values(countsJournals), 'Количество записок');
  })
  .catch(err => console.error('Ошибка при загрузке CSV:', err));
