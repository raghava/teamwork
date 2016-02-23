var app = angular.module('app', ['ui.calendar', 'ui.bootstrap']);
angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("templates/calendar-event.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">Event</h3>\n</div>\n<div class=\"modal-body\">\n  \n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ok()\">OK</button>\n  <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n</div>\n");
$templateCache.put("templates/member-modal.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">New Member</h3>\n</div>\n<div class=\"modal-body\">\n  <form>\n  <div class=\"form-group\">\n    <label>Username</label>\n    <input type=\"text\" class=\"form-control\" ng-model=\"options.member.username\" placeholder=\"Username\">\n  </div>\n</form>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ok()\">OK</button>\n  <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n</div>\n");
$templateCache.put("templates/task-modal.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">Task</h3>\n</div>\n<div class=\"modal-body\">\n  <form>\n\n    <div class=\"form-group\">\n      <avatar ng-if=\"options.member.id\" member-id=\"options.member.id\" size=\"avatar-md\" style=\"float:left;\"></avatar>\n      <h2>{{ options.member.username }}</h2>\n    </div>\n    <br><br>\n\n    <div class=\"form-group\">\n      <label>Title</label>\n      <input type=\"text\" class=\"form-control\" ng-model=\"options.task.title\" placeholder=\"Task title\">\n    </div>\n\n    <div class=\"form-group\">\n      <label>Start Date</label>\n      <input type=\"date\" class=\"form-control\" ng-model=\"options.task.start\">\n    </div>\n\n    <div class=\"form-group\">\n      <label>End Date</label>\n      <input type=\"date\" class=\"form-control\" ng-model=\"options.task.end\">\n    </div>\n\n  </form>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ok()\">OK</button>\n  <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n</div>\n");
$templateCache.put("templates/team-member-card.html","<div class=\"box box-widget widget-user-2\" ng-if=\"show()\">\n  <!-- Add the bg color to the header using any of the bg-* classes -->\n  <div class=\"widget-user-header\" ng-class=\"themeColor\">\n\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" ng-click=\"close()\">\n      <span aria-hidden=\"true\">x</span>\n    </button>\n\n    <div class=\"widget-user-image\">\n      <avatar ng-if=\"member.id\" member-id=\"member.id\" size=\"avatar-md\"></avatar>\n    </div>\n    <!-- /.widget-user-image -->\n    <h3 class=\"widget-user-username\">{{ member.username }}</h3>\n    <h5 class=\"widget-user-desc\">{{ member.role }}</h5>\n  </div>\n  <div class=\"box-footer no-padding\">\n    <ul class=\"nav nav-stacked\">\n      <li>\n        <a href=\"#\">\n          <b>Tasks</b>\n          <span class=\"pull-right badge bg-aqua\" ng-click=\"create()\">+ New</span>\n        </a>\n      </li>\n    </ul>\n    <ul class=\"products-list product-list-in-box\" style=\"margin-bottom: 0px;\">\n      <li ng-repeat=\"task in tasks\" class=\"item\" style=\"padding: 0px;\">\n        <div class=\"box box-task-card\">\n\n          <div class=\"box-header\">\n            <h3 class=\"box-title\">Task#{{ $index+1 }} {{ task.title }}</h3>\n          </div>\n\n          <table class=\"table\">\n            <tbody>\n            <tr>\n              <td>Start date</td>\n              <td>{{ task.start | date: \'short\'}}</td>\n            <tr>\n            <tr>\n              <td>End date</td>\n              <td>{{ task.end | date: \'short\'}}</td>\n            <tr>\n            </tbody>\n          </table>\n\n        </div>\n      </li>\n    </ul>\n  </div>\n</div>");
$templateCache.put("templates/team-members.html","<!-- search form (Optional) -->\n<div class=\"sidebar-form\">\n  <div class=\"input-group\">\n    <input type=\"text\" name=\"q\" class=\"form-control\" placeholder=\"Search...\" ng-model=\"filterByName\">\n    <span class=\"input-group-btn\">\n      <button type=\"button\" name=\"search\" id=\"search-btn\" class=\"btn btn-flat\"><i class=\"fa fa-search\"></i></button>\n    </span>\n  </div>\n</div>\n<!-- /.search form -->\n\n<!-- Sidebar Menu -->\n<ul class=\"sidebar-menu\">\n  <li class=\"header\">\n    MEMBERS\n  </li>\n  <li ng-repeat=\"member in members | filter: { username: filterByName }\" ng-model=\"member\" ng-click=\"select(member.id)\">\n    <a href=\"#\"><i ng-class=\"avatar(member)\"></i>&nbsp;{{ member.username}}</a>\n  </li>\n</ul>\n");}]);
// calendar controller
app.controller('calendarCtrl', function($scope, $compile, uiCalendarConfig, MemberService, TasksService, $rootScope) {

  $scope.eventRender = function(event, element, view) {
    var member = MemberService.getById(event.memberId);
    var avatar = angular.element(MemberService.avatar(member, ((view.type === 'month')? 'avatar-sm' : '')));
    if(view.type === 'month'){
      element.find('.fc-time').before(avatar);
    } else {
      var user = angular.element('<div>').html(member.username).addClass('avatar-username').prepend(avatar);
      element.find('.fc-time').before(user);
    }
    element.css({
      padding: '3px'
    });
  };

  $scope.mode = 'ALL';
  $scope.eventClick = function(event) {
    var task = {
      id: event.id,
      memberId: event.memberId,
      title: event.title,
      start: event._start._d
    };

    if(event._end && event._end._d) {
      task.end = event._end._d;
    }

    TasksService.modal(task)
      .result.then(function(options){
        TasksService.update(options.task);
        if($scope.mode === 'MEMBER') {
          $rootScope.$emit('MEMBER:SELECT', options.task.memberId);
        } else {
          $rootScope.$emit('MEMBER:UNSELECT');
        }
      });
  };

  /* event source that contains custom events on the scope */
  $scope.events = TasksService.fetch();

  /* config object */
  $scope.uiConfig = {
    calendar: {
      height: 600,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek'
      },
      buttonText: {
        today: 'today',
        month: 'month',
        week: 'week'
      },
      events: $scope.events,
      eventClick: $scope.eventClick,
      eventRender: $scope.eventRender,
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    }
  };
  /* event sources array*/
  $scope.eventSources = [];

  $rootScope.$on('MEMBER:SELECT', function(ev, memberId){
    $scope.mode = 'MEMBER';
    $scope.uiConfig.calendar.events = TasksService.byMemberId(memberId);
  });

  $rootScope.$on('MEMBER:UNSELECT', function(ev){
    $scope.mode = 'ALL';
    $scope.uiConfig.calendar.events = TasksService.fetch();
  });

});
app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, options) {

  $scope.options = options;

  $scope.ok = function () {
    $uibModalInstance.close(options);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss();
  };
});

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

