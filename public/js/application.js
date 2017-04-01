angular.module('MyApp', ['ngRoute', 'satellizer', 'ui.bootstrap'])
  .config(["$routeProvider", "$locationProvider", "$authProvider", function($routeProvider, $locationProvider, $authProvider) {
    skipIfAuthenticated.$inject = ["$location", "$auth"];
    loginRequired.$inject = ["$location", "$auth"];
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html'
      })
      .when('/contact', {
        templateUrl: 'partials/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/account', {
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/forgot', {
        templateUrl: 'partials/forgot.html',
        controller: 'ForgotCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/reset/:token', {
        templateUrl: 'partials/reset.html',
        controller: 'ResetCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/admin/users', {
        templateUrl: 'partials/admin/users.html',
        controller: 'AdminUsersCtrl',
      })
      .when('/admin/committees', {
        templateUrl: 'partials/admin/committees.html',
        controller: 'AdminCommitteesCtrl',
      })
      .otherwise({
        templateUrl: 'partials/404.html'
      });

    $authProvider.loginUrl = '/login';
    $authProvider.signupUrl = '/signup';
    $authProvider.google({
      url: '/auth/google',
      clientId: '1045412941131-vgbpc026j6c0m4ihumqs78s5jm0p1907.apps.googleusercontent.com'
    });

    function skipIfAuthenticated($location, $auth) {
      if ($auth.isAuthenticated()) {
        $location.path('/');
      }
    }

    function loginRequired($location, $auth) {
      if (!$auth.isAuthenticated()) {
        $location.path('/login');
      }
    }
  }])
  .run(["$rootScope", "$window", function($rootScope, $window) {
    if ($window.localStorage.user) {
      $rootScope.currentUser = JSON.parse($window.localStorage.user);
    }
  }]);

angular.module('MyApp')
  .controller('ContactCtrl', ["$scope", "Contact", function($scope, Contact) {
    $scope.sendContactForm = function() {
      Contact.send($scope.contact)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };
  }]);

angular.module('MyApp')
  .controller('ForgotCtrl', ["$scope", "Account", function($scope, Account) {
    $scope.forgotPassword = function() {
      Account.forgotPassword($scope.user)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };
  }]);

angular.module('MyApp')
  .controller('HeaderCtrl', ["$scope", "$location", "$window", "$auth", function($scope, $location, $window, $auth) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
    
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
    
    $scope.logout = function() {
      $auth.logout();
      delete $window.localStorage.user;
      $location.path('/');
    };
  }]);

angular.module('MyApp')
  .controller('LoginCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/account');
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  }]);
angular.module('MyApp')
  .controller('ProfileCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "Account", function($scope, $rootScope, $location, $window, $auth, Account) {
    $scope.profile = $rootScope.currentUser;

    $scope.updateProfile = function() {
      Account.updateProfile($scope.profile)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.changePassword = function() {
      Account.changePassword($scope.profile)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $window.scrollTo(0, 0);
          $scope.messages = {
            error: [response.data]
          };
        });
    };
    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: [response.data]
          };
        });
    };

    $scope.deleteAccount = function() {
      Account.deleteAccount()
        .then(function() {
          $auth.logout();
          delete $window.localStorage.user;
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: [response.data]
          };
        });
    };
  }]);
angular.module('MyApp')
  .controller('ResetCtrl', ["$scope", "Account", function($scope, Account) {
    $scope.resetPassword = function() {
      Account.resetPassword($scope.user)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    }
  }]);

