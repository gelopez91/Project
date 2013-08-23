/**
Provides operations to manage configurations.

@module REST Services
**/

/**
* Description: This class receives the HTTP requests to operations like save, 
* update and find configurations.
*
* @class Server
*/

var express = require('express'),
	mongoose = require('mongoose'),
    operation = require('./REST/Operations'),
	dashboard = require('./REST/Dashboard');
 
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev')); 
    app.use(express.bodyParser());
});


 
/**
* Description: HTTP GET method to obtain all the configurations
* saved in the data base.
*
* @method GET Method
* @return {Object} Returns a JSON structure containing all the 
* configurations saved in the data base.
*/
app.get('/config', operation.findAll);



/**
* Description: HTTP GET method to obtain a configuration by an ID given.
*
* @method GET Method
* @param {String} ID The ID of the configuration required.
* @return {Object} Returns a JSON structure containing the
* configuration with the ID given.
*/
app.get('/config/:id', operation.findById);



/**
* Description: HTTP POST method to save a configuration.
*
* @method POST Method
* @return {Object} Returns a JSON structure containing the saved
* configuration.
*/
app.post('/config', operation.addConfig);



/**
* Description: HTTP PUT method to update a configuration by an ID given.
*
* @method PUT Method
* @param {String} ID The ID of the configuration that needs to be updated.
* @return {Object} Returns a JSON structure containing the updated
* configuration.
*/
app.put('/config/:id', operation.updateConfig);



/**
* Description: HTTP GET method to get the number of appearances of a skuID given.
*
* @method GET Method
* @param {String} skuId The skuId of a component.
* @return {Number} Returns the number of appearances of the skuId.
* configuration.
*/
app.get('/dashboard/skuID/:skuId', dashboard.getAppearances);



/**
* Description: HTTP GET method to get the top number of main components or
* sub components.
*
* @method GET Method
* @param {Number} N The number of a results.
* @param {String} configType A configuration type.
* @param {String} componentType A component type.
* @return {Object} Returns the component's top N in the database that matches the configuration
*  type and the component type.
*/
app.get('/dashboard/top/:N/:configType/:componentType', dashboard.getTopN);


/**
* Description: HTTP GET method to get the top number of all components.
*
* @method GET Method
* @param {Number} N The number of a results.
* @param {String} configType A configuration type.
* @return {Object} Returns the component's top N in the database that matches the configuration
* type.
*/
app.get('/dashboard/top/:N/:configType', dashboard.getTopN);

app.get('/dashboard/pull', operation.pull);



app.configure(function () {
    app.use("/", express.static(__dirname));
});



/**
@property Port
@default 3000
@type Number
**/
app.listen(3000);
console.log('Listening on port 3000...');

/**
@property Database
@default configdb
@type Object
**/
mongoose.connect('mongodb://localhost/configdb');

mongoose.connection.on('error', function (err) {
	 console.log("Cannot connect to database.");	 
});
