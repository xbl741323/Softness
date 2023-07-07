const app = getApp();
function copyTap(e) {
  wx.setClipboardData({
    data: e,
    success: function (res) {
      wx.getClipboardData({
        success: function (res) {
          wx.showToast({
            title: '复制成功'
          })
        }
      })
    }
  })
}
 // 按条件拆分数组
 function splitList(list,val) {
  const map = new Map()
  list.forEach((item, index, arr) => {
    if (!map.has(item.payTypeId)) {
      map.set( item[val], arr.filter(a => a[val] == item[val]));
    }
  })
  return Array.from(map).map(item => [...item[1]])
}
// 数组去重
function uniqueArr(arr,val) {  
  const res = new Map();
  return arr.filter(item => !res.has(item[val]) && res.set(item[val], 1))
}
//两个条件查重
function doubleUniqueArr(arr,f,s) {
  // 缓存用于记录
  const cache = [];
  for (const t of arr) {
      // 检查缓存中是否已经存在
      if (cache.find(c => c[f] === t[f] && c[s] === t[s])) {
          // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
          continue;
      }
      // 不存在就说明以前没遇到过，把它记录下来
      cache.push(t);
  }

  // 记录结果就是过滤后的结果
  return cache;
}
module.exports = {
  copyTap: copyTap,
  uniqueArr: uniqueArr,
  splitList: splitList,
  doubleUniqueArr: doubleUniqueArr
}