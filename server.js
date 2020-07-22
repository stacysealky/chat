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
const port = 3000;
const http = require('http');
var server = http.createServer(app);
const io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname, 'public_html')));
app.use(parser.json());
app.use(parser.urlencoded({
  extended: true
}));

const db = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/auto';

//default mongoose connection
mongoose.connect(mongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected
});

//setup schema
var Schema = mongoose.Schema;
var MsgSchema = new Schema({
  alias: String,
  message: String
});

var Messages = mongoose.model('Messages', MsgSchema);


//connecting socket io
io.on('connection', () => {
  console.log("user is connected");
});


server.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

//routing for post
app.post('/messages', (req, res) => {
  var message = new Messages(req.body);
  message.save();
  res.sendStatus(200);
});

//routing for get
app.get('/messages', (req, res) => {
  var m = mongoose.model('Messages', MsgSchema);
  m.find({}, (err, messages) => {
    // console.log(messages)
    res.send(messages);
  })
})