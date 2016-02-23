app.directive('teamMemberCard', function(MemberService, $rootScope, TasksService){
  return {
    templateUrl: 'templates/team-member-card.html',
    link: function($scope){

      var colors = ['blue', 'green', 'yellow', 'red'];

      $scope.memberId = null;
      $scope.get = function(){
        // get random theme
        $scope.themeColor = 'bg-'+colors[(Math.floor(Math.random() * 4) )];

        $scope.member = MemberService.getById($scope.memberId);
        $scope.tasks = TasksService.byMemberId($scope.memberId);
      };

      $scope.show = function(){
        return ($scope.memberId && $scope.member && $scope.member.id);
      };

      $scope.isAllDay = function(allDay){
        return allDay? 'YES' : 'NO';
      };

      $scope.close = function(){
        $scope.memberId = $scope.member = null;
        $rootScope.$emit('MEMBER:UNSELECT');
      };

      $rootScope.$on('MEMBER:SELECT', function(ev, memberId){
        $scope.memberId = memberId;
        $scope.get();
      });

      if($scope.memberId) {
        $scope.get();
      }
    }
  };
});
