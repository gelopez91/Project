$(document).ready(function(){
	$( "div#tabs" ).tabs();
});

function getConfigById(ID){
	$.ajax({
	    type: 'GET',
	    crossDomain: true,
	    dataType: 'text json',
	    url: 'http://localhost:3000/config/'+ID,
	    success: function(data) {
	    	$("div#tab2").html("");
	    	var result = parseJsonAsHTMLTree(data);
	    	$("div#tab2").html(result);
	    	$("#tabs").tabs("option", "active", 1);
	    	$('#tab2').animate({ scrollTop: 0 }, 'slow');
	    	$(".show-hide > li").click(function(){
	    		$(this).children('ul.collapsible1').slideToggle(); 
	    		$(this).toggleClass('open');
	    	});
	    	$(".show-hide > li > ul > li").click(function(e){  
	            e.stopPropagation();  
	        });  
	    	$(".show-hide2 > li").click(function(){
	    		$(this).children('ul.collapsible2').slideToggle();
	    		$(this).toggleClass('open');
	    	}); 
        },
        error: function (xhr, status, error) {
        	$("div#tab2").html("");
        	$("div#tab2").append("<p> Connection error. <br> Wait a moment and try again...</p>");
        }
	});
}

function displayComponents (components) {
    if (components.length == 0){
        return 'none';
    }
    else {
        var result = '';
        for (var i=0; i<components.length; i++){
            result += '<ul class="show-hide2" id="show-hide2"><li class="sku"> Sku ID: ' + components[i].skuId;
            result += '<ul class="collapsible2"><li> Commerce Item Type: ' + components[i].commerceItemType + '</li>';
            result += '<li> Build Category Id: ' + components[i].buildCategoryId + '</li>';
            result += '<li> Quantity: ' + components[i].quantity + '</li>';
            result += '<li> Product ID: ' + components[i].productId + '</li>';
            result += '<li> Components: ';
            result += displayComponents(components[i].components);
            result += '</li></ul></li></ul><br/>';
        }
        return result;
    }
}

var parseJsonAsHTMLTree = function (jsn) {
    var result = '';
    result += '<ul id="detail"><li> ID: ' + jsn._id + '</li>';
    result += '<li> Build Type ID: ' + jsn.buildTypeId + '</li>';
    result += '<li> Type: ' + jsn.type + '</li>';
    result += '<li> Build Group ID: ' + jsn.buildGroupId + '</li>';
    result += '<li> Save at: ' + jsn.savedAt.substring(0,10) + '</li>';
    result += '<li> Updated at: ' + jsn.updatedAt.substring(0,10) + '</li>';
    result += '<li> Items: <br/><br/>';
    result += '<ul class="show-hide" id="show-hide"> <li class="sku"> Sku ID: ' + jsn.items[0].skuId;
    result += '<ul class="collapsible1"> <li> Commerce Item Type: ' + jsn.items[0].commerceItemType + '</li>';
    result += '<li> Quantity: ' + jsn.items[0].quantity + '</li>';
    result += '<li> Product ID: ' + jsn.items[0].productId + '</li>';
    result += '<li> Components: <br/><br/>';
    
    result += displayComponents(jsn.items[0].components);

    result += '</li></ul></li></ul></li></ul>';

    return result;
};