angular.module('MyApp')
  .factory('Admin', function($http) {
    return {
      getUsers: function() {
        return $http.get('/users');
      },
      updateLevel: function(data) {
        return $http.put('/user', data);
      },
      deleteUser: function(id) {
        return $http.delete('/user/' + id);
      },
      postCommittee: function(data) {
        return $http.post('/committees', data);
      },
      putCommittee: function(data) {
        return $http.put('/committees', data);
      },
      deleteCommittee: function(id) {
        return $http.delete('/committee/' + id);
      }
    };
  });