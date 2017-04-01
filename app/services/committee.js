angular.module('MyApp')
  .factory('Committee', function($http) {
    return {
      getCommittees: function() {
        return $http.get('/committees');
      }
    };
  });