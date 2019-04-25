const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const less = require('gulp-less');
const minimist = require('minimist');
const fse = require('fs-extra');

const knownOptions = {
    string: 'env',
    default: { env: process.env.NODE_ENV || 'production' }
};

const options = minimist(process.argv.slice(2), knownOptions);

options.src = path.join(options.src ,'.build', options.name);

if (!options.src || !fse.pathExistsSync(options.src)) {
    console.log('build源目录不存在，从源目录拷贝文件...');
    fse.copySync(options.dist, options.src);
}

fse.copySync(options.dist, options.src);

options.dist = path.join(options.dist ,'lib');

// 拷贝文件
gulp.src([
    path.join(options.src, '**/*.*'),
    '!' + path.join(options.src, '**/*.js*'),
    '!' + path.join(options.src, '**/*.less'),
    '!' + path.join(options.src, '**/*.json'),
    '!' + path.join(options.src, '**/*.md'),
    '!' + path.join(options.src, '**/lib/**')
]).pipe(gulp.dest(options.dist));

// 处理js
gulp.src(path.join(options.src, 'src/**/*.js*'))
    .pipe(babel({
        presets: ['es2015', 'react', 'stage-0']
    }))
    .pipe(gulp.dest(options.dist));

gulp.src(path.join(options.src, 'src/*.less'))
        .pipe(less())
        .pipe(gulp.dest(options.dist));

console.log('构建任务完成100%');
