function isScrolledIntoView(elem)
{
    var docViewTop = $('.sub-box').scrollTop();
    var docViewBottom = docViewTop + $('.sub-box').height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

$(document).ready(function(){
    $('#dateIni').datetimepicker({
    	timeFormat: "hh:mm tt"
    });
    $('#dateEnd').datetimepicker({
    	timeFormat: "hh:mm tt"
    });
});


function loadConfigurationsByDate(){
	var dateIni = document.getElementById("dateIni").value;
		dateEnd = document.getElementById("dateEnd").value;
		
	dateIni = dateIni.replace(/\//g,'-');
	dateEnd = dateEnd.replace(/\//g,'-');
	
	$("#results").html("");
	
	$.ajax({
	    type: 'GET',
	    crossDomain: true,
	    dataType: 'text json',
	    url: 'http://localhost:3000/dashboard/dates/'+dateIni+'/'+dateEnd,
	    success: function(data) {
	    	for (var index = 0; index < data.length; index++){
	    		$("div#results").append("<div class='subPanel2 hidden' 'id='subPanel2'> <p> Sku: " + data[index].items[0].skuId +"<br><br>" +
					  			  		"ID: "+ data[index]._id + "</p></div>");
	    	}
	    	$("div#subPanel2").hide();
	    	$("div#subPanel2").slideDown("slow");
        },
        error: function (xhr, status, error) {
        	$("div#results").append("<div class='subPanel2 hidden' id='subPanel2'> <p> An error occured.</p></div>");
        	$("div#subPanel2").hide();
	    	$("div#subPanel2").slideDown("slow");
        }
	});
	
	$('.subPanel2').each(function(){
		alert("va aqui");
		if(!isScrolledIntoView($(this))){
			$(this).addClass('hidden');
	     }
	 });
}

$('.sub-box').on('scroll', function(){
    $('.hidden').each(function(){
        if(isScrolledIntoView($(this))){
            $(this).removeClass('hidden').css({ 'display' : 'none' }).fadeIn();
        }
    });
});

