var app = angular.module('app', ['ui.calendar', 'ui.bootstrap']);

app.run(['$templateCache', function($templateCache) {
      'use strict';
      $templateCache.put('js/templates/calendar-event.html',
        "<div class=\"modal-header\"><h3 class=\"modal-title\">Event</h3></div><div class=\"modal-body\"></div><div class=\"modal-footer\"><button class=\"btn btn-primary\" type=\"button\" ng-click=\"ok()\">OK</button> <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button></div>"
      );


      $templateCache.put('js/templates/member-modal.html',
        "<div class=\"modal-header\"><h3 class=\"modal-title\">New Member</h3></div><div class=\"modal-body\"><form><div class=\"form-group\"><label>Username</label><input type=\"text\" class=\"form-control\" ng-model=\"options.member.username\" placeholder=\"Username\"></div></form></div><div class=\"modal-footer\"><button class=\"btn btn-primary\" type=\"button\" ng-click=\"ok()\">OK</button> <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button></div>"
      );


      $templateCache.put('js/templates/team-members.html',
        "<div class=\"sidebar-form\"><div class=\"input-group\"><input type=\"text\" name=\"q\" class=\"form-control\" placeholder=\"Search...\" ng-model=\"filterByName\"><span class=\"input-group-btn\"><button type=\"button\" name=\"search\" id=\"search-btn\" class=\"btn btn-flat\"><i class=\"fa fa-search\"></i></button></span></div></div><ul class=\"sidebar-menu\"><li class=\"header\">MEMBERS <button type=\"button\" class=\"btn btn-xs\" data-widget=\"collapse\" style=\"float:right\" ng-click=\"add()\"><i class=\"icon ion-person-add\"></i></button></li><li ng-repeat=\"member in members | filter: { username: filterByName }\" ng-model=\"member\" ng-click=\"add(member)\"><i ng-class=\"avatar(member)\"></i>&nbsp;{{ member.username}}</li></ul>"
      );
}]);
