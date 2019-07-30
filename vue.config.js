'use strict';

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

const env = process.env.NODE_ENV;
const isDev = 'dev' === env;
const isProd = 'prod' === env;
const isReport = 'report' === env;

const cdn = {
    css: [
        '//lib.baomitu.com/element-ui/2.11.1/theme-chalk/index.css'
    ],
    js: [
        '//lib.baomitu.com/vue/2.6.10/vue.min.js',
        '//lib.baomitu.com/vuex/3.0.1/vuex.min.js',
        '//lib.baomitu.com/axios/0.19.0/axios.min.js',
        '//lib.baomitu.com/vue-router/3.0.6/vue-router.min.js',
        '//lib.baomitu.com/element-ui/2.11.1/index.js'
    ]
};

const resolve = (dir) => {
    return path.join(__dirname, './', dir);
};

module.exports = {
    // https://www.cnblogs.com/h2zZhou/p/7614599.html
    // publicPath的“/”，改为“./”即可本地查看
    publicPath: isProd ? '/admin' : "./",
    outputDir: isProd ? 'dist/prod' : 'dist/dev',
    lintOnSave: false,
    productionSourceMap: isDev,
    configureWebpack: (config) => {
        config.output = {
            path: config.output.path,
            publicPath: config.output.publicPath,
            chunkFilename: 'js/[name].[hash:8].js',
            filename: 'js/[name].[hash:8].js'
        };

        config.externals = {
            'vue': 'Vue',
            'vuex': 'Vuex',
            'axios': 'axios',
            'element-ui': 'ELEMENT',
            'vue-router': 'VueRouter'
        };

        console.error("\n   运行环境：" + env + "\n");

        let plugs = [
            new UglifyJsPlugin({
                uglifyOptions: {
                    warnings: false,
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                    },
                },
                sourceMap: false,
                parallel: true,
            }),

            new OptimizeCssPlugin()
        ];

        if (isReport) {
            plugs.push(
                new BundleAnalyzerPlugin({
                    analyzerPort: 1234
                })
            )
        }

        return {
            plugins: plugs
        };
    },
    chainWebpack: (config) => {
        config.plugins.delete('prefetch');
        config.plugins.delete('preload');
        config.plugins.delete('named-chunks');

        config.resolve.symlinks(true);

        config.plugin('html').tap(args => {
            args[0].chunksSortMode = 'none';

            args[0].cdn = cdn;

            args[0].minify = {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: false,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            };

            return args;
        });

        config.optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    name: 'chunk-vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial',
                },
                commons: {
                    name: 'chunk-commons',
                    test: resolve('src/components'),
                    minChunks: 3,
                    priority: 5,
                    reuseExistingChunk: true,
                },
            },
        });

        config.optimization.runtimeChunk('single');
    },
    css: {
        // 是否使用css分离插件
        // ExtractTextPlugin
        extract: false,
        modules: false,
        sourceMap: isDev,
        loaderOptions: {}
    },
    devServer: {
        open: true,
        hot: true,
        hotOnly: false,
        compress: true
    }
};