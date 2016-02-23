var app = angular.module('app', ['ui.calendar', 'ui.bootstrap']);
angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("templates/calendar-event.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">Event</h3>\n</div>\n<div class=\"modal-body\">\n  \n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ok()\">OK</button>\n  <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n</div>\n");
$templateCache.put("templates/member-modal.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">New Member</h3>\n</div>\n<div class=\"modal-body\">\n  <form>\n  <div class=\"form-group\">\n    <label>Username</label>\n    <input type=\"text\" class=\"form-control\" ng-model=\"options.member.username\" placeholder=\"Username\">\n  </div>\n</form>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ok()\">OK</button>\n  <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n</div>\n");
$templateCache.put("templates/task-modal.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">New Task</h3>\n</div>\n<div class=\"modal-body\">\n  <form>\n    <div class=\"form-group\">\n      <label>Title</label>\n      <input type=\"text\" class=\"form-control\" ng-model=\"options.task.title\" placeholder=\"Task title\">\n    </div>\n\n    <div class=\"form-group\">\n      <label>Start Date</label>\n      <input type=\"date\" class=\"form-control\" ng-model=\"options.task.start\">\n    </div>\n\n    <div class=\"form-group\">\n      <label>End Date</label>\n      <input type=\"date\" class=\"form-control\" ng-model=\"options.task.end\">\n    </div>\n\n  </form>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ok()\">OK</button>\n  <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n</div>\n");
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
      start: event._start._d,
      end: event._end._d
    };

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

