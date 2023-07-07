export default function ({res, req, route, redirect, error }) {
  if (req) {
    let userAgent = req.headers['user-agent'].toLowerCase();
    let agentId = userAgent.match(/(iphone|ipod|ipad|android)/);//移动端
    // let isWeixin = userAgent.match(/micromessenger/);//微信浏览器
    if (agentId) {
      // if(route.query.link){
      //   if (route.path != '/midd') {//跳转到过渡页面
      //     if (route.name == 'index-policy-trouble-troubleDetails') {
      //       redirect({ path: process.env.PC_URL + '/midd', query: { id: route.path, No: route.params.troubleDetails,link:route.query.link } });
      //     } else if (route.name == 'index-policy-troubleshooting') {
      //       redirect({ path: process.env.PC_URL + '/midd', query: { id: route.path,link:route.query.link} });
      //     } else if (route.name == 'index-aboutWt-aboutWt') {//关于卧涛不跳转
  
      //     } else if (route.name == 'index-common-service-detail') {//新产品详情不跳转
            
      //     } else {
      //       redirect({ path: process.env.PC_URL + '/midd', query: { id: route.path,link:route.query.link} });
      //     }
      //   } else {
  
      //   }
      // }else{
        console.log('------------------');
        console.log(route.path);
        if (route.path != '/midd') {//跳转到过渡页面
          // if (route.name == 'index-policy-trouble-troubleDetails') {
          //   redirect({ path: process.env.PC_URL + '/midd', query: { id: route.path, No: route.params.troubleDetails } });
          // } else if (route.name == 'index-policy-troubleshooting') {
          //   redirect({ path: process.env.PC_URL + '/midd', query: { id: route.path } });
          // } else if (route.name == 'index-aboutWt-aboutWt') {//关于卧涛不跳转
  
          // } else if (route.name == 'index-common-service-detail') {//新产品详情不跳转
            
          // } else {
          //   redirect({ path: process.env.PC_URL + '/midd', query: { id: route.path } });
          // }

          /* 首页、政策页面跳转其他页面不跳转 */
          
        //   if (route.name == 'index-policy-trouble-troubleDetails') {
        //     console.log('%%%%%%%%%%%%%%%%%%%%');
        //     console.log(route.path);
        //     // redirect({ path: '/midd', query: { id: route.path, No: route.params.troubleDetails } });
        //     redirect(process.env.MOBILE_URL+'id='+route.path+'/policy/'+route.params.troubleDetails+2);
        //   } else if (route.name == 'index-policy-troubleshooting') {
        //     console.log('$$$$$$$$$$$$$$$$$$$$');
        //     console.log(route.path);
        //     // redirect({ path: '/midd', query: { id: route.path } });
        //     redirect(process.env.MOBILE_URL+'/policy/troubleList');
        //   }else 
          if(route.path == '/'){
        //   if(route.path == '/' || route.name == 'index-policy-policyDetails'){
            console.log('=====================');
            redirect(process.env.MOBILE_URL+route.path)
            // redirect({ path:'/midd', query: { id: route.path } });
          }else{
            console.log('+++++++++++++++++');
            console.log(route.fullPath);

          }
        } else {
          console.log('*******************');
          console.log(route.path);
        };
      // }
    }
  }
}