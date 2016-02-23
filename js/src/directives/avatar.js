app.directive('avatar', function(MemberService){
  return {
    scope: {
      memberId: '=',
      size: '@'
    },
    link: function($scope, ele){
      $scope.init = function(){
        ele.html('').append(MemberService.avatar(MemberService.getById($scope.memberId), $scope.size));
      };

      $scope.$watch('memberId', $scope.init, true);
    }
  };
});
