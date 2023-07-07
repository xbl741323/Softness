const { defer } = require("lodash")
const { resolver } = require("stylus")

module.exports = {
    mode: 'universal',
    /*
    ** Headers of the page
    */
   
    router: {
      // middleware: 'i18n',
      middleware: ['midd', 'i18n','storeCache'],
    },
    head: {
      title: process.env.npm_package_name || '',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'https://static.wotao.com/assets/favicon.ico' },
        // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto' }
      ],
      script: [      
        { src: '/js/flexible.js', type: 'text/javascript', charset: 'utf-8' },
        { src: '/js/sdk.js', type: 'text/javascript', charset: 'utf-8' },
      ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: { color: '#fff' },
    /*
    ** Global CSS
    */
    css: [
      './assets/css/main.css',
      'element-ui/lib/theme-chalk/index.css',
      './assets/css/iconfont.css',
      'swiper/dist/css/swiper.css',
    ],
    env: {
      PATH_TYPE: process.env.PATH_TYPE,
      baseUrl: "/service",
      // baseUrl: process.env.ENV=="prod"?"/service":(process.env.baseUrl = process.env.ENV=="tst"?'http://192.168.1.11:8381':"//192.168.1.11:8381"),//本地测试使用 不用时注释
      CDN_BASE_URL: process.env.ENV=="prod"?"//static.wotao.com/": "//static-tst.wotao.com/",
      YAGU_IMG_URL: "//static.yagu.cn/",
      CDN_LOCAL_URL: "/images/",
      PC_URL:process.env.ENV =="prod"?"//www.wotao.com":(process.env.baseUrl = process.env.ENV=="tst"?'//web-test.wotao.com':"//localhost:3336"),
      SHOP_URL: process.env.ENV == "prod" ? "//shop.wotao.com" : (process.env.baseUrl = process.env.ENV == "tst" ? '//shop-test.wotao.com' : "//localhost:3338"), //技术成果导航栏跳转地址
      MOBILE_URL:process.env.ENV =="prod"?"//m.wotao.com":(process.env.baseUrl = process.env.ENV=="tst"?'//web-mobile.wotao.com':"//localhost:3336"),
      // 生产环境
      // ASYNC_DATA_API:process.env.ENV=="prod"?"http://192.168.0.25:8381":(process.env.baseUrl = process.env.ENV=="tst"?'http://192.168.1.11:8381':"http://192.168.1.11:8381"),//asyncData api 不要修改（除非服务器地址变动）
      // 预生产环境
      ASYNC_DATA_API:process.env.ENV=="prod"?"http://wotao-plat-svc:8381":(process.env.baseUrl = process.env.ENV=="tst"?'http://192.168.1.11:8381':"http://192.168.1.11:8381"),//asyncData api 不要修改（除非服务器地址变动）
      PROPERTY_URL: process.env.ENV == "prod" ? "//zhichan.wotao.com" : (process.env.baseUrl = process.env.ENV == "tst" ? '//zhichan-test.wotao.com' : "//localhost:3335"), //知识产权导航栏跳转地址
    },
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
      '@/plugins/axios',
      '@/plugins/element-ui',
      '@/plugins/i18n',
      '@/plugins/vant',
      { src: '@/plugins/lodash.js', ssr: false },
      { src: '@/assets/js/iconfont.js', ssr: false },
      { src: "@/plugins/mint-ui", ssr: true },
      { src: "@/plugins/vant", ssr: true },
      { src: "@/plugins/layer", ssr: false },
      { src: "@/plugins/swiper", ssr: false },
      { src: "@/plugins/cropper", ssr: false,mode:"client"}
    ],
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
    ],
    styleResources: {
      stylus: './assets/common.styl',
    },
    /*
    ** Axios module configuration
    ** See https://axios.nuxtjs.org/options
    */
    axios: {
      withCredentials: true,
    },
    proxy: { //开发环境使用 上传前注释
      // 109郝丽丽，163朱凯，198夏木生
      '/service': {
        target: 'http://192.168.1.11:8381/',
        // target: 'https://wotao.com/service/',
        // target: 'https://web-mobile.wotao.com/service/',
        pathRewrite: {
          '^/service': ''
        }
      }
    },
    /*
    ** Build configuration
    */
    build: {
      transpile: [/^element-ui/],
      publicPath: process.env.ENV == 'prod' ?'https://static.wotao.com/assets/mobile/' : '/_nuxt/',
      /*
      ** You can extend webpack config here
      */
      extend(config, ctx) {
      },
      filenames: {
        chunk: 'WT.M.1.0.[id].[contenthash].js'
      },
      // loaders:[
      //   { test: /\.woff$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      //   { test: /\.ttf$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
      //   { test: /\.eot$/, loader: "file-loader" },
      //   { test: /\.svg$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml" }
      // ],
      // extend (config, { isDev, isClient }) {
      //   if (isDev && isClient) {
      //     config.module.rules.push({
      //       enforce: 'pre',
      //       test: /\.(js|vue)$/,
      //       loader: 'eslint-loader',
      //       exclude: /(node_modules)/
      //     })
      //   }
      // },
    },
    generate: {
      routes: ['/']
    },
    telemetry:false
    // target: 'static'
  }
  