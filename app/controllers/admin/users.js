angular.module('MyApp')
  .controller('AdminUsersCtrl', function($scope, $rootScope, $uibModal, $auth, Admin) {
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
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
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


});


angular.module('MyApp').controller('ModalInstanceCtrl', function ($uibModalInstance, user) {
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
});