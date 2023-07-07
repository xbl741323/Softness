module.exports = {
    telemetry: false,
    /* 页面跳转后回到顶部 */
    router: {
        scrollBehavior(to, from, savedPosition) {
            return { x: 0, y: 0 }
        },
        middleware: ['i18n', 'midd', 'storeCache'],
    },

    mode: 'universal',
    /*
     ** Headers of the page
     */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            // { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: 'https://static.wotao.com/assets/favicon.ico' },
            // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto' }
        ],
    },
    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#fff' },
    /*
     ** Global CSS
     */
    css: [
        '~/css/main.css',
        '~/assets/css/iconfont.css',
        'element-ui/lib/theme-chalk/index.css',
    ],
    env: {
        PATH_TYPE: process.env.PATH_TYPE,
        baseUrl: "/service",
        // baseUrl: process.env.ENV=="prod"?"/service":(process.env.baseUrl = process.env.ENV=="tst"?'http://192.168.1.11:8381':"http://192.168.1.142:8381"),//本地跑测试环境使用 不用时注释
        IMG_BASE_URL: 'images/',
        SHOP_BASE_URL: '//static.yagu.cn/',
        CDN_BASE_URL: process.env.ENV == "prod" ? "//static.wotao.com/" : "//static-tst.wotao.com/",
        // 生产环境
        PC_URL: process.env.ENV == "prod" ? "https://www.wotao.com" : (process.env.baseUrl = process.env.ENV == "tst" ? 'http://web-test.wotao.com' : "//localhost:3333"),
        MOBILE_URL: process.env.ENV == "prod" ? "https://m.wotao.com" : (process.env.baseUrl = process.env.ENV == "tst" ? 'https://web-mobile.wotao.com' : "http://localhost:3336"),
        ASYNC_DATA_API: process.env.ENV == "prod" ? "http://wotao-plat-svc:8381" : (process.env.baseUrl = process.env.ENV == "tst" ? 'http://192.168.1.11:8381' : "http://192.168.1.11:8381"), //asyncData api 不要改
        PROPERTY_URL: process.env.ENV == "prod" ? "//enfan.wotao.com" : (process.env.baseUrl = process.env.ENV == "tst" ? '//enfan-tst.wotao.com' : "//localhost:3335"), //知识产权导航栏跳转地址
        SHOP_URL: process.env.ENV == "prod" ? "//shop.wotao.com" : (process.env.baseUrl = process.env.ENV == "tst" ? '//shop-test.wotao.com' : "//localhost:3338"), //技术成果导航栏跳转地址
        SHOP_DATA_API: process.env.ENV == "prod" ? "/serviceyg" : (process.env.baseUrl = process.env.ENV == "tst" ? 'https://api-tst.yagu.cn' : "https://api-dev.yagu.cn"), 
        SOFTWARE_URL: process.env.ENV == "prod" ? "//xunlu.wotao.com" : (process.env.baseUrl = process.env.ENV == "tst" ? '//xunlu-test.wotao.com' : "//localhost:3340"), //软件开发跳转地址
        ENFAN_URL: process.env.ENV == "prod"? "//enfan.wotao.com" : (process.env.baseUrl = process.env.ENV == "tst" ? '//enfan-tst.wotao.com' : "//localhost:3343"), 
        // 预生产环境
        // PC_URL: process.env.ENV == "prod" ? "https://plat-tst.wotao.com" : (process.env.baseUrl = process.env.ENV == "tst" ? 'http://web-test.wotao.com' : "//localhost:3333"),
        // MOBILE_URL: process.env.ENV == "prod" ? "https://palt-tst-mobile.wotao.com" : (process.env.baseUrl = process.env.ENV == "tst" ? 'https://web-mobile.wotao.com' : "http://localhost:3336"),
        // ASYNC_DATA_API: process.env.ENV == "prod" ? "http://wotao-plat-svc:8381" : (process.env.baseUrl = process.env.ENV == "tst" ? 'http://192.168.1.11:8381' : "http://192.168.1.11:8381"), //asyncData api 不要改
        // PROPERTY_URL: process.env.ENV == "prod" ? "//wotao-plat-enfan.wotao.com" : (process.env.baseUrl = process.env.ENV == "tst" ? '//enfan-tst.wotao.com' : "//localhost:3335"), //知识产权导航栏跳转地址
        // SHOP_URL: process.env.ENV == "prod" ? "//wotao-plat-shop.wotao.com" : (process.env.baseUrl = process.env.ENV == "tst" ? '//shop-test.wotao.com' : "//localhost:3338"), //技术成果导航栏跳转地址
        // SHOP_DATA_API: process.env.ENV == "prod" ? "/serviceyg" : (process.env.baseUrl = process.env.ENV == "tst" ? 'https://api-tst.yagu.cn' : "https://api-dev.yagu.cn"), 
        // SOFTWARE_URL: process.env.ENV == "prod" ? "//wotao-plat-xunlu.wotao.com" : (process.env.baseUrl = process.env.ENV == "tst" ? '//xunlu-test.wotao.com' : "//localhost:3340"), //软件开发跳转地址
        // ENFAN_URL: process.env.ENV == "prod"? "//wotao-plat-enfan.wotao.com" : (process.env.baseUrl = process.env.ENV == "tst" ? '//enfan-tst.wotao.com' : "//localhost:3343"), 
    },
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        '@/plugins/axios',
        '@/plugins/element-ui',
        '@/plugins/i18n.js',
        { src: '@/plugins/swiper', ssr: false, mode: "client" },
        { src: '@/assets/js/iconfont.js', ssr: false, mode: "client" },
        { src: '@/plugins/lodash.js', ssr: false, mode: "client" },
    ],
    styleResources: {
        stylus: './assets/css/common.styl',
    },
    generate: {
        routes: ['/'],
    },
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [
        // Doc: https://github.com/nuxt-community/eslint-module
        // '@nuxtjs/eslint-module'
    ],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/proxy',
        '@nuxtjs/style-resources',
        'cookie-universal-nuxt'
    ],
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {
        withCredentials: true, 
    },
    proxy: { //开发环境使用 上传前注释
        '/service': {
            // target: 'https://wotao.com/service',
            // target: 'https://web-test.wotao.com/service/',
            target: 'http://192.168.1.176:8381/',
            pathRewrite: {
                '^/service': '/',
            }
        },
    },
    /*
     ** Build configuration
     */
    build: {
        transpile: [/^element-ui/],
        vendor: ['vue-i18n','vue-pdf'],
        publicPath: process.env.ENV == 'prod' ? 'https://static.wotao.com/assets/plat/' : '/_nuxt/',
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {
            config.output.globalObject = 'this'
            // config.module.rules.push({
            //     test: /\.pdf$/,
            //     loader: 'url-loader'
            // })
        },
        extractCSS: {
            ignoreOrder: true
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.(css|vue)$/,
                    chunks: 'all',
                    enforce: true
                }
                }
            }
        },
        filenames: {
            chunk: 'WT.1.0.[id].[contenthash].js',
            css: 'WT.1.0.[id].[contenthash].css'
        }
    },
    // telemetry:false
    // target: 'static'
}