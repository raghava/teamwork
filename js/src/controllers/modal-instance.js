app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, options) {

  $scope.options = options;

  $scope.ok = function () {
    $uibModalInstance.close(options);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss();
  };
});
