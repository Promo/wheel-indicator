var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gfi = require('gulp-file-insert');

gulp.task('compress', function() {
    gulp.src('lib/*.js')
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('jquery', function () {
    return gulp.src('systems/jquery.js')
        .pipe(gfi({
            "/* Wheel-indicator */": "lib/wheel-indicator.js"
        }))
        .pipe(rename({
            basename: 'wheel-indicator',
            prefix: 'jquery.',
            extname: '.js'
        }))
        .pipe(gulp.dest('dist/jquery'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist/jquery'));
});

gulp.task('commonjs', function () {
    return gulp.src('systems/common.js')
        .pipe(gfi({
            "/* Wheel-indicator */": "lib/wheel-indicator.js"
        }))
        .pipe(rename({
            basename: 'wheel-indicator',
            extname: '.js'
        }))
        .pipe(gulp.dest('dist/commonjs'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist/commonjs'));
});

gulp.task('amd', function () {
    return gulp.src('systems/amd.js')
        .pipe(gfi({
            "/* Wheel-indicator */": "lib/wheel-indicator.js"
        }))
        .pipe(rename({
            basename: 'wheel-indicator',
            extname: '.js'
        }))
        .pipe(gulp.dest('dist/amd'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist/amd'));
});

gulp.task('default', [ 'compress', 'jquery', 'commonjs', 'amd' ]);
