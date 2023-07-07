const statusList=[
    {value:0, label:'全部',orderStatus:null},
    {value:1, label:'待付款',orderStatus:0},
    {value:4, label:'待签约',orderStatus:1},
    {value:2, label:'服务中',orderStatus:3},
    {value:3, label:'退款/售后',orderStatus:99},
]

const titleList= [
    {value: 0, label: '产品'},
    {value: 1, label: '单价'},
    {value: 2, label: '数量'},
    {value: 3, label: '金额'},
    {value: 4, label: '状态'},
    {value: 5, label: '操作'},
]

export function orderType(type){
    return type == 0 ? '知识产权' : '项目申报';
}

export function productType(type){
    return type == 1 ? '知识产权' : '项目申报';
}

export function amountType(type){
    return type == 0 ? '代理费' : type == 1 ? '第三方费用' : '官费';
}

export function orderStatus(val){//0，2服务中
    return val == 0 ? '待付款' : val == 1 ? '待签约' : val == 2 ? '待开始' : val == 3 ? '进行中' : val == 4 ? '已完成' : val == 5 ? '已关闭' : val == 6 ? '已取消' : val == 7 ? '已取消' : val == 8 ? '已删除' : val == 9 ? '待签约' : '';
}
export function payTxt(val){
    return val == 6 ? '应付款' : val == 2 ? '应付尾款' : val == 4 ? '已付' : '已付';
}
function refundStatus(val){
    return val ==0 ?'退款中':val==1?'退款完成':val==2?'退款拒绝':val==5?'退款关闭':''
}
let lastTime = 0
export function throttle(intervalTime){
    //获取当前时间的时间戳
    let now = new Date().valueOf();
    if(lastTime == 0 || (now-lastTime) > intervalTime){
    //重置上一次点击时间，intervalTime是设置的间隔时间，根据自己的需要传参
       lastTime = now;
       if(lastTime != 0){
            setTimeout(()=>{
                lastTime = 0
            },3000);
       }
       return true;
       //添加自己要调用的方法
    }else{
       return false;
    };
}

export default{
    statusList,
    titleList,
    orderType,
    payTxt,
    orderStatus,
    productType,
    throttle,
    amountType,
    refundStatus
}