angular.module('MyApp')
  .factory('Admin', function($http) {
    return {
      getUsers: function(data) {
        return $http.get('/users');
      }
    };
  });