angular.module('MyApp')
  .controller('SignupCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  }]);
angular.module('MyApp')
  .controller('AdminCommitteesCtrl', ["$scope", "$rootScope", "$uibModal", "$auth", "Admin", "Committee", function($scope, $rootScope, $uibModal, $auth, Admin, Committee) {
  	$scope.committees = [];
    $scope.users = [];
    $scope.userIdToName = {};
    $scope.newCommittee = {};
    $scope.newCommittee.members = [];
  	$scope.currentUser = $rootScope.currentUser;

    Admin.getUsers()
      .then(function(response) {
        $scope.users = response.data.users;
        for(let i = 0; i < $scope.users.length; i++) {
          $scope.userIdToName[$scope.users[i]._id] = $scope.users[i].name;
        }
      })
      .catch(function(response) {
        console.log(response);
      });

  	Committee.getCommittees()
  		.then(function(response) {
  			$scope.committees = response.data.committees;
  		})
  		.catch(function(response) {
  			console.log(response);
  		});

    // typeahead-on-select($item, $model, $label, $event)
    $scope.addUserToNewCommittee = function(item, model, label) {
      if($scope.newCommittee.members.indexOf(item) == -1) {
        $scope.newCommittee.members.push(item);
      }
      $scope.selected = null;
    }

    $scope.removeUserFromNewCommittee = function(item) {
      $scope.newCommittee.members.splice($scope.newCommittee.members.indexOf(item), 1);
    }

  	$scope.createNewCommittee = function() {
      let toSend = (JSON.parse(JSON.stringify($scope.newCommittee)));
      toSend.members = [];
      for(let i = 0; i < $scope.newCommittee.members.length; i++) {
        toSend.members.push($scope.newCommittee.members[i]._id); 
      }
      Admin.postCommittee(toSend)
        .then(function(response) {
          $scope.committees.push(response.data.committee);
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
      $scope.newCommittee = {};
      $scope.newCommittee.members = [];
    };

    $scope.getLabelColor = function(name) {
      if(!name) {
        return 'danger';
      }
      let len = name.length % 6;
      switch(len){
        case 0: return 'default';
        case 1: return 'primary';
        case 2: return 'success';
        case 3: return 'warning';
        case 4: return 'info';
        default: return 'danger';
      }
    };

    $scope.open = function(index) {
      var modalInstance = $uibModal.open({
        animation: false,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'editCommitteeModal.html',
        controller: 'EditCommitteeInstanceCtrl',
        controllerAs: '$ctrl',
        size: 'md',
        resolve: {
          data: function () {
            let data = {};
            data.committee = $scope.committees[index];
            data.userIdToName = $scope.userIdToName;
            data.getLabelColor = $scope.getLabelColor;
            data.users = $scope.users;
            return data;
          }
        }
      });

      modalInstance.result.then(function (del) {
        if(del) {
          Admin.deleteUser($scope.users[index]._id).then(function(response) {
            $scope.users.splice(index, 1);
          })
          .catch(function(response) {
            console.log(response);
          });
        }
      });
    };

}]);

angular.module('MyApp').controller('EditCommitteeInstanceCtrl', ["$uibModalInstance", "data", function ($uibModalInstance, data) {
  let $ctrl = this;
  $ctrl.committee = (JSON.parse(JSON.stringify(data.committee)));
  $ctrl.userIdToName = data.userIdToName;
  $ctrl.getLabelColor = data.getLabelColor;
  $ctrl.users = data.users;

  $ctrl.delete = function () {
    $uibModalInstance.close(true);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss(false);
  };

  $ctrl.saveChanges = function () {
    console.log($ctrl.committee);
  };
}]);

angular.module('MyApp')
  .controller('AdminUsersCtrl', ["$scope", "$rootScope", "$uibModal", "$auth", "Admin", function($scope, $rootScope, $uibModal, $auth, Admin) {
  	$scope.users = [];
  	$scope.currentUser = $rootScope.currentUser;
    $scope.userToDelete = null;

  	$scope.levelOptions = [
		    { name: 'Unapproved', value: 0 },
		    { name: 'Poster', value: 1 },
		    { name: 'Admin', value: 2 }
		];


  	Admin.getUsers()
  		.then(function(response) {
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

    $scope.open = function(index) {
      var modalInstance = $uibModal.open({
        animation: false,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'userDeleteModal.html',
        controller: 'DeleteUserInstanceCtrl',
        controllerAs: '$ctrl',
        size: 'md',
        resolve: {
          user: function () {
            return $scope.users[index];
          }
        }
      });

      modalInstance.result.then(function (del) {
        if(del) {
          Admin.deleteUser($scope.users[index]._id).then(function(response) {
            $scope.users.splice(index, 1);
          })
          .catch(function(response) {
            console.log(response);
          });
        }
      });
    };


}]);


angular.module('MyApp').controller('DeleteUserInstanceCtrl', ["$uibModalInstance", "user", function ($uibModalInstance, user) {
  let $ctrl = this;
  let levels = ['Unapproved', 'Poster', 'Admin'];
  $ctrl.user = user;
  $ctrl.userLevelStr = levels[user.level];

  $ctrl.ok = function () {
    $uibModalInstance.close(true);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss(false);
  };
}]);
angular.module('MyApp')
  .factory('Account', ["$http", function($http) {
    return {
      updateProfile: function(data) {
        return $http.put('/account', data);
      },
      changePassword: function(data) {
        return $http.put('/account', data);
      },
      deleteAccount: function() {
        return $http.delete('/account');
      },
      forgotPassword: function(data) {
        return $http.post('/forgot', data);
      },
      resetPassword: function(data) {
        return $http.post('/reset', data);
      }
    };
  }]);
angular.module('MyApp')
  .factory('Admin', ["$http", function($http) {
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
      }
    };
  }]);
angular.module('MyApp')
  .factory('Committee', ["$http", function($http) {
    return {
      getCommittees: function() {
        return $http.get('/committees');
      }
    };
  }]);
angular.module('MyApp')
  .factory('Contact', ["$http", function($http) {
    return {
      send: function(data) {
        return $http.post('/contact', data);
      }
    };
  }]);