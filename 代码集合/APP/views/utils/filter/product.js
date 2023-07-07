// 分类页面价格显示判断
// 价格十万以内全显，10万以上(包含10万)，价格显示以万为单位(例如价格为112345，前台显示为11.2345万元，小数点精确到个位，最后一位为0时可以省略)
function fixClassPrice(val) {
  let fixPrice = parseInt(val * 100)
  if (fixPrice < 10000000) {
    return fixPrice / 100;
  } else {
    return (fixPrice / 1000000) + '万';
  }
}

// 获取规格属性数据
function getAttributeList(attributeList) {
  if (attributeList.length > 1) {
    // 双属性时
    let attributeArr1 = attributeList[0][Object.keys(attributeList[0])]
    let attributeArr2 = attributeList[1][Object.keys(attributeList[1])]
    return [
      attributeArr1,
      attributeArr2
    ]
  } else {
    // 单属性时
    return [attributeList[0][Object.keys(attributeList[0])]]
  }
}

// 规格属性筛选值lebel
function getAttributeLabel(AttributeList, skuIndex) {
  if (AttributeList.length > 0) {
    let arrOne = []
    let arrTwo = []
    arrOne = AttributeList[0]
    let skuIndexList = skuIndex.split('_')
    if (skuIndexList.length > 1) {
      arrTwo = AttributeList[1]
      return [arrOne[parseInt(skuIndexList[0])], arrTwo[parseInt(skuIndexList[1])]].join('+')
    } else {
      return arrOne[parseInt(skuIndexList[0])]
    }
  }
}

// 获取所有商品下标集合
function filterSkuList(attributeList, skuList) {
  if (skuList && skuList.length > 0) {
    if (attributeList.length > 1) {
      let arr1 = []
      let arr2 = []
      skuList.forEach(item => {
        arr1.push(Number(item.skuIndex.split('_')[0]))
        arr2.push(Number(item.skuIndex.split('_')[1]))
      })
      let newArr1 = [...new Set(arr1)]
      let newArr2 = [...new Set(arr2)]
      let r = [
        newArr1, newArr2
      ]
      return r
    } else {
      let arr1 = []
      skuList.forEach(item => {
        arr1.push(Number(item.skuIndex))
      })
      let newArr1 = [...new Set(arr1)]
      let r = [newArr1]
      return r
    }
  }
}

// 属性下标翻译数组 0->[0] 0_1->[0,1]
function translateSkuIndex(val) {
  if (val) {
    let r = []
    val.split('_').forEach(item => {
      r.push(Number(item))
    })
    return r
  }
}

// 一口价
function filterOnePrice(val) {
  if (val) {
    return ((val.dueTypeAgencyFee ? val.dueTypeAgencyFee : 0) + (val.dueTypeThirdPartyFee ? val.dueTypeThirdPartyFee : 0))
  }
}

// 定金
function filterdepositPrice(val) {
  if (val) {
    return ((val.depositTypeAgencyFee ? val.depositTypeAgencyFee : 0) + (val.depositTypeThirdPartyFee ? val.depositTypeThirdPartyFee : 0))
  }
}

// 尾款
function filterfinalPrice(val) {
  if (val) {
    if ((val.finalTypeAgencyFee ? val.finalTypeAgencyFee : 0 + val.finalTypeThirdPartyFee ? val.finalTypeThirdPartyFee : 0) == 0) {
      return '待定'
    } else {
      return ((val.finalTypeAgencyFee ? val.finalTypeAgencyFee : 0) + (val.finalTypeThirdPartyFee ? val.finalTypeThirdPartyFee : 0))
    }
  }
}

// 筛选地区
function filterArea(val) {
  if (val && Number(val) !== 0) {
    let list = val.split(",")
    arrList = []
    list.forEach(pItem => {
      area.forEach(cItem => {
        if (filterLoop(cItem, pItem)) {
          filterLoop(cItem, pItem)
        }
      })
    })
    return arrList.join(',')
  } else {
    return "暂无数据"
  }
}

// 循环筛选
function filterLoop(item, val) {
  if (item.id !== 0 && item.id == val) {
    arrList.push(item.areaName)
  } else if (item.children != null && item.children.length > 0) {
    item.children.forEach(cItem => {
      return filterLoop(cItem, val)
    })
  }
}

export {
  fixClassPrice,
  getAttributeList,
  getAttributeLabel,
  filterSkuList,
  translateSkuIndex,
  filterOnePrice,
  filterdepositPrice,
  filterfinalPrice,
  filterArea,
}