'use strict';

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const env = process.env.NODE_ENV;
const isDev = 'dev' === env;
const isProd = 'prod' === env;

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
            'vue-router': 'VueRouter',
            'element-ui': 'ELEMENT',
        };

        console.error("\n   运行环境：" + env + "\n");

        if (isProd) {
            return {
                plugins: [
                    new UglifyJsPlugin({
                        uglifyOptions: {
                            compress: {
                                drop_console: true,
                                drop_debugger: true,
                            },
                        },
                        sourceMap: false,
                        parallel: true,
                    }),

                    new OptimizeCssPlugin(),

                    new BundleAnalyzerPlugin()
                ]
            };
        }
    },
    chainWebpack: (config) => {
        config.plugins.delete('prefetch');
        config.plugins.delete('preload');

        config.resolve.symlinks(true);

        config.plugin('html').tap(args => {
            args[0].chunksSortMode = 'none';

            args[0].minify = false;

            args[0].cdn = cdn;

            return args;
        });
    },
    css: {
        // 是否使用css分离插件
        // ExtractTextPlugin
        extract: false,
        sourceMap: isDev,
        modules: false,
        loaderOptions: {
            css: {
                localIdentName: '[name].[hash:8]',
                camelCase: 'only'
            }
        }
    },
    devServer: {
        open: true,
        hot: true,
        hotOnly: false,
        compress: true
    }
};