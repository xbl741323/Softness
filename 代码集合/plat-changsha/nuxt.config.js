const axios = require('axios')
module.exports = {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'hfxl',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'https://static.wotao.com/assets/jsfavicon.ico' }
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js'}
    ]
  },
  router: {
    middleware: 'midd'    // 是js文件名字
  },
  //
  env: {
    PATH_TYPE: process.env.PATH_TYPE,
    baseUrl: "/service",
    // baseUrl: process.env.ENV=="prod"?"/service":(process.env.baseUrl = process.env.ENV=="tst"?'http://192.168.1.11:8381':"//192.168.1.142:8381"),//本地跑测试环境使用 不用时注释
    IMG_BASE_URL: 'images/',
    SHOP_BASE_URL: '//static.yagu.cn/',
    CDN_BASE_URL: process.env.ENV == "prod" ? "//static.wotao.com/" : "//static-tst.wotao.com/",
    PC_URL: process.env.ENV == "prod" ? "//hnxmsq.cn" : (process.env.baseUrl = process.env.ENV == "tst" ? '//hnxmsq-tst.cn' : "//localhost:3353"),
    // 生产环境
    // ASYNC_DATA_API:process.env.ENV=="prod"?"http://192.168.0.25:9999":(process.env.baseUrl = process.env.ENV=="tst"?'http://192.168.1.11:9999':"http://192.168.1.11:9999"),//asyncData api 不要修改（除非服务器地址变动）
    // 预生产环境
    ASYNC_DATA_API:process.env.ENV=="prod"?"http://pigx-gateway-svc:9999":(process.env.baseUrl = process.env.ENV=="tst"?'http://192.168.1.11:9999':"http://192.168.1.11:9999"),//asyncData api 不要修改（除非服务器地址变动）
},
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/css/main.css',
    '~/assets/css/iconfont.css',
    'element-ui/lib/theme-chalk/index.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios',
    '@/plugins/element-ui',
    { src: '@/plugins/vue-seamless-scroll', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  // components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/style-resources',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],
  robots: [
    {
      UserAgent: 'Baiduspider',
      Allow: '/',
    },
    {
      UserAgent: 'Bytespider',
      Allow: '/',
    },
    {
      UserAgent: 'Yisouspider',
      Allow: '/',
    },
    {
      UserAgent: 'Applebot',
      Allow: '/',
    },
    {
      UserAgent: 'Sogou inst spider',
      Allow: '/',
    },
    {
      UserAgent: '360Spider',
      Allow: '/',
    },
    {
      UserAgent: 'Googlebot',
      Allow: '/',
    },
    {
      UserAgent: 'PetalBot',
      Allow: '/',
    },
    {
      UserAgent: '*',
      Disallow: '/',
    },
  ],
  sitemap: {
    path:'/sitemap.xml',
    hostname:'https://www.hnxmsq.cn/',
    gzip: true,
    generate: false,
    exclude:['/404','/notice/detail','/picture-list','/notice','/graphic-list','/graphic-content','/aboutWT','/global-search'],
    xmlNs: 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    defaults: {
      changefreq: 'always',
      priority: 0.8,
      lastmod: new Date()
    },
    routes: async function () {
      var siteArray = [];
      let data = {
        isDraft: 0,
        substationId: 20
      }
      return await axios.post('https://www.hnxmsq.cn/service/hfxl/jsnavigation/listNumber', data).then(res => {
        if (res.data.code == 0) {
          let proList = res.data.data;
          let siteObject = {};
          proList.forEach(el => {
            siteObject = {
              url: 'article-list/' + el,
              lastmod: new Date(),
              priority: 0.9,
              changefred: 'always',
            }
            siteArray.push(siteObject);
          });
          return siteArray;
        } else {
          return [];
        }
      }).catch((error) => {
        console.log(error);
      })
    }
  },
  telemetry:false,
  proxy: { //开发环境使用 上传前注释
    '/service': {
      // target: 'https://wotao.com/service/',
      // target: 'https://web-test.wotao.com/service/',
      target: 'http://192.168.1.11:9999/',
      pathRewrite: {
        '^/service': '/'
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
    ssr: true,
    publicPath: process.env.ENV == 'prod' ? 'https://static.wotao.com/assets/changsha/' : '/_nuxt/',
    // publicPath: '/_nuxt/',
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
      chunk: 'CSXM.1.0.[id].[contenthash].js',
      css: 'CSXM.1.0.[id].[contenthash].css'
    }
  },
  // target: 'static'
}
