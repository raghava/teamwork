var app = angular.module('app', ['ui.calendar', 'ui.bootstrap']);
angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("templates/calendar-event.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">Event</h3>\n</div>\n<div class=\"modal-body\">\n  \n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ok()\">OK</button>\n  <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n</div>\n");
$templateCache.put("templates/member-modal.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">New Member</h3>\n</div>\n<div class=\"modal-body\">\n  <form>\n  <div class=\"form-group\">\n    <label>Username</label>\n    <input type=\"text\" class=\"form-control\" ng-model=\"options.member.username\" placeholder=\"Username\">\n  </div>\n</form>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ok()\">OK</button>\n  <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n</div>\n");
$templateCache.put("templates/team-member-card.html","<div class=\"box box-widget widget-user-2\" ng-if=\"show()\">\n  <!-- Add the bg color to the header using any of the bg-* classes -->\n  <div class=\"widget-user-header\" ng-class=\"themeColor\">\n\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" ng-click=\"close()\">\n      <span aria-hidden=\"true\">x</span>\n    </button>\n\n    <div class=\"widget-user-image\">\n      <avatar ng-if=\"member.id\" member-id=\"member.id\" size=\"avatar-md\"></avatar>\n    </div>\n    <!-- /.widget-user-image -->\n    <h3 class=\"widget-user-username\">{{ member.username }}</h3>\n    <h5 class=\"widget-user-desc\">{{ member.role }}</h5>\n  </div>\n  <div class=\"box-footer no-padding\">\n    <ul class=\"nav nav-stacked\">\n      <li>\n        <a href=\"#\">\n          <b>Tasks</b>\n          <span class=\"pull-right badge bg-aqua\">{{ tasks.length }}</span>\n        </a>\n      </li>\n    </ul>\n    <ul class=\"products-list product-list-in-box\" style=\"margin-bottom: 0px;\">\n      <li ng-repeat=\"task in tasks\" class=\"item\" style=\"padding: 0px;\">\n        <div class=\"box box-task-card\">\n\n          <div class=\"box-header\">\n            <h3 class=\"box-title\">Task#{{ $index+1 }} {{ task.title }}</h3>\n          </div>\n\n          <table class=\"table\">\n            <tbody>\n            <tr>\n              <td>Start date</td>\n              <td>{{ task.start | date: \'short\'}}</td>\n            <tr>\n            <tr>\n              <td>End date</td>\n              <td>{{ task.end | date: \'short\'}}</td>\n            <tr>\n            </tbody>\n          </table>\n\n        </div>\n      </li>\n    </ul>\n  </div>\n</div>");
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

  $scope.eventClick = function(event, jsEvent) {
    // $uibModal.open({
    //   animation: $scope.animationsEnabled,
    //   templateUrl: 'js/templates/calendar-event.html',
    //   controller: 'ModalInstanceCtrl',
    //   resolve: {
    //     event: event,
    //     member: MemberService.getById(event.memberId),
    //   }
    // });
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
      // eventClick: $scope.eventClick,
      eventRender: $scope.eventRender,
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    }
  };
  /* event sources array*/
  $scope.eventSources = [];

  $rootScope.$on('MEMBER:SELECT', function(ev, memberId){
    $scope.uiConfig.calendar.events = TasksService.byMemberId(memberId);
  });

  $rootScope.$on('MEMBER:UNSELECT', function(ev){
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

app.service('TasksService', function() {
  var date = new Date(),
    d = date.getDate(),
    m = date.getMonth(),
    y = date.getFullYear(),
    cached = [
      {
        title: 'Working on test cases',
        start: new Date(y, m, 1),
        end: new Date(y, m, 2),
        memberId: 1
      },
      {
        title: 'Bug-136346993',
        start: new Date(y, m, d + 4, 16, 0),
        allDay: true,
        memberId: 1
      },
      {
        title: 'Bug-136346443',
        start: new Date(y, m, d - 5),
        end: new Date(y, m, d - 2),
        memberId: 2
      },
      {
        title: 'UI transformation of project home page',
        start: new Date(y, m, d - 3, 16, 0),
        allDay: true,
        memberId: 3
      },
      {
        title: 'Database architecture redesign',
        start: new Date(y, m, d + 1, 19, 0),
        end: new Date(y, m, d + 1, 22, 30),
        allDay: true,
        memberId: 2
      },
      {
        title: 'jQuery framework evaluation',
        start: new Date(y, m, d + 4, 16, 0),
        allDay: true,
        memberId: 3
      },
      {
        title: 'Product Road Map planning',
        start: new Date(y, m, 1),
        memberId: 4
      },
      {
        title: 'UI transformation of project home page',
        start: new Date(y, m, d - 3, 16, 0),
        allDay: true,
        memberId: 4
      },
      {
        title: 'Bug-136346993',
        start: new Date(y, m, d + 3, 16, 0),
        allDay: true,
        memberId: 5
      },
      {
        title: 'UI Review',
        start: new Date(y, m, d + 3, 19, 0),
        end: new Date(y, m, d + 4, 22, 30),
        allDay: true,
        memberId: 3
      },
      {
        title: 'jQuery framework evaluation',
        start: new Date(y, m, d + 4, 16, 0),
        allDay: true,
        memberId: 3
      },
      {
        title: 'Vaction',
        start: new Date(y, m, d),
        end: new Date(y, m, d + 3),
        allDay: false,
        memberId: 1,
        className: ['vaction']
      },
      {
        title: 'Vaction',
        start: new Date(y, m, d+6),
        end: new Date(y, m, d + 7),
        allDay: false,
        memberId: 3,
        className: ['vaction']
      },
    ];

  this.byMemberId = function(memberId){
    return _.filter(cached, function(task){
      return task.memberId === memberId;
    });
  };

  this.fetch = function() {
    return cached;
  };

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInRlbXBsYXRlcy5qcyIsImNvbnRyb2xsZXJzL2NhbGVuZGFyQ3RybC5qcyIsImNvbnRyb2xsZXJzL21vZGFsLWluc3RhbmNlLmpzIiwiZGlyZWN0aXZlcy9hdmF0YXIuanMiLCJkaXJlY3RpdmVzL3RlYW0tbWVtYmVyLWNhcmQuanMiLCJkaXJlY3RpdmVzL3RlYW0tbWVtYmVycy5qcyIsInNlcnZpY2VzL21lbWJlci5qcyIsInNlcnZpY2VzL3Rhc2tzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5jYWxlbmRhcicsICd1aS5ib290c3RyYXAnXSk7IiwiYW5ndWxhci5tb2R1bGUoXCJhcHBcIikucnVuKFtcIiR0ZW1wbGF0ZUNhY2hlXCIsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7JHRlbXBsYXRlQ2FjaGUucHV0KFwidGVtcGxhdGVzL2NhbGVuZGFyLWV2ZW50Lmh0bWxcIixcIjxkaXYgY2xhc3M9XFxcIm1vZGFsLWhlYWRlclxcXCI+XFxuICA8aDMgY2xhc3M9XFxcIm1vZGFsLXRpdGxlXFxcIj5FdmVudDwvaDM+XFxuPC9kaXY+XFxuPGRpdiBjbGFzcz1cXFwibW9kYWwtYm9keVxcXCI+XFxuICBcXG48L2Rpdj5cXG48ZGl2IGNsYXNzPVxcXCJtb2RhbC1mb290ZXJcXFwiPlxcbiAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIG5nLWNsaWNrPVxcXCJvaygpXFxcIj5PSzwvYnV0dG9uPlxcbiAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi13YXJuaW5nXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIG5nLWNsaWNrPVxcXCJjYW5jZWwoKVxcXCI+Q2FuY2VsPC9idXR0b24+XFxuPC9kaXY+XFxuXCIpO1xuJHRlbXBsYXRlQ2FjaGUucHV0KFwidGVtcGxhdGVzL21lbWJlci1tb2RhbC5odG1sXCIsXCI8ZGl2IGNsYXNzPVxcXCJtb2RhbC1oZWFkZXJcXFwiPlxcbiAgPGgzIGNsYXNzPVxcXCJtb2RhbC10aXRsZVxcXCI+TmV3IE1lbWJlcjwvaDM+XFxuPC9kaXY+XFxuPGRpdiBjbGFzcz1cXFwibW9kYWwtYm9keVxcXCI+XFxuICA8Zm9ybT5cXG4gIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcbiAgICA8bGFiZWw+VXNlcm5hbWU8L2xhYmVsPlxcbiAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgbmctbW9kZWw9XFxcIm9wdGlvbnMubWVtYmVyLnVzZXJuYW1lXFxcIiBwbGFjZWhvbGRlcj1cXFwiVXNlcm5hbWVcXFwiPlxcbiAgPC9kaXY+XFxuPC9mb3JtPlxcbjwvZGl2PlxcbjxkaXYgY2xhc3M9XFxcIm1vZGFsLWZvb3RlclxcXCI+XFxuICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgbmctY2xpY2s9XFxcIm9rKClcXFwiPk9LPC9idXR0b24+XFxuICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXdhcm5pbmdcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgbmctY2xpY2s9XFxcImNhbmNlbCgpXFxcIj5DYW5jZWw8L2J1dHRvbj5cXG48L2Rpdj5cXG5cIik7XG4kdGVtcGxhdGVDYWNoZS5wdXQoXCJ0ZW1wbGF0ZXMvdGVhbS1tZW1iZXItY2FyZC5odG1sXCIsXCI8ZGl2IGNsYXNzPVxcXCJib3ggYm94LXdpZGdldCB3aWRnZXQtdXNlci0yXFxcIiBuZy1pZj1cXFwic2hvdygpXFxcIj5cXG4gIDwhLS0gQWRkIHRoZSBiZyBjb2xvciB0byB0aGUgaGVhZGVyIHVzaW5nIGFueSBvZiB0aGUgYmctKiBjbGFzc2VzIC0tPlxcbiAgPGRpdiBjbGFzcz1cXFwid2lkZ2V0LXVzZXItaGVhZGVyXFxcIiBuZy1jbGFzcz1cXFwidGhlbWVDb2xvclxcXCI+XFxuXFxuICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiY2xvc2VcXFwiIGFyaWEtbGFiZWw9XFxcIkNsb3NlXFxcIiBuZy1jbGljaz1cXFwiY2xvc2UoKVxcXCI+XFxuICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XFxcInRydWVcXFwiPng8L3NwYW4+XFxuICAgIDwvYnV0dG9uPlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ3aWRnZXQtdXNlci1pbWFnZVxcXCI+XFxuICAgICAgPGF2YXRhciBuZy1pZj1cXFwibWVtYmVyLmlkXFxcIiBtZW1iZXItaWQ9XFxcIm1lbWJlci5pZFxcXCIgc2l6ZT1cXFwiYXZhdGFyLW1kXFxcIj48L2F2YXRhcj5cXG4gICAgPC9kaXY+XFxuICAgIDwhLS0gLy53aWRnZXQtdXNlci1pbWFnZSAtLT5cXG4gICAgPGgzIGNsYXNzPVxcXCJ3aWRnZXQtdXNlci11c2VybmFtZVxcXCI+e3sgbWVtYmVyLnVzZXJuYW1lIH19PC9oMz5cXG4gICAgPGg1IGNsYXNzPVxcXCJ3aWRnZXQtdXNlci1kZXNjXFxcIj57eyBtZW1iZXIucm9sZSB9fTwvaDU+XFxuICA8L2Rpdj5cXG4gIDxkaXYgY2xhc3M9XFxcImJveC1mb290ZXIgbm8tcGFkZGluZ1xcXCI+XFxuICAgIDx1bCBjbGFzcz1cXFwibmF2IG5hdi1zdGFja2VkXFxcIj5cXG4gICAgICA8bGk+XFxuICAgICAgICA8YSBocmVmPVxcXCIjXFxcIj5cXG4gICAgICAgICAgPGI+VGFza3M8L2I+XFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJwdWxsLXJpZ2h0IGJhZGdlIGJnLWFxdWFcXFwiPnt7IHRhc2tzLmxlbmd0aCB9fTwvc3Bhbj5cXG4gICAgICAgIDwvYT5cXG4gICAgICA8L2xpPlxcbiAgICA8L3VsPlxcbiAgICA8dWwgY2xhc3M9XFxcInByb2R1Y3RzLWxpc3QgcHJvZHVjdC1saXN0LWluLWJveFxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDBweDtcXFwiPlxcbiAgICAgIDxsaSBuZy1yZXBlYXQ9XFxcInRhc2sgaW4gdGFza3NcXFwiIGNsYXNzPVxcXCJpdGVtXFxcIiBzdHlsZT1cXFwicGFkZGluZzogMHB4O1xcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJib3ggYm94LXRhc2stY2FyZFxcXCI+XFxuXFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJveC1oZWFkZXJcXFwiPlxcbiAgICAgICAgICAgIDxoMyBjbGFzcz1cXFwiYm94LXRpdGxlXFxcIj5UYXNrI3t7ICRpbmRleCsxIH19IHt7IHRhc2sudGl0bGUgfX08L2gzPlxcbiAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgICAgPHRhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCI+XFxuICAgICAgICAgICAgPHRib2R5PlxcbiAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgIDx0ZD5TdGFydCBkYXRlPC90ZD5cXG4gICAgICAgICAgICAgIDx0ZD57eyB0YXNrLnN0YXJ0IHwgZGF0ZTogXFwnc2hvcnRcXCd9fTwvdGQ+XFxuICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgIDx0ZD5FbmQgZGF0ZTwvdGQ+XFxuICAgICAgICAgICAgICA8dGQ+e3sgdGFzay5lbmQgfCBkYXRlOiBcXCdzaG9ydFxcJ319PC90ZD5cXG4gICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgPC90Ym9keT5cXG4gICAgICAgICAgPC90YWJsZT5cXG5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgIDwvbGk+XFxuICAgIDwvdWw+XFxuICA8L2Rpdj5cXG48L2Rpdj5cIik7XG4kdGVtcGxhdGVDYWNoZS5wdXQoXCJ0ZW1wbGF0ZXMvdGVhbS1tZW1iZXJzLmh0bWxcIixcIjwhLS0gc2VhcmNoIGZvcm0gKE9wdGlvbmFsKSAtLT5cXG48ZGl2IGNsYXNzPVxcXCJzaWRlYmFyLWZvcm1cXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwiaW5wdXQtZ3JvdXBcXFwiPlxcbiAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmFtZT1cXFwicVxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlNlYXJjaC4uLlxcXCIgbmctbW9kZWw9XFxcImZpbHRlckJ5TmFtZVxcXCI+XFxuICAgIDxzcGFuIGNsYXNzPVxcXCJpbnB1dC1ncm91cC1idG5cXFwiPlxcbiAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBuYW1lPVxcXCJzZWFyY2hcXFwiIGlkPVxcXCJzZWFyY2gtYnRuXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1mbGF0XFxcIj48aSBjbGFzcz1cXFwiZmEgZmEtc2VhcmNoXFxcIj48L2k+PC9idXR0b24+XFxuICAgIDwvc3Bhbj5cXG4gIDwvZGl2PlxcbjwvZGl2PlxcbjwhLS0gLy5zZWFyY2ggZm9ybSAtLT5cXG5cXG48IS0tIFNpZGViYXIgTWVudSAtLT5cXG48dWwgY2xhc3M9XFxcInNpZGViYXItbWVudVxcXCI+XFxuICA8bGkgY2xhc3M9XFxcImhlYWRlclxcXCI+XFxuICAgIE1FTUJFUlNcXG4gIDwvbGk+XFxuICA8bGkgbmctcmVwZWF0PVxcXCJtZW1iZXIgaW4gbWVtYmVycyB8IGZpbHRlcjogeyB1c2VybmFtZTogZmlsdGVyQnlOYW1lIH1cXFwiIG5nLW1vZGVsPVxcXCJtZW1iZXJcXFwiIG5nLWNsaWNrPVxcXCJzZWxlY3QobWVtYmVyLmlkKVxcXCI+XFxuICAgIDxhIGhyZWY9XFxcIiNcXFwiPjxpIG5nLWNsYXNzPVxcXCJhdmF0YXIobWVtYmVyKVxcXCI+PC9pPiZuYnNwO3t7IG1lbWJlci51c2VybmFtZX19PC9hPlxcbiAgPC9saT5cXG48L3VsPlxcblwiKTt9XSk7IiwiLy8gY2FsZW5kYXIgY29udHJvbGxlclxuYXBwLmNvbnRyb2xsZXIoJ2NhbGVuZGFyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGNvbXBpbGUsIHVpQ2FsZW5kYXJDb25maWcsIE1lbWJlclNlcnZpY2UsIFRhc2tzU2VydmljZSwgJHJvb3RTY29wZSkge1xuXG4gICRzY29wZS5ldmVudFJlbmRlciA9IGZ1bmN0aW9uKGV2ZW50LCBlbGVtZW50LCB2aWV3KSB7XG4gICAgdmFyIG1lbWJlciA9IE1lbWJlclNlcnZpY2UuZ2V0QnlJZChldmVudC5tZW1iZXJJZCk7XG4gICAgdmFyIGF2YXRhciA9IGFuZ3VsYXIuZWxlbWVudChNZW1iZXJTZXJ2aWNlLmF2YXRhcihtZW1iZXIsICgodmlldy50eXBlID09PSAnbW9udGgnKT8gJ2F2YXRhci1zbScgOiAnJykpKTtcbiAgICBpZih2aWV3LnR5cGUgPT09ICdtb250aCcpe1xuICAgICAgZWxlbWVudC5maW5kKCcuZmMtdGltZScpLmJlZm9yZShhdmF0YXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXNlciA9IGFuZ3VsYXIuZWxlbWVudCgnPGRpdj4nKS5odG1sKG1lbWJlci51c2VybmFtZSkuYWRkQ2xhc3MoJ2F2YXRhci11c2VybmFtZScpLnByZXBlbmQoYXZhdGFyKTtcbiAgICAgIGVsZW1lbnQuZmluZCgnLmZjLXRpbWUnKS5iZWZvcmUodXNlcik7XG4gICAgfVxuICAgIGVsZW1lbnQuY3NzKHtcbiAgICAgIHBhZGRpbmc6ICczcHgnXG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmV2ZW50Q2xpY2sgPSBmdW5jdGlvbihldmVudCwganNFdmVudCkge1xuICAgIC8vICR1aWJNb2RhbC5vcGVuKHtcbiAgICAvLyAgIGFuaW1hdGlvbjogJHNjb3BlLmFuaW1hdGlvbnNFbmFibGVkLFxuICAgIC8vICAgdGVtcGxhdGVVcmw6ICdqcy90ZW1wbGF0ZXMvY2FsZW5kYXItZXZlbnQuaHRtbCcsXG4gICAgLy8gICBjb250cm9sbGVyOiAnTW9kYWxJbnN0YW5jZUN0cmwnLFxuICAgIC8vICAgcmVzb2x2ZToge1xuICAgIC8vICAgICBldmVudDogZXZlbnQsXG4gICAgLy8gICAgIG1lbWJlcjogTWVtYmVyU2VydmljZS5nZXRCeUlkKGV2ZW50Lm1lbWJlcklkKSxcbiAgICAvLyAgIH1cbiAgICAvLyB9KTtcbiAgfTtcblxuICAvKiBldmVudCBzb3VyY2UgdGhhdCBjb250YWlucyBjdXN0b20gZXZlbnRzIG9uIHRoZSBzY29wZSAqL1xuICAkc2NvcGUuZXZlbnRzID0gVGFza3NTZXJ2aWNlLmZldGNoKCk7XG5cbiAgLyogY29uZmlnIG9iamVjdCAqL1xuICAkc2NvcGUudWlDb25maWcgPSB7XG4gICAgY2FsZW5kYXI6IHtcbiAgICAgIGhlaWdodDogNjAwLFxuICAgICAgaGVhZGVyOiB7XG4gICAgICAgIGxlZnQ6ICdwcmV2LG5leHQgdG9kYXknLFxuICAgICAgICBjZW50ZXI6ICd0aXRsZScsXG4gICAgICAgIHJpZ2h0OiAnbW9udGgsYWdlbmRhV2VlaydcbiAgICAgIH0sXG4gICAgICBidXR0b25UZXh0OiB7XG4gICAgICAgIHRvZGF5OiAndG9kYXknLFxuICAgICAgICBtb250aDogJ21vbnRoJyxcbiAgICAgICAgd2VlazogJ3dlZWsnXG4gICAgICB9LFxuICAgICAgZXZlbnRzOiAkc2NvcGUuZXZlbnRzLFxuICAgICAgLy8gZXZlbnRDbGljazogJHNjb3BlLmV2ZW50Q2xpY2ssXG4gICAgICBldmVudFJlbmRlcjogJHNjb3BlLmV2ZW50UmVuZGVyLFxuICAgICAgZGF5TmFtZXM6IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdLFxuICAgICAgZGF5TmFtZXNTaG9ydDogW1wiU3VuXCIsIFwiTW9uXCIsIFwiVHVlXCIsIFwiV2VkXCIsIFwiVGh1XCIsIFwiRnJpXCIsIFwiU2F0XCJdXG4gICAgfVxuICB9O1xuICAvKiBldmVudCBzb3VyY2VzIGFycmF5Ki9cbiAgJHNjb3BlLmV2ZW50U291cmNlcyA9IFtdO1xuXG4gICRyb290U2NvcGUuJG9uKCdNRU1CRVI6U0VMRUNUJywgZnVuY3Rpb24oZXYsIG1lbWJlcklkKXtcbiAgICAkc2NvcGUudWlDb25maWcuY2FsZW5kYXIuZXZlbnRzID0gVGFza3NTZXJ2aWNlLmJ5TWVtYmVySWQobWVtYmVySWQpO1xuICB9KTtcblxuICAkcm9vdFNjb3BlLiRvbignTUVNQkVSOlVOU0VMRUNUJywgZnVuY3Rpb24oZXYpe1xuICAgICRzY29wZS51aUNvbmZpZy5jYWxlbmRhci5ldmVudHMgPSBUYXNrc1NlcnZpY2UuZmV0Y2goKTtcbiAgfSk7XG59KTsiLCJhcHAuY29udHJvbGxlcignTW9kYWxJbnN0YW5jZUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkdWliTW9kYWxJbnN0YW5jZSwgb3B0aW9ucykge1xuXG4gICRzY29wZS5vcHRpb25zID0gb3B0aW9ucztcblxuICAkc2NvcGUub2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2Uob3B0aW9ucyk7XG4gIH07XG5cbiAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG4gIH07XG59KTtcbiIsImFwcC5kaXJlY3RpdmUoJ2F2YXRhcicsIGZ1bmN0aW9uKE1lbWJlclNlcnZpY2Upe1xuICByZXR1cm4ge1xuICAgIHNjb3BlOiB7XG4gICAgICBtZW1iZXJJZDogJz0nLFxuICAgICAgc2l6ZTogJ0AnXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZSl7XG4gICAgICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGVsZS5odG1sKCcnKS5hcHBlbmQoTWVtYmVyU2VydmljZS5hdmF0YXIoTWVtYmVyU2VydmljZS5nZXRCeUlkKCRzY29wZS5tZW1iZXJJZCksICRzY29wZS5zaXplKSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuJHdhdGNoKCdtZW1iZXJJZCcsICRzY29wZS5pbml0LCB0cnVlKTtcbiAgICB9XG4gIH07XG59KTtcbiIsImFwcC5kaXJlY3RpdmUoJ3RlYW1NZW1iZXJDYXJkJywgZnVuY3Rpb24oTWVtYmVyU2VydmljZSwgJHJvb3RTY29wZSwgVGFza3NTZXJ2aWNlKXtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy90ZWFtLW1lbWJlci1jYXJkLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSl7XG5cbiAgICAgIHZhciBjb2xvcnMgPSBbJ2JsdWUnLCAnZ3JlZW4nLCAneWVsbG93JywgJ3JlZCddO1xuXG4gICAgICAkc2NvcGUubWVtYmVySWQgPSBudWxsO1xuICAgICAgJHNjb3BlLmdldCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIGdldCByYW5kb20gdGhlbWVcbiAgICAgICAgJHNjb3BlLnRoZW1lQ29sb3IgPSAnYmctJytjb2xvcnNbKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpICldO1xuXG4gICAgICAgICRzY29wZS5tZW1iZXIgPSBNZW1iZXJTZXJ2aWNlLmdldEJ5SWQoJHNjb3BlLm1lbWJlcklkKTtcbiAgICAgICAgJHNjb3BlLnRhc2tzID0gVGFza3NTZXJ2aWNlLmJ5TWVtYmVySWQoJHNjb3BlLm1lbWJlcklkKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zaG93ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuICgkc2NvcGUubWVtYmVySWQgJiYgJHNjb3BlLm1lbWJlciAmJiAkc2NvcGUubWVtYmVyLmlkKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5pc0FsbERheSA9IGZ1bmN0aW9uKGFsbERheSl7XG4gICAgICAgIHJldHVybiBhbGxEYXk/ICdZRVMnIDogJ05PJztcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5jbG9zZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5tZW1iZXJJZCA9ICRzY29wZS5tZW1iZXIgPSBudWxsO1xuICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdNRU1CRVI6VU5TRUxFQ1QnKTtcbiAgICAgIH07XG5cbiAgICAgICRyb290U2NvcGUuJG9uKCdNRU1CRVI6U0VMRUNUJywgZnVuY3Rpb24oZXYsIG1lbWJlcklkKXtcbiAgICAgICAgJHNjb3BlLm1lbWJlcklkID0gbWVtYmVySWQ7XG4gICAgICAgICRzY29wZS5nZXQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZigkc2NvcGUubWVtYmVySWQpIHtcbiAgICAgICAgJHNjb3BlLmdldCgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgndGVhbU1lbWJlcnMnLCBmdW5jdGlvbihNZW1iZXJTZXJ2aWNlLCAkcm9vdFNjb3BlKSB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvdGVhbS1tZW1iZXJzLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlKSB7XG4gICAgICAkc2NvcGUuZmlsdGVyQnlOYW1lID0gJyc7XG4gICAgICAkc2NvcGUubWVtYmVycyA9IE1lbWJlclNlcnZpY2UuZmV0Y2goKTtcbiAgICAgICRzY29wZS5hdmF0YXIgPSBmdW5jdGlvbihtZW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIE1lbWJlclNlcnZpY2UuZ2V0QXZhdGFyQ2xhc3MobWVtYmVyKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zZWxlY3QgPSBmdW5jdGlvbihtZW1iZXJJZCkge1xuICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdNRU1CRVI6U0VMRUNUJywgbWVtYmVySWQpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLmFkZCA9IGZ1bmN0aW9uKG1lbWJlcikge1xuICAgICAgICBpZiAoIW1lbWJlcikge1xuICAgICAgICAgIG1lbWJlciA9IHt1c2VybmFtZTogJyd9O1xuICAgICAgICB9XG5cbiAgICAgICAgTWVtYmVyU2VydmljZS5jcmVhdGUobWVtYmVyKVxuICAgICAgICAgIC5yZXN1bHRcbiAgICAgICAgICAudGhlbihmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5tZW1iZXIgJiYgb3B0aW9ucy5tZW1iZXIudXNlcm5hbWUgJiYgIW9wdGlvbnMubWVtYmVyLmlkKSB7XG4gICAgICAgICAgICAgIG9wdGlvbnMubWVtYmVyLmlkID0gJHNjb3BlLm1lbWJlcnMubGVuZ3RoICsgMTtcbiAgICAgICAgICAgICAgb3B0aW9ucy5tZW1iZXIuYXZhdGFyID0gJ2F2YXRhci1jb2xvci0nICsgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIxNSkgKyAxICk7XG4gICAgICAgICAgICAgICRzY29wZS5tZW1iZXJzLnB1c2gob3B0aW9ucy5tZW1iZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9XG4gIH07XG59KTtcbiIsImFwcC5zZXJ2aWNlKCdNZW1iZXJTZXJ2aWNlJywgZnVuY3Rpb24oJHVpYk1vZGFsKSB7XG4gIHZhciBjYWNoZWQgPSBbXG4gICAge1xuICAgICAgaWQ6IDEsXG4gICAgICB1c2VybmFtZTogJ0RhdmlkJyxcbiAgICAgIHJvbGU6ICdEZXZlbG9wZXInLFxuICAgICAgYXZhdGFyOiAnYXZhdGFyLWNvbG9yLTM1J1xuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDIsXG4gICAgICB1c2VybmFtZTogJ0FsZXgnLFxuICAgICAgcm9sZTogJ1VJIERldmVsb3BlcicsXG4gICAgICBhdmF0YXI6ICdhdmF0YXItY29sb3ItMjUnXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogMyxcbiAgICAgIHVzZXJuYW1lOiAnQm9iYnknLFxuICAgICAgcm9sZTogJ1FBIEVuZ2luZWVyJyxcbiAgICAgIGF2YXRhcjogJ2F2YXRhci1jb2xvci00MCdcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiA0LFxuICAgICAgdXNlcm5hbWU6ICdNYXR0JyxcbiAgICAgIHJvbGU6ICdQcm9kdWN0IEd1eScsXG4gICAgICBhdmF0YXI6ICdhdmF0YXItY29sb3ItMjAwJ1xuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDUsXG4gICAgICB1c2VybmFtZTogJ0RlZXAnLFxuICAgICAgcm9sZTogJ0J1aWxkIEd1eScsXG4gICAgICBhdmF0YXI6ICdhdmF0YXItY29sb3ItMjAnXG4gICAgfVxuICBdO1xuXG4gIHZhciBtZW1iZXJzQnlJZCA9IHt9O1xuICBhbmd1bGFyLmZvckVhY2goY2FjaGVkLCBmdW5jdGlvbihtZW1iZXIpe1xuICAgIG1lbWJlcnNCeUlkW21lbWJlci5pZF0gPSBtZW1iZXI7XG4gIH0pO1xuXG4gIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY2FjaGVkO1xuICB9O1xuXG4gIHRoaXMuZ2V0QnlJZCA9IGZ1bmN0aW9uKG1lbWJlcklkKSB7XG4gICAgcmV0dXJuIG1lbWJlcnNCeUlkW21lbWJlcklkXTtcbiAgfTtcblxuICB0aGlzLmdldEF2YXRhckNsYXNzID0gZnVuY3Rpb24obWVtYmVyLCBzaXplKXtcbiAgICB2YXIgbmFtZSA9IG1lbWJlci5hdmF0YXIrJyAnKydhdmF0YXItbGV0dGVyLScrKG1lbWJlci51c2VybmFtZS50b0xvd2VyQ2FzZSgpLmNoYXJBdCgwKSk7XG4gICAgc2l6ZSA9IChzaXplIHx8ICcnKTtcbiAgICByZXR1cm4gJ2F2YXRhciBhdmF0YXItcGxhaW4gYXZhdGFyLW1hcmdpbiAnK3NpemUrJyAnK25hbWU7XG4gIH07XG5cbiAgdGhpcy5hdmF0YXIgPSBmdW5jdGlvbihtZW1iZXIsIHNpemUpe1xuICAgIHJldHVybiAnPGkgY2xhc3M9XCInK3RoaXMuZ2V0QXZhdGFyQ2xhc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKSsnXCI+PC9pPic7XG4gIH07XG5cbiAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbihtZW1iZXIpe1xuICAgIHJldHVybiAkdWliTW9kYWwub3Blbih7XG4gICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9tZW1iZXItbW9kYWwuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnTW9kYWxJbnN0YW5jZUN0cmwnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgbWVtYmVyOiBtZW1iZXJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSk7XG4iLCJhcHAuc2VydmljZSgnVGFza3NTZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG4gIHZhciBkYXRlID0gbmV3IERhdGUoKSxcbiAgICBkID0gZGF0ZS5nZXREYXRlKCksXG4gICAgbSA9IGRhdGUuZ2V0TW9udGgoKSxcbiAgICB5ID0gZGF0ZS5nZXRGdWxsWWVhcigpLFxuICAgIGNhY2hlZCA9IFtcbiAgICAgIHtcbiAgICAgICAgdGl0bGU6ICdXb3JraW5nIG9uIHRlc3QgY2FzZXMnLFxuICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgMSksXG4gICAgICAgIGVuZDogbmV3IERhdGUoeSwgbSwgMiksXG4gICAgICAgIG1lbWJlcklkOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0aXRsZTogJ0J1Zy0xMzYzNDY5OTMnLFxuICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCArIDQsIDE2LCAwKSxcbiAgICAgICAgYWxsRGF5OiB0cnVlLFxuICAgICAgICBtZW1iZXJJZDogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGl0bGU6ICdCdWctMTM2MzQ2NDQzJyxcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgLSA1KSxcbiAgICAgICAgZW5kOiBuZXcgRGF0ZSh5LCBtLCBkIC0gMiksXG4gICAgICAgIG1lbWJlcklkOiAyXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0aXRsZTogJ1VJIHRyYW5zZm9ybWF0aW9uIG9mIHByb2plY3QgaG9tZSBwYWdlJyxcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgLSAzLCAxNiwgMCksXG4gICAgICAgIGFsbERheTogdHJ1ZSxcbiAgICAgICAgbWVtYmVySWQ6IDNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRpdGxlOiAnRGF0YWJhc2UgYXJjaGl0ZWN0dXJlIHJlZGVzaWduJyxcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgKyAxLCAxOSwgMCksXG4gICAgICAgIGVuZDogbmV3IERhdGUoeSwgbSwgZCArIDEsIDIyLCAzMCksXG4gICAgICAgIGFsbERheTogdHJ1ZSxcbiAgICAgICAgbWVtYmVySWQ6IDJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRpdGxlOiAnalF1ZXJ5IGZyYW1ld29yayBldmFsdWF0aW9uJyxcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgKyA0LCAxNiwgMCksXG4gICAgICAgIGFsbERheTogdHJ1ZSxcbiAgICAgICAgbWVtYmVySWQ6IDNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRpdGxlOiAnUHJvZHVjdCBSb2FkIE1hcCBwbGFubmluZycsXG4gICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCAxKSxcbiAgICAgICAgbWVtYmVySWQ6IDRcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRpdGxlOiAnVUkgdHJhbnNmb3JtYXRpb24gb2YgcHJvamVjdCBob21lIHBhZ2UnLFxuICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCAtIDMsIDE2LCAwKSxcbiAgICAgICAgYWxsRGF5OiB0cnVlLFxuICAgICAgICBtZW1iZXJJZDogNFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGl0bGU6ICdCdWctMTM2MzQ2OTkzJyxcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgKyAzLCAxNiwgMCksXG4gICAgICAgIGFsbERheTogdHJ1ZSxcbiAgICAgICAgbWVtYmVySWQ6IDVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRpdGxlOiAnVUkgUmV2aWV3JyxcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgKyAzLCAxOSwgMCksXG4gICAgICAgIGVuZDogbmV3IERhdGUoeSwgbSwgZCArIDQsIDIyLCAzMCksXG4gICAgICAgIGFsbERheTogdHJ1ZSxcbiAgICAgICAgbWVtYmVySWQ6IDNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRpdGxlOiAnalF1ZXJ5IGZyYW1ld29yayBldmFsdWF0aW9uJyxcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgKyA0LCAxNiwgMCksXG4gICAgICAgIGFsbERheTogdHJ1ZSxcbiAgICAgICAgbWVtYmVySWQ6IDNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRpdGxlOiAnVmFjdGlvbicsXG4gICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCBkKSxcbiAgICAgICAgZW5kOiBuZXcgRGF0ZSh5LCBtLCBkICsgMyksXG4gICAgICAgIGFsbERheTogZmFsc2UsXG4gICAgICAgIG1lbWJlcklkOiAxLFxuICAgICAgICBjbGFzc05hbWU6IFsndmFjdGlvbiddXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0aXRsZTogJ1ZhY3Rpb24nLFxuICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCs2KSxcbiAgICAgICAgZW5kOiBuZXcgRGF0ZSh5LCBtLCBkICsgNyksXG4gICAgICAgIGFsbERheTogZmFsc2UsXG4gICAgICAgIG1lbWJlcklkOiAzLFxuICAgICAgICBjbGFzc05hbWU6IFsndmFjdGlvbiddXG4gICAgICB9LFxuICAgIF07XG5cbiAgdGhpcy5ieU1lbWJlcklkID0gZnVuY3Rpb24obWVtYmVySWQpe1xuICAgIHJldHVybiBfLmZpbHRlcihjYWNoZWQsIGZ1bmN0aW9uKHRhc2spe1xuICAgICAgcmV0dXJuIHRhc2subWVtYmVySWQgPT09IG1lbWJlcklkO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY2FjaGVkO1xuICB9O1xuXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
