/**
Provides functionality to the dashboard.
@module Dashboard
**/

/**
* Description: This class contains the search panel functionality.
*
* @class leftBar
*/

/**
* Description: Gives format to the jquery datetime picker and add the scroll event 
* to the left panel.
*
* @method ready
*/
$(document).ready(function(){
    $('#dateIni').datetimepicker({
    	timeFormat: "hh:mm tt"
    });
    $('#dateEnd').datetimepicker({
    	timeFormat: "hh:mm tt"
    });
    
    $('.sub-box').scroll( function() {
    	if ($(this)[0].scrollHeight - $(this).scrollTop() === $(this).outerHeight()) {
    		ini = ini + 20;
    		aux(dateIni, dateEnd, ini);
    	}
    });
});

/**
* Description: Check the current position of the left panel scroll.
*
* @method checkScroll
* @param {Element} elem An element to check its position with the scroll.
*/
function checkScroll(elem)
{
    var docViewTop = $('.sub-box').scrollTop();
    var docViewBottom = docViewTop + $('.sub-box').height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom < docViewBottom) && (elemTop > docViewTop));
}

var ini = 0,
	dateIni,
	dateEnd;

/**
* Description: Get the dates and times inserted in the form and parse them to change the 
* '/' character. Then call an auxiliar method to execute the ajax consult.
*
* @method loadConfigurationsByDate
*/
function loadConfigurationsByDate(){
	dateIni = document.getElementById("dateIni").value,
	dateEnd = document.getElementById("dateEnd").value;
		
	dateIni = dateIni.replace(/\//g,'-');
	dateEnd = dateEnd.replace(/\//g,'-');
	
	$("#results").html("");
	ini = 0;
	aux(dateIni, dateEnd, ini);
}

/**
* Description: Check the current position of the left panel scroll.
*
* @method aux
* @param {date} dateIni The date to start looking for configurations created.
* @param {date} dateIni The date to end looking for configurations created.
* @param {number} ini The number of elements consulted already. The consult skips the
* first 'ini' configurations.
*/
function aux(dateIni, dateEnd, ini){
	$.ajax({
	    type: 'GET',
	    crossDomain: true,
	    dataType: 'text json',
	    url: 'http://localhost:3000/dashboard/dates/'+dateIni+'/'+dateEnd+'/'+ini+'/20',
	    success: function(data) {
	    	if (data.length === 0){
	    		$("div#results").append("<div class='subPanel2' 'id='subPanel2'> <p> No configurations found. </p></div>");
	    	}
	    	else {
	    		for (var index = 0; index < data.length; index++){
		    		if (index < 8){
		    			$("div#results").append("<div class='subPanel2' 'id='subPanel2'> <p> Sku: " + data[index].items[0].skuId +
		    									"</p><br/> <p>ID: "+ data[index]._id + "</p></div>");
		    		}
		    		else {
		    			$("div#results").append("<div class='subPanel2 hidden' 'id='subPanel2'> <p> Sku: " + data[index].items[0].skuId +
		    									"</p><br/> <p> ID: "+ data[index]._id + "</p></div>");
		    		}
		    	}
		    	$('.sub-box').on('scroll', function(){
		    	    $('.hidden').each(function(){
		    	        if(checkScroll($(this))){
		    	            $(this).removeClass('hidden').css({ 'display' : 'none' }).fadeIn();
		    	        }
		    	    });
		    	});
		    	$(".subPanel2").on({
		    		click: function(){
		    			var content = $(this).text();
		    			var n=content.indexOf("ID:");
		    			var id = content.substring(n+4);
		    			getConfigById(id);	 
		    		}
		    	});
	    	}
        },
        error: function (xhr, status, error) {
        	$("div#results").append("<div class='subPanel2' id='subPanel2'> <p> An error occured.</p></div>");
        	$("div#subPanel2").hide();
	    	$("div#subPanel2").slideDown("slow");
        }
	});
}



