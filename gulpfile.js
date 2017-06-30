'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const webpack = require('webpack-stream');
const watch = require('gulp-watch');


gulp.task('default', ['browser-sync'], function () {
});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:5000",
        files: ["public/**/*.*"],
        port: 7000,
    });

    watch('./public/css/**/*.css', () => {
        gulp.start('cssInject');
    });

    watch('./views/**/*.pug', () => {
        browserSync.reload();
    });

    watch('./public/js/**/*.js', () =>{
        gulp.start('scriptsRefresh');

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

gulp.task('scriptsRefresh',['webpacker'], function(){
    browserSync.reload();
});


gulp.task('webpacker', function(callback){
    return gulp.src('./public/js/main.js')
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest('public/'));
});
