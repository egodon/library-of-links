'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const watch = require('gulp-watch');


gulp.task('default', ['browser-sync'], function () {
});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:5000",
        files: ["public/**/*.*"],
        port: 7000,
    });

    watch('./public/css/**/*.css', function(){
        gulp.start('cssInject');
    });
});

gulp.task('nodemon', function (cb) {

    var started = false;

    return nodemon({
        script: 'app.js'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('cssInject', function(){
    return gulp.src('./public/css/styles.css')
        .pipe(browserSync.stream());

});
