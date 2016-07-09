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
    this.join(newGameId);
     // console.log('game room', io.sockets.adapter.rooms[newGameId]);
    this.emit('newGameCreated', {newGameId, socketId: this.id, numPlayers});
  });



  socket.on('joinGame', function(user, gameId, numPlayers) {
    // console.log(user);
    console.log('in join', user, gameId, numPlayers)

    this.join(gameId);
    var clients = io.sockets.adapter.rooms[gameId];

    console.log(clients.length, numPlayers);
    if(clients.length === numPlayers) {
      this.in(gameId).emit('startGameBack', {word: 'test', gameId});
    } else {

      this.in(gameId).emit('playerAdded', {currNumPlayers: clients.length, totalNum: numPlayers});
      
    }



  });


  socket.on('startGameFront', function(gameObj) {

    console.log('start word:', gameObj);
    var clients = io.sockets.adapter.rooms[gameObj.gameId];
    console.log(clients);

    this.in(gameObj.gameId).emit('startGameFinal', {word:gameObj.word});

  })



}