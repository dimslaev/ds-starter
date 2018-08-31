'use strict'

import gulp from 'gulp'
import path from 'path'
import webpack from 'webpack-stream'
import webpackConfig from './webpack.config.babel'
import bs from 'browser-sync'
import gulpif from 'gulp-if'
import rename from 'gulp-rename'
import del from 'del'
import sass from 'gulp-sass'
import cleanCss from 'gulp-clean-css'
import autoprefixer from 'gulp-autoprefixer'
import fileinclude from 'gulp-file-include'
import htmlreplace from 'gulp-html-replace'
import htmlmin from 'gulp-htmlmin'
import imagemin from 'gulp-imagemin'


const env      = 'development'
const dev      = env === 'development'
const server   = bs.create()
const browsers = ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9']
const sassets  = './src/assets'
const dassets  = './dist/assets'


function reload(done) {
    server.reload()
    done()
}

function serve(done) {
    server.init({
        server: {
            baseDir: './dist'
        }
    })
    done()
}

function clean() {
    return del('dist/')
}

gulp.task('clean', clean)

function styles() {
    return gulp.src(sassets + '/scss/main.scss')
        .pipe(sass())
        .on('error', function(err){
            console.log(err.message.toString())
            this.emit('end')
        })
        .pipe(gulpif(!dev, autoprefixer(browsers)))
        .pipe(gulpif(!dev, cleanCss({level: 2})))
        .pipe(gulpif(!dev, rename('main.min.css')))
        .pipe(gulp.dest(dassets + '/css'))
}

gulp.task('styles', styles)

function scripts() {
    return gulp.src(sassets + '/js/main.js')
        .pipe(webpack(webpackConfig[env]))
        .on('error', function () {
            this.emit('end')
        })
        .pipe(gulp.dest(dassets + '/js'))
}

gulp.task('scripts', scripts)


function images() {
    return gulp.src(sassets + '/img/**/*')
        .pipe(gulpif(!dev, imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('./dist/assets/img'))
}

gulp.task('images', images)

function html() {
    return gulp.src('./src/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .on('error', function(){
            this.emit('end')
        })
        .pipe(gulpif(!dev, htmlreplace({
            'css': 'assets/css/main.min.css',
            'js': 'assets/js/bundle.min.js'
        })))
        .pipe(gulpif(!dev, htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('./dist'))
}

gulp.task('html', html)

function copy() {
    return gulp.src([
        './src/**',
        '!./src/assets',
        '!./src/assets/**/*',
        '!./src/partials',
        '!./src/partials/**/*',
        '!./src/**/*.html'
    ]).pipe(gulp.dest('./dist'))
}

gulp.task('copy', copy)

function watch() {
    gulp.watch(sassets + '/js/**/*.js', scripts),
    gulp.watch(sassets + '/scss/**/*.scss', styles),
    gulp.watch(sassets + '/img/**/*', images),
    gulp.watch('src/**/*.html', html),
    gulp.watch(['dist/**/*.html', dassets + '/css/**/*.css', dassets + '/js/**/*.js', dassets + '/img/**/*'], reload)
}


const build = gulp.series(clean, gulp.parallel(styles, scripts, html, images, copy))

const develop = gulp.series(build, serve, watch)

gulp.task('build', build)

gulp.task('default', develop)