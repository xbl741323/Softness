const routeIntercept = ['/member','/member/collect'];//需要登录的路由

export default ({app,store})=>{
    if(process.client){
        store.dispatch('getUserInfo').then(res=>{
            if(res.code == 10002){
                //清除用户信息
                store.state.userInfo = {};
                localStorage.removeItem('userInfo');
            }else{
                store.state.userInfo = res.data;//刷新用户信息
                localStorage.setItem('userInfo', JSON.stringify(res.data));
            };
        })
        app.router.beforeEach((to, from, next)=>{
            if(!localStorage.getItem('userInfo')){//未登录
                if(routeIntercept.indexOf(to.path) > -1){
                    next('/login');
                }else{
                    next();
                }
            }else{//已登陆
                next();
            }
        })
    }
}