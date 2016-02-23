angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("templates/calendar-event.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">Event</h3>\n</div>\n<div class=\"modal-body\">\n  \n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ok()\">OK</button>\n  <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n</div>\n");
$templateCache.put("templates/member-modal.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">New Member</h3>\n</div>\n<div class=\"modal-body\">\n  <form>\n  <div class=\"form-group\">\n    <label>Username</label>\n    <input type=\"text\" class=\"form-control\" ng-model=\"options.member.username\" placeholder=\"Username\">\n  </div>\n</form>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ok()\">OK</button>\n  <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n</div>\n");
$templateCache.put("templates/task-modal.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">Task</h3>\n</div>\n<div class=\"modal-body\">\n  <form>\n    <div class=\"form-group\">\n      <label>Title</label>\n      <input type=\"text\" class=\"form-control\" ng-model=\"options.task.title\" placeholder=\"Task title\">\n    </div>\n\n    <div class=\"form-group\">\n      <label>Start Date</label>\n      <input type=\"date\" class=\"form-control\" ng-model=\"options.task.start\">\n    </div>\n\n    <div class=\"form-group\">\n      <label>End Date</label>\n      <input type=\"date\" class=\"form-control\" ng-model=\"options.task.end\">\n    </div>\n\n  </form>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ok()\">OK</button>\n  <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n</div>\n");
$templateCache.put("templates/team-member-card.html","<div class=\"box box-widget widget-user-2\" ng-if=\"show()\">\n  <!-- Add the bg color to the header using any of the bg-* classes -->\n  <div class=\"widget-user-header\" ng-class=\"themeColor\">\n\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" ng-click=\"close()\">\n      <span aria-hidden=\"true\">x</span>\n    </button>\n\n    <div class=\"widget-user-image\">\n      <avatar ng-if=\"member.id\" member-id=\"member.id\" size=\"avatar-md\"></avatar>\n    </div>\n    <!-- /.widget-user-image -->\n    <h3 class=\"widget-user-username\">{{ member.username }}</h3>\n    <h5 class=\"widget-user-desc\">{{ member.role }}</h5>\n  </div>\n  <div class=\"box-footer no-padding\">\n    <ul class=\"nav nav-stacked\">\n      <li>\n        <a href=\"#\">\n          <b>Tasks</b>\n          <span class=\"pull-right badge bg-aqua\" ng-click=\"create()\">+ New</span>\n        </a>\n      </li>\n    </ul>\n    <ul class=\"products-list product-list-in-box\" style=\"margin-bottom: 0px;\">\n      <li ng-repeat=\"task in tasks\" class=\"item\" style=\"padding: 0px;\">\n        <div class=\"box box-task-card\">\n\n          <div class=\"box-header\">\n            <h3 class=\"box-title\">Task#{{ $index+1 }} {{ task.title }}</h3>\n          </div>\n\n          <table class=\"table\">\n            <tbody>\n            <tr>\n              <td>Start date</td>\n              <td>{{ task.start | date: \'short\'}}</td>\n            <tr>\n            <tr>\n              <td>End date</td>\n              <td>{{ task.end | date: \'short\'}}</td>\n            <tr>\n            </tbody>\n          </table>\n\n        </div>\n      </li>\n    </ul>\n  </div>\n</div>");
$templateCache.put("templates/team-members.html","<!-- search form (Optional) -->\n<div class=\"sidebar-form\">\n  <div class=\"input-group\">\n    <input type=\"text\" name=\"q\" class=\"form-control\" placeholder=\"Search...\" ng-model=\"filterByName\">\n    <span class=\"input-group-btn\">\n      <button type=\"button\" name=\"search\" id=\"search-btn\" class=\"btn btn-flat\"><i class=\"fa fa-search\"></i></button>\n    </span>\n  </div>\n</div>\n<!-- /.search form -->\n\n<!-- Sidebar Menu -->\n<ul class=\"sidebar-menu\">\n  <li class=\"header\">\n    MEMBERS\n  </li>\n  <li ng-repeat=\"member in members | filter: { username: filterByName }\" ng-model=\"member\" ng-click=\"select(member.id)\">\n    <a href=\"#\"><i ng-class=\"avatar(member)\"></i>&nbsp;{{ member.username}}</a>\n  </li>\n</ul>\n");}]);