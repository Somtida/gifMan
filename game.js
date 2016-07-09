'use strict';

const uuid = require('uuid');
var io;
var socket;
var words = ['scary', 'fail', 'ugly', 'trump', 'pokemon', 'furious', 'fighting', 'twerk', 'matrix', 'arnold', 'funny', 'kitten', 'puppy'];



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
      io.emit(user, { newGameId, socketId: this.id, numPlayers });
    })
    this.join(newGameId);
    // console.log('game room', io.sockets.adapter.rooms[newGameId]);
    this.emit('newGameCreated', { newGameId, socketId: this.id, numPlayers });
  });



  socket.on('joinGame', function(user, gameId, numPlayers) {
    // console.log(user);
    console.log('in join', user, gameId, numPlayers)

    this.join(gameId);
    var clients = io.sockets.adapter.rooms[gameId];

    console.log(clients.length, numPlayers);
    if (clients.length === numPlayers) {
      let word = getRandomWord();
      this.in(gameId).emit('startGameBack', { word: word, gameId: gameId });
    } else {

      this.in(gameId).emit('playerAdded', { currNumPlayers: clients.length, totalNum: numPlayers });

    }



  });


  socket.on('startGameFront', function(gameObj) {

    console.log('start word:', gameObj);
    var clients = io.sockets.adapter.rooms[gameObj.gameId];
    console.log(clients);

    this.in(gameObj.gameId).emit('startGameFinal', { word: gameObj.word , gameId: gameObj.gameId});

  })

  socket.on('gameLost', function(gameObj) {
      console.log('in game lost',gameObj);


    })
  socket.on('winner', function(gameObj) {
      console.log('in winner',gameObj);
      this.in(gameObj.gameId).emit('gameOver', gameObj.player);

    })

socket.on('newWord', function(gameId){
  console.log('in new word');
  let word = getRandomWord();
  socket.in(gameId).emit('theWord', word );
})
}




function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}




