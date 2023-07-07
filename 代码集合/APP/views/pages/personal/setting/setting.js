import React, { useState, useEffect, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { Alert, StyleSheet, Text, View, Dimensions, Image, TextInput, ScrollView, SafeAreaView, TouchableWithoutFeedback } from 'react-native'
import dp2px from '../../../utils/common/dp2px';
import Storage from '../../../utils/common/storage'
import Toast from 'react-native-root-toast'
import { useSelector, useDispatch } from 'react-redux'
import { clearAccountInfo } from '../../../redux/reducers/userInfo'

export default function Setting(props) {
  const dispatch = useDispatch()
  const [userInfo, setUserInfo] = useState(null)
  const [navList, setNavList] = useState([
    {
      title: '基本信息',
      pointerText: '去完善',
      // pathName: 'AccountSet',
      pathName: ''
    },
    {
      title: '收件地址',
      pointerText: '',
      pathName: ''
    },
    {
      title: '实名认证',
      pointerText: '未认证',
      pathName: ''
    },
    {
      title: '账号信息',
      pointerText: '',
      // pathName: 'AccountInfo',
      pathName: ''
    },
  ])

  // 退出/清空用户信息
  const layoutConfirm = () => {
    Alert.alert(
      '提示',
      '确认退出？',
      [
        {
          text: '取消',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: '确认',
          onPress: () => {
            layout()
          }
        },
      ],
      { cancelable: true },
    )
  }

  const layout = () => {
    clearAccountData()
    Toast.show('退出成功！', {
      position: Toast.positions.CENTER,
      duration: 1000,
      textStyle: {
        fontSize: dp2px(12)
      },
    })
    props.navigation.navigate('Personal')
  }

  // 调用公共退出接口
  const clearAccountData = () => {
    dispatch(clearAccountInfo())
  }

  // 统一跳转
  const toPath = (pathName) => {
    if (pathName != '') {
      props.navigation.navigate(pathName)
    }
  }

  // 获取用户信息
  const getUserData = async () => {
    try {
      const value = await Storage.getItem('userInfo')
      if (value != null) {
        setUserInfo({ ...value })
        console.log(value, '用户信息')
      }
    } catch (e) {
      // error reading value
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getUserData()
    }, [])
  )

  return (
    <View style={styles.setContain}>
      {
        navList.map((item, index) => {
          return (
            <TouchableWithoutFeedback key={index} onPress={(e) => toPath(item.pathName, e)}>
              <View style={styles.setItem}>
                <Text style={styles.setItemTitle}>{item.title}</Text>
                <View style={styles.setRightContain}>
                  {
                    index == 2 ? (
                      <Text style={[styles.pointerText, index == 2 ? styles.activeColor : '']}>{userInfo != null && userInfo.status == 2 ? '已认证' : item.pointerText}</Text>
                    ) : (
                      <Text style={styles.pointerText}>{item.pointerText}</Text>
                    )
                  }
                  <Text style={styles.pointer}></Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )
        })
      }
      {/* 退出按钮 */}
      <TouchableWithoutFeedback onPress={(e) => layoutConfirm(e)}>
        <View style={styles.layoutContain}>
          <Text style={styles.layoutText}>退出登录</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  setContain: {
    backgroundColor: '#ffffff',
    padding: dp2px(24),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  setItem: {
    width: dp2px(327),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#EAEBEF',
    borderBottomWidth: dp2px(1),
    paddingBottom: dp2px(10),
    marginBottom: dp2px(25)
  },
  setItemTitle: {
    color: '#333333',
    fontSize: dp2px(14)
  },
  setRightContain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  activeColor: {
    color: '#36A6FE'
  },
  pointerText: {
    color: '#7B7B7B',
    fontSize: dp2px(12)
  },
  pointer: {
    width: dp2px(8),
    height: dp2px(8),
    marginLeft: dp2px(4),
    borderTopWidth: dp2px(1),
    borderRightWidth: dp2px(1),
    borderColor: '#7B7B7B',
    transform: [{
      rotate: '45deg'
    }]
  },
  // 退出按钮
  layoutContain: {
    marginTop: dp2px(14),
    width: dp2px(327),
    height: dp2px(38),
    borderRadius: dp2px(19),
    backgroundColor: '#36A6FE',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  layoutText: {
    color: '#ffffff',
    fontSize: dp2px(14),
  }
})