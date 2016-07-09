'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, $state, $auth, $rootScope, socket, SweetAlert) {
  console.log('mainCtrl!');

  $scope.isAuthenticated = () => $auth.isAuthenticated();

  if ($scope.isAuthenticated()) {
    $rootScope.currentUser = $auth.getPayload();
  }
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


 if ($scope.isAuthenticated()) {
    
  
   socket.on($rootScope.currentUser._id, function(gameData) {
      console.log(gameData);
      SweetAlert.swal({
         title: "You have been invited to the gifman",
         text: "Click play to join game!",
         imageUrl: "https://media.giphy.com/media/z48aJruaX0Jsk/giphy.gif",
         showCancelButton: true,
         confirmButtonColor: "#DD6B55",
         confirmButtonText: "Join game",
         closeOnConfirm: true}, 
      function(isConfirm){ 
        if(isConfirm) {
          $state.go('playGame', {gameId: gameData.newGameId, data: gameData});
          socket.emit('joinGame', $rootScope.currentUser._id, gameData.newGameId, gameData.numPlayers);
        } else {
          socket.emit('rejectInvite');

        }

      });
    });

 }



});


app.controller('loginCtrl', function($scope, $state, $auth, $rootScope) {
  console.log('loginCtrl!');

  $scope.login = () => {
    $auth.login($scope.user)
      .then(res => {
        console.log('res', res);
        // console.log($auth.getPayload());

        $state.go('profile');
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




app.controller('usersCtrl', function($scope, $rootScope, Users, User, $state, $q, socket, $auth) {
  $rootScope.currentUser = $auth.getPayload();
  $scope.messages = [];
  $scope.sendMessage = (user) => {
    // console.log('send to:',user._id)
    // console.log($rootScope.currentUser._id);
    // console.log($scope.message);
    socket.emit('sendMessage', { id: user._id, message: $scope.message, email: $rootScope.currentUser.email });

  }
  console.log($rootScope.currentUser._id);

  socket.on(`${$rootScope.currentUser._id}`, function(data) {
    $scope.messages.push(data);
    console.log('poked');
    console.log(data);
  })

  // socket.on(User._id, function(data) {
  //   console.log(data);
  // })

  console.log($scope.switchStatus);
  $scope.users = Users;
  $scope.toggleAdmin = (user) => {
    // console.log(id);
    User.toggleAdmin(user._id)
      .catch(err => {
        user.admin = !user.admin;
        console.log('in err');
        return $q.reject({ e: err });
      })
      .then((res) => {
        // user.admin = !user.admin;
        if (!res) {
          user.admin = !user.admin;
        }
        console.log(res);
        // $state.reload('users');
      })

  }

});





app.controller('gameCtrl',  function($scope, Giph) {
  
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
    
    if (!$scope.win && $scope.numMisses === $scope.missesAllowed) {
      $scope.lost = true;
      revealSecret();
    }
  }
  
  $scope.reset = function() {
    _.each($scope.letters, function(letter) {
      letter.chosen = false;
    });
    $scope.secretWord = makeLetters(getRandomWord());
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

  

  Giph.getGiph()
  .then((res) => {
    // console.log('res', res.data.data[0].images.fixed_height.url);
    $scope.img1 = res.data.data[0].images.fixed_height.url; 
    $scope.img2 = res.data.data[1].images.fixed_height.url; 
    $scope.img3 = res.data.data[2].images.fixed_height.url; 
    $scope.img4 = res.data.data[3].images.fixed_height.url; 
  })
  

  // $scope.img1 = "https://media0.giphy.com/media/mHzwTgOK3FKUg/giphy.gif";
  // $scope.img2 = "https://media0.giphy.com/media/mHzwTgOK3FKUg/giphy.gif";
  // $scope.img3 = "https://media4.giphy.com/media/3oEjHXTznp23vHn48E/giphy.gif";
  // $scope.img4 = "http://media3.giphy.com/media/l46CqnZ9RpJYPSjRu/giphy.gif";


});


var words = [
  'Cat', 'Dog'
];



app.controller('newGameCtrl', function($scope, Users, $rootScope, socket, $state) {
  $scope.users = Users;
 console.log($rootScope.currentUser);
  $scope.sendInvites = () => {
    $scope.invites = [];
    angular.forEach($scope.users, function(user) {
      if(user.selected) $scope.invites.push(user._id);
    })

    $rootScope.numPlayers = $scope.invites.length;

    socket.emit('newGame', $scope.invites);

    socket.on('newGameCreated', function(gameInfo) {
      console.log('Game Info', gameInfo);
      $state.go('playGame', {gameId: gameInfo.newGameId, data: gameInfo});
      // socket.emit('sendInvites', )
    });
    console.log($rootScope.currentUser);

   

    
    //console.log($scope.invites);
  }
});



app.controller('playGameCtrl', function($scope, $rootScope, socket) {
  console.log('playGameCtrl!');

  socket.on('startGame', function(word){
    console.log('in start game', word);
  })

   socket.on('playerAdded', function(playerObj){
    console.log(playerObj);
    console.log('in playerAdded', playerObj.currNumPlayers+'/'+playerObj.totalNum);
  })


  // if($rootScope.numPlayers)
  // $rootScope.currentUser = Profile.data;

});






