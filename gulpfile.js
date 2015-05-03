var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gfi = require('gulp-file-insert');
var header = require('gulp-header');
var pkg = require('./package.json');

var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    '',
    ''].join('\n');

gulp.task('compress', function() {
    gulp.src('lib/*.js')
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist'))
});

['jquery', 'commonjs', 'amd'].forEach(function(system){
    gulp.task(system, function () {
        return gulp.src('systems/' + system + '.js')
            .pipe(gfi({
                "/* Wheel-indicator */": "lib/wheel-indicator.js"
            }))
            .pipe(header(banner, { pkg : pkg } ))
            .pipe(rename({
                basename: 'wheel-indicator',
                prefix: system + '.',
                extname: '.js'
            }))
            .pipe(gulp.dest('dist/' + system))
            .pipe(uglify())
            .pipe(header(banner, { pkg : pkg } ))
            .pipe(rename({
                extname: '.min.js'
            }))
            .pipe(gulp.dest('dist/' + system));
    });
});

gulp.task('es6', function () {
    return gulp.src('systems/es6.js')
        .pipe(gfi({
            "/* Wheel-indicator */": "lib/wheel-indicator.js"
        }))
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(rename({
            basename: 'wheel-indicator',
            extname: '.js'
        }))
        .pipe(gulp.dest('dist/es6'));

    //uglify of es6 modules doesn't work yet
    //    .pipe(uglify())
        //.pipe(rename({
        //    extname: '.min.js'
        //}))
        //.pipe(gulp.dest('dist/es6'));
});

gulp.task('default', [ 'compress', 'jquery', 'commonjs', 'amd', 'es6' ]);
