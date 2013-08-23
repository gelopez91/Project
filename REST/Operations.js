/**
* Description: This class contains some methods used by the server class.
*
* @class Operations
*/

var mongoose = require("mongoose");
 
var Schema = mongoose.Schema;

var configComp = mongoose.Schema();
configComp.add(
	{ _id:false,
	  commerceItemType: 'string',
	  buildCategoryId: 'string',
	  skuId: 'string',
	  quantity: 'Number',
	  productId: 'string',
	  components: [configComp]
	});

var configMain = mongoose.Schema(
	    { items: [{
	    	  _id:false,
	          commerceItemType: 'string',
	          skuId: 'string',
	          quantity: 'Number',
	          productId: 'string',
	          components: [configComp]
	      }],
	      buildTypeId: 'string',
	      type: 'string',
	      buildGroupId: 'string',
	      savedAt: 'Date',
	      updatedAt: 'Date'
	    }, {versionKey: false});

var configMainAux = mongoose.Schema(
	    { items: [{
	    	  _id:false,
	          commerceItemType: 'string',
	          skuId: 'string',
	          quantity: 'Number',
	          productId: 'string',
	          components: [configComp]
	      }],
	      buildTypeId: 'string',
	      type: 'string',
	      buildGroupId: 'string',
	      savedAt: 'Date',
	      updatedAt: 'Date',
	      originalId: 'string'
	    }, {versionKey: false, 
	    	capped: { max: 10, size: 1000000 }});

var configuration = mongoose.model('configuration', configMain, 'config');
var configuration2 = mongoose.model('configuration2', configMainAux, 'pool');


/**
* Description: Adds a configuration given inside the request object.
*
* @method addConfig
* @param {Object} req A request object.
* @param {Object} res A response object.
* @return {Object} Returns a HTTP response with the saved configuration.
*/
exports.addConfig = function(req, res) {
	var config = new configuration(req.body);
	var config2 = new configuration2(req.body);
	if((config.items.length == 0) || !config.buildTypeId || !config.type || 
			 !config.buildGroupId || !config.savedAt || !config.updatedAt){
    	console.log('Error in config. keys. \n');
    	res.send('Syntax error', 400);
    } else {
    	config.savedAt = new Date();
    	config.updatedAt = new Date();
    	config2.savedAt = new Date();
    	config2.updatedAt = new Date();
    	if(!config.items[0].commerceItemType || !config.items[0].skuId || 
    	    	   !config.items[0].quantity || !config.items[0].productId){
        	console.log('Error in main component. \n');
        	res.send('Syntax error', 400);
    	 } else {
    		var components = config.items[0].components;
 			var flag = true;
 			for (var i = 0; i<components.length; i++){
 				flag = checkSyntax(components[i]);
 				if (flag){ continue; }
 				else { break; }
 			}
 			if (flag){
 				config.save(function(err, result1){
 					if (err) {
 			        	console.log(err);
 			            res.send('An error has occurred \n', 409);
 			        } else { 		
 			        	config2.originalId = result1._id+"";
 			        	config2.save(function(err, result2){
 		 					if (!err) {
 		 						res.send(result1, 200);
 		 					}
 		 				});
 			        }
 				});
 			} else {
				console.log('Error in component. \n');
	        	res.send('Syntax error \n', 400);
			}
    	 }
    }
};


/**
* Description: Finds a configuration based on an ID inside the 
* request object.
*
* @method findById
* @param {Object} req A request object.
* @param {Object} res A response object.
* @return {Object} Returns a HTTP response with the wanted configuration.
*/
exports.findById = function(req, res) {
	configuration.findById(req.params.id, function (err, item) {
		if (!(item == null)){
    		console.log('Success... \n');
    		res.send(item, 200);
    	} else {
    		res.send(404);
    	}
	});
};


/**
* Description: Find all the configurations saved.
*
* @method findAll
* @param {Object} req A request object.
* @param {Object} res A response object.
* @return {Object} Returns a HTTP response with all the saved configuration
* in the data base.
*/
exports.findAll = function(req, res) {
	configuration.find(function (err, items) {
	    if (!err) {
	    	console.log('Success... \n');
            res.send(items, 200);
	    } else {
	    	res.send(404);
	    }
	});
};


/**
* Description: Update a configuration based on the ID inside the
* request object.
*
* @method updateConfig
* @param {Object} req A request object.
* @param {Object} res A response object.
* @return {Object} Returns a HTTP response with the updated configuration.
*/
exports.updateConfig = function(req, res) {
	var config = new configuration(req.body);
	if((config.items.length == 0) || !config.buildTypeId || !config.type || 
			 !config.buildGroupId || !config.savedAt){
    	console.log('Error in config. keys. \n');
    	res.send('Syntax error', 400);
    } else {
    	if(!config.items[0].commerceItemType || !config.items[0].skuId || 
    	    	   !config.items[0].quantity || !config.items[0].productId){
        	console.log('Error in main component. \n');
        	res.send('Syntax error', 400);
    	 } else {
    		var components = config.items[0].components;
 			var flag = true;
 			for (var i = 0; i<components.length; i++){
 				flag = checkSyntax(components[i]);
 				if (flag){ continue; }
 				else { break; }
 			}
 			if (flag){
 				configuration.findById(req.params.id, function (err, item) {
 					item.items = config.items;
 					item.buildTypeId = config.buildTypeId;
 					item.type = config.type;
 					item.buildGroupId = config.buildGroupId;
 					item.updatedAt = new Date();;
 					item.save(function(err, c){
 						if (!(c == null)){
 				    		console.log('Success... \n');
 				    		res.send(c, 200);
 				    	} else {
 				    		res.send(404);
 				    	}
 					});
 				});
 			} else {
				console.log('Error in component. \n');
	        	res.send('Syntax error \n', 400);
			}
    	 }
    }
};


/**
* Description: Check syntax in the component object given.
*
* @method checkSyntax
* @param {Object} component A component object.
* @return {Boolean} Returns true if no error were found.
*/
function checkSyntax(component){
	if (!component.commerceItemType || !component.buildCategoryId || !component.skuId || 
			!component.quantity || !component.productId){
		return false;
	} else {
		var flag = true;
		for (var i = 0; i<component.components.length; i++){
			flag = checkSyntax(component.components[i]);
			if (flag){ continue; }
			else { break; }
		}
		if (flag){ return true; }
		else { return false; }
	}
}

exports.pull = function(req, res) {
	configuration2.find(function (err, result) {
	    if (!err) {
	    	var pull = new Array();
	    	for (var index = 0; index<result.length; index++){
	    		pull [index] = {SKUID: result[index].items[0].skuId, 
	    						ID: result[index].originalId };
	    	}
	    	res.send(pull, 200);
	    } else {
	    	res.send(404);
	    }
	});
};
