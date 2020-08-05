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

$(document).ready(function () {
  //SUBMIT FORM
  $("#msgForm").submit(function (event) {
    event.preventDefault();
    ajaxPost();
  });

  getMsg();

  function ajaxPost() {
    let alias = $('#alias').val();
    let msg = $('#message').val();
    let itemObj = {
      alias: alias,
      message: msg
    };
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: '/chats/post/',
      data: JSON.stringify(itemObj),
      dataType: 'json',
      success: function (result) {
        alert('message sent!');
        console.log(result);
      },
      error: function (e) {
        console.log("ERROR: ", e);
      }
    });
    reset();
  }

  function reset() {
    $('#alias').val("");
    $('#message').val("");
  }

  //adding messages to the #content div
  function postMsg(m) {
    $("#dataContent").append(
      `<p><span>${m.alias}:</span>  ${m.message}</p>`
    )
  };

  //calling the get request to get data from the server
  function getMsg() {
    $.get('/chats', (data) => {
      data.forEach(postMsg);
    });
  }

  
});

//refreshs the page
function refresh() {
  setTimeout(function () {
    location.reload();
  }, 100);
}

//setting up socket io client side
// var socket = io.connect('http://localhost:3000');
// socket.on('message', postMsg);

// This submits the alias and the message to the server
// once the user clicks the submit button
// $(() => {
//   $("#submit").click(() => {
//     submitMsg({
//       alias: $("#alias").val(),
//       message: $("#message").val()
//     });
//   })
//   getMsg();
// })

//posting each message
// function submitMsg(message) {
//   $.post('http://localhost:3000/chats/post', message);
// }