app.service('TasksService', function($uibModal) {
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
    var d = new Date();
    return $uibModal.open({
      templateUrl: 'templates/task-modal.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        options: {
          task: task
        }
      }
    });
  };

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInRlbXBsYXRlcy5qcyIsImNvbnRyb2xsZXJzL2NhbGVuZGFyQ3RybC5qcyIsImNvbnRyb2xsZXJzL21vZGFsLWluc3RhbmNlLmpzIiwiZGlyZWN0aXZlcy9hdmF0YXIuanMiLCJkaXJlY3RpdmVzL3RlYW0tbWVtYmVyLWNhcmQuanMiLCJkaXJlY3RpdmVzL3RlYW0tbWVtYmVycy5qcyIsInNlcnZpY2VzL21lbWJlci5qcyIsInNlcnZpY2VzL3Rhc2tzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5jYWxlbmRhcicsICd1aS5ib290c3RyYXAnXSk7IiwiYW5ndWxhci5tb2R1bGUoXCJhcHBcIikucnVuKFtcIiR0ZW1wbGF0ZUNhY2hlXCIsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7JHRlbXBsYXRlQ2FjaGUucHV0KFwidGVtcGxhdGVzL2NhbGVuZGFyLWV2ZW50Lmh0bWxcIixcIjxkaXYgY2xhc3M9XFxcIm1vZGFsLWhlYWRlclxcXCI+XFxuICA8aDMgY2xhc3M9XFxcIm1vZGFsLXRpdGxlXFxcIj5FdmVudDwvaDM+XFxuPC9kaXY+XFxuPGRpdiBjbGFzcz1cXFwibW9kYWwtYm9keVxcXCI+XFxuICBcXG48L2Rpdj5cXG48ZGl2IGNsYXNzPVxcXCJtb2RhbC1mb290ZXJcXFwiPlxcbiAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIG5nLWNsaWNrPVxcXCJvaygpXFxcIj5PSzwvYnV0dG9uPlxcbiAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi13YXJuaW5nXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIG5nLWNsaWNrPVxcXCJjYW5jZWwoKVxcXCI+Q2FuY2VsPC9idXR0b24+XFxuPC9kaXY+XFxuXCIpO1xuJHRlbXBsYXRlQ2FjaGUucHV0KFwidGVtcGxhdGVzL21lbWJlci1tb2RhbC5odG1sXCIsXCI8ZGl2IGNsYXNzPVxcXCJtb2RhbC1oZWFkZXJcXFwiPlxcbiAgPGgzIGNsYXNzPVxcXCJtb2RhbC10aXRsZVxcXCI+TmV3IE1lbWJlcjwvaDM+XFxuPC9kaXY+XFxuPGRpdiBjbGFzcz1cXFwibW9kYWwtYm9keVxcXCI+XFxuICA8Zm9ybT5cXG4gIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcbiAgICA8bGFiZWw+VXNlcm5hbWU8L2xhYmVsPlxcbiAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgbmctbW9kZWw9XFxcIm9wdGlvbnMubWVtYmVyLnVzZXJuYW1lXFxcIiBwbGFjZWhvbGRlcj1cXFwiVXNlcm5hbWVcXFwiPlxcbiAgPC9kaXY+XFxuPC9mb3JtPlxcbjwvZGl2PlxcbjxkaXYgY2xhc3M9XFxcIm1vZGFsLWZvb3RlclxcXCI+XFxuICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgbmctY2xpY2s9XFxcIm9rKClcXFwiPk9LPC9idXR0b24+XFxuICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXdhcm5pbmdcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgbmctY2xpY2s9XFxcImNhbmNlbCgpXFxcIj5DYW5jZWw8L2J1dHRvbj5cXG48L2Rpdj5cXG5cIik7XG4kdGVtcGxhdGVDYWNoZS5wdXQoXCJ0ZW1wbGF0ZXMvdGFzay1tb2RhbC5odG1sXCIsXCI8ZGl2IGNsYXNzPVxcXCJtb2RhbC1oZWFkZXJcXFwiPlxcbiAgPGgzIGNsYXNzPVxcXCJtb2RhbC10aXRsZVxcXCI+TmV3IFRhc2s8L2gzPlxcbjwvZGl2PlxcbjxkaXYgY2xhc3M9XFxcIm1vZGFsLWJvZHlcXFwiPlxcbiAgPGZvcm0+XFxuICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcbiAgICAgIDxsYWJlbD5UaXRsZTwvbGFiZWw+XFxuICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIG5nLW1vZGVsPVxcXCJvcHRpb25zLnRhc2sudGl0bGVcXFwiIHBsYWNlaG9sZGVyPVxcXCJUYXNrIHRpdGxlXFxcIj5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcbiAgICAgIDxsYWJlbD5TdGFydCBEYXRlPC9sYWJlbD5cXG4gICAgICA8aW5wdXQgdHlwZT1cXFwiZGF0ZVxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgbmctbW9kZWw9XFxcIm9wdGlvbnMudGFzay5zdGFydFxcXCI+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXG4gICAgICA8bGFiZWw+RW5kIERhdGU8L2xhYmVsPlxcbiAgICAgIDxpbnB1dCB0eXBlPVxcXCJkYXRlXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBuZy1tb2RlbD1cXFwib3B0aW9ucy50YXNrLmVuZFxcXCI+XFxuICAgIDwvZGl2PlxcblxcbiAgPC9mb3JtPlxcbjwvZGl2PlxcbjxkaXYgY2xhc3M9XFxcIm1vZGFsLWZvb3RlclxcXCI+XFxuICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgbmctY2xpY2s9XFxcIm9rKClcXFwiPk9LPC9idXR0b24+XFxuICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXdhcm5pbmdcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgbmctY2xpY2s9XFxcImNhbmNlbCgpXFxcIj5DYW5jZWw8L2J1dHRvbj5cXG48L2Rpdj5cXG5cIik7XG4kdGVtcGxhdGVDYWNoZS5wdXQoXCJ0ZW1wbGF0ZXMvdGVhbS1tZW1iZXItY2FyZC5odG1sXCIsXCI8ZGl2IGNsYXNzPVxcXCJib3ggYm94LXdpZGdldCB3aWRnZXQtdXNlci0yXFxcIiBuZy1pZj1cXFwic2hvdygpXFxcIj5cXG4gIDwhLS0gQWRkIHRoZSBiZyBjb2xvciB0byB0aGUgaGVhZGVyIHVzaW5nIGFueSBvZiB0aGUgYmctKiBjbGFzc2VzIC0tPlxcbiAgPGRpdiBjbGFzcz1cXFwid2lkZ2V0LXVzZXItaGVhZGVyXFxcIiBuZy1jbGFzcz1cXFwidGhlbWVDb2xvclxcXCI+XFxuXFxuICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiY2xvc2VcXFwiIGFyaWEtbGFiZWw9XFxcIkNsb3NlXFxcIiBuZy1jbGljaz1cXFwiY2xvc2UoKVxcXCI+XFxuICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XFxcInRydWVcXFwiPng8L3NwYW4+XFxuICAgIDwvYnV0dG9uPlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ3aWRnZXQtdXNlci1pbWFnZVxcXCI+XFxuICAgICAgPGF2YXRhciBuZy1pZj1cXFwibWVtYmVyLmlkXFxcIiBtZW1iZXItaWQ9XFxcIm1lbWJlci5pZFxcXCIgc2l6ZT1cXFwiYXZhdGFyLW1kXFxcIj48L2F2YXRhcj5cXG4gICAgPC9kaXY+XFxuICAgIDwhLS0gLy53aWRnZXQtdXNlci1pbWFnZSAtLT5cXG4gICAgPGgzIGNsYXNzPVxcXCJ3aWRnZXQtdXNlci11c2VybmFtZVxcXCI+e3sgbWVtYmVyLnVzZXJuYW1lIH19PC9oMz5cXG4gICAgPGg1IGNsYXNzPVxcXCJ3aWRnZXQtdXNlci1kZXNjXFxcIj57eyBtZW1iZXIucm9sZSB9fTwvaDU+XFxuICA8L2Rpdj5cXG4gIDxkaXYgY2xhc3M9XFxcImJveC1mb290ZXIgbm8tcGFkZGluZ1xcXCI+XFxuICAgIDx1bCBjbGFzcz1cXFwibmF2IG5hdi1zdGFja2VkXFxcIj5cXG4gICAgICA8bGk+XFxuICAgICAgICA8YSBocmVmPVxcXCIjXFxcIj5cXG4gICAgICAgICAgPGI+VGFza3M8L2I+XFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJwdWxsLXJpZ2h0IGJhZGdlIGJnLWFxdWFcXFwiIG5nLWNsaWNrPVxcXCJjcmVhdGUoKVxcXCI+KyBOZXc8L3NwYW4+XFxuICAgICAgICA8L2E+XFxuICAgICAgPC9saT5cXG4gICAgPC91bD5cXG4gICAgPHVsIGNsYXNzPVxcXCJwcm9kdWN0cy1saXN0IHByb2R1Y3QtbGlzdC1pbi1ib3hcXFwiIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiAwcHg7XFxcIj5cXG4gICAgICA8bGkgbmctcmVwZWF0PVxcXCJ0YXNrIGluIHRhc2tzXFxcIiBjbGFzcz1cXFwiaXRlbVxcXCIgc3R5bGU9XFxcInBhZGRpbmc6IDBweDtcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiYm94IGJveC10YXNrLWNhcmRcXFwiPlxcblxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJib3gtaGVhZGVyXFxcIj5cXG4gICAgICAgICAgICA8aDMgY2xhc3M9XFxcImJveC10aXRsZVxcXCI+VGFzayN7eyAkaW5kZXgrMSB9fSB7eyB0YXNrLnRpdGxlIH19PC9oMz5cXG4gICAgICAgICAgPC9kaXY+XFxuXFxuICAgICAgICAgIDx0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiPlxcbiAgICAgICAgICAgIDx0Ym9keT5cXG4gICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICA8dGQ+U3RhcnQgZGF0ZTwvdGQ+XFxuICAgICAgICAgICAgICA8dGQ+e3sgdGFzay5zdGFydCB8IGRhdGU6IFxcJ3Nob3J0XFwnfX08L3RkPlxcbiAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICA8dGQ+RW5kIGRhdGU8L3RkPlxcbiAgICAgICAgICAgICAgPHRkPnt7IHRhc2suZW5kIHwgZGF0ZTogXFwnc2hvcnRcXCd9fTwvdGQ+XFxuICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgIDwvdGJvZHk+XFxuICAgICAgICAgIDwvdGFibGU+XFxuXFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L2xpPlxcbiAgICA8L3VsPlxcbiAgPC9kaXY+XFxuPC9kaXY+XCIpO1xuJHRlbXBsYXRlQ2FjaGUucHV0KFwidGVtcGxhdGVzL3RlYW0tbWVtYmVycy5odG1sXCIsXCI8IS0tIHNlYXJjaCBmb3JtIChPcHRpb25hbCkgLS0+XFxuPGRpdiBjbGFzcz1cXFwic2lkZWJhci1mb3JtXFxcIj5cXG4gIDxkaXYgY2xhc3M9XFxcImlucHV0LWdyb3VwXFxcIj5cXG4gICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5hbWU9XFxcInFcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIHBsYWNlaG9sZGVyPVxcXCJTZWFyY2guLi5cXFwiIG5nLW1vZGVsPVxcXCJmaWx0ZXJCeU5hbWVcXFwiPlxcbiAgICA8c3BhbiBjbGFzcz1cXFwiaW5wdXQtZ3JvdXAtYnRuXFxcIj5cXG4gICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgbmFtZT1cXFwic2VhcmNoXFxcIiBpZD1cXFwic2VhcmNoLWJ0blxcXCIgY2xhc3M9XFxcImJ0biBidG4tZmxhdFxcXCI+PGkgY2xhc3M9XFxcImZhIGZhLXNlYXJjaFxcXCI+PC9pPjwvYnV0dG9uPlxcbiAgICA8L3NwYW4+XFxuICA8L2Rpdj5cXG48L2Rpdj5cXG48IS0tIC8uc2VhcmNoIGZvcm0gLS0+XFxuXFxuPCEtLSBTaWRlYmFyIE1lbnUgLS0+XFxuPHVsIGNsYXNzPVxcXCJzaWRlYmFyLW1lbnVcXFwiPlxcbiAgPGxpIGNsYXNzPVxcXCJoZWFkZXJcXFwiPlxcbiAgICBNRU1CRVJTXFxuICA8L2xpPlxcbiAgPGxpIG5nLXJlcGVhdD1cXFwibWVtYmVyIGluIG1lbWJlcnMgfCBmaWx0ZXI6IHsgdXNlcm5hbWU6IGZpbHRlckJ5TmFtZSB9XFxcIiBuZy1tb2RlbD1cXFwibWVtYmVyXFxcIiBuZy1jbGljaz1cXFwic2VsZWN0KG1lbWJlci5pZClcXFwiPlxcbiAgICA8YSBocmVmPVxcXCIjXFxcIj48aSBuZy1jbGFzcz1cXFwiYXZhdGFyKG1lbWJlcilcXFwiPjwvaT4mbmJzcDt7eyBtZW1iZXIudXNlcm5hbWV9fTwvYT5cXG4gIDwvbGk+XFxuPC91bD5cXG5cIik7fV0pOyIsIi8vIGNhbGVuZGFyIGNvbnRyb2xsZXJcbmFwcC5jb250cm9sbGVyKCdjYWxlbmRhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRjb21waWxlLCB1aUNhbGVuZGFyQ29uZmlnLCBNZW1iZXJTZXJ2aWNlLCBUYXNrc1NlcnZpY2UsICRyb290U2NvcGUpIHtcblxuICAkc2NvcGUuZXZlbnRSZW5kZXIgPSBmdW5jdGlvbihldmVudCwgZWxlbWVudCwgdmlldykge1xuICAgIHZhciBtZW1iZXIgPSBNZW1iZXJTZXJ2aWNlLmdldEJ5SWQoZXZlbnQubWVtYmVySWQpO1xuICAgIHZhciBhdmF0YXIgPSBhbmd1bGFyLmVsZW1lbnQoTWVtYmVyU2VydmljZS5hdmF0YXIobWVtYmVyLCAoKHZpZXcudHlwZSA9PT0gJ21vbnRoJyk/ICdhdmF0YXItc20nIDogJycpKSk7XG4gICAgaWYodmlldy50eXBlID09PSAnbW9udGgnKXtcbiAgICAgIGVsZW1lbnQuZmluZCgnLmZjLXRpbWUnKS5iZWZvcmUoYXZhdGFyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVzZXIgPSBhbmd1bGFyLmVsZW1lbnQoJzxkaXY+JykuaHRtbChtZW1iZXIudXNlcm5hbWUpLmFkZENsYXNzKCdhdmF0YXItdXNlcm5hbWUnKS5wcmVwZW5kKGF2YXRhcik7XG4gICAgICBlbGVtZW50LmZpbmQoJy5mYy10aW1lJykuYmVmb3JlKHVzZXIpO1xuICAgIH1cbiAgICBlbGVtZW50LmNzcyh7XG4gICAgICBwYWRkaW5nOiAnM3B4J1xuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5tb2RlID0gJ0FMTCc7XG5cbiAgJHNjb3BlLmV2ZW50Q2xpY2sgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciB0YXNrID0ge1xuICAgICAgaWQ6IGV2ZW50LmlkLFxuICAgICAgbWVtYmVySWQ6IGV2ZW50Lm1lbWJlcklkLFxuICAgICAgdGl0bGU6IGV2ZW50LnRpdGxlLFxuICAgICAgc3RhcnQ6IGV2ZW50Ll9zdGFydC5fZCxcbiAgICAgIGVuZDogZXZlbnQuX2VuZC5fZFxuICAgIH07XG5cbiAgICBUYXNrc1NlcnZpY2UubW9kYWwodGFzaylcbiAgICAgIC5yZXN1bHQudGhlbihmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgVGFza3NTZXJ2aWNlLnVwZGF0ZShvcHRpb25zLnRhc2spO1xuICAgICAgICBpZigkc2NvcGUubW9kZSA9PT0gJ01FTUJFUicpIHtcbiAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdNRU1CRVI6U0VMRUNUJywgb3B0aW9ucy50YXNrLm1lbWJlcklkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdNRU1CRVI6VU5TRUxFQ1QnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH07XG5cbiAgLyogZXZlbnQgc291cmNlIHRoYXQgY29udGFpbnMgY3VzdG9tIGV2ZW50cyBvbiB0aGUgc2NvcGUgKi9cbiAgJHNjb3BlLmV2ZW50cyA9IFRhc2tzU2VydmljZS5mZXRjaCgpO1xuXG4gIC8qIGNvbmZpZyBvYmplY3QgKi9cbiAgJHNjb3BlLnVpQ29uZmlnID0ge1xuICAgIGNhbGVuZGFyOiB7XG4gICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgIGhlYWRlcjoge1xuICAgICAgICBsZWZ0OiAncHJldixuZXh0IHRvZGF5JyxcbiAgICAgICAgY2VudGVyOiAndGl0bGUnLFxuICAgICAgICByaWdodDogJ21vbnRoLGFnZW5kYVdlZWsnXG4gICAgICB9LFxuICAgICAgYnV0dG9uVGV4dDoge1xuICAgICAgICB0b2RheTogJ3RvZGF5JyxcbiAgICAgICAgbW9udGg6ICdtb250aCcsXG4gICAgICAgIHdlZWs6ICd3ZWVrJ1xuICAgICAgfSxcbiAgICAgIGV2ZW50czogJHNjb3BlLmV2ZW50cyxcbiAgICAgIGV2ZW50Q2xpY2s6ICRzY29wZS5ldmVudENsaWNrLFxuICAgICAgZXZlbnRSZW5kZXI6ICRzY29wZS5ldmVudFJlbmRlcixcbiAgICAgIGRheU5hbWVzOiBbXCJTdW5kYXlcIiwgXCJNb25kYXlcIiwgXCJUdWVzZGF5XCIsIFwiV2VkbmVzZGF5XCIsIFwiVGh1cnNkYXlcIiwgXCJGcmlkYXlcIiwgXCJTYXR1cmRheVwiXSxcbiAgICAgIGRheU5hbWVzU2hvcnQ6IFtcIlN1blwiLCBcIk1vblwiLCBcIlR1ZVwiLCBcIldlZFwiLCBcIlRodVwiLCBcIkZyaVwiLCBcIlNhdFwiXVxuICAgIH1cbiAgfTtcbiAgLyogZXZlbnQgc291cmNlcyBhcnJheSovXG4gICRzY29wZS5ldmVudFNvdXJjZXMgPSBbXTtcblxuICAkcm9vdFNjb3BlLiRvbignTUVNQkVSOlNFTEVDVCcsIGZ1bmN0aW9uKGV2LCBtZW1iZXJJZCl7XG4gICAgJHNjb3BlLm1vZGUgPSAnTUVNQkVSJztcbiAgICAkc2NvcGUudWlDb25maWcuY2FsZW5kYXIuZXZlbnRzID0gVGFza3NTZXJ2aWNlLmJ5TWVtYmVySWQobWVtYmVySWQpO1xuICB9KTtcblxuICAkcm9vdFNjb3BlLiRvbignTUVNQkVSOlVOU0VMRUNUJywgZnVuY3Rpb24oZXYpe1xuICAgICRzY29wZS5tb2RlID0gJ0FMTCc7XG4gICAgJHNjb3BlLnVpQ29uZmlnLmNhbGVuZGFyLmV2ZW50cyA9IFRhc2tzU2VydmljZS5mZXRjaCgpO1xuICB9KTtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdNb2RhbEluc3RhbmNlQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICR1aWJNb2RhbEluc3RhbmNlLCBvcHRpb25zKSB7XG5cbiAgJHNjb3BlLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICRzY29wZS5vayA9IGZ1bmN0aW9uICgpIHtcbiAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZShvcHRpb25zKTtcbiAgfTtcblxuICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoKTtcbiAgfTtcbn0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgnYXZhdGFyJywgZnVuY3Rpb24oTWVtYmVyU2VydmljZSl7XG4gIHJldHVybiB7XG4gICAgc2NvcGU6IHtcbiAgICAgIG1lbWJlcklkOiAnPScsXG4gICAgICBzaXplOiAnQCdcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlKXtcbiAgICAgICRzY29wZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgZWxlLmh0bWwoJycpLmFwcGVuZChNZW1iZXJTZXJ2aWNlLmF2YXRhcihNZW1iZXJTZXJ2aWNlLmdldEJ5SWQoJHNjb3BlLm1lbWJlcklkKSwgJHNjb3BlLnNpemUpKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS4kd2F0Y2goJ21lbWJlcklkJywgJHNjb3BlLmluaXQsIHRydWUpO1xuICAgIH1cbiAgfTtcbn0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgndGVhbU1lbWJlckNhcmQnLCBmdW5jdGlvbihNZW1iZXJTZXJ2aWNlLCAkcm9vdFNjb3BlLCBUYXNrc1NlcnZpY2Upe1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3RlYW0tbWVtYmVyLWNhcmQuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24oJHNjb3BlKXtcblxuICAgICAgdmFyIGNvbG9ycyA9IFsnYmx1ZScsICdncmVlbicsICd5ZWxsb3cnLCAncmVkJ107XG5cbiAgICAgIC8vIGdldCByYW5kb20gdGhlbWVcbiAgICAgICRzY29wZS50aGVtZUNvbG9yID0gJ2JnLScrY29sb3JzWyhNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KSApXTtcblxuICAgICAgJHNjb3BlLm1lbWJlcklkID0gbnVsbDtcbiAgICAgICRzY29wZS5nZXQgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUubWVtYmVyID0gTWVtYmVyU2VydmljZS5nZXRCeUlkKCRzY29wZS5tZW1iZXJJZCk7XG4gICAgICAgICRzY29wZS50YXNrcyA9IFRhc2tzU2VydmljZS5ieU1lbWJlcklkKCRzY29wZS5tZW1iZXJJZCk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc2hvdyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAoJHNjb3BlLm1lbWJlcklkICYmICRzY29wZS5tZW1iZXIgJiYgJHNjb3BlLm1lbWJlci5pZCk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuaXNBbGxEYXkgPSBmdW5jdGlvbihhbGxEYXkpe1xuICAgICAgICByZXR1cm4gYWxsRGF5PyAnWUVTJyA6ICdOTyc7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuY2xvc2UgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUubWVtYmVySWQgPSAkc2NvcGUubWVtYmVyID0gbnVsbDtcbiAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnTUVNQkVSOlVOU0VMRUNUJyk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHRhc2sgPSB7XG4gICAgICAgICAgbWVtYmVySWQ6ICRzY29wZS5tZW1iZXJJZCxcbiAgICAgICAgICB0aXRsZTogJycsXG4gICAgICAgICAgc3RhcnQ6IGQsXG4gICAgICAgICAgZW5kOiBkXG4gICAgICAgIH07XG5cbiAgICAgICAgVGFza3NTZXJ2aWNlLm1vZGFsKHRhc2spXG4gICAgICAgICAgLnJlc3VsdC50aGVuKGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgICAgVGFza3NTZXJ2aWNlLmFkZChvcHRpb25zLnRhc2spO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnTUVNQkVSOlNFTEVDVCcsICRzY29wZS5tZW1iZXJJZCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkcm9vdFNjb3BlLiRvbignTUVNQkVSOlNFTEVDVCcsIGZ1bmN0aW9uKGV2LCBtZW1iZXJJZCl7XG4gICAgICAgICRzY29wZS5tZW1iZXJJZCA9IG1lbWJlcklkO1xuICAgICAgICAkc2NvcGUuZ2V0KCk7XG4gICAgICB9KTtcblxuICAgICAgaWYoJHNjb3BlLm1lbWJlcklkKSB7XG4gICAgICAgICRzY29wZS5nZXQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59KTtcbiIsImFwcC5kaXJlY3RpdmUoJ3RlYW1NZW1iZXJzJywgZnVuY3Rpb24oTWVtYmVyU2VydmljZSwgJHJvb3RTY29wZSkge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3RlYW0tbWVtYmVycy5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZSkge1xuICAgICAgJHNjb3BlLmZpbHRlckJ5TmFtZSA9ICcnO1xuICAgICAgJHNjb3BlLm1lbWJlcnMgPSBNZW1iZXJTZXJ2aWNlLmZldGNoKCk7XG4gICAgICAkc2NvcGUuYXZhdGFyID0gZnVuY3Rpb24obWVtYmVyKSB7XG4gICAgICAgIHJldHVybiBNZW1iZXJTZXJ2aWNlLmdldEF2YXRhckNsYXNzKG1lbWJlcik7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc2VsZWN0ID0gZnVuY3Rpb24obWVtYmVySWQpIHtcbiAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnTUVNQkVSOlNFTEVDVCcsIG1lbWJlcklkKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5hZGQgPSBmdW5jdGlvbihtZW1iZXIpIHtcbiAgICAgICAgaWYgKCFtZW1iZXIpIHtcbiAgICAgICAgICBtZW1iZXIgPSB7dXNlcm5hbWU6ICcnfTtcbiAgICAgICAgfVxuXG4gICAgICAgIE1lbWJlclNlcnZpY2UuY3JlYXRlKG1lbWJlcilcbiAgICAgICAgICAucmVzdWx0XG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWVtYmVyICYmIG9wdGlvbnMubWVtYmVyLnVzZXJuYW1lICYmICFvcHRpb25zLm1lbWJlci5pZCkge1xuICAgICAgICAgICAgICBvcHRpb25zLm1lbWJlci5pZCA9ICRzY29wZS5tZW1iZXJzLmxlbmd0aCArIDE7XG4gICAgICAgICAgICAgIG9wdGlvbnMubWVtYmVyLmF2YXRhciA9ICdhdmF0YXItY29sb3ItJyArIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyMTUpICsgMSApO1xuICAgICAgICAgICAgICAkc2NvcGUubWVtYmVycy5wdXNoKG9wdGlvbnMubWVtYmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICB9O1xufSk7XG4iLCJhcHAuc2VydmljZSgnTWVtYmVyU2VydmljZScsIGZ1bmN0aW9uKCR1aWJNb2RhbCkge1xuICB2YXIgY2FjaGVkID0gW1xuICAgIHtcbiAgICAgIGlkOiAxLFxuICAgICAgdXNlcm5hbWU6ICdEYXZpZCcsXG4gICAgICByb2xlOiAnRGV2ZWxvcGVyJyxcbiAgICAgIGF2YXRhcjogJ2F2YXRhci1jb2xvci0zNSdcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAyLFxuICAgICAgdXNlcm5hbWU6ICdBbGV4JyxcbiAgICAgIHJvbGU6ICdVSSBEZXZlbG9wZXInLFxuICAgICAgYXZhdGFyOiAnYXZhdGFyLWNvbG9yLTI1J1xuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDMsXG4gICAgICB1c2VybmFtZTogJ0JvYmJ5JyxcbiAgICAgIHJvbGU6ICdRQSBFbmdpbmVlcicsXG4gICAgICBhdmF0YXI6ICdhdmF0YXItY29sb3ItNDAnXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogNCxcbiAgICAgIHVzZXJuYW1lOiAnTWF0dCcsXG4gICAgICByb2xlOiAnUHJvZHVjdCBHdXknLFxuICAgICAgYXZhdGFyOiAnYXZhdGFyLWNvbG9yLTIwMCdcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiA1LFxuICAgICAgdXNlcm5hbWU6ICdEZWVwJyxcbiAgICAgIHJvbGU6ICdCdWlsZCBHdXknLFxuICAgICAgYXZhdGFyOiAnYXZhdGFyLWNvbG9yLTIwJ1xuICAgIH1cbiAgXTtcblxuICB2YXIgbWVtYmVyc0J5SWQgPSB7fTtcbiAgYW5ndWxhci5mb3JFYWNoKGNhY2hlZCwgZnVuY3Rpb24obWVtYmVyKXtcbiAgICBtZW1iZXJzQnlJZFttZW1iZXIuaWRdID0gbWVtYmVyO1xuICB9KTtcblxuICB0aGlzLmZldGNoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGNhY2hlZDtcbiAgfTtcblxuICB0aGlzLmdldEJ5SWQgPSBmdW5jdGlvbihtZW1iZXJJZCkge1xuICAgIHJldHVybiBtZW1iZXJzQnlJZFttZW1iZXJJZF07XG4gIH07XG5cbiAgdGhpcy5nZXRBdmF0YXJDbGFzcyA9IGZ1bmN0aW9uKG1lbWJlciwgc2l6ZSl7XG4gICAgdmFyIG5hbWUgPSBtZW1iZXIuYXZhdGFyKycgJysnYXZhdGFyLWxldHRlci0nKyhtZW1iZXIudXNlcm5hbWUudG9Mb3dlckNhc2UoKS5jaGFyQXQoMCkpO1xuICAgIHNpemUgPSAoc2l6ZSB8fCAnJyk7XG4gICAgcmV0dXJuICdhdmF0YXIgYXZhdGFyLXBsYWluIGF2YXRhci1tYXJnaW4gJytzaXplKycgJytuYW1lO1xuICB9O1xuXG4gIHRoaXMuYXZhdGFyID0gZnVuY3Rpb24obWVtYmVyLCBzaXplKXtcbiAgICByZXR1cm4gJzxpIGNsYXNzPVwiJyt0aGlzLmdldEF2YXRhckNsYXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykrJ1wiPjwvaT4nO1xuICB9O1xuXG4gIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24obWVtYmVyKXtcbiAgICByZXR1cm4gJHVpYk1vZGFsLm9wZW4oe1xuICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbWVtYmVyLW1vZGFsLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ01vZGFsSW5zdGFuY2VDdHJsJyxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIG1lbWJlcjogbWVtYmVyXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0pO1xuIiwiYXBwLnNlcnZpY2UoJ1Rhc2tzU2VydmljZScsIGZ1bmN0aW9uKCR1aWJNb2RhbCkge1xuICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCksXG4gICAgZCA9IGRhdGUuZ2V0RGF0ZSgpLFxuICAgIG0gPSBkYXRlLmdldE1vbnRoKCksXG4gICAgeSA9IGRhdGUuZ2V0RnVsbFllYXIoKSxcbiAgICBjYWNoZWQgPSBbXG4gICAgICB7XG4gICAgICAgIGlkOiAxLFxuICAgICAgICB0aXRsZTogJ1dvcmtpbmcgb24gdGVzdCBjYXNlcycsXG4gICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCAxKSxcbiAgICAgICAgZW5kOiBuZXcgRGF0ZSh5LCBtLCAyKSxcbiAgICAgICAgbWVtYmVySWQ6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAyLFxuICAgICAgICB0aXRsZTogJ0J1Zy0xMzYzNDY5OTMnLFxuICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCArIDQsIDE2LCAwKSxcbiAgICAgICAgYWxsRGF5OiB0cnVlLFxuICAgICAgICBtZW1iZXJJZDogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDMsXG4gICAgICAgIHRpdGxlOiAnQnVnLTEzNjM0NjQ0MycsXG4gICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCBkIC0gNSksXG4gICAgICAgIGVuZDogbmV3IERhdGUoeSwgbSwgZCAtIDIpLFxuICAgICAgICBtZW1iZXJJZDogMlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDQsXG4gICAgICAgIHRpdGxlOiAnVUkgdHJhbnNmb3JtYXRpb24gb2YgcHJvamVjdCBob21lIHBhZ2UnLFxuICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCAtIDMsIDE2LCAwKSxcbiAgICAgICAgYWxsRGF5OiB0cnVlLFxuICAgICAgICBtZW1iZXJJZDogM1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDUsXG4gICAgICAgIHRpdGxlOiAnRGF0YWJhc2UgYXJjaGl0ZWN0dXJlIHJlZGVzaWduJyxcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgKyAxLCAxOSwgMCksXG4gICAgICAgIGVuZDogbmV3IERhdGUoeSwgbSwgZCArIDEsIDIyLCAzMCksXG4gICAgICAgIGFsbERheTogdHJ1ZSxcbiAgICAgICAgbWVtYmVySWQ6IDJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiA2LFxuICAgICAgICB0aXRsZTogJ2pRdWVyeSBmcmFtZXdvcmsgZXZhbHVhdGlvbicsXG4gICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCBkICsgNCwgMTYsIDApLFxuICAgICAgICBhbGxEYXk6IHRydWUsXG4gICAgICAgIG1lbWJlcklkOiAzXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogNyxcbiAgICAgICAgdGl0bGU6ICdQcm9kdWN0IFJvYWQgTWFwIHBsYW5uaW5nJyxcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIDEpLFxuICAgICAgICBtZW1iZXJJZDogNFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDgsXG4gICAgICAgIHRpdGxlOiAnVUkgdHJhbnNmb3JtYXRpb24gb2YgcHJvamVjdCBob21lIHBhZ2UnLFxuICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCAtIDMsIDE2LCAwKSxcbiAgICAgICAgYWxsRGF5OiB0cnVlLFxuICAgICAgICBtZW1iZXJJZDogNFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDksXG4gICAgICAgIHRpdGxlOiAnQnVnLTEzNjM0Njk5MycsXG4gICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCBkICsgMywgMTYsIDApLFxuICAgICAgICBhbGxEYXk6IHRydWUsXG4gICAgICAgIG1lbWJlcklkOiA1XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogMTAsXG4gICAgICAgIHRpdGxlOiAnVUkgUmV2aWV3JyxcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgKyAzLCAxOSwgMCksXG4gICAgICAgIGVuZDogbmV3IERhdGUoeSwgbSwgZCArIDQsIDIyLCAzMCksXG4gICAgICAgIGFsbERheTogdHJ1ZSxcbiAgICAgICAgbWVtYmVySWQ6IDNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAxMSxcbiAgICAgICAgdGl0bGU6ICdqUXVlcnkgZnJhbWV3b3JrIGV2YWx1YXRpb24nLFxuICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCArIDQsIDE2LCAwKSxcbiAgICAgICAgYWxsRGF5OiB0cnVlLFxuICAgICAgICBtZW1iZXJJZDogM1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDEyLFxuICAgICAgICB0aXRsZTogJ1ZhY3Rpb24nLFxuICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCksXG4gICAgICAgIGVuZDogbmV3IERhdGUoeSwgbSwgZCArIDMpLFxuICAgICAgICBhbGxEYXk6IGZhbHNlLFxuICAgICAgICBtZW1iZXJJZDogMSxcbiAgICAgICAgY2xhc3NOYW1lOiBbJ3ZhY3Rpb24nXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDEzLFxuICAgICAgICB0aXRsZTogJ1ZhY3Rpb24nLFxuICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCArIDYpLFxuICAgICAgICBlbmQ6IG5ldyBEYXRlKHksIG0sIGQgKyA3KSxcbiAgICAgICAgYWxsRGF5OiBmYWxzZSxcbiAgICAgICAgbWVtYmVySWQ6IDMsXG4gICAgICAgIGNsYXNzTmFtZTogWyd2YWN0aW9uJ11cbiAgICAgIH0sXG4gICAgXTtcblxuICB0aGlzLmJ5TWVtYmVySWQgPSBmdW5jdGlvbihtZW1iZXJJZCkge1xuICAgIHJldHVybiBfLmZpbHRlcihjYWNoZWQsIGZ1bmN0aW9uKHRhc2spIHtcbiAgICAgIHJldHVybiB0YXNrLm1lbWJlcklkID09PSBtZW1iZXJJZDtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldEluZGV4ID0gZnVuY3Rpb24odGFzaykge1xuICAgIHZhciBpbmRleCA9IC0xO1xuICAgIF8uZWFjaCh0aGlzLmZldGNoKCksIGZ1bmN0aW9uKF90YXNrLCBfaW5kZXgpIHtcbiAgICAgIGlmICh0YXNrLmlkID09PSBfdGFzay5pZCkge1xuICAgICAgICBpbmRleCA9IF9pbmRleDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaW5kZXg7XG4gIH07XG5cbiAgdGhpcy5mZXRjaCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBjYWNoZWQ7XG4gIH07XG5cbiAgdGhpcy5hZGQgPSBmdW5jdGlvbih0YXNrKSB7XG4gICAgY2FjaGVkLnB1c2godGFzayk7XG4gIH07XG5cbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbih0YXNrKSB7XG4gICAgY2FjaGVkW3RoaXMuZ2V0SW5kZXgodGFzayldID0gdGFzaztcbiAgfTtcblxuICB0aGlzLm1vZGFsID0gZnVuY3Rpb24odGFzaykge1xuICAgIHZhciBkID0gbmV3IERhdGUoKTtcbiAgICByZXR1cm4gJHVpYk1vZGFsLm9wZW4oe1xuICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvdGFzay1tb2RhbC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbEluc3RhbmNlQ3RybCcsXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICB0YXNrOiB0YXNrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
