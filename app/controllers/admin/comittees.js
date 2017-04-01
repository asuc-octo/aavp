angular.module('MyApp')
  .controller('AdminCommitteesCtrl', function($scope, $rootScope, $uibModal, $auth, Admin, Committee) {
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
        case 1: return 'danger';
        case 2: return 'success';
        case 3: return 'warning';
        case 4: return 'info';
        default: return 'primary';
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
        size: 'lg',
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

      modalInstance.result.then(function (committee) {
        if(!committee) {
          Admin.deleteCommittee($scope.committees[index]._id).then(function(response) {
            $scope.committees.splice(index, 1);
          })
          .catch(function(response) {
            console.log(response);
          });
        } else {
          Admin.putCommittee(committee).then(function(response) {
            $scope.committees[index] = committee;
          }).catch(function(response) {
            console.log(response);
          });
        }
      });
    };

});

angular.module('MyApp').controller('EditCommitteeInstanceCtrl', function ($uibModalInstance, data) {
  let $ctrl = this;
  $ctrl.committee = (JSON.parse(JSON.stringify(data.committee)));
  $ctrl.userIdToName = data.userIdToName;
  $ctrl.getLabelColor = data.getLabelColor;
  $ctrl.users = data.users;

  $ctrl.addUserToCommittee = function(item, model, label) {
    if($ctrl.committee.members.indexOf(item._id) == -1) {
      $ctrl.committee.members.push(item._id);
    }
    $ctrl.selected = null;
  }

  $ctrl.removeUserFromCommittee = function(item) {
    $ctrl.committee.members.splice($ctrl.committee.members.indexOf(item), 1);
  }

  $ctrl.delete = function () {
    $uibModalInstance.close(false);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss(false);
  };

  $ctrl.saveChanges = function () {
    $uibModalInstance.close($ctrl.committee);
  };
});
