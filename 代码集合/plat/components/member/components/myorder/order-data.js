const statusList=[
    {value:null, label:'全部',orderStatus:'',img:require('@/assets/images/person/quanbudingdan@2x.png')},
    {value:1, label:'待签约',orderStatus:1,img:require('@/assets/images/person/icon_To sign up@2x.png')},
    {value:0, label:'待付款',orderStatus:0,img:require('@/assets/images/person/daifukuan@2x.png')},
    {value:3, label:'服务中',orderStatus:3,img:require('@/assets/images/person/fuwuzhong@2x.png')},
    {value:99, label:'退款/售后',orderStatus:99,img:require('@/assets/images/person/tuikuanshouhou@2x.png')},
]

const titleList= [
    {value: 0, label: '订单信息'},
    {value: 1, label: '单价'},
    {value: 2, label: '数量'},
    {value: 3, label: '金额'},
    {value: 4, label: '状态'},
    {value: 5, label: '操作'},
]

const refundaftersales = [
    {value: 0, label: '订单信息'},
    {value: 1, label: '费用类型'},
    {value: 2, label: '数量'},
    {value: 3, label: '退款金额'},
    {value: 4, label: '退款状态'},
    {value: 5, label: '操作'}
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

export function policyFeeType(type){
    return type == 0 ? '定金' : type == 1 ? '尾款' : '官费';
}

export function orderStatus(val){
    return val == 0 ? '待付款' : val == 1 ? '待签约' : val == 2 ? '服务中' : val == 3 ? '服务中' : val ==4 ? '已完成' : val == 5 ? '交易关闭' : val == 6 ? '已取消' : '';
 }


 function refundStatus(val){
    switch (val) {
        case 1:
        case 2: 
        case 3:
            return '退款中'

        case -2:
            return '退款拒绝'

        case -1:
            return '退款关闭'

        case 4:
            return '退款完成'
    
        default:
            break;
    }
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
       console.log('不触发');
       return false;
    };
}


export default{
    statusList,
    titleList,
    refundaftersales,
    orderType,
    orderStatus,
    productType,
    policyFeeType,
    throttle,
    amountType,
    refundStatus
}