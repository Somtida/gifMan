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

  socket.on('startGameBack', function(gameObj){
    console.log('in start game', gameObj.word);
    socket.emit('startGameFront', gameObj);
  })

   socket.on('playerAdded', function(playerObj){
    console.log(playerObj);
    console.log('in playerAdded', playerObj.currNumPlayers+'/'+playerObj.totalNum);
  })


  // if($rootScope.numPlayers)
  // $rootScope.currentUser = Profile.data;
socket.on('startGameFinal', function(wordObj){
  console.log('in start game FINAL',wordObj.word);
})

});






