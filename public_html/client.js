/*
 * Author: Stacy Sealky Lee
 * Class: CSC 337
 * Type: Programming Assignment 8
 * FileName: client.js
 * Purpose: The application should work by presenting the user with a basic 
 * chat interface when the user visits the home page of the site (index.html).
 * From this page, the user should be able to specify a alias (username) and 
 * then begin to send messages using the other text field and the “Send Messages” button.
 */

//setting up socket io client side
var socket = io.connect('http://localhost:3000');
socket.on('message', postMsg);

// This submits the alias and the message to the server
// once the user clicks the submit button
$(() => {
  $("#submit").click(() => {
    submitMsg({
      alias: $("#alias").val(),
      message: $("#message").val()
    });
  })
  getMsg();
})

//adding messages to the #content div
function postMsg(message) {
  $("#content").append(
    `<p>${message.alias}:  ${message.message}</p>`
  )
}

//calling the get request to get data from the server
function getMsg() {
  $.get('http://localhost:3000/messages', (data) => {
    data.forEach(postMsg);
  });
}

//posting each message
function submitMsg(message) {
  $.post('http://localhost:3000/messages', message);
}