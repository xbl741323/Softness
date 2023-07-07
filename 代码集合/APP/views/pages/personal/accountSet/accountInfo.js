import React, { useState, useEffect, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, ScrollView, SafeAreaView, TouchableWithoutFeedback } from 'react-native'
import Storage from '../../../utils/common/storage'
import dp2px from '../../../utils/common/dp2px';
import * as envCofig from "../../../utils/envConfig"

export default function AccountInfo(props) {

  const [userInfo, setUserInfo] = useState(null)
  // 获取用户信息
  const getUserData = async () => {
    try {
      const value = await Storage.getItem('userInfo')
      if (value != null) {
        setUserInfo({ ...value })
        console.log(value, '账户设置用户信息')
      }
    } catch (e) {
      // error reading value
    }
  }

  // 统一跳转
  const toPath = (pathName) => {
    props.navigation.navigate(pathName)
  }

  useFocusEffect(
    React.useCallback(() => {
      getUserData()
    }, [])
  )

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={0}>
        <View style={styles.accountContain}>
          <View style={styles.comContain}>
            <Text style={styles.comLang}></Text>
            <Text style={styles.comTitle}>账号信息</Text>
          </View>
          {
            userInfo != null ? (
              <View style={styles.infoContain}>
                {/* 单位信息 */}
                <View>
                  <Text style={styles.infoLabel}>单位信息</Text>
                  <View style={styles.comItem}>
                    <Text style={styles.comItemText}>账号名：</Text>
                    <Text style={[styles.comItemVal, styles.pSty]}>{userInfo.username}</Text>
                  </View>
                  <View style={styles.comItem}>
                    <Text style={styles.comItemText}>账号密码：</Text>
                    <View style={styles.comRightContain}>
                      <Text style={[styles.comItemVal, styles.pSty]}>*********</Text>
                      <TouchableWithoutFeedback onPress={(e) => toPath('ModifyPwd', e)}>
                        <View style={styles.updatePwd}>
                          <Text style={styles.updatePwdText}>修改密码</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                </View>
                {/* 授权人信息 */}
                <View style={styles.secondContain}>
                  <View style={styles.avatarItem}>
                    <View>
                      <Text style={styles.infoLabel}>授权人信息</Text>
                      {
                        userInfo.status == 0 || userInfo.status == 1 || userInfo.status == 4 ? (
                          <Text style={styles.infoTip}>(授权账号可用于快捷登录)</Text>
                        ) : ''
                      }
                    </View>
                    {
                      userInfo.status == 2 || userInfo.status == 6 ? (
                        <TouchableWithoutFeedback onPress={(e) => toPath('ModifyAuthInfo', e)}>
                          <View>
                            <Text style={styles.infoVal}>修改授权人信息</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      ) : ''
                    }
                  </View>
                  <View style={styles.comItem}>
                    <Text style={styles.comItemText}>联系人：</Text>
                    <Text style={[styles.comItemVal, styles.pSty]}>{userInfo.personName}</Text>
                  </View>
                  <View style={styles.comItem}>
                    <Text style={styles.comItemText}>手机号授权：</Text>
                    <View style={styles.comRightContain}>
                      <Text style={[styles.comItemVal, styles.pSty]}>{userInfo.mobile}</Text>
                      {/* status:认证状态 0:未激活；1:未认证；2:审核通过；3:已提交待审核；4:审核不通过 */}
                      {
                        userInfo.status == 0 || userInfo.status == 1 || userInfo.status == 4 ? (
                          <TouchableWithoutFeedback onPress={(e) => toPath('ModifyPhone', e)}>
                            <View style={styles.updatePwd}>
                              <Text style={styles.updatePwdText}>修改手机号</Text>
                            </View>
                          </TouchableWithoutFeedback>
                        ) : ''
                      }
                    </View>
                  </View>
                  <View style={[styles.comItem, styles.noBorder]}>
                    <Text style={styles.comItemText}>微信授权：</Text>
                    <View style={styles.comRightContain}>
                      {
                        userInfo.avatar && userInfo.avatar != null && userInfo.avatar != '' ? (
                          <Image style={styles.wxIcon} source={{ uri: userInfo.avatar }}></Image>
                        ) : (
                          <Image style={styles.wxIcon} source={require('../../../images/personal/accountSet/icon-wx.png')}></Image>
                        )
                      }
                      <Text style={styles.wxItemVal}>{userInfo.nickname ? userInfo.nickname : ''}{userInfo.wxBindFlag ? '/解绑' : '去绑定'}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : ''
          }
        </View >
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  accountContain: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: dp2px(16),
  },
  comContain: {
    width: dp2px(350),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  comLang: {
    width: dp2px(4),
    height: dp2px(16),
    borderRadius: dp2px(2),
    backgroundColor: '#33A7FF'
  },
  comTitle: {
    color: '#333333',
    fontSize: dp2px(16),
    fontWeight: 'bold',
    marginLeft: dp2px(7)
  },
  infoContain: {
    width: dp2px(350),
    paddingHorizontal: dp2px(12),
    paddingVertical: dp2px(16),
    backgroundColor: '#ffffff',
    marginTop: dp2px(16),
    borderRadius: dp2px(10),
    paddingBottom: dp2px(10)
  },
  infoLabel: {
    color: '#333333',
    fontSize: dp2px(14),
    fontWeight: 'bold'
  },
  infoTip: {
    color: '#D9D9D9',
    fontSize: dp2px(12),
    marginTop: dp2px(2)
  },
  infoVal: {
    color: '#36A6FE',
    fontSize: dp2px(12)
  },
  avatarItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  userAvatar: {
    width: dp2px(66),
    height: dp2px(66),
    borderRadius: dp2px(66)
  },
  comItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#EAEBEF',
    borderBottomWidth: dp2px(1),
    paddingBottom: dp2px(8),
    marginTop: dp2px(20)
  },
  comItemText: {
    color: '#333333',
    fontSize: dp2px(14)
  },
  comItemVal: {
    color: '#333333',
    fontSize: dp2px(12),
    textAlign: 'right',
  },
  pSty: {
    color: '#D9D9D9'
  },
  comInput: {
    width: dp2px(200),
    textAlign: 'right',
    color: '#D9D9D9',
    fontSize: dp2px(12),
    paddingVertical: 0,
  },
  comIconPointer: {
    width: dp2px(12),
    height: dp2px(12),
    marginLeft: dp2px(4)
  },
  comRightContain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  secondContain: {
    marginTop: dp2px(30)
  },
  submitBtn: {
    width: dp2px(327),
    height: dp2px(38),
    backgroundColor: '#36a6fe',
    borderRadius: dp2px(19),
    lineHeight: dp2px(38),
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: dp2px(14),
    marginTop: dp2px(30)
  },
  wxIcon: {
    width: dp2px(16),
    height: dp2px(16),
    marginRight: dp2px(4)
  },
  wxItemVal: {
    color: '#36A6FE',
    fontSize: dp2px(12)
  },
  noBorder: {
    borderBottomWidth: 0
  },
  updatePwd: {
    backgroundColor: '#36A6FE',
    borderRadius: dp2px(10),
    paddingHorizontal: dp2px(8),
    paddingVertical: dp2px(2),
    marginLeft: dp2px(10),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  updatePwdText: {
    color: '#ffffff',
    fontSize: dp2px(12),
  }
})