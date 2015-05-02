var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gfi = require("gulp-file-insert");

gulp.task('compress', function() {
    gulp.src('lib/*.js')
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('jquery', function () {
    return gulp.src('jquery/jquery.tmp.js')
        .pipe(gfi({
            "/* Wheel-indicator */": "lib/wheel-indicator.js"
        }))
        .pipe(rename({
            basename: 'wheel-indicator',
            prefix: 'jquery.',
            extname: '.js'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist'));
});
