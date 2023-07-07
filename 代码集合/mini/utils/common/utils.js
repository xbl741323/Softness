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

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
// 定位名称过滤
function setProvince(province) {
  let reg = /^市|特别行政区|自治区|省$/
  if (reg.test(province)) {
    return province.substr(0, 2)
  }
}

// 定位名称过滤
function setCity(city) {
  if (city.indexOf('市')!=-1) {
    return city.slice(0, city.indexOf('市'))
  }else{
    return city
  }
}

// 监听页面滑动
function getScroll(e) {
  var pages = getCurrentPages();
  var currPage = pages[pages.length - 1]; //获取当前页面this 对象
  if (e.scrollTop > 0) {
    currPage.setData({
      showTop: true
    })
  } else {
    currPage.setData({
      showTop: false
    })
  }
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

function loadBox(title,step){
  if(step) return wx.showLoading({
    title: title,
  })
  if(!step) return wx.hideLoading({
    // success: (res) => {},
  })
}

// 传coverUrl和coverUrls判断进行返回
function filterUrl(coverUrl, coverUrls) {
  let urlInfo = {
    urlType: "",
    url: ""
  }
  // urlType 0-图片格式 1-视频格式
  if (coverUrl !== '' && coverUrl !== null) {
    urlInfo.urlType = 0
    urlInfo.url = coverUrl
  } else {
    coverUrls.forEach((item) => {
      if (item.isCover == 1 && item.spUrl !== "") {
        urlInfo.urlType = 0
        urlInfo.url = item.spUrl
      } else if (item.isCover == 1 && item.spUrl == "") {
        if (item.url && item.url.split('.')[item.url.split('.').length - 1] == 'jpeg' ||
          item.url.split('.')[item.url.split('.').length - 1] == 'png' ||
          item.url.split('.')[item.url.split('.').length - 1] == 'jpg' ||
          item.url.split('.')[item.url.split('.').length - 1] == 'gif') {
          urlInfo.urlType = 0
          urlInfo.url = item.url
        }
        if ((item.url && item.url.split('.')[item.url.split('.').length - 1] == 'mp4' ||
            item.url.split('.')[item.url.split('.').length - 1] == 'avi' ||
            item.url.split('.')[item.url.split('.').length - 1] == 'mov')) {
          urlInfo.urlType = 1
          urlInfo.url = item.url
        }
      }
    })
  }
  return urlInfo;
}

module.exports = {
  throttle: throttle,
  formatTime: formatTime,
  setProvince: setProvince,
  setCity: setCity,
  getScroll: getScroll,
  filterUrl: filterUrl,
  checkUrl: checkUrl,
  loadBox: loadBox
}