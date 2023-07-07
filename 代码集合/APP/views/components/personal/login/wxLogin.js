import React, { useState, useEffect, useRef } from 'react'
import { Platform, StyleSheet, Text, View, Dimensions, Image, TextInput, TouchableWithoutFeedback, SafeAreaView, ScrollView } from 'react-native'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import * as CodeMsg from "../../../utils/common/codeMsg";
import {
  wxLogin,
  getAccountList,
  wxBindLogin,
  chooseAccount,
} from '../../../api/user'
import dp2px from '../../../utils/common/dp2px';
import { throttle } from '../../../utils/common/utils'
import Toast from 'react-native-root-toast'
import MD5 from "react-native-md5";
import * as WeChat from "react-native-wechat-lib";
import wxUtil from '../../../utils/common/wxUtil'
import { Modal, ModalContent } from 'react-native-modals';
import { useSelector, useDispatch } from 'react-redux'
import { getAccountInfo } from '../../../redux/reducers/userInfo'

export default function WxLogin({ props, confirmWxLogin }) {

  const [wxInfo, setWxInfo] = useState({})
  const [unionId, setUnionId] = useState('')

  const wxLoginOperate = () => {
    console.log(WeChat, 'WeChat')
    WeChat.isWXAppInstalled().then(res => {
      console.log(res, '是否安装微信')
      if (res) {
        wxUtil.WeChatLogin('wx7656a00115b2e874', '2a39514722a84685b61f28daba196bbd', (wxInfo) => {
          console.log('授权成功', wxInfo)
          setWxInfo({ ...wxInfo })
          checkBindStatus(wxInfo)
        }, (err) => {
          console.log('授权失败1', err)
          Toast.show('授权失败', {
            position: Toast.positions.CENTER,
            duration: 1000,
            textStyle: {
              fontSize: dp2px(12)
            },
          })
        })
      } else {
        Toast.show('请安装微信！', {
          position: Toast.positions.CENTER,
          duration: 1000,
          textStyle: {
            fontSize: dp2px(12)
          },
        })
      }
    })
  }

  // 检查绑定状态
  const checkBindStatus = (wxInfo) => {
    let params = {
      code: wxInfo.code,
    }
    // 微信授权状态 0-授权登录成功 1-未授权/授权超时 2-已授权但未绑定卧涛账号
    wxLogin(params).then(res => {
      setUnionId(res.data.unionId)
      if (res.data.status == CodeMsg.CODE_0) {
        // 授权登录成功时分两种情况
        fixAccountLogin(res.data.accountList, res.data.loginTemp)
      } else if (res.data.status == CodeMsg.CODE_2) {
        // 此时需要绑定卧涛账号
        toWxBind(res.data.unionId)
      }
    })
  }

  // 账户登录
  const fixAccountLogin = (accountList, loginTemp) => {
    // 微信只绑定了一个账户（账户没被禁用）时直接去登录
    if (accountList.length == 1 && accountList[0].isDisabled == 0) {
      confirmWxLogin(false, accountList, loginTemp)
    }
    // 微信只绑定了多个账户时选择登录
    if (accountList.length > 1) {
      confirmWxLogin(true, accountList, loginTemp)
    }
  }

  // 跳转到微信绑定页面
  const toWxBind = (unionId) => {
    let params = {
      unionId: unionId
    }
    props.navigation.navigate('WxBind', params)
  }

  return (
    <View style={styles.wxContain}>
      <Text style={styles.wxLang}></Text>
      <TouchableWithoutFeedback onPress={(e) => wxLoginOperate(e)} style={styles.wxIcon}>
        <View style={styles.wxIcon}>
          <Image style={styles.wxImage} source={require('../../../images/personal/register/icon-wechat.png')}></Image>
          <Text>微信登录</Text>
        </View>
      </TouchableWithoutFeedback>
      <Text style={styles.wxLang}></Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wxContain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wxImage: {
    width: dp2px(24),
    height: dp2px(24),
    marginRight: dp2px(8),
  },
  wxLang: {
    width: dp2px(86),
    height: dp2px(1),
    backgroundColor: '#DCDCDC'
  },
  wxIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: dp2px(10)
  },
})
