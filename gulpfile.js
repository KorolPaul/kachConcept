"use strict"

var lr = require('tiny-lr'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    connectlr = require('connect-livereload'),
    image = require('gulp-image'),
    svg2png = require('gulp-svg2png'),
    server = lr(),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('server', function () {
    connect.server({
        livereload: true,
        port: 3000
    })
});

gulp.task('html', function () {
    gulp.src('*.html')
      .pipe(connect.reload());
});

gulp.task('img', function () {
    gulp.src('img/**/*.{png,jpg,gif,svg}')
      .pipe(image())
      .pipe(gulp.dest('/img'));
});

gulp.task('sass', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(autoprefixer({
		    browsers: ['last 2 versions'],
		    cascade: false
		}))
		.pipe(gulp.dest('./'))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src('js/**/*')
      //.pipe(uglify())
      .pipe(gulp.dest('Scripts'))
      .pipe(connect.reload());;
});


gulp.task('watch', function () {
    gulp.watch(['*.html', './scss/**/*.scss'], ['html', 'sass']);
});

gulp.task('default', function () {
    gulp.run('server', 'watch');
});