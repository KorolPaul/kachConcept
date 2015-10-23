window.onload = function () {
    var stats = document.getElementById('stats');

    if (localStorage.stats !== undefined) {
        stats.innerHTML = localStorage.stats;
    }

    var cells = stats.querySelectorAll('td');
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener('input', saveStats, false);
    }

    generatePlots();
}

function saveStats() {
    localStorage.stats = stats.innerHTML;
    document.getElementById('plots').innerHTML = '';
    generatePlots();
}

function drawPlot(title, index) {
    var plotItem = document.createElement('div'),
        plotHolder = document.createElement('div');

    plotItem.classList.add('plots_item');
    plotHolder.classList.add('plots_holder');
    plotItem.innerHTML = '<h2 class="plots_header">' + title + '</h2>';

    plotItem.appendChild(plotHolder);
    document.getElementById('plots').appendChild(plotItem);

    var tableData = document.querySelectorAll('.statistics tr:nth-child(' + index + ') td:not(.chart-name)'),
        stats = [['Месяц', title]];

    for (var i = 0; i < tableData.length; i++) {
        stats.push([i + 1, parseInt(tableData[i].textContent)]);
    }

    var data = new google.visualization.arrayToDataTable(stats);
    var options = {
        height: 400,
        curveType: 'function',
        legend: 'none',
        animation: {
            duration: 1000,
            easing: 'out',
            startup: true
        }
    };

    var chart = new google.visualization.LineChart(plotHolder);
    chart.draw(data, options);
}

function generatePlots() {
    var plots = document.getElementsByClassName('chart-name');
    for (var i = 0; i < plots.length; i++) {
        drawPlot(plots[i].textContent, i + 1);
    }
}