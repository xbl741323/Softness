import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Dimensions, Text, View, Image, ImageBackground, TouchableWithoutFeedback } from 'react-native'
import dp2px from '../../utils/common/dp2px';
import Storage from '../../utils/common/storage'
import * as envCofig from "../../utils/envConfig"
import ComStatusBar from '../../components/common/comStatusBar';
import { useSelector, useDispatch } from 'react-redux'

export default function Personal({ navigation }) {
  const dispatch = useDispatch()
  const [isLogin, setIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [courseList, setCourseList] = useState([])
  const [orderTabList, setOrderTabList] = useState([
    {
      url: require('../../images/personal/index/icon-one.png'),
      num: 0,
      title: '全部订单'
    },
    {
      url: require('../../images/personal/index/icon-two.png'),
      num: 3,
      title: '待付款'
    },
    {
      url: require('../../images/personal/index/icon-three.png'),
      num: 3,
      title: '服务中'
    },
    {
      url: require('../../images/personal/index/icon-four.png'),
      num: 0,
      title: '待签约'
    },
    {
      url: require('../../images/personal/index/icon-five.png'),
      num: 0,
      title: '退款/售后'
    },
  ])
  const [toolList, setToolList] = useState([
    {
      url: require('../../images/personal/index/tools-one.png'),
      pathName: '',
      title: '身份认证'
    },
    {
      url: require('../../images/personal/index/tools-two.png'),
      pathName: '',
      title: '课堂会员'
    },
    {
      url: require('../../images/personal/index/tools-three.png'),
      pathName: '',
      title: '我的收藏'
    },
    {
      url: require('../../images/personal/index/tools-four.png'),
      pathName: '',
      title: '我的足迹'
    },
    {
      url: require('../../images/personal/index/tools-five.png'),
      pathName: '',
      title: '我的客服'
    },
    {
      url: require('../../images/personal/index/tools-six.png'),
      pathName: 'Setting',
      title: '设置'
    },
  ])

  // 跳转到登录页面
  const toLogin = () => {
    navigation.navigate('Login')
  }

  // 跳转到账户设置页面
  const toAccountSet = () => {
    // navigation.navigate('AccountSet')
  }

  // 获取登录状态
  const getLoginStatus = async () => {
    try {
      const value = await Storage.getItem('isLogin')
      if (value != null) {
        setIsLogin(value)
      } else {
        setIsLogin(false)
      }
    } catch (e) {
      // error reading value
    }
  }

  // 获取用户信息
  const getUserData = async () => {
    try {
      const value = await Storage.getItem('userInfo')
      if (value != null) {
        setUserInfo({ ...value })
        console.log(value, '用户信息')
      } else {
        setUserInfo(null)
      }
    } catch (e) {
      // error reading value
    }
  }

  // 统一跳转
  const toPath = (pathName) => {
    if (isLogin) {
      if (pathName != ''&&pathName=='Setting') {
        navigation.navigate(pathName)
      }
    } else {
      navigation.navigate('Login')
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getLoginStatus()
      getUserData()
    }, [])
  )

  return (
    <View>
      <ComStatusBar />
      <View style={styles.contain}>
        {/* 用户信息 */}
        {
          isLogin && userInfo != null ? (
            <ImageBackground
              style={styles.headerBg}
              source={require('../../images/personal/index/bg.png')}>
              <Image style={styles.kefuSty} source={require('../../images/personal/index/kefu-icon.png')}></Image>
              <View style={styles.headerInfo}>
                <View style={styles.headerInfoTop}>
                  <View style={styles.headerInfoTop}>
                    {
                      userInfo.diyLogoUrl && userInfo.diyLogoUrl != null && userInfo.diyLogoUrl != '' ?
                        (<Image style={styles.avatarSty} source={{ uri: envCofig.CDN_BASE_URL + userInfo.diyLogoUrl }}></Image>) :
                        (<Image style={styles.avatarSty} source={require('../../images/personal/index/un-login.png')}></Image>)
                    }
                    <View style={styles.accountInfo}>
                      <Text style={styles.userNameText}>用户{userInfo.username}</Text>
                      <Text style={styles.userAccountText}>登录账号：{userInfo.mobile}</Text>
                    </View>
                  </View>
                  <TouchableWithoutFeedback onPress={(e) => toAccountSet(e)}>
                    <View style={styles.pointerContain}>
                      <Text style={styles.pointerText}>去完善</Text>
                      <View style={styles.pointerRight}></View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <Text style={styles.headerBorder}></Text>
                <View style={styles.headerInfoBottom}>
                  {
                    orderTabList.map((item, index) => {
                      return (
                        <View key={index} style={styles.orderItemContain}>
                          <Image style={styles.orderIcon} source={item.url}></Image>
                          <Text style={styles.orderIconTitle}>{item.title}</Text>
                        </View>
                      )
                    })
                  }
                </View>
              </View>
            </ImageBackground>
          ) : (
            <View style={styles.unLoginContain}>
              <View style={styles.unLoginInfo}>
                <Image style={styles.unLoginAvatar} source={require('../../images/personal/index/un-login.png')}></Image>
                <TouchableWithoutFeedback onPress={(e) => toLogin(e)}>
                  <View>
                    <Text style={styles.unLoginText}>登录/注册</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          )
        }

        {/* 课程学习 */}
        {
          courseList.length > 0 ? (
            <View style={styles.classRecords}>
              <View>
                <Text style={styles.classRecordsTitle}>课程学习</Text>
              </View>
            </View>
          ) : ''
        }

        {/* 常用功能 */}
        <View style={styles.toolsContain}>
          <Text style={styles.toolsContainTitle}>常用功能</Text>
          <View style={styles.toolsList}>
            {
              toolList.map((item, index) => {
                return (
                  <TouchableWithoutFeedback key={index} onPress={(e) => toPath(item.pathName, e)} style={styles.toolsItem}>
                    <View style={[styles.toolsItem, index == 3 ? styles.toolsItemRight : '']}>
                      <Image style={styles.toolsIcon} source={item.url}></Image>
                      <Text style={styles.toolsTitle}>{item.title}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )
              })
            }
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contain: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  // 用户信息
  headerBg: {
    width: Dimensions.get('window').width,
    height: dp2px(202),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: dp2px(50)
  },
  unLoginContain: {
    width: Dimensions.get('window').width,
    height: dp2px(180),
    marginBottom: dp2px(12),
    backgroundColor: '#36A6FE'
  },
  unLoginInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp2px(50),
    paddingHorizontal: dp2px(20)
  },
  unLoginAvatar: {
    width: dp2px(66),
    height: dp2px(66),
    borderRadius: dp2px(60),
  },
  unLoginText: {
    color: '#ffffff',
    fontSize: dp2px(16),
    marginLeft: dp2px(12)
  },
  kefuSty: {
    position: 'absolute',
    width: dp2px(24),
    height: dp2px(24),
    top: dp2px(10),
    right: dp2px(10)
  },
  headerInfo: {
    position: 'absolute',
    top: dp2px(55),
    width: dp2px(351),
    backgroundColor: '#ffffff',
    borderRadius: dp2px(10),
    paddingHorizontal: dp2px(15),
    paddingTop: dp2px(15),
    paddingBottom: dp2px(15)
  },
  headerInfoTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  accountInfo: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: dp2px(10)
  },
  userNameText: {
    color: '#333333',
    fontSize: dp2px(16),
    marginBottom: dp2px(2)
  },
  userAccountText: {
    color: '#333333',
    fontSize: dp2px(14)
  },
  headerBorder: {
    height: dp2px(1),
    backgroundColor: '#E4E4E4',
    marginTop: dp2px(20),
    marginBottom: dp2px(20)
  },
  avatarSty: {
    width: dp2px(66),
    height: dp2px(66),
    borderRadius: dp2px(66),
  },
  headerInfoBottom: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  pointerContain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  pointerText: {
    color: '#999999',
    fontSize: dp2px(14),
    marginRight: dp2px(2)
  },
  pointerRight: {
    width: dp2px(8),
    height: dp2px(8),
    borderTopWidth: dp2px(1),
    borderRightWidth: dp2px(1),
    borderColor: '#999999',
    transform: [
      {
        rotate: '45deg'
      }
    ]
  },
  orderItemContain: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  orderIcon: {
    width: dp2px(26),
    height: dp2px(26),
    marginBottom: dp2px(4)
  },
  orderIconTitle: {
    color: '#333333',
    fontSize: dp2px(12)
  },
  // 课程学习
  classRecords: {
    width: dp2px(351),
    backgroundColor: '#ffffff',
    padding: dp2px(12),
    borderRadius: dp2px(10),
    marginBottom: dp2px(12)
  },
  classRecordsTitle: {
    color: '#333333',
    fontSize: dp2px(14),
    fontWeight: 'bold',
    marginBottom: dp2px(12)
  },
  // 常用功能
  toolsContain: {
    width: dp2px(351),
    backgroundColor: '#ffffff',
    padding: dp2px(12),
    borderRadius: dp2px(10)
  },
  toolsContainTitle: {
    color: '#333333',
    fontSize: dp2px(14),
    fontWeight: 'bold',
    marginBottom: dp2px(12)
  },
  toolsList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  toolsItem: {
    width: dp2px(60),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: dp2px(0),
    marginBottom: dp2px(20),
    marginRight: dp2px(28)
  },
  toolsItemRight: {
    marginRight: 0
  },
  toolsIcon: {
    width: dp2px(26),
    height: dp2px(26),
    marginBottom: dp2px(6)
  },
  toolsTitle: {
    color: '#333333',
    fontSize: dp2px(12)
  },
})
