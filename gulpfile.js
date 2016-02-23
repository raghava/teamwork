var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sh = require('shelljs');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
  templates: ['./templates/**/*.html'],
  js: ['./js/src/**/*.js']
};
var templateCache = require('gulp-angular-templatecache');

gulp.task('default', ['templates', 'scripts']);

gulp.task('scripts', function() {
  return gulp.src(['./js/app.js', './js/templates.js', './js/src/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./js/dist/'));
});

gulp.task('templates', function () {
  return gulp.src(paths.templates)
    .pipe(templateCache({
      module: 'app',
      transformUrl: function(url) {
        return 'templates/'+url;
      }
    }))
    .pipe(gulp.dest('./js/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.js[0], ['templates', 'scripts']);
  gulp.watch(paths.templates[0], ['templates', 'scripts']);
});