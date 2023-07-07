const statusList=[
    {value:null, label:'全部',orderStatus:''},
    {value:0, label:'待付款',orderStatus: 0},
    {value:1, label:'已完成',orderStatus: 1},
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
    return type == 1 ? '项目申报' : type == 2 ? '知识产权' : type == 3 ? '专利' : type == 4 ? '版权' : type == 5 ? '商标' : type == 6 ? '其他' : type == 7 ? '工商注册' : type == 8 ? '财税服务' : type == 9 ? '融资上市' : type == 10 ? '法律服务' : type == 11 ? '软件开发' : '';
}

export function productType(type){
    return type == 1 ? '知识产权' : '项目申报';
}

export function costType(type){
    return type == 1 ? '代理费' : type == 2 ? '第三方费用' : type == 3 ? '官费' : '待定';
}

export function payType(type){
    return type == 1 ? '定金' : type == 2 ? '尾款' : '一口价';
}

export function orderStatus(val){
    return val == 0 ? '待付款' : val == 1 ? '已完成' : val == 2 ? '已取消' : val == 3 ? '已删除' : '';
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
    payType,
    throttle,
    costType,
    refundStatus
}