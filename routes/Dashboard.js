/**
* Description: This class contains some methods used by the server class.
*
* @class Dashboard
*/

var mongoose = require("mongoose");

/**
* Description: Get the number of appearances of a skuID given.
*
* @method getAppearances
* @param {String} skuID A component's skuID.
* @return {object} Returns an object with the skuID and the number of appearances.
*/
exports.getAppearances = function(req, res) {
	
	var skuIdMap = function() {   
		function aux(component){
			if (s === component.skuId){
				emit(component.skuId, 1);
			}
			if (component.components.length > 0){
				for (index in component.components) {
					 aux(component.components[index]);
				}
			}
		}
		
		if (s === this.items[0].skuId){
			emit(this.items[0].skuId, 1);
		}
		
		 for (index in this.items[0].components) {
			 aux(this.items[0].components[index]);
		 }
	}; 

	var skuIdReduce = function(previous, current) { 
		var count = 0; 
		for (index in current) { 
			count += current[index]; 
		} 
		return count; 
	}; 

	var command = { 
		mapreduce: "config",
	    map: skuIdMap.toString(),
	    reduce: skuIdReduce.toString(),
	    scope : { s : req.params.skuId },
	    out: 'skuId'
	}; 

	mongoose.connection.db.executeDbCommand(command, function(err, dbres) 
	{ 
		if (err) { res.send('An error has occurred \n', 409); } 
		else {
			mongoose.connection.db.collection('skuId', function(err, collection) {
		        collection.find().toArray(function(err, resp) {
		        	var parsed = JSON.parse(JSON.stringify(resp), function(k, v) {
		        	    if (k === "_id") 
		        	        this.skuId = v;
		        	    else
		        	        return v;
		        	});
		        	res.send(parsed, 200);
		        });
		    });
		}
	});
};


/**
* Description: Get component's top N by a configuration type (and a component type).
*
* @method getTopN
* @param {Number} N The number of items to return.
* @param {String} configType A configuration type.
* @param {String} componentType A component type.
* @return {object} Returns an array with the component's top N.
*/
exports.getTopN = function(req, res) {	
	var topMap = function() {   
		function aux(component){
			emit(component.skuId, 1);
			if (component.components.length > 0){
				for (index in component.components) {
					 aux(component.components[index]);
				}
			}
		}
		
		if (!c){
			emit(this.items[0].skuId, 1);
			
			 for (index in this.items[0].components) {
				 aux(this.items[0].components[index]);
			 }
		}
		else {
			if (c === this.items[0].commerceItemType){
				emit(this.items[0].skuId, 1);
			}
			else {
				 for (index in this.items[0].components) {
					 aux(this.items[0].components[index]);
				 }
			}
		}
	};

	var topReduce = function(previous, current) { 
		var count = 0; 
		for (index in current) { 
			count += current[index]; 
		} 
		return count; 
	}; 

	var command = { 
		mapreduce: "config",
	    map: topMap.toString(),
	    reduce: topReduce.toString(),	
	    query: { type: req.params.configType},
	    scope : { c : req.params.componentType },
	    out: 'skuId'
	}; 

	mongoose.connection.db.executeDbCommand(command, function(err, dbres) 
	{ 
		if (err) { res.send('An error has occurred \n', 409); } 
		else {
			mongoose.connection.db.collection('skuId', function(err, collection) {
		        collection.find().sort("value", -1).limit(parseInt(req.params.N)).toArray(function(err, resp) {
		        	var parsed = JSON.parse(JSON.stringify(resp), function(k, v) {
		        	    if (k === "_id") 
		        	        this.skuId = v;
		        	    else
		        	        return v;
		        	});
		        	res.send(parsed, 200);
		        });
		    });
		}
	});
};