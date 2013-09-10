var interval=15;

$(document).ready(function(){	
	$("#range").change(function() {
	    interval = parseInt(this.value);
	    drawChart();
	});
});

google.load("visualization", "1", {packages:["corechart"]});

google.setOnLoadCallback(drawChart);

function drawChart() {
	var date = new Date(), 		
		arr=[];
	
	minutes = date.getMinutes()+'';
	if (minutes.length < 2){ minutes = '0'+minutes;}
	arr.push([date.getHours() + ':' + minutes, date.getHours(), date.getMinutes()]);
	for(var i=0;i<9;i++){
	  date.setMinutes(date.getMinutes() - interval);
	  minutes = date.getMinutes()+'';
	  if (minutes.length < 2){ minutes = '0'+minutes;}
	  arr.push([date.getHours() + ':' + minutes, date.getHours(), date.getMinutes()]);
	}
	
	var data = google.visualization.arrayToDataTable([
    	  ['Date Time', 'configurations'],
          [arr[9][0],  count(arr[9])],
          [arr[8][0],  count(arr[8])],
          [arr[7][0],  count(arr[7])],
    	  [arr[6][0],  count(arr[6])],
    	  [arr[5][0],  count(arr[5])],
    	  [arr[4][0],  count(arr[4])],
    	  [arr[3][0],  count(arr[3])],
    	  [arr[2][0],  count(arr[2])],
    	  [arr[1][0],  count(arr[1])],
    	  [arr[0][0],  count(arr[0])]
        ]);

    var options = {
          title: 'Recent configurations created' ,
          hAxis: {title: 'Time of day'},
          vAxis: {title: 'Quantity', format: '#', showTextEvery:1},
          width: '850',
          height: '500'
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart1'));
    chart.draw(data, options);
}

function count(time){
	var date = new Date(),
		response = 0;
	
	if (time[1] > date.getHours()){
		date.setMinutes(date.getMinutes() - 1440);
		dFin = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time[1], time[2]);
		tempDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time[1], time[2]);
		tempDate.setMinutes(tempDate.getMinutes() - interval);
		dIni = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), tempDate.getHours(), tempDate.getMinutes());
		
		var hours24 = dIni.getHours(),
			hours = ((hours24 + 11) % 12) + 1,
			amPm = hours24 > 11 ? 'pm' : 'am';
		
		var hours24II = dFin.getHours(),
			hoursII = ((hours24II + 11) % 12) + 1,
			amPmII = hours24 > 11 ? 'pm' : 'am';
		
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
		    url: 'http://localhost:3000/dashboard/dates/'+dateIni+'/'+dateEnd+'/',
		    success: function(data) {
		    	response = data.length; 
	        },
	        error: function (xhr, status, error) {
	        	response = 0;
	        }
		});
		return response;
	}
	else {
		dFin = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time[1], time[2]);
		tempDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time[1], time[2]);
		tempDate.setMinutes(tempDate.getMinutes() - interval);
		dIni = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), tempDate.getHours(), tempDate.getMinutes());
		
		var hours24 = dIni.getHours(),
		hours = ((hours24 + 11) % 12) + 1,
		amPm = hours24 > 11 ? 'pm' : 'am';
		
		var hours24II = dFin.getHours(),
		hoursII = ((hours24II + 11) % 12) + 1,
		amPmII = hours24 > 11 ? 'pm' : 'am';
		
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
		    	response = data.length; 
	        },
	        error: function (xhr, status, error) {
	        	response = 0;
	        }
		});
		return response;
	}
}