import { getArea } from "~/api/common-service"

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
    if((val/1).toString().length<=5){
        return (val)
    }else{
        return (((val/1)/10000)+'万')
    }
}
//产品类型
function filterProjectType (val){
    return val==1?'项目申报':val==7?'工商注册':val==8?'财税服务':val==9?'融资上市':val==10?'法律服务':val==11?'软件开发':'知识产权'
}
var arrList = []
function getAreas(){
    return new Promise((resolve,reject) => {
        getArea(4).then(res => {
            resolve(res.data.data.area)
        }).catch(error =>{
            reject(error)
        })
    })
}
// 筛选地区
async function filterArea(val) {
    if (val) {
      let area = await getAreas();
      let list = val
      list.forEach(pItem => {
        area.forEach(cItem => {
          if (filterLoop(cItem, pItem)) {
            filterLoop(cItem, pItem)
          }
        })
      })
      return arrList.join(' ')
    } else {
      return "暂无数据"
    }
  }
  
  // 循环筛选
  function filterLoop(item, val) {
    if (item.value !== 0 && item.value == val) {
        arrList.push(item.label)
    } else if (item.children != null && item.children.length > 0) {
        item.children.forEach(cItem => {
            return filterLoop(cItem, val)
        })
    }
  }
export default {
    filterOnePrice,
    filterdepositPrice,
    filterfinalPrice,
    filterProjectType,
    filterViewprice,
    filterArea
}