$(document).ready(function(){
	pull();
	setInterval(function(){ 
		pull();  
	}, 10000);
});


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
        	$("div#pull").prepend("Connection error.");          
        }
	});
}
      