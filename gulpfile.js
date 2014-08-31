var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var rename = require('gulp-rename');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var minifyHtml = require('gulp-minify-html');
var replace = require('gulp-replace');
var nodemon = require('gulp-nodemon');

// Task responsible for less
gulp.task('less', function() {
    // Build it
    gulp.src(['public/less/main.less'])
        .pipe(less())
        .pipe(gulp.dest('public/dist'));
});
gulp.task('less-prod', function() {
    // Build it
    gulp.src(['public/less/main.less'])
        .pipe(less())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('public/dist'));
});
// Task responsible for pages
gulp.task('html', function() {
    gulp.src(['public/pages/*.html'])
        .pipe(replace('{{.css}}', '.css'))
        .pipe(replace('{{.js}}', '.js'))
        .pipe(replace('{{.html}}', '.html'))
        .pipe(replace('</body>', '<script src="http://localhost:35729/livereload.js"></script></body>'))
        .pipe(gulp.dest('public/dist'));
    gulp.src(['public/partials/*.html'])
        .pipe(rename({
            extname: '.partial.html'
        }))
        .pipe(gulp.dest('public/dist'));
});
gulp.task('html-prod', function() {
    gulp.src(['public/pages/*.html'])
        .pipe(replace('{{.css}}', '.min.css'))
        .pipe(replace('{{.js}}', '.min.js'))
        .pipe(replace('{{.html}}', '.min.html'))
        .pipe(rename({
            extname: '.min.html'
        }))
        .pipe(minifyHtml({
            empty: true,
            quotes: true
        }))
        .pipe(gulp.dest('public/dist'));

    gulp.src(['public/partials/*.html'])
        .pipe(rename({
            extname: '.partial.min.html'
        }))
        .pipe(minifyHtml({
            empty: true,
            quotes: true
        }))
        .pipe(gulp.dest('public/dist'));
});
// Task responsible for running the server
gulp.task('server', function() {
    nodemon({
        script: 'server.js',
        ext: 'js',
        ignore: ['public/*'],
        env: {
            TUACM_DEV: 'true',
            TUACM_LOGPATH: path.join(__dirname, 'logs'),
            TUACM_MONGO_URL: 'mongodb://tuacm:tuacm@kahana.mongohq.com:10045/tuacm',
            TUACM_SESSION_SECRET: 'thisIsSoSecretBro',
            TUACM_PORT: '3000'
        }
    });
});
// Task responsible for assembling js
gulp.task('js', function() {
    // Build it
    gulp.src('public/js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('public/dist'));
});
gulp.task('js-prod', function() {
    // Build it
    gulp.src('public/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/dist'));
});
// Task readies for deployment
gulp.task('build', ['less', 'js', 'html'], function() {});
gulp.task('deploy', ['less-prod', 'js-prod', 'html-prod'], function() {});
// Starts the dev server
gulp.task('watch', ['server'], function() {
    livereload.listen();
    gulp.watch('public/js/*.js', ['js']).on('change', livereload.changed);
    gulp.watch('public/less/*.less', ['less']).on('change', livereload.changed);
    gulp.watch('public/pages/*.html', ['html']).on('change', livereload.changed);;
    gulp.watch('public/partials/*.html', ['html']).on('change', livereload.changed);;
});
// Executed on the 'gulp' command
gulp.task('default', ['build', 'watch']);