UTML: Underscore Template Markup Language
=========================================

UTML


## Installing

Use npm:

	npm install utml

## Using it in your project

Setting up your express app

	// no need to require utml, express will do that for us
	var app = require('express').createServer();
	
	// set utml as the view engine
	app.set('view engine', 'utml');
	
	
	app.get('/', function(req, res){
		res.render('index', {
			locals : { 
				pageTitle : "Hello Node.js + Express + UTML!!",
				msg : "Insert snarky message here."
			}
		});
	});
	
	// start listening on the specified port
	app.listen(8000);

Create 'views/index.utml'

	<p><%= msg %></p>

Create 'views/layout.utml'

	<!doctype html>
	<html>
		<head>
			<title>Node Test Suite</title>
		</head>
		<body>
	
			<h1><%= pageTitle %></h1>
	
			<div><%= body %></div>
	
		</body>
	</html>

