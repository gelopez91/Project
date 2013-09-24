$(document).ready(function(){	
	drawChart2();
});

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart2);
function drawChart2() {
	var data = google.visualization.arrayToDataTable([
          ['Dates', 'Sales', 'Expenses'],
          ['2004',  0,      1],
          ['2005',  1,      1],
          ['2006',  1,       0],
          ['2007',  0,      0]
    ]);

    var options = {
    	  title: 'Configurations created in a range of time',
          hAxis: {title: 'Dates'},
          vAxis: {title: 'Quantity'},
          width: '825',
          height: '500'
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('chart2'));
    chart.draw(data, options);
}