app.directive('teamMemberCard', function(MemberService, $rootScope, TasksService){
  return {
    templateUrl: 'templates/team-member-card.html',
    link: function($scope){

      var colors = ['blue', 'green', 'yellow', 'red'];

      // get random theme
      $scope.themeColor = 'bg-'+colors[(Math.floor(Math.random() * 4) )];

      $scope.memberId = null;
      $scope.get = function(){
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

      $scope.create = function(){
        var d = new Date();
        var task = {
          memberId: $scope.memberId,
          title: '',
          start: d,
          end: d
        };

        TasksService.modal(task)
          .result.then(function(options){
            TasksService.add(options.task);
            $rootScope.$emit('MEMBER:SELECT', $scope.memberId);
          });
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
