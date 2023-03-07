$(function() {

  // Generate a unique username for the user
  var username = generateUsername();

  // Get the seed from the URL
  var seed = getSeed();

  // Connect to the socket.io server
  var socket = io('http://localhost:3000');

  function generateUsername() {
    var adjectives = ['happy', 'sad', 'angry', 'crazy', 'sleepy', 'hungry', 'silly', 'smart', 'lazy', 'cool'];
    var nouns = ['cat', 'dog', 'bird', 'elephant', 'monkey', 'tiger', 'lion', 'snake', 'zebra', 'giraffe'];
    var adjectiveIndex = Math.floor(Math.random() * adjectives.length);
    var nounIndex = Math.floor(Math.random() * nouns.length);
    var adjective = adjectives[adjectiveIndex];
    var noun = nouns[nounIndex];
    return adjective + '-' + noun;
  }

  function getSeed() {
    var searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('seed');
  }

  function sendMessage() {
    var message = $('#chat-message').val().trim();
    if (message) {
      var timestamp = new Date().toLocaleTimeString();
      var data = {username: username, message: message, timestamp: timestamp};
      socket.emit('chat-message', seed, data);
      addMessageToUI(data);
      $('#chat-message').val('');
    }
  }

  function addMessageToUI(data) {
    var username = data.username;
    var message = data.message;
    var timestamp = data.timestamp;
    var messageBubble = '<div class="chat-bubble"><span class="username">' + username + ':</span><span class="message">' + message + '</span><span class="time">' + timestamp + '</span></div>';
    $('#chat-messages').append(messageBubble);
    $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
  }

  $('#send-message').click(function() {
    sendMessage();
  });

  $('#chat-message').keypress(function(event) {
    if (event.which === 13) {
      sendMessage();
    }
  });

  socket.on('connect', function() {
    console.log('Connected to server');
  });

  socket.on('disconnect', function() {
    console.log('Disconnected from server');
  });

  socket.on('chat-message', function(data) {
    addMessageToUI(data);
  });

});
