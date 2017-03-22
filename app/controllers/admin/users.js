angular.module('MyApp')
  .controller('AdminUsersCtrl', function($scope, $rootScope, $location, $window, $auth, Admin) {
  	$scope.users = [];
  	$scope.currentUser = $rootScope.currentUser;

  	$scope.levelOptions = [
		    { name: 'Unapproved', value: 0 },
		    { name: 'Poster', value: 1 },
		    { name: 'Admin', value: 2 }
		];

  	Admin.getUsers()
  		.then(function(response) {
  			console.log(response.data.users);
  			$scope.users = response.data.users;
  		})
  		.catch(function(response) {
  			console.log(response);
  		});


  	$scope.getRowColor = function(level) {
  		switch(level){
        case 0: return '';
        case 1: return 'success';
        case 2: return 'warning';
        default: return 'danger';
      }
  	};

  	$scope.updateLevel = function(index) {
  		let user = $scope.users[index];
  		Admin.updateLevel(user).then(function(response) {
          //do somethin
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
  	};

    // $scope.profile = $rootScope.currentUser;

    // $scope.updateProfile = function() {
    //   Account.updateProfile($scope.profile)
    //     .then(function(response) {
    //       $rootScope.currentUser = response.data.user;
    //       $window.localStorage.user = JSON.stringify(response.data.user);
    //       $scope.messages = {
    //         success: [response.data]
    //       };
    //     })
    //     .catch(function(response) {
    //       $scope.messages = {
    //         error: Array.isArray(response.data) ? response.data : [response.data]
    //       };
    //     });
    // };

    // $scope.changePassword = function() {
    //   Account.changePassword($scope.profile)
    //     .then(function(response) {
    //       $scope.messages = {
    //         success: [response.data]
    //       };
    //     })
    //     .catch(function(response) {
    //       $scope.messages = {
    //         error: Array.isArray(response.data) ? response.data : [response.data]
    //       };
    //     });
    // };

    // $scope.link = function(provider) {
    //   $auth.link(provider)
    //     .then(function(response) {
    //       $scope.messages = {
    //         success: [response.data]
    //       };
    //     })
    //     .catch(function(response) {
    //       $window.scrollTo(0, 0);
    //       $scope.messages = {
    //         error: [response.data]
    //       };
    //     });
    // };
    // $scope.unlink = function(provider) {
    //   $auth.unlink(provider)
    //     .then(function() {
    //       $scope.messages = {
    //         success: [response.data]
    //       };
    //     })
    //     .catch(function(response) {
    //       $scope.messages = {
    //         error: [response.data]
    //       };
    //     });
    // };

    // $scope.deleteAccount = function() {
    //   Account.deleteAccount()
    //     .then(function() {
    //       $auth.logout();
    //       delete $window.localStorage.user;
    //       $location.path('/');
    //     })
    //     .catch(function(response) {
    //       $scope.messages = {
    //         error: [response.data]
    //       };
    //     });
    // };
  });