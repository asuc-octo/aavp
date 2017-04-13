angular.module('MyApp')
  .factory('Committee', function($http) {
    return {
      getCommittees: function() {
        return $http.get('/committees');
      },
      getUsersCommittees: function(id) {
        return $http.get('/committees/user/' + id);
      }
    };
  });