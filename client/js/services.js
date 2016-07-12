
'use strict';

var app = angular.module('myApp');


app.service('User', function($http, $q) {
  this.profile = () => {
    return $http.get('/api/users/profile')
      .then(res => {
        return $q.resolve(res.data);
      })
  }


  this.getAll = () => {
    return $http.get('/api/users')
      .then(res => {
        return $q.resolve(res.data);
      });
  }
  this.toggleAdmin = (id) => {
    return $http.put(`/api/users/${id}/toggleAdmin`)

  }
});


app.service('Giph', function($http) {

  this.getGiph = (word) => {
    return $http.post('/api/giphs', {word})
    .catch(err => {
      console.log(err);
    })
  }
  
 }); 

// app.service('Game', function($http) {
  
//   this.getAll = (word) => {
//     return $http.get(`http://api.giphy.com/v1/gifs/search?q=${word}&api_key=dc6zaTOxFJmzC`,{
//               headers : {
//                 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
//             }

//     })
//   }

// })