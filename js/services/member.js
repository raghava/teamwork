app.service('MemberService', function($uibModal) {
  var cached = [
    {
      id: 1,
      username: 'David',
      avatar: 'avatar-color-35'
    },
    {
      id: 2,
      username: 'Alex',
      avatar: 'avatar-color-25'
    },
    {
      id: 3,
      username: 'Bobby',
      avatar: 'avatar-color-40'
    }
  ];

  var membersById = {};
  angular.forEach(cached, function(member){
    membersById[member.id] = member;
  });

  this.fetch = function() {
    return cached;
  };

  this.getById = function(memberId) {
    return membersById[memberId];
  };

  this.getAvatarClass = function(member, size){
    var name = member.avatar+' '+'avatar-letter-'+(member.username.toLowerCase().charAt(0));
    size = (size || '');
    return 'avatar avatar-plain avatar-margin '+size+' '+name;
  };

  this.avatar = function(member, size){
    return '<i class="'+this.getAvatarClass.apply(this, arguments)+'"></i>';
  };

  this.create = function(member){
    return $uibModal.open({
      templateUrl: 'https://rawgithub.com/raghava/teamwork/master/js/templates/member-modal.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        options: {
          member: member
        }
      }
    });
  };
});
