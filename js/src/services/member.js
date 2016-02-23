app.service('MemberService', function($uibModal) {
  var cached = [
    {
      id: 1,
      username: 'David',
      role: 'Developer',
      avatar: 'avatar-color-35'
    },
    {
      id: 2,
      username: 'Alex',
      role: 'UI Developer',
      avatar: 'avatar-color-25'
    },
    {
      id: 3,
      username: 'Bobby',
      role: 'QA Engineer',
      avatar: 'avatar-color-40'
    },
    {
      id: 4,
      username: 'Matt',
      role: 'Product Guy',
      avatar: 'avatar-color-200'
    },
    {
      id: 5,
      username: 'Deep',
      role: 'Build Guy',
      avatar: 'avatar-color-20'
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
      templateUrl: 'templates/member-modal.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        options: {
          member: member
        }
      }
    });
  };
});
