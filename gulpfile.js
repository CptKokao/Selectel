'use strict';

const gulp = require('gulp');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const autoprefixer = require('autoprefixer-stylus');
const plumber = require('gulp-plumber');
const del = require('del');
const sourcemap = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const svgstore = require('gulp-svgstore');
const rename = require('gulp-rename');
const server = require('browser-sync').create();
const smartgrid = require('smart-grid');

gulp.task('pug', function () {
  return gulp.src('source/*.+(jade|pug)')
      .pipe(pug({pretty: '\t'}))
      .pipe(gulp.dest('build/'));
});

gulp.task('css', function () {
  return gulp.src('source/stylus/style.styl')
      .pipe(plumber())
      .pipe(sourcemap.init())
      .pipe(stylus({
        use: [autoprefixer('last 2 versions')]
      }))
      .pipe(sourcemap.write('.'))
      .pipe(gulp.dest('build/css'))
      .pipe(server.stream());
});

gulp.task('scripts', function () {
  return gulp.src('source/js/**/*.js')
      .pipe(babel({
        presets: ['@babel/env']
      }))
      .pipe(gulp.dest('build/js/'));
});

gulp.task('sprite', function () {
  return gulp.src('source/img/{icon-*,}.svg')
      .pipe(svgstore({inlineSvg: true}))
      .pipe(rename('sprite_auto.svg'))
      .pipe(gulp.dest('source/img'))
      .pipe(gulp.dest('build/img'));
});

gulp.task('copy', function () {
  return gulp.src([
    'source/fonts/**/*.{woff,woff2}',
    'source/img/**',
    'source/*.ico'
  ], {
    base: 'source'
  })
      .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/stylus/**/*.styl', gulp.series('css', 'refresh'));
  gulp.watch('source/*.pug', gulp.series('pug', 'refresh'));
  gulp.watch('source/js/**/*.js', gulp.series('scripts', 'refresh'));
});

gulp.task('refresh', function (done) {
  server.reload();
  done();
});

function grid(done) {
  let settings = {
    outputStyle: 'styl',
    columns: 5,
    offset: '30px', // margin между колонок 30/2=15
    container: {
      maxWidth: '930px',
      fields: '15px' // padding контейнера 15
    },
    breakPoints: {
      md: {
        width: '930px', // 577px до 930px
        fields: '30px' // padding контейнера 15
      },
      sm: {
        width: '660px', // 0 до 577px
        fields: '20px' // padding контейнера 15
      }
    }
  };

  smartgrid('./source/stylus/global', settings);
  done();
}

gulp.task('build', gulp.series('clean', 'copy', 'css','scripts', 'sprite', 'pug'));
gulp.task('start', gulp.series('build', 'server'));
gulp.task('grid', grid);
