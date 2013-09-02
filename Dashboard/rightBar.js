/**
Provides functionality to the dashboard.
@module Dashboard
**/

/**
* Description: This class contains the pull down menu functionality.
*
* @class rightBar
*/

/**
* Indicated the frequency of time used to look for recent configurations
* created.
*
* @attribute refreshInterval
* @default 10000 ms.
* @type number
*/
var refreshInterval;

/**
* Description: Executes the pull functionality with the frequency established 
* in the "refreshInterval" attribute when the index page is loaded.
*
* @method ready
*/
$(document).ready(function(){
	pull();
	refreshInterval = setInterval(function(){ 
		pull();  
	}, 10000);
});


/**
* Description: Executes the REST service to get recent configurations created and then send them
* to the Dashboard page.
*
* @method pull
*/
function pull(){
	$.ajax({
	    type: 'GET',
	    crossDomain: true,
	    dataType: 'text json',
	    url: 'http://localhost:3000/dashboard/pull',
	    success: function(data) {
	    	$('div#newSubPanel').attr('id', 'subPanel');
	    	for (var index = 0; index < data.length; index++){
	    		$('div#pull').each(function () {
	    			if (!$('div#pull').children(':contains('+ data[index].ID +')').length) {
	    				$("div#pull").prepend("<div id='newSubPanel'> <p> Sku: " + data[index].SKUID +"<br><br>" +
	    									  "ID: "+ data[index].ID + "</p></div>");
	    	    	}

	    	    });
	    	}
	    	$("div#newSubPanel").hide();
	    	$("div#newSubPanel").slideDown("slow");
	    	$("div#pull").children().slice(10).detach();
        },
        error: function (xhr, status, error) {
        	$("div#pull").prepend("<div id='newSubPanel'> <p> Connection error. <br> Wait a moment and try again by reloading the page.</p></div>");
        	$("div#newSubPanel").hide();
	    	$("div#newSubPanel").slideDown("slow");
	    	$("div#pull").children().slice(10).detach();
        	clearInterval(refreshInterval);
        }
	});
}
      