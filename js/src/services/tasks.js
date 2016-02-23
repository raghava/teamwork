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