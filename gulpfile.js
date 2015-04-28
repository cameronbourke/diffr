// store your gulp plugins in variables
var gulp     = require('gulp'),
gutil        = require('gulp-util'),
sass         = require('gulp-sass'),
minifyCss    = require('gulp-minify-css'),
concat       = require('gulp-concat'),
autoprefixer = require('gulp-autoprefixer'),
imagemin     = require('gulp-imagemin'),
uglify       = require('gulp-uglify'),
sourceMaps   = require('gulp-sourcemaps'),
browserSync  = require('browser-sync').create();



// we might use the paths to our css & js a bit in this file, so why not just store their paths?
var paths = {

  dev: {
    sass  : ['src/scss/**/*.scss'],
    js    : ['src/js/**/*.js'],
    img   : ['src/img/*'],
    tmpls : ['src/templates/*.html'],
  },

  www: {
    js  : ['www/assets/*.js'],
    img : ['www/assets/*'],
    css : ['www/assets/*.css'],
    html: ['www/**/*.html']
  }

};

// we only want to include the minified vendor files that are actually used in the app.
var vendorConfig = [
  'src/lib/angular/angular.min.js',
  'src/lib/angular-animate/angular-animate.min.js',
  'src/lib/angular-ui-router/release/angular-ui-router.min.js',
  'src/lib/ngInfiniteScroll/build/ng-infinite-scroll.min.js'
];

// you might want to call your js & css something other than beast. If that's the case, just change it below.
var appName = 'diffr';

// prints to the terminal what the error is if an error occurs
function errorLog(error) {
  util.log(util.colors.red('Error: '), error.message);
  this.emit('end');
}



// this is the default task that runs when you do $ gulp
gulp.task('default', ['vendor', 'templates', 'sass', 'js', 'images', 'browser-sync', 'watch']);

// the watch task allows us to keep an eye on our files for changes
gulp.task('watch', function() {
  gulp.watch(paths.dev.sass, ['sass']);
  gulp.watch(paths.dev.js, ['js']);
  gulp.watch(paths.dev.tmpls, ['templates']);
  gulp.watch(paths.dev.img, ['images']);
});



gulp.task('browser-sync', ['js', 'templates', 'images'], function() {
  browserSync.init({
    server: {
      baseDir: "./www"
    }
  });

});

gulp.task('vendor', function() {
  return vendorConfig.forEach(function(path) {
    gulp.src(path)
    .on('error', errorLog)
    .pipe(gulp.dest('www/lib'));
  });
});

gulp.task('templates', function() {
  return gulp.src(paths.dev.tmpls)
  .on('error', errorLog)
  .pipe(gulp.dest('www/templates'));
});

gulp.task('sass', function() {
  return gulp.src('src/scss/' + appName + '.app.scss')
  .pipe(sourceMaps.init())
  .pipe(sass({ errLogToConsole: true }))
  .pipe(autoprefixer({
    browsers: ['last 3 versions'],
    cascade: false
  }))
  // to change the gutil.env.type do $ gulp --type production
  .pipe(gutil.env.type === 'production' ? minifyCss() : gutil.noop())
  .pipe(sourceMaps.write())
  .on('error', errorLog)
  .pipe(gulp.dest('www/assets'))
  .pipe(browserSync.reload({stream:true}));
});

gulp.task('js', function() {
  return gulp.src(paths.dev.js)
  .pipe(sourceMaps.init())
  .pipe(concat(appName + '.app.js'))
  .on('error', errorLog)
  .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
  .pipe(sourceMaps.write())
  .pipe(gulp.dest('www/assets'));
});

gulp.task('images', function() {
  return gulp.src(paths.dev.img)
  .pipe(gutil.env.type === 'production' ? imagemin() : gutil.noop())
  .on('error', errorLog)
  .pipe(gulp.dest('www/assets'));
});
