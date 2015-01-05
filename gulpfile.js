// Never used Gulp?? Don't worry it's pretty easy
// ----------------------------------------------

// store your gulp plugins in variables
var gulp = require('gulp'),
gutil = require('gulp-util'),
concat = require('gulp-concat'),
sass = require('gulp-sass'),
sourcemaps = require('gulp-sourcemaps'),
minifyCss = require('gulp-minify-css'),
rename = require('gulp-rename'),
autoprefixer = require('gulp-autoprefixer'),
imagemin = require('gulp-imagemin'),
uglify = require('gulp-uglify'),
connect = require('gulp-connect');



// we might use the paths to our css & js a bit in this file, so why not just store their paths?
var paths = {
  sass: ['./scss/**/*.scss'],
  js  : ['./www/**/*.js'],
  img : ['./www/img/*']
};

// prints to the console what the error is if an error occurs
function errorLog(error) {
  console.error.bind(error);
  this.emit('end');
}



// use this task during DEVELOPMENT as it is better for debugging
gulp.task('default', ['sass', 'webserver', 'watch']);

// use this task when the app needs to go to PRODUCTION
gulp.task('prod', ['styles', 'scripts', 'images']);

// the watch task allows us to keep an eye on our files for changes
gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('webserver', function() {
  connect.server({
    root: './www',
    port: 7373,
    livereload: true
  });
});

gulp.task('sass', function() {
  gulp.src('./scss/beast.app.scss')
  .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', errorLog)
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./www/css/'))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest('./www/css/'))
  .pipe(connect.reload());
});

gulp.task('styles', function() {
  gulp.src('./css/beast.app.css')
  .pipe(rename({ extname: '.min.css' }))
  .pipe(gulp.dest('./www/css/'));
});

gulp.task('scripts', function() {
  gulp.src(paths.js)
  .pipe(concat())
  .pipe(uglify())
  .on('error', errorLog)
  .pipe(rename({ extname: '.min.js' }))
  .pipe(gulp.dest('./www/js/'));
});

gulp.task('images', function() {
  gulp.src(paths.img)
  .pipe(imagemin())
  .pipe(gulp.dest('./www/img'));
});
