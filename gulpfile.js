const
  gulp      = require('gulp'),
  clean     = require("gulp-clean"),
  imagemin  = require("gulp-imagemin"),
  plumber   = require('gulp-plumber'),
  notify    = require('gulp-notify'),
  inlinecss = require("gulp-inline-css"),
  sass      = require("gulp-sass"),
  cache     = require('gulp-cache');

gulp.task('scss', () => {
  return gulp.src('src/scss/**/*.scss')
  .pipe(plumber({
    errorHandler: notify.onError((err) => {
      return {
        title: 'scss',
        message: err.message
      }
    })
  }))
  .pipe(sass({
    outputStyle: 'expanded'
  }))
  .pipe(gulp.dest('src/css'));
});

gulp.task('inline-css', () => {
  return gulp.src('src/*.html')
  .pipe(inlinecss())
  .pipe(gulp.dest('./build/'));
});

gulp.task('clean', () => {
  return gulp.src('build', {read: false})
  .pipe(clean());
});

gulp.task('images', () => {
  return gulp.src('src/img/**/*')
  .pipe(cache(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.svgo({plugins: [{removeViewBox: true}]})
  ])))
  .pipe(gulp.dest('build/img'));
});

gulp.task('watch', () => {
  gulp.watch(['src/scss/*.scss', 'src/*.html'], gulp.series('scss', 'inline-css'));
  gulp.watch('src/img/*', gulp.series('images'));
});

gulp.task('build', gulp.series('scss', 'inline-css', 'images'));
gulp.task('default', gulp.series('watch'));