app.directive('teamMembers', function(MemberService, $rootScope) {
  return {
    templateUrl: 'templates/team-members.html',
    link: function($scope, ele) {
      $scope.filterByName = '';
      $scope.members = MemberService.fetch();
      $scope.avatar = function(member) {
        return MemberService.getAvatarClass(member);
      };

      $scope.select = function(memberId) {
        $rootScope.$emit('MEMBER:SELECT', memberId);
      };

      $scope.add = function(member) {
        if (!member) {
          member = {username: ''};
        }

        MemberService.create(member)
          .result
          .then(function(options) {
            if (options.member && options.member.username && !options.member.id) {
              options.member.id = $scope.members.length + 1;
              options.member.avatar = 'avatar-color-' + (Math.floor(Math.random() * 215) + 1 );
              $scope.members.push(options.member);
            }
          });
      };
    }
  };
});

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

app.service('TasksService', function($uibModal, MemberService) {
  var date = new Date(),
    d = date.getDate(),
    m = date.getMonth(),
    y = date.getFullYear(),
    cached = [
      {
        id: 1,
        title: 'Working on test cases',
        start: new Date(y, m, 1),
        end: new Date(y, m, 2),
        memberId: 1
      },
      {
        id: 2,
        title: 'Bug-136346993',
        start: new Date(y, m, d + 4, 16, 0),
        allDay: true,
        memberId: 1
      },
      {
        id: 3,
        title: 'Bug-136346443',
        start: new Date(y, m, d - 5),
        end: new Date(y, m, d - 2),
        memberId: 2
      },
      {
        id: 4,
        title: 'UI transformation of project home page',
        start: new Date(y, m, d - 3, 16, 0),
        allDay: true,
        memberId: 3
      },
      {
        id: 5,
        title: 'Database architecture redesign',
        start: new Date(y, m, d + 1, 19, 0),
        end: new Date(y, m, d + 1, 22, 30),
        allDay: true,
        memberId: 2
      },
      {
        id: 6,
        title: 'jQuery framework evaluation',
        start: new Date(y, m, d + 4, 16, 0),
        allDay: true,
        memberId: 3
      },
      {
        id: 7,
        title: 'Product Road Map planning',
        start: new Date(y, m, 1),
        memberId: 4
      },
      {
        id: 8,
        title: 'UI transformation of project home page',
        start: new Date(y, m, d - 3, 16, 0),
        allDay: true,
        memberId: 4
      },
      {
        id: 9,
        title: 'Bug-136346993',
        start: new Date(y, m, d + 3, 16, 0),
        allDay: true,
        memberId: 5
      },
      {
        id: 10,
        title: 'UI Review',
        start: new Date(y, m, d + 3, 19, 0),
        end: new Date(y, m, d + 4, 22, 30),
        allDay: true,
        memberId: 3
      },
      {
        id: 11,
        title: 'jQuery framework evaluation',
        start: new Date(y, m, d + 4, 16, 0),
        allDay: true,
        memberId: 3
      },
      {
        id: 12,
        title: 'Vaction',
        start: new Date(y, m, d),
        end: new Date(y, m, d + 3),
        allDay: false,
        memberId: 1,
        className: ['vaction']
      },
      {
        id: 13,
        title: 'Vaction',
        start: new Date(y, m, d + 6),
        end: new Date(y, m, d + 7),
        allDay: false,
        memberId: 3,
        className: ['vaction']
      },
    ];

  this.byMemberId = function(memberId) {
    return _.filter(cached, function(task) {
      return task.memberId === memberId;
    });
  };

  this.getIndex = function(task) {
    var index = -1;
    _.each(this.fetch(), function(_task, _index) {
      if (task.id === _task.id) {
        index = _index;
      }
    });
    return index;
  };

  this.fetch = function() {
    return cached;
  };

  this.add = function(task) {
    cached.push(task);
  };

  this.update = function(task) {
    cached[this.getIndex(task)] = task;
  };

  this.modal = function(task) {
    return $uibModal.open({
      templateUrl: 'templates/task-modal.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        options: {
          member: MemberService.getById(task.memberId),
          task: task
        }
      }
    });
  };

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInRlbXBsYXRlcy5qcyIsImNvbnRyb2xsZXJzL2NhbGVuZGFyQ3RybC5qcyIsImNvbnRyb2xsZXJzL21vZGFsLWluc3RhbmNlLmpzIiwiZGlyZWN0aXZlcy9hdmF0YXIuanMiLCJkaXJlY3RpdmVzL3RlYW0tbWVtYmVyLWNhcmQuanMiLCJkaXJlY3RpdmVzL3RlYW0tbWVtYmVycy5qcyIsInNlcnZpY2VzL21lbWJlci5qcyIsInNlcnZpY2VzL3Rhc2tzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLmNhbGVuZGFyJywgJ3VpLmJvb3RzdHJhcCddKTsiLCJhbmd1bGFyLm1vZHVsZShcImFwcFwiKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHskdGVtcGxhdGVDYWNoZS5wdXQoXCJ0ZW1wbGF0ZXMvY2FsZW5kYXItZXZlbnQuaHRtbFwiLFwiPGRpdiBjbGFzcz1cXFwibW9kYWwtaGVhZGVyXFxcIj5cXG4gIDxoMyBjbGFzcz1cXFwibW9kYWwtdGl0bGVcXFwiPkV2ZW50PC9oMz5cXG48L2Rpdj5cXG48ZGl2IGNsYXNzPVxcXCJtb2RhbC1ib2R5XFxcIj5cXG4gIFxcbjwvZGl2PlxcbjxkaXYgY2xhc3M9XFxcIm1vZGFsLWZvb3RlclxcXCI+XFxuICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgbmctY2xpY2s9XFxcIm9rKClcXFwiPk9LPC9idXR0b24+XFxuICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXdhcm5pbmdcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgbmctY2xpY2s9XFxcImNhbmNlbCgpXFxcIj5DYW5jZWw8L2J1dHRvbj5cXG48L2Rpdj5cXG5cIik7XG4kdGVtcGxhdGVDYWNoZS5wdXQoXCJ0ZW1wbGF0ZXMvbWVtYmVyLW1vZGFsLmh0bWxcIixcIjxkaXYgY2xhc3M9XFxcIm1vZGFsLWhlYWRlclxcXCI+XFxuICA8aDMgY2xhc3M9XFxcIm1vZGFsLXRpdGxlXFxcIj5OZXcgTWVtYmVyPC9oMz5cXG48L2Rpdj5cXG48ZGl2IGNsYXNzPVxcXCJtb2RhbC1ib2R5XFxcIj5cXG4gIDxmb3JtPlxcbiAgPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+XFxuICAgIDxsYWJlbD5Vc2VybmFtZTwvbGFiZWw+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBuZy1tb2RlbD1cXFwib3B0aW9ucy5tZW1iZXIudXNlcm5hbWVcXFwiIHBsYWNlaG9sZGVyPVxcXCJVc2VybmFtZVxcXCI+XFxuICA8L2Rpdj5cXG48L2Zvcm0+XFxuPC9kaXY+XFxuPGRpdiBjbGFzcz1cXFwibW9kYWwtZm9vdGVyXFxcIj5cXG4gIDxidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBuZy1jbGljaz1cXFwib2soKVxcXCI+T0s8L2J1dHRvbj5cXG4gIDxidXR0b24gY2xhc3M9XFxcImJ0biBidG4td2FybmluZ1xcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBuZy1jbGljaz1cXFwiY2FuY2VsKClcXFwiPkNhbmNlbDwvYnV0dG9uPlxcbjwvZGl2PlxcblwiKTtcbiR0ZW1wbGF0ZUNhY2hlLnB1dChcInRlbXBsYXRlcy90YXNrLW1vZGFsLmh0bWxcIixcIjxkaXYgY2xhc3M9XFxcIm1vZGFsLWhlYWRlclxcXCI+XFxuICA8aDMgY2xhc3M9XFxcIm1vZGFsLXRpdGxlXFxcIj5UYXNrPC9oMz5cXG48L2Rpdj5cXG48ZGl2IGNsYXNzPVxcXCJtb2RhbC1ib2R5XFxcIj5cXG4gIDxmb3JtPlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXG4gICAgICA8YXZhdGFyIG5nLWlmPVxcXCJvcHRpb25zLm1lbWJlci5pZFxcXCIgbWVtYmVyLWlkPVxcXCJvcHRpb25zLm1lbWJlci5pZFxcXCIgc2l6ZT1cXFwiYXZhdGFyLW1kXFxcIiBzdHlsZT1cXFwiZmxvYXQ6bGVmdDtcXFwiPjwvYXZhdGFyPlxcbiAgICAgIDxoMj57eyBvcHRpb25zLm1lbWJlci51c2VybmFtZSB9fTwvaDI+XFxuICAgIDwvZGl2PlxcbiAgICA8YnI+PGJyPlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXG4gICAgICA8bGFiZWw+VGl0bGU8L2xhYmVsPlxcbiAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBuZy1tb2RlbD1cXFwib3B0aW9ucy50YXNrLnRpdGxlXFxcIiBwbGFjZWhvbGRlcj1cXFwiVGFzayB0aXRsZVxcXCI+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXG4gICAgICA8bGFiZWw+U3RhcnQgRGF0ZTwvbGFiZWw+XFxuICAgICAgPGlucHV0IHR5cGU9XFxcImRhdGVcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIG5nLW1vZGVsPVxcXCJvcHRpb25zLnRhc2suc3RhcnRcXFwiPlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+XFxuICAgICAgPGxhYmVsPkVuZCBEYXRlPC9sYWJlbD5cXG4gICAgICA8aW5wdXQgdHlwZT1cXFwiZGF0ZVxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgbmctbW9kZWw9XFxcIm9wdGlvbnMudGFzay5lbmRcXFwiPlxcbiAgICA8L2Rpdj5cXG5cXG4gIDwvZm9ybT5cXG48L2Rpdj5cXG48ZGl2IGNsYXNzPVxcXCJtb2RhbC1mb290ZXJcXFwiPlxcbiAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIG5nLWNsaWNrPVxcXCJvaygpXFxcIj5PSzwvYnV0dG9uPlxcbiAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi13YXJuaW5nXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIG5nLWNsaWNrPVxcXCJjYW5jZWwoKVxcXCI+Q2FuY2VsPC9idXR0b24+XFxuPC9kaXY+XFxuXCIpO1xuJHRlbXBsYXRlQ2FjaGUucHV0KFwidGVtcGxhdGVzL3RlYW0tbWVtYmVyLWNhcmQuaHRtbFwiLFwiPGRpdiBjbGFzcz1cXFwiYm94IGJveC13aWRnZXQgd2lkZ2V0LXVzZXItMlxcXCIgbmctaWY9XFxcInNob3coKVxcXCI+XFxuICA8IS0tIEFkZCB0aGUgYmcgY29sb3IgdG8gdGhlIGhlYWRlciB1c2luZyBhbnkgb2YgdGhlIGJnLSogY2xhc3NlcyAtLT5cXG4gIDxkaXYgY2xhc3M9XFxcIndpZGdldC11c2VyLWhlYWRlclxcXCIgbmctY2xhc3M9XFxcInRoZW1lQ29sb3JcXFwiPlxcblxcbiAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImNsb3NlXFxcIiBhcmlhLWxhYmVsPVxcXCJDbG9zZVxcXCIgbmctY2xpY2s9XFxcImNsb3NlKClcXFwiPlxcbiAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIj54PC9zcGFuPlxcbiAgICA8L2J1dHRvbj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cXFwid2lkZ2V0LXVzZXItaW1hZ2VcXFwiPlxcbiAgICAgIDxhdmF0YXIgbmctaWY9XFxcIm1lbWJlci5pZFxcXCIgbWVtYmVyLWlkPVxcXCJtZW1iZXIuaWRcXFwiIHNpemU9XFxcImF2YXRhci1tZFxcXCI+PC9hdmF0YXI+XFxuICAgIDwvZGl2PlxcbiAgICA8IS0tIC8ud2lkZ2V0LXVzZXItaW1hZ2UgLS0+XFxuICAgIDxoMyBjbGFzcz1cXFwid2lkZ2V0LXVzZXItdXNlcm5hbWVcXFwiPnt7IG1lbWJlci51c2VybmFtZSB9fTwvaDM+XFxuICAgIDxoNSBjbGFzcz1cXFwid2lkZ2V0LXVzZXItZGVzY1xcXCI+e3sgbWVtYmVyLnJvbGUgfX08L2g1PlxcbiAgPC9kaXY+XFxuICA8ZGl2IGNsYXNzPVxcXCJib3gtZm9vdGVyIG5vLXBhZGRpbmdcXFwiPlxcbiAgICA8dWwgY2xhc3M9XFxcIm5hdiBuYXYtc3RhY2tlZFxcXCI+XFxuICAgICAgPGxpPlxcbiAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCI+XFxuICAgICAgICAgIDxiPlRhc2tzPC9iPlxcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicHVsbC1yaWdodCBiYWRnZSBiZy1hcXVhXFxcIiBuZy1jbGljaz1cXFwiY3JlYXRlKClcXFwiPisgTmV3PC9zcGFuPlxcbiAgICAgICAgPC9hPlxcbiAgICAgIDwvbGk+XFxuICAgIDwvdWw+XFxuICAgIDx1bCBjbGFzcz1cXFwicHJvZHVjdHMtbGlzdCBwcm9kdWN0LWxpc3QtaW4tYm94XFxcIiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTogMHB4O1xcXCI+XFxuICAgICAgPGxpIG5nLXJlcGVhdD1cXFwidGFzayBpbiB0YXNrc1xcXCIgY2xhc3M9XFxcIml0ZW1cXFwiIHN0eWxlPVxcXCJwYWRkaW5nOiAwcHg7XFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImJveCBib3gtdGFzay1jYXJkXFxcIj5cXG5cXG4gICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYm94LWhlYWRlclxcXCI+XFxuICAgICAgICAgICAgPGgzIGNsYXNzPVxcXCJib3gtdGl0bGVcXFwiPlRhc2sje3sgJGluZGV4KzEgfX0ge3sgdGFzay50aXRsZSB9fTwvaDM+XFxuICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICA8dGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIj5cXG4gICAgICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgPHRkPlN0YXJ0IGRhdGU8L3RkPlxcbiAgICAgICAgICAgICAgPHRkPnt7IHRhc2suc3RhcnQgfCBkYXRlOiBcXCdzaG9ydFxcJ319PC90ZD5cXG4gICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgPHRkPkVuZCBkYXRlPC90ZD5cXG4gICAgICAgICAgICAgIDx0ZD57eyB0YXNrLmVuZCB8IGRhdGU6IFxcJ3Nob3J0XFwnfX08L3RkPlxcbiAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICA8L3Rib2R5PlxcbiAgICAgICAgICA8L3RhYmxlPlxcblxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgPC9saT5cXG4gICAgPC91bD5cXG4gIDwvZGl2PlxcbjwvZGl2PlwiKTtcbiR0ZW1wbGF0ZUNhY2hlLnB1dChcInRlbXBsYXRlcy90ZWFtLW1lbWJlcnMuaHRtbFwiLFwiPCEtLSBzZWFyY2ggZm9ybSAoT3B0aW9uYWwpIC0tPlxcbjxkaXYgY2xhc3M9XFxcInNpZGViYXItZm9ybVxcXCI+XFxuICA8ZGl2IGNsYXNzPVxcXCJpbnB1dC1ncm91cFxcXCI+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuYW1lPVxcXCJxXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBwbGFjZWhvbGRlcj1cXFwiU2VhcmNoLi4uXFxcIiBuZy1tb2RlbD1cXFwiZmlsdGVyQnlOYW1lXFxcIj5cXG4gICAgPHNwYW4gY2xhc3M9XFxcImlucHV0LWdyb3VwLWJ0blxcXCI+XFxuICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIG5hbWU9XFxcInNlYXJjaFxcXCIgaWQ9XFxcInNlYXJjaC1idG5cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWZsYXRcXFwiPjxpIGNsYXNzPVxcXCJmYSBmYS1zZWFyY2hcXFwiPjwvaT48L2J1dHRvbj5cXG4gICAgPC9zcGFuPlxcbiAgPC9kaXY+XFxuPC9kaXY+XFxuPCEtLSAvLnNlYXJjaCBmb3JtIC0tPlxcblxcbjwhLS0gU2lkZWJhciBNZW51IC0tPlxcbjx1bCBjbGFzcz1cXFwic2lkZWJhci1tZW51XFxcIj5cXG4gIDxsaSBjbGFzcz1cXFwiaGVhZGVyXFxcIj5cXG4gICAgTUVNQkVSU1xcbiAgPC9saT5cXG4gIDxsaSBuZy1yZXBlYXQ9XFxcIm1lbWJlciBpbiBtZW1iZXJzIHwgZmlsdGVyOiB7IHVzZXJuYW1lOiBmaWx0ZXJCeU5hbWUgfVxcXCIgbmctbW9kZWw9XFxcIm1lbWJlclxcXCIgbmctY2xpY2s9XFxcInNlbGVjdChtZW1iZXIuaWQpXFxcIj5cXG4gICAgPGEgaHJlZj1cXFwiI1xcXCI+PGkgbmctY2xhc3M9XFxcImF2YXRhcihtZW1iZXIpXFxcIj48L2k+Jm5ic3A7e3sgbWVtYmVyLnVzZXJuYW1lfX08L2E+XFxuICA8L2xpPlxcbjwvdWw+XFxuXCIpO31dKTsiLCIvLyBjYWxlbmRhciBjb250cm9sbGVyXG5hcHAuY29udHJvbGxlcignY2FsZW5kYXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkY29tcGlsZSwgdWlDYWxlbmRhckNvbmZpZywgTWVtYmVyU2VydmljZSwgVGFza3NTZXJ2aWNlLCAkcm9vdFNjb3BlKSB7XG5cbiAgJHNjb3BlLmV2ZW50UmVuZGVyID0gZnVuY3Rpb24oZXZlbnQsIGVsZW1lbnQsIHZpZXcpIHtcbiAgICB2YXIgbWVtYmVyID0gTWVtYmVyU2VydmljZS5nZXRCeUlkKGV2ZW50Lm1lbWJlcklkKTtcbiAgICB2YXIgYXZhdGFyID0gYW5ndWxhci5lbGVtZW50KE1lbWJlclNlcnZpY2UuYXZhdGFyKG1lbWJlciwgKCh2aWV3LnR5cGUgPT09ICdtb250aCcpPyAnYXZhdGFyLXNtJyA6ICcnKSkpO1xuICAgIGlmKHZpZXcudHlwZSA9PT0gJ21vbnRoJyl7XG4gICAgICBlbGVtZW50LmZpbmQoJy5mYy10aW1lJykuYmVmb3JlKGF2YXRhcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1c2VyID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2PicpLmh0bWwobWVtYmVyLnVzZXJuYW1lKS5hZGRDbGFzcygnYXZhdGFyLXVzZXJuYW1lJykucHJlcGVuZChhdmF0YXIpO1xuICAgICAgZWxlbWVudC5maW5kKCcuZmMtdGltZScpLmJlZm9yZSh1c2VyKTtcbiAgICB9XG4gICAgZWxlbWVudC5jc3Moe1xuICAgICAgcGFkZGluZzogJzNweCdcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUubW9kZSA9ICdBTEwnO1xuICAkc2NvcGUuZXZlbnRDbGljayA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIHRhc2sgPSB7XG4gICAgICBpZDogZXZlbnQuaWQsXG4gICAgICBtZW1iZXJJZDogZXZlbnQubWVtYmVySWQsXG4gICAgICB0aXRsZTogZXZlbnQudGl0bGUsXG4gICAgICBzdGFydDogZXZlbnQuX3N0YXJ0Ll9kXG4gICAgfTtcblxuICAgIGlmKGV2ZW50Ll9lbmQgJiYgZXZlbnQuX2VuZC5fZCkge1xuICAgICAgdGFzay5lbmQgPSBldmVudC5fZW5kLl9kO1xuICAgIH1cblxuICAgIFRhc2tzU2VydmljZS5tb2RhbCh0YXNrKVxuICAgICAgLnJlc3VsdC50aGVuKGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICBUYXNrc1NlcnZpY2UudXBkYXRlKG9wdGlvbnMudGFzayk7XG4gICAgICAgIGlmKCRzY29wZS5tb2RlID09PSAnTUVNQkVSJykge1xuICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoJ01FTUJFUjpTRUxFQ1QnLCBvcHRpb25zLnRhc2subWVtYmVySWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoJ01FTUJFUjpVTlNFTEVDVCcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfTtcblxuICAvKiBldmVudCBzb3VyY2UgdGhhdCBjb250YWlucyBjdXN0b20gZXZlbnRzIG9uIHRoZSBzY29wZSAqL1xuICAkc2NvcGUuZXZlbnRzID0gVGFza3NTZXJ2aWNlLmZldGNoKCk7XG5cbiAgLyogY29uZmlnIG9iamVjdCAqL1xuICAkc2NvcGUudWlDb25maWcgPSB7XG4gICAgY2FsZW5kYXI6IHtcbiAgICAgIGhlaWdodDogNjAwLFxuICAgICAgaGVhZGVyOiB7XG4gICAgICAgIGxlZnQ6ICdwcmV2LG5leHQgdG9kYXknLFxuICAgICAgICBjZW50ZXI6ICd0aXRsZScsXG4gICAgICAgIHJpZ2h0OiAnbW9udGgsYWdlbmRhV2VlaydcbiAgICAgIH0sXG4gICAgICBidXR0b25UZXh0OiB7XG4gICAgICAgIHRvZGF5OiAndG9kYXknLFxuICAgICAgICBtb250aDogJ21vbnRoJyxcbiAgICAgICAgd2VlazogJ3dlZWsnXG4gICAgICB9LFxuICAgICAgZXZlbnRzOiAkc2NvcGUuZXZlbnRzLFxuICAgICAgZXZlbnRDbGljazogJHNjb3BlLmV2ZW50Q2xpY2ssXG4gICAgICBldmVudFJlbmRlcjogJHNjb3BlLmV2ZW50UmVuZGVyLFxuICAgICAgZGF5TmFtZXM6IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdLFxuICAgICAgZGF5TmFtZXNTaG9ydDogW1wiU3VuXCIsIFwiTW9uXCIsIFwiVHVlXCIsIFwiV2VkXCIsIFwiVGh1XCIsIFwiRnJpXCIsIFwiU2F0XCJdXG4gICAgfVxuICB9O1xuICAvKiBldmVudCBzb3VyY2VzIGFycmF5Ki9cbiAgJHNjb3BlLmV2ZW50U291cmNlcyA9IFtdO1xuXG4gICRyb290U2NvcGUuJG9uKCdNRU1CRVI6U0VMRUNUJywgZnVuY3Rpb24oZXYsIG1lbWJlcklkKXtcbiAgICAkc2NvcGUubW9kZSA9ICdNRU1CRVInO1xuICAgICRzY29wZS51aUNvbmZpZy5jYWxlbmRhci5ldmVudHMgPSBUYXNrc1NlcnZpY2UuYnlNZW1iZXJJZChtZW1iZXJJZCk7XG4gIH0pO1xuXG4gICRyb290U2NvcGUuJG9uKCdNRU1CRVI6VU5TRUxFQ1QnLCBmdW5jdGlvbihldil7XG4gICAgJHNjb3BlLm1vZGUgPSAnQUxMJztcbiAgICAkc2NvcGUudWlDb25maWcuY2FsZW5kYXIuZXZlbnRzID0gVGFza3NTZXJ2aWNlLmZldGNoKCk7XG4gIH0pO1xuXG59KTsiLCJhcHAuY29udHJvbGxlcignTW9kYWxJbnN0YW5jZUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkdWliTW9kYWxJbnN0YW5jZSwgb3B0aW9ucykge1xuXG4gICRzY29wZS5vcHRpb25zID0gb3B0aW9ucztcblxuICAkc2NvcGUub2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2Uob3B0aW9ucyk7XG4gIH07XG5cbiAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG4gIH07XG59KTtcbiIsImFwcC5kaXJlY3RpdmUoJ2F2YXRhcicsIGZ1bmN0aW9uKE1lbWJlclNlcnZpY2Upe1xuICByZXR1cm4ge1xuICAgIHNjb3BlOiB7XG4gICAgICBtZW1iZXJJZDogJz0nLFxuICAgICAgc2l6ZTogJ0AnXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZSl7XG4gICAgICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGVsZS5odG1sKCcnKS5hcHBlbmQoTWVtYmVyU2VydmljZS5hdmF0YXIoTWVtYmVyU2VydmljZS5nZXRCeUlkKCRzY29wZS5tZW1iZXJJZCksICRzY29wZS5zaXplKSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuJHdhdGNoKCdtZW1iZXJJZCcsICRzY29wZS5pbml0LCB0cnVlKTtcbiAgICB9XG4gIH07XG59KTtcbiIsImFwcC5kaXJlY3RpdmUoJ3RlYW1NZW1iZXJDYXJkJywgZnVuY3Rpb24oTWVtYmVyU2VydmljZSwgJHJvb3RTY29wZSwgVGFza3NTZXJ2aWNlKXtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy90ZWFtLW1lbWJlci1jYXJkLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSl7XG5cbiAgICAgIHZhciBjb2xvcnMgPSBbJ2JsdWUnLCAnZ3JlZW4nLCAneWVsbG93JywgJ3JlZCddO1xuXG4gICAgICAvLyBnZXQgcmFuZG9tIHRoZW1lXG4gICAgICAkc2NvcGUudGhlbWVDb2xvciA9ICdiZy0nK2NvbG9yc1soTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCkgKV07XG5cbiAgICAgICRzY29wZS5tZW1iZXJJZCA9IG51bGw7XG4gICAgICAkc2NvcGUuZ2V0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLm1lbWJlciA9IE1lbWJlclNlcnZpY2UuZ2V0QnlJZCgkc2NvcGUubWVtYmVySWQpO1xuICAgICAgICAkc2NvcGUudGFza3MgPSBUYXNrc1NlcnZpY2UuYnlNZW1iZXJJZCgkc2NvcGUubWVtYmVySWQpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnNob3cgPSBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gKCRzY29wZS5tZW1iZXJJZCAmJiAkc2NvcGUubWVtYmVyICYmICRzY29wZS5tZW1iZXIuaWQpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLmlzQWxsRGF5ID0gZnVuY3Rpb24oYWxsRGF5KXtcbiAgICAgICAgcmV0dXJuIGFsbERheT8gJ1lFUycgOiAnTk8nO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLmNsb3NlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLm1lbWJlcklkID0gJHNjb3BlLm1lbWJlciA9IG51bGw7XG4gICAgICAgICRyb290U2NvcGUuJGVtaXQoJ01FTUJFUjpVTlNFTEVDVCcpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBkID0gbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIHRhc2sgPSB7XG4gICAgICAgICAgbWVtYmVySWQ6ICRzY29wZS5tZW1iZXJJZCxcbiAgICAgICAgICB0aXRsZTogJycsXG4gICAgICAgICAgc3RhcnQ6IGQsXG4gICAgICAgICAgZW5kOiBkXG4gICAgICAgIH07XG5cbiAgICAgICAgVGFza3NTZXJ2aWNlLm1vZGFsKHRhc2spXG4gICAgICAgICAgLnJlc3VsdC50aGVuKGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgICAgVGFza3NTZXJ2aWNlLmFkZChvcHRpb25zLnRhc2spO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnTUVNQkVSOlNFTEVDVCcsICRzY29wZS5tZW1iZXJJZCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkcm9vdFNjb3BlLiRvbignTUVNQkVSOlNFTEVDVCcsIGZ1bmN0aW9uKGV2LCBtZW1iZXJJZCl7XG4gICAgICAgICRzY29wZS5tZW1iZXJJZCA9IG1lbWJlcklkO1xuICAgICAgICAkc2NvcGUuZ2V0KCk7XG4gICAgICB9KTtcblxuICAgICAgaWYoJHNjb3BlLm1lbWJlcklkKSB7XG4gICAgICAgICRzY29wZS5nZXQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59KTtcbiIsImFwcC5kaXJlY3RpdmUoJ3RlYW1NZW1iZXJzJywgZnVuY3Rpb24oTWVtYmVyU2VydmljZSwgJHJvb3RTY29wZSkge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3RlYW0tbWVtYmVycy5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZSkge1xuICAgICAgJHNjb3BlLmZpbHRlckJ5TmFtZSA9ICcnO1xuICAgICAgJHNjb3BlLm1lbWJlcnMgPSBNZW1iZXJTZXJ2aWNlLmZldGNoKCk7XG4gICAgICAkc2NvcGUuYXZhdGFyID0gZnVuY3Rpb24obWVtYmVyKSB7XG4gICAgICAgIHJldHVybiBNZW1iZXJTZXJ2aWNlLmdldEF2YXRhckNsYXNzKG1lbWJlcik7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc2VsZWN0ID0gZnVuY3Rpb24obWVtYmVySWQpIHtcbiAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnTUVNQkVSOlNFTEVDVCcsIG1lbWJlcklkKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5hZGQgPSBmdW5jdGlvbihtZW1iZXIpIHtcbiAgICAgICAgaWYgKCFtZW1iZXIpIHtcbiAgICAgICAgICBtZW1iZXIgPSB7dXNlcm5hbWU6ICcnfTtcbiAgICAgICAgfVxuXG4gICAgICAgIE1lbWJlclNlcnZpY2UuY3JlYXRlKG1lbWJlcilcbiAgICAgICAgICAucmVzdWx0XG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWVtYmVyICYmIG9wdGlvbnMubWVtYmVyLnVzZXJuYW1lICYmICFvcHRpb25zLm1lbWJlci5pZCkge1xuICAgICAgICAgICAgICBvcHRpb25zLm1lbWJlci5pZCA9ICRzY29wZS5tZW1iZXJzLmxlbmd0aCArIDE7XG4gICAgICAgICAgICAgIG9wdGlvbnMubWVtYmVyLmF2YXRhciA9ICdhdmF0YXItY29sb3ItJyArIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyMTUpICsgMSApO1xuICAgICAgICAgICAgICAkc2NvcGUubWVtYmVycy5wdXNoKG9wdGlvbnMubWVtYmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICB9O1xufSk7XG4iLCJhcHAuc2VydmljZSgnTWVtYmVyU2VydmljZScsIGZ1bmN0aW9uKCR1aWJNb2RhbCkge1xuICB2YXIgY2FjaGVkID0gW1xuICAgIHtcbiAgICAgIGlkOiAxLFxuICAgICAgdXNlcm5hbWU6ICdEYXZpZCcsXG4gICAgICByb2xlOiAnRGV2ZWxvcGVyJyxcbiAgICAgIGF2YXRhcjogJ2F2YXRhci1jb2xvci0zNSdcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAyLFxuICAgICAgdXNlcm5hbWU6ICdBbGV4JyxcbiAgICAgIHJvbGU6ICdVSSBEZXZlbG9wZXInLFxuICAgICAgYXZhdGFyOiAnYXZhdGFyLWNvbG9yLTI1J1xuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDMsXG4gICAgICB1c2VybmFtZTogJ0JvYmJ5JyxcbiAgICAgIHJvbGU6ICdRQSBFbmdpbmVlcicsXG4gICAgICBhdmF0YXI6ICdhdmF0YXItY29sb3ItNDAnXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogNCxcbiAgICAgIHVzZXJuYW1lOiAnTWF0dCcsXG4gICAgICByb2xlOiAnUHJvZHVjdCBHdXknLFxuICAgICAgYXZhdGFyOiAnYXZhdGFyLWNvbG9yLTIwMCdcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiA1LFxuICAgICAgdXNlcm5hbWU6ICdEZWVwJyxcbiAgICAgIHJvbGU6ICdCdWlsZCBHdXknLFxuICAgICAgYXZhdGFyOiAnYXZhdGFyLWNvbG9yLTIwJ1xuICAgIH1cbiAgXTtcblxuICB2YXIgbWVtYmVyc0J5SWQgPSB7fTtcbiAgYW5ndWxhci5mb3JFYWNoKGNhY2hlZCwgZnVuY3Rpb24obWVtYmVyKXtcbiAgICBtZW1iZXJzQnlJZFttZW1iZXIuaWRdID0gbWVtYmVyO1xuICB9KTtcblxuICB0aGlzLmZldGNoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGNhY2hlZDtcbiAgfTtcblxuICB0aGlzLmdldEJ5SWQgPSBmdW5jdGlvbihtZW1iZXJJZCkge1xuICAgIHJldHVybiBtZW1iZXJzQnlJZFttZW1iZXJJZF07XG4gIH07XG5cbiAgdGhpcy5nZXRBdmF0YXJDbGFzcyA9IGZ1bmN0aW9uKG1lbWJlciwgc2l6ZSl7XG4gICAgdmFyIG5hbWUgPSBtZW1iZXIuYXZhdGFyKycgJysnYXZhdGFyLWxldHRlci0nKyhtZW1iZXIudXNlcm5hbWUudG9Mb3dlckNhc2UoKS5jaGFyQXQoMCkpO1xuICAgIHNpemUgPSAoc2l6ZSB8fCAnJyk7XG4gICAgcmV0dXJuICdhdmF0YXIgYXZhdGFyLXBsYWluIGF2YXRhci1tYXJnaW4gJytzaXplKycgJytuYW1lO1xuICB9O1xuXG4gIHRoaXMuYXZhdGFyID0gZnVuY3Rpb24obWVtYmVyLCBzaXplKXtcbiAgICByZXR1cm4gJzxpIGNsYXNzPVwiJyt0aGlzLmdldEF2YXRhckNsYXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykrJ1wiPjwvaT4nO1xuICB9O1xuXG4gIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24obWVtYmVyKXtcbiAgICByZXR1cm4gJHVpYk1vZGFsLm9wZW4oe1xuICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbWVtYmVyLW1vZGFsLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ01vZGFsSW5zdGFuY2VDdHJsJyxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIG1lbWJlcjogbWVtYmVyXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0pO1xuIiwiYXBwLnNlcnZpY2UoJ1Rhc2tzU2VydmljZScsIGZ1bmN0aW9uKCR1aWJNb2RhbCwgTWVtYmVyU2VydmljZSkge1xuICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCksXG4gICAgZCA9IGRhdGUuZ2V0RGF0ZSgpLFxuICAgIG0gPSBkYXRlLmdldE1vbnRoKCksXG4gICAgeSA9IGRhdGUuZ2V0RnVsbFllYXIoKSxcbiAgICBjYWNoZWQgPSBbXG4gICAgICB7XG4gICAgICAgIGlkOiAxLFxuICAgICAgICB0aXRsZTogJ1dvcmtpbmcgb24gdGVzdCBjYXNlcycsXG4gICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCAxKSxcbiAgICAgICAgZW5kOiBuZXcgRGF0ZSh5LCBtLCAyKSxcbiAgICAgICAgbWVtYmVySWQ6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAyLFxuICAgICAgICB0aXRsZTogJ0J1Zy0xMzYzNDY5OTMnLFxuICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCArIDQsIDE2LCAwKSxcbiAgICAgICAgYWxsRGF5OiB0cnVlLFxuICAgICAgICBtZW1iZXJJZDogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDMsXG4gICAgICAgIHRpdGxlOiAnQnVnLTEzNjM0NjQ0MycsXG4gICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCBkIC0gNSksXG4gICAgICAgIGVuZDogbmV3IERhdGUoeSwgbSwgZCAtIDIpLFxuICAgICAgICBtZW1iZXJJZDogMlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDQsXG4gICAgICAgIHRpdGxlOiAnVUkgdHJhbnNmb3JtYXRpb24gb2YgcHJvamVjdCBob21lIHBhZ2UnLFxuICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCAtIDMsIDE2LCAwKSxcbiAgICAgICAgYWxsRGF5OiB0cnVlLFxuICAgICAgICBtZW1iZXJJZDogM1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDUsXG4gICAgICAgIHRpdGxlOiAnRGF0YWJhc2UgYXJjaGl0ZWN0dXJlIHJlZGVzaWduJyxcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgKyAxLCAxOSwgMCksXG4gICAgICAgIGVuZDogbmV3IERhdGUoeSwgbSwgZCArIDEsIDIyLCAzMCksXG4gICAgICAgIGFsbERheTogdHJ1ZSxcbiAgICAgICAgbWVtYmVySWQ6IDJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiA2LFxuICAgICAgICB0aXRsZTogJ2pRdWVyeSBmcmFtZXdvcmsgZXZhbHVhdGlvbicsXG4gICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCBkICsgNCwgMTYsIDApLFxuICAgICAgICBhbGxEYXk6IHRydWUsXG4gICAgICAgIG1lbWJlcklkOiAzXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogNyxcbiAgICAgICAgdGl0bGU6ICdQcm9kdWN0IFJvYWQgTWFwIHBsYW5uaW5nJyxcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIDEpLFxuICAgICAgICBtZW1iZXJJZDogNFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDgsXG4gICAgICAgIHRpdGxlOiAnVUkgdHJhbnNmb3JtYXRpb24gb2YgcHJvamVjdCBob21lIHBhZ2UnLFxuICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCAtIDMsIDE2LCAwKSxcbiAgICAgICAgYWxsRGF5OiB0cnVlLFxuICAgICAgICBtZW1iZXJJZDogNFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDksXG4gICAgICAgIHRpdGxlOiAnQnVnLTEzNjM0Njk5MycsXG4gICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCBkICsgMywgMTYsIDApLFxuICAgICAgICBhbGxEYXk6IHRydWUsXG4gICAgICAgIG1lbWJlcklkOiA1XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogMTAsXG4gICAgICAgIHRpdGxlOiAnVUkgUmV2aWV3JyxcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgKyAzLCAxOSwgMCksXG4gICAgICAgIGVuZDogbmV3IERhdGUoeSwgbSwgZCArIDQsIDIyLCAzMCksXG4gICAgICAgIGFsbERheTogdHJ1ZSxcbiAgICAgICAgbWVtYmVySWQ6IDNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAxMSxcbiAgICAgICAgdGl0bGU6ICdqUXVlcnkgZnJhbWV3b3JrIGV2YWx1YXRpb24nLFxuICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCArIDQsIDE2LCAwKSxcbiAgICAgICAgYWxsRGF5OiB0cnVlLFxuICAgICAgICBtZW1iZXJJZDogM1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDEyLFxuICAgICAgICB0aXRsZTogJ1ZhY3Rpb24nLFxuICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCksXG4gICAgICAgIGVuZDogbmV3IERhdGUoeSwgbSwgZCArIDMpLFxuICAgICAgICBhbGxEYXk6IGZhbHNlLFxuICAgICAgICBtZW1iZXJJZDogMSxcbiAgICAgICAgY2xhc3NOYW1lOiBbJ3ZhY3Rpb24nXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDEzLFxuICAgICAgICB0aXRsZTogJ1ZhY3Rpb24nLFxuICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCArIDYpLFxuICAgICAgICBlbmQ6IG5ldyBEYXRlKHksIG0sIGQgKyA3KSxcbiAgICAgICAgYWxsRGF5OiBmYWxzZSxcbiAgICAgICAgbWVtYmVySWQ6IDMsXG4gICAgICAgIGNsYXNzTmFtZTogWyd2YWN0aW9uJ11cbiAgICAgIH0sXG4gICAgXTtcblxuICB0aGlzLmJ5TWVtYmVySWQgPSBmdW5jdGlvbihtZW1iZXJJZCkge1xuICAgIHJldHVybiBfLmZpbHRlcihjYWNoZWQsIGZ1bmN0aW9uKHRhc2spIHtcbiAgICAgIHJldHVybiB0YXNrLm1lbWJlcklkID09PSBtZW1iZXJJZDtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldEluZGV4ID0gZnVuY3Rpb24odGFzaykge1xuICAgIHZhciBpbmRleCA9IC0xO1xuICAgIF8uZWFjaCh0aGlzLmZldGNoKCksIGZ1bmN0aW9uKF90YXNrLCBfaW5kZXgpIHtcbiAgICAgIGlmICh0YXNrLmlkID09PSBfdGFzay5pZCkge1xuICAgICAgICBpbmRleCA9IF9pbmRleDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaW5kZXg7XG4gIH07XG5cbiAgdGhpcy5mZXRjaCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBjYWNoZWQ7XG4gIH07XG5cbiAgdGhpcy5hZGQgPSBmdW5jdGlvbih0YXNrKSB7XG4gICAgY2FjaGVkLnB1c2godGFzayk7XG4gIH07XG5cbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbih0YXNrKSB7XG4gICAgY2FjaGVkW3RoaXMuZ2V0SW5kZXgodGFzayldID0gdGFzaztcbiAgfTtcblxuICB0aGlzLm1vZGFsID0gZnVuY3Rpb24odGFzaykge1xuICAgIHJldHVybiAkdWliTW9kYWwub3Blbih7XG4gICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy90YXNrLW1vZGFsLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ01vZGFsSW5zdGFuY2VDdHJsJyxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIG1lbWJlcjogTWVtYmVyU2VydmljZS5nZXRCeUlkKHRhc2subWVtYmVySWQpLFxuICAgICAgICAgIHRhc2s6IHRhc2tcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
