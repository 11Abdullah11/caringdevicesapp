$(document).ready(function () {
  var timeData = [],
    ecgTime = [],
	temperatureData = [],
    ecgData = [];
  var startDate = new Date();
  var data = {
    labels: ecgTime,
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
 	xAxes: [{
		gridLines: {
		 zeroLineColor: "black",
		 zeroLineWidth: 2,
		 display: true
      },
    ticks: {
		min: 5,
		max: 10,
	    stepSize: 2
		},
	scaleLabel: {
		display: true,
 		labelString: "Time in Seconds",
        fontColor: "red"
	}/*,
	ticks: {
		autoSkip: false,
		min: 5,
		max: 30
	},
	afterBuildTicks: function(scale){
		scale.ticks = [];
		scale.ticks.push(0);	
		scale.ticks.push(1);
		scale.ticks.push(2);
		scale.ticks.push(5);	
	}*/		
	}],
    yAxes: [{
          id: 'ECG',
          type: 'linear',
          scaleLabel: {
            labelString: 'ECG(mV)',
            display: true
          },
	 }]
  }
  }
 
  var tempData = {
    labels: timeData,
    datasets: [
       {
        fill: false,
        label: 'temperature',
        yAxisID: 'temperature',
		lineTension: 0,
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: temperatureData
      }
    ]
  }

  var tempOption = {
    title: {
      display: true,
      text: 'Temperature ',
      fontSize: 36
    },
    scales: {
     yAxes: [{
          id: 'temperature',
          type: 'linear',
          scaleLabel: {
            labelString: 'T(C)',
            display: true
          }
	 }]
  }
  }

  

	//Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var tempctx = document.getElementById("tempChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });
  var tempChart = new Chart(tempctx,{
	type: 'line',
	data: tempData,
	options: tempOption
  
  });
  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('1Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.ecg) {
        return;
      }
      var time = timeData[timeData.length-1];
	  var d = new Date();
	  var n = d.getTime() - startDate.getTime();
	  timeData.push(Math.floor(n/1000));


	  temperatureData.push(obj.temperature);
	  var ecgarr = obj.ecg;
      for (var i=0;i<ecgarr.length;i++){
		  ecgData.push(ecgarr[i]);
	      var n = d.getTime() - startDate.getTime();
	      ecgTime.push(Math.floor(n/1000));


	  }
		  // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = ecgTime.length;
      if (len > maxLen) {
        ecgTime.shift();
        ecgData.shift();
	  }
	  if (tempData.length>maxLen){
	  temperatureData.shift();
	  timeData.shift();
	  }

	  tempChart.update();
      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
