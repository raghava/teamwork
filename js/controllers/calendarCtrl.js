// home-controller
app.controller('calendarCtrl', function($scope, $compile, uiCalendarConfig, MemberService, $uibModal) {
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

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
  $scope.events = [
    {
      title: 'Working on test cases',
      start: new Date(y, m, 1),
      memberId: 1
    },
    {
      title: 'Bug-136346443',
      start: new Date(y, m, d - 5),
      end: new Date(y, m, d - 2),
      memberId: 2
    },
    {
      id: 999,
      title: 'UI transformation of project home page',
      start: new Date(y, m, d - 3, 16, 0),
      allDay: false,
      memberId: 3
    },
    {
      id: 999,
      title: 'Bug-136346993',
      start: new Date(y, m, d + 4, 16, 0),
      allDay: false,
      memberId: 1
    },
    {
      title: 'Database architecture redesign',
      start: new Date(y, m, d + 1, 19, 0),
      end: new Date(y, m, d + 1, 22, 30),
      allDay: true,
      memberId: 2
    },
    {
      id: 999,
      title: 'jQuery framework evaluation',
      start: new Date(y, m, d + 4, 16, 0),
      allDay: false,
      memberId: 3
    }
  ];

  /* config object */
  $scope.uiConfig = {
    calendar: {
      height: 600,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      buttonText: {
        today: 'today',
        month: 'month',
        week: 'week',
        day: 'day'
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
});
