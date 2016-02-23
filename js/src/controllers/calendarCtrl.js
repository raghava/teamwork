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