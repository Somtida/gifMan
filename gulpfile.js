var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');


gulp.task('default', function() {

  gulp.watch('client/**', ['convertJS']);


  gulp.task('convertJS', function() {
    return gulp.src('client/**')
      .pipe(concat('all.js'))
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest('public/js'));

  });

});
