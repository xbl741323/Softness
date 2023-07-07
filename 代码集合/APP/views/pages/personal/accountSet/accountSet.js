import React, { useState, useEffect, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, ScrollView, SafeAreaView, TouchableWithoutFeedback } from 'react-native'
import Storage from '../../../utils/common/storage'
import dp2px from '../../../utils/common/dp2px';
import * as envCofig from "../../../utils/envConfig"

export default function AccountSet(props) {

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

  // 跳转到账号信息页面
  const toAccountInfo = () => {
    props.navigation.navigate('AccountInfo')
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
            <Text style={styles.comTitle}>基本信息</Text>
          </View>
          {
            userInfo != null ? (
              <View style={styles.infoContain}>
                {/* 单位信息 */}
                <View>
                  <Text style={styles.infoLabel}>单位信息</Text>
                  <View style={styles.avatarItem}>
                    <Text style={styles.comItemText}>头像：</Text>
                    {
                      userInfo.diyLogoUrl && userInfo.diyLogoUrl != null && userInfo.diyLogoUrl != '' ?
                        (<Image style={styles.userAvatar} source={{ uri: envCofig.CDN_BASE_URL + userInfo.diyLogoUrl }}></Image>) :
                        (<Image style={styles.userAvatar} source={require('../../../images/personal/index/un-login.png')}></Image>)
                    }

                  </View>
                  <View style={styles.comItem}>
                    <Text style={styles.comItemText}>单位名称：</Text>
                    <TextInput value={userInfo.diyOrgName} style={styles.comInput} placeholder='请输入单位名称' placeholderTextColor={'#D9D9D9'}></TextInput>
                  </View>
                  <View style={styles.comItem}>
                    <Text style={styles.comItemText}>单位类型：</Text>
                    <View style={styles.comRightContain}>
                      <Text style={[styles.comItemVal, styles.pSty]}>{userInfo.diyOrgType ? userInfo.diyOrgType : '请选择单位类型'}</Text>
                      <Image style={styles.comIconPointer} source={require('../../../images/personal/accountSet/icon-right.png')}></Image>
                    </View>
                  </View>
                  <View style={styles.comItem}>
                    <Text style={styles.comItemText}>行业类型：</Text>
                    <View style={styles.comRightContain}>
                      <Text style={[styles.comItemVal, styles.pSty]}>{userInfo.diyIndustry ? userInfo.diyIndustry : '请选择行业类型'}</Text>
                      <Image style={styles.comIconPointer} source={require('../../../images/personal/accountSet/icon-right.png')}></Image>
                    </View>
                  </View>
                  <View style={styles.comItem}>
                    <Text style={styles.comItemText}>所在地：</Text>
                    <View style={styles.comRightContain}>
                      <Text style={[styles.comItemVal, styles.pSty]}>{userInfo.diyOrgAddress ? userInfo.diyOrgAddress : '请选择所在地'}</Text>
                      <Image style={styles.comIconPointer} source={require('../../../images/personal/accountSet/icon-right.png')}></Image>
                    </View>
                  </View>
                </View>
                {/* 授权人信息 */}
                <View style={styles.secondContain}>
                  <View style={styles.avatarItem}>
                    <Text style={styles.infoLabel}>授权人信息</Text>
                    <TouchableWithoutFeedback onPress={(e) => toAccountInfo(e)}>
                      <View>
                        <Text style={styles.infoVal}>账号信息</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  <View style={styles.comItem}>
                    <Text style={styles.comItemText}>联系人：</Text>
                    <Text style={[styles.comItemVal, styles.pSty]}>{userInfo.personName}</Text>
                  </View>
                  <View style={styles.comItem}>
                    <Text style={styles.comItemText}>手机号：</Text>
                    <Text style={[styles.comItemVal, styles.pSty]}>{userInfo.mobile}</Text>
                  </View>
                  <View style={styles.comItem}>
                    <Text style={styles.comItemText}>职务：</Text>
                    <Text style={[styles.comItemVal, styles.pSty]}>{userInfo.job}</Text>
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
                <TouchableWithoutFeedback>
                  <View style={styles.submitBtn}>
                    <Text style={styles.submitBtnText}>提交信息</Text>
                  </View>
                </TouchableWithoutFeedback>
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
    paddingBottom: dp2px(20)
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
    paddingBottom: dp2px(30)
  },
  infoLabel: {
    color: '#333333',
    fontSize: dp2px(14),
    fontWeight: 'bold'
  },
  infoVal: {
    color: '#36A6FE',
    fontSize: dp2px(12)
  },
  avatarItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    width: dp2px(200),
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
    marginTop: dp2px(30),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: dp2px(14),
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
  }
})