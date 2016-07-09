'use strict';

const uuid = require('uuid');
var io; 
var socket;




exports.initGame = function(sio, socket) {
  io = sio;
  socket = socket;




let numPlayers;
  //Host Events
  socket.on('newGame', function(users) {
    // console.log(users);

    var newGameId = uuid();
    let numPlayers = users.length + 1;
    users.forEach(user => {
      console.log(user);
      io.emit(user, {newGameId, socketId: this.id, numPlayers});
    })
    socket.join(newGameId);
     // console.log('game room', io.sockets.adapter.rooms[newGameId]);
    socket.emit('newGameCreated', {newGameId, socketId: this.id, numPlayers});
  });



  socket.on('joinGame', function(user, gameId, numPlayers) {
    // console.log(user);

    this.join(gameId);
    var clients = io.sockets.adapter.rooms[gameId];

    console.log(clients.length, numPlayers);
    if(clients.length === numPlayers) {
      socket.in(gameId).emit('startGame', {word: 'test'});
    } else {

      socket.in(gameId).emit('playerAdded', {currNumPlayers: clients.length, totalNum: numPlayers});
      
    }



  });



}