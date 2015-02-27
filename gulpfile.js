
// Never used Gulp?? Don't worry it's pretty easy
// ----------------------------------------------

// store your gulp plugins in variables
var gulp     = require('gulp'),
gutil        = require('gulp-util'),
sass         = require('gulp-sass'),
minifycss    = require('gulp-minify-css'),
uncss        = require('gulp-uncss'),
glob         = require('glob'),
concat       = require('gulp-concat'),
rename       = require('gulp-rename'),
autoprefixer = require('gulp-autoprefixer'),
imagemin     = require('gulp-imagemin'),
uglify       = require('gulp-uglify'),
browserSync  = require('browser-sync');



// we might use the paths to our css & js a bit in this file, so why not just store their paths?
var paths = {
  sass: ['./build/scss/**/*.scss'],
  js  : ['./build/js/**/.js'],
  img : ['./build/img/*'],
  css : ['./**/*.css'],
  html: ['./www/**/*.html']
};

// you might want to call your js & css something other than beast. If that's the case, just change it below.
var appName = 'beast';

// prints to the terminal what the error is if an error occurs
function errorLog(error) {
  console.error.bind(error);
  this.emit('end');
}



// use this task during DEVELOPMENT as it is better for debugging
gulp.task('default', ['sass', 'browser-sync', 'watch']);

// use this task when the app needs to go to PRODUCTION
gulp.task('prod', ['styles', 'scripts', 'images']);

// the watch task allows us to keep an eye on our files for changes
gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('browser-sync', function() {
  browserSync.init(["css/*.css", "js/*.js", "*.html"], {
      server: {
          baseDir: "./www"
      }
  });
});

gulp.task('sass', function() {
  gulp.src('./build/scss/' + appName + '.app.scss')
  .pipe(sass({ includePaths: ['scss'], errLogToConsole: true }))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest('./www/css/'));
});

gulp.task('styles', function() {
  gulp.src(paths.css)
  .pipe(concat(appName + '.app.css'))
  .pipe(uncss({
    html: ['index.html'] // glob example -- html: glob.sync('templates/**/*.html')
  }))
  .pipe(minifycss())
  .on('error', errorLog)
  .pipe(rename({ extname: '.min.css' }))
  .pipe(gulp.dest('./www/css/'));
});

gulp.task('scripts', function() {
  gulp.src(paths.js)
  .pipe(concat(appName + '.app.js'))
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
