const app = getApp();
Page({

  data: {
    url: '',
  },
  previewUrl(){
    console.log();
    wx.hideLoading({
      success: (res) => {},
    })
    this.setData({
      url: wx.getStorageSync('previewContractUrl') //decodeURIComponent(newUrl),
    })
  },
  /** 初始打开实名认证页面 */
  onLoad(options) {
    console.log(options,'webview-options');
    let from = options.root;
    if(from =='preview') return this.previewUrl();    
    console.log('---wevbiew onload', wx.getStorageSync('reloadUrl'))
    let url =  wx.getStorageSync('reloadUrl');
    let cuts = url.indexOf('.com')
    // 判断页面来源更换请求头
    let fddheadUrl = from == 'user'?app.globalData.approveUrl:app.globalData.signUrl
    let newUrl = fddheadUrl + url.slice(cuts + 4);
    console.log(newUrl,'--------------------------');
    this.setData({
      url: decodeURIComponent(newUrl),
    })
  },

  /** 刷脸完成后重新加载实名认证页面 */
  reloadPage(url) {
    console.log('---webview reloadPage', url)
    this.setData({
      url,
    })
  },
})
