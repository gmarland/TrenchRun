// Load npm modules
	
	var express = require("express");
	
// Instantiate Express

	var app = express();

	app.use("/libs", express.static(__dirname + "/assets/libs"));
	app.use("/styles", express.static(__dirname + "/assets/styles"));

// Create the http server and attach engine.io to it
	
	var http = require("http").createServer(app).listen(8080);

// Set up the required rest actions

	app.get("/*", function(req, res, next) {
		if (req.headers.host.match(/^www\./) != null) res.redirect("http://" + req.headers.host.slice(4) + req.url, 301);
		else next();
	});

	app.get("/", function(req,res) { 
		res.sendfile("./views/index.html"); 
	});
