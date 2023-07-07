// import axios from "axios";
// const sitemap = {
//   path: '/sitemap.xml', //生成的文件路径
//   hostname: 'https://www.ruanjiankf.cn/', //网站的网址
//   cacheTime: 1000 * 60 * 60 * 24, //一天的更新频率，只在generate:false有用
//   gzip: true, //生成.xml.gz的sitemap
//   generate: false,
//   exclude: ['/404'], //排除不要的页面，这里的路径是相对于hostname
//   defaults: {
//     changefred: 'always',
//     lastmod: new Date()
//   },
//   routes: ()=> {
//     axios.get('https://ruanjiankf.cn/service/hfxl/jsnavigation/getListByColumnId?columnId=7&start=1&size=-1&substationId=20').then(res=>{
//       let proList = res.data.data.list.list;
//       var siteArray = [];
//       let siteObject = {};
//       proList.forEach( el => {
//         siteObject = {
//           url: 'https://www.ruanjiankf.cn/article-list/'+el.number,
//           changefred: 'daily',
//           lastmod: new Date()
//         }
//         siteArray.push(siteObject);
//       });
//     })
//     return siteArray;
//   },

//   //   需要生成的xml数据，return 返回需要给出的xml数据
//   // routes:()=>{
//   //     const routes = [{
//   //         url:"/",
//   //         changefred:'always',
//   //         lastmod:new Date()
//   //     }]
//   //     return routes
//   // }

// }
// export default sitemap;

