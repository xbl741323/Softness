//一口价
function filterOnePrice (val){
    return ((val.dueTypeAgencyFee?val.dueTypeAgencyFee:0) +  (val.dueTypeThirdPartyFee?val.dueTypeThirdPartyFee:0))
}

//定金
function filterdepositPrice (val) {
    return ((val.depositTypeAgencyFee?val.depositTypeAgencyFee:0) +  (val.depositTypeThirdPartyFee?val.depositTypeThirdPartyFee:0))
}
//尾款
function filterfinalPrice (val) {
    if((val.finalTypeAgencyFee?val.finalTypeAgencyFee:0 + val.finalTypeThirdPartyFee?val.finalTypeThirdPartyFee:0)==0){
        return '待定'
    }else{
        return ((val.finalTypeAgencyFee?val.finalTypeAgencyFee:0) + (val.finalTypeThirdPartyFee?val.finalTypeThirdPartyFee:0))
    }
}
//价格显示
function filterViewprice (val){
    if(String(val).length<=5){
        return val
    }else{
        return ((val/10000)+'万')
    }
}
//产品类型
function filterProjectType (val){
    return val==1?'项目申报':val==7?'工商注册':val==8?'财税服务':val==9?'融资上市':val==10?'法律服务':val==11?'软件开发':'知识产权'
}
export default {
    filterOnePrice,
    filterdepositPrice,
    filterfinalPrice,
    filterProjectType,
    filterViewprice
}