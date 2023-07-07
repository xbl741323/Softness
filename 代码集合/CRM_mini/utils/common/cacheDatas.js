// 筛选地区
let arrList = []

// 筛选地区
function filterArea(val) {
  if (val && Number(val) !== 0) {
    let list = val.split(',')
    let area = wx.getStorageSync('areas')
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
  if (item.id !== 0 && item.value == val) {
    arrList.push(item.label)
  } else if (item.children != null && item.children.length > 0) {
    item.children.forEach(cItem => {
      return filterLoop(cItem, val)
    })
  }
}


export {
  filterArea
}