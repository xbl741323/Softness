// 节流函数（防止重复提交）
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

// 过滤时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

// 传coverUrl判断进行返回（用于订单列表和订单详情跳转到提交订单页面进行显示判断）
function checkUrl(coverUrl) {
  let urlInfo = {
    urlType: "",
    url: ""
  }
  if ((coverUrl && coverUrl.split('.')[coverUrl.split('.').length - 1] == 'mp4' ||
      coverUrl.split('.')[coverUrl.split('.').length - 1] == 'avi' ||
      coverUrl.split('.')[coverUrl.split('.').length - 1] == 'mov')) {
    urlInfo.urlType = 1
    urlInfo.url = coverUrl
  } else {
    urlInfo.urlType = 0
    urlInfo.url = coverUrl
  }
  return urlInfo;
}

// 判断权限赋值
function filterPermissons(arr) {
  if (wx.getStorageSync('userInfo')) {
    let permissons = wx.getStorageSync('userInfo').authorities
    arr.forEach(item => {
      if (item.permisson.label != '') {
        let r = permissons.filter(cItem => {
          return cItem.authority == item.permisson.label
        })
        item.permisson.value = r.length > 0 ? true : false
      }
    })
  }
  return arr.filter(item=>item.permisson.value)
}

function message(title) {
  return wx.showToast({
    icon: "none",
    title: title,
    duration: 1500,
  });
};

module.exports = {
  throttle: throttle,
  formatTime: formatTime,
  checkUrl: checkUrl,
  filterPermissons: filterPermissons,
  message: message
}