export default function ({ req,route,redirect}) {
    if(req){
        var userAgent = req.headers['user-agent'].toLowerCase();
        var agentId = userAgent.match(/(iphone|ipod|ipad|android)/);
        if(!agentId){
            if(route.path == '/policy/troubleList'){ //卧涛问答pc移动端文件结构不同 暂时特殊处理
                redirect(process.env.PC_URL + '/policy/troubleshooting')
            }else if(route.params.policyDetails){
                console.log(route.fullPath);
                if(route.params.policyDetails.substr(route.params.policyDetails.length-1,1) == 2){
                    redirect(process.env.PC_URL + '/policy/trouble/'+route.params.policyDetails.substr(0,route.params.policyDetails.length-1))
                }else{
                    console.log('===============');
                    console.log(process.env.PC_URL+route.fullPath);
                    redirect(process.env.PC_URL+route.fullPath);//跳转到PC
                }
            }else if(route.path == '/zhichan' || route.name == 'zhichan-detail'){//知产首页跳转
                let path = route.path.substr(8,route.path.length);
                redirect(process.env.PROPERTY_URL+path);
            }else if((route.path).indexOf("/result") != -1 || (route.path).indexOf("/need") != -1){
                redirect(process.env.SHOP_URL+route.fullPath);
            }else if(route.path  == '/' || route.name == 'policy-policyDetails'){
                console.log('------------');
                console.log(process.env.PC_URL+route.fullPath);
                redirect(process.env.PC_URL+route.fullPath);//跳转到PC
            }else{

            }
        }
        if(agentId){
            if(route.path == '/wx-open/pay' || route.path  == '/fdd' || route.path  == '/search' || route.path  == '/' || route.path  == '/productdetails/details' || route.path  == '/member' || route.path == '/classification' ) return;
            // if(route.path == '/wx-open/pay' || route.path  == '/fdd' || route.path  == '/' || route.name.match('policy') || route.path == '/classification' ) return;
			console.log('++++++++++++++++');
            console.log(process.env.PC_URL+route.fullPath);
            // redirect(process.env.PC_URL+route.fullPath)
        }
    }
}