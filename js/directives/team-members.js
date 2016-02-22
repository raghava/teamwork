app.directive('teamMembers', function(MemberService){
  return {
    templateUrl: 'https://rawgithub.com/raghava/teamwork/master/js/templates/team-members.html',
    link: function($scope, ele){
        $scope.filterByName = '';
        $scope.members = MemberService.fetch();
        $scope.avatar = function(member){
          return MemberService.getAvatarClass(member);
        };

        $scope.add = function(member){
          if(!member){
            member = { username: ''};
          }

          MemberService.create(member)
          .result
          .then(function(options){
            if(options.member && options.member.username && !options.member.id){
                options.member.id = $scope.members.length+1;
                options.member.avatar = 'avatar-color-'+(Math.floor(Math.random() * 215) + 1 );
                $scope.members.push(options.member);
            }
          });
        };
    }
  };
});
