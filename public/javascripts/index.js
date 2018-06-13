$(document).ready(function () {
        var presentTemp;
  function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


  //Charts Init
  var ecgChart = new SmoothieChart({
  millisPerPixel:10,interpolation:'linear',
  scaleSmoothing:0.325,
  grid:{
    fillStyle:'#ffffff',strokeStyle:'rgba(119,119,119,0.13)',
    sharpLines:true,verticalSections:14},
    labels:{fillStyle:'#800080'},
    tooltip:true,
    maxValue:1000,minValue:0,
  timestampFormatter:SmoothieChart.timeFormatter
  });

  var temperatureChart = new SmoothieChart({
  millisPerPixel:80,
  maxValueScale:0.85,
  minValueScale:0.8,
  interpolation:'linear',
  scaleSmoothing:0.207,
  grid:{fillStyle:'#ffffff',strokeStyle:'rgba(119,119,119,0.28)',
    sharpLines:true,millisPerLine:7000,verticalSections:14},
        labels:{fillStyle:'#800080'},
    tooltip:true,
    maxValue:60,minValue:0,
  timestampFormatter:SmoothieChart.timeFormatter
  });

  var anglesChart = new SmoothieChart({
  millisPerPixel:80,
  maxValueScale:0.85,
  minValueScale:0.8,
  interpolation:'linear',
  scaleSmoothing:0.207,
  grid:{fillStyle:'#ffffff',strokeStyle:'rgba(119,119,119,0.28)',
    sharpLines:true,millisPerLine:7000,verticalSections:14},
        labels:{fillStyle:'#800080'},
    tooltip:true,
    maxValue:65536,minValue:0,
  timestampFormatter:SmoothieChart.timeFormatter
  });


// Data
var ecg = new TimeSeries();
var temperature = new TimeSeries();
var angle1 = new TimeSeries();
var angle2 = new TimeSeries();
var angle3 = new TimeSeries();

// Add to SmoothieChart
ecgChart.streamTo(document.getElementById("ecgCanvas"), 0 /*delay*/);
ecgChart.addTimeSeries(ecg, {lineWidth:2,strokeStyle:'#000000'});

temperatureChart.streamTo(document.getElementById("temperatureCanvas"), 0 /*delay*/);
temperatureChart.addTimeSeries(temperature, {lineWidth:2,strokeStyle:'#000000'});


anglesChart.streamTo(document.getElementById("anglesCanvas"), 0 /*delay*/);
anglesChart.addTimeSeries(angle1, {lineWidth:2,strokeStyle:'#00ff00'});
anglesChart.addTimeSeries(angle2, {lineWidth:2,strokeStyle:'#aa00dd'});
anglesChart.addTimeSeries(angle3, {lineWidth:2,strokeStyle:'#000000'});

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    //console.log('receive message' + message.data);
    console.log("Hello DATA");
    try {
      var obj = JSON.parse(message.data);
      //update ECG and angles data

      var ecgArr = obj.ecg;
      var anglesArr = obj.angles;
      var i=0;
      console.log(presentTemp);
      console.log('before id');
      console.log(ecgArr);
      // update data
      var id = setInterval(function(){
        ecg.append(new Date().getTime(), ecgArr[i]);
        temperature.append(new Date().getTime(),presentTemp);
        i++;
        console.log(i);
        if (i==499){
          clearInterval(id);
          i=0;
        }
      },50);

      var j=0,k=25,l=50;
      var id2 = setInterval(function(){
        ecg.append(new Date().getTime(), ecgArr[i]);
                  temperature.append(new Date().getTime(),presentTemp);
                  console.log(presentTemp);
          angle1.append(new Date().getTime(),anglesArr[j]);
          angle2.append(new Date().getTime(),anglesArr[k]);
          angle3.append(new Date().getTime(),anglesArr[l]);
       j++;k++;l++;
       if (j==25){
          clearInterval(id2);
          j=0;k=25;l=50;
        }
      },100);
	  } catch (err) {
      console.error(err);
    }
  }
});

