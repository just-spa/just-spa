const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

const proxyDevServer = "127.0.0.1";

// 构建目录配置
const BUILD_CONFIG = {
    dev_dir: "dev/www/", //构建后生成的根目录,不要带目录'/'符号
    dev_server_root: "dev/",
    build_dir: "build/",
    pkg_src_dir: "build/", // 打包源目录
    pkg_build_dir: "./pkg", // 打包输出目录
    src_dir: "./src", // 构建源目录,不要带目录'/'符号
    html_dir: "www/", // html目录名称，src和page相同
    entry_js_dir: "src/entry", // 页面的入口文件
    html_domain: "",
    css_domain: "",
    js_domian: "",
};

// 获取页面的每个入口文件，用于配置中的entry
function getEntry() {
    const jsDir = BUILD_CONFIG.entry_js_dir;
    const dirs = fs.readdirSync(path.resolve(process.cwd(), jsDir));
    let matchs = [],
        files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.jsx?$/);
        // 如果_getImportsScriptList获取到的文件已经含有，则跳过不覆盖解析
        if (matchs && !files[matchs[1]]) {
            files[matchs[1]] = path.resolve(jsDir, item);
        }
    });
    return files;
}

module.exports = {
    cache: true,
    entry: getEntry(),
    mode: "development",
    output: {
        path: path.join(__dirname, BUILD_CONFIG.dev_dir + "/js"),
        publicPath: "/js/",
        filename: "[name].js",
    },
    externals: {
        react: "React",
        "react-dom": "ReactDOM",
        redux: "Redux",
        "react-redux": "ReactRedux",
        moment: "moment",
        axios: "axios",
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".less", ".scss", ".css"],
    },
    module: {
        // babel loader配置
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.ts[x]?$/,
                exclude: /node_modules/,
                loader: "awesome-typescript-loader",
            },
            {
                test: /\.(less|css)$/,
                use: [
                    "style-loader",
                    "css-loader?javascriptEnabled=true",
                    "less-loader?javascriptEnabled=true",
                ],
            },
            {
                test: /\.(png|jpg|gif|md)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[md5:hash:8].[ext]",
                            outputPath: "../img/", // where the fonts will go
                            publicPath: "./img/", // override the default path
                        },
                    },
                ],
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: ["url-loader?limit=10000&mimetype=image/svg+xml"],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)\??.*$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[md5:hash:8].[ext]",
                            outputPath: "../fonts/", // where the fonts will go
                            publicPath: "./fonts/", // override the default path
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            BUILD_CONFIG: BUILD_CONFIG,
            proxyDevServer,
        }),
        // 定义process.env.NODE_ENV
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production"),
            mode: "production",
        }),
    ],

    optimization: {
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                common: {
                    name: "common",
                    chunks: "initial",
                    minChunks: 2,
                },
            },
        },
    },
};
