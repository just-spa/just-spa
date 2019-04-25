/**
 Gulpfile for gulp-webpack-demo
 created by fwon
*/

const gulp = require('gulp'),
    os = require('os'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    gulpOpen = require('gulp-open'),
    cssmin = require('gulp-cssmin'),
    md5 = require('gulp-md5-plus'),
    swig = require('gulp-swig'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify-es').default,
    // htmlmin = require('gulp-htmlmin'),
    htmlmin = require('gulp-html-minifier'),
    spriter = require('gulp-css-spriter'),
    base64 = require('gulp-css-base64'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js'),
    connect = require('gulp-connect'),
    proxy = require('http-proxy-middleware');

const tar = require('gulp-tar');
const gzip = require('gulp-gzip');

const BUILD_CONFIG = webpackConfig.plugins[1].options.BUILD_CONFIG;
const proxyDevServer = webpackConfig.plugins[1].options.proxyDevServer;

var htmlMinOptions = {
    // removeComments: true,//清除HTML注释
    // collapseWhitespace: true,//压缩HTML
    // collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
    // removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    // removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    // removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    // minifyJS: true,//压缩页面JS
    // minifyCSS: true,//压缩页面CSS
    // preserveLineBreaks: true,

	minifyJS: true,
	minifyURLs: true,
	minifyCSS: true,
	removeAttributeQuotes: false,
	removeComments: true,
	sortClassName: true,
	removeTagWhitespace: true,
	collapseInlineTagWhitespace: false,
	collapseWhitespace: true, //
	preserveLineBreaks: false, //压缩成一行，需要collapseWhitespace=true时生效
};

const host = {
    path: BUILD_CONFIG.dev_server_root + '/',
    port: 3000,
    html: 'index.html'
};

// mac chrome: "Google chrome",
const browser = os.platform() === 'linux' ? 'Google chrome' : (
    os.platform() === 'darwin' ? 'Google chrome' : (
        os.platform() === 'win32' ? 'chrome' : 'firefox'));

//将图片拷贝到目标目录
gulp.task('copy:images', function (done) {
    gulp.src([BUILD_CONFIG.src_dir + '/**/*.png']).pipe(gulp.dest(BUILD_CONFIG.dev_dir + '/img')).on('end', done);
});

//将静态文件拷贝到目标目录
gulp.task('copy:js:css', function (done) {
    gulp.src([BUILD_CONFIG.src_dir + '/libs/**.*', BUILD_CONFIG.src_dir + '/libs/**/*.*']).pipe(gulp.dest(BUILD_CONFIG.dev_dir + '/libs')).on('end', done);
});


//压缩合并css, css中既有自己写的.less, 也有引入第三方库的.css
gulp.task('lessmin', function (done) {
    gulp.src([BUILD_CONFIG.src_dir + '/less/**.less'])
        .pipe(less())
        //这里可以加css sprite 让每一个css合并为一个雪碧图
        .pipe(spriter({
            spriteSheet: BUILD_CONFIG.dev_dir + '/img/sprite.png',
            pathToSpriteSheetFromCSS: './img/sprite.png',
            spritesmithOptions: {
                padding: 10
            }
        }))
        .pipe(gulp.dest(BUILD_CONFIG.dev_dir + '/css/'))
        .on('end', done);
});

//将js加上10位md5,并修改html中的引用路径，该动作依赖build-js
gulp.task('md5:js', ['build-js'], function (done) {
    gulp.src(BUILD_CONFIG.dev_dir + '/**/*.js')
        .pipe(md5(10, BUILD_CONFIG.build_dir + BUILD_CONFIG.html_dir + '/*.html'))
        .pipe(uglify({
            compress: true,//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(gulp.dest(BUILD_CONFIG.build_dir + '/www/'))
        .on('end', done);
});

//将css加上10位md5，并修改html中的引用路径，该动作依赖sprite
gulp.task('md5:css', ['sprite'], function (done) {
    gulp.src(BUILD_CONFIG.dev_dir + '/**/*.css')
        .pipe(md5(10, BUILD_CONFIG.build_dir + BUILD_CONFIG.html_dir + '/*.html'))
        .pipe(gulp.dest(BUILD_CONFIG.build_dir + '/www/'))
        .on('end', done);
});

//用于在html文件中直接include文件
gulp.task('fileinclude', function (done) {
    gulp.src([BUILD_CONFIG.src_dir + '/html' + '/*.html'])
        .pipe(swig({
            data: {
                name: 'swig template'
            }
        }))
        .pipe(gulp.dest(BUILD_CONFIG.dev_dir + '/'))
        .on('end', done);
});

//用于在html文件中直接include文件, 主要处理buildhtml文件
gulp.task('fileinclude-build', function (done) {
    gulp.src([BUILD_CONFIG.src_dir + '/html' + '/*.html'])
        .pipe(swig({
            data: {
                name: 'swig template'
            }
        }))
        .pipe(gulp.dest(BUILD_CONFIG.build_dir + '/www/'))
        .on('end', done);
});

//雪碧图操作，应该先拷贝图片并压缩合并css
gulp.task('sprite', ['copy:images', 'lessmin'], function (done) {
    gulp.src(BUILD_CONFIG.dev_dir + '/css/style.min.css')
        .pipe(spriter({
            spriteSheet: BUILD_CONFIG.dev_dir + '/img/sprite.png',
            pathToSpriteSheetFromCSS: './img/sprite.png',
            spritesmithOptions: {
                padding: 10
            }
        }))
        .pipe(base64())
        .pipe(cssmin())
        .pipe(gulp.dest(BUILD_CONFIG.dev_dir + '/www/css'))
        .on('end', done);
});

// 删除构建发布目录缓存
gulp.task('clean', function () {
    gulp.src([BUILD_CONFIG.dev_dir, BUILD_CONFIG.build_dir])
        .pipe(clean({ force: true }));
});

// 进行watch编译
gulp.task('watch', function (done) {
    gulp.watch(BUILD_CONFIG.src_dir + '/**/*', ['lessmin', 'build-js', 'fileinclude'])
        .on('end', done);
});

// 启动调试静态server
gulp.task('connect', function () {
    connect.server({
        root: [host.path],
        port: host.port,
        livereload: true,
        middleware: function (connect, opt) {
            return [
                proxy('/www/api/', {
                    target: `http://${proxyDevServer}`,
                    pathRewrite: {
                        '^/www/api/': '/api/',     // 代理重写路径
                    },
                    changeOrigin: true
                })
            ]
        }
    });
});

// 打开浏览器进行调试
gulp.task('open', function (done) {
    gulp.src('')
        .pipe(gulpOpen({
            app: browser,
            // uri为启动静态服务器的登录目录
            uri: 'http://localhost:3000/www/index.html#main-page'
        })).on('end', done);
});

var buildCompiler = webpack(Object.create(webpackConfig));

//引用webpack对js进行dist操作
gulp.task('build-js', ['fileinclude-build'], function (callback) {
    buildCompiler.run(function (err, stats) {
        if (err) throw new gutil.PluginError('webpack:build-js', err);
        gutil.log('[webpack:build-js]', stats.toString({
            colors: true
        }));
        callback();
    });
});


//同步mock数据
gulp.task('mock', function (done) {
    gulp.src([BUILD_CONFIG.src_dir + '/mock' + '/*.*'])
        .pipe(gulp.dest(BUILD_CONFIG.dev_dir + '/mock/'))
        .on('end', done);
});

//拷贝打包的font和图片资源
function copyStatics() {
    let taskFinished = 0;
    // 拷贝字体资源
    gulp.src([BUILD_CONFIG.dev_dir + 'fonts/**'])
        .pipe(gulp.dest(BUILD_CONFIG.build_dir + 'www/fonts/'))
        .on('end', pkg);

    // 拷贝图片资源
    gulp.src([BUILD_CONFIG.dev_dir + 'img/**'])
        .pipe(gulp.dest(BUILD_CONFIG.build_dir + 'www/img/'))
        .on('end', pkg);
    /**
     * 将静态资源打包成发布包
     *
     */
    function pkg() {
        // 标识是否完成资源拷贝
        if (taskFinished >= 1) {
            gulp.src(BUILD_CONFIG.pkg_src_dir + '**')
                .pipe(tar('gdt_contract_ad-fe.tar', { mode: null }))
                .pipe(gzip())
                .pipe(gulp.dest(BUILD_CONFIG.pkg_build_dir));
        } else {
            taskFinished++;
        }
    }
}

//发布
gulp.task('dist', ['fileinclude-build', 'md5:css', 'md5:js']);

gulp.task('release', ['fileinclude', 'lessmin', 'copy:js:css', 'fileinclude-build', 'cssmin', 'md5:js', 'md5:css',]);

gulp.task('pkg', [], copyStatics);  // 打包静态文件成发布包

//开发，不默认打开open浏览器

gulp.task('dev', ['connect', 'copy:images', 'fileinclude', 'lessmin', 'build-js', 'copy:js:css', 'open', 'watch']);
gulp.task('default', ['connect', 'copy:images', 'fileinclude', 'lessmin', 'build-js', 'mock', 'watch', 'open']);
