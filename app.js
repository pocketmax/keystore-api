var express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	_ = require('lodash');

module.exports.app = app;

app
.use(bodyParser.json())
.use(function (req, res, next) {

	req._key = req._parsedUrl.pathname;
	app.config.listeners.before(req._key, function(results){
		req._key = results;
	});
	next();

}).get('*', function (req, res) {

	app.config.listeners.getkey(req._key, function(results){

		res.status(200).json({
			msg: 'fully assembled doc',
			value: results
		});

	});


}).put('*', function (req, res) {

	app.config.listeners.setkey(req._key, req.body, function(results){

		res.status(201).json({
			msg: 'fully assembled doc',
			value: results
		});

	});

}).patch('*', function (req, res) {

	app.config.listeners.upsertkey(req._key, req.body, function(results){

		res.status(201).json({
			msg: 'fully assembled doc',
			value: results
		});

	});

}).delete('*',function (req, res) {

	app.config.listeners.deletekey(req._key, function(results){

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