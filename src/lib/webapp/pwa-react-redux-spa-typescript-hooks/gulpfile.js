
const gulp = require('gulp'),
    os = require('os'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    gulpOpen = require('gulp-open'),
    cssmin = require('gulp-cssmin'),
    md5 = require('gulp-md5-plus'),
    uglify = require('gulp-uglify-es').default,
    htmlmin = require('gulp-html-minifier'),
    swig = require('gulp-swig'),
    clean = require('gulp-clean'),
    base64 = require('gulp-css-base64'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js'),
    connect = require('gulp-connect'),
    proxy = require('http-proxy-middleware'),
    fs = require('fs'),
    path = require('path'),
    fse = require('fs-extra'),
    del = require('del'),
    child_process = require('child_process');

const tar = require('gulp-tar');
const gzip = require('gulp-gzip');

const exec = child_process.exec;
const BUILD_CONFIG = webpackConfig.plugins[0].options.BUILD_CONFIG;
const proxyDevServer = webpackConfig.plugins[0].options.proxyDevServer;

const host = {
    path: BUILD_CONFIG.dev_server_root + '/',
    port: 3002,
    html: 'index.html'
};

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
        .pipe(cssmin())
        //这里可以加css sprite 让每一个css合并为一个雪碧图
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
    gulp.src([BUILD_CONFIG.dev_dir + '/**/*.css'])
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
                inlineCordova: !process.argv.splice(2)[1],
                env: process.env.NODE_ENV,
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
                proxy('/v1.1/', {
                    target: `http://${proxyDevServer}`,
                    pathRewrite: {
                        '^/v1.1/': '/v1.1/',     // 代理重写路径
                    },
                    changeOrigin: true
                }),
                // 登录接口
                proxy('/oauth/', {
                    target: `http://${proxyDevServer}`,
                    pathRewrite: {
                        '^/oauth/': '/oauth/',     // 代理重写路径
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
            uri: 'http://localhost:3000/www/index.html#'
        })).on('end', done);
});

var buildCompiler = webpack(webpackConfig);

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
        // 生成页面JSMap
        let jsPaths = readFileList(BUILD_CONFIG.build_dir + 'www/js/');
        let jsLibsPaths = readFileList(BUILD_CONFIG.build_dir + 'www/libs/js/');
        let jsMaps = {};
        let jsVersions = {};

        jsPaths.forEach(function (item) {
            let array = item.split('_');
            if (array[0]) {
                jsVersions[array[0]] = './js/' + item;
                jsMaps[array[0]] = item;
            }
        });
        jsLibsPaths.forEach(function (item) {
            let array = item.split('.css');
            if (array[0]) {
                jsVersions[array[0]] = './libs/' + item;
                jsMaps[array[0]] = item;
            }
        });

        // 生成pwa service-worker文件缓存列表
        let cacheList = [
            '/manifest.json',
            '/index.html',
            '/page.html',
            '/input.html',
            '/adgroup.html',
            '/tools.html',
            '/error.html',
            '/campaign.html',
            '/creative.html',
        ];
        jsPaths.forEach(function (item) {
            cacheList.push('/js/' + item);
        });

        let wsJsList = readFileList(BUILD_CONFIG.build_dir + 'www/libs/');
        let wscssList = readFileList(BUILD_CONFIG.build_dir + 'www/css/');
        let wsimgList = readFileList(BUILD_CONFIG.build_dir + 'www/img/');

        wsJsList.forEach(function (item) {
            if (item.indexOf('.js') > -1) {
                cacheList.push('/libs/' + item);
            }
        });
        wscssList.forEach(function (item) {
            if (item.indexOf('.css') > -1) {
                cacheList.push('/css/' + item);
            }
        });

        wsimgList.forEach(function (item) {
            if (item.indexOf('.png') > -1) {
                cacheList.push('/img/' + item);
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
    e.waitUntil(
        caches.open(cacheStorageKey).then(function (cache) {
            return cache.addAll(cacheList);
        }).then(function () {
            return self.skipWaiting();
        })
    )
});

self.addEventListener('activate', function (e) {
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
            return self.clients.claim();
        })
    )
});

/**
为 fetch 事件添加一个事件监听器。接下来，使用 caches.match() 函数来检查传入的请求 URL 是否匹配当前缓存中存在的任何内容。如果存在的话，返回缓存的资源。
如果资源并不存在于缓存当中，通过网络来获取资源，并将获取到的资源添加到缓存中。
*/
self.addEventListener('fetch', function (e) {
    var inCacheList = cacheList.some(function(item) {
        return e.request.url.indexOf(item) > -1;
    });

    // 对于需要缓存的地址进行拦截读取。如果是本域名，并且不是api，则可以走service worker
    if (inCacheList) {
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
        gulp.src([BUILD_CONFIG.build_dir + '**/img/biz-components/', BUILD_CONFIG.build_dir + '**/img/less/'])
        .pipe(clean({ force: true }));
    }

    setTimeout(function () {
        // 标识是否完成资源拷贝
        gulp.src(BUILD_CONFIG.pkg_src_dir + '**')
            .pipe(tar('ams_mobile_app_fe.tar', { mode: null }))
            .pipe(gzip())
            .pipe(gulp.dest(BUILD_CONFIG.pkg_build_dir));
    }, 2000);

    function readFileList(rootDir) {
        let paths = [];

        if (fse.pathExistsSync(rootDir)) {
            paths = fs.readdirSync(rootDir);
        }

        return paths;
    }
}

// gulp.task('sync-ios-client', () => {
//     del.sync([path.join(__dirname, `./${iosDir}/www/**/*`)]);
//     gulp.src([path.join(__dirname, `./${androidDir}/www/**/*`)]).pipe(gulp.dest(path.join(__dirname, `./${iosDir}/www`)));
// })

gulp.task('tag', () => {
    const addZero = (value) => {
        let result = value;
        if (result < 10) {
            result = '0' + result;
        }
        return result;
    };
    const date = new Date();
    const tagName = (process.env.OPERATION || 'none') + '_' + date.getFullYear() + '_' + addZero(date.getMonth() + 1) + '_' + addZero(date.getDate()) + '_' + addZero(date.getHours()) + '_' + addZero(date.getMinutes()) + '_' + addZero(date.getSeconds());
    exec(`git tag ${tagName}`, function(stderr) {
        if (stderr) {
            if (stderr.toString().indexOf('already exists') > -1) {
                console.log(tag + ' already exists');
            } else {
                console.error(stderr);
            }
        } else {
            console.log(tagName + ' 打 tag 成功!');
            console.log(`手动执行 push tag 命令：git push origin ${tagName}`);
        }
    });
})

// 发布client
gulp.task('release', ['fileinclude', 'lessmin', 'copy:js:css', 'fileinclude-build', 'cssmin', 'md5:js', 'md5:css',]);

gulp.task('pkg', [], copyStatics);  // 打包静态文件成发布包

//开发，不默认打开open浏览器
gulp.task('dev', ['connect', 'copy:images', 'fileinclude', 'lessmin', 'build-js', 'copy:js:css', /* 'open',  */'watch']);
gulp.task('default', ['connect', 'fileinclude', 'copy:images', 'lessmin', 'build-js', 'copy:js:css', /* 'open',  */'watch']);

