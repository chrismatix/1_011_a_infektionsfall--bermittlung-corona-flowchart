import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import hash from "gulp-hash";
import postcss from "gulp-postcss";
import babel from "gulp-babel";
import del from "del";
import htmlmin from "gulp-htmlmin";
import runSequence from "run-sequence";
import sass from "gulp-sass";
import svgo from "gulp-svgo";
import gulp from "gulp";
import { spawn } from 'child_process';
import paths from "./paths";

const processors = [
    autoprefixer,
    cssnano
];

const buildPaths = paths.BUILD_PATHS;
const srcPaths = paths.SOURCE_PATHS;

const hashManifest = () => hash.manifest('hash.json', {
    deleteOld: true
});

// Compile SCSS files to CSS
gulp.task('scss', function (cb) {
    del([buildPaths.CSS]).then(() => {

        gulp.src(srcPaths.SCSS)
            .pipe(sass())
            .pipe(postcss(processors))
            .pipe(hash())
            .pipe(gulp.dest('static/css'))
            //Create a hash map
            .pipe(hashManifest())
            //Put the map in the data directory
            .pipe(gulp.dest('data/css'))
            .on('end', cb);
    });

});

// Hash images
gulp.task('images', function (cb) {
    del(['static/images/**/*']).then(() => {

    gulp.src(srcPaths.IMAGES)
        .pipe(hash())
        .pipe(gulp.dest('static/images'))
        .pipe(hashManifest())
        .pipe(gulp.dest('data/images'))
        .on('end', cb);
    });
});

// Hash svgs and optimize
gulp.task('svg', function (cb) {
    del([buildPaths.SVG]).then(() => {

    gulp.src(srcPaths.SVG)
        .pipe(svgo())
        .pipe(hash())
        .pipe(gulp.dest('static/svg'))
        .pipe(hashManifest())
        .pipe(gulp.dest('data/svg'))
        .on('end', cb);
    });
});

// Hash javascript
gulp.task('js', function (cb) {
    del(['static/js/**/*']).then(() => {

        gulp.src(srcPaths.JS)
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(hash())
            .pipe(gulp.dest('static/js'))
            .pipe(hashManifest())
            .pipe(gulp.dest('data/js'))
            .on('end', cb);
    });
});


gulp.task('hugo-build', function(cb) {
    const hugo = spawn('hugo', ['-v']);

    hugo.stdout.on('data', (data) => process.stdout.write(data));

    hugo.stderr.on('data', (data) => process.stderr.write(data));

    hugo.on('close', (code) => {
        console.log(`hugo exited with code ${code}`);
        cb();
    });
});

gulp.task('clean', function () {
    return del(['public', buildPaths.JS, buildPaths.CSS, buildPaths.IMAGES]);
});

gulp.task('minify-html', () => {
    return gulp.src('public/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true,
            useShortDoctype: true,
        }))
        .pipe(gulp.dest('./public'))
});

// Watch asset folder for changes
gulp.task('watch', ['scss', 'images', 'js', 'svg'], function () {
    gulp.watch(srcPaths.SCSS, ['scss']);
    gulp.watch(srcPaths.IMAGES, ['images']);
    gulp.watch(srcPaths.JS, ['js']);
    gulp.watch(srcPaths.SVG, ['svg']);

    const hugoServer = spawn('hugo', ['server', '-v']);

    hugoServer.stdout.on('data', (data) => process.stdout.write(data));

    hugoServer.stderr.on('data', (data) => process.stderr.write(data));

    hugoServer.on('close', (code) => {
        console.log(`hugo exited with code ${code}`);
    });
});

gulp.task('build', function(callback) {
    return runSequence(
        'clean',
        ['scss', 'images', 'js', 'svg'],
        'hugo-build',
        'minify-html',
        callback);
});

// Set watch as default task
gulp.task('default', ['watch']);
