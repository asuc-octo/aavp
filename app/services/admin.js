angular.module('MyApp')
  .factory('Admin', function($http) {
    return {
      getUsers: function() {
        return $http.get('/users');
      },
      updateLevel: function(data) {
        return $http.put('/user', data);
      }
    };
  });