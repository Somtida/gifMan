'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, $state, $auth, $rootScope, socket, SweetAlert) {
  console.log('mainCtrl!');

  $rootScope.isAuthenticated = () => $auth.isAuthenticated();

  // if ($scope.isAuthenticated()) {
  //   $rootScope.currentUser = $auth.getPayload();

  // }
  $scope.logout = () => {
    $auth.logout();
    $rootScope.currentUser = null;
    $state.go('home');
  };

  $scope.authenticate = provider => {
    $auth.authenticate(provider)
      .then(res => {
        $state.go('home');
      })
      .catch(err => {
        console.log('err:', err);
      })
  };


  if ($rootScope.isAuthenticated()) {


    
  }






});


app.controller('loginCtrl', function($scope, $state, $auth, $rootScope) {
  console.log('loginCtrl!');

  $scope.login = () => {
    $auth.login($scope.user)
      .then(res => {
        console.log('res', res);
        // console.log($auth.getPayload());

        $state.go('newGame');
      })
      .catch(err => {
        console.log('err', err);
      })

  };

});


app.controller('registerCtrl', function($scope, $state, $auth) {
  console.log('registerCtrl!');

  $scope.register = () => {
    if ($scope.user.password !== $scope.user.password2) {
      $scope.user.password = null;
      $scope.user.password2 = null;
      alert('Passwords do NOT match. Try again.')
    } else {

      $auth.signup($scope.user)
        .then(res => {
          console.log('res', res);
          $state.go('login');
        })
        .catch(err => {
          console.log('err', err);
        })
    }

  };

});




app.controller('profileCtrl', function($scope, Profile, $rootScope) {
  console.log('profileCtrl!');
  // $rootScope.currentUser = Profile.data;
  $scope.user = Profile;

});




// app.controller('usersCtrl', function($scope, $rootScope, Users, User, $state, $q, socket, $auth) {
//   $rootScope.currentUser = $auth.getPayload();
//   $scope.messages = [];
//   $scope.sendMessage = (user) => {
//     // console.log('send to:',user._id)
//     // console.log($rootScope.currentUser._id);
//     // console.log($scope.message);
//     socket.emit('sendMessage', { id: user._id, message: $scope.message, email: $rootScope.currentUser.email });

//   }
//   console.log($rootScope.currentUser._id);

//   socket.on(`${$rootScope.currentUser._id}`, function(data) {
//     $scope.messages.push(data);
//     console.log('poked');
//     console.log(data);
//   })

//   // socket.on(User._id, function(data) {
//   //   console.log(data);
//   // })

//   console.log($scope.switchStatus);
//   $scope.users = Users;
//   $scope.toggleAdmin = (user) => {
//     // console.log(id);
//     User.toggleAdmin(user._id)
//       .catch(err => {
//         user.admin = !user.admin;
//         console.log('in err');
//         return $q.reject({ e: err });
//       })
//       .then((res) => {
//         // user.admin = !user.admin;
//         if (!res) {
//           user.admin = !user.admin;
//         }
//         console.log(res);
//         // $state.reload('users');
//       })

//   }

// });




app.controller('newGameCtrl', function($scope, Users, $rootScope, socket, $state, $auth,SweetAlert) {
  $rootScope.currentUser = $auth.getPayload();
  console.log($rootScope.currentUser);
  socket.on($rootScope.currentUser._id, function(gameData) {
    console.log(gameData);
    SweetAlert.swal({
        title: "You have been invited to a new game",
        text: "Click play to join game!",
        imageUrl: "https://media.giphy.com/media/z48aJruaX0Jsk/giphy.gif",
        showCancelButton: true,
        confirmButtonText: "Join game",
        closeOnConfirm: true
      },
      function(isConfirm) {
        if (isConfirm) {
          $state.go('game', { gameId: gameData.newGameId, data: gameData });
          socket.emit('joinGame', $rootScope.currentUser._id, gameData.newGameId, gameData.numPlayers);
        } else {
          socket.emit('rejectInvite');

        }

      });
  });



  $scope.users = Users;
  $rootScope.currentUser = $auth.getPayload();
  // console.log($rootScope.currentUser);
  $scope.sendInvites = () => {
    $scope.invites = [];
    angular.forEach($scope.users, function(user) {
      if (user.selected) $scope.invites.push(user._id);
    })

    $rootScope.numPlayers = $scope.invites.length;

    socket.emit('newGame', $scope.invites);

    socket.on('newGameCreated', function(gameInfo) {
      console.log('Game Info', gameInfo);
      $state.go('game', { gameId: gameInfo.newGameId, data: gameInfo });
      // socket.emit('sendInvites', )
    });
    console.log($rootScope.currentUser);




    //console.log($scope.invites);
  }
});



