//This script draws and updates the graph. It is made possible by the chart.js library.
//visit their website for the documentation
let ctx = document.getElementById('graphCanvas').getContext('2d');
let stackedBar = new Chart(ctx, {
    type: 'line',
    data: {
      labels:[' '],
      datasets:[
        {
          label:'Infected',
          data:[0],
          backgroundColor: '#ff2166',
          pointRadius: 0
        },
        {
          label:'Healthy',
          data:[0],
          backgroundColor: '#4370c3',
          pointRadius: 0
        },
        {
          label:'Immune',
          data:[0],
          backgroundColor: '#00c4ff',
          pointRadius: 0
        }
      ]
    },
    options: {
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [{ stacked: true }]
      }
    }
});

Chart.defaults.global.defaultFontColor = 'white';

function updateGraph(){
  iteration++;
  if(document.getElementById('lowerQuality-check').checked){
    if(iteration % 3 == 0) {
      stackedBar.data.labels[iteration/3] = " ";
      stackedBar.data.datasets[0].data[iteration/3] = infectedCount;
      stackedBar.data.datasets[1].data[iteration/3] = healthyCount - immuneCount;
      stackedBar.data.datasets[2].data[iteration/3] = immuneCount;
      stackedBar.update(0);
    }
  }else{
    stackedBar.data.labels[iteration] = " ";
    stackedBar.data.datasets[0].data[iteration] = infectedCount;
    stackedBar.data.datasets[1].data[iteration] = healthyCount - immuneCount;
    stackedBar.data.datasets[2].data[iteration] = immuneCount;
    stackedBar.update(0);
  }
}
