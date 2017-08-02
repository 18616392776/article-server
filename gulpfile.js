const gulp = require('gulp');
const tslint = require('gulp-tslint');
const gulpTypescript = require('gulp-typescript');
const gulpNodemon = require('gulp-nodemon');
const GulpFileCache = require('gulp-file-cache');
const gulpSourceMaps = require('gulp-sourcemaps');

const tsProject = gulpTypescript.createProject('./tsconfig.json');

const cache = new GulpFileCache();
gulp.task('tslint', () => {
    return gulp.src('./src/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report({
            allowWarnings: true
        }));
});

gulp.task('script', ['tslint'], () => {
    return gulp.src('./src/**/*.ts')
        .pipe(gulpSourceMaps.init())
        .pipe(cache.filter())
        .pipe(tsProject())
        .pipe(cache.cache())
        .pipe(gulpSourceMaps.write('./'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', () => {
    return gulp.watch('./src/**/*.ts', ['script']);
});

gulp.task('server', ['script'], () => {
    const stream = gulpNodemon({
        script: 'dist/main.js',
        ext: 'js',
        watch: 'dist/',
        env: {
            "NODE_ENV": "development"
        }
    });

    stream.on('restart', () => {
        console.log('正在重启应用...\n');
    });
    stream.on('crash', () => {
        console.log('卡壳了，等10秒再重启...\n');
        stream.emit('restart', 10);
    });
    return stream;
});

gulp.task('start', ['watch', 'server']);
gulp.task('debugger', ['watch', 'script']);