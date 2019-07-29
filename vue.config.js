'use strict';

const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

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
    // 不使用eslint，设为false即可
    lintOnSave: false,
    // 生产环境是否生成sourceMap文件
    productionSourceMap: isDev,
    configureWebpack: config => {
        config.output = {
            path: config.output.path,
            publicPath: config.output.publicPath,
            chunkFilename: 'js/[name].[hash:8].js',
            filename: 'js/[name].[hash:8].js'
        };

        console.error("\n   运行环境：" + env + "\n");

        if (isProd) {
            config.externals =  {
                'vue': 'Vue',
                'vuex': 'Vuex',
                'axios': 'axios',
                'vue-router': 'VueRouter',
                'element-ui': 'ELEMENT',
            };

            config.plugins.push(
                new ParallelUglifyPlugin({
                    cacheDir: '.cache/',
                    uglifyJS:{
                        output: {
                            comments: false
                        },
                        compress: {
                            drop_debugger: true,
                            drop_console: true,
                        }
                    }
                }),

                // 压缩提取出的css
                new OptimizeCssPlugin()
            )
        }
    },
    chainWebpack: config => {
        // 删除懒加载模块的 prefetch preload，降低带宽压力
        // 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
        // https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
        // https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
        config.plugins
            .delete('prefetch')
            .delete('preload');

        // 解决cli3热更新失效
        // https://github.com/vuejs/vue-cli/issues/1559
        config.resolve.symlinks(true);

        config.plugin('html').tap(args => {
            // 修复Lazy loading routes Error： Cyclic dependency
            // https://github.com/vuejs/vue-cli/issues/1669
            args[0].chunksSortMode = 'none';

            if (isProd) {
                // 添加cdn参数，详见public/index.html修改
                args[0].cdn = cdn;
            }

            return args;
        });

        if (isProd) {
            config.module.rule('images')
                .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
                .use('img-loader')
                .loader('img-loader').options({
                plugins: [
                    require('imagemin-jpegtran')(),
                    require('imagemin-pngquant')({
                        quality: [0.75, 0.85]
                    })
                ]
            })
        }
    },
    css: {
        // 是否使用css分离插件 ExtractTextPlugin，采用独立样式文件载入
        // 不采用<css>方式内联至html文件中
        extract: true,
        // 是否在构建样式地图，false将提高构建速度
        sourceMap: isDev,
        // 启用CSS modules
        modules: false,
        // css预设器配置项
        loaderOptions: {
            css: {
                localIdentName: '[name].[hash:8]',
                camelCase: 'only'
            }
        }
    },
    devServer: {
        // 自动打开浏览器
        open: true,
        // 服务器热加载
        hot: true,
        hotOnly: false,
        compress: true
    }
};