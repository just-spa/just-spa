var alias = require('gulp-miniprogram-path-alias');
var path = require('path');
var gulp = require('gulp');
const { babel } = require('gulp-load-plugins')();

const gulpLoadPlugins = require('gulp-load-plugins');
const plumber = require('gulp-plumber');
const notify = require("gulp-notify");
const del = require('del');
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require('autoprefixer');
const esBabel = require('gulp-babel');

const other_file = [
    'src/**/*.*',
    '!src/**/*.js',
    '!src/**/*.ts',
    '!src/**/*.wxs',
    '!src/**/*.less',
    '!src/**/*.scss',
    '!src/**/*.json'
];

// 编译
gulp.task("compile:ts", function () {
    return gulp.src(["src/**/*.ts"])
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js.pipe(sourcemaps.write())
        .pipe(alias(aliasConfig))
        .pipe(babel())
        .pipe(gulp.dest("dist"));
});

// load all gulp plugins
const plugins = gulpLoadPlugins();
const env = process.env.NODE_ENV || 'development';
const isProduction = () => env === 'production';

function _join(dirname) {
    console.log('path=', __dirname, path.join(__dirname, 'src', dirname));
    return path.join(__dirname, 'src', dirname);
}

const aliasConfig = {
    commonPath: _join('logic'),
};

function handleErrors(errorObject, callback) {
    notify.onError(errorObject.toString().split(': ').join(':\n')).apply(this, arguments);
    // Keep gulp from hanging on this task
    if (typeof this.emit === 'function') {
        this.emit('end');
    }
}

/**
 * Clean distribution directory
 */
gulp.task('clean', del.bind(null, ['dist/*']));


/**
 * Compile js source to distribution directory
 */
gulp.task('compile:js', () => {
    return gulp.src(['src/**/*.js', '!src/miniprogram_npm/**/*.*'])
        .pipe(babel({
            plugins: ['transform-node-env-inline'],
        }))
        .pipe(plumber(handleErrors))
        .pipe(plugins.newer('dist'))
        .pipe(plugins.logger({ showChange: true }))
        .pipe(alias(aliasConfig))
        // .pipe(plugins.if(isProduction, plugins.uglify()))
        .pipe(gulp.dest('dist'))
});

/**
 * Compile js source to distribution directory
 */
gulp.task('copy:npm', () => {
    return gulp.src(['src/miniprogram_npm/**/*.*'])
        .pipe(plugins.newer('dist'))
        .pipe(gulp.dest('dist/miniprogram_npm'))
});

/**
 * Compile wxs source to distribution directory
 */
gulp.task('compile:wxs', () => {
    return gulp.src(['src/**/*.wxs'])
        .pipe(
            babel({
                presets: [
                    ["@babel/env",
                        {
                            "modules": false,
                        }
                    ]],

                plugins: [
                    // '@babel/transform-runtime',
                    ['@babel/plugin-proposal-class-properties', { loose: true }],
                    'transform-node-env-inline',
                ],
            })
        )
        .pipe(plugins.newer('dist'))
        // .pipe(plugins.if(isProduction, plugins.uglify()))
        .pipe(gulp.dest('dist'))
});

/**
 * Compile less source to distribution directory
 */
gulp.task('compile:less', () => {
    return gulp.src(['src/**/*.less'])
        // .pipe(plumber(handleErrors))
        .pipe(plugins.less())
        .pipe(plugins.rename({ extname: '.wxss' }))
        .pipe(plugins.newer('dist'))
        .pipe(plugins.logger({ showChange: true }))
        // .pipe(plugins.if(isProduction, plugins.cssnano({compatibility: '*'})))
        .pipe(gulp.dest('dist'))
});

// 编译 scss
gulp.task('compile:scss', () => {
    return gulp.src(['src/**/*.scss'])
        .pipe(plumber(handleErrors))
        .pipe(plugins.sass())
        .pipe(plugins.postcss([autoprefixer()]))
        .pipe(plugins.rename({ extname: '.wxss' }))
        .pipe(plugins.newer('dist'))
        .pipe(plugins.logger({ showChange: true }))
        // .pipe(plugins.if(isProduction, plugins.cssnano({compatibility: '*'})))
        .pipe(gulp.dest('dist'))
})

/**
 * Compile json source to distribution directory
 */
gulp.task('compile:json', () => {
    return gulp.src(['src/**/*.json', '!src/**/common/preview/**'])
        .pipe(plumber(handleErrors))
        .pipe(plugins.newer('dist'))
        .pipe(plugins.logger({ showChange: true }))
        // .pipe(plugins.jsonminify())
        .pipe(gulp.dest('dist'))
});

/**
 * Compile source to distribution directory
 */
gulp.task('compile', gulp.series('clean',
    gulp.parallel(
        'compile:ts',
        'compile:js',
        'compile:wxs',
        'compile:scss',
        'compile:less',
        'compile:json',
        'copy:npm'
    )
)
);

/**
 * Copy extras to distribution directory
 */
gulp.task('extras', () => {
    return gulp.src(other_file).pipe(gulp.dest('dist'))
});

/**
 * Build
 */
gulp.task('build', gulp.series('compile', 'extras'));

/**
 * Watch source change
 */
gulp.task('watch', gulp.series('build', function () {
    gulp.watch("src/**/*.ts", gulp.series("compile:ts"));
    gulp.watch('src/**/*.js', gulp.series('compile:js'));
    gulp.watch('src/**/data-adapter.js', gulp.series('compile:wxs'));
    gulp.watch('src/**/*.less', gulp.series('compile:less'));
    gulp.watch('src/**/*.scss', gulp.series('compile:scss'));
    gulp.watch('src/**/*.json', gulp.series('compile:json'));
    gulp.watch(other_file, gulp.series('extras'))
}));

/**
 * Default task
 */
gulp.task('default', gulp.series('watch'));
