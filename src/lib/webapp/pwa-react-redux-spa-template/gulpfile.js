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
    proxy = require('http-proxy-middleware'),
    fs = require('fs'),
    path = require('path'),
    fse = require('fs-extra');

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

//将静态文件拷贝到目标目录
gulp.task('cssmin', function (done) {
    gulp.src([BUILD_CONFIG.src_dir + '/libs/**/*.css']).pipe(gulp.dest(BUILD_CONFIG.build_dir + BUILD_CONFIG.html_dir + '/libs')).on('end', done);
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
        .pipe(swig())
        .pipe(gulp.dest(BUILD_CONFIG.dev_dir + '/'));

    // pwa manifest复制和service-worker复制
    gulp.src([BUILD_CONFIG.src_dir + '/html/manifest.json', BUILD_CONFIG.src_dir + '/html/service-worker.js',])
        .pipe(gulp.dest(BUILD_CONFIG.dev_dir + '/'))
        .on('end', done);
});

//用于在html文件中直接include文件, 主要处理buildhtml文件
gulp.task('fileinclude-build', function (done) {
    gulp.src([BUILD_CONFIG.src_dir + '/html' + '/*.html'])
        .pipe(swig({
            data: {
                inlineCordova: !process.argv.splice(2)[1]
            }
        }))
        .pipe(htmlmin(htmlMinOptions))
        .pipe(gulp.dest(BUILD_CONFIG.build_dir + '/www/'));
    // pwa manifest复制
    gulp.src([BUILD_CONFIG.src_dir + '/html/manifest.json'])
        .pipe(gulp.dest(BUILD_CONFIG.build_dir + '/www/'))
        .on('end', done);;
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
        .on('end', function() {});

    // 拷贝图片资源
    gulp.src([BUILD_CONFIG.dev_dir + 'img/**'])
        .pipe(gulp.dest(BUILD_CONFIG.build_dir + 'www/img/'))
        .on('end', pkg);
    /**
     * 将静态资源打包成发布包
     *
     */
    function pkg() {
        // 生成pwa service-worker文件缓存列表
        let cacheList = [
            '/www/',
            '/www/index.html',
            '/www/manifest.json',
        ];

        
        let wsjspaths = readFileList(BUILD_CONFIG.build_dir + 'www/js/');
        let wslibsList = readFileList(BUILD_CONFIG.build_dir + 'www/libs/');
        let wscssList = readFileList(BUILD_CONFIG.build_dir + 'www/css/');
        let wsimgList = readFileList(BUILD_CONFIG.build_dir + 'www/img/');

        wsjspaths.forEach(function (item) {
            cacheList.push('/www/js/' + item);
        });

        wslibsList.forEach(function (item) {
            if (item.indexOf('.js') > -1) {
                cacheList.push('/www/libs/' + item);
            }
        });
        wscssList.forEach(function (item) {
            if (item.indexOf('.css') > -1) {
                cacheList.push('/www/css/' + item);
            }
        });

        wsimgList.forEach(function (item) {
            if (item.indexOf('.png') > -1) {
                cacheList.push('/www/img/' + item);
            }
        });

        let wsFilePath = readFileList(BUILD_CONFIG.build_dir + 'www/');
        let wsFileName = 'service-worker.js';
        wsFilePath.forEach(function (item) {
            if (item.indexOf('service-worker') > -1) {
                wsFileName = item;
            }
        });

        // 生成pwa cacheList中service-worker的代码
        let cacheListContent = `

console.log('Script loaded!');

var cacheStorageKey = 'pwa-jizhiku';

var cacheList = ${JSON.stringify(cacheList, null, 4)};

self.addEventListener('install', function (e) {
    // console.log('Cache event!');
    e.waitUntil(
        caches.open(cacheStorageKey).then(function (cache) {
            // console.log('Adding to Cache:', cacheList);
            return cache.addAll(cacheList);
        }).then(function () {
            // console.log('Skip waiting!');
            return self.skipWaiting();
        })
    )
});

self.addEventListener('activate', function (e) {
    // console.log('Activate event');
    e.waitUntil(
        Promise.all([
            caches.keys().then(cacheNames => {
                return cacheNames.map(name => {
                    if (name !== cacheStorageKey) {
                        return caches.delete(name);
                    }
                });
            })]
        ).then(() => {
            // console.log('Clients claims.');
            return self.clients.claim();
        })
    )
});

/**
为 fetch 事件添加一个事件监听器。接下来，使用 caches.match() 函数来检查传入的请求 URL 是否匹配当前缓存中存在的任何内容。如果存在的话，返回缓存的资源。
如果资源并不存在于缓存当中，通过网络来获取资源，并将获取到的资源添加到缓存中。
*/
self.addEventListener('fetch', function (e) {
    // console.log('Fetch event:', e.request.url);
    // 对于需要缓存的地址进行拦截读取
    if (e.request.url.indexOf(location.host) > -1) {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                if (response != null) {
                    console.log('Using cache for:', e.request.url);
                    return response;
                }
                console.log('Fallback to fetch:', e.request.url);
                return fetch(e.request.url);
            })
        )
    }
});
`;
        fse.outputFile(path.join(BUILD_CONFIG.build_dir + 'www/', wsFileName), cacheListContent, function (err, data) {
            if (err) throw err;
            console.log('生成PWA service worker文件列表.');
        });

        // 删除编译多余的图片目录
        gulp.src(BUILD_CONFIG.build_dir + '**/img/biz-components/')
        .pipe(clean({ force: true }));

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

    function readFileList(rootDir) {
        let paths = [];

        if (fse.pathExistsSync(rootDir)) {
            paths = fs.readdirSync(rootDir);
        }

        return paths;
    }
}

//发布
gulp.task('dist', ['fileinclude-build', 'md5:css', 'md5:js']);

gulp.task('release', ['fileinclude', 'lessmin', 'copy:js:css', 'fileinclude-build', 'cssmin', 'md5:js', 'md5:css',]);

gulp.task('pkg', [], copyStatics);  // 打包静态文件成发布包

//开发，不默认打开open浏览器

gulp.task('dev', ['connect', 'copy:images', 'fileinclude', 'lessmin', 'build-js', 'copy:js:css', 'open', 'watch']);
gulp.task('default', ['connect', 'copy:images', 'fileinclude', 'lessmin', 'build-js', 'mock', 'watch', 'open']);
