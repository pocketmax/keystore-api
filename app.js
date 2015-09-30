var express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	_ = require('lodash');

module.exports.app = app;

//console.log(col.findOne);
//col.findById('55eb713696d0c80d9dde677e', function(err, doc){
//	console.log(doc);
//});

app
.use(bodyParser.json())
.use(function (req, res, next) {

	app.config.listeners.before(req._parsedUrl.pathname, function(results){

	});
	next();

}).get('*', function (req, res) {

	app.config.listeners.getkey(req.keyId, function(results){

		res.status(200).json({
			msg: 'fully assembled doc',
			value: results
		});

	});


}).put('*', function (req, res) {

	app.config.listeners.setkey(req.keyId, req.body, function(results){

		res.status(201).json({
			msg: 'fully assembled doc',
			value: results
		});

	});

}).delete('*',function (req, res) {

	app.config.listeners.deletekey(req.keyId, function(results){

		res.status(201).json({
			msg: 'key deleted',
			value: results
		});

	});

});

/*
 201 = keyval set
 204 = keyval deleted
 404 = keyval not found
 200 = keyval found
 400 = bad request   i.e. missing msg body, invalid url etc etc
 500 = internal server error
*/