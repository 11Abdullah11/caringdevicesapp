$(document).ready(function () {
  var timeData = [0,1,2,3,4,5],
    temperatureData = [],
    ecgData = [];
  var startDate = new Date();
  var data = {
    labels: timeData,
    datasets: [
       {
        fill: false,
        label: 'ECG',
        yAxisID: 'ECG',
	lineTension: 0,
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: ecgData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'ECG Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
          id: 'ECG',
          type: 'linear',
          scaleLabel: {
            labelString: 'ECG(mV)',
            display: true
          },
     elements: {
       line: {
          tension: 0, // disables bezier curves
       }
      }
    }],
	xAxes: [{
		ticks: {
			stepSize: 1,
			unitStepSize: 2
		}
	
	}]

  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('1Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.ecg) {
        return;
      }
      var rtime = obj.time;
      var time = timeData[timeData.length-1];
      console.log(typeof(rtime));
      var ecgarr = obj.ecg;
      for (var i=0;i<ecgarr.length;i++){
	var d = new Date();
	var n = d.getTime() - startDate.getTime();
        ecgData.push(ecgarr[i]);
        timeData.push(n/1000);
      }
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        ecgData.shift();
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
