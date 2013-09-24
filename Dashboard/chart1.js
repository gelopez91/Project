/**
Provides functionality to the dashboard.
@module Dashboard
**/

/**
* Description: Create a chart showing recent configurations created.
*
* @class chart1
*/

/**
* Indicated the interval of time in the chart.
*
* @attribute interval
* @default 15 min.
* @type number
*/
var interval=15;

/**
* Description: Draw the chart for the first time.
*
* @method ready
*/
$(document).ready(function(){	
	startChart();
	$("#range").change(function() {
	    interval = parseInt(this.value);
	    startChart();
	});
});

/**
* Description: Draw the chart for recent configurations created.
*
* @method startChart
*/
function startChart(){
	google.load('visualization', '1', { packages: ['corechart'], callback: function() {
		var date = new Date(), 		
		arr=[];
	
		minutes = date.getMinutes()+'';
		if (minutes.length < 2){ minutes = '0'+minutes;}
		arr.push(date.getHours() + ':' + minutes);
		for(var i=0;i<9;i++){
		  date.setMinutes(date.getMinutes() - interval);
		  minutes = date.getMinutes()+'';
		  if (minutes.length < 2){ minutes = '0'+minutes;}
		  arr.push(date.getHours() + ':' + minutes);
		}
		
		var data = new google.visualization.DataTable();
			data.addColumn('string', '');
	        data.addColumn('number', 'Configurations');
	        data.addRows(10);
	        for (var i=9, j=0; i>=0; i--, j++){
		        data.setValue(j, 0, arr[i]);
	        }
	        
	        for (var i=0; i<10; i++){
		        data.setValue(i, 1, 0);
	        }
	        
	        var chartData = count();

	        var totalMax = Math.max.apply(null, chartData);
	        var totalMin = Math.min.apply(null, chartData);;
	        
	        var roundingExp = Math.floor(Math.log(totalMax) / Math.LN10);
	        var roundingDec = Math.pow(10,roundingExp);

	        var newMax = Math.ceil(totalMax/roundingDec)*roundingDec;
	        var newMin = Math.floor(totalMin/roundingDec)*roundingDec;

	        var range = newMax - newMin;
	        var gridLines = 5;
	        for (var i = 2; i <= 5; ++i) {
	            if ( Math.round(range/i) === range/i) {
	                gridLines = i;
	            }
	        } 
	        
	        var options = {
	            title: 'Recent configurations created',
	            width: '825',
	            height: '500',
	            hAxis: {title: 'Time of day'},
	            vAxis: {title: 'Quantity', format: '#', viewWindow: {min:0}, gridlines:{count: gridLines}},
	            animation:{
	                duration: 450,
	                easing: 'out'
	            }
	        };
	        var chart = new google.visualization.LineChart(document.getElementById('chart1'));
	        var index = 0;
	        var drawChart = function() {
	        	if (index < chartData.length) {
	        		data.setValue(index, 1, chartData[index++]);
	                chart.draw(data, options);
	        	}
	        };
	
	        google.visualization.events.addListener(chart, 'animationfinish', drawChart);
	        chart.draw(data, options);
	        drawChart();
		}
	});
}


/**
* Description: Create the AJAX requests to get configurations created in a range of time
* and then return the number of configurations created. 
*
* @method count
* @param {Object} time An array with the hour and minutes for the consult.
*/
function count(time){
	var response = [],
		dIni = new Date(),
		dFin = new Date();
			
	for (var i=9; i>=0; i--){
		dIni.setMinutes(dIni.getMinutes() - interval);
		
		var hours24 = dIni.getHours(),
		hours = ((hours24 + 11) % 12) + 1,
		amPm = hours24 > 11 ? 'pm' : 'am';
		
		var hours24II = dFin.getHours(),
		hoursII = ((hours24II + 11) % 12) + 1,
		amPmII = hours24II > 11 ? 'pm' : 'am';
		
		dateI = ("00" + (dIni.getMonth() + 1)).slice(-2) + "-" + 
			    ("00" + dIni.getDate()).slice(-2) + "-" + 
			    dIni.getFullYear() + " " + 
			    ("00" + hours).slice(-2) + ":" + 
			    ("00" + dIni.getMinutes()).slice(-2) +" " + amPm;
		dateF = ("00" + (dFin.getMonth() + 1)).slice(-2) + "-" + 
			    ("00" + dFin.getDate()).slice(-2) + "-" + 
			    dFin.getFullYear() + " " + 
			    ("00" + hoursII).slice(-2) + ":" + 
			    ("00" + dFin.getMinutes()).slice(-2) +" " + amPmII;
		
		$.ajax({
			async: false,
		    type: 'GET',
		    crossDomain: true,
		    dataType: 'text json',
		    url: 'http://localhost:3000/dashboard/dates/'+dateI+'/'+dateF,
		    success: function(data) {
		    	response[i] = data.length; 
	        },
	        error: function (xhr, status, error) {
	        	response[i] = 0;
	        }
		});	
		dFin.setMinutes(dFin.getMinutes() - interval);
	}
	return response;
}