app.controller('playGameCtrl', function($scope, $rootScope, socket) {
  console.log('playGameCtrl!');


  socket.on('startGameBack', function(gameObj) {
    console.log('in start game', gameObj.word);
    $scope.gameId = gameObj.gameId;
    console.log('gameid', $scope.gameId);
    socket.emit('startGameFront', gameObj);
  })

  socket.on('playerAdded', function(playerObj) {
    console.log(playerObj);
    console.log('in playerAdded', playerObj.currNumPlayers + '/' + playerObj.totalNum);
  })


  // if($rootScope.numPlayers)
  // $rootScope.currentUser = Profile.data;
  socket.on('startGameFinal', function(wordObj) {
    $scope.gameId = gameObj.gameId;
    console.log('in start game FINAL', wordObj.word);
    console.log('gameid', $scope.gameId);
  })

});



//Socket stuff






app.controller('gameCtrl', function($scope, Giph, $rootScope, socket, SweetAlert, $state) {

  $scope.start = false;
  var theWord = '';
  // var words = [];
  // var secretWord;

  socket.on('gameOver', function(winner) {
    console.log('in gameOver', winner);
    SweetAlert.swal({
        title: winner + ' is the winner',
        imageUrl: "https://media.giphy.com/media/xT5LMFfdiaF8eWV85i/giphy.gif",
        showCancelButton: false,
        confirmButtonText: "Start a New Game",
        closeOnConfirm: true
      },
      function() {
        $state.go('newGame');

      });


  })

  socket.on('startGameBack', function(gameObj) {
    console.log('in start game', gameObj.word);
    socket.emit('startGameFront', gameObj);
    $scope.gameId = gameObj.gameId;
    // $scope.secretWord = gameObj.word;
    // secretWord=$scope.secretWord;
    // words.push(gameObj.word);
    startGame(gameObj.word)
    $scope.start = true;
  })

  socket.on('playerAdded', function(playerObj) {
    // console.log(playerObj);

    // console.log('in playerAdded', playerObj.currNumPlayers+'/'+playerObj.totalNum);
  })


  // if($rootScope.numPlayers)
  // $rootScope.currentUser = Profile.data;
  socket.on('startGameFinal', function(wordObj) {
    console.log('in start game FINAL', wordObj.word);
    console.log('in final', wordObj);
    // words.push(wordObj.word);
    $scope.gameId = wordObj.gameId;
    startGame(wordObj.word)
      // $scope.secretWord = wordObj.word;
      // secretWord=$scope.secretWord;
    $scope.start = true;
  })

  function startGame(word) {



    $scope.missesAllowed = 6;

    var getRandomWord = function() {
      var index = Math.floor(Math.random() * words.length);
      return words[index];
    };

    var makeLetters = function(word) {
      return _.map(word.split(''), function(character) {
        return { name: character, chosen: false };
      });
    };

    var revealSecret = function() {
      _.each($scope.secretWord, function(letter) {
        letter.chosen = true;
      });
    };

    var checkForEndOfGame = function() {
      $scope.win = _.reduce($scope.secretWord, function(acc, letter) {
        return acc && letter.chosen;
      }, true);

      if ($scope.win) {
        console.log('gameId', $scope.gameId)
        socket.emit('winner', { player: $scope.currentUser.email, gameId: $scope.gameId });

        SweetAlert.swal({
            title: 'You win!',
            imageUrl: "https://media.giphy.com/media/z48aJruaX0Jsk/giphy.gif",
            showCancelButton: false,
            confirmButtonText: "Start a New Game",
            closeOnConfirm: true
          },
          function() {
            $state.go('newGame');

          });

      }

      if (!$scope.win && $scope.numMisses === $scope.missesAllowed) {
        $scope.lost = true;
        revealSecret();
      }

      if ($scope.lost) {
        socket.emit('gameLost', { player: $scope.currentUser.email, gameId: $scope.gameId });
      }
    }

    $scope.reset = function() {
      _.each($scope.letters, function(letter) {
        letter.chosen = false;
      });
      $scope.secretWord = makeLetters(word);
      $scope.numMisses = 0;
      $scope.win = false;
      $scope.lost = false;
    };

    $scope.reset();

    $scope.try = function(guess) {
      guess.chosen = true;
      var found = false;
      _.each($scope.secretWord,
        function(letter) {
          if (guess.name.toUpperCase() === letter.name.toUpperCase()) {
            letter.chosen = true;
            found = true;
          }
        });
      if (!found) {
        $scope.numMisses++;
      }
      checkForEndOfGame();
    };

    $scope.letters = makeLetters("abcdefghijklmnopqrstuvwxyz");



    Giph.getGiph(word)
      .then((res) => {
        // console.log('res', res.data.data[0].images.fixed_height.url);
        $scope.img1 = res.data.data[0].images.fixed_height.url;
        $scope.img2 = res.data.data[1].images.fixed_height.url;
        $scope.img3 = res.data.data[2].images.fixed_height.url;
        $scope.img4 = res.data.data[3].images.fixed_height.url;
      })


  }



});
