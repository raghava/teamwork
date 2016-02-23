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