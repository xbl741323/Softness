import * as WeChat from "react-native-wechat-lib";
module.exports = {

  //微信授权登录
  WeChatLogin(APP_ID, APP_SECRET, successCallback, errorCallback) {
    console.log('APP_ID===', APP_ID)
    WeChat.sendAuthRequest('snsapi_userinfo').then((data) => {
      // console.log('用户微信信息===', data)
      // this.getAccessToken(APP_ID, APP_SECRET, data, successCallback, errorCallback);
      successCallback(data)
    }).catch((err) => {
      // console.log('授权失败', err);
      errorCallback(err)
    })
  },


  // 获取 access_token
  getAccessToken(APP_ID, APP_SECRET, data, successCallback, errorCallback) {
    var AccessTokenUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + APP_ID + '&secret=' + APP_SECRET + '&code=' + data.code + '&grant_type=authorization_code';
    // console.log('AccessTokenUrl=',AccessTokenUrl);
    this.WeChatGet(AccessTokenUrl, data, (datas) => {
      this.getRefreshToken(APP_ID, datas.refresh_token, data, successCallback, errorCallback);
    }, (err) => {
      errorCallback(err)
    })
  },


  // 获取 refresh_token
  getRefreshToken(APP_ID, refresh_token, data, successCallback, errorCallback) {
    let getRefreshTokenUrl = 'https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=' + APP_ID + '&grant_type=refresh_token&refresh_token=' + refresh_token;
    this.WeChatGet(getRefreshTokenUrl, data, (datas) => {
      this.getUserInfo(datas, data, successCallback, errorCallback);
    }, (err) => {
      errorCallback(err)
    })
  },

  //获取用户信息
  getUserInfo(responseData, data, successCallback, errorCallback) {
    var getUserInfoUrl = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + responseData.access_token + '&openid=' + responseData.openid;
    this.WeChatGet(getUserInfoUrl, data, (datas) => {
      successCallback(datas)
    }, (err) => {
      errorCallback(err)
    })
  },

  WeChatGet(url, data, successCallback, errorCallback) {
    fetch(url, {
      method: 'GET',
      timeout: 2000,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((response) => response.json()).then((responseData) => {
      responseData.codeInfo = data
      successCallback(responseData)
    }).catch((error) => {
      if (error) {
        errorCallback(error)
      }
    })
  },
}