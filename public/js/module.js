'use strict';

var app = angular.module('myApp', ['ngMaterial','ui.router', 'satellizer', 'btford.socket-io', 'oitozero.ngSweetAlert']);

app.config(function($authProvider) {
  $authProvider.loginUrl = '/api/users/login';
  $authProvider.signupUrl = '/api/users/signup';

  $authProvider.facebook({
    clientId: '277768235911300',
    url: '/api/users/facebook'
  });

});

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', { url: '/', templateUrl: '/html/home.html' })
    .state('login', {
      url: '/login',
      templateUrl: '/html/login.html',
      controller: 'loginCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: '/html/register.html',
      controller: 'registerCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: '/html/profile.html',
      controller: 'profileCtrl',
      resolve: {
        Profile: function(User) {
          return User.profile();
        }
      }
    })
    .state('users', {
      url: '/users',
      templateUrl: '/html/users.html',
      controller: 'usersCtrl',
      resolve: {
        Users: function(User) {
          return User.getAll();
        }
      }
    })

    .state('game', {
      url: '/game',
      templateUrl: '/html/game.html',
      controller: 'gameCtrl',

    .state('newGame', {
      url: '/newGame',
      templateUrl: '/html/newGame.html',
      controller: 'newGameCtrl',
      resolve: {
        Users: function(User) {
          return User.getAll();
        }
      }
    })
    .state('playGame', {
      url: '/playGame/:gameId', 
      templateUrl: '/html/playGame.html',
      controller: 'playGameCtrl',
      params: {data: null}


    })

  $urlRouterProvider.otherwise('/');
});



app.factory('socket', function(socketFactory) {
  let socket = socketFactory();

  socket.forward('newMessage');
  return socket;  
});




