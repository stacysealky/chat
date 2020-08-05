/*
 * Author: Stacy Sealky Lee
 * Class: CSC 337
 * Type: Programming Assignment 8
 * FileName: server.js
 * Purpose: The application should work by presenting the user with a basic 
 * chat interface when the user visits the home page of the site (index.html).
 * From this page, the user should be able to specify a alias (username) and 
 * then begin to send messages using the other text field and the “Send Messages” button.
 * Description: I am using jquery, express, mongodb, mongoose, body-parser, socket-io
 *    the mongodb url for this project is local so to run this properly, 
 *    you must have mongodb installed in your machine.
 *    Also, see the package.json file to update dependencies and versions.
 *   
 */

//global variables, mostly importing dependencies
const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const app = express();
const path = require('path');
const http = require('http');
var server = http.createServer(app);
const ejs = require('ejs');

const io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname, 'public_html')));

//Set view engine to ejs
app.set("view engine", "ejs");
app.engine('html', ejs.renderFile);


app.use(parser.json());
app.use(parser.urlencoded({
  extended: true
}));

//DEV ENV
const hostname = '127.0.0.1';
const port = 3000;

// PRODUCTION ENV 
// const hostname = '159.65.223.7';
// const port = 443;

//DB URI - Move to config.env if pushing code
var uri = 'mongodb+srv://stacysealky:pwd123@clusterstacy.fco5r.mongodb.net/chatty';

//DB SET UP & APP LISTEN
var options = {
	useNewUrlParser: true,
	useUnifiedTopology: true
};
mongoose.connect(uri, options, (err, database) => {
	if (err) {
		console.log('Unable to connect to DB. Error:', err);
	} else {
		console.log('Connected to Mongodb');
		app.listen(port, hostname, () => {
			console.log(`Server running at http://${hostname}:${port}/`);
		});
	}
});

//setup schema
var Schema = mongoose.Schema;

var MsgSchema = new Schema({
  alias: String,
  message: String
}, {
	collection: 'messages'
});

var Messages = mongoose.model('Messages', MsgSchema);

//Decided not to use socket io
//connecting socket io
// io.on('connection', () => {
//   console.log("user is connected");
// });

//routing for post
app.post('/chats/post/', async (req, res) => {
  try {
    var m = new Messages();
    m.alias = req.body.alias;
    m.message = req.body.message;
    m.save((err) => {
			if (err) {
				console.log(err);
			} else {
				console.log("successfully saved");
      }
    });
    res.status(200).redirect('/chats');
  } catch (err) {
    res.status(400).send(JSON.stringify({
			success: false,
			message: err
		}));
  }
  // var message = new Messages(req.body);
  // message.save();
  // res.sendStatus(200);
});

//routing for get
app.get('/chats', async (req, res) => {
  try {
    const find = await Messages.find({}, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        res.send(data);
      }
    });
	} catch (error) {
		res.status(400).send(JSON.stringify({
			success: false
		}));
	}
  // Messages.find({}, (err, messages) => {
  //   // console.log(messages)
  //   res.send(messages);
  // })
});

//UNHANDLED REJECTION - Promise
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`);
	// server.close(() => process.exit(1